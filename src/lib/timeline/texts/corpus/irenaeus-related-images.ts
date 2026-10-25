// PICTURES FOR IRENAEUS, AGAINST HERESIES I.29–31.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). No manuscript page of these three chapters was found on
// Wikimedia Commons, so the pictures are of the work as a whole and of the
// text it is set beside:
// - the title page of the first printed edition (Erasmus, Basel, 1526), which
//   gave the work in its old Latin version, the only form in which these
//   chapters were known before the Greek fragments and the Coptic finds;
// - a page of a Latin manuscript of the work, the opening of Book IV, read on
//   the image; the manuscript's shelfmark and date are the uploader's and are
//   not checked, so it is marked UNVERIFIED;
// - P. Oxy. 405, the papyrus fragments of the lost Greek original (Book III,
//   chapter 9), identified by J. Armitage Robinson as Grenfell and Hunt report
//   (The Oxyrhynchus Papyri IV, 1904, Appendix II): related evidence, not the
//   chapters imported here;
// - two pages of the Berlin Gnostic Codex (P. Berol. 8502), whose copy of the
//   Apocryphon of John is the text Carl Schmidt identified (1896; argued in
//   full in 1907) with the source of I.29: related evidence, not Irenaeus.
//   Mead (1906, p. 583) cites the codex's page 22 for the passage he sets
//   beside I.29.1; whether that is the page shown is not established, so it
//   is marked UNVERIFIED. Page 19 of that codex is
//   already the Apocryphon marker's picture (marker-pictures.ts) and is not
//   repeated.
// Every picture is from a Wikimedia Commons file page, with the licence as
// that page states it, and was looked at before it was added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

