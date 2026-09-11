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
  /** Astronomical year numbering: 1 BCE = 0, 2 BCE = −1. See time.ts. */
  startYear: number;
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
  /** Only where the place is genuinely known. A coordinate is an assertion. */
  lat?: number | null;
  lng?: number | null;
  claims: SeedClaim[];
};

export type SeedTrack = {
  name: string;
  slug: string;
  kind: "region" | "theme";
  color: string;
};
