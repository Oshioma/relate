import { agoFrom, BP_REFERENCE_YEAR } from "./time";
import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

// =============================================================================
// PART B — THE DROWNED LANDS, AND PART K — AUSTRALIA
//
// These two belong in one dataset because they are the same question asked from
// both ends.
//
// PART B is land that was above water and is not: Doggerland under the North
// Sea, the Sunda Shelf under the Java Sea, the floor of the Persian Gulf. These
// are measurements. Nobody disputes that the sea rose about 120 metres or that
// those places went under; the dates come from seismic survey, radiocarbon and
// sea-level curves, and the disagreements are about decades and metres.
//
// PART K is Australian traditions that describe a coastline further out than
// the one there now. Those are accounts, held by living peoples, and the
// question they raise is the hardest one on this timeline:
//
//   CAN AN ORAL TRADITION CARRY A MEMORY FOR TEN THOUSAND YEARS?
//
// A published method says some of these may. Nunn and Reid took twenty-one
// stories, worked out the water depth that would have to be removed for each
// to be literally true, read that depth off the sea-level curve, and got a
// range of 7,250 to 13,070 years ago. It is careful, it is checkable, and it is
// not settled: most scientists are sceptical of oral memories that deep, and
// saying so is not a dismissal of the traditions.
//
// SO THE CLAIM IS SPLIT IN TWO, EVERY TIME.
//
//   1. WHEN THE WATER ROSE THERE. A measurement. Backstairs Passage flooded
//      between about 11,000 and 10,100 years ago, and that is dated by the same
//      methods as everything in Part A.
//
//   2. THAT THE STORY REMEMBERS IT. A proposed correlation, filed as disputed,
//      with the scepticism recorded on the claim rather than left out of it.
//
// The first does not date the tradition. Nothing here dates a tradition: a
// story is not given a year because the landscape it describes has one.
//
// AND THE NAMES ARE THE PEOPLES' OWN. Ngarrindjeri and Narungga are distinct
// nations with distinct accounts, not instances of "an Aboriginal flood myth".
// There is no such record here and there will not be one, for the same reason
// there is no single "Native American flood myth" on this timeline.
// =============================================================================

/** Years before present, on the 1950 convention the sources use. */
const bp = (yearsAgo: number): number => agoFrom(BP_REFERENCE_YEAR, yearsAgo);

export const FLOOD_SUBMERGED_ANCHOR_SLUG = "doggerland-drowned";

