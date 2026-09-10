import {
  Landmark,
  FlaskConical,
  Church,
  Crown,
  Users,
  Cpu,
  Leaf,
  Shovel,
  Palette,
  Compass,
  Rocket,
  Circle,
  type LucideIcon,
} from "lucide-react";

// The vocabularies the timeline files things under.
//
// Code lists rather than tables, for the same reason location_type and
// business categories are: a community adds an event far more often than the
// platform adds a category, and a list in code is one edit rather than a
// migration plus a seed plus a backfill. Every column that reads from these is
// plain `text`, NOT an enum — so a community that files something under a word
// we didn't think of gets to keep it, and the UI falls back to showing the raw
// value rather than dropping it.

export type TimelineCategoryKey =
  | "history"
  | "science"
  | "religion"
  | "civilisation"
  | "people"
  | "technology"
  | "nature"
  | "archaeology"
  | "culture"
  | "exploration"
  | "future"
  | "other";

// `string & {}` keeps autocomplete for the built-ins while letting a custom
// value through — the same trick BusinessCategory uses.
export type TimelineCategory = TimelineCategoryKey | (string & {});

export interface TimelineCategoryMeta {
  key: TimelineCategoryKey;
  label: string;
  icon: LucideIcon;
  /** Tailwind classes for the dot and chip. Distinct hues, all readable in both themes. */
  dotClass: string;
  chipClass: string;
}

