// Uploaded video and audio files that a lesson is written from.
//
// A teacher's own recording goes one of two ways, decided by its size and type
// (see 20261001092236_lesson_media_uploads.sql):
//
//   kept    ≤ the 'uploads' bucket's 200 MB limit and a type the bucket takes.
//           Stored at <user-id>/lesson-media/<uuid>.<ext>, transcribed by the
//           worker from its public URL, and played at the top of the lesson.
//   direct  anything else. Sent straight to the worker and thrown away after
//           transcribing, so the lesson has nothing to play.
//
// Shared by the composer (which picks the way), the API routes (which check
// the path really is the caller's own upload) and the lesson page (which turns
// the path back into a playable address). Pure, so it runs anywhere.

import type { LessonMediaType } from "@/types/database";

export const LESSON_MEDIA_BUCKET = "uploads";

// The bucket's own limit (20260730122535_uploads_audio_and_larger_media.sql).
// Storage refuses anything bigger, so bigger goes direct.
export const MAX_KEPT_MEDIA_BYTES = 200 * 1024 * 1024;

// The worker's default MAX_UPLOAD_MB. Checked in the browser too, so a 10 GB
// file is refused before anyone waits for it to upload.
export const MAX_DIRECT_MEDIA_BYTES = 4000 * 1024 * 1024;

// What the file picker offers. Anything ffmpeg can read would transcribe, but
// these are what a teacher actually has.
export const MEDIA_FILE_ACCEPT = "video/*,audio/*";

// Bucket-allowed content type -> the extension it is stored under. The
// extension alone says which player the lesson needs, so audio WebM is
// stored as .weba to keep it apart from video WebM.
const EXTENSIONS: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/aac": "aac",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/flac": "flac",
  "audio/x-flac": "flac",
  "audio/webm": "weba",
};

// What browsers actually report for some common files, mapped to the name the
// bucket's allow-list uses. A Mac's .m4a is "audio/x-m4a" in Chrome, for one.
const ALIASES: Record<string, string> = {
  "audio/x-m4a": "audio/mp4",
  "audio/m4a": "audio/mp4",
  "audio/mp3": "audio/mpeg",
  "audio/wave": "audio/wav",
  "audio/vnd.wave": "audio/wav",
};

const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov"]);
const AUDIO_EXTENSIONS = new Set(["mp3", "m4a", "aac", "wav", "ogg", "flac", "weba"]);

const UUID = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const PATH_PATTERN = new RegExp(
  `^(${UUID})/lesson-media/${UUID}\\.(${[...VIDEO_EXTENSIONS, ...AUDIO_EXTENSIONS].join("|")})$`
);

export function isMediaContentType(type: string): boolean {
  return /^(video|audio)\//i.test(type);
}

// The content type to store a file under, or null if the bucket won't take it
// (in which case the file goes direct and isn't kept).
export function keptContentType(type: string): string | null {
  const lower = type.trim().toLowerCase();
  const normal = ALIASES[lower] ?? lower;
  return EXTENSIONS[normal] ? normal : null;
}

export function canKeepMedia(file: { size: number; type: string }): boolean {
  return file.size > 0 && file.size <= MAX_KEPT_MEDIA_BYTES && keptContentType(file.type) !== null;
}

// Where a kept upload lives. The first folder is the uploader's id, because
// that is what the bucket's RLS checks before letting anyone write there.
export function lessonMediaPath(userId: string, id: string, contentType: string): string | null {
  const type = keptContentType(contentType);
  if (!type) return null;
  return `${userId}/lesson-media/${id}.${EXTENSIONS[type]}`;
}

// True only for a lesson-media path inside this user's own folder. Everything
// the browser reports as "my upload" goes through here: without it, one
// teacher could point a lesson (or the prune) at somebody else's file.
export function isOwnLessonMediaPath(path: string, userId: string): boolean {
  const match = PATH_PATTERN.exec(path);
  return Boolean(match && match[1] === userId.toLowerCase());
}

export function isLessonMediaPath(path: string): boolean {
  return PATH_PATTERN.test(path);
}

export function mediaTypeOfPath(path: string): LessonMediaType | null {
  const match = PATH_PATTERN.exec(path);
  if (!match) return null;
  return VIDEO_EXTENSIONS.has(match[2]) ? "video" : "audio";
}

// The address a kept file is served from. Built rather than stored, so a
// project moving to another Supabase URL doesn't strand every lesson.
export function lessonMediaPublicUrl(supabaseUrl: string, path: string): string {
  const base = supabaseUrl.replace(/\/+$/, "");
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/${LESSON_MEDIA_BUCKET}/${encoded}`;
}

// "Lecture 3 – final.mp4" -> "Lecture 3 – final": a fair title until the
// worker reports one.
export function titleFromFileName(name: string): string {
  const stem = name.replace(/\.[A-Za-z0-9]{1,8}$/, "").trim();
  return (stem || name).slice(0, 200);
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  return `${Math.max(1, Math.round(bytes / 1024 / 1024))} MB`;
}
