// BOOK OF THE DEAD: every chapter Budge lists for the Theban version, with
// his translation of the Papyrus of Ani wherever the papyrus has the chapter.
//
// The text comes from the generated file beside this one (Budge 1895, from
// the web edition at sacred-texts.com, split by
// scripts/texts/budge-book-of-the-dead.py). What a reader needs beyond it —
// summaries, themes, the papyri and their pictures — is written here.
//
// The skeleton is Budge's own list of the chapters of the Theban version
// (pp. xxxi–xlvi), in Lepsius's numbering: every number he lists is a passage,
// with his title for it. Where the Papyrus of Ani carries the chapter, his
// running translation of it is added in full; where Budge fills a gap from
// another papyrus he says so, and so does the passage. The modern complete
// translations (Allen 1974, Faulkner 1985, Quirke 2013) are in copyright and
// are cited on every chapter, never quoted.
//
// Hierarchy: chapter → the separate pieces of it in the papyrus, where Ani
// has the chapter more than once (the hymns of Chapter XV) or Budge adds a
// fuller version from another copy.

import type { CorpusImage, CorpusLayer, CorpusManuscript, CorpusPassage, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { BD_ANI, BD_RENUMBERED, BD_TEXT, BD_THEBAN } from "./book-of-the-dead-text";
import { BD_RELATED_IMAGES } from "./book-of-the-dead-related-images";

const PREFIX = "egy.bd";

const SOURCES = INVENTORY_SOURCES.filter((s) =>
  ["budge-bd", "lepsius-bd", "totenbuch-bonn", "allen-bd", "faulkner-bd", "quirke-bd"].includes(s.key)
);

const WEB_EDITION =
  "E. A. Wallis Budge, The Book of the Dead: The Papyrus of Ani in the British Museum (1895), as published by sacred-texts.com (scanned 2000). Public domain.";

const TRANSLATION_EVIDENCE = `${WEB_EDITION} Budge's running translation, with his line numbers of the papyrus in round brackets; square brackets are his. His descriptions of the vignettes, his notes and the versions he quotes from other papyri are left out.`;

const TITLE_EVIDENCE = `${WEB_EDITION} The chapter's title as Budge gives it in his list of the chapters of the Theban version`;

/** The modern translations, cited on every chapter. */
const REFERENCES: { key: string; sourceKey: string; cite: string }[] = [
  { key: "eng-allen", sourceKey: "allen-bd", cite: "T. G. Allen, The Book of the Dead or Going Forth by Day (1974)" },
  { key: "eng-faulkner", sourceKey: "faulkner-bd", cite: "R. O. Faulkner, The Ancient Egyptian Book of the Dead (1985)" },
  { key: "eng-quirke", sourceKey: "quirke-bd", cite: "S. Quirke, Going out in Daylight (2013)" },
];

function referenceLayers(number: string): CorpusLayer[] {
  return REFERENCES.map(({ key, sourceKey, cite }) => ({
    key,
    layer: "translation",
    sourceKey,
    contentAbsentReason: `In copyright, cited only: ${cite}, which arranges the spells by number. Look there for spell ${number}.`,
    language: "English",
    licence: "copyrighted_reference",
    evidence:
      "Each of these translations follows Lepsius's numbering as later extended. Whether it treats this number as Budge does, and under which letter, has not been checked for this archive.",
  }));
}

/** Chapters whose subject is plain from Budge's text, summarised for this archive. */
const CHAPTERS: Record<string, { summary: string; themes?: [string, string][] }> = {
  "1": {
    summary:
      "The opening chapter, to be said on the day of burial: the dead man speaks as one of the gods who fight for Osiris, and asks to go in and come out of the underworld and to pass the weighing of words.",
    themes: [["underworld", "Going in to, and coming out of, the underworld on the day of burial."]],
  },
  "15": {
    summary:
      "Hymns of praise to the sun god Ra at his rising and setting, and to Osiris. Ani's papyrus opens with two of them and has more further on.",
    themes: [["sun-and-moon", "Hymns to the rising and setting sun."]],
  },
  "17": {
    summary:
      "A long statement by the creator ('I am Tmu … I am Ra who rose in the beginning'), interrupted at every phrase by a commentary that asks 'Who then is this?' and explains it, sometimes with several alternative answers.",
    themes: [
      ["creation", "The creator speaks of his first appearance out of Nu, the primeval water."],
      ["time-and-eternity", "'I am Yesterday; I know Tomorrow.'"],
    ],
  },
  "18": {
    summary:
      "A litany to Thoth, repeated before the councils of gods in one sacred place after another, asking that the dead man be made victorious over his enemies as Osiris was.",
    themes: [["cosmic-law", "Vindication before the divine councils."]],
  },
  "26": {
    summary:
      "A spell for having one's heart given back in the next world, together with the use of mouth, feet, hands and arms, so that the dead man can act as his ka wishes and his soul is not shut off from his body.",
    themes: [["the-soul", "The heart, seat of mind and will, restored to the dead."]],
  },
  "30b": {
    summary:
      "The heart spell ('My heart, my mother'): the dead man asks his own heart not to stand up as a witness against him when it is weighed in the balance.",
    themes: [["cosmic-law", "The heart is weighed and must not testify against its owner."]],
  },
  "42": {
    summary:
      "Every part of the dead man's body, from his hair to his feet, is declared to be that of a god, so that no part of him can be harmed.",
    themes: [["transformation", "The body made divine limb by limb."]],
  },
  "72": {
    summary: "A chapter for coming forth by day; its rubric promises that whoever knows it will receive offerings and go freely in the Fields of Aaru.",
    themes: [["underworld", "Free passage and provision in the next world."]],
  },
  "89": {
    summary: "A spell for letting the soul, the ba, return to and be reunited with the mummified body.",
    themes: [["the-soul", "The ba rejoins the body."]],
  },
  "110": {
    summary:
      "The Field of Peace (Sekhet-hetepu): the dead man asks to plough, reap, eat and drink there as on earth. The vignette shows those fields and their waterways.",
    themes: [["underworld", "An agricultural paradise in the next world."]],
  },
  "125": {
    summary:
      "The judgement in the Hall of Double Right and Truth: the dead man declares to Osiris and then to each of forty-two gods, by name, a sin he has not committed (the 'Negative Confession').",
    themes: [
      ["cosmic-law", "Forty-two declarations of innocence before the gods of the hall of judgement."],
      ["underworld", "The hall of judgement in the next world."],
    ],
  },
  "146": {
    summary: "The pylons (gateways) of the house of Osiris: at each the dead man names the gate and its doorkeeper so as to be let through.",
    themes: [["magic-and-sacred-words", "Knowing the names opens the gates."], ["underworld", "The gateways of the realm of Osiris."]],
  },
  "147": {
    summary: "The seven halls (arits) of Osiris, each with a doorkeeper, a watcher and a herald whose names the dead man must know.",
    themes: [["magic-and-sacred-words", "Knowing the names opens the halls."], ["underworld", "The halls of the realm of Osiris."]],
  },
  "151": {
    summary:
      "The scene in the burial chamber: Isis, Nephthys, Anubis, the four sons of Horus, the flames of Isis and Nephthys, the Tet and other figures each speak words of protection over the mummy.",
    themes: [["death-and-rebirth", "The mummy protected in the tomb."]],
  },
  "155": {
    summary: "A spell to be spoken over a djed-pillar (Budge's 'Tet') amulet of gold.",
    themes: [["magic-and-sacred-words", "Words for an amulet."]],
  },
  "156": {
    summary: "A spell to be spoken over a buckle (tyet) amulet, invoking the blood and power of Isis as protection.",
    themes: [["magic-and-sacred-words", "Words for an amulet."]],
  },
  "166": {
    summary: "A spell for the headrest placed under the head of the mummy.",
    themes: [["magic-and-sacred-words", "Words for an amulet."]],
  },
  "175": {
    summary:
      "Ani speaks to Thoth of the strife among the children of Nut, then asks Tmu (Atum) what manner of land he has come to, without water or air and black as night; the answer is that he shall live 'for millions of millions of years', and Horus is confirmed on the throne of Osiris.",
    themes: [["immortality", "'Thou shalt live for millions of millions of years.'"]],
  },
  "185": {
    summary: "A hymn of praise to Osiris, dweller in Amentet.",
  },
  "186": {
    summary: "A hymn of praise to Hathor, lady of Amentet, the last piece in the Papyrus of Ani.",
  },
};

const TRANSFORMATIONS = new Set(["76", "77", "78", "80", "81a", "81b", "82", "83", "84", "85", "86", "87", "88"]);

const JUDGEMENT_SUMMARY =
  "The words written beside the weighing of Ani's heart: Thoth announces that the heart has been weighed and found true, the gods answer that Ani is righteous and may not be given to the devourer Amemet, and Horus presents him to Osiris.";

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "papyrus-ani",
    name: "Papyrus of Ani",
    objectKind: "papyrus",
    holdingInstitution: "British Museum",
    accessionNumber: "EA 10470",
    findspot: "Thebes",
    isApproximate: true,
    originalDateText: "Nineteenth Dynasty, c. 1250 BCE, as usually dated now; Budge (1895) put it between 1500 and 1400 BC",
    sourceKey: "budge-bd",
    notes:
      "The copy made for the scribe Ani; his wife Tutu (Budge's Thuthu) appears beside him. Budge: 'found at Thebes, and … purchased by the Trustees of the British Museum in 1888.' His translation, imported here, follows its plates I–XXXVII.",
  },
  {
    key: "papyrus-hunefer",
    name: "Papyrus of Hunefer",
    objectKind: "papyrus",
    holdingInstitution: "British Museum",
    accessionNumber: "EA 9901",
    isApproximate: true,
    originalDateText: "Nineteenth Dynasty",
    notes: "The British Museum describes its sheet 3 as the judgement vignette with captions and spell 30. Not translated here.",
  },
];

