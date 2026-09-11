import { astronomicalFromYearsAgo } from "./time";
import type { SeedEvent, SeedSource, SeedTrack } from "./seed-types";

// THE MIDDLE PLEISTOCENE — TEN RECORDS FROM A WORLD WITH NO WRITING.
//
// The Hannibal dataset asks how we know what happened when the evidence is
// texts. This one asks the same question where there are no texts at all: no
// names, no dates, no witnesses, and nobody who could have written any of it
// down. Everything here is inferred — from teeth, magnetised rock, oxygen
// isotopes in the shells of dead plankton, cut marks on bone, and the genomes
// of people who died three hundred thousand years ago.
//
// WHY IT BELONGS ON THIS TIMELINE. The rule is the same as everywhere else in
// this feature — an event has no date, sources make claims, and the claims are
// shown with the method that produced them — but in deep time it stops being a
// nicety and becomes the only honest way to write anything down. "Neanderthals
// and modern humans diverged" has no date; it has estimates from genomes, from
// teeth, and from fossils, and they disagree by a quarter of a million years
// for reasons that are themselves interesting.
//
// WHAT THIS DATASET REFUSES TO DO.
//
//   · No invented precision. Where the evidence supports a range, the claim is
//     a range. 700,000–200,000 years ago is not 450,000 years ago.
//   · No event moved to fit the batch. This was seeded as "a set of records
//     around 600,000 years ago", and several of them are not: the
//     Brunhes–Matuyama reversal is at ~773 ka, Boxgrove at ~480 ka, the
//     Schöningen spears at ~300 ka, the first Acheulean handaxes at 1.76 Ma.
//     They sit where the evidence puts them, which is the entire point of
//     putting them on a timeline.
//   · Nothing invented. Every source below is a real publication with real
//     bibliographic details; where a DOI could not be verified it is omitted
//     rather than guessed, and nothing is quoted that could not be checked.
//   · No confidence scores, and none may be added.
//
// A NOTE ON THE TAXONOMY. "Homo heidelbergensis" is used here because it is
// the label most of the cited literature uses, not because the category is
// settled — it is actively disputed, and that dispute has an entry of its own.

/** Thousands of years ago → astronomical year. 600 ka is about −598,000. */
const ka = (thousands: number): number => astronomicalFromYearsAgo(thousands * 1000);
/** Millions of years ago → astronomical year. */
const Ma = (millions: number): number => astronomicalFromYearsAgo(millions * 1_000_000);

/** Present means the dataset has been seeded. */
export const DEEP_TIME_ANCHOR_SLUG = "brunhes-matuyama-reversal";

