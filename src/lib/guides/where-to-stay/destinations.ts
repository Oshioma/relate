import type { Destination } from "./types";
import { DESTINATION_PHOTOS } from "./photos";
import { RESTAURANTS } from "./restaurants";
import { STAYS } from "./stays";

// THE 14 DESTINATIONS — built-in editorial copy.
//
// Rank is general suitability for most beach holidaymakers, not beauty or
// quality (the guide says so above the cards). Admins can override any field
// per destination from the guide's admin page; what is here is the default.
//
// House style: practical British English, honest about the trade-offs, no
// invented first-hand visits. The map coordinates are the approximate centre
// of each village or area — for orientation on the overview map, not for
// navigating to a business.

type DestinationCopy = Omit<Destination, "photos" | "restaurants" | "stays">;

const COPY: DestinationCopy[] = [
  {
    key: "kendwa",
    name: "Kendwa",
    rank: 1,
    category: "Best overall for a classic Zanzibar beach holiday",
    coast: "North-west coast",
    lat: -5.752,
    lng: 39.29,
    summary:
      "A broad, west-facing beach where you can swim for most of the day, with big sunsets and a relaxed resort feel.",
    bestFor: ["swimming", "families", "couples", "honeymoon", "sunsets", "first-timers", "resort"],
    panel: { swimming: "excellent", tides: "low", atmosphere: "moderate", nightlife: "medium", restaurants: "moderate", budget: "$$", accommodation: "wide", nights: "4–7 nights" },
    intro:
      "Kendwa is one of the easiest places in Zanzibar to enjoy swimming throughout much of the day. The beach is broad, sunsets are excellent and the atmosphere is generally relaxed. However, visitors wanting numerous independent restaurants and nightlife venues may prefer Nungwi, a short tuk-tuk or taxi ride to the north.",
    whyPeopleLoveIt:
      "The water stays deep enough to swim at almost every state of the tide, which is rare in Zanzibar. The sand is wide and soft, the beach faces west so the sun sets straight over the sea, and you can walk for a long way along the shoreline between beach bars and hotels.",
    whatMakesItDifferent:
      "Compared with the east coast, the tide here makes far less difference to your day — you rarely have to plan a swim around a tide table. Compared with Nungwi next door, Kendwa is calmer and more spread out, with fewer independent restaurants and a more resort-led feel.",
    whoShouldStay:
      "First-time visitors who mainly want a beach holiday, families who want easy sea swimming, couples and honeymooners who want sunsets on the doorstep, and anyone who would rather not think about tides.",
    whoMightNot:
      "Travellers who want a village atmosphere, lots of independent places to eat within walking distance, or very quiet nights. Kendwa is not remote, and on full-moon party nights it is anything but quiet.",
    misunderstandings:
      "\"Kendwa\" on a booking site can mean a hotel right on the sand or one several minutes' walk inland up the hill behind the beach. Check whether a property is genuinely beachfront before you book. Beach vendors (\"beach boys\") selling excursions are part of life here; a polite, firm \"no thank you\" is normally enough.",
    beach:
      "Wide white sand with gentle, mostly swimmable water through much of the tidal cycle. Beach bars and watersports operators line the central stretch. Sunsets are the main event most evenings.",
    eatingOut:
      "Most visitors eat in hotels and beach bars, with a growing number of independent restaurants and cafés along Kendwa's main road. For a wider choice, Nungwi's restaurants are a short taxi or tuk-tuk ride away.",
    notes: [
      {
        title: "Full-moon parties",
        body: "Kendwa Rocks Beach Hotel hosts a well-known monthly full-moon party. It is a big, loud night that draws people from across the island; if you are staying nearby and want quiet, check the date before you book.",
      },
    ],
    tradeOff: "Fewer independent restaurants and a more resort-led feel than Nungwi.",
  },
  {
    key: "nungwi",
    name: "Nungwi",
    rank: 2,
    category: "Best for restaurants, activities and nightlife",
    coast: "Northern tip",
    lat: -5.726,
    lng: 39.297,
    summary:
      "Zanzibar's liveliest beach village, with the widest choice of restaurants, bars, dive centres and boat trips.",
    bestFor: ["first-timers", "solo", "nightlife", "restaurants", "diving", "snorkelling", "swimming", "sunsets"],
    panel: { swimming: "excellent", tides: "low", atmosphere: "lively", nightlife: "high", restaurants: "excellent", budget: "$$", accommodation: "wide", nights: "3–6 nights" },
    intro:
      "Nungwi sits on the northern tip of the island and has the most going on of any beach destination in Zanzibar. Swimming along the main north-west-facing beach is good for much of the day, and you are never short of somewhere to eat, drink or book a trip. The price of that choice is a busier, more commercial atmosphere.",
    whyPeopleLoveIt:
      "Choice. Dozens of restaurants and bars, dive and snorkelling centres, sunset dhow cruises and day trips all start here. It is easy to meet people, and you can eat somewhere different every night without needing a car.",
    whatMakesItDifferent:
      "Nungwi is still a working fishing village: wooden dhows are built and repaired by hand near the beach, and fishing boats come and go around the headland. That working village sits right alongside a busy tourist strip.",
    whoShouldStay:
      "First-time visitors who want options, solo travellers, groups of friends, divers and snorkellers, and anyone who wants an active holiday with good food and some nightlife.",
    whoMightNot:
      "Anyone looking for peace and seclusion, or who finds persistent beach sellers wearing. Nungwi is the busiest beach area on the island.",
    misunderstandings:
      "Beach conditions change around the headland. The west-facing side near the village centre is the classic swimming beach; the east side and the northern point have more coral, rock and tidal variation. Some sections of beach become narrow at high tide, so a \"beachfront\" hotel may have little sand at the top of the tide.",
    beach:
      "Good, deep-water swimming along the main north-west beach for much of the day. Narrower sand at high tide in places, busier near the village centre, quieter towards the ends.",
    eatingOut:
      "The best restaurant choice of any beach destination in Zanzibar, from local cafés and seafood grills to hotel restaurants and sunset bars. Booking ahead is wise for popular places in high season.",
    notes: [
      {
        title: "Quieter or busier?",
        body: "Hotels near the village centre and main beach put you closest to restaurants and bars. Properties towards Kendwa in the south-west or around the eastern side of the headland are usually quieter, at the cost of a walk or short ride into the action.",
      },
    ],
    tradeOff: "Busy and commercial, with beach sellers and a party crowd in high season.",
  },
  {
    key: "paje",
    name: "Paje",
    rank: 3,
    category: "Best for kitesurfing, cafés and a sociable atmosphere",
    coast: "South-east coast",
    lat: -6.267,
    lng: 39.535,
    summary:
      "A long white-sand beach and lagoon that is a world-class kitesurfing spot, with cafés, beach bars and an international crowd.",
    bestFor: ["kitesurfing", "cafes", "remote-work", "solo", "couples", "restaurants", "nightlife", "budget"],
    panel: { swimming: "tide-dependent", tides: "strong", atmosphere: "lively", nightlife: "medium", restaurants: "excellent", budget: "$", accommodation: "wide", nights: "4–7 nights" },
    intro:
      "Paje is the social heart of the south-east coast. Its wide, shallow lagoon makes it one of the best kitesurfing spots in East Africa, and around that has grown a lively village of cafés, guesthouses, beach bars and co-working-friendly places. It is a fun, easy-going base, as long as you understand the tide.",
    whyPeopleLoveIt:
      "The colour of the lagoon, a young and international crowd, plenty of independent cafés and restaurants, and the ease of meeting people. Kitesurfers come for flat, shallow water and consistent seasonal winds.",
    whatMakesItDifferent:
      "Paje has the most independent cafés and the most sociable atmosphere of any beach village on the east coast. It also has some of the most dramatic tidal changes: at low tide the sea can retreat a very long way across the sand and seaweed farms.",
    whoShouldStay:
      "Kitesurfers and people who want to learn, younger travellers, solo travellers, couples who like a lively village, and digital nomads staying a while.",
    whoMightNot:
      "Anyone who wants to swim whenever they like, or who wants silence at night. Development has been rapid and some properties are close to bars or building work.",
    misunderstandings:
      "The lagoon is very shallow for much of the day. At low tide you may walk a long way to reach water deep enough to swim, and in the windy kite seasons the beach can feel breezy rather than still. Calm, deep-water swimming is far easier on the north-west coast.",
    beach:
      "Very wide, bright white sand and a shallow turquoise lagoon. Swimming is best around high tide. In the kite seasons, part of the lagoon is busy with kitesurfing schools.",
    eatingOut:
      "Excellent choice for a beach village: coffee shops, healthy cafés, local restaurants, pizza and beach bars, many within walking distance along the beach and the sandy village streets.",
    notes: [
      {
        title: "Wind and kite seasons",
        body: "The kitesurfing seasons follow the trade winds: the north-east Kaskazi roughly from December to March and the stronger south-east Kusi roughly from June to October. Outside those months the water is calmer and the village quieter.",
      },
    ],
    tradeOff: "Strong tides make swimming time-dependent, and the village can be noisy and windy.",
  },
  {
    key: "jambiani",
    name: "Jambiani",
    rank: 4,
    category: "Best for village life and a peaceful beach holiday",
    coast: "South-east coast",
    lat: -6.317,
    lng: 39.545,
    summary:
      "A long, palm-lined village beach with fishing boats, seaweed farms and small boutique hotels — quieter than Paje but close to it.",
    bestFor: ["village", "peace", "couples", "families", "budget", "remote-work"],
    panel: { swimming: "tide-dependent", tides: "strong", atmosphere: "peaceful", nightlife: "low", restaurants: "moderate", budget: "$", accommodation: "good", nights: "4–7 nights" },
    intro:
      "Jambiani stretches for several kilometres along the south-east coast and still feels like a village first and a resort second. Fishermen and seaweed farmers work the lagoon, hotels are mostly small, and evenings are calm. It is a lovely base for a slower, longer stay.",
    whyPeopleLoveIt:
      "Its authenticity and calm. You can watch village life on the beach, walk for miles at low tide, and eat at relaxed beach restaurants without the bustle of the north. Paje's cafés and bars are a short ride away when you want them.",
    whatMakesItDifferent:
      "Jambiani is long and linear, so the experience changes along its length. The northern end is closest to Paje and has more places to eat; the central village is the most traditional; the southern stretch is quieter and more spread out.",
    whoShouldStay:
      "Couples, families who are happy with tide-dependent swimming, independent travellers, and anyone staying a week or more who wants a peaceful village atmosphere.",
    whoMightNot:
      "Travellers who want nightlife, or who need to swim at any time of day. Visitors who want everything within a short walk should stay towards the northern end.",
    misunderstandings:
      "The tide here is strong. At low tide the lagoon drains a long way out, with seaweed farms and rock pools exposed. That is part of the charm for many visitors, but it is not a swim-whenever-you-like beach.",
    beach:
      "Long white sand, fishing boats and seaweed farming in the lagoon. Best swimming around high tide; low tide is for walking and exploring.",
    eatingOut:
      "A good range of relaxed beach restaurants and local places strung along the coast road, though they are spread out. Many visitors combine Jambiani with occasional evenings in Paje.",
    notes: [],
    tradeOff: "Spread-out village with tide-dependent swimming and very little nightlife.",
  },
  {
    key: "matemwe",
    name: "Matemwe",
    rank: 5,
    category: "Best for tranquillity, diving and romance",
    coast: "North-east coast",
    lat: -5.87,
    lng: 39.345,
    summary:
      "A long, quiet, palm-lined coast opposite Mnemba Atoll, with boutique hotels and some of Zanzibar's best diving close by.",
    bestFor: ["couples", "honeymoon", "diving", "snorkelling", "peace", "village", "luxury"],
    panel: { swimming: "tide-dependent", tides: "strong", atmosphere: "peaceful", nightlife: "low", restaurants: "limited", budget: "$$", accommodation: "good", nights: "4–6 nights" },
    intro:
      "Matemwe is a long, peaceful stretch of the north-east coast where traditional village life carries on beside a string of boutique hotels. Its big draw is the sea beyond the reef: Mnemba Atoll, a short boat ride away, is one of the most popular diving and snorkelling areas in Zanzibar.",
    whyPeopleLoveIt:
      "Quiet beaches, turquoise water at high tide, beautiful sunrises over the reef, and easy access to Mnemba-area dive and snorkel trips.",
    whatMakesItDifferent:
      "It is calmer and more romantic than the north-west, with a strong local village presence and fewer visitors walking the beach. Most hotels are small and intimate.",
    whoShouldStay:
      "Couples and honeymooners, divers and snorkellers, and anyone who wants peace and is happy to eat mostly where they are staying.",
    whoMightNot:
      "Visitors who want nightlife, lots of independent restaurants, or swimming at any time of day.",
    misunderstandings:
      "The tide drops a long way on this coast. At low tide the lagoon becomes sand, seagrass and pools, and swimming means waiting for the water to come back or using the hotel pool. Restaurants are mostly inside hotels.",
    beach:
      "Long, palm-lined white sand with village fishing activity. Swimming is best around high tide; low tide exposes a wide reef flat.",
    eatingOut:
      "Limited outside the hotels, though there are a few small independent and local restaurants. Plan to eat at your own hotel most nights, and book other hotels' restaurants ahead.",
    notes: [
      {
        title: "Mnemba responsibly",
        body: "Mnemba Atoll is a marine conservation area. Choose an operator that keeps boats off the reef, limits group sizes and briefs you not to touch or feed marine life.",
      },
    ],
    tradeOff: "Strong tides and few restaurants outside the hotels.",
  },
  {
    key: "michamvi",
    name: "Michamvi",
    rank: 6,
    category: "Best for romantic scenery and sunsets",
    coast: "South-east peninsula",
    lat: -6.155,
    lng: 39.5,
    summary:
      "A narrow peninsula with two very different sides: sunset bars on Kae's bay, and boutique hotels and The Rock on Pingwe's Indian Ocean shore.",
    bestFor: ["couples", "honeymoon", "sunsets", "peace", "luxury"],
    panel: { swimming: "tide-dependent", tides: "strong", atmosphere: "peaceful", nightlife: "low", restaurants: "moderate", budget: "$$$", accommodation: "good", nights: "3–5 nights" },
    intro:
      "Michamvi is the peninsula at the northern end of the south-east coast. It is really two places. Michamvi Kae faces west into Chwaka Bay and is known for sunset beach bars; Michamvi Pingwe faces east to the open Indian Ocean and is home to boutique hotels and the famous restaurant on a rock. Both are quiet and scenic, and both suit couples.",
    whyPeopleLoveIt:
      "Sunsets over the bay at Kae, and the dramatic east-facing coastline at Pingwe. It feels remote and romantic while still being within reach of Paje.",
    whatMakesItDifferent:
      "It is one of the few places on the east coast where you can watch the sun set over the water — on the Kae side. The Pingwe side is about sunrises, coral-fringed coast and romantic dinners.",
    whoShouldStay:
      "Couples and honeymooners, travellers who want scenery and calm, and anyone happy to use taxis for excursions.",
    whoMightNot:
      "Families who want easy swimming and things to do nearby, and travellers without a budget for taxis — it is spread out and fairly remote.",
    misunderstandings:
      "Kae and Pingwe are on opposite sides of the peninsula. They are not an easy beach walk from each other; treat them as separate places joined by a short drive. Both have tidal swimming.",
    beach:
      "Kae: a shallow, west-facing bay with sunset bars, very shallow at low tide. Pingwe: an east-facing ocean beach with a reef and strong tidal changes.",
    eatingOut:
      "Moderate. Kae's sunset bars and Pingwe's hotel restaurants cover most needs, and The Rock is a destination in itself. Expect to use taxis between them.",
    notes: [
      {
        title: "Michamvi Kae",
        body: "West-facing bay, sunset views, beach bars, a quieter and more remote atmosphere. Go for an afternoon and stay for sunset.",
      },
      {
        title: "Michamvi Pingwe",
        body: "East-facing ocean coastline, boutique hotels and romantic dining. Home to The Rock restaurant, built on a rock just offshore: you walk out at low tide and may be taken by boat at high tide. It is one of the most photographed restaurants in Zanzibar, so booking ahead is strongly advised, especially for lunch in high season. Reviewers rave about the setting more consistently than the food, and prices are high.",
      },
    ],
    tradeOff: "Remote and spread out, with tide-dependent swimming and taxis needed to get around.",
  },
  {
    key: "kiwengwa",
    name: "Kiwengwa",
    rank: 7,
    category: "Best for families and resort holidays",
    coast: "North-east coast",
    lat: -5.99,
    lng: 39.38,
    summary:
      "A long white-sand coast lined with established resorts, popular with all-inclusive and family holidays and with a strong Italian influence.",
    bestFor: ["families", "resort", "couples", "luxury"],
    panel: { swimming: "tide-dependent", tides: "strong", atmosphere: "moderate", nightlife: "low", restaurants: "limited", budget: "$$", accommodation: "wide", nights: "5–7 nights" },
    intro:
      "Kiwengwa is resort country: a long, beautiful stretch of the north-east coast where most visitors stay in larger hotels, many of them all-inclusive. Italian tour operators have long been active here, and you will notice it in the food and the entertainment programmes.",
    whyPeopleLoveIt:
      "Big pools, kids' clubs, watersports and everything on site. The beach is long and white, and the resorts make it easy to relax without organising anything.",
    whatMakesItDifferent:
      "There is no single compact centre to wander around. Life happens inside the resorts, which makes Kiwengwa simple for families and organised holidays but less interesting for independent explorers.",
    whoShouldStay:
      "Families, all-inclusive visitors, and anyone who wants an organised, low-effort resort holiday.",
    whoMightNot:
      "Independent travellers who want to walk to local restaurants and bars, and anyone who wants to swim in the sea at any time of day.",
    misunderstandings:
      "The tide drops a long way here too. At low tide the sea can be some distance out across the reef flat, so the resort pool does most of the swimming work for children.",
    beach:
      "Long white sand with a wide reef flat at low tide. Good for walks and high-tide swims; resorts typically offer watersports.",
    eatingOut:
      "Mostly in resorts. A handful of independent places exist along the coast road, but you will usually need a taxi to reach them.",
    notes: [],
    tradeOff: "Resort-centred with few independent restaurants and strong tides.",
  },
  {
    key: "bwejuu",
    name: "Bwejuu",
    rank: 8,
    category: "Best for peace near Paje",
    coast: "South-east coast",
    lat: -6.235,
    lng: 39.535,
    summary:
      "A broad, palm-fringed beach just north of Paje — quieter and more village-like, with Paje's cafés a few minutes away.",
    bestFor: ["peace", "couples", "village", "budget"],
    panel: { swimming: "tide-dependent", tides: "strong", atmosphere: "peaceful", nightlife: "low", restaurants: "moderate", budget: "$", accommodation: "good", nights: "4–7 nights" },
    intro:
      "Bwejuu sits just north of Paje on the same long south-east coast. It shares Paje's white sand and turquoise lagoon but is noticeably calmer, with coconut palms, a village feel and a handful of boutique hotels and beach restaurants.",
    whyPeopleLoveIt:
      "Long beach walks, space, palm trees and peace — with the option to pop into Paje for cafés, kitesurfing or a night out.",
    whatMakesItDifferent:
      "It offers the south-east coast's scenery without Paje's crowds and noise, and is a little closer to Michamvi Pingwe and The Rock.",
    whoShouldStay:
      "Couples, beach walkers, and visitors who want a quiet south-east base within easy reach of Paje.",
    whoMightNot:
      "Anyone who wants nightlife on the doorstep or the freedom to swim at any time of day.",
    misunderstandings:
      "Swimming is tide-dependent, just as in Paje and Jambiani. At low tide the lagoon is very shallow and you will walk a long way to reach deeper water.",
    beach:
      "Broad white sand, coconut palms and a shallow lagoon; best swimming around high tide.",
    eatingOut:
      "A modest choice of beach restaurants and hotel dining, with Paje's much wider selection a short taxi or bike ride away.",
    notes: [],
    tradeOff: "Limited nightlife and tide-dependent swimming.",
  },
  {
    key: "pongwe",
    name: "Pongwe",
    rank: 9,
    category: "Best for seclusion and intimate beach retreats",
    coast: "Central east coast",
    lat: -6.035,
    lng: 39.415,
    summary:
      "A small, sheltered bay with a handful of beachfront hotels — about as close to a desert-island feel as Zanzibar gets.",
    bestFor: ["couples", "honeymoon", "peace", "nature"],
    panel: { swimming: "high-tide", tides: "strong", atmosphere: "peaceful", nightlife: "low", restaurants: "limited", budget: "$$", accommodation: "limited", nights: "3–5 nights" },
    intro:
      "Pongwe is a quiet little bay on the central east coast with just a few small hotels on the beach. It is the place to come if you want a book, a hammock and almost nothing else.",
    whyPeopleLoveIt:
      "Seclusion, beautiful tropical scenery and an intimate scale. Many guests barely leave their hotel, which is the point.",
    whatMakesItDifferent:
      "The bay is more sheltered and enclosed than the long open beaches around it, giving it a calm, private feel.",
    whoShouldStay:
      "Couples, honeymooners and anyone who wants complete relaxation.",
    whoMightNot:
      "Families who need entertainment, travellers who want to explore restaurants, or anyone who would feel isolated.",
    misunderstandings:
      "It is still the east coast: swimming changes with the tide, and at low tide the water retreats. Choose a hotel whose position on the bay suits how you want to swim.",
    beach:
      "A small, picturesque bay with white sand; the best swimming is around high tide.",
    eatingOut:
      "Limited. Expect to eat at your hotel or neighbouring hotels; independent restaurants are few.",
    notes: [],
    tradeOff: "Very few places to eat outside the hotels, and little to do beyond the beach.",
  },
  {
    key: "pwani-mchangani",
    name: "Pwani Mchangani",
    rank: 10,
    category: "Best for quieter resort holidays",
    coast: "North-east coast",
    lat: -5.94,
    lng: 39.36,
    summary:
      "A quieter north-east stretch between Matemwe and Kiwengwa with comfortable beachfront resorts and a traditional village behind them.",
    bestFor: ["families", "couples", "resort", "peace"],
    panel: { swimming: "tide-dependent", tides: "strong", atmosphere: "peaceful", nightlife: "low", restaurants: "limited", budget: "$$", accommodation: "good", nights: "5–7 nights" },
    intro:
      "Pwani Mchangani lies between Matemwe and Kiwengwa on the north-east coast. It is mostly a resort coast, with a handful of established hotels along a beautiful beach and a traditional village inland.",
    whyPeopleLoveIt:
      "A calm, comfortable resort holiday on a lovely stretch of beach, without the larger crowds of Kiwengwa or the activity of the north.",
    whatMakesItDifferent:
      "It is quieter than Kiwengwa and less boutique than Matemwe — a middle ground for people who want resort comforts in a peaceful setting.",
    whoShouldStay:
      "Families and couples who want to relax at a good beachfront resort.",
    whoMightNot:
      "Anyone who wants restaurants, nightlife or a village to wander in the evening.",
    misunderstandings:
      "Like the rest of this coast, the tidal range is large; at low tide the sea retreats far over the reef flat.",
    beach:
      "Long, beautiful white sand with extensive tidal changes; swimming is best around high tide.",
    eatingOut:
      "Limited outside the resorts. Plan to eat where you stay and take a taxi for the occasional night out.",
    notes: [],
    tradeOff: "Resort-focused and quiet in the evenings, with strong tides.",
  },
  {
    key: "dongwe",
    name: "Dongwe",
    rank: 11,
    category: "Best for private villas and luxury accommodation",
    coast: "South-east coast",
    lat: -6.2,
    lng: 39.525,
    summary:
      "A quiet strip between Bwejuu and Michamvi Pingwe with exclusive beachfront hotels, private villas and romantic dining.",
    bestFor: ["honeymoon", "luxury", "couples", "peace"],
    panel: { swimming: "tide-dependent", tides: "strong", atmosphere: "peaceful", nightlife: "low", restaurants: "limited", budget: "$$$", accommodation: "limited", nights: "4–6 nights" },
    intro:
      "Dongwe is a short, quiet stretch of the south-east coast between Bwejuu and Michamvi Pingwe. It is known for upmarket resorts and private villas, and for privacy.",
    whyPeopleLoveIt:
      "Exclusive accommodation, quiet beaches and a strong sense of privacy — ideal for a honeymoon or a special trip.",
    whatMakesItDifferent:
      "There is little village life to speak of along the beach: this is a coast of luxury hotels and villas, with Paje and The Rock within reach by taxi.",
    whoShouldStay:
      "Honeymooners, luxury travellers and couples on a romantic escape.",
    whoMightNot:
      "Budget travellers, families wanting entertainment, or anyone who wants to stroll out to independent bars.",
    misunderstandings:
      "Luxury does not change the tide. Swimming is tide-dependent, so the hotel pool matters.",
    beach:
      "Quiet white sand and a shallow lagoon, with swimming best around high tide.",
    eatingOut:
      "Mainly in hotels, which tend to have strong restaurants. A few independent places nearby; The Rock and Paje are a taxi ride away.",
    notes: [],
    tradeOff: "Expensive and quiet, with very little independent nightlife.",
  },
  {
    key: "kizimkazi",
    name: "Kizimkazi",
    rank: 12,
    category: "Best for nature, remote stays and sunsets",
    coast: "South and south-west coast",
    lat: -6.43,
    lng: 39.47,
    summary:
      "Fishing villages, rocky coves and remote lodges on Zanzibar's southern tip — known for dolphins and quiet sunsets.",
    bestFor: ["nature", "wildlife", "sunsets", "peace", "village"],
    panel: { swimming: "tide-dependent", tides: "moderate", atmosphere: "peaceful", nightlife: "low", restaurants: "limited", budget: "$$", accommodation: "limited", nights: "2–4 nights" },
    intro:
      "Kizimkazi is at the southern end of the island, a pair of traditional fishing villages (Dimbani and Mkunguni) and a rocky, cove-lined coast. It is remote and unhurried, with lodges that make the most of the views.",
    whyPeopleLoveIt:
      "A sense of being off the beaten track, beautiful sunsets from west-facing spots, and the chance to see dolphins in the wild.",
    whatMakesItDifferent:
      "It has small coves and rocky sections rather than one long beach, and conditions vary enormously from one property to the next. The village of Kizimkazi Dimbani is also home to one of the oldest known mosques in East Africa.",
    whoShouldStay:
      "Independent travellers, nature lovers, and anyone who wants a few quiet nights somewhere different.",
    whoMightNot:
      "Visitors who want a classic sandy beach holiday, nightlife or plenty of restaurants.",
    misunderstandings:
      "Dolphin trips here are popular, but some operators chase pods and encourage swimmers to jump in on top of them, which stresses the animals. If you go, choose a responsible operator who keeps a distance, limits time with the pod and never lets boats box the dolphins in.",
    beach:
      "Varies by property: small sandy coves, rocky shore and tidal flats. Check photos and reviews of the exact beach before booking.",
    eatingOut:
      "Limited — mostly lodge restaurants and a few local places in the villages.",
    notes: [
      {
        title: "Responsible dolphin watching",
        body: "Early-morning boat trips leave from Kizimkazi to look for bottlenose and humpback dolphins. Good practice: no chasing, no cutting across a pod's path, short viewing times and no forced swim-with sessions.",
      },
    ],
    tradeOff: "Remote, with limited restaurants and very variable beaches.",
  },
  {
    key: "uroa",
    name: "Uroa",
    rank: 13,
    category: "Best for affordable, peaceful resort holidays",
    coast: "Central east coast",
    lat: -6.09,
    lng: 39.45,
    summary:
      "A traditional village on the central east coast with good-value resorts, very quiet evenings and dramatic tides.",
    bestFor: ["budget", "resort", "peace", "families", "village"],
    panel: { swimming: "tide-dependent", tides: "strong", atmosphere: "peaceful", nightlife: "low", restaurants: "limited", budget: "$", accommodation: "good", nights: "4–7 nights" },
    intro:
      "Uroa is a traditional fishing village on the central east coast. Its resorts often offer good value, it is relatively close to Stone Town and the airport, and evenings are very quiet.",
    whyPeopleLoveIt:
      "Value for money, a calm atmosphere and a central location that makes day trips easy.",
    whatMakesItDifferent:
      "It is less developed than Kiwengwa to the north and less sociable than Paje to the south — a simple, peaceful resort base.",
    whoShouldStay:
      "Budget-conscious travellers who want a resort holiday, and families who mainly use the hotel pool.",
    whoMightNot:
      "Anyone who wants independent restaurants, nightlife or swimming at any time of day.",
    misunderstandings:
      "Tidal changes are dramatic; at low tide the sea can be a long way out. Beachfront swimming conditions vary between properties.",
    beach:
      "Wide white sand with a large tidal range; best swimming around high tide.",
    eatingOut:
      "Limited. A few local and beach restaurants exist, but most visitors eat at their resort.",
    notes: [],
    tradeOff: "Few restaurants and very little to do in the evening.",
  },
  {
    key: "stone-town",
    name: "Stone Town",
    rank: 14,
    category: "Best for history, culture and food",
    coast: "West coast (Zanzibar City)",
    lat: -6.162,
    lng: 39.189,
    summary:
      "The UNESCO-listed old town of Zanzibar City: carved doors, markets, rooftop restaurants and the Forodhani waterfront.",
    bestFor: ["culture", "restaurants", "shopping", "walkability", "first-timers"],
    panel: { swimming: "limited", tides: "moderate", atmosphere: "lively", nightlife: "medium", restaurants: "excellent", budget: "$$", accommodation: "wide", nights: "1–3 nights" },
    intro:
      "Stone Town ranks last here only because this is a beach comparison. For culture, history and food it would rank first. It is the historic heart of Zanzibar City, a UNESCO World Heritage Site of narrow lanes, merchants' houses and carved wooden doors, and it is well worth a night or two at the start or end of a trip.",
    whyPeopleLoveIt:
      "Wandering the lanes, the famous carved doors, the markets, rooftop dinners at sunset and the evening food stalls at Forodhani Gardens on the waterfront.",
    whatMakesItDifferent:
      "It is a city, not a beach resort. The appeal is architecture, history, shopping and food, with Swahili, Arab, Indian and European influences layered over centuries of trade.",
    whoShouldStay:
      "Anyone interested in culture and history, food lovers, shoppers, and visitors with an early or late flight who want a short stay close to the airport.",
    whoMightNot:
      "Visitors who want a beach holiday. The town's shoreline is not a place to swim and sunbathe, and it can be hot, busy and noisy.",
    misunderstandings:
      "Stone Town should not be marketed as a beach destination. Allow one to three nights and then head to the coast. The lanes are a maze — that is half the fun — but a local guide on the first day helps you get your bearings and understand the history.",
    beach:
      "Not a swimming destination. Enjoy the waterfront at sunset, and take a boat trip (for example to Prison Island) for time on the water.",
    eatingOut:
      "Excellent: rooftop restaurants, historic tea houses, local Zanzibari cafés and the Forodhani night food market.",
    notes: [
      {
        title: "What to see",
        body: "The carved Zanzibar doors throughout the old town, Darajani market, the Old Fort, the Forodhani waterfront at sunset, the Anglican Cathedral built on the site of the former slave market (with its memorial and exhibition), and the town's museums and old merchants' houses.",
      },
    ],
    tradeOff: "No beach — it is a city stay for culture and food.",
  },
];

export const DEFAULT_DESTINATIONS: Destination[] = COPY.map((copy) => ({
  ...copy,
  photos: DESTINATION_PHOTOS[copy.key] ?? [],
  restaurants: RESTAURANTS[copy.key] ?? [],
  stays: STAYS[copy.key] ?? [],
}));
