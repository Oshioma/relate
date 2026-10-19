// THE GOSPEL OF THOMAS: THE PROLOGUE AND 114 SAYINGS OF THE COPTIC TEXT, WITH
// THE THREE GREEK PAPYRI KEPT AS SEPARATE VERSIONS.
//
// The only complete copy is the Coptic of Nag Hammadi Codex II (pp. 32–51),
// copied in the fourth century. Parts of three Greek copies, a century or more
// older, were found at Oxyrhynchus and published by Grenfell and Hunt before
// anyone knew which work they belonged to: P. Oxy. 1 (1897), 654 and 655
// (1904).
//
// WHAT IS REPRODUCED, AND WHY.
// - The Coptic is ancient, but it is NOT reproduced: every transcription that
//   could be found is in copyright or on restrictive terms (Layton 1989,
//   Guillaumont et al. 1959), and the online ones could not be reached. Each
//   saying cites it, and the photographs of the codex pages on Wikimedia
//   Commons are attached, page by page.
// - Every complete English translation of the Coptic is in copyright and is
//   cited only (Lambdin in Layton 1989 and Robinson's Nag Hammadi Library,
//   Guillaumont et al. 1959, Meyer 2007, DeConick 2007).
// - Grenfell and Hunt's English of the papyri (New Sayings of Jesus, 1904) is
//   public domain and is given in full, with their uncertain supplements in
//   round brackets, as they print them. Their Greek is public domain too, but
//   only the six logia of P. Oxy. 1 that could be read from page images of
//   their 1897 first edition are given (with its square-bracket restorations);
//   the Greek of P. Oxy. 654, 655 and logia 4 and 8 of P. Oxy. 1 is cited, not
//   yet transcribed, because the page images could not be fetched and the OCR
//   of their Greek is unusable.
// - The plain-English version of every Coptic saying is the archive's own
//   translation (corpus/plain/gospel-of-thomas.ts), labelled as ours.
//
// PAGES. Each saying is placed on the codex page where it begins. For pp. 32,
// 33 and 51 this was read from the Commons photographs, which carry saying
// numbers in the margin added by the maker of the scans (metalog.org). For
// pp. 34–50 the photographs could not be fetched (Wikimedia rate limits), so
// the page breaks follow the standard page-and-line references of the
// editions as known to the writer, NOT checked against the photographs or an
// edition: each such passage says so. Line numbers are not given.
//
// Nothing here is marked verified: the Greek was transcribed for this archive
// from page images, the English from OCR of the Internet Archive scans, and
// neither has been checked by a specialist.

import type { SeedSource } from "../../seed-types";
import type {
  CorpusImage,
  CorpusLayer,
  CorpusLink,
  CorpusManuscript,
  CorpusPassage,
  CorpusPassageDate,
  TextCorpusFile,
} from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { THOMAS_RELATED_IMAGES } from "./gospel-of-thomas-related-images";

const PREFIX = "gnostic.thom";

const SOURCES: SeedSource[] = [
  ...INVENTORY_SOURCES.filter((s) =>
    [
      "gh-logia-1897",
      "gh-new-sayings-1904",
      "gh-oxy-iv-1904",
      "layton-nhc-ii-1989",
      "guillaumont-1959",
      "facsimile-nhc-ii",
      "meyer-nhs-2007",
      "deconick-thomas-2007",
      "robinson-nhl",
    ].includes(s.key)
  ),
  {
    key: "wikipedia-oxyrhynchus-thomas",
    title: "Papyrus Oxyrhynchus 1; Papyrus Oxyrhynchus 654; Papyrus Oxyrhynchus 655",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Papyrus_Oxyrhynchus_654",
    sourceType: "wikipedia",
    notes:
      "Cited only for where the three papyri are now kept and their inventory numbers, and for later palaeographic dates (citing Hurtado 2006 and Plisch 2007). Read 18 October 2026; not checked against the libraries' catalogues.",
  },
];

// ---------------------------------------------------------------------------
// WITNESSES
// ---------------------------------------------------------------------------

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "nhc-ii",
    name: "Nag Hammadi Codex II",
    objectKind: "codex",
    holdingInstitution: "Coptic Museum, Cairo",
    findspot: "Near Nag Hammadi, Upper Egypt (found 1945)",
    startYear: 340,
    endYear: 400,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "fourth century CE",
    datingEvidence:
      "The Nag Hammadi codices are dated together by letters and receipts reused in the binding of Codex VII, the latest of the 340s CE; Codex II is dated with the rest of the find, not by a dated document of its own, as far as this archive has established.",
    sourceKey: "robinson-nhl",
    notes:
      "A papyrus codex of seven tractates in Coptic. The Gospel of Thomas is the second (II,2): it begins on p. 32, after the end of the Apocryphon of John, and ends on p. 51 with its title, followed by the Gospel of Philip.",
  },
  {
    key: "poxy-1",
    siglum: "P. Oxy. 1",
    name: "P. Oxy. 1, a leaf of a papyrus codex (Oxford, Bodleian Library, MS. Gr. th. e. 7 (P))",
    objectKind: "papyrus",
    holdingInstitution: "Bodleian Library, Oxford",
    accessionNumber: "MS. Gr. th. e. 7 (P)",
    findspot: "Oxyrhynchus (el-Bahnasa), Egypt (found 1897)",
    startYear: 150,
    endYear: 300,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "'probably written not much later than the year 200' (Grenfell and Hunt 1897)",
    datingEvidence:
      "Grenfell and Hunt dated it by its handwriting and by the second- and third-century papyri found with it, to 150–300 CE and probably about 200 (Logia Iesou, p. 6). Later palaeographers place it in the first half of the third century (as reported on the English Wikipedia).",
    sourceKey: "gh-logia-1897",
    notes:
      "A single leaf, numbered 11 (ΙΑ) on the verso, with sayings 26–33 (and 77b) on its two sides. Holding and shelfmark as given on the English Wikipedia; not checked against the Bodleian's catalogue.",
  },
  {
    key: "poxy-654",
    siglum: "P. Oxy. 654",
    name: "P. Oxy. 654, written on the back of a land-survey roll (London, British Library, Papyrus 1531)",
    objectKind: "papyrus",
    holdingInstitution: "British Library, London",
    accessionNumber: "Papyrus 1531",
    findspot: "Oxyrhynchus (el-Bahnasa), Egypt (found 1903)",
    startYear: 250,
    endYear: 300,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "'the middle or end of the third century; a later date than A.D. 300 is most unlikely' (Grenfell and Hunt 1904)",
    datingEvidence:
      "Grenfell and Hunt dated the sayings by their hand, after the survey-list on the other side, which they put at the end of the second or early third century (New Sayings of Jesus, pp. 9–10).",
    sourceKey: "gh-new-sayings-1904",
    notes: "Forty-two broken lines: the prologue and sayings 1–7. Holding and number as given on the English Wikipedia and on the Commons record of the British Library's photograph; not checked against the British Library's catalogue.",
  },
  {
    key: "poxy-655",
    siglum: "P. Oxy. 655",
    name: "P. Oxy. 655, eight fragments of a papyrus roll (Cambridge, Mass., Harvard University, Houghton Library, SM Inv. 4367)",
    objectKind: "papyrus",
    holdingInstitution: "Houghton Library, Harvard University",
    accessionNumber: "SM Inv. 4367",
    findspot: "Oxyrhynchus (el-Bahnasa), Egypt (found 1903)",
    startYear: 200,
    endYear: 250,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "not second century, and 'not likely to have been written later than A.D. 250' (Grenfell and Hunt 1904)",
    datingEvidence:
      "Grenfell and Hunt dated it by its hand, a small sloping oval uncial of the third century, early rather than late (New Sayings of Jesus, p. 39).",
    sourceKey: "gh-new-sayings-1904",
    notes: "Parts of two columns: sayings 36–39 by the modern identification. Holding and number as given on the English Wikipedia; not checked against Harvard's catalogue.",
  },
];

