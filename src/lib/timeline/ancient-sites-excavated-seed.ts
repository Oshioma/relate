import type { SeedEvent, SeedSource, SeedTrack, SeedEventLink } from "./seed-types";

// =============================================================================
// EXCAVATED, OR NOT: TWO KINDS OF EXTRAORDINARY CLAIM
//
// Last tranche of the thirty-site brief, and it answers the question the other
// five raise. Several of these records carry claims that sounded impossible when
// they were first made. Some of those are now the accepted account. Others are
// not. WHAT SEPARATES THEM IS NOT HOW STRANGE THE CLAIM WAS.
//
// THE THREE THAT BECAME ACCEPTED:
//
//   • TELL QARAMEL. Stone towers older than the famous one at Jericho — which
//     was itself the oldest known. An extraordinary claim, and it is accepted,
//     because fifty-seven charcoal samples were dated and the chronology was
//     published in Radiocarbon.
//   • KARAHAN TEPE. Monumental architecture built by people who had not yet
//     taken up farming, around 9400 to 9000 BCE. Accepted, because it has been
//     excavated since 2019 under a named director and reported.
//   • NABTA PLAYA. Megaliths in the Egyptian desert two thousand years before
//     the pyramids. The DATES are accepted. The astronomical reading of them is
//     argued about — and the excavators said so themselves.
//
// THE TWO THAT DID NOT:
//
//   • VISOČICA, at Visoko. Geologists cored it. It is conglomerate, clay and
//     sandstone in the same alternating beds as every neighbouring hill, and
//     its triangular profile is a flatiron: a landform made by tilted beds and
//     differential erosion.
//   • GORNAYA SHORIA. Granite tors. Orthogonal joints split the rock into
//     rectangular blocks; spheroidal weathering rounds their corners and leaves
//     cracks between them.
//
// SO THE DIFFERENCE IS WHETHER ANYBODY DUG, MEASURED AND PUBLISHED. It is not
// that the accepted sites were modest in their claims — they were not, and two
// of them overturned what was previously the oldest known example of a thing.
// It is not that the rejected claims were rejected for being strange. It is
// that one group has dated samples and stratigraphy behind it and the other has
// a shape.
//
// AND ROCK FRACTURES IN STRAIGHT LINES. This is the third time this dataset has
// had to say it — Yonaguni's bedded sandstone parting along joints, Visočica's
// tilted beds, Gornaya Shoria's granite tors. Straight edges, flat faces and
// right angles are ordinary products of jointing and weathering. A right angle
// is not a signature. Knowing this one geological fact does more work than any
// amount of argument about who could have built what.
//
// NO CONFIDENCE SCORES. No verdict words of this record's own — where a scholar
// published a sharp judgement, it is quoted and attributed to them, and the
// record still rests on the geology rather than on a claim about anyone's
// intent.
// =============================================================================

export const ANCIENT_SITES_EXCAVATED_ANCHOR_SLUG = "karahan-tepe-excavated";

