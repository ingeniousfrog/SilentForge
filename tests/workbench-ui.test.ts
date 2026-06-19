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
    expect(html).toContain('id="repo-console"');
    expect(html).toContain('id="start-button"');
    expect(html).toContain('type="button"');
    expect(html).not.toContain('id="repo-form"');
    expect(html).not.toContain('name="githubToken"');
    expect(html).not.toContain('name="repoUrl"');
    expect(html).toContain('id="history-list"');
    expect(html).toContain("silentforge.recentRepositories");
    expect(html).toContain("silentforge.locale");
    expect(html).toContain("silentforge.uiTheme");
    expect(html).toContain("silentforge.githubToken");
    expect(html).toContain('id="github-token"');
    expect(html).toContain('id="remember-github-token"');
    expect(html).toContain('class="lang-switch"');
    expect(html).toContain('class="theme-switch"');
    expect(html).toContain('data-ui-theme="dark"');
    expect(html).toContain('data-locale="zh"');
    expect(html).toContain("const I18N =");
    expect(html).toContain('id="status-pill"');
    expect(html).toContain('data-tab="wiki"');
    expect(html).toContain('data-tab="preview"');
    expect(html).toContain('id="download"');
    expect(html).toContain('id="deploy-guide"');
    expect(html).toContain("deploy-steps");
    expect(html).toContain("PAGES_WORKFLOW_TEMPLATE");
    expect(html).toContain("copy-pages-workflow-deploy");
    expect(html).toContain("copy-deploy-checklist");
    expect(html).toContain("buildDiagnosticsMarkdown");
    expect(html).toContain("buildReadmeBadge");
    expect(html).toContain("buildPagesWorkflow");
    expect(html).toContain("copy-diagnostics-markdown");
    expect(html).toContain('id="use-ai"');
    expect(html).toContain("extracted repository information is sent to OpenAI");
    expect(html).toContain('class="preview-frame"');
    expect(html).toContain("Enter a GitHub repository URL first.");
    expect(html).toContain("SilentForge Workbench");
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
    expect(html).toContain("Dark Signal");
    expect(html).toContain('id="workbench-settings"');
    expect(html).toContain('id="save-settings"');
    expect(html).toContain("saveSettings");
    expect(html).toContain("savedGenerationOptions");
    expect(html).toContain("savedGithubToken");
    expect(html).toContain("info-tooltip");
    expect(html).toContain("What do output settings control?");
    expect(html).toContain("dimension-grid");
    expect(html).toContain("feature-list");
  });

  it("ships browser script that parses without syntax errors", () => {
    const html = workbenchHtml();
    const marker = html.indexOf("const I18N");
    const start = html.lastIndexOf("<script>", marker) + 8;
    const end = html.indexOf("</script>", marker);
    const script = html.slice(start, end);
    expect(() => new Function(script)).not.toThrow();
  });

  it("keeps UI markup, styles, and browser script in focused modules", () => {
    expect(workbenchTemplate("styles", "script")).toContain("<style>styles</style>");
    expect(workbenchStyles()).toContain(".search-console");
    expect(workbenchStyles()).toContain(".workbench-settings");
    expect(workbenchClientScript("{}")).toContain("applyLocale");
    expect(workbenchStyles()).toContain("--bg:");
    expect(workbenchClientScript("{}", "\"name: test\\n\"", "\".github/workflows/test.yml\"")).toContain("renderDeployCommands");
    expect(workbenchClientScript("{}", "\"name: test\\n\"", "\".github/workflows/test.yml\"")).toContain("PAGES_WORKFLOW_TEMPLATE");
    expect(workbenchClientScript("{}")).toContain("saveSettings");
    expect(workbenchClientScript("{}")).toContain("applyTheme");
    expect(workbenchClientScript("{}")).toContain("prefers-color-scheme");
    expect(workbenchClientScript("{}")).toContain("resetToHome");
    expect(workbenchClientScript("{}")).toContain("back-home-button");
    expect(workbenchHtml()).toContain('id="back-home-button"');
  });
});
