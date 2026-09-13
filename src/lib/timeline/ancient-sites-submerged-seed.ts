import type { SeedEvent, SeedSource, SeedTrack, SeedEventLink } from "./seed-types";

// =============================================================================
// UNDER WATER: WHAT SUBMERGENCE DATES, AND WHAT IT DOES NOT
//
// Fourth tranche of the disputed-dates dataset. The artefact tranche was about
// one substitution — rock age standing in for object age. This one is about a
// subtler and much more persuasive version of it.
//
// A SEA-LEVEL DATE IS A REAL MEASUREMENT AND IT DATES A DROWNING. Sea level in
// the early Holocene is known well: it rose something like sixty metres between
// roughly 10,000 and 5000 BCE. So for any given depth there is a defensible
// answer to "when was this last dry land", and that answer is a genuine,
// checkable, mainstream number.
//
// WHAT IT GIVES YOU IS A FLOOR, AND ONLY UNDER TWO CONDITIONS. If a thing was
// made by people, and if it is still where it was made, then it is at least as
// old as the water above it. Both conditions have to hold, and on these records
// it is usually one of them that is actually in question:
//
//   • IS IT MADE AT ALL? Yonaguni and Bimini are both argued about at this
//     level, not at the level of dates. Nobody disputes how deep the rock is or
//     when the sea arrived. What is disputed is whether anyone shaped it.
//   • IS IT STILL WHERE IT WAS MADE? Bimini's blocks are in-situ beachrock that
//     cracked and settled. The Gulf of Khambhat material was dredged, so its
//     position is not recorded at all.
//   • AND IS THE DATED THING THE BUILT THING? At Khambhat a piece of wood was
//     carbon dated. Wood is not a city.
//
// SO THE CHAIN BREAKS IN A DIFFERENT PLACE ON EACH RECORD, and the claims are
// laid out so a reader can see which link is being argued over. Where the
// question is "is this even made", that question is its own claim with its own
// method — following Calico, where the same split is what the record is for.
//
// TWO RECORDS HERE ARE NOT DISPUTES AT ALL, and they are the reason the tranche
// is worth having. The Pantelleria Vecchia monolith is a twelve-metre worked
// stone at forty metres depth, published in a peer-reviewed journal, and the
// bank it stands on went under at 9350 ± 200 BP. Dwarka is a genuinely
// submerged, properly excavated port. Submerged structures of real antiquity
// exist. The interesting question was never whether they could.
//
// AND EVEN ON THOSE TWO, THE SEA-LEVEL DATE IS STILL A DATE FOR THE DROWNING.
// The Pantelleria figure is a minimum for the monolith, not its age. Keeping
// that straight on the record where the claim is accepted is the only way the
// same distinction means anything on the records where it is not.
//
// NO CONFIDENCE SCORES. No verdict words. Where a claimant changed his own
// mind, the record follows him rather than the figure that kept circulating.
// =============================================================================

export const ANCIENT_SITES_SUBMERGED_ANCHOR_SLUG = "yonaguni-monument-reported";

