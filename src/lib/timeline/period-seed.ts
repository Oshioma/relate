import { astronomicalFromYearsAgo } from "./time";
import type { SeedPeriod, SeedPeriodLink, SeedSource } from "./seed-types";

// FIFTEEN NAMED STRETCHES OF TIME, AND WHO SAYS SO.
//
// A period is the frame every event on the strip is read against, which makes
// it the most dangerous thing on a timeline: "Bronze Age" printed across a band
// looks like a fact about the world, and a reader who has never been told
// otherwise will take it as one. It is not. It is four different things wearing
// one word, and this file's whole job is to keep them apart:
//
//   FORMAL SCIENTIFIC — the Mesozoic. Its base is a marker in a named rock
//   section that a standards body ratified, and its date moves when that marker
//   is re-dated. There is a right answer and a body that gives it.
//
//   ARCHAEOLOGICAL — the Bronze Age. A convention for a material pattern,
//   beginning at different times in different places, drawn differently by
//   different regional traditions. Nobody ratifies it and nobody could.
//
//   HISTORICAL — "Medieval". A convention of historians with an origin in one
//   region's history, applied far beyond it, and argued about for that reason.
//
//   TEACHING UMBRELLA — "Early human ancestors". A span grouped to make it
//   teachable. No discipline recognises it. This file invented several of them
//   and says so on each one.
//
// WHAT THE DESCRIPTIONS MAY AND MAY NOT SAY. The Mesozoic entry does not say
// dinosaurs dominated the Earth. It says that the mainstream palaeontological
// reading of the fossil and geological record is that dinosaurs were a major
// and diverse group of terrestrial vertebrates through much of it — which is
// what is actually known, by whom, from what. The difference is not pedantry
// and it is not doubt-mongering: a reader who cannot see where the evidence
// stops and the reconstruction starts has not been taught the subject, only its
// conclusions.
//
// So every period carries three fields that are kept separate on purpose:
// `evidence` (what has been dug up or measured), `interpretation` (what that is
// taken to mean, and by which discipline), and `framework` (whose reading this
// is). Collapsing them is exactly how a reconstruction turns into a fact.
//
// AND EVERY BOUNDARY IS A CLAIM. Not one date per period — one row per source,
// per region, per discipline, with the method that produced it. The Iron Age
// below has six regional boundary claims and no universal one, because there
// isn't one. The Paleozoic has its base and its top as separate claims, because
// that is how the International Commission on Stratigraphy defines them: two
// different rock sections, two different measurements, two different
// uncertainties.
//
// RULES, THE SAME ONES THE OTHER SEED FILES FOLLOW. Nothing invented: every
// citation is a real publication with details checked against the publisher,
// and a DOI appears only where it was verified. Where a date could not be
// verified it is not here. No confidence scores — not a column, not a word.

/** Billions of years ago → astronomical year. */
const Ga = (billions: number): number => astronomicalFromYearsAgo(billions * 1_000_000_000);
/** Millions of years ago → astronomical year. */
const Ma = (millions: number): number => astronomicalFromYearsAgo(millions * 1_000_000);
/** Thousands of years ago → astronomical year. */
const ka = (thousands: number): number => astronomicalFromYearsAgo(thousands * 1000);
/** A BCE year in astronomical numbering: 1 BCE = 0, 2 BCE = −1. */
const bce = (year: number): number => 1 - year;

/** The period every community gets first, used to decide whether the set is already here. */
export const PERIODS_ANCHOR_SLUG = "mesozoic-era";

// ---------------------------------------------------------------------------
// Sources
//
// Weighted the way the brief asks: the standards body for geological
// chronology, peer-reviewed papers for specific dated evidence, museums and
// major reference works for the periodisation CONVENTIONS — which is the right
// kind of source for them, because a convention is not a discovery and there is
// no paper that established it.
// ---------------------------------------------------------------------------

