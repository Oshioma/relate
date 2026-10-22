import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";
import type { AdviceBlock, HotelGuideOverrides, HotelVerification, StayCategory } from "@/lib/guides/hotel-guide/types";

// The shape of an editorial guide to places rather than hotels ("Zanzibar's
// Most Picturesque Places"). Each guide is one PlaceGuideDefinition; the page,
// admin page and actions are shared, as with the hotel guides.
//
// Every place keeps the editors' judgement (why it's here, what you see)
// apart from checked practicalities (where, when, how to visit), which are
// verified against current sources on the date in `verification`. Nothing
// here claims the editors visited, and there are never prices or fees.

export type PlaceKind = "beach" | "sandbank" | "island" | "reef" | "town" | "historic" | "nature" | "cave" | "viewpoint";

export type Place = {
  key: string;
  name: string;
  // Village or nearest landmark, and coast, e.g. "Jambiani" / "South-east coast".
  area: string;
  coast: string;
  kind: PlaceKind;
  tagline: string;
  description: string[];
  // What makes it picturesque, in a sentence or two.
  whyGo: string;
  // When the light, the tide and the season are at their best.
  bestTime: string;
  // Null where the tide doesn't matter.
  tide: string | null;
  howToVisit: string;
  // Practical photography advice: angles, light, etiquette.
  photoTips: string;
  considerations: string[];
  bestFor: string[];
  // Rough journey from Stone Town, e.g. "About an hour by road".
  fromStoneTown: string;
  website: string | null;
  websiteLabel?: string;
  // A search link, so it can never point at a made-up pin.
  mapsUrl: string;
  photos: GuidePhoto[];
  verification: HotelVerification;
};

// A suggested day: an ordered list of places with what to do there.
export type PlaceRoute = {
  id: string;
  title: string;
  summary: string;
  stops: { placeKey: string; when: string; note: string }[];
};

export type PlaceGuideDefinition = {
  slug: string;
  title: string;
  subtitle: string;
  seoTitle: string;
  description: string;
  cardBlurb: string;
  heroPhoto: GuidePhoto;
  introduction: string[];
  howToRead: { label: string; body: string }[];
  // `hotelKeys` name places here (the shape is shared with the hotel guides).
  categories: StayCategory[];
  categoryCaveat: string;
  placesSection: { title: string; blurb: string; navGroup: string };
  advice: AdviceBlock[];
  routes: { title: string; navLabel: string; intro: string; items: PlaceRoute[] };
  callToAction: { title: string; navLabel: string; paragraphs: string[]; commentPrompt: string; joinPrompt: string };
  editorialStandards: string;
  photoNote: string;
  places: Place[];
};

// Stored overrides use the hotel guides' shape, with `hotelPhotos` keyed by
// place, so the same admin editor and actions serve both.
export type PlaceGuideOverrides = HotelGuideOverrides;
