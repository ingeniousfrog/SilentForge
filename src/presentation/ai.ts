import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { PresentationPlan, SiteModel } from "../types.js";
import { buildPresentationPlan, validatePresentationPlan } from "./plan.js";

const sourceRefSchema = z.enum([
  "repository",
  "repository.description",
  "repository.homepage",
  "repository.language",
  "repository.license",
  "repository.stars",
  "repository.topics",
  "readme.features",
  "readme.installation",
  "readme.links",
  "readme.sections",
  "readme.summary",
  "readme.usage",
  "releases",
  "screenshots",
  "knowledgeBase.configFiles",
  "knowledgeBase.directorySummaries",
  "knowledgeBase.entryFiles",
  "knowledgeBase.fileTypeDistribution",
  "knowledgeBase.mermaid",
  "knowledgeBase.moduleMap",
  "knowledgeBase.techStack"
]);

const planSchema = z.object({
  mode: z.enum(["visual-showcase", "developer-deck", "architecture-map", "compact-story"]),
  theme: z.enum(["signal-dark", "editorial-light", "blueprint"]),
  chapters: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/),
        kind: z.enum([
          "hero",
          "features",
          "visuals",
          "usage",
          "readme-insights",
          "technology",
          "architecture",
          "resources"
        ]),
        title: z.string().min(1).max(80),
        summary: z.string().max(240).optional(),
        sourceRefs: z.array(sourceRefSchema),
        verticalDetails: z.array(z.enum(["install", "usage", "architecture", "releases", "readme"]))
      })
    )
    .min(1)
    .max(8),
  detailPages: z.array(
    z.object({
      id: z.enum(["install", "usage", "architecture", "releases", "readme"]),
      route: z.string(),
      title: z.string().min(1).max(80),
      sourceRefs: z.array(sourceRefSchema)
    })
  )
});

export type AiPlanner = (model: SiteModel, fallback: PresentationPlan) => Promise<PresentationPlan>;

export type PresentationPlanningOptions = {
  readonly useAi?: boolean;
  readonly aiPlanner?: AiPlanner;
  readonly onFallback?: (message: string) => void;
};

export async function createPresentationPlan(
  model: SiteModel,
  options: PresentationPlanningOptions = {}
): Promise<PresentationPlan> {
  const fallback = buildPresentationPlan(model);
  if (!options.useAi) return fallback;

  try {
    const planner = options.aiPlanner ?? requestOpenAiPlan;
    const plan = await planner(model, fallback);
    return validatePresentationPlan({ ...plan, plannedBy: "openai" }, model);
  } catch (error) {
    options.onFallback?.(error instanceof Error ? error.message : "OpenAI planning failed");
    return fallback;
  }
}

export async function requestOpenAiPlan(model: SiteModel, fallback: PresentationPlan): Promise<PresentationPlan> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured; using deterministic structure.");

  const client = new OpenAI({ apiKey, timeout: 15_000, maxRetries: 1 });
  const response = await client.responses.parse({
    model: process.env.OPENAI_MODEL ?? "gpt-5.5",
    store: false,
    input: [
      {
        role: "developer",
        content:
          "Arrange the supplied repository facts into a concise project presentation. Use only supplied facts and source references. Do not invent claims, URLs, commands, metrics, HTML, or CSS. Preserve only detail pages present in the fallback plan."
      },
      {
        role: "user",
        content: JSON.stringify({
          repository: model.repository,
          readme: {
            title: model.readme.title,
            summary: model.readme.summary,
            features: model.readme.features,
            hasInstallation: Boolean(model.readme.installation),
            hasUsage: Boolean(model.readme.usage),
            sectionHeadings: model.readme.sections.map((section) => section.heading)
          },
          screenshotCount: model.screenshots.length,
          releaseCount: model.releases.length,
          knowledgeBase: model.knowledgeBase,
          profile: model.profile,
          fallback
        })
      }
    ],
    text: {
      format: zodTextFormat(planSchema, "presentation_plan")
    }
  });
  if (!response.output_parsed) throw new Error("OpenAI returned no presentation plan.");
  return { ...response.output_parsed, plannedBy: "openai" };
}
