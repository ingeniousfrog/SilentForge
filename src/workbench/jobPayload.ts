import { z } from "zod";
import { minGithubTokenLength, normalizeGithubToken } from "../github/token.js";

const optionalGithubTokenSchema = z.preprocess(
  (value) => normalizeGithubToken(typeof value === "string" ? value : undefined),
  z.string().min(minGithubTokenLength).max(200).optional()
);

const optionalUrlSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed || undefined;
  },
  z.string().url().max(500).optional()
);

const optionalOpenAiKeySchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length >= 8 ? trimmed : undefined;
  },
  z.string().min(8).max(500).optional()
);

export const aiConfigSchema = z
  .object({
    openaiApiKey: optionalOpenAiKeySchema,
    openaiBaseUrl: optionalUrlSchema,
    openaiModel: z.string().trim().min(1).max(120).optional(),
    codexModel: z.string().trim().min(1).max(120).optional()
  })
  .optional();

export const createJobSchema = z.object({
  repoUrl: z.string().trim().min(1).max(500),
  useAi: z.boolean().optional().default(false),
  githubToken: optionalGithubTokenSchema,
  aiConfig: aiConfigSchema,
  generationOptions: z
    .object({
      mode: z.enum(["auto", "visual-showcase", "developer-deck", "architecture-map", "compact-story"]).optional(),
      theme: z.enum(["auto", "signal-dark", "editorial-light", "blueprint"]).optional(),
      enabledChapters: z
        .array(
          z.enum(["features", "visuals", "usage", "readme-insights", "technology", "architecture", "resources"])
        )
        .optional(),
      locale: z.enum(["en", "zh"]).optional()
    })
    .optional()
});
