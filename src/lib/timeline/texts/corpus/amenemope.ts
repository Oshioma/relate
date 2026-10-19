// THE INSTRUCTION OF AMENEMOPE, in Griffith's English (1926), chapter by
// chapter, verse line by verse line.
//
// The text comes from amenemope-text.ts. The papyrus numbers its own thirty
// chapters ("First Chapter", …), so the thirty chapter passages are the units
// counted (egy.amenemope.1 … egy.amenemope.30); the prologue (Griffith's "The
// Book", "The Author" and "The Person to whom the Teaching was addressed") and
// the scribe's colophon are stored as sections. The chapter titles are
// Griffith's, not the papyrus's. Each verse line keeps Griffith's page and
// line number of the papyrus, which is how every edition cites the text.
//
// Griffith compares many verses with the Book of Proverbs (22:17–24:22). The
// Hebrew Bible is not part of this archive's inventory, so the comparisons are
// recorded in the chapter notes, as Griffith gives them, and not as links.
// Modern translations (Lichtheim, Simpson, Laisney) are cited, never quoted.
// Nothing is marked verified: the text was typed from OCR and checked against
// two other OCRs, not against page images.

import type { CorpusImage, CorpusLayer, CorpusLink, CorpusManuscript, CorpusPassage, CorpusPassageDate, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { AMENEMOPE_SECTIONS, type GriffithSection } from "./amenemope-text";

const PREFIX = "egy.amenemope";

const SOURCES = INVENTORY_SOURCES.filter((s) =>
  ["griffith-amenemope", "lichtheim-ael", "simpson-lae-2003", "laisney-amenemope-2007", "gunn-ptahhotep"].includes(s.key)
);

const GRIFFITH_EVIDENCE =
  "F. Ll. Griffith, 'The Teaching of Amenophis the Son of Kanakht', Journal of Egyptian Archaeology 12 (1926), translation pp. 195–225. Typed from the archive.org OCR of the volume (in.ernet.dli.2015.70985) and checked line by line against a second OCR of another copy (dli.ministry.15436) and a third; every correction is of a certain OCR misreading. No page images could be reached. Public domain: published 1926 (out of copyright in the US) and Griffith died in 1934. Each line begins with Griffith's page and line number of the papyrus; lines he prints without a number have none. His red-ink underlining, most diacritics on names and his philological notes are not kept; parentheses and (?) are his.";

function verses(section: GriffithSection): string {
  return section.lines.map(([ref, text]) => (ref ? `${ref} ${text}` : text)).join("\n");
}

function span(section: GriffithSection): string {
  const refs = section.lines.map(([ref]) => ref).filter((ref): ref is string => ref != null);
  return refs.length > 1 ? `${refs[0]}–${refs[refs.length - 1]}` : refs[0];
}

function englishLayer(section: GriffithSection): CorpusLayer {
  return {
    key: "eng-griffith",
    layer: "translation",
    sourceKey: "griffith-amenemope",
    content: verses(section),
    language: "English",
    licence: "public_domain",
    evidence: GRIFFITH_EVIDENCE,
  };
}

function modernLayers(where: string): CorpusLayer[] {
  const cite = (key: string, sourceKey: string, language: string, book: string): CorpusLayer => ({
    key,
    layer: "translation",
    sourceKey,
    contentAbsentReason: `In copyright, cited only: ${book}, ${where}.`,
    language,
    licence: "copyrighted_reference",
    evidence: "A modern translation from the hieratic. Named so a reader can find the passage; no text is reproduced.",
  });
  return [
    cite("eng-lichtheim", "lichtheim-ael", "English", "M. Lichtheim, Ancient Egyptian Literature II (1976), 'Instruction of Amenemope'"),
    cite("eng-simpson", "simpson-lae-2003", "English", "W. K. Simpson (ed.), The Literature of Ancient Egypt (3rd ed., 2003), 'The Instruction of Amenemope'"),
    cite("fra-laisney", "laisney-amenemope-2007", "French", "V. P.-M. Laisney, L'Enseignement d'Aménémopé (2007)"),
  ];
}

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "bm-ea-10474",
    name: "Papyrus British Museum EA 10474",
    objectKind: "papyrus",
    holdingInstitution: "British Museum",
    accessionNumber: "EA 10474",
    findspot: "Thebes (as given on the Commons record of the British Museum's photograph)",
    startYear: -746,
    endYear: -485,
    datePrecision: "century",
    isApproximate: true,
    originalDateText:
      "'the Twenty-fifth Dynasty as the earliest date, and the reign of Darius as the latest' (Griffith 1926); 'Third Intermediate Period (1077-664 BC)' (Commons record of the British Museum photograph)",
    datingEvidence:
      "Disputed. Griffith dated the copy by its script and orthography and by the names of the scribe Senu and his father Pemu, which first appear late in the Twenty-second Dynasty. The Commons record, from the British Museum's image, gives the Third Intermediate Period. Not checked against the British Museum's catalogue.",
    sourceKey: "griffith-amenemope",
    notes:
      "The only complete copy: just over twelve feet long and ten inches high, cut into lengths and glazed so that both sides show; the verso has hymns to the Sun and Moon and a calendar of lucky and unlucky days (Griffith 1926). Bought for the British Museum through Wallis Budge in 1888 (Commons record); facsimile in Budge's Facsimiles of Egyptian Hieratic Papyri, Second Series (1923). Written one verse to a line, as Griffith notes, with some words in red.",
  },
  {
    key: "turin-writing-tablet",
    name: "Turin writing tablet with Amenemope 24.1–25.9",
    objectKind: "tablet",
    holdingInstitution: "Museo Egizio, Turin",
    startYear: -1099,
    endYear: -485,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "'Bold writing of the end of Dyn. XX' (Gardiner, quoted by Griffith); 'the writing must probably be later than the Twentieth Dynasty' (Griffith 1926)",
    datingEvidence:
      "Disputed: Gardiner dated the hand to the end of the Twentieth Dynasty; Griffith thought it later, and no earlier than the British Museum papyrus if, as he suspected, it was dictated from it. The range covers both views. Accession number not given here: not found in the sources read.",
    sourceKey: "griffith-amenemope",
    notes:
      "A wooden school tablet, 30 × 13.5 cm, with the text of papyrus 24.1–25.9 (chapters 24–26) written over several lessons, the days of the month noted at intervals. Because the extract begins at the top of a page of the papyrus, Griffith suggested a teacher dictated it from that very papyrus.",
  },
  {
    key: "met-26-3-165",
    name: "Hieratic ostracon with the beginning of Amenemope (Metropolitan Museum of Art 26.3.165)",
    objectKind: "ostracon",
    holdingInstitution: "Metropolitan Museum of Art, New York",
    accessionNumber: "26.3.165",
    startYear: -524,
    endYear: -403,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "525–404 BC (the museum's date, as given on Commons)",
    datingEvidence: "The museum's dating, as given on the Commons record of its photograph; not checked against the museum's own page.",
    catalogueUrl: "https://www.metmuseum.org/art/collection/search/558553",
    notes: "A limestone flake with the opening lines of the teaching in hieratic, a school copy or exercise. Which lines it holds has not been checked here.",
  },
];

