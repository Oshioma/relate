import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";
import { guideCardImage, parseOverrides, resolveGuideContent, WHERE_TO_STAY_SLUG } from "@/lib/guides/where-to-stay/content";
import { hotelGuideCardImage, loadHotelGuide } from "@/lib/guides/hotel-guide/content";
import { hotelGuideFor } from "@/lib/guides/hotel-guide/registry";

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

const WHERE_TO_STAY: GuideEntry = {
  blurb: "Compare Zanzibar's 14 best beach destinations and find the right one for your holiday.",
  hero: (content) => resolveGuideContent(parseOverrides(content)).heroPhoto,
  cardImage: guideCardImage,
};

export function editorialGuideEntry(slug: string): GuideEntry | null {
  if (slug === WHERE_TO_STAY_SLUG) return WHERE_TO_STAY;
  const hotels = hotelGuideFor(slug);
  if (!hotels) return null;
  return {
    blurb: hotels.cardBlurb,
    hero: (content) => loadHotelGuide(hotels, content).heroPhoto,
    cardImage: (content) => hotelGuideCardImage(hotels, content),
  };
}
