import { resolve } from "node:path";
import { fetchRepositorySnapshot } from "../github/client.js";
import { createSiteModel } from "../site/model.js";
import { createPresentationPlan } from "../presentation/ai.js";
import { generateStaticSite } from "../site/generator.js";
import { parseGitHubRepoUrl } from "../github/url.js";

import type { PresentationGenerationOptions } from "../types.js";
import { resolveGenerationLocale, t } from "../i18n/index.js";

export type InitOptions = {
  readonly outputDir?: string;
  readonly token?: string;
  readonly cwd?: string;
  readonly ai?: boolean;
  readonly generationOptions?: PresentationGenerationOptions;
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
  const locale = resolveGenerationLocale(options.generationOptions);
  const model = createSiteModel(snapshot, new Date(), locale);
  const presentationPlan = await createPresentationPlan(model, {
    useAi: options.ai,
    generationOptions: options.generationOptions
  });

  await generateStaticSite(model, outputDir, { presentationPlan });

  return {
    outputDir,
    fullName: snapshot.metadata.fullName
  };
}
