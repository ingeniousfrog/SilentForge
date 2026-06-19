import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("package publishing configuration", () => {
  it("publishes the built CLI and only the intended package files", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
      readonly bin?: Record<string, string>;
      readonly files?: readonly string[];
      readonly scripts?: Record<string, string>;
    };

    expect(packageJson.bin?.reposite).toBe("./dist/cli.js");
    expect(packageJson.bin?.silentforge).toBe("./dist/cli.js");
    expect(packageJson.files).toEqual(["dist", "README.md", "README-CN.md", "LICENSE", "package.json"]);
    expect(packageJson.scripts?.build).toContain("npm run clean");
    expect(packageJson.scripts?.prepack).toBe("npm run build");
    expect(packageJson.files).not.toContain("src");
    expect(packageJson.files).not.toContain("tests");
    expect(packageJson.files).not.toContain("coverage");
    expect(packageJson.files).not.toContain("node_modules");
  });
});
