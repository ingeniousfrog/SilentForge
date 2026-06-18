import { describe, expect, it } from "vitest";
import { safeExternalUrl } from "../src/site/security.js";

describe("safeExternalUrl", () => {
  it("allows http and https URLs", () => {
    expect(safeExternalUrl("https://example.com/docs")).toBe("https://example.com/docs");
  });

  it("blocks executable and malformed URL schemes", () => {
    expect(safeExternalUrl("javascript:alert(1)")).toBeUndefined();
    expect(safeExternalUrl("data:text/html,boom")).toBeUndefined();
  });
});
