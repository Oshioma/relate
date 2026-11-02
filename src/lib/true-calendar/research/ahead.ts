// "Next advice from the past": a forward-looking list of what the published
// research says, from any tradition, not limited to the next seven days.
//
// Every item comes from an imported record. Its date, when it has one, says
// how it is known:
//   • published    — a source lists this Gregorian date (date_correspondences)
//   • astronomical — the Moon phase the record is tied to, calculated
//   • provisional  — a sourced cycle anchor, counted forward (needs confirming
//                    beyond the dates the source itself lists)
//   • undated      — recurring knowledge (a lunar night, an unanchored cycle
//                    day) whose Gregorian date depends on a local rule that is
//                    not verified; listed separately, never given a date.
//
// Pure functions; the research arrives as plain rows.

import { type CivilDate, addDays, compareDates, daysFromCivil, formatIsoDate, parseIsoDate } from "../dates";
import type { DayMoon } from "../astronomy";
import { type ResearchBundle, cyclePositionOn, isAnchored, phaseKeysFor } from "./daily";
import type { Activity, EvidenceTag, MoonPhaseKey } from "./model";

export const ADVICE_CATEGORIES = [
  { key: "farming", label: "Farming and gardening" },
  { key: "fishing", label: "Fishing and tides" },
  { key: "health", label: "Health and wellbeing" },
  { key: "community", label: "Family and community" },
  { key: "ceremony", label: "Ceremonies and spirituality" },
] as const;
export type AdviceCategory = (typeof ADVICE_CATEGORIES)[number]["key"];

export type DateStatus = "published" | "astronomical" | "provisional" | "undated";
export const DATE_STATUS_LABELS: Record<DateStatus, string> = {
  published: "Published date",
  astronomical: "Astronomically calculated",
  provisional: "Provisional: counted from a sourced anchor",
  undated: "Date to be verified",
};

export interface AdviceItem {
  id: string;
  date: CivilDate | null;
  status: DateStatus;
  cultureKey: string;
  cultureName: string;
  region: string | null;
  /** The traditional name, e.g. "Whiro" or "Akwasidae". */
  name: string;
  /** Where it sits, e.g. "Night 1 of Oʻahu lunar nights" or "Day 1 of the 42-day Adaduanan". */
  cycle: string;
  /** What the tradition says (historical, sourced). */
  says: string[];
  /** Modern, optional readings, always shown as modern. */
  modern: string[];
  categories: AdviceCategory[];
  evidence: EvidenceTag[];
  sources: { key: string; title: string; url: string | null }[];
  /** A caution from the record (e.g. "not a night number"). */
  caution: string | null;
  /** Undated items are shown grouped by calendar, in order. */
  group: string;
  groupLabel: string;
  order: number;
}

const ACTIVITY_CATEGORY: Partial<Record<Activity, AdviceCategory>> = {
  planting: "farming",
  harvesting: "farming",
  fishing: "fishing",
  rest: "health",
  community: "community",
  remembrance: "community",
  trade: "community",
  ceremony: "ceremony",
};
const OBSERVANCE_CATEGORY: Record<string, AdviceCategory> = {
  festival: "ceremony",
  ritual: "ceremony",
  ceremony: "ceremony",
  royal: "ceremony",
  agricultural: "farming",
  fishing: "fishing",
  market: "community",
};
// Categories read from the sourced wording itself.
const WORD_CATEGORY: [RegExp, AdviceCategory][] = [
  [/\b(plant|crop|seed|harvest|garden|kūmara|kumara|taro|banana|sow|weed)/i, "farming"],
  [/\b(fish|eel|crayfish|shellfish|tide|shore|net|squid|octopus)/i, "fishing"],
  [/\b(heal|health|medicine|rest|sleep|illness)/i, "health"],
  [/\b(family|ancestor|elder|lineage|market|community|visit)/i, "community"],
  [/\b(ceremon|ritual|offering|sacred|god|deity|shrine|stool|festival|prayer)/i, "ceremony"],
];

function categoriesFrom(texts: (string | null | undefined)[], extra: (AdviceCategory | undefined)[]): AdviceCategory[] {
  const out = new Set<AdviceCategory>();
  for (const c of extra) if (c) out.add(c);
  for (const t of texts) if (t) for (const [re, c] of WORD_CATEGORY) if (re.test(t)) out.add(c);
  return ADVICE_CATEGORIES.map((c) => c.key).filter((k) => out.has(k));
}

function uniq(list: (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of list) {
    const k = (t ?? "").trim();
    if (!k || seen.has(k.toLowerCase())) continue;
    seen.add(k.toLowerCase());
    out.push(k);
  }
  return out;
}

