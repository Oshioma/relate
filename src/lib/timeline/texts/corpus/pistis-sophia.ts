// PISTIS SOPHIA: the 148 chapters of the Codex Askew in Mead's English (1921).
//
// The text comes from the generated file beside this one (the Global Grey
// e-text of Mead's 2nd edition, checked word by word against two independent
// OCRs of the printed book; see scripts/texts/mead-pistis-sophia.py). What a
// reader needs beyond it — the books, Mead's side-headings, the codex, dates,
// pictures, themes and connections — is written here.
//
// Hierarchy: Mead's six "books" (the headings he prints: The First Book, The
// Second Book, the Conclusion of Another Book, A Third … A Sixth Book) →
// the 148 chapters (gnostic.ps.1 … gnostic.ps.148, the units counted, in
// Schmidt's numbering, which Mead follows). A chapter longer than about 6,000
// characters is split into parts of whole paragraphs (gnostic.ps.86.1, .2, …)
// so that each can carry plain words; the parts are the archive's, not
// Mead's. The scribe's note, the two subscriptions and the later postscript
// are passages of their own.
//
// Mead's footnotes and introduction are left out. His marginal side-headings
// (summaries he printed beside the text) are kept in each chapter's notes,
// never in the text. The Coptic (Schwartze 1851, Schmidt 1925) is not
// reproduced; Schmidt–MacDermot (1978) is in copyright and cited by name.

