// MANLY P. HALL, THE SECRET TEACHINGS OF ALL AGES (1928): THE WHOLE BOOK.
//
// Not an ancient text. Hall's book is a modern compendium ABOUT ancient and
// later esoteric traditions — Egyptian, Greek, Hermetic, Qabbalistic,
// alchemical, Rosicrucian, Masonic — published at San Francisco in 1928
// (printed for Hall by H. S. Crocker Company). It quotes and retells older
// writings, often from secondary sources, and its readings of them are Hall's
// own. Nothing in it is a witness to the texts it discusses, and where it
// touches a work this archive holds, the link says it is Hall's discussion.
//
// The owner decided (Oshi, 2026-10-17) to carry the full text: the book is in
// the public domain in the United States (published 1928; not renewed), though
// not in the UK or EU until 2061 (Hall died in 1990). Its layer is licensed
// public_domain_us accordingly.
//
// The text comes from the generated files beside this one: the e-text at
// sacred-texts.com, with the fourteen chapters the site's pages cut short
// completed from an archive.org OCR of the same e-text, split by
// scripts/texts/hall-secret-teachings.py. What a reader needs beyond it —
// summaries, pictures, themes, connections — is written here, so regenerating
// the text never loses it.
//
// Hierarchy: chapter → Hall's own sub-headings (sections) → groups of whole
// paragraphs of about 1,000–4,000 characters (parts), so that every passage
// can be read and paraphrased on its own. Hall does not number his chapters;
// the numbers in the keys (modern.hall.1 … modern.hall.45) follow the order of
// his table of contents, with the Introduction and Conclusion as chapters of
// their own (47 in all). The captions of his illustrations are passages of
// their own (divisionKind "figure"), after the chapter's text. The dedication,
// the preface and the unnumbered section of Celentano's alchemical figures
// (not in the table of contents) are kept as parts, not counted as chapters.
//
// Nothing here is marked verified: the e-text has not been read against a copy
// of the first edition, and part of it is OCR.

