import type {
  Locale,
  PresentationChapterKind,
  PresentationDetailPage,
  PresentationMode,
  PresentationPlan,
  PresentationTheme
} from "../types.js";
import { messageCatalog } from "./messages.js";
import { DEFAULT_LOCALE, LOCALES } from "./types.js";

export { DEFAULT_LOCALE, LOCALES, type Locale } from "./types.js";

type MessageParams = Record<string, string | number>;

export function resolveLocale(value?: string | null): Locale {
  return value === "zh" ? "zh" : DEFAULT_LOCALE;
}

export function htmlLang(locale: Locale): string {
  return locale === "zh" ? "zh-CN" : "en";
}

function lookup(tree: unknown, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((current, segment) => {
    if (typeof current !== "object" || current === null || !(segment in current)) {
      return undefined;
    }
    return (current as Record<string, unknown>)[segment];
  }, tree);
  return typeof value === "string" ? value : undefined;
}

export function t(locale: Locale, key: string, params: MessageParams = {}): string {
  const resolved = lookup(messageCatalog[locale], key) ?? lookup(messageCatalog.en, key) ?? key;
  return Object.entries(params).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    resolved
  );
}

function flattenTree(tree: unknown, prefix = ""): Record<string, string> {
  if (typeof tree === "string") {
    return prefix ? { [prefix]: tree } : {};
  }
  if (typeof tree !== "object" || tree === null) {
    return {};
  }
  return Object.entries(tree).reduce<Record<string, string>>((accumulator, [key, value]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    return { ...accumulator, ...flattenTree(value, nextPrefix) };
  }, {});
}

export function workbenchMessageCatalog(): Record<Locale, Record<string, string>> {
  return {
    en: flattenTree((messageCatalog.en as Record<string, unknown>).workbench),
    zh: flattenTree((messageCatalog.zh as Record<string, unknown>).workbench)
  };
}

export function workbenchClientCatalog(): Record<Locale, Record<string, string>> {
  const build = (locale: Locale): Record<string, string> => {
    const tree = messageCatalog[locale] as Record<string, unknown>;
    const presentation = tree.presentation as Record<string, unknown>;
    const diagnostics = tree.diagnostics as Record<string, unknown>;
    return {
      ...flattenTree(tree.workbench),
      ...flattenTree(presentation, "presentation"),
      ...flattenTree(diagnostics.grade, "diagnostics.grade")
    };
  };

  return {
    en: build("en"),
    zh: build("zh")
  };
}

export function presentationModeLabel(locale: Locale, mode: PresentationMode | "auto"): string {
  return t(locale, `presentation.mode.${mode}`);
}

export function presentationThemeLabel(locale: Locale, theme: PresentationTheme | "auto"): string {
  return t(locale, `presentation.theme.${theme}`);
}

export function presentationChapterKindLabel(locale: Locale, kind: PresentationChapterKind): string {
  return t(locale, `presentation.chapterKind.${kind}`);
}

export function presentationChapterTitle(locale: Locale, kind: PresentationChapterKind): string | undefined {
  if (kind === "hero") return undefined;
  return t(locale, `presentation.chapterTitle.${kind}`);
}

export function presentationDetailTitle(locale: Locale, id: PresentationDetailPage["id"]): string {
  return t(locale, `presentation.detailTitle.${id}`);
}

export function localizePresentationPlan(plan: PresentationPlan, locale: Locale): PresentationPlan {
  return {
    ...plan,
    locale,
    chapters: plan.chapters.map((chapter) => ({
      ...chapter,
      title:
        chapter.kind === "hero"
          ? chapter.title
          : presentationChapterTitle(locale, chapter.kind) ?? chapter.title
    })),
    detailPages: plan.detailPages.map((page) => ({
      ...page,
      title: presentationDetailTitle(locale, page.id)
    }))
  };
}

export function resolveGenerationLocale(options?: { readonly locale?: Locale }): Locale {
  return resolveLocale(options?.locale);
}
