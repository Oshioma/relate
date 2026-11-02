/**
 * Mercury retrograde: apparent geocentric ecliptic longitude decreasing.
 * Uses astronomy-engine, already installed in Relate.
 * Astronomy is an observation; trade/contract meanings are attributed modern
 * Western astrological interpretations, not demonstrated causal effects.
 */
import * as Astronomy from "astronomy-engine";

export type MercuryStation = {
  kind: "retrograde_begins" | "retrograde_ends";
  utc: string;
  dateLocal: string;
  timezone: string;
};
export const MERCURY_TRADITION = {
  id: "western-astrology-mercury-retrograde",
  category: ["trade", "communication", "travel"],
  culture: "Western astrology",
  lineage: "Greco-Roman planetary symbolism and later Western astrology",
  traditionalMeaning: "Modern Western astrology commonly interprets Mercury retrograde as a time to review communications, travel arrangements and contracts.",
  modernApplication: "Double-check correspondence, terms, invoices and transport details; this is a modern suggestion, not a scientifically established planetary effect.",
  historicalSource: "https://fitzmuseum.cam.ac.uk/explore-our-collection/highlights/context/subjects/mercuryhermes",
  astronomicalSource: "https://www.planetary.org/articles/what-does-mercury-in-retrograde-actually-mean",
  historicalCaveat: "The blanket prohibition on signing contracts is not established as an ancient Greco-Roman rule.",
} as const;

function longitude(date: Date): number {
  const vector = Astronomy.GeoVector(Astronomy.Body.Mercury, date, true);
  return Astronomy.Ecliptic(vector).elon;
}
function signedDifference(next: number, previous: number): number {
  return ((next - previous + 540) % 360) - 180;
}
function velocity(date: Date): number {
  const halfDay = 12 * 60 * 60 * 1000;
  return signedDifference(
    longitude(new Date(date.getTime() + halfDay)),
    longitude(new Date(date.getTime() - halfDay))
  );
}
function localDay(date: Date, timezone: string): string {
  // en-CA is not universally ISO in all runtimes: use formatToParts.
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(date);
  const part = (name: string) => parts.find(x => x.type === name)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
function refineStation(left: number, right: number, initialRetrograde: boolean): Date {
  // Binary search the station to about one minute; the velocity is sampled
  // over 24h, so this is an estimated station instant, not an ephemeris root.
  for (let i = 0; i < 20 && right - left > 60_000; i++) {
    const mid = (left + right) / 2;
    const retrograde = velocity(new Date(mid)) < 0;
    if (retrograde === initialRetrograde) left = mid;
    else right = mid;
  }
  return new Date((left + right) / 2);
}
export function mercuryRetrogradeStations(
  startDate: Date, endDate: Date, timezone = "Africa/Dar_es_Salaam"
): MercuryStation[] {
  // Validates timezone early.
  localDay(startDate, timezone);
  const start = startDate.getTime();
  const end = endDate.getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start || end - start > 366 * 86_400_000)
    throw new Error("Date range must be between 0 and 366 days");
  const step = 86_400_000;
  const stations: MercuryStation[] = [];
  let previous = start;
  let previousRetrograde = velocity(new Date(previous)) < 0;
  for (let t = start + step; t <= end + step; t += step) {
    const current = Math.min(t, end);
    if (current === previous) break;
    const retrograde = velocity(new Date(current)) < 0;
    if (retrograde !== previousRetrograde) {
      const station = refineStation(previous, current, previousRetrograde);
      stations.push({
        kind: retrograde ? "retrograde_begins" : "retrograde_ends",
        utc: station.toISOString(),
        dateLocal: localDay(station, timezone),
        timezone
      });
    }
    previous = current;
    previousRetrograde = retrograde;
  }
  return stations;
}
