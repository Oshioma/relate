// SHARED PIECES OF "THE SERPENT ACROSS CIVILIZATIONS".
//
// One track asking one question: could the biblical tribe of Dan, Egyptian and
// Kushite serpent religion, and the Dan and Dangbé serpent traditions of the
// Gbe-speaking coast share any historical, religious, linguistic or migratory
// connection? The track is built to make the evidence visible, not to reach a
// verdict in advance in either direction.
//
// It is written in sections, one file each in this folder, and assembled in
// ../serpent-civilizations-seed.ts. Everything the sections must agree on
// lives here.
//
// THE RULES IT IS WRITTEN UNDER.
//   - A biblical narrative is a text with a date of composition, not an
//     archaeological report. Narrative, excavated evidence, scholarly
//     reconstruction and speculative identification are kept apart.
//   - Two serpents are not one god. Wadjet is a cobra, Dangbé a python, Dan a
//     Gbe vodun, Nehushtan a bronze object, and each record says which.
//   - Similar-sounding names are not cognates. A word comparison names its
//     sources, its earliest attestation and whether the sound changes are
//     regular, and says when they are not.
//   - Long-distance trade is not migration, and a Jewish community in Africa is
//     not proof that Danites reached the Bight of Benin.
//   - A reconstructed proto-language form and an undated oral tradition get no
//     date: they are positionless claims, as benin-vodun's "How old is Vodun?" is.
//   - Every date claim names its EVIDENCE TYPE, and every comparison names its
//     ASSESSMENT from the fixed vocabularies below.

import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "../seed-types";

export { commonsPicture } from "../moors-origins/shared";

/** A calendar year BCE → astronomical year (1 BCE = 0). */
export const bce = (year: number): number => 1 - year;

export const SERPENT_CIVILIZATIONS_TRACK: SeedTrack = {
  name: "The Serpent Across Civilizations: Dan, Egypt, Kush and West African Vodun",
  slug: "serpent-across-civilizations",
  kind: "theme",
  color: "#4d6b2f",
};

/** Every record in the track carries this, so the whole investigation is one shared tag. */
export const SERPENT_CIVILIZATIONS_TAG = "serpent-across-civilizations";

/**
 * THE LANES, as subcategories (the Moors convention), each also a tag so the
 * existing "Show on its own" search opens one lane by itself.
 */
export const SERPENT_LANES = {
  dan: "The tribe of Dan and Israelite serpent traditions",
  africanJewish: "Dan in Africa: Jewish communities and Danite traditions",
  egypt: "Egyptian serpent religion",
  kush: "Nubian and Kushite serpent traditions",
  gbe: "Gbe serpent traditions: Dan, Dangbé and Aido-Hwedo",
  words: "Words compared",
  rituals: "Gods, rituals and landscapes compared",
  routes: "Possible routes of transmission",
  assessment: "Comparisons and the evidence assessment",
} as const;

export type SerpentLane = keyof typeof SERPENT_LANES;

export const SERPENT_LANE_TAGS: Record<SerpentLane, string> = {
  dan: "serpents: tribe of dan",
  africanJewish: "serpents: dan in africa",
  egypt: "serpents: egypt",
  kush: "serpents: nubia and kush",
  gbe: "serpents: gbe vodun",
  words: "serpents: words compared",
  rituals: "serpents: gods and rituals compared",
  routes: "serpents: routes",
  assessment: "serpents: comparisons and assessment",
};

/**
 * The record each lane opens with. The staff offer checks the track's anchor
 * (the conclusion page); section writers link to the others by these slugs.
 */
export const SERPENT_LANE_ANCHORS: Record<SerpentLane, string> = {
  dan: "dan-tribe-what-the-sources-are",
  africanJewish: "danites-in-africa-what-can-be-shown",
  egypt: "egyptian-serpents-what-the-evidence-is",
  kush: "kushite-serpents-what-the-evidence-is",
  gbe: "gbe-serpent-traditions-overview",
  words: "dan-and-dan-the-word-comparison",
  rituals: "serpent-gods-compared-overview",
  routes: "transmission-routes-overview",
  assessment: "serpent-across-civilizations-evidence-assessment",
};

/** The record the staff offer checks for: if it is present, the track has been taken. */
export const SERPENT_CIVILIZATIONS_ANCHOR_SLUG = SERPENT_LANE_ANCHORS.assessment;

/**
 * THREADS A READER CAN FOLLOW ACROSS LANES. Each is a shared tag. A record
 * carries every thread it genuinely belongs to; a test holds the vocabulary to
 * this list so two spellings never split a thread.
 */
export const SERPENT_THREADS = [
  "figure: dan (tribe)",
  "figure: nehushtan",
  "figure: yhwh",
  "figure: wadjet and the uraeus",
  "figure: apep",
  "figure: mehen",
  "figure: apedemak",
  "figure: dan (vodun)",
  "figure: dangbe",
  "figure: aido-hwedo",
  "figure: damballa and ayida-wedo",
  "theme: kingship",
  "theme: healing and protection",
  "theme: priesthood",
  "theme: procession and coronation",
  "theme: sacred landscape",
  "theme: oracle and divination",
  "theme: living sacred animals",
  "theme: names and words",
  "theme: migration traditions",
  "theme: trade routes",
  "theme: manuscripts and their dates",
  "place: tel dan",
  "place: elephantine",
  "place: ethiopia",
  "place: thebes and luxor",
  "place: napata and meroe",
  "place: naqa",
  "place: sahara and niger bend",
  "place: savi and ouidah",
  "place: tado and allada",
  "place: haiti and brazil",
] as const;

export type SerpentThread = (typeof SERPENT_THREADS)[number];

/**
 * THE KINDS OF EVIDENCE. Every date claim's `evidence` text begins
 * "EVIDENCE TYPE: <one of these>." so a reader always knows what is holding
 * the date up.
 */
export const EVIDENCE_TYPES = [
  "archaeological",
  "inscription",
  "contemporary written",
  "biblical narrative",
  "later manuscript",
  "later historical account",
  "oral tradition",
  "religious tradition",
  "linguistic reconstruction",
  "modern interpretation",
] as const;

/**
 * HOW A COMPARISON IS ASSESSED (the brief's five labels). Every comparison
 * record carries exactly one as a tag, "comparison: <label>", and opens its
 * ASSESSMENT paragraph with the same words.
 */
export const COMPARISON_ASSESSMENTS = [
  "documented historical transmission",
  "distinctive similarity",
  "widespread religious practice",
  "significant difference",
  "unsupported hypothesis",
] as const;

/**
 * HOW A HYPOTHESIS IS ASSESSED in the conclusion (the brief's four labels).
 * No percentages: these are kinds of statement, not degrees of confidence.
 */
export const HYPOTHESIS_ASSESSMENTS = [
  "established evidence",
  "plausible but unproven",
  "speculative",
  "contradicted or unsupported",
] as const;

/** The tags every record carries: the track tag, the lane tag, its threads, then its own. */
export function serpentTags(lane: SerpentLane, threads: SerpentThread[], ...own: string[]): string[] {
  return [SERPENT_CIVILIZATIONS_TAG, SERPENT_LANE_TAGS[lane], ...threads, ...own];
}

/** What every section file exports. */
export type SerpentSection = {
  sources: SeedSource[];
  events: SeedEvent[];
  /** Edges inside this track AND out to records other datasets already seed. */
  links: SeedEventLink[];
};
