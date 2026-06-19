import type {
  PresentationChapter,
  PresentationChapterKind,
  PresentationDetailPage,
  PresentationGenerationOptions,
  PresentationPlan,
  PresentationTheme,
  SiteModel
} from "../types.js";
import { stripInlineMarkdown } from "../shared/markdown.js";
import { selectReadmeInsights } from "./readme.js";

const allowedSourceRefs = new Set([
  "repository",
  "repository.description",
  "repository.homepage",
  "repository.language",
  "repository.license",
  "repository.stars",
  "repository.topics",
  "readme.features",
  "readme.installation",
  "readme.links",
  "readme.sections",
  "readme.summary",
  "readme.usage",
  "releases",
  "screenshots",
  "knowledgeBase.configFiles",
  "knowledgeBase.directorySummaries",
  "knowledgeBase.entryFiles",
  "knowledgeBase.fileTypeDistribution",
  "knowledgeBase.mermaid",
  "knowledgeBase.moduleMap",
  "knowledgeBase.techStack"
]);

const maxChapterSummaryLength = 240;

export function buildPresentationPlan(
  model: SiteModel,
  generationOptions: PresentationGenerationOptions = {}
): PresentationPlan {
  const mode = selectMode(model, generationOptions);
  const theme = selectTheme(mode, generationOptions);
  const chapters = chapterCandidates(model)
    .filter((chapter) => chapter.available)
    .filter((chapter) => isChapterEnabled(chapter.kind, generationOptions))
    .slice(0, mode === "compact-story" ? 4 : 8)
    .map(({ available: _available, ...chapter }) => chapter);
  const details = detailPages(model, generationOptions);
  const detailIds = new Set(details.map((page) => page.id));

  return {
    mode,
    theme,
    chapters: chapters.map((chapter) => ({
      ...chapter,
      verticalDetails: chapter.verticalDetails.filter((id) => detailIds.has(id as PresentationDetailPage["id"]))
    })),
    detailPages: details,
    plannedBy: "rules"
  };
}

export function validatePresentationPlan(
  plan: PresentationPlan,
  model: SiteModel,
  generationOptions: PresentationGenerationOptions = {}
): PresentationPlan {
  validatePresentationPlanShape(plan, model);
  const constrainedPlan = constrainPresentationPlan(plan, model, generationOptions);
  validatePresentationPlanShape(constrainedPlan, model, generationOptions);

  return {
    ...constrainedPlan,
    chapters: constrainedPlan.chapters.map((chapter) => ({ ...chapter, sourceRefs: [...chapter.sourceRefs] })),
    detailPages: constrainedPlan.detailPages.map((page) => ({ ...page, sourceRefs: [...page.sourceRefs] }))
  };
}

function validatePresentationPlanShape(
  plan: PresentationPlan,
  model: SiteModel,
  generationOptions: PresentationGenerationOptions = {}
): void {
  if (plan.chapters.length === 0 || plan.chapters.length > 8) {
    throw new Error("Presentation plan must contain between 1 and 8 chapters.");
  }

  const chapterIds = new Set<string>();
  const availableKinds = new Set(
    chapterCandidates(model)
      .filter((chapter) => chapter.available)
      .map((chapter) => chapter.kind)
  );
  plan.chapters.forEach((chapter) => {
    if (!/^[a-z0-9-]+$/.test(chapter.id) || chapterIds.has(chapter.id)) {
      throw new Error(`Invalid or duplicate chapter id: ${chapter.id}`);
    }
    chapterIds.add(chapter.id);
    if (!availableKinds.has(chapter.kind)) {
      throw new Error(`Chapter kind has no repository content: ${chapter.kind}`);
    }
    validateText(chapter.title, 80, "chapter title");
    if (chapter.summary) {
      validateText(chapter.summary, 240, "chapter summary");
    }
    validateSourceRefs(chapter.sourceRefs);
  });

  const detailIds = new Set<string>();
  plan.detailPages.forEach((page) => {
    if (page.route !== `details/${page.id}.html` || detailIds.has(page.id)) {
      throw new Error(`Invalid detail route: ${page.route}`);
    }
    detailIds.add(page.id);
    validateSourceRefs(page.sourceRefs);
  });

  const availableDetails = new Set(detailPages(model, generationOptions).map((page) => page.id));
  if (plan.detailPages.some((page) => !availableDetails.has(page.id))) {
    throw new Error("Presentation plan references an unavailable detail page.");
  }
  if (plan.chapters.some((chapter) => chapter.verticalDetails.some((id) => !detailIds.has(id)))) {
    throw new Error("Presentation plan references an unavailable vertical detail.");
  }

}

