// Day rules that are not a plain count of days or Moon nights:
//
//  - the Hindu tithi: the lunar day in force at sunrise, one tithi for each
//    12° the Moon gains on the Sun (so a tithi can be skipped or repeated
//    against the civil days);
//  - the Chinese "twelve day officers" (建除十二神, jianchu): the officer of a
//    day follows from the day's earthly branch and the solar-term month it falls
//    in, so the officer repeats on the day a new solar-term month begins.
//
// Pure functions over astronomy-engine; results are cached per date.

import * as Astronomy from "astronomy-engine";
import { type CivilDate, addDays, civilDateAt, daysFromCivil, formatIsoDate, startOfDayIn } from "../dates";

// --- Hindu tithi ---------------------------------------------------------------

/** Ujjain, the traditional meridian of Indian astronomy. */
export type Place = { lat: number; lon: number; height: number; tz: string };
export const UJJAIN: Place = { lat: 23.18, lon: 75.78, height: 490, tz: "Asia/Kolkata" };

const tithiCache = new Map<string, number>();

/**
 * The tithi (1–30) at local sunrise on `date`: 1–15 the bright fortnight
 * (Śukla, ending at Pūrṇimā = 15), 16–30 the dark fortnight (Kṛṣṇa, ending at
 * Amāvasyā = 30).
 */
export function tithiOn(date: CivilDate, place: Place = UJJAIN): number {
  const k = `${place.lat},${place.lon}|${formatIsoDate(date)}`;
  const hit = tithiCache.get(k);
  if (hit !== undefined) return hit;
  const midnight = startOfDayIn(date, place.tz);
  const observer = new Astronomy.Observer(place.lat, place.lon, place.height);
  const rise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, Astronomy.MakeTime(midnight), 1);
  // Near the equator the Sun always rises; fall back to 6 am local just in case.
  const at = rise ? rise.date : new Date(midnight.getTime() + 6 * 3_600_000);
  const elongation = Astronomy.MoonPhase(Astronomy.MakeTime(at));
  const t = Math.min(30, Math.floor(elongation / 12) + 1);
  tithiCache.set(k, t);
  return t;
}

/** Every date in [from, to] whose sunrise tithi is `n`. */
export function tithiDates(n: number, from: CivilDate, to: CivilDate, place: Place = UJJAIN): CivilDate[] {
  const out: CivilDate[] = [];
  for (let d = from; daysFromCivil(d) <= daysFromCivil(to); d = addDays(d, 1)) if (tithiOn(d, place) === n) out.push(d);
  return out;
}

// --- Hindu months (amānta, named by the Sun's sidereal sign) ------------------
//
// An amānta month runs from one new Moon (Amāvasyā) to the next. It takes the
// name of the sidereal sign the Sun enters during it (its saṅkrānti): the month
// in which the Sun enters Meṣa is Caitra, Vṛṣabha Vaiśākha, and so on. A month
// in which the Sun enters no sign is an extra (adhika) month, named after the
// month that follows it; festivals are not held in it. The sidereal sign uses
// the Lahiri ayanāṃśa, as Indian almanacs do.

export const HINDU_MONTHS = ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashvin", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"] as const;

export interface HinduMonth {
  /** 0 = Chaitra … 11 = Phalguna. */
  index: number;
  adhika: boolean;
  /** First and last dates (local to `place`) whose sunrise falls in the month. */
  start: CivilDate;
  end: CivilDate;
}

function siderealSunSign(t: Date): number {
  const tropical = Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Sun, t, true)).elon;
  const years = (t.getTime() - Date.UTC(2000, 0, 1, 12)) / (365.25 * 86_400_000);
  const ayanamsa = 23.853 + (50.29 / 3600) * years;
  return Math.floor((((tropical - ayanamsa) % 360) + 360) % 360 / 30);
}

/** The first local date whose sunrise is at or after `instant`. */
function firstSunriseDateAfter(instant: Date, place: Place): CivilDate {
  const local = civilDateAt(instant, place.tz);
  const observer = new Astronomy.Observer(place.lat, place.lon, place.height);
  const rise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, Astronomy.MakeTime(startOfDayIn(local, place.tz)), 1);
  const at = rise ? rise.date.getTime() : startOfDayIn(local, place.tz).getTime() + 6 * 3_600_000;
  return at >= instant.getTime() ? local : addDays(local, 1);
}

const hinduMonthCache = new Map<string, HinduMonth[]>();

/** Every amānta month overlapping [from, to]. */
export function hinduMonths(from: CivilDate, to: CivilDate, place: Place = UJJAIN): HinduMonth[] {
  const key = `${place.lat},${place.lon}|${formatIsoDate(from)}|${formatIsoDate(to)}`;
  const hit = hinduMonthCache.get(key);
  if (hit) return hit;
  const conj: Date[] = [];
  let t = Astronomy.SearchMoonPhase(0, Astronomy.MakeTime(startOfDayIn(addDays(from, -35), place.tz)), 40);
  const stop = startOfDayIn(addDays(to, 35), place.tz).getTime();
  while (t && t.date.getTime() < stop) {
    conj.push(t.date);
    t = Astronomy.SearchMoonPhase(0, t.AddDays(1), 40);
  }
  const out: HinduMonth[] = [];
  for (let i = 0; i < conj.length - 1; i++) {
    const a = siderealSunSign(conj[i]);
    const b = siderealSunSign(conj[i + 1]);
    const entered = (b - a + 12) % 12;
    // Entered sign b during the month (one saṅkrānti): named for b. None: adhika, named for the next month.
    const index = entered === 0 ? (b + 1) % 12 : b;
    const start = firstSunriseDateAfter(conj[i], place);
    const end = addDays(firstSunriseDateAfter(conj[i + 1], place), -1);
    if (daysFromCivil(end) < daysFromCivil(from) || daysFromCivil(start) > daysFromCivil(to)) continue;
    out.push({ index, adhika: entered === 0, start, end });
  }
  hinduMonthCache.set(key, out);
  return out;
}

