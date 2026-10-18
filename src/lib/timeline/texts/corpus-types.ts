// THE SHAPE OF AN ARCHIVED TEXT.
//
// Two kinds of file feed the archive, and they are kept apart on purpose:
//
//   inventory.ts   ONE entry per work: what the work is, where it sits on the
//                  timeline, how many units a complete import contains and on
//                  whose numbering, and what may legally be reproduced. Every
//                  work in scope has an entry from the start, so the library
//                  shows the whole scope honestly — including what is not yet
//                  imported.
//
//   corpus/*.ts    The passages of ONE work, with their translations,
//                  witnesses, images and connections. Written stage by stage.
//
// A corpus file names its work by key and never repeats the work's metadata,
// so the two cannot disagree about what the work is.
//
// Everything here reuses the timeline's existing seed shapes where one exists
// — SeedSource for bibliography, SeedTextLayer for a rendering, SeedClaim and
// SeedEvent for the timeline marker — so an archived text is the same kind of
// record the rest of the timeline is made of, at a finer grain.

import type { SeedClaim, SeedEvent, SeedSource, SeedTextLayer } from "../seed-types";

/** How sure the expected unit count is before it has been checked against the edition. */
export type InventoryConfidence = "high" | "medium" | "low";

/**
 * WHERE THE WORK SITS ON THE TIMELINE.
 *
 * Either an event that already exists (Plato writes the Timaeus and Critias is
 * already a record; making a second one would split its claims and its links
 * in two) or a new event this archive creates. Never both.
 */
export type CorpusAnchor =
  | {
      existingSlug: string;
      /**
       * Date claims this archive adds to the existing event if they are not
       * already there (matched by originalDateText) — typically the earliest
       * manuscript, which the record was written without.
       */
      extraClaims?: SeedClaim[];
    }
  | { event: SeedEvent };

/** A relationship from the work's marker to a record already on the timeline. */
export type CorpusEventLink = {
  /** Slug of the existing record. */
  slug: string;
  /** An EVENT_RELATIONS key, read from the work's marker to that record. */
  relation: string;
  note: string;
};

export type InventoryWork = {
  /** Permanent key, e.g. 'egy.pyramid-texts'. Also the prefix of every passage key. */
  workKey: string;
  /** Short prefix used in passage keys, e.g. 'egy.pt'. */
  passagePrefix: string;
  /** The brief's numbering (1–33), so the library can be checked against the request. */
  briefItem: number;
  title: string;
  alternativeTitles?: string[];
  /** A CORPUS_GROUPS key. */
  corpusGroup: string;
  /** A TEXT_TRADITION_CLASSES key. */
  traditionClass: string;
  civilisation: string;
  geographicalOrigin?: string;
  originalLanguage: string;
  attribution?: string;
  attributionNote?: string;
  summary: string;

  // THE INVENTORY ----------------------------------------------------------
  /** The edition or catalogue whose numbering defines "complete". */
  referenceEdition: string;
  /** Units a complete import contains on that numbering. Null where not yet established. */
  expectedUnits: number | null;
  /** What one unit is: "utterances", "spells", "Stephanus sections". */
  unitLabel: string;
  /**
   * The TEXT_DIVISION_KINDS key a unit is stored as. Containers above it (a
   * Stephanus page above its sections, a book above its chapters) are not
   * counted toward expectedUnits.
   */
  unitDivisionKind: string;
  /** Where the expected count comes from, and what it does not cover. */
  inventoryBasis: string;
  inventoryConfidence: InventoryConfidence;
  /**
   * TRUE ONLY when the count has been checked against the edition itself — for
   * example, derived from the edition's own markup. Never set on the strength
   * of a handbook figure.
   */
  inventoryVerified: boolean;

  // RIGHTS ----------------------------------------------------------------
  /** What may be reproduced, in plain words. */
  copyrightSummary: string;
  /** Editions and translations that may be reproduced in full. */
  fullTextEditions: string[];
  /** Editions and translations that may only be cited or briefly quoted. */
  referenceOnlyEditions: string[];
  /** Collections that hold verified imagery of the witnesses. */
  imageCollections: string[];

  /**
   * Where it appears on the timeline. Null for an inventory group (e.g. "other
   * Nag Hammadi writings") whose members get markers of their own when they are
   * imported.
   */
  anchor: CorpusAnchor | null;
  /** 1 landmark · 2 notable · 3 detail. Only applied to markers this archive creates. */
  prominence?: 1 | 2 | 3;
  /** Relationships from the marker to records already on the timeline. */
  eventLinks?: CorpusEventLink[];
  /**
   * For a work that is a VIEW of another, not a separate text — the Poimandres
   * is Corpus Hermeticum I. The library lists it and opens the other work at
   * that passage; nothing is stored twice.
   */
  aliasOf?: { workKey: string; passageKey: string };
  /** For an open-ended category: the works proposed for inclusion, each to get its own entry when imported. */
  proposedMembers?: string[];
  notes?: string;
};

export type CorpusVersion = {
  key: string;
  label: string;
  language?: string;
  description?: string;
};

