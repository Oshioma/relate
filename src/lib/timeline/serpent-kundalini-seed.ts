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

import type { SeedEvent, SeedSource, SeedTrack } from "./seed-types";

export const SERPENT_KUNDALINI_ANCHOR_SLUG = "pashupati-seal";

export const SERPENT_KUNDALINI_TRACK: SeedTrack = {
  name: "The serpent, Kundalini and sacred ascent",
  slug: "serpent-kundalini",
  kind: "theme",
  color: "#2f8f6b",
};

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
];

export const SERPENT_KUNDALINI_EVENTS: SeedEvent[] = [
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
  },
];
