import type { RepositorySnapshot, SiteModel } from "../types.js";

export type ResourceView = {
  readonly repository: SiteModel["repository"];
  readonly readme: SiteModel["readme"];
  readonly releases: SiteModel["releases"];
  readonly screenshots: SiteModel["screenshots"];
  readonly knowledgeBase: SiteModel["knowledgeBase"];
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

export function createResourceView(snapshot: RepositorySnapshot, model: SiteModel): ResourceView {
  return {
    repository: model.repository,
    readme: model.readme,
    releases: model.releases,
    screenshots: model.screenshots,
    knowledgeBase: model.knowledgeBase,
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
