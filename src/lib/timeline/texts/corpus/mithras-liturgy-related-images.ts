// PICTURES OF THE "MITHRAS LITURGY" (PGM IV 475–829) AND ITS SETTING.
//
// The order of preference is the archive's (AGENTS.md, "Timeline research
// image policy"). The papyrus itself, Paris, Bibliothèque nationale de France,
// Supplément grec 574, is on Wikimedia Commons in 73 images from the BnF's own
// digitisation (Gallica, ark:/12148/btv1b525030475), public domain. Two of them
// are used: the library's mounted labels, which give the manuscript's number,
// size, acquisition and its date "IVe siècle", and the leaf numbered 7 whose
// lower half, read on the image for this archive, holds the opening of the
// Ritual. The identification of that leaf rests on reading the image, not on a
// catalogue or an edition's line numbers, so it is marked UNVERIFIED.
//
// The rest is related evidence, not the Ritual: two Roman reliefs that show
// Mithras with the Sun god, whom the Ritual's prayer calls "Sun Mithras, the
// Great God". Whether the Ritual belongs to the Roman cult of Mithras at all is
// disputed (Mead's Preamble says Cumont rejected it "as a genuine Mithriac
// document"), so the captions say the reliefs show the cult, not the rite. The
// reliefs already shown with Hall's chapter on Mithras (the Sidon and London
// tauroctonies) are not repeated. Mead's portrait is the marker's picture
// (marker-pictures.ts). Every picture is from a Wikimedia Commons file page,
// with the licence as that page states it, and was looked at before it was
// added.

import type { Placed } from "./budge-underworld";

const COMMONS = "https://upload.wikimedia.org/wikipedia/commons";
const FILE = "https://commons.wikimedia.org/wiki/File:";

