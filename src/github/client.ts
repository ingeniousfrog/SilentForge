import { Buffer } from "node:buffer";
import { z } from "zod";
import type {
  RepositoryFile,
  RepositoryLicense,
  RepositoryMetadata,
  RepositoryRelease,
  RepositorySnapshot
} from "../types.js";
import { parseGitHubRepoUrl } from "./url.js";

const repoSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  html_url: z.string().url(),
  homepage: z.string().nullable(),
  default_branch: z.string(),
  stargazers_count: z.number(),
  topics: z.array(z.string()).optional().default([]),
  language: z.string().nullable(),
  license: z
    .object({
      name: z.string(),
      spdx_id: z.string().nullable(),
      url: z.string().nullable()
    })
    .nullable()
});

const readmeSchema = z.object({
  content: z.string(),
  encoding: z.string()
});

const releaseSchema = z.object({
  name: z.string().nullable(),
  tag_name: z.string(),
  html_url: z.string().url(),
  published_at: z.string().nullable(),
  body: z.string().nullable()
});

const treeSchema = z.object({
  tree: z.array(
    z.object({
      path: z.string(),
      type: z.enum(["blob", "tree"]),
      size: z.number().optional(),
      url: z.string().optional()
    })
  )
});

export type GitHubClientOptions = {
  readonly token?: string;
  readonly fetchImpl?: typeof fetch;
};

export async function fetchRepositorySnapshot(
  githubRepoUrl: string,
  options: GitHubClientOptions = {}
): Promise<RepositorySnapshot> {
  const repoUrl = parseGitHubRepoUrl(githubRepoUrl);
  const fetchJson = createFetchJson(options);
  const [repo, readme, releases] = await Promise.all([
    fetchJson(`https://api.github.com/repos/${repoUrl.owner}/${repoUrl.repo}`),
    fetchJson(`https://api.github.com/repos/${repoUrl.owner}/${repoUrl.repo}/readme`),
    fetchJson(`https://api.github.com/repos/${repoUrl.owner}/${repoUrl.repo}/releases?per_page=10`)
  ]);

  const repoData = repoSchema.parse(repo);
  const metadata = toRepositoryMetadata(repoUrl.owner, repoData);
  const readmeData = readmeSchema.parse(readme);
  const files = await fetchRepositoryTree(fetchJson, repoUrl.owner, repoUrl.repo, metadata.defaultBranch);

  return {
    metadata,
    readme: decodeReadme(readmeData.content, readmeData.encoding),
    releases: z.array(releaseSchema).parse(releases).map(toRepositoryRelease),
    files,
    configFiles: files.filter(isCommonConfigFile)
  };
}

function formatGitHubError(status: number, url: string): string {
  if (status === 401) {
    return "GitHub rejected the personal access token (401). Clear the token field or provide a valid token.";
  }
  if (status === 403) {
    return "GitHub API rate limit or access denied (403). Add a personal access token in Workbench or set GITHUB_TOKEN, then retry.";
  }
  if (status === 404) {
    return "GitHub repository or resource not found (404). Check that the repository is public and the URL is correct.";
  }
  if (status === 429) {
    return "GitHub API rate limit exceeded (429). Wait a few minutes or add a personal access token, then retry.";
  }
  return `GitHub request failed (${status}) for ${url}`;
}

function createFetchJson(options: GitHubClientOptions): (url: string) => Promise<unknown> {
  const fetchImpl = options.fetchImpl ?? fetch;

  return async (url: string) => {
    const response = await fetchImpl(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "SilentForge",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
      }
    });

    if (!response.ok) {
      throw new Error(formatGitHubError(response.status, url));
    }

    return response.json();
  };
}

async function fetchRepositoryTree(
  fetchJson: (url: string) => Promise<unknown>,
  owner: string,
  repo: string,
  branch: string
): Promise<readonly RepositoryFile[]> {
  const payload = await fetchJson(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`
  );

  return treeSchema.parse(payload).tree.map((file) => ({
    path: file.path,
    type: file.type,
    size: file.size,
    url: file.url
  }));
}

function decodeReadme(content: string, encoding: string): string {
  if (encoding !== "base64") {
    throw new Error(`Unsupported README encoding: ${encoding}`);
  }

  return Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf8");
}

function toRepositoryMetadata(owner: string, repo: z.infer<typeof repoSchema>): RepositoryMetadata {
  const license = repo.license
    ? ({
        name: repo.license.name,
        spdxId: repo.license.spdx_id ?? undefined,
        url: repo.license.url ?? undefined
      } satisfies RepositoryLicense)
    : undefined;

  return {
    owner,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description ?? undefined,
    htmlUrl: repo.html_url,
    homepage: repo.homepage || undefined,
    defaultBranch: repo.default_branch,
    stars: repo.stargazers_count,
    topics: repo.topics,
    language: repo.language ?? undefined,
    license
  };
}

function toRepositoryRelease(release: z.infer<typeof releaseSchema>): RepositoryRelease {
  return {
    name: release.name ?? release.tag_name,
    tagName: release.tag_name,
    url: release.html_url,
    publishedAt: release.published_at ?? undefined,
    body: release.body ?? undefined
  };
}

function isCommonConfigFile(file: RepositoryFile): boolean {
  const path = file.path;
  const basename = path.split("/").at(-1) ?? path;

  return [
    "package.json",
    "astro.config.mjs",
    "astro.config.ts",
    "vite.config.ts",
    "vite.config.js",
    "tsconfig.json",
    "Cargo.toml",
    "go.mod",
    "pyproject.toml",
    "requirements.txt",
    "Dockerfile",
    "docker-compose.yml",
    "compose.yaml",
    ".env.example",
    ".gitignore"
  ].includes(basename);
}
