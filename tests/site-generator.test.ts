import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { generateStaticSite } from "../src/site/generator.js";
import type { SiteModel } from "../src/types.js";

const tempDirs: string[] = [];

const createModel = (): SiteModel => ({
  generatedAt: "2026-06-16T00:00:00.000Z",
  repository: {
    owner: "acme",
    name: "widgetkit",
    fullName: "acme/widgetkit",
    description: "Tiny widgets",
    htmlUrl: "https://github.com/acme/widgetkit",
    homepage: "https://example.com",
    defaultBranch: "main",
    stars: 42,
    topics: ["widgets"],
    language: "TypeScript",
    license: { name: "MIT", spdxId: "MIT" }
  },
  readme: {
    title: "WidgetKit",
    summary: "Tiny widgets for dashboards.",
    features: ["Fast rendering"],
    installation: [
      "npm install widgetkit",
      "widgetkit prepare",
      "widgetkit check",
      "widgetkit build",
      "widgetkit preview",
      "widgetkit publish",
      "widgetkit audit",
      "widgetkit clean",
      "widgetkit doctor",
      "widgetkit report"
    ].join("\n"),
    usage: [
      "widgetkit --help",
      "widgetkit init dashboard",
      "widgetkit add chart",
      "widgetkit add table",
      "widgetkit add filter",
      "widgetkit sync",
      "widgetkit export",
      "widgetkit deploy"
    ].join("\n"),
    faq: [{ heading: "Server?", content: "No." }],
    screenshots: [{ alt: "Screenshot", src: "https://example.com/screenshot.png" }],
    links: [{ label: "Docs", href: "https://example.com/docs" }],
    sections: [
      {
        heading: "Long configuration guide",
        content: [
          "This guide explains the dashboard configuration lifecycle in detail.",
          "```sh",
          "widgetkit configure alpha",
          "widgetkit configure beta",
          "widgetkit configure gamma",
          "widgetkit configure delta",
          "widgetkit configure epsilon",
          "widgetkit configure zeta",
          "widgetkit configure eta",
          "widgetkit configure theta",
          "```"
        ].join("\n")
      },
      {
        heading: "Architecture",
        content: [
          "```mermaid",
          "flowchart TD",
          "  Registry[\"Widget registry\"] --> Panel[\"Dashboard panel\"]",
          "```"
        ].join("\n")
      }
    ]
  },
  releases: [{ name: "v1.0.0", tagName: "v1.0.0", url: "https://github.com/acme/widgetkit/releases/tag/v1.0.0" }],
  screenshots: [{ alt: "Screenshot", src: "https://example.com/screenshot.png" }],
  knowledgeBase: {
    projectStructure: ["src", "package.json"],
    techStack: ["TypeScript", "Astro"],
    entryFiles: ["src/index.ts"],
    configFiles: [{ path: "package.json", purpose: "Node.js package manifest and scripts" }],
    fileTypeDistribution: [
      { label: ".ts", count: 1 },
      { label: ".json", count: 1 }
    ],
    directorySummaries: [
      {
        path: "src",
        fileCount: 1,
        configCount: 0,
        entryCount: 1,
        summary: "src contains 1 tracked file, 1 detected entry."
      }
    ],
    readmeCoverage: {
      hasTitle: true,
      hasSummary: true,
      featureCount: 1,
      hasInstallation: true,
      hasUsage: true,
      faqCount: 1,
      screenshotCount: 1,
      sectionCount: 0
    },
    detectionSignals: [
      {
        label: "README coverage",
        value: "title, summary, features, installation, usage, FAQ, screenshots",
        confidence: "high",
        source: "Parsed README sections"
      }
    ],
    moduleMap: [{ heading: "src", content: "Contains source files." }],
    mermaid: "graph TD\n  root[\"acme/widgetkit\"] --> src[\"src\"]"
  },
  profile: {
    richnessScore: 8,
    hasVisualStory: true,
    hasDeveloperJourney: true,
    hasArchitectureDepth: true,
    readmeInsightCount: 1
  }
});

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { force: true, recursive: true })));
});

