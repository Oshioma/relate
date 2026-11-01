// The International Fixed Calendar (Cotsworth's 13-month calendar).
//
// Thirteen months of exactly 28 days (13 × 28 = 364), so every month starts on
// a Sunday and every date falls on the same weekday every year. To keep pace
// with the Gregorian year it adds days that belong to no week:
//
//   • Year Day — after December 28, every year (Gregorian 31 December).
//   • Leap Day — after June 28 and before Sol 1, in Gregorian leap years
//     (Gregorian 17 June in a leap year).
//
// The fixed year starts on Gregorian 1 January and uses the Gregorian leap-year
// rule, so the two calendars always agree on the year number and the
// conversion is a pure function of the day of the year. It is a mathematical
// civil calendar, not a lunar one: 28 days is about 1.5 days short of a
// synodic month, so its months drift steadily against the Moon's phases.

import { type CivilDate, civilFromDays, daysFromCivil, dayOfYear, isGregorianLeapYear } from "./dates";

export const FIXED_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "Sol",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const FIXED_MONTH_LENGTH = 28;
export const FIXED_MONTH_COUNT = 13;
/** Day of year (1-based) of Leap Day in a leap year: after 6 × 28 = 168 days. */
export const LEAP_DAY_ORDINAL = 169;

export type FixedDate =
  | { kind: "day"; year: number; month: number; day: number }
  | { kind: "leap-day"; year: number }
  | { kind: "year-day"; year: number };

export function gregorianToFixed(date: CivilDate): FixedDate {
  const leap = isGregorianLeapYear(date.year);
  let ordinal = dayOfYear(date);
  if (leap) {
    if (ordinal === LEAP_DAY_ORDINAL) return { kind: "leap-day", year: date.year };
    if (ordinal > LEAP_DAY_ORDINAL) ordinal -= 1;
  }
  // 1..365 now, with Leap Day removed.
  if (ordinal === 365) return { kind: "year-day", year: date.year };
  const month = Math.floor((ordinal - 1) / FIXED_MONTH_LENGTH) + 1;
  const day = ((ordinal - 1) % FIXED_MONTH_LENGTH) + 1;
  return { kind: "day", year: date.year, month, day };
}

export function fixedToGregorian(fixed: FixedDate): CivilDate {
  const leap = isGregorianLeapYear(fixed.year);
  let ordinal: number;
  if (fixed.kind === "leap-day") {
    if (!leap) throw new RangeError(`${fixed.year} has no Leap Day`);
    ordinal = LEAP_DAY_ORDINAL;
  } else if (fixed.kind === "year-day") {
    ordinal = leap ? 366 : 365;
  } else {
    if (fixed.month < 1 || fixed.month > FIXED_MONTH_COUNT || fixed.day < 1 || fixed.day > FIXED_MONTH_LENGTH) {
      throw new RangeError("Fixed month must be 1–13 and day 1–28");
    }
    ordinal = (fixed.month - 1) * FIXED_MONTH_LENGTH + fixed.day;
    if (leap && ordinal >= LEAP_DAY_ORDINAL) ordinal += 1;
  }
  return civilFromDays(daysFromCivil({ year: fixed.year, month: 1, day: 1 }) + ordinal - 1);
}

/** 0 = Sunday … 6 = Saturday; null for Leap Day and Year Day, which sit outside
 * the week. Every fixed month begins on a Sunday. */
export function fixedWeekday(fixed: FixedDate): number | null {
  return fixed.kind === "day" ? (fixed.day - 1) % 7 : null;
}

export function formatFixedDate(fixed: FixedDate): string {
  if (fixed.kind === "leap-day") return `Leap Day ${fixed.year}`;
  if (fixed.kind === "year-day") return `Year Day ${fixed.year}`;
  return `${fixed.day} ${FIXED_MONTHS[fixed.month - 1]} ${fixed.year}`;
}

/** The fixed month a date belongs to, for showing a grid. Leap Day is shown
 * with June (it follows June 28) and Year Day with December. */
export function fixedGridMonth(fixed: FixedDate): number {
  if (fixed.kind === "leap-day") return 6;
  if (fixed.kind === "year-day") return 13;
  return fixed.month;
}

/** Step the fixed calendar by whole months, keeping the day (always valid, as
 * every month has 28 days). Leap Day and Year Day step from the month they
 * are shown with. */
export function addFixedMonths(fixed: FixedDate, n: number): FixedDate {
  const day = fixed.kind === "day" ? fixed.day : 28;
  const index = fixed.year * 13 + (fixedGridMonth(fixed) - 1) + n;
  const year = Math.floor(index / 13);
  return { kind: "day", year, month: index - year * 13 + 1, day };
}
