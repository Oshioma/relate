import type { AdviceBlock, AreaGuide } from "@/lib/guides/hotel-guide/types";
import { AREAS as BOUTIQUE_AREAS } from "@/lib/guides/boutique-hotels/advice";

// Editorial copy for the luxury resorts guide that isn't about one hotel.
// General statements only — anything specific to a hotel lives in hotels.ts
// with its sources.

export const INTRODUCTION: string[] = [
  "Some holidays call for the very best.",
  "Zanzibar's luxury resorts range from barefoot private islands with a handful of beach bandas to grand five-star resorts with several restaurants, a spa, a dive centre and a kids' club — and a restored palace on the Stone Town waterfront.",
  "They share a few things: beautiful settings, polished service and the kind of comfort that lets you switch off completely. But they offer very different holidays. A private-island lodge and a 200-room all-inclusive resort are both \"luxury\", and the right choice depends on whether you want seclusion or space to roam, all-day swimming or dramatic tides, nightlife nearby or none at all.",
  "This guide brings together the island's best larger luxury hotels and resorts, with honest notes on what each does well, what's included, how the beach behaves with the tides and who each one suits — so you can spend your budget on the holiday you actually want.",
];

export const HOW_TO_READ: { label: string; body: string }[] = [
  {
    label: "Our recommendation",
    body: "The editors' own selection and judgement, based on each resort's published information, current independent reviews and local knowledge of the area. We have not inspected or stayed at every resort, and we never say we have.",
  },
  {
    label: "Checked facts",
    body: "Room counts, board basis, age policies and facilities in each resort's at-a-glance panel were checked against its own website and a current independent source on the date shown. Resorts change — confirm anything that matters before you book.",
  },
];

export const CATEGORY_CAVEAT = "These groupings are our editorial suggestions to help you browse, not claims that one resort is independently better than another.";

export const BOOKING_ADVICE: AdviceBlock[] = [
  {
    id: "board",
    title: "What \"all-inclusive\" really includes",
    paragraphs: [
      "Luxury resorts on Zanzibar are sold on very different terms: bed and breakfast, half board, full board or all-inclusive. Even \"all-inclusive\" varies — some include premium spirits, à la carte restaurants and excursions, others only house drinks and the buffet, with extra charges for the best restaurant, wine list or spa.",
      "Compare like with like. Ask what's included in your rate, which restaurants need a supplement or booking, and whether drinks by the beach or in your villa are covered.",
    ],
  },
  {
    id: "size",
    title: "Big resort or intimate lodge?",
    paragraphs: [
      "A large resort gives you choice — several pools and restaurants, a spa, water sports, entertainment and kids' clubs — but can feel busy in high season. A small lodge or private island gives you peace and personal service, with fewer facilities and less to do beyond the beach.",
      "If you'd like the best of both, split your stay: a few nights somewhere lively with plenty on site, then somewhere quiet.",
    ],
  },
  {
    id: "tides",
    title: "The tides",
    paragraphs: [
      "Kendwa and the western side of Nungwi face the sheltered channel towards the mainland, where there's usually water deep enough to swim at most states of the tide. Most of the east coast — Matemwe, Kiwengwa, Pongwe, Bwejuu and Paje — sits behind a reef with a wide, shallow lagoon that drains a long way at low tide.",
      "At an east-coast resort, plan sea swims around high tide and enjoy the pools in between. Many resorts publish tide times at reception; check them for your dates.",
    ],
  },
  {
    id: "family",
    title: "Children and adults-only resorts",
    paragraphs: [
      "Several luxury resorts are adults-only or set a minimum age, while others have kids' clubs, family villas and babysitting. Check the policy before you book — and if you're travelling as a couple, ask whether school holidays bring a lot of families.",
    ],
  },
  {
    id: "location",
    title: "Choosing your area",
    paragraphs: ["Each coast offers a different holiday. The overview below covers the areas in this guide; the community's Where to Stay guide compares them in depth."],
  },
  {
    id: "transport",
    title: "Transfers and getting around",
    paragraphs: [
      "Most luxury resorts arrange airport transfers, often at extra cost; the drive is roughly an hour to the north or the south-east, longer at busy times. Resorts are usually self-contained, so you'll need a driver for Stone Town, restaurants elsewhere or excursions. Private islands are reached by boat, and transfer times depend on the tide.",
    ],
  },
  {
    id: "extras",
    title: "Taxes, insurance and extras",
    paragraphs: [
      "Zanzibar requires visitors to hold its own government travel insurance policy, bought separately from any insurance you already have, and hotels collect a per-person, per-night infrastructure tax that isn't always included in online rates. Check current amounts before you travel.",
      "Also ask about resort fees, transfer costs, card surcharges and which activities cost extra. Some resorts close or reduce services during the long rains, roughly April to May — check before booking for those months.",
    ],
  },
  {
    id: "direct-booking",
    title: "Booking direct",
    paragraphs: [
      "Compare the resort's own rate with booking platforms and specialist tour operators. Booking direct can sometimes bring extras — a transfer, an upgrade when available or a honeymoon package — but none of this is guaranteed, so ask what is included and get it in writing.",
    ],
  },
  {
    id: "sustainability",
    title: "Staying responsibly",
    paragraphs: [
      "Large resorts use a great deal of water and energy on an island where fresh water is precious. Many invest in solar power, desalination, local employment and marine conservation — but claims vary, and we only mention them where a resort publishes specifics.",
      "Good questions to ask: where does the water come from, how is waste handled, are staff from the local community, and does the resort support conservation you can see? Choose reef-safe sun cream and never stand on coral.",
    ],
  },
];

export const AREAS: AreaGuide[] = [
  ...BOUTIQUE_AREAS.filter((a) => ["Nungwi", "Kendwa", "Matemwe", "Pongwe", "Bwejuu", "Stone Town"].includes(a.name)),
  { name: "Kiwengwa", coast: "North-east", summary: "A long white-sand beach lined with large resorts, many of them all-inclusive. Strong tides; most life happens inside the hotels." },
  { name: "Kizimkazi", coast: "South", summary: "A quiet fishing area at the island's southern tip, known for dolphin trips. Remote, with very little outside the resorts." },
  { name: "Mangapwani", coast: "West", summary: "A quiet stretch north of Stone Town with coral cliffs and coves, sunsets over the sea and easy access to the town and airport." },
];

export const CALL_TO_ACTION = {
  title: "Stayed somewhere special?",
  navLabel: "Share your experience",
  paragraphs: [
    "The best way to choose a resort is to hear from people who've actually stayed.",
    "If you've had a wonderful — or disappointing — stay at a Zanzibar resort, share it with the Mzungu Zanzibar community. Your experience helps other travellers choose well.",
  ],
  commentPrompt: "Tell us about your favourite Zanzibar resort — it also appears on the guide's card in the community feed.",
  joinPrompt: "to share your experiences and ask locals for advice. The guide itself is free to read.",
};

export const EDITORIAL_STANDARDS =
  "This guide is written by the Mzungu Zanzibar editors. No resort paid to be included, and inclusion is not an endorsement of every aspect of a property. Factual details were checked against each resort's own website and at least one current independent source on the date shown; where something could not be confirmed, the resort's entry says so.";

export const VENUE_PHOTO_NOTE =
  "Resort photographs are the venues' own, shared here to promote them, and credited beneath each one. We're happy to take any photo down — if you represent a venue and would like a photo removed or replaced, please contact us.";
