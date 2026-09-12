import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

// =============================================================================
// PARTS G, H AND I — GREECE, INDIA AND IRAN
//
// Three traditions chosen together because each breaks a different assumption
// that the Mesopotamian set could not test.
//
// GREECE breaks "a tradition has one date". Deucalion's flood has a precise
// year — 1528/27 BCE — and it comes from a marble slab inscribed around 264/3
// BCE by an unknown compiler working twelve centuries after the supposed
// event. That is a real, checkable, ancient date, and it is a CHRONOGRAPHER'S
// date. Greece also supplies the best ancient statement of the problem this
// whole dataset exists for: an Egyptian priest telling Solon that the Greeks
// remember one flood when there have been many.
//
// INDIA breaks "a tradition is a fixed thing". The oldest surviving version of
// Manu and the fish has no Vishnu in it. The fish is a fish. The identification
// with Vishnu, and the fish's place as the first of ten descents, is a later
// development — so the tradition has a history, and that history is datable
// even though the flood is not.
//
// IRAN breaks "these are all flood stories". Yima is warned, builds an
// enclosure, and preserves the best of every living kind — the same shape as a
// flood narrative, with no flood in it. The catastrophe is a killing winter.
// The record says so, and refuses the label even though the standard English
// translation's own chapter heading applies it.
//
// NOT ONE OF THESE RECORDS DATES A FLOOD. Between them they carry
// chronographers' calculations, manuscript dates, a theological development
// and an interval nobody can convert — and no year for any catastrophe,
// because no source supplies one.
// =============================================================================

/** Astronomical year numbering: 1 BCE = 0, 2 BCE = −1. See time.ts. */
const bce = (year: number): number => 1 - year;

export const FLOOD_EURASIA_ANCHOR_SLUG = "deucalion-flood";

