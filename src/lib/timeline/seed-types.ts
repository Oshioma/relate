// THE SHAPE OF A SEEDED DATASET.
//
// One community can be handed a ready-made piece of timeline — the Great
// Pyramid worked example, the Hannibal dataset — and both are the same kind of
// thing: sources, events, and claims that point at the sources. These are the
// types they share, kept in one place so a second dataset is a data file rather
// than a second copy of the plumbing.
//
// THE RULE THAT MAKES THIS WORTH DOING. An event has no date. Dates live on
// claims, because different sources give different dates, different precision,
// and sometimes different kinds of statement altogether — and a timeline that
// flattens those into one number is teaching the opposite of how history is
// actually known. Nothing here has a field for a date on an event, and nothing
// here has a field for a confidence score. Neither omission is an oversight.

export type SeedSource = {
  /** Stable key within the dataset file, so claims can name their source. Not stored. */
  key: string;
  title: string;
  author?: string;
  publisher?: string;
  workTitle?: string;
  /** Volume/pages/DOI/chapter — whatever locates the passage. */
  reference?: string;
  url?: string;
  /** A key from TIMELINE_SOURCE_TYPES. Says what KIND of thing it is, never how good. */
  sourceType: string;
  publishedYear?: number;
  publishedDisplay?: string;
  /** What this source is cited FOR. Not a summary of the whole work. */
  notes: string;
  /** Key of the source that cites this one, where that is genuinely true. */
  citedBy?: string;
};

export type SeedCitation = {
  sourceKey: string;
  /** What this source DOES to the claim. Never a score. */
  relation: "supports" | "disputes" | "context";
  note: string;
};

export type SeedClaim = {
  /** The source that ASSERTS this date. Null where nothing in particular does. */
  sourceKey: string | null;
  /** Everything else worth reading on it — evidence, criticism, context. */
  citations?: SeedCitation[];
  /**
   * Astronomical year numbering: 1 BCE = 0, 2 BCE = −1. See time.ts.
   *
   * OMITTED WHERE THE CLAIM PLACES NOTHING — the Steady State universe has no
   * finite beginning, and a kalpa is a length rather than a moment. Permitted
   * only alongside a positionless temporalClaimType; the database enforces the
   * same rule.
   */
  startYear?: number;
  startMonth?: number;
  startDay?: number;
  endYear?: number;
  datePrecision: string;
  /** Decimal places the source states, for a deep-time unit — "1.76 million years ago". */
  precisionDecimals?: number;
  /**
   * A stated measurement error, in YEARS. Never merged with endYear: "609 ± 40 ka"
   * is one date with a tolerance, and "700,000–200,000 years ago" is a span of
   * time something was true for. Collapsing the two would turn a measurement
   * into a duration.
   */
  uncertaintyPlus?: number;
  uncertaintyMinus?: number;
  isApproximate: boolean;
  /**
   * Which region this claim describes — "Near East", "Britain", "West Africa".
   * Only ever set on a PERIOD BOUNDARY, where the whole point is that the Iron
   * Age does not begin at one moment everywhere. Omitted on an event's dates.
   */
  region?: string;
  /** The span has no end: it runs to the present. Never paired with endYear. */
  isOngoing?: boolean;
  /**
   * The claim in the source's own terms — "an eight-month siege", "nine years
   * old when Hamilcar crossed to Iberia". Unique within its event, because the
   * seeder matches claims back to their citations by this text.
   */
  originalDateText: string;
  datingMethod: string;
  /** The viewpoint (the `chronology` column). "conventional" is the mainstream one. */
  chronology: string;
  /** "Why this date?" — what produced it and what it does and does not establish. */
  evidence: string;
  notes?: string;
  /**
   * A TEMPORAL_CLAIM_TYPES key — what KIND of claim about time this is. The
   * difference between a fitted cosmological parameter, an addition performed
   * on genealogies, and an assertion that there is no first moment at all.
   */
  temporalClaimType?: string;
  /** A LENGTH with no position, in years. Never paired with endYear. */
  durationYears?: number;
  /**
   * A DATE_CONVENTIONS key — how the SOURCE expressed the date.
   *
   * Set it wherever the figure came out of anything but a calendar, and set
   * conventionReferenceYear with it. "14,600 years ago" and "14,600 BCE" are
   * 1,950 years apart, and without this the row records only the answer.
   */
  dateConvention?: string;
  /** What "ago" counts back from — 1950 for a scientific BP figure, the year of writing otherwise. */
  conventionReferenceYear?: number;
  /**
   * Which proposition this date is a date FOR. Set when one record carries
   * claims about genuinely different things — the age of the observable
   * universe and the creation of the world are not rival answers to one
   * question, and without this they would be stacked as though they were.
   */
  whatIsDated?: string;
};

