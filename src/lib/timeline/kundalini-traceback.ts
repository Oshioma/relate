// HOW FAR BACK CAN EACH PIECE ACTUALLY BE TRACED?
//
// The serpent collection's central question, and the one a chronological list
// of records cannot answer. "Kundalini" is not one idea with one history. It is
// an assembly: a word, a serpent, a coil, a sleep, an awakening, a channel, a
// location at the base of the body, a destination at the crown, a set of
// wheels, a fire, a union. Each of those has its own earliest attestation, and
// they are not the same date.
//
// A timeline shows when things happened. THIS SHOWS WHEN EACH PART OF A LATER
// SYSTEM FIRST APPEARS, which is a different question and the more interesting
// one — because the answer is almost certainly that the parts are much older
// and much younger than the whole, and that the familiar diagram is one late
// arrangement of components with wildly different ages.
//
// WHY IT IS A STRUCTURE AND NOT A TABLE OF ANSWERS.
//
// Every element below currently has NO established earliest attestation. Not
// one. That is not a gap in this file — it is the honest state of the dataset,
// which has three records and has read no primary text on Indian material at
// all.
//
// So what is built here is a FORM THAT CANNOT BE FILLED DISHONESTLY. An element
// either names a text, a passage, a date and the scholar who established it, or
// it states what would establish it and stands empty. There is no third option
// and no free-text cell where a plausible century could be typed. A reader
// meeting this today sees twenty-four open questions, which is the truth, and
// a reader meeting it after the research sees twenty-four answers with their
// working.
//
// THE PAYOFF, once it is filled. The modern seven-cakra rainbow diagram is
// routinely presented as an ancient and unchanging map. If the word kuṇḍalinī
// turns out to be attested a thousand years after nāḍī, and the seven-cakra
// arrangement later than both, that is visible here in one screen and is not
// visible anywhere else in the collection.

/**
 * ONE COMPONENT OF THE LATER KUNDALINI SYSTEM.
 *
 * `earliest` is present only when a text, a passage, a date AND the scholar who
 * established it are all known. Anything less is `earliestAbsentReason`, which
 * is required in its place — the same rule a measurement with no figure and a
 * text layer with no content already follow.
 */
export type KundaliniElement = {
  key: string;
  /** The element in its own tradition's term, where it has one. */
  name: string;
  /** What it is, in a sentence, so the table reads without a glossary. */
  what: string;
  /** Thread tags, so an element can be found from the timeline and back. */
  threads: string[];
  /**
   * The earliest attestation ESTABLISHED FOR THIS DATASET. Not the earliest
   * anybody has ever claimed — the earliest somebody here has checked.
   */
  earliest?: {
    /** The text or object it is attested in. */
    text: string;
    /** Where in it. A claim with no passage is not an attestation. */
    passage: string;
    /** The date as the source gives it. */
    dateText: string;
    /** Astronomical year numbering, where a position is defensible. */
    startYear?: number;
    /** Who established it — an edition, a paper, a named scholar. */
    establishedBy: string;
    /** A source key, where the dataset holds one. */
    sourceKey?: string;
  };
  /** Required when `earliest` is absent: why nothing is entered. */
  earliestAbsentReason?: string;
  /**
   * An earlier thing sometimes offered as a precursor, and why it is disputed.
   *
   * SEPARATE FROM `earliest` ON PURPOSE. "Something like this appears earlier"
   * and "this is attested earlier" are different statements, and the collection
   * exists to keep them apart.
   */
  precursor?: {
    text: string;
    dateText: string;
    whyDisputed: string;
  };
  /** What evidence would establish the earliest attestation. Always required. */
  whatWouldEstablishThis: string;
};

/**
 * THE TWENTY-FOUR ELEMENTS, in roughly the order the later system assembles
 * them rather than in any order of importance.
 *
 * Every one of them is currently unestablished. The list is the deliverable;
 * the dates are the research.
 */