// ---------------------------------------------------------------------------
// WHERE EACH SAYING BEGINS IN THE CODEX
// ---------------------------------------------------------------------------

/**
 * The first saying that begins on each page of NHC II. Page 32 begins with
 * the prologue (saying "0" here); the title follows saying 114 on p. 51.
 * Pages 32, 33 and 51 were read from the Commons photographs; the others are
 * unchecked (see the header).
 */
const PAGES_CHECKED = new Set([32, 33, 51]);

const PAGE_STARTS: [page: number, firstSaying: number][] = [
  [32, 0],
  [33, 4],
  [34, 9],
  [35, 14],
  [36, 17],
  [37, 22],
  [38, 23],
  [39, 30],
  [40, 38],
  [41, 46],
  [42, 51],
  [43, 58],
  [44, 63],
  [45, 65],
  [46, 72],
  [47, 79],
  [48, 87],
  [49, 96],
  [50, 102],
  [51, 110],
];

function pageOf(saying: number): number {
  let page = PAGE_STARTS[0][0];
  for (const [p, first] of PAGE_STARTS) if (saying >= first) page = p;
  return page;
}

// ---------------------------------------------------------------------------
// PICTURES
// ---------------------------------------------------------------------------

type Placed = CorpusImage & { passageKey?: string; manuscriptKey?: string };

const commonsFile = (name: string, path: string): Pick<CorpusImage, "url" | "sourcePageUrl"> => ({
  url: `https://upload.wikimedia.org/wikipedia/commons/${path}/${encodeURIComponent(name.replace(/ /g, "_"))}`,
  sourcePageUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name.replace(/ /g, "_"))}`,
});

/** Commons hash directories of the page photographs, pp. 32–51. */
const PAGE_PATHS: Record<number, string> = {
  32: "1/11",
  33: "a/a3",
  34: "4/48",
  35: "8/8d",
  36: "f/f0",
  37: "e/ec",
  38: "d/d0",
  39: "c/cb",
  40: "8/81",
  41: "5/5e",
  42: "a/ad",
  43: "5/50",
  44: "3/3a",
  45: "a/ac",
  46: "d/d5",
  47: "9/91",
  48: "1/15",
  49: "b/be",
  50: "a/af",
  51: "a/ae",
};

function pagePicture(page: number): Placed {
  const first = PAGE_STARTS.find(([p]) => p === page)?.[1] ?? 0;
  const next = PAGE_STARTS.find(([p]) => p === page + 1);
  const last = next ? next[1] - 1 : 114;
  const what =
    page === 32
      ? "the beginning of the Gospel of Thomas: the prologue and sayings 1–3, below the end of the Apocryphon of John"
      : page === 51
        ? "the end of the Gospel of Thomas, sayings 110–114, its title, 'The Gospel according to Thomas', and the beginning of the Gospel of Philip"
        : first === last
          ? `saying ${first}, with the end of the one before`
          : `sayings ${first}–${last}, with the end of the one before`;
  return {
    key: `nhc-ii-p${page}-thomas`,
    passageKey: page === 32 ? `${PREFIX}.prologue` : page === 51 ? `${PREFIX}.title` : `${PREFIX}.${first}`,
    manuscriptKey: "nhc-ii",
    ...commonsFile(`Gospel of Thomas - Nag Hammadi II-${page}.jpg`, PAGE_PATHS[page]),
    institution: "Coptic Museum, Cairo",
    accessionNumber: `Nag Hammadi Codex II, p. ${page}`,
    objectDate: "Fourth century CE",
    caption: `Page ${page} of Nag Hammadi Codex II, in Coptic: ${what}${PAGES_CHECKED.has(page) ? "" : " (which sayings fall on this page has not been checked against the photograph)"}. The saying numbers in the margin and the page number above were added by the maker of the scan, not by the scribe.`,
    creator: "Unknown scribe",
    credit: "Coptic Museum, Cairo; scan from metalog.org, via Wikimedia Commons",
    licence: "Public domain (PD-old-100, PD-US-expired), as claimed on Commons",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  };
}

const IMAGES: Placed[] = [
  ...PAGE_STARTS.map(([page]) => pagePicture(page)),
  {
    key: "poxy654-bl-verso",
    passageKey: `${PREFIX}.poxy654`,
    manuscriptKey: "poxy-654",
    ...commonsFile("Preface and Sayings of Jesus - Gospel of Thomas (3rd C), verso - BL Papyrus 1531.jpg", "e/ec"),
    institution: "British Library, London",
    accessionNumber: "Papyrus 1531, verso",
    objectDate: "Third century CE (the British Library: latter part of the third century)",
    caption:
      "P. Oxy. 654, the Greek fragment with the prologue and sayings 1–7 of the Gospel of Thomas, written on the back of a land-survey roll: the British Library's own photograph of Papyrus 1531, verso.",
    creator: "Unknown scribe",
    credit: "British Library, via Wikimedia Commons",
    licence: "CC0 1.0, released by the British Library (as stated on Commons)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "poxy654-commons",
    passageKey: `${PREFIX}.poxy654.intro`,
    manuscriptKey: "poxy-654",
    ...commonsFile("P. Oxy. 654.jpg", "d/d6"),
    institution: "British Library, London",
    accessionNumber: "Papyrus 1531",
    objectDate: "Third century CE",
    caption:
      "P. Oxy. 654, the whole fragment: its first line reads ΟΙ ΤΟΙΟΙ ΟΙ ΛΟΓΟΙ ('these are the words'), the opening of the prologue, and saying 1 follows. Commons gives the British Library's online gallery as the source, so this is probably another copy of the photograph above.",
    creator: "Unknown scribe",
    credit: "Wikimedia Commons (source given as the British Library online gallery)",
    licence: "Public domain (PD-Art), as claimed on Commons",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
    duplicateOf: "poxy654-bl-verso",
  },
  {
    key: "poxy1-verso",
    passageKey: `${PREFIX}.poxy1`,
    manuscriptKey: "poxy-1",
    ...commonsFile("P. Oxy. 1.jpg", "1/19"),
    institution: "Bodleian Library, Oxford",
    accessionNumber: "MS. Gr. th. e. 7 (P)",
    objectDate: "c. 200 CE (Grenfell and Hunt: 150–300)",
    caption:
      "P. Oxy. 1, the side with the page number ΙΑ (11) at the top right and sayings 26–29 of the Coptic numbering (logia 1–4 of the first editors): its first line begins ΚΑΙ ΤΟΤΕ ΔΙΑΒΛΕΨΕΙΣ ('and then you will see clearly'). Grenfell and Hunt call this side the verso; Commons calls it the recto.",
    creator: "Unknown scribe",
    credit: "Wikimedia Commons",
    licence: "Public domain in the United States (PD-US), as claimed on Commons",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "poxy655-plate",
    passageKey: `${PREFIX}.poxy655`,
    manuscriptKey: "poxy-655",
    ...commonsFile("P. Oxy. 655.jpg", "4/4d"),
    institution: "Houghton Library, Harvard University",
    accessionNumber: "SM Inv. 4367",
    objectDate: "Early third century CE",
    caption:
      "P. Oxy. 655: a printed photographic plate of the fragments, labelled 'No. 655', apparently from Grenfell and Hunt's edition. The largest piece holds parts of two columns (sayings 36–39 in the Coptic numbering); the smaller pieces are arranged around it.",
    creator: "Unknown scribe",
    credit: "Wikimedia Commons",
    licence: "Public domain (PD-Art, PD-old-100-expired), as claimed on Commons",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  ...THOMAS_RELATED_IMAGES,
];

function imagesFor(test: (image: Placed) => boolean): CorpusImage[] | undefined {
  const found = IMAGES.filter(test).map((image) => {
    const copy: Placed = { ...image };
    delete copy.passageKey;
    delete copy.manuscriptKey;
    return copy;
  });
  return found.length > 0 ? found : undefined;
}

// ---------------------------------------------------------------------------
// THE COPTIC SAYINGS
// ---------------------------------------------------------------------------

const COPTIC_ABSENT =
  "Not reproduced. The Coptic is ancient and in the public domain, but no transcription of it free of copyright or restrictive terms could be obtained for this archive: the critical editions (Layton 1989; Guillaumont et al. 1959) are in copyright, and the online transcriptions could not be reached or are offered on restrictive terms.";

function copticLayer(where: string): CorpusLayer {
  return {
    key: "cop-nhc-ii",
    layer: "primary_text",
    sourceKey: "layton-nhc-ii-1989",
    contentAbsentReason: `${COPTIC_ABSENT} Read it in the photograph of ${where} attached to this work, in the Facsimile Edition of Codex II (1974), or in Layton's edition (1989).`,
    language: "Coptic",
    licence: "public_domain",
    evidence: "The Sahidic Coptic of Nag Hammadi Codex II, the only complete copy of the Gospel of Thomas, translated in antiquity from a Greek original.",
  };
}

