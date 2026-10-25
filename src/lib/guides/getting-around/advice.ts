import type { AdviceBlock } from "@/lib/guides/hotel-guide/types";

// The transport guide's own copy: introduction, how to read it, practical
// advice and the photo note. Editors' writing, not quotations; no prices.

export const INTRODUCTION: string[] = [
  "Zanzibar is small — about an hour and a half from end to end — but getting around it is half the adventure.",
  "There are no meters, no rail and barely any street addresses. Instead there are dala dalas that leave when they're full, a shuttle that links the airport with the beaches, drivers you book on WhatsApp, tuk-tuks, scooters, bikes, wooden boats and, at low tide, beaches you can walk from one village to the next. Off the island, fast ferries and small planes leave for the mainland, Pemba and the safari parks all day.",
  "This guide covers every way of getting about — how each works, what it suits, how to book and pay, and what to watch out for — with the taxis and drivers in our community directory at the end.",
];

export const HOW_TO_READ: { label: string; body: string }[] = [
  {
    label: "Checked practicalities",
    body: "Routes, timetables and rules were checked against operators' own sites and booking systems, government notices, the UK government's travel advice and recent reporting on the date shown on each entry. Where sources disagree, or we couldn't confirm something, the entry says so. Nothing here is a first-hand account.",
  },
  {
    label: "Price bands, never prices",
    body: "$ is a local fare or a cheap rental, $$ a shared shuttle or short private ride, $$$ a private cross-island trip, a car or a ferry, and $$$$ a flight. Fares change, so check before you travel.",
  },
];

export const CATEGORY_CAVEAT = "Groupings are suggestions to help you choose, not a ranking — the entries are listed by type: flying in and out, buses and shuttles, taxis and rides, under your own steam, and boats and ferries.";

// Followed on the page by a "contact us" link, so it ends with the ask.
export const PHOTO_NOTE =
  "They come from Wikimedia Commons and Flickr photographers, from the Zanzibar Airports Authority, and from operators' own websites, each credited beneath the picture and linked to where it came from. Pictures we couldn't tie to the exact service — a scooter that may or may not be a boda boda, say — are marked UNVERIFIED. If one is yours and you'd like it removed or credited differently, we'll gladly do it —";

export const ADVICE: AdviceBlock[] = [
  {
    id: "journey-times",
    title: "How long it takes",
    paragraphs: [
      "Rough drive times from Stone Town: the airport 15–30 minutes; Fumba 30–40 minutes; Kiwengwa 45 minutes to an hour; Paje about an hour; Jambiani, Michamvi, Kizimkazi, Matemwe and Pwani Mchangani an hour to an hour and a quarter; Nungwi and Kendwa an hour and a quarter to an hour and a half. From the airport, add a few minutes to the north and take a few off to Fumba.",
      "Between the coasts: Nungwi to Kendwa is ten to fifteen minutes; Nungwi to Matemwe about forty; Paje to Jambiani ten; Paje to Michamvi about twenty; and Nungwi or Kendwa to Paje about an hour and a half to an hour and three-quarters. There's no road across Chwaka Bay, so Kiwengwa to Michamvi goes round through the middle of the island.",
      "These are approximate, worked out from road distances and operators' own transfer times. Speed bumps, police checks, the morning rush out of Stone Town, rain and your hotel's distance from the village all add time — and nobody should be on the road outside the towns after dark.",
    ],
  },
  {
    id: "documents",
    title: "Insurance, permits and papers",
    paragraphs: [
      "Every foreign visitor needs Zanzibar's inbound travel insurance, bought online before arrival; since October 2026, if you land on the mainland first you buy Tanzania's scheme instead, and one policy covers both. It is medical and travel cover, not cover for a hire car or scooter.",
      "To drive or ride, you need your home licence and a Zanzibar permit, which rental firms arrange. Check what your own travel insurance requires — many policies want an International Driving Permit, the right motorbike licence for a scooter, and a helmet — before you hire anything or ride pillion.",
      "Carry your passport (or a copy) and your permit when you drive, and your passport for any ferry to the mainland or Pemba.",
    ],
  },
  {
    id: "money",
    title: "Cash, cards and WhatsApp",
    paragraphs: [
      "Cash still rules on the road: dala dalas, bajaji, taxis, most fuel stations and the Forodhani stalls all want shillings, though drivers and tour firms often quote in dollars. There are ATMs in Stone Town, at the airport and in Paje; there's none in Bwejuu. Mobile money (M-Pesa, Mixx by Yas, Airtel Money) is everywhere but needs a registered local SIM.",
      "WhatsApp is how almost everything is booked: drivers, rental firms, the Zanzibus, boat trips. Save numbers before you need them, and drop a pin rather than giving an address — there are hardly any street addresses, and businesses give landmarks or map codes instead.",
      "Download an offline map before you set off; the signal drops in parts of the south-east, and map apps can send you down a sand track.",
    ],
  },
  {
    id: "seasons",
    title: "Rain, wind and Ramadan",
    paragraphs: [
      "The long rains, from about mid-March to May, flood low roads and turn dirt tracks to mud; some sandy east-coast stretches then need a 4×4. The short rains in November are usually brief afternoon showers. The kusi wind, roughly June to October, makes the ferry crossings rougher — take the early boat.",
      "During Ramadan (expected to begin around 8 February 2027, depending on the moon), dala dalas thin out after sunset, roadside cafés outside hotels close in daylight, and eating, drinking and smoking in public during the day is restricted. Drivers can be in a hurry before sunset.",
    ],
  },
  {
    id: "respect",
    title: "Safety and respect on the road",
    paragraphs: [
      "Don't drive, ride or walk alone outside the towns after dark: there are no street lights, and people, animals and unlit vehicles share the road. The UK government advises against walking alone at night, and warns about bag-snatching from motorbikes — carry bags away from the road.",
      "Slow right down through villages, where children and speed bumps appear without warning. Cover shoulders and knees when you leave the beach, whether you're walking, cycling or riding through; swimwear is for the beach and the hotel. Ask before photographing people.",
    ],
  },
];

export const CALL_TO_ACTION = {
  title: "Know a good driver?",
  navLabel: "Share a driver",
  paragraphs: [
    "The best way around Zanzibar is often a driver someone you trust recommends.",
    "Add a driver to the community directory, review the ones you've used, or ask the community how to get from A to B.",
  ],
  commentPrompt: "Share a tip for getting around Zanzibar — it also appears on the guide's card in the community feed.",
  joinPrompt: "to recommend drivers, review them in the directory and ask locals for advice. The guide itself is free to read.",
};

export const EDITORIAL_STANDARDS =
  "This guide is written by the Mzungu Zanzibar editors. No operator paid to be included. Routes, timetables, rules and contact details were checked against operators' own sites and booking systems, Zanzibar and Tanzanian government notices, the UK government's travel advice and recent news reporting on the date shown; anything we could not confirm is listed with that entry. Operators' claims are reported as theirs. Fares are never given because they change. The descriptions are not first-hand accounts.";
