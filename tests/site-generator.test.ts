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
    installation: "npm install widgetkit",
    usage: "widgetkit --help",
    faq: [{ heading: "Server?", content: "No." }],
    screenshots: [{ alt: "Screenshot", src: "https://example.com/screenshot.png" }],
    links: [{ label: "Docs", href: "https://example.com/docs" }],
    sections: []
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
      '<details class="metric license-card"'
    );
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('id="chapter-nav"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('id="next-chapter"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain('class="story"');
    await expect(readFile(join(outputDir, "index.html"), "utf8")).resolves.toContain(
      "Scroll down to explore"
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
      "diagram-error"
    );
    await expect(readFile(join(outputDir, "assets/site.js"), "utf8")).resolves.toContain(
      "requestAnimationFrame"
    );
    await expect(readFile(join(outputDir, "assets/site.css"), "utf8")).resolves.toContain(
      "scroll-behavior: smooth"
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
