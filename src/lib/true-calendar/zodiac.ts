// Personal Moon: the Moon's passage through the tropical zodiac, read against
// a person's Sun sign.
//
// • Tropical signs are 30° slices of the ecliptic measured from the March
//   equinox point (0° = start of Aries). We use the apparent geocentric
//   ecliptic longitude of date from astronomy-engine, the same frame
//   published ephemerides give for sign ingresses.
// • Sun sign: where the Sun really was at birth, not a table of date ranges,
//   so cusp birthdays come out right. With no birth time we check the whole
//   local day and say so if the Sun changed sign during it.
// • Moon ingresses: the instant the Moon's longitude crosses each 30° line,
//   found by sampling every 6 hours (the Moon moves at most about 4° in that
//   time, so never two crossings in one step) and bisecting to one second.
//   Never a fixed 2.5-day stride: real stays run from just under 2 to about 2.6 days.
// • Solar houses: the modern "solar house" frame, which counts the Sun sign
//   as house 1, the next sign as house 2 … the sign before it as house 12.
//
// Pure apart from a per-UTC-month cache of ingresses (the same for everyone).

import * as Astronomy from "astronomy-engine";
import { type CivilDate, addDays, daysFromCivil, isValidTimeZone, startOfDayIn, zoneOffsetMinutes } from "./dates";

export const SIGNS = [
  { key: "aries", name: "Aries", symbol: "♈" },
  { key: "taurus", name: "Taurus", symbol: "♉" },
  { key: "gemini", name: "Gemini", symbol: "♊" },
  { key: "cancer", name: "Cancer", symbol: "♋" },
  { key: "leo", name: "Leo", symbol: "♌" },
  { key: "virgo", name: "Virgo", symbol: "♍" },
  { key: "libra", name: "Libra", symbol: "♎" },
  { key: "scorpio", name: "Scorpio", symbol: "♏" },
  { key: "sagittarius", name: "Sagittarius", symbol: "♐" },
  { key: "capricorn", name: "Capricorn", symbol: "♑" },
  { key: "aquarius", name: "Aquarius", symbol: "♒" },
  { key: "pisces", name: "Pisces", symbol: "♓" },
] as const;
export type SignIndex = number; // 0 = Aries … 11 = Pisces

const mod = (a: number, n: number) => ((a % n) + n) % n;
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export function signName(i: SignIndex): string {
  return SIGNS[mod(i, 12)].name;
}

/** Apparent geocentric ecliptic longitude of date, 0–360. */
export function eclipticLongitude(body: Astronomy.Body, instant: Date | number): number {
  return Astronomy.Ecliptic(Astronomy.GeoVector(body, new Date(instant), true)).elon;
}
export const moonLongitude = (t: Date | number) => eclipticLongitude(Astronomy.Body.Moon, t);
export const sunLongitude = (t: Date | number) => eclipticLongitude(Astronomy.Body.Sun, t);
export const signOfLongitude = (lon: number): SignIndex => Math.floor(mod(lon, 360) / 30) % 12;

// --- Birth and Sun sign -------------------------------------------------------

export interface BirthDetails {
  date: CivilDate;
  /** "HH:MM" local time at the birthplace, if known. */
  time?: string | null;
  /** IANA timezone of the birthplace, if known. */
  timeZone?: string | null;
}

export interface SunSignResult {
  sign: SignIndex;
  /** Sun's longitude used (at the birth instant, or at local noon when no time). */
  longitude: number;
  /** False when the Sun changed sign during a birthday given without a time. */
  certain: boolean;
  /** The other possible sign when not certain. */
  otherSign: SignIndex | null;
  /** When not certain: the instant the Sun changed sign. */
  changeAt: Date | null;
  /** Why it is or isn't certain, in plain words. */
  note: string;
}

export function parseTime(text: string | null | undefined): { hour: number; minute: number } | null {
  const m = /^\s*(\d{1,2}):(\d{2})\s*$/.exec(text ?? "");
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  return hour < 24 && minute < 60 ? { hour, minute } : null;
}

/** The instant a local wall-clock time happens in `tz`. */
export function zonedInstant(date: CivilDate, hour: number, minute: number, tz: string): Date {
  const wall = startOfDayIn(date, "UTC").getTime() + (hour * 60 + minute) * 60_000;
  let guess = wall - zoneOffsetMinutes(new Date(wall), tz) * 60_000;
  guess = wall - zoneOffsetMinutes(new Date(guess), tz) * 60_000;
  return new Date(guess);
}

