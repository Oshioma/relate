// The server's side of kept lesson uploads: checking one is really there, and
// deleting it once nothing needs it any more.
//
// Kept uploads live in the public 'uploads' bucket. The browser writes them
// (the bucket's RLS limits that to the uploader's own folder); the app only
// ever reads them, and deletes them when the job that made them is pruned.

import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LessonVideoJob } from "@/types/database";
import { createAdminClient } from "@/lib/supabase/admin";
import { LESSON_MEDIA_BUCKET, isOwnLessonMediaPath } from "@/lib/school/lesson-media";

export type OwnUpload =
  | { ok: true; size: number | null; contentType: string | null }
  | { ok: false; error: string };

// The browser says "I uploaded it to here". Believed only if the path is in
// the caller's own lesson-media folder and Storage has an object there.
export async function findOwnUpload(
  supabase: SupabaseClient<Database>,
  userId: string,
  path: string
): Promise<OwnUpload> {
  if (!isOwnLessonMediaPath(path, userId)) {
    return { ok: false, error: "That upload isn't yours." };
  }
  const { data, error } = await supabase.storage.from(LESSON_MEDIA_BUCKET).info(path);
  if (error || !data) {
    return { ok: false, error: "The upload didn't arrive. Try it again." };
  }
  return {
    ok: true,
    size: typeof data.size === "number" ? data.size : null,
    contentType: typeof data.contentType === "string" ? data.contentType : null,
  };
}

// Whether any lesson still plays this file. Asked with the service role,
// because a lesson the caller can't see (hidden by its author, say) still
// counts — deleting a file out from under it would break it for everyone.
// Without the service role there is no way to be sure, so the answer is
// "yes, keep it".
async function isMediaInUse(path: string): Promise<boolean> {
  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return true;
  }
  const { count, error } = await admin
    .from("space_lessons")
    .select("id", { count: "exact", head: true })
    .eq("media_path", path);
  if (error) {
    console.error("Could not check whether a lesson uses an upload", error);
    return true;
  }
  return (count ?? 0) > 0;
}

// Deletes a job's kept upload unless a lesson plays it. Best effort: a file
// left behind costs a little storage, which is better than failing the
// caller's request over it.
export async function deleteJobMediaIfUnused(
  supabase: SupabaseClient<Database>,
  job: Pick<LessonVideoJob, "storage_path" | "created_by">
): Promise<void> {
  const path = job.storage_path;
  if (!path || !isOwnLessonMediaPath(path, job.created_by)) return;
  if (await isMediaInUse(path)) return;
  const { error } = await supabase.storage.from(LESSON_MEDIA_BUCKET).remove([path]);
  if (error) console.error("Could not delete an unused lesson upload", error);
}

// Old jobs are only clutter: the composer lists the last few days, and a
// transcript that became a lesson lives on as its source_text. Their kept
// uploads are the part that costs money, so they go too, unless a lesson
// plays them.
const PRUNE_AFTER_MS = 30 * 24 * 60 * 60_000;
// A handful per visit keeps the composer quick; the rest go next time.
const PRUNE_BATCH = 20;

export async function pruneOldVideoJobs(supabase: SupabaseClient<Database>, userId: string): Promise<void> {
  const { data, error } = await supabase
    .from("lesson_video_jobs")
    .select("id, storage_path, created_by")
    .eq("created_by", userId)
    .lt("created_at", new Date(Date.now() - PRUNE_AFTER_MS).toISOString())
    .limit(PRUNE_BATCH);
  if (error || !data?.length) return;

  for (const job of data) {
    await deleteJobMediaIfUnused(supabase, job);
  }
  const { error: deleteError } = await supabase
    .from("lesson_video_jobs")
    .delete()
    .in(
      "id",
      data.map((job) => job.id)
    );
  if (deleteError) console.error("Could not prune old video jobs", deleteError);
}
