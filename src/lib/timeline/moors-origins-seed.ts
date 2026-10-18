// THE ORIGINS OF THE MOORS: FROM PREHISTORIC NORTH AFRICA TO AL-ANDALUS.
//
// One track, opening at Jebel Irhoud about 315,000 years ago and closing with
// Tariq ibn Ziyad's crossing into Iberia in 711 CE. The opening is the opening
// of THIS TRACK, not a floor on the timeline: older discoveries can be added
// later without anything here moving.
//
// THE DISTINCTION THE TRACK EXISTS TO KEEP. Nobody at Jebel Irhoud, Taforalt
// or Takarkori was a Moor. "Mauri" is a name Latin writers gave to particular
// peoples of north-west Africa from about the third century BCE; "Moors" is
// the medieval European word that grew out of it and was stretched over
// Muslims of very different origins. Before that, the records are the deep
// human history of a region — and they say so. Population ancestry, culture,
// language, geography and political identity are kept apart throughout, and
// no ancient people is filed under a modern racial category.
//
// HOW IT IS BUILT. Seven section files in ./moors-origins/, each owning its
// own sources, records and links, assembled here. The lanes are the record's
// subcategory and a matching tag (see shared.ts), so the existing "Show on its
// own" dropdown opens any lane without new controls. Disputed theories are
// records in their own lane, each with the claim's genealogy, the case for,
// the case against, and what would change the assessment.

import type { SeedEvent, SeedEventLink, SeedSource } from "./seed-types";
import { PREHISTORY } from "./moors-origins/prehistory";
import { EGYPT_LIBYANS } from "./moors-origins/egypt-libyans";
import { CARTHAGE_ETRURIA } from "./moors-origins/carthage-etruria";
import { NUMIDIA_MAURETANIA } from "./moors-origins/numidia-mauretania";
import { SAHARA } from "./moors-origins/sahara";
import { ROMAN_LATE_ANTIQUE } from "./moors-origins/roman-late-antique";
import { WORDS_AND_THEORIES } from "./moors-origins/words-and-theories";

export {
  MOORS_ANCHOR_SLUG,
  MOORS_LANES,
  MOORS_LANE_TAGS,
  MOORS_TRACK,
  MOORS_TRACK_TAG,
  MOORS_TRACK_WINDOW,
} from "./moors-origins/shared";

/** In reading order. Records are sorted by date when drawn, so this is only the order of the files. */
export const MOORS_SECTIONS = {
  prehistory: PREHISTORY,
  egyptLibyans: EGYPT_LIBYANS,
  carthageEtruria: CARTHAGE_ETRURIA,
  numidiaMauretania: NUMIDIA_MAURETANIA,
  sahara: SAHARA,
  romanLateAntique: ROMAN_LATE_ANTIQUE,
  wordsAndTheories: WORDS_AND_THEORIES,
} as const;

const sections = Object.values(MOORS_SECTIONS);

/**
 * The cover is the first picture in each gallery unless a section chose one,
 * so the order a section lists its pictures in is the order of preference.
 */
export const MOORS_EVENTS: SeedEvent[] = sections
  .flatMap((section) => section.events)
  .map((event) => (event.imageUrl || !event.media?.length ? event : { ...event, imageUrl: event.media[0].url }));

/**
 * Sources from every section. A work cited by two sections is written once
 * with the same key in each and kept once here — the seeder would merge them
 * on title and author anyway, and one key per work keeps citations honest.
 */
export const MOORS_SOURCES: SeedSource[] = (() => {
  const byKey = new Map<string, SeedSource>();
  for (const source of sections.flatMap((section) => section.sources)) {
    if (!byKey.has(source.key)) byKey.set(source.key, source);
  }
  return [...byKey.values()];
})();

export const MOORS_LINKS: SeedEventLink[] = sections.flatMap((section) => section.links ?? []);
