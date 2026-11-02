// PICTURES FOR PLUTARCH, ON ISIS AND OSIRIS.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). No manuscript leaf of this essay is on Commons under a name
// that could be checked, so the pictures are:
// - the first printing of the Greek Moralia, the Aldine of 1509, at its title
//   page, which was read on the image ('PLVTARCHI OPVSCVLA. LXXXXII.', with
//   Aldus's dolphin and anchor). It is what it says it is, so it is secure;
//   the date is the file page's, since the title page bears none;
// - closely related evidence, UNVERIFIED in its identification: the marble
//   pillar at Delphi whose inscription names a Plutarch honoured by the
//   Delphians and Chaeroneans (read on the image), and the bust shown with it
//   that the museum and the file page take for Plutarch;
// - Egyptian evidence for the myth Plutarch retells, UNVERIFIED in its
//   details: the stone bed of Osiris found in the tomb of King Djer at
//   Abydos, the place Plutarch names (chapter 20) as where Egyptians wished to
//   be buried 'in the same ground with the body of Osiris'; and a relief on
//   the roof of the temple at Dendera of Osiris on his bier between two
//   winged goddesses. These are Egyptian, centuries apart from
//   Plutarch and from each other, and are not illustrations of his text;
// - closely related evidence for the essay's transmission, UNVERIFIED in its
//   details: the opening leaf of a Greek manuscript of the Moralia, whose
//   heading was read on the image, but which shows another essay;
// - context, UNVERIFIED as to what Plutarch meant: the temple of Isis at
//   Philae, near (not on) the 'sacred island by Philae' of chapter 20.
// Considered and left out: the Dendera relief of the conception of Horus
// ("Conception of Horus 1.jpg"), already shown on Coffin Text spell 148,
// to which chapter 19 links; Met statuettes of Isis and Horus and of Osiris,
// whose images could not be fetched (the image server refused with rate
// limits); and a second, closer photograph of the same bust ("Head of a
// philosopher - Archaeological Museum of Delphi.jpg"), a duplicate of the one
// used. Every picture is from a Wikimedia Commons file
// page, with the licence as that page states it, and was looked at before it
// was added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

