// PICTURES BESIDE THE CHAPTERS OF THE BOOK OF THE DEAD.
//
// Each picture is placed at the chapter it helps a reader see. The order of
// preference is the archive's (AGENTS.md, "Timeline research image policy"):
//
//   1. the chapter's own vignette in the Papyrus of Ani, photographed or in
//      Budge's 1890 facsimile;
//   2. the same chapter's vignette in another papyrus or on a tomb wall;
//   3. the kind of object the chapter was written for (a heart scarab for
//      Chapter XXXB, a djed amulet for Chapter CLV), or a scene the chapter
//      names.
//
// An object of the right kind is not the object the chapter was written on:
// the captions say which kind of picture each one is. Where the chapter a
// vignette belongs to rests on an uploader's label that could not be matched
// to Budge's plates, the picture is marked UNVERIFIED. Every file page was
// read and every picture looked at before it was added.

import type { CorpusImage } from "../corpus-types";

type Placed = CorpusImage & { chapter?: string };

/** Fields shared by every picture of the Papyrus of Ani itself. */
const ANI = {
  institution: "British Museum",
  accessionNumber: "EA 10470",
  objectDate: "Nineteenth Dynasty, c. 1250 BCE",
} as const;

/** Budge's 1890 colour facsimile, as scanned for Wasserman's 1994 edition. */
const ANI_FACSIMILE = {
  ...ANI,
  imageDate: "1890 (facsimile)",
  creator: "Facsimile made for the British Museum under E. A. Wallis Budge",
  credit: "Scanned from J. Wasserman et al., The Egyptian Book of the Dead (1994), via Wikimedia Commons",
  licence: "Public domain in the United States (PD-US)",
  licenceStatus: "open",
  shows: "later_artwork",
  verificationStatus: "unverified",
} as const;

const HUNEFER = {
  institution: "British Museum",
  objectDate: "Nineteenth Dynasty, c. 1275 BCE",
  credit: "British Museum (free image service), via Wikimedia Commons",
  licence: "Public domain (PD-Art: a faithful photograph of a public-domain two-dimensional work)",
  licenceStatus: "open",
  shows: "manuscript",
  verificationStatus: "unverified",
} as const;

const MET = {
  institution: "Metropolitan Museum of Art, New York",
  credit: "The Metropolitan Museum of Art (Open Access), via Wikimedia Commons",
  licence: "CC0 1.0",
  licenceStatus: "open",
  verificationStatus: "unverified",
} as const;

