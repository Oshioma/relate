// THE SERPENT, KUNDALINI AND SACRED ASCENT.
//
// WHAT THIS COLLECTION IS FOR. One question: how old is the idea of a spiritual
// power rising through the human body, and why do serpents, staffs, trees, fire
// and ascent keep turning up in sacred traditions that had no contact with one
// another?
//
// WHAT IT MUST NOT DO, AND THE REASON IT IS BUILT THE WAY IT IS. Serpent
// imagery is close to universal. Vertical-axis imagery is close to universal.
// So it is trivially easy to assemble a hundred striking objects and let the
// pile do the arguing — to turn "looks remarkably similar" into "therefore they
// are connected" without any single record ever saying so. That conversion
// happens in the gaps between records, which is why it has to be prevented in
// the schema rather than in the prose.
//
// TWO FIELDS DO THAT WORK, and they are deliberately separate:
//
//   kundaliniRelation    what this record CLAIMS — explicit Kundalini, a
//                        historical precursor, a related tradition, a
//                        cross-cultural parallel, a speculative reading, or a
//                        modern development.
//
//   transmissionStatus   whether anything is actually shown to have TRAVELLED.
//
// The second is not a qualifier on the first. A record can honestly be a
// resemblance between two cultures that demonstrably met — that is the
// commonest position in this file, and without two fields it cannot be stated
// at all. A test forbids the one combination that does the damage: claiming a
// historical connection while recording that nothing shows the cultures ever
// met.
//
// NEITHER FIELD IS A CONFIDENCE SCORE. "Cross-cultural parallel" is not 30%
// Kundalini. It is a different kind of statement, not a weaker degree of the
// same one.
//
// THE EQUAL AND OPPOSITE ERROR, which this file is also built against:
// dismissing a correspondence because no mechanism has been found. An unusual
// resemblance is not refuted by the absence of a trade route. Speculative
// readings are kept, labelled, and left for a reader to weigh.
//
// ON DATES. The same rule as everywhere in this timeline: an event has no date,
// and claims carry them. Here it bites twice over, because almost every record
// has to distinguish the date of an OBJECT from the date of the TEXT it
// carries, and the date of a MANUSCRIPT from the date of the composition it
// preserves. A seal has a stratum; a doctrine does not.
//
// ON WHAT IS NOT HERE YET. This file is the foundation of a collection intended
// to run to seventy-five records or more. It was begun in an environment that
// could not reach a museum catalogue, an excavation report or a journal, so
// every record below carries NEEDS SOURCE VERIFICATION naming exactly what must
// be read. That is not a placeholder for content — the records state real
// questions and real disagreements — but no object number, seal number or
// figure reference in this file has been checked, and several are deliberately
// absent rather than guessed.

import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";
import { commonsFilePathUrl, commonsFilePageUrl } from "./check-pictures";

export const SERPENT_KUNDALINI_ANCHOR_SLUG = "pashupati-seal";

export const SERPENT_KUNDALINI_TRACK: SeedTrack = {
  name: "The serpent, Kundalini and sacred ascent",
  slug: "serpent-kundalini",
  kind: "theme",
  color: "#2f8f6b",
};

const commons = (file: string, width = 1200) => commonsFilePathUrl(file, width);
const commonsPage = (file: string) => commonsFilePageUrl(file);

/**
 * THEMATIC THREADS, as tags rather than as a second taxonomy.
 *
 * A reader should be able to follow "serpent and staff" across five thousand
 * years and four continents, or "inner fire" from Vedic tapas to Tibetan
 * practice, without the collection asserting that either sequence is a lineage.
 * Tags do that: they group without claiming descent, which is exactly the
 * relationship this material is in.
 */
export const SERPENT_THREADS = {
  serpent: "serpent",
  serpentStaff: "serpent-and-staff",
  sacredTree: "sacred-tree-world-axis",
  innerFire: "inner-fire",
  breath: "breath-vital-force",
  subtleBody: "subtle-body",
  ascent: "ascent",
  innerEye: "inner-eye-forehead",
  crown: "crown-head",
  illumination: "illumination",
  immortality: "immortality",
  rebirth: "death-and-rebirth",
  cakras: "cakras-lotuses",
  kundalini: "kundalini-shakti",
  yoga: "yoga",
} as const;

