import { describe, expect, it } from "vitest";
import { buildPresentationPlan, validatePresentationPlan } from "../src/presentation/plan.js";
import type { SiteModel } from "../src/types.js";

function model(overrides: Partial<SiteModel> = {}): SiteModel {
  return {
    generatedAt: "2026-06-18T00:00:00.000Z",
    repository: {
      owner: "acme",
      name: "widget",
      fullName: "acme/widget",
      description: "A useful widget",
      htmlUrl: "https://github.com/acme/widget",
      homepage: "https://example.com",
      defaultBranch: "main",
      stars: 12,
      topics: ["widgets"],
      language: "TypeScript"
    },
    readme: {
      title: "Widget",
      summary: "A useful widget.",
      features: ["Fast", "Small"],
      installation: "npm install widget",
      usage: "widget --help",
      faq: [],
      screenshots: [],
      links: [],
      sections: [
        {
          heading: "CLI",
          content: "Use the command line to optimize images, process directories, choose formats, and inspect output reports."
        }
      ]
    },
    releases: [],
    screenshots: [{ alt: "Dashboard", src: "https://example.com/demo.png" }],
    knowledgeBase: {
      projectStructure: ["src", "docs"],
      techStack: ["TypeScript"],
      entryFiles: ["src/index.ts"],
      configFiles: [],
      fileTypeDistribution: [{ label: ".ts", count: 8 }],
      directorySummaries: [],
      readmeCoverage: {
        hasTitle: true,
        hasSummary: true,
        featureCount: 2,
        hasInstallation: true,
        hasUsage: true,
        faqCount: 0,
        screenshotCount: 1,
        sectionCount: 1
      },
      detectionSignals: [],
      moduleMap: [],
      mermaid: "graph TD"
    },
    profile: {
      richnessScore: 8,
      hasVisualStory: true,
      hasDeveloperJourney: true,
      hasArchitectureDepth: false,
      readmeInsightCount: 1
    },
    ...overrides
  };
}

describe("buildPresentationPlan", () => {
  it("chooses a visual showcase when screenshots are available", () => {
    const plan = buildPresentationPlan(model());
    expect(plan.mode).toBe("visual-showcase");
    expect(plan.chapters.some((chapter) => chapter.kind === "visuals")).toBe(true);
  });

  it("includes README-derived insights when useful sections exist", () => {
    const plan = buildPresentationPlan(model());
    expect(plan.chapters.some((chapter) => chapter.kind === "readme-insights")).toBe(true);
  });

  it("keeps deterministic chapter summaries within validation limits", () => {
    const longSummary =
      "DeskTank turns a macOS desktop into a tiny battlefield where tanks navigate around desktop icons, folders, and Finder state changes while keeping the experience playful, local-first, and lightweight enough to run during short breaks without turning the project overview into a long README paragraph.";
    const plan = buildPresentationPlan(
      model({
        readme: {
          ...model().readme,
          summary: longSummary
        }
      })
    );

    expect(plan.chapters[0].summary?.length).toBeLessThanOrEqual(240);
    expect(() =>
      validatePresentationPlan(
        plan,
        model({
          readme: {
            ...model().readme,
            summary: longSummary
          }
        })
      )
    ).not.toThrow();
  });

  it("uses a compact story and omits empty detail pages for sparse repositories", () => {
    const sparse = model({
      repository: { ...model().repository, homepage: undefined, description: undefined },
      readme: { title: "Widget", features: [], faq: [], screenshots: [], links: [], sections: [] },
      screenshots: [],
      releases: [],
      profile: {
        richnessScore: 1,
        hasVisualStory: false,
        hasDeveloperJourney: false,
        hasArchitectureDepth: false,
        readmeInsightCount: 0
      }
    });
    const plan = buildPresentationPlan(sparse);
    expect(plan.mode).toBe("compact-story");
    expect(plan.detailPages).toEqual([]);
  });

  it("rejects AI plans that reference unknown sources or unsafe routes", () => {
    const fallback = buildPresentationPlan(model());
    expect(() =>
      validatePresentationPlan(
        {
          ...fallback,
          chapters: [{ ...fallback.chapters[0], sourceRefs: ["secret.value"] }]
        },
        model()
      )
    ).toThrow("source");
    expect(() =>
      validatePresentationPlan(
        {
          ...fallback,
          detailPages: [{ ...fallback.detailPages[0], route: "../secret.html" }]
        },
        model()
      )
    ).toThrow("route");
  });

  it("rejects chapters that have no backing repository content", () => {
    const sparse = model({
      readme: { title: "Widget", features: [], faq: [], screenshots: [], links: [], sections: [] },
      screenshots: [],
      profile: {
        richnessScore: 1,
        hasVisualStory: false,
        hasDeveloperJourney: false,
        hasArchitectureDepth: false,
        readmeInsightCount: 0
      }
    });
    const fallback = buildPresentationPlan(sparse);
    expect(() =>
      validatePresentationPlan(
        {
          ...fallback,
          chapters: [
            ...fallback.chapters,
            {
              id: "empty-visuals",
              kind: "visuals",
              title: "Visuals",
              sourceRefs: ["screenshots"],
              verticalDetails: []
            }
          ]
        },
        sparse
      )
    ).toThrow("no repository content");
  });
});
