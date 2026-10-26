// PICTURES FOR THE TURBA PHILOSOPHORUM.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). No picture of a medieval Latin manuscript of the Turba, or of
// an Arabic fragment, was found on Wikimedia Commons. So the pictures are:
// - the title page of the first printing, Auriferae artis, quam chemiam
//   vocant, antiquissimi authores, sive Turba philosophorum (Basel: Pietro
//   Perna, 1572), in the Wellcome Collection's copy. The page itself reads
//   'BASILEAE. APVD PETRVM PERNAM. M. D. LXXII.', so what it is, is secure;
// - five pages of the edition imported here, Waite 1896, from the Cornell copy
//   whose page images the text was proofread against: the title page, p. 1
//   (the heading and the Epistle's rubric), p. 11 (Pandolfus's egg, with
//   Waite's note on the philosophical egg of the Greek alchemists), p. 35 (the
//   Eleventh Dictum's praise of Nature, with Waite's note that its formulas
//   'are derived literally from the Greek Alchemists') and p. 206 (the
//   Conclusion, with Waite's note that it is the last Dictum of the second
//   recension). These are what they say they are, so they are secure. The
//   Commons PDF's page numbers were checked against two of its own page
//   images (page 7, the half-title, and page 15, p. 1), and each page was
//   looked at on the identical Internet Archive scan;
// - a woodcut of sages gathered round a fire, under banderoles with 'Solve
//   coagula' and 'Solvite corpora in aquas', which Wikipedia uses for the
//   Turba. The file page says it is from 'Artis Auriferae 1752' and names
//   Johann Paul Krauss; the French Wikipedia calls it the frontispiece of the
//   1572 edition, citing a Gallica copy of 1610. Neither was checked, and the
//   two disagree, so it is UNVERIFIED.
// Considered and left out: Ibn Umayl's Silvery Water (the Topkapı copy of
// 1339, with the sage holding his tablet), the earliest work known to use the
// Turba, as Plessner argued: a crop of the same picture is already shown with
// the Emerald Tablet, and the uncropped file could not be looked at for this
// import (Wikimedia refused the download), so it is not added; a Commons scan
// of the 1610 Artis auriferae (IA hin-wel-all-00001655-001), which proved to
// be its third volume, without the Turba; and Hall's 'Alchemical Androgyne',
// which he says comes from a German Turba of 1750, already shown with Hall.
// Every picture is from a Wikimedia Commons file page, with the licence as
// that page states it, and was looked at before it was added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

const BOOK_PDF = "Cornell_University_Library_digitization_%28IA_cu31924012366088%29.pdf";
const BOOK_PAGE = `${FILE}Cornell_University_Library_digitization_(IA_cu31924012366088).pdf`;
const pdfPage = (page: number) => `${COMMONS}/thumb/9/9b/${BOOK_PDF}/page${page}-960px-${BOOK_PDF}.jpg`;

const BOOK_CREDIT = "Cornell University Library, scanned by the Internet Archive (cu31924012366088), via Wikimedia Commons";
const BOOK_LICENCE = "Public domain, as the file page states";
const BOOK_CREATOR = "Arthur Edward Waite (translator); George Redway, London (publisher)";
const BOOK_INSTITUTION = "Cornell University Library (the scanned copy, via the Internet Archive)";

