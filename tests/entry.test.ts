import { mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { isDirectModuleExecution } from "../src/shared/entry.js";

describe("isDirectModuleExecution", () => {
  it("returns true when argv points at the same file through a symlink", () => {
    const dir = mkdtempSync(join(tmpdir(), "silentforge-entry-"));
    const target = join(dir, "cli.js");
    const link = join(dir, "silentforge-bin");
    writeFileSync(target, "export {}\n");
    symlinkSync(target, link);
    const previousArgv = process.argv[1];
    process.argv[1] = link;

    expect(isDirectModuleExecution(pathToFileURL(target).href)).toBe(true);

    process.argv[1] = previousArgv;
  });
});

describe("published CLI entry", () => {
  it("prints help when invoked through a bin-style symlink", () => {
    const dir = mkdtempSync(join(tmpdir(), "silentforge-cli-"));
    const cli = join(process.cwd(), "dist/cli.js");
    const bin = join(dir, "silentforge");
    symlinkSync(cli, bin);

    const result = spawnSync(process.execPath, [bin, "--help"], { encoding: "utf8" });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("init");
    expect(result.stdout).toContain("web");
  });
});
