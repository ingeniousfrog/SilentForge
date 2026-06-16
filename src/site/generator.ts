import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { SiteModel } from "../types.js";

export async function generateAstroSite(model: SiteModel, outputDir: string): Promise<void> {
  await Promise.all([
    mkdir(join(outputDir, "src", "pages"), { recursive: true }),
    mkdir(join(outputDir, "src", "layouts"), { recursive: true }),
    mkdir(join(outputDir, "src", "data"), { recursive: true }),
    mkdir(join(outputDir, "public"), { recursive: true })
  ]);

  const files = siteFiles(model);
  await Promise.all(files.map((file) => writeFile(join(outputDir, file.path), file.content, "utf8")));
}

type SiteFile = {
  readonly path: string;
  readonly content: string;
};

function siteFiles(model: SiteModel): readonly SiteFile[] {
  return [
    { path: "package.json", content: packageJson(model) },
    { path: "astro.config.mjs", content: astroConfig() },
    { path: "README.md", content: siteReadme(model) },
    { path: "src/data/site.json", content: `${JSON.stringify(model, null, 2)}\n` },
    { path: "src/layouts/BaseLayout.astro", content: baseLayout() },
    { path: "src/pages/index.astro", content: indexPage(model) },
    { path: "src/pages/install.astro", content: installPage() },
    { path: "src/pages/usage.astro", content: usagePage() },
    { path: "src/pages/releases.astro", content: releasesPage() },
    { path: "src/pages/faq.astro", content: faqPage() },
    { path: "src/pages/code-wiki.astro", content: codeWikiPage() },
    { path: "src/pages/github.astro", content: githubPage() },
    { path: "src/pages/raw-readme.astro", content: rawReadmePage() }
  ];
}

function packageJson(model: SiteModel): string {
  return `${JSON.stringify(
    {
      name: `${model.repository.name.toLowerCase()}-reposite-site`,
      version: "0.1.0",
      type: "module",
      private: true,
      scripts: {
        dev: "ASTRO_TELEMETRY_DISABLED=1 astro dev --host 127.0.0.1",
        build: "ASTRO_TELEMETRY_DISABLED=1 astro build",
        preview: "ASTRO_TELEMETRY_DISABLED=1 astro preview"
      },
      dependencies: {
        astro: "^6.4.7"
      },
      overrides: {
        esbuild: "^0.28.1"
      }
    },
    null,
    2
  )}\n`;
}

function astroConfig(): string {
  return `import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static"
});
`;
}

function siteReadme(model: SiteModel): string {
  return `# ${model.repository.name} RepoSite

This editable Astro site was generated from ${model.repository.fullName}.

## Local commands

\`\`\`sh
npm install
npm run dev
npm run build
\`\`\`

All generated content lives under \`src/pages\` and \`src/data/site.json\`.
`;
}

function baseLayout(): string {
  return `---
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f7f4ed;
        color: #182027;
      }
      body {
        margin: 0;
      }
      a {
        color: #0f6b63;
      }
      header, main, footer {
        max-width: 1120px;
        margin: 0 auto;
        padding: 24px;
      }
      nav {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        border-bottom: 1px solid #d9d4c9;
        padding-bottom: 16px;
      }
      nav a {
        text-decoration: none;
        font-weight: 650;
      }
      .hero {
        display: grid;
        gap: 20px;
        padding: 56px 0 32px;
      }
      h1 {
        max-width: 880px;
        margin: 0;
        font-size: clamp(2.4rem, 7vw, 5.2rem);
        line-height: 0.95;
      }
      h2 {
        margin-top: 44px;
      }
      .lede {
        max-width: 760px;
        font-size: 1.2rem;
        line-height: 1.7;
      }
      .grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }
      .card {
        border: 1px solid #d9d4c9;
        border-radius: 8px;
        padding: 18px;
        background: #fffdf8;
      }
      pre {
        overflow: auto;
        border-radius: 8px;
        padding: 16px;
        background: #101820;
        color: #f7f4ed;
      }
      code {
        font-family: "SFMono-Regular", Consolas, monospace;
      }
      img {
        max-width: 100%;
        border-radius: 8px;
      }
      footer {
        color: #5b6268;
      }
    </style>
  </head>
  <body>
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/install">Install</a>
        <a href="/usage">Usage</a>
        <a href="/releases">Releases</a>
        <a href="/faq">FAQ</a>
        <a href="/code-wiki">Code Wiki</a>
        <a href="/github">GitHub</a>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      Generated by RepoSite. Edit these Astro files directly before deploying.
    </footer>
  </body>
</html>
`;
}

function pagePrelude(titleExpression: string): string {
  return `${pageFrontmatter([`const title = ${titleExpression};`])}
`;
}

function pageFrontmatter(lines: readonly string[]): string {
  return `---
import BaseLayout from "../layouts/BaseLayout.astro";
import site from "../data/site.json";
${lines.join("\n")}
---
`;
}

