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
import { type QuarterKind, quartersBetween, seasonsOf } from "../astronomy";
import { type Place, type TithiTime, HINDU_MONTHS, hinduFestivalDates, hinduMonths, tithiDates } from "./day-rules";

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
  /** Hindu tithi: the lunar day in force at local sunrise at a stated place (one tithi per 12° of Moon–Sun elongation). */
  | { kind: "tithi"; place: { lat: number; lon: number; height: number; tz: string }; placeName: string }
  /** Chinese twelve day officers: from the day's earthly branch and the solar-term month (see day-rules.ts). */
  | { kind: "jianchu" }
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
  /** Named months of the year: which lunar month is month 1. */
  yearStart?: YearStart;
  /** For a months-only profile: the lunar profile whose months it names. */
  monthsFrom?: string;
}

/** How a tradition's year picks its first month. */
export type YearStart =
  /** Month 1 is the lunar month whose first day is nearest the March equinox (in the profile's timezone). */
  | { kind: "nearest_equinox" }
  /**
   * Month 1 is the lunar month whose night `night` falls nearest a listed
   * date of that year (e.g. the Matariki public holiday, set by the "Tangaroa
   * of Pipiri" method). Years with no listed date are not named.
   */
  | { kind: "listed"; night: number; dates: Record<number, string>; sourceKey: string; label: string; url: string }
  /**
   * Hindu months (amānta): each new-Moon-to-new-Moon month is named by the
   * sidereal sign the Sun enters during it, Caitra for Meṣa; a month the Sun
   * enters no sign in is an extra (adhika) month and gets no ordinal.
   */
  | { kind: "hindu_sankranti" };

/**
 * When in the day almanacs check a festival's tithi (research batch 12): the
 * day the tithi is in force at that time is the festival. Checked against
 * published dates in mapping.test.ts.
 */
export const HINDU_FESTIVAL_TIMES: Record<string, TithiTime> = {
  "asia.south.vedic-hindu.tithi.festival.ugadi-gudi-padwa": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.rama-navami": "midday",
  "asia.south.vedic-hindu.tithi.festival.akshaya-tritiya": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.narasimha-jayanti": "evening",
  "asia.south.vedic-hindu.tithi.festival.hariyali-teej": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.krishna-janmashtami": "midnight",
  "asia.south.vedic-hindu.tithi.festival.nandotsava": "midnight",
  "asia.south.vedic-hindu.tithi.festival.hartalika-teej": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.ganesh-chaturthi": "midday",
  "asia.south.vedic-hindu.tithi.festival.radhashtami": "midday",
  "asia.south.vedic-hindu.tithi.festival.ananta-chaturdashi": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.maha-navami": "midday",
  "asia.south.vedic-hindu.tithi.festival.vijayadashami": "afternoon",
  "asia.south.vedic-hindu.tithi.festival.karva-chauth": "evening",
  "asia.south.vedic-hindu.tithi.festival.govatsa-dvadashi": "evening",
  "asia.south.vedic-hindu.tithi.festival.naraka-chaturdashi": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.diwali": "evening",
  "asia.south.vedic-hindu.tithi.festival.govardhan-puja-bali-pratipada": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.bhai-dooj": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.chhath": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.vivaha-panchami": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.kurma-dvadashi": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.ganesh-jayanti": "midday",
  "asia.south.vedic-hindu.tithi.festival.vasant-panchami": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.ratha-saptami": "sunrise",
  "asia.south.vedic-hindu.tithi.festival.maha-shivaratri": "midnight",
  "asia.south.vedic-hindu.tithi.festival.holika-dahana": "evening"
};

/** Festivals kept as "the day after" another one, whatever the tithi does that day. */
export const HINDU_FESTIVAL_DAY_AFTER: Record<string, string> = {
  "asia.south.vedic-hindu.tithi.festival.nandotsava": "asia.south.vedic-hindu.tithi.festival.krishna-janmashtami",
};

