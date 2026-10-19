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
import { PT_RELATED_IMAGES } from "./pyramid-texts-related-images";
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
  {
    key: "pyramid-pepi-i",
    siglum: "P",
    name: "Pyramid of Pepi I, Saqqara",
    objectKind: "inscription",
    findspot: "Saqqara",
    startYear: -2331,
    endYear: -2286,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "reign of Pepi I, Sixth Dynasty (2332–2287 BCE as given with the Petrie Museum block on Commons)",
    datingEvidence: "The king's reign; the figures are those given with the photograph on Wikimedia Commons, not checked against a chronology.",
    sourceKey: "sethe-pt",
    notes: "Blocks from its antechamber are in museums, among them the Petrie Museum, London.",
  },
  {
    key: "pyramid-pepi-ii",
    siglum: "N",
    name: "Pyramid of Pepi II, Saqqara",
    objectKind: "inscription",
    findspot: "Saqqara",
    startYear: -2278,
    endYear: -2218,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "reign of Pepi II, Sixth Dynasty (2279–2219 BCE as given with the Berlin fragment on Commons)",
    datingEvidence: "The king's reign; the figures are those given with the photograph on Wikimedia Commons, not checked against a chronology.",
    sourceKey: "sethe-pt",
    notes: "Painted fragments from its chambers are in museums, among them the Neues Museum, Berlin.",
  },
];

type Placed = CorpusImage & { manuscriptKey?: string; utterance?: number; chapter?: number };

