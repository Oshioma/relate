// Bringing a lesson_video_jobs row up to date with the worker.
//
// Called by the status route on every poll, which is what makes "close the
// composer and come back later" work: whoever next looks at an unfinished job
// is the one who asks the worker about it. Nothing runs in the background on
// our side, so nothing can be left running when nobody is watching.

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LessonVideoJob } from "@/types/database";
import { MAX_SOURCE_CHARS } from "@/lib/school/lesson-types";
import { isFinished, pollWorkerJob } from "@/lib/school/video-worker";

// Longer than the worker should ever need for the longest video it accepts.
// Past this, a job that still isn't finished is not going to be.
const GIVE_UP_AFTER_MS = 45 * 60_000;
// A job the worker hasn't heard of yet may simply not have reached it.
const LOST_GRACE_MS = 30_000;

export async function syncVideoJob(
  supabase: SupabaseClient<Database>,
  job: LessonVideoJob
): Promise<LessonVideoJob> {
  if (isFinished(job)) return job;

  const age = Date.now() - new Date(job.created_at).getTime();
  let update: Partial<LessonVideoJob> | null = null;

  const polled = await pollWorkerJob(job.id);
  if (polled.ok) {
    const r = polled.report;
    // A transcript longer than a lesson can hold is trimmed here, once, so
    // everything downstream can trust the stored text fits.
    const transcript = r.transcript ? r.transcript.slice(0, MAX_SOURCE_CHARS) : null;
    const trimmed = Boolean(r.transcript && transcript && transcript.length < r.transcript.length);
    update = {
      status: r.status,
      progress: r.status === "done" ? 1 : r.progress,
      message: trimmed ? "Very long — the end of the transcript was trimmed to fit a lesson." : r.message,
      title: r.title ?? job.title,
      duration_seconds: r.durationSeconds ?? job.duration_seconds,
      method: r.method ?? job.method,
      transcript: r.status === "done" ? transcript : job.transcript,
      error: r.status === "error" ? (r.error ?? "The video couldn't be transcribed.") : null,
    };
    if (update.status === "done" && !update.transcript) {
      update.status = "error";
      update.error = "No speech was found in that video.";
    }
  } else if (polled.lost && age > LOST_GRACE_MS) {
    update = {
      status: "error",
      error: "The video service restarted and lost this one. Start it again.",
    };
  }

  if (!update && age > GIVE_UP_AFTER_MS) {
    update = { status: "error", error: "This took far too long, so it was stopped. Try again." };
  }
  if (!update) return job;

  // Nothing changed — skip the write, which would only bump updated_at.
  const changed = (Object.keys(update) as (keyof LessonVideoJob)[]).some((k) => update![k] !== job[k]);
  if (!changed) return job;

  const { data, error } = await supabase
    .from("lesson_video_jobs")
    .update(update)
    .eq("id", job.id)
    .select("*")
    .single();

  if (error || !data) {
    console.error("Could not update video job", error);
    return { ...job, ...update };
  }
  return data as LessonVideoJob;
}
