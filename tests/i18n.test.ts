import { describe, expect, it } from "vitest";
import { htmlLang, resolveLocale, t } from "../src/i18n/index.js";

describe("i18n", () => {
  it("returns Chinese strings for zh locale", () => {
    expect(t("zh", "workbench.heroTitle")).toContain("GitHub");
    expect(t("zh", "presentation.chapterTitle.features")).toBe("核心能力");
    expect(t("zh", "site.backToTop")).toContain("返回顶部");
  });

  it("falls back to English for invalid locale values", () => {
    expect(resolveLocale("fr")).toBe("en");
    expect(resolveLocale(undefined)).toBe("en");
    expect(t("en", "presentation.detailTitle.install")).toBe("Installation");
  });

  it("interpolates message parameters", () => {
    expect(t("en", "generator.fetchedPaths", { files: 3, releases: 1 })).toBe(
      "Fetched 3 repository paths and 1 releases."
    );
  });

  it("maps html lang attributes", () => {
    expect(htmlLang("en")).toBe("en");
    expect(htmlLang("zh")).toBe("zh-CN");
  });
});
