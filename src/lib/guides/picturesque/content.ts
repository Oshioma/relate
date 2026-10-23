import type { StayCategory } from "@/lib/guides/hotel-guide/types";
import type { Place, PlaceGuideDefinition } from "@/lib/guides/place-guide/types";
import { ADVICE, CALL_TO_ACTION, CATEGORY_CAVEAT, EDITORIAL_STANDARDS, HOW_TO_READ, INTRODUCTION, PHOTO_NOTE } from "./advice";
import { NORTH_EAST_PLACES } from "./places-north-east";
import { SOUTH_PLACES } from "./places-south";
import { STONE_TOWN_PLACES } from "./places-stone-town";

// "Postcards from Zanzibar: The Island's Picture-Perfect Places", as a place guide definition (see
// place-guide/types.ts). The page, admin page and override handling are
// shared with any other place guide.

export const PICTURESQUE_SLUG = "most-picturesque-places-zanzibar";

const byKey = new Map([...STONE_TOWN_PLACES, ...NORTH_EAST_PLACES, ...SOUTH_PLACES].map((p) => [p.key, p]));

// Roughly by area: Stone Town and the west, round the north and down the
// east coast to the south.
const ORDER = [
  "stone-town",
  "forodhani",
  "stone-town-rooftops",
  "prison-island",
  "nakupenda",
  "chumbe",
  "maruhubi",
  "mangapwani",
  "nungwi",
  "kendwa",
  "mnemba",
  "matemwe",
  "pongwe",
  "jozani",
  "michamvi-kae",
  "the-rock",
  "paje",
  "jambiani",
  "kuza-cave",
  "mtende",
  "menai-bay",
];

const PLACES: Place[] = ORDER.map((key) => {
  const place = byKey.get(key);
  if (!place) throw new Error(`Unknown place ${key}`);
  return place;
});

const CATEGORIES: StayCategory[] = [
  {
    id: "sunsets",
    title: "Sunsets over the sea",
    blurb: "West-facing spots where the sun goes down into the water.",
    hotelKeys: ["forodhani", "stone-town-rooftops", "kendwa", "nungwi", "michamvi-kae", "mangapwani"],
  },
  {
    id: "sunrises",
    title: "Sunrise",
    blurb: "East-coast beaches where the day starts over the reef.",
    hotelKeys: ["matemwe", "pongwe", "paje", "jambiani", "mtende"],
  },
  {
    id: "turquoise",
    title: "Turquoise water and sandbanks",
    blurb: "The colours that made Zanzibar famous.",
    hotelKeys: ["nakupenda", "mnemba", "menai-bay", "paje", "the-rock"],
  },
  {
    id: "history",
    title: "History and architecture",
    blurb: "Carved doors, palaces and places of remembrance.",
    hotelKeys: ["stone-town", "maruhubi", "mangapwani", "prison-island"],
  },
  {
    id: "nature",
    title: "Wildlife and nature",
    blurb: "Monkeys, tortoises, turtles and reefs.",
    hotelKeys: ["jozani", "prison-island", "chumbe", "mnemba"],
  },
  {
    id: "hidden",
    title: "Off the beaten track",
    blurb: "Quieter corners that feel like a find.",
    hotelKeys: ["mtende", "kuza-cave", "maruhubi", "pongwe"],
  },
  {
    id: "low-tide",
    title: "Best at low tide",
    blurb: "When the east-coast sea goes out, these come into their own.",
    hotelKeys: ["jambiani", "nakupenda", "kuza-cave", "matemwe"],
  },
  {
    id: "families",
    title: "Good with children",
    blurb: "Easy trips with something to see and do.",
    hotelKeys: ["prison-island", "jozani", "kendwa", "forodhani"],
  },
];

