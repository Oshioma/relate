// Civil dates for The True Calendar.
//
// Every date in the calendar is a plain civil date — year, month, day — in the
// proleptic Gregorian calendar, with no time and no timezone attached. A civil
// date is turned into a whole-day count (days since 1970-01-01) for arithmetic,
// using Howard Hinnant's days_from_civil algorithm, which is exact for every
// year (including year 0 and negative, astronomical-numbered years) and does
// not lean on JavaScript's Date, whose two-digit-year quirks and range limits
// would otherwise leak into historical navigation.
//
// The timezone only matters in two places: deciding what "today" is for the
// viewer, and turning an astronomical instant (a new moon at 03:14 UTC) into
// the local day it falls on. Both are here, on top of Intl, so they follow the
// real tz database (including historical offsets) rather than a fixed offset.

export interface CivilDate {
  /** Astronomical year numbering: 1 BCE is year 0, 2 BCE is -1. */
  year: number;
  /** 1–12 */
  month: number;
  /** 1–31 */
  day: number;
}

export const GREGORIAN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** The range the calendar lets you navigate. Pure date maths works far beyond
 * it; this simply keeps the year box and URLs to something meaningful. */
export const MIN_YEAR = -4000;
export const MAX_YEAR = 9999;

export function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInGregorianMonth(year: number, month: number): number {
  if (month === 2) return isGregorianLeapYear(year) ? 29 : 28;
  return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

export function daysInGregorianYear(year: number): number {
  return isGregorianLeapYear(year) ? 366 : 365;
}

// Floor division that behaves for negative numbers.
function floorDiv(a: number, b: number): number {
  return Math.floor(a / b);
}

/** Whole days since 1970-01-01 (which is day 0). */
export function daysFromCivil({ year, month, day }: CivilDate): number {
  const y = month <= 2 ? year - 1 : year;
  const era = floorDiv(y, 400);
  const yoe = y - era * 400; // [0, 399]
  const mp = (month + 9) % 12; // March = 0
  const doy = floorDiv(153 * mp + 2, 5) + day - 1; // [0, 365]
  const doe = yoe * 365 + floorDiv(yoe, 4) - floorDiv(yoe, 100) + doy; // [0, 146096]
  return era * 146097 + doe - 719468;
}

/** The inverse of daysFromCivil. */
export function civilFromDays(days: number): CivilDate {
  const z = days + 719468;
  const era = floorDiv(z, 146097);
  const doe = z - era * 146097; // [0, 146096]
  const yoe = floorDiv(doe - floorDiv(doe, 1460) + floorDiv(doe, 36524) - floorDiv(doe, 146096), 365); // [0, 399]
  const doy = doe - (365 * yoe + floorDiv(yoe, 4) - floorDiv(yoe, 100)); // [0, 365]
  const mp = floorDiv(5 * doy + 2, 153); // [0, 11]
  const day = doy - floorDiv(153 * mp + 2, 5) + 1;
  const month = mp < 10 ? mp + 3 : mp - 9;
  const year = yoe + era * 400 + (month <= 2 ? 1 : 0);
  return { year, month, day };
}

export function isValidCivil(date: CivilDate): boolean {
  return (
    Number.isInteger(date.year) &&
    Number.isInteger(date.month) &&
    Number.isInteger(date.day) &&
    date.month >= 1 &&
    date.month <= 12 &&
    date.day >= 1 &&
    date.day <= daysInGregorianMonth(date.year, date.month)
  );
}

export function sameDate(a: CivilDate, b: CivilDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export function compareDates(a: CivilDate, b: CivilDate): number {
  return daysFromCivil(a) - daysFromCivil(b);
}

export function addDays(date: CivilDate, n: number): CivilDate {
  return civilFromDays(daysFromCivil(date) + n);
}

/** Move by whole months, keeping the day where it can and otherwise clamping to
 * the month's last day (31 January + 1 month = 28 or 29 February). */
export function addMonths(date: CivilDate, n: number): CivilDate {
  const index = date.year * 12 + (date.month - 1) + n;
  const year = floorDiv(index, 12);
  const month = index - year * 12 + 1;
  return { year, month, day: Math.min(date.day, daysInGregorianMonth(year, month)) };
}

/** Move by whole years; 29 February lands on 28 February in a common year. */
export function addYears(date: CivilDate, n: number): CivilDate {
  const year = date.year + n;
  return { year, month: date.month, day: Math.min(date.day, daysInGregorianMonth(year, date.month)) };
}

/** 0 = Sunday … 6 = Saturday. 1970-01-01 was a Thursday. */
export function weekdayOf(date: CivilDate): number {
  return ((daysFromCivil(date) % 7) + 7 + 4) % 7;
}

/** 1-based day of the Gregorian year. */
export function dayOfYear(date: CivilDate): number {
  return daysFromCivil(date) - daysFromCivil({ year: date.year, month: 1, day: 1 }) + 1;
}

export function clampYear(date: CivilDate): CivilDate {
  if (date.year < MIN_YEAR) return { year: MIN_YEAR, month: 1, day: 1 };
  if (date.year > MAX_YEAR) return { year: MAX_YEAR, month: 12, day: 31 };
  return date;
}

// --- ISO text ---------------------------------------------------------------

function pad(n: number, width: number): string {
  return String(Math.abs(n)).padStart(width, "0");
}

/** 2026-11-01; years outside 0–9999 use the ISO 8601 expanded form (-0500-03-01). */
export function formatIsoDate({ year, month, day }: CivilDate): string {
  const y = year >= 0 && year <= 9999 ? pad(year, 4) : `${year < 0 ? "-" : "+"}${pad(year, 4)}`;
  return `${y}-${pad(month, 2)}-${pad(day, 2)}`;
}

/** Reads 2026-11-01, -0500-03-01 or +10000-01-01. Anything else, or an
 * impossible date (2026-02-30), gives null. */
export function parseIsoDate(text: string | null | undefined): CivilDate | null {
  if (!text) return null;
  const match = /^([+-]?\d{4,6})-(\d{2})-(\d{2})$/.exec(text.trim());
  if (!match) return null;
  const date = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  return isValidCivil(date) ? date : null;
}

// --- Human text -------------------------------------------------------------

/** "1 November 2026", "15 March 44 BCE" (astronomical year -43). */
export function formatYear(year: number): string {
  return year > 0 ? String(year) : `${1 - year} BCE`;
}

export function formatLongDate(date: CivilDate, withWeekday = true): string {
  const text = `${date.day} ${GREGORIAN_MONTHS[date.month - 1]} ${formatYear(date.year)}`;
  return withWeekday ? `${WEEKDAYS[weekdayOf(date)]} ${text}` : text;
}

/** Before 15 October 1582 nobody was using the Gregorian calendar; dates are
 * still shown in it (proleptic), and the interface says so. */
export function isProlepticGregorian(date: CivilDate): boolean {
  return compareDates(date, { year: 1582, month: 10, day: 15 }) < 0;
}

// --- Timezones --------------------------------------------------------------

export function isValidTimeZone(tz: string | null | undefined): tz is string {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-GB", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

const partsFormatters = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(tz: string): Intl.DateTimeFormat {
  let f = partsFormatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      era: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hourCycle: "h23",
    });
    partsFormatters.set(tz, f);
  }
  return f;
}

