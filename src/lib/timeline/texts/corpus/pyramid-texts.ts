// PYRAMID TEXTS: Sethe's utterances 1–714 in Mercer's English.
//
// The text comes from the generated file beside this one (Mercer 1952, from
// the web edition at sacred-texts.com, split by scripts/texts/mercer-pyramid.py).
// What a reader needs beyond it — summaries, themes, the pyramids that carry
// the texts and their pictures — is written here.
//
// Hierarchy: Mercer's chapter (his grouping of the utterances by subject) →
// utterance. Where Mercer prints a run together ("Utterances 273–274") it is
// one passage keyed by its first number. Utterances 715–759 (Faulkner's
// supplement) are not in Mercer, so the work can never show as complete
// from this file.

import type { CorpusImage, CorpusManuscript, CorpusPassage, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { PYRAMID_UTTERANCES } from "./pyramid-texts-text";

const PREFIX = "egy.pt";

const SOURCES = INVENTORY_SOURCES.filter((s) => ["mercer-pt", "sethe-pt", "faulkner-pt", "allen-pt"].includes(s.key));

const ENGLISH_EVIDENCE =
  "S. A. B. Mercer, The Pyramid Texts in Translation and Commentary (1952), as published by sacred-texts.com, which reports the book as not renewed and so in the public domain in the United States. Mercer translates Sethe's hieroglyphic text; the paragraph numbers at the start of each line (1a, 1b …) are Sethe's.";

/** By Mercer chapter: themes for every utterance in it. */
const CHAPTER_THEMES: Record<number, [string, string][]> = {
  1: [["ascension", "Nut, the sky, receives the king as her son."]],
  2: [["magic-and-sacred-words", "The offering ritual: each gift named and spoken over as the Eye of Horus."]],
  3: [["magic-and-sacred-words", "Prayers and charms."]],
  6: [["magic-and-sacred-words", "Charms against serpents."]],
  7: [["ascension", "The king arrives in the sky and is established there."]],
  9: [["ascension", "The means by which the king reaches the sky."]],
  10: [["ascension", "The king in the sky."]],
  11: [["magic-and-sacred-words", "Charms."]],
  12: [["ascension", "The ferryman and the king's ascent."]],
  17: [["magic-and-sacred-words", "Conjurations and charms."]],
  19: [["ascension", "Praise of Nut, the sky."]],
  21: [["ascension", "Praise of Nut, the sky."]],
  24: [["ascension", "Reed floats and the ferryman that carry the king across to the sky."]],
  28: [["ascension", "A litany of ascension."]],
  30: [["death-and-rebirth", "Resurrection, meal and ascension of the king."]],
  34: [["death-and-rebirth", "The king born anew as a god in the sky."]],
  36: [["death-and-rebirth", "Resurrection and ascension of the king."]],
  37: [["death-and-rebirth", "The resurrection of Osiris."]],
  39: [["sun-and-moon", "An early hymn to the sun."]],
  43: [["ascension", "Resurrection, ascension and reception of the king in the sky."]],
  49: [["death-and-rebirth", "The king's death and his arrival in the sky."]],
  51: [["death-and-rebirth", "Death, resurrection and spiritualisation of the king."]],
  53: [["transformation", "Resurrection and transfiguration of the king."]],
  55: [["ascension", "The king ascends to the sky."]],
};

const SUMMARIES: Record<number, string> = {
  1: "Nut, the sky goddess, proclaims the king her eldest son, with whom she is satisfied.",
  273: "The 'Cannibal Hymn': the sky darkens as the king rises and devours the gods to take their power.",
  527: "Atum creates the first pair of gods, Shu and Tefnut, by himself at Heliopolis.",
  587: "A hymn to the sun god as creator.",
  600: "Atum-Khepri on the high hill at Heliopolis, who spat out Shu and Tefnut; a prayer for the pyramid's endurance.",
};

const UTTERANCE_THEMES: Record<number, [string, string][]> = {
  273: [["transformation", "The king takes the gods' power into himself."]],
  527: [["creation", "Atum's self-creation of the first divine pair."]],
  600: [["creation", "Atum-Khepri on the primeval hill."]],
};

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "pyramid-unas",
    siglum: "W",
    name: "Pyramid of Unas, Saqqara: burial chamber, antechamber and corridor",
    objectKind: "inscription",
    findspot: "Saqqara",
    startYear: -2374,
    endYear: -2344,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "reign of Unas, end of the Fifth Dynasty, c. 2375–2345 BCE",
    datingEvidence: "The king's reign as dated in standard chronologies; the inscription is contemporary with the burial.",
    sourceKey: "sethe-pt",
    notes: "The first inscribed pyramid. Which utterances it carries has not yet been recorded here.",
  },
  {
    key: "pyramid-teti",
    siglum: "T",
    name: "Pyramid of Teti, Saqqara",
    objectKind: "inscription",
    findspot: "Saqqara",
    startYear: -2344,
    endYear: -2332,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "reign of Teti, beginning of the Sixth Dynasty, c. 2345–2333 BCE",
    datingEvidence: "The king's reign as dated in standard chronologies.",
    sourceKey: "sethe-pt",
    notes: "Blocks from its chambers are in museums, among them the Petrie Museum, London.",
  },
];

