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
// How one record relates to another
//
// A relationship is a claim. "Mu is Lemuria" is something particular writers
// asserted at a particular time, not a fact the database knows — so an edge
// carries a source and a viewpoint the way a date claim does, and the wording
// below is chosen so that no relation reads as a verdict.
//
// The distinction that earned this list its existence is between `associated`
// and `identified`. Later writers TREAT Mu and Lemuria as one thing; that is a
// fact about the literature. Whether they ARE one thing is not established by
// anybody, and an edge that could not tell those apart would have settled it.
// ---------------------------------------------------------------------------

export const EVENT_RELATIONS = [
  {
    key: "precedes",
    label: "Comes before",
    inverse: "Comes after",
    hint: "In this tradition's ordering, this record comes before that one. An ordering claim, which is a real claim even without dates attached.",
  },
  {
    key: "associated",
    label: "Often associated with",
    inverse: "Often associated with",
    hint:
      "Later writers treat these together, or as the same thing. A fact about the literature — NOT a finding that they are the same, which is a different claim that needs its own source.",
  },
  {
    key: "identified",
    label: "Identified with, by a named source",
    inverse: "Identified with, by a named source",
    hint: "A particular source explicitly says these are the same. The source is on the edge, so a reader can see who made the identification rather than meeting it as settled.",
  },
  {
    key: "responds_to",
    label: "Answers or reworks",
    inverse: "Answered or reworked by",
    hint: "This record is a response to that one — an answer to its question, a reworking of its material, or a correction of it.",
  },
  {
    key: "relevant",
    label: "Relevant to, without being evidence for",
    inverse: "Relevant to, without being evidence for",
    hint:
      "Connected by subject or geography and nothing more. The relation exists so that genuinely relevant things can be linked WITHOUT the link being read as support.",
  },
  {
    key: "evidence_for",
    label: "Offered as evidence for",
    inverse: "Has this offered as evidence",
    hint: "Somebody puts this forward as evidence for that. Who does, and on what grounds, is on the edge.",
  },
  {
    key: "source_of",
    label: "Supplied the material for",
    inverse: "Draws its material from",
    hint: "This record is where the other one's material comes from — a text, a testimony, an excavation.",
  },
  { key: "related", label: "Worth reading alongside", inverse: "Worth reading alongside", hint: "A pointer, in no particular direction." },
] as const;

export type EventRelationKey = (typeof EVENT_RELATIONS)[number]["key"];
export type EventRelation = EventRelationKey | (string & {});

const RELATION_BY_KEY = new Map(EVENT_RELATIONS.map((relation) => [relation.key as string, relation]));

/** How this edge reads from the record it points AT, rather than from the one it starts at. */
export function relationLabel(key: string | null | undefined, direction: "from" | "to" = "from"): string {
  const known = RELATION_BY_KEY.get(key ?? "");
  if (known) return direction === "from" ? known.label : known.inverse;
  if (!key) return "Related to";
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
}

export function relationHint(key: string | null | undefined): string {
  return RELATION_BY_KEY.get(key ?? "")?.hint ?? "";
}

// ---------------------------------------------------------------------------
// WHAT KIND OF CLAIM ABOUT TIME THIS IS
//
// The timeline has always been able to say WHEN a source puts something and
// WHOSE framework that belongs to. What it could not say is what kind of
// temporal assertion is being made at all — and on the age of the universe
// that is the whole argument rather than a detail.
//
// "13.8 billion years ago" and "4004 BCE" are both numbers on the same axis,
// and they are not the same kind of statement: one is a parameter fitted to
// observations and revised when the observations improve, the other is the
// output of an addition somebody performed on genealogies. A reader who cannot
// tell those apart has been taught that all dating is one activity.
//
// And the last four are the reason the column exists. A model asserting that
// the universe has no first moment is making a claim about time — a strong one,
// argued for in named papers — not failing to supply a date. Everything above
// is POSITIONED; everything below asserts something a position cannot express.
// ---------------------------------------------------------------------------

