// The cultural date-mapping engine: how a tradition's own day (a named lunar
// night, a day of a market week, a published festival) is placed on a
// Gregorian date, and how far that placement can be trusted.
//
// Every culture or regional variant has its own MappingProfile. There is no
// universal rule: a Hawaiian month starts with the first crescent, a Whiro
// month at the dark Moon, some iwi count from the full Moon, an Akan 42-day
// cycle runs from a published anchor, and an Igbo market week has no anchor
// we can defend yet. Non-lunar cycles are never pushed through lunar maths.
//
// Three levels:
//   A  verified   a published date, or a documented calendar anchor, supports
//                 this specific occurrence (shown normally, with its source);
//   B  estimated  a documented sequence aligned to a calculated astronomical
//                 event by a stated assumption (shown with "Approx.");
//   C  unmapped   the meaning is documented but no defensible modern date
//                 exists (kept undated; never given a fictional date).
// A calculation succeeding never makes a record "verified".
//
// Pure functions; the profiles are reviewed code, versioned with the repo.

import { type CivilDate, addDays, civilDateAt, compareDates, daysFromCivil, startOfDayIn } from "../dates";
import { type QuarterKind, quartersBetween } from "../astronomy";

export type MappingLevel = "A" | "B" | "C";
export const MAPPING_LEVELS: Record<MappingLevel, { name: string; short: string; explain: string }> = {
  A: { name: "Verified", short: "Verified", explain: "A published date or a documented calendar anchor supports this occurrence." },
  B: { name: "Estimated", short: "Approx.", explain: "A documented sequence aligned to a calculated Moon event by a stated assumption. The community's own month boundary is not independently verified." },
  C: { name: "Unmapped", short: "Undated", explain: "The meaning is documented, but there is no defensible way yet to place it on a modern date." },
};

export type CycleType = "synodic_lunar" | "day_cycle" | "civil_solar" | "seasonal_month";

/** What the count starts from. */
export type Anchor =
  /** Night 1 = the local date of the astronomical new Moon (conjunction) + offset. */
  | { kind: "conjunction"; offsetDays: number }
  /** Night 1 = the first local evening (at `eveningHour`) when the Moon is at least `minAgeHours` past conjunction: our stand-in for the first visible crescent. */
  | { kind: "first_crescent"; minAgeHours: number; eveningHour: number }
  /** Night 1 = the local date of the full Moon + offset. */
  | { kind: "full_moon"; offsetDays: number }
  /** A fixed-length day cycle counted from a sourced anchor date stored on the cycle record. */
  | { kind: "cycle_anchor" }
  /** No defensible anchor: nothing is dated. */
  | { kind: "none"; needs: string };

export interface MappingProfile {
  key: string;
  /** Profiles that are alternatives for the same records share a group; one is the default. */
  group: string;
  isDefault: boolean;
  label: string;
  cultureKey: string;
  community: string;
  /** Calendar systems (by key) this profile maps. */
  systems: RegExp;
  calendarSystem: string;
  cycleType: CycleType;
  /** Days, or the mean synodic month for a lunar profile. */
  cycleLength: number | null;
  anchor: Anchor;
  monthBoundary: string;
  /** Home region and its timezone: lunar dates are counted from the Moon as it falls there. */
  region: string;
  timezone: string;
  adjustment: string;
  sourceKeys: string[];
  /** The best level this profile can give a record. Published listings can still be A. */
  level: MappingLevel;
  /** Shown instead of "Approx." for a reconstruction rather than a community's practice. */
  illustrative?: boolean;
  /** The record numbers are a display order, not a count of nights. */
  displayOrder?: boolean;
  historicalPeriod: string;
  /** ISO dates; null = open. */
  validFrom: string | null;
  validTo: string | null;
  /** One plain sentence: the assumption, shown behind "More detail". */
  assumption: string;
  /** Advice that does not travel (seasonal farming from another climate). */
  climateNote?: string;
}

const MAORI_SYSTEMS = /^oceania\.maori\.(maramataka|tepapa-sequence|kahungunu-maramataka)$/;

