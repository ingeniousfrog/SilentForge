import { describe, expect, it } from "vitest";
import { resolvePreviewPath } from "../src/workbench/server.js";

describe("resolvePreviewPath", () => {
  it("serves the generated index and nested static pages from the same output directory", () => {
    expect(resolvePreviewPath("/tmp/site", "/")).toBe("/tmp/site/index.html");
    expect(resolvePreviewPath("/tmp/site", "/details/usage.html")).toBe("/tmp/site/details/usage.html");
  });

  it("blocks encoded and direct path traversal", () => {
    expect(resolvePreviewPath("/tmp/site", "/../secret")).toBeUndefined();
    expect(resolvePreviewPath("/tmp/site", "/%2e%2e/secret")).toBeUndefined();
  });
});
