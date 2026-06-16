import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { generateAstroSite } from "../src/site/generator.js";
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
    moduleMap: [{ heading: "src", content: "Contains source files." }],
    mermaid: "graph TD\n  root[\"acme/widgetkit\"] --> src[\"src\"]"
  }
});

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { force: true, recursive: true })));
});

describe("generateAstroSite", () => {
  it("writes an editable Astro project with product pages and code wiki", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "reposite-"));
    tempDirs.push(outputDir);

    await generateAstroSite(createModel(), outputDir);

    await expect(readFile(join(outputDir, "package.json"), "utf8")).resolves.toContain("astro");
    await expect(readFile(join(outputDir, "src/pages/index.astro"), "utf8")).resolves.toContain("WidgetKit");
    await expect(readFile(join(outputDir, "src/pages/code-wiki.astro"), "utf8")).resolves.toContain("Project Structure");
    await expect(readFile(join(outputDir, "src/data/site.json"), "utf8")).resolves.toContain("acme/widgetkit");
  });

  it("does not delete user-authored files in the output directory", async () => {
    const outputDir = await mkdtemp(join(tmpdir(), "reposite-"));
    tempDirs.push(outputDir);
    await writeFile(join(outputDir, "notes.md"), "keep me", "utf8");

    await generateAstroSite(createModel(), outputDir);

    await expect(readFile(join(outputDir, "notes.md"), "utf8")).resolves.toBe("keep me");
  });
});
