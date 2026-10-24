import type { StayCategory } from "@/lib/guides/hotel-guide/types";
import type { Place, PlaceGuideDefinition } from "@/lib/guides/place-guide/types";
import { ADVICE, CALL_TO_ACTION, CATEGORY_CAVEAT, EDITORIAL_STANDARDS, HOW_TO_READ, INTRODUCTION, PHOTO_NOTE } from "./advice";
import { ISLAND_WAYS } from "./island";
import { SEA_AIR_WAYS } from "./sea-air";

// "Pole Pole: How to Get Around Zanzibar", as a place guide (see
// place-guide/types.ts): one entry per way of getting about, grouped by type,
// with every taxi in the community directory listed live at the end.

export const GETTING_AROUND_SLUG = "getting-around-zanzibar";

const byKey = new Map([...ISLAND_WAYS, ...SEA_AIR_WAYS].map((p) => [p.key, p]));

const FLYING = ["airport", "flights"];
const BUSES = ["zanzibus", "dala-dala"];
const RIDES = ["taxis", "ride-hailing", "bajaji", "boda-boda"];
const OWN_STEAM = ["car-hire", "scooter-hire", "cycling", "walking"];
const BOATS = ["ferry-dar", "stone-town-port", "ferry-pemba", "boats"];

const WAYS: Place[] = [...FLYING, ...BUSES, ...RIDES, ...OWN_STEAM, ...BOATS].map((key) => {
  const place = byKey.get(key);
  if (!place) throw new Error(`Unknown way of getting around ${key}`);
  return place;
});

const CATEGORIES: StayCategory[] = [
  {
    id: "just-landed",
    title: "Just landed",
    blurb: "From the plane to your bed without the haggling.",
    hotelKeys: ["airport", "zanzibus", "taxis"],
  },
  {
    id: "budget",
    title: "On a shoestring",
    blurb: "The cheapest ways about.",
    hotelKeys: ["dala-dala", "zanzibus", "bajaji", "cycling", "walking"],
  },
  {
    id: "families",
    title: "With children and luggage",
    blurb: "Room for bags, buckets and sleepy passengers.",
    hotelKeys: ["taxis", "zanzibus", "car-hire", "boats"],
  },
  {
    id: "freedom",
    title: "Your own wheels",
    blurb: "Stop wherever you like.",
    hotelKeys: ["car-hire", "scooter-hire", "cycling"],
  },
  {
    id: "stone-town",
    title: "Around Stone Town",
    blurb: "Lanes, the waterfront and the islands offshore.",
    hotelKeys: ["walking", "bajaji", "ride-hailing", "boats", "stone-town-port"],
  },
  {
    id: "onward",
    title: "Off the island",
    blurb: "To Dar, Pemba and the safari parks.",
    hotelKeys: ["ferry-dar", "flights", "ferry-pemba", "stone-town-port"],
  },
  {
    id: "extra-care",
    title: "Take extra care",
    blurb: "Where most of the accidents happen — read these before you go.",
    hotelKeys: ["boda-boda", "scooter-hire", "car-hire", "boats"],
  },
];