export const TEMPORAL_CLAIM_TYPES = [
  {
    key: "absolute_date",
    label: "A date",
    positioned: true,
    hint: "A specific date, given as such — 14 October 1066. What most records on a timeline are.",
  },
  {
    key: "approximate_date",
    label: "An approximate date",
    positioned: true,
    hint: "A date the source itself hedges — “c. 2560 BCE”. The hedge belongs to the source, not to us.",
  },
  {
    key: "date_range",
    label: "A range",
    positioned: true,
    hint: "Somewhere between two dates, with the source declining to narrow it further.",
  },
  {
    key: "years_ago",
    label: "Counted back from now",
    positioned: true,
    hint:
      "Stated as an age rather than as a calendar year — “about 12,000 years ago”. The calendar date is then arithmetic, " +
      "and it moves as the year the source was written recedes.",
  },
  {
    key: "calculated_date",
    label: "A calculated date",
    positioned: true,
    hint:
      "Derived by somebody's reckoning from other material rather than measured or recorded — Ussher's 4004 BCE, added up " +
      "from genealogies. The calculation is the claim, and whose it is matters.",
  },
  {
    key: "relative_date",
    label: "Fixed against another event",
    positioned: true,
    hint: "Dated by its distance from something else rather than against a calendar.",
  },
  { key: "before_event", label: "Before another event", positioned: true, hint: "Known only to be earlier than something else." },
  { key: "after_event", label: "After another event", positioned: true, hint: "Known only to be later than something else." },
  {
    key: "explicit_date",
    label: "A date the source states",
    positioned: true,
    hint: "The source names the date itself, in its own words, rather than leaving it to be worked out.",
  },
  {
    key: "traditional_date",
    label: "A date the tradition gives",
    positioned: true,
    hint:
      "Carried by a tradition rather than measured or calculated — the date the tradition itself places the event at. " +
      "How it was arrived at is usually not recoverable, and saying so is more honest than assigning a method.",
  },
  {
    key: "genealogical_date",
    label: "Counted through generations",
    positioned: true,
    hint:
      "Reached by adding up a line of descent — so many generations, at so many years each. The result is only as firm as " +
      "the genealogy and the assumed generation length, and different chronologists reach different years from the same list.",
  },
  {
    key: "archaeological_date",
    label: "From excavation",
    positioned: true,
    hint: "Dated from what was dug up and the layers it sat in. It dates the DEPOSIT, which is not automatically the event a story describes.",
  },
  {
    key: "geological_date",
    label: "From the rock and sediment record",
    positioned: true,
    hint: "Dated from physical traces — sediments, cores, landforms, shorelines. Establishes that something physical happened, not what anybody later said about it.",
  },
  {
    key: "radiometric_date",
    label: "Radiometrically dated",
    positioned: true,
    hint: "From the decay of isotopes in the material itself. Carries a stated laboratory uncertainty, which belongs on the claim rather than being rounded away.",
  },
  {
    key: "estimated_range",
    label: "An estimated range",
    positioned: true,
    hint: "A span somebody proposes as the likely window, without narrowing it further. The width is part of the claim.",
  },
  {
    key: "proposed_correlation",
    label: "A proposed correlation",
    positioned: true,
    hint:
      "Somebody has suggested this record lines up with a dated event elsewhere. A PROPOSAL ABOUT A RELATIONSHIP, not a dating of the " +
      "record itself — the correlation is the claim, and who made it is the interesting part.",
  },
  {
    key: "date_of_first_known_record",
    label: "When it was first written down",
    positioned: true,
    hint:
      "The earliest surviving version, which is a fact about the manuscript rather than about the event. A story recorded in 650 CE " +
      "may be far older; the record date is what can actually be checked.",
  },

  // --- Nothing below here goes on the axis ---------------------------------
  {
    key: "cyclic",
    label: "A repeating cycle",
    positioned: false,
    hint:
      "Time as a cycle rather than a line: the span repeats, and asking which one we are in is a different question from " +
      "when it started. A length within such a cycle has no position either.",
  },
  {
    key: "eternal",
    label: "Eternal",
    positioned: false,
    hint: "Asserted to have always existed and to have no end. Not a date anybody has failed to find.",
  },
  {
    key: "no_beginning",
    label: "No finite beginning",
    positioned: false,
    hint:
      "Asserted to have no first moment. A positive claim about time — the classical Steady State model argues for it — and " +
      "not a gap in the record. It has no place on the axis because it claims none.",
  },
  {
    key: "primordial",
    label: "In the first times",
    positioned: false,
    hint:
      "Placed in an originating age before ordinary reckoning — the beginning of the world, the time of the ancestors, a previous " +
      "creation. Giving it a BCE year would answer a question the tradition does not ask.",
  },
  {
    key: "previous_world",
    label: "In a previous world or age",
    positioned: false,
    hint:
      "The account places the event in an earlier world that ended, within a sequence of such worlds. Its position is relative to the " +
      "other ages, not to a calendar.",
  },
  {
    key: "unknown",
    label: "Explicitly not known",
    positioned: false,
    hint: "The source says the date is not known, which is different from nobody having filled it in.",
  },
] as const;

