import { describe, expect, it } from "vitest";
import {
  extractCodexErrorMessage,
  extractJsonFromText,
  parseCodexJsonl,
  parsePresentationPlanFromCodexOutput
} from "../src/codex/parse.js";

const samplePlan = {
  mode: "developer-deck",
  theme: "signal-dark",
  chapters: [
    {
      id: "hero",
      kind: "hero",
      title: "Widget",
      sourceRefs: ["repository"],
      verticalDetails: []
    }
  ],
  detailPages: []
} as const;

describe("parseCodexJsonl", () => {
  it("extracts the last agent message from JSONL output", () => {
    const jsonl = [
      '{"type":"thread.started","thread_id":"abc"}',
      '{"type":"item.completed","item":{"type":"agent_message","text":"first"}}',
      '{"type":"item.completed","item":{"type":"agent_message","text":"{\\"mode\\":\\"developer-deck\\"}"}}'
    ].join("\n");

    expect(parseCodexJsonl(jsonl)).toBe('{"mode":"developer-deck"}');
  });

  it("falls back to raw stdout when no JSONL messages are present", () => {
    expect(parseCodexJsonl("plain output")).toBe("plain output");
  });
});

describe("extractJsonFromText", () => {
  it("parses raw JSON objects", () => {
    expect(extractJsonFromText(JSON.stringify(samplePlan))).toEqual(samplePlan);
  });

  it("strips markdown fences before parsing", () => {
    expect(extractJsonFromText("```json\n" + JSON.stringify(samplePlan) + "\n```")).toEqual(samplePlan);
  });

  it("throws when JSON does not match the presentation schema", () => {
    expect(() => extractJsonFromText('{"mode":"invalid"}')).toThrow(/valid presentation plan JSON/);
  });
});

describe("parsePresentationPlanFromCodexOutput", () => {
  it("parses a complete Codex JSONL response", () => {
    const jsonl = `{"type":"item.completed","item":{"type":"agent_message","text":${JSON.stringify(JSON.stringify(samplePlan))}}}`;
    expect(parsePresentationPlanFromCodexOutput(jsonl)).toEqual(samplePlan);
  });
});

describe("extractCodexErrorMessage", () => {
  it("detects expired Codex sessions", () => {
    const stdout = '{"type":"error","message":"Please log in again to continue."}';
    expect(extractCodexErrorMessage(stdout, 1)).toMatch(/session expired/i);
  });

  it("returns the last JSON error message when available", () => {
    const stdout = '{"type":"error","message":"Model unavailable"}';
    expect(extractCodexErrorMessage(stdout, 2)).toBe("Model unavailable");
  });
});
