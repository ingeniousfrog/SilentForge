import { describe, expect, it, vi } from "vitest";
import { JobStore } from "../src/workbench/jobStore.js";

const fetchRepositorySnapshot = vi.fn();
const generateStaticSite = vi.fn();
const createPresentationPlan = vi.fn();

vi.mock("../src/github/client.js", () => ({ fetchRepositorySnapshot }));
vi.mock("../src/site/generator.js", () => ({ generateStaticSite }));
vi.mock("../src/presentation/ai.js", () => ({ createPresentationPlan }));

describe("runGenerationJob", () => {
  it("records progress and generates the static presentation", async () => {
    const { runGenerationJob } = await import("../src/workbench/generator.js");
    const store = new JobStore();
    const job = await store.create("acme/widgetkit");
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
      chapters: [],
      detailPages: [],
      plannedBy: "rules"
    });

    await runGenerationJob(store, job);

    const finished = store.require(job.id);
    expect(finished.status).toBe("complete");
    expect(finished.events.map((event) => event.type)).toContain("complete");
    expect(generateStaticSite).toHaveBeenCalledWith(
      expect.objectContaining({ repository: expect.any(Object) }),
      job.outputDir,
      expect.objectContaining({ presentationPlan: expect.any(Object) })
    );
  });

  it("records failures as error events", async () => {
    const { runGenerationJob } = await import("../src/workbench/generator.js");
    const store = new JobStore();
    const job = await store.create("acme/broken");
    fetchRepositorySnapshot.mockRejectedValue(new Error("network down"));

    await runGenerationJob(store, job);

    const failed = store.require(job.id);
    expect(failed.status).toBe("failed");
    expect(failed.error).toBe("network down");
    expect(failed.events.at(-1)).toMatchObject({ type: "error", message: "network down" });
  });
});