/** A physical witness. Its date is stated the way a date claim states one. */
export type CorpusManuscript = {
  key: string;
  siglum?: string;
  name: string;
  /** 'inscription' | 'papyrus' | 'coffin' | 'codex' | 'tablet' | 'print' | 'ostracon' | 'stela' */
  objectKind: string;
  holdingInstitution?: string;
  accessionNumber?: string;
  findspot?: string;
  /** Astronomical year numbering, as on claims. Omitted where the catalogue gives none. */
  startYear?: number;
  endYear?: number;
  datePrecision?: string;
  isApproximate: boolean;
  originalDateText?: string;
  datingEvidence?: string;
  catalogueUrl?: string;
  sourceKey?: string;
  notes?: string;
};

/**
 * AN IMAGE OF THE EVIDENCE, AND EVERYTHING NEEDED TO CHECK IT.
 *
 * Follows the timeline's image policy (AGENTS.md): primary evidence first,
 * related evidence allowed when labelled as such, and an identification that
 * cannot be verified carries an `UNVERIFIED —` caption and says what is
 * unverified. Never an AI reconstruction presented as an artefact.
 */
export type CorpusImage = {
  /** Unique across the archive. */
  key: string;
  url: string;
  /** The institution's catalogue record or the Commons file page — where the licence lives. */
  sourcePageUrl: string;
  institution?: string;
  accessionNumber?: string;
  /** When the OBJECT was made. */
  objectDate?: string;
  /** When the PHOTOGRAPH or engraving was made. */
  imageDate?: string;
  caption: string;
  creator?: string;
  credit?: string;
  /** The licence as the source states it. */
  licence?: string;
  /** An IMAGE_LICENCE_STATUSES key. */
  licenceStatus: string;
  /** A MEDIA_KINDS key. */
  shows: string;
  /** An IDENTIFICATION_STATUSES key. */
  identificationStatus: string;
  /** Required with identificationStatus 'unverified': exactly what is not verified. */
  whatIsUnverified?: string;
  /** An IMAGE_VERIFICATION_STATUSES key. */
  verificationStatus: string;
  /** Key of the image this is another crop or scan of. */
  duplicateOf?: string;
};

/** One rendering of a passage — SeedTextLayer, with a key and a licence. */
export type CorpusLayer = SeedTextLayer & {
  /** Unique within the passage. Lets a re-import update this row in place. */
  key: string;
  /** A LAYER_LICENCES key. */
  licence: string;
};

export type CorpusPassageDate = {
  key: string;
  /** A PASSAGE_DATE_ROLES key. */
  role: string;
  startYear?: number;
  endYear?: number;
  datePrecision: string;
  isApproximate: boolean;
  originalDateText: string;
  evidence: string;
  sourceKey?: string;
};

export type CorpusPassage = {
  /** Permanent ID, starting with the work's passagePrefix: 'greek.tim.24e'. */
  key: string;
  /** The containing division, which must come earlier in the file. */
  parentKey?: string;
  /** A TEXT_DIVISION_KINDS key. */
  divisionKind: string;
  /** A heading for a reader. */
  label: string;
  /** Where it is, in the reference edition's own terms. */
  reference: string;
  versionKey?: string;
  /** A short neutral summary, written for this archive. */
  summary?: string;
  /** The edition the passage is located in. */
  sourceKey?: string;
  objectName?: string;
  holdingInstitution?: string;
  accessionNumber?: string;
  notes?: string;
  /** A PASSAGE_VERIFICATION_STATUSES key. */
  verificationStatus: string;
  layers: CorpusLayer[];
  witnesses?: { manuscriptKey: string; locus?: string; variantNote?: string }[];
  dates?: CorpusPassageDate[];
  images?: CorpusImage[];
  themes?: { themeKey: string; note: string }[];
};

/**
 * A CONNECTION BETWEEN TWO PASSAGES, ARGUED.
 *
 * Every one of the ten questions in the brief is a field, and the ones that
 * matter most are required. A connection with nothing to say about how the
 * later text could have known the earlier one is a resemblance, and must be
 * classified as one.
 */
export type CorpusLink = {
  key: string;
  /** Passage keys — in this or any other work. */
  from: string;
  to: string;
  /** A PASSAGE_CONNECTION_CLASSES key. */
  connectionClass: string;
  similarities: string;
  differences: string;
  /** A COMPARABILITY key. */
  wordingComparable: string;
  meaningComparable: string;
  transmissionEvidence: string;
  earlierNote?: string;
  commonSourceNote?: string;
  contradictionNote?: string;
  scholarlyView?: string;
  alternativeView?: string;
  sourceKey?: string;
  /** A LINK_REVIEW_STATUSES key. */
  reviewStatus: string;
};

export type TextCorpusFile = {
  workKey: string;
  /**
   * Bump when the content changes in a way that should re-run the import.
   * The importer also hashes the content, so this is a label, not a switch.
   */
  revision: string;
  sources: SeedSource[];
  versions?: CorpusVersion[];
  manuscripts?: CorpusManuscript[];
  /** Images of the work as a whole or of a manuscript (set manuscriptKey). */
  images?: (CorpusImage & { manuscriptKey?: string })[];
  passages: CorpusPassage[];
  links?: CorpusLink[];
};
