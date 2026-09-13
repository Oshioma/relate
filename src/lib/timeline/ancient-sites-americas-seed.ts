import type { SeedEvent, SeedSource, SeedTrack, SeedEventLink } from "./seed-types";

// =============================================================================
// ANCIENT SITES: THE ANDES, AND DISPUTED EARLY PRESENCE IN THE AMERICAS
//
// The second tranche of the disputed-dates dataset. Five records in two groups,
// asking two different questions.
//
// THE ANDEAN GROUP — Tiwanaku and Pumapunku — asks WHEN SOMETHING WAS BUILT.
// The excavated chronology puts the monumental core in the middle of the first
// millennium CE. Arthur Posnansky put the Kalasasaya at about 15,000 BCE, and
// he did it with an astronomical calculation that can be inspected: the error
// in it is specific, checkable, and recorded here rather than waved at.
//
// THE EARLY AMERICAS GROUP — Calico, Hueyatlaco and Pedra Furada — asks
// something else: WHETHER ANYBODY WAS THERE AT ALL. The dates on these are
// mostly not in dispute. What is in dispute is whether the things found in the
// dated layers were made by human beings, or whether nature made objects that
// look like tools. That is the same question as the Ottosdal objects on the
// first tranche, asked of stone tools instead of spheres.
//
// WHY THESE THREE BELONG TOGETHER, AND WHY THAT MATTERS. They are the sites
// where the argument is not "is this old" but "is this anything" — and they are
// also the place where this dataset's most useful lesson lives. Pre-Clovis
// claims were rejected for decades on the principle that the Americas were
// settled late; some of those claims later became the accepted account, and
// some did not. The consensus moved, on better excavation and better dating.
// That is not the same as every rejected claim being right, and a reader who
// takes away only "science changes its mind" has learned the wrong half of it.
//
// The records below say which way each one has gone, or that it has not gone
// anywhere, and what would move it.
//
// NO CONFIDENCE SCORES. As ever: source, what was dated, method, what the
// measurement establishes, what it does not, and who disagrees.
// =============================================================================

export const ANCIENT_SITES_AMERICAS_ANCHOR_SLUG = "tiwanaku-monumental-core";

