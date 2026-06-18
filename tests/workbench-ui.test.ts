import { describe, expect, it } from "vitest";
import { workbenchHtml } from "../src/workbench/ui.js";

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
});