export const SERPENT_KUNDALINI_SOURCES: SeedSource[] = [
  {
    key: "vian_1952_gigantomachy",
    title: "The Gigantomachy in Greek art",
    author: "Francis Vian",
    reference: "Cited in this repository's Greek giants dataset for the date at which the Gigantes become serpent-legged",
    sourceType: "academic_paper",
    publishedYear: 1952,
    notes:
      "NOT READ HERE, AND CITED AT ONE REMOVE, which is stated because it matters. This dataset takes the " +
      "post-380 BCE date for the serpent-legged Gigantes from the record `gigantes-gigantomachy` in this " +
      "repository's Greek giants collection, where it was entered against Vian. The underlying work has not " +
      "been opened by this collection.\n\n" +
      "WHY A SECOND-HAND CITATION IS WORTH HAVING ANYWAY: this is the collection's only DATED case of " +
      "serpent iconography arriving late and traceably inside a single culture, and a serpent collection " +
      "without such a case can only argue in one direction.\n\n" +
      "NEEDS SOURCE VERIFICATION for Vian's own wording and for how firm the art-historical consensus on " +
      "the date actually is.",
  },
  {
    key: "egyptian_serpent_adversary",
    title: "Apep as the adversary, and Set as the god who kills him",
    reference: "Cited from this repository's Set/Sutekh dataset, where the iconography was entered with its objects",
    sourceType: "religious_text",
    notes:
      "A CROSS-REFERENCE RATHER THAN A NEW SOURCE. The Egyptian material this collection needs already sits " +
      "in the record `set-spears-apep`: Set spearing the serpent Apep from the solar barque, with a " +
      "photograph of the scene attached there.\n\n" +
      "WHAT IT CONTRIBUTES TO A KUNDALINI COLLECTION, which is not what a reader expects. In Egypt the " +
      "serpent in this role is the ENEMY — destroyed nightly so that the sun can rise — and the god doing " +
      "the destroying is Set, the one later writers call the Egyptian Satan. There is no coil at the base of " +
      "anything, no ascent, and no awakening. It is a serpent tradition that the Kundalini reading has no " +
      "purchase on at all.\n\n" +
      "NEEDS SOURCE VERIFICATION for the individual texts and spells, which are not cited by number either " +
      "here or in the Set dataset.",
  },
  {
    key: "marshall_mohenjo_daro",
    title: "Mohenjo-daro and the Indus Civilization",
    author: "John Marshall",
    reference: "London, 1931. The seal discussed in the chapter on religion",
    sourceType: "academic_paper",
    publishedYear: 1931,
    notes:
      "NOT READ. The excavation report in which the seated figure of the seal now called the Pashupati seal " +
      "was identified as a prototype of Śiva. Cited as THE ORIGIN OF AN IDENTIFICATION rather than as " +
      "authority for it: almost everything written about this object since is either an extension of " +
      "Marshall's reading or an answer to it, and a reader should be able to find where it started.\\n\\n" +
      "NEEDS SOURCE VERIFICATION throughout, and specifically for Marshall's own wording, which matters: " +
      "there is a large difference between proposing a resemblance and asserting an identification, and " +
      "this dataset does not currently know which he did.",
  },
  {
    key: "indus_seal_criticism",
    title: "The scholarly criticism of the proto-Śiva identification",
    reference: "A body of literature rather than one work; Doris Srinivasan and Herbert Sullivan among the critics",
    sourceType: "academic_paper",
    notes:
      "NOT READ, AND NAMED SO IT CANNOT BE SKIPPED. The proto-Śiva reading has been argued against on " +
      "iconographic grounds for decades — the horned headdress, the possibly bovine features, the seating " +
      "convention, the absence of corroborating attributes. A collection that recorded Marshall's proposal " +
      "and not the answers to it would be presenting a contested reading as the settled one.\\n\\n" +
      "NEEDS SOURCE VERIFICATION: individual publications, their arguments and their dates. This source " +
      "entry is a placeholder for a real bibliography and is marked as one.",
  },
  {
    key: "gudea_libation_vase",
    title: "The libation vase of Gudea",
    reference: "Lagash / Girsu; commonly dated to about 2100 BCE; the object is in the Louvre",
    sourceType: "historical_document",
    notes:
      "NOT READ. The object most often placed beside a Kundalini diagram in popular writing, on the " +
      "strength of two serpents entwined about a central vertical element. Cited here for the OBJECT, and " +
      "the dataset holds almost nothing about it that has been checked: not the accession number, not the " +
      "excavation context, not the inscription, and not what Assyriologists call the central element.\\n\\n" +
      "NEEDS SOURCE VERIFICATION, and three questions rank above the rest: what the inscription actually " +
      "says, whether the entwined-serpent motif is attested elsewhere in Mesopotamian art, and what " +
      "Ningishzida's role in the religion actually was.",
  },
  {
    key: "hatley_kundalini_2016",
    title: "Kuṇḍalinī",
    author: "Shaman Hatley",
    workTitle: "Encyclopedia of Indian Religions",
    reference: "Entry prepared for Encyclopedia of Indian Religions, ed. Arvind Sharma; early history section",
    sourceType: "encyclopedia",
    publishedYear: 2016,
    notes:
      "READ FOR THE EARLY-HISTORY CLAIM. Hatley states that kuṇḍalinī first comes into evidence in circa " +
      "sixth-to-eighth-century scriptures of Tantric Śaivism, and calls Sārdhatriśatikālottara 12.1–2 a " +
      "potentially very early reference. He does NOT claim in this entry that this passage is demonstrably " +
      "the single earliest occurrence. That distinction is preserved here.",
  },
  {
    key: "williams_cosmogenesis_2023",
    title: "Cosmogenesis and Phonematic Emanation",
    author: "Ben Williams",
    workTitle: "The Oxford Handbook of Tantric Studies",
    reference: "Oxford University Press, 2023, note 37; Sārdhatriśatikālottara 12.1–3, 12.5–6ab",
    sourceType: "academic_book",
    publishedYear: 2023,
    notes:
      "READ FOR THE PASSAGE. Williams prints the Sanskrit of Sārdhatriśatikālottara 12.1–3 and 12.5–6ab " +
      "and supplies an English translation. Verses 12.1–2 name ādyā kuṇḍalinī, place her in the heart, " +
      "describe a sprout-like form, and instruct visualization of flowing amṛta. Clarifications in brackets " +
      "are explicitly supplied from Rāmakaṇṭha's commentary.",
  },
  {
    key: "westoby_body_2024",
    title: "The body in early haṭha yoga",
    author: "Ruth Westoby",
    publisher: "SOAS University of London",
    reference: "PhD thesis, 2024; genealogy of Kuṇḍalinī in Śaiva sources",
    sourceType: "academic_book",
    publishedYear: 2024,
    notes:
      "READ FOR CHRONOLOGICAL CONTEXT. Westoby describes the Sārdhatriśatikālottara as sixth-to-seventh " +
      "century and says it contains an early reference to kuṇḍalinī. This supports an approximate period " +
      "for the textual witness, not a precise composition year and not proof that no earlier occurrence existed.",
  },
  {
    key: "bang_tantrasadbhava_2022",
    title: "Selected Chapters from the Tantrasadbhāva",
    author: "Junglan Bang",
    publisher: "Universität Hamburg",
    reference: "PhD dissertation, 2022; Tantrasadbhāva chapter 1, especially 1.252cd",
    url: "https://ediss.sub.uni-hamburg.de/bitstream/ediss/9642/1/Dissertation_Bang_TaSa.pdf",
    sourceType: "academic_book",
    publishedYear: 2022,
    notes:
      "READ FOR THE PRIMARY-TEXT READING. Bang's critical study states that the yogin awakens Śakti in " +
      "the form of a sleeping serpent, Kuṇḍalī, and cites Tantrasadbhāva 1.252cd directly: nābhisthā " +
      "kuṇḍalī jñeyā prasuptabhujagākṛtiḥ. Bang contrasts early Saiddhāntika heart-location material with " +
      "the Tantrasadbhāva's belly/navel location.",
  },
  {
    key: "westoby_snake_woman_2024",
    title: "Kuṇḍalinī in the Haṭha sources: snake woman (uragāṅganā)",
    author: "Ruth Westoby",
    publisher: "SOAS University of London",
    reference: "The body in early haṭha yoga, PhD thesis, 2024; discussion of Tantrasadbhāva 1.56, 1.215 and 1.216–217",
    url: "https://www.wisdomlib.org/hinduism/essay/the-body-in-early-hatha-yoga/d/doc1500797.html",
    sourceType: "academic_book",
    publishedYear: 2024,
    notes:
      "READ FOR THE HISTORICAL SYNTHESIS. Westoby dates the Tantrasadbhāva to the eighth century, reports " +
      "1.56 as describing Kuṇḍalinī as curved (kuṭilākṛtiḥ), and 1.215 as Śakti in the heart in snake form. " +
      "She reports Shaman Hatley's suggestion (2022:823) that this might be the first such snake-form " +
      "description. Elsewhere in the thesis she identifies 1.216–217 as a sleeping-snake passage. The " +
      "priority claim is therefore kept as a specialist suggestion, not promoted to certainty.",
  },
  {
    key: "chandogya_8_6_6",
    title: "Chāndogya Upaniṣad 8.6.6",
    reference: "8.6.6; the 101 nāḍīs of the heart and the single upward route to the head",
    sourceType: "religious_text",
    notes:
      "READ FOR THE PASSAGE. The Sanskrit says there are one hundred and one nāḍīs of the heart; one " +
      "extends to the head (mūrdhan), and going upward by it one reaches immortality (amṛtatvam). The verse " +
      "does not itself name that channel Suṣumṇā, nor does it mention Kuṇḍalinī, Iḍā, Piṅgalā, cakras or a serpent.",
  },
  {
    key: "katha_2_3_16",
    title: "Kaṭha Upaniṣad 2.3.16",
    reference: "2.3.16; parallel 101-nāḍī formula",
    sourceType: "religious_text",
    notes:
      "READ FOR THE PASSAGE. The verse preserves the same core formula: one hundred and one nāḍīs of the " +
      "heart, one reaching the head, upward movement through it, and immortality. This is strong evidence " +
      "for an early channel-and-ascent precursor, but the verse itself does not call the channel Suṣumṇā or " +
      "describe a rising serpent power.",
  },
  {
    key: "sankara_katha_2_3_16",
    title: "Śaṅkara's commentary on Kaṭha Upaniṣad 2.3.16",
    author: "Śaṅkara",
    reference: "Commentary to Kaṭha Upaniṣad 2.3.16; later identification of the upward channel as suṣumṇā",
    sourceType: "religious_text",
    notes:
      "READ FOR THE INTERPRETIVE LAYER. The commentary identifies the one upward nāḍī as suṣumṇā. This is " +
      "kept separate from the older verse because importing the commentary's name into the Upaniṣadic text " +
      "would erase the chronology the timeline is trying to show.",
  },
  {
    key: "mallinson_goraksasataka_2011",
    title: "The Original Gorakṣaśataka",
    author: "James Mallinson",
    workTitle: "Yoga in Practice",
    publisher: "Princeton University Press",
    reference: "2011, pp. 257–272; Sanskrit witness discussed alongside Mallinson's translation and textual study",
    sourceType: "academic_book",
    publishedYear: 2011,
    notes:
      "READ FOR THE TEXTUAL-HISTORICAL CLAIM. Mallinson's study presents the original Gorakṣaśataka as an " +
      "early source for Haṭhayoga techniques and Kuṇḍalinī practice. The text names iḍā, piṅgalā and suṣumṇā, " +
      "locates them left, right and centre, and describes awakened Kuṇḍalī rising through suṣumṇā. Dating of " +
      "the text is not exact; later scholarship treats its core as medieval, around the thirteenth/fourteenth century.",
  },
  {
    key: "gretil_goraksasataka",
    title: "Gorakṣaśataka Sanskrit e-text",
    publisher: "Göttingen Register of Electronic Texts in Indian Languages, SUB Göttingen",
    reference: "GorS 18, 20, 23, 30–31; based on Kuvalayananda and Shukla's critical edition",
    sourceType: "historical_document",
    notes:
      "READ FOR THE SANSKRIT PASSAGES. GorS 18 names iḍā, piṅgalā and suṣumṇā; GorS 20 places iḍā on the " +
      "left, piṅgalā on the right and suṣumṇā in the middle; GorS 23 associates the triad with moon, sun and " +
      "fire; GorS 30–31 describes coiled Kuṇḍalī-śakti and her upward movement through suṣumṇā after awakening.",
  },
  {
    key: "westoby_goraksasataka_date_2024",
    title: "The body in early haṭha yoga",
    author: "Ruth Westoby",
    publisher: "SOAS University of London",
    reference: "PhD thesis, 2024; discussion of the Gorakṣaśataka and Vivekamārtaṇḍa",
    sourceType: "academic_book",
    publishedYear: 2024,
    notes:
      "READ FOR DATING CAUTION. Westoby reports Mallinson's tentative dating of the central core of the " +
      "Gorakṣaśataka to around 1400 and stresses the manuscript and recension problems. This record therefore " +
      "uses a broad medieval range rather than presenting an exact composition year.",
  },
  {
    key: "leadbeater_chakras_1927",
    title: "The Chakras",
    author: "C. W. Leadbeater",
    reference: "1927; Fig. 4, The Spinal Channels",
    url: "https://www.theosophy.world/sites/default/files/ebooks/Chakras-CWL.pdf",
    sourceType: "historical_document",
    publishedYear: 1927,
    notes:
      "READ FOR THE MODERN VISUAL-GENEALOGY CLAIM. Leadbeater's Fig. 4 explicitly diagrams Iḍā, Piṅgalā and " +
      "Suṣumṇā and then presents a caduceus-like figure. His text says the spine/Brahmadanda is the original " +
      "of Mercury's caduceus and interprets its two snakes as Kundalini or serpent-fire moving in the channels. " +
      "This is direct evidence for a twentieth-century esoteric caduceus comparison, not evidence that ancient " +
      "Greek caduceus imagery historically derived from Indian subtle-body doctrine.",
  },
  {
    key: "modern_nadi_geometry_caution",
    title: "Iḍā and Piṅgalā: modern crossing-channel description and textual caution",
    publisher: "YinYoga.com",
    reference: "Modern overview noting that the crossing pattern is widely taught but not detailed in the yogic texts it surveys",
    url: "https://yinyoga.com/yinsights/ida-and-pingala/",
    sourceType: "website",
    notes:
      "READ AS A MODERN SECONDARY CAUTION, not as an authority for ancient chronology. The page describes the " +
      "familiar modern pattern in which Iḍā and Piṅgalā switch sides at cakras and form a caduceus-like geometry, " +
      "while also reporting that the yogic texts surveyed do not describe the channels crossing at the cakras. " +
      "It therefore helps separate a modern visual convention from the medieval named-channel evidence.",
  },
];