import type { CorpusImage, CorpusLayer, CorpusLink, CorpusManuscript, CorpusPassage, CorpusPassageDate, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { PISTIS_SOPHIA_CHAPTERS, PISTIS_SOPHIA_EXTRAS } from "./pistis-sophia-text";

const PREFIX = "gnostic.ps";

const SOURCES = INVENTORY_SOURCES.filter((s) => ["mead-pistis", "schmidt-macdermot-1978"].includes(s.key));

const MEAD_EVIDENCE =
  "G. R. S. Mead, Pistis Sophia: A Gnostic Miscellany (2nd ed., John M. Watkins, 1921). Public domain. Taken from the Global Grey e-text (2013) and checked word by word against two independent OCRs of the printed book (the Celephais Press e-text, 2007, and the archive.org OCR of the Brigham Young University copy, pistissophiagnos1921mead): about 96–97% of the words agree with each, and every place where both OCRs agree against the e-text was judged by hand. Only certain errors were corrected (misread letters, stray marks, run-together words and lines, hyphens left from line breaks, quotation marks and colons dropped or set in the wrong order, side-headings run into the text, and one paragraph and one sentence the e-text lost); every correction is listed in scripts/texts/mead-pistis-sophia.py. The e-text drops the long-vowel marks Mead prints on the magical names. Mead's footnotes are left out and his side-headings moved to the notes; square brackets and question marks in brackets are his.";

function englishLayer(text: string): CorpusLayer {
  return {
    key: "eng-mead",
    layer: "translation",
    sourceKey: "mead-pistis",
    content: text,
    language: "English",
    licence: "public_domain",
    evidence: MEAD_EVIDENCE,
  };
}

/** The modern edition, in copyright: where to read it, nothing more. */
function modernLayer(chapter: number): CorpusLayer {
  return {
    key: "eng-macdermot",
    layer: "translation",
    sourceKey: "schmidt-macdermot-1978",
    contentAbsentReason: `In copyright, cited only: the Coptic text edited by Carl Schmidt with Violet MacDermot's English translation, Pistis Sophia (Nag Hammadi Studies 9, E. J. Brill, 1978), chapter ${chapter}.`,
    language: "English",
    licence: "copyrighted_reference",
    evidence: "The standard edition of the Coptic, in the chapter numbering used here. Named so a reader can find the chapter; no text is reproduced.",
  };
}

type Book = { key: string; heading: string; first: number; last: number; divisionKind: "book" | "part"; summary: string };

/** Mead's own headings. The codex itself has four divisions (chapters 1–62, 63–100, 101–135, 136–148), as Mead's introduction explains. */
const BOOKS: Book[] = [
  {
    key: "book-1",
    heading: "The First Book of Pistis Sophia",
    first: 1,
    last: 62,
    divisionKind: "book",
    summary:
      "Eleven years after the resurrection Jesus ascends in light, returns, and tells the disciples how he passed through the spheres and aeons, took away a third of the rulers' power and found Pistis Sophia in the chaos, oppressed by Self-willed. She sings her repentances, and the disciples, Mary Magdalene above all, interpret each from the Psalms or the Odes of Solomon.",
  },
  {
    key: "book-2",
    heading: "The Second Book of Pistis Sophia",
    first: 63,
    last: 100,
    divisionKind: "book",
    summary:
      "Pistis Sophia is led out of the chaos and sings her songs of praise, which the disciples interpret; then Jesus teaches the mysteries of the Light, the regions of the Inheritance, the ranks of those who receive the mysteries, and the forgiveness of sins.",
  },
  {
    key: "another-book",
    heading: "The Conclusion of Another Book",
    first: 101,
    last: 101,
    divisionKind: "part",
    summary: "A short piece on the gnosis of the Ineffable, without a setting of its own: the end of a larger work, in Mead's view an extract from another book.",
  },
  {
    key: "book-3",
    heading: "A Third Book",
    first: 102,
    last: 125,
    divisionKind: "book",
    summary:
      "Jesus tells the disciples how to proclaim renunciation to the world, and teaches the mysteries that forgive sins, how a soul is made and brought to birth, the counterfeiting spirit and Fate, and how souls who receive the mysteries rise into the Light.",
  },
  {
    key: "book-4",
    heading: "A Fourth Book",
    first: 126,
    last: 135,
    divisionKind: "book",
    summary:
      "After a gap in the text: the dragon of the outer darkness and its twelve dungeons, the punishments of souls, how a soul is made and fated, and the necessity of the mysteries even for the righteous.",
  },
  {
    key: "book-5",
    heading: "A Fifth Book",
    first: 136,
    last: 143,
    divisionKind: "book",
    summary:
      "A new setting: after the resurrection Jesus stands with the disciples by the sea, prays to the Father in the names of power, and leads them through the ways of the Midst, showing the rulers and their punishments of souls.",
  },
  {
    key: "book-6",
    heading: "A Sixth Book",
    first: 144,
    last: 148,
    divisionKind: "book",
    summary: "After a gap of eight leaves: the punishments of the curser, the slanderer, the murderer, the thief and other sinners, and the mercy that even the greatest sinner may find by repentance.",
  },
];

/** Where each extra stands: after which chapter, in which book. */
const EXTRAS: { key: string; label: string; after: number; summary: string; notes: string }[] = [
  {
    key: "scribe-note",
    label: "A scribe's note (after chapter 62)",
    after: 62,
    summary: "A note by a later hand, copied from another book: names of the Immortal and of the Voice, given in letters, with their interpretations.",
    notes:
      "Mead prints this at the end of the first division, where the codex has a column and a half left blank and this short extract on the second column. He gives the letter-names in Greek; the e-text and both OCRs garble them differently, so the unreadable ones are marked '(Greek letters omitted)' and the rest are uncertain.",
  },
  {
    key: "subscription-1",
    label: "Subscription (after chapter 100)",
    after: 100,
    summary: "The subscription at the end of the second division: 'A Portion of the Books of the Saviour'.",
    notes: "At the bottom of MS p. 233, col. 1, according to Mead's introduction.",
  },
  {
    key: "subscription-2",
    label: "Subscription (after chapter 135)",
    after: 135,
    summary: "The same subscription again, at the end of the third division: 'A Portion of the Books of the Saviour'.",
    notes: "At the bottom of MS p. 318, col. 1, according to Mead's introduction.",
  },
  {
    key: "postscript",
    label: "A later postscript (after chapter 148)",
    after: 148,
    summary: "A fragment beginning in mid-sentence: the apostles go out three by three to the four quarters of heaven and proclaim the kingdom, with signs and wonders.",
    notes: "On the last page of the codex; Mead's introduction thinks it formed no part of the original copy. Two lines at the very end are erased.",
  },
];

/** Side-headings Mead prints at the head of an extra, kept out of its text. */
const EXTRA_SIDE_HEADINGS = new Set(["A note by a later hand, copied from another scripture.", "The proclamation of the apostles."]);

type Chapter = { notes?: string; themes?: [string, string][] };

/** Notes and themes for particular chapters, written for this archive from Mead's text. */
const CHAPTERS: Record<number, Chapter> = {
  19: {
    notes:
      "The e-text lacks the heading of this chapter; it is placed where both OCRs of the printed book have Mead's 'CHAP. 19' in the margin (p. 21), at the paragraph beginning 'The power then which was in the prophet Isaiah'. The exact line is approximate.",
  },
  20: { notes: "The e-text lost the first paragraph of this chapter; it is restored from the two OCRs of the printed book, which agree." },
  1: {
    themes: [["initiation", "For eleven years after the resurrection Jesus teaches the disciples only up to the First Mystery."]],
  },
  3: {
    themes: [["ascension", "Wrapped in a great light-power, Jesus rises into heaven before the disciples' eyes."]],
  },
  15: {
    themes: [
      ["fate-and-free-will", "Jesus changes the motion of the Fate and the sphere, six months facing left and six right."],
      ["seven-cosmic-rulers", "The rulers of the twelve aeons lose a third of their power."],
    ],
  },
  21: {
    themes: [["fate-and-free-will", "Astrologers and diviners can foretell truly only when the Fate and the sphere face their first, left-hand way."]],
  },
  27: {
    themes: [
      ["cosmic-cycles", "Jesus shortens the rulers' cycles and turns their courses six months left and six months right."],
    ],
  },
  31: {
    themes: [
      ["the-soul", "Pistis Sophia's fall from the thirteenth aeon into the chaos, the story the first two books retell."],
      ["transformation", "Her matter becomes the lion-faced ruler Yaldabaoth."],
    ],
  },
  65: {
    notes:
      "After 'They who were in the dry sand, drank,—that is:' Peter's explanation is empty and the next line follows at once. The Celephais e-text of the printed book has the same, so the gap is in Mead's text, not a transcription loss.",
  },
  81: {
    themes: [
      ["ascension", "Jesus leads Sophia back up into the thirteenth aeon among the twenty-four invisibles."],
    ],
  },
  84: {
    themes: [
      ["above-and-below", "Each higher region makes the one below seem darkness and a speck of dust."],
    ],
  },
  91: {
    themes: [
      ["divine-knowledge", "The mystery of the Ineffable 'knoweth why' every pair of opposites has arisen."],
    ],
  },
  96: {
    themes: [
      ["consciousness", "'That man is I and I am that man': the initiate becomes one with the Saviour."],
      ["immortality", "The soul that has the mystery of the Ineffable rises as a light-stream through every region."],
    ],
  },
  99: {
    themes: [
      ["time-and-eternity", "A day of the Light is a thousand years of the world, and a year of the Light 365,000 years."],
      ["thoth-and-hermes", "The two Books of Yew (Jeu), written by Enoch in Paradise, hold the lower mysteries."],
    ],
  },
  100: { notes: "Mead moves two sentences here ('This is the answer … unknowing?') and explains why in a footnote, which is left out." },
  111: {
    themes: [
      ["reincarnation", "The soul is punished and then sent back into a body suited to its sins until its last cycle is done."],
      ["fate-and-free-will", "The counterfeiting spirit, given by the rulers of the Fate, compels the soul to sin."],
    ],
  },
  115: {
    themes: [
      ["death-and-rebirth", "The mystery of baptism burns away the sins sealed on the soul."],
    ],
  },
  125: {
    notes: "A large gap in the manuscript follows Mary's unfinished answer, marked by Mead '[A CONSIDERABLE LACUNA HERE OCCURS IN THE TEXT.]'.",
  },
  126: {
    themes: [
      ["underworld", "The outer darkness is a dragon with its tail in its mouth, holding twelve dungeons."],
      ["amenti", "Amente, the chaos and the outer darkness are ranked by the heat of their fires."],
    ],
  },
  131: {
    themes: [
      ["reincarnation", "Before birth the soul drinks the cup of forgetfulness and forgets all it has passed through."],
      ["the-soul", "The power, the soul, the counterfeiting spirit and the destiny that make up a person."],
    ],
  },
  132: {
    themes: [
      ["fate-and-free-will", "The destiny follows each person and brings the death the rulers of the Fate appointed."],
      ["sacred-numbers", "365 servitors build the body in the womb over seventy days."],
    ],
  },
  136: {
    themes: [
      ["seven-cosmic-rulers", "Yew binds the rebel rulers into the sphere under five regents named Kronos, Ares, Hermes, Aphrodite and Zeus."],
      ["sun-and-moon", "The disk of the sun is a dragon with its tail in its mouth; the moon a ship drawn by two white bulls."],
      ["magic-and-sacred-words", "Jesus invokes the Father with strings of sacred names and explains 'iao'."],
    ],
  },
  137: {
    themes: [
      ["seven-planetary-spheres", "Powers bound into the five planetary regents, with their 'incorruptible names'."],
    ],
  },
  139: {
    themes: [
      ["underworld", "The five rulers of the way of the midst, beginning with Paraplex, and the punishments in their regions."],
      ["cosmic-cycles", "Each region is dissolved when Zeus and Aphrodite reach particular signs of the zodiac."],
    ],
  },
  142: {
    notes:
      "The e-text runs the sentence 'And when he said this, the disciples rejoiced in great joy' into Mead's side-heading; it is restored to the text from the two OCRs of the printed book.",
    themes: [["magic-and-sacred-words", "The rite of the first offering, with its invocation of the 'forgivers of sins'."]],
  },
  143: {
    notes: "Eight leaves of the manuscript are lost after this chapter (Mead: '[LACUNA OF EIGHT LEAVES.]'); chapter 144 begins in the middle of the punishment of the curser.",
    themes: [["magic-and-sacred-words", "The name that contains all names, before which fire is quenched and the rulers fall."]],
  },
  147: {
    themes: [["reincarnation", "The righteous soul without the mysteries is given a cup of wisdom so that in its next body it seeks them."]],
  },
  148: {
    themes: [["fate-and-free-will", "Souls sent into the world when Zeus and Aphrodite face the Virgin of Light will be good and find the mysteries."]],
  },
};

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "bl-add-ms-5114",
    name: "London, British Library, Add MS 5114 (the Codex Askew, or Askewianus)",
    objectKind: "codex",
    holdingInstitution: "British Library",
    accessionNumber: "Add MS 5114",
    startYear: 300,
    endYear: 500,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "fourth or fifth century (disputed)",
    datingEvidence:
      "Disputed, on Coptic palaeography. Mead's introduction (1921) reports that the general view assigns it with Schmidt to the fifth century, that Woide assigned it to the fourth and Crum seemed to agree, and that others proposed the sixth or seventh. The span covers the fourth- and fifth-century views and is not a finding.",
    sourceKey: "mead-pistis",
    notes:
      "Parchment, 178 leaves in two columns, in Sahidic Coptic, written by two scribes; eight leaves are missing (after chapter 143). Bought by the British Museum from the heirs of the physician Anthony Askew in 1785. All as Mead's introduction describes it; not checked against the library's catalogue.",
  },
];