export const DEEP_TIME_TRACK: SeedTrack = {
  name: "Deep human past",
  slug: "deep-human-past",
  kind: "theme",
  color: "#5a6b7a",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const DEEP_TIME_SOURCES: SeedSource[] = [
  {
    key: "wagner2010",
    title: "Radiometric dating of the type-site for Homo heidelbergensis at Mauer, Germany",
    author: "Günther A. Wagner and colleagues",
    publisher: "National Academy of Sciences",
    workTitle: "Proceedings of the National Academy of Sciences",
    reference: "PNAS 107(46), 19726–19730. DOI 10.1073/pnas.1012722107",
    url: "https://www.pnas.org/doi/10.1073/pnas.1012722107",
    sourceType: "academic_paper",
    publishedYear: 2010,
    publishedDisplay: "2010",
    notes:
      "Dates the Mauer sand pit — the find spot of the jawbone that DEFINES Homo heidelbergensis — by two independent methods: combined electron spin resonance / uranium-series on mammal teeth, and infrared radiofluorescence on sand grains. Cited for the age it reports, 609 ± 40 thousand years, and for the fact that two methods were made to agree before it was published.",
  },
  {
    key: "roksandic2022",
    title: "Resolving the “muddle in the middle”: The case for Homo bodoensis sp. nov.",
    author: "Mirjana Roksandic and colleagues",
    publisher: "Wiley",
    workTitle: "Evolutionary Anthropology: Issues, News, and Reviews",
    reference: "DOI 10.1002/evan.21929",
    url: "https://onlinelibrary.wiley.com/doi/10.1002/evan.21929",
    sourceType: "academic_paper",
    publishedYear: 2022,
    publishedDisplay: "2022",
    notes:
      "Argues that Homo heidelbergensis and Homo rhodesiensis are too poorly and variably defined to be useful and should be abandoned, and proposes Homo bodoensis for early Middle Pleistocene African populations. Cited for the position, not as a settled outcome — it was published into an argument and the argument continues.",
  },
  {
    key: "delson2022",
    title:
      "The naming of Homo bodoensis by Roksandic and colleagues does not resolve issues surrounding Middle Pleistocene human evolution",
    author: "Eric Delson and Chris Stringer",
    publisher: "Wiley",
    workTitle: "Evolutionary Anthropology: Issues, News, and Reviews",
    reference: "DOI 10.1002/evan.21950",
    url: "https://onlinelibrary.wiley.com/doi/abs/10.1002/evan.21950",
    sourceType: "academic_paper",
    publishedYear: 2022,
    publishedDisplay: "2022",
    notes:
      "The published reply: a new name does not fix the underlying problem, which is that Middle Pleistocene fossils vary more than any small set of species labels can carry. Cited as the other side of a live taxonomic dispute.",
  },
  {
    key: "roberts1994",
    title: "A hominid tibia from Middle Pleistocene sediments at Boxgrove, UK",
    author: "Mark B. Roberts, Chris B. Stringer and Simon A. Parfitt",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature 369, 311–313",
    url: "https://www.nature.com/articles/369311a0",
    sourceType: "academic_paper",
    publishedYear: 1994,
    publishedDisplay: "1994",
    notes:
      "The publication of the Boxgrove shin bone, found with stone tools in temperate sediments correlated with Marine Isotope Stage 13 and reported at about 480,000 years old. Cited for the fossil, its context and that correlation.",
  },
  {
    key: "parfitt2010",
    title: "Early Pleistocene human occupation at the edge of the boreal zone in northwest Europe",
    author: "Simon A. Parfitt and colleagues",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature 466, 229–233. DOI 10.1038/nature09117",
    url: "https://www.nature.com/articles/nature09117",
    sourceType: "academic_paper",
    publishedYear: 2010,
    publishedDisplay: "2010",
    notes:
      "Flint artefacts from the foreshore at Happisburgh, Norfolk, in deposits older than the Brunhes–Matuyama reversal. Cited here for one purpose: it is why nobody may say humans first reached Europe 600,000 years ago. They were in Britain long before that.",
  },
  {
    key: "lepre2011",
    title: "An earlier origin for the Acheulian",
    author: "Christopher J. Lepre and colleagues",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature 477, 82–85",
    url: "https://www.nature.com/articles/nature10372",
    sourceType: "academic_paper",
    publishedYear: 2011,
    publishedDisplay: "2011",
    notes:
      "Handaxes from Kokiselei, West Turkana, Kenya, dated to about 1.76 million years ago. Cited so that the Acheulean entry cannot be read as saying handaxes were invented in the Middle Pleistocene: by 600,000 years ago the technology was already more than a million years old.",
  },
  {
    key: "beyene2013",
    title: "The characteristics and chronology of the earliest Acheulean at Konso, Ethiopia",
    author: "Yonas Beyene and colleagues",
    publisher: "National Academy of Sciences",
    workTitle: "Proceedings of the National Academy of Sciences",
    reference: "DOI 10.1073/pnas.1221285110",
    url: "https://www.pnas.org/doi/10.1073/pnas.1221285110",
    sourceType: "academic_paper",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "A long, well-dated Acheulean sequence at Konso, cited for the early chronology of the industry and for how the shaping of handaxes changes across it.",
  },
  {
    key: "thieme1997",
    title: "Lower Palaeolithic hunting spears from Germany",
    author: "Hartmut Thieme",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature 385, 807–810",
    url: "https://www.nature.com/articles/385807a0",
    sourceType: "academic_paper",
    publishedYear: 1997,
    publishedDisplay: "1997",
    notes:
      "The Schöningen spears: worked wooden weapons found with butchered horses. Cited for the find itself. The age first reported for the spear horizon has since been revised younger — see the claim, where the revision is the point rather than a footnote.",
  },
  {
    key: "prufer2014",
    title: "The complete genome sequence of a Neanderthal from the Altai Mountains",
    author: "Kay Prüfer and colleagues",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature 505, 43–49. DOI 10.1038/nature12886",
    url: "https://www.nature.com/articles/nature12886",
    sourceType: "academic_paper",
    publishedYear: 2014,
    publishedDisplay: "2014",
    notes:
      "A high-coverage genome from a Neanderthal woman from Denisova Cave, with an analysis of the relationships between Neanderthals, Denisovans and present-day humans. Cited for the population-divergence estimate that most later work argues with.",
  },
  {
    key: "meyer2016",
    title: "Nuclear DNA sequences from the Middle Pleistocene Sima de los Huesos hominins",
    author: "Matthias Meyer and colleagues",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature 531, 504–507. DOI 10.1038/nature17405",
    url: "https://www.nature.com/articles/nature17405",
    sourceType: "academic_paper",
    publishedYear: 2016,
    publishedDisplay: "2016",
    notes:
      "Nuclear DNA from 430,000-year-old fossils at Sima de los Huesos, Spain, showing them closer to Neanderthals than to Denisovans — which puts a floor under the Neanderthal–Denisovan split and constrains anything earlier. Also the source for those fossils being dated to about 430,000 years.",
  },
  {
    key: "gomezrobles2019",
    title: "Dental evolutionary rates and its implications for the Neanderthal–modern human divergence",
    author: "Aida Gómez-Robles",
    publisher: "American Association for the Advancement of Science",
    workTitle: "Science Advances",
    reference: "Science Advances 5(5), eaaw1268. DOI 10.1126/sciadv.aaw1268",
    url: "https://www.science.org/doi/10.1126/sciadv.aaw1268",
    sourceType: "academic_paper",
    publishedYear: 2019,
    publishedDisplay: "2019",
    notes:
      "Models how fast hominin teeth change shape, and finds that the Sima de los Huesos teeth are too Neanderthal-like for a young divergence: a last common ancestor more recent than about 800,000 years ago would require dental evolution faster than anything else measured. Cited for an estimate reached from fossils rather than from DNA — which is why it lands somewhere different.",
  },
  {
    key: "lisiecki2005",
    title: "A Pliocene-Pleistocene stack of 57 globally distributed benthic δ18O records",
    author: "Lorraine E. Lisiecki and Maureen E. Raymo",
    publisher: "American Geophysical Union",
    workTitle: "Paleoceanography",
    reference: "Paleoceanography 20, PA1003. DOI 10.1029/2004PA001071",
    url: "https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2004pa001071",
    sourceType: "academic_paper",
    publishedYear: 2005,
    publishedDisplay: "2005",
    notes:
      "The LR04 stack — 57 deep-sea records of oxygen isotopes in the shells of bottom-dwelling foraminifera, aligned into one curve of global ice volume over five million years. It is the reference frame the Marine Isotope Stages are numbered against, and it is how a cave or a gravel pit gets tied to a global climate record at all.",
  },
  {
    key: "chibaGSSP",
    title: "GSSP for the Chibanian Stage and Middle Pleistocene Subseries, Chiba section, Japan",
    author: "International Commission on Stratigraphy",
    publisher: "International Commission on Stratigraphy",
    reference: "Ratified 17 January 2020",
    url: "https://stratigraphy.org/gssps/chibanian",
    sourceType: "museum",
    publishedYear: 2020,
    publishedDisplay: "ratified 2020",
    notes:
      "The formal definition of the base of the Middle Pleistocene, at the Chiba section in Japan. Cited for the astronomical age of the boundary and for the position of the Matuyama–Brunhes magnetic reversal relative to it — the reversal's directional midpoint is dated 772.9 thousand years.",
  },
  {
    key: "marathousa2018",
    title: "The Lower Palaeolithic site of Marathousa 1, Megalopolis, Greece: Overview of the evidence",
    author:
      "Eleni Panagopoulou, Vangelis Tourloukis, Nicholas Thompson, Athanassios Athanassiou, Georgia Tsartsidou, George E. Konidaris, Domenico Giusti, Panagiotis Karkanas and Katerina Harvati",
    publisher: "Elsevier",
    workTitle: "Quaternary International",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S1040618218302568",
    sourceType: "academic_paper",
    publishedYear: 2018,
    publishedDisplay: "2018",
    notes:
      "A Middle Pleistocene site where the partial skeleton of one straight-tusked elephant lay in direct association with stone tools, with cut marks on the bones. Cited for the association and the butchery evidence — and deliberately not for a hunt, which the site does not establish.",
  },
  {
    key: "nhm",
    title: "Pathways to Ancient Britain — Pioneering populations",
    author: "Natural History Museum, London",
    publisher: "Natural History Museum",
    url: "https://www.nhm.ac.uk/our-science/our-work/origins-evolution-and-futures/pathways-ancient-britain/pioneering-populations.html",
    sourceType: "museum",
    publishedDisplay: "continuously updated",
    notes:
      "An institutional summary of the British Lower Palaeolithic record from the museum whose researchers dug much of it. Cited as an accessible way in to Happisburgh, Boxgrove and the pattern of repeated arrival and disappearance those sites describe.",
  },
  {
    key: "smithsonian",
    title: "Human Origins Program",
    author: "Smithsonian National Museum of Natural History",
    publisher: "Smithsonian Institution",
    url: "https://humanorigins.si.edu",
    sourceType: "museum",
    publishedDisplay: "continuously updated",
    notes:
      "A museum reference for the species names, the fossils behind them and the shape of the current argument. Cited as an accessible overview rather than as evidence for any particular date.",
  },
  {
    key: "wikipedia_bm",
    title: "Brunhes–Matuyama reversal — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Brunhes%E2%80%93Matuyama_reversal",
    sourceType: "wikipedia",
    publishedDisplay: "continuously edited",
    notes:
      "Included as the accessible starting point it is, and labelled for what it is: a tertiary source anyone can edit. It is where most readers will meet this reversal; the stratigraphic definition beside it is where the number actually comes from.",
  },
  {
    key: "wikipedia_hh",
    title: "Homo heidelbergensis — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Homo_heidelbergensis",
    sourceType: "wikipedia",
    publishedDisplay: "continuously edited",
    notes:
      "A tertiary source, cited as an entry point to a contested category. Its own reference list is more useful than the article, which is true of every Wikipedia entry in this timeline and is the reason it is shown as a source rather than hidden inside one.",
  },
];

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export const DEEP_TIME_EVENTS: SeedEvent[] = [
  // 1 -----------------------------------------------------------------------
  {
    slug: "homo-heidelbergensis-populations",
    title: "Homo heidelbergensis populations",
    summary: "A name given to Middle Pleistocene humans in Africa and Europe — and a name specialists are arguing about.",
    description:
      "Between roughly 700,000 and 200,000 years ago, populations of large-brained humans lived across Africa and Europe, and probably in parts of Asia. Many of their fossils have been grouped under the name Homo heidelbergensis, after a jawbone found in a sand pit at Mauer, near Heidelberg, in 1907.\n\n" +
      "WHAT IS NOT IN DOUBT: the fossils. Mauer, Boxgrove, Arago, Petralona, Bodo, Kabwe, Sima de los Huesos and others are real, dated by real methods, and describe populations with brains approaching modern size, sophisticated stone tools, and — at some sites — the hunting and butchery of very large animals.\n\n" +
      "WHAT IS IN DOUBT: whether they are one species, and whether this name should be used at all. The category has been criticised for decades as a place to put anything too recent to be Homo erectus and too old to be a Neanderthal or a modern human — the 'muddle in the middle'. In 2021–22 one group proposed abandoning it, along with Homo rhodesiensis, in favour of a new name, Homo bodoensis; others replied in print that renaming does not solve a problem that is really about how much these populations varied.\n\n" +
      "This entry keeps the fossils and the argument apart. The dates below are dates for populations and fossils. The name is a separate question, and an unsettled one.",
    category: "people",
    subcategory: "Middle Pleistocene",
    eventType: "disputed",
    eventTypeNote:
      "The fossils are not in dispute. The species label applied to them is, actively and in print.",
    tags: ["human-evolution", "middle-pleistocene", "taxonomy", "palaeoanthropology", "deep-time"],
    people: ["Homo heidelbergensis"],
    civilisations: [],
    locationName: "Africa and Europe",
    claims: [
      {
        sourceKey: "smithsonian",
        citations: [
          { sourceKey: "wagner2010", relation: "supports", note: "Dates the type site at Mauer, which anchors the earlier end of the range." },
          { sourceKey: "meyer2016", relation: "supports", note: "Dates the Sima de los Huesos fossils to about 430,000 years — well inside this span, and genetically closer to Neanderthals." },
          { sourceKey: "wikipedia_hh", relation: "context", note: "An accessible summary of the category and of the fossils usually assigned to it." },
        ],
        startYear: ka(700),
        endYear: ka(200),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "approximately 700,000–200,000 years ago",
        datingMethod: "Radiometric and luminescence dating of individual sites, correlated with marine isotope stratigraphy",
        chronology: "conventional",
        evidence:
          "The span across which fossils commonly assigned to this group are dated. It is a range because it is a summary of many separately dated sites — Mauer at about 609,000 years, Boxgrove at about 480,000, Sima de los Huesos at about 430,000 — and not a single measurement of anything.",
        notes:
          "A range of this width is not vagueness. It is the correct shape of the claim: these are populations spread over half a million years and two continents, and a single number would describe none of them.",
      },
      {
        sourceKey: "roksandic2022",
        citations: [
          { sourceKey: "delson2022", relation: "disputes", note: "Replies in print that a new name does not resolve the underlying variability, and questions the case for abandoning the old one." },
          { sourceKey: "smithsonian", relation: "context", note: "The museum overview of how these fossils are usually grouped." },
        ],
        startYear: ka(700),
        endYear: ka(200),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "the same fossils, under a different name (Homo bodoensis)",
        datingMethod: "Taxonomic revision — a reassessment of published fossils, not a new measurement",
        chronology: "disputed",
        evidence:
          "A published proposal that Homo heidelbergensis and Homo rhodesiensis should be abandoned as poorly and variably defined, and that early Middle Pleistocene African populations be called Homo bodoensis instead. The dates are unchanged; what changes is what the fossils are called and how they are grouped.",
        notes:
          "Included as a claim rather than a footnote because it is a genuine, current, published disagreement about the identity of the thing being dated — and because a reader should be able to see that a species name is an argument, not an observation.",
      },
    ],
  },

  // 2 -----------------------------------------------------------------------
  {
    slug: "acheulean-technology-established",
    title: "Acheulean handaxe technology in full use",
    summary: "By 600,000 years ago the handaxe was already more than a million years old — and still being made.",
    description:
      "The Acheulean is the long-running stone tool tradition defined by the bifacial handaxe: a core worked on both faces to a symmetrical edge, usually oval or pear-shaped, made in the maker's mind before it was made in stone.\n\n" +
      "IT WAS NOT INVENTED AT 600,000 YEARS AGO, and this entry exists partly to say so. The earliest known handaxes, from Kokiselei in West Turkana, are dated to about 1.76 million years ago. What is true of the Middle Pleistocene is that the technology was established, widespread and being made well — across Africa, into Europe and across southern Asia — and that at some sites the shaping becomes noticeably more controlled.\n\n" +
      "WHAT ARCHAEOLOGISTS INFER, AND HOW FAR. A well-made handaxe implies a sequence of actions held in mind toward an end result, motor skill learned over years, and knowledge passed between people — teaching of some kind. It does not, by itself, tell us about language, and careful writers do not claim that it does.\n\n" +
      "The tools themselves cannot be dated directly. Their age comes from the deposits containing them: radiometric dating where there is volcanic material, magnetic polarity, the sequence of the layers, and the animals found alongside them.",
    category: "archaeology",
    subcategory: "Lower Palaeolithic",
    eventType: "archaeological_interpretation",
    eventTypeNote: "A technology in use across a long span, not an invention at a moment.",
    tags: ["acheulean", "stone-tools", "lower-palaeolithic", "handaxe", "deep-time"],
    civilisations: [],
    locationName: "Africa, Europe and southern Asia",
    claims: [
      {
        sourceKey: "beyene2013",
        citations: [
          { sourceKey: "lepre2011", relation: "context", note: "The earliest known handaxes, at about 1.76 million years — the reason this entry is about a technology in use rather than an invention." },
          { sourceKey: "roberts1994", relation: "supports", note: "Acheulean handaxes in a dated British context at about 480,000 years." },
        ],
        startYear: ka(700),
        endYear: ka(500),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "established and in widespread use around 700,000–500,000 years ago",
        datingMethod: "Radiometric dating of associated deposits, stratigraphy, palaeomagnetism and associated fauna",
        chronology: "conventional",
        evidence:
          "Acheulean assemblages are dated at many sites across this span by the deposits that contain them. None of the dating is of the tools themselves: stone cannot be dated by being flaked, so every Acheulean date is really a date for a layer, a lava flow, a magnetic reversal or an animal bone.",
      },
      {
        sourceKey: "lepre2011",
        citations: [
          { sourceKey: "beyene2013", relation: "supports", note: "An independently dated early Acheulean sequence at Konso, Ethiopia." },
        ],
        startYear: Ma(1.76),
        datePrecision: "million_years",
        precisionDecimals: 2,
        isApproximate: true,
        originalDateText: "the earliest known Acheulean handaxes, about 1.76 million years ago",
        datingMethod: "Magnetostratigraphy and radiometric dating at Kokiselei, West Turkana",
        chronology: "scientific",
        evidence:
          "Handaxes from Kokiselei dated to about 1.76 million years ago — some 350,000 years older than the previous earliest record when published. Shown as its own claim, at its own date, so that this entry cannot be misread as the moment handaxes appear.",
        notes:
          "On the timeline this sits more than a million years to the left of everything else in the dataset. That distance is the correct visual answer to 'when were handaxes invented?'",
      },
    ],
  },

  // 3 -----------------------------------------------------------------------
  {
    slug: "boxgrove-early-humans",
    title: "Early humans at Boxgrove, England",
    summary: "A shin bone, two teeth, hundreds of handaxes and a butchered horse, on a buried coastal plain in Sussex.",
    description:
      "At Eartham Quarry near Boxgrove in West Sussex, excavation exposed a Middle Pleistocene land surface sealed beneath later deposits: a coastal plain below a chalk cliff, with freshwater pools, where humans made handaxes and butchered large animals.\n\n" +
      "WHAT WAS FOUND. A human shin bone, published in 1994; two incisor teeth, from a different individual; large numbers of Acheulean handaxes, some lying where they were made, with the flakes still refittable around the space where the knapper sat; and the bones of rhinoceros, red deer, bear and horse, carrying cut marks made by stone tools.\n\n" +
      "WHY IT MATTERS TO THIS DATASET. Boxgrove is one of very few sites where the evidence is fine-grained enough to describe a few hours of work rather than an average of ten thousand years. It is also a caution about dates: the site is regularly described as '500,000 years old', while the published dating correlates it with Marine Isotope Stage 13 at about 480,000 years ago. The claim below uses the published figure.",
    category: "archaeology",
    subcategory: "Lower Palaeolithic",
    eventType: "archaeological_interpretation",
    tags: ["boxgrove", "britain", "acheulean", "butchery", "lower-palaeolithic", "deep-time"],
    people: ["Homo heidelbergensis"],
    locationName: "Eartham Quarry, Boxgrove, West Sussex, England",
    lat: 50.8639,
    lng: -0.7186,
    claims: [
      {
        sourceKey: "roberts1994",
        citations: [
          { sourceKey: "lisiecki2005", relation: "supports", note: "The marine isotope framework the site's temperate sediments are correlated against." },
          { sourceKey: "nhm", relation: "context", note: "The museum's account of Boxgrove within the British Lower Palaeolithic record." },
        ],
        startYear: ka(480),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 480,000 years ago (Marine Isotope Stage 13)",
        datingMethod: "Correlation of temperate sediments with marine isotope stratigraphy, supported by biostratigraphy",
        chronology: "conventional",
        evidence:
          "The published age. The Boxgrove sediments are temperate — they were laid down in a warm interval — and are correlated with Marine Isotope Stage 13, which the deep-sea record places at roughly this age. The correlation rests on the sediments and their fossil content rather than on a clock in the ground at Boxgrove itself.",
        notes:
          "CORRECTED FROM THE SUGGESTION THAT SEEDED THIS ENTRY. It was proposed as 'approximately 500,000 years ago'. The published dating is about 480,000 years, MIS 13, and that is what is recorded here — the round number is a convenience, not a measurement.",
      },
      {
        sourceKey: "roberts1994",
        citations: [
          { sourceKey: "nhm", relation: "context", note: "Boxgrove's place among the repeated occupations and abandonments of early Britain." },
        ],
        startYear: ka(500),
        endYear: ka(450),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "the interglacial the site belongs to, roughly 500,000–450,000 years ago",
        datingMethod: "Marine isotope stage correlation, expressed as the length of the warm interval rather than a point",
        chronology: "archaeological",
        evidence:
          "The wider window the correlation actually supports. Marine Isotope Stage 13 is a warm interval lasting tens of thousands of years, and the site sits somewhere inside it; a single figure of 480,000 is the middle of a range, not a measurement of the day the horse was butchered.",
      },
    ],
  },

  // 4 -----------------------------------------------------------------------
  {
    slug: "middle-pleistocene-hunting-and-butchery",
    title: "Hunting and butchering large animals",
    summary: "Cut marks are evidence. Hunting is an inference — and at a few sites, a strong one.",
    description:
      "Across the Middle Pleistocene there is repeated evidence that humans were acquiring, butchering and eating very large animals. How they acquired them is the harder question, and the answer is not the same at every site.\n\n" +
      "WHAT THE EVIDENCE ACTUALLY DISTINGUISHES:\n\n" +
      "· BUTCHERY is directly observable. Stone tools leave cut marks on bone, and cut marks are read by their shape and position, and distinguished from carnivore tooth marks and from damage caused after burial.\n" +
      "· ORDER OF ACCESS is partly observable. Cut marks underneath carnivore tooth marks suggest humans got there first; the reverse suggests scavenging.\n" +
      "· HUNTING is an inference. It is strongest where the weapons survive — as at Schöningen, where wooden spears were found with the remains of many butchered horses — and weakest where all that survives is an animal and some tools in the same layer.\n\n" +
      "This entry keeps those apart, and so should anyone reading it. 'Associated with tools' is not 'butchered'; 'butchered' is not 'hunted'.",
    category: "archaeology",
    subcategory: "Subsistence",
    eventType: "archaeological_interpretation",
    eventTypeNote:
      "Three different strengths of evidence — association, butchery, hunting — shown as three different things.",
    tags: ["hunting", "butchery", "zooarchaeology", "middle-pleistocene", "deep-time"],
    locationName: "Europe and Africa",
    claims: [
      {
        sourceKey: "roberts1994",
        citations: [
          { sourceKey: "marathousa2018", relation: "supports", note: "Cut-marked elephant bones in direct association with stone tools, at about 430,000 years." },
          { sourceKey: "nhm", relation: "context", note: "The wider British and European record of butchered large mammals." },
        ],
        startYear: ka(500),
        endYear: ka(400),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "butchery of large mammals, roughly 500,000–400,000 years ago",
        datingMethod: "Archaeological context — cut-marked bone in dated deposits",
        chronology: "conventional",
        evidence:
          "The directly observable part: stone-tool cut marks on the bones of large animals, in deposits dated by their stratigraphy and their correlation with the marine isotope record. Boxgrove and Marathousa 1 are two sites where the marks and the tools are both present and both published.",
        notes:
          "This claim says butchery and no more. It does not say who killed the animal, and the evidence in it cannot.",
      },
      {
        sourceKey: "thieme1997",
        citations: [
          { sourceKey: "lisiecki2005", relation: "context", note: "The marine isotope framework the revised age of the spear horizon is expressed in." },
        ],
        startYear: ka(340),
        endYear: ka(300),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "the Schöningen spear horizon, Marine Isotope Stage 9",
        datingMethod: "Stratigraphy and marine isotope stage correlation, revised since first publication",
        chronology: "archaeological",
        evidence:
          "The strongest hunting evidence in the European Lower Palaeolithic: worked wooden spears found with the remains of many butchered horses. The spear horizon was first reported at around 400,000 years old; later work has revised it younger, placing it in Marine Isotope Stage 9.",
        notes:
          "DELIBERATELY AT ITS OWN DATE, roughly 300,000 years ago — a long way after the rest of this dataset. It is here because it is what changes the hunting argument, and it would be dishonest to drag it back to 600,000 years to keep the entry tidy.",
      },
    ],
  },

  // 5 -----------------------------------------------------------------------
  {
    slug: "middle-pleistocene-glacial-cycles",
    title: "Middle Pleistocene glacial and interglacial cycles",
    summary: "Ice sheets advancing and retreating on a roughly 100,000-year beat — and Britain emptying each time.",
    description:
      "Through the Middle Pleistocene the Earth swung between glacial and interglacial states on a cycle of roughly 100,000 years. Ice sheets grew and shrank, sea level fell and rose by more than a hundred metres, and the habitable world for a human population changed shape completely — repeatedly.\n\n" +
      "HOW THIS IS KNOWN. Not from ice on the ground, mostly, but from the sea floor. The shells of bottom-dwelling foraminifera record the oxygen isotope ratio of the ocean, which tracks how much of the world's water is locked up in ice. Hundreds of cores have been aligned into a single stacked curve, and its peaks and troughs are numbered: the Marine Isotope Stages. Odd numbers are warm, even numbers cold.\n\n" +
      "AROUND 600,000 YEARS AGO that framework gives Marine Isotope Stage 16, one of the more severe glaciations of the period, followed by the long interglacial conditions of Stage 15. The sites in this dataset are dated by being tied to this curve — Boxgrove to Stage 13, Schöningen to Stage 9 — which is why it is here rather than in a separate collection about climate.\n\n" +
      "WHAT IT DID TO PEOPLE, carefully: Britain was a peninsula at low sea level and an island at high, and the archaeological record there is not continuous but a series of arrivals separated by long absences. Attributing any particular arrival or disappearance to any particular climate swing is an interpretation, and a contested one.",
    category: "science",
    subcategory: "Palaeoclimate",
    eventType: "scientific_model",
    tags: ["palaeoclimate", "ice-age", "marine-isotope-stages", "middle-pleistocene", "deep-time"],
    locationName: "Global",
    claims: [
      {
        sourceKey: "lisiecki2005",
        citations: [
          { sourceKey: "chibaGSSP", relation: "context", note: "The formal definition of the Middle Pleistocene, whose base is tied to the same astronomically tuned timescale." },
          { sourceKey: "roberts1994", relation: "context", note: "An archaeological site dated by being correlated with this curve." },
        ],
        startYear: ka(700),
        endYear: ka(500),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "the glacial–interglacial cycles around 700,000–500,000 years ago",
        datingMethod: "Benthic oxygen-isotope stratigraphy, orbitally tuned",
        chronology: "conventional",
        evidence:
          "The stacked deep-sea record covering this interval, including the severe glacial of Marine Isotope Stage 16 and the interglacial conditions of Stage 15. The ages come from tuning the record to the orbital cycles that drive it, constrained by sedimentation rates — so the dates are astronomical as much as they are geological.",
        notes:
          "An age from orbital tuning is an age from a model of the Earth's orbit fitted to a measured curve. It is very good, it is not a clock in the rock, and the distinction matters when a site's age depends entirely on being matched to it.",
      },
    ],
  },

  // 6 -----------------------------------------------------------------------
  {
    slug: "neanderthal-modern-human-divergence",
    title: "Neanderthal and modern human ancestral divergence",
    summary: "Genomes say one thing, teeth say another, and the gap between them is a quarter of a million years.",
    description:
      "At some point the populations leading to Neanderthals and Denisovans on one side, and to modern humans on the other, stopped being one population. There is no agreed date for this, and there cannot be a precise one: a population split is a process, not an event, and it is being estimated by methods that measure different things.\n\n" +
      "WHY THE ESTIMATES DIFFER — which is the real content of this entry:\n\n" +
      "· GENETIC ESTIMATES count differences between genomes and convert them into time using a mutation rate and a generation time. Change the assumed mutation rate and every date moves.\n" +
      "· FOSSIL ESTIMATES ask how long it takes anatomy to change by the amount observed. The Sima de los Huesos fossils are 430,000 years old and already recognisably on the Neanderthal path, which pushes any common ancestor back beyond them.\n" +
      "· DNA FROM FOSSILS constrains both: nuclear DNA from Sima de los Huesos shows those people were closer to Neanderthals than to Denisovans, so the Neanderthal–Denisovan split is older than 430,000 years, and the split from our own lineage is older still.\n\n" +
      "DENISOVANS BELONG IN THE SAME SENTENCE. The deepest division is not Neanderthal against modern human but the ancestors of Neanderthals-and-Denisovans against the ancestors of modern humans; Neanderthals and Denisovans separated from each other later.\n\n" +
      "The claims below are the published estimates, each with the method that produced it. They are not averaged.",
    category: "people",
    subcategory: "Human evolution",
    eventType: "disputed",
    eventTypeNote:
      "A genuine, current scientific disagreement about when — with no consensus figure to report.",
    tags: ["human-evolution", "genetics", "neanderthal", "denisovan", "divergence", "deep-time"],
    people: ["Neanderthals", "Denisovans", "Homo sapiens"],
    locationName: "Africa and Eurasia",
    claims: [
      {
        sourceKey: "prufer2014",
        citations: [
          { sourceKey: "meyer2016", relation: "supports", note: "Ancient nuclear DNA showing the Neanderthal–Denisovan split is older than 430,000 years, which constrains anything earlier." },
          { sourceKey: "gomezrobles2019", relation: "disputes", note: "Argues from rates of dental evolution for a last common ancestor older than 800,000 years — beyond the older end of this estimate." },
        ],
        startYear: ka(765),
        endYear: ka(550),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "approximately 765,000–550,000 years ago",
        datingMethod: "Genetic divergence modelling from a high-coverage archaic genome",
        chronology: "conventional",
        evidence:
          "The range most often cited from the analysis of a high-coverage Neanderthal genome: the estimated population divergence between the archaic lineage and modern humans. It is reported as a range because it depends on an assumed mutation rate and generation time, and those assumptions carry real uncertainty.",
        notes:
          "Marked as the mainstream reference point because it is the figure most subsequent work argues with — not because the argument is over.",
      },
      {
        sourceKey: "gomezrobles2019",
        citations: [
          { sourceKey: "meyer2016", relation: "supports", note: "Provides the age and the Neanderthal affinity of the Sima de los Huesos sample this argument rests on." },
          { sourceKey: "prufer2014", relation: "disputes", note: "The genomic estimate this result is explicitly in tension with." },
        ],
        startYear: ka(1000),
        endYear: ka(800),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "older than about 800,000 years ago",
        datingMethod: "Modelling of dental evolutionary rates against dated fossils",
        chronology: "scientific",
        evidence:
          "An estimate from anatomy rather than DNA: the teeth of the 430,000-year-old Sima de los Huesos people are already so Neanderthal-like that a more recent common ancestor would require dental evolution faster than any rate measured in hominins. The published conclusion is a last common ancestor before about 800,000 years ago.",
        notes:
          "Shown as a bounded window on the timeline because 'older than 800,000 years' has no upper end, and a bar running off to the Big Bang would misrepresent it. The claim is the boundary, not the width.",
      },
      {
        sourceKey: "meyer2016",
        citations: [
          { sourceKey: "prufer2014", relation: "context", note: "The genomic framework these ancient sequences were compared against." },
        ],
        startYear: ka(430),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "a floor: older than 430,000 years ago",
        datingMethod: "Ancient nuclear DNA from dated fossils",
        chronology: "scientific",
        evidence:
          "Nuclear DNA from the Sima de los Huesos hominins, dated to about 430,000 years, shows them more closely related to Neanderthals than to Denisovans. The Neanderthal–Denisovan split must therefore be older than that, and the divergence from our own lineage older again. This is the one number in the entry that is a hard limit rather than a model estimate.",
        notes:
          "A limit is a different kind of claim from an estimate, and is worth being able to see next to one: it says what cannot be true, rather than what probably is.",
      },
    ],
  },

  // 7 -----------------------------------------------------------------------
  {
    slug: "early-human-populations-in-europe",
    title: "Early human populations in Europe",
    summary: "Not the first Europeans — people had been in Britain for hundreds of thousands of years by then.",
    description:
      "By the middle of the Middle Pleistocene there were human populations across Europe, from the Mediterranean to the shore of the North Sea. Mauer in Germany, Arago in France, Petralona in Greece, Sima de los Huesos in Spain and Boxgrove in England are all part of the same broad picture, each dated separately and none of them dated the same way.\n\n" +
      "THIS IS NOT THE ARRIVAL. It would be easy, and wrong, to read a cluster of sites around 600,000 years ago as the moment humans reached Europe. Flint tools from Happisburgh in Norfolk are older than the Brunhes–Matuyama magnetic reversal, putting people at the edge of the boreal zone in northern Europe well before 780,000 years ago — the earliest known human presence this far north anywhere.\n\n" +
      "WHAT THE RECORD LOOKS LIKE INSTEAD is discontinuous: arrivals, long absences, and re-arrivals, tracking the glacial cycles. Britain in particular was occupied, abandoned and reoccupied repeatedly, and the gaps are as real a feature of the evidence as the sites.\n\n" +
      "Each site carries its own date below, because they genuinely differ — by more than a hundred thousand years between the oldest and the youngest here.",
    category: "archaeology",
    subcategory: "Lower Palaeolithic",
    eventType: "archaeological_interpretation",
    eventTypeNote: "A distribution of separately dated sites, not a single event of arrival.",
    tags: ["europe", "lower-palaeolithic", "happisburgh", "mauer", "middle-pleistocene", "deep-time"],
    people: ["Homo heidelbergensis"],
    locationName: "Europe",
    claims: [
      {
        sourceKey: "wagner2010",
        citations: [
          { sourceKey: "roberts1994", relation: "supports", note: "A separately dated British site from later in the same broad period." },
          { sourceKey: "smithsonian", relation: "context", note: "Museum background on the fossils this jawbone gave its name to." },
        ],
        startYear: ka(609),
        uncertaintyPlus: 40_000,
        uncertaintyMinus: 40_000,
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: false,
        originalDateText: "609 ± 40 thousand years ago (the Mauer jawbone)",
        datingMethod: "Combined electron spin resonance / uranium-series on mammal teeth, and infrared radiofluorescence on sand grains",
        chronology: "conventional",
        evidence:
          "The published age of the sands that held the Mauer mandible, from two independent physical dating methods applied to different materials in the same deposit. The agreement between them is what gives the figure its weight.",
        notes:
          "The ± 40,000 is a stated measurement error, and is recorded as one — not as a range of time during which something was true. The two are different claims and this timeline keeps them apart.",
      },
      {
        sourceKey: "parfitt2010",
        citations: [
          { sourceKey: "nhm", relation: "supports", note: "The museum's account of Happisburgh and of the repeated occupation of early Britain." },
          { sourceKey: "chibaGSSP", relation: "context", note: "The magnetic reversal the Happisburgh deposits sit below, which is what makes them older than about 773,000 years." },
        ],
        startYear: ka(990),
        endYear: ka(780),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "humans in northern Europe before about 780,000 years ago",
        datingMethod: "Palaeomagnetism, biostratigraphy and stratigraphic position",
        chronology: "scientific",
        evidence:
          "Flint artefacts at Happisburgh, Norfolk, in deposits of reversed magnetic polarity — older than the Brunhes–Matuyama reversal — with the fauna and pollen indicating a cool climate at the northern edge of the habitable range.",
        notes:
          "Here to make an error impossible rather than to describe the Middle Pleistocene: on the strip it sits far to the left of the other European sites, which is the answer to 'did people arrive in Europe 600,000 years ago?'",
      },
      {
        sourceKey: "meyer2016",
        citations: [
          { sourceKey: "gomezrobles2019", relation: "context", note: "Uses the same fossils to argue about the divergence date." },
        ],
        startYear: ka(430),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 430,000 years ago (Sima de los Huesos)",
        datingMethod: "Site dating, with ancient DNA establishing the population's affinity",
        chronology: "archaeological",
        evidence:
          "The Sima de los Huesos assemblage in northern Spain — an unusually large group of individuals from one place — dated to about 430,000 years and shown by nuclear DNA to be on the Neanderthal lineage. The youngest of the European claims in this entry, and the one where the population's identity is established genetically rather than anatomically.",
      },
    ],
  },

  // 8 -----------------------------------------------------------------------
  {
    slug: "middle-pleistocene-elephants-and-megafauna",
    title: "Humans, elephants and other megafauna",
    summary: "An elephant and some tools in the same layer is not an elephant hunt.",
    description:
      "Straight-tusked elephants, rhinoceros, hippopotamus and giant deer lived alongside Middle Pleistocene humans, and at a number of sites their remains are found with stone tools. What that association means is the question.\n\n" +
      "THE LADDER OF EVIDENCE, from firm to speculative:\n\n" +
      "1. ASSOCIATION — animal bones and stone tools in the same deposit. Common, and on its own it establishes only that both ended up in the same place.\n" +
      "2. BUTCHERY — cut marks on the bones, identified by shape and position and distinguished from carnivore damage. This is direct evidence that people cut meat off this animal.\n" +
      "3. ORDER OF ACCESS — whether human cut marks lie under or over carnivore tooth marks. Evidence about whether people or scavengers got there first.\n" +
      "4. HUNTING — an inference, and the weakest link unless a weapon or an embedded wound is present.\n\n" +
      "Marathousa 1 in Greece is one of the clearest cases in Europe: a partial skeleton of a single straight-tusked elephant, in direct association with stone tools, with cut marks on the bones. That is butchery, and it is published as butchery. Whether the animal was hunted or found dead is not something those bones can settle, and the excavators do not claim it is.\n\n" +
      "An elephant carcass is an enormous amount of meat and fat. Being able to use one — however it was obtained — is a significant fact about these populations regardless of who killed it.",
    category: "archaeology",
    subcategory: "Subsistence",
    eventType: "archaeological_interpretation",
    eventTypeNote:
      "Association, butchery and hunting are three different claims, and this entry does not let them blur.",
    tags: ["megafauna", "elephants", "butchery", "marathousa", "middle-pleistocene", "deep-time"],
    locationName: "Europe",
    claims: [
      {
        sourceKey: "marathousa2018",
        citations: [
          { sourceKey: "roberts1994", relation: "context", note: "A British site with cut-marked large mammals in a comparable period." },
          { sourceKey: "thieme1997", relation: "context", note: "Where hunting evidence is strongest — and much later." },
        ],
        startYear: ka(430),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 430,000 years ago (Marathousa 1, Megalopolis)",
        datingMethod: "Archaeological context — dated lake-margin deposits containing the skeleton and the tools",
        chronology: "conventional",
        evidence:
          "A partial skeleton of one Palaeoloxodon antiquus in spatial and stratigraphic association with stone artefacts, with cut marks identified on the elephant's bones and on other fauna. Published as the earliest documented butchery site in the southern Balkans.",
        notes:
          "CORRECTED FROM THE SUGGESTION THAT SEEDED THIS ENTRY, which proposed about 500,000 years. The published age is about 430,000. WHAT IT ESTABLISHES: butchery. WHAT IT DOES NOT: a hunt.",
      },
      {
        sourceKey: "thieme1997",
        startYear: ka(340),
        endYear: ka(300),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "weapons present, so hunting is evidenced — Marine Isotope Stage 9",
        datingMethod: "Stratigraphy and marine isotope stage correlation",
        chronology: "archaeological",
        evidence:
          "The comparison that shows how much weight the word 'hunting' needs before it can be used: at Schöningen the spears themselves survive, alongside the butchered animals. Almost nowhere else in this period does the weapon survive, which is why almost nowhere else can the argument be made as strongly.",
        notes:
          "Horses rather than elephants, and much later than the rest of this entry. It is here as the evidential standard, not as a Middle Pleistocene elephant hunt.",
      },
    ],
  },

  // 9 -----------------------------------------------------------------------
  {
    slug: "brunhes-matuyama-reversal",
    title: "The Brunhes–Matuyama geomagnetic reversal",
    summary: "The Earth's magnetic field flipped — and left a line in the rock that everything else is dated against.",
    description:
      "The last full reversal of the Earth's magnetic field. Before it, a compass would have pointed south; after it, north. The change is recorded in magnetic minerals in sediments and lavas all over the world as they cooled or settled, and it is the single most useful chronological marker in the Quaternary.\n\n" +
      "WHERE THE DATE COMES FROM. The base of the Middle Pleistocene — the Chibanian Stage — was formally defined in 2020 at the Chiba section in Japan, one of the best records of the reversal anywhere. The boundary has an astronomical age of about 774,000 years, and the reversal's directional midpoint sits a little above it, at about 773,000 years.\n\n" +
      "WHY IT IS IN AN ARCHAEOLOGY DATASET. Because half the dates in the rest of this collection lean on it. A deposit's magnetic polarity is cheap to measure and impossible to fake: a layer with reversed polarity is older than about 773,000 years, and a layer with normal polarity is younger. That single fact is what makes the Happisburgh artefacts older than 780,000 years, and it underpins the dating of countless Lower Palaeolithic sequences.\n\n" +
      "IT IS NOT A 600,000-YEAR EVENT, and it is not drawn as one. It sits at its own date, roughly 170,000 years before the rest of this dataset — which is precisely why it can be used to date things.",
    category: "science",
    subcategory: "Geomagnetism",
    eventType: "mainstream",
    eventTypeNote: "A physical event in the Earth's magnetic field, dated by astronomical tuning of the sections recording it.",
    tags: ["palaeomagnetism", "geochronology", "chibanian", "quaternary", "deep-time"],
    locationName: "Global — defined at the Chiba section, Japan",
    lat: 35.2833,
    lng: 140.1333,
    claims: [
      {
        sourceKey: "chibaGSSP",
        citations: [
          { sourceKey: "lisiecki2005", relation: "supports", note: "The orbitally tuned isotope framework the astronomical ages are expressed in." },
          { sourceKey: "parfitt2010", relation: "context", note: "An archaeological site dated by sitting below this reversal." },
          { sourceKey: "wikipedia_bm", relation: "context", note: "An accessible summary — a good place to start and a poor place to stop." },
        ],
        startYear: ka(773),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "approximately 773,000 years ago",
        datingMethod: "Palaeomagnetism with astronomical (orbital) tuning of the boundary section",
        chronology: "conventional",
        evidence:
          "The formal stratigraphic definition: the base of the Chibanian at the Chiba section has an astronomical age of about 774,000 years, and the directional midpoint of the Matuyama–Brunhes reversal lies just above it at about 772.9 thousand years. Ratified in January 2020.",
        notes:
          "The reversal was not instantaneous — the field takes thousands of years to complete a flip — so a single date names the midpoint of a transition, not a day when compasses turned round.",
      },
    ],
  },

  // 10 ----------------------------------------------------------------------
  {
    slug: "multiple-archaic-human-populations",
    title: "Multiple archaic human populations",
    summary: "Not a ladder to us — several related populations, overlapping in time, some known only from DNA.",
    description:
      "The Middle Pleistocene is often drawn as a ladder: Homo erectus, then Homo heidelbergensis, then Neanderthals and us. The evidence does not support that shape. What it shows is several related populations, overlapping in time, sometimes meeting and interbreeding, of which only one line survives.\n\n" +
      "WHAT IS REASONABLY WELL SUPPORTED:\n\n" +
      "· Populations in Africa through this period, from which modern humans eventually emerge.\n" +
      "· Populations in Europe on the Neanderthal path by 430,000 years ago — the Sima de los Huesos people, identified as such by DNA and not only by their bones.\n" +
      "· Denisovans, a population known mainly from genomes and a small number of fossils, which separated from Neanderthals after both had separated from our own lineage.\n" +
      "· Interbreeding between these populations, recorded in the genomes of people alive today.\n\n" +
      "WHAT SHOULD BE RESISTED is the assumption that modern species labels map cleanly onto every fossil. They do not, the specialists say so in print, and the dispute over what to call Middle Pleistocene populations — Homo heidelbergensis, Homo rhodesiensis, Homo bodoensis — is a symptom of trying to sort continuous variation into boxes.\n\n" +
      "The honest summary is that around this period there were several kinds of human, that they were related, that some met, and that the naming is still being argued about.",
    category: "people",
    subcategory: "Human evolution",
    eventType: "mainstream",
    eventTypeNote:
      "The branching picture is mainstream; the labels attached to the branches are not settled.",
    tags: ["human-evolution", "denisovan", "neanderthal", "taxonomy", "ancient-dna", "deep-time"],
    people: ["Neanderthals", "Denisovans", "Homo sapiens", "Homo heidelbergensis"],
    locationName: "Africa and Eurasia",
    claims: [
      {
        sourceKey: "prufer2014",
        citations: [
          { sourceKey: "meyer2016", relation: "supports", note: "Ancient nuclear DNA placing a 430,000-year-old European population on the Neanderthal branch rather than the Denisovan one." },
          { sourceKey: "smithsonian", relation: "context", note: "A museum overview of the populations and the fossils behind them." },
          { sourceKey: "roksandic2022", relation: "context", note: "A live proposal to rename part of this picture, and evidence that the labels are unsettled." },
        ],
        startYear: ka(700),
        endYear: ka(300),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "several related human populations, roughly 700,000–300,000 years ago",
        datingMethod: "Genomic analysis of archaic and present-day genomes, combined with dated fossils",
        chronology: "conventional",
        evidence:
          "Genome sequencing of archaic humans shows a branching population history with gene flow between the branches — not a single lineage. The dates of the branches come from divergence modelling; the existence of the branches comes from the genomes themselves, which is a much more direct observation than the dates are.",
      },
      {
        sourceKey: "delson2022",
        citations: [
          { sourceKey: "roksandic2022", relation: "disputes", note: "The proposal this paper is answering — that the old names be abandoned in favour of Homo bodoensis." },
          { sourceKey: "wikipedia_hh", relation: "context", note: "Where most readers meet the contested category, and its reference list." },
        ],
        startYear: ka(700),
        endYear: ka(300),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "the same populations, with the naming unresolved",
        datingMethod: "Taxonomic argument from published fossils — no new measurement",
        chronology: "disputed",
        evidence:
          "The published reply to the Homo bodoensis proposal: that renaming does not resolve what is really a problem of variability, and that Middle Pleistocene fossils resist clean division into species however the names are arranged.",
        notes:
          "Carried as a claim at the same dates as the claim above, because the disagreement is not about WHEN these populations lived. It is about what they were, and a timeline that only ever disagrees about dates would miss it.",
      },
    ],
  },
];
