import type { PresentationChapter, PresentationPlan, SiteModel } from "../types.js";
import {
  firstMarkdownCodeBlock,
  isMermaidCodeBlock,
  selectReadmeInsights,
  summarizeMarkdown
} from "../presentation/readme.js";
import { renderInlineMarkdown, stripInlineMarkdown } from "../shared/markdown.js";
import { escapeHtml, safeExternalUrl } from "./security.js";

export function renderPresentation(model: SiteModel, plan: PresentationPlan): string {
  const slides = plan.chapters.map((chapter, index) => renderChapter(model, plan, chapter, index)).join("");
  const navigation = renderNavigation(plan);
  const description = stripInlineMarkdown(
    model.readme.summary ?? model.repository.description ?? model.repository.fullName
  );
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escapeHtml(
    description
  )}"><title>${escapeHtml(model.readme.title ?? model.repository.name)}</title><link rel="stylesheet" href="assets/site.css"></head><body data-theme="${escapeHtml(
    plan.theme
  )}" class="story"><div class="site-badge">${escapeHtml(
    model.repository.fullName
  )} · ${escapeHtml(plan.mode)}</div>${navigation}<main class="story-chapters">${slides}</main><script src="assets/mermaid.js"></script><script src="assets/site.js"></script></body></html>`;
}

function renderChapter(
  model: SiteModel,
  plan: PresentationPlan,
  chapter: PresentationChapter,
  index: number
): string {
  const main = renderChapterContent(model, plan, chapter);
  return `<section id="${escapeHtml(chapter.id)}" data-chapter-title="${escapeHtml(
    chapter.title
  )}">${main}${chapterFooter(plan, index)}</section>`;
}

function renderChapterContent(model: SiteModel, plan: PresentationPlan, chapter: PresentationChapter): string {
  const heading = `<p class="kicker">${escapeHtml(chapter.kind)}</p><h${chapter.kind === "hero" ? "1" : "2"}>${escapeHtml(
    chapter.title
  )}</h${chapter.kind === "hero" ? "1" : "2"}>${renderChapterLede(model, chapter)}`;
  if (chapter.kind === "hero") return `${heading}${topicTags(model)}${metrics(model)}${chapterPreview(
    plan
  )}<div class="hero-actions">${primaryLinks(model)}</div>`;
  if (chapter.kind === "features") return `${heading}${chapterContext(
    "README capabilities",
    "These points come directly from the repository README, paired with structural signals from the codebase."
  )}<div class="content-split"><div class="card-grid feature-grid">${model.readme.features
    .slice(0, 6)
    .map(
      (feature, index) =>
        `<article class="card feature-card"><span class="section-index">${String(index + 1).padStart(
          2,
          "0"
        )}</span><p>${renderInlineMarkdown(feature)}</p></article>`
    )
    .join("")}</div>${repositorySnapshot(model)}${overflowNote(
    model.readme.features.length,
    6,
    "feature notes",
    "details/readme.html"
  )}</div>`;
  if (chapter.kind === "visuals") return `${heading}${chapterContext(
    "Repository visuals",
    `${model.screenshots.length} visual ${model.screenshots.length === 1 ? "asset was" : "assets were"} detected in README and repository paths.`
  )}<div class="shot-grid">${model.screenshots.slice(0, 3).map((image, index) => {
    const src = safeExternalUrl(image.src);
    return src ? `<figure><img class="shot" src="${escapeHtml(src)}" alt="${escapeHtml(image.alt)}"><figcaption><span>${String(
      index + 1
    ).padStart(2, "0")}</span>${escapeHtml(image.alt)}</figcaption></figure>` : "";
  }).join("")}</div>`;
  if (chapter.kind === "usage") return `${heading}${chapterContext(
    "Developer path",
    "The commands below are extracted from the project documentation; open the detail pages for the fuller source sections."
  )}<div class="content-split"><div class="command-stack">${commandPreview(
    "Install",
    model.readme.installation
  )}${commandPreview(
    "Run",
    model.readme.usage
  )}</div><aside class="evidence-panel"><span class="section-index">Continue reading</span>${chapterDetailLinks(
    plan,
    chapter
  )}${commandOverflow(model)}</aside></div>`;
  if (chapter.kind === "readme-insights") return `${heading}${chapterContext(
    "Documentation depth",
    "Longer README sections are condensed here so the main page remains readable without hiding the underlying material."
  )}<div class="insight-grid">${selectReadmeInsights(
    model.readme.sections,
    model.readme.title
  )
    .map((section) => {
      const codeBlock = firstMarkdownCodeBlock(section.content);
      return `<article class="insight-card"><span class="section-index">${escapeHtml(
        section.heading
      )}</span>${summaryParagraph(summarizeMarkdown(section.content))}${renderInsightCodeBlock(codeBlock)}</article>`;
    })
    .join("")}</div>${detailLink(plan, "readme")}${readmeOverflow(model)}`;
  if (chapter.kind === "technology") return `${heading}${chapterContext(
    "Detected stack",
    "Technology labels are inferred from configuration files and file extensions, then checked against repository structure."
  )}<div class="hero-tags">${model.knowledgeBase.techStack.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div><div class="technology-layout"><div class="metric-grid">${model.knowledgeBase.fileTypeDistribution.slice(0, 6).map((item) => `<div class="metric"><strong>${item.count}</strong><span>${escapeHtml(item.label)} files</span></div>`).join("")}</div><div class="directory-list">${model.knowledgeBase.directorySummaries.slice(0, 5).map((directory) => `<article><strong>${escapeHtml(directory.path)}</strong><span>${escapeHtml(directory.summary)}</span></article>`).join("")}</div></div>`;
  if (chapter.kind === "architecture") return `${heading}${chapterContext(
    "Structure map",
    "The diagram and module notes are generated from tracked repository paths, not invented project relationships."
  )}<div class="architecture-layout"><div class="diagram-shell"><div class="mermaid">${escapeHtml(
    model.knowledgeBase.mermaid
  )}</div></div><div class="module-stack">${model.knowledgeBase.moduleMap
    .slice(0, 4)
    .map(
      (module) =>
        `<article class="module-row"><strong>${escapeHtml(module.heading)}</strong><span>${escapeHtml(module.content)}</span></article>`
    )
    .join("")}</div></div>${detailLink(plan, "architecture")}`;
  return `${heading}${chapterContext(
    "Source material",
    "Move from this guided overview into generated evidence pages, repository destinations, and README links."
  )}<div class="resource-layout"><div><div class="hero-tags">${model.repository.topics
    .map((topic) => `<span class="tag">${escapeHtml(topic)}</span>`)
    .join("")}</div>${primaryLinks(model)}${releaseSummary(model)}</div><div class="link-grid">${plan.detailPages.map((page) => `<a class="resource-link" href="${escapeHtml(page.route)}"><span>${escapeHtml(page.title)}</span><strong>Open →</strong></a>`).join("")}${model.readme.links.slice(0, 4).map((link) => {
    const href = safeExternalUrl(link.href);
    return href ? `<a class="resource-link" href="${escapeHtml(href)}" target="_blank" rel="noreferrer"><span>${escapeHtml(link.label)}</span><strong>Visit ↗</strong></a>` : "";
  }).join("")}</div></div>`;
}

