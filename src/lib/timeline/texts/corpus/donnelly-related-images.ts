// PICTURES OF IGNATIUS DONNELLY'S ATLANTIS: THE ANTEDILUVIAN WORLD (NEW YORK, 1882).
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). First the book itself: pages of the Duke University copy, an
// 'Eleventh Edition' printed from the 1882 plates and the copy this import was
// read in, shown from its DjVu on Wikimedia Commons (DjVu page N is the scan's
// leaf N; p. 1 is page 19). Its frontispiece and a portrait of Donnelly by the
// Brady studio are the marker's pictures (marker-pictures.ts) and are not
// repeated here. Then the book's map 'The Empire of Atlantis', and a late
// portrait of Donnelly whose date and source rest on its file page, marked
// UNVERIFIED.
//
// The map shows Donnelly's theory, which modern geology and archaeology
// reject: there is no sunken continent in the Atlantic. Every picture is from
// a Wikimedia Commons file page, with the licence as that page states it, and
// was looked at before it was added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";
const DJVU = "Atlantis_-_The_Antediluvian_World_%281882%29.djvu";
const djvuPage = (page: number) => `${COMMONS}/thumb/e/e9/${DJVU}/page${page}-960px-${DJVU}.jpg`;
const DJVU_PAGE = `${FILE}Atlantis_-_The_Antediluvian_World_(1882).djvu`;
const DJVU_LICENCE = "Public domain (PD-1923, PD-old) and Public Domain Mark, as the file page states";
const DJVU_CREDIT = "Wikimedia Commons, from the Internet Archive (atlantisantedil00donn, Duke University copy)";
const DUKE = "Duke University Libraries (the scanned copy)";

export const DONNELLY_IMAGES: Placed[] = [
  // ---- the book: the Duke copy, from the 1882 plates
  {
    key: "donnelly-1882-title-page",
    passageKey: "modern.donnelly.1882",
    url: djvuPage(11),
    sourcePageUrl: DJVU_PAGE,
    institution: DUKE,
    objectDate: "The 1882 setting; this copy is marked 'Eleventh Edition' and is undated",
    caption:
      "The title page of the Duke copy: 'Atlantis: The Antediluvian World. By Ignatius Donnelly. Illustrated', with a verse motto signed 'Festus' on 'That great, original, broad-eyed, sunken race', the words 'Eleventh Edition', and the imprint 'New York: Harper & Brothers, Franklin Square'. Page 11 of the DjVu scan; this import's text was read in the same copy.",
    creator: "Harper & Brothers, New York (publisher)",
    credit: DJVU_CREDIT,
    licence: DJVU_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "donnelly-1882-copyright-page",
    passageKey: "modern.donnelly.1882",
    url: djvuPage(12),
    sourcePageUrl: DJVU_PAGE,
    institution: DUKE,
    objectDate: "1882 (printed: 'in the year 1882')",
    caption:
      "The back of the title page in the Duke copy: 'Entered according to Act of Congress, in the year 1882, by Harper & Brothers, In the Office of the Librarian of Congress, at Washington. All rights reserved.' This is the evidence for the book's date. Page 12 of the DjVu scan.",
    creator: "Harper & Brothers, New York (publisher)",
    credit: DJVU_CREDIT,
    licence: DJVU_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "donnelly-1882-page-1",
    passageKey: "modern.donnelly.1882.1.1",
    url: djvuPage(19),
    sourcePageUrl: DJVU_PAGE,
    institution: DUKE,
    objectDate: "The 1882 setting",
    caption:
      "Page 1 of the Duke copy, the opening of Part I, chapter I, 'The Purpose of the Book': 'This book is an attempt to demonstrate several distinct and novel propositions', followed by the first of the thirteen. Page 19 of the DjVu scan.",
    creator: "Harper & Brothers, New York (publisher)",
    credit: DJVU_CREDIT,
    licence: DJVU_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "donnelly-1882-page-5",
    passageKey: "modern.donnelly.1882.1.2",
    url: djvuPage(23),
    sourcePageUrl: DJVU_PAGE,
    institution: DUKE,
    objectDate: "The 1882 setting",
    caption:
      "Page 5 of the Duke copy, the opening of chapter II, 'Plato's History of Atlantis': 'Plato has preserved for us the history of Atlantis', then Plutarch on Solon's unfinished poem about 'the Atlantic Island', 'such as no other story, fable, or poem ever had'. Page 23 of the DjVu scan.",
    creator: "Harper & Brothers, New York (publisher)",
    credit: DJVU_CREDIT,
    licence: DJVU_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "donnelly-1882-page-29",
    passageKey: "modern.donnelly.1882.1.3",
    url: djvuPage(47),
    sourcePageUrl: DJVU_PAGE,
    institution: DUKE,
    objectDate: "The 1882 setting",
    caption:
      "Page 29 of the Duke copy, where Donnelly dates the destruction of Atlantis: 'Plato states that the Egyptians told Solon that the destruction of Atlantis occurred 9000 years before that date, to wit, about 9600 years before the Christian era', followed by Oppert's reckoning of cycles with its bracketed sum, '12 × 1460 = 17,520' and '12 × 1805 = 21,660', '= 39,180'. Page 47 of the DjVu scan.",
    creator: "Harper & Brothers, New York (publisher)",
    credit: DJVU_CREDIT,
    licence: DJVU_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "donnelly-1882-empire-map",
    passageKey: "modern.donnelly.1882.4.2",
    url: `${COMMONS}/7/79/Atlantis_map_1882.jpg`,
    sourcePageUrl: `${FILE}Atlantis_map_1882.jpg`,
    objectDate: "1882 (the book)",
    caption:
      "'The Empire of Atlantis', the book's full-page map: a world map with an island marked 'Atlantis' in the mid-Atlantic and, shaded light, lands on both sides of the ocean, in the Americas, Europe and North Africa, which the book makes Atlantis's empire and colonies. In the Duke copy it is the plate counted as pp. 295–296, inside this chapter. It shows Donnelly's theory, which modern geology and archaeology reject: no sunken continent lies under the Atlantic.",
    creator: "Ignatius Donnelly (the theory); Harper & Brothers, New York (publisher)",
    credit: "Wikimedia Commons, from an Internet Archive scan of the book",
    licence: "Public domain (PD-old) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "map",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- the author: context
  {
    key: "donnelly-portrait-gutekunst",
    passageKey: "modern.donnelly.1882",
    url: `${COMMONS}/8/8c/IgnatiusDonnelly1898.jpg`,
    sourcePageUrl: `${FILE}IgnatiusDonnelly1898.jpg`,
    objectDate: "About 1898, as the file page gives it (not checked)",
    caption:
      "UNVERIFIED — A half-length photograph of Ignatius Donnelly late in life, stout, in a dark coat with a white bow tie. The file page credits the Philadelphia photographer F. Gutekunst, dates it about 1898 and gives a Minnesota Historical Society number; that date and source are not verified. Sixteen years after the book; context for its author.",
    whatIsUnverified:
      "The date (about 1898), the photographer (F. Gutekunst) and the Minnesota Historical Society record (por 11283 m1, negative 83331), all as the file page gives them; none was checked against the Society's catalogue.",
    creator: "F. Gutekunst, Philadelphia (as the file page gives it)",
    credit: "Wikimedia Commons, from the Minnesota Historical Society",
    licence: "Public domain (PD-old) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
