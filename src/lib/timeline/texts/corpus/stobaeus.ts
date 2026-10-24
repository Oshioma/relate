// THE HERMETIC EXCERPTS IN STOBAEUS, including the Korē Kosmou, in Mead's
// English, paragraph by paragraph.
//
// The text comes from the generated file beside this one (Mead's 1906
// translation, "Excerpts by Stobaeus", Thrice-Greatest Hermes vol. III,
// checked word by word across three independent scans; see
// scripts/texts/mead-stobaeus.py). What a reader needs beyond it — titles,
// summaries, Mead's references to the Greek editions, witnesses, pictures,
// themes and connections — is written here.
//
// Hierarchy: Mead's excerpt (herm.sh.ex1 … herm.sh.ex27, the units counted)
// → his numbered paragraphs (herm.sh.ex1.1 …). An excerpt he does not number
// carries its text itself. The numbers are MEAD'S, not Nock–Festugière's
// SH 1–29: he puts the excerpts in an order of his own, and his two parts of
// "The Virgin of the World" (XXV–XXVI) number their paragraphs 1–50 straight
// through. Only the Korē Kosmou (Mead XXV = SH 23) is matched to an SH number
// here; the rest are not, so the count is partial and nothing is verified.
//
// The Greek (Wachsmuth–Hense, Gaisford, Meineke) is public domain but cited
// only, by Mead's own references. Nock–Festugière and Litwa are in copyright
// and cited by name, never quoted.