export type TemporalClaimTypeKey = (typeof TEMPORAL_CLAIM_TYPES)[number]["key"];
export type TemporalClaimType = TemporalClaimTypeKey | (string & {});

const TEMPORAL_TYPE_BY_KEY = new Map(TEMPORAL_CLAIM_TYPES.map((type) => [type.key as string, type]));

export function temporalTypeLabel(key: string | null | undefined): string | null {
  if (!key) return null;
  return TEMPORAL_TYPE_BY_KEY.get(key)?.label ?? key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
}

export function temporalTypeHint(key: string | null | undefined): string {
  return TEMPORAL_TYPE_BY_KEY.get(key ?? "")?.hint ?? "";
}

/**
 * Does a claim of this kind belong on the axis?
 *
 * The database asks the same question in a CHECK constraint, and the two lists
 * must agree: these four are exactly the types permitted a null start_year.
 * Unknown keys are treated as positioned, which is the safe direction — a claim
 * WITH a date whose type we do not recognise still draws correctly.
 */
export function temporalTypeIsPositioned(key: string | null | undefined): boolean {
  const known = TEMPORAL_TYPE_BY_KEY.get(key ?? "");
  return known ? known.positioned : true;
}

// ---------------------------------------------------------------------------
// HOW THE SOURCE EXPRESSED THE DATE
//
// Storage is always an astronomical year. This says what frame it came out of,
// and it exists because "14,600 years ago" and "14,600 BCE" differ by 1,950
// years — enough to move a tradition from the end of the Younger Dryas to
// nowhere near it, and to manufacture a correlation that is pure arithmetic.
//
// Keeping the frame means the claim can be re-derived, and means the UI can
// say "12,000 years ago, counted from 1926" instead of presenting our own
// subtraction as the source's words.
// ---------------------------------------------------------------------------

export const DATE_CONVENTIONS = [
  {
    key: "calendar",
    label: "A calendar year",
    needsReference: false,
    hint: "The source names a year — 4004 BC, 1650. It counts from nothing, so there is no reference year.",
  },
  {
    key: "before_present",
    label: "Before present (BP)",
    needsReference: true,
    hint:
      "The scientific convention, where “present” is fixed at 1950 — radiocarbon's zero, held still so a published date does not " +
      "drift as the years pass. 14,600 BP is about 12,650 BCE, not 14,600 BCE.",
  },
  {
    key: "years_ago",
    label: "“Years ago”, from the source's own time",
    needsReference: true,
    hint:
      "The source says “about 12,000 years ago” and means ago from when IT was written. Churchward writing in 1926 counts from 1926. " +
      "The reference year is part of the claim, not a detail.",
  },
  {
    key: "relative",
    label: "Counted from another event",
    needsReference: false,
    hint: "“Nine thousand years before Solon.” The figure is an interval, and turning it into a year requires dating the other end.",
  },
  { key: "unknown", label: "Not recorded", needsReference: false, hint: "The convention behind the figure is not known." },
] as const;

export type DateConventionKey = (typeof DATE_CONVENTIONS)[number]["key"];

