// DOREAL, "THE EMERALD TABLETS OF THOTH-THE-ATLANTEAN": A REFERENCE SKELETON.
//
// A twentieth-century book, treated as in copyright. The archive records each
// tablet by number and title so other passages can be connected to it, with a
// description written for this archive and one quotation of a few lines, the
// part of the tablet a reader most needs to see — never the tablet entire.
// The titles are as printed in the commonly circulated editions; they are
// marked unverified until checked against a first edition.
//
// This book is not the historical Emerald Tablet (arab.emerald-tablet). It
// borrows the name. No physical tablets have ever been produced, so there are
// no images of "the tablets", and none may be added as if there were. The
// pictures the work carries (doreal-related-images.ts) are context only —
// places and older maps the book draws on — never Doreal's own illustrations,
// which are in copyright, and never on a tablet as if they showed it.

import type { CorpusLink, CorpusPassage, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";
import { DOREAL_RELATED_IMAGES } from "./doreal-related-images";

// [title, summary written for this archive, quotation]. The quotations are
// short passages chosen to show what each tablet actually says, checked word
// for word against two independent scans of the book (archive.org items
// TheEmeraldTabletsOfThoth and PHIEmeraldTabletsOfThothDoreal). Where the two
// scans word a line differently ("beneath"/"'neath", "built"/"builded") the
// line is left out rather than one edition's wording chosen silently. Joined
// passages are separated by an ellipsis.
const TABLETS: [string, string, string][] = [
  [
    "The History of Thoth, the Atlantean",
    "Thoth introduces himself as a priest-king of Atlantis who fled its destruction to Egypt, and sets down these records before passing into the Halls of Amenti.",
    "I, Thoth, the Atlantean, master of mysteries, keeper of records, mighty king, magician, living from generation to generation, being about to pass into the Halls of Amenti, set down for the guidance of those that are to come after, these records of the mighty wisdom of Great Atlantis.",
  ],
  [
    "The Halls of Amenti",
    "Describes the Halls of Amenti as a hidden realm beneath the earth, where thirty-two Children of Light sit around a flame of life and incarnate among men. 'Amenti' is taken from the Egyptian Amentet, 'the West', a name for the land of the dead.",
    "Deep in the Earth's heart lie the Halls of Amenti … Halls of the Dead and halls of the living, bathed in the fire of the infinite ALL. … Thirty and two were there of the children, sons of Light who had come among men, seeking to free from the bondage of darkness those who were bound by the force from beyond.",
  ],
  [
    "The Key of Wisdom",
    "A set of moral maxims, several close to the Egyptian Instruction of Ptahhotep ('Be not proud of your knowledge; consult the ignorant as well as the wise'), followed by a version of the Emerald Tablet's 'separate the earth from the fire'.",
    "Be thou not proud, O man, in thy wisdom. Discourse with the ignorant as well as the wise. … Let he who would be free from the bonds of darkness first divine the material from the immaterial, the fire from the earth; for know ye that as earth descends to earth, so also fire ascends unto fire and becomes one with fire.",
  ],
  [
    "The Space Born",
    "Thoth tells of leaving his body and travelling among the stars, where he finds the same Law at work on other worlds and races who build with the ether.",
    "Free was I from the bondage of earth-men. Free from the body, I flashed through the night. … Know, O man, that Light is thine heritage. Know that darkness is only a veil. Sealed in thine heart is brightness eternal, waiting the moment of freedom to conquer, waiting to rend the veil of the night.",
  ],
  [
    "The Dweller of Unal",
    "The Dweller, a master from a higher cycle, rules Atlantis from a temple raised out of the ether; the tablet goes on to the sinking of Atlantis and Thoth's flight with its records to Egypt.",
    "Far in the past time when Atlantis first grew as a power, appeared there one with the Key of Wisdom, showing the way of Light to all. … Formless was He within his Temple, yet was He formed in the image of man.",
  ],
  [
    "The Key of Magic",
    "Describes an age-old war between light and the Brothers of Darkness, hidden adepts who bind men's souls, and the Brothers of Light who oppose them.",
    "Long, long ago in the days of the first man, warfare began between darkness and light. … Silently, secretly, use they their power, enslaving and binding the souls of men. Unseen they come and unseen they go. Man in his ignorance calls Them from below.",
  ],
  [
    "The Seven Lords",
    "Describes seven Lords of the cycles whom Thoth meets in the Halls of Amenti, and their teaching that all comes from one Light and is governed by Law.",
    "Deep in the Dark Halls sit the Seven, units of consciousness from cycles above. Manifest They in this cycle as guide of man to the knowledge of All. Seven are they, mighty in power, speaking these words through me to men.",
  ],
  [
    "The Key of Mysteries",
    "Teaches that man is a being of earth and of fire who is changing towards the formless, and gives a path to the flame at the earth's heart.",
    "Mystery is but hidden knowledge. Know and ye shall unveil. Find the deep buried wisdom and be master of darkness and Light. … Know, O man, thou art complex, a being of earth and of fire. Let thy flame shine out brightly. Be thou only the fire.",
  ],
  [
    "The Key of Freedom of Space",
    "Teaches leaving the body to travel the planes, and that man is the summit of creation who has forgotten it.",
    "Make of thyself a vessel for Light, a focus for the Sun of this space. … Know ye, man, ye are the ultimate of all things. Only the knowledge of this is forgotten, lost when man was cast into bondage, bound and fettered by the chains of the darkness.",
  ],
  [
    "The Key of Time",
    "A dialogue in which the Dweller explains time to Thoth: a thought filled the void, and time is the force that keeps events apart.",
    "Seek ye and learn that Time is the secret whereby ye may be free of this space. … Time changes not, but all things change in time.",
  ],
  [
    "The Key to Above and Below",
    "Speaks to the people of Egypt of keys hidden in the pyramid, and teaches that the cycles above and below differ only in how they work with the Law: the theme the book's title borrows from the Hermetic Emerald Tablet.",
    "Nothing there is that is really below thee but only a different operation of Law. Look thee above or look thee below, the same shall ye find. For all is but part of the Oneness that is at the Source of the Law.",
  ],
  [
    "The Law of Cause and Effect and the Key of Prophecy",
    "Teaches that the future is not fixed but follows from causes and from free will, and prophesies man's long journey towards the Light.",
    "Know ye the future is not fixed or stable but varies as cause brings forth an effect. … Know ye the future is never in fixation but follows man's free will as it moves through the movements of time-space toward the goal where a new time begins.",
  ],
  [
    "The Keys of Life and Death",
    "Teaches that death comes when the body's balance of polarity is lost, and that the flower of life at the earth's heart renews the spirit.",
    "Know ye the gateway to life is through death. Aye, through death but not as ye know death, but a death that is life and is fire and is Light. … Deep in Earth's heart lies the flower, the source of the Spirit that binds all in its form.",
  ],
  [
    "Supplementary tablet",
    "Describes the regions the soul crosses after death, borrowing Egyptian names (the Duat, Osiris), and Thoth's vision of the Holy One in the temple of Atlantis.",
    "Regions there are two between this life and the Great One, traveled by the Souls who depart from this Earth; Duat, the home of the powers of illusion; Sekhet Hetspet, the House of the Gods. Osiris, the symbol of the guard of the portal, who turns back the souls of unworthy men.",
  ],
  [
    "The Secret of Secrets (supplementary)",
    "Teaches that light and darkness are of one nature, and that man is threefold, physical, astral and mental, each with three qualities.",
    "Darkness and light are both of one nature, different only in seeming, for each arose from the source of all. Darkness is disorder. Light is Order. Darkness transmuted is light of the Light. … Three are the qualities of each of the natures; nine in all, as above, so below.",
  ],
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
  14: [{ themeKey: "atlantis", note: "Thoth's vision in the temple of Atlantis." }],
};

const PASSAGES: CorpusPassage[] = TABLETS.map(([title, summary, quotation], i) => ({
  key: `modern.doreal.${pad(i + 1)}`,
  divisionKind: "tablet",
  label: `Tablet ${roman[i]}: ${title}`,
  reference: `Doreal, Emerald Tablets, Tablet ${roman[i]}`,
  sourceKey: "doreal-tablets",
  summary,
  verificationStatus: "unverified",
  layers: [
    {
      key: "eng-doreal",
      layer: "primary_text",
      sourceKey: "doreal-tablets",
      content: quotation,
      language: "English",
      licence: "copyrighted_excerpt",
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
    key: "doreal-03-takes-up-vulgate-09",
    from: "modern.doreal.03",
    to: "arab.tab.vulgate.09",
    connectionClass: "later_reinterpretation",
    similarities: "Both tell the reader to separate the earth from the fire, and both have what is of the earth go down and what is of fire go up.",
    differences:
      "In the Emerald Tablet it is a step in an alchemical operation; Doreal makes it a spiritual discipline, dividing the material from the immaterial to escape the bonds of darkness.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: `${MODERN_NAME} Doreal's line follows the vulgate's order: separate earth from fire, then ascent and descent.`,
    earlierNote: "The vulgate is attested from the twelfth century; Doreal's book from the twentieth.",
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
  revision: "2026-10-17-quotes",
  sources: INVENTORY_SOURCES.filter((s) => s.key === "doreal-tablets"),
  images: DOREAL_RELATED_IMAGES,
  passages: PASSAGES,
  links: LINKS,
};
