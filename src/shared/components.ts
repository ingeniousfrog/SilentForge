import type { DiagnosticDimension } from "../types.js";
import { escapeHtml } from "../site/security.js";

export function metricCard(value: unknown, label: string): string {
  return `<div class="metric"><strong>${escapeHtml(String(value))}</strong><span>${escapeHtml(label)}</span></div>`;
}

export function signalCard(label: string, value: string, source: string): string {
  return `<div class="signal"><strong>${escapeHtml(label)}</strong><p>${escapeHtml(value)}</p><p class="signal-source">${escapeHtml(source)}</p></div>`;
}

export function tagRow(items: readonly string[]): string {
  return `<div class="tag-row">${items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>`;
}

export function emptyState(message: string): string {
  return `<div class="empty-card"><p>${escapeHtml(message)}</p></div>`;
}

export function featureList(items: readonly string[]): string {
  if (items.length === 0) {
    return emptyState("No items were detected.");
  }
  return `<ul class="feature-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

export function readinessProgress(score: number, maxScore: number): string {
  const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  return `<div class="readiness-progress" role="progressbar" aria-valuenow="${score}" aria-valuemin="0" aria-valuemax="${maxScore}"><div class="readiness-progress-bar" style="width:${percent}%"></div><span class="readiness-progress-label">${escapeHtml(String(score))}/${escapeHtml(String(maxScore))}</span></div>`;
}

export function diagnosticDimensionCard(dimension: DiagnosticDimension): string {
  const percent = dimension.maxScore > 0 ? Math.round((dimension.score / dimension.maxScore) * 100) : 0;
  return `<article class="dimension-card"><div class="dimension-card-header"><strong>${escapeHtml(dimension.label)}</strong><span>${escapeHtml(String(dimension.score))}/${escapeHtml(String(dimension.maxScore))}</span></div><div class="dimension-progress"><span style="width:${percent}%"></span></div>${dimension.gaps.length > 0 ? `<p class="dimension-gap">${escapeHtml(dimension.gaps[0] ?? "")}</p>` : `<p class="dimension-strength">${escapeHtml(dimension.strengths[0] ?? "No gaps detected.")}</p>`}</article>`;
}

export function diagnosticDimensionsGrid(dimensions: readonly DiagnosticDimension[]): string {
  return `<div class="dimension-grid">${dimensions.map((dimension) => diagnosticDimensionCard(dimension)).join("")}</div>`;
}

export function showMoreBlock(summary: string, body: string): string {
  return `<details class="show-more"><summary>${escapeHtml(summary)}</summary><div class="show-more-body">${body}</div></details>`;
}
