import type { AiPlanningConfig } from "../types.js";

export type ResolvedAiPlanningConfig = {
  readonly openaiApiKey?: string;
  readonly openaiBaseUrl?: string;
  readonly openaiModel: string;
  readonly codexModel?: string;
};

export function resolveAiPlanningConfig(config: AiPlanningConfig = {}): ResolvedAiPlanningConfig {
  const openaiModel = config.openaiModel?.trim() || process.env.OPENAI_MODEL?.trim() || "gpt-5.5";
  return {
    openaiApiKey: config.openaiApiKey?.trim() || process.env.OPENAI_API_KEY?.trim() || undefined,
    openaiBaseUrl: config.openaiBaseUrl?.trim() || process.env.OPENAI_BASE_URL?.trim() || undefined,
    openaiModel,
    codexModel: config.codexModel?.trim() || process.env.CODEX_MODEL?.trim() || openaiModel
  };
}
