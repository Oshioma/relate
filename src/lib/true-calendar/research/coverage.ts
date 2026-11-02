// Mapping coverage: how much of the published research the date-mapping
// engine can place on a modern date, and how confidently. Counted record by
// record from the research bundle the database returns; nothing is estimated.

import type { ResearchBundle } from "./daily";
import { type MappingLevel, type MappingProfile, MAPPING_PROFILES, profileFor } from "./mapping";

export interface ProfileCoverage {
  profile: MappingProfile;
  /** Published date-bearing records this profile maps. */
  records: number;
}

export interface MappingCoverage {
  /** Published research records (sources, catalogue and daily notes excluded). */
  total: number;
  /** Published practices. */
  actionable: number;
  /** Date-bearing records by level: A verified, B estimated, C awaiting date alignment. */
  verified: number;
  estimated: number;
  awaiting: number;
  /** Cultures whose records a working (A or B) profile dates. */
  culturesMapped: number;
  culturesMappedNames: string[];
  /** Disagreements a reviewer should look at. */
  conflicts: number;
  profiles: ProfileCoverage[];
}

const LISTED_A = new Set(["official", "culturally_verified", "published_secondary"]);

export function mappingCoverage(bundle: ResearchBundle): MappingCoverage {
  const systems = new Map(bundle.systems.map((s) => [s.key, s]));
  const cycles = new Map(bundle.cycles.map((c) => [c.key, c]));
  const perProfile = new Map<string, number>();
  const level = { A: 0, B: 0, C: 0 } as Record<MappingLevel, number>;
  const mappedCultures = new Set<string>();
  const add = (l: MappingLevel, profile: MappingProfile | null, cultureKey: string | null) => {
    level[l]++;
    if (profile) perProfile.set(profile.key, (perProfile.get(profile.key) ?? 0) + 1);
    if (l !== "C" && cultureKey) mappedCultures.add(cultureKey);
  };
  const lunarLevel = (systemKey: string | null | undefined): [MappingLevel, MappingProfile | null] => {
    const profile = systemKey ? profileFor(systemKey) : null;
    return [profile && profile.level !== "C" && profile.cycleType === "synodic_lunar" ? "B" : "C", profile];
  };

  // Named lunar nights.
  for (const d of bundle.lunarDays) {
    const [l, p] = lunarLevel(d.system_key);
    add(l, p, systems.get(d.system_key)?.culture_key ?? null);
  }
  // Positions of day cycles: counted forward only from a sourced anchor under a working profile.
  for (const pos of bundle.positions) {
    const cycle = cycles.get(pos.cycle_key);
    const system = cycle ? systems.get(cycle.system_key) : undefined;
    const profile = system ? profileFor(system.key) : null;
    const anchored = Boolean(cycle?.anchor_date) && profile !== null && profile.level !== "C";
    const listed = bundle.correspondences.some((c) => c.culture_key === system?.culture_key && LISTED_A.has(c.date_status ?? "published_secondary") && c.label === pos.name);
    add(listed ? "A" : anchored ? "B" : "C", profile, system?.culture_key ?? null);
  }
  // Observances not already counted with a position or a night.
  for (const o of bundle.observances) {
    if (o.cycle_position_key) continue;
    if (o.moon_phase) {
      add("A", null, o.culture_key); // tied to a calculated phase
      continue;
    }
    const system = o.system_key ? systems.get(o.system_key) : undefined;
    const lunar = system && (system.kind === "lunar" || system.kind === "lunisolar") && (o.lunar_day !== null || /last day/i.test(o.timing ?? ""));
    const [l, p] = lunar ? lunarLevel(system.key) : [("C" as MappingLevel), system ? profileFor(system.key) : null];
    add(l, p, o.culture_key);
  }
  // Knowledge tied to a Moon phase.
  for (const m of bundle.meanings) if (m.subject === "moon_phase" && m.moon_phase) add("A", null, m.culture_key);
  // Named months: no profile dates them yet.
  for (const m of bundle.months) add("C", profileFor(m.system_key), null);
  // Published date listings.
  for (const c of bundle.correspondences) {
    const status = c.date_status ?? "published_secondary";
    add(LISTED_A.has(status) ? "A" : status === "provisional" ? "B" : "C", c.system_key ? profileFor(c.system_key) : null, c.culture_key);
  }

  const conflictGroups = new Map<string, number>();
  for (const r of bundle.recommendations) if (r.conflict_group) conflictGroups.set(r.conflict_group, (conflictGroups.get(r.conflict_group) ?? 0) + 1);
  const conflicts =
    [...conflictGroups.values()].filter((n) => n > 1).length + bundle.correspondences.filter((c) => c.date_status === "unknown_disputed").length;

  const cultureNames = new Map(bundle.cultures.map((c) => [c.key, c.name]));
  const total =
    bundle.systems.length +
    bundle.cycles.length +
    bundle.positions.length +
    bundle.months.length +
    bundle.lunarDays.length +
    bundle.observances.length +
    bundle.meanings.length +
    bundle.recommendations.length +
    bundle.correspondences.length;
  return {
    total,
    actionable: bundle.recommendations.length,
    verified: level.A,
    estimated: level.B,
    awaiting: level.C,
    culturesMapped: mappedCultures.size,
    culturesMappedNames: [...mappedCultures].map((k) => cultureNames.get(k) ?? k).sort(),
    conflicts,
    profiles: MAPPING_PROFILES.map((profile) => ({ profile, records: perProfile.get(profile.key) ?? 0 })),
  };
}
