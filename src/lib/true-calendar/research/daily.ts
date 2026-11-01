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
import type { CorrespondenceRecord, CultureRecord, CyclePositionRecord, CycleRecord, MeaningRecord, MoonPhaseKey, ObservanceRecord, RecommendationRecord, SystemRecord } from "./model";

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
}

export const EMPTY_BUNDLE: ResearchBundle = { cultures: [], systems: [], cycles: [], positions: [], observances: [], meanings: [], recommendations: [], correspondences: [] };

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

export function entriesForDay(bundle: ResearchBundle, date: CivilDate, moon: DayMoon | null): DayEntry[] {
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
