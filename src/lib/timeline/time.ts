// The timeline's number line.
//
// This module is the application-side mirror of how supabase/migrations/
// …_timeline_core.sql and …_timeline_v1_hardening.sql store time, and the only
// place allowed to know how a year becomes a pixel or a sentence.
//
// WHY NOT Date / timestamptz
//
// A JavaScript Date tops out around ±273,000 years from 1970 and a Postgres
// timestamptz around ±294,000 — both far short of "the Earth formed", never
// mind "the Big Bang". Worse, both carry a calendar: there was no October in
// 4,000,000,000 BCE, and pretending otherwise is a lie the data model would
// force every reader to believe.
//
// SO: an ASTRONOMICAL YEAR NUMBER held as a plain double.
//
//     1 CE = 1        1 BCE = 0        2 BCE = -1        44 BCE = -43
//
// Astronomical numbering (rather than a positive year plus a BCE/CE flag) is
// what makes arithmetic work across the year historians don't have: 1 BCE to
// 1 CE is 1 − 0 = one year, with no branch and no off-by-one. Era is then a
// fact about the number — see eraOf — not a second field that can contradict
// it. Every user-facing string goes back through eraYearOf, so no year zero
// ever reaches a reader.
//
// A double carries 53 bits of mantissa, so every whole year back to the Big
// Bang is exact (integers are exact to 2^53 ≈ 9.0e15) and the fraction still
// resolves to about a minute at 13.8e9. One representation, whole span.
//
// THREE THINGS THAT ARE NOT THE SAME, AND ARE KEPT APART
//
//   1. The numeric POSITION, which is what the axis draws against.
//   2. The NORMALISED display, derived from the position, the unit the source
//      used and the decimals it gave — see formatClaimDate.
//   3. The source's ORIGINAL WORDING, stored verbatim and never derived.
//
// The rule the whole module serves: preserve the precision the source actually
// supplied. Do not invent precision it did not give, and do not round away
// precision it did. Age is not a reason to round — "66.043 ± 0.011 million
// years ago" stays exactly that.

// ---------------------------------------------------------------------------
// The span
// ---------------------------------------------------------------------------

// A little older than the usual 13.787 Ga figure, so the earliest thing anyone
// can claim still has axis to its left. This is scaffolding for the view, NOT a
// cosmology: nothing in the product asserts when the universe began — that is
// an event with date claims and sources like any other.
export const TIMELINE_MIN_YEAR = -13_900_000_000;
// Room for planned missions and predicted eclipses without letting a typo put
// an event a million years out.
export const TIMELINE_MAX_YEAR = 3000;

// "Before Present" in the sciences means before 1950 — radiocarbon's zero,
// fixed so a published date doesn't drift as the years pass. Deep-time claims
// entered as "years ago" are converted against this, not against today.
export const BP_REFERENCE_YEAR = 1950;

// The narrowest window the viewport will zoom to: about three days. Below that
// the axis would claim a resolution the data model doesn't carry.
export const MIN_WINDOW_YEARS = 0.008;

export type Era = "BCE" | "CE";

// ---------------------------------------------------------------------------
// Precision: the unit the source used, and how many decimals it gave in it
//
// The previous model had a single "precision" enum that conflated how coarse a
// claim is with how old it is — so anything deep-time was rounded on the way to
// the screen and "66.043 ± 0.011 Ma" came out as "66 million years ago". That
// is the system inventing a coarseness the source never asked for.
//
// Now: a UNIT (what the source counted in) plus DECIMALS (how many places it
// gave in that unit). Together they say exactly what to print and exactly how
// wide the claim is, and neither is ever inferred from the age of the thing.
// ---------------------------------------------------------------------------

export const DATE_UNITS = [
  { key: "day", label: "Exact date", years: 1 / 365.2425, decimals: false, hint: "A known day — 14 October 1066." },
  { key: "month", label: "Month", years: 1 / 12, decimals: false, hint: "The month is known, the day isn't." },
  { key: "year", label: "Year", years: 1, decimals: false, hint: "A single year — 1066 CE, 2560 BCE." },
  { key: "decade", label: "Decade", years: 10, decimals: false, hint: "Somewhere in a ten-year window." },
  { key: "century", label: "Century", years: 100, decimals: false, hint: "Somewhere in a hundred-year window." },
  { key: "millennium", label: "Millennium", years: 1000, decimals: false, hint: "Somewhere in a thousand-year window." },
  { key: "thousand_years", label: "Thousands of years ago", years: 1000, decimals: true, hint: "Counted back from the present — “12,000 years ago”." },
  { key: "million_years", label: "Millions of years ago", years: 1_000_000, decimals: true, hint: "Deep time — “66.043 million years ago”." },
  { key: "billion_years", label: "Billions of years ago", years: 1_000_000_000, decimals: true, hint: "“13.799 billion years ago”." },
] as const;

export type DateUnit = (typeof DATE_UNITS)[number]["key"];

const UNIT_BY_KEY = new Map(DATE_UNITS.map((unit) => [unit.key as string, unit]));

export function dateUnit(key: string | null | undefined) {
  return UNIT_BY_KEY.get(key ?? "") ?? DATE_UNITS[2];
}

export function dateUnitLabel(key: string | null | undefined): string {
  return dateUnit(key).label;
}

/** True for the units a source states with decimals ("13.799 Ga"), false for calendar ones. */
export function unitTakesDecimals(key: string | null | undefined): boolean {
  return dateUnit(key).decimals;
}

// ---------------------------------------------------------------------------
// Converting to and from the ways people actually write dates
// ---------------------------------------------------------------------------

export function eraOf(astronomicalYear: number): Era {
  return astronomicalYear <= 0 ? "BCE" : "CE";
}

/** "44 BCE" → −43. "1066 CE" → 1066. The inverse of eraYearOf. */
export function astronomicalFromEra(year: number, era: Era): number {
  return era === "BCE" ? 1 - year : year;
}

/** −43 → { year: 44, era: "BCE" }. The number as a person would say it, with no year zero. */
export function eraYearOf(astronomicalYear: number): { year: number; era: Era } {
  return astronomicalYear <= 0
    ? { year: 1 - astronomicalYear, era: "BCE" }
    : { year: astronomicalYear, era: "CE" };
}

/** 13.8 billion years ago → the astronomical year it lands on. */
export function astronomicalFromYearsAgo(yearsAgo: number): number {
  return BP_REFERENCE_YEAR - yearsAgo;
}

