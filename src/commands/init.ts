import { resolve } from "node:path";
import { fetchRepositorySnapshot } from "../github/client.js";
import { createSiteModel } from "../site/model.js";
import { generateAstroSite } from "../site/generator.js";
import { parseGitHubRepoUrl } from "../github/url.js";

export type InitOptions = {
  readonly outputDir?: string;
  readonly token?: string;
  readonly cwd?: string;
};

export type InitResult = {
  readonly outputDir: string;
  readonly fullName: string;
};

export async function initRepoSite(githubRepoUrl: string, options: InitOptions = {}): Promise<InitResult> {
  const parsed = parseGitHubRepoUrl(githubRepoUrl);
  const cwd = options.cwd ?? process.cwd();
  const outputDir = resolve(cwd, options.outputDir ?? `${parsed.repo}-site`);
  const snapshot = await fetchRepositorySnapshot(githubRepoUrl, {
    token: options.token ?? process.env.GITHUB_TOKEN
  });
  const model = createSiteModel(snapshot);

  await generateAstroSite(model, outputDir);

  return {
    outputDir,
    fullName: snapshot.metadata.fullName
  };
}
