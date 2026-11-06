// "What does this day mean?" — putting published research on a calendar date.
//
// A tradition appears on a date only when the date can be matched to it
// reliably, which today means one of two things:
//   • a repeating day cycle (the Akan 42-day Adaduanan, the Igbo four-day
//     market week) with a sourced anchor: the Gregorian date of one known
//     position. Then position = (days since anchor + anchor position) mod length.
//   • a meaning attached to a Moon phase, matched against the calculated
//     phase for that day.
//   • a dated entry a source gives directly (a published festival date).
// Lunar days and months of particular calendars are not placed on dates here:
// each tradition starts its month by its own rule (often the first visible
// crescent, seen locally), and guessing that would be inventing a date.
//
// Pure functions; the research arrives as plain rows.

import { type CivilDate, addDays, daysFromCivil, formatIsoDate, parseIsoDate } from "../dates";
import type { DayMoon } from "../astronomy";
import type { CorrespondenceRecord, CultureRecord, DailyNoteRecord, LunarDayRecord, MonthRecord, SourceRecord, CyclePositionRecord, CycleRecord, MeaningRecord, MoonPhaseKey, ObservanceRecord, RecommendationRecord, SystemRecord } from "./model";

type Row<R> = Omit<R, "sources">;

export interface ResearchBundle {
  cultures: Row<CultureRecord>[];
  systems: Row<SystemRecord>[];
  cycles: Row<CycleRecord>[];
  positions: Row<CyclePositionRecord>[];
  observances: Row<ObservanceRecord>[];
  meanings: Row<MeaningRecord>[];
  recommendations: Row<RecommendationRecord>[];
  /** Dated entries a source gives directly (e.g. a published festival date). */
  correspondences: Row<CorrespondenceRecord>[];
  /** Modern, optional suggestions for particular dates (no culture). */
  notes: Row<DailyNoteRecord>[];
  /** Named nights/days of particular lunar calendars (never placed on dates). */
  lunarDays: Row<LunarDayRecord>[];
  /** Named months of particular calendars (seasonal; never placed on dates). */
  months: Row<MonthRecord>[];
  /** Published sources, and which claims each supports. */
  sources: Pick<Row<SourceRecord>, "key" | "title" | "url" | "publisher">[];
  citations: { claim_table: string; claim_key: string; source_key: string }[];
}

export const EMPTY_BUNDLE: ResearchBundle = { cultures: [], systems: [], cycles: [], positions: [], observances: [], meanings: [], recommendations: [], correspondences: [], notes: [], lunarDays: [], months: [], sources: [], citations: [] };

// --- Astrology traditions ------------------------------------------------------
//
// The astrology traditions (culture keys "astrology.…") describe houses and
// transits, not days. Personal Moon reads them; the history feed, the day hub
// and the coverage counts never see them, so personal readings and historical
// day records stay independent.

export const isAstrologyKey = (key: string | null | undefined): boolean => Boolean(key && key.startsWith("astrology."));

const splitCache = new WeakMap<ResearchBundle, { history: ResearchBundle; astrology: ResearchBundle }>();

function split(b: ResearchBundle) {
  const hit = splitCache.get(b);
  if (hit) return hit;
  const part = (astro: boolean): ResearchBundle => {
    const keep = (k: string | null | undefined) => isAstrologyKey(k) === astro;
    const cycles = b.cycles.filter((c) => keep(c.system_key));
    const cycleKeys = new Set(cycles.map((c) => c.key));
    return {
      cultures: b.cultures.filter((c) => keep(c.key)),
      systems: b.systems.filter((s) => keep(s.culture_key)),
      cycles,
      positions: b.positions.filter((p) => cycleKeys.has(p.cycle_key)),
      observances: b.observances.filter((o) => keep(o.culture_key)),
      meanings: b.meanings.filter((m) => keep(m.culture_key)),
      recommendations: b.recommendations.filter((r) => keep(r.culture_key)),
      correspondences: b.correspondences.filter((c) => keep(c.culture_key)),
      notes: astro ? [] : b.notes,
      lunarDays: b.lunarDays.filter((d) => keep(d.system_key)),
      months: b.months.filter((m) => keep(m.system_key)),
      sources: b.sources,
      citations: b.citations.filter((c) => keep(c.claim_key)),
    };
  };
  const out = { history: part(false), astrology: part(true) };
  splitCache.set(b, out);
  return out;
}