/** The four complete English translations, cited and never quoted. */
function referenceLayers(unit: string): CorpusLayer[] {
  const cite = (key: string, sourceKey: string, where: string): CorpusLayer => ({
    key,
    layer: "translation",
    sourceKey,
    contentAbsentReason: `In copyright, cited only: ${where}, ${unit}.`,
    language: "English",
    licence: "copyrighted_reference",
    evidence: "No public-domain English translation of the Coptic Gospel of Thomas exists; the plain-English version here is the archive's own.",
  });
  return [
    cite(
      "eng-lambdin",
      "layton-nhc-ii-1989",
      "Thomas O. Lambdin's translation in Layton (ed.), Nag Hammadi Codex II,2–7 (1989), also printed in Robinson (ed.), The Nag Hammadi Library in English (1977 and later editions)"
    ),
    cite("eng-guillaumont", "guillaumont-1959", "the translation in Guillaumont et al., The Gospel According to Thomas (1959)"),
    cite("eng-meyer", "meyer-nhs-2007", "Marvin Meyer's translation in The Nag Hammadi Scriptures (2007)"),
    cite("eng-deconick", "deconick-thomas-2007", "April DeConick, The Original Gospel of Thomas in Translation (2007)"),
  ];
}

/** Which Greek papyrus, if any, preserves part of a saying. */
const GREEK_FOR: Record<number, string> = {
  1: "poxy654.intro",
  2: "poxy654.saying-1",
  3: "poxy654.saying-2",
  4: "poxy654.saying-3",
  5: "poxy654.saying-4",
  6: "poxy654.saying-5",
  7: "poxy654.saying-5",
  26: "poxy1.logion-1",
  27: "poxy1.logion-2",
  28: "poxy1.logion-3",
  29: "poxy1.logion-4",
  30: "poxy1.logion-5",
  31: "poxy1.logion-6",
  32: "poxy1.logion-7",
  33: "poxy1.logion-8",
  36: "poxy655.lines-1-23",
  37: "poxy655.lines-1-23",
  39: "poxy655.lines-41-46",
  77: "poxy1.logion-5",
};

