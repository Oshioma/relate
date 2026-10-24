import type { StayCategory } from "@/lib/guides/hotel-guide/types";
import type { Place, PlaceGuideDefinition } from "@/lib/guides/place-guide/types";
import { ADVICE, CALL_TO_ACTION, CATEGORY_CAVEAT, EDITORIAL_STANDARDS, HOW_TO_READ, INTRODUCTION, PHOTO_NOTE } from "./advice";
import { NORTH_RESTAURANTS } from "./restaurants-north";
import { SOUTH_RESTAURANTS } from "./restaurants-south";
import { STONE_TOWN_RESTAURANTS } from "./restaurants-stone-town";

// "Spice, Sea & Supper: Where to Eat in Zanzibar", as a place guide (see place-guide/types.ts),
// with restaurant section headings, price bands, links to the community
// directory and a live list of every restaurant in it.

export const RESTAURANTS_SLUG = "best-restaurants-zanzibar";

const byKey = new Map([...STONE_TOWN_RESTAURANTS, ...NORTH_RESTAURANTS, ...SOUTH_RESTAURANTS].map((p) => [p.key, p]));

// By area: Stone Town, round the north, then down the east coast to the south.
const ORDER = [
  "emerson-spice-tea-house",
  "6-degrees-south",
  "cape-town-fish-market",
  "the-fifth",
  "lukmaan",
  "abyssinian-maritim",
  "forodhani-night-market",
  "sexy-fish",
  "fishermans-seafood-grill",
  "fish-market-nungwi",
  "kajibange",
  "makofi",
  "hanoi-house-nungwi",
  "passion-thyme",
  "organzibar",
  "kae-funk",
  "boho-social",
  "the-rock",
  "mr-kahawa",
  "chez-hassan",
  "fahari-off-the-grid",
];

const RESTAURANTS: Place[] = ORDER.map((key) => {
  const place = byKey.get(key);
  if (!place) throw new Error(`Unknown restaurant ${key}`);
  return place;
});

const CATEGORIES: StayCategory[] = [
  {
    id: "special-occasion",
    title: "A special occasion",
    blurb: "Book ahead and dress up a little.",
    hotelKeys: ["the-rock", "emerson-spice-tea-house", "sexy-fish", "fahari-off-the-grid"],
  },
  {
    id: "sunset",
    title: "Dinner with a sunset",
    blurb: "West-facing tables where the sun goes down over the water.",
    hotelKeys: ["6-degrees-south", "emerson-spice-tea-house", "sexy-fish", "fishermans-seafood-grill", "kajibange", "kae-funk", "cape-town-fish-market"],
  },
  {
    id: "seafood",
    title: "Seafood",
    blurb: "The island's catch, from white tablecloths to tables on the sand.",
    hotelKeys: ["the-rock", "fish-market-nungwi", "fishermans-seafood-grill", "cape-town-fish-market", "sexy-fish"],
  },
  {
    id: "local",
    title: "Eat like a local",
    blurb: "Zanzibari and Swahili cooking at local prices.",
    hotelKeys: ["lukmaan", "forodhani-night-market", "chez-hassan", "fish-market-nungwi"],
  },
  {
    id: "vegetarian",
    title: "Vegetarian and vegan",
    blurb: "Where meat-free eaters do best.",
    hotelKeys: ["hanoi-house-nungwi", "abyssinian-maritim", "passion-thyme", "organzibar", "mr-kahawa"],
  },
  {
    id: "breakfast",
    title: "Breakfast and brunch",
    blurb: "Coffee, juices and a slow start.",
    hotelKeys: ["mr-kahawa", "passion-thyme", "organzibar", "boho-social"],
  },
  {
    id: "burgers",
    title: "A change from seafood",
    blurb: "Burgers, pizza and the island's other kitchens, for when you've had your fill of grilled fish.",
    hotelKeys: ["makofi", "hanoi-house-nungwi", "abyssinian-maritim"],
  },
  {
    id: "budget",
    title: "Good value",
    blurb: "Eating well without spending much.",
    hotelKeys: ["lukmaan", "forodhani-night-market", "chez-hassan", "fish-market-nungwi", "makofi"],
  },
  {
    id: "drinks",
    title: "Cocktails and a view",
    blurb: "For sundowners as much as dinner.",
    hotelKeys: ["6-degrees-south", "the-fifth", "kajibange", "makofi", "kae-funk", "boho-social"],
  },
];