export const MAPPING_PROFILES: MappingProfile[] = [
  {
    key: "maori.whiro-new-moon",
    group: "maori-month",
    isDefault: true,
    label: "Māori: Whiro at the new Moon",
    cultureKey: "oceania.maori",
    community: "Iwi that begin the month with Whiro (Te Papa; Ngāti Kahungunu as recorded by Te Ara)",
    systems: MAORI_SYSTEMS,
    calendarSystem: "Maramataka",
    cycleType: "synodic_lunar",
    cycleLength: 29.53,
    anchor: { kind: "conjunction", offsetDays: 0 },
    monthBoundary: "Whiro, the dark Moon, is night 1.",
    region: "Aotearoa New Zealand",
    timezone: "Pacific/Auckland",
    adjustment: "Iwi correct the count by observing the Moon; the calculated conjunction does not by itself establish the observed first night.",
    sourceKeys: ["src.tepapa-maramataka", "src.tepapa-what-maramataka", "src.teara-maramataka"],
    level: "B",
    historicalPeriod: "Documented 19th century to today",
    validFrom: null,
    validTo: null,
    assumption: "Whiro (night 1) is placed on the date of the calculated new Moon in New Zealand time. Iwi differ, and the observed first night can fall a day either side.",
  },
  {
    key: "maori.full-moon-start",
    group: "maori-month",
    isDefault: false,
    label: "Māori: month counted from the full Moon",
    cultureKey: "oceania.maori",
    community: "Iwi that begin the month at the full Moon (named in our sources only as \"some iwi\")",
    systems: MAORI_SYSTEMS,
    calendarSystem: "Maramataka",
    cycleType: "synodic_lunar",
    cycleLength: 29.53,
    anchor: { kind: "full_moon", offsetDays: 0 },
    monthBoundary: "The month begins at the full Moon.",
    region: "Aotearoa New Zealand",
    timezone: "Pacific/Auckland",
    adjustment: "Which iwi, and how their named nights fall against this start, is not in the imported research.",
    sourceKeys: ["src.tepapa-maramataka", "src.teara-maramataka"],
    level: "B",
    historicalPeriod: "Documented 19th century to today",
    validFrom: null,
    validTo: null,
    assumption: "An alternative model: the sequence's first entry is placed on the date of the calculated full Moon in New Zealand time. Our sources say some iwi start here, but do not give their night-by-night sequence.",
  },
  {
    key: "hawaiian.hilo-crescent",
    group: "hawaiian-month",
    isDefault: true,
    label: "Hawaiian: Hilo at the first crescent",
    cultureKey: "oceania.hawaiian",
    community: "Oʻahu (Kapiʻolani Community College Library guide)",
    systems: /^oceania\.hawaiian\.oahu-lunar-nights$/,
    calendarSystem: "Mahina (Oʻahu lunar nights)",
    cycleType: "synodic_lunar",
    cycleLength: 29.53,
    anchor: { kind: "first_crescent", minAgeHours: 24, eveningHour: 18 },
    monthBoundary: "Hilo, the first night a thin crescent can be seen, opens the month; this is after the astronomical conjunction, not at it.",
    region: "Hawaiʻi",
    timezone: "Pacific/Honolulu",
    adjustment: "Island traditions differ in names and order; the crescent can first be seen one or two evenings after the conjunction.",
    sourceKeys: ["src.kapiolani-oahu-days"],
    level: "B",
    historicalPeriod: "Documented 19th century to today",
    validFrom: null,
    validTo: null,
    assumption: "Hilo (night 1) is placed on the first evening (6 pm Hawaiʻi time) when the Moon is at least a day past the calculated new Moon, our stand-in for the first visible crescent. Weather and sky can move it a day.",
  },
  {
    key: "egyptian.lunar-invisibility",
    group: "egyptian-lunar",
    isDefault: true,
    label: "Ancient Egyptian lunar month",
    cultureKey: "africa.north.ancient-egyptian",
    community: "Pharaonic temple reckoning (one of several)",
    systems: /^africa\.north\.ancient-egyptian\.lunar$/,
    calendarSystem: "Egyptian lunar month",
    cycleType: "synodic_lunar",
    cycleLength: 29.53,
    anchor: { kind: "conjunction", offsetDays: 0 },
    monthBoundary: "The month began on the day the old crescent could no longer be seen (psḏntyw).",
    region: "Egypt",
    timezone: "Africa/Cairo",
    adjustment: "Other Egyptian reckonings existed; this is not the civil calendar.",
    sourceKeys: ["src.stern-2012"],
    level: "B",
    historicalPeriod: "Pharaonic Egypt",
    validFrom: null,
    validTo: null,
    assumption: "Day 1 (psḏntyw) is placed on the date of the calculated new Moon in Egypt. A modern date is a reconstruction of the pattern, not an ancient listing.",
  },
  {
    key: "greek.noumenia-illustrative",
    group: "greek-month",
    isDefault: true,
    label: "Ancient Greek month (illustrative model)",
    cultureKey: "europe.athenian-greek",
    community: "Athens (civic calendar) and Hesiod's Works and Days",
    systems: /^europe\.(athenian|hesiodic)-greek\./,
    calendarSystem: "Greek lunar month",
    cycleType: "synodic_lunar",
    cycleLength: 29.53,
    anchor: { kind: "first_crescent", minAgeHours: 24, eveningHour: 18 },
    monthBoundary: "The Noumenia (day 1) was the day of the first crescent; Athens could fix it by civic decision.",
    region: "Greece",
    timezone: "Europe/Athens",
    adjustment: "Athenian magistrates inserted or dropped days; Hesiod's counts are text-specific. Exact historical civic dates are not established.",
    sourceKeys: ["src.htr-noumenia-epimenia", "src.hesiod-works-days-chs"],
    level: "B",
    illustrative: true,
    historicalPeriod: "Archaic and Classical Greece",
    validFrom: null,
    validTo: null,
    assumption: "An illustrative reconstruction: day 1 (Noumenia) is placed on the first evening (6 pm Greek time) when the Moon is at least a day past the calculated new Moon. It shows where the day would fall in a lunar month today; it does not establish any historical civic date.",
    climateNote: "Hesiod's farming advice belongs to Greek seasons; it does not transfer to tropical climates such as Zanzibar's.",
  },
  {
    key: "akan.adaduanan-anchor",
    group: "akan-adaduanan",
    isDefault: true,
    label: "Akan 42-day Adaduanan",
    cultureKey: "africa.west.akan",
    community: "Asante (published Akwasidae listings)",
    systems: /^africa\.west\.akan\.adaduanan$/,
    calendarSystem: "Adaduanan",
    cycleType: "day_cycle",
    cycleLength: 42,
    anchor: { kind: "cycle_anchor" },
    monthBoundary: "A fixed 42-day cycle (a 6-day and a 7-day week together); no Moon involved.",
    region: "Ghana",
    timezone: "Africa/Accra",
    adjustment: "Published listings are secondary sources, not official confirmation from the Manhyia Palace; dates counted from the anchor are estimates.",
    sourceKeys: ["src.akandictionary-akwasidae-2026", "src.nyamedua-akwasidae-2026"],
    level: "A",
    historicalPeriod: "Documented 18th century to today",
    validFrom: "2026-02-01",
    validTo: null,
    assumption: "Dates are counted forward 42 days at a time from the sourced anchor (1 Feb 2026). A published listing for the date is shown as such; a counted date is an estimate.",
  },
  {
    key: "igbo.market-week-unanchored",
    group: "igbo-market-week",
    isDefault: true,
    label: "Igbo four-day market week (Eke, Orie, Afọ, Nkwọ)",
    cultureKey: "africa.west.igbo",
    community: "Igbo communities (local market days differ)",
    systems: /^africa\.west\.igbo\.market-week$/,
    calendarSystem: "Izu (four-day week)",
    cycleType: "day_cycle",
    cycleLength: 4,
    anchor: { kind: "none", needs: "a community-specific date anchor (which Gregorian day is Eke in that town)" },
    monthBoundary: "No month: a repeating four-day cycle.",
    region: "Southeastern Nigeria",
    timezone: "Africa/Lagos",
    adjustment: "Communities hold their markets on different days of the cycle; one town's Eke is not another's.",
    sourceKeys: ["src.elias-igbo-days", "src.igbo-nkwerre-2022"],
    level: "C",
    historicalPeriod: "Documented 19th century to today",
    validFrom: null,
    validTo: null,
    assumption: "Not dated: we need a community-specific anchor before any Gregorian date can be given.",
  },
  {
    key: "yoruba.ritual-week-unanchored",
    group: "yoruba-ritual-week",
    isDefault: true,
    label: "Yoruba ritual week (Ellis's five-day variant)",
    cultureKey: "africa.west.yoruba",
    community: "Yoruba (Ellis 1894; four-day ọ̀sẹ̀ variants also documented)",
    systems: /^africa\.west\.yoruba\./,
    calendarSystem: "Ọ̀sẹ̀ (ritual week)",
    cycleType: "day_cycle",
    cycleLength: 5,
    anchor: { kind: "none", needs: "an appropriate date anchor for the variant and community" },
    monthBoundary: "No month: a repeating ritual week, never a seven-day Gregorian week.",
    region: "Southwestern Nigeria and Benin",
    timezone: "Africa/Lagos",
    adjustment: "Four-day and five-day counts are both recorded; they are kept as separate variants.",
    sourceKeys: ["src.ellis-yoruba-time"],
    level: "C",
    historicalPeriod: "Documented 19th century",
    validFrom: null,
    validTo: null,
    assumption: "Not dated: no anchor for this variant has been sourced.",
  },
  {
    key: "egyptian.civil-unmapped",
    group: "egyptian-civil",
    isDefault: true,
    label: "Ancient Egyptian civil calendar",
    cultureKey: "africa.north.ancient-egyptian",
    community: "Pharaonic civil administration",
    systems: /^africa\.north\.ancient-egyptian\.(civil|lucky-days)$/,
    calendarSystem: "Civil year (365 days)",
    cycleType: "civil_solar",
    cycleLength: 365,
    anchor: { kind: "none", needs: "the papyrus's specific day and month, and a historical epoch for the wandering civil year" },
    monthBoundary: "Twelve 30-day months plus five extra days; the year drifted against the seasons.",
    region: "Egypt",
    timezone: "Africa/Cairo",
    adjustment: "The civil year slipped a day every four years against the sun; a modern date needs a specific epoch.",
    sourceKeys: ["src.met-telling-time-egypt", "src.bm-lucky-days-papyrus"],
    level: "C",
    historicalPeriod: "Pharaonic Egypt",
    validFrom: null,
    validTo: null,
    assumption: "Not dated: civil-calendar days are not lunar, and no epoch has been sourced for a conversion.",
  },
  {
    key: "hawaiian.seasonal-months-unmapped",
    group: "hawaiian-seasons",
    isDefault: true,
    label: "Hawaiian seasonal months",
    cultureKey: "oceania.hawaiian",
    community: "Hawaiʻi (University of Hawaiʻi compilation)",
    systems: /^oceania\.hawaiian\.seasonal-months$/,
    calendarSystem: "Hawaiian months",
    cycleType: "seasonal_month",
    cycleLength: null,
    anchor: { kind: "none", needs: "a sourced rule for which new Moon opens each month (e.g. the Pleiades rising for Makaliʻi)" },
    monthBoundary: "Months run new Moon to new Moon, named by season; which month is which depends on the stars.",
    region: "Hawaiʻi",
    timezone: "Pacific/Honolulu",
    adjustment: "Hawaiʻi's seasons; not transferable to East Africa.",
    sourceKeys: ["src.uh-hawaiian-lunar-calendar"],
    level: "C",
    historicalPeriod: "Documented 19th century to today",
    validFrom: null,
    validTo: null,
    assumption: "Not dated: no sourced rule says which modern lunar month each name falls on.",
  },
  {
    key: "maori.tuhoe-months-unmapped",
    group: "tuhoe-months",
    isDefault: true,
    label: "Tūhoe months",
    cultureKey: "oceania.maori",
    community: "Tūhoe (Te Ara)",
    systems: /^oceania\.maori\.tuhoe-months$/,
    calendarSystem: "Tūhoe months",
    cycleType: "seasonal_month",
    cycleLength: null,
    anchor: { kind: "none", needs: "a sourced rule for the month that opens the Tūhoe year" },
    monthBoundary: "Named months of the year, tied to Aotearoa's seasons.",
    region: "Aotearoa New Zealand",
    timezone: "Pacific/Auckland",
    adjustment: "Southern-hemisphere seasons; not transferable to Zanzibar.",
    sourceKeys: ["src.teara-maramataka"],
    level: "C",
    historicalPeriod: "Documented 19th century",
    validFrom: null,
    validTo: null,
    assumption: "Not dated: no sourced rule for which new Moon opens which month.",
  },
];

