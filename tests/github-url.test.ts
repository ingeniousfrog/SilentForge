import { describe, expect, it } from "vitest";
import { parseGitHubRepoUrl } from "../src/github/url.js";

describe("parseGitHubRepoUrl", () => {
  it("normalizes HTTPS repository URLs", () => {
    expect(parseGitHubRepoUrl("https://github.com/AIDotNet/OpenDeepWiki.git")).toEqual({
      owner: "AIDotNet",
      repo: "OpenDeepWiki",
      normalizedUrl: "https://github.com/AIDotNet/OpenDeepWiki"
    });
  });

  it("normalizes shorthand owner/repo input", () => {
    expect(parseGitHubRepoUrl("openai/openai-node")).toEqual({
      owner: "openai",
      repo: "openai-node",
      normalizedUrl: "https://github.com/openai/openai-node"
    });
  });

  it("rejects non-GitHub URLs", () => {
    expect(() => parseGitHubRepoUrl("https://example.com/owner/repo")).toThrow("GitHub");
  });

  it("rejects incomplete GitHub URLs", () => {
    expect(() => parseGitHubRepoUrl("https://github.com/openai")).toThrow("owner and repo");
  });
});
