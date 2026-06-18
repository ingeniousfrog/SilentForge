import type { ReadmeSection } from "../types.js";

const genericHeadings = new Set(["features", "feature", "install", "installation", "getting started"]);
const mermaidStarts = [
  "architecture-beta",
  "block-beta",
  "classdiagram",
  "erdiagram",
  "flowchart",
  "gantt",
  "gitgraph",
  "graph",
  "journey",
  "mindmap",
  "pie",
  "quadrantchart",
  "requirementdiagram",
  "sequencediagram",
  "statediagram",
  "timeline",
  "xychart-beta"
] as const;

export type MarkdownCodeBlock = {
  readonly language?: string;
  readonly code: string;
};

export function selectReadmeInsights(
  sections: readonly ReadmeSection[],
  projectTitle?: string,
  limit = 4
): readonly ReadmeSection[] {
  const normalizedTitle = projectTitle?.trim().toLowerCase();
  return sections
    .filter((section) => {
      const heading = section.heading.trim().toLowerCase();
      return (
        section.content.trim().length >= 80 &&
        heading !== normalizedTitle &&
        !genericHeadings.has(heading) &&
        heading !== "or"
      );
    })
    .slice(0, limit);
}

export function summarizeMarkdown(markdown: string, maximum = 180): string {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_>#|~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plainText.length <= maximum ? plainText : `${plainText.slice(0, maximum - 1).trimEnd()}…`;
}

export function firstCodeBlock(markdown: string): string | undefined {
  return firstMarkdownCodeBlock(markdown)?.code;
}

export function firstMarkdownCodeBlock(markdown: string): MarkdownCodeBlock | undefined {
  const match = markdown.match(/```([A-Za-z0-9_-]+)?[^\n]*\n([\s\S]*?)```/);
  if (!match) return undefined;
  const language = match[1]?.trim().toLowerCase();
  const code = match[2].trim();
  return language ? { language, code } : { code };
}

export function isMermaidCodeBlock(block: MarkdownCodeBlock | undefined): boolean {
  if (!block) return false;
  if (block.language === "mermaid") return true;
  const firstLine = block.code
    .split("\n")
    .find((line) => line.trim().length > 0)
    ?.trim()
    .toLowerCase();
  if (!firstLine) return false;
  return mermaidStarts.some((prefix) => firstLine === prefix || firstLine.startsWith(`${prefix} `));
}
