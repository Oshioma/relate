import type { SeedEvent, SeedSource, SeedTrack, SeedEventLink } from "./seed-types";

// =============================================================================
// EARLY HUMAN PRESENCE IN AUSTRALIA AND SAHUL
//
// Three records, and the distinctions between them are the whole point.
//
//   MOYJIL asks whether people made the fire. The deposit is Last Interglacial
//   and that is not in doubt; whether anything in it was made by human beings
//   is unresolved, and the researchers who published it say so themselves.
//
//   MADJEDBEBE is an archaeological assemblage — artefacts, pigments, grinding
//   stones, plant remains — interpreted as occupation by about 65,000 years
//   ago. Its chronology is argued about, in the journals, by name.
//
//   ARRIVAL IN SAHUL is a different question from either, and is kept as its
//   own record because an occupation date at one rock shelter is a MINIMUM
//   for presence on a continent, never a date of arrival. If people were at
//   Madjedbebe 65,000 years ago they got there before that.
//
// WHAT THIS DATASET MUST NOT DO, stated plainly because it is the easy drift:
//
//   • It must not say humans definitely lived in Australia 120,000 years ago.
//     Nobody has established that, including the Moyjil team.
//   • It must not say the first Aboriginal Australians arrived 65,000 years
//     ago. The oldest site currently known is not the date of first arrival.
//   • It must not average competing chronologies into one number. Where the
//     sources disagree, the disagreement is on the timeline where a reader can
//     see it. Where they do not disagree, no disagreement is manufactured.
//
// ON WHAT ARCHAEOLOGY IS AND IS NOT ABOUT HERE. These records date deposits,
// artefacts and sediments. They do not date the beginning of Aboriginal
// culture, law or identity, and nothing in them should be read as doing so.
// The First Peoples of Australia have their own accounts of their origins, and
// a radiocarbon or luminescence measurement is not a competing answer to that
// question — it is an answer to a different one.
//
// NO CONFIDENCE SCORES. Every claim shows its source, what was dated, the
// method, what the measurement establishes, what it does not, and who
// disagrees. Nothing is scored, ranked or badged.
// =============================================================================

export const EARLY_AUSTRALIA_ANCHOR_SLUG = "madjedbebe-early-occupation";

export const EARLY_AUSTRALIA_TRACK: SeedTrack = {
  name: "Early human presence in Australia and Sahul",
  slug: "early-australia-sahul",
  kind: "theme",
  color: "#a2603c",
};

// ---------------------------------------------------------------------------
// Sources
//
// Original peer-reviewed research first. Wikipedia is not used as the source
// of any date on this record set — every date below is sourced to the paper
// that proposed it.
// ---------------------------------------------------------------------------

