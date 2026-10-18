// SHARED PIECES OF THE "ORIGINS OF THE MOORS" TRACK.
//
// The dataset is written in sections (prehistory, Egypt and the Libyans,
// Carthage and Etruria, Numidia and Mauretania, the Sahara, Roman and
// post-Roman Africa, the words and the disputed theories), one file each,
// and assembled in ../moors-origins-seed.ts. Everything the sections must
// agree on — the track, the lane names, the lane tags, how a Commons picture
// is written — lives here so that agreement is a type, not a habit.
//
// WHAT THIS TRACK IS NOT. It opens at Jebel Irhoud, about 315,000 years ago,
// because that is where the deep human history of the region a later Latin
// writer would call Mauretania can be picked up — NOT because anybody living
// then was a Moor. "Moor" is a word Europeans used from the Middle Ages on,
// descended from the Latin Mauri, a name Roman writers gave to particular
// peoples of north-west Africa. Every record before that word exists says so
// in its own voice; tests hold it there.

import type { SeedEvent, SeedEventLink, SeedPicture, SeedSource, SeedTrack } from "../seed-types";
import { commonsFilePageUrl, commonsFilePathUrl } from "../check-pictures";
import { astronomicalFromYearsAgo } from "../time";

export const MOORS_TRACK: SeedTrack = {
  name: "Origins of the Moors — 315,000 BCE to 711 CE",
  slug: "origins-of-the-moors",
  kind: "theme",
  color: "#9a5b2e",
};

/** The record the staff offer checks for: if it is present the dataset has been taken. */
export const MOORS_ANCHOR_SLUG = "jebel-irhoud-early-homo-sapiens";

/**
 * THE LANES, as subcategories (the convention the Okomilo track set), each
 * also carried as a tag so the existing "Show on its own" dropdown can open
 * any one lane by itself without a single new control.
 */
export const MOORS_LANES = {
  prehistoric: "Prehistoric North Africa",
  amazigh: "Ancient Amazigh and Libyan peoples",
  egypt: "Egypt and North Africa",
  carthageEtruria: "Carthage and Etruria",
  numidiaMauretania: "Numidia and Mauretania",
  sahara: "Garamantes and the Sahara",
  roman: "Roman and post-Roman Africa",
  medieval: "Emergence of medieval Moors",
  alternative: "Alternative historical interpretations",
} as const;

export type MoorsLane = keyof typeof MOORS_LANES;

/** One tag per lane. Readable, because the dropdown prints tags as they are. */
export const MOORS_LANE_TAGS: Record<MoorsLane, string> = {
  prehistoric: "moors: prehistoric north africa",
  amazigh: "moors: ancient amazigh and libyan peoples",
  egypt: "moors: egypt and north africa",
  carthageEtruria: "moors: carthage and etruria",
  numidiaMauretania: "moors: numidia and mauretania",
  sahara: "moors: garamantes and the sahara",
  roman: "moors: roman and post-roman africa",
  medieval: "moors: emergence of medieval moors",
  alternative: "moors: alternative interpretations",
};

/** Every record in the track carries this, so the whole track is one shared tag too. */
export const MOORS_TRACK_TAG = "origins-of-the-moors";

/**
 * The span "open this track on its own" should frame: Jebel Irhoud's older
 * bound with a margin, to just after 711 CE. A test holds every dated claim
 * inside it. Best read on the timeline's existing Log scale, where each
 * ten-fold step in age gets equal width.
 */
export const MOORS_TRACK_WINDOW = { from: -360_000, to: 800 } as const;

/** Thousands of years ago → astronomical year, counted from 1950 (BP). */
export const ka = (thousands: number): number => astronomicalFromYearsAgo(thousands * 1000);

/** A calendar year BCE → astronomical year (1 BCE = 0). */
export const bce = (year: number): number => 1 - year;

/** What every section file exports. */
export type MoorsSection = {
  sources: SeedSource[];
  events: SeedEvent[];
  /** Edges inside this track AND out to records other datasets already seeded. */
  links?: SeedEventLink[];
};

/**
 * A WIKIMEDIA COMMONS PICTURE, written the one way every section writes it.
 *
 * The file name is the input; the display URL, the file page and the
 * original-file URL are all DERIVED from it, so a typed URL can never
 * disagree with the file it claims to be. The credit is fetched at seed time
 * (creditFrom: "source"); `licence` and `creator` are recorded as they were
 * read off the Commons API during research, for the provenance panel.
 */
export function commonsPicture(input: {
  fileName: string;
  caption: string;
  shows: string;
  identificationStatus: string;
  licence: string;
  creator?: string;
  institution?: string;
  accessionNumber?: string;
  objectDate?: string;
  subject?: string;
  provenanceNotes?: string;
  pixelWidth?: number;
  pixelHeight?: number;
  duplicateOf?: string;
}): SeedPicture {
  const underscored = input.fileName.replace(/ /g, "_");
  return {
    url: commonsFilePathUrl(input.fileName),
    sourcePageUrl: commonsFilePageUrl(input.fileName),
    fileName: input.fileName,
    originalFileUrl: `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(underscored).replace(/%2F/g, "/")}`,
    caption: input.caption,
    kind: "image",
    shows: input.shows,
    identificationStatus: input.identificationStatus,
    licence: input.licence,
    creator: input.creator,
    institution: input.institution,
    accessionNumber: input.accessionNumber,
    objectDate: input.objectDate,
    subject: input.subject,
    provenanceNotes: input.provenanceNotes,
    pixelWidth: input.pixelWidth,
    pixelHeight: input.pixelHeight,
    duplicateOf: input.duplicateOf,
    provenanceStatus: "resolved_at_seed",
    creditFrom: "source",
  };
}

/** The tags every record in a lane carries: the track tag, the lane tag, then its own. */
export function laneTags(lane: MoorsLane, ...own: string[]): string[] {
  return [MOORS_TRACK_TAG, MOORS_LANE_TAGS[lane], ...own];
}