export const PLUTARCH_ISIS_OSIRIS_IMAGES: Placed[] = [
  // ---- the first printing of the Greek: the Aldine Moralia, 1509
  {
    key: "plut-aldine-1509-moralia-title-page",
    passageKey: "greek.plut.book",
    url: `${COMMONS}/6/6f/Plutarch%27s_Moralia%2C_Aldine_edition_%28March_1509%29%2C_title_page.jpg`,
    sourcePageUrl: `${FILE}Plutarch%27s_Moralia,_Aldine_edition_(March_1509),_title_page.jpg`,
    institution: "Simon Fraser University Library, Burnaby (the scanned copy, as the file page says)",
    objectDate: "March 1509, as the file page gives it; the title page bears no date and the colophon was not read",
    caption:
      "The title page of the first printing of Plutarch's Moralia in Greek, the Aldine edition: 'PLVTARCHI OPVSCVLA. LXXXXII.' (ninety-two short works of Plutarch), with a Latin note on the table of contents and Aldus Manutius's device, a dolphin wound about an anchor. The file page says it was edited by Demetrius Ducas and printed in Venice in 1509. On Isis and Osiris is among the essays printed: Babbitt's apparatus cites readings of 'the Aldine ed.' in it.",
    creator: "Demetrius Ducas (editor); Aldus Manutius, Venice (printer), as the file page says",
    credit: "Simon Fraser University Library (digital.lib.sfu.ca/aldine/opuscula), via Wikimedia Commons",
    licence: "Public domain, as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // ---- closely related evidence: a manuscript of the Moralia
  {
    key: "plut-venice-gr-248-moralia-opening",
    passageKey: "greek.plut.book",
    url: `${COMMONS}/4/42/Plutarch%2C_De_virtute_et_vitio%2C_Venice%2C_Gr._248.jpg`,
    sourcePageUrl: `${FILE}Plutarch,_De_virtute_et_vitio,_Venice,_Gr._248.jpg`,
    institution: "Biblioteca Nazionale Marciana, Venice (inferred from the shelfmark in the file name; the file page names no library)",
    accessionNumber: "Gr. 248 (from the file name; not checked)",
    objectDate: "Not given on the file page; it says only that the manuscript was written for Bessarion (died 1472)",
    caption:
      "UNVERIFIED — Related evidence, not this essay: the illuminated opening leaf of a Greek manuscript of Plutarch's Moralia, headed in gold capitals ΠΛΟΥΤΑΡΧΟΥ ΧΑΙΡΩΝΕΩΣ ΗΘΙΚΑ · ΠΟΛΙΤΙΚΑ · ΦΥΣΙΚΑ ΚΑΙ ΠΑΝΤΟΔΑΠΑ ΣΥΓΓΡΑΜΜΑΤΑ · ΑΡΧΗ ΤΩΝ ΗΘΙΚΩΝ · ΠΕΡΙ ΑΡΕΤΗΣ ΚΑΙ ΚΑΚΙΑΣ · ΛΟΓΟΣ Α ('Of Plutarch of Chaeronea, ethical, political, physical and miscellaneous writings; beginning of the ethical ones: On Virtue and Vice, essay 1'), in an interlace border with portrait medallions and, at the foot, arms under a red cardinal's hat. The file page says it was written for Cardinal Bessarion. It shows how the Moralia, On Isis and Osiris among them, came down in manuscript; the leaf itself is another essay.",
    whatIsUnverified:
      "The heading was read on the image. That the volume was written for Bessarion is the file page's; the library and shelfmark are taken from the file name, and the date, the scribe and whether this manuscript contains On Isis and Osiris were not checked.",
    creator: "An unknown scribe and illuminator",
    credit: "Via Wikimedia Commons (a reproduction of a manuscript in an Italian state library, as the file page's restriction notice indicates)",
    licence: "Public domain, as the file page states, with the Italian cultural-heritage restriction (ita-mibac) it notes",
    licenceStatus: "restricted",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  // ---- closely related evidence: Plutarch honoured at Delphi
  {
    key: "plut-delphi-inscribed-pillar",
    passageKey: "greek.plut.book",
    url: `${COMMONS}/3/38/Plutarch_stele_inscription_100_AD%2C_AM_of_Delphi_4070060092.jpg`,
    sourcePageUrl: `${FILE}Plutarch_stele_inscription_100_AD,_AM_of_Delphi_4070060092.jpg`,
    institution: "Archaeological Museum of Delphi (as the file page says)",
    objectDate: "About 100 CE, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — Related evidence, not the text: the inscribed top of a marble pillar in the Archaeological Museum of Delphi, reading ΔΕΛΦΟΙ ΧΑΙΡΩΝΕΥΣΙΝ ΟΜΟΥ / ΠΛΟΥΤΑΡΧΟΝ ΕΘΗΚΑΝ / ΤΟΙΣ ΑΜΦΙΚΤΥΟΝΩΝ / [ΔΟΓΜΑ]ΣΙ ΠΕΙΘΟΜΕΝΟΙ, 'The Delphians together with the Chaeroneans set up Plutarch, obeying the decrees of the Amphictyons' (the last line is damaged; its first word is restored after the file page). Plutarch of Chaeronea was a priest of Apollo at Delphi, and wrote this essay for Clea, a priestess there.",
    whatIsUnverified:
      "The inscription names a Plutarch honoured by Delphi and Chaeronea, and was read on the image; that it honours the author of this essay, and the date of about 100 CE, are the file page's and were not checked against a published edition of the inscription.",
    creator: "Unknown; photograph by Zde",
    credit: "Zde, via Wikimedia Commons",
    licence: "CC BY-SA 3.0, as the file page states",
    licenceStatus: "share_alike",
    shows: "artefact",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "plut-delphi-bust",
    passageKey: "greek.plut.book",
    url: `${COMMONS}/4/49/Plutarch_at_Delphi.jpg`,
    sourcePageUrl: `${FILE}Plutarch_at_Delphi.jpg`,
    institution: "Archaeological Museum of Delphi, room XIV (as the file page says)",
    objectDate: "2nd or 3rd century CE, as the file page gives it; not checked",
    caption:
      "UNVERIFIED — A marble bust of a bearded man with thick wavy hair, the nose broken, in the Archaeological Museum of Delphi. The file page calls it a 'bust believed to represent' Plutarch, shown beside the inscribed pillar honouring Plutarch, and says both were found near the temple of Apollo. No likeness of Plutarch is identified by an inscription on the bust itself.",
    whatIsUnverified:
      "That the bust represents Plutarch is a belief, as the file page says; that it belongs with the inscribed pillar, its date (2nd or 3rd century CE), its marble and its findspot are the file page's and were not checked.",
    creator: "Unknown sculptor; photograph by Odysses",
    credit: "Odysses, via Wikimedia Commons",
    licence: "CC BY-SA 4.0, as the file page states",
    licenceStatus: "share_alike",
    shows: "portrait",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  // ---- Egyptian evidence for the myth Plutarch retells
  {
    key: "plut-osiris-bed-abydos",
    passageKey: "greek.plut.20",
    url: `${COMMONS}/8/86/OsirisBed.jpg`,
    sourcePageUrl: `${FILE}OsirisBed.jpg`,
    institution: "Egyptian Museum, Cairo (as the file page says)",
    accessionNumber: "JE 32090 (as the file page says; not checked)",
    objectDate: "13th dynasty, by the king's name the file page reports; not checked",
    caption:
      "UNVERIFIED — Egyptian evidence, not an illustration of Plutarch: a dark stone figure of Osiris lying on a bier with lion heads and lion's feet, a falcon on his body and other falcons at the corners, the stone broken and mended. The file page says it is the 'Bed of Osiris', Cairo JE 32090, from the tomb of Djer (a First Dynasty king, buried at Abydos), and inscribed with the name of the Thirteenth Dynasty king Djedkheperew. Plutarch (chapter 20) says that prosperous Egyptians wished to be buried at Abydos 'in the same ground with the body of Osiris'.",
    whatIsUnverified:
      "The museum number, the findspot in Djer's tomb, the king's name inscribed and so the date are the file page's and were not checked against the Cairo museum's record; that the falcon on the body is Isis is a common reading, not established here.",
    creator: "Unknown Egyptian sculptor; photograph by Juan R. Lazaro",
    credit: "Juan R. Lazaro, via Wikimedia Commons",
    licence: "CC BY-SA 3.0, as the file page states",
    licenceStatus: "share_alike",
    shows: "artefact",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "plut-dendera-roof-bier-of-osiris",
    passageKey: "greek.plut.18",
    url: `${COMMONS}/b/b6/Bier_of_Osiris_on_the_roof.jpg`,
    sourcePageUrl: `${FILE}Bier_of_Osiris_on_the_roof.jpg`,
    institution: "Temple of Hathor, Dendera, roof (as the file page says)",
    objectDate: "Not given on the file page",
    caption:
      "UNVERIFIED — Egyptian evidence, not an illustration of Plutarch: a sunk relief on a sandstone wall of a mummiform figure lying on a lion bier, between two winged goddesses who stretch their wings over him, under and between columns of hieroglyphs. The file page describes it as a relief in the roof areas of Dendera Temple, 'showing the bier of Osiris flanked by Nephthys (left) and Isis (right)'. Plutarch (chapter 18) tells how Isis sought the scattered parts of Osiris and held a funeral for each.",
    whatIsUnverified:
      "The identification of the figures and the place on the temple roof are the file page's; the hieroglyphs were not read and the relief is not dated there (the temple is of the Ptolemaic and Roman periods).",
    creator: "Unknown Egyptian sculptors; photograph by A. Parrot",
    credit: "A. Parrot, via Wikimedia Commons",
    licence: "CC0 (Creative Commons Zero, public domain dedication), as the file page states",
    licenceStatus: "open",
    shows: "site",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  // ---- context: the temple of Isis at Philae
  {
    key: "plut-philae-temple-of-isis",
    passageKey: "greek.plut.20",
    url: `${COMMONS}/d/dc/Temple_of_Isis_in_Philae.jpg`,
    sourcePageUrl: `${FILE}Temple_of_Isis_in_Philae.jpg`,
    institution: "In place, Philae (the temple as moved to Agilkia island)",
    objectDate: "Not given on the file page",
    caption:
      "UNVERIFIED — Context, not the place Plutarch describes: a colour photograph of a temple with two great carved pylons and a court, under a blue sky, which the file page identifies as the temple of Isis at Philae. Plutarch (chapter 20) speaks of 'the sacred island by Philae', where the tomb of Osiris was said to be; that is a neighbouring island, not this temple.",
    whatIsUnverified:
      "The identification is the file page's (it says only 'Temple of Isis in Philae'); which island Plutarch means is not settled here, and the photograph is not of it. The temple was moved from Philae island to Agilkia in the twentieth century; the photograph is of it where it now stands.",
    creator: "M.ramadan2014 (photograph)",
    credit: "M.ramadan2014, via Wikimedia Commons",
    licence: "CC BY-SA 3.0, as the file page states",
    licenceStatus: "share_alike",
    shows: "site",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
];
