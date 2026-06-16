import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { RepositorySnapshot, SiteModel } from "../types.js";

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
  readonly status: JobStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
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
  readonly events: readonly JobEvent[];
  readonly error?: string;
  readonly hasSnapshot: boolean;
  readonly hasModel: boolean;
};

export class JobStore {
  readonly #jobs = new Map<string, WorkbenchJob>();

  async create(repoUrl: string): Promise<WorkbenchJob> {
    const id = createJobId();
    const workspaceDir = await mkdtemp(join(tmpdir(), "reposite-workbench-"));
    const now = new Date().toISOString();
    const job: WorkbenchJob = {
      id,
      repoUrl,
      status: "queued",
      createdAt: now,
      updatedAt: now,
      workspaceDir,
      outputDir: join(workspaceDir, "site"),
      events: []
    };

    this.#jobs.set(id, job);
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
    const nextJob: WorkbenchJob = {
      ...job,
      ...patch,
      updatedAt: new Date().toISOString()
    };
    this.#jobs.set(id, nextJob);
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
    events: job.events,
    error: job.error,
    hasSnapshot: Boolean(job.snapshot),
    hasModel: Boolean(job.model)
  };
}

function createJobId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
