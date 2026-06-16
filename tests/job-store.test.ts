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
  });

  it("throws for unknown jobs", () => {
    const store = new JobStore();

    expect(() => store.require("missing")).toThrow("Unknown job");
  });
});