/** Themes, for navigation only; each says why. */
const THEMES: Record<string, [string, string][]> = {
  prologue: [["divine-knowledge", "Sayings called 'hidden', spoken by 'the living Jesus' and written down by Thomas."]],
  1: [
    ["divine-knowledge", "Finding what the sayings mean is the point of the collection."],
    ["immortality", "Whoever finds their meaning 'will not taste death'."],
  ],
  2: [["divine-knowledge", "Seeking, finding, being troubled, amazed, and ruling."]],
  3: [
    ["divine-knowledge", "Knowing oneself as a child of the living Father."],
    ["consciousness", "The kingdom is inside you and outside you."],
  ],
  13: [["divine-knowledge", "Three things told to Thomas alone, too dangerous to repeat."]],
  18: [
    ["creation", "Where the beginning is, the end will be."],
    ["immortality", "Whoever stands at the beginning will not taste death."],
  ],
  19: [["immortality", "Five trees in paradise; whoever knows them will not taste death."]],
  22: [["transformation", "Making the two into one, male and female into a single one."]],
  24: [["consciousness", "The light within a person of light lights the whole world."]],
  28: [["consciousness", "Humanity drunk and blind in its heart."]],
  29: [["the-soul", "Spirit at home in the poverty of the body."]],
  37: [["initiation", "Stripping without shame and treading on the clothes, often read as an image of baptism; the saying names no rite."]],
  50: [["ascension", "Answers to give to those who ask where you come from — often read as words for the soul's ascent; the saying does not say who asks."]],
  51: [["death-and-rebirth", "The rest of the dead and the new world have already come."]],
  62: [["divine-knowledge", "Mysteries told only to those worthy of them."]],
  77: [["creation", "Everything came out from the speaker, and everything has reached him."]],
  83: [["the-soul", "Images, light, and the image of the Father's light."]],
  84: [["the-soul", "Images that came into being before you, which neither die nor appear."]],
  85: [["creation", "Adam came from a great power and great wealth."]],
  87: [["the-soul", "The body that depends on a body, and the soul that depends on both."]],
  106: [["transformation", "Making the two into one."]],
  108: [["transformation", "Whoever drinks from his mouth becomes like him."]],
  111: [["immortality", "Whoever lives from the living one will not see death."]],
  112: [["the-soul", "Flesh and soul, each depending on the other."]],
  114: [["transformation", "'Every woman who makes herself male' — a change generally read as spiritual."]],
};

const themesFor = (key: string | number) => THEMES[key]?.map(([themeKey, note]) => ({ themeKey, note }));

/** Notes on particular sayings. */
const SAYING_NOTES: Record<number, string> = {
  27: "The Coptic has no 'Jesus said' before this saying.",
  30: "The Coptic of sayings 30 and 77 is split differently in the Greek: P. Oxy. 1 has the end of saying 77 ('Lift the stone … split the wood …') as the end of saying 30.",
  77: "In the Greek of P. Oxy. 1 the last two sentences ('split a piece of wood … lift up the stone …') follow saying 30 instead.",
  114: "The last saying. The title follows it on p. 51.",
};

function sayingPassage(n: number): CorpusPassage {
  const key = `${PREFIX}.${n}`;
  const page = pageOf(n);
  const greek = GREEK_FOR[n];
  const notes = [
    SAYING_NOTES[n],
    greek ? `Part of this saying also survives in Greek: see ${PREFIX}.${greek}.` : undefined,
    PAGES_CHECKED.has(page)
      ? `Begins on p. ${page} of the codex, as the margin numbers of the Commons photograph show; line numbers not checked here.`
      : `Begins on p. ${page} of the codex, by the editions' page references as known to this archive; NOT checked against the photograph or an edition.`,
  ].filter(Boolean);
  return {
    key,
    divisionKind: "saying",
    label: `Saying ${n}`,
    reference: `Gospel of Thomas, saying ${n}; Nag Hammadi Codex II, begins p. ${page}`,
    sourceKey: "layton-nhc-ii-1989",
    objectName: "Nag Hammadi Codex II",
    holdingInstitution: "Coptic Museum, Cairo",
    verificationStatus: "unverified",
    notes: notes.join(" "),
    layers: [copticLayer(`p. ${page}`), ...referenceLayers(`saying ${n}`)],
    witnesses: [{ manuscriptKey: "nhc-ii", locus: `begins p. ${page}` }],
    themes: themesFor(n),
    images: imagesFor((image) => image.passageKey === key),
  };
}

function copticPassages(): CorpusPassage[] {
  return [
    {
      key: `${PREFIX}.prologue`,
      divisionKind: "section",
      label: "Prologue",
      reference: "Gospel of Thomas, prologue (incipit); Nag Hammadi Codex II, p. 32",
      sourceKey: "layton-nhc-ii-1989",
      objectName: "Nag Hammadi Codex II",
      holdingInstitution: "Coptic Museum, Cairo",
      summary: "The opening line of the collection, naming the sayings as hidden, their speaker as 'the living Jesus' and their writer as Didymos Judas Thomas.",
      verificationStatus: "unverified",
      notes: `Not counted among the 114 sayings; some editions number it 0. Part of it also survives in Greek: see ${PREFIX}.poxy654.intro.`,
      layers: [copticLayer("p. 32"), ...referenceLayers("the prologue")],
      witnesses: [{ manuscriptKey: "nhc-ii", locus: "p. 32" }],
      themes: themesFor("prologue"),
      images: imagesFor((image) => image.passageKey === `${PREFIX}.prologue`),
    },
    ...Array.from({ length: 114 }, (_, i) => sayingPassage(i + 1)),
    {
      key: `${PREFIX}.title`,
      divisionKind: "section",
      label: "Title",
      reference: "Gospel of Thomas, title at the end; Nag Hammadi Codex II, p. 51",
      sourceKey: "layton-nhc-ii-1989",
      objectName: "Nag Hammadi Codex II",
      holdingInstitution: "Coptic Museum, Cairo",
      summary: "The title, written after the last saying and set off by a line of ornament, as titles are in these codices.",
      verificationStatus: "unverified",
      notes: "Not counted among the 114 sayings. The Gospel of Philip begins immediately below it on the same page.",
      layers: [copticLayer("p. 51"), ...referenceLayers("the title")],
      witnesses: [{ manuscriptKey: "nhc-ii", locus: "p. 51" }],
      images: imagesFor((image) => image.passageKey === `${PREFIX}.title`),
    },
  ];
}

// ---------------------------------------------------------------------------
// THE GREEK PAPYRI
// ---------------------------------------------------------------------------

const GH_NOTE =
  "Square brackets enclose the editors' restorations of lost letters, and dots stand for lost or illegible letters, as they print them; their English puts uncertain supplements in round brackets, often with a question mark.";

type GreekUnit = {
  /** Key under the papyrus, e.g. 'saying-2'. */
  key: string;
  label: string;
  reference: string;
  /** Lines or side of the papyrus. */
  locus: string;
  /** The Coptic sayings it parallels. */
  sayings: (number | "prologue")[];
  /** The Greek, where it has been transcribed from a page image; otherwise why not. */
  greek: { text: string; sourceKey: string; evidence: string } | { absent: string };
  /** Grenfell and Hunt's English, New Sayings of Jesus (1904). */
  english: string;
  notes?: string;
};

type Papyrus = {
  key: "poxy654" | "poxy1" | "poxy655";
  manuscriptKey: string;
  label: string;
  reference: string;
  summary: string;
  notes: string;
  date: CorpusPassageDate;
  units: GreekUnit[];
};

