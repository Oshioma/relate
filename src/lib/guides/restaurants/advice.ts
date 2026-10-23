import type { AdviceBlock } from "@/lib/guides/hotel-guide/types";

// The restaurant guide's own copy: introduction, how to read it, practical
// advice and the photo note. Editors' writing, not quotations; no prices.

export const INTRODUCTION: string[] = [
  "Zanzibar eats well — if you know where to look.",
  "This is the island of spices: cloves, cardamom and cinnamon in the pilau, octopus curry in coconut, the catch of the morning grilled on the beach at dusk. Swahili, Omani, Indian and Italian cooking have all left their mark, and the best tables come with a view of a dhow sail crossing the sunset.",
  "This guide picks the island's best restaurants, from fine dining and a restaurant on a rock in the sea to rooftop terraces, beach grills and the local cafés where Zanzibaris eat — with what to order, when to go and what to know before you book.",
];

export const HOW_TO_READ: { label: string; body: string }[] = [
  {
    label: "Our picks, checked practicalities",
    body: "Why a restaurant is here is the editors' judgement. Opening, booking, location and what's served were checked against the restaurant's own site and recent reviews on the date shown. The dishes named are the ones diners and menus single out — not first-hand tasting notes.",
  },
  {
    label: "Price bands, never prices",
    body: "$ is a local café, $$ a comfortable mid-range meal, $$$ upscale, and $$$$ a special-occasion splurge. Menus and prices change, so check before you go.",
  },
];

export const CATEGORY_CAVEAT = "Groupings are our suggestions to help you choose, not a ranking — the restaurants are listed by area, from Stone Town round the north and down the east coast to the south.";

// Followed on the page by a "contact us" link, so it ends with the ask.
export const PHOTO_NOTE =
  "They come from the restaurants' own websites and from photographers on Flickr and Wikimedia Commons, each credited beneath the picture and linked to where it came from. They're shared here to celebrate these places. If one is yours and you'd like it removed or credited differently, we'll gladly do it —";

export const ADVICE: AdviceBlock[] = [
  {
    id: "booking",
    title: "Book the special ones",
    paragraphs: [
      "The best-known tables — The Rock, rooftop sunset terraces, tasting menus — fill up, especially from July to October and over Christmas and New Year. Book a day or two ahead, and more in peak weeks; some take a deposit.",
      "For sunset, aim to be seated about an hour before the sun goes down. Close to the equator it sets at much the same time all year, roughly between 18:15 and 18:45.",
    ],
  },
  {
    id: "alcohol",
    title: "Alcohol and Ramadan",
    paragraphs: [
      "Zanzibar is a mainly Muslim island. Hotels and tourist restaurants usually serve alcohol, but many local restaurants don't — the entries say which is which where we could confirm it.",
      "During Ramadan many local cafés close in the daytime and open after sunset, when the evenings are lively; some venues stop serving alcohol or shorten their hours. It's polite not to eat, drink or smoke in the street by day during the fast.",
    ],
  },
  {
    id: "seafood",
    title: "Eating seafood well",
    paragraphs: [
      "Seafood is the reason to eat here — octopus, kingfish, red snapper, prawns, lobster and calamari. At the beach grills, ask what came in that day, and ask the price of lobster and large fish before it's cooked: it's often sold by weight.",
      "Choose places that are busy and cook to order. Some diners avoid lobster and octopus in their closed seasons; a good restaurant will tell you what's in season.",
    ],
  },
  {
    id: "local",
    title: "Eat like a local",
    paragraphs: [
      "Look out for pilau and biryani, octopus or fish curry in coconut, urojo (Zanzibar mix, a tangy soup), mishkaki skewers, chapati, mandazi and fresh sugar-cane juice. Local cafés are cheap, quick and often the best food on the island, though they rarely serve alcohol and may close early.",
      "Forodhani's night market is great fun; stick to food grilled in front of you, and agree the price before you order.",
    ],
  },
  {
    id: "money",
    title: "Paying and tipping",
    paragraphs: [
      "Upscale and hotel restaurants take cards, often with a surcharge; smaller places and beach grills may be cash only, in shillings or dollars. Carry some cash, and check the bill — service is sometimes included.",
      "Tipping is appreciated rather than expected; around ten percent for good service at a sit-down restaurant is generous.",
    ],
  },
  {
    id: "getting-there",
    title: "Getting there and back",
    paragraphs: [
      "Many of the best restaurants are a drive from where you're staying. Agree a taxi fare both ways before you set off, or ask your hotel to arrange a driver to wait or return. On the east coast, check whether your restaurant is reached across the beach — and what the tide will be doing when you leave.",
    ],
  },
];

export const CALL_TO_ACTION = {
  title: "Had a great meal?",
  navLabel: "Share a recommendation",
  paragraphs: [
    "Some of Zanzibar's best food is in places that never make a list — a family kitchen in a village, a beach grill with no sign, a café that only locals know.",
    "Tell us where you ate well, add a restaurant to the community directory, or ask the community for a recommendation.",
  ],
  commentPrompt: "Share your favourite place to eat in Zanzibar — it also appears on the guide's card in the community feed.",
  joinPrompt: "to share your favourite restaurants, review places in the directory and ask locals for advice. The guide itself is free to read.",
};

export const EDITORIAL_STANDARDS =
  "This guide is written by the Mzungu Zanzibar editors. No restaurant paid to be included. Location, opening, booking and what's served were checked against each restaurant's own site and recent reviews on the date shown; anything we could not confirm is listed with that restaurant. Prices are never given because they change. The descriptions are not first-hand accounts: they draw on the sources listed with each restaurant, and dishes named are those diners and menus single out.";