import type { CorpusImage, CorpusLayer, CorpusLink, CorpusPassage, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { HALL_FIGURE_IMAGES } from "./hall-secret-teachings-figure-images";
import { HALL_RELATED_IMAGES } from "./hall-secret-teachings-related-images";
import { HALL_CHAPTERS, HALL_FIGURES, HALL_TEXT } from "./hall-secret-teachings-text";

const PREFIX = "modern.hall";

const SOURCES = INVENTORY_SOURCES.filter((s) => ["hall-secret-teachings"].includes(s.key));

const BOOK = "Manly P. Hall, The Secret Teachings of All Ages (San Francisco: printed for Manly P. Hall by H. S. Crocker Company, 1928)";
const WEB_EDITION = `${BOOK}, from the e-text at sacred-texts.com, scanned from the first edition by J. B. Hare (2001), with the site's own typo corrections (its errata page). The site's notice: "This text is in the public domain because it was not renewed. These files may be used for any non-commercial purpose, provided this notice of attribution is left intact."`;
const OCR_EDITION = `${BOOK}, from the archive.org OCR of a printout of the same sacred-texts.com e-text (items the-secret-teachings-of-all-ages-by-manly-p.-hall-1928 and pdfy-NXrCfPe_e-QETRFj, the second used to check the first), because the site's page for this chapter stops partway. Page headers and navigation removed; OCR misreadings corrected only where certain; Hebrew and Greek the OCR could not read are marked […].`;
const HALL_NOTE =
  "Hall's text, spelling and headings as the e-text gives them, except for the e-text's own scanning errors (some 520), corrected only where the right reading is certain; its page furniture is left out. Page numbers are the first edition's. Public domain in the United States; not in the UK or EU until 2061.";

type Source = "web" | "ocr" | "web+ocr";

function evidenceFor(source: Source): string {
  if (source === "web") return `${WEB_EDITION} ${HALL_NOTE}`;
  if (source === "ocr") return `${OCR_EDITION} ${HALL_NOTE}`;
  return `${WEB_EDITION} The site's page stops partway through this passage; the rest is from the archive.org OCR of a printout of the same e-text, corrected only where certain. ${HALL_NOTE}`;
}

function hallLayer(source: Source, text: string): CorpusLayer {
  return {
    key: "eng-hall",
    layer: "primary_text",
    sourceKey: "hall-secret-teachings",
    content: text,
    language: "English",
    licence: "public_domain_us",
    evidence: evidenceFor(source),
  };
}

const SMALL_WORDS = new Set(["a", "an", "and", "as", "at", "by", "de", "di", "for", "from", "in", "of", "on", "or", "the", "to", "with"]);

/** Hall's capitalised headings in title case, for labels. */
export function titleCase(text: string): string {
  if (text !== text.toUpperCase()) return text;
  return text
    .split(" ")
    .map((word, i) => {
      if (/^([A-Z]\.)+,?$/.test(word)) return word; // R. C., A.D.
      const lower = word.toLowerCase();
      if (i > 0 && SMALL_WORDS.has(lower.replace(/[^a-z]/g, ""))) return lower;
      return lower.replace(/(^'|^|[-(—"]|--)([a-zæœ])/g, (_, before: string, letter: string) => before + letter.toUpperCase());
    })
    .join(" ")
    .replace(/,\s*$/, "");
}

const pages = (first: number, last: number) => (first === last ? `p. ${first}` : `pp. ${first}–${last}`);

type Chapter = { summary: string; themes?: [string, string][] };

const MODERN = "Hall's survey, written in 1928;";

/** A summary of each chapter, written for this archive from Hall's text. */
const CHAPTERS: Record<string, Chapter> = {
  dedication: { summary: "Hall dedicates the book to the Rational Soul of the World." },
  preface: {
    summary:
      "Hall explains why he wrote the book: to give the secret philosophies of the ancient world a worthy, illustrated presentation, as an outline of their symbolism for the general reader, without claiming to be final. He thanks those who helped, among them the artist J. Augustus Knapp.",
  },
  intro: {
    summary: `${MODERN} he presents philosophy as the search for the first causes of things, sketches the Greek schools from Thales to the Neoplatonists, and argues that the ancient Mysteries guarded a single wisdom that symbols were meant to convey.`,
    themes: [["divine-knowledge", "Hall's claim that one ancient wisdom lies behind all the schools and Mysteries."]],
  },
  "1": {
    summary: `${MODERN} he describes how the ancient Mysteries taught in secret through initiation, then the Druid Mysteries of Britain and Gaul and the rites of Mithras, which he contrasts with early Christianity.`,
    themes: [["initiation", "The Druidic and Mithraic initiations as Hall describes them."]],
  },
  "2": {
    summary: `${MODERN} the Gnostics (Simon Magus, Basilides, Abraxas), the Mysteries of Serapis, the symbolism of the labyrinth, and the Odinic or Gothic Mysteries with their nine worlds.`,
    themes: [["initiation", "The Serapic and Odinic initiations as Hall describes them."]],
  },
  "3": {
    summary: `${MODERN} the Eleusinian Mysteries of Demeter and Persephone, with their Lesser and Greater rites, then the Orphic, Bacchic and Dionysiac Mysteries, read as allegories of the soul's descent into matter and its return.`,
    themes: [
      ["initiation", "The Eleusinian, Orphic and Bacchic rites."],
      ["the-soul", "Hall reads the myths as the soul's descent into the body and its release."],
    ],
  },
  "4": {
    summary: `${MODERN} he cites Pierre Termier's lecture on Atlantis and retells Plato's Critias and Timaeus, then argues that the myth of a dying god — Tammuz, Atys, Adonis, Sabazius, the Cabiri of Samothrace — preserves Atlantean Mystery rites.`,
    themes: [
      ["atlantis", "Plato's Atlantis, retold and taken by Hall as history."],
      ["death-and-rebirth", "The myth of the dying and rising god."],
    ],
  },
  "5": {
    summary: `${MODERN} legends of Hermes Trismegistus and the books ascribed to him, the 'Book of Thoth', and a long retelling of the Poimandres in Hall's own narrative form, in which Poimandres appears as the Great Dragon and teaches the creation, the Seven Governors and the soul's ascent.`,
    themes: [
      ["thoth-and-hermes", "Hall identifies Thoth and Hermes and retells the Hermetic vision."],
      ["seven-cosmic-rulers", "The Seven Governors of the Poimandres."],
      ["creation", "The creation as Poimandres reveals it, in Hall's version."],
    ],
  },
  "6": {
    summary: `${MODERN} the opening of the Great Pyramid by al-Ma'mun, its passages and chambers, the riddle of the Sphinx, and Hall's view that the Pyramid was a temple of initiation rather than a tomb.`,
    themes: [
      ["initiation", "Hall's view of the Pyramid as a temple of the Mysteries."],
      ["hidden-chambers", "The passages and chambers of the Great Pyramid."],
    ],
  },
  "7": {
    summary: `${MODERN} the Isis of Sais and her veiled inscription, the myth of Osiris's murder, the symbols and attributes of Isis read as Hermetic emblems, and the Egyptian mummification of the dead.`,
    themes: [["death-and-rebirth", "The murder of Osiris and the preparation of the dead."]],
  },
  "8": {
    summary: `${MODERN} sun worship as one of the earliest religions, the solar trinity, Christian and solar symbolism, the birthday of the sun, the 'three suns', and the sun in alchemy.`,
    themes: [["sun-and-moon", "The sun as the universal deity in Hall's survey."]],
  },
  "9": {
    summary: `${MODERN} early astronomy, the equinoxes and solstices, the astrological ages, the circular zodiac of Dendera (Tentyra), and an interpretation of each zodiacal sign.`,
    themes: [["cosmic-cycles", "The precession of the equinoxes and the astrological ages."]],
  },
  "10": {
    summary: `${MODERN} the Bembine Table of Isis (the Mensa Isiaca, now in Turin): its history from the sack of Rome to Turin, the keys to it offered by Kircher, Lévi and Westcott, and Hall's reading of it as a chart of the Chaldean and Platonic worlds.`,
    themes: [["above-and-below", "Hall reads the Table's three panels as the worlds above and below."]],
  },
  "11": {
    summary: `${MODERN} the 'ever-burning lamps' found in tombs, the oracles of Delphi, Dodona and Trophonius, and the Seven Wonders of the ancient world.`,
  },
  "12": {
    summary: `${MODERN} the life of Pythagoras as the ancient biographers tell it, his school at Croton, the fundamentals of his teaching, his symbolic sayings, and Pythagorean astronomy.`,
    themes: [["sacred-numbers", "Pythagoras and the philosophy of number."]],
  },
  "13": {
    summary: `${MODERN} the numerical values of letters, how the 'power' of a word is found, an introduction to the Pythagorean theory of numbers, the sieve of Eratosthenes, and the meanings of the numbers one to ten.`,
    themes: [["sacred-numbers", "The Pythagorean meanings of the numbers."]],
  },
  "14": {
    summary: `${MODERN} the human body as the oldest symbol of the universe: its three centres, the body as a temple of initiation, the hand, and man as a small copy of the cosmos.`,
    themes: [["above-and-below", "Man as the microcosm, a copy of the greater world."]],
  },
  "15": {
    summary: `${MODERN} the Masonic legend of Hiram Abiff, the builder of Solomon's Temple, and his murder, which Hall reads as an allegory of the sun and of the spiritual fire in man, with Jacques de Molay and Cleopatra's Needle.`,
    themes: [["death-and-rebirth", "The murder and raising of Hiram, read as an allegory."]],
  },
  "16": {
    summary: `${MODERN} Pythagoras's discovery of the musical intervals, music as therapy, the music of the spheres, and the symbolism of colour and its correspondence with the musical scale and the planets.`,
    themes: [["cosmic-law", "The harmony of the spheres."]],
  },
  "17": {
    summary: `${MODERN} fishes, insects and reptiles as religious symbols: Jonah and the whale, the fish of Christ, the Egyptian scarab, the scorpion, the serpent of wisdom and the crocodile.`,
    themes: [["transformation", "The scarab and the serpent as emblems of renewal."]],
  },
  "18": {
    summary: `${MODERN} birds and animals as symbols: the dove, the self-renewing phoenix, the eagle of the Great Seal of the United States, the cat Bast, the Apis bull and the unicorn.`,
    themes: [["death-and-rebirth", "The phoenix reborn from its own ashes."]],
  },
  "19": {
    summary: `${MODERN} flowers, plants, fruits and trees as symbols: the lotus, the World Tree Yggdrasil, the acacia, the vine and the mandrake.`,
  },
  "20": {
    summary: `${MODERN} stones, metals and gems: prehistoric monuments, the tablets of the Law, the Holy Grail, the ages of the world, and talismanic and planetary gems.`,
  },
  "21": {
    summary: `${MODERN} ceremonial magic and its perversion into sorcery: Egyptian black magic, Faust and Mephistopheles, the invocation of spirits, pacts with demons, and the pentagram.`,
    themes: [["magic-and-sacred-words", "Invocations, names of power and magical circles, as Hall reports them."]],
  },
  "22": {
    summary: `${MODERN} the elemental spirits of Paracelsus — gnomes, undines, salamanders and sylphs — and related beliefs about demons, incubi and vampires.`,
  },
  "23": {
    summary: `${MODERN} the medicine of Paracelsus, palingenesis, Hermetic theories of disease, the healing properties of herbs, and the use of drugs in the Mysteries.`,
  },
  "24": {
    summary: `${MODERN} the written and unwritten law of Israel, the origins of the Qabbalah, Simeon ben Yochai and the great Qabbalistic books, and the Sepher Yetzirah.`,
    themes: [["magic-and-sacred-words", "The letters of the Hebrew alphabet as creative powers in the Sepher Yetzirah."]],
  },
  "25": {
    summary: `${MODERN} Ain Soph and the 'cosmic egg', the Qabbalistic system of four worlds with its emanations, angels and demons, Ezekiel's vision, Nebuchadnezzar's image and the Grand Man of the universe.`,
    themes: [["creation", "The emanation of the worlds from Ain Soph."]],
  },
  "26": {
    summary: `${MODERN} the Tree of the Sephiroth, the thirty-two paths of wisdom, the Greater and Lesser Faces, Kircher's tree, Daath, the three pillars and the four letters of the Name.`,
    themes: [["above-and-below", "The Sephirothic tree as a ladder between God and the world."]],
  },
  "27": {
    summary: `${MODERN} the Qabbalistic methods of Gematria, Notarikon and Temurah, the Elohim, the four Adams, Arabian traditions about Adam, and Adam as the archetype of humankind.`,
    themes: [["creation", "Qabbalistic and other traditions on the making of Adam."]],
  },
  "28": {
    summary: `${MODERN} the history of playing cards and the Tarot, the 'wheel of the world' of the Rosicrucians, and an interpretation of the unnumbered card, the twenty-one major trumps and the suits.`,
  },
  "29": {
    summary: `${MODERN} Moses as an initiate of Egypt, the building and furnishings of the Tabernacle, the Ark of the Covenant, the robes of the high priest and the Urim and Thummim, read as symbols of the human constitution.`,
  },
  "30": {
    summary: `${MODERN} the question of who the Rosicrucians were: the legend of Father C.R.C., Johann Valentin Andreae, the alchemical teachings attributed to the fraternity, the Rose Cross, and Hall's four 'postulates' about the Order.`,
    themes: [["transformation", "Rosicrucian alchemy as the transformation of the self."]],
  },
  "31": {
    summary: `${MODERN} what little is known of Rosicrucian doctrine: the Confessio Fraternitatis (given in full), Burton's Anatomy of Melancholy, John Heydon, the three mountains of the wise and the philosophical egg.`,
  },
  "32": {
    summary: `${MODERN} fifteen Qabbalistic charts that Hargrave Jennings called Rosicrucian, explained one by one: the ocean of spirit, the seven days of creation, the tomb of Christian Rosenkreutz, the regions of the elements and the New Jerusalem.`,
    themes: [["creation", "Charts of the creation and of the worlds."]],
  },
  "33": {
    summary: `${MODERN} the claim that base metals can be turned into gold, the medal of Emperor Leopold I, and the lives of Paracelsus, Raymond Lully, Nicholas Flamel and Bernard of Treviso.`,
    themes: [["transformation", "Transmutation, physical and spiritual."]],
  },
  "34": {
    summary: `${MODERN} the origins of alchemy, nature and art, alchemical symbols, the Song of Solomon read alchemically, and the Philosopher's Gold.`,
    themes: [["transformation", "Alchemy as the art of regeneration."]],
  },
  "35": {
    summary: `${MODERN} an alchemical prayer, the Emerald Tablet of Hermes in Sigismund Bacstrom's translation with his notes, a letter attributed to the Brothers of the Rose Cross, the magical mountain and the 'dew of the sages'.`,
    themes: [
      ["above-and-below", "The Emerald Tablet's 'as above, so below', in Bacstrom's version."],
      ["thoth-and-hermes", "The Tablet as Hermes' alchemical teaching."],
    ],
  },
  celentano: {
    summary:
      "Hall reproduces, with his own commentary, the Hermetic and alchemical figures of a manuscript of 1606 by Claudius de Dominico Celentano of Naples, then in his possession: twenty-six leaves of text and figures on the making of the philosophers' stone.",
    themes: [["transformation", "The stages of the alchemical work."]],
  },
  "36": {
    summary: `${MODERN} a day-by-day retelling of The Chemical Wedding of Christian Rosenkreutz (1616), ascribed to Johann Valentin Andreae, read as an allegory of initiation.`,
    themes: [["initiation", "The Chemical Wedding as an allegory of initiation."]],
  },
  "37": {
    summary: `${MODERN} the Bacon–Shakespeare question: Hall argues that Francis Bacon, as a Rosicrucian, wrote the plays and hid signatures and the number 33 in printed books.`,
  },
  "38": {
    summary: `${MODERN} ciphers in literature and philosophy: secret alphabets, Bacon's biliteral cipher, pictorial, numerical and musical ciphers, and code.`,
  },
  "39": {
    summary: `${MODERN} Masonic legends of the craft's antiquity, the pillars of the sons of Seth, Enoch's arches, the Dionysiac Architects and Roman collegia, Solomon as a figure of wisdom, and what Hall sees as Freemasonry's heritage from the Mysteries.`,
    themes: [["initiation", "Freemasonry as heir to the ancient Mysteries, in Hall's view."]],
  },
  "40": {
    summary: `${MODERN} Irenaeus on the life of Christ, the name of Jesus, the 'christened man', the Essenes, and the Arthurian cycle and the Holy Grail read as Christian mysticism.`,
    themes: [["initiation", "Hall reads the life of Christ and the Grail as initiation."]],
  },
  "41": {
    summary: `${MODERN} the legend of the wood of the Cross, the lost libraries of Alexandria, the cross in pagan symbolism (the tau and the crux ansata), the crucifixion read as a cosmic allegory, crucified saviours including Quetzalcoatl, and the nails of the Passion.`,
    themes: [["death-and-rebirth", "The crucifixion read as a cosmic allegory of descent and rising."]],
  },
  "42": {
    summary: `${MODERN} Ephesus and its temple, the authorship of the Revelation of John, and an interpretation of the Apocalypse's visions as the drama of the Mysteries.`,
    themes: [["initiation", "The Apocalypse read as a ritual of initiation."]],
  },
  "43": {
    summary: `${MODERN} the life of Muhammad, the Night Journey, the Qur'an, the Caaba at Mecca, and Islamic mysticism, with attention to how Christendom misjudged Islam.`,
    themes: [["ascension", "Muhammad's Night Journey to heaven."]],
  },
  "44": {
    summary: `${MODERN} the symbolism of the North American peoples, the Midewiwin and sand paintings, and the Popol Vuh of the Quiché Maya with the Mysteries of Xibalba.`,
    themes: [["underworld", "Xibalba, the underworld of the Popol Vuh."]],
  },
  "45": {
    summary: `${MODERN} whether the wisdom of the ancient Mysteries survived: Hypatia, Cagliostro, the Comte de Saint-Germain, and episodes from American history that Hall connects with secret societies.`,
  },
  conclusion: {
    summary:
      "Hall closes with Philip of Macedon's letter to Aristotle, a call to rediscover the philosophy of the ancients, and an invitation to the reader to take up that search.",
    themes: [["divine-knowledge", "The ancient wisdom offered again to the reader."]],
  },
};

/** The plates and figures pictured here, each placed on a chapter or a passage. */
type Placed = CorpusImage & { chapter?: string; passageKey?: string };

const KNAPP_UNVERIFIED =
  "That this copy reproduces the plate as printed in the first edition of 1928: the Commons copy was taken from an image-sharing site, and colours and cropping may come from a later reprint. Its place in the book is not checked.";

const IMAGES: Placed[] = [
  {
    key: "hall-knapp-atlantean-mystery-temple",
    chapter: "4",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7f/An_Idealistic_Depiction_of_the_Atlantean_Mystery_Temple.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:An_Idealistic_Depiction_of_the_Atlantean_Mystery_Temple.jpg",
    objectDate: "1928",
    caption:
      "UNVERIFIED — J. Augustus Knapp's colour plate 'An Idealistic Depiction of the Atlantean Mystery Temple' for Hall's book: a white stepped pyramid with a golden shrine on a cliff above a domed city, with airships overhead. A 1920s artist's imagining of Hall's Atlantis, not evidence for Atlantis or for Plato's text.",
    creator: "J. Augustus Knapp",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-auto-expired; Knapp d. 1938)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    whatIsUnverified: `That this is Hall's plate (the Commons record calls it plate 7 of the book). ${KNAPP_UNVERIFIED}`,
    verificationStatus: "unverified",
  },
  {
    key: "hall-knapp-hermes-trismegistus",
    chapter: "5",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/18/Hermes_Trismegistus_by_J.A.Knapp.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Hermes_Trismegistus_by_J.A.Knapp.jpg",
    objectDate: "1928",
    caption:
      "UNVERIFIED — J. Augustus Knapp's colour plate of Hermes Trismegistus for Hall's book: an Egyptian figure standing on a fire-breathing dragon, holding a caduceus and a green tablet, with medallions of an ibis and a dog. Later artwork in Hall's own reading of Hermes, not an ancient image.",
    creator: "J. Augustus Knapp",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-auto-expired; Knapp d. 1938)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    whatIsUnverified: `That this is the plate printed in Hall's book, as the Commons record says. ${KNAPP_UNVERIFIED}`,
    verificationStatus: "unverified",
  },
  {
    key: "hall-fig-oedipus-sphinx",
    passageKey: `${PREFIX}.6.fig1`,
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a3/The_Secret_Teaching_of_All_Ages_-_Chapter_6_-_Sphinx.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:The_Secret_Teaching_of_All_Ages_-_Chapter_6_-_Sphinx.jpg",
    objectDate: "1928 (Hall's source is Lévi)",
    caption:
      "Hall's line figure 'Œdipus and the Sphinx', after Éliphas Lévi: a winged sphinx with a woman's head and an Egyptian headdress, on a base with a winged disc. Taken by Commons from the sacred-texts.com e-text of this chapter. A nineteenth-century drawing reproduced in 1928, not an ancient sphinx.",
    creator: "After Éliphas Lévi; reproduced by Manly P. Hall",
    credit: "sacred-texts.com e-text, via Wikimedia Commons",
    licence: "Public domain in the US (PD-US-no-renewal)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "probable",
    verificationStatus: "unverified",
  },
  {
    key: "hall-fig-great-pyramid-section",
    passageKey: `${PREFIX}.6.fig2`,
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ed/The_Secret_Teaching_of_All_Ages_-_Chapter_6_-_Pyramid.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:The_Secret_Teaching_of_All_Ages_-_Chapter_6_-_Pyramid.jpg",
    objectDate: "1928 (the survey drawing it reproduces is earlier)",
    caption:
      "Hall's figure 'A Vertical Section of the Great Pyramid', which he credits to Piazzi Smyth: a section looking west, with the passages and chambers lettered as in his caption (K the King's Chamber, F the Queen's Chamber, G the Grand Gallery). Taken by Commons from the sacred-texts.com e-text of this chapter. A modern survey diagram, useful for following the caption.",
    creator: "After C. Piazzi Smyth; reproduced by Manly P. Hall",
    credit: "sacred-texts.com e-text, via Wikimedia Commons",
    licence: "Public domain in the US (PD-US-no-renewal)",
    licenceStatus: "open",
    shows: "diagram",
    identificationStatus: "probable",
    verificationStatus: "unverified",
  },
  {
    key: "hall-fig-nine-worlds",
    passageKey: `${PREFIX}.2.fig5`,
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Norse_Nine_Worlds.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Norse_Nine_Worlds.jpg",
    objectDate: "1928",
    caption:
      "Hall's diagram 'The Nine Worlds of the Odinic Mysteries', the nine spheres from Asgard to Hel-heim his caption lists. Commons took it from the sacred-texts.com e-text's image of this figure (02800). Hall's own diagram of Norse cosmology, not a Norse source.",
    creator: "Manly P. Hall",
    credit: "sacred-texts.com e-text, via Wikimedia Commons",
    licence: "Public domain in the US (PD-US-expired)",
    licenceStatus: "open",
    shows: "diagram",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "hall-knapp-saitic-isis",
    chapter: "7",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2c/STAA-08-Saitic-Isis_Knapp.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:STAA-08-Saitic-Isis_Knapp.jpg",
    objectDate: "1926 (signed)",
    caption:
      "UNVERIFIED — J. Augustus Knapp's colour plate of the Saitic Isis for Hall's book, signed and dated 1926: a crowned Isis between Egyptian columns, with the inscription Hall quotes at the start of this chapter, 'I, Isis, am all that has been, that is or shall be; no mortal man hath ever me unveiled'. Later artwork, not an ancient image of Isis.",
    creator: "J. Augustus Knapp",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-auto-expired; Knapp d. 1938)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    whatIsUnverified: `That this is the plate printed in Hall's book; the Commons record says so, and the inscription matches Hall's text. ${KNAPP_UNVERIFIED}`,
    verificationStatus: "unverified",
  },
  {
    key: "hall-knapp-pythagoras",
    chapter: "12",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/96/Pythagoras_knapp.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Pythagoras_knapp.jpg",
    objectDate: "1926 (signed)",
    caption:
      "UNVERIFIED — J. Augustus Knapp's painting of Pythagoras, signed and dated 1926, holding a pyramid, with the tetractys above him and a diagram of his theorem on the table. Commonly reproduced as Hall's plate; a twentieth-century imagining, not a portrait.",
    creator: "J. Augustus Knapp",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-old-70, PD-US)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    whatIsUnverified: `That this painting is a plate in Hall's book: the Commons record names Knapp but not the book. ${KNAPP_UNVERIFIED}`,
    verificationStatus: "unverified",
  },
  {
    key: "hall-knapp-jewel-of-the-rose-croix",
    passageKey: `${PREFIX}.18.s1.p2`,
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/The_Jewel_of_the_Rose_Croix.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:The_Jewel_of_the_Rose_Croix.jpg",
    objectDate: "1928",
    caption:
      "UNVERIFIED — J. Augustus Knapp's colour plate 'The Jewel of the Rose Croix' for Hall's book: a pelican feeding its young from its breast, below a cross with a rose, framed by a compass and a crown, over the letters INRI. Hall says in this passage that the pelican of the Rose Croix degree is 'in reality a phœnix'. Later artwork.",
    creator: "J. Augustus Knapp",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-auto-expired; Knapp d. 1938)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    whatIsUnverified: `That this is Hall's plate, as the Commons record says, and where it stands in the book. ${KNAPP_UNVERIFIED}`,
    verificationStatus: "unverified",
  },
  {
    key: "hall-knapp-rosicrucian-philosopher",
    chapter: "30",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/bc/The_Rosicrucian_Philosopher.png",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:The_Rosicrucian_Philosopher.png",
    objectDate: "1928",
    caption:
      "UNVERIFIED — J. Augustus Knapp's colour plate 'The Rosicrucian Philosopher' for Hall's book: an old man writing by candlelight among books, an hourglass and a skull, with a rose-cross shield on the wall. Commons takes it to show Christian Rosenkreutz. A twentieth-century imagining.",
    creator: "J. Augustus Knapp",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-auto-expired; Knapp d. 1938)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    whatIsUnverified: `That this is Hall's plate and whom it is meant to show; both from the Commons record. ${KNAPP_UNVERIFIED}`,
    verificationStatus: "unverified",
  },
  {
    key: "hall-knapp-rosicrucian-crucifixion",
    passageKey: `${PREFIX}.41.s6`,
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c4/A_Rosicrucian_Crucifixion_by_John_Augustus_Knapp.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:A_Rosicrucian_Crucifixion_by_John_Augustus_Knapp.jpg",
    objectDate: "1928",
    caption:
      "UNVERIFIED — J. Augustus Knapp's colour plate of a Rosicrucian crucifixion for Hall's book: Christ on a vine-covered cross standing on a blazing disc with a hexagram and the letters of the Name, framed by the words Vegetabilis, Animalis, Lapis, Mineralis. Placed here beside Hall's section on the crucifixion as a cosmic allegory. Later artwork.",
    creator: "J. Augustus Knapp",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-auto-expired; Knapp d. 1938)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "unverified",
    whatIsUnverified: `That this is Hall's plate (the Commons record says so but quotes a caption about a 'solar crucifixion' that does not describe what is shown) and which chapter it belongs to. ${KNAPP_UNVERIFIED}`,
    verificationStatus: "unverified",
  },
];