function greekLayers(unit: GreekUnit): CorpusLayer[] {
  const greek: CorpusLayer =
    "text" in unit.greek
      ? {
          key: "grc-gh",
          layer: "primary_text",
          sourceKey: unit.greek.sourceKey,
          content: unit.greek.text,
          language: "Greek",
          licence: "public_domain",
          evidence: `${unit.greek.evidence} ${GH_NOTE}`,
        }
      : {
          key: "grc-gh",
          layer: "primary_text",
          sourceKey: "gh-new-sayings-1904",
          contentAbsentReason: unit.greek.absent,
          language: "Greek",
          licence: "public_domain",
          evidence: "Grenfell and Hunt's Greek text is public domain; it is cited here, not yet reproduced.",
        };
  return [
    greek,
    {
      key: "eng-gh",
      layer: "translation",
      sourceKey: "gh-new-sayings-1904",
      content: unit.english,
      language: "English",
      licence: "public_domain",
      evidence: `Grenfell and Hunt's translation, New Sayings of Jesus (1904), from the Internet Archive copy (newsayingsofjesu00greniala). ${GH_NOTE}`,
    },
  ];
}

const GREEK_NOT_YET = (where: string) =>
  `Not yet transcribed. Grenfell and Hunt's Greek is public domain, but the page images of their edition could not be fetched for this work (Wikimedia rate limits), and the machine-read text of their Greek in the Internet Archive copies is too garbled to use without them. Read it in ${where}.`;

/** P. Oxy. 1 as first printed (Logia Iesou, 1897), transcribed from the page images. */
const LOGIA_1897 = (logion: number) => ({
  sourceKey: "gh-logia-1897",
  evidence: `Grenfell and Hunt's first edition, Logia Iesou (1897), logion ${logion}, transcribed for this archive from the page images of the Wikimedia Commons scan of the Internet Archive copy (logiaiesousaying00gren). Their revised text (Oxyrhynchus Papyri I, 1898, reprinted in New Sayings of Jesus, 1904, pp. 37–38) differs in places; the English beside it is the revised translation.`,
});

