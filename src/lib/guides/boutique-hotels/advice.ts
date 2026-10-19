import type { AdviceBlock, AreaGuide, StayCategory } from "./types";

// Editorial copy for the boutique hotels guide that isn't about one hotel:
// the introduction, the "Find your perfect stay" categories, booking advice,
// the area overview and the honeymoon itinerary. General statements only —
// anything specific to a hotel lives in hotels.ts with its sources.

export const INTRODUCTION: string[] = [
  "Forget the enormous all-inclusive resorts.",
  "Some of Zanzibar's most unforgettable places to stay are also its smallest.",
  "Imagine waking up in a beachfront bungalow with nothing between you and the Indian Ocean but a few coconut palms. Or spending your honeymoon in a beautifully designed private villa, surrounded by tropical gardens, with your own pool and spectacular ocean views. Perhaps your perfect hotel is somewhere with just eight rooms, where the owners know your name and the restaurant serves some of the best food you've tasted on the island.",
  "Zanzibar offers all of these experiences. But choosing where to stay isn't always straightforward.",
  "The north and east coasts offer very different holidays. Some beaches are excellent for swimming throughout the day, while others transform dramatically with the tides. Some boutique hotels are wonderfully isolated; others are within walking distance of restaurants, beach bars and activities. And the most expensive accommodation isn't necessarily the most memorable.",
  "This guide brings together some of Zanzibar's most beautiful boutique hotels, intimate luxury villas, romantic retreats and lesser-known hidden gems. We've also included recommendations from travellers who have recently visited the island.",
  "Whether you're planning a honeymoon, a romantic escape or simply somewhere beautiful to spend a week, this guide will help you find the right place.",
];

// How to read the guide — shown under the introduction so nobody mistakes an
// editorial pick for an inspection.
export const HOW_TO_READ: { label: string; body: string }[] = [
  {
    label: "Our recommendation",
    body: "The editors' own selection and judgement, based on each hotel's published information, current independent reviews and local knowledge of the area. We have not inspected or stayed at every hotel, and we never say we have.",
  },
  {
    label: "Checked facts",
    body: "Room counts, adults-only policies and facilities shown in each hotel's at-a-glance panel were checked against the hotel's own website and a current independent listing on the date shown. Hotels change — confirm anything that matters before you book.",
  },
  {
    label: "Traveller feedback",
    body: "Recommendations from people who recently stayed, taken from a public discussion in the “Travelling to Zanzibar” Facebook group. Quotations are their exact words, attributed; they are not verified reviews.",
  },
  {
    label: "Community suggestions",
    body: "Places members have mentioned that we haven't researched in full. Treat them as leads, not endorsements.",
  },
];

// Shown with the hotel photographs. The venues' own photos are used to
// promote them, and any venue can have one removed.
export const VENUE_PHOTO_NOTE =
  "Hotel photographs are the venues' own, shared here to promote them, and credited beneath each one. We're happy to take any photo down — if you represent a venue and would like a photo removed or replaced, please contact us.";

export const CATEGORIES: StayCategory[] = [
  {
    id: "romantic-honeymoon",
    title: "Romantic honeymoon",
    blurb: "Intimate settings, beautiful rooms and the feeling of having the place to yourselves.",
    hotelKeys: ["passion", "kilindi", "xanadu", "the-palms"],
  },
  {
    id: "extraordinary-architecture",
    title: "Extraordinary architecture",
    blurb: "Places where the buildings themselves are the reason to go.",
    hotelKeys: ["kilindi", "xanadu", "white-sand"],
  },
  {
    id: "beachfront-boutique",
    title: "Beautiful beachfront boutique hotels",
    blurb: "Small hotels right on the sand.",
    hotelKeys: ["amani", "z-hotel", "passion", "sharazad"],
  },
  {
    id: "private-villas",
    title: "Private luxury villas",
    blurb: "Space, privacy and — in most — your own pool.",
    hotelKeys: ["qambani", "xanadu", "zanzi"],
  },
  {
    id: "barefoot-luxury",
    title: "Nature and barefoot luxury",
    blurb: "Natural materials, gardens and an unhurried pace.",
    hotelKeys: ["sharazad", "savera", "kupaga"],
  },
  {
    id: "smaller-affordable",
    title: "Smaller, more affordable boutique stays",
    blurb: "Personal hospitality without top-end prices.",
    hotelKeys: ["dhow-inn", "african-bungalows", "marafiki"],
  },
  {
    id: "something-different",
    title: "Something completely different",
    blurb: "A private coral island, or a historic house in the old town.",
    hotelKeys: ["pongwe-island", "neela"],
  },
  {
    id: "food-lovers",
    title: "Great for food lovers",
    blurb: "Hotels whose kitchens are part of the reason to stay.",
    hotelKeys: ["passion", "casa-paradis", "upendo"],
  },
];

