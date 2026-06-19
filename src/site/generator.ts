import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { PresentationPlan, SiteModel } from "../types.js";
import { buildPresentationPlan, validatePresentationPlan } from "../presentation/plan.js";
import { presentationBootScript, presentationCss } from "./assets.js";
import { renderDetailPage } from "./details.js";
import { renderPresentation } from "./html.js";

const require = createRequire(import.meta.url);

export type StaticSiteOptions = {
  readonly presentationPlan?: PresentationPlan;
};

export async function generateStaticSite(model: SiteModel, outputDir: string, options: StaticSiteOptions = {}): Promise<void> {
  const plan = validatePresentationPlan(options.presentationPlan ?? buildPresentationPlan(model), model);
  const mermaidScriptPath = require.resolve("mermaid/dist/mermaid.min.js");
  const files = [
    { path: "index.html", content: renderPresentation(model, plan) },
    { path: "assets/mermaid.js", content: await readFile(mermaidScriptPath, "utf8") },
    { path: "assets/site.css", content: presentationCss() },
    { path: "assets/site.js", content: presentationBootScript() },
    { path: "data/site.json", content: `${JSON.stringify({ ...model, presentationPlan: plan }, null, 2)}\n` },
    { path: "README.md", content: siteReadme(model) },
    ...plan.detailPages.map((page) => ({ path: page.route, content: renderDetailPage(model, plan, page) }))
  ];

  await Promise.all(
    files.map(async (file) => {
      const path = join(outputDir, file.path);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, file.content, "utf8");
    })
  );
}

function siteReadme(model: SiteModel): string {
  return `# ${model.repository.name} presentation site

This portable static presentation was generated from ${model.repository.fullName}.

Open \`index.html\` directly, or serve this directory with any static file server. No build step or external CDN is required.

Edit the HTML, CSS, JavaScript, or \`data/site.json\` files directly before deployment.
`;
}
