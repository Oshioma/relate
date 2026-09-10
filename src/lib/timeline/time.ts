// The timeline's number line.
//
// This module is the application-side mirror of how supabase/migrations/
// …_timeline_core.sql stores time, and the only place that is allowed to know
// how a year becomes a pixel or a sentence.
//
// WHY NOT Date / timestamptz
//
// A JavaScript Date tops out around ±273,000 years from 1970 and a Postgres
// timestamptz around ±294,000 — both several orders of magnitude short of "the
// Earth formed", never mind "the Big Bang". Worse, both carry a calendar:
// there was no October in 4,000,000,000 BCE, and pretending otherwise is a lie
// the data model would then force every reader to believe.
//
// SO: an ASTRONOMICAL YEAR NUMBER held as a plain double.
//
//     1 CE = 1        1 BCE = 0        2 BCE = -1        44 BCE = -43
//
// Astronomical numbering (rather than a positive year plus a BCE/CE flag) is
// what makes arithmetic work across the year zero that historians don't have:
// 2 BCE to 2 CE is (2) − (−1) = 3 years by subtraction, with no branch. Era is
// then a fact about the number — see eraOf — not a second field that can
// contradict it.
//
// PRECISION. A double has 53 bits of mantissa, so every whole year back to the
// Big Bang is exact (integers are exact to 2^53 ≈ 9.0e15) and the fraction
// still resolves to about a minute out at 13.8e9. Inside recorded history it
// resolves far finer than a day. One representation, whole span, no second
// number to keep in step.
//
// A calendar month and day are stored SEPARATELY and optionally, because
// "1066" and "14 October 1066" are different claims and the difference is the
// point. `position` folds them into the single number the axis draws against.

// ---------------------------------------------------------------------------
// The span
// ---------------------------------------------------------------------------

// A little older than the usual 13.787 Ga figure, so the earliest thing anyone
// can claim still has axis to its left. This is scaffolding for the view, NOT a
// cosmology: nothing in the product asserts when the universe began — that is
// an event with date claims and sources like any other (see §19 of the brief).
export const TIMELINE_MIN_YEAR = -13_900_000_000;
// Room for planned missions and predicted eclipses without letting a typo put
// an event a million years out.
export const TIMELINE_MAX_YEAR = 3000;

// "Before Present" in the sciences means before 1950 — radiocarbon's zero,
// fixed so that a published date doesn't drift as the years pass. Deep-time
// claims entered as "years ago" are converted against this, not against today.
export const BP_REFERENCE_YEAR = 1950;

// The narrowest window the viewport will zoom to: about three days. Below that
// the axis would be claiming a resolution the data model doesn't carry.
export const MIN_WINDOW_YEARS = 0.008;

export type Era = "BCE" | "CE";

// How precisely a claim is being made. Ordered coarse-last, and matched by the
// date_precision check constraint in the migration — it changes how a date is
// RENDERED, so it is constrained in the database as well as here.
export const DATE_PRECISIONS = [
  { key: "exact_date", label: "Exact date", hint: "A known day — 14 October 1066." },
  { key: "month", label: "Month", hint: "The month is known, the day isn't." },
  { key: "year", label: "Year", hint: "A single year." },
  { key: "decade", label: "Decade", hint: "Somewhere in a ten-year window." },
  { key: "century", label: "Century", hint: "Somewhere in a hundred-year window." },
  { key: "millennium", label: "Millennium", hint: "Somewhere in a thousand-year window." },
  { key: "thousands", label: "Thousands of years", hint: "Tens of thousands of years — early humans, the last ice age." },
  { key: "millions", label: "Millions of years", hint: "Deep time — dinosaurs, the first life." },
  { key: "billions", label: "Billions of years", hint: "The formation of the Earth, and earlier." },
] as const;

export type DatePrecision = (typeof DATE_PRECISIONS)[number]["key"];

export function precisionLabel(key: string | null | undefined): string {
  return DATE_PRECISIONS.find((p) => p.key === key)?.label ?? "Year";
}

// Roughly how wide a claim at this precision is, in years. Used to draw the
// uncertainty a bare precision implies — a "century" claim is a hundred-year
// bar, not a dot — and never presented as a calculated figure.
const PRECISION_SPAN: Record<DatePrecision, number> = {
  exact_date: 0,
  month: 1 / 12,
  year: 1,
  decade: 10,
  century: 100,
  millennium: 1000,
  thousands: 10_000,
  millions: 1_000_000,
  billions: 100_000_000,
};

