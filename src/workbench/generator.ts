import { fetchRepositorySnapshot } from "../github/client.js";
import { createSiteModel } from "../site/model.js";
import { createPresentationPlan } from "../presentation/ai.js";
import { generateStaticSite } from "../site/generator.js";
import { resolveGenerationLocale, t } from "../i18n/index.js";
import type { JobStore, WorkbenchJob } from "./jobStore.js";

export async function runGenerationJob(store: JobStore, job: WorkbenchJob): Promise<void> {
  const locale = resolveGenerationLocale(job.generationOptions);

  try {
    store.patch(job.id, { status: "running" });
    store.pushEvent(job.id, "step", t(locale, "generator.parsedUrl"));

    store.pushEvent(job.id, "step", t(locale, "generator.fetching"));
    const snapshot = await fetchRepositorySnapshot(job.repoUrl, {
      token: job.githubToken ?? process.env.GITHUB_TOKEN
    });
    store.patch(job.id, { snapshot });

    store.pushEvent(
      job.id,
      "step",
      t(locale, "generator.fetchedPaths", { files: snapshot.files.length, releases: snapshot.releases.length })
    );
    store.pushEvent(job.id, "step", t(locale, "generator.parsingReadme"));
    const model = createSiteModel(snapshot, new Date(), locale);
    store.patch(job.id, { model });

    store.pushEvent(job.id, "step", t(locale, "generator.buildingWiki"));
    const presentationPlan = await createPresentationPlan(model, {
      useAi: job.useAi,
      generationOptions: job.generationOptions,
      onFallback: (message) => store.pushEvent(job.id, "step", t(locale, "generator.aiFallback", { message }))
    });
    store.pushEvent(
      job.id,
      "step",
      presentationPlan.plannedBy === "openai" ? t(locale, "generator.aiPlanned") : t(locale, "generator.rulesPlanned")
    );
    store.pushEvent(job.id, "step", t(locale, "generator.writingFiles"));
    await generateStaticSite(model, job.outputDir, { presentationPlan });

    store.patch(job.id, { status: "complete" });
    store.pushEvent(job.id, "complete", t(locale, "generator.complete"));
  } catch (error) {
    const message = error instanceof Error ? error.message : t(locale, "generator.unknownError");
    store.patch(job.id, { status: "failed", error: message });
    store.pushEvent(job.id, "error", message);
  }
}