const ALL_IMAGES: Placed[] = [...IMAGES, ...HALL_FIGURE_IMAGES, ...HALL_RELATED_IMAGES];

function imagesFor(test: (image: Placed) => boolean): CorpusImage[] | undefined {
  const found = ALL_IMAGES.filter(test).map((image) => {
    const copy: Placed = { ...image };
    delete copy.chapter;
    delete copy.passageKey;
    return copy;
  });
  return found.length > 0 ? found : undefined;
}

type Row = (typeof HALL_TEXT)[number];

/** A chapter's place among Hall's chapters, for its reference. */
function chapterLabel(key: string, title: string, subtitle: string | null): string {
  const name = titleCase(title);
  if (key === "dedication") return "Dedication";
  if (key === "celentano") return "The Hermetic and Alchemical Figures of Claudius de Dominico Celentano";
  return subtitle ? `${name}, ${subtitle}` : name;
}

function chapterNote(key: string, source: string): string | undefined {
  const notes: string[] = [];
  if (/^\d+$/.test(key)) notes.push(`Hall does not number his chapters; this is the ${ordinal(Number(key))} in his table of contents.`);
  if (key === "intro") notes.push("The table of contents gives the Introduction as beginning on p. 12; the e-text begins it on p. 13.");
  if (key === "celentano")
    notes.push(
      "A section of twenty-six leaves after the second chapter on alchemy, on unnumbered pages around p. 160; it is not listed in the table of contents. Hall describes the manuscript as written and illuminated at Naples in 1606."
    );
  if (source === "web+ocr")
    notes.push("The sacred-texts.com page for this chapter stops partway; the rest is taken from the archive.org OCR of a printout of the same e-text.");
  return notes.length ? notes.join(" ") : undefined;
}

