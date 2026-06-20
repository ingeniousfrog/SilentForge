import { describe, expect, it } from "vitest";
import { getAiBackendStatus } from "../src/presentation/ai.js";

describe("getAiBackendStatus", () => {
  it("returns codex and server env availability flags", () => {
    const status = getAiBackendStatus();
    expect(status.codex).toMatchObject({
      found: expect.any(Boolean),
      loggedIn: expect.any(Boolean),
      path: expect.any(String),
      detail: expect.any(String)
    });
    expect(status.server).toMatchObject({
      hasOpenAiKey: expect.any(Boolean),
      hasOpenAiBaseUrl: expect.any(Boolean),
      hasOpenAiModel: expect.any(Boolean)
    });
  });
});