const DATES: CorpusPassageDate[] = [
  {
    key: "composition",
    role: "composition",
    startYear: 200,
    endYear: 300,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "third century CE (disputed)",
    evidence:
      "Disputed. Mead's introduction (1921) reports Harnack's dating of the composition to the second half of the third century, on its use of scripture and its doctrine; Schmidt's acceptance of it with the last division placed earlier, in the first half; and Legge's return to the second century. The span is the usual third-century view, not a finding. The Coptic is a translation from Greek.",
    sourceKey: "mead-pistis",
  },
  {
    key: "manuscript",
    role: "manuscript",
    startYear: 300,
    endYear: 500,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "Codex Askew (Add MS 5114), fourth or fifth century (disputed)",
    evidence:
      "The only manuscript. Its date rests on Coptic palaeography: Woide put it in the fourth century and Crum seemed to agree; the general view in 1921, after Schmidt, was the fifth (Mead's introduction). The span covers both.",
    sourceKey: "mead-pistis",
  },
  {
    key: "translation-1896",
    role: "translation_publication",
    startYear: 1896,
    endYear: 1896,
    datePrecision: "year",
    isApproximate: false,
    originalDateText: "1896",
    evidence: "Mead's first edition of the English translation, as his preface to the 1921 edition recalls ('A quarter of a century has rolled away').",
    sourceKey: "mead-pistis",
  },
  {
    key: "translation-1921",
    role: "translation_publication",
    startYear: 1921,
    endYear: 1921,
    datePrecision: "year",
    isApproximate: false,
    originalDateText: "1921",
    evidence: "Mead's revised second edition, the text used here; his preface is dated July 1921.",
    sourceKey: "mead-pistis",
  },
];