const CONVENTION_BY_KEY = new Map(DATE_CONVENTIONS.map((convention) => [convention.key as string, convention]));

export function dateConventionLabel(key: string | null | undefined): string | null {
  if (!key) return null;
  return CONVENTION_BY_KEY.get(key)?.label ?? key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
}

export function dateConventionHint(key: string | null | undefined): string {
  return CONVENTION_BY_KEY.get(key ?? "")?.hint ?? "";
}

/** Does "ago" mean anything for this convention? The database asks the same question. */
export function conventionNeedsReferenceYear(key: string | null | undefined): boolean {
  return CONVENTION_BY_KEY.get(key ?? "")?.needsReference ?? false;
}

// ---------------------------------------------------------------------------
// WHAT THE STORY CONTAINS
//
// Most flood traditions have no date, and the ones that do got it from a later
// chronographer. So dates are the wrong axis for comparing them — and
// comparison is the whole educational point. What CAN be compared is
// structure: a warning, a vessel, a mountain, birds released, a sign after.
//
// THE RULE, and it is the only thing that makes the comparison worth anything:
// a motif is recorded ONLY where the cited source contains it. An unmarked
// motif means "not found in the source", never "absent from the tradition".
// A grid filled in from memory would invent the parallels it exists to test,
// which is exactly how "all flood myths are the same story" gets manufactured.
// ---------------------------------------------------------------------------

export const NARRATIVE_MOTIFS = [
  // How it begins
  { key: "divine_warning", label: "Warned by a god or spirit", group: "Warning" },
  { key: "human_warning", label: "Warned by a person", group: "Warning" },
  { key: "animal_warning", label: "Warned by an animal", group: "Warning" },
  { key: "no_warning", label: "No warning given", group: "Warning" },

  // Why it happens
  { key: "divine_punishment", label: "Sent as punishment", group: "Cause" },
  { key: "human_behaviour", label: "Caused by how people behaved", group: "Cause" },
  { key: "natural_catastrophe", label: "A natural catastrophe, not a judgement", group: "Cause" },
  { key: "conflict_of_powers", label: "A struggle between powers or beings", group: "Cause" },
  { key: "unknown_mechanism", label: "Mechanism not given", group: "Cause" },

  // What the water does
  { key: "prolonged_rain", label: "Prolonged rain", group: "Mechanism" },
  { key: "rising_sea", label: "The sea rises", group: "Mechanism" },
  { key: "tsunami_wave", label: "A single great wave", group: "Mechanism" },
  { key: "river_flood", label: "A river floods", group: "Mechanism" },
  { key: "waters_from_below", label: "Water comes up from below", group: "Mechanism" },
  { key: "glacial_flood", label: "Ice or meltwater", group: "Mechanism" },
  { key: "deadly_winter", label: "A killing winter rather than water", group: "Mechanism" },
  { key: "fire_and_flood", label: "Fire as well as water", group: "Mechanism" },

  // Who and what comes through
  { key: "chosen_survivor", label: "One chosen survivor", group: "Survival" },
  { key: "family_survives", label: "A family survives", group: "Survival" },
  { key: "few_survive", label: "A few people survive", group: "Survival" },
  { key: "animals_preserved", label: "Animals preserved", group: "Survival" },
  { key: "plants_preserved", label: "Plants or seeds preserved", group: "Survival" },

  // How
  { key: "boat", label: "A boat or ark", group: "Refuge" },
  { key: "raft", label: "A raft", group: "Refuge" },
  { key: "container", label: "A chest, gourd or drum", group: "Refuge" },
  { key: "mountain_refuge", label: "High ground or a mountain", group: "Refuge" },
  { key: "underground_refuge", label: "Underground", group: "Refuge" },
  { key: "enclosure", label: "A built enclosure", group: "Refuge" },
  { key: "tree_refuge", label: "A tree", group: "Refuge" },
  { key: "carried_by_animal", label: "Carried or saved by an animal", group: "Refuge" },

  // Afterwards
  { key: "birds_released", label: "Birds released to find land", group: "Afterwards" },
  { key: "waters_recede", label: "The waters go down", group: "Afterwards" },
  { key: "sacrifice_after", label: "A sacrifice or offering after", group: "Afterwards" },
  { key: "sign_given", label: "A sign or promise afterwards", group: "Afterwards" },
  { key: "repopulation", label: "The world is repeopled", group: "Afterwards" },
  { key: "humanity_remade", label: "Humanity is made again, differently", group: "Afterwards" },
  { key: "earth_diver", label: "Earth brought up from under the water", group: "Afterwards" },
  { key: "land_drained", label: "Someone drains the water away", group: "Afterwards" },

  // Shape of the account
  { key: "previous_world_destroyed", label: "An earlier world ended", group: "Shape" },
  { key: "multiple_floods", label: "More than one flood", group: "Shape" },
] as const;

