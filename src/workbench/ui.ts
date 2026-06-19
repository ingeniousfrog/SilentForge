import { workbenchClientScript } from "./ui/clientScript.js";
import { workbenchStyles } from "./ui/styles.js";
import { workbenchTemplate } from "./ui/template.js";
import { workbenchClientCatalog } from "../i18n/index.js";
import { buildPagesWorkflowYaml, pagesWorkflowPath } from "./pagesWorkflow.js";

export function workbenchHtml(): string {
  const i18n = JSON.stringify(workbenchClientCatalog()).replace(/</g, "\\u003c");
  const workflowTemplate = JSON.stringify(buildPagesWorkflowYaml("__FULL_NAME__"));
  const workflowPath = JSON.stringify(pagesWorkflowPath);
  return workbenchTemplate(workbenchStyles(), workbenchClientScript(i18n, workflowTemplate, workflowPath));
}