function selectMode(model: SiteModel, generationOptions: PresentationGenerationOptions): PresentationPlan["mode"] {
  if (generationOptions.mode && generationOptions.mode !== "auto") {
    return generationOptions.mode;
  }
  if (model.profile.richnessScore < 4) {
    return "compact-story";
  }
  if (model.profile.hasVisualStory) {
    return "visual-showcase";
  }
  if (model.profile.hasDeveloperJourney) {
    return "developer-deck";
  }
  if (model.profile.hasArchitectureDepth) {
    return "architecture-map";
  }
  return "developer-deck";
}

function selectTheme(mode: PresentationPlan["mode"], generationOptions: PresentationGenerationOptions): PresentationTheme {
  if (generationOptions.theme && generationOptions.theme !== "auto") {
    return generationOptions.theme;
  }
  if (mode === "visual-showcase") return "editorial-light";
  if (mode === "architecture-map") return "blueprint";
  return "signal-dark";
}

type Candidate = PresentationChapter & { readonly available: boolean };

function chapterCandidates(model: SiteModel): readonly Candidate[] {
  const hasFeatures = model.readme.features.length > 0;
  const hasVisuals = model.screenshots.length > 0;
  const hasUsage = Boolean(model.readme.installation || model.readme.usage);
  const hasReadmeInsights = selectReadmeInsights(model.readme.sections, model.readme.title).length > 0;
  const hasTech = model.knowledgeBase.techStack.length > 0 || model.knowledgeBase.fileTypeDistribution.length > 0;
  const hasArchitecture = hasArchitectureContent(model);

  return [
    chapter("project", "hero", model.readme.title ?? model.repository.name, model.readme.summary ?? model.repository.description, [
      "repository",
      "readme.summary"
    ]),
    chapter("capabilities", "features", "What it brings", undefined, ["readme.features"], hasFeatures),
    chapter("showcase", "visuals", "See it in motion", undefined, ["screenshots"], hasVisuals),
    chapter(
      "quickstart",
      "usage",
      "From clone to first run",
      undefined,
      ["readme.installation", "readme.usage"],
      hasUsage,
      [model.readme.installation ? "install" : undefined, model.readme.usage ? "usage" : undefined].filter(
        (id): id is "install" | "usage" => Boolean(id)
      )
    ),
    chapter("readme-insights", "readme-insights", "Inside the project", undefined, ["readme.sections"], hasReadmeInsights, [
      "readme"
    ]),
    chapter("technology", "technology", "Built with", undefined, [
      "knowledgeBase.techStack",
      "knowledgeBase.fileTypeDistribution"
    ], hasTech),
    chapter("architecture", "architecture", "How the repository fits together", undefined, [
      "knowledgeBase.moduleMap",
      "knowledgeBase.directorySummaries",
      "knowledgeBase.entryFiles"
    ], hasArchitecture, ["architecture"]),
    chapter("resources", "resources", "Keep exploring", undefined, [
      "repository.homepage",
      "repository.topics",
      "releases",
      "readme.links"
    ])
  ];
}

function chapter(
  id: string,
  kind: PresentationChapterKind,
  title: string,
  summary: string | undefined,
  sourceRefs: readonly string[],
  available = true,
  verticalDetails: readonly string[] = []
): Candidate {
  return { id, kind, title, summary: normalizeSummary(summary), sourceRefs, verticalDetails, available };
}

