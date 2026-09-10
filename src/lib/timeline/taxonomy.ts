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

// WHERE THE INFORMATION CAME FROM.
//
// A source type answers "what kind of thing is this?" — an excavation report, a
// peer-reviewed paper, a documentary, an encyclopedia entry. It is not a
// viewpoint (see CLAIM_VIEWPOINTS) and it is not a score. A religious text can
// be cited for a conventional date and an academic paper can argue an
// alternative one; keeping the two axes apart is what lets a learner see that.
//
// `tier` is the standard primary / secondary / tertiary distinction taught in
// every research-skills lesson, and it is a FACT ABOUT THE KIND OF DOCUMENT,
// not a ranking of quality. A primary source can be wrong and a tertiary one
// can be excellent. It is surfaced so a learner can notice how far they are
// from the evidence — which is the question this whole feature is built to make
// askable.
export const SOURCE_TIERS = {
  primary: "Primary source",
  secondary: "Secondary source",
  tertiary: "Tertiary / reference source",
} as const;

export type SourceTier = keyof typeof SOURCE_TIERS;

export const TIMELINE_SOURCE_TYPES = [
  { key: "primary", label: "Primary source", tier: "primary", hint: "Made at the time by someone who was there." },
  { key: "archaeological", label: "Archaeological evidence", tier: "primary", hint: "Excavation reports, site records, dated finds." },
  { key: "historical_document", label: "Historical document", tier: "primary", hint: "Charters, chronicles, letters, inscriptions." },
  { key: "religious_text", label: "Religious or sacred text", tier: "primary", hint: "Scripture and commentary." },
  { key: "oral_tradition", label: "Oral tradition or testimony", tier: "primary", hint: "Knowledge carried by telling rather than writing." },
  { key: "government", label: "Government or official record", tier: "primary", hint: "Censuses, registries, state archives, official statistics." },
  { key: "interview", label: "Interview", tier: "primary", hint: "Somebody questioned directly, on the record." },

  { key: "academic_paper", label: "Academic / peer-reviewed", tier: "secondary", hint: "Research that other specialists have checked before publication." },
  { key: "academic_book", label: "Academic book", tier: "secondary", hint: "A scholarly book or monograph." },
  { key: "scientific_study", label: "Scientific study", tier: "secondary", hint: "Dating, measurement or modelling." },
  { key: "book", label: "Book", tier: "secondary", hint: "A published book for a general reader." },
  { key: "documentary", label: "Documentary", tier: "secondary", hint: "A film or series made about the subject." },
  { key: "video", label: "Video or recorded talk", tier: "secondary", hint: "A lecture, a channel, a recorded talk." },
  { key: "newspaper", label: "Newspaper or journalism", tier: "secondary", hint: "Reporting, in print or online." },
  { key: "museum", label: "Museum or institution", tier: "secondary", hint: "A collection, catalogue entry or exhibit." },
  { key: "secondary", label: "Secondary source", tier: "secondary", hint: "Written later, about the event." },
  { key: "modern_interpretation", label: "Modern interpretation", tier: "secondary", hint: "Somebody's reading of the evidence." },

  { key: "wikipedia", label: "Wikipedia", tier: "tertiary", hint: "An encyclopedia anyone can edit. A good place to start and a poor place to stop — follow its references." },
  { key: "encyclopedia", label: "Encyclopedia or reference work", tier: "tertiary", hint: "Britannica, a dictionary, a handbook — a summary of other people's work." },
  { key: "website", label: "Website", tier: "tertiary", hint: "An online article or reference page." },
  { key: "ai_chat", label: "Chat or AI conversation", tier: "tertiary", hint: "A transcript of a conversation with an AI assistant. It is a record of what was said, not evidence for what happened — whatever it pointed you at is the better source." },

  { key: "other", label: "Other", tier: null, hint: "" },
] as const;

export type TimelineSourceType = (typeof TIMELINE_SOURCE_TYPES)[number]["key"];

/** The one type with a form of its own — see the Wikipedia fields in the source panel. */
export const WIKIPEDIA_SOURCE_TYPE = "wikipedia";

/** A shared AI conversation, whose transcript is the whole of the source. */
export const AI_CHAT_SOURCE_TYPE = "ai_chat";

const SOURCE_TYPE_BY_KEY = new Map(TIMELINE_SOURCE_TYPES.map((type) => [type.key as string, type]));

/**
 * Primary, secondary or tertiary — a fact about the kind of document, never a
 * verdict on it. Null for "Other" and for anything a community invented, where
 * asserting a tier would be a guess.
 */
export function sourceTier(key: string | null | undefined): SourceTier | null {
  return (SOURCE_TYPE_BY_KEY.get(key ?? "")?.tier as SourceTier | null) ?? null;
}

export function sourceTierLabel(key: string | null | undefined): string | null {
  const tier = sourceTier(key);
  return tier ? SOURCE_TIERS[tier] : null;
}

// Kinds of source that live at a URL and can be edited after you have cited
// them. For these the access date is not bookkeeping — it is the only thing
// that tells the next reader WHICH version of the page the claim came from.
const WANTS_ACCESS_DATE = new Set(["wikipedia", "encyclopedia", "website", "ai_chat", "video", "newspaper", "documentary"]);

export function sourceTypeWantsAccessDate(key: string | null | undefined): boolean {
  return WANTS_ACCESS_DATE.has(key ?? "");
}

export function sourceTypeHint(key: string | null | undefined): string {
  return SOURCE_TYPE_BY_KEY.get(key ?? "")?.hint ?? "";
}

