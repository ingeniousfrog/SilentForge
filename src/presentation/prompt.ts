import type { PresentationPlan, SiteModel } from "../types.js";

export const PRESENTATION_SYSTEM_INSTRUCTIONS = [
  "Arrange the supplied repository facts into a concise project presentation.",
  "Use only supplied facts and source references.",
  "Do not invent claims, URLs, commands, metrics, HTML, or CSS.",
  "Preserve only detail pages present in the fallback plan.",
  "Return only a JSON object matching the presentation plan schema.",
  "Do not wrap the JSON in markdown fences or add commentary."
].join(" ");

export function buildPresentationPayload(model: SiteModel, fallback: PresentationPlan) {
  return {
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
  };
}

export function buildPresentationPrompt(model: SiteModel, fallback: PresentationPlan): string {
  const payload = JSON.stringify(buildPresentationPayload(model, fallback));
  return [
    "System notes:",
    PRESENTATION_SYSTEM_INSTRUCTIONS,
    "",
    "Latest user message:",
    payload
  ].join("\n");
}

export function buildOpenAiDeveloperMessage(): string {
  return PRESENTATION_SYSTEM_INSTRUCTIONS;
}

export function buildOpenAiUserMessage(model: SiteModel, fallback: PresentationPlan): string {
  return JSON.stringify(buildPresentationPayload(model, fallback));
}