export const MITHRAS_IMAGES: Placed[] = [
  {
    key: "mithras-bnf-suppl-gr-574-labels",
    passageKey: "greek.mithras.1907.ritual",
    url: `${COMMONS}/9/9f/Grand_papyrus_magique_(PGM_IV)_-_btv1b525030475_(01_of_73).jpg`,
    sourcePageUrl: `${FILE}Grand_papyrus_magique_(PGM_IV)_-_btv1b525030475_(01_of_73).jpg`,
    institution: "Bibliothèque nationale de France, Département des Manuscrits",
    accessionNumber: "Supplément grec 574",
    objectDate: "The papyrus: 'IVe siècle', as the library's label states; the labels themselves are nineteenth-century",
    caption:
      "The labels mounted at the front of the Great Paris Magical Papyrus in the Bibliothèque nationale de France. The largest reads 'Opuscules magiques (Papyrus Anastasi) (IVe siècle.) Ms. Supplément grec 574. Papyrus. 36 feuillets. 305 sur 130 millimètres. Demi-reliure. Acquis en 1857', and cites the editions of Miller (1868) and Wessely (1888); a printed note above refers to the sale of the collection of 'M. d'Anastasi, consul général de Suède à Alexandrie' in Paris, 23–27 June 1857, lot no. 1073; a shelf label reads 'SUPPL GR 574'. This is the manuscript that holds the Ritual Mead translates.",
    creator: "Bibliothèque nationale de France (labels)",
    credit: "Bibliothèque nationale de France, Département des Manuscrits, Supplément grec 574, via Gallica and Wikimedia Commons",
    licence: "Public domain (PD-France), as the file page states",
    licenceStatus: "open",
    shows: "historical_document",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "mithras-bnf-suppl-gr-574-leaf-7",
    passageKey: "greek.mithras.1907.1",
    url: `${COMMONS}/8/88/Grand_papyrus_magique_(PGM_IV)_-_btv1b525030475_(14_of_73).jpg`,
    sourcePageUrl: `${FILE}Grand_papyrus_magique_(PGM_IV)_-_btv1b525030475_(14_of_73).jpg`,
    institution: "Bibliothèque nationale de France, Département des Manuscrits",
    accessionNumber: "Supplément grec 574",
    objectDate: "Fourth century CE, the date the library gives the papyrus",
    caption:
      "UNVERIFIED — A leaf of the Great Paris Magical Papyrus (BnF, Supplément grec 574), numbered '7' in pencil at the top, with a pencilled 'Miller, p. 447. (A)' beside it: a column of Greek in a cursive hand. In its lower half, after a short heading read here as θυμοκάτοχον, a new text begins with a line read here as 'ἵλαθί μοι πρόνοια ... ψυχή, τάδε γράφοντι' ('be gracious to me, Providence ... Soul, as I write these things'), the words Mead renders 'O Providence, O Fortune, bestow on me Thy Grace', and further down the name Ἥλιος Μίθρας can be made out. If the reading is right, this is the opening of the Ritual.",
    whatIsUnverified:
      "That this leaf holds the opening of the Ritual. The identification rests on this archive's reading of the image (the words ἵλαθί μοι πρόνοια ... τάδε γράφοντι and Ἥλιος Μίθρας), not on the library's catalogue or on an edition's line numbers; the leaf's place in Preisendanz's numbering (PGM IV 475) was not checked against the edition. That it is a leaf of Supplément grec 574 is secure from its file page.",
    creator: "Unknown scribe (the papyrus)",
    credit: "Bibliothèque nationale de France, Département des Manuscrits, Supplément grec 574, via Gallica and Wikimedia Commons",
    licence: "Public domain (PD-France), as the file page states",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    verificationStatus: "unverified",
  },
  {
    key: "mithras-fiano-romano-banquet-sol",
    passageKey: "greek.mithras.1907.9",
    url: `${COMMONS}/a/a9/Mithras_banquet_Louvre_Ma3441.jpg`,
    sourcePageUrl: `${FILE}Mithras_banquet_Louvre_Ma3441.jpg`,
    institution: "Musée du Louvre",
    accessionNumber: "Ma 3441",
    objectDate: "Second to third century CE, as the file page gives it",
    caption:
      "Related evidence, not the Ritual: the reverse of a two-sided marble relief found at Fiano Romano near Rome in 1926 (Louvre, Ma 3441). Sol, the Sun god, with a crown of rays and a whip, and Mithras, holding a torch, recline together on a bull's hide at a banquet, with torchbearers, a snake coiled round an altar and Luna in the upper corner. It shows the Roman cult pairing Mithras with the Sun; the Ritual's prayer names 'Sun Mithras, the Great God', and in section IX the candidate greets the god he sees as 'O Sun'. Whether the Ritual comes from this cult is disputed.",
    creator: "Unknown Roman sculptor; photograph by Marie-Lan Nguyen (2007)",
    credit: "Marie-Lan Nguyen, via Wikimedia Commons",
    licence: "Public domain (PD-self), as the file page states",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "mithras-vatican-tauroctony-helios-selene",
    passageKey: "greek.mithras.1907.preamble",
    url: `${COMMONS}/5/57/Mitra_tauroctono_e_teste_di_Helios_e_Selene,_II_sec._d.C._-FG.jpg`,
    sourcePageUrl: `${FILE}Mitra_tauroctono_e_teste_di_Helios_e_Selene,_II_sec._d.C._-FG.jpg`,
    institution: "Musei Vaticani, Museo Pio Clementino",
    accessionNumber: "Inv. 870",
    objectDate: "Second century CE, as the file page gives it",
    caption:
      "Related evidence, not the Ritual: a Roman marble relief of Mithras slaying the bull, with the heads of Helios and Selene, the Sun and the Moon, in the Vatican Museums (Museo Pio Clementino, Cortile Ottagono, inv. 870). It shows the Mithraic cult of the Roman Empire that Mead's Preamble takes the Ritual to belong to, a view Mead reports Cumont rejected; the scene of the bull-slaying does not occur in the Ritual.",
    creator: "Unknown Roman sculptor; photograph by Fabrizio Garrisi (2022)",
    credit: "Fabrizio Garrisi, via Wikimedia Commons",
    licence: "CC BY-SA 4.0, as the file page states",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];
