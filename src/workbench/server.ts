import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { extname, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import { parseGitHubRepoUrl } from "../github/url.js";
import { createZipFromDirectory } from "./archive.js";
import { runGenerationJob } from "./generator.js";
import { JobStore, toPublicJob } from "./jobStore.js";
import { createResourceView } from "./resources.js";
import { workbenchHtml } from "./ui.js";

export type WorkbenchServerOptions = {
  readonly host?: string;
  readonly port?: number;
};

export type WorkbenchServer = {
  readonly url: string;
  readonly close: () => Promise<void>;
};

const createJobSchema = z.object({
  repoUrl: z.string().trim().min(1).max(500),
  useAi: z.boolean().optional().default(false),
  generationOptions: z
    .object({
      mode: z.enum(["auto", "visual-showcase", "developer-deck", "architecture-map", "compact-story"]).optional(),
      theme: z.enum(["auto", "signal-dark", "editorial-light", "blueprint"]).optional(),
      enabledChapters: z
        .array(
          z.enum(["features", "visuals", "usage", "readme-insights", "technology", "architecture", "resources"])
        )
        .optional()
    })
    .optional()
});

export async function startWorkbenchServer(options: WorkbenchServerOptions = {}): Promise<WorkbenchServer> {
  const host = options.host ?? "127.0.0.1";
  const port = options.port ?? 4177;
  const store = new JobStore();
  const server = createServer((request, response) => {
    handleRequest(store, request, response).catch((error) => {
      writeJson(response, 500, {
        error: error instanceof Error ? error.message : "Unknown server error"
      });
    });
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve();
    });
  });

  return {
    url: `http://${host}:${port}/`,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      })
  };
}

async function handleRequest(store: JobStore, request: IncomingMessage, response: ServerResponse): Promise<void> {
  const url = new URL(request.url ?? "/", "http://localhost");

  if (request.method === "GET" && url.pathname === "/") {
    writeHtml(response, workbenchHtml());
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/jobs") {
    const parsedPayload = createJobSchema.safeParse(await readJsonBody(request));
    if (!parsedPayload.success) {
      writeJson(response, 400, { error: "A valid GitHub repository URL and optional AI flag are required." });
      return;
    }
    try {
      parseGitHubRepoUrl(parsedPayload.data.repoUrl);
    } catch {
      writeJson(response, 400, { error: "Enter a public github.com owner/repository URL or owner/repository shorthand." });
      return;
    }

    const job = await store.create(
      parsedPayload.data.repoUrl,
      parsedPayload.data.useAi,
      parsedPayload.data.generationOptions
    );
    queueMicrotask(() => {
      void runGenerationJob(store, job);
    });
    writeJson(response, 202, toPublicJob(job));
    return;
  }

  const jobMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)$/);
  if (request.method === "GET" && jobMatch) {
    const job = store.publicJob(jobMatch[1]);
    if (!job) {
      writeJson(response, 404, { error: "Job not found." });
      return;
    }
    writeJson(response, 200, job);
    return;
  }

  const eventsMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/events$/);
  if (request.method === "GET" && eventsMatch) {
    await writeEventStream(store, eventsMatch[1], response);
    return;
  }

  const resourcesMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/resources$/);
  if (request.method === "GET" && resourcesMatch) {
    const job = store.get(resourcesMatch[1]);
    if (!job?.snapshot || !job.model) {
      writeJson(response, 404, { error: "Resources are not ready." });
      return;
    }
    writeJson(response, 200, createResourceView(job.snapshot, job.model));
    return;
  }

  const downloadMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/download$/);
  if (request.method === "GET" && downloadMatch) {
    const job = store.get(downloadMatch[1]);
    if (!job || job.status !== "complete") {
      writeJson(response, 404, { error: "Generated site is not ready." });
      return;
    }
    const archive = await createZipFromDirectory(job.outputDir);
    response.writeHead(200, {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${safeFilename(job.model?.repository.name ?? "reposite")}-site.zip"`,
      "content-length": archive.length
    });
    response.end(archive);
    return;
  }

  const previewMatch = url.pathname.match(/^\/preview\/([^/]+)(\/.*)?$/);
  if (request.method === "GET" && previewMatch) {
    await servePreview(store, previewMatch[1], previewMatch[2] ?? "/", response);
    return;
  }

  writeJson(response, 404, { error: "Not found." });
}

