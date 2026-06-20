import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createPresentationPlan,
  requestAiPlan,
  requestCodexPlan,
  requestOpenAiPlan
} from "../src/presentation/ai.js";
import { buildPresentationPlan } from "../src/presentation/plan.js";
import type { PresentationPlan, SiteModel } from "../src/types.js";

vi.mock("../src/codex/detect.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/codex/detect.js")>();
  return {
    ...actual,
    isCodexAvailable: vi.fn()
  };
});

vi.mock("../src/codex/exec.js", () => ({
  runCodexExecForPlan: vi.fn()
}));

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

const aiPlan = {
  ...buildPresentationPlan(sparseModel),
  plannedBy: "codex"
} satisfies PresentationPlan;

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

  it("falls back when AI planner returns an invalid plan", async () => {
    const onFallback = vi.fn();
    const invalidPlan = {
      ...buildPresentationPlan(sparseModel),
      plannedBy: "codex" as const,
      chapters: [
        {
          id: "hero",
          kind: "hero" as const,
          title: "Widget",
          sourceRefs: ["unknown.source"],
          verticalDetails: []
        }
      ]
    };
    const result = await createPresentationPlan(sparseModel, {
      useAi: true,
      aiPlanner: vi.fn().mockResolvedValue(invalidPlan),
      onFallback
    });
    expect(result.plannedBy).toBe("rules");
    expect(onFallback).toHaveBeenCalled();
  });

  it("validates a successful AI planner result", async () => {
    const result = await createPresentationPlan(sparseModel, {
      useAi: true,
      aiPlanner: vi.fn().mockResolvedValue(aiPlan)
    });
    expect(result.plannedBy).toBe("codex");
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

describe("requestAiPlan", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("uses Codex when available", async () => {
    const detect = await import("../src/codex/detect.js");
    const exec = await import("../src/codex/exec.js");
    vi.mocked(detect.isCodexAvailable).mockResolvedValue(true);
    vi.mocked(exec.runCodexExecForPlan).mockResolvedValue({
      mode: "developer-deck",
      theme: "signal-dark",
      chapters: [
        {
          id: "hero",
          kind: "hero",
          title: "Widget",
          sourceRefs: ["repository"],
          verticalDetails: []
        }
      ],
      detailPages: []
    });

    const result = await requestAiPlan(sparseModel, buildPresentationPlan(sparseModel));
    expect(result.plannedBy).toBe("codex");
  });

  it("throws when no AI backend is available", async () => {
    const detect = await import("../src/codex/detect.js");
    vi.mocked(detect.isCodexAvailable).mockResolvedValue(false);
    const previousKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    await expect(requestAiPlan(sparseModel, buildPresentationPlan(sparseModel))).rejects.toThrow(/No AI backend/i);

    if (previousKey) process.env.OPENAI_API_KEY = previousKey;
  });
});

describe("requestOpenAiPlan", () => {
  it("requires OPENAI_API_KEY", async () => {
    const previousKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    await expect(requestOpenAiPlan(sparseModel, buildPresentationPlan(sparseModel))).rejects.toThrow(/OpenAI API key/i);

    if (previousKey) process.env.OPENAI_API_KEY = previousKey;
  });
});

describe("requestCodexPlan", () => {
  it("marks plans as codex", async () => {
    const exec = await import("../src/codex/exec.js");
    vi.mocked(exec.runCodexExecForPlan).mockResolvedValue({
      mode: "developer-deck",
      theme: "signal-dark",
      chapters: [
        {
          id: "hero",
          kind: "hero",
          title: "Widget",
          sourceRefs: ["repository"],
          verticalDetails: []
        }
      ],
      detailPages: []
    });

    const result = await requestCodexPlan(sparseModel, buildPresentationPlan(sparseModel));
    expect(result.plannedBy).toBe("codex");
  });
});
