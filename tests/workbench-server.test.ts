import { describe, expect, it } from "vitest";
import { createJobSchema } from "../src/workbench/jobPayload.js";

describe("workbench create job payload", () => {
  it("accepts jobs without a github token", () => {
    expect(createJobSchema.safeParse({ repoUrl: "openai/openai-node" }).success).toBe(true);
  });

  it("treats empty github token values as omitted", () => {
    for (const payload of [
      { repoUrl: "openai/openai-node", githubToken: "" },
      { repoUrl: "openai/openai-node", githubToken: "   " },
      { repoUrl: "openai/openai-node", githubToken: null }
    ]) {
      const parsed = createJobSchema.safeParse(payload);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.githubToken).toBeUndefined();
      }
    }
  });

  it("keeps non-empty github tokens", () => {
    const parsed = createJobSchema.parse({ repoUrl: "openai/openai-node", githubToken: "ghp_valid_test_token" });
    expect(parsed.githubToken).toBe("ghp_valid_test_token");
  });

  it("drops github tokens that are too short", () => {
    const parsed = createJobSchema.parse({ repoUrl: "openai/openai-node", githubToken: "ghp_short" });
    expect(parsed.githubToken).toBeUndefined();
  });

  it("accepts optional aiConfig fields", () => {
    const parsed = createJobSchema.parse({
      repoUrl: "openai/openai-node",
      useAi: true,
      aiConfig: {
        openaiApiKey: "sk-test-key",
        openaiBaseUrl: "http://127.0.0.1:8787/v1",
        openaiModel: "gpt-5.5",
        codexModel: "gpt-5.5"
      }
    });

    expect(parsed.aiConfig).toEqual({
      openaiApiKey: "sk-test-key",
      openaiBaseUrl: "http://127.0.0.1:8787/v1",
      openaiModel: "gpt-5.5",
      codexModel: "gpt-5.5"
    });
  });

  it("drops short openai api keys from aiConfig", () => {
    const parsed = createJobSchema.parse({
      repoUrl: "openai/openai-node",
      useAi: true,
      aiConfig: { openaiApiKey: "short" }
    });

    expect(parsed.aiConfig?.openaiApiKey).toBeUndefined();
  });

  it("rejects invalid openai base urls", () => {
    const parsed = createJobSchema.safeParse({
      repoUrl: "openai/openai-node",
      useAi: true,
      aiConfig: { openaiBaseUrl: "not-a-url" }
    });

    expect(parsed.success).toBe(false);
  });
});
