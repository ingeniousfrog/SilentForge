import { describe, expect, it } from "vitest";
import { createResourceView } from "../src/workbench/resources.js";
import type { RepositorySnapshot, SiteModel } from "../src/types.js";

describe("createResourceView", () => {
  it("exposes repository resources without raw snapshot internals", () => {
    const snapshot: RepositorySnapshot = {
      metadata: {
        owner: "acme",
        name: "widgetkit",
        fullName: "acme/widgetkit",
        htmlUrl: "https://github.com/acme/widgetkit",
        defaultBranch: "main",
        stars: 1,
        topics: []
      },
      readme: "# WidgetKit",
      releases: [],
      files: [{ path: "package.json", type: "blob", size: 12, url: "secret-url" }],
      configFiles: [{ path: "package.json", type: "blob", size: 12, url: "secret-url" }]
    };
    const model: SiteModel = {
      repository: snapshot.metadata,
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
    };

    expect(createResourceView(snapshot, model).files).toEqual([{ path: "package.json", type: "blob", size: 12 }]);
  });
});
