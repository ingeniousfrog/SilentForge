import { fetchRepositorySnapshot } from "../github/client.js";
import { createSiteModel } from "../site/model.js";
import { generateAstroSite } from "../site/generator.js";
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
    store.pushEvent(job.id, "step", "Writing editable Astro project files.");
    await generateAstroSite(model, job.outputDir);

    store.patch(job.id, { status: "complete" });
    store.pushEvent(job.id, "complete", "RepoSite project is ready to preview and download.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown generation error";
    store.patch(job.id, { status: "failed", error: message });
    store.pushEvent(job.id, "error", message);
  }
}
