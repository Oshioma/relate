import type { Hotel } from "@/lib/guides/hotel-guide/types";
import { AREA } from "@/lib/guides/boutique-hotels/photos";
import { RESORT_PHOTOS } from "./resort-photos";

// THE RESORTS — 10 featured, 3 shorter entries.
//
// Same rules as the boutique guide: facts were checked on the date in
// `verification` against each resort's own website and at least one current
// independent source; where sources disagree the copy says so. Positioning,
// style, atmosphere and "why it's here" are the editors' judgement, and
// nothing claims anyone from Mzungu Zanzibar stayed.
//
// `photos` are the venues' own promotional photos (resort-photos.ts), shared
// to promote them and taken down on request. Four resorts' websites block
// downloads (Meliá, Baraza, Breezes, Park Hyatt), so they show the
// surrounding area instead, labelled as such.

const CHECKED = "2026-10-19";

function maps(name: string, area: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${area}, Zanzibar`)}`;
}

export const FEATURED_RESORTS: Hotel[] = [
  {
    key: "mnemba",
    name: "&Beyond Mnemba Island",
    area: "Mnemba Island",
    coast: "Off the north-east coast",
    tier: "featured",
    positioning: "A private island with just twelve beach bandas.",
    style: "Barefoot private-island luxury",
    atmosphere: "Secluded, natural and exclusive",
    bestFor: ["Honeymoons", "Divers and snorkellers", "Once-in-a-lifetime trips"],
    price: "$$$$",
    facts: [
      { label: "Size", value: "12 bandas, including one family banda" },
      { label: "Board", value: "All-inclusive — drinks included except champagne, cognac and fine wines" },
      { label: "Children", value: "Welcome, but at most two under-12s on the island at a time" },
      { label: "Season", value: "Closed each year from early April to late May" },
    ],
    description: [
      "Mnemba is a tiny island off Zanzibar's north-east coast, about a mile across, ringed by white sand and one of the island's most celebrated reefs. &Beyond runs it as a private lodge with just a dozen bandas, so the island is effectively yours: you snorkel straight from the beach, walk the reef at low tide and eat wherever you like — beneath the trees, at the bar or in your own banda.",
      "The lodge was completely rebuilt and reopened in October 2024. The bandas now take the shape of a nautilus shell, with no doors or windows — just floor-to-ceiling louvred blinds and two entrances, one from the beach and one from the forest — and each has its own beach lounge with a day bed and outdoor shower.",
    ],
    whyIncluded:
      "It is the most exclusive place to stay in Zanzibar — and one of the few where conservation is part of the stay, with green turtles nesting on the island's beaches.",
    whatsDifferent:
      "You have an entire island and its reef with only a handful of other guests. Diving, snorkelling, kayaking, a sundowner dhow cruise and yoga are all included.",
    food: "All meals are included, served wherever you choose — beneath the trees, in the courtyard, at the bar or privately in your banda — along with most drinks.",
    beach:
      "The bandas line the beach, so close to the sea that the waves become part of the room. You can snorkel straight from the beach, and low tide brings guided reef walks.",
    nearby:
      "Nothing — that's the point. Transfers run by boat from Matemwe, with a helicopter option from the airport or Stone Town.",
    considerations: [
      "By far the most expensive stay in this guide, with a conservation fee on top.",
      "Open-sided bandas with no doors or windows won't suit everyone.",
      "Closed every year from early April to late May.",
    ],
    website: "https://www.andbeyond.com/lodge-editorial/mnemba-island/",
    mapsUrl: maps("&Beyond Mnemba Island", "Mnemba"),
    photos: RESORT_PHOTOS["mnemba"] ?? [],
    areaPhotos: [AREA.matemweBeach],
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      gaps: [],
      sources: [
        "https://www.andbeyond.com/lodge-editorial/mnemba-island/accommodation/",
        "https://www.andbeyond.com/lodge-editorial/mnemba-island/about/",
        "https://www.aspiretravelclub.co.uk/news/africa-specialist-andbeyond-reopens-zanzibar-property-following-renovation",
      ],
    },
  },
  {
    key: "zuri",
    name: "Zuri Zanzibar",
    area: "Kendwa",
    coast: "North-west coast",
    tier: "featured",
    positioning: "Design, sustainability and swimming at any tide.",
    style: "Contemporary tropical design",
    atmosphere: "Stylish, relaxed and green",
    bestFor: ["Couples", "Families", "Design lovers", "All-day swimming"],
    price: "$$$$",
    facts: [
      { label: "Size", value: "56 bungalows, suites and villas — no standard rooms" },
      { label: "Board", value: "Half board; all-inclusive available" },
      { label: "Children", value: "Welcome, with a kids' activity programme" },
      { label: "Sustainability", value: "EarthCheck Sustainable Design Gold certification" },
    ],
    description: [
      "Zuri sits on Kendwa's beach on the north-west coast, where the sea stays swimmable through the tides, in 12 hectares of gardens — a quarter of them a working spice garden. Its 56 bungalows, suites and villas were designed by the architects Jestico + Whiles using local materials, and the result feels light, modern and rooted in the island.",
      "There are three restaurants and four bars, a spa, a dive and water-sports centre, and villas on the oceanfront with their own stretch of beach, a jacuzzi and a butler. It's the only Design Hotels member in Zanzibar.",
    ],
    whyIncluded:
      "It combines genuinely beautiful design, a serious approach to sustainability and the island's most dependable swimming beach.",
    whatsDifferent:
      "Sustainability is built in: the resort has its own wells and desalination plant and an \"evening breeze\" cooling system that it says uses a quarter of the energy of standard air conditioning.",
    food: "Upendo is the main restaurant, with live cooking; there's also a pool restaurant, a beach grill and the Dhow Bar on the sand. Half board is standard, with an all-inclusive option that adds drinks.",
    beach:
      "Kendwa's beach is the island's most reliable for swimming, and the resort describes it as swimmable at any tide. Sunsets are over the sea.",
    nearby: "Kendwa's beach bars are a walk along the sand; Nungwi's restaurants and boat trips are a short drive north.",
    considerations: [
      "Premium pricing, particularly for the oceanfront villas.",
      "Drinks are only included if you choose the all-inclusive option.",
      "Welcomes families, so it isn't a couples-only retreat.",
    ],
    website: "https://www.zurizanzibar.com/",
    mapsUrl: maps("Zuri Zanzibar", "Kendwa"),
    photos: RESORT_PHOTOS["zuri"] ?? [],
    areaPhotos: [AREA.kendwaSunset],
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      gaps: [],
      sources: ["https://www.zurizanzibar.com/about/", "https://www.zurizanzibar.com/faqs/", "https://www.designhotels.com/hotels/tanzania/zanzibar/zuri-zanzibar"],
    },
  },
  {
    key: "residence",
    name: "The Residence Zanzibar",
    area: "Kizimkazi",
    coast: "South-west coast",
    tier: "featured",
    positioning: "Villa-only luxury on a mile-long beach.",
    style: "Classic villa luxury",
    atmosphere: "Spacious, peaceful and polished",
    bestFor: ["Couples", "Families", "Space and privacy"],
    price: "$$$$",
    facts: [
      { label: "Size", value: "66 villas, each with a private pool" },
      { label: "Board", value: "Breakfast and dinner or full board — not all-inclusive" },
      { label: "Children", value: "Free kids' club for ages 4–12" },
      { label: "Estate", value: "32 hectares with a mile-long beach" },
    ],
    description: [
      "The Residence spreads 66 villas across a 32-hectare estate on the quiet south-west coast near Kizimkazi, each with its own private pool. The design draws on Swahili, Omani, British and Indian influences, and the scale gives you something rare on Zanzibar: space.",
      "At the heart of the resort is a 45-metre glass-walled infinity pool by the beach, and a 150-metre jetty that's a nautical club by day and a lounge bar at night. There are two restaurants, a spa of six treatment pavilions set in its own gardens, tennis courts and a free kids' club.",
    ],
    whyIncluded:
      "It's one of the island's most complete luxury resorts, and every villa has its own pool — ideal for couples and families who want room to spread out.",
    whatsDifferent:
      "Kizimkazi, at the island's southern end, is known for its dolphins, and the resort runs dolphin-watching trips. It also grows produce for its kitchens on its own farm.",
    food: "The Dining Room serves international cuisine and The Pavilion Middle Eastern and Mediterranean dishes, with beach, poolside and private dining. Drinks are extra.",
    beach:
      "A mile-long beach. The villas at the northern end sit directly behind the sand, where swimming is easiest at high tide; those at the southern end are on a low cliff. Water sports depend on the tides.",
    nearby: "Kizimkazi is remote, with very little outside the resort; dolphin trips leave from nearby, and Jozani Forest is on the way to Stone Town.",
    considerations: [
      "Drinks and extras are expensive, and they add up.",
      "A remote location — you'll need transport to go anywhere else.",
      "Villa pools are 1.2 metres deep and need supervision for children.",
    ],
    website: "https://www.cenizaro.com/theresidence/zanzibar",
    mapsUrl: maps("The Residence Zanzibar", "Kizimkazi"),
    photos: RESORT_PHOTOS["residence"] ?? [],
    areaPhotos: [],
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      gaps: [],
      sources: [
        "https://www.cenizaro.com/theresidence/zanzibar/accommodation",
        "https://www.cenizaro.com/theresidence/zanzibar/about/facilities",
        "https://www.expertafrica.com/zanzibar/south-west-zanzibar/the-residence-zanzibar",
      ],
    },
  },
  {
    key: "park-hyatt",
    name: "Park Hyatt Zanzibar",
    area: "Stone Town",
    coast: "West coast (city)",
    tier: "featured",
    positioning: "A historic mansion on the Stone Town waterfront.",
    style: "Heritage luxury",
    atmosphere: "Elegant, historic and central",
    bestFor: ["Stone Town stays", "Culture", "Start or end of a trip"],
    price: "$$$$",
    facts: [
      { label: "Size", value: "67 rooms, including 11 suites" },
      { label: "Board", value: "Bed and breakfast" },
      { label: "Building", value: "The historic Mambo Msiige mansion, with a modern wing" },
      { label: "Opened", value: "March 2015, the first Hyatt in Zanzibar" },
    ],
    description: [
      "Park Hyatt Zanzibar occupies Mambo Msiige — a name that means \"not to be copied\" — one of Stone Town's grand historic seafront houses, joined to a new wing on the Shangani waterfront. Oceanfront rooms look over the dhow harbour, and the House of Wonders and the Old Fort are a short walk away.",
      "There's an oceanfront infinity pool, a spa and a 24-hour gym, and dining inspired by the spice trade. It's widely regarded as the most luxurious place to stay in Stone Town.",
    ],
    whyIncluded:
      "For a night or two in Stone Town, it brings resort-level comfort to the heart of the old town.",
    whatsDifferent:
      "History. You're staying in a landmark building in a World Heritage town, with the dhows sailing past at sunset.",
    food: "The Dining Room draws on the flavours of the spice trade, and the hotel's waterfront Beach House restaurant is a few doors along. Bed and breakfast; drinks are extra.",
    beach:
      "The hotel faces a busy public town beach, used by people and boats — not one for sunbathing or swimming. Swim in the infinity pool instead.",
    nearby: "Everything in Stone Town: markets, carved doors, rooftop restaurants, the Forodhani night food market and boat trips to Prison Island.",
    considerations: [
      "A city hotel, not a beach resort — best for one to three nights.",
      "Breakfast only; you'll eat out or pay as you go for other meals.",
      "Recent guests mentioned some renovation work in 2026 — ask when you book.",
    ],
    website: "https://www.hyatt.com/park-hyatt/en-US/znzph-park-hyatt-zanzibar",
    mapsUrl: maps("Park Hyatt Zanzibar", "Stone Town"),
    photos: [],
    areaPhotos: [AREA.shanganiStreet],
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      gaps: ["the age of the Mambo Msiige building (sources differ)", "the current spa operator"],
      sources: [
        "https://newsroom.hyatt.com/031215ParkHyattZanzibarOfficiallyOpensAndMarksFirstHyattHotelInZanzibar",
        "https://www.forbestravelguide.com/hotels/zanzibar-tanzania/park-hyatt-zanzibar",
        "https://www.expertafrica.com/zanzibar/stone-town/park-hyatt",
      ],
    },
  },
  {
    key: "baraza",
    name: "Baraza Resort & Spa",
    area: "Bwejuu–Dongwe",
    coast: "South-east coast",
    tier: "featured",
    positioning: "Swahili-Arabian grandeur, all-inclusive.",
    style: "Swahili-Arabian palace style",
    atmosphere: "Opulent, romantic and calm",
    bestFor: ["Honeymoons", "Families", "Spa lovers"],
    price: "$$$$",
    facts: [
      { label: "Size", value: "30 villas, each with a plunge pool" },
      { label: "Board", value: "All-inclusive — premium drinks extra" },
      { label: "Children", value: "All ages; kids' club for 4–12s in high season" },
    ],
    description: [
      "Baraza is built to feel like a sultan's palace: Omani arches, carved furniture, brass lanterns and 30 villas, each with its own plunge pool, along a long palm-fringed beach on the south-east coast. It's run by the same family company as its neighbour Breezes and the boutique Palms.",
      "Its spa is one of the largest on the island, with seven treatment rooms, a pool, a jacuzzi and a yoga studio, and there's a tennis court, a library and a PADI dive centre shared with Breezes next door.",
    ],
    whyIncluded:
      "For an all-inclusive that still feels intimate and special, Baraza's villas, design and spa are hard to beat on the south-east coast.",
    whatsDifferent:
      "The architecture and the plunge pool at every villa. It feels more like a palace than a resort.",
    food: "Several restaurants and a bar and lounge; meals and most drinks are included, except champagne, premium wines and top-shelf spirits.",
    beach:
      "A long white-sand beach and lagoon. This coast is very tidal: when the tide is out the sea retreats a long way, so plan sea swims around high tide.",
    nearby: "The Rock restaurant and the Michamvi peninsula are a short drive north; Paje is to the south.",
    considerations: [
      "Expensive, even for an all-inclusive.",
      "The sea is only swimmable around high tide.",
      "Welcomes children, so not a couples-only retreat.",
    ],
    website: "https://www.baraza-zanzibar.com/",
    mapsUrl: maps("Baraza Resort & Spa", "Bwejuu"),
    photos: [],
    areaPhotos: [AREA.bwejuuHigh, AREA.bwejuuLow],
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      gaps: ["board basis on the resort's own site (sources describe it as all-inclusive and as full board)", "current number of restaurants"],
      sources: ["https://www.expertafrica.com/zanzibar/michamvi-peninsula/baraza-resort-and-spa"],
    },
  },
  {
    key: "essque-zalu",
    name: "Essque Zalu Zanzibar",
    area: "Nungwi",
    coast: "North tip",
    tier: "featured",
    positioning: "Soaring thatch, an overwater restaurant and sunsets at the island's tip.",
    style: "Contemporary Swahili resort",
    atmosphere: "Relaxed, scenic and family-friendly",
    bestFor: ["Families", "Couples", "Villa groups"],
    price: "$$$",
    facts: [
      { label: "Size", value: "40 suites and 8 three- and four-bedroom villas" },
      { label: "Board", value: "Half board; all-inclusive menu available" },
      { label: "Children", value: "Welcome, with the Tinga Kids Club" },
    ],
    description: [
      "Essque Zalu sits on a low coral bluff at Zanzibar's northern tip, where you can see both sunrise and sunset. Its tall makuti roofs — the hotel claims the highest on the island — rise over a sprawling lagoon-style pool, and a long wooden jetty runs out over the sea to The Jetty restaurant and bar.",
      "Accommodation is in 40 suites and eight large villas with private plunge pools and kitchens, which makes it a good choice for families and groups. There's a spa, a 24-hour gym, a cookery studio and a dive operator on site.",
    ],
    whyIncluded:
      "It combines a dramatic setting, an overwater restaurant and generous family villas — and it's well placed for Nungwi's restaurants and boat trips.",
    whatsDifferent: "The jetty restaurant over the sea, and the villas — rare at this level in Nungwi.",
    food: "Market Kitchen serves all day, The Jetty restaurant and bar sits over the sea, and there's a pool bar, a bar under the baobab, 24-hour in-room dining and a cookery studio. The Jetty has recently closed on some low-season weekdays — check if it matters to you.",
    beach:
      "This is a coral-bluff setting with a jetty rather than a classic beach hotel, and the shoreline is tidal. Accounts of sea swimming differ, so ask the hotel; it has run a shuttle to Kendwa's beach.",
    nearby: "Nungwi village, its restaurants, sunset dhow cruises and the turtle aquarium are close by.",
    considerations: [
      "Not a sandy-beach resort — check swimming conditions with the hotel.",
      "Recent guest reviews mention some dated interiors.",
      "Drinks aren't included on half board.",
    ],
    website: "https://www.essquehotels.com/",
    mapsUrl: maps("Essque Zalu Zanzibar", "Nungwi"),
    photos: RESORT_PHOTOS["essque-zalu"] ?? [],
    areaPhotos: [AREA.nungwiMain],
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      gaps: ["swimming conditions from the shore (sources disagree)", "what the all-inclusive menu includes"],
      sources: ["https://www.essquehotels.com/accommodation", "https://www.essquehotels.com/eat-drink", "https://www.expertafrica.com/zanzibar/northern-zanzibar/essque-zalu-zanzibar"],
    },
  },
  {
    key: "melia",
    name: "Meliá Zanzibar",
    area: "Kiwengwa",
    coast: "North-east coast",
    tier: "featured",
    positioning: "A large all-inclusive with an adults-only club and a jetty bar at sea.",
    style: "Upscale all-inclusive resort",
    atmosphere: "Lively, spacious and polished",
    bestFor: ["Families", "Couples wanting an adults-only upgrade", "All-inclusive"],
    price: "$$$",
    facts: [
      { label: "Size", value: "About 160 rooms, pavilions and villas (2024 figure)" },
      { label: "Board", value: "All-inclusive; premium drinks in The Level" },
      { label: "Children", value: "Welcome; kids' programme for 4–12s; adults-only rooms and a 16+ pool" },
    ],
    description: [
      "Meliá Zanzibar sits on 16 hectares of the north-east coast beside a 300-metre white-sand beach and a reef. A Kempinski hotel until 2011, it was refurbished and reopened as Meliá, and in 2019 added The Level — a resort-within-a-resort with its own pool for over-16s, premium drinks and beach pavilions.",
      "Its most famous feature is the Jetty Bar & Restaurant, at the end of a promenade out over the sea. There are infinity pools, villas with private infinity pools, a spa with six treatment rooms, and a wooden gym on the beach.",
    ],
    whyIncluded:
      "For an all-inclusive holiday with real polish and plenty to do — and the option of an adults-only upgrade — it's one of the best-equipped resorts on the island.",
    whatsDifferent: "The jetty bar at sea, and The Level, which gives couples a quieter, premium corner of a big resort.",
    food: "Several restaurants and bars, including Tamu (Swahili, at extra charge), the Jetty Lounge and a beach restaurant. Standard all-inclusive; premium drinks only in The Level.",
    beach:
      "The resort combines low cliffs with a separate 300-metre beach reached by an in-resort shuttle. Kiwengwa is strongly tidal, so plan sea swims around high tide.",
    nearby: "Kiwengwa is lined with resorts and has little independent life; Stone Town is about an hour away.",
    considerations: [
      "A big resort — lively rather than intimate.",
      "Premium drinks are only included in The Level categories.",
      "Some areas are reached by shuttle within the grounds.",
    ],
    website: "https://www.melia.com/en/hotels/tanzania/zanzibar/melia-zanzibar",
    mapsUrl: maps("Meliá Zanzibar", "Kiwengwa"),
    photos: [],
    // No Kiwengwa photo yet; Matemwe is the neighbouring village on the same
    // reef-and-lagoon coast, and the caption says so.
    areaPhotos: [{ ...AREA.matemweBeach, caption: "Matemwe, the next village north of Kiwengwa on the same reef-and-lagoon coast (2008) — not Kiwengwa itself." }],
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      gaps: ["current room count (sources give 159–185)", "exactly which drinks the standard all-inclusive covers"],
      sources: ["https://www.melia.com/en/hotels/tanzania/zanzibar/melia-zanzibar", "https://www.melia.com/en/hotels/tanzania/zanzibar/melia-zanzibar/the-level"],
    },
  },
  {
    key: "the-mora",
    name: "The Mora Zanzibar",
    area: "Matemwe (Muyuni Beach)",
    coast: "North-east coast",
    tier: "featured",
    positioning: "A big, contemporary all-inclusive facing Mnemba.",
    style: "Contemporary all-inclusive resort",
    atmosphere: "Lively, modern and family-friendly",
    bestFor: ["Families", "All-inclusive", "Friends travelling together"],
    price: "$$$",
    facts: [
      { label: "Size", value: "250 suites" },
      { label: "Board", value: "All-inclusive" },
      { label: "Children", value: "All ages; Outliners kids' club for 3–12s" },
      { label: "Formerly", value: "Emerald Zanzibar Resort & Spa (until 2024)" },
    ],
    description: [
      "Formerly the Emerald Zanzibar, The Mora reopened in 2024 as the first hotel of TUI's luxury brand — \"mora\" is Latin for pause. It stands on ten hectares of Muyuni Beach at Matemwe, looking out to Mnemba Island, a short boat ride away.",
      "With 250 suites, six pools, four restaurants, several bars, a gelato shop, a spa and a kids' club, it's built for an easy, everything-on-site holiday. Executive and Presidential suites have their own pools.",
    ],
    whyIncluded:
      "It's one of the island's newest and best-equipped all-inclusives, and its location makes Mnemba's reef an easy trip.",
    whatsDifferent: "Scale and choice: six pools and four restaurants, all included, in a fresh contemporary design.",
    food: "Four restaurants — Jikan (Asian fusion and teppanyaki), Jua Grill, the Muyuni Beach Club and Horizon — plus bars and a gelato shop, all included.",
    beach:
      "Directly on Muyuni Beach. This north-east coast is strongly tidal, so plan sea swims around high tide; Mnemba's reef is a short boat ride away.",
    nearby: "Matemwe is quiet, with few restaurants outside the resorts; Stone Town is about an hour away.",
    considerations: [
      "A large resort — not the place for seclusion.",
      "The sea is tide-dependent.",
      "Some booking sites still use the old Emerald name.",
    ],
    website: "https://www.themora.com/zanzibar/",
    mapsUrl: maps("The Mora Zanzibar", "Matemwe"),
    photos: RESORT_PHOTOS["the-mora"] ?? [],
    areaPhotos: [AREA.matemweBeach],
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      gaps: [],
      sources: [
        "https://www.themora.com/zanzibar/",
        "https://tuigroup.com/en-en/media/press-releases/2023/2023-11-22-first-hotel-of-the-fund-to-be-positioned-under-new-brand-the-mora",
        "https://www.touristik-aktuell.de/hotels/tui-startet-the-mora/",
      ],
    },
  },
  {
    key: "gold",
    name: "Gold Zanzibar Beach House & Spa",
    area: "Kendwa",
    coast: "North-west coast",
    tier: "featured",
    positioning: "Arab, African and Italian style on Kendwa's beach.",
    style: "Contemporary Afro-Arab design",
    atmosphere: "Elegant, relaxed and sociable",
    bestFor: ["Couples", "Families", "All-day swimming"],
    price: "$$$",
    facts: [
      { label: "Size", value: "72 rooms, suites and villas" },
      { label: "Board", value: "Several meal plans, up to a gourmet all-inclusive" },
      { label: "Children", value: "Welcome, with family offers" },
    ],
    description: [
      "Gold Zanzibar sits in a secluded corner of Kendwa's beach, with 72 rooms, suites and villas designed in a mix of African and Arab influences. Its three beach villas, each with a private pool, butler and beach tent, are themed on \"the three souls of Gold\" — Arab, African and Italian.",
      "There's a wide pool, a spa using Healing Earth products and a gym. It belongs to The Cocoon Collection, whose sister property is the island lodge at Pongwe in our boutique guide.",
    ],
    whyIncluded: "It pairs Kendwa's excellent swimming beach with a stylish, mid-sized resort that's big enough for choice but not overwhelming.",
    whatsDifferent: "The themed beach villas, and the chance to dine at its sister island lodge.",
    food: "Kilimanjaro is the main restaurant, Gold Restaurant serves à la carte dinners, and there are two bars. The top \"gourmet\" plan includes quality spirits and wines by the glass.",
    beach: "Directly on Kendwa's white-sand beach, which stays swimmable through the tides; sunsets are over the sea.",
    nearby: "Kendwa's beach bars are along the sand, and Nungwi is a short drive.",
    considerations: [
      "Check what your meal plan includes — drinks vary by plan.",
      "The resort has closed in late April and early May; check spring dates.",
    ],
    website: "https://www.goldzanzibar.com/",
    mapsUrl: maps("Gold Zanzibar Beach House & Spa", "Kendwa"),
    photos: RESORT_PHOTOS["gold"] ?? [],
    areaPhotos: [AREA.kendwaBeach],
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      gaps: ["standard board basis", "kids' club"],
      sources: ["https://www.goldzanzibar.com/accommodation", "https://www.goldzanzibar.com/food-experience", "https://destination2.co.uk/hotels/gold-zanzibar-beach-house-spa"],
    },
  },
  {
    key: "riu-palace",
    name: "Riu Palace Zanzibar",
    area: "Nungwi",
    coast: "North tip",
    tier: "featured",
    positioning: "24-hour all-inclusive on Nungwi's west-facing coast.",
    style: "Large all-inclusive resort",
    atmosphere: "Lively and easy-going",
    bestFor: ["All-inclusive", "Couples", "Sunsets"],
    price: "$$$",
    facts: [
      { label: "Size", value: "About 200 suites and villas" },
      { label: "Board", value: "24-hour all-inclusive, drinks included" },
      { label: "Formerly", value: "Hideaway of Nungwi (until 2018)" },
    ],
    description: [
      "The former Hideaway of Nungwi, bought by RIU in 2018 and doubled in size, Riu Palace Zanzibar spreads across 20,000 square metres of gardens in Moorish and Swahili style above the beach on Nungwi's west-facing coast. Accommodation ranges from sea-view junior suites and swim-up suites to villas with private pools.",
      "It's a classic RIU Palace: 24-hour all-inclusive with drinks, five restaurants, several bars, three pools with sea views and a spa with a thermal circuit.",
    ],
    whyIncluded: "For a fuss-free all-inclusive with sunsets and Nungwi's restaurants nearby, it's a strong, polished choice.",
    whatsDifferent: "Swim-up suites and private-pool villas within a big all-inclusive, on the sunset side of Nungwi.",
    food: "Five restaurants including a buffet, fusion, Mediterranean and a steakhouse, plus four bars — all included, around the clock.",
    beach: "Steps lead down to a private beach area with loungers. The north-west coast generally offers easier swimming than the east, but ask about the beach below the resort at low tide.",
    nearby: "Nungwi village, its restaurants and boat trips are close by; Kendwa is a short drive south.",
    considerations: [
      "Its age policy is unclear — RIU's own page has described it both as adults-only and as family-friendly; check before booking.",
      "Large and busy compared with the smaller resorts here.",
      "Don't confuse it with RIU's other Zanzibar hotels, including the adults-only Riu Palace Swahili.",
    ],
    website: "https://www.riu.com/en/hotel/tanzania/zanzibar/hotel-riu-palace-zanzibar",
    mapsUrl: maps("Riu Palace Zanzibar", "Nungwi"),
    photos: RESORT_PHOTOS["riu-palace"] ?? [],
    areaPhotos: [AREA.nungwiWhite],
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      gaps: ["adults-only or family policy (RIU's own page is contradictory)", "current room count (200 is a 2019 figure)"],
      sources: [
        "https://www.riu.com/en/hotel/tanzania/zanzibar/hotel-riu-palace-zanzibar",
        "https://www.hotel-online.com/news/riu-hotels-resorts-acquires-zanzibars-hideaway-of-nungwi-resort-spa-from-em",
      ],
    },
  },
];

