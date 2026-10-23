import type { StayCategory } from "@/lib/guides/hotel-guide/types";
import type { Place, PlaceGuideDefinition } from "@/lib/guides/place-guide/types";
import { ADVICE, CALL_TO_ACTION, CATEGORY_CAVEAT, EDITORIAL_STANDARDS, HOW_TO_READ, INTRODUCTION, PHOTO_NOTE } from "./advice";
import { EAST_BARS } from "./bars-east";
import { NORTH_WEST_BARS } from "./bars-north-west";
import { SOUTH_BARS } from "./bars-south";

// "Sundowners & Full Moons: Zanzibar's Beach Bars", as a place guide (see place-guide/types.ts):
// sunset bars, parties, chilled and local bars, with price bands, entry
// rules and links to the same places in the restaurant guide.

export const BEACH_BARS_SLUG = "zanzibar-beach-bars";

const byKey = new Map([...NORTH_WEST_BARS, ...EAST_BARS, ...SOUTH_BARS].map((p) => [p.key, p]));

// By area: Stone Town, round the north, then down the east coast to the south.
const ORDER = [
  "mercurys",
  "livingstones",
  "tatu",
  "kajibange",
  "kibanda",
  "mama-mia",
  "bobo-beach",
  "z-rooftops",
  "kendwa-rocks",
  "marafiki-beach-bar",
  "the-beach-lounge",
  "il-pontile",
  "boho-lounge",
  "kae-funk",
  "michamvi-sunset-bay",
  "mr-kahawa",
  "mahali-beachbar",
  "b4-beach-club",
  "paje-by-night",
  "lost-soles",
  "new-teddys",
];

const BARS: Place[] = ORDER.map((key) => {
  const place = byKey.get(key);
  if (!place) throw new Error(`Unknown bar ${key}`);
  return place;
});

const CATEGORIES: StayCategory[] = [
  {
    id: "sunset",
    title: "Sunset over the sea",
    blurb: "West-facing bars where the sun goes down over the water.",
    hotelKeys: ["mercurys", "livingstones", "kajibange", "kibanda", "mama-mia", "z-rooftops", "kendwa-rocks", "kae-funk", "michamvi-sunset-bay"],
  },
  {
    id: "party",
    title: "Parties and late nights",
    blurb: "DJs, dancing and the full moon party.",
    hotelKeys: ["kendwa-rocks", "kae-funk", "b4-beach-club", "tatu", "kibanda", "paje-by-night"],
  },
  {
    id: "chilled",
    title: "Chilled and lazy",
    blurb: "Hammocks, swings, sunbeds and an afternoon that goes nowhere.",
    hotelKeys: ["kajibange", "the-beach-lounge", "mr-kahawa", "new-teddys", "boho-lounge", "bobo-beach", "marafiki-beach-bar"],
  },
  {
    id: "cocktails",
    title: "Serious cocktails",
    blurb: "Where the drinks are the point.",
    hotelKeys: ["z-rooftops", "mahali-beachbar", "lost-soles", "marafiki-beach-bar", "boho-lounge", "kibanda"],
  },
  {
    id: "music",
    title: "Live music and DJs",
    blurb: "Bands, salsa and sunset sets.",
    hotelKeys: ["livingstones", "mercurys", "mama-mia", "z-rooftops", "kae-funk", "b4-beach-club", "paje-by-night", "new-teddys"],
  },
  {
    id: "juices",
    title: "Fresh juices and no-alcohol",
    blurb: "Good places to go if you're not drinking.",
    hotelKeys: ["kajibange", "mr-kahawa", "new-teddys", "mama-mia", "il-pontile"],
  },
  {
    id: "local",
    title: "Local and easy-going",
    blurb: "Simple, sociable and kind on the wallet.",
    hotelKeys: ["tatu", "mercurys", "kajibange", "new-teddys", "lost-soles"],
  },
  {
    id: "families",
    title: "Good with children",
    blurb: "By day, at least.",
    hotelKeys: ["mama-mia", "the-beach-lounge", "mr-kahawa", "lost-soles"],
  },
];

