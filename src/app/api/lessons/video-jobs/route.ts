// POST /api/lessons/video-jobs — start transcribing a video for the composer.
// GET  /api/lessons/video-jobs?spaceId=… — your recent video jobs in a space.
//
// Transcribing is its own step, like reading a page: the transcript lands in
// the composer to be read and trimmed, and only then becomes a lesson. An hour
// of video takes minutes, so this answers at once with a job and the composer
// polls /api/lessons/video-jobs/:id for progress.
//
// POST takes exactly one of three things (see lesson-media.ts for why two
// kinds of upload):
//   { spaceId, url }                     a YouTube / Facebook / Instagram link
//   { spaceId, upload: {storagePath, fileName, contentType, size} }
//                                        a file the browser already put in
//                                        Storage; kept, so the lesson can play it
//   { spaceId, directUpload: {fileName, contentType, size} }
//                                        a file too big for Storage; answered
//                                        with where to PUT it on the worker
//
// Staff-only and metered, for the same reason the writer is: it spends money.

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeLessonAuthor } from "@/lib/school/lesson-auth";
import { consumeLessonQuota } from "@/lib/school/lesson-quota";
import { checkAiAllowance } from "@/lib/usage/ai-spend";
import { parseVideoLink } from "@/lib/school/video-links";
import {
  directUploadTarget,
  isVideoWorkerConfigured,
  publicJob,
  startWorkerJob,
  type WorkerJobSource,
} from "@/lib/school/video-worker";
import { syncVideoJob } from "@/lib/school/video-job-sync";
import {
  MAX_DIRECT_MEDIA_BYTES,
  MAX_KEPT_MEDIA_BYTES,
  formatBytes,
  isMediaContentType,
  lessonMediaPublicUrl,
  titleFromFileName,
} from "@/lib/school/lesson-media";
import { findOwnUpload, pruneOldVideoJobs } from "@/lib/school/lesson-media-storage";
import { findLessonFromLink, lessonExistsError } from "@/lib/school/lesson-from-link";
import type { Database, LessonVideoJob } from "@/types/database";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "no-store" };

// How far back "recent" reaches in the composer.
const RECENT_MS = 3 * 24 * 60 * 60_000;
const RECENT_LIMIT = 5;

type JobInsert = Database["public"]["Tables"]["lesson_video_jobs"]["Insert"];

// What the browser asked for, checked as far as it can be without a database.
type Requested =
  | { kind: "link"; url: string }
  | { kind: "file"; storagePath: string; fileName: string; size: number }
  | { kind: "direct"; fileName: string; size: number }
  | { kind: "invalid"; error: string };

function cleanFileName(value: unknown): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f]/g, "").trim().slice(0, 200) : "";
}

function describeFile(value: unknown): { fileName: string; contentType: string; size: number } | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const size = typeof v.size === "number" && Number.isFinite(v.size) ? v.size : 0;
  return {
    fileName: cleanFileName(v.fileName) || "Uploaded file",
    contentType: typeof v.contentType === "string" ? v.contentType : "",
    size,
  };
}

function parseRequest(payload: Record<string, unknown>): Requested {
  if (payload.upload !== undefined) {
    const file = describeFile(payload.upload);
    const storagePath = (payload.upload as { storagePath?: unknown } | null)?.storagePath;
    if (!file || typeof storagePath !== "string" || !storagePath) {
      return { kind: "invalid", error: "Which upload?" };
    }
    return { kind: "file", storagePath, fileName: file.fileName, size: file.size };
  }

  if (payload.directUpload !== undefined) {
    const file = describeFile(payload.directUpload);
    if (!file || file.size <= 0) return { kind: "invalid", error: "Which file?" };
    // Said in the browser too; checked here so nobody is handed a token for
    // an upload the worker would refuse half-way through.
    if (file.size > MAX_DIRECT_MEDIA_BYTES) {
      return {
        kind: "invalid",
        error: `That file is ${formatBytes(file.size)} — the most the video service takes is ${formatBytes(MAX_DIRECT_MEDIA_BYTES)}.`,
      };
    }
    if (file.contentType && !isMediaContentType(file.contentType)) {
      return { kind: "invalid", error: "That isn't a video or audio file." };
    }
    return { kind: "direct", fileName: file.fileName, size: file.size };
  }

  const link = parseVideoLink(typeof payload.url === "string" ? payload.url : "");
  if (!link) return { kind: "invalid", error: "That isn't a YouTube, Facebook, Instagram, TikTok or Vimeo video link." };
  return { kind: "link", url: link.url };
}

function insertFor(requested: Exclude<Requested, { kind: "invalid" }>): Partial<JobInsert> {
  switch (requested.kind) {
    case "link":
      return { kind: "link", source_url: requested.url, message: "Waiting for the video service…" };
    case "file":
      return {
        kind: "file",
        file_name: requested.fileName,
        storage_path: requested.storagePath,
        title: titleFromFileName(requested.fileName),
        message: "Waiting for the video service…",
      };
    case "direct":
      return {
        kind: "direct",
        file_name: requested.fileName,
        title: titleFromFileName(requested.fileName),
        message: "Waiting for the upload…",
      };
  }
}

