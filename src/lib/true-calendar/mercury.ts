// Mercury retrograde: when Mercury appears to move backwards (westward)
// against the stars. Mercury never really reverses; around inferior
// conjunction it overtakes Earth on the inside, and the changing angle makes
// its geocentric longitude run backwards for about three weeks, three or four
// times a year.
//
// A station is the instant the apparent geocentric ecliptic longitude stops
// and turns. We sample Mercury's apparent motion every 12 hours with
// astronomy-engine and bisect each sign change to under a minute. Results are
// cached by UTC year. Pure apart from that cache.

import * as Astronomy from "astronomy-engine";
import { type CivilDate, addDays, civilDateAt, daysFromCivil, startOfDayIn } from "./dates";

export interface MercuryStation {
  kind: "retrograde" | "direct";
  instant: Date;
}

export interface RetrogradePeriod {
  /** Mercury stations retrograde. */
  start: Date;
  /** Mercury stations direct. */
  end: Date;
}

const HOUR = 3_600_000;

function apparentLongitude(t: number): number {
  return Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Mercury, new Date(t), true)).elon;
}
/** Degrees per day, positive when moving eastward (direct). */
function motion(t: number): number {
  const d = apparentLongitude(t + HOUR) - apparentLongitude(t - HOUR);
  const wrapped = ((d + 540) % 360) - 180;
  return wrapped * 12;
}

const yearCache = new Map<number, MercuryStation[]>();

/** Stations whose instant falls in UTC calendar year `year`. */
export function mercuryStationsInYear(year: number): MercuryStation[] {
  const hit = yearCache.get(year);
  if (hit) return hit;
  const start = Date.UTC(2000, 0, 1) + (daysFromCivil({ year, month: 1, day: 1 }) - daysFromCivil({ year: 2000, month: 1, day: 1 })) * 24 * HOUR;
  const end = start + (daysFromCivil({ year: year + 1, month: 1, day: 1 }) - daysFromCivil({ year, month: 1, day: 1 })) * 24 * HOUR;
  const step = 12 * HOUR;
  const out: MercuryStation[] = [];
  let prevT = start;
  let prevRetro = motion(prevT) < 0;
  for (let t = start + step; t <= end; t += step) {
    const retro = motion(t) < 0;
    if (retro !== prevRetro) {
      let lo = prevT;
      let hi = t;
      while (hi - lo > 30_000) {
        const mid = (lo + hi) / 2;
        if (motion(mid) < 0 === prevRetro) lo = mid;
        else hi = mid;
      }
      out.push({ kind: retro ? "retrograde" : "direct", instant: new Date(Math.round((lo + hi) / 2)) });
    }
    prevT = t;
    prevRetro = retro;
  }
  yearCache.set(year, out);
  return out;
}

/** Every retrograde period that overlaps the UTC years [fromYear, toYear], start to end. */
export function retrogradePeriods(fromYear: number, toYear: number): RetrogradePeriod[] {
  const stations: MercuryStation[] = [];
  for (let y = fromYear - 1; y <= toYear + 1; y++) stations.push(...mercuryStationsInYear(y));
  stations.sort((a, b) => a.instant.getTime() - b.instant.getTime());
  const out: RetrogradePeriod[] = [];
  for (let i = 0; i < stations.length - 1; i++) {
    if (stations[i].kind === "retrograde" && stations[i + 1].kind === "direct") out.push({ start: stations[i].instant, end: stations[i + 1].instant });
  }
  return out;
}

export interface MercuryDay {
  /** Mercury is retrograde for at least part of this local day. */
  retrograde: boolean;
  /** Mercury stations on this local day. */
  station: "retrograde" | "direct" | null;
  /** The period this day is in, or the next one when Mercury is direct. */
  period: RetrogradePeriod;
  startDate: CivilDate;
  endDate: CivilDate;
  /** Day N of `length` while retrograde. */
  day: number | null;
  length: number;
}

/** Mercury on a local calendar day in `tz`. */
export function mercuryOn(date: CivilDate, tz: string): MercuryDay {
  const dayStart = startOfDayIn(date, tz).getTime();
  const dayEnd = startOfDayIn(addDays(date, 1), tz).getTime();
  const periods = retrogradePeriods(date.year, date.year + 1);
  const current = periods.find((p) => p.start.getTime() < dayEnd && p.end.getTime() >= dayStart);
  const period = current ?? periods.find((p) => p.start.getTime() >= dayStart) ?? periods[periods.length - 1];
  const startDate = civilDateAt(period.start, tz);
  const endDate = civilDateAt(period.end, tz);
  const length = daysFromCivil(endDate) - daysFromCivil(startDate) + 1;
  const inside = (t: Date) => t.getTime() >= dayStart && t.getTime() < dayEnd;
  return {
    retrograde: Boolean(current),
    station: current ? (inside(current.start) ? "retrograde" : inside(current.end) ? "direct" : null) : null,
    period,
    startDate,
    endDate,
    day: current ? daysFromCivil(date) - daysFromCivil(startDate) + 1 : null,
    length,
  };
}

/** What Mercury retrograde means: the astronomy, then the astrology, labelled. */
export const MERCURY_NOTES = {
  astronomy:
    "Mercury does not really reverse. It orbits the Sun in 88 days, faster than Earth, and about three times a year it overtakes us on the inside. For roughly three weeks the changing angle makes it look as if it is sliding backwards (westward) against the stars.",
  astrology:
    "In modern Western astrology Mercury rules communication, travel, contracts and trade, so a retrograde period is read as a time to review, double-check and finish things rather than start them: re-read messages and terms, confirm bookings, back up files, expect delays.",
  history:
    "Ancient astronomers knew retrograde motion well. The popular idea that Mercury retrograde brings mix-ups and broken gadgets is modern: it spread through newspaper horoscopes from the 1970s.",
  science: "No study has shown that Mercury's apparent motion affects events on Earth. Treat the advice as a reflective habit, not a forecast.",
  sources: [
    { title: "Retrograde motion (NASA StarChild)", url: "https://starchild.gsfc.nasa.gov/docs/StarChild/questions/question46.html" },
    { title: "Mercury retrograde: the astronomy and the history (National Geographic)", url: "https://www.nationalgeographic.com/history/article/mercury-retrograde-astronomy-history" },
    { title: "Where Mercury retrograde superstition comes from (TIME)", url: "https://time.com/5207161/mercury-retrograde-astrology-history/" },
  ],
} as const;
