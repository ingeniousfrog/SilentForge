import { workbenchClientScript } from "./ui/clientScript.js";
import { workbenchStyles } from "./ui/styles.js";
import { workbenchTemplate } from "./ui/template.js";
import { workbenchClientCatalog } from "../i18n/index.js";

export function workbenchHtml(): string {
  const i18n = JSON.stringify(workbenchClientCatalog()).replace(/</g, "\\u003c");
  return workbenchTemplate(workbenchStyles(), workbenchClientScript(i18n));
}