export const IRENAEUS_IMAGES: Placed[] = [
  {
    key: "iren-erasmus-1526-title-page",
    passageKey: "gnostic.iren.1",
    url: `${COMMONS}/8/8d/Irenaeus_Contra_haereses_1526_title_page.jpg`,
    sourcePageUrl: `${FILE}Irenaeus_Contra_haereses_1526_title_page.jpg`,
    institution: "Biblioteca Nazionale Centrale di Roma",
    accessionNumber: "14.18.P.9",
    objectDate: "August 1526 (the file page); 'ANNO M. D. XXVI' on the title page",
    caption:
      "The title page of the first printed edition of Against Heresies (Basel: Johann Froben, 1526), edited by Erasmus: 'Opus eruditissimum divi Irenaei episcopi Lugdunensis in quinque libros digestum, in quibus mire retegit & confutat veterum haereseon impias ac portentosas opiniones ... emendatum opera Des. Erasmi Roterodami, ac nunc primum in lucem editum opera Io. Frobenii', with Froben's printer's device of two crowned serpents twined round a staff topped by a dove. This copy is in the national library in Rome; its stamp and the shelfmark 14.18.P.9 are on the page. Erasmus printed only the old Latin version, in which Book I, chapters 29–31 survive.",
    creator: "Desiderius Erasmus (editor); Johann Froben (printer)",
    credit: "Biblioteca Nazionale Centrale di Roma, via archive.org (bub_gb_a5azND-SvoMC) and Wikimedia Commons",
    licence: "Public domain (PD-old-70-expired), as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "iren-latin-manuscript-book-iv-opening",
    passageKey: "gnostic.iren.1",
    url: `${COMMONS}/7/77/Adversus_haereses.jpg`,
    sourcePageUrl: `${FILE}Adversus_haereses.jpg`,
    institution: "British Library (as the file page says; not checked)",
    objectDate: "Second half of the twelfth century, as the file page says; not checked",
    caption:
      "UNVERIFIED — A page of a Latin manuscript of Against Heresies, in two columns, numbered 87 in the corner. The end of a list of chapter titles is followed by a red heading, read here as 'Explicit capitula. Incipit liber quartus', and a large decorated initial Q opening Book IV: 'Quartum hunc librum, dilectissime, transmittens tibi operis quod est de detectione et eversione falsae agnitionis ...'. It shows the Latin version in which Book I, chapters 29–31 survive, not those chapters.",
    whatIsUnverified:
      "Which manuscript this is, and its date. The file page names no shelfmark: it says only that it is a Latin manuscript of the second half of the twelfth century in the British Library, and cites a page of the Library's old illuminated-manuscripts catalogue (IllID 4820) that could not be reached. That the page holds the opening of Book IV of Against Heresies rests on reading the image for this archive.",
    creator: "Unknown scribe",
    credit: "British Library (as the file page says), via Wikimedia Commons",
    licence: "Public domain (PD-Art), as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "iren-p-oxy-405",
    passageKey: "gnostic.iren.1",
    url: `${COMMONS}/e/e6/POxy405.jpg`,
    sourcePageUrl: `${FILE}POxy405.jpg`,
    institution: "Cambridge University Library",
    accessionNumber: "Add. 4413 (P. Oxy. 405)",
    objectDate: "Not checked for this import (the file page says about 200 CE)",
    caption:
      "Related evidence, not the chapters imported here: the papyrus fragments P. Oxy. 405, mounted under glass in a frame labelled 'Univ. Lib. Camb. Ox. 405' and 'Add 4413', with the pieces lettered a to f. Grenfell and Hunt published them in 1903 as an unidentified early Christian work; J. Armitage Robinson identified them as part of the lost Greek original of Irenaeus's Against Heresies, Book III, chapter 9, as Grenfell and Hunt report in The Oxyrhynchus Papyri IV (1904), Appendix II. They were found at Oxyrhynchus in Egypt; the date of the papyrus was not checked for this import.",
    creator: "Unknown scribe; photograph by Cambridge University Library (as the file page says)",
    credit: "Cambridge University Library, via Wikimedia Commons",
    licence: "Public domain (PD-Art), as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "iren-berlin-8502-pages-22-127",
    passageKey: "gnostic.iren.1.29.1",
    url: `${COMMONS}/thumb/2/24/Papyrus_Berlin_8502_%28pages_22_and_127%29.tif/lossy-page1-1280px-Papyrus_Berlin_8502_%28pages_22_and_127%29.tif.jpg`,
    sourcePageUrl: `${FILE}Papyrus_Berlin_8502_(pages_22_and_127).tif`,
    institution: "Staatliche Museen zu Berlin, Ägyptisches Museum und Papyrussammlung",
    accessionNumber: "P. 8502 (pages 22 and 127)",
    objectDate: "Fourth century CE, as the museum gives it ('4. Jh.')",
    caption:
      "UNVERIFIED — Related evidence, not Irenaeus: two papyrus leaves of the Berlin Gnostic Codex (P. Berol. 8502), the Coptic book whose copy of the Apocryphon of John Carl Schmidt identified with the source Irenaeus excerpts in Book I, chapter 29 (announced in 1896, argued in full in 1907). The museum labels them pages 22 and 127. On the right, page 127 ends with a decorated title, read here as 'The Sophia of Jesus Christ', and a band of ornament; on the left is a full page of Coptic text, page 22. Mead (Fragments of a Faith Forgotten, 1906, p. 583), reporting Schmidt's first account of the codex, cites its page 22 for the description of the invisible, unnameable Father that he sets beside the opening of Irenaeus's chapter 29.",
    whatIsUnverified:
      "That the left-hand page is the one Mead cites. The museum gives only the page numbers and the codex's contents (in the order Gospel of Mary, Apocryphon of John, Sophia of Jesus Christ, Acts); Mead cites 'p. 22' of the codex without saying whose numbering he follows, and the Coptic of this page was not read for this import. That the leaves are pages 22 and 127 of P. 8502 is the museum's identification, and that page 127 ends the Sophia of Jesus Christ was read on the image.",
    creator: "Unknown scribe; photograph by Sandra Steiß",
    credit: "Staatliche Museen zu Berlin, Ägyptisches Museum und Papyrussammlung / Sandra Steiß, CC BY-SA 4.0, via Wikimedia Commons",
    licence: "CC BY-SA 4.0, as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