export function yearsAgoOf(astronomicalYear: number): number {
  return BP_REFERENCE_YEAR - astronomicalYear;
}

/**
 * Fold year + optional month + optional day into the single axis position the
 * timeline draws against. MUST match the generated start_position/end_position
 * columns — the database computes this for stored rows, this computes it for
 * rows being previewed before they are saved.
 */
export function positionOf(year: number, month?: number | null, day?: number | null): number {
  let position = year;
  if (month != null) position += (month - 1) / 12;
  if (day != null) position += (day - 1) / 365.2425;
  return position;
}

/** Today, as an astronomical year with the fraction of the year elapsed. */
export function presentPosition(now: Date = new Date()): number {
  const year = now.getUTCFullYear();
  const startOfYear = Date.UTC(year, 0, 1);
  const startOfNext = Date.UTC(year + 1, 0, 1);
  return year + (now.getTime() - startOfYear) / (startOfNext - startOfYear);
}

// ---------------------------------------------------------------------------
// Saying a year out loud
// ---------------------------------------------------------------------------

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * A year, written as years are written: 1066 and 2026 plain, 300,001 BCE
 * grouped. Four digits is the boundary every history book uses — "1,066 CE"
 * reads as a quantity rather than a date, and "10000 BCE" is unreadable.
 */
function writeYear(value: number): string {
  const rounded = Math.round(value);
  return Math.abs(rounded) >= 10_000 ? rounded.toLocaleString("en-GB") : String(rounded);
}

/** Grouping for quantities — a count of years, not a year. */
function withThousands(value: number): string {
  return Math.round(value).toLocaleString("en-GB");
}

function ordinal(value: number): string {
  const remainderHundred = value % 100;
  if (remainderHundred >= 11 && remainderHundred <= 13) return `${value}th`;
  switch (value % 10) {
    case 1: return `${value}st`;
    case 2: return `${value}nd`;
    case 3: return `${value}rd`;
    default: return `${value}th`;
  }
}

/**
 * One year as a calendar year. Deep time never comes through here — it is
 * written in its own unit by formatClaimDate, because nobody says
 * "4,540,000,000 BCE".
 */
export function formatYear(astronomicalYear: number, options: { compact?: boolean } = {}): string {
  const compact = options.compact ?? false;
  const ago = yearsAgoOf(astronomicalYear);

  // Only the ruler reaches this branch: an axis tick at −65,000,000 has to say
  // something, and "65,000,001 BCE" is not it. A claim in this territory is
  // rendered from its own unit and decimals instead.
  if (ago >= 1_000_000) {
    let [value, unit] = ago >= 1_000_000_000 ? [ago / 1_000_000_000, "billion"] : [ago / 1_000_000, "million"];
    let text = trimZeros(value >= 10 ? value.toFixed(1) : value.toFixed(2));

    // ROUNDING CAN CROSS THE UNIT BOUNDARY. 999,997,971 years is under a
    // billion, so it takes the millions branch — and then rounds to 1000,
    // printing "1000 million years ago" where every reader expects "1 billion".
    // Promoting after the rounding rather than before it is what fixes it: the
    // decision has to be made on the number that will actually be shown.
    if (unit === "million" && Number(text) >= 1000) {
      value = value / 1000;
      unit = "billion";
      text = trimZeros(value >= 10 ? value.toFixed(1) : value.toFixed(2));
    }

    return compact ? `${text} ${unit === "billion" ? "bya" : "mya"}` : `${text} ${unit} years ago`;
  }

  const { year, era } = eraYearOf(astronomicalYear);
  if (era === "BCE") return `${writeYear(year)} BCE`;
  // CE is implicit for anything a reader would recognise as a modern year, and
  // spelled out for the first millennium, where "79" alone means nothing.
  return year < 1000 || !compact ? `${writeYear(year)} CE` : writeYear(year);
}

/** "8.00" → "8", "13.80" → "13.8", "4.54" → "4.54". */
function trimZeros(text: string): string {
  return text.includes(".") ? text.replace(/\.?0+$/, "") : text;
}

/** A full calendar date where one is known: "14 October 1066 CE". */
export function formatDateParts(
  year: number,
  month?: number | null,
  day?: number | null,
  options: { compact?: boolean } = {}
): string {
  const yearText = formatYear(year, options);
  if (month == null) return yearText;
  const monthName = MONTHS[Math.min(11, Math.max(0, month - 1))];
  return day == null ? `${monthName} ${yearText}` : `${day} ${monthName} ${yearText}`;
}

// ---------------------------------------------------------------------------
// A claim
// ---------------------------------------------------------------------------

/** The parts of a date claim this module reasons about. A row satisfies it as-is. */
export type ClaimTimeParts = {
  start_year: number;
  start_month: number | null;
  start_day: number | null;
  end_year: number | null;
  end_month: number | null;
  end_day: number | null;
  /** A DATE_UNITS key. */
  date_precision: string;
  /** Decimal places the source gave in that unit. */
  precision_decimals: number;
  is_approximate: boolean;
  /** Source-stated tolerance, in years. Null when the source gave none. */
  uncertainty_plus: number | null;
  uncertainty_minus: number | null;
  /** Verbatim source wording. Never derived from the numbers above. */
  original_date_text: string;
};

/**
 * How wide one claim is, in years, from its precision alone.
 *
 * The unit divided by ten to the decimals: a source that says 13.799 Ga has
 * resolved it to a thousandth of a billion years, so the claim is a million
 * years wide — not the hundred million a bare "billions" would have implied.
 * This is the whole of "don't round away legitimate precision": more decimals
 * from the source means a narrower claim, and the system never widens it back.
 */
export function claimGranularityYears(claim: Pick<ClaimTimeParts, "date_precision" | "precision_decimals">): number {
  const unit = dateUnit(claim.date_precision);
  return unit.years / Math.pow(10, Math.max(0, claim.precision_decimals ?? 0));
}

export type IntervalKind = "point" | "range" | "tolerance";

/**
 * The stretch of time a claim actually allows, and why it has width.
 *
 * The three kinds are genuinely different assertions and are never merged:
 *   point     — one moment, resolved to the granularity of its unit.
 *   range     — "2600–2500 BCE": somewhere in there, the source doesn't narrow it.
 *   tolerance — "13.799 ± 0.021 Ga": one moment, measured, with a stated error.
 *
 * A POINT STILL HAS WIDTH, and getting that wrong is what made "14 October
 * 1066" and "1067" look 0.2 years apart: a claim of "1067" is not the instant
 * 1067.0, it is the whole of the year 1067, and two claims in different years
 * disagree by about a year however the earlier one is worded.
 *
 * Where that width sits depends on what the unit means. A calendar unit NAMES a
 * period and its position is that period's start, so the window runs forward
 * from it — the year 1067 is [1067, 1068]. A deep-time unit reports a
 * MEASUREMENT rounded to some number of places, so its window straddles the
 * value: 4.54 Ga means 4.54 ± 0.005 Ga, not 4.54 to 4.55.
 */
