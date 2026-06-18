import type {
  CodeKnowledgeBase,
  ConfigFileSummary,
  DetectionSignal,
  DirectorySummary,
  FileTypeSummary,
  ParsedReadme,
  ReadmeCoverage,
  ReadmeSection,
  RepositoryFile
} from "../types.js";

const configPurposes = new Map<string, string>([
  ["package.json", "Node.js package manifest and scripts"],
  ["astro.config.mjs", "Astro site configuration"],
  ["astro.config.ts", "Astro site configuration"],
  ["vite.config.ts", "Vite build and development configuration"],
  ["vite.config.js", "Vite build and development configuration"],
  ["tsconfig.json", "TypeScript compiler configuration"],
  ["pnpm-lock.yaml", "pnpm dependency lockfile"],
  ["package-lock.json", "npm dependency lockfile"],
  ["yarn.lock", "Yarn dependency lockfile"],
  ["Cargo.toml", "Rust package manifest"],
  ["go.mod", "Go module manifest"],
  ["pyproject.toml", "Python project manifest"],
  ["requirements.txt", "Python dependency list"],
  ["Dockerfile", "Container image definition"],
  ["docker-compose.yml", "Docker Compose service definition"],
  ["compose.yaml", "Docker Compose service definition"],
  [".github/workflows", "GitHub Actions workflow directory"],
  [".env.example", "Example environment variable file"],
  [".gitignore", "Git ignore rules"]
]);

const stackDetectors: readonly [string, readonly string[]][] = [
  ["Astro", ["astro.config.mjs", "astro.config.ts"]],
  ["TypeScript", ["tsconfig.json", ".ts", ".tsx"]],
  ["Node.js", ["package.json"]],
  ["React", [".tsx", "react"]],
  ["Vite", ["vite.config.ts", "vite.config.js"]],
  ["Python", ["pyproject.toml", "requirements.txt", ".py"]],
  ["Go", ["go.mod", ".go"]],
  ["Rust", ["Cargo.toml", ".rs"]],
  ["Docker", ["Dockerfile", "docker-compose.yml", "compose.yaml"]]
];

const entryFileCandidates = [
  "src/index.ts",
  "src/index.tsx",
  "src/main.ts",
  "src/main.tsx",
  "src/cli.ts",
  "src/app.ts",
  "src/server.ts",
  "index.js",
  "index.ts",
  "main.go",
  "cmd/main.go",
  "src/main.rs",
  "main.py",
  "app.py"
];

const defaultReadmeCoverage: ReadmeCoverage = {
  hasTitle: false,
  hasSummary: false,
  featureCount: 0,
  hasInstallation: false,
  hasUsage: false,
  faqCount: 0,
  screenshotCount: 0,
  sectionCount: 0
};

export function analyzeCodebase(files: readonly RepositoryFile[], readme?: ParsedReadme): CodeKnowledgeBase {
  const paths = files.map((file) => file.path);
  const blobPaths = files.filter((file) => file.type === "blob").map((file) => file.path);
  const projectStructure = buildProjectStructure(paths);
  const techStack = detectTechStack(blobPaths);
  const entryFiles = entryFileCandidates.filter((candidate) => blobPaths.includes(candidate));
  const configFiles = summarizeConfigFiles(files);
  const fileTypeDistribution = summarizeFileTypes(blobPaths);
  const directorySummaries = summarizeDirectories(blobPaths, configFiles, entryFiles);
  const readmeCoverage = readme ? summarizeReadmeCoverage(readme) : defaultReadmeCoverage;
  const detectionSignals = summarizeDetectionSignals(files, techStack, entryFiles, configFiles, readmeCoverage);
  const moduleMap = summarizeModules(blobPaths);
  const mermaid = buildMermaid(files);

  return {
    projectStructure,
    techStack,
    entryFiles,
    configFiles,
    fileTypeDistribution,
    directorySummaries,
    readmeCoverage,
    detectionSignals,
    moduleMap,
    mermaid
  };
}

