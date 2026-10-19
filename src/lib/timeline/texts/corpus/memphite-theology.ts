// THE MEMPHITE THEOLOGY on the Shabaka Stone (British Museum EA 498), in
// Breasted's English: the 1901 first edition, line group by line group, and
// his 1912 re-translation of the main passages beside it.
//
// The text comes from memphite-theology-text.ts. The passages are the groups
// of lines Breasted discusses, keyed by his line numbers (egy.memphite.55-57
// is his lines 55–57); 18–24, 25–47 and 61–64, which he does not translate,
// carry his description of them instead, as an interpretation layer. The
// stone's lines are not all imported one by one, and much of the middle is
// lost to its later use as a millstone, so the inventory gives no expected
// count and nothing here is marked verified. Lichtheim's translation is in
// copyright and is cited, never quoted.
//
// The date of the composition is the most disputed thing about it: Breasted
// (1901) put the original in or before the New Kingdom, Erman and Breasted
// (1911–12) in the Pyramid Age, and since Junge (1973) most scholars place it
// in the Ramesside period or under Shabaka himself, written to look ancient.

import type { CorpusImage, CorpusLayer, CorpusLink, CorpusManuscript, CorpusPassage, CorpusPassageDate, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { BREASTED_1901, BREASTED_1912 } from "./memphite-theology-text";

const PREFIX = "egy.memphite";

const SOURCES = INVENTORY_SOURCES.filter((s) => ["breasted-memphite-1901", "breasted-1912", "bm-shabaka", "lichtheim-ael", "junge-memphite-1973"].includes(s.key));

const EVIDENCE_1901 =
  "J. H. Breasted, 'The Philosophy of a Memphite Priest', ZÄS 39 (1901), from the archive.org OCR of the volume, checked against a second OCR of another copy; no page images could be reached. Public domain. Breasted translates inside his discussion: his renderings for these lines are gathered in his order, with his line references in parentheses and a few of his linking words; '[Shabaka]' replaces his transliteration of the king's name.";
const EVIDENCE_1901_DESCRIPTION =
  "J. H. Breasted, 'The Philosophy of a Memphite Priest', ZÄS 39 (1901), from the archive.org OCR, checked against a second OCR. Public domain. Breasted gives no translation of these lines; this is his description of their contents, kept so the passage is not empty, and marked as his.";
const EVIDENCE_1912 =
  "J. H. Breasted, Development of Religion and Thought in Ancient Egypt (1912), from the archive.org OCR, checked against a second OCR of another copy. Public domain. Breasted re-translates from Erman's 1911 edition of the stone, with Erman's new readings, and gives no line numbers: the extract is placed here by matching its wording to the 1901 line references.";

function layer1901(lines: string, description: boolean): CorpusLayer {
  const extract = BREASTED_1901[lines];
  return {
    key: "eng-breasted-1901",
    layer: description ? "interpretation" : "translation",
    sourceKey: "breasted-memphite-1901",
    content: extract.text,
    language: "English",
    licence: "public_domain",
    evidence: `${description ? EVIDENCE_1901_DESCRIPTION : EVIDENCE_1901} (${extract.pages})`,
  };
}

function layer1912(lines: string, description: boolean): CorpusLayer[] {
  const extract = BREASTED_1912[lines];
  if (!extract) return [];
  return [
    {
      key: "eng-breasted-1912",
      layer: description ? "interpretation" : "translation",
      sourceKey: "breasted-1912",
      content: extract.text,
      language: "English",
      licence: "public_domain",
      evidence: `${EVIDENCE_1912}${description ? " Here Breasted summarises the lines in his own words, quoting phrases of them." : ""} (${extract.pages})`,
    },
  ];
}

const lichtheim: CorpusLayer = {
  key: "eng-lichtheim",
  layer: "translation",
  sourceKey: "lichtheim-ael",
  contentAbsentReason: "In copyright, cited only: M. Lichtheim, Ancient Egyptian Literature I (1973), 'The Memphite Theology'.",
  language: "English",
  licence: "copyrighted_reference",
  evidence: "A modern translation of the whole legible text. Named so a reader can find the passage; no text is reproduced.",
};

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "bm-ea-498",
    name: "The Shabaka Stone (British Museum EA 498)",
    objectKind: "stela",
    holdingInstitution: "British Museum",
    accessionNumber: "EA 498",
    findspot: "Unknown",
    startYear: -704,
    endYear: -689,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "Reign of Shabaka, Twenty-fifth Dynasty",
    datingEvidence: "The inscription names Shabaka as the king who had it copied (his name later chiselled out). His reign is usually dated c. 705–690 BCE; some chronologies place it a decade or so earlier.",
    catalogueUrl: "https://www.britishmuseum.org/collection/object/Y_EA498",
    sourceKey: "bm-shabaka",
    notes:
      "A slab of dark stone, 0.92 × 1.375 m by Breasted's measurement, with two horizontal lines and 61 vertical lines of hieroglyphs (Breasted numbers them to 64, splitting some). Later used as a nether millstone: the square hole and the radiating grooves wiped out much of the middle. Shabaka's name and the name of Set were erased in antiquity. Breasted 1912 cites it as 'British Museum, Stela No. 797'; the current number is EA 498. Breasted calls it granite; other descriptions call it basalt or breccia.",
  },
];

