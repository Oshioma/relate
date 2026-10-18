// GET    /api/lessons/video-jobs/:id — how a video job is going, and once it
//        is done, its transcript.
// DELETE /api/lessons/video-jobs/:id — forget it (clears it from the list),
//        and its kept upload with it unless a lesson already plays that.
//
// Each GET of an unfinished job asks the worker and records the answer — see
// src/lib/school/video-job-sync.ts. RLS makes every job private to whoever
// started it, so another person's id simply isn't found.

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { publicJob } from "@/lib/school/video-worker";
import { syncVideoJob } from "@/lib/school/video-job-sync";
import { deleteJobMediaIfUnused } from "@/lib/school/lesson-media-storage";
import type { LessonVideoJob } from "@/types/database";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();

  const { data, error } = await supabase.from("lesson_video_jobs").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("Could not read video job", error);
    return NextResponse.json({ error: "Couldn't check on that video." }, { status: 500, headers: NO_STORE });
  }
  if (!data) {
    return NextResponse.json({ error: "Video job not found." }, { status: 404, headers: NO_STORE });
  }

  const job = await syncVideoJob(supabase, data as LessonVideoJob);
  return NextResponse.json({ job: publicJob(job, job.status === "done") }, { headers: NO_STORE });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();

  // Read first: once the row is gone, so is the only record of which file
  // was this job's, and the upload would sit in Storage for ever.
  const { data: job } = await supabase
    .from("lesson_video_jobs")
    .select("storage_path, created_by")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("lesson_video_jobs").delete().eq("id", id);
  if (error) {
    console.error("Could not delete video job", error);
    return NextResponse.json({ error: "Couldn't remove that." }, { status: 500, headers: NO_STORE });
  }
  if (job) await deleteJobMediaIfUnused(supabase, job);
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}
