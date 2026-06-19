import { describe, expect, it, vi } from "vitest";
import { createPresentationPlan } from "../src/presentation/ai.js";
import { buildPresentationPlan } from "../src/presentation/plan.js";
import type { SiteModel } from "../src/types.js";

const sparseModel = {
  repository: {
    owner: "acme",
    name: "widget",
    fullName: "acme/widget",
    htmlUrl: "https://github.com/acme/widget",
    defaultBranch: "main",
    stars: 1,
    topics: []
  },
  readme: { title: "Widget", features: [], faq: [], screenshots: [], links: [], sections: [] },
  releases: [],
  screenshots: [],
  knowledgeBase: {
    projectStructure: [],
    techStack: [],
    entryFiles: [],
    configFiles: [],
    fileTypeDistribution: [],
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
    detectionSignals: [],
    moduleMap: [],
    mermaid: "graph TD"
  },
  profile: {
    richnessScore: 1,
    hasVisualStory: false,
    hasDeveloperJourney: false,
    hasArchitectureDepth: false,
    readmeInsightCount: 0
  },
  diagnostics: {
    score: 20,
    maxScore: 100,
    grade: "needs-work",
    strengths: [],
    gaps: [],
    recommendations: [],
    dimensions: []
  },
  generatedAt: "2026-06-18T00:00:00.000Z"
} satisfies SiteModel;

describe("createPresentationPlan", () => {
  it("does not call OpenAI when AI is disabled", async () => {
    const planner = vi.fn();
    const result = await createPresentationPlan(sparseModel, { useAi: false, aiPlanner: planner });
    expect(result.plannedBy).toBe("rules");
    expect(planner).not.toHaveBeenCalled();
  });

  it("falls back to deterministic rules when AI planning fails", async () => {
    const onFallback = vi.fn();
    const result = await createPresentationPlan(sparseModel, {
      useAi: true,
      aiPlanner: vi.fn().mockRejectedValue(new Error("timeout")),
      onFallback
    });
    expect(result).toEqual(buildPresentationPlan(sparseModel));
    expect(onFallback).toHaveBeenCalledWith("timeout");
  });

  it("applies user generation options to deterministic fallback planning", async () => {
    const planner = vi.fn();
    const result = await createPresentationPlan(sparseModel, {
      useAi: false,
      aiPlanner: planner,
      generationOptions: {
        mode: "architecture-map",
        theme: "blueprint",
        enabledChapters: []
      }
    });

    expect(result.mode).toBe("architecture-map");
    expect(result.theme).toBe("blueprint");
    expect(result.chapters.map((chapter) => chapter.kind)).toEqual(["hero"]);
    expect(planner).not.toHaveBeenCalled();
  });
});
