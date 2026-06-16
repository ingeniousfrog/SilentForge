import { describe, expect, it } from "vitest";
import { createCli } from "../src/cli.js";

describe("createCli", () => {
  it("registers init, dev, and build commands", () => {
    const commandNames = createCli()
      .commands.map((command) => command.name())
      .sort();

    expect(commandNames).toEqual(["build", "dev", "init", "web"]);
  });

  it("does not exit on error while imported", () => {
    expect(createCli().name()).toBe("reposite");
  });
});
