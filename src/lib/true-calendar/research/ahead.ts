// "Next advice from the past": the query layer that turns published research
// into a forward-looking feed, not limited to the next seven days.
//
// Three groups:
//   A. dated     — observances with a traceable Gregorian date: a source lists
//                  it (date_correspondences, with its date_status) or a
//                  sourced cycle anchor counts forward to it (provisional).
//   B. lunar     — knowledge attached to lunar nights or Moon phases. A Moon
//                  phase is calculated (astronomical date); a named night of a
//                  particular calendar is "lunar date pending verification",
//                  because when its month starts is a local rule (iwi differ,
//                  first crescent is not conjunction, Athens set it civically).
//   C. seasonal  — recurring cycles with no verified alignment (the Igbo
//                  market week), observances with no date rule, and seasons of
//                  a tradition's own region.
//
// Nothing is promoted: an item's status says exactly how its date is known.
// Every item comes from an imported, published record. Pure functions.

import { type CivilDate, addDays, compareDates, daysFromCivil, formatIsoDate, parseIsoDate } from "../dates";
import type { DayMoon } from "../astronomy";
import { type ResearchBundle, cyclePositionOn, isAnchored, phaseKeysFor } from "./daily";
import type { Activity, CorrespondenceRecord, DateStatusKey, EvidenceTag, MoonPhaseKey } from "./model";

type Row<R> = Omit<R, "sources">;

export const ADVICE_CATEGORIES = [
  { key: "farming", label: "Farming and gardening" },
  { key: "fishing", label: "Fishing and tides" },
  { key: "food", label: "Food and harvesting" },
  { key: "community", label: "Family and community" },
  { key: "ceremony", label: "Spirituality and ceremonies" },
  { key: "conservation", label: "Conservation and environmental stewardship" },
  { key: "trade", label: "Trade and markets" },
] as const;
export type AdviceCategory = (typeof ADVICE_CATEGORIES)[number]["key"];

/** How strongly the sources stand behind a record, from its evidence tags. */
export const CONFIDENCE_TIERS = [
  { key: "documented", label: "Documented (historical or ethnographic)" },
  { key: "oral", label: "Oral tradition" },
  { key: "reconstruction", label: "Reconstruction or unverified lead" },
  { key: "contested", label: "Contested" },
] as const;
export type ConfidenceTier = (typeof CONFIDENCE_TIERS)[number]["key"];

export type DateStatus = "official" | "secondary" | "astronomical" | "verified" | "provisional" | "lunar_pending" | "recurring" | "disputed";
export const DATE_STATUS_LABELS: Record<DateStatus, string> = {
  official: "Officially published date",
  secondary: "Published secondary-source date",
  astronomical: "Astronomically calculated date",
  verified: "Culturally verified conversion",
  provisional: "Provisional conversion",
  lunar_pending: "Lunar date pending verification",
  recurring: "Undated recurring cycle",
  disputed: "Unknown or disputed",
};
const FROM_DATE_STATUS: Record<DateStatusKey, DateStatus> = {
  official: "official",
  published_secondary: "secondary",
  astronomical: "astronomical",
  culturally_verified: "verified",
  provisional: "provisional",
  unknown_disputed: "disputed",
};
/** A listed date with no stated status is a secondary listing, never official. */
export function statusOfListedDate(c: Pick<Row<CorrespondenceRecord>, "date_status">): DateStatus {
  return c.date_status ? FROM_DATE_STATUS[c.date_status] : "secondary";
}

export type AdviceGroupKey = "dated" | "lunar" | "seasonal";

export interface AdviceSource {
  key: string;
  title: string;
  url: string | null;
}
export interface AdviceClaim {
  text: string;
  sources: AdviceSource[];
}

export interface AdviceItem {
  id: string;
  group: AdviceGroupKey;
  date: CivilDate | null;
  status: DateStatus;
  /** Shown on the left when there is no date: "No. 3", "Day 1 of 4", "Seasons". */
  position: string;
  cultureKey: string;
  cultureName: string;
  region: string | null;
  /** The traditional name, e.g. "Whiro" or "Akwasidae". */
  name: string;
  /** Where it sits, e.g. "No. 1 · Te Papa's maramataka activity sequence". */
  cycle: string;
  /** What the tradition says (historical, sourced). */
  says: string[];
  /** Modern, optional readings, always shown as modern. */
  modern: string[];
  categories: AdviceCategory[];
  evidence: EvidenceTag[];
  tiers: ConfidenceTier[];
  sources: AdviceSource[];
  /** Cautions from the records (variation, source status). */
  caution: string | null;
  /** When accounts disagree: every account, each with its sources. */
  conflicts: AdviceClaim[];
  /** Ordering within its group. */
  order: number;
  systemKey: string | null;
  hasPractice: boolean;
}