export const TIMELINE_CATEGORIES: TimelineCategoryMeta[] = [
  { key: "history", label: "History", icon: Landmark, dotClass: "bg-amber-500", chipClass: "bg-amber-500/12 text-amber-700 dark:text-amber-300" },
  { key: "science", label: "Science", icon: FlaskConical, dotClass: "bg-sky-500", chipClass: "bg-sky-500/12 text-sky-700 dark:text-sky-300" },
  { key: "religion", label: "Religion", icon: Church, dotClass: "bg-violet-500", chipClass: "bg-violet-500/12 text-violet-700 dark:text-violet-300" },
  { key: "civilisation", label: "Civilisation", icon: Crown, dotClass: "bg-orange-500", chipClass: "bg-orange-500/12 text-orange-700 dark:text-orange-300" },
  { key: "people", label: "People", icon: Users, dotClass: "bg-rose-500", chipClass: "bg-rose-500/12 text-rose-700 dark:text-rose-300" },
  { key: "technology", label: "Technology", icon: Cpu, dotClass: "bg-cyan-500", chipClass: "bg-cyan-500/12 text-cyan-700 dark:text-cyan-300" },
  { key: "nature", label: "Nature", icon: Leaf, dotClass: "bg-emerald-500", chipClass: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" },
  { key: "archaeology", label: "Archaeology", icon: Shovel, dotClass: "bg-stone-500", chipClass: "bg-stone-500/12 text-stone-700 dark:text-stone-300" },
  { key: "culture", label: "Culture", icon: Palette, dotClass: "bg-pink-500", chipClass: "bg-pink-500/12 text-pink-700 dark:text-pink-300" },
  { key: "exploration", label: "Exploration", icon: Compass, dotClass: "bg-teal-500", chipClass: "bg-teal-500/12 text-teal-700 dark:text-teal-300" },
  { key: "future", label: "Future", icon: Rocket, dotClass: "bg-indigo-500", chipClass: "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300" },
  { key: "other", label: "Other", icon: Circle, dotClass: "bg-slate-400", chipClass: "bg-slate-500/12 text-slate-700 dark:text-slate-300" },
];

const CATEGORY_BY_KEY = new Map(TIMELINE_CATEGORIES.map((c) => [c.key as string, c]));

export function timelineCategory(key: string | null | undefined): TimelineCategoryMeta {
  return CATEGORY_BY_KEY.get(key ?? "") ?? TIMELINE_CATEGORIES[TIMELINE_CATEGORIES.length - 1];
}

/** A category a community invented keeps its own wording rather than becoming "Other". */
export function timelineCategoryLabel(key: string | null | undefined): string {
  if (!key) return "Other";
  const known = CATEGORY_BY_KEY.get(key);
  if (known) return known.label;
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const TIMELINE_SOURCE_TYPES = [
  { key: "primary", label: "Primary source", hint: "Made at the time by someone who was there." },
  { key: "secondary", label: "Secondary source", hint: "Written later, about the event." },
  { key: "academic_paper", label: "Academic paper", hint: "Peer-reviewed research." },
  { key: "archaeological", label: "Archaeological evidence", hint: "Excavation reports, site records, dated finds." },
  { key: "scientific_study", label: "Scientific study", hint: "Dating, measurement or modelling." },
  { key: "historical_document", label: "Historical document", hint: "Charters, chronicles, letters, inscriptions." },
  { key: "religious_text", label: "Religious text", hint: "Scripture and commentary." },
  { key: "oral_tradition", label: "Oral tradition", hint: "Knowledge carried by telling rather than writing." },
  { key: "book", label: "Book", hint: "A published book." },
  { key: "website", label: "Website", hint: "An online article or reference page." },
  { key: "museum", label: "Museum or archive", hint: "A collection, catalogue entry or exhibit." },
  { key: "modern_interpretation", label: "Modern interpretation", hint: "Somebody's reading of the evidence." },
  { key: "other", label: "Other", hint: "" },
] as const;

export type TimelineSourceType = (typeof TIMELINE_SOURCE_TYPES)[number]["key"];

export function sourceTypeLabel(key: string | null | undefined): string {
  return TIMELINE_SOURCE_TYPES.find((t) => t.key === key)?.label ?? "Other";
}

// ---------------------------------------------------------------------------
// How a date was arrived at
// ---------------------------------------------------------------------------

export const DATING_METHODS = [
  { key: "historical_record", label: "Written contemporary record", hint: "Somebody writing at the time named the date." },
  { key: "regnal_chronology", label: "Regnal chronology", hint: "Counted through a list of kings, reigns or dynasties." },
  { key: "genealogy", label: "Genealogy", hint: "Counted through generations of a family line." },
  { key: "textual_interpretation", label: "Textual interpretation", hint: "Worked out by reading and interpreting a text." },
  { key: "archaeological", label: "Archaeological context", hint: "Where the find sat, and what it sat with." },
  { key: "stratigraphic", label: "Stratigraphy", hint: "Which layer it was in, and what lies above and below." },
  { key: "radiocarbon", label: "Radiocarbon dating", hint: "Carbon-14 decay in organic material." },
  { key: "radiometric", label: "Radiometric dating", hint: "Decay of longer-lived isotopes in rock." },
  { key: "dendrochronology", label: "Dendrochronology (tree rings)", hint: "Counting and matching growth rings." },
  { key: "geological", label: "Geological dating", hint: "The rock record, and how long it takes to form." },
  { key: "astronomical", label: "Astronomical calculation", hint: "Eclipses and other sky events that can be calculated backwards." },
  { key: "genetic", label: "Genetic", hint: "Molecular clocks and population genetics." },
  { key: "oral_tradition", label: "Oral tradition", hint: "Generations counted or remembered and passed on by telling." },
  { key: "source_assertion", label: "The source simply states it", hint: "No working is given — the source asserts the date." },
  { key: "estimate", label: "Scholarly estimate", hint: "An informed judgement, not a measurement." },
  { key: "other", label: "Other", hint: "" },
] as const;

export function datingMethodLabel(key: string | null | undefined): string {
  return DATING_METHODS.find((m) => m.key === key)?.label ?? (key ? key.replace(/_/g, " ") : "Not stated");
}

export function datingMethodHint(key: string | null | undefined): string {
  return DATING_METHODS.find((m) => m.key === key)?.hint ?? "";
}

// ---------------------------------------------------------------------------
// Whose chronology this is
//
// A viewpoint labels the FRAMEWORK a date is calculated within — conventional
// Egyptology, a geological timescale, a biblical chronology, an alternative
// one. It is not a ranking and the UI must never render it as one: naming a
// framework says where a number comes from, not whether Relate agrees with it.
//
// Kept separate from source type on purpose. "Academic paper" and "Religious
// text" describe the KIND OF DOCUMENT a claim came from; "Conventional" and
// "Biblical" describe the SYSTEM OF RECKONING it was calculated in. An academic
// paper can argue an alternative chronology and a religious text can be cited
// for a conventional date, so collapsing the two would lose information a
// student needs to compare them.
// ---------------------------------------------------------------------------

export const CHRONOLOGIES = [
  { key: "conventional", label: "Conventional" },
  { key: "archaeological", label: "Archaeological" },
  { key: "geological", label: "Geological" },
  { key: "scientific", label: "Scientific" },
  { key: "biblical", label: "Biblical" },
  { key: "islamic", label: "Islamic" },
  { key: "hindu", label: "Hindu" },
  { key: "indigenous", label: "Indigenous / oral tradition" },
  { key: "alternative", label: "Alternative chronology" },
  { key: "community", label: "Community interpretation" },
  { key: "other", label: "Other" },
] as const;

export function chronologyLabel(key: string | null | undefined): string {
  return CHRONOLOGIES.find((c) => c.key === key)?.label ?? (key ? key.replace(/_/g, " ") : "Not stated");
}

// ---------------------------------------------------------------------------
// What KIND of record an event is
//
// Not how credible it is. "Religious account" and "Scientific model" describe
// where a record comes from and what sort of claim it makes; neither is a mark
// out of ten, and the UI must never render them as one. A reader who knows they
// are looking at a traditional account rather than an excavation report can
// weigh it themselves — which is the entire point, and is something a
// credibility badge actively prevents.
//
// Nothing sets this automatically. Null means nobody has said.
// ---------------------------------------------------------------------------

export const TIMELINE_EVENT_TYPES = [
  { key: "historical", label: "Historical event", hint: "Something recorded as having happened." },
  { key: "scientific_model", label: "Scientific model or event", hint: "An event as described by a scientific model." },
  { key: "traditional_account", label: "Traditional account", hint: "Carried by a tradition or a people's own telling." },
  { key: "religious_account", label: "Religious account", hint: "As given in a religious tradition or text." },
  { key: "archaeological_interpretation", label: "Archaeological interpretation", hint: "A reading of physical evidence." },
  { key: "hypothesised", label: "Proposed or hypothesised", hint: "Put forward, not established." },
  { key: "future_prediction", label: "Future prediction", hint: "Expected, calculated or forecast." },
  { key: "planned_future", label: "Planned future event", hint: "Scheduled by someone — a launch, a trip, an anniversary." },
  { key: "other", label: "Other", hint: "" },
] as const;

export type TimelineEventType = (typeof TIMELINE_EVENT_TYPES)[number]["key"];

export function eventTypeLabel(key: string | null | undefined): string | null {
  if (!key) return null;
  return (
    TIMELINE_EVENT_TYPES.find((type) => type.key === key)?.label ??
    key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")
  );
}

// ---------------------------------------------------------------------------
// The lanes Compare mode reads
//
// Only ever used to SEED a community's timeline_tracks on request — once
// created they are the community's own rows, renameable and deletable. Nothing
// reads this list at render time, so a community that deletes "Europe" doesn't
// get it back on the next deploy.
// ---------------------------------------------------------------------------

export const STARTER_TRACKS: { name: string; slug: string; kind: "region" | "theme"; color: string }[] = [
  { name: "Ancient Egypt", slug: "ancient-egypt", kind: "region", color: "#c98a2e" },
  { name: "Mesopotamia", slug: "mesopotamia", kind: "region", color: "#b4603a" },
  { name: "China", slug: "china", kind: "region", color: "#b23b3b" },
  { name: "India", slug: "india", kind: "region", color: "#c2632f" },
  { name: "The Americas", slug: "the-americas", kind: "region", color: "#2f8f6b" },
  { name: "Africa", slug: "africa", kind: "region", color: "#8a6b2f" },
  { name: "Europe", slug: "europe", kind: "region", color: "#3f6fa8" },
  { name: "Science", slug: "science", kind: "theme", color: "#2f7fa8" },
  { name: "Religion", slug: "religion", kind: "theme", color: "#7a52a8" },
  { name: "Technology", slug: "technology", kind: "theme", color: "#2f8fa0" },
];

// The palette a lane falls back to when nobody has picked it a colour.
export const TRACK_PALETTE = ["#4d6a52", "#b4603a", "#3f6fa8", "#8a6b2f", "#7a52a8", "#2f8f6b", "#b23b3b", "#2f7fa8", "#c98a2e", "#5a6b7a"];

export function trackColor(color: string | null | undefined, index: number): string {
  return color ?? TRACK_PALETTE[index % TRACK_PALETTE.length];
}
