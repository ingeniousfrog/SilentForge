import { mkdtemp, rm } from "node:fs/promises";
import { basename, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import type { PresentationGenerationOptions, RepositorySnapshot, SiteModel } from "../types.js";

export type JobStatus = "queued" | "running" | "complete" | "failed";

export type JobEvent = {
  readonly id: number;
  readonly type: "step" | "complete" | "error";
  readonly message: string;
  readonly timestamp: string;
};

export type WorkbenchJob = {
  readonly id: string;
  readonly repoUrl: string;
  readonly useAi: boolean;
  readonly githubToken?: string;
  readonly generationOptions: PresentationGenerationOptions;
  readonly status: JobStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly completedAt?: string;
  readonly workspaceDir: string;
  readonly outputDir: string;
  readonly events: readonly JobEvent[];
  readonly snapshot?: RepositorySnapshot;
  readonly model?: SiteModel;
  readonly error?: string;
};

export type PublicJob = {
  readonly id: string;
  readonly repoUrl: string;
  readonly status: JobStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly completedAt?: string;
  readonly events: readonly JobEvent[];
  readonly error?: string;
  readonly hasSnapshot: boolean;
  readonly hasModel: boolean;
  readonly generationOptions: PresentationGenerationOptions;
};

export type JobStoreOptions = {
  readonly maxJobs?: number;
  readonly cleanupWorkspace?: (workspaceDir: string) => Promise<void>;
};

const defaultMaxJobs = 20;

export class JobStore {
  #jobs = new Map<string, WorkbenchJob>();
  readonly #maxJobs: number;
  readonly #cleanupWorkspace: (workspaceDir: string) => Promise<void>;

  constructor(options: JobStoreOptions = {}) {
    this.#maxJobs = options.maxJobs ?? defaultMaxJobs;
    this.#cleanupWorkspace = options.cleanupWorkspace ?? cleanupWorkbenchWorkspace;
  }

  async create(
    repoUrl: string,
    useAi = false,
    generationOptions: PresentationGenerationOptions = {},
    githubToken?: string
  ): Promise<WorkbenchJob> {
    const id = createJobId();
    const workspaceDir = await mkdtemp(join(tmpdir(), "reposite-workbench-"));
    const now = new Date().toISOString();
    const job: WorkbenchJob = {
      id,
      repoUrl,
      useAi,
      ...(githubToken ? { githubToken } : {}),
      generationOptions,
      status: "queued",
      createdAt: now,
      updatedAt: now,
      workspaceDir,
      outputDir: join(workspaceDir, "site"),
      events: []
    };

    const { jobs, evicted } = trimJobs(new Map([...this.#jobs, [id, job]]), this.#maxJobs);
    this.#jobs = jobs;
    await Promise.allSettled(evicted.map((evictedJob) => this.#cleanupWorkspace(evictedJob.workspaceDir)));
    return job;
  }

  get(id: string): WorkbenchJob | undefined {
    return this.#jobs.get(id);
  }

  publicJob(id: string): PublicJob | undefined {
    const job = this.get(id);
    return job ? toPublicJob(job) : undefined;
  }

  pushEvent(id: string, type: JobEvent["type"], message: string): WorkbenchJob {
    const job = this.require(id);
    const event: JobEvent = {
      id: job.events.length + 1,
      type,
      message,
      timestamp: new Date().toISOString()
    };
    return this.patch(id, { events: [...job.events, event] });
  }

  patch(id: string, patch: Partial<Omit<WorkbenchJob, "id" | "createdAt">>): WorkbenchJob {
    const job = this.require(id);
    const now = new Date().toISOString();
    const nextJob: WorkbenchJob = {
      ...job,
      ...patch,
      completedAt: patch.completedAt ?? (isTerminalStatus(patch.status) && !job.completedAt ? now : job.completedAt),
      updatedAt: now
    };
    this.#jobs = new Map([...this.#jobs, [id, nextJob]]);
    return nextJob;
  }

  require(id: string): WorkbenchJob {
    const job = this.get(id);
    if (!job) {
      throw new Error(`Unknown job: ${id}`);
    }
    return job;
  }
}

export function toPublicJob(job: WorkbenchJob): PublicJob {
  return {
    id: job.id,
    repoUrl: job.repoUrl,
    status: job.status,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    completedAt: job.completedAt,
    events: job.events,
    error: job.error,
    hasSnapshot: Boolean(job.snapshot),
    hasModel: Boolean(job.model),
    generationOptions: job.generationOptions
  };
}

function trimJobs(
  jobs: ReadonlyMap<string, WorkbenchJob>,
  maxJobs: number
): { readonly jobs: Map<string, WorkbenchJob>; readonly evicted: readonly WorkbenchJob[] } {
  const entries = [...jobs.entries()];
  const removeCount = Math.max(entries.length - maxJobs, 0);
  const evicted = entries.slice(0, removeCount).map(([, job]) => job);
  return {
    jobs: new Map(entries.slice(removeCount)),
    evicted
  };
}

function isTerminalStatus(status: JobStatus | undefined): boolean {
  return status === "complete" || status === "failed";
}

async function cleanupWorkbenchWorkspace(workspaceDir: string): Promise<void> {
  if (!isSafeWorkbenchWorkspace(workspaceDir)) {
    return;
  }
  await rm(workspaceDir, { recursive: true, force: true });
}

function isSafeWorkbenchWorkspace(workspaceDir: string): boolean {
  const tempRoot = resolve(tmpdir());
  const target = resolve(workspaceDir);
  const relativePath = relative(tempRoot, target);
  return (
    relativePath.length > 0 &&
    !relativePath.startsWith("..") &&
    !relativePath.startsWith("/") &&
    basename(target).startsWith("reposite-workbench-")
  );
}

function createJobId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
