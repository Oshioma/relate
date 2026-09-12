import { astronomicalFromYearsAgo } from "./time";
import type { SeedEvent, SeedSource, SeedTrack } from "./seed-types";

// AROUND A HUNDRED THOUSAND YEARS AGO — FIVE RECORDS ABOUT INFERENCE.
//
// Early Homo sapiens in the Levant, ochre, shell beads, burials, and the
// Neanderthals living alongside them. It is one of the most argued-over corners
// of archaeology, and the argument is almost never about the finds. It is about
// what the finds mean.
//
// THE CONVENTION THIS DATASET USES, AND WHY.
//
// Every claim below separates two things that are usually run together:
//
//   EVIDENCE — what was dug up, measured or observed. A perforated shell
//   thirty miles from the sea. Two antlers in contact with a child's hands.
//   Ochre with traces of grinding. These are facts about objects, and they are
//   the part that another archaeologist could go and check.
//
//   INTERPRETATION — what it is taken to mean. A bead. A grave offering.
//   Symbolic behaviour. These are arguments, sometimes very strong ones, and
//   they are not the same kind of statement as the sentence above them.
//
// The schema already carries this distinction without any change: `evidence`
// says what was found and what dated it, `notes` says what is inferred and by
// whom, and `chronology` marks a claim that is an interpretation rather than a
// measurement. Nothing new was needed — which is a fact about the design of
// this feature rather than a convenience.
//
// WHY IT MATTERS HERE MORE THAN ANYWHERE. "Humans practised burial rituals
// 100,000 years ago" is the sentence a reader will meet everywhere. What was
// actually found is a body in a pit with two antlers on its chest. The first
// sentence may well be true. It is not what was dug up, and a timeline that
// cannot show the difference is not teaching anybody how to think about it.
//
// RULES: nothing invented — every citation is a real publication with real
// details, and a DOI is given only where it was verified. No confidence scores.
// Dates are claims, made by sources, with the method that produced them.

/** Thousands of years ago → astronomical year. */
const ka = (thousands: number): number => astronomicalFromYearsAgo(thousands * 1000);

export const EARLY_SAPIENS_ANCHOR_SLUG = "qafzeh-early-homo-sapiens";

