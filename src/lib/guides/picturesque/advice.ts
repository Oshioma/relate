import type { AdviceBlock } from "@/lib/guides/hotel-guide/types";

// The guide's own copy: introduction, how to read it, the practical advice
// and the photo note. Editors' writing, not quotations; no prices.

export const INTRODUCTION: string[] = [
  "Zanzibar is one of the most photogenic places in the Indian Ocean — and much of its beauty depends on when you arrive.",
  "The same lagoon can be a sheet of turquoise at high tide and a kilometre of sand, seagrass and seaweed farms six hours later. Sandbanks rise and vanish. The west coast gets the sunsets, the east coast the sunrises, and Stone Town's alleys glow for an hour before dusk.",
  "This guide gathers the island's most picturesque places — beaches and sandbanks, reefs and islands, forests, caves and the old town — and tells you when to be there, how to get there and what to know before you go.",
];

export const HOW_TO_READ: { label: string; body: string }[] = [
  {
    label: "Our picks, checked practicalities",
    body: "Why a place is here, and what you'll see, is the editors' judgement. Where it is, how to visit, and the tide and timing advice were checked against current sources on the date shown with each place. Nothing here claims we visited, and we never give prices or fees — they change; ask locally.",
  },
  {
    label: "Tides decide a lot",
    body: "Each place says whether the tide matters. If it does, check a tide table for your dates — the community has one — before you plan the day.",
  },
];

export const CATEGORY_CAVEAT = "Groupings are our suggestions to help you choose, not a ranking — the places are listed roughly by area, from Stone Town around the island.";

// Followed on the page by a "Contact us" link, so it ends with the ask.
export const PHOTO_NOTE =
  "They come from photographers on Wikimedia Commons and Flickr and from venues' own websites, each credited beneath the picture and linked to where it came from. They're shared here to celebrate these places. If one is yours and you'd like it removed or credited differently, we'll gladly do it —";

export const ADVICE: AdviceBlock[] = [
  {
    id: "tides",
    title: "Work with the tides",
    paragraphs: [
      "Zanzibar has two high and two low tides a day, and on the east coast the difference is dramatic: at low tide, especially around full and new moon, the sea can retreat hundreds of metres from Matemwe, Pongwe, Michamvi, Paje and Jambiani.",
      "That shapes everything in this guide. The Rock is reached on foot at low tide and by boat at high tide; sandbanks like Nakupenda appear as the tide drops; east-coast lagoons are at their most turquoise when the water is in; seaweed farms and reef-flat walks need it out. The best times shift by roughly 50 minutes a day, so check a tide table for your dates rather than relying on someone else's timings.",
    ],
  },
  {
    id: "light",
    title: "Light and timing",
    paragraphs: [
      "Zanzibar sits close to the equator, so sunrise and sunset come at much the same time all year — roughly half past six — and the soft light doesn't last long. Midday sun is high and harsh; the hour after sunrise and the hour before sunset are when the island looks its best.",
      "The west coast (Stone Town, Kendwa and west-facing Nungwi) faces the sunset. The east coast faces the sunrise; for a sunset over water there, look for spots on the west side of the Michamvi peninsula.",
    ],
  },
  {
    id: "seasons",
    title: "Seasons and weather",
    paragraphs: [
      "The long rains usually fall from around March to May and the short rains around November; the drier, breezier months from June to October and the hot season from December to February are the most popular. Skies are often clearest on dry-season mornings.",
      "The trade winds that bring the kitesurfers to Paje also bring seaweed onto some east-coast beaches at certain times of year. It's natural and comes and goes; a recent review or a message to your hotel will tell you what to expect.",
    ],
  },
  {
    id: "etiquette",
    title: "Photographing people, respectfully",
    paragraphs: [
      "Zanzibar is a mainly Muslim island and many people, especially women, would rather not be photographed. Always ask first, accept a no with a smile, and never photograph children without a parent's consent. The seaweed farmers, fishermen and dhow builders are at work — ask, and keep your distance if they're busy.",
      "Away from the beach resorts, cover shoulders and knees, particularly in Stone Town and the villages, and be more careful still during Ramadan.",
    ],
  },
  {
    id: "drones",
    title: "Drones",
    paragraphs: [
      "Flying a drone in Tanzania, including Zanzibar, requires permission from the civil aviation authority, and drones flown without it can be confiscated at the airport or on the spot. Don't fly over people, government buildings or the airport, and respect private islands and conservation areas that ban them.",
      "If an aerial shot matters, apply well before you travel or book a local operator who already holds a permit.",
    ],
  },
  {
    id: "getting-around",
    title: "Getting around",
    paragraphs: [
      "Most places in this guide are an hour or so by road from Stone Town; Nungwi and Kendwa in the north and the south-east coast are the furthest. Hotel drivers and taxis are the easiest way to reach them — agree the fare before you set off — and many hotels can arrange tours.",
      "Boat trips (Prison Island, Nakupenda, Mnemba, Menai Bay) are offered everywhere. Choose an operator with life jackets and a recent good record, and don't feel pressured by beach sellers: compare a couple of options, and book through your hotel or a recommended guide if in doubt.",
    ],
  },
  {
    id: "nature",
    title: "Leave it as you found it",
    paragraphs: [
      "Don't stand on or touch coral, don't feed or touch wildlife — including the red colobus monkeys in Jozani and the turtles at Nungwi — and give dolphins space rather than chasing them by boat. Take your rubbish home, and use reef-safe sun cream.",
    ],
  },
];

export const CALL_TO_ACTION = {
  title: "Found somewhere beautiful?",
  navLabel: "Share a spot",
  paragraphs: [
    "Some of Zanzibar's loveliest corners aren't on any list — a quiet stretch of beach at sunrise, a rooftop with a view, a village lane in the late light.",
    "Tell us about your favourite spot, share a tip on the best time to be there, or ask the community before you go.",
  ],
  commentPrompt: "Share your favourite picturesque spot — it also appears on the guide's card in the community feed.",
  joinPrompt: "to share your favourite spots and ask locals for advice. The guide itself is free to read.",
};

export const EDITORIAL_STANDARDS =
  "This guide is written by the Mzungu Zanzibar editors. No place or business paid to be included. Practical details — where each place is, how to visit, tide and timing advice — were checked against at least two current sources on the date shown; anything we could not confirm is listed with that place. Prices and fees are never given because they change. The descriptions are not first-hand accounts: they draw on the sources listed with each place.";
