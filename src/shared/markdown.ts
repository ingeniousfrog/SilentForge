import { escapeHtml, safeExternalUrl } from "../site/security.js";

export function stripInlineMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function renderInlineMarkdown(markdown: string): string {
  const placeholders: string[] = [];
  let working = markdown;

  const stash = (html: string): string => {
    const token = `\x00${placeholders.length}\x00`;
    placeholders.push(html);
    return token;
  };

  working = working.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => {
    const safeHref = safeExternalUrl(href.trim());
    if (!safeHref) {
      return stash(escapeHtml(label));
    }
    return stash(
      `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`
    );
  });

  working = working.replace(/\*\*([^*]+)\*\*/g, (_, inner: string) =>
    stash(`<strong>${escapeHtml(inner)}</strong>`)
  );
  working = working.replace(/__([^_]+)__/g, (_, inner: string) =>
    stash(`<strong>${escapeHtml(inner)}</strong>`)
  );
  working = working.replace(/`([^`]+)`/g, (_, inner: string) =>
    stash(`<code class="inline-code">${escapeHtml(inner)}</code>`)
  );
  working = working.replace(/\*([^*]+)\*/g, (_, inner: string) => stash(`<em>${escapeHtml(inner)}</em>`));
  working = working.replace(/_([^_]+)_/g, (_, inner: string) => stash(`<em>${escapeHtml(inner)}</em>`));

  return escapeHtml(working).replace(/\x00(\d+)\x00/g, (_, index: string) => placeholders[Number(index)] ?? "");
}
