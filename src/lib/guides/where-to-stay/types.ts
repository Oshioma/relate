// The shape of the "Where to Stay in Zanzibar" guide.
//
// Everything a visitor compares, filters or is matched on is a closed label
// (never a made-up numeric score): the comparison table, the side-by-side
// compare, the quiz and the map all read these same fields, so one edit by an
// admin changes all of them consistently.

export type SwimmingLevel = "excellent" | "high-tide" | "tide-dependent" | "limited";
export type TideImpact = "low" | "moderate" | "strong";
export type Atmosphere = "peaceful" | "moderate" | "lively";
export type Nightlife = "low" | "medium" | "high";
export type RestaurantVariety = "limited" | "moderate" | "excellent";
export type Budget = "$" | "$$" | "$$$";
export type AccommodationVariety = "limited" | "good" | "wide";

// What a destination is good for. Drives the badges, the comparison filters
// and the quiz. Keys are stable; labels and icons live in labels.ts.
export type GuideTag =
  | "swimming"
  | "families"
  | "couples"
  | "honeymoon"
  | "solo"
  | "first-timers"
  | "nightlife"
  | "restaurants"
  | "cafes"
  | "kitesurfing"
  | "diving"
  | "snorkelling"
  | "peace"
  | "village"
  | "luxury"
  | "budget"
  | "remote-work"
  | "culture"
  | "sunsets"
  | "nature"
  | "wildlife"
  | "resort"
  | "shopping"
  | "walkability";

export type GuidePanel = {
  swimming: SwimmingLevel;
  tides: TideImpact;
  atmosphere: Atmosphere;
  nightlife: Nightlife;
  restaurants: RestaurantVariety;
  budget: Budget;
  accommodation: AccommodationVariety;
  // e.g. "4–7 nights". Free text so editors can say "1–2 nights" for Stone Town.
  nights: string;
};

export type GuidePhoto = {
  // A direct image URL. Wikimedia Commons originals are served through
  // next/image (WebP, responsive sizes); anything else renders as a plain lazy
  // <img>.
  src: string;
  alt: string;
  // What the picture actually shows. Starts with "UNVERIFIED —" when the
  // exact place cannot be confirmed (see AGENTS.md image policy).
  caption: string;
  credit: string;
  licence: string;
  licenceUrl?: string | null;
  sourceUrl: string;
  identificationStatus: "secure" | "unverified";
  width?: number;
  height?: number;
};

export type PriceCategory = "$" | "$$" | "$$$";

// A reference into the community's own directory: the listing's slug, looked
// up at request time inside this community. Never an id — ids differ between
// environments — and a listing that is missing, renamed or unpublished simply
// falls back to the recommendation's own public details.
export type ListingRef = { kind: "business" | "stay"; slug: string };

export type RestaurantRecommendation = {
  name: string;
  listing?: ListingRef | null;
  cuisine: string;
  price: PriceCategory;
  why: string;
  bestFor: string[];
  area: string;
  // Set when the place sits outside the destination ("15 minutes' drive in
  // Paje"), so it is never presented as being on the beach in question.
  nearby?: string | null;
  website?: string | null;
  social?: string | null;
  mapsUrl?: string | null;
  // A commercial or ownership link to Mzungu Zanzibar's operators, shown on
  // the card in full.
  disclosure?: string | null;
  // Shown on the card when something still needs checking.
  verificationNote?: string | null;
};

export type BeachPosition = "beachfront" | "cliff" | "short-walk" | "inland" | "unknown";

export type StayRecommendation = {
  name: string;
  listing?: ListingRef | null;
  type: string;
  price: PriceCategory;
  suits: string;
  why: string;
  position: BeachPosition;
  positionNote?: string | null;
  website?: string | null;
  disclosure?: string | null;
  verificationNote?: string | null;
};

export type GuideNote = { title: string; body: string };

export type Destination = {
  key: string;
  name: string;
  rank: number;
  category: string;
  coast: string;
  // Approximate centre of the village/area, for the overview map only.
  lat: number;
  lng: number;
  summary: string;
  bestFor: GuideTag[];
  panel: GuidePanel;
  intro: string;
  whyPeopleLoveIt: string;
  whatMakesItDifferent: string;
  whoShouldStay: string;
  whoMightNot: string;
  misunderstandings: string;
  beach: string;
  eatingOut: string;
  notes: GuideNote[];
  tradeOff: string;
  photos: GuidePhoto[];
  restaurants: RestaurantRecommendation[];
  stays: StayRecommendation[];
  editorialNote?: string | null;
};

// What admins may override per destination. Stored in
// editorial_guides.content.destinations[key]; any field left out keeps the
// built-in copy.
export type DestinationOverride = Partial<Omit<Destination, "key">>;

export type GuideOverrides = {
  destinations?: Record<string, DestinationOverride>;
  heroPhoto?: GuidePhoto | null;
  editorsNote?: string | null;
};