function ordinal(n: number): string {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th");
  return `${n}${suffix}`;
}

const DIVISION: Record<string, string> = { dedication: "part", preface: "part", celentano: "part" };

function buildPassages(): CorpusPassage[] {
  const byChapter = new Map<string, Row[]>();
  for (const row of HALL_TEXT) byChapter.set(row[0], [...(byChapter.get(row[0]) ?? []), row]);

  const passages: CorpusPassage[] = [];
  for (const [chapterKey, printedTitle, subtitle, firstPage, lastPage, source] of HALL_CHAPTERS) {
    const rows = byChapter.get(chapterKey) ?? [];
    const known = CHAPTERS[chapterKey];
    const key = `${PREFIX}.${chapterKey}`;
    const label = chapterLabel(chapterKey, printedTitle, subtitle);
    const whole = rows.length === 1 && rows[0][1] === 0 && rows[0][2] === 0;
    passages.push({
      key,
      divisionKind: DIVISION[chapterKey] ?? "chapter",
      label,
      reference: `Hall 1928, ${pages(firstPage, lastPage)}`,
      sourceKey: "hall-secret-teachings",
      summary: known?.summary,
      verificationStatus: "unverified",
      notes: chapterNote(chapterKey, source),
      layers: whole ? [hallLayer(rows[0][6], rows[0][7])] : [],
      themes: known?.themes?.map(([themeKey, note]) => ({ themeKey, note })),
      images: imagesFor((image) => image.chapter === chapterKey),
    });
    if (!whole) {
      // Sections in order; section 0 is the text before the first heading.
      const sections = new Map<number, Row[]>();
      for (const row of rows) sections.set(row[1], [...(sections.get(row[1]) ?? []), row]);
      for (const [section, parts] of sections) {
        const heading = parts[0][3];
        let parent = key;
        let parentLabel = label;
        if (section > 0) {
          parent = `${key}.s${section}`;
          parentLabel = titleCase(heading ?? `Section ${section}`);
          const one = parts.length === 1 && parts[0][2] === 0;
          passages.push({
            key: parent,
            parentKey: key,
            divisionKind: "section",
            label: parentLabel,
            reference: `Hall 1928, ${pages(parts[0][4], parts[parts.length - 1][5])}, under the heading "${heading}"`,
            sourceKey: "hall-secret-teachings",
            verificationStatus: "unverified",
            layers: one ? [hallLayer(parts[0][6], parts[0][7])] : [],
            images: imagesFor((image) => image.passageKey === parent),
          });
          if (one) continue;
        }
        for (const [, , part, , first, last, partSource, text] of parts) {
          const partKey = `${parent}.p${part}`;
          passages.push({
            key: partKey,
            parentKey: parent,
            divisionKind: "part",
            label: `${parentLabel} (${part})`,
            reference: `Hall 1928, ${pages(first, last)}`,
            sourceKey: "hall-secret-teachings",
            verificationStatus: "unverified",
            layers: [hallLayer(partSource, text)],
            images: imagesFor((image) => image.passageKey === partKey),
          });
        }
      }
    }
    // The illustrations, after the chapter's text.
    for (const [, n, page, imageId, title, credit, figureSource, caption] of HALL_FIGURES.filter((f) => f[0] === chapterKey)) {
      const figureKey = `${key}.fig${n}`;
      const content = [credit, caption].filter((s) => s && s.trim()).join("\n\n");
      const images = imagesFor((image) => image.passageKey === figureKey);
      passages.push({
        key: figureKey,
        parentKey: key,
        divisionKind: "figure",
        label: `Figure: ${titleCase(title)}`,
        reference: `Hall 1928, p. ${page}, illustration${imageId ? ` (image ${imageId} of the e-text)` : ""}`,
        sourceKey: "hall-secret-teachings",
        verificationStatus: "unverified",
        notes:
          figureSource === "ocr"
            ? `The sacred-texts.com page leaves out this illustration; its title and caption are taken from the archive.org OCR of the same e-text.${images ? "" : " The picture itself is not reproduced."}`
            : undefined,
        layers: content
          ? [hallLayer(figureSource, content)]
          : [
              {
                key: "eng-hall",
                layer: "primary_text",
                sourceKey: "hall-secret-teachings",
                contentAbsentReason: `Hall gives this illustration a title only ("${title}"); there is no caption${images ? "" : ", and the picture is not reproduced here"}.`,
                language: "English",
                licence: "public_domain_us",
                evidence: evidenceFor(figureSource),
              },
            ],
        images,
      });
    }
  }
  return passages;
}

