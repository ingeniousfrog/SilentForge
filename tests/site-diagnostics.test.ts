import { describe, expect, it } from "vitest";
import { evaluateRepositoryDiagnostics } from "../src/site/diagnostics.js";
import type { SiteModel } from "../src/types.js";

type DiagnosticSourceModel = Omit<SiteModel, "diagnostics">;

function model(overrides: Partial<DiagnosticSourceModel> = {}): DiagnosticSourceModel {
  return {
    generatedAt: "2026-06-19T00:00:00.000Z",
    repository: {
      owner: "acme",
      name: "widgetkit",
      fullName: "acme/widgetkit",
      description: "Tiny widgets",
      htmlUrl: "https://github.com/acme/widgetkit",
      homepage: "https://example.com",
      defaultBranch: "main",
      stars: 42,
      topics: ["widgets", "dashboard"],
      language: "TypeScript",
      license: { name: "MIT", spdxId: "MIT" }
    },
    readme: {
      title: "WidgetKit",
      summary: "Tiny widgets for dashboards.",
      features: ["Fast rendering", "Small API"],
      installation: "npm install widgetkit",
      usage: "widgetkit --help",
      faq: [{ heading: "Server?", content: "No." }],
      screenshots: [{ alt: "Dashboard", src: "https://example.com/screenshot.png" }],
      links: [],
      sections: [{ heading: "Architecture", content: "A useful architecture section with enough detail." }]
    },
    releases: [{ name: "v1.0.0", tagName: "v1.0.0", url: "https://github.com/acme/widgetkit/releases/tag/v1.0.0" }],
    screenshots: [{ alt: "Dashboard", src: "https://example.com/screenshot.png" }],
    knowledgeBase: {
      projectStructure: ["src", "tests", "package.json"],
      techStack: ["TypeScript", "Node.js"],
      entryFiles: ["src/cli.ts"],
      configFiles: [
        { path: "package.json", purpose: "Node.js package manifest and scripts" },
        { path: "tsconfig.json", purpose: "TypeScript compiler configuration" },
        { path: "vitest.config.ts", purpose: "Vitest test configuration" }
      ],
      fileTypeDistribution: [{ label: ".ts", count: 24 }],
      directorySummaries: [
        { path: "src", fileCount: 12, configCount: 0, entryCount: 1, summary: "src contains source files." },
        { path: "tests", fileCount: 12, configCount: 0, entryCount: 0, summary: "tests contains tests." }
      ],
      readmeCoverage: {
        hasTitle: true,
        hasSummary: true,
        featureCount: 2,
        hasInstallation: true,
        hasUsage: true,
        faqCount: 1,
        screenshotCount: 1,
        sectionCount: 1
      },
      detectionSignals: [],
      moduleMap: [
        { heading: "src", content: "Contains source files." },
        { heading: "tests", content: "Contains tests." }
      ],
      mermaid: "graph TD"
    },
    profile: {
      richnessScore: 9,
      hasVisualStory: true,
      hasDeveloperJourney: true,
      hasArchitectureDepth: true,
      readmeInsightCount: 1
    },
    ...overrides
  };
}

describe("evaluateRepositoryDiagnostics", () => {
  it("scores a complete repository as ready and records strengths", () => {
    const diagnostics = evaluateRepositoryDiagnostics(model());

    expect(diagnostics.score).toBe(100);
    expect(diagnostics.grade).toBe("ready");
    expect(diagnostics.strengths).toContain("README covers title, summary, features, installation, usage, and FAQ.");
    expect(diagnostics.dimensions).toHaveLength(5);
    expect(diagnostics.gaps).toEqual([]);
  });

  it("surfaces missing README, visual, release, and architecture signals", () => {
    const diagnostics = evaluateRepositoryDiagnostics(
      model({
        repository: {
          ...model().repository,
          homepage: undefined,
          topics: [],
          license: undefined
        },
        readme: {
          title: "WidgetKit",
          features: [],
          faq: [],
          screenshots: [],
          links: [],
          sections: []
        },
        releases: [],
        screenshots: [],
        knowledgeBase: {
          ...model().knowledgeBase,
          techStack: [],
          entryFiles: [],
          configFiles: [],
          directorySummaries: [],
          readmeCoverage: {
            hasTitle: true,
            hasSummary: false,
            featureCount: 0,
            hasInstallation: false,
            hasUsage: false,
            faqCount: 0,
            screenshotCount: 0,
            sectionCount: 0
          },
          moduleMap: []
        },
        profile: {
          richnessScore: 1,
          hasVisualStory: false,
          hasDeveloperJourney: false,
          hasArchitectureDepth: false,
          readmeInsightCount: 0
        }
      })
    );

    expect(diagnostics.score).toBeLessThan(45);
    expect(diagnostics.grade).toBe("needs-work");
    expect(diagnostics.gaps).toContain("README is missing a summary.");
    expect(diagnostics.gaps).toContain("No visual assets were detected.");
    expect(diagnostics.recommendations).toContain("Add at least one screenshot, GIF, or product image under README or repository image paths.");
  });
});