function renderNavigation(plan: PresentationPlan): string {
  const pills = plan.chapters
    .map(
      (chapter, index) =>
        `<button type="button" class="chapter-pill" aria-controls="${escapeHtml(chapter.id)}" data-chapter-index="${index}">${escapeHtml(
          chapter.title
        )}</button>`
    )
    .join("");
  return `<nav id="chapter-nav" class="chapter-nav" aria-label="Page chapters"><div class="chapter-pills">${pills}</div><div id="reading-progress" aria-hidden="true"><span></span></div></nav>`;
}

function chapterContext(label: string, description: string): string {
  return `<div class="chapter-context"><span>${escapeHtml(label)}</span><p>${escapeHtml(description)}</p></div>`;
}

function chapterPreview(plan: PresentationPlan): string {
  return `<div class="chapter-preview"><span class="section-index">On this page</span>${plan.chapters
    .slice(1, 5)
    .map(
      (chapter, index) =>
        `<a href="#${escapeHtml(chapter.id)}"><span>${String(index + 2).padStart(2, "0")}</span>${escapeHtml(
          chapter.title
        )}</a>`
    )
    .join("")}</div>`;
}

function chapterFooter(plan: PresentationPlan, index: number): string {
  const next = plan.chapters[index + 1];
  if (!next) return `<footer class="chapter-footer"><a class="detail-link" href="#project">Back to top ↑</a></footer>`;
  return `<footer class="chapter-footer"><button class="chapter-next-subtle" type="button" data-next-chapter="${
    index + 1
  }">Next: ${escapeHtml(next.title)} <span aria-hidden="true">→</span></button></footer>`;
}

function commandPreview(label: string, content?: string): string {
  if (!content) return "";
  const lines = content.split("\n").filter((line) => line.trim().length > 0);
  const preview = lines.slice(0, 5).join("\n");
  const hiddenCount = Math.max(lines.length - 5, 0);
  return `<article><span class="section-index">${escapeHtml(label)}</span><pre><code>${escapeHtml(
    preview
  )}</code></pre>${hiddenCount > 0 ? `<p class="trimmed-note">+ ${hiddenCount} more lines in detail pages</p>` : ""}</article>`;
}

function renderInsightCodeBlock(
  codeBlock: ReturnType<typeof firstMarkdownCodeBlock>
): string {
  if (!codeBlock) return "";
  if (isMermaidCodeBlock(codeBlock)) {
    return `<div class="insight-diagram mermaid">${escapeHtml(codeBlock.code)}</div>`;
  }
  return `<code>${escapeHtml(codeBlock.code.split("\n").slice(0, 3).join("\n"))}</code>`;
}

