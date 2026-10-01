// Talking to the video worker: the small service in workers/video-transcriber
// that downloads a YouTube / Facebook / Instagram / TikTok / Vimeo video with
// yt-dlp and turns it into text — the platform's own captions when there are
// some, Groq Whisper when there aren't. It also transcribes a teacher's own
// uploaded file, either fetched from Storage or sent to it straight from the
// browser — see src/lib/school/lesson-media.ts.
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
import { withSiteHelpLink } from "@/lib/school/video-links";
import { signUploadToken } from "@/lib/school/upload-token";

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
  // What the job spent, for the platform admin's cost panel. Null from a
  // worker that predates reporting them.
  audioSeconds: number | null;
  downloadBytes: number | null;
  proxied: boolean | null;
};

const STATUSES: LessonVideoJobStatus[] = ["queued", "downloading", "transcribing", "done", "error"];

function parseReport(body: unknown): WorkerJobReport | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const status = STATUSES.find((s) => s === b.status);
  if (!status) return null;
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
  // A count can't be negative; one that claims to be is noise, not usage.
  const count = (v: unknown) => {
    const n = num(v);
    return n === null || n < 0 ? null : Math.round(n);
  };
  return {
    status,
    progress: Math.min(1, Math.max(0, num(b.progress) ?? 0)),
    message: str(b.message),
    title: str(b.title),
    durationSeconds: num(b.duration_seconds) === null ? null : Math.round(num(b.duration_seconds)!),
    method: b.method === "captions" || b.method === "whisper" ? b.method : null,
    transcript: str(b.transcript),
    error: str(b.error),
    audioSeconds: count(b.audio_seconds),
    downloadBytes: count(b.download_bytes),
    proxied: typeof b.proxied === "boolean" ? b.proxied : null,
  };
}

export type StartResult = { ok: true } | { ok: false; error: string };

// What the worker is asked to transcribe:
//   link    a video link, fetched with yt-dlp (captions first, then Whisper);
//   file    a kept upload, fetched from its public Storage URL;
//   direct  nothing yet — the browser will PUT the file to the worker itself.
export type WorkerJobSource =
  | { kind: "link"; url: string }
  | { kind: "file"; url: string; fileName: string }
  | { kind: "direct"; fileName: string };

function startBody(jobId: string, source: WorkerJobSource) {
  switch (source.kind) {
    case "link":
      return { id: jobId, url: source.url };
    case "file":
      return { id: jobId, kind: "file", url: source.url, file_name: source.fileName };
    case "direct":
      return { id: jobId, kind: "direct", file_name: source.fileName };
  }
}

// Hands a job to the worker. It answers straight away and does the work in
// the background; the job id is ours, so a retry of the same id is harmless.
export async function startWorkerJob(jobId: string, source: WorkerJobSource): Promise<StartResult> {
  try {
    const response = await callWorker("/jobs", {
      method: "POST",
      body: JSON.stringify(startBody(jobId, source)),
    });
    if (response.ok) return { ok: true };

    const body = (await response.json().catch(() => null)) as { detail?: unknown } | null;
    const detail = typeof body?.detail === "string" ? body.detail : null;
    console.error("Video worker refused job", response.status, detail);
    if (response.status === 401 || response.status === 403) {
      return { ok: false, error: "The video service isn't set up correctly (its secret doesn't match)." };
    }
    return {
      ok: false,
      error: detail ?? (source.kind === "link" ? "The video service couldn't take that link." : "The video service couldn't take that file."),
    };
  } catch (error) {
    console.error("Could not reach video worker", error);
    return { ok: false, error: "The video service isn't answering right now — try again in a minute." };
  }
}

// Where, and with what, the browser sends a file too big for Storage. The
// token is good for this one job only; see src/lib/school/upload-token.ts.
export function directUploadTarget(jobId: string): { uploadUrl: string; uploadToken: string } {
  return {
    uploadUrl: workerUrl(`/jobs/${encodeURIComponent(jobId)}/upload`),
    uploadToken: signUploadToken(process.env.VIDEO_WORKER_SECRET ?? "", jobId),
  };
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
    kind: job.kind,
    sourceUrl: job.source_url,
    fileName: job.file_name,
    // The caller's own kept upload, so "Use transcript" can put it on the
    // lesson. Only ever the caller's: RLS keeps jobs private to their owner.
    storagePath: job.storage_path,
    status: job.status,
    progress: job.progress,
    message: job.message,
    title: job.title,
    durationSeconds: job.duration_seconds,
    method: job.method,
    error: withSiteHelpLink(job.error),
    createdAt: job.created_at,
    transcriptChars: job.transcript?.length ?? 0,
    transcript: withTranscript ? job.transcript : null,
  };
}

export type PublicVideoJob = ReturnType<typeof publicJob>;
