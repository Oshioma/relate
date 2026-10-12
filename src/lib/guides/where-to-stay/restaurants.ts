import type { RestaurantRecommendation } from "./types";

// RESTAURANT RECOMMENDATIONS — two per destination, chosen on editorial merit.
//
// Researched October 2026 from recent public reviews (Tripadvisor, Google
// summaries, booking sites, venues' own pages). The "why" lines summarise
// what recent reviewers consistently say; they are not first-hand visits and
// never quote ratings or review counts. Where something still needs checking
// before relying on it, the card shows `verificationNote`.
//
// `listing` points at the place's Mzungu Zanzibar directory entry by slug.
// When that entry exists, the card uses its photo, location and community
// reviews and links to it; when it does not, the card links to the venue's
// own website or directions and invites the business to list itself.

export const RESTAURANTS: Record<string, RestaurantRecommendation[]> = {
  kendwa: [
    {
      name: "Fisherman Local Restaurant",
      cuisine: "Local Zanzibari and seafood",
      price: "$",
      why: "A plain back-street restaurant that reviewers repeatedly say beats the beach restaurants on food and value. Recent diners praise fresh seafood curry, grilled octopus and prawn masala at very fair prices. Expect a simple setting and some waiting.",
      bestFor: ["Lunch", "Dinner", "Seafood", "Budget"],
      area: "Kendwa back street, inland from the beach",
    },
    {
      name: "Organzibar",
      listing: { kind: "business", slug: "organzibar" },
      cuisine: "Organic, healthy café food, juices and smoothies",
      price: "$$",
      why: "A small organic restaurant that cooks without seed oils, adds no sugar to its juices and aims to source most of its menu from its own farms. Reviewers consistently praise the fresh food, standout juices and friendly staff. It serves breakfast through to dinner, with takeaway and delivery.",
      bestFor: ["Breakfast", "Lunch", "Healthy food", "Vegetarian"],
      area: "Kendwa main road",
      website: "https://www.organzibar.com/",
      social: "https://www.instagram.com/organzibar/",
      disclosure: "Organzibar is connected to the people behind Mzungu Zanzibar.",
      verificationNote: "Listed as cash only — check before you go.",
    },
  ],
  nungwi: [
    {
      name: "Mama Mia",
      cuisine: "Italian: pizza, pasta, seafood and gelato",
      price: "$$",
      why: "A long-running beachfront Italian with a terrace and tables on the sand, popular at sunset. Reviewers praise the pizza, seafood dishes and gelato, and the generous portions. Prices are above average for Nungwi and it gets busy at peak times.",
      bestFor: ["Sunset", "Dinner", "Families"],
      area: "Nungwi beachfront",
    },
    {
      name: "Sexy Fish",
      cuisine: "Seafood with African and European influences",
      price: "$$$",
      why: "A dinner-only seafood restaurant at The Z Hotel, with tables on the sand or on an upper deck facing the sea. Recent reviewers consistently praise the seafood, the elegant setting and the friendly staff. It is one of Nungwi's special-occasion choices; booking is recommended.",
      bestFor: ["Romantic dinner", "Seafood", "Special occasions"],
      area: "Nungwi beach, at The Z Hotel",
      website: "https://www.thez2.com/facilities/restaurants/sexy-fish",
    },
  ],
  paje: [
    {
      name: "Mapacha Food Court",
      cuisine: "Street-food court: seafood, pizza, sushi, falafel, salads and bakery",
      price: "$",
      why: "A casual food court on Paje's main roundabout where several stalls cook different cuisines to order. Recent reviewers praise friendly staff, fair prices and generous portions. It is a good choice for groups with mixed tastes, and for vegetarian, vegan or gluten-free diners.",
      bestFor: ["Lunch", "Dinner", "Groups", "Vegetarian"],
      area: "Paje main roundabout, on the main road",
    },
    {
      name: "ZanziBarista",
      cuisine: "Speciality coffee, brunch, seafood and cocktails",
      price: "$$",
      why: "A coffee shop, restaurant and beach bar right on Paje beach, from breakfast through to evening drinks. Reviewers consistently praise the sea view, warm and efficient staff and the seafood, and many come back daily for coffee. It costs a little more than places nearby.",
      bestFor: ["Breakfast", "Coffee", "Remote working", "Sundowners"],
      area: "Paje beachfront",
    },
  ],
  jambiani: [
    {
      name: "Fadhil Restaurant",
      cuisine: "Local Zanzibari and seafood",
      price: "$",
      why: "A small family-run restaurant in a village alley, with a handwritten daily menu and a few tables on a sand floor. Reviewers praise the seafood, large portions and fair prices. Service is slow, so locals advise ordering a few hours ahead; no alcohol is served.",
      bestFor: ["Dinner", "Local food", "Seafood", "Budget"],
      area: "Jambiani village, a short walk from the beach",
      verificationNote: "Our research found few reviews from 2025–26. Please confirm it is open before making a special trip.",
    },
    {
      name: "Ocean Boho House Restaurant",
      cuisine: "International with fresh seafood and good vegetarian options",
      price: "$$",
      why: "A guesthouse restaurant with bohemian décor, a lush garden and live music. Reviewers praise fresh ingredients that work for vegetarians and meat-eaters alike, and good value. Service is usually warm and attentive.",
      bestFor: ["Dinner", "Vegetarian", "Live music"],
      area: "Jambiani",
    },
  ],
  matemwe: [
    {
      name: "Marlin Restaurant",
      cuisine: "Swahili and local seafood",
      price: "$",
      why: "A small local restaurant with a Swahili menu that reviewers often call a hidden gem. They consistently praise the fresh seafood — the octopus in particular — friendly service and very good value. Vegetarian and vegan options are available.",
      bestFor: ["Lunch", "Dinner", "Local food", "Seafood"],
      area: "Matemwe village",
      verificationNote: "Reported to be cash only.",
    },
    {
      name: "Zanzibar Sunrise at Bandas Restaurant",
      listing: { kind: "stay", slug: "zanzibar-sunrise-at-bandas" },
      cuisine: "Seafood and international",
      price: "$$",
      why: "A beachside lodge restaurant with live music on set nights. Recent reviewers praise the seafood, the breakfasts, the friendly staff and the relaxed setting.",
      bestFor: ["Beachfront dinner", "Breakfast", "Live music"],
      area: "Matemwe beachfront",
      website: "https://zanzibarsunrise.com/",
    },
  ],
  michamvi: [
    {
      name: "Kae Funk Sunset Beach Bar",
      cuisine: "Beach bar: drinks and simple food",
      price: "$$",
      why: "Go for the sunset rather than the food. Reviewers consistently praise the view, the beach setting and the party atmosphere with DJs, while rating the food as ordinary. It can be crowded and service slow.",
      bestFor: ["Sunset", "Drinks", "Nightlife"],
      area: "Michamvi Kae, on the west-facing sunset side",
    },
    {
      name: "Baladin Zanzibar Beach Hotel & Restaurant",
      cuisine: "Italian (house-made pizza and pasta), seafood and Baladin craft beer",
      price: "$$",
      why: "A beachfront hotel restaurant from the Italian Baladin brewery, serving its craft beer on draught alongside house-made pizza, pasta and seafood. Recent reviewers praise the varied menu and quality ingredients and describe it as a romantic dinner spot. It is a few steps from The Rock.",
      bestFor: ["Lunch", "Romantic dinner", "Craft beer"],
      area: "Michamvi Pingwe beach (east side)",
      verificationNote: "Some listings give Michamvi Kae as its postal area, but it is on the Pingwe side, not at Kae's sunset beach.",
    },
  ],
  kiwengwa: [
    {
      name: "La Capannina Zanzibar",
      cuisine: "Italian: homemade pasta, pizza and seafood",
      price: "$$",
      why: "A small Italian restaurant whose owners and Italian chef reviewers describe as warm and attentive. Diners consistently praise the fresh homemade pasta, pizza and desserts, at prices seen as reasonable for the quality. It fills up, so book ahead for dinner.",
      bestFor: ["Dinner", "Romantic dinner", "Italian"],
      area: "Kiwengwa (easy to miss from the road)",
      verificationNote: "One listing showed it as temporarily closed despite July 2026 reviews. Please confirm before visiting.",
    },
    {
      name: "La Base JungleKite",
      cuisine: "Italian and seafood",
      price: "$$",
      why: "A beachfront terrace restaurant at the JungleKite kitesurfing school that welcomes non-kiters too. Recent reviewers praise the Italian dishes, the seafood and the owners' hospitality. It is a relaxed lunch spot with a view of the kites.",
      bestFor: ["Lunch", "Beachfront", "Watching kitesurfers"],
      area: "Kiwengwa beachfront",
    },
  ],
  bwejuu: [
    {
      name: "Leo Beach Bar & Restaurant",
      cuisine: "Seafood, grills and local Zanzibari dishes",
      price: "$",
      why: "A casual beachfront spot whose reviewers single out the grilled fish, octopus and lobster, along with good cocktails and fresh juices. The welcome is warm and prices reasonable. It has fewer reviews than longer-established places, so treat it as a promising casual choice.",
      bestFor: ["Lunch", "Casual dinner", "Seafood"],
      area: "Bwejuu beachfront, by The African Paradise Beach Hotel",
    },
    {
      name: "Sahari Zanzibar",
      cuisine: "European, Asian and Zanzibari",
      price: "$$",
      why: "A boutique-hotel restaurant with dinner tables set around the pool and on the beach. Reviewers praise the friendly staff, the seafood platter and the pizza, and say dietary requests are handled well. It is pricier than the local places in Bwejuu or Paje.",
      bestFor: ["Romantic dinner", "Beachfront", "Dietary requirements"],
      area: "Bwejuu beachfront",
    },
  ],
  pongwe: [
    {
      name: "The Island – Pongwe Restaurant",
      cuisine: "Seafood-led international",
      price: "$$$",
      why: "A restaurant on a small coral-rock islet just off Pongwe beach, open to non-residents for lunch and dinner. Reviewers consistently describe the setting as spectacular and praise the fresh, well-presented seafood. Be ready to get your feet wet or take a boat at high tide.",
      bestFor: ["Lunch", "Romantic dinner", "Views"],
      area: "Just off Pongwe beach",
    },
    {
      name: "Pongwe Beach Hotel restaurant",
      cuisine: "Daily-changing seafood and Swahili cooking",
      price: "$$",
      why: "The hotel's oceanfront kitchen builds its menu around the morning catch and local produce. Its Swahili buffet and beach barbecue nights are open to non-residents who book ahead. Reviewers describe a quiet setting and helpful service.",
      bestFor: ["Swahili buffet", "Beach barbecue", "Dinner"],
      area: "Pongwe beachfront",
      website: "https://pongwe.com/dining/",
      verificationNote: "Buffet and barbecue nights are from the hotel's own website; check the current schedule when booking.",
    },
  ],
  "pwani-mchangani": [
    {
      name: "Blue Moon Villa Restaurant",
      cuisine: "Italian and African, with a focus on seafood",
      price: "$$",
      why: "A guesthouse restaurant a short walk from the sea. Reviewers consistently praise the lobster, octopus, prawns and mixed fish grill, and say the quiet setting suits families. Service and value both get strong marks.",
      bestFor: ["Lunch", "Dinner", "Seafood", "Families"],
      area: "Pwani Mchangani, a few minutes' walk from the beach",
    },
    {
      name: "The Breeze (TUI BLUE Bahari Zanzibar)",
      cuisine: "Seafood-focused à la carte",
      price: "$$$",
      why: "The resort's speciality restaurant for candlelit dinners. Reviewers praise the seafood platter, fish of the day and attentive staff. It opens for dinner on set nights and needs a reservation.",
      bestFor: ["Romantic dinner", "Special occasions", "Seafood"],
      area: "Pwani Mchangani beachfront, at TUI BLUE Bahari",
      verificationNote: "We could not confirm that non-residents can book. Ask the resort before planning a visit.",
    },
  ],
  dongwe: [
    {
      name: "Blue Pontile Dongwe",
      cuisine: "Italian-Mediterranean seafood",
      price: "$$$",
      why: "A restaurant at the end of Dongwe Club's long jetty over the lagoon. Reviewers consistently praise the setting, the shellfish pasta and the lobster, and describe it as romantic. Staff are often called attentive and welcoming.",
      bestFor: ["Romantic dinner", "Sunset", "Special occasions"],
      area: "Dongwe, at the end of Dongwe Club's jetty",
    },
    {
      name: "Fishers Restaurant",
      cuisine: "Fresh local seafood",
      price: "$",
      why: "A small, family-run beach spot serving fish straight from the boats at around half resort prices. The setting is simple but atmospheric. Reviews are mixed on service and food can take a long time.",
      bestFor: ["Lunch", "Local seafood", "Budget"],
      area: "Dongwe beach",
      verificationNote: "Cash only. Reviews are mixed: order bottled water you open yourself.",
    },
  ],
  kizimkazi: [
    {
      name: "Fahari Off The Grid",
      listing: { kind: "business", slug: "fahari-off-the-grid" },
      cuisine: "Caribbean-influenced seafood, with vegan and gluten-free options",
      price: "$$",
      why: "A beachfront restaurant where every table faces west for the sunset. Reviewers praise the ceviche, tacos and tuna, the from-scratch sauces and warm hosts. It has a strong sustainability focus.",
      bestFor: ["Sunset", "Dinner", "Lunch", "Vegan"],
      area: "Kizimkazi Mkunguni beach",
      website: "https://faharilifestyle.com/",
      social: "https://www.instagram.com/faharioffthegrid/",
      verificationNote: "Opening days have changed several times — check before you go.",
    },
    {
      name: "Kameleon Blue Bar & Restaurant",
      cuisine: "Italian and Mediterranean, plus Swahili dishes",
      price: "$$",
      why: "A garden bar and restaurant with a pool at a small, independent arts lodge. Reviewers praise the seafood platter and the Zanzibari calamari curry, and several recommend the Swahili dishes. It hosts live-music evenings.",
      bestFor: ["Dinner", "Live music", "Relaxed drinks"],
      area: "Kizimkazi, about 13 minutes' walk from the beach",
      verificationNote: "Roads nearby are unlit; take a taxi after dark.",
    },
  ],
  uroa: [
    {
      name: "Kambakocho Bar & Beach Restaurant",
      cuisine: "Seafood, pizza, pasta and cocktails",
      price: "$$",
      why: "A beachfront restaurant with ocean views. Reviewers praise the grilled lobster, octopus carpaccio and cocktails, and the multilingual staff. Recurring complaints are slow service and billing, so check your bill before paying.",
      bestFor: ["Sunset drinks", "Dinner", "Seafood"],
      area: "Uroa beachfront",
      verificationNote: "We could not find dated reviews from the last year. Please confirm it is open.",
    },
    {
      name: "Zan Taste Restaurant",
      cuisine: "Local Zanzibari, seafood, juices and smoothies",
      price: "$",
      why: "A small, locally run spot praised for octopus, fresh fish, juices and smoothies at low prices for the area. Staff are consistently described as friendly.",
      bestFor: ["Lunch", "Local food", "Budget"],
      area: "Uroa village",
      verificationNote: "Reported to be cash only and closed on Mondays. We could not find dated reviews from the last year.",
    },
  ],
  "stone-town": [
    {
      name: "Lukmaan Restaurant",
      cuisine: "Zanzibari canteen: biryani, pilau, curries, fried fish and fresh juices",
      price: "$",
      why: "Widely described as one of the best places in Stone Town for authentic local food at low prices. You choose from counters of curries, fish and meat and pay up front. It is busy and hurried; check prices before ordering.",
      bestFor: ["Lunch", "Local food", "Budget"],
      area: "Stone Town old town",
      verificationNote: "Cash only.",
    },
    {
      name: "6 Degrees South",
      listing: { kind: "business", slug: "6-degrees-south" },
      cuisine: "Modern grill: seafood platters, steaks and coconut fish curry",
      price: "$$",
      why: "A waterfront grill and wine bar in Shangani whose rooftop terrace is popular at sunset. Recent reviewers praise the seafood platters, sea views and lively atmosphere. Service can be slow when busy and terrace seating is limited, so book ahead.",
      bestFor: ["Sunset", "Cocktails", "Dinner"],
      area: "Shangani waterfront, Stone Town",
      website: "http://www.6degreessouth.co.tz/",
    },
  ],
};