const PAPYRI: Papyrus[] = [
  {
    key: "poxy654",
    manuscriptKey: "poxy-654",
    label: "Greek: P. Oxy. 654 (prologue and sayings 1–7)",
    reference: "P. Oxy. 654 (British Library, Papyrus 1531); Grenfell and Hunt, New Sayings of Jesus (1904), pp. 11–19",
    summary:
      "The opening of the collection in Greek: forty-two lines, broken down the left side, written on the back of a land-survey roll. Found in 1903 and published in 1904 as 'New Sayings of Jesus', before the Coptic text was known.",
    notes:
      "Grenfell and Hunt divided it into an introduction and five sayings; the modern identification makes it the prologue and sayings 1–7 of the Coptic. Their restorations were made without the Coptic, and several are now known to be wrong.",
    date: {
      key: "manuscript",
      role: "manuscript",
      startYear: 250,
      endYear: 300,
      datePrecision: "century",
      isApproximate: true,
      originalDateText: "'the middle or end of the third century; a later date than A.D. 300 is most unlikely'",
      evidence: "Grenfell and Hunt's dating of the hand (New Sayings of Jesus, pp. 9–10); the British Library's record, as given on Commons, says 'latter part of 3rd century'.",
      sourceKey: "gh-new-sayings-1904",
    },
    units: [
      {
        key: "intro",
        label: "Introduction (ll. 1–5)",
        reference: "P. Oxy. 654, ll. 1–5; New Sayings of Jesus, pp. 11–12",
        locus: "ll. 1–5",
        sayings: ["prologue", 1],
        greek: { absent: GREEK_NOT_YET("New Sayings of Jesus (1904), with the English, or Oxyrhynchus Papyri IV (1904), no. 654") },
        english:
          "These are the (wonderful?) words which Jesus the living (Lord) spake to . . . and Thomas, and he said unto (them), Every one that hearkens to these words shall never taste of death.",
        notes:
          "The editors could not tell who was named before Thomas. The Coptic prologue shows that the Greek named Thomas as the writer and that the 'words' were called hidden; the promise not to taste death is saying 1 of the Coptic.",
      },
      {
        key: "saying-1",
        label: "First saying (ll. 5–9)",
        reference: "P. Oxy. 654, ll. 5–9; New Sayings of Jesus, p. 13",
        locus: "ll. 5–9",
        sayings: [2],
        greek: { absent: GREEK_NOT_YET("New Sayings of Jesus (1904), with the English, or Oxyrhynchus Papyri IV (1904), no. 654") },
        english:
          "Jesus saith, Let not him who seeks . . . cease until he finds, and when he finds he shall be astonished; astonished he shall reach the kingdom, and having reached the kingdom he shall rest.",
        notes:
          "Grenfell and Hunt noted that Clement of Alexandria quotes the same saying (Stromateis ii.9.45, from the Gospel according to the Hebrews, and v.14.96).",
      },
      {
        key: "saying-2",
        label: "Second saying (ll. 9–21)",
        reference: "P. Oxy. 654, ll. 9–21; New Sayings of Jesus, pp. 15–16",
        locus: "ll. 9–21",
        sayings: [3],
        greek: { absent: GREEK_NOT_YET("New Sayings of Jesus (1904), with the English, or Oxyrhynchus Papyri IV (1904), no. 654") },
        english:
          "Jesus saith, (Ye ask? who are those) that draw us (to the kingdom, if) the kingdom is in Heaven? . . . the fowls of the air, and all beasts that are under the earth or upon the earth, and the fishes of the sea, (these are they which draw) you, and the kingdom of Heaven is within you; and whoever shall know himself shall find it. (Strive therefore?) to know yourselves, and ye shall be aware that ye are the sons of the (almighty?) Father; (and?) ye shall know that ye are in (the city of God?), and ye are (the city?).",
        notes:
          "In Oxyrhynchus Papyri IV (1904) the editors printed a more cautious English for the end: 'ye shall know yourselves . . . and ye are . . .'. The Coptic ends differently again (saying 3).",
      },
      {
        key: "saying-3",
        label: "Third saying (ll. 21–27)",
        reference: "P. Oxy. 654, ll. 21–27; New Sayings of Jesus, p. 18",
        locus: "ll. 21–27",
        sayings: [4],
        greek: { absent: GREEK_NOT_YET("New Sayings of Jesus (1904), with the English, or Oxyrhynchus Papyri IV (1904), no. 654") },
        english:
          "Jesus saith, A man shall not hesitate . . . to ask . . . concerning his place (in the kingdom. Ye shall know) that many that are first shall be last and the last first and (they shall have eternal life?).",
      },
      {
        key: "saying-4",
        label: "Fourth saying (ll. 27–31)",
        reference: "P. Oxy. 654, ll. 27–31; New Sayings of Jesus, p. 18",
        locus: "ll. 27–31",
        sayings: [5],
        greek: { absent: GREEK_NOT_YET("New Sayings of Jesus (1904), with the English, or Oxyrhynchus Papyri IV (1904), no. 654") },
        english:
          "Jesus saith, Everything that is not before thy face and that which is hidden from thee shall be revealed to thee. For there is nothing hidden which shall not be made manifest, nor buried which shall not be raised.",
      },
      {
        key: "saying-5",
        label: "Fifth saying (ll. 32–42)",
        reference: "P. Oxy. 654, ll. 32–42; New Sayings of Jesus, p. 19",
        locus: "ll. 32–42",
        sayings: [6, 7],
        greek: { absent: GREEK_NOT_YET("New Sayings of Jesus (1904), with the English, or Oxyrhynchus Papyri IV (1904), no. 654") },
        english:
          "His disciples question him and say, How shall we fast and how shall we (pray?) . . . and what (commandment) shall we keep . . . Jesus saith, . . . do not . . . of truth . . . blessed is he . . .",
        notes:
          "Grenfell and Hunt read these lines as one saying. By the Coptic they hold saying 6 and the beginning of saying 7 ('Blessed is the lion …').",
      },
    ],
  },
  {
    key: "poxy1",
    manuscriptKey: "poxy-1",
    label: "Greek: P. Oxy. 1 (sayings 26–33 and part of 77)",
    reference: "P. Oxy. 1 (Bodleian Library, MS. Gr. th. e. 7 (P)); Grenfell and Hunt, Logia Iesou (1897); New Sayings of Jesus (1904), pp. 37–38",
    summary:
      "A single leaf of a papyrus codex, numbered 11, found in 1897 and published that year as 'Logia Iesou: Sayings of Our Lord'. It was the first piece of the Gospel of Thomas to be found, half a century before the Coptic.",
    notes:
      "The Greek of logia 1–3 and 5–7 is the 1897 first edition, read from its page images; logia 4 and 8 were not transcribed. The English is the editors' revised translation of 1904, which differs from 1897 in logion 2 ('make the sabbath a real sabbath', 1897 'keep the sabbath'), logion 3 (adds 'and see not'), logion 5 (largely re-restored) and logion 8 (first read in 1898).",
    date: {
      key: "manuscript",
      role: "manuscript",
      startYear: 150,
      endYear: 300,
      datePrecision: "century",
      isApproximate: true,
      originalDateText: "'probably written not much later than the year 200'",
      evidence:
        "Grenfell and Hunt's dating by the hand and by the papyri found with it (Logia Iesou, 1897, p. 6). Later palaeographers place it in the first half of the third century, as reported on the English Wikipedia (citing Hurtado 2006 and Plisch 2007); not checked here.",
      sourceKey: "gh-logia-1897",
    },
    units: [
      {
        key: "logion-1",
        label: "Logion 1",
        reference: "P. Oxy. 1, verso, ll. 1–4; Logia Iesou (1897), logion 1",
        locus: "verso, top",
        sayings: [26],
        greek: {
          text: "] καὶ τότε διαβλέψεις ἐκβαλεῖν τὸ κάρφος τὸ ἐν τῷ ὀφθαλμῷ τοῦ ἀδελφοῦ σου.",
          ...LOGIA_1897(1),
        },
        english: ". . . and then shalt thou see clearly to cast out the mote that is in thy brother's eye.",
        notes: "The leaf begins in the middle of the saying; the first half (the beam in one's own eye) was on the lost page before.",
      },
      {
        key: "logion-2",
        label: "Logion 2",
        reference: "P. Oxy. 1, verso; Logia Iesou (1897), logion 2",
        locus: "verso",
        sayings: [27],
        greek: {
          text: "Λέγει Ἰησοῦς, ἐὰν μὴ νηστεύσητε τὸν κόσμον οὐ μὴ εὕρητε τὴν βασιλείαν τοῦ θεοῦ· καὶ ἐὰν μὴ σαββατίσητε τὸ σάββατον οὐκ ὄψεσθε τὸν πατέρα.",
          ...LOGIA_1897(2),
        },
        english:
          "Jesus saith, Except ye fast to the world, ye shall in no wise find the kingdom of God; and except ye make the sabbath a real sabbath, ye shall not see the Father.",
      },
      {
        key: "logion-3",
        label: "Logion 3",
        reference: "P. Oxy. 1, verso; Logia Iesou (1897), logion 3",
        locus: "verso",
        sayings: [28],
        greek: {
          text: "Λέγει Ἰησοῦς, ἔ[σ]την ἐν μέσῳ τοῦ κόσμου, καὶ ἐν σαρκὶ ὤφθην αὐτοῖς, καὶ εὗρον πάντας μεθύοντας καὶ οὐδένα εὗρον διψῶντα ἐν αὐτοῖς, καὶ πονεῖ ἡ ψυχή μου ἐπὶ τοῖς υἱοῖς τῶν ἀνθρώπων, ὅτι τυφλοί εἰσιν τῇ καρδίᾳ αὐτῶ[ν] . . .",
          ...LOGIA_1897(3),
        },
        english:
          "Jesus saith, I stood in the midst of the world and in the flesh was I seen of them, and I found all men drunken, and none found I athirst among them, and my soul grieveth over the sons of men, because they are blind in their heart and see not . . .",
      },
      {
        key: "logion-4",
        label: "Logion 4",
        reference: "P. Oxy. 1, verso, foot; New Sayings of Jesus (1904), p. 37",
        locus: "verso, foot",
        sayings: [29],
        greek: { absent: GREEK_NOT_YET("Logia Iesou (1897) or New Sayings of Jesus (1904), p. 37: only a few letters and the word for 'poverty' survive") },
        english: ". . . poverty.",
        notes: "Only the last word survives. It is matched with the end of Coptic saying 29 ('… this great wealth has made its home in this poverty').",
      },
      {
        key: "logion-5",
        label: "Logion 5",
        reference: "P. Oxy. 1, recto; Logia Iesou (1897), logion 5; New Sayings of Jesus (1904), p. 38",
        locus: "recto",
        sayings: [30, 77],
        greek: {
          text: "[λέγ]ει [Ἰησοῦς, ὅπ]ου ἐὰν ὦσιν [. . . .]ε[. . .] . . θεοι καὶ [. .]σο . ε[. .] ἐστιν μόνος [. .]τω ἐγώ εἰμι μετ' αὐτ[οῦ]· ἔγει[ρ]ον τὸν λίθον κἀκεῖ εὑρήσεις με, σχίσον τὸ ξύλον κἀγὼ ἐκεῖ εἰμί.",
          ...LOGIA_1897(5),
        },
        english:
          "Jesus saith, Wherever there are (two), they are not without God, and wherever there is one alone, I say, I am with him. Raise the stone, and there thou shalt find me; cleave the wood, and there am I.",
        notes:
          "The first half was restored differently in 1897 and 1904; the 1897 English reads 'Wherever there are . . . and there is one . . . alone, I am with him.' The Coptic splits this: the first half is saying 30, and 'lift the stone … split the wood' ends saying 77, in the reverse order.",
      },
      {
        key: "logion-6",
        label: "Logion 6",
        reference: "P. Oxy. 1, recto; Logia Iesou (1897), logion 6",
        locus: "recto",
        sayings: [31],
        greek: {
          text: "Λέγει Ἰησοῦς, οὐκ ἔστιν δεκτὸς προφήτης ἐν τῇ πατρίδι αὐτ[ο]ῦ, οὐδὲ ἰατρὸς ποιεῖ θεραπείας εἰς τοὺς γινώσκοντας αὐτόν.",
          ...LOGIA_1897(6),
        },
        english: "Jesus saith, A prophet is not acceptable in his own country, neither doth a physician work cures upon them that know him.",
      },
      {
        key: "logion-7",
        label: "Logion 7",
        reference: "P. Oxy. 1, recto; Logia Iesou (1897), logion 7",
        locus: "recto",
        sayings: [32],
        greek: {
          text: "Λέγει Ἰησοῦς, πόλις ᾠκοδομημένη ἐπ' ἄκρον [ὄ]ρους ὑψηλοῦ καὶ ἐστηριγμένη οὔτε πε[σ]εῖν δύναται οὔτε κρυ[β]ῆναι.",
          ...LOGIA_1897(7),
        },
        english: "Jesus saith, A city built upon the top of a high hill and stablished, can neither fall nor be hid.",
      },
      {
        key: "logion-8",
        label: "Logion 8",
        reference: "P. Oxy. 1, recto, foot; New Sayings of Jesus (1904), p. 38",
        locus: "recto, foot",
        sayings: [33],
        greek: { absent: GREEK_NOT_YET("New Sayings of Jesus (1904), p. 38 (first read in Oxyrhynchus Papyri I, 1898)") },
        english: "Jesus saith, Thou hearest with one ear, (but the other thou hast closed).",
        notes: "The editors' restoration of the second half was made without the Coptic, which has a different saying here: what you hear with one ear, proclaim from the housetops.",
      },
    ],
  },
  {
    key: "poxy655",
    manuscriptKey: "poxy-655",
    label: "Greek: P. Oxy. 655 (sayings 36–39)",
    reference: "P. Oxy. 655 (Houghton Library, SM Inv. 4367); Grenfell and Hunt, New Sayings of Jesus (1904), pp. 39–47",
    summary:
      "Eight fragments of a papyrus roll, with parts of two columns. Grenfell and Hunt published it in 1904 as a 'Fragment of a Lost Gospel'; the Coptic later showed it to be sayings 36–39 of Thomas.",
    notes:
      "Only the lines the editors translated are given: ll. 1–23 and 41–46. The lines between (sayings 38 and the start of 39) were too broken for them to translate.",
    date: {
      key: "manuscript",
      role: "manuscript",
      startYear: 200,
      endYear: 250,
      datePrecision: "decade",
      isApproximate: true,
      originalDateText: "'not likely to have been written later than A.D. 250'",
      evidence: "Grenfell and Hunt's dating of the hand, a small sloping uncial of the earlier third century (New Sayings of Jesus, p. 39).",
      sourceKey: "gh-new-sayings-1904",
    },
    units: [
      {
        key: "lines-1-23",
        label: "Lines 1–23",
        reference: "P. Oxy. 655, ll. 1–23; New Sayings of Jesus, p. 42",
        locus: "ll. 1–23",
        sayings: [36, 37],
        greek: { absent: GREEK_NOT_YET("New Sayings of Jesus (1904), pp. 40–41, or Oxyrhynchus Papyri IV (1904), no. 655") },
        english:
          "(Take no thought) from morning until even nor from evening until morning, either for your food what ye shall eat or for your raiment what ye shall put on. Ye are far better than the lilies which grow but spin not. Having one garment, what do ye (lack?) . . . Who could add to your stature? He himself will give you your garment. His disciples say unto him, When wilt thou be manifest to us, and when shall we see thee? He saith, When ye shall be stripped and not be ashamed . . .",
      },
      {
        key: "lines-41-46",
        label: "Lines 41–46",
        reference: "P. Oxy. 655, ll. 41–46; New Sayings of Jesus, p. 42",
        locus: "ll. 41–46",
        sayings: [39],
        greek: { absent: GREEK_NOT_YET("New Sayings of Jesus (1904), pp. 40–41, or Oxyrhynchus Papyri IV (1904), no. 655") },
        english:
          ". . . He said, The key of knowledge ye hid; ye entered not in yourselves and to them that were entering in ye opened not.",
      },
    ],
  },
];

