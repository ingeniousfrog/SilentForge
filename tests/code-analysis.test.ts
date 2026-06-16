import { describe, expect, it } from "vitest";
import { analyzeCodebase } from "../src/analyzer/codebase.js";
import type { RepositoryFile } from "../src/types.js";

const file = (path: string): RepositoryFile => ({ path, type: "blob" });

describe("analyzeCodebase", () => {
  it("detects stack, entries, config files, modules, and mermaid map from repository files", () => {
    const result = analyzeCodebase([
      file("package.json"),
      file("astro.config.mjs"),
      file("src/index.ts"),
      file("src/cli.ts"),
      file("src/github/client.ts"),
      file("docs/screenshot.png"),
      { path: "src/github", type: "tree" }
    ]);

    expect(result.techStack).toEqual(expect.arrayContaining(["Node.js", "TypeScript", "Astro"]));
    expect(result.entryFiles).toEqual(expect.arrayContaining(["src/index.ts", "src/cli.ts"]));
    expect(result.configFiles).toContainEqual({
      path: "package.json",
      purpose: "Node.js package manifest and scripts"
    });
    expect(result.moduleMap).toContainEqual({
      heading: "src",
      content: "Contains 3 tracked files, including src/index.ts, src/cli.ts, src/github/client.ts."
    });
    expect(result.mermaid).toContain("graph TD");
    expect(result.mermaid).toContain("src --> src_github");
  });
});