const IMAGES: Placed[] = [
  {
    key: "unas-burial-chamber-west-gable",
    manuscriptKey: "pyramid-unas",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Burial_chamber_in_Unas%27_pyramid.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Burial_chamber_in_Unas%27_pyramid.jpg",
    institution: "In place, pyramid of Unas, Saqqara",
    objectDate: "End of the Fifth Dynasty, c. 2375–2345 BCE",
    imageDate: "2011",
    caption:
      "The burial chamber of Unas: the king's stone sarcophagus in front of the west wall, carved and painted as a palace façade, with columns of Pyramid Text filling the gable above and the star-covered ceiling. Which utterances the gable carries is not identified here.",
    creator: "Photograph by Vincent Brown",
    credit: "Vincent Brown (pyramidtextsonline), via Flickr and Wikimedia Commons, CC BY 2.0",
    licence: "CC BY 2.0",
    licenceStatus: "attribution",
    shows: "site",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "unas-inscribed-wall-2017",
    manuscriptKey: "pyramid-unas",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Pyramid_Texts_in_Unas%E2%80%99_Pyramid_2017.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Pyramid_Texts_in_Unas%E2%80%99_Pyramid_2017.jpg",
    institution: "In place, pyramid of Unas, Saqqara",
    objectDate: "End of the Fifth Dynasty, c. 2375–2345 BCE",
    imageDate: "2017",
    caption:
      "Close view of carved and blue-filled Pyramid Text columns in the pyramid of Unas, with the king's name in cartouches. Which wall and which utterances are shown is not stated by the photographer.",
    creator: "Photograph by Aidan McRae Thomson",
    credit: "Aidan McRae Thomson, via Flickr and Wikimedia Commons, CC BY-SA 2.0",
    licence: "CC BY-SA 2.0",
    licenceStatus: "share_alike",
    shows: "site",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "unas-burial-chamber-brooklyn-lantern-slide",
    manuscriptKey: "pyramid-unas",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/30/Unas_Pyramidentexte.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Unas_Pyramidentexte.jpg",
    institution: "Brooklyn Museum Archives",
    accessionNumber: "S10-08 Sakkara, image 9643",
    objectDate: "End of the Fifth Dynasty, c. 2375–2345 BCE",
    imageDate: "About 1900 (as dated on Commons; the archive record says n.d.)",
    caption:
      "An early lantern-slide photograph labelled 'Burial Chamber. Pyramid of Unas': text-covered walls around a doorway, with the sarcophagus in the chamber beyond. The view as it was around 1900.",
    creator: "Unknown photographer",
    credit: "Brooklyn Museum Archives, Lantern Slide Collection, via Wikimedia Commons",
    licence: "Public domain (PD-old-70-1923; no known restrictions)",
    licenceStatus: "open",
    shows: "site",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "unas-burial-chamber-maspero-era-drawing",
    manuscriptKey: "pyramid-unas",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Ounas-chambre.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ounas-chambre.jpg",
    institution: "In place, pyramid of Unas, Saqqara",
    objectDate: "End of the Fifth Dynasty, c. 2375–2345 BCE",
    caption:
      "A nineteenth-century drawing of the burial chamber of Unas, which Gaston Maspero opened in 1881: a standing man in a fez before the sarcophagus, with the palace-façade wall and text-covered walls and gable behind. Commons attributes the drawing to Boudier; the figure is not named. Historical context, not a record of the texts.",
    creator: "Attributed to Boudier",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-old)",
    licenceStatus: "open",
    shows: "site",
    identificationStatus: "probable",
    verificationStatus: "unverified",
  },
  {
    key: "pepi-i-antechamber-block-petrie",
    manuscriptKey: "pyramid-pepi-i",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Cartouches_of_Pepi_I_and_Pyramid_Texts._Limestone_block_fragment_from_the_debris_of_the_north_wall_of_the_antechamber_within_the_pyramid_of_Pepi_I_at_Saqqara._Petrie_Museum.jpg",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:Cartouches_of_Pepi_I_and_Pyramid_Texts._Limestone_block_fragment_from_the_debris_of_the_north_wall_of_the_antechamber_within_the_pyramid_of_Pepi_I_at_Saqqara._Petrie_Museum.jpg",
    institution: "Petrie Museum of Egyptian Archaeology, UCL, London",
    objectDate: "Sixth Dynasty, reign of Pepi I",
    imageDate: "2016",
    caption:
      "A limestone block from the debris of the north wall of the antechamber in the pyramid of Pepi I at Saqqara: five columns of Pyramid Text with the hieroglyphs filled in green and the king's cartouche four times. Which utterances it carries is not identified here.",
    creator: "Photograph by Osama Shukir Muhammed Amin",
    credit: "Osama Shukir Muhammed Amin, via Wikimedia Commons (with thanks to the Petrie Museum)",
    licence: "CC BY-SA 4.0",
    licenceStatus: "share_alike",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "teti-inscribed-gable-sailko",
    manuscriptKey: "pyramid-teti",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Piramide_di_teti%2C_interno_00.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Piramide_di_teti,_interno_00.jpg",
    institution: "In place, pyramid of Teti, Saqqara",
    objectDate: "Sixth Dynasty, c. 2345–2333 BCE",
    imageDate: "2015",
    caption:
      "A gabled wall inside the pyramid of Teti, covered from floor to apex with columns of Pyramid Text around a low doorway into the next chamber. Which chamber and which utterances are shown is not stated by the photographer.",
    creator: "Photograph by Sailko",
    credit: "Sailko, via Wikimedia Commons, CC BY 3.0",
    licence: "CC BY 3.0",
    licenceStatus: "attribution",
    shows: "site",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "pepi-ii-fragment-berlin-utt-255-354",
    utterance: 255,
    manuscriptKey: "pyramid-pepi-ii",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/15/Relief_fragment_with_the_spells_354_and_255_with_the_Pyramid_Texts._From_Saqqara%2C_Egypt._Neues_Museum%2C_Berlin.jpg",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:Relief_fragment_with_the_spells_354_and_255_with_the_Pyramid_Texts._From_Saqqara,_Egypt._Neues_Museum,_Berlin.jpg",
    institution: "Neues Museum, Berlin",
    objectDate: "Sixth Dynasty, reign of Pepi II",
    imageDate: "2019",
    caption:
      "UNVERIFIED — A carved limestone fragment from the pyramid of Pepi II at Saqqara, now in Berlin, with parts of several columns of Pyramid Text. Its uploader labels it as carrying spells 354 and 255; that reading has not been checked, and it is placed at utterance 255 only on that label.",
    creator: "Photograph by Osama Shukir Muhammed Amin",
    credit: "Osama Shukir Muhammed Amin, via Wikimedia Commons",
    licence: "CC BY-SA 4.0",
    licenceStatus: "share_alike",
    shows: "artefact",
    identificationStatus: "unverified",
    whatIsUnverified: "That the fragment carries utterances 255 and 354; the object's origin in Pepi II's pyramid is also as the uploader states it.",
    verificationStatus: "unverified",
  },
  {
    key: "unas-wall-utt-273-276",
    utterance: 273,
    manuscriptKey: "pyramid-unas",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Pyramid_text_utterance_276_to_273.png",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Pyramid_text_utterance_276_to_273.png",
    institution: "In place, pyramid of Unas, Saqqara",
    objectDate: "End of the Fifth Dynasty, c. 2375–2345 BCE",
    caption:
      "UNVERIFIED — A gable wall of hieroglyphic columns in the pyramid of Unas, labelled by its uploader as utterances 273 to 276, which would include the 'Cannibal Hymn' (273–274). The labelling, the photographer and the public-domain status are the uploader's and have not been checked.",
    credit: "Uploaded to Wikimedia Commons as from khaledgamean.wordpress.com",
    licence: "Public domain under Egyptian law, as claimed on Commons; not established",
    licenceStatus: "unknown",
    shows: "site",
    identificationStatus: "unverified",
    whatIsUnverified: "That the photograph shows utterances 273–276, and who took it.",
    verificationStatus: "unverified",
  },
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

/** The wall photographs above, then the related objects, places and iconography beside them. */
const ALL_IMAGES: Placed[] = [...IMAGES, ...PT_RELATED_IMAGES];

function strip(image: Placed): CorpusImage {
  const copy: Placed = { ...image };
  delete copy.utterance;
  delete copy.chapter;
  delete copy.manuscriptKey;
  return copy;
}

/** Pictures placed at an utterance, or (with `chapter`) at one of Mercer's chapters. */
function imagesFor(where: { utterance: number } | { chapter: number }) {
  const found = ALL_IMAGES.filter((image) =>
    "utterance" in where ? image.utterance === where.utterance : image.chapter === where.chapter
  ).map(strip);
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
      images: imagesFor({ chapter }),
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
        images: imagesFor({ utterance }),
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
  images: ALL_IMAGES.filter((image) => image.utterance == null && image.chapter == null).map((image) => {
    const copy: Placed = { ...image };
    delete copy.utterance;
    delete copy.chapter;
    return copy;
  }),
  passages: buildPassages(),
};
