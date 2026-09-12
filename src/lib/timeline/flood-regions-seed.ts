import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

// =============================================================================
// PARTS N TO S — NORTH AMERICA, THE PACIFIC, NORTHERN EUROPE, AND THE
// DISTRIBUTION OF THE EVIDENCE ITSELF
//
// Six records that between them break the last assumptions the earlier
// datasets could not reach.
//
// TWO NORTH AMERICAN RECORDS, AND THEY ARE NOT THE SAME RECORD. The
// Haudenosaunee account and the Anishinaabe account share a SHAPE — the
// earth-diver, where an animal brings up mud from under the water and the
// world is built on a turtle's back — and they belong to different nations,
// were collected by different people at different times, and stay apart. That
// is the whole rule of this material: a shared shape is a finding, and merging
// two nations' accounts to display the shape destroys the thing being shown.
//
// AND THE HAUDENOSAUNEE ACCOUNT IS NOT A FLOOD STORY AT ALL. There is no
// flood in it. The world below is water because it has always been water;
// nothing is destroyed, nobody is punished, and land is MADE rather than
// uncovered. Filing it as a flood myth — which compendia routinely do — is a
// category error, and the record says so.
//
// NORSE breaks "a flood is water". The frost giants drown in Ymir's blood.
// Bergelmir and his wife get out on a hollowed log, and the survivors are
// giants, not people. There is no humanity yet to save.
//
// HAWAIʻI breaks "a collector is a window". Fornander gathered a great deal
// and sometimes drew Christian material into Hawaiian genealogy; the native
// historians Malo and Kamakau describe a flood caused by a RISING SEA rather
// than by rain. Which of those a reader meets depends on whose book they open.
//
// AND THE LAST RECORD IS ABOUT THE RECORD. Fewer than two dozen flood
// traditions from sub-Saharan Africa appear in the standard indexes, and
// Frazer claimed there were none at all. That absence is substantially a fact
// about collecting, not about Africa — so this timeline states it as a
// property of the evidence base rather than quietly inheriting it as a map of
// the world.
//
// WHAT IS DELIBERATELY NOT HERE: Southeast Asia. The Ifugao account of Wigan
// and Bugan on two mountains is a real and well-known tradition, and the
// citation usually given for it — H. Otley Beyer — could not be verified to
// the standard the rest of this file meets. The brief says not to seed a
// source that cannot be verified, so it is not seeded, and this is the note
// saying why rather than a silent gap.
// =============================================================================

export const FLOOD_REGIONS_ANCHOR_SLUG = "haudenosaunee-sky-woman";

