import type { Meetup } from "@/types/database";

// Shared vocabulary and time maths for the Meetups space ("Happening Now").
// Kept out of the view so the server page, the card and the composer all agree
// on what "now" means.

// How long a meetup with no stated duration is assumed to run for. A walk
// posted for 18:00 with no end time stays on the "on now" shelf until 20:00,
// then drops to past — long enough to still be joinable, short enough that the
// board doesn't fill with yesterday.
export const MEETUP_DEFAULT_DURATION_MINUTES = 120;

// How far ahead counts as "starting soon" — the shelf a member can still
// realistically get to.
export const MEETUP_SOON_MINUTES = 180;

// Suggestions in the composer, not a closed set: the column is free text
// because "moderate" means nothing across activities (see the meetups
// migration).
export const MEETUP_PACE_PRESETS = ["Easy", "Moderate", "Brisk", "Fast"] as const;

// Durations offered as one-tap buttons, in minutes.
export const MEETUP_DURATION_PRESETS = [30, 60, 90, 120, 180, 240] as const;

export type MeetupPhase = "cancelled" | "now" | "soon" | "later" | "past";

export function meetupEndsAt(meetup: Pick<Meetup, "starts_at" | "duration_minutes">): number {
  const start = new Date(meetup.starts_at).getTime();
  return start + (meetup.duration_minutes ?? MEETUP_DEFAULT_DURATION_MINUTES) * 60_000;
}

// Which shelf a meetup belongs on. `now` is deliberately generous at the front
// edge (a meetup 10 minutes away is already "on now" as far as a member running
// for their shoes is concerned).
export function meetupPhase(meetup: Pick<Meetup, "starts_at" | "duration_minutes" | "status">, now: number = Date.now()): MeetupPhase {
  if (meetup.status === "cancelled") return "cancelled";
  const start = new Date(meetup.starts_at).getTime();
  if (now >= meetupEndsAt(meetup)) return "past";
  if (start - now <= 10 * 60_000) return "now";
  if (start - now <= MEETUP_SOON_MINUTES * 60_000) return "soon";
  return "later";
}

export function isMeetupJoinable(meetup: Pick<Meetup, "starts_at" | "duration_minutes" | "status">, now: number = Date.now()): boolean {
  const phase = meetupPhase(meetup, now);
  return phase === "now" || phase === "soon" || phase === "later";
}

// Free spots left, or null when the host set no limit. Never negative.
export function meetupSpotsLeft(meetup: Pick<Meetup, "capacity">, goingCount: number): number | null {
  if (meetup.capacity === null) return null;
  return Math.max(0, meetup.capacity - goingCount);
}

// "in 25 min" / "starts 18:30" / "started 10 min ago" — the line that decides
// whether someone gets off the sofa.
export function formatMeetupCountdown(meetup: Pick<Meetup, "starts_at">, now: number = Date.now()): string {
  const start = new Date(meetup.starts_at).getTime();
  const diffMinutes = Math.round((start - now) / 60_000);

  if (diffMinutes >= 0 && diffMinutes < 60) return diffMinutes <= 1 ? "starting now" : `in ${diffMinutes} min`;
  if (diffMinutes < 0 && diffMinutes > -60) return `started ${Math.abs(diffMinutes)} min ago`;

  const time = new Date(start).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" });
  const diffHours = diffMinutes / 60;
  if (diffHours >= 1 && diffHours < 24) return `${time} · in ${Math.round(diffHours)}h`;
  return time;
}