function renderChapterLede(model: SiteModel, chapter: PresentationChapter): string {
  const summary =
    chapter.kind === "hero"
      ? model.readme.summary ?? model.repository.description ?? chapter.summary
      : chapter.summary;
  if (!summary) return "";
  return `<p class="lede">${renderInlineMarkdown(summary)}</p>`;
}

function summaryParagraph(summary: string): string {
  return summary.trim().length > 0 ? `<p>${renderInlineMarkdown(summary)}</p>` : "";
}

function commandOverflow(model: SiteModel): string {
  const installOverflow = Math.max((model.readme.installation?.split("\n").length ?? 0) - 5, 0);
  const usageOverflow = Math.max((model.readme.usage?.split("\n").length ?? 0) - 5, 0);
  const totalOverflow = installOverflow + usageOverflow;
  if (totalOverflow <= 0) return "";
  return `<details class="show-more"><summary>Show ${totalOverflow} more command lines</summary><div class="show-more-body"><p>Open the installation and usage detail pages for the full commands.</p></div></details>`;
}

function readmeOverflow(model: SiteModel): string {
  if (model.readme.sections.length <= 0) return "";
  return `<details class="show-more"><summary>Show full README sections</summary><div class="show-more-body"><p>The overview keeps only summaries and short code previews so this chapter stays scannable.</p></div></details>`;
}

function overflowNote(total: number, visible: number, label: string, href: string): string {
  if (total <= visible) return "";
  return `<details class="show-more"><summary>Show ${total - visible} more ${label}</summary><div class="show-more-body"><p><a href="${escapeHtml(
    href
  )}">Open the detail page for the full list.</a></p></div></details>`;
}

function releaseSummary(model: SiteModel): string {
  const release = model.releases[0];
  if (!release) return "";
  const href = safeExternalUrl(release.url);
  const title = escapeHtml(release.name || release.tagName);
  return `<article class="release-note"><span class="section-index">Latest repository release</span><strong>${
    href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${title}</a>` : title
  }</strong>${release.publishedAt ? `<small>${escapeHtml(release.publishedAt)}</small>` : ""}</article>`;
}

function chapterDetailLinks(plan: PresentationPlan, chapter: PresentationChapter): string {
  return chapter.verticalDetails
    .map((id) => plan.detailPages.find((page) => page.id === id))
    .filter((page) => page !== undefined)
    .map((page) => `<a class="resource-link" href="${escapeHtml(page.route)}"><span>${escapeHtml(page.title)}</span><strong>Open →</strong></a>`)
    .join("");
}

function repositorySnapshot(model: SiteModel): string {
  return `<aside class="evidence-panel"><span class="section-index">Repository evidence</span><dl><div><dt>README sections</dt><dd>${model.readme.sections.length}</dd></div><div><dt>Tracked paths</dt><dd>${model.knowledgeBase.projectStructure.length}</dd></div><div><dt>Detected modules</dt><dd>${model.knowledgeBase.moduleMap.length}</dd></div><div><dt>Config signals</dt><dd>${model.knowledgeBase.configFiles.length}</dd></div></dl></aside>`;
}

function metrics(model: SiteModel): string {
  const licenseUrl = safeExternalUrl(
    `${model.repository.htmlUrl}/blob/${model.repository.defaultBranch}/LICENSE`
  );
  const license = model.repository.license
    ? `<details class="metric license-card"><summary><strong>${escapeHtml(
        model.repository.license.name
      )}</strong><span>License · click to expand</span></summary><div class="license-detail"><p>SPDX: ${escapeHtml(
        model.repository.license.spdxId ?? "not specified"
      )}</p>${licenseUrl ? `<a href="${escapeHtml(licenseUrl)}" target="_blank" rel="noreferrer">Read repository license ↗</a>` : ""}</div></details>`
    : "";
  return `<div class="metric-grid"><div class="metric"><strong>${model.repository.stars}</strong><span>GitHub stars</span></div>${
    model.repository.language
      ? `<div class="metric"><strong>${escapeHtml(model.repository.language)}</strong><span>Primary language</span></div>`
      : ""
  }${license}</div>`;
}

function topicTags(model: SiteModel): string {
  const tags = [...model.repository.topics, ...model.knowledgeBase.techStack].slice(0, 6);
  return tags.length > 0
    ? `<div class="hero-tags">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`
    : "";
}

function primaryLinks(model: SiteModel): string {
  const links = [
    { label: "GitHub", href: safeExternalUrl(model.repository.htmlUrl) },
    { label: "Homepage", href: safeExternalUrl(model.repository.homepage) }
  ].filter((link) => link.href);
  return links.map((link) => `<a class="detail-link" href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)} ↗</a>`).join("");
}

function detailLink(plan: PresentationPlan, id: string): string {
  const page = plan.detailPages.find((candidate) => candidate.id === id);
  return page ? `<a class="detail-link" href="${escapeHtml(page.route)}">Explore ${escapeHtml(page.title)} →</a>` : "";
}
