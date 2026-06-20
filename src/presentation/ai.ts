import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { runCodexExecForPlan } from "../codex/exec.js";
import { checkCodexLoginStatus, isCodexAvailable, resolveCodexPath } from "../codex/detect.js";
import { extractJsonFromText } from "../codex/parse.js";
import type { AiPlanningConfig, PresentationGenerationOptions, PresentationPlan, SiteModel } from "../types.js";
import { resolveAiPlanningConfig } from "./aiConfig.js";
import {
  buildOpenAiDeveloperMessage,
  buildOpenAiUserMessage,
  buildPresentationPrompt
} from "./prompt.js";
import { buildPresentationPlan, validatePresentationPlan } from "./plan.js";
import { planSchema } from "./schema.js";

export type AiPlanner = (
  model: SiteModel,
  fallback: PresentationPlan,
  aiConfig?: AiPlanningConfig
) => Promise<PresentationPlan>;

export type PresentationPlanningOptions = {
  readonly useAi?: boolean;
  readonly aiConfig?: AiPlanningConfig;
  readonly aiPlanner?: AiPlanner;
  readonly onFallback?: (message: string) => void;
  readonly generationOptions?: PresentationGenerationOptions;
};

function getOpenAiTimeoutMs(): number {
  const raw = process.env.SILENTFORGE_AI_TIMEOUT_MS;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 15_000;
}

function createOpenAiClient(apiKey: string, baseURL?: string): OpenAI {
  return new OpenAI({
    apiKey,
    baseURL: baseURL || undefined,
    timeout: getOpenAiTimeoutMs(),
    maxRetries: 1
  });
}

export async function requestCodexPlan(
  model: SiteModel,
  fallback: PresentationPlan,
  aiConfig: AiPlanningConfig = {}
): Promise<PresentationPlan> {
  const resolved = resolveAiPlanningConfig(aiConfig);
  const prompt = buildPresentationPrompt(model, fallback);
  const parsed = await runCodexExecForPlan({ prompt, model: resolved.codexModel });
  return { ...parsed, plannedBy: "codex", locale: fallback.locale };
}

async function requestOpenAiResponsesPlan(
  model: SiteModel,
  fallback: PresentationPlan,
  client: OpenAI,
  openaiModel: string
): Promise<PresentationPlan> {
  const response = await client.responses.parse({
    model: openaiModel,
    store: false,
    input: [
      {
        role: "developer",
        content: buildOpenAiDeveloperMessage()
      },
      {
        role: "user",
        content: buildOpenAiUserMessage(model, fallback)
      }
    ],
    text: {
      format: zodTextFormat(planSchema, "presentation_plan")
    }
  });

  if (!response.output_parsed) throw new Error("OpenAI returned no presentation plan.");
  return { ...response.output_parsed, plannedBy: "openai", locale: fallback.locale };
}

async function requestOpenAiChatPlan(
  model: SiteModel,
  fallback: PresentationPlan,
  client: OpenAI,
  openaiModel: string
): Promise<PresentationPlan> {
  const response = await client.chat.completions.create({
    model: openaiModel,
    messages: [
      { role: "system", content: buildOpenAiDeveloperMessage() },
      { role: "user", content: buildOpenAiUserMessage(model, fallback) }
    ]
  });

  const content = response.choices[0]?.message?.content;
  if (!content?.trim()) throw new Error("OpenAI returned no presentation plan.");
  const parsed = extractJsonFromText(content);
  return { ...parsed, plannedBy: "openai", locale: fallback.locale };
}

export async function requestOpenAiPlan(
  model: SiteModel,
  fallback: PresentationPlan,
  aiConfig: AiPlanningConfig = {}
): Promise<PresentationPlan> {
  const resolved = resolveAiPlanningConfig(aiConfig);
  if (!resolved.openaiApiKey) {
    throw new Error("OpenAI API key is not configured; using deterministic structure.");
  }

  const client = createOpenAiClient(resolved.openaiApiKey, resolved.openaiBaseUrl);
  if (resolved.openaiBaseUrl) {
    return requestOpenAiChatPlan(model, fallback, client, resolved.openaiModel);
  }
  return requestOpenAiResponsesPlan(model, fallback, client, resolved.openaiModel);
}

export async function requestAiPlan(
  model: SiteModel,
  fallback: PresentationPlan,
  aiConfig: AiPlanningConfig = {}
): Promise<PresentationPlan> {
  const resolved = resolveAiPlanningConfig(aiConfig);
  const errors: string[] = [];

  if (await isCodexAvailable()) {
    try {
      return await requestCodexPlan(model, fallback, aiConfig);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Codex planning failed");
    }
  }

  if (resolved.openaiApiKey) {
    try {
      return await requestOpenAiPlan(model, fallback, aiConfig);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "OpenAI planning failed");
    }
  } else if (!errors.length) {
    throw new Error("No AI backend is available; log in with `codex login` or provide an OpenAI API key.");
  }

  throw new Error(errors.join(" | "));
}

export type AiBackendStatus = {
  readonly codex: {
    readonly found: boolean;
    readonly loggedIn: boolean;
    readonly path: string;
    readonly detail: string;
  };
  readonly server: {
    readonly hasOpenAiKey: boolean;
    readonly hasOpenAiBaseUrl: boolean;
    readonly hasOpenAiModel: boolean;
  };
};

export function getAiBackendStatus(): AiBackendStatus {
  const codexPath = resolveCodexPath();
  const loginStatus = checkCodexLoginStatus(codexPath);
  return {
    codex: {
      found: Boolean(codexPath),
      loggedIn: loginStatus.loggedIn,
      path: loginStatus.path,
      detail: loginStatus.detail
    },
    server: {
      hasOpenAiKey: Boolean(process.env.OPENAI_API_KEY?.trim()),
      hasOpenAiBaseUrl: Boolean(process.env.OPENAI_BASE_URL?.trim()),
      hasOpenAiModel: Boolean(process.env.OPENAI_MODEL?.trim())
    }
  };
}

export async function createPresentationPlan(
  model: SiteModel,
  options: PresentationPlanningOptions = {}
): Promise<PresentationPlan> {
  const fallback = buildPresentationPlan(model, options.generationOptions);
  if (!options.useAi) return fallback;

  try {
    const planner = options.aiPlanner ?? requestAiPlan;
    const plan = await planner(model, fallback, options.aiConfig);
    return validatePresentationPlan(plan, model, options.generationOptions);
  } catch (error) {
    options.onFallback?.(error instanceof Error ? error.message : "AI planning failed");
    return fallback;
  }
}