describe("generateStaticSite", () => {
  it("writes a portable presentation site with local runtime assets and detail pages", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "reposite-"));
    tempDirs.push(outputDir);

    await generateStaticSite(createModel(), outputDir);

    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain("WidgetKit");
    await expect(readFile(join(outputDir, "assets/reveal.js"), "utf8")).resolves.toContain("Reveal");
    await expect(readFile(join(outputDir, "assets/mermaid.js"), "utf8")).resolves.toContain("mermaid");
    await expect(readFile(join(outputDir, "details/architecture.html"), "utf8")).resolves.toContain("Architecture");
    await expect(readFile(join(outputDir, "data/site.json"), "utf8")).resolves.toContain("presentationPlan");
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('class="mermaid"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain(
      'class="insight-diagram mermaid"'
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain(
      "<code>flowchart TD"
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain(
      '<span class="section-index">Architecture</span><p></p><div class="insight-diagram mermaid"'
    );
    await expect(readFile(join(outputDir, "details/readme.html"), "utf8")).resolves.toContain(
      'class="readme-diagram mermaid"'
    );
    await expect(readFile(join(outputDir, "details/readme.html"), "utf8")).resolves.not.toContain(
      "<pre><code>flowchart TD"
    );
    await expect(readFile(join(outputDir, "details/readme.html"), "utf8")).resolves.not.toContain(
      "<h2>Architecture</h2><p></p><div"
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain(
      '<details class="metric license-card"'
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('id="chapter-nav"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain('id="next-chapter"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain('id="previous-chapter"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain('id="chapter-count"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain('class="chapter-controls"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('class="chapter-tabs"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('class="category-menu"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('data-category-key="overview"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('data-category-key="resources"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('data-category-key="code-wiki"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('data-category-key="preview"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain("<summary>Overview</summary>");
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain("<summary>Resources</summary>");
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain("<summary>Code Wiki</summary>");
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain("<summary>Preview</summary>");
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain(
      'data-slide-index="3">From clone to first run</button>'
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain(
      'data-slide-index="4">Inside the project</button>'
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain(
      'data-slide-index="7">Keep exploring</button>'
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain(
      'data-slide-index="3"><span>04</span>'
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain(
      'data-slide-index="4"><span>05</span>'
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain(
      'data-slide-index="7"><span>08</span>'
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain('role="tablist"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain('role="tab"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('class="chapter-footer"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('data-next-chapter="');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('class="chapter-more"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('class="story"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain(
      "Use the chapter tabs"
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain(
      "Scroll down"
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain(
      'class="chapter-context"'
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain(
      "<section><section"
    );
    await expect(readFile(join(outputDir, "assets/site.js"), "utf8")).resolves.toContain(
      "IntersectionObserver"
    );
    await expect(readFile(join(outputDir, "assets/site.js"), "utf8")).resolves.toContain(
      "ArrowRight"
    );
    await expect(readFile(join(outputDir, "assets/site.js"), "utf8")).resolves.toContain(
      "[data-next-chapter]"
    );
    await expect(readFile(join(outputDir, "assets/site.js"), "utf8")).resolves.toContain(
      "document.readyState"
    );
    await expect(readFile(join(outputDir, "assets/site.js"), "utf8")).resolves.toContain(
      "toggle"
    );
    await expect(readFile(join(outputDir, "assets/site.js"), "utf8")).resolves.toContain(
      "diagram-error"
    );
    await expect(readFile(join(outputDir, "assets/site.js"), "utf8")).resolves.toContain(
      "requestAnimationFrame"
    );
    await expect(readFile(join(outputDir, "assets/site.css"), "utf8")).resolves.toContain(
      "scroll-behavior: smooth"
    );
    await expect(readFile(join(outputDir, "assets/site.css"), "utf8")).resolves.toContain(
      "position: sticky"
    );
    await expect(readFile(join(outputDir, "assets/site.css"), "utf8")).resolves.not.toContain(
      "overflow-x: auto"
    );
    await expect(readFile(join(outputDir, "assets/site.css"), "utf8")).resolves.not.toContain(
      "padding-right: 304px"
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.not.toContain(
      "widgetkit configure theta"
    );
  });

  it("does not delete user-authored files in the output directory", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "reposite-"));
    tempDirs.push(outputDir);
    await writeFile(join(outputDir, "notes.md"), "keep me", "utf8");

    await generateStaticSite(createModel(), outputDir);

    await expect(readFile(join(outputDir, "notes.md"), "utf8")).resolves.toBe("keep me");
  });
});
