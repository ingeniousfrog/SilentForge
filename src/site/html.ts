import type { PresentationChapter, PresentationPlan, SiteModel } from "../types.js";
import {
  countCommandLines,
  extractCommandPreview,
  extractMarkdownCommands,
  firstMarkdownCodeBlock,
  isMermaidCodeBlock,
  selectReadmeInsights,
  summarizeMarkdown
} from "../presentation/readme.js";
import { renderInlineMarkdown, stripInlineMarkdown } from "../shared/markdown.js";
import { htmlLang, presentationChapterKindLabel, t } from "../i18n/index.js";
import type { Locale } from "../types.js";
import { escapeHtml, safeExternalUrl } from "./security.js";

export function renderPresentation(model: SiteModel, plan: PresentationPlan): string {
  const locale = plan.locale;
  const slides = plan.chapters.map((chapter, index) => renderChapter(model, plan, chapter, index, locale)).join("");
  const navigation = renderNavigation(plan, locale);
  const description = stripInlineMarkdown(
    model.readme.summary ?? model.repository.description ?? model.repository.fullName
  );
  return `<!doctype html><html lang="${htmlLang(locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escapeHtml(
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
  index: number,
  locale: Locale
): string {
  const main = renderChapterContent(model, plan, chapter, locale);
  return `<section id="${escapeHtml(chapter.id)}" data-chapter-title="${escapeHtml(
    chapter.title
  )}">${main}${chapterFooter(plan, index, locale)}</section>`;
}

