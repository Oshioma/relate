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

/**
 * A MEASUREMENT CLAIM.
 *
 * The same idea as SeedClaim, applied to a quantity instead of a moment. An
 * event has no date and a person has no height: both live on claims, because
 * different sources give different figures, obtained different ways, of
 * different things.
 *
 * This is not a parallel data model. It reuses sourceKey, citations, evidence
 * and notes exactly as a date claim does, and it exists because flattening
 * Charles Byrne into one number would be the mistake this timeline was built
 * to avoid, committed in a new place.
 */
export type SeedMeasurement = {
  /** The source that ASSERTS this figure. Null where nothing in particular does. */
  sourceKey: string | null;
  //
  // THERE IS NO `citations` HERE, AND THERE USED TO BE.
  //
  // It was declared, every dataset was free to write it, and the seeder never
  // read it: citations are written from seed.claims alone, so anything attached
  // to a measurement was silently dropped at import. Nothing had noticed
  // because no surviving dataset uses measurements at all.
  //
  // It cannot be honoured as things stand. timeline_claim_sources.claim_id is a
  // NOT NULL foreign key onto timeline_date_claims, so a measurement's citation
  // has nowhere to go without a table of its own — and a table with no rows in
  // it, written for no dataset, is not the fix.
  //
  // So the promise is withdrawn rather than left standing. The day a dataset
  // genuinely needs a disputing source on a height, the migration to write is
  // timeline_measurement_claim_sources, mirroring timeline_claim_sources; until
  // then a type that offers the field is a type that lies to whoever fills it
  // in. sourceKey — the work that asserts the figure — is unaffected and is
  // written exactly as it always was.
  //
  /**
   * WHAT was measured, in plain words — "standing height, measured at the
   * Hunterian", "the articulated skeleton as mounted". Groups measurements in
   * the detail view the way whatIsDated groups date claims.
   */
  whatIsMeasured: string;
  /** Centimetres. OMITTED where a report survives with no figure in it. */
  valueCm?: number;
  /** Required when valueCm is absent: why there is no number. */
  valueAbsentReason?: string;
  /** A range where the source gives one. */
  valueLowCm?: number;
  valueHighCm?: number;
  /** What the source actually said, before anyone converted it. */
  originalValueText: string;
  /** A MEASUREMENT_KINDS key. */
  measurementKind: string;
  /** A MEASUREMENT_METHODS key. */
  measurementMethod: string;
  /** An EVIDENCE_STATUSES key. */
  evidenceStatus: string;
  /**
   * Was the body or the remains actually put against a rule by somebody whose
   * account we have? This one boolean separates most of the real evidence here
   * from most of the noise, and defaults to false.
   */
  directlyMeasured?: boolean;
  /** ISO date, where the occasion of measurement is known. */
  measuredOn?: string;
  /** Who took it. */
  measuredBy?: string;
  /** Why this figure is what it is, and what it does and does not establish. */
  evidence: string;
  notes?: string;
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

/**
 * A PICTURE, AND EVERYTHING NEEDED TO CHECK IT.
 *
 * Named rather than inlined, and imported by bring-in-image.ts so the seed
 * shape and the shape that reaches storage are ONE type. They used to be two,
 * and they drifted: `shows` was set by every seed and carried through by the
 * spread for months while the other type said it did not exist, so nothing
 * checked that a later artwork kept declaring itself. A field the type does
 * not know about is a field no test can defend.
 *
 * `kind` is the media type; `shows` is what the picture is a picture OF — a
 * MEDIA_KINDS key. Set `shows` on every seeded picture: a later artwork or a
 * reconstruction that does not declare itself reads as a photograph of the
 * event, which is the most persuasive kind of wrong a record can be.
 */
export type SeedPicture = {
  url: string;
  caption?: string;
  /**
   * WHO MADE IT AND UNDER WHAT TERMS, KEPT APART FROM WHAT IT SHOWS.
   *
   * The credit used to be appended to the caption, and the caption is also the
   * picture's alt text — so a screen reader read out "…before the floods were
   * accepted, via Wikimedia Commons, author and licence are stated on the file
   * page, h-t-t-p-s colon slash slash commons dot wikimedia…". The licence
   * belongs on the page; it does not belong in the description of what the
   * photograph is of.
   *
   * Usually filled in at seed time; see creditFrom.
   */
  credit?: string;
  kind?: string;
  shows?: string;
  /**
   * PROVENANCE. The file URL alone is not provenance: it is a place a JPEG
   * lives. These fields are what lets a reader go back to the holding
   * institution and check that the picture is of what the caption says.
   *
   * sourcePageUrl is the FILE PAGE — the Commons description page, the
   * museum catalogue record, the archive item — never the image file. That
   * page is where the licence and the creator live, and it is the thing that
   * survives when a file gets renamed.
   */
  sourcePageUrl?: string;
  /** The museum, archive or library that holds the original. */
  institution?: string;
  /** Photographer, engraver, draughtsman. Named where the source names them. */
  creator?: string;
  /** When the picture was MADE — not when the subject lived. */
  imageDate?: string;
  /** The licence as the source states it, verbatim where possible. */
  licence?: string;
  /** Catalogue, accession or digital ID at the holding institution. */
  accessionNumber?: string;
  /**
   * THE TWO BOOLEANS THAT DO THE REAL WORK.
   *
   * depictsActualRemains: is this a photograph of a body, or of a cast, a
   * statue, a drawing, or a living person? A bronze of Robert Wadlow outside
   * a shop in Alton is not Robert Wadlow and is not his remains.
   *
   * verifiedIdentity: does anything OTHER than the caption establish that
   * these are the remains of the named person? Byrne's skeleton has an
   * accession number and an unbroken institutional history. Most "giant
   * skeleton" photographs have a caption and nothing else.
   *
   * Both default to false where unset, which is the safe direction: a
   * picture has to earn these, and silence never grants them.
   */
  depictsActualRemains?: boolean;
  verifiedIdentity?: boolean;
  /** An IDENTIFICATION_STATUSES key, for what the picture is said to SHOW. */
  identificationStatus?: string;
  /**
   * THE EXACT FILE NAME AT THE HOLDING SITE, written out rather than left to
   * be parsed back out of the URL.
   *
   * A URL is built from a name and can be built wrong — a stray encoding, a
   * guessed underscore, a plausible-looking variant. Storing the name the
   * file actually has lets a test assert the URL was DERIVED from it rather
   * than typed alongside it, which is the difference between a filename and
   * a filename that works.
   */
  fileName?: string;
  /**
   * The full-size file, with no width parameter on it.
   *
   * `url` may point at a sized rendering for display. This is the original,
   * and they are recorded separately because "we have the picture" and "we
   * have it at the resolution it exists in" are different claims.
   */
  originalFileUrl?: string;
  /**
   * The HOLDING INSTITUTION'S OWN record, which is not the Commons file page.
   *
   * Commons is a re-publisher. For a Library of Congress photograph or a
   * Wellcome engraving, the institution's catalogue entry is where the real
   * provenance lives — and where a rights statement that differs from the
   * Commons one will be found.
   */
  originalSourceUrl?: string;
  /**
   * THREE DATES, NEVER ONE.
   *
   *   objectDate      when the thing depicted was made, or existed
   *   photographDate  when the photograph or scan was taken
   *   uploadDate      when the file reached the host
   *
   * An 1804 etching, scanned this century, uploaded later still, has all
   * three and they are two hundred years apart. Collapsing them is how a
   * modern scan of a Georgian print becomes a Georgian photograph — and an
   * upload date is never, in any circumstance, the date of the image.
   */
  objectDate?: string;
  photographDate?: string;
  uploadDate?: string;
  /**
   * WHERE TWO RIGHTS STATEMENTS DISAGREE, BOTH ARE KEPT.
   *
   * The case that produced this field was a British Museum etching whose
   * Commons scan is marked public domain while the Museum's own metadata
   * asserts CC BY-NC-SA. This codebase is not the right place to decide
   * which prevails, so it records both and the application takes the more
   * conservative position.
   */
  rightsNotes?: string;
  /**
   * WHO OR WHAT THE PICTURE IS ACTUALLY OF — which is not always who it is
   * filed under.
   *
   * A music-hall bill from 1886 sits in the Commons category of a man who
   * died in 1806. The category is a filing decision; this field is a claim
   * about the image, and they are allowed to differ.
   */
  subject?: string;
  /** Pixel dimensions, so "this one needs replacing" is a fact and not an impression. */
  pixelWidth?: number;
  pixelHeight?: number;
  /**
   * This file is the same photograph as another one here — a crop, a rescan,
   * a lower-resolution copy. Names the file it duplicates.
   *
   * FOUR FILES OF A MAN ARE NOT FOUR PHOTOGRAPHS OF HIM. Without this, a
   * gallery of crops reads as an accumulation of independent evidence, which
   * is the most flattering possible error about a thinly documented person.
   */
  duplicateOf?: string;
  /** A PROVENANCE_STATUSES key: how much of the above anyone has actually checked. */
  provenanceStatus?: string;
  /** What is known, what is assumed, and what a reader should go and check. */
  provenanceNotes?: string;
  /**
   * Set this and write the caption WITHOUT its credit — the credit is worked
   * out at seed time from the picture's own source and appended then. A
   * credit typed into this file is a credit typed from memory; one fetched at
   * seed time is what the source says today.
   */
  creditFrom?: "source";
};

/**
 * ONE ACT OF RENDERING, BY ONE NAMED PARTY.
 *
 * A layer is to a text what a claim is to a date. Gardiner's 1931 translation
 * and Lichtheim's 1976 translation of the same lines are two rows, not one row
 * somebody had to choose between — and the choosing is exactly what this
 * timeline exists not to do on a reader's behalf.
 *
 * `sourceKey` is WHO DID THIS RENDERING, which is a different question from
 * which edition the passage is published in. The translator is on the
 * translation; the papyrus is on the passage.
 */
export type SeedTextLayer = {
  /** An EVIDENCE_LAYERS key: how far from the object this line stands. */
  layer: string;
  /** The source that made THIS rendering. Null where nothing in particular did. */
  sourceKey: string | null;
  /**
   * The text itself.
   *
   * OMITTED where it cannot be reproduced — a modern translation still in
   * copyright is recorded as a citation with a page range and no text, which
   * is a real row: it says the translation exists, who made it, and where to
   * read it. Required alongside contentAbsentReason, and the database enforces
   * the same rule.
   */
  content?: string;
  /** Required when content is absent: why there is no text here. */
  contentAbsentReason?: string;
  /**
   * TWO FIELDS, BECAUSE "EGYPTIAN" DOES NOT SAY WHICH LINE OF THE CHAIN.
   *
   * Hieratic on a papyrus, Gardiner's hieroglyphic transcription of it, and
   * the consonants in Latin letters are all "Egyptian" and are three different
   * layers. The script is what tells them apart.
   */
  language?: string;
  script?: string;
  /** A CLAIM_VIEWPOINTS key. Set on an interpretation; left unset on a transliteration. */
  viewpoint?: string;
  /** Why this rendering reads as it does, and what it does and does not establish. */
  evidence: string;
  notes?: string;
};

/**
 * A LOCATED PIECE OF SURVIVING EVIDENCE, AND THE CHAIN THAT LEADS AWAY FROM IT.
 *
 * The addressable unit is the passage, not the event. The Contendings of Horus
 * and Seth is one event and about fifteen episodes, each at its own page and
 * line of Papyrus Chester Beatty I; one set of layers per event would flatten
 * fifteen legal arguments into a block of prose, which is the collapse this
 * whole structure exists to prevent, committed one level up.
 *
 * `reference` is what makes the passage checkable — the page and line, the
 * utterance number, the line of the stela. Without it the layers below are a
 * quotation floating free of the thing it came out of.
 */
export type SeedPassage = {
  /** Unique within its event. What a reader is offered as a heading. */
  label: string;
  /** WHERE IT IS: "Chester Beatty I, recto 3,1–4,3", "Pyramid Texts, utterance 356". */
  reference?: string;
  /** The edition or publication this passage is located in. */
  sourceKey?: string | null;
  /**
   * THE PHYSICAL THING, kept apart from the book about it. The commonest way
   * to lose a provenance is to let the edition stand in for the artefact.
   */
  objectName?: string;
  holdingInstitution?: string;
  accessionNumber?: string;
  notes?: string;
  /** The chain, from the object outwards. More than one translation is the normal case. */
  layers: SeedTextLayer[];
};

/**
 * ONE LINK IN A CLAIM'S CHAIN OF TRANSMISSION.
 *
 * `says` is what THIS link actually states — not what it is reported to state
 * by the link after it, which is the whole reason for tracing a claim rather
 * than accepting a bibliography.
 *
 * `adds` is what it contributed that its predecessor did not contain, and it
 * is the field that turns a reading list into an explanation. Claims rarely
 * arrive whole: one writer supplies an object, the next an interpretation, the
 * next quietly drops a hedge, and the one after that adds a detail nobody
 * before them had.
 */
export type SeedGenealogyLink = {
  /** A GENEALOGY_STAGES key: how far from the evidence this link stands. */
  stage: string;
  /** Who said it, or what work says it. */
  who: string;
  /** When. Omitted where a stage has no single date. */
  year?: number;
  /** A source in this dataset, where one exists for it. */
  sourceKey?: string | null;
  /** Volume, page, line, figure — whatever locates the statement. */
  reference?: string;
  /**
   * What this link says, quoted where possible.
   *
   * OMITTED where it could not be read, which is a real and common state for
   * exactly the links that matter most. Requires saysAbsentReason.
   */
  says?: string;
  /** Required when `says` is absent: why this link has not been read. */
  saysAbsentReason?: string;
  /** What this link ADDED that the one before it did not contain. */
  adds?: string;
  /** A CITATION_STATUSES key: can this link's own citation be followed? */
  citationStatus?: string;
  notes?: string;
};

/**
 * A CLAIM, AND THE ROUTE IT TOOK TO GET HERE.
 *
 * The evidence chain in SeedPassage runs downwards, from a statement to the
 * object under it. This runs forwards, through the people who repeated a claim,
 * and it exists for the claims where true-or-false is the wrong question.
 *
 * "Horus was crucified" is the case it was built for. Offered the choice
 * between accepting that and being told it was invented, a reader loses the
 * actual history: a real Egyptian object, a real nineteenth-century writer who
 * read it a particular way, a chain of books that repeated him with the hedges
 * falling away, and a modern claim that no longer resembles the object. The
 * chain is the finding.
 */
export type SeedClaimGenealogy = {
  /** Stable key within the event. */
  key: string;
  /** The claim in the words people actually use for it, not a tidied version. */
  claim: string;
  /** A CLAIM_VERDICTS key. Six values, never a boolean — see the taxonomy note. */
  verdict: string;
  /** Why the verdict is that one, and what it does and does not say. */
  verdictEvidence: string;
  /**
   * WHAT WOULD CHANGE THIS ASSESSMENT.
   *
   * Required, and not a formality: a verdict nobody can state the conditions
   * for overturning is an opinion wearing a label. "No primary evidence
   * located" especially — it is a report on searching, and it must say what
   * finding would end it.
   */
  whatWouldChangeThis: string;
  /** Oldest first. The order is meaningful and the interface should keep it. */
  links: SeedGenealogyLink[];
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
  media?: SeedPicture[];
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
  /**
   * Measurements of the subject, where the record is about something that was
   * measured. Optional, and absent from every dataset that came before this
   * one — a record with no measurements behaves exactly as it always did.
   */
  measurements?: SeedMeasurement[];
  /**
   * THE EVIDENCE THE RECORD RESTS ON, IN THE READER'S REACH.
   *
   * Optional, and absent from every dataset written before this one — a record
   * with no passages behaves exactly as it always did. Where they are present
   * they are the answer to "how do we know that?", and a reader can walk back
   * from any sentence here to the papyrus it came off.
   *
   * A record whose description asserts what a text says and which carries no
   * passage is not wrong, but it is reporting at second hand and the interface
   * is entitled to show that it is.
   */
  passages?: SeedPassage[];
  /**
   * An EVIDENCE_STATUSES key for the RECORD AS A WHOLE, where one applies.
   *
   * Deliberately separate from the individual measurement statuses: a person
   * can be strongly documented in life while the whereabouts of their remains
   * is unresolved, and a reader filtering for "physical remains survive"
   * should not be handed the first because of the second.
   */
  evidenceStatus?: string;
  /**
   * An IDENTIFICATION_STATUSES key: is the thing this record is about actually
   * the thing it is said to be?
   *
   * Separate from evidenceStatus, which is about whether the object exists and
   * can be examined. A Naqada I sherd can be securely dated, securely
   * provenanced and held in a named museum — and it is still only POSSIBLY a
   * Set animal. Those are two different questions and a record that answers
   * only the first has answered the easier one.
   */
  identificationStatus?: string;
  /**
   * A KUNDALINI_RELATIONS key: what this record CLAIMS about its relation to
   * Kuṇḍalinī. Not a confidence score — "cross-cultural parallel" is a
   * different kind of statement from "historical precursor", not a weaker
   * degree of it.
   */
  kundaliniRelation?: string;
  /**
   * A TRANSMISSION_STATUSES key: whether anything is actually shown to have
   * travelled between the cultures involved.
   *
   * SEPARATE FROM kundaliniRelation ON PURPOSE. Contact being documented does
   * not make a motif transmitted, and a record can honestly be a resemblance
   * between two cultures that demonstrably met. Without two fields that
   * position cannot be stated, and it is the position most of the serpent
   * collection is in.
   */
  transmissionStatus?: string;
  /**
   * The argument FOR the comparison and the argument AGAINST it, kept apart
   * from the description so neither can quietly become the record's own voice.
   */
  argumentsFor?: string;
  argumentsAgainst?: string;
  /**
   * How a claim attached to this record travelled, for claims where true or
   * false is the wrong question. See SeedClaimGenealogy.
   */
  genealogies?: SeedClaimGenealogy[];
  /** Where the remains are now, in plain words, when they survive. */
  remainsLocation?: string;
  /** Catalogue/accession number of the remains, where they have one. */
  accessionNumber?: string;
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
  /**
   * Pictures, exactly as an event carries them — see SeedEvent above for the
   * shape and for what `shows` and `creditFrom` are each for.
   *
   * A PERIOD PICTURE IS THE EASIEST ONE TO GET WRONG. A period is the frame
   * every event is read against, so one bronze object printed across a band
   * covering two thousand years and several continents reads as a portrait of
   * the whole span. Every caption here has to say what its picture is an
   * example OF rather than letting it stand for the period.
   */
  imageUrl?: string;
  media?: {
    url: string;
    caption?: string;
    credit?: string;
    kind?: string;
    shows?: string;
    creditFrom?: "source";
  }[];
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