import type { CorpusImage, CorpusLayer, CorpusLink, CorpusManuscript, CorpusPassage, CorpusPassageDate, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { STOBAEUS_PARAGRAPHS, STOBAEUS_TITLES } from "./stobaeus-text";

const PREFIX = "herm.sh";

const SOURCES = INVENTORY_SOURCES.filter((s) =>
  [
    "mead-tgh-iii",
    "nock-festugiere",
    "litwa-hermetica-ii",
    "copenhaver-hermetica",
    "wachsmuth-hense-stobaeus",
    "gaisford-stobaeus",
    "meineke-stobaeus",
  ].includes(s.key)
);

const MEAD_EVIDENCE =
  "G. R. S. Mead, Thrice-Greatest Hermes, vol. III (1906), \"Excerpts by Stobaeus\". Public domain. Taken from the archive.org OCR of the Toronto copy (thricegreatesthe03hermuoft) and checked word by word against two independent copies: the University of Michigan e-text (afx0734.0003.001) and the archive.org OCR of a different scan of the three volumes (thrice-greatest-hermes-vol-1-2-3-grs-mead). Where the copies differed the majority reading was taken; the readings corrected by hand are listed in scripts/texts/mead-stobaeus.py. Mead's source notes, footnotes and commentary are left out; square and round brackets in the text are his.";

function englishLayer(text: string): CorpusLayer {
  return {
    key: "eng-mead",
    layer: "translation",
    sourceKey: "mead-tgh-iii",
    content: text,
    language: "English",
    licence: "public_domain",
    evidence: MEAD_EVIDENCE,
  };
}

type Excerpt = {
  /** Mead's reference to the Greek, as he prints it. */
  stobaeus: string;
  /** Which edition his page numbers are in: W(achsmuth–Hense), G(aisford), M(eineke). */
  greek: "wachsmuth-hense-stobaeus" | "gaisford-stobaeus";
  summary: string;
  themes?: [string, string][];
  notes?: string;
};

/** Every excerpt: Mead's reference, and a summary written for this archive from his text. */
const EXCERPTS: Record<number, Excerpt> = {
  1: {
    stobaeus: "Phys. xxxv. 1; W. i. 273–278",
    greek: "wachsmuth-hense-stobaeus",
    summary:
      "Hermes to Tat: true piety is to know what exists and thank its Maker, and piety and philosophy lead to each other. The soul must master its own lower parts. Then a long run of short headings to remember: God first, the Cosmos second, man third; what is in heaven never changes, what is on earth always does; nothing in a body is true.",
    themes: [
      ["divine-knowledge", "Piety is knowing what exists and thanking its Maker; the teaching is not for the crowd."],
      ["above-and-below", "Heaven gives every good to earth and receives nothing from it."],
    ],
  },
  2: {
    stobaeus: "Flor. lxxx. [lxxviii.] 9; G. iii. 135; M. iii. 104, 105",
    greek: "gaisford-stobaeus",
    summary: "To understand God is hard and to speak of him impossible: the bodiless cannot be told through a body, nor the perfect grasped by the imperfect.",
    themes: [["divine-knowledge", "God can be understood with difficulty, and spoken of not at all."]],
  },
  3: {
    stobaeus: "Flor. xi. 23; G. i. 307–311; M. i. 248–251; H. iii. 436–441",
    greek: "wachsmuth-hense-stobaeus",
    summary:
      "Hermes to Tat on Truth: nothing on earth is true, only copies of the true; man, made of many changing things, is not true; the one true thing we know here is that nothing here is true. Truth is in the eternal bodies alone.",
    themes: [["divine-knowledge", "Truth is not on earth; at most one can have an idea of it, if God gives it."]],
    notes: "Mead prints no paragraph 7 in this excerpt; his paragraph 8 follows 6.",
  },
  4: {
    stobaeus: "Phys. xxxv. 11; W. i. 293",
    greek: "wachsmuth-hense-stobaeus",
    summary:
      "Above all that exists is something beyond being; below it, the gods known by the mind and the gods perceived by the senses, and the order of nature that depends on them.",
  },
  5: {
    stobaeus: "Phys. xi. 2; W. i. 131",
    greek: "wachsmuth-hense-stobaeus",
    summary: "Matter both came to be and was before it came to be: it is the vessel of coming-to-be, and coming-to-be is the way God acts.",
    themes: [["creation", "Matter receives the seed of coming-to-be from God, who acts through it."]],
  },
  6: {
    stobaeus: "Phys. viii. 41; G. p. 93; M. i. 64",
    greek: "gaisford-stobaeus",
    summary: "Of time: past, present and future are not separate, nor simply one; the past no longer is, the future is not yet, and even the present never stands still.",
    themes: [["time-and-eternity", "The three times are one and not one; time never stands still."]],
    notes: "Mead gives a few Greek words in the text; they are not reproduced and are marked '(Greek word omitted)'.",
  },
  7: {
    stobaeus: "Phys. xxxv. 8; W. i. 290–292",
    greek: "wachsmuth-hense-stobaeus",
    summary:
      "Hermes to Tat: the Maker of the eternal bodies made them once and for all, and they last; our maker, himself in a body, makes bodies that decay. Sleep was given to living things so that they might last.",
    themes: [["immortality", "Eternal bodies, made from bodiless essence, do not die; ours do."]],
  },
  8: {
    stobaeus: "Phys. xxxv. 6; W. i. 284–289",
    greek: "wachsmuth-hense-stobaeus",
    summary:
      "Hermes to Tat on 'energies' (activities) and feelings: activities are bodiless and deathless but work in bodies, souled and soulless alike; in humans they come with the soul, some at birth and purer ones later. Sensation, grief and joy belong to bodies that have souls.",
    themes: [["the-soul", "The activities that come with the soul, and how feeling arises in a body."]],
  },
  9: {
    stobaeus: "Phys. xxi. 9; W. i. 189–194",
    greek: "wachsmuth-hense-stobaeus",
    summary:
      "Hermes to Tat on the thirty-six Decans, ranged between the circle of the universe and the zodiac and acting on everything, on the Bear, on the short-lived stars below the Moon and the comets. Whoever contemplates God is blessed, but no one in a body can do so.",
    themes: [
      ["sacred-numbers", "The thirty-six Decans, the star-gods of the Egyptian calendar."],
      ["cosmic-law", "The Decans act on the stars and on everything on earth."],
    ],
  },
  10: {
    stobaeus: "Phys. iv. 8; W. i. 73, 74",
    greek: "wachsmuth-hense-stobaeus",
    summary: "Hermes to Tat on what Providence, Necessity and Fate each rule, by way of the three kinds of bodiless things.",
    themes: [["fate-and-free-will", "Providence, Necessity and Fate and the things each governs."]],
  },
  11: {
    stobaeus: "Phys. iii. 52; W. i. 62, 63",
    greek: "wachsmuth-hense-stobaeus",
    summary: "A mighty Daimon turns in the middle of the universe watching human deeds; Justice is set over humans as Foreknowledge and Necessity over the gods, and punishes wrongdoing.",
    themes: [["cosmic-law", "Justice watches and punishes human wrongdoing."]],
  },
  12: {
    stobaeus: "Phys. v. 20; W. i. 82",
    greek: "wachsmuth-hense-stobaeus",
    summary: "Of Providence and Fate: Providence is self-perfect Reason, with Necessity and Fate as its two powers; the stars serve Fate, and no one escapes it.",
    themes: [["fate-and-free-will", "Fate serves Providence and Necessity, and the stars serve Fate."]],
  },
  13: {
    stobaeus: "Phys. v. 16; W. i. 79, 80",
    greek: "wachsmuth-hense-stobaeus",
    summary: "Of the whole economy: Providence holds up the world, Necessity holds it together, and Fate drives everything round.",
    themes: [["fate-and-free-will", "The Cosmos ruled by Providence, Necessity and Fate together."]],
  },
  14: {
    stobaeus: "Phys. xxxv. 9; W. 281, 282 (as Mead prints it)",
    greek: "wachsmuth-hense-stobaeus",
    summary: "The first of six excerpts 'Of Soul' (addressed to Ammon): the soul is a bodiless, self-moving essence; place, time and motion are bodiless, each with its property.",
    themes: [["the-soul", "The soul as a bodiless essence that moves itself."]],
  },
  15: {
    stobaeus: "Phys. xxxv. 7; W. i. 289, 290",
    greek: "wachsmuth-hense-stobaeus",
    summary: "Of Soul, II: how the Nature of the whole moves things, how matter became fire, water and earth, and how a living body takes form in the womb.",
    themes: [["creation", "Matter, moved, becomes the elements; the body takes shape in the womb."]],
  },
  16: {
    stobaeus: "Phys. xli. 3; W. i. 320, 321",
    greek: "wachsmuth-hense-stobaeus",
    summary: "Of Soul, III: the soul gives a body ordered life; intellect reaches a living thing according to the body's blend and the Harmony.",
    themes: [["the-soul", "The soul gives being and ordered life to the body."]],
  },
  17: {
    stobaeus: "Phys. xli. 4; W. i. 321, 322",
    greek: "wachsmuth-hense-stobaeus",
    summary: "Of Soul, IV: the soul takes on the life Fate gives it and draws to itself 'heart' and 'appetite'; when both are balanced under reason, the virtues are born.",
    themes: [["the-soul", "Heart and appetite, brought under the soul's reason, make justice and self-control."]],
  },
  18: {
    stobaeus: "Phys. xli. 5; W. i. 322–324",
    greek: "wachsmuth-hense-stobaeus",
    summary: "Of Soul, V: every soul is deathless and always moving; the kinds of soul, and the deathless irrational parts joined to the human soul.",
    themes: [["immortality", "Every soul is deathless because it moves itself."]],
  },
  19: {
    stobaeus: "Phys. xli. 6; W. i. 324, 325",
    greek: "wachsmuth-hense-stobaeus",
    summary: "Of Soul, VI: the soul's two lives and two motions, the spirit that judges appearances, and the reason that judges truly.",
    themes: [["the-soul", "The soul's reason against the spirit of sense and opinion."]],
  },
  20: {
    stobaeus: "Ethica vii. 31; W. ii. 160, 161",
    greek: "wachsmuth-hense-stobaeus",
    summary: "The power of choice: we may choose better or worse; choosing evil joins us to bodily nature and so to Fate, while the intelligent part in us is free.",
    themes: [["fate-and-free-will", "Choice decides whether a person falls under Fate."]],
    notes: "Mead's paragraph 2 keeps, in round brackets, his note on a sentence Patrizzi printed as a scholium.",
  },
  21: {
    stobaeus: "Flor. xiii. 50; G. i. 328; M. i. 265; H. iii. 467",
    greek: "wachsmuth-hense-stobaeus",
    summary: "A single sentence to a king: one who recognises that he has been refuted is moved to desire what he did not know.",
  },
  22: {
    stobaeus: "W., i. 34, 5 (as Mead prints it)",
    greek: "wachsmuth-hense-stobaeus",
    summary: "An apophthegm: asked what God is, Hermes answered, the Maker of all wholes, the wisest and everlasting Mind.",
    themes: [["divine-knowledge", "A one-line definition of God as Mind and Maker."]],
  },
  23: {
    stobaeus: "Phys. xxxvi. 2; W. i. 295, 296",
    greek: "wachsmuth-hense-stobaeus",
    summary: "From a book called 'Aphrodite': why children resemble their father, their mother or their forebears, explained by which seed prevails.",
  },
  24: {
    stobaeus: "Phys. v. 14; W. i. 77",
    greek: "wachsmuth-hense-stobaeus",
    summary: "A verse hymn of the seven wandering stars — Moon, Kronos, Sun, Aphrodite, Ares, Hermes and Zeus — with whom Eternity spins fate, and from whom human beings have their tears, laughter, anger, birth, reason, sleep and desire.",
    themes: [
      ["seven-planetary-spheres", "The seven planets in their circling courses."],
      ["seven-cosmic-rulers", "The seven planets as the givers of human qualities and fate."],
    ],
    notes: "Mead notes that the verses are also found in the appendix to the Palatine Anthology.",
  },
  25: {
    stobaeus: "Phys. xli. 44; W. i. 385–407",
    greek: "wachsmuth-hense-stobaeus",
    summary:
      "The Korē Kosmou ('The Virgin of the World'), part I. Isis teaches Horus how Hermes hid his books; how God made Nature and the souls, how the souls overstepped their bounds and were bound into bodies made by Hermes; how the elements complained of human wickedness, and how God sent Osiris and Isis to civilise the world.",
    themes: [
      ["creation", "God makes Nature, the souls and the bodies they are bound into."],
      ["thoth-and-hermes", "Hermes records all things, hides his books and makes the human body."],
      ["reincarnation", "God's law of the souls' transformations into the bodies of humans and animals."],
      ["magic-and-sacred-words", "God makes the souls with secret words and sacred arts."],
    ],
    notes:
      "This is SH 23 in Nock–Festugière, the Korē Kosmou proper; Mead takes its name, 'Minerva Mundi', from Patrizzi. Mead numbers its paragraphs 1–38 and prints no paragraph 37; his part II continues the numbering.",
  },
  26: {
    stobaeus: "Phys. xli. 45; W. i. 407–414",
    greek: "wachsmuth-hense-stobaeus",
    summary:
      "'The Virgin of the World', part II. Isis answers Horus's questions on the four regions of the universe, how royal and noble souls are born, why souls are male or female and wise or slow, and why the people of their holy land are the wisest, since Egypt lies at the heart of the Earth.",
    themes: [
      ["the-soul", "Why souls differ: royal and noble, male and female, wise and slow."],
      ["above-and-below", "Four regions — Heaven, Aether, Air and Earth — each under its ruler."],
    ],
    notes:
      "Mead treats this as a second part of the Korē Kosmou and continues his paragraph numbers (39–50); in Stobaeus it is a separate excerpt. Which SH number it is in Nock–Festugière is not checked here.",
  },
  27: {
    stobaeus: "Phys. xli. 68, 69; W. i. 458–472",
    greek: "wachsmuth-hense-stobaeus",
    summary:
      "From the sermon of Isis to Horus: where souls go when they leave the body — the air between earth and heaven divided into zones, the two ministers of Providence who keep and guide souls — and how the blend of the four elements in a body decides what kind of creature a soul is born as.",
    themes: [
      ["the-soul", "Where souls go after death and why they are born into different bodies."],
      ["ascension", "Souls rise through the zones of the air according to their worth."],
      ["reincarnation", "The blend of elements decides whether a soul becomes bird, human or beast."],
    ],
    notes: "Two excerpts in Stobaeus, which Mead prints as one. Which SH numbers they are in Nock–Festugière is not checked here.",
  },
};

/** The Greek, public domain but cited only, by Mead's reference. */
function greekLayer(n: number): CorpusLayer {
  const excerpt = EXCERPTS[n];
  return {
    key: "grc-stobaeus",
    layer: "primary_text",
    sourceKey: excerpt.greek,
    contentAbsentReason: `Public domain, cited only, not transcribed: read the Greek at Stobaeus ${excerpt.stobaeus} (Mead's reference: W. = Wachsmuth–Hense, H. = Hense, G. = Gaisford, M. = Meineke).`,
    language: "Koine Greek",
    licence: "public_domain",
    evidence: "Mead's own reference at the head of the excerpt, the same in all three copies of his book used here.",
  };
}

/** The modern editions, in copyright: where to read them, nothing more. */
function modernLayers(n: number): CorpusLayer[] {
  const where = n === 25 ? "SH 23 (the Korē Kosmou)" : `the excerpt Mead numbers ${roman(n)} (its SH number is not matched here)`;
  return [
    {
      key: "grc-fra-nock-festugiere",
      layer: "translation",
      sourceKey: "nock-festugiere",
      contentAbsentReason: `In copyright, cited only: Greek text and French translation in A. D. Nock and A.-J. Festugière, Corpus Hermeticum, vols. III–IV (Collection Budé), at ${where}.`,
      language: "French",
      licence: "copyrighted_reference",
      evidence: "The critical edition whose SH numbering the inventory uses. Named so a reader can find the passage; no text is reproduced.",
    },
    {
      key: "eng-litwa",
      layer: "translation",
      sourceKey: "litwa-hermetica-ii",
      contentAbsentReason: `In copyright, cited only: M. David Litwa, Hermetica II (Cambridge University Press, 2018), at ${where}.`,
      language: "English",
      licence: "copyrighted_reference",
      evidence: "The modern English translation of the Stobaean excerpts, in Nock–Festugière's numbering. Named so a reader can find the passage; no text is reproduced.",
    },
  ];
}

function roman(n: number) {
  const table: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let out = "";
  for (const [value, numeral] of table) {
    while (n >= value) {
      out += numeral;
      n -= value;
    }
  }
  return out;
}

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "naples-farnesinus-iii-d-15",
    siglum: "F",
    name: "Naples, Biblioteca Nazionale, III D 15 (the 'Farnesinus')",
    objectKind: "codex",
    holdingInstitution: "Biblioteca Nazionale di Napoli",
    accessionNumber: "III D 15",
    startYear: 1300,
    endYear: 1400,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "fourteenth century",
    datingEvidence: "As usually given for the chief manuscript of the Eclogae; not checked here against Wachsmuth's preface or the library's catalogue.",
    sourceKey: "wachsmuth-hense-stobaeus",
    notes: "One of the two main witnesses to Books I–II of the Anthology (the Eclogae), where most of the Hermetic excerpts stand. Not looked at here.",
  },
  {
    key: "paris-gr-2129",
    siglum: "P",
    name: "Paris, Bibliothèque nationale de France, grec 2129",
    objectKind: "codex",
    holdingInstitution: "Bibliothèque nationale de France",
    accessionNumber: "grec 2129",
    startYear: 1400,
    endYear: 1500,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "fifteenth century",
    datingEvidence: "As usually given; not checked here against Wachsmuth's preface or the library's catalogue.",
    sourceKey: "wachsmuth-hense-stobaeus",
    notes: "The other main witness to the Eclogae. Its first page is the picture on the timeline marker for this work. Not looked at here.",
  },
];

