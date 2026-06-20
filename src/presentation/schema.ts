import { z } from "zod";

export const sourceRefSchema = z.enum([
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

export const planSchema = z.object({
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

export type ParsedPresentationPlan = z.infer<typeof planSchema>;
