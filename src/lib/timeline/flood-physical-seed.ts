import { agoFrom, BP_REFERENCE_YEAR } from "./time";
import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

// =============================================================================
// PART A — THE PHYSICAL EVENTS
//
// The floods and sea-level changes that actually happened, dated by the rock
// and ice record, seeded BEFORE any tradition that might be compared with
// them. The order is deliberate: a physical event that exists only as the
// explanation for a story has already been bent to fit it.
//
// NOTHING HERE IS A FLOOD TRADITION, and nothing here is offered as the origin
// of one. Where somebody has proposed a connection, that proposal is a claim
// of its own with a name attached, made on the record it connects — never a
// line quietly drawn in this file.
//
// THE ARITHMETIC THIS FILE EXISTS TO GET RIGHT
//
// Every date below is published as "years before present", and the sciences
// fix "present" at 1950. So:
//
//     14,650 BP  =  1950 − 14,650  =  12,701 BCE
//
// NOT 14,650 BCE, which is 1,949 years earlier and a different world. That gap
// is the width of the entire Neolithic in the Near East, and an event moved by
// it can be made to line up with almost anything. Every claim here uses
// agoFrom(1950, …) rather than a hand-written BCE year, declares
// dateConvention: "before_present", and is checked by dating-conventions.test.
//
// AND ONE MORE CONVENTION TRAP, which caught this dataset during research.
// A RADIOCARBON age is not a calendar age. The Bonneville flood is widely
// quoted at "about 14,500 years ago"; that is its uncalibrated radiocarbon
// age, and the calendar age is roughly 17,400–18,000 years ago. Three thousand
// years, from a units mismatch. The record below carries the calibrated age
// and says where the other figure comes from.
//
// WHAT IS DELIBERATELY ABSENT: Lake Agassiz. Its drainage events are real and
// important, and the brief asks for them individually dated rather than merged
// into one flood — which is right, and is exactly why they are not here. The
// individual outburst chronology could not be verified to the standard the
// rest of this file meets, and a single merged "Lake Agassiz flood" would be
// the oversimplification the brief warns against. Recorded as an omission
// rather than filled with a placeholder.
// =============================================================================

/** Years before present, on the 1950 convention the sources use. */
const bp = (yearsAgo: number): number => agoFrom(BP_REFERENCE_YEAR, yearsAgo);

export const FLOOD_PHYSICAL_ANCHOR_SLUG = "meltwater-pulse-1a";

