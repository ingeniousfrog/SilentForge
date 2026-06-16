import { describe, expect, it } from "vitest";
import { parseReadme } from "../src/readme/parser.js";

describe("parseReadme", () => {
  it("extracts core product documentation without inventing missing content", () => {
    const parsed = parseReadme(`# WidgetKit

WidgetKit builds tiny widgets for dashboards.

## Features
- Fast rendering
- Theme support

## Installation
\`\`\`sh
npm install widgetkit
\`\`\`

## Usage
\`\`\`ts
import { widget } from "widgetkit";
\`\`\`

## FAQ
### Does it need a server?
No.

![Widget screenshot](./docs/screenshot.png)
[Docs](https://example.com/docs)
`);

    expect(parsed).toMatchObject({
      title: "WidgetKit",
      summary: "WidgetKit builds tiny widgets for dashboards.",
      features: ["Fast rendering", "Theme support"],
      installation: "```sh\nnpm install widgetkit\n```",
      usage: "```ts\nimport { widget } from \"widgetkit\";\n```"
    });
    expect(parsed.faq).toEqual([{ heading: "Does it need a server?", content: "No." }]);
    expect(parsed.screenshots).toEqual([{ alt: "Widget screenshot", src: "./docs/screenshot.png" }]);
    expect(parsed.links).toContainEqual({ label: "Docs", href: "https://example.com/docs" });
  });

  it("returns empty sections when README does not document them", () => {
    const parsed = parseReadme("# Bare Repo");

    expect(parsed.features).toEqual([]);
    expect(parsed.installation).toBeUndefined();
    expect(parsed.usage).toBeUndefined();
    expect(parsed.faq).toEqual([]);
  });

  it("handles badge images without turning nested image markdown into links", () => {
    const parsed = parseReadme(
      "# Badges\n\n[![NPM version](<https://img.shields.io/npm/v/pkg.svg?label=npm%20(stable)>)](https://npmjs.org/package/pkg)"
    );

    expect(parsed.screenshots).toEqual([
      {
        alt: "NPM version",
        src: "https://img.shields.io/npm/v/pkg.svg?label=npm%20(stable)"
      }
    ]);
    expect(parsed.links).toEqual([]);
  });
});
