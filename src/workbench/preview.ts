import type { SiteModel } from "../types.js";

export function renderPreviewHtml(model: SiteModel): string {
  const repo = model.repository;
  const readme = model.readme;
  const wiki = model.knowledgeBase;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(readme.title ?? repo.name)}</title>
    <style>
      :root {
        color-scheme: light;
        font-family: ui-serif, Georgia, "Times New Roman", serif;
        background: #f7f4ed;
        color: #182027;
      }
      body { margin: 0; }
      main { max-width: 1040px; margin: 0 auto; padding: 28px; }
      nav { display: flex; gap: 14px; flex-wrap: wrap; border-bottom: 1px solid #d9d4c9; padding-bottom: 16px; }
      a { color: #0f6b63; }
      h1 { font-size: clamp(40px, 8vw, 92px); line-height: 0.9; margin: 42px 0 18px; }
      h2 { margin-top: 44px; }
      .lede { font-size: 21px; line-height: 1.65; max-width: 760px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; }
      .card { border: 1px solid #d9d4c9; border-radius: 8px; padding: 16px; background: #fffdf8; }
      pre { overflow: auto; border-radius: 8px; padding: 16px; background: #101820; color: #f7f4ed; }
      code { font-family: ui-monospace, "SFMono-Regular", Menlo, monospace; }
    </style>
  </head>
  <body>
    <main>
      <nav>
        <a href="${escapeAttribute(repo.htmlUrl)}" target="_blank" rel="noreferrer">GitHub</a>
        ${repo.homepage ? `<a href="${escapeAttribute(repo.homepage)}" target="_blank" rel="noreferrer">Homepage</a>` : ""}
      </nav>
      <h1>${escapeHtml(readme.title ?? repo.name)}</h1>
      <p class="lede">${escapeHtml(readme.summary ?? repo.description ?? "No project summary was documented in the repository.")}</p>
      <section class="grid">
        <article class="card"><strong>Stars</strong><p>${repo.stars}</p></article>
        <article class="card"><strong>Language</strong><p>${escapeHtml(repo.language ?? "Not documented in repository")}</p></article>
        <article class="card"><strong>License</strong><p>${escapeHtml(repo.license?.name ?? "Not documented in repository")}</p></article>
      </section>
      <h2>Features</h2>
      ${listOrEmpty(readme.features)}
      <h2>Installation</h2>
      ${readme.installation ? `<pre>${escapeHtml(readme.installation)}</pre>` : `<p>Not documented in repository.</p>`}
      <h2>Usage</h2>
      ${readme.usage ? `<pre>${escapeHtml(readme.usage)}</pre>` : `<p>Not documented in repository.</p>`}
      <h2>Code Wiki</h2>
      <div class="grid">
        <article class="card"><strong>Stack</strong>${listOrEmpty(wiki.techStack)}</article>
        <article class="card"><strong>Entry Files</strong>${listOrEmpty(wiki.entryFiles)}</article>
      </div>
      <h2>Mermaid Structure</h2>
      <pre>${escapeHtml(wiki.mermaid)}</pre>
    </main>
  </body>
</html>`;
}

function listOrEmpty(items: readonly string[]): string {
  return items.length > 0
    ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "<p>Not documented in repository.</p>";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => escapeMap[char] ?? char);
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

const escapeMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
