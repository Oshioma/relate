// THE SERPENT ACROSS CIVILIZATIONS: DAN, EGYPT, KUSH AND WEST AFRICAN VODUN.
//
// One track, nine lanes, one question: is there a demonstrable historical,
// religious, linguistic or migratory connection between the tribe of Dan,
// Egyptian and Kushite serpent religion, and the Dan and Dangbé traditions of
// the Gbe-speaking coast? The track does not assume the answer. It sets out
// what each tradition's evidence actually is, compares names, gods, rituals
// and landscapes item by item with a fixed assessment vocabulary, weighs five
// possible routes, and ends in an evidence matrix (its anchor record).
//
// It extends, and does not repeat, the serpent records already seeded by
// benin-vodun, the Vodun kingdoms track, set-sutekh and serpent-kundalini:
// where those cover a topic this track links to them.
//
// Seven section files in ./serpent-civilizations/, each owning its sources,
// records and links, assembled here. The rules are in shared.ts and are held
// by serpent-civilizations.test.ts.

import type { SeedEvent, SeedEventLink, SeedSource } from "./seed-types";
import { DAN } from "./serpent-civilizations/dan";
import { AFRICAN_JEWISH } from "./serpent-civilizations/african-jewish";
import { EGYPT } from "./serpent-civilizations/egypt";
import { KUSH } from "./serpent-civilizations/kush";
import { GBE } from "./serpent-civilizations/gbe";
import { WORDS_AND_RITUALS } from "./serpent-civilizations/words-and-rituals";
import { ROUTES_AND_ASSESSMENT } from "./serpent-civilizations/routes-and-assessment";

export {
  COMPARISON_ASSESSMENTS,
  EVIDENCE_TYPES,
  HYPOTHESIS_ASSESSMENTS,
  SERPENT_CIVILIZATIONS_ANCHOR_SLUG,
  SERPENT_CIVILIZATIONS_TAG,
  SERPENT_CIVILIZATIONS_TRACK,
  SERPENT_LANE_ANCHORS,
  SERPENT_LANE_TAGS,
  SERPENT_LANES,
  SERPENT_THREADS,
} from "./serpent-civilizations/shared";

/** In reading order. Records are sorted by date when drawn, so this is only the order of the files. */
export const SERPENT_SECTIONS = {
  dan: DAN,
  africanJewish: AFRICAN_JEWISH,
  egypt: EGYPT,
  kush: KUSH,
  gbe: GBE,
  wordsAndRituals: WORDS_AND_RITUALS,
  routesAndAssessment: ROUTES_AND_ASSESSMENT,
} as const;

const sections = Object.values(SERPENT_SECTIONS);

/** The cover is the first picture in each gallery unless a record chose one. */
export const SERPENT_EVENTS: SeedEvent[] = sections
  .flatMap((section) => section.events)
  .map((event) => (event.imageUrl || !event.media?.length ? event : { ...event, imageUrl: event.media[0].url }));

/** One link is one relationship however many ends wrote it; the first written is kept. */
export const SERPENT_LINKS: SeedEventLink[] = (() => {
  const seen = new Set<string>();
  const out: SeedEventLink[] = [];
  for (const link of sections.flatMap((section) => section.links)) {
    const id = `${[link.from, link.to].sort().join("|")}|${link.relation}|${link.viewpoint ?? ""}`;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(link);
  }
  return out;
})();

/**
 * Sources from every section, once each, and only the works something
 * actually cites: a source nobody cites is a bibliography line with nothing to say.
 */
export const SERPENT_SOURCES: SeedSource[] = (() => {
  const cited = new Set<string>();
  for (const event of SERPENT_EVENTS) {
    for (const claim of event.claims) {
      if (claim.sourceKey) cited.add(claim.sourceKey);
      for (const citation of claim.citations ?? []) cited.add(citation.sourceKey);
    }
    for (const genealogy of event.genealogies ?? []) for (const step of genealogy.links) if (step.sourceKey) cited.add(step.sourceKey);
    for (const passage of event.passages ?? []) {
      if (passage.sourceKey) cited.add(passage.sourceKey);
      for (const layer of passage.layers) if (layer.sourceKey) cited.add(layer.sourceKey);
    }
  }
  for (const link of SERPENT_LINKS) if (link.sourceKey) cited.add(link.sourceKey);
  const byKey = new Map<string, SeedSource>();
  for (const source of sections.flatMap((section) => section.sources)) {
    if (!byKey.has(source.key) && cited.has(source.key)) byKey.set(source.key, source);
  }
  return [...byKey.values()];
})();
