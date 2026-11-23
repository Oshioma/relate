// PICTURES FOR PTOLEMY, TETRABIBLOS.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). No manuscript leaf of the Tetrabiblos is on Commons under a
// name that could be checked, so the pictures are:
// - the first printing of the Greek, Camerarius's edition (Nuremberg, 1535),
//   at its title page, in the Universidad de Sevilla copy. The title page was
//   read on the Internet Archive's page image of that copy (ARes43420, leaf
//   n6); the Commons file is the Internet Archive's PDF of the same scan,
//   with as many pages as the scan has leaves (271), so its page 7 is that
//   leaf. It is what it says it is, so it is secure;
// - the edition imported, Robbins's Loeb (1940), at the first page of his
//   introduction, read on the image (it is the introduction the archive
//   lists and does not import). Secure as to what it shows; the copy scanned
//   is not identified on the file page;
// - closely related evidence, UNVERIFIED in its details: the opening page of
//   a printed Latin translation, the Quadripartitum, whose red heading was
//   read on the image ('Cuius in primo tractatu sunt 24 capitula', matching
//   Robbins's 24 chapters of Book I). The file page calls it the Venice
//   edition of Erhard Ratdolt, 1484, in the translation of Plato of Tivoli;
//   Wikipedia says the 1484 Ratdolt printing was Egidio Tebaldi's translation
//   from the Arabic. Which is right was not settled here.
// Considered and left out: an aspect diagram said to be from a Basel printing
// of 1533, the 1535 edition's opening chapter as a bookseller photographed
// it, the 1564 Ziletti woodcut of Ptolemy, and a 15th-century illumination of
// Ptolemy in Paris, BnF latin 7432. Their file pages were read, but Commons
// refused the images themselves (HTTP 429, for over an hour), so they could
// not be looked at and are not used. Every picture is from a Wikimedia
// Commons file page, with the licence as that page states it, and was looked
// at before it was added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

const CAMERARIUS_PDF =
  "Hoc_in_libro_nunqua%28m%29_ante_tipis_aeneis_in_lucem_edita_haec_insunt_-_Klaudiou_Ptolemaiou_pelousieos_Tetrabiblos_syntaxis_pros_Syron_adelpho_%3D_Claudii_Ptolemaei_pelusiensis_libri_quatuor_compositi_Syro_%28IA_ARes43420%29.pdf";
const LOEB_PDF = "Loeb_435_-_Ptolemy_-_Tetrabiblos_by_Robbins_%281940%29.pdf";

export const CAMERARIUS_1535_TITLE_PAGE_URL = `${COMMONS}/thumb/9/95/${CAMERARIUS_PDF}/page7-960px-${CAMERARIUS_PDF}.jpg`;
export const CAMERARIUS_1535_TITLE_PAGE_SOURCE = `${FILE}${CAMERARIUS_PDF}?page=7`;
export const QUADRIPARTITUM_URL = `${COMMONS}/a/ad/Quadritpartitum.jpg`;

export const PTOLEMY_TETRABIBLOS_IMAGES: Placed[] = [
  // ---- the first printing of the Greek: Camerarius, Nuremberg, 1535
  {
    key: "ptol-camerarius-1535-title-page",
    passageKey: "greek.ptol.book",
    url: CAMERARIUS_1535_TITLE_PAGE_URL,
    sourcePageUrl: CAMERARIUS_1535_TITLE_PAGE_SOURCE,
    institution: "Biblioteca de la Universidad de Sevilla (the scanned copy, A Res.43/4/20), via the Internet Archive",
    accessionNumber: "Internet Archive ARes43420",
    objectDate: "1535, as the title page ('NORIMBERGAE. M. D. XXXV.') and the colophon read",
    caption:
      "The title page of the first printing of the Tetrabiblos in Greek, edited by Joachim Camerarius: 'Hoc in libro nunquam ante typis aeneis in lucem edita haec insunt' (in this book, never before printed, are these), then the Greek titles of Ptolemy's four books to Syrus and of the Karpos, and in Latin 'Claudii Ptolemaei Pelusiensis libri quatuor compositi Syro fratri', Camerarius's Latin of the first two books, Pontano's Latin of the Hundred Sayings, Camerarius's notes and two other astrological tracts; at the foot 'NORIMBERGAE. M. D. XXXV.' and a library stamp. The colophon names the printer, Johann Petreius. The Sevilla copy.",
    creator: "Joachim Camerarius (editor); Johann Petreius, Nuremberg (printer, as the colophon says)",
    credit: "Biblioteca de la Universidad de Sevilla, scanned by the Internet Archive (ARes43420), via Wikimedia Commons",
    licence: "Public domain (PD-old-100-expired) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- the edition imported: Robbins's Loeb, 1940
  {
    key: "ptol-robbins-1940-introduction",
    passageKey: "greek.ptol.book",
    url: `${COMMONS}/thumb/f/fe/${LOEB_PDF}/page5-500px-${LOEB_PDF}.jpg`,
    sourcePageUrl: `${FILE}${LOEB_PDF}?page=5`,
    institution: "Not stated: the file page gives no source for the scan",
    objectDate: "1940, as the file page gives it; the scanned copy's own date of printing was not read",
    caption:
      "The first page of Frank Egleston Robbins's introduction to his Loeb edition of the Tetrabiblos, the edition whose English the archive imports: 'INTRODUCTION. I. From his own day well into the Renaissance Claudius Ptolemy's name was well-nigh pre-eminent in astronomy, geography, and astrology alike', with his footnotes and the page number v. The introduction itself is listed, not imported; it is where Robbins reports that Ptolemy was probably born at Ptolemaïs in Egypt and lived to 78.",
    creator: "Frank Egleston Robbins (translator and editor)",
    credit: "Via Wikimedia Commons (a scan of unstated origin)",
    licence:
      "Public domain, as the file page states (published in the United States 1931–1963 and not renewed); the archive treats Robbins's work as public domain in the United States only",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- closely related evidence: a printed Latin Quadripartitum
  {
    key: "ptol-quadripartitum-latin-opening",
    passageKey: "greek.ptol.book",
    url: QUADRIPARTITUM_URL,
    sourcePageUrl: `${FILE}Quadritpartitum.jpg`,
    institution: "Not stated on the file page",
    objectDate: "1484, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — Related evidence, not the Greek: the opening page of an early printed Latin translation, in two columns of black-letter type with a large decorated initial and handwritten marginal notes. The red heading reads 'Liber Quadripartiti Ptolomei id est quattuor tractatuum ... Cuius in primo tractatu sunt 24 capitula. Incipit' (the book of Ptolemy's Quadripartitum, that is, of four treatises; its first treatise has 24 chapters), then the heading of chapter 1. The file page calls it the Venice edition of Erhard Ratdolt, 1484, translated by Plato of Tivoli.",
    whatIsUnverified:
      "The heading was read on the image. The edition, the printer, the year and the translator are the file page's: Wikipedia ('Tetrabiblos') says the 1484 Ratdolt printing was Egidio Tebaldi's translation from the Arabic, not Plato of Tivoli's, and neither was checked; the copy and its library are not named.",
    creator: "Unknown printer (Erhard Ratdolt, Venice, as the file page says)",
    credit: "Via Wikimedia Commons (uploaded by Zachariel)",
    licence: "Public domain and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
