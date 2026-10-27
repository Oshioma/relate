// PICTURES FOR THE CHALDAEAN ORACLES.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). The oracles survive only as quotations in later writers, so
// there is no manuscript "of the Chaldaean Oracles" to show, and no Commons
// file of the 1895 volume (its title page or its pages) was found. So the
// pictures are:
// - two earlier printings of the oracles that Westcott's preface names among
//   his sources, as they are: the title page of Opsopoeus's Oracula magica
//   Zoroastris cum scholiis Plethonis et Pselli (Paris, 1599), and its p. 16,
//   the opening of the Latin oracles under the heading "Magorum qui a
//   Zoroastre prodiere oracula" (Pletho's recension, which is where the name
//   of Zoroaster comes from); and the opening of "The Chaldaean Oracles of
//   Zoroaster" in Cory's Ancient Fragments (London, 1832), with Cory's
//   footnote on Taylor's marks Z and T. These are what they say they are, so
//   they are secure;
// - closely related evidence, all UNVERIFIED as evidence for the oracles:
//   leaves of fourteenth-century manuscripts of works by Proclus and Psellus,
//   the writers through whom most of the oracles survive (none of the leaves
//   shown is known to carry an oracle), and a manuscript leaf said to be in
//   Pletho's own hand;
// - later likenesses: the Byzantine miniature of Psellus with Michael VII,
//   and the head in Benozzo Gozzoli's fresco traditionally taken for Pletho;
// - a Roman statue of the triple Hecate, the goddess the oracles name (55,
//   65, 66, 187, 194), as related ancient evidence for the figure, not for the
//   oracles' Hecate.
// Considered and left out: other Commons scans of Cory's book (the same
// pages); Hecate reliefs whose identification rests only on a title; and a
// statue of Hecate in a Turkish museum, which is more of the same subject.
// Every picture is from a Wikimedia Commons file page, with the licence as
// that page states it, and was looked at before it was added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

const CORY_PDF =
  "Ancient_fragments_of_the_Phoenician%2C_Chaldean%2C_Egyptian%2C_Tyrian%2C_Carthaginian%2C_Indian%2C_Persian%2C_and_other_writers_%28microform%29-_with_an_introductory_dissertation_and_an_inquiry_into_the_%28IA_ancientfragments00cory%29.pdf";
const CORY_PAGE = `${FILE}Ancient_fragments_of_the_Phoenician,_Chaldean,_Egyptian,_Tyrian,_Carthaginian,_Indian,_Persian,_and_other_writers_(microform)-_with_an_introductory_dissertation_and_an_inquiry_into_the_(IA_ancientfragments00cory).pdf`;

const OPSO_PDF =
  "%CE%A3%CE%B9%CE%B2%CF%85%CE%BB%CE%BB%CE%B9%CE%B1%CE%BA%CE%BF%E1%BD%B6_%CE%A7%CF%81%CE%B7%CF%83%CE%BC%CE%BF%E1%BD%B6_hoc_est%2C_Sibyllina_oracula_ex_uett._codd._aucta%2C_renovata%2C_et_notis_illustrata_a_D._Iohanne_Opsop%C5%93o_Brettano._Cum_interpretatione_Latina_Sebastiani_%28IA_bib_fict_3585385%29.pdf";
const OPSO_PAGE = `${FILE}Σιβυλλιακοὶ_Χρησμοὶ_hoc_est,_Sibyllina_oracula_ex_uett._codd._aucta,_renovata,_et_notis_illustrata_a_D._Iohanne_Opsopœo_Brettano._Cum_interpretatione_Latina_Sebastiani_(IA_bib_fict_3585385).pdf`;

const coryPage = (page: number) => `${COMMONS}/thumb/d/d7/${CORY_PDF}/page${page}-960px-${CORY_PDF}.jpg`;
const opsoPage = (page: number) => `${COMMONS}/thumb/c/c5/${OPSO_PDF}/page${page}-960px-${OPSO_PDF}.jpg`;

const OPSO_CREDIT = "The Johns Hopkins University Sheridan Libraries, scanned by the Internet Archive (bib_fict_3585385), via Wikimedia Commons";
const OPSO_LICENCE = "Public domain (PD-old-100-expired) and Public Domain Mark, as the file page states";
const OPSO_INSTITUTION = "The Johns Hopkins University Sheridan Libraries (the scanned copy, via the Internet Archive)";

const MS_CREDIT = "Via Wikimedia Commons (a two-dimensional reproduction, as the file page says)";
const MS_LICENCE = "Public domain (PD-old-100-expired; PD-Art) and Public Domain Mark, as the file page states";