type Placed = CorpusImage & { passageKey?: string };

const IMAGES: Placed[] = [
  {
    key: "pistis-sophia-askew-portrait-ramsay",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/30/Allan_Ramsay_%281713-1784%29_-_Anthony_Askew_-_ECP_29_-_Emmanuel_College.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Allan_Ramsay_(1713-1784)_-_Anthony_Askew_-_ECP_29_-_Emmanuel_College.jpg",
    institution: "Emmanuel College, University of Cambridge",
    accessionNumber: "ECP 29",
    objectDate: "1750",
    caption:
      "Anthony Askew (1722–1774), physician and collector, painted by Allan Ramsay, standing beside a book open at the Greek title of Hippocrates' On Humours. Askew bought the Coptic codex of the Pistis Sophia from a bookseller, and it is named after him; the British Museum bought it from his heirs in 1785. Context for the manuscript's history, not evidence for the text.",
    creator: "Allan Ramsay",
    credit: "Emmanuel College, Cambridge, via Art UK and Wikimedia Commons",
    licence: "Public domain (Public Domain Mark 1.0)",
    licenceStatus: "open",
    shows: "portrait",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "pistis-sophia-related-books-of-jeu-diagram",
    passageKey: `${PREFIX}.99`,
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Magical_Diagram_from_Books_of_Jeu_1.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Magical_Diagram_from_Books_of_Jeu_1.jpg",
    objectDate: "Before 350 CE (as the Commons record gives it)",
    caption:
      "UNVERIFIED — A page from the Books of Jeu, the Coptic work in the Bruce Codex: a column of magical names, a square diagram of nested enclosures with the name ΙΕΟΥ, a circle divided in six, and lines of Coptic, all in printed type. Chapter 99 of the Pistis Sophia sends the reader to 'the two Books of Yew' for the lower mysteries. Related evidence; the Bruce Codex is a different manuscript from the Codex Askew.",
    creator: "Unknown",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-1923, as the Commons record states)",
    licenceStatus: "open",
    shows: "diagram",
    identificationStatus: "unverified",
    whatIsUnverified:
      "Which edition this printed reproduction comes from, and which page of the Bruce Codex it reproduces: the Commons record names no author or edition and gives only a website as source. That it shows the Books of Jeu is the record's title, consistent with the name ΙΕΟΥ in the diagram but not checked against the codex. Whether the 'two Books of Yew' of the Pistis Sophia are these books is itself debated.",
    verificationStatus: "unverified",
  },
];

