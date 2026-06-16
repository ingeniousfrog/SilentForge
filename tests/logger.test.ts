import { afterEach, describe, expect, it, vi } from "vitest";
import { logger } from "../src/logger.js";

const stdoutWrite = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
const stderrWrite = vi.spyOn(process.stderr, "write").mockImplementation(() => true);

afterEach(() => {
  vi.clearAllMocks();
});

describe("logger", () => {
  it("writes info messages to stdout", () => {
    logger.info("hello");

    expect(stdoutWrite).toHaveBeenCalledWith("hello\n");
  });

  it("writes error messages to stderr", () => {
    logger.error("boom");

    expect(stderrWrite).toHaveBeenCalledWith("boom\n");
  });
});
