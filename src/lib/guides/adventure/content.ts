import type { StayCategory } from "@/lib/guides/hotel-guide/types";
import type { Place, PlaceGuideDefinition } from "@/lib/guides/place-guide/types";
import { ADVICE, CALL_TO_ACTION, CATEGORY_CAVEAT, EDITORIAL_STANDARDS, HOW_TO_READ, INTRODUCTION, PHOTO_NOTE } from "./advice";
import { LAND_AIR_ACTIVITIES } from "./land-air";
import { SEA_ACTIVITIES } from "./sea";
import { WATER_SPORTS_ACTIVITIES } from "./water-sports";

// "Off the Sun Lounger: Zanzibar's Adventures", as a place guide (see
// place-guide/types.ts): one entry per activity and place, grouped by type,
// with "near me" sorting and links to the operators in the directory.

export const ADVENTURE_SLUG = "zanzibar-adventures";

const byKey = new Map([...SEA_ACTIVITIES, ...WATER_SPORTS_ACTIVITIES, ...LAND_AIR_ACTIVITIES].map((p) => [p.key, p]));

const UNDER_THE_SEA = ["mnemba-diving", "north-coast-diving", "stone-town-reefs", "mnemba-snorkelling", "chumbe-snorkelling", "safari-blue-menai", "kizimkazi-dolphins", "nungwi-turtles", "nungwi-sea-walk", "deep-sea-fishing"];
const ON_THE_WATER = ["paje-kitesurfing", "jambiani-kitesurfing", "kiwengwa-kitesurfing", "wing-foiling", "reef-surfing", "sup-mangroves-chukwani", "kayak-michamvi-mangroves", "dhow-sailing-kendwa", "motor-watersports-kendwa"];
const ON_LAND = ["horse-riding", "quad-biking", "cycling", "jozani-forest", "kuza-cave", "mangapwani-caves", "masingini-zipline"];
const IN_THE_AIR = ["skydiving", "helicopter-flight"];

const ACTIVITIES: Place[] = [...UNDER_THE_SEA, ...ON_THE_WATER, ...ON_LAND, ...IN_THE_AIR].map((key) => {
  const place = byKey.get(key);
  if (!place) throw new Error(`Unknown activity ${key}`);
  return place;
});

const CATEGORIES: StayCategory[] = [
  {
    id: "adrenaline",
    title: "Pure adrenaline",
    blurb: "For when lying on the beach has lost its charm.",
    hotelKeys: ["skydiving", "north-coast-diving", "reef-surfing", "motor-watersports-kendwa", "quad-biking", "masingini-zipline"],
  },
  {
    id: "learn",
    title: "Learn something new",
    blurb: "Courses that leave you with a new skill.",
    hotelKeys: ["paje-kitesurfing", "jambiani-kitesurfing", "kiwengwa-kitesurfing", "wing-foiling", "mnemba-diving", "sup-mangroves-chukwani"],
  },
  {
    id: "families",
    title: "With children",
    blurb: "Adventures that work for younger travellers.",
    hotelKeys: ["safari-blue-menai", "sup-mangroves-chukwani", "kayak-michamvi-mangroves", "jozani-forest", "mnemba-snorkelling", "dhow-sailing-kendwa", "horse-riding"],
  },
  {
    id: "non-swimmers",
    title: "For non-swimmers",
    blurb: "Get close to the sea without needing to swim.",
    hotelKeys: ["nungwi-sea-walk", "dhow-sailing-kendwa", "kayak-michamvi-mangroves", "helicopter-flight", "motor-watersports-kendwa"],
  },
  {
    id: "wildlife",
    title: "Wildlife",
    blurb: "Reef fish, turtles, monkeys and, gently, dolphins.",
    hotelKeys: ["mnemba-diving", "chumbe-snorkelling", "jozani-forest", "stone-town-reefs", "kizimkazi-dolphins"],
  },
  {
    id: "near-stone-town",
    title: "Easy from Stone Town",
    blurb: "Within half an hour of the old town.",
    hotelKeys: ["stone-town-reefs", "chumbe-snorkelling", "sup-mangroves-chukwani", "cycling", "mangapwani-caves", "masingini-zipline", "safari-blue-menai"],
  },
  {
    id: "budget",
    title: "Adventures on a budget",
    blurb: "Big experiences that don't cost much.",
    hotelKeys: ["kuza-cave", "jozani-forest", "mangapwani-caves", "kayak-michamvi-mangroves", "cycling"],
  },
  {
    id: "splurge",
    title: "Once in a lifetime",
    blurb: "Worth saving for.",
    hotelKeys: ["skydiving", "helicopter-flight", "deep-sea-fishing", "mnemba-diving"],
  },
];

