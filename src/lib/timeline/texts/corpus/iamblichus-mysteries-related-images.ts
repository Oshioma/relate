// PICTURES FOR IAMBLICHUS, ON THE MYSTERIES.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). No ancient or Byzantine manuscript of the Greek is on
// Commons under a name that could be checked, so the pictures are:
// - the printings of the work, as they are, each read on the page shown: the
//   title page, the opening of Porphyry's Epistle and the opening of the
//   Answer in the Wellcome copy of Taylor's English (1821), the edition
//   imported; the title page of Gale's first printing of the Greek (Oxford,
//   1678); and the leaf with Ficino's dedication and Argumentum in the Aldine
//   printing of Ficino's Latin (Venice, 1497). These are what they say they
//   are, so they are secure;
// - closely related evidence, UNVERIFIED in its details: a decorated
//   manuscript of Ficino's Latin version, whose opening was read on the image,
//   but whose shelfmark and date are the file page's;
// - context, UNVERIFIED: a photograph of a portrait of Taylor, the
//   translator, as its file page identifies it.
// Considered and left out: the Aldine volume's index (page 7) and Mussard's
// imagined portrait of Iamblichus (1675), whose images could not be fetched
// to be looked at; and an "Iamblichus" likeness whose file page gives no
// artist, date or source beyond a web gallery. No ancient likeness of
// Iamblichus exists to show.
// The Commons PDF pages are the Internet Archive scans of the same copies;
// for Taylor's volume the PDF's page N is the scan's leaf N − 1, checked on
// three pages here. Every picture is from a Wikimedia Commons file page, with
// the licence as that page states it, and was looked at before it was added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

const TAYLOR_PDF =
  "Iamblichus_on_the_mysteries_of_the_Egyptians%2C_Chaldeans%2C_and_Assyrians_%28IA_b29338888_0002%29.pdf";
const TAYLOR_PAGE = `${FILE}Iamblichus_on_the_mysteries_of_the_Egyptians,_Chaldeans,_and_Assyrians_(IA_b29338888_0002).pdf`;
const taylorPage = (page: number) => `${COMMONS}/thumb/4/4e/${TAYLOR_PDF}/page${page}-960px-${TAYLOR_PDF}.jpg`;

const GALE_PDF =
  "Iamblichi_Chalkide%C5%8Ds_t%C4%93s_koil%C4%93s_syrias_peri_myst%C4%93ri%C5%8Dn_logos_Iamblichi_Chalcidensis_ex_Coele-Syria._De_mysteriis_liber._Pr%C3%A6mittitur_Epistola_Porphyrii_ad_Anebonem_%C3%86gyptium_eodem_argumento_%28IA_b3033844x%29.pdf";
const GALE_PAGE = `${FILE}Iamblichi_Chalkideōs_tēs_koilēs_syrias_peri_mystēriōn_logos_Iamblichi_Chalcidensis_ex_Coele-Syria._De_mysteriis_liber._Præmittitur_Epistola_Porphyrii_ad_Anebonem_Ægyptium_eodem_argumento_(IA_b3033844x).pdf`;

const ALDINE_PDF =
  "Iamblichus_de_mysteriis_Aegyptiorum%2C_Chaldaeorum_et_Assyriorum._Proclus_in_Platonicum_Alcibiadem_de_anima_%28IA_A335081%29.pdf";
const ALDINE_PAGE = `${FILE}Iamblichus_de_mysteriis_Aegyptiorum,_Chaldaeorum_et_Assyriorum._Proclus_in_Platonicum_Alcibiadem_de_anima_(IA_A335081).pdf`;

const TAYLOR_CREDIT = "Wellcome Collection, scanned by the Internet Archive (b29338888_0002), via Wikimedia Commons";
const TAYLOR_LICENCE = "Public domain (PD-old-100-expired) and Public Domain Mark, as the file page states";
const TAYLOR_INSTITUTION = "Wellcome Collection, London (the scanned copy, via the Internet Archive)";

