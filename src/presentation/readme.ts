import type { ReadmeSection } from "../types.js";
import { stripInlineMarkdown } from "../shared/markdown.js";

const genericHeadings = new Set(["features", "feature", "install", "installation", "getting started"]);
const insightExcludedHeadings = new Set([
  ...genericHeadings,
  "screenshots",
  "screenshot",
  "table of contents",
  "toc",
  "目录",
  "usage",
  "use",
  "examples",
  "example",
  "quick start",
  "how it works",
  "requirements",
  "license",
  "faq",
  "development"
]);
const shellLanguages = new Set(["sh", "bash", "shell", "zsh"]);
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
        !insightExcludedHeadings.has(heading) &&
        heading !== "or" &&
        !isTableHeavy(section.content) &&
        !isTableOfContents(section.content) &&
        !hasNestedSubheadings(section.content)
      );
    })
    .slice(0, limit);
}

export function summarizeMarkdown(markdown: string, maximum = 180): string {
  const withoutBlocks = markdown.replace(/```[\s\S]*?```/g, " ");
  const condensed = withoutBlocks
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !isMarkdownTableLine(line))
    .map((line) => line.replace(/^#{1,6}\s+/, "").trim())
    .map((line) => line.replace(/^[-*+]\s+/, "").trim())
    .join(" ");
  const plainText = stripInlineMarkdown(condensed);
  return plainText.length <= maximum ? plainText : `${plainText.slice(0, maximum - 1).trimEnd()}…`;
}

export function extractMarkdownCodeBlocks(markdown: string): readonly MarkdownCodeBlock[] {
  const blocks: MarkdownCodeBlock[] = [];
  const pattern = /```([A-Za-z0-9_-]+)?[^\n]*\n([\s\S]*?)```/g;

  for (const match of markdown.matchAll(pattern)) {
    const language = match[1]?.trim().toLowerCase();
    const code = match[2].trim();
    blocks.push(language ? { language, code } : { code });
  }

  return blocks;
}

export function firstCodeBlock(markdown: string): string | undefined {
  return firstMarkdownCodeBlock(markdown)?.code;
}

export function firstMarkdownCodeBlock(markdown: string): MarkdownCodeBlock | undefined {
  return extractMarkdownCodeBlocks(markdown)[0];
}

export function extractMarkdownCommands(markdown: string | undefined): string | undefined {
  if (!markdown) {
    return undefined;
  }

  const preferredSubsection = findPreferredCommandSubsection(markdown);
  if (preferredSubsection) {
    const subsectionCommands = extractCommandsFromSection(preferredSubsection);
    if (subsectionCommands) {
      return subsectionCommands;
    }
  }

  return extractCommandsFromSection(markdown);
}

export function extractCommandPreview(markdown: string | undefined, maxLines = 5): string | undefined {
  const commands = extractMarkdownCommands(markdown);
  if (!commands) {
    return undefined;
  }

  const lines = commands
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);

  return lines.slice(0, maxLines).join("\n") || undefined;
}

export function countCommandLines(markdown: string | undefined): number {
  const commands = extractMarkdownCommands(markdown);
  if (!commands) {
    return 0;
  }

  return commands.split("\n").filter((line) => line.trim().length > 0).length;
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

const headingPattern = /^#{1,6}\s+/;
const numberedListPattern = /^\d+\.\s/;
const bulletPattern = /^[-*+]\s+/;
const commandPrefixPattern =
  /^(?:sudo\s+)?(?:git|cd|curl|wget|npm|npx|pnpm|yarn|bun|docker|podman|swift|go|cargo|make|xattr|chmod|brew|pip3?|python3?|node|rustc|cmake|\.\/)\b/i;
const preferredSubsectionPatterns = [
  /run from source/i,
  /from source/i,
  /build from source/i,
  /quick start/i,
  /getting started/i,
  /install/i,
  /download/i
] as const;

function extractCommandsFromSection(markdown: string): string | undefined {
  const blocks = extractMarkdownCodeBlocks(markdown);
  if (blocks.length > 0) {
    return preferredCommandBlocks(blocks)
      .map((block) => block.code)
      .join("\n\n");
  }

  const bareCommands = extractBareCommandLines(markdown);
  return bareCommands || undefined;
}

function findPreferredCommandSubsection(markdown: string): string | undefined {
  const subsections = splitMarkdownSubsections(markdown);
  if (subsections.length === 0) {
    return undefined;
  }

  for (const pattern of preferredSubsectionPatterns) {
    const match = subsections.find((subsection) => pattern.test(subsection.heading));
    if (match) {
      return match.content;
    }
  }

  return undefined;
}

function splitMarkdownSubsections(markdown: string): readonly { readonly heading: string; readonly content: string }[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const sections: { heading: string; content: string[] }[] = [];
  let current: { heading: string; content: string[] } | undefined;

  for (const line of lines) {
    const match = line.match(/^###\s+(.+)$/);
    if (match) {
      if (current) {
        sections.push(current);
      }
      current = { heading: match[1].replace(/#+$/, "").trim(), content: [] };
      continue;
    }

    if (current) {
      current.content.push(line);
    }
  }

  if (current) {
    sections.push(current);
  }

  return sections.map((section) => ({
    heading: section.heading,
    content: section.content.join("\n").trim()
  }));
}

function extractBareCommandLines(markdown: string): string | undefined {
  const lines = markdown
    .replace(/```[\s\S]*?```/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !headingPattern.test(line))
    .filter((line) => !numberedListPattern.test(line))
    .filter((line) => !bulletPattern.test(line))
    .filter((line) => !isMarkdownTableLine(line));

  const commands: string[] = [];
  for (const line of lines) {
    if (line.startsWith("#") && !commandPrefixPattern.test(line.replace(/^#+\s*/, ""))) {
      commands.push(line);
      continue;
    }
    if (commandPrefixPattern.test(line)) {
      commands.push(line);
    }
  }

  return commands.length > 0 ? commands.join("\n") : undefined;
}

function hasNestedSubheadings(content: string): boolean {
  return content
    .replace(/```[\s\S]*?```/g, "")
    .split("\n")
    .some((line) => /^###\s+/.test(line.trim()));
}

function isMarkdownTableLine(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.includes("|") && (/^\|/.test(trimmed) || /^\|?[-:\s|]+\|?$/.test(trimmed));
}

function isTableHeavy(content: string): boolean {
  const lines = content
    .replace(/```[\s\S]*?```/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return false;
  }

  const tableLines = lines.filter((line) => isMarkdownTableLine(line));
  return tableLines.length / lines.length >= 0.5;
}

function isTableOfContents(content: string): boolean {
  const lines = content
    .replace(/```[\s\S]*?```/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return false;
  }

  const anchorLinks = lines.filter((line) => /^[-*+]\s+\[[^\]]+\]\(#[^)]+\)/.test(line));
  return anchorLinks.length / lines.length >= 0.6;
}

function preferredCommandBlocks(blocks: readonly MarkdownCodeBlock[]): readonly MarkdownCodeBlock[] {
  const shellBlocks = blocks.filter(
    (block) => !block.language || shellLanguages.has(block.language)
  );
  return shellBlocks.length > 0 ? shellBlocks : blocks;
}