export const ADVENTURE_GUIDE: PlaceGuideDefinition = {
  slug: ADVENTURE_SLUG,
  title: "Off the Sun Lounger: Zanzibar's Adventures",
  subtitle: "Skydiving onto the beach, kitesurfing the lagoons, diving Mnemba, galloping across sandbanks and swimming in a cave — Zanzibar's adventures, and who to do them with.",
  seoTitle: "Best Adventure Activities in Zanzibar | Diving, Kitesurfing, Skydiving, Horse Riding & More",
  description:
    "The best adventures in Zanzibar: scuba diving and snorkelling at Mnemba, kitesurfing in Paje, skydiving over Kendwa, horse riding, quad biking, caves and Jozani forest — with operators, seasons, safety checks and honest caveats.",
  cardBlurb: "Skydiving onto the beach, kitesurfing the lagoons, diving Mnemba, galloping across sandbanks and swimming in a cave — Zanzibar's adventures, and who to do them with.",
  // A parachute over the turquoise north coast.
  heroPhoto: (byKey.get("skydiving")?.photos ?? [])[0] ?? ACTIVITIES.flatMap((p) => p.photos)[0],
  introduction: INTRODUCTION,
  howToRead: HOW_TO_READ,
  categories: CATEGORIES,
  categoryCaveat: CATEGORY_CAVEAT,
  placesSection: {
    title: "The adventures",
    blurb: "Twenty-eight adventures, by type: under the sea, on the water, on land and in the air. Tap any photo to see them all.",
    navGroup: "The adventures",
  },
  mosaic: [],
  advice: ADVICE,
  routes: {
    title: "An adventure day",
    navLabel: "Adventure days",
    intro: "A few ways to fill a day in one part of the island.",
    items: [
      {
        id: "north",
        title: "The north tip",
        summary: "Fly, ride and sail, all from Kendwa and Nungwi.",
        stops: [
          { placeKey: "skydiving", when: "Morning", note: "Early slots often have the clearest skies." },
          { placeKey: "horse-riding", when: "Afternoon", note: "A beach ride or a swim with the horses, depending on the tide." },
          { placeKey: "dhow-sailing-kendwa", when: "Sunset", note: "The sunset dhow leaves Kendwa beach around 16:30." },
        ],
      },
      {
        id: "south-east",
        title: "Paje and Jambiani",
        summary: "A kite lesson, a cave swim and the forest.",
        stops: [
          { placeKey: "jozani-forest", when: "Early morning", note: "The red colobus are most active before the crowds." },
          { placeKey: "paje-kitesurfing", when: "Midday", note: "Lessons are timed to the tide — book the slot ahead." },
          { placeKey: "kuza-cave", when: "Late afternoon", note: "A cool swim in the cave pool, after the day-tour rush." },
        ],
      },
      {
        id: "stone-town",
        title: "From Stone Town",
        summary: "Under the water, through the mangroves and into a cavern.",
        stops: [
          { placeKey: "stone-town-reefs", when: "Morning", note: "Dive or snorkel the Great Northern wreck." },
          { placeKey: "mangapwani-caves", when: "Afternoon", note: "Bring a head torch; go with respect." },
          { placeKey: "sup-mangroves-chukwani", when: "Sunset", note: "Paddle the mangroves to the floating bar — timed to the tide." },
        ],
      },
      {
        id: "north-east",
        title: "Matemwe and Kiwengwa",
        summary: "Mnemba below the surface, then the quads and the kites.",
        stops: [
          { placeKey: "mnemba-diving", when: "Morning", note: "Two dives, back by early afternoon." },
          { placeKey: "quad-biking", when: "Afternoon", note: "Through the villages from Kiwengwa — cover up." },
          { placeKey: "kiwengwa-kitesurfing", when: "Or instead", note: "A taster lesson at the Duotone centre." },
        ],
      },
    ],
  },
  callToAction: CALL_TO_ACTION,
  editorialStandards: EDITORIAL_STANDARDS,
  photoNote: PHOTO_NOTE,
  places: ACTIVITIES,
  labels: {
    whyGo: "Why it's in this guide",
    bestTime: "When to go",
    howToVisit: "Who runs it and how to book",
    photoTips: "Safety: what to check",
    considerations: "Worth knowing",
  },
  heroCta: "The adventures",
  areaFinder: {
    noun: "adventures",
    title: "What do you fancy?",
    blurb: "Pick a kind of adventure, or tap Near me to see what's closest to you.",
    nearPhoto: { placeKey: "chumbe-snorkelling", photo: 4 },
    areas: [
      { id: "under-the-sea", label: "Under the sea", placeKeys: UNDER_THE_SEA },
      { id: "on-the-water", label: "On the water", placeKeys: ON_THE_WATER },
      { id: "on-land", label: "On land", placeKeys: ON_LAND },
      { id: "in-the-air", label: "In the air", placeKeys: IN_THE_AIR },
    ],
  },
};
