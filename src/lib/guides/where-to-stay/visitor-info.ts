// ESSENTIAL VISITOR INFORMATION — the sections below the destination guides.
//
// Kept as plain data so the page, the FAQ structured data and any future
// editor read the same words. Links use `{dest:key}` for a destination
// anchor on this page and `{tides}` for the community's tides page; the page
// resolves them when rendering.

export type InfoBlock = { heading: string; paragraphs: string[] };

export const TIDES_SECTION: InfoBlock[] = [
  {
    heading: "Why the north-west is easiest for swimming",
    paragraphs: [
      "Kendwa and the western side of Nungwi face the sheltered channel between Zanzibar and the mainland. The sea floor drops away fairly quickly, so even at low tide there is usually water deep enough to swim within a short walk of the sand.",
    ],
  },
  {
    heading: "Why the east coast changes so much",
    paragraphs: [
      "Most of the east coast — from Matemwe and Kiwengwa down to Paje and Jambiani — is protected by a reef some way offshore. Between the beach and the reef is a wide, shallow lagoon. Zanzibar's tidal range is large, so twice a day much of that lagoon drains, leaving sand, seagrass, seaweed farms and rock pools, and the sea can be hundreds of metres away.",
    ],
  },
  {
    heading: "What to expect at low tide",
    paragraphs: [
      "Low tide is a time for walking, not swimming: you can wander out across the flats, watch seaweed farmers and fishermen at work, and look into pools. Wear reef shoes, watch for sea urchins, and never walk out to the reef edge without local advice — the tide comes back faster than people expect.",
    ],
  },
  {
    heading: "Beachfront does not always mean easy swimming",
    paragraphs: [
      "A hotel can be right on the sand and still have little or no swimmable water for several hours a day. If swimming in the sea whenever you like matters, choose the north-west coast, or pick an east-coast hotel with a good pool and plan your sea swims around high tide.",
    ],
  },
  {
    heading: "How to check the tides",
    paragraphs: [
      "Tide times shift by roughly 50 minutes each day, and the biggest ranges come around full and new moon (spring tides). Check a tide table for the week you are visiting — Mzungu Zanzibar has its own {tides} page — and ask your hotel when the best swimming hours are.",
    ],
  },
  {
    heading: "Conditions vary even within one destination",
    paragraphs: [
      "Sand banks, reef gaps, headlands and channels mean two hotels a few hundred metres apart can have quite different water. Nungwi's west side and its eastern headland are a good example. Look at recent guest photos taken at different times of day before you book.",
    ],
  },
];

export type MonthRow = { months: string; summary: string; detail: string };

export const WHEN_TO_VISIT: MonthRow[] = [
  { months: "January–February", summary: "Hot, generally drier", detail: "Hot and humid with mostly sunny days. The north-east Kaskazi wind brings a kitesurfing season to the east coast. A popular time to visit." },
  { months: "March", summary: "Increasing rain risk", detail: "Still hot, with showers becoming more likely as the month goes on. Fewer visitors and often lower prices." },
  { months: "April–May", summary: "Main rainy season", detail: "The long rains (masika): heavy downpours, high humidity and rougher seas. Some hotels and restaurants close for a few weeks. Quietest and cheapest time to visit." },
  { months: "June–August", summary: "Generally drier and breezier", detail: "Cooler, drier weather and the south-east Kusi trade wind — the main kitesurfing season. A busy time, especially in July and August." },
  { months: "September–October", summary: "Generally pleasant", detail: "Warm, mostly dry and still breezy early on. Many people consider this one of the best times for a beach holiday." },
  { months: "November", summary: "Short-rain period", detail: "The short rains (vuli) usually bring brief showers and storms rather than days of rain. Often good value." },
  { months: "December", summary: "Popular holiday period", detail: "Hot, with the short rains easing. Christmas and New Year are the busiest and most expensive weeks: book well ahead." },
];

export const WEATHER_CAVEAT =
  "These are typical patterns, not guarantees. Zanzibar's weather varies from year to year, and the rains can start early, arrive late or be lighter or heavier than usual.";

