// The Moons of a year: every lunar month (new Moon to new Moon) that begins in
// one Gregorian year, 12 or 13 of them, with what the sky does in each and
// which named months of the traditions in the research database fall in it.
//
// Everything about the sky is calculated (astronomy-engine). Everything about
// meaning comes from published research records, each with its own tradition,
// date rule and sources; nothing here names or explains a Moon on its own.

import { type CivilDate, addDays, civilDateAt, compareDates, daysFromCivil } from "./dates";
import {
  type FullMoonSize,
  type SeasonKind,
  SEASON_NAMES,
  fullMoonSize,
  moonDistanceKm,
  newMoonsInYear,
  nextLunarEclipse,
  nextSolarEclipse,
  quartersBetween,
  seasonsOf,
} from "./astronomy";
import { type ResearchBundle, historyBundle } from "./research/daily";
import { type MonthSpan, monthSpans, profileFor } from "./research/mapping";

export interface MoonTradition {
  key: string;
  cultureName: string;
  /** e.g. "Arahsamna (Babylonian month 8)". */
  label: string;
  translation: string | null;
  says: string[];
  /** Festivals or rules the source ties to this month. */
  observances: { name: string; description: string | null }[];
  /** How the month was lined up with this Moon (and whether it's a reconstruction). */
  rule: string;
  illustrative: boolean;
  /** The tradition's own month, which can start a day or two off this one. */
  start: CivilDate;
  end: CivilDate;
  caution: string | null;
  sources: { title: string; url: string | null }[];
}

export interface MoonOfYear {
  /** 1-based within the year. */
  number: number;
  newMoon: Date;
  nextNewMoon: Date;
  start: CivilDate;
  end: CivilDate;
  length: number;
  fullMoon: Date | null;
  fullMoonSize: FullMoonSize;
  eclipses: { kind: "lunar" | "solar"; type: string; peak: Date }[];
  seasons: { kind: SeasonKind; name: string; instant: Date }[];
  traditions: MoonTradition[];
}

const DAY = 86_400_000;

/** Every lunar month whose new Moon falls (locally) in `year`. Sky only. */
export function moonsOfYear(year: number, tz: string): MoonOfYear[] {
  const starts = newMoonsInYear(year, tz);
  const after = newMoonsInYear(year + 1, tz)[0];
  if (!after) return [];
  const all = [...starts, after];
  const seasons = [year - 1, year, year + 1].flatMap((y) => seasonsOf(y));
  // Eclipses of the year, found once.
  const eclipses: MoonOfYear["eclipses"] = [];
  const from = starts[0] ?? after;
  for (let t = from; t.getTime() < after.getTime(); ) {
    const e = nextLunarEclipse(t);
    if (e.peak.getTime() >= after.getTime()) break;
    eclipses.push({ kind: "lunar", type: e.kind, peak: e.peak });
    t = new Date(e.peak.getTime() + DAY);
  }
  for (let t = from; t.getTime() < after.getTime(); ) {
    const e = nextSolarEclipse(t);
    if (e.peak.getTime() >= after.getTime()) break;
    eclipses.push({ kind: "solar", type: e.kind, peak: e.peak });
    t = new Date(e.peak.getTime() + DAY);
  }
  return starts.map((newMoon, i) => {
    const nextNewMoon = all[i + 1];
    const start = civilDateAt(newMoon, tz);
    const nextStart = civilDateAt(nextNewMoon, tz);
    const full = quartersBetween(newMoon, nextNewMoon).find((q) => q.kind === "full");
    const inMonth = (d: Date) => d.getTime() >= newMoon.getTime() && d.getTime() < nextNewMoon.getTime();
    return {
      number: i + 1,
      newMoon,
      nextNewMoon,
      start,
      end: addDays(nextStart, -1),
      length: daysFromCivil(nextStart) - daysFromCivil(start),
      fullMoon: full?.instant ?? null,
      fullMoonSize: full ? fullMoonSize(moonDistanceKm(full.instant)) : null,
      eclipses: eclipses.filter((e) => inMonth(e.peak)).sort((a, b) => a.peak.getTime() - b.peak.getTime()),
      seasons: seasons.filter((s) => inMonth(s.instant)).map((s) => ({ kind: s.kind, name: SEASON_NAMES[s.kind], instant: s.instant })),
      traditions: [],
    };
  });
}