export const ANCIENT_SITES_SUBMERGED_TRACK: SeedTrack = {
  name: "Under water: drowned coasts, and what submergence dates",
  slug: "ancient-sites-submerged",
  kind: "theme",
  color: "#2f6f7f",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_SUBMERGED_SOURCES: SeedSource[] = [
  // --- Yonaguni -----------------------------------------------------------
  {
    key: "kimura_congress2007",
    title: "Report on the submarine topography off Yonaguni, to the 21st Pacific Science Congress",
    author: "Masaaki Kimura",
    reference: "21st Pacific Science Congress, Okinawa, 2007",
    sourceType: "academic_paper",
    publishedYear: 2007,
    notes:
      "Kimura's own later position, and the reason this record exists in the shape it does. At the congress he put " +
      "the formation at 2,000 to 3,000 years old, reasoning that sea level then was close to present — which is a " +
      "much younger figure than the one that circulates under his name. Cited as the claimant's own statement. " +
      "NEEDS SOURCE VERIFICATION for a page reference: the congress abstract itself could not be reached, and this " +
      "entry rests on reporting of what he presented.",
  },
  {
    key: "schoch_yonaguni",
    title: "Enigmatic Yonaguni: underwater monuments",
    author: "Robert M. Schoch",
    url: "http://www.robertschoch.net/enigmatic%20yonaguni%20underwater%20rms%20ct.htm",
    sourceType: "modern_interpretation",
    notes:
      "Schoch dived at Yonaguni in 1997 and wrote up what he saw: bedding planes the sandstone parts along, and " +
      "sets of joints and fractures crossing them, in a region where earthquakes fracture rock regularly. Cited " +
      "for the geological reading and for his own later qualification of it — fundamentally natural, possibly used " +
      "and modified. He is the same geologist who argued for an older Sphinx, which is worth knowing when reading " +
      "him here.",
  },
  {
    key: "wikipedia_yonaguni",
    title: "Yonaguni Monument — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Yonaguni_Monument",
    sourceType: "wikipedia",
    notes:
      "Used for orientation and for the sequence of events — Aratake's sighting in 1986, Kimura's work from 1992, " +
      "the depth range, and the fact that neither the Agency for Cultural Affairs nor Okinawa Prefecture treats " +
      "the features as cultural property. No date on any record rests on it alone.",
  },
  {
    key: "holocene_sea_level",
    title: "Early Holocene sea level rise",
    url: "https://en.wikipedia.org/wiki/Early_Holocene_sea_level_rise",
    sourceType: "wikipedia",
    notes:
      "The general curve: a rise of roughly sixty metres between about 10,000 and 5000 BCE, at rates from a few " +
      "millimetres a year to several centimetres during brief accelerations. Cited for the shape of the curve that " +
      "every record in this tranche depends on. A site-specific reconstruction would be better and is what a " +
      "closer claim about any one of these places would need.",
  },

  // --- Pantelleria --------------------------------------------------------
  {
    key: "lodolo_benavraham2015",
    title:
      "A submerged monolith in the Sicilian Channel (central Mediterranean Sea): evidence for Mesolithic human activity",
    author: "Emanuele Lodolo and Zvi Ben-Avraham",
    workTitle: "Journal of Archaeological Science: Reports",
    reference: "2015",
    sourceType: "academic_paper",
    publishedYear: 2015,
    notes:
      "The peer-reviewed report of a twelve-metre monolith at forty metres depth on the Pantelleria Vecchia Bank. " +
      "Its argument for human work is petrographic and contextual: the stone is not the stone of the surrounding " +
      "outcrops, it stands isolated from them, and it carries regular holes. Cited as the primary publication, and " +
      "as this tranche's demonstration that a submerged worked stone of real antiquity is an ordinary finding " +
      "rather than a forbidden one.",
  },

  // --- Bimini -------------------------------------------------------------
  {
    key: "shinn1978",
    title: "Atlantis: Bimini's hoax",
    author: "Eugene A. Shinn",
    workTitle: "Sea Frontiers",
    reference: "Volume 24, pages 130–141 (1978)",
    sourceType: "academic_paper",
    publishedYear: 1978,
    notes:
      "Shinn was a USGS geologist who cored the Bimini blocks. The cores are the evidence: the blocks are in-situ " +
      "beachrock, bedding continuous from one block to the next, which is what settles the question of whether " +
      "they were placed. The word in the title is Shinn's own and is about the Atlantis identification rather " +
      "than about anyone at Bimini; this dataset cites the coring and does not adopt the title as a finding.",
  },
  {
    key: "shinn2004",
    title: "A geologist's adventures with Bimini beachrock and Atlantis true believers",
    author: "Eugene A. Shinn",
    workTitle: "Skeptical Inquirer",
    reference: "Volume 28, number 1 (2004)",
    url: "https://cdn.centerforinquiry.org/wp-content/uploads/sites/29/2004/01/22164702/p38.pdf",
    sourceType: "academic_paper",
    publishedYear: 2004,
    notes:
      "Shinn's own retrospective account of the coring, the radiocarbon work and the argument that followed it. " +
      "The accessible version of the 1978 evidence, and cited for the method — what a core through a block can " +
      "show that a photograph of the block cannot.",
  },
  {
    key: "cayce_440_5",
    title: "Reading 440-5",
    author: "Edgar Cayce",
    reference: "20 December 1933",
    sourceType: "primary",
    publishedYear: 1933,
    notes:
      "The Bimini reading itself: 'A portion of the temples may yet be discovered, under the slime of ages of sea " +
      "water — near what is known as Bimini, off the coast of Florida.' Cited because this dataset requires an " +
      "alternative claim to come from the claimant rather than from someone describing him, and because the " +
      "reading is what sent people to look at that particular patch of sea floor. Quoted only as far as it has " +
      "been verified.",
  },
  {
    key: "wikipedia_bimini",
    title: "Bimini Road — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Bimini_Road",
    sourceType: "wikipedia",
    notes:
      "Used for the discovery details — Valentine, Mayol and Angove on 2 September 1968, in about eighteen feet of " +
      "water — and for the radiocarbon results from the University of Miami on Shinn's 1977 core. Followed back to " +
      "Shinn's own publications for everything the record rests on.",
  },

  // --- Gulf of Khambhat ---------------------------------------------------
  {
    key: "wikipedia_khambhat",
    title: "Marine archaeology in the Gulf of Khambhat — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Marine_archaeology_in_the_Gulf_of_Khambhat",
    sourceType: "wikipedia",
    notes:
      "The fullest accessible account of the NIOT surveys of 2000–2002, what was recovered, the 9,500-year " +
      "radiocarbon date on a piece of wood, and the archaeological objections — that the material was dredged " +
      "rather than excavated, that no marine archaeologist examined the site, and that the stone pieces described " +
      "as hand tools may be geofacts. Used for orientation; the record is written around the method question, " +
      "which is not in dispute between the parties.",
  },

  // --- Dwarka -------------------------------------------------------------
  {
    key: "rao_dwarka1987",
    title: "Marine archaeological explorations of Dwarka, north-west coast of India",
    author: "S. R. Rao",
    workTitle: "Indian Journal of Marine Sciences",
    reference: "Volume 16, March 1987, pages 22–30",
    url: "https://nopr.niscpr.res.in/bitstream/123456789/38461/1/IJMS%2016(1)%2022-30.pdf",
    sourceType: "academic_paper",
    publishedYear: 1987,
    notes:
      "Rao led the Marine Archaeology Centre's work off Dwarka from 1983. Cited as the excavation's own " +
      "publication: a submerged fortified port recorded by controlled underwater survey, with datable finds — " +
      "stone anchors, an Indus-type seal, an inscribed jar, post-Harappan pottery. This is what the method looks " +
      "like when it is done properly, and it is on this timeline for that reason as much as for the site.",
  },
  {
    key: "wikipedia_bet_dwarka",
    title: "Bet Dwarka — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Bet_Dwarka",
    sourceType: "wikipedia",
    notes:
      "Used for the span of the offshore work, the Late Harappan attribution of the pottery, and the comparisons " +
      "with Prabhas and Ahar. Orientation only; the dating on the record is Rao's.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_SUBMERGED_EVENTS: SeedEvent[] = [
  // =========================================================================
  // YONAGUNI — where the claimant's own date moved and the popular one did not.
  // =========================================================================
  {
    slug: ANCIENT_SITES_SUBMERGED_ANCHOR_SLUG,
    title: "The Yonaguni formation is reported",
    summary:
      "Terraced sandstone off Okinawa, argued about since 1986 — and the geologist who proposed it was built later said 2,000 to 3,000 years, not 10,000.",
    description:
      "In 1986 a diver, Kihachiro Aratake, noticed terraced rock formations off Yonaguni, the westernmost of the Ryukyu Islands. Masaaki Kimura of the University of the Ryukyus began studying them, and from 1992 argued that they are worked: stepped monoliths, with features he reads as walls, steps and a road.\n\n" +
      "THE ARGUMENT IS NOT ABOUT A DATE. It is about whether anybody shaped the stone. Nobody disputes how deep the formation is — roughly five to twenty-five metres — and nobody disputes when the sea arrived there. The dates follow from the answer to the making question, which is why this record keeps that question as a claim of its own.\n\n" +
      "THE GEOLOGICAL READING. Robert Schoch dived the site in 1997 and described sandstone with well-defined parallel bedding planes along which the layers separate easily, crossed by sets of parallel and vertical joints and fractures. Yonaguni is in an earthquake-prone region, and earthquakes fracture rock in regular ways. On that reading the rectangular forms are what this rock does when it breaks. He has since qualified it: fundamentally natural, possibly used and modified by people. He is also the geologist who argued for an older Sphinx, and a reader who has met him on that record should meet him on this one knowing it.\n\n" +
      "THE PART ALMOST NOBODY REPEATS, AND THE REASON THIS RECORD IS HERE. The figure attached to Yonaguni in general circulation is ten thousand years, and it comes from Kimura's early work on the sandstone. But at the 21st Pacific Science Congress in 2007 Kimura himself proposed 2,000 to 3,000 years, reasoning that sea level at that time was close to present. The claimant moved and the popular figure did not. Both of his positions are on this record, dated and attributed, because the date somebody actually proposes is the claim — not the one that travels best.\n\n" +
      "NEITHER THE AGENCY FOR CULTURAL AFFAIRS NOR OKINAWA PREFECTURE treats the features as cultural property. That is a fact about official recognition, stated as such. It is not a measurement and it is not on this record as one.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "A dispute about whether a rock formation was shaped by people. The depth and the sea-level history are agreed by everyone arguing.",
    tags: ["yonaguni", "japan", "submerged", "kimura", "schoch", "ancient-sites"],
    people: ["Masaaki Kimura", "Robert M. Schoch", "Kihachiro Aratake"],
    locationName: "Off Yonaguni, Ryukyu Islands, Japan",
    lat: 24.4,
    lng: 123.0,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Yonaguni_Monument_Main_Terrace.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Yonaguni_Monument_Main_Terrace.jpg?width=1024",
        shows: "site",
        caption:
          "The main terrace of the Yonaguni formation. Whether the flat faces and right angles are cut or are the " +
          "natural bedding and jointing of this sandstone is exactly the disagreement — and this is the surface " +
          "both sides are describing.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Yonaguni_Ruins_Scuba.jpg?width=1024",
        shows: "site",
        caption:
          "A diver at the formation, which gives it a scale. Photographs of it are the main evidence most people " +
          "ever see, and a photograph cannot show whether a surface was worked.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "holocene_sea_level",
        startYear: -8050,
        endYear: -6050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "last dry land somewhere between about 10,000 and 8,000 years ago, from the depth and the sea-level curve",
        datingMethod: "sea_level_reconstruction",
        chronology: "geological",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "When the rock platform was last above water",
        evidence:
          "WHAT IS DATED: the drowning of a platform lying about five to twenty-five metres down. DATING METHOD: " +
          "the Holocene sea-level curve, which rose some sixty metres between roughly 10,000 and 5000 BCE. WHAT IT " +
          "ESTABLISHES: that this rock was dry land within the range of human occupation, and a floor for the age " +
          "of anything made there and still in place. WHAT IT DOES NOT ESTABLISH: that anything was made there. A " +
          "natural sandstone terrace drowns on exactly the same schedule as a built one, so this measurement " +
          "cannot distinguish between them and is not evidence on the question people actually disagree about.",
        notes:
          "Stored as a range because a coastline does not drown on a date. Converted from years before present " +
          "rather than carried across as a round figure.\n\n" +
          "NEEDS SOURCE VERIFICATION for a site-specific reconstruction. This uses the general curve against a " +
          "stated depth range, which is enough for the floor and not enough for a close figure.",
      },
      {
        sourceKey: "wikipedia_yonaguni",
        startYear: -8050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "Kimura's earlier position: sandstone sampling indicating a period older than 10,000 years, when the area was land",
        datingMethod: "claimant_inference",
        chronology: "alternative",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "The formation as a built thing — Kimura's earlier reading",
        evidence:
          "WHAT IS DATED: the formation, on the assumption that it is built. DATING METHOD: an inference, from " +
          "sandstone sampling together with the depth — which is why it is recorded as the claimant's inference " +
          "rather than as a measurement of a structure. WHAT IT ESTABLISHES: the date Kimura argued for in his " +
          "earlier work, and the figure that entered general circulation. WHAT IT DOES NOT ESTABLISH: that the " +
          "formation is built, which is the prior question and is its own claim below.",
        notes:
          "This is the figure a reader will have met, and it is on the record for that reason. It is NOT Kimura's " +
          "final position — see the 2007 claim, which is his own revision downwards by most of an order of " +
          "magnitude. Reading the two together is the point of this record.",
        citations: [
          {
            sourceKey: "kimura_congress2007",
            relation: "disputes",
            note: "Kimura's own later and much younger figure, which displaces this one as his position.",
          },
          { sourceKey: "schoch_yonaguni", relation: "disputes", note: "The geological reading of the same rock." },
        ],
      },
      {
        sourceKey: "kimura_congress2007",
        startYear: -1050,
        endYear: -50,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "2,000 to 3,000 years ago, proposed by Kimura at the 21st Pacific Science Congress in 2007",
        datingMethod: "claimant_inference",
        chronology: "alternative",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "The formation as a built thing — Kimura's later reading",
        evidence:
          "WHAT IS DATED: the formation, still on the assumption that it is built. DATING METHOD: the claimant's " +
          "inference, reasoning from sea level — which at 2,000 to 3,000 years ago was close to present, so the " +
          "work could have been done on a shore rather than on a plain. WHAT IT ESTABLISHES: what Kimura actually " +
          "proposed in 2007. WHAT IT DOES NOT ESTABLISH: that the formation is built. The making question is " +
          "untouched by moving the date, which is worth noticing: the revision answers an objection about sea " +
          "level and leaves the objection about bedding planes exactly where it was.",
        notes:
          "THE CLAIMANT REVISED HIS OWN DATE AND THE RECORD FOLLOWS HIM. A timeline that carried only the 10,000-" +
          "year figure under his name would be misattributing a position he had moved away from — and would be " +
          "doing it in the direction that makes the claim sound stranger than he was making it.",
      },
      {
        sourceKey: "schoch_yonaguni",
        startYear: -8050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "the terraces read as natural fracture of bedded sandstone in an earthquake-prone region",
        datingMethod: "claimant_inference",
        chronology: "hypothesis",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "Whether the stone was shaped by people at all — the interpretation, not the rock",
        evidence:
          "WHAT IS DATED: nothing. This is the prior question, filed as a claim because it is one and because the " +
          "dates above are answers to it rather than evidence for it. DATING METHOD: interpretation of the " +
          "formation — parallel bedding planes along which the sandstone separates, and sets of joints and " +
          "fractures crossing them, in a region where earthquakes fracture rock regularly. WHAT IT ESTABLISHES: " +
          "that the rectangular forms have a known mechanism that does not require anyone to have cut them. WHAT " +
          "IT DOES NOT ESTABLISH: that nobody did. Schoch's own later formulation — fundamentally natural, " +
          "possibly used and modified — is the careful version and is the one this record carries.",
        notes:
          "Sharing a stored year with the sea-level claim, because an interpretation has no date of its own and " +
          "the timeline has to place it somewhere. What it dates is in its own heading, which is how a reader can " +
          "tell it apart from a measurement.\n\n" +
          "THE SAME SHAPE AS CALICO. There too the deposit's age was not the argument; whether the stone in it was " +
          "struck by a person was. Two sites, two hemispheres, one structure of disagreement.",
      },
    ],
  },

  // =========================================================================
  // PANTELLERIA — the control, and it is peer-reviewed.
  // =========================================================================
  {
    slug: "pantelleria-vecchia-monolith",
    title: "A worked monolith is reported on the Pantelleria Vecchia Bank",
    summary:
      "Twelve metres of shaped stone at forty metres depth in the Sicilian Channel, on a bank the sea took at 9350 ± 200 BP. Published in a peer-reviewed journal.",
    description:
      "In 2015 Emanuele Lodolo and Zvi Ben-Avraham published a submerged monolith from the Pantelleria Vecchia Bank in the Sicilian Channel: about twelve metres long, lying at forty metres depth, broken into two parts, with regular holes through it.\n\n" +
      "WHY IT IS READ AS MADE. Not because of its shape alone. The stone is not the stone of any neighbouring outcrop, and it stands isolated from them — so it was brought. Petrographic analysis is the argument, and cutting, moving and setting a block of that size is the skill the paper says it implies.\n\n" +
      "WHEN THE BANK WENT UNDER. Seawater covered the Pantelleria Vecchia Bank at 9350 ± 200 years before present, which presumably displaced whoever was living there. A monolith in place on that bank is therefore at least that old.\n\n" +
      "AND THAT IS A FLOOR, NOT AN AGE. This is the record where this dataset says that with nothing at stake in saying it. The measurement is of an inundation. It dates the water, and it dates the monolith only through the monolith's position — which here, unlike at the Gulf of Khambhat, was actually observed and recorded. The inference is short, it is stated, and it is still an inference.\n\n" +
      "THIS RECORD IS THE CONTROL FOR THE WHOLE TRANCHE. A submerged worked stone of real Mesolithic antiquity is an ordinary archaeological finding, published in the ordinary way, and it did not need anybody to be suppressing anything. Which is the useful thing to know before reading the records where the claim did not survive: the objection at Yonaguni and at Bimini was never that submerged structures are impossible.",
    category: "archaeology",
    subcategory: "Submerged landscapes",
    eventType: "mainstream",
    eventTypeNote:
      "A peer-reviewed report, accepted on its own terms. Here as a control — the measurement is of the inundation, and the monolith's age rests on its observed position.",
    tags: ["pantelleria", "sicilian-channel", "submerged", "mesolithic", "control", "ancient-sites"],
    people: ["Emanuele Lodolo", "Zvi Ben-Avraham"],
    civilisations: ["Mesolithic Mediterranean"],
    locationName: "Pantelleria Vecchia Bank, Sicilian Channel",
    lat: 36.7,
    lng: 12.0,
    claims: [
      {
        sourceKey: "lodolo_benavraham2015",
        startYear: -7400,
        datePrecision: "thousand_years",
        isApproximate: true,
        uncertaintyPlus: 200,
        uncertaintyMinus: 200,
        originalDateText: "the bank inundated at 9350 ± 200 years BP",
        datingMethod: "sea_level_reconstruction",
        chronology: "geological",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "When the Pantelleria Vecchia Bank was covered by the sea",
        evidence:
          "WHAT IS DATED: the inundation of the bank. DATING METHOD: sea-level reconstruction, reported as 9350 ± " +
          "200 years before present. WHAT IT ESTABLISHES: a minimum age for anything standing on the bank and " +
          "still in place, the monolith included. WHAT IT DOES NOT ESTABLISH: when the monolith was cut or set. " +
          "That could have been any time before the water arrived, and this measurement is silent about how long " +
          "before. A floor is not an age, on the records where the claim is accepted exactly as much as on the " +
          "ones where it is not.",
        notes:
          "The ± 200 is the reported tolerance on one measurement and is stored as a tolerance. It is not an end " +
          "year: '9350 ± 200 BP' and 'some time between 9550 and 9150 BP' are different assertions and the second " +
          "is not what the paper says.",
      },
      {
        sourceKey: "lodolo_benavraham2015",
        startYear: -7400,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "the monolith read as worked, from petrography and from its isolation from local outcrops",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "Whether the stone was shaped and moved by people — the interpretation",
        evidence:
          "WHAT IS DATED: nothing; this is the making question, kept as its own claim so that this record has the " +
          "same shape as the contested ones. DATING METHOD: petrographic analysis and context — the monolith is of " +
          "a stone unlike every neighbouring outcrop and stands isolated from them, and it carries regular holes. " +
          "WHAT IT ESTABLISHES: that it was cut, carried and set, which is the paper's argument. WHAT IT DOES NOT " +
          "ESTABLISH: a date by itself. It is the condition under which the inundation date becomes a floor for a " +
          "human structure rather than a fact about a rock.",
        notes:
          "Filed as the same kind of claim as Schoch's reading at Yonaguni and Leakey's at Calico, and answered " +
          "differently — which is the comparison worth having. Here the argument is petrographic and comparative " +
          "rather than about fracture patterns, and it persuaded reviewers.",
      },
    ],
  },

  // =========================================================================
  // BIMINI — where the cores answered the question photographs could not.
  // =========================================================================
  {
    slug: "bimini-road-reported",
    title: "The Bimini blocks are reported",
    summary:
      "Rectangular blocks in eighteen feet of water off North Bimini, found in 1968 — five years after a reading said temples would be found near Bimini. Cored in 1977.",
    description:
      "On 2 September 1968, Joseph Manson Valentine, Jacques Mayol and Robert Angove were diving in about eighteen feet of water off the north-west coast of North Bimini in the Bahamas and found a line of large rectangular blocks on the sea floor.\n\n" +
      "WHY PEOPLE WERE LOOKING THERE. Edgar Cayce's reading 440-5, given on 20 December 1933, said that a portion of the temples might yet be discovered under the slime of ages of sea water, near what is known as Bimini, off the coast of Florida. That reading is why Bimini was a place to look, and the blocks were found by people who knew it. This is not an argument against the blocks. It is the context in which they were interpreted, and a reader weighing the interpretation needs it.\n\n" +
      "WHAT THE CORES SHOWED, AND WHY CORING WAS THE RIGHT TEST. Eugene Shinn, a USGS geologist, cored the blocks in 1977. A photograph of a rectangular block cannot distinguish a block that was placed from a slab that cracked where it lay. A core through several blocks can: the bedding inside them runs continuously from one block to the next, and they are composed of beachrock — beach sand cemented in place. There were no tool marks, no mortar, and nothing beneath them but more sand. On that reading they are a single sheet of beachrock that fractured in the regular way beachrock does and settled as the sand washed out from under it, while Holocene sea level rose over the whole thing.\n\n" +
      "THE RADIOCARBON DATES WHAT THE CEMENT DID. In 1978 the University of Miami dated samples from Shinn's core at roughly 2,770 to 3,510 years before present. That is a date for the formation of the rock. It is not a construction date, and nobody — on either side — has ever proposed a structure of that age here.\n\n" +
      "SO THE CHAIN BREAKS AT THE SECOND LINK, not the first. The blocks really are under water, and the sea really did rise over them. What the cores address is whether they are where they were put, and the finding is that they were never put anywhere.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "A dispute about whether natural rock was placed by people. The cores address position rather than date, which is what was actually in question.",
    tags: ["bimini", "bahamas", "submerged", "beachrock", "cayce", "atlantis", "ancient-sites"],
    people: ["Eugene A. Shinn", "Joseph Manson Valentine", "Edgar Cayce"],
    locationName: "Off North Bimini, Bahamas",
    lat: 25.7617,
    lng: -79.2958,
    claims: [
      {
        sourceKey: "wikipedia_bimini",
        startYear: 1968,
        startMonth: 9,
        startDay: 2,
        datePrecision: "day",
        isApproximate: false,
        originalDateText: "found on 2 September 1968 by Valentine, Mayol and Angove",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The day the blocks were found",
        evidence:
          "WHAT IS DATED: the discovery dive. DATING METHOD: the historical record. WHAT IT ESTABLISHES: that the " +
          "blocks were found on that day, in about eighteen feet of water, by three named people. WHAT IT DOES NOT " +
          "ESTABLISH: anything about the blocks. It is on the record because the date matters to how the find was " +
          "read — it falls in the year a widely known reading had been taken to point at.",
        notes:
          "The finders are named because they can be. Compare the Dorchester notice, which names nobody: a find " +
          "with named finders and a recorded depth is a better-documented find, whatever turns out to be true " +
          "about the rock.",
        citations: [
          {
            sourceKey: "cayce_440_5",
            relation: "context",
            note: "The 1933 reading that made this patch of sea floor a place to look.",
          },
        ],
      },
      {
        sourceKey: "cayce_440_5",
        startYear: 1933,
        startMonth: 12,
        startDay: 20,
        datePrecision: "day",
        isApproximate: false,
        originalDateText: "Cayce reading 440-5, 20 December 1933 — temples to be found near Bimini",
        datingMethod: "historical_record",
        chronology: "traditional",
        whatIsDated: "The giving of the reading, which is a dated event in its own right",
        evidence:
          "WHAT IS DATED: the reading. DATING METHOD: the historical record — a reading with a number and a date. " +
          "WHAT IT ESTABLISHES: that an expectation of submerged temples near Bimini was in circulation thirty-" +
          "five years before anything was found there. WHAT IT DOES NOT ESTABLISH: anything about the sea floor. " +
          "It is evidence about an expectation, which is a real and dateable thing, and it is filed as that.",
        notes:
          "The claimant's own words rather than a description of them, which is what this dataset requires of an " +
          "alternative claim.\n\n" +
          "A FURTHER EXPECTATION OF 1968 OR 1969 CIRCULATES widely, and a separate reading of 28 June 1940 is " +
          "usually cited for Poseidia rising. NEEDS SOURCE VERIFICATION: that reading's number could not be " +
          "traced, so it is not seeded and no date here rests on it.",
      },
      {
        sourceKey: "shinn1978",
        startYear: -1560,
        endYear: -820,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "roughly 2,770 to 3,510 years BP, on samples from Shinn's 1977 core",
        datingMethod: "radiocarbon",
        chronology: "geological",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "When the beachrock cemented",
        evidence:
          "WHAT IS DATED: the carbonate cement of the rock itself, from a core. DATING METHOD: radiocarbon, at the " +
          "University of Miami in 1978. WHAT IT ESTABLISHES: when this beach sand turned to rock. WHAT IT DOES NOT " +
          "ESTABLISH: a construction. Nobody on either side of this argument proposes a structure of that age at " +
          "Bimini — so this figure answers a question nobody was asking, and quoting it as 'the age of the Bimini " +
          "Road' would misrepresent every party at once.",
        notes:
          "Converted from years before present. Stored as a range because the reported results are a range across " +
          "samples, which is a different thing from a tolerance on one measurement.",
        citations: [
          { sourceKey: "shinn2004", relation: "supports", note: "Shinn's own later account of the coring and the dating." },
        ],
      },
      {
        sourceKey: "shinn1978",
        startYear: -1560,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "cores showing bedding continuous between blocks, in-situ beachrock with no tool marks or mortar",
        datingMethod: "stratigraphic",
        chronology: "geological",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "Whether the blocks were placed or cracked where they lie — position, not age",
        evidence:
          "WHAT IS DATED: nothing. This is the claim the cores actually bear on, and it is about position rather " +
          "than date. DATING METHOD: coring and petrographic examination — bedding running continuously from one " +
          "block into the next, beachrock composition, no tool marks, no mortar, sand beneath. WHAT IT " +
          "ESTABLISHES: that the blocks formed where they are, as one sheet that fractured and settled. WHAT IT " +
          "DOES NOT ESTABLISH: that nobody ever used the place. It addresses how the blocks came to be in that " +
          "arrangement, which is the question the photographs could not settle and the question the argument was " +
          "always really about.",
        notes:
          "Filed as a claim rather than buried in prose because it is the load-bearing evidence on this record, " +
          "and because it is the same kind of claim as Schoch's at Yonaguni and Leakey's at Calico — an " +
          "interpretation of whether a thing is made or placed, which no date can answer.\n\n" +
          "WHY A CORE AND NOT A PHOTOGRAPH. Worth stating plainly: the test was chosen to discriminate between the " +
          "two explanations on offer, and it does. That is what makes it evidence rather than opinion.",
      },
    ],
  },

  // =========================================================================
  // THE GULF OF KHAMBHAT — where the dated thing is a piece of wood.
  // =========================================================================
  {
    slug: "gulf-of-khambhat-survey",
    title: "Submerged structures are reported in the Gulf of Khambhat",
    summary:
      "Geophysical surveys in 2000–2002 reported kilometres of arrangement on the sea floor, and dredged up wood carbon dated to 9,500 BP. The objection is about method, not about the date.",
    description:
      "Between 2000 and 2002 India's National Institute of Ocean Technology surveyed the Gulf of Khambhat off Gujarat. Side-scan and echo-sounding produced what the surveyors described as patterns of systematic arrangement extending over kilometres, and dredging recovered pottery sherds, fossilised bone, a tooth, weathered stone pieces described as hand tools, and a piece of wood. The wood was carbon dated to about 9,500 years before present.\n\n" +
      "THE DATE IS NOT WHAT IS DISPUTED. A radiocarbon date on wood is a radiocarbon date on wood, and 9,500 BP is a perfectly ordinary age for organic material from a sea floor that was dry land in the early Holocene. Nobody argues it is wrong.\n\n" +
      "WHAT IS DISPUTED IS WHETHER IT DATES ANYTHING BUILT. The material was recovered by DREDGING rather than by controlled excavation — which means the position of each object was not recorded, and so nothing recovered can be tied to any feature on the sonar. That is the whole of the objection and it is a methodological one: archaeologists have noted that no marine archaeologist examined the site, that the NIOT team were geophysical researchers rather than excavators, and that the stone pieces described as hand tools may be geofacts.\n\n" +
      "WOOD IS NOT A CITY. This is the cleanest example in the dataset of the difference between dating material recovered from a place and dating a structure at that place. Drowned land holds driftwood, tree stumps, bone and sherds from any period it was above water and from any period since. To get from 'wood here is 9,500 years old' to 'a settlement here is 9,500 years old' you need the wood to be part of the settlement, and the way you establish that is by recording where it was when you lifted it.\n\n" +
      "SO THIS RECORD CARRIES THE DATE AND DECLINES THE INFERENCE, which is different from declining the date. The figure is real. What it attaches to is not established, and the reason it is not established is a choice that was made about how to recover the material. That choice can be criticised without anyone having been dishonest about anything.\n\n" +
      "COMPARE DWARKA, a few hundred kilometres up the same coast: a genuinely submerged town, surveyed by divers under archaeological control, with finds recorded in place and dated. The contrast is the method and not the claim.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "A dispute about method. The radiocarbon date is accepted by everyone; what is contested is whether dredged material can be attached to features on a sonar image.",
    tags: ["khambhat", "cambay", "india", "submerged", "dredging", "provenance", "ancient-sites"],
    people: ["Badrinaryan Badrinaryan"],
    locationName: "Gulf of Khambhat, Gujarat, India",
    lat: 21.5,
    lng: 72.3,
    claims: [
      {
        sourceKey: "wikipedia_khambhat",
        startYear: 2000,
        endYear: 2002,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "NIOT surveys of the Gulf of Khambhat, 2000 to 2002",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The survey work itself",
        evidence:
          "WHAT IS DATED: the campaign of geophysical survey and dredging. DATING METHOD: the historical record. " +
          "WHAT IT ESTABLISHES: that the work happened, what equipment it used, and what was recovered. WHAT IT " +
          "DOES NOT ESTABLISH: what the sonar features are. A sonar image of regular patterning on a sea floor is " +
          "a real observation and is not, by itself, a building.",
        notes:
          "The survey is dated separately from what it recovered, because the two are different things and the " +
          "argument is precisely about the join between them.",
      },
      {
        sourceKey: "wikipedia_khambhat",
        startYear: -7550,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "a piece of wood carbon dated to about 9,500 years BP",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "A piece of wood brought up by the dredge",
        evidence:
          "WHAT IS DATED: one piece of wood. DATING METHOD: radiocarbon. WHAT IT ESTABLISHES: that wood of about " +
          "that age was on this sea floor, which is unsurprising for ground that was dry land in the early " +
          "Holocene. WHAT IT DOES NOT ESTABLISH, AND THIS IS THE RECORD: that anything was built here then. The " +
          "wood was dredged, so where it lay was never recorded, and a date is attached to a site by the position " +
          "of the dated thing and by nothing else. Drowned land holds driftwood and stumps from every period it " +
          "was above water.",
        notes:
          "Converted from years before present. The date is carried as reported and is not in dispute; what it " +
          "dates is. 'A 9,500-year-old city' and 'a 9,500-year-old piece of wood from where a city is proposed' " +
          "are different statements, and only the second has been established.",
      },
      {
        sourceKey: "wikipedia_khambhat",
        startYear: -7550,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "stone pieces described as hand tools, questioned as geofacts, with no recorded position",
        datingMethod: "claimant_inference",
        chronology: "hypothesis",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "Whether the recovered stone is worked, and whether any of it belongs to the features — the interpretation",
        evidence:
          "WHAT IS DATED: nothing. The making-and-position question, kept as its own claim because it is what the " +
          "disagreement consists of. DATING METHOD: interpretation of dredged material. WHAT IT ESTABLISHES: that " +
          "the surveyors read the stone pieces as hand tools. WHAT IT DOES NOT ESTABLISH: that they are, or that " +
          "they came from any feature. Two separate gaps, and dredging opens both at once — it is the reason the " +
          "stone cannot be checked against its context, because the context was not recorded. No marine " +
          "archaeologist has examined the site.",
        notes:
          "The objection is about method and is not an accusation. A geophysical team surveyed a sea floor and " +
          "dredged it, which is what geophysical teams do; the material that came up then could not answer an " +
          "archaeological question, which is what archaeologists said. Both halves of that are ordinary.",
        citations: [
          {
            sourceKey: "rao_dwarka1987",
            relation: "context",
            note: "What controlled underwater archaeology on the same coast looks like, and what it can therefore date.",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // DWARKA — the other control, and the more useful of the two.
  // =========================================================================
  {
    slug: "dwarka-offshore-excavation",
    title: "The submerged port at Dwarka is excavated",
    summary:
      "A real drowned town off Gujarat, surveyed by divers under archaeological control from 1983 — fortification walls, slipways, stone anchors, and finds dated to the Late Harappan.",
    description:
      "From 1983 the Archaeological Survey of India's Marine Archaeology Centre, working with the National Institute of Oceanography, ran systematic underwater survey off Dwarka on the Gujarat coast. Between 1985 and 1989 S. R. Rao recorded remains of a fortified port town: walls, structures read as warehousing, and rock-cut slipways for launching boats in the Gulf of Kutch near Bet Dwarka. More than five hundred stone anchors were recovered.\n\n" +
      "THE DATING RESTS ON FINDS RECORDED IN PLACE. Bronze Age stone anchors, an Indus-type seal, an inscribed jar, a coppersmith's stone mould, iron and shell objects, and pottery of Late Harappan and post-Harappan types comparable with Prabhas in Saurashtra and Ahar in Rajasthan. That puts the habitation in the later second millennium BCE, around 1600 to 1500 BCE.\n\n" +
      "WHY THIS RECORD IS ON A TIMELINE ABOUT DISPUTED DATES. Because it is not disputed, and because the method is the whole lesson. Everything that could not be done at the Gulf of Khambhat was done here: divers under archaeological direction, features recorded where they stood, finds logged in position, dating by material whose relationship to the structures is documented. The result is a submerged town with a defensible date — arrived at by the ordinary means, published in the ordinary places, and contested by nobody.\n\n" +
      "SO THE LESSON IS NOT THAT SUBMERGED TOWNS ARE DOUBTFUL. It is that a claim about one is as good as the record of where each dated thing was lying. Dwarka has that record. Khambhat does not, and Khambhat's problem was never its radiocarbon.\n\n" +
      "THE CITY IS ALSO IDENTIFIED WITH THE DVARAKA OF THE MAHABHARATA, Krishna's city, which the tradition describes as taken by the sea. That identification is a real part of why the site was searched for and is recorded here as a relationship between the excavated port and the account. IT IS NOT CONVERTED INTO A DATE. The tradition does not supply a year in the Common Era; figures are in circulation for the Mahabharata war and for the submergence, and none was traced to a primary source for this entry, so none is seeded. A reader looking for that date will not find one here, and the reason is written down.",
    category: "archaeology",
    subcategory: "Submerged landscapes",
    eventType: "mainstream",
    eventTypeNote:
      "An excavated and accepted chronology, here as the method control. The traditional identification is recorded as an identification and not converted into a date.",
    tags: ["dwarka", "bet-dwarka", "india", "submerged", "harappan", "control", "ancient-sites"],
    people: ["S. R. Rao"],
    civilisations: ["Late Harappan"],
    locationName: "Dwarka and Bet Dwarka, Gujarat, India",
    lat: 22.2394,
    lng: 68.9678,
    claims: [
      {
        sourceKey: "rao_dwarka1987",
        startYear: -1599,
        endYear: -1499,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Late Harappan habitation, about 1600 to 1500 BCE, from finds recorded in place",
        datingMethod: "archaeological",
        chronology: "archaeological",
        whatIsDated: "The habitation of the submerged port",
        evidence:
          "WHAT IS DATED: occupation of the site, from material whose position was recorded. DATING METHOD: " +
          "archaeological — typology of pottery of Late Harappan and post-Harappan types, comparable with Prabhas " +
          "and Ahar, together with Bronze Age stone anchors, an Indus-type seal, an inscribed jar and a " +
          "coppersmith's mould. WHAT IT ESTABLISHES: that there was a fortified port here in the later second " +
          "millennium BCE. WHAT IT DOES NOT ESTABLISH: that every submerged feature off this coast belongs to that " +
          "phase, or the date of the tradition's Dvaraka, which is a separate question this record does not answer.",
        notes:
          "Stored in astronomical year numbering: 1600 BCE is −1599. Marked approximate because a typological " +
          "bracket is not a measurement of a year.\n\n" +
          "THE CONTRAST WITH KHAMBHAT IS THE METHOD AND NOT THE CLAIM. The finds here can carry a date because " +
          "where each of them lay is written down.",
        citations: [
          { sourceKey: "wikipedia_bet_dwarka", relation: "context", note: "The span of the offshore work and the pottery comparisons." },
        ],
      },
      {
        sourceKey: "rao_dwarka1987",
        startYear: 1983,
        endYear: 1989,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "systematic marine archaeological survey from 1983, recording from 1985 to 1989",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The excavation campaign, which is the reason the date above can be trusted",
        evidence:
          "WHAT IS DATED: the survey and excavation. DATING METHOD: the historical record. WHAT IT ESTABLISHES: " +
          "that the work was done by divers under archaeological direction, with features recorded where they " +
          "stood and finds logged in position. WHAT IT DOES NOT ESTABLISH: anything on its own — but it is what " +
          "makes the habitation date a date for the town rather than a date for some material that was near it. " +
          "The method is evidence, and on a timeline about disputed dates it is worth a claim of its own.",
        notes:
          "On the record so that a reader comparing this with the Gulf of Khambhat can see the difference stated " +
          "rather than implied. Controlled recovery is why one of these two sites has a date.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_SUBMERGED_LINKS: SeedEventLink[] = [
  {
    from: "pantelleria-vecchia-monolith",
    to: ANCIENT_SITES_SUBMERGED_ANCHOR_SLUG,
    relation: "relevant",
    note:
      "The control beside the dispute. Both are stone under water with a sea-level date; one was read as worked by " +
      "reviewers on petrographic grounds and one is argued about at the level of whether it was shaped at all.",
  },
  {
    from: "dwarka-offshore-excavation",
    to: "gulf-of-khambhat-survey",
    relation: "relevant",
    note:
      "The same coast and two methods. Divers recording finds in place against a dredge bringing material up from " +
      "an unrecorded position — which is why one of these two has a date for a town and the other has a date for a " +
      "piece of wood.",
  },
  {
    from: "bimini-road-reported",
    to: ANCIENT_SITES_SUBMERGED_ANCHOR_SLUG,
    relation: "relevant",
    note:
      "The same disagreement in two oceans: not how deep or how old, but whether anybody shaped or placed the rock. " +
      "At Bimini a core was able to answer it.",
  },
  {
    from: "gulf-of-khambhat-survey",
    to: "pantelleria-vecchia-monolith",
    relation: "relevant",
    note:
      "What recording a position buys. The monolith's inundation date is a floor for the monolith because the " +
      "monolith was seen where it lies; the Khambhat wood's date is a floor for nothing, because nobody wrote down " +
      "where it came from.",
  },
];