function greekPassages(): CorpusPassage[] {
  return PAPYRI.flatMap((papyrus) => {
    const parentKey = `${PREFIX}.${papyrus.key}`;
    const parent: CorpusPassage = {
      key: parentKey,
      divisionKind: "version",
      label: papyrus.label,
      reference: papyrus.reference,
      versionKey: papyrus.key,
      sourceKey: papyrus.date.sourceKey,
      summary: papyrus.summary,
      notes: papyrus.notes,
      verificationStatus: "unverified",
      layers: [],
      witnesses: [{ manuscriptKey: papyrus.manuscriptKey }],
      dates: [papyrus.date],
      images: imagesFor((image) => image.passageKey === parentKey),
    };
    const children = papyrus.units.map((unit): CorpusPassage => {
      const key = `${parentKey}.${unit.key}`;
      const parallels = unit.sayings.map((s) => (s === "prologue" ? "the prologue" : `saying ${s}`)).join(" and ");
      return {
        key,
        parentKey,
        divisionKind: "section",
        label: unit.label,
        reference: unit.reference,
        versionKey: papyrus.key,
        sourceKey: "gh-new-sayings-1904",
        notes: [`Parallels ${parallels} of the Coptic.`, unit.notes].filter(Boolean).join(" "),
        verificationStatus: "unverified",
        layers: greekLayers(unit),
        witnesses: [{ manuscriptKey: papyrus.manuscriptKey, locus: unit.locus }],
        images: imagesFor((image) => image.passageKey === key),
      };
    });
    return [parent, ...children];
  });
}

