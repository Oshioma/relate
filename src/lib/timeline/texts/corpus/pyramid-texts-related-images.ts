// PICTURES BESIDE THE UTTERANCES OF THE PYRAMID TEXTS.
//
// The walls themselves come first: photographs of inscribed walls that their
// uploader labels with the utterances they carry. Those labels have not been
// checked against Sethe's edition or the plans of the pyramid, so every one of
// them is marked UNVERIFIED and says so.
//
// After the walls come pictures of what an utterance names — Nut arched over
// the earth, the star-covered ceilings the texts were carved beneath, Atum and
// Shu, the benben stone and Heliopolis. They are related evidence, often much
// later than the texts, and their captions say what each one is. Every file
// page was read and every picture looked at before it was added.
//
// A picture is placed at an utterance (`utterance`) or at one of Mercer's
// chapters (`chapter`).

import type { CorpusImage } from "../corpus-types";

type Placed = CorpusImage & { utterance?: number; chapter?: number };

/** The uploader's labelled photographs of Unas's walls (khaledgamean.wordpress.com). */
const UNAS_LABELLED_WALL = {
  institution: "In place, pyramid of Unas, Saqqara",
  objectDate: "End of the Fifth Dynasty, c. 2375–2345 BCE",
  credit: "Uploaded to Wikimedia Commons as from khaledgamean.wordpress.com (author given as 'Thoth')",
  licence: "Public domain under Egyptian law (PD-Egypt), as claimed on Commons; not established",
  licenceStatus: "unknown",
  shows: "site",
  identificationStatus: "unverified",
  verificationStatus: "unverified",
} as const;

export const PT_RELATED_IMAGES: Placed[] = [
  // THE WALLS --------------------------------------------------------------
  {
    key: "pt-unas-wall-utt-247-253",
    utterance: 247,
    ...UNAS_LABELLED_WALL,
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Pyramid_text_utterance_253_to_247.png",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Pyramid_text_utterance_253_to_247.png",
    caption:
      "UNVERIFIED — A gable wall in the pyramid of Unas filled to the apex with columns of hieroglyphs, the background masked out by the uploader, who labels it as utterances 247 to 253 (the start of Mercer's chapter on the king's arrival in the sky). The labelling, the photographer and the public-domain status are the uploader's and have not been checked.",
    whatIsUnverified: "That the photograph shows utterances 247–253, and who took it.",
  },
  {
    key: "pt-unas-wall-utt-254-260",
    utterance: 254,
    ...UNAS_LABELLED_WALL,
    url: "https://upload.wikimedia.org/wikipedia/commons/0/01/Pyramid_text_utterance_260_to_254.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Pyramid_text_utterance_260_to_254.jpg",
    caption:
      "UNVERIFIED — A wall of hieroglyphic columns around a doorway in the pyramid of Unas, labelled by its uploader as utterances 254 to 260. The labelling, the photographer and the public-domain status are the uploader's and have not been checked.",
    whatIsUnverified: "That the photograph shows utterances 254–260, and who took it.",
  },
  {
    key: "pt-unas-wall-utt-302-312",
    utterance: 302,
    ...UNAS_LABELLED_WALL,
    url: "https://upload.wikimedia.org/wikipedia/commons/6/69/Pyramid_text_utterance_302_to_312.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Pyramid_text_utterance_302_to_312.jpg",
    caption:
      "UNVERIFIED — Columns of hieroglyphs above a doorway in the pyramid of Unas, labelled by its uploader as utterances 302 to 312: the run Mercer heads 'the ferryman and the deceased king's ascension'. The labelling, the photographer and the public-domain status are the uploader's and have not been checked.",
    whatIsUnverified: "That the photograph shows utterances 302–312, and who took it.",
  },
];
