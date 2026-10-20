import type { TravellerRecommendation } from "@/lib/guides/hotel-guide/types";

// "Recommended by travellers who've actually stayed" — from a public
// discussion in the Facebook group "Travelling to Zanzibar", started by a
// member planning a honeymoon. Quotations are the commenters' exact words
// (spelling and punctuation as written); everything else is our paraphrase.
// No profile photos are reproduced. These are not verified reviews, and a
// recommendation here is not the editors' endorsement.
//
// One commenter shared a photograph of an unnamed beachfront hotel; the hotel
// wasn't identifiable, so it is not listed.

export const TRAVELLER_SOURCE =
  "These recommendations come from a public discussion in the “Travelling to Zanzibar” Facebook group, started by a member planning a honeymoon. Quotations are the commenters' own words; the rest is our summary. They are personal experiences, not verified reviews, and we haven't independently inspected these properties.";

export const TRAVELLER_RECOMMENDATIONS: TravellerRecommendation[] = [
  {
    id: "kirstie-du-gay",
    person: "Kirstie Du Gay",
    role: "traveller",
    context: "Community recommendation",
    hotels: [{ name: "Dhow Inn", area: "Paje", guideKey: "dhow-inn" }],
    quotes: ["Dhow Inn in Paje is fantastic"],
    summary: "A short, enthusiastic recommendation for Dhow Inn — one of the more affordable boutique options in this guide.",
  },
  {
    id: "vanessa-janse-van-rensburg",
    person: "Vanessa Janse van Rensburg",
    role: "traveller",
    context: "Has visited Zanzibar several times since 2020 and recently returned",
    hotels: [{ name: "Mnarani Beach Cottages", area: "Nungwi", website: "https://www.tripadvisor.com/Hotel_Review-g616016-d596380-Reviews-Mnarani_Beach_Cottages-Nungwi_Zanzibar_Island_Zanzibar_Archipelago.html" }],
    quotes: ["Stayed at Mnarani Beach Cottages and oh my soul, WOW!!", "Its a boutique Resort, everything you need"],
    summary:
      "A returning visitor was particularly impressed with the property's atmosphere and the choice of restaurants around it, and pointed out that you can book it on a bed-and-breakfast basis and eat out nearby.",
    note: "Mnarani Beach Cottages sits beside the old lighthouse at Nungwi's northern tip. It is a mid-range property of around two dozen rooms; we haven't included it in our own selection.",
  },
  {
    id: "charlotte-nigh",
    person: "Charlotte Nigh",
    role: "traveller",
    context: "Recently back from her honeymoon",
    hotels: [
      { name: "African Bungalows", area: "Nungwi", guideKey: "african-bungalows" },
      { name: "LUJO Zanzibar Resort", area: "Paje", website: "https://lujozanzibar.com/" },
    ],
    quotes: ["Both owned and ran by lovely people and staff members with beautiful food too.", "We didn't want the typical all inclusive massive hotel vibe"],
    summary:
      "She and her partner deliberately avoided large all-inclusive hotels and found two smaller, owner-run places were exactly what they wanted. She also felt Paje was less touristy than Nungwi, with activities more spread out — so taxis were sometimes needed.",
  },
  {
    id: "tenderpenguin750",
    person: "tenderpenguin750",
    role: "traveller",
    context: "Recently stayed in Nungwi",
    hotels: [{ name: "Sandies Nungwi Beach", area: "Nungwi", website: "https://www.nungwizanzibar.sandies-resorts.com/" }],
    quotes: ["We have just stayed at Sandies Nungwi Beach and couldn't fault it."],
    summary: "An unreserved recommendation from a recent stay.",
    note: "An alternative rather than a boutique hotel: Sandies Nungwi Beach is an all-inclusive resort of more than a hundred rooms.",
  },
  {
    id: "phil-roberts",
    person: "Phil Roberts",
    role: "traveller",
    context: "Recently returned from Zanzibar",
    hotels: [{ name: "Safaya Luxury Villas", area: "Nungwi", website: "https://safayaluxuryvillas.com/" }],
    quotes: ["The staff, the food and the view in the morning is breathtaking"],
    summary:
      "He recommended it for a honeymoon. In the discussion, the honeymooner then asked whether alcohol was available, as the property appeared not to serve it — a reminder to check any hotel's alcohol policy directly before you book.",
    note: "Safaya's own website says it does not sell alcohol but that guests may bring their own. Policies change, so confirm with the property.",
  },
  {
    id: "hashim-zanzibar",
    person: "Hashim Zanzibar",
    role: "traveller",
    context: "Community suggestion",
    hotels: [{ name: "Warere Beach Hotel", area: "Nungwi", website: "https://www.warere.com/" }],
    quotes: ["The Warere Hotel in Nungwi is a truly attractive spot"],
    summary: "Described as a peaceful place to stay.",
    note: "Warere is a small hotel on a quiet stretch east of Nungwi village; recent reviewers note that its beach is small and rocky, with little sand at high tide.",
  },
  {
    id: "rene-moloney",
    person: "Rene Moloney",
    role: "traveller",
    context: "Shared a video review of the stay",
    hotels: [{ name: "Gold Zanzibar Beach House & Spa", area: "Kendwa", website: "https://www.goldzanzibar.com/" }],
    quotes: ["We loved Zanzibar Gold."],
    summary: "A warm recommendation, shared with a video review of the stay.",
    link: { label: "Watch the traveller's video review (YouTube)", href: "https://youtu.be/MMUXOLGFZhA" },
    note: "A larger luxury resort of around 70 rooms and villas, so it isn't part of our boutique shortlist — but a good option on Kendwa beach.",
  },
  {
    id: "luka-bou",
    person: "Luka Bou",
    role: "local-guide",
    context: "A local Zanzibar guide — a recommendation, not a guest review",
    hotels: [
      { name: "The Z Hotel", area: "Nungwi", guideKey: "z-hotel" },
      { name: "The Zanzibari", area: "Nungwi", guideKey: "zanzibari" },
      { name: "Amani Boutique Hotel", area: "Paje", guideKey: "amani" },
    ],
    quotes: [],
    summary: "Suggested these three for a honeymoon: The Z Hotel as stylish and romantic, The Zanzibari as smaller and quieter, and Amani as an attractive beachfront option for couples.",
  },
  {
    id: "kirsty-gibson",
    person: "Kirsty Gibson",
    role: "travel-tip",
    context: "A tip about planning help, not a hotel review",
    hotels: [],
    quotes: [],
    summary:
      "Suggested contacting Lucia Campanella at the UK travel specialist Designer Travel, who had recently inspected several impressive Zanzibar hotels, including boutique options.",
    note: "We have no relationship with Designer Travel.",
    link: { label: "Designer Travel", href: "https://designertravel.co.uk/" },
  },
];
