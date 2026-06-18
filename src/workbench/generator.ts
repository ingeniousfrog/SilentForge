import { fetchRepositorySnapshot } from "../github/client.js";
import { createSiteModel } from "../site/model.js";
import { createPresentationPlan } from "../presentation/ai.js";
import { generateStaticSite } from "../site/generator.js";
import type { JobStore, WorkbenchJob } from "./jobStore.js";

export async function runGenerationJob(store: JobStore, job: WorkbenchJob): Promise<void> {
  try {
    store.patch(job.id, { status: "running" });
    store.pushEvent(job.id, "step", "Parsed GitHub repository URL.");

    store.pushEvent(job.id, "step", "Fetching repository metadata, README, releases, license, topics, and file tree.");
    const snapshot = await fetchRepositorySnapshot(job.repoUrl, { token: process.env.GITHUB_TOKEN });
    store.patch(job.id, { snapshot });

    store.pushEvent(job.id, "step", `Fetched ${snapshot.files.length} repository paths and ${snapshot.releases.length} releases.`);
    store.pushEvent(job.id, "step", "Parsing README into product site sections.");
    const model = createSiteModel(snapshot);
    store.patch(job.id, { model });

    store.pushEvent(job.id, "step", "Building lightweight code knowledge base and Mermaid structure map.");
    const presentationPlan = await createPresentationPlan(model, {
      useAi: job.useAi,
      onFallback: (message) => store.pushEvent(job.id, "step", `AI structure unavailable: ${message}`)
    });
    store.pushEvent(
      job.id,
      "step",
      presentationPlan.plannedBy === "openai"
        ? "OpenAI arranged the evidence-backed presentation structure."
        : "Selected a deterministic presentation structure from repository signals."
    );
    store.pushEvent(job.id, "step", "Writing portable static presentation files.");
    await generateStaticSite(model, job.outputDir, { presentationPlan });

    store.patch(job.id, { status: "complete" });
    store.pushEvent(job.id, "complete", "Static presentation is ready to preview and download.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown generation error";
    store.patch(job.id, { status: "failed", error: message });
    store.pushEvent(job.id, "error", message);
  }
}
