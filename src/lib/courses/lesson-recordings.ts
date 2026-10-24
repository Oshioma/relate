import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { JaasRecordingEvent } from "@/lib/courses/jaas-webhook";

// Live-lesson recordings: noting which lesson a room belongs to, copying what
// JaaS records into our own storage (JaaS keeps it 24 hours), and handing the
// people who can open a lesson a short-lived link to watch it.

export const RECORDINGS_BUCKET = "course-recordings";
// How long a playback link works once the course page hands it out.
const SIGNED_URL_SECONDS = 6 * 60 * 60;

type Admin = ReturnType<typeof createAdminClient>;

// Called when someone is let into a live lesson's room, so a recording of
// that room can later be matched back to the lesson. Best-effort: a failure
// here must never keep anyone out of the lesson.
export async function rememberLessonRoom(roomName: string, lessonId: string): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("course_live_rooms").upsert({ room_name: roomName, lesson_id: lessonId }, { onConflict: "room_name" });
  } catch (err) {
    console.error("[lesson-recordings] couldn't note the room:", (err as Error).message);
  }
}

export type SaveRecordingOutcome = "saved" | "failed" | "duplicate" | "unknown_room" | "not_on_plan";

// Copies one JaaS recording into the private bucket and records the result.
// Streams the file straight through (an hour of video is hundreds of MB), so
// it never sits in memory.
export async function saveLessonRecording(event: JaasRecordingEvent): Promise<SaveRecordingOutcome> {
  const admin = createAdminClient();

  const { data: room } = await admin.from("course_live_rooms").select("lesson_id").eq("room_name", event.roomName).maybeSingle();
  if (!room) return "unknown_room";

  const { data: lesson } = await admin
    .from("course_lessons")
    .select("id, course_id, community_id")
    .eq("id", room.lesson_id)
    .maybeSingle();
  if (!lesson) return "unknown_room";

  const { data: allowed } = await admin.rpc("community_has_feature", {
    p_community_id: lesson.community_id,
    p_feature: "session_recording",
  });
  if (allowed !== true) return "not_on_plan";

  const { data: row, error: insertError } = await admin
    .from("course_lesson_recordings")
    .insert({
      lesson_id: lesson.id,
      course_id: lesson.course_id,
      community_id: lesson.community_id,
      idempotency_key: event.idempotencyKey,
      jaas_session_id: event.sessionId,
      status: "copying",
      source_url: event.downloadUrl,
      duration_seconds: event.durationSeconds,
      recorded_at: event.recordedAt,
    })
    .select("id")
    .single();
  // A unique-key clash is JaaS delivering the same event again.
  if (insertError || !row) return insertError?.code === "23505" ? "duplicate" : "failed";

  const path = `${lesson.community_id}/${lesson.course_id}/${lesson.id}/${row.id}.mp4`;
  try {
    await streamToStorage(event.downloadUrl, path);
    await admin
      .from("course_lesson_recordings")
      .update({ status: "saved", storage_path: path, source_url: null, error: null })
      .eq("id", row.id);
    return "saved";
  } catch (err) {
    await admin
      .from("course_lesson_recordings")
      .update({ status: "failed", error: (err as Error).message.slice(0, 500) })
      .eq("id", row.id);
    return "failed";
  }
}

// Fetch from JaaS and PUT into Supabase Storage as one stream.
async function streamToStorage(sourceUrl: string, path: string): Promise<void> {
  const source = await fetch(sourceUrl);
  if (!source.ok || !source.body) throw new Error(`Couldn't download the recording from 8x8 (${source.status}).`);

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error("Storage isn't configured on the server.");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${key}`,
    apikey: key,
    "Content-Type": "video/mp4",
    "x-upsert": "true",
  };
  const length = source.headers.get("content-length");
  if (length) headers["Content-Length"] = length;

  const upload = await fetch(`${base}/storage/v1/object/${RECORDINGS_BUCKET}/${path}`, {
    method: "POST",
    headers,
    body: source.body,
    // Node's fetch needs this to send a streamed body.
    duplex: "half",
  } as RequestInit & { duplex: "half" });
  if (!upload.ok) {
    const detail = await upload.text().catch(() => "");
    throw new Error(`Couldn't save the recording to storage (${upload.status}) ${detail}`.trim());
  }
}

// Playback links for the lessons the viewer may open (the caller passes only
// lesson ids that RLS gave them in full). Newest saved recording per lesson.
export async function getLessonPlaybackUrls(lessonIds: string[]): Promise<Record<string, string>> {
  if (lessonIds.length === 0) return {};
  let admin: Admin;
  try {
    admin = createAdminClient();
  } catch {
    return {};
  }

  const { data, error } = await admin
    .from("course_lesson_recordings")
    .select("lesson_id, storage_path, created_at")
    .in("lesson_id", lessonIds)
    .eq("status", "saved")
    .order("created_at", { ascending: false });
  if (error || !data) return {};

  const newest = new Map<string, string>();
  for (const row of data) {
    if (row.storage_path && !newest.has(row.lesson_id)) newest.set(row.lesson_id, row.storage_path);
  }
  if (newest.size === 0) return {};

  const paths = [...newest.values()];
  const { data: signed } = await admin.storage.from(RECORDINGS_BUCKET).createSignedUrls(paths, SIGNED_URL_SECONDS);
  const urlByPath = new Map((signed ?? []).filter((s) => s.signedUrl && s.path).map((s) => [s.path as string, s.signedUrl]));

  const out: Record<string, string> = {};
  for (const [lessonId, path] of newest) {
    const url = urlByPath.get(path);
    if (url) out[lessonId] = url;
  }
  return out;
}