export function claimInterval(claim: ClaimTimeParts): {
  lo: number;
  hi: number;
  kind: IntervalKind;
  granularity: number;
} {
  const start = positionOf(claim.start_year, claim.start_month, claim.start_day);
  const granularity = claimGranularityYears(claim);

  if (claim.end_year != null) {
    return { lo: start, hi: positionOf(claim.end_year, claim.end_month, claim.end_day), kind: "range", granularity };
  }
  if (claim.uncertainty_plus != null || claim.uncertainty_minus != null) {
    return {
      lo: start - (claim.uncertainty_minus ?? claim.uncertainty_plus ?? 0),
      hi: start + (claim.uncertainty_plus ?? claim.uncertainty_minus ?? 0),
      kind: "tolerance",
      granularity,
    };
  }
  if (dateUnit(claim.date_precision).decimals) {
    // A rounded measurement: the window straddles the reported value.
    return { lo: start - granularity / 2, hi: start + granularity / 2, kind: "point", granularity };
  }
  // A named calendar period: the window runs forward from its start.
  return { lo: start, hi: start + granularity, kind: "point", granularity };
}

/** Where a claim sits when it has to be one number — the middle of what it allows. */
export function claimMidpoint(claim: ClaimTimeParts): number {
  const { lo, hi } = claimInterval(claim);
  return (lo + hi) / 2;
}

/** Kept for the layout, which draws the claim's own footprint. */
export function claimSpan(claim: ClaimTimeParts): { from: number; to: number; isRange: boolean } {
  const { lo, hi, kind } = claimInterval(claim);
  return { from: lo, to: hi, isRange: kind !== "point" };
}

// ---------------------------------------------------------------------------
// Writing a claim out
// ---------------------------------------------------------------------------

function formatDeepTime(astronomicalYear: number, unitKey: string, decimals: number, plusMinusYears: number | null): string {
  const unit = dateUnit(unitKey);
  const ago = yearsAgoOf(astronomicalYear);

  // "12,000 years ago" is how anyone actually says a thousands-scale date, so
  // that unit prints in plain years and lets its decimals control how many of
  // them are significant: 0 decimals rounds to the thousand, 1 to the hundred.
  if (unit.key === "thousand_years") {
    const granularity = 1000 / Math.pow(10, decimals);
    const rounded = Math.round(ago / granularity) * granularity;
    const text = `${withThousands(rounded)} years ago`;
    return plusMinusYears != null ? `${withThousands(rounded)} ± ${withThousands(plusMinusYears)} years ago` : text;
  }

  const word = unit.key === "billion_years" ? "billion" : "million";
  const value = (ago / unit.years).toFixed(decimals);
  if (plusMinusYears == null) return `${value} ${word} years ago`;
  return `${value} ± ${(plusMinusYears / unit.years).toFixed(decimals)} ${word} years ago`;
}

function formatCalendarPoint(claim: ClaimTimeParts, year: number, month: number | null, day: number | null): string {
  const unit = dateUnit(claim.date_precision);
  const { year: eraYear, era } = eraYearOf(year);

  switch (unit.key) {
    case "day":
      return formatDateParts(year, month, day);
    case "month":
      return formatDateParts(year, month, null);
    case "decade": {
      // The decade a year falls in, said the way people say it. Anchored on the
      // era year, so the BCE side counts the way historians count it.
      const start = Math.floor(eraYear / 10) * 10;
      return era === "BCE" ? `${writeYear(start)}s BCE` : `${writeYear(start)}s`;
    }
    case "century":
      return `${ordinal(Math.ceil(eraYear / 100))} century ${era}`;
    case "millennium":
      return `${ordinal(Math.ceil(eraYear / 1000))} millennium ${era}`;
    default:
      return formatDateParts(year, null, null);
  }
}

/**
 * The NORMALISED date — always derived from the numbers, so it can never
 * disagree with where the claim sits on the axis.
 *
 * The source's own wording is a separate field and a separate line on screen
 * (see claimOriginalText). Letting an author type a label that overrides this
 * one was the previous design, and a caption that can contradict the position
 * underneath it is a bug with a nice font.
 */
export function formatClaimDate(claim: ClaimTimeParts): string {
  const unit = dateUnit(claim.date_precision);
  const decimals = Math.max(0, claim.precision_decimals ?? 0);
  const prefix = claim.is_approximate ? "c. " : "";

  // A symmetric tolerance prints as "±"; an asymmetric one prints both signs
  // rather than flattening to a symmetry the source didn't claim.
  const plus = claim.uncertainty_plus;
  const minus = claim.uncertainty_minus;
  const symmetric = plus != null && (minus == null || Math.abs(plus - minus) < Number.EPSILON) ? plus : null;

  if (unit.decimals) {
    const start = formatDeepTime(claim.start_year, unit.key, decimals, symmetric);
    if (claim.end_year == null) {
      if (symmetric == null && (plus != null || minus != null)) {
        return `${prefix}${start} (+${(( plus ?? 0) / unit.years).toFixed(decimals)} / −${((minus ?? 0) / unit.years).toFixed(decimals)})`;
      }
      return `${prefix}${start}`;
    }
    // A DEEP-TIME RANGE IS WRITTEN OLDEST FIRST, AND SAYS "YEARS AGO" ONCE.
    //
    // It used to print "200,000 years ago – 700,000 years ago": the younger end
    // first, because that is the lower number on the axis, and the unit twice,
    // because each end was formatted on its own. Nobody writes a span of deep
    // time that way — it is "700,000–200,000 years ago", counting back — and the
    // doubled unit reads as two dates rather than one range.
    const older = formatDeepTime(claim.start_year, unit.key, decimals, null);
    const younger = formatDeepTime(claim.end_year, unit.key, decimals, null);
    const tailOf = (text: string) => text.match(/ (?:million |billion )?years ago$/)?.[0] ?? "";
    const tail = tailOf(younger);
    const number = (text: string) => text.slice(0, text.length - tailOf(text).length);
    return `${prefix}${number(older)}–${number(younger)}${tail}`;
  }

  const start = formatCalendarPoint(claim, claim.start_year, claim.start_month, claim.start_day);

  if (claim.end_year != null) {
    const endParts: ClaimTimeParts = { ...claim, start_year: claim.end_year, start_month: claim.end_month, start_day: claim.end_day };
    const end = formatCalendarPoint(endParts, claim.end_year, claim.end_month, claim.end_day);
    // "2600–2500 BCE", not "2600 BCE – 2500 BCE": drop the era from the first
    // half when both halves share it, the way every history book does.
    if (
      eraOf(claim.start_year) === eraOf(claim.end_year) &&
      dateUnit(claim.date_precision).key === "year" &&
      Math.abs(claim.start_year) < 1_000_000
    ) {
      return `${prefix}${writeYear(eraYearOf(claim.start_year).year)}–${end}`;
    }
    return `${prefix}${start} – ${end}`;
  }

  if (symmetric != null) return `${prefix}${start} ± ${formatDuration(symmetric)}`;
  return `${prefix}${start}`;
}