/** The bundle without the astrology traditions (what the history feed uses). */
export function historyBundle(b: ResearchBundle): ResearchBundle {
  return b.cultures.some((c) => isAstrologyKey(c.key)) || b.systems.some((s) => isAstrologyKey(s.key)) ? split(b).history : b;
}

/** Only the astrology traditions (what Personal Moon uses). */
export function astrologyBundle(b: ResearchBundle): ResearchBundle {
  return split(b).astrology;
}

/** The modern suggestions written for this date. */
export function notesForDay(bundle: ResearchBundle, date: CivilDate): Row<DailyNoteRecord>[] {
  const iso = formatIsoDate(date);
  return bundle.notes.filter((n) => n.note_date === iso);
}

function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}

/** Whether a cycle can be placed on dates at all. */
export function isAnchored(cycle: Row<CycleRecord>): boolean {
  return Boolean(cycle.anchor_date && parseIsoDate(cycle.anchor_date) && cycle.anchor_position != null && cycle.anchor_source_key);
}

/** 0-based position of `date` in an anchored cycle, or null. */
export function cyclePositionOn(cycle: Row<CycleRecord>, date: CivilDate): number | null {
  if (!isAnchored(cycle)) return null;
  const anchor = parseIsoDate(cycle.anchor_date!)!;
  return mod(daysFromCivil(date) - daysFromCivil(anchor) + cycle.anchor_position!, cycle.length_days);
}

/** The next dates (from `from`, inclusive) on which a cycle reaches `position`. */
export function nextDatesForPosition(cycle: Row<CycleRecord>, position: number, from: CivilDate, count = 3): CivilDate[] {
  const here = cyclePositionOn(cycle, from);
  if (here === null) return [];
  const first = mod(position - here, cycle.length_days);
  return Array.from({ length: count }, (_, i) => addDays(from, first + i * cycle.length_days));
}

/** The research phase keys that describe a calculated day. A day can match
 * more than one: a day just after new Moon is both "waxing" and (roughly)
 * "first crescent". */
export function phaseKeysFor(moon: DayMoon): MoonPhaseKey[] {
  if (moon.quarter) {
    return [({ new: "new", first: "first_quarter", full: "full", last: "last_quarter" } as const)[moon.quarter.kind]];
  }
  const keys: MoonPhaseKey[] = [moon.state.waxing ? "waxing" : "waning"];
  const age = moon.state.ageDays;
  if (moon.state.waxing && age >= 1 && age < 3.5) keys.push("first_crescent");
  if (age < 1.5 || age > 28) keys.push("dark");
  return keys;
}

export interface DayEntry {
  culture: Row<CultureRecord>;
  /** Why this entry applies on this day, e.g. "Akwasidae · day 28 of the 42-day Adaduanan". */
  reason: string;
  kind: "cycle" | "moon" | "dated";
  /** "first_crescent" is a rough match (visibility varies with place and sky). */
  approximate: boolean;
  cycle?: Row<CycleRecord>;
  position?: Row<CyclePositionRecord>;
  observances: Row<ObservanceRecord>[];
  meanings: Row<MeaningRecord>[];
  recommendations: Row<RecommendationRecord>[];
  /** Sourced dates that fall on this day (a published calendar listing it). */
  correspondences: Row<CorrespondenceRecord>[];
}

function onDate(c: Row<CorrespondenceRecord>, iso: string): boolean {
  if (!c.gregorian_from) return false;
  return c.gregorian_from <= iso && iso <= (c.gregorian_to ?? c.gregorian_from);
}

