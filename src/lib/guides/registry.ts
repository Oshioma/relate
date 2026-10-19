import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";
import { guideCardImage, parseOverrides, resolveGuideContent, WHERE_TO_STAY_SLUG } from "@/lib/guides/where-to-stay/content";
import {
  BOUTIQUE_HOTELS_SLUG,
  boutiqueCardImage,
  parseBoutiqueOverrides,
  resolveBoutiqueContent,
} from "@/lib/guides/boutique-hotels/content";

// The editorial guides the app knows how to render, keyed by slug. The
// guides index, the community feed and the Guides space all describe a guide
// from here, so adding a guide is one entry rather than a slug check in each.

type GuideEntry = {
  // One line for cards (guides index, feed, Guides space).
  blurb: string;
  hero: (content: unknown) => GuidePhoto | null;
  // The hero sized for a feed card.
  cardImage: (content: unknown) => string | null;
};

const GUIDES: Record<string, GuideEntry> = {
  [WHERE_TO_STAY_SLUG]: {
    blurb: "Compare Zanzibar's 14 best beach destinations and find the right one for your holiday.",
    hero: (content) => resolveGuideContent(parseOverrides(content)).heroPhoto,
    cardImage: guideCardImage,
  },
  [BOUTIQUE_HOTELS_SLUG]: {
    blurb: "Beautiful places to stay, from romantic beachfront hideaways to extraordinary private villas.",
    hero: (content) => resolveBoutiqueContent(parseBoutiqueOverrides(content)).heroPhoto,
    cardImage: boutiqueCardImage,
  },
};

export function editorialGuideEntry(slug: string): GuideEntry | null {
  return GUIDES[slug] ?? null;
}
