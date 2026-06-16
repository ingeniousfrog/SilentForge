import { describe, expect, it } from "vitest";
import { renderPreviewHtml } from "../src/workbench/preview.js";
import type { SiteModel } from "../src/types.js";

describe("renderPreviewHtml", () => {
  it("renders an escaped preview from the generated site model", () => {
    const html = renderPreviewHtml({
      repository: {
        owner: "acme",
        name: "widgetkit",
        fullName: "acme/widgetkit",
        htmlUrl: "https://github.com/acme/widgetkit",
        defaultBranch: "main",
        stars: 1,
        topics: []
      },
      readme: {
        title: "<WidgetKit>",
        summary: "Tiny widgets",
        features: ["Fast"],
        faq: [],
        screenshots: [],
        links: [],
        sections: []
      },
      releases: [],
      screenshots: [],
      knowledgeBase: {
        projectStructure: [],
        techStack: ["TypeScript"],
        entryFiles: ["src/index.ts"],
        configFiles: [],
        moduleMap: [],
        mermaid: "graph TD"
      },
      generatedAt: "2026-06-16T00:00:00.000Z"
    } satisfies SiteModel);

    expect(html).toContain("&lt;WidgetKit&gt;");
    expect(html).toContain("TypeScript");
    expect(html).not.toContain("<WidgetKit>");
  });

  it("renders optional homepage and license values when available", () => {
    const html = renderPreviewHtml({
      repository: {
        owner: "acme",
        name: "widgetkit",
        fullName: "acme/widgetkit",
        htmlUrl: "https://github.com/acme/widgetkit",
        homepage: "https://example.com",
        defaultBranch: "main",
        stars: 1,
        topics: [],
        language: "TypeScript",
        license: { name: "MIT", spdxId: "MIT" }
      },
      readme: {
        title: "WidgetKit",
        features: [],
        faq: [],
        screenshots: [],
        links: [],
        sections: []
      },
      releases: [],
      screenshots: [],
      knowledgeBase: {
        projectStructure: [],
        techStack: [],
        entryFiles: [],
        configFiles: [],
        moduleMap: [],
        mermaid: "graph TD"
      },
      generatedAt: "2026-06-16T00:00:00.000Z"
    } satisfies SiteModel);

    expect(html).toContain("https://example.com");
    expect(html).toContain("MIT");
  });
});