/** Witnesses for an excerpt: the two Eclogae manuscripts for the excerpts from Books I–II. */
function witnessesFor(n: number) {
  const fromEclogae = !EXCERPTS[n].stobaeus.startsWith("Flor.");
  return fromEclogae ? [{ manuscriptKey: "naples-farnesinus-iii-d-15" }, { manuscriptKey: "paris-gr-2129" }] : undefined;
}

const DATES: CorpusPassageDate[] = [
  {
    key: "composition",
    role: "composition",
    startYear: 100,
    endYear: 300,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "first to third centuries CE (disputed)",
    evidence:
      "Disputed. The Hermetic writings are usually dated, as a group, to the Roman period, from the first to the third century CE, on their language and ideas; no excerpt carries a date of its own, and some may be older or younger. The span is the usual one, not a finding.",
    sourceKey: "copenhaver-hermetica",
  },
  {
    key: "anthology",
    role: "earliest_evidence",
    startYear: 400,
    endYear: 500,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "Stobaeus's Anthology, fifth century CE",
    evidence:
      "John of Stobi compiled his Anthology for his son, probably in the fifth century; it is the earliest, and for most of these excerpts the only, witness to them. His dates are not known more closely.",
    sourceKey: "wachsmuth-hense-stobaeus",
  },
  {
    key: "manuscript-f",
    role: "manuscript",
    startYear: 1300,
    endYear: 1400,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "Naples III D 15 (F), fourteenth century",
    evidence: "As usually given for the chief manuscript of the Eclogae; not checked here.",
    sourceKey: "wachsmuth-hense-stobaeus",
  },
  {
    key: "manuscript-p",
    role: "manuscript",
    startYear: 1400,
    endYear: 1500,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "Paris gr. 2129 (P), fifteenth century",
    evidence: "As usually given; not checked here.",
    sourceKey: "wachsmuth-hense-stobaeus",
  },
  {
    key: "translation",
    role: "translation_publication",
    startYear: 1906,
    endYear: 1906,
    datePrecision: "year",
    isApproximate: false,
    originalDateText: "1906",
    evidence: "Mead, Thrice-Greatest Hermes, vol. III, title page of the scanned copy (thricegreatesthe03hermuoft).",
    sourceKey: "mead-tgh-iii",
  },
];

