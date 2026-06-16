import { z } from "zod";
import type { GitHubRepositoryUrl } from "../types.js";

const ownerRepoSchema = z
  .string()
  .regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/, "Expected owner/repo");

export function parseGitHubRepoUrl(input: string): GitHubRepositoryUrl {
  const trimmed = input.trim();

  if (ownerRepoSchema.safeParse(trimmed).success) {
    const [owner, rawRepo] = trimmed.split("/");
    const repo = rawRepo.replace(/\.git$/, "");

    return {
      owner,
      repo,
      normalizedUrl: `https://github.com/${owner}/${repo}`
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Expected a GitHub repository URL or owner/repo shorthand.");
  }

  if (parsed.hostname !== "github.com") {
    throw new Error("Expected a GitHub repository URL.");
  }

  const [owner, rawRepo] = parsed.pathname.split("/").filter(Boolean);
  if (!owner || !rawRepo) {
    throw new Error("Expected a GitHub repository URL with owner and repo.");
  }

  const repo = rawRepo.replace(/\.git$/, "");

  return {
    owner,
    repo,
    normalizedUrl: `https://github.com/${owner}/${repo}`
  };
}