const IMAGES: (CorpusImage & { manuscriptKey?: string; utterance?: number })[] = [
  {
    key: "petrie-teti-block",
    manuscriptKey: "pyramid-teti",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Limestone_wall_block_fragment_showing_the_cartouche_of_king_Teti_and_funerary_pyramid_texts._6th_Dynasty._From_the_Pyramid_of_Teti%2C_Saqqara%2C_Egypt._The_Petrie_Museum_of_Egyptian_Archaeology%2C_London.jpg",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:Limestone_wall_block_fragment_showing_the_cartouche_of_king_Teti_and_funerary_pyramid_texts._6th_Dynasty._From_the_Pyramid_of_Teti,_Saqqara,_Egypt._The_Petrie_Museum_of_Egyptian_Archaeology,_London.jpg",
    institution: "Petrie Museum of Egyptian Archaeology, UCL, London",
    objectDate: "Sixth Dynasty, c. 2300 BCE",
    imageDate: "2016",
    caption:
      "A limestone block from the pyramid of Teti at Saqqara with the king's cartouche and three columns of Pyramid Text. Which utterance the columns belong to has not been identified here.",
    creator: "Photograph by Osama Shukir Muhammed Amin",
    credit: "Osama Shukir Muhammed Amin, via Wikimedia Commons",
    licence: "CC BY-SA 4.0",
    licenceStatus: "share_alike",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "teti-chamber-texts",
    manuscriptKey: "pyramid-teti",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Hieroglyph_Text_from_Teti_I_pyramid.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Hieroglyph_Text_from_Teti_I_pyramid.jpg",
    institution: "In place, pyramid of Teti, Saqqara",
    objectDate: "Sixth Dynasty, c. 2345–2333 BCE",
    imageDate: "2003",
    caption: "Columns of Pyramid Text carved inside the pyramid of Teti at Saqqara. Which utterances are shown has not been identified here.",
    creator: "Photograph by Chipdawes",
    credit: "Chipdawes, via Wikimedia Commons",
    licence: "Public domain (released by the photographer)",
    licenceStatus: "open",
    shows: "site",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "unas-wall-utt-260-272",
    utterance: 260,
    manuscriptKey: "pyramid-unas",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/49/Pyramid_text_utterance_272_to_260.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Pyramid_text_utterance_272_to_260.jpg",
    institution: "In place, pyramid of Unas, Saqqara",
    objectDate: "End of the Fifth Dynasty, c. 2375–2345 BCE",
    caption:
      "UNVERIFIED — A wall of hieroglyphic columns in the pyramid of Unas, labelled by its uploader as utterances 260 to 272. The labelling, the photographer and the public-domain status are the uploader's and have not been checked.",
    credit: "Uploaded to Wikimedia Commons as from khaledgamean.wordpress.com",
    licence: "Public domain, as claimed on Commons; not established",
    licenceStatus: "unknown",
    shows: "site",
    identificationStatus: "unverified",
    whatIsUnverified: "That the photograph shows utterances 260–272, and who took it.",
    verificationStatus: "unverified",
  },
  {
    key: "unas-wall-utt-277-301",
    utterance: 277,
    manuscriptKey: "pyramid-unas",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/10/Pyramid_text_utterance_301_to_277.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Pyramid_text_utterance_301_to_277.jpg",
    institution: "In place, pyramid of Unas, Saqqara",
    objectDate: "End of the Fifth Dynasty, c. 2375–2345 BCE",
    caption:
      "UNVERIFIED — A wall of hieroglyphic columns in the pyramid of Unas, labelled by its uploader as utterances 277 to 301. The labelling, the photographer and the public-domain status are the uploader's and have not been checked.",
    credit: "Uploaded to Wikimedia Commons as from khaledgamean.wordpress.com",
    licence: "Public domain, as claimed on Commons; not established",
    licenceStatus: "unknown",
    shows: "site",
    identificationStatus: "unverified",
    whatIsUnverified: "That the photograph shows utterances 277–301, and who took it.",
    verificationStatus: "unverified",
  },
];