export interface ZonedDateTime extends CivilDate {
  hour: number;
  minute: number;
  second: number;
}

/** The wall-clock date and time in `tz` at a given instant. */
export function zonedParts(instant: Date, tz: string): ZonedDateTime {
  const parts = partsFormatter(tz).formatToParts(instant);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  const eraYear = Number(get("year"));
  const era = get("era");
  // Intl gives "1 BC", "2 BC"…; astronomical numbering makes 1 BC year 0.
  const year = era === "BC" || era === "B" ? 1 - eraYear : eraYear;
  return {
    year,
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")) % 24,
    minute: Number(get("minute")),
    second: Number(get("second")),
  };
}

/** The local calendar date in `tz` at a given instant. */
export function civilDateAt(instant: Date, tz: string): CivilDate {
  const { year, month, day } = zonedParts(instant, tz);
  return { year, month, day };
}

/** Today in the viewer's (or a chosen) timezone, from the real clock. */
export function todayIn(tz: string, now: Date = new Date()): CivilDate {
  return civilDateAt(now, tz);
}

const MS_PER_DAY = 86_400_000;

/** UTC milliseconds of a civil date-time read as if it were UTC. Avoids Date.UTC,
 * which treats years 0–99 as 1900–1999. */
function utcMsOf(date: CivilDate, hour = 0, minute = 0, second = 0): number {
  return daysFromCivil(date) * MS_PER_DAY + ((hour * 60 + minute) * 60 + second) * 1000;
}

/** Offset of `tz` from UTC at an instant, in minutes (east positive). */
export function zoneOffsetMinutes(instant: Date, tz: string): number {
  const p = zonedParts(instant, tz);
  const asUtc = utcMsOf(p, p.hour, p.minute, p.second);
  const instantSeconds = Math.floor(instant.getTime() / 1000) * 1000;
  return Math.round((asUtc - instantSeconds) / 60000);
}

/** The instant local midnight begins on `date` in `tz`. Where a clock change
 * skips midnight, the first instant of that local day. */
export function startOfDayIn(date: CivilDate, tz: string): Date {
  const target = utcMsOf(date);
  // Two passes settle the offset, as it can differ either side of a change.
  let guess = target - zoneOffsetMinutes(new Date(target), tz) * 60000;
  guess = target - zoneOffsetMinutes(new Date(guess), tz) * 60000;
  // If a DST jump skipped midnight, the guess lands on the previous day.
  if (compareDates(civilDateAt(new Date(guess), tz), date) < 0) guess += 3600000;
  return new Date(guess);
}

/** A friendly list of zones for the picker; the viewer's own zone is added if missing. */
export const SUGGESTED_TIME_ZONES = [
  "Africa/Dar_es_Salaam",
  "Africa/Nairobi",
  "Africa/Addis_Ababa",
  "Africa/Kampala",
  "Africa/Lagos",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Europe/London",
  "Europe/Paris",
  "Europe/Athens",
  "Asia/Jerusalem",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
  "Pacific/Honolulu",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Mexico_City",
  "America/Lima",
  "America/Sao_Paulo",
  "UTC",
] as const;