export const PICTURESQUE_GUIDE: PlaceGuideDefinition = {
  slug: PICTURESQUE_SLUG,
  title: "Postcards from Zanzibar: The Island's Picture-Perfect Places",
  subtitle: "Sandbanks and sunsets, carved doors and coral caves — the island's most beautiful places, and when to be there.",
  seoTitle: "Postcards from Zanzibar | Picture-Perfect Beaches, Sandbanks & Photo Spots",
  description:
    "Zanzibar's picture-perfect places: The Rock, Nakupenda sandbank, Stone Town's carved doors, Kendwa sunsets, Mnemba, Jozani forest and more — with the best time of day, tide advice and how to visit.",
  cardBlurb: "Sandbanks and sunsets, carved doors and coral caves — the island's most beautiful places, and when to be there.",
  heroPhoto: (byKey.get("the-rock")?.photos ?? [])[0] ?? PLACES.flatMap((p) => p.photos)[0],
  introduction: INTRODUCTION,
  howToRead: HOW_TO_READ,
  categories: CATEGORIES,
  categoryCaveat: CATEGORY_CAVEAT,
  placesSection: {
    title: "The places",
    blurb: "Twenty-one of the island's most beautiful spots, from Stone Town round the north and down the east coast to the south. Tap any photo to see them all.",
    navGroup: "The places",
  },
  mosaic: [
    { placeKey: "nakupenda" },
    { placeKey: "stone-town" },
    { placeKey: "kendwa" },
    { placeKey: "jozani" },
    { placeKey: "menai-bay" },
    { placeKey: "kuza-cave" },
    { placeKey: "mnemba" },
    { placeKey: "the-rock", photo: 2 },
  ],
  advice: ADVICE,
  routes: {
    title: "Picturesque days out",
    navLabel: "Days out",
    intro: "A few ways to string the places together. Check the tide table first: on the east coast, the tide decides the order of the day.",
    items: [
      {
        id: "stone-town-day",
        title: "A day in and around Stone Town",
        summary: "Old-town lanes in the morning light, a boat to the sandbank and the tortoises, and sunset on a rooftop.",
        stops: [
          { placeKey: "stone-town", when: "Early morning", note: "Walk the lanes with a guide while they're quiet and the light is soft." },
          { placeKey: "nakupenda", when: "Late morning, at low tide", note: "Time the boat for low tide, when the sandbank is at its biggest." },
          { placeKey: "prison-island", when: "Early afternoon", note: "Often combined with Nakupenda on the same boat." },
          { placeKey: "stone-town-rooftops", when: "Sunset", note: "Sundowners above the roofs, then down to Forodhani for the night market." },
        ],
      },
      {
        id: "south-east-day",
        title: "A south-east coast day",
        summary: "The lagoon at its most colourful, a swim in a cave while the tide is out, and lunch on the rock.",
        stops: [
          { placeKey: "jozani", when: "Morning", note: "Red colobus and the mangrove boardwalk, on the road from Stone Town." },
          { placeKey: "the-rock", when: "Lunch sitting", note: "Book a sitting that matches the tide you want to see." },
          { placeKey: "kuza-cave", when: "At low tide", note: "When the sea is out, swim in the cave instead." },
          { placeKey: "paje", when: "Late afternoon", note: "Kites on the lagoon when the wind is up." },
        ],
      },
      {
        id: "north-day",
        title: "A north coast day",
        summary: "Snorkelling at Mnemba, the dhow yard at Nungwi and a sunset at Kendwa.",
        stops: [
          { placeKey: "mnemba", when: "Morning", note: "Boat from Muyuni or Matemwe while the sea is calm." },
          { placeKey: "nungwi", when: "Afternoon", note: "The dhow builders, the lighthouse and the turtle lagoon." },
          { placeKey: "kendwa", when: "Sunset", note: "Swim at any tide, and stay for the blue hour." },
        ],
      },
      {
        id: "sea-day",
        title: "A day at sea in the south-west",
        summary: "Dhows, sandbanks, a mangrove lagoon and the fallen baobab of Kwale Island.",
        stops: [
          { placeKey: "menai-bay", when: "All day", note: "Dhow trips from Fumba; choose an operator that keeps its distance from the dolphins." },
          { placeKey: "mtende", when: "Another day", note: "Pair the far south's hidden cove with Kuza Cave or Jambiani." },
        ],
      },
    ],
  },
  callToAction: CALL_TO_ACTION,
  editorialStandards: EDITORIAL_STANDARDS,
  photoNote: PHOTO_NOTE,
  places: PLACES,
};
