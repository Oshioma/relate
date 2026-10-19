// VODUN, VODOU AND VOODOO: FROM THE BIGHT OF BENIN THROUGH THE ATLANTIC WORLD.
//
// Six tracks that extend the 35-record `benin-vodun` dataset without touching
// it: West Africa, the kingdoms, the Atlantic crossing, Haitian Vodou, the
// wider Americas, and the present day. Each is a section file in
// ./vodun-diaspora/ and its own seeded dataset, so a community can take one
// without the others; staff normally take all six with one button.
//
// The rules they are written under are in ./vodun-diaspora/shared.ts. The
// short version: earliest documentation is not origin, resemblance is not
// descent, and every date says what kind of evidence holds it up.

import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";
import { AFRICAN_ORIGINS } from "./vodun-diaspora/african-origins";
import { KINGDOMS } from "./vodun-diaspora/kingdoms";
import { ATLANTIC } from "./vodun-diaspora/atlantic";
import { HAITI } from "./vodun-diaspora/haiti";
import { AMERICAS } from "./vodun-diaspora/americas";
import { MODERN } from "./vodun-diaspora/modern";
import { VODUN_DIASPORA_ANCHORS, VODUN_DIASPORA_TRACKS, type VodunSection, type VodunTrackKey } from "./vodun-diaspora/shared";

export {
  EVIDENCE_TYPES,
  FOLLOW_TAGS,
  VODUN_DIASPORA_ANCHORS,
  VODUN_DIASPORA_TAG,
  VODUN_DIASPORA_TRACKS,
  VODUN_TRACK_TAGS,
} from "./vodun-diaspora/shared";

/** In reading order: from West Africa, across the ocean, to now. */
export const VODUN_DIASPORA_SECTIONS: VodunSection[] = [AFRICAN_ORIGINS, KINGDOMS, ATLANTIC, HAITI, AMERICAS, MODERN];

export type VodunDataset = {
  key: VodunTrackKey;
  label: string;
  track: SeedTrack;
  anchorSlug: string;
  events: SeedEvent[];
  sources: SeedSource[];
  links: SeedEventLink[];
};

/** The cover is the first picture in the gallery unless a record chose one. */
const withCover = (event: SeedEvent): SeedEvent =>
  event.imageUrl || !event.media?.length ? event : { ...event, imageUrl: event.media[0].url };

/** A link is one relationship however many ends wrote it; the first written is kept. */
const linkIdentity = (link: SeedEventLink) => `${[link.from, link.to].sort().join("|")}|${link.relation}|${link.viewpoint ?? ""}`;

/**
 * One seedable dataset per track.
 *
 * A LINK TRAVELS WITH THE LATER OF ITS TWO ENDS. The seeder writes a dataset's
 * edges only between records that already exist, so an edge from West Africa
 * to Haiti, kept with West Africa, would be dropped when the tracks are taken
 * in reading order. Kept with whichever of its two tracks is seeded second, it
 * is written the moment both ends exist. The source that asserts it travels
 * with it, so its citation is not lost on the way.
 */
export const VODUN_DIASPORA_DATASETS: VodunDataset[] = (() => {
  const order = new Map<string, number>();
  VODUN_DIASPORA_SECTIONS.forEach((section, index) => {
    for (const event of section.events) order.set(event.slug, index);
  });
  const sources = VODUN_DIASPORA_SECTIONS.map((section) => {
    const byKey = new Map<string, SeedSource>();
    for (const source of section.sources) if (!byKey.has(source.key)) byKey.set(source.key, source);
    return byKey;
  });
  const links: SeedEventLink[][] = VODUN_DIASPORA_SECTIONS.map(() => []);
  const seenLinks = new Set<string>();
  VODUN_DIASPORA_SECTIONS.forEach((section, writer) => {
    for (const link of section.links) {
      const id = linkIdentity(link);
      if (seenLinks.has(id)) continue;
      seenLinks.add(id);
      const home = Math.max(writer, order.get(link.from) ?? -1, order.get(link.to) ?? -1);
      links[home].push(link);
      const asserting = link.sourceKey ? sources[writer].get(link.sourceKey) : undefined;
      if (asserting && !sources[home].has(asserting.key)) sources[home].set(asserting.key, asserting);
    }
  });
  // Only the works something in the dataset actually cites: a source nobody
  // cites is a line in the bibliography with nothing to say.
  const cited = (section: VodunSection, index: number): Set<string> => {
    const keys = new Set<string>();
    for (const event of section.events) {
      for (const claim of event.claims) {
        if (claim.sourceKey) keys.add(claim.sourceKey);
        for (const citation of claim.citations ?? []) keys.add(citation.sourceKey);
      }
      for (const genealogy of event.genealogies ?? []) for (const step of genealogy.links) if (step.sourceKey) keys.add(step.sourceKey);
    }
    for (const link of links[index]) if (link.sourceKey) keys.add(link.sourceKey);
    return keys;
  };
  return VODUN_DIASPORA_SECTIONS.map((section, index) => {
    const track = VODUN_DIASPORA_TRACKS[section.track];
    const used = cited(section, index);
    return {
      key: section.track,
      label: track.name,
      track,
      anchorSlug: VODUN_DIASPORA_ANCHORS[section.track],
      events: section.events.map(withCover),
      sources: [...sources[index].values()].filter((source) => used.has(source.key)),
      links: links[index],
    };
  });
})();

/** Every record in the expansion, for the picture checks and the tests. */
export const VODUN_DIASPORA_EVENTS: SeedEvent[] = VODUN_DIASPORA_DATASETS.flatMap((dataset) => dataset.events);
export const VODUN_DIASPORA_LINKS: SeedEventLink[] = VODUN_DIASPORA_DATASETS.flatMap((dataset) => dataset.links);
