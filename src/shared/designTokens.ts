import type { Locale, PresentationChapterKind, PresentationMode, PresentationTheme } from "../types.js";
import {
  presentationChapterKindLabel,
  presentationModeLabel,
  presentationThemeLabel
} from "../i18n/index.js";
import { DEFAULT_LOCALE } from "../i18n/types.js";

export function themeLabels(locale: Locale = DEFAULT_LOCALE): Readonly<Record<PresentationTheme, string>> {
  return {
    "signal-dark": presentationThemeLabel(locale, "signal-dark"),
    "editorial-light": presentationThemeLabel(locale, "editorial-light"),
    blueprint: presentationThemeLabel(locale, "blueprint")
  };
}

export function modeLabels(locale: Locale = DEFAULT_LOCALE): Readonly<Record<PresentationMode, string>> {
  return {
    "developer-deck": presentationModeLabel(locale, "developer-deck"),
    "architecture-map": presentationModeLabel(locale, "architecture-map"),
    "visual-showcase": presentationModeLabel(locale, "visual-showcase"),
    "compact-story": presentationModeLabel(locale, "compact-story")
  };
}

export function chapterLabels(locale: Locale = DEFAULT_LOCALE): Readonly<Record<PresentationChapterKind, string>> {
  return {
    hero: presentationChapterKindLabel(locale, "hero"),
    features: presentationChapterKindLabel(locale, "features"),
    visuals: presentationChapterKindLabel(locale, "visuals"),
    usage: presentationChapterKindLabel(locale, "usage"),
    "readme-insights": presentationChapterKindLabel(locale, "readme-insights"),
    technology: presentationChapterKindLabel(locale, "technology"),
    architecture: presentationChapterKindLabel(locale, "architecture"),
    resources: presentationChapterKindLabel(locale, "resources")
  };
}

export function designTokensCss(): string {
  return `:root {
  --bg: #0a0e14;
  --ink: #e8f4ff;
  --text: #e8f4ff;
  --muted: #8ea4b7;
  --dim: #52697d;
  --accent: #62e6ff;
  --accent2: #6ef7b1;
  --cyan: #62e6ff;
  --mint: #6ef7b1;
  --amber: #ffcb63;
  --red: #ff6d7a;
  --violet: #a9a2ff;
  --panel: rgba(12, 20, 32, 0.82);
  --panel-strong: rgba(15, 27, 43, 0.94);
  --line: rgba(126, 232, 255, 0.14);
  --line-strong: rgba(126, 232, 255, 0.32);
  --shadow: rgba(0, 0, 0, 0.34);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --mono: ui-monospace, "JetBrains Mono", "Cascadia Code", "SF Mono", Menlo, monospace;
  --sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --display: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color-scheme: dark;
}`;
}

export function workbenchShellCss(): string {
  return `body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0e14 0%, #0d1520 100%);
  color: var(--text);
  font-family: var(--sans);
  line-height: 1.5;
}`;
}

export function presentationThemeCss(): string {
  return `body[data-theme="editorial-light"] {
  --ink: #1a2332;
  --text: #1a2332;
  --muted: #5c6773;
  --dim: #7a8490;
  --accent: #0b6e72;
  --accent2: #c04a2f;
  --cyan: #0b6e72;
  --mint: #c04a2f;
  --panel: rgba(255, 255, 255, 0.92);
  --line: rgba(26, 35, 50, 0.12);
  color-scheme: light;
  background: #f7f5f0;
  font-family: var(--sans);
}
body[data-theme="editorial-light"] h1,
body[data-theme="editorial-light"] .story-chapters h1 {
  font-family: Georgia, "Iowan Old Style", "Times New Roman", serif;
  letter-spacing: -0.02em;
}
body[data-theme="editorial-light"] h2,
body[data-theme="editorial-light"] .story-chapters h2 {
  font-family: var(--sans);
  letter-spacing: -0.02em;
}
body[data-theme="editorial-light"] .lede,
body[data-theme="editorial-light"] .card p,
body[data-theme="editorial-light"] .feature-card p {
  line-height: 1.65;
  color: var(--muted);
}
body[data-theme="editorial-light"] .lede strong,
body[data-theme="editorial-light"] .feature-card p strong {
  color: var(--ink);
}
body[data-theme="editorial-light"] #chapter-nav {
  background: rgba(247, 245, 240, 0.96);
  border-bottom-color: var(--line);
}
body[data-theme="blueprint"] {
  --accent: #68d5ff;
  --accent2: #ffcf62;
  --cyan: #68d5ff;
  background-color: #061b2d;
  background-image:
    linear-gradient(rgba(104, 213, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(104, 213, 255, 0.05) 1px, transparent 1px);
  background-size: 36px 36px;
}`;
}