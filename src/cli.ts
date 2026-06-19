#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import { Command } from "commander";
import { initRepoSite } from "./commands/init.js";
import { logger } from "./logger.js";
import { startWorkbenchServer } from "./workbench/server.js";
import type { PresentationChapterKind, PresentationMode, PresentationTheme } from "./types.js";

const presentationModes = ["auto", "visual-showcase", "developer-deck", "architecture-map", "compact-story"] as const;
const presentationThemes = ["auto", "signal-dark", "editorial-light", "blueprint"] as const;
const chapterKinds = [
  "features",
  "visuals",
  "usage",
  "readme-insights",
  "technology",
  "architecture",
  "resources"
] as const satisfies readonly PresentationChapterKind[];

const chapterKindSet = new Set<string>(chapterKinds);

function parseChapterKinds(value: string): PresentationChapterKind[] {
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const invalid = items.filter((item) => !chapterKindSet.has(item));
  if (invalid.length > 0) {
    throw new Error(`Unknown chapter kinds: ${invalid.join(", ")}. Allowed: ${chapterKinds.join(", ")}`);
  }
  return items as PresentationChapterKind[];
}

export function createCli(): Command {
  const program = new Command();

  program
    .name("reposite")
    .description("Generate a portable static presentation and lightweight code wiki from a GitHub repository.")
    .version("0.1.0");

  program
    .command("init")
    .argument("<github-repo-url>", "GitHub repository URL or owner/repo shorthand")
    .option("-o, --output <dir>", "Output directory for the generated static presentation")
    .option("--ai", "Use OpenAI to arrange evidence-backed presentation structure", false)
    .option("--mode <mode>", `Presentation mode (${presentationModes.join(", ")})`)
    .option("--theme <theme>", `Presentation theme (${presentationThemes.join(", ")})`)
    .option("--chapters <kinds>", `Comma-separated chapter kinds (${chapterKinds.join(", ")})`)
    .option("--token <token>", "GitHub token (falls back to GITHUB_TOKEN)")
    .action(
      async (
        githubRepoUrl: string,
        options: {
          readonly output?: string;
          readonly ai?: boolean;
          readonly mode?: string;
          readonly theme?: string;
          readonly chapters?: string;
          readonly token?: string;
        }
      ) => {
        if (options.mode && !presentationModes.includes(options.mode as (typeof presentationModes)[number])) {
          throw new Error(`Unknown mode "${options.mode}". Allowed: ${presentationModes.join(", ")}`);
        }
        if (options.theme && !presentationThemes.includes(options.theme as (typeof presentationThemes)[number])) {
          throw new Error(`Unknown theme "${options.theme}". Allowed: ${presentationThemes.join(", ")}`);
        }

        const generationOptions = {
          ...(options.mode ? { mode: options.mode as PresentationMode | "auto" } : {}),
          ...(options.theme ? { theme: options.theme as PresentationTheme | "auto" } : {}),
          ...(options.chapters ? { enabledChapters: parseChapterKinds(options.chapters) } : {})
        };

        const result = await initRepoSite(githubRepoUrl, {
          outputDir: options.output,
          ai: options.ai,
          token: options.token,
          generationOptions: Object.keys(generationOptions).length > 0 ? generationOptions : undefined
        });
        logger.info(`Generated SilentForge site for ${result.fullName}`);
        logger.info(`Output: ${result.outputDir}`);
        logger.info("Next: open index.html or deploy the directory to any static host.");
      }
    );

  program
    .command("web")
    .description("Run the local SilentForge workbench UI.")
    .option("--host <host>", "Host for the local workbench", "127.0.0.1")
    .option("-p, --port <port>", "Port for the local workbench", "4177")
    .action(async (options: { readonly host: string; readonly port: string }) => {
      const port = Number.parseInt(options.port, 10);
      if (Number.isNaN(port)) {
        throw new Error("Port must be a number.");
      }
      const server = await startWorkbenchServer({ host: options.host, port });
      logger.info(`SilentForge workbench: ${server.url}`);
      logger.info("Press Ctrl-C to stop.");
    });

  return program;
}

async function main(): Promise<void> {
  try {
    await createCli().parseAsync(process.argv);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error(message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
