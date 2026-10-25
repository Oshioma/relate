import { parseVideoLink } from "@/lib/school/video-links";

// What a course lesson plays, and when a live lesson's room is open. Pure, so
// the player, the server actions and the tests all agree.

// How a lesson's video is shown: framed (YouTube, Vimeo, Google Drive), played
// by the browser (a direct video file), or — when neither — a plain link.
export type CourseVideoSource =
  | { kind: "embed"; src: string; portrait: boolean }
  | { kind: "file"; src: string }
  | { kind: "link"; href: string };

const VIDEO_FILE = /\.(mp4|m4v|webm|mov|ogv)$/i;

export function courseVideoSource(raw: string | null | undefined): CourseVideoSource | null {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return null;

  const link = parseVideoLink(trimmed);
  if (link?.embedUrl) return { kind: "embed", src: link.embedUrl, portrait: link.portrait };

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  // Google Drive: a shared file plays in Drive's own player at /preview.
  if (url.hostname === "drive.google.com") {
    const id = /\/file\/d\/([^/]+)/.exec(url.pathname)?.[1] ?? url.searchParams.get("id");
    if (id && /^[\w-]+$/.test(id)) {
      return { kind: "embed", src: `https://drive.google.com/file/d/${id}/preview`, portrait: false };
    }
  }

  if (VIDEO_FILE.test(url.pathname)) return { kind: "file", src: url.toString() };

  return { kind: "link", href: link?.url ?? url.toString() };
}

// The room opens a little before the start so people can check their camera,
// and stays open until the planned end — or, with no end set, for three hours.
export const LIVE_OPENS_MINUTES_BEFORE = 15;
export const LIVE_DEFAULT_LENGTH_MINUTES = 180;

export type LiveLessonState = "upcoming" | "open" | "ended";

export function liveLessonState(
  lesson: { live_starts_at: string | null; live_ends_at: string | null },
  nowMs: number
): LiveLessonState {
  if (!lesson.live_starts_at) return "ended";
  const start = new Date(lesson.live_starts_at).getTime();
  if (Number.isNaN(start)) return "ended";
  const endParsed = lesson.live_ends_at ? new Date(lesson.live_ends_at).getTime() : NaN;
  const end = Number.isNaN(endParsed) || endParsed <= start ? start + LIVE_DEFAULT_LENGTH_MINUTES * 60_000 : endParsed;
  if (nowMs < start - LIVE_OPENS_MINUTES_BEFORE * 60_000) return "upcoming";
  if (nowMs <= end) return "open";
  return "ended";
}

// Who may do what in a paid course. Free courses: every enrolled member does
// everything. Paid courses: the team and tier members do everything; buyers
// watch every playback, and join the live lessons only when the course says
// its price includes them.
export type CourseAccess = { canWatch: boolean; canJoinLive: boolean };

export function courseAccess(input: {
  isPaid: boolean;
  isStaff: boolean;
  enrolled: boolean;
  paidEnrolment: boolean;
  hasTier: boolean;
  liveIncludedWithPurchase: boolean;
}): CourseAccess {
  if (input.isStaff) return { canWatch: true, canJoinLive: true };
  if (!input.isPaid) return { canWatch: input.enrolled, canJoinLive: input.enrolled };
  if (input.hasTier) return { canWatch: true, canJoinLive: true };
  if (input.paidEnrolment) return { canWatch: true, canJoinLive: input.liveIncludedWithPurchase };
  return { canWatch: false, canJoinLive: false };
}
