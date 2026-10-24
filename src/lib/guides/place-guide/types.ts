import type { GuidePhoto, ListingRef } from "@/lib/guides/where-to-stay/types";
import type { AdviceBlock, HotelGuideOverrides, HotelVerification, StayCategory } from "@/lib/guides/hotel-guide/types";

// The shape of an editorial guide to places rather than hotels ("Zanzibar's
// Picture-Perfect Places"). Each guide is one PlaceGuideDefinition; the page,
// admin page and actions are shared, as with the hotel guides.
//
// Every place keeps the editors' judgement (why it's here, what you see)
// apart from checked practicalities (where, when, how to visit), which are
// verified against current sources on the date in `verification`. Nothing
// here claims the editors visited, and there are never prices or fees.

export type PlaceKind = "beach" | "sandbank" | "island" | "reef" | "town" | "historic" | "nature" | "cave" | "viewpoint" | "restaurant" | "street-food" | "bar" | "activity" | "transport";

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
  // Approximate position (from its Google listing), for "near me" sorting.
  // Never shown as a pin.
  coords?: { lat: number; lng: number };
  photos: GuidePhoto[];
  verification: HotelVerification;
  // Restaurant guides: a relative price band (never a price), checked facts
  // for the at-a-glance panel (cuisine, booking, alcohol…), and the
  // community directory listing, matched by slug at request time.
  price?: "$" | "$$" | "$$$" | "$$$$";
  facts?: { label: string; value: string }[];
  listing?: ListingRef | null;
  // The same place in another of the community's guides (e.g. a beach bar
  // that is also in the restaurant guide), linked from the at-a-glance panel.
  seeAlso?: { label: string; guideSlug: string; placeKey: string }[];
};

// Section headings on each entry. Defaults suit places; a restaurant guide
// renames them ("What to order", "Booking and practicalities"…).
export type PlaceSectionLabels = {
  whyGo: string;
  bestTime: string;
  howToVisit: string;
  photoTips: string;
  considerations: string;
  fromStoneTown: string;
};

// A group of places close together ("Nungwi & Kendwa"), offered as a card
// at the top of the guide that shows only those places.
export type PlaceArea = { id: string; label: string; placeKeys: string[] };

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
  // A row of photos at the top of the article: which place, and which of its
  // photos (default the first). Opens in the photo viewer.
  mosaic: { placeKey: string; photo?: number }[];
  advice: AdviceBlock[];
  routes: { title: string; navLabel: string; intro: string; items: PlaceRoute[] };
  callToAction: { title: string; navLabel: string; paragraphs: string[]; commentPrompt: string; joinPrompt: string };
  editorialStandards: string;
  photoNote: string;
  places: Place[];
  labels?: Partial<PlaceSectionLabels>;
  // Lists every listing in the community's directory with this category,
  // live, under the guide's own picks (e.g. all directory restaurants).
  directorySection?: { title: string; navLabel: string; blurb: string; category: string } | null;
  // The hero's call-to-action button into the entries.
  heroCta?: string;
  // Area cards at the top (in place of the photo row) and a "near me" card,
  // for readers who want to see what's around them. `noun` names the places
  // ("bars"). Every place should be in exactly one area and have coords.
  // `nearPhoto` is the picture behind the "near me" card (default: none).
  // `title`/`blurb` replace the default "Where are you?" heading, for guides
  // whose cards group by something other than area (e.g. type of activity).
  areaFinder?: { noun: string; areas: PlaceArea[]; nearPhoto?: { placeKey: string; photo?: number }; title?: string; blurb?: string } | null;
};

// Stored overrides use the hotel guides' shape, with `hotelPhotos` keyed by
// place, so the same admin editor and actions serve both.
export type PlaceGuideOverrides = HotelGuideOverrides;
