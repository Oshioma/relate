import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";

// HOTEL PHOTOGRAPHS — each venue's own promotional photos, taken from its
// official website and shared here to promote it, credited to the venue
// and linked to the page they came from. The page says so, and that any
// venue can ask for a photo to be taken down (see VENUE_PHOTO_NOTE).
// Files live in public/guides/boutique-hotels/ at 640px and 1280px wide;
// `src` names the 1280px copy and GuideImage adds the 640px one to srcset.

const COURTESY = { licence: "Courtesy of the venue", licenceUrl: null, identificationStatus: "secure" } as const;

export const HOTEL_PHOTOS: Record<string, GuidePhoto[]> = {
  "passion": [
    { src: "/guides/boutique-hotels/passion-1-1280.webp", alt: "Aerial view of the hotel's white buildings among palms, right above Jambiani's beach and turquoise lagoon", caption: "The hotel from the air, above Jambiani's beach and lagoon.", credit: "Passion Boutique Hotel", sourceUrl: "https://passion-zanzibar.com/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/passion-2-1280.webp", alt: "Aerial view of the hotel's pool and terraces among palm trees", caption: "The pool and garden terraces.", credit: "Passion Boutique Hotel", sourceUrl: "https://passion-zanzibar.com/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/passion-3-1280.webp", alt: "A guest room opening onto a balcony with a lounger and sea views through the palms", caption: "A Superior room's balcony, looking out to the ocean.", credit: "Passion Boutique Hotel", sourceUrl: "https://passion-zanzibar.com/", width: 1280, height: 854, ...COURTESY },
    { src: "/guides/boutique-hotels/passion-4-1280.webp", alt: "Seafood pasta with grilled prawns and a glass of white wine on the restaurant table", caption: "From the restaurant: seafood pasta with grilled prawns.", credit: "Passion Boutique Hotel", sourceUrl: "https://passion-zanzibar.com/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/passion-5-1280.webp", alt: "The open-air restaurant and bar beside the pool", caption: "The open-air restaurant and bar beside the pool.", credit: "Passion Boutique Hotel", sourceUrl: "https://passion-zanzibar.com/", width: 1280, height: 853, ...COURTESY },
  ],
  "kilindi": [
    { src: "/guides/boutique-hotels/kilindi-1-1280.webp", alt: "Kilindi's infinity pool and deck at sunset, framed by palms", caption: "The main pool deck at sunset.", credit: "Kilindi Zanzibar", sourceUrl: "https://elewanacollection.com/kilindi-zanzibar/at-a-glance", width: 1280, height: 613, ...COURTESY },
    { src: "/guides/boutique-hotels/kilindi-2-1280.webp", alt: "A white domed pavilion with open shutters behind its private plunge pool", caption: "One of the domed pavilions and its private plunge pool.", credit: "Kilindi Zanzibar", sourceUrl: "https://elewanacollection.com/kilindi-zanzibar/at-a-glance", width: 390, height: 290, ...COURTESY },
    { src: "/guides/boutique-hotels/kilindi-3-1280.webp", alt: "A white-domed pavilion set among bamboo and tropical gardens", caption: "A pavilion in the gardens.", credit: "Kilindi Zanzibar", sourceUrl: "https://elewanacollection.com/kilindi-zanzibar/at-a-glance", width: 648, height: 440, ...COURTESY },
    { src: "/guides/boutique-hotels/kilindi-4-1280.webp", alt: "A pavilion bedroom with a draped bed and arched openings to the plunge pool and sea", caption: "Inside a pavilion: arched openings to the sea.", credit: "Kilindi Zanzibar", sourceUrl: "https://elewanacollection.com/kilindi-zanzibar/at-a-glance", width: 648, height: 440, ...COURTESY },
    { src: "/guides/boutique-hotels/kilindi-5-1280.webp", alt: "Aerial view of the estate's gardens running down to the beach and turquoise water", caption: "The estate's gardens above the beach at Kendwa.", credit: "Kilindi Zanzibar", sourceUrl: "https://elewanacollection.com/kilindi-zanzibar/at-a-glance", width: 648, height: 440, ...COURTESY },
  ],
  "amani": [
    { src: "/guides/boutique-hotels/amani-1-1280.webp", alt: "The hotel pool under palm trees, with thatched umbrellas on Paje beach beyond", caption: "The pool, with the beach just beyond.", credit: "Amani Boutique Hotel", sourceUrl: "https://www.amanizanzibar.com/", width: 1280, height: 854, ...COURTESY },
    { src: "/guides/boutique-hotels/amani-2-1280.webp", alt: "A thatched umbrella and two loungers on white sand facing the turquoise sea", caption: "Loungers on the hotel's stretch of Paje beach.", credit: "Amani Boutique Hotel", sourceUrl: "https://www.amanizanzibar.com/", width: 1280, height: 854, ...COURTESY },
    { src: "/guides/boutique-hotels/amani-3-1280.webp", alt: "The thatched restaurant lit up at dusk at the end of a garden path", caption: "The restaurant at dusk.", credit: "Amani Boutique Hotel", sourceUrl: "https://www.amanizanzibar.com/", width: 1280, height: 843, ...COURTESY },
    { src: "/guides/boutique-hotels/amani-4-1280.webp", alt: "A bedroom with a four-poster bed draped in white netting and a balcony", caption: "A room with a four-poster bed and balcony.", credit: "Amani Boutique Hotel", sourceUrl: "https://www.amanizanzibar.com/", width: 1280, height: 890, ...COURTESY },
    { src: "/guides/boutique-hotels/amani-5-1280.webp", alt: "A canopied dinner table on the beach lit by lanterns at twilight", caption: "A private dinner set up on the beach.", credit: "Amani Boutique Hotel", sourceUrl: "https://www.amanizanzibar.com/", width: 1280, height: 854, ...COURTESY },
  ],
  "zanzibari": [
    { src: "/guides/boutique-hotels/zanzibari-1-1280.webp", alt: "Aerial view of thatched cottages, plunge pools and palms above the shore", caption: "Cottages and plunge pools above the coral shore.", credit: "The Zanzibari", sourceUrl: "https://www.thezanzibari.com/", width: 1280, height: 854, ...COURTESY },
    { src: "/guides/boutique-hotels/zanzibari-2-1280.webp", alt: "A free-form pool on a stone terrace overlooking the turquoise sea", caption: "The pool terrace overlooking the sea.", credit: "The Zanzibari", sourceUrl: "https://www.thezanzibari.com/", width: 1280, height: 960, ...COURTESY },
    { src: "/guides/boutique-hotels/zanzibari-3-1280.webp", alt: "Aerial view of the hotel's gardens and buildings along the coast", caption: "The hotel's gardens along the coast, from the air.", credit: "The Zanzibari", sourceUrl: "https://www.thezanzibari.com/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/boutique-hotels/zanzibari-4-1280.webp", alt: "A bed decorated with petals, with the pool and sea through the window", caption: "A sea-view room.", credit: "The Zanzibari", sourceUrl: "https://www.thezanzibari.com/", width: 1280, height: 872, ...COURTESY },
    { src: "/guides/boutique-hotels/zanzibari-5-1280.webp", alt: "A suite lounge with wooden furniture opening onto a terrace and pool", caption: "A suite's lounge, opening onto the terrace.", credit: "The Zanzibari", sourceUrl: "https://www.thezanzibari.com/", width: 1280, height: 720, ...COURTESY },
  ],
  "xanadu": [
    { src: "/guides/boutique-hotels/xanadu-1-1280.webp", alt: "Aerial view of a white domed villa with a curved private pool among trees", caption: "One of the domed villas and its pool, from above.", credit: "Xanadu Luxury Villas & Retreat", sourceUrl: "https://xanadu-villas.com/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/boutique-hotels/xanadu-2-1280.webp", alt: "A sculptural white rooftop with a circular pool, seen from above", caption: "A rooftop pool set into the villa's curved architecture.", credit: "Xanadu Luxury Villas & Retreat", sourceUrl: "https://xanadu-villas.com/", width: 1280, height: 731, ...COURTESY },
    { src: "/guides/boutique-hotels/xanadu-3-1280.webp", alt: "A plunge pool leading between white columns to a domed villa", caption: "A villa courtyard and pool.", credit: "Xanadu Luxury Villas & Retreat", sourceUrl: "https://xanadu-villas.com/", width: 1280, height: 731, ...COURTESY },
    { src: "/guides/boutique-hotels/xanadu-4-1280.webp", alt: "An open-sided lounge with arches, cushions and garden views", caption: "An open-air villa lounge.", credit: "Xanadu Luxury Villas & Retreat", sourceUrl: "https://xanadu-villas.com/", width: 1280, height: 731, ...COURTESY },
    { src: "/guides/boutique-hotels/xanadu-5-1280.webp", alt: "Colourful local dishes served on a banana leaf with hibiscus flowers and coconuts", caption: "Zanzibari dishes from the kitchen.", credit: "Xanadu Luxury Villas & Retreat", sourceUrl: "https://xanadu-villas.com/", width: 1280, height: 731, ...COURTESY },
  ],
  "sharazad": [
    { src: "/guides/boutique-hotels/sharazad-1-1280.webp", alt: "Aerial view of thatched buildings, a pool and palms on Jambiani's beach", caption: "The hotel on Jambiani's beach, from the air.", credit: "Sharazād Boutique Hotel", sourceUrl: "https://www.sharazadzanzibar.com/", width: 1280, height: 723, ...COURTESY },
    { src: "/guides/boutique-hotels/sharazad-2-1280.webp", alt: "A small pool in a courtyard of thatched, white-columned buildings", caption: "One of the hotel's pools.", credit: "Sharazād Boutique Hotel", sourceUrl: "https://www.sharazadzanzibar.com/", width: 1280, height: 789, ...COURTESY },
    { src: "/guides/boutique-hotels/sharazad-3-1280.webp", alt: "A rope swing and day beds in a garden above the beach at dusk", caption: "The beachfront garden.", credit: "Sharazād Boutique Hotel", sourceUrl: "https://www.sharazadzanzibar.com/", width: 1280, height: 733, ...COURTESY },
    { src: "/guides/boutique-hotels/sharazad-4-1280.webp", alt: "A room with glass doors open to the beach and sea", caption: "A beachfront room.", credit: "Sharazād Boutique Hotel", sourceUrl: "https://www.sharazadzanzibar.com/", width: 1280, height: 790, ...COURTESY },
    { src: "/guides/boutique-hotels/sharazad-5-1280.webp", alt: "An open-sided thatched yoga shala with mats laid out", caption: "The yoga shala.", credit: "Sharazād Boutique Hotel", sourceUrl: "https://www.sharazadzanzibar.com/", width: 1280, height: 733, ...COURTESY },
  ],
  "pongwe-island": [
    { src: "/guides/boutique-hotels/pongwe-island-1-1280.webp", alt: "Aerial view of the tiny coral island and its thatched villas, surrounded by turquoise sea", caption: "The island from above, with its handful of villas.", credit: "The Island – Pongwe Lodge", sourceUrl: "https://www.theislandpongwe.com/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/pongwe-island-2-1280.webp", alt: "Aerial view of the islet in Pongwe Bay, close to the shore", caption: "The islet in Pongwe Bay, a canoe ride or low-tide walk from the shore.", credit: "The Island – Pongwe Lodge", sourceUrl: "https://www.theislandpongwe.com/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/boutique-hotels/pongwe-island-3-1280.webp", alt: "A thatched villa perched on coral rock above the water", caption: "A villa on the coral rock.", credit: "The Island – Pongwe Lodge", sourceUrl: "https://www.theislandpongwe.com/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/pongwe-island-4-1280.webp", alt: "Dining tables with white cloths on a terrace overlooking the sea", caption: "The ocean-view dining terrace.", credit: "The Island – Pongwe Lodge", sourceUrl: "https://www.theislandpongwe.com/", width: 1280, height: 854, ...COURTESY },
    { src: "/guides/boutique-hotels/pongwe-island-5-1280.webp", alt: "A villa bedroom with a draped bed and a window to the sea", caption: "Inside a villa.", credit: "The Island – Pongwe Lodge", sourceUrl: "https://www.theislandpongwe.com/", width: 1280, height: 854, ...COURTESY },
  ],
  "white-sand": [
    { src: "/guides/boutique-hotels/white-sand-1-1280.webp", alt: "Aerial view of the villas and gardens along Paje's white beach", caption: "The villas along Paje beach, from the air.", credit: "Zanzibar White Sand Luxury Villas & Spa", sourceUrl: "https://www.whitesandvillas.com/en", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/boutique-hotels/white-sand-2-1280.webp", alt: "A curved private pool beside a thatched villa in a tropical garden", caption: "A beachfront villa's private pool.", credit: "Zanzibar White Sand Luxury Villas & Spa", sourceUrl: "https://www.whitesandvillas.com/en", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/white-sand-3-1280.webp", alt: "Aerial view of a villa and its round pool among palms in evening light", caption: "A villa and pool at dusk.", credit: "Zanzibar White Sand Luxury Villas & Spa", sourceUrl: "https://www.whitesandvillas.com/en", width: 1280, height: 719, ...COURTESY },
    { src: "/guides/boutique-hotels/white-sand-4-1280.webp", alt: "A white bar counter under a timber roof hung with woven baskets", caption: "The bar.", credit: "Zanzibar White Sand Luxury Villas & Spa", sourceUrl: "https://www.whitesandvillas.com/en", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/white-sand-5-1280.webp", alt: "Solar panels on a thatched roof among the gardens", caption: "Solar panels on one of the roofs, part of the hotel's renewable-energy work.", credit: "Zanzibar White Sand Luxury Villas & Spa", sourceUrl: "https://www.whitesandvillas.com/en", width: 600, height: 400, ...COURTESY },
  ],
  "qambani": [
    { src: "/guides/boutique-hotels/qambani-1-1280.webp", alt: "An infinity pool above a white beach and turquoise water", caption: "The infinity pool above the beach.", credit: "Qambani Luxury Resort", sourceUrl: "https://www.qambani.com/", width: 1280, height: 851, ...COURTESY },
    { src: "/guides/boutique-hotels/qambani-2-1280.webp", alt: "A shaded terrace with cushioned seating looking out to sea", caption: "A villa terrace.", credit: "Qambani Luxury Resort", sourceUrl: "https://www.qambani.com/", width: 1280, height: 852, ...COURTESY },
    { src: "/guides/boutique-hotels/qambani-3-1280.webp", alt: "A large lounge with white sofas under a high thatched roof", caption: "A villa lounge.", credit: "Qambani Luxury Resort", sourceUrl: "https://www.qambani.com/", width: 1280, height: 852, ...COURTESY },
    { src: "/guides/boutique-hotels/qambani-4-1280.webp", alt: "A four-poster bed with white nets and garden views", caption: "A villa bedroom.", credit: "Qambani Luxury Resort", sourceUrl: "https://www.qambani.com/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/boutique-hotels/qambani-5-1280.webp", alt: "A long dining table set under a thatched roof", caption: "The dining room.", credit: "Qambani Luxury Resort", sourceUrl: "https://www.qambani.com/", width: 1280, height: 863, ...COURTESY },
  ],
  "upendo": [
    { src: "/guides/boutique-hotels/upendo-1-1280.webp", alt: "A beachfront infinity pool with palms and the sea beyond", caption: "The beachfront infinity pool.", credit: "Upendo Beach", sourceUrl: "https://upendozanzibar.com/villassuites/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/upendo-2-1280.webp", alt: "Aerial view of a white villa roof with a private plunge pool", caption: "A one-bedroom villa's rooftop plunge pool.", credit: "Upendo Beach", sourceUrl: "https://upendozanzibar.com/villassuites/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/boutique-hotels/upendo-3-1280.webp", alt: "A shaded daybed terrace under palms overlooking the beach", caption: "A villa terrace above the beach.", credit: "Upendo Beach", sourceUrl: "https://upendozanzibar.com/villassuites/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/upendo-4-1280.webp", alt: "A bedroom with a carved wooden bed and a ceiling fan", caption: "Inside a one-bedroom villa.", credit: "Upendo Beach", sourceUrl: "https://upendozanzibar.com/villassuites/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/upendo-5-1280.webp", alt: "A thatched wooden deck running along the beachfront", caption: "The beachfront deck.", credit: "Upendo Beach", sourceUrl: "https://upendozanzibar.com/villassuites/", width: 1280, height: 853, ...COURTESY },
  ],
  "zanzi": [
    { src: "/guides/boutique-hotels/zanzi-1-1280.webp", alt: "Aerial view of the long wooden jetty reaching out over turquoise water from the wooded shore", caption: "The jetty and villas from the air.", credit: "Zanzi Resort", sourceUrl: "https://www.zanziresort.com/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/boutique-hotels/zanzi-2-1280.webp", alt: "Aerial view of thatched villas with private pools among dense forest", caption: "Villas and their pools in the forest.", credit: "Zanzi Resort", sourceUrl: "https://www.zanziresort.com/", width: 1182, height: 628, ...COURTESY },
    { src: "/guides/boutique-hotels/zanzi-3-1280.webp", alt: "A villa terrace with armchairs and a private pool in a garden", caption: "A villa's pool and terrace.", credit: "Zanzi Resort", sourceUrl: "https://www.zanziresort.com/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/boutique-hotels/zanzi-4-1280.webp", alt: "The sun setting over the sea, seen from a wooden deck", caption: "Sunset from the jetty.", credit: "Zanzi Resort", sourceUrl: "https://www.zanziresort.com/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/boutique-hotels/zanzi-5-1280.webp", alt: "A bed decorated with flower petals spelling a welcome", caption: "A villa bedroom.", credit: "Zanzi Resort", sourceUrl: "https://www.zanziresort.com/", width: 1280, height: 960, ...COURTESY },
  ],
  "z-hotel": [
    { src: "/guides/boutique-hotels/z-hotel-1-1280.webp", alt: "The hotel's white buildings on Nungwi's white beach above turquoise water", caption: "The hotel on Nungwi beach.", credit: "The Z Hotel", sourceUrl: "https://www.thezhotel.com/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/z-hotel-2-1280.webp", alt: "A rooftop terrace with striped loungers at sunset", caption: "The rooftop at sunset.", credit: "The Z Hotel", sourceUrl: "https://www.thezhotel.com/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/z-hotel-3-1280.webp", alt: "The stilted Sexy Fish restaurant lit up on the beach at dusk", caption: "Sexy Fish, the beachfront restaurant.", credit: "The Z Hotel", sourceUrl: "https://www.thezhotel.com/", width: 1280, height: 853, ...COURTESY },
  ],
  "dhow-inn": [
    { src: "/guides/boutique-hotels/dhow-inn-1-1280.webp", alt: "A long pool lined with loungers and umbrellas, leading to an A-frame thatched building", caption: "The main pool.", credit: "Dhow Inn", sourceUrl: "https://www.dhowinn.com/", width: 1280, height: 780, ...COURTESY },
    { src: "/guides/boutique-hotels/dhow-inn-2-1280.webp", alt: "A terrace with a private plunge pool and day bed", caption: "A premium room's terrace plunge pool.", credit: "Dhow Inn", sourceUrl: "https://www.dhowinn.com/", width: 1024, height: 768, ...COURTESY },
    { src: "/guides/boutique-hotels/dhow-inn-3-1280.webp", alt: "Candlelit tables in the garden restaurant at dusk", caption: "The garden restaurant at dusk.", credit: "Dhow Inn", sourceUrl: "https://www.dhowinn.com/", width: 1280, height: 696, ...COURTESY },
  ],
  "neela": [
    { src: "/guides/boutique-hotels/neela-1-1280.webp", alt: "The white-washed entrance with a carved Zanzibari door, flanked by plants", caption: "The entrance and its carved door.", credit: "The Neela Boutique Hotel", sourceUrl: "https://neelacollection.com/", width: 1280, height: 854, ...COURTESY },
    { src: "/guides/boutique-hotels/neela-2-1280.webp", alt: "The white facade with wooden shutters against a blue sky", caption: "The restored house.", credit: "The Neela Boutique Hotel", sourceUrl: "https://neelacollection.com/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/neela-3-1280.webp", alt: "A lounge with blue cushions and a painted elephant artwork", caption: "A lounge.", credit: "The Neela Boutique Hotel", sourceUrl: "https://neelacollection.com/", width: 1280, height: 854, ...COURTESY },
  ],
  "kupaga": [
    { src: "/guides/boutique-hotels/kupaga-1-1280.webp", alt: "The thatched restaurant building beside the pool among palms", caption: "The restaurant and pool.", credit: "Kupaga Villas", sourceUrl: "https://www.kupagavillas.com/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/kupaga-2-1280.webp", alt: "A sunken lounge with cushions on a terrace overlooking the sea", caption: "The sea-view lounge.", credit: "Kupaga Villas", sourceUrl: "https://www.kupagavillas.com/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/kupaga-3-1280.webp", alt: "A bedroom with a four-poster bed and white nets", caption: "A room.", credit: "Kupaga Villas", sourceUrl: "https://www.kupagavillas.com/", width: 1280, height: 853, ...COURTESY },
  ],
  "casa-paradis": [
    { src: "/guides/boutique-hotels/casa-paradis-1-1280.webp", alt: "A pool among palms with the sea beyond and a cushion in the foreground", caption: "The pool, looking out to sea.", credit: "Casa Paradis", sourceUrl: "https://www.casaparadis.com/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/casa-paradis-2-1280.webp", alt: "A four-poster bed with colourful cushions and flower petals", caption: "A room.", credit: "Casa Paradis", sourceUrl: "https://www.casaparadis.com/", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/boutique-hotels/casa-paradis-3-1280.webp", alt: "A lounge nook with red cushions under wooden shutters", caption: "A lounge corner.", credit: "Casa Paradis", sourceUrl: "https://www.casaparadis.com/", width: 1280, height: 853, ...COURTESY },
  ],
  "ocean-boutique": [
    { src: "/guides/boutique-hotels/ocean-boutique-1-1280.webp", alt: "A thatched restaurant beside the pool on the beach", caption: "The beachfront restaurant and pool.", credit: "Ocean Boutique Hotel", sourceUrl: "https://www.oceanzanzibar.com/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/boutique-hotels/ocean-boutique-2-1280.webp", alt: "A white three-storey building with balconies behind a pool", caption: "The hotel and pool.", credit: "Ocean Boutique Hotel", sourceUrl: "https://www.oceanzanzibar.com/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/boutique-hotels/ocean-boutique-3-1280.webp", alt: "A balcony looking over the pool to the beach", caption: "A sea-view balcony.", credit: "Ocean Boutique Hotel", sourceUrl: "https://www.oceanzanzibar.com/", width: 1280, height: 720, ...COURTESY },
  ],
  "be-zanzibar": [
    { src: "/guides/boutique-hotels/be-zanzibar-1-1280.webp", alt: "A long pool with loungers in front of steep thatched roofs", caption: "The pool and thatched buildings.", credit: "Be Zanzibar", sourceUrl: "https://bezanzibar.com/", width: 1280, height: 855, ...COURTESY },
    { src: "/guides/boutique-hotels/be-zanzibar-2-1280.webp", alt: "The sea and a palm framed through an A-shaped thatched opening", caption: "A view framed by the A-frame architecture.", credit: "Be Zanzibar", sourceUrl: "https://bezanzibar.com/", width: 1280, height: 855, ...COURTESY },
    { src: "/guides/boutique-hotels/be-zanzibar-3-1280.webp", alt: "A bedroom under an A-shaped roof with a window to the sea", caption: "A room under the A-frame roof.", credit: "Be Zanzibar", sourceUrl: "https://bezanzibar.com/", width: 1280, height: 855, ...COURTESY },
  ],
};