const PHASE_LABEL: Record<MoonPhaseKey, string> = {
  new: "New Moon",
  first_crescent: "First crescent",
  waxing: "Waxing Moon",
  first_quarter: "First quarter",
  full: "Full Moon",
  waning: "Waning Moon",
  last_quarter: "Last quarter",
  dark: "Dark Moon",
};

/**
 * Everything ahead from `from` (inclusive). `moons` is the calculated Moon for
 * consecutive days starting at `from` (about 35 days covers every phase).
 * Returns dated items in date order, then undated recurring items.
 */
export function adviceAhead(bundle: ResearchBundle, from: CivilDate, moons: DayMoon[]): { dated: AdviceItem[]; undated: AdviceItem[] } {
  const cultures = new Map(bundle.cultures.map((c) => [c.key, c]));
  const systems = new Map(bundle.systems.map((s) => [s.key, s]));
  const sourceByKey = new Map(bundle.sources.map((s) => [s.key, s]));
  const sourcesFor = (claims: [string, string][]) => {
    const keys = new Set<string>();
    for (const [table, key] of claims) for (const c of bundle.citations) if (c.claim_table === table && c.claim_key === key) keys.add(c.source_key);
    return [...keys].flatMap((k) => {
      const s = sourceByKey.get(k);
      return s ? [{ key: s.key, title: s.publisher ? `${s.title} (${s.publisher})` : s.title, url: s.url ?? null }] : [];
    });
  };
  const fromIso = formatIsoDate(from);
  const dated: AdviceItem[] = [];
  const undated: AdviceItem[] = [];

  // 1. Cycle positions: published dates where a source lists them, otherwise
  //    counted from the sourced anchor (provisional); unanchored → undated.
  for (const position of bundle.positions) {
    const cycle = bundle.cycles.find((c) => c.key === position.cycle_key);
    if (!cycle) continue;
    const system = systems.get(cycle.system_key);
    const culture = system ? cultures.get(system.culture_key) : undefined;
    if (!culture) continue;
    const observances = bundle.observances.filter((o) => o.cycle_position_key === position.key);
    const recs = bundle.recommendations.filter((r) => r.cycle_position_key === position.key || observances.some((o) => o.key === r.observance_key));
    const meanings = bundle.meanings.filter((m) => m.subject === "cycle_position" && m.subject_key === position.key);
    const says = uniq([position.meaning, ...observances.map((o) => o.description), ...meanings.map((m) => m.meaning), ...recs.map((r) => r.historical_practice)]);
    if (says.length === 0) continue;
    const base = {
      cultureKey: culture.key,
      cultureName: culture.name,
      region: culture.region ?? null,
      name: position.original_name ?? position.name,
      cycle: `Day ${position.position + 1} of the ${cycle.length_days}-day ${cycle.name}`,
      says,
      modern: uniq(recs.map((r) => r.modern_interpretation)),
      categories: categoriesFrom([...says], [...recs.map((r) => ACTIVITY_CATEGORY[r.activity]), ...observances.map((o) => OBSERVANCE_CATEGORY[o.kind ?? ""])]),
      evidence: [...new Set([...position.evidence, ...observances.flatMap((o) => o.evidence)])] as EvidenceTag[],
      caution: observances.find((o) => o.uncertainty)?.uncertainty ?? cycle.regional_note ?? null,
      group: cycle.key,
      groupLabel: `${culture.name} · ${cycle.name}`,
      order: position.position,
    };
    const claims: [string, string][] = [["calendar_cycle_positions", position.key], ["calendar_cycles", cycle.key], ...observances.map((o) => ["calendar_observances", o.key] as [string, string])];
    const published = bundle.correspondences
      .filter((c) => c.culture_key === culture.key && (!c.system_key || c.system_key === cycle.system_key) && c.gregorian_from && c.gregorian_from >= fromIso)
      .filter((c) => observances.some((o) => o.name === c.label) || c.label === position.name)
      .sort((a, b) => a.gregorian_from!.localeCompare(b.gregorian_from!));
    let next: CivilDate | null = null;
    if (isAnchored(cycle)) {
      const here = cyclePositionOn(cycle, from)!;
      next = addDays(from, (((position.position - here) % cycle.length_days) + cycle.length_days) % cycle.length_days);
    }
    const firstPublished = published[0] ? parseIsoDate(published[0].gregorian_from!) : null;
    if (firstPublished && (!next || compareDates(firstPublished, next) <= 0)) {
      dated.push({ ...base, id: `pos|${position.key}`, date: firstPublished, status: "published", sources: sourcesFor([...claims, ["calendar_date_correspondences", published[0].key]]) });
    } else if (next) {
      const confirmed = published.find((c) => c.gregorian_from === formatIsoDate(next!));
      dated.push({
        ...base,
        id: `pos|${position.key}`,
        date: next,
        status: confirmed ? "published" : "provisional",
        sources: sourcesFor(confirmed ? [...claims, ["calendar_date_correspondences", confirmed.key]] : claims),
      });
    } else {
      undated.push({ ...base, id: `pos|${position.key}`, date: null, status: "undated", sources: sourcesFor(claims) });
    }
  }

  // 2. Published dates that no cycle covers.
  const coveredCultures = new Set(dated.filter((d) => d.id.startsWith("pos|")).map((d) => `${d.cultureKey}|${d.name}`));
  const seenLabel = new Set<string>();
  for (const c of [...bundle.correspondences].sort((a, b) => (a.gregorian_from ?? "").localeCompare(b.gregorian_from ?? ""))) {
    if (!c.gregorian_from || c.gregorian_from < fromIso) continue;
    const culture = cultures.get(c.culture_key);
    if (!culture || coveredCultures.has(`${culture.key}|${c.label}`) || seenLabel.has(`${culture.key}|${c.label}`)) continue;
    const position = bundle.positions.find((p) => p.name === c.label && bundle.cycles.some((cy) => cy.key === p.cycle_key && cy.system_key === c.system_key));
    if (position && dated.some((d) => d.id === `pos|${position.key}`)) continue;
    seenLabel.add(`${culture.key}|${c.label}`);
    const says = uniq([c.notes]);
    dated.push({
      id: `cor|${c.key}`,
      date: parseIsoDate(c.gregorian_from),
      status: "published",
      cultureKey: culture.key,
      cultureName: culture.name,
      region: culture.region ?? null,
      name: c.original_date ?? c.label,
      cycle: c.system_key ? systems.get(c.system_key)?.name ?? "" : "",
      says: says.length ? says : [c.label],
      modern: [],
      categories: categoriesFrom([c.label, c.notes], []),
      evidence: c.evidence as EvidenceTag[],
      sources: sourcesFor([["calendar_date_correspondences", c.key]]),
      caution: c.uncertainty ?? null,
      group: c.system_key ?? culture.key,
      groupLabel: culture.name,
      order: 0,
    });
  }

  // 3. Moon-phase knowledge: the next calculated day of that phase.
  const nextPhaseDay = (phase: MoonPhaseKey) => moons.find((m) => phaseKeysFor(m).includes(phase))?.date ?? null;
  const byPhase = new Map<string, { culture: string; phase: MoonPhaseKey; says: string[]; modern: string[]; cats: (AdviceCategory | undefined)[]; evidence: string[]; claims: [string, string][]; name: string | null }>();
  const slot = (culture: string, phase: MoonPhaseKey) => {
    const k = `${culture}|${phase}`;
    if (!byPhase.has(k)) byPhase.set(k, { culture, phase, says: [], modern: [], cats: [], evidence: [], claims: [], name: null });
    return byPhase.get(k)!;
  };
  for (const m of bundle.meanings) {
    if (m.subject !== "moon_phase" || !m.moon_phase) continue;
    const s = slot(m.culture_key, m.moon_phase);
    s.says.push(m.meaning);
    s.evidence.push(...m.evidence);
    s.claims.push(["calendar_meanings", m.key]);
  }
  for (const o of bundle.observances) {
    if (!o.moon_phase || o.cycle_position_key) continue;
    const s = slot(o.culture_key, o.moon_phase);
    s.name ??= o.original_name ?? o.name;
    s.says.push(o.description ?? o.name);
    s.cats.push(OBSERVANCE_CATEGORY[o.kind ?? ""]);
    s.evidence.push(...o.evidence);
    s.claims.push(["calendar_observances", o.key]);
  }
  for (const r of bundle.recommendations) {
    if (!r.moon_phase || r.cycle_position_key || r.lunar_day_key) continue;
    const s = slot(r.culture_key, r.moon_phase);
    s.says.push(r.historical_practice);
    if (r.modern_interpretation) s.modern.push(r.modern_interpretation);
    s.cats.push(ACTIVITY_CATEGORY[r.activity]);
    s.evidence.push(...r.evidence);
    s.claims.push(["calendar_recommendations", r.key]);
  }
  for (const s of byPhase.values()) {
    const culture = cultures.get(s.culture);
    const date = nextPhaseDay(s.phase);
    if (!culture || !date) continue;
    const says = uniq(s.says);
    dated.push({
      id: `moon|${s.culture}|${s.phase}`,
      date,
      status: "astronomical",
      cultureKey: culture.key,
      cultureName: culture.name,
      region: culture.region ?? null,
      name: s.name ?? PHASE_LABEL[s.phase],
      cycle: PHASE_LABEL[s.phase],
      says,
      modern: uniq(s.modern),
      categories: categoriesFrom(says, s.cats),
      evidence: [...new Set(s.evidence)] as EvidenceTag[],
      sources: sourcesFor(s.claims),
      caution: s.phase === "first_crescent" || s.phase === "dark" ? "Approximate: depends on what is seen locally." : null,
      group: `moon|${culture.key}`,
      groupLabel: culture.name,
      order: 0,
    });
  }

  // 4. Lunar nights of particular calendars: recurring, never given a date.
  const usedObservances = new Set<string>();
  for (const day of bundle.lunarDays) {
    const system = systems.get(day.system_key);
    const culture = system ? cultures.get(system.culture_key) : undefined;
    if (!system || !culture) continue;
    const recs = bundle.recommendations.filter((r) => r.lunar_day_key === day.key);
    const observances = bundle.observances.filter((o) => o.system_key === system.key && o.lunar_day === day.day_number && !o.cycle_position_key);
    for (const o of observances) usedObservances.add(o.key);
    const says = uniq([day.meaning, ...observances.map((o) => o.description), ...recs.map((r) => r.historical_practice)]);
    if (says.length === 0) continue;
    undated.push({
      id: `night|${day.key}`,
      date: null,
      status: "undated",
      cultureKey: culture.key,
      cultureName: culture.name,
      region: culture.region ?? null,
      name: day.original_name ?? day.name ?? "Name not given in the source",
      // "No." rather than "Night": some sources list entries in display order,
      // not by night of the month (the record's caution says so).
      cycle: `No. ${day.day_number} · ${system.name}`,
      says,
      modern: uniq(recs.map((r) => r.modern_interpretation)),
      categories: categoriesFrom(says, [...recs.map((r) => ACTIVITY_CATEGORY[r.activity]), ...observances.map((o) => OBSERVANCE_CATEGORY[o.kind ?? ""])]),
      evidence: [...new Set([...day.evidence, ...recs.flatMap((r) => r.evidence)])] as EvidenceTag[],
      sources: sourcesFor([["calendar_lunar_days", day.key], ...recs.map((r) => ["calendar_recommendations", r.key] as [string, string])]),
      caution: day.uncertainty ?? null,
      group: system.key,
      groupLabel: `${culture.name} · ${system.name}`,
      order: day.day_number,
    });
  }

  // 5. Other observances with no date rule (e.g. a month-end rite).
  for (const o of bundle.observances) {
    if (o.cycle_position_key || o.moon_phase || usedObservances.has(o.key)) continue;
    const culture = cultures.get(o.culture_key);
    if (!culture) continue;
    const system = o.system_key ? systems.get(o.system_key) : undefined;
    const recs = bundle.recommendations.filter((r) => r.observance_key === o.key);
    const says = uniq([o.description, o.timing, ...recs.map((r) => r.historical_practice)]);
    undated.push({
      id: `obs|${o.key}`,
      date: null,
      status: "undated",
      cultureKey: culture.key,
      cultureName: culture.name,
      region: culture.region ?? null,
      name: o.original_name ?? o.name,
      cycle: o.timing ?? system?.name ?? "",
      says: says.length ? says : [o.name],
      modern: uniq(recs.map((r) => r.modern_interpretation)),
      categories: categoriesFrom(says, [OBSERVANCE_CATEGORY[o.kind ?? ""], ...recs.map((r) => ACTIVITY_CATEGORY[r.activity])]),
      evidence: o.evidence as EvidenceTag[],
      sources: sourcesFor([["calendar_observances", o.key], ...recs.map((r) => ["calendar_recommendations", r.key] as [string, string])]),
      caution: o.uncertainty ?? null,
      group: system?.key ?? culture.key,
      groupLabel: system ? `${culture.name} · ${system.name}` : culture.name,
      order: o.lunar_day ?? 99,
    });
  }

  dated.sort((a, b) => daysFromCivil(a.date!) - daysFromCivil(b.date!) || a.cultureName.localeCompare(b.cultureName));
  undated.sort((a, b) => a.groupLabel.localeCompare(b.groupLabel) || a.order - b.order);
  return { dated, undated };
}

export interface AdviceGroup {
  key: string;
  label: string;
  cultureKey: string;
  items: AdviceItem[];
}

/** Undated items as one row per calendar, the fullest calendars first. */
export function groupUndated(items: AdviceItem[]): AdviceGroup[] {
  const groups = new Map<string, AdviceGroup>();
  for (const item of items) {
    const g = groups.get(item.group) ?? { key: item.group, label: item.groupLabel, cultureKey: item.cultureKey, items: [] };
    g.items.push(item);
    groups.set(item.group, g);
  }
  return [...groups.values()].sort((a, b) => b.items.length - a.items.length || a.label.localeCompare(b.label));
}

export function matchesFilter(item: AdviceItem, category: AdviceCategory | "all", culture: string | "all"): boolean {
  return (category === "all" || item.categories.includes(category)) && (culture === "all" || item.cultureKey === culture);
}
