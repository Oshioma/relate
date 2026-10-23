import type { AdviceBlock } from "@/lib/guides/hotel-guide/types";

// The beach-bar guide's own copy: introduction, how to read it, practical
// advice and the photo note. Editors' writing, not quotations; no prices.

export const INTRODUCTION: string[] = [
  "Zanzibar does sundowners better than almost anywhere.",
  "The sun drops into the sea off the west coast in a blaze of orange, dhows slide past with their sails up, and on the east coast the tide pulls out across a lagoon the colour of mint. In between there's a beach bar for every mood — swings over the water, reggae on the sand, cocktails on a rooftop, DJs until late and a monthly full moon party.",
  "This guide picks twenty-one beach bars worth the journey, from sunset spots and party bars to hammock-and-a-juice hideaways and the local bars where Zanzibaris drink — with when to go, what people order and what to know before you set off.",
];

export const HOW_TO_READ: { label: string; body: string }[] = [
  {
    label: "Our picks, checked practicalities",
    body: "Why a bar is here is the editors' judgement. Opening, location, events and what's served were checked against the bar's own pages and recent reviews on the date shown. The drinks and dishes named are the ones guests and menus single out — not first-hand tasting notes.",
  },
  {
    label: "Price bands, never prices",
    body: "$ is a local bar, $$ a typical beach bar, $$$ a smart cocktail bar, and $$$$ a top-end hotel or rooftop bar. Prices, entry fees and party nights change, so check before you go.",
  },
];

export const CATEGORY_CAVEAT = "Groupings are our suggestions to help you choose, not a ranking — the bars are listed by area, from Stone Town round the north and down the east coast to the south.";

// Followed on the page by a "contact us" link, so it ends with the ask.
export const PHOTO_NOTE =
  "They come from the bars' own websites, from Google Maps contributors and from photographers on Flickr and Wikimedia Commons, each credited beneath the picture and linked to where it came from. They're shared here to celebrate these places. If one is yours and you'd like it removed or credited differently, we'll gladly do it —";

export const ADVICE: AdviceBlock[] = [
  {
    id: "sunset",
    title: "Timing the sunset",
    paragraphs: [
      "Close to the equator the sun sets at much the same time all year, roughly between 18:15 and 18:45, and it goes down fast. Arrive an hour before for a good seat — the front-row tables and swings go first.",
      "The sun sets over the sea only on the west-facing shores: Stone Town, Nungwi and Kendwa in the north-west, and the Chwaka Bay side of the Michamvi peninsula. On the rest of the east coast the bars face the sunrise; sundowners there come with a pink sky behind you and the moon rising over the reef.",
    ],
  },
  {
    id: "tides",
    title: "Tides on the east coast",
    paragraphs: [
      "On the east coast the sea goes out a long way at low tide, leaving the lagoon as sand and seagrass, and comes back in a few hours later. A bar that sits over the water at high tide may be a walk from it at low tide. Check a tide table if swimming or the view matters to you.",
    ],
  },
  {
    id: "parties",
    title: "Parties and late nights",
    paragraphs: [
      "Kendwa Rocks' full moon party is the island's best-known night out; Nungwi, Kendwa and Paje have DJ nights through the week. Party nights and entry fees change from season to season, so check the bar's own pages before you plan around one.",
      "Look after your drink, keep valuables at the hotel, and agree a taxi home before the night starts. Walking long, unlit beaches alone late at night isn't wise.",
    ],
  },
  {
    id: "alcohol",
    title: "Alcohol, Ramadan and respect",
    paragraphs: [
      "Zanzibar is a mainly Muslim island. Beach bars and hotels serve alcohol, but drinking in the street or on village beaches away from the bars is frowned upon. Cover up — a shirt and shorts or a wrap — when you walk off the beach into a village.",
      "During Ramadan some bars shorten their hours, play quieter music or stop serving alcohol; tourist bars mostly stay open. Check ahead if your trip falls during the fast.",
    ],
  },
  {
    id: "money",
    title: "Paying and tipping",
    paragraphs: [
      "Smaller bars and local spots are often cash only, in shillings or dollars; bigger bars and hotels take cards, sometimes with a surcharge. Some party nights and sunset bars charge entry or ask for a minimum spend.",
      "Tipping is appreciated rather than expected; leaving the change, or around ten percent at a sit-down bar, is generous.",
    ],
  },
  {
    id: "beach-boys",
    title: "Beach sellers and touts",
    paragraphs: [
      "On the busier beaches — Nungwi, Kendwa and Paje especially — sellers offer trips, souvenirs and \"special\" deals. A smile and a firm \"no, asante\" is all it takes. Book trips and transfers through your hotel or a business with good recent reviews.",
    ],
  },
];

export const CALL_TO_ACTION = {
  title: "Found a great bar?",
  navLabel: "Share a recommendation",
  paragraphs: [
    "Some of Zanzibar's best evenings happen at places that never make a list — a reggae shack with no sign, a fishermen's bar in a village, a hotel deck with a view nobody talks about.",
    "Tell us where you watched the sun go down, add a bar to the community directory, or ask the community for a recommendation.",
  ],
  commentPrompt: "Share your favourite beach bar in Zanzibar — it also appears on the guide's card in the community feed.",
  joinPrompt: "to share your favourite bars, review places in the directory and ask locals for advice. The guide itself is free to read.",
};

export const EDITORIAL_STANDARDS =
  "This guide is written by the Mzungu Zanzibar editors. No bar paid to be included. Location, opening, events and what's served were checked against each bar's own pages and recent reviews on the date shown; anything we could not confirm is listed with that bar. Prices and entry fees are never given because they change. The descriptions are not first-hand accounts: they draw on the sources listed with each bar, and drinks and dishes named are those guests and menus single out.";