// ---------------------------------------------------------------------------
// CONNECTIONS
// ---------------------------------------------------------------------------

const TRANSMISSION =
  "The Greek papyri and the Coptic codex are copies of the same collection: the sayings follow in the same order, and the Coptic is generally held to be a translation of a Greek text related to, though not identical with, the one these papyri preserve. The identification was made after the Coptic was published in the 1950s.";

/** [Greek unit, Coptic passage, similarities, differences, wording comparable]. */
const PARALLELS: [string, string, string, string, "yes" | "partly"][] = [
  ["poxy654.intro", "prologue", "Words spoken by 'the living' Jesus, with Thomas named.", "The Greek gap before Thomas was restored by the editors without the Coptic, which calls the sayings hidden and names Didymos Judas Thomas as their writer.", "partly"],
  ["poxy654.intro", "1", "Whoever attends to these words will not taste death.", "The Greek says whoever 'hearkens to' the words; the Coptic, whoever finds their interpretation. In the Greek the promise is part of the introduction.", "partly"],
  ["poxy654.saying-1", "2", "Seeking until one finds, then astonishment and ruling.", "The Greek ends 'and having reached the kingdom he shall rest'; the Coptic adds being troubled before being astonished and ends with ruling over the All.", "partly"],
  ["poxy654.saying-2", "3", "Those who 'draw' or lead; birds, fish, the kingdom within; knowing oneself as a child of the Father.", "The Coptic makes it a mockery of leaders who place the kingdom in the sky or the sea, says the kingdom is inside and outside you, and ends with poverty; the Greek ending is lost and was restored by the editors as 'the city'.", "partly"],
  ["poxy654.saying-3", "4", "A man will not hesitate to ask about the place; the first will be last.", "The Coptic has an old man asking a seven-day-old child about the place of life, and ends 'they will become a single one'; the Greek ending was restored without the Coptic.", "partly"],
  ["poxy654.saying-4", "5", "What is before your face and what is hidden will be revealed.", "The Greek adds 'nor buried which shall not be raised', which the Coptic lacks.", "partly"],
  ["poxy654.saying-5", "6", "The disciples ask how to fast and pray and what to observe.", "The Greek answer is lost except for a few words ('of truth'); the Coptic answers: do not lie, and do not do what you hate.", "partly"],
  ["poxy654.saying-5", "7", "A saying beginning 'blessed'.", "Only the word 'blessed' survives in the Greek; the identification with Coptic saying 7 rests on its position after saying 6.", "partly"],
  ["poxy1.logion-1", "26", "Seeing clearly to remove the speck from a brother's eye.", "The Greek begins mid-saying: the first half, about the beam in one's own eye, was on the lost preceding page.", "yes"],
  ["poxy1.logion-2", "27", "Fasting to or from the world, keeping the sabbath, finding the kingdom, seeing the Father.", "The Coptic has no 'Jesus said'; the Greek kingdom is 'of God'.", "yes"],
  ["poxy1.logion-3", "28", "Jesus stood in the world, appeared in flesh, found all drunk and none thirsty; his soul grieved; they are blind in heart.", "The Greek breaks off; the Coptic continues that they came empty into the world and will repent when they shake off their wine.", "yes"],
  ["poxy1.logion-4", "29", "The word 'poverty' at the end.", "Nothing else survives in the Greek; the match rests on that one word and on the order of the sayings.", "partly"],
  ["poxy1.logion-5", "30", "Where there are few, Jesus is with the one.", "The Greek is broken and has been restored in several ways; the Coptic speaks of three gods, and of two or one.", "partly"],
  ["poxy1.logion-5", "77", "Lift the stone and you will find me; split the wood and I am there.", "In the Greek these sentences end the saying that is Coptic saying 30; in the Coptic they end saying 77, in the reverse order.", "yes"],
  ["poxy1.logion-6", "31", "A prophet is not accepted in his own country; a doctor does not heal those who know him.", "Very close; small differences of wording.", "yes"],
  ["poxy1.logion-7", "32", "A city built on a high hill and fortified cannot fall or be hidden.", "Very close; small differences of wording.", "yes"],
  ["poxy1.logion-8", "33", "Hearing with one ear.", "The Greek breaks off after 'one ear'; the editors' restoration ('but the other thou hast closed') differs from the Coptic, which tells the hearer to proclaim from the housetops what they hear.", "partly"],
  ["poxy655.lines-1-23", "36", "Do not worry from morning to evening and from evening to morning about clothing.", "The Greek is much longer: food as well as clothing, the lilies that do not spin, adding to one's stature, and God giving the garment. The Coptic has only the first sentence, about clothing.", "partly"],
  ["poxy655.lines-1-23", "37", "The disciples ask when he will appear to them; when you strip without being ashamed.", "The Greek breaks off; the Coptic goes on to treading on the clothes like little children and seeing the son of the living one.", "yes"],
  ["poxy655.lines-41-46", "39", "The key of knowledge hidden; not entering, and not letting those who would enter.", "The Coptic names the Pharisees and scribes and adds 'be wise as serpents and innocent as doves'; the Greek before and after is lost.", "yes"],
];

const LINKS: CorpusLink[] = PARALLELS.map(([greek, coptic, similarities, differences, wording]) => ({
  key: `${greek.replace(".", "-")}-to-${coptic}`,
  from: `${PREFIX}.${greek}`,
  to: `${PREFIX}.${coptic}`,
  connectionClass: "direct_textual_parallel",
  similarities,
  differences,
  wordingComparable: wording,
  meaningComparable: wording === "yes" ? "yes" : "partly",
  transmissionEvidence: TRANSMISSION,
  sourceKey: "layton-nhc-ii-1989",
  reviewStatus: "proposed",
}));

export const GOSPEL_OF_THOMAS_CORPUS: TextCorpusFile = {
  workKey: "gnostic.gospel-of-thomas",
  revision: "thomas-2026-10",
  sources: SOURCES,
  versions: [
    { key: "poxy654", label: "Greek, P. Oxy. 654", language: "Greek", description: "The prologue and sayings 1–7, third century." },
    { key: "poxy1", label: "Greek, P. Oxy. 1", language: "Greek", description: "Sayings 26–33 and part of 77, about 200 CE." },
    { key: "poxy655", label: "Greek, P. Oxy. 655", language: "Greek", description: "Sayings 36–39, early third century." },
  ],
  manuscripts: MANUSCRIPTS,
  passages: [...copticPassages(), ...greekPassages()],
  links: LINKS,
};
