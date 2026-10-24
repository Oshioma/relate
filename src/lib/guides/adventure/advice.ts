import type { AdviceBlock } from "@/lib/guides/hotel-guide/types";

// The adventure guide's own copy: introduction, how to read it, practical
// advice and the photo note. Editors' writing, not quotations; no prices.

export const INTRODUCTION: string[] = [
  "Zanzibar isn't only for lying on the sand.",
  "Under the surface there are coral walls, turtles and the atoll of Mnemba; on top of it, steady trade winds have made the east-coast lagoons one of the best places on earth to learn to kitesurf. You can jump from 10,000 feet onto the beach at Kendwa, gallop a horse across a sandbank at low tide, swim in a cave pool in Jambiani, or hike into the island's only national park after red colobus monkeys.",
  "This guide covers the island's adventures, in the sea, on the water, on land and in the air — what each is really like, who it suits, when to go, who runs it and what to check before you hand over your money.",
];

export const HOW_TO_READ: { label: string; body: string }[] = [
  {
    label: "Our picks, checked practicalities",
    body: "Why an adventure is here is the editors' judgement. Operators, seasons, age and weight limits were checked against the operators' own sites, their current listings and recent reviews on the date shown. Safety and welfare claims are the operators' own, and we say so. Nothing here is a first-hand account.",
  },
  {
    label: "Price bands, never prices",
    body: "$ is a small entry fee or rental, $$ a typical half-day activity, $$$ a course or full-day trip, and $$$$ a once-in-a-lifetime splurge. Prices and park fees change, so check before you book.",
  },
];

export const CATEGORY_CAVEAT = "Groupings are our suggestions to help you choose, not a ranking — the adventures are listed by type: under the sea, on the water, on land and in the air.";

// Followed on the page by a "contact us" link, so it ends with the ask.
export const PHOTO_NOTE =
  "They come from the operators' own websites, from Google Maps contributors and from photographers on Flickr and Wikimedia Commons, each credited beneath the picture and linked to where it came from. Underwater shots we couldn't tie to the exact site are marked UNVERIFIED. They're shared here to celebrate these places. If one is yours and you'd like it removed or credited differently, we'll gladly do it —";

export const ADVICE: AdviceBlock[] = [
  {
    id: "seasons",
    title: "Winds, seasons and tides",
    paragraphs: [
      "Two trade winds shape the year. The kaskazi blows from the north-east from about mid-December to early March — lighter, warm and good for learning to kite. The kusi blows from the south-east from about June to early October — stronger, cooler and windier in the afternoons. The long rains of April and May, and November, are the quiet months for wind sports; some operators close in April and May.",
      "On the east coast the tide decides almost everything: the lagoons drain a long way at low tide and fill again a few hours later. Kite lessons, horse rides, kayak trips and reef surf all move with it, so expect start times to change from day to day.",
    ],
  },
  {
    id: "operators",
    title: "Choosing a safe operator",
    paragraphs: [
      "Book with operators who have a proper base, a website or a well-reviewed listing, and the right certification: PADI or SSI for diving, IKO or VDWS for kitesurfing. Ask to see the instructor's card, what safety boat and radio they carry, and how many students each instructor takes.",
      "Be wary of the cheapest deal on the beach. Sellers on the busier beaches offer trips at a discount; they may be fine, but you can't check them. Book through your hotel or directly with the operators in this guide.",
    ],
  },
  {
    id: "insurance",
    title: "Insurance and health",
    paragraphs: [
      "Check that your travel insurance covers the activity — many policies exclude skydiving, quad biking, motorised watersports or diving below a certain depth unless you add cover. Tell operators honestly about heart conditions, recent surgery, pregnancy and back injuries; several activities have strict limits.",
      "Don't fly within 18–24 hours of scuba diving, and leave a day between diving and skydiving or a helicopter flight. Drink plenty of water and respect the sun: the equatorial UV is fierce, even on cloudy days.",
    ],
  },
  {
    id: "wildlife",
    title: "Wildlife and the reef",
    paragraphs: [
      "Don't touch, chase or feed wildlife. At Kizimkazi and Mnemba, boats crowding and chasing dolphins is a real problem: choose operators who keep their distance and don't jump in on top of a pod. Never stand on coral, and choose operators who don't anchor on the reef or take starfish out of the water.",
      "Marine parks and the national park charge conservation fees — pay them, they protect what you came to see. Rinse off sunscreen before swimming in caves, and use reef-safe sunscreen in the sea.",
    ],
  },
  {
    id: "respect",
    title: "Villages and respect",
    paragraphs: [
      "Quad, bike and horse routes pass through villages and past mosques. Cover shoulders and knees when you leave the beach, slow right down, and ask before photographing people, especially children. Don't hand out sweets or money; buy from village shops instead.",
      "Mangapwani's slave chamber is a memorial. Treat it with the respect you'd give any site where people suffered.",
    ],
  },
];

export const CALL_TO_ACTION = {
  title: "Done something wild?",
  navLabel: "Share an adventure",
  paragraphs: [
    "Some of Zanzibar's best adventures are run by a fisherman with a boat or a guide who knows a cave nobody's written about.",
    "Tell us about an operator you'd trust, add one to the community directory, or ask the community before you book.",
  ],
  commentPrompt: "Share an adventure you'd recommend in Zanzibar — it also appears on the guide's card in the community feed.",
  joinPrompt: "to share the operators you trust, review them in the directory and ask locals for advice. The guide itself is free to read.",
};

export const EDITORIAL_STANDARDS =
  "This guide is written by the Mzungu Zanzibar editors. No operator paid to be included. Operators, seasons, limits and safety details were checked against each operator's own site, current listings and recent reviews on the date shown; anything we could not confirm is listed with that activity. Safety and animal-welfare claims are the operators' own and are reported as such. Prices and fees are never given because they change. The descriptions are not first-hand accounts.";