export const CHALDEAN_ORACLE_IMAGES: Placed[] = [
  // ---- earlier printings of the oracles, named in Westcott's preface
  {
    key: "chald-opsopoeus-1599-title-page",
    passageKey: "greek.chald.book",
    url: opsoPage(625),
    sourcePageUrl: `${OPSO_PAGE}?page=625`,
    institution: OPSO_INSTITUTION,
    accessionNumber: "Internet Archive bib_fict_3585385",
    objectDate: "1599 (the date printed on the title page)",
    caption:
      "The title page of the first printing of the oracles with the commentaries of Pletho and Psellus: 'Oracula magica Zoroastris cum scholiis Plethonis et Pselli nunc primum editi. E Bibliotheca Regia. Studio Johannis Opsopoei. Parisiis, M.D.XCIX', with a woodcut of a ship and the word 'Lutetia' (Paris). It is bound, in this copy, with Opsopoeus's Sibylline Oracles. Westcott's preface lists it among the printed copies of the oracles: 'This includes the Commentaries of Pletho and of Psellus in Latin.' The title calls them 'the magical oracles of Zoroaster', the name Pletho's recension gives them.",
    creator: "Johannes Opsopoeus (editor); printed in Paris",
    credit: OPSO_CREDIT,
    licence: OPSO_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "chald-opsopoeus-1599-magorum-oracula-p16",
    passageKey: "greek.chald.172",
    url: opsoPage(636),
    sourcePageUrl: `${OPSO_PAGE}?page=636`,
    institution: OPSO_INSTITUTION,
    accessionNumber: "Internet Archive bib_fict_3585385",
    objectDate: "1599",
    caption:
      "Page 16 of Opsopoeus's Oracula magica Zoroastris (Paris, 1599), headed 'Magorum qui a Zoroastre prodiere oracula' ('Oracles of the Magi who came from Zoroaster'): the Latin version of the oracles in Pletho's order. Its first lines, 'Exquire animae viam, unde aut qua ratione ...', are the oracle Westcott prints as 172 ('Explore the River of the Soul ...'); then come the oracles he numbers 146 ('Neque deorsum vergas: praecipitium ...', the ladder of seven steps), 95 ('Tuum enim vas bestiae terrae incolent'), 153 and 9, and 164. The matching was made here from the Latin and Westcott's English.",
    creator: "Johannes Opsopoeus (editor); printed in Paris",
    credit: OPSO_CREDIT,
    licence: OPSO_LICENCE,
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "chald-cory-1832-ancient-fragments-chaldaean-oracles",
    passageKey: "greek.chald.1",
    url: coryPage(176),
    sourcePageUrl: `${CORY_PAGE}?page=176`,
    institution: "Columbia University Libraries (the filmed copy, via the Internet Archive)",
    accessionNumber: "Internet Archive ancientfragments00cory",
    objectDate: "1832 (the second edition of Cory's Ancient Fragments, London: William Pickering)",
    caption:
      "The opening of 'The Chaldaean Oracles of Zoroaster' in I. P. Cory's Ancient Fragments (London, 1832), from a microfilm of Columbia University Libraries' copy: the heading 'Cause. God, Father, Mind, Fire, Monad, Duad, Triad', then the first oracle in Greek and English ('But God is he that has the head of a hawk ...', 'Euseb. Praep. Evan. lib. I. c. 10'), Westcott's oracle 1. Cory's footnote explains Taylor's arrangement, which Westcott follows: oracles which Taylor 'conjectures may be ascribed to Zoroaster himself' (the collection of Psellus) marked Z, those 'delivered by Theurgists under the reign of Marcus Antoninus' marked T, and the doubtful 'Z or T'; and a second note says 'Eusebius attributes this to the Persian Zoroaster. I have added it to the collection.'",
    creator: "Isaac Preston Cory (editor and translator); William Pickering, London (publisher)",
    credit: "Columbia University Libraries, filmed and scanned by the Internet Archive (ancientfragments00cory), via Wikimedia Commons",
    licence: "Public domain (PD-old-100-expired) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- closely related evidence: the writers through whom the oracles survive
  {
    key: "chald-proclus-platonic-theology-laud-gr-18",
    passageKey: "greek.chald.5",
    url: `${COMMONS}/b/b5/Proclus%2C_Platonic_Theology%2C_Oxford%2C_MS._Laud._gr._18.jpg`,
    sourcePageUrl: `${FILE}Proclus,_Platonic_Theology,_Oxford,_MS._Laud._gr._18.jpg`,
    institution: "Bodleian Library, Oxford (as the file page says)",
    accessionNumber: "MS. Laud. gr. 18, fol. 2r (as the file page says)",
    objectDate: "1358, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — Related evidence, not a page of the oracles: a manuscript leaf in a Byzantine Greek hand, with a heading in red over the first lines and a large initial A; the file page identifies it as the opening of Proclus's Platonic Theology (1.1) in Oxford, Bodleian Library, MS. Laud. gr. 18, fol. 2r, copied in 1358. The Platonic Theology is one of the works from which Westcott takes oracles ('Proclus in Theologiam Platonis', as under oracles 5, 7, 8 and others). Proclus (412–485) also wrote a commentary on the oracles, now lost.",
    whatIsUnverified:
      "The work, the manuscript, the folio and the date are the file page's; the heading was read only as far as Proclus's name and 'the Theology of Plato'. The leaf is the opening of the book, and no oracle on it was identified: it shows the kind of manuscript in which the oracles survive, not an oracle.",
    creator: "Proclus (author); an unknown scribe",
    credit: MS_CREDIT,
    licence: MS_LICENCE,
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "chald-proclus-timaeus-naples-iii-d-28",
    passageKey: "greek.chald.12",
    url: `${COMMONS}/7/77/Proclus%2C_Commentary_on_the_Timaeus%2C_Naples%2C_III.D.28.jpg`,
    sourcePageUrl: `${FILE}Proclus,_Commentary_on_the_Timaeus,_Naples,_III.D.28.jpg`,
    institution: "Biblioteca Nazionale, Naples (as the file page says)",
    accessionNumber: "Codex III.D.28, fol. 112r (as the file page says)",
    objectDate: "1314, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — Related evidence, not a page of the oracles: a leaf of closely written Greek minuscule, numbered 112 in the corner; the file page identifies it as part of Proclus's Commentary on Plato's Timaeus in Naples, Biblioteca Nazionale, Codex III.D.28, fol. 112r, of 1314. The Commentary on the Timaeus is the source Westcott cites most often ('Proc. in Tim.'), as for this oracle, 'Proc. in Tim., 167'.",
    whatIsUnverified:
      "The work, the manuscript, the folio and the date are the file page's. The Greek was not read, so which part of the Commentary the leaf holds, and whether it quotes an oracle, is not known; Westcott's page numbers refer to a printed edition, not to this manuscript.",
    creator: "Proclus (author); an unknown scribe",
    credit: MS_CREDIT,
    licence: MS_LICENCE,
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "chald-psellos-de-omnifaria-doctrina-laurentian",
    passageKey: "greek.chald.book",
    url: `${COMMONS}/4/4a/Michael_Psellos%2C_De_omnifaria_doctrina%2C_Florence%2C_Plut._86%2C15.jpg`,
    sourcePageUrl: `${FILE}Michael_Psellos,_De_omnifaria_doctrina,_Florence,_Plut._86,15.jpg`,
    institution: "Biblioteca Medicea Laurenziana, Florence (as the file page says)",
    accessionNumber: "Plut. 86,15, fol. 162r (as the file page says)",
    objectDate: "1347, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — Related evidence, not a page of the oracles: a manuscript leaf of short Greek chapters, each under a heading set off by dots (among them 'On the soul' and 'On nature', as far as they were read), with chapter numbers in the margin; the file page identifies it as Michael Psellus's De omnifaria doctrina in Florence, Biblioteca Medicea Laurenziana, Plut. 86,15, fol. 162r, of 1347. Psellus (eleventh century) is the source of the oracles Westcott, after Taylor, marks 'Z', and wrote the commentary on them that Opsopoeus printed.",
    whatIsUnverified:
      "The work, the manuscript, the folio and the date are the file page's. This is a different work by Psellus from his commentary on the oracles, and no oracle on the leaf was identified; the Greek was read only in its headings.",
    creator: "Michael Psellus (author); an unknown scribe",
    credit: MS_CREDIT,
    licence: MS_LICENCE,
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "chald-plethon-autograph",
    passageKey: "greek.chald.book",
    url: `${COMMONS}/3/3d/Plethon_autograph.jpg`,
    sourcePageUrl: `${FILE}Plethon_autograph.jpg`,
    institution: "Not named on the file page (its image came from the Macedonian Heritage website)",
    objectDate: "Early fifteenth century, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — Related evidence: a manuscript page in a small Greek hand, with a heading and an initial in red and a library stamp at the foot, which the file page describes as 'an original early 15th century manuscript in the hand of Georgios Gemistos Plethon'. Pletho (died about 1452–54) made the recension of the oracles that calls them oracles of 'the magi from Zoroaster', the framing the 1895 title follows.",
    whatIsUnverified:
      "That the hand is Pletho's, the date, and the manuscript (which the file page does not name) are the file page's, taken from a website; the heading was not read, so what text the page holds, and whether it is his recension of the oracles, is not known.",
    creator: "Georgios Gemistos Plethon (as the file page says); photographer unknown",
    credit: "Via Wikimedia Commons, from the Macedonian Heritage website",
    licence: "Public domain, as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  // ---- later likenesses
  {
    key: "chald-psellos-and-michael-vii-pantokrator-234",
    passageKey: "greek.chald.book",
    url: `${COMMONS}/d/db/Michael_Psellos.jpg`,
    sourcePageUrl: `${FILE}Michael_Psellos.jpg`,
    institution: "Pantokrator Monastery, Mount Athos (as the file page says)",
    accessionNumber: "Codex 234, fol. 245a in the English and fol. 254a in the Greek of the file page; not checked",
    objectDate: "Twelfth or thirteenth century, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — A later likeness, not evidence for the oracles: a Byzantine miniature on a gold ground of a bearded man in a dark cap and black robe, raising his hand towards a young crowned emperor holding a staff; the inscription over the older man was read as 'Ho Psellos'. The file page identifies them as Michael Psellus and his pupil the emperor Michael VII Doukas. Psellus collected and commented on the oracles Westcott marks 'Z'.",
    whatIsUnverified:
      "The manuscript, its folio (the file page gives two different numbers) and its date are the file page's. A miniature made a century or more after Psellus's death is a conventional figure, not a portrait from life.",
    creator: "Unknown Byzantine illuminator",
    credit: "Pantokrator Monastery, Mount Athos, via Wikimedia Commons",
    licence: "Public domain (PD-old) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "chald-gozzoli-pletho-magi-chapel",
    passageKey: "greek.chald.book",
    url: `${COMMONS}/a/a7/Benozzo_Gozzoli%2C_Pletone%2C_Cappella_dei_Magi.jpg`,
    sourcePageUrl: `${FILE}Benozzo_Gozzoli,_Pletone,_Cappella_dei_Magi.jpg`,
    institution: "Cappella dei Magi, Palazzo Medici Riccardi, Florence (the fresco, as the file page says)",
    objectDate: "Between May 1459 and 1464, as the file page gives it",
    caption:
      "UNVERIFIED — A later likeness: a detail of Benozzo Gozzoli's fresco of the journey of the Magi in the Medici palace chapel in Florence, showing an old man with a long white beard in a tall domed hat with a decorated band among the procession; the file page identifies him as Gemistus Pletho, who came to Florence for the council of 1438–39. Pletho's recension of the oracles is the source of the name 'oracles of Zoroaster'.",
    whatIsUnverified:
      "That the figure is Pletho is a traditional identification, reported by the file page; the fresco does not name him, and it was painted some years after his death. The file page's image came from a website, not from the chapel.",
    creator: "Benozzo Gozzoli (painter)",
    credit: "Benozzo Gozzoli, via Wikimedia Commons",
    licence: "Public domain (PD-old-100-expired; PD-Art) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  // ---- related ancient evidence for the goddess the oracles name
  {
    key: "chald-hecate-chiaramonti-triple-statue",
    passageKey: "greek.chald.187",
    url: `${COMMONS}/6/67/Hecate_Chiaramonti_Inv1922.jpg`,
    sourcePageUrl: `${FILE}Hecate_Chiaramonti_Inv1922.jpg`,
    institution: "Museo Chiaramonti, Vatican Museums (as the file's name and category say)",
    accessionNumber: "Inv. 1922 (as the file page says)",
    objectDate: "Roman, after a Hellenistic original, as the file page describes it; not dated more closely",
    imageDate: "Photographed by Jastrow, 2006, as the file page says",
    caption:
      "UNVERIFIED — Related ancient evidence for the goddess, not for the oracles: a marble statue of three women standing back to back, each in a long belted dress, their arms broken off at the shoulder, under a single crown of spikes; the file page calls it a triple-formed representation of Hecate, a Roman copy after a Hellenistic original, in the Museo Chiaramonti. Westcott's oracles name Hecate several times (55, 65, 66, 194, and here, 'In the left side of Hecate is a fountain of Virtue'); the Hecate of the oracles is a cosmic power, and nothing ties this statue to them.",
    whatIsUnverified:
      "The identification as Hecate, the museum, the inventory number and the description as a copy after a Hellenistic original are the file page's; the museum's own record was not reached. The statue shows the goddess's familiar triple form, not the oracles' conception of her.",
    creator: "Unknown Roman sculptor",
    credit: "Photograph by Jastrow (2006), released into the public domain, via Wikimedia Commons",
    licence: "Public domain (the photographer's own photograph released as public domain), as the file page states",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