/** Bisect the instant in [lo, hi] when f changes value, to one second. */
function bisect<T>(lo: number, hi: number, f: (t: number) => T): number {
  const start = f(lo);
  while (hi - lo > 1000) {
    const mid = (lo + hi) / 2;
    if (f(mid) === start) lo = mid;
    else hi = mid;
  }
  return hi;
}

export function sunSign(birth: BirthDetails): SunSignResult {
  const tz = isValidTimeZone(birth.timeZone) ? birth.timeZone : null;
  const time = parseTime(birth.time);
  if (time && tz) {
    const at = zonedInstant(birth.date, time.hour, time.minute, tz);
    const longitude = sunLongitude(at);
    return { sign: signOfLongitude(longitude), longitude, certain: true, otherSign: null, changeAt: null, note: "Worked out from the Sun's position at your birth time." };
  }
  // No usable time: the birthday runs from local midnight to midnight. Without
  // a timezone it could be anywhere from UTC−12 to UTC+14.
  const day0 = startOfDayIn(birth.date, "UTC").getTime();
  const from = tz ? startOfDayIn(birth.date, tz).getTime() : day0 - 14 * HOUR;
  const to = tz ? startOfDayIn(addDays(birth.date, 1), tz).getTime() : day0 + DAY + 12 * HOUR;
  const a = signOfLongitude(sunLongitude(from));
  const b = signOfLongitude(sunLongitude(to));
  const longitude = sunLongitude((from + to) / 2);
  if (a === b) {
    return {
      sign: a,
      longitude,
      certain: true,
      otherSign: null,
      changeAt: null,
      note: time && !tz ? "The Sun was in this sign all day, wherever you were born." : "The Sun was in this sign for the whole of your birthday, so a birth time isn't needed.",
    };
  }
  const changeAt = new Date(bisect(from, to, (t) => signOfLongitude(sunLongitude(t))));
  const sign = signOfLongitude(longitude);
  return {
    sign,
    longitude,
    certain: false,
    otherSign: sign === a ? b : a,
    changeAt,
    note: `The Sun moved from ${signName(a)} into ${signName(b)} during your birthday. Add your birth time${tz ? "" : " and birthplace timezone"} to know which.`,
  };
}

// --- Moon ingresses -----------------------------------------------------------

export interface Ingress {
  /** The sign the Moon enters. */
  sign: SignIndex;
  at: Date;
}

const monthCache = new Map<string, Ingress[]>();
const monthKey = (year: number, month: number) => `${year}-${String(month).padStart(2, "0")}`;
const utcMs = (d: CivilDate) => startOfDayIn(d, "UTC").getTime();

/** Ingresses whose instant falls in a UTC calendar month. Cached. */
export function moonIngressesInMonth(year: number, month: number): Ingress[] {
  const key = monthKey(year, month);
  const hit = monthCache.get(key);
  if (hit) return hit;
  const start = utcMs({ year, month, day: 1 });
  const end = month === 12 ? utcMs({ year: year + 1, month: 1, day: 1 }) : utcMs({ year, month: month + 1, day: 1 });
  const step = 6 * HOUR;
  const out: Ingress[] = [];
  let prevT = start;
  let prevSign = signOfLongitude(moonLongitude(prevT));
  for (let t = Math.min(start + step, end); prevT < end; t = Math.min(t + step, end)) {
    const sign = signOfLongitude(moonLongitude(t));
    if (sign !== prevSign) {
      const at = bisect(prevT, t, (x) => signOfLongitude(moonLongitude(x)));
      if (at >= start && at < end) out.push({ sign, at: new Date(at) });
    }
    prevT = t;
    prevSign = sign;
  }
  monthCache.set(key, out);
  return out;
}

/** Copy of the month cache, for saving in browser storage. */
export function exportIngressCache(): Record<string, [number, number][]> {
  const out: Record<string, [number, number][]> = {};
  for (const [k, v] of monthCache) out[k] = v.map((i) => [i.sign, i.at.getTime()]);
  return out;
}

/** Load months saved earlier. Malformed entries are ignored. */
export function importIngressCache(saved: unknown): void {
  if (!saved || typeof saved !== "object") return;
  for (const [k, v] of Object.entries(saved as Record<string, unknown>)) {
    if (!/^\d{4}-\d{2}$/.test(k) || monthCache.has(k) || !Array.isArray(v)) continue;
    const list: Ingress[] = [];
    for (const e of v) {
      if (Array.isArray(e) && Number.isInteger(e[0]) && e[0] >= 0 && e[0] < 12 && Number.isFinite(e[1])) list.push({ sign: e[0], at: new Date(e[1]) });
      else return;
    }
    monthCache.set(k, list);
  }
}