export const SEVEN_THINGS: { title: string; body: string }[] = [
  {
    title: "Tides decide your swimming",
    body: "On the east coast the sea can disappear for hours at low tide. If daily sea swimming is a priority, stay in Kendwa or Nungwi, or plan around high tide and choose a hotel with a pool.",
  },
  {
    title: "Beachfront is not the same as swimmable",
    body: "Ask what the water is like in front of the hotel at low tide, not just whether it is on the beach. Some beachfront hotels sit on rocky shore or coral cliffs with steps or a jetty down to the water.",
  },
  {
    title: "Wind is a feature, not a fault",
    body: "The trade winds that make Paje and the south-east a kitesurfing hotspot also make some beaches breezy for weeks at a time. Great for staying cool; less good if you want glassy water.",
  },
  {
    title: "Seaweed comes with the territory",
    body: "Seaweed farming is an important income for women in east-coast villages such as Paje and Jambiani, and natural seaweed washes up seasonally. Some beaches look less pristine for a few weeks of the year; respect the farms and do not walk through them.",
  },
  {
    title: "Check what is within walking distance",
    body: "In Nungwi, Paje and Stone Town you can walk to dozens of restaurants. In Matemwe, Kiwengwa, Pongwe, Dongwe and Uroa you may eat mostly at your hotel. Decide which suits you before choosing between half-board and room-only.",
  },
  {
    title: "Travel times are longer than the map suggests",
    body: "Roads are slow and speed bumps frequent. As a rough guide, the airport to Stone Town is about 15–20 minutes, to Paje about an hour, and to Kendwa or Nungwi about 1 hour 15 minutes to 1 hour 30 minutes; north to south-east is close to two hours.",
  },
  {
    title: "Hotels in the same village can be very different",
    body: "Within one destination, position matters: beachfront or inland, sandy beach or rocky shore, near the bars or at the quiet end. Read recent reviews for the exact hotel rather than relying on the village's reputation.",
  },
];

export type Itinerary = { title: string; body: string };

export const ITINERARIES: Itinerary[] = [
  {
    title: "Five nights",
    body: "Pick one base and stay put: {dest:kendwa} for easy swimming and sunsets, or {dest:nungwi} for more restaurants and activities. Day trips to Stone Town or Mnemba are easy to arrange from either.",
  },
  {
    title: "Seven nights",
    body: "Four nights in {dest:kendwa} or {dest:nungwi}, then three nights in {dest:paje} or {dest:jambiani}. You get the north-west's swimming and sunsets, then the south-east's lagoon, cafés and village life.",
  },
  {
    title: "Ten to fourteen nights",
    body: "One or two nights in {dest:stone-town}, four or five nights in the north ({dest:kendwa} or {dest:nungwi}), and the rest on the south-east coast ({dest:paje}, {dest:jambiani} or {dest:bwejuu}). Two hotel changes is plenty.",
  },
  {
    title: "Quieter options for honeymooners",
    body: "Swap the north for {dest:matemwe} or {dest:pongwe}, and the south-east for {dest:michamvi} or {dest:dongwe}. A night in {dest:stone-town} at the start makes a good contrast to the beach.",
  },
];

export type Faq = { question: string; answer: string };