export function precisionSpanYears(precision: string | null | undefined): number {
  return PRECISION_SPAN[(precision ?? "year") as DatePrecision] ?? 1;
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

/** −43 → { year: 44, era: "BCE" }. The number as a person would say it. */
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
 * timeline draws against. MUST match the generated `start_position` /
 * `end_position` columns — the database computes this for stored rows, and this
 * function computes it for rows being previewed before they are saved.
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

/** "8.00" → "8", "13.80" → "13.8", "4.54" → "4.54". */
function trimZeros(text: string): string {
  return text.includes(".") ? text.replace(/\.?0+$/, "") : text;
}

/** Grouping for quantities — a count of years, not a year. */
function withThousands(value: number): string {
  return Math.round(value).toLocaleString("en-GB");
}

/**
 * One year, written the way this part of the timeline is usually written.
 *
 * Deep time is written as "years ago" because nobody says "4,540,000,000 BCE",
 * and the crossover is at a million years — early enough that "800,000 BCE"
 * still reads, late enough that the ice ages stay in BCE where the books put
 * them.
 */
export function formatYear(astronomicalYear: number, options: { compact?: boolean } = {}): string {
  const ago = yearsAgoOf(astronomicalYear);
  const compact = options.compact ?? false;

  if (ago >= 1_000_000_000) {
    const value = ago / 1_000_000_000;
    // Two decimals where they carry information (4.54 billion years is a
    // figure), none where they don't — a ruler reading "8.00 bya" next to
    // "13.8 bya" is claiming a precision it doesn't have and looks wrong doing
    // it.
    const text = trimZeros(value >= 10 ? value.toFixed(1) : value.toFixed(2));
    return compact ? `${text} bya` : `${text} billion years ago`;
  }
  if (ago >= 1_000_000) {
    const value = ago / 1_000_000;
    const text = value >= 100 ? withThousands(value) : value >= 10 ? value.toFixed(0) : value.toFixed(1);
    return compact ? `${text} mya` : `${text} million years ago`;
  }

  const { year, era } = eraYearOf(astronomicalYear);
  if (era === "BCE") return `${writeYear(year)} BCE`;
  // CE is implicit for anything a reader would recognise as a modern year, and
  // spelled out for the first millennium, where "79" alone means nothing.
  return year < 1000 || !compact ? `${writeYear(year)} CE` : writeYear(year);
}

/** A full date where one is known: "14 October 1066 CE". */
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
// Saying a claim out loud
// ---------------------------------------------------------------------------

export type ClaimTimeParts = {
  start_year: number;
  start_month: number | null;
  start_day: number | null;
  end_year: number | null;
  end_month: number | null;
  end_day: number | null;
  date_precision: string;
  is_approximate: boolean;
  display_text: string;
};

/**
 * What to print for a claim. An author's own wording always wins — a source
 * that says "the third year of Hammurabi's reign" should print that — and this
 * is the fallback when they haven't written one.
 */
export function formatClaim(claim: ClaimTimeParts, options: { compact?: boolean } = {}): string {
  if (claim.display_text.trim()) return claim.display_text.trim();

  const start = formatDateParts(claim.start_year, claim.start_month, claim.start_day, options);
  const prefix = claim.is_approximate ? "c. " : "";

  if (claim.end_year == null) return `${prefix}${start}`;

  const end = formatDateParts(claim.end_year, claim.end_month, claim.end_day, options);
  // "2600–2500 BCE", not "2600 BCE – 2500 BCE": drop the era from the first
  // half when both halves share it, the way every history book does.
  const startEra = eraOf(claim.start_year);
  const endEra = eraOf(claim.end_year);
  if (startEra === endEra && claim.start_month == null && claim.end_month == null && Math.abs(claim.start_year) < 1_000_000) {
    const startBare = writeYear(eraYearOf(claim.start_year).year);
    return `${prefix}${startBare}–${end}`;
  }
  return `${prefix}${start}–${end}`;
}

/** The span a claim occupies on the axis: a point claim still has the width its precision implies. */
export function claimSpan(claim: ClaimTimeParts): { from: number; to: number; isRange: boolean } {
  const from = positionOf(claim.start_year, claim.start_month, claim.start_day);
  if (claim.end_year != null) {
    return { from, to: positionOf(claim.end_year, claim.end_month, claim.end_day), isRange: true };
  }
  return { from, to: from, isRange: false };
}

/** Where a claim sits when it has to be one number — the middle of its span. */
export function claimMidpoint(claim: ClaimTimeParts): number {
  const { from, to } = claimSpan(claim);
  return (from + to) / 2;
}

// ---------------------------------------------------------------------------
// Disagreement
// ---------------------------------------------------------------------------

export type Disagreement = {
  /** Earliest point any source places the event. */
  earliest: number;
  /** Latest point any source places the event. */
  latest: number;
  /** latest − earliest, in years. */
  years: number;
  /** True when any claim involved is itself approximate or a range. */
  isApproximate: boolean;
  claimCount: number;
};

export function measureDisagreement(claims: ClaimTimeParts[]): Disagreement | null {
  if (claims.length < 2) return null;
  let earliest = Infinity;
  let latest = -Infinity;
  let isApproximate = false;
  for (const claim of claims) {
    const { from, to, isRange } = claimSpan(claim);
    earliest = Math.min(earliest, from);
    latest = Math.max(latest, to);
    if (claim.is_approximate || isRange || claim.date_precision !== "exact_date") isApproximate = true;
  }
  return { earliest, latest, years: latest - earliest, isApproximate, claimCount: claims.length };
}

/**
 * "about 220 years", "about 15 million years".
 *
 * Rounded hard on purpose. Two approximate dates subtracted give a number with
 * no more precision than the vaguer of them, and printing "218.5 years" would
 * dress that up as a measurement. Every caller pairs this with the word
 * "about", and the UI says so again where the underlying claims are approximate
 * (see §6 of the brief).
 */
export function formatDuration(years: number): string {
  const value = Math.abs(years);
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} billion years`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value / 1_000_000 >= 10 ? 0 : 1)} million years`;
  if (value >= 10_000) return `${withThousands(Math.round(value / 1000) * 1000)} years`;
  if (value >= 1) {
    // One significant-ish figure: 218 → "about 220 years", 1,240 → "1,200".
    const magnitude = Math.pow(10, Math.max(0, Math.floor(Math.log10(value)) - 1));
    return `${withThousands(Math.round(value / magnitude) * magnitude)} years`;
  }
  const months = Math.round(value * 12);
  if (months >= 1) return `${months} month${months === 1 ? "" : "s"}`;
  const days = Math.max(1, Math.round(value * 365.2425));
  return `${days} day${days === 1 ? "" : "s"}`;
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
// of years (or a round fraction of one), which is what stops the labels drifting
// to 1,043 BCE as you pan. Rendering billions of individual units is never
// attempted: the axis draws between four and about a dozen ticks at any zoom,
// and the STEP changes, not the count.
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
  /** A round multiple of ten steps — drawn heavier, labelled always. */
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
export function axisTicks(from: number, to: number, options: { target?: number } = {}): AxisTick[] {
  const span = Math.max(MIN_WINDOW_YEARS, to - from);
  const step = stepFor(span, options.target ?? 8);
  const first = Math.ceil(from / step) * step;
  const ticks: AxisTick[] = [];

  // Historians have no year zero, so an astronomical multiple of a round step
  // is one short of a round DATE: −2000 is 2001 BCE, and a ruler labelled
  // "2,001 BCE | 1,001 BCE" looks broken to everyone who isn't an astronomer.
  // Shifting the BCE half of the grid by a single year puts the ticks back on
  // 2000 BCE and 1000 BCE. Skipped at a step of one year, where the shift would
  // collide with the tick next door, and invisible at every step where a
  // window straddles the era boundary at all.
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
export function zoomWindow(window: TimeWindow, factor: number, anchor = 0.5): TimeWindow {
  const span = window.to - window.from;
  const focus = window.from + span * anchor;
  const nextSpan = span * factor;
  return clampWindow({ from: focus - nextSpan * anchor, to: focus + nextSpan * (1 - anchor) });
}

export function panWindow(window: TimeWindow, byFraction: number): TimeWindow {
  const span = window.to - window.from;
  return clampWindow({ from: window.from + span * byFraction, to: window.to + span * byFraction });
}

/** A window centred on a position, `span` years wide. */
export function windowAround(position: number, span: number): TimeWindow {
  return clampWindow({ from: position - span / 2, to: position + span / 2 });
}

/** 0–1 across the window; outside that when the position is off-screen. */
export function fractionOf(window: TimeWindow, position: number): number {
  return (position - window.from) / (window.to - window.from);
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
