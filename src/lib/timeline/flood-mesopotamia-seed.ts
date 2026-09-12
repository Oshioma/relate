import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

// =============================================================================
// PARTS D, E AND F — MESOPOTAMIA, ITS FLOOD DEPOSITS, AND THE BIBLICAL
// CHRONOLOGIES
//
// THE THREE CLOCKS, which this dataset exists to keep apart.
//
// A flood tradition can carry three completely different dates, and collapsing
// them is the commonest error in the whole subject:
//
//   1. WHEN THE STORY SAYS IT HAPPENED. For every Mesopotamian account, the
//      answer is that it does not say. There is no year in any of them.
//   2. WHEN IT WAS WRITTEN DOWN. Datable, from the tablets themselves, often
//      to within a reign — and a fact about a manuscript, not about a flood.
//   3. WHAT SOMEBODY HAS PROPOSED IT CORRELATES WITH. A claim about a
//      relationship, made by a named person, and the weakest of the three.
//
// Utnapishtim is the worked example: story date unknown, surviving tablets
// seventh century BCE, proposed correlation with a flood deposit at Shuruppak
// around 2900 BCE. Three dates, three kinds of statement, three rows.
//
// PART E IS SEPARATE FROM PART D ON PURPOSE. The flood deposits at Ur, Kish
// and Shuruppak are archaeological facts about silt. The Mesopotamian flood
// stories are literary works. They are related by proposal, never by
// identity — and the history of that proposal is one of the most instructive
// things on this timeline.
//
// In a single excavation season, 1928–29, archaeologists at Ur and at Kish
// each announced a flood deposit and each identified it with the Flood of
// Genesis. Both could not be right: the deposits are not contemporary with
// each other, and Woolley's at Ur is far too early to be the flood of the
// Ziusudra tradition. Mesopotamian cities flooded repeatedly, which is what
// river cities on an alluvial plain do. A layer of silt establishes a flood at
// one place at one time. It does not establish a story.
//
// PART F: ONE TEXT, THREE CHRONOLOGIES. The Masoretic, Septuagint and
// Samaritan traditions give different ages for the patriarchs, so counting the
// same genealogy in each produces flood dates centuries apart. Ussher's 2348
// BCE is the Masoretic answer, not the Bible's answer — Genesis contains no
// year for the flood at all.
//
// EVERY SOURCE WAS CHECKED. Where a figure could not be pinned to a
// publication it is marked rather than stated, and one date is deliberately
// not asserted at all.
// =============================================================================

/** Astronomical year numbering: 1 BCE = 0, 2 BCE = −1. See time.ts. */
const bce = (year: number): number => 1 - year;

export const FLOOD_MESOPOTAMIA_ANCHOR_SLUG = "utnapishtim-gilgamesh-flood";

