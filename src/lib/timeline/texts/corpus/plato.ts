// PLATO, TIMAEUS AND CRITIAS: every Stephanus section, Greek and English.
//
// The text comes from the generated files beside this one (Burnet's Greek and
// Bury's English, split on the Stephanus milestones by
// scripts/texts/plato-corpus.py). What a reader needs beyond the text — the
// parts of the dialogue, short summaries of the sections that carry the
// Atlantis account and the cosmology, themes and the dates the dialogue
// itself states — is written here, so regenerating the text never loses it.
//
// Hierarchy: part (a modern division for navigation) → Stephanus page →
// Stephanus section. Only sections count toward the inventory.

import type { SeedSource } from "../../seed-types";
import type { CorpusImage, CorpusLink, CorpusManuscript, CorpusPassage, CorpusPassageDate, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { CRITIAS_SECTIONS } from "./plato-critias-text";
import { TIMAEUS_SECTIONS } from "./plato-timaeus-text";

type SectionRow = [string, string, string | null, string | null];

const PLATO_SOURCES: SeedSource[] = INVENTORY_SOURCES.filter((s) =>
  ["burnet-plato", "bury-plato", "plato-paris-1807"].includes(s.key)
);

const PLATO_MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "paris-gr-1807",
    siglum: "A",
    name: "Paris, Bibliothèque nationale de France, grec 1807",
    objectKind: "codex",
    holdingInstitution: "Bibliothèque nationale de France",
    accessionNumber: "Grec 1807",
    startYear: 850,
    endYear: 900,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "second half of the ninth century",
    datingEvidence: "Palaeography of its minuscule hand; one of the 'philosophical collection' manuscripts made in Constantinople.",
    catalogueUrl: "https://gallica.bnf.fr/ark:/12148/btv1b10722002j",
    sourceKey: "plato-paris-1807",
    notes: "Contains tetralogies VIII–IX with the Timaeus and Critias; Burnet's principal witness for these dialogues. Folio numbers for each section have not yet been recorded here.",
  },
  {
    key: "vat-reg-lat-1308",
    name: "Vatican Library, Reg. lat. 1308 (Calcidius, Latin Timaeus and commentary)",
    objectKind: "codex",
    holdingInstitution: "Biblioteca Apostolica Vaticana",
    accessionNumber: "Reg. lat. 1308",
    startYear: 900,
    endYear: 950,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "first half of the tenth century",
    datingEvidence: "As given by the Vatican Library exhibition label reproduced on Wikimedia Commons; not checked against the library's catalogue.",
    notes: "Calcidius's fourth-century Latin translation covers Timaeus 17a–53c only. It is how the medieval West read the dialogue, and is a translation, not a witness to Plato's Greek.",
  },
];

