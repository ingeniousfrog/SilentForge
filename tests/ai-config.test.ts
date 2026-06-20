import { describe, expect, it } from "vitest";
import { resolveAiPlanningConfig } from "../src/presentation/aiConfig.js";

describe("resolveAiPlanningConfig", () => {
  it("prefers job config over environment variables", () => {
    const previousKey = process.env.OPENAI_API_KEY;
    const previousBaseUrl = process.env.OPENAI_BASE_URL;
    process.env.OPENAI_API_KEY = "env-key";
    process.env.OPENAI_BASE_URL = "https://example.com/v1";

    expect(
      resolveAiPlanningConfig({
        openaiApiKey: "job-key",
        openaiBaseUrl: "http://127.0.0.1:8787/v1",
        openaiModel: "gpt-test"
      })
    ).toEqual({
      openaiApiKey: "job-key",
      openaiBaseUrl: "http://127.0.0.1:8787/v1",
      openaiModel: "gpt-test",
      codexModel: "gpt-test"
    });

    if (previousKey) process.env.OPENAI_API_KEY = previousKey;
    else delete process.env.OPENAI_API_KEY;
    if (previousBaseUrl) process.env.OPENAI_BASE_URL = previousBaseUrl;
    else delete process.env.OPENAI_BASE_URL;
  });
});