export const EARLY_SAPIENS_TRACK: SeedTrack = {
  name: "Early Homo sapiens",
  slug: "early-homo-sapiens",
  kind: "theme",
  color: "#7a52a8",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const EARLY_SAPIENS_SOURCES: SeedSource[] = [
  {
    key: "valladas1988",
    title: "Thermoluminescence dates of Mousterian “Proto-Cro-Magnon” remains from Israel and the origin of modern man",
    author: "Hélène Valladas and colleagues",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature 331, 614–616",
    url: "https://www.nature.com/articles/331614a0",
    sourceType: "academic_paper",
    publishedYear: 1988,
    publishedDisplay: "1988",
    notes:
      "Thermoluminescence dates on twenty burnt flints from the hominin-bearing layers at Qafzeh, placing the early Homo sapiens there at around ninety thousand years. The method dates the last time a flint was heated in a fire — so it dates human activity directly, which is rarer and more useful than it sounds.",
  },
  {
    key: "grun2005",
    title: "U-series and ESR analyses of bones and teeth relating to the human burials from Skhul",
    author: "Rainer Grün and colleagues",
    publisher: "Elsevier",
    workTitle: "Journal of Human Evolution",
    reference: "Journal of Human Evolution 49, 316–334",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0047248405000904",
    sourceType: "academic_paper",
    publishedYear: 2005,
    publishedDisplay: "2005",
    notes:
      "Direct dating of the Skhul human remains by uranium-series and electron spin resonance, placing the Skhul, Qafzeh and Tabun burials in the range of about 100,000–130,000 years. Cited for those figures, and as the counterweight to the thermoluminescence dates: different materials, different assumptions, different answers.",
  },
  {
    key: "hovers2003",
    title: "An Early Case of Color Symbolism: Ochre Use by Modern Humans in Qafzeh Cave",
    author: "Erella Hovers, Shimon Ilani, Ofer Bar-Yosef and Bernard Vandermeersch",
    publisher: "University of Chicago Press",
    workTitle: "Current Anthropology",
    reference: "Current Anthropology 44(4), 491–522. DOI 10.1086/375869",
    url: "https://www.journals.uchicago.edu/doi/10.1086/375869",
    sourceType: "academic_paper",
    publishedYear: 2003,
    publishedDisplay: "2003",
    notes:
      "The ochre from the Qafzeh terrace, analysed geochemically and petrographically to test whether it was selected and brought in for its colour. Cited for BOTH halves of what it contains, and they are different: the material analysis, and the argument built on it about symbolism. The paper itself is explicit that the second is an argument.",
  },
  {
    key: "henshilwood2011",
    title: "A 100,000-Year-Old Ochre-Processing Workshop at Blombos Cave, South Africa",
    author:
      "Christopher S. Henshilwood, Francesco d'Errico, Karen L. van Niekerk, Yvan Coquinot, Zenobia Jacobs, Stein-Erik Lauritzen, Michel Menu and Renata García-Moreno",
    publisher: "American Association for the Advancement of Science",
    workTitle: "Science",
    reference: "Science 334, 219–222. DOI 10.1126/science.1211535",
    url: "https://www.science.org/doi/10.1126/science.1211535",
    sourceType: "academic_paper",
    publishedYear: 2011,
    publishedDisplay: "2011",
    notes:
      "A workshop where an ochre-rich mixture was made and stored in two abalone shells, about a hundred thousand years ago. Cited because it is evidence of PROCESS rather than of a finished object: grindstones, hammerstones, bone, charcoal and the containers, which together describe a recipe being followed.",
  },
  {
    key: "vanhaeren2006",
    title: "Middle Paleolithic Shell Beads in Israel and Algeria",
    author: "Marian Vanhaeren, Francesco d'Errico, Chris Stringer, Sarah L. James, Jonathan A. Todd and Henk K. Mienis",
    publisher: "American Association for the Advancement of Science",
    workTitle: "Science",
    reference: "Science 312, 1785–1788. DOI 10.1126/science.1128139",
    url: "https://www.science.org/doi/abs/10.1126/science.1128139",
    sourceType: "academic_paper",
    publishedYear: 2006,
    publishedDisplay: "2006",
    notes:
      "Perforated marine shells from Skhul in Israel and Oued Djebbana in Algeria. Cited for the chain of observations the interpretation rests on: the shells are from species that do not occur naturally inland, they are far from any shore, they are perforated, and sediment stuck to one of them matches the layer holding ten human fossils dated to 100,000–135,000 years.",
  },
  {
    key: "sehasseh2021",
    title: "Early Middle Stone Age personal ornaments from Bizmoune Cave, Essaouira, Morocco",
    author: "El Mehdi Sehasseh and colleagues",
    publisher: "American Association for the Advancement of Science",
    workTitle: "Science Advances",
    reference: "Science Advances 7(39). DOI 10.1126/sciadv.abi8620",
    url: "https://www.science.org/doi/10.1126/sciadv.abi8620",
    sourceType: "academic_paper",
    publishedYear: 2021,
    publishedDisplay: "2021",
    notes:
      "Thirty-three perforated Tritia gibbosula shells from Bizmoune Cave in southwest Morocco, many from deposits dated to 142,000 years or more — the oldest shell beads yet recovered. Cited for the finds and their age, which put the practice well before the Levantine examples.",
  },
  {
    key: "baryosefmayer2009",
    title: "Shells and ochre in Middle Paleolithic Qafzeh Cave, Israel: indications for modern behavior",
    author: "Daniella E. Bar-Yosef Mayer, Bernard Vandermeersch and Ofer Bar-Yosef",
    publisher: "Elsevier",
    workTitle: "Journal of Human Evolution",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0047248408002340",
    sourceType: "academic_paper",
    publishedYear: 2009,
    publishedDisplay: "2009",
    notes:
      "The marine shells from Qafzeh, brought inland from the Mediterranean, some carrying ochre traces. Cited for a distinction this dataset needs: shells that were collected and carried are not the same find as shells that were pierced and strung, and Qafzeh's are mostly the former.",
  },
  {
    key: "derrico2009",
    title: "Additional evidence on the use of personal ornaments in the Middle Paleolithic of North Africa",
    author: "Francesco d'Errico and colleagues",
    publisher: "National Academy of Sciences",
    workTitle: "Proceedings of the National Academy of Sciences",
    reference: "DOI 10.1073/pnas.0903532106",
    url: "https://www.pnas.org/doi/10.1073/pnas.0903532106",
    sourceType: "academic_paper",
    publishedYear: 2009,
    publishedDisplay: "2009",
    notes:
      "Further North African shell ornaments, cited for the breadth of the practice across the region rather than for a single site's date.",
  },
  {
    key: "valladas1987",
    title: "Thermoluminescence dates for the Neanderthal burial site at Kebara in Israel",
    author: "Hélène Valladas and colleagues",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature 330, 159–160",
    url: "https://www.nature.com/articles/330159a0",
    sourceType: "academic_paper",
    publishedYear: 1987,
    publishedDisplay: "1987",
    notes:
      "Thermoluminescence dates from Kebara, a Levantine cave with a Neanderthal burial. Cited as evidence that Neanderthals and early Homo sapiens were both in this small region across the same stretch of the Middle Palaeolithic — the finding that made the Levant the place this argument is had.",
  },
  {
    key: "wikipedia_sq",
    title: "Skhul and Qafzeh hominins — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Skhul_and_Qafzeh_hominins",
    sourceType: "wikipedia",
    publishedDisplay: "continuously edited",
    notes:
      "A tertiary source, included as the accessible entry point most readers will actually use — and labelled as one. Its reference list is the useful part.",
  },
];

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export const EARLY_SAPIENS_EVENTS: SeedEvent[] = [
  // 1 -----------------------------------------------------------------------
  {
    slug: "qafzeh-early-homo-sapiens",
    title: "Early Homo sapiens at Qafzeh Cave",
    summary: "Anatomically modern people in the Levant — and two dating methods that do not agree.",
    description:
      "Qafzeh Cave, near Nazareth in northern Israel, has produced the remains of more than twenty individuals who are anatomically modern Homo sapiens, found with Middle Palaeolithic (Mousterian) stone tools.\n\n" +
      "WHY THE SITE MATTERS. These people were outside Africa long before the expansion that populated the rest of the world, and they were in a region where Neanderthals also lived. Whichever way the dating falls, Qafzeh shows that the movement of Homo sapiens out of Africa was not one event with one date, and that early populations reached the Levant and did not necessarily continue.\n\n" +
      "THE TOOLS ARE NOT DISTINCTIVE, and that is itself a result. The Mousterian assemblages here are broadly similar to those made by Neanderthals elsewhere in the region: the same technology in the hands of a different population. Anyone expecting toolkits to sort neatly by species does not get that from the Levant.\n\n" +
      "THE DATING IS CONTESTED, and the two claims below are not different guesses at one measurement — they come from dating different materials by different physics. That is the most common reason archaeological dates disagree, and it is worth seeing once, clearly.",
    category: "archaeology",
    subcategory: "Middle Palaeolithic",
    eventType: "archaeological_interpretation",
    eventTypeNote: "The fossils are not in question. Their age is dated two ways, and the two do not agree.",
    tags: ["qafzeh", "homo-sapiens", "levant", "middle-palaeolithic", "deep-time"],
    people: ["Homo sapiens"],
    locationName: "Qafzeh Cave, near Nazareth, Israel",
    lat: 32.6975,
    lng: 35.3092,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Qafzeh_9-Homo_sapiens.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Qafzeh_9-Homo_sapiens.jpg?width=1024",
        shows: "artefact",
        caption:
          "Qafzeh 9, one of the early Homo sapiens individuals from Qafzeh Cave in Israel. The dating is " +
          "thermoluminescence and electron spin resonance rather than radiocarbon, which does not reach this " +
          "far back \u2014 and the range those methods give is wide.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "valladas1988",
        citations: [
          { sourceKey: "grun2005", relation: "disputes", note: "Direct dating of the fossils themselves gives an older range, 100,000–130,000 years." },
          { sourceKey: "hovers2003", relation: "context", note: "Works from the ~92,000-year horizon in its analysis of the site's ochre." },
          { sourceKey: "wikipedia_sq", relation: "context", note: "An accessible summary of the Skhul and Qafzeh fossils." },
        ],
        startYear: ka(92),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 92,000 years ago (thermoluminescence on burnt flints)",
        datingMethod: "Thermoluminescence on burnt flint from the hominin-bearing layers",
        chronology: "conventional",
        evidence:
          "EVIDENCE: twenty burnt flints from the layers containing the human remains. Thermoluminescence dates the last time a flint was heated — so what is being dated is a fire somebody lit, in the same deposit as the fossils. That is an unusually direct link between a date and human activity.\n\nThe figure is widely used as the site's working age, and later work on the Qafzeh ochre is framed around it.",
        notes:
          "WHAT IT DATES: the burning of flints in those layers. Not the bones, and not the moment anybody died. The inference from one to the other is the association of the flints with the fossils in the same deposit — good, and still an inference.",
      },
      {
        sourceKey: "grun2005",
        citations: [
          { sourceKey: "valladas1988", relation: "disputes", note: "Thermoluminescence on burnt flint gives a younger age, around 92,000 years." },
          { sourceKey: "vanhaeren2006", relation: "supports", note: "Uses the same 100,000–135,000 year range for the Skhul layer that produced a shell bead." },
        ],
        startYear: ka(130),
        endYear: ka(100),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 130,000–100,000 years ago (uranium-series and ESR on teeth and bone)",
        datingMethod: "Uranium-series and electron spin resonance on human and faunal teeth and bone",
        chronology: "scientific",
        evidence:
          "EVIDENCE: the fossils themselves, and associated teeth and bone, dated by uranium-series and electron spin resonance. On this analysis the Skhul, Qafzeh and Tabun burials all fall in the range 100,000–130,000 years — appreciably older than the thermoluminescence result.",
        notes:
          "WHY THE TWO DIFFER, which is the useful part: they date different materials. Thermoluminescence dates a heated flint; ESR and uranium-series date teeth and bone, and depend on modelling how uranium moved into them after burial — an assumption that can shift a result by tens of thousands of years. Neither is a mistake. They are measurements of different things, reported as such.",
      },
    ],
  },

  // 2 -----------------------------------------------------------------------
  {
    slug: "middle-palaeolithic-ochre-use",
    title: "Ochre, and what it is taken to mean",
    summary: "Ochre was collected, heated and ground. Whether that is symbolism is the argument.",
    description:
      "Ochre — iron-rich earth that yields red and yellow pigment — turns up repeatedly in Middle Palaeolithic and Middle Stone Age sites, and it is one of the most argued-over materials in archaeology.\n\n" +
      "WHAT IS FOUND: lumps of ochre, some carried a long way from their geological source; pieces with ground or scraped facets; ochre stains on other objects; and, at Blombos Cave in South Africa, a whole processing kit — grindstones, hammerstones, bone, charcoal, and two abalone shells holding the remains of an ochre-rich mixture.\n\n" +
      "WHAT IT IS TAKEN TO MEAN, and here the readings diverge:\n\n" +
      "· PIGMENT — for marking bodies, objects or surfaces.\n" +
      "· PRACTICAL USE — ochre works as a hide-preservative, an adhesive loader, an insect repellent and a sunscreen, and all of these have been argued for.\n" +
      "· SYMBOLIC BEHAVIOUR — that colour was being used to mean something.\n\n" +
      "THE STRONGEST ARGUMENT FOR THE THIRD is not that ochre exists but that particular ochres were chosen: the Qafzeh study analysed the material geochemically to test whether it had been selected and brought in for its colour. That is a real argument from evidence. It is still an argument, and the paper presents it as one.\n\n" +
      "NOTHING HERE ESTABLISHES SYMBOLISM BY ITSELF. A lump of red earth in a cave proves that somebody carried a lump of red earth into a cave.",
    category: "archaeology",
    subcategory: "Middle Palaeolithic",
    eventType: "archaeological_interpretation",
    eventTypeNote: "Evidence and interpretation are separated deliberately: the finds are firm, the meaning is argued.",
    tags: ["ochre", "pigment", "symbolic-behaviour", "blombos", "qafzeh", "deep-time"],
    locationName: "The Levant and southern Africa",
    claims: [
      {
        sourceKey: "henshilwood2011",
        citations: [
          { sourceKey: "hovers2003", relation: "supports", note: "Ochre selected and processed at a Levantine site of roughly the same period." },
        ],
        startYear: ka(100),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 100,000 years ago (the Blombos ochre workshop)",
        datingMethod: "Archaeological context — dated deposits containing the processing kit",
        chronology: "conventional",
        evidence:
          "EVIDENCE: two abalone shells containing the residue of an ochre-rich mixture, with the grindstones, hammerstones, bone and charcoal used to make it, in a dated deposit at Blombos Cave.\n\nThis is evidence of a PROCESS, not just a material: something was made, to a method, and stored. That is a stronger observation than the presence of ochre, because a sequence of steps is harder to account for accidentally.",
        notes:
          "INTERPRETATION, kept separate: what the mixture was FOR is not established by the kit that made it. Body decoration, hide treatment and adhesive have all been proposed. The finding is the recipe, not the purpose.",
      },
      {
        sourceKey: "hovers2003",
        citations: [
          { sourceKey: "valladas1988", relation: "supports", note: "The thermoluminescence dating that puts the Qafzeh horizon at around 92,000 years." },
          { sourceKey: "baryosefmayer2009", relation: "supports", note: "Marine shells at the same site, some carrying ochre traces." },
        ],
        startYear: ka(92),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 92,000 years ago (ochre at Qafzeh, selected by colour)",
        datingMethod: "Archaeological context, with geochemical and petrographic analysis of the ochre itself",
        chronology: "archaeological",
        evidence:
          "EVIDENCE: ochre from the Qafzeh terrace, analysed geochemically and petrographically to establish where it came from and whether the pieces were chosen for their colour rather than picked up where they lay.",
        notes:
          "INTERPRETATION: the paper argues from that selection to colour symbolism — that people were choosing a material for how it looked, which implies a shared meaning attached to the appearance. It is a serious argument advanced by specialists. It is an argument, the title of the paper says so, and it is recorded here as one rather than as the finding.",
      },
    ],
  },

  // 3 -----------------------------------------------------------------------
  {
    slug: "early-shell-beads-and-ornaments",
    title: "Early shell beads and personal ornaments",
    summary: "Sea shells, perforated, a long way inland — and the ladder of inference from that to jewellery.",
    description:
      "Small marine shells, often of a single species and often pierced, are found at Middle Palaeolithic and Middle Stone Age sites across North Africa, southern Africa and the Levant, sometimes tens or hundreds of kilometres from the nearest sea.\n\n" +
      "WHY ARCHAEOLOGISTS READ THEM AS ORNAMENTS — as a chain, each link of which can be examined:\n\n" +
      "1. THE SHELLS ARE PRESENT where they do not naturally occur. Marine species inland do not walk there.\n" +
      "2. THEY ARE A NARROW SELECTION. One or two small species, out of the many on any beach — so somebody was choosing.\n" +
      "3. THEY ARE PERFORATED, and the holes can be compared with those made by predatory molluscs and by natural abrasion.\n" +
      "4. THEY SHOW WEAR at the perforation and where shells would rub together, consistent with having been strung.\n" +
      "5. SOME CARRY PIGMENT, which is not how a shell arrives from a beach.\n\n" +
      "Each link is an observation. The conclusion — that these were beads, worn on the body — rests on all of them together, and is much stronger than any one of them alone.\n\n" +
      "THE STEP BEYOND IS DIFFERENT IN KIND. From 'these were worn' to 'these communicated something — status, identity, membership' is an inference about minds, and it cannot be dug up. It is reasonable; it is not observed; and this dataset keeps the two apart.\n\n" +
      "NOT EVERY SHELL IS A BEAD, and the same region proves it: at Qafzeh, marine shells were carried inland and some bear ochre traces, but most are not perforated. Collected and carried is a real finding. It is not the same finding as pierced and strung.",
    category: "archaeology",
    subcategory: "Middle Palaeolithic",
    eventType: "archaeological_interpretation",
    eventTypeNote: "A chain of observations, each checkable, supporting an interpretation that is not itself an observation.",
    tags: ["shell-beads", "ornaments", "symbolic-behaviour", "skhul", "bizmoune", "deep-time"],
    locationName: "North Africa, southern Africa and the Levant",
    claims: [
      {
        sourceKey: "vanhaeren2006",
        citations: [
          { sourceKey: "grun2005", relation: "supports", note: "The dating of the Skhul layer the bead's adhering sediment was matched to." },
          { sourceKey: "derrico2009", relation: "supports", note: "Further North African ornaments from the same broad period." },
          { sourceKey: "sehasseh2021", relation: "context", note: "Older examples again, from Morocco." },
        ],
        startYear: ka(135),
        endYear: ka(100),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 135,000–100,000 years ago (Skhul and Oued Djebbana)",
        datingMethod: "Sediment matching to a dated layer, with uranium-series and ESR dating of that layer",
        chronology: "conventional",
        evidence:
          "EVIDENCE: perforated marine gastropods at Skhul in Israel and Oued Djebbana in Algeria, both well inland. Sediment still adhering to one Nassarius shell from Skhul was analysed and matched to the layer that held ten human fossils, dated to 100,000–135,000 years.\n\nThat sediment analysis is the load-bearing part: it ties a loose shell in an old museum collection to a specific dated deposit, which is otherwise very hard to do.",
        notes:
          "INTERPRETATION: deliberate selection and transport, and use as ornaments. The transport is close to an observation — the sea is a long way off. Ornament is an inference from perforation, species selection and wear.",
      },
      {
        sourceKey: "sehasseh2021",
        citations: [
          { sourceKey: "vanhaeren2006", relation: "context", note: "The Levantine and Algerian examples this pushes back before." },
        ],
        startYear: ka(150),
        endYear: ka(142),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "142,000 years ago or more (Bizmoune Cave, Morocco)",
        datingMethod: "Uranium-series dating of the deposits containing the shells",
        chronology: "scientific",
        evidence:
          "EVIDENCE: thirty-three perforated Tritia gibbosula shells from Bizmoune Cave in southwest Morocco, many from deposits dated to at least 142,000 years — the oldest shell beads yet recovered.",
        notes:
          "Placed at its own date, well before the rest of this entry, because that is where the evidence puts it. The practice is older than the Levantine examples and older than the period this dataset is otherwise about.",
      },
      {
        sourceKey: "baryosefmayer2009",
        citations: [
          { sourceKey: "hovers2003", relation: "supports", note: "The ochre at the same site, from the same analytical programme." },
          { sourceKey: "vanhaeren2006", relation: "disputes", note: "Shells from the same region read as finished ornaments — the comparison that shows why 'collected' and 'strung' are different claims." },
        ],
        startYear: ka(92),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 92,000 years ago (shells carried inland to Qafzeh)",
        datingMethod: "Archaeological context in layers dated by thermoluminescence",
        chronology: "archaeological",
        evidence:
          "EVIDENCE: marine shells at Qafzeh, brought from the Mediterranean coast, some carrying traces of ochre. MOST ARE NOT PERFORATED.",
        notes:
          "Included precisely because it is the weaker case, and knowing why it is weaker is the whole skill: collection and transport are established, modification mostly is not. An entry that showed only the strongest sites would teach a reader that the evidence is uniform. It is not.",
      },
    ],
  },

  // 4 -----------------------------------------------------------------------
  {
    slug: "neanderthals-across-eurasia",
    title: "Neanderthal populations across Eurasia",
    summary: "Long established by 100,000 years ago — and sharing one small region with early Homo sapiens.",
    description:
      "Around a hundred thousand years ago, Neanderthal populations were living across Europe and western Asia, from Iberia to Siberia. THEY DID NOT APPEAR AT THAT MOMENT: the lineage is far older, with populations on the Neanderthal path in Europe by 430,000 years ago, and this entry is a snapshot of a long occupation rather than a beginning.\n\n" +
      "WHAT THE EVIDENCE CONSISTS OF: fossils from dozens of sites; Middle Palaeolithic (Mousterian) stone industries across the whole range; and, for the last two decades, DNA — from bones, from teeth, and from cave sediments with no bones in them at all.\n\n" +
      "THE LEVANT IS WHERE THIS ENTRY EARNS ITS PLACE. In a region a few tens of kilometres across, there are caves with Neanderthals and caves with early Homo sapiens, in overlapping stretches of the Middle Palaeolithic, using broadly similar stone technology. Tabun, Kebara and Amud on one side; Qafzeh and Skhul on the other. Exactly how the occupations interleave is disputed, and depends on dates that are themselves disputed — but that two kinds of human were in the same small region across this period is not seriously doubted, and neither is interbreeding, which is written in the genomes of people alive today.",
    category: "people",
    subcategory: "Middle Palaeolithic",
    eventType: "mainstream",
    eventTypeNote: "A snapshot of a long-established population, not the moment it arrived.",
    tags: ["neanderthal", "eurasia", "levant", "mousterian", "deep-time"],
    people: ["Neanderthals"],
    locationName: "Europe and western Asia",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Homo_neanderthalensis_skull.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Homo_neanderthalensis_skull.jpg?width=1024",
        shows: "artefact",
        caption:
          "A Neanderthal skull. THEY OVERLAP WITH THE PEOPLE AT QAFZEH IN BOTH TIME AND PLACE: the Levant has " +
          "both, at different periods, in caves a few hours' walk apart \u2014 which is why this timeline holds them " +
          "as parallel populations rather than as a sequence.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "valladas1987",
        citations: [
          { sourceKey: "grun2005", relation: "supports", note: "Places Tabun, alongside Skhul and Qafzeh, in the 100,000–130,000 year range." },
          { sourceKey: "wikipedia_sq", relation: "context", note: "An accessible summary of the Levantine sites and the populations at them." },
        ],
        startYear: ka(130),
        endYear: ka(50),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "Neanderthals across Europe and western Asia, roughly 130,000–50,000 years ago",
        datingMethod: "Thermoluminescence and other physical dating at individual sites, across a large number of them",
        chronology: "conventional",
        evidence:
          "EVIDENCE: fossils and Mousterian assemblages at sites across the range, each dated separately. Kebara in the Levant — a cave with a Neanderthal burial — is one of the sites dated by thermoluminescence, which is part of how the Levantine sequence was built.\n\nThe span given here is a summary of many site dates, not a measurement of anything.",
        notes:
          "The lineage is much older than the span shown: populations on the Neanderthal path were in Europe by 430,000 years ago. This claim is about when the populations in question were spread across Eurasia, not about when they began.",
      },
      {
        sourceKey: "grun2005",
        citations: [
          { sourceKey: "valladas1988", relation: "disputes", note: "A younger thermoluminescence age for the Homo sapiens layers at Qafzeh, which changes how the two occupations interleave." },
        ],
        startYear: ka(130),
        endYear: ka(100),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "Tabun, Skhul and Qafzeh all within about 130,000–100,000 years ago",
        datingMethod: "Uranium-series and electron spin resonance on teeth and bone",
        chronology: "scientific",
        evidence:
          "EVIDENCE: direct dating placing the Neanderthal site of Tabun in the same range as the Homo sapiens burials at Skhul and Qafzeh — the basis of the claim that both kinds of human were in this small region across the same period.",
        notes:
          "WHAT IS ESTABLISHED: both populations were in the Levant in the Middle Palaeolithic. WHAT IS NOT: whether they were there simultaneously, alternately, or in some finer pattern. That question turns on dating precision the methods do not currently have.",
      },
    ],
  },

  // 5 -----------------------------------------------------------------------
  {
    slug: "qafzeh-and-skhul-burials",
    title: "The burials at Qafzeh and Skhul",
    summary: "A body in a pit is an observation. A funeral is an interpretation. This entry keeps them apart.",
    description:
      "Qafzeh and Skhul have produced some of the earliest human remains widely accepted as deliberate burials. They are two different caves, dated separately, and are not merged here into a single figure.\n\n" +
      "THE THREE LEVELS THIS ENTRY SEPARATES, and the separation is the point:\n\n" +
      "1. OBSERVATION — articulated skeletons in pits cut into the cave floor, in positions that do not occur when a body is left where it fell and scattered by carnivores and time. At Qafzeh, one adolescent, Qafzeh 11, was found with two fallow-deer antlers in contact with the upper body and hands.\n\n" +
      "2. MAINSTREAM INTERPRETATION — that these are intentional burials. This is widely accepted, and it is an interpretation: it rests on the articulation of the skeletons, the cut pits and the body positions, and on the absence of a better explanation for all three together.\n\n" +
      "3. FURTHER INTERPRETATION — that objects found with a body were deliberately placed, and that the placement means something. The antlers with Qafzeh 11 have been argued to be a funerary offering, on the grounds that their position in contact with the hands is hard to explain as accidental incorporation. Others have been more cautious, and whether every case at these sites is a primary burial at all has been questioned.\n\n" +
      "WHAT THIS ENTRY WILL NOT SAY is 'humans practised burial rituals 100,000 years ago'. What was found is a body in a pit with two antlers on its chest. The sentence and the finding are not the same size, and the distance between them is exactly what a reader should be able to see.",
    category: "archaeology",
    subcategory: "Middle Palaeolithic",
    eventType: "archaeological_interpretation",
    eventTypeNote:
      "Observation, mainstream interpretation and further interpretation, as three separate statements about the same find.",
    tags: ["burial", "qafzeh", "skhul", "symbolic-behaviour", "middle-palaeolithic", "deep-time"],
    people: ["Homo sapiens"],
    locationName: "Qafzeh and Es Skhul, Israel",
    lat: 32.6714,
    lng: 34.9656,
    claims: [
      {
        sourceKey: "valladas1988",
        citations: [
          { sourceKey: "grun2005", relation: "disputes", note: "Gives an older range for the same site, from direct dating of teeth and bone." },
          { sourceKey: "wikipedia_sq", relation: "context", note: "An accessible account of the Skhul and Qafzeh remains." },
        ],
        startYear: ka(92),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "the Qafzeh burials, about 92,000 years ago",
        datingMethod: "Thermoluminescence on burnt flint from the hominin-bearing layers",
        chronology: "conventional",
        evidence:
          "OBSERVATION: articulated human skeletons in pits cut into the floor of Qafzeh Cave, in the layers dated by thermoluminescence on burnt flint.\n\nINTERPRETATION: that they were deliberately buried. Mainstream, and resting on the articulation, the cut pits and the body positions taken together.",
      },
      {
        sourceKey: "grun2005",
        citations: [
          { sourceKey: "vanhaeren2006", relation: "supports", note: "Ties a perforated shell to the same dated Skhul layer that held ten human fossils." },
        ],
        startYear: ka(135),
        endYear: ka(100),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "the Skhul burials, about 135,000–100,000 years ago",
        datingMethod: "Uranium-series and electron spin resonance on the human remains and associated material",
        chronology: "scientific",
        evidence:
          "OBSERVATION: human remains at Es Skhul, on Mount Carmel, dated directly by uranium-series and ESR rather than through associated material.\n\nKept as a separate claim from Qafzeh, at a separate date, because they are separate sites. Merging them into one figure because both are early Homo sapiens burials would invent a number that describes neither.",
      },
      {
        sourceKey: "wikipedia_sq",
        citations: [
          { sourceKey: "valladas1988", relation: "supports", note: "The dating of the layers in which Qafzeh 11 was found." },
          { sourceKey: "hovers2003", relation: "context", note: "The site's ochre, part of the same argument about symbolic behaviour at Qafzeh." },
        ],
        startYear: ka(92),
        datePrecision: "thousand_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "Qafzeh 11 — an adolescent, with deer antlers on the chest",
        datingMethod: "Archaeological context — the same dated layers as the other Qafzeh burials",
        chronology: "archaeological",
        evidence:
          "OBSERVATION: an adolescent of about twelve or thirteen, buried in a pit, with two fallow-deer antlers lying across the upper chest and in contact with the hand bones.\n\nThat is the find. It is unusually well recorded, and the position of the antlers relative to the hands is the detail everything else turns on.",
        notes:
          "INTERPRETATION, and it is contested: the excavator's reading is that antlers in contact with the hands are a funerary offering rather than material that happened to end up in the grave fill. Others are more cautious, and whether every burial at these sites is a primary burial has been questioned.\n\nTHE SOURCE HERE IS A TERTIARY ONE, and is marked as such: this claim is cited to an encyclopedia entry because the excavation report itself could not be verified from here, and citing a publication nobody has checked would be worse than citing an honest summary. The find is well attested; the reference is the weakest in this dataset, and a reader should know that.",
      },
    ],
  },
];