export const CATEGORY_CAVEAT = "These groupings are our editorial suggestions to help you browse, not claims that one hotel is independently better than another.";

export const BOOKING_ADVICE: AdviceBlock[] = [
  {
    id: "tides",
    title: "The tides",
    paragraphs: [
      "This is the single most important thing to understand before booking. Kendwa and the western side of Nungwi face the sheltered channel towards the mainland; the sea floor shelves fairly quickly, so there is usually water deep enough to swim in at most states of the tide.",
      "Most of the east coast — Matemwe, Pongwe, Michamvi, Bwejuu, Dongwe, Paje and Jambiani — sits behind a reef with a wide, shallow lagoon in front. Zanzibar has two high and two low tides a day, and the range is large: at low tide, especially around full and new moon, the sea can retreat hundreds of metres, leaving sand flats, seagrass and seaweed farms.",
      "Low tide on the east coast is beautiful in its own way — long walks, rock pools, seaweed farmers at work — but it is not swimming time. If swimming in the sea whenever you like matters most, stay in Kendwa or west-facing Nungwi. If you choose the east coast, a good pool makes a big difference, and it is worth checking a tide table for your dates: the best swimming hours shift by about 50 minutes a day.",
    ],
  },
  {
    id: "beach-access",
    title: "Beach access",
    paragraphs: [
      "“Oceanfront” does not always mean stepping straight onto a sandy swimming beach. Some properties sit on low coral cliffs with steps down to a cove; some have a rocky or reef-edged shoreline; a few are on the far side of a lane or a short walk from the sand.",
      "Look at the hotel's own photos of the shoreline, read recent reviews that mention the beach, and ask the hotel directly how guests reach the sea and what it is like at low tide.",
    ],
  },
  {
    id: "alcohol",
    title: "Alcohol policies",
    paragraphs: [
      "Zanzibar is a predominantly Muslim island, and not every hotel serves alcohol. Some properties run alcohol-free restaurants; others allow guests to bring their own, and some have full bars.",
      "If a glass of wine with dinner or a sundowner cocktail is part of your plan, ask the hotel before you book rather than assuming. The person who started the traveller discussion quoted in this guide asked exactly this about one of the villas recommended to them — a sensible question to put to any hotel.",
    ],
  },
  {
    id: "location",
    title: "Choosing your area",
    paragraphs: [
      "Zanzibar's coasts offer very different holidays. The overview below describes each area this guide covers; the community's Where to Stay guide compares them in depth.",
    ],
  },
  {
    id: "transport",
    title: "Getting around",
    paragraphs: [
      "Many of the most beautiful boutique hotels are deliberately secluded. That is part of their appeal, but it means you will often need a taxi or a hotel driver for restaurants, Stone Town or excursions. Nungwi and Paje have the most within walking distance; Michamvi, Dongwe, Pongwe and the west coast feel more remote.",
      "Travellers who recently honeymooned in Paje noticed that activities there felt more spread out than in Nungwi, and that taxis were sometimes needed. Agree taxi fares before setting off, and ask your hotel for drivers it trusts. The drive from the airport is roughly an hour to the north or the south-east, depending on traffic.",
    ],
  },
  {
    id: "air-conditioning",
    title: "Air conditioning",
    paragraphs: [
      "Many boutique hotels are designed around natural ventilation: high thatched roofs, open sides, sea breezes and ceiling fans. That can be wonderful — and it can feel very warm on a still night between December and March.",
      "Check room by room: some hotels have air conditioning in some categories only, some have fans and mosquito nets, and a few have open-air sleeping areas. If you sleep badly in the heat, ask before booking.",
    ],
  },
  {
    id: "direct-booking",
    title: "Booking direct",
    paragraphs: [
      "Compare the hotel's own rate with booking platforms. Small hotels sometimes offer something extra to guests who book with them directly — an airport transfer, a room upgrade when available, or a honeymoon package — but none of this is guaranteed, so ask what is included and get it in writing.",
      "Direct contact is also the best way to ask the questions this guide keeps returning to: tides, beach access, alcohol, air conditioning and how far you are from restaurants.",
    ],
  },
  {
    id: "sustainability",
    title: "Staying responsibly",
    paragraphs: [
      "Fresh water is precious in Zanzibar, and much of the island's tourism sits close to fragile reefs and village life. Many small hotels have invested in solar power, water recycling, local employment and community projects — but these claims vary a great deal, and we only mention them where a hotel publishes specifics.",
      "Good questions to ask: where does the water come from, and how is waste handled? Are staff from the local village? Does the hotel support any community or conservation work you can see? Use water carefully, choose reef-safe sun cream, never stand on coral, and buy from local businesses when you can.",
    ],
  },
];