export const TURBA_IMAGES: Placed[] = [
  // ---- the first printing
  {
    key: "turba-auriferae-artis-1572-title-page-wellcome",
    passageKey: "arab.turba.book",
    url: `${COMMONS}/f/f0/Title_page%3B%22Artis_Auriferae%22%2C_volume_1%2C_1572_Wellcome_L0000510.jpg`,
    sourcePageUrl: `${FILE}Title_page;%22Artis_Auriferae%22,_volume_1,_1572_Wellcome_L0000510.jpg`,
    institution: "Wellcome Collection, London (as the file page says)",
    accessionNumber: "Wellcome Images L0000510 (as the file page says)",
    objectDate: "1572 (the date printed on the title page)",
    caption:
      "The title page of the first printing of the Latin Turba: 'Auriferae artis, quam chemiam vocant, antiquissimi authores, sive Turba philosophorum', with an oval woodcut device of a robed woman holding a staff and a small hanging lamp, framed by scrollwork, putti and beasts, and below it 'Cum privilegio Caesar. Maiest. Basileae. Apud Petrum Pernam. M. D. LXXII.' (Basel: Pietro Perna, 1572). A shelf number is written in the top corner. The file page calls it volume 1.",
    creator: "Pietro Perna, Basel (printer)",
    credit: "Wellcome Collection, CC BY 4.0, via Wikimedia Commons",
    licence: "CC BY 4.0, as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- the edition imported here
  {
    key: "turba-waite-1896-title-page",
    passageKey: "arab.turba.book",
    url: pdfPage(9),
    sourcePageUrl: `${BOOK_PAGE}?page=9`,
    institution: BOOK_INSTITUTION,
    accessionNumber: "Internet Archive cu31924012366088",
    objectDate: "1896 (the date printed on the title page)",
    caption:
      "The title page of the edition this archive imports: 'The Turba Philosophorum or Assembly of the Sages, called also the Book of Truth in the Art and the Third Pythagorical Synod. An ancient alchemical treatise translated from the Latin, the chief readings of the shorter codex, parallels from the Greek alchemists, and explanations of obscure terms, by Arthur Edward Waite. London: George Redway, 1896', under the series word 'Alchemy', from Cornell University Library's copy.",
    creator: BOOK_CREATOR,
    credit: BOOK_CREDIT,
    licence: BOOK_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "turba-waite-1896-page-1",
    passageKey: "arab.turba.epistle",
    url: pdfPage(15),
    sourcePageUrl: `${BOOK_PAGE}?page=15`,
    institution: BOOK_INSTITUTION,
    accessionNumber: "Internet Archive cu31924012366088",
    objectDate: "1896",
    caption:
      "Page 1 of Waite (1896): the heading 'The Turba Philosophorum, taken from an ancient manuscript codex, more perfect than any edition published heretofore', the italic rubric of the Epistle of Arisleus and its opening words, and Waite's footnote: an ancient gloss calls Arisleus the son of Abladus, and Berthelot takes him for the Aristenes of the second recension, which Waite doubts.",
    creator: BOOK_CREATOR,
    credit: BOOK_CREDIT,
    licence: BOOK_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "turba-waite-1896-page-11",
    passageKey: "arab.turba.4",
    url: pdfPage(25),
    sourcePageUrl: `${BOOK_PAGE}?page=25`,
    institution: BOOK_INSTITUTION,
    accessionNumber: "Internet Archive cu31924012366088",
    objectDate: "1896",
    caption:
      "Page 11 of Waite (1896), from the Fourth Dictum: Pandolfus's egg, whose shell is earth, white water, inner skin air and yolk fire. Waite's footnote below says that 'the allegory of the philosophical egg can be traced to the Greek alchemists', where the egg is 'the stone which is not a stone' and 'the image of the world'. The archive imports the text and lists, but does not import, the notes.",
    creator: BOOK_CREATOR,
    credit: BOOK_CREDIT,
    licence: BOOK_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "turba-waite-1896-page-35",
    passageKey: "arab.turba.11",
    url: pdfPage(49),
    sourcePageUrl: `${BOOK_PAGE}?page=49`,
    institution: BOOK_INSTITUTION,
    accessionNumber: "Internet Archive cu31924012366088",
    objectDate: "1896",
    caption:
      "Page 35 of Waite (1896), from the Eleventh Dictum: 'O that potent Nature, which overcame and conquered natures, and caused its natures to rejoice and be glad!' Waite's footnotes say that the formulas 'Nature overcomes nature: Nature contains Nature: Nature is ruled by Nature' are 'derived literally from the Greek Alchemists', and that these exclamations in 'O' are borrowed from, or modelled on, theirs: his view of 1896, after Berthelot.",
    creator: BOOK_CREATOR,
    credit: BOOK_CREDIT,
    licence: BOOK_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "turba-waite-1896-page-206",
    passageKey: "arab.turba.conclusion",
    url: pdfPage(220),
    sourcePageUrl: `${BOOK_PAGE}?page=220`,
    institution: BOOK_INSTITUTION,
    accessionNumber: "Internet Archive cu31924012366088",
    objectDate: "1896",
    caption:
      "Page 206 of Waite (1896): the end of the Seventy-Second Dictum ('So is it imposed upon coin.') and the italic heading 'Conclusion.', with Agmon's corollary beginning 'Whosoever does not liquefy and coagulate errs greatly'. Waite's footnote: 'This constitutes the last Dictum in the second recension, and is omitted from the longer version.'",
    creator: BOOK_CREATOR,
    credit: BOOK_CREDIT,
    licence: BOOK_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- context: a woodcut associated with the Turba, source unverified
  {
    key: "turba-sages-round-the-fire-woodcut",
    passageKey: "arab.turba.book",
    url: `${COMMONS}/8/82/Turba_phil.jpg`,
    sourcePageUrl: `${FILE}Turba_phil.jpg`,
    institution: "Not given on the file page",
    objectDate: "The file page says 1752; the French Wikipedia says 1572; not checked",
    caption:
      "UNVERIFIED — A woodcut of an assembly of sages: robed and capped men, two of them crowned and holding sceptres, stand close together round a fire on the ground; banderoles curl above them with words in a German-looking script, some reversed, and below with the Latin 'Solve coagula' and 'Solvite corpora in aquas' ('dissolve the bodies into waters'). It is the picture Wikipedia uses for the Turba, and it fits the book's scene of the sages in council, but which book it comes from is not established.",
    whatIsUnverified:
      "Its source and date. The file page describes it as 'Turba philosophorum taken from the book Artis Auriferae 1752', names Johann Paul Krauss as the artist, and credits a private website; the French Wikipedia calls it the frontispiece of the 1572 first edition, citing a Gallica copy of the 1610 edition. The two disagree and neither was checked: the Wellcome copy of 1572 shown here has no such picture on its title page. The German words on the banderoles were not read.",
    creator: "Unknown (the file page names Johann Paul Krauss; not checked)",
    credit: "Wikimedia Commons (from a private website, as the file page says)",
    licence: "Public domain, as the file page states",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