export const FLOOD_PHYSICAL_TRACK: SeedTrack = {
  name: "Ice age floods and sea level",
  slug: "ice-age-floods",
  kind: "theme",
  color: "#2f6f8f",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const FLOOD_PHYSICAL_SOURCES: SeedSource[] = [
  {
    key: "clark2009",
    title: "The Last Glacial Maximum",
    author: "P. U. Clark and others",
    workTitle: "Science",
    reference: "Science 325, 710–714 (2009); doi:10.1126/science.1172873",
    url: "https://www.science.org/doi/10.1126/science.1172873",
    sourceType: "academic_paper",
    publishedYear: 2009,
    publishedDisplay: "2009",
    notes:
      "The synthesis this record's dates come from: 5,704 radiocarbon, beryllium-10 and helium-3 ages compiled to constrain when the ice sheets stood at their maximum. Cited for the interval 26,500–19,000 years ago and for sea level 120–135 m below today's.",
  },
  {
    key: "deschamps2012",
    title: "Ice-sheet collapse and sea-level rise at the Bølling warming 14,600 years ago",
    author: "P. Deschamps and others",
    workTitle: "Nature",
    reference: "Nature 483, 559–564 (2012)",
    sourceType: "academic_paper",
    publishedYear: 2012,
    publishedDisplay: "2012",
    notes:
      "Drilled coral records from Tahiti, and the study that fixed Meltwater Pulse 1A at 14,650 years ago: a 14–18 m rise in global sea level in less than 350 years. Cited for the timing and the magnitude.",
  },
  {
    key: "tahiti2023",
    title: "Meltwater Pulse 1a drowned fringing reefs around Tahiti 15 000 years ago",
    workTitle: "Royal Society Open Science",
    reference: "R. Soc. Open Sci. (2023), article 230918",
    url: "https://royalsocietypublishing.org/doi/10.1098/rsos.230918",
    sourceType: "academic_paper",
    publishedYear: 2023,
    publishedDisplay: "2023",
    notes:
      "A later reading of the same Tahitian reefs, revising the magnitude downwards to 13.8 ± 1.3 m and placing the onset earlier. Cited as a second measurement rather than a correction of the first — both are on the record, because that is what the literature contains.",
  },
  {
    key: "rasmussen2014",
    title: "A stratigraphic framework for abrupt climatic changes during the Last Glacial period",
    author: "S. O. Rasmussen and others",
    workTitle: "Quaternary Science Reviews",
    reference: "The GICC05 Greenland ice-core chronology",
    sourceType: "academic_paper",
    publishedYear: 2014,
    publishedDisplay: "2014",
    notes:
      "The Greenland ice-core timescale the Younger Dryas boundaries are counted on — layer-counted, and quoted as accurate to within 20–40 years across this interval. Cited for the chronology rather than for any interpretation of it.",
  },
  {
    key: "ydtiming2020",
    title: "Timing and structure of the Younger Dryas event and its underlying climate dynamics",
    workTitle: "Proceedings of the National Academy of Sciences",
    reference: "PNAS (2020); doi:10.1073/pnas.2007869117",
    url: "https://www.pnas.org/doi/10.1073/pnas.2007869117",
    sourceType: "academic_paper",
    publishedYear: 2020,
    publishedDisplay: "2020",
    notes:
      "Cited for the structure of the transition and for how much the onset date varies between Greenland cores — a spread of roughly 12,650 to 12,950 years ago, which is the honest width of a figure usually quoted as a round 12,900.",
  },
  {
    key: "bard2010",
    title: "Deglacial Meltwater Pulse 1B and Younger Dryas Sea Levels Revisited with Boreholes at Tahiti",
    author: "E. Bard, B. Hamelin and D. Delanghe-Sabatier",
    workTitle: "Science",
    reference: "Science 327, 1235–1237 (2010); doi:10.1126/science.1180557",
    url: "https://www.science.org/doi/10.1126/science.1180557",
    sourceType: "academic_paper",
    publishedYear: 2010,
    publishedDisplay: "2010",
    notes:
      "The Tahiti boreholes, which find no detectable acceleration where Meltwater Pulse 1B was proposed. Cited for the negative result, which is half of a genuine scientific disagreement and is usually the half left out.",
  },
  {
    key: "gbr2025",
    title: "Constraints on sea-level rise during meltwater pulse 1B from the Great Barrier Reef",
    workTitle: "Nature Communications",
    url: "https://www.nature.com/articles/s41467-025-59858-0",
    sourceType: "academic_paper",
    publishedYear: 2025,
    publishedDisplay: "2025",
    notes:
      "A third far-field record, consistent with Tahiti rather than with Barbados. Cited because the weight of evidence matters as much as its existence, and this is where it currently sits.",
  },
  {
    key: "waitt1983",
    title: "Tens of successive, colossal Missoula floods at north and east margins of channeled scabland",
    author: "R. B. Waitt",
    publisher: "U.S. Geological Survey",
    reference: "USGS Open-File Report 83-671",
    url: "https://pubs.usgs.gov/publication/ofr83671",
    sourceType: "government",
    publishedYear: 1983,
    publishedDisplay: "1983",
    notes:
      "The rhythmically bedded sediments that establish MANY floods rather than one — the single most important fact about the Missoula floods, and the one popular accounts most often drop.",
  },
  {
    key: "missoula2024",
    title: "The timing of Missoula floods: Implications for the age of Grand Coulee (eastern Washington, USA)",
    workTitle: "Geology",
    reference: "Geology 52(12), 875 (2024)",
    url: "https://pubs.geoscienceworld.org/gsa/geology/article/52/12/875/648331/The-timing-of-Missoula-floods-Implications-for-the",
    sourceType: "academic_paper",
    publishedYear: 2024,
    publishedDisplay: "2024",
    notes: "Recent dating of scabland inundation, cited for the timing of the flooding episodes rather than for their number.",
  },
  {
    key: "oviatt_bonneville",
    title: "The Missoula and Bonneville floods — a review of ice-age megafloods in the Columbia River basin",
    author: "J. E. O'Connor, V. R. Baker and others",
    reference: "Earth-Science Reviews; and J. O. Oviatt's radiocarbon chronology of Lake Bonneville",
    url: "https://archimer.ifremer.fr/doc/00624/73634/73074.pdf",
    sourceType: "academic_paper",
    publishedYear: 2020,
    publishedDisplay: "2020",
    notes:
      "Cited for the calibrated age of the Bonneville flood — about 18,000 years ago on Oviatt's 2015 reading, revised to roughly 17,500 ± 500 calendar years — and for the flood's discharge. Also the source of the correction this record carries: the widely quoted \"14,500 years ago\" is a RADIOCARBON age, not a calendar one.",
  },
];

// ---------------------------------------------------------------------------
// The records
// ---------------------------------------------------------------------------

export const FLOOD_PHYSICAL_EVENTS: SeedEvent[] = [
  {
    slug: "last-glacial-maximum-landscapes",
    title: "The Last Glacial Maximum, and the land that was above water",
    summary:
      "For several thousand years the ice sheets stood at their greatest extent and the sea was 120–135 metres lower than today. Continental shelves all over the world were dry land.",
    description:
      "<p>This record is context rather than an event, and it is the context everything else on this timeline depends on. With that much water held in ice, coastlines sat far out from where they are now: the North Sea was a plain, the Persian Gulf was a valley, Sundaland was continuous land, and Australia and New Guinea were one continent.</p>" +
      "<p>Those landscapes were habitable, and in many cases were inhabited. They are now under water. That is a fact about sea level, established from the rock record — <strong>not</strong> in itself a flood, and not in itself the memory behind any story. What it does establish is that the postglacial world lost an enormous amount of coastal land, slowly, over thousands of years.</p>",
    category: "nature",
    subcategory: "Ice age",
    eventType: "scientific_model",
    tags: ["ice-age", "sea-level", "glacial", "context"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Pleistocene_north_ice_map.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Pleistocene_north_ice_map.jpg?width=1024",
        shows: "map",
        caption:
          "The maximum extent of northern-hemisphere ice during the Pleistocene. A MAP IS AN ARGUMENT: the ice " +
          "margins are reconstructed from the landforms and deposits the ice left behind, they did not all " +
          "stand at their maximum on the same date, and a single clean line is a drawing convention rather than " +
          "a shoreline anybody saw.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "clark2009",
        startYear: bp(26_500),
        endYear: bp(19_000),
        datePrecision: "thousand_years",
        precisionDecimals: 1,
        isApproximate: true,
        temporalClaimType: "geological_date",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The interval when the ice sheets stood at their maximum extent",
        originalDateText: "26,500 to 19,000 years ago",
        datingMethod: "radiometric",
        chronology: "geological",
        evidence:
          "WHAT IS CLAIMED: that nearly all ice sheets held their maximum positions between about 26,500 and 19,000 years ago. HOW IT IS DATED: a compilation of 5,704 radiocarbon, beryllium-10 and helium-3 ages, which is why the interval has edges rather than a single number. WHAT IT ESTABLISHES: the timing of the maximum, and with it a sea level 120–135 metres below today's. WHAT IT DOES NOT ESTABLISH: anything about any tradition. This is the baseline against which later inundation is measured.",
        notes:
          "IN CALENDAR TERMS this is roughly 24,600 to 17,100 BCE — worth stating because the difference between the two ways of writing it is nearly two thousand years, and that is the width of the error this dataset is built to avoid.",
      },
    ],
  },
  {
    slug: "late-glacial-deglaciation",
    title: "Deglaciation: the long drowning of the coasts",
    summary:
      "Roughly ten thousand years in which the ice retreated, the sea rose about 120 metres, coastlines moved inland, glacial lakes formed and drained, and entire inhabited landscapes went under.",
    description:
      "<p>A context record, not a flood. The sea did not rise in one event: it rose over millennia, unevenly, with rapid episodes inside a long trend. Some of those episodes are on this timeline as records of their own — Meltwater Pulse 1A, the Missoula floods, the Bonneville flood — and they are the exceptions rather than the pattern.</p>" +
      "<p>The pattern was slow enough to be lived through and fast enough to be noticed within a lifetime in some places: metres of shoreline retreat in a generation, on a low-gradient coast. Whether any human account preserves a memory of it is a separate question, asked on the records of those accounts and not here.</p>",
    category: "nature",
    subcategory: "Ice age",
    eventType: "scientific_model",
    tags: ["ice-age", "sea-level", "deglaciation", "context"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Post-Glacial_Sea_Level.png?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Post-Glacial_Sea_Level.png?width=1024",
        shows: "diagram",
        caption:
          "Sea level across the last twenty-two thousand years, compiled from several published records. This " +
          "curve is why coastal drowning stories have something physical to be about. It is also a compilation: " +
          "the scatter between the underlying data sets has been smoothed into one line, and the line is smoother " +
          "than the evidence.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "clark2009",
        startYear: bp(20_000),
        endYear: bp(10_000),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        temporalClaimType: "estimated_range",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The broad interval of deglaciation and postglacial sea-level rise",
        originalDateText: "roughly 20,000 to 10,000 years ago",
        datingMethod: "radiometric",
        chronology: "geological",
        evidence:
          "WHAT IS CLAIMED: a broad interval, not an event. Ice sheets retreated, sea level rose by something near 120 metres, and coastlines moved inland across every continental shelf. HOW IT IS DATED: from the same body of radiometric and sea-level evidence that dates the maximum, read as a trend rather than as a moment. IMPORTANT LIMITATION: giving this a start and an end is a convenience of drawing. Deglaciation had no single beginning and did not finish everywhere at once, and the edges of this range are conventional.",
      },
    ],
  },
  {
    slug: FLOOD_PHYSICAL_ANCHOR_SLUG,
    title: "Meltwater Pulse 1A",
    summary:
      "The fastest sea-level rise of the deglaciation: somewhere between 14 and 18 metres in under 350 years, about 14,650 years ago — which is about 12,700 BCE, not 14,650 BCE.",
    description:
      "<p>The clearest case on this timeline of a genuinely rapid, genuinely global rise in sea level. Coral reefs drowned; shorelines moved inland fast enough that the movement is visible in the sediment.</p>" +
      "<p>It is also the record where the arithmetic matters most. The figure is published as <em>years before present</em>, and in the sciences &ldquo;present&rdquo; is fixed at 1950. So 14,650 years ago is about 12,700 BCE. Written as &ldquo;14,650 BCE&rdquo; it lands 1,949 years too early — and a tradition placed near it would appear to correlate with something it does not.</p>" +
      "<p>Two measurements are held here rather than one, because two exist.</p>",
    category: "nature",
    subcategory: "Sea level",
    eventType: "scientific_model",
    tags: ["sea-level", "meltwater-pulse", "deglaciation", "coral"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Post-Glacial_Sea_Level.png?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Post-Glacial_Sea_Level.png?width=1024",
        shows: "scientific_figure",
        caption:
          "Sea level since the Last Glacial Maximum, compiled from many separate studies. Meltwater Pulse 1A is " +
          "the steep step near 14,000 years before present \u2014 and the horizontal axis is in YEARS BEFORE " +
          "PRESENT, where present is 1950, which is the whole reason this record carries the conversion rather " +
          "than a BCE figure.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "deschamps2012",
        startYear: bp(14_650),
        datePrecision: "thousand_years",
        precisionDecimals: 2,
        isApproximate: true,
        temporalClaimType: "radiometric_date",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The onset of the rapid sea-level rise, as dated from Tahitian corals in 2012",
        originalDateText: "14,650 years ago",
        datingMethod: "radiometric",
        chronology: "scientific",
        evidence:
          "WHAT IS CLAIMED: a rise in global mean sea level of 14–18 metres in less than 350 years, beginning about 14,650 years ago at the Bølling warming. HOW IT IS DATED: uranium-thorium ages on corals from drilled reef cores at Tahiti, a far-field site chosen because it is far from the ice sheets and so records the global signal rather than a local one. WHAT IT ESTABLISHES: that sea level really can rise many metres within a few human lifetimes. WHAT IT DOES NOT ESTABLISH: any connection to any tradition. Nothing in a coral core mentions people.",
        notes:
          "THE CONVERSION, SPELLED OUT: 1950 − 14,650 = 12,701 BCE. The same numerals read as a BCE year would put this at 14,650 BCE, which is 1,949 years too early.",
      },
      {
        sourceKey: "tahiti2023",
        startYear: bp(14_950),
        datePrecision: "thousand_years",
        precisionDecimals: 2,
        isApproximate: true,
        temporalClaimType: "radiometric_date",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The onset of the rapid sea-level rise, as re-read from the same reefs in 2023",
        originalDateText: "about 300 years earlier than the 2012 reading, from the same Tahitian reefs",
        datingMethod: "radiometric",
        chronology: "scientific",
        evidence:
          "THE SAME REEFS, READ AGAIN, and a different answer: a smaller rise of 13.8 ± 1.3 metres, beginning roughly three centuries earlier than the 2012 study placed it. HOW IT IS DATED: the same uranium-thorium method on the same Tahitian reef system, with more cores and a reconsideration of which reef surfaces record what. WHY BOTH ARE HERE: because both are in the literature, and a timeline that quietly kept only the newer one would teach that measurements arrive finished. The two agree on everything that matters to a reader — a large, fast, global rise in the middle of the deglaciation — and differ on exactly when it started and by how much.",
        notes:
          "NEEDS SOURCE VERIFICATION for the precise onset figure: the paper is clear that the onset is earlier and the magnitude smaller, and this record stores 14,950 years ago as the approximate result of \"about 300 years earlier\". A reader wanting the exact published figure should go to the paper rather than trusting this subtraction.",
      },
    ],
  },
  {
    slug: "younger-dryas-onset",
    title: "The Younger Dryas begins",
    summary:
      "An abrupt return to near-glacial cold, within decades, about 12,900 years ago. Established. What caused it is not.",
    description:
      "<p>One of the sharpest climate transitions in the record: the North Atlantic region cooled sharply and stayed cold for more than a thousand years, and the change is visible in Greenland ice as a step rather than a slope.</p>" +
      "<p><strong>Three things are kept apart on this record, and conflating them is the commonest error in this whole subject:</strong></p>" +
      "<ul><li><strong>Established</strong> — that an abrupt cooling happened, and roughly when.</li>" +
      "<li><strong>Debated</strong> — the Younger Dryas Impact Hypothesis, which proposes an extraterrestrial airburst or impact as the trigger. It is argued in the literature, by named researchers, and is not settled either way.</li>" +
      "<li><strong>Speculative</strong> — proposed connections to Atlantis or to global flood traditions. These are claims about stories, made mostly outside the geological literature, and they belong on the records of those stories with the names of the people making them.</li></ul>" +
      "<p>This record seeds only the first. The others are not dismissed; they are simply different claims, and merging them would present a contested cause and an unevidenced correlation with the authority of a measured date.</p>",
    category: "nature",
    subcategory: "Climate",
    eventType: "scientific_model",
    tags: ["younger-dryas", "climate", "abrupt-change", "ice-core"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dryas_octopetala_-_Reinrose.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Dryas_octopetala_-_Reinrose.jpg?width=1024",
        shows: "evidence_photograph",
        caption:
          "Dryas octopetala, the mountain avens, alive in northern Norway. The cold period is named after this " +
          "plant because its pollen returns in European sediment cores at the point the warming reverses. THIS " +
          "PLANT IS NOT THAT EVIDENCE \u2014 the evidence is pollen in a core, and the name is a naturalists' " +
          "convention attached to it.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "rasmussen2014",
        startYear: bp(12_870),
        uncertaintyPlus: 30,
        uncertaintyMinus: 30,
        datePrecision: "thousand_years",
        precisionDecimals: 2,
        isApproximate: false,
        temporalClaimType: "geological_date",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The onset of Younger Dryas cooling, on the layer-counted Greenland chronology",
        originalDateText: "12,870 ± 30 years ago (NGRIP, GICC05)",
        datingMethod: "other",
        chronology: "scientific",
        evidence:
          "WHAT IS CLAIMED: the start of the cooling, placed on the GICC05 timescale. HOW IT IS DATED: by counting annual layers in the Greenland ice, which is why the stated error is decades rather than centuries — the chronology is quoted as accurate to within 20–40 years across this interval. WHAT IT ESTABLISHES: that the transition was abrupt and roughly when it was. WHAT IT DOES NOT ESTABLISH: what caused it.",
        notes: "About 10,920 BCE in calendar terms.",
      },
      {
        sourceKey: "ydtiming2020",
        startYear: bp(12_950),
        endYear: bp(12_650),
        datePrecision: "thousand_years",
        precisionDecimals: 2,
        isApproximate: true,
        temporalClaimType: "estimated_range",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The spread of onset dates across different Greenland ice cores",
        originalDateText: "between about 12,950 and 12,650 years ago, depending on the core",
        datingMethod: "other",
        chronology: "scientific",
        evidence:
          "THE HONEST WIDTH OF A NUMBER USUALLY QUOTED AS A ROUND 12,900. Different Greenland cores put the onset at different points across a roughly three-hundred-year spread, and the transition itself was not instantaneous. Stored as its own claim rather than folded into an error bar, because the spread is between records rather than within one measurement — a different kind of uncertainty, and one a reader should be able to see.",
      },
    ],
  },
  {
    slug: "younger-dryas-termination",
    title: "The Younger Dryas ends, and the Holocene begins",
    summary:
      "About 11,700 years ago, warming as abrupt as the cooling had been — and the formal start of the epoch we are still in.",
    description:
      "<p>The Younger Dryas ended as sharply as it began. This transition is the formal base of the Holocene, and it is one of the best-dated moments in the whole Quaternary record because it is counted in annual ice layers rather than estimated.</p>" +
      "<p>It is also, in calendar terms, near some calculations of Plato's Atlantis chronology. That proximity is worth noticing and is not evidence of anything: two dates being close is a fact about arithmetic, and becomes a claim about history only when somebody argues for it. Where anyone has, the argument sits on its own record with their name on it.</p>",
    category: "nature",
    subcategory: "Climate",
    eventType: "scientific_model",
    tags: ["younger-dryas", "holocene", "climate", "ice-core"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/TempAndSnowAccumulation_GISP2_Alley2000-en.svg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/TempAndSnowAccumulation_GISP2_Alley2000-en.svg?width=1024",
        shows: "scientific_figure",
        caption:
          "Central Greenland temperature and snow accumulation from the GISP2 ice core. The step at the end of " +
          "the Younger Dryas is where the Holocene is defined to begin. It is one core from one ice sheet: the " +
          "date is sharp because the annual layers can be counted, not because the whole planet turned at once.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "rasmussen2014",
        startYear: bp(11_700),
        datePrecision: "thousand_years",
        precisionDecimals: 2,
        isApproximate: true,
        temporalClaimType: "geological_date",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The end of the Younger Dryas and the base of the Holocene",
        originalDateText: "about 11,700 years ago",
        datingMethod: "other",
        chronology: "scientific",
        evidence:
          "WHAT IS CLAIMED: the transition out of Younger Dryas conditions, which is the formal base of the Holocene epoch. HOW IT IS DATED: layer counting in the Greenland ice cores on the GICC05 chronology. WHAT IT ESTABLISHES: a well-constrained date for a major climatic transition. WHAT IT DOES NOT ESTABLISH: that anything else dated near it is connected to it.",
        notes:
          "About 9,750 BCE in calendar terms. Conventional calculations of Plato's Atlantis date land near 9,600 BCE — a proximity of roughly a century and a half. That is a chronological observation, recorded here as one, and it is not an identification.",
      },
    ],
  },
  {
    slug: "meltwater-pulse-1b",
    title: "Meltwater Pulse 1B — proposed, and contested",
    summary:
      "A second rapid sea-level rise around 11,300 years ago, clear in the Barbados corals and absent from Tahiti and the Great Barrier Reef. A live scientific disagreement, seeded as one.",
    description:
      "<p>Unlike Meltwater Pulse 1A, this one may not have happened — or may have been regional rather than global. The far-field coral records that should agree do not.</p>" +
      "<p>This record exists because a disagreement between good measurements is exactly what this timeline is for. There is no verdict here, and there is no averaging: the claims sit side by side with the evidence for each, and the current weight of evidence is stated plainly rather than hidden.</p>",
    category: "nature",
    subcategory: "Sea level",
    eventType: "disputed",
    eventTypeNote:
      "Disputed in the ordinary scientific sense: competent researchers reading different records reach different conclusions, and the question is open.",
    tags: ["sea-level", "meltwater-pulse", "disputed", "coral"],
    claims: [
      {
        sourceKey: "bard2010",
        startYear: bp(11_450),
        endYear: bp(11_100),
        datePrecision: "thousand_years",
        precisionDecimals: 2,
        isApproximate: true,
        temporalClaimType: "proposed_correlation",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The interval proposed for Meltwater Pulse 1B from the Barbados corals",
        originalDateText: "11,450 to 11,100 years ago (as proposed from Barbados)",
        datingMethod: "radiometric",
        chronology: "hypothesis",
        evidence:
          "WHAT IS PROPOSED: a rise of 14 ± 2 metres between about 11,450 and 11,100 years ago, at rates reaching 40 mm per year, from uranium-thorium ages on Barbados corals. WHY IT IS FILED AS A PROPOSAL rather than a measurement of an event: the event's existence is what is in question. WHAT THE OTHER RECORDS SAY: Tahiti boreholes find no detectable acceleration across this interval, and Great Barrier Reef data agree with Tahiti rather than with Barbados.",
        notes:
          "The source cited here is the Tahiti study, which reports the negative result and describes the Barbados proposal it tests. The Barbados coral work should be cited directly before this claim is presented as that team's own statement — NEEDS SOURCE VERIFICATION for the primary Barbados publication.",
      },
    ],
  },
  {
    slug: "missoula-floods",
    title: "The Missoula floods — dozens of them, not one",
    summary:
      "An ice dam that failed and reformed again and again, sending forty or more catastrophic floods across eastern Washington. The number is the point.",
    description:
      "<p>Glacial Lake Missoula was held back by a lobe of the ice sheet. The dam failed, the lake emptied catastrophically across the Columbia Basin, the ice advanced again, and the lake refilled — over and over.</p>" +
      "<p><strong>Forty or more separate floods, not one.</strong> The rhythmically bedded flood sediments record them individually, and the mean interval between them was a few decades. This matters because a single colossal flood is the version that gets retold, and the evidence says something different and more interesting: a landscape repeatedly swept, within the span of a few human lifetimes.</p>",
    category: "nature",
    subcategory: "Megaflood",
    eventType: "scientific_model",
    tags: ["megaflood", "glacial-lake", "scablands", "north-america"],
    locationName: "Columbia Basin, eastern Washington",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Channeled_Scablands.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Channeled_Scablands.jpg?width=1024",
        shows: "evidence_photograph",
        caption:
          "The Channeled Scablands of eastern Washington: bare basalt stripped of its soil, cut into channels " +
          "far larger than any river now there. This landscape is the evidence, and J Harlen Bretz's reading of " +
          "it was rejected for forty years before the floods were accepted.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/DryFalls_WA.jpg?width=1024",
        shows: "evidence_photograph",
        caption:
          "Dry Falls, where a waterfall several times the width of Niagara once ran and now stands empty. The " +
          "scale of the plunge pool is one of the measurements the flood discharge is reconstructed from.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "waitt1983",
        startYear: bp(18_200),
        endYear: bp(14_000),
        datePrecision: "thousand_years",
        precisionDecimals: 1,
        isApproximate: true,
        temporalClaimType: "estimated_range",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The interval over which the repeated Missoula floods occurred",
        originalDateText: "the floods fall between about 18,200 and 14,000 years ago",
        datingMethod: "stratigraphic",
        chronology: "geological",
        evidence:
          "WHAT IS CLAIMED: not one flood but a sequence of them across this interval. HOW IT IS DATED: rhythmically bedded slackwater sediments, tephra layers, radiocarbon ages and varve counts — the beds are what establish that the floods were separate events rather than one. WHAT IT ESTABLISHES: forty or more catastrophic outburst floods, with a mean interval of roughly four decades between them. WHAT IT DOES NOT ESTABLISH: any single datable catastrophe to which a story could be anchored, which is precisely why the number is on the record.",
        citations: [
          {
            sourceKey: "missoula2024",
            relation: "supports",
            note: "Recent dating of scabland inundation, narrowing when the flooding episodes occurred.",
          },
        ],
      },
    ],
  },
  {
    slug: "bonneville-flood",
    title: "The Bonneville flood",
    summary:
      "Lake Bonneville breached its outlet at Red Rock Pass and released some 5,300 cubic kilometres of water — about 17,500 years ago, not the 14,500 usually quoted.",
    description:
      "<p>A single enormous outburst, unlike the repeated Missoula floods: the lake overtopped a divide in southeastern Idaho, the outlet cut down catastrophically, and the flood ran down the Snake River.</p>" +
      "<p><strong>This record carries a correction worth reading.</strong> The flood is very often given as &ldquo;about 14,500 years ago&rdquo;. That figure is its <em>radiocarbon</em> age — 14,500 radiocarbon years — and radiocarbon years are not calendar years. Calibrated, the same evidence puts the flood at roughly 17,400 to 18,000 years ago. The gap is about three thousand years, and it comes entirely from mixing two dating conventions.</p>" +
      "<p>It is the same category of error as reading &ldquo;14,600 years ago&rdquo; as &ldquo;14,600 BCE&rdquo;, and it is why every claim on this timeline records the convention its figure came out of.</p>",
    category: "nature",
    subcategory: "Megaflood",
    eventType: "scientific_model",
    tags: ["megaflood", "glacial-lake", "north-america", "dating-conventions"],
    locationName: "Red Rock Pass, Idaho, and the Snake River",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Map_of_Lake_Bonneville.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Map_of_Lake_Bonneville.jpg?width=1024",
        shows: "map",
        caption:
          "Lake Bonneville at its highest stand, of which the Great Salt Lake is the remnant. The flood left by " +
          "way of Red Rock Pass in southeastern Idaho, at the northern end.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "oviatt_bonneville",
        startYear: bp(17_500),
        uncertaintyPlus: 500,
        uncertaintyMinus: 500,
        datePrecision: "thousand_years",
        precisionDecimals: 1,
        isApproximate: true,
        temporalClaimType: "radiometric_date",
        dateConvention: "before_present",
        conventionReferenceYear: BP_REFERENCE_YEAR,
        whatIsDated: "The Bonneville flood, in calibrated calendar years",
        originalDateText: "about 17,500 ± 500 calendar years ago",
        datingMethod: "radiocarbon",
        chronology: "geological",
        evidence:
          "WHAT IS CLAIMED: the catastrophic breach of Lake Bonneville's outlet at Red Rock Pass, discharging roughly 5,300 cubic kilometres of water with a peak flow near one sverdrup. HOW IT IS DATED: radiocarbon chronology of the lake's shorelines and deposits, CALIBRATED to calendar years. Oviatt's 2015 reading gives about 18,000 years ago with an uncertainty of several hundred; a 2020 revision gives roughly 17,500 ± 500. THE CORRECTION THIS CLAIM CARRIES: the commonly quoted \"14,500 years ago\" is the uncalibrated radiocarbon age of the same event. Radiocarbon years and calendar years diverge by about three thousand years at this depth, and quoting the raw radiocarbon figure as a calendar date moves the flood by that much.",
        notes:
          "Roughly 15,550 BCE. The point of this record on a flood timeline is not the flood: it is that a widely repeated date for it is in the wrong units, and nothing on the surface of the number says so.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// The relationships
//
// Physical events relate to each other by cause and sequence. NOTHING here
// links a physical event to a tradition: those links are claims somebody makes,
// and they will arrive with names attached when the traditions do.
// ---------------------------------------------------------------------------

export const FLOOD_PHYSICAL_LINKS: SeedEventLink[] = [
  {
    from: "last-glacial-maximum-landscapes",
    to: "late-glacial-deglaciation",
    relation: "precedes",
    viewpoint: "geological",
    sourceKey: "clark2009",
    note: "The maximum is the state the deglaciation undid. One is the baseline for the other, and the sea-level figures on both come from the same body of evidence.",
  },
  {
    from: "late-glacial-deglaciation",
    to: FLOOD_PHYSICAL_ANCHOR_SLUG,
    relation: "source_of",
    viewpoint: "geological",
    sourceKey: "deschamps2012",
    note: "Meltwater Pulse 1A is an episode WITHIN the deglaciation, not a separate phenomenon — the fastest part of a long rise rather than an event that interrupted it.",
  },
  {
    from: FLOOD_PHYSICAL_ANCHOR_SLUG,
    to: "younger-dryas-onset",
    relation: "precedes",
    viewpoint: "geological",
    sourceKey: "rasmussen2014",
    note:
      "Ordering only. Meltwater pulses and the Younger Dryas are both discussed in connection with freshwater forcing of ocean circulation, but this edge asserts sequence and nothing else — a causal claim would need its own source and does not have one here.",
  },
  {
    from: "younger-dryas-onset",
    to: "younger-dryas-termination",
    relation: "precedes",
    viewpoint: "geological",
    sourceKey: "rasmussen2014",
    note: "The two ends of the same interval, both counted on the same layer-counted chronology.",
  },
  {
    from: "younger-dryas-termination",
    to: "meltwater-pulse-1b",
    relation: "precedes",
    viewpoint: "geological",
    sourceKey: "bard2010",
    note: "The proposed pulse falls after the Younger Dryas ends. The Tahiti study that questions its existence examined this interval specifically.",
  },
  {
    from: "bonneville-flood",
    to: "missoula-floods",
    relation: "related",
    viewpoint: "geological",
    sourceKey: "waitt1983",
    note:
      "Two different kinds of megaflood in the same region and roughly the same interval: Bonneville once, Missoula dozens of times. Linked as worth reading together and explicitly not as one event — between twenty and thirty Missoula floods came after the single Bonneville flood.",
  },
  {
    from: "missoula-floods",
    to: "late-glacial-deglaciation",
    relation: "relevant",
    viewpoint: "geological",
    sourceKey: "waitt1983",
    note:
      "Outburst floods are a feature of a deglaciating landscape — ice dams exist only while there is ice to dam with. Relevant to the deglaciation and not evidence about global sea level, which they barely affected.",
  },
];
