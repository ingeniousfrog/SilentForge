import { describe, expect, it } from "vitest";
import { JobStore } from "../src/workbench/jobStore.js";

describe("JobStore", () => {
  it("creates jobs and records immutable event history", async () => {
    const store = new JobStore();
    const job = await store.create("acme/widgetkit");

    const updated = store.pushEvent(job.id, "step", "Started");

    expect(updated.events).toHaveLength(1);
    expect(job.events).toHaveLength(0);
    expect(store.publicJob(job.id)).toMatchObject({
      id: job.id,
      repoUrl: "acme/widgetkit",
      hasSnapshot: false,
      hasModel: false
    });
    expect(store.publicJob(job.id)).not.toHaveProperty("workspaceDir");
    expect(store.publicJob(job.id)).not.toHaveProperty("outputDir");
    expect(job.useAi).toBe(false);
  });

  it("stores github tokens on jobs without exposing them publicly", async () => {
    const store = new JobStore();
    const job = await store.create("acme/widgetkit", false, {}, "ghp_valid_test_token");

    expect(job.githubToken).toBe("ghp_valid_test_token");
    expect(store.publicJob(job.id)).not.toHaveProperty("githubToken");
  });

  it("drops github tokens that are too short", async () => {
    const store = new JobStore();
    const job = await store.create("acme/widgetkit", false, {}, "ghp_short");

    expect(job.githubToken).toBeUndefined();
  });

  it("stores generation options and exposes completion timestamps publicly", async () => {
    const store = new JobStore();
    const job = await store.create("acme/widgetkit", true, {
      mode: "developer-deck",
      theme: "signal-dark",
      enabledChapters: ["usage", "technology"]
    });

    const complete = store.patch(job.id, { status: "complete" });

    expect(job.generationOptions).toEqual({
      mode: "developer-deck",
      theme: "signal-dark",
      enabledChapters: ["usage", "technology"]
    });
    expect(complete.completedAt).toBeDefined();
    expect(store.publicJob(job.id)).toMatchObject({
      completedAt: complete.completedAt,
      generationOptions: job.generationOptions
    });
  });

  it("keeps only the newest jobs and cleans up evicted workspaces", async () => {
    const cleaned: string[] = [];
    const store = new JobStore({
      maxJobs: 2,
      cleanupWorkspace: async (workspaceDir) => {
        cleaned.push(workspaceDir);
      }
    });

    const first = await store.create("acme/one");
    const second = await store.create("acme/two");
    const third = await store.create("acme/three");

    expect(store.publicJob(first.id)).toBeUndefined();
    expect(store.publicJob(second.id)?.id).toBe(second.id);
    expect(store.publicJob(third.id)?.id).toBe(third.id);
    expect(cleaned).toEqual([first.workspaceDir]);
  });

  it("throws for unknown jobs", () => {
    const store = new JobStore();

    expect(() => store.require("missing")).toThrow("Unknown job");
  });
});
