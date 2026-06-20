import { describe, expect, it } from "vitest";
import {
  buildPagesSetupChecklist,
  buildPagesWorkflowYaml,
  pagesWorkflowPath
} from "../src/workbench/pagesWorkflow.js";

describe("pagesWorkflow", () => {
  it("builds a user-facing workflow for the target repository", () => {
    const yaml = buildPagesWorkflowYaml("antirez/ds4");

    expect(yaml).toContain("npx --yes silentforge@latest init ${{ github.repository }} -o site --locale en");
    expect(yaml).toContain("silentforge >= 0.1.1");
    expect(yaml).toContain("actions/configure-pages@v5");
    expect(yaml).toContain("actions/deploy-pages@v4");
    expect(pagesWorkflowPath).toBe(".github/workflows/silentforge-pages.yml");
  });

  it("builds a setup checklist with the expected pages url", () => {
    const checklist = buildPagesSetupChecklist("antirez/ds4", "https://antirez.github.io/ds4/");

    expect(checklist).toContain(pagesWorkflowPath);
    expect(checklist).toContain("https://antirez.github.io/ds4/");
  });
});
