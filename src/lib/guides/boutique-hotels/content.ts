import type { HotelGuideDefinition } from "@/lib/guides/hotel-guide/types";
import { FEATURED_HOTELS, MORE_GEMS } from "./hotels";
import { BOUTIQUE_HERO_PHOTO } from "./photos";
import {
  AREAS,
  BOOKING_ADVICE,
  CALL_TO_ACTION,
  CATEGORIES,
  CATEGORY_CAVEAT,
  EDITORIAL_STANDARDS,
  HOW_TO_READ,
  INTRODUCTION,
  ITINERARY,
  VENUE_PHOTO_NOTE,
} from "./advice";
import { TRAVELLER_RECOMMENDATIONS, TRAVELLER_SOURCE } from "./community";

// "Hidden Gems: Zanzibar's Boutique Hotels", as a hotel guide
// definition (see hotel-guide/types.ts). The page, admin page and override
// handling are shared with the other hotel guides.

export const BOUTIQUE_HOTELS_SLUG = "best-boutique-hotels-zanzibar";

export const BOUTIQUE_GUIDE: HotelGuideDefinition = {
  slug: BOUTIQUE_HOTELS_SLUG,
  title: "Hidden Gems: Zanzibar's Boutique Hotels",
  subtitle: "Beautiful places to stay, from romantic beachfront hideaways to extraordinary private villas.",
  seoTitle: "Best Boutique Hotels in Zanzibar | Hidden Gems & Luxury Stays",
  description:
    "Discover Zanzibar's best boutique hotels, romantic beachfront hideaways, private villas and hidden gems. Independent recommendations and practical local advice.",
  // The short name on guide cards (Guides page and Guides space).
  cardTitle: "Boutique Hotels",
  cardBlurb: "Beautiful places to stay, from romantic beachfront hideaways to extraordinary private villas.",
  heroPhoto: BOUTIQUE_HERO_PHOTO,
  introduction: INTRODUCTION,
  howToRead: HOW_TO_READ,
  categories: CATEGORIES,
  categoryCaveat: CATEGORY_CAVEAT,
  featuredSection: {
    title: "Featured boutique hotels",
    blurb: "Twelve exceptional small hotels and villa retreats, from an eight-room adults-only hideaway to architectural landmarks. Listed in no particular order of merit.",
    navGroup: "Featured hotels",
  },
  moreSection: {
    title: "More boutique gems worth discovering",
    blurb: "Shorter entries for ten more characterful places to stay, from Stone Town to the quiet villages of the south-east.",
    navLabel: "More boutique gems",
  },
  travellers: { title: "Recommended by travellers who've actually stayed", source: TRAVELLER_SOURCE, items: TRAVELLER_RECOMMENDATIONS },
  bookingAdvice: BOOKING_ADVICE,
  areas: AREAS,
  itinerary: {
    title: "The perfect seven-night Zanzibar honeymoon",
    navLabel: "Seven-night honeymoon",
    intro: ITINERARY.intro,
    legs: ITINERARY.legs,
    why: { title: "Why split the stay?", body: ITINERARY.why },
    alternatives: { title: "Prefer not to change hotels?", items: ITINERARY.singleBase },
  },
  callToAction: {
    title: CALL_TO_ACTION.title,
    navLabel: "Share a hidden gem",
    paragraphs: CALL_TO_ACTION.paragraphs,
    commentPrompt: "Tell us about your favourite boutique hotel — it also appears on the guide's card in the community feed.",
    joinPrompt: "to share your own hidden gems and ask locals for advice. The guide itself is free to read.",
  },
  editorialStandards: EDITORIAL_STANDARDS,
  venuePhotoNote: VENUE_PHOTO_NOTE,
  featured: FEATURED_HOTELS,
  more: MORE_GEMS,
};
