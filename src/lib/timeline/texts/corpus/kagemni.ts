// THE INSTRUCTION FOR KAGEMNI, in Gunn's English (1906): the surviving end of
// a teaching on modesty and table manners, on the first two pages of the
// Papyrus Prisse, before Ptahhotep.
//
// The text comes from gunn-text.ts. Gunn numbers five sections ("The original
// is not divided into sections"), then the closing narrative and the scribe's
// formula; all seven are stored as sections. How much of the teaching is lost
// before the first surviving line is unknown, so the inventory gives no
// expected count and nothing here is marked verified. Modern translations
// (Lichtheim, Simpson) are in copyright and are cited, never quoted.

import type { CorpusImage, CorpusLayer, CorpusManuscript, CorpusPassage, CorpusPassageDate, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { KAGEMNI_SECTIONS, type GunnSection } from "./gunn-text";

const PREFIX = "egy.kag";

const SOURCES = INVENTORY_SOURCES.filter((s) => ["gunn-ptahhotep", "lichtheim-ael", "simpson-lae-2003", "jequier-prisse-1911"].includes(s.key));

const GUNN_EVIDENCE =
  "B. G. Gunn, The Instruction of Ke'gemni, in The Instruction of Ptah-hotep (John Murray, 1906), from the Project Gutenberg text of the 1906 printing (#30508), compared word by word with the archive.org OCR of the 1908 and 1912 printings; every difference was an OCR misreading. No page images could be reached. Public domain (Gunn died in 1950). Footnote markers are taken out and the notes kept in the passage notes; square brackets and (?) are Gunn's.";

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

function modernLayers(where: string): CorpusLayer[] {
  const cite = (key: string, sourceKey: string, book: string): CorpusLayer => ({
    key,
    layer: "translation",
    sourceKey,
    contentAbsentReason: `In copyright, cited only: ${book}, ${where}.`,
    language: "English",
    licence: "copyrighted_reference",
    evidence: "A modern translation from the hieratic. Named so a reader can find the passage; no text is reproduced.",
  });
  return [
    cite("eng-lichtheim", "lichtheim-ael", "M. Lichtheim, Ancient Egyptian Literature I (1973), 'The Instruction Addressed to Kagemni'"),
    cite("eng-simpson", "simpson-lae-2003", "W. K. Simpson (ed.), The Literature of Ancient Egypt (3rd ed., 2003), 'The Instruction for Kagemni'"),
  ];
}

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "papyrus-prisse",
    name: "Papyrus Prisse (Paris, Bibliothèque nationale de France, Égyptien 183–194)",
    objectKind: "papyrus",
    holdingInstitution: "Bibliothèque nationale de France, Département des Manuscrits",
    accessionNumber: "Égyptien 183 (Kagemni)",
    findspot: "Said to come from the cemetery of Thebes; the exact place is unknown",
    startYear: -1899,
    endYear: -1749,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "'not earlier than the Eleventh Dynasty, and is probably of the Twelfth' (Gunn 1906); 'Middle Kingdom manuscript, 12th dynasty, c. 1800 BC' (BnF exhibition label, as given on Commons)",
    datingEvidence: "Dated by its hieratic hand; the same roll as Ptahhotep. Not checked against the BnF catalogue.",
    catalogueUrl: "https://archivesetmanuscrits.bnf.fr/ark:/12148/cc12921q/ca104",
    sourceKey: "gunn-ptahhotep",
    notes:
      "Kagemni fills the first two surviving pages; the beginning of the roll, with the start of this teaching, is torn away. Gunn points out that the text never says Kagemni wrote it: the unnamed vizier who calls his children is more likely Kagemni's father (Gunn 1906, pp. 23–24).",
  },
];

type Placed = CorpusImage & { passageKey?: string; manuscriptKey?: string };

const IMAGES: Placed[] = [
  {
    key: "prisse-egyptien-183-kagemni",
    manuscriptKey: "papyrus-prisse",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Papyrus_Prisse_183.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Papyrus_Prisse_183.jpg",
    institution: "Bibliothèque nationale de France",
    accessionNumber: "Égyptien 183",
    objectDate: "Middle Kingdom, Twelfth Dynasty, c. 1800 BC (BnF exhibition label)",
    imageDate: "7 June 2022",
    caption:
      "The Instruction for Kagemni in the Papyrus Prisse (BnF Égyptien 183): two pages of hieratic, the only known copy of this text, photographed in the BnF's 2022 exhibition 'L'aventure Champollion'.",
    creator: "Photograph: Zunkir",
    credit: "Zunkir, via Wikimedia Commons",
    licence: "Creative Commons Attribution-Share Alike 4.0 International (CC BY-SA 4.0)",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "jequier-1911-kagemni-facsimile",
    manuscriptKey: "papyrus-prisse",
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Instructions_of_Kagemni_facsimile_%28Prisse_papyrus%29.png",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Instructions_of_Kagemni_facsimile_(Prisse_papyrus).png",
    objectDate: "Papyrus: Middle Kingdom; facsimile: 1911",
    imageDate: "1911",
    caption:
      "UNVERIFIED — A facsimile of the first two pages of the Papyrus Prisse, said to show the complete hieratic text of Kagemni, as reproduced in Gustave Jéquier's Le Papyrus Prisse et ses variantes (1911). Which plate it is, and that it is Jéquier's, are as the Commons record gives them.",
    creator: "Ancient scribe; facsimile published by Gustave Jéquier",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-70; Creative Commons Public Domain Mark 1.0)",
    licenceStatus: "open",
    shows: "scientific_figure",
    identificationStatus: "unverified",
    whatIsUnverified:
      "That the image comes from Jéquier 1911 and which plate it is; the Commons record names the book but no plate. The two pages of hieratic shown match the layout of the Kagemni pages in the photograph of Égyptien 183, but the text has not been read against it.",
    verificationStatus: "unverified",
  },
];