export const BEACH_BARS_GUIDE: PlaceGuideDefinition = {
  slug: BEACH_BARS_SLUG,
  title: "Sundowners & Full Moons: Zanzibar's Beach Bars",
  subtitle: "Sunsets over the sea, the full moon party, reggae by the fishing boats and hammocks on the lagoon — where to drink on the island, and when.",
  seoTitle: "Zanzibar Beach Bars: Sundowners & Full Moons | Sunset Bars, Full Moon Party, Nungwi, Kendwa & Paje",
  description:
    "Zanzibar's beach bars: sunset bars in Nungwi and Stone Town, the Kendwa Rocks full moon party, Kae Funk, Paje's beach clubs and chilled Jambiani bars — with party nights, entry rules and tide tips.",
  cardBlurb: "Sunsets over the sea, the full moon party, reggae by the fishing boats and hammocks on the lagoon — where to drink on the island, and when.",
  // Sunset from the rooftop of The Z Hotel, Nungwi.
  heroPhoto: (byKey.get("z-rooftops")?.photos ?? [])[1] ?? BARS.flatMap((p) => p.photos)[0],
  introduction: INTRODUCTION,
  howToRead: HOW_TO_READ,
  categories: CATEGORIES,
  categoryCaveat: CATEGORY_CAVEAT,
  placesSection: {
    title: "The bars",
    blurb: "Twenty-one beach bars, by area: Stone Town, the north, then the east and south coasts. Tap any photo to see them all.",
    navGroup: "The bars",
  },
  mosaic: [
    { placeKey: "z-rooftops" },
    { placeKey: "kendwa-rocks" },
    { placeKey: "kajibange" },
    { placeKey: "il-pontile" },
    { placeKey: "mr-kahawa" },
    { placeKey: "livingstones" },
    { placeKey: "new-teddys" },
    { placeKey: "kae-funk", photo: 1 },
  ],
  advice: ADVICE,
  routes: {
    title: "An afternoon into the night",
    navLabel: "Bar crawls",
    intro: "A few ways to string bars together in one area.",
    items: [
      {
        id: "stone-town",
        title: "Stone Town",
        summary: "Salsa or a sundowner on the sand, then a rooftop that turns into a club.",
        stops: [
          { placeKey: "mercurys", when: "Before sunset", note: "Happy hour on the harbour terrace." },
          { placeKey: "livingstones", when: "Sunset", note: "A table on the sand — and salsa if it's Thursday." },
          { placeKey: "tatu", when: "Late", note: "Up to the rooftop; at weekends it becomes a club." },
        ],
      },
      {
        id: "nungwi",
        title: "Nungwi and Kendwa",
        summary: "A lazy afternoon by the boats, a sunset from up high and a night at Kendwa.",
        stops: [
          { placeKey: "kajibange", when: "Afternoon", note: "Swim, eat, a fresh juice with no added sugar." },
          { placeKey: "z-rooftops", when: "Sunset", note: "Be there by 17:00 for a seat; DJ on Wednesdays and Saturdays." },
          { placeKey: "kendwa-rocks", when: "After dark", note: "On full moon party nights, book tickets ahead and taxi back." },
        ],
      },
      {
        id: "michamvi",
        title: "The Michamvi peninsula",
        summary: "A day at a beach club facing The Rock, then across to the sunset side.",
        stops: [
          { placeKey: "boho-lounge", when: "Day", note: "Day pass, infinity pool and cocktails." },
          { placeKey: "kae-funk", when: "Sunset", note: "Swings, DJs and the sun going down over Chwaka Bay." },
        ],
      },
      {
        id: "paje-jambiani",
        title: "Paje and Jambiani",
        summary: "Swings and coffee, a proper cocktail, then a party or a fire.",
        stops: [
          { placeKey: "mr-kahawa", when: "Late morning", note: "A swing on the sand while the kites fill the lagoon." },
          { placeKey: "mahali-beachbar", when: "Early evening", note: "The Negroni." },
          { placeKey: "b4-beach-club", when: "Party night", note: "Or, for something gentler, round the fire at Lost Soles in Jambiani." },
        ],
      },
    ],
  },
  callToAction: CALL_TO_ACTION,
  editorialStandards: EDITORIAL_STANDARDS,
  photoNote: PHOTO_NOTE,
  places: BARS,
  labels: {
    whyGo: "Why it's in this guide",
    bestTime: "When to go",
    howToVisit: "Getting in",
    photoTips: "What to drink",
    considerations: "Worth knowing",
  },
  heroCta: "The bars",
};