export type NarrativeMotifKey = (typeof NARRATIVE_MOTIFS)[number]["key"];

const MOTIF_BY_KEY = new Map(NARRATIVE_MOTIFS.map((motif) => [motif.key as string, motif]));

export function motifLabel(key: string | null | undefined): string {
  if (!key) return "";
  return MOTIF_BY_KEY.get(key)?.label ?? key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
}

export function motifGroup(key: string | null | undefined): string | null {
  return MOTIF_BY_KEY.get(key ?? "")?.group ?? null;
}

/** The motif groups in reading order, each with the motifs present in the given set. */
export function groupMotifs(keys: string[]): { group: string; motifs: { key: string; label: string }[] }[] {
  const order: string[] = [];
  const byGroup = new Map<string, { key: string; label: string }[]>();
  for (const motif of NARRATIVE_MOTIFS) {
    if (!keys.includes(motif.key)) continue;
    if (!byGroup.has(motif.group)) {
      byGroup.set(motif.group, []);
      order.push(motif.group);
    }
    byGroup.get(motif.group)!.push({ key: motif.key, label: motif.label });
  }
  return order.map((group) => ({ group, motifs: byGroup.get(group)! }));
}

// ---------------------------------------------------------------------------
// What KIND of periodisation a time period is
//
// The most useful single fact about a named stretch of time, and the one a
// timeline normally hides. "Mesozoic" and "Bronze Age" look alike on a strip
// and are not alike at all: one has a base defined by a marker in a named rock
// section that a standards body ratified, and the other is a convention that
// begins at different times in different places and that no body has ever
// ratified or could. A reader who cannot tell them apart has been taught that
// all chronology is the same kind of knowledge.
// ---------------------------------------------------------------------------

export const PERIOD_TYPES = [
  {
    key: "formal_scientific",
    label: "Formal scientific period",
    hint:
      "Defined and ratified by a standards body — for geological time, the International Commission on Stratigraphy. " +
      "Its base is a marker in a named rock section, and its dates are revised as that marker is re-dated.",
  },
  {
    key: "archaeological",
    label: "Archaeological convention",
    hint:
      "A periodisation archaeologists use for a material or technological pattern. It begins and ends at different times " +
      "in different regions, and different regional traditions draw it differently. Nobody ratifies it.",
  },
  {
    key: "historical",
    label: "Historical convention",
    hint:
      "A convention of historians, usually with an origin in one region's history. Useful, argued over, and not a description " +
      "of anything that happened everywhere at once.",
  },
  {
    key: "educational",
    label: "Teaching umbrella",
    hint:
      "A span grouped together to make it teachable — not a unit any discipline formally recognises. " +
      "Shown as one so a reader knows the difference.",
  },
] as const;

export type PeriodTypeKey = (typeof PERIOD_TYPES)[number]["key"];
export type PeriodType = PeriodTypeKey | (string & {});

const PERIOD_TYPE_BY_KEY = new Map(PERIOD_TYPES.map((type) => [type.key as string, type]));

export function periodTypeLabel(key: string | null | undefined): string {
  if (!key) return "Period";
  return PERIOD_TYPE_BY_KEY.get(key)?.label ?? key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
}

export function periodTypeHint(key: string | null | undefined): string {
  return PERIOD_TYPE_BY_KEY.get(key ?? "")?.hint ?? "";
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