type Placed = CorpusImage & { passageKey?: string; manuscriptKey?: string };

const IMAGES: Placed[] = [
  {
    key: "bm-ea-498-shabaka-stone-2023",
    manuscriptKey: "bm-ea-498",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/19/Shabaka_Stone_at_the_British_Museum.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Shabaka_Stone_at_the_British_Museum.jpg",
    institution: "British Museum",
    accessionNumber: "EA 498",
    objectDate: "Twenty-fifth Dynasty, reign of Shabaka",
    imageDate: "30 June 2023",
    caption:
      "The Shabaka Stone on display in the British Museum: the columns of hieroglyphs survive at the sides and along the top, while the middle was ground away when the slab was reused as a millstone, leaving the square socket and the radiating grooves.",
    creator: "Photograph: Sanjay Acharya (Sanjay ach)",
    credit: "Sanjay ach, via Wikimedia Commons",
    licence: "Creative Commons Attribution-Share Alike 4.0 International (CC BY-SA 4.0)",
    licenceStatus: "share_alike",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "breasted-1901-shabaka-stone-copy",
    manuscriptKey: "bm-ea-498",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Schabaka-stein.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Schabaka-stein.jpg",
    institution: "British Museum (the stone)",
    accessionNumber: "EA 498",
    objectDate: "Stone: Twenty-fifth Dynasty; copy: 1901",
    imageDate: "1901",
    caption:
      "Breasted's epigraphic copy of the Shabaka Stone, published with his first edition in 1901 (as the Commons record gives it): the two horizontal lines across the top, the numbered vertical columns, and the millstone grooves drawn as shaded rays over the lost middle.",
    creator: "James Henry Breasted",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-old-70; Creative Commons Public Domain Mark 1.0)",
    licenceStatus: "open",
    shows: "scientific_figure",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "met-2007-24-ptah-cult-image",
    passageKey: `${PREFIX}.55-57`,
    url: "https://upload.wikimedia.org/wikipedia/commons/3/35/Cult_Image_of_the_God_Ptah_MET_DP142956.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Cult_Image_of_the_God_Ptah_MET_DP142956.jpg",
    institution: "Metropolitan Museum of Art, New York",
    accessionNumber: "2007.24",
    objectDate: "c. 945–600 BC, Third Intermediate Period to early Twenty-sixth Dynasty",
    caption:
      "Related evidence: a small lapis lazuli cult image of Ptah in the Metropolitan Museum, of roughly the Shabaka Stone's period — the god shown as usual, close-capped and mummiform, holding a sceptre. It shows how Ptah was pictured; it has no connection with the stone.",
    credit: "Metropolitan Museum of Art, via Wikimedia Commons",
    licence: "Creative Commons CC0 1.0 Universal Public Domain Dedication",
    licenceStatus: "open",
    shows: "artefact",
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

const DATES: CorpusPassageDate[] = [
  {
    key: "claimed",
    role: "claimed",
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "'a work of the ancestors, being eaten of worms' (lines 1–2, in Breasted's English)",
    evidence: "Shabaka's preface claims the text is a copy of an ancient, worm-eaten book. It gives no date, and the claim itself may be part of the archaising.",
    sourceKey: "breasted-memphite-1901",
  },
  {
    key: "composition-breasted-1901",
    role: "composition",
    startYear: -1549,
    endYear: -1299,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "'at least as early as the Eighteenth Dynasty', with 'some points in orthography' indicating 'a much earlier date' (Breasted 1901, as he summarises it in 1912)",
    evidence: "Breasted's first view, from the spelling of the text. He gave it up in 1912.",
    sourceKey: "breasted-1912",
  },
  {
    key: "composition-old-kingdom",
    role: "composition",
    startYear: -2699,
    endYear: -2199,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "'in the Pyramid Age' (Erman 1911, followed by Breasted 1912)",
    evidence: "Erman dated the original by its Old Kingdom spelling and layout; Breasted wrote in 1912 that he 'wholly' agreed. The usual view until the 1970s. Now generally rejected.",
    sourceKey: "breasted-1912",
  },
  {
    key: "composition-current",
    role: "composition",
    startYear: -1299,
    endYear: -689,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "Ramesside period to the Twenty-fifth Dynasty, in deliberately archaic style (disputed)",
    evidence: "Since Junge (1973), most scholars read the archaisms as imitation and date the composition to the Ramesside period or to Shabaka's own reign. Cited from the inventory's sources; Junge's article is not reproduced.",
    sourceKey: "junge-memphite-1973",
  },
  {
    key: "manuscript",
    role: "manuscript",
    startYear: -704,
    endYear: -689,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "Reign of Shabaka, Twenty-fifth Dynasty",
    evidence: "The stone names Shabaka; his reign is usually dated c. 705–690 BCE.",
    sourceKey: "bm-shabaka",
  },
  {
    key: "translation",
    role: "translation_publication",
    startYear: 1901,
    endYear: 1901,
    datePrecision: "year",
    isApproximate: false,
    originalDateText: "1901",
    evidence: "Breasted's first edition and translation, in ZÄS 39.",
    sourceKey: "breasted-memphite-1901",
  },
];

type Group = {
  lines: string;
  label: string;
  summary: string;
  description?: boolean;
  /** Breasted 1912's extract is his paraphrase, not a translation. */
  paraphrase1912?: boolean;
  notes?: string;
  themes?: [string, string][];
};

const GROUPS: Group[] = [
  {
    lines: "1-2",
    label: "Lines 1–2: Shabaka's preface",
    summary: "The two horizontal lines: the king had this text copied anew in the temple of Ptah because he had found the ancestors' book eaten by worms and illegible.",
    notes: "Shabaka's name was later chiselled out; Breasted restores it.",
  },
  {
    lines: "3-6",
    label: "Lines 3–6: Ptah proclaimed",
    summary: "Ptah 'proclaimed under this great name'; Atum, to whom the gods offered after he judged Horus and Set.",
    notes: "Most of these lines are lost. Breasted quotes only these phrases.",
  },
  {
    lines: "7-18",
    label: "Lines 7–18: Geb judges Horus and Set",
    summary:
      "Geb (Keb) settles the quarrel of Horus and Set, gives Upper Egypt to Set and Lower Egypt to Horus, then gives his whole inheritance to Horus, who appears as king of Upper and Lower Egypt at the place where the Two Lands are united.",
    notes:
      "Breasted 1901 reads the speeches in the half-lines 10a–12a as a dialogue; Breasted 1912, using Erman's edition, renders them in full and adds the 'ancient commentator's' explanation. Set's name is erased on the stone in places.",
    themes: [["cosmic-law", "Geb's judgement between Horus and Set and the uniting of the Two Lands under Horus."]],
  },
  {
    lines: "18-24",
    label: "Lines 18–24: the drowning of Osiris (lost)",
    summary: "A new section told the drowning of Osiris and what Horus, Isis and Nephthys did; Breasted does not translate it.",
    description: true,
    themes: [["death-and-rebirth", "The drowning of Osiris, taken up again at the end of the text."]],
  },
  {
    lines: "25-47",
    label: "Lines 25–47: the conflict resumed (mostly lost)",
    summary: "The conflict of Horus and Set again; almost everything to line 47 is lost to the millstone.",
    description: true,
  },
  {
    lines: "48-52",
    label: "Lines 48–52: the forms of Ptah",
    summary: "A list of eight forms of Ptah, among them 'Ptah the Great', who is 'the heart and the tongue of the gods'.",
    paraphrase1912: true,
    notes: "Breasted calls his reading of the title of the list (l. 48) doubtful and offers two renderings.",
    themes: [["creation", "Ptah as the heart and tongue of the Ennead, through which the gods came to be."]],
  },
  {
    lines: "53-54",
    label: "Lines 53–54: heart and tongue",
    summary:
      "Heart and tongue, thought and command, are the power through which Ptah works in every god, person and animal; Horus and Thoth came into being through him.",
    paraphrase1912: true,
    notes: "Breasted offers a second rendering of line 53 in parentheses.",
    themes: [
      ["consciousness", "The heart (thought) and tongue (command) as the power in every living being."],
      ["thoth-and-hermes", "'Thoth came into existence through him': Thoth, like Horus, comes from Ptah's heart and tongue."],
    ],
  },
  {
    lines: "55-57",
    label: "Lines 55–57: creation by thought and word",
    summary:
      "The senses report to the heart; the heart conceives and the tongue commands what it thinks. So were made all the gods, Atum and his Ennead, every divine word, the kas, food and offerings, and the law that gives life to the peaceful and death to the guilty.",
    notes: "Breasted 1901 gives two slightly different renderings of the same sentence (ll. 55–56 and 56–57); both are kept, as he prints them.",
    themes: [
      ["creation", "Creation by the thought of the heart and the command of the tongue."],
      ["magic-and-sacred-words", "'Every divine word came into existence by the thought of the heart and the commandment of the tongue.'"],
      ["cosmic-law", "'It was he who gave life to the peaceful and death to the guilty.'"],
    ],
  },
  {
    lines: "57-61",
    label: "Lines 57–61: Ptah makes all things and rests",
    summary:
      "Every action of the body follows the heart's thought spoken by the tongue. Ptah made the gods, cities and nomes, set the gods in their shrines and in bodies of wood, stone and metal, and was satisfied; the gods are called to take possession of the 'divine store-house of Ptah-Tatenen'.",
    themes: [
      ["creation", "Ptah fashions the gods, makes the cities and is satisfied 'after he had made all things and every divine word'."],
      ["thoth-and-hermes", "Breasted's two renderings differ: in 1901 'He is Thoth, the wise … he united with Ptah'; in 1912 'Thoth perceived that his strength was greater than all gods'."],
    ],
    notes: "Breasted's 1901 and 1912 renderings of line 59 differ markedly, the second following Erman's new readings.",
  },
  {
    lines: "61-64",
    label: "Lines 61–64: Osiris rescued and received",
    summary: "The text returns to Osiris: his drowning, his rescue by Isis and Nephthys, his preparation for burial, his ascent and his reception among the gods; it ends with Horus before his father Osiris.",
    description: true,
    themes: [["death-and-rebirth", "Osiris drowned, rescued, buried and received among the gods."]],
  },
];

function buildPassages(): CorpusPassage[] {
  return GROUPS.map((group, i): CorpusPassage => {
    const key = `${PREFIX}.${group.lines}`;
    const [first, last] = group.lines.split("-");
    return {
      key,
      divisionKind: "line",
      label: group.label,
      reference: `Shabaka Stone, lines ${first}–${last} (Breasted's line numbers; ZÄS 39, 1901, ${BREASTED_1901[group.lines].pages})`,
      sourceKey: "breasted-memphite-1901",
      summary: group.summary,
      notes: group.notes,
      verificationStatus: "unverified",
      layers: [layer1901(group.lines, group.description === true), ...layer1912(group.lines, group.paraphrase1912 === true), lichtheim],
      witnesses: [{ manuscriptKey: "bm-ea-498", locus: `lines ${first}–${last}` }],
      dates: i === 0 ? DATES : undefined,
      themes: group.themes?.map(([themeKey, note]) => ({ themeKey, note })),
      images: imagesFor(key),
    };
  });
}

const LINKS: CorpusLink[] = [
  {
    key: "memphite-55-57-word-poimandres-1-6",
    from: `${PREFIX}.55-57`,
    to: "herm.ch.1.6",
    connectionClass: "close_conceptual_parallel",
    similarities:
      "Both make a divine mind and its word the source of what exists, and tie them to perception: the Memphite text has the senses report to the heart, whose thought the tongue speaks as creative command; the Poimandres makes Mind the Father-God and the Word (Logos) his Son, and says 'what sees in thee and hears is the Lord's Word'.",
    differences:
      "The Memphite text is about Ptah, the heart and tongue as organs, and the making of the gods, food and offerings of the Egyptian cult; the Poimandres is a Greek revelation about Light, Mind and Logos, framed in Greek philosophical terms, with no Ptah and no temple cult.",
    wordingComparable: "no",
    meaningComparable: "partly",
    transmissionEvidence:
      "None shown. The Shabaka Stone is many centuries earlier than the Poimandres, and nothing shows that the Hermetic writers knew it or its tradition; the idea of creation by a god's word is widespread. Proposed only as a conceptual parallel, never as transmission.",
    earlierNote: "The stone is of c. 700 BCE; the Poimandres is usually dated to the first to third centuries CE.",
    reviewStatus: "proposed",
  },
];

export const MEMPHITE_THEOLOGY_CORPUS: TextCorpusFile = {
  workKey: "egy.memphite-theology",
  revision: "breasted-2026-10",
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
