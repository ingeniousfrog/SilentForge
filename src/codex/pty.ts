import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { platform } from "node:os";

export type PtyRunOptions = {
  readonly command: string;
  readonly args: readonly string[];
  readonly prompt?: string;
  readonly useStdin?: boolean;
  readonly timeoutMs: number;
  readonly env?: NodeJS.ProcessEnv;
};

export type PtyRunResult = {
  readonly stdout: string;
  readonly exitCode: number;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForProcess(
  child: ChildProcessWithoutNullStreams,
  timeoutMs: number
): Promise<PtyRunResult> {
  const stdoutChunks: Buffer[] = [];
  const stderrChunks: Buffer[] = [];

  child.stdout.on("data", (chunk: Buffer) => stdoutChunks.push(chunk));
  child.stderr.on("data", (chunk: Buffer) => stderrChunks.push(chunk));

  const started = Date.now();
  while (true) {
    const exitCode = child.exitCode;
    if (exitCode !== null) {
      const stdout = Buffer.concat(stdoutChunks).toString("utf8");
      const stderr = Buffer.concat(stderrChunks).toString("utf8");
      return { stdout: stdout || stderr, exitCode };
    }

    if (Date.now() - started >= timeoutMs) {
      child.kill("SIGTERM");
      await sleep(100);
      if (child.exitCode === null) child.kill("SIGKILL");
      throw new Error(`Codex CLI request timed out after ${Math.round(timeoutMs / 1000)}s`);
    }

    await sleep(25);
  }
}

async function runWithNodePty(options: PtyRunOptions): Promise<PtyRunResult> {
  const ptyModule = await import("node-pty");
  const pty = ptyModule.spawn(options.command, [...options.args], {
    name: "xterm-color",
    cols: 120,
    rows: 24,
    cwd: process.cwd(),
    env: options.env ?? process.env
  });

  if (options.useStdin && options.prompt) {
    pty.write(options.prompt);
  }

  return new Promise<PtyRunResult>((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => {
      try {
        pty.kill();
      } catch {
        // ignore kill errors on timeout
      }
      reject(new Error(`Codex CLI request timed out after ${Math.round(options.timeoutMs / 1000)}s`));
    }, options.timeoutMs);

    pty.onData((data) => {
      output += data;
    });

    pty.onExit(({ exitCode }) => {
      clearTimeout(timer);
      resolve({ stdout: output, exitCode: exitCode ?? 1 });
    });
  });
}

async function runWithScriptFallback(options: PtyRunOptions): Promise<PtyRunResult> {
  if (platform() === "win32") {
    throw new Error("PTY support is unavailable on Windows without node-pty.");
  }

  const shellCommand = [options.command, ...options.args.map((arg) => `'${arg.replace(/'/g, `'\\''`)}'`)].join(" ");
  const child = spawn("script", ["-q", "/dev/null", "/bin/sh", "-lc", shellCommand], {
    env: options.env,
    stdio: ["pipe", "pipe", "pipe"]
  });

  if (options.useStdin && options.prompt) {
    child.stdin.write(options.prompt);
  }
  child.stdin.end();

  return waitForProcess(child, options.timeoutMs);
}

export async function runInPty(options: PtyRunOptions): Promise<PtyRunResult> {
  try {
    return await runWithNodePty(options);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("Cannot find module 'node-pty'")) {
      return runWithScriptFallback(options);
    }
    throw error;
  }
}

export function shouldUseStdinForPrompt(prompt: string): boolean {
  return prompt.length > 120_000;
}
