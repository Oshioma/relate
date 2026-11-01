// The Moon and the Sun for The True Calendar, calculated — never stored, never
// looked up from a service.
//
// Everything here is built on Astronomy Engine (github.com/cosinekitty/
// astronomy, MIT licence, by Don Cross), which is designed to agree with the
// US Naval Observatory's NOVAS and NASA JPL Horizons to within about one
// arcminute. That is far tighter than anything a calendar shows: a new-moon
// time it gives is good to a minute or two for modern dates.
//
// Far from the present the limit is not the Moon's orbit but the Earth's
// rotation (ΔT), which is uncertain by minutes around 1700 and by hours in
// antiquity. So times outside RELIABLE_YEARS are still calculated but are
// flagged as approximate, and the interface says why.
//
// Conventions used throughout (they are ours, and are said so in the UI):
// • A "day" is a local calendar day in the chosen timezone.
// • A day's phase picture, age and illumination are taken at local noon.
// • Astronomical new moon = Sun–Moon conjunction in ecliptic longitude;
//   full moon = opposition. First visible crescent is a different, later and
//   location-dependent observation, and is not what starts a month here.

import * as Astronomy from "astronomy-engine";
import { type CivilDate, addDays, civilDateAt, compareDates, daysFromCivil, startOfDayIn } from "./dates";

export const SYNODIC_MONTH_DAYS = 29.530588861;
export const RELIABLE_YEARS = { from: 1700, to: 2200 } as const;
const KM_PER_AU = 149_597_870.7;

export function isReliableYear(year: number): boolean {
  return year >= RELIABLE_YEARS.from && year <= RELIABLE_YEARS.to;
}

// --- Phase at an instant -------------------------------------------------------

export type PhaseName =
  | "New Moon"
  | "Waxing Crescent"
  | "First Quarter"
  | "Waxing Gibbous"
  | "Full Moon"
  | "Waning Gibbous"
  | "Last Quarter"
  | "Waning Crescent";

export interface MoonState {
  /** Moon minus Sun ecliptic longitude, 0–360: 0 new, 90 first quarter, 180 full, 270 last quarter. */
  elongation: number;
  /** Fraction of the disc lit, 0–1. */
  illumination: number;
  /** Days since the most recent new moon. */
  ageDays: number;
  waxing: boolean;
  /** Centre-to-centre Earth–Moon distance. */
  distanceKm: number;
}

function toAstro(date: Date): Astronomy.AstroTime {
  return Astronomy.MakeTime(date);
}

export function moonStateAt(instant: Date): MoonState {
  const time = toAstro(instant);
  const elongation = Astronomy.MoonPhase(time);
  const illumination = Astronomy.Illumination(Astronomy.Body.Moon, time).phase_fraction;
  const distanceKm = Astronomy.GeoVector(Astronomy.Body.Moon, time, true).Length() * KM_PER_AU;
  // Age from the actual previous conjunction, not from the mean cycle.
  const previousNew = Astronomy.SearchMoonPhase(0, time.AddDays(-SYNODIC_MONTH_DAYS - 1), SYNODIC_MONTH_DAYS + 1.5);
  const ageDays = previousNew ? (instant.getTime() - previousNew.date.getTime()) / 86_400_000 : (elongation / 360) * SYNODIC_MONTH_DAYS;
  return { elongation, illumination, ageDays, waxing: elongation < 180, distanceKm };
}

/** The eight-way name for a day. The four principal phases are instants, so a
 * day is given one of those names only if that instant falls within it;
 * otherwise it takes the in-between name. */
export function phaseNameFor(state: MoonState, quarterToday: QuarterKind | null): PhaseName {
  if (quarterToday) return QUARTER_NAMES[quarterToday];
  const e = state.elongation;
  if (e < 90) return "Waxing Crescent";
  if (e < 180) return "Waxing Gibbous";
  if (e < 270) return "Waning Gibbous";
  return "Waning Crescent";
}

// --- Quarters (new, first quarter, full, last quarter) ------------------------

export type QuarterKind = "new" | "first" | "full" | "last";
export const QUARTER_NAMES: Record<QuarterKind, PhaseName> = {
  new: "New Moon",
  first: "First Quarter",
  full: "Full Moon",
  last: "Last Quarter",
};
const QUARTER_KINDS: QuarterKind[] = ["new", "first", "full", "last"];

export interface QuarterEvent {
  kind: QuarterKind;
  instant: Date;
}

/** All principal phases from `from` (inclusive) up to `to` (exclusive). */
export function quartersBetween(from: Date, to: Date): QuarterEvent[] {
  const out: QuarterEvent[] = [];
  let mq = Astronomy.SearchMoonQuarter(toAstro(from));
  while (mq.time.date.getTime() < to.getTime()) {
    out.push({ kind: QUARTER_KINDS[mq.quarter], instant: mq.time.date });
    mq = Astronomy.NextMoonQuarter(mq);
  }
  return out;
}

