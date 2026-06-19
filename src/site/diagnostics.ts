import type { DiagnosticDimension, Locale, RepositoryDiagnostics, SiteModel } from "../types.js";
import { t } from "../i18n/index.js";
import { DEFAULT_LOCALE } from "../i18n/types.js";

type DiagnosticSourceModel = Omit<SiteModel, "diagnostics">;

type DimensionInput = {
  readonly id: DiagnosticDimension["id"];
  readonly checks: readonly DiagnosticCheck[];
};

type DiagnosticCheck = {
  readonly passed: boolean;
  readonly points: number;
  readonly strengthKey: string;
  readonly gapKey: string;
  readonly recommendationKey: string;
};

const maxScore = 100;

export function evaluateRepositoryDiagnostics(
  model: DiagnosticSourceModel,
  locale: Locale = DEFAULT_LOCALE
): RepositoryDiagnostics {
  const dimensions = [
    readmeDimension(model, locale),
    visualsDimension(model, locale),
    developerJourneyDimension(model, locale),
    architectureDimension(model, locale),
    releaseDimension(model, locale)
  ].map((input) => scoreDimension(input, locale));
  const score = dimensions.reduce((total, dimension) => total + dimension.score, 0);

  return {
    score,
    maxScore,
    grade: grade(score),
    strengths: unique(dimensions.flatMap((dimension) => dimension.strengths)),
    gaps: unique(dimensions.flatMap((dimension) => dimension.gaps)),
    recommendations: unique(dimensions.flatMap((dimension) => dimension.recommendations)),
    dimensions
  };
}

function readmeDimension(model: DiagnosticSourceModel, locale: Locale): DimensionInput {
  const coverage = model.knowledgeBase.readmeCoverage;
  return {
    id: "readme",
    checks: [
      check(coverage.hasTitle, 4, "readmeTitleStrength", "readmeTitleGap", "readmeTitleRecommendation", locale),
      check(coverage.hasSummary, 6, "readmeSummaryStrength", "readmeSummaryGap", "readmeSummaryRecommendation", locale),
      check(coverage.featureCount > 0, 6, "readmeFeaturesStrength", "readmeFeaturesGap", "readmeFeaturesRecommendation", locale),
      check(coverage.hasInstallation, 5, "readmeInstallStrength", "readmeInstallGap", "readmeInstallRecommendation", locale),
      check(coverage.hasUsage, 5, "readmeUsageStrength", "readmeUsageGap", "readmeUsageRecommendation", locale),
      check(coverage.faqCount > 0, 4, "readmeFaqStrength", "readmeFaqGap", "readmeFaqRecommendation", locale)
    ]
  };
}

function visualsDimension(model: DiagnosticSourceModel, locale: Locale): DimensionInput {
  return {
    id: "visuals",
    checks: [
      check(
        model.screenshots.length > 0,
        10,
        "visualsAssetsStrength",
        "visualsAssetsGap",
        "visualsAssetsRecommendation",
        locale
      ),
      check(
        Boolean(model.repository.homepage),
        5,
        "visualsHomepageStrength",
        "visualsHomepageGap",
        "visualsHomepageRecommendation",
        locale
      )
    ]
  };
}

function developerJourneyDimension(model: DiagnosticSourceModel, locale: Locale): DimensionInput {
  return {
    id: "developerJourney",
    checks: [
      check(
        Boolean(model.readme.installation && model.readme.usage),
        10,
        "journeyPathStrength",
        "journeyPathGap",
        "journeyPathRecommendation",
        locale
      ),
      check(model.knowledgeBase.entryFiles.length > 0, 5, "journeyEntryStrength", "journeyEntryGap", "journeyEntryRecommendation", locale)
    ]
  };
}

function architectureDimension(model: DiagnosticSourceModel, locale: Locale): DimensionInput {
  return {
    id: "architecture",
    checks: [
      check(
        model.knowledgeBase.projectStructure.length > 0,
        5,
        "architectureTreeStrength",
        "architectureTreeGap",
        "architectureTreeRecommendation",
        locale
      ),
      check(
        model.knowledgeBase.techStack.length > 0,
        5,
        "architectureStackStrength",
        "architectureStackGap",
        "architectureStackRecommendation",
        locale
      ),
      check(
        model.knowledgeBase.configFiles.length > 0,
        5,
        "architectureConfigStrength",
        "architectureConfigGap",
        "architectureConfigRecommendation",
        locale
      ),
      check(
        model.knowledgeBase.directorySummaries.length > 0,
        5,
        "architectureDirectoryStrength",
        "architectureDirectoryGap",
        "architectureDirectoryRecommendation",
        locale
      ),
      check(
        model.knowledgeBase.moduleMap.length > 0,
        5,
        "architectureModuleStrength",
        "architectureModuleGap",
        "architectureModuleRecommendation",
        locale
      )
    ]
  };
}

function releaseDimension(model: DiagnosticSourceModel, locale: Locale): DimensionInput {
  return {
    id: "release",
    checks: [
      check(model.releases.length > 0, 5, "releaseAvailableStrength", "releaseAvailableGap", "releaseAvailableRecommendation", locale),
      check(Boolean(model.repository.license), 4, "releaseLicenseStrength", "releaseLicenseGap", "releaseLicenseRecommendation", locale),
      check(Boolean(model.repository.homepage), 3, "releaseHomepageStrength", "releaseHomepageGap", "releaseHomepageRecommendation", locale),
      check(model.repository.topics.length > 0, 3, "releaseTopicsStrength", "releaseTopicsGap", "releaseTopicsRecommendation", locale)
    ]
  };
}

function check(
  passed: boolean,
  points: number,
  strengthKey: string,
  gapKey: string,
  recommendationKey: string,
  locale: Locale
): DiagnosticCheck {
  return {
    passed,
    points,
    strengthKey,
    gapKey,
    recommendationKey
  };
}

function diagnosticMessage(locale: Locale, key: string): string {
  return t(locale, `diagnostics.check.${key}`);
}

function scoreDimension(input: DimensionInput, locale: Locale): DiagnosticDimension {
  const score = input.checks.reduce((total, item) => total + (item.passed ? item.points : 0), 0);
  const maxDimensionScore = input.checks.reduce((total, item) => total + item.points, 0);
  const strengths = input.checks.filter((item) => item.passed).map((item) => diagnosticMessage(locale, item.strengthKey));
  const gaps = input.checks.filter((item) => !item.passed).map((item) => diagnosticMessage(locale, item.gapKey));
  const recommendations = input.checks
    .filter((item) => !item.passed)
    .map((item) => diagnosticMessage(locale, item.recommendationKey));

  return {
    id: input.id,
    label: t(locale, `diagnostics.dimension.${input.id}`),
    score,
    maxScore: maxDimensionScore,
    strengths: collapseReadmeStrengths(input.id, strengths, locale),
    gaps,
    recommendations
  };
}

function collapseReadmeStrengths(
  id: DiagnosticDimension["id"],
  strengths: readonly string[],
  locale: Locale
): readonly string[] {
  if (id !== "readme" || strengths.length !== 6) {
    return strengths;
  }
  return [t(locale, "diagnostics.readmeCollapsedStrength")];
}

function grade(score: number): RepositoryDiagnostics["grade"] {
  if (score >= 80) return "ready";
  if (score >= 50) return "solid";
  return "needs-work";
}

function unique(items: readonly string[]): readonly string[] {
  return [...new Set(items)];
}
