import { workbenchClientScript } from "./ui/clientScript.js";
import { workbenchStyles } from "./ui/styles.js";
import { workbenchTemplate } from "./ui/template.js";

export function workbenchHtml(): string {
  return workbenchTemplate(workbenchStyles(), workbenchClientScript());
}