export const SERPENT_KUNDALINI_EVENTS: SeedEvent[] = [
  {
    slug: "goraksasataka-ida-pingala-sushumna-kundalini",
    title: "Iḍā, Piṅgalā and Suṣumṇā become an explicit Kundalini route",
    summary:
      "The medieval Gorakṣaśataka explicitly names Iḍā, Piṅgalā and Suṣumṇā, places them left, right and centre, and describes awakened Kuṇḍalī rising through Suṣumṇā.",
    description:
      "THE NAMED-CHANNEL STAGE. Gorakṣaśataka 18 names iḍā, piṅgalā and suṣumṇā among the principal nāḍīs. " +
      "Verse 20 places iḍā on the left, piṅgalā on the right and suṣumṇā in the middle; verse 23 associates " +
      "the three with moon, sun and fire. Verses 30–31 then describe Kuṇḍalī-śakti as coiled and, once " +
      "awakened, moving upward through suṣumṇā.\n\n" +
      "WHY THIS IS A DIFFERENT RECORD FROM THE UPANIṢADIC PRECURSOR. Chāndogya 8.6.6 and Kaṭha 2.3.16 " +
      "already supplied an unnamed privileged upward channel from the heart to the head. Here the channels " +
      "are explicitly named and differentiated, and Kuṇḍalī's ascent is explicitly routed through suṣumṇā.\n\n" +
      "WHAT THIS DOES NOT CLAIM. The verses do not by themselves establish that the familiar modern image " +
      "of Iḍā and Piṅgalā repeatedly crossing around Suṣumṇā like a caduceus or DNA double helix was intended. " +
      "Named left/right/central channels are direct textual evidence; the modern graphic geometry requires " +
      "its own source history.",
    category: "religion",
    subcategory: "Haṭhayoga",
    eventType: "religious_account",
    identificationStatus: "secure",
    kundaliniRelation: "explicit_kundalini",
    transmissionStatus: "not_applicable",
    tags: [
      SERPENT_THREADS.subtleBody,
      SERPENT_THREADS.ascent,
      SERPENT_THREADS.kundalini,
      SERPENT_THREADS.yoga,
      "nadi",
      "ida",
      "pingala",
      "sushumna",
    ],
    civilisations: ["India"],
    claims: [
      {
        sourceKey: "mallinson_goraksasataka_2011",
        citations: [
          {
            sourceKey: "gretil_goraksasataka",
            relation: "supports",
            note:
              "Sanskrit witness: GorS 18, 20 and 23 name and position the triad; GorS 30–31 describes awakened Kuṇḍalī rising through suṣumṇā.",
          },
          {
            sourceKey: "westoby_goraksasataka_date_2024",
            relation: "context",
            note:
              "Dating remains approximate: Westoby reports Mallinson's tentative dating of the central core to around 1400.",
          },
        ],
        startYear: 1200,
        endYear: 1400,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The medieval textual layer represented by the Gorakṣaśataka",
        originalDateText: "medieval; approximately thirteenth to fourteenth century, with the central core tentatively placed around 1400",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "The dating is deliberately broad because the textual and manuscript history is difficult. The " +
          "doctrinal content is direct: the Sanskrit names iḍā, piṅgalā and suṣumṇā, locates them left/right/centre, " +
          "and describes awakened Kuṇḍalī moving upward through suṣumṇā.",
        notes:
          "KEY PASSAGES: GorS 18 iḍā ca piṅgalā caiva suṣumṇā ca tṛtīyakā; GorS 20 iḍā vāme ... piṅgalā " +
          "dakṣiṇe ... suṣumṇā madhya-deśe; GorS 31 vrajaty ūrdhvaṃ suṣumṇayā. This fills the named-channel " +
          "evidence without projecting later double-helix imagery backward.",
      },
    ],
    media: [],
  },

  {
    slug: "upanishadic-heart-nadis-upward-immortality",
    title: "One heart-channel rises to the head",
    summary:
      "Chāndogya Upaniṣad 8.6.6 and Kaṭha Upaniṣad 2.3.16 describe 101 nāḍīs of the heart, one extending upward to the head; ascent by that route leads to immortality.",
    description:
      "EARLY PRECURSOR, NOT YET THE LATER KUNDALINI SYSTEM. Chāndogya Upaniṣad 8.6.6 says that the heart " +
      "has one hundred and one nāḍīs, that one extends to the head, and that one going upward by it reaches " +
      "immortality. Kaṭha Upaniṣad 2.3.16 preserves essentially the same formula.\n\n" +
      "WHAT THIS ESTABLISHES. The text itself gives nāḍīs, a heart locus, a privileged upward route to the " +
      "head, and immortality as its destination. These are genuine early components relevant to the later " +
      "subtle-body ascent tradition.\n\n" +
      "WHAT IT DOES NOT ESTABLISH. Neither verse names this channel Suṣumṇā or mentions Kuṇḍalinī, Iḍā, " +
      "Piṅgalā, cakras, a base-of-spine locus or a serpent. Śaṅkara's later commentary on Kaṭha 2.3.16 " +
      "identifies the upward channel as suṣumṇā; that is recorded as a later interpretive layer rather than " +
      "silently inserted into the older verse.",
    category: "religion",
    subcategory: "Early Upaniṣads",
    eventType: "religious_account",
    identificationStatus: "secure",
    kundaliniRelation: "historical_precursor",
    transmissionStatus: "not_applicable",
    tags: [
      SERPENT_THREADS.subtleBody,
      SERPENT_THREADS.ascent,
      SERPENT_THREADS.crown,
      SERPENT_THREADS.immortality,
      "nadi",
      "heart",
      "upanishads",
    ],
    civilisations: ["India"],
    claims: [
      {
        sourceKey: "chandogya_8_6_6",
        citations: [
          {
            sourceKey: "katha_2_3_16",
            relation: "supports",
            note:
              "Kaṭha Upaniṣad 2.3.16 preserves essentially the same 101-heart-nāḍī, upward-to-head, immortality formula.",
          },
          {
            sourceKey: "sankara_katha_2_3_16",
            relation: "context",
            note:
              "LATER INTERPRETATION: Śaṅkara names the privileged upward channel suṣumṇā; the underlying Upaniṣadic verse does not.",
          },
        ],
        startYear: -700,
        endYear: -300,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The early Upaniṣadic channel-and-upward-ascent textual layer",
        originalDateText: "first millennium BCE; exact relative dating of the parallel passages remains debated",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "The date range positions the early Upaniṣadic textual layer broadly rather than pretending to " +
          "a precise year. The evidential point of this record rests on the directly preserved wording of " +
          "Chāndogya 8.6.6 and Kaṭha 2.3.16, not on assigning either verse an exact composition date.",
        notes:
          "DIRECT TEXTUAL FEATURES: hṛdayasya nāḍyaḥ (nāḍīs of the heart), one reaching mūrdhan (the head), " +
          "ūrdhvam āyan (going upward), and amṛtatvam eti (reaches immortality). The verse does not itself " +
          "supply the later name suṣumṇā.",
      },
    ],
    media: [],
  },

  {
    slug: "tantrasadbhava-sleeping-serpent-kundali",
    title: "Kuṇḍalī takes the form of a sleeping serpent",
    summary:
      "The eighth-century Tantrasadbhāva is an early witness to explicitly serpentine Kuṇḍalī: its first chapter describes Śakti as curved and snake-shaped, and directly describes Kuṇḍalī at the navel as having the appearance of a sleeping serpent.",
    description:
      "TEXTUAL DEVELOPMENT. This record is deliberately later and more specific than the Sārdhatriśatikālottara heart-Kuṇḍalinī witness. Junglan Bang's critical study cites Tantrasadbhāva 1.252cd: " +
      "'nābhisthā kuṇḍalī jñeyā prasuptabhujagākṛtiḥ' — Kuṇḍalī is located at the navel/belly and has the " +
      "appearance of a sleeping serpent. Bang explains this in a practice in which the yogin first awakens " +
      "Śakti in the form of a sleeping serpent.\n\n" +
      "OTHER EARLY SERPENT LANGUAGE. Ruth Westoby reports 1.56 describing Kuṇḍalinī as curved " +
      "(kuṭilākṛtiḥ), 1.215 describing Śakti in the heart in snake form, and 1.216–217 as a sleeping-snake " +
      "passage. She reports Shaman Hatley's suggestion that the 1.215 material may be the first explicit " +
      "snake-form description. That is preserved as a suggestion, not converted into a proven superlative.\n\n" +
      "STATUS. This securely advances the chain from an early Kuṇḍalinī witness to explicit serpent and " +
      "sleep/dormancy imagery. It still does not establish the complete later Haṭhayoga system of a serpent " +
      "coiled at Mūlādhāra rising through Suṣumṇā and seven cakras.",
    category: "religion",
    subcategory: "Tantric Śaivism",
    eventType: "religious_account",
    identificationStatus: "secure",
    kundaliniRelation: "explicit_kundalini",
    transmissionStatus: "not_applicable",
    tags: [
      SERPENT_THREADS.kundalini,
      SERPENT_THREADS.subtleBody,
      "tantric-shaivism",
      "tantrasadbhava",
      "sleeping-serpent",
      "navel",
      "shakti",
    ],
    civilisations: ["India"],
    claims: [
      {
        sourceKey: "westoby_snake_woman_2024",
        citations: [
          {
            sourceKey: "bang_tantrasadbhava_2022",
            relation: "supports",
            note:
              "Bang supplies the directly checkable Sanskrit at Tantrasadbhāva 1.252cd and explains it as Kuṇḍalī in sleeping-serpent form.",
          },
        ],
        startYear: 700,
        endYear: 799,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The Tantrasadbhāva witness to explicitly serpentine and sleeping Kuṇḍalī",
        originalDateText: "eighth century",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "Westoby dates the Tantrasadbhāva to the eighth century and identifies its early serpent-form " +
          "Kuṇḍalinī material. Bang's critical study supplies a directly checkable sleeping-serpent verse " +
          "from chapter 1. The century is an approximate textual date, not a precise composition year.",
        notes:
          "DIRECT PASSAGE: Tantrasadbhāva 1.252cd: nābhisthā kuṇḍalī jñeyā prasuptabhujagākṛtiḥ. " +
          "This establishes sleeping-serpent imagery and a navel/belly locus. Westoby separately reports " +
          "1.215 as Śakti in the heart in snake form and Hatley's suggestion that it may be the first such " +
          "description; that relative-priority question remains open.",
      },
    ],
    media: [],
  },

  {
    slug: "sardhatrisatikalottara-primordial-kundalini",
    title: "A primordial Kuṇḍalinī in the heart",
    summary:
      "Sārdhatriśatikālottara 12.1–2 gives a very early textual witness to Kuṇḍalinī: primordial, associated with moon, fire and sun, situated in the heart in sprout-like form, with flowing amṛta.",
    description:
      "WHAT THE TEXT ACTUALLY SAYS. Sārdhatriśatikālottara 12.1 begins candrāgniravisaṃyuktā ādyā " +
      "kuṇḍalinī tu yā and locates this kuṇḍalinī in the heart (hṛtpradeśe), in a sprout-like form " +
      "(aṅkurākāravat). The following verse instructs visualization of flowing amṛta. Ben Williams prints " +
      "the Sanskrit and translates this passage in The Oxford Handbook of Tantric Studies.\n\n" +
      "WHY THIS MATTERS. This is not yet the familiar later picture of a sleeping serpent coiled at the " +
      "base of the spine. Hatley calls 12.1–2 a potentially very early reference and places the first " +
      "evidence for kuṇḍalinī generally in Tantric Śaiva scriptures of roughly the sixth to eighth centuries. " +
      "Westoby treats this text as sixth-to-seventh century and likewise calls its kuṇḍalinī reference early.\n\n" +
      "WHAT THIS RECORD DOES NOT CLAIM. It does not call 12.1–2 the proven first occurrence of the word. " +
      "Hatley's wording is deliberately more cautious, and the relative chronology of early Śaiva tantras " +
      "is not secure enough to turn 'potentially very early' into 'the earliest'. It also does not turn " +
      "kuṇḍalinī into an explicit serpent here. The word/coiled-power question and the explicit-serpent " +
      "question remain separate.",
    category: "religion",
    subcategory: "Tantric Śaivism",
    eventType: "religious_account",
    identificationStatus: "secure",
    kundaliniRelation: "explicit_kundalini",
    transmissionStatus: "not_applicable",
    tags: [
      SERPENT_THREADS.kundalini,
      SERPENT_THREADS.subtleBody,
      SERPENT_THREADS.immortality,
      "tantric-shaivism",
      "sardhatrisatikalottara",
      "heart",
      "amrta",
    ],
    civilisations: ["India"],
    claims: [
      {
        sourceKey: "westoby_body_2024",
        citations: [
          {
            sourceKey: "hatley_kundalini_2016",
            relation: "context",
            note:
              "Hatley places the first evidence for kuṇḍalinī in circa sixth-to-eighth-century Tantric Śaiva scripture and calls this passage potentially very early, not securely first.",
          },
          {
            sourceKey: "williams_cosmogenesis_2023",
            relation: "supports",
            note:
              "Williams prints and translates Sārdhatriśatikālottara 12.1–2, directly establishing what the passage says.",
          },
        ],
        startYear: 500,
        endYear: 699,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The Sārdhatriśatikālottara textual witness to ādyā kuṇḍalinī",
        originalDateText: "sixth-to-seventh century",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "Ruth Westoby (2024) describes the Sārdhatriśatikālottara as sixth-to-seventh century. This claim " +
          "dates the textual witness only approximately. It does not assert a precise composition year or " +
          "that this is the first use of kuṇḍalinī anywhere.",
        notes:
          "PASSAGE: Sārdhatriśatikālottara 12.1–2. Williams 2023 prints: " +
          "'candrāgniravisaṃyuktā ādyā kuṇḍalinī tu yā | hṛtpradeśe tu sā jñeyā aṅkurākāravatsthitā ||' " +
          "and continues with the instruction to contemplate flowing amṛta. Translation and Sanskrit are " +
          "therefore directly sourced; priority remains explicitly open.",
      },
    ],
    media: [],
  },

  {
    slug: SERPENT_KUNDALINI_ANCHOR_SLUG,
    title: "The Pashupati seal: what is on it, and what has been read into it",
    summary:
      "A Mature Harappan seal showing a seated horned figure surrounded by animals. Everything else about it — the posture, the identity, the religion — is argument, and the script that might settle it cannot be read.",
    description:
      "WHAT KIND OF RECORD IS THIS? The anchor of the collection, and a deliberate demonstration of its " +
      "method: what is physically visible is separated from what people have said it means, and the second " +
      "list is longer than the first.\\n\\n" +
      "THE FACT THAT GOVERNS EVERYTHING HERE. THE INDUS SCRIPT IS UNDECIPHERED. Whatever signs this seal " +
      "carries cannot be read by anybody. So no reading of the figure can be confirmed from the object " +
      "itself, and every identification is an argument from iconography — from what the image resembles.\\n\\n" +
      "WHAT IS VISIBLE, as far as this dataset can state it without having opened a catalogue: a seated " +
      "figure, horned or wearing a horned headdress, with animals around it. THE PRECISE DESCRIPTION IS " +
      "EXACTLY WHAT THIS RECORD LACKS, and it is the thing to fix first. A description written from memory " +
      "would be the worst possible content for a record whose whole argument is that description and " +
      "interpretation must be kept apart.\\n\\n" +
      "WHAT HAS BEEN READ INTO IT. John Marshall, excavating Mohenjo-daro, proposed the figure as a " +
      "prototype of Śiva — a 'proto-Śiva', lord of animals. That reading is now roughly a century old, is " +
      "enormously influential, and has been argued against for decades on iconographic grounds: the " +
      "headdress, the possibly bovine features, the seating convention, the absence of corroborating " +
      "attributes elsewhere in Indus material.\\n\\n" +
      "AND THE READING THIS COLLECTION IS ACTUALLY ABOUT: that the posture is yogic. It is repeated " +
      "everywhere, usually without an argument attached. THE QUESTIONS THAT WOULD TEST IT are whether the " +
      "posture occurs elsewhere in Indus material, whether it occurs in contexts that are not obviously " +
      "religious, and whether Indus seated figures follow a convention that would explain it without any " +
      "reference to meditation at all.\\n\\n" +
      "WHAT THIS RECORD WILL NEVER SAY. That the Indus people practised Kundalini yoga, or anything that " +
      "implies it. There is no serpent on this seal, no evidence of a subtle body anywhere in Indus " +
      "material, and a script nobody can read.\\n\\n" +
      "THINGS TO ASK: If a posture looks like meditation to us, what would show that it meant meditation to " +
      "them? What would count as evidence either way?",
    category: "archaeology",
    subcategory: "Indus Valley",
    eventType: "disputed",
    identificationStatus: "disputed",
    kundaliniRelation: "speculative_esoteric",
    transmissionStatus: "no_contact_known",
    argumentsFor:
      "THE CASE, STATED AS ITS ADVOCATES WOULD: the figure is seated in a posture resembling those later " +
      "used in yoga; it is surrounded by animals in a way that recalls Śiva as Paśupati, lord of beasts; " +
      "and Indian religion has demonstrable continuities with the subcontinent's earlier material culture. " +
      "If a yogic tradition existed in the Indus cities, this is what a trace of it might look like.",
    argumentsAgainst:
      "THE CASE AGAINST, AND IT IS THE STRONGER ONE ON CURRENT EVIDENCE: the script is undeciphered, so no " +
      "reading can be checked against the object. The identification rests entirely on resemblance, and " +
      "resemblance to material two thousand years later. The horned headdress and possibly bovine features " +
      "point in other directions. Seated figures in Indus art may follow a convention that has nothing to " +
      "do with meditation. And NOTHING in Indus material attests a subtle body, channels, an inner fire or " +
      "a serpent power — so even a genuinely meditative posture would not establish the thing it is usually " +
      "produced to establish.",
    tags: [
      SERPENT_THREADS.yoga,
      SERPENT_THREADS.subtleBody,
      "indus-valley",
      "pashupati",
      "mohenjo-daro",
      "undeciphered",
      "contested-identification",
    ],
    civilisations: ["Indus Valley Civilisation"],
    locationName: "Mohenjo-daro, Sindh, Pakistan",
    claims: [
      {
        sourceKey: null,
        startYear: -2599,
        endYear: -1900,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The Mature Harappan period the seal belongs to",
        originalDateText: "Mature Harappan, roughly 2600-1900 BCE",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the period, not the seal. A seal's own date depends on the stratum it came from, " +
          "and this dataset does not have that stratum. The range entered is the conventional span of the " +
          "Mature Harappan phase and is a statement about the civilisation rather than about this object.",
        notes:
          "NEEDS SOURCE VERIFICATION, and this is the most basic gap on the record: the seal's excavation " +
          "number, its findspot, its level, its excavator and season, its material and size, and its " +
          "present museum and accession number. None of it is known here.",
      },
      {
        sourceKey: "marshall_mohenjo_daro",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether the seated figure is a proto-Śiva",
        originalDateText: "Proposed by Marshall in 1931; contested since",
        datingMethod: "stylistic_comparison",
        chronology: "disputed",
        evidence:
          "WHY THIS IS A CLAIM AND NOT A FACT: it is an argument from resemblance to material two millennia " +
          "later, made about an object whose own writing cannot be read. WHAT WOULD SETTLE IT: decipherment, " +
          "or corroborating iconography from a securely excavated context. Neither exists.",
        notes:
          "NEEDS SOURCE VERIFICATION for Marshall's actual wording — whether he proposed a resemblance or " +
          "asserted an identification — and for the individual publications arguing against.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether the posture is yogic",
        originalDateText: "Widely repeated; the supporting argument is rarely given",
        datingMethod: "stylistic_comparison",
        chronology: "disputed",
        evidence:
          "KEPT AS A SEPARATE CLAIM FROM THE PROTO-ŚIVA ONE, because they are separate and are routinely " +
          "merged. A figure could be seated in a meditative posture without being Śiva, and could be Śiva " +
          "without being in one.\\n\\n" +
          "WHAT WOULD TEST IT: whether the posture occurs elsewhere in Indus material; whether it occurs in " +
          "contexts that are not obviously religious; and whether Indus seated figures follow a convention " +
          "that explains it without reference to meditation. This dataset has none of those answers.",
        notes:
          "NEEDS SOURCE VERIFICATION. The comparative material on Indus seated postures is the single most " +
          "useful thing that could be added to this record.",
      },
    ],
    media: [
      {
        url: commons("Shiva_Pashupati.jpg"),
        sourcePageUrl: commonsPage("Shiva_Pashupati.jpg"),
        fileName: "Shiva Pashupati.jpg",
        originalFileUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Shiva_Pashupati.jpg",
        caption:
          "Seal M-304 from Mohenjo-daro, showing a seated horned figure surrounded by animals and Indus signs. The conventional file name says Pashupati, but the figure is not labelled Shiva or Pashupati on the object and that identification remains disputed.",
        kind: "image",
        shows: "artefact",
        institution: "National Museum, New Delhi",
        accessionNumber: "M-304",
        objectDate: "Mature Harappan period, about 2600-1900 BCE",
        licence: "Public domain",
        identificationStatus: "disputed",
        creditFrom: "source",
      },
      {
        url: commons("Pashupati_seal_impression.jpg"),
        sourcePageUrl: commonsPage("Pashupati_seal_impression.jpg"),
        fileName: "Pashupati seal impression.jpg",
        originalFileUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pashupati_seal_impression.jpg",
        caption:
          "Published 1935 impression of the seal conventionally called the Pashupati seal, reproduced by excavator Ernest J. H. Mackay. It gives a historically important second view of the same object; the Pashupati/proto-Shiva identification remains a later disputed interpretation.",
        kind: "image",
        shows: "engraving",
        creator: "Ernest John Henry Mackay",
        photographDate: "1935 publication",
        licence: "Public Domain Mark 1.0",
        identificationStatus: "disputed",
        creditFrom: "source",
      },
      {
        url: commons("Pashupati_Seal_from_the_Harappan_Civilization.jpg"),
        sourcePageUrl: commonsPage("Pashupati_Seal_from_the_Harappan_Civilization.jpg"),
        fileName: "Pashupati Seal from the Harappan Civilization.jpg",
        originalFileUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pashupati_Seal_from_the_Harappan_Civilization.jpg",
        caption:
          "Modern museum photograph of the Mohenjo-daro seal in the National Museum, New Delhi. The archaeological object is secure; identifying its central seated figure as Pashupati, Shiva or a yogi is a later interpretation and remains disputed.",
        kind: "image",
        shows: "artefact",
        institution: "National Museum, New Delhi",
        creator: "Aadrit28",
        photographDate: "4 February 2023",
        licence: "Creative Commons Attribution-ShareAlike 4.0 International",
        identificationStatus: "disputed",
        creditFrom: "source",
      }
    ],
  },

  {
    slug: "indus-script-undeciphered",
    title: "The Indus script cannot be read, and that governs everything above",
    summary:
      "Not an event, and given no date. Thousands of inscribed objects survive from the Indus cities, and nobody can read a line of them — which is why every identification in this section is an argument from resemblance.",
    description:
      "WHAT KIND OF RECORD IS THIS? A standing condition rather than something that happened, carrying a " +
      "positionless claim for exactly that reason. It is here because it is the single fact that decides how " +
      "much weight every other Indus record in this collection can bear.\\n\\n" +
      "THE SITUATION. The Indus civilisation left a very large number of inscribed seals, tablets and other " +
      "objects. The script on them is undeciphered. There is no bilingual text, no agreed underlying " +
      "language, and no consensus on whether the sequences encode a language at all — a serious minority " +
      "position holds that they may not.\\n\\n" +
      "WHY IT MATTERS SO MUCH HERE. Everything this collection wants to know about Indus religion is the " +
      "kind of thing writing would tell us and images will not. Whether a seated figure is a god, a " +
      "ruler, a priest or a scene from a story; whether a posture is meditative; whether a serpent is divine " +
      "or dangerous or decorative — these are questions text answers and iconography only suggests.\\n\\n" +
      "SO EVERY INDUS IDENTIFICATION IN THIS COLLECTION IS AN ARGUMENT FROM RESEMBLANCE, and resemblance to " +
      "material from a much later period. That is not a reason to exclude the material. It is a reason to " +
      "mark it, which this record exists to do.\\n\\n" +
      "THE COMPARISON WORTH HOLDING IN MIND. Elsewhere in this timeline, a Second Dynasty Egyptian king put " +
      "a Set animal over his own name, and the identification is secure — not because the animal looks like " +
      "anything, but because of WHERE it stands, in writing, in a period with writing. The Indus material " +
      "cannot offer that, and no amount of iconographic argument substitutes for it.\\n\\n" +
      "THINGS TO ASK: What could decipherment change? Which claims in this section would survive it either " +
      "way?",
    category: "archaeology",
    subcategory: "Indus Valley",
    eventType: "mainstream",
    identificationStatus: "secure",
    kundaliniRelation: "cross_cultural_parallel",
    transmissionStatus: "not_applicable",
    tags: [SERPENT_THREADS.subtleBody, "indus-valley", "undeciphered", "script", "method"],
    civilisations: ["Indus Valley Civilisation"],
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "The state of decipherment",
        originalDateText: "Undeciphered; no agreed language, no bilingual text",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHY THIS CARRIES NO DATE: it is a condition of knowledge, not a moment. WHAT IS ESTABLISHED: that " +
          "the script is not read, which is not controversial. WHAT IS NOT: whether it encodes a language at " +
          "all, which is itself argued about.",
        notes:
          "NEEDS SOURCE VERIFICATION for the current state of the question and for the principal positions " +
          "in it, including the argument that the sequences are not linguistic.",
      },
    ],
    media: [
      {
        url: commons("Sceau_Indus_taureau_Guimet.jpg"),
        sourcePageUrl: commonsPage("Sceau_Indus_taureau_Guimet.jpg"),
        fileName: "Sceau Indus taureau Guimet.jpg",
        originalFileUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sceau_Indus_taureau_Guimet.jpg",
        caption:
          "Harappan steatite bull seal from Mohenjo-daro with a line of Indus signs, Musée Guimet AO 21167. The signs are genuine archaeological evidence; the image does not supply a decipherment or translation.",
        kind: "image",
        shows: "artefact",
        institution: "Musée Guimet, Paris",
        accessionNumber: "AO 21167",
        creator: "Zunkir",
        objectDate: "Harappan civilisation",
        photographDate: "25 July 2020",
        licence: "Creative Commons Attribution-ShareAlike 4.0 International",
        identificationStatus: "secure",
        creditFrom: "source",
      },
      {
        url: commons("Sceau_Indus_unicorne_Guimet.jpg"),
        sourcePageUrl: commonsPage("Sceau_Indus_unicorne_Guimet.jpg"),
        fileName: "Sceau Indus unicorne Guimet.jpg",
        originalFileUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sceau_Indus_unicorne_Guimet.jpg",
        caption:
          "Harappan steatite 'unicorn' seal from Mohenjo-daro with Indus inscription, Musée Guimet AO 21166. Included as a second independent example of the script's archaeological use; no proposed reading is treated as established.",
        kind: "image",
        shows: "artefact",
        institution: "Musée Guimet, Paris",
        accessionNumber: "AO 21166",
        creator: "Zunkir",
        objectDate: "Harappan civilisation",
        photographDate: "25 July 2020",
        licence: "Creative Commons Attribution-ShareAlike 4.0 International",
        identificationStatus: "secure",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "gudea-vase-entwined-serpents",
    title: "The libation vase of Gudea: two serpents about a central axis",
    summary:
      "Lagash, around 2100 BCE. Two serpents entwined around a vertical element, dedicated to Ningishzida — and the most frequently reproduced 'ancient Kundalini' image in popular writing, on no evidence at all.",
    description:
      "WHAT KIND OF RECORD IS THIS? The collection's test case for its own central distinction, and the " +
      "reason both of its classification fields exist.\\n\\n" +
      "WHAT THE OBJECT IS. A libation vase associated with Gudea, ruler of Lagash, conventionally dated to " +
      "around 2100 BCE, dedicated to the god Ningishzida. It carries two serpents entwined around a central " +
      "vertical element, flanked by other figures.\\n\\n" +
      "WHY IT IS IN A COLLECTION ABOUT KUNDALINI. Because it is placed beside a Kundalini diagram constantly " +
      "— two serpents winding about a central channel is, visually, what Iḍā and Piṅgalā around Suṣumṇā " +
      "look like in later Indian illustration. The resemblance is real and it is striking, and saying so is " +
      "not a concession.\\n\\n" +
      "AND NOW THE PART THAT USUALLY GETS LEFT OUT. THERE IS NO DEMONSTRATED EVIDENCE THAT THIS IMAGE " +
      "REPRESENTS KUNDALINI, THE HUMAN SPINE, OR ENERGY IN A BODY. It is dedicated to a Mesopotamian god " +
      "with his own functions in his own religion, roughly a thousand years before the earliest Indian " +
      "texts this collection treats as precursors, and some three thousand years before the word " +
      "kuṇḍalinī is attested. The comparison is a CROSS-CULTURAL VISUAL PARALLEL. That is what this record " +
      "classifies it as, and the classification is stored rather than implied.\\n\\n" +
      "THE TWO QUESTIONS THIS RECORD KEEPS APART. Did Mesopotamia and India have contact? Yes, " +
      "demonstrably — trade between Mesopotamia and the Indus is well evidenced in this very period. Did " +
      "THIS motif, or an idea about the body, travel along it? NOTHING SHOWS THAT. The record therefore " +
      "carries a cross-cultural parallel AND documented contact at the same time, which is an honest " +
      "position that needs two fields to state and is usually collapsed into whichever half suits the " +
      "writer.\\n\\n" +
      "WHAT THIS DATASET DOES NOT KNOW ABOUT THE OBJECT, and the list is embarrassing for a record this " +
      "confident about what the object does not mean: its accession number, its excavation context, what " +
      "its inscription says, whether the entwined-serpent motif is attested elsewhere in Mesopotamian art, " +
      "and what Assyriologists actually call the central element. Every one of those is NEEDS SOURCE " +
      "VERIFICATION, and the third would be the most interesting: a motif with a local history in " +
      "Mesopotamian art is a very different thing from an isolated image.\\n\\n" +
      "THINGS TO ASK: If two cultures that traded with each other produced similar images, what would show " +
      "that one took it from the other? What would show they did not?",
    category: "archaeology",
    subcategory: "Mesopotamia",
    eventType: "archaeological_interpretation",
    identificationStatus: "secure",
    kundaliniRelation: "cross_cultural_parallel",
    transmissionStatus: "contact_documented",
    argumentsFor:
      "THE VISUAL CORRESPONDENCE IS GENUINE AND SPECIFIC: not merely a serpent, but TWO serpents, entwined, " +
      "symmetrically, around a single central vertical element — which is the exact configuration of Iḍā " +
      "and Piṅgalā about Suṣumṇā in later Indian illustration. Mesopotamia and the Indus demonstrably " +
      "traded in this period, so contact is not hypothetical. And a motif can outlive the reason for it, " +
      "travelling as an image long after its meaning is lost.",
    argumentsAgainst:
      "THE CORRESPONDENCE IS WITH ILLUSTRATIONS ROUGHLY THREE THOUSAND YEARS LATER, and the Indian " +
      "three-channel scheme is not attested anywhere near this date. The vase is dedicated to Ningishzida " +
      "and belongs to his cult, with its own meanings that specialists can describe without reference to " +
      "India. Entwined serpents are a widespread and easily invented form — the caduceus arrives " +
      "independently in Greece. Documented trade in pottery and stone is not documented transmission of a " +
      "doctrine about the human body. AND NO SPECIALIST IN MESOPOTAMIAN RELIGION IS KNOWN TO THIS DATASET " +
      "TO HAVE DRAWN THE COMPARISON — which, if it holds, is the most telling fact available.",
    tags: [
      SERPENT_THREADS.serpent,
      SERPENT_THREADS.serpentStaff,
      SERPENT_THREADS.immortality,
      "mesopotamia",
      "gudea",
      "lagash",
      "ningishzida",
      "entwined-serpents",
    ],
    civilisations: ["Sumer", "Lagash"],
    locationName: "Lagash / Girsu, southern Mesopotamia",
    people: ["Gudea"],
    claims: [
      {
        sourceKey: "gudea_libation_vase",
        startYear: -2149,
        endYear: -2050,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the vase was made",
        originalDateText: "Commonly given as about 2100 BCE, in the reign of Gudea",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "WHAT IS DATED: the object, by the ruler it names. WHY A RANGE: Gudea's own dates depend on " +
          "Mesopotamian chronology, which carries real disagreement at this depth, and the figure '2100 BCE' " +
          "that circulates is a convention rather than a measurement.",
        notes:
          "NEEDS SOURCE VERIFICATION for the accession number, the excavation context, the material and " +
          "size, and the chronology used. None has been checked.",
      },
      {
        sourceKey: "gudea_libation_vase",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether the image represents Kundalini or the human body",
        originalDateText: "No demonstrated evidence that it does",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "THE CLAIM THIS RECORD EXISTS TO REFUSE, RECORDED SO IT CAN BE EXAMINED RATHER THAN DROPPED. The " +
          "visual resemblance to the three-channel scheme is real. WHAT IS ABSENT: any Mesopotamian text, " +
          "any specialist reading, and any chronological proximity — the Indian scheme is attested millennia " +
          "later. The vase belongs to Ningishzida's cult and is explicable within it.",
        notes:
          "NEEDS SOURCE VERIFICATION for what the inscription says, and for whether any specialist in " +
          "Mesopotamian religion has ever drawn this comparison. If none has, that is the single most " +
          "informative fact this record could carry.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether contact between Mesopotamia and India could carry such a motif",
        originalDateText: "Contact documented; transmission of this motif not shown",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "KEPT AS A THIRD CLAIM BECAUSE IT IS A THIRD QUESTION, and merging it with the one above is how " +
          "the argument usually gets made. Mesopotamian-Indus trade in this period is well evidenced. THAT " +
          "IS NOT EVIDENCE THAT A DOCTRINE ABOUT THE HUMAN BODY TRAVELLED, and there is in any case no " +
          "Indian subtle-body doctrine at this date for it to have travelled to.",
        notes:
          "NEEDS SOURCE VERIFICATION for the trade evidence, and separately for any scholar who has argued " +
          "for transmission of this specific motif in either direction.",
      },
    ],
    media: [
      {
        url: commons("Serpent_god_Ningishzida_on_the_libation_vase_of_Gudea,_circa_2100_BCE.jpg"),
        sourcePageUrl: commonsPage("Serpent_god_Ningishzida_on_the_libation_vase_of_Gudea,_circa_2100_BCE.jpg"),
        fileName: "Serpent god Ningishzida on the libation vase of Gudea, circa 2100 BCE.jpg",
        originalFileUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Serpent_god_Ningishzida_on_the_libation_vase_of_Gudea,_circa_2100_BCE.jpg",
        caption:
          "Historical image detail of the intertwined serpents on Gudea's libation vase, Louvre AO 190. It shows the ancient motif clearly; calling that motif a caduceus or Kundalini is a later comparison, not an inscription on the vase.",
        kind: "image",
        shows: "engraving",
        institution: "Musée du Louvre, Paris",
        accessionNumber: "AO 190",
        creator: "Ernest de Sarzec",
        objectDate: "about 2100 BCE",
        photographDate: "1901 publication image",
        licence: "Public domain",
        identificationStatus: "secure",
        creditFrom: "source",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE CONTROL RECORD
  //
  // Every other record in this collection is at risk of reading as a brick in
  // one argument: that the serpent is everywhere, means one thing, and that
  // thing is Kundalini. This record exists to make that argument falsifiable
  // from inside the collection, using material this repository has already
  // sourced elsewhere rather than anything gathered to prove a point.
  // -------------------------------------------------------------------------
  {
    slug: "serpent-is-not-one-symbol",
    title: "Three serpents, three meanings, three dates: the collection's control",
    summary:
      "Egypt's serpent is the enemy. Greece's serpent limbs arrive after 380 BCE. Mesopotamia's two serpents belong to a named god's cult. None of them is an inner energy, and the dates are two thousand years apart.",
    description:
      "WHAT KIND OF RECORD IS THIS? A control — the record that tests what the rest of the collection " +
      "claims, rather than adding to it.\n\n" +
      "A NOTE ON ITS OWN CLASSIFICATION, because writing this record argued with the collection's rules " +
      "and the rules won. It was first entered with `kundaliniRelation` unset, on the reasoning that a " +
      "record making no Kundalini claim should not carry a Kundalini label. The collection's own guard " +
      "rejected that: a record with no stated relation lets the reader supply one, which is exactly the " +
      "failure the two fields exist to prevent, and an empty field is not neutral on a page. It is filed " +
      "as `cross_cultural_parallel` — the category the comparison belongs to — and the comparison it " +
      "draws is that these three serpents have nothing in common.\n\n" +
      "WHY A COLLECTION LIKE THIS NEEDS ONE. Assemble enough serpents from enough places and the assembly " +
      "argues on its own, whatever the captions say. A reader scrolling past Mohenjo-daro, Lagash and a " +
      "cakra diagram will draw the line even where every individual record refuses to. The only honest " +
      "answer is to put the counter-evidence in the same collection, at the same size.\n\n" +
      "THE THREE CASES, AND ALL THREE ARE ALREADY EVIDENCED IN THIS REPOSITORY.\n\n" +
      "EGYPT: THE SERPENT IS THE ADVERSARY. Apep is destroyed nightly so the sun can rise, and the god who " +
      "spears him is Set. No coil, no base of a spine, no ascent, no awakening — and the killing is the " +
      "point. See `set-spears-apep`, which carries the scene as a photograph.\n\n" +
      "GREECE: THE SERPENT LIMBS ARE LATE, AND THE DATE IS KNOWN. In Archaic and Classical art the Gigantes " +
      "are man-sized hoplites — helmet, shield, spear, fully human. The serpent-legged monster appears after " +
      "about 380 BCE and is standard by the Pergamon Altar. THIS IS THE MOST USEFUL FACT IN THE COLLECTION, " +
      "because it is a case where serpent iconography demonstrably arrives inside a single culture, late, " +
      "for reasons internal to that culture's art. Anything that treats serpent imagery as primordial has to " +
      "account for it. See `gigantes-gigantomachy`.\n\n" +
      "MESOPOTAMIA: THE SERPENTS BELONG TO A GOD. Two serpents entwined about a central axis, around 2100 " +
      "BCE, dedicated to Ningishzida — a deity with his own functions in his own religion, describable by " +
      "specialists without reference to India. See `gudea-vase-entwined-serpents` in this collection.\n\n" +
      "WHAT THE THREE TOGETHER ESTABLISH, AND WHAT THEY DO NOT. They establish that serpent imagery carries " +
      "at least three unrelated meanings across cultures that are two thousand years apart, and that in one " +
      "case the imagery can be dated to a moment of change. They do NOT establish that no serpent symbol " +
      "ever meant anything like an inner energy — that would be the same overreach with the sign flipped. " +
      "Three cases are three cases.\n\n" +
      "WHAT WOULD MAKE THIS RECORD WRONG: a specialist in any of these three traditions arguing, in print, " +
      "that the serpent in that tradition does carry a doctrine about energy in a body. None is known to " +
      "this dataset, and none has been searched for properly, which is the honest state of it.\n\n" +
      "THINGS TO ASK: If the same image means the enemy in one place and a god's emblem in another, what " +
      "work is the word 'universal' doing? What would a symbol have to do to earn it?",
    category: "archaeology",
    subcategory: "Comparison",
    eventType: "archaeological_interpretation",
    identificationStatus: "secure",
    kundaliniRelation: "cross_cultural_parallel",
    transmissionStatus: "not_applicable",
    argumentsFor:
      "EACH OF THE THREE CASES IS SOURCED SOMEWHERE IN THIS REPOSITORY ALREADY, and none was gathered for " +
      "this record — they were entered for other collections, on their own evidence, before this comparison " +
      "was drawn. That is the strongest thing about them: they are not a selection made to win an argument.",
    argumentsAgainst:
      "THREE CASES ARE NOT A SURVEY. A genuine test would need the serpent traditions this dataset has NOT " +
      "looked at — Chinese, Mesoamerican, West African, Australian, Norse — and it would need a specialist " +
      "in each. This record could be selecting the three that happen to disagree. It also rests on the " +
      "Greek date at one remove: Vian 1952 has not been read here, only cited through another record.",
    tags: [
      SERPENT_THREADS.serpent,
      SERPENT_THREADS.serpentStaff,
      "comparison",
      "control-record",
      "egypt",
      "greece",
      "mesopotamia",
    ],
    civilisations: ["Ancient Egypt", "Ancient Greece", "Sumer"],
    people: [],
    claims: [
      {
        sourceKey: "vian_1952_gigantomachy",
        startYear: -379,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "When Greek art started giving the Gigantes serpent legs",
        originalDateText: "Serpent-legged Gigantes appear in art after about 380 BCE",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "THE ONE DATED PIECE OF COUNTER-EVIDENCE IN THIS COLLECTION. Before this, three centuries of " +
          "Archaic and Classical art show the Gigantes as man-sized soldiers in human form; after it, the " +
          "serpent-legged type spreads. DATING METHOD: stylistic comparison across a corpus of vases and " +
          "sculpture, which dates a change in pictures rather than an event.\n\n" +
          "WHY IT BELONGS IN A KUNDALINI COLLECTION: it is a worked example of serpent iconography being " +
          "INVENTED, inside a literate culture, at a datable moment, for reasons that have nothing to do " +
          "with the human body.",
        notes:
          "NEEDS SOURCE VERIFICATION, and specifically at one remove: this date is taken from the record " +
          "`gigantes-gigantomachy` in this repository's Greek giants collection, where it was entered " +
          "against Vian 1952. Vian has not been opened by this collection, and the firmness of the " +
          "art-historical consensus on the date has not been checked.",
      },
      {
        sourceKey: "egyptian_serpent_adversary",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the Egyptian serpent-as-adversary tradition began",
        originalDateText: "Not established here. The role is attested across much of pharaonic history",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "A POSITIONLESS CLAIM, AND IT HAS TO BE. The Apep material spans millennia and this dataset cites " +
          "no individual spell by number, so any start year would be invented. WHAT IS ESTABLISHED WITHOUT A " +
          "DATE: that the role exists and that it is adversarial — the serpent is destroyed, nightly, and " +
          "the destruction is the religious content.",
        notes:
          "NEEDS SOURCE VERIFICATION for the earliest and latest securely dated attestations, which would " +
          "turn this from a role into a span. The same gap is recorded on `set-spears-apep`, and closing it " +
          "there closes it here.",
      },
    ],
    genealogies: [
      {
        key: "serpent-universal-energy",
        claim: "The serpent is a universal symbol of the same inner energy, recognised independently by every ancient culture",
        verdict: "later_interpretation",
        verdictEvidence:
          "THE CLAIM IS NOT ABSURD AND IT IS NOT ANCIENT. Serpents really are widespread in ancient art, and " +
          "some traditions really do connect serpents to life, healing and renewal. What is later is the " +
          "SYNTHESIS: the step from 'serpents appear in many places' to 'they all encode one doctrine about " +
          "energy in the body' is an interpretive move, and it is made by identifiable modern writers rather " +
          "than by any ancient source.\n\n" +
          "THE THREE CASES ON THIS RECORD ARE WHAT THE VERDICT RESTS ON. An adversary destroyed nightly, a " +
          "monster-limb convention invented after 380 BCE, and a named god's emblem are not three " +
          "expressions of one idea, and no ancient text known to this dataset groups them.",
        whatWouldChangeThis:
          "An ancient source — not a modern comparativist — that itself treats serpent symbols from more " +
          "than one culture as the same thing, or a specialist argument that any one of these three " +
          "traditions carries a doctrine about energy in a body. Either would move this off " +
          "`later_interpretation`.",
        links: [
          {
            stage: "ancient_primary",
            who: "The objects themselves: Apep in Egyptian iconography, the Gigantes in Greek art, the Gudea vase",
            sourceKey: "egyptian_serpent_adversary",
            adds:
              "Serpents, in quantity, across cultures — and nothing that connects them. THE ABSENCE IS THE " +
              "CONTENT OF THIS LINK: no ancient source known to this dataset compares serpent symbols across " +
              "traditions, and the comparison is what the claim needs.",
            saysAbsentReason:
              "There is no quotation to give, because the claim at this stage is about what these objects do " +
              "NOT say. Quoting one of them would misrepresent the link as positive evidence.",
            citationStatus: "verified",
          },
          {
            stage: "early_scholarship",
            who: "Nineteenth- and early twentieth-century comparative mythology",
            adds:
              "PRESUMPTIVE, AND MARKED SO. The step from scattered serpents to one underlying symbol is the " +
              "characteristic move of comparative mythology in this period, and this dataset expects the " +
              "chain to run through it. NO AUTHOR, TITLE, DATE OR PAGE IS ENTERED, because naming one from " +
              "memory would put a fabricated citation at the load-bearing point of a chain about fabricated " +
              "citations.",
            saysAbsentReason:
              "Unread. No work of comparative mythology has been opened by this collection.",
            citationStatus: "unverified",
          },
          {
            stage: "alternative_interpretation",
            who: "Twentieth-century esoteric and Theosophical writing on serpent wisdom",
            adds:
              "PRESUMPTIVE. This is where the comparison is expected to acquire the specific claim that the " +
              "shared referent is an energy in the body. This repository's Lemuria collection already " +
              "documents the adjacent habit — Churchward's 'Naga-Maya' tablets, shown once and never " +
              "produced — which is a reason to expect the stage and not evidence that it exists.",
            saysAbsentReason: "Unread. No specific work is named, for the same reason as the link above.",
            citationStatus: "unverified",
          },
          {
            stage: "popular_claim",
            who: "The modern form: the Gudea vase reproduced beside a cakra diagram",
            adds:
              "The claim in the shape a reader actually meets it — two images side by side, with no argument " +
              "between them and no dates on either. That juxtaposition is doing all the work, and it is " +
              "exactly what this collection's structure exists to take apart.",
            saysAbsentReason:
              "No single publication is cited. The claim circulates as a visual pairing rather than as a " +
              "sentence anybody signed, which is itself the finding.",
            citationStatus: "no_citation_given",
          },
        ],
      },
    ],
  },

  {
    slug: "leadbeater-caduceus-nadi-diagram",
    title: "Leadbeater explicitly maps the spinal channels onto Mercury's caduceus",
    summary:
      "In 1927 C. W. Leadbeater published an illustrated spinal-channel scheme and explicitly identified its caduceus-like form with Mercury's caduceus.",
    description:
      "A SECURE MODERN VISUAL MILESTONE, NOT AN ANCIENT LINEAGE CLAIM. In The Chakras, Fig. 4, Leadbeater " +
      "illustrates spinal-channel flows and then a caduceus-like figure. His accompanying text explicitly argues " +
      "that the Brahmadanda/spine is the original of Mercury's caduceus and interprets the two snakes through " +
      "Kundalini or serpent-fire. This securely dates one influential printed caduceus/Kundalini comparison to " +
      "1927. It does not establish that ancient Greek users of the caduceus knew Iḍā, Piṅgalā or Suṣumṇā.\n\n" +
      "THE EARLIER VISUAL QUESTION REMAINS OPEN. Modern teachers commonly draw Iḍā and Piṅgalā repeatedly crossing " +
      "the central Suṣumṇā, but the medieval Gorakṣaśataka evidence in this track only establishes named " +
      "left/right/central channels and Kundalini ascent through Suṣumṇā. Until an earlier securely provenanced " +
      "Indian diagram is identified, the first historical appearance of the repeated crossing geometry is not " +
      "assigned a date here.",
    category: "religion",
    subcategory: "Modern esotericism",
    eventType: "historical_account",
    identificationStatus: "secure",
    kundaliniRelation: "modern_development",
    transmissionStatus: "not_applicable",
    tags: [SERPENT_THREADS.serpent, SERPENT_THREADS.serpentStaff, SERPENT_THREADS.subtleBody, SERPENT_THREADS.kundalini, "ida", "pingala", "sushumna", "caduceus", "theosophy"],
    civilisations: [],
    people: ["C. W. Leadbeater"],
    claims: [{
      sourceKey: "leadbeater_chakras_1927",
      citations: [{ sourceKey: "modern_nadi_geometry_caution", relation: "context", note: "Modern crossing-channel convention is kept distinct from what older texts explicitly say." }],
      startYear: 1927,
      endYear: 1927,
      datePrecision: "year",
      isApproximate: false,
      temporalClaimType: "exact",
      whatIsDated: "Publication of Leadbeater's illustrated caduceus/spinal-channel comparison",
      originalDateText: "1927",
      datingMethod: "historical_record",
      chronology: "conventional",
      evidence:
        "Leadbeater's Fig. 4 and accompanying prose explicitly place the spinal-channel diagrams beside a " +
        "caduceus-like figure and state the caduceus interpretation. The publication itself is the evidence " +
        "for the modern comparison.",
      notes:
        "This is presently the earliest securely sourced visual milestone entered in this dataset for the " +
        "caduceus-like nāḍī geometry. It is not claimed to be the first such image ever made.",
    }],
    media: [],
  },

  {
    slug: "caduceus-kundalini-comparison",
    title: "The caduceus: two serpents around a staff, and the later Kundalini comparison",
    summary: "The Greek caduceus belongs first to Hermes. Its resemblance to later Iḍā–Piṅgalā–Suṣumṇā diagrams is retained here as a comparison, not silently converted into a historical connection.",
    description: "STATUS: RELATED / CROSS-CULTURAL PARALLEL. The ancient object-type and Greek tradition are real; the claim that its two serpents encode Iḍā and Piṅgalā and its staff Suṣumṇā requires a separately sourced history of interpretation. No transmission from Indian subtle-body doctrine is asserted here.",
    category: "religion",
    subcategory: "Ancient Greece",
    eventType: "archaeological_interpretation",
    identificationStatus: "secure",
    kundaliniRelation: "cross_cultural_parallel",
    transmissionStatus: "no_contact_known",
    tags: [SERPENT_THREADS.serpent, SERPENT_THREADS.serpentStaff, SERPENT_THREADS.subtleBody, "caduceus", "hermes", "greece"],
    civilisations: ["Ancient Greece"],
    people: ["Hermes"],
    claims: [{ sourceKey: null, datePrecision: "year", isApproximate: false, temporalClaimType: "unknown", whatIsDated: "The proposed identification of the caduceus with the three-channel Kundalini scheme", originalDateText: "Ancient equivalence not established here", datingMethod: "stylistic_comparison", chronology: "disputed", evidence: "The visual comparison is retained because it is specific and recurrent. What is missing is an ancient text, specialist historical argument, or transmission chain identifying the Greek staff with Iḍā, Piṅgalā and Suṣumṇā.", notes: "OPEN: establish the earliest printed pairing and any specialist discussion." }],
  },
  {
    slug: "asclepius-staff-kundalini-comparison",
    title: "The Rod of Asclepius: healing serpent and the spinal-ascent comparison",
    summary: "A single serpent around the healing staff of Asclepius is ancient Greek material. Reading it as Kundalini rising on the spine is kept as a later proposed comparison.",
    description: "STATUS: RELATED / LATER INTERPRETATION. Keep the Greek healing symbolism and the modern spinal/Kundalini comparison on the same record, but do not merge them.",
    category: "religion", subcategory: "Ancient Greece", eventType: "archaeological_interpretation",
    identificationStatus: "secure", kundaliniRelation: "cross_cultural_parallel", transmissionStatus: "no_contact_known",
    tags: [SERPENT_THREADS.serpent, SERPENT_THREADS.serpentStaff, "asclepius", "healing", "greece"],
    civilisations: ["Ancient Greece"], people: ["Asclepius"],
    claims: [{ sourceKey: null, datePrecision: "year", isApproximate: false, temporalClaimType: "unknown", whatIsDated: "The proposed spinal/Kundalini reading of the Rod of Asclepius", originalDateText: "No ancient bodily-energy equivalence established here", datingMethod: "stylistic_comparison", chronology: "disputed", evidence: "The ancient healing emblem and the modern Kundalini comparison are separate propositions. This record preserves both without treating resemblance as descent.", notes: "OPEN: add the best museum object and the publication history of the modern comparison." }],
  },
  {
    slug: "quetzalcoatl-kundalini-comparison",
    title: "Quetzalcoatl and Kukulkan: feathered serpent, retained without forced equivalence",
    summary: "Mesoamerican feathered-serpent traditions are retained beside Kundalini because modern comparisons exist; their indigenous meanings must remain primary.",
    description: "STATUS: RELATED / CROSS-CULTURAL PARALLEL. The feathered serpent is not labelled Kundalini by this record. Any claim of ascending inner energy, chakras or historical transmission needs its own claimant and evidence.",
    category: "religion", subcategory: "Mesoamerica", eventType: "archaeological_interpretation",
    identificationStatus: "secure", kundaliniRelation: "cross_cultural_parallel", transmissionStatus: "no_contact_known",
    tags: [SERPENT_THREADS.serpent, SERPENT_THREADS.ascent, "quetzalcoatl", "kukulkan", "mesoamerica"],
    civilisations: ["Mesoamerica"], people: [],
    claims: [{ sourceKey: null, datePrecision: "year", isApproximate: false, temporalClaimType: "unknown", whatIsDated: "The proposed equivalence with Kundalini", originalDateText: "Not established in indigenous sources here", datingMethod: "textual_interpretation", chronology: "disputed", evidence: "The comparison is preserved for investigation. It must not overwrite specialist accounts of Quetzalcoatl/Kukulkan or imply Old World transmission without evidence.", notes: "OPEN: specialist Mesoamerican source plus earliest traceable Kundalini comparison." }],
  },
  {
    slug: "nehushtan-kundalini-comparison",
    title: "The bronze serpent and Nehushtan: healing pole versus Kundalini reading",
    summary: "The Hebrew Bible's bronze serpent tradition is real; interpreting the pole as a spine and serpent as Kundalini is retained as a later claim requiring its own source.",
    description: "STATUS: TEXT ATTESTED / KUNDALINI CONNECTION UNVERIFIED. Numbers 21 and 2 Kings 18:4 belong to the evidence chain for the Hebrew tradition. They do not themselves name chakras, nāḍīs or Kundalini.",
    category: "religion", subcategory: "Hebrew Bible", eventType: "religious_account",
    identificationStatus: "secure", kundaliniRelation: "speculative_esoteric", transmissionStatus: "no_contact_known",
    tags: [SERPENT_THREADS.serpent, SERPENT_THREADS.serpentStaff, "nehushtan", "bronze-serpent", "hebrew-bible"],
    civilisations: ["Ancient Israel"], people: ["Moses", "Hezekiah"],
    claims: [{ sourceKey: null, datePrecision: "year", isApproximate: false, temporalClaimType: "unknown", whatIsDated: "The Kundalini interpretation of the bronze serpent", originalDateText: "Later interpretation; ancient equivalence not established", datingMethod: "textual_interpretation", chronology: "disputed", evidence: "The underlying serpent-on-pole narrative and later destruction of Nehushtan can be sourced directly. The additional spine/Kundalini reading is a separate claim and remains unverified until a traceable interpreter is supplied.", notes: "OPEN: add scholarly Hebrew commentary and earliest printed Kundalini reading." }],
  },
  {
    slug: "jormungandr-kundalini-comparison",
    title: "Jörmungandr: the world serpent and the proposed inner-energy comparison",
    summary: "The Norse world serpent is kept in the comparison set, but no bodily subtle-anatomy meaning is supplied by resemblance alone.",
    description: "STATUS: RELATED / CROSS-CULTURAL PARALLEL. Jörmungandr's Norse textual role and any modern Kundalini interpretation are different evidence chains.",
    category: "religion", subcategory: "Norse", eventType: "religious_account",
    identificationStatus: "secure", kundaliniRelation: "cross_cultural_parallel", transmissionStatus: "no_contact_known",
    tags: [SERPENT_THREADS.serpent, "jormungandr", "world-serpent", "norse"],
    civilisations: ["Norse"], people: [],
    claims: [{ sourceKey: null, datePrecision: "year", isApproximate: false, temporalClaimType: "unknown", whatIsDated: "The proposed Kundalini equivalence", originalDateText: "No specialist bodily-energy equivalence established here", datingMethod: "textual_interpretation", chronology: "disputed", evidence: "The comparison stays visible but is not promoted into a historical connection.", notes: "OPEN: primary Eddic passage, academic Norse source, and earliest traceable Kundalini comparison." }],
  },
  {
    slug: "uraeus-kundalini-comparison",
    title: "The Egyptian uraeus: forehead cobra and the brow/crown Kundalini reading",
    summary: "The royal forehead cobra is securely Egyptian. Its modern interpretation as awakened Kundalini reaching the brow or crown is retained separately as a speculative reading.",
    description: "STATUS: ANCIENT ICONOGRAPHY SECURE / KUNDALINI CONNECTION UNVERIFIED. Similar placement at the forehead is worth comparing; it is not itself evidence of shared subtle anatomy.",
    category: "religion", subcategory: "Ancient Egypt", eventType: "archaeological_interpretation",
    identificationStatus: "secure", kundaliniRelation: "speculative_esoteric", transmissionStatus: "no_contact_known",
    tags: [SERPENT_THREADS.serpent, SERPENT_THREADS.innerEye, SERPENT_THREADS.crown, "uraeus", "egypt"],
    civilisations: ["Ancient Egypt"], people: [],
    claims: [{ sourceKey: null, datePrecision: "year", isApproximate: false, temporalClaimType: "unknown", whatIsDated: "The claim that the uraeus depicts awakened Kundalini", originalDateText: "Later interpretation; not established by Egyptian evidence here", datingMethod: "stylistic_comparison", chronology: "disputed", evidence: "The forehead placement and serpent form are observable. The proposed inner-energy meaning needs Egyptological or historical evidence beyond visual correspondence.", notes: "OPEN: Egyptological source for uraeus meanings and first traceable Kundalini comparison." }],
  },
  {
    slug: "djed-spine-kundalini-comparison",
    title: "The djed pillar: stability symbol, spine comparison and Kundalini claim",
    summary: "The Egyptian djed is retained because modern esoteric readings compare it with the spine or central channel; that anatomical/Kundalini identification is not assumed ancient.",
    description: "STATUS: ANCIENT SYMBOL SECURE / SPINAL-KUNDALINI READING UNVERIFIED. Record the Egyptian meanings first, then name and date later interpreters.",
    category: "religion", subcategory: "Ancient Egypt", eventType: "archaeological_interpretation",
    identificationStatus: "secure", kundaliniRelation: "speculative_esoteric", transmissionStatus: "no_contact_known",
    tags: [SERPENT_THREADS.subtleBody, SERPENT_THREADS.ascent, "djed", "spine", "egypt"],
    civilisations: ["Ancient Egypt"], people: [],
    claims: [{ sourceKey: null, datePrecision: "year", isApproximate: false, temporalClaimType: "unknown", whatIsDated: "The claim that the djed represents the spine or Kundalini central channel", originalDateText: "Later interpretation; ancient anatomical equivalence not established here", datingMethod: "stylistic_comparison", chronology: "disputed", evidence: "The comparison is retained explicitly so it can be sourced and tested rather than either repeated as fact or discarded.", notes: "OPEN: Egyptological history of the djed plus earliest spine/Kundalini reading." }],
  },
  {
    slug: "double-serpent-dna-comparison",
    title: "Double serpents and DNA: a modern resemblance claim, not ancient genetics",
    summary: "Claims that ancient entwined-serpent imagery encoded the DNA double helix are retained as modern interpretation. Resemblance alone does not establish ancient knowledge of molecular genetics.",
    description: "STATUS: MODERN SPECULATIVE COMPARISON. This belongs in the timeline because the claim is culturally influential and testable: identify who made it, when, which ancient image they used, and what evidence they offered.",
    category: "history", subcategory: "Modern esotericism", eventType: "alternative",
    identificationStatus: "secure", kundaliniRelation: "modern_development", transmissionStatus: "not_applicable",
    tags: [SERPENT_THREADS.serpent, SERPENT_THREADS.serpentStaff, "dna", "double-helix", "modern-esotericism"],
    civilisations: [], people: [],
    claims: [{ sourceKey: null, datePrecision: "year", isApproximate: false, temporalClaimType: "unknown", whatIsDated: "The emergence of the ancient-serpent-as-DNA claim", originalDateText: "Date not yet established", datingMethod: "historical_record", chronology: "disputed", evidence: "The modern claim is the historical object here. It should be dated from publications, not back-projected onto the ancient artefacts it compares.", notes: "OPEN: find earliest printed claimant, publication, page and image pairing." }],
  },
  {
    slug: "primordial-serpent-energy-doctrine",
    title: "One primordial serpent-energy doctrine: the universal-origin hypothesis",
    summary: "The proposal that ancient serpent traditions descend from one lost worldwide teaching is kept as a hypothesis, including Atlantis or Lemuria variants when a source actually makes that claim.",
    description: "STATUS: LATER INTERPRETATION / HYPOTHESIS. This record exists so the strongest version of the universal-serpent argument can be shown rather than implied. Each claimant must be named; each proposed transmission route must be sourced; resemblance by itself is not entered as transmission.",
    category: "history", subcategory: "Comparative esotericism", eventType: "alternative",
    identificationStatus: "secure", kundaliniRelation: "modern_development", transmissionStatus: "no_contact_known",
    tags: [SERPENT_THREADS.serpent, SERPENT_THREADS.subtleBody, "universal-serpent", "atlantis", "lemuria", "comparative-esotericism"],
    civilisations: [], people: [],
    claims: [{ sourceKey: null, datePrecision: "year", isApproximate: false, temporalClaimType: "unknown", whatIsDated: "The universal-origin hypothesis itself", originalDateText: "No ancient cross-cultural statement established here", datingMethod: "historical_record", chronology: "disputed", evidence: "The dataset currently has ancient serpent traditions but no ancient source that groups them as manifestations of one bodily energy doctrine. The hypothesis remains visible while its genealogy is researched.", notes: "OPEN: identify earliest comparative-mythology and esoteric publications, including sourced Atlantis/Lemuria variants." }],
  },

];

// ---------------------------------------------------------------------------
// LINKS OUT OF THE COLLECTION
//
// The brief asked for a cross-civilisation comparison. The honest form of one is
// not a new table of unresearched claims: it is explicit links to records whose
// dates were already established elsewhere in this repository, so a reader can
// reach the counter-evidence without taking this collection's word for it.
// ---------------------------------------------------------------------------

export const SERPENT_KUNDALINI_LINKS: SeedEventLink[] = [
  {
    from: "serpent-is-not-one-symbol",
    to: "set-spears-apep",
    relation: "evidence_for",
    viewpoint: "archaeological",
    note:
      "Egypt's serpent, and the case the Kundalini reading has no purchase on: Apep is the adversary, speared " +
      "nightly so the sun can rise, and the god doing it is Set. That record carries the scene as a photograph.",
  },
  {
    from: "serpent-is-not-one-symbol",
    to: "gigantes-gigantomachy",
    relation: "evidence_for",
    viewpoint: "archaeological",
    note:
      "The collection's one DATED counter-example. Serpent-legged Gigantes appear in Greek art after about 380 " +
      "BCE; for three centuries before that they are man-sized hoplites in human form. Serpent iconography " +
      "being invented, late, inside a literate culture.",
  },
  {
    from: "serpent-is-not-one-symbol",
    to: "gudea-vase-entwined-serpents",
    relation: "evidence_for",
    viewpoint: "archaeological",
    note:
      "Mesopotamia's two serpents about an axis — the most reproduced 'ancient Kundalini' image there is, and " +
      "the dedication is to Ningishzida.",
  },
  {
    from: "serpent-is-not-one-symbol",
    to: "horus-spears-set-edfu",
    relation: "relevant",
    viewpoint: "archaeological",
    note:
      "The same spearing composition with the roles swapped: here Set is the one speared. A reminder that in " +
      "Egyptian iconography the figure on the point of the spear is a position in a scene, not a fixed meaning.",
  },
  {
    from: "pashupati-seal",
    to: "serpent-is-not-one-symbol",
    relation: "responds_to",
    note:
      "Read the control record before the seal. The Pashupati identification is the collection's most " +
      "frequently repeated claim and its script is undeciphered, so it is the record most in need of the " +
      "counter-cases stated beside it.",
  },
];