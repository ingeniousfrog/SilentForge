import type { ReadmeSection } from "../types.js";

const genericHeadings = new Set(["features", "feature", "install", "installation", "getting started"]);

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
  return markdown.match(/```(?:[A-Za-z0-9_-]+)?\n([\s\S]*?)```/)?.[1].trim();
}
