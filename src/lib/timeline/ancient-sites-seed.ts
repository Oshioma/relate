import type { SeedEvent, SeedSource, SeedTrack, SeedEventLink } from "./seed-types";

// =============================================================================
// ANCIENT SITES — WHERE THE PROPOSED DATES DISAGREE
//
// Sites, structures and finds for which somebody has proposed a date
// substantially different from the mainstream archaeological one.
//
// THE RULE THIS DATASET EXISTS TO ENFORCE: A SITE IS NOT A DATE.
//
// A site can carry a mainstream archaeological chronology, a radiocarbon
// measurement on one particular sample, the geological age of the rock it
// stands on or was cut from, an astronomical alignment, a claimed construction
// date, a claimed occupation date, a later rebuilding, and a traditional date —
// all at once, all different, and all true statements about DIFFERENT THINGS.
// Every one of those is a separate claim here, and every claim says what it is
// a date FOR in its own `whatIsDated`. The record's detail view groups the
// claims by that field as soon as there is more than one distinct value, so a
// reader sees the question each date answers before they see the number.
//
// THE FOUR CONFUSIONS THIS FILE IS BUILT TO PREVENT, stated once:
//
//   the age of the surrounding rock  ≠  the age of an object found in it
//   an astronomical alignment date   ≠  a construction date
//   the earliest occupation          ≠  the building of the visible monument
//   the date material was deposited  ≠  the date a structure was built
//
// Each of these is a real move that has been made in print about one of the
// records below, and each time it is made the caption or the evidence block
// says so in as many words.
//
// OLD IS NOT THE SAME AS ALTERNATIVE, which is the reason Göbekli Tepe is in
// this dataset at all. Its enclosures are some eleven and a half thousand years
// old on ordinary excavated radiocarbon evidence, which is far older than
// several of the alternative claims here, and none of that makes it a disputed
// site. A date is not alternative because it is surprising; it is alternative
// because of where the reasoning behind it sits. Reading Göbekli Tepe next to
// the Sphinx is the fastest way to see the difference.
//
// NO CONFIDENCE SCORES. Nothing here is ranked, scored or badged. A claim is
// shown with who made it, what they measured, what the measurement establishes,
// what it does not establish, and who disagrees — and the reader weighs it.
// A number out of ten would do that weighing for them, badly.
//
// WHAT IS DELIBERATELY NOT HERE, YET: this is the first tranche of a much
// larger brief — thirty named sites plus a research expansion. Five are seeded
// here because each source was traced to the person who actually proposed the
// date, and that tracing is the slow part. The rest follow in their own files
// rather than as unverified rows in this one.
// =============================================================================

export const ANCIENT_SITES_ANCHOR_SLUG = "gobekli-tepe-enclosures";

export const ANCIENT_SITES_TRACK: SeedTrack = {
  name: "Ancient sites: where the proposed dates disagree",
  slug: "ancient-sites-disputed-dates",
  kind: "theme",
  color: "#8c6a4f",
};

