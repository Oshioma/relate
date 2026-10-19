// SHARED PIECES OF THE VODUN, VODOU AND VOODOO EXPANSION.
//
// Six tracks that extend the 35-record `benin-vodun` dataset (written
// 2026-09-17) from West Africa through the Atlantic crossing to Haiti,
// Louisiana, Cuba, Brazil, Suriname and the present day. Each track is its own
// section file in this folder and its own seeded dataset; ../vodun-diaspora-seed.ts
// assembles them. Everything the sections must agree on lives here.
//
// THE RULES THE SIX TRACKS ARE WRITTEN UNDER (the same as benin-vodun's):
//   - Earliest documentation is not origin. No ancient religious origin gets a
//     precise date without evidence.
//   - No Egyptian, Sumerian or other ancient derivation is asserted. Where
//     such a theory circulates it is an attributed alternative claim with its
//     proponents, its evidence and its criticisms.
//   - Similar symbolism is not proof of shared origin. Comparison records say
//     what the evidence for transmission actually is.
//   - Haitian Vodou, Louisiana Voodoo, Lucumí, Candomblé and Winti are
//     religions with their own histories, not copies of West African Vodun.
//   - Every date claim names its EVIDENCE TYPE (see EVIDENCE_TYPES).

import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "../seed-types";

export { commonsPicture } from "../moors-origins/shared";

/** A calendar year BCE → astronomical year (1 BCE = 0). */
export const bce = (year: number): number => 1 - year;

export const VODUN_DIASPORA_TRACKS = {
  africa: {
    name: "Vodun in West Africa: powers, ancestors and knowledge",
    slug: "vodun-west-africa",
    kind: "theme",
    color: "#6d4c9f",
  },
  kingdoms: {
    name: "Vodun and the kingdoms: Allada, Hueda and Dahomey",
    slug: "vodun-kingdoms",
    kind: "theme",
    color: "#8a3f7a",
  },
  atlantic: {
    name: "The Atlantic crossing: Vodun carried and remade",
    slug: "vodun-atlantic-crossing",
    kind: "theme",
    color: "#2f5f8a",
  },
  haiti: {
    name: "Haitian Vodou: from Saint-Domingue to today",
    slug: "haitian-vodou",
    kind: "theme",
    color: "#b23a48",
  },
  americas: {
    name: "Louisiana Voodoo, Cuba, Brazil and the wider Americas",
    slug: "vodun-in-the-americas",
    kind: "theme",
    color: "#3f7d5a",
  },
  modern: {
    name: "Vodun, Vodou and Voodoo today: practice and perception",
    slug: "vodun-today",
    kind: "theme",
    color: "#a36a1f",
  },
} as const satisfies Record<string, SeedTrack>;

export type VodunTrackKey = keyof typeof VODUN_DIASPORA_TRACKS;

/** The record each staff offer checks for, one per track. */
export const VODUN_DIASPORA_ANCHORS: Record<VodunTrackKey, string> = {
  africa: "vodun-west-africa-what-can-be-recovered",
  kingdoms: "vodun-kingdoms-religion-and-royal-power",
  atlantic: "vodun-atlantic-what-crossed",
  haiti: "haitian-vodou-formation-saint-domingue",
  americas: "louisiana-voodoo-formation",
  modern: "vodun-today-overview",
};

/** Every record in all six tracks carries this, so the whole expansion is one shared tag. */
export const VODUN_DIASPORA_TAG = "vodun-diaspora";

/** One tag per track, readable, because "Show on its own" prints tags as they are. */
export const VODUN_TRACK_TAGS: Record<VodunTrackKey, string> = {
  africa: "vodun: west africa",
  kingdoms: "vodun: the kingdoms",
  atlantic: "vodun: atlantic crossing",
  haiti: "vodun: haitian vodou",
  americas: "vodun: the americas",
  modern: "vodun: today",
};

/**
 * THE THREADS A READER CAN FOLLOW ACROSS CENTURIES AND CONTINENTS. Each is a
 * shared tag, so "Show on its own" opens one deity, practice or place across
 * all six tracks. A record carries every thread it genuinely belongs to; a
 * test holds the vocabulary to this list so two spellings never split a thread.
 */
export const FOLLOW_TAGS = [
  // Powers (Gbe names first; the diaspora name is the same thread where a link is documented)
  "deity: mawu-lisa",
  "deity: bondye",
  "deity: legba",
  "deity: dan and aido-hwedo",
  "deity: sakpata",
  "deity: heviosso",
  "deity: gu and ogou",
  "deity: gede and the dead",
  "deity: ezili and water spirits",
  "deity: mami wata",
  "deity: orisha",
  "deity: lwa",
  // Practices
  "practice: divination",
  "practice: possession",
  "practice: initiation and priesthood",
  "practice: drumming and song",
  "practice: ancestors",
  "practice: sacred trees and forests",
  "practice: crossroads",
  "practice: serpent veneration",
  "practice: veve and sacred art",
  "practice: healing and herbal knowledge",
  "practice: masquerade",
  "practice: catholic contact",
  // Places
  "place: tado",
  "place: allada",
  "place: ouidah",
  "place: abomey",
  "place: porto-novo",
  "place: togo and ewe country",
  "place: oyo and yorubaland",
  "place: saint-domingue and haiti",
  "place: new orleans",
  "place: cuba",
  "place: bahia and brazil",
  "place: suriname",
  "place: trinidad and the caribbean",
] as const;

export type FollowTag = (typeof FOLLOW_TAGS)[number];

/**
 * THE SIX KINDS OF EVIDENCE. Every date claim's `evidence` text begins
 * "EVIDENCE TYPE: <one of these>." so a reader always knows what kind of thing
 * is holding the date up.
 */
export const EVIDENCE_TYPES = [
  "archaeological",
  "contemporary written",
  "later historical account",
  "oral tradition",
  "religious tradition",
  "modern interpretation",
] as const;

/** The tags every record in a track carries: the expansion tag, the track tag, then its own. */
export function vodunTags(track: VodunTrackKey, follow: FollowTag[], ...own: string[]): string[] {
  return [VODUN_DIASPORA_TAG, VODUN_TRACK_TAGS[track], ...follow, ...own];
}

/** What every section file exports. */
export type VodunSection = {
  track: VodunTrackKey;
  sources: SeedSource[];
  events: SeedEvent[];
  /** Edges inside this track, to the other five, and out to records other datasets already seed. */
  links: SeedEventLink[];
};