function renderChapterContent(
  model: SiteModel,
  plan: PresentationPlan,
  chapter: PresentationChapter,
  locale: Locale
): string {
  const kindLabel = presentationChapterKindLabel(locale, chapter.kind);
  const heading = `<p class="kicker">${escapeHtml(kindLabel)}</p><h${chapter.kind === "hero" ? "1" : "2"}>${escapeHtml(
    chapter.title
  )}</h${chapter.kind === "hero" ? "1" : "2"}>${renderChapterLede(model, chapter)}`;
  if (chapter.kind === "hero") {
    return `${heading}${topicTags(model)}${metrics(model, locale)}${chapterPreview(plan, locale)}<div class="hero-actions">${primaryLinks(
      model,
      locale
    )}</div>`;
  }
  if (chapter.kind === "features") {
    return `${heading}${chapterContext(
      locale,
      "featuresContextLabel",
      "featuresContextBody"
    )}<div class="content-split"><div class="card-grid feature-grid">${model.readme.features
      .slice(0, 6)
      .map(
        (feature, index) =>
          `<article class="card feature-card"><span class="section-index">${String(index + 1).padStart(
            2,
            "0"
          )}</span><p>${renderInlineMarkdown(feature)}</p></article>`
      )
      .join("")}</div>${repositorySnapshot(model, locale)}${overflowNote(
      model.readme.features.length,
      6,
      t(locale, "site.featureNotesLabel"),
      "details/readme.html",
      locale
    )}</div>`;
  }
  if (chapter.kind === "visuals") {
    const visualsBody =
      model.screenshots.length === 1
        ? t(locale, "site.visualsContextBodyOne")
        : t(locale, "site.visualsContextBodyMany", { count: model.screenshots.length });
    return `${heading}${chapterContext(locale, "visualsContextLabel", visualsBody)}<div class="shot-grid">${model.screenshots
      .slice(0, 3)
      .map((image, index) => {
        const src = safeExternalUrl(image.src);
        return src
          ? `<figure><img class="shot" src="${escapeHtml(src)}" alt="${escapeHtml(image.alt)}"><figcaption><span>${String(
              index + 1
            ).padStart(2, "0")}</span>${escapeHtml(image.alt)}</figcaption></figure>`
          : "";
      })
      .join("")}</div>`;
  }
  if (chapter.kind === "usage") {
    return `${heading}${chapterContext(
      locale,
      "usageContextLabel",
      "usageContextBody"
    )}<div class="content-split"><div class="command-stack">${commandPreview(
      locale,
      "installLabel",
      model.readme.installation
    )}${commandPreview(locale, "runLabel", model.readme.usage)}</div><aside class="evidence-panel"><span class="section-index">${escapeHtml(
      t(locale, "site.continueReading")
    )}</span>${chapterDetailLinks(plan, chapter, locale)}${commandOverflow(model, locale)}</aside></div>`;
  }
  if (chapter.kind === "readme-insights") {
    return `${heading}${chapterContext(
      locale,
      "readmeContextLabel",
      "readmeContextBody"
    )}<div class="insight-grid">${selectReadmeInsights(model.readme.sections, model.readme.title)
      .map((section) => {
        const codeBlock = firstMarkdownCodeBlock(section.content);
        return `<article class="insight-card"><span class="section-index">${escapeHtml(
          section.heading
        )}</span>${summaryParagraph(summarizeMarkdown(section.content))}${renderInsightCodeBlock(codeBlock)}</article>`;
      })
      .join("")}</div>${detailLink(plan, "readme", locale)}${readmeOverflow(model, locale)}`;
  }
  if (chapter.kind === "technology") {
    return `${heading}${chapterContext(
      locale,
      "technologyContextLabel",
      "technologyContextBody"
    )}<div class="hero-tags">${model.knowledgeBase.techStack.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div><div class="technology-layout"><div class="metric-grid">${model.knowledgeBase.fileTypeDistribution
      .slice(0, 6)
      .map(
        (item) =>
          `<div class="metric"><strong>${item.count}</strong><span>${escapeHtml(item.label)} ${escapeHtml(
            t(locale, "site.filesSuffix")
          )}</span></div>`
      )
      .join("")}</div><div class="directory-list">${model.knowledgeBase.directorySummaries
      .slice(0, 5)
      .map(
        (directory) =>
          `<article><strong>${escapeHtml(directory.path === "." ? t(locale, "workbench.repositoryRoot") : directory.path)}</strong><span>${escapeHtml(directory.summary)}</span></article>`
      )
      .join("")}</div></div>`;
  }
  if (chapter.kind === "architecture") {
    return `${heading}${chapterContext(
      locale,
      "architectureContextLabel",
      "architectureContextBody"
    )}<div class="architecture-layout"><div class="diagram-shell"><div class="mermaid">${escapeHtml(
      model.knowledgeBase.mermaid
    )}</div></div><div class="module-stack">${model.knowledgeBase.moduleMap
      .slice(0, 4)
      .map(
        (module) =>
          `<article class="module-row"><strong>${escapeHtml(module.heading)}</strong><span>${escapeHtml(module.content)}</span></article>`
      )
      .join("")}</div></div>${detailLink(plan, "architecture", locale)}`;
  }
  return `${heading}${chapterContext(
    locale,
    "resourcesContextLabel",
    "resourcesContextBody"
  )}<div class="resource-layout"><div><div class="hero-tags">${model.repository.topics
    .map((topic) => `<span class="tag">${escapeHtml(topic)}</span>`)
    .join("")}</div>${primaryLinks(model, locale)}${releaseSummary(model, locale)}</div><div class="link-grid">${plan.detailPages
    .map(
      (page) =>
        `<a class="resource-link" href="${escapeHtml(page.route)}"><span>${escapeHtml(page.title)}</span><strong>${escapeHtml(
          t(locale, "site.openLink")
        )}</strong></a>`
    )
    .join("")}${model.readme.links
    .slice(0, 4)
    .map((link) => {
      const href = safeExternalUrl(link.href);
      return href
        ? `<a class="resource-link" href="${escapeHtml(href)}" target="_blank" rel="noreferrer"><span>${escapeHtml(
            link.label
          )}</span><strong>${escapeHtml(t(locale, "site.visitLink"))}</strong></a>`
        : "";
    })
    .join("")}</div></div>`;
}

function renderNavigation(plan: PresentationPlan, locale: Locale): string {
  const pills = plan.chapters
    .map(
      (chapter, index) =>
        `<button type="button" class="chapter-pill" aria-controls="${escapeHtml(chapter.id)}" data-chapter-index="${index}">${escapeHtml(
          chapter.title
        )}</button>`
    )
    .join("");
  return `<nav id="chapter-nav" class="chapter-nav" aria-label="${escapeHtml(
    t(locale, "site.navAria")
  )}"><div class="chapter-pills">${pills}</div><div id="reading-progress" aria-hidden="true"><span></span></div></nav>`;
}