export const FAQS: Faq[] = [
  {
    question: "Which part of Zanzibar has the best beaches?",
    answer: "It depends on what you want from a beach. For swimming at any time of day, {dest:kendwa} and {dest:nungwi} on the north-west coast are hard to beat. For wide white sand and a turquoise lagoon, the south-east — {dest:paje}, {dest:jambiani} and {dest:bwejuu} — is spectacular, but tide-dependent.",
  },
  {
    question: "Where can you swim at low tide?",
    answer: "Mainly on the north-west coast: {dest:kendwa} and the western side of {dest:nungwi}. On most of the east coast the lagoon drains at low tide, so plan sea swims around high tide there.",
  },
  {
    question: "Is Kendwa better than Nungwi?",
    answer: "Kendwa is calmer, with a broad beach and easy swimming; Nungwi has far more restaurants, bars and activities but is busier. Families and couples often prefer {dest:kendwa}; first-timers who want choice, solo travellers and groups often prefer {dest:nungwi}. They are close enough to visit each other.",
  },
  {
    question: "Is Paje better than Jambiani?",
    answer: "{dest:paje} is more sociable, with more cafés, bars and kitesurfing. {dest:jambiani} is quieter and more village-like. The beaches are similar and both are tidal. Many people stay in Jambiani and pop into Paje for evenings out.",
  },
  {
    question: "Where should families stay?",
    answer: "{dest:kendwa} is the easiest for children who want to swim in the sea. {dest:kiwengwa} and {dest:pwani-mchangani} suit families who want a resort with pools and kids' facilities. Avoid places where nightlife is the main draw if you want early nights.",
  },
  {
    question: "Where should honeymooners stay?",
    answer: "{dest:matemwe}, {dest:michamvi}, {dest:pongwe} and {dest:dongwe} are the most romantic and private. {dest:kendwa} works well if you want sunsets and easy swimming with a little more going on.",
  },
  {
    question: "Where is Zanzibar's best nightlife?",
    answer: "{dest:nungwi} has the most bars and late nights, {dest:kendwa} has the famous full-moon parties, and {dest:paje} has the liveliest scene on the east coast. {dest:stone-town} has rooftop bars and a busy evening waterfront.",
  },
  {
    question: "Where is best for kitesurfing?",
    answer: "{dest:paje} is Zanzibar's kitesurfing capital, with neighbouring {dest:jambiani} and {dest:bwejuu} also popular, and some schools on the north-east coast at {dest:kiwengwa}. The main seasons are roughly June to October and December to March.",
  },
  {
    question: "Which destination is best for diving?",
    answer: "{dest:nungwi} has the most dive centres and the widest choice of sites. {dest:matemwe} is closest to Mnemba Atoll, one of the island's best-known diving and snorkelling areas.",
  },
  {
    question: "Is Stone Town worth staying in?",
    answer: "Yes, for one to three nights. It is the cultural heart of Zanzibar — UNESCO-listed, full of history, markets and excellent food — but it is not a beach destination. See {dest:stone-town}.",
  },
  {
    question: "How many days should visitors spend in Zanzibar?",
    answer: "Five nights is enough for one beach and a day trip; seven to ten lets you combine two coasts and Stone Town; two weeks lets you slow down. See our suggested itineraries.",
  },
  {
    question: "Is it better to stay in one place or move around?",
    answer: "For a week or less, one or two bases is best — every move costs half a day on slow roads. With ten days or more, combining the north-west and south-east coasts shows you two very different sides of the island.",
  },
  {
    question: "Where is best for budget travellers?",
    answer: "{dest:paje}, {dest:jambiani} and {dest:bwejuu} have the most guesthouses and affordable cafés. {dest:uroa} has good-value resorts, and {dest:nungwi} has budget rooms set back from the beach.",
  },
  {
    question: "Which parts of Zanzibar are quietest?",
    answer: "{dest:pongwe}, {dest:dongwe}, {dest:matemwe}, {dest:uroa}, {dest:pwani-mchangani} and {dest:kizimkazi} are all very quiet, especially in the evenings.",
  },
  {
    question: "Do you need a car?",
    answer: "Not usually. Most visitors use pre-booked transfers, taxis and tuk-tuks, and many hotels arrange trips. Hiring a car is possible with a local permit, but roads are slow, police checkpoints are common and driving is on the left. In the quieter destinations, budget for taxis if you want to eat out.",
  },
];

export const RANKING_EXPLAINER =
  "The order ranks general suitability for most beach holidaymakers — how easy each place makes swimming, eating out and getting around — not absolute beauty or quality. A peaceful honeymoon might be perfect in Pongwe, and Stone Town would rank first for culture.";

export const EDITORIAL_STANDARDS =
  "This guide is written and maintained by the Mzungu Zanzibar editors from local knowledge and recent public traveller reviews (Google, Tripadvisor, travel forums and venues' own information). Recommendations are editorial and never paid for; any commercial relationship is disclosed on the card it applies to. We have not presented anything as a personal stay or meal unless it was one. Places change — if something here is out of date, please tell us.";
