// THE INSTRUCTION OF PTAHHOTEP, in Gunn's English (1906), section by section.
//
// The text comes from gunn-text.ts (the Project Gutenberg text of Gunn's 1906
// printing, compared with the OCR of the 1908 and 1912 printings). What a
// reader needs beyond it — headings, summaries, the copy it survives in,
// dates, pictures, themes and connections — is written here.
//
// Hierarchy: prologue → Gunn's A, B (and his title line); the 37 maxims, one
// passage each (egy.ptah.1 … egy.ptah.37, the units counted); epilogue →
// Gunn's C, 38–43, D and the closing formula. The letters and numbers are
// Gunn's own, "for purposes of reference … not, of course, in the original",
// which marks its divisions with red ink. That his 37 sections are the 37
// maxims of Žába's edition, which later translations follow, has not been
// checked against Žába, so nothing here is marked verified.
//
// Gunn's footnotes are kept in each passage's notes. Modern translations
// (Lichtheim, Parkinson, Simpson, Allen) are in copyright and are cited, never
// quoted.

import type { CorpusImage, CorpusLayer, CorpusLink, CorpusManuscript, CorpusPassage, CorpusPassageDate, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { PTAHHOTEP_SECTIONS, type GunnSection } from "./gunn-text";

const PREFIX = "egy.ptah";

const SOURCES = INVENTORY_SOURCES.filter((s) =>
  ["gunn-ptahhotep", "lichtheim-ael", "zaba-ptahhotep-1956", "parkinson-sinuhe-1997", "simpson-lae-2003", "allen-mel-2015", "jequier-prisse-1911"].includes(s.key)
);

const GUNN_EVIDENCE =
  "B. G. Gunn, The Instruction of Ptah-hotep (John Murray, 1906), from the Project Gutenberg text of the 1906 printing (#30508), compared word by word with the archive.org OCR of the 1908 and 1912 printings; every difference was an OCR misreading. No page images could be reached. Public domain (Gunn died in 1950). Gunn's footnote markers are taken out of the text and his notes kept in the passage notes; square brackets and (?) are his; his double hyphens are printed as dashes.";

const pages = (first: number, last: number) => (first === last ? `p. ${first}` : `pp. ${first}–${last}`);

function englishLayer(text: string): CorpusLayer {
  return {
    key: "eng-gunn",
    layer: "translation",
    sourceKey: "gunn-ptahhotep",
    content: text,
    language: "English",
    licence: "public_domain",
    evidence: GUNN_EVIDENCE,
  };
}

/** The modern translations, in copyright: where to read them, nothing more. */
function modernLayers(where: string): CorpusLayer[] {
  const cite = (key: string, sourceKey: string, book: string): CorpusLayer => ({
    key,
    layer: "translation",
    sourceKey,
    contentAbsentReason: `In copyright, cited only: ${book}, ${where}.`,
    language: "English",
    licence: "copyrighted_reference",
    evidence: "A modern translation from the hieratic, on Žába's numbering of the maxims. Named so a reader can find the passage; no text is reproduced.",
  });
  return [
    cite("eng-lichtheim", "lichtheim-ael", "M. Lichtheim, Ancient Egyptian Literature I (1973), 'The Instruction of Ptahhotep'"),
    cite("eng-parkinson", "parkinson-sinuhe-1997", "R. B. Parkinson, The Tale of Sinuhe and Other Ancient Egyptian Poems (1997), 'The Teaching of Ptahhotep'"),
    cite("eng-simpson", "simpson-lae-2003", "W. K. Simpson (ed.), The Literature of Ancient Egypt (3rd ed., 2003), 'The Maxims of Ptahhotep'"),
    cite("eng-allen", "allen-mel-2015", "J. P. Allen, Middle Egyptian Literature (2015), 'The Instruction of Ptahhotep'"),
  ];
}

/** Gunn's footnotes, with the words each one follows. */
function gunnNotes(row: GunnSection): string | undefined {
  if (row.notes.length === 0) return undefined;
  return row.notes.map(([n, after, note]) => `Gunn's note ${n}${after ? ` (after "${after}")` : ""}: ${note}`).join(" ");
}

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "papyrus-prisse",
    name: "Papyrus Prisse (Paris, Bibliothèque nationale de France, Égyptien 183–194)",
    objectKind: "papyrus",
    holdingInstitution: "Bibliothèque nationale de France, Département des Manuscrits",
    accessionNumber: "Égyptien 183–194",
    findspot: "Said to come from the cemetery of Thebes; the exact place is unknown",
    startYear: -1899,
    endYear: -1749,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "'not earlier than the Eleventh Dynasty, and is probably of the Twelfth' (Gunn 1906); 'Middle Kingdom manuscript, 12th dynasty, c. 1800 BC' (BnF exhibition label, as given on Commons)",
    datingEvidence:
      "Dated by its hieratic hand. Gunn gives the judgement of 'the best judges' of his day; the Commons records of the BnF sheets give the Twelfth Dynasty, c. 1800 BC. Not checked against the BnF catalogue.",
    catalogueUrl: "https://archivesetmanuscrits.bnf.fr/ark:/12148/cc12921q/ca103",
    sourceKey: "gunn-ptahhotep",
    notes:
      "Bought by É. Prisse d'Avennes from a workman digging at Thebes, published by him in 1847 and given to the Bibliothèque royale (now nationale) about then. About 23 ft 7 in (7.2 m) long, with eighteen pages of black and red hieratic: the end of the Instruction for Kagemni, a blank stretch of some 53 in from which a text may have been erased, and the whole of Ptahhotep — the only complete copy. Now cut into sheets and glazed (Gunn 1906, pp. 22–25). Later copies of Ptahhotep (British Museum papyri and the Carnarvon tablet) are not imported here.",
  },
];

