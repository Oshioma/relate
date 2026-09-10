import { z } from "zod";
import { astronomicalFromEra, astronomicalFromYearsAgo, dateUnit, TIMELINE_MAX_YEAR, TIMELINE_MIN_YEAR, type Era } from "./time";

// What the "Add event" flow hands to the server, and the one definition of what
// a valid contribution is.
//
// The wizard collects an event, its first proposed date, and the source behind
// that date — then lets the contributor add more dates, each with its own
// source. It all arrives in ONE submission, because a half-saved event with no
// date on it is not a timeline entry, and a wizard that writes as it goes
// leaves exactly those behind whenever somebody closes the tab at step three.
//
// The schema lives here rather than in the action so the client can check the
// same rules before submitting, and the two can't drift apart.

// HOW A PERSON TYPES A DATE.
//
// Two modes, because "1066 CE" and "4.5 billion years ago" are not the same
// keyboard gesture, and forcing either into the other's box is how you get an
// astronomer typing 4,499,998,050 BCE by hand. Both resolve to one astronomical
// year — see resolveDateInput.
export const DATE_INPUT_MODES = ["calendar", "years_ago"] as const;

export const AGO_UNITS = [
  { key: "years", label: "years ago", multiplier: 1 },
  { key: "thousand", label: "thousand years ago", multiplier: 1_000 },
  { key: "million", label: "million years ago", multiplier: 1_000_000 },
  { key: "billion", label: "billion years ago", multiplier: 1_000_000_000 },
] as const;

export type AgoUnit = (typeof AGO_UNITS)[number]["key"];

export const dateInputSchema = z.object({
  mode: z.enum(DATE_INPUT_MODES),
  // Calendar mode.
  year: z.number().finite().optional(),
  era: z.enum(["BCE", "CE"]).optional(),
  month: z.number().int().min(1).max(12).nullable().optional(),
  day: z.number().int().min(1).max(31).nullable().optional(),
  // "Years ago" mode.
  amount: z.number().finite().positive().optional(),
  unit: z.enum(["years", "thousand", "million", "billion"]).optional(),
});

export type DateInput = z.infer<typeof dateInputSchema>;

export type ResolvedDate = { year: number; month: number | null; day: number | null };

/**
 * One typed date → the astronomical year the database stores, or null when the
 * fields don't add up to a date at all.
 *
 * A "years ago" date carries no month or day on purpose: nobody knows which
 * Tuesday the dinosaurs went, and a form that let you say so would be inviting
 * a precision the claim doesn't have.
 */
export function resolveDateInput(input: DateInput | null | undefined): ResolvedDate | null {
  if (!input) return null;

  if (input.mode === "years_ago") {
    if (input.amount == null || !Number.isFinite(input.amount)) return null;
    const unit = AGO_UNITS.find((u) => u.key === (input.unit ?? "years")) ?? AGO_UNITS[0];
    const year = astronomicalFromYearsAgo(input.amount * unit.multiplier);
    return inRange(year) ? { year, month: null, day: null } : null;
  }

  if (input.year == null || !Number.isFinite(input.year)) return null;
  const year = astronomicalFromEra(input.year, (input.era ?? "CE") as Era);
  if (!inRange(year)) return null;
  const month = input.month ?? null;
  const day = month == null ? null : input.day ?? null;
  return { year, month, day };
}