/** When in the day a festival's tithi is checked (almanacs differ by festival). */
export type TithiTime = "sunrise" | "midday" | "afternoon" | "evening" | "midnight";
const TITHI_HOURS: Record<Exclude<TithiTime, "sunrise">, number> = { midday: 11.5, afternoon: 15, evening: 18.5, midnight: 24 };

/** The tithi in force on `date` at a local clock hour (24 = the midnight ending the day). */
export function tithiAtHour(date: CivilDate, hour: number, place: Place = UJJAIN): number {
  const at = new Date(startOfDayIn(date, place.tz).getTime() + hour * 3_600_000);
  return Math.min(30, Math.floor(Astronomy.MoonPhase(Astronomy.MakeTime(at)) / 12) + 1);
}

/**
 * The date of a yearly festival held on tithi `n` of the Hindu month `index`
 * (amānta), checked at `time`: the first day of that month (or the day
 * before it, for a festival on the month's first tithi) on which tithi `n` is
 * in force at that time. Never in an adhika month.
 */
export function hinduFestivalDates(index: number, n: number, time: TithiTime, from: CivilDate, to: CivilDate, place: Place = UJJAIN): CivilDate[] {
  const at = (d: CivilDate) => (time === "sunrise" ? tithiOn(d, place) : tithiAtHour(d, TITHI_HOURS[time], place));
  const out: CivilDate[] = [];
  for (const m of hinduMonths(addDays(from, -40), addDays(to, 40), place)) {
    if (m.index !== index || m.adhika) continue;
    let hit: CivilDate | null = null;
    const first = n === 1 ? addDays(m.start, -1) : m.start;
    for (let d = first; daysFromCivil(d) <= daysFromCivil(m.end) && !hit; d = addDays(d, 1)) if (at(d) === n) hit = d;
    // A tithi that is never in force at that time of day (it began and ended in between): the day it ran.
    if (!hit) for (let d = first; daysFromCivil(d) <= daysFromCivil(m.end) && !hit; d = addDays(d, 1)) if (at(d) === (n === 1 ? 30 : n - 1) && at(addDays(d, 1)) === (n === 30 ? 1 : n + 1)) hit = d;
    if (hit && daysFromCivil(hit) >= daysFromCivil(from) && daysFromCivil(hit) <= daysFromCivil(to)) out.push(hit);
  }
  return out;
}

// --- Chinese sexagenary days and the twelve day officers ----------------------

/** 1 October 1949 was a jiazi (甲子) day, the first of the sixty-day cycle. */
export const JIAZI_ANCHOR: CivilDate = { year: 1949, month: 10, day: 1 };
const mod = (a: number, n: number) => ((a % n) + n) % n;

/** 0–59 in the sixty-day cycle (0 = 甲子 jiazi). */
export function sexagenaryDay(date: CivilDate): number {
  return mod(daysFromCivil(date) - daysFromCivil(JIAZI_ANCHOR), 60);
}

export const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

/** The day's stem-branch name, e.g. "甲子". */
export function sexagenaryName(date: CivilDate): string {
  const i = sexagenaryDay(date);
  return `${STEMS[i % 10]}${BRANCHES[i % 12]}`;
}

const SHANGHAI = "Asia/Shanghai";
const branchCache = new Map<string, number>();

/**
 * The branch (0 = 子) of the solar-term month a date falls in, in China time.
 * The 子 month opens at Daxue (Sun at 255°), 丑 at Xiaohan (285°), 寅 at Lichun
 * (315°), and so on every 30°. A day on which a new month opens belongs to the
 * new month (the Sun's place at the end of the day decides).
 */
export function solarMonthBranch(date: CivilDate): number {
  const k = formatIsoDate(date);
  const hit = branchCache.get(k);
  if (hit !== undefined) return hit;
  const end = new Date(startOfDayIn(addDays(date, 1), SHANGHAI).getTime() - 1);
  const lon = Astronomy.SunPosition(Astronomy.MakeTime(end)).elon;
  const b = mod(Math.floor(mod(lon - 255, 360) / 30), 12);
  branchCache.set(k, b);
  return b;
}

/**
 * The day officer, 0–11 (0 = 建 jian … 11 = 閉 bi): the day whose branch
 * matches the month's branch is jian, and the rest follow in order.
 */
export function jianchuOn(date: CivilDate): number {
  return mod((sexagenaryDay(date) % 12) - solarMonthBranch(date), 12);
}

/** Every date in [from, to] on which officer `n` serves. */
export function jianchuDates(n: number, from: CivilDate, to: CivilDate): CivilDate[] {
  const out: CivilDate[] = [];
  for (let d = from; daysFromCivil(d) <= daysFromCivil(to); d = addDays(d, 1)) if (jianchuOn(d) === n) out.push(d);
  return out;
}