/** The dates of a Hindu yearly festival (by its observance key) between `from` and `to`. */
export function hinduFestivalDatesFor(key: string, monthIndex: number, tithi: number, from: CivilDate, to: CivilDate, place?: Place): CivilDate[] {
  const before = HINDU_FESTIVAL_DAY_AFTER[key];
  if (before) {
    const t = tithi === 1 ? 30 : tithi - 1;
    return hinduFestivalDates(monthIndex, t, HINDU_FESTIVAL_TIMES[before] ?? "sunrise", addDays(from, -1), addDays(to, -1), place)
      .map((d) => addDays(d, 1));
  }
  return hinduFestivalDates(monthIndex, tithi, HINDU_FESTIVAL_TIMES[key] ?? "sunrise", from, to, place);
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
    key: "igbo.nri-market-count",
    group: "igbo-market-week",
    isDefault: true,
    label: "Igbo four-day market week, Nri count",
    cultureKey: "africa.west.igbo",
    community: "Nri (Ịgụ Arọ festival date); other towns' market days can differ",
    systems: /^africa\.west\.igbo\.market-week$/,
    calendarSystem: "Izu (four-day week)",
    cycleType: "day_cycle",
    cycleLength: 4,
    anchor: { kind: "cycle_anchor" },
    monthBoundary: "No month: a repeating four-day cycle.",
    region: "Southeastern Nigeria",
    timezone: "Africa/Lagos",
    adjustment: "Communities hold their markets on different days of the cycle; one town's Eke is not another's. The days are counted from the Nri anchor.",
    sourceKeys: ["src.wikipedia-igbo-calendar", "src.elias-igbo-days"],
    level: "B",
    historicalPeriod: "Documented 19th century to today; anchor 2012",
    validFrom: null,
    validTo: null,
    assumption: "Counted four days at a time from 18 February 2012, recorded as an Nkwọ day for the Nri year-counting festival. Your own town's market may fall on a different day of the cycle.",
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
    key: "maori.tuhoe-months-matariki",
    group: "tuhoe-months",
    isDefault: true,
    label: "Tūhoe months, Pipiri at Matariki",
    cultureKey: "oceania.maori",
    community: "Tūhoe (Te Ara), aligned to the national Matariki dates",
    systems: /^oceania\.maori\.tuhoe-months$/,
    calendarSystem: "Tūhoe months",
    cycleType: "seasonal_month",
    cycleLength: 29.53,
    anchor: { kind: "conjunction", offsetDays: 0 },
    monthBoundary: "Each month runs from Whiro (the new Moon) to the night before the next Whiro. Pipiri, the first month, is the month of Matariki.",
    region: "Aotearoa New Zealand",
    timezone: "Pacific/Auckland",
    adjustment: "Southern-hemisphere seasons; not transferable to Zanzibar. A 13th lunation before the next Pipiri is left unnamed: this list has 12 months and our sources do not say how Tūhoe handled the extra one.",
    sourceKeys: ["src.teara-maramataka", "calc.matariki-dates"],
    level: "B",
    historicalPeriod: "Documented 19th century; Matariki dates 2022 to 2032",
    validFrom: "2022-01-01",
    validTo: "2033-06-30",
    assumption:
      "Pipiri (month 1) is taken as the lunar month (Whiro to Whiro, New Zealand time) whose Tangaroa nights fall nearest the Matariki public holiday. The holiday is set each year by the Matariki Advisory Group's \"Tangaroa of Pipiri\" method; the other months follow in order. Tūhoe's own reckoning may differ.",
    monthsFrom: "maori.whiro-new-moon",
    yearStart: {
      kind: "listed",
      night: 24,
      dates: { 2022: "2022-06-24", 2023: "2023-07-14", 2024: "2024-06-28", 2025: "2025-06-20", 2026: "2026-07-10", 2027: "2027-06-25", 2028: "2028-07-14", 2029: "2029-07-06", 2030: "2030-06-21", 2031: "2031-07-11", 2032: "2032-07-02" },
      sourceKey: "calc.matariki-dates",
      label: "Matariki dates 2022 to 2052 (Matariki Advisory Group, published by MBIE)",
      url: "https://www.mbie.govt.nz/assets/matariki-dates-2022-to-2052-matariki-advisory-group.pdf",
    },
  },
  {
    key: "babylonian.first-crescent-illustrative",
    group: "babylonian-month",
    isDefault: true,
    label: "Babylonian month (illustrative model)",
    cultureKey: "middle-east.babylonian",
    community: "Babylon and Assyria (hemerologies of the 2nd and 1st millennia BCE)",
    systems: /^middle-east\.babylonian\./,
    calendarSystem: "Babylonian lunisolar calendar",
    cycleType: "synodic_lunar",
    cycleLength: 29.53,
    anchor: { kind: "first_crescent", minAgeHours: 24, eveningHour: 18 },
    monthBoundary: "A month began on the evening the new crescent was first seen at sunset; 29 or 30 days.",
    region: "Babylon (Iraq)",
    timezone: "Asia/Baghdad",
    adjustment: "Weather could delay the sighting, and the year was kept in step by inserting an extra month by decree or by the 19-year cycle. Exact ancient dates are not established.",
    sourceKeys: ["src.wikipedia-babylonian-calendar", "src.csmc-hemerologies"],
    level: "B",
    illustrative: true,
    historicalPeriod: "2nd and 1st millennia BCE",
    validFrom: null,
    validTo: null,
    assumption:
      "An illustrative reconstruction: day 1 is the first evening (6 pm Babylon time) when the Moon is at least a day past the calculated new Moon, and Nisānu (month 1) is the month that begins nearest the March equinox; a 13th month in a year is the inserted Addaru II. It shows where the days would fall if the calendar were kept today; it is not an ancient listing.",
    yearStart: { kind: "nearest_equinox" },
  },
  {
    key: "maya.gmt-highland-count",
    group: "maya-count",
    isDefault: true,
    label: "Maya day count (GMT correlation)",
    cultureKey: "americas.maya",
    community: "Highland Guatemalan daykeepers (Kʼicheʼ, Ixil, Mam and others), whose living count agrees with the GMT correlation",
    systems: /^americas\.maya\.(tzolkin|haab)$/,
    calendarSystem: "Tzolkʼin and haabʼ",
    cycleType: "day_cycle",
    cycleLength: 260,
    anchor: { kind: "cycle_anchor" },
    monthBoundary: "No lunar month: 20 day names with 13 numbers (260 days), beside a 365-day year.",
    region: "Guatemala and southern Mexico",
    timezone: "America/Guatemala",
    adjustment: "Communities keeping the count agree with the GMT correlation; some scholars argue for a correlation a day or two different.",
    sourceKeys: ["src.wikipedia-maya-long-count", "src.wikipedia-tzolkin"],
    level: "A",
    historicalPeriod: "Classic Maya inscriptions to today",
    validFrom: null,
    validTo: null,
    assumption: "Counted from 21 December 2012 = 4 Ajaw 3 Kʼankʼin (GMT correlation 584,283), which the highland daykeepers' unbroken count agrees with.",
  },
  {
    key: "akan.six-and-seven-day-weeks",
    group: "akan-weeks",
    isDefault: true,
    label: "Akan six-day and seven-day weeks",
    cultureKey: "africa.west.akan",
    community: "Akan (recorded in Kwahu and Bono; dated by the published Asante Akwasidae listings)",
    systems: /^africa\.west\.akan\.(nnanson|nnawotwe)$/,
    calendarSystem: "Nnanson and nnawɔtwe",
    cycleType: "day_cycle",
    cycleLength: 6,
    anchor: { kind: "cycle_anchor" },
    monthBoundary: "No month: two weeks of six and seven days, together making the 42-day adaduanan.",
    region: "Ghana",
    timezone: "Africa/Accra",
    adjustment: "The seven-day week is the Gregorian week. The six-day week is counted from Akwasidae (Kuru on a Sunday), as in the 42-day grid.",
    sourceKeys: ["src.wikipedia-akan-calendar", "src.akandictionary-akwasidae-2026"],
    level: "A",
    historicalPeriod: "Documented 18th century to today",
    validFrom: null,
    validTo: null,
    assumption: "Akwasidae (1 February 2026, published) is Kuru of the six-day week on a Sunday; the days before and after are counted from it. Bartle's 1978 dates count to the same days.",
  },
  {
    key: "chinese.jianchu-qing-rule",
    group: "chinese-officers",
    isDefault: true,
    label: "Chinese day officers (Qing almanac rule)",
    cultureKey: "asia.east.chinese",
    community: "Chinese almanacs (Tongshu) since the Qing dynasty",
    systems: /^asia\.east\.chinese\.jianchu$/,
    calendarSystem: "建除 (twelve day officers)",
    cycleType: "day_cycle",
    cycleLength: 12,
    anchor: { kind: "jianchu" },
    monthBoundary: "Solar-term months: each opens at a 'jie' term (Lichun at 315° of the Sun's longitude, Jingzhe at 345°…), when the officer repeats.",
    region: "China",
    timezone: "Asia/Shanghai",
    adjustment: "Worked out in China time; an almanac printed for another time zone can differ by a day only on the day a solar term begins.",
    sourceKeys: ["src.zhwiki-jianchu", "src.wikipedia-sexagenary-cycle"],
    level: "B",
    historicalPeriod: "3rd century BCE to today (this rule: Qing, 1741)",
    validFrom: null,
    validTo: null,
    assumption: "The day whose earthly branch matches the solar-term month's branch is Jian; the other officers follow in order, and the officer repeats on the day a new month begins. Day branches are counted from 1 October 1949 (甲子), and the months from the Sun's calculated position.",
  },
  {
    key: "hindu.tithi-ujjain-sunrise",
    group: "hindu-tithi",
    isDefault: true,
    label: "Hindu tithi at sunrise (Ujjain)",
    cultureKey: "asia.south.vedic-hindu",
    community: "Hindu pañcāṅga (almanacs); calculated for Ujjain",
    systems: /^asia\.south\.vedic-hindu\.tithi$/,
    calendarSystem: "Tithi",
    cycleType: "synodic_lunar",
    cycleLength: 29.53,
    anchor: { kind: "tithi", place: { lat: 23.18, lon: 75.78, height: 490, tz: "Asia/Kolkata" }, placeName: "Ujjain" },
    monthBoundary: "Thirty tithis: the bright half ends at the full Moon (Pūrṇimā), the dark half at the new Moon (Amāvasyā).",
    region: "India",
    timezone: "Asia/Kolkata",
    adjustment: "Each city's almanac uses its own sunrise, and traditional almanacs may use the older Sūrya Siddhānta reckoning; the tithi of a day can differ by one near a boundary.",
    sourceKeys: ["src.wikipedia-tithi", "src.wikipedia-paksha"],
    level: "B",
    historicalPeriod: "Vedic period to today",
    validFrom: null,
    validTo: null,
    assumption: "The tithi of a day is the one in force at sunrise in Ujjain, the traditional meridian of Indian astronomy, calculated from the true positions of the Sun and Moon (one tithi for each 12° the Moon gains on the Sun). Months run new Moon to new Moon (amānta) and take the name of the sidereal sign (Lahiri) the Sun enters during them; a yearly festival falls on the day its tithi is in force at the time of day almanacs use for it.",
    yearStart: { kind: "hindu_sankranti" },
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
  // A tithi is the lunar day at sunrise, worked out day by day (it can skip or repeat).
  if (a.kind === "tithi") return tithiDates(n === 0 ? 30 : n, from, to, a.place);
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

export interface MonthSpan {
  /** 1 = the tradition's first month; above 12 an extra month (e.g. Addaru II). Null when the year start is unknown, or for a Hindu adhika month. */
  ordinal: number | null;
  /** The name of an extra month that has no ordinal of its own (a Hindu adhika month). */
  extra?: string;
  /** First and last local dates of the month. */
  start: CivilDate;
  end: CivilDate;
}

/**
 * The tradition's named months overlapping [from, to], each a lunar month of
 * the profile (or of `monthsFrom`). Empty when the profile cannot place months.
 */
export function monthSpans(profile: MappingProfile, from: CivilDate, to: CivilDate): MonthSpan[] {
  if (!profile.yearStart || profile.level === "C") return [];
  if (profile.yearStart.kind === "hindu_sankranti") {
    const place = profile.anchor.kind === "tithi" ? profile.anchor.place : undefined;
    return hinduMonths(from, to, place).map((m) => ({ ordinal: m.adhika ? null : m.index + 1, start: m.start, end: m.end, ...(m.adhika ? { extra: `Adhika ${HINDU_MONTHS[m.index]}` } : {}) }));
  }
  const lunar = profile.monthsFrom ? MAPPING_PROFILES.find((p) => p.key === profile.monthsFrom) : profile;
  if (!lunar) return [];
  const a = lunar.anchor;
  const offset = a.kind === "conjunction" || a.kind === "full_moon" ? a.offsetDays : 0;
  // Far enough back to find the start of the current year.
  const firsts = anchorDates(lunar, addDays(from, -420), addDays(to, 40)).map((d) => addDays(d, offset));
  if (firsts.length < 2) return [];
  const ys = profile.yearStart;
  const starts = new Set<number>();
  for (let y = from.year - 2; y <= to.year + 1; y++) {
    let target: CivilDate | null = null;
    if (ys.kind === "nearest_equinox") {
      const eq = seasonsOf(y).find((e) => e.kind === "march-equinox");
      target = eq ? civilDateAt(eq.instant, lunar.timezone) : null;
    } else {
      const listed = ys.dates[y];
      target = listed ? addDays(civilFromIso(listed), -(ys.night - 1)) : null;
    }
    if (!target) continue;
    let best = -1;
    for (let i = 0; i < firsts.length - 1; i++) {
      if (best < 0 || Math.abs(daysFromCivil(firsts[i]) - daysFromCivil(target)) < Math.abs(daysFromCivil(firsts[best]) - daysFromCivil(target))) best = i;
    }
    // Only a month the anchors actually cover (not the window's edge).
    if (best >= 0 && Math.abs(daysFromCivil(firsts[best]) - daysFromCivil(target)) <= 20) starts.add(best);
  }
  const out: MonthSpan[] = [];
  let since: number | null = null;
  for (let i = 0; i < firsts.length - 1; i++) {
    if (starts.has(i)) since = i;
    const start = firsts[i];
    const end = addDays(firsts[i + 1], -1);
    if (compareDates(end, from) < 0 || compareDates(start, to) > 0) continue;
    const n = since === null ? null : i - since + 1;
    out.push({ ordinal: n !== null && n <= 13 ? n : null, start, end });
  }
  return out;
}

function civilFromIso(iso: string): CivilDate {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}
