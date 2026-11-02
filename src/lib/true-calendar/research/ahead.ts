// "Next advice from the past": the query layer that turns published research
// into a forward-looking feed, not limited to the next seven days.
//
// Three groups:
//   A. dated     — observances with a traceable Gregorian date: a source lists
//                  it (date_correspondences, with its date_status) or a
//                  sourced cycle anchor counts forward to it (provisional).
//   B. lunar     — knowledge attached to lunar nights or Moon phases. A Moon
//                  phase is calculated (astronomical date). A named night of a
//                  particular calendar is counted from the calculated new Moon
//                  by a stated rule (status "counted"): when its month really
//                  starts is a local rule (iwi differ, first crescent is not
//                  conjunction, Athens set it civically), so the card says which
//                  rule was used and that the date is our count, not a listing.
//   C. seasonal  — recurring cycles with no verified alignment (the Igbo
//                  market week), observances with no date rule, and seasons of
//                  a tradition's own region.
//
// Nothing is promoted: an item's status says exactly how its date is known.
// Every item comes from an imported, published record. Pure functions.

import { type CivilDate, addDays, compareDates, daysFromCivil, formatIsoDate, parseIsoDate } from "../dates";
import type { DayMoon, QuarterKind } from "../astronomy";
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

export type DateStatus = "official" | "secondary" | "astronomical" | "verified" | "provisional" | "counted" | "lunar_pending" | "recurring" | "disputed";
export const DATE_STATUS_LABELS: Record<DateStatus, string> = {
  official: "Officially published date",
  secondary: "Published secondary-source date",
  astronomical: "Astronomically calculated date",
  verified: "Culturally verified conversion",
  provisional: "Provisional conversion",
  counted: "Approximate lunar alignment (counted from the calculated new Moon; not a verified traditional date)",
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
/** Short labels for the badge on a card. */
export const DATE_STATUS_BADGES: Record<DateStatus, string> = {
  official: "Official date",
  secondary: "Published date",
  astronomical: "Astronomical",
  verified: "Verified date",
  provisional: "Provisional date",
  counted: "Approximate lunar alignment",
  lunar_pending: "Date pending",
  recurring: "Recurring cycle",
  disputed: "Disputed",
};

// How night 1 of each lunar calendar is placed against the calculated new
// Moon. Our counting rule, stated on every card it dates; the first match wins.
// `count: false` keeps a calendar's days undated: Oshi asked (2 Nov 2026,
// batch 07) that ancient Greek lunar days never get Gregorian dates.
const NIGHT_ONE: { match: RegExp; offset: number; rule: string; exact: boolean; count?: false }[] = [
  {
    match: /^oceania\.hawaiian\./,
    offset: 1,
    rule: "night 1 (Hilo) is taken as the first evening after the new Moon, when the first crescent can appear",
    exact: true,
  },
  {
    match: /\.tepapa-sequence$/,
    offset: 0,
    rule: "the first entry (Whiro) is taken as the day of the new Moon and the entries are counted in Te Papa's order, which is not an exact night count, so this date is approximate",
    exact: false,
  },
  { match: /^oceania\.maori\./, offset: 0, rule: "Whiro (night 1) is taken as the day of the new Moon; some iwi begin the month at the full Moon instead", exact: true },
  { match: /^africa\.north\.ancient-egyptian\./, offset: 0, rule: "day 1 is taken as the day of the new Moon, when the old Moon can no longer be seen", exact: true },
  { match: /^europe\.(athenian|hesiodic)-greek\./, offset: 1, rule: "ancient Greek month days are not placed on modern dates", exact: true, count: false },
];
const DEFAULT_NIGHT_ONE: (typeof NIGHT_ONE)[number] = { match: /./, offset: 0, rule: "day 1 is taken as the day of the new Moon", exact: true };
export function nightOneRule(systemKey: string) {
  return NIGHT_ONE.find((r) => r.match.test(systemKey)) ?? DEFAULT_NIGHT_ONE;
}

const SKY_SOURCE: AdviceSource = {
  key: "calc.astronomy-engine",
  title: "Calculated with Astronomy Engine (Don Cross), checked against USNO phase times",
  url: "https://github.com/cosinekitty/astronomy",
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
  /** A lunar night's number in its calendar. */
  night?: number;
  /** Every counted date in the window ahead (a lunar night recurs monthly). */
  dates?: CivilDate[];
  /** The kind of activity the night's practice record names. */
  practice?: AdviceCategory;
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
export function adviceAhead(bundle: ResearchBundle, from: CivilDate, moons: DayMoon[], opts: { monthStart?: CivilDate } = {}): AdviceFeed {
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

  // --- Lunar nights of particular calendars: counted from the new Moon ---
  // The local dates of the new Moons around `from`: the one opening the current
  // lunar month (when given) and every one in the window.
  const newMoons = [...(opts.monthStart ? [opts.monthStart] : []), ...moons.filter((m) => m.quarter?.kind === "new").map((m) => m.date)]
    .filter((d, i, list) => list.findIndex((x) => compareDates(x, d) === 0) === i)
    .sort(compareDates);
  // The last day the Moon window covers: counted nights stop there.
  const horizon = moons.length > 0 ? moons[moons.length - 1].date : from;
  const countAll = (n: number, offset: number) =>
    newMoons.map((nm) => addDays(nm, offset + n - 1)).filter((d) => compareDates(d, from) >= 0 && compareDates(d, horizon) <= 0);
  const countNight = (n: number, offset: number) => {
    const dates = countAll(n, offset);
    return dates.length > 0 ? { date: dates[0], dates } : null;
  };
  const usedObservances = new Set<string>();
  const nights: (AdviceItem & { exact: boolean })[] = [];
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
    const rule = nightOneRule(system.key);
    const counted = rule.count === false ? null : countNight(day.day_number, rule.offset);
    nights.push({
      ...culture,
      id: `night|${day.key}`,
      group: "lunar",
      date: counted?.date ?? null,
      dates: counted?.dates,
      night: day.day_number,
      practice: recs.map((r) => ACTIVITY_CATEGORY[r.activity]).find(Boolean),
      status: counted ? "counted" : "lunar_pending",
      exact: rule.exact,
      position: `No. ${day.day_number}`,
      name: day.original_name ?? day.name ?? `Unnamed night (No. ${day.day_number})`,
      // "No." rather than "Night": some sources list entries in display order,
      // not by night of the month (the record's caution says so).
      cycle: `No. ${day.day_number} · ${system.name}`,
      says,
      modern: uniq(recs.map((r) => r.modern_interpretation)),
      categories: categoriesFrom(says, [...recs.map((r) => ACTIVITY_CATEGORY[r.activity]), ...observances.map((o) => OBSERVANCE_CATEGORY[o.kind ?? ""])]),
      evidence,
      tiers: tiersFrom(evidence),
      sources: sourcesFor([["calendar_lunar_days", day.key], ...recs.map((r) => ["calendar_recommendations", r.key] as [string, string])]),
      caution:
        uniq([
          counted ? `Approximate lunar alignment, counted by us from the calculated new Moon: ${rule.rule}.` : null,
          day.uncertainty,
          ...recs.map((r) => r.uncertainty),
          system.month_rule,
        ]).join(" ") || null,
      conflicts: conflictsFor(recs),
      order: counted ? daysFromCivil(counted.date) : day.day_number,
      systemKey: system.key,
      hasPractice: recs.length > 0,
    });
  }
  // The same named night recorded in two calendars of one culture (Whiro in
  // batch 01's maramataka and in Te Papa's sequence) is one piece of knowledge:
  // one card, with both records' claims and sources.
  // An exact count wins over an approximate one, so it goes first.
  const merged = new Map<string, AdviceItem>();
  for (const { exact: _exact, ...n } of [...nights].sort((a, b) => Number(b.exact) - Number(a.exact))) {
    void _exact;
    const named = !n.name.startsWith("Unnamed night");
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
    const nightNo = o.lunar_day ?? (/last day/i.test(o.timing ?? "") ? 0 : null);
    // A lunar observance on a stated night sits with the lunar nights; a whole
    // month or an unplaced day is a recurring, seasonal item.
    const isLunar = Boolean(system && (system.kind === "lunar" || system.kind === "lunisolar") && nightNo !== null);
    const recs = bundle.recommendations.filter((r) => r.observance_key === o.key);
    const says = uniq([o.description, ...recs.map((r) => r.historical_practice)]);
    const evidence = [...new Set([...o.evidence, ...recs.flatMap((r) => r.evidence)])] as EvidenceTag[];
    // A lunar observance on a stated night: "the last day of the lunar month"
    // is the day before night 1; a lunar_day is counted like a night.
    const rule = system ? nightOneRule(system.key) : DEFAULT_NIGHT_ONE;
    const counted = isLunar && nightNo !== null && rule.count !== false ? countNight(nightNo, rule.offset) : null;
    const item: AdviceItem = {
      ...culture,
      id: `obs|${o.key}`,
      group: isLunar ? "lunar" : "seasonal",
      date: counted?.date ?? null,
      dates: counted?.dates,
      status: counted ? "counted" : isLunar ? "lunar_pending" : "recurring",
      position: o.lunar_day ? `No. ${o.lunar_day}` : "Recurring",
      name: o.original_name ?? o.name,
      cycle: [o.timing, system?.name].filter(Boolean).join(" · "),
      says: says.length ? says : [o.name],
      modern: uniq(recs.map((r) => r.modern_interpretation)),
      categories: categoriesFrom([...says, o.deities], [OBSERVANCE_CATEGORY[o.kind ?? ""], ...recs.map((r) => ACTIVITY_CATEGORY[r.activity])]),
      evidence,
      tiers: tiersFrom(evidence),
      sources: sourcesFor([["calendar_observances", o.key], ...recs.map((r) => ["calendar_recommendations", r.key] as [string, string])]),
      caution:
        uniq([
          counted ? `Approximate lunar alignment, counted by us from the calculated new Moon: ${rule.rule}${nightNo === 0 ? ", and the last day of the month is the day before it" : ""}.` : null,
          o.uncertainty,
          system?.month_rule,
        ]).join(" ") || null,
      conflicts: conflictsFor(recs),
      order: counted ? daysFromCivil(counted.date) : (o.lunar_day ?? 31),
      systemKey: system?.key ?? null,
      hasPractice: recs.length > 0,
    };
    (isLunar ? lunar : seasonal).push(item);
  }

  // --- The calculated New and Full Moons the lunar nights are counted from ---
  if (lunar.length > 0) {
    for (const m of moons) {
      const kind = m.quarter?.kind;
      if (kind !== "new" && kind !== "full") continue;
      lunar.push({
        id: `sky|${kind}|${formatIsoDate(m.date)}`,
        group: "lunar",
        date: m.date,
        status: "astronomical",
        position: "",
        cultureKey: "sky",
        cultureName: "Astronomical",
        region: "Global",
        name: kind === "new" ? "New Moon" : "Full Moon",
        cycle: "",
        says: [
          kind === "new"
            ? "The calculated new Moon. The lunar nights in this list are counted from it."
            : "The calculated full Moon, the middle of the lunar month.",
        ],
        modern: [],
        categories: [],
        evidence: ["astronomically_calculated"],
        tiers: ["documented"],
        sources: [SKY_SOURCE],
        caution: null,
        conflicts: [],
        order: daysFromCivil(m.date) - 0.5, // first on its day
        systemKey: null,
        hasPractice: false,
      });
    }
  }

  // --- Named months of a tradition's year (seasonal, never dated) ---
  for (const m of bundle.months) {
    const system = systems.get(m.system_key);
    const culture = system ? cultureBits(system.culture_key) : null;
    if (!system || !culture) continue;
    const says = uniq([m.description, m.season]);
    if (says.length === 0) continue;
    const evidence = m.evidence as EvidenceTag[];
    seasonal.push({
      ...culture,
      id: `month|${m.key}`,
      group: "seasonal",
      date: null,
      status: "recurring",
      position: `Month ${m.ordinal}`,
      name: m.original_name ?? m.name,
      cycle: `Month ${m.ordinal} · ${system.name}`,
      says,
      modern: [],
      categories: categoriesFrom([...says, m.translation], []),
      evidence,
      tiers: tiersFrom(evidence),
      sources: sourcesFor([["calendar_months", m.key]]),
      caution:
        uniq([
          m.uncertainty,
          system.uncertainty,
          culture.region ? `These months belong to ${culture.region}'s seasons. They don't carry over to another region's seasons, Zanzibar's included.` : null,
        ]).join(" ") || null,
      conflicts: [],
      order: 100 + m.ordinal,
      systemKey: system.key,
      hasPractice: false,
    });
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
  const lunarDated = lunar.filter((i) => i.date).sort((a, b) => a.order - b.order || Number(b.hasPractice) - Number(a.hasPractice) || a.cultureName.localeCompare(b.cultureName));
  return { dated, lunar: [...lunarDated, ...takeTurns(lunar.filter((i) => !i.date))], seasonal: takeTurns(seasonal) };
}

/**
 * The feed as one list, the way the page shows it: listed observances first,
 * then the calculated New and Full Moons, then each tradition's next nights in
 * turn (so one long calendar doesn't fill the first screen), each round in
 * date order; undated cycles last.
 */
export function adviceList(feed: AdviceFeed): AdviceItem[] {
  const all = [...feed.dated, ...feed.lunar, ...feed.seasonal];
  const byDate = (a: AdviceItem, b: AdviceItem) => a.order - b.order || Number(b.hasPractice) - Number(a.hasPractice) || a.cultureName.localeCompare(b.cultureName);
  const listed = feed.dated.filter((i) => i.date).sort(byDate);
  const sky = all.filter((i) => i.cultureKey === "sky").sort(byDate);
  const rest = all.filter((i) => i.date && i.group !== "dated" && i.cultureKey !== "sky");
  const byCulture = new Map<string, AdviceItem[]>();
  for (const i of [...rest].sort((a, b) => Number(a.name.startsWith("Unnamed")) - Number(b.name.startsWith("Unnamed")) || byDate(a, b))) {
    byCulture.set(i.cultureKey, [...(byCulture.get(i.cultureKey) ?? []), i]);
  }
  const rounds: AdviceItem[] = [];
  const lists = [...byCulture.values()];
  for (let r = 0; lists.some((l) => r < l.length); r++) rounds.push(...lists.flatMap((l) => (r < l.length ? [l[r]] : [])).sort(byDate));
  return [...listed, ...sky, ...rounds, ...all.filter((i) => !i.date)];
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

// --- Events: what the page lists ----------------------------------------------
//
// The feed's items, regrouped into dated events in strict date order:
//   • every New Moon, First Quarter, Full Moon and Last Quarter in the range,
//     with the research that falls on that date underneath, grouped by culture
//     (one card per Moon event, however many cultures speak to it);
//   • activity windows: runs of consecutive counted nights in one lunar
//     calendar that share a kind of practical guidance (Kūkahi to Kūpau for
//     planting, the Tangaroa nights for fishing);
//   • single nights with practical guidance that fall in no window and on no
//     Moon event;
//   • observances with a listed or anchored date (Akwasidae).
// Lunar-night dates are counted, so those events say "Approximate lunar
// alignment" and never present the date as a historical observance.

export type EventKind = "moon" | "window" | "night" | "observance";

export interface AdviceEntry {
  item: AdviceItem;
  date: CivilDate;
}

export interface AdviceEvent {
  id: string;
  kind: EventKind;
  date: CivilDate;
  /** Last day of a window. */
  end: CivilDate | null;
  title: string;
  /** For a Moon event: which quarter. */
  quarter: QuarterKind | null;
  /** Culture name, or "Astronomical". */
  cultureName: string;
  cultureKey: string;
  region: string | null;
  status: DateStatus;
  /** The research under the event, practice first. */
  entries: AdviceEntry[];
  categories: AdviceCategory[];
  hasPractice: boolean;
}

export const QUARTER_TITLES: Record<QuarterKind, string> = { new: "New Moon", first: "First Quarter", full: "Full Moon", last: "Last Quarter" };

/** The kind of practical guidance a night is mostly about, in priority order. */
const PRIORITY: AdviceCategory[] = ["farming", "fishing", "food", "conservation", "trade", "ceremony", "community"];
function mainCategory(item: AdviceItem): AdviceCategory | null {
  return item.practice ?? PRIORITY.find((c) => item.categories.includes(c)) ?? null;
}
/** A window is at most a week of nights. */
const WINDOW_MAX = 7;

function datesOf(item: AdviceItem): CivilDate[] {
  return item.dates && item.dates.length > 0 ? item.dates : item.date ? [item.date] : [];
}

const byPractice = (a: AdviceEntry, b: AdviceEntry) =>
  Number(b.item.hasPractice) - Number(a.item.hasPractice) || a.item.cultureName.localeCompare(b.item.cultureName) || (a.item.night ?? 0) - (b.item.night ?? 0);

/**
 * Dated events from `from` for `days` days (inclusive of `from`), in date order.
 * `moons` must cover the range.
 */
export function adviceEvents(feed: AdviceFeed, moons: DayMoon[], from: CivilDate, days: number): AdviceEvent[] {
  const last = addDays(from, days - 1);
  const inRange = (d: CivilDate) => compareDates(d, from) >= 0 && compareDates(d, last) <= 0;
  const all = [...feed.dated, ...feed.lunar, ...feed.seasonal].filter((i) => i.cultureKey !== "sky");
  const events: AdviceEvent[] = [];
  const used = new Set<string>(); // `${item.id}|${iso}` already placed

  // Every dated occurrence of a counted lunar night.
  const nightDates: AdviceEntry[] = all.filter((i) => i.status === "counted").flatMap((item) => datesOf(item).filter(inRange).map((date) => ({ item, date })));

  // 1. Moon events, with the research on that date.
  for (const m of moons) {
    const q = m.quarter?.kind;
    if (!q || !inRange(m.date)) continue;
    const iso = formatIsoDate(m.date);
    const entries = nightDates.filter((e) => formatIsoDate(e.date) === iso).sort(byPractice);
    // Research tied to the phase itself (calculated, so never approximate).
    const phase = all.filter((i) => i.id.startsWith("moon|") && i.date && formatIsoDate(i.date) === iso).map((item) => ({ item, date: m.date }));
    const list = [...phase, ...entries];
    for (const e of list) used.add(`${e.item.id}|${iso}`);
    events.push({
      id: `moon|${q}|${iso}`,
      kind: "moon",
      date: m.date,
      end: null,
      title: QUARTER_TITLES[q],
      quarter: q,
      cultureName: "Astronomical",
      cultureKey: "sky",
      region: "Global",
      status: "astronomical",
      entries: list,
      categories: [...new Set(list.flatMap((e) => e.item.categories))],
      hasPractice: list.some((e) => e.item.hasPractice),
    });
  }

  // 2. Activity windows: consecutive counted nights of one calendar with
  // practical guidance of the same main kind.
  const bySystem = new Map<string, AdviceEntry[]>();
  for (const e of nightDates) {
    if (!e.item.hasPractice || e.item.night === undefined) continue;
    const sys = (e.item.systemKey ?? "").split("+")[0];
    // Only calendars whose numbers are real night counts make windows.
    if (!nightOneRule(sys).exact) continue;
    bySystem.set(sys, [...(bySystem.get(sys) ?? []), e]);
  }
  for (const list of bySystem.values()) {
    list.sort((a, b) => compareDates(a.date, b.date));
    let run: AdviceEntry[] = [];
    const flush = () => {
      if (run.length >= 2) {
        const first = run[0];
        const lastEntry = run[run.length - 1];
        const cat = mainCategory(first.item)!;
        events.push({
          id: `window|${first.item.id}|${formatIsoDate(first.date)}`,
          kind: "window",
          date: first.date,
          end: lastEntry.date,
          title: `${first.item.name} to ${lastEntry.item.name}`,
          quarter: null,
          cultureName: first.item.cultureName,
          cultureKey: first.item.cultureKey,
          region: first.item.region,
          status: "counted",
          entries: run,
          categories: [cat, ...new Set(run.flatMap((e) => e.item.categories).filter((c) => c !== cat))],
          hasPractice: true,
        });
        for (const e of run) used.add(`${e.item.id}|${formatIsoDate(e.date)}`);
      }
      run = [];
    };
    for (const e of list) {
      const prev = run[run.length - 1];
      const cat = mainCategory(e.item);
      const continues = prev && cat && run.length < WINDOW_MAX && mainCategory(prev.item) === cat && daysFromCivil(e.date) - daysFromCivil(prev.date) === 1;
      if (!continues) flush();
      if (cat) run.push(e);
    }
    flush();
  }

  // 3. Other nights with practical guidance, one event per culture per date.
  const singles = new Map<string, AdviceEntry[]>();
  for (const e of nightDates) {
    const iso = formatIsoDate(e.date);
    if (!e.item.hasPractice || used.has(`${e.item.id}|${iso}`)) continue;
    used.add(`${e.item.id}|${iso}`);
    const k = `${e.item.cultureKey}|${iso}`;
    singles.set(k, [...(singles.get(k) ?? []), e]);
  }
  for (const [k, list] of singles) {
    list.sort(byPractice);
    const first = list[0].item;
    const named = list.filter((e) => !e.item.name.startsWith("Unnamed")).map((e) => e.item.name);
    events.push({
      id: `night|${k}`,
      kind: "night",
      date: list[0].date,
      end: null,
      title: named.length > 0 ? named.join(" and ") : `${first.cultureName} lunar night`,
      quarter: null,
      cultureName: first.cultureName,
      cultureKey: first.cultureKey,
      region: first.region,
      status: "counted",
      entries: list,
      categories: [...new Set(list.flatMap((e) => e.item.categories))],
      hasPractice: true,
    });
  }

  // 4. Observances with a listed or anchored date, and any other dated item.
  for (const item of all) {
    if (item.status === "counted" || item.id.startsWith("moon|") || !item.date || !inRange(item.date)) continue;
    events.push({
      id: `obs|${item.id}`,
      kind: "observance",
      date: item.date,
      end: null,
      title: item.name,
      quarter: null,
      cultureName: item.cultureName,
      cultureKey: item.cultureKey,
      region: item.region,
      status: item.status,
      entries: [{ item, date: item.date }],
      categories: item.categories,
      hasPractice: item.hasPractice,
    });
  }

  // Strict date order. On one date: Moon events, then practical guidance in
  // priority order, then the rest.
  const rank = (e: AdviceEvent) => (e.kind === "moon" ? 0 : e.hasPractice ? 1 + PRIORITY.indexOf(e.categories.find((c) => PRIORITY.includes(c)) ?? "community") / 10 : 2);
  return events.sort((a, b) => compareDates(a.date, b.date) || rank(a) - rank(b) || a.title.localeCompare(b.title));
}

/** Events narrowed to a kind of knowledge and a culture. A Moon event stays when any of its research matches. */
export function filterEvents(events: AdviceEvent[], f: AdviceFilter): AdviceEvent[] {
  if (f.category === "all" && f.culture === "all" && f.tier === "all") return events;
  return events.flatMap((e) => {
    const entries = e.entries.filter((x) => matchesFilter(x.item, f));
    if (entries.length === 0) return [];
    return [{ ...e, entries }];
  });
}
