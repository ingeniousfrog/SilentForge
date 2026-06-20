import { accessSync, constants } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

export type CodexLoginStatus = {
  readonly loggedIn: boolean;
  readonly detail: string;
  readonly path: string;
};

function isExecutable(path: string): boolean {
  try {
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function shellLookup(command: string): string | undefined {
  const result = spawnSync("/bin/sh", ["-lc", command], { encoding: "utf8" });
  if (result.status !== 0) return undefined;
  const value = result.stdout.trim();
  return value || undefined;
}

export function resolveCodexPath(customPath = process.env.CODEX_PATH): string | undefined {
  if (customPath?.trim()) {
    const resolved = customPath.trim();
    if (isExecutable(resolved)) return resolved;
    return undefined;
  }

  const fromPath = shellLookup("command -v codex");
  if (fromPath && isExecutable(fromPath)) return fromPath;

  const home = homedir();
  const candidates = [
    "/opt/homebrew/bin/codex",
    "/usr/local/bin/codex",
    join(home, ".codex/bin/codex"),
    join(home, ".npm-global/bin/codex"),
    join(home, ".local/bin/codex")
  ];

  for (const candidate of candidates) {
    if (isExecutable(candidate)) return candidate;
  }

  return undefined;
}

function applyProcessEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const nextEnv: NodeJS.ProcessEnv = { ...env };
  const home = homedir();

  nextEnv.HOME = home;
  nextEnv.CODEX_HOME = join(home, ".codex");
  if (!nextEnv.USER) {
    nextEnv.USER = shellLookup("whoami") ?? "user";
  }
  const path = shellLookup('printf "%s" "$PATH"');
  if (path) nextEnv.PATH = path;

  return nextEnv;
}

export function checkCodexLoginStatus(codexPath = resolveCodexPath()): CodexLoginStatus {
  if (!codexPath) {
    return { loggedIn: false, detail: "Codex CLI not found.", path: "" };
  }

  const result = spawnSync(codexPath, ["login", "status"], {
    encoding: "utf8",
    env: applyProcessEnv(process.env)
  });
  const detail = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
  const normalized = detail.toLowerCase();
  const loggedIn =
    result.status === 0 &&
    (normalized.includes("logged in") || normalized.includes("已登录") || detail.includes("登录"));

  return { loggedIn, detail: detail || `exit code ${result.status ?? "unknown"}`, path: codexPath };
}

export async function isCodexAvailable(): Promise<boolean> {
  const status = checkCodexLoginStatus();
  return Boolean(status.path) && status.loggedIn;
}

export function getAiTimeoutMs(): number {
  const raw = process.env.SILENTFORGE_AI_TIMEOUT_MS;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60_000;
}

export function getCodexModel(): string | undefined {
  const model = process.env.CODEX_MODEL?.trim() || process.env.OPENAI_MODEL?.trim();
  return model || undefined;
}

export function getOpenAiModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-5.5";
}