export function nextQuarter(after: Date, kind: QuarterKind): QuarterEvent {
  const target = { new: 0, first: 90, full: 180, last: 270 }[kind];
  const t = Astronomy.SearchMoonPhase(target, toAstro(after), 40);
  if (!t) throw new Error("Moon phase search failed");
  return { kind, instant: t.date };
}

// --- Days in a timezone ---------------------------------------------------------

export interface DayMoon {
  date: CivilDate;
  /** At local noon. */
  state: MoonState;
  /** A principal phase whose instant falls on this local day, if any. */
  quarter: QuarterEvent | null;
  name: PhaseName;
}

const dayCache = new Map<string, DayMoon>();

function localNoon(date: CivilDate, tz: string): Date {
  // Midnight + 12 h is local noon except on a clock-change day, where an hour
  // either way does not matter for a phase picture.
  return new Date(startOfDayIn(date, tz).getTime() + 12 * 3_600_000);
}

/** The Moon for each local day in [first, first + count). Cached. */
export function moonDays(first: CivilDate, count: number, tz: string): DayMoon[] {
  const out: DayMoon[] = [];
  const missing: CivilDate[] = [];
  for (let i = 0; i < count; i++) {
    const d = addDays(first, i);
    if (!dayCache.has(`${tz}|${daysFromCivil(d)}`)) missing.push(d);
  }
  if (missing.length > 0) {
    const from = startOfDayIn(missing[0], tz);
    const to = startOfDayIn(addDays(missing[missing.length - 1], 1), tz);
    const quarters = quartersBetween(from, to);
    for (const d of missing) {
      const start = startOfDayIn(d, tz).getTime();
      const end = startOfDayIn(addDays(d, 1), tz).getTime();
      const quarter = quarters.find((q) => q.instant.getTime() >= start && q.instant.getTime() < end) ?? null;
      const state = moonStateAt(localNoon(d, tz));
      dayCache.set(`${tz}|${daysFromCivil(d)}`, { date: d, state, quarter, name: phaseNameFor(state, quarter?.kind ?? null) });
    }
  }
  for (let i = 0; i < count; i++) {
    out.push(dayCache.get(`${tz}|${daysFromCivil(addDays(first, i))}`)!);
  }
  return out;
}

export function moonDay(date: CivilDate, tz: string): DayMoon {
  return moonDays(date, 1, tz)[0];
}

// --- The generic astronomical lunar month ----------------------------------------
//
// Our own convention, not any culture's calendar:
// • A lunar month runs from one astronomical new moon to the next.
// • Day 1 is the local calendar day (in the chosen timezone) on which the
//   conjunction falls; the month therefore has 29 or 30 days.
// • Months are numbered by the Gregorian year their day 1 falls in, so a year
//   has 12 or 13 of them ("Lunar month 11 of 2026").
// • Each month also carries its Brown Lunation Number, the standard running
//   count (lunation 1 began with the new moon of 16 January 1923 UTC), as an
//   unambiguous identifier.

export interface LunarMonth {
  /** The conjunction that opens the month. */
  newMoon: Date;
  nextNewMoon: Date;
  /** Local date of day 1. */
  start: CivilDate;
  /** 29 or 30. */
  length: number;
  /** 1-based within the Gregorian year of `start`. */
  numberInYear: number;
  year: number;
  brownLunation: number;
}

export interface LunarDate {
  month: LunarMonth;
  /** 1–30 */
  day: number;
}

// Meeus' lunation 0 is the new moon of 6 January 2000, 18:14 UTC; Brown's
// numbering is Meeus' + 953.
const MEEUS_EPOCH_MS = Date.UTC(2000, 0, 6, 18, 14);

export function brownLunationNumber(newMoon: Date): number {
  const k = Math.round((newMoon.getTime() - MEEUS_EPOCH_MS) / (SYNODIC_MONTH_DAYS * 86_400_000));
  return k + 953;
}

const yearNewMoonCache = new Map<string, Date[]>();

/** Conjunctions whose local date falls in the given Gregorian year. */
export function newMoonsInYear(year: number, tz: string): Date[] {
  const key = `${tz}|${year}`;
  const cached = yearNewMoonCache.get(key);
  if (cached) return cached;
  const from = startOfDayIn({ year, month: 1, day: 1 }, tz);
  const to = startOfDayIn({ year: year + 1, month: 1, day: 1 }, tz);
  const out: Date[] = [];
  let t = Astronomy.SearchMoonPhase(0, toAstro(from), 40);
  while (t && t.date.getTime() < to.getTime()) {
    out.push(t.date);
    t = Astronomy.SearchMoonPhase(0, t.AddDays(1), 40);
  }
  yearNewMoonCache.set(key, out);
  return out;
}

