import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  checkCodexLoginStatus,
  getAiTimeoutMs,
  getCodexModel,
  resolveCodexPath,
  type CodexLoginStatus
} from "./detect.js";
import { extractCodexErrorMessage, parsePresentationPlanFromCodexOutput } from "./parse.js";
import { runInPty, shouldUseStdinForPrompt } from "./pty.js";

export type CodexExecOptions = {
  readonly prompt: string;
  readonly model?: string;
  readonly codexPath?: string;
  readonly timeoutMs?: number;
};

export type CodexExecResult = {
  readonly stdout: string;
  readonly loginStatus: CodexLoginStatus;
};

function buildCodexArgs(prompt: string, model: string | undefined, workdir: string): { args: string[]; useStdin: boolean } {
  const args = [
    "exec",
    "--json",
    "--color",
    "never",
    "-s",
    "read-only",
    "--skip-git-repo-check",
    "--ephemeral",
    "-C",
    workdir
  ];

  if (model) {
    args.push("-m", model);
  }

  const useStdin = shouldUseStdinForPrompt(prompt);
  args.push(useStdin ? "-" : prompt);
  return { args, useStdin };
}

export async function runCodexExec(options: CodexExecOptions): Promise<CodexExecResult> {
  const codexPath = options.codexPath ?? resolveCodexPath();
  const loginStatus = checkCodexLoginStatus(codexPath);
  if (!codexPath) throw new Error("Codex CLI not found.");
  if (!loginStatus.loggedIn) throw new Error("Codex is not logged in; run `codex login` first.");

  const workdir = mkdtempSync(join(tmpdir(), "silentforge-codex-"));
  const model = options.model ?? getCodexModel();
  const { args, useStdin } = buildCodexArgs(options.prompt, model, workdir);

  try {
    const result = await runInPty({
      command: codexPath,
      args,
      prompt: options.prompt,
      useStdin,
      timeoutMs: options.timeoutMs ?? getAiTimeoutMs(),
      env: process.env
    });

    if (result.exitCode !== 0) {
      throw new Error(extractCodexErrorMessage(result.stdout, result.exitCode));
    }

    return { stdout: result.stdout, loginStatus };
  } finally {
    rmSync(workdir, { recursive: true, force: true });
  }
}

export async function runCodexExecForPlan(options: CodexExecOptions) {
  const result = await runCodexExec(options);
  return parsePresentationPlanFromCodexOutput(result.stdout);
}