export const PERIOD_SOURCES: SeedSource[] = [
  {
    key: "ics_chart",
    title: "International Chronostratigraphic Chart",
    author: "International Commission on Stratigraphy",
    url: "https://stratigraphy.org/chart",
    sourceType: "website",
    notes:
      "The ratified global geological time scale. Cited for the ages of the era boundaries — and, as importantly, for the fact that these boundaries are DEFINED at named rock sections and then dated, rather than being round numbers somebody chose.",
  },
  {
    key: "cohen2013",
    title: "The ICS International Chronostratigraphic Chart",
    author: "K. M. Cohen, S. C. Finney, P. L. Gibbard and J.-X. Fan",
    workTitle: "Episodes",
    reference: "36(3), 199–204",
    url: "https://stratigraphy.org/ICSchart/Cohen2013_Episodes.pdf",
    sourceType: "academic_paper",
    publishedYear: 2013,
    notes: "The paper describing the chart and how its boundaries are defined and revised.",
  },
  {
    key: "planck2020",
    title: "Planck 2018 results. VI. Cosmological parameters",
    author: "Planck Collaboration",
    workTitle: "Astronomy & Astrophysics",
    reference: "641, A6. DOI 10.1051/0004-6361/201833910",
    url: "https://www.aanda.org/articles/aa/abs/2020/09/aa33910-18/aa33910-18.html",
    sourceType: "academic_paper",
    publishedYear: 2020,
    notes: "Cited for the age of the universe in the base Lambda-CDM model fitted to the final Planck measurements of the cosmic microwave background.",
  },
  {
    key: "patterson1956",
    title: "Age of meteorites and the earth",
    author: "Clair C. Patterson",
    workTitle: "Geochimica et Cosmochimica Acta",
    reference: "10(4), 230–237",
    url: "https://ui.adsabs.harvard.edu/abs/1956GeCoA..10..230P/abstract",
    sourceType: "academic_paper",
    publishedYear: 1956,
    notes:
      "The lead-isotope measurement on meteorites that first gave the Earth an age in the range still accepted. Cited for 4.55 ± 0.07 billion years.",
  },
  {
    key: "djokic2017",
    title: "Earliest signs of life on land preserved in ca. 3.5 Ga hot spring deposits",
    author: "Tara Djokic and colleagues",
    workTitle: "Nature Communications",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5436104/",
    sourceType: "academic_paper",
    publishedYear: 2017,
    notes: "Cited for the ~3.48-billion-year-old Dresser Formation deposits in the Pilbara, the oldest evidence of life that is widely rather than contentiously accepted.",
  },
  {
    key: "nutman2016",
    title: "Rapid emergence of life shown by discovery of 3,700-million-year-old microbial structures",
    author: "Allen P. Nutman and colleagues",
    workTitle: "Nature",
    reference: "537, 535–538",
    url: "https://www.nature.com/articles/nature19355",
    sourceType: "academic_paper",
    publishedYear: 2016,
    notes: "Reports structures in Isua metacarbonates, Greenland, interpreted as stromatolites. Contested — see Allwood and colleagues.",
  },
  {
    key: "allwood2018",
    title: "Reassessing evidence of life in 3,700-million-year-old rocks of Greenland",
    author: "Abigail C. Allwood and colleagues",
    workTitle: "Nature",
    reference: "DOI 10.1038/s41586-018-0610-4",
    url: "https://www.nature.com/articles/s41586-018-0610-4",
    sourceType: "academic_paper",
    publishedYear: 2018,
    notes: "Argues the Isua structures arose by non-biological processes. Cited as the published dispute, not as a verdict.",
  },
  {
    key: "dodd2017",
    title: "Evidence for early life in Earth's oldest hydrothermal vent precipitates",
    author: "Matthew S. Dodd and colleagues",
    workTitle: "Nature",
    reference: "543, 60–64",
    url: "https://www.nature.com/articles/nature21377",
    sourceType: "academic_paper",
    publishedYear: 2017,
    notes: "Haematite tubes and filaments in the Nuvvuagittuq belt, Quebec, interpreted as microfossils at least 3,770 and possibly 4,280 million years old.",
  },
  {
    key: "britannica_paleozoic",
    title: "Paleozoic Era",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/science/Paleozoic-Era",
    sourceType: "encyclopedia",
    notes: "Cited for the mainstream account of what the Paleozoic fossil and geological record is read as showing.",
  },
  {
    key: "britannica_mesozoic",
    title: "Mesozoic Era",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/science/Mesozoic-Era",
    sourceType: "encyclopedia",
    notes: "Cited for the mainstream palaeontological account of the era, and for the fact that 'Age of Dinosaurs' is a label rather than a description of the whole biota.",
  },
  {
    key: "britannica_cenozoic",
    title: "Cenozoic Era",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/science/Cenozoic-Era",
    sourceType: "encyclopedia",
    notes: "Cited for the era's subdivisions and for the mainstream reading of the mammal record after the end-Cretaceous transition.",
  },
  {
    key: "britannica_stoneage",
    title: "Stone Age",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/event/Stone-Age",
    sourceType: "encyclopedia",
    notes: "Cited for the Palaeolithic subdivisions and for the separate African Early/Middle/Later Stone Age framework.",
  },
  {
    key: "britannica_neolithic",
    title: "Neolithic",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/event/Neolithic",
    sourceType: "encyclopedia",
    notes: "Cited for the conventional definition of the Neolithic by cultivation, herding, permanent settlement and ground stone tools rather than by a date.",
  },
  {
    key: "britannica_bronze",
    title: "Bronze Age",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/event/Bronze-Age",
    sourceType: "encyclopedia",
    notes: "Cited for the conventional definition of the Bronze Age and for the fact that it ends at different times in different places.",
  },
  {
    key: "britannica_iron",
    title: "Iron Age",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/event/Iron-Age",
    sourceType: "encyclopedia",
    notes:
      "Cited for the Near Eastern and southeastern European start around 1200 BCE, and for its own statement that China's begins around 600 BCE — a five-hundred-year gap inside one word.",
  },
  {
    key: "britannica_middleages",
    title: "History of Europe: The Middle Ages",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/topic/history-of-Europe/The-Middle-Ages",
    sourceType: "encyclopedia",
    notes: "Cited for the conventional European span and for the term's origin among 15th-century scholars naming the time between antiquity and their own.",
  },
  {
    key: "met_mesopotamia",
    title: "Mesopotamia, 8000–2000 B.C.",
    author: "The Metropolitan Museum of Art",
    workTitle: "Heilbrunn Timeline of Art History",
    url: "https://www.metmuseum.org/toah/ht/02/wam.html",
    sourceType: "museum",
    notes: "Cited for the museum's own chronology of southern Mesopotamia: Chalcolithic to about 3000 BCE, Early Bronze Age from about 3000 BCE.",
  },
  {
    key: "harmand2015",
    title: "3.3-million-year-old stone tools from Lomekwi 3, West Turkana, Kenya",
    author: "Sonia Harmand and colleagues",
    workTitle: "Nature",
    reference: "521, 310–315",
    url: "https://www.nature.com/articles/nature14464",
    sourceType: "academic_paper",
    publishedYear: 2015,
    notes: "The oldest stone artefacts yet reported, and the reason the Early Stone Age is now drawn from 3.3 million years rather than 2.6.",
  },
  {
    key: "lepre2011",
    title: "An earlier origin for the Acheulian",
    author: "Christopher J. Lepre and colleagues",
    workTitle: "Nature",
    reference: "477, 82–85",
    url: "https://www.nature.com/articles/nature10372",
    sourceType: "academic_paper",
    publishedYear: 2011,
    notes: "Places the earliest Acheulean handaxes at Kokiselei, West Turkana, at about 1.76 million years — the technology the later Early Stone Age is named for.",
  },
  {
    key: "deino2018",
    title: "Chronology of the Acheulean to Middle Stone Age transition in eastern Africa",
    author: "Alan L. Deino and colleagues",
    workTitle: "Science",
    reference: "360, 95–98. DOI 10.1126/science.aao2216",
    url: "https://www.science.org/doi/10.1126/science.aao2216",
    sourceType: "academic_paper",
    publishedYear: 2018,
    notes: "Argon-argon and uranium-series dating of the Olorgesailie basin sequence, Kenya: Middle Stone Age sites from ≥295,000 to about 320,000 years ago.",
  },
  {
    key: "brooks2018",
    title: "Long-distance stone transport and pigment use in the earliest Middle Stone Age",
    author: "Alison S. Brooks and colleagues",
    workTitle: "Science",
    reference: "DOI 10.1126/science.aao2646",
    url: "https://www.science.org/doi/10.1126/science.aao2646",
    sourceType: "academic_paper",
    publishedYear: 2018,
    notes: "The archaeology the Olorgesailie chronology dates: obsidian carried long distances and pigment use at the start of the eastern African Middle Stone Age.",
  },
  {
    key: "shipton2018",
    title: "78,000-year-old record of Middle and Later Stone Age innovation in an East African tropical forest",
    author: "Ceri Shipton and colleagues",
    workTitle: "Nature Communications",
    reference: "9, 1832. DOI 10.1038/s41467-018-04057-3",
    url: "https://www.nature.com/articles/s41467-018-04057-3",
    sourceType: "academic_paper",
    publishedYear: 2018,
    notes:
      "Panga ya Saidi, coastal Kenya — the longest archaeological sequence in eastern Africa. Cited because it shows the Middle-to-Later Stone Age change as gradual and mosaic rather than as a boundary.",
  },
  {
    key: "wikipedia_upper_palaeolithic",
    title: "Upper Paleolithic — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Upper_Paleolithic",
    sourceType: "wikipedia",
    notes:
      "An encyclopedia anyone can edit, cited for the conventional European span and for its own statement that the African Stone Age terms are not to be confused with the Palaeolithic ones. Follow its references.",
  },
  {
    key: "wikipedia_ppna",
    title: "Pre-Pottery Neolithic A — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Pre-Pottery_Neolithic_A",
    sourceType: "wikipedia",
    notes: "Cited for the conventional dating of the earliest Neolithic phase in the Levant, about 10,000–8800 BCE. Follow its references.",
  },
  {
    key: "wikipedia_bronze_britain",
    title: "Bronze Age Britain — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Bronze_Age_Britain",
    sourceType: "wikipedia",
    notes: "Cited for the conventional British span, about 2500–2200 BCE to about 800 BCE. Follow its references.",
  },
  {
    key: "wikipedia_british_iron_age",
    title: "British Iron Age — Wikipedia",
    url: "https://en.wikipedia.org/wiki/British_Iron_Age",
    sourceType: "wikipedia",
    notes: "Cited for the conventional British span, about 800 BCE to the Roman invasion of 43 CE. Follow its references.",
  },
  {
    key: "tewari2003",
    title: "The origins of iron-working in India: new evidence from the Central Ganga Plain and the Eastern Vindhyas",
    author: "Rakesh Tewari",
    workTitle: "Antiquity",
    reference: "77(297), 536–544",
    url: "https://www.lkouniv.ac.in/site/writereaddata/siteContent/202004150925271082anil_kumar_origins_of_iron_working.pdf",
    sourceType: "academic_paper",
    publishedYear: 2003,
    notes: "Radiocarbon dates on iron-working debris from Malhar, Raja Nala-ka-tila and Dadupur in Uttar Pradesh, reported as falling between about 1800 and 1000 BCE.",
  },
  {
    key: "nok_taruga",
    title: "Early West African Iron Smelting: The Legacy of Taruga in Light of Recent Nok Research",
    workTitle: "African Archaeological Review",
    reference: "DOI 10.1007/s10437-017-9262-2",
    url: "https://link.springer.com/article/10.1007/s10437-017-9262-2",
    sourceType: "academic_paper",
    publishedYear: 2017,
    notes: "Re-examines the Taruga iron-smelting furnaces in central Nigeria in the light of recent Nok excavations. Cited for a West African sequence in the second half of the first millennium BCE.",
  },
  {
    key: "clist1987",
    title: "A critical reappraisal of the chronological framework of the early Urewe Iron Age industry",
    author: "Bernard Clist",
    workTitle: "Muntu",
    reference: "6, 35–62",
    url: "https://www.africabib.org/rec.php?RID=119528940",
    sourceType: "academic_paper",
    publishedYear: 1987,
    notes:
      "Cited because it argues the early Urewe dates are later than the conventional reading — the disagreement is the point, and a single East African Iron Age date would hide it.",
  },
  {
    key: "smithsonian",
    title: "Human Origins Program",
    author: "Smithsonian National Museum of Natural History",
    url: "https://humanorigins.si.edu",
    sourceType: "museum",
    notes: "Cited for the museum's account of the early hominin fossil record, including which classifications it presents as settled and which it does not.",
  },
  {
    key: "jmw_global_middle_ages",
    title: "Why We Need to Think About the Global Middle Ages",
    workTitle: "Journal of Medieval Worlds",
    reference: "1(1), 5",
    url: "https://online.ucpress.edu/jmw/article/1/1/5/51028/Why-We-Need-to-Think-About-the-Global-Middle-Ages",
    sourceType: "academic_paper",
    publishedYear: 2019,
    notes:
      "Cited for the argument that 'medieval' is a European periodisation that has been applied to the rest of the world, and for the scholarly discomfort with doing so.",
  },
];

// ---------------------------------------------------------------------------
// The periods
// ---------------------------------------------------------------------------

