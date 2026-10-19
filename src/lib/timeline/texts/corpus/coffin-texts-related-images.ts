// PICTURES BESIDE THE SPELLS OF THE COFFIN TEXTS.
//
// Photographs that show a given spell on a given coffin are rare and could not
// be found for this archive, so the pictures here are related evidence, each
// placed beside the spell (or Breasted's extract) whose subject it shows:
//
//   - the later Book of the Dead version of a spell, in the Papyrus of Ani or
//     on a New Kingdom tomb wall (Coffin Text 335 became Book of the Dead 17;
//     the Field of Offerings spells became Book of the Dead 110);
//   - the gods and scenes a spell speaks of (Shu holding up the sky, Heka,
//     Isis conceiving Horus over the dead Osiris, the falcon, Hapy, the cat
//     that kills the serpent of chaos), mostly from later centuries;
//   - other Middle Kingdom coffins and papyri that carry Coffin Texts.
//
// None of them is a picture of the spell on the coffin it is filed beside, and
// each caption says what the picture is and how far from the spell it stands.
// Every file page was read and every picture looked at before it was added.
//
// A picture is placed at a spell (`spell`) or at another passage by its key
// (`passageKey`): a Breasted extract, or the Book of Two Ways.

import type { CorpusImage } from "../corpus-types";

type Placed = CorpusImage & { spell?: number; passageKey?: string };

const ANI = {
  institution: "British Museum",
  accessionNumber: "EA 10470",
  objectDate: "Nineteenth Dynasty, c. 1250 BCE (some six centuries after the Coffin Texts)",
} as const;

const MET = {
  institution: "Metropolitan Museum of Art, New York",
  credit: "The Metropolitan Museum of Art (Open Access), via Wikimedia Commons",
  licence: "CC0 1.0",
  licenceStatus: "open",
  verificationStatus: "unverified",
} as const;