function indexPage(model: SiteModel): string {
  const fallbackSummary =
    model.readme.summary ?? model.repository.description ?? "No project summary was documented in the repository.";

  return `${pageFrontmatter([
    "const title = site.readme.title ?? site.repository.name;",
    `const fallbackTitle = ${JSON.stringify(model.readme.title ?? model.repository.name)};`,
    `const fallbackSummary = ${JSON.stringify(fallbackSummary)};`
  ])}
<BaseLayout title={title} description={site.readme.summary ?? site.repository.description ?? site.repository.fullName}>
  <section class="hero">
    <h1>{site.readme.title ?? fallbackTitle}</h1>
    <p class="lede">{site.readme.summary ?? fallbackSummary}</p>
    <p>
      <a href={site.repository.htmlUrl}>GitHub</a>
      {site.repository.homepage && <> · <a href={site.repository.homepage}>Homepage</a></>}
    </p>
  </section>
  <section class="grid">
    <article class="card"><strong>Stars</strong><p>{site.repository.stars}</p></article>
    <article class="card"><strong>Primary language</strong><p>{site.repository.language ?? "Not documented in repository"}</p></article>
    <article class="card"><strong>License</strong><p>{site.repository.license?.name ?? "Not documented in repository"}</p></article>
  </section>
  <h2>Features</h2>
  {site.readme.features.length > 0 ? (
    <ul>{site.readme.features.map((feature) => <li>{feature}</li>)}</ul>
  ) : (
    <p>Not documented in repository.</p>
  )}
  {site.screenshots.length > 0 && (
    <>
      <h2>Screenshots</h2>
      <div class="grid">
        {site.screenshots.map((image) => <img src={image.src} alt={image.alt} />)}
      </div>
    </>
  )}
</BaseLayout>
`;
}

function installPage(): string {
  return `${pagePrelude("`Install ${site.repository.name}`")}
<BaseLayout title={title} description="Installation instructions extracted from the repository README.">
  <h1>Installation</h1>
  {site.readme.installation ? <pre><code>{site.readme.installation}</code></pre> : <p>Not documented in repository.</p>}
</BaseLayout>
`;
}

function usagePage(): string {
  return `${pagePrelude("`Use ${site.repository.name}`")}
<BaseLayout title={title} description="Usage instructions extracted from the repository README.">
  <h1>Usage</h1>
  {site.readme.usage ? <pre><code>{site.readme.usage}</code></pre> : <p>Not documented in repository.</p>}
</BaseLayout>
`;
}

function releasesPage(): string {
  return `${pagePrelude("`Releases for ${site.repository.name}`")}
<BaseLayout title={title} description="GitHub release notes.">
  <h1>Releases</h1>
  {site.releases.length > 0 ? (
    <div class="grid">
      {site.releases.map((release) => (
        <article class="card">
          <h2><a href={release.url}>{release.name || release.tagName}</a></h2>
          <p>{release.publishedAt ?? "No publish date documented."}</p>
          {release.body && <p>{release.body}</p>}
        </article>
      ))}
    </div>
  ) : (
    <p>No GitHub releases were found.</p>
  )}
</BaseLayout>
`;
}

function faqPage(): string {
  return `${pagePrelude("`FAQ for ${site.repository.name}`")}
<BaseLayout title={title} description="FAQ extracted from the repository README.">
  <h1>FAQ</h1>
  {site.readme.faq.length > 0 ? (
    site.readme.faq.map((item) => (
      <section>
        <h2>{item.heading}</h2>
        <p>{item.content || "Not documented in repository."}</p>
      </section>
    ))
  ) : (
    <p>Not documented in repository.</p>
  )}
</BaseLayout>
`;
}

function codeWikiPage(): string {
  return `${pagePrelude("`Code wiki for ${site.repository.name}`")}
<BaseLayout title={title} description="Lightweight deterministic code knowledge base.">
  <h1>Code Wiki</h1>
  <h2>Project Structure</h2>
  <ul>{site.knowledgeBase.projectStructure.map((item) => <li><code>{item}</code></li>)}</ul>
  <h2>Technology Stack</h2>
  {site.knowledgeBase.techStack.length > 0 ? <ul>{site.knowledgeBase.techStack.map((item) => <li>{item}</li>)}</ul> : <p>Not detected from repository files.</p>}
  <h2>Entry Files</h2>
  {site.knowledgeBase.entryFiles.length > 0 ? <ul>{site.knowledgeBase.entryFiles.map((item) => <li><code>{item}</code></li>)}</ul> : <p>Not detected from repository files.</p>}
  <h2>Configuration Files</h2>
  {site.knowledgeBase.configFiles.length > 0 ? (
    <div class="grid">
      {site.knowledgeBase.configFiles.map((file) => <article class="card"><strong><code>{file.path}</code></strong><p>{file.purpose}</p></article>)}
    </div>
  ) : (
    <p>No common configuration files were detected.</p>
  )}
  <h2>Module Map</h2>
  <div class="grid">
    {site.knowledgeBase.moduleMap.map((module) => <article class="card"><h3>{module.heading}</h3><p>{module.content}</p></article>)}
  </div>
  <h2>Mermaid Structure Diagram</h2>
  <pre><code>{site.knowledgeBase.mermaid}</code></pre>
</BaseLayout>
`;
}

function githubPage(): string {
  return `${pagePrelude("`${site.repository.fullName} on GitHub`")}
<BaseLayout title={title} description="Repository links and metadata.">
  <h1>GitHub</h1>
  <p><a href={site.repository.htmlUrl}>{site.repository.fullName}</a></p>
  <h2>Topics</h2>
  {site.repository.topics.length > 0 ? <ul>{site.repository.topics.map((topic) => <li>{topic}</li>)}</ul> : <p>No topics were found.</p>}
  <h2>Links</h2>
  {site.readme.links.length > 0 ? <ul>{site.readme.links.map((link) => <li><a href={link.href}>{link.label}</a></li>)}</ul> : <p>No README links were found.</p>}
</BaseLayout>
`;
}

function rawReadmePage(): string {
  return `${pagePrelude("`README sections for ${site.repository.name}`")}
<BaseLayout title={title} description="Structured README sections extracted from the repository.">
  <h1>README Sections</h1>
  {site.readme.sections.map((section) => (
    <section>
      <h2>{section.heading}</h2>
      <pre><code>{section.content}</code></pre>
    </section>
  ))}
</BaseLayout>
`;
}