export const IAMBLICHUS_MYSTERIES_IMAGES: Placed[] = [
  // ---- the edition imported: Taylor 1821
  {
    key: "iamb-taylor-1821-title-page",
    passageKey: "greek.iamb.book",
    url: taylorPage(7),
    sourcePageUrl: `${TAYLOR_PAGE}?page=7`,
    institution: TAYLOR_INSTITUTION,
    accessionNumber: "Internet Archive b29338888_0002",
    objectDate: "1821 (the date printed on the title page)",
    caption:
      "The title page of the edition imported: 'Iamblichus on the Mysteries of the Egyptians, Chaldeans, and Assyrians. Translated from the Greek by Thomas Taylor', with a Greek motto from Plutarch, and the imprint 'Chiswick: printed by C. Whittingham, College House; for the translator, Manor Place, Walworth. 1821.' The Wellcome Library copy, with its number 87906 written at the top.",
    creator: "Thomas Taylor (translator); C. Whittingham, Chiswick (printer)",
    credit: TAYLOR_CREDIT,
    licence: TAYLOR_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "iamb-taylor-1821-epistle-p1",
    passageKey: "greek.iamb.epistle",
    url: taylorPage(29),
    sourcePageUrl: `${TAYLOR_PAGE}?page=29`,
    institution: TAYLOR_INSTITUTION,
    accessionNumber: "Internet Archive b29338888_0002",
    objectDate: "1821",
    caption:
      "Page 1 of Taylor's volume (1821): 'The Epistle of Porphyry to the Egyptian Anebo', beginning 'Porphyry to the Prophet Anebo greeting. I commence my friendship towards you from the Gods and good dæmons, and from those philosophic disquisitions, which have an affinity to these powers.' The page imported as the opening of greek.iamb.epistle.",
    creator: "Thomas Taylor (translator); C. Whittingham, Chiswick (printer)",
    credit: TAYLOR_CREDIT,
    licence: TAYLOR_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "iamb-taylor-1821-answer-p17",
    passageKey: "greek.iamb.answer",
    url: taylorPage(45),
    sourcePageUrl: `${TAYLOR_PAGE}?page=45`,
    institution: TAYLOR_INSTITUTION,
    accessionNumber: "Internet Archive b29338888_0002",
    objectDate: "1821",
    caption:
      "Page 17 of Taylor's volume (1821), headed in black letter 'Iamblichus* on the Mysteries, &c.': 'The Answer of the Preceptor Abammon to the Epistle of Porphyry to Anebo, and a Solution of the Doubts Contained in It', then 'Section I. Chap. I.', beginning 'Hermes, the God who presides over language'. At the foot begins Taylor's footnote: 'The following testimony of an anonymous Greek writer, prefixed to the manuscript of this treatise, which Gale published, proves that this work was written by Iamblichus', and the Greek, which names Proclus.",
    creator: "Thomas Taylor (translator); C. Whittingham, Chiswick (printer)",
    credit: TAYLOR_CREDIT,
    licence: TAYLOR_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- the first printing of the Greek: Gale, Oxford 1678
  {
    key: "iamb-gale-1678-title-page",
    passageKey: "greek.iamb.book",
    url: `${COMMONS}/thumb/8/83/${GALE_PDF}/page13-960px-${GALE_PDF}.jpg`,
    sourcePageUrl: `${GALE_PAGE}?page=13`,
    institution: "Wellcome Collection, London (the scanned copy, via the Internet Archive)",
    accessionNumber: "Internet Archive b3033844x",
    objectDate: "1678 (the date printed on the title page)",
    caption:
      "The title page of the first printing of the Greek, with Gale's Latin version: 'Iamblichou Chalkideōs tēs koilēs Syrias peri mystēriōn logos. Iamblichi Chalcidensis ex Coele-Syria, De mysteriis liber. Præmittitur Epistola Porphyrii ad Anebonem Ægyptium, eodem argumento. Thomas Gale Anglus Græce nunc primum edidit, Latine vertit, & Notas adjecit', with an engraving of the Sheldonian Theatre and the imprint 'Oxonii, e Theatro Sheldoniano, Anno Dom. CIↃ DC LXXVIII' (Oxford, 1678).",
    creator: "Thomas Gale (editor and translator); printed at the Sheldonian Theatre, Oxford",
    credit: "Wellcome Collection, scanned by the Internet Archive (b3033844x), via Wikimedia Commons",
    licence: "Public domain (PD-old-100-expired) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- the first printing of the work: Ficino's Latin, Aldus, Venice 1497
  {
    key: "iamb-aldine-1497-ficino-argumentum",
    passageKey: "greek.iamb.book",
    url: `${COMMONS}/thumb/b/b8/${ALDINE_PDF}/page8-960px-${ALDINE_PDF}.jpg`,
    sourcePageUrl: `${ALDINE_PAGE}?page=8`,
    institution: "Biblioteca de la Universidad de Sevilla (the scanned copy, via the Internet Archive)",
    accessionNumber: "A 335/081; Internet Archive A335081",
    objectDate: "1497 (September, as the file page gives it; the colophon was not read)",
    caption:
      "A leaf from the first printing of the work, Marsilio Ficino's Latin paraphrase printed by Aldus Manutius in Venice (1497), in the Seville copy: Ficino's dedication to Cardinal Giovanni de' Medici, then his 'Argumentum in librum Iamblichi', which says that Porphyry wrote to Anebo and that the book brings in Abammon, an Egyptian priest, answering for his pupil. Ficino's Latin gave the work its title, De mysteriis Aegyptiorum. The Commons rendering of this page is of low resolution; the text was read on the Internet Archive scan of the same copy.",
    creator: "Marsilio Ficino (translator); Aldus Manutius, Venice (printer)",
    credit: "Biblioteca de la Universidad de Sevilla, scanned by the Internet Archive (A335081), via Wikimedia Commons",
    licence: "Public domain (PD-old-100-expired), as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- closely related evidence: Ficino's Latin version in manuscript
  {
    key: "iamb-ficino-prohemium-laurenziana",
    passageKey: "greek.iamb.book",
    url: `${COMMONS}/c/ca/Ficino%2C_De_mysteriis_Aegyptiorum.jpg`,
    sourcePageUrl: `${FILE}Ficino,_De_mysteriis_Aegyptiorum.jpg`,
    institution: "Biblioteca Medicea Laurenziana, Florence (its stamp is on the leaf; the shelfmark is the file page's)",
    accessionNumber: "Strozzi 97, fol. 1r (as the file page says)",
    objectDate: "1491, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — Related evidence, not the Greek text: an illuminated manuscript leaf headed in gold capitals 'Prohemium in Iamblicum', with Marsilio Ficino's dedication of his Latin version to Cardinal Giovanni de' Medici ('Marsilius Ficinus Florentinus ... Johanni Medici Sancte Romane ecclesie Card[inali] ...'); a figure with a book in the initial M, the Medici arms under a cardinal's hat in the lower border, and the stamp of the Biblioteca Medicea Laurenziana. Ficino's Latin gave the work its title, De mysteriis Aegyptiorum.",
    whatIsUnverified:
      "The heading, the dedication and the Laurenziana stamp were read on the image. The shelfmark (Strozzi 97), the folio and the date 1491 are the file page's and were not checked; that the figure in the initial is meant for Ficino is not established.",
    creator: "Marsilio Ficino (translator); an unknown scribe and illuminator",
    credit: "Biblioteca Medicea Laurenziana, via Wikimedia Commons (a two-dimensional reproduction, as the file page says)",
    licence: "Public domain (PD-Art; PD-old-auto-expired), as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  // ---- context: the translator, as his portrait's file page identifies him
  {
    key: "iamb-thomas-taylor-lawrence-portrait",
    passageKey: "greek.iamb.book",
    url: `${COMMONS}/1/1b/Thomas_Taylor_portrait_by_Sir_Thomas_Lawrence.jpg`,
    sourcePageUrl: `${FILE}Thomas_Taylor_portrait_by_Sir_Thomas_Lawrence.jpg`,
    institution: "National Gallery of Canada, Ottawa (the painting, no. 354, as the file page says)",
    accessionNumber: "354 (as the file page says; not checked)",
    objectDate: "Not given on the file page; Lawrence lived 1769–1830",
    caption:
      "UNVERIFIED — Context, not evidence for the text: a black-and-white photograph of an oil portrait of a seated man in dark clothes and a white neckcloth, his right hand on papers on a table, before a curtain and a city with ruins. The file page identifies it as Sir Thomas Lawrence's portrait of Thomas Taylor (1758–1835), the Platonist whose English of 1821 is the text imported here, and says that a burning Rome is in the background and a volume of Plato by his hand.",
    whatIsUnverified:
      "The sitter, the painter, the burning Rome, the book of Plato and the painting's place and number in the National Gallery of Canada are all the file page's; none was checked against the gallery's own record, and the painting is not dated there.",
    creator: "Sir Thomas Lawrence (as the file page says)",
    credit: "Sir Thomas Lawrence; photograph from the National Gallery of Canada, via Wikimedia Commons",
    licence: "Public domain (PD-Art; PD-old-100-expired), as the file page states",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