export type SeedEvent = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  subcategory?: string | null;
  /** A key from TIMELINE_EVENT_TYPES — what kind of record this is. */
  eventType: string;
  eventTypeNote?: string | null;
  tags: string[];
  people?: string[];
  civilisations?: string[];
  locationName?: string | null;
  /**
   * Pictures, addressed by Special:FilePath rather than by a hand-built
   * thumbnail path — a Wikimedia thumbnail may not be wider than the file it
   * comes from, and asking for one that is gets a 400. They are copied into the
   * community's own storage when the event is seeded; see bringEventPicturesIn.
   *
   * The caption carries the creator and the licence, because attribution is a
   * condition of these licences and not a courtesy — and, in this timeline,
   * because a picture of a thing is not evidence about the thing, and the
   * caption is where that gets said.
   */
  imageUrl?: string;
  media?: { url: string; caption?: string; kind?: string }[];
  /** Only where the place is genuinely known. A coordinate is an assertion. */
  lat?: number | null;
  lng?: number | null;
  /**
   * NARRATIVE_MOTIFS keys the CITED SOURCE actually contains.
   *
   * Never filled in from memory or from what the tradition "obviously" has:
   * an unmarked motif means "not found in the source". The comparison is only
   * worth making if the marks can be checked against the text.
   */
  motifs?: string[];
  claims: SeedClaim[];
};

export type SeedTrack = {
  name: string;
  slug: string;
  kind: "region" | "theme";
  color: string;
};

// ---------------------------------------------------------------------------
// A TIME PERIOD, and the boundaries different people put on it
//
// A period is not an event and is not seeded like one: it has no single date,
// it is drawn as a band rather than as a marker, and its start and end are
// claims in exactly the way an event's date is a claim. The only thing that
// changes between an event's claims and a period's is that a boundary may say
// WHICH REGION it is for, because the Bronze Age begins around 3300 BCE in
// Mesopotamia and around 2500 BCE in Britain and those are two sourced
// statements about one convention, not two conventions.
// ---------------------------------------------------------------------------

export type SeedPeriod = {
  slug: string;
  name: string;
  /** "Age of Dinosaurs", "Neolithic Revolution" — the same period, not another one. */
  aliases?: string[];
  summary: string;
  description: string;
  /** A PERIOD_TYPES key: formal_scientific, archaeological, historical, educational. */
  periodType: string;
  /** Whose framework this is — "Mainstream palaeontology and geology". */
  framework?: string;
  /** What makes this period this period at all. */
  definingCriteria?: string;
  /** What has actually been dug up, measured or observed. */
  evidence?: string;
  /** What that evidence is taken to mean, and by whom. Kept apart from it on purpose. */
  interpretation?: string;
  /** Set only where the period ITSELF is regional, not merely its boundaries. */
  region?: string;
  /** Orders bands that semantic zoom has already chosen. Not a visibility switch. */
  displayPriority?: number;
  /** The boundary claims. Two regions disagreeing is the normal case, not an error. */
  claims: SeedClaim[];
};

/** An edge between two seeded periods, by slug. 'contains' is hierarchy. */
export type SeedPeriodLink = {
  from: string;
  to: string;
  relation: "contains" | "related";
};

/**
 * An asserted relationship between two seeded records, by slug.
 *
 * Carries who says so and whose framework it belongs to, because a relationship
 * is a claim: "Mu is Lemuria" is something particular writers asserted, and an
 * unattributed edge would put it in the database's own voice.
 */
export type SeedEventLink = {
  from: string;
  to: string;
  /** An EVENT_RELATIONS key. */
  relation: string;
  /** A CLAIM_VIEWPOINTS key — whose framework this relationship is part of. */
  viewpoint?: string;
  /** The source that asserts the relationship, where one does. */
  sourceKey?: string;
  /** Why, in a sentence. */
  note: string;
};