export const FLOOD_EURASIA_TRACK: SeedTrack = {
  name: "Flood traditions: Greece, India, Iran",
  slug: "flood-traditions-eurasia",
  kind: "theme",
  color: "#6b7f9e",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const FLOOD_EURASIA_SOURCES: SeedSource[] = [
  {
    key: "parian_marble",
    title: "The Parian Marble (Marmor Parium)",
    reference:
      "A marble stele inscribed c. 264/3 BCE, dated by its mention of the Athenian archon Diognetus; its table runs from 1581 BCE to 299/8 BCE",
    url: "https://en.wikipedia.org/wiki/Parian_Chronicle",
    sourceType: "historical_document",
    publishedDisplay: "inscribed c. 264/3 BCE",
    notes:
      "The earliest surviving Greek chronological table, and the source of the 1528/27 BCE date for Deucalion's flood. Cited for exactly that: a date assigned by a Hellenistic compiler, listed among events we would call mythical alongside events we would call historical, with no distinction drawn between them.",
  },
  {
    key: "plato_timaeus_floods",
    title: "Plato, Timaeus 22",
    reference: "Timaeus 22a–23c, in which an Egyptian priest addresses Solon",
    url: "http://www.perseus.tufts.edu/hopper/text?doc=Perseus:abo:tlg,0059,031:22",
    sourceType: "primary",
    publishedDisplay: "c. 360 BCE",
    notes:
      "Cited for the priest's statement that there have been many destructions of humankind, the greatest by fire and water, and that the Greeks remember one deluge only when there were many. The oldest explicit argument in this dataset that flood traditions are plural and partial.",
  },
  {
    key: "satapatha_brahmana",
    title: "Śatapatha Brāhmaṇa, Kāṇḍa I, Adhyāya 8, Brāhmaṇa 1",
    reference: "Julius Eggeling's translation, Sacred Books of the East vol. 12",
    url: "https://sacred-texts.com/hin/sbr/sbe12/sbe1234.htm",
    sourceType: "religious_text",
    publishedDisplay: "text c. 800–600 BCE",
    notes:
      "The earliest surviving Indian account of Manu and the fish. Cited for what it does and does not contain: a fish that warns Manu, a boat, a mountain, and the survivor becoming the progenitor of the next age — with no Vishnu, no avatar, and no date.",
  },
  {
    key: "satapatha_wisdomlib",
    title: "Śatapatha Brāhmaṇa 1.8.1 (parallel translation)",
    url: "https://www.wisdomlib.org/hinduism/book/satapatha-brahmana-english/d/doc63144.html",
    sourceType: "website",
    notes: "A second accessible translation of the same passage, for a reader who wants to compare renderings.",
    citedBy: "satapatha_brahmana",
  },
  {
    key: "matsya_development",
    title: "Matsya (the fish) — the development of the avatar identification",
    reference:
      "The developed form appears in the Matsya Purāṇa, the Bhāgavata Purāṇa (8.24) and the Agni Purāṇa; the fish-saviour is associated with Brahmā in the post-Vedic period and with Viṣṇu later still",
    url: "https://en.wikipedia.org/wiki/Matsya",
    sourceType: "wikipedia",
    notes:
      "An overview source, cited for one specific and checkable claim: that the identification of the fish with Viṣṇu is a later Purāṇic development and is absent from the earliest version. Follow its references rather than stopping here.",
  },
  {
    key: "vendidad_fargard2",
    title: "Vendīdād, Fargard 2 — Yima and the vara",
    reference: "James Darmesteter's translation, Sacred Books of the East vol. 4",
    url: "https://www.avesta.org/vendidad/vd2sbe.htm",
    sourceType: "religious_text",
    notes:
      "Cited for what the text actually describes: Ahura Mazda warning Yima of fatal winters sent by Mahrkūsha, and Yima building an enclosure to hold the finest of every kind of animal and plant. NOTE ON THE TRANSLATION: the chapter heading in this very edition calls it \"Yima and the deluge\", which the text beneath it does not support — a nineteenth-century editorial assimilation, and a useful illustration of how a tradition gets relabelled.",
  },
];

// ---------------------------------------------------------------------------
// PART G — GREECE
// ---------------------------------------------------------------------------

const GREEK: SeedEvent[] = [
  {
    slug: FLOOD_EURASIA_ANCHOR_SLUG,
    title: "Deucalion's flood",
    summary:
      "The Greek flood, and the one place in this dataset where a tradition carries a precise ancient year — assigned by a Hellenistic compiler twelve centuries after the event he was dating.",
    description:
      "<p>Zeus sends a flood; Deucalion and Pyrrha survive in a vessel, come to rest on a mountain, and repeople the world by casting stones behind them.</p>" +
      "<p><strong>The interesting thing here is the date.</strong> The Parian Marble — a stone chronological table inscribed around 264/3 BCE — places the flood at 1528/27 BCE. That is a real, checkable, ancient date, and it is worth being exact about what kind of date it is:</p>" +
      "<ul><li>It was assigned by an unknown compiler, around twelve hundred years after the event he was placing.</li>" +
      "<li>It sits in a table that runs mythical and historical events together without distinguishing between them.</li>" +
      "<li>No earlier Greek source gives a year at all.</li></ul>" +
      "<p>So the tradition does not have a date. A chronographer gave it one, and that act of giving is itself a datable historical event.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["flood", "greece", "deucalion", "chronography"],
    locationName: "Greece",
    people: ["Deucalion", "Pyrrha", "Zeus"],
    civilisations: ["Ancient Greece"],
    motifs: [
      "divine_warning",
      "divine_punishment",
      "chosen_survivor",
      "family_survives",
      "boat",
      "mountain_refuge",
      "waters_recede",
      "humanity_remade",
      "prolonged_rain",
    ],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Virgil_Solis_-_Deucalion_Pyrrha.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Virgil_Solis_-_Deucalion_Pyrrha.jpg?width=1024",
        shows: "later_artwork",
        caption:
          "Deucalion and Pyrrha throwing stones behind them to repopulate the earth, engraved by Virgil Solis " +
          "for a sixteenth-century Ovid. The picture is two thousand years after the Greek sources and " +
          "illustrates the story as Ovid tells it, which is already a Roman retelling.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "parian_marble",
        temporalClaimType: "primordial",
        datePrecision: "year",
        isApproximate: false,
        whatIsDated: "When the tradition itself places the flood",
        originalDateText: "in the age of Deucalion, before the peopling of Greece",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "WHAT IS CLAIMED: nothing datable. The Greek sources place the flood in the heroic past, before the genealogies they do count. No ancient narrative of Deucalion gives a year. The year on this record comes from a chronographer and is a separate claim.",
      },
      {
        sourceKey: "parian_marble",
        startYear: bce(1528),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "calculated_date",
        dateConvention: "calendar",
        whatIsDated: "The date the Parian Marble assigns to the flood",
        originalDateText: "1528/27 BCE, as reckoned on the Parian Marble",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        evidence:
          "WHAT IS CLAIMED: that the flood of Deucalion occurred in what we would call 1528/27 BCE. WHO CALCULATED IT: the anonymous compiler of the Parian Marble, working around 264/3 BCE — the inscription is dated by its own mention of the Athenian archon Diognetus. HOW: by counting back through the chronological framework the table is built on. WHAT IT ESTABLISHES: that by the third century BCE, Greek chronography placed the flood at a specific year. WHAT IT DOES NOT: that a flood occurred then. IMPORTANT: the table lists this beside events we would call historical and draws no distinction — the compiler was not separating myth from history, and reading the date as though he had is a modern assumption imposed on him.",
        notes:
          "Approximate at year precision because the inscription's year runs across our year boundary: 1528/27 BCE is one archon year, not two candidate dates.",
      },
      {
        sourceKey: "parian_marble",
        startYear: bce(264),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When the chronology assigning that date was inscribed",
        originalDateText: "c. 264/3 BCE, the date of the inscription",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "The stele itself, dated by its reference to the archon Diognetus. Recorded separately because the act of assigning a date to a myth is a historical event with its own date — and on this record the two are about 1,264 years apart.",
      },
    ],
  },
  {
    slug: "ogyges-flood",
    title: "The flood of Ogyges",
    summary:
      "A second, earlier Greek flood — dated in later chronography only by its distance from Deucalion's, which is an interval and not a year.",
    description:
      "<p>Greek tradition knows more than one flood. The flood of Ogyges is placed before Deucalion's, and later chronographers gave the gap between them as 250 years.</p>" +
      "<p><strong>This record deliberately carries no BCE year.</strong> An interval is not a date. Converting it would mean choosing a Deucalion date from one chronographer and an interval from another, and presenting the sum as though a single ancient authority had stated it. The Parian Marble's Deucalion date is on this timeline; a reader who wants the subtraction can do it, and will be doing it knowingly.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["flood", "greece", "ogyges", "chronography"],
    locationName: "Boeotia and Attica, Greece",
    people: ["Ogyges"],
    civilisations: ["Ancient Greece"],
    motifs: ["multiple_floods", "rising_sea"],
    claims: [
      {
        sourceKey: "parian_marble",
        temporalClaimType: "unknown",
        durationYears: 250,
        datePrecision: "year",
        isApproximate: true,
        whatIsDated: "The interval later chronography places between this flood and Deucalion's",
        originalDateText: "250 years before the flood of Deucalion, in later chronography",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        evidence:
          "WHAT IS CLAIMED: an interval, not a date. Later chronographers — the figure is attributed to Eusebius in the reference literature — put 250 years between the flood of Ogyges and the flood of Deucalion. WHY NO YEAR IS STORED: because turning an interval into a year requires an anchor, and the only anchor on this timeline comes from a different chronographer working in a different framework. Adding one man's interval to another man's date and presenting the result as an ancient chronology would be this timeline inventing a source. NEEDS SOURCE VERIFICATION for the passage in Eusebius that states the interval; it is cited here from reference literature rather than from the text.",
        notes:
          "The record exists because the brief is right that Ogyges and Deucalion must not be merged: Greek tradition itself distinguishes them, and a dataset that kept only the famous one would be flattening exactly what it claims to preserve.",
      },
    ],
  },
  {
    slug: "plato-many-destructions",
    title: "\"You remember one deluge only, whereas there were many\"",
    summary:
      "An Egyptian priest tells Solon that the Greeks know one flood and there have been many. The oldest argument in this dataset that flood traditions are plural and partial.",
    description:
      "<p>In the <em>Timaeus</em>, Solon offers the Egyptian priests the oldest Greek tradition he knows — Deucalion and Pyrrha, and the flood they survived. The priest is unimpressed, and his reply is the reason this record exists:</p>" +
      "<blockquote>There have been and there will be many and diverse destructions of humankind, the greatest by fire and water, and the lesser by countless other means… you remember one deluge only, whereas there were many of them.</blockquote>" +
      "<p>Whatever one makes of the rest of the dialogue, this passage is a twenty-four-century-old statement of the problem this dataset is built around: that a tradition preserving one catastrophe is not evidence that there was only one, and that the shape of what survives is determined by who was writing things down.</p>" +
      "<p>It is also, and separately, part of the frame around the Atlantis story — which is on this timeline as its own set of records, with its own dates and its own arguments.</p>",
    category: "culture",
    subcategory: "Ancient testimony",
    eventType: "historical",
    tags: ["flood", "greece", "plato", "testimony"],
    locationName: "Sais, Egypt (as narrated)",
    people: ["Plato", "Solon"],
    civilisations: ["Ancient Greece", "Ancient Egypt"],
    motifs: ["multiple_floods", "fire_and_flood", "previous_world_destroyed"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/The_Parian_Marble.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/The_Parian_Marble.jpg?width=1024",
        shows: "manuscript",
        caption:
          "The Parian Marble, a chronicle carved on stone in the third century BCE that dates Deucalion's flood " +
          "among its entries. IT IS A CHRONOGRAPHER'S DATE, twelve centuries after the event it places, and it " +
          "is evidence for how Greeks in the 260s BCE reckoned their past.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "plato_timaeus_floods",
        startYear: bce(360),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When the dialogue containing this passage was written",
        originalDateText: "c. 360 BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: the approximate date of the Timaeus. WHAT IT ESTABLISHES: that the argument was available to be made in the fourth century BCE. WHAT IT DOES NOT: anything about the Egyptian records the priest appeals to, or about any of the destructions he describes. This record is here for the argument, not for the history it asserts.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// PART H — INDIA
// ---------------------------------------------------------------------------

const INDIAN: SeedEvent[] = [
  {
    slug: "manu-and-the-fish",
    title: "Manu and the fish",
    summary:
      "The oldest surviving Indian flood account, in which the fish is a fish: no Vishnu, no avatar, no date. Manu is warned, builds a boat, and becomes the progenitor of the next age.",
    description:
      "<p>In the Śatapatha Brāhmaṇa, a fish warns Manu of a coming flood, is reared until it is large enough to help, and tows his boat to a mountain. Manu survives and becomes the ancestor of the next humanity.</p>" +
      "<p><strong>What is not in this version is the point of seeding it separately.</strong> The fish is not Viṣṇu. There is no avatar theology and no list of ten descents. Those arrive later, and the arrival has its own record on this timeline.</p>" +
      "<p>The text gives no year. It places the flood at the turn of an age — Manu becomes the progenitor of the next one — which is a position in a cycle rather than a point on a calendar. The Hindu cosmic cycles are already on this timeline, and this is the kind of position they describe.</p>",
    category: "religion",
    subcategory: "Flood tradition",
    eventType: "religious_account",
    tags: ["flood", "india", "manu", "matsya", "vedic"],
    locationName: "Northern India",
    people: ["Manu"],
    motifs: [
      "animal_warning",
      "chosen_survivor",
      "boat",
      "mountain_refuge",
      "waters_recede",
      "repopulation",
      "carried_by_animal",
    ],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Matsya_Avatar,_ca_1870.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Matsya_Avatar,_ca_1870.jpg?width=1024",
        shows: "later_artwork",
        caption:
          "Matsya, the fish, with Manu \u2014 an Indian watercolour of about 1870. The fish is not identified with " +
          "Vi\u1e63\u1e47u in the earliest telling: that identification is a later development, which this timeline dates " +
          "as its own event rather than folding into the story.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "satapatha_brahmana",
        temporalClaimType: "cyclic",
        datePrecision: "year",
        isApproximate: false,
        whatIsDated: "Where the tradition places the flood",
        originalDateText: "at the turn of an age, with Manu as progenitor of the next",
        datingMethod: "textual_interpretation",
        chronology: "hindu",
        evidence:
          "WHAT IS CLAIMED: a position within a cycle of ages, not a year. Manu survives and becomes the progenitor of the humanity that follows — which locates the flood at a transition between ages and nowhere on a calendar. WHY IT IS FILED AS CYCLIC rather than simply undated: the framework it sits in is explicitly one of repeating ages, and that framework is already on this timeline in the Hindu cosmological records. EVIDENCE TYPE: a Vedic prose text.",
        citations: [
          {
            sourceKey: "satapatha_wisdomlib",
            relation: "context",
            note: "A second translation of the same passage, for comparing renderings.",
          },
        ],
      },
      {
        sourceKey: "satapatha_brahmana",
        startYear: bce(700),
        endYear: bce(600),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When the earliest surviving version was composed",
        originalDateText: "the Śatapatha Brāhmaṇa, c. 800–600 BCE",
        datingMethod: "textual_interpretation",
        chronology: "archaeological",
        evidence:
          "WHAT IS CLAIMED: the approximate composition of the text, not of the tradition and certainly not of a flood. HOW IT IS DATED: by the linguistic and textual placement of the Śatapatha Brāhmaṇa within Vedic literature, conventionally around 800–600 BCE. IMPORTANT LIMITATION: Vedic dating is relative and contested in its details, and the range is wide for that reason. The claim stored here takes the later part of the range; the range itself is what the sources give.",
        notes:
          "Stored as 700–600 BCE, which is narrower than the c. 800–600 BCE the sources give — NEEDS SOURCE VERIFICATION for a firmer composition date before this is presented as settled.",
      },
    ],
  },
  {
    slug: "matsya-becomes-vishnu",
    title: "The fish becomes Viṣṇu",
    summary:
      "A datable development in a tradition whose flood is not datable: the fish of the oldest account acquires an identity, and becomes the first of Viṣṇu's descents.",
    description:
      "<p>In the earliest version the fish is simply a fish. In the Purāṇic literature — the Matsya Purāṇa, the Bhāgavata Purāṇa and the Agni Purāṇa — it is Viṣṇu, and Matsya takes its place as the first of the ten avatāras. In between, the fish-saviour is associated with Brahmā.</p>" +
      "<p>This record exists because <strong>the development is the part that can be dated</strong>. The flood cannot. A tradition is not a fixed object that either preserves a memory or does not; it is something people work on, and here the working is visible in the manuscripts.</p>",
    category: "religion",
    subcategory: "Development of a tradition",
    eventType: "historical",
    tags: ["india", "matsya", "vishnu", "purana", "tradition-history"],
    people: ["Viṣṇu", "Brahmā"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Matsya_avatara,_first_incarnation_of_Vishnu.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Matsya_avatara,_first_incarnation_of_Vishnu.jpg?width=1024",
        shows: "later_artwork",
        caption:
          "Matsya as the first incarnation of Vi\u1e63\u1e47u, from an illustrated manuscript of about 1803. By the time " +
          "this was painted the identification had been settled for centuries \u2014 which is exactly what makes it " +
          "a picture of the later tradition rather than of the earlier one.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "matsya_development",
        temporalClaimType: "unknown",
        datePrecision: "year",
        isApproximate: false,
        whatIsDated: "When the fish came to be identified with Viṣṇu",
        originalDateText: "in the Purāṇic period, after the Vedic account and by stages",
        datingMethod: "textual_interpretation",
        chronology: "hindu",
        evidence:
          "WHAT IS CLAIMED: that the identification is later than the earliest account and arrived by stages — the fish-saviour associated first with Brahmā in the post-Vedic period and with Viṣṇu later, reaching its developed form in the Matsya, Bhāgavata and Agni Purāṇas. WHY NO DATE IS STORED: Purāṇic dating is genuinely open, the texts were composed and recomposed over long periods, and a century here would be a number this timeline had chosen rather than one the sources give. WHAT IT ESTABLISHES: an ORDER, which is what the evidence supports — earliest version without Viṣṇu, later versions with him.",
        notes:
          "NEEDS SOURCE VERIFICATION for any dating of the Purāṇic redactions. The relative order is well attested; the absolute chronology is not, and this record does not supply one.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// PART I — IRAN
// ---------------------------------------------------------------------------

const IRANIAN: SeedEvent[] = [
  {
    slug: "yima-and-the-vara",
    title: "Yima's vara, and the winter that is not a flood",
    summary:
      "Warning, catastrophe, enclosure, the best of every living kind preserved — the whole shape of a flood story, with no flood in it. The catastrophe is a killing winter.",
    description:
      "<p>Ahura Mazda warns Yima that fatal winters are coming, loosed by Mahrkūsha — <em>the death-causing</em> — and that every kind of creature will perish. Yima builds a <em>vara</em>, an enclosure, and brings into it the finest representatives of every kind of animal and plant, and the best of people.</p>" +
      "<p><strong>This is not a water flood, and the record will not call it one.</strong> The structure is unmistakably the same as a flood narrative — warning, coming catastrophe, protected refuge, preservation of life, repopulation afterwards — and that structural resemblance is exactly why it belongs on a flood timeline. But the catastrophe in the text is ice, not water.</p>" +
      "<p>The mislabelling has a long history and is worth seeing. The standard nineteenth-century English translation heads this very chapter <em>&ldquo;Yima and the deluge&rdquo;</em>. The text beneath that heading describes a winter. A tradition can be assimilated to a more familiar one by an editor writing a chapter title, and once that happens it is quoted as a flood story by people who never read the passage.</p>",
    category: "religion",
    subcategory: "Catastrophe tradition",
    eventType: "religious_account",
    tags: ["iran", "zoroastrian", "yima", "catastrophe", "not-a-flood"],
    locationName: "Iran (Airyana Vaejah, as named in the text)",
    people: ["Yima", "Ahura Mazda"],
    // NO boat, NO rising sea, NO rain. Marking any of them would be assimilating
    // this account to the stories it merely resembles — the precise error the
    // record exists to demonstrate.
    motifs: [
      "divine_warning",
      "deadly_winter",
      "enclosure",
      "animals_preserved",
      "plants_preserved",
      "few_survive",
      "repopulation",
    ],
    claims: [
      {
        sourceKey: "vendidad_fargard2",
        temporalClaimType: "primordial",
        datePrecision: "year",
        isApproximate: false,
        whatIsDated: "Where the tradition places the catastrophe",
        originalDateText: "in the days of Yima, the first king",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "WHAT IS CLAIMED: a position in an originating age, not a year. Yima is the first king of the Iranian tradition, and the account places the winters in his reign. EVIDENCE TYPE: a Zoroastrian religious text. WHAT THE CATASTROPHE IS: fatal winters, loosed by Mahrkūsha, destroying creatures of the wilderness, the mountains and the valleys. NOT a flood, and the record does not describe it as one — although the chapter heading of the standard English translation does.",
        notes:
          "No composition date is stored. The dating of the Vendīdād is genuinely contested and a century here would be this timeline's choice rather than a source's. NEEDS SOURCE VERIFICATION before any date of composition is added.",
      },
    ],
  },
];

export const FLOOD_EURASIA_EVENTS: SeedEvent[] = [...GREEK, ...INDIAN, ...IRANIAN];

// ---------------------------------------------------------------------------
// The relationships
//
// Every cross-cultural edge here is "worth reading alongside" rather than
// anything stronger. Resemblance between traditions is a real and interesting
// fact; descent between them is a scholarly claim that needs a scholar, and no
// edge in this file asserts one.
// ---------------------------------------------------------------------------

export const FLOOD_EURASIA_LINKS: SeedEventLink[] = [
  {
    from: "ogyges-flood",
    to: FLOOD_EURASIA_ANCHOR_SLUG,
    relation: "precedes",
    viewpoint: "historical",
    sourceKey: "parian_marble",
    note:
      "Greek chronography places Ogyges before Deucalion and gives the gap as 250 years. The ordering is the claim; the interval is on the Ogyges record and is not converted into a year here or anywhere.",
  },
  {
    from: "plato-many-destructions",
    to: FLOOD_EURASIA_ANCHOR_SLUG,
    relation: "responds_to",
    viewpoint: "historical",
    sourceKey: "plato_timaeus_floods",
    note:
      "The passage is a direct reply to the Deucalion tradition: Solon offers it as the oldest thing the Greeks know, and the priest tells him it is one of many and that the Greeks have forgotten the rest.",
  },
  {
    from: "matsya-becomes-vishnu",
    to: "manu-and-the-fish",
    relation: "responds_to",
    sourceKey: "matsya_development",
    note:
      "A later development OF this account, not a separate tradition. The earliest version has no Viṣṇu in it; the identification is worked out afterwards, and keeping the two as separate records is what makes that visible.",
  },
  {
    from: "yima-and-the-vara",
    to: FLOOD_EURASIA_ANCHOR_SLUG,
    relation: "related",
    sourceKey: "vendidad_fargard2",
    note:
      "WORTH READING ALONGSIDE, AND NOT THE SAME KIND OF STORY. The structure matches — warning, catastrophe, refuge, preservation, repopulation — and the catastrophe does not: Yima's is a killing winter. Linked so the comparison can be made, and labelled so the comparison cannot be mistaken for an identification.",
  },
  {
    from: "manu-and-the-fish",
    to: FLOOD_EURASIA_ANCHOR_SLUG,
    relation: "related",
    sourceKey: "satapatha_brahmana",
    note:
      "Two traditions with a warned survivor, a vessel and a mountain. A resemblance worth examining, recorded as a resemblance — whether either derives from the other, or both from something older, is a scholarly question no edge in this dataset settles.",
  },
];