export function sourceTypeLabel(key: string | null | undefined): string {
  return SOURCE_TYPE_BY_KEY.get(key ?? "")?.label ?? "Other";
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

// WHOSE ACCOUNT THIS IS.
//
// A viewpoint describes the CLAIM: which body of thought a date comes out of.
// It is not a source type (that describes the document) and it is emphatically
// not a score. Naming a viewpoint says where a number comes from, never whether
// Relate agrees with it — and the UI must keep saying so, because a list with
// "Mainstream" at the top of it is exactly the sort of thing a reader will
// mistake for a ranking if nobody tells them otherwise.
//
// "Mainstream / established view" is the relabelling of what used to be called
// "Conventional". It is the same idea under a clearer name, so every date
// already filed as conventional reads correctly without a backfill — and a
// second, near-identical entry beside it would have been a trap.
//
// The order is editorial, not a hierarchy: the viewpoints most claims will use
// come first so the dropdown is quick, and the comparison panel renders groups
// in this order for the same reason.
export const CLAIM_VIEWPOINTS = [
  {
    key: "conventional",
    label: "Mainstream / established view",
    hint:
      "The generally accepted account in current scholarship — academic research, archaeology, science, textbooks, museums, universities. " +
      "This does NOT mean the claim is unquestionably true. It means this is the broadly accepted interpretation today.",
  },
  {
    key: "alternative",
    label: "Alternative interpretation",
    hint:
      "A reading put forward outside the mainstream account. Naming it alternative says where it sits, not that it is wrong — " +
      "the evidence and the reasoning are shown so a reader can weigh it themselves.",
  },
  { key: "disputed", label: "Disputed / contested claim", hint: "Specialists actively disagree about this one." },
  { key: "historical", label: "Historical account", hint: "As given in the written historical record." },
  { key: "archaeological", label: "Archaeological", hint: "Worked out from physical evidence and site sequences." },
  { key: "scientific", label: "Scientific", hint: "From measurement, dating or modelling." },
  { key: "hypothesis", label: "Scientific hypothesis", hint: "Proposed and testable, not yet established." },
  { key: "geological", label: "Geological", hint: "From the rock record and its timescale." },
  { key: "traditional", label: "Traditional account", hint: "Carried by a tradition or a people's own telling." },
  { key: "oral_tradition", label: "Oral tradition", hint: "Passed on by telling rather than by writing." },
  { key: "indigenous", label: "Indigenous knowledge", hint: "The knowledge of a people about their own history and country." },
  { key: "religious", label: "Religious / sacred tradition", hint: "As held within a religious tradition." },
  { key: "biblical", label: "Biblical chronology", hint: "Calculated from dates given in the Bible." },
  { key: "islamic", label: "Islamic chronology", hint: "Calculated within the Islamic calendar and tradition." },
  { key: "hindu", label: "Hindu chronology", hint: "Calculated within Hindu cosmology and tradition." },
  { key: "community", label: "Personal / community claim", hint: "Somebody's own account, or this community's own reading." },
  { key: "other", label: "Other", hint: "" },
] as const;

export type ClaimViewpoint = (typeof CLAIM_VIEWPOINTS)[number]["key"];

/**
 * The old export name. `chronology` is still the column, and plenty of the code
 * reads better saying "viewpoint", so both names point at one list rather than
 * two lists drifting apart.
 */
export const CHRONOLOGIES = CLAIM_VIEWPOINTS;

const VIEWPOINT_BY_KEY = new Map(CLAIM_VIEWPOINTS.map((viewpoint) => [viewpoint.key as string, viewpoint]));

/** Where a viewpoint sits in the dropdown, so comparison groups render in the same order. */
export function viewpointOrder(key: string | null | undefined): number {
  const index = CLAIM_VIEWPOINTS.findIndex((viewpoint) => viewpoint.key === key);
  return index === -1 ? CLAIM_VIEWPOINTS.length : index;
}

export function viewpointHint(key: string | null | undefined): string {
  return VIEWPOINT_BY_KEY.get(key ?? "")?.hint ?? "";
}

export function chronologyLabel(key: string | null | undefined): string {
  return VIEWPOINT_BY_KEY.get(key ?? "")?.label ?? (key ? key.replace(/_/g, " ") : "Not stated");
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
  {
    key: "mainstream",
    label: "Mainstream / established view",
    hint:
      "The generally accepted account in current scholarship — research, archaeology, science, textbooks, museums. " +
      "Not a declaration that it is unquestionably true; it is what is broadly accepted today, shown so it can be compared with the rest.",
  },
  { key: "historical", label: "Historical event", hint: "Something recorded as having happened." },
  { key: "scientific_model", label: "Scientific model or event", hint: "An event as described by a scientific model." },
  { key: "traditional_account", label: "Traditional account", hint: "Carried by a tradition or a people's own telling." },
  { key: "religious_account", label: "Religious account", hint: "As given in a religious tradition or text." },
  { key: "archaeological_interpretation", label: "Archaeological interpretation", hint: "A reading of physical evidence." },
  { key: "alternative", label: "Alternative interpretation", hint: "A reading put forward outside the mainstream account." },
  { key: "disputed", label: "Disputed or contested", hint: "Specialists actively disagree about this." },
  { key: "hypothesised", label: "Proposed or hypothesised", hint: "Put forward, not established." },
  { key: "future_prediction", label: "Future prediction", hint: "Expected, calculated or forecast." },
  { key: "planned_future", label: "Planned future event", hint: "Scheduled by someone — a launch, a trip, an anniversary." },
  { key: "other", label: "Other", hint: "" },
] as const;

export type TimelineEventType = (typeof TIMELINE_EVENT_TYPES)[number]["key"];

export function eventTypeHint(key: string | null | undefined): string {
  return TIMELINE_EVENT_TYPES.find((type) => type.key === key)?.hint ?? "";
}

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
