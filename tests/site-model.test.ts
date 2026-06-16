import { describe, expect, it } from "vitest";
import { createSiteModel } from "../src/site/model.js";
import type { RepositorySnapshot } from "../src/types.js";

describe("createSiteModel", () => {
  it("combines repository snapshot, parsed README, screenshots, and code knowledge", () => {
    const snapshot: RepositorySnapshot = {
      metadata: {
        owner: "acme",
        name: "widgetkit",
        fullName: "acme/widgetkit",
        description: "Tiny widgets",
        htmlUrl: "https://github.com/acme/widgetkit",
        defaultBranch: "main",
        stars: 4,
        topics: [],
        language: "TypeScript"
      },
      readme: "# WidgetKit\n\nTiny widgets.\n\n## Usage\nnpm run demo",
      releases: [],
      files: [
        { path: "package.json", type: "blob" },
        { path: "src/index.ts", type: "blob" },
        { path: "docs/screenshots/home.png", type: "blob" }
      ],
      configFiles: [{ path: "package.json", type: "blob" }]
    };

    const model = createSiteModel(snapshot, new Date("2026-06-16T00:00:00.000Z"));

    expect(model.generatedAt).toBe("2026-06-16T00:00:00.000Z");
    expect(model.readme.title).toBe("WidgetKit");
    expect(model.screenshots).toEqual([
      {
        alt: "home.png",
        src: "https://github.com/acme/widgetkit/raw/main/docs/screenshots/home.png"
      }
    ]);
    expect(model.knowledgeBase.entryFiles).toContain("src/index.ts");
  });
});