export const KUNDALINI_ELEMENTS: KundaliniElement[] = [
  {
    key: "kundalini-word",
    name: "The word kuṇḍalinī",
    what: "The term itself, in a datable text, meaning the power this collection is about.",
    threads: ["kundalini-shakti"],
    earliestAbsentReason:
      "NOT ESTABLISHED. This is the anchor of the entire collection and the dataset does not have it. Early Śaiva Tantra is where to look — the Niśvāsa corpus, the Tantrasadbhāva, the Kubjikā material — and none has been opened.",
    whatWouldEstablishThis:
      "A named text, a cited passage, a proposed date and the scholar who proposed it. The date will be a scholarly estimate rather than a fact, so the scholar's name is part of the answer and not a courtesy.",
  },
  {
    key: "kundalini-as-serpent",
    name: "Kuṇḍalinī described as a serpent",
    what: "The identification of the power with a snake, as opposed to a coil, a fire or a goddess.",
    threads: ["kundalini-shakti", "serpent"],
    earliestAbsentReason:
      "NOT ESTABLISHED, and deliberately kept apart from the word itself. The name derives from a word for coiled, and a coil is not automatically a serpent — the two may enter at different dates and that difference is exactly what this row exists to record.",
    whatWouldEstablishThis:
      "A passage that names the power AND calls it a snake, rather than one that calls it coiled and is translated with a snake.",
  },
  {
    key: "coiled",
    name: "Coiled",
    what: "The posture: wound round, in a spiral, at rest.",
    threads: ["kundalini-shakti"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis: "A cited passage describing the power as coiled, with its date and its editor.",
  },
  {
    key: "dormant",
    name: "Sleeping or dormant",
    what: "The power as latent — present but inactive until roused.",
    threads: ["kundalini-shakti"],
    earliestAbsentReason:
      "NOT ESTABLISHED. Dormancy is what makes awakening meaningful, so if it enters later than the power itself that is a substantive finding about how the system assembled.",
    whatWouldEstablishThis: "A cited passage describing the power as asleep, dormant or at rest.",
  },
  {
    key: "awakening",
    name: "Awakening",
    what: "The rousing of the dormant power, as an event that can be brought about.",
    threads: ["kundalini-shakti", "yoga"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis:
      "A cited passage describing the rousing, and ideally a technique for it — a doctrine and a practice may not arrive together.",
  },
  {
    key: "shakti",
    name: "Identification with Śakti",
    what: "The power as the goddess, or as divine feminine power, rather than as an impersonal force.",
    threads: ["kundalini-shakti"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis:
      "A passage identifying the two explicitly. An association asserted by a later commentator is a different and later fact, and belongs in its own row.",
  },
  {
    key: "base-location",
    name: "Located at the base of the body",
    what: "The power's resting place at the base of the spine or the lower body.",
    threads: ["kundalini-shakti", "subtle-body"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis: "A cited passage giving the location, with the anatomical term used.",
  },
  {
    key: "nadi",
    name: "Nāḍī",
    what: "A channel in the body through which something moves.",
    threads: ["subtle-body", "breath-vital-force"],
    earliestAbsentReason:
      "NOT ESTABLISHED HERE, and this one is likely to be much older than the rows above it. The Chāndogya and Kaṭha Upaniṣads describe 101 channels from the heart, one going upward to the head, and that is the obvious place to start.",
    precursor: {
      text: "Chāndogya Upaniṣad 8.6.6 and Kaṭha Upaniṣad 2.3.16",
      dateText: "Both early Upaniṣads; dating contested and not established here",
      whyDisputed:
        "The passages are real and the architecture is strikingly similar to later subtle-body schemes — 101 channels, one upward, immortality through it. WHETHER THAT IS THE SAME IDEA is the question the whole collection turns on, and the answer is not settled by the resemblance.",
    },
    whatWouldEstablishThis:
      "The Sanskrit, a transliteration, a translation and the dating claims for those passages — and, separately, whether later commentators identify the special nāḍī as Suṣumṇā, which is a different and later claim.",
  },
  {
    key: "sushumna",
    name: "Suṣumṇā",
    what: "The central channel, by that name.",
    threads: ["subtle-body", "ascent"],
    earliestAbsentReason:
      "NOT ESTABLISHED. The Maitrī Upaniṣad is where it is usually placed, and the Maitrī's dating is the collection's showcase disagreement — the yogic passages may belong to a later textual stratum, which would move this date substantially.",
    whatWouldEstablishThis:
      "The passage, and the full range of dating claims for the stratum it sits in, with each scholar named. A single date here would misrepresent the state of the question.",
  },
  {
    key: "ida",
    name: "Iḍā",
    what: "One of the two lateral channels, by name.",
    threads: ["subtle-body"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis:
      "A cited passage naming it. Worth establishing separately from Piṅgalā: the pair may not enter together, and the three-channel scheme may postdate both.",
  },
  {
    key: "pingala",
    name: "Piṅgalā",
    what: "The other lateral channel, by name.",
    threads: ["subtle-body"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis: "A cited passage naming it, and the earliest text in which all three channels appear together.",
  },
  {
    key: "upward-movement",
    name: "Upward movement through the body",
    what: "Something rising internally, as against breath merely circulating.",
    threads: ["ascent", "subtle-body"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    precursor: {
      text: "Chāndogya 8.6.6 and Kaṭha 2.3.16 — one channel going upward toward the head",
      dateText: "Early Upaniṣads; dating not established here",
      whyDisputed:
        "Upward movement to the head, connected with immortality, is explicitly there. Whether it is the ancestor of Kundalini ascent or an independent idea with a similar shape is precisely what is disputed.",
    },
    whatWouldEstablishThis: "The passages, with the verbs used, and the scholarly argument for or against continuity.",
  },
  {
    key: "crown-destination",
    name: "The crown as destination",
    what: "The head or crown as where the ascent ends.",
    threads: ["crown-head", "ascent"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis:
      "A cited passage. Distinguish the head as a general destination from Sahasrāra as a named centre — those are separate rows here for a reason.",
  },
  {
    key: "cakras",
    name: "Cakras",
    what: "Centres in the body, by that name, arranged along an axis.",
    threads: ["cakras-lotuses", "subtle-body"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis: "The earliest text naming them, and HOW MANY it gives — see the next row.",
  },
  {
    key: "seven-cakra-system",
    name: "The seven-cakra system specifically",
    what: "Seven centres, in the familiar arrangement.",
    threads: ["cakras-lotuses"],
    earliestAbsentReason:
      "NOT ESTABLISHED, AND THIS IS THE ROW MOST LIKELY TO SURPRISE A READER. There is no reason to assume there were always seven. Systems of three, four, five, six and more than seven are reported in the literature, and if the familiar seven turns out to be one late arrangement among several, the modern rainbow diagram is a historical development rather than a timeless map.",
    whatWouldEstablishThis:
      "The earliest text giving exactly seven in this arrangement — and, as importantly, the texts giving other numbers, each with its own date. This row is incomplete without them.",
  },
  {
    key: "lotus-imagery",
    name: "Lotus imagery for the centres",
    what: "The centres figured as lotuses, with petal counts.",
    threads: ["cakras-lotuses"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis: "A cited passage, and whether the petal counts are stable across the earliest witnesses.",
  },
  {
    key: "granthis",
    name: "Granthis",
    what: "Knots along the central channel that the ascending power must pierce.",
    threads: ["subtle-body", "ascent"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis: "A cited passage naming them, with how many and where.",
  },
  {
    key: "cakra-piercing",
    name: "Piercing of the cakras",
    what: "The ascent described as passing through the centres in sequence.",
    threads: ["cakras-lotuses", "ascent"],
    earliestAbsentReason:
      "NOT ESTABLISHED, and kept separate from both cakras and ascent. Centres can exist without being pierced, and an ascent can be described without them; the combination is its own development.",
    whatWouldEstablishThis: "A passage describing the movement through the centres, not merely listing them.",
  },
  {
    key: "sahasrara",
    name: "Sahasrāra",
    what: "The thousand-petalled centre at the crown, by name.",
    threads: ["crown-head", "cakras-lotuses"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis: "A cited passage naming it, distinguished from a general crown destination.",
  },
  {
    key: "ajna",
    name: "Ājñā",
    what: "The centre at the brow, by name.",
    threads: ["inner-eye-forehead", "cakras-lotuses"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis: "A cited passage naming it. Modern third-eye readings are a separate and later question.",
  },
  {
    key: "inner-fire",
    name: "Inner heat",
    what: "Heat generated in the body by practice, as against ritual fire outside it.",
    threads: ["inner-fire"],
    earliestAbsentReason:
      "NOT ESTABLISHED HERE, and likely to be among the oldest rows in this table. Vedic tapas is the obvious precursor and the word itself means heat.",
    precursor: {
      text: "Vedic tapas",
      dateText: "Vedic period; not established here",
      whyDisputed:
        "Tapas is genuinely internal heat generated by practice, and it is genuinely old. Whether it is an ancestor of Tantric inner fire or a separate idea that the later tradition annexed is the question — and the same question arises again for Buddhist caṇḍālī and Tibetan tummo.",
    },
    whatWouldEstablishThis: "Textual references for tapas, and the scholarly argument for or against continuity into Tantric heat practice.",
  },
  {
    key: "prana",
    name: "Prāṇa",
    what: "Vital breath or life force, as something that moves in the body.",
    threads: ["breath-vital-force"],
    earliestAbsentReason: "NOT ESTABLISHED HERE. Vedic and Upaniṣadic material is the place to look and none has been read.",
    whatWouldEstablishThis: "Exact textual references, with the terms used and their dating claims.",
  },
  {
    key: "breath-retention",
    name: "Breath retention",
    what: "Deliberate holding of the breath as a technique.",
    threads: ["breath-vital-force", "yoga"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis:
      "The earliest text describing the technique, as distinct from the earliest text describing breath as a principle.",
  },
  {
    key: "amrta",
    name: "Amṛta",
    what: "The nectar of immortality, in the subtle-body sense of something produced or preserved internally.",
    threads: ["immortality", "inner-fire"],
    earliestAbsentReason:
      "NOT ESTABLISHED. Amṛta is old as a mythological substance; the question here is the internal, bodily sense, which may be much later.",
    whatWouldEstablishThis:
      "A passage using it of something in the body. The mythological sense is a different row and should not be allowed to date this one.",
  },
  {
    key: "shiva-shakti-union",
    name: "Union of Śiva and Śakti at the crown",
    what: "The ascent completed as a union of two principles.",
    threads: ["kundalini-shakti", "crown-head"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis: "A cited passage describing the union as the goal of the ascent.",
  },
  {
    key: "liberation-through-ascent",
    name: "Liberation through the ascent",
    what: "The rising as the means of liberation, rather than as an experience or a power.",
    threads: ["ascent", "kundalini-shakti"],
    earliestAbsentReason: "NOT ESTABLISHED.",
    whatWouldEstablishThis:
      "A passage making the soteriological claim. A text can describe the ascent without making it the path to liberation, and the difference matters.",
  },
];

// ---------------------------------------------------------------------------
// READING THE TABLE
//
// These are functions rather than sentences in a component for the usual
// reason: a sentence can be written without checking, and the test runner
// cannot import a .tsx file.
// ---------------------------------------------------------------------------

/** Elements with an earliest attestation established here. */
export function establishedElements(elements: readonly KundaliniElement[] = KUNDALINI_ELEMENTS): KundaliniElement[] {
  return elements.filter((element) => Boolean(element.earliest));
}

/** Elements with nothing established — currently all of them. */
export function openElements(elements: readonly KundaliniElement[] = KUNDALINI_ELEMENTS): KundaliniElement[] {
  return elements.filter((element) => !element.earliest);
}

/** Elements with a disputed earlier precursor attached. */
export function elementsWithPrecursor(
  elements: readonly KundaliniElement[] = KUNDALINI_ELEMENTS
): KundaliniElement[] {
  return elements.filter((element) => Boolean(element.precursor));
}

/** Every element carrying a given thread tag. */
export function elementsInThread(
  thread: string,
  elements: readonly KundaliniElement[] = KUNDALINI_ELEMENTS
): KundaliniElement[] {
  return elements.filter((element) => element.threads.includes(thread));
}

/**
 * THE SPREAD, once there is one.
 *
 * The collection's payoff in one number: how many centuries separate the
 * earliest established element from the latest. Null while fewer than two
 * elements are established, because a spread across one point is not a spread
 * and a component that displayed "0 years" would be asserting that everything
 * arrived at once.
 */
export function establishedSpread(elements: readonly KundaliniElement[] = KUNDALINI_ELEMENTS): {
  earliest: KundaliniElement;
  latest: KundaliniElement;
  years: number;
} | null {
  const dated = establishedElements(elements).filter((element) => typeof element.earliest?.startYear === "number");
  if (dated.length < 2) return null;
  const sorted = [...dated].sort((a, b) => (a.earliest!.startYear ?? 0) - (b.earliest!.startYear ?? 0));
  const earliest = sorted[0];
  const latest = sorted[sorted.length - 1];
  return {
    earliest,
    latest,
    years: (latest.earliest!.startYear ?? 0) - (earliest.earliest!.startYear ?? 0),
  };
}

/**
 * How complete the table is, for a reader who should be told before they read
 * it rather than after.
 */
export function tracebackProgress(elements: readonly KundaliniElement[] = KUNDALINI_ELEMENTS): {
  total: number;
  established: number;
  open: number;
  withPrecursor: number;
} {
  return {
    total: elements.length,
    established: establishedElements(elements).length,
    open: openElements(elements).length,
    withPrecursor: elementsWithPrecursor(elements).length,
  };
}