/** Which alternative each group uses: the defaults unless the reader picks another. */
export type MappingChoice = Partial<Record<string, string>>;

export function profileFor(systemKey: string, choice: MappingChoice = {}): MappingProfile | null {
  const matching = MAPPING_PROFILES.filter((p) => p.systems.test(systemKey));
  if (matching.length === 0) return null;
  const group = matching[0].group;
  const chosen = choice[group];
  return matching.find((p) => p.key === chosen) ?? matching.find((p) => p.isDefault) ?? matching[0];
}

/** Profiles with an alternative a reader can choose. */
export function alternativeGroups(): { group: string; profiles: MappingProfile[] }[] {
  const by = new Map<string, MappingProfile[]>();
  for (const p of MAPPING_PROFILES) by.set(p.group, [...(by.get(p.group) ?? []), p]);
  return [...by].filter(([, list]) => list.length > 1).map(([group, profiles]) => ({ group, profiles }));
}

const ANCHOR_QUARTER: Partial<Record<Anchor["kind"], QuarterKind>> = { conjunction: "new", first_crescent: "new", full_moon: "full" };

/**
 * The local dates (in the profile's home timezone) of the Moon events a lunar
 * profile counts from, for months that can reach [from, to].
 */
export function anchorDates(profile: MappingProfile, from: CivilDate, to: CivilDate): CivilDate[] {
  const q = ANCHOR_QUARTER[profile.anchor.kind];
  if (!q) return [];
  // A month before `from` so nights late in the current month are covered.
  const start = startOfDayIn(addDays(from, -32), profile.timezone);
  const end = startOfDayIn(addDays(to, 2), profile.timezone);
  const a = profile.anchor;
  return quartersBetween(start, end)
    .filter((e) => e.kind === q)
    .map((e) => {
      const local = civilDateAt(e.instant, profile.timezone);
      if (a.kind !== "first_crescent") return local;
      // The first evening the Moon is old enough to be seen.
      for (let d = local; ; d = addDays(d, 1)) {
        const evening = startOfDayIn(d, profile.timezone).getTime() + a.eveningHour * 3_600_000;
        if (evening - e.instant.getTime() >= a.minAgeHours * 3_600_000) return d;
      }
    });
}