function inRange(year: number): boolean {
  return year >= TIMELINE_MIN_YEAR && year <= TIMELINE_MAX_YEAR;
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const sourceDraftSchema = z.object({
  title: z.string().trim().min(1).max(300),
  author: z.string().trim().max(200).optional(),
  publisher: z.string().trim().max(200).optional(),
  work_title: z.string().trim().max(300).optional(),
  // Where in the source: "p. 108", "§ Dating and chronology", "12:04". One
  // field rather than a page field and a section field and a timestamp field,
  // because they are the same fact — WHICH BIT — and the form asks for it in
  // whichever wording suits the kind of source.
  reference: z.string().trim().max(200).optional(),
  url: z.string().trim().max(2000).optional(),
  file_url: z.string().trim().max(2000).optional(),
  source_type: z.string().trim().max(60).default("other"),
  notes: z.string().trim().max(4000).optional(),

  // WHEN SOMEBODY LOOKED AT IT. Not the same fact as when it was made, and it
  // is the one that matters for anything editable: the Wikipedia article cited
  // today is not the article cited last year, so a citation with no access date
  // cannot be checked by the next person. ISO, because a <input type="date">
  // gives us ISO and a `date` column wants ISO.
  accessed_on: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date like 2026-09-10.")
    .nullish(),

  // THE PASSAGE THE CLAIM RESTS ON, in the source's own words. "The report
  // says c. 2560 BCE" is an assertion; the sentence that says it is evidence.
  // Bounded at the same 2,000 characters the check constraint enforces — an
  // extract, never a copy of the chapter.
  quotation: z.string().trim().max(2000).optional(),

  // THE CITATION CHAIN. The source this one was found THROUGH: an excavation
  // report reached via an academic book reached via a Wikipedia article. Set
  // when a contributor answers "can you find the original source?", never
  // guessed.
  cited_by_source_id: z.string().uuid().nullish(),

  // WHEN THE SOURCE WAS MADE — never the same field as the date it claims.
  published: dateInputSchema.nullish(),
  published_is_approximate: z.boolean().default(false),
  published_display: z.string().trim().max(200).optional(),
});

export type SourceDraft = z.infer<typeof sourceDraftSchema>;

// ---------------------------------------------------------------------------
// Claims
// ---------------------------------------------------------------------------

export const claimDraftSchema = z.object({
  start: dateInputSchema,
  end: dateInputSchema.nullish(),

  // PRECISION, AS THE SOURCE GAVE IT.
  //
  // `date_precision` is the UNIT the source counted in (a DATE_UNITS key) and
  // `precision_decimals` is how many places it gave in that unit. Together they
  // are the whole of "preserve what the source supplied": 13.799 Ga is
  // (billion_years, 3) and prints with three places forever, while
  // "c. 300,000 years ago" is (thousand_years, 0) and can never acquire a
  // decimal point it was never given.
  date_precision: z.string().trim().max(40).default("year"),
  precision_decimals: z.number().int().min(0).max(9).default(0),

  is_approximate: z.boolean().default(false),

  // SOURCE-STATED TOLERANCE, IN THE CLAIM'S OWN UNIT — "± 0.021" alongside
  // "13.799 billion". Converted to years on the way to the database, where
  // every comparison happens; see resolveUncertaintyYears. A tolerance is NOT
  // the same claim as `end` (a proposed range), and the two never merge.
  uncertainty_plus_units: z.number().finite().min(0).nullish(),
  uncertainty_minus_units: z.number().finite().min(0).nullish(),

  // THE SOURCE'S OWN WORDS, verbatim — "c. 2560 BCE", "10 AH", "the third year
  // of the reign of Darius". Never derived from the numbers, never rewritten by
  // normalisation, and shown as a quotation rather than as the app's own claim.
  original_date_text: z.string().trim().max(300).default(""),

  dating_method: z.string().trim().max(60).nullish(),
  chronology: z.string().trim().max(60).nullish(),
  // Why the source gives this date. With confidence ratings gone, this is the
  // field that carries the weight — it is what "Why this date?" is for.
  evidence: z.string().trim().max(4000).nullish(),
  notes: z.string().trim().max(4000).nullish(),

  // Cite one the community already has, or add one here. Neither is required:
  // an undated wall of "somebody said so" helps nobody, but neither does
  // refusing an event because the child hasn't found the citation yet — the UI
  // says loudly that a date without a source is weaker.
  source_id: z.string().uuid().nullish(),
  new_source: sourceDraftSchema.nullish(),
});

export type ClaimDraft = z.infer<typeof claimDraftSchema>;

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export const eventDraftSchema = z.object({
  title: z.string().trim().min(2).max(200),
  summary: z.string().trim().max(300).default(""),
  description: z.string().trim().max(20000).default(""),
  category: z.string().trim().max(60).default("other"),
  subcategory: z.string().trim().max(60).nullish(),
  // What KIND of record this is (TIMELINE_EVENT_TYPES) — a historical event, a
  // scientific model, a religious account, a planned future event. Describes
  // the claim; never rates it. Null = nobody has said.
  event_type: z.string().trim().max(60).nullish(),
  event_type_note: z.string().trim().max(1000).nullish(),
  tags: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
  people: z.array(z.string().trim().min(1).max(120)).max(20).default([]),
  civilisations: z.array(z.string().trim().min(1).max(120)).max(20).default([]),
  location_name: z.string().trim().max(200).nullish(),
  lat: z.number().min(-90).max(90).nullish(),
  lng: z.number().min(-180).max(180).nullish(),
  image_url: z.string().trim().max(2000).nullish(),
  track_ids: z.array(z.string().uuid()).max(20).default([]),
  // At least one: an event with no proposed date has nowhere to be drawn.
  claims: z.array(claimDraftSchema).min(1).max(12),
});

export type EventDraft = z.infer<typeof eventDraftSchema>;

/** A blank date, in the mode most people want first. */
export function emptyDateInput(): DateInput {
  return { mode: "calendar", year: undefined, era: "CE", month: null, day: null, amount: undefined, unit: "million" };
}

export function emptyClaimDraft(): ClaimDraft {
  return {
    start: emptyDateInput(),
    end: null,
    date_precision: "year",
    precision_decimals: 0,
    is_approximate: false,
    uncertainty_plus_units: null,
    uncertainty_minus_units: null,
    original_date_text: "",
    dating_method: null,
    chronology: null,
    evidence: null,
    notes: null,
    source_id: null,
    new_source: null,
  };
}

/**
 * A tolerance typed in the claim's unit → the years the database stores.
 *
 * "± 0.021" against a billion_years claim is 21,000,000 years. Storing years
 * rather than the typed pair is what lets two claims in different units be
 * compared by subtraction instead of by unit negotiation.
 */
export function resolveUncertaintyYears(claim: ClaimDraft): { plus: number | null; minus: number | null } {
  const unit = dateUnit(claim.date_precision);
  const plus = claim.uncertainty_plus_units;
  const minus = claim.uncertainty_minus_units;
  return {
    plus: plus == null || !Number.isFinite(plus) ? null : plus * unit.years,
    // A source that publishes a single ± means it symmetrically. Only an
    // explicit second figure makes it asymmetric.
    minus: minus == null || !Number.isFinite(minus)
      ? (plus == null || !Number.isFinite(plus) ? null : plus * unit.years)
      : minus * unit.years,
  };
}

/**
 * The unit and decimals a typed "years ago" date implies.
 *
 * Somebody typing 13.799 billion has told us both that the unit is billions of
 * years and that they have three places of it — so the form fills both in
 * rather than making them say it twice, and they can still override either. It
 * is the difference between preserving the precision a source gave and asking a
 * child to describe it.
 */
export function precisionFromDateInput(input: DateInput): { unit: string; decimals: number } | null {
  if (input.mode !== "years_ago" || input.amount == null || !Number.isFinite(input.amount)) return null;
  const unitKey =
    input.unit === "billion" ? "billion_years" : input.unit === "million" ? "million_years" : "thousand_years";
  // "years" typed straight has no natural sub-unit — count it as thousands with
  // no decimals rather than inventing one.
  const decimals = String(input.amount).split(".")[1]?.length ?? 0;
  return { unit: input.unit === "years" ? "thousand_years" : unitKey, decimals: Math.min(9, decimals) };
}

/**
 * Today, as both an <input type="date"> and a Postgres `date` column want it.
 *
 * Local rather than UTC on purpose: somebody reading a page at 11pm in London
 * read it today, not tomorrow, and toISOString() would disagree.
 */
export function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function emptySourceDraft(): SourceDraft {
  return {
    title: "",
    source_type: "other",
    published: null,
    published_is_approximate: false,
  };
}