export const EARLY_AUSTRALIA_SOURCES: SeedSource[] = [
  // --- Moyjil ---------------------------------------------------------------
  {
    key: "moyjil_prologue",
    title: "The Moyjil site, south-west Victoria, Australia: prologue",
    author: "John E. Sherwood",
    workTitle: "Proceedings of the Royal Society of Victoria",
    reference: "Volume 130, pages 7–13 (2018); doi:10.1071/RS18003",
    url: "https://www.publish.csiro.au/rs/pdf/RS18003",
    sourceType: "academic_paper",
    publishedYear: 2018,
    notes:
      "The opening paper of the multi-author Moyjil issue, which sets out what the investigation was for and what it " +
      "would take to settle it. Cited for the framing the whole dataset rests on: that the age of the deposit and " +
      "the question of human agency are two separate questions.",
  },
  {
    key: "moyjil_chronology",
    title: "The Moyjil site, south-west Victoria, Australia: chronology",
    author:
      "John E. Sherwood, Jim M. Bowler, Stephen P. Carey, John Hellstrom, Ian J. McNiven, " +
      "Colin V. Murray-Wallace, John R. Prescott, Daniele G. Questiaux, Nigel A. Spooner, " +
      "Frances M. Williams and Jon D. Woodhead",
    workTitle: "Proceedings of the Royal Society of Victoria",
    reference: "Volume 130 (2018); doi:10.1071/RS18005",
    url: "https://doi.org/10.1071/RS18005",
    sourceType: "academic_paper",
    publishedYear: 2018,
    notes:
      "The dating paper, and the source of every age on the Moyjil record. Amino acid racemisation on Lunella " +
      "undulata opercula, optically stimulated luminescence on the host calcarenite, and uranium–thorium where it " +
      "could be made to work. Cited also for what the team could NOT date: U–Th failed on the opercula and on a " +
      "fish otolith because neither behaved as a closed system, which is reported rather than quietly dropped.",
  },
  {
    key: "moyjil_hearth",
    title:
      "The Moyjil site, south-west Victoria, Australia: excavation of a Last Interglacial charcoal and burnt stone feature — is it a hearth?",
    workTitle: "Proceedings of the Royal Society of Victoria",
    reference: "Volume 130 (2018); doi:10.1071/RS18008",
    url: "https://doi.org/10.1071/RS18008",
    sourceType: "academic_paper",
    publishedYear: 2018,
    notes:
      "The excavation of the charcoal and burnt stone feature, with the question mark in the title left where the " +
      "authors put it. Cited for the observation — a feature of charcoal and heat-altered stone in Last Interglacial " +
      "dune sediments — as distinct from the interpretation of what made it.",
  },
  {
    key: "moyjil_fire",
    title:
      "The Moyjil site, south-west Victoria, Australia: fire and environment in a 120,000-year coastal midden — nature or people?",
    author: "Jim M. Bowler, David M. Price, John E. Sherwood and Stephen P. Carey",
    workTitle: "Proceedings of the Royal Society of Victoria",
    reference: "Volume 130 (2018)",
    sourceType: "academic_paper",
    publishedYear: 2018,
    notes:
      "The paper that puts the interpretive question in its own title. Cited as the source of the PROPOSAL that " +
      "people may have been responsible — and for the fact that it is offered as a question rather than as a " +
      "finding, which is how this timeline records it.",
  },

  // --- Madjedbebe ----------------------------------------------------------
  {
    key: "clarkson2017",
    title: "Human occupation of northern Australia by 65,000 years ago",
    author: "Chris Clarkson and colleagues",
    workTitle: "Nature",
    reference: "Nature volume 547, issue 7663, pages 306–310 (2017); doi:10.1038/nature22968",
    url: "https://www.nature.com/articles/nature22968",
    sourceType: "academic_paper",
    publishedYear: 2017,
    notes:
      "The excavation and dating paper for Madjedbebe, and the source of the 65,000-year figure. Single-grain " +
      "optical dating of the sediments, with the stratigraphic integrity argued from artefact refits as well as " +
      "from the dating. Cited for what the paper actually claims, which is a MINIMUM age for people being in " +
      "Australia — the paper's own words — and not a date of arrival.",
  },
  {
    key: "florin2020",
    title: "The first Australian plant foods at Madjedbebe, 65,000–53,000 years ago",
    author: "S. Anna Florin and colleagues",
    workTitle: "Nature Communications",
    reference: "2020; doi:10.1038/s41467-020-14723-0",
    url: "https://www.nature.com/articles/s41467-020-14723-0",
    sourceType: "academic_paper",
    publishedYear: 2020,
    notes:
      "The plant food remains from the earliest occupation phases, which carry their own date range in the title. " +
      "Cited because it dates a different thing from the artefact-bearing sediments — what people were eating, " +
      "across a span — and because that range is the source's own wording, not a rounding of somebody else's.",
  },
  {
    key: "oconnell2018",
    title: "When did Homo sapiens first reach Southeast Asia and Sahul?",
    author: "James F. O'Connell, Jim Allen and colleagues",
    workTitle: "Proceedings of the National Academy of Sciences",
    reference: "2018; doi:10.1073/pnas.1808385115",
    url: "https://www.pnas.org/doi/10.1073/pnas.1808385115",
    sourceType: "academic_paper",
    publishedYear: 2018,
    notes:
      "The published case against the 65,000-year age. Its argument is about the deposit rather than the " +
      "laboratory: Madjedbebe sits in a regionally extensive sand sheet, and tropical sand sheets with strong wet " +
      "and dry seasons are subject to rain-splash erosion, subsurface eluviation, creep and termite bioturbation — " +
      "all observable at or near the site today. Cited for the position that an age of more than 50,000 years for " +
      "this site is unlikely to be valid.",
  },
  {
    key: "clarkson2018_reply",
    title: "Reply to comments on Clarkson et al. (2017) 'Human occupation of northern Australia by 65,000 years ago'",
    author: "Chris Clarkson, Richard G. Roberts, Zenobia Jacobs, Ben Marwick, Richard Fullagar, Lee J. Arnold and Quan Hua",
    workTitle: "Australian Archaeology",
    reference: "Volume 84, issue 1 (2018); doi:10.1080/03122417.2018.1462884",
    url: "https://www.tandfonline.com/doi/abs/10.1080/03122417.2018.1462884",
    sourceType: "academic_paper",
    publishedYear: 2018,
    notes:
      "The excavators' answer to the disturbance argument: dense pulses of artefacts, intact site structures " +
      "including hearths with carbonised food remains, bands of refitting artefacts, and their position that there " +
      "is no evidence of extensive bioturbation. Cited so that both halves of the exchange are on the record.",
  },
  {
    key: "veth2025",
    title: "Do recent DNA studies refute a 65 kya arrival of humans in Sahul?",
    author: "Peter Veth, Lisa Matisoo-Smith, Adam Brumm, Huw S. Groucutt and Eleanor M. L. Scerri",
    workTitle: "Archaeology in Oceania",
    reference: "Volume 60, pages 191–194 (2025); doi:10.1002/arco.70005",
    url: "https://onlinelibrary.wiley.com/doi/10.1002/arco.70005",
    sourceType: "academic_paper",
    publishedYear: 2025,
    notes:
      "A 2025 commentary arguing that the genetic results do not overturn the archaeological case for arrival at or " +
      "before 65,000 years ago. Cited to show that this disagreement is live rather than settled, and that the " +
      "archaeological side has answered.",
  },
  {
    key: "allen2025",
    title: "Recent DNA studies question a 65 kya arrival of humans in Sahul",
    author: "Jim Allen and colleagues",
    workTitle: "Archaeology in Oceania",
    reference: "2025; doi:10.1002/arco.70002",
    url: "https://onlinelibrary.wiley.com/doi/10.1002/arco.70002",
    sourceType: "academic_paper",
    publishedYear: 2025,
    notes:
      "The commentary this dataset takes the genetic argument from: that evidence of Neanderthal admixture in all " +
      "non-African populations after about 50,000 years ago constrains when anyone could have reached Sahul. " +
      "Cited for that argument, which is about a global genetic signal rather than about any Australian site.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const EARLY_AUSTRALIA_EVENTS: SeedEvent[] = [
  // =========================================================================
  // MOYJIL — the deposit is old; whether people made the evidence is open.
  // =========================================================================
  {
    slug: "moyjil-possible-early-activity",
    title: "Possible early human activity at Moyjil (Point Ritchie)",
    summary:
      "A Last Interglacial shell and burnt stone deposit on the Victorian coast, and an open question about whether people had anything to do with it.",
    description:
      "Moyjil, also called Point Ritchie, is a cliffed site at the mouth of the Hopkins River at Warrnambool in south-west Victoria. Investigation there has found shells of edible marine molluscs lying on an erosional surface, together with transported stones coloured dark grey to near-black in a way that suggests fire, fractured stones, and a feature of charcoal and burnt stone within coastal dune sediments.\n\n" +
      "THE AGE OF THE DEPOSIT IS NOT THE DISPUTED PART. Dating work places the shell bed just after the Last Interglacial sea-level maximum, around 120,000 to 125,000 years ago. That figure comes from amino acid racemisation on shell opercula and optical dating of the host calcarenite, cross-checked against Last Interglacial beach deposits nearby.\n\n" +
      "WHAT IS DISPUTED IS WHETHER PEOPLE MADE ANY OF IT. Every feature listed above can also be produced without human beings: shells accumulate where birds and other animals bring them, stones fracture and discolour in natural fires, and experimental burning of calcrete has produced thermal alteration resembling what is found here. HUMAN ACTIVITY HAS NOT BEEN ESTABLISHED AS THE CAUSE, and the researchers do not claim that it has — one of their own papers carries the question 'nature or people?' in its title, and another asks 'is it a hearth?' in its.\n\n" +
      "SO THE HONEST STATEMENT IS: a deposit of about 120,000 years old contains material that MIGHT represent human activity, and might not. It is not: humans lived in Australia 120,000 years ago.\n\n" +
      "WHY THE DISTINCTION MATTERS FOR LEARNING. Dating a deposit and identifying who or what made the things inside it are two different operations with two different kinds of evidence. The dating here is careful and its result is not seriously contested. The interpretive question is the open one, and no amount of further precision on the age will close it — only evidence about agency can do that.\n\n" +
      "If human agency were established, this would sit some 55,000 years before the oldest widely accepted archaeological evidence for people in Australia, which is why it attracts the attention it does.",
    category: "archaeology",
    subcategory: "Proposed interpretation",
    eventType: "archaeological_interpretation",
    eventTypeNote:
      "A reading of physical evidence that is explicitly offered as a question by the researchers who published it. The deposit's age is well supported; human agency is proposed and unresolved.",
    tags: [
      "australia",
      "aboriginal-australia",
      "first-peoples",
      "moyjil",
      "point-ritchie",
      "early-humans",
      "archaeology",
      "disputed-chronology",
    ],
    people: ["Jim M. Bowler", "John E. Sherwood", "Ian J. McNiven", "Stephen P. Carey"],
    locationName: "Moyjil (Point Ritchie), Warrnambool, Victoria, Australia",
    lat: -38.3958,
    lng: 142.5033,
    claims: [
      {
        sourceKey: "moyjil_chronology",
        startYear: -123050,
        endYear: -118050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "just after the Last Interglacial sea-level maximum (120–125 ka)",
        datingMethod: "amino_acid_racemisation",
        chronology: "geological",
        whatIsDated: "The shell bed, and the deposit the burnt and fractured stones lie in",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: the shell bed at Moyjil and the sediments containing it. DATING METHOD: amino acid " +
          "racemisation on opercula of the marine snail Lunella undulata, with optically stimulated luminescence on " +
          "the host calcarenite, cross-checked against four Last Interglacial beach deposits at Moyjil and Goose " +
          "Lagoon. WHAT THE MEASUREMENT ESTABLISHES: that the deposit formed just after the Last Interglacial " +
          "sea-level maximum. WHAT IT DOES NOT ESTABLISH: who or what put the shells there, or what heated the " +
          "stones. Dating a deposit and identifying the agent that formed the material in it are two different " +
          "operations, and only the first has been done here.",
        notes:
          "The wording is the source's own, kept as a range because that is how the chronology paper expresses it. " +
          "An earlier determination of 67 ± 10 ka for the shell deposit is reported in the same paper and " +
          "superseded by this work; it is not seeded as a separate claim because the method behind the earlier " +
          "figure could not be established from the sources consulted, and a date without its method is not " +
          "something this timeline records.",
      },
      {
        sourceKey: "moyjil_chronology",
        startYear: -101050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "a U–Th age of 103 ka for a calcrete sheet within the 240 ka sand",
        datingMethod: "uranium_series",
        chronology: "geological",
        whatIsDated: "A calcrete sheet in the older sand beneath the shell bed",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: a calcrete sheet within the sand underlying the site, itself around 240,000 years old. " +
          "DATING METHOD: uranium–thorium. WHAT IT ESTABLISHES: part of the sequence of events at the site before " +
          "and after the shell bed was laid down. WHAT IT DOES NOT ESTABLISH: anything about the shell bed or the " +
          "burnt stones, which are a different deposit. THIS CLAIM IS ON THE RECORD PRECISELY BECAUSE IT IS EASY TO " +
          "MISREAD: one site yields several ages, from several materials, for several different things, and only " +
          "one of them is the age of the layer the disputed material is in.",
        notes:
          "The same paper reports that uranium–thorium could NOT be used on the Lunella opercula or on a fish " +
          "otolith from the site, because neither behaved as a closed system. A method that fails on one material " +
          "and works on another in the same deposit is worth seeing — it is why the chronology needed three " +
          "techniques rather than one.",
      },
      {
        sourceKey: "moyjil_fire",
        startYear: -123050,
        endYear: -118050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "a 120,000-year coastal midden — nature or people?",
        datingMethod: "claimant_inference",
        chronology: "hypothesis",
        whatIsDated: "Whether people made the fire and gathered the shells — the interpretation, not the deposit",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: nothing new. This claim carries the same age as the deposit above, because that is the " +
          "age the proposal would inherit IF human agency were established. DATING METHOD: none — the date is " +
          "borrowed from the deposit, and what is being proposed is an interpretation of the material in it, so " +
          "this is recorded as the claimant's own inference rather than as a measurement of anything. " +
          "WHAT IS PROPOSED: that some of the " +
          "burnt and fractured stone, the shell accumulation, and the charcoal-and-burnt-stone feature could " +
          "represent human activity. WHO PROPOSES IT: the Moyjil researchers themselves, and they put it as a " +
          "question — 'nature or people?' in one paper's title, 'is it a hearth?' in another's. WHAT THE EVIDENCE " +
          "SHOWS, as observations: shells of edible marine molluscs on an erosional surface; transported stones " +
          "with dark grey to near-black colouration suggestive of fire; fractured stones; a feature of charcoal and " +
          "heat-altered stone in dune sediment. WHAT IT DOES NOT ESTABLISH: that people were responsible. " +
          "Experimental burning of calcrete produced similar thermal alteration without anybody making a hearth, " +
          "and natural processes remain live explanations for every observation listed.",
        notes:
          "Recorded as a hypothesis and not as an archaeological finding, because that is what the source offers. " +
          "It is on the timeline rather than left off because leaving it off would be its own distortion: a reader " +
          "who has seen a headline about 120,000-year-old Australians deserves to find the actual state of the " +
          "question, which is that it is open.",
        citations: [
          {
            sourceKey: "moyjil_hearth",
            relation: "context",
            note: "The excavation of the charcoal and burnt stone feature, with the question left in its title.",
          },
          {
            sourceKey: "moyjil_prologue",
            relation: "context",
            note: "The framing of the investigation and what it would take to settle the question.",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // MADJEDBEBE — an assemblage, and an argument about its chronology.
  // =========================================================================
  {
    slug: EARLY_AUSTRALIA_ANCHOR_SLUG,
    title: "Early human occupation at Madjedbebe",
    summary:
      "An archaeological assemblage in Arnhem Land interpreted as occupation by about 65,000 years ago — and a published argument that it cannot be that old.",
    description:
      "Madjedbebe is a rock shelter in Arnhem Land, in the Northern Territory. Excavation recovered stone artefacts in three dense bands, ground ochres and other pigment material, grinding stones, ground-edge hatchet heads and plant food remains.\n\n" +
      "WHAT THE EVIDENCE HAS BEEN INTERPRETED AS SHOWING: human occupation by approximately 65,000 years ago. That is the careful form of the statement and it is the form this record uses. It is NOT 'the first Aboriginal Australians arrived 65,000 years ago' — finding the oldest site currently known does not establish when people first arrived, and the excavators describe their own result as a minimum age.\n\n" +
      "THE CHRONOLOGY IS ARGUED ABOUT, BY NAME, IN THE JOURNALS. The excavators dated the sediments by single-grain optical dating and argued for the deposit's integrity from artefact refits as well as from the dating. A published response holds that an age of more than 50,000 years for this site is unlikely to be valid, on the ground that Madjedbebe sits in a regionally extensive tropical sand sheet subject to rain-splash erosion, subsurface eluviation, creep and termite bioturbation — processes visible at or near the site today, any of which could move small artefacts downwards through sediment. The excavators replied, pointing to dense artefact pulses, hearths with carbonised food remains, bands of refitting artefacts, and their reading that extensive bioturbation is not in evidence.\n\n" +
      "BOTH POSITIONS ARE ON THIS RECORD AS SEPARATE CLAIMS, with their own sources and their own reasoning, because that is what the disagreement actually is. Neither is scored, and this timeline does not pick between them.\n\n" +
      "THE PLANT FOOD REMAINS CARRY THEIR OWN RANGE — 65,000 to 53,000 years ago — and are a separate claim because they date something different: what people were eating across a span of occupation, not the moment the lowest artefacts were buried.\n\n" +
      "COMPARED WITH MOYJIL, this is a different kind of evidence answering a different question. Madjedbebe has an assemblage of things that are unambiguously artefacts; the argument is about how old they are. Moyjil has a well-dated deposit; the argument is about whether anything in it was made by people. The roughly 55,000 years between the two figures is not a measurement disagreement, because the two are not measuring the same thing.",
    category: "archaeology",
    subcategory: "Archaeological evidence",
    eventType: "archaeological_interpretation",
    eventTypeNote:
      "Archaeological evidence, widely accepted as evidence of occupation, whose precise chronology is actively debated in the peer-reviewed literature.",
    tags: [
      "australia",
      "aboriginal-australia",
      "first-peoples",
      "madjedbebe",
      "arnhem-land",
      "archaeology",
      "early-humans",
    ],
    people: ["Chris Clarkson", "Zenobia Jacobs", "Richard G. Roberts", "James F. O'Connell", "Jim Allen"],
    locationName: "Madjedbebe, Arnhem Land, Northern Territory, Australia",
    lat: -12.3,
    lng: 132.9,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Arnhem_Land_tropical_savanna.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Arnhem_Land_tropical_savanna.jpg?width=1024",
        shows: "site",
        caption:
          "Arnhem Land savanna. THIS IS NOT THE SHELTER \u2014 it is the country the shelter stands in, and the " +
          "environment is the point: a tropical sand sheet with pronounced wet and dry seasons. The published " +
          "objection to the 65,000-year date turns on what seasons like these do to sand, and whether they can " +
          "move small artefacts downwards through a deposit.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "clarkson2017",
        startYear: -63050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "human occupation began around 65,000 years ago",
        datingMethod: "luminescence",
        chronology: "archaeological",
        whatIsDated: "The sediments containing the lowest dense band of stone artefacts",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: the sand the artefacts were buried in — not the artefacts, which cannot be dated " +
          "directly. DATING METHOD: optically stimulated luminescence, measured on thousands of individual sand " +
          "grains rather than on bulk samples, which is what allows grains that have moved to be identified. WHAT " +
          "IT ESTABLISHES: when those sand grains were last exposed to daylight. THE INFERENCE: that the artefacts " +
          "were deposited with the sand, so the sand's age dates the occupation. WHAT SUPPORTS THAT INFERENCE: " +
          "artefacts concentrated in three dense bands, and artefact refits — pieces struck from the same core " +
          "found together, which is hard to explain if material has moved far through the deposit. WHAT IT DOES " +
          "NOT ESTABLISH: when people first reached Australia. The paper offers this as a MINIMUM age for human " +
          "presence, and a minimum is a floor, not a date.",
        notes:
          "Stored from a years-ago figure counted from 1950, which is why the stored year is not round. The " +
          "excavation was carried out with the Traditional Owners of the area as partners in the work.",
        citations: [
          {
            sourceKey: "oconnell2018",
            relation: "disputes",
            note:
              "The published case that an age of more than 50,000 years for this site is unlikely to be valid, " +
              "on the behaviour of tropical sand sheets rather than on the laboratory work.",
          },
          {
            sourceKey: "clarkson2018_reply",
            relation: "supports",
            note:
              "The excavators' reply: dense artefact pulses, intact hearths with carbonised food remains, " +
              "refitting artefact bands, and no evidence they accept of extensive bioturbation.",
          },
        ],
      },
      {
        sourceKey: "florin2020",
        startYear: -63050,
        endYear: -51050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "65,000–53,000 years ago",
        datingMethod: "luminescence",
        chronology: "archaeological",
        whatIsDated: "The plant food remains from the earliest occupation phases",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: the phases of occupation the preserved plant foods come from, by the same sediment " +
          "chronology as the artefacts. DATING METHOD: optically stimulated luminescence on the containing " +
          "sediments. WHAT IT ESTABLISHES: that plant foods were being processed and eaten across this span. WHAT " +
          "IT DOES NOT ESTABLISH: a different or competing start date — this is a RANGE OF OCCUPATION, not a rival " +
          "estimate of when occupation began, and reading it as a more conservative version of the 65,000-year " +
          "figure would be a misreading of both.",
        notes:
          "Kept as its own claim rather than folded into the one above because it dates a different thing. The " +
          "range is the source's own, taken from its title.",
      },
      {
        sourceKey: "oconnell2018",
        startYear: -48050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "an age estimate of >50 ka for this site is unlikely to be valid",
        datingMethod: "stratigraphic",
        chronology: "disputed",
        whatIsDated: "The occupation the artefacts represent, on the critics' reading of the deposit",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: nothing new was measured. This is an argument about whether the measured sediment ages " +
          "can be transferred to the artefacts. DATING METHOD: stratigraphic reasoning about site formation. THE " +
          "ARGUMENT: Madjedbebe sits in a regionally extensive sand sheet, and tropical sand sheets with " +
          "pronounced wet and dry seasons are subject to rain-splash erosion, subsurface eluviation, creep and " +
          "bioturbation by termites — all observable at or near the site today. If small artefacts have moved " +
          "downwards through the sand, they would be found among grains older than the occupation that produced " +
          "them. WHAT IT ESTABLISHES: that a mechanism exists which could produce the observed association " +
          "without the occupation being that old. WHAT IT DOES NOT ESTABLISH: that this mechanism did operate here " +
          "— which is exactly what the excavators dispute in their reply. WHO PROPOSES IT: O'Connell, Allen and " +
          "colleagues, in PNAS.",
        notes:
          "Stored as an upper limit rather than as a positive date, because that is the shape of the claim: the " +
          "authors argue against an age of more than about 50,000 years rather than proposing a specific younger " +
          "one for this site. The stored year is that limit and should be read as 'not older than', which is why " +
          "no end year is set.",
        citations: [
          {
            sourceKey: "clarkson2018_reply",
            relation: "disputes",
            note: "The excavators' direct answer to the disturbance argument.",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // ARRIVAL — a different question from any site's occupation date.
  // =========================================================================
  {
    slug: "first-arrival-in-sahul",
    title: "Earliest proposed human arrival in Sahul",
    summary:
      "When people first reached the continent — which no excavation can date directly, and which the archaeology and the genetics currently answer differently.",
    description:
      "Sahul is the single landmass that Australia, New Guinea and Tasmania formed when sea level was lower. This record is about when human beings first reached it, and it is deliberately separate from every site record on this timeline.\n\n" +
      "WHY IT HAS TO BE A SEPARATE RECORD. An excavated occupation date is a MINIMUM CONSTRAINT ON PRESENCE, never a date of arrival. If people were at Madjedbebe 65,000 years ago, they reached the continent at some point before that — how long before is not something the rock shelter can tell you. The oldest site currently known is the oldest site currently known; it is not the moment of first landfall, and it never can be, because the earliest arrivals are the least likely to have left a site anyone has found.\n\n" +
      "TWO KINDS OF EVIDENCE CURRENTLY POINT DIFFERENT WAYS, and both are on this record with their own sources.\n\n" +
      "THE ARCHAEOLOGICAL CASE takes the oldest accepted site chronology as a floor: at or before about 65,000 years ago, on the Madjedbebe dating. A 2025 commentary argues that the genetic results do not overturn this.\n\n" +
      "THE GENETIC CASE runs from a global signal rather than from any Australian site: evidence of Neanderthal admixture in all non-African populations after about 50,000 years ago. If every population outside Africa carries a genetic event dated to after 50,000 years ago, the argument goes, then the ancestors of people in Sahul cannot have left before it either. A 2025 commentary sets this out; another, the same year, answers it.\n\n" +
      "THIS DISAGREEMENT IS LIVE AND RECENT. It is not a settled question with one dissenter, and this timeline does not resolve it. What it does is show what each side is actually reasoning from, so a reader can see that one argument is about a rock shelter in Arnhem Land and the other is about a genetic signal shared by everybody outside Africa — which is why the two are hard to weigh against each other.\n\n" +
      "WHAT THIS RECORD IS NOT ABOUT. It is not about when Aboriginal cultures, laws or identities began. Those are not archaeological quantities and no date here should be read as bearing on them. The First Peoples of Australia have their own accounts of their origins, and those accounts answer a different question from this one.",
    category: "archaeology",
    subcategory: "Contested chronology",
    eventType: "disputed",
    eventTypeNote:
      "Specialists actively disagree, in print and recently. The disagreement is between kinds of evidence — excavated site chronology and population genetics — rather than between two readings of one measurement.",
    tags: [
      "australia",
      "sahul",
      "aboriginal-australia",
      "first-peoples",
      "arrival",
      "archaeology",
      "genetics",
      "contested-chronology",
    ],
    people: ["Peter Veth", "Jim Allen", "James F. O'Connell", "Chris Clarkson"],
    locationName: "Sahul — Australia, New Guinea and Tasmania as one landmass",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Sunda-sahul-wallacea.png?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Sunda-sahul-wallacea.png?width=1024",
        shows: "map",
        caption:
          "Sunda, Wallacea and Sahul at low sea level. The water in the middle is why arrival is a hard question: " +
          "Sahul was never joined to Asia at any sea level, so reaching it always required open-water crossings \u2014 " +
          "and the coastlines the earliest arrivals would have landed on are now underwater.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Map_of_Sunda_and_Sahul_2.png?width=1024",
        shows: "map",
        caption:
          "A second drawing of the same geography. Comparing two maps of Sunda and Sahul is worth doing: the " +
          "shelves are modelled from bathymetry, and the exact coastlines differ between reconstructions even " +
          "though the shape of the problem \u2014 a permanent water gap \u2014 does not.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "clarkson2017",
        startYear: -63050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "a new minimum age for the arrival of people in Australia",
        datingMethod: "luminescence",
        chronology: "archaeological",
        whatIsDated: "The latest arrival could have been, given the Madjedbebe evidence",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: not arrival. This is the Madjedbebe occupation date functioning as a CEILING on how late " +
          "arrival can have been. DATING METHOD: optically stimulated luminescence on the site's sediments. WHAT IT " +
          "ESTABLISHES: that people were present by about 65,000 years ago, so arrival was at or before then. WHAT " +
          "IT DOES NOT ESTABLISH: how much earlier. The gap between first landfall and the oldest site anybody has " +
          "excavated is unknown and is not something excavation can measure — the first arrivals are precisely the " +
          "people least likely to have left a findable site. The paper's own phrasing is a minimum age, and that is " +
          "how it is recorded here.",
        notes:
          "The same measurement appears on the Madjedbebe record dating a different thing: there it dates the " +
          "sediments containing the artefacts, here it constrains arrival. One measurement, two propositions — " +
          "which is why they are two claims and not one.",
        citations: [
          {
            sourceKey: "veth2025",
            relation: "supports",
            note: "A 2025 commentary arguing that the recent genetic results do not refute arrival at or before 65 ka.",
          },
          {
            sourceKey: "allen2025",
            relation: "disputes",
            note: "The genetic argument against an arrival this early.",
          },
        ],
      },
      {
        sourceKey: "allen2025",
        startYear: -48050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "Neanderthal introgression among all non-African populations after 50 kya",
        datingMethod: "genetic",
        chronology: "hypothesis",
        whatIsDated: "Arrival, constrained by when non-African populations carry a shared genetic event",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: a genetic event shared by all populations outside Africa — admixture with Neanderthals — " +
          "placed after about 50,000 years ago. DATING METHOD: population genetics. THE INFERENCE: if every " +
          "non-African population carries that event, then the ancestors of the people who reached Sahul were still " +
          "part of that shared history after 50,000 years ago, and cannot have been in Australia before it. WHAT IT " +
          "ESTABLISHES: a constraint derived from a global signal. WHAT IT DOES NOT ESTABLISH: anything about any " +
          "Australian site, its stratigraphy or its dating — which is the difficulty in weighing this against the " +
          "archaeology, because the two are not evidence of the same kind about the same thing. WHO PROPOSES IT: " +
          "Jim Allen and colleagues, in a 2025 commentary.",
        notes:
          "Stored as a constraint of 'not before about 50,000 years ago' rather than as a proposed date of arrival, " +
          "because the argument sets a limit rather than naming a moment. A 2025 reply by Veth and colleagues holds " +
          "that human arrival at or before 65 ka currently lacks the global-scale correlates the genetic argument " +
          "would require — the exchange is on the record in both directions and is not resolved here.",
        citations: [
          {
            sourceKey: "veth2025",
            relation: "disputes",
            note: "The archaeological answer, published the same year in the same journal.",
          },
          {
            sourceKey: "oconnell2018",
            relation: "context",
            note:
              "The earlier statement of the same broad position, arguing that the spread of modern humans beyond " +
              "Africa is best placed around 50,000 to 55,000 years ago.",
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

export const EARLY_AUSTRALIA_LINKS: SeedEventLink[] = [
  {
    from: "moyjil-possible-early-activity",
    to: EARLY_AUSTRALIA_ANCHOR_SLUG,
    relation: "relevant",
    note:
      "COMPARE THESE CLAIMS. About 55,000 years separate the two figures, and they are NOT two measurements of one " +
      "thing. Moyjil asks whether material in a well-dated 120,000-year-old deposit was made by people at all. " +
      "Madjedbebe has an assemblage nobody disputes is artefacts, and argues about how old it is. The evidence " +
      "differs, the question differs, and the thing in doubt differs — so the gap between the numbers is not a " +
      "disagreement that could be settled by better dating.",
  },
  {
    from: EARLY_AUSTRALIA_ANCHOR_SLUG,
    to: "first-arrival-in-sahul",
    relation: "evidence_for",
    note:
      "The occupation date at one rock shelter is a MINIMUM for presence on the continent: it says arrival was at " +
      "or before then, and nothing about how much earlier. The two are separate records for that reason.",
  },
  {
    from: "moyjil-possible-early-activity",
    to: "first-arrival-in-sahul",
    relation: "relevant",
    note:
      "If human agency at Moyjil were ever established, it would bear directly on this record. It has not been, so " +
      "no claim on the arrival record rests on it — which is what the link is for: showing the connection without " +
      "letting an unresolved question quietly become evidence.",
  },
];
