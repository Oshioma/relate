import type { GuidePhoto } from "@/lib/guides/where-to-stay/types";

// RESORT PHOTOGRAPHS — each venue's own promotional photos, taken from its
// official website and shared here to promote it, credited to the venue
// and linked to the page they came from. The page says so, and that any
// venue can ask for a photo to be taken down (see VENUE_PHOTO_NOTE).
// Files live in public/guides/luxury-resorts/ at 640px and 1280px wide.

const COURTESY = { licence: "Courtesy of the venue", licenceUrl: null, identificationStatus: "secure" } as const;

export const RESORT_PHOTOS: Record<string, GuidePhoto[]> = {
  "mnemba": [
    { src: "/guides/luxury-resorts/mnemba-1-1280.webp", alt: "Aerial view of Mnemba, a small forested island ringed by white sand and turquoise reef", caption: "Mnemba Island from the air, ringed by sand and reef.", credit: "&Beyond Mnemba Island", sourceUrl: "https://www.andbeyond.com/lodge-editorial/mnemba-island/gallery/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/luxury-resorts/mnemba-2-1280.webp", alt: "The thatched main lodge lit up at dusk, with chairs around a fire pit on the sand", caption: "The main lodge at dusk.", credit: "&Beyond Mnemba Island", sourceUrl: "https://www.andbeyond.com/lodge-editorial/mnemba-island/gallery/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/luxury-resorts/mnemba-3-1280.webp", alt: "A banda bedroom with a draped bed, timber walls and louvred openings to the forest", caption: "Inside a banda.", credit: "&Beyond Mnemba Island", sourceUrl: "https://www.andbeyond.com/lodge-editorial/mnemba-island/gallery/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/luxury-resorts/mnemba-4-1280.webp", alt: "A shaded beach lounge with day beds on the sand at the edge of the forest", caption: "A banda's private beach lounge.", credit: "&Beyond Mnemba Island", sourceUrl: "https://www.andbeyond.com/lodge-editorial/mnemba-island/gallery/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/luxury-resorts/mnemba-5-1280.webp", alt: "A green turtle nesting in the sand on Mnemba Island", caption: "A green turtle nesting on the island, which is monitored by the conservation team.", credit: "&Beyond Mnemba Island", sourceUrl: "https://www.andbeyond.com/lodge-editorial/mnemba-island/gallery/", width: 1280, height: 720, ...COURTESY },
  ],
  "zuri": [
    { src: "/guides/luxury-resorts/zuri-1-1280.webp", alt: "Aerial view of thatched bungalows in tropical gardens above Kendwa's white beach and turquoise sea", caption: "The resort's gardens above Kendwa beach.", credit: "Zuri Zanzibar", sourceUrl: "https://www.zurizanzibar.com/gallery/", width: 1200, height: 804, ...COURTESY },
    { src: "/guides/luxury-resorts/zuri-2-1280.webp", alt: "Aerial view of a long blue pool among palms beside the beach", caption: "The pool, close to the beach.", credit: "Zuri Zanzibar", sourceUrl: "https://www.zurizanzibar.com/gallery/", width: 1200, height: 800, ...COURTESY },
    { src: "/guides/luxury-resorts/zuri-3-1280.webp", alt: "A woven nest-shaped day bed among palms, looking out to a turquoise sea", caption: "A nest day bed above the beach.", credit: "Zuri Zanzibar", sourceUrl: "https://www.zurizanzibar.com/gallery/", width: 1200, height: 800, ...COURTESY },
    { src: "/guides/luxury-resorts/zuri-4-1280.webp", alt: "An open timber living room with sofas and wide doors onto the garden and sea", caption: "A villa living room.", credit: "Zuri Zanzibar", sourceUrl: "https://www.zurizanzibar.com/gallery/", width: 1200, height: 677, ...COURTESY },
    { src: "/guides/luxury-resorts/zuri-5-1280.webp", alt: "A bedroom with a draped bed and a timber deck looking into the garden", caption: "A bungalow bedroom.", credit: "Zuri Zanzibar", sourceUrl: "https://www.zurizanzibar.com/gallery/", width: 1280, height: 693, ...COURTESY },
  ],
  "residence": [
    { src: "/guides/luxury-resorts/residence-1-1280.webp", alt: "A long infinity pool reflecting palms and a thatched pavilion under a blue sky", caption: "The beachfront infinity pool.", credit: "The Residence Zanzibar", sourceUrl: "https://www.cenizaro.com/theresidence/zanzibar/gallery", width: 1280, height: 601, ...COURTESY },
    { src: "/guides/luxury-resorts/residence-2-1280.webp", alt: "Low villas among palms behind a white beach and turquoise water", caption: "Villas behind the beach.", credit: "The Residence Zanzibar", sourceUrl: "https://www.cenizaro.com/theresidence/zanzibar/gallery", width: 1280, height: 601, ...COURTESY },
    { src: "/guides/luxury-resorts/residence-3-1280.webp", alt: "A white villa with a dark roof, terrace and private pool in a palm garden", caption: "A villa and its private pool.", credit: "The Residence Zanzibar", sourceUrl: "https://www.cenizaro.com/theresidence/zanzibar/gallery", width: 1026, height: 566, ...COURTESY },
    { src: "/guides/luxury-resorts/residence-4-1280.webp", alt: "A villa bedroom with a white canopy bed and wooden shutters", caption: "A villa bedroom.", credit: "The Residence Zanzibar", sourceUrl: "https://www.cenizaro.com/theresidence/zanzibar/gallery", width: 1026, height: 566, ...COURTESY },
    { src: "/guides/luxury-resorts/residence-5-1280.webp", alt: "A candlelit terrace restaurant above the sea at dusk", caption: "Dinner on the terrace at dusk.", credit: "The Residence Zanzibar", sourceUrl: "https://www.cenizaro.com/theresidence/zanzibar/gallery", width: 1280, height: 601, ...COURTESY },
  ],
  "essque-zalu": [
    { src: "/guides/luxury-resorts/essque-zalu-1-1280.webp", alt: "A wide infinity pool merging with the sea at dusk", caption: "The infinity pool at dusk.", credit: "Essque Zalu Zanzibar", sourceUrl: "https://www.essquehotels.com/hotel-gallery", width: 1280, height: 768, ...COURTESY },
    { src: "/guides/luxury-resorts/essque-zalu-2-1280.webp", alt: "A lit wooden jetty leading over the sea to an overwater restaurant", caption: "The jetty to The Jetty restaurant.", credit: "Essque Zalu Zanzibar", sourceUrl: "https://www.essquehotels.com/hotel-gallery", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/luxury-resorts/essque-zalu-3-1280.webp", alt: "White suites with thatched roofs among palms and tropical gardens", caption: "Suites in the gardens.", credit: "Essque Zalu Zanzibar", sourceUrl: "https://www.essquehotels.com/hotel-gallery", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/luxury-resorts/essque-zalu-4-1280.webp", alt: "A pool in front of tall A-frame thatched roofs", caption: "The pool and the resort's tall makuti roofs.", credit: "Essque Zalu Zanzibar", sourceUrl: "https://www.essquehotels.com/hotel-gallery", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/luxury-resorts/essque-zalu-5-1280.webp", alt: "The tall thatched main building lit up at night", caption: "The main building at night.", credit: "Essque Zalu Zanzibar", sourceUrl: "https://www.essquehotels.com/hotel-gallery", width: 1280, height: 720, ...COURTESY },
  ],
  "the-mora": [
    { src: "/guides/luxury-resorts/the-mora-1-1280.webp", alt: "Aerial view of a large curving pool lined with loungers and umbrellas", caption: "One of the resort's pools, from above.", credit: "The Mora Zanzibar", sourceUrl: "https://www.themora.com/zanzibar/", width: 1280, height: 705, ...COURTESY },
    { src: "/guides/luxury-resorts/the-mora-2-1280.webp", alt: "Aerial view of the beach at Muyuni with rows of sunshades and a calm sea", caption: "The beach at Muyuni.", credit: "The Mora Zanzibar", sourceUrl: "https://www.themora.com/zanzibar/", width: 1024, height: 576, ...COURTESY },
    { src: "/guides/luxury-resorts/the-mora-3-1280.webp", alt: "A suite bedroom with a patterned bedspread and a balcony door", caption: "A suite.", credit: "The Mora Zanzibar", sourceUrl: "https://www.themora.com/zanzibar/", width: 1280, height: 685, ...COURTESY },
    { src: "/guides/luxury-resorts/the-mora-4-1280.webp", alt: "A curry and flatbread served at a candlelit table", caption: "From one of the four restaurants.", credit: "The Mora Zanzibar", sourceUrl: "https://www.themora.com/zanzibar/", width: 1280, height: 887, ...COURTESY },
  ],
  "gold": [
    { src: "/guides/luxury-resorts/gold-1-1280.webp", alt: "Aerial view of the resort's pools, palms and thatched umbrellas above Kendwa beach", caption: "The pools and beach from above.", credit: "Gold Zanzibar", sourceUrl: "https://www.goldzanzibar.com/gallery", width: 1280, height: 960, ...COURTESY },
    { src: "/guides/luxury-resorts/gold-2-1280.webp", alt: "Aerial view of Kendwa's long white beach and turquoise water", caption: "Kendwa beach, in front of the resort.", credit: "Gold Zanzibar", sourceUrl: "https://www.goldzanzibar.com/gallery", width: 1280, height: 960, ...COURTESY },
    { src: "/guides/luxury-resorts/gold-3-1280.webp", alt: "A red-walled villa with a long private pool and loungers", caption: "A villa with a private pool.", credit: "Gold Zanzibar", sourceUrl: "https://www.goldzanzibar.com/gallery", width: 1280, height: 864, ...COURTESY },
    { src: "/guides/luxury-resorts/gold-4-1280.webp", alt: "Lit stone steps leading up to a thatched building at dusk", caption: "The entrance at dusk.", credit: "Gold Zanzibar", sourceUrl: "https://www.goldzanzibar.com/gallery", width: 1280, height: 853, ...COURTESY },
    { src: "/guides/luxury-resorts/gold-5-1280.webp", alt: "Rows of thatched umbrellas on white sand facing the sea", caption: "Umbrellas on the beach.", credit: "Gold Zanzibar", sourceUrl: "https://www.goldzanzibar.com/gallery", width: 1280, height: 853, ...COURTESY },
  ],
  "riu-palace": [
    { src: "/guides/luxury-resorts/riu-palace-1-1280.webp", alt: "Aerial view of the resort buildings and pools beside a white beach and turquoise sea", caption: "The resort from the air.", credit: "Riu Palace Zanzibar", sourceUrl: "https://www.riu.com/en/hotel/tanzania/zanzibar/hotel-riu-palace-zanzibar", width: 1280, height: 640, ...COURTESY },
    { src: "/guides/luxury-resorts/riu-palace-2-1280.webp", alt: "Aerial view of the resort grounds running down to a long curving beach", caption: "The grounds and beach.", credit: "Riu Palace Zanzibar", sourceUrl: "https://www.riu.com/en/hotel/tanzania/zanzibar/hotel-riu-palace-zanzibar", width: 900, height: 600, ...COURTESY },
    { src: "/guides/luxury-resorts/riu-palace-3-1280.webp", alt: "A pool terrace with red umbrellas above the beach", caption: "A pool terrace above the beach.", credit: "Riu Palace Zanzibar", sourceUrl: "https://www.riu.com/en/hotel/tanzania/zanzibar/hotel-riu-palace-zanzibar", width: 900, height: 600, ...COURTESY },
    { src: "/guides/luxury-resorts/riu-palace-4-1280.webp", alt: "A thatched beach bar on a timber deck beside the sea", caption: "The beach bar.", credit: "Riu Palace Zanzibar", sourceUrl: "https://www.riu.com/en/hotel/tanzania/zanzibar/hotel-riu-palace-zanzibar", width: 900, height: 600, ...COURTESY },
    { src: "/guides/luxury-resorts/riu-palace-5-1280.webp", alt: "A suite bedroom with a large bed and patterned throw", caption: "A junior suite.", credit: "Riu Palace Zanzibar", sourceUrl: "https://www.riu.com/en/hotel/tanzania/zanzibar/hotel-riu-palace-zanzibar", width: 900, height: 600, ...COURTESY },
  ],
  "serena": [
    { src: "/guides/luxury-resorts/serena-1-1280.webp", alt: "A pool in a palm garden in front of the historic hotel building on the Stone Town seafront", caption: "The pool and seafront building.", credit: "Zanzibar Serena Hotel", sourceUrl: "https://www.serenahotels.com/zanzibar", width: 1280, height: 502, ...COURTESY },
    { src: "/guides/luxury-resorts/serena-2-1280.webp", alt: "A star-shaped pool among palms beside the sea, seen from above", caption: "The pool by the sea.", credit: "Zanzibar Serena Hotel", sourceUrl: "https://www.serenahotels.com/zanzibar", width: 1000, height: 858, ...COURTESY },
    { src: "/guides/luxury-resorts/serena-3-1280.webp", alt: "A covered veranda with a hammock and wooden balustrade looking out to sea", caption: "A sea-view veranda.", credit: "Zanzibar Serena Hotel", sourceUrl: "https://www.serenahotels.com/zanzibar", width: 1280, height: 960, ...COURTESY },
  ],
  "tulia": [
    { src: "/guides/luxury-resorts/tulia-1-1280.webp", alt: "Aerial view of thatched villas, pools and gardens above a white beach", caption: "The resort from the air.", credit: "Tulia Zanzibar", sourceUrl: "https://tuliazanzibar.com/gallery/", width: 1280, height: 720, ...COURTESY },
    { src: "/guides/luxury-resorts/tulia-2-1280.webp", alt: "A living room with sofas, wooden floors and stone walls", caption: "A villa living room.", credit: "Tulia Zanzibar", sourceUrl: "https://tuliazanzibar.com/gallery/", width: 1280, height: 853, ...COURTESY },
  ],
};