// ---------------------------------------------------------------------------
// Sources
//
// For an alternative claim the claimant's OWN publication is the source, not a
// website describing what they are supposed to believe. Where a date is quoted
// from a summary and the original could not be traced, it is not seeded.
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_SOURCES: SeedSource[] = [
  // --- Göbekli Tepe ---------------------------------------------------------
  {
    key: "dietrich2013",
    title: "Establishing a radiocarbon sequence for Göbekli Tepe: state of research and new data",
    author: "Oliver Dietrich, Çiğdem Köksal-Schmidt, Jens Notroff and Klaus Schmidt",
    workTitle: "Neo-Lithics",
    reference: "Neo-Lithics 1/13, pages 36–41",
    sourceType: "academic_paper",
    publishedYear: 2013,
    notes:
      "The excavators' own account of what has been dated at Göbekli Tepe and how. Cited here for the Layer III " +
      "sequence and for the point the alternative claims elsewhere in this dataset most often skip: which sample " +
      "came from where, and what each one can carry.",
  },
  {
    key: "dietrich_plaster",
    title: "A radiocarbon date from the wall plaster of Enclosure D of Göbekli Tepe",
    author: "Oliver Dietrich and Klaus Schmidt",
    workTitle: "Neo-Lithics",
    sourceType: "academic_paper",
    notes:
      "The sample KIA-44149, taken from wall plaster rather than from fill. Cited because it is the rare case where " +
      "the dated material is part of the structure itself, which is exactly what most of the disputed dates in this " +
      "dataset lack.",
  },
  {
    key: "wikipedia_gobekli",
    title: "Göbekli Tepe — Wikipedia",
    url: "https://en.wikipedia.org/wiki/G%C3%B6bekli_Tepe",
    sourceType: "wikipedia",
    notes: "An overview and a route to the excavation literature. A starting point, not a citation for a date.",
  },

  // --- Gunung Padang --------------------------------------------------------
  {
    key: "natawidjaja2023",
    title: "Geo-archaeological prospecting of Gunung Padang buried prehistoric pyramid in West Java, Indonesia",
    author: "Danny Hilman Natawidjaja and colleagues",
    workTitle: "Archaeological Prospection",
    reference: "Published 20 October 2023; doi:10.1002/arp.1912. RETRACTED March 2024.",
    url: "https://onlinelibrary.wiley.com/doi/10.1002/arp.1912",
    sourceType: "academic_paper",
    publishedYear: 2023,
    notes:
      "The paper that proposed construction phases at Gunung Padang running back some 27,000 years, on ground-" +
      "penetrating radar, resistivity, seismic tomography, drilling and radiocarbon. It is cited here as the origin " +
      "of the claim and read alongside its own retraction, which is below.",
  },
  {
    key: "arp_retraction",
    title: "Retraction: Geo-archaeological prospecting of Gunung Padang buried prehistoric pyramid in West Java, Indonesia",
    workTitle: "Archaeological Prospection",
    reference: "doi:10.1002/arp.1932",
    url: "https://onlinelibrary.wiley.com/doi/10.1002/arp.1932",
    sourceType: "academic_paper",
    publishedYear: 2024,
    notes:
      "The retraction notice. It states the ground: the radiocarbon dates came from soil samples that were not " +
      "associated with any artefacts, so they cannot be reliably interpreted as dating human occupation. That is a " +
      "statement about what the measurement establishes — not a statement that the soil is not that old.",
    citedBy: "natawidjaja2023",
  },
  {
    key: "archaeology_gunung_padang",
    title: "Java's Megalithic Mountain",
    workTitle: "Archaeology",
    reference: "Archaeology Magazine, July/August 2024",
    url: "https://archaeology.org/issues/july-august-2024/features/javas-megalithic-mountain/",
    sourceType: "newspaper",
    publishedYear: 2024,
    notes:
      "Reporting that carries the position of Lutfi Yondri of Universitas Padjadjaran, who has excavated at Gunung " +
      "Padang across three decades and places the earliest megalithic structures at around two thousand years old. " +
      "Cited as journalism reporting an excavator's position, which is not the same as citing his own publication.",
  },

  // --- The Great Sphinx -----------------------------------------------------
  {
    key: "hawass_mountain",
    title: "Mountain of the Pharaohs: The Untold Story of the Pyramid Builders",
    author: "Zahi Hawass",
    sourceType: "book",
    publishedYear: 2006,
    notes:
      "Cited for the mainstream attribution in its own words: that the Sphinx represents Khafre and forms an " +
      "integral part of his pyramid complex, and that most scholars hold this.",
  },
  {
    key: "schoch_gsa1991",
    title: "Redating the Great Sphinx of Giza",
    author: "Robert M. Schoch",
    reference:
      "Presented at the Geological Society of America annual meeting, October 1991, on an abstract accepted after review",
    url: "http://www.robertschoch.net/Redating%20the%20Great%20Sphinx%20of%20Giza.htm",
    sourceType: "academic_paper",
    publishedYear: 1991,
    notes:
      "Schoch's own statement of the weathering argument, and the right source for his date rather than a summary " +
      "of it. He is a geologist, and the claim he makes is a geological one about what produced the erosion — not " +
      "an archaeological one about who carved the monument.",
  },
  {
    key: "schoch_voices",
    title: "Voices of the Rocks: A Scientist Looks at Catastrophes and Ancient Civilizations",
    author: "Robert M. Schoch",
    publisher: "Harmony Books",
    sourceType: "book",
    publishedYear: 1999,
    notes:
      "Schoch's book-length statement of the case. Cited for his own framing of the 7000–5000 BCE range and of what " +
      "part of the monument he is dating.",
  },
  {
    key: "hancock_bauval_sphinx",
    title: "The Message of the Sphinx: A Quest for the Hidden Legacy of Mankind",
    author: "Graham Hancock and Robert Bauval",
    publisher: "Crown",
    sourceType: "book",
    publishedYear: 1996,
    notes:
      "The claimants' own book, cited rather than any site describing it. It is the source for the 10,500 BCE " +
      "correlation and for the fact that they present it as a construction date and not only as a sky date — which " +
      "is a distinction worth checking in the original before repeating it either way.",
  },
  {
    key: "wikipedia_sphinx",
    title: "Great Sphinx of Giza — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Great_Sphinx_of_Giza",
    sourceType: "wikipedia",
    notes: "Overview, and a route to both the Egyptological literature and the history of the redating argument.",
  },

  // --- Cerutti Mastodon -----------------------------------------------------
  {
    key: "holen2017",
    title: "A 130,000-year-old archaeological site in southern California, USA",
    author: "Steven R. Holen and colleagues",
    workTitle: "Nature",
    reference: "Nature, April 2017",
    sourceType: "academic_paper",
    publishedYear: 2017,
    notes:
      "The paper itself. This is a peer-reviewed claim in a major journal, which is why it is filed as a disputed " +
      "scientific claim and not as alternative archaeology — the disagreement about it is a disagreement between " +
      "archaeologists about evidence, conducted in the journals.",
  },
  {
    key: "braje2017",
    title: "Were hominins in California ~130,000 years ago?",
    author:
      "Todd J. Braje, Tom D. Dillehay, Jon M. Erlandson, Scott M. Fitzpatrick, Donald K. Grayson, " +
      "Vance T. Holliday, Robert L. Kelly, Richard G. Klein, David J. Meltzer and Torben C. Rick",
    workTitle: "PaleoAmerica",
    reference: "PaleoAmerica 3(3), pages 200–202",
    sourceType: "academic_paper",
    publishedYear: 2017,
    notes:
      "The published objection, by ten specialists in the peopling of the Americas. Their case is that the site is " +
      "better explained without hominins: the comparison sites, the absence of the features human activity usually " +
      "leaves, and the possibility that recent disturbance produced the breakage.",
  },

  // --- Klerksdorp / Ottosdal objects ---------------------------------------
  {
    key: "heinrich_ottosdal",
    title: "The mysterious “spheres” of Ottosdal, South Africa",
    author: "Paul V. Heinrich",
    publisher: "National Center for Science Education",
    url: "https://ncse.ngo/mysterious-spheres-ottosdal-south-africa",
    sourceType: "modern_interpretation",
    notes:
      "A geologist's examination of the objects themselves — petrography and X-ray diffraction, finding hematite in " +
      "one and wollastonite with hematite and goethite in another. Cited for what the objects are made of and for " +
      "the concretion account of how they formed.",
  },
  {
    key: "wikipedia_klerksdorp",
    title: "Klerksdorp sphere — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Klerksdorp_sphere",
    sourceType: "wikipedia",
    notes:
      "Overview, and the route to the small conventional literature on these objects — Nel and others (1937), " +
      "Cairncross (1988), Heinrich. Useful here mainly for establishing how little of that literature there is.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_EVENTS: SeedEvent[] = [
  // =========================================================================
  // THE CONTROL. Very old, entirely mainstream.
  // =========================================================================
  {
    slug: ANCIENT_SITES_ANCHOR_SLUG,
    title: "The Göbekli Tepe enclosures",
    summary:
      "Eleven and a half thousand years old on ordinary excavated evidence — older than most of the alternative claims in this dataset, and disputed by nobody.",
    description:
      "Circular and oval enclosures of T-shaped limestone pillars, built on a hilltop in southeastern Türkiye by people who had not yet taken up farming.\n\n" +
      "THIS RECORD IS A CONTROL, AND THAT IS WHY IT IS IN A DATASET ABOUT DISPUTED DATES. Göbekli Tepe is roughly eleven and a half thousand years old. That is older than Schoch's Sphinx, older than Posnansky's Tiwanaku, and about as old as the astronomical correlation proposed for Giza. It is also not contested by anybody: the excavators published the radiocarbon sequence, the samples came from the structures and their fills, and the archaeological community accepted the result.\n\n" +
      "So a date is not an alternative claim because it is old. It is an alternative claim because of where the reasoning behind it sits — what was measured, whether the measured thing bears on the question, and whether the inference from one to the other survives inspection. Reading this record beside the Great Sphinx is the shortest route to seeing the difference, and it is the reason the two are in the same dataset.\n\n" +
      "THE ENCLOSURES ARE NOT ALL ONE AGE. The excavators say plainly that the Layer III enclosures were not contemporaneous. A single figure for 'Göbekli Tepe' is already a simplification of a site with a sequence, which is the same mistake this dataset objects to elsewhere — made here in the direction of the mainstream.",
    category: "archaeology",
    subcategory: "Pre-Pottery Neolithic",
    eventType: "mainstream",
    eventTypeNote:
      "Mainstream archaeology, on excavated radiocarbon evidence published by the excavators. Included in a dataset about disputed dates precisely because it is not disputed.",
    tags: ["gobekli-tepe", "neolithic", "turkiye", "radiocarbon", "control-example", "ancient-sites"],
    people: ["Klaus Schmidt", "Oliver Dietrich", "Jens Notroff"],
    civilisations: ["Pre-Pottery Neolithic Anatolia"],
    locationName: "Göbekli Tepe, Şanlıurfa Province, Türkiye",
    lat: 37.2233,
    lng: 38.9222,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/G%C3%B6beklitepe_Building_D_5323.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/G%C3%B6beklitepe_Building_D_5323.jpg?width=1024",
        shows: "site",
        caption:
          "The two central T-shaped pillars of Enclosure D, carrying low-relief arms and hands, belts and fox- " +
          "pelt loincloths. These are the structures the radiocarbon sequence dates, and the wall plaster sample " +
          "came from this enclosure. They were standing some eleven and a half thousand years ago, before " +
          "farming, and nobody disputes it.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "dietrich2013",
        startYear: -9599,
        endYear: -8799,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "9600–8800 cal BC",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        whatIsDated: "The Layer III enclosures, as a group",
        evidence:
          "WHAT IS DATED: organic material from the Layer III enclosures and their fills, excavated in context. " +
          "DATING METHOD: radiocarbon, calibrated. WHAT THE MEASUREMENT ESTABLISHES: the span over which the " +
          "Pre-Pottery Neolithic A complexes of Layer III were built and in use. WHAT IT DOES NOT ESTABLISH: that " +
          "any one enclosure stood for the whole of it — the excavators state that the Layer III enclosures were " +
          "NOT contemporaneous, so this is the envelope of a sequence and not the age of a single building.",
        notes:
          "Quoted as a calibrated calendar range, which is what the excavators publish. The astronomical year " +
          "numbering used by this timeline puts 9600 BCE at −9599.",
      },
      {
        sourceKey: "dietrich_plaster",
        startYear: -9674,
        endYear: -9313,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "9984 ± 42 14C BP — calibrated 9675–9314 cal BC at 93.9%",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        whatIsDated: "Wall plaster in Enclosure D — part of the structure itself",
        evidence:
          "WHAT IS DATED: sample KIA-44149, taken from the WALL PLASTER of Enclosure D. DATING METHOD: radiocarbon. " +
          "WHAT THE MEASUREMENT ESTABLISHES: an age for material that is physically part of the enclosure, so the " +
          "step from 'this sample is old' to 'this building is old' is a short one. THIS IS THE THING MOST OF THE " +
          "DISPUTED DATES IN THIS DATASET DO NOT HAVE. At Gunung Padang the dated soil was not associated with " +
          "anything built; at the Cerutti site the dated bone is not a structure at all. Here the carbon was in " +
          "the wall. WHAT IT DOES NOT ESTABLISH: that Enclosure D was built at this moment and not repaired or " +
          "replastered later — plaster is a surface, and a surface can be renewed on a wall already standing. Nor " +
          "does one sample date the other enclosures, which the excavators say are not contemporaneous with it.",
        uncertaintyPlus: 42,
        uncertaintyMinus: 42,
        notes:
          "The uncertainty given is the ± on the radiocarbon measurement in years BP, which is a tolerance on one " +
          "measurement — not the same thing as the calibrated range, which is wider and asymmetric because " +
          "calibration is not linear.",
        citations: [
          { sourceKey: "dietrich2013", relation: "context", note: "The wider sequence this single sample sits inside." },
        ],
      },
    ],
  },

  // =========================================================================
  // THE RETRACTION. What was dated, versus what was inferred from it.
  // =========================================================================
  {
    slug: "gunung-padang-dating",
    title: "Gunung Padang, and what the radiocarbon actually dated",
    summary:
      "A terraced hill in West Java, a paper proposing construction 27,000 years ago, and a retraction that turned on what the dated material was sitting next to.",
    description:
      "Gunung Padang is a hill in West Java carried in terraces of columnar basalt — the largest and best known of the Indonesian stepped sites called punden berundak.\n\n" +
      "TWO COMPLETELY DIFFERENT PROPOSITIONS ARE ON THIS RECORD, and they are not rival answers to one question. One is about the megalithic structures you can see and walk on. The other is about layers metres beneath them, and whether those layers are built at all.\n\n" +
      "WHAT HAPPENED WITH THE PAPER. In October 2023 Archaeological Prospection published work by Danny Hilman Natawidjaja and colleagues proposing that the hill conceals a construction sequence running back some 27,000 years. The survey work behind it was substantial: ground-penetrating radar, electrical resistivity tomography, seismic tomography, trenching, core drilling and radiocarbon dating. In March 2024 the journal retracted it.\n\n" +
      "WHAT THE RETRACTION ACTUALLY SAYS, because this matters and is usually reported as though the dates were found to be wrong. The radiocarbon dates came from SOIL SAMPLES THAT WERE NOT ASSOCIATED WITH ANY ARTEFACTS. The soil really is that old. What does not follow is that anybody built anything in it. The gap between 'this sediment is 27,000 years old' and 'this structure is 27,000 years old' is the whole of the disagreement, and no amount of precision in the first statement closes it.\n\n" +
      "THIS IS THE CLEAREST CASE IN THE DATASET of the distinction the whole dataset is built around: the date material was deposited is not the date a structure was built. It is also a case where the mainstream position is not 'the site is unremarkable' — the surface megaliths are real, substantial and genuinely ancient by the standards of the region.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "The dispute is not about the measurements. It is about what the measured material can be made to say, which is why both positions are on the record with their reasoning visible.",
    tags: ["gunung-padang", "indonesia", "java", "radiocarbon", "retraction", "megalithic", "ancient-sites"],
    people: ["Danny Hilman Natawidjaja", "Lutfi Yondri"],
    locationName: "Gunung Padang, Cianjur Regency, West Java, Indonesia",
    lat: -6.9944,
    lng: 107.0564,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Situs_Megalitikum_Gunung_Padang_Cianjur.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Situs_Megalitikum_Gunung_Padang_Cianjur.jpg?width=1024",
        shows: "site",
        caption:
          "The columnar basalt terraces at Gunung Padang. THIS IS THE PART NOBODY DISPUTES \u2014 the surface " +
          "megaliths, dated by excavated charcoal to around two thousand years ago. The construction argued back " +
          "to 27,000 years is metres beneath what is visible here, and whether those layers are built at all is " +
          "the question.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "archaeology_gunung_padang",
        startYear: -199,
        endYear: 100,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "around two thousand years old — the earliest megalithic structures",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        whatIsDated: "The visible megalithic terraces on the surface",
        evidence:
          "WHAT IS DATED: charcoal from construction contexts associated with the surface megalithic structures. " +
          "DATING METHOD: radiocarbon, with stratigraphy. WHAT IT ESTABLISHES: a construction date for the terraces " +
          "in the range of the second century BCE to the first century CE, consistent with the wider punden berundak " +
          "tradition in West Java. WHO PROPOSES IT: Lutfi Yondri of Universitas Padjadjaran, who has excavated here " +
          "WHAT IT DOES NOT ESTABLISH: anything about the layers beneath them. This claim and the one below " +
          "are not rival answers about one structure \u2014 they are about different depths, and both could be " +
          "right. across three decades. LIMITATION OF THIS ENTRY: it is taken from journalism reporting his position rather " +
          "than from his own publication. NEEDS SOURCE VERIFICATION — the date, against his excavation reports.",
        notes:
          "Recorded as a range because the reported dates cluster rather than converge. The record does not claim " +
          "this is every structure on the hill: a site with terraces has a sequence.",
      },
      {
        sourceKey: "natawidjaja2023",
        startYear: -24999,
        endYear: -9999,
        datePrecision: "millennium",
        isApproximate: true,
        originalDateText: "construction phases proposed to extend back some 27,000 years",
        datingMethod: "claimant_inference",
        chronology: "alternative",
        whatIsDated: "Buried layers beneath the terraces, interpreted as built",
        evidence:
          "WHAT WAS DATED: soil from cores and trenches beneath the surface structures. DATING METHOD: radiocarbon " +
          "on that soil — so the MEASUREMENT is radiocarbon, but the DATE ON THIS CLAIM is an inference from it, " +
          "which is why the method here is recorded as the claimant's inference. WHAT THE MEASUREMENT ESTABLISHES: " +
          "the age of the sediment. WHAT IT DOES NOT ESTABLISH: that anybody built anything in it, or that the " +
          "layers are constructed at all — the soil really is that old, and that is not the part in question. " +
          "WHAT THE AUTHORS INFERRED: that the buried layers are constructed, and therefore " +
          "that the soil dates the construction. WHY CRITICS DISPUTED IT: the dated soil was not associated with " +
          "artefacts, occupation surfaces, or anything else marking human activity, so nothing ties the age of the " +
          "sediment to anybody building in it. WHAT FOLLOWED: the journal retracted the paper in March 2024 after " +
          "concerns from third parties in geophysics, archaeology and radiocarbon dating.",
        notes:
          "The range stored here is deliberately wide and deliberately short of the headline figure. The paper " +
          "proposed several phases rather than one date, popular reporting fixed on 27,000 years, and this timeline " +
          "does not have a single number to give because the source does not give one. The retraction is on the " +
          "claim as a citation rather than as a reason to delete it: a retracted paper is part of the record of how " +
          "a claim was made and tested, and removing it would leave a reader who has heard the 27,000-year figure " +
          "with nowhere to find out what happened to it.",
        citations: [
          {
            sourceKey: "arp_retraction",
            relation: "disputes",
            note:
              "The retraction notice, which states the ground: the radiocarbon dates came from soil not associated " +
              "with any artefacts and so cannot be reliably interpreted as dating human occupation.",
          },
          {
            sourceKey: "archaeology_gunung_padang",
            relation: "context",
            note: "Reporting on the controversy and on the excavated chronology of the surface structures.",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // THE MULTI-CLAIM CASE. Three dates, three kinds of reasoning.
  // =========================================================================
  {
    slug: "great-sphinx-carving",
    title: "The carving of the Great Sphinx",
    summary:
      "Three proposed dates, four and a half thousand years apart at the extremes, each dating a different thing by a different method.",
    description:
      "The Great Sphinx was cut from the living bedrock of the Giza plateau, in a quarried enclosure, with the body and the surrounding walls made of the same limestone beds.\n\n" +
      "WHY THIS RECORD HAS THREE DATES AND NOT ONE. They are not three guesses at the same number. They are answers to three different questions, reached by three different disciplines, and the first thing to establish about any of them is what it is a date FOR:\n\n" +
      "• EGYPTOLOGY dates the monument by its place in a complex — the causeway, the temples, the quarrying, the settlement of the workforce — and attributes it to Khafre in the Fourth Dynasty.\n\n" +
      "• ROBERT SCHOCH, a geologist, dates the WEATHERING. His claim is about what produced the erosion profile in the enclosure, and his answer requires a climate wetter than any since the Old Kingdom. That is a claim about rainfall, from which a date for the cutting follows as an inference.\n\n" +
      "• GRAHAM HANCOCK AND ROBERT BAUVAL date an ASTRONOMICAL CONFIGURATION — the sky of 10,500 BCE, with the lion-bodied monument facing the constellation Leo at the equinox and the Giza pyramids echoing Orion's belt. Whether that is a construction date is exactly the thing worth checking in their own book rather than assuming either way, and the note on their claim says what the book does.\n\n" +
      "A SKY-DATE IS NOT AUTOMATICALLY A CONSTRUCTION-DATE. An alignment can be calculated for any monument and any epoch; the calculation tells you when the sky looked a particular way, not when anybody laid a stone. Where a claimant does take the further step and say the monument was built then, that is a second claim resting on the first, and it needs its own evidence.\n\n" +
      "SCHOCH AND HANCOCK ARE NOT MAKING THE SAME CLAIM, and collapsing them is the commonest error made about this record. Schoch's range is thousands of years later than 10,500 BCE and his argument is geological rather than astronomical. Two people disagreeing with the mainstream are not thereby agreeing with each other.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "Egyptology is not divided about this: the attribution to Khafre is the mainstream position. The record is filed as disputed because named researchers outside that consensus have published competing dates, and this timeline shows them with their reasoning rather than omitting them.",
    tags: ["sphinx", "giza", "egypt", "weathering", "astronomical-alignment", "ancient-sites"],
    people: ["Khafre", "Robert M. Schoch", "Graham Hancock", "Robert Bauval", "Zahi Hawass", "Mark Lehner"],
    civilisations: ["Old Kingdom Egypt"],
    locationName: "Giza plateau, Egypt",
    lat: 29.9753,
    lng: 31.1376,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Giza_Plateau_-_Great_Sphinx_-_side_view.JPG?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Giza_Plateau_-_Great_Sphinx_-_side_view.JPG?width=1024",
        shows: "site",
        caption:
          "The Sphinx from the side, showing the body cut down into the bedrock and the wall of the quarried " +
          "enclosure behind it. THE WEATHERING ARGUMENT IS ABOUT THESE SURFACES: the profile of the core body and " +
          "the enclosure walls \u2014 not the head, and not the later casing blocks that cover much of the body today.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/The_Great_Sphinx,_Pyramids_of_Gizeh-1839)_by_David_Roberts,_RA.jpg?width=1024",
        shows: "later_artwork",
        caption:
          "David Roberts drew this in July 1839, and it is the oldest image on this record. IT SHOWS THE SPHINX " +
          "BURIED TO THE SHOULDERS \u2014 not artistic licence: for most of its recorded history the body has been " +
          "under sand, and it was dug out again and again from antiquity onwards. How much of its life the " +
          "monument spent buried bears on any argument that reasons from how weathered it is, in whichever " +
          "direction.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Maxime_Du_Camp_-_Le_Sphinx,_Egypt_Moyenne_-_Google_Art_Project.jpg?width=1024",
        shows: "site",
        caption:
          "Maxime Du Camp's calotype, from his Egyptian expedition of 1849\u201351 and among the earliest photographs " +
          "of the Sphinx there are. Sand still stands against the body. A photograph made before the twentieth- " +
          "century clearances records a state of the monument no living person has seen \u2014 which is the thing an " +
          "old image can do that a new one cannot.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "hawass_mountain",
        startYear: -2499,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the reign of Khafre, Fourth Dynasty — about 2500 BCE",
        datingMethod: "archaeological",
        chronology: "conventional",
        whatIsDated: "The carving of the monument",
        evidence:
          "WHAT IS DATED: the monument, by its place in a built complex. DATING METHOD: archaeological context — the " +
          "Sphinx sits within Khafre's pyramid complex, sharing its causeway and temples, and Lehner and Hawass " +
          "excavated a settlement of the scale required to build it, dating to Khafre's reign. WHAT IT ESTABLISHES: " +
          "that the monument belongs to that complex and that building programme. WHAT IT DOES NOT ESTABLISH " +
          "DIRECTLY: there is no inscription on the Sphinx naming Khafre as its maker, and the attribution rests on " +
          "context rather than on a text. WHO PROPOSES IT: mainstream Egyptology; the attribution goes back to 1853 " +
          "and Hawass writes that most scholars hold it.",
        notes:
          "Egyptian chronology for the Fourth Dynasty is itself reconstructed rather than absolute, and different " +
          "chronologies move Khafre's reign by up to about a century. The century precision here reflects that.",
      },
      {
        sourceKey: "schoch_gsa1991",
        startYear: -6999,
        endYear: -4999,
        datePrecision: "millennium",
        isApproximate: true,
        originalDateText: "carved between 7000 and 5000 BC, or possibly earlier",
        datingMethod: "geological",
        chronology: "alternative",
        whatIsDated: "The weathering of the core body and the enclosure walls",
        evidence:
          "WHAT IS DATED: the erosion profile on the Sphinx's core body and the walls of the quarried enclosure — " +
          "NOT the monument's surface, much of which is later casing and restoration. DATING METHOD: geological " +
          "interpretation of what produced the weathering. WHAT SCHOCH ARGUES: the rounded, vertically fissured " +
          "profile is precipitation-induced, made by rainfall rather than by windblown sand, and therefore requires " +
          "a climate substantially wetter than Egypt has had since the Old Kingdom. WHAT THE ARGUMENT ESTABLISHES " +
          "IF ACCEPTED: an earliest possible date for the cutting, derived from climate. WHAT IT DOES NOT MEASURE: " +
          "the rock is not dated by this; nothing is dated by this. The date is an inference from a weathering " +
          "mechanism to the climate that mechanism needs. WHO PROPOSES IT: Robert Schoch, a geologist, presenting " +
          "at the Geological Society of America annual meeting in October 1991.",
        notes:
          "MAINSTREAM OBJECTION, stated because the record is not complete without it: Egyptologists and a number of " +
          "geologists hold that the profile is explained by the limestone itself — the Sphinx is cut through beds of " +
          "markedly different hardness, and differential weathering of soft and hard layers can produce the same " +
          "look without a wetter climate. The disagreement is about rock, not about Egypt.\n\n" +
          "Schoch has been reported as later extending his range towards 10,000 BCE. That is not seeded as a claim " +
          "here because the specific publication in which he does so could not be traced to the standard this " +
          "dataset requires, and the difference between 7000 and 10,000 BCE is too large to record on a report of a " +
          "report.",
        citations: [
          { sourceKey: "schoch_voices", relation: "supports", note: "Schoch's own book-length statement of the case." },
          {
            sourceKey: "hawass_mountain",
            relation: "disputes",
            note: "The Egyptological position, which places the carving within Khafre's building programme.",
          },
        ],
      },
      {
        sourceKey: "hancock_bauval_sphinx",
        startYear: -10499,
        datePrecision: "millennium",
        isApproximate: true,
        originalDateText: "10,500 BC — the sky the monument is said to be set to",
        datingMethod: "astronomical",
        chronology: "alternative",
        whatIsDated: "An astronomical configuration the monument is said to encode",
        evidence:
          "WHAT IS DATED: the sky. DATING METHOD: precession — the slow wobble of the Earth's axis, which moves the " +
          "stars against the horizon over millennia and can be calculated backwards precisely. WHAT THE CALCULATION " +
          "ESTABLISHES: that in about 10,500 BCE the constellation Leo rose due east at the spring equinox, ahead of " +
          "the lion-bodied monument that faces due east, and that the three main Giza pyramids then matched the " +
          "ground pattern of Orion's belt. THAT MUCH IS ARITHMETIC AND IS NOT IN DISPUTE. WHAT IT DOES NOT " +
          "ESTABLISH: when anybody cut a stone \u2014 the sky can be computed for any epoch, and the computation is " +
          "the same whether or not a monument was standing. WHAT IS IN DISPUTE: that " +
          "the arrangement is deliberate, and that the date of the sky is therefore the date of the building. " +
          "Hancock and Bauval do take that step and present 10,500 BCE as when the complex was laid out. WHO " +
          "PROPOSES IT: Graham Hancock and Robert Bauval, in their own book.",
        notes:
          "A CALCULATION ABOUT THE SKY IS NOT A MEASUREMENT OF A MONUMENT. Any alignment can be computed for any " +
          "epoch; what turns that into a date for a building is an argument that the builders intended it, and that " +
          "argument is not astronomy.\n\n" +
          "One objection is internal rather than archaeological, and is recorded because it is checkable: on the " +
          "ordinary reckoning of precession the age of Leo falls around 8500 BCE rather than 10,500 BCE, so the " +
          "identification of 10,500 with 'the age of Leo' does not follow straightforwardly from the same precession " +
          "the argument relies on.\n\n" +
          "Recorded at millennium precision because the claim is about an epoch. Storing 10,500 BCE to the year " +
          "would give the reader a precision the argument does not carry.",
        citations: [
          {
            sourceKey: "hawass_mountain",
            relation: "disputes",
            note: "The Egyptological chronology, which the correlation would displace by some eight thousand years.",
          },
          {
            sourceKey: "schoch_gsa1991",
            relation: "context",
            note:
              "A different alternative date by a different method, and thousands of years apart from this one — the " +
              "two are not versions of one claim.",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // THE DISPUTED SCIENTIFIC CLAIM. Peer-reviewed, and argued in the journals.
  // =========================================================================
  {
    slug: "cerutti-mastodon-site",
    title: "The Cerutti Mastodon site",
    summary:
      "Broken mastodon bone and stones in southern California, dated to about 130,000 years, and read by its excavators as the work of hominins.",
    description:
      "In 2017 Nature published a claim by Steven Holen and colleagues that an assemblage of broken mastodon bone and large stones near San Diego, uncovered during highway construction in 1992, records hominin activity about 130,000 years ago.\n\n" +
      "THIS IS NOT ALTERNATIVE ARCHAEOLOGY AND SHOULD NOT BE FILED AS THOUGH IT WERE. It is a claim by working archaeologists, published in a major peer-reviewed journal, disputed by other working archaeologists in other peer-reviewed journals. The disagreement is about evidence and is being conducted in the literature. That is what a live scientific dispute looks like, and it looks different from the Sphinx.\n\n" +
      "WHAT WOULD FOLLOW IF IT STANDS. The accepted chronology for the widespread peopling of the Americas is in the region of twenty thousand years or less. A hominin presence at 130,000 years would not adjust that figure; it would break it, and require a population and a route that no other site records.\n\n" +
      "WHY THE DATE IS THE LEAST CONTESTED PART. Uranium-series dating puts the bone between about 122,000 and 140,000 years old, and specialists in the method have called the work state of the art. The argument is not really about how old the bone is. It is about whether anything happened to it that needs a hominin — and whether the breakage could have been done by the earth-moving equipment that exposed it.",
    category: "archaeology",
    subcategory: "Peopling of the Americas",
    eventType: "disputed",
    eventTypeNote:
      "A disputed scientific claim, not an alternative-history one: proposed in Nature, contested in PaleoAmerica and Nature, and replied to in turn.",
    tags: ["cerutti", "california", "americas", "uranium-series", "peer-reviewed-dispute", "ancient-sites"],
    people: ["Steven R. Holen", "Richard Cerutti", "Thomas Deméré"],
    locationName: "Cerutti Mastodon site, San Diego County, California",
    lat: 32.9,
    lng: -117.15,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/AMNH_Mastodon.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/AMNH_Mastodon.jpg?width=1024",
        shows: "artefact",
        caption:
          "A mounted mastodon skeleton in a museum \u2014 the Warren Mastodon at the American Museum of Natural " +
          "History. THIS IS NOT THE CERUTTI ANIMAL. It is here to show what the San Diego site produced fragments " +
          "of: the bones under argument are broken pieces, and whether they were broken by people, by animals or " +
          "by the earth-moving equipment that exposed them is the whole dispute.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "holen2017",
        startYear: -138050,
        endYear: -120050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "about 130,000 years ago — the bone, dated to between 122,000 and 140,000 years",
        datingMethod: "uranium_series",
        chronology: "scientific",
        whatIsDated: "The mastodon bone in which the uranium series was measured",
        dateConvention: "years_ago",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: mastodon bone from the deposit. DATING METHOD: uranium–thorium (230Th/U) series. WHAT IT " +
          "ESTABLISHES: an age for the bone of roughly 122,000–140,000 years. WHAT IT DOES NOT ESTABLISH: that a " +
          "hominin touched it. The date and the interpretation are separate claims, and only the first is a " +
          "measurement. KNOWN DIFFICULTY WITH THE METHOD ON BONE: bone is an open system for uranium, taking it up " +
          "and losing it after death, so an age depends on a model of that uptake; critics noted that no strictly " +
          "local source of uranium was available to sample, which makes the model harder to constrain. WHO PROPOSES " +
          "THE INTERPRETATION: Holen and colleagues, who read the spiral-fractured bone and the associated stones as " +
          "hammerstones and anvils used on fresh bone.",
        notes:
          "Stored as a range around 130,000 years ago, converted from a years-ago figure counted from 1950 — which " +
          "is why the stored years are not round numbers. At this depth the 1,950-year offset is far inside the " +
          "measurement error and changes nothing; it is recorded because the convention is part of the claim.\n\n" +
          "MAINSTREAM OBJECTIONS, from the published reply by ten specialists: the site lacks the features human " +
          "activity usually leaves — no butchery marks, no carnivore marks, no unambiguous tools; the comparison " +
          "with known hominin sites does not hold up; and the bones were exposed by heavy earth-moving equipment, " +
          "which is documented to break proboscidean bone at other sites. The excavators replied that the breakage " +
          "pattern is inconsistent with construction damage. The exchange is still open.",
        citations: [
          {
            sourceKey: "braje2017",
            relation: "disputes",
            note:
              "Braje and nine co-authors in PaleoAmerica: the site is better explained by geological and other " +
              "non-human causes, and lacks what a hominin site would be expected to show.",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // THE SHARPEST VERSION OF THE DISTINCTION. Host rock is not artefact.
  // =========================================================================
  {
    slug: "klerksdorp-ottosdal-spheres",
    title: "The Ottosdal objects, and the age of the rock they came out of",
    summary:
      "Grooved mineral spheres from a three-billion-year-old deposit in South Africa — where the only thing anybody has dated is the deposit.",
    description:
      "Small, often spherical or disc-shaped objects, some with grooves running around them, collected by miners from pyrophyllite deposits worked near Ottosdal in South Africa. They are widely called the Klerksdorp spheres.\n\n" +
      "THIS RECORD CARRIES ONE DATE, AND THE DATE IS NOT OF THE OBJECTS. The pyrophyllite deposit is Precambrian, in the region of three billion years old. That figure is not in dispute and it is not remarkable — a great deal of South African rock is that age. What it is, is the only measurement anybody has.\n\n" +
      "THE MOVE THIS RECORD EXISTS TO SHOW. In popular writing the age of the host rock becomes the age of the objects, and the objects are described as three-billion-year-old manufactured artefacts. That is two claims welded together: one measured, one not. Nobody has dated an object. Nobody has dated the making of an object, because no making has been established. The rock is three billion years old whether the things in it are natural or not, so the figure cannot be evidence either way.\n\n" +
      "WHAT THE OBJECTS ARE MADE OF, which is checkable and has been checked. The geologist Paul Heinrich examined them petrographically and by X-ray diffraction: one proved to be hematite, an iron oxide; another wollastonite with hematite and goethite. The mainstream reading is that they are concretions — mineral masses grown in place within the sediment around a nucleus — and that the grooves, which are the feature most often called artificial, follow the layering of the sediment they grew in, a thing concretions commonly do.\n\n" +
      "THERE IS ALMOST NO LITERATURE. Conventional discussion of these objects amounts to Nel and others in 1937, a short piece by Cairncross in 1988, and Heinrich in the mid-1990s. A reader should know that the mainstream position rests on a small number of examinations, and that this is a small number because the objects have not seemed to specialists to require more — not because anything was suppressed.",
    category: "archaeology",
    subcategory: "Anomalous finds",
    eventType: "disputed",
    eventTypeNote:
      "Filed as disputed because the objects are actively presented as artefacts in print. The geological account of them is not contested within geology; what is contested is whether there is anything here to explain.",
    tags: ["klerksdorp", "ottosdal", "south-africa", "ooparts", "host-rock-not-artefact", "ancient-sites"],
    people: ["Paul V. Heinrich"],
    locationName: "Pyrophyllite deposits near Ottosdal, North West Province, South Africa",
    lat: -26.8167,
    lng: 26.0,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ottosdal2.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Ottosdal2.jpg?width=1024",
        shows: "evidence_photograph",
        caption:
          "One of the Ottosdal objects. It is filed on Commons among botryoidal hematite, which is the mineral " +
          "form the geologist Paul Heinrich found when he examined them. The grooves most often called machined " +
          "run with the layering of the sediment the object grew in \u2014 a thing concretions commonly do.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "wikipedia_klerksdorp",
        startYear: -3100000000,
        endYear: -3000000000,
        datePrecision: "billion_years",
        precisionDecimals: 1,
        isApproximate: true,
        originalDateText: "3.0 to 3.1 billion years — the pyrophyllite deposits",
        datingMethod: "geological",
        chronology: "geological",
        whatIsDated: "The pyrophyllite deposit the objects were collected from",
        evidence:
          "WHAT IS DATED: the Precambrian pyrophyllite deposit near Ottosdal. DATING METHOD: the geological age of " +
          "the formation. WHAT IT ESTABLISHES: how old the rock is. WHAT IT DOES NOT ESTABLISH, AND THIS IS THE " +
          "ENTIRE POINT OF THE RECORD: anything whatever about the objects found in it. A concretion grown in that " +
          "rock and a manufactured object somehow placed in that rock would both be recovered from three-" +
          "billion-year-old material. The measurement cannot distinguish between them, so it is not evidence for " +
          "either, and a headline age of 2.8 or 3 billion years attached to the objects is this measurement wearing " +
          "the wrong label.",
        notes:
          "Popular accounts most often give 2.8 billion years. The figure recorded here is 3.0–3.1 billion, which is " +
          "what the sources describing the deposit give, and the difference is not worth resolving because neither " +
          "figure dates an object.\n\n" +
          "NO CLAIM DATING THE OBJECTS THEMSELVES IS SEEDED ON THIS RECORD, and the absence is deliberate rather " +
          "than an omission. Nobody — including those arguing the objects are artificial — has produced a date for " +
          "an object, and an empty space is the accurate representation of that.",
        citations: [
          {
            sourceKey: "heinrich_ottosdal",
            relation: "context",
            note:
              "What the objects are actually made of, and the concretion account of how they and their grooves " +
              "formed.",
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links between records
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_LINKS: SeedEventLink[] = [
  {
    from: ANCIENT_SITES_ANCHOR_SLUG,
    to: "great-sphinx-carving",
    relation: "relevant",
    note:
      "The control and the contested case, side by side. Göbekli Tepe is older than Schoch's Sphinx and about as " +
      "old as the 10,500 BCE correlation, and is disputed by nobody — which is the fastest demonstration that a " +
      "date is not alternative because it is old.",
  },
  {
    from: ANCIENT_SITES_ANCHOR_SLUG,
    to: "gunung-padang-dating",
    relation: "relevant",
    note:
      "Both rest on radiocarbon. At Göbekli Tepe the carbon was in the wall plaster of the structure; at Gunung " +
      "Padang it was in soil associated with nothing. The method is the same and what it establishes is not.",
  },
  {
    from: "klerksdorp-ottosdal-spheres",
    to: "cerutti-mastodon-site",
    relation: "relevant",
    note:
      "Two records about the gap between a measurement and an interpretation — at opposite ends of how much there " +
      "is to interpret, and argued in completely different places.",
  },
];
