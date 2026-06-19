import { describe, expect, it } from "vitest";
import { z } from "zod";
import { minGithubTokenLength, normalizeGithubToken } from "../src/github/token.js";

const optionalGithubTokenSchema = z.preprocess(
  (value) => normalizeGithubToken(typeof value === "string" ? value : undefined),
  z.string().min(minGithubTokenLength).max(200).optional()
);

const createJobSchema = z.object({
  repoUrl: z.string().trim().min(1).max(500),
  useAi: z.boolean().optional().default(false),
  githubToken: optionalGithubTokenSchema
});

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
});
