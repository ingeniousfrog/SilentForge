import { describe, expect, it } from "vitest";
import { renderInlineMarkdown, stripInlineMarkdown } from "../src/shared/markdown.js";

describe("stripInlineMarkdown", () => {
  it("removes bold markers from readme summaries", () => {
    expect(stripInlineMarkdown("**DwarfStar** is a native inference engine.")).toBe(
      "DwarfStar is a native inference engine."
    );
  });
});

describe("renderInlineMarkdown", () => {
  it("renders bold text as strong elements", () => {
    expect(renderInlineMarkdown("**DwarfStar** is optimized for **DeepSeek V4 Flash**.")).toBe(
      "<strong>DwarfStar</strong> is optimized for <strong>DeepSeek V4 Flash</strong>."
    );
  });

  it("escapes raw html while preserving markdown formatting", () => {
    expect(renderInlineMarkdown("Use `<script>` and **safe** text.")).toBe(
      'Use <code class="inline-code">&lt;script&gt;</code> and <strong>safe</strong> text.'
    );
  });

  it("renders safe external links", () => {
    expect(renderInlineMarkdown("See [Docs](https://example.com/docs) for details.")).toBe(
      'See <a href="https://example.com/docs" target="_blank" rel="noreferrer">Docs</a> for details.'
    );
  });
});
