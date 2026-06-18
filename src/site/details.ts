import type { PresentationDetailPage, PresentationPlan, SiteModel } from "../types.js";
import { firstCodeBlock, summarizeMarkdown } from "../presentation/readme.js";
import { escapeHtml, safeExternalUrl } from "./security.js";

export function renderDetailPage(model: SiteModel, plan: PresentationPlan, page: PresentationDetailPage): string {
  const content = detailContent(model, page.id);
  return document(
    model,
    plan,
    `<a class="back" href="../index.html">← Presentation</a><main class="detail-shell"><p class="kicker">${escapeHtml(
      model.repository.fullName
    )}</p><h1>${escapeHtml(page.title)}</h1>${content}</main>`
  );
}

function detailContent(model: SiteModel, id: PresentationDetailPage["id"]): string {
  if (id === "install") return codeBlock(model.readme.installation);
  if (id === "usage") return codeBlock(model.readme.usage);
  if (id === "releases") {
    return model.releases
      .map((release) => {
        const url = safeExternalUrl(release.url);
        const title = url
          ? `<a href="${escapeHtml(url)}" rel="noreferrer">${escapeHtml(release.name || release.tagName)}</a>`
          : escapeHtml(release.name || release.tagName);
        return `<article class="card"><h2>${title}</h2><p>${escapeHtml(release.publishedAt ?? "")}</p><p>${escapeHtml(
          release.body ?? ""
        )}</p></article>`;
      })
      .join("");
  }
  if (id === "readme") {
    return model.readme.sections
      .map((section) => {
        const code = firstCodeBlock(section.content);
        return `<section class="card"><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(
          summarizeMarkdown(section.content, 420)
        )}</p>${codeBlock(code)}</section>`;
      })
      .join("");
  }
  return `<h2>Top-level structure</h2>${list(model.knowledgeBase.projectStructure)}
    <h2>Entry files</h2>${list(model.knowledgeBase.entryFiles)}
    <h2>Repository map</h2><div class="mermaid">${escapeHtml(model.knowledgeBase.mermaid)}</div>
    <h2>Modules</h2><div class="card-grid">${model.knowledgeBase.moduleMap
      .map((module) => `<article class="card"><strong>${escapeHtml(module.heading)}</strong><p>${escapeHtml(module.content)}</p></article>`)
      .join("")}</div><details><summary>Mermaid source</summary>${codeBlock(model.knowledgeBase.mermaid)}</details>`;
}

function document(model: SiteModel, plan: PresentationPlan, body: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escapeHtml(
    model.readme.summary ?? model.repository.description ?? model.repository.fullName
  )}"><title>${escapeHtml(model.repository.name)}</title><link rel="stylesheet" href="../assets/site.css"></head><body data-theme="${escapeHtml(
    plan.theme
  )}">${body}<script src="../assets/mermaid.js"></script><script src="../assets/site.js"></script></body></html>`;
}

function codeBlock(value: string | undefined): string {
  return value ? `<pre><code>${escapeHtml(value)}</code></pre>` : "";
}

function list(items: readonly string[]): string {
  return items.length > 0 ? `<ul>${items.map((item) => `<li><code>${escapeHtml(item)}</code></li>`).join("")}</ul>` : "";
}
