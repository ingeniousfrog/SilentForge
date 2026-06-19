export type GitHubRepositoryUrl = {
  readonly owner: string;
  readonly repo: string;
  readonly normalizedUrl: string;
};

export type RepositoryFile = {
  readonly path: string;
  readonly type: "blob" | "tree";
  readonly size?: number;
  readonly url?: string;
};

export type RepositoryRelease = {
  readonly name: string;
  readonly tagName: string;
  readonly url: string;
  readonly publishedAt?: string;
  readonly body?: string;
};

export type RepositoryLicense = {
  readonly name: string;
  readonly spdxId?: string;
  readonly url?: string;
};

export type RepositoryMetadata = {
  readonly owner: string;
  readonly name: string;
  readonly fullName: string;
  readonly description?: string;
  readonly htmlUrl: string;
  readonly homepage?: string;
  readonly defaultBranch: string;
  readonly stars: number;
  readonly topics: readonly string[];
  readonly language?: string;
  readonly license?: RepositoryLicense;
};

export type RepositorySnapshot = {
  readonly metadata: RepositoryMetadata;
  readonly readme: string;
  readonly releases: readonly RepositoryRelease[];
  readonly files: readonly RepositoryFile[];
  readonly configFiles: readonly RepositoryFile[];
};

export type ReadmeSection = {
  readonly heading: string;
  readonly content: string;
};

export type ReadmeLink = {
  readonly label: string;
  readonly href: string;
};

export type ReadmeImage = {
  readonly alt: string;
  readonly src: string;
};

export type ParsedReadme = {
  readonly title?: string;
  readonly summary?: string;
  readonly features: readonly string[];
  readonly installation?: string;
  readonly usage?: string;
  readonly faq: readonly ReadmeSection[];
  readonly screenshots: readonly ReadmeImage[];
  readonly links: readonly ReadmeLink[];
  readonly sections: readonly ReadmeSection[];
};

export type ConfigFileSummary = {
  readonly path: string;
  readonly purpose: string;
};

export type FileTypeSummary = {
  readonly label: string;
  readonly count: number;
};

export type DirectorySummary = {
  readonly path: string;
  readonly fileCount: number;
  readonly configCount: number;
  readonly entryCount: number;
  readonly summary: string;
};

export type ReadmeCoverage = {
  readonly hasTitle: boolean;
  readonly hasSummary: boolean;
  readonly featureCount: number;
  readonly hasInstallation: boolean;
  readonly hasUsage: boolean;
  readonly faqCount: number;
  readonly screenshotCount: number;
  readonly sectionCount: number;
};

export type DetectionSignal = {
  readonly label: string;
  readonly value: string;
  readonly confidence: "high" | "medium" | "low";
  readonly source: string;
};

export type CodeKnowledgeBase = {
  readonly projectStructure: readonly string[];
  readonly techStack: readonly string[];
  readonly entryFiles: readonly string[];
  readonly configFiles: readonly ConfigFileSummary[];
  readonly fileTypeDistribution: readonly FileTypeSummary[];
  readonly directorySummaries: readonly DirectorySummary[];
  readonly readmeCoverage: ReadmeCoverage;
  readonly detectionSignals: readonly DetectionSignal[];
  readonly moduleMap: readonly ReadmeSection[];
  readonly mermaid: string;
};

export type SiteModel = {
  readonly repository: RepositoryMetadata;
  readonly readme: ParsedReadme;
  readonly releases: readonly RepositoryRelease[];
  readonly screenshots: readonly ReadmeImage[];
  readonly knowledgeBase: CodeKnowledgeBase;
  readonly profile: ProjectProfile;
  readonly diagnostics: RepositoryDiagnostics;
  readonly generatedAt: string;
};

export type PresentationMode = "visual-showcase" | "developer-deck" | "architecture-map" | "compact-story";

export type PresentationTheme = "signal-dark" | "editorial-light" | "blueprint";

export type PresentationChapterKind =
  | "hero"
  | "features"
  | "visuals"
  | "usage"
  | "readme-insights"
  | "technology"
  | "architecture"
  | "resources";

export type PresentationChapter = {
  readonly id: string;
  readonly kind: PresentationChapterKind;
  readonly title: string;
  readonly summary?: string;
  readonly sourceRefs: readonly string[];
  readonly verticalDetails: readonly string[];
};

export type PresentationDetailPage = {
  readonly id: "install" | "usage" | "architecture" | "releases" | "readme";
  readonly route: string;
  readonly title: string;
  readonly sourceRefs: readonly string[];
};

export type Locale = "en" | "zh";

export type PresentationPlan = {
  readonly mode: PresentationMode;
  readonly theme: PresentationTheme;
  readonly locale: Locale;
  readonly chapters: readonly PresentationChapter[];
  readonly detailPages: readonly PresentationDetailPage[];
  readonly plannedBy: "rules" | "openai";
};

export type PresentationGenerationOptions = {
  readonly mode?: PresentationMode | "auto";
  readonly theme?: PresentationTheme | "auto";
  readonly enabledChapters?: readonly PresentationChapterKind[];
  readonly locale?: Locale;
};

export type ProjectProfile = {
  readonly richnessScore: number;
  readonly hasVisualStory: boolean;
  readonly hasDeveloperJourney: boolean;
  readonly hasArchitectureDepth: boolean;
  readonly readmeInsightCount: number;
};

export type DiagnosticDimensionId = "readme" | "visuals" | "developerJourney" | "architecture" | "release";

export type DiagnosticDimension = {
  readonly id: DiagnosticDimensionId;
  readonly label: string;
  readonly score: number;
  readonly maxScore: number;
  readonly strengths: readonly string[];
  readonly gaps: readonly string[];
  readonly recommendations: readonly string[];
};

export type RepositoryDiagnostics = {
  readonly score: number;
  readonly maxScore: number;
  readonly grade: "ready" | "solid" | "needs-work";
  readonly strengths: readonly string[];
  readonly gaps: readonly string[];
  readonly recommendations: readonly string[];
  readonly dimensions: readonly DiagnosticDimension[];
};