const overlapDays = (a: { start: CivilDate; end: CivilDate }, b: { start: CivilDate; end: CivilDate }) =>
  Math.max(0, Math.min(daysFromCivil(a.end), daysFromCivil(b.end)) - Math.max(daysFromCivil(a.start), daysFromCivil(b.start)) + 1);

/**
 * The named months of the traditions that fall in each Moon: a tradition's
 * month counts for a Moon when most of it (15 days or more) lies inside it.
 * Only traditions whose year can be placed (a mapping profile with a year
 * start) take part; the rest are never given a Moon.
 */
export function withTraditions(moons: MoonOfYear[], all: ResearchBundle): MoonOfYear[] {
  if (moons.length === 0) return moons;
  const bundle = historyBundle(all);
  const systems = new Map(bundle.systems.map((s) => [s.key, s]));
  const cultures = new Map(bundle.cultures.map((c) => [c.key, c]));
  const sourceByKey = new Map(bundle.sources.map((s) => [s.key, s]));
  const citesBy = new Map<string, string[]>();
  for (const c of bundle.citations) citesBy.set(`${c.claim_table}|${c.claim_key}`, [...(citesBy.get(`${c.claim_table}|${c.claim_key}`) ?? []), c.source_key]);
  const sourcesFor = (claims: [string, string][]) => {
    const seen = new Set<string>();
    return claims
      .flatMap(([t, k]) => citesBy.get(`${t}|${k}`) ?? [])
      .filter((k) => (seen.has(k) ? false : (seen.add(k), true)))
      .flatMap((k) => {
        const s = sourceByKey.get(k);
        return s ? [{ title: s.publisher ? `${s.title} (${s.publisher})` : s.title, url: s.url ?? null }] : [];
      });
  };
  const from = addDays(moons[0].start, -40);
  const to = addDays(moons[moons.length - 1].end, 40);
  const spanCache = new Map<string, MonthSpan[]>();
  const out = moons.map((m) => ({ ...m, traditions: [] as MoonTradition[] }));
  for (const month of bundle.months) {
    const system = systems.get(month.system_key);
    const culture = system ? cultures.get(system.culture_key) : undefined;
    const profile = profileFor(month.system_key);
    if (!system || !culture || !profile || profile.level === "C" || !profile.yearStart) continue;
    if (!spanCache.has(profile.key)) spanCache.set(profile.key, monthSpans(profile, from, to));
    const spans = spanCache.get(profile.key)!.filter((s) => s.ordinal === month.ordinal);
    const calendar = profile.calendarSystem.replace(/ (months|lunisolar calendar)$/, "");
    const observances = bundle.observances.filter((o) => o.month_key === month.key);
    for (const span of spans) {
      const moon = out.find((m) => overlapDays(m, span) >= 15);
      if (!moon) continue;
      moon.traditions.push({
        key: `${month.key}@${span.start.year}`,
        cultureName: culture.name,
        label: `${month.original_name ?? month.name} (${calendar} month ${month.ordinal})`,
        translation: month.translation ?? null,
        says: [...new Set([month.description, month.season].filter((s): s is string => Boolean(s)))],
        observances: observances.map((o) => ({ name: o.original_name ?? o.name, description: o.description ?? null })),
        rule: `${profile.illustrative ? "Illustrative reconstruction" : "Approximate alignment"} (${profile.label}): ${profile.assumption}`,
        illustrative: Boolean(profile.illustrative),
        start: span.start,
        end: span.end,
        caution: [month.uncertainty, system.uncertainty].filter(Boolean).join(" ") || null,
        sources: sourcesFor([["calendar_months", month.key], ...observances.map((o) => ["calendar_observances", o.key] as [string, string])]),
      });
    }
  }
  for (const m of out) m.traditions.sort((a, b) => a.cultureName.localeCompare(b.cultureName) || compareDates(a.start, b.start));
  return out;
}

/** Which Moon of the list holds `date` (or -1). */
export function moonIndexFor(moons: MoonOfYear[], date: CivilDate): number {
  return moons.findIndex((m) => compareDates(date, m.start) >= 0 && compareDates(date, m.end) <= 0);
}