const DATES: CorpusPassageDate[] = [
  {
    key: "claimed",
    role: "claimed",
    startYear: -2629,
    endYear: -2589,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "'when His Majesty … HEUNI, departed, and His Majesty … SENFORU, was enthroned' (the closing narrative, in Gunn's English)",
    evidence:
      "The narrative sets the teaching at the death of Huni and the accession of Sneferu, at the turn of the Third and Fourth Dynasties (c. 2600 BCE on modern chronologies). A literary setting. Gunn, on Petrie's chronology, put Huni's death about 3998 BC.",
    sourceKey: "gunn-ptahhotep",
  },
  {
    key: "composition",
    role: "composition",
    startYear: -1999,
    endYear: -1799,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "Middle Kingdom (disputed)",
    evidence: "Like Ptahhotep, it is written in Middle Egyptian and is generally dated to the Middle Kingdom despite its Old Kingdom setting. Not checked further here.",
    sourceKey: "lichtheim-ael",
  },
  {
    key: "manuscript",
    role: "manuscript",
    startYear: -1899,
    endYear: -1749,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "'not earlier than the Eleventh Dynasty, and is probably of the Twelfth' (Gunn 1906, of the Papyrus Prisse)",
    evidence: "The same roll as Ptahhotep, dated by its hand.",
    sourceKey: "gunn-ptahhotep",
  },
];

const LABELS: Record<string, [string, string]> = {
  "1": ["The man of silence", "The careful, quiet man is welcomed and advances; the one who forces his way meets knives."],
  "2": ["Restraint at table", "Do not crave the food you like at a gathering: greed is beastly, a little water and melon are enough, and the man ruled by his belly is base."],
  "3": ["Eating with the greedy", "With a glutton or a drunkard, take what is offered and do not make a show of refusing."],
  "4": ["The surly man", "A man without good fellowship cannot be reached by words and grieves his family and friends."],
  "5": ["Do not boast of strength", "Do not be arrogant among your young soldiers; no one knows what God will do when he punishes."],
  narrative: [
    "The vizier's children; Kagemni made vizier",
    "The vizier calls his children to read his book, which they find better than anything in the land; the king Huni dies, Sneferu succeeds, and Kagemni is made governor of the city and vizier.",
  ],
  colophon: ["Colophon", "The scribe's closing formula: 'It is finished.'"],
};

function rowFor(key: string): GunnSection {
  const row = KAGEMNI_SECTIONS.find((r) => r.key === key);
  if (!row) throw new Error(`Gunn has no Kagemni section ${key}`);
  return row;
}

function buildPassages(): CorpusPassage[] {
  return ["1", "2", "3", "4", "5", "narrative", "colophon"].map((key, i): CorpusPassage => {
    const row = rowFor(key);
    const [label, summary] = LABELS[key];
    const numbered = /^\d$/.test(key);
    const notes = [
      i === 0 ? "The surviving text begins in mid-teaching: the beginning of the roll is lost." : undefined,
      key === "narrative" ? "Gunn prints this narrative without a number, after section 5." : undefined,
      ...row.notes.map(([n, after, note]) => `Gunn's note ${n}${after ? ` (after "${after}")` : ""}: ${note}`),
    ].filter(Boolean);
    const pages = row.firstPage === row.lastPage ? `p. ${row.firstPage}` : `pp. ${row.firstPage}–${row.lastPage}`;
    return {
      key: `${PREFIX}.${key}`,
      divisionKind: "section",
      label: numbered ? `Section ${key}: ${label}` : label,
      reference: `${numbered ? `Gunn's section ${key}` : key === "narrative" ? "Closing narrative" : "Closing formula"} (Gunn 1906, ${pages})`,
      sourceKey: "gunn-ptahhotep",
      summary,
      notes: notes.length ? notes.join(" ") : undefined,
      verificationStatus: "unverified",
      layers: [englishLayer(row.text), ...(key === "colophon" ? [] : modernLayers(numbered ? "the corresponding passage" : "the closing narrative"))],
      witnesses: [{ manuscriptKey: "papyrus-prisse", locus: "pp. 1–2" }],
      dates: key === "narrative" ? DATES : undefined,
    };
  });
}

export const KAGEMNI_CORPUS: TextCorpusFile = {
  workKey: "egy.kagemni",
  revision: "gunn-2026-10",
  sources: SOURCES,
  manuscripts: MANUSCRIPTS,
  images: IMAGES.map((image) => {
    const copy: Placed = { ...image };
    delete copy.passageKey;
    return copy;
  }),
  passages: buildPassages(),
};
