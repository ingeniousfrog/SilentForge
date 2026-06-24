import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseReadme } from "../src/readme/parser.js";
import {
  countCommandLines,
  extractCommandPreview,
  extractMarkdownCommands,
  selectReadmeInsights,
  summarizeMarkdown
} from "../src/presentation/readme.js";

describe("presentation readme helpers", () => {
  it("extracts shell commands instead of raw markdown prose", () => {
    const markdown = `Requires **Node.js 20+**. No install step:

\`\`\`sh
# Generate a static presentation site
npx silentforge init vercel/next.js

# Launch the local Workbench UI
npx silentforge web
\`\`\`

Optional local preview after generation:

\`\`\`sh
npx --yes serve "vercel/next.js-site"
\`\`\``;

    expect(extractCommandPreview(markdown, 5)).toBe(
      [
        "# Generate a static presentation site",
        "npx silentforge init vercel/next.js",
        "# Launch the local Workbench UI",
        "npx silentforge web",
        "npx --yes serve \"vercel/next.js-site\""
      ].join("\n")
    );
    expect(countCommandLines(markdown)).toBe(5);
    expect(extractMarkdownCommands(markdown)).toContain("npx --yes serve \"vercel/next.js-site\"");
  });

  it("summarizes markdown without table or list syntax", () => {
    const summary = summarizeMarkdown(
      "| Workbench | Preview |\n|-----------|---------|\n| Local UI | Preview tab |\n\n- Quick start\n- Usage"
    );

    expect(summary).not.toContain("|");
    expect(summary).not.toMatch(/^-/);
  });

  it("skips navigational readme sections for insight cards", () => {
    const parsed = parseReadme(readFileSync(join(process.cwd(), "README.md"), "utf8"));
    const insights = selectReadmeInsights(parsed.sections, parsed.title).map((section) => section.heading);

    expect(insights).not.toContain("Screenshots");
    expect(insights).not.toContain("Table of contents");
    expect(insights).not.toContain("Quick start");
    expect(insights).not.toContain("Launch the local Workbench UI");
    expect(insights.length).toBeGreaterThan(0);
  });

  it("prefers run-from-source commands over release-only install steps", () => {
    const markdown = `## Getting Started

### Requirements

* macOS 14 or later

### Download

1. Download the latest \`.dmg\` and drag **Nivlo** into **Applications**.
2. If macOS blocks launch, run:

xattr -cr /Applications/Nivlo.app

### Run from source

git clone https://github.com/ingeniousfrog/Nivlo.git
cd Nivlo
swift run Nivlo
`;

    expect(extractCommandPreview(markdown, 5)).toBe(
      [
        "git clone https://github.com/ingeniousfrog/Nivlo.git",
        "cd Nivlo",
        "swift run Nivlo"
      ].join("\n")
    );
    expect(extractMarkdownCommands(markdown)).not.toContain("xattr -cr");
  });

  it("skips container readme sections that only summarize child headings", () => {
    const parsed = parseReadme(`# Nivlo

## Capabilities

### Library

* Masonry grid browsing with progressive thumbnail loading
* Full preview for images and videos

### Organization

* Exact-duplicate groups by SHA-256
* Perceptual-similarity clusters via connected-component analysis on dHash Hamming distance
`);

    const insights = selectReadmeInsights(parsed.sections, parsed.title).map((section) => section.heading);
    expect(insights).not.toContain("Capabilities");
    expect(insights).toContain("Library");
    expect(insights).toContain("Organization");
    expect(summarizeMarkdown(parsed.sections.find((section) => section.heading === "Library")?.content ?? "")).not.toContain(
      "###"
    );
  });

  it("decodes html entities and heading markers in summaries", () => {
    const summary = summarizeMarkdown("### Library &nbsp;&nbsp; Masonry grid browsing with progressive thumbnail loading");
    expect(summary).not.toContain("###");
    expect(summary).not.toContain("&nbsp;");
    expect(summary).toContain("Masonry grid browsing");
  });
});

describe("parseReadme section boundaries", () => {
  it("does not treat hash comments inside fenced code as headings", () => {
    const parsed = parseReadme(`# WidgetKit

## Quick start

\`\`\`sh
# Generate a static presentation site
npx silentforge init vercel/next.js

# Launch the local Workbench UI
npx silentforge web
\`\`\`

## Usage

\`\`\`sh
npx silentforge web
\`\`\`
`);

    expect(parsed.sections.map((section) => section.heading)).not.toContain("Launch the local Workbench UI");
    expect(parsed.sections.map((section) => section.heading)).toEqual(["WidgetKit", "Quick start", "Usage"]);
  });
});