export const MORE_RESORTS: Hotel[] = [
  {
    key: "breezes",
    name: "Breezes Beach Club & Spa",
    area: "Bwejuu–Dongwe",
    coast: "South-east coast",
    tier: "gem",
    positioning: "Baraza's relaxed, better-value neighbour.",
    style: "Classic beach resort",
    atmosphere: "Friendly and unhurried",
    bestFor: ["Couples", "Families", "Divers", "Value"],
    price: "$$$",
    facts: [
      { label: "Size", value: "About 70 rooms and a four-bedroom villa" },
      { label: "Board", value: "Half board; drinks extra" },
    ],
    description: [
      "Family-run and next door to Baraza, Breezes offers two-storey thatched bungalows with dark Zanzibari furniture on a wide stretch of white beach. It has the Frangipani Spa with its Sultan's Bath House, a PADI dive centre, a large pool, tennis and several restaurants — and guests find it excellent value for this coast.",
    ],
    food: "Salama is the main restaurant, with lunch at Breakers and supplements for the Sultan's Table and private dinners; three bars and an afternoon tea lounge. Drinks aren't included.",
    beach: "A wide white-sand beach on a very tidal coast — swim around high tide, and join the free guided reef walks at low tide.",
    considerations: ["Kids' clubs only run over Christmas and Easter.", "Sources give between 70 and 74 rooms."],
    website: "https://www.breezes-zanzibar.com/",
    mapsUrl: maps("Breezes Beach Club & Spa", "Bwejuu"),
    photos: [],
    areaPhotos: [AREA.dongweFootsteps],
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      gaps: ["exact room count"],
      sources: ["https://www.expertafrica.com/zanzibar/michamvi-peninsula/breezes-beach-club"],
    },
  },
  {
    key: "serena",
    name: "Zanzibar Serena Hotel",
    area: "Stone Town",
    coast: "West coast (city)",
    tier: "gem",
    positioning: "Restored seafront buildings in the old town.",
    style: "Historic seafront hotel",
    atmosphere: "Gracious and central",
    bestFor: ["Stone Town stays", "Culture"],
    price: "$$$",
    facts: [
      { label: "Size", value: "51 rooms and suites, all with ocean-view balconies" },
      { label: "Board", value: "Bed and breakfast" },
      { label: "Opened", value: "1997, in two restored historic buildings" },
    ],
    description: [
      "Serena opened in 1997 in two restored seafront buildings — an 18th-century residence and the 19th-century former telecoms house — and every room has an ocean-view balcony. Interiors are whitewashed walls, carved wood and brass lanterns, and live taarab music plays at the Masahani Bar.",
    ],
    food: "Baharia Restaurant (international and Swahili) and the rooftop Terrace Seafood Restaurant, plus the Masahani Bar. Drinks extra.",
    beach: "On a public town beach — swim in the hotel's pool.",
    considerations: ["A city hotel — best for one to three nights.", "No kids' club."],
    website: "https://www.serenahotels.com/zanzibar",
    mapsUrl: maps("Zanzibar Serena Hotel", "Stone Town"),
    photos: RESORT_PHOTOS["serena"] ?? [],
    areaPhotos: [AREA.shanganiStreet],
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      gaps: [],
      sources: ["https://www.serenahotels.com/zanzibar", "https://www.expertafrica.com/zanzibar/stone-town/serena-inn"],
    },
  },
  {
    key: "tulia",
    name: "Tulia Zanzibar",
    area: "Pongwe",
    coast: "East coast",
    tier: "gem",
    positioning: "Boutique, romantic and all-inclusive with premium drinks.",
    style: "Boutique luxury",
    atmosphere: "Romantic and personal",
    bestFor: ["Couples", "Food lovers"],
    price: "$$$",
    facts: [
      { label: "Size", value: "16 bungalows and villas" },
      { label: "Board", value: "Breakfast or all-inclusive with premium drinks" },
    ],
    description: [
      "Just 16 bungalows and villas on the quiet Pongwe coast, some on the low cliff above the water and some with private pools. Meals are à la carte with no buffets, the chef changes the menu daily using produce from the resort's own farm, and the all-inclusive covers premium drinks.",
    ],
    food: "Daily-changing three-course lunches and five-course dinners, plus a 3D-projection dining show three nights a week.",
    beach: "A mix of white sand and low cliff on a tidal coast, with a raised sun terrace; sailing trips run at high tide.",
    considerations: ["Its awards are listed on its own website; we haven't checked them with the award bodies.", "Pongwe is quiet, with little nearby."],
    website: "https://tuliazanzibar.com/",
    mapsUrl: maps("Tulia Zanzibar", "Pongwe"),
    photos: RESORT_PHOTOS["tulia"] ?? [],
    areaPhotos: [AREA.pongweLow],
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      gaps: [],
      sources: ["https://tuliazanzibar.com/", "https://tuliazanzibar.com/gastronomy/", "https://tuliazanzibar.com/faq/"],
    },
  },
];
