import type { ParsedReadme, ReadmeImage, ReadmeLink, ReadmeSection } from "../types.js";

const headingPattern = /^(#{1,6})\s+(.+)$/;
const imagePattern = /!\[([^\]]*)\]\((<[^>]+>|[^)]+)\)/g;
const linkPattern = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;

const sectionAliases = {
  features: ["feature", "features", "what it does", "capabilities"],
  installation: ["installation", "install", "getting started", "quick start", "setup"],
  usage: ["usage", "use", "examples", "example", "how to use"],
  faq: ["faq", "questions", "frequently asked questions"]
} as const;

export function parseReadme(markdown: string): ParsedReadme {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const title = extractTitle(lines);
  const sections = splitSections(lines);
  const summary = extractSummary(lines, title);
  const features = extractFeatures(sections);
  const installation = findSectionContent(sections, sectionAliases.installation);
  const usage = findSectionContent(sections, sectionAliases.usage);
  const faq = extractFaq(sections);
  const screenshots = extractImages(markdown);
  const links = extractLinks(markdown);

  return {
    title,
    summary,
    features,
    installation,
    usage,
    faq,
    screenshots,
    links,
    sections
  };
}

function extractTitle(lines: readonly string[]): string | undefined {
  const heading = lines.find((line) => line.startsWith("# "));
  return heading?.replace(/^#\s+/, "").trim() || undefined;
}

function splitSections(lines: readonly string[]): readonly ReadmeSection[] {
  const indexedHeadings = lines
    .map((line, index) => ({ index, match: line.match(headingPattern) }))
    .filter((item): item is { readonly index: number; readonly match: RegExpMatchArray } => Boolean(item.match));

  return indexedHeadings.map((item, position) => {
    const level = item.match[1].length;
    const nextHeading = indexedHeadings
      .slice(position + 1)
      .find((candidate) => candidate.match[1].length <= level);
    const content = lines
      .slice(item.index + 1, nextHeading?.index ?? lines.length)
      .join("\n")
      .trim();

    return {
      heading: item.match[2].replace(/#+$/, "").trim(),
      content
    };
  });
}

function extractSummary(lines: readonly string[], title?: string): string | undefined {
  const titleLine = title ? `# ${title}` : undefined;
  const paragraph = lines.find((line) => {
    const trimmed = line.trim();
    return (
      trimmed.length > 0 &&
      trimmed !== titleLine &&
      !trimmed.startsWith("#") &&
      !trimmed.startsWith("!") &&
      !trimmed.startsWith("[!") &&
      !trimmed.startsWith("<")
    );
  });

  return paragraph?.trim();
}

function normalizeHeading(heading: string): string {
  return heading.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim();
}

function findSectionContent(
  sections: readonly ReadmeSection[],
  aliases: readonly string[]
): string | undefined {
  const section = sections.find((candidate) => aliases.includes(normalizeHeading(candidate.heading)));
  return section?.content || undefined;
}

function extractFeatures(sections: readonly ReadmeSection[]): readonly string[] {
  const content = findSectionContent(sections, sectionAliases.features);
  if (!content) {
    return [];
  }

  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^[-*+]\s+/.test(line))
    .map((line) => line.replace(/^[-*+]\s+/, "").trim())
    .filter(Boolean);
}

function extractFaq(sections: readonly ReadmeSection[]): readonly ReadmeSection[] {
  const faqContent = findSectionContent(sections, sectionAliases.faq);
  if (!faqContent) {
    return [];
  }

  const lines = faqContent.split("\n");
  const questions = splitSections(lines);
  if (questions.length > 0) {
    return questions.map((question) => ({
      heading: question.heading,
      content: cleanFaqContent(question.content)
    }));
  }

  return lines
    .filter((line) => line.trim().endsWith("?"))
    .map((question) => ({
      heading: question.replace(/^[-*+]\s+/, "").trim(),
      content: ""
    }));
}

function cleanFaqContent(content: string): string {
  return content
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return !trimmed.startsWith("![") && !/^\[[^\]]+\]\([^)]+\)$/.test(trimmed);
    })
    .join("\n")
    .trim();
}

function extractImages(markdown: string): readonly ReadmeImage[] {
  return Array.from(markdown.matchAll(imagePattern)).map((match) => ({
    alt: match[1].trim(),
    src: stripAngleBrackets(match[2].trim())
  }));
}

function extractLinks(markdown: string): readonly ReadmeLink[] {
  return Array.from(markdown.matchAll(linkPattern))
    .filter((match) => !match[1].includes("!["))
    .map((match) => ({
      label: match[1].trim(),
      href: stripAngleBrackets(match[2].trim())
    }));
}

function stripAngleBrackets(value: string): string {
  return value.startsWith("<") && value.endsWith(">") ? value.slice(1, -1) : value;
}
