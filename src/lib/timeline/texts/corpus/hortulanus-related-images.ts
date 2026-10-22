// PICTURES OF HORTULANUS'S COMMENTARY AND THE 1597 MIRROR OF ALCHIMY.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). First the primary evidence: the title page of the 1597 book
// the English is taken from, and its printer's device cut from the same page
// (marked duplicateOf, since it is a crop of the same photograph). Then related
// evidence: a seventeenth-century Latin edition of the Tablet (Kriegsmann,
// 1657), and a fifteenth-century alchemical manuscript picture that Commons
// describes as the finding of the Tablet, marked UNVERIFIED because that
// identification rests on the file page alone. Every picture is from a
// Wikimedia Commons file page, with the licence as that page states it, and
// was looked at before it was added.
//
// The two pictures already on the work's timeline marker (the Tablet in De
// Alchemia, 1541, Emerald_Tablet_Johannes_Petreius.jpg, and Khunrath's
// engraving, Smaragdtafel_-_Amphitheatrum_sapientiae_aeternae.jpg) are not
// repeated, nor are the 1541 page and Khunrath plate already on the Emerald
// Tablet's vulgate (Table_Emeraude_Chrysogonus.jpg, Wellcome M0012393). The
// Petreius page was looked at for this stage: it is p. 363 of De Alchemia,
// with the whole Tablet and the catchword "Hortula-" at its foot, so the
// commentary itself begins overleaf and is not on it. No picture of the first
// page of Hortulanus's Latin commentary, or of a manuscript of it, was found on
// Commons. Also looked at and left out: "The Mirror of Alchimy (1597) -
// initial I.png" (an ornamental initial from the preface to Bacon's Mirror,
// not from Hortulanus) and its companions "initial S" and "fleuron".

import type { Placed } from "./budge-underworld";

export const HORTULANUS_IMAGES: Placed[] = [
  {
    key: "hortulanus-mirror-1597-title-page",
    passageKey: "arab.comm.hort",
    manuscriptKey: "countway-1597",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Mirror_of_Alchimy.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Mirror_of_Alchimy.jpg",
    institution: "Francis A. Countway Library of Medicine, Boston (the copy, identified here from its scan)",
    objectDate: "1597",
    caption:
      "The title page of the book the English is taken from: 'THE Mirror of Alchimy, Composed by the thrice-famous and learned Fryer, Roger Bachon ... With certaine other worthie Treatises of the like Argument', with the motto 'Vino vendibili non opus est hedera', the printer's device, and 'LONDON Printed for Richard Oliue. 1597.' The 'certaine other worthie Treatises' include the Smaragdine Table and Hortulanus's commentary; the title page names Bacon, not the translator. The owners' signatures ('J. L. Comstock', 'Neile') are those of the Countway Library copy scanned by the Internet Archive.",
    creator: "Thomas Creede (printer) for Richard Olive",
    credit: "Wikimedia Commons (uploaded 2013)",
    licence: "Public domain in the United States (PD-US), as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "hortulanus-mirror-1597-printers-device",
    passageKey: "arab.comm.hort",
    manuscriptKey: "countway-1597",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f3/The_Mirror_of_Alchimy_%281597%29_-_title_page_woodcut.png",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:The_Mirror_of_Alchimy_(1597)_-_title_page_woodcut.png",
    institution: "Francis A. Countway Library of Medicine, Boston (Internet Archive mirrorofalchimy00baco)",
    objectDate: "1597",
    caption:
      "The woodcut on the same title page, cut out of the Countway copy's scan: the device of the printer Thomas Creede, a naked crowned woman (Truth) struck by a hand reaching from a cloud, inside an oval with the motto 'VIRESCIT VULNERE VERITAS' (truth flourishes by being wounded) and the initials 'TC'. It is the printer's mark, not an alchemical picture.",
    creator: "Unknown woodcutter; device of Thomas Creede",
    credit: "Internet Archive scan, via Wikimedia Commons",
    licence: "Public domain (PD-scan; PD-old-100-expired) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
    duplicateOf: "hortulanus-mirror-1597-title-page",
  },
  {
    key: "hortulanus-kriegsmann-1657-tabula-smaragdina",
    passageKey: "arab.comm.hort.tablet",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Fotothek_df_tg_0006097_Theosophie_%5E_Alchemie.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Fotothek_df_tg_0006097_Theosophie_%5E_Alchemie.jpg",
    institution: "Deutsche Fotothek, SLUB Dresden",
    accessionNumber: "df_tg_0006097 (SLUB Chem.1040)",
    objectDate: "1657, as the file page gives it",
    caption:
      "Related evidence, later than the commentary: the engraved title of Wilhelm Christoph Kriegsmann's edition of the Tablet, 'Hermetis Trismegisti ... Tabula Smaragdina ... nunc demum pristino Genio vindicata', with a line of letters in an unfamiliar script after the words 'Phoenicum Aegyptiorum', a picture of the Sun, the Earth and the Moon, a verse of Deuteronomy on the fruits of the Sun and Moon, and Arnald of Villanova's Testament added. It shows the Tablet still being edited and read as alchemy sixty years after the English of 1597; it is not Hortulanus's commentary.",
    creator: "Wilhelm Christoph Kriegsmann (editor); engraver not named",
    credit: "Deutsche Fotothek / SLUB Dresden, via Wikimedia Commons",
    licence: "Public domain (PD-old-100) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "hortulanus-aurora-consurgens-zurich-f3r-tablet",
    passageKey: "arab.comm.hort.tablet",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Aurora_consurgens_zurich_007_f-3r-7_building.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Aurora_consurgens_zurich_007_f-3r-7_building.jpg",
    institution: "Zentralbibliothek Zürich",
    accessionNumber: "Ms. Rh. 172, f. 3r (as the file page gives it)",
    objectDate: "Fifteenth century, as the file page gives it",
    caption:
      "UNVERIFIED — A painting in a fifteenth-century copy of the alchemical book Aurora consurgens: in a house roofed with blue birds, under a heading on 'the treasure-house which Wisdom founded', an old man in blue sits holding a board painted with suns, moons and vessels, while three men point at him from the doorway. The Commons file page calls it 'the discovery of the Emerald Tablet'; the picture has no inscription that says so. It is related evidence of how alchemists of the century after Hortulanus pictured a sage's tablet of secrets, not a picture of his commentary.",
    creator: "Unknown illuminator",
    credit: "Zentralbibliothek Zürich (e-codices), via Wikimedia Commons",
    licence: "Public domain (PD-old-70) and Public Domain Mark, as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    whatIsUnverified:
      "That the scene shows the finding of the Emerald Tablet: this is the Commons file page's description, not checked against Zentralbibliothek Zürich's catalogue or the Aurora consurgens text; the board the old man holds carries pictures, not the Tablet's words. The folio and date are also as the file page gives them.",
    verificationStatus: "unverified",
  },
];