function normalizeSummary(summary: string | undefined): string | undefined {
  if (!summary) return undefined;
  const normalized = stripInlineMarkdown(summary);
  if (normalized.length === 0) return undefined;
  if (normalized.length <= maxChapterSummaryLength) return normalized;
  return `${normalized.slice(0, maxChapterSummaryLength - 1).trimEnd()}…`;
}

function detailPages(
  model: SiteModel,
  generationOptions: PresentationGenerationOptions = {}
): readonly PresentationDetailPage[] {
  return [
    detail("install", "Installation", ["readme.installation"], Boolean(model.readme.installation)),
    detail("usage", "Usage", ["readme.usage"], Boolean(model.readme.usage)),
    detail(
      "architecture",
      "Architecture",
      ["knowledgeBase.moduleMap", "knowledgeBase.directorySummaries", "knowledgeBase.mermaid"],
      hasArchitectureContent(model)
    ),
    detail("releases", "Releases", ["releases"], model.releases.length > 0),
    detail("readme", "README sections", ["readme.sections"], model.readme.sections.length > 0)
  ]
    .filter((page): page is PresentationDetailPage => Boolean(page))
    .filter((page) => isDetailEnabled(page.id, generationOptions));
}

function constrainPresentationPlan(
  plan: PresentationPlan,
  model: SiteModel,
  generationOptions: PresentationGenerationOptions
): PresentationPlan {
  const mode = selectMode(model, generationOptions);
  const theme = selectTheme(mode, generationOptions);
  const detailIds = new Set(detailPages(model, generationOptions).map((page) => page.id));
  const chapters = plan.chapters
    .filter((chapter) => isChapterEnabled(chapter.kind, generationOptions))
    .map((chapter) => ({
      ...chapter,
      verticalDetails: chapter.verticalDetails.filter((id) => detailIds.has(id as PresentationDetailPage["id"]))
    }));

  return {
    ...plan,
    mode,
    theme,
    chapters,
    detailPages: plan.detailPages.filter((page) => detailIds.has(page.id))
  };
}

function isChapterEnabled(
  kind: PresentationChapterKind,
  generationOptions: PresentationGenerationOptions
): boolean {
  if (kind === "hero") return true;
  if (!generationOptions.enabledChapters) return true;
  return generationOptions.enabledChapters.includes(kind);
}

function isDetailEnabled(
  id: PresentationDetailPage["id"],
  generationOptions: PresentationGenerationOptions
): boolean {
  if (!generationOptions.enabledChapters) return true;
  return generationOptions.enabledChapters.some((kind) => detailChapterMap[id] === kind);
}

const detailChapterMap: Readonly<Record<PresentationDetailPage["id"], PresentationChapterKind>> = {
  install: "usage",
  usage: "usage",
  architecture: "architecture",
  releases: "resources",
  readme: "readme-insights"
};

function hasArchitectureContent(model: SiteModel): boolean {
  return (
    model.profile.hasArchitectureDepth ||
    model.knowledgeBase.moduleMap.length >= 2 ||
    model.knowledgeBase.directorySummaries.length >= 2 ||
    model.knowledgeBase.configFiles.length >= 3
  );
}

function detail(
  id: PresentationDetailPage["id"],
  title: string,
  sourceRefs: readonly string[],
  available: boolean
): PresentationDetailPage | undefined {
  return available ? { id, title, sourceRefs, route: `details/${id}.html` } : undefined;
}

function validateSourceRefs(sourceRefs: readonly string[]): void {
  sourceRefs.forEach((sourceRef) => {
    if (!allowedSourceRefs.has(sourceRef)) {
      throw new Error(`Unknown presentation source: ${sourceRef}`);
    }
  });
}

function validateText(value: string, maximum: number, label: string): void {
  if (value.trim().length === 0 || value.length > maximum || /<[^>]+>/.test(value)) {
    throw new Error(`Invalid ${label}.`);
  }
}