function monthsBetween(from: Date, to: Date): [number, number][] {
  const out: [number, number][] = [];
  let y = from.getUTCFullYear();
  let m = from.getUTCMonth() + 1;
  const ey = to.getUTCFullYear();
  const em = to.getUTCMonth() + 1;
  while (y < ey || (y === ey && m <= em)) {
    out.push([y, m]);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

/** Every ingress in [from, to). */
export function moonIngresses(from: Date, to: Date): Ingress[] {
  return monthsBetween(from, to)
    .flatMap(([y, m]) => moonIngressesInMonth(y, m))
    .filter((i) => i.at >= from && i.at < to);
}

export interface MoonSignStay {
  sign: SignIndex;
  start: Date;
  end: Date;
}

/** The Moon's stays in each sign overlapping [from, to), each exactly once. */
export function moonSignStays(from: Date, to: Date): MoonSignStay[] {
  // Reach back and forward far enough to catch the ingresses either side.
  const list = moonIngresses(new Date(from.getTime() - 4 * DAY), new Date(to.getTime() + 4 * DAY));
  const out: MoonSignStay[] = [];
  for (let i = 0; i + 1 < list.length; i += 1) {
    const s = { sign: list[i].sign, start: list[i].at, end: list[i + 1].at };
    if (s.end > from && s.start < to) out.push(s);
  }
  return out;
}

/** The Moon's sign at an instant. */
export function moonSignAt(instant: Date): SignIndex {
  return signOfLongitude(moonLongitude(instant));
}

// --- Solar houses and personal periods ----------------------------------------

/** House 1–12 of `sign`, counting the Sun sign as house 1. */
export function solarHouse(sign: SignIndex, sunSignIndex: SignIndex): number {
  return mod(sign - sunSignIndex, 12) + 1;
}

export type PersonalKind = "preceding" | "sun" | "following" | "other";

export function personalKind(house: number): PersonalKind {
  return house === 12 ? "preceding" : house === 1 ? "sun" : house === 2 ? "following" : "other";
}

export interface PersonalMoonEvent extends MoonSignStay {
  /** Stable id: sign + start instant, so the same stay never appears twice. */
  id: string;
  house: number;
  kind: PersonalKind;
  durationMs: number;
}

export function personalEvents(sunSignIndex: SignIndex, from: Date, to: Date): PersonalMoonEvent[] {
  return moonSignStays(from, to).map((s) => {
    const house = solarHouse(s.sign, sunSignIndex);
    return { ...s, id: `${s.sign}@${s.start.getTime()}`, house, kind: personalKind(house), durationMs: s.end.getTime() - s.start.getTime() };
  });
}

/** The next start of a highlighted (preceding, Sun or following) stay after `now`. */
export function nextHighlighted(sunSignIndex: SignIndex, now: Date, kinds: PersonalKind[] = ["preceding", "sun", "following"]): PersonalMoonEvent | null {
  for (let i = 0; i < 3; i += 1) {
    const from = new Date(now.getTime() + i * 30 * DAY);
    const hit = personalEvents(sunSignIndex, from, new Date(from.getTime() + 30 * DAY)).find((e) => e.start > now && kinds.includes(e.kind));
    if (hit) return hit;
  }
  return null;
}

/** "2 days 4 hours", "3 hours 12 minutes", "40 minutes". */
export function formatDuration(ms: number): string {
  const totalMin = Math.max(0, Math.round(ms / 60_000));
  const d = Math.floor(totalMin / 1440);
  const h = Math.floor((totalMin % 1440) / 60);
  const m = totalMin % 60;
  const part = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;
  if (d > 0) return h > 0 ? `${part(d, "day")} ${part(h, "hour")}` : part(d, "day");
  if (h > 0) return m > 0 ? `${part(h, "hour")} ${part(m, "minute")}` : part(h, "hour");
  return part(m, "minute");
}

/** Whole local dates in `tz` that a stay touches. */
export function stayDates(stay: MoonSignStay, tz: string, civilAt: (d: Date, tz: string) => CivilDate): CivilDate[] {
  const first = civilAt(stay.start, tz);
  const last = civilAt(new Date(stay.end.getTime() - 1), tz);
  const out: CivilDate[] = [];
  for (let d = first; daysFromCivil(d) <= daysFromCivil(last); d = addDays(d, 1)) out.push(d);
  return out;
}