export const FLOOD_REGIONS_TRACK: SeedTrack = {
  name: "Flood traditions: North America, the Pacific, northern Europe",
  slug: "flood-traditions-regions",
  kind: "theme",
  color: "#5f6f8c",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const FLOOD_REGIONS_SOURCES: SeedSource[] = [
  {
    key: "hewitt_cosmology",
    title: "Iroquoian Cosmology",
    reference:
      "J. N. B. Hewitt — issued in two parts, in the 21st (1899–1900) and 43rd (1925–1926) Annual Reports of the Bureau of American Ethnology; published 1903 and 1928",
    url: "https://archive.org/details/iroquoiancosmolo00hewi",
    sourceType: "academic_paper",
    publishedDisplay: "1903 and 1928",
    notes:
      "Hewitt was Tuscarora and worked at the Bureau of American Ethnology for decades, recording Iroquoian " +
      "tradition from NAMED elders — most centrally John Arthur Gibson, an Onondaga faith-keeper. Naming the " +
      "speaker matters: an account attributed to 'the Iroquois' has no one behind it who can be checked or " +
      "disagreed with.",
  },
  {
    key: "johnston_ojibway",
    title: "Ojibway Heritage",
    reference: "Basil Johnston — McClelland and Stewart",
    url: "https://en.wikipedia.org/wiki/Basil_Johnston",
    sourceType: "academic_book",
    publishedDisplay: "1976",
    notes:
      "Johnston was Anishinaabe, from Wasauksing First Nation, writing his own people's tradition rather than " +
      "collecting somebody else's. That is a different kind of source from an ethnographer's notebook and the " +
      "difference is worth stating.",
  },
  {
    key: "grey_nga_mahi",
    title: "Ko ngā mahi a ngā tūpuna",
    reference: "Compiled by George Grey; first published 1854, with an English version as Polynesian Mythology",
    url: "https://archive.org/details/kongamahingaang00greygoog",
    sourceType: "historical_document",
    publishedDisplay: "1854",
    notes:
      "The most important published collection of Māori narrative, and gathered by a serving colonial Governor " +
      "largely from Te Arawa. Both halves of that sentence belong on the record: it preserves a great deal, and " +
      "the circumstances of its collection are part of what a reader is holding.",
  },
  {
    key: "fornander_collection",
    title: "Fornander's collection of Hawaiian tradition",
    reference: "Abraham Fornander, resident in the Hawaiian Islands c. 1830–1887, compiling from named informants",
    url: "https://en.wikipedia.org/wiki/Abraham_Fornander",
    sourceType: "historical_document",
    publishedDisplay: "later 19th century",
    notes:
      "Fornander gathered a very large body of material directly from Hawaiian informants, and also, at times, " +
      "drew Christian and other religious material into Hawaiian genealogies. The native historians Davida Malo " +
      "and Samuel Kamakau describe the flood as caused by a RISING SEA rather than by rain. This source is used " +
      "here for the tradition's existence and shape; where the two differ, the difference is the point.",
  },
  {
    key: "snorri_gylfaginning",
    title: "Gylfaginning, in the Prose Edda",
    reference: "Snorri Sturluson, composed in Iceland c. 1220",
    url: "https://en.wikipedia.org/wiki/Gylfaginning",
    sourceType: "historical_document",
    publishedDisplay: "c. 1220",
    notes:
      "Written in Christian Iceland, roughly two centuries after the conversion, by an author setting out " +
      "pre-Christian material for poets who needed to understand the old references. Not a pagan document: a " +
      "thirteenth-century account OF pagan material, which is a different thing and the reason its date is on " +
      "the record.",
  },
  {
    key: "witzel_pangaean",
    title: "Pan-Gaean Flood myths: Gondwana myths — and beyond",
    reference: "E. J. Michael Witzel — deposited in Harvard's DASH repository",
    url: "https://dash.harvard.edu/entities/publication/73120378-a28a-6bd4-e053-0100007fdf3b",
    sourceType: "academic_paper",
    notes:
      "Used here for one specific observation that can be checked: that standard compendia create the impression " +
      "flood traditions are rare in Africa and Australia, that fewer than two dozen from sub-Saharan Africa " +
      "appear in them, and that Frazer denied there were any. The paper's own wider thesis about the deep " +
      "history of these traditions is NOT seeded here and is not endorsed by this record.",
  },
];

// ---------------------------------------------------------------------------
// The records
// ---------------------------------------------------------------------------

export const FLOOD_REGIONS_EVENTS: SeedEvent[] = [
  {
    slug: FLOOD_REGIONS_ANCHOR_SLUG,
    title: "Sky Woman, and a world that was always water",
    summary:
      "In the Haudenosaunee account a woman falls from the sky world, animals dive for mud, and land is made on a turtle's back. There is no flood in it — and it is filed as one everywhere.",
    description:
      "<p>In the account recorded by J. N. B. Hewitt from John Arthur Gibson and other named speakers, the world below is water. A woman falls from the sky world; the water-animals see her coming; Turtle offers his back; Muskrat dives to the bottom and comes up with mud. The mud on Turtle's back becomes the earth. Sky Woman walks on it and bears twins.</p>" +
      "<p><strong>Nothing is destroyed and nobody is punished.</strong> The water is not a flood — it is what was there. Land is MADE, not uncovered. Calling this a flood myth, which compendia routinely do, files a creation account under a category it does not belong to, and then counts it as evidence that flood stories are universal.</p>" +
      "<p>It is on a flood timeline for exactly that reason: to be the record that says no.</p>",
    category: "culture",
    subcategory: "Creation account",
    eventType: "traditional_account",
    tags: ["north-america", "haudenosaunee", "earth-diver", "creation", "not-a-flood"],
    locationName: "Haudenosaunee territory, north-eastern North America",
    people: ["John Arthur Gibson"],
    civilisations: ["Haudenosaunee", "Onondaga", "Seneca", "Mohawk"],
    // THE EARTH-DIVER AND NOTHING ELSE. No flood, no warning, no punishment,
    // no survivors — there is nobody yet to survive.
    motifs: ["earth_diver"],
    claims: [
      {
        sourceKey: "hewitt_cosmology",
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "primordial",
        dateConvention: "unknown",
        whatIsDated: "Nothing — the account is of how the world came to be",
        originalDateText: "before the world",
        datingMethod: "source_assertion",
        chronology: "traditional",
        evidence:
          "WHAT THE SOURCE GIVES: an account of the world's making. There is no date because there is no time yet to date. POSITIONLESS ON PURPOSE. A creation account placed on a timeline at any year at all would be asserting something the tradition does not.",
      },
      {
        sourceKey: "hewitt_cosmology",
        startYear: 1903,
        endYear: 1928,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When this recording of the account was published",
        originalDateText: "published in two parts, 1903 and 1928",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: the publication, not the tradition. Hewitt recorded from named elders across decades and issued the work in two Bureau of American Ethnology reports. WHY THE NAMES MATTER: an account attributed to 'the Iroquois' has nobody behind it who can be checked, corrected or disagreed with; this one is attributable to speakers who can be named.",
      },
    ],
  },

  {
    slug: "anishinaabe-earth-diver",
    title: "Nanabozho, the muskrat, and the world remade",
    summary:
      "An Anishinaabe account in which the waters do rise, and afterwards the smallest animal succeeds where the strongest failed — bringing up the grain of earth the new world is built from.",
    description:
      "<p>In the Anishinaabe tradition as set down by Basil Johnston, the water covers the world and Nanabozho asks the animals to dive for a piece of the old earth. The strong swimmers try and fail. The muskrat goes down, and comes back dead with a single grain of soil in its paw. That grain, placed on the turtle's back, becomes the land.</p>" +
      "<p><strong>This shares its shape with the Haudenosaunee account and it is a different nation's account.</strong> Both are earth-diver narratives; they are not two tellings of one story and this timeline will not merge them to make the pattern easier to see. The pattern is only worth anything if the things being compared stay distinct.</p>" +
      "<p>Note what the story values: the animal that succeeds is the least powerful one, and it dies doing it. That is not an incidental detail and it is not in Noah.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["north-america", "anishinaabe", "ojibwe", "earth-diver", "nanabozho"],
    locationName: "Anishinaabe territory, around the Great Lakes",
    people: ["Nanabozho", "Basil Johnston"],
    civilisations: ["Anishinaabe"],
    motifs: ["earth_diver", "animals_preserved", "waters_recede", "humanity_remade"],
    claims: [
      {
        sourceKey: "johnston_ojibway",
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "primordial",
        dateConvention: "unknown",
        whatIsDated: "Nothing — the account gives no time",
        originalDateText: "no time is given",
        datingMethod: "source_assertion",
        chronology: "traditional",
        evidence:
          "WHAT THE SOURCE GIVES: a sequence of events and no chronology whatever. POSITIONLESS ON PURPOSE, and the temptation to guess is stronger here than almost anywhere, because a flood plus a re-creation looks like it ought to line up with something. It does not, and no source here says it does.",
      },
      {
        sourceKey: "johnston_ojibway",
        startYear: 1976,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When this telling was published",
        originalDateText: "Ojibway Heritage, 1976",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: the book. WHAT IS WORTH NOTING ABOUT IT: Johnston was Anishinaabe, writing his own people's tradition, which is a different kind of source from an outside ethnographer's record of it. Neither is automatically better and a reader should know which they have.",
      },
    ],
  },

  {
    slug: "para-whenua-mea-raft",
    title: "Para-whenua-mea and the raft",
    summary:
      "In a Māori account, two who were mocked for teaching the separation of sky and earth build a raft, provision it, and pray for rain until the water comes.",
    description:
      "<p>In the narrative collected in <em>Ko ngā mahi a ngā tūpuna</em>, Para-whenua-mea and Tupu-nui-a-uta taught the true account of the separation of Rangi and Papa and were mocked for it. They built a large raft at the source of the Tohinga river, made a house on it, provisioned it with fern-root, kūmara and dogs, and prayed for rain — to demonstrate the power of Tāne.</p>" +
      "<p><strong>The flood is asked for, by people, to settle an argument about doctrine.</strong> No god decides to destroy anybody; the water comes because it was prayed for. That is a different causal shape from every other record on this timeline, and the reason this one is here.</p>" +
      "<p>The collection is a colonial one — assembled by a serving Governor, largely from Te Arawa — and that is on the record with it.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["pacific", "maori", "aotearoa", "new-zealand", "raft"],
    locationName: "Aotearoa New Zealand",
    people: ["Para-whenua-mea", "Tupu-nui-a-uta", "George Grey"],
    civilisations: ["Māori", "Te Arawa"],
    motifs: ["human_behaviour", "prolonged_rain", "raft", "few_survive"],
    claims: [
      {
        sourceKey: "grey_nga_mahi",
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "unknown",
        dateConvention: "unknown",
        whatIsDated: "Nothing — the account gives no time",
        originalDateText: "no time is given",
        datingMethod: "source_assertion",
        chronology: "oral_tradition",
        evidence:
          "WHAT THE SOURCE GIVES: a narrative with named people, a named river and no chronology. POSITIONLESS ON PURPOSE.",
      },
      {
        sourceKey: "grey_nga_mahi",
        startYear: 1854,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When the collection was published",
        originalDateText: "1854",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: the printed collection. WHO MADE IT AND IN WHAT CAPACITY: George Grey, then Governor, gathering narrative largely from Te Arawa. The volume preserves a great deal and the circumstances of its making are part of the evidence, not a footnote to it.",
      },
    ],
  },

  {
    slug: "kai-a-kahinalii",
    title: "Kai a Kahinaliʻi — the sea of Kahinaliʻi",
    summary:
      "A Hawaiian account of the sea rising and overwhelming the land. Which version a reader meets depends on whose collection they open, and the difference is not small.",
    description:
      "<p>The Hawaiian tradition names the event: <em>Kai a Kahinaliʻi</em>, the sea of Kahinaliʻi — the ocean rising and covering the land.</p>" +
      "<p><strong>The interesting part is the disagreement between the sources.</strong> Abraham Fornander gathered an enormous amount of Hawaiian material directly from informants, and also at times drew Christian material into Hawaiian genealogies — producing accounts that read closer to Genesis than the Hawaiian historians do. The native historians Davida Malo and Samuel Kamakau describe a flood caused by a <em>rising sea</em>, not by rainfall.</p>" +
      "<p>A rising sea and forty days of rain are not the same event, and the difference between them here is a difference between collectors rather than between traditions. This record exists to keep that visible instead of averaging it away.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["pacific", "hawaii", "kahinalii", "oral-tradition", "source-criticism"],
    locationName: "The Hawaiian Islands",
    people: ["Kahinaliʻi", "Abraham Fornander", "Davida Malo", "Samuel Kamakau"],
    civilisations: ["Native Hawaiian"],
    // A rising sea, per the Hawaiian historians. NOT prolonged rain, which is
    // the shape the Christianising retellings give it.
    motifs: ["rising_sea"],
    claims: [
      {
        sourceKey: "fornander_collection",
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "unknown",
        dateConvention: "unknown",
        whatIsDated: "Nothing — no date is given in the tradition",
        originalDateText: "no time is given",
        datingMethod: "source_assertion",
        chronology: "oral_tradition",
        evidence:
          "WHAT THE SOURCE GIVES: a named event and a genealogy it sits in, and no date. GENEALOGIES ARE NOT DATES: a count of generations can be converted into years only by assuming a length for a generation and a fixed end point, and neither is supplied here. POSITIONLESS ON PURPOSE. NEEDS SOURCE VERIFICATION: the specific wording of Malo's and Kamakau's accounts, against their own published texts rather than summaries of them.",
      },
    ],
  },

  {
    slug: "ymir-flood-of-blood",
    title: "The frost giants drown in Ymir's blood",
    summary:
      "In the Prose Edda the sons of Bor kill Ymir and the flood from his wounds drowns the frost giants. Two escape in a hollowed log. There are no people in this story at all.",
    description:
      "<p>In Snorri Sturluson's <em>Gylfaginning</em>, Odin and his brothers kill the primordial being Ymir. So much blood comes from the wounds that the frost giants are drowned in it — all but Bergelmir, who gets away with his wife on a <em>lur</em>, a hollowed-out log. From those two the frost giants descend again. Ymir's body is then made into the world: his blood the sea, his flesh the earth, his bones the mountains.</p>" +
      "<p><strong>The flood is not water and the victims are not humanity.</strong> Human beings do not exist yet. Nothing is punished, nothing is warned, and the survivors are members of the race being destroyed rather than a chosen remnant of it. Filed beside Noah it looks like a parallel; read, it is a different kind of event entirely.</p>" +
      "<p>And the text is thirteenth-century and Christian-authored — Snorri was setting out pre-Christian material for poets who needed to understand old references. That is not a reason to discount it. It is a reason to date the document rather than the belief.</p>",
    category: "culture",
    subcategory: "Flood tradition",
    eventType: "traditional_account",
    tags: ["northern-europe", "norse", "iceland", "ymir", "not-water"],
    locationName: "Iceland, where the text was composed",
    people: ["Ymir", "Bergelmir", "Snorri Sturluson"],
    civilisations: ["Norse", "Medieval Iceland"],
    // No warning, nobody chosen, no punishment, no repopulation of humanity —
    // the survivors repopulate the giants. A container, not a built ark.
    motifs: ["conflict_of_powers", "no_warning", "container", "few_survive", "previous_world_destroyed"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ymir_gets_killed_by_Froelich.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Ymir_gets_killed_by_Froelich.jpg?width=1024",
        shows: "later_artwork",
        caption:
          "Lorenz Fr\u00f8lich's drawing of Ymir's killing, made in the nineteenth century for a Danish edition of the " +
          "Norse myths. A Victorian illustrator picturing a thirteenth-century Icelandic text about something " +
          "older than that: three removes, and nothing in the line work marks which details come from the text.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "snorri_gylfaginning",
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "primordial",
        dateConvention: "unknown",
        whatIsDated: "Nothing — the account is set before the world is made",
        originalDateText: "before the world was made from Ymir's body",
        datingMethod: "source_assertion",
        chronology: "traditional",
        evidence:
          "WHAT THE SOURCE GIVES: a position before the making of the world, and no time. POSITIONLESS ON PURPOSE.",
      },
      {
        sourceKey: "snorri_gylfaginning",
        startYear: 1220,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        dateConvention: "calendar",
        whatIsDated: "When the text was composed",
        originalDateText: "c. 1220",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: the Prose Edda, composed in Iceland around 1220 — roughly two centuries after the conversion, by a Christian author setting out pre-Christian material. WHAT THIS ESTABLISHES: the date of the surviving account. WHAT IT DOES NOT: how old the tradition behind it is, or how much of it reached Snorri intact.",
      },
    ],
  },

  {
    slug: "flood-tradition-collection-bias",
    title: "Where the flood traditions were collected, and where they were not",
    summary:
      "Standard indexes make flood traditions look rare in Africa and Australia. Fewer than two dozen from sub-Saharan Africa appear in them, and Frazer said there were none. That is a fact about collecting.",
    description:
      "<p>Any map of where flood traditions are found is also a map of where somebody went looking, in what decade, speaking which languages, and what they were willing to write down.</p>" +
      "<p><strong>The standard compendia create the impression that flood traditions are rare in Africa and Australia.</strong> Fewer than two dozen from sub-Saharan Africa appear in them — and J. G. Frazer stated that the continent had none at all, which was wrong. Australia's traditions of coastal inundation, the subject of another record on this timeline, were barely represented in those indexes either.</p>" +
      "<p>This record is here so that the shape of this dataset can be read honestly. A comparison across regions is only as good as the collecting behind it, and every gap on this timeline should be read first as a gap in what was gathered and gathered <em>from whom</em> — not as a gap in what people told.</p>",
    category: "science",
    subcategory: "Method",
    eventType: "scientific_model",
    tags: ["method", "historiography", "africa", "australia", "collection-bias"],
    people: ["James George Frazer"],
    claims: [
      {
        sourceKey: "witzel_pangaean",
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        dateConvention: "unknown",
        whatIsDated: "Nothing — this is a statement about the evidence base, not an event",
        originalDateText: "a property of the collections, not a date",
        datingMethod: "source_assertion",
        chronology: "scientific",
        evidence:
          "WHAT IS CLAIMED: that the standard indexes under-represent sub-Saharan African and Australian flood traditions, that fewer than two dozen African ones appear in them, and that Frazer denied there were any. WHY IT IS POSITIONLESS: it describes a body of scholarship rather than something that happened at a time. WHAT IS NOT CLAIMED HERE: the cited paper's wider thesis about the deep history of these traditions, which is a separate argument and is not seeded.",
      },
    ],
  },
];

export const FLOOD_REGIONS_LINKS: SeedEventLink[] = [
  {
    from: "anishinaabe-earth-diver",
    to: FLOOD_REGIONS_ANCHOR_SLUG,
    relation: "related",
    viewpoint: "traditional",
    note:
      "Two earth-diver accounts, from two distinct nations, collected by different people in different centuries. Worth reading together AND worth keeping apart: the shared shape is the finding, and it stops being a finding the moment the two are merged into one record.",
  },
  {
    from: "flood-tradition-collection-bias",
    to: "para-whenua-mea-raft",
    relation: "relevant",
    viewpoint: "scientific",
    sourceKey: "witzel_pangaean",
    note:
      "Every account on this timeline arrived through somebody's collecting. This record is the general statement of that; the Grey volume is one concrete instance of it.",
  },
];
