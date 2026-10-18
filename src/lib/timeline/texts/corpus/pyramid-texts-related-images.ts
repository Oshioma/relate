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
      "UNVERIFIED — A gable wall in the pyramid of Unas filled to the apex with columns of hieroglyphs, the background masked out by the uploader, who labels it as utterances 247 to 253 (in Mercer's chapter on the king's arrival in the sky). The labelling, the photographer and the public-domain status are the uploader's and have not been checked.",
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
  // NUT AND THE SKY --------------------------------------------------------
  {
    key: "pt-427-nut-over-geb-greenfield",
    utterance: 427,
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Geb%2C_Nut%2C_Shu.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Geb,_Nut,_Shu.jpg",
    institution: "British Museum",
    objectDate: "Twenty-first – early Twenty-second Dynasty, c. 950 BCE",
    caption:
      "Related evidence, some fourteen centuries later than the pyramids: the sky goddess Nut arched over the earth god Geb, held up by the air god Shu and two ram-headed helpers, in the Greenfield Papyrus (the Book of the Dead of Nesitanebtashru). Utterance 427 begins 'Nut, spread thyself over thy son, Osiris N.'",
    creator: "Photograph: British Museum",
    credit: "British Museum photograph, via Wikimedia Commons",
    licence: "Public domain (PD-Art: a faithful photograph of a public-domain two-dimensional work)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "pt-unas-sarcophagus-chamber-star-ceiling",
    chapter: 19,
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Unas%E2%80%99_Sarcophagus_Chamber_Ceiling.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Unas%E2%80%99_Sarcophagus_Chamber_Ceiling.jpg",
    institution: "In place, pyramid of Unas, Saqqara",
    objectDate: "End of the Fifth Dynasty, c. 2375–2345 BCE",
    imageDate: "2007",
    caption:
      "The sky the texts were carved beneath: the gabled ceiling of Unas's sarcophagus chamber, painted with rows of five-pointed stars above the inscribed walls. The texts in praise of Nut collected in this chapter call on the sky goddess to spread herself over the king.",
    creator: "Photograph by Vincent Brown",
    credit: "Vincent Brown (pyramidtextsonline), via Flickr and Wikimedia Commons, CC BY 2.0",
    licence: "CC BY 2.0",
    licenceStatus: "attribution",
    shows: "site",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "pt-teti-star-ceiling",
    chapter: 21,
    url: "https://upload.wikimedia.org/wikipedia/commons/4/40/Piramide_di_teti%2C_interno_03_cielo_stellato.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Piramide_di_teti,_interno_03_cielo_stellato.jpg",
    institution: "In place, pyramid of Teti, Saqqara",
    objectDate: "Sixth Dynasty, reign of Teti, c. 2345–2333 BCE",
    imageDate: "2015",
    caption:
      "The next king's sky: rows of carved five-pointed stars covering the ceiling blocks inside the pyramid of Teti, Unas's successor, whose walls also carry the texts. This chapter is Mercer's second series in praise of Nut, the sky.",
    creator: "Photograph by Sailko",
    credit: "Sailko, via Wikimedia Commons",
    licence: "CC BY 3.0",
    licenceStatus: "attribution",
    shows: "site",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },

  // ATUM AT HELIOPOLIS -----------------------------------------------------
  {
    key: "pt-600-amenemhat-iii-pyramidion",
    utterance: 600,
    url: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Pyramidion_of_the_Pyramid_of_Amenemhet_III_at_Dahshur.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Pyramidion_of_the_Pyramid_of_Amenemhet_III_at_Dahshur.jpg",
    institution: "Egyptian Museum, Cairo",
    accessionNumber: "JE 35133",
    objectDate: "Twelfth Dynasty, c. 1820 BCE",
    imageDate: "2006",
    caption:
      "Related evidence: the black stone capstone (pyramidion) of Amenemhat III's pyramid at Dahshur, carved with a winged sun disk and a pair of eyes — a pyramid's tip, shaped like the benben stone of Heliopolis that Utterance 600 names when it greets Atum-Khepri 'shining as bnw of the benben'. It is some five centuries later than the texts.",
    creator: "Photograph by Jon Bodsworth (Egypt Archive)",
    credit: "Jon Bodsworth, via Wikimedia Commons",
    licence: "Copyrighted free use",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "pt-600-heliopolis-obelisk-senusret-i",
    utterance: 600,
    url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Obelisk-SesostrisI-Heliopolis.JPG",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Obelisk-SesostrisI-Heliopolis.JPG",
    institution: "In place, el-Matariya (ancient Heliopolis), Cairo",
    objectDate: "Twelfth Dynasty, reign of Senusret I",
    imageDate: "2010",
    caption:
      "Heliopolis today: the granite obelisk of Senusret I still standing on the site of the sun temple, the 'temple of the phoenix' where Utterance 600 places Atum-Khepri on his hill. The obelisk is Middle Kingdom, later than the pyramid's texts; little else of the ancient city is visible.",
    creator: "Photograph by Didia (David Schmid)",
    credit: "Didia, via Wikimedia Commons",
    licence: "CC BY-SA 3.0 (also GFDL)",
    licenceStatus: "share_alike",
    shows: "site",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "pt-527-atum-and-horemheb-luxor",
    utterance: 527,
    url: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Luxor_Museum_Statuen_Haremhab_Atum_01.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Luxor_Museum_Statuen_Haremhab_Atum_01.jpg",
    institution: "Luxor Museum (found in the Luxor Temple cachette, 1987)",
    objectDate: "Eighteenth Dynasty, reign of Horemheb",
    imageDate: "2019",
    caption:
      "Related evidence, a thousand years later than the texts: Atum, the creator of Heliopolis whom Utterance 527 describes making Shu and Tefnut, enthroned in the double crown before the kneeling King Horemheb — diorite statues from the Luxor Temple cachette.",
    creator: "Photograph by Olaf Tausch",
    credit: "Olaf Tausch, via Wikimedia Commons",
    licence: "CC BY 3.0 (also GFDL)",
    licenceStatus: "attribution",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];