const ACTIVITY_CATEGORY: Partial<Record<Activity, AdviceCategory>> = {
  planting: "farming",
  harvesting: "food",
  fishing: "fishing",
  community: "community",
  remembrance: "community",
  trade: "trade",
  ceremony: "ceremony",
};
const OBSERVANCE_CATEGORY: Record<string, AdviceCategory> = {
  festival: "ceremony",
  ritual: "ceremony",
  ceremony: "ceremony",
  royal: "ceremony",
  agricultural: "farming",
  fishing: "fishing",
  market: "trade",
};
// Categories read from the sourced wording itself.
const WORD_CATEGORY: [RegExp, AdviceCategory][] = [
  [/\b(plant|crop|seed|garden|kūmara|kumara|taro|banana|sow|weed|tuber|cultivat|farm|field)/i, "farming"],
  [/\b(fish|eel|crayfish|shellfish|tide|shore|net|squid|octopus|sea)/i, "fishing"],
  [/\b(harvest|gather|food|shellfish|eel|fruit|herb|inundation)/i, "food"],
  [/\b(family|ancestor|elder|lineage|household|community|visit|naming|personal name)/i, "community"],
  [/\b(ceremon|ritual|offering|sacred|god|deity|deities|spirit|shrine|stool|festival|prayer|temple|orisha|kapu|feast)/i, "ceremony"],
  [/\b(recover|conserv|kapu|undisturbed|let resources|scarce|steward|abundance)/i, "conservation"],
  [/\b(market|trade|sell|buy)/i, "trade"],
];

function categoriesFrom(texts: (string | null | undefined)[], extra: (AdviceCategory | undefined)[]): AdviceCategory[] {
  const out = new Set<AdviceCategory>();
  for (const c of extra) if (c) out.add(c);
  for (const t of texts) if (t) for (const [re, c] of WORD_CATEGORY) if (re.test(t)) out.add(c);
  return ADVICE_CATEGORIES.map((c) => c.key).filter((k) => out.has(k));
}

