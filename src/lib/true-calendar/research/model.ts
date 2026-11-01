// The True Calendar's research records: one zod schema per table, which is
// both the shape of a row (see the true_calendar_research migration) and the
// shape of a record in an import file. Keeping one definition means a file
// that validates here is a file the database will accept.
//
// Three layers stay separate (see the migration's header): historical claims,
// cycle rules that place a claim on a modern date, and modern interpretations.

import { z } from "zod";

export const EVIDENCE_TAGS = [
  "astronomically_calculated",
  "historically_documented",
  "ethnographically_documented",
  "oral_tradition",
  "scholarly_reconstruction",
  "contested",
  "modern_interpretation",
  "unverified_lead",
] as const;
export type EvidenceTag = (typeof EVIDENCE_TAGS)[number];

export const EVIDENCE_LABELS: Record<EvidenceTag, string> = {
  astronomically_calculated: "Astronomically calculated",
  historically_documented: "Historically documented",
  ethnographically_documented: "Ethnographically documented",
  oral_tradition: "Oral tradition",
  scholarly_reconstruction: "Scholarly reconstruction",
  contested: "Contested interpretation",
  modern_interpretation: "Modern interpretation",
  unverified_lead: "Unverified research lead",
};

export const REVIEW_STATUSES = ["draft", "in_review", "published", "rejected"] as const;
export const RESEARCH_STATUSES = ["not_started", "in_progress", "partial", "complete"] as const;
export type ResearchStatus = (typeof RESEARCH_STATUSES)[number];
export const RESEARCH_STATUS_LABELS: Record<ResearchStatus, string> = {
  not_started: "Research not started",
  in_progress: "Research in progress",
  partial: "Partly researched",
  complete: "Researched",
};

export const CONTINENTS = ["Africa", "Europe", "Middle East", "Asia", "Americas", "Oceania"] as const;
export const SYSTEM_KINDS = ["lunar", "solar", "lunisolar", "day_cycle", "stellar", "seasonal", "other"] as const;
export type SystemKind = (typeof SYSTEM_KINDS)[number];
export const SYSTEM_KIND_LABELS: Record<SystemKind, string> = {
  lunar: "Lunar",
  solar: "Solar",
  lunisolar: "Lunisolar",
  day_cycle: "Repeating day cycle",
  stellar: "Star-based",
  seasonal: "Seasonal",
  other: "Other",
};
export const MOON_PHASE_KEYS = ["new", "first_crescent", "waxing", "first_quarter", "full", "waning", "last_quarter", "dark"] as const;
export type MoonPhaseKey = (typeof MOON_PHASE_KEYS)[number];
export const FAVOURABILITY = ["favourable", "unfavourable", "mixed", "neutral"] as const;
export const ACTIVITIES = ["planting", "harvesting", "fishing", "travel", "trade", "rest", "ceremony", "remembrance", "community", "other"] as const;
export type Activity = (typeof ACTIVITIES)[number];
export const SOURCE_TYPES = ["primary_text", "archaeological", "academic", "ethnographic", "oral_history", "reference", "official", "web"] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];
export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  primary_text: "Original text",
  archaeological: "Archaeological evidence",
  academic: "Academic publication",
  ethnographic: "Ethnographic record",
  oral_history: "Oral history",
  reference: "Reference work",
  official: "Official or community publication",
  web: "Web page",
};