async function writeEventStream(store: JobStore, id: string, response: ServerResponse): Promise<void> {
  const job = store.get(id);
  if (!job) {
    writeJson(response, 404, { error: "Job not found." });
    return;
  }

  response.writeHead(200, {
    "content-type": "text/event-stream",
    "cache-control": "no-cache",
    connection: "keep-alive"
  });

  let sent = 0;
  const writePending = () => {
    const current = store.get(id);
    if (!current) {
      return true;
    }

    current.events.slice(sent).forEach((event) => {
      response.write(`event: ${event.type}\n`);
      response.write(`data: ${JSON.stringify(event)}\n\n`);
    });
    sent = current.events.length;

    if (current.status === "complete" || current.status === "failed") {
      response.end();
      return true;
    }

    return false;
  };

  if (writePending()) {
    return;
  }

  const interval = setInterval(() => {
    if (writePending()) {
      clearInterval(interval);
    }
  }, 250);

  response.on("close", () => clearInterval(interval));
}

async function servePreview(
  store: JobStore,
  id: string,
  previewPath: string,
  response: ServerResponse
): Promise<void> {
  const job = store.get(id);
  if (!job || job.status !== "complete") {
    writeJson(response, 404, { error: "Preview is not ready." });
    return;
  }

  const filePath = resolvePreviewPath(job.outputDir, previewPath);
  if (!filePath) {
    writeJson(response, 400, { error: "Invalid preview path." });
    return;
  }
  const fileStat = await stat(filePath).catch(() => undefined);
  if (!fileStat?.isFile()) {
    writeJson(response, 404, { error: "Preview file not found." });
    return;
  }

  response.writeHead(200, {
    "content-type": contentType(filePath),
    "x-content-type-options": "nosniff",
    "content-security-policy":
      "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'self'; base-uri 'none'; object-src 'none'"
  });
  createReadStream(filePath).pipe(response);
}

export function resolvePreviewPath(outputDir: string, previewPath: string): string | undefined {
  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(previewPath);
  } catch {
    return undefined;
  }
  const requestedPath = decodedPath === "/" || decodedPath === "" ? "index.html" : decodedPath.replace(/^\/+/, "");
  const candidate = resolve(outputDir, requestedPath);
  const pathFromRoot = relative(resolve(outputDir), candidate);
  if (pathFromRoot === ".." || pathFromRoot.startsWith(`..${sep}`) || pathFromRoot.startsWith(sep)) {
    return undefined;
  }
  return candidate;
}

async function readJsonBody(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  let exceededLimit = false;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;
    if (totalBytes > 16_384) {
      exceededLimit = true;
      continue;
    }
    chunks.push(buffer);
  }

  if (chunks.length === 0 || exceededLimit) {
    return {};
  }

  const body = Buffer.concat(chunks);
  try {
    return JSON.parse(body.toString("utf8")) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function writeHtml(response: ServerResponse, html: string): void {
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(html);
}

function writeJson(response: ServerResponse, status: number, payload: unknown): void {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(`${JSON.stringify(payload)}\n`);
}

function contentType(path: string): string {
  return (
    {
      ".json": "application/json; charset=utf-8",
      ".md": "text/markdown; charset=utf-8",
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "text/javascript; charset=utf-8"
    }[extname(path)] ?? "application/octet-stream"
  );
}

function safeFilename(value: string): string {
  return value.replace(/[^A-Za-z0-9_.-]/g, "-");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = await startWorkbenchServer();
  process.stdout.write(`RepoSite workbench: ${server.url}\n`);
}
