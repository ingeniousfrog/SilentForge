import { afterEach, describe, expect, it, vi } from "vitest";

const fetchRepositorySnapshot = vi.fn();
const generateAstroSite = vi.fn();
const execa = vi.fn();

vi.mock("../src/github/client.js", () => ({ fetchRepositorySnapshot }));
vi.mock("../src/site/generator.js", () => ({ generateAstroSite }));
vi.mock("execa", () => ({ execa }));

afterEach(() => {
  vi.clearAllMocks();
});

describe("initRepoSite", () => {
  it("fetches a repository snapshot, builds a site model, and writes the Astro project", async () => {
    const { initRepoSite } = await import("../src/commands/init.js");
    fetchRepositorySnapshot.mockResolvedValue({
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
      files: [{ path: "package.json", type: "blob" }],
      configFiles: [{ path: "package.json", type: "blob" }]
    });

    const result = await initRepoSite("acme/widgetkit", { cwd: "/tmp/work", outputDir: "site", token: "token" });

    expect(fetchRepositorySnapshot).toHaveBeenCalledWith("acme/widgetkit", { token: "token" });
    expect(generateAstroSite).toHaveBeenCalledWith(expect.objectContaining({ repository: expect.any(Object) }), "/tmp/work/site");
    expect(result).toEqual({ outputDir: "/tmp/work/site", fullName: "acme/widgetkit" });
  });
});

describe("runAstroScript", () => {
  it("runs npm scripts in the requested directory", async () => {
    const { runAstroScript } = await import("../src/commands/astro.js");

    await runAstroScript("build", { cwd: "/tmp/site" });

    expect(execa).toHaveBeenCalledWith("npm", ["run", "build"], {
      cwd: "/tmp/site",
      stdio: "inherit",
      preferLocal: true
    });
  });
});
