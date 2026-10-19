import type { GuidePhoto, ListingRef } from "@/lib/guides/where-to-stay/types";

// The shape of an editorial hotel guide ("Zanzibar's Best Boutique Hotels &
// Hidden Gems", "Zanzibar's Best Luxury Resorts"). Each guide is one
// HotelGuideDefinition; the page, admin page and actions are shared.
//
// Every hotel separates three kinds of statement so the page can never blur
// them: the editors' own judgement (positioning, description, best for),
// facts checked against the hotel's own website and a current independent
// source (`facts`, `verification`), and what travellers said (community.ts,
// quoted verbatim and attributed). Nothing here claims the editors stayed.

// Relative only — never a nightly rate. "$$" is comfortable mid-range,
// "$$$" upscale boutique, "$$$$" top-end luxury villa.
export type HotelPrice = "$$" | "$$$" | "$$$$";

export type HotelVerification = {
  // "verified": operating, location, website and the facts listed were all
  // confirmed. "partial": open and located, but something listed in `gaps`
  // could not be confirmed. "unverified": could not be confirmed at all.
  status: "verified" | "partial" | "unverified";
  checkedOn: string;
  gaps: string[];
  sources: string[];
};

export type HotelFact = { label: string; value: string };

export type Hotel = {
  key: string;
  name: string;
  // Village and coast, e.g. "Jambiani" / "South-east coast".
  area: string;
  coast: string;
  tier: "featured" | "gem";
  positioning: string;
  style: string;
  atmosphere: string;
  bestFor: string[];
  price: HotelPrice;
  // Short, checked facts shown in the at-a-glance panel (rooms, adults-only…).
  facts: HotelFact[];
  description: string[];
  // Featured hotels only; the shorter "gem" entries leave these out.
  whyIncluded?: string;
  whatsDifferent?: string;
  food: string;
  beach: string;
  nearby?: string;
  considerations: string[];
  website: string | null;
  // Set when `website` is a booking listing rather than the hotel's own site.
  websiteLabel?: string;
  // A search link, so it can never point at a made-up pin.
  mapsUrl: string;
  // Photos of the hotel itself. Empty when no freely licensed photo exists —
  // the page then says so rather than borrowing someone else's picture.
  photos: GuidePhoto[];
  // Photos of the surrounding beach or village, always labelled as the area.
  // They fill the gallery when there is no licensed photo of the hotel.
  areaPhotos: GuidePhoto[];
  listing?: ListingRef | null;
  verification: HotelVerification;
};

export type TravellerRecommendation = {
  id: string;
  // As the person appears in the public discussion.
  person: string;
  role: "traveller" | "local-guide" | "travel-tip";
  // Who they are in the thread, in our words ("Recently back from her honeymoon").
  context: string;
  hotels: { name: string; area?: string | null; guideKey?: string | null; website?: string | null }[];
  // Verbatim excerpts only. Never edited, never invented.
  quotes: string[];
  // Our paraphrase of anything longer, clearly not a quotation.
  summary: string;
  // Shown under the card: what this is NOT (e.g. "Not a boutique property").
  note?: string | null;
  link?: { label: string; href: string } | null;
};

export type StayCategory = { id: string; title: string; blurb: string; hotelKeys: string[] };

export type AdviceBlock = { id: string; title: string; paragraphs: string[] };

export type AreaGuide = { name: string; coast: string; summary: string };

export type ItineraryLeg = {
  nights: string;
  where: string;
  focus: string[];
  body: string;
  suggestions: string[];
};

// A suggested trip: two or more legs, why it's split, and alternatives.
export type HotelGuideItinerary = {
  title: string;
  navLabel: string;
  intro: string;
  legs: ItineraryLeg[];
  why: { title: string; body: string } | null;
  alternatives: { title: string; items: string[] };
};

// Everything that differs between hotel guides. Copy is plain text; hotel
// keys referenced by categories and itineraries must exist in the guide.
export type HotelGuideDefinition = {
  slug: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  description: string;
  // One line for the guides index, feed card and Guides space.
  cardBlurb: string;
  heroPhoto: GuidePhoto;
  introduction: string[];
  howToRead: { label: string; body: string }[];
  categories: StayCategory[];
  categoryCaveat: string;
  featuredSection: { title: string; blurb: string; navGroup: string };
  moreSection: { title: string; blurb: string; navLabel: string };
  travellers: { title: string; source: string; items: TravellerRecommendation[] } | null;
  bookingAdvice: AdviceBlock[];
  areas: AreaGuide[];
  itinerary: HotelGuideItinerary;
  callToAction: { title: string; navLabel: string; paragraphs: string[]; commentPrompt: string; joinPrompt: string };
  editorialStandards: string;
  venuePhotoNote: string;
  featured: Hotel[];
  more: Hotel[];
};

// What admins may override, stored in editorial_guides.content.
export type HotelGuideOverrides = {
  heroPhoto?: GuidePhoto | null;
  editorsNote?: string | null;
  // Licensed photos added later (e.g. a hotel's written permission), keyed by
  // hotel key. Replaces the built-in photos for that hotel.
  hotelPhotos?: Record<string, GuidePhoto[]>;
};
