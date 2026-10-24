import type { HotelGuideDefinition, StayCategory } from "@/lib/guides/hotel-guide/types";
import { FEATURED_RESORTS, MORE_RESORTS } from "./hotels";
import { RESORT_PHOTOS } from "./resort-photos";
import {
  AREAS,
  BOOKING_ADVICE,
  CALL_TO_ACTION,
  CATEGORY_CAVEAT,
  EDITORIAL_STANDARDS,
  HOW_TO_READ,
  INTRODUCTION,
  VENUE_PHOTO_NOTE,
} from "./advice";

// "Barefoot Luxury: Zanzibar's Five-Star Escapes", as a hotel guide definition (see
// hotel-guide/types.ts). The page, admin page and override handling are
// shared with the other hotel guides.

export const LUXURY_RESORTS_SLUG = "best-luxury-resorts-zanzibar";

const CATEGORIES: StayCategory[] = [
  {
    id: "private-island",
    title: "Private island and seclusion",
    blurb: "Somewhere to disappear: a private island, or a resort far from the busy beaches.",
    hotelKeys: ["mnemba", "residence", "tulia"],
  },
  {
    id: "all-day-swimming",
    title: "Easiest sea swimming",
    blurb: "West-facing Kendwa and Nungwi, where the tide rarely takes the sea away.",
    hotelKeys: ["zuri", "gold", "riu-palace"],
  },
  {
    id: "all-inclusive",
    title: "All-inclusive done well",
    blurb: "Big resorts with everything on site, for when you want to stop making decisions.",
    hotelKeys: ["melia", "the-mora", "riu-palace", "baraza"],
  },
  {
    id: "families",
    title: "Families",
    blurb: "Space, pools and things for children to do.",
    hotelKeys: ["zuri", "residence", "essque-zalu", "the-mora", "melia"],
  },
  {
    id: "honeymoon",
    title: "Honeymoon",
    blurb: "Romance, privacy and a sense of occasion.",
    hotelKeys: ["mnemba", "baraza", "gold", "residence", "tulia"],
  },
  {
    id: "stone-town",
    title: "Luxury in Stone Town",
    blurb: "Historic buildings on the old town's seafront, for the start or end of a trip.",
    hotelKeys: ["park-hyatt", "serena"],
  },
  {
    id: "spa",
    title: "Spa and wellness",
    blurb: "Resorts where the spa is a reason to stay, not an afterthought.",
    hotelKeys: ["baraza", "gold", "residence", "breezes"],
  },
  {
    id: "conservation",
    title: "Diving, snorkelling and the reef",
    blurb: "The reef on your doorstep, with a dive centre or conservation programme on site.",
    hotelKeys: ["mnemba", "breezes"],
  },
];

export const LUXURY_GUIDE: HotelGuideDefinition = {
  slug: LUXURY_RESORTS_SLUG,
  title: "Barefoot Luxury: Zanzibar's Five-Star Escapes",
  subtitle: "Private islands, five-star beach resorts and historic seafront hotels — where to stay when you want to be spoilt.",
  seoTitle: "Best Luxury Resorts in Zanzibar | Five-Star Hotels & Private Islands",
  description:
    "Zanzibar's best luxury resorts, from a private island and villa resorts to five-star all-inclusives and Stone Town's historic hotels. Independent recommendations and practical local advice.",
  cardBlurb: "Private islands, five-star beach resorts and historic seafront hotels — where to stay when you want to be spoilt.",
  heroPhoto: RESORT_PHOTOS["mnemba"][0],
  introduction: INTRODUCTION,
  howToRead: HOW_TO_READ,
  categories: CATEGORIES,
  categoryCaveat: CATEGORY_CAVEAT,
  featuredSection: {
    title: "Featured luxury resorts",
    blurb: "Ten of the island's best-known luxury stays, from a private island to large all-inclusive resorts. Listed in no particular order of merit.",
    navGroup: "Featured resorts",
  },
  moreSection: {
    title: "More luxury stays worth considering",
    blurb: "Shorter entries for three more: a long-established east-coast resort, Stone Town's classic seafront hotel and a small luxury retreat.",
    navLabel: "More luxury stays",
  },
  travellers: null,
  bookingAdvice: BOOKING_ADVICE,
  areas: AREAS,
  itinerary: {
    title: "A seven-night luxury Zanzibar trip",
    navLabel: "Seven-night trip",
    intro: "Stone Town is close to the airport and is the island's history; the beach resorts are why most people come. Two nights in town and five on the coast gives you both without rushing either.",
    legs: [
      {
        nights: "Two nights",
        where: "Stone Town",
        focus: ["The old town's alleys and carved doors", "The House of Wonders and the Old Fort", "Spice tours", "Sunset on the seafront", "Forodhani night food market"],
        body: "Arrive, rest and spend a day on foot in the old town with a good local guide. Watch the sun go down over the harbour from your hotel's terrace, and take a spice tour on the second morning before driving to the coast.",
        suggestions: ["park-hyatt", "serena"],
      },
      {
        nights: "Five nights",
        where: "Kendwa, Nungwi, Mnemba or the south",
        focus: ["Beach and pool days", "Snorkelling or diving at Mnemba Atoll", "A sunset dhow", "Spa time", "Long, slow dinners"],
        body: "Then choose the kind of beach you want. Kendwa and west-facing Nungwi have the easiest swimming at any tide; Mnemba is a private island; the south and south-east are quieter, with wide tidal lagoons and very good pools.",
        suggestions: ["zuri", "gold", "mnemba", "residence", "baraza"],
      },
    ],
    why: {
      title: "Why start in Stone Town?",
      body: "Stone Town is about fifteen minutes from the airport, so it suits a late arrival or an early flight home, and the old town is best seen on foot before you've settled into beach mode. Doing it the other way round works just as well if your flight times suit it better.",
    },
    alternatives: {
      title: "Other ways to plan it",
      items: [
        "Prefer a single base? Stay the whole week in Kendwa for easy swimming, and visit Stone Town on a day trip — it's about an hour away.",
        "Splurging on Mnemba? Two or three nights on the island combine well with a longer stay on the main island; ask about transfers and any minimum stay when you book.",
        "Coming from a safari? Zanzibar is a short flight from the mainland's parks; a beach week at the end is the classic way to finish.",
      ],
    },
  },
  callToAction: {
    title: CALL_TO_ACTION.title,
    navLabel: CALL_TO_ACTION.navLabel,
    paragraphs: CALL_TO_ACTION.paragraphs,
    commentPrompt: CALL_TO_ACTION.commentPrompt,
    joinPrompt: CALL_TO_ACTION.joinPrompt,
  },
  editorialStandards: EDITORIAL_STANDARDS,
  venuePhotoNote: VENUE_PHOTO_NOTE,
  featured: FEATURED_RESORTS,
  more: MORE_RESORTS,
};