function imagesFor(passageKey: string): CorpusImage[] | undefined {
  const found = IMAGES.filter((image) => image.passageKey === passageKey).map((image) => {
    const copy: Placed = { ...image };
    delete copy.passageKey;
    return copy;
  });
  return found.length > 0 ? found : undefined;
}

/** Split a long chapter into parts of whole paragraphs; a chapter of up to `over` characters stays whole. */
export function splitChapter(paragraphs: string[], over = 6000, size = 4500): string[][] {
  const total = paragraphs.join("\n\n").length;
  if (total <= over) return [paragraphs];
  const parts = Math.ceil(total / size);
  const target = total / parts;
  const out: string[][] = [[]];
  let done = 0;
  for (const paragraph of paragraphs) {
    const current = out[out.length - 1];
    if (current.length > 0 && done + paragraph.length / 2 > target * out.length && out.length < parts) out.push([paragraph]);
    else current.push(paragraph);
    done += paragraph.length + 2;
  }
  return out;
}

const quoteList = (items: string[]) => items.map((item) => `“${item.replace(/\.$/, "")}”`).join("; ");

function buildPassages(): CorpusPassage[] {
  const passages: CorpusPassage[] = [];
  for (const book of BOOKS) {
    const bookKey = `${PREFIX}.${book.key}`;
    passages.push({
      key: bookKey,
      divisionKind: book.divisionKind,
      label: book.heading,
      reference: `Mead 1921, ${book.heading} (chapters ${book.first === book.last ? book.first : `${book.first}–${book.last}`})`,
      sourceKey: "mead-pistis",
      summary: book.summary,
      verificationStatus: "unverified",
      notes:
        book.key === "book-1" || book.key === "book-2"
          ? "Mead's heading. The codex itself heads only the second division, 'The Second Book of Pistis Sophia', in a later hand, which Mead calls a blundering heading made two-thirds of the way through the Sophia episode."
          : "Mead's heading, marking a change of subject; the codex has no heading here.",
      layers: [],
    });
    for (const [chapter, , paragraphs, sideHeadings] of PISTIS_SOPHIA_CHAPTERS.filter(([n]) => n >= book.first && n <= book.last)) {
      const known = CHAPTERS[chapter];
      const key = `${PREFIX}.${chapter}`;
      const parts = splitChapter(paragraphs);
      const notes = [
        sideHeadings.length ? `Mead's side-headings: ${quoteList(sideHeadings)}.` : undefined,
        known?.notes,
        parts.length > 1 ? `Split here into ${parts.length} parts of whole paragraphs for reading; the division is the archive's, not Mead's.` : undefined,
      ].filter(Boolean);
      passages.push({
        key,
        parentKey: bookKey,
        divisionKind: "chapter",
        label: `Pistis Sophia, chapter ${chapter}`,
        reference: `Pistis Sophia ${chapter} (Schmidt's and Mead's chapter ${chapter}; Mead 1921, ${book.heading})`,
        sourceKey: "mead-pistis",
        verificationStatus: "unverified",
        notes: notes.length ? notes.join(" ") : undefined,
        layers: [...(parts.length === 1 ? [englishLayer(paragraphs.join("\n\n"))] : []), modernLayer(chapter)],
        witnesses: [{ manuscriptKey: "bl-add-ms-5114" }],
        dates: chapter === 1 ? DATES : undefined,
        themes: known?.themes?.map(([themeKey, note]) => ({ themeKey, note })),
        images: imagesFor(key),
      });
      if (parts.length > 1) {
        parts.forEach((part, i) => {
          passages.push({
            key: `${key}.${i + 1}`,
            parentKey: key,
            divisionKind: "section",
            label: `Pistis Sophia, chapter ${chapter}, part ${i + 1} of ${parts.length}`,
            reference: `Pistis Sophia ${chapter}, part ${i + 1} (the archive's division of Mead's chapter)`,
            sourceKey: "mead-pistis",
            verificationStatus: "unverified",
            layers: [englishLayer(part.join("\n\n"))],
          });
        });
      }
      for (const extra of EXTRAS.filter((e) => e.after === chapter)) {
        const all = PISTIS_SOPHIA_EXTRAS[extra.key];
        const side = all.filter((p) => EXTRA_SIDE_HEADINGS.has(p));
        const text = all.filter((p) => !EXTRA_SIDE_HEADINGS.has(p));
        passages.push({
          key: `${PREFIX}.${extra.key}`,
          parentKey: bookKey,
          divisionKind: "section",
          label: extra.label,
          reference: `Mead 1921, after chapter ${extra.after}`,
          sourceKey: "mead-pistis",
          summary: extra.summary,
          verificationStatus: "unverified",
          notes: [side.length ? `Mead's side-heading: ${quoteList(side)}.` : undefined, extra.notes].filter(Boolean).join(" "),
          layers: [englishLayer(text.join("\n\n"))],
          witnesses: [{ manuscriptKey: "bl-add-ms-5114" }],
        });
      }
    }
  }
  return passages;
}