export const AREAS: AreaGuide[] = [
  { name: "Nungwi", coast: "North tip", summary: "Lively and well connected, with the island's biggest choice of restaurants, bars and boat trips. West-facing beaches have sunsets and easier swimming; parts of the north and east sides sit on coral cliffs." },
  { name: "Kendwa", coast: "North-west", summary: "Wide white sand and the most reliable all-day swimming on the island, with sunsets over the sea. Quieter than Nungwi and more resort-led." },
  { name: "Matemwe", coast: "North-east", summary: "Peaceful fishing-village coast facing Mnemba Atoll, the island's best-known snorkelling and diving area. Strong tides; few restaurants outside hotels." },
  { name: "Pongwe", coast: "East", summary: "A small, very quiet stretch of coast with a handful of hotels. Beautiful and secluded, with little to do beyond the beach." },
  { name: "Michamvi", coast: "South-east peninsula", summary: "A peninsula with water on both sides — a lagoon on the west, the ocean on the east — and The Rock restaurant offshore. Remote; taxis needed." },
  { name: "Bwejuu", coast: "South-east", summary: "Long, palm-lined beach between Paje and Dongwe. Very relaxed, with limited nightlife and tide-dependent swimming." },
  { name: "Dongwe", coast: "South-east", summary: "Upmarket and quiet, home to several of the island's most expensive villa resorts. Very little independent nightlife." },
  { name: "Paje", coast: "South-east", summary: "Kitesurfing capital with a sociable, younger feel, cafés and beach bars. Windy in the trade-wind seasons; swimming follows the tides." },
  { name: "Jambiani", coast: "South-east", summary: "A long, spread-out village beach with a local feel and many small, characterful hotels. Tide-dependent swimming and very little nightlife." },
  { name: "Stone Town", coast: "West (city)", summary: "The historic old town: carved doors, rooftop dinners, markets and history. No beach — a city stay of one to three nights." },
  { name: "West coast (Kama and around)", coast: "West", summary: "Secluded coast north of Stone Town, closer to the airport and the old town than the beach villages, with west-facing sunsets. Beaches are typically narrower and more tidal than Kendwa." },
];

export const ITINERARY = {
  intro: "Splitting a week between two coasts gives you two very different Zanzibars: easy swimming, sunsets and restaurants in the north, then the quiet, wide-open lagoons and boutique calm of the south-east.",
  legs: [
    {
      nights: "Three nights",
      where: "Nungwi or Kendwa",
      focus: ["Swimming at any time of day", "Sunsets over the sea", "Restaurants and beach bars", "Dhow cruises and snorkelling trips", "Romantic dinners"],
      body: "Start where swimming is easiest and there's most to do. Watch the sunset from the beach, take a sunset dhow, snorkel off Mnemba or Tumbatu, and choose from the biggest spread of restaurants on the island.",
      suggestions: ["kilindi", "zanzibari", "z-hotel", "african-bungalows"],
    },
    {
      nights: "Four nights",
      where: "Paje, Jambiani or Dongwe",
      focus: ["Boutique luxury", "Peaceful surroundings", "Long beach walks at low tide", "Pools and slow days", "Beautiful accommodation"],
      body: "Then slow right down. The south-east is where many of the island's most beautiful small hotels are, and where low tide turns the beach into a vast walking landscape. Plan sea swims around high tide and enjoy the pool in between.",
      suggestions: ["passion", "amani", "sharazad", "xanadu", "white-sand"],
    },
  ],
  why: "The drive between the two takes roughly one and a half to two hours, so the move costs half a day. In return you get both kinds of beach, two different atmospheres and the excitement of arriving somewhere new halfway through.",
  singleBase: [
    "Want all-day swimming and one hotel? Stay the whole week in Kendwa or west-facing Nungwi.",
    "Want peace, design and space above all? A villa resort in Dongwe, Paje or Michamvi, with a private or very good pool, works well for a full week — book one or two day trips to the north or Stone Town.",
    "Want history too? Add one or two nights in Stone Town at the start or end; it's close to the airport.",
  ],
};

export const CALL_TO_ACTION = {
  title: "Have you discovered a hidden gem?",
  paragraphs: [
    "Some of Zanzibar's most memorable places to stay aren't the ones with the biggest advertising budgets.",
    "Perhaps you've discovered a tiny beachfront hotel, an extraordinary private villa or a family-run guesthouse with exceptional hospitality.",
    "We'd love to hear about it. Share your recommendations and experiences with the Mzungu Zanzibar community.",
  ],
};

export const EDITORIAL_STANDARDS =
  "This guide is written by the Mzungu Zanzibar editors. No hotel paid to be included, and inclusion is not an endorsement of every aspect of a property. Factual details were checked against each hotel's own website and at least one current independent source on the date shown; where something could not be confirmed, the hotel's entry says so. Traveller recommendations are quoted exactly and attributed, and are not verified reviews.";
