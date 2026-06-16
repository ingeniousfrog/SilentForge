import { execa } from "execa";

export type AstroCommandOptions = {
  readonly cwd?: string;
};

export async function runAstroScript(script: "dev" | "build", options: AstroCommandOptions = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  await execa("npm", ["run", script], {
    cwd,
    stdio: "inherit",
    preferLocal: true
  });
}