export const BD_RELATED_IMAGES: Placed[] = [
  // CHAPTER I — the funeral procession -------------------------------------
  {
    key: "bd-ani-ch1-procession-photo",
    chapter: "1",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Ani_LDMchap1.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDMchap1.jpg",
    caption:
      "The papyrus itself, photographed in the British Museum: part of the funeral procession that heads Chapter I in the Papyrus of Ani — Ani's mummy in its shrine on a sledge, with mourning women and attendants — above the columns of the chapter's text.",
    creator: "Photograph by Buchsweiler",
    credit: "Buchsweiler, via Wikimedia Commons",
    licence: "CC0 1.0",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bd-ani-ch1-procession-continued-photo",
    chapter: "1",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Ani_LDMchap1suite.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDMchap1suite.jpg",
    imageDate: "2010",
    caption:
      "The continuation of the Chapter I vignette in the Papyrus of Ani: servants carry the burial goods, a group of women mourn, a calf and cow are brought, and priests perform the last rites before the mummy at the tomb door, all above the columns of the chapter.",
    creator: "Photograph by Buchsweiler",
    credit: "Buchsweiler, via Wikimedia Commons",
    licence: "CC BY-SA 3.0 (also GFDL)",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bd-hunefer-sheet-4-funeral-procession",
    chapter: "1",
    ...HUNEFER,
    accessionNumber: "EA 9901,4",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Book_of_the_Dead_of_Hunefer_sheet_4.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Book_of_the_Dead_of_Hunefer_sheet_4.jpg",
    caption:
      "The same chapter in another papyrus: sheet 4 of the Book of the Dead of Hunefer, which the British Museum's description gives as Spell 1. Across the top men and oxen drag Hunefer's mummy in its shrine on a sledge, followed by mourners and men with burial goods; the chapter's columns fill the sheet below.",
    identificationStatus: "secure",
  },
  {
    key: "bd-hunefer-sheet-5-opening-of-the-mouth",
    chapter: "23",
    ...HUNEFER,
    accessionNumber: "EA 9901,5",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Book_of_the_Dead_of_Hunefer_sheet_5.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Book_of_the_Dead_of_Hunefer_sheet_5.jpg",
    caption:
      "Related evidence from another papyrus: sheet 5 of the Book of the Dead of Hunefer, where priests perform the opening of the mouth on Hunefer's mummy, held upright by Anubis before the tomb, while the women mourn. Chapter XXIII is the spell for this rite; which chapter the columns beside the scene carry is not identified here.",
    identificationStatus: "secure",
  },

  // CHAPTER XV — hymns to the sun ------------------------------------------
  {
    key: "bd-ani-ch15-ani-and-tutu-facsimile",
    chapter: "15",
    ...ANI_FACSIMILE,
    url: "https://upload.wikimedia.org/wikipedia/commons/2/29/BD_Ani_and_Tutu.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:BD_Ani_and_Tutu.jpg",
    caption:
      "Budge's facsimile of Ani and his wife Tutu standing in adoration before a table piled with offerings, beneath columns of text: probably the vignette of the hymn to Ra that opens the papyrus (Chapter XV, Budge's plate I). The scan's source does not give the plate.",
    identificationStatus: "probable",
  },
  {
    key: "bd-hunefer-sheet-1-hymn-to-ra",
    chapter: "15",
    ...HUNEFER,
    accessionNumber: "EA 9901,1",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/13/Book_of_the_Dead_of_Hunefer_sheet_1.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Book_of_the_Dead_of_Hunefer_sheet_1.jpg",
    caption:
      "The same hymn in another papyrus: sheet 1 of the Book of the Dead of Hunefer, with Hunefer and his wife adoring at the left, columns of a hymn, and at the right the falcon-headed sun god above a djed pillar flanked by goddesses — the rising-sun scene that in Ani's papyrus stands beside Chapter XV. The chapter is identified from the scene, not from a catalogue.",
    identificationStatus: "probable",
  },
  {
    key: "bd-ani-ch16a-sunrise-facsimile",
    chapter: "16a",
    ...ANI_FACSIMILE,
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/BD_Ankh%2C_Djed%2C_and_Sun.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:BD_Ankh,_Djed,_and_Sun.jpg",
    caption:
      "Budge's facsimile of the sunrise vignette in the Papyrus of Ani, which he numbers Chapter XVIA ('a vignette only', plate II): the sun's disk is lifted by an ankh standing on a djed pillar, adored by Isis and Nephthys kneeling and by six baboons.",
    identificationStatus: "secure",
  },
  {
    key: "bd-ani-ch16a-sunrise-photo",
    chapter: "16a",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/1/14/Ani_LDM_part2.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDM_part2.jpg",
    imageDate: "2010",
    caption:
      "The same sunrise vignette photographed on the papyrus in the British Museum, with the end of the hymn's columns beside it: the disk raised on an ankh and djed pillar between Isis and Nephthys.",
    creator: "Photograph by Buchsweiler",
    credit: "Buchsweiler, via Wikimedia Commons",
    licence: "CC BY-SA 3.0 (also GFDL)",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },

  // CHAPTER XVII ------------------------------------------------------------
  {
    key: "bd-ani-ch17-opening-vignettes",
    chapter: "17",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Ani_LDM_chap17a.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDM_chap17a.jpg",
    imageDate: "2014",
    caption:
      "The opening of Chapter XVII in the Papyrus of Ani: across the top, Ani and Tutu in a pavilion at the board game the chapter's title names ('playing at draughts'), their souls as human-headed birds on the tomb, the two lions of Yesterday and Tomorrow back to back under the horizon, the benu bird, and the mummy on its bier between two mourning kites; the chapter's columns run below.",
    creator: "Soutekh67",
    credit: "Soutekh67, via Wikimedia Commons",
    licence: "CC BY-SA 4.0",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bd-ani-ch17-senet-bm-frame-7",
    chapter: "17",
    ...ANI,
    accessionNumber: "EA 10470,7",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Book_of_the_Dead_of_Ani.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Book_of_the_Dead_of_Ani.jpg",
    caption:
      "A closer view of the same opening, from the British Museum's own photograph of frame 7 (which it describes as Spell 17, lines 1–35): Ani and Tutu seated at the game board in their pavilion, and Ani's soul as a bird with a human head, perched twice on the tomb.",
    credit: "British Museum (free image service), via Wikimedia Commons",
    licence: "CC BY-SA 4.0, as given on Commons",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bd-sennedjem-cat-and-serpent-met-facsimile",
    chapter: "17",
    ...MET,
    accessionNumber: "30.4.1",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Cat_Killing_a_Serpent_MET_eg30.4.1.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Cat_Killing_a_Serpent_MET_eg30.4.1.jpg",
    objectDate: "Original: Nineteenth Dynasty, c. 1295–1213 BCE",
    imageDate: "1920–1921 (facsimile)",
    caption:
      "A facsimile by Charles K. Wilkinson of the painting in the tomb of Sennedjem at Deir el-Medina (TT 1): the cat of the sun god cuts off the head of the serpent Apep beside the persea tree. Chapter XVII speaks of 'that cat which fought by the persea tree', and the scene is one of the chapter's vignettes in New Kingdom copies.",
    creator: "Charles K. Wilkinson",
    shows: "later_artwork",
    identificationStatus: "secure",
  },
  {
    key: "bd-inherkha-cat-and-serpent",
    chapter: "17",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Ra_slays_Apep_%28tomb_scene_in_Deir_el-Medina%29.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ra_slays_Apep_(tomb_scene_in_Deir_el-Medina).jpg",
    institution: "In place, tomb of Inherkha (TT 359), Deir el-Medina",
    objectDate: "Twentieth Dynasty, 12th century BCE",
    imageDate: "2004",
    caption:
      "The cat and the serpent on the wall of the tomb of Inherkha (TT 359) at Deir el-Medina: the long-eared cat of the sun god, knife in paw, beheads Apep under the persea tree — the same Chapter XVII scene painted a century or so after Sennedjem's.",
    creator: "Photograph by Hajor",
    credit: "Hajor, via Wikimedia Commons",
    licence: "CC BY-SA 3.0 (also GFDL and CC BY-SA 2.0)",
    licenceStatus: "share_alike",
    shows: "site",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bd-hunefer-sheet-6-vignettes",
    chapter: "17",
    ...HUNEFER,
    accessionNumber: "EA 9901,6",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Book_of_the_Dead_of_Hunefer_sheet_6.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Book_of_the_Dead_of_Hunefer_sheet_6.jpg",
    caption:
      "UNVERIFIED — Sheet 6 of the Book of the Dead of Hunefer: a frieze of small vignettes above the columns — Hunefer kneeling, a heron, a mummy on a bier between two falcons, and seated gods — of the kind that run across the top of Chapter XVII in Ani's papyrus. Which chapter the sheet carries has not been checked.",
    identificationStatus: "unverified",
    whatIsUnverified:
      "That the sheet carries Chapter 17. It is placed here because its vignettes resemble Ani's Chapter 17 frieze; the British Museum record was not consulted.",
  },

  // CHAPTER XVIII -----------------------------------------------------------
  {
    key: "bd-ani-ch18-iunmutef-and-councils",
    chapter: "18",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/0/09/Ani_LDM_18.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDM_18.jpg",
    imageDate: "2013",
    caption:
      "Ani and Tutu adoring at the left, and the priest An-maut-f (Iunmutef, in a leopard skin) presenting Ani to the gods, beside a shrine with the jackal Anubis on top and seated gods of the councils at the right. The uploader identifies it as Chapter XVIII, whose text in Budge begins 'An-maut-f saith: I have come unto you …'; it matches the opening of that chapter.",
    creator: "ShillukinUSA",
    credit: "ShillukinUSA, via Wikimedia Commons",
    licence: "CC BY-SA 3.0",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "probable",
    verificationStatus: "unverified",
  },

  // CHAPTERS XXVI–XXXB — the heart -----------------------------------------
  {
    key: "bd-hatnefer-heart-scarab-met",
    chapter: "30b",
    ...MET,
    accessionNumber: "36.3.2",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Heart_Scarab_of_Hatnefer_MET_36.3.2_EGDP013730.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Heart_Scarab_of_Hatnefer_MET_36.3.2_EGDP013730.jpg",
    objectDate: "Early Eighteenth Dynasty, c. 1492–1473 BCE",
    caption:
      "The kind of object Chapter XXXB was written on: the heart scarab of Hatnefer, mother of Senenmut, a dark stone scarab in a gold mount on a gold chain, laid on the mummy's chest. Its underside (not visible here) is inscribed; whether with this chapter has not been checked against the museum's record.",
    creator: "Photograph: Metropolitan Museum of Art",
    shows: "artefact",
    identificationStatus: "secure",
  },

  // CHAPTER LIX — the sycamore goddess -------------------------------------
  {
    key: "bd-ani-ch59-sycamore-goddess",
    chapter: "59",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a4/D%C3%A9esse_sycomore.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:D%C3%A9esse_sycomore.jpg",
    imageDate: "2010",
    caption:
      "The goddess in the sycamore tree pours water for Ani, who kneels before her: the vignette of the chapter 'of breathing the air, and of having power over the water' (Chapter LIX, Budge's plate XVI). The uploader names the goddess; the chapter is identified from the scene and Budge's list of the papyrus.",
    creator: "Soutekh67",
    credit: "Soutekh67, via Wikimedia Commons",
    licence: "Public domain (released by the uploader)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "probable",
    verificationStatus: "unverified",
  },

  // CHAPTERS LXXXII–LXXXVIII — transformations -----------------------------
  {
    key: "bd-ani-ch82-87-88-transformations",
    chapter: "88",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Ani_LDM_82_87_88.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDM_82_87_88.jpg",
    caption:
      "Three transformation vignettes side by side in the Papyrus of Ani (plate XXVII): a serpent on human legs (Chapter LXXXVII, changing into the serpent Seta), a crocodile on a shrine (Chapter LXXXVIII, changing into a crocodile) and the mummiform god Ptah in his shrine (Chapter LXXXII, changing into Ptah).",
    credit: "Wikimedia Commons, from the Vassar College Book of the Dead project",
    licence: "CC BY-SA 3.0 (also GFDL), as given on Commons",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bd-ani-ch82-87-88-transformations-at-82",
    chapter: "82",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f0/Ani_LDM_82_87_88.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDM_82_87_88.jpg",
    caption:
      "Ptah, mummiform with his staff, in his shrine (at the right of this strip from plate XXVII of the Papyrus of Ani): the vignette of Chapter LXXXII, changing into Ptah, beside those of Chapters LXXXVII and LXXXVIII.",
    credit: "Wikimedia Commons, from the Vassar College Book of the Dead project",
    licence: "CC BY-SA 3.0 (also GFDL), as given on Commons",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
    duplicateOf: "bd-ani-ch82-87-88-transformations",
  },
  {
    key: "bd-ani-ch87-serpent-bm",
    chapter: "87",
    ...ANI,
    accessionNumber: "EA 10470,27",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/be/Nehebkau_-_Spell-87_-Book_of_the_Dead.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Nehebkau_-_Spell-87_-Book_of_the_Dead.jpg",
    caption:
      "The vignette of Chapter LXXXVII, changing into the serpent Seta, cut from the British Museum's photograph of sheet 27 of the Papyrus of Ani: a serpent standing on a man's legs above the start of the chapter's columns.",
    credit: "British Museum photograph, excerpted by Mykola Tarasenko, via Wikimedia Commons",
    licence: "CC BY-SA 4.0, as given on Commons",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },

  // CHAPTER LXXXIX — the ba and the body -----------------------------------
  {
    key: "bd-ani-ch89-ba-over-mummy-facsimile",
    chapter: "89",
    ...ANI_FACSIMILE,
    url: "https://upload.wikimedia.org/wikipedia/commons/9/97/BD_Mummy_and_Ba.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:BD_Mummy_and_Ba.jpg",
    caption:
      "Budge's facsimile of the vignette of Chapter LXXXIX, 'of causing the soul to be united to its body' (plate XVII): Ani's soul, a bird with his head holding a shen ring, hovers over his mummy on a lion-legged bier between two lamps.",
    identificationStatus: "secure",
  },

  // CHAPTER CX — the Field of Peace ----------------------------------------
  {
    key: "bd-ani-ch110-field-of-reeds-photo",
    chapter: "110",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Bookofthedead-fieldofreeds.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Bookofthedead-fieldofreeds.jpg",
    caption:
      "The papyrus itself: the Field of Peace in the Papyrus of Ani, four strips of land framed by blue water, where Ani adores the gods, ploughs with oxen, reaps, and sails, with islands and a boat in the lowest register.",
    credit: "Wikimedia Commons, from the Vassar College Book of the Dead project",
    licence: "Public domain (PD-Art: a faithful photograph of a public-domain two-dimensional work)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bd-sennedjem-fields-of-iaru-met-facsimile",
    chapter: "110",
    ...MET,
    accessionNumber: "30.4.2",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/75/Sennedjem_and_Iineferti_in_the_Fields_of_Iaru_MET_DT11771.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Sennedjem_and_Iineferti_in_the_Fields_of_Iaru_MET_DT11771.jpg",
    objectDate: "Original: Nineteenth Dynasty, c. 1295–1213 BCE",
    imageDate: "1922 (facsimile)",
    caption:
      "The same fields on a tomb wall: a facsimile by Charles K. Wilkinson of the end wall of Sennedjem's burial chamber at Deir el-Medina (TT 1), where Sennedjem and his wife Iineferti plough, reap and tend trees in the Fields of Iaru, a land of fields edged by water.",
    creator: "Charles K. Wilkinson",
    shows: "later_artwork",
    identificationStatus: "secure",
  },

  // CHAPTER CXXV — the hall of judgement -----------------------------------
  {
    key: "bd-ani-ch125-hall-of-maati",
    chapter: "125",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/6/66/Ani_chap125.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_chap125.jpg",
    imageDate: "2010",
    caption:
      "Chapter CXXV in the Papyrus of Ani: a frieze of the forty-two judges seated in a row runs above the columns of the declarations of innocence, and at the right the hall itself, with Ani before the gods, the balance and the ibis-headed Thoth.",
    creator: "Soutekh67",
    credit: "Soutekh67, via Wikimedia Commons",
    licence: "CC BY-SA 3.0 (also GFDL)",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },

  // CHAPTERS CXLVI–CXLVII — gates and halls --------------------------------
  {
    key: "bd-ani-sheet-12-arits-and-pylons",
    chapter: "147",
    ...ANI,
    accessionNumber: "EA 10470,12",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Papyrus_of_Ani_BM_Sheet_12.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Papyrus_of_Ani_BM_Sheet_12.jpg",
    caption:
      "The British Museum's photograph of sheet 12 of the Papyrus of Ani: doorways each guarded by seated animal-headed gods — the halls (arits) of Chapter CXLVII and the pylons of Chapter CXLVI, which Budge prints from plates XI–XII — and at the right Ani and Tutu adoring and the priest who begins Chapter XVIII.",
    credit: "British Museum, via Wikimedia Commons",
    licence: "Public domain (PD-Art: a faithful photograph of a public-domain two-dimensional work)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bd-ani-sheet-12-arits-and-pylons-at-146",
    chapter: "146",
    ...ANI,
    accessionNumber: "EA 10470,12",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Papyrus_of_Ani_BM_Sheet_12.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Papyrus_of_Ani_BM_Sheet_12.jpg",
    caption:
      "Sheet 12 of the Papyrus of Ani, where gateways with their seated guardians illustrate the halls and pylons of the house of Osiris (Chapters CXLVII and CXLVI, Budge's plates XI–XII).",
    credit: "British Museum, via Wikimedia Commons",
    licence: "Public domain (PD-Art: a faithful photograph of a public-domain two-dimensional work)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
    duplicateOf: "bd-ani-sheet-12-arits-and-pylons",
  },

  // CHAPTER CLI — the burial chamber ---------------------------------------
  {
    key: "bd-ani-ch151-mummy-chamber",
    chapter: "151",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Ani_LDM_151.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDM_151.jpg",
    imageDate: "2010",
    caption:
      "Chapter CLI in the Papyrus of Ani, Budge's 'scene in the mummy chamber': Anubis tends the mummy on its bier at the centre, Isis and Nephthys kneel at its foot and head, the four sons of Horus stand at the corners, with the djed pillar, the flames and the jackal on its shrine in the compartments around.",
    creator: "Soutekh67",
    credit: "Soutekh67, via Wikimedia Commons",
    licence: "CC BY-SA 3.0 (also GFDL)",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },

  // CHAPTERS CLV, CLVI, XXIXB, CLXVI — the amulets -------------------------
  {
    key: "bd-ani-plate-33-amulets",
    chapter: "155",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Ani_LDM_chap156.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDM_chap156.jpg",
    imageDate: "2014",
    caption:
      "The amulet chapters in the Papyrus of Ani (Budge's plate XXXIII), each headed by a picture of its amulet: the djed pillar (Chapter CLV, 'a Tet of gold'), the buckle or knot of Isis (CLVI), the heart (XXIXB, 'a heart of carnelian') and the headrest (CLXVI).",
    creator: "Soutekh67",
    credit: "Soutekh67, via Wikimedia Commons",
    licence: "CC BY-SA 3.0",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bd-ani-plate-33-amulets-at-166",
    chapter: "166",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Ani_LDM_chap156.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDM_chap156.jpg",
    imageDate: "2014",
    caption:
      "The headrest drawn at the head of Chapter CLXVI, 'of the pillow which is placed under the head', the last of the four amulet chapters on Budge's plate XXXIII of the Papyrus of Ani.",
    creator: "Soutekh67",
    credit: "Soutekh67, via Wikimedia Commons",
    licence: "CC BY-SA 3.0",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
    duplicateOf: "bd-ani-plate-33-amulets",
  },
  {
    key: "bd-ani-amulet-sheet-bm-gallery",
    chapter: "156",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/1/19/British_Museum_2024-10-03zzu.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:British_Museum_2024-10-03zzu.jpg",
    imageDate: "2024",
    caption:
      "The sheet of the Papyrus of Ani that carries the amulet chapters, photographed in its frame in the British Museum: the four amulets (djed, knot of Isis, heart and headrest) along the top right, a pool ringed by four baboons at the top left, and figures from the mummy-chamber scene of Chapter CLI at the right.",
    creator: "Photograph by Djehouty",
    credit: "Djehouty, via Wikimedia Commons",
    licence: "CC BY-SA 4.0",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bd-ani-amulet-sheet-bm-gallery-at-29b",
    chapter: "29b",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/1/19/British_Museum_2024-10-03zzu.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:British_Museum_2024-10-03zzu.jpg",
    imageDate: "2024",
    caption:
      "The sheet of the Papyrus of Ani with the four amulet chapters, among them Chapter XXIXB, 'of a heart of carnelian', headed by a drawing of a heart-shaped vessel.",
    creator: "Photograph by Djehouty",
    credit: "Djehouty, via Wikimedia Commons",
    licence: "CC BY-SA 4.0",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
    duplicateOf: "bd-ani-amulet-sheet-bm-gallery",
  },
  {
    key: "bd-ani-baboons-and-pool",
    chapter: "126",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/British_Museum_2024-10-03zzv.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:British_Museum_2024-10-03zzv.jpg",
    imageDate: "2024",
    caption:
      "UNVERIFIED — A close view of a sheet of the Papyrus of Ani in the British Museum: a rectangular pool of red water with a small emblem at the middle of each side and a seated baboon at each corner, beside the djed amulet. Elsewhere this picture is the vignette of Chapter CXXVI, the lake of fire guarded by four baboons.",
    creator: "Photograph by Djehouty",
    credit: "Djehouty, via Wikimedia Commons",
    licence: "CC BY-SA 4.0",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "unverified",
    whatIsUnverified:
      "That this vignette in Ani's papyrus belongs to Chapter 126. Budge's list of the papyrus's chapters does not include 126; the placing rests on the iconography alone.",
    verificationStatus: "unverified",
  },
  {
    key: "bd-djed-amulet-met",
    chapter: "155",
    ...MET,
    accessionNumber: "89.2.539",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/22/Djed_pillar_Amulet_MET_DP109385.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Djed_pillar_Amulet_MET_DP109385.jpg",
    objectDate: "Late Period–Ptolemaic Period, 664–30 BCE",
    caption:
      "The kind of amulet Chapter CLV was spoken over: a small green faience djed pillar, the backbone of Osiris and sign of stability. Budge's title for the chapter calls for one of gold; this one is faience.",
    creator: "Photograph: Metropolitan Museum of Art",
    shows: "artefact",
    identificationStatus: "secure",
  },
  {
    key: "bd-tyet-amulet-met",
    chapter: "156",
    ...MET,
    accessionNumber: "00.4.39",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/07/Tit_%28Isis_knot%29_amulet_MET_DP109370.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Tit_(Isis_knot)_amulet_MET_DP109370.jpg",
    objectDate: "Eighteenth Dynasty, c. 1550–1275 BCE",
    caption:
      "The kind of amulet Chapter CLVI was spoken over: a red stone tyet, the knot or 'buckle' of Isis. Budge's title for the chapter calls for 'a buckle of carnelian'; the museum's record of this one's stone was not checked.",
    creator: "Photograph: Metropolitan Museum of Art",
    shows: "artefact",
    identificationStatus: "secure",
  },
  {
    key: "bd-headrest-met",
    chapter: "166",
    ...MET,
    accessionNumber: "12.181.213",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/41/Headrest_MET_DP275979.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Headrest_MET_DP275979.jpg",
    objectDate: "Seventeenth – early Eighteenth Dynasty, c. 1570–1492 BCE",
    caption:
      "A real headrest of the period, seen from the side: a wooden support with a curved top on a column and base, of the kind placed under a mummy's head and drawn at the head of Chapter CLXVI.",
    creator: "Photograph: Metropolitan Museum of Art",
    shows: "artefact",
    identificationStatus: "secure",
  },

  // CHAPTER CLXII — the hypocephalus ---------------------------------------
  {
    key: "bd-hypocephalus-tasheritkhons",
    chapter: "162",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Hypocephalus_of_Tasheritkhons_%28c._305%E2%80%9330_BCE%29%2C_British_Museum%2C_London_-_20080821.jpg",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:Hypocephalus_of_Tasheritkhons_(c._305%E2%80%9330_BCE),_British_Museum,_London_-_20080821.jpg",
    institution: "British Museum",
    accessionNumber: "EA 37909",
    objectDate: "Ptolemaic Period, c. 305–30 BCE",
    imageDate: "2008",
    caption:
      "The object Chapter CLXII was written for: the hypocephalus of Tasheritkhons, a disc of plastered linen laid under the mummy's head, painted with gods in registers and ringed by text. The Commons record states that it is inscribed with Chapter 162, which prescribes such a disc to keep heat in the head.",
    creator: "Photograph by Captmondo",
    credit: "Captmondo, via Wikimedia Commons",
    licence: "CC BY-SA 3.0 (also GFDL and CC BY-SA 2.5)",
    licenceStatus: "share_alike",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },

  // CHAPTER VI — the shabti ------------------------------------------------
  {
    key: "bd-shabti-met-16-10-359",
    chapter: "6",
    ...MET,
    accessionNumber: "16.10.359",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Shabti_MET_16.10.359_front.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Shabti_MET_16.10.359_front.jpg",
    objectDate: "Seventeenth – early Eighteenth Dynasty, c. 1635–1458 BCE",
    caption:
      "The kind of figure Chapter VI makes work for its owner: an early alabaster shabti, mummiform with a wig, from the generation when the shabti spell was taking its Book of the Dead form. No inscription is visible in this view.",
    creator: "Photograph: Metropolitan Museum of Art",
    shows: "artefact",
    identificationStatus: "secure",
  },

  // THE JUDGEMENT SCENE ----------------------------------------------------
  {
    key: "bd-ani-horus-presents-ani",
    chapter: "judgement",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Ani_LDMorts.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDMorts.jpg",
    imageDate: "2014",
    caption:
      "The end of the judgement in the Papyrus of Ani: the falcon-headed Horus leads Ani forward, Ani kneels before an offering table, and Osiris sits enthroned in his shrine with Isis and Nephthys behind him — the presentation the speeches beside the weighing announce.",
    creator: "Soutekh67",
    credit: "Soutekh67, via Wikimedia Commons",
    licence: "CC BY-SA 4.0",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bd-ani-before-osiris-facsimile",
    chapter: "judgement",
    ...ANI_FACSIMILE,
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/BD_Ani_before_Osiris.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:BD_Ani_before_Osiris.jpg",
    caption:
      "Budge's facsimile of the same scene: Ani kneels with offerings before Osiris in his shrine, Isis and Nephthys behind the god, and the four sons of Horus standing on a lotus in front of him.",
    identificationStatus: "secure",
  },

  // CHAPTERS CLXXXV–CLXXXVI — the closing hymns ----------------------------
  {
    key: "bd-ani-ch185-sokar-osiris-facsimile",
    chapter: "185",
    ...ANI_FACSIMILE,
    url: "https://upload.wikimedia.org/wikipedia/commons/6/63/BD_Sokar-Osiris.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:BD_Sokar-Osiris.jpg",
    caption:
      "Budge's facsimile of Sokar-Osiris standing in a shrine, falcon-headed with the white crown and plumes, holding crook, flail and sceptre: one of the closing vignettes of the papyrus, which the Vassar Book of the Dead project assigns to Chapters CLXXXV–CLXXXVI.",
    identificationStatus: "probable",
  },
  {
    key: "bd-ani-ch185-186-closing-vignettes",
    chapter: "185",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Bookofthedead-185186.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Bookofthedead-185186.jpg",
    caption:
      "The closing vignettes of the Papyrus of Ani (to Chapters CLXXXV and CLXXXVI): Sokar-Osiris in his shrine, a heaped offering table, the hippopotamus goddess Taweret, and the cow of Hathor emerging from papyrus thickets at the foot of the western mountain, with a tomb chapel at the right.",
    credit: "Wikimedia Commons, from the Vassar College Book of the Dead project",
    licence: "Public domain (PD-Art: a faithful photograph of a public-domain two-dimensional work)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bd-ani-ch186-hathor-facsimile",
    chapter: "186",
    ...ANI_FACSIMILE,
    url: "https://upload.wikimedia.org/wikipedia/commons/5/58/BD_Hathor_Mistress_of_the_West.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:BD_Hathor_Mistress_of_the_West.jpg",
    caption:
      "Detail of the last vignette in Budge's 1890 facsimile of the Papyrus of Ani: Hathor, Mistress of the West, as a cow with horns, sun disk and menat necklace, coming out of the western mountain through papyrus, with a tomb chapel at the lower right — the goddess the hymn of Chapter CLXXXVI addresses.",
    licence: "Public domain (PD-1923; Public Domain Mark)",
    identificationStatus: "secure",
  },
  {
    key: "bd-ani-ch92-budge-1914",
    chapter: "92",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a6/The_literature_of_the_ancient_Egyptians_%281914%29_%2814596009210%29.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:The_literature_of_the_ancient_Egyptians_(1914)_(14596009210).jpg",
    imageDate: "1914 (printed illustration)",
    caption:
      "UNVERIFIED — A black-and-white plate from Budge's The Literature of the Ancient Egyptians (1914), filed on Commons under the Papyrus of Ani: two men in white kilts stand at either side of an open doorway, a bird flying above it, over columns of hieroglyphs. It is placed here as the vignette of opening the tomb to the soul and shadow, which has not been confirmed.",
    whatIsUnverified:
      "That this plate reproduces the Papyrus of Ani's vignette to Chapter XCII; neither the Commons page nor the book caption seen confirms the chapter.",
    creator: "Illustration in E. A. Wallis Budge, The Literature of the Ancient Egyptians (London, 1914)",
    credit: "Internet Archive Book Images (copy at the University of California), via Flickr and Wikimedia Commons",
    licence: "No known copyright restrictions (Flickr Commons)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "bd-ani-ch186-closing-scene-photo",
    chapter: "186",
    ...ANI,
    url: "https://upload.wikimedia.org/wikipedia/commons/0/09/Ani_LDM_fin.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ani_LDM_fin.jpg",
    imageDate: "2010",
    caption:
      "The last scene of the Papyrus of Ani, the vignette of the hymn to Hathor (Chapter CLXXXVI): Ani and Tutu adoring, Sokar-Osiris in his shrine, offerings, Taweret, and Hathor as a cow coming out of the mountain of the west among papyrus reeds, before a tomb.",
    creator: "Soutekh67",
    credit: "Soutekh67, via Wikimedia Commons",
    licence: "CC BY-SA 3.0 (also GFDL)",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];
