#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import { Command } from "commander";
import { initRepoSite } from "./commands/init.js";
import { runAstroScript } from "./commands/astro.js";
import { logger } from "./logger.js";
import { startWorkbenchServer } from "./workbench/server.js";

export function createCli(): Command {
  const program = new Command();

  program
    .name("reposite")
    .description("Generate an editable Astro product site and lightweight code wiki from a GitHub repository.")
    .version("0.1.0");

  program
    .command("init")
    .argument("<github-repo-url>", "GitHub repository URL or owner/repo shorthand")
    .option("-o, --output <dir>", "Output directory for the generated Astro project")
    .action(async (githubRepoUrl: string, options: { readonly output?: string }) => {
      const result = await initRepoSite(githubRepoUrl, { outputDir: options.output });
      logger.info(`Generated RepoSite for ${result.fullName}`);
      logger.info(`Output: ${result.outputDir}`);
      logger.info("Next: cd into the output directory, run npm install, then npm run dev.");
    });

  program
    .command("web")
    .description("Run the local RepoSite workbench UI.")
    .option("--host <host>", "Host for the local workbench", "127.0.0.1")
    .option("-p, --port <port>", "Port for the local workbench", "4177")
    .action(async (options: { readonly host: string; readonly port: string }) => {
      const port = Number.parseInt(options.port, 10);
      if (Number.isNaN(port)) {
        throw new Error("Port must be a number.");
      }
      const server = await startWorkbenchServer({ host: options.host, port });
      logger.info(`RepoSite workbench: ${server.url}`);
      logger.info("Press Ctrl-C to stop.");
    });

  program
    .command("dev")
    .description("Run Astro dev in the current generated site directory.")
    .action(async () => {
      await runAstroScript("dev");
    });

  program
    .command("build")
    .description("Build the current generated site directory.")
    .action(async () => {
      await runAstroScript("build");
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