export function lunarMonthContaining(date: CivilDate, tz: string): LunarDate {
  const dayIndex = daysFromCivil(date);
  // The latest conjunction whose local date is on or before `date`: search back
  // up to one synodic month (plus slack) from the end of that day.
  const endOfDay = startOfDayIn(addDays(date, 1), tz);
  let t = Astronomy.SearchMoonPhase(0, toAstro(new Date(endOfDay.getTime() - 31 * 86_400_000)), 32);
  let opening: Astronomy.AstroTime | null = null;
  while (t && t.date.getTime() < endOfDay.getTime()) {
    opening = t;
    t = Astronomy.SearchMoonPhase(0, t.AddDays(1), 40);
  }
  if (!opening || !t) throw new Error("Could not place the lunar month");
  const start = civilDateAt(opening.date, tz);
  const nextStart = civilDateAt(t.date, tz);
  const year = start.year;
  const numberInYear = newMoonsInYear(year, tz).findIndex((d) => Math.abs(d.getTime() - opening!.date.getTime()) < 60_000) + 1;
  const month: LunarMonth = {
    newMoon: opening.date,
    nextNewMoon: t.date,
    start,
    length: daysFromCivil(nextStart) - daysFromCivil(start),
    numberInYear,
    year,
    brownLunation: brownLunationNumber(opening.date),
  };
  return { month, day: dayIndex - daysFromCivil(start) + 1 };
}

/** Same lunar day in the previous or next lunar month (clamped to its length). */
export function stepLunarMonth(current: LunarDate, n: number, tz: string): CivilDate {
  let month = current.month;
  for (let i = 0; i < Math.abs(n); i++) {
    const probe = n > 0 ? civilDateAt(month.nextNewMoon, tz) : addDays(month.start, -1);
    month = lunarMonthContaining(probe, tz).month;
  }
  return addDays(month.start, Math.min(current.day, month.length) - 1);
}

// --- Apsides: supermoon and micromoon --------------------------------------------
//
// Definition used (timeanddate.com's): a supermoon is a full moon less than
// 360,000 km from Earth (centre to centre); a micromoon is a full moon more
// than 405,000 km away. Other definitions exist — Richard Nolle's "within 90%
// of perigee" gives a slightly longer list — and the interface says so.

export const SUPERMOON_MAX_KM = 360_000;
export const MICROMOON_MIN_KM = 405_000;

export type FullMoonSize = "supermoon" | "micromoon" | null;

export function fullMoonSize(distanceKm: number): FullMoonSize {
  if (distanceKm < SUPERMOON_MAX_KM) return "supermoon";
  if (distanceKm > MICROMOON_MIN_KM) return "micromoon";
  return null;
}

export function moonDistanceKm(instant: Date): number {
  return Astronomy.GeoVector(Astronomy.Body.Moon, toAstro(instant), true).Length() * KM_PER_AU;
}

export interface Apsis {
  kind: "perigee" | "apogee";
  instant: Date;
  distanceKm: number;
}

export function nextApsis(after: Date): Apsis {
  const a = Astronomy.SearchLunarApsis(toAstro(after));
  return { kind: a.kind === Astronomy.ApsisKind.Pericenter ? "perigee" : "apogee", instant: a.time.date, distanceKm: a.dist_km };
}

// --- Eclipses --------------------------------------------------------------------

export interface LunarEclipse {
  kind: "penumbral" | "partial" | "total";
  peak: Date;
  /** "Blood Moon" in popular use means a total lunar eclipse. */
}

export interface SolarEclipse {
  kind: "partial" | "annular" | "total";
  peak: Date;
  /** Where the peak is seen, for central eclipses. */
  latitude?: number;
  longitude?: number;
}

export function nextLunarEclipse(after: Date): LunarEclipse {
  const e = Astronomy.SearchLunarEclipse(toAstro(after));
  return { kind: e.kind as LunarEclipse["kind"], peak: e.peak.date };
}

export function nextSolarEclipse(after: Date): SolarEclipse {
  const e = Astronomy.SearchGlobalSolarEclipse(toAstro(after));
  return {
    kind: e.kind as SolarEclipse["kind"],
    peak: e.peak.date,
    latitude: e.latitude,
    longitude: e.longitude,
  };
}

// --- Seasons -----------------------------------------------------------------------

export type SeasonKind = "march-equinox" | "june-solstice" | "september-equinox" | "december-solstice";