const HALLS_DISCUSSION =
  "Hall's book is a modern compendium, not a witness to the text: he retells or quotes it, usually from a translation or a secondary source he names, and gives it his own reading.";

const LINKS: CorpusLink[] = [
  {
    key: "hall-4-retells-critias-113c",
    from: `${PREFIX}.4.p2`,
    to: "greek.crit.113c",
    connectionClass: "later_reinterpretation",
    similarities:
      "Hall summarises Plato's account of Atlantis: the gods dividing the earth, Poseidon's union with Cleito, the five pairs of sons with Atlas set over the rest, the rings of land and sea around the central island, and the temple of Poseidon.",
    differences:
      "Plato's Critias tells the story as Critias's account of what Solon heard in Egypt and breaks off unfinished; Hall retells it in his own words, takes Atlantis as a real continent and makes it the source of the world's Mysteries.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: `Hall names the Critias and follows its order (113c–121c). ${HALLS_DISCUSSION}`,
    earlierNote: "The Critias was written in the fourth century BCE; Hall wrote in 1928.",
    reviewStatus: "proposed",
  },
  {
    key: "hall-4-quotes-timaeus-25d",
    from: `${PREFIX}.4.p4`,
    to: "greek.tim.25d",
    connectionClass: "later_reinterpretation",
    similarities:
      "Hall quotes, in an English translation he does not name, the Timaeus's ending of the Atlantis story: earthquakes and floods, a single day and night in which the warriors sank into the earth and the island sank beneath the sea, leaving shoals of mud.",
    differences:
      "Hall does not say whose translation he quotes; he sets the passage among later and modern writers as support for a real, sunken continent, which the Timaeus does not argue.",
    wordingComparable: "partly",
    meaningComparable: "yes",
    transmissionEvidence: `Hall names the Timaeus and quotes it in English translation. ${HALLS_DISCUSSION}`,
    earlierNote: "The Timaeus was written in the fourth century BCE.",
    reviewStatus: "proposed",
  },
  {
    key: "hall-5-poimandres-opening-ch-1-1",
    from: `${PREFIX}.5.s4.p2`,
    to: "herm.ch.1.1",
    connectionClass: "later_reinterpretation",
    similarities:
      "Both open the vision the same way: Hermes, deep in meditation with his bodily senses stilled, sees a vast being who calls him by name, asks what he wishes to know, and says that he is Poimandres, the Mind.",
    differences:
      "In the Corpus Hermeticum, Poimandres appears as a being of enormous size; Hall turns him into 'the Great Dragon', sets the scene in a rocky desert, and tells the dialogue as a narrative with what he calls 'amplifications' from other sources.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: `Hall names his sources — Everard's translation (London, 1650), Scott's Hermetica (1924), Schuré, and Mead's Thrice-Greatest Hermes (1906) — and says he has added commentary and 'amplifications' and changed the dialogue into a narrative. ${HALLS_DISCUSSION}`,
    earlierNote: "The Poimandres is a Greek text of the Roman period (perhaps the second century CE).",
    reviewStatus: "proposed",
  },
  {
    key: "hall-5-seven-governors-ch-1-9",
    from: `${PREFIX}.5.s4.p4`,
    to: "herm.ch.1.9",
    connectionClass: "later_reinterpretation",
    similarities: "Both have a second Mind, the Workman or Craftsman, make seven Governors who encircle the world and rule it by Destiny (Fate).",
    differences:
      "Hall adds that the Word's motion produces Fire, 'the Son of Striving', and calls the Governors 'the Spirits of the Planets'; the details are his amplification.",
    wordingComparable: "partly",
    meaningComparable: "yes",
    transmissionEvidence: `Hall's retelling of the Poimandres. ${HALLS_DISCUSSION}`,
    reviewStatus: "proposed",
  },
  {
    key: "hall-5-man-loves-shadow-ch-1-14",
    from: `${PREFIX}.5.s4.p4`,
    to: "herm.ch.1.14",
    connectionClass: "later_reinterpretation",
    similarities:
      "Both tell how the archetypal Man looked down through the spheres, saw his own likeness reflected in Nature, loved it and wished to dwell in it, and so was joined to unreasoning form.",
    differences: "Hall tells it as a narrative in modern English and adds the moral that suffering comes from the immortal Man's love of his shadow.",
    wordingComparable: "partly",
    meaningComparable: "yes",
    transmissionEvidence: `Hall's retelling of the Poimandres. ${HALLS_DISCUSSION}`,
    reviewStatus: "proposed",
  },
  {
    key: "hall-5-ascent-through-rings-ch-1-25",
    from: `${PREFIX}.5.s4.p7`,
    to: "herm.ch.1.25",
    connectionClass: "later_reinterpretation",
    similarities: "Both describe the soul after death rising through the seven rings of the Governors and giving back at each the quality it took from it.",
    differences:
      "Hall adds the Milky Way as the 'seed-ground of souls' and a 'seven-runged ladder' that some souls cannot climb; the Poimandres has neither.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: `Hall's retelling of the Poimandres. ${HALLS_DISCUSSION}`,
    reviewStatus: "proposed",
  },
  {
    key: "hall-5-closing-praise-ch-1-31",
    from: `${PREFIX}.5.s4.p9`,
    to: "herm.ch.1.31",
    connectionClass: "later_reinterpretation",
    similarities: "Both end with Hermes recording the vision and giving praise to God for the knowledge received, the Word having become his redeemer.",
    differences:
      "The Poimandres ends with a hymn of 'Holy art Thou' acclamations; Hall gives a freer prayer and then explains the vision as an allegory understood only by those 'raised' into the True Mind.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: `Hall's retelling of the Poimandres. ${HALLS_DISCUSSION}`,
    reviewStatus: "proposed",
  },
  {
    key: "hall-35-emerald-tablet-vulgate-01",
    from: `${PREFIX}.35.s2.p1`,
    to: "arab.tab.vulgate.01",
    connectionClass: "later_reinterpretation",
    similarities:
      "Hall prints Sigismund Bacstrom's English of the Emerald Tablet, whose first line ('It is true, no lie, certain, and to be depended upon') renders the vulgate's 'Verum sine mendacio, certum, certissimum', and its 'the superior agrees with the inferior'.",
    differences:
      "Bacstrom's version, as Hall gives it, interleaves the Tablet's lines with long alchemical and Masonic notes, ties it to King Hiram ('Chiram') and calls it 'the most ancient monument of the Chaldeans'; the vulgate is a short medieval Latin text with no such frame.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: `Hall says he quotes Bacstrom's translation and notes from Bacstrom's collection of alchemical manuscripts; Bacstrom calls it 'the genuine translation from the original very ancient Chaldee'. ${HALLS_DISCUSSION}`,
    earlierNote: "The Latin vulgate is attested from the twelfth century; Bacstrom's version is eighteenth-century; Hall printed it in 1928.",
    reviewStatus: "proposed",
  },
  {
    key: "hall-35-emerald-tablet-vulgate-10",
    from: `${PREFIX}.35.s2.p2`,
    to: "arab.tab.vulgate.10",
    connectionClass: "later_reinterpretation",
    similarities: "Bacstrom's lines that the thing 'ascends from the earth up to heaven, and descends again, newborn, on the earth' render the vulgate's 'ascendit a terra in celum, iterum descendit in terram'.",
    differences: "Bacstrom heads each line with a stage of the alchemical process ('Last Digestion') and explains it at length; the Tablet has neither.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: `Bacstrom's translation with notes, as Hall prints it. ${HALLS_DISCUSSION}`,
    reviewStatus: "proposed",
  },
  {
    key: "hall-35-emerald-tablet-vulgate-17",
    from: `${PREFIX}.35.s2.p3`,
    to: "arab.tab.vulgate.17",
    connectionClass: "later_reinterpretation",
    similarities:
      "Bacstrom's 'For this reason I am called Chiram Telat Mechasot, one in essence, but three in aspect' stands where the vulgate has 'Therefore I am called Hermes, having three parts of the wisdom of the whole world'; before it comes 'In this manner the world was created', and after it 'It is ended now, what I have said concerning the effects of the sun'.",
    differences: "The speaker is 'Chiram', not Hermes, and the three parts of wisdom become a trinity 'one in essence, but three in aspect'.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: `Bacstrom's translation with notes, as Hall prints it. ${HALLS_DISCUSSION}`,
    reviewStatus: "proposed",
  },
  {
    key: "hall-17-scorpion-bd-86",
    from: `${PREFIX}.17.s1.p3`,
    to: "egy.bd.86",
    connectionClass: "later_reinterpretation",
    similarities:
      "Hall quotes 'the papyrus of Ani (The Book of the Dead)': 'I am a swallow, I am that scorpion, the daughter of Ra!' — the opening words of the chapter of changing into a swallow.",
    differences:
      "In the Book of the Dead the words are the dead man's spell to take the form of a swallow; Hall cites them as evidence that the soul was likened to a scorpion, a symbol of wisdom and of initiation.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: `Hall names the Papyrus of Ani; his English is close to Budge's. Which chapter he quotes is our identification, not his. ${HALLS_DISCUSSION}`,
    earlierNote: "The Papyrus of Ani dates from about 1250 BCE.",
    reviewStatus: "proposed",
  },
  {
    key: "hall-17-scarab-bd-30b",
    from: `${PREFIX}.17.s1.p2`,
    to: "egy.bd.30b",
    connectionClass: "later_reinterpretation",
    similarities:
      "Hall quotes 'The Book of the Dead' on making a scarab of green stone to be placed in the breast of a man, which 'shall perform for him the opening of the mouth' — the instruction for the heart scarab that goes with the chapter of not letting the heart be driven away.",
    differences:
      "In the Book of the Dead it is a rubric telling how to make and place the amulet; Hall uses it in a discussion of whether scarabs were placed in the body at embalming.",
    wordingComparable: "partly",
    meaningComparable: "yes",
    transmissionEvidence: `Hall names the Book of the Dead but no chapter or papyrus; the rubric is found with chapter 30B in other copies (Budge prints it from the Papyrus of Nu, not Ani). The identification is ours and has not been checked. ${HALLS_DISCUSSION}`,
    reviewStatus: "proposed",
  },
];

export const HALL_CORPUS: TextCorpusFile = {
  workKey: "modern.hall",
  revision: "hall-1928-2026-10",
  sources: SOURCES,
  images: [],
  passages: buildPassages(),
  links: LINKS,
};