// A stable key: lower-case words joined by dots and hyphens, e.g.
// "west-africa.akan" or "west-africa.akan.adaduanan.akwasidae".
const key = z.string().regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/, "Keys are lower-case words joined by . or -").max(160);
const text = (max = 8000) => z.string().trim().min(1).max(max);
const optText = (max = 8000) => text(max).nullish();
const isoDate = z.string().regex(/^-?\d{4,6}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

// A citation attached to a claim in an import file.
export const citationSchema = z.object({
  source: key,
  locator: z.string().trim().max(200).default(""),
  quote: optText(2000),
  relation: z.enum(["supports", "disputes", "context"]).default("supports"),
});
export type Citation = z.infer<typeof citationSchema>;

const common = {
  evidence: z.array(z.enum(EVIDENCE_TAGS)).default([]),
  confidence: z.enum(["high", "medium", "low"]).nullish(),
  uncertainty: optText(4000),
  period_label: optText(200),
  review_status: z.enum(REVIEW_STATUSES).default("draft"),
  sources: z.array(citationSchema).default([]),
};

export const sourceSchema = z.object({
  key,
  title: text(500),
  author: optText(500),
  publisher: optText(500),
  published: optText(100),
  pages: optText(100),
  url: z.string().url().nullish(),
  accessed_on: isoDate.nullish(),
  source_type: z.enum(SOURCE_TYPES).default("academic"),
  notes: optText(2000),
  review_status: z.enum(REVIEW_STATUSES).default("draft"),
});

export const cultureSchema = z.object({
  key,
  name: text(200),
  alt_names: z.array(text(200)).default([]),
  continent: z.enum(CONTINENTS),
  region: optText(200),
  countries: z.array(text(100)).default([]),
  related_keys: z.array(key).default([]),
  period_start: z.number().int().nullish(),
  period_end: z.number().int().nullish(),
  continues_today: z.enum(["yes", "no", "partly", "unknown"]).nullish(),
  people: optText(),
  places: optText(),
  overview: optText(),
  research_status: z.enum(RESEARCH_STATUSES).default("not_started"),
  sort_order: z.number().int().default(0),
  ...common,
});

export const systemSchema = z.object({
  key,
  culture_key: key,
  name: text(200),
  original_name: optText(200),
  transliteration: optText(200),
  translation: optText(200),
  kind: z.enum(SYSTEM_KINDS),
  day_rule: optText(),
  month_rule: optText(),
  year_rule: optText(),
  intercalation: optText(),
  sky_and_seasons: optText(),
  reforms: optText(),
  description: optText(),
  ...common,
});

export const cycleSchema = z.object({
  key,
  system_key: key,
  name: text(200),
  original_name: optText(200),
  transliteration: optText(200),
  translation: optText(200),
  length_days: z.number().int().min(2).max(1000),
  description: optText(),
  anchor_date: isoDate.nullish(),
  anchor_position: z.number().int().min(0).nullish(),
  anchor_source_key: key.nullish(),
  anchor_note: optText(2000),
  regional_note: optText(2000),
  ...common,
});

export const cyclePositionSchema = z.object({
  key,
  cycle_key: key,
  position: z.number().int().min(0),
  name: text(200),
  original_name: optText(200),
  transliteration: optText(200),
  translation: optText(200),
  meaning: optText(),
  favourability: z.enum(FAVOURABILITY).nullish(),
  ...common,
});

export const monthSchema = z.object({
  key,
  system_key: key,
  ordinal: z.number().int(),
  name: text(200),
  original_name: optText(200),
  transliteration: optText(200),
  translation: optText(200),
  alt_names: z.array(text(200)).default([]),
  season: optText(200),
  description: optText(),
  ...common,
});

export const lunarDaySchema = z.object({
  key,
  system_key: key,
  day_number: z.number().int().min(1).max(30),
  name: optText(200),
  original_name: optText(200),
  transliteration: optText(200),
  translation: optText(200),
  meaning: optText(),
  favourability: z.enum(FAVOURABILITY).nullish(),
  ...common,
});

export const observanceSchema = z.object({
  key,
  culture_key: key,
  system_key: key.nullish(),
  name: text(200),
  original_name: optText(200),
  transliteration: optText(200),
  translation: optText(200),
  kind: z.enum(["festival", "ritual", "ceremony", "agricultural", "fishing", "market", "royal", "other"]).default("festival"),
  timing: optText(2000),
  month_key: key.nullish(),
  lunar_day: z.number().int().min(1).max(30).nullish(),
  cycle_position_key: key.nullish(),
  moon_phase: z.enum(MOON_PHASE_KEYS).nullish(),
  deities: optText(1000),
  description: optText(),
  ...common,
});

export const meaningSchema = z.object({
  key,
  culture_key: key,
  system_key: key.nullish(),
  subject: z.enum(["moon_phase", "lunar_day", "month", "cycle_position", "observance", "season", "general"]),
  subject_key: key.nullish(),
  moon_phase: z.enum(MOON_PHASE_KEYS).nullish(),
  meaning: text(),
  deities: optText(1000),
  interpretation: z.enum(["primary", "alternative"]).default("primary"),
  ...common,
});

export const recommendationSchema = z.object({
  key,
  culture_key: key,
  system_key: key.nullish(),
  cycle_position_key: key.nullish(),
  observance_key: key.nullish(),
  lunar_day_key: key.nullish(),
  meaning_key: key.nullish(),
  moon_phase: z.enum(MOON_PHASE_KEYS).nullish(),
  activity: z.enum(ACTIVITIES),
  historical_practice: text(),
  modern_interpretation: optText(),
  ...common,
});

export const correspondenceSchema = z.object({
  key,
  culture_key: key,
  system_key: key.nullish(),
  label: text(300),
  original_date: optText(300),
  gregorian_from: isoDate.nullish(),
  gregorian_to: isoDate.nullish(),
  certainty: z.enum(["exact", "approximate", "uncertain"]).default("uncertain"),
  notes: optText(),
  ...common,
});

// --- Tables, in the order an import writes them (parents first) --------------

export const IMPORT_SECTIONS = [
  { section: "sources", table: "calendar_sources", schema: sourceSchema },
  { section: "cultures", table: "calendar_cultures", schema: cultureSchema },
  { section: "systems", table: "calendar_systems", schema: systemSchema },
  { section: "cycles", table: "calendar_cycles", schema: cycleSchema },
  { section: "cycle_positions", table: "calendar_cycle_positions", schema: cyclePositionSchema },
  { section: "months", table: "calendar_months", schema: monthSchema },
  { section: "lunar_days", table: "calendar_lunar_days", schema: lunarDaySchema },
  { section: "observances", table: "calendar_observances", schema: observanceSchema },
  { section: "meanings", table: "calendar_meanings", schema: meaningSchema },
  { section: "recommendations", table: "calendar_recommendations", schema: recommendationSchema },
  { section: "date_correspondences", table: "calendar_date_correspondences", schema: correspondenceSchema },
] as const;

export type ImportSection = (typeof IMPORT_SECTIONS)[number]["section"];
export type CalendarTable = (typeof IMPORT_SECTIONS)[number]["table"];

export type SourceRecord = z.infer<typeof sourceSchema>;
export type CultureRecord = z.infer<typeof cultureSchema>;
export type SystemRecord = z.infer<typeof systemSchema>;
export type CycleRecord = z.infer<typeof cycleSchema>;
export type CyclePositionRecord = z.infer<typeof cyclePositionSchema>;
export type MonthRecord = z.infer<typeof monthSchema>;
export type LunarDayRecord = z.infer<typeof lunarDaySchema>;
export type ObservanceRecord = z.infer<typeof observanceSchema>;
export type MeaningRecord = z.infer<typeof meaningSchema>;
export type RecommendationRecord = z.infer<typeof recommendationSchema>;
export type CorrespondenceRecord = z.infer<typeof correspondenceSchema>;

/** A stored row: the record without its inline citations, plus bookkeeping. */
export type Stored<R> = Omit<R, "sources"> & { created_by: string | null; created_at: string; updated_at: string };

export const IMPORT_FORMAT = "true-calendar/v1";

export const importFileSchema = z.object({
  format: z.literal(IMPORT_FORMAT),
  sources: z.array(sourceSchema).default([]),
  cultures: z.array(cultureSchema).default([]),
  systems: z.array(systemSchema).default([]),
  cycles: z.array(cycleSchema).default([]),
  cycle_positions: z.array(cyclePositionSchema).default([]),
  months: z.array(monthSchema).default([]),
  lunar_days: z.array(lunarDaySchema).default([]),
  observances: z.array(observanceSchema).default([]),
  meanings: z.array(meaningSchema).default([]),
  recommendations: z.array(recommendationSchema).default([]),
  date_correspondences: z.array(correspondenceSchema).default([]),
});
export type ImportFile = z.infer<typeof importFileSchema>;

// --- Rows of the supporting tables ----------------------------------------------

export type CalendarClaimSource = {
  id: string;
  claim_table: string;
  claim_key: string;
  source_key: string;
  locator: string;
  quote: string | null;
  relation: "supports" | "disputes" | "context";
  created_by: string | null;
  created_at: string;
}

export type CalendarImportRun = {
  id: string;
  format_version: string;
  dry_run: boolean;
  summary: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
}

export type CalendarResearcher = {
  user_id: string;
  role: "researcher" | "reviewer";
  added_by: string | null;
  created_at: string;
}

export type CalendarBookmark = {
  id: string;
  user_id: string;
  space_id: string;
  kind: "date" | "culture";
  date_iso: string | null;
  culture_key: string | null;
  note: string | null;
  created_at: string;
}

export type CalendarResearchReview = {
  id: string;
  claim_table: string;
  claim_key: string;
  status: string;
  notes: string | null;
  reviewer_id: string | null;
  created_at: string;
};