function imagesFor(utterance: number) {
  const found = IMAGES.filter((image) => image.utterance === utterance).map((image) => {
    const copy: CorpusImage & { manuscriptKey?: string; utterance?: number } = { ...image };
    delete copy.utterance;
    delete copy.manuscriptKey;
    return copy;
  });
  return found.length > 0 ? found : undefined;
}

function chapterLabel(title: string) {
  // "12. THE FERRYMAN AND …, UTTERANCES 300-311." → "The ferryman and …"
  const words = title
    .replace(/^\d+\.\s*/, "")
    .replace(/,?\s*UTTERANCES?\s+[\d\s-–]+\.?$/i, "")
    .toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function buildPassages(): CorpusPassage[] {
  const passages: CorpusPassage[] = [];
  const chapters = new Map<number, typeof PYRAMID_UTTERANCES>();
  for (const row of PYRAMID_UTTERANCES) {
    if (!chapters.has(row[2])) chapters.set(row[2], []);
    chapters.get(row[2])!.push(row);
  }
  for (const [chapter, rows] of [...chapters].sort((a, b) => a[0] - b[0])) {
    const chapterKey = `${PREFIX}.ch-${chapter}`;
    const first = rows[0][0];
    const last = rows[rows.length - 1][1];
    passages.push({
      key: chapterKey,
      divisionKind: "chapter",
      label: `${chapterLabel(rows[0][3])} (Utt. ${first === last ? first : `${first}–${last}`})`,
      reference: `Mercer, chapter ${chapter}`,
      sourceKey: "mercer-pt",
      verificationStatus: "unverified",
      notes: "Mercer's grouping of the utterances by subject. Sethe's numbering, not Mercer's chapters, is the reference.",
      layers: [],
      themes: CHAPTER_THEMES[chapter]?.map(([themeKey, note]) => ({ themeKey, note })),
    });
    for (const [utterance, through, , , english] of [...rows].sort((a, b) => a[0] - b[0])) {
      const themes = [...(CHAPTER_THEMES[chapter] ?? []), ...(UTTERANCE_THEMES[utterance] ?? [])];
      const span = through > utterance ? `${utterance}–${through}` : `${utterance}`;
      passages.push({
        key: `${PREFIX}.${utterance}`,
        parentKey: chapterKey,
        divisionKind: "utterance",
        label: through > utterance ? `Utterances ${span}` : `Utterance ${span}`,
        reference: `PT ${span} (Sethe)`,
        sourceKey: "mercer-pt",
        summary: SUMMARIES[utterance],
        verificationStatus: "unverified",
        notes: through > utterance ? `Mercer prints utterances ${span} as one piece; they are kept together here.` : undefined,
        layers: [
          english.trim()
            ? {
                key: "eng-mercer",
                layer: "translation",
                sourceKey: "mercer-pt",
                content: english,
                language: "English",
                licence: "public_domain_us",
                evidence: ENGLISH_EVIDENCE,
              }
            : {
                key: "eng-mercer",
                layer: "translation",
                sourceKey: "mercer-pt",
                contentAbsentReason: "The web edition prints the heading of this utterance with no text under it.",
                language: "English",
                licence: "public_domain_us",
                evidence: ENGLISH_EVIDENCE,
              },
        ],
        themes: themes.length > 0 ? themes.map(([themeKey, note]) => ({ themeKey, note })) : undefined,
        images: imagesFor(utterance),
      });
    }
  }
  return passages;
}

export const PYRAMID_TEXTS_CORPUS: TextCorpusFile = {
  workKey: "egy.pyramid-texts",
  revision: "mercer-2026-10",
  sources: SOURCES,
  manuscripts: MANUSCRIPTS,
  images: IMAGES.filter((image) => image.utterance == null).map((image) => {
    const copy: CorpusImage & { manuscriptKey?: string; utterance?: number } = { ...image };
    delete copy.utterance;
    return copy;
  }),
  passages: buildPassages(),
};
