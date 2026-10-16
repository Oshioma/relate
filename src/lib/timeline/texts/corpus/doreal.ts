// DOREAL, "THE EMERALD TABLETS OF THOTH-THE-ATLANTEAN": A REFERENCE SKELETON.
//
// A twentieth-century book, treated as in copyright. The archive records each
// tablet by number and title so other passages can be connected to it, with a
// short neutral description written for this archive — and no text from the
// book. The tablet titles are as printed in the commonly circulated editions;
// they are marked unverified until checked against a first edition.
//
// This book is not the historical Emerald Tablet (arab.emerald-tablet). It
// borrows the name. No physical tablets have ever been produced, so there are
// no images of "the tablets", and none may be added as if there were.

import type { CorpusLink, CorpusPassage, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";

const TABLETS: [string, string | null][] = [
  ["The History of Thoth, the Atlantean", "Thoth introduces himself as a priest-king of Atlantis who fled its destruction to Egypt."],
  ["The Halls of Amenti", "Describes the Halls of Amenti as a hidden realm beneath the earth. 'Amenti' is taken from the Egyptian Amentet, 'the West', a name for the land of the dead."],
  ["The Key of Wisdom", null],
  ["The Space Born", null],
  ["The Dweller of Unal", null],
  ["The Key of Magic", null],
  ["The Seven Lords", "Describes seven Lords of cycles encountered in the Halls of Amenti."],
  ["The Key of Mystery", null],
  ["The Key of Freedom of Space", null],
  ["The Key of Time", null],
  ["The Key to Above and Below", "Teaches a correspondence between the higher and lower worlds, the theme the book's title borrows from the Hermetic Emerald Tablet."],
  ["The Law of Cause and Effect and the Key of Prophecy", null],
  ["The Keys of Life and Death", null],
  ["Atlantis (supplementary)", "A supplementary tablet on the history and fall of Atlantis."],
  ["The Secret of Secrets (supplementary)", null],
];

const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
const pad = (n: number) => String(n).padStart(2, "0");

const THEMES: Record<number, { themeKey: string; note: string }[]> = {
  1: [
    { themeKey: "atlantis", note: "Thoth presented as a survivor of Atlantis." },
    { themeKey: "thoth-and-hermes", note: "Uses the name of the Egyptian god Thoth for an Atlantean priest-king." },
  ],
  2: [
    { themeKey: "amenti", note: "The source of the modern 'Halls of Amenti'." },
    { themeKey: "hidden-chambers", note: "A hidden realm beneath the earth." },
  ],
  7: [{ themeKey: "seven-cosmic-rulers", note: "Seven Lords set over the cycles." }],
  10: [{ themeKey: "time-and-eternity", note: "Presented as a teaching on time." }],
  11: [{ themeKey: "above-and-below", note: "Takes up the correspondence of above and below." }],
  13: [{ themeKey: "death-and-rebirth", note: "Presented as a teaching on life and death." }],
  14: [{ themeKey: "atlantis", note: "The history and fall of Atlantis." }],
};

const PASSAGES: CorpusPassage[] = TABLETS.map(([title, summary], i) => ({
  key: `modern.doreal.${pad(i + 1)}`,
  divisionKind: "tablet",
  label: `Tablet ${roman[i]}: ${title}`,
  reference: `Doreal, Emerald Tablets, Tablet ${roman[i]}`,
  sourceKey: "doreal-tablets",
  summary: summary ?? undefined,
  verificationStatus: "unverified",
  layers: [
    {
      key: "eng-doreal",
      layer: "primary_text",
      sourceKey: "doreal-tablets",
      contentAbsentReason: "In copyright. Read it in an authorised edition; the archive records the tablet by number and title only.",
      language: "English",
      licence: "copyrighted_reference",
      evidence: "Doreal's English is the earliest form of this text: no tablets or source-language text have been produced.",
    },
  ],
  themes: THEMES[i + 1],
}));

const MODERN_NAME =
  "Doreal published the book in the twentieth century under a title naming 'Emerald Tablets' and Thoth, whom Greek writers identified with Hermes; the historical Emerald Tablet had been in print in English since the seventeenth century.";

const LINKS: CorpusLink[] = [
  {
    key: "doreal-11-takes-up-vulgate-02",
    from: "modern.doreal.11",
    to: "arab.tab.vulgate.02",
    connectionClass: "later_reinterpretation",
    similarities: "Both teach a correspondence between what is above and what is below.",
    differences:
      "The vulgate's line is one sentence of a short alchemical text. Doreal builds a whole cosmology of planes around it, attributed to an Atlantean Thoth the medieval text knows nothing of.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: `${MODERN_NAME} 'As above, so below' was a commonplace of early twentieth-century occult writing.`,
    earlierNote: "The vulgate is attested from the twelfth century; Doreal's book from the twentieth.",
    alternativeView: "Doreal's readers take the tablets to be the original from which the Hermetic tablet descends. No evidence for such tablets has been produced.",
    sourceKey: "doreal-tablets",
    reviewStatus: "proposed",
  },
  {
    key: "doreal-01-takes-up-timaeus-25a",
    from: "modern.doreal.01",
    to: "greek.tim.25a",
    connectionClass: "later_reinterpretation",
    similarities: "Both place a great island civilisation, Atlantis, in the far past, destroyed and remembered through Egypt.",
    differences:
      "In Plato the account comes from Egyptian priests at Saïs and Atlantis is Athens's enemy; in Doreal, Thoth himself is an Atlantean who brought its wisdom to Egypt.",
    wordingComparable: "no",
    meaningComparable: "partly",
    transmissionEvidence:
      "Plato's Timaeus and Critias are the earliest source for Atlantis; every later account, including the Theosophical one Doreal's writing resembles, descends from them.",
    earlierNote: "Plato wrote in the fourth century BCE.",
    alternativeView: "Readers of Doreal take Plato and the tablets to be independent memories of the same real Atlantis.",
    sourceKey: "doreal-tablets",
    reviewStatus: "proposed",
  },
  {
    key: "doreal-07-resembles-poimandres-9",
    from: "modern.doreal.07",
    to: "herm.ch.1.9",
    connectionClass: "symbolic_similarity",
    similarities: "Both have seven powers set over the cosmos: Doreal's seven Lords, and the Poimandres's seven Governors who encompass the world in circles.",
    differences:
      "The Poimandres's Governors are the planetary spheres, whose fate binds the soul; Doreal's Lords are presented as beings of cycles met in Amenti.",
    wordingComparable: "no",
    meaningComparable: "unknown",
    transmissionEvidence:
      "None specific: Doreal does not cite the Hermetica. Seven planetary rulers were widespread in esoteric literature after Mead's translation (1906).",
    reviewStatus: "proposed",
  },
];

export const DOREAL_CORPUS: TextCorpusFile = {
  workKey: "modern.doreal-emerald-tablets",
  revision: "2026-10-16",
  sources: INVENTORY_SOURCES.filter((s) => s.key === "doreal-tablets"),
  passages: PASSAGES,
  links: LINKS,
};