function chapterContext(locale: Locale, labelKey: string, body: string): string;
function chapterContext(locale: Locale, labelKey: string, bodyKey: string): string;
function chapterContext(locale: Locale, labelKey: string, bodyOrKey: string): string {
  const body = bodyOrKey.includes("Context") ? t(locale, `site.${bodyOrKey}`) : bodyOrKey;
  return `<div class="chapter-context"><span>${escapeHtml(t(locale, `site.${labelKey}`))}</span><p>${escapeHtml(body)}</p></div>`;
}

function chapterPreview(plan: PresentationPlan, locale: Locale): string {
  return `<div class="chapter-preview"><span class="section-index">${escapeHtml(
    t(locale, "site.onThisPage")
  )}</span>${plan.chapters
    .slice(1, 5)
    .map(
      (chapter, index) =>
        `<a href="#${escapeHtml(chapter.id)}"><span>${String(index + 2).padStart(2, "0")}</span>${escapeHtml(
          chapter.title
        )}</a>`
    )
    .join("")}</div>`;
}

function chapterFooter(plan: PresentationPlan, index: number, locale: Locale): string {
  const next = plan.chapters[index + 1];
  if (!next) {
    return `<footer class="chapter-footer"><a class="detail-link" href="#project">${escapeHtml(
      t(locale, "site.backToTop")
    )}</a></footer>`;
  }
  return `<footer class="chapter-footer"><button class="chapter-next-subtle" type="button" data-next-chapter="${
    index + 1
  }">${escapeHtml(t(locale, "site.nextPrefix"))} ${escapeHtml(next.title)} <span aria-hidden="true">→</span></button></footer>`;
}

function commandPreview(locale: Locale, labelKey: string, content?: string): string {
  const preview = extractCommandPreview(content, 5);
  if (!preview) return "";
  const totalLines = countCommandLines(content);
  const previewLines = preview.split("\n").filter((line) => line.trim().length > 0).length;
  const hiddenCount = Math.max(totalLines - previewLines, 0);
  return `<article><span class="section-index">${escapeHtml(t(locale, `site.${labelKey}`))}</span><pre><code>${escapeHtml(
    preview
  )}</code></pre>${
    hiddenCount > 0
      ? `<p class="trimmed-note">${escapeHtml(t(locale, "site.moreLines", { count: hiddenCount }))}</p>`
      : ""
  }</article>`;
}