export function entriesForDay(all: ResearchBundle, date: CivilDate, moon: DayMoon | null): DayEntry[] {
  const bundle = historyBundle(all);
  const cultures = new Map(bundle.cultures.map((c) => [c.key, c]));
  const systems = new Map(bundle.systems.map((s) => [s.key, s]));
  const out: DayEntry[] = [];
  const iso = formatIsoDate(date);
  // Dated sources for this day, matched to a cycle entry of the same culture
  // when there is one (the cycle rule and the published date agree); the rest
  // become entries of their own.
  const dated = bundle.correspondences.filter((c) => onDate(c, iso));
  const usedDated = new Set<string>();

  for (const cycle of bundle.cycles) {
    const pos = cyclePositionOn(cycle, date);
    if (pos === null) continue;
    const system = systems.get(cycle.system_key);
    const culture = system ? cultures.get(system.culture_key) : undefined;
    if (!culture) continue;
    const position = bundle.positions.find((p) => p.cycle_key === cycle.key && p.position === pos);
    if (!position) continue; // an unnamed day of the cycle has nothing to say
    const matching = dated.filter((c) => c.culture_key === culture.key && (!c.system_key || c.system_key === cycle.system_key));
    for (const c of matching) usedDated.add(c.key);
    out.push({
      culture,
      kind: "cycle",
      approximate: false,
      reason: `${position.name} · day ${pos + 1} of the ${cycle.length_days}-day ${cycle.name}`,
      cycle,
      position,
      observances: bundle.observances.filter((o) => o.cycle_position_key === position.key),
      meanings: bundle.meanings.filter((m) => m.subject === "cycle_position" && m.subject_key === position.key),
      recommendations: bundle.recommendations.filter((r) => r.cycle_position_key === position.key),
      correspondences: matching,
    });
  }

  const datedByCulture = new Map<string, Row<CorrespondenceRecord>[]>();
  for (const c of dated) {
    if (usedDated.has(c.key)) continue;
    datedByCulture.set(c.culture_key, [...(datedByCulture.get(c.culture_key) ?? []), c]);
  }
  for (const [key, list] of datedByCulture) {
    const culture = cultures.get(key);
    if (!culture) continue;
    out.push({
      culture,
      kind: "dated",
      approximate: list.every((c) => c.certainty !== "exact"),
      reason: list.map((c) => c.label).join(" · "),
      observances: [],
      meanings: [],
      recommendations: [],
      correspondences: list,
    });
  }

  if (moon) {
    const keys = phaseKeysFor(moon);
    const byCulture = new Map<string, { meanings: Row<MeaningRecord>[]; observances: Row<ObservanceRecord>[]; recommendations: Row<RecommendationRecord>[]; approximate: boolean; phases: Set<string> }>();
    const slot = (key: string) => {
      let s = byCulture.get(key);
      if (!s) {
        s = { meanings: [], observances: [], recommendations: [], approximate: false, phases: new Set() };
        byCulture.set(key, s);
      }
      return s;
    };
    for (const m of bundle.meanings) {
      if (m.subject === "moon_phase" && m.moon_phase && keys.includes(m.moon_phase)) {
        const s = slot(m.culture_key);
        s.meanings.push(m);
        s.phases.add(m.moon_phase);
        if (m.moon_phase === "first_crescent" || m.moon_phase === "dark") s.approximate = true;
      }
    }
    for (const o of bundle.observances) {
      if (o.moon_phase && !o.cycle_position_key && keys.includes(o.moon_phase)) {
        const s = slot(o.culture_key);
        s.observances.push(o);
        s.phases.add(o.moon_phase);
        if (o.moon_phase === "first_crescent" || o.moon_phase === "dark") s.approximate = true;
      }
    }
    for (const r of bundle.recommendations) {
      if (r.moon_phase && !r.cycle_position_key && keys.includes(r.moon_phase)) slot(r.culture_key).recommendations.push(r);
    }
    for (const [key, s] of byCulture) {
      const culture = cultures.get(key);
      if (!culture) continue;
      out.push({
        culture,
        kind: "moon",
        approximate: s.approximate,
        reason: `Moon: ${[...s.phases].map((p) => p.replace(/_/g, " ")).join(", ")}`,
        observances: s.observances,
        meanings: s.meanings,
        recommendations: s.recommendations,
        correspondences: [],
      });
    }
  }

  return out.sort((a, b) => a.culture.name.localeCompare(b.culture.name));
}
