import type { CodeKnowledgeBase, ConfigFileSummary, ReadmeSection, RepositoryFile } from "../types.js";

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

export function analyzeCodebase(files: readonly RepositoryFile[]): CodeKnowledgeBase {
  const paths = files.map((file) => file.path);
  const blobPaths = files.filter((file) => file.type === "blob").map((file) => file.path);
  const projectStructure = buildProjectStructure(paths);
  const techStack = detectTechStack(blobPaths);
  const entryFiles = entryFileCandidates.filter((candidate) => blobPaths.includes(candidate));
  const configFiles = summarizeConfigFiles(files);
  const moduleMap = summarizeModules(blobPaths);
  const mermaid = buildMermaid(files);

  return {
    projectStructure,
    techStack,
    entryFiles,
    configFiles,
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