function workerSource(requested: Exclude<Requested, { kind: "invalid" }>): WorkerJobSource {
  switch (requested.kind) {
    case "link":
      return { kind: "link", url: requested.url };
    case "file":
      return {
        kind: "file",
        url: lessonMediaPublicUrl(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", requested.storagePath),
        fileName: requested.fileName,
      };
    case "direct":
      return { kind: "direct", fileName: requested.fileName };
  }
}

export async function POST(request: NextRequest) {
  if (!isVideoWorkerConfigured()) {
    return NextResponse.json(
      { error: "Transcribing videos isn't set up on this deployment yet." },
      { status: 503, headers: NO_STORE }
    );
  }

  const supabase = await createClient();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400, headers: NO_STORE });
  }

  const payload = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const spaceId = typeof payload.spaceId === "string" ? payload.spaceId : "";

  if (!spaceId) {
    return NextResponse.json({ error: "Which space?" }, { status: 400, headers: NO_STORE });
  }

  const requested = parseRequest(payload);
  if (requested.kind === "invalid") {
    return NextResponse.json({ error: requested.error }, { status: 400, headers: NO_STORE });
  }

  const auth = await authorizeLessonAuthor(supabase, spaceId);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers: NO_STORE });
  }

  // A kept upload has to be the caller's own, and actually there, before the
  // worker is sent to fetch it: otherwise this is a way to make the worker
  // download anybody's file.
  if (requested.kind === "file") {
    const found = await findOwnUpload(supabase, auth.userId, requested.storagePath);
    if (!found.ok) {
      return NextResponse.json({ error: found.error }, { status: 400, headers: NO_STORE });
    }
    if (found.size !== null && found.size > MAX_KEPT_MEDIA_BYTES) {
      return NextResponse.json({ error: "That upload is too big to keep." }, { status: 400, headers: NO_STORE });
    }
  }

  // A video this space already has a lesson from is answered with that
  // lesson, before the transcription is paid for. The composer offers to go
  // ahead anyway, which comes back with allowDuplicate.
  if (requested.kind === "link" && payload.allowDuplicate !== true) {
    const existing = await findLessonFromLink(supabase, auth.space.id, requested.url);
    if (existing) {
      return NextResponse.json(lessonExistsError(existing), { status: 409, headers: NO_STORE });
    }
  }

  // Shares the daily lesson allowance, like reading a page does.
  // The community's free monthly AI allowance, unless it is exempt or
  // subscribed. Checked before the daily quota so a refusal here doesn't
  // also use up one of the person's daily lessons.
  const allowance = await checkAiAllowance(auth.space.community_id, auth.userId);
  if (!allowance.allowed) {
    return NextResponse.json({ error: allowance.message }, { status: 402, headers: NO_STORE });
  }

  const quota = await consumeLessonQuota(supabase, auth.userId);
  if (!quota.allowed) {
    return NextResponse.json({ error: quota.message }, { status: 429, headers: NO_STORE });
  }

  const { data: created, error: insertError } = await supabase
    .from("lesson_video_jobs")
    .insert({
      ...insertFor(requested),
      space_id: auth.space.id,
      community_id: auth.space.community_id,
      created_by: auth.userId,
      status: "queued",
    })
    .select("*")
    .single();

  if (insertError || !created) {
    console.error("Could not create video job", insertError);
    return NextResponse.json({ error: "Couldn't start that just now." }, { status: 500, headers: NO_STORE });
  }

  let job = created as LessonVideoJob;
  const started = await startWorkerJob(job.id, workerSource(requested));
  if (!started.ok) {
    const { data } = await supabase
      .from("lesson_video_jobs")
      .update({ status: "error", error: started.error })
      .eq("id", job.id)
      .select("*")
      .single();
    job = (data as LessonVideoJob | null) ?? { ...job, status: "error", error: started.error };
  }

  // Only a direct upload that the worker is now waiting for gets somewhere to
  // send the file.
  const upload = requested.kind === "direct" && started.ok ? directUploadTarget(job.id) : null;

  return NextResponse.json({ job: publicJob(job, false), ...(upload ?? {}) }, { status: 201, headers: NO_STORE });
}

export async function GET(request: NextRequest) {
  const spaceId = request.nextUrl.searchParams.get("spaceId") ?? "";
  if (!spaceId) {
    return NextResponse.json({ error: "Which space?" }, { status: 400, headers: NO_STORE });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "You need to be signed in." }, { status: 401, headers: NO_STORE });
  }

  // RLS limits this to the caller's own jobs; the filters are for the index.
  const { data, error } = await supabase
    .from("lesson_video_jobs")
    .select("*")
    .eq("created_by", user.id)
    .eq("space_id", spaceId)
    .gte("created_at", new Date(Date.now() - RECENT_MS).toISOString())
    .order("created_at", { ascending: false })
    .limit(RECENT_LIMIT);

  if (error) {
    console.error("Could not list video jobs", error);
    return NextResponse.json({ error: "Couldn't load your videos." }, { status: 500, headers: NO_STORE });
  }

  // Clear out the caller's month-old jobs (and any uploads only they used).
  // Awaited, but its failures are its own: the list below doesn't depend on it.
  await pruneOldVideoJobs(supabase, user.id).catch((pruneError) => {
    console.error("Pruning old video jobs failed", pruneError);
  });

  // Bring any unfinished ones up to date, so reopening the composer after a
  // break shows where they actually are.
  const jobs = await Promise.all(
    ((data ?? []) as LessonVideoJob[]).map((job) => syncVideoJob(supabase, job))
  );

  return NextResponse.json({ jobs: jobs.map((job) => publicJob(job, false)) }, { headers: NO_STORE });
}