export const FLOOD_SUBMERGED_TRACK: SeedTrack = {
  name: "Drowned lands, and the coasts people remember",
  slug: "drowned-lands",
  kind: "theme",
  color: "#3f7d7a",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const FLOOD_SUBMERGED_SOURCES: SeedSource[] = [
  {
    key: "bondevik2003",
    title: "Record-breaking height for 8000-year-old tsunami in the North Atlantic",
    reference: "Bondevik, S., Mangerud, J., Dawson, S., Dawson, A. and Lohne, Ø. — Eos 84(31), 2003",
    url: "https://doi.org/10.1029/2003EO310001",
    sourceType: "academic_paper",
    publishedDisplay: "2003",
    notes:
      "The run-up heights and the radiocarbon dating of the Storegga tsunami deposits. The date this record " +
      "carries comes from here rather than from a round number in a summary.",
  },
  {
    key: "doggerland_inundation",
    title:
      "Early Holocene inundation of Doggerland and its impact on hunter-gatherers: An inundation model and dates-as-data approach",
    reference: "Published via ScienceDirect, article S1040618224001538",
    url: "https://www.sciencedirect.com/science/article/pii/S1040618224001538",
    sourceType: "academic_paper",
    publishedDisplay: "2024",
    notes:
      "Models the inundation rather than giving it one date, which is the right shape for a landscape that went " +
      "under over thousands of years and not in an afternoon.",
  },
  {
    key: "rose2010",
    title: "New Light on Human Prehistory in the Arabo-Persian Gulf Oasis",
    reference: "Rose, J. I. — Current Anthropology 51(6), December 2010",
    url: "https://doi.org/10.1086/657397",
    sourceType: "academic_paper",
    publishedDisplay: "2010",
    notes:
      "Current Anthropology publishes peer commentary alongside its articles and a reply by the author, so the " +
      "disagreement about this proposal is in print next to the proposal itself.",
  },
  {
    key: "nunn_reid2016",
    title: "Aboriginal Memories of Inundation of the Australian Coast Dating from More than 7000 Years Ago",
    reference: "Nunn, P. D. and Reid, N. J. — Australian Geographer 47(1), 2016, pp. 11–47",
    url: "https://doi.org/10.1080/00049182.2015.1077539",
    sourceType: "academic_paper",
    publishedDisplay: "2016",
    notes:
      "Twenty-one stories from around the Australian coast. The method: establish the water depth that would have " +
      "to be removed for each story to be literally true, then read that depth off the local sea-level curve. The " +
      "range that comes out is 7,250 to 13,070 years ago — which the paper itself gives as 5300–11,120 BC, and " +
      "which is a useful check on anybody's arithmetic.",
  },
  {
    key: "ngurunderi2024",
    title:
      "Calibrating Holocene human–environment interactions using ancient narratives: The example of Ngurunderi in South Australia",
    reference: "Journal of Island and Coastal Archaeology 20(3)",
    url: "https://doi.org/10.1080/15564894.2024.2337096",
    sourceType: "academic_paper",
    publishedDisplay: "2024",
    notes:
      "Later work on the Ngurunderi narrative specifically, with the submergence of Backstairs Passage dated to " +
      "11,000–10,100 cal BP.",
  },
  {
    key: "sundaland_ref",
    title: "Sundaland",
    reference: "Wikipedia, as a reference entry and a pointer to the underlying literature",
    url: "https://en.wikipedia.org/wiki/Sundaland",
    sourceType: "wikipedia",
    notes:
      "A TERTIARY SOURCE, marked as one. It is here because the Sunda Shelf's drowning is not controversial and " +
      "this record needs a citable statement of it; it is not here as evidence for anything argued over. Anyone " +
      "extending this record should replace it with the primary literature it summarises.",
  },
];

// ---------------------------------------------------------------------------
// The records
// ---------------------------------------------------------------------------

export const FLOOD_SUBMERGED_EVENTS: SeedEvent[] = [
  {
    slug: FLOOD_SUBMERGED_ANCHOR_SLUG,
    title: "Doggerland goes under the North Sea",
    summary:
      "A plain the size of a country, with rivers, marshes and people on it, between Britain and the Netherlands — drowned gradually as the sea rose, not in an event.",
    description:
      "<p>For thousands of years the southern North Sea was land. Seismic survey data gathered for oil exploration has been used to map its river channels, lakes and coastlines, and trawlers have brought up its animal bone and its worked flint for a century.</p>" +
      "<p><strong>It was not destroyed by a flood. It was drowned by a sea-level rise.</strong> The distinction matters more here than almost anywhere on this timeline: the water came up over thousands of years, fast enough in places to move a coastline within a lifetime, and slowly enough that nobody alive ever saw a wave take the country. What ended was a landscape, not a day.</p>" +
      "<p>The Storegga tsunami — its own record here — struck this coast near the end of that process. It is a separate event, and the two are regularly run together into a single story about a continent destroyed in an afternoon.</p>",
    category: "nature",
    subcategory: "Submerged landscape",
    eventType: "scientific_model",
    tags: ["submerged-landscape", "north-sea", "doggerland", "sea-level", "mesolithic"],
    locationName: "The southern North Sea, between Britain and the Netherlands",
    civilisations: ["Mesolithic northwest Europe"],
    motifs: ["rising_sea"],
    claims: [
      {
        sourceKey: "doggerland_inundation",
        startYear: bp(12000),
        endYear: bp(7000),
        datePrecision: "thousand_years",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The interval over which the landscape was inundated",
        originalDateText: "early Holocene sea-level rise between about 12,000 and 7,000 cal BP",
        datingMethod: "radiocarbon",
        chronology: "geological",
        evidence:
          "WHAT IS CLAIMED: an interval, not an event. The inundation is modelled rather than dated to a moment, because a landscape that large does not go under at once — the sea reached different parts of it thousands of years apart. HOW IT IS DATED: radiocarbon dates on material from the landscape, read against modelled sea level. IMPORTANT: these are CALIBRATED years before present, where present is fixed at 1950. Read as BCE they would land 1,949 years too early.",
      },
    ],
  },

  {
    slug: "storegga-tsunami",
    title: "The Storegga tsunami",
    summary:
      "A submarine landslide off Norway sent a wave that ran more than 20 metres above the sea level of the day in Shetland. Dated to about 8,150 years ago — one of the most precisely dated catastrophes on this timeline.",
    description:
      "<p>An enormous slab of the continental slope west of Norway failed and slid. The wave it raised is recorded as sheets of marine sand and gravel, and rafted lumps of peat, lying on what was then dry land around the North Atlantic — Norway, Shetland, Scotland, the Faroes, Greenland.</p>" +
      "<p><strong>This is what a real, sudden, regional catastrophe looks like in the record.</strong> It is worth holding beside the flood traditions on this timeline precisely because it is so well dated: an actual wave, an actual date, an actual deposit you can put your hand on — and no tradition anywhere that can be shown to remember it.</p>",
    category: "nature",
    subcategory: "Tsunami",
    eventType: "scientific_model",
    tags: ["tsunami", "storegga", "north-sea", "norway", "shetland"],
    locationName: "The Norwegian Sea, and the coasts around the North Atlantic",
    motifs: ["tsunami_wave", "natural_catastrophe"],
    claims: [
      {
        sourceKey: "bondevik2003",
        startYear: bp(8130),
        datePrecision: "century",
        isApproximate: true,
        uncertaintyPlus: 50,
        uncertaintyMinus: 50,
        temporalClaimType: "radiometric_date",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The slide and the wave it raised",
        originalDateText: "radiocarbon 7300 ± 20 14C years BP, calibrated to 8080–8180 cal BP",
        datingMethod: "radiocarbon",
        chronology: "geological",
        evidence:
          "WHAT IS CLAIMED: a date for the slide, from moss fragments buried by the tsunami deposit itself — material that was alive immediately before the wave and killed by it, which is about as direct as a radiocarbon date gets. HOW IT IS DATED: 7300 ± 20 radiocarbon years BP, calibrated to 8080–8180 calendar years before present. NOTE THE TWO NUMBERS: the radiocarbon age and the calendar age differ by roughly 800 years, and quoting the first as though it were the second is the same error that moves the Bonneville flood by three thousand years on this timeline.",
      },
    ],
  },

  {
    slug: "sunda-shelf-drowned",
    title: "The Sunda Shelf drowns, and Southeast Asia becomes islands",
    summary:
      "An area of lowland larger than India, joining Borneo, Java and Sumatra to the mainland, submerged as the sea rose — leaving the archipelago that is there now.",
    description:
      "<p>At the glacial maximum the sea stood roughly 120 metres lower and the Sunda Shelf was dry: the Malay Peninsula, Borneo, Java and Sumatra were one landmass with the Asian mainland. The rise that followed drowned it, and what had been a continent of lowland became the islands of Indonesia and Malaysia.</p>" +
      "<p><strong>Why this record is careful.</strong> Sundaland attracts claims that it was Atlantis, or the origin of world civilisation, or the homeland remembered in every flood story of the region. This record makes none of them. What is established is the geography and the timing. Anything beyond that is a separate claim and needs its own source.</p>",
    category: "nature",
    subcategory: "Submerged landscape",
    eventType: "scientific_model",
    tags: ["submerged-landscape", "sundaland", "southeast-asia", "sea-level"],
    locationName: "The Sunda Shelf — the Java Sea, the Gulf of Thailand and the southern South China Sea",
    motifs: ["rising_sea"],
    claims: [
      {
        sourceKey: "sundaland_ref",
        startYear: bp(14000),
        endYear: bp(7000),
        datePrecision: "thousand_years",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The interval over which the shelf was submerged",
        originalDateText: "drowned by rising seas between about 14,000 and 7,000 years ago",
        datingMethod: "geological",
        chronology: "geological",
        evidence:
          "WHAT IS CLAIMED: an interval over which an area of lowland larger than India went under. HOW IT IS DATED: from the global sea-level curve applied to the shelf's bathymetry — the shelf is tectonically stable, which makes that a reasonable thing to do here and not everywhere. WHAT THIS RECORD DOES NOT CLAIM: anything about who lived there, what they remembered, or whether any surviving tradition describes it. NEEDS SOURCE VERIFICATION: the citation here is a tertiary reference and should be replaced with the primary literature.",
      },
    ],
  },

  {
    slug: "persian-gulf-oasis",
    title: "The Persian Gulf basin, and the oasis proposed to have been in it",
    summary:
      "The Gulf floor was dry land watered by four rivers, and flooded as the sea came in. That much is geography. That it held a long-lived human refuge is a proposal, and it is argued about in print.",
    description:
      "<p>The Persian Gulf is shallow. At lower sea levels its basin was dry, and the Tigris, Euphrates, Karun and Wadi Batin ran across it. The Indian Ocean came in as the sea rose, and the basin became the Gulf.</p>" +
      "<p><strong>Two claims, and they are not the same claim.</strong> That the basin was dry and then flooded is established. That it held a substantial human population for tens of thousands of years — a refuge whose displacement explains the settlements that appear around the Gulf shores afterwards — is a hypothesis put forward by Jeffrey Rose in 2010, published in a journal that prints peer commentary alongside its articles precisely so that disagreement is visible.</p>" +
      "<p>This record carries the second as a hypothesis and says so. It is not on this timeline as the answer to where Eden was, or Dilmun, or any flood tradition.</p>",
    category: "nature",
    subcategory: "Submerged landscape",
    eventType: "scientific_model",
    tags: ["submerged-landscape", "persian-gulf", "arabia", "sea-level"],
    locationName: "The Persian Gulf basin",
    motifs: ["rising_sea"],
    claims: [
      {
        sourceKey: "rose2010",
        startYear: bp(8000),
        datePrecision: "thousand_years",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "When the basin was flooded by the Indian Ocean",
        originalDateText: "flooded by the Indian Ocean around 8,000 years ago",
        datingMethod: "geological",
        chronology: "scientific",
        evidence:
          "WHAT IS CLAIMED: that the basin was inundated around 8,000 years ago as sea level rose. HOW IT IS DATED: from sea-level reconstruction against the basin's shallow bathymetry. This part of the paper is the uncontroversial part.",
      },
      {
        sourceKey: "rose2010",
        startYear: bp(8000),
        datePrecision: "thousand_years",
        isApproximate: true,
        temporalClaimType: "proposed_correlation",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The proposed displacement of a population from the basin",
        originalDateText: "the 'Gulf Oasis' refuge hypothesis",
        datingMethod: "archaeological",
        chronology: "hypothesis",
        evidence:
          "WHAT IS PROPOSED: that the basin held a demographic refuge over the Late Pleistocene and early Holocene, and that the settlements appearing around the Gulf shores from roughly 7,500 years ago are the people displaced when it flooded. WHY IT IS FILED AS A HYPOTHESIS RATHER THAN A FINDING: the argument runs from environmental reconstruction and the pattern of later settlement to a population nobody has excavated, because the sites, if they exist, are under water. WHAT WOULD TEST IT: submerged-landscape archaeology in the Gulf. NOT ESTABLISHED, and this record does not treat it as established.",
      },
    ],
  },

  {
    slug: "ngurunderi-backstairs-passage",
    title: "Ngurunderi, and the flooding of Backstairs Passage",
    summary:
      "A Ngarrindjeri account in which people walked to what is now Kangaroo Island, before Ngurunderi called up the water. The passage did submerge, between about 11,000 and 10,100 years ago.",
    description:
      "<p>In the Ngarrindjeri account, the ancestral being Ngurunderi pursued his wives and summoned the sea to flood the crossing, drowning them; the crossing had been walkable. Backstairs Passage, between the Fleurieu Peninsula and Kangaroo Island in South Australia, is water now.</p>" +
      "<p><strong>This is a living tradition of a living people, and it is not a data point.</strong> It is on this timeline because a published method has proposed reading it against the sea-level record, and that proposal is worth showing with its reasoning and its critics attached — not because a story has been mined for a date.</p>" +
      "<p>The two claims below are kept apart deliberately. One is when the water rose. The other is that this account remembers it. Only the first is a measurement.</p>",
    category: "culture",
    subcategory: "Coastal tradition",
    eventType: "traditional_account",
    tags: ["australia", "ngarrindjeri", "oral-tradition", "sea-level", "south-australia"],
    locationName: "Backstairs Passage, between the Fleurieu Peninsula and Kangaroo Island, South Australia",
    people: ["Ngurunderi"],
    civilisations: ["Ngarrindjeri"],
    // No boat, no chosen survivor, no end of humanity, no repopulation. The sea
    // rises and a crossing is lost. Marking more would be manufacturing a
    // parallel with Noah that the account does not contain.
    motifs: ["rising_sea"],
    claims: [
      {
        sourceKey: "ngurunderi2024",
        startYear: bp(11000),
        endYear: bp(10100),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "When Backstairs Passage was submerged",
        originalDateText: "submergence of Backstairs Passage, 11,000–10,100 cal BP",
        datingMethod: "geological",
        chronology: "geological",
        evidence:
          "WHAT IS CLAIMED: when the crossing between the Fleurieu Peninsula and Kangaroo Island went under. HOW IT IS DATED: the depth of the passage read against the local sea-level curve. WHAT IT ESTABLISHES: that there was a walkable crossing, and roughly when it stopped being one. WHAT IT DOES NOT ESTABLISH: that the Ngurunderi account is a memory of it. That is the separate claim below, and it is the contested one.",
      },
      {
        sourceKey: "nunn_reid2016",
        startYear: bp(11000),
        endYear: bp(10100),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "proposed_correlation",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The proposal that the account preserves a memory of that submergence",
        originalDateText: "proposed as a memory of the inundation, on the published dating method",
        datingMethod: "oral_tradition",
        chronology: "disputed",
        evidence:
          "WHAT IS PROPOSED: that this account preserves a memory of the crossing before it flooded, and therefore that the tradition has been carried for something over ten thousand years. HOW THE FIGURE IS REACHED: the water depth that would have to be removed for the story's detail to be literally true, read off the sea-level curve — the story is not dated, the LANDSCAPE IT DESCRIBES is dated. WHY IT IS FILED AS DISPUTED: most scientists are sceptical of oral transmission over this depth of time, and that scepticism is a position in the literature rather than a dismissal of the tradition. The proposal is careful and checkable; it is also not settled, and this record shows the argument rather than its outcome.",
      },
    ],
  },

  {
    slug: "narungga-spencer-gulf",
    title: "The Narungga account of Spencer Gulf as dry country",
    summary:
      "Marshy country and freshwater lagoons where Spencer Gulf is now, until the sea came in. The outer lip of the gulf lies about 50 metres down.",
    description:
      "<p>The Narungga of Yorke Peninsula, in South Australia, recall low-lying swampy country reaching inland where Spencer Gulf is now, dotted with freshwater lagoons that birds and animals gathered at. In the account, the land is opened and the sea gradually floods it.</p>" +
      "<p><strong>A different nation, a different account, and it stays a different record.</strong> The Narungga and the Ngarrindjeri are not the same people and these are not two versions of one story. Collapsing them into &ldquo;the Australian flood tradition&rdquo; would destroy the only thing a comparison is good for.</p>" +
      "<p>Note also the shape of it: the water rises gradually and floods low country. It is not a wave, not a punishment of humanity, and there is no ark.</p>",
    category: "culture",
    subcategory: "Coastal tradition",
    eventType: "traditional_account",
    tags: ["australia", "narungga", "oral-tradition", "sea-level", "south-australia"],
    civilisations: ["Narungga"],
    locationName: "Spencer Gulf and Yorke Peninsula, South Australia",
    motifs: ["rising_sea", "land_drained"],
    claims: [
      {
        sourceKey: "nunn_reid2016",
        startYear: bp(12000),
        datePrecision: "thousand_years",
        isApproximate: true,
        temporalClaimType: "proposed_correlation",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The proposal that the account describes the gulf before it filled",
        originalDateText: "if the account refers to the outer lip of the gulf, around 50 m below present sea level, about 12,000 years ago",
        datingMethod: "oral_tradition",
        chronology: "disputed",
        evidence:
          "WHAT IS PROPOSED: that the account describes Spencer Gulf before the sea entered it, and that the depth of the gulf's outer lip — about 50 metres below present sea level — puts that around 12,000 years ago. NOTE THE CONDITIONAL, WHICH IS THE PAPER'S OWN: the date follows IF the account refers to the outer lip rather than to somewhere shallower and later. A story about the head of the gulf would give a much younger figure. WHY IT IS FILED AS DISPUTED: as with the Ngurunderi record, the method is published and checkable and the depth of oral transmission it implies is not accepted by everyone.",
      },
    ],
  },

  {
    slug: "nunn-reid-dating-method",
    title: "A method for dating what a story describes, rather than the story",
    summary:
      "Twenty-one Australian accounts, each read for the water depth that would make it literally true, and that depth read off the sea-level curve. The answers run from 7,250 to 13,070 years ago.",
    description:
      "<p>The method published by Patrick Nunn and Nicholas Reid in 2016 does something more careful than it is usually reported as doing. It does not date stories. For each account it asks: how much water would have to be taken away for this to be a plain description of the place? Then it reads that depth off the established curve of post-glacial sea-level rise for that stretch of coast, and reports when the coast last looked like that.</p>" +
      "<p><strong>What that produces is a date for a landscape, and a hypothesis about a story.</strong> The landscape date is ordinary science. The step from there to &ldquo;this account has been transmitted since then&rdquo; is the contested one, and it is contested by people who are not dismissing the traditions — the question of how long oral transmission can carry specific content is a real open question and the honest answer is that nobody knows.</p>" +
      "<p>This record exists so that the method can be pointed at, criticised and reused, rather than appearing as an unexplained date on somebody else's story.</p>",
    category: "science",
    subcategory: "Method",
    eventType: "scientific_model",
    tags: ["method", "oral-tradition", "sea-level", "australia", "dating-conventions"],
    people: ["Patrick D. Nunn", "Nicholas J. Reid"],
    claims: [
      {
        sourceKey: "nunn_reid2016",
        startYear: bp(13070),
        endYear: bp(7250),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The span of inundations the twenty-one accounts are proposed to describe",
        originalDateText: "7,250 to 13,070 cal years BP, which the paper also gives as 5300–11,120 BC",
        datingMethod: "geological",
        chronology: "hypothesis",
        evidence:
          "WHAT IS CLAIMED: that twenty-one accounts from around the Australian coast describe coastlines last present between 13,070 and 7,250 years ago. HOW IT IS REACHED: water depth implied by each account, read off the local sea-level curve. A CONVERSION WORTH NOTICING: the paper also prints this range as 5300–11,120 BC, which is one year out from what this timeline stores. 13,070 minus 1,950 is 11,120, and that subtraction is the usual shortcut — but there is no year zero, so counting 13,070 years back from 1950 lands on 11,121 BCE. The gap is 1,949 years, not 1,950. At century precision the year makes no difference; it is recorded because the same slip made carelessly is what moves prehistoric events by two millennia. WHAT IS NOT ESTABLISHED: that oral transmission carried these accounts for that long. The range is the output of the method; whether the method's premise holds is the open question.",
      },
    ],
  },
];

export const FLOOD_SUBMERGED_LINKS: SeedEventLink[] = [
  {
    from: "storegga-tsunami",
    to: FLOOD_SUBMERGED_ANCHOR_SLUG,
    relation: "associated",
    viewpoint: "geological",
    sourceKey: "bondevik2003",
    note:
      "The tsunami struck the North Sea coasts near the end of Doggerland's inundation. They are regularly run together into one story about a continent destroyed by a wave; they are two events, and the slower one did most of the work.",
  },
  {
    from: "ngurunderi-backstairs-passage",
    to: "nunn-reid-dating-method",
    relation: "relevant",
    viewpoint: "hypothesis",
    sourceKey: "nunn_reid2016",
    note: "The proposed date on this account is an output of that method, and inherits every question about it.",
  },
  {
    from: "narungga-spencer-gulf",
    to: "nunn-reid-dating-method",
    relation: "relevant",
    viewpoint: "hypothesis",
    sourceKey: "nunn_reid2016",
    note: "Likewise — and this one carries an explicit conditional, because a shallower part of the gulf would give a much younger date.",
  },
];
