import type { DiagnosticDimension, RepositoryDiagnostics, SiteModel } from "../types.js";

type DiagnosticSourceModel = Omit<SiteModel, "diagnostics">;

type DimensionInput = Pick<DiagnosticDimension, "id" | "label"> & {
  readonly checks: readonly DiagnosticCheck[];
};

type DiagnosticCheck = {
  readonly passed: boolean;
  readonly points: number;
  readonly strength: string;
  readonly gap: string;
  readonly recommendation: string;
};

const maxScore = 100;

export function evaluateRepositoryDiagnostics(model: DiagnosticSourceModel): RepositoryDiagnostics {
  const dimensions = [
    readmeDimension(model),
    visualsDimension(model),
    developerJourneyDimension(model),
    architectureDimension(model),
    releaseDimension(model)
  ].map(scoreDimension);
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

function readmeDimension(model: DiagnosticSourceModel): DimensionInput {
  const coverage = model.knowledgeBase.readmeCoverage;
  return {
    id: "readme",
    label: "README coverage",
    checks: [
      check(coverage.hasTitle, 4, "README has a clear title.", "README is missing a title.", "Add a top-level README title."),
      check(
        coverage.hasSummary,
        6,
        "README has a concise summary.",
        "README is missing a summary.",
        "Add a short README paragraph that explains the project outcome."
      ),
      check(
        coverage.featureCount > 0,
        6,
        "README lists project capabilities.",
        "README is missing a feature list.",
        "Add a small feature or capability list to the README."
      ),
      check(
        coverage.hasInstallation,
        5,
        "README includes installation steps.",
        "README is missing installation steps.",
        "Document the install command or setup flow."
      ),
      check(
        coverage.hasUsage,
        5,
        "README includes usage guidance.",
        "README is missing usage guidance.",
        "Add a first-run command or usage example."
      ),
      check(coverage.faqCount > 0, 4, "README includes FAQ material.", "README is missing FAQ material.", "Add FAQ notes for common adoption questions.")
    ]
  };
}

function visualsDimension(model: DiagnosticSourceModel): DimensionInput {
  return {
    id: "visuals",
    label: "Visual assets",
    checks: [
      check(
        model.screenshots.length > 0,
        10,
        "Visual assets are available for the generated showcase.",
        "No visual assets were detected.",
        "Add at least one screenshot, GIF, or product image under README or repository image paths."
      ),
      check(
        Boolean(model.repository.homepage),
        5,
        "Repository metadata links to a homepage.",
        "Repository metadata has no homepage link.",
        "Add a GitHub homepage URL when there is a live demo or documentation site."
      )
    ]
  };
}

function developerJourneyDimension(model: DiagnosticSourceModel): DimensionInput {
  return {
    id: "developerJourney",
    label: "Developer journey",
    checks: [
      check(
        Boolean(model.readme.installation && model.readme.usage),
        10,
        "Installation and usage form a complete first-run path.",
        "Installation and usage are not both documented.",
        "Pair installation steps with a first successful usage command."
      ),
      check(
        model.knowledgeBase.entryFiles.length > 0,
        5,
        "Common entry files were detected.",
        "No common entry files were detected.",
        "Expose a conventional entry file or document the project entrypoint."
      )
    ]
  };
}

function architectureDimension(model: DiagnosticSourceModel): DimensionInput {
  return {
    id: "architecture",
    label: "Architecture signals",
    checks: [
      check(
        model.knowledgeBase.projectStructure.length > 0,
        5,
        "Repository tree provides structure signals.",
        "Repository tree has no structure signals.",
        "Ensure the repository tree can be fetched from GitHub."
      ),
      check(
        model.knowledgeBase.techStack.length > 0,
        5,
        "Technology stack markers were detected.",
        "No technology stack markers were detected.",
        "Add common config files such as package.json, pyproject.toml, go.mod, or Cargo.toml."
      ),
      check(
        model.knowledgeBase.configFiles.length > 0,
        5,
        "Configuration files explain how the project is built.",
        "No known configuration files were detected.",
        "Include common config files or an example environment file."
      ),
      check(
        model.knowledgeBase.directorySummaries.length > 0,
        5,
        "Directory summaries are available for the code wiki.",
        "Directory summaries are not available.",
        "Keep source files in discoverable top-level directories."
      ),
      check(
        model.knowledgeBase.moduleMap.length > 0,
        5,
        "Module map data is available.",
        "Module map data is not available.",
        "Add enough tracked source paths for a useful repository map."
      )
    ]
  };
}

function releaseDimension(model: DiagnosticSourceModel): DimensionInput {
  return {
    id: "release",
    label: "Release signals",
    checks: [
      check(
        model.releases.length > 0,
        5,
        "GitHub releases are available.",
        "No GitHub releases were detected.",
        "Create GitHub releases for stable milestones."
      ),
      check(
        Boolean(model.repository.license),
        4,
        "Repository license is declared.",
        "Repository license was not detected.",
        "Add a repository license so visitors understand reuse terms."
      ),
      check(
        Boolean(model.repository.homepage),
        3,
        "Homepage metadata helps visitors continue.",
        "Homepage metadata was not detected.",
        "Add a homepage link for documentation, demo, or product context."
      ),
      check(
        model.repository.topics.length > 0,
        3,
        "Repository topics improve generated positioning.",
        "Repository topics were not detected.",
        "Add GitHub topics that describe the project domain and stack."
      )
    ]
  };
}

function check(passed: boolean, points: number, strength: string, gap: string, recommendation: string): DiagnosticCheck {
  return { passed, points, strength, gap, recommendation };
}

function scoreDimension(input: DimensionInput): DiagnosticDimension {
  const score = input.checks.reduce((total, item) => total + (item.passed ? item.points : 0), 0);
  const maxDimensionScore = input.checks.reduce((total, item) => total + item.points, 0);
  const strengths = input.checks.filter((item) => item.passed).map((item) => item.strength);
  const gaps = input.checks.filter((item) => !item.passed).map((item) => item.gap);
  const recommendations = input.checks.filter((item) => !item.passed).map((item) => item.recommendation);

  return {
    id: input.id,
    label: input.label,
    score,
    maxScore: maxDimensionScore,
    strengths: collapseReadmeStrengths(input.id, strengths),
    gaps,
    recommendations
  };
}

function collapseReadmeStrengths(id: DiagnosticDimension["id"], strengths: readonly string[]): readonly string[] {
  if (id !== "readme" || strengths.length !== 6) {
    return strengths;
  }
  return ["README covers title, summary, features, installation, usage, and FAQ."];
}

function grade(score: number): RepositoryDiagnostics["grade"] {
  if (score >= 80) return "ready";
  if (score >= 50) return "solid";
  return "needs-work";
}

function unique(items: readonly string[]): readonly string[] {
  return [...new Set(items)];
}