/** The source's own words for this date, or null when it gave none worth quoting. */
export function claimOriginalText(claim: Pick<ClaimTimeParts, "original_date_text">): string | null {
  const text = claim.original_date_text?.trim();
  return text ? text : null;
}

/**
 * What to show as the claim's headline.
 *
 * The source's wording when there is one — it is the most honest rendering, and
 * "10 AH" or "the third year of the reign of Darius" says something the
 * normalised date cannot. The normalised date is then shown beneath it, so the
 * reader can always see where on the axis that wording put the event.
 */
export function claimHeadline(claim: ClaimTimeParts): { headline: string; normalised: string; quoted: boolean } {
  const normalised = formatClaimDate(claim);
  const original = claimOriginalText(claim);
  // `quoted` means "the source words this differently from us", which is the
  // only case where showing both earns its space. A source that happens to
  // phrase it exactly as we normalise it should not be quoted back at itself.
  return original
    ? { headline: original, normalised, quoted: original !== normalised }
    : { headline: normalised, normalised, quoted: false };
}

/**
 * THE DATE, FOR AN EVENT RATHER THAN FOR A CLAIM.
 *
 * Everything else here writes one claim. This writes the whole event in the
 * few words a caption has room for, which is a different problem: an event
 * with five proposed dates has no single date, and picking one of them to
 * print would quietly promote it over the other four.
 *
 * So there are exactly two answers. When every claim writes out the same way,
 * that wording IS the event's date and it is printed as the claim would print
 * it. When they don't, the envelope is printed instead — earliest proposal to
 * latest — because "3500 BCE – 2484 BCE" is the true and complete answer to
 * "when?" for an event the sources disagree about, and it is the reason the
 * reader should open it.
 *
 * Compact years on purpose: this goes next to a title on a strip, where
 * "2.5 mya" earns its space and "2,500,000 years ago" does not.
 */
