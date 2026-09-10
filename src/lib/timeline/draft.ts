import { z } from "zod";
import { astronomicalFromEra, astronomicalFromYearsAgo, TIMELINE_MAX_YEAR, TIMELINE_MIN_YEAR, type Era } from "./time";

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
  reference: z.string().trim().max(200).optional(),
  url: z.string().trim().max(2000).optional(),
  file_url: z.string().trim().max(2000).optional(),
  source_type: z.string().trim().max(60).default("other"),
  notes: z.string().trim().max(4000).optional(),
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
  date_precision: z.string().trim().max(40).default("year"),
  is_approximate: z.boolean().default(false),
  display_text: z.string().trim().max(200).default(""),
  dating_method: z.string().trim().max(60).nullish(),
  chronology: z.string().trim().max(60).nullish(),
  confidence: z.enum(["high", "medium", "low", "contested"]).nullish(),
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
    is_approximate: false,
    display_text: "",
    dating_method: null,
    chronology: null,
    confidence: null,
    evidence: null,
    notes: null,
    source_id: null,
    new_source: null,
  };
}

export function emptySourceDraft(): SourceDraft {
  return {
    title: "",
    source_type: "other",
    published: null,
    published_is_approximate: false,
  };
}