const PASSAGES = buildPassages();

/** The passage (a whole chapter or one of its parts) whose text contains the words. */
function passageWith(chapter: number, words: string): string {
  const found = PASSAGES.find((p) => (p.key === `${PREFIX}.${chapter}` || p.parentKey === `${PREFIX}.${chapter}`) && p.layers.some((l) => l.content?.includes(words)));
  if (!found) throw new Error(`Pistis Sophia ${chapter}: no passage contains "${words}"`);
  return found.key;
}

const LINKS: CorpusLink[] = [
  {
    key: "ps-36-peter-mary-thom-114",
    from: passageWith(36, "we will not endure this woman"),
    to: "gnostic.thom.114",
    connectionClass: "close_conceptual_parallel",
    similarities:
      "Peter objects to Mary among the disciples: 'My Lord, we will not endure this woman, for she taketh the opportunity from us', and in Thomas 'Mary should leave us, because women are not worthy of life'. In both Jesus answers for her.",
    differences:
      "In the Pistis Sophia Peter's complaint is that Mary speaks too much, and Jesus lets whoever is moved by the Spirit come forward; in Thomas Peter would exclude her as a woman, and Jesus promises to make her male.",
    wordingComparable: "no",
    meaningComparable: "partly",
    transmissionEvidence:
      "A rivalry between Peter and Mary Magdalene recurs in several Christian writings of the second and third centuries; no direct dependence between these two is shown.",
    reviewStatus: "proposed",
  },
  {
    key: "ps-72-peter-hateth-our-sex-thom-114",
    from: passageWith(72, "hateth our sex"),
    to: "gnostic.thom.114",
    connectionClass: "close_conceptual_parallel",
    similarities: "Mary says she is afraid of Peter, 'because he threatened me and hateth our sex': the same hostility of Peter towards Mary, as a woman, that Thomas 114 puts in his mouth.",
    differences: "Here the hostility is reported by Mary, and Jesus answers that anyone filled with the Spirit may come forward and speak; in Thomas Jesus answers by promising to make Mary male.",
    wordingComparable: "no",
    meaningComparable: "partly",
    transmissionEvidence: "A recurring theme in early Christian writings; no direct dependence between these two is shown.",
    reviewStatus: "proposed",
  },
];

export const PISTIS_SOPHIA_CORPUS: TextCorpusFile = {
  workKey: "gnostic.pistis-sophia",
  revision: "mead-2026-10",
  sources: SOURCES,
  manuscripts: MANUSCRIPTS,
  images: IMAGES.filter((image) => image.passageKey == null).map((image) => {
    const copy: Placed = { ...image };
    delete copy.passageKey;
    return copy;
  }),
  passages: PASSAGES,
  links: LINKS,
};