export const ANCIENT_SITES_EXCAVATED_TRACK: SeedTrack = {
  name: "Excavated, or not: two kinds of extraordinary claim",
  slug: "ancient-sites-excavated-or-not",
  kind: "theme",
  color: "#7a5c7e",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_EXCAVATED_SOURCES: SeedSource[] = [
  // --- Karahan Tepe -------------------------------------------------------
  {
    key: "wikipedia_karahan",
    title: "Karahan Tepe — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Karahan_Tepe",
    sourceType: "wikipedia",
    notes:
      "Used for the excavation history — systematic work since 2019 under Necmi Karul of Istanbul University, as " +
      "part of Türkiye's Taş Tepeler project — for the three interconnected sub-surface structures revealed " +
      "between 2019 and 2021, and for the dating. Orientation only; the date on the record is attributed to the " +
      "excavation rather than to this page.",
  },

  // --- Tell Qaramel -------------------------------------------------------
  {
    key: "mazurowski_radiocarbon2009",
    title:
      "Chronology of the early Pre-Pottery Neolithic settlement Tell Qaramel, northern Syria, in the light of radiocarbon dating",
    author: "Ryszard F. Mazurowski and colleagues",
    workTitle: "Radiocarbon",
    reference: "Volume 51, number 2 (2009), pages 771–781",
    url: "https://journals.uair.arizona.edu/index.php/radiocarbon/article/download/3532/3047",
    sourceType: "academic_paper",
    publishedYear: 2009,
    notes:
      "The chronology itself, and the reason this record is a control. Fifty-seven charcoal samples from the " +
      "excavations, dated at the GADAM Centre in Gliwice, published with the stratigraphy in a radiocarbon " +
      "journal. An extraordinary claim — towers older than the one at Jericho — supported in the most ordinary " +
      "way available.",
  },
  {
    key: "wikipedia_qaramel",
    title: "Tell Qaramel — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Tell_Qaramel",
    sourceType: "wikipedia",
    notes:
      "Used for the site's setting — a mound in Aleppo Governorate, 25 km north of Aleppo in the Queiq basin — for " +
      "the five circular towers, and for the span of excavation from 1999 under Ryszard Mazurowski of Warsaw " +
      "University. Orientation; the dating rests on the Radiocarbon paper.",
  },

  // --- Nabta Playa --------------------------------------------------------
  {
    key: "malville_nature1998",
    title: "Megaliths and Neolithic astronomy in southern Egypt",
    author: "J. McKim Malville, Fred Wendorf and colleagues",
    workTitle: "Nature",
    reference: "1998",
    sourceType: "academic_paper",
    publishedYear: 1998,
    notes:
      "The publication of the Nabta Playa megaliths and of the astronomical reading of them. Cited for both, and " +
      "particularly for the authors' own caution: they noted that certainty about alignments is hard to reach " +
      "because sand moves and the stones have been badly damaged in the millennia since they were set up. A " +
      "claimant stating the limits of their own claim is worth putting on a timeline.",
  },
  {
    key: "wikipedia_nabta",
    title: "Nabta Playa — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Nabta_Playa",
    sourceType: "wikipedia",
    notes:
      "Used for the calendar circle's form — a cromlech about four metres across, of upright sandstone slabs on a " +
      "sandy knoll, with one pair of slabs oriented roughly north and another to summer solstice sunrise — for the " +
      "radiocarbon span of 5500 to 4900 BCE, and for the state of the argument about the further alignments, " +
      "including the objection that the gaps between paired stones are too wide or too narrow for accurate " +
      "calendrical sighting.",
  },

  // --- Visočica -----------------------------------------------------------
  {
    key: "tuzla_geology2006",
    title: "Geological report on Visočica hill near Visoko",
    workTitle: "Faculty of Mining, Geology and Civil Engineering, University of Tuzla",
    reference: "Accepted by the Faculty's scientific and educational Council, 17 April 2006",
    sourceType: "academic_paper",
    publishedYear: 2006,
    notes:
      "The core samples, and the load-bearing evidence on that record. Geologists from Tuzla analysed material " +
      "from the hill at Osmanagić's own request and found alternating layers of conglomerate, clay and sandstone " +
      "— the same composition as the neighbouring hills. Cited for the measurement rather than for any verdict. " +
      "NEEDS SOURCE VERIFICATION for the report's authors and full title, which were not traced for this entry.",
  },
  {
    key: "eaa_open_letter2006",
    title: "Open letter to the government of Bosnia and Herzegovina concerning the Visoko excavations",
    author: "Anthony Harding, as President of the European Association of Archaeologists",
    reference: "2006",
    sourceType: "primary",
    notes:
      "Harding, a professor at Exeter and then president of the European Association of Archaeologists, wrote to " +
      "the Bosnian government describing the project as, in his words, a 'cruel hoax on an unsuspecting public'. " +
      "Cited as a dated fact about the reception, and quoted rather than adopted: the phrase is a judgement about " +
      "intent, which this dataset does not make on its own behalf, and the Visočica record rests on the cores " +
      "instead. In the same month twenty-one historians, geologists and archaeologists signed a separate letter in " +
      "the Bosnian press calling the excavations amateurish and unsupervised.",
  },
  {
    key: "wikipedia_osmanagic",
    title: "Semir Osmanagić — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Semir_Osmanagi%C4%87",
    sourceType: "wikipedia",
    notes:
      "Used for the claimant's own position and how it developed: he visited Visočica in April 2005, noticed the " +
      "hill's pyramidal shape, and argued it was an artificial pyramid — one of five such structures with a " +
      "prehistoric tunnel network — more than 12,000 years old. Cited for the claim rather than for its " +
      "assessment, because this dataset records a claim from its claimant.",
  },
  {
    key: "flatiron_geology",
    title: "Bosnian pyramid claims: the geology of the hill",
    url: "https://www.smithsonianmag.com/history/the-mystery-of-bosnias-ancient-pyramids-148990462/",
    workTitle: "Smithsonian Magazine",
    sourceType: "website",
    notes:
      "Cited for the landform explanation, which is the part that actually settles the question: Visočica's " +
      "triangular profile is a flatiron, produced where tectonic movement tilts horizontal sedimentary beds and " +
      "erosion then strips the soft exposed edges, leaving steep triangular ridges. A known process with a name, " +
      "which is what distinguishes an explanation from a dismissal.",
  },

  // --- Gornaya Shoria -----------------------------------------------------
  {
    key: "wikipedia_gornaya_shoria",
    title: "Gornaya Shoria megaliths — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Gornaya_Shoria_megaliths",
    sourceType: "wikipedia",
    notes:
      "Used for the 2013 expedition of nineteen researchers led by Georgi Sidorov, for the setting — the " +
      "ridgecrests and summit of Mount Kuylyum at 1,203 m — and for the geological account: granite tors formed by " +
      "differential erosion of jointed bedrock, where orthogonal joint sets opened by unloading and tectonic " +
      "stress during uplift divide the rock into rectangular blocks, and spheroidal weathering along those joints " +
      "leaves rounded corestones separated by cracks.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_EXCAVATED_EVENTS: SeedEvent[] = [
  // =========================================================================
  // KARAHAN TEPE — monumental building before farming, and it is the accepted
  // account because somebody is digging it.
  // =========================================================================
  {
    slug: ANCIENT_SITES_EXCAVATED_ANCHOR_SLUG,
    title: "Karahan Tepe is built",
    summary:
      "Monumental architecture raised by people who had not yet taken up farming — an extraordinary claim, and the accepted one, because the site is being excavated and reported.",
    description:
      "Karahan Tepe, in the Şanlıurfa region of south-eastern Türkiye, has been excavated systematically since 2019 under Necmi Karul of Istanbul University, as part of the Taş Tepeler project. Work between 2019 and 2021 revealed three interconnected sub-surface structures beneath a thick layer of soil and rubble on the hill's eastern and north-eastern slopes, including a chamber with rock-cut pillars and a carved human head rising from its floor.\n\n" +
      "THE CLAIM IS GENUINELY STARTLING AND IT IS THE MAINSTREAM ONE. The main structures date to roughly 9400 to 9000 BCE, in the Pre-Pottery Neolithic A — which is to say they were built by people who had not yet domesticated crops or animals. For most of the twentieth century the expected order was the other way round: farming first, surplus next, monuments after. Karahan Tepe and its neighbours invert that, and no alternative chronology was needed to get there.\n\n" +
      "HOW IT IS DATED, STATED PRECISELY. Radiocarbon from the excavations, together with the material culture — the tool types, the architecture, the absence of pottery — and the site's close resemblance to the securely dated layers at Göbekli Tepe a short distance away. THAT LAST STRAND IS A COMPARISON, and comparison is weaker than measurement: it places Karahan Tepe relative to a site whose own dates do the work. A reader should know which parts of this date are measured and which are matched.\n\n" +
      "THE EARLIEST STRUCTURES MAY BE OLDER, AND THAT IS LESS SETTLED. Stratigraphic and typological study has been read as putting the first building around 10,000 to 9,500 BCE, with activity continuing to roughly 8000 BCE. That figure rests more heavily on the comparative strand than the main structures do, and it is recorded here as a separate and looser claim rather than folded into the first.\n\n" +
      "WHY THIS RECORD OPENS THIS GROUP. Everything that makes Karahan Tepe believable is procedural: a named director, a funded project, annual seasons, samples, publication. The two rejected claims later in this group are not rejected for being strange. They are rejected for not having any of that.",
    category: "archaeology",
    subcategory: "Accepted chronology",
    eventType: "mainstream",
    eventTypeNote:
      "Not disputed. Here because it is an extraordinary claim that the ordinary methods established — and because the record says which strand of its dating is measured and which is comparative.",
    tags: ["karahan-tepe", "tas-tepeler", "turkiye", "neolithic", "control", "ancient-sites"],
    people: ["Necmi Karul"],
    civilisations: ["Pre-Pottery Neolithic"],
    locationName: "Karahan Tepe, Şanlıurfa Province, Türkiye",
    lat: 37.0731,
    lng: 39.2917,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Karahantepe2.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Karahantepe2.jpg?width=1024",
        shows: "site",
        caption:
          "Karahan Tepe under excavation. Pillared structures of the same tradition as Göbekli Tepe, dug and dated " +
          "by ordinary archaeology — an extraordinary age arrived at by unextraordinary means.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Karahan_Tepe_man_1100.jpg?width=1024",
        shows: "artefact",
        caption:
          "A carved human head from the site, in the Şanlıurfa museum. Objects like this come out of dated " +
          "deposits, which is what separates this record from the claimed sites elsewhere in the group.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "wikipedia_karahan",
        startYear: -9399,
        endYear: -8999,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the main structures, about 9400 to 9000 BCE, in the Pre-Pottery Neolithic A",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        whatIsDated: "The main excavated structures",
        evidence:
          "WHAT IS DATED: the principal buildings revealed by excavation. DATING METHOD: radiocarbon from the dig, " +
          "read with the material culture — tool types, architecture, the absence of pottery. WHAT IT ESTABLISHES: " +
          "that monumental building was under way here before the domestication of crops and animals, which " +
          "reverses the order archaeology long expected. WHAT IT DOES NOT ESTABLISH: a year, or the date of the " +
          "site's first occupation, which is a separate and looser question recorded in its own claim.",
        notes:
          "Stored in astronomical year numbering: 9400 BCE is −9399. A century-level bracket marked approximate.\n\n" +
          "PART OF THIS DATE IS A COMPARISON WITH GÖBEKLI TEPE, a short distance away and securely dated, and the " +
          "description says so. Comparison is weaker than measurement and the record should not blur them.",
      },
      {
        sourceKey: "wikipedia_karahan",
        startYear: -9999,
        endYear: -9499,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the earliest structures, read as about 10,000 to 9,500 BCE on stratigraphy and typology",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        whatIsDated: "The first building on the site, on the looser of the two arguments",
        evidence:
          "WHAT IS DATED: the beginning of construction. DATING METHOD: stratigraphy and typology — the sequence of " +
          "deposits and the comparison of forms — rather than a measurement of the earliest structures " +
          "themselves. WHAT IT ESTABLISHES: a reading on which occupation began in the middle of the Pre-Pottery " +
          "Neolithic A and continued to roughly 8000 BCE. WHAT IT DOES NOT ESTABLISH: the same confidence as the " +
          "claim above. It leans harder on comparison with Göbekli Tepe, and a reader is entitled to see that the " +
          "two claims on this record are not equally firm.",
        notes:
          "Kept as a separate claim precisely so the difference in strength is visible. A record that published " +
          "only the widest bracket would be presenting the least secure figure as the site's date.\n\n" +
          "NEEDS SOURCE VERIFICATION for the excavation's own published statement of this range, which was not " +
          "traced to a primary report for this entry.",
      },
    ],
  },

  // =========================================================================
  // TELL QARAMEL — fifty-seven samples, and the oldest towers known.
  // =========================================================================
  {
    slug: "tell-qaramel-towers",
    title: "The towers at Tell Qaramel are built",
    summary:
      "Five circular stone towers in northern Syria, older than the famous tower at Jericho — established by fifty-seven dated charcoal samples published in a radiocarbon journal.",
    description:
      "Tell Qaramel is a mound in Aleppo Governorate, about 25 km north of Aleppo in the Queiq river basin. Excavation from 1999, led by Ryszard F. Mazurowski of Warsaw University, concentrated on Protoneolithic and early Pre-Pottery Neolithic deposits and uncovered five circular stone towers.\n\n" +
      "THE CLAIM AND WHY IT WAS EXTRAORDINARY. The towers date to between roughly 10,650 and 9,650 BCE, which makes them the oldest such constructions known — older than the tower at Jericho, which had itself held that position and is one of the most discussed structures in Near Eastern archaeology. Displacing it is not a small claim.\n\n" +
      "AND IT IS ACCEPTED, FOR A COMPLETELY ORDINARY REASON. Fifty-seven charcoal samples were collected during excavation and dated at the GADAM Centre in Gliwice. The stratigraphy and the dates were published together in Radiocarbon in 2009. That is the whole mechanism: dig, sample, date, publish, and let other people check.\n\n" +
      "FIFTY-SEVEN IS THE NUMBER WORTH NOTICING. A single date can be wrong in a dozen ways — old wood, contamination, a sample from the wrong context. Fifty-seven dates, from a recorded stratigraphy, constrain each other. The strength of this chronology is not that any one measurement is remarkable but that there are enough of them, from known positions, to be checked against each other.\n\n" +
      "THIS IS THE CLEANEST CONTROL IN THE WHOLE DATASET. Several records on this timeline carry claims to have found the oldest something. This one carries that claim, it is believed, and the reason is entirely visible in the literature. Wherever a claim elsewhere is not believed, the difference can be read against this record rather than taken on trust.",
    category: "archaeology",
    subcategory: "Accepted chronology",
    eventType: "mainstream",
    eventTypeNote:
      "Not disputed. The control for this whole dataset: an extraordinary claim, accepted, with the reason visible — fifty-seven dated samples and a published stratigraphy.",
    tags: ["tell-qaramel", "syria", "neolithic", "towers", "control", "ancient-sites"],
    people: ["Ryszard F. Mazurowski"],
    civilisations: ["Pre-Pottery Neolithic"],
    locationName: "Tell Qaramel, Aleppo Governorate, Syria",
    lat: 36.4,
    lng: 37.1,
    claims: [
      {
        sourceKey: "mazurowski_radiocarbon2009",
        startYear: -10649,
        endYear: -9649,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the circular towers, about 10,650 to 9,650 BCE, from 57 charcoal samples and the site stratigraphy",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        whatIsDated: "The five circular stone towers",
        evidence:
          "WHAT IS DATED: the towers, through charcoal from the deposits they belong to. DATING METHOD: radiocarbon " +
          "— fifty-seven samples dated at the GADAM Centre in Gliwice, read against the excavated stratigraphy and " +
          "published together in Radiocarbon in 2009. WHAT IT ESTABLISHES: that these are the oldest constructions " +
          "of their kind known, earlier than the tower at Jericho. WHAT IT DOES NOT ESTABLISH: that nothing older " +
          "exists anywhere — 'the oldest known' is a statement about what has been found and dated, and it is the " +
          "only kind of statement any site can make.",
        notes:
          "Stored in astronomical year numbering: 10,650 BCE is −10649.\n\n" +
          "THE SAMPLE COUNT IS THE POINT AND IS KEPT IN THE DATE TEXT. One date can fail in several ways; " +
          "fifty-seven from a recorded stratigraphy constrain one another. That is what makes this the control.",
      },
      {
        sourceKey: "wikipedia_qaramel",
        startYear: 1999,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "excavation from 1999, led by Ryszard Mazurowski of Warsaw University",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The excavation that produced the chronology",
        evidence:
          "WHAT IS DATED: the start of systematic excavation. DATING METHOD: the historical record. WHAT IT " +
          "ESTABLISHES: that the towers were found and recorded by a named director in a sustained campaign, which " +
          "is what made samples from known contexts possible. WHAT IT DOES NOT ESTABLISH: anything about the " +
          "towers on its own — but on this timeline the existence of a controlled excavation is evidence, because " +
          "it is exactly what the two rejected claims in this group lack.",
        notes:
          "On the record as a claim of its own, for the same reason Dwarka's excavation campaign is. Method is " +
          "evidence, and a timeline about disputed dates should be able to show it rather than assume it.",
      },
    ],
  },

  // =========================================================================
  // NABTA PLAYA — the dates are solid and the interpretation is not, and the
  // excavators were the ones who said so.
  // =========================================================================
  {
    slug: "nabta-playa-megaliths",
    title: "The Nabta Playa megaliths are set up",
    summary:
      "Upright stones in the Egyptian desert two thousand years before the pyramids. The radiocarbon is accepted; the astronomical reading is argued about, and the excavators said certainty was hard.",
    description:
      "At Nabta Playa in the Nubian desert of southern Egypt, a circle of upright narrow sandstone slabs about four metres across stands on a low sandy knoll, with further megaliths set along lines nearby. Malville, Wendorf and colleagues published the site and an astronomical reading of it in Nature in 1998.\n\n" +
      "THE DATES ARE NOT IN DISPUTE. Radiocarbon places the remains between roughly 5500 and 4900 BCE — two thousand years or so before the Giza pyramids, by people herding cattle in what was then a seasonally wet landscape. That much is ordinary, accepted archaeology, and it is remarkable on its own.\n\n" +
      "THE ASTRONOMICAL READING IS A SEPARATE CLAIM AND IS RECORDED AS ONE. Within the circle, two pairs of slabs form sightlines: one oriented approximately north, the other towards sunrise at the summer solstice. For a cattle-herding people in a landscape that filled with water at a particular time of year, a solstice sightline is a plausible and useful thing to build.\n\n" +
      "AND THE AUTHORS THEMSELVES SET OUT THE DIFFICULTY, which is why this record sits in this group rather than among the disputes. Wendorf and Malville noted that certainty about alignments is hard to reach here, because sand moves and the stones have been badly damaged in the millennia since they were placed. A claimant stating the limits of their own claim is a thing worth showing on a timeline, and it is the opposite of what a reader meets in the two records at the end of this group.\n\n" +
      "THE OBJECTIONS ARE SPECIFIC, WHICH IS WHAT MAKES THEM USEFUL. The astronomical purpose of the six further slabs set along two lines is argued about. One objection is that the gaps between the paired stones are either too wide or too narrow for accurate calendrical sighting, and that no convincing interpretation of the further alignments has been offered. Whether the site was a ceremonial centre or a seasonal gathering place for herders is also open.\n\n" +
      "SO THIS IS THE THIRD SHAPE IN THIS GROUP. Tell Qaramel and Karahan Tepe are extraordinary claims that the evidence carried. Visočica and Gornaya Shoria are claims the evidence did not. Nabta Playa is a real site with solid dates and an interpretation that is honestly uncertain — and saying 'honestly uncertain' is not a criticism of anybody. It is the normal state of a good question.",
    category: "archaeology",
    subcategory: "Accepted chronology",
    eventType: "mainstream",
    eventTypeNote:
      "The dates are accepted and not disputed. The astronomical interpretation is contested, including by its own authors, and is carried as a separate claim from the date.",
    tags: ["nabta-playa", "egypt", "megalithic", "archaeoastronomy", "neolithic", "ancient-sites"],
    people: ["J. McKim Malville", "Fred Wendorf"],
    locationName: "Nabta Playa, Nubian Desert, southern Egypt",
    lat: 22.5,
    lng: 30.72,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Megaliths_Aswan_Nubia_museum.JPG?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Megaliths_Aswan_Nubia_museum.JPG?width=1024",
        shows: "reconstruction",
        caption:
          "The Nabta Playa stone circle AS RE-ERECTED IN THE NUBIA MUSEUM AT ASWAN — not in place in the desert. A " +
          "relocated monument is a reconstruction of an arrangement, and anything measured from these stones today " +
          "is measured from the museum's placing of them.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Megaliths_Aswan_Nubia_museum.JPG?width=1024",
        shows: "artefact",
        caption:
          "Nabta Playa megaliths in the Nubia Museum at Aswan. THE STONES HAVE BEEN MOVED: they were lifted from " +
          "the desert and re-erected indoors, so their arrangement here is a museum's, and any alignment argument " +
          "has to be made from the survey of the site and not from this.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Calendar_aswan.JPG?width=1024",
        shows: "reconstruction",
        caption:
          "The Nabta Playa \"calendar circle\", reassembled in the Nubia Museum. It is a reconstruction of a " +
          "arrangement recorded in the field, and the astronomical readings proposed for it are proposals about the " +
          "original ground, not about these stones as they now stand.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "wikipedia_nabta",
        startYear: -5499,
        endYear: -4899,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the remains dated by radiocarbon to about 5500 to 4900 BCE",
        datingMethod: "radiocarbon",
        chronology: "conventional",
        whatIsDated: "The remains at the site, including the setting of the stones",
        evidence:
          "WHAT IS DATED: excavated material from the site. DATING METHOD: radiocarbon. WHAT IT ESTABLISHES: that " +
          "people were setting up megaliths in the Egyptian desert around two thousand years before the Giza " +
          "pyramids. WHAT IT DOES NOT ESTABLISH: what the stones were for. The date and the purpose are different " +
          "questions, and on this record they are different claims.",
        notes:
          "Stored in astronomical year numbering: 5500 BCE is −5499. This figure is not contested by anyone and is " +
          "the solid part of the record.",
      },
      {
        sourceKey: "malville_nature1998",
        startYear: -5499,
        endYear: -4899,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "two pairs of slabs read as sightlines, one roughly north and one to summer solstice sunrise",
        datingMethod: "astronomical",
        chronology: "archaeological",
        whatIsDated: "What the builders may have been sighting on — the interpretation, not the date",
        evidence:
          "WHAT IS DATED: nothing. The alignment is an interpretation of the standing stones and is kept as its own " +
          "claim so it cannot be mistaken for a measurement of age. DATING METHOD: observation of the orientations " +
          "as they now stand. WHAT IT ESTABLISHES: that two pairs of slabs form lines pointing approximately north " +
          "and to solstice sunrise, which for cattle herders in a seasonally wet landscape would have been worth " +
          "marking. WHAT IT DOES NOT ESTABLISH: that they were set for that purpose, and the authors said so — " +
          "sand moves and the stones are badly damaged, so certainty is not available. The purpose of six further " +
          "slabs on two lines is argued about, with the objection that the gaps between paired stones are too wide " +
          "or too narrow for accurate sighting.",
        notes:
          "THE CLAIMANTS STATED THE LIMITS OF THEIR OWN CLAIM, and that is recorded here as a fact about them " +
          "rather than as a weakness found by somebody else. It is also the behaviour that the two records at the " +
          "end of this group conspicuously lack.\n\n" +
          "Sharing the stored bracket with the date claim, because an interpretation has no date of its own. What " +
          "it dates is in its own heading, which is how a reader tells the two apart.",
      },
    ],
  },

  // =========================================================================
  // VISOČICA — a hill with a name for its shape.
  // =========================================================================
  {
    slug: "visocica-pyramid-claim",
    title: "Visočica hill is claimed as a pyramid",
    summary:
      "A triangular hill at Visoko, argued to be an artificial pyramid over 12,000 years old — and cored by geologists, who found the same conglomerate, clay and sandstone as every hill around it.",
    description:
      "In April 2005 Semir Osmanagić visited Visočica hill near Visoko in Bosnia and Herzegovina, noticed its pyramidal profile, and began arguing that it is an artificial pyramid: one of five such structures, linked by a prehistoric tunnel network, built more than twelve thousand years ago by an unidentified civilisation. He points to what he reads as alignment with the cardinal points, to blocks he identifies as man-made concrete, and to reported energy fields.\n\n" +
      "GEOLOGISTS CORED THE HILL, AT HIS OWN REQUEST. In early 2006 a team from the University of Tuzla analysed core samples from Visočica. They found alternating layers of conglomerate, clay and sandstone — the same composition as the other hills in the area. The report was accepted by the Faculty's scientific and educational Council on 17 April 2006.\n\n" +
      "AND THE SHAPE HAS A NAME. Visočica's striking triangular symmetry is a flatiron: a landform produced where tectonic movement tilts horizontal sedimentary beds up at an angle, after which rain and wind strip the soft exposed edges, leaving steep-sided triangular ridges. This is a well-described process that makes pyramid-like hills without anyone building anything, and the blocks read as concrete have been identified as naturally occurring geopolymers.\n\n" +
      "THAT IS THE WHOLE OF THE ANSWER, AND IT IS GEOLOGICAL. Not an argument about whether a prehistoric population could have organised such a thing, and not a claim about anybody's motives. A core through the hill shows what the hill is made of, in the same way that a core through the Bimini blocks showed the bedding running continuously from one to the next. Both are tests chosen because they can discriminate.\n\n" +
      "THE RECEPTION IS ITSELF A DATED FACT AND IS RECORDED AS ONE. In April 2006 twenty-one historians, geologists and archaeologists signed a letter in the Bosnian press calling the excavations amateurish and lacking proper scientific supervision. Anthony Harding, professor at Exeter and then president of the European Association of Archaeologists, wrote to the Bosnian government describing the project in his own words as a 'cruel hoax on an unsuspecting public'. That phrase is quoted and attributed because he published it; THIS RECORD DOES NOT ADOPT IT, because it is a claim about intent and this dataset does not make those. The cores are enough.\n\n" +
      "THE CLAIMANT'S DATE HAS MOVED, AND IN THE OPPOSITE DIRECTION TO KIMURA'S. Where Kimura revised Yonaguni down from ten thousand years to two or three, Osmanagić has been reported as moving his construction date back from 'over 12,000 years ago' to 35,000 BCE. Both revisions are on this timeline under the names of the people who made them, because the date a claimant currently holds is the claim.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "A natural landform argued to be built. The question is not the hill's age but whether it is a structure at all, and the cores address exactly that.",
    tags: ["visoko", "visocica", "bosnia", "osmanagic", "flatiron", "ancient-sites"],
    people: ["Semir Osmanagić", "Anthony Harding"],
    locationName: "Visočica hill, Visoko, Bosnia and Herzegovina",
    lat: 43.9889,
    lng: 18.1778,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bosnian_Pyramid.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Bosnian_Pyramid.jpg?width=1024",
        shows: "site",
        caption:
          "Visočica hill, near Visoko. The claim is that this is a colossal artificial pyramid; geological survey " +
          "identifies it as a flatiron, a natural landform produced by tilted rock layers. The photograph is of a " +
          "hill, and which of those it is cannot be settled by looking at it.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "wikipedia_osmanagic",
        startYear: -10050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "Osmanagić's claim of an artificial pyramid more than 12,000 years old",
        datingMethod: "claimant_inference",
        chronology: "alternative",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "The hill as a built structure — the claimant's inference from its shape",
        evidence:
          "WHAT IS DATED: the hill, on the assumption that it was built. DATING METHOD: the claimant's inference, " +
          "from the pyramidal profile, a reading of cardinal alignment, and blocks interpreted as man-made " +
          "concrete. WHAT IT ESTABLISHES: what Osmanagić argues, which is why the claim is on the record under his " +
          "name. WHAT IT DOES NOT ESTABLISH: that the hill is a structure, which is the prior question and is its " +
          "own claim below. No sample from Visočica has been dated to support this figure.",
        notes:
          "Converted from years before present rather than carried across as a round figure.\n\n" +
          "HIS POSITION HAS BEEN REPORTED AS MOVING BACK to 35,000 BCE, which would be a revision in the opposite " +
          "direction to Kimura's at Yonaguni. NEEDS SOURCE VERIFICATION: that later figure was not traced to " +
          "Osmanagić's own statement of it for this entry, so it is described rather than seeded as a claim.",
      },
      {
        sourceKey: "tuzla_geology2006",
        startYear: 2006,
        startMonth: 4,
        startDay: 17,
        datePrecision: "day",
        isApproximate: false,
        originalDateText: "the Tuzla geological report on Visočica, accepted by the Faculty Council on 17 April 2006",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The geological report, and the coring it rests on",
        evidence:
          "WHAT IS DATED: the report's acceptance. DATING METHOD: the historical record. WHAT IT ESTABLISHES: that " +
          "geologists cored the hill — at Osmanagić's own request — and found alternating layers of conglomerate, " +
          "clay and sandstone, the same as the neighbouring hills. WHAT IT DOES NOT ESTABLISH: anything about " +
          "intent or motive on anyone's part. It establishes what the hill is made of, which is the question that " +
          "can actually be settled.",
        notes:
          "The coring is the load-bearing evidence on this record and so it gets a claim rather than a sentence. " +
          "Compare Bimini: there too a core, chosen because it can discriminate between the two explanations on " +
          "offer, did what photographs could not.",
        citations: [
          {
            sourceKey: "eaa_open_letter2006",
            relation: "context",
            note:
              "The reception in 2006 — twenty-one scholars' letter in the Bosnian press, and Harding's open letter " +
              "to the government, quoted and attributed rather than adopted.",
          },
        ],
      },
      {
        sourceKey: "flatiron_geology",
        startYear: -10050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "the hill's triangular profile identified as a flatiron, a landform of tilted beds and differential erosion",
        datingMethod: "claimant_inference",
        chronology: "geological",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "Whether the hill is a structure at all — the interpretation, not the hill's age",
        evidence:
          "WHAT IS DATED: nothing. This is the prior question, and the claim above is an answer to it rather than " +
          "evidence for it. DATING METHOD: identification of the landform — a flatiron, formed where tectonic " +
          "movement tilts horizontal sedimentary beds and erosion then strips the soft exposed edges, leaving " +
          "steep triangular ridges. WHAT IT ESTABLISHES: that the shape has a known mechanism requiring nobody to " +
          "have built it, and that the blocks read as concrete are identified as naturally occurring geopolymers. " +
          "WHAT IT DOES NOT ESTABLISH: that nothing human ever happened on this hill, which is a different and " +
          "much smaller question than whether the hill is a pyramid.",
        notes:
          "Sharing a stored year with the claim it answers, because an interpretation has no date of its own.\n\n" +
          "THE SAME SHAPE AS YONAGUNI AND BIMINI. A named geological process that produces the observed form is " +
          "an explanation; 'nobody could have built that' and 'of course somebody built that' are both just " +
          "assertions. The process is what moves the argument.",
      },
    ],
  },

  // =========================================================================
  // GORNAYA SHORIA — granite does this.
  // =========================================================================
  {
    slug: "gornaya-shoria-megaliths",
    title: "The Gornaya Shoria blocks are reported",
    summary:
      "Rectangular granite blocks on a Siberian ridge, reported in 2013 as cyclopean walls. Granite tors: orthogonal joints split the rock into blocks and weathering rounds their corners.",
    description:
      "In 2013 an expedition of nineteen researchers led by Georgi Sidorov visited Gornaya Shoria in southern Siberia and photographed very large rectangular granite blocks forming the ridgecrests and summit of Mount Kuylyum, at 1,203 metres. The photographs circulated widely as evidence of cyclopean walling by an unknown civilisation.\n\n" +
      "WHAT THE GEOLOGY SAYS, AND IT IS SPECIFIC. These are granite tors — residual hills and ridges left by differential erosion of jointed bedrock, and common in the Siberian uplands. As granite is unloaded and stressed during uplift it develops orthogonal joint sets: fractures meeting at right angles, which divide the rock into rectangular blocks. Groundwater then circulates along those joints and weathers the rock beside them, a process called spheroidal weathering, which leaves rounded-cornered blocks — corestones — separated by cracks of varying width. Erosion strips the weathered material and the blocks stand exposed.\n\n" +
      "THAT PRODUCES EXACTLY WHAT THE PHOTOGRAPHS SHOW: flat faces, right angles, courses, and gaps that look like joints in masonry. It is not a coincidence that needs explaining away; it is what jointed granite looks like when it weathers.\n\n" +
      "NO DATE FOR ANY STRUCTURE IS SEEDED ON THIS RECORD, because there is nothing to date. No excavation has been reported, no samples, no stratigraphy. Figures in the region of a hundred thousand years circulate in popular accounts of the site; none could be traced to anyone who proposed it on evidence, so none is recorded here. What is dated is the expedition.\n\n" +
      "THE THIRD TIME THIS DATASET HAS MADE THE SAME POINT, and the last, so it is worth stating plainly. At Yonaguni, bedded sandstone parts along bedding planes and joints in an earthquake zone. At Visočica, tilted sedimentary beds erode into a triangular flatiron. Here, jointed granite weathers into stacked rectangular blocks. ROCK FRACTURES IN STRAIGHT LINES. A right angle in stone is not a signature, and a reader who learns only this from the whole dataset has learned the most useful thing in it.",
    category: "archaeology",
    subcategory: "Disputed chronology",
    eventType: "disputed",
    eventTypeNote:
      "A natural landform read as built. Nothing here has been excavated or dated, so the only dated claim on the record is the expedition that photographed it.",
    tags: ["gornaya-shoria", "siberia", "russia", "granite-tors", "jointing", "ancient-sites"],
    people: ["Georgi Sidorov"],
    locationName: "Mount Kuylyum, Gornaya Shoria, southern Siberia",
    lat: 52.9,
    lng: 88.0,
    claims: [
      {
        sourceKey: "wikipedia_gornaya_shoria",
        startYear: 2013,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "the 2013 expedition of nineteen researchers led by Georgi Sidorov",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The expedition that photographed the blocks",
        evidence:
          "WHAT IS DATED: the visit. DATING METHOD: the historical record. WHAT IT ESTABLISHES: that a named party " +
          "went to Mount Kuylyum in 2013 and photographed very large rectangular granite blocks along the " +
          "ridgecrests and summit. WHAT IT DOES NOT ESTABLISH: anything about the blocks. An expedition that " +
          "photographs a landform has recorded its appearance, which is not the same as having investigated it.",
        notes:
          "This is the only firmly dated thing on the record, and that is the record. No excavation, no samples " +
          "and no stratigraphy have been reported from this site.\n\n" +
          "FIGURES AROUND A HUNDRED THOUSAND YEARS CIRCULATE for these 'structures'. NEEDS SOURCE VERIFICATION: " +
          "none could be traced to a person proposing it on evidence, so no such claim is seeded.",
      },
      {
        sourceKey: "wikipedia_gornaya_shoria",
        startYear: 2013,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "the blocks identified as granite tors, formed by orthogonal jointing and spheroidal weathering",
        datingMethod: "claimant_inference",
        chronology: "geological",
        whatIsDated: "Whether the blocks were shaped and stacked by people at all — the interpretation",
        evidence:
          "WHAT IS DATED: nothing. The making question, kept as its own claim because it is the entire " +
          "disagreement. DATING METHOD: identification of the landform — granite tors, residual ridges left by " +
          "differential erosion of jointed bedrock. Orthogonal joint sets, opened by unloading and tectonic stress " +
          "during uplift, divide granite into rectangular blocks; spheroidal weathering along those joints leaves " +
          "rounded-cornered corestones separated by cracks; erosion removes the weathered material. WHAT IT " +
          "ESTABLISHES: that flat faces, right angles and apparent courses are the expected product of this " +
          "process. WHAT IT DOES NOT ESTABLISH: that nobody ever used the place — a much smaller question, and " +
          "not the one the photographs were offered to settle.",
        notes:
          "Filed as the same kind of claim as Schoch's reading at Yonaguni and the flatiron identification at " +
          "Visočica. Stored at the year of the expedition because an interpretation has no date of its own; what " +
          "it dates is in its own heading.\n\n" +
          "ROCK FRACTURES IN STRAIGHT LINES, and this is the third site in the dataset where that single fact is " +
          "the answer. A right angle is not a signature.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

export const ANCIENT_SITES_EXCAVATED_LINKS: SeedEventLink[] = [
  {
    from: "tell-qaramel-towers",
    to: ANCIENT_SITES_EXCAVATED_ANCHOR_SLUG,
    relation: "relevant",
    note:
      "Two extraordinary claims that the ordinary methods carried — towers older than Jericho's, and monumental " +
      "building before farming. Neither needed an alternative chronology, and both have named excavators.",
  },
  {
    from: "tell-qaramel-towers",
    to: "visocica-pyramid-claim",
    relation: "relevant",
    note:
      "The comparison the whole group is built around. Fifty-seven dated charcoal samples and a published " +
      "stratigraphy against a hill with a pyramidal profile and cores showing it is made of the same rock as its " +
      "neighbours. The difference is not how strange the claim was.",
  },
  {
    from: "visocica-pyramid-claim",
    to: "gornaya-shoria-megaliths",
    relation: "relevant",
    note:
      "The same geological point twice. Tilted sedimentary beds erode into triangular flatirons; jointed granite " +
      "weathers into stacked rectangular blocks. Rock fractures in straight lines.",
  },
  {
    from: "nabta-playa-megaliths",
    to: ANCIENT_SITES_EXCAVATED_ANCHOR_SLUG,
    relation: "relevant",
    note:
      "Both accepted, and both careful about which part of the claim is measured. Karahan Tepe's record separates " +
      "its radiocarbon from its comparison with Göbekli Tepe; Nabta Playa's separates its radiocarbon from its " +
      "astronomical reading, which its own authors called uncertain.",
  },
];