function buildProjectStructure(paths: readonly string[]): readonly string[] {
  return [...new Set(paths.map((path) => path.split("/")[0]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function detectTechStack(paths: readonly string[]): readonly string[] {
  return stackDetectors
    .filter(([, markers]) =>
      markers.some((marker) => paths.some((path) => path === marker || path.endsWith(marker) || path.includes(marker)))
    )
    .map(([name]) => name);
}

function summarizeConfigFiles(files: readonly RepositoryFile[]): readonly ConfigFileSummary[] {
  return files
    .filter((file) => file.type === "blob" || file.type === "tree")
    .flatMap((file) => {
      const basename = file.path.split("/").at(-1) ?? file.path;
      const purpose = configPurposes.get(file.path) ?? configPurposes.get(basename);
      return purpose ? [{ path: file.path, purpose }] : [];
    });
}

function summarizeFileTypes(paths: readonly string[]): readonly FileTypeSummary[] {
  const counts = paths.reduce<Record<string, number>>((types, path) => {
    const basename = path.split("/").at(-1) ?? path;
    const extension = basename.includes(".") ? basename.slice(basename.lastIndexOf(".")).toLowerCase() : "no extension";
    return {
      ...types,
      [extension]: (types[extension] ?? 0) + 1
    };
  }, {});

  return Object.entries(counts)
    .sort(([, leftCount], [, rightCount]) => rightCount - leftCount)
    .slice(0, 8)
    .map(([label, count]) => ({ label, count }));
}

function summarizeDirectories(
  paths: readonly string[],
  configFiles: readonly ConfigFileSummary[],
  entryFiles: readonly string[]
): readonly DirectorySummary[] {
  const grouped = paths.reduce<Record<string, readonly string[]>>((groups, path) => {
    const topLevel = path.includes("/") ? path.split("/")[0] : ".";
    const current = groups[topLevel] ?? [];
    return {
      ...groups,
      [topLevel]: [...current, path]
    };
  }, {});

  return Object.entries(grouped)
    .map(([path, directoryPaths]) => {
      const configCount = configFiles.filter((file) => file.path === path || file.path.startsWith(`${path}/`)).length;
      const entryCount = entryFiles.filter((file) => file === path || file.startsWith(`${path}/`)).length;
      return {
        path,
        fileCount: directoryPaths.length,
        configCount,
        entryCount,
        summary: describeDirectory(path, directoryPaths.length, configCount, entryCount)
      };
    })
    .sort((left, right) => right.fileCount - left.fileCount)
    .slice(0, 8);
}

function describeDirectory(path: string, fileCount: number, configCount: number, entryCount: number): string {
  const signals = [
    `${fileCount} tracked ${fileCount === 1 ? "file" : "files"}`,
    configCount > 0 ? `${configCount} config ${configCount === 1 ? "signal" : "signals"}` : undefined,
    entryCount > 0 ? `${entryCount} detected ${entryCount === 1 ? "entry" : "entries"}` : undefined
  ].filter(Boolean);
  return `${path === "." ? "Repository root" : path} contains ${signals.join(", ")}.`;
}

function summarizeReadmeCoverage(readme: ParsedReadme): ReadmeCoverage {
  return {
    hasTitle: Boolean(readme.title),
    hasSummary: Boolean(readme.summary),
    featureCount: readme.features.length,
    hasInstallation: Boolean(readme.installation),
    hasUsage: Boolean(readme.usage),
    faqCount: readme.faq.length,
    screenshotCount: readme.screenshots.length,
    sectionCount: readme.sections.length
  };
}

function summarizeDetectionSignals(
  files: readonly RepositoryFile[],
  techStack: readonly string[],
  entryFiles: readonly string[],
  configFiles: readonly ConfigFileSummary[],
  readmeCoverage: ReadmeCoverage
): readonly DetectionSignal[] {
  return [
    {
      label: "Repository tree",
      value: `${files.length} paths fetched from GitHub`,
      confidence: files.length > 0 ? "high" : "low",
      source: "GitHub recursive tree"
    },
    {
      label: "Stack",
      value: techStack.length > 0 ? techStack.join(", ") : "No stack markers detected",
      confidence: techStack.length > 0 ? "medium" : "low",
      source: "Config files and file extensions"
    },
    {
      label: "Entrypoints",
      value: entryFiles.length > 0 ? entryFiles.join(", ") : "No common entry files detected",
      confidence: entryFiles.length > 0 ? "medium" : "low",
      source: "Known entry filename patterns"
    },
    {
      label: "Configuration",
      value: configFiles.length > 0 ? `${configFiles.length} known config paths` : "No known config paths detected",
      confidence: configFiles.length > 0 ? "high" : "low",
      source: "Static config path catalog"
    },
    {
      label: "README coverage",
      value: describeReadmeCoverage(readmeCoverage),
      confidence: readmeCoverage.sectionCount > 0 ? "high" : "low",
      source: "Parsed README sections"
    }
  ];
}

function describeReadmeCoverage(coverage: ReadmeCoverage): string {
  const covered = [
    coverage.hasTitle ? "title" : undefined,
    coverage.hasSummary ? "summary" : undefined,
    coverage.featureCount > 0 ? "features" : undefined,
    coverage.hasInstallation ? "installation" : undefined,
    coverage.hasUsage ? "usage" : undefined,
    coverage.faqCount > 0 ? "FAQ" : undefined,
    coverage.screenshotCount > 0 ? "screenshots" : undefined
  ].filter(Boolean);
  return covered.length > 0 ? covered.join(", ") : "No structured README sections detected";
}

function summarizeModules(paths: readonly string[]): readonly ReadmeSection[] {
  const grouped = paths.reduce<Record<string, readonly string[]>>((groups, path) => {
    const topLevel = path.includes("/") ? path.split("/")[0] : ".";
    const current = groups[topLevel] ?? [];
    return {
      ...groups,
      [topLevel]: [...current, path]
    };
  }, {});

  return Object.entries(grouped)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([heading, modulePaths]) => ({
      heading,
      content: `Contains ${modulePaths.length} tracked files, including ${modulePaths.slice(0, 4).join(", ")}.`
    }));
}

function buildMermaid(files: readonly RepositoryFile[]): string {
  const directories = [...new Set(files.map((file) => file.path.split("/").slice(0, -1).join("/")).filter(Boolean))];
  const edges = directories.flatMap((directory) => {
    const parts = directory.split("/");
    if (parts.length === 1) {
      return [`root --> ${toNodeId(directory)}["${directory}"]`];
    }

    const parent = parts.slice(0, -1).join("/");
    return [`${toNodeId(parent)} --> ${toNodeId(directory)}["${parts.at(-1) ?? directory}"]`];
  });

  return ["graph TD", '  root["Repository"]', ...edges.map((edge) => `  ${edge}`)].join("\n");
}

function toNodeId(path: string): string {
  return path.replace(/[^A-Za-z0-9]/g, "_");
}
