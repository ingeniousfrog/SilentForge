import { planSchema, type ParsedPresentationPlan } from "../presentation/schema.js";

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

function readString(value: JsonValue | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function readObject(value: JsonValue | undefined): Record<string, JsonValue> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value : undefined;
}

function readArray(value: JsonValue | undefined): JsonValue[] | undefined {
  return Array.isArray(value) ? value : undefined;
}

function extractMessageText(event: JsonValue): string | undefined {
  const root = readObject(event);
  if (!root) return undefined;

  const eventType = readString(root.type) ?? "";
  if (eventType === "agent_message" || eventType === "message" || eventType === "assistant_message") {
    for (const key of ["message", "text", "content"] as const) {
      const value = readString(root[key]);
      if (value) return value;
    }
  }

  const item = readObject(root.item);
  if (!item) return undefined;

  for (const key of ["message", "text", "content"] as const) {
    const value = readString(item[key]);
    if (value) return value;
  }

  const parts = readArray(item.content);
  if (!parts) return undefined;

  const text = parts
    .map((part) => readString(readObject(part)?.text))
    .filter((value): value is string => Boolean(value))
    .join("\n");

  return text || undefined;
}

export function parseCodexJsonl(stdout: string): string {
  const messages: string[] = [];

  for (const line of stdout.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    try {
      const event = JSON.parse(trimmed) as JsonValue;
      const text = extractMessageText(event);
      if (text) messages.push(text);
    } catch {
      continue;
    }
  }

  return messages.at(-1)?.trim() ?? stdout.trim();
}

export function stripMarkdownFence(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  return (fenced?.[1] ?? trimmed).trim();
}

export function extractJsonFromText(text: string): ParsedPresentationPlan {
  const candidates = [stripMarkdownFence(text), text.trim()];

  for (const candidate of candidates) {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start === -1 || end <= start) continue;

    try {
      const parsed = JSON.parse(candidate.slice(start, end + 1)) as unknown;
      const result = planSchema.safeParse(parsed);
      if (result.success) return result.data;
    } catch {
      continue;
    }
  }

  throw new Error("Codex returned no valid presentation plan JSON.");
}

export function parsePresentationPlanFromCodexOutput(stdout: string): ParsedPresentationPlan {
  const text = parseCodexJsonl(stdout);
  if (!text) throw new Error("Codex returned no assistant text.");
  return extractJsonFromText(text);
}

export function extractCodexErrorMessage(stdout: string, exitCode: number): string {
  const lines = stdout.split(/\r?\n/).filter((line) => line.trim());

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    try {
      const event = JSON.parse(lines[index]!) as JsonValue;
      const root = readObject(event);
      const message =
        readString(root?.message) ??
        readString(readObject(root?.error)?.message) ??
        readString(readObject(root?.item)?.message);

      if (message) {
        const lower = message.toLowerCase();
        if (lower.includes("log in again") || message.includes("登录") || lower.includes("refresh token")) {
          return "Codex session expired; run `codex login` and try again.";
        }
        return message;
      }
    } catch {
      continue;
    }
  }

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const trimmed = lines[index]!.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (lower.includes("log in again")) {
      return "Codex session expired; run `codex login` and try again.";
    }
    return trimmed;
  }

  return `Codex exec failed with exit code ${exitCode}.`;
}
