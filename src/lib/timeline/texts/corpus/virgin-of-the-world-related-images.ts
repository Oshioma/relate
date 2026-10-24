// PICTURES OF THE VIRGIN OF THE WORLD (LONDON, 1885) AND ITS SOURCES.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). The 1885 book itself is not on Wikimedia Commons: its title
// page and its frontispiece (a many-breasted Isis, "Virgin of the World") were
// read on Google's scan at archive.org, which is not an open file page, so
// they are described in the corpus file and not shown. What is shown is the
// closest related evidence: two pages of Francesco Patrizi's Nova de universis
// philosophia, the Renaissance collection that printed the Hermetic books and
// fragments the 1885 English renders (the book's own notes cite "Patrizzi"),
// one of them its title page listing "Asclepii discipuli tres libelli", the
// three treatises the book calls "The Definitions of Asclepios". The
// translators' portraits are the marker's pictures (marker-pictures.ts) and
// are not repeated here. Every picture is from a Wikimedia Commons file page,
// with the licence as that page states it, and was looked at before it was
// added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

export const VIRGIN_IMAGES: Placed[] = [
  {
    key: "vow-patrizi-1593-title-page",
    passageKey: "modern.vow.1885.def",
    url: `${COMMONS}/3/33/Patrizi%2C_Nova_de_universis_philosophia.jpg`,
    sourcePageUrl: `${FILE}Patrizi,_Nova_de_universis_philosophia.jpg`,
    objectDate: "Dated 1593 on the page; the file page says it was in fact printed after the Church's prohibition of 1594",
    caption:
      "The title page of the second edition of Francesco Patrizi's Nova de universis philosophia: 'Auctore Francisco Patritio ... Quibus postremo sunt adiecta: Zoroastris oracula CCCXX ... Hermetis Trismegisti libelli, & fragmenta, quotcunque reperiuntur, ordine scientifico disposita. Asclepii discipuli tres libelli', with a woodcut of two cocks in an ornamental frame and the imprint 'Venetijs, Excudebat Robertus Meiettus. 1593.' The 'three little books of Asclepius the disciple' are Corpus Hermeticum XVI–XVIII, which the 1885 book gives as 'The Definitions of Asclepios'.",
    creator: "Francesco Patrizi (author); Roberto Meietti, Venice (printer)",
    credit: "Wikimedia Commons",
    licence: "CC BY-SA 4.0, as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "vow-patrizi-contents-hermetica",
    passageKey: "modern.vow.1885",
    url: `${COMMONS}/3/33/Francesco_Patrizi_-_Nova_de_universis_philosophia_-_part_content.png`,
    sourcePageUrl: `${FILE}Francesco_Patrizi_-_Nova_de_universis_philosophia_-_part_content.png`,
    objectDate: "1591, as the file page gives the edition (not checked)",
    caption:
      "UNVERIFIED — A page of Patrizi's Nova de universis philosophia headed 'Ad horum calcem adiecta sunt' ('added at the end of these'): 'Zoroastri oracula CCCXX ... Hermetis Trismegisti libelli & Fragmenta, quotcumque reperiuntur, ordine scientifico disposita. Asclepij eius discipuli tres libelli. Mystica Aegyptiorum ...', with the list of the book's chapters showing through from the other side. The Hermetic books and fragments listed here are the ones the 1885 English translates, by way of Ménard; the page itself is not dated.",
    whatIsUnverified:
      "The edition and the copy: the file page calls it the 1591 edition and takes it from Google Books without naming the copy, and the page shows no date. That it is a page of the Nova de universis philosophia is clear from its text.",
    creator: "Francesco Patrizi (author)",
    credit: "Wikimedia Commons, from Google Books",
    licence: "Public domain (PD-old-70-1923), as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
