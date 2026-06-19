import type { Locale, PresentationGenerationOptions, RepositorySnapshot, SiteModel } from "../types.js";
import { evaluateRepositoryDiagnostics } from "../site/diagnostics.js";
import { resolveGenerationLocale } from "../i18n/index.js";

export type ResourceView = {
  readonly repository: SiteModel["repository"];
  readonly readme: SiteModel["readme"];
  readonly releases: SiteModel["releases"];
  readonly screenshots: SiteModel["screenshots"];
  readonly knowledgeBase: SiteModel["knowledgeBase"];
  readonly diagnostics: SiteModel["diagnostics"];
  readonly files: readonly {
    readonly path: string;
    readonly type: string;
    readonly size?: number;
  }[];
  readonly configFiles: readonly {
    readonly path: string;
    readonly type: string;
    readonly size?: number;
  }[];
};

export function createResourceView(
  snapshot: RepositorySnapshot,
  model: SiteModel,
  generationOptions: PresentationGenerationOptions = {}
): ResourceView {
  const locale = resolveGenerationLocale(generationOptions);
  const { diagnostics: _diagnostics, ...diagnosticSource } = model;

  return {
    repository: model.repository,
    readme: model.readme,
    releases: model.releases,
    screenshots: model.screenshots,
    knowledgeBase: model.knowledgeBase,
    diagnostics: evaluateRepositoryDiagnostics(diagnosticSource, locale),
    files: snapshot.files.map((file) => ({
      path: file.path,
      type: file.type,
      size: file.size
    })),
    configFiles: snapshot.configFiles.map((file) => ({
      path: file.path,
      type: file.type,
      size: file.size
    }))
  };
}