function tiersFrom(evidence: string[]): ConfidenceTier[] {
  const out = new Set<ConfidenceTier>();
  for (const e of evidence) {
    if (e === "historically_documented" || e === "ethnographically_documented" || e === "astronomically_calculated") out.add("documented");
    else if (e === "oral_tradition") out.add("oral");
    else if (e === "scholarly_reconstruction" || e === "unverified_lead") out.add("reconstruction");
    else if (e === "contested") out.add("contested");
  }
  // Only a modern-interpretation tag: a modern reconstruction.
  if (out.size === 0) out.add("reconstruction");
  return CONFIDENCE_TIERS.map((t) => t.key).filter((k) => out.has(k));
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

export interface AdviceFeed {
  dated: AdviceItem[];
  lunar: AdviceItem[];
  seasonal: AdviceItem[];
}

/**
 * Everything ahead from `from` (inclusive). `moons` is the calculated Moon for
 * consecutive days starting at `from` (about 35 days covers every phase).
 */
export function adviceAhead(bundle: ResearchBundle, from: CivilDate, moons: DayMoon[]): AdviceFeed {
  const cultures = new Map(bundle.cultures.map((c) => [c.key, c]));
  const systems = new Map(bundle.systems.map((s) => [s.key, s]));
  const sourceByKey = new Map(bundle.sources.map((s) => [s.key, s]));
  const citesBy = new Map<string, string[]>();
  for (const c of bundle.citations) {
    const k = `${c.claim_table}|${c.claim_key}`;
    citesBy.set(k, [...(citesBy.get(k) ?? []), c.source_key]);
  }
  const sourcesFor = (claims: [string, string][]): AdviceSource[] => {
    const keys = new Set<string>();
    for (const [table, key] of claims) for (const k of citesBy.get(`${table}|${key}`) ?? []) keys.add(k);
    return [...keys].flatMap((k) => {
      const s = sourceByKey.get(k);
      return s ? [{ key: s.key, title: s.publisher ? `${s.title} (${s.publisher})` : s.title, url: s.url ?? null }] : [];
    });
  };
  const cultureBits = (key: string) => {
    const c = cultures.get(key);
    return c ? { cultureKey: c.key, cultureName: c.name, region: c.region ?? null } : null;
  };
  type Rec = (typeof bundle.recommendations)[number];
  const conflictGroups = new Map<string, Rec[]>();
  for (const r of bundle.recommendations) if (r.conflict_group) conflictGroups.set(r.conflict_group, [...(conflictGroups.get(r.conflict_group) ?? []), r]);
  // Every account in the item's conflict groups (its own included), each beside its source.
  const conflictsFor = (recs: Rec[]): AdviceClaim[] => {
    const own = new Set(recs.map((r) => r.key));
    const out: AdviceClaim[] = [];
    const seen = new Set<string>();
    for (const r of recs) {
      if (!r.conflict_group) continue;
      for (const other of conflictGroups.get(r.conflict_group) ?? []) {
        if (seen.has(other.key)) continue;
        seen.add(other.key);
        const where = !own.has(other.key) && other.lunar_day_key ? bundle.lunarDays.find((d) => d.key === other.lunar_day_key) : null;
        const label = where ? `${where.name ?? `No. ${where.day_number}`}: ` : "";
        out.push({ text: `${label}${other.historical_practice}`, sources: sourcesFor([["calendar_recommendations", other.key]]) });
      }
    }
    return out.length > 1 ? out : [];
  };

  const today = formatIsoDate(from);
  const dated: AdviceItem[] = [];
  const lunar: AdviceItem[] = [];
  const seasonal: AdviceItem[] = [];

  // --- Cycle positions: dated when listed or anchored, otherwise seasonal ---
  const placedLabels = new Set<string>();
  for (const position of bundle.positions) {
    const cycle = bundle.cycles.find((c) => c.key === position.cycle_key);
    if (!cycle) continue;
    const system = systems.get(cycle.system_key);
    const culture = system ? cultureBits(system.culture_key) : null;
    if (!system || !culture) continue;
    const observances = bundle.observances.filter((o) => o.cycle_position_key === position.key);
    const recs = bundle.recommendations.filter((r) => r.cycle_position_key === position.key || observances.some((o) => o.key === r.observance_key));
    const meanings = bundle.meanings.filter((m) => m.subject === "cycle_position" && m.subject_key === position.key);
    const says = uniq([position.meaning, ...observances.map((o) => o.description), ...meanings.map((m) => m.meaning), ...recs.map((r) => r.historical_practice)]);
    if (says.length === 0) continue;
    const evidence = [...new Set([...position.evidence, ...observances.flatMap((o) => o.evidence), ...recs.flatMap((r) => r.evidence)])] as EvidenceTag[];
    const claims: [string, string][] = [
      ["calendar_cycle_positions", position.key],
      ["calendar_cycles", cycle.key],
      ...observances.map((o) => ["calendar_observances", o.key] as [string, string]),
      ...recs.map((r) => ["calendar_recommendations", r.key] as [string, string]),
    ];
    const cautions = [...observances.map((o) => o.uncertainty), cycle.regional_note, system.uncertainty];
    const base = {
      ...culture,
      name: position.original_name ?? position.name,
      cycle: `Day ${position.position + 1} of the ${cycle.length_days}-day ${cycle.name}`,
      says,
      modern: uniq(recs.map((r) => r.modern_interpretation)),
      categories: categoriesFrom([...says, system.description], [...recs.map((r) => ACTIVITY_CATEGORY[r.activity]), ...observances.map((o) => OBSERVANCE_CATEGORY[o.kind ?? ""])]),
      evidence,
      tiers: tiersFrom(evidence),
      conflicts: conflictsFor(recs),
      systemKey: system.key,
      hasPractice: recs.length > 0,
    };
    const listed = bundle.correspondences
      .filter((c) => c.culture_key === culture.cultureKey && (!c.system_key || c.system_key === cycle.system_key) && c.gregorian_from && c.gregorian_from >= today)
      .filter((c) => observances.some((o) => o.name === c.label) || c.label === position.name)
      .sort((a, b) => a.gregorian_from!.localeCompare(b.gregorian_from!));
    let next: CivilDate | null = null;
    if (isAnchored(cycle)) {
      const here = cyclePositionOn(cycle, from)!;
      next = addDays(from, (((position.position - here) % cycle.length_days) + cycle.length_days) % cycle.length_days);
    }
    const firstListed = listed[0] ? parseIsoDate(listed[0].gregorian_from!) : null;
    const listedOn = firstListed && (!next || compareDates(firstListed, next) <= 0) ? listed[0] : next ? listed.find((c) => c.gregorian_from === formatIsoDate(next!)) : undefined;
    if (listedOn || next) {
      for (const o of observances) placedLabels.add(`${culture.cultureKey}|${o.name}`);
      placedLabels.add(`${culture.cultureKey}|${position.name}`);
      const date = listedOn ? parseIsoDate(listedOn.gregorian_from!)! : next!;
      dated.push({
        ...base,
        id: `pos|${position.key}`,
        group: "dated",
        date,
        status: listedOn ? statusOfListedDate(listedOn) : "provisional",
        position: "",
        caution: uniq([listedOn?.uncertainty, ...cautions]).join(" ") || null,
        sources: sourcesFor(listedOn ? [...claims, ["calendar_date_correspondences", listedOn.key]] : claims),
        order: daysFromCivil(date),
      });
    } else {
      seasonal.push({
        ...base,
        id: `pos|${position.key}`,
        group: "seasonal",
        date: null,
        status: "recurring",
        position: `Day ${position.position + 1} of ${cycle.length_days}`,
        caution: uniq(cautions).join(" ") || null,
        sources: sourcesFor(claims),
        order: position.position,
      });
    }
  }

  // --- Listed dates that no cycle covers (next one per observance) ---
  const seenLabel = new Set<string>();
  for (const c of [...bundle.correspondences].sort((a, b) => (a.gregorian_from ?? "").localeCompare(b.gregorian_from ?? ""))) {
    if (!c.gregorian_from || c.gregorian_from < today) continue;
    const culture = cultureBits(c.culture_key);
    const label = `${c.culture_key}|${c.label}`;
    if (!culture || placedLabels.has(label) || seenLabel.has(label)) continue;
    seenLabel.add(label);
    const date = parseIsoDate(c.gregorian_from)!;
    const evidence = c.evidence as EvidenceTag[];
    const says = uniq([c.notes]);
    dated.push({
      ...culture,
      id: `cor|${c.key}`,
      group: "dated",
      date,
      status: statusOfListedDate(c),
      position: "",
      name: c.original_date ?? c.label,
      cycle: c.system_key ? systems.get(c.system_key)?.name ?? "" : "",
      says: says.length ? says : [c.label],
      modern: [],
      categories: categoriesFrom([c.label, c.notes], []),
      evidence,
      tiers: tiersFrom(evidence),
      sources: sourcesFor([["calendar_date_correspondences", c.key]]),
      caution: c.uncertainty ?? null,
      conflicts: [],
      order: daysFromCivil(date),
      systemKey: c.system_key ?? null,
      hasPractice: false,
    });
  }

  // --- Moon-phase knowledge: the next calculated day of that phase ---
  const nextPhaseDay = (phase: MoonPhaseKey) => moons.find((m) => phaseKeysFor(m).includes(phase))?.date ?? null;
  type PhaseSlot = { culture: string; phase: MoonPhaseKey; says: string[]; modern: string[]; cats: (AdviceCategory | undefined)[]; evidence: string[]; claims: [string, string][]; name: string | null; recs: Rec[] };
  const byPhase = new Map<string, PhaseSlot>();
  const slot = (culture: string, phase: MoonPhaseKey) => {
    const k = `${culture}|${phase}`;
    if (!byPhase.has(k)) byPhase.set(k, { culture, phase, says: [], modern: [], cats: [], evidence: [], claims: [], name: null, recs: [] });
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
    s.recs.push(r);
  }
  for (const s of byPhase.values()) {
    const culture = cultureBits(s.culture);
    if (!culture) continue;
    const date = nextPhaseDay(s.phase);
    const says = uniq(s.says);
    const approximate = s.phase === "first_crescent" || s.phase === "dark";
    lunar.push({
      ...culture,
      id: `moon|${s.culture}|${s.phase}`,
      group: "lunar",
      date,
      status: date ? "astronomical" : "lunar_pending",
      position: PHASE_LABEL[s.phase],
      name: s.name ?? PHASE_LABEL[s.phase],
      cycle: PHASE_LABEL[s.phase],
      says,
      modern: uniq(s.modern),
      categories: categoriesFrom(says, s.cats),
      evidence: [...new Set(s.evidence)] as EvidenceTag[],
      tiers: tiersFrom(s.evidence),
      sources: sourcesFor(s.claims),
      caution: approximate ? "This is the calculated phase: a first crescent or dark Moon as seen locally can fall a day either side." : null,
      conflicts: conflictsFor(s.recs),
      order: date ? daysFromCivil(date) : Number.MAX_SAFE_INTEGER,
      systemKey: null,
      hasPractice: s.recs.length > 0,
    });
  }

  // --- Lunar nights of particular calendars: pending verification ---
  const usedObservances = new Set<string>();
  const nights: AdviceItem[] = [];
  for (const day of bundle.lunarDays) {
    const system = systems.get(day.system_key);
    const culture = system ? cultureBits(system.culture_key) : null;
    if (!system || !culture) continue;
    const recs = bundle.recommendations.filter((r) => r.lunar_day_key === day.key);
    const observances = bundle.observances.filter((o) => o.system_key === system.key && o.lunar_day === day.day_number && !o.cycle_position_key);
    for (const o of observances) usedObservances.add(o.key);
    const says = uniq([day.meaning, ...observances.map((o) => o.description), ...recs.map((r) => r.historical_practice)]);
    if (says.length === 0) continue;
    const evidence = [...new Set([...day.evidence, ...recs.flatMap((r) => r.evidence), ...observances.flatMap((o) => o.evidence)])] as EvidenceTag[];
    nights.push({
      ...culture,
      id: `night|${day.key}`,
      group: "lunar",
      date: null,
      status: "lunar_pending",
      position: `No. ${day.day_number}`,
      name: day.original_name ?? day.name ?? "Name not given in the source",
      // "No." rather than "Night": some sources list entries in display order,
      // not by night of the month (the record's caution says so).
      cycle: `No. ${day.day_number} · ${system.name}`,
      says,
      modern: uniq(recs.map((r) => r.modern_interpretation)),
      categories: categoriesFrom(says, [...recs.map((r) => ACTIVITY_CATEGORY[r.activity]), ...observances.map((o) => OBSERVANCE_CATEGORY[o.kind ?? ""])]),
      evidence,
      tiers: tiersFrom(evidence),
      sources: sourcesFor([["calendar_lunar_days", day.key], ...recs.map((r) => ["calendar_recommendations", r.key] as [string, string])]),
      caution: uniq([day.uncertainty, ...recs.map((r) => r.uncertainty), system.month_rule]).join(" ") || null,
      conflicts: conflictsFor(recs),
      order: day.day_number,
      systemKey: system.key,
      hasPractice: recs.length > 0,
    });
  }
  // The same named night recorded in two calendars of one culture (Whiro in
  // batch 01's maramataka and in Te Papa's sequence) is one piece of knowledge:
  // one card, with both records' claims and sources.
  const merged = new Map<string, AdviceItem>();
  for (const n of nights) {
    const named = !n.name.startsWith("Name not given");
    const k = named ? `${n.cultureKey}|${n.name.toLowerCase()}` : n.id;
    const prev = merged.get(k);
    if (!prev) {
      merged.set(k, n);
    } else if (prev.systemKey !== n.systemKey) {
      prev.says = uniq([...prev.says, ...n.says]);
      prev.modern = uniq([...prev.modern, ...n.modern]);
      prev.cycle = `${prev.cycle}; ${n.cycle}`;
      prev.categories = ADVICE_CATEGORIES.map((c) => c.key).filter((c) => prev.categories.includes(c) || n.categories.includes(c));
      prev.evidence = [...new Set([...prev.evidence, ...n.evidence])];
      prev.tiers = tiersFrom(prev.evidence);
      prev.sources = [...new Map([...prev.sources, ...n.sources].map((s) => [s.key, s])).values()];
      prev.caution = uniq([prev.caution, n.caution]).join(" ") || null;
      prev.conflicts = [...prev.conflicts, ...n.conflicts];
      prev.hasPractice ||= n.hasPractice;
      prev.systemKey = `${prev.systemKey}+${n.systemKey}`;
    } else {
      merged.set(n.id, n); // the same name on two nights of one calendar: both kept
    }
  }
  lunar.push(...merged.values());

  // --- Observances with no date rule (e.g. a month-end rite) ---
  for (const o of bundle.observances) {
    if (o.cycle_position_key || o.moon_phase || usedObservances.has(o.key)) continue;
    const culture = cultureBits(o.culture_key);
    if (!culture) continue;
    const system = o.system_key ? systems.get(o.system_key) : undefined;
    const isLunar = Boolean(system && (system.kind === "lunar" || system.kind === "lunisolar"));
    const recs = bundle.recommendations.filter((r) => r.observance_key === o.key);
    const says = uniq([o.description, ...recs.map((r) => r.historical_practice)]);
    const evidence = [...new Set([...o.evidence, ...recs.flatMap((r) => r.evidence)])] as EvidenceTag[];
    const item: AdviceItem = {
      ...culture,
      id: `obs|${o.key}`,
      group: isLunar ? "lunar" : "seasonal",
      date: null,
      status: isLunar ? "lunar_pending" : "recurring",
      position: o.lunar_day ? `No. ${o.lunar_day}` : "Recurring",
      name: o.original_name ?? o.name,
      cycle: [o.timing, system?.name].filter(Boolean).join(" · "),
      says: says.length ? says : [o.name],
      modern: uniq(recs.map((r) => r.modern_interpretation)),
      categories: categoriesFrom([...says, o.deities], [OBSERVANCE_CATEGORY[o.kind ?? ""], ...recs.map((r) => ACTIVITY_CATEGORY[r.activity])]),
      evidence,
      tiers: tiersFrom(evidence),
      sources: sourcesFor([["calendar_observances", o.key], ...recs.map((r) => ["calendar_recommendations", r.key] as [string, string])]),
      caution: uniq([o.uncertainty, system?.month_rule]).join(" ") || null,
      conflicts: conflictsFor(recs),
      order: o.lunar_day ?? 31,
      systemKey: system?.key ?? null,
      hasPractice: recs.length > 0,
    };
    (isLunar ? lunar : seasonal).push(item);
  }

  // --- Seasons of a tradition's own region ---
  for (const system of bundle.systems) {
    if (!system.sky_and_seasons) continue;
    const culture = cultureBits(system.culture_key);
    if (!culture) continue;
    const evidence = system.evidence as EvidenceTag[];
    seasonal.push({
      ...culture,
      id: `season|${system.key}`,
      group: "seasonal",
      date: null,
      status: "recurring",
      position: "Seasons",
      name: system.original_name ?? system.name,
      cycle: system.year_rule ?? "",
      says: [system.sky_and_seasons],
      modern: [],
      categories: categoriesFrom([system.sky_and_seasons, system.description], []),
      evidence,
      tiers: tiersFrom(evidence),
      sources: sourcesFor([["calendar_systems", system.key]]),
      caution:
        uniq([system.uncertainty, culture.region ? `These seasons belong to ${culture.region}. They don't carry over to another region's seasons, Zanzibar's included.` : null]).join(" ") || null,
      conflicts: [],
      order: 0,
      systemKey: system.key,
      hasPractice: false,
    });
  }

  dated.sort((a, b) => a.order - b.order || a.cultureName.localeCompare(b.cultureName));
  // Lunar: calculated dates first in date order; then pending nights, those
  // with practical guidance first, taking turns between traditions so one long
  // calendar does not crowd out the rest.
  const lunarDated = lunar.filter((i) => i.date).sort((a, b) => a.order - b.order);
  return { dated, lunar: [...lunarDated, ...takeTurns(lunar.filter((i) => !i.date))], seasonal: takeTurns(seasonal) };
}

function takeTurns(items: AdviceItem[]): AdviceItem[] {
  const out: AdviceItem[] = [];
  for (const practice of [true, false]) {
    const byCulture = new Map<string, AdviceItem[]>();
    for (const i of items.filter((x) => x.hasPractice === practice).sort((a, b) => a.order - b.order)) {
      byCulture.set(i.cultureKey, [...(byCulture.get(i.cultureKey) ?? []), i]);
    }
    const lists = [...byCulture.values()].sort((a, b) => a[0].cultureName.localeCompare(b[0].cultureName));
    for (let i = 0; lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  }
  return out;
}

export interface AdviceFilter {
  category: AdviceCategory | "all";
  culture: string;
  tier: ConfidenceTier | "all";
}

export function matchesFilter(item: AdviceItem, f: AdviceFilter): boolean {
  return (f.category === "all" || item.categories.includes(f.category)) && (f.culture === "all" || item.cultureKey === f.culture) && (f.tier === "all" || item.tiers.includes(f.tier));
}

export function filterFeed(feed: AdviceFeed, f: AdviceFilter): AdviceFeed {
  return { dated: feed.dated.filter((i) => matchesFilter(i, f)), lunar: feed.lunar.filter((i) => matchesFilter(i, f)), seasonal: feed.seasonal.filter((i) => matchesFilter(i, f)) };
}
