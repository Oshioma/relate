// The True Calendar's state lives in the address bar, so any view can be
// shared or bookmarked: ?date=2026-11-01&view=lunar&tz=Africa/Dar_es_Salaam.
//
// A missing or broken date means "today" (worked out in the browser, in the
// viewer's timezone), never a fixed fallback date.

import { type CivilDate, MAX_YEAR, MIN_YEAR, formatIsoDate, isValidTimeZone, parseIsoDate } from "./dates";

export type RightCalendar = "fixed" | "lunar";

export interface CalendarUrlState {
  date: CivilDate | null;
  view: RightCalendar;
  tz: string | null;
}

export function readCalendarUrl(search: string): CalendarUrlState {
  const params = new URLSearchParams(search);
  const parsed = parseIsoDate(params.get("date"));
  const date = parsed && parsed.year >= MIN_YEAR && parsed.year <= MAX_YEAR ? parsed : null;
  const view: RightCalendar = params.get("view") === "lunar" ? "lunar" : "fixed";
  const tzParam = params.get("tz");
  const tz = isValidTimeZone(tzParam) ? tzParam : null;
  return { date, view, tz };
}

/** Writes the calendar's keys into an existing query string, keeping anything
 * else that was there. A null date or tz removes the key. */
export function writeCalendarUrl(search: string, state: Partial<CalendarUrlState>): string {
  const params = new URLSearchParams(search);
  if ("date" in state) {
    if (state.date) params.set("date", formatIsoDate(state.date));
    else params.delete("date");
  }
  if ("view" in state) {
    if (state.view === "lunar") params.set("view", "lunar");
    else params.delete("view");
  }
  if ("tz" in state) {
    if (state.tz) params.set("tz", state.tz);
    else params.delete("tz");
  }
  const text = params.toString();
  return text ? `?${text}` : "";
}

/** "44 BCE", "44 BC", "-43", "2026", "1066 CE" → astronomical year number. */
export function parseYearInput(text: string): number | null {
  const t = text.trim().replace(/,/g, "");
  let m = /^(\d{1,5})\s*(BCE|BC|B\.C\.E?\.?)$/i.exec(t);
  if (m) {
    const n = Number(m[1]);
    return n >= 1 ? 1 - n : null;
  }
  m = /^(-?\d{1,5})\s*(CE|AD|A\.D\.)?$/i.exec(t);
  if (m) return Number(m[1]);
  return null;
}
