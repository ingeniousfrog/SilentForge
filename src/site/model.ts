import type { ReadmeImage, RepositorySnapshot, SiteModel } from "../types.js";
import { analyzeCodebase } from "../analyzer/codebase.js";
import { parseReadme } from "../readme/parser.js";
import { selectReadmeInsights } from "../presentation/readme.js";
import { evaluateRepositoryDiagnostics } from "./diagnostics.js";

const screenshotPathPattern = /(^|\/)(screenshots?|images?|assets?)\/.*\.(png|jpe?g|gif|webp)$/i;

export function createSiteModel(snapshot: RepositorySnapshot, generatedAt = new Date()): SiteModel {
  const parsedReadme = parseReadme(snapshot.readme);
  const readme = {
    ...parsedReadme,
    screenshots: parsedReadme.screenshots
      .filter(isPresentationImage)
      .map((image) => ({
        ...image,
        src: resolveRepositoryAsset(snapshot, image.src)
      }))
  };
  const repositoryScreenshots = snapshot.files
    .filter((file) => file.type === "blob" && screenshotPathPattern.test(file.path))
    .map((file): ReadmeImage => ({
      alt: file.path.split("/").at(-1) ?? file.path,
      src: resolveRepositoryAsset(snapshot, file.path)
    }));

  const screenshots = mergeScreenshots(readme.screenshots, repositoryScreenshots);

  const model = {
    repository: snapshot.metadata,
    readme,
    releases: snapshot.releases,
    screenshots,
    knowledgeBase: analyzeCodebase(snapshot.files, readme),
    profile: createProjectProfile(snapshot, readme, screenshots.length),
    generatedAt: generatedAt.toISOString()
  };

  return {
    ...model,
    diagnostics: evaluateRepositoryDiagnostics(model)
  };
}

function isPresentationImage(image: ReadmeImage): boolean {
  const signal = `${image.alt} ${image.src}`.toLowerCase();
  return !/(shields\.io|badge\.svg|\b(build|ci|coverage|license|version)\b)/.test(signal);
}

function resolveRepositoryAsset(snapshot: RepositorySnapshot, source: string): string {
  try {
    const url = new URL(source);
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {
    // Relative README assets are resolved against the repository's raw default branch.
  }
  const path = source.replace(/^\.?\//, "");
  return `https://raw.githubusercontent.com/${snapshot.metadata.owner}/${snapshot.metadata.name}/${snapshot.metadata.defaultBranch}/${path}`;
}

function createProjectProfile(
  snapshot: RepositorySnapshot,
  readme: ReturnType<typeof parseReadme>,
  screenshotCount: number
): SiteModel["profile"] {
  const architectureSignals = snapshot.files.filter((file) => file.type === "blob").length;
  const richnessScore = [
    Boolean(readme.title),
    Boolean(readme.summary),
    readme.features.length > 0,
    Boolean(readme.installation),
    Boolean(readme.usage),
    screenshotCount > 0,
    snapshot.releases.length > 0,
    architectureSignals >= 40,
    snapshot.metadata.topics.length > 0
  ].filter(Boolean).length;
  return {
    richnessScore,
    hasVisualStory: screenshotCount > 0 || Boolean(snapshot.metadata.homepage),
    hasDeveloperJourney: Boolean(readme.installation && readme.usage),
    hasArchitectureDepth: architectureSignals >= 40,
    readmeInsightCount: selectReadmeInsights(readme.sections, readme.title, 8).length
  };
}

function mergeScreenshots(
  readmeScreenshots: readonly ReadmeImage[],
  repositoryScreenshots: readonly ReadmeImage[]
): readonly ReadmeImage[] {
  const keyed = new Map([...readmeScreenshots, ...repositoryScreenshots].map((image) => [image.src, image]));
  return [...keyed.values()];
}
