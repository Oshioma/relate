import type { SeedEvent, SeedSource, SeedTrack, SeedEventLink } from "./seed-types";

// =============================================================================
// WORKED STONE: WHO CUT IT, AND HOW ANYBODY KNOWS
//
// Fifth tranche. Three Old World sites where nobody disputes that the stone was
// shaped by people — the blocks are unmistakably cut, and at Baalbek they are
// the largest cut stones known anywhere. The argument is about ATTRIBUTION: who
// cut them, and when.
//
// THAT MAKES THIS A DIFFERENT PROBLEM FROM THE TWO TRANCHES BEFORE IT. At
// Yonaguni the question was whether anything was made. At Dorchester it was
// whether an object was ever in the rock. Here the making is not in doubt and
// the date has to come from somewhere else. Each of these records is a study in
// where.
//
// THE FOUR KINDS OF EVIDENCE THAT CAN DATE CUT STONE, and they are not equal:
//
//   • THE QUARRY. Baalbek's case is the strongest of any site in this dataset,
//     and the reason is that the job was never finished. Two colossal blocks are
//     still lying in the quarry 800 m from the temple, with tooling marks on
//     them, and one was abandoned because of a flaw in its edge. Unfinished work
//     tells you who was working, how, and why they stopped.
//   • AN INSCRIPTION. Seti I's cartouche is on the Osireion's entrance passage.
//     That is evidence, and this record also says what it is not: none of the
//     main interior blocks carries any inscription at all.
//   • DATED MATERIAL IN THE FABRIC. Charcoal in Giza's mortar can be
//     radiocarbon dated. It is the most direct method available there, and its
//     results are messier than either side of the popular argument admits.
//   • AN ASTRONOMICAL ALIGNMENT. Which can be a real dating method or can be
//     nothing at all, depending entirely on what is being aligned to what.
//
// AND GIZA CARRIES THREE USES OF PRECESSION ON ONE RECORD, which is the most
// useful thing in this tranche. Spence used the drift of two circumpolar stars
// to date the start of the Great Pyramid to within a few years, and other
// specialists published against her method. Bauval ran precession backwards to
// find when Orion's belt stood to the Milky Way as the pyramids stand to the
// Nile, and got 10,500 BCE — which is a date for A SKY, and becomes a date for
// stone only by a further step that has to be argued separately. Posnansky, on
// the Tiwanaku record in this dataset, ran a solstice azimuth backwards at a
// star's rate and got 15,000 BCE, which is an error that can be pointed at.
// Same physics, three different evidentiary standings. Telling them apart is a
// skill, and a timeline is a good place to practise it.
//
// NO CONFIDENCE SCORES, no verdict words, and no deciding it for the reader.
// Where a claimant's own position is narrower than the version in circulation,
// the record carries his.
// =============================================================================

export const ANCIENT_SITES_WORKED_STONE_ANCHOR_SLUG = "baalbek-megaliths";