export const CT_RELATED_IMAGES: Placed[] = [
  // SPELL 335 → BOOK OF THE DEAD 17 ----------------------------------------
  {
    key: "ct-335-later-bd17-ani",
    spell: 335,
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Ani_LDM_chap17a.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDM_chap17a.jpg",
    imageDate: "2014",
    caption:
      "What this spell became: the opening of Book of the Dead Chapter 17 in the Papyrus of Ani, the New Kingdom descendant of Coffin Text 335 — Ani and Tutu at the game board, their souls as birds, the lions of Yesterday and Tomorrow, the benu bird and the mummy between two kites, above the chapter's columns.",
    creator: "Soutekh67",
    credit: "Soutekh67, via Wikimedia Commons",
    licence: "CC BY-SA 4.0",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },

  // SPELLS 464–468 → BOOK OF THE DEAD 110 ----------------------------------
  {
    key: "ct-466-later-bd110-ani",
    spell: 466,
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Bookofthedead-fieldofreeds.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Bookofthedead-fieldofreeds.jpg",
    caption:
      "What the Field of Offerings became: the Field of Peace (Book of the Dead Chapter 110) in the Papyrus of Ani, strips of farmland framed by water where Ani ploughs, reaps and sails. Middle Kingdom coffins draw the field of these spells as a plan of the same kind.",
    credit: "Wikimedia Commons, from the Vassar College Book of the Dead project",
    licence: "Public domain (PD-Art: a faithful photograph of a public-domain two-dimensional work)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "ct-466-sennedjem-fields-met-facsimile",
    spell: 466,
    ...MET,
    accessionNumber: "30.4.2",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/75/Sennedjem_and_Iineferti_in_the_Fields_of_Iaru_MET_DT11771.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Sennedjem_and_Iineferti_in_the_Fields_of_Iaru_MET_DT11771.jpg",
    objectDate: "Original: Nineteenth Dynasty, c. 1295–1213 BCE",
    imageDate: "1922 (facsimile)",
    caption:
      "The same fields painted in a New Kingdom tomb: a facsimile by Charles K. Wilkinson of Sennedjem and his wife Iineferti ploughing, reaping and tending trees in the Fields of Iaru, on the end wall of his burial chamber at Deir el-Medina (TT 1).",
    creator: "Charles K. Wilkinson",
    shows: "later_artwork",
    identificationStatus: "secure",
  },

  // BREASTED'S EXTRACTS ----------------------------------------------------
  {
    key: "ct-lacau-35-apophis-cat-met-facsimile",
    passageKey: "egy.ct.lacau-xxxv-xxxvi",
    ...MET,
    accessionNumber: "30.4.1",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Cat_Killing_a_Serpent_MET_eg30.4.1.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Cat_Killing_a_Serpent_MET_eg30.4.1.jpg",
    objectDate: "Original: Nineteenth Dynasty, c. 1295–1213 BCE",
    imageDate: "1920–1921 (facsimile)",
    caption:
      "Apophis repulsed, as a later age painted it: a facsimile by Charles K. Wilkinson of the cat of the sun god cutting off the head of the serpent Apep beside the persea tree, in the tomb of Sennedjem at Deir el-Medina (TT 1), some six centuries after the coffins Breasted quotes.",
    creator: "Charles K. Wilkinson",
    shows: "later_artwork",
    identificationStatus: "secure",
  },
  {
    key: "ct-lacau-22-opening-of-the-mouth-hunefer",
    passageKey: "egy.ct.lacau-xxii",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Book_of_the_Dead_of_Hunefer_sheet_5.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Book_of_the_Dead_of_Hunefer_sheet_5.jpg",
    institution: "British Museum",
    accessionNumber: "EA 9901,5",
    objectDate: "Nineteenth Dynasty, c. 1275 BCE",
    caption:
      "The rite this extract speaks of ('I am Horus who opens thy mouth'), as a later papyrus shows it: sheet 5 of the Book of the Dead of Hunefer, where priests perform the opening of the mouth on Hunefer's mummy, held upright by Anubis at the tomb door.",
    credit: "British Museum (free image service), via Wikimedia Commons",
    licence: "Public domain (PD-Art: a faithful photograph of a public-domain two-dimensional work)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // SHU --------------------------------------------------------------------
  {
    key: "ct-75-shu-lifts-nut-greenfield",
    spell: 75,
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Geb%2C_Nut%2C_Shu.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Geb,_Nut,_Shu.jpg",
    institution: "British Museum",
    objectDate: "Twenty-first – early Twenty-second Dynasty, c. 950 BCE",
    caption:
      "The god this spell's speaker becomes, as a much later papyrus draws him: Shu, the air, standing between earth and sky and holding up the arched body of Nut above the reclining Geb, helped by two ram-headed gods, in the Greenfield Papyrus (the Book of the Dead of Nesitanebtashru).",
    creator: "Photograph: British Museum",
    credit: "British Museum photograph, via Wikimedia Commons",
    licence: "Public domain (PD-Art: a faithful photograph of a public-domain two-dimensional work)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  // SPELL 148 — Isis and the conception of Horus ---------------------------
  {
    key: "ct-148-conception-of-horus-dendera",
    spell: 148,
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Conception_of_Horus_1.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Conception_of_Horus_1.jpg",
    institution: "In place, chapel of Osiris on the roof of the temple of Hathor, Dendera",
    objectDate: "Ptolemaic–Roman Period, some two thousand years after the coffins",
    imageDate: "2015",
    caption:
      "The story behind this spell, as a much later temple carved it: Osiris lies on a lion-headed bier and Isis, in the form of a kite, hovers over him to conceive Horus, in a relief in the Osiris chapel at Dendera. Spell 148 is Isis's announcement of that pregnancy.",
    creator: "Photograph by A. Parrot",
    credit: "A. Parrot, via Wikimedia Commons",
    licence: "CC0 1.0",
    licenceStatus: "open",
    shows: "site",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },

  // SPELL 261 — Heka -------------------------------------------------------
  {
    key: "ct-261-heka-stela-brooklyn",
    spell: 261,
    url: "https://upload.wikimedia.org/wikipedia/commons/5/58/Stele_67.119_Brooklyn.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Stele_67.119_Brooklyn.jpg",
    institution: "Brooklyn Museum",
    accessionNumber: "67.119",
    objectDate: "Third Intermediate Period, c. 945–715 BCE",
    caption:
      "One of the rare pictures of the god this spell's speaker becomes: a limestone donation stela that the Brooklyn Museum describes as bearing an image of the god Heka ('Magic') with the goddess Sakhmet, above lines of text ending in a curse. It is more than a thousand years later than the coffins.",
    creator: "Photograph: Brooklyn Museum",
    credit: "Brooklyn Museum, Charles Edwin Wilbour Fund, via Wikimedia Commons",
    licence: "CC BY 3.0",
    licenceStatus: "attribution",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },

  // SPELL 1130 — the creator ------------------------------------------------
  {
    key: "ct-1130-atum-and-horemheb-luxor",
    spell: 1130,
    url: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Luxor_Museum_Statuen_Haremhab_Atum_01.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Luxor_Museum_Statuen_Haremhab_Atum_01.jpg",
    institution: "Luxor Museum (found in the Luxor Temple cachette, 1987)",
    objectDate: "Eighteenth Dynasty, reign of Horemheb",
    imageDate: "2019",
    caption:
      "The creator as the New Kingdom carved him: the god Atum, enthroned and wearing the double crown, receives King Horemheb, who kneels before him with offering jars — diorite statues from the Luxor Temple cachette. The creator who speaks in Spell 1130 is commonly identified with Atum; the statue is several centuries later than the coffins.",
    creator: "Photograph by Olaf Tausch",
    credit: "Olaf Tausch, via Wikimedia Commons",
    licence: "CC BY 3.0 (also GFDL)",
    licenceStatus: "attribution",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },

  // BECOMING A FALCON -------------------------------------------------------
  {
    key: "ct-lacau-16-horus-falcon-louvre",
    passageKey: "egy.ct.lacau-xvi",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Statuette_of_Horus_as_a_falcon-E_10659-IMG_0529-white.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Statuette_of_Horus_as_a_falcon-E_10659-IMG_0529-white.jpg",
    institution: "Musée du Louvre, Department of Egyptian Antiquities",
    accessionNumber: "E 10659",
    objectDate: "Late or Ptolemaic Period, between 404 and 30 BCE",
    imageDate: "2018",
    caption:
      "Related evidence, much later than the coffins: Horus as a falcon wearing the double crown, a bronze statuette inlaid with gold. The spells 'Becoming a falcon' let the dead take the form of this bird, the shape of Horus.",
    credit: "Self-published photograph on Wikimedia Commons (taken in the Louvre, 30 September 2018)",
    licence: "CC BY-SA 3.0 fr (also CC BY-SA 2.0 fr, CeCILL)",
    licenceStatus: "share_alike",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "ct-312-horus-falcon-louvre",
    spell: 312,
    duplicateOf: "ct-lacau-16-horus-falcon-louvre",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Statuette_of_Horus_as_a_falcon-E_10659-IMG_0529-white.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Statuette_of_Horus_as_a_falcon-E_10659-IMG_0529-white.jpg",
    institution: "Musée du Louvre, Department of Egyptian Antiquities",
    accessionNumber: "E 10659",
    objectDate: "Late or Ptolemaic Period, between 404 and 30 BCE",
    imageDate: "2018",
    caption:
      "Related evidence, much later than the coffins: Horus as a falcon in the double crown, a bronze statuette inlaid with gold — the form of the messenger Horus sends to Osiris in this spell.",
    credit: "Self-published photograph on Wikimedia Commons (taken in the Louvre, 30 September 2018)",
    licence: "CC BY-SA 3.0 fr (also CC BY-SA 2.0 fr, CeCILL)",
    licenceStatus: "share_alike",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },

  // OTHER WITNESSES (the work as a whole) ----------------------------------
  {
    key: "ct-papyrus-berlin-10482",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Papyrus_Berlin_10482_%28recto%29.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Papyrus_Berlin_10482_(recto).jpg",
    institution: "Ägyptisches Museum und Papyrussammlung, Berlin",
    accessionNumber: "P. 10482",
    objectDate: "Twelfth Dynasty (some date it to the Eleventh)",
    caption:
      "Coffin Texts on papyrus rather than on a coffin: the recto of Berlin papyrus 10482, a fragmentary Middle Kingdom roll in hieratic that Commons describes as carrying Coffin Texts and an offering ritual. Which spells it holds is not identified here.",
    creator: "Photograph by Sandra Steiß",
    credit: "Staatliche Museen zu Berlin, SMB-digital, via Wikimedia Commons",
    licence: "CC BY-SA 4.0",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];