/**
 * Every Gregorian date in [from, to] on which night/day `n` of a lunar
 * profile falls (n = 0 is the last day before night 1). Empty for a profile
 * that cannot date anything.
 */
export function lunarNightDates(profile: MappingProfile, n: number, from: CivilDate, to: CivilDate, anchors = anchorDates(profile, from, to)): CivilDate[] {
  if (profile.cycleType !== "synodic_lunar" || profile.level === "C") return [];
  const a = profile.anchor;
  if (a.kind !== "conjunction" && a.kind !== "first_crescent" && a.kind !== "full_moon") return [];
  const offset = a.kind === "first_crescent" ? 0 : a.offsetDays;
  const out: CivilDate[] = [];
  for (let i = 0; i < anchors.length; i++) {
    const d = addDays(anchors[i], offset + n - 1);
    // A night past the next month's night 1 belongs to no month (a 29-day month has no night 30).
    const next = anchors[i + 1] ? addDays(anchors[i + 1], offset) : null;
    if (next && compareDates(d, next) >= 0) continue;
    if (compareDates(d, from) >= 0 && compareDates(d, to) <= 0) out.push(d);
  }
  return out;
}

/** Dates of a fixed day cycle from its anchor: position p falls on anchor + p + k·length. */
export function dayCycleDates(anchor: CivilDate, anchorPosition: number, length: number, position: number, from: CivilDate, to: CivilDate): CivilDate[] {
  const base = daysFromCivil(anchor) + (position - anchorPosition);
  const first = daysFromCivil(from);
  const k = Math.ceil((first - base) / length);
  const out: CivilDate[] = [];
  for (let d = base + k * length; d <= daysFromCivil(to); d += length) out.push(addDays(anchor, d - daysFromCivil(anchor)));
  return out;
}
