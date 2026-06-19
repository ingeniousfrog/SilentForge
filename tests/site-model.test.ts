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
      readme:
        "# WidgetKit\n\nTiny widgets.\n\n## Usage\nnpm run demo\n\n## Architecture\nThe source package contains the public API, command line entrypoint, processing backends, and validation helpers.",
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
        src: "https://raw.githubusercontent.com/acme/widgetkit/main/docs/screenshots/home.png"
      }
    ]);
    expect(model.knowledgeBase.entryFiles).toContain("src/index.ts");
    expect(model.profile.hasVisualStory).toBe(true);
    expect(model.profile.readmeInsightCount).toBeGreaterThan(0);
    expect(model.diagnostics.score).toBeGreaterThan(0);
    expect(model.diagnostics.dimensions.map((dimension) => dimension.id)).toEqual([
      "readme",
      "visuals",
      "developerJourney",
      "architecture",
      "release"
    ]);
  });

  it("does not treat status badges as presentation screenshots", () => {
    const snapshot: RepositorySnapshot = {
      metadata: {
        owner: "acme",
        name: "widgetkit",
        fullName: "acme/widgetkit",
        htmlUrl: "https://github.com/acme/widgetkit",
        defaultBranch: "main",
        stars: 0,
        topics: []
      },
      readme: "# WidgetKit\n\n![CI](https://github.com/acme/widgetkit/actions/workflows/ci.yml/badge.svg)",
      releases: [],
      files: [],
      configFiles: []
    };
    expect(createSiteModel(snapshot).screenshots).toEqual([]);
  });
});
