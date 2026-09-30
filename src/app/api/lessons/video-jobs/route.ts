// POST /api/lessons/video-jobs — start transcribing a video for the composer.
// GET  /api/lessons/video-jobs?spaceId=… — your recent video jobs in a space.
//
// Transcribing is its own step, like reading a page: the transcript lands in
// the composer to be read and trimmed, and only then becomes a lesson. An hour
// of video takes minutes, so this answers at once with a job and the composer
// polls /api/lessons/video-jobs/:id for progress.
//
// Staff-only and metered, for the same reason the writer is: it spends money.

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeLessonAuthor } from "@/lib/school/lesson-auth";
import { consumeLessonQuota } from "@/lib/school/lesson-quota";
import { parseVideoLink } from "@/lib/school/video-links";
import { isVideoWorkerConfigured, publicJob, startWorkerJob } from "@/lib/school/video-worker";
import { syncVideoJob } from "@/lib/school/video-job-sync";
import type { LessonVideoJob } from "@/types/database";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "no-store" };

// How far back "recent" reaches in the composer.
const RECENT_MS = 3 * 24 * 60 * 60_000;
const RECENT_LIMIT = 5;

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

  const payload = body as { spaceId?: unknown; url?: unknown };
  const spaceId = typeof payload.spaceId === "string" ? payload.spaceId : "";
  const rawUrl = typeof payload.url === "string" ? payload.url : "";

  if (!spaceId) {
    return NextResponse.json({ error: "Which space?" }, { status: 400, headers: NO_STORE });
  }

  const link = parseVideoLink(rawUrl);
  if (!link) {
    return NextResponse.json(
      { error: "That isn't a YouTube, Facebook or Instagram video link." },
      { status: 400, headers: NO_STORE }
    );
  }

  const auth = await authorizeLessonAuthor(supabase, spaceId);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status, headers: NO_STORE });
  }

  // Shares the daily lesson allowance, like reading a page does.
  const quota = await consumeLessonQuota(supabase, auth.userId);
  if (!quota.allowed) {
    return NextResponse.json({ error: quota.message }, { status: 429, headers: NO_STORE });
  }

  const { data: created, error: insertError } = await supabase
    .from("lesson_video_jobs")
    .insert({
      space_id: auth.space.id,
      community_id: auth.space.community_id,
      created_by: auth.userId,
      source_url: link.url,
      status: "queued",
      message: "Waiting for the video service…",
    })
    .select("*")
    .single();

  if (insertError || !created) {
    console.error("Could not create video job", insertError);
    return NextResponse.json({ error: "Couldn't start that just now." }, { status: 500, headers: NO_STORE });
  }

  let job = created as LessonVideoJob;
  const started = await startWorkerJob(job.id, link.url);
  if (!started.ok) {
    const { data } = await supabase
      .from("lesson_video_jobs")
      .update({ status: "error", error: started.error })
      .eq("id", job.id)
      .select("*")
      .single();
    job = (data as LessonVideoJob | null) ?? { ...job, status: "error", error: started.error };
  }

  return NextResponse.json({ job: publicJob(job, false) }, { status: 201, headers: NO_STORE });
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

  // Bring any unfinished ones up to date, so reopening the composer after a
  // break shows where they actually are.
  const jobs = await Promise.all(
    ((data ?? []) as LessonVideoJob[]).map((job) => syncVideoJob(supabase, job))
  );

  return NextResponse.json({ jobs: jobs.map((job) => publicJob(job, false)) }, { headers: NO_STORE });
}
