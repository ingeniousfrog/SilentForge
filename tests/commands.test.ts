import { afterEach, describe, expect, it, vi } from "vitest";

const fetchRepositorySnapshot = vi.fn();
const generateStaticSite = vi.fn();
const createPresentationPlan = vi.fn();

vi.mock("../src/github/client.js", () => ({ fetchRepositorySnapshot }));
vi.mock("../src/site/generator.js", () => ({ generateStaticSite }));
vi.mock("../src/presentation/ai.js", () => ({ createPresentationPlan }));

afterEach(() => {
  vi.clearAllMocks();
});

describe("initRepoSite", () => {
  it("fetches a repository snapshot, builds a site model, and writes the static presentation", async () => {
    const { initRepoSite } = await import("../src/commands/init.js");
    fetchRepositorySnapshot.mockResolvedValue({
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
      files: [{ path: "package.json", type: "blob" }],
      configFiles: [{ path: "package.json", type: "blob" }]
    });
    createPresentationPlan.mockResolvedValue({
      mode: "compact-story",
      theme: "signal-dark",
      locale: "zh",
      chapters: [],
      detailPages: [],
      plannedBy: "rules"
    });

    const result = await initRepoSite("acme/widgetkit", {
      cwd: "/tmp/work",
      outputDir: "site",
      token: "ghp_valid_test_token",
      generationOptions: { locale: "zh", theme: "blueprint", enabledChapters: ["features", "usage"] }
    });

    expect(fetchRepositorySnapshot).toHaveBeenCalledWith("acme/widgetkit", { token: "ghp_valid_test_token" });
    expect(createPresentationPlan).toHaveBeenCalledWith(
      expect.objectContaining({ repository: expect.any(Object) }),
      expect.objectContaining({
        generationOptions: { locale: "zh", theme: "blueprint", enabledChapters: ["features", "usage"] },
        onFallback: expect.any(Function)
      })
    );
    expect(generateStaticSite).toHaveBeenCalledWith(
      expect.objectContaining({ repository: expect.any(Object) }),
      "/tmp/work/site",
      expect.objectContaining({ presentationPlan: expect.any(Object) })
    );
    expect(result).toEqual({
      outputDir: "/tmp/work/site",
      fullName: "acme/widgetkit",
      presentationPlan: expect.objectContaining({ plannedBy: "rules" })
    });
  });

  it("passes useAi and forwards onFallback when AI planning is enabled", async () => {
    const { initRepoSite } = await import("../src/commands/init.js");
    fetchRepositorySnapshot.mockResolvedValue({
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
      files: [{ path: "package.json", type: "blob" }],
      configFiles: [{ path: "package.json", type: "blob" }]
    });
    createPresentationPlan.mockImplementation(async (_model, options) => {
      options?.onFallback?.("Codex down");
      return {
        mode: "compact-story",
        theme: "signal-dark",
        locale: "en",
        chapters: [],
        detailPages: [],
        plannedBy: "rules"
      };
    });

    const result = await initRepoSite("acme/widgetkit", { ai: true, generationOptions: { locale: "en" } });

    expect(createPresentationPlan).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ useAi: true, onFallback: expect.any(Function) })
    );
    expect(result.presentationPlan.plannedBy).toBe("rules");
  });
});
