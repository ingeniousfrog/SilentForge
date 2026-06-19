import { describe, expect, it } from "vitest";
import { createResourceView } from "../src/workbench/resources.js";
import type { RepositorySnapshot, SiteModel } from "../src/types.js";

describe("createResourceView", () => {
  it("exposes repository resources without raw snapshot internals", () => {
    const snapshot: RepositorySnapshot = {
      metadata: {
        owner: "acme",
        name: "widgetkit",
        fullName: "acme/widgetkit",
        htmlUrl: "https://github.com/acme/widgetkit",
        defaultBranch: "main",
        stars: 1,
        topics: []
      },
      readme: "# WidgetKit",
      releases: [],
      files: [{ path: "package.json", type: "blob", size: 12, url: "secret-url" }],
      configFiles: [{ path: "package.json", type: "blob", size: 12, url: "secret-url" }]
    };
    const model: SiteModel = {
      repository: snapshot.metadata,
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
        projectStructure: [],
        techStack: [],
        entryFiles: [],
        configFiles: [],
        fileTypeDistribution: [{ label: ".json", count: 1 }],
        directorySummaries: [
          {
            path: ".",
            fileCount: 1,
            configCount: 1,
            entryCount: 0,
            summary: "Repository root contains 1 tracked file, 1 config signal."
          }
        ],
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
        detectionSignals: [
          {
            label: "Configuration",
            value: "1 known config paths",
            confidence: "high",
            source: "Static config path catalog"
          }
        ],
        moduleMap: [],
        mermaid: "graph TD"
      },
      generatedAt: "2026-06-16T00:00:00.000Z"
      ,
      profile: {
        richnessScore: 1,
        hasVisualStory: false,
        hasDeveloperJourney: false,
        hasArchitectureDepth: false,
        readmeInsightCount: 0
      },
      diagnostics: {
        score: 22,
        maxScore: 100,
        grade: "needs-work",
        strengths: ["README title is present."],
        gaps: ["README is missing a summary."],
        recommendations: ["Add a concise README summary."],
        dimensions: []
      }
    };

    expect(createResourceView(snapshot, model).files).toEqual([{ path: "package.json", type: "blob", size: 12 }]);
    expect(createResourceView(snapshot, model).knowledgeBase.fileTypeDistribution).toEqual([{ label: ".json", count: 1 }]);
    expect(createResourceView(snapshot, model).diagnostics.score).toBe(22);
    expect(JSON.stringify(createResourceView(snapshot, model))).not.toContain("secret-url");
  });
});
