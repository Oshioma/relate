// PICTURES OF W. SCOTT-ELLIOT'S THE STORY OF ATLANTIS (LONDON, 1896).
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). First the book itself: the British Library copy of 1896
// (shelfmark 10007.dd.2), scanned for the Library's Flickr collection and
// copied to Wikimedia Commons. Its front cover and map 4 are the marker's
// pictures (marker-pictures.ts) and are not repeated here; map 3 is placed on
// the section that describes the maps. Then related material whose origin or
// identification rests only on its file page, marked UNVERIFIED: a Russian
// redrawing of map 1, a map of Lemuria that its file page assigns to this book
// but which is more likely from Scott-Elliot's The Lost Lemuria (1904), and a
// portrait of A. P. Sinnett, who wrote the Preface.
//
// THE MAPS ARE SCOTT-ELLIOT'S OWN. The book says they are copies of maps "among
// the records" read by clairvoyance; no such records have been produced, and
// the maps are his own work of 1896, not evidence about the sea floor. Every
// caption of a map says so. Every picture is from a Wikimedia Commons file
// page, with the licence as that page states it, and was looked at before it
// was added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

export const NOT_A_RECORD =
  "The book says the maps are copies of maps preserved among occult records and read by clairvoyance; that is its claim. No such record has been produced: the map is Scott-Elliot's own of 1896, evidence for what he taught, not for the shape of the earth or the sea floor.";

export const SCOTT_ELLIOT_IMAGES: Placed[] = [
  // ---- the 1896 book: the British Library copy
  {
    key: "scott-elliot-1896-map-3",
    passageKey: "modern.scott.1896.7",
    url: `${COMMONS}/e/ed/ELLIOT%281896%29_Atlantis%2C_Map3.jpg`,
    sourcePageUrl: `${FILE}ELLIOT(1896)_Atlantis,_Map3.jpg`,
    institution: "British Library (HMNTS 10007.dd.2, the scanned copy)",
    objectDate: "1896 (the first edition)",
    caption: `Map 3 of the 1896 first edition, 'The World after the catastrophe of 200,000 years ago and up to the catastrophe of about 80,000 years ago', from the British Library copy: Atlantis split into two islands, the larger 'Ruta' and the smaller 'Daitya', with the continents in shapes of the author's own. ${NOT_A_RECORD}`,
    creator: "W. Scott-Elliot (the map); Theosophical Publishing Society, London (publisher)",
    credit: "Wikimedia Commons, from the British Library's scan on Flickr",
    licence: "Public domain (PD-old-70-expired) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "map",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- related material, identified only by its file page
  {
    key: "scott-elliot-map-1-russian-redrawing",
    passageKey: "modern.scott.1896.7",
    url: `${COMMONS}/b/be/Map_of_Atlantis.jpg`,
    sourcePageUrl: `${FILE}Map_of_Atlantis.jpg`,
    objectDate: "1910, as the file page gives it (not checked)",
    caption: `UNVERIFIED — A coloured redrawing of Scott-Elliot's map 1, 'Atlantis at its Prime', with Russian lettering ('Атлантида во времена расцвета', Atlantis in its heyday): one great continent filling the Atlantic from near Iceland to the latitude of Brazil. No 1896 copy reached has map 1, so this later version stands in for it; which edition it comes from, and who redrew it, are not verified. ${NOT_A_RECORD}`,
    whatIsUnverified:
      "The edition and the redrawer: the file page says it is from a Russian edition of 1910 and names no artist. That it follows the 1896 map 1 closely is not checked, since map 1 was not found in any 1896 copy reached.",
    creator: "Unknown (after W. Scott-Elliot)",
    credit: "Wikimedia Commons (uploaded by SERGEJ2011, 2014)",
    licence: "Public domain (PD-old) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "map",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "scott-elliot-lemuria-map-spanish",
    passageKey: "modern.scott.1896.8",
    url: `${COMMONS}/7/7b/Map_of_Lemuria.jpg`,
    sourcePageUrl: `${FILE}Map_of_Lemuria.jpg`,
    objectDate: "Not established (the file page gives 1896)",
    caption: `UNVERIFIED — A map numbered 2 and headed in Spanish 'El continente de Lemuria en los últimos tiempos de su existencia' (the continent of Lemuria in the last times of its existence), showing a great southern continent across the Indian and Pacific Oceans. The file page says it is Scott-Elliot's, from The Story of Atlantis of 1896; that book's maps are of Atlantis, and this is more likely map 2 of his The Lost Lemuria (1904) in a Spanish edition. It is shown here because section 8 sets the first Atlantean race on a spur of Lemuria. Like the Atlantis maps, it is the author's own drawing, not a copy of any record that can be examined.`,
    whatIsUnverified:
      "Which book and edition the map comes from: the file page says The Story of Atlantis (1896), but the map is numbered 2, is of Lemuria and is lettered in Spanish, so it is probably from a Spanish edition of The Lost Lemuria (1904). Its date and printer are not established.",
    creator: "After W. Scott-Elliot",
    credit: "Wikimedia Commons",
    licence: "Public domain and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "map",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "scott-elliot-sinnett-portrait",
    passageKey: "modern.scott.1896.preface",
    url: `${COMMONS}/c/c4/Alfred_Percy_Sinnett.001.jpg`,
    sourcePageUrl: `${FILE}Alfred_Percy_Sinnett.001.jpg`,
    objectDate: "Undated (the file page gives only the sitter's dates, 1840–1921)",
    caption:
      "UNVERIFIED — A photograph of an elderly bald man with a full white beard, which its file page identifies as Alfred Percy Sinnett (1840–1921), the Theosophist who wrote the Preface to The Story of Atlantis. When and by whom it was taken are not verified. Context for the Preface, not evidence for anything it claims.",
    whatIsUnverified:
      "The date, the photographer and the source: the file page names an unknown author and takes the picture from blavatskyarchives.com. The identification of the sitter rests on the file page.",
    creator: "Unknown photographer",
    credit: "Wikimedia Commons, from blavatskyarchives.com",
    licence: "Public domain and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
