import { describe, expect, it } from "vitest";
import { minGithubTokenLength, normalizeGithubToken } from "../src/github/token.js";

describe("normalizeGithubToken", () => {
  it("treats empty, short, and whitespace tokens as absent", () => {
    expect(normalizeGithubToken(undefined)).toBeUndefined();
    expect(normalizeGithubToken(null)).toBeUndefined();
    expect(normalizeGithubToken("")).toBeUndefined();
    expect(normalizeGithubToken("   ")).toBeUndefined();
    expect(normalizeGithubToken("ghp_short")).toBeUndefined();
    expect(normalizeGithubToken("x".repeat(minGithubTokenLength - 1))).toBeUndefined();
  });

  it("keeps tokens that meet the minimum length", () => {
    const token = "ghp_" + "a".repeat(minGithubTokenLength);
    expect(normalizeGithubToken(token)).toBe(token);
  });
});