type Placed = CorpusImage & { passageKey?: string; manuscriptKey?: string };

const IMAGES: Placed[] = [
  {
    key: "bm-ea-10474-amenemope-papyrus",
    manuscriptKey: "bm-ea-10474",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/77/Papyrus_with_the_Instruction_of_Amenemope.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Papyrus_with_the_Instruction_of_Amenemope.jpg",
    institution: "British Museum",
    objectDate: "Third Intermediate Period (Commons record); Twenty-fifth Dynasty to Darius I (Griffith)",
    caption:
      "UNVERIFIED — A length of the British Museum papyrus of Amenemope, 'copied by the scribe Senu, son of Pemu': four pages of hieratic written one verse to a line, with chapter headings in red and a page number '4' above one column. The Commons record gives no accession number; that this is EA 10474, and which pages are shown, are not checked.",
    creator: "Senu, son of Pemu (scribe)",
    credit: "British Museum, via Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-70; Creative Commons Public Domain Mark 1.0)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    whatIsUnverified:
      "The accession number (EA 10474) and which pages of the roll are shown. The Commons record, taken from the British Museum's image page, names the text, the scribe and the purchase through Budge in 1888 but gives no number or page.",
    verificationStatus: "unverified",
  },
  {
    key: "met-26-3-165-amenemope-ostracon",
    passageKey: `${PREFIX}.preface-a`,
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Hieratic_Ostracon_with_the_beginning_of_%22The_Wisdom_of_Amenemope%22_MET_BB26.3.165.jpeg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Hieratic_Ostracon_with_the_beginning_of_%22The_Wisdom_of_Amenemope%22_MET_BB26.3.165.jpeg",
    institution: "Metropolitan Museum of Art, New York",
    accessionNumber: "26.3.165",
    objectDate: "525–404 BC",
    caption:
      "A limestone ostracon in the Metropolitan Museum with the beginning of the Instruction of Amenemope in hieratic, dated by the museum to 525–404 BC: a second, later witness to the opening lines, beside the British Museum papyrus.",
    credit: "Metropolitan Museum of Art, via Wikimedia Commons",
    licence: "Creative Commons CC0 1.0 Universal Public Domain Dedication",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];

function imagesFor(passageKey: string): CorpusImage[] | undefined {
  const found = IMAGES.filter((image) => image.passageKey === passageKey).map((image) => {
    const copy: Placed = { ...image };
    delete copy.passageKey;
    delete copy.manuscriptKey;
    return copy;
  });
  return found.length > 0 ? found : undefined;
}

/** Griffith's comparisons with Proverbs, and other notes, by chapter. Notes only: no links. */
const CHAPTER_NOTES: Record<string, string> = {
  "preface-a": "Griffith compares 1.5–6 ('to answer a statement … return a report to one that has sent him') with Prov. 22:21.",
  "preface-b":
    "Griffith reads the author's titles as literary paraphrases of an office over land and corn, not titles found on monuments (except 1.13 and 2.3); the places tie him to Akhmim (Panopolis) and Abydos.",
  "1": "Griffith compares 3.10–11 with Prov. 22:17–18, and notes that 3.11–12 closely resembles the introduction to Ptahhotep (Papyrus Prisse 5.7–8): 'A profitable thing to him who shall obey, (but) baneful to him that shall transgress it'. Griffith notes that the first line of the final quatrain recurs as the first line of the final couplet of chapters 3 and 15.",
  "6": "Griffith compares the landmark verses with Prov. 22:28 and 23:10–11, and the closing 'better is …' sayings with Prov. 15:16–17 and 17:1. The last couplet recurs at the end of chapter 13.",
  "7": "Griffith compares riches that 'make themselves wings like geese' and fly to heaven with Prov. 23:4–5. Shay and Renent are the gods of fate and fortune.",
  "9": "Griffith compares the warning against the passionate man with Prov. 22:24–25. The lines '(and reform his ways!)' and '(He is like a ….)' are printed by Griffith without line numbers.",
  "10": "Griffith compares falsehood as 'the abomination of God' (13.15–16, 14.2) with Prov. 12:22, and 'sever not thy heart from thy tongue, that all thy ways may be successful' (14.1) with Prov. 16:3.",
  "11": "Griffith compares 14.5–8 and 14.17 (the dependent's bread, swallowed and vomited) with Prov. 23:6 and 23:8.",
  "13": "Griffith compares the closing 'better is …' sayings with Prov. 16:8; its last couplet repeats the end of chapter 6.",
  "16": "The Ape by the balance is the baboon of Thoth, the god named in the next lines.",
  "17": "Griffith compares the two-measure bushel with Prov. 20:10 and 20:23. 'Wbn-nakht', left in transliteration, is glossed in his note as a word meaning 'shining'.",
  "18": "Sethe, in a note Griffith prints, compares 'The words which men say are one thing, the things which God doeth are another' with Prov. 16:9. The line '(The events of the morrow are in the hand of God)' is printed by Griffith without a line number. '(sic)' is his.",
  "21": "Griffith compares 'say not … find me a redeemer' with Prov. 20:22, the man who lays bare his heart with Prov. 20:19, and the man who hides his report within himself with Prov. 12:23. In additional notes at the end of his article he slightly changes his rendering of 21.13–16.",
  "22": "The last four lines repeat the end of chapter 21 ('Verily thou knowest not the designs of God …').",
  "23": "Griffith compares eating before a noble with Prov. 23:1–3, and 23.15 with Prov. 20:17 and 23:3.",
  "24": "The Turin writing tablet begins at 24.1, the top of a page of the papyrus, and runs to 25.9.",
  "25": "Griffith slightly revises his rendering of 25.21 in additional notes at the end of his article.",
  "30": "Griffith compares 'these thirty chapters' (27.7) with Prov. 22:20.",
  colophon: "Senu son of Pemu is the scribe of this copy, not the author; Griffith uses the two names to date the papyrus.",
};

const THEMES: Record<string, [string, string][]> = {
  "7": [["fate-and-free-will", "'There is no ignoring of Shay and Renent' — fate and fortune — 'every man is (destined) for his hour.'"]],
  "15": [["thoth-and-hermes", "The scribe's finger is 'the beak of the Ibis', and the Ape of Thoth in Hermopolis (Khmun) watches the Two Lands for cheats."]],
  "16": [
    ["thoth-and-hermes", "'Where is a god so great as Thoth, he that discovered these things': the Ape by the balance."],
    ["cosmic-law", "False weights are 'a perversion before God'."],
  ],
  "17": [["sun-and-moon", "'The bushel is the Eye of Re‘': the grain measure is sacred to the Sun."]],
  "18": [["fate-and-free-will", "'Man knoweth not how the morrow will be … the tongue of a man is the rudder of a boat, (but) the Universal Lord is its pilot.'"]],
  "20": [["cosmic-law", "'Justice is a great gift of God, he will give it to him whom he will.'"]],
  "25": [["creation", "'Verily man is clay and straw, God is his fashioner; he pulls down and builds up each day.'"]],
};

const DATES: CorpusPassageDate[] = [
  {
    key: "composition-ramesside",
    role: "composition",
    startYear: -1299,
    endYear: -1069,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "Ramesside period, c. 1300–1070 BCE (disputed)",
    evidence: "The usual modern view, from the language and the earliest witnesses (as in Lichtheim); some scholars place the composition later. Not checked further here.",
    sourceKey: "lichtheim-ael",
  },
  {
    key: "composition-griffith",
    role: "composition",
    startYear: -1069,
    endYear: -524,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "'not earlier than the Eighteenth Dynasty … say Twenty-first to Twenty-sixth Dynasty' (Griffith 1926)",
    evidence: "Griffith's view in 1926, from the personal names in the prologue, which he admits 'give us singularly little help'. Superseded, but recorded as the view of the translation imported here.",
    sourceKey: "griffith-amenemope",
  },
  {
    key: "manuscript-bm",
    role: "manuscript",
    startYear: -746,
    endYear: -485,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "'the Twenty-fifth Dynasty as the earliest date, and the reign of Darius as the latest' (Griffith 1926)",
    evidence: "Griffith's dating of the British Museum papyrus by script, orthography and the scribe's name; the British Museum's image record, as quoted on Commons, says Third Intermediate Period (1077–664 BC). Disputed.",
    sourceKey: "griffith-amenemope",
  },
  {
    key: "translation",
    role: "translation_publication",
    startYear: 1926,
    endYear: 1926,
    datePrecision: "year",
    isApproximate: false,
    originalDateText: "1926",
    evidence: "Griffith's translation, in the Journal of Egyptian Archaeology 12.",
    sourceKey: "griffith-amenemope",
  },
];

function sectionFor(key: string): GriffithSection {
  const section = AMENEMOPE_SECTIONS.find((s) => s.key === key);
  if (!section) throw new Error(`Griffith has no section ${key}`);
  return section;
}

const reference = (section: GriffithSection) => `Papyrus BM 10474, ${span(section)} (Griffith's page and line numbers; JEA 12, 1926)`;

function buildPassages(): CorpusPassage[] {
  const passages: CorpusPassage[] = [];
  const prologue = `${PREFIX}.prologue`;
  passages.push({
    key: prologue,
    divisionKind: "section",
    label: "Prologue",
    reference: "Papyrus BM 10474, 1.1–3.7 (Griffith's page and line numbers; JEA 12, 1926)",
    sourceKey: "griffith-amenemope",
    summary:
      "Before the first chapter: what the book is for, a long list of the author Amenemope's offices over land and grain, and the son, Harmakher, a temple official at Akhmim, to whom it is addressed.",
    notes: "Griffith divides the prologue under three headings of his own, kept here as three sections. Not counted among the thirty chapters.",
    verificationStatus: "unverified",
    layers: modernLayers("the prologue"),
    witnesses: [{ manuscriptKey: "bm-ea-10474", locus: "1.1–3.7" }, { manuscriptKey: "met-26-3-165" }],
    dates: DATES,
  });
  const PREFACE_LABELS: Record<string, string> = {
    "preface-a": "Prologue: the book",
    "preface-b": "Prologue: the author",
    "preface-c": "Prologue: the son addressed",
  };
  for (const key of ["preface-a", "preface-b", "preface-c"]) {
    const section = sectionFor(key);
    const passageKey = `${PREFIX}.${key}`;
    passages.push({
      key: passageKey,
      parentKey: prologue,
      divisionKind: "section",
      label: PREFACE_LABELS[key],
      reference: reference(section),
      sourceKey: "griffith-amenemope",
      notes: [`Griffith's heading: '${section.heading}'`, CHAPTER_NOTES[key]].filter(Boolean).join(" "),
      verificationStatus: "unverified",
      layers: [englishLayer(section)],
      witnesses: [{ manuscriptKey: "bm-ea-10474", locus: span(section) }, ...(key === "preface-a" ? [{ manuscriptKey: "met-26-3-165" }] : [])],
      images: imagesFor(passageKey),
    });
  }
  for (let n = 1; n <= 30; n++) {
    const section = sectionFor(String(n));
    const passageKey = `${PREFIX}.${n}`;
    passages.push({
      key: passageKey,
      divisionKind: "chapter",
      label: `Chapter ${n}: ${section.heading.replace(/\.$/, "")}`,
      reference: `Chapter ${n}; ${reference(section)}`,
      sourceKey: "griffith-amenemope",
      notes: [`The chapter title is Griffith's; the papyrus heads it only '${section.lines[0][1].replace(/^He saith: /, "").replace(/:$/, "")}'.`, CHAPTER_NOTES[String(n)]]
        .filter(Boolean)
        .join(" "),
      verificationStatus: "unverified",
      layers: [englishLayer(section), ...modernLayers(`chapter ${n}`)],
      witnesses: [
        { manuscriptKey: "bm-ea-10474", locus: span(section) },
        ...(n >= 24 && n <= 26 ? [{ manuscriptKey: "turin-writing-tablet", locus: "24.1–25.9 of the papyrus, in part" }] : []),
      ],
      themes: THEMES[String(n)]?.map(([themeKey, note]) => ({ themeKey, note })),
      images: imagesFor(passageKey),
    });
  }
  const colophon = sectionFor("colophon");
  passages.push({
    key: `${PREFIX}.colophon`,
    divisionKind: "section",
    label: "Colophon",
    reference: reference(colophon),
    sourceKey: "griffith-amenemope",
    summary: "The copyist's note: the end of the book, written by Senu son of Pemu.",
    notes: CHAPTER_NOTES.colophon,
    verificationStatus: "unverified",
    layers: [englishLayer(colophon)],
    witnesses: [{ manuscriptKey: "bm-ea-10474", locus: span(colophon) }],
  });
  return passages;
}

const LINKS: CorpusLink[] = [
  {
    key: "amenemope-1-ptahhotep-b-obey-or-transgress",
    from: `${PREFIX}.1`,
    to: "egy.ptah.b",
    connectionClass: "close_conceptual_parallel",
    similarities:
      "Both introduce a teaching by weighing those who keep it against those who do not: 'to put them in thy heart is good, (but there is) woe to him who neglecteth them' (Amenemope 3.11–12); 'the glory of him that obeyeth, the shame of him that transgresseth them' (Ptahhotep, heading B, in Gunn's English). Griffith notes the resemblance.",
    differences:
      "Ptahhotep's line is part of a formal heading listing the vizier's titles; Amenemope's is in the father's charge to his son, and goes on to images of the casket of the belly and the mooring-post of the tongue.",
    wordingComparable: "partly",
    meaningComparable: "yes",
    transmissionEvidence:
      "Ptahhotep was copied and studied in schools for many centuries before Amenemope was written, so the author could have known it; but the sentiment is common to Egyptian teachings and no direct borrowing is shown.",
    earlierNote: "Ptahhotep's copy (the Papyrus Prisse) is Middle Kingdom; Amenemope is New Kingdom or later.",
    sourceKey: "griffith-amenemope",
    reviewStatus: "proposed",
  },
];

export const AMENEMOPE_CORPUS: TextCorpusFile = {
  workKey: "egy.amenemope",
  revision: "griffith-2026-10",
  sources: SOURCES,
  manuscripts: MANUSCRIPTS,
  images: IMAGES.filter((image) => image.passageKey == null).map((image) => {
    const copy: Placed = { ...image };
    delete copy.passageKey;
    return copy;
  }),
  passages: buildPassages(),
  links: LINKS,
};