export const GETTING_AROUND_GUIDE: PlaceGuideDefinition = {
  slug: GETTING_AROUND_SLUG,
  title: "Pole Pole: How to Get Around Zanzibar",
  subtitle: "Dala dalas, the Zanzibus shuttle, drivers on WhatsApp, tuk-tuks, scooters, bikes, wooden boats and the ferry to Dar — every way around the island, and how to use it.",
  seoTitle: "How to Get Around Zanzibar | Taxis, Dala Dala, Zanzibus Shuttle, Car Hire, Ferries & Flights",
  description:
    "How to get around Zanzibar: airport transfers, taxis and private drivers, the Zanzibus shuttle, dala dalas, Bolt, bajaji, car and scooter hire with the Zanzibar driving permit, bikes, ferries to Dar es Salaam and Pemba, and flights — checked and honest.",
  cardBlurb: "Dala dalas, the Zanzibus shuttle, drivers on WhatsApp, tuk-tuks, scooters, bikes, wooden boats and the ferry to Dar — every way around the island, and how to use it.",
  // A dala dala in Stone Town, roof piled high.
  heroPhoto: (byKey.get("dala-dala")?.photos ?? [])[0] ?? WAYS.flatMap((p) => p.photos)[0],
  introduction: INTRODUCTION,
  howToRead: HOW_TO_READ,
  categories: CATEGORIES,
  categoryCaveat: CATEGORY_CAVEAT,
  placesSection: {
    title: "Every way around",
    blurb: "Sixteen ways to get about, by type: flying in and out, buses and shuttles, taxis and rides, under your own steam, and boats and ferries. Tap any photo to see them all.",
    navGroup: "Ways around",
  },
  mosaic: [],
  advice: ADVICE,
  routes: {
    title: "Putting it together",
    navLabel: "Sample journeys",
    intro: "A few common journeys, and the easiest ways to make them.",
    items: [
      {
        id: "airport-to-beach",
        title: "From the plane to the beach",
        summary: "Landing in Zanzibar and heading straight for the coast.",
        stops: [
          { placeKey: "airport", when: "Before you fly", note: "Buy the inbound insurance and book your ride." },
          { placeKey: "zanzibus", when: "Morning arrivals", note: "The 10:00 shuttle to Paje or Nungwi, from Safari Café." },
          { placeKey: "taxis", when: "Any other time", note: "A pre-booked driver meets you with a sign." },
        ],
      },
      {
        id: "stone-town-day",
        title: "A day in Stone Town from the east coast",
        summary: "In by bus, around on foot, out to an island, home before dark.",
        stops: [
          { placeKey: "dala-dala", when: "Morning", note: "Into Darajani with the commuters — or book a driver." },
          { placeKey: "walking", when: "Late morning", note: "Lose yourself in the lanes, then find the sea." },
          { placeKey: "boats", when: "Afternoon", note: "Prison Island and back, before the wind gets up." },
          { placeKey: "taxis", when: "After Forodhani", note: "A driver back to the coast — not a long drive in the dark yourself." },
        ],
      },
      {
        id: "south-east",
        title: "The south-east on two wheels",
        summary: "Paje, Jambiani and the beach road.",
        stops: [
          { placeKey: "cycling", when: "Early morning", note: "Paje to Jambiani before the heat." },
          { placeKey: "walking", when: "Low tide", note: "Back along the sand as the sea goes out." },
          { placeKey: "scooter-hire", when: "Or instead", note: "Further, to Michamvi — if you're an experienced rider." },
        ],
      },
      {
        id: "onward",
        title: "On to the mainland",
        summary: "Leaving for Dar es Salaam or a safari.",
        stops: [
          { placeKey: "stone-town-port", when: "An hour before sailing", note: "Check in at Malindi with your passport." },
          { placeKey: "ferry-dar", when: "Early morning", note: "The first fast ferry is usually the calmest." },
          { placeKey: "flights", when: "Or fly", note: "Twenty minutes to Dar, or straight to a safari strip." },
        ],
      },
    ],
  },
  callToAction: CALL_TO_ACTION,
  editorialStandards: EDITORIAL_STANDARDS,
  photoNote: PHOTO_NOTE,
  places: WAYS,
  labels: {
    whyGo: "Why use it",
    bestTime: "When",
    howToVisit: "How it works",
    photoTips: "Safety and scams",
    considerations: "Worth knowing",
  },
  heroCta: "Every way around",
  directorySection: {
    title: "Taxis and drivers in our directory",
    navLabel: "Our drivers",
    blurb: "Every taxi, driver and transfer service listed in the Mzungu Zanzibar directory — with members' reviews and how to contact them. The list updates as new ones are added; know a good driver? Add them.",
    category: "taxi",
  },
  areaFinder: {
    noun: "ways around",
    title: "How do you want to travel?",
    blurb: "Pick a kind of transport, or tap Near me to see what's closest to you.",
    nearPhoto: { placeKey: "boats", photo: 4 },
    areas: [
      { id: "flying", label: "Flying in and out", placeKeys: FLYING },
      { id: "buses", label: "Buses and shuttles", placeKeys: BUSES },
      { id: "rides", label: "Taxis and rides", placeKeys: RIDES },
      { id: "own-steam", label: "Under your own steam", placeKeys: OWN_STEAM },
      { id: "boats", label: "Boats and ferries", placeKeys: BOATS },
    ],
  },
};