export const ANCIENT_SITES_WORKED_STONE_TRACK: SeedTrack = {
  name: "Worked stone: who cut it, and how anybody knows",
  slug: "ancient-sites-worked-stone",
  kind: "theme",
  color: "#8a7f6d",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_WORKED_STONE_SOURCES: SeedSource[] = [
  // --- Baalbek ------------------------------------------------------------
  {
    key: "dai_baalbek2014",
    title: "Research team discovers the world's largest ancient stone block at Baalbek",
    workTitle: "HeritageDaily, reporting the German Archaeological Institute's excavation",
    url: "https://www.heritagedaily.com/2014/12/research-team-discover-the-worlds-largest-ancient-stone-block-in-baalbek/105790",
    sourceType: "website",
    publishedYear: 2014,
    notes:
      "Report of the German Archaeological Institute's 2014 work in the Baalbek quarry: a block 19.6 m long, 6 m " +
      "wide and at least 5.5 m high, of around 1,650 tons, still lying where it was cut. Cited for the excavation " +
      "and its finding about the neighbouring Hajjar al-Hibla — that the machining marks show it was left behind " +
      "because of poor stone at one edge. NEEDS SOURCE VERIFICATION for the institute's own publication, which " +
      "could not be reached; this is a report of it rather than the report itself.",
  },
  {
    key: "wikipedia_baalbek_stones",
    title: "Baalbek Stones — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Baalbek_Stones",
    sourceType: "wikipedia",
    notes:
      "Used for the inventory of blocks, their dimensions and weights, the distance from quarry to temple, and the " +
      "attribution of the podium to the Roman sanctuary of Jupiter. Orientation only — the load-bearing evidence " +
      "on this record is the unfinished quarry work.",
  },

  // --- The Osireion -------------------------------------------------------
  {
    key: "wikipedia_osireion",
    title: "Osireion — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Osireion",
    sourceType: "wikipedia",
    notes:
      "Used for the excavation history — Flinders Petrie and Margaret Murray in 1902–03 — for the position of the " +
      "Seti I cartouche on the entrance passage and the absence of inscription on the interior blocks, for " +
      "Naville's Old Kingdom suggestion, and for Strabo's attribution. Every one of those is followed in the text " +
      "to the person who said it, because an attribution without a name is not a claim.",
  },
  {
    key: "strabo_geography",
    title: "Geography, Book XVII",
    author: "Strabo",
    reference: "First century BCE",
    sourceType: "primary",
    notes:
      "Strabo describes the monument at Abydos and names its builder as Ismandes or Mandes, usually read as " +
      "Amenemhet III — the king also associated with the labyrinth at Hawara, which Strabo saw as similar in its " +
      "subterranean, water-related design. Cited as a classical attribution, which is evidence about what was " +
      "believed in the first century BCE and not a measurement of anything.",
  },

  // --- Giza ---------------------------------------------------------------
  {
    key: "spence2000",
    title: "Ancient Egyptian chronology and the astronomical orientation of pyramids",
    author: "Kate Spence",
    workTitle: "Nature",
    reference: "Volume 408, pages 320–324 (2000)",
    url: "https://www.nature.com/articles/35042510",
    sourceType: "academic_paper",
    publishedYear: 2000,
    notes:
      "Spence argued that Old Kingdom pyramids were oriented to north by the simultaneous transit of two " +
      "circumpolar stars, Kochab and Mizar, and that modelling their precession dates the start of the Great " +
      "Pyramid to about 2470 BCE within a few years. Cited as the clearest example in this dataset of an " +
      "astronomical alignment used as a genuine dating method, and as a method that was argued with in print.",
  },
  {
    key: "nature_orientation_reply",
    title: "Astronomical orientation of the pyramids",
    workTitle: "Nature",
    reference: "2001, in reply to Spence (2000)",
    url: "https://www.nature.com/articles/35089138",
    sourceType: "academic_paper",
    publishedYear: 2001,
    notes:
      "A published response questioning Spence's method and the precision claimed for it. Cited because an " +
      "alignment-based date being contested by specialists is exactly what a reader needs to see: the objection " +
      "to an astronomical argument is itself an ordinary scientific move, made here about a mainstream paper. " +
      "NEEDS SOURCE VERIFICATION for the authors, which could not be confirmed.",
  },
  {
    key: "bonani2001",
    title: "Radiocarbon dates of Old and Middle Kingdom monuments in Egypt",
    author:
      "Georges Bonani, Herbert Haas, Mark Lehner, Shawki Nakhla, John Nolan, Robert Wenke, Wilma Wetterstrom and Willy Wölfli",
    workTitle: "Radiocarbon",
    reference: "2001",
    sourceType: "academic_paper",
    publishedYear: 2001,
    notes:
      "The Pyramids Radiocarbon Dating Projects of 1984 and 1995, reporting hundreds of measurements on Egyptian " +
      "material, including charcoal inclusions in pyramid mortar. Cited for the most direct dating evidence Giza " +
      "has and for its complications — the Great Pyramid's 1995 results scatter over some four hundred years and " +
      "run older than the historical estimates rather than matching them.",
  },
  {
    key: "bauval1989",
    title: "A master plan for the three pyramids of Giza based on the configuration of the three stars of the belt of Orion",
    author: "Robert Bauval",
    workTitle: "Discussions in Egyptology",
    reference: "Volume 13 (1989)",
    url: "https://gizamedia.rc.fas.harvard.edu/documents/bauval_de_13_1989.pdf",
    sourceType: "academic_paper",
    publishedYear: 1989,
    notes:
      "The claimant's own first publication of the Orion correlation, hosted in Harvard's Giza archive. Cited " +
      "rather than any later popular account, because this dataset requires an alternative claim to come from the " +
      "person who made it — and because what Bauval actually published is narrower than the version in " +
      "circulation.",
  },
  {
    key: "bauval_gilbert1994",
    title: "The Orion Mystery",
    author: "Robert Bauval and Adrian Gilbert",
    sourceType: "book",
    publishedYear: 1994,
    notes:
      "The book that carried the Orion correlation to a general readership, and where the 10,500 BCE epoch is " +
      "developed — the precessional moment at which Orion's belt stood in relation to the Milky Way as the three " +
      "pyramids stand in relation to the Nile. Cited as the claimants' own statement of the dating argument.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_WORKED_STONE_EVENTS: SeedEvent[] = [
  // =========================================================================
  // BAALBEK — where the unfinished work is the evidence.
  // =========================================================================
  {
    slug: ANCIENT_SITES_WORKED_STONE_ANCHOR_SLUG,
    title: "The Baalbek megaliths are cut",
    summary:
      "The largest cut stones known anywhere — and two of them are still lying in the quarry, tooled, unmoved, one abandoned because of a flaw in its edge.",
    description:
      "At Baalbek in Lebanon, the podium of the Roman temple of Jupiter rests on courses of colossal limestone blocks, three of which — the Trilithon — weigh in the region of 800 tons each. They are among the largest stones ever moved by people.\n\n" +
      "AND THE LARGEST ONES WERE NEVER MOVED AT ALL, WHICH IS THE POINT. About 800 metres from the temple, in the quarry, lies the Hajjar al-Hibla, the Stone of the Pregnant Woman, of roughly 1,000 tons. In 2014 the German Archaeological Institute partly excavated a second and larger block beside it: 19.6 m long, 6 m wide, at least 5.5 m high, around 1,650 tons. It is the biggest cut stone known from antiquity and it is still attached to the bedrock it was being freed from.\n\n" +
      "WHY AN UNFINISHED JOB IS BETTER EVIDENCE THAN A FINISHED ONE. A block in a wall tells you it arrived. A block in a quarry tells you how the work was done, by whom, and sometimes why it stopped: the machining marks on the Hajjar al-Hibla show the stone was left where it lay because of poor material along one edge, which would have risked the block breaking in transit. That is a quarryman's decision, recorded in the rock, and it is the kind of evidence that no argument from incredulity can get around.\n\n" +
      "SO THE COMMON OBJECTION ANSWERS ITSELF. 'Nobody could have moved stones that size' is addressed by the fact that nobody did move these. They cut them, assessed them, rejected one and abandoned the other, and the blocks they did move — the Trilithon — are smaller. The limit on the operation is visible in the quarry.\n\n" +
      "WHAT THE STONES ARE FOR, AND WHAT IS HONESTLY UNCERTAIN. The blocks were quarried for the podium of the Jupiter temple in the Roman sanctuary. That attribution is not in dispute. A closer bracket for the podium's construction than 'the Roman period' is not seeded here, because no source consulted for this entry gave one that could be checked.\n\n" +
      "ALTERNATIVE ACCOUNTS PLACE THE PODIUM BEFORE THE ROMANS, sometimes far before, and they are usually arguments from the size of the stones rather than from anything at the site. This record does not answer them with a verdict. It sets out what is in the quarry, which is where the question is actually decided.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "The attribution to the Roman sanctuary is not disputed by archaeologists. It is disputed in popular accounts, almost always on the grounds that the stones are too large — a claim the quarry speaks to directly.",
    tags: ["baalbek", "lebanon", "trilithon", "megalithic", "quarry", "ancient-sites"],
    locationName: "Baalbek, Beqaa Valley, Lebanon",
    civilisations: ["Roman Empire"],
    lat: 34.0069,
    lng: 36.2039,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Trilithon_of_Baalbek_3.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Trilithon_of_Baalbek_3.jpg?width=1024",
        shows: "site",
        caption:
          "The trilithon in the podium wall at Baalbek: three blocks, each around 800 tonnes, laid in a Roman " +
          "temple platform. The size is not in question by anybody; who laid them, and when, is what the record is " +
          "about.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Megaliths_in_Baalbek_quarry_10024.jpg?width=1024",
        shows: "site",
        caption:
          "A block still lying in the quarry below the site, never moved. AN UNFINISHED STONE IS EVIDENCE ABOUT " +
          "METHOD: it shows where the stone came from and how far it got, which a finished wall cannot.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "wikipedia_baalbek_stones",
        startYear: -99,
        endYear: 200,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Roman sanctuary of Jupiter, built across the first centuries BCE and CE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        whatIsDated: "The Roman sanctuary the blocks were quarried for",
        evidence:
          "WHAT IS DATED: the building programme of the sanctuary. DATING METHOD: the archaeology of the site, " +
          "within the Roman period. WHAT IT ESTABLISHES: that the colossal blocks were cut for the podium of the " +
          "Jupiter temple in that programme. WHAT IT DOES NOT ESTABLISH: a close date. This is stored as a wide " +
          "bracket on purpose, because a wide bracket that can be defended is worth more than a precise one that " +
          "cannot.",
        notes:
          "NEEDS SOURCE VERIFICATION for a closer bracket. The Roman attribution of the podium is secure and the " +
          "decade is not, and a reader is better served by being told which is which than by a tidy figure.",
      },
      {
        sourceKey: "dai_baalbek2014",
        startYear: 2014,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "the 1,650-ton block excavated in the quarry in 2014",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The excavation that found the largest known cut stone",
        evidence:
          "WHAT IS DATED: the excavation. DATING METHOD: the historical record. WHAT IT ESTABLISHES: that a block " +
          "of 19.6 by 6 by at least 5.5 metres, of around 1,650 tons, lies in the quarry where it was being cut, " +
          "and that tooling marks on the neighbouring Hajjar al-Hibla indicate it was abandoned for a flaw along " +
          "one edge. WHAT IT DOES NOT ESTABLISH: a date for the podium by itself — it establishes something better " +
          "suited to the actual argument, which is who was cutting, how, and where the work stopped.",
        notes:
          "THE UNFINISHED WORK IS THE LOAD-BEARING EVIDENCE ON THIS RECORD, which is why the excavation gets a " +
          "claim of its own rather than a sentence in the description. A quarry with abandoned blocks in it is the " +
          "closest thing a site like this has to a signed statement.",
      },
    ],
  },

  // =========================================================================
  // THE OSIREION — three named attributions, one of them from an Egyptologist.
  // =========================================================================
  {
    slug: "osireion-abydos",
    title: "The Osireion at Abydos is attributed",
    summary:
      "Cyclopean granite at Abydos, with Seti I's cartouche on the entrance and not one inscription inside. Three people have put three different dates on it, and all three were specialists.",
    description:
      "In 1902–03 Flinders Petrie and Margaret Murray excavated a structure behind the temple of Seti I at Abydos: a subterranean hall of massive granite piers and architraves, surrounded by water, wholly unlike the finely decorated limestone of the temple in front of it.\n\n" +
      "THE ATTRIBUTION TO SETI I, AND EXACTLY WHAT IT RESTS ON. The entrance passage carries a cartouche of Seti I, carved into the stone along the approach corridor, and that is the principal reason the structure is assigned to his reign, about 1290 to 1279 BCE. It is real evidence and this record treats it as such.\n\n" +
      "AND WHAT IT DOES NOT REST ON, WHICH A READER SHOULD ALSO HAVE. None of the main interior blocks carries any inscription at all. So the cartouche dates the corridor it is cut into, and it dates the interior by the assumption that corridor and interior are one build — which is a reasonable assumption and is an assumption.\n\n" +
      "NAVILLE'S OLD KINGDOM SUGGESTION WAS NOT A FRINGE CLAIM. Édouard Naville, who worked at the site after Petrie, proposed a 4th-Dynasty date, in the region of 2580 to 2565 BCE, on the strength of the megalithic granite piers and the cyclopean masonry and their resemblance to work like the Sphinx temple. He was a professional Egyptologist making an argument from architecture in print, and his date is on this record under his name.\n\n" +
      "BUT STYLE IS NOT A DATING METHOD FOR CONSTRUCTION, and saying so is not a dismissal of Naville. Masonry style can be revived, imitated, or used for a particular purpose — and a funerary monument meant to evoke the primordial mound is exactly the kind of building where an archaic manner would be chosen deliberately. An argument from style is an argument about resemblance; to become an argument about date it needs something that excludes deliberate archaism, and that is what it does not have.\n\n" +
      "STRABO, WRITING IN THE FIRST CENTURY BCE, attributed the monument at Abydos to Ismandes or Mandes, usually read as Amenemhet III — the king associated with the labyrinth at Hawara, which Strabo found similar in its subterranean, water-related design. That is a third named attribution, and it is evidence about what was believed in antiquity rather than about when the stone was cut.\n\n" +
      "THREE ATTRIBUTIONS, THREE KINDS OF EVIDENCE: an inscription, an argument from architecture, and a classical report. They are on the record together because they are not the same kind of thing, and a reader who can tell them apart here can tell them apart anywhere.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "A genuine attribution dispute among specialists, about a structure nobody doubts was built by Egyptians. Style, inscription and classical testimony are three different kinds of evidence and are recorded separately.",
    tags: ["osireion", "abydos", "egypt", "seti-i", "naville", "masonry-style", "ancient-sites"],
    people: ["Seti I", "Édouard Naville", "Margaret Murray", "Flinders Petrie", "Strabo"],
    civilisations: ["Ancient Egypt"],
    locationName: "Abydos, Egypt",
    lat: 26.1847,
    lng: 31.9194,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Osireion_at_Abydos.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Osireion_at_Abydos.jpg?width=1024",
        shows: "site",
        caption:
          "The Osireion at Abydos, built at a lower level than the temple of Seti I beside it. That difference in " +
          "level is the observation behind the claim that it is far older; the excavated evidence attributes it to " +
          "Seti's reign. Both readings are looking at this.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "wikipedia_osireion",
        startYear: -1289,
        endYear: -1278,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "the reign of Seti I, about 1290 to 1279 BCE, from his cartouche on the entrance passage",
        datingMethod: "historical_record",
        chronology: "archaeological",
        whatIsDated: "The entrance passage, by the cartouche cut into it",
        evidence:
          "WHAT IS DATED: the approach corridor, which carries a cartouche of Seti I. DATING METHOD: an " +
          "inscription, read against the regnal chronology. WHAT IT ESTABLISHES: that Seti I's name was cut into " +
          "the entrance, and so that he had a hand in the monument. WHAT IT DOES NOT ESTABLISH, AND THE RECORD " +
          "SAYS SO: the interior. None of the main interior blocks is inscribed, so extending this date inwards " +
          "rests on the corridor and the hall being one build — likely, and not shown by the cartouche.",
        notes:
          "Stored in astronomical year numbering: 1290 BCE is −1289. The precision is recorded as the regnal " +
          "bracket and marked approximate, because Egyptian regnal dates of this period are themselves a " +
          "reconstruction.\n\n" +
          "WHAT IS DATED HERE IS A PASSAGE AND NOT A BUILDING, and the heading says so. That distinction is the " +
          "whole of the argument at this site.",
        citations: [
          { sourceKey: "strabo_geography", relation: "disputes", note: "A different builder, named in antiquity." },
        ],
      },
      {
        sourceKey: "wikipedia_osireion",
        startYear: -2579,
        endYear: -2564,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Naville's 4th-Dynasty suggestion, about 2580 to 2565 BCE, from the cyclopean masonry",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        whatIsDated: "The masonry style of the interior, and the date Naville inferred from it",
        evidence:
          "WHAT IS DATED: nothing directly. The date is inferred from architecture — megalithic granite piers and " +
          "cyclopean masonry resembling Old Kingdom work such as the Sphinx temple. DATING METHOD: stylistic " +
          "comparison, which is why it is recorded under that method rather than as a measurement. WHAT IT " +
          "ESTABLISHES: that a professional Egyptologist found the masonry unlike the 19th Dynasty and like the " +
          "4th, and published that. WHAT IT DOES NOT ESTABLISH: a construction date. Style can be revived or " +
          "imitated, and a monument built to evoke the primordial mound is precisely where an archaic manner " +
          "would be chosen on purpose.",
        notes:
          "NAVILLE WAS A SPECIALIST AND IS NOT ON THIS RECORD AS AN OUTSIDER. His argument is recorded as the kind " +
          "of argument it is. The limitation belongs to arguments from style generally and not to him, and it " +
          "would apply in exactly the same way to a stylistic argument reaching the answer this timeline's other " +
          "sources prefer.",
      },
      {
        sourceKey: "strabo_geography",
        startYear: -1799,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Strabo's attribution to Ismandes, usually read as Amenemhet III of the 12th Dynasty",
        datingMethod: "source_assertion",
        chronology: "historical",
        whatIsDated: "What a first-century BCE geographer was told about who built it",
        evidence:
          "WHAT IS DATED: an attribution, not a structure. DATING METHOD: the assertion of a classical source. " +
          "WHAT IT ESTABLISHES: that by Strabo's time the monument at Abydos was credited to Ismandes or Mandes, " +
          "read as Amenemhet III, and was seen as akin to the labyrinth at Hawara in its subterranean, " +
          "water-related design. WHAT IT DOES NOT ESTABLISH: when the stone was cut. Strabo was writing well over " +
          "a millennium after any of the proposed dates and was reporting what he was told.",
        notes:
          "Stored at the middle of the 12th Dynasty as a century-level placeholder for the attributed reign. NEEDS " +
          "SOURCE VERIFICATION for Amenemhet III's regnal years, which were not traced for this entry — so the " +
          "claim is deliberately coarse rather than precise about a figure it cannot support.",
      },
    ],
  },

  // =========================================================================
  // GIZA — three uses of precession, and mortar that is messier than either
  // side of the popular argument admits.
  // =========================================================================
  {
    slug: "giza-pyramids-dated",
    title: "The Giza pyramids are dated",
    summary:
      "Three ways of dating the same stones: two circumpolar stars drifting, charcoal in the mortar, and Orion's belt run backwards to 10,500 BCE. Only one of those is a date for a building.",
    description:
      "The three great pyramids at Giza are assigned to the 4th Dynasty, in the region of 2600 to 2500 BCE, on the regnal chronology. What makes them worth a record on a timeline about disputed dates is that three quite different methods have been brought to bear on them, and the differences between the methods matter more than the differences between the answers.\n\n" +
      "ONE: TWO STARS DRIFTING. Kate Spence argued in Nature in 2000 that Old Kingdom pyramids were oriented to north using the simultaneous transit of Kochab and Mizar — wait until the line joining them is vertical on a plumb line, and you are facing north. Because precession moves that line off true north, the method only works for a short period, and modelling the drift dates the start of the Great Pyramid to about 2470 BCE to within a few years. THIS IS AN ASTRONOMICAL ALIGNMENT USED AS A GENUINE DATING METHOD, and it is worth studying for that reason. Other specialists published against it the following year, questioning the method and the precision claimed.\n\n" +
      "TWO: CHARCOAL IN THE MORTAR, AND IT IS NOT TIDY. The Pyramids Radiocarbon Dating Projects of 1984 and 1995 dated charcoal inclusions in pyramid mortar — the most direct evidence available, because mortar was mixed on site. The results run roughly 50 to 300 calendar years OLDER than the historical estimates, and the Great Pyramid's 1995 dates scatter over about four hundred years. The usual explanation is old wood: charcoal from timber that was already old, or reused, when it went into the mix. THAT COMPLICATION BELONGS ON THE RECORD. A reader told that radiocarbon simply confirms the textbook date is being handed something tidier than the evidence, and a reader told that the scatter overturns the chronology is being handed the opposite error.\n\n" +
      "THREE: ORION'S BELT, AND WHAT BAUVAL ACTUALLY CLAIMED. Robert Bauval published in Discussions in Egyptology in 1989 that the layout of the three pyramids mirrors the three stars of Orion's belt. Running precession backwards, there is a moment when the belt stood in relation to the Milky Way as the pyramids stand in relation to the Nile, and that moment is around 10,500 BCE.\n\n" +
      "THAT IS A DATE FOR A SKY. It becomes a date for stone only by a further step — that the builders were marking that epoch, or that something was built in it — and the two are not the same claim. Bauval's own published argument concerns a ground plan referencing a precessional moment, and reporting it as 'Bauval says the pyramids are twelve thousand years old' misstates it. Whether any stone at Giza was cut in 10,500 BCE is a separate question, and NEEDS SOURCE VERIFICATION for what Bauval concluded about it: his later books with Adrian Gilbert and Graham Hancock go further than the 1989 paper, and this entry has not traced how far.\n\n" +
      "THE CRITICAL DISTINCTION, ONCE MORE, BECAUSE IT IS THE ONE PEOPLE SLIP ON MOST: an astronomical alignment date is not a construction date. Spence's is, because she dated the ACT of orienting, which the builders performed. The Orion correlation dates a configuration of stars. Posnansky's Tiwanaku calculation, elsewhere in this dataset, dates nothing, because it runs a solstice azimuth backwards at the rate a star's rising moves. Three uses of precession, three different standings, and the physics is the same in all three.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "The 4th-Dynasty attribution is not in dispute among Egyptologists. What this record is for is the comparison of methods — including a mainstream dating argument that other specialists disputed in print.",
    tags: ["giza", "egypt", "pyramids", "precession", "bauval", "spence", "orion", "ancient-sites"],
    people: ["Khufu", "Kate Spence", "Robert Bauval", "Mark Lehner"],
    civilisations: ["Ancient Egypt"],
    locationName: "Giza, Egypt",
    lat: 29.9792,
    lng: 31.1342,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Great_Pyramid_of_Giza_-_Pyramid_of_Khufu.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Great_Pyramid_of_Giza_-_Pyramid_of_Khufu.jpg?width=1024",
        shows: "site",
        caption:
          "The Great Pyramid. The dating on this record does not come from the pyramid's shape or its alignment but " +
          "from organic material in its mortar and from the workers' settlement beside it — things that can be " +
          "carbon-dated.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "spence2000",
        startYear: -2469,
        datePrecision: "year",
        isApproximate: true,
        uncertaintyPlus: 5,
        uncertaintyMinus: 5,
        originalDateText: "about 2470 BCE for the start of the Great Pyramid, within a few years, from the simultaneous transit of Kochab and Mizar",
        datingMethod: "astronomical",
        chronology: "scientific",
        whatIsDated: "The act of orienting the Great Pyramid to north",
        evidence:
          "WHAT IS DATED: the moment the builders set the orientation. DATING METHOD: astronomical — the " +
          "simultaneous transit of two circumpolar stars, whose alignment with true north precession carries away, " +
          "so that the method only works within a short window. WHAT IT ESTABLISHES: a date for an act the " +
          "builders performed on site, which is why this is a construction date and not merely a sky date. WHAT IT " +
          "DOES NOT ESTABLISH: itself beyond argument — other specialists published against the method and the " +
          "precision in Nature the following year, and that dispute is part of the record rather than a footnote " +
          "to it.",
        notes:
          "The ± 5 years is stored as a tolerance on one determination, not as a span.\n\n" +
          "THIS IS THE BEST EXAMPLE IN THE DATASET OF AN ALIGNMENT DOING REAL DATING WORK, and the reason it works " +
          "is worth stating: what is dated is an action, performed by people, using the sky. Compare the Orion " +
          "claim below, which dates a configuration of stars, and Posnansky at Tiwanaku, which dates nothing.",
        citations: [
          {
            sourceKey: "nature_orientation_reply",
            relation: "disputes",
            note: "The published response questioning the method and its precision.",
          },
        ],
      },
      {
        sourceKey: "bonani2001",
        startYear: -2859,
        endYear: -2609,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "charcoal in the mortar dating roughly 50 to 300 years older than the historical estimates, scattering over some 400 years for the Great Pyramid",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "Charcoal inclusions in the mortar of the pyramids",
        evidence:
          "WHAT IS DATED: charcoal caught in mortar that was mixed on site. DATING METHOD: radiocarbon, from the " +
          "projects of 1984 and 1995. WHAT IT ESTABLISHES: that organic material in the fabric is of broadly the " +
          "right era, by the most direct route available at Giza. WHAT IT DOES NOT ESTABLISH: a close date, and " +
          "the reason is in the numbers — the results sit 50 to 300 years older than the historical estimates and " +
          "scatter over about four centuries for the Great Pyramid. The usual account is old wood: charcoal from " +
          "timber already old, or reused, when it entered the mix, which dates the tree rather than the building.",
        notes:
          "THE SCATTER IS ON THE RECORD ON PURPOSE. 'Radiocarbon confirms the textbook date' is tidier than the " +
          "evidence; 'radiocarbon contradicts the chronology' is the same mistake pointed the other way. What the " +
          "mortar dates is the charcoal in it, and the step to the building is an argument about where the " +
          "charcoal came from.\n\n" +
          "Stored as the offset range implied by the reported figures rather than as a list of calibrated dates. " +
          "NEEDS SOURCE VERIFICATION for the individual determinations, which were not traced for this entry.",
      },
      {
        sourceKey: "bauval1989",
        startYear: -10499,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "about 10,500 BCE — the precessional moment when Orion's belt stood to the Milky Way as the pyramids stand to the Nile",
        datingMethod: "astronomical",
        chronology: "alternative",
        whatIsDated: "A configuration of stars, which the ground plan is said to reference",
        evidence:
          "WHAT IS DATED: the sky. DATING METHOD: precession, run backwards until the belt's relation to the Milky " +
          "Way matches the pyramids' relation to the Nile. WHAT IT ESTABLISHES: when that configuration occurred, " +
          "which is an astronomical calculation and is not in doubt as arithmetic. WHAT IT DOES NOT ESTABLISH, AND " +
          "THIS IS THE RECORD: that anything was built then. Getting from a sky date to a stone date needs a " +
          "further argument — that the builders were marking the epoch, or that there was something there to mark " +
          "it with — and that argument is separate and is not supplied by the calculation.",
        notes:
          "WHAT BAUVAL PUBLISHED IS NARROWER THAN THE VERSION IN CIRCULATION. The 1989 paper argues a ground plan " +
          "reflecting the belt; the 10,500 BCE epoch is the precessional moment that plan is said to point at. " +
          "'Bauval says the pyramids are twelve thousand years old' is not what the paper says, and this record " +
          "does not put it in his mouth.\n\n" +
          "NEEDS SOURCE VERIFICATION for how far his later books with Gilbert and Hancock take the claim about the " +
          "monuments themselves. That was not traced for this entry, so it is not asserted either way.",
        citations: [
          {
            sourceKey: "bauval_gilbert1994",
            relation: "supports",
            note: "Where the 10,500 BCE epoch is developed for a general readership.",
          },
        ],
      },
      {
        sourceKey: "bonani2001",
        startYear: -2599,
        endYear: -2499,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the 4th Dynasty, about 2600 to 2500 BCE, on the regnal chronology",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        whatIsDated: "The reigns the pyramids are assigned to",
        evidence:
          "WHAT IS DATED: the dynastic sequence the monuments are placed in. DATING METHOD: the regnal chronology, " +
          "built from king lists, inscriptions and synchronisms. WHAT IT ESTABLISHES: the accepted framework, " +
          "which the radiocarbon and the alignment work are both read against. WHAT IT DOES NOT ESTABLISH: itself " +
          "independently of that other evidence. A regnal chronology is a reconstruction, which is why it is " +
          "stored as a century-level bracket here rather than as a year for a particular king.",
        notes:
          "On the record explicitly, rather than assumed as the background everything else is measured from. A " +
          "timeline that shows only the contested figures and leaves the accepted one implicit makes the accepted " +
          "one look like the absence of a claim, and it is a claim with sources and a method like any other.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_WORKED_STONE_LINKS: SeedEventLink[] = [
  {
    from: ANCIENT_SITES_WORKED_STONE_ANCHOR_SLUG,
    to: "osireion-abydos",
    relation: "relevant",
    note:
      "Two sites where the stone is plainly worked and the argument is about who worked it. At Baalbek the answer " +
      "is in the quarry; at Abydos it is in a cartouche on a corridor and in the absence of any inscription inside.",
  },
  {
    from: "giza-pyramids-dated",
    to: "osireion-abydos",
    relation: "relevant",
    note:
      "The Egyptian pair. Naville read the Osireion's masonry as Old Kingdom by its resemblance to work like the " +
      "Sphinx temple, which makes the two records an argument about whether architectural resemblance can date a " +
      "building.",
  },
  {
    from: "giza-pyramids-dated",
    to: ANCIENT_SITES_WORKED_STONE_ANCHOR_SLUG,
    relation: "relevant",
    note:
      "The two sites most often offered as beyond the means of the people credited with them — and at both, the " +
      "evidence that settles it is ordinary: mortar you can date, and a quarry with the abandoned blocks still in it.",
  },
];
