import type { ReadmeImage, RepositorySnapshot, SiteModel } from "../types.js";
import { analyzeCodebase } from "../analyzer/codebase.js";
import { parseReadme } from "../readme/parser.js";

const screenshotPathPattern = /(^|\/)(screenshots?|images?|assets?)\/.*\.(png|jpe?g|gif|webp)$/i;

export function createSiteModel(snapshot: RepositorySnapshot, generatedAt = new Date()): SiteModel {
  const readme = parseReadme(snapshot.readme);
  const repositoryScreenshots = snapshot.files
    .filter((file) => file.type === "blob" && screenshotPathPattern.test(file.path))
    .map((file): ReadmeImage => ({
      alt: file.path.split("/").at(-1) ?? file.path,
      src: `${snapshot.metadata.htmlUrl}/raw/${snapshot.metadata.defaultBranch}/${file.path}`
    }));

  const screenshots = mergeScreenshots(readme.screenshots, repositoryScreenshots);

  return {
    repository: snapshot.metadata,
    readme,
    releases: snapshot.releases,
    screenshots,
    knowledgeBase: analyzeCodebase(snapshot.files),
    generatedAt: generatedAt.toISOString()
  };
}

function mergeScreenshots(
  readmeScreenshots: readonly ReadmeImage[],
  repositoryScreenshots: readonly ReadmeImage[]
): readonly ReadmeImage[] {
  const keyed = new Map([...readmeScreenshots, ...repositoryScreenshots].map((image) => [image.src, image]));
  return [...keyed.values()];
}
