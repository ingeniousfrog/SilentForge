import { describe, expect, it } from "vitest";
import { workbenchHtml } from "../src/workbench/ui.js";
import { workbenchClientScript } from "../src/workbench/ui/clientScript.js";
import { workbenchStyles } from "../src/workbench/ui/styles.js";
import { workbenchTemplate } from "../src/workbench/ui/template.js";

describe("workbenchHtml", () => {
  it("renders search-first cockpit controls and local history hooks", () => {
    const html = workbenchHtml();

    expect(html).toContain('data-mode="idle"');
    expect(html).toContain('id="repo-url"');
    expect(html).toContain('id="history-list"');
    expect(html).toContain("reposite.recentRepositories");
    expect(html).toContain('id="status-pill"');
    expect(html).toContain('data-tab="wiki"');
    expect(html).toContain('data-tab="preview"');
    expect(html).toContain('id="download"');
    expect(html).toContain('id="use-ai"');
    expect(html).toContain("extracted repository information is sent to OpenAI");
    expect(html).toContain('src="/preview/\' + state.job.id + \'/');
    expect(html).toContain("Enter a GitHub repository URL first.");
  });

  it("renders generation options and repository readiness diagnostics hooks", () => {
    const html = workbenchHtml();

    expect(html).toContain('id="generation-mode"');
    expect(html).toContain('id="generation-theme"');
    expect(html).toContain('data-chapter-toggle="features"');
    expect(html).toContain('data-chapter-toggle="readme-insights"');
    expect(html).toContain("generationOptions");
    expect(html).toContain("Repository Readiness");
    expect(html).toContain("renderDiagnostics");
  });

  it("keeps UI markup, styles, and browser script in focused modules", () => {
    expect(workbenchTemplate("styles", "script")).toContain("<style>styles</style>");
    expect(workbenchStyles()).toContain(".search-console");
    expect(workbenchClientScript()).toContain("collectGenerationOptions");
  });
});
