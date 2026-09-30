// Talking to the video worker: the small service in workers/video-transcriber
// that downloads a YouTube / Facebook / Instagram video with yt-dlp and turns
// it into text — the platform's own captions when there are some, Groq Whisper
// when there aren't.
//
// WHY A SEPARATE SERVICE
// yt-dlp needs Python and ffmpeg, an hour of audio is a few hundred MB to
// download, and YouTube refuses a good share of cloud-function IPs. None of
// that fits in a Vercel function, so it runs on a small always-on box (Railway,
// Fly, a VPS) and this file is the only thing that knows its address.
//
// THE CONVERSATION
// The app starts a job (POST /jobs) and later asks how it is going
// (GET /jobs/:id). The worker never calls back and holds no database
// credentials: the status route copies its answer into lesson_video_jobs.
// That keeps the worker's only secret a shared bearer token, and means a
// laptop running `next dev` works exactly like production.

import "server-only";
import type { LessonVideoJob, LessonVideoJobStatus } from "@/types/database";

const REQUEST_TIMEOUT_MS = 15_000;

export function isVideoWorkerConfigured(): boolean {
  return Boolean(process.env.VIDEO_WORKER_URL && process.env.VIDEO_WORKER_SECRET);
}

function workerUrl(path: string): string {
  const base = (process.env.VIDEO_WORKER_URL ?? "").replace(/\/+$/, "");
  return `${base}${path}`;
}

async function callWorker(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(workerUrl(path), {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${process.env.VIDEO_WORKER_SECRET ?? ""}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

// What the worker reports about one job. Every field is optional on the wire
// and checked here, because this is another service's JSON.
export type WorkerJobReport = {
  status: LessonVideoJobStatus;
  progress: number;
  message: string | null;
  title: string | null;
  durationSeconds: number | null;
  method: "captions" | "whisper" | null;
  transcript: string | null;
  error: string | null;
};

const STATUSES: LessonVideoJobStatus[] = ["queued", "downloading", "transcribing", "done", "error"];

function parseReport(body: unknown): WorkerJobReport | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const status = STATUSES.find((s) => s === b.status);
  if (!status) return null;
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
  return {
    status,
    progress: Math.min(1, Math.max(0, num(b.progress) ?? 0)),
    message: str(b.message),
    title: str(b.title),
    durationSeconds: num(b.duration_seconds) === null ? null : Math.round(num(b.duration_seconds)!),
    method: b.method === "captions" || b.method === "whisper" ? b.method : null,
    transcript: str(b.transcript),
    error: str(b.error),
  };
}

export type StartResult = { ok: true } | { ok: false; error: string };

// Hands a job to the worker. It answers straight away and does the work in
// the background; the job id is ours, so a retry of the same id is harmless.
export async function startWorkerJob(jobId: string, url: string): Promise<StartResult> {
  try {
    const response = await callWorker("/jobs", {
      method: "POST",
      body: JSON.stringify({ id: jobId, url }),
    });
    if (response.ok) return { ok: true };

    const body = (await response.json().catch(() => null)) as { detail?: unknown } | null;
    const detail = typeof body?.detail === "string" ? body.detail : null;
    console.error("Video worker refused job", response.status, detail);
    if (response.status === 401 || response.status === 403) {
      return { ok: false, error: "The video service isn't set up correctly (its secret doesn't match)." };
    }
    return { ok: false, error: detail ?? "The video service couldn't take that link." };
  } catch (error) {
    console.error("Could not reach video worker", error);
    return { ok: false, error: "The video service isn't answering right now — try again in a minute." };
  }
}

export type PollResult =
  | { ok: true; report: WorkerJobReport }
  // The worker has no record of it — it was restarted, or the job is older
  // than it keeps them.
  | { ok: false; lost: true }
  // Couldn't ask. Not the job's fault; the next poll tries again.
  | { ok: false; lost: false };

export async function pollWorkerJob(jobId: string): Promise<PollResult> {
  try {
    const response = await callWorker(`/jobs/${encodeURIComponent(jobId)}`);
    if (response.status === 404) return { ok: false, lost: true };
    if (!response.ok) return { ok: false, lost: false };
    const report = parseReport(await response.json().catch(() => null));
    return report ? { ok: true, report } : { ok: false, lost: false };
  } catch {
    return { ok: false, lost: false };
  }
}

export function isFinished(job: Pick<LessonVideoJob, "status">): boolean {
  return job.status === "done" || job.status === "error";
}

// What the browser gets. The transcript only rides along when asked for —
// the list of recent jobs doesn't need an hour of text per row.
export function publicJob(job: LessonVideoJob, withTranscript: boolean) {
  return {
    id: job.id,
    sourceUrl: job.source_url,
    status: job.status,
    progress: job.progress,
    message: job.message,
    title: job.title,
    durationSeconds: job.duration_seconds,
    method: job.method,
    error: job.error,
    createdAt: job.created_at,
    transcriptChars: job.transcript?.length ?? 0,
    transcript: withTranscript ? job.transcript : null,
  };
}

export type PublicVideoJob = ReturnType<typeof publicJob>;