type Placed = CorpusImage & { passageKey?: string; manuscriptKey?: string };

const PD_FRANCE =
  "Public domain in France (PD-France), as Commons states it; moral rights apply, so attribution to the Bibliothèque nationale de France is required";

const IMAGES: Placed[] = [
  {
    key: "prisse-egyptien-186-ptahhotep-lines-1-73",
    passageKey: `${PREFIX}.prologue`,
    url: "https://upload.wikimedia.org/wikipedia/commons/2/27/Papyrus_Prisse._Egyptien_186._Enseignement_de_Ptahhotep_%281-73%29_-_btv1b8304609v.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Papyrus_Prisse._Egyptien_186._Enseignement_de_Ptahhotep_(1-73)_-_btv1b8304609v.jpg",
    institution: "Bibliothèque nationale de France",
    accessionNumber: "Égyptien 186",
    objectDate: "Middle Kingdom, probably Twelfth Dynasty",
    caption:
      "The opening of the Instruction of Ptahhotep in the Papyrus Prisse: the BnF's framed sheet Égyptien 186, lines 1–73, which the library describes as the introductory section, beginning with the title 'Teaching of the mayor of the city and vizier Ptahhotep'. Black hieratic with headings in red.",
    creator: "Unknown scribe",
    credit: "Bibliothèque nationale de France, Département des Manuscrits, via Wikimedia Commons",
    licence: PD_FRANCE,
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "prisse-egyptien-187-ptahhotep-lines-75-123",
    manuscriptKey: "papyrus-prisse",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/51/Papyrus_Prisse_187.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Papyrus_Prisse_187.jpg",
    institution: "Bibliothèque nationale de France",
    accessionNumber: "Égyptien 187",
    objectDate: "Middle Kingdom, Twelfth Dynasty, c. 1800 BC (BnF exhibition label)",
    imageDate: "7 June 2022",
    caption:
      "A page of the Papyrus Prisse with lines 75–123 of Ptahhotep, among the early maxims, photographed in the BnF's 2022 exhibition 'L'aventure Champollion'. The red lines mark the beginnings of maxims.",
    creator: "Photograph: Zunkir",
    credit: "Zunkir, via Wikimedia Commons",
    licence: "Creative Commons Attribution-Share Alike 4.0 International (CC BY-SA 4.0)",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "prisse-egyptien-188-ptahhotep-lines-124-216",
    passageKey: `${PREFIX}.8`,
    url: "https://upload.wikimedia.org/wikipedia/commons/0/07/Papyrus_Prisse._Egyptien_188._Enseignement_de_Ptahhotep%28124-216%29_-_btv1b525152273.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Papyrus_Prisse._Egyptien_188._Enseignement_de_Ptahhotep(124-216)_-_btv1b525152273.jpg",
    institution: "Bibliothèque nationale de France",
    accessionNumber: "Égyptien 188",
    objectDate: "Middle Kingdom, probably Twelfth Dynasty",
    caption:
      "UNVERIFIED — The BnF's scan of the Papyrus Prisse sheet Égyptien 188, lines 124–216 of Ptahhotep, which the library describes as the end of the seventh maxim, maxims 8 to 11 and the beginning of the twelfth. The sheet is securely identified; that the library's maxim numbers are Gunn's is not checked.",
    creator: "Unknown scribe",
    credit: "Bibliothèque nationale de France, Département des Manuscrits, via Wikimedia Commons",
    licence: PD_FRANCE,
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    whatIsUnverified:
      "Whether the BnF's maxims 7–12 (on Žába's numbering, presumably) are the same as Gunn's sections 7–12, against which the picture is placed here. The sheet and its lines are as the BnF describes them.",
    verificationStatus: "unverified",
  },
  {
    key: "prisse-egyptien-194-ptahhotep-end",
    passageKey: `${PREFIX}.colophon`,
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Papyrus_Prisse_194_2.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Papyrus_Prisse_194_2.jpg",
    institution: "Bibliothèque nationale de France",
    accessionNumber: "Égyptien 194",
    objectDate: "Middle Kingdom, Twelfth Dynasty, c. 1800 BC (BnF exhibition label)",
    imageDate: "7 June 2022",
    caption:
      "The last column of the Papyrus Prisse (Égyptien 194, lines 596 to the end of Ptahhotep), photographed in the BnF's 2022 exhibition. Below the black hieratic, a final line in red closes the copy; the rest of the sheet is blank.",
    creator: "Photograph: Zunkir",
    credit: "Zunkir, via Wikimedia Commons",
    licence: "Creative Commons Attribution-Share Alike 4.0 International (CC BY-SA 4.0)",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "saqqara-mastaba-ptahhotep-akhethetep",
    passageKey: `${PREFIX}.title`,
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Ptahhotep_and_Akhethetep_mastaba_tombs.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ptahhotep_and_Akhethetep_mastaba_tombs.jpg",
    objectDate: "Fifth Dynasty",
    imageDate: "2017",
    caption:
      "UNVERIFIED — The front of the mastaba tombs of the vizier Ptahhotep and his son Akhethetep at Saqqara, of the reign of Djedkare Isesi. Related context only: whether this vizier is the Ptahhotep the Instruction names as its author is not established, and the Instruction itself was written centuries later.",
    creator: "Aidan McRae Thomson",
    credit: "Aidan McRae Thomson, via Wikimedia Commons (from Flickr)",
    licence: "Creative Commons Attribution-Share Alike 2.0 Generic (CC BY-SA 2.0)",
    licenceStatus: "share_alike",
    shows: "site",
    identificationStatus: "unverified",
    whatIsUnverified:
      "That the Ptahhotep buried here is the vizier named in the Instruction's title. The tomb is a real Fifth Dynasty vizier's; the Instruction's attribution to a vizier of Isesi is part of its literary frame.",
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

/** A label for each maxim, written for this archive. */
const MAXIM_LABELS: Record<number, string> = {
  1: "Do not be proud of learning",
  2: "An arguer wiser than you",
  3: "An arguer who is your equal",
  4: "An arguer beneath you",
  5: "The leader, and Truth that endures",
  6: "Do not cause fear",
  7: "A guest at a great man's table",
  8: "The messenger",
  9: "Harvest, greed, and the childless",
  10: "Serve the wise; honour the risen",
  11: "Follow your heart",
  12: "A son who follows, a son who strays",
  13: "In the council chamber",
  14: "Win love; the slave of the belly",
  15: "Reporting to one's lord",
  16: "The leader's rules",
  17: "Hearing a petitioner",
  18: "Women in a house you visit",
  19: "Covetousness",
  20: "Do not covet shares",
  21: "Wife and household",
  22: "Paying servants",
  23: "Hot words; an order to steal",
  24: "Silence in council",
  25: "Power with gentleness",
  26: "Do not hinder a busy great man",
  27: "Teaching a noble",
  28: "The priest's son as envoy",
  29: "Past forgiveness",
  30: "Risen to wealth",
  31: "Bow to your superior",
  32: "Not translated by Gunn",
  33: "Testing a friend",
  34: "A bright face; shared bread",
  35: "Good repute",
  36: "Correct and instruct",
  37: "A woman put to shame",
};

const THEMES: Record<string, [string, string][]> = {
  "5": [["cosmic-law", "'Great is Truth, appointing a straight path; never hath it been overthrown since the reign of Osiris' — Maat, the order that punishes whoever oversteps it."]],
  "19": [["cosmic-law", "'Truth goeth in his footsteps': the just man lives in Maat, the covetous outside it."]],
  d: [["cosmic-law", "Ptahhotep's long life is the reward for having 'wrought truth and justice for the King'."]],
  "41": [["divine-knowledge", "The teaching is to be handed down unchanged: 'Take not any word away, neither add one.'"]],
};

const PROLOGUE_DATES: CorpusPassageDate[] = [
  {
    key: "claimed",
    role: "claimed",
    startYear: -2413,
    endYear: -2374,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "'in the Reign of the King of Upper and Lower Egypt, Isosi' (the title, in Gunn's English)",
    evidence:
      "The text sets itself under Djedkare Isesi of the Fifth Dynasty (c. 2400 BCE on modern chronologies). A literary frame, not evidence of when it was written. Gunn, following Petrie's chronology, put Isesi at about 3580–3536 BC and took 'about 3550' as Ptahhotep's date; that chronology is abandoned.",
    sourceKey: "gunn-ptahhotep",
  },
  {
    key: "composition",
    role: "composition",
    startYear: -1999,
    endYear: -1799,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "Middle Kingdom, c. 2000–1800 BCE (disputed)",
    evidence:
      "Its language is Middle Egyptian, and most scholars now date the composition to the Middle Kingdom despite the Old Kingdom frame; some still argue for a late Old Kingdom origin. As in Lichtheim's introduction; not checked further here.",
    sourceKey: "lichtheim-ael",
  },
  {
    key: "manuscript",
    role: "manuscript",
    startYear: -1899,
    endYear: -1749,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "'not earlier than the Eleventh Dynasty, and is probably of the Twelfth' (Gunn 1906, p. 25)",
    evidence: "The Papyrus Prisse, dated by its hand; the BnF's 2022 exhibition labels, as given on Commons, say Twelfth Dynasty, c. 1800 BC.",
    sourceKey: "gunn-ptahhotep",
  },
  {
    key: "translation",
    role: "translation_publication",
    startYear: 1906,
    endYear: 1906,
    datePrecision: "year",
    isApproximate: false,
    originalDateText: "1906",
    evidence: "Gunn's translation, published by John Murray in the Wisdom of the East series.",
    sourceKey: "gunn-ptahhotep",
  },
];

function rowFor(key: string): GunnSection {
  const row = PTAHHOTEP_SECTIONS.find((r) => r.key === key);
  if (!row) throw new Error(`Gunn has no section ${key}`);
  return row;
}

function sectionPassage(key: string, parentKey: string, label: string, reference: string, summary?: string, extraNotes?: string): CorpusPassage {
  const row = rowFor(key);
  const notes = [extraNotes, gunnNotes(row)].filter(Boolean).join(" ");
  const passageKey = `${PREFIX}.${key}`;
  return {
    key: passageKey,
    parentKey,
    divisionKind: "section",
    label,
    reference: `${reference} (Gunn 1906, ${pages(row.firstPage, row.lastPage)})`,
    sourceKey: "gunn-ptahhotep",
    summary,
    notes: notes || undefined,
    verificationStatus: "unverified",
    layers: [englishLayer(row.text)],
    witnesses: [{ manuscriptKey: "papyrus-prisse" }],
    themes: THEMES[key]?.map(([themeKey, note]) => ({ themeKey, note })),
    images: imagesFor(passageKey),
  };
}

function buildPassages(): CorpusPassage[] {
  const passages: CorpusPassage[] = [];
  const prologue = `${PREFIX}.prologue`;
  passages.push({
    key: prologue,
    divisionKind: "section",
    label: "Prologue",
    reference: "Prologue (Gunn's title, A and B; Gunn 1906, pp. 41–42)",
    sourceKey: "gunn-ptahhotep",
    summary:
      "The aged vizier Ptahhotep describes the miseries of old age and asks the king to let him train his son as his successor; the king agrees, and the teaching is introduced as 'the proverbs of fair speech'.",
    verificationStatus: "unverified",
    layers: modernLayers("the prologue"),
    witnesses: [{ manuscriptKey: "papyrus-prisse", locus: "the beginning of Ptahhotep (BnF Égyptien 186)" }],
    dates: PROLOGUE_DATES,
    images: imagesFor(prologue),
  });
  passages.push(sectionPassage("title", prologue, "Title", "Title line", "The title names the author as the city governor and vizier Ptahhotep, under King Isesi."));
  passages.push(
    sectionPassage(
      "a",
      prologue,
      "Prologue A: the vizier's petition",
      "Gunn's section A",
      "Ptahhotep lists the ills of old age and asks the king's leave to hand on his office and his wisdom to his son; the king tells him to teach him the words of old time."
    )
  );
  passages.push(
    sectionPassage(
      "b",
      prologue,
      "Prologue B: the heading of the maxims",
      "Gunn's section B",
      "The formal heading: the proverbs of fair speech spoken by Ptahhotep, with his titles, to instruct the ignorant — good for whoever obeys them, shameful for whoever transgresses."
    )
  );

  for (let n = 1; n <= 37; n++) {
    const row = rowFor(String(n));
    const key = `${PREFIX}.${n}`;
    const notes = [
      n === 32
        ? "Gunn does not translate this maxim and prints only a heading in square brackets. Modern translations render it: it forbids a kind of sexual conduct, and its exact sense is debated."
        : undefined,
      row.text.includes("\n\n") ? "Gunn prints this section in more than one paragraph." : undefined,
      gunnNotes(row),
    ].filter(Boolean);
    passages.push({
      key,
      divisionKind: "maxim",
      label: `Maxim ${n}: ${MAXIM_LABELS[n]}`,
      reference: `Maxim ${n} (Gunn's section ${n}; Gunn 1906, ${pages(row.firstPage, row.lastPage)})`,
      sourceKey: "gunn-ptahhotep",
      notes: notes.length ? notes.join(" ") : undefined,
      verificationStatus: "unverified",
      layers: [englishLayer(row.text), ...modernLayers(`maxim ${n}`)],
      witnesses: [{ manuscriptKey: "papyrus-prisse" }],
      themes: THEMES[String(n)]?.map(([themeKey, note]) => ({ themeKey, note })),
      images: imagesFor(key),
    });
  }

  const epilogue = `${PREFIX}.epilogue`;
  passages.push({
    key: epilogue,
    divisionKind: "section",
    label: "Epilogue",
    reference: "Epilogue (Gunn's C, 38–43 and D; Gunn 1906, pp. 56–61)",
    sourceKey: "gunn-ptahhotep",
    summary:
      "Ptahhotep praises the son who hears and obeys — a long play on the Egyptian word for 'hear' and 'obey' — warns against the fool, asks that his words be handed on unchanged, and ends with his reward: a hundred and ten years of life for doing right by the king.",
    notes:
      "Gunn numbers the epilogue's paragraphs 38–43 after the maxims; they are not maxims, and are stored as sections here so that they are not counted with them.",
    verificationStatus: "unverified",
    layers: modernLayers("the epilogue"),
    witnesses: [{ manuscriptKey: "papyrus-prisse" }],
  });
  passages.push(sectionPassage("c", epilogue, "Epilogue C: the worth of these sayings", "Gunn's section C", "Whoever keeps these sayings will speak well, prosper and be content; they will never pass out of the land."));
  const EPILOGUE_LABELS: Record<number, string> = {
    38: "The obedient son",
    39: "Let a son receive his father's word",
    40: "The fool",
    41: "Handing the teaching on",
    42: "A full heart, a restrained mouth",
    43: "A good son is a gift of God",
  };
  for (let n = 38; n <= 43; n++) {
    passages.push(sectionPassage(String(n), epilogue, `Epilogue ${n}: ${EPILOGUE_LABELS[n]}`, `Gunn's section ${n}`));
  }
  passages.push(sectionPassage("d", epilogue, "Epilogue D: Ptahhotep's reward", "Gunn's section D", "Ptahhotep promises his son the king's favour and long life, and says he himself has lived a hundred and ten years."));
  passages.push(
    sectionPassage(
      "colophon",
      epilogue,
      "Colophon",
      "Closing formula",
      "The scribe's closing formula: the book is finished, from beginning to end, as it was found in writing.",
      "The usual formula with which a scribe certifies a complete copy."
    )
  );
  return passages;
}

const LINKS: CorpusLink[] = [
  {
    key: "ptah-5-truth-ptah-19-truth",
    from: `${PREFIX}.5`,
    to: `${PREFIX}.19`,
    connectionClass: "close_conceptual_parallel",
    similarities: "Both maxims set Truth (Maat) against greed: the covetous man oversteps and is punished, while 'truth goeth in his footsteps' for the just.",
    differences: "Maxim 5 speaks to a leader and stresses that Truth has stood since Osiris; maxim 19 speaks of covetousness as a sickness that divides families.",
    wordingComparable: "partly",
    meaningComparable: "yes",
    transmissionEvidence: "Two maxims of the same teaching, in the same copy; listed so a reader can follow the idea through the text.",
    sourceKey: "gunn-ptahhotep",
    reviewStatus: "proposed",
  },
];

export const PTAHHOTEP_CORPUS: TextCorpusFile = {
  workKey: "egy.ptahhotep",
  revision: "gunn-2026-10",
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