export function eventDateLabel(claims: ClaimTimeParts[]): string | null {
  if (claims.length === 0) return null;

  const written = new Set(claims.map((claim) => formatClaimDate(claim)));
  if (written.size === 1) return formatClaimDate(claims[0]);

  // THE ENVELOPE IS BUILT FROM WHAT THE CLAIMS SAY, NOT FROM THEIR RESOLUTION.
  //
  // claimInterval pads a point claim out to the width its precision implies —
  // the year 216 BCE is the whole of that year, which is correct for drawing it
  // and wrong for writing it. Five claims that all say 216 BCE came out as
  // "216 BCE – 215 BCE", which reads as a two-year range and is not what any of
  // them claims. So the envelope runs from the earliest thing claimed to the
  // latest thing claimed: a range claim contributes its end, a point claim
  // contributes its point.
  let lo = Infinity;
  let hi = -Infinity;
  for (const claim of claims) {
    const start = positionOf(claim.start_year, claim.start_month, claim.start_day);
    const end =
      claim.end_year == null ? start : positionOf(claim.end_year, claim.end_month, claim.end_day);
    lo = Math.min(lo, start, end);
    hi = Math.max(hi, start, end);
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return null;

  // DEEP TIME IS NOT WRITTEN IN BCE. An event whose claims are all measured in
  // thousands or millions of years is written the way those claims are written:
  // "765,000 – 550,000 years ago", not "798,051 BCE – 548,051 BCE", which
  // invents a precision none of the claims has and reads as nonsense besides.
  if (claims.every((claim) => unitTakesDecimals(claim.date_precision))) {
    const older = yearsAgoOf(lo);
    const younger = yearsAgoOf(hi);
    if (Math.abs(older - younger) < 1) return `${formatDuration(older)} ago`;
    const youngerParts = durationParts(younger);
    const olderParts = durationParts(older);
    return olderParts.unit === youngerParts.unit
      ? `${olderParts.value} – ${youngerParts.value} ${youngerParts.unit} ago`
      : `${formatDuration(older)} – ${formatDuration(younger)} ago`;
  }

  // FLOOR, NOT ROUND. A position is a year plus a fraction of it, so the 2nd of
  // August 216 BCE sits at −214.4 — and rounding that lands in the following
  // year, which is how five claims that all said 216 BCE came out as
  // "216 BCE – 215 BCE". Flooring takes the year the date is IN, which is what
  // a year label means. (The same slip would have printed a July 1969 date as
  // 1970.)
  const from = formatYear(Math.floor(lo), { compact: true });
  const to = formatYear(Math.floor(hi), { compact: true });
  return from === to ? from : `${from} – ${to}`;
}

// ---------------------------------------------------------------------------
// Durations
// ---------------------------------------------------------------------------

/**
 * "about 220 years", "15 million years".
 *
 * Rounded on purpose, and `floor` lets a caller say how precise it is entitled
 * to be: two claims are never compared more finely than the coarser of them
 * resolves, so subtracting a century-precision date from a day-precision one
 * cannot produce "36,524 days".
 */
export function formatDuration(years: number, floor = 0): string {
  const value = Math.abs(years);
  const granularity = Math.max(floor, 0);

  // The caller has said the underlying data cannot resolve finer than
  // `granularity`, so round to it before deciding anything. A gap of 0.7 years
  // between a claim given to the day and one given to the year is "1 year" —
  // it is only "less than a year" when it rounds away entirely.
  if (granularity > 0) {
    const rounded = Math.round(value / granularity) * granularity;
    if (rounded === 0) return `less than ${formatDuration(granularity)}`;
    if (rounded !== value) return formatDuration(rounded);
  }

  if (value >= 1_000_000_000) return `${trimZeros((value / 1_000_000_000).toFixed(2))} billion years`;
  if (value >= 1_000_000) return `${trimZeros((value / 1_000_000).toFixed(value >= 10_000_000 ? 1 : 3))} million years`;
  if (value >= 10_000) return `${withThousands(Math.round(value / 1000) * 1000)} years`;
  if (value >= 1) {
    // Round to the coarser of "two significant figures" and the caller's floor,
    // so 218 reads as "220 years" and never as "218.4".
    const twoSignificant = Math.pow(10, Math.max(0, Math.floor(Math.log10(value)) - 1));
    const step = Math.max(twoSignificant, granularity || 0, 1);
    const rounded = Math.round(value / step) * step;
    return `${withThousands(rounded)} year${rounded === 1 ? "" : "s"}`;
  }
  const months = Math.round(value * 12);
  if (months >= 1) return `${months} month${months === 1 ? "" : "s"}`;
  const days = Math.max(1, Math.round(value * 365.2425));
  return `${days} day${days === 1 ? "" : "s"}`;
}

// ---------------------------------------------------------------------------
// Comparing what different sources say
//
// The single number "sources disagree by X years" is only meaningful when the
// claims are genuinely apart. Two claims that overlap don't disagree by a
// distance at all, and one claim sitting inside another's range isn't a
// disagreement so much as a narrowing — printing a subtraction for either is
// worse than saying nothing.
// ---------------------------------------------------------------------------

export type ComparisonKind =
  /** Fewer than two claims. */
  | "single"
  /** Every claim lands in exactly the same place. */
  | "identical"
  /** There is at least one moment every claim allows. */
  | "overlap"
  /** One claim's window sits wholly inside another's, but not all of them agree. */
  | "contains"
  /** At least two claims allow no moment in common. */
  | "apart";

export type ClaimComparison = {
  kind: ComparisonKind;
  claimCount: number;
  /** Earliest anything is placed, and latest — the full width of the disagreement. */
  earliest: number;
  latest: number;
  /** latest − earliest. */
  spreadYears: number;
  /** The guaranteed separation between the two furthest-apart claims; 0 when anything overlaps. */
  minimumGapYears: number;
  /** The window every claim allows, when there is one. */
  commonFrom: number | null;
  commonTo: number | null;
  /** The coarsest granularity in play — the floor on how precisely any of this may be stated. */
  granularityYears: number;
  /** True when any claim is approximate, a range or carries a tolerance. */
  anyApproximate: boolean;
};

export function compareClaims(claims: ClaimTimeParts[]): ClaimComparison | null {
  if (claims.length === 0) return null;

  const intervals = claims.map(claimInterval);
  const earliest = Math.min(...intervals.map((interval) => interval.lo));
  const latest = Math.max(...intervals.map((interval) => interval.hi));
  // The number a reader is given is the distance between where the claims SIT,
  // not between the outer edges of their windows — adding both windows' widths
  // to the gap would make two year-precision claims 60 years apart read as 61.
  const midpoints = intervals.map((interval) => (interval.lo + interval.hi) / 2);
  const midpointSpread = Math.max(...midpoints) - Math.min(...midpoints);
  const granularityYears = Math.max(...intervals.map((interval) => interval.granularity));
  const anyApproximate =
    claims.some((claim) => claim.is_approximate) || intervals.some((interval) => interval.kind !== "point");

  const base = {
    claimCount: claims.length,
    earliest,
    latest,
    spreadYears: midpointSpread,
    granularityYears,
    anyApproximate,
  };

  if (claims.length === 1) {
    return { ...base, kind: "single", minimumGapYears: 0, commonFrom: intervals[0].lo, commonTo: intervals[0].hi };
  }

  // The window every claim allows: the highest floor against the lowest ceiling.
  const commonFrom = Math.max(...intervals.map((interval) => interval.lo));
  const commonTo = Math.min(...intervals.map((interval) => interval.hi));
  // STRICTLY less than, because a calendar window is half-open: the year 1 BCE
  // is [0, 1) and the year 1 CE is [1, 2), and they meet at a single instant
  // that belongs to neither. Treating that touch as agreement had 1 BCE and
  // 1 CE — a full year apart, and the classic year-zero trap — reported as
  // overlapping. A genuinely zero-width claim (a range whose ends are the same
  // point) has nothing but its edges, so touching is all the overlap it can
  // ever have and still counts.
  const touchesOnly = commonFrom === commonTo;
  const allOverlap =
    commonFrom < commonTo || (touchesOnly && intervals.some((interval) => interval.lo === interval.hi));

  const identical = intervals.every(
    (interval) => interval.lo === intervals[0].lo && interval.hi === intervals[0].hi
  );

  if (allOverlap || identical) {
    return {
      ...base,
      kind: identical ? "identical" : "overlap",
      minimumGapYears: 0,
      commonFrom,
      commonTo,
    };
  }

  // Nothing is allowed by all of them. The guaranteed separation is between the
  // claim that ends earliest and the one that starts latest.
  const minimumGapYears = Math.max(0, commonFrom - commonTo);

  // Does any pair nest? Worth saying, because "2600–2500 BCE" containing
  // "2560 BCE" is a different relationship from two dates simply being apart,
  // even when a third claim puts the set as a whole out of agreement.
  const contains = intervals.some((outer) =>
    intervals.some(
      (inner) => inner !== outer && inner.lo >= outer.lo && inner.hi <= outer.hi && (inner.lo > outer.lo || inner.hi < outer.hi)
    )
  );

  return {
    ...base,
    kind: contains ? "contains" : "apart",
    minimumGapYears,
    commonFrom: null,
    commonTo: null,
  };
}

/** Whether an event's sources place it in genuinely different places. */
export function claimsDisagree(claims: ClaimTimeParts[]): boolean {
  const comparison = compareClaims(claims);
  return comparison != null && comparison.kind !== "single" && comparison.kind !== "identical";
}

/**
 * The disagreement, in a sentence — and only the sentence the data supports.
 *
 * Never states a distance where the claims overlap, never states one more
 * precisely than the coarsest claim allows, and always says so when the dates
 * being subtracted are themselves approximate.
 */
export function describeComparison(comparison: ClaimComparison): { headline: string; detail: string | null } {
  const floor = comparison.granularityYears;

  switch (comparison.kind) {
    case "single":
      return { headline: "Only one date has been proposed for this event.", detail: null };

    case "identical":
      return {
        headline: `${comparison.claimCount} sources are cited here, and they place this at the same point in time.`,
        detail: "Agreement between sources is worth as much attention as disagreement — it is why the same date turns up in every book.",
      };

    case "overlap":
      return {
        headline: "The proposed dates overlap — there is a stretch of time every source allows.",
        detail:
          comparison.commonFrom != null && comparison.commonTo != null
            ? `They differ in how wide a window they give, but all of them include ${formatRangeOfPositions(comparison.commonFrom, comparison.commonTo)}. The widest disagreement between the earliest and latest is about ${formatDuration(comparison.spreadYears, floor)}.`
            : null,
      };

    case "contains":
      return {
        headline: "These sources don't all agree, and one of them gives a window that contains another's date.",
        detail: `A wider window isn't a different claim so much as a less committed one. Across all ${comparison.claimCount} sources, the earliest and latest dates are about ${formatDuration(comparison.spreadYears, floor)} apart${comparison.minimumGapYears > 0 ? `, and at least ${formatDuration(comparison.minimumGapYears, floor)} separates the two furthest apart` : ""}.`,
      };

    case "apart":
    default: {
      // When the disagreement is narrower than the coarsest claim can resolve,
      // the honest sentence is a different sentence — not the same one with
      // "less than" wedged into the middle of it.
      if (Math.round(comparison.spreadYears / floor) === 0) {
        return {
          headline: `These sources place this at different points, but by less than the coarsest of them can resolve.`,
          detail: `One of the dates here is only given to the nearest ${formatDuration(floor)}, so the gap between them — under ${formatDuration(floor)} — is smaller than the precision any of them claims.`,
        };
      }
      return {
        headline: `Sources disagree about when this happened — about ${formatDuration(comparison.spreadYears, floor)} separates the earliest and latest.`,
        detail: comparison.anyApproximate
          ? "Some of these dates are themselves approximate or given as ranges, so read that as roughly how far apart they are, not as a measurement."
          : null,
      };
    }
  }
}

function formatRangeOfPositions(from: number, to: number): string {
  if (Math.abs(from - to) < 1e-9) return formatYear(Math.round(from));
  return `${formatYear(Math.round(from))} – ${formatYear(Math.round(to))}`;
}

// ---------------------------------------------------------------------------
// Semantic zoom: which units the axis is speaking in right now
// ---------------------------------------------------------------------------

export type ScaleBand =
  | "billions"
  | "millions"
  | "millennia"
  | "centuries"
  | "decades"
  | "years"
  | "months"
  | "days";

export const SCALE_BAND_LABELS: Record<ScaleBand, string> = {
  billions: "Billions of years",
  millions: "Millions of years",
  millennia: "Thousands of years",
  centuries: "Centuries",
  decades: "Decades",
  years: "Years",
  months: "Months",
  days: "Days",
};

export function scaleBandFor(spanYears: number): ScaleBand {
  if (spanYears > 2_000_000_000) return "billions";
  if (spanYears > 2_000_000) return "millions";
  if (spanYears > 20_000) return "millennia";
  if (spanYears > 2_000) return "centuries";
  if (spanYears > 200) return "decades";
  if (spanYears > 6) return "years";
  if (spanYears > 0.5) return "months";
  return "days";
}

// The ladder the axis steps through as you zoom. Every step is a round number
// of years (or a round fraction of one), which is what stops the labels
// drifting to 1,043 BCE as you pan. Rendering billions of individual units is
// never attempted: the axis draws between four and about a dozen ticks at any
// zoom, and the STEP changes, not the count.
const STEP_LADDER = [
  2_000_000_000, 1_000_000_000, 500_000_000, 200_000_000, 100_000_000,
  50_000_000, 20_000_000, 10_000_000, 5_000_000, 2_000_000, 1_000_000,
  500_000, 200_000, 100_000, 50_000, 20_000, 10_000, 5_000, 2_000, 1_000,
  500, 200, 100, 50, 20, 10, 5, 2, 1,
  1 / 2, 1 / 4, 1 / 12, 1 / 52, 1 / 365.2425,
];

/**
 * The ladder rung that puts roughly `target` ticks across the window.
 *
 * "The first rung at or below the ideal" is the obvious rule and the wrong one:
 * the rungs are 2–2.5× apart, so falling one past the ideal can double the tick
 * count (a 297,000-year window asking for 6 ticks got 15). Both neighbours are
 * compared on the log of their tick count, which is the scale the eye judges
 * crowding on.
 */
export function stepFor(spanYears: number, target = 8): number {
  const wanted = Math.max(2, target);
  const ideal = spanYears / wanted;

  const index = STEP_LADDER.findIndex((step) => step <= ideal);
  if (index === -1) return STEP_LADDER[STEP_LADDER.length - 1];
  if (index === 0) return STEP_LADDER[0];

  const finer = STEP_LADDER[index];
  const coarser = STEP_LADDER[index - 1];
  const error = (step: number) => Math.abs(Math.log(spanYears / step / wanted));
  return error(coarser) <= error(finer) ? coarser : finer;
}

export type AxisTick = {
  position: number;
  label: string;
  /** A round multiple of ten steps — drawn heavier. */
  major: boolean;
};

/**
 * The ticks for a window, at whatever scale the window implies.
 *
 * Semantic, not linear: at 13.8 billion years wide the ticks are billions of
 * years apart and read "13.8 bya"; at forty years wide they are decades and
 * read "1990"; at eight months they are months and read "March 2026". Same
 * function, same window arithmetic — only the step and the wording change,
 * which is what makes zooming feel like a map rather than a slider.
 */
// THE LOG AXIS'S OWN RULER.
//
// Round years, which is what the linear ruler counts in, are the wrong unit
// here: on a log axis the readable gridlines are ORDERS OF MAGNITUDE — ten
// years ago, a hundred, a thousand, a million, a billion. That ladder is also
// the one a person narrates deep time with, so the labels come out as sentences
// somebody would say rather than as numbers with nine zeros in them.
//
// The intermediate 3× rungs are there so a half-decade window still gets a
// gridline or two instead of going bare.
const LOG_TICK_AGOS = [
  1, 3, 10, 30, 100, 300, 1_000, 3_000, 10_000, 30_000, 100_000, 300_000,
  1_000_000, 3_000_000, 10_000_000, 30_000_000, 100_000_000, 300_000_000,
  1_000_000_000, 3_000_000_000, 10_000_000_000,
];

function logTicks(from: number, to: number, target: number): AxisTick[] {
  const now = presentPosition();
  const lo = Math.min(from, to);
  const hi = Math.max(from, to);

  // Every rung in view, past and future, plus the present itself when it is on
  // screen — "Now" is the one gridline on this axis that is not a magnitude.
  const candidates: { position: number; ago: number }[] = [];
  for (const ago of LOG_TICK_AGOS) {
    for (const signed of [ago, -ago]) {
      const position = now - signed;
      if (position >= lo && position <= hi) candidates.push({ position, ago: signed });
    }
  }
  if (now >= lo && now <= hi) candidates.push({ position: now, ago: 0 });
  candidates.sort((a, b) => a.position - b.position);

  // Thin evenly if the ladder is denser than the axis has room for, keeping the
  // ends so the ruler never stops short of the edge it is measuring to — and
  // always keeping NOW. The present is the point this whole axis is measured
  // from; a log ruler that has thinned away its own origin is a ruler with no
  // zero on it.
  const stride = Math.max(1, Math.ceil(candidates.length / Math.max(2, target)));
  const kept = candidates.filter(
    (candidate, index) => candidate.ago === 0 || index % stride === 0 || index === candidates.length - 1
  );

  return kept.map(({ position, ago }) => ({
    position,
    label: logTickLabel(ago),
    // Powers of ten are the structural rungs; the 3× ones between them are not.
    major: ago === 0 || isPowerOfTen(Math.abs(ago)),
  }));
}

function isPowerOfTen(value: number): boolean {
  if (value <= 0) return false;
  const log = Math.log10(value);
  return Math.abs(log - Math.round(log)) < 1e-9;
}

function logTickLabel(ago: number): string {
  if (ago === 0) return "Now";
  if (ago > 0) return `${formatDuration(ago)} ago`;
  return `in ${formatDuration(-ago)}`;
}

export function axisTicks(
  from: number,
  to: number,
  options: { target?: number; scale?: TimeScale } = {}
): AxisTick[] {
  if (options.scale === "log") return logTicks(from, to, options.target ?? 8);
  return linearTicks(from, to, options);
}

function linearTicks(from: number, to: number, options: { target?: number } = {}): AxisTick[] {
  const span = Math.max(MIN_WINDOW_YEARS, to - from);
  const step = stepFor(span, options.target ?? 8);
  const first = Math.ceil(from / step) * step;
  const ticks: AxisTick[] = [];

  // Historians have no year zero, so an astronomical multiple of a round step
  // is one short of a round DATE: −2000 is 2001 BCE, and a ruler labelled
  // "2,001 BCE | 1,001 BCE" looks broken to everyone who isn't an astronomer.
  // Shifting the BCE half of the grid by a single year puts the ticks back on
  // 2000 BCE and 1000 BCE. Skipped at a step of one year, where the shift would
  // collide with the tick next door.
  const shift = (position: number) => (step >= 2 && position <= 0 ? position + 1 : position);

  // A guard, not a limit anyone reaches: stepFor keeps the count near `target`,
  // and this stops a degenerate window from trying to allocate a million ticks.
  for (let i = 0; i < 400; i++) {
    const gridPosition = first + i * step;
    if (gridPosition > to) break;
    const position = shift(gridPosition);
    ticks.push({
      position,
      label: tickLabel(position, step),
      major: Math.abs(gridPosition % (step * 10)) < step / 1000,
    });
  }
  return ticks;
}

/** How a tick at this step should be worded. */
function tickLabel(position: number, step: number): string {
  if (step >= 1) {
    // Whole years and up: round the position, so floating-point noise never
    // prints "999 BCE" next to "1,000 BCE".
    return formatYear(Math.round(position), { compact: true });
  }
  const year = Math.floor(position);
  const fraction = position - year;
  if (step >= 1 / 12) {
    const month = Math.round(fraction * 12);
    return `${MONTHS[Math.min(11, Math.max(0, month))].slice(0, 3)} ${formatYear(year, { compact: true })}`;
  }
  const month = Math.min(11, Math.floor(fraction * 12));
  const day = Math.max(1, Math.round((fraction - month / 12) * 365.2425) + 1);
  return `${day} ${MONTHS[month].slice(0, 3)}`;
}

// ---------------------------------------------------------------------------
// The viewport
// ---------------------------------------------------------------------------

export type TimeWindow = { from: number; to: number };

/** The whole axis, end to end — the frame the overview bar never changes out of. */
export function timelineExtentWindow(): TimeWindow {
  return { from: TIMELINE_MIN_YEAR, to: TIMELINE_MAX_YEAR };
}

/** Keep a window inside the span, no narrower than a few days, no wider than everything. */
export function clampWindow(window: TimeWindow): TimeWindow {
  const fullSpan = TIMELINE_MAX_YEAR - TIMELINE_MIN_YEAR;
  let span = Math.min(fullSpan, Math.max(MIN_WINDOW_YEARS, window.to - window.from));
  let from = window.from;

  if (from < TIMELINE_MIN_YEAR) from = TIMELINE_MIN_YEAR;
  if (from + span > TIMELINE_MAX_YEAR) from = TIMELINE_MAX_YEAR - span;
  if (from < TIMELINE_MIN_YEAR) {
    from = TIMELINE_MIN_YEAR;
    span = fullSpan;
  }
  return { from, to: from + span };
}

/**
 * Zoom by `factor` (>1 zooms out) about a fixed point, given as 0–1 across the
 * window. Multiplicative, so a wheel notch covers the same proportion of the
 * span at 13 billion years as it does at ten — the reason this navigates like a
 * map instead of a scrollbar.
 */
// Zoom and pan happen in whatever space the axis is DRAWN in, not always in
// years. On a log axis a gesture that moved a fixed number of years would crawl
// at the deep end and bolt at the shallow one — the finger has to move the
// picture, and the picture is spaced logarithmically.
export function zoomWindow(window: TimeWindow, factor: number, anchor = 0.5, scale: TimeScale = "linear"): TimeWindow {
  if (scale === "linear") {
    const span = window.to - window.from;
    const focus = window.from + span * anchor;
    const nextSpan = span * factor;
    return clampWindow({ from: focus - nextSpan * anchor, to: focus + nextSpan * (1 - anchor) });
  }

  const now = presentPosition();
  const lo = logValueOf(window.from, now);
  const hi = logValueOf(window.to, now);
  const span = hi - lo;
  const focus = lo + span * anchor;
  const nextSpan = span * factor;
  return clampWindow({
    from: positionFromLogValue(focus - nextSpan * anchor, now),
    to: positionFromLogValue(focus + nextSpan * (1 - anchor), now),
  });
}

export function panWindow(window: TimeWindow, byFraction: number, scale: TimeScale = "linear"): TimeWindow {
  if (scale === "linear") {
    const span = window.to - window.from;
    return clampWindow({ from: window.from + span * byFraction, to: window.to + span * byFraction });
  }

  const now = presentPosition();
  const lo = logValueOf(window.from, now);
  const hi = logValueOf(window.to, now);
  const shift = (hi - lo) * byFraction;
  return clampWindow({
    from: positionFromLogValue(lo + shift, now),
    to: positionFromLogValue(hi + shift, now),
  });
}

/** A window centred on a position, `span` years wide. */
export function windowAround(position: number, span: number): TimeWindow {
  return clampWindow({ from: position - span / 2, to: position + span / 2 });
}

// ---------------------------------------------------------------------------
// TWO WAYS OF SPACING TIME
//
// LINEAR is the honest one: a year is the same width wherever it falls, so the
// gap between two events is the gap you see. It is also the one that makes a
// homeschool timeline unreadable, because 13.8 billion years of it and five
// thousand years of it are the same axis, and at any zoom that shows the Big
// Bang the whole of recorded history is a quarter of a pixel.
//
// LOG spaces time by ORDER OF MAGNITUDE instead: a decade, a century, a
// millennium and a million years each get about the same width. Everything is
// reachable at once — the Big Bang on the left, this morning on the right, and
// the Norman Conquest visible rather than implied.
//
// It is a DISTORTION and the UI has to keep saying so, because a reader who
// takes a log axis for a linear one has been told something false about how far
// apart two events are. That is why it is a toggle rather than the default, why
// it is labelled on the axis itself, and why the ruler above still reports the
// true span in years.
//
// The transform is a symmetric log of years-before-present:
//
//     value(position) = ±log10(1 + |years ago|)
//
// The +1 is what lets "now" exist on a log axis at all (log10(1) = 0 rather
// than −∞), and the sign flip is what lets the future sit to the right of it
// instead of folding back over the past. It is continuous through the present,
// monotonic across the whole range, and exactly invertible.
// ---------------------------------------------------------------------------

export type TimeScale = "linear" | "log";

/** A position as its place on the log axis. Increases with position, like the linear one. */
export function logValueOf(position: number, now: number = presentPosition()): number {
  const ago = now - position;
  const magnitude = Math.log10(1 + Math.abs(ago));
  return ago >= 0 ? -magnitude : magnitude;
}

/** The inverse of logValueOf — exact, so panning and zooming round-trip without drift. */
export function positionFromLogValue(value: number, now: number = presentPosition()): number {
  const magnitude = Math.pow(10, Math.abs(value)) - 1;
  return now - (value <= 0 ? magnitude : -magnitude);
}

/** 0–1 across the window; outside that when the position is off-screen. */
export function fractionOf(window: TimeWindow, position: number, scale: TimeScale = "linear"): number {
  if (scale === "linear") return (position - window.from) / (window.to - window.from);

  const now = presentPosition();
  const lo = logValueOf(window.from, now);
  const hi = logValueOf(window.to, now);
  if (hi === lo) return 0;
  return (logValueOf(position, now) - lo) / (hi - lo);
}

/** The inverse of fractionOf: where on the timeline a fraction across the window lands. */
export function positionAt(window: TimeWindow, fraction: number, scale: TimeScale = "linear"): number {
  if (scale === "linear") return window.from + (window.to - window.from) * fraction;

  const now = presentPosition();
  const lo = logValueOf(window.from, now);
  const hi = logValueOf(window.to, now);
  return positionFromLogValue(lo + (hi - lo) * fraction, now);
}

// HOW FAR BACK, FROM NOW.
//
// The era jumps below are PLACES — the Ancient world, the Medieval period —
// and they are the right tool when you know where you want to be. This ladder
// answers the other question, the one a learner asks far more often: what does
// the last N years look like? Every one of these ends at the same place and
// only the depth changes, so pressing down the list is a single continuous
// zoom out from the present.
//
// It ends just past today rather than exactly on it, so the most recent events
// are not jammed against the right-hand edge with nothing after them.
export const LOOKBACK_END_YEAR = 2030;

/**
 * A duration split into the number and the word, so a card can set the number
 * big and the unit small: "1 million" + "years", "7,500" + "years".
 *
 * Derived from formatDuration rather than reimplemented, so the two can never
 * disagree about how a span is written.
 */
export function durationParts(years: number, floor = 0): { value: string; unit: string } {
  const text = formatDuration(years, floor);
  const cut = text.lastIndexOf(" ");
  if (cut === -1) return { value: text, unit: "" };
  return { value: text.slice(0, cut), unit: text.slice(cut + 1) };
}

export const LOOKBACK_SPANS = [
  // 7,500 sits between the round thousands on purpose: it is the span that
  // holds the whole of the written record and the farming revolution before it
  // in one frame, and it was asked for by name.
  2_000, 5_000, 7_500, 10_000, 20_000, 50_000, 100_000,
  1_000_000, 10_000_000, 100_000_000, 1_000_000_000,
] as const;

/** The window covering the last `years` years, ending just past the present. */
export function lookbackWindow(years: number, endYear: number = LOOKBACK_END_YEAR): TimeWindow {
  return clampWindow({ from: endYear - years, to: endYear });
}

// The jumps in the zoom rail. Each is a place a reader actually wants to be,
// which is what makes 13.8 billion years navigable at all — panning there by
// hand from "today" would take thousands of drags.
export const TIMELINE_JUMPS: { key: string; label: string; window: TimeWindow }[] = [
  { key: "everything", label: "All of time", window: { from: TIMELINE_MIN_YEAR, to: TIMELINE_MAX_YEAR } },
  { key: "earth", label: "Deep time", window: { from: -4_800_000_000, to: -200_000_000 } },
  { key: "life", label: "Life on Earth", window: { from: -600_000_000, to: 2000 } },
  { key: "humans", label: "Early humans", window: { from: -300_000, to: -3_000 } },
  { key: "ancient", label: "Ancient world", window: { from: -6_000, to: 600 } },
  { key: "medieval", label: "Medieval", window: { from: 400, to: 1500 } },
  { key: "modern", label: "Modern", window: { from: 1500, to: 2060 } },
  { key: "today", label: "Today", window: { from: 1990, to: 2060 } },
];
