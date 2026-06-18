import { describe, expect, it } from "vitest";
import { createCli } from "../src/cli.js";

describe("createCli", () => {
  it("registers init and web commands", () => {
    const commandNames = createCli()
      .commands.map((command) => command.name())
      .sort();

    expect(commandNames).toEqual(["init", "web"]);
  });

  it("does not exit on error while imported", () => {
    expect(createCli().name()).toBe("reposite");
  });
});