// WHY THIRTEEN OF THE FIFTEEN HAVE A PICTURE AND TWO DO NOT.
//
// A period picture is the easiest one on this timeline to get wrong. A period
// is the frame every event is read against, so one object printed beside a band
// covering thousands of years and several continents reads as a portrait of the
// whole span. Every caption below therefore says what its picture is an example
// OF, and several say outright what the picture is not: Tyrannosaurus lived at
// the very END of the Mesozoic, the Nebra disc was looted rather than
// excavated, the Levallois technique is not a species marker, and a great many
// circulated Lascaux photographs are of the replica.
//
// "MEDIEVAL" AND "MODERN" GET NOTHING, AND THAT IS THE POINT.
//
// Both are historical conventions with an origin in one region's history,
// applied far beyond it — which this file says in as many words in the entries
// themselves. An illuminated European manuscript beside "Medieval" would not
// illustrate that problem; it would commit it, and commit it in the most
// persuasive place on the card, where a reader takes a picture as a label
// rather than as a claim.
//
// There is no single object that can stand for "the medieval world" without
// choosing a region and calling it the centre, and picking a deliberately
// non-European object to make the opposite point would be this file asserting
// something too. So the two entries carry no picture, and this comment is where
// the omission is recorded rather than left looking like an oversight.
export const PERIODS: SeedPeriod[] = [
  // -------------------------------------------------------------------------
  // 1
  // -------------------------------------------------------------------------
  {
    slug: "early-universe",
    name: "The early universe",
    summary: "From the earliest state the standard cosmological model describes, to the formation of the Earth.",
    description:
      "Within the mainstream cosmological model, the universe is understood to have developed from an extremely hot, dense early state, cooling until atoms could form, and later producing stars and galaxies.\n\n" +
      "This is NOT a scientific period in the way the Mesozoic is. Cosmologists date events; they do not carve cosmic history into named eras with ratified boundaries, the way stratigraphers carve up the history of the Earth. \"The early universe\" here is a teaching label for the stretch before there was an Earth, and both of its ends are measurements rather than definitions.",
    periodType: "educational",
    framework: "Mainstream cosmology",
    definingCriteria:
      "Nothing defines it except the two measurements at its ends: an age for the universe inferred from the cosmic microwave background, and an age for the Earth measured from meteorites. Between them lies everything that happened before there was an Earth to record any of it.",
    evidence:
      "The cosmic microwave background, mapped across the whole sky by the Planck satellite; the abundances of the lightest elements; the redshift–distance relation of galaxies; and the lead-isotope compositions of meteorites.",
    interpretation:
      "That the microwave background is relic radiation from a hot, dense early universe — and that fitting a six-parameter model to it yields an age — is the mainstream cosmological reading of those measurements. The number is model-dependent. It is the age implied by Lambda-CDM, not a duration anybody has counted, and it has moved as the data and the model have improved.",
    displayPriority: 90,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hubble_ultra_deep_field.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Hubble_ultra_deep_field.jpg?width=1024",
        shows: "evidence_photograph",
        caption:
          "The Hubble Ultra Deep Field. Nearly every point of light is a galaxy, and looking further away is " +
          "looking further back \u2014 so this is a photograph OF the past rather than an illustration of it. It is " +
          "not a picture of the early universe itself: the earliest state this period names is far beyond " +
          "anything any telescope can image.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "planck2020",
        startYear: Ga(13.797),
        datePrecision: "billion_years",
        precisionDecimals: 3,
        uncertaintyPlus: 23_000_000,
        uncertaintyMinus: 23_000_000,
        isApproximate: false,
        originalDateText: "13.797 ± 0.023 Gyr",
        datingMethod: "other",
        chronology: "scientific",
        evidence:
          "The age of the universe in the base Lambda-CDM model fitted to Planck's final full-mission measurements of the cosmic microwave background, combined with the lensing reconstruction. It is an inference from a measurement through a model, not a count of years.",
        notes:
          "Mainstream cosmology. The figure moves when the model or the data change — Planck's 2013 release gave 13.82 billion years — which is exactly why it is recorded here as a claim with a source and a date rather than as the age of the universe.",
      },
      {
        sourceKey: "patterson1956",
        startYear: Ga(4.55),
        datePrecision: "billion_years",
        precisionDecimals: 2,
        uncertaintyPlus: 70_000_000,
        uncertaintyMinus: 70_000_000,
        isApproximate: false,
        originalDateText: "4.55 ± 0.07 × 10⁹ years",
        datingMethod: "radiometric",
        chronology: "scientific",
        evidence:
          "Lead-isotope ratios measured in meteorites and in terrestrial lead, which fall on a single line whose slope gives an age for the material the Solar System formed from. Patterson's 1956 measurement is where the modern figure comes from.",
        notes:
          "The end of this teaching umbrella is the beginning of the Earth, so the two periods share this boundary rather than each carrying their own copy of it. Later work has refined the value slightly; the measurement quoted is the one this source published.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 2
  // -------------------------------------------------------------------------
  {
    slug: "early-earth",
    name: "Early Earth",
    summary: "From the formation of the planet to the oldest evidence anyone reads as life — which is argued about.",
    description:
      "According to mainstream geological interpretations, the Earth formed from material in the early Solar System and went on to develop a differentiated interior, a crust, oceans, and the environments in which the earliest proposed evidence of life later appears.\n\n" +
      "Another teaching umbrella rather than a recognised unit — and one whose far end is genuinely unsettled. The three boundary claims below are three different answers to \"when does the evidence for life begin?\", and they are 800 million years apart. That is not a defect in the record. It is the state of the question.",
    periodType: "educational",
    framework: "Mainstream geology and geochemistry",
    definingCriteria:
      "Begins with the age of the Earth as measured from meteorites. Ends wherever a reader puts the earliest evidence for life — which is why it ends in three places below rather than one.",
    evidence:
      "Lead isotopes in meteorites; the oldest surviving rocks and zircon crystals; layered structures in Greenland metacarbonates and in Australian cherts; haematite tubes in Quebec; carbon-isotope ratios in ancient graphite.",
    interpretation:
      "Whether a layered structure in a 3.7-billion-year-old rock is a stromatolite built by microbes, or a shape produced by deformation and metamorphism, is an argument between specialists working on the same outcrops — and it is published as an argument. The dating is not the contested part; the biology is.",
    displayPriority: 85,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Acasta_gneiss.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Acasta_gneiss.jpg?width=1024",
        shows: "evidence_photograph",
        caption:
          "Acasta gneiss from northwest Canada, among the oldest intact rock known at about 4.03 billion years. " +
          "ONE ROCK IS NOT AN ERA: this is a surviving fragment from near the start of this span, and almost " +
          "nothing else from the period survives at all, which is why its boundaries are measurements rather " +
          "than observations.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "patterson1956",
        startYear: Ga(4.55),
        datePrecision: "billion_years",
        precisionDecimals: 2,
        uncertaintyPlus: 70_000_000,
        uncertaintyMinus: 70_000_000,
        isApproximate: false,
        originalDateText: "4.55 ± 0.07 × 10⁹ years",
        datingMethod: "radiometric",
        chronology: "scientific",
        evidence:
          "Lead-isotope ratios in meteorites, interpreted as dating the formation of the Solar System's solid material and therefore of the Earth.",
        notes: "The same boundary claim the previous period ends on. One measurement, cited by both, rather than two copies that could drift apart.",
      },
      {
        sourceKey: "dodd2017",
        startYear: Ga(3.77),
        datePrecision: "billion_years",
        precisionDecimals: 2,
        isApproximate: true,
        originalDateText: "at least 3,770 and possibly 4,280 million years old",
        datingMethod: "radiometric",
        chronology: "disputed",
        evidence:
          "Micrometre-scale haematite tubes and filaments in banded iron formation from the Nuvvuagittuq belt, Quebec, interpreted as seafloor hydrothermal-vent precipitates. The morphologies and mineral assemblages are compared to filamentous microorganisms from modern vents.",
        notes:
          "The oldest proposed evidence of life, and the least settled. The age range is wide because the host rocks themselves are difficult to date, and the biological reading of the structures is contested by other specialists.",
      },
      {
        sourceKey: "nutman2016",
        startYear: Ga(3.7),
        datePrecision: "billion_years",
        precisionDecimals: 1,
        isApproximate: true,
        originalDateText: "3,700-million-year-old",
        datingMethod: "radiometric",
        chronology: "disputed",
        evidence:
          "Centimetre-high layered structures in newly exposed metacarbonate rocks of the Isua supracrustal belt, Greenland, interpreted as stromatolites — structures built by microbial communities in shallow water.",
        notes:
          "Published as likely to be controversial, and it was: see the disputing citation. Both teams have worked the same outcrop and disagree about whether the structures are biological or the product of deformation.",
        citations: [
          {
            sourceKey: "allwood2018",
            relation: "disputes",
            note: "An independent analysis of the same rocks, arguing the structures arose by non-biological processes and that the case for stromatolites does not hold.",
          },
        ],
      },
      {
        sourceKey: "djokic2017",
        startYear: Ga(3.48),
        datePrecision: "billion_years",
        precisionDecimals: 2,
        isApproximate: true,
        originalDateText: "ca. 3.5 Ga",
        datingMethod: "radiometric",
        chronology: "conventional",
        evidence:
          "Deposits of the Dresser Formation in the Pilbara, Western Australia, interpreted as hot-spring sinter, containing textures read as microbial. The Pilbara stromatolites are the oldest evidence for life that is widely rather than contentiously accepted.",
        notes:
          "This is the conventional end of \"early Earth\" and the conventional beginning of the fossil record. The two older claims above reach further back and are argued about; this one is where most readers of the evidence agree.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 3
  // -------------------------------------------------------------------------
  {
    slug: "age-of-early-life",
    name: "The age of early life",
    summary: "Three billion years in which the fossil record is, on the mainstream reading, overwhelmingly microbial.",
    description:
      "According to the mainstream interpretation of the geological and fossil record, life through most of this enormous interval was predominantly microbial, with larger and more complex multicellular organisms appearing towards its end.\n\n" +
      "A teaching umbrella, not a formal era. Geologists divide this stretch into the Archean and Proterozoic eons and many subdivisions within them, all of them ratified; \"the age of early life\" is none of those. It is here because three billion years of microbial history is otherwise invisible on a timeline whose events are mostly from the last ten thousand.",
    periodType: "educational",
    framework: "Mainstream geology and palaeontology",
    definingCriteria:
      "Runs from the oldest widely accepted evidence of life to the base of the Cambrian, which is a ratified boundary and the point from which the animal fossil record becomes abundant.",
    evidence:
      "Stromatolites and microbial textures in Archean cherts and carbonates; banded iron formations; carbon- and sulfur-isotope records; microfossils; and, late in the interval, the impressions of the Ediacaran biota.",
    interpretation:
      "The reading that this record represents a biosphere dominated by single-celled organisms for most of Earth's history is mainstream geology and palaeontology. It rests on an absence as much as on a presence — larger organisms are not found — and absences in a record this old are read with care.",
    displayPriority: 80,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Stromatolites_in_Sharkbay.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Stromatolites_in_Sharkbay.jpg?width=1024",
        shows: "evidence_photograph",
        caption:
          "Living stromatolites at Shark Bay, Western Australia \u2014 mounds built by microbial mats, being made " +
          "today. They are here because the fossil ones can be read against something observable; they are a " +
          "modern comparison, not a photograph of early life.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "djokic2017",
        startYear: Ga(3.48),
        datePrecision: "billion_years",
        precisionDecimals: 2,
        isApproximate: true,
        originalDateText: "ca. 3.5 Ga",
        datingMethod: "radiometric",
        chronology: "conventional",
        evidence: "The Dresser Formation deposits of the Pilbara, dated radiometrically and interpreted as preserving the earliest widely accepted traces of life.",
        notes: "Shared with the end of \"Early Earth\" — the same boundary read from the other side.",
      },
      {
        sourceKey: "ics_chart",
        startYear: Ma(538.8),
        datePrecision: "million_years",
        precisionDecimals: 1,
        uncertaintyPlus: 600_000,
        uncertaintyMinus: 600_000,
        isApproximate: false,
        originalDateText: "538.8 ± 0.6 Ma",
        datingMethod: "radiometric",
        chronology: "geological",
        evidence:
          "The base of the Cambrian, defined at Fortune Head in Newfoundland by the first appearance of a particular trace fossil and dated by high-precision uranium–lead dating of volcanic ash beds near the boundary.",
        notes:
          "Commonly given as 541 million years, including in the brief this dataset was written from. The International Commission on Stratigraphy revised it to 538.8 ± 0.6 Ma in 2022. The definition did not move; the measurement of it did, which is the normal way a formal boundary changes.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 4
  // -------------------------------------------------------------------------
  {
    slug: "paleozoic-era",
    name: "Paleozoic Era",
    aliases: ["Palaeozoic"],
    summary: "A formal geological era. Its base and its top are separately defined, separately dated boundaries.",
    description:
      "In mainstream geological chronology, the Paleozoic Era contains a major diversification of documented animal life, and evidence interpreted as the spread of plants and animals into terrestrial environments.\n\n" +
      "The mainstream palaeontological reading of the era's record includes the diversification of marine invertebrates, the first land plants and then forests, arthropods on land, early four-limbed vertebrates, and early reptiles. Each of those is a conclusion drawn from fossils and their stratigraphic context by working palaeontologists — not a statement this timeline is in a position to make on its own account.",
    periodType: "formal_scientific",
    framework: "Mainstream geology and palaeontology (International Commission on Stratigraphy)",
    definingCriteria:
      "Both ends are Global Boundary Stratotype Sections and Points: a physical marker in a named rock section, agreed by the International Commission on Stratigraphy, and then dated. The definition is the rock; the number is a measurement of it and is revised as dating improves.",
    evidence:
      "Marine invertebrate fossils in great quantity; plant fossils and root traces; trackways; body fossils of early tetrapods and reptiles; and the radiometric ages of volcanic ash beds interleaved with all of it.",
    interpretation:
      "That this record documents a diversification of animal life and a colonisation of land is the mainstream palaeontological reading. What is recovered is fossils in layers; the sequence of life those fossils are taken to describe is an interpretation, and a very well supported one.",
    displayPriority: 70,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Elrathia_kingii_(fossil_trilobite)_(Wheeler_Formation,_Middle_Cambrian;_House_Range,_western_Utah,_USA)_1.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Elrathia_kingii_(fossil_trilobite)_(Wheeler_Formation,_Middle_Cambrian;_House_Range,_western_Utah,_USA)_1.jpg?width=1024",
        shows: "artefact",
        caption:
          "Elrathia kingii, a Middle Cambrian trilobite from Utah. One animal from one formation near the START " +
          "of an era lasting close to three hundred million years \u2014 not a portrait of the whole of it. What " +
          "survives is the hard exoskeleton; the animal inside almost never does.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "ics_chart",
        startYear: Ma(538.8),
        datePrecision: "million_years",
        precisionDecimals: 1,
        uncertaintyPlus: 600_000,
        uncertaintyMinus: 600_000,
        isApproximate: false,
        originalDateText: "538.8 ± 0.6 Ma",
        datingMethod: "radiometric",
        chronology: "geological",
        evidence: "The ratified base of the Cambrian at Fortune Head, Newfoundland, dated by uranium–lead measurements on zircons from ash beds near the boundary.",
        notes: "The era's base. Widely quoted as 541 Ma before the 2022 revision.",
        citations: [{ sourceKey: "cohen2013", relation: "context", note: "How the chart's boundaries are defined, dated and revised." }],
      },
      {
        sourceKey: "ics_chart",
        startYear: Ma(251.902),
        datePrecision: "million_years",
        precisionDecimals: 3,
        uncertaintyPlus: 24_000,
        uncertaintyMinus: 24_000,
        isApproximate: false,
        originalDateText: "251.902 ± 0.024 Ma",
        datingMethod: "radiometric",
        chronology: "geological",
        evidence:
          "The ratified base of the Triassic at the Meishan D section in South China, defined by the first appearance of the conodont Hindeodus parvus and dated by high-precision uranium–lead measurements on ash beds through the boundary interval.",
        notes:
          "The era's top, and the same rock marker the Mesozoic's base is defined by — so the two periods meet at one claim rather than at two numbers that happen to agree.",
      },
      {
        sourceKey: "britannica_paleozoic",
        startYear: Ma(538.8),
        endYear: Ma(251.902),
        datePrecision: "million_years",
        precisionDecimals: 1,
        isApproximate: true,
        originalDateText: "538.8 million to 251.9 million years ago",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence: "The span as a general reference work states it, rounded for a reader who wants the era rather than the boundary measurements.",
        notes: "Kept alongside the two boundary claims rather than instead of them: the rounded span is how the era is usually met, and the measurements are what it rests on.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 5
  // -------------------------------------------------------------------------
  {
    slug: "mesozoic-era",
    name: "Mesozoic Era",
    aliases: ["Age of Dinosaurs", "Age of the Dinosaurs"],
    summary: "A formal geological era. \"Age of Dinosaurs\" is a nickname for it, and one that leaves a lot out.",
    description:
      "In the mainstream scientific interpretation of the fossil and geological record, dinosaurs became a major and diverse group of terrestrial vertebrates during much of the Mesozoic Era. The same record is also interpreted as documenting early mammals, birds, and — later in the era — flowering plants.\n\n" +
      "This entry does not put dinosaurs between two dates as a plain matter of fact. What exists is bone, teeth, eggshell, footprints and burrows, in layers whose ages are measured radiometrically. What palaeontologists reconstruct from that — which animals, related how, living how, and for how long — is an interpretation of those objects, held with good reason and revised regularly.\n\n" +
      "\"Age of Dinosaurs\" is a teaching label, not a description of the biota. The same rocks carry marine reptiles, insects, mammals, conifers and, eventually, flowers. An era named after one group is an era most of whose inhabitants have been left out of the name.",
    periodType: "formal_scientific",
    framework: "Mainstream palaeontology and geology (International Commission on Stratigraphy)",
    definingCriteria:
      "Base: the first appearance of the conodont Hindeodus parvus at Meishan, China. Top: the boundary at the end of the Cretaceous, marked worldwide by an iridium-rich layer. Both are physical markers agreed by a standards body, then dated — not dates chosen and then applied to rocks.",
    evidence:
      "Skeletal remains, teeth and eggshell; trace fossils including footprints, trackways, nests and burrows; the stratigraphic order of the beds containing them; radiometric ages from interbedded volcanic ash; and the global iridium anomaly at the top of the era.",
    interpretation:
      "The reconstruction of dinosaur groups, their relationships, their ecological roles, and the timing of their diversification and disappearance is mainstream palaeontology's reading of that physical evidence. It is not a report of observation — nobody observed it — and it changes: the relationship between dinosaurs and birds, and the appearance of feathers, have both been substantially revised within living memory.",
    displayPriority: 70,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/FMNH_Tyrannosaurus_rex_Sue.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/FMNH_Tyrannosaurus_rex_Sue.jpg?width=1024",
        shows: "reconstruction",
        caption:
          "The mounted skeleton known as Sue, at the Field Museum. A MOUNT IS AN INTERPRETATION: the bones are " +
          "real, but the pose, the missing elements and the articulation are decisions made by whoever " +
          "assembled it. Tyrannosaurus also lived at the very END of this era \u2014 nearer in time to us than to " +
          "the era's beginning.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "ics_chart",
        startYear: Ma(251.902),
        datePrecision: "million_years",
        precisionDecimals: 3,
        uncertaintyPlus: 24_000,
        uncertaintyMinus: 24_000,
        isApproximate: false,
        originalDateText: "251.902 ± 0.024 Ma",
        datingMethod: "radiometric",
        chronology: "geological",
        evidence: "The ratified base of the Triassic at Meishan D, South China, dated by uranium–lead measurements on ash beds through the boundary interval.",
        notes: "The era's base, and the same claim the Paleozoic ends on.",
      },
      {
        sourceKey: "ics_chart",
        startYear: Ma(66.0),
        datePrecision: "million_years",
        precisionDecimals: 1,
        isApproximate: false,
        originalDateText: "66.0 Ma",
        datingMethod: "radiometric",
        chronology: "geological",
        evidence: "The Cretaceous–Paleogene boundary as carried on the chronostratigraphic chart, marked globally by an iridium-rich clay layer.",
        notes: "The era's top. The chart carries it to one decimal place; the measurement it rests on is more precise — see the next claim.",
      },
      {
        sourceKey: "britannica_mesozoic",
        startYear: Ma(252.2),
        endYear: Ma(66),
        datePrecision: "million_years",
        precisionDecimals: 1,
        isApproximate: true,
        originalDateText: "252.2 million years ago … 66 million years ago",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence: "The span as a general reference work gives it, with the base at 252.2 rather than 251.902 million years.",
        notes:
          "A third of a million years apart from the chart, which is what happens when a reference work quotes a figure from an earlier revision. Kept because it is what a reader looking the era up will most often find, and because the gap between the two is worth seeing.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 6
  // -------------------------------------------------------------------------
  {
    slug: "cenozoic-era",
    name: "Cenozoic Era",
    aliases: ["Age of Mammals"],
    summary: "The formal era we are in. It has a base and no top: it has not ended.",
    description:
      "According to mainstream geological and palaeontological interpretations, mammals diversified substantially through the Cenozoic following the end-Cretaceous transition, with primates and, later, the fossil populations interpreted as human ancestral lineages appearing within this interval.\n\n" +
      "\"Age of Mammals\" is the same kind of nickname as \"Age of Dinosaurs\" and deserves the same caution: by most measures of abundance and diversity this has been the age of flowering plants, of insects, or of teleost fish, depending on what is being counted.\n\n" +
      "The era is divided by the International Commission on Stratigraphy into the Paleogene, Neogene and Quaternary, none of which is seeded here — the model supports them being added later without touching this record.",
    periodType: "formal_scientific",
    framework: "Mainstream palaeontology and geology (International Commission on Stratigraphy)",
    definingCriteria: "Begins at the Cretaceous–Paleogene boundary. Has no end: it is the era currently running, which is why its boundary claim is recorded as ongoing rather than as ending in a year somebody picked.",
    evidence:
      "Mammal fossils through a continuous and well-sampled sequence; the global iridium layer and shocked quartz at the base; oxygen-isotope records from deep-sea cores tracking climate through the era; and, late in it, hominin fossils and stone artefacts.",
    interpretation:
      "The reading that mammal diversification followed and was enabled by the end-Cretaceous extinction is mainstream palaeontology. It is an inference about cause from a sequence in the rocks, and the details — how much of the diversification preceded the boundary — are actively worked on.",
    displayPriority: 70,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Smithsonian_woolly_mammoth.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Smithsonian_woolly_mammoth.jpg?width=1024",
        shows: "reconstruction",
        caption:
          "A mounted woolly mammoth skeleton at the Smithsonian. Mammoths belong to the last flicker of this " +
          "era rather than its span, and the mount is an assembled interpretation as every mount is. It is an " +
          "example from inside the period, not a summary of sixty-six million years.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "ics_chart",
        startYear: Ma(66.0),
        isOngoing: true,
        datePrecision: "million_years",
        precisionDecimals: 1,
        isApproximate: false,
        originalDateText: "66.0 Ma to the present",
        datingMethod: "radiometric",
        chronology: "geological",
        evidence: "The base of the Paleogene at the Cretaceous–Paleogene boundary, defined by the iridium-rich layer and dated radiometrically.",
        notes:
          "Recorded as ongoing rather than as ending in the current year. Writing an end date here would invent a boundary nobody has claimed; the strip draws the band to the present instead.",
      },
      {
        sourceKey: "britannica_cenozoic",
        startYear: Ma(66),
        isOngoing: true,
        datePrecision: "million_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 66 million years ago and extending to the present",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence: "The era as a general reference work states it, together with its division into the Paleogene, Neogene and Quaternary.",
        notes: "Agrees with the chart, which is worth showing as often as disagreement is.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 7
  // -------------------------------------------------------------------------
  {
    slug: "early-human-ancestors",
    name: "Early human ancestors",
    summary: "African fossil populations read as being on, or near, the lineage that led to modern humans.",
    description:
      "Within mainstream palaeoanthropology, several African fossil populations from this interval are interpreted as belonging to, or lying close to, the evolutionary lineage that eventually produced modern humans. The interpretations concern bipedal walking, body and skull anatomy, diet inferred from teeth and wear, brain size, and proposed relationships between populations.\n\n" +
      "Two things this entry will not do. It will not present human evolution as a line: the fossil record is read as a branching set of populations, several of them contemporaries, most of them leaving no descendants. And it will not present the classifications as settled — several of the most important specimens are argued about at the level of what they even are.\n\n" +
      "A teaching umbrella, not a formal age. The Cenozoic contains it; palaeoanthropology does not have ratified period boundaries of its own.",
    periodType: "educational",
    framework: "Mainstream palaeoanthropology",
    definingCriteria:
      "Bracketed by fossils rather than defined: it starts with the oldest specimens anyone has proposed as hominin, and runs to roughly the point where fossils assigned to the genus Homo become the subject.",
    evidence:
      "Skulls, teeth, jaws and postcranial bones from sites in Chad, Ethiopia, Kenya, Tanzania and South Africa; footprints preserved in ash; the sediments and volcanic layers that date them; and dental microwear and isotopes bearing on diet.",
    interpretation:
      "Which specimens are hominin, how they are related, and whether a given one is ancestral to anything living are interpretations of anatomy — and the most argued-over part of the subject. The seven-million-year-old skull that opens this period has been read as an early hominin, as an early gorilla relative, and as neither.",
    displayPriority: 60,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Olduvai_stone_chopping_tool.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Olduvai_stone_chopping_tool.jpg?width=1024",
        shows: "artefact",
        caption:
          "An Oldowan chopping tool from Olduvai Gorge. The earliest known stone tools are older still and come " +
          "from Lomekwi in Kenya \u2014 a date that has moved before and may move again, which is why this record " +
          "gives a range rather than a first.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "smithsonian",
        startYear: Ma(7),
        datePrecision: "million_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 7 million years ago",
        datingMethod: "archaeological",
        chronology: "disputed",
        evidence:
          "Cranial and dental material from the Djurab desert, Chad, described in 2002 as Sahelanthropus tchadensis, with a forward-placed foramen magnum argued to indicate an upright posture.",
        notes:
          "Recorded as disputed, not as the start of human ancestry. Its position among the apes is unsettled — it has been read as an early hominin, as a stem hominid, and as closer to gorillas — and the bipedalism argument rests on a distorted specimen. It is the oldest candidate, which is not the same as the oldest ancestor.",
      },
      {
        sourceKey: "smithsonian",
        startYear: Ma(2),
        datePrecision: "million_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 2 million years ago",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "The point in the eastern African record where fossils assigned to early Homo are found alongside, and then instead of, the australopith populations that precede them.",
        notes:
          "A soft end by construction: the populations overlap, the assignments are argued about, and nothing changed on a particular date. The boundary is where a teaching narrative usually turns, not where anything happened.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 8
  // -------------------------------------------------------------------------
  {
    slug: "early-stone-age-lower-palaeolithic",
    name: "Early Stone Age / Lower Palaeolithic",
    aliases: ["Early Stone Age", "Lower Palaeolithic", "Lower Paleolithic", "ESA"],
    summary: "Two related frameworks with one band — and they are not synonyms.",
    description:
      "Archaeologists use terms including Early Stone Age and Lower Palaeolithic for long stretches characterised by the earliest known stone-tool traditions and, later, by technologies such as Acheulean handaxes.\n\n" +
      "THE TWO TERMS ARE NOT INTERCHANGEABLE. \"Early Stone Age\" belongs to the African framework — Early, Middle and Later Stone Age — introduced in the 1920s precisely because the European Lower/Middle/Upper Palaeolithic scheme did not fit the African record. They overlap in time and in subject and they are not translations of one another, so this entry carries regional boundary claims rather than one span.\n\n" +
      "Note also what is not claimed: an assemblage of stone tools is evidence that somebody made stone tools. Which species made them is a separate question, usually answered by what fossils happen to lie nearby, and often not answerable at all.",
    periodType: "archaeological",
    framework: "Mainstream archaeology — African Stone Age and Eurasian Palaeolithic frameworks",
    definingCriteria:
      "Defined by what the stone tools look like and how they were made, not by a date. A regional sequence enters and leaves it when its assemblages change, which happens at different times in different places.",
    evidence:
      "Flaked stone artefacts and the cores they came from; cut-marked animal bone; the sediments, volcanic layers and palaeomagnetic reversals that date them; and, at a few sites, the hominin fossils found with them.",
    interpretation:
      "Grouping assemblages into named industries, and reading a change of industry as a change of period, is an archaeological convention applied to physical objects. It is useful and it is a convention: the objects do not come labelled, and the boundaries are drawn by people who study them.",
    displayPriority: 50,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Acheulean_hand_axe_(FindID_73844).jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Acheulean_hand_axe_(FindID_73844).jpg?width=1024",
        shows: "artefact",
        caption:
          "An Acheulean handaxe. The form is remarkably stable across more than a million years and three " +
          "continents, which is the most striking fact about it \u2014 and it is a tool, not a signature: more than " +
          "one kind of human made this shape.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "harmand2015",
        startYear: Ma(3.3),
        region: "Eastern Africa",
        datePrecision: "million_years",
        precisionDecimals: 1,
        isApproximate: true,
        originalDateText: "3.3-million-year-old",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        evidence:
          "Stone artefacts found in place at Lomekwi 3, West Turkana, Kenya, in sediments dated by their position relative to dated volcanic and magnetostratigraphic markers. They predate the Oldowan by around 700,000 years.",
        notes:
          "This find is why the Early Stone Age is now often drawn from 3.3 million years rather than from 2.6. The makers are not identified: hominin fossils occur in the same deposits, which is association rather than attribution.",
      },
      {
        sourceKey: "lepre2011",
        startYear: Ma(1.76),
        datePrecision: "million_years",
        precisionDecimals: 2,
        isApproximate: false,
        originalDateText: "1.76 million years ago",
        datingMethod: "radiometric",
        chronology: "archaeological",
        evidence:
          "Acheulean handaxes at Kokiselei 4, West Turkana, dated by argon-argon measurements and magnetostratigraphy — the earliest securely dated occurrence of the technology.",
        notes:
          "Not a start or an end but a marker inside the period: the technology the later Early Stone Age is usually characterised by does not appear until well over a million years after the first stone tools.",
      },
      {
        sourceKey: "deino2018",
        startYear: ka(320),
        endYear: ka(295),
        region: "Eastern Africa",
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "≥295,000 to ~320,000 years ago",
        datingMethod: "radiometric",
        chronology: "archaeological",
        evidence:
          "Argon-argon and uranium-series dating of the Olorgesailie basin sequence in southern Kenya, which brackets the change from Acheulean to Middle Stone Age assemblages.",
        notes:
          "A range rather than a date, because that is what the dating supports. The transition is also not simultaneous across Africa, so this claim is regional and says so.",
        citations: [
          { sourceKey: "brooks2018", relation: "supports", note: "The archaeology this chronology dates — obsidian carried long distances, and pigment use, at the start of the eastern African Middle Stone Age." },
        ],
      },
      {
        sourceKey: "britannica_stoneage",
        startYear: Ma(2.6),
        endYear: ka(300),
        region: "Europe and western Asia",
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "Lower Paleolithic",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence: "The conventional Lower Palaeolithic span as given by a general reference work, running from the earliest recognised stone industries to the appearance of Middle Palaeolithic assemblages.",
        notes:
          "Deliberately a separate claim from the African ones above. Drawing one band across both frameworks would state that they are the same period under two names, which is the thing this entry exists to deny.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 9
  // -------------------------------------------------------------------------
  {
    slug: "middle-palaeolithic-middle-stone-age",
    name: "Middle Palaeolithic / Middle Stone Age",
    aliases: ["Middle Palaeolithic", "Middle Paleolithic", "Middle Stone Age", "MSA"],
    summary: "The stretch containing Homo sapiens, Neanderthals and others — under two regional names that do not coincide.",
    description:
      "Archaeologists use the Middle Palaeolithic and Middle Stone Age frameworks for parts of this broad interval, during which fossils and archaeological remains are interpreted as representing Homo sapiens, Neanderthals and other human populations, alongside increasingly varied technologies and evidence argued to indicate symbolic behaviour.\n\n" +
      "MIDDLE PALAEOLITHIC IS NOT THE AFRICAN MIDDLE STONE AGE. They overlap and they are studied in parallel, but they are separate regional sequences with separate boundaries, and the African one begins earlier on current dating.\n\n" +
      "\"Symbolic behaviour\" is a reading of objects, not an observation. Pierced shells, worked ochre and marked bone are the finds; that they carried meaning to the people who made them is an argument from them — a strong one in places, and still an argument. The events seeded on this timeline from this interval set the evidence and the interpretation out separately for exactly that reason.",
    periodType: "archaeological",
    framework: "Mainstream archaeology — African Middle Stone Age and Eurasian Middle Palaeolithic frameworks",
    definingCriteria:
      "Characterised by prepared-core flake technologies replacing handaxe-dominated assemblages, and ending where blade-based and microlithic industries become common. Both ends are gradual and regional.",
    evidence:
      "Flaked stone assemblages made on prepared cores; hearths; ochre with traces of grinding; perforated marine shells; human fossils; and the luminescence, uranium-series and electron-spin-resonance dates that place them.",
    interpretation:
      "Which populations made which assemblages, and what the ochre and the shells meant, are interpretations of archaeological evidence. They are held with differing degrees of agreement, and the disagreements are published.",
    displayPriority: 45,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Pointe_levallois_Beuzeville_MHNT_PRE.2009.0.203.2.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Pointe_levallois_Beuzeville_MHNT_PRE.2009.0.203.2.jpg?width=1024",
        shows: "artefact",
        caption:
          "A Levallois point. The technique shapes the core first so the flake comes off in a predetermined " +
          "form \u2014 which is what the label of this period is actually about. IT IS NOT A SPECIES MARKER: " +
          "Neanderthals and Homo sapiens both used it, in overlapping regions.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "deino2018",
        startYear: ka(320),
        endYear: ka(295),
        region: "Eastern Africa",
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "≥295,000 to ~320,000 years ago",
        datingMethod: "radiometric",
        chronology: "archaeological",
        evidence: "The Olorgesailie sequence, dated by argon-argon and uranium-series methods, giving the earliest securely dated Middle Stone Age assemblages in eastern Africa.",
        notes: "Shared with the end of the Early Stone Age: one transition, one claim, read from either side.",
      },
      {
        sourceKey: "britannica_stoneage",
        startYear: ka(300),
        endYear: ka(50),
        region: "Europe and western Asia",
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "Middle Paleolithic",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence: "The conventional Middle Palaeolithic span as a general reference work gives it, characterised by Mousterian and other prepared-core industries.",
        notes: "The Eurasian framework, kept separate from the African one above.",
      },
      {
        sourceKey: "shipton2018",
        startYear: ka(67),
        endYear: ka(37),
        region: "Eastern Africa",
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "Middle to Later Stone Age transition at Panga ya Saidi",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "The Panga ya Saidi sequence in coastal Kenya — the longest archaeological record in eastern Africa — in which Middle Stone Age and Later Stone Age technologies appear mixed through a long interval rather than replacing one another at a horizon.",
        notes:
          "Recorded as a range because that is what the site shows: a gradual, mosaic change rather than a boundary. A single date for the end of the Middle Stone Age would misrepresent this evidence, which is the reason for seeding it.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 10
  // -------------------------------------------------------------------------
  {
    slug: "upper-palaeolithic-later-stone-age",
    name: "Upper Palaeolithic / Later Stone Age",
    aliases: ["Upper Palaeolithic", "Upper Paleolithic", "Later Stone Age", "Late Stone Age", "LSA"],
    summary: "Abundant art, ornament and specialised tools — and, again, two frameworks that are not the same period.",
    description:
      "In mainstream archaeological interpretations, parts of this interval preserve increasingly abundant evidence of art, personal ornament, specialised technologies, hunting strategies, and long-distance social or exchange networks.\n\n" +
      "TWO THINGS TO BE CAREFUL OF. The Upper Palaeolithic and the Later Stone Age are different regional sequences and do not share boundaries. And nothing suddenly began here: ochre, shell beads and deliberate burial all appear tens of thousands of years earlier, in the period above. What changes in this interval is how much survives and how visible it is — which is a statement about the record as much as about the people.",
    periodType: "archaeological",
    framework: "Mainstream archaeology — African Later Stone Age and Eurasian Upper Palaeolithic frameworks",
    definingCriteria:
      "Characterised by blade and microlithic industries, worked bone, antler and ivory, and figurative and abstract imagery. Its end is conventionally placed at the end of the Pleistocene, which is a climatic boundary rather than a cultural one.",
    evidence:
      "Blade and bladelet assemblages; bone, antler and ivory tools; painted and engraved cave surfaces; portable carvings; burials with grave goods; and radiocarbon and luminescence dates for all of it.",
    interpretation:
      "That the density of surviving imagery and ornament indicates a change in social life, rather than a change in preservation or in where people lived, is an interpretation and is argued about.",
    displayPriority: 45,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lascaux_painting.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Lascaux_painting.jpg?width=1024",
        shows: "evidence_photograph",
        caption:
          "Painted animals at Lascaux. WORTH KNOWING BEFORE YOU TRUST ANY LASCAUX PHOTOGRAPH: the original cave " +
          "has been closed to visitors since 1963, and a great many circulated images are of the full-size " +
          "replica built nearby \u2014 the file page is where to check which this is. Cave art of this age is also " +
          "known from Indonesia and elsewhere, so it is not a European period marker.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Lascaux,_replica_03.JPG?width=1024",
        shows: "reconstruction",
        caption:
          "Lascaux II, the full-size replica near the original. THIS IS NOT THE CAVE. It is here deliberately " +
          "beside the other picture: the original has been closed to visitors since 1963, a great many " +
          "circulated 'Lascaux' photographs are of this rather than of it, and being able to tell which one you " +
          "are looking at is the whole point of putting both here.",
        kind: "image",
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "wikipedia_upper_palaeolithic",
        startYear: ka(50),
        endYear: ka(12),
        region: "Europe and western Asia",
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "c. 50,000 to c. 12,000 years ago",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        evidence: "The conventional Eurasian span, resting on radiocarbon sequences from European and western Asian sites.",
        notes: "A tertiary source for a convention rather than for a measurement, which is what it is fit for. Its references lead to the excavation reports.",
      },
      {
        sourceKey: "shipton2018",
        startYear: ka(67),
        endYear: ka(37),
        region: "Eastern Africa",
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "Middle to Later Stone Age transition at Panga ya Saidi",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence: "Middle and Later Stone Age technologies interleaved through a long sequence at Panga ya Saidi, coastal Kenya, rather than one replacing the other at a horizon.",
        notes:
          "The same claim as on the previous period, cited from the other side. The African Later Stone Age begins earlier than the European Upper Palaeolithic on this evidence, and gradually — which is the whole reason for keeping the two frameworks apart.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 11
  // -------------------------------------------------------------------------
  {
    slug: "neolithic-transition",
    name: "Neolithic transition",
    aliases: ["Neolithic Revolution", "Neolithic", "New Stone Age"],
    summary: "Farming, in several regions, independently, over thousands of years. Not one event.",
    description:
      "Archaeological evidence is interpreted as showing that communities in several regions independently shifted towards varying combinations of cultivation, animal management, farming, and increasingly permanent settlement.\n\n" +
      "CALLED A TRANSITION HERE, NOT A REVOLUTION. \"Neolithic Revolution\" is the older and more familiar label, kept as an alias so a search finds it — but it carries two claims that the evidence does not support: that it was fast, and that it was one thing. It happened separately in the Levant, in China, in New Guinea, in Mesoamerica and in the Andes, from different wild species, over thousands of years each.\n\n" +
      "Nor was it a destination. Many societies cultivated for a while and stopped; many combined farming with hunting and gathering indefinitely; many never took it up and were not waiting to. A timeline that draws one arrow from foraging to farming is drawing a story, not a record.",
    periodType: "archaeological",
    framework: "Mainstream archaeology",
    definingCriteria:
      "Defined by a way of living — cultivation, herding, permanent settlement, ground stone tools, and in most regions pottery — and not by a date. Each region enters it when its own evidence shows those things, which is why the boundary claims below are regional.",
    evidence:
      "Charred plant remains showing domestication traits; animal bone assemblages shifting in species, age and sex profile; permanent architecture and storage; grinding stones; and radiocarbon dates on the deposits containing them.",
    interpretation:
      "Reading a change in seed morphology as domestication, or a change in a bone assemblage as herding, is an interpretation of physical remains — and one that has been revised repeatedly as sampling improves. That the regional transitions were independent rather than diffused is also an interpretation, resting on different wild ancestors in each region.",
    displayPriority: 40,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/G\u00f6bekli_Tepe_Pillar.JPG?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/G\u00f6bekli_Tepe_Pillar.JPG?width=1024",
        shows: "site",
        caption:
          "A carved T-shaped pillar at G\u00f6bekli Tepe, built by people who had not yet taken up farming. THAT IS " +
          "WHY IT IS HERE: the monument comes BEFORE agriculture in this place, so the tidy sequence of " +
          "farming-then-settling-then-building does not hold, and this period's name carries an assumption its " +
          "own evidence complicates.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "wikipedia_ppna",
        startYear: bce(10000),
        endYear: bce(8800),
        region: "Levant",
        datePrecision: "year",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "c. 10,000–8800 BCE",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        evidence: "The Pre-Pottery Neolithic A, the earliest Neolithic phase in the Levant, dated by radiocarbon on sites including Jericho.",
        notes:
          "The earliest regional transition on current evidence, which is not the same as the origin of farming: it is the region that has been dug longest and dated most.",
      },
      {
        sourceKey: "britannica_neolithic",
        startYear: bce(10000),
        endYear: bce(3000),
        datePrecision: "year",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "the final stage of the Stone Age",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence:
          "The conventional definition as a general reference work gives it: ground or polished stone tools, dependence on domesticated plants and animals, settlement in permanent villages, and crafts including pottery and weaving.",
        notes:
          "Defined by a way of living rather than by dates — which is why the broad span here is so much wider than any single region's transition, and why it should not be read as a date range for an event.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 12
  // -------------------------------------------------------------------------
  {
    slug: "bronze-age",
    name: "Bronze Age",
    summary: "A metallurgical convention with no universal dates. Two regional boundary claims, and no global one.",
    description:
      "In several archaeological traditions, the term Bronze Age describes periods in which bronze metallurgy became significant, alongside developments that could include cities, states, writing systems and long-distance trade.\n\n" +
      "THERE IS NO GLOBAL BRONZE AGE AND NO GLOBAL DATE FOR IT. It begins around 3000 BCE in southern Mesopotamia and around 2500–2200 BCE in Britain, and those are not approximations of one another. This entry carries the two regional claims that could be verified from good sources and does not invent the rest; the Aegean, Egypt, China and the Indus region all have their own well-studied sequences, and they belong here as further regional claims when they can be cited properly rather than as a rounded average now.\n\n" +
      "Nor did every society called Bronze Age have cities, states or writing. The list of things that \"could include\" is a list of things that sometimes accompanied bronze, in some places, and the word does not carry them.",
    periodType: "archaeological",
    framework: "Mainstream archaeology",
    definingCriteria:
      "Defined by the significance of bronze metallurgy in a regional sequence — and therefore by that region's evidence, not by a calendar. A region's Bronze Age ends when iron becomes the working metal, which again happens at different times.",
    evidence:
      "Bronze objects and the moulds, crucibles and slag of their making; tin and copper sources and the trade in them; settlement and burial sequences; and, where they exist, written records.",
    interpretation:
      "Periodising by metal is a nineteenth-century scheme that has been kept because it is useful for ordering material, not because societies organised themselves by it. Reading the arrival of bronze as the start of an age is a convention of archaeologists.",
    displayPriority: 35,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Himmelsscheibe_von_Nebra_-_Landesmuseum_f\u00fcr_Vorgeschichte_in_Halle.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Himmelsscheibe_von_Nebra_-_Landesmuseum_f\u00fcr_Vorgeschichte_in_Halle.jpg?width=1024",
        shows: "artefact",
        caption:
          "The Nebra sky disc, in the State Museum of Prehistory at Halle. Its date and its interpretation have " +
          "both been argued over \u2014 it was LOOTED RATHER THAN EXCAVATED, so its context had to be reconstructed " +
          "afterwards, which is a weaker footing than a recorded find. One object from one region of a period " +
          "that begins at different times in different places.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Bronze_and_gold_swords_buried_with_the_Nebra_Sky_Disc.png?width=1024",
        shows: "artefact",
        caption:
          "The swords found with the Nebra disc. THEY ARE WHY THE DATE IS ARGUED ABOUT: the disc cannot be " +
          "dated directly, so it is dated by the hoard it was buried in \u2014 and because the hoard was looted " +
          "rather than excavated, the association between the disc and these swords had to be reconstructed " +
          "after the fact rather than recorded in the ground.",
        kind: "image",
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "met_mesopotamia",
        startYear: bce(3000),
        endYear: bce(2000),
        region: "Mesopotamia",
        datePrecision: "year",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "Early Bronze Age, ca. 3000–2000 B.C.",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "The museum's own chronology for southern Mesopotamia: the Chalcolithic running to about 3000 BCE and the Early Bronze Age from about 3000 BCE, set against the Uruk sequence and the appearance of cuneiform writing.",
        notes:
          "The claim is for the Early Bronze Age specifically, which is what this source dates. The region's Bronze Age as a whole runs later; seeding the well-sourced part rather than an unsourced whole is the point.",
      },
      {
        sourceKey: "wikipedia_bronze_britain",
        startYear: bce(2500),
        endYear: bce(800),
        region: "Britain",
        datePrecision: "year",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "c. 2500–2200 BC until c. 800 BC",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        evidence: "The conventional British span, associated at its start with Beaker-using communities and ending as iron working becomes established.",
        notes:
          "Five hundred to a thousand years later than Mesopotamia's, and ending eight hundred years after Mesopotamia's Early Bronze Age did. Drawing one band for both would flatten precisely that.",
      },
      {
        sourceKey: "britannica_bronze",
        startYear: bce(3300),
        endYear: bce(1000),
        datePrecision: "year",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "the third phase in the development of material culture",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence: "The broad educational span as a general reference work gives it, following the Palaeolithic and Neolithic and ending as iron working spreads.",
        notes:
          "Recorded as the broad teaching convention it is, and deliberately NOT as the period's dates. The two regional claims above are the real content; this one is what a reader will meet in a textbook.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 13
  // -------------------------------------------------------------------------
  {
    slug: "iron-age",
    name: "Iron Age",
    summary: "Six regional boundary claims spanning more than a thousand years, and no single date at all.",
    description:
      "\"Iron Age\" is an archaeological periodisation used differently across regions, for periods in which iron production and use became increasingly significant.\n\n" +
      "THIS IS THE CLEAREST CASE ON THE WHOLE TIMELINE OF WHY A PERIOD CANNOT HAVE ONE DATE. The claims below place its beginning around 1200 BCE in the Near East, around 800 BCE in Britain, somewhere between 1800 and 1000 BCE in the Ganges plain, in the second half of the first millennium BCE in West Africa, later still around Lake Victoria, and around 600 BCE in China — and that last figure comes from the same reference work that gives 1200 BCE for the Near East.\n\n" +
      "NOR IS IT A LADDER. There is no general rule that a society passes from stone to bronze to iron: iron working in West Africa is not derived from the Near Eastern sequence, and the sub-Saharan record does not show a bronze stage preceding it. Imposing the Near Eastern chronology on Africa is the specific error this entry is built to avoid, and the reason it carries no global claim.",
    periodType: "archaeological",
    framework: "Mainstream archaeology",
    definingCriteria:
      "Defined by the significance of iron production and use in a regional sequence. Each region's archaeologists draw it from their own evidence, and there is no body that reconciles them.",
    evidence:
      "Smelting furnaces, tuyères and slag; iron objects; the settlement and ceramic sequences they sit in; and radiocarbon dates on charcoal from the furnaces themselves.",
    interpretation:
      "That a scatter of iron objects means iron production, or that iron production means an Iron Age, are both judgements. So is the reading of any regional sequence as independent rather than derived — an argument made from the absence of contact as much as from the finds.",
    displayPriority: 35,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Early_La_Tene_Sword_from_Hallstatt_Grave_994.JPG?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Early_La_Tene_Sword_from_Hallstatt_Grave_994.JPG?width=1024",
        shows: "artefact",
        caption:
          "An early La T\u00e8ne sword from grave 994 at Hallstatt. THE IRON AGE IS NOT ONE DATE: iron working " +
          "begins around 1200 BCE in the Near East, around 800 BCE in Britain, and the West African sequence is " +
          "derived from neither. This is central European, and it stands for central Europe.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "britannica_iron",
        startYear: bce(1200),
        region: "Near East and southeastern Europe",
        datePrecision: "year",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 1200 BCE",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence: "The conventional start as a general reference work gives it, following the collapse of Late Bronze Age trade networks and the disruption of access to tin.",
        notes: "The date most often quoted as \"the Iron Age\" without qualification. It is one region's.",
      },
      {
        sourceKey: "wikipedia_british_iron_age",
        startYear: bce(800),
        endYear: 43,
        region: "Britain",
        datePrecision: "year",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "c. 800 BC to the Roman invasion of AD 43",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence: "The conventional British span: iron working spreading from continental Europe from about 800 BCE, with iron artefacts in general use rather later, and the period closed by the Roman invasion.",
        notes:
          "Four hundred years after the Near East, and closed by a political event rather than a technological one — which is how archaeological periods usually end in regions with written history nearby.",
      },
      {
        sourceKey: "tewari2003",
        startYear: bce(1800),
        endYear: bce(1000),
        region: "South Asia",
        datePrecision: "year",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "c. 1800 BCE to 1000 BCE",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        evidence:
          "Iron artefacts, furnaces and tuyères excavated at Malhar, Raja Nala-ka-tila and Dadupur in Uttar Pradesh, with radiocarbon determinations reported across this range.",
        notes:
          "A range, not a date, and one that reaches earlier than the conventional Near Eastern start. Recorded as an archaeological claim from the excavator rather than as the settled chronology of the region.",
      },
      {
        sourceKey: "nok_taruga",
        startYear: bce(500),
        endYear: bce(200),
        region: "West Africa",
        datePrecision: "year",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "the second half of the first millennium BCE",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        evidence:
          "Iron-smelting furnaces at Taruga in central Nigeria, dated by radiocarbon on charcoal from within the furnaces, re-examined in the light of more recent Nok excavations.",
        notes:
          "Not derived from the Near Eastern sequence: the argument in this literature is that West African iron working developed without contact with North Africa, and that no bronze stage precedes it there. The Stone–Bronze–Iron ladder simply does not describe this region.",
      },
      {
        sourceKey: "clist1987",
        startYear: 100,
        endYear: 500,
        region: "East Africa — Great Lakes",
        datePrecision: "year",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "second to fifth centuries CE",
        datingMethod: "radiocarbon",
        chronology: "disputed",
        evidence:
          "A reappraisal of the radiocarbon determinations underlying the chronology of the early Urewe industry around Lake Victoria, arguing that the industry is later than the conventional reading places it.",
        notes:
          "Seeded as the disputed claim it is. The Urewe industry is often given as beginning around 500 BCE; this source argues from the dates themselves for a substantially later range. Both readings are in the literature, and averaging them would produce a number nobody holds.",
      },
      {
        sourceKey: "britannica_iron",
        startYear: bce(600),
        region: "China",
        datePrecision: "year",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "in China not until about 600 BCE",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence: "The same reference work's own statement, in the same sentence in which it gives about 1200 BCE for the Near East.",
        notes:
          "Six hundred years apart, from one source, in one sentence. It is the shortest possible demonstration that this period does not have a date.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 14
  // -------------------------------------------------------------------------
  {
    slug: "medieval-period",
    name: "Medieval period",
    aliases: ["Middle Ages", "Medieval"],
    region: "Europe",
    summary: "A European convention, named by the people who thought they were living after it.",
    description:
      "\"Medieval\" is primarily a European historical periodisation convention, commonly referring to the interval between antiquity and the early modern period.\n\n" +
      "WHERE THE WORD COMES FROM. Fifteenth-century scholars named the time between the fall of the western Roman Empire and their own as the middle age — a gap between two periods they valued, defined by being neither. Nobody living in it used the word. The judgement is built into the name.\n\n" +
      "WHAT IT DOES NOT COVER. These centuries hold the Abbasid and later Islamic empires, Tang and Song China, the Delhi Sultanate, Mali and Great Zimbabwe, the Mongol empire, the Inca and the Maya — histories with their own periodisations, none of which are \"middle\" anything. This record is marked as regional for that reason: it is a period OF EUROPE, and contemporary events elsewhere on this timeline sit inside its dates without belonging to it.",
    periodType: "historical",
    framework: "Mainstream European historiography",
    definingCriteria:
      "A convention, not a criterion. Its boundaries are conventionally the end of the western Roman Empire and, at the other end, some combination of the fall of Constantinople, printing, and European voyages across the Atlantic — each of which a different historian prefers.",
    evidence: "Written records in quantity — charters, chronicles, letters, legal and administrative documents — alongside archaeology, art and buildings.",
    interpretation:
      "That these centuries form a period at all is an interpretation, and one with a history of its own. It was coined as a judgement about cultural decline, and the scholarship of the last century has been substantially about undoing that judgement while keeping the word.",
    displayPriority: 30,
    claims: [
      {
        sourceKey: "britannica_middleages",
        startYear: 500,
        endYear: 1500,
        region: "Europe",
        datePrecision: "century",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 500 to 1400–1500 CE",
        datingMethod: "source_assertion",
        chronology: "historical",
        evidence:
          "The conventional European span as a general reference work gives it, together with the origin of the term among 15th-century scholars naming the period between their own time and the fall of the western Roman Empire.",
        notes: "Both ends are conventions. The far end is given as a range in the source itself, because historians place it differently depending on which change they treat as decisive.",
        citations: [
          {
            sourceKey: "jmw_global_middle_ages",
            relation: "context",
            note: "On the problem of extending a European periodisation to the rest of the world, and on what \"global middle ages\" scholarship is trying to do about it.",
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // 15
  // -------------------------------------------------------------------------
  {
    slug: "modern-era",
    name: "Modern era",
    aliases: ["Modern period", "Modernity"],
    summary: "A convention beginning around 1500 CE, running to the present — and a boundary nothing crossed.",
    description:
      "\"Modern era\" is a broad historical periodisation convention, commonly associated with developments including maritime expansion and colonisation, scientific and industrial transformation, nation-states, mass communication and, latterly, digital technology.\n\n" +
      "ITS BEGINNING IS A CONVENTION AND NOT AN EVENT. Around 1500 nothing happened worldwide. The date is chosen from a cluster of changes in European history — printing, the Atlantic voyages, the Reformation, the end of the Byzantine empire — and then applied outward. Somebody in Ming China or in the Inca empire in 1500 crossed no boundary.\n\n" +
      "It is usually subdivided into early modern, modern and contemporary. Those are deliberately not seeded: the model supports child periods, and adding three more conventions to demonstrate that it does would be adding three more conventions.",
    periodType: "historical",
    framework: "Mainstream historiography",
    definingCriteria:
      "A convention. Conventionally opened around 1500 CE and running to the present, with no agreed criterion beyond the cluster of changes historians associate with it.",
    evidence: "Written, printed and, later, recorded and digital records in overwhelming quantity, alongside the material record of industry, cities and transport.",
    interpretation:
      "Calling this stretch \"modern\" implies a break from what came before and a kinship with the present, both of which are judgements. The convention is useful and it is not a description of anything that occurred.",
    displayPriority: 30,
    claims: [
      {
        sourceKey: "britannica_middleages",
        startYear: 1500,
        isOngoing: true,
        datePrecision: "century",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "from about 1500 CE",
        datingMethod: "source_assertion",
        chronology: "historical",
        evidence:
          "The far end of the conventional medieval span, read as the near end of the modern one — which is what this boundary is: one convention's end used as another's beginning.",
        notes:
          "Recorded as ongoing. Writing an end date would invent a boundary nobody has claimed, and the period is, by construction, the one we are inside.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// How these periods relate
//
// Deliberately sparse, and deliberately not a tree. A 'contains' edge says one
// period's span encloses another's; 'related' says the two are worth reading
// together. Geological, archaeological and historical periodisations run in
// parallel over the same centuries without nesting inside one another, so
// forcing them into a single hierarchy would mean choosing which framework is
// the real one.
// ---------------------------------------------------------------------------

export const PERIOD_LINKS: SeedPeriodLink[] = [
  // The one genuine cross-framework containment worth stating: everything from
  // the earliest hominin candidates onwards happens inside the Cenozoic.
  { from: "cenozoic-era", to: "early-human-ancestors", relation: "contains" },
  { from: "cenozoic-era", to: "early-stone-age-lower-palaeolithic", relation: "contains" },

  // Successive, within one framework.
  { from: "early-universe", to: "early-earth", relation: "related" },
  { from: "early-earth", to: "age-of-early-life", relation: "related" },
  { from: "age-of-early-life", to: "paleozoic-era", relation: "related" },
  { from: "paleozoic-era", to: "mesozoic-era", relation: "related" },
  { from: "mesozoic-era", to: "cenozoic-era", relation: "related" },

  // Successive, within the archaeological frameworks.
  { from: "early-human-ancestors", to: "early-stone-age-lower-palaeolithic", relation: "related" },
  { from: "early-stone-age-lower-palaeolithic", to: "middle-palaeolithic-middle-stone-age", relation: "related" },
  { from: "middle-palaeolithic-middle-stone-age", to: "upper-palaeolithic-later-stone-age", relation: "related" },
  { from: "upper-palaeolithic-later-stone-age", to: "neolithic-transition", relation: "related" },
  { from: "neolithic-transition", to: "bronze-age", relation: "related" },
  { from: "bronze-age", to: "iron-age", relation: "related" },

  // Successive, within the historical conventions.
  { from: "iron-age", to: "medieval-period", relation: "related" },
  { from: "medieval-period", to: "modern-era", relation: "related" },
];
