import { describe, expect, it } from "vitest";
import { analyzeCodebase } from "../src/analyzer/codebase.js";
import type { RepositoryFile } from "../src/types.js";

const file = (path: string): RepositoryFile => ({ path, type: "blob" });

describe("analyzeCodebase", () => {
  it("detects stack, entries, config files, modules, and mermaid map from repository files", () => {
    const result = analyzeCodebase(
      [
      file("package.json"),
      file("astro.config.mjs"),
      file("src/index.ts"),
      file("src/cli.ts"),
      file("src/github/client.ts"),
      file("docs/screenshot.png"),
      { path: "src/github", type: "tree" }
      ],
      {
        title: "WidgetKit",
        summary: "Tiny widgets.",
        features: ["Fast"],
        installation: "npm install",
        usage: "widgetkit --help",
        faq: [],
        screenshots: [],
        links: [],
        sections: [{ heading: "Install", content: "npm install" }]
      }
    );

    expect(result.techStack).toEqual(expect.arrayContaining(["Node.js", "TypeScript", "Astro"]));
    expect(result.entryFiles).toEqual(expect.arrayContaining(["src/index.ts", "src/cli.ts"]));
    expect(result.configFiles).toContainEqual({
      path: "package.json",
      purpose: "Node.js package manifest and scripts"
    });
    expect(result.moduleMap).toContainEqual({
      heading: "src",
      content: "Contains 3 tracked files, including src/index.ts, src/cli.ts, src/github/client.ts."
    });
    expect(result.fileTypeDistribution).toEqual(
      expect.arrayContaining([
        { label: ".ts", count: 3 },
        { label: ".json", count: 1 }
      ])
    );
    expect(result.directorySummaries).toContainEqual(
      expect.objectContaining({
        path: "src",
        fileCount: 3,
        entryCount: 2
      })
    );
    expect(result.readmeCoverage).toEqual(
      expect.objectContaining({
        hasTitle: true,
        hasSummary: true,
        featureCount: 1,
        hasInstallation: true,
        hasUsage: true,
        sectionCount: 1
      })
    );
    expect(result.detectionSignals).toContainEqual(
      expect.objectContaining({
        label: "README coverage",
        confidence: "high",
        source: "Parsed README sections"
      })
    );
    expect(result.mermaid).toContain("graph TD");
    expect(result.mermaid).toContain("src --> src_github");
  });
});