export const FLOOD_MESOPOTAMIA_TRACK: SeedTrack = {
  name: "Flood traditions and flood deposits",
  slug: "flood-traditions",
  kind: "theme",
  color: "#8a6a3b",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const FLOOD_MESOPOTAMIA_SOURCES: SeedSource[] = [
  {
    key: "eridu_genesis",
    title: "The Eridu Genesis (the Sumerian flood story)",
    reference: "A single fragmentary Sumerian tablet from Nippur, dated by its script to the 17th century BCE; recovered in 1893",
    url: "https://www.livius.org/sources/content/oriental-varia/eridu-genesis/",
    sourceType: "primary",
    publishedDisplay: "tablet c. 1600 BCE",
    notes:
      "The oldest surviving flood narrative, and about two thirds of it is lost. Cited for what the surviving text contains: Enki warning Ziusudra, a flood of seven days and seven nights, and the offer of eternal life at the end. It gives no date for the flood, and this record does not supply one.",
  },
  {
    key: "atrahasis_tablet",
    title: "Atra-ḫasīs, Tablet III (the flood tablet)",
    author: "copied by the scribe Ipiq-Aya",
    reference:
      "Old Babylonian recension written at Sippar c. 1635 BCE, dated by its colophon to the reign of Ammi-Saduqa (1646–1626 BCE)",
    url: "https://en.wikipedia.org/wiki/Atra-Hasis",
    sourceType: "primary",
    publishedDisplay: "c. 1635 BCE",
    notes:
      "The most complete surviving recension of the Atrahasis story, and the one whose date is fixed by a scribe's own colophon rather than estimated. Cited for the narrative and for that date — a rare case where the writing down of a flood story can be placed within a decade.",
  },
  {
    key: "lambert_millard",
    title: "Atra-ḫasīs: The Babylonian Story of the Flood",
    author: "W. G. Lambert and A. R. Millard",
    reference:
      "The standard critical edition and English translation, assembling the Old Babylonian tablets — including two pieces that may physically join but are held in different museums, one in the British Museum and one in the Musée d'Art et d'Histoire, Geneva",
    sourceType: "academic_book",
    notes:
      "The standard scholarly edition and English translation, assembling the tablets — including pieces held in different museums — into something approaching a whole text. Cited as the edition behind any reading of Atrahasis given here.",
  },
  {
    key: "gilgamesh_xi",
    title: "The Epic of Gilgamesh, Tablet XI (the Flood Tablet)",
    author: "Standard Babylonian version, traditionally attributed to Sîn-lēqi-unninni",
    reference:
      "Best-preserved copies from the Library of Ashurbanipal at Nineveh, 7th century BCE; recovered by Hormuzd Rassam and first translated by George Smith in 1872",
    url: "https://en.wikipedia.org/wiki/Gilgamesh_flood_myth",
    sourceType: "primary",
    publishedDisplay: "tablets 7th century BCE",
    notes:
      "The version most readers meet, and the one whose 1872 translation caused a sensation by showing a flood narrative older than Genesis. Cited for the content of Tablet XI: Ea's warning, the boat, the birds released, the mountain, and the sacrifice afterwards.",
  },
  {
    key: "sumerian_king_list",
    title: "The Sumerian King List",
    reference: "Multiple manuscripts; the fullest is the Weld-Blundell prism, Ashmolean Museum",
    url: "https://en.wikipedia.org/wiki/Sumerian_King_List",
    sourceType: "primary",
    notes:
      "Cited for one structural fact and nothing more: the list divides kingship into what came before the flood and what came after, and gives the antediluvian kings reigns of tens of thousands of years. It is a claim about the shape of the past, not a chronology that converts into calendar years.",
  },
  {
    key: "ncse_flood_archaeology",
    title: "The Flood: Mesopotamian Archaeological Evidence",
    publisher: "National Center for Science Education",
    url: "https://ncse.ngo/flood-mesopotamian-archaeological-evidence",
    sourceType: "website",
    notes:
      "Cited for the excavation history: that Ur and Kish announced flood deposits within months of one another in the 1928–29 season, that each was identified with the Genesis flood, and that the identification could not be sustained because the deposits are not contemporary.",
  },
  {
    key: "woolley_ur",
    title: "Excavations at Ur, 1929–30",
    author: "C. Leonard Woolley",
    publisher: "The Museum Journal, University of Pennsylvania",
    url: "https://www.penn.museum/sites/journal/9272/",
    sourceType: "archaeological",
    publishedYear: 1930,
    publishedDisplay: "1929–30",
    notes:
      "Woolley's own excavation reporting. Cited for the deposit itself — roughly 3.75 metres of water-laid clay containing no trace of human activity, lying between Ubaid material below and Protoliterate debris above — and for his identification of it with the Flood.",
  },
  {
    key: "penn_reflections",
    title: "Reflections on the Mesopotamian Flood",
    publisher: "Expedition Magazine, Penn Museum",
    url: "https://www.penn.museum/sites/expedition/reflections-on-the-mesopotamian-flood/",
    sourceType: "academic_paper",
    notes:
      "Cited for the later reassessment: that Woolley's Ur deposit is too early to be the flood of the Ziusudra tradition, and for Max Mallowan's conclusion that the story reflects a real but local disaster around 3000 BCE rather than the event Woolley had proposed.",
  },
  {
    key: "shuruppak_excavation",
    title: "Shuruppak (Tell Fara): the flood deposit",
    reference: "Erich Schmidt's 1931 excavation; an inundation layer overlying Jemdet Nasr material",
    url: "https://en.wikipedia.org/wiki/Shuruppak",
    sourceType: "archaeological",
    publishedYear: 1931,
    publishedDisplay: "excavated 1931",
    notes:
      "Cited for the deposit: a layer of clay and sand lying directly on Jemdet Nasr period ruins at Tell Fara, placing it around the transition to the Early Dynastic period, roughly 2900 BCE. Shuruppak is the city the flood stories name as Utnapishtim's, which is why this deposit matters and also why it is so easily over-read.",
  },
  {
    key: "lxx_chronology",
    title: "The Case for the Septuagint's Chronology in Genesis 5 and 11",
    author: "Henry B. Smith Jr.",
    publisher: "Associates for Biblical Research",
    url: "https://biblearchaeology.org/research/topics/biblical-chronologies/4353-the-case-for-the-septuagints-chronology-in-genesis-5-and-11",
    sourceType: "academic_paper",
    notes:
      "Cited for the figures, not for its argument: the Masoretic antediluvian total of 2,008 years, the Samaritan 2,249 and the Septuagint 3,394, and the resulting Septuagint flood date of about 3298 BCE against Ussher's Masoretic 2348 BCE. The paper argues the Septuagint preserves the original numbers; that argument is contested and is not what this record rests on.",
  },
  {
    key: "ussher_annals_flood",
    title: "Annales Veteris Testamenti, a prima mundi origine deducti",
    author: "James Ussher",
    reference: "London, 1650. The chronology that places creation at 4004 BCE and the flood at 2348 BCE.",
    sourceType: "historical_document",
    publishedYear: 1650,
    publishedDisplay: "1650",
    notes:
      "Cited for the flood date specifically. Ussher's chronology is the Masoretic count worked through: the 2348 BCE figure is the output of his arithmetic on the genealogies, not a date any Biblical text states.",
  },
];

// ---------------------------------------------------------------------------
// PART D — THE TRADITIONS
//
// Each carries the clocks it actually has. None carries a date for the flood
// itself, because none of the texts gives one.
// ---------------------------------------------------------------------------

const TRADITIONS: SeedEvent[] = [
  {
    slug: "ziusudra-eridu-genesis",
    title: "Ziusudra, in the Sumerian flood story",
    summary:
      "The oldest surviving flood narrative, on a broken tablet from Nippur. Enki warns Ziusudra; the flood lasts seven days and seven nights; no year is given for any of it.",
    description:
      "<p>About two thirds of the tablet is lost. What survives has the god Enki warning Ziusudra of a decision taken by the gods, a flood of seven days and seven nights, and — at the end — an offer of eternal life to the survivor.</p>" +
      "<p><strong>The text gives no date.</strong> It places the flood in the age of the first cities and the first kingship, which is a position in a sequence rather than a year. The tablet itself can be dated, by its script, to the seventeenth century BCE; that is a fact about the tablet.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["flood", "mesopotamia", "sumerian", "ziusudra"],
    locationName: "Shuruppak and Nippur, southern Mesopotamia",
    people: ["Ziusudra", "Enki"],
    civilisations: ["Sumer"],
    // Only what the surviving text contains. The tablet is fragmentary, and the
    // gaps are why this list is shorter than the Gilgamesh one below.
    motifs: ["divine_warning", "chosen_survivor", "boat", "waters_recede"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/CBS10673_Sumerian_Flood_Story_Penn_Museum.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/CBS10673_Sumerian_Flood_Story_Penn_Museum.jpg?width=1024",
        shows: "manuscript",
        caption:
          "CBS 10673, the Penn Museum tablet carrying the Sumerian flood story. IT IS A FRAGMENT: roughly a " +
          "third of the text survives, the beginning is lost, and the flood itself occupies a broken passage \u2014 " +
          "so how much of the story it once told is not known.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "eridu_genesis",
        temporalClaimType: "primordial",
        datePrecision: "year",
        isApproximate: false,
        whatIsDated: "When the tradition says the flood happened",
        originalDateText: "in the age of the first cities, before kingship was restored",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "WHAT IS CLAIMED: nothing datable. The text places the flood in the originating age when the gods made people, cities appeared and kingship descended — a position within a sequence of world-shaping events, not a year. WHY NO DATE IS SUPPLIED HERE: because the source supplies none, and a BCE year would answer a question the text does not ask. EVIDENCE TYPE: a Sumerian religious narrative.",
      },
      {
        sourceKey: "eridu_genesis",
        startYear: bce(1650),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When the earliest surviving copy was written",
        originalDateText: "17th century BCE, by the script of the tablet",
        datingMethod: "textual_interpretation",
        chronology: "archaeological",
        evidence:
          "WHAT IS CLAIMED: the age of the OBJECT, not of the event. The Nippur tablet is dated palaeographically — by the forms of its signs — to the seventeenth century BCE. It was recovered in 1893. WHAT THIS ESTABLISHES: that the story was in written circulation by then, and therefore that it is at least that old. WHAT IT DOES NOT ESTABLISH: how much older the tradition is, which the tablet cannot tell us, or when any flood occurred.",
      },
    ],
  },
  {
    slug: "atrahasis-flood",
    title: "Atrahasis",
    summary:
      "The Akkadian account, and the one whose writing down can be dated almost to the year: copied at Sippar around 1635 BCE by a scribe who signed his work.",
    description:
      "<p>In Atrahasis the gods send the flood because humanity has grown too numerous and too noisy to let them sleep. Enki warns Atrahasis, who builds a boat.</p>" +
      "<p>What makes this text unusual on a timeline is its colophon. The scribe Ipiq-Aya named himself and dated his copy by the reign of Ammi-Saduqa, which places the writing between 1646 and 1626 BCE — around 1635. Almost nothing else in this dataset can be dated that tightly, and it is worth being clear about what is dated: <strong>the copying</strong>.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["flood", "mesopotamia", "akkadian", "atrahasis"],
    locationName: "Sippar, southern Mesopotamia",
    people: ["Atrahasis", "Enki", "Ipiq-Aya"],
    civilisations: ["Babylonia"],
    motifs: ["divine_warning", "divine_punishment", "human_behaviour", "chosen_survivor", "boat", "animals_preserved"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Cuneiform_tablet-_Atra-hasis,_Babylonian_flood_myth_MET_266811.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Cuneiform_tablet-_Atra-hasis,_Babylonian_flood_myth_MET_266811.jpg?width=1024",
        shows: "manuscript",
        caption:
          "A cuneiform tablet of Atra-hasis in the Metropolitan Museum of Art. The story survives across " +
          "several copies from different centuries rather than in one manuscript, and the standard text is a " +
          "reconstruction from them.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "atrahasis_tablet",
        temporalClaimType: "primordial",
        datePrecision: "year",
        isApproximate: false,
        whatIsDated: "When the tradition says the flood happened",
        originalDateText: "in the time when the gods still bore the labour, before people were reduced",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "WHAT IS CLAIMED: no date. Atrahasis narrates a sequence — the gods labouring, humanity created to take over the work, humanity multiplying, plagues and famines, then the flood — with no anchor to any calendar. EVIDENCE TYPE: an Akkadian religious narrative. IMPORTANT: the reason people so often quote a BCE date for this flood is that they are quoting the date of the TABLET, which is a different claim and is on this record separately.",
        citations: [
          {
            sourceKey: "lambert_millard",
            relation: "context",
            note: "The standard edition and translation, assembling tablets held in different museums into a continuous text.",
          },
        ],
      },
      {
        sourceKey: "atrahasis_tablet",
        startYear: bce(1635),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When this copy of the text was written",
        originalDateText: "c. 1635 BCE, in the reign of Ammi-Saduqa (1646–1626 BCE)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS CLAIMED: the date of the copying, from the tablet's own colophon — the scribe Ipiq-Aya named himself and dated his work by the reigning king. HOW IT IS DATED: by the regnal chronology of Ammi-Saduqa, Hammurabi's great-grandson. WHY IT IS PRECISE where everything else here is not: because a scribe wrote it down. WHAT IT ESTABLISHES: that this recension existed by the mid-seventeenth century BCE. WHAT IT DOES NOT ESTABLISH: anything about when a flood occurred, or how old the story was when Ipiq-Aya copied it.",
        notes:
          "The regnal dates given here follow the middle chronology, which is itself one of several competing Mesopotamian chronologies — so even this, the tightest date in the dataset, sits on a scaffolding that specialists argue about.",
      },
    ],
  },
  {
    slug: FLOOD_MESOPOTAMIA_ANCHOR_SLUG,
    title: "Utnapishtim, in the Epic of Gilgamesh",
    summary:
      "The version most readers know, and the clearest case of three separate dates on one tradition: the story gives none, the tablets are seventh century BCE, and a proposed correlation puts a flood at Shuruppak around 2900 BCE.",
    description:
      "<p>In Tablet XI, Utnapishtim tells Gilgamesh how he survived the flood: warned by Ea, he built a boat, took his family and animals aboard, grounded on a mountain, and released birds to find land.</p>" +
      "<p>This record is where the <strong>three clocks</strong> are easiest to see, and each is a separate claim below:</p>" +
      "<ul><li><strong>When the story says it happened</strong> — it does not say.</li>" +
      "<li><strong>When it was written down</strong> — the best-preserved tablets come from the Library of Ashurbanipal at Nineveh, seventh century BCE. The story is far older than that; the tablets are not.</li>" +
      "<li><strong>What it has been proposed to correlate with</strong> — a flood deposit at Shuruppak, the city the text names as Utnapishtim's, around 2900 BCE. A proposal about a relationship, not a date for the story.</li></ul>" +
      "<p>George Smith's translation of this tablet in 1872 caused a public sensation, because it showed a flood narrative in the same shape as Genesis and older than any manuscript of it.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["flood", "mesopotamia", "gilgamesh", "utnapishtim", "babylonian"],
    locationName: "Shuruppak, southern Mesopotamia",
    people: ["Utnapishtim", "Gilgamesh", "Ea", "Sîn-lēqi-unninni", "George Smith"],
    civilisations: ["Babylonia", "Assyria"],
    motifs: [
      "divine_warning",
      "divine_punishment",
      "chosen_survivor",
      "family_survives",
      "animals_preserved",
      "boat",
      "mountain_refuge",
      "birds_released",
      "waters_recede",
      "sacrifice_after",
      "prolonged_rain",
    ],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/British_Museum_Flood_Tablet.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/British_Museum_Flood_Tablet.jpg?width=1024",
        shows: "manuscript",
        caption:
          "Tablet XI of the Epic of Gilgamesh \u2014 the Flood Tablet \u2014 from the library of Ashurbanipal at Nineveh, " +
          "seventh century BCE. This is the object George Smith read in 1872, and the copy is some twelve " +
          "hundred years younger than the story it carries.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "gilgamesh_xi",
        temporalClaimType: "primordial",
        datePrecision: "year",
        isApproximate: false,
        whatIsDated: "When the story says the flood happened",
        originalDateText: "in the days before Utnapishtim was given life like the gods",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "WHAT IS CLAIMED: no date whatsoever. Tablet XI places the flood in the past of a survivor who has since been made immortal — which is a position relative to Gilgamesh's lifetime and to nothing else. EVIDENCE TYPE: ancient literary testimony. WHY THIS MATTERS: a reader who meets \"the Mesopotamian flood, c. 2900 BCE\" has been given a correlation somebody proposed, wearing the clothes of a date the text supplies.",
      },
      {
        sourceKey: "gilgamesh_xi",
        startYear: bce(650),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When the best-preserved surviving tablets were written",
        originalDateText: "7th century BCE (Library of Ashurbanipal, Nineveh)",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT IS CLAIMED: the age of the manuscripts, not the age of the story. The best-preserved copies of Tablet XI come from Ashurbanipal's library at Nineveh, destroyed in 612 BCE, and were recovered by Hormuzd Rassam in the nineteenth century. George Smith translated the flood tablet in 1872. WHAT IT ESTABLISHES: the text existed in this form by the seventh century BCE. WHAT IT DOES NOT: the age of the tradition, which is demonstrably older — Atrahasis was being copied a thousand years earlier — nor the date of any flood.",
      },
      {
        sourceKey: "shuruppak_excavation",
        startYear: bce(2900),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "proposed_correlation",
        dateConvention: "calendar",
        whatIsDated: "The flood deposit some have proposed this tradition remembers",
        originalDateText: "the Shuruppak flood deposit, c. 2900 BCE, proposed as a correlation",
        datingMethod: "archaeological",
        chronology: "disputed",
        evidence:
          "WHAT IS PROPOSED: that the flood tradition remembers a real inundation at Shuruppak — the city the texts name as Utnapishtim's — evidenced by a layer of clay and sand over Jemdet Nasr material, around the start of the Early Dynastic period. WHY IT IS FILED AS A CORRELATION: because that is what it is. The deposit establishes that Shuruppak flooded. It does not establish that anybody remembered this particular flood for two thousand years, or that the story is about it. WHAT WOULD BE NEEDED to make it more than a correlation: some line of evidence connecting the deposit to the narrative, which does not exist. IMPORTANT: Mesopotamian cities on an alluvial plain flooded repeatedly. A flood layer is the expected finding, not a remarkable one.",
        notes:
          "Stored on this record as a proposed_correlation rather than as a date, so that it can never be read as \"the Gilgamesh flood happened in 2900 BCE\". The archaeological deposit has its own record, where it is described as what it is.",
      },
    ],
  },
  {
    slug: "sumerian-king-list-flood",
    title: "The flood in the Sumerian King List",
    summary:
      "Not a story and not a date: a divider. Kingship before the flood, kingship after it — with antediluvian reigns given in tens of thousands of years.",
    description:
      "<p>The King List is a document about legitimacy, and the flood is the hinge it turns on. Kingship descends from heaven, passes through a series of antediluvian cities, and is swept away; afterwards it descends again and the historical dynasties begin.</p>" +
      "<p>The reigns before the flood are given in tens of thousands of years. That is not a chronology in any sense that converts to calendar dates, and treating it as one — by scaling the numbers down until they look reasonable — is arithmetic performed on a document that was not doing arithmetic.</p>" +
      "<p>What the list does establish is that by the time it was compiled, the flood was already a fixed and load-bearing feature of how Mesopotamians organised their past.</p>",
    category: "history",
    subcategory: "Chronology",
    eventType: "historical",
    tags: ["flood", "mesopotamia", "king-list", "chronology"],
    locationName: "Southern Mesopotamia",
    civilisations: ["Sumer"],
    motifs: ["previous_world_destroyed"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/The_Sumerian_King_List,_Ashmolean_Museum,_Oxford.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/The_Sumerian_King_List,_Ashmolean_Museum,_Oxford.jpg?width=1024",
        shows: "manuscript",
        caption:
          "The Weld-Blundell Prism in the Ashmolean Museum, the fullest copy of the Sumerian King List. It " +
          "gives reigns of tens of thousands of years before the flood and ordinary ones after it, which is a " +
          "statement about how the list is organised rather than a record of how long anybody lived.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "sumerian_king_list",
        temporalClaimType: "primordial",
        datePrecision: "year",
        isApproximate: false,
        whatIsDated: "Where the flood sits in the King List's ordering of the past",
        originalDateText: "\"then the flood swept over\" — the division between kingship before and kingship after",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "WHAT IS CLAIMED: a position in a sequence, not a year. The list divides all kingship into before and after the flood. HOW THE REIGNS ARE GIVEN: in tens of thousands of years for the antediluvian kings, which places them outside any calendar rather than early within one. WHAT IT ESTABLISHES: that the flood was a structural fact about the past for the people who compiled the list. WHAT IT DOES NOT: any date, and no scholarly correlation is assigned here — attaching c. 2900 BCE to this record, as is sometimes done, would import an archaeological proposal into a document that makes none.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// PART E — THE FLOOD DEPOSITS
//
// Archaeological facts about silt. Kept apart from the stories, and carrying
// the history of what happened when people stopped keeping them apart.
// ---------------------------------------------------------------------------

const DEPOSITS: SeedEvent[] = [
  {
    slug: "ur-flood-deposit",
    title: "The flood deposit at Ur",
    summary:
      "Nearly four metres of clean water-laid clay, found by Woolley in 1929 and announced as the Flood of Genesis. The identification did not survive the next decade.",
    description:
      "<p>Woolley found a thick band of water-laid clay with no trace of human activity in it, lying between Ubaid material below and Protoliterate debris above. He identified it with the Flood.</p>" +
      "<p><strong>What went wrong with the identification is the useful part.</strong> Within months, Kish had announced its own flood deposit and identified it with the same event — and the two are not contemporary. Woolley's Ur deposit is far too early to be the flood of the Ziusudra tradition. Max Mallowan later concluded that the stories reflect a real but local disaster around 3000 BCE rather than what Woolley had found.</p>" +
      "<p>The deposit is entirely real. A river city on an alluvial plain flooded badly, and the silt records it. Everything beyond that was interpretation.</p>",
    category: "archaeology",
    subcategory: "Flood deposit",
    eventType: "archaeological_interpretation",
    tags: ["flood", "mesopotamia", "ur", "excavation", "woolley"],
    locationName: "Ur, southern Iraq",
    people: ["Leonard Woolley", "Max Mallowan"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Royal_Cemetery_of_Ur_excavations_(B%26W).jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Royal_Cemetery_of_Ur_excavations_(B%26W).jpg?width=1024",
        shows: "site",
        caption:
          "Woolley's excavations at Ur. The flood deposit he announced in 1929 was found in a small number of " +
          "deep pits, and later work showed it is not present across the whole site \u2014 which is why this record " +
          "separates what was dug from what was concluded.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "woolley_ur",
        startYear: bce(3500),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        dateConvention: "calendar",
        whatIsDated: "The flood deposit in the Ur stratigraphy",
        originalDateText: "a water-laid clay deposit about 3.75 m thick, between Ubaid and Protoliterate levels",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        evidence:
          "WHAT WAS FOUND: roughly 3.75 metres of clean clay containing no trace of human occupation, sealed between Ubaid material and early Protoliterate debris. HOW IT IS DATED: by its position in the sequence, which places it at least as early as around 3500 BCE. WHAT IT ESTABLISHES: a severe flood at Ur, at that level, at that time. WHAT IT DOES NOT ESTABLISH: any connection to a literary flood. The stratigraphic date is too early for the Ziusudra tradition, and the deposit is not contemporary with the one found at Kish in the same excavation season.",
        notes:
          "Dated at century precision deliberately. Woolley's own reporting fixes the deposit's position in the sequence rather than a year, and a sharper number would be a precision the excavation did not produce.",
        citations: [
          {
            sourceKey: "penn_reflections",
            relation: "disputes",
            note:
              "The later reassessment: too early for the Ziusudra flood, and Mallowan's conclusion that the tradition reflects a local disaster around 3000 BCE rather than this deposit.",
          },
        ],
      },
    ],
  },
  {
    slug: "kish-flood-deposit",
    title: "The flood deposit at Kish",
    summary:
      "Announced within months of Ur's, identified with the same Genesis flood, and not contemporary with it. Two sites, two deposits, one story they could not both be.",
    description:
      "<p>During the 1928–29 season, archaeologists at Kish reported a flood deposit and identified it with the Flood of the Hebrew scriptures — as those at Ur were doing at the same moment.</p>" +
      "<p>The two identifications could not both stand, because the two deposits are not the same age. That is the whole lesson of this record, and it is why it is seeded alongside Ur rather than folded into it: <strong>the plain flooded often</strong>. Finding silt at a Mesopotamian city is evidence that the city flooded. Deciding which flood a story is about requires something the silt cannot supply.</p>",
    category: "archaeology",
    subcategory: "Flood deposit",
    eventType: "archaeological_interpretation",
    tags: ["flood", "mesopotamia", "kish", "excavation"],
    locationName: "Kish, central Iraq",
    claims: [
      {
        sourceKey: "ncse_flood_archaeology",
        startYear: bce(3000),
        endYear: bce(2900),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        dateConvention: "calendar",
        whatIsDated: "The flood deposit at Kish",
        originalDateText: "a flood deposit reported in the 1928–29 season, broadly around 3000–2900 BCE",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        evidence:
          "WHAT WAS FOUND: a flood deposit at Kish, announced within months of Woolley's at Ur and identified with the same Biblical flood. WHAT FOLLOWED: the two were assumed to be the same event, and are not — they are not contemporary, and the enthusiasm for a single archaeologically attested Flood could not be maintained. WHAT IT ESTABLISHES: that Kish flooded. NEEDS SOURCE VERIFICATION for a precise stratigraphic date: the range here is the broad period the excavation reports place it in, and anyone wanting a firmer figure should go to the Kish excavation reports directly rather than rely on this record.",
      },
    ],
  },
  {
    slug: "shuruppak-flood-deposit",
    title: "The flood deposit at Shuruppak",
    summary:
      "A layer of clay and sand over Jemdet Nasr ruins at Tell Fara, around 2900 BCE — at the city the flood stories name as their survivor's home.",
    description:
      "<p>Erich Schmidt, excavating Tell Fara in 1931, found an inundation layer lying directly on ruins of the Jemdet Nasr period, placing it near the transition into the Early Dynastic period around 2900 BCE.</p>" +
      "<p>This is the deposit most often proposed as the physical event behind the Mesopotamian flood tradition, and the reason is straightforward: <strong>Shuruppak is the city the texts name.</strong> Utnapishtim is a man of Shuruppak.</p>" +
      "<p>That coincidence is genuinely interesting and it is not proof. The deposit establishes that Shuruppak flooded badly around 2900 BCE. Whether a story told and copied for the next two thousand years is about that flood is a separate question, and nothing in the clay answers it. The proposal is recorded as a proposal, on the Utnapishtim record, with its reasoning.</p>",
    category: "archaeology",
    subcategory: "Flood deposit",
    eventType: "archaeological_interpretation",
    tags: ["flood", "mesopotamia", "shuruppak", "excavation", "early-dynastic"],
    locationName: "Shuruppak (Tell Fara), southern Iraq",
    people: ["Erich Schmidt"],
    claims: [
      {
        sourceKey: "shuruppak_excavation",
        startYear: bce(2900),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        dateConvention: "calendar",
        whatIsDated: "The flood deposit in the Shuruppak stratigraphy",
        originalDateText: "a layer of clay and sand on Jemdet Nasr ruins, c. 2900 BCE",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        evidence:
          "WHAT WAS FOUND: an inundation layer lying directly on Jemdet Nasr period material, excavated by Erich Schmidt in 1931. HOW IT IS DATED: stratigraphically. The Jemdet Nasr period runs roughly 3100–2900 BCE and the Early Dynastic begins around 2900, so a deposit sealing Jemdet Nasr ruins sits close to that boundary. WHAT IT ESTABLISHES: severe flooding at Shuruppak at that time. WHAT IT DOES NOT ESTABLISH: that the flood stories are about it — an interpretation, held by some, and recorded as a proposal on the record of the tradition rather than asserted here.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// PART F — ONE TEXT, THREE CHRONOLOGIES
// ---------------------------------------------------------------------------

const BIBLICAL: SeedEvent[] = [
  {
    slug: "noah-flood-chronologies",
    title: "Noah's flood: three texts, three dates",
    summary:
      "Genesis gives no year for the flood. Counting its genealogies produces 2348 BCE from the Masoretic text and about 3298 BCE from the Septuagint — a difference of some 950 years, from the same story.",
    description:
      "<p><strong>The Bible does not date the flood.</strong> What it gives is a genealogy: ages at which each patriarch fathered the next. A flood date is what you get by adding those up — and the three surviving textual traditions do not agree on the numbers.</p>" +
      "<p>The antediluvian totals differ sharply: 2,008 years in the Masoretic text, 2,249 in the Samaritan Pentateuch, 3,394 in the Septuagint. The same arithmetic on different manuscripts therefore lands centuries apart.</p>" +
      "<p>This is the clearest demonstration on the timeline of what a <em>calculated</em> date is. Ussher's 2348 BCE is not the Bible's date for the flood; it is Ussher's date, reached by his method on his chosen text, and it became familiar because it was printed in the margins of English Bibles.</p>",
    category: "religion",
    subcategory: "Chronology",
    eventType: "religious_account",
    tags: ["flood", "noah", "biblical", "chronology", "genealogy"],
    people: ["Noah", "James Ussher"],
    motifs: [
      "divine_warning",
      "divine_punishment",
      "human_behaviour",
      "chosen_survivor",
      "family_survives",
      "animals_preserved",
      "boat",
      "mountain_refuge",
      "birds_released",
      "waters_recede",
      "sacrifice_after",
      "sign_given",
      "repopulation",
      "prolonged_rain",
      "waters_from_below",
    ],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/James_Ussher_-_Annales.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/James_Ussher_-_Annales.jpg?width=1024",
        shows: "manuscript",
        caption:
          "The title page of Ussher's Annales Veteris Testamenti, 1650, where the 4004 BCE creation date is " +
          "calculated. THE BIBLE DOES NOT CONTAIN THIS DATE: Ussher derived it from biblical genealogies " +
          "together with Persian and Roman chronology, and the arithmetic is his.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "ussher_annals_flood",
        startYear: bce(2348),
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "genealogical_date",
        dateConvention: "calendar",
        whatIsDated: "The flood, counted through the Masoretic genealogies",
        originalDateText: "2348 BCE",
        datingMethod: "genealogy",
        chronology: "biblical",
        evidence:
          "WHAT IS CLAIMED: that the flood occurred in 2348 BCE. WHO CALCULATED IT: James Ussher, in the same 1650 work that placed creation at 4004 BCE. HOW: by counting the ages in the Masoretic genealogies of Genesis 5 and 11 and anchoring the resulting sequence to dates fixed from other sources. THE DISTINCTION THIS RECORD EXISTS TO MAKE: Genesis does not say 2348 BCE, and no Biblical text states a year for the flood. The number is the output of an addition, and the addition is Ussher's. EVIDENCE TYPE: textual and theological chronology.",
        notes:
          "The Masoretic antediluvian total is 2,008 years. That figure, not the year, is what the text actually supplies — the year appears only once somebody chooses where to attach the sequence.",
      },
      {
        sourceKey: "lxx_chronology",
        startYear: bce(3298),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "genealogical_date",
        dateConvention: "calendar",
        whatIsDated: "The flood, counted through the Septuagint genealogies",
        originalDateText: "about 3298 BCE",
        datingMethod: "genealogy",
        chronology: "biblical",
        evidence:
          "THE SAME GENEALOGY, A DIFFERENT MANUSCRIPT TRADITION, AND 950 YEARS OF DIFFERENCE. The Septuagint gives higher begetting ages for the patriarchs, so its antediluvian total is 3,394 years against the Masoretic 2,008 — and the flood lands around 3298 BCE. WHY BOTH ARE ON THIS RECORD: because the disagreement is between texts of the same scripture, not between religion and science, and that is a far more interesting thing for a student to see. WHAT IS NOT CLAIMED HERE: that either tradition preserves the original numbers. That is argued in the literature and this record takes no side.",
      },
      {
        sourceKey: "lxx_chronology",
        temporalClaimType: "unknown",
        durationYears: 2249,
        datePrecision: "year",
        isApproximate: false,
        whatIsDated: "The Samaritan Pentateuch's antediluvian span, which this dataset will not convert into a year",
        originalDateText: "2,249 years from creation to the flood, in the Samaritan Pentateuch",
        datingMethod: "genealogy",
        chronology: "biblical",
        evidence:
          "WHAT IS SOURCED: the span. The Samaritan Pentateuch's antediluvian total is 2,249 years — 241 more than the Masoretic and 1,145 fewer than the Septuagint. WHAT IS DELIBERATELY NOT ASSERTED: a BCE year. Converting the span into a date requires a particular chronologist's anchoring of the sequence, and no such calculation could be verified to the standard the rest of this record meets. NEEDS SOURCE VERIFICATION before any Samaritan flood year is stated. Subtracting 241 years from Ussher's 2348 would produce a number, and it would be this timeline's arithmetic rather than anybody's chronology.",
        notes:
          "Stored as a LENGTH rather than a date, which is what the source actually gives. The third tradition belongs on this record — leaving it out would suggest the disagreement has only two sides — and it belongs here without an invented year.",
      },
    ],
  },
];

export const FLOOD_MESOPOTAMIA_EVENTS: SeedEvent[] = [...TRADITIONS, ...DEPOSITS, ...BIBLICAL];

// ---------------------------------------------------------------------------
// The relationships
//
// The critical distinction runs through all of these: a deposit is RELEVANT to
// a tradition. It is not evidence for it. The one edge in this file that uses
// evidence_for is the one that does not exist.
// ---------------------------------------------------------------------------

export const FLOOD_MESOPOTAMIA_LINKS: SeedEventLink[] = [
  {
    from: "ziusudra-eridu-genesis",
    to: "atrahasis-flood",
    relation: "precedes",
    viewpoint: "archaeological",
    sourceKey: "eridu_genesis",
    note:
      "By the age of the surviving tablets, not by anything in the stories. The Sumerian tablet is seventeenth-century BCE and the Atrahasis recension is dated to within a couple of decades of 1635 BCE — so this orders two MANUSCRIPTS, and neither text orders itself against the other.",
  },
  {
    from: "atrahasis-flood",
    to: FLOOD_MESOPOTAMIA_ANCHOR_SLUG,
    relation: "source_of",
    viewpoint: "archaeological",
    sourceKey: "gilgamesh_xi",
    note:
      "Tablet XI draws on the older Atrahasis material — the flood episode in Gilgamesh is recognisably the same narrative, adapted. A relationship between texts, which is the one kind of relationship in this dataset that manuscripts can actually establish.",
  },
  {
    from: "sumerian-king-list-flood",
    to: "ziusudra-eridu-genesis",
    relation: "associated",
    sourceKey: "sumerian_king_list",
    note:
      "The King List and the Sumerian flood story treat the same flood as a fixed feature of the past, and the missing portions of the story tablet are conventionally reconstructed using the List. Associated, because they belong to one body of tradition — not identified, because they are different documents doing different work.",
  },
  {
    from: "shuruppak-flood-deposit",
    to: FLOOD_MESOPOTAMIA_ANCHOR_SLUG,
    relation: "relevant",
    viewpoint: "archaeological",
    sourceKey: "shuruppak_excavation",
    note:
      "RELEVANT, NOT EVIDENCE FOR. The deposit is at the city the texts name as Utnapishtim's, which is exactly why it gets proposed as the flood behind the story — and exactly why the link has to be labelled carefully. It establishes that Shuruppak flooded around 2900 BCE and nothing about what anybody later wrote.",
  },
  {
    from: "ur-flood-deposit",
    to: "kish-flood-deposit",
    relation: "related",
    viewpoint: "archaeological",
    sourceKey: "ncse_flood_archaeology",
    note:
      "Announced within months of each other in the 1928–29 season, each identified with the Flood of Genesis, and not contemporary with each other. Linked so that the pair can be read together, because neither makes the point on its own.",
  },
  {
    from: "ur-flood-deposit",
    to: "noah-flood-chronologies",
    relation: "responds_to",
    viewpoint: "archaeological",
    sourceKey: "woolley_ur",
    note:
      "Woolley's deposit was announced as an answer to the Genesis flood — that is what made it famous. Filed as answering the tradition rather than as evidence for it, because the identification did not hold: the deposit is too early for the Mesopotamian flood story and is not contemporary with Kish's.",
  },
  {
    from: "noah-flood-chronologies",
    to: FLOOD_MESOPOTAMIA_ANCHOR_SLUG,
    relation: "associated",
    sourceKey: "gilgamesh_xi",
    note:
      "The two narratives share a great deal of structure — the warning, the vessel, the animals, the mountain, the birds, the sacrifice — and the resemblance has been discussed since George Smith's 1872 translation. Recorded as an association between accounts, which is a fact about the texts. Who borrowed from whom, or whether both draw on something older, is a scholarly question this edge does not settle.",
  },
];