/** Images keyed to a work; plato's corpus files pick theirs out by workKey. */
const PLATO_IMAGES: (CorpusImage & { manuscriptKey?: string; workKey: string })[] = [
  {
    workKey: "greek.timaeus",
    key: "vat-reg-lat-1308-f21v-22r",
    manuscriptKey: "vat-reg-lat-1308",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/03/Timaeus_trans_calcidius_med_manuscript.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Timaeus_trans_calcidius_med_manuscript.jpg",
    institution: "Biblioteca Apostolica Vaticana",
    accessionNumber: "Reg. lat. 1308, fols. 21v–22r",
    objectDate: "First half of the tenth century",
    caption:
      "Two pages of a tenth-century Latin manuscript of Calcidius on the Timaeus, with coloured diagrams of the Sun, Moon and Earth's shadow. These are from Calcidius's commentary on the dialogue's astronomy, not from Plato's own text.",
    creator: "Calcidius (text); unknown scribe",
    credit: "Vatican Library, via the ibiblio 'Rome Reborn' exhibition and Wikimedia Commons",
    licence: "Public domain",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "probable",
    verificationStatus: "unverified",
  },
  {
    workKey: "greek.timaeus",
    key: "stephanus-1578-timaeus-32-33",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Timaeus_stephanus_pages_32_33.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Timaeus_stephanus_pages_32_33.jpg",
    institution: "Rare Book & Manuscript Library, University of Illinois Urbana-Champaign",
    objectDate: "1578",
    caption:
      "Pages 32–33 of Henri Estienne's 1578 Greek and Latin edition of Plato, the edition whose page numbers and letters (Stephanus 32a, 32b …) every modern reference to the Timaeus still uses.",
    creator: "Henri Estienne (printer)",
    credit: "University of Illinois Rare Book & Manuscript Library exhibition, via Wikimedia Commons",
    licence: "Public domain",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];

const PLATO_LINKS: CorpusLink[] = [
  {
    key: "crit-108e-continues-tim-25a",
    from: "greek.crit.108e",
    to: "greek.tim.25a",
    connectionClass: "documented_transmission",
    similarities:
      "The Critias tells at length the story the Timaeus summarises: the war of primeval Athens against the kings of Atlantis beyond the Pillars of Heracles.",
    differences:
      "The Timaeus gives the war and the sinking in a few sections; the Critias describes the island, its kings and its city in detail, and breaks off before the war is told.",
    wordingComparable: "partly",
    meaningComparable: "yes",
    transmissionEvidence:
      "Same author, and the Critias presents itself as the promised continuation: Timaeus 27a–b announces it and Critias 106b takes the discourse over.",
    earlierNote: "The Timaeus is the earlier of the two in the dramatic sequence and almost certainly in composition.",
    scholarlyView: "Read as a planned trilogy (Timaeus, Critias, an unwritten Hermocrates) left unfinished.",
    reviewStatus: "reviewed",
  },
  {
    key: "crit-108e-nine-thousand-tim-23e",
    from: "greek.crit.108e",
    to: "greek.tim.23e",
    connectionClass: "direct_textual_parallel",
    similarities: "Both state an interval of nine thousand years for the Athens-Atlantis era.",
    differences:
      "Timaeus 23e counts nine thousand years to the foundation of Athens; Critias 108e counts nine thousand years to the war, which in the Timaeus came after the foundation.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: "Same author and the same narrative frame.",
    contradictionNote:
      "Read literally the two figures disagree about what the nine thousand years measure. Whether that is a slip, a round number used loosely, or a deliberate difference is debated.",
    reviewStatus: "reviewed",
  },
];

type Spec = {
  workKey: string;
  prefix: string;
  title: string;
  rows: SectionRow[];
  parts: [string, string, string][];
  summaries: Record<string, string>;
  themes: [string, string, string, string][];
  dates: Record<string, CorpusPassageDate>;
};

const TIMAEUS: Spec = {
  workKey: "greek.timaeus",
  prefix: "greek.tim",
  title: "Timaeus",
  rows: TIMAEUS_SECTIONS,
  parts: [
    ["17a", "27b", "Prologue: the ideal city and the Atlantis account"],
    ["27c", "47e", "The works of Reason: the making of the cosmos"],
    ["48a", "69a", "The works of Necessity: the receptacle and the elements"],
    ["69b", "92c", "Reason and Necessity together: the human body and soul"],
  ],
  summaries: {
    "20d": "Critias introduces a story Solon brought back from Egypt: a forgotten deed of ancient Athens.",
    "21e": "Solon at Saïs in the Nile delta, a city whose goddess Neith the Egyptians equate with Athena.",
    "22b": "An old priest tells Solon that the Greeks are always children, with no ancient learning.",
    "22c": "The priest explains that mankind is repeatedly destroyed by fire and flood; the Phaethon myth is a memory of one.",
    "22d": "Egypt, watered by the Nile, is spared these destructions and so keeps the oldest records.",
    "23a": "Everything noble that happens anywhere is written down and preserved in the Egyptian temples.",
    "23d": "The priest offers to tell Solon of the Athens that existed before the last great flood.",
    "23e": "Athens was founded nine thousand years before Solon; the Egyptian order is eight thousand years old by the sacred records.",
    "24e": "The great deed: Athens halted an invading host from the Atlantic Ocean.",
    "25a": "Beyond the Pillars of Heracles lay an island larger than Libya and Asia together: Atlantis, ruled by a confederation of kings.",
    "25b": "Atlantis ruled Libya as far as Egypt and Europe as far as Tyrrhenia, and attacked Athens and Egypt.",
    "25c": "Athens, abandoned by its allies, defeats the invaders; then come earthquakes and floods.",
    "25d": "In one day and night the Athenian army is swallowed by the earth and Atlantis sinks beneath the sea, leaving impassable shoals.",
    "27c": "Timaeus begins his account of the universe with a prayer to the gods.",
    "29e": "The craftsman was good, and wished everything to be as like himself as possible.",
    "34b": "The body of the world is wrapped in a soul set at its centre and stretched throughout.",
    "35a": "The making of the World Soul from Same, Different and Being.",
    "35b": "The soul-stuff is divided according to a series of numbers (1, 2, 3, 4, 9, 8, 27).",
    "36b": "The soul-stuff is split into two strips, bent into the circles of the Same and the Different.",
    "36d": "The circle of the Different is split into seven unequal circles.",
    "37d": "Time is made as a moving image of eternity.",
    "38c": "Sun, Moon and the five other wanderers are made to mark and preserve the numbers of time.",
    "39d": "The Perfect Year: when all eight revolutions return to their starting point together.",
    "40a": "The fixed stars are made as living gods.",
    "41d": "The craftsman mixes the remains of the soul-stuff and assigns each soul to a star.",
    "42b": "A soul that lives well returns to its star; one that fails is reborn as a woman, then as a beast.",
    "47a": "Sight was given so that we might observe the revolutions of heaven and learn number and philosophy.",
    "48e": "A third kind is introduced: the receptacle, the nurse of all becoming.",
    "53c": "The four elements are built from two kinds of right-angled triangle.",
    "55c": "A fifth construction, used by the god for the whole, 'for embroidering it'.",
    "90a": "The divine part of the soul is a guardian spirit that lifts us toward our kindred in heaven.",
    "90e": "The coming into being of women and of animals, as rebirths of failed men.",
    "92c": "Closing: the cosmos is a visible god, image of the intelligible, the one heaven.",
  },
  themes: [
    ["20d", "25d", "atlantis", "The Atlantis account in the Timaeus, told by Critias from Solon's Egyptian source."],
    ["22b", "23c", "cosmic-cycles", "The Egyptian priest's doctrine of periodic destruction by fire and flood."],
    ["21e", "23e", "hidden-chambers", "Ancient records said to be preserved in Egyptian temples, unknown to the Greeks."],
    ["27c", "40d", "creation", "The craftsman's making of the world body, the World Soul and the heavens."],
    ["34b", "37c", "the-soul", "The construction of the World Soul."],
    ["35b", "36b", "sacred-numbers", "The soul-stuff divided by the series 1, 2, 3, 4, 9, 8, 27 and filled with harmonic means."],
    ["36d", "36d", "seven-planetary-spheres", "The circle of the Different split into seven circles, those of the planets."],
    ["38c", "39d", "seven-planetary-spheres", "Sun, Moon and five planets set in seven orbits."],
    ["38c", "38e", "sun-and-moon", "Sun and Moon made as instruments of time."],
    ["37d", "38c", "time-and-eternity", "Time as the moving image of eternity."],
    ["39d", "39d", "cosmic-cycles", "The Perfect Year of the eight revolutions."],
    ["41d", "42d", "reincarnation", "Souls sown in the stars and reborn according to how they lived."],
    ["41d", "42d", "the-soul", "The making of human souls from the remains of the World Soul."],
    ["53c", "56c", "sacred-geometry", "The elements built from triangles into four regular solids, with a fifth for the whole."],
    ["90a", "90d", "ascension", "The divine part of the soul lifting us toward heaven."],
    ["90e", "92c", "reincarnation", "Women and animals as rebirths of souls that lived badly."],
  ],
  dates: {
    "23e": {
      key: "athens-nine-thousand",
      role: "event_described",
      startYear: -9599,
      datePrecision: "millennium",
      isApproximate: true,
      originalDateText: "nine thousand years before Solon's visit (the foundation of primeval Athens)",
      evidence:
        "The priest's figure as the dialogue gives it. Counted back from Solon's visit around 590 BCE it gives about 9600 BCE; that conversion is the archive's, the dialogue gives only the interval.",
      sourceKey: "bury-plato",
    },
  },
};

const CRITIAS: Spec = {
  workKey: "greek.critias",
  prefix: "greek.crit",
  title: "Critias",
  rows: CRITIAS_SECTIONS,
  parts: [
    ["106a", "108d", "Prologue"],
    ["108e", "112e", "Primeval Athens"],
    ["113a", "121c", "Atlantis"],
  ],
  summaries: {
    "106a": "Timaeus hands the discourse over to Critias.",
    "108e": "Nine thousand years have passed since the war between those beyond and those within the Pillars of Heracles.",
    "109b": "The gods divided the earth by lot; Hephaestus and Athena received Attica.",
    "112e": "End of the account of primeval Athens.",
    "113a": "Critias explains that the Greek names are Solon's translations of the Egyptian ones.",
    "113c": "Poseidon receives Atlantis, loves the mortal Cleito and encloses her hill with rings of sea and land.",
    "113e": "Poseidon fathers five pairs of twins and divides the island into ten realms.",
    "114a": "The eldest, Atlas, gives his name to the island and to the Atlantic Ocean.",
    "114d": "The island's wealth: metals including orichalcum, timber, animals including elephants.",
    "115c": "The kings bridge the rings of sea and build a canal from the ocean.",
    "116c": "The temple of Poseidon and Cleito, plated with silver, gold and orichalcum.",
    "117e": "The great harbour and the outer wall, crowded with ships and merchants.",
    "118a": "The plain: oblong, three thousand by two thousand stades, sheltered by mountains.",
    "118c": "The great ditch around the plain and the network of canals.",
    "119c": "The kings' laws, inscribed on a pillar of orichalcum in the temple of Poseidon.",
    "119d": "The bull sacrifice and the oath taken by the ten kings.",
    "120e": "The divine portion in the kings fades as it is mixed with mortal stock.",
    "121b": "Zeus resolves to punish them and gathers the gods. The text breaks off mid-sentence.",
  },
  themes: [
    ["108e", "109a", "atlantis", "The war between Athens and Atlantis, nine thousand years before."],
    ["113a", "121c", "atlantis", "The description of Atlantis, its kings and its decline."],
    ["113c", "114d", "sacred-numbers", "Five pairs of twins and ten realms."],
    ["119c", "120c", "cosmic-law", "The law of Poseidon inscribed on the orichalcum pillar, and the kings' oath."],
    ["120e", "121c", "cosmic-law", "Moral decline of the kings and Zeus's judgement."],
  ],
  dates: {
    "108e": {
      key: "war-nine-thousand",
      role: "event_described",
      startYear: -9599,
      datePrecision: "millennium",
      isApproximate: true,
      originalDateText: "nine thousand years since the war between those dwelling beyond and those within the Pillars of Heracles",
      evidence:
        "Critias's interval as given in the dialogue. The conversion to about 9600 BCE assumes it is counted from Solon, as at Timaeus 23e; the dialogue does not say so explicitly.",
      sourceKey: "bury-plato",
    },
  },
};

const GREEK_EVIDENCE =
  "Burnet's critical text (Oxford, 1905), as encoded by the Perseus Digital Library (CC BY-SA 4.0). A modern edition reconstructed from the medieval manuscripts, not a transcript of any one of them.";
const ENGLISH_EVIDENCE =
  "R. G. Bury's Loeb translation (1929), as encoded by Perseus (CC BY-SA 4.0). Bury translates Burnet's text.";

function pageOf(section: string): string {
  return section.match(/^\d+/)![0];
}

function buildPassages(spec: Spec): CorpusPassage[] {
  const order = spec.rows.map((row) => row[0]);
  const index = new Map(order.map((s, i) => [s, i]));
  const within = (s: string, start: string, end: string) => index.get(s)! >= index.get(start)! && index.get(s)! <= index.get(end)!;

  const passages: CorpusPassage[] = [];
  // A page that runs across two parts (Timaeus 27, 69) gets a second container
  // in the later part, so every page has one parent.
  const pagesSeen = new Set<string>();
  for (const [start, end, label] of spec.parts) {
    const partKey = `${spec.prefix}.part-${start}`;
    passages.push({
      key: partKey,
      divisionKind: "part",
      label,
      reference: `${spec.title} ${start}–${end}`,
      sourceKey: "burnet-plato",
      verificationStatus: "structure_verified",
      notes: "A modern division of the dialogue for navigation; Plato's text has no headings.",
      layers: [],
    });
    const pageKeys = new Map<string, string>();
    for (const [section, greek, english, notes] of spec.rows) {
      if (!within(section, start, end)) continue;
      const page = pageOf(section);
      let pageKey = pageKeys.get(page);
      if (!pageKey) {
        const continued = pagesSeen.has(page);
        pagesSeen.add(page);
        pageKey = continued ? `${spec.prefix}.${page}.cont` : `${spec.prefix}.${page}`;
        pageKeys.set(page, pageKey);
        passages.push({
          key: pageKey,
          parentKey: partKey,
          divisionKind: "page",
          label: continued ? `Stephanus page ${page} (continued)` : `Stephanus page ${page}`,
          reference: `${spec.title} ${page}`,
          sourceKey: "burnet-plato",
          verificationStatus: "structure_verified",
          layers: [],
        });
      }
      const themes: { themeKey: string; note: string }[] = [];
      for (const [from, to, themeKey, note] of spec.themes) {
        if (within(section, from, to) && !themes.some((t) => t.themeKey === themeKey)) themes.push({ themeKey, note });
      }
      const date = spec.dates[section];
      passages.push({
        key: `${spec.prefix}.${section}`,
        parentKey: pageKey,
        divisionKind: "section",
        label: `${spec.title} ${section}`,
        reference: `${spec.title} ${section} (Stephanus)`,
        sourceKey: "burnet-plato",
        summary: spec.summaries[section],
        verificationStatus: "structure_verified",
        layers: [
          {
            key: "grc-burnet",
            layer: "primary_text",
            sourceKey: "burnet-plato",
            content: greek,
            language: "Ancient Greek",
            script: "Greek",
            licence: "cc_by_sa",
            evidence: GREEK_EVIDENCE,
          },
          english == null
            ? {
                key: "eng-bury",
                layer: "translation",
                sourceKey: "bury-plato",
                contentAbsentReason: `The encoded translation marks no section ${section}; its English is printed with the section before.`,
                language: "English",
                licence: "cc_by_sa",
                evidence: ENGLISH_EVIDENCE,
              }
            : {
                key: "eng-bury",
                layer: "translation",
                sourceKey: "bury-plato",
                content: english,
                language: "English",
                licence: "cc_by_sa",
                evidence: ENGLISH_EVIDENCE,
                notes: notes ? `Translator's notes: ${notes}` : undefined,
              },
        ],
        witnesses: [{ manuscriptKey: "paris-gr-1807" }],
        themes: themes.length > 0 ? themes : undefined,
        dates: date ? [date] : undefined,
      });
    }
  }
  return passages;
}

function corpus(spec: Spec): TextCorpusFile {
  return {
    workKey: spec.workKey,
    revision: "perseus-2026-10",
    sources: PLATO_SOURCES,
    manuscripts: PLATO_MANUSCRIPTS,
    images: PLATO_IMAGES.filter((image) => image.workKey === spec.workKey).map((image) => {
      const copy: CorpusImage & { manuscriptKey?: string; workKey?: string } = { ...image };
      delete copy.workKey;
      return copy;
    }),
    passages: buildPassages(spec),
    links: PLATO_LINKS.filter((link) => link.from.startsWith(`${spec.prefix}.`)),
  };
}

export const TIMAEUS_CORPUS = corpus(TIMAEUS);
export const CRITIAS_CORPUS = corpus(CRITIAS);