type Placed = CorpusImage & { chapter?: string; manuscriptKey?: string };

const IMAGES: Placed[] = [
  {
    key: "ani-weighing-of-the-heart",
    chapter: "judgement",
    manuscriptKey: "papyrus-ani",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ee/BD_Weighing_of_the_Heart.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:BD_Weighing_of_the_Heart.jpg",
    institution: "British Museum",
    accessionNumber: "EA 10470",
    objectDate: "Nineteenth Dynasty, c. 1250 BCE",
    caption:
      "The weighing of the heart in the Papyrus of Ani: Anubis weighs Ani's heart against the feather of Maat while Thoth stands ready to record the result and the devourer waits; the gods sit in judgement above.",
    creator: "Photograph: British Museum",
    credit: "British Museum, via Wikimedia Commons (from E. R. Russmann, Eternal Egypt, 2001)",
    licence: "Public domain (PD-Art: a faithful photograph of a public-domain two-dimensional work)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "ani-funeral-procession-facsimile",
    chapter: "1",
    manuscriptKey: "papyrus-ani",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/70/BD_Funeral.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:BD_Funeral.jpg",
    institution: "British Museum",
    accessionNumber: "EA 10470",
    objectDate: "Nineteenth Dynasty, c. 1250 BCE",
    imageDate: "1890 (facsimile)",
    caption:
      "Budge's 1890 colour facsimile of the funeral procession in the Papyrus of Ani, the vignette of Chapter I: oxen draw Ani's mummy on its bier, his wife Tutu kneels beside it, and servants bring the canopic chest and the burial goods.",
    creator: "Facsimile made for the British Museum under E. A. Wallis Budge",
    credit: "Scanned from a 1994 reprint of the facsimile, via Wikimedia Commons",
    licence: "Public domain in the United States (PD-US)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "ani-field-of-peace-facsimile",
    chapter: "110",
    manuscriptKey: "papyrus-ani",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7d/BD_Field_of_Hotep.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:BD_Field_of_Hotep.jpg",
    institution: "British Museum",
    accessionNumber: "EA 10470",
    objectDate: "Nineteenth Dynasty, c. 1250 BCE",
    imageDate: "1890 (facsimile)",
    caption:
      "Budge's 1890 colour facsimile of the Field of Peace (Sekhet-hetepu) in the Papyrus of Ani, the vignette of Chapter CX: Ani ploughs, reaps, sails and makes offerings among the fields and waterways of the next world.",
    creator: "Facsimile made for the British Museum under E. A. Wallis Budge",
    credit: "Scanned from a 1994 reprint of the facsimile, via Wikimedia Commons",
    licence: "Public domain in the United States (PD-US)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "ani-spell-17",
    chapter: "17",
    manuscriptKey: "papyrus-ani",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Bookofthedeadspell17.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Bookofthedeadspell17.jpg",
    institution: "British Museum",
    accessionNumber: "EA 10470",
    objectDate: "Nineteenth Dynasty, c. 1250 BCE",
    caption:
      "UNVERIFIED — A section of the Papyrus of Ani that its uploader identifies as Chapter (spell) 17, cut from a larger photograph of the papyrus. Which part of the chapter it shows has not been matched to Budge's plates here.",
    credit: "Wikimedia Commons, from the Vassar College Book of the Dead project",
    licence: "Public domain (PD-Art: a faithful photograph of a public-domain two-dimensional work)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    whatIsUnverified: "That the section shows Chapter 17 rather than a neighbouring chapter; the identification is the uploader's.",
    verificationStatus: "unverified",
  },
  {
    key: "hunefer-judgement-sheet-3",
    manuscriptKey: "papyrus-hunefer",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Book_of_the_Dead_of_Hunefer_sheet_3.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Book_of_the_Dead_of_Hunefer_sheet_3.jpg",
    institution: "British Museum",
    accessionNumber: "EA 9901,3",
    objectDate: "Nineteenth Dynasty",
    caption:
      "Sheet 3 of the Book of the Dead of Hunefer: Anubis leads Hunefer to the balance and weighs his heart, Thoth records the verdict, and Horus presents him to Osiris enthroned, with the judging gods in a row above.",
    credit: "British Museum (free image service), via Wikimedia Commons",
    licence: "Public domain (PD-Art: a faithful photograph of a public-domain two-dimensional work)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];

/** The manuscript photographs above, then the vignettes, objects and places beside them. */
const ALL_IMAGES: Placed[] = [...IMAGES, ...BD_RELATED_IMAGES];

function imagesFor(chapter: string): CorpusImage[] | undefined {
  const found = ALL_IMAGES.filter((image) => image.chapter === chapter).map((image) => {
    const copy: Placed = { ...image };
    delete copy.chapter;
    delete copy.manuscriptKey;
    return copy;
  });
  return found.length > 0 ? found : undefined;
}

/** "30b" → [30, "b", 0]; "15b-2" → [15, "b", 2]. */
function sortKey(key: string): [number, string, number] {
  const m = /^(\d+)([a-z]?)(?:-(\d+))?$/.exec(key)!;
  return [Number(m[1]), m[2], Number(m[3] ?? 0)];
}

function compareKeys(a: string, b: string) {
  const [an, al, as] = sortKey(a);
  const [bn, bl, bs] = sortKey(b);
  return an - bn || al.localeCompare(bl) || as - bs;
}

/** "30b" → "30B"; "15b-2" → "15B (2)". */
function display(key: string) {
  const [n, letter, sub] = sortKey(key);
  return `${n}${letter.toUpperCase()}${sub ? ` (${sub})` : ""}`;
}

const pages = (first: number, last: number) => (first === last ? `p. ${first}` : `pp. ${first}–${last}`);
const plates = (p: string) => (/[–-]/.test(p) ? `pll. ${p.replace("-", "–")}` : `pl. ${p}`);

type Piece = (typeof BD_TEXT)[number];

function pieceLayer(piece: Piece): CorpusLayer {
  const [, , , , supplied, english] = piece;
  return {
    key: "eng-budge",
    layer: "translation",
    sourceKey: "budge-bd",
    content: english,
    language: "English",
    licence: "public_domain",
    evidence: supplied
      ? `${TRANSLATION_EVIDENCE} The Papyrus of Ani does not have this text; Budge supplies it from ${supplied}.`
      : TRANSLATION_EVIDENCE,
  };
}

function pieceWitness(piece: Piece) {
  const [, platesText, , , supplied] = piece;
  return supplied ? undefined : [{ manuscriptKey: "papyrus-ani", locus: `Budge's ${plates(platesText)}` }];
}

function pieceNotes(piece: Piece) {
  const [, , , , supplied] = piece;
  return supplied ? `Not in the Papyrus of Ani: Budge supplies the text from ${supplied}.` : undefined;
}

function buildPassages(): CorpusPassage[] {
  const theban = new Map<string, (typeof BD_THEBAN)[number]>(BD_THEBAN.map((row) => [row[0], row]));
  const ani = new Map<string, string[]>();
  for (const [key, entry] of BD_ANI) ani.set(key, [...(ani.get(key) ?? []), entry]);
  const pieces = new Map<string, Piece[]>();
  for (const piece of BD_TEXT) pieces.set(piece[0], [...(pieces.get(piece[0]) ?? []), piece]);
  const renumbered = new Map<string, string[]>();
  for (const [from, to] of BD_RENUMBERED) renumbered.set(to, [...(renumbered.get(to) ?? []), from]);

  const keys = [...new Set([...theban.keys(), ...[...pieces.keys()].filter((k) => k !== "judgement")])].sort(compareKeys);
  const passages: CorpusPassage[] = [];
  for (const key of keys) {
    const listed = theban.get(key);
    const own = pieces.get(key) ?? [];
    const known = CHAPTERS[key];
    const passageKey = `${PREFIX}.${key}`;
    const number = display(key);
    const notes: string[] = [];
    if (listed?.[3]) {
      notes.push("Budge marks this chapter with an asterisk as one of the Saite additions, not found in the Theban version.");
    }
    if (key === "101") notes.push("Budge prints the number as 'CL.*'; its place in his list, between C and CII, shows that CI is meant.");
    if (listed && /^Chapters /.test(listed[1])) notes.push(`Budge lists ${listed[1].replace(/\.$/, "")} together under one title.`);
    for (const from of renumbered.get(key) ?? []) {
      notes.push(`Budge lists Lepsius's chapter ${from} only to say that it is now known as chapter ${number}.`);
    }
    if (!listed) notes.push("Not in Budge's list of the chapters of the Theban version; it is numbered from his List of Chapters of the Papyrus of Ani.");
    for (const entry of ani.get(key) ?? []) notes.push(`Budge's List of Chapters of the Papyrus of Ani: ${entry}`);
    if (own.length === 0 && listed && !ani.has(key)) notes.push("The Papyrus of Ani does not have this chapter's text; only Budge's title for it is given here.");

    const layers: CorpusLayer[] = [];
    const title = listed?.[2] ?? null;
    if (title) {
      layers.push({
        key: "eng-budge-title",
        layer: "translation",
        sourceKey: "budge-bd",
        content: title,
        language: "English",
        licence: "public_domain",
        evidence: `${TITLE_EVIDENCE} (p. ${listed![4]}).`,
      });
    }
    if (own.length === 1) layers.push(pieceLayer(own[0]));
    layers.push(...referenceLayers(number));

    const themes = [
      ...(known?.themes ?? []),
      ...(TRANSFORMATIONS.has(key) ? ([["transformation", "One of the chapters of 'making transformations' into a god, bird or animal."]] as [string, string][]) : []),
    ];
    const single = own.length === 1 ? own[0] : null;
    const singleNote = single ? pieceNotes(single) : undefined;
    passages.push({
      key: passageKey,
      divisionKind: "spell",
      label: `Chapter ${number}`,
      reference: single
        ? `BD ${number} (Lepsius); Budge 1895, ${plates(single[1])}, ${pages(single[2], single[3])}`
        : `BD ${number} (Lepsius)`,
      sourceKey: "budge-bd",
      summary: known?.summary,
      verificationStatus: "unverified",
      notes: [...(singleNote ? [singleNote] : []), ...notes].join(" ") || undefined,
      layers,
      witnesses: single ? pieceWitness(single) : own.some((p) => !p[4]) ? [{ manuscriptKey: "papyrus-ani" }] : undefined,
      themes: themes.length > 0 ? themes.map(([themeKey, note]) => ({ themeKey, note })) : undefined,
      images: imagesFor(key),
    });

    if (own.length > 1) {
      own.forEach((piece, i) => {
        passages.push({
          key: `${passageKey}.${i + 1}`,
          parentKey: passageKey,
          divisionKind: "section",
          label: `Chapter ${number}, ${plates(piece[1]).replace("pll.", "Plates").replace("pl.", "Plate")}${piece[4] ? " (from another papyrus)" : ""}`,
          reference: `BD ${number} (Lepsius); Budge 1895, ${plates(piece[1])}, ${pages(piece[2], piece[3])}`,
          sourceKey: "budge-bd",
          verificationStatus: "unverified",
          notes:
            pieceNotes(piece) ??
            (key === "125" && piece[0] === "125" && piece[5].startsWith("Rubric")
              ? "Budge prints this rubric at the head of Plate XXXIII without a chapter number. His account of the papyrus's contents runs '… XLII., CXXV., Rubric, CLV. …', so it is kept with Chapter CXXV."
              : undefined),
          layers: [pieceLayer(piece)],
          witnesses: pieceWitness(piece),
        });
      });
    }

    if (key === "30b") {
      const [judgement] = pieces.get("judgement")!;
      passages.push({
        key: `${PREFIX}.judgement`,
        divisionKind: "scene",
        label: "The judgement scene",
        reference: `Budge 1895, ${plates(judgement[1])}, ${pages(judgement[2], judgement[3])}`,
        sourceKey: "budge-bd",
        summary: JUDGEMENT_SUMMARY,
        verificationStatus: "unverified",
        notes:
          "The speeches written beside the weighing of the heart in the Papyrus of Ani. Budge prints them after the heart spell (Chapter XXXB) that stands above the scene; they belong to no numbered chapter.",
        layers: [pieceLayer(judgement)],
        witnesses: pieceWitness(judgement),
        themes: [
          { themeKey: "cosmic-law", note: "The heart weighed against Maat, and the verdict." },
          { themeKey: "thoth-and-hermes", note: "Thoth records and announces the verdict." },
        ],
        images: imagesFor("judgement"),
      });
    }
  }
  return passages;
}

export const BOOK_OF_THE_DEAD_CORPUS: TextCorpusFile = {
  workKey: "egy.book-of-the-dead",
  revision: "budge-ani-2026-10",
  sources: SOURCES,
  manuscripts: MANUSCRIPTS,
  images: ALL_IMAGES.filter((image) => image.chapter == null).map((image) => {
    const copy: Placed = { ...image };
    delete copy.chapter;
    return copy;
  }),
  passages: buildPassages(),
};