export const ANCIENT_SITES_AMERICAS_TRACK: SeedTrack = {
  name: "Ancient sites: the Andes and the early Americas",
  slug: "ancient-sites-americas",
  kind: "theme",
  color: "#7a5c3e",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_AMERICAS_SOURCES: SeedSource[] = [
  // --- Tiwanaku and Pumapunku ----------------------------------------------
  {
    key: "posnansky1945",
    title: "Tihuanacu, the Cradle of American Man",
    author: "Arthur Posnansky",
    publisher: "J. J. Augustin",
    reference: "Volumes I and II, New York, 1945",
    sourceType: "book",
    publishedYear: 1945,
    notes:
      "Posnansky's own book, and the right source for his date rather than any summary of it. He was an engineer " +
      "who spent decades at the site and published the first detailed survey of it — which is why his measurements " +
      "are still consulted even where his chronology is not. Cited for the Kalasasaya calculation and for the " +
      "figure he draws from it.",
  },
  {
    key: "yaeger_vranich2013",
    title: "A radiocarbon chronology of the Pumapunku complex and a reassessment of the development of Tiwanaku, Bolivia",
    author: "Jason Yaeger and Alexei Vranich",
    workTitle: "Advances in Titicaca Basin Archaeology–2",
    reference: "UCLA Cotsen Institute of Archaeology, 2013",
    sourceType: "academic_paper",
    publishedYear: 2013,
    notes:
      "Eighteen radiocarbon dates from Tiwanaku and Inca components of the Pumapunku, including material from the " +
      "lowest and oldest layer of mound fill. Cited for the construction date and for the thing that makes it a " +
      "construction date at all: the dated material is inside the mound the monument stands on.",
  },
  {
    key: "janusek_chronology",
    title: "Dating the Tiwanaku state",
    author: "John W. Janusek",
    workTitle: "Chungará (Revista de Antropología Chilena)",
    reference: "Volume 36, number 1",
    url: "https://www.scielo.cl/pdf/chungara/v36n1/art03.pdf",
    sourceType: "academic_paper",
    notes:
      "A compilation of the radiocarbon dates produced by the Wilajawira project under Alan Kolata and by earlier " +
      "work. Cited for the excavated chronology of the monumental core, and because a compiled sequence is a " +
      "different kind of thing from a single date — it is what a chronology actually rests on.",
  },
  {
    key: "wikipedia_posnansky",
    title: "Arthur Posnansky — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Arthur_Posnansky",
    sourceType: "wikipedia",
    notes:
      "An overview of who he was, which matters here: an engineer and long-term excavator rather than an outsider, " +
      "and a route to the modern assessments of his work. Not used as the source of any date.",
  },

  // --- Hueyatlaco ----------------------------------------------------------
  {
    key: "malde_steenmcintyre_debate",
    title: "The stratigraphic debate at Hueyatlaco, Valsequillo, Mexico",
    author: "Harold E. Malde and Virginia Steen-McIntyre",
    sourceType: "academic_paper",
    notes:
      "The dating team's own statement of the disagreement. Cited for the measurements and for their position that " +
      "the stratigraphy supports them — and because the paper is about the DEBATE, which is the honest shape of " +
      "this record.",
  },
  {
    key: "steenmcintyre_gsa2008",
    title: "A review of the Valsequillo, Mexico early-man archaeological sites",
    author: "Virginia Steen-McIntyre",
    reference: "Presented at the Geological Society of America annual meeting, Houston, 2008",
    url: "https://pleistocenecoalition.com/steen-mcintyre/STEEN-McINTYRE_HOUSTON_GSA_2008.pdf",
    sourceType: "academic_paper",
    publishedYear: 2008,
    notes:
      "Steen-McIntyre restating the case decades later. Cited as the claimant's own account of what was dated and " +
      "why she holds to it, which is what this timeline records rather than a summary of what she is said to think.",
  },
  {
    key: "wikipedia_hueyatlaco",
    title: "Hueyatlaco — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Hueyatlaco",
    sourceType: "wikipedia",
    notes:
      "Overview and a route to the primary literature, including Irwin-Williams' position. Used for orientation, " +
      "not as a source for any figure on the record.",
  },

  // --- Pedra Furada --------------------------------------------------------
  {
    key: "meltzer1994",
    title: "On a Pleistocene human occupation at Pedra Furada, Brazil",
    author: "David J. Meltzer, James M. Adovasio and Tom D. Dillehay",
    workTitle: "Antiquity",
    reference: "Volume 68 (1994)",
    sourceType: "academic_paper",
    publishedYear: 1994,
    notes:
      "Three specialists in the peopling of the Americas, reporting on a visit to the site at the end of 1993. " +
      "Their case is that the early material cannot be distinguished from naturally fractured and naturally burnt " +
      "stone — not that the dates are wrong.",
  },
  {
    key: "guidon_reply",
    title: "Nature and age of the deposits in Pedra Furada, Brazil: reply to Meltzer, Adovasio & Dillehay",
    author: "Niède Guidon, Fabio Parenti and colleagues",
    workTitle: "Antiquity",
    sourceType: "academic_paper",
    notes:
      "The excavators' published answer, in the same journal. Cited so the exchange is on the record in both " +
      "directions — the reply is where the case for the hearths being built rather than natural is actually made.",
  },
  {
    key: "pedra_furada_reappraisal",
    title: "Pedra Furada: a reappraisal of its artifacts, structures and stratigraphy",
    reference: "2023",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0003552123000237",
    sourceType: "academic_paper",
    publishedYear: 2023,
    notes:
      "A recent reassessment, cited to show that this is a live question rather than one settled in the 1990s. " +
      "NEEDS SOURCE VERIFICATION — the authors and journal could not be confirmed from the sources consulted here, " +
      "so no date on this record rests on it.",
  },

  // --- Calico --------------------------------------------------------------
  {
    key: "haynes1973",
    title: "The Calico site: artifacts or geofacts?",
    author: "C. Vance Haynes",
    sourceType: "academic_paper",
    publishedYear: 1973,
    notes:
      "The paper that set out the mechanisms by which the deposits at Calico could produce stone indistinguishable " +
      "from tools: tectonic fracturing, weathering, rock-on-rock percussion in streams and mudflows, pressure " +
      "retouch of buried cobbles, and repeated cycles of erosion and redeposition. Cited for those mechanisms, " +
      "which are the substance of the objection.",
  },
  {
    key: "wikipedia_calico",
    title: "Calico Early Man Site — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Calico_Early_Man_Site",
    sourceType: "wikipedia",
    notes:
      "Overview, and the route to the excavation history — Ruth DeEtte Simpson's work, Louis Leakey's involvement " +
      "from 1963, and the later dating. Used for orientation only.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_AMERICAS_EVENTS: SeedEvent[] = [
  // =========================================================================
  // TIWANAKU — an astronomical calculation whose error can be pointed at.
  // =========================================================================
  {
    slug: ANCIENT_SITES_AMERICAS_ANCHOR_SLUG,
    title: "The monumental core of Tiwanaku",
    summary:
      "Excavated radiocarbon puts it in the middle of the first millennium CE. Arthur Posnansky put one of its buildings at about 15,000 BCE, by a calculation that can be checked.",
    description:
      "Tiwanaku stands on the Bolivian altiplano near Lake Titicaca: a walled enclosure, a stepped platform, carved gateways, and stonework fitted closely enough that it has been attracting explanations for four centuries.\n\n" +
      "THE EXCAVATED CHRONOLOGY. Radiocarbon from the monumental core places its construction in the middle of the first millennium CE, with the city reaching its greatest extent towards the end of that millennium. That chronology is a COMPILATION — dozens of dates from many contexts, assembled over decades of excavation — and that is what makes it a chronology rather than a date.\n\n" +
      "POSNANSKY'S CALCULATION, WHICH IS THE INTERESTING PART. Arthur Posnansky was an engineer who spent much of his life at Tiwanaku and published the first detailed survey of it; his measurements are still consulted. He proposed that the site was built around 15,000 BCE, and he got there by a method that is entirely inspectable.\n\n" +
      "The Kalasasaya enclosure has pillars along its eastern wall. Posnansky, working with the astronomer Rolf Müller, took those pillars to mark sunrise at the solstices and equinoxes, measured the azimuths, found they did not quite match the modern sunrise positions, and calculated how far back in time the sky would have to be moved for them to fit. The answer he reached was about seventeen thousand years.\n\n" +
      "WHERE IT GOES WRONG, SPECIFICALLY. The calculation depends on how fast the relevant sunrise position moves. A star's rising azimuth moves substantially over millennia, because the Earth's axis precesses. The SOLSTICE sunrise does not: it depends on the tilt of the axis, which changes very slowly. Run a small azimuth discrepancy backwards through a slow change and you get an enormous span of time — which is exactly what happened, and it is why a difference of a degree or so came out as fifteen thousand years rather than a few centuries or a measurement error.\n\n" +
      "That is a real error with a name, not a matter of taste, and it is on this record because a reader should be able to see what went wrong rather than be told the conclusion is wrong.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "Andean archaeology is not divided about the chronology. The record is filed as disputed because a named researcher published a competing date by a stated method, and both the date and the method are shown.",
    tags: ["tiwanaku", "bolivia", "andes", "astronomical-alignment", "posnansky", "ancient-sites"],
    people: ["Arthur Posnansky", "Rolf Müller", "Alan Kolata", "John W. Janusek"],
    civilisations: ["Tiwanaku"],
    locationName: "Tiwanaku, La Paz Department, Bolivia",
    lat: -16.5547,
    lng: -68.6733,
    claims: [
      {
        sourceKey: "janusek_chronology",
        startYear: 400,
        endYear: 1000,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the monumental core from about AD 400–500, at its greatest extent by the end of the first millennium",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        whatIsDated: "The building and use of the monumental core",
        evidence:
          "WHAT IS DATED: organic material from excavated contexts across the monumental centre, compiled from the " +
          "Wilajawira project and earlier work. DATING METHOD: radiocarbon, radiometric and AMS. WHAT IT " +
          "ESTABLISHES: the span over which the ceremonial and administrative core was built and occupied. WHAT IT " +
          "DOES NOT ESTABLISH: that nothing stood here earlier — settlement at Tiwanaku begins before the " +
          "monumental phase, and this claim is about the monuments rather than about the first people on the spot.",
        notes:
          "Stored as a range because that is what a compiled chronology gives. A single year for Tiwanaku would be " +
          "false precision about a city that was built over centuries.",
      },
      {
        sourceKey: "posnansky1945",
        startYear: -14999,
        datePrecision: "millennium",
        isApproximate: true,
        originalDateText: "about 15,000 BC — stated in later editions as 17,000 years ago",
        datingMethod: "astronomical",
        chronology: "alternative",
        whatIsDated: "The Kalasasaya enclosure, on an astronomical alignment",
        evidence:
          "WHAT IS DATED: the orientation of the pillars along the eastern wall of the Kalasasaya, on the assumption " +
          "that they mark sunrise at the solstices and equinoxes. DATING METHOD: measuring the azimuths, comparing " +
          "them with modern sunrise positions, and calculating backwards to when the fit would have been exact. " +
          "WHO PROPOSES IT: Arthur Posnansky, working with the astronomer Rolf Müller, in his own book. WHAT THE " +
          "CALCULATION ESTABLISHES IF THE ASSUMPTIONS HOLD: an epoch at which the wall would have aligned exactly. " +
          "WHAT IT DOES NOT ESTABLISH: when anybody built the wall — an alignment date is not a construction date, " +
          "and it is a construction date only if the builders intended the alignment and built it accurately.\n\n" +
          "WHERE THE CALCULATION FAILS, statedly and checkably: it treats the discrepancy as though the relevant " +
          "sunrise position moves at the rate a STAR's does, under precession. A solstice sunrise does not. Its " +
          "azimuth depends on the tilt of the Earth's axis, which changes very slowly, so a small discrepancy run " +
          "backwards through it yields an enormous span of time. The method turns a degree or so of imprecision — " +
          "in a wall, measured in the field — into fifteen thousand years.",
        notes:
          "Recorded at millennium precision because the claim is about an epoch, and because storing 15,000 BCE to " +
          "the year would give a reader precision the argument does not carry.\n\n" +
          "Posnansky is not seeded here as an outsider and should not be read as one: he was an engineer who " +
          "excavated at Tiwanaku for decades and produced the first detailed survey of the site. The survey is " +
          "still used. The chronology is not, and the reason is above.",
        citations: [
          {
            sourceKey: "janusek_chronology",
            relation: "disputes",
            note: "The excavated radiocarbon chronology, which the calculation would displace by some fifteen thousand years.",
          },
          { sourceKey: "wikipedia_posnansky", relation: "context", note: "Who he was, and how his work is assessed now." },
        ],
      },
    ],
  },

  // =========================================================================
  // PUMAPUNKU — kept separate, because a complex is not one building.
  // =========================================================================
  {
    slug: "pumapunku-construction",
    title: "The building of the Pumapunku",
    summary:
      "A dated construction, from material inside the mound the monument stands on — and a separate record from Tiwanaku because one date does not cover a whole complex.",
    description:
      "The Pumapunku is a terraced platform mound at the south-western end of the Tiwanaku complex, famous for the precision of its cut andesite blocks and the H-shaped forms among them.\n\n" +
      "IT IS A SEPARATE RECORD FROM TIWANAKU ON PURPOSE. The two belong to one archaeological complex, and it is tempting to give the complex one date and apply it to everything in it. That is the mistake this dataset exists to prevent. A complex built over centuries has as many construction dates as it has phases, and the Pumapunku has its own.\n\n" +
      "WHAT WAS DATED, AND WHY IT COUNTS AS A CONSTRUCTION DATE. Yaeger and Vranich published eighteen radiocarbon dates from the Pumapunku, including organic material from the lowest and oldest layer of the mound fill — the fill the platform was raised on. Material inside the fill has to have been there when the fill was laid, so its age is the age of the raising, and the step from 'this sample is old' to 'this platform is old' is a short one.\n\n" +
      "That is a different situation from most of the disputed sites in this dataset, where the dated material is near the structure rather than inside it. It is the same situation as the wall plaster at Göbekli Tepe, and worth reading beside it.\n\n" +
      "THE STONEWORK IS NOT THE DATE. The precision of the cutting is the thing most often argued from — that it is too fine for the tools available, and so must be earlier or made by other means. That is an argument about capability, and it is not a dating method: nothing about how well a block is cut tells you when it was cut. Anyone proposing a date from the stonework alone is proposing an inference, and this record has no claim of that kind because no named researcher was found making one with a specific figure attached.",
    category: "archaeology",
    subcategory: "Archaeological evidence",
    eventType: "archaeological_interpretation",
    eventTypeNote:
      "An excavated date from sealed context. Included in a disputed-dates dataset because the site attracts alternative claims, not because this chronology is contested.",
    tags: ["pumapunku", "tiwanaku", "bolivia", "andes", "radiocarbon", "ancient-sites"],
    people: ["Alexei Vranich", "Jason Yaeger"],
    civilisations: ["Tiwanaku"],
    locationName: "Pumapunku, Tiwanaku, La Paz Department, Bolivia",
    lat: -16.5614,
    lng: -68.6803,
    claims: [
      {
        sourceKey: "yaeger_vranich2013",
        startYear: 536,
        endYear: 600,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "AD 536–600, for the initial construction of the Pumapunku",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        whatIsDated: "The lowest and oldest layer of the mound fill the platform was raised on",
        evidence:
          "WHAT IS DATED: organic material from the deepest layer of mound fill at the Pumapunku, among eighteen " +
          "radiocarbon dates published for the complex. DATING METHOD: radiocarbon. WHAT IT ESTABLISHES: when the " +
          "fill was laid, and so when the platform was raised — material sealed inside a fill has to predate the " +
          "laying of it. WHAT IT DOES NOT ESTABLISH: when each block above was cut and set. A platform raised in " +
          "the sixth century can carry stonework added later, and the same excavation found Inca-period material " +
          "at the monument as well as Tiwanaku-period.",
        notes:
          "This is the kind of date most of the disputed sites in this dataset do not have: the dated material is " +
          "INSIDE the structure's own fill rather than near it. Worth reading against Gunung Padang, where the " +
          "dated soil was associated with nothing built.",
        citations: [
          {
            sourceKey: "janusek_chronology",
            relation: "context",
            note: "The wider Tiwanaku chronology this construction sits inside.",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // CALICO — the dates are of the deposit; the objects are the argument.
  // =========================================================================
  {
    slug: "calico-early-man-site",
    title: "The Calico Early Man Site",
    summary:
      "Stone from an ancient alluvial fan in the Mojave, dated to about 200,000 years — and an unresolved argument about whether any of it was struck by a person.",
    description:
      "Calico is a site in the central Mojave Desert near Barstow, California, dug into the deposits of an ancient alluvial fan. Ruth DeEtte Simpson recovered chipped stone there and showed it to Louis Leakey; from 1963 Leakey took an interest in the site, and concluded that the pieces were unquestionably made by people.\n\n" +
      "THE DATE AND THE OBJECTS ARE TWO DIFFERENT CLAIMS, and keeping them apart is the whole of this record. In 1980 the deposits were dated by uranium–thorium to around 200,000 years. That is a date for the FAN — the sediments — and it is not seriously contested. Whether anything human is in those sediments is the contested part, and no measurement addresses it.\n\n" +
      "WHY THE OBJECTS ARE DOUBTED, SPECIFICALLY. C. Vance Haynes set out in 1973 the mechanisms by which this kind of deposit makes stone that looks worked: tectonic stress fracturing rock, weathering, rock striking rock in streams and mudflows, buried cobbles pressure-flaked by the weight above them, and repeated cycles of erosion and redeposition removing further flakes. An alluvial fan is, in effect, a machine for producing objects indistinguishable from tools. Many Calico pieces have been assessed as geofacts on exactly those grounds.\n\n" +
      "WHAT WOULD SETTLE IT. Not a better date. The question is whether the flaking pattern, the distribution and the context can be told apart from what the fan does on its own — and that is an argument about the objects, conducted by looking at them.\n\n" +
      "LEAKEY'S INVOLVEMENT IS PART OF THE RECORD, NOT AN ARGUMENT IN IT. He was among the most consequential figures in the study of human origins, and his support brought the site attention it would not otherwise have had. That is a fact about the site's history. It is not evidence about the stone, and this record does not treat it as any.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "The disagreement is not about the age of the deposits. It is about whether the objects in them are artefacts at all — which no dating method can answer.",
    tags: ["calico", "california", "americas", "geofacts", "leakey", "ancient-sites"],
    people: ["Louis Leakey", "Ruth DeEtte Simpson", "C. Vance Haynes"],
    locationName: "Calico Early Man Site, San Bernardino County, California",
    lat: 34.9447,
    lng: -116.7561,
    claims: [
      {
        sourceKey: "wikipedia_calico",
        startYear: -198050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "about 200,000 years, by uranium–thorium dating of the deposits, reported in 1980",
        datingMethod: "uranium_series",
        chronology: "geological",
        whatIsDated: "The alluvial fan deposits the objects were dug out of",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: the sediments of the alluvial fan. DATING METHOD: uranium–thorium. WHAT IT ESTABLISHES: " +
          "roughly when the fan was laid down. WHAT IT DOES NOT ESTABLISH, AND THIS IS THE RECORD: whether anything " +
          "in those sediments was made by a human being. A geofact produced by the fan and a tool dropped into the " +
          "fan would both be recovered from 200,000-year-old material, so the age cannot distinguish them and is " +
          "not evidence either way.",
        notes:
          "LIMITATION OF THIS ENTRY: it is recorded from an overview rather than from the 1980 dating report, which " +
          "could not be traced to a specific publication from the sources consulted. NEEDS SOURCE VERIFICATION — " +
          "the figure, its error, and who published it.",
      },
      {
        sourceKey: "wikipedia_calico",
        startYear: -198050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "chipped stone at Calico interpreted as unquestionably made by people",
        datingMethod: "claimant_inference",
        chronology: "hypothesis",
        whatIsDated: "Whether the chipped stone is worked at all — the interpretation, not the deposit",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: nothing new. This claim carries the deposit's age because that is the age the objects " +
          "would inherit IF they were established as artefacts. DATING METHOD: none — it is an interpretation of " +
          "flaked stone, so it is recorded as an inference rather than as a measurement. WHO PROPOSES IT: Louis " +
          "Leakey, from 1963, on material recovered by Ruth DeEtte Simpson. WHAT IT DOES NOT ESTABLISH: that the " +
          "flaking is human. Haynes set out in 1973 the mechanisms by which these deposits produce stone " +
          "indistinguishable from tools — tectonic fracture, weathering, rock-on-rock percussion in streams and " +
          "mudflows, pressure retouch of buried cobbles, and repeated erosion and redeposition. Many of the pieces " +
          "have been assessed as geofacts on those grounds.",
        notes:
          "Filed as a hypothesis because that is its standing, and kept on the timeline rather than left off " +
          "because a reader who has heard that Louis Leakey found 200,000-year-old tools in California deserves to " +
          "find what the claim actually is and what is wrong with it.",
        citations: [
          {
            sourceKey: "haynes1973",
            relation: "disputes",
            note: "The mechanisms by which the deposit itself produces stone that looks worked.",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // HUEYATLACO — several methods agreeing, and a dispute anyway.
  // =========================================================================
  {
    slug: "hueyatlaco-valsequillo",
    title: "The dates at Hueyatlaco, Valsequillo",
    summary:
      "Four dating methods put the artefact-bearing layers at around a quarter of a million years. The archaeologist directing the excavation did not accept it, and the argument has never closed.",
    description:
      "Hueyatlaco is an archaeological site in the Valsequillo basin near Puebla, Mexico. The artefact-bearing layers lie beneath some ten metres of fine, water-laid deposits, and what came out of them included bifacial tools found with animal bone.\n\n" +
      "THE MEASUREMENTS, WHICH IS WHAT MAKES THIS DIFFERENT FROM MOST OF THIS DATASET. Four independent approaches were applied and reported in 1981 by Harold Malde, Roald Fryxell and Virginia Steen-McIntyre: fission-track dating of zircon crystals in volcanic ash, uranium-series dating of bone, mineral weathering analysis, and tephra hydration. A uranium-series date on a camel pelvis found with bifacial tools gave 245,000 ± 40,000 years. Fission-track ages on zircon from two overlying ash layers gave 370,000 ± 200,000 and 600,000 ± 340,000 years.\n\n" +
      "NOTE THE ERROR BARS BEFORE ANYTHING ELSE. A fission-track age of 600,000 ± 340,000 is a number with a tolerance more than half its own size. That does not make it wrong; it makes it a weak constraint, and the two ash dates are consistent with the bone date mostly because they are consistent with a very wide range of things.\n\n" +
      "THE DISAGREEMENT WAS INTERNAL AND IT WAS BITTER. Cynthia Irwin-Williams directed the archaeology and did not accept the result. When Malde and Fryxell announced the dates at a Geological Society of America meeting while acknowledging they could not account for them, she called the announcement irresponsible. Her own position was that the site had not been satisfactorily dated, and she argued for something nearer twenty thousand years — a figure which was itself controversial at the time.\n\n" +
      "WHAT THE ARGUMENT IS ACTUALLY ABOUT. Not whether the ash is old. Whether the artefacts and the dated material are in the relationship the dating assumes — whether the tools are in the layers they appear to be in, and whether those layers have been disturbed. That is a stratigraphic question, which is why the paper the dating team wrote about it is called the stratigraphic debate.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "Specialists on one excavation disagreed with each other, in print, and the disagreement was never resolved. Both positions are recorded with their reasoning.",
    tags: ["hueyatlaco", "valsequillo", "mexico", "americas", "uranium-series", "fission-track", "ancient-sites"],
    people: ["Virginia Steen-McIntyre", "Harold E. Malde", "Roald Fryxell", "Cynthia Irwin-Williams"],
    locationName: "Hueyatlaco, Valsequillo, Puebla, Mexico",
    lat: 18.9,
    lng: -98.15,
    claims: [
      {
        sourceKey: "malde_steenmcintyre_debate",
        startYear: -243050,
        datePrecision: "thousand_years",
        isApproximate: true,
        uncertaintyPlus: 40000,
        uncertaintyMinus: 40000,
        originalDateText: "245,000 ± 40,000 years, by 230Th, on a camel pelvis found with bifacial tools",
        datingMethod: "uranium_series",
        chronology: "disputed",
        whatIsDated: "A camel pelvis found in association with bifacial tools",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: bone — a camel pelvis, reported as found with bifacial stone tools. DATING METHOD: " +
          "uranium-series (230Th). WHAT IT ESTABLISHES: an age for the bone. WHAT IT DOES NOT ESTABLISH: that the " +
          "tools and the bone were deposited together, which is the assumption the archaeological conclusion rests " +
          "on and the thing the excavation director disputed. KNOWN DIFFICULTY WITH THE METHOD: bone is an open " +
          "system for uranium, taking it up and losing it after death, so an age from bone depends on a model of " +
          "that exchange — the same difficulty as the Cerutti mastodon on the first tranche of this dataset.",
        notes:
          "The ± 40,000 is the measurement's own tolerance and is stored as such rather than as a date range: a " +
          "tolerance on one measurement and a span of time something was true for are different things.",
        citations: [
          {
            sourceKey: "steenmcintyre_gsa2008",
            relation: "supports",
            note: "Steen-McIntyre restating the case decades later, in her own words.",
          },
        ],
      },
      {
        sourceKey: "malde_steenmcintyre_debate",
        startYear: -368050,
        datePrecision: "thousand_years",
        isApproximate: true,
        uncertaintyPlus: 200000,
        uncertaintyMinus: 200000,
        originalDateText: "370,000 ± 200,000 years, by fission track on zircon from an overlying ash",
        datingMethod: "fission_track",
        chronology: "geological",
        whatIsDated: "Zircon crystals in a volcanic ash layer above the artefacts",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: zircon phenocrysts in tephra lying ABOVE the artefact-bearing layers. DATING METHOD: " +
          "fission track. WHAT IT ESTABLISHES: if the ash is above the artefacts and undisturbed, the artefacts " +
          "are older than the ash — a minimum age by stratigraphic position rather than a date for anything human. " +
          "WHAT IT DOES NOT ESTABLISH: a useful bound, on its own. The tolerance here is ± 200,000 years on a " +
          "figure of 370,000, so the measurement is consistent with almost any age a reader might have in mind.",
        notes:
          "Recorded because the error bar is the point. A second ash gave 600,000 ± 340,000 — a tolerance larger " +
          "than half the age — and quoting either figure without its tolerance would turn a weak constraint into " +
          "an apparently precise one.",
      },
      {
        sourceKey: "wikipedia_hueyatlaco",
        startYear: -18050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "nearer 20,000 years — the excavation director's position",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        whatIsDated: "The occupation, on the excavation director's reading of the site",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: nothing new was measured. Cynthia Irwin-Williams, who directed the archaeology, held that " +
          "the site had not been satisfactorily dated and argued for an age nearer twenty thousand years. DATING " +
          "METHOD: stratigraphic and archaeological judgement about the site and its assemblage. WHAT IT " +
          "ESTABLISHES: that the person closest to the excavation did not accept the geological dates, which is " +
          "itself part of the evidence a reader needs. WHAT IT DOES NOT ESTABLISH: an alternative measured age — " +
          "and twenty thousand years for a Mexican site was itself a contested figure at the time.\n\n" +
          "LIMITATION OF THIS ENTRY: recorded from an overview rather than from her own publication, which could " +
          "not be traced from the sources consulted. NEEDS SOURCE VERIFICATION.",
        notes:
          "On the record because leaving it off would present the dating team's figures as unopposed, when the " +
          "opposition came from inside the same excavation and was never withdrawn.",
      },
    ],
  },

  // =========================================================================
  // PEDRA FURADA — the hearths, and whether they are hearths.
  // =========================================================================
  {
    slug: "pedra-furada-occupation",
    title: "The disputed early occupation at Pedra Furada",
    summary:
      "Charcoal and fractured stone in a Brazilian rock shelter, radiocarbon dated to 32,000 years and beyond — and thirty years of argument about whether a fire in front of a cliff needs a person.",
    description:
      "Pedra Furada is a large rock shelter in the Serra da Capivara, near São Raimundo Nonato in Piauí, north-eastern Brazil. Niède Guidon excavated there from 1978, and Fabio Parenti continued the work; the shelter is part of a landscape with a great deal of rock art and a long later occupation nobody disputes.\n\n" +
      "WHAT WAS FOUND AND WHAT WAS CLAIMED. Concentrations of charcoal, burnt stone, and flaked quartzite and quartz cobbles, in layers radiocarbon dated to about 32,000 years, with the deeper sequence running older still. Guidon and Delibrias published the dates; the excavators interpret the charcoal concentrations as built hearths and the stone as a worked assemblage.\n\n" +
      "THE OBJECTION, WHICH IS NOT ABOUT THE DATES. In Antiquity in 1994, David Meltzer, James Adovasio and Tom Dillehay reported on a visit to the site and argued that the early material could not be distinguished from stone fractured and burnt by nature. The shelter stands beneath a high cliff of quartzite conglomerate: cobbles fall from it, strike the rock below, and flake. Natural fires burn in front of the shelter and their charcoal accumulates inside it. The charcoal really is 32,000 years old — what is disputed is whether anyone lit it.\n\n" +
      "THE EXCAVATORS REPLIED IN THE SAME JOURNAL, and the exchange became one of the defining methodological arguments in American archaeology. Their case rests on the structure of the charcoal concentrations, on the flaking patterns, and on the association between the two.\n\n" +
      "WHERE IT STANDS. Most archaeologists do not accept the earliest material as evidence of people. That is not the same as the site being dismissed: the later occupation is secure, the rock art is extraordinary, and the deep sequence continues to be reassessed. A 2023 reappraisal of the artefacts, structures and stratigraphy exists, which is the honest measure of whether a question is closed.",
    category: "archaeology",
    subcategory: "Peopling of the Americas",
    eventType: "disputed",
    eventTypeNote:
      "A disputed archaeological claim, argued in the journals by named specialists on both sides for three decades, and not resolved.",
    tags: ["pedra-furada", "brazil", "americas", "radiocarbon", "geofacts", "ancient-sites"],
    people: ["Niède Guidon", "Fabio Parenti", "David J. Meltzer", "James M. Adovasio", "Tom D. Dillehay"],
    locationName: "Pedra Furada, Serra da Capivara, Piauí, Brazil",
    lat: -8.8358,
    lng: -42.5464,
    claims: [
      {
        sourceKey: "guidon_reply",
        startYear: -30050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "human presence about 32,000 years ago",
        datingMethod: "radiocarbon",
        chronology: "disputed",
        whatIsDated: "Charcoal in the layers holding the flaked stone",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        evidence:
          "WHAT IS DATED: charcoal from concentrations in the shelter's deep deposits, associated with flaked " +
          "quartzite and quartz. DATING METHOD: radiocarbon, published by Guidon and Delibrias. WHAT IT " +
          "ESTABLISHES: that the charcoal is about that old. THE INFERENCE: that the concentrations are built " +
          "hearths and the stone is a worked assemblage, so the charcoal dates a human occupation. WHAT IT DOES " +
          "NOT ESTABLISH: that anybody lit the fire. WHY CRITICS DISPUTE IT: the shelter stands under a high " +
          "quartzite conglomerate cliff, so cobbles fall, strike rock below and flake; natural fires burn outside " +
          "and their charcoal collects within. Both the stone and the charcoal have a natural route into the " +
          "deposit, and the argument is over whether the observed patterns can be told apart from that.",
        notes:
          "The deeper sequence runs older than this — figures around 50,000 years appear in the literature — and " +
          "only the 32,000-year horizon is seeded, because it is the figure the published exchange is actually " +
          "about. Recorded as disputed rather than as alternative: this is a disagreement between archaeologists " +
          "in peer-reviewed journals, not an alternative-history claim.",
        citations: [
          {
            sourceKey: "meltzer1994",
            relation: "disputes",
            note:
              "Meltzer, Adovasio and Dillehay in Antiquity, 1994: the early material cannot be distinguished from " +
              "naturally fractured and naturally burnt stone.",
          },
          {
            sourceKey: "pedra_furada_reappraisal",
            relation: "context",
            note: "A 2023 reassessment, cited to show the question is still open rather than settled in the 1990s.",
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_AMERICAS_LINKS: SeedEventLink[] = [
  {
    from: ANCIENT_SITES_AMERICAS_ANCHOR_SLUG,
    to: "pumapunku-construction",
    relation: "associated",
    note:
      "One archaeological complex, two records. Giving a complex a single date and applying it to everything in it " +
      "is the mistake this dataset exists to prevent — the Pumapunku has its own construction date, from material " +
      "inside its own mound fill.",
  },
  {
    from: "calico-early-man-site",
    to: "pedra-furada-occupation",
    relation: "relevant",
    note:
      "The same question at two sites and on two continents: not how old the deposit is, but whether the stone in " +
      "it was struck by a person or by the place. At Calico the machine is an alluvial fan; at Pedra Furada it is " +
      "a cliff above a shelter.",
  },
  {
    from: "hueyatlaco-valsequillo",
    to: "pedra-furada-occupation",
    relation: "relevant",
    note:
      "Two disputed early-American chronologies where the disagreement is about context rather than about the " +
      "measurements — and where, in both cases, specialists who visited the site came away unconvinced.",
  },
];
