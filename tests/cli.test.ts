import { describe, expect, it } from "vitest";
import { createCli } from "../src/cli.js";

describe("createCli", () => {
  it("registers init and web commands", () => {
    const commandNames = createCli()
      .commands.map((command) => command.name())
      .sort();

    expect(commandNames).toEqual(["init", "web"]);
  });

  it("registers init generation option flags", () => {
    const init = createCli().commands.find((command) => command.name() === "init");
    expect(init?.options.map((option) => option.long)).toEqual(
      expect.arrayContaining(["--output", "--ai", "--mode", "--theme", "--chapters", "--locale", "--token"])
    );
  });
});
