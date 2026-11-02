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
import { type CivilDate, addDays, daysFromCivil, formatIsoDate, startOfDayIn } from "../dates";

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
