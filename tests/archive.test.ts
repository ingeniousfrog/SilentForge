import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it } from "vitest";
import { createZipFromDirectory } from "../src/workbench/archive.js";

describe("createZipFromDirectory", () => {
  it("creates a valid zip archive containing generated files", async () => {
    const dir = await mkdtemp(join(tmpdir(), "reposite-zip-"));
    await writeFile(join(dir, "index.html"), "<h1>Hello</h1>", "utf8");

    const archive = await createZipFromDirectory(dir);

    expect(archive.readUInt32LE(0)).toBe(0x04034b50);
    expect(archive.includes(Buffer.from("index.html"))).toBe(true);
    expect(archive.includes(await readFile(join(dir, "index.html")))).toBe(true);
  });

  it("includes nested files and skips non-file directory entries", async () => {
    const dir = await mkdtemp(join(tmpdir(), "reposite-zip-"));
    await mkdir(join(dir, "src"));
    await writeFile(join(dir, "src", "page.astro"), "---", "utf8");

    const archive = await createZipFromDirectory(dir);

    expect(archive.includes(Buffer.from("src/page.astro"))).toBe(true);
  });
});
