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

export type CodeKnowledgeBase = {
  readonly projectStructure: readonly string[];
  readonly techStack: readonly string[];
  readonly entryFiles: readonly string[];
  readonly configFiles: readonly ConfigFileSummary[];
  readonly moduleMap: readonly ReadmeSection[];
  readonly mermaid: string;
};

export type SiteModel = {
  readonly repository: RepositoryMetadata;
  readonly readme: ParsedReadme;
  readonly releases: readonly RepositoryRelease[];
  readonly screenshots: readonly ReadmeImage[];
  readonly knowledgeBase: CodeKnowledgeBase;
  readonly generatedAt: string;
};