export const SEASON_NAMES: Record<SeasonKind, string> = {
  "march-equinox": "March equinox",
  "june-solstice": "June solstice",
  "september-equinox": "September equinox",
  "december-solstice": "December solstice",
};

export interface SeasonEvent {
  kind: SeasonKind;
  instant: Date;
}

const seasonCache = new Map<number, SeasonEvent[]>();

export function seasonsOf(year: number): SeasonEvent[] {
  const cached = seasonCache.get(year);
  if (cached) return cached;
  const s = Astronomy.Seasons(year);
  const out: SeasonEvent[] = [
    { kind: "march-equinox", instant: s.mar_equinox.date },
    { kind: "june-solstice", instant: s.jun_solstice.date },
    { kind: "september-equinox", instant: s.sep_equinox.date },
    { kind: "december-solstice", instant: s.dec_solstice.date },
  ];
  seasonCache.set(year, out);
  return out;
}

export function seasonEventsOn(date: CivilDate, tz: string): SeasonEvent[] {
  return [date.year - 1, date.year, date.year + 1]
    .flatMap((y) => seasonsOf(y))
    .filter((e) => compareDates(civilDateAt(e.instant, tz), date) === 0);
}

export function nextSeasonEvent(after: Date): SeasonEvent {
  const year = after.getUTCFullYear();
  return [year, year + 1].flatMap((y) => seasonsOf(y)).find((e) => e.instant.getTime() > after.getTime())!;
}

// --- Tides: the astronomical relationship only ----------------------------------
//
// Spring tides (the largest range) come with new and full Moon, when Sun and
// Moon pull in line; neap tides (the smallest) with the quarters. Real coasts
// lag this by a day or two and shape it heavily, so this is only the phase
// relationship — never a height or a time.

export type TidalPhase = "spring" | "neap" | "between";

export function tidalPhase(elongation: number): TidalPhase {
  // About two days (≈ 24° of elongation) either side of the alignment.
  const fromSyzygy = Math.min(elongation % 180, 180 - (elongation % 180));
  if (fromSyzygy <= 24) return "spring";
  if (Math.abs((elongation % 180) - 90) <= 24) return "neap";
  return "between";
}

// --- Rise and set ---------------------------------------------------------------

export interface Place {
  name: string;
  latitude: number;
  longitude: number;
  /** The zone that place keeps, so times can be shown as locals do. */
  timeZone?: string;
}

export const SUGGESTED_PLACES: Place[] = [
  { name: "Stone Town, Zanzibar", latitude: -6.1659, longitude: 39.1989, timeZone: "Africa/Dar_es_Salaam" },
  { name: "Nairobi", latitude: -1.2864, longitude: 36.8172, timeZone: "Africa/Nairobi" },
  { name: "Addis Ababa", latitude: 9.03, longitude: 38.74, timeZone: "Africa/Addis_Ababa" },
  { name: "Kampala", latitude: 0.3476, longitude: 32.5825, timeZone: "Africa/Kampala" },
  { name: "Lagos", latitude: 6.5244, longitude: 3.3792, timeZone: "Africa/Lagos" },
  { name: "Cairo", latitude: 30.0444, longitude: 31.2357, timeZone: "Africa/Cairo" },
  { name: "London", latitude: 51.5074, longitude: -0.1278, timeZone: "Europe/London" },
  { name: "New York", latitude: 40.7128, longitude: -74.006, timeZone: "America/New_York" },
  { name: "Sydney", latitude: -33.8688, longitude: 151.2093, timeZone: "Australia/Sydney" },
];

export interface RiseSet {
  moonrise: Date | null;
  moonset: Date | null;
  sunrise: Date | null;
  sunset: Date | null;
}

/** Rises and sets whose instant falls on the local day `date` in `tz`. A day
 * can have no moonrise or no moonset (the Moon rises about 50 minutes later
 * each day), which is shown as such rather than borrowed from the next day. */
export function riseSetOn(date: CivilDate, tz: string, place: Place): RiseSet {
  const observer = new Astronomy.Observer(place.latitude, place.longitude, 0);
  const start = startOfDayIn(date, tz);
  const end = startOfDayIn(addDays(date, 1), tz);
  const span = (end.getTime() - start.getTime()) / 86_400_000;
  const find = (body: Astronomy.Body, direction: 1 | -1): Date | null => {
    const t = Astronomy.SearchRiseSet(body, observer, direction, toAstro(start), span);
    return t && t.date.getTime() < end.getTime() ? t.date : null;
  };
  return {
    moonrise: find(Astronomy.Body.Moon, 1),
    moonset: find(Astronomy.Body.Moon, -1),
    sunrise: find(Astronomy.Body.Sun, 1),
    sunset: find(Astronomy.Body.Sun, -1),
  };
}