export const RESTAURANTS_GUIDE: PlaceGuideDefinition = {
  slug: RESTAURANTS_SLUG,
  title: "Spice, Sea & Supper: Where to Eat in Zanzibar",
  subtitle: "From a restaurant on a rock in the sea to Stone Town's night market — where to eat on the island, and what to order.",
  seoTitle: "Best Restaurants in Zanzibar | Where to Eat in Stone Town, Nungwi & Paje",
  description:
    "The best restaurants in Zanzibar: The Rock, Stone Town rooftops, Forodhani night market, Nungwi seafood and local Swahili kitchens — with what to order, price bands and booking tips.",
  cardBlurb: "From a restaurant on a rock in the sea to Stone Town's night market — where to eat on the island, and what to order.",
  heroPhoto: (byKey.get("the-rock")?.photos ?? [])[0] ?? RESTAURANTS.flatMap((p) => p.photos)[0],
  introduction: INTRODUCTION,
  howToRead: HOW_TO_READ,
  categories: CATEGORIES,
  categoryCaveat: CATEGORY_CAVEAT,
  placesSection: {
    title: "The restaurants",
    blurb: "Twenty-one places to eat, by area: Stone Town, the north, then the east and south coasts. Tap any photo to see them all.",
    navGroup: "The restaurants",
  },
  mosaic: [
    { placeKey: "emerson-spice-tea-house" },
    { placeKey: "forodhani-night-market", photo: 1 },
    { placeKey: "sexy-fish" },
    { placeKey: "abyssinian-maritim" },
    { placeKey: "boho-social" },
    { placeKey: "lukmaan" },
    { placeKey: "fahari-off-the-grid", photo: 1 },
    { placeKey: "the-rock", photo: 4 },
  ],
  advice: ADVICE,
  routes: {
    title: "A day of eating well",
    navLabel: "Food days",
    intro: "A few ways to string meals together in one area.",
    items: [
      {
        id: "stone-town",
        title: "Stone Town",
        summary: "A local lunch, a rooftop sundowner and street food after dark.",
        stops: [
          { placeKey: "lukmaan", when: "Lunch", note: "Choose at the counter: biryani, coconut curry, fresh juice." },
          { placeKey: "6-degrees-south", when: "Sunset", note: "Cocktails on the rooftop over the sea." },
          { placeKey: "forodhani-night-market", when: "After dark", note: "Zanzibar pizza and sugar-cane juice by the water." },
        ],
      },
      {
        id: "nungwi",
        title: "Nungwi",
        summary: "Juice and a deli lunch, an afternoon on the beach, then burgers and music.",
        stops: [
          { placeKey: "passion-thyme", when: "Breakfast or lunch", note: "Paninis, salads and fresh juices." },
          { placeKey: "kajibange", when: "Afternoon", note: "Swim, eat, then chill with a cocktail as the sun goes down." },
          { placeKey: "makofi", when: "Dinner", note: "Burgers and pizza in the garden, with great music." },
        ],
      },
      {
        id: "michamvi",
        title: "The Michamvi peninsula",
        summary: "Lunch facing The Rock — or on it — and a sunset over Chwaka Bay.",
        stops: [
          { placeKey: "the-rock", when: "Lunch sitting", note: "Book a sitting that suits the tide." },
          { placeKey: "boho-social", when: "Or instead", note: "A long lunch on the sand, looking at The Rock." },
          { placeKey: "kae-funk", when: "Sunset", note: "Cross to the bay side for the sun going down over the water." },
        ],
      },
      {
        id: "south",
        title: "The south-east and south",
        summary: "Coffee on Paje beach, a home-cooked lunch in Jambiani and dinner among the baobabs.",
        stops: [
          { placeKey: "mr-kahawa", when: "Breakfast", note: "Tanzanian coffee and brunch on the sand." },
          { placeKey: "chez-hassan", when: "Lunch", note: "Swahili home cooking — order ahead and don't rush." },
          { placeKey: "fahari-off-the-grid", when: "Sunset dinner", note: "Check it's open and book before you drive." },
        ],
      },
    ],
  },
  callToAction: CALL_TO_ACTION,
  editorialStandards: EDITORIAL_STANDARDS,
  photoNote: PHOTO_NOTE,
  places: RESTAURANTS,
  labels: {
    whyGo: "Why it's in this guide",
    bestTime: "When to go",
    howToVisit: "Booking and getting there",
    photoTips: "What to order",
    considerations: "Worth knowing",
  },
  directorySection: {
    title: "Every restaurant in our directory",
    navLabel: "From our directory",
    blurb: "All the restaurants listed in the Mzungu Zanzibar directory — with members' reviews, opening hours and maps. The list updates as new places are added.",
    category: "restaurant",
  },
  heroCta: "The restaurants",
  areaFinder: {
    noun: "restaurants",
    nearPhoto: { placeKey: "6-degrees-south", photo: 2 },
    areas: [
      { id: "stone-town", label: "Stone Town", placeKeys: ["emerson-spice-tea-house", "6-degrees-south", "cape-town-fish-market", "the-fifth", "lukmaan", "abyssinian-maritim", "forodhani-night-market"] },
      { id: "nungwi-kendwa", label: "Nungwi & Kendwa", placeKeys: ["sexy-fish", "fishermans-seafood-grill", "fish-market-nungwi", "kajibange", "makofi", "hanoi-house-nungwi", "passion-thyme", "organzibar"] },
      { id: "michamvi", label: "Michamvi", placeKeys: ["kae-funk", "boho-social", "the-rock"] },
      { id: "south", label: "Paje, Jambiani & the south", placeKeys: ["mr-kahawa", "chez-hassan", "fahari-off-the-grid"] },
    ],
  },
};