function renderInsightCodeBlock(codeBlock: ReturnType<typeof firstMarkdownCodeBlock>): string {
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

function commandOverflow(model: SiteModel, locale: Locale): string {
  const installOverflow = Math.max(countCommandLines(model.readme.installation) - 5, 0);
  const usageOverflow = Math.max(countCommandLines(model.readme.usage) - 5, 0);
  const totalOverflow = installOverflow + usageOverflow;
  if (totalOverflow <= 0) return "";
  return `<details class="show-more"><summary>${escapeHtml(
    t(locale, "site.showMoreCommands", { count: totalOverflow })
  )}</summary><div class="show-more-body"><p>${escapeHtml(t(locale, "site.showMoreCommandsBody"))}</p></div></details>`;
}

function readmeOverflow(model: SiteModel, locale: Locale): string {
  if (model.readme.sections.length <= 0) return "";
  return `<details class="show-more"><summary>${escapeHtml(
    t(locale, "site.showMoreReadme")
  )}</summary><div class="show-more-body"><p>${escapeHtml(t(locale, "site.showMoreReadmeBody"))}</p></div></details>`;
}

function overflowNote(total: number, visible: number, label: string, href: string, locale: Locale): string {
  if (total <= visible) return "";
  return `<details class="show-more"><summary>${escapeHtml(
    t(locale, "site.showMoreItems", { count: total - visible, label })
  )}</summary><div class="show-more-body"><p><a href="${escapeHtml(href)}">${escapeHtml(
    t(locale, "site.showMoreItemsBody")
  )}</a></p></div></details>`;
}

function releaseSummary(model: SiteModel, locale: Locale): string {
  const release = model.releases[0];
  if (!release) return "";
  const href = safeExternalUrl(release.url);
  const title = escapeHtml(release.name || release.tagName);
  return `<article class="release-note"><span class="section-index">${escapeHtml(
    t(locale, "site.latestRelease")
  )}</span><strong>${
    href ? `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${title}</a>` : title
  }</strong>${release.publishedAt ? `<small>${escapeHtml(release.publishedAt)}</small>` : ""}</article>`;
}

function chapterDetailLinks(plan: PresentationPlan, chapter: PresentationChapter, locale: Locale): string {
  return chapter.verticalDetails
    .map((id) => plan.detailPages.find((page) => page.id === id))
    .filter((page) => page !== undefined)
    .map(
      (page) =>
        `<a class="resource-link" href="${escapeHtml(page.route)}"><span>${escapeHtml(page.title)}</span><strong>${escapeHtml(
          t(locale, "site.openLink")
        )}</strong></a>`
    )
    .join("");
}

function repositorySnapshot(model: SiteModel, locale: Locale): string {
  return `<aside class="evidence-panel"><span class="section-index">${escapeHtml(
    t(locale, "site.repositoryEvidence")
  )}</span><dl><div><dt>${escapeHtml(t(locale, "site.evidenceReadmeSections"))}</dt><dd>${
    model.readme.sections.length
  }</dd></div><div><dt>${escapeHtml(t(locale, "site.evidenceTrackedPaths"))}</dt><dd>${
    model.knowledgeBase.projectStructure.length
  }</dd></div><div><dt>${escapeHtml(t(locale, "site.evidenceModules"))}</dt><dd>${
    model.knowledgeBase.moduleMap.length
  }</dd></div><div><dt>${escapeHtml(t(locale, "site.evidenceConfigSignals"))}</dt><dd>${
    model.knowledgeBase.configFiles.length
  }</dd></div></dl></aside>`;
}

function metrics(model: SiteModel, locale: Locale): string {
  const licenseUrl = safeExternalUrl(
    `${model.repository.htmlUrl}/blob/${model.repository.defaultBranch}/LICENSE`
  );
  const license = model.repository.license
    ? `<details class="metric license-card"><summary><strong>${escapeHtml(
        model.repository.license.name
      )}</strong><span>${escapeHtml(t(locale, "site.licenseSummary"))}</span></summary><div class="license-detail"><p>${escapeHtml(
        t(locale, "site.licenseSpdx")
      )} ${escapeHtml(model.repository.license.spdxId ?? "not specified")}</p>${
        licenseUrl
          ? `<a href="${escapeHtml(licenseUrl)}" target="_blank" rel="noreferrer">${escapeHtml(
              t(locale, "site.readLicense")
            )}</a>`
          : ""
      }</div></details>`
    : "";
  return `<div class="metric-grid"><div class="metric"><strong>${model.repository.stars}</strong><span>${escapeHtml(
    t(locale, "site.starsLabel")
  )}</span></div>${
    model.repository.language
      ? `<div class="metric"><strong>${escapeHtml(model.repository.language)}</strong><span>${escapeHtml(
          t(locale, "site.languageLabel")
        )}</span></div>`
      : ""
  }${license}</div>`;
}

function topicTags(model: SiteModel): string {
  const tags = [...model.repository.topics, ...model.knowledgeBase.techStack].slice(0, 6);
  return tags.length > 0
    ? `<div class="hero-tags">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`
    : "";
}

function primaryLinks(model: SiteModel, locale: Locale): string {
  const links = [
    { label: t(locale, "site.githubLink"), href: safeExternalUrl(model.repository.htmlUrl) },
    { label: t(locale, "site.homepageLink"), href: safeExternalUrl(model.repository.homepage) }
  ].filter((link) => link.href);
  return links
    .map(
      (link) =>
        `<a class="detail-link" href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer">${escapeHtml(
          link.label
        )} ↗</a>`
    )
    .join("");
}

function detailLink(plan: PresentationPlan, id: string, locale: Locale): string {
  const page = plan.detailPages.find((candidate) => candidate.id === id);
  return page
    ? `<a class="detail-link" href="${escapeHtml(page.route)}">${escapeHtml(
        t(locale, "site.explorePrefix")
      )} ${escapeHtml(page.title)} →</a>`
    : "";
}