type Placed = CorpusImage & { excerpt?: number };

const IMAGES: Placed[] = [
  {
    key: "stobaeus-trincavelli-1536-florilegium-p1",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Stobaeus_Eklogai_apophthegmaton_1536_page_1.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Stobaeus_Eklogai_apophthegmaton_1536_page_1.jpg",
    objectDate: "1536",
    caption:
      "UNVERIFIED — The first page of the Florilegium of Stobaeus in an early printed edition, which the Commons record names as Vettore Trincavelli's of 1536: a decorated headpiece and initial, the Greek title ΙΩΑΝΝΟΥ ΣΤΟΒΑΙΟΥ ΕΚΛΟΓΩΝ ΑΠΟΦΘΕΓΜΑΤΩΝ ΥΠΟΘΗΚΩΝ and the chapter 'On Prudence', with the authors' names in the margin. The page opens the Anthology's later books, where excerpts II, III and XXI stand, but is not itself a Hermetic excerpt.",
    creator: "Printed edition; printer not named on the page",
    credit: "Wikimedia Commons",
    licence: "Public domain (Public Domain Mark 1.0)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "unverified",
    whatIsUnverified:
      "The edition, editor and date (Trincavelli, 1536) come from the Commons record and are not printed on the page shown; which copy was photographed is not stated. That the page is the opening of Stobaeus's Florilegium is clear from its Greek title.",
    verificationStatus: "unverified",
  },
  {
    key: "stobaeus-meineke-florilegium-1855-cover",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Teubner_Stobaeus_1855.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Teubner_Stobaeus_1855.jpg",
    objectDate: "1855",
    caption:
      "The cover of the second volume of August Meineke's Teubner edition of Stobaeus's Florilegium (Leipzig, 1855), as its printed title reads. Mead cites this edition as 'M.' for the excerpts from the Florilegium. Context: a nineteenth-century edition of the Greek, not a witness to it.",
    creator: "B. G. Teubner (publisher); August Meineke (editor)",
    credit: "Wikimedia Commons (the uploader's own copy)",
    licence: "Public domain (Public Domain Mark 1.0)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "stobaeus-related-isis-nursing-horus-met-45-2-10",
    excerpt: 25,
    url: "https://upload.wikimedia.org/wikipedia/commons/6/61/Statuette_of_Isis_nursing_Horus%2C_dedicated_by_Ankhhor_MET_45.2.10_EGDP013278.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Statuette_of_Isis_nursing_Horus,_dedicated_by_Ankhhor_MET_45.2.10_EGDP013278.jpg",
    institution: "The Metropolitan Museum of Art, New York",
    accessionNumber: "45.2.10",
    objectDate: "c. 664–332 BCE",
    caption:
      "A statuette of Isis with the child Horus, dedicated by a man named Ankhhor, Late Period Egypt (about 664–332 BCE): the goddess sits on a throne with the child on her lap, and a line of hieroglyphs runs along the base. The Korē Kosmou is Isis's teaching to her son Horus, and opens with her giving him 'the sweet draught of deathlessness'. Related evidence for the two speakers, centuries older than the text; not an illustration of it.",
    creator: "Unknown Egyptian artist",
    credit: "The Metropolitan Museum of Art, via Wikimedia Commons",
    licence: "CC0 1.0",
    licenceStatus: "open",
    shows: "artefact",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];

function imagesFor(test: (image: Placed) => boolean): CorpusImage[] | undefined {
  const found = IMAGES.filter(test).map((image) => {
    const copy: Placed = { ...image };
    delete copy.excerpt;
    return copy;
  });
  return found.length > 0 ? found : undefined;
}

const pages = (first: number, last: number) => (first === last ? `p. ${first}` : `pp. ${first}–${last}`);

function buildPassages(): CorpusPassage[] {
  const byExcerpt = new Map<number, (typeof STOBAEUS_PARAGRAPHS)[number][]>();
  for (const row of STOBAEUS_PARAGRAPHS) byExcerpt.set(row[0], [...(byExcerpt.get(row[0]) ?? []), row]);

  const passages: CorpusPassage[] = [];
  for (const [n, rows] of byExcerpt) {
    const excerpt = EXCERPTS[n];
    const key = `${PREFIX}.ex${n}`;
    const whole = rows.length === 1 && rows[0][1] === 0;
    const first = rows[0][2];
    const last = rows[rows.length - 1][3];
    const notes = [
      `Mead's title: "${STOBAEUS_TITLES[n]}" (square brackets mark a title he supplied). Stobaeus ${excerpt.stobaeus}.`,
      excerpt.notes,
      whole ? "Mead does not divide this excerpt into numbered paragraphs." : undefined,
    ].filter(Boolean);
    passages.push({
      key,
      divisionKind: "fragment",
      label: `Stobaean excerpt ${roman(n)}: ${STOBAEUS_TITLES[n].replace(/^\[(.*)\]$/, "$1")}`,
      reference: `Mead's excerpt ${roman(n)} (Mead 1906, vol. III, ${pages(first, last)}); Stobaeus ${excerpt.stobaeus}`,
      sourceKey: "mead-tgh-iii",
      summary: excerpt.summary,
      verificationStatus: "unverified",
      notes: notes.join(" "),
      layers: [...(whole ? [englishLayer(rows[0][4])] : []), greekLayer(n), ...modernLayers(n)],
      witnesses: witnessesFor(n),
      dates: n === 1 ? DATES : undefined,
      themes: excerpt.themes?.map(([themeKey, note]) => ({ themeKey, note })),
      images: imagesFor((image) => image.excerpt === n),
    });
    if (whole) continue;
    for (const [, paragraph, firstPage, lastPage, english] of rows) {
      passages.push({
        key: `${key}.${paragraph}`,
        parentKey: key,
        divisionKind: "section",
        label: `Stobaean excerpt ${roman(n)}.${paragraph}`,
        reference: `Mead's excerpt ${roman(n)}, paragraph ${paragraph} (Mead 1906, vol. III, ${pages(firstPage, lastPage)})`,
        sourceKey: "mead-tgh-iii",
        verificationStatus: "unverified",
        layers: [englishLayer(english)],
      });
    }
  }
  return passages;
}

const LINKS: CorpusLink[] = [
  {
    key: "sh-ex1-8-first-god-ascl-10-2",
    from: `${PREFIX}.ex1.8`,
    to: "herm.ascl.10.2",
    connectionClass: "close_conceptual_parallel",
    similarities: "The same ranking of three: 'First God; second the Cosmos; third [is] man' in the excerpt, and in the Asclepius the Lord of eternity as first God, the cosmos second and man third.",
    differences: "The excerpt gives it as a bare heading to be memorised; the Asclepius develops it, making cosmos and man the two images of God.",
    wordingComparable: "partly",
    meaningComparable: "yes",
    transmissionEvidence: "Both are Hermetic writings of the Roman period, compared here in Mead's English (the Asclepius from the Latin, the excerpt from Stobaeus's Greek). No direct borrowing is shown.",
    reviewStatus: "proposed",
  },
  {
    key: "sh-ex2-hard-to-speak-tim-28c",
    from: `${PREFIX}.ex2`,
    to: "greek.tim.28c",
    connectionClass: "close_conceptual_parallel",
    similarities: "Both say that God, the maker, is hard to understand and impossible to tell: 'To understand God is difficult, to speak [of Him] impossible'; Timaeus: to find the maker and father of this universe is hard, and having found him, to declare him to all men impossible.",
    differences: "Plato says it is impossible to declare the maker to all; the excerpt makes it impossible to speak of God at all, because the bodiless cannot be told through a body.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: "The Timaeus sentence was among the most quoted in later antiquity, and the Hermetic writers drew on Platonic ideas; the excerpt reads as a reworking of it, but no quotation is shown here.",
    earlierNote: "The Timaeus (fourth century BCE) is centuries earlier.",
    reviewStatus: "proposed",
  },
  {
    key: "sh-ex24-seven-stars-ch-1-9",
    from: `${PREFIX}.ex24`,
    to: "herm.ch.1.9",
    connectionClass: "close_conceptual_parallel",
    similarities: "Both make the seven planets the rulers of fate: in the hymn Eternity spins fate with the seven wandering stars; in the Poimandres the second Mind makes seven Governors who encompass the sensible world, and their government is called Fate.",
    differences: "The hymn names the planets as gods and gives each a human trait (tears, laughter, anger, birth, reason, sleep, desire); the Poimandres speaks of them abstractly, as made by Mind.",
    wordingComparable: "no",
    meaningComparable: "partly",
    transmissionEvidence: "A commonplace of Hellenistic astrology shared by many Hermetic texts; no direct borrowing is shown.",
    reviewStatus: "proposed",
  },
  {
    key: "sh-ex25-23-souls-transmigrate-ascl-12",
    from: `${PREFIX}.ex25.23`,
    to: "herm.ascl.12",
    connectionClass: "close_conceptual_parallel",
    similarities: "Both make the souls' passing into other bodies a consequence of their conduct: in the Korē Kosmou God sets a law of transformations by which souls that do wrong go down into lower bodies; in the Asclepius the impious are denied return to heaven and pass into other bodies.",
    differences: "The Korē Kosmou sets out a graded scheme of rewards and punishments for souls already bound into bodies; the Asclepius says only that the impious migrate into bodies unworthy of a holy soul.",
    wordingComparable: "no",
    meaningComparable: "partly",
    transmissionEvidence: "Same Hermetic tradition; no direct borrowing is shown.",
    reviewStatus: "proposed",
  },
];

export const STOBAEUS_CORPUS: TextCorpusFile = {
  workKey: "herm.stobaeus",
  revision: "mead-2026-10",
  sources: SOURCES,
  manuscripts: MANUSCRIPTS,
  images: IMAGES.filter((image) => image.excerpt == null).map((image) => {
    const copy: Placed = { ...image };
    delete copy.excerpt;
    return copy;
  }),
  passages: buildPassages(),
  links: LINKS,
};
