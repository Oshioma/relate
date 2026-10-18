// PREHISTORIC NORTH AFRICA — the opening section of the "Origins of the Moors" track.
//
// From the first tools on the Mediterranean fringe of Africa to the Neolithic
// and the first measurable crossings of the Strait of Gibraltar. Nobody in
// this section was a Moor, a Maurus or (for most of it) anything a later
// writer had a name for: these are populations of North Africa, described by
// what they left — fossils, tools, beads, burials, genomes, paintings — and
// the records say so in their own voice.
//
// FOUR THINGS ARE KEPT APART THROUGHOUT, because ancient DNA makes it very easy
// to run them together:
//   ANCESTRY  — what a genome says about whom a person descended from;
//   CULTURE   — an archaeological industry or way of life (Aterian,
//               Iberomaurusian, Cardial, Pastoral), named by archaeologists;
//   LANGUAGE  — which leaves no trace at all before writing;
//   IDENTITY  — what people called themselves, which is unrecoverable here.
// A genome is not a culture, a pottery style is not a people, and neither is
// a language.
//
// DATES. Deep-time figures are written as the sources give them, in years
// before present (1950), via ka(). A "BCE" figure in the user's research brief
// that came from a "years ago" figure is corrected and the correction is
// stated in the record. Research for this file was done through literature
// search (publisher pages could not be opened directly in this session), so
// nothing below is quoted: every statement about a paper is a paraphrase of
// its abstract or of its published summary, and DOIs are those listed in the
// paper's indexed records.

import type { SeedEvent, SeedSource, SeedEventLink } from "../seed-types";
import { MOORS_LANES, bce, ka, commonsPicture, laneTags } from "./shared";
import type { MoorsSection } from "./shared";

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // --- before Homo sapiens -------------------------------------------------
  {
    key: "pre_sahnouni2018",
    title: "1.9-million- and 2.4-million-year-old artifacts and stone tool–cutmarked bones from Ain Boucherit, Algeria",
    author: "Mohamed Sahnouni and colleagues",
    publisher: "American Association for the Advancement of Science",
    workTitle: "Science",
    reference: "Science 362(6420), 1297–1301. DOI 10.1126/science.aau0008",
    url: "https://doi.org/10.1126/science.aau0008",
    sourceType: "academic_paper",
    publishedYear: 2018,
    publishedDisplay: "2018",
    notes:
      "Cited for the oldest archaeological evidence in North Africa: Oldowan-type stone tools and cut-marked animal bones at Ain Boucherit in Algeria's High Plateaus, in two deposits dated to about 2.4 and 1.9 million years ago. Cited ALSO for what it does not contain — no hominin fossils — so the toolmakers' species is unknown.",
  },
  {
    key: "pre_gallotti2021",
    title: "First high resolution chronostratigraphy for the early North African Acheulean at Casablanca (Morocco)",
    author: "Rosalia Gallotti and colleagues",
    publisher: "Nature Publishing Group",
    workTitle: "Scientific Reports",
    reference: "Scientific Reports 11, 15340. DOI 10.1038/s41598-021-94695-3",
    url: "https://doi.org/10.1038/s41598-021-94695-3",
    sourceType: "academic_paper",
    publishedYear: 2021,
    publishedDisplay: "2021",
    notes:
      "Cited for the magnetostratigraphic dating of Unit L at Thomas Quarry I (Casablanca), which places the Acheulean (handaxe) industry in north-west Africa at least as early as about 1.3 million years ago, and for the earlier view that it and Tighennif (Algeria) were about 1 million years old.",
  },
  {
    key: "pre_hublin2026",
    title: "Early hominins from Morocco basal to the Homo sapiens lineage",
    author: "Jean-Jacques Hublin, David Lefèvre, Giovanni Muttoni, Abderrahim Mohib, Jean-Paul Raynal and colleagues",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature (2026), published online 7 January 2026. DOI 10.1038/s41586-025-09914-y",
    url: "https://doi.org/10.1038/s41586-025-09914-y",
    sourceType: "academic_paper",
    publishedYear: 2026,
    publishedDisplay: "January 2026",
    notes:
      "Cited for the hominin fossils (mandibles of two adults and a child, teeth, vertebrae, a femur) from the Grotte à Hominidés at Thomas Quarry I, dated by magnetostratigraphy to the Matuyama–Brunhes reversal, about 773,000 years ago, and for the authors' interpretation of them as a population near the root of the Homo sapiens lineage. The interpretation is the authors' and is new; the dating supersedes older, younger ESR/U-series estimates.",
  },
  {
    key: "pre_mpg_thomas_quarry_2026",
    title: "Early hominins from Morocco reveal an African lineage near the root of Homo sapiens (press release)",
    author: "Max Planck Institute for Evolutionary Anthropology",
    publisher: "Max-Planck-Gesellschaft",
    reference: "Press release, 7 January 2026",
    url: "https://www.mpg.de/25951868/0105-evan-early-hominins-from-thomas-quarry-i-morocco-150495-x",
    sourceType: "website",
    publishedYear: 2026,
    publishedDisplay: "7 January 2026",
    notes:
      "The institute's own summary of the Thomas Quarry I hominin paper, cited for the plain-language account of the find and its dating, and for the point that Africa has very few hominin fossils between about one million and 500,000 years ago.",
  },

  // --- Jebel Irhoud ---------------------------------------------------------
  {
    key: "pre_richter2017",
    title: "The age of the hominin fossils from Jebel Irhoud, Morocco, and the origins of the Middle Stone Age",
    author: "Daniel Richter and colleagues, with Jean-Jacques Hublin and Shannon P. McPherron",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature 546(7657), 293–296. DOI 10.1038/nature22335",
    url: "https://doi.org/10.1038/nature22335",
    sourceType: "scientific_study",
    publishedYear: 2017,
    publishedDisplay: "8 June 2017",
    notes:
      "The dating paper. Cited for the thermoluminescence ages of fire-heated flints from the new excavations, whose weighted average places the Middle Stone Age artefacts and the hominin fossils at 315 ± 34 thousand years ago; for the recalculated U-series/ESR age of 286 ± 32 thousand years for a tooth of the Irhoud 3 mandible; and for the observation that these ages roughly double earlier estimates.",
  },
  {
    key: "pre_hublin2017",
    title: "New fossils from Jebel Irhoud, Morocco and the pan-African origin of Homo sapiens",
    author: "Jean-Jacques Hublin, Abdelouahed Ben-Ncer and colleagues",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature 546(7657), 289–292. DOI 10.1038/nature22336",
    url: "https://doi.org/10.1038/nature22336",
    sourceType: "academic_paper",
    publishedYear: 2017,
    publishedDisplay: "8 June 2017",
    notes:
      "The anatomy paper. Cited for the new fossils from the 2004-onward excavations (raising the site's Homo sapiens specimens from six to twenty-two), for the description of a modern face and mandible combined with a more archaic, elongated braincase, and for the argument that Homo sapiens emerged across Africa rather than in one region.",
  },
  {
    key: "pre_smith2007",
    title: "Earliest evidence of modern human life history in North African early Homo sapiens",
    author: "Tanya M. Smith and colleagues, with Jean-Jacques Hublin",
    publisher: "National Academy of Sciences",
    workTitle: "Proceedings of the National Academy of Sciences",
    reference: "PNAS 104(15), 6128–6133. DOI 10.1073/pnas.0700747104",
    url: "https://doi.org/10.1073/pnas.0700747104",
    sourceType: "academic_paper",
    publishedYear: 2007,
    publishedDisplay: "2007",
    notes:
      "Cited for the synchrotron study of the Irhoud 3 juvenile's teeth, showing a modern-human pattern of dental development, and for the age of about 160,000 years then used for the specimen — the estimate the 2017 dating superseded.",
  },
  {
    key: "pre_mpg_irhoud_2017",
    title: "The first of our kind: scientists discover the oldest Homo sapiens fossils at Jebel Irhoud, Morocco",
    author: "Max Planck Institute for Evolutionary Anthropology",
    publisher: "Max Planck Institute for Evolutionary Anthropology, Leipzig",
    reference: "Press page and press kit, June 2017",
    url: "https://www.eva.mpg.de/homo-sapiens.html",
    sourceType: "website",
    publishedYear: 2017,
    publishedDisplay: "June 2017",
    notes:
      "The excavating institute's public account, cited for the plain-language statement that the Irhoud face falls within the range of people living today while the braincase is archaic in shape, and as the source of the excavation photographs and stone-tool pictures used here.",
  },
  {
    key: "pre_wiki_irhoud",
    title: "Jebel Irhoud — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Jebel_Irhoud",
    sourceType: "wikipedia",
    publishedDisplay: "continuously edited",
    notes:
      "A tertiary source, labelled as one, cited only for the discovery history: the 1961 find of a skull by barite miners, its passage to the University of Rabat and the expedition under Émile Ennouchi, and the original classification of the remains as a North African Neanderthal.",
  },

  // --- symbolic behaviour --------------------------------------------------
  {
    key: "pre_sehasseh2021",
    title: "Early Middle Stone Age personal ornaments from Bizmoune Cave, Essaouira, Morocco",
    author: "El Mehdi Sehasseh and colleagues",
    publisher: "American Association for the Advancement of Science",
    workTitle: "Science Advances",
    reference: "Science Advances 7(39), eabi8620. DOI 10.1126/sciadv.abi8620",
    url: "https://doi.org/10.1126/sciadv.abi8620",
    sourceType: "academic_paper",
    publishedYear: 2021,
    publishedDisplay: "2021",
    notes:
      "Cited for thirty-three perforated Tritia gibbosula shells from Bizmoune Cave in south-west Morocco, many from deposits dated to at least 142,000 years ago — the oldest shell beads yet reported — and for the review it contains of other North African bead sites (Contrebandiers, Ifri n'Ammar, Taforalt).",
  },
  {
    key: "pre_bouzouggar2007",
    title: "82,000-year-old shell beads from North Africa and implications for the origins of modern human behavior",
    author: "Abdeljalil Bouzouggar, Nick Barton and colleagues",
    publisher: "National Academy of Sciences",
    workTitle: "Proceedings of the National Academy of Sciences",
    reference: "PNAS 104(24), 9964–9969. DOI 10.1073/pnas.0703877104",
    url: "https://doi.org/10.1073/pnas.0703877104",
    sourceType: "academic_paper",
    publishedYear: 2007,
    publishedDisplay: "2007",
    notes:
      "Cited for perforated Nassarius gibbosulus shells from the Grotte des Pigeons at Taforalt, from levels dated by luminescence and uranium-series to about 82,000 years ago, some with wear suggesting suspension and some coated in red ochre.",
  },
  {
    key: "pre_derrico2009",
    title: "Additional evidence on the use of personal ornaments in the Middle Paleolithic of North Africa",
    author: "Francesco d'Errico and colleagues",
    publisher: "National Academy of Sciences",
    workTitle: "Proceedings of the National Academy of Sciences",
    reference: "PNAS (2009). DOI 10.1073/pnas.0903532106",
    url: "https://doi.org/10.1073/pnas.0903532106",
    sourceType: "academic_paper",
    publishedYear: 2009,
    publishedDisplay: "2009",
    notes:
      "Cited for the spread of perforated Nassarius shell ornaments across several Moroccan Middle Stone Age (largely Aterian) sites, showing that Taforalt was not an isolated case.",
  },
  {
    key: "pre_hallett2021",
    title: "A worked bone assemblage from 120,000–90,000 year old deposits at Contrebandiers Cave, Atlantic Coast, Morocco",
    author: "Emily Y. Hallett, Curtis W. Marean and colleagues",
    publisher: "Cell Press",
    workTitle: "iScience",
    reference: "iScience 24(9), 102988. DOI 10.1016/j.isci.2021.102988",
    url: "https://doi.org/10.1016/j.isci.2021.102988",
    sourceType: "academic_paper",
    publishedYear: 2021,
    publishedDisplay: "2021",
    notes:
      "Cited for more than sixty shaped bone tools from Contrebandiers Cave dated 120,000–90,000 years ago, interpreted by the authors as tools for leather and fur working, with carnivore bones that may have been skinned. The 'earliest clothing' reading is the authors' interpretation, not a find of clothing.",
  },
  {
    key: "pre_bouzouggar2018",
    title: "90,000 year-old specialised bone technology in the Aterian Middle Stone Age of North Africa",
    author: "Abdeljalil Bouzouggar, Louise T. Humphrey, Nick Barton, Simon A. Parfitt, Laine Clark Balzan, Jean-Luc Schwenninger and colleagues",
    publisher: "Public Library of Science",
    workTitle: "PLOS ONE",
    reference: "PLOS ONE 13(10), e0202021. DOI 10.1371/journal.pone.0202021",
    url: "https://doi.org/10.1371/journal.pone.0202021",
    sourceType: "academic_paper",
    publishedYear: 2018,
    publishedDisplay: "2018",
    notes:
      "Cited for a shaped bone knife from Aterian levels at Dar es-Soltan 1 on Morocco's Atlantic coast, in a layer dated to about 90,000 years ago, which the authors read (with finds from El Mnasra) as a bone technology particular to the Aterian. Also the source of two open-access figures used as pictures here.",
  },

  // --- Aterian ---------------------------------------------------------------
  {
    key: "pre_richter2010",
    title: "New chronometric data from Ifri n'Ammar (Morocco) and the chronostratigraphy of the Middle Palaeolithic in the Western Maghreb",
    author: "Daniel Richter, Johannes Moser, Mustapha Nami, Josef Eiwanger and Abdeslam Mikdad",
    publisher: "Elsevier",
    workTitle: "Journal of Human Evolution",
    reference: "Journal of Human Evolution 59(6), 672–679 (2010)",
    url: "https://crc806db.uni-koeln.de/site/show/49",
    sourceType: "scientific_study",
    publishedYear: 2010,
    publishedDisplay: "2010",
    notes:
      "Cited for the thermoluminescence dates on heated artefacts at Ifri n'Ammar: the tanged-tool layer 'Upper OI' at 145 ± 9 thousand years, the underlying non-tanged Middle Palaeolithic 'Lower OI' at 171 ± 12 thousand years, and later layers at about 130 and 83 thousand years — and for the authors' conclusion that, because tanged and untanged layers alternate, the Aterian cannot be used as a chronological unit. URL is the Cologne CRC 806 site record that summarises the paper; the journal DOI was not confirmed.",
  },
  {
    key: "pre_scerri2013",
    title: "The Aterian and its place in the North African Middle Stone Age",
    author: "Eleanor M. L. Scerri",
    publisher: "Elsevier",
    workTitle: "Quaternary International",
    reference: "Quaternary International 300, 111–130 (2013), special issue 'The Middle Palaeolithic in the Desert'",
    url: "https://eprints.soton.ac.uk/367294",
    sourceType: "academic_paper",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for the critique of the Aterian as a single coherent culture: quantitative comparison of assemblages finds that technological convergence and isolation by distance explain much of the variation, so tanged pieces are not by themselves a marker of one people. URL is the Southampton record of the doctoral thesis of the same title on which the paper is based; the journal DOI was not confirmed.",
  },
  {
    key: "pre_dibble2013",
    title: "On the industrial attributions of the Aterian and Mousterian of the Maghreb",
    author: "Harold L. Dibble and colleagues",
    publisher: "Elsevier",
    workTitle: "Journal of Human Evolution",
    reference: "Journal of Human Evolution (2013). DOI 10.1016/j.jhevol.2012.10.010",
    url: "https://doi.org/10.1016/j.jhevol.2012.10.010",
    sourceType: "academic_paper",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for the argument, from the Contrebandiers and other Moroccan sequences, that 'Aterian' and 'Mousterian' assemblages in the Maghreb are not cleanly separable industries, which weakens any reading of tanged tools as the signature of a distinct population.",
  },
  {
    key: "pre_scerri2018",
    title: "Did our species evolve in subdivided populations across Africa, and why does it matter?",
    author: "Eleanor M. L. Scerri and colleagues",
    publisher: "Cell Press",
    workTitle: "Trends in Ecology & Evolution",
    reference: "Trends in Ecology & Evolution 33(8), 582–594. DOI 10.1016/j.tree.2018.05.005",
    url: "https://doi.org/10.1016/j.tree.2018.05.005",
    sourceType: "academic_paper",
    publishedYear: 2018,
    publishedDisplay: "2018",
    notes:
      "Cited for the 'African multiregionalism' framework: Homo sapiens emerged from populations spread across Africa and intermittently connected (including by green Saharan corridors), with Jebel Irhoud and the North African Middle Stone Age as part of that pattern rather than a regional sideshow.",
  },
  {
    key: "pre_wiki_aterian",
    title: "Aterian — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Aterian",
    sourceType: "wikipedia",
    publishedDisplay: "continuously edited",
    notes:
      "A tertiary source, labelled as one, cited only for the commonly repeated outer bounds of the Aterian (earliest about 145,000 years ago at Ifri n'Ammar; tanged tools persisting in north-west Africa until perhaps 30,000–20,000 years ago) — the younger bound being poorly dated and contested.",
  },

  // --- Taforalt and the Iberomaurusian --------------------------------------
  {
    key: "pre_vandeloosdrecht2018",
    title: "Pleistocene North African genomes link Near Eastern and sub-Saharan African human populations",
    author: "Marieke van de Loosdrecht, Abdeljalil Bouzouggar, Louise Humphrey and colleagues, with Johannes Krause",
    publisher: "American Association for the Advancement of Science",
    workTitle: "Science",
    reference: "Science 360(6388), 548–552. DOI 10.1126/science.aar8380",
    url: "https://doi.org/10.1126/science.aar8380",
    sourceType: "scientific_study",
    publishedYear: 2018,
    publishedDisplay: "2018",
    notes:
      "Cited for genome-wide data from seven Iberomaurusian individuals buried at Taforalt, directly radiocarbon-dated to 15,100–13,900 calibrated years BP; for the finding that about two-thirds of their ancestry is shared with early Holocene Near Easterners (best represented by the Levantine Natufians) and about one-third is related to sub-Saharan Africans; and for the absence of detectable gene flow from Palaeolithic Europeans — the evidence against the Iberian link the name 'Iberomaurusian' assumes.",
  },
  {
    key: "pre_humphrey2014",
    title: "Earliest evidence for caries and exploitation of starchy plant foods in Pleistocene hunter-gatherers from Morocco",
    author: "Louise T. Humphrey and colleagues, with Abdeljalil Bouzouggar",
    publisher: "National Academy of Sciences",
    workTitle: "Proceedings of the National Academy of Sciences",
    reference: "PNAS 111(3), 954–959. DOI 10.1073/pnas.1318176111",
    url: "https://doi.org/10.1073/pnas.1318176111",
    sourceType: "academic_paper",
    publishedYear: 2014,
    publishedDisplay: "2014",
    notes:
      "Cited for the exceptionally high caries rate in the Taforalt adults (about half of adult teeth affected), for the acorns, pine nuts and other wild plants in occupation deposits dated about 15,000–13,700 cal BP, and for the authors' point that heavy tooth decay is not unique to farmers.",
  },
  {
    key: "pre_moubtahij2024",
    title: "Isotopic evidence of high reliance on plant food among Later Stone Age hunter-gatherers at Taforalt, Morocco",
    author: "Zineb Moubtahij and colleagues",
    publisher: "Nature Publishing Group",
    workTitle: "Nature Ecology & Evolution",
    reference: "Nature Ecology & Evolution (2024). DOI 10.1038/s41559-024-02382-z",
    url: "https://doi.org/10.1038/s41559-024-02382-z",
    sourceType: "scientific_study",
    publishedYear: 2024,
    publishedDisplay: "29 April 2024",
    notes:
      "Cited for zinc, strontium, carbon, nitrogen and sulphur isotope evidence that the Taforalt people of about 15,000–13,000 cal BP drew a large share of their protein from plants — while still butchering Barbary sheep and gazelle — and for the question it raises of why farming did not develop locally afterwards.",
  },
  {
    key: "pre_wiki_iberomaurusian",
    title: "Iberomaurusian — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Iberomaurusian",
    sourceType: "wikipedia",
    publishedDisplay: "continuously edited",
    notes:
      "A tertiary source, labelled as one, cited only for the history of the name: Paul Pallary coined 'Iberomaurusian' in 1909 for assemblages from La Mouillah (Algeria) in the belief that the industry extended across the Strait into Iberia — a link since rejected, though the name survives (the alternative 'Oranian' is also used).",
  },

  // --- ancient DNA ---------------------------------------------------------
  {
    key: "pre_fregel2018",
    title: "Ancient genomes from North Africa evidence prehistoric migrations to the Maghreb from both the Levant and Europe",
    author: "Rosa Fregel and colleagues, with Carlos D. Bustamante",
    publisher: "National Academy of Sciences",
    workTitle: "Proceedings of the National Academy of Sciences",
    reference: "PNAS 115(26), 6774–6779. DOI 10.1073/pnas.1800851115",
    url: "https://doi.org/10.1073/pnas.1800851115",
    sourceType: "scientific_study",
    publishedYear: 2018,
    publishedDisplay: "2018",
    notes:
      "Cited for Early Neolithic genomes from Ifri n'Amr o Moussa (about 5000 BCE), which resemble the Later Stone Age Taforalt people and point to a persistent local North African component, with some Levantine-related ancestry; and for Late Neolithic genomes from Kelif el Boroud (about 3000 BCE), roughly half of whose ancestry matches Early Neolithic southern Iberians — evidence of movement across the Strait between the two periods.",
  },
  {
    key: "pre_simoes2023",
    title: "Northwest African Neolithic initiated by migrants from Iberia and Levant",
    author: "Luciana G. Simões and colleagues",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature 618(7965), 550–556. DOI 10.1038/s41586-023-06166-6",
    url: "https://doi.org/10.1038/s41586-023-06166-6",
    sourceType: "scientific_study",
    publishedYear: 2023,
    publishedDisplay: "7 June 2023",
    notes:
      "Cited for nine genomes from the Epipalaeolithic to the Middle Neolithic Maghreb showing (1) about 8,000 years of population continuity and isolation from the Upper Palaeolithic into some Neolithic groups; (2) mostly European (Iberian) Neolithic ancestry in the earliest Neolithic individuals, read as farming introduced by migrants and then adopted by local people; (3) new Levantine-related ancestry in the Middle Neolithic, coinciding with pastoralism; and (4) the three ancestries mixing by the Late Neolithic.",
  },
  {
    key: "pre_uppsala2023",
    title: "Ancient genomes show that the farming lifestyle in northwestern Africa was ignited by oversea migrants from Iberia 7400 years ago (press release)",
    author: "Uppsala University",
    publisher: "Uppsala University",
    reference: "Press release, 7 June 2023",
    url: "https://www.uu.se/en/press/press-releases/2023/2023-06-07-ancient-genomes-show-that-the-farming-lifestyle-in-northwestern-africa-was-ignited-by-oversea-migrants-from-iberia-7400-years-ago",
    sourceType: "website",
    publishedYear: 2023,
    publishedDisplay: "7 June 2023",
    notes:
      "The authors' university's summary of Simões et al. 2023, cited only for the round figure it gives in its title for the arrival of Iberian-related farmers in north-west Africa (about 7,400 years ago).",
  },

  // --- Green Sahara --------------------------------------------------------
  {
    key: "pre_demenocal2000",
    title: "Abrupt onset and termination of the African Humid Period: rapid climate responses to gradual insolation forcing",
    author: "Peter deMenocal and colleagues",
    publisher: "Elsevier",
    workTitle: "Quaternary Science Reviews",
    reference: "Quaternary Science Reviews 19, 347–361 (2000). DOI 10.1016/S0277-3791(99)00081-5",
    url: "https://doi.org/10.1016/S0277-3791(99)00081-5",
    sourceType: "scientific_study",
    publishedYear: 2000,
    publishedDisplay: "2000",
    notes:
      "Cited for the dust record off north-west Africa (ODP Site 658) on which the classic African Humid Period of about 14,800 to 5,500 years ago rests, and for the argument that both its onset and its end were abrupt, despite gradual orbital forcing.",
  },
  {
    key: "pre_tierney2017",
    title: "Rainfall regimes of the Green Sahara",
    author: "Jessica E. Tierney, Francesco S. R. Pausata and Peter B. deMenocal",
    publisher: "American Association for the Advancement of Science",
    workTitle: "Science Advances",
    reference: "Science Advances 3(1), e1601503. DOI 10.1126/sciadv.1601503",
    url: "https://doi.org/10.1126/sciadv.1601503",
    sourceType: "scientific_study",
    publishedYear: 2017,
    publishedDisplay: "2017",
    notes:
      "Cited for the quantitative reconstruction of western Saharan rainfall from leaf-wax isotopes in marine sediments, which shows a Green Sahara from about 11,000 to 5,000 years ago with rainfall many times today's, and a mid-Holocene pause.",
  },
  {
    key: "pre_armitage2015",
    title: "West African monsoon dynamics inferred from abrupt fluctuations of Lake Mega-Chad",
    author: "Simon J. Armitage, Charlie S. Bristow and Nick A. Drake",
    publisher: "National Academy of Sciences",
    workTitle: "Proceedings of the National Academy of Sciences",
    reference: "PNAS 112(28), 8543–8548. DOI 10.1073/pnas.1417655112",
    url: "https://doi.org/10.1073/pnas.1417655112",
    sourceType: "scientific_study",
    publishedYear: 2015,
    publishedDisplay: "2015",
    notes:
      "Cited for Lake Mega-Chad: about 361,000 km² and up to 160 m deep in the early-to-mid Holocene, at highstand by about 11,500 years ago, holding it until about 5,000 years ago, then falling rapidly.",
  },
  {
    key: "pre_vanneer2020",
    title: "Aquatic fauna from the Takarkori rock shelter reveals the Holocene central Saharan climate and palaeohydrography",
    author: "Wim Van Neer and colleagues, with Savino di Lernia",
    publisher: "Public Library of Science",
    workTitle: "PLOS ONE",
    reference: "PLOS ONE 15(2), e0228588. DOI 10.1371/journal.pone.0228588",
    url: "https://doi.org/10.1371/journal.pone.0228588",
    sourceType: "scientific_study",
    publishedYear: 2020,
    publishedDisplay: "2020",
    notes:
      "Cited for fish and other aquatic animal remains at Takarkori, in what is now hyper-arid south-west Libya, as direct local evidence that the central Sahara held permanent water during the Holocene humid phase; also the source of the Takarkori site photograph used here.",
  },

  // --- rock art and pastoralists ------------------------------------------
  {
    key: "pre_dunne2012",
    title: "First dairying in green Saharan Africa in the fifth millennium BC",
    author: "Julie Dunne, Richard P. Evershed, Mélanie Salque, Lucy Cramp, Silvia Bruni, Kathleen Ryan, Stefano Biagetti and Savino di Lernia",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature 486(7403), 390–394. DOI 10.1038/nature11186",
    url: "https://doi.org/10.1038/nature11186",
    sourceType: "scientific_study",
    publishedYear: 2012,
    publishedDisplay: "2012",
    notes:
      "Cited for lipid and carbon-isotope analysis of food residues in pottery from Takarkori, showing that dairy fats were processed in vessels in the fifth millennium BC — the earliest identified dairying in Africa — and for its use of cattle rock art as corroborating, not primary, evidence.",
  },
  {
    key: "pre_dilernia2010",
    title: "The date and context of Neolithic rock art in the Sahara: engravings and ceremonial monuments from Messak Settafet (south-west Libya)",
    author: "Savino di Lernia and Marina Gallinaro",
    publisher: "Antiquity Publications / Cambridge University Press",
    workTitle: "Antiquity",
    reference: "Antiquity 84, 954–975 (2010). DOI 10.1017/S0003598X00067016",
    url: "https://www.cambridge.org/core/journals/antiquity/article/date-and-context-of-neolithic-rock-art-in-the-sahara-engravings-and-ceremonial-monuments-from-messak-settafet-southwest-libya/E2AACBF369581B99A5A287F9C53EBB84",
    sourceType: "archaeological",
    publishedYear: 2010,
    publishedDisplay: "2010",
    notes:
      "Cited for one of the few contextual datings of Saharan rock art: engraved stones with Pastoral-style cattle built into excavated ceremonial platforms where animals were sacrificed, dated to about 5430–5150 BP and possibly earlier — and for the general problem that most Saharan rock art cannot be dated directly.",
  },
  {
    key: "pre_unesco_acacus",
    title: "Rock-Art Sites of Tadrart Acacus (World Heritage List no. 287)",
    author: "UNESCO World Heritage Centre",
    publisher: "UNESCO",
    reference: "Inscribed 1985, criterion (iii)",
    url: "https://whc.unesco.org/ES/list/287",
    sourceType: "government",
    publishedYear: 1985,
    publishedDisplay: "1985 (inscription)",
    notes:
      "Cited for the official description of the Tadrart Acacus as holding thousands of paintings and engravings in very different styles adjoining Algeria's Tassili n'Ajjer, and for the very long span (from about 12,000 BCE to the first century CE) the listing assigns — a span that is itself a summary of the contested high chronology, not a measured date.",
  },
  {
    key: "pre_wiki_pastoral",
    title: "Pastoral period — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Pastoral_period",
    sourceType: "wikipedia",
    publishedDisplay: "continuously edited",
    notes:
      "A tertiary source, labelled as one, cited only for the conventional style sequence of central Saharan rock art (Bubaline / Large Wild Fauna, Round Head, Pastoral or Bovidian, Horse, Camel) and for the existence of competing 'long' and 'short' chronologies, each of which it notes is partly circular.",
  },

  // --- Neolithic Maghreb ---------------------------------------------------
  {
    key: "pre_morales2013",
    title: "The origins of agriculture in North-West Africa: macro-botanical remains from Epipalaeolithic and Early Neolithic levels of Ifri Oudadane (Morocco)",
    author: "Jacob Morales, Guillem Pérez-Jordà, Leonor Peña-Chocarro, Lydia Zapata, Mónica Ruíz-Alonso, José Antonio López-Sáez and Jörg Linstädter",
    publisher: "Elsevier",
    workTitle: "Journal of Archaeological Science",
    reference: "Journal of Archaeological Science 40(6), 2659–2669 (2013). DOI 10.1016/j.jas.2013.01.026",
    url: "https://doi.org/10.1016/j.jas.2013.01.026",
    sourceType: "archaeological",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for the domesticated barley, wheats, lentil and pea in the Early Neolithic levels of Ifri Oudadane (north-east Morocco), and for the lentil directly dated to 7611 ± 37 cal BP — the oldest direct date on a domesticated plant in Morocco and, the authors note, in Africa outside the Nile valley.",
  },
  {
    key: "pre_linstadter2013",
    title: "The Early Neolithic pottery of Ifri Oudadane (NE Morocco): qualitative and quantitative evidence",
    author: "Jörg Linstädter and Gregor Wagner",
    publisher: "Brill",
    workTitle: "Journal of African Archaeology",
    reference: "Journal of African Archaeology 11(2), 155–196 (2013)",
    url: "https://crc806db.uni-koeln.de/dataset/show/the-early-neolithic-pottery-of-ifri-oudadane-ne-morocco--qualitative-and-quantitative-evidences/",
    sourceType: "archaeological",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for the first pottery phase at Ifri Oudadane (7.6–7.3 thousand cal BP), dominated by single Cardium-shell impressions, and the main occupation phase (7.1–6.6 thousand cal BP) — i.e. pottery and crops arriving together in Mediterranean north-west Africa in the mid-sixth millennium BCE.",
  },
  {
    key: "pre_broodbank2024",
    title: "Oued Beht, Morocco: a complex early farming society in north-west Africa and its implications for western Mediterranean interaction during later prehistory",
    author: "Cyprian Broodbank, Giulio Lucarini, Youssef Bokbot and colleagues",
    publisher: "Antiquity Publications / Cambridge University Press",
    workTitle: "Antiquity",
    reference: "Antiquity (2024), published online 31 July 2024. DOI 10.15184/aqy.2024.101",
    url: "https://doi.org/10.15184/aqy.2024.101",
    sourceType: "archaeological",
    publishedYear: 2024,
    publishedDisplay: "2024",
    notes:
      "Cited for the previously unknown farming complex at Oued Beht (north-west Morocco), dated about 3400–2900 BCE, with numerous pits, pottery and lithics — described by the authors as the earliest and largest agricultural complex known in Africa beyond the Nile corridor — and for their argument that the Maghreb was an active participant in western Mediterranean later prehistory, not a passive recipient.",
  },

  // --- Takarkori -----------------------------------------------------------
  {
    key: "pre_salem2025",
    title: "Ancient DNA from the Green Sahara reveals ancestral North African lineage",
    author: "Nada Salem and colleagues, with Harald Ringbauer, David Caramelli, Savino di Lernia and Johannes Krause",
    publisher: "Nature Publishing Group",
    workTitle: "Nature",
    reference: "Nature (2025), published online 2 April 2025. DOI 10.1038/s41586-025-08793-7",
    url: "https://doi.org/10.1038/s41586-025-08793-7",
    sourceType: "scientific_study",
    publishedYear: 2025,
    publishedDisplay: "2 April 2025",
    notes:
      "Cited for genome data from two Pastoral Neolithic women buried at Takarkori, about 7,000 years old; for the finding that most of their ancestry comes from a previously unknown North African lineage that diverged from sub-Saharan African lineages about the time modern humans spread out of Africa (reported as about 50,000 years ago), close to the ancestry of the 15,000-year-old Taforalt foragers; for little sub-Saharan gene flow despite the humid Sahara; for a Neanderthal share about a tenth of that of non-Africans; and for the inference that herding spread here by cultural exchange rather than large-scale migration.",
  },

  // --- crossings -----------------------------------------------------------
  {
    key: "pre_schuhmacher2009",
    title: "Sourcing African ivory in Chalcolithic Portugal",
    author: "Thomas X. Schuhmacher, João Luís Cardoso and Arun Banerjee",
    publisher: "Antiquity Publications / Cambridge University Press",
    workTitle: "Antiquity",
    reference: "Antiquity 83(322), 983–997 (2009). DOI 10.1017/S0003598X00099294",
    url: "https://doi.org/10.1017/S0003598X00099294",
    sourceType: "archaeological",
    publishedYear: 2009,
    publishedDisplay: "2009",
    notes:
      "Cited for the identification, by microscopy and spectroscopy, of ivory in Chalcolithic and Beaker-period Portuguese sites as mostly from African savannah elephants (with some Asian elephant and fossil ivory), concentrated on the coast — evidence of seaborne exchange between Iberia and north-west Africa in the first half of the third millennium BCE.",
  },
  {
    key: "pre_olalde2019",
    title: "The genomic history of the Iberian Peninsula over the past 8000 years",
    author: "Iñigo Olalde and colleagues, with David Reich",
    publisher: "American Association for the Advancement of Science",
    workTitle: "Science",
    reference: "Science 363(6432), 1230–1234 (2019)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6436108/",
    sourceType: "scientific_study",
    publishedYear: 2019,
    publishedDisplay: "15 March 2019",
    notes:
      "Cited for genome-wide data from 271 ancient Iberians showing sporadic contact with North Africa by about 2500 BCE (including at least one Chalcolithic individual in central Spain with entirely North African-related ancestry) without lasting effect on the population, and substantial North African gene flow into Iberia only from the Roman period onward. The DOI is given inconsistently in the indexed records seen, so the PMC record is given instead.",
  },
  {
    key: "pre_gonzalezfortes2019",
    title: "A western route of prehistoric human migration from Africa into the Iberian Peninsula",
    author: "G. González-Fortes and colleagues",
    publisher: "The Royal Society",
    workTitle: "Proceedings of the Royal Society B",
    reference: "Proceedings of the Royal Society B 286(1895), 20182288 (2019). DOI 10.1098/rspb.2018.2288",
    url: "https://doi.org/10.1098/rspb.2018.2288",
    sourceType: "scientific_study",
    publishedYear: 2019,
    publishedDisplay: "30 January 2019",
    notes:
      "Cited for genomes of four individuals from northern Portugal and southern Spain spanning the Middle Neolithic to the Bronze Age (around 4,000 years ago), one carrying a sub-Saharan African mitochondrial lineage and several showing small but significant African-related ancestry — which the authors read as prehistoric gene flow by a western route, probably across the Strait, rather than only medieval admixture.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

const events: SeedEvent[] = [
  // 1 -----------------------------------------------------------------------
  {
    slug: "pre-sapiens-occupation-of-morocco",
    title: "Before Homo sapiens: the first toolmakers and hominins of North Africa",
    summary:
      "Stone tools in Algeria about 2.4 million years ago, handaxes at Casablanca by about 1.3 million years ago, and hominin fossils there about 773,000 years ago — all made by people who were not Homo sapiens.",
    description:
      "WHAT IT IS. North Africa was lived in for more than two million years before the people of Jebel Irhoud. This record gathers the deepest evidence so that the track's opening is not mistaken for the beginning of human presence in the region — and so that nobody reads the earlier toolmakers as early members of our species. They were not.\n\n" +
      "THE OLDEST TOOLS. At Ain Boucherit, on Algeria's High Plateaus, Sahnouni and colleagues (2018) excavated Oldowan-type stone tools and animal bones bearing cut marks in two deposits dated to about 2.4 and 1.9 million years ago. No hominin fossil was found with them, so who made them is unknown; the find matters because it showed that toolmaking reached the Mediterranean fringe of Africa almost as early as the oldest East African sites.\n\n" +
      "HANDAXES AT CASABLANCA. The quarries south of Casablanca (Thomas Quarry I, Oulad Hamida, Sidi Abderrahmane) hold one of the longest Pleistocene coastal sequences in Africa. Gallotti and colleagues (2021) used magnetostratigraphy to date Unit L at Thomas Quarry I and placed the Acheulean — the handaxe tradition — there by at least about 1.3 million years ago, older than the roughly one-million-year estimate previously shared with Tighennif in Algeria, whose mandibles were once named 'Atlanthropus mauritanicus' and are now usually grouped with Homo erectus in the broad sense.\n\n" +
      "THE GROTTE À HOMINIDÉS. In January 2026 Hublin and colleagues published jaws, teeth, vertebrae and a femur from a cave at Thomas Quarry I, dated by the Matuyama–Brunhes magnetic reversal to about 773,000 years ago. The authors read them as a population near the root of the lineage leading to Homo sapiens (and, further back, shared with Neanderthals and Denisovans). That reading is new and will be tested; the fossils themselves are not Homo sapiens.\n\n" +
      "WHAT WAS CORRECTED. The research brief paired '~1.3 Ma' with both the Acheulean and the hominin remains. The 1.3-million-year date belongs to the tools of Unit L; the hominin fossils from the Grotte à Hominidés are about 773,000 years old.\n\n" +
      "WHAT IT DOES NOT SHOW. None of this establishes biological continuity between these hominins and later North Africans, and none of it concerns any named people. This is the only record in the track dated before the track's window, deliberately: it is context for the opening, not part of it.",
    category: "archaeology",
    subcategory: MOORS_LANES.prehistoric,
    eventType: "archaeological_interpretation",
    eventTypeNote: "Three separate bodies of evidence (tools, handaxes, fossils), each dated differently.",
    tags: laneTags("prehistoric", "deep-time", "oldowan", "acheulean", "casablanca", "thomas-quarry", "ain-boucherit", "homo-erectus"),
    people: ["Mohamed Sahnouni", "Rosalia Gallotti", "Jean-Jacques Hublin"],
    civilisations: [],
    locationName: "Ain Boucherit (Algeria) and Thomas Quarry I, Casablanca (Morocco)",
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Csm North-African-Mandibles-Lateral f11ad33be7.jpg",
        caption:
          "Lower jaws from North Africa compared, from the 2026 Thomas Quarry I study: among them ThI-GH-10717 from the Grotte à Hominidés, Casablanca (about 773,000 years old), and Jebel Irhoud 11 (early Homo sapiens), with a recent human jaw for comparison. Images released by the research team.",
        shows: "scientific_figure",
        identificationStatus: "secure",
        licence: "CC BY-SA 2.0",
        creator: "Philipp Gunz, MPI-EVA Leipzig",
        institution: "Max Planck Institute for Evolutionary Anthropology",
        objectDate: "2026",
        pixelWidth: 733,
        pixelHeight: 600,
      }),
      commonsPicture({
        fileName: "Mandibule et outils acheuléens appartenant à l'Homme de Tighennif.jpg",
        caption:
          "A Tighennif (Ternifine) mandible displayed with Acheulean handaxes in a museum in Algiers. The Tighennif jaws, about a million years old, are usually grouped with Homo erectus; the file does not say whether the jaw shown is the original or a cast.",
        shows: "museum_specimen",
        identificationStatus: "probable",
        licence: "CC BY-SA 4.0",
        creator: "Terki hassaine samir",
        pixelWidth: 1623,
        pixelHeight: 2434,
      }),
      commonsPicture({
        fileName: "Fouille du site de Tighennif.jpg",
        caption:
          "Excavation at Tighennif (Ternifine), Algeria, as photographed in a 1958 bulletin of a French prehistoric society. The hominin jaws and Acheulean tools from this sandpit were recovered in the excavations of the mid-1950s.",
        shows: "excavation_context",
        identificationStatus: "secure",
        licence: "Public domain",
        creator: "Bulletin de la Société préhistorique de l'Ariège",
        objectDate: "1958",
        pixelWidth: 2869,
        pixelHeight: 2208,
      }),
    ],
    claims: [
      {
        sourceKey: "pre_sahnouni2018",
        citations: [
          { sourceKey: "pre_gallotti2021", relation: "context", note: "Places the later Acheulean of Casablanca against this older Oldowan-type record." },
        ],
        startYear: ka(2400),
        datePrecision: "million_years",
        precisionDecimals: 1,
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "years_ago",
        originalDateText: "about 2.4 million years ago (Ain Boucherit, older deposit)",
        datingMethod: "palaeomagnetism",
        chronology: "scientific",
        whatIsDated: "Oldest stone tools and cut-marked bones in North Africa (Ain Boucherit)",
        evidence:
          "Stone tools and butchered bones in two stratified deposits at Ain Boucherit, dated by palaeomagnetism, ESR and the associated fauna to about 2.4 and 1.9 million years ago. Dates the deposits containing the tools, not a fossil.",
        notes: "No hominin remains were found, so the species of the toolmakers is not known.",
      },
      {
        sourceKey: "pre_gallotti2021",
        citations: [
          { sourceKey: "pre_hublin2026", relation: "context", note: "Uses the same Casablanca magnetostratigraphic framework for the younger Grotte à Hominidés fossils." },
        ],
        startYear: ka(1300),
        datePrecision: "million_years",
        precisionDecimals: 1,
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "years_ago",
        originalDateText: "at least about 1.3 million years ago (Acheulean, Thomas Quarry I, Unit L)",
        datingMethod: "palaeomagnetism",
        chronology: "scientific",
        whatIsDated: "Earliest Acheulean (handaxe) industry in north-west Africa",
        evidence:
          "New magnetostratigraphic and geochemical data from Unit L at Thomas Quarry I, Casablanca. A minimum age for the handaxe-bearing levels, not for any human fossil.",
        notes: "Previously the Thomas Quarry I and Tighennif Acheulean were treated as about one million years old.",
      },
      {
        sourceKey: "pre_hublin2026",
        citations: [
          { sourceKey: "pre_mpg_thomas_quarry_2026", relation: "context", note: "The institute's summary, including the gap in Africa's fossil record between about 1 million and 500,000 years ago." },
          { sourceKey: "pre_gallotti2021", relation: "supports", note: "The Casablanca quarry sequence and its magnetostratigraphy are the frame in which the fossil layer is placed." },
        ],
        startYear: ka(773),
        uncertaintyPlus: 4000,
        uncertaintyMinus: 4000,
        datePrecision: "thousand_years",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "years_ago",
        originalDateText: "about 773,000 years ago (Grotte à Hominidés hominin fossils)",
        datingMethod: "palaeomagnetism",
        chronology: "scientific",
        whatIsDated: "Hominin fossils of the Grotte à Hominidés, Thomas Quarry I",
        evidence:
          "The fossil-bearing sediments record the Matuyama–Brunhes geomagnetic reversal, about 773,000 years ago, in a high-resolution magnetostratigraphic sequence (stated uncertainty about 4,000 years). Earlier ESR and uranium-series estimates for the site were younger.",
        notes:
          "The authors' reading of the fossils as close to the root of the Homo sapiens lineage is an interpretation of their anatomy and is likely to be debated; the dating and the identification of the fossils as non-sapiens hominins are not in question.",
      },
    ],
  },

  // 2 — THE ANCHOR ------------------------------------------------------------
  {
    slug: "jebel-irhoud-early-homo-sapiens",
    title: "Jebel Irhoud, Morocco: the oldest known Homo sapiens fossils",
    summary:
      "Fossils of early Homo sapiens from a former barite mine in central Morocco, dated by burnt flints to 315,000 ± 34,000 years ago — the oldest known members of our species, and the opening of this track.",
    description:
      "WHERE THIS TRACK STARTS, AND WHY. The track opens here because Jebel Irhoud is the oldest known evidence of Homo sapiens anywhere, and it lies in the region a much later Latin writer would call Mauretania. That makes it the opening of this track's story — not the earliest date the timeline permits (older evidence of other human species in North Africa sits in the record before this one) and not the start of any people's history. The people of Jebel Irhoud were not Moors: 'Moor' is a medieval European word descended from the Latin Mauri, a name first used for particular north-west African peoples around three hundred thousand years later. Nothing here says anything about who their descendants were.\n\n" +
      "HOW IT WAS FOUND. In 1961 barite miners cutting into a cave filling at Jebel Irhoud, between Marrakesh and Safi, exposed a skull (Irhoud 1). It reached the University of Rabat, and an expedition under Émile Ennouchi recovered more remains; a second braincase, a child's mandible (Irhoud 3) and other fragments followed in the 1960s. Ennouchi first described the skull as a North African Neanderthal, and for decades the remains were thought to be about 40,000 and later about 160,000 years old. From 2004 a team led by Jean-Jacques Hublin and Abdelouahed Ben-Ncer reopened the site and increased the number of Homo sapiens specimens from six to twenty-two, with stone tools in the same layers.\n\n" +
      "HOW IT IS DATED. Richter and colleagues (2017) dated flint tools that had been heated in fires, by thermoluminescence, which dates the last heating: the weighted average is 315,000 ± 34,000 years ago. A recalculated uranium-series/ESR age on a tooth of the Irhoud 3 mandible, 286,000 ± 32,000 years, independently supports it. '315,000 BCE' in everyday speech means this figure: strictly it is 315,000 years before 1950, about 313,000 BCE, with an error far larger than the difference.\n\n" +
      "WHAT THE BONES SHOW. Hublin and colleagues (2017) describe a face and jaw within the range of living humans combined with a longer, lower, more archaic braincase. The face became modern before the brain-case shape did.\n\n" +
      "WHY IT MATTERS. Before 2017 the oldest Homo sapiens were from Ethiopia, about 195,000 years old, and East Africa was often called the cradle of our species. Jebel Irhoud, at the other end of the continent and over 100,000 years older, supports a pan-African origin: Homo sapiens emerging from populations spread across Africa and intermittently connected (Scerri et al. 2018).\n\n" +
      "WHAT IT DOES NOT SHOW. It does not show that our species originated in Morocco, that the Irhoud people were ancestral to later North Africans in particular, or anything about their language or identity.",
    category: "archaeology",
    subcategory: MOORS_LANES.prehistoric,
    eventType: "scientific_model",
    eventTypeNote: "The fossils are secure; their age rests on two dating methods that agree within error.",
    tags: laneTags("prehistoric", "jebel-irhoud", "homo-sapiens", "middle-stone-age", "deep-time", "thermoluminescence", "track-opening"),
    people: ["Émile Ennouchi", "Jean-Jacques Hublin", "Abdelouahed Ben-Ncer", "Daniel Richter", "Shannon P. McPherron"],
    civilisations: [],
    locationName: "Jebel Irhoud, between Marrakesh and Safi, Morocco",
    lat: 31.855,
    lng: -8.8725,
    identificationStatus: "secure",
    evidenceStatus: "verified_physical_remains",
    remainsLocation: "The original fossils are held in Morocco; casts are exhibited in museums abroad",
    media: [
      commonsPicture({
        fileName: "Hublin at Jebel Irhoud.jpg",
        caption:
          "Jean-Jacques Hublin at the Jebel Irhoud excavation, pointing to the crushed skull Irhoud 10 still in the sediment, its eye sockets just beyond his fingertip — the fossils and the dated flints come out of this deposit.",
        shows: "excavation_context",
        identificationStatus: "secure",
        licence: "CC BY 4.0",
        creator: "Shannon McPherron, MPI EVA Leipzig",
        institution: "Max Planck Institute for Evolutionary Anthropology",
        objectDate: "2004–2017 excavation (published 2017)",
        pixelWidth: 307,
        pixelHeight: 231,
      }),
      commonsPicture({
        fileName: "Jebel Irhoud-1 NMNH.jpg",
        caption:
          "A CAST, not the fossil: a replica of the Irhoud 1 skull found by miners in 1961, on display at the Smithsonian's National Museum of Natural History. The original is in Morocco.",
        shows: "replica",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Jonathan Chen",
        institution: "Smithsonian National Museum of Natural History (cast)",
        pixelWidth: 1453,
        pixelHeight: 1546,
      }),
      commonsPicture({
        fileName: "Homo sapiens from Jebel Irhoud.jpg",
        caption:
          "A composite reconstruction of the Jebel Irhoud skull built from micro-CT scans of several fossils, showing the modern face and the long, archaic braincase. A digital reconstruction, not a single fossil.",
        shows: "reconstruction",
        identificationStatus: "secure",
        licence: "CC BY-SA 2.0",
        creator: "Philipp Gunz, MPI EVA Leipzig",
        institution: "Max Planck Institute for Evolutionary Anthropology",
        pixelWidth: 307,
        pixelHeight: 308,
      }),
      commonsPicture({
        fileName: "Stone tools from Jebel Irhoud.png",
        caption:
          "Middle Stone Age flint tools from the same layers as the Jebel Irhoud fossils. Flints like these that had been burnt in fires are what thermoluminescence dated to about 315,000 years ago.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "CC BY 4.0",
        creator: "Mohammed Kamal, MPI EVA Leipzig",
        institution: "Max Planck Institute for Evolutionary Anthropology",
        pixelWidth: 750,
        pixelHeight: 953,
      }),
    ],
    claims: [
      {
        sourceKey: "pre_richter2017",
        citations: [
          { sourceKey: "pre_hublin2017", relation: "supports", note: "The companion paper reports the same 315 ± 34 ka age for the fossils it describes." },
          { sourceKey: "pre_mpg_irhoud_2017", relation: "context", note: "The excavating institute's plain-language account of the dating and finds." },
          { sourceKey: "pre_scerri2018", relation: "context", note: "Places the date in the pan-African model of Homo sapiens origins." },
        ],
        startYear: ka(315),
        uncertaintyPlus: 34000,
        uncertaintyMinus: 34000,
        datePrecision: "thousand_years",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "years_ago",
        originalDateText: "315,000 ± 34,000 years ago (thermoluminescence on heated flints)",
        datingMethod: "luminescence",
        chronology: "scientific",
        whatIsDated: "The Jebel Irhoud hominin fossils and Middle Stone Age layers",
        evidence:
          "Thermoluminescence ages on flint artefacts heated in fires, from the layers that contain the fossils; their weighted average is 315 ± 34 thousand years. What is dated is the last heating of the flints, linked to the fossils by their shared deposit.\n\n" +
          "Often written '315,000 BCE'. That is shorthand: the figure counts back from 1950, so in calendar terms it is about 313,000 BCE, ± 34,000 years.",
        notes:
          "This is the date the track opens on. The ± 34,000 is a one-sigma measurement uncertainty, not a duration of occupation.",
      },
      {
        sourceKey: "pre_richter2017",
        citations: [
          { sourceKey: "pre_smith2007", relation: "context", note: "The same Irhoud 3 juvenile whose teeth Smith et al. studied, previously dated much younger." },
        ],
        startYear: ka(286),
        uncertaintyPlus: 32000,
        uncertaintyMinus: 32000,
        datePrecision: "thousand_years",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "years_ago",
        originalDateText: "286,000 ± 32,000 years ago (recalculated U-series/ESR on the Irhoud 3 tooth)",
        datingMethod: "uranium_series",
        chronology: "scientific",
        whatIsDated: "The Jebel Irhoud hominin fossils and Middle Stone Age layers",
        evidence:
          "A combined uranium-series and electron spin resonance age on a tooth of the Irhoud 3 mandible, recalculated with new dose-rate data. An independent method on a different material, overlapping the thermoluminescence age within error.",
        notes: "Agreement between a burnt-flint date and a tooth date is what makes the age robust.",
      },
      {
        sourceKey: "pre_smith2007",
        citations: [
          { sourceKey: "pre_richter2017", relation: "disputes", note: "Supersedes this estimate: new dose-rate data roughly double the earlier ages." },
          { sourceKey: "pre_wiki_irhoud", relation: "context", note: "Summarises the sequence of earlier age estimates (about 40,000, then 100,000–200,000, then about 160,000 years)." },
        ],
        startYear: ka(160),
        datePrecision: "thousand_years",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "years_ago",
        originalDateText: "about 160,000 years ago (pre-2017 ESR estimate, superseded)",
        datingMethod: "radiometric",
        chronology: "historical",
        whatIsDated: "The Jebel Irhoud hominin fossils and Middle Stone Age layers",
        evidence:
          "The age in use before 2017, from ESR dating of the Irhoud 3 tooth, under which the remains looked like a late-surviving archaic or early modern form. Kept as a record of how the site's age changed, not as a rival to the 2017 dates.",
        notes: "Superseded. Shown because many older books and websites still give this figure, or the original Neanderthal attribution.",
      },
    ],
  },

  // 3 -----------------------------------------------------------------------
  {
    slug: "north-african-symbolic-behaviour",
    title: "Shell beads and bone tools: early symbolic behaviour in North Africa",
    summary:
      "Perforated shell beads from Bizmoune Cave at least 142,000 years old, ochred beads at Taforalt about 82,000 years ago, and shaped bone tools at Contrebandiers — some of the earliest evidence anywhere for ornament.",
    description:
      "WHAT IT IS. This record collects the North African evidence for what archaeologists call symbolic behaviour — objects whose most plausible purpose was to carry meaning (to mark a person, a group, a status) rather than to do a job. The wider, cross-continental picture is in the existing record on early shell beads and ornaments; this one is North Africa's part of it, and on present evidence that part comes first.\n\n" +
      "THE FINDS. At Bizmoune Cave near Essaouira, Sehasseh and colleagues (2021) recovered thirty-three perforated shells of the small sea snail Tritia gibbosula, many from deposits dated to at least 142,000 years ago — the oldest shell beads yet reported. At the Grotte des Pigeons at Taforalt in north-east Morocco, Bouzouggar and colleagues (2007) found perforated Nassarius shells in levels dated to about 82,000 years ago, some with wear suggesting they hung on a cord and some coated in red ochre. d'Errico and colleagues (2009) added further examples from several Moroccan Middle Stone Age sites, and at Contrebandiers Cave on the Atlantic coast, Hallett and colleagues (2021) described more than sixty shaped bone tools from deposits dated 120,000–90,000 years ago, interpreted as tools for working hides and fur.\n\n" +
      "WHY BEADS COUNT AS EVIDENCE. The argument runs from observation to inference. The shells are of selected species and sizes; they are found in caves away from where the animals lived; the perforations are in consistent places; some carry use-wear and pigment. Together these make ornament the best explanation. It remains an inference, and the record says so.\n\n" +
      "WHO MADE THEM. Most of these finds come from Middle Stone Age layers often labelled Aterian, and the few human fossils from such layers in Morocco (Dar es-Soltan, Contrebandiers, El Harhoura) are Homo sapiens. The makers were therefore almost certainly people of our species, descendants in a broad sense of populations like Jebel Irhoud's — but not a named people, and not the ancestors of any one modern group in particular.\n\n" +
      "WHAT IT DOES NOT SHOW. It does not show a single 'moment' when symbolic thought began, nor that North Africa invented it: comparable South African and Levantine finds overlap in time. It shows that the practice was established along Africa's north-west coast very early, and over a long span.",
    category: "archaeology",
    subcategory: MOORS_LANES.prehistoric,
    eventType: "archaeological_interpretation",
    eventTypeNote: "The shells, their perforations and their dates are observations; 'symbolic' is the interpretation.",
    tags: laneTags("prehistoric", "shell-beads", "symbolic-behaviour", "middle-stone-age", "bizmoune", "taforalt", "contrebandiers", "ochre"),
    people: ["El Mehdi Sehasseh", "Abdeljalil Bouzouggar", "Francesco d'Errico", "Emily Y. Hallett"],
    civilisations: [],
    locationName: "Bizmoune Cave (Essaouira), Grotte des Pigeons (Taforalt) and Contrebandiers Cave (Témara), Morocco",
    identificationStatus: "probable",
    media: [
      commonsPicture({
        fileName: "Bizmoun perforated shell beads (reproduction).jpg",
        caption:
          "A REPRODUCTION, not the finds: modern replicas of the perforated Tritia shells from Bizmoune Cave, Morocco, displayed to show their size and perforations. The originals are at least 142,000 years old.",
        shows: "replica",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Manfred Ewel",
        pixelWidth: 3264,
        pixelHeight: 1840,
      }),
      commonsPicture({
        fileName: "Taforalt.jpg",
        caption:
          "The Grotte des Pigeons at Taforalt in north-east Morocco, photographed in 2017. Levels in this cave produced perforated Nassarius shell beads, some ochre-coated, dated to about 82,000 years ago.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC0",
        creator: "Velatrix",
        objectDate: "photographed 11 September 2017",
        pixelWidth: 5472,
        pixelHeight: 3648,
      }),
    ],
    claims: [
      {
        sourceKey: "pre_sehasseh2021",
        citations: [
          { sourceKey: "pre_derrico2009", relation: "context", note: "Earlier North African bead finds that Bizmoune now predates." },
          { sourceKey: "pre_bouzouggar2007", relation: "context", note: "The Taforalt beads that were the oldest known before Bizmoune." },
        ],
        startYear: ka(142),
        datePrecision: "thousand_years",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "years_ago",
        originalDateText: "at least 142,000 years ago (Bizmoune Cave beads)",
        datingMethod: "radiometric",
        chronology: "scientific",
        whatIsDated: "Bizmoune Cave perforated shell beads",
        evidence:
          "Radiometric dating of the deposits containing the shells gives a minimum age of about 142,000 years for many of the thirty-three beads. A minimum: the beads are at least this old.",
      },
      {
        sourceKey: "pre_hallett2021",
        citations: [
          { sourceKey: "pre_sehasseh2021", relation: "context", note: "Its review notes 151 shell beads at Contrebandiers in a context of about 115,000 years." },
          { sourceKey: "pre_dibble2013", relation: "context", note: "The same Contrebandiers sequence is at the centre of the argument about whether 'Aterian' layers form a distinct industry." },
        ],
        startYear: ka(120),
        endYear: ka(90),
        datePrecision: "thousand_years",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "date_range",
        originalDateText: "120,000–90,000 years ago (Contrebandiers Cave bone tools)",
        datingMethod: "luminescence",
        chronology: "scientific",
        whatIsDated: "Contrebandiers Cave shaped bone tools",
        evidence:
          "Shaped bone tools from deposits dated by luminescence to between about 120,000 and 90,000 years ago. A span over which the tools were deposited, not one event.",
        notes: "The interpretation as leather- and fur-working tools — and so indirectly as evidence of clothing — is the authors' inference from tool form and associated carnivore bones.",
      },
      {
        sourceKey: "pre_bouzouggar2007",
        citations: [
          { sourceKey: "pre_derrico2009", relation: "supports", note: "Further Nassarius ornaments at other Moroccan sites of similar age." },
        ],
        startYear: ka(82),
        datePrecision: "thousand_years",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "years_ago",
        originalDateText: "about 82,000 years ago (Taforalt Nassarius beads)",
        datingMethod: "luminescence",
        chronology: "scientific",
        whatIsDated: "Grotte des Pigeons (Taforalt) Nassarius shell beads",
        evidence:
          "Luminescence and uranium-series dates on the archaeological levels holding the perforated Nassarius shells at the Grotte des Pigeons, Taforalt, about 82,000 years ago.",
      },
    ],
  },

  // 4 -----------------------------------------------------------------------
  {
    slug: "aterian-industries",
    title: "The Aterian: tanged stone tools of the North African Middle Stone Age",
    summary:
      "Stone-tool assemblages with distinctive tanged points, found from the Atlantic to Egypt's Western Desert and dated from about 145,000 years ago — a label whose unity as one culture is now doubted.",
    description:
      "WHAT IT IS. 'Aterian' is an archaeologists' name, from the site of Bir el-Ater in eastern Algeria, for Middle Stone Age assemblages in North Africa and the Sahara that include tanged pieces: points and scrapers with a narrowed stem at the base, almost certainly for fixing into a handle or shaft. Hafting itself is not unique to North Africa, but the tang is a distinctive solution and the label has been used for a century.\n\n" +
      "WHERE. Aterian assemblages are known across the Maghreb — Dar es-Soltan, Contrebandiers, El Harhoura, Ifri n'Ammar, Taforalt in Morocco; many Algerian and Tunisian sites — and deep into what is now desert, as far as the Western Desert of Egypt. Many Saharan sites are only explicable if people lived there during the humid phases of the Last Interglacial, when lakes and rivers crossed what is now the Sahara.\n\n" +
      "HOW IT IS DATED. At Ifri n'Ammar in north-east Morocco, Richter and colleagues (2010) dated heated artefacts by thermoluminescence: a layer with tanged tools at 145 ± 9 thousand years, underlain by a layer without them at 171 ± 12 thousand years and followed by later layers. At Dar es-Soltan 1 a shaped bone knife comes from an Aterian layer of about 90,000 years. How late the tradition lasted is poorly constrained; figures from about 60,000 down to 30,000 or even 20,000 years ago are cited.\n\n" +
      "WHAT WAS CORRECTED. The brief gave '145,000–30,000 BCE'. These are figures in years ago (before present), not BCE; the older bound is well dated, the younger bound is a contested estimate rather than a measurement.\n\n" +
      "WHERE THE ACCOUNTS DISAGREE. Older work treated the Aterian as one culture, even one people. More recent work does not: Richter's own sequence shows tanged and untanged layers alternating, Dibble and colleagues (2013) argue the 'Aterian' and 'Mousterian' of the Maghreb are not cleanly separable, and Scerri (2013) finds that much of the variation is explained by distance and convergence rather than by one shared tradition. Its relationship to later populations — and whether Aterian-making people took part in dispersals of Homo sapiens out of Africa — is debated; human remains from Aterian layers in Morocco are Homo sapiens, but a tool type is not a population.\n\n" +
      "WHAT IT DOES NOT SHOW. A tanged point identifies a way of making tools. It does not identify a language, an ethnic group or ancestors of any later people.",
    category: "archaeology",
    subcategory: MOORS_LANES.prehistoric,
    eventType: "archaeological_interpretation",
    eventTypeNote: "A tool-making tradition named by archaeologists; whether it is one tradition at all is disputed.",
    tags: laneTags("prehistoric", "aterian", "middle-stone-age", "tanged-points", "ifri-nammar", "dar-es-soltan", "green-sahara"),
    people: ["Daniel Richter", "Eleanor M. L. Scerri", "Harold L. Dibble", "Abdeljalil Bouzouggar"],
    civilisations: [],
    locationName: "North Africa and the Sahara (type site Bir el-Ater, Algeria)",
    identificationStatus: "disputed",
    media: [
      commonsPicture({
        fileName: "PointeS Algérie de l'est Atérien 40778.jpg",
        caption:
          "Aterian stone points from eastern Algeria in the museum at Toul, France. The narrowed stems at their bases (tangs) are the feature the Aterian label rests on. Museum attribution; exact findspots not given on the file.",
        shows: "museum_specimen",
        identificationStatus: "probable",
        licence: "CC BY-SA 4.0",
        creator: "G.Garitan",
        institution: "Musée de Toul (as stated on the file)",
        pixelWidth: 2768,
        pixelHeight: 1312,
      }),
      commonsPicture({
        fileName: "Specialised bone tool in the Aterian Middle Stone Age of North Africa 90,000 year-old Dar es-Soltan.jpg",
        caption:
          "The shaped bone knife from an Aterian layer at Dar es-Soltan 1 on Morocco's Atlantic coast, dated to about 90,000 years ago — a figure from the open-access paper that published it.",
        shows: "scientific_figure",
        identificationStatus: "secure",
        licence: "CC BY 4.0",
        creator: "Abdeljalil Bouzouggar, Louise T. Humphrey, Nick Barton, Simon A. Parfitt, Laine Clark Balzan, Jean-Luc Schwenninger and colleagues",
        pixelWidth: 1393,
        pixelHeight: 1654,
      }),
      commonsPicture({
        fileName: "Atérien (Djelfa).JPG",
        caption:
          "Stone tools from the Djelfa (Zaccar) region of Algeria, labelled Aterian by the photographer. The attribution rests on the tools' form and the file description, not on a published excavation.",
        shows: "artefact",
        identificationStatus: "probable",
        licence: "CC BY-SA 3.0",
        creator: "Michel-georges bernard",
        pixelWidth: 938,
        pixelHeight: 1156,
      }),
    ],
    claims: [
      {
        sourceKey: "pre_richter2010",
        citations: [
          { sourceKey: "pre_scerri2013", relation: "context", note: "Uses the Ifri n'Ammar sequence as the earliest firm Aterian date in its reassessment." },
          { sourceKey: "pre_wiki_aterian", relation: "context", note: "Repeats about 145,000 years at Ifri n'Ammar as the earliest Aterian." },
        ],
        startYear: ka(145),
        uncertaintyPlus: 9000,
        uncertaintyMinus: 9000,
        datePrecision: "thousand_years",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "years_ago",
        originalDateText: "145,000 ± 9,000 years ago (Ifri n'Ammar, tanged-tool layer 'Upper OI')",
        datingMethod: "luminescence",
        chronology: "scientific",
        whatIsDated: "Earliest dated tanged-tool (Aterian) layer",
        evidence:
          "Thermoluminescence on heated flint artefacts from the tanged-tool layer at Ifri n'Ammar, 145 ± 9 thousand years; the untanged layer below is 171 ± 12 thousand years.",
        notes: "The authors themselves argue that because tanged and untanged layers alternate here, 'Aterian' should not be used as a time period.",
      },
      {
        sourceKey: "pre_wiki_aterian",
        citations: [
          { sourceKey: "pre_scerri2013", relation: "disputes", note: "Disputes that the assemblages grouped over this span form one coherent industry." },
          { sourceKey: "pre_dibble2013", relation: "disputes", note: "Argues Aterian and Mousterian in the Maghreb are not separable industries, which undermines a single span for 'the Aterian'." },
        ],
        startYear: ka(145),
        endYear: ka(30),
        datePrecision: "thousand_years",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "estimated_range",
        originalDateText: "about 145,000 to perhaps 30,000 years ago (commonly cited span; younger end contested)",
        datingMethod: "estimate",
        chronology: "disputed",
        whatIsDated: "Overall span of Aterian (tanged-tool) assemblages",
        evidence:
          "A span compiled from many sites, not a measurement. The older end rests on Ifri n'Ammar; the younger end on a handful of poorly dated late assemblages, and published end-points range from about 60,000 to about 20,000 years ago.",
        notes: "Corrects the brief's '145,000–30,000 BCE': the figures are years before present.",
      },
      {
        sourceKey: "pre_bouzouggar2018",
        citations: [
          { sourceKey: "pre_scerri2018", relation: "context", note: "Treats regionally distinctive North African technologies like this as part of a structured, pan-African Homo sapiens population." },
        ],
        startYear: ka(90),
        datePrecision: "thousand_years",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "years_ago",
        originalDateText: "about 90,000 years ago (Dar es-Soltan 1 Aterian bone knife)",
        datingMethod: "luminescence",
        chronology: "scientific",
        whatIsDated: "Aterian bone technology at Dar es-Soltan 1",
        evidence:
          "Luminescence dating of the Aterian layer at Dar es-Soltan 1 that held the shaped rib-bone knife, about 90,000 years ago.",
      },
    ],
  },

  // 5 -----------------------------------------------------------------------
  {
    slug: "taforalt-iberomaurusian-burials",
    title: "Taforalt: Iberomaurusian burials and the oldest North African genomes",
    summary:
      "A cemetery of Later Stone Age foragers at the back of the Grotte des Pigeons, directly dated to about 15,100–13,900 years ago, whose genomes and teeth reshaped the picture of Late Pleistocene North Africa.",
    description:
      "WHAT IT IS. The Grotte des Pigeons at Taforalt, in the Beni Snassen hills of north-east Morocco, holds a deep sequence from the Middle Stone Age (including the 82,000-year-old beads in the record on symbolic behaviour) to the Later Stone Age. At the back of the cave, among thick ashy deposits, lie the burials of dozens of people of the Iberomaurusian culture, excavated by Jean Roche in the 1950s and again since the early 2000s by a team led by Abdeljalil Bouzouggar, Nick Barton and Louise Humphrey. It is one of the oldest cemeteries known anywhere.\n\n" +
      "HOW IT IS DATED. Van de Loosdrecht and colleagues (2018) radiocarbon-dated the individuals they sequenced directly, to 15,100–13,900 calibrated years before present. The brief's '13,000 BCE' is close: it equals about 14,950 years before present, inside that range. The burial phase is best written as about 15,100–13,900 years ago (roughly 13,150–11,950 BCE).\n\n" +
      "WHAT THE GENOMES SHOW. Seven individuals yielded genome-wide data — the oldest ancient DNA from Africa when published. About two-thirds of their ancestry is shared with early Holocene people of the Near East, best represented by the Natufians of the Levant, and about one-third is related to sub-Saharan African populations, best modelled as a mix of components found today in West and East Africa. No gene flow from Palaeolithic Europeans was detectable.\n\n" +
      "WHAT THEY ATE. Humphrey and colleagues (2014) found tooth decay in about half the adult teeth — a rate usually associated with farmers — alongside charred acorns, pine nuts and other wild plants; Moubtahij and colleagues (2024) showed from isotopes that plants supplied a large share of dietary protein, though Barbary sheep and gazelle were also butchered.\n\n" +
      "THE NAME. Paul Pallary coined 'Iberomaurusian' in 1909 for assemblages from La Mouillah in Algeria, believing the industry also existed across the Strait in Iberia. That link has not been supported — archaeologically, and now genetically — and many prefer the neutral 'Oranian'. The name survives by convention. Older literature also sorted these skeletons into a 'Mechta-Afalou' physical type, a typological category of its period that is not used here.\n\n" +
      "WHAT IT DOES NOT SHOW. Genetic ancestry is not culture or language. The Taforalt genomes show where these people's ancestors came from; they say nothing about what language the Iberomaurusians spoke or what they called themselves.",
    category: "archaeology",
    subcategory: MOORS_LANES.prehistoric,
    eventType: "archaeological_interpretation",
    eventTypeNote: "Burials and genomes directly dated; the ancestry model is a statistical fit to the populations sampled so far.",
    tags: laneTags("prehistoric", "taforalt", "iberomaurusian", "ancient-dna", "burials", "later-stone-age", "diet"),
    people: ["Paul Pallary", "Jean Roche", "Abdeljalil Bouzouggar", "Nick Barton", "Louise Humphrey", "Marieke van de Loosdrecht"],
    civilisations: [],
    locationName: "Grotte des Pigeons, Taforalt, Beni Snassen, north-east Morocco",
    lat: 34.81,
    lng: -2.41,
    identificationStatus: "secure",
    evidenceStatus: "verified_physical_remains",
    media: [
      commonsPicture({
        fileName: "Taforalt landscape.jpg",
        caption:
          "The Grotte des Pigeons at Taforalt seen from below, in the Beni Snassen hills of north-east Morocco. The Iberomaurusian burials lie at the back of this cave.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC0",
        creator: "Velatrix",
        objectDate: "photographed 14 September 2017",
        pixelWidth: 4032,
        pixelHeight: 3024,
      }),
      commonsPicture({
        fileName: "Taforalt stratigraphy.jpg",
        caption:
          "An excavated section at Taforalt showing the layered deposits, photographed during fieldwork in 2017 — the kind of stratigraphy from which both the Middle Stone Age and the Iberomaurusian levels are dated.",
        shows: "excavation_context",
        identificationStatus: "secure",
        licence: "CC0",
        creator: "Velatrix",
        objectDate: "photographed 28 September 2017",
        pixelWidth: 4000,
        pixelHeight: 2650,
      }),
      commonsPicture({
        fileName: "Iberomaurusian-distribution.jpg",
        caption:
          "A modern map of the distribution of Iberomaurusian sites across the coastal and inland Maghreb. A user-drawn map; site positions are approximate.",
        shows: "map",
        identificationStatus: "probable",
        licence: "CC0",
        creator: "Takruri",
        pixelWidth: 6125,
        pixelHeight: 3508,
      }),
      commonsPicture({
        fileName: "Mechta el-Arbi.png",
        caption:
          "A modern drawing of an Iberomaurusian-period skull from the Constantine region of Algeria, showing the removed upper incisors — a deliberate practice common in these populations. Drawn by an illustrator, not a photograph.",
        shows: "diagram",
        identificationStatus: "probable",
        licence: "CC BY-SA 2.5",
        creator: "José-Manuel Benito Álvarez",
        pixelWidth: 521,
        pixelHeight: 640,
      }),
    ],
    claims: [
      {
        sourceKey: "pre_vandeloosdrecht2018",
        citations: [
          { sourceKey: "pre_humphrey2014", relation: "supports", note: "Dates the associated occupation deposits and plant remains to the same window, about 15,000–13,700 cal BP." },
          { sourceKey: "pre_moubtahij2024", relation: "supports", note: "Works with the same individuals and the same period, about 15,000–13,000 cal BP." },
          { sourceKey: "pre_wiki_iberomaurusian", relation: "context", note: "History of the name Iberomaurusian and its rejected Iberian link." },
        ],
        startYear: ka(15.1),
        endYear: ka(13.9),
        datePrecision: "century",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "date_range",
        originalDateText: "15,100–13,900 calibrated years before present (direct radiocarbon dates on the sequenced individuals)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "The Taforalt Iberomaurusian burials",
        evidence:
          "Direct radiocarbon dates on the skeletons whose genomes were sequenced. The span is the burial phase for those individuals; the cemetery as a whole may have been used over a somewhat longer period.",
        notes: "Corrects the brief's '13,000 BCE' only in form: that figure (about 14,950 BP) falls inside this range.",
      },
      {
        sourceKey: "pre_humphrey2014",
        citations: [
          { sourceKey: "pre_moubtahij2024", relation: "supports", note: "Isotopic evidence for a high reliance on plant food in the same population." },
        ],
        startYear: ka(15),
        endYear: ka(13.7),
        datePrecision: "century",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "date_range",
        originalDateText: "about 15,000–13,700 cal BP (occupation deposits with acorns and pine nuts)",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        whatIsDated: "Iberomaurusian occupation and plant use at Taforalt",
        evidence:
          "Radiocarbon-dated occupation deposits containing charred acorns, pine nuts and other wild plants, contemporary with the adults whose teeth show very high rates of caries.",
      },
    ],
  },

  // 6 -----------------------------------------------------------------------
  {
    slug: "ancient-moroccan-dna-continuity-and-change",
    title: "Ancient Moroccan genomes: long continuity, then newcomers from Iberia and the Levant",
    summary:
      "Genomes from Neolithic Morocco show the Taforalt foragers' ancestry persisting for thousands of years, joined about 7,400 years ago by farmers from Iberia, later by Levantine-related herders, and mixed by the Late Neolithic.",
    description:
      "WHAT IT IS. A run of ancient-DNA studies since 2018 now gives a sequence for north-west Africa from the end of the Ice Age into the Neolithic. It is one of the clearest regional genetic histories in Africa — and one of the easiest to over-read, so this record keeps ancestry apart from culture and language throughout.\n\n" +
      "CONTINUITY. Simões and colleagues (2023), with nine genomes from the Epipalaeolithic to the Middle Neolithic, report about 8,000 years of population continuity and isolation from the Upper Palaeolithic (the Taforalt foragers' ancestry) into some Neolithic groups. Fregel and colleagues (2018) had already found that Early Neolithic people at Ifri n'Amr o Moussa, around 5000 BCE, closely resemble the Taforalt individuals, and read this as a local North African component that persists in present-day Maghrebi populations.\n\n" +
      "CHANGE. The earliest Neolithic individuals in Simões's sample carry mostly European (Iberian) early-farmer ancestry, which the authors read as farming brought across the Strait by migrants and then taken up by local people; their university dates the arrival to about 7,400 years ago. In the Middle Neolithic a Levantine-related ancestry appears, coinciding with the arrival of pastoralism. By the Late Neolithic the three were mixed: at Kelif el Boroud, around 3000 BCE, Fregel's team found roughly half the ancestry matching early Neolithic southern Iberians.\n\n" +
      "WHAT IT DOES NOT SHOW. These are a few dozen genomes at most, from a handful of sites, and the populations a model can use are only those already sampled. The labels — 'Iberian', 'Levantine', 'local' — name statistical sources of ancestry, not peoples, languages or cultures. Nothing here identifies when Amazigh (Berber) languages arrived or arose: genes and languages can travel separately, and no prehistoric genome tells us what anyone spoke. Nor are the modern populations of the Maghreb a simple continuation of any one of these strands; later Phoenician, Roman, Arab and sub-Saharan contributions followed.\n\n" +
      "WHERE THE ACCOUNTS DISAGREE. Mostly over weighting: how much of today's Maghrebi ancestry goes back to the Late Pleistocene, and how much to these Neolithic arrivals, depends on the sites sampled. The overall pattern — deep local continuity, then Neolithic newcomers — is shared by both papers.",
    category: "science",
    subcategory: MOORS_LANES.prehistoric,
    eventType: "scientific_model",
    eventTypeNote: "Ancestry models fitted to a small number of ancient genomes.",
    tags: laneTags("prehistoric", "ancient-dna", "neolithic", "population-history", "ifri-n-amr-o-moussa", "kelif-el-boroud", "ancestry-not-identity"),
    people: ["Rosa Fregel", "Luciana G. Simões", "Youssef Bokbot", "Mattias Jakobsson", "Cecilia Valdiosera"],
    civilisations: [],
    locationName: "Northern Morocco (Ifri n'Amr o Moussa, Kelif el Boroud and other sites)",
    media: [
      commonsPicture({
        fileName: "Ancestry proportions of Canary Islands indigenous people.png",
        caption:
          "A figure from a 2023 open-access study of ancient Canary Islanders, modelling their ancestry with the Moroccan Early and Late Neolithic genomes as sources. Related evidence, not the Moroccan data themselves: it shows how the Neolithic Moroccan ancestries are used as reference populations.",
        shows: "scientific_figure",
        identificationStatus: "secure",
        licence: "CC BY 4.0",
        creator: "Javier G. Serrano and colleagues",
        objectDate: "2023",
        pixelWidth: 1698,
        pixelHeight: 1409,
      }),
      commonsPicture({
        fileName: "Bouteille en œuf d'autruche (Capsien).png",
        caption:
          "A modern drawing of a bottle made from an ostrich egg, of the Capsian culture of the eastern Maghreb — the forager and early Neolithic way of life of the same millennia. Cultural context only: no Capsian genome is part of the studies in this record.",
        shows: "diagram",
        identificationStatus: "probable",
        licence: "Public domain",
        creator: "José-Manuel Benito Álvarez",
        pixelWidth: 568,
        pixelHeight: 640,
      }),
    ],
    claims: [
      {
        sourceKey: "pre_simoes2023",
        citations: [
          { sourceKey: "pre_vandeloosdrecht2018", relation: "context", note: "The Taforalt genomes that define the local Late Pleistocene ancestry." },
          { sourceKey: "pre_fregel2018", relation: "supports", note: "Found the same local component in Early Neolithic Ifri n'Amr o Moussa." },
        ],
        startYear: ka(15),
        endYear: ka(7),
        datePrecision: "millennium",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "estimated_range",
        originalDateText: "about 8,000 years of population continuity, from the Upper Palaeolithic into the Neolithic",
        datingMethod: "genetic",
        chronology: "scientific",
        whatIsDated: "Continuity of the local north-west African ancestry",
        evidence:
          "Genomes from radiocarbon-dated burials spanning the Epipalaeolithic to the Middle Neolithic share the Late Pleistocene local ancestry with little outside input over about 8,000 years. The bounds are approximate, set by the oldest and youngest sampled individuals.",
      },
      {
        sourceKey: "pre_simoes2023",
        citations: [
          { sourceKey: "pre_uppsala2023", relation: "supports", note: "Gives the round figure of about 7,400 years ago for the Iberian migrants' arrival." },
        ],
        startYear: ka(7.4),
        datePrecision: "century",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "approximate_date",
        originalDateText: "about 7,400 years ago (earliest Neolithic individuals with Iberian-related farmer ancestry)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "Arrival of Iberian-related farmer ancestry in Morocco",
        evidence:
          "The earliest Neolithic individuals sampled carry mostly European Neolithic (Iberian-related) ancestry; their burials are radiocarbon-dated to about 7,400 years ago, roughly 5400 BCE.",
      },
      {
        sourceKey: "pre_fregel2018",
        citations: [
          { sourceKey: "pre_simoes2023", relation: "supports", note: "Confirms local continuity in some Neolithic groups alongside newcomers." },
        ],
        startYear: bce(5000),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        originalDateText: "around 5000 BCE (Early Neolithic, Ifri n'Amr o Moussa)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "Early Neolithic genomes from Ifri n'Amr o Moussa",
        evidence:
          "Radiocarbon-dated Early Neolithic burials at Ifri n'Amr o Moussa whose genomes resemble the Taforalt foragers, with some Levantine-related ancestry — farming here was adopted largely by local people.",
      },
      {
        sourceKey: "pre_fregel2018",
        citations: [
          { sourceKey: "pre_simoes2023", relation: "supports", note: "Reports the three ancestries mixed by the Late Neolithic." },
        ],
        startYear: bce(3000),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        originalDateText: "around 3000 BCE (Late Neolithic, Kelif el Boroud)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "Late Neolithic genomes from Kelif el Boroud",
        evidence:
          "Late Neolithic individuals from Kelif el Boroud, roughly half of whose ancestry matches Early Neolithic southern Iberians and half local North African sources.",
      },
    ],
  },

  // 7 -----------------------------------------------------------------------
  {
    slug: "green-sahara-humid-period",
    title: "The Green Sahara: the African Humid Period",
    summary:
      "Between roughly 14,800 and 5,500 years ago, a stronger monsoon turned much of the Sahara into grassland with lakes and rivers — Lake Mega-Chad alone covered about 361,000 km² — opening routes and ways of life the later desert closed.",
    description:
      "WHAT IT IS. The Sahara has been green many times, whenever changes in Earth's orbit strengthened the West African monsoon. The most recent episode, the African Humid Period, is the one that frames the Holocene peoples of North Africa: hunters, fishers and then herders living where there is now sand and rock.\n\n" +
      "HOW IT IS DATED. deMenocal and colleagues (2000) used the dust blown off Africa into an Atlantic sediment core: little dust meant a vegetated Sahara. Their record puts the humid period at about 14,800 to 5,500 years ago and argues that it began and ended abruptly, even though the orbital change behind it was gradual. Tierney and colleagues (2017), using plant-wax isotopes in marine cores to estimate rainfall itself, find a Green Sahara from about 11,000 to 5,000 years ago with rainfall many times today's. Armitage and colleagues (2015) dated the shorelines of Lake Mega-Chad: at highstand by about 11,500 years ago, about 361,000 km² and up to 160 m deep, holding until about 5,000 years ago and then falling fast.\n\n" +
      "WHAT WAS CORRECTED. The brief gave '9000–6000 BCE'. That window (about 11,000–8,000 years ago) is the heart of the humid period, but the period itself runs from about 14,800 or 11,000 to about 5,500–5,000 years ago depending on the record and the region; the end was later in the south and east than in the north and west.\n\n" +
      "WHAT IT MADE POSSIBLE. Lakes and rivers linked regions now separated by desert. At Takarkori in south-west Libya, fish and other aquatic animals in the deposits (Van Neer et al. 2020) show permanent water in what is today one of the driest places on Earth. Pottery, fishing gear and later cattle spread across the region, and the rock art of the central Sahara records animals — elephants, giraffes, hippopotamus, cattle — that the present climate could not support.\n\n" +
      "WHAT IT DOES NOT SHOW. A green Sahara was not automatically a corridor for people. Genomes from Takarkori (Salem et al. 2025) show surprisingly little gene flow from sub-Saharan Africa during this time. Climate made movement possible; it did not make it happen.",
    category: "nature",
    subcategory: MOORS_LANES.prehistoric,
    eventType: "scientific_model",
    eventTypeNote: "A climate period reconstructed from proxies; its bounds differ by record and by region.",
    tags: laneTags("prehistoric", "green-sahara", "african-humid-period", "palaeoclimate", "lake-mega-chad", "holocene"),
    people: ["Peter deMenocal", "Jessica E. Tierney", "Simon J. Armitage"],
    civilisations: [],
    locationName: "The Sahara and Sahel",
    media: [
      commonsPicture({
        fileName: "Mega-Chad.jpg",
        caption:
          "NASA Earth Observatory image comparing present-day Lake Chad with the outline of Lake Mega-Chad, the vast Holocene lake of the humid period. The ancient shoreline is a reconstruction drawn over a modern satellite view.",
        shows: "map",
        identificationStatus: "secure",
        licence: "Public domain",
        creator: "Joshua Stevens, NASA Earth Observatory",
        institution: "NASA Earth Observatory",
        objectDate: "2020",
        pixelWidth: 5304,
        pixelHeight: 4096,
      }),
      commonsPicture({
        fileName: "Precipitation reconstruction near sahara at 26p8n 1.png",
        caption:
          "A modern chart re-plotting the rainfall reconstruction from marine core GC37 off the western Sahara published by Tierney and colleagues in 2017, showing the humid period and its end. Drawn by a Commons user from the published data.",
        shows: "scientific_figure",
        identificationStatus: "secure",
        licence: "CC BY 4.0",
        creator: "Merikanto",
        pixelWidth: 1081,
        pixelHeight: 605,
      }),
      commonsPicture({
        fileName: "Sahara avant le désert.jpg",
        caption:
          "A modern map of the Sahara before the desert, redrawn after Henri Hugot's 1974 book and Gabriel Camps's chronology. Shows an older, mid-twentieth-century reconstruction of lakes and vegetation, not current data.",
        shows: "map",
        identificationStatus: "possible",
        licence: "CC BY-SA 4.0",
        creator: "Maisrimer",
        pixelWidth: 1077,
        pixelHeight: 964,
      }),
    ],
    claims: [
      {
        sourceKey: "pre_demenocal2000",
        citations: [
          { sourceKey: "pre_tierney2017", relation: "context", note: "A rainfall-based reconstruction that puts the green phase at about 11,000–5,000 years ago." },
        ],
        startYear: ka(14.8),
        endYear: ka(5.5),
        datePrecision: "century",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "date_range",
        originalDateText: "about 14,800–5,500 years ago (dust record, ODP Site 658)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "The African Humid Period",
        evidence:
          "Terrigenous dust flux in a radiocarbon-dated Atlantic core off Mauritania: a sharp fall in dust around 14,800 years ago and a sharp rise around 5,500 years ago bound the humid period.",
      },
      {
        sourceKey: "pre_tierney2017",
        citations: [
          { sourceKey: "pre_demenocal2000", relation: "supports", note: "The classic dust record of the same period, with an earlier onset." },
        ],
        startYear: ka(11),
        endYear: ka(5),
        datePrecision: "millennium",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "date_range",
        originalDateText: "about 11,000–5,000 years ago (leaf-wax rainfall reconstruction)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "The African Humid Period",
        evidence:
          "Hydrogen-isotope ratios of leaf waxes in marine sediments off the western Sahara, converted to rainfall, show the wettest conditions between about 11,000 and 5,000 years ago.",
        notes: "The brief's '9000–6000 BCE' falls inside this window; the period itself is longer.",
      },
      {
        sourceKey: "pre_armitage2015",
        citations: [
          { sourceKey: "pre_vanneer2020", relation: "supports", note: "Aquatic fauna at Takarkori confirm permanent water in the central Sahara during the Holocene humid phase." },
        ],
        startYear: ka(11.5),
        endYear: ka(5),
        datePrecision: "century",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "date_range",
        originalDateText: "highstand from about 11,500 to about 5,000 years ago (Lake Mega-Chad shorelines)",
        datingMethod: "luminescence",
        chronology: "scientific",
        whatIsDated: "Lake Mega-Chad highstand",
        evidence:
          "Luminescence ages on beach-ridge and shoreline sands of Lake Mega-Chad: about 361,000 km² and up to 160 m deep at highstand, falling rapidly at about 5,000 years ago.",
      },
    ],
  },

  // 8 -----------------------------------------------------------------------
  {
    slug: "saharan-rock-art-and-pastoralists",
    title: "Saharan rock art and the first herders",
    summary:
      "Tens of thousands of paintings and engravings in the Tassili n'Ajjer, Tadrart Acacus and Messak record wild animals, masked figures and cattle herds of the Green Sahara — art that is vivid, abundant and very hard to date.",
    description:
      "WHAT IT IS. The sandstone massifs of the central Sahara — the Tassili n'Ajjer in Algeria, the Tadrart Acacus and the Messak plateau in Libya — hold one of the world's great concentrations of rock art. Engravings of elephants, giraffes and rhinoceros; painted 'Round Head' figures, some masked; scenes of people with cattle, milking, dancing; later horses and chariots, and finally camels. It was made by the hunters and herders of the humid Sahara and their successors.\n\n" +
      "THE STYLE SEQUENCE. Since the mid-twentieth century the art has been sorted into broad periods — Bubaline or Large Wild Fauna, Round Head, Pastoral (Bovidian), Horse and Camel — mostly by style, superposition and the animals shown. The order is broadly accepted; the dates are not.\n\n" +
      "HOW IT IS DATED, AND WHY IT IS HARD. Almost none of the art can be dated directly. A 'long' chronology places the Bubaline engravings and the Round Heads as early as the tenth millennium before present; a 'short' chronology puts them thousands of years later, and both have been criticised as partly circular. The UNESCO listing of the Tadrart Acacus summarises the whole span as about 12,000 BCE to 100 CE. One of the firmer anchors comes from di Lernia and Gallinaro (2010): on the Messak, engraved stones with Pastoral-style cattle were built into ceremonial platforms where animals were sacrificed, dated to about 5,430–5,150 years before present, possibly earlier.\n\n" +
      "THE HERDERS. The cattle in the art match evidence from excavation. At Takarkori, Dunne and colleagues (2012) identified dairy fats absorbed into pottery of the fifth millennium BCE — the earliest known dairying in Africa — so the milking scenes of the Pastoral art depict a real practice. Herding of cattle, sheep and goats spread through the central Sahara from roughly seven thousand or more years ago, and when the humid period ended many herders moved south toward the Sahel or into the oases and highlands.\n\n" +
      "WHAT IT DOES NOT SHOW. The painters' languages, names and identities are unknown. Older writers read the figures as portraits of particular 'races' or of Egyptians, Cretans or other visitors; those readings rest on the categories of their time, not on anything in the art, and are not used here.",
    category: "archaeology",
    subcategory: MOORS_LANES.prehistoric,
    eventType: "archaeological_interpretation",
    eventTypeNote: "The art is abundant and secure; its dates are among the most disputed in African archaeology.",
    tags: laneTags("prehistoric", "rock-art", "tassili-n-ajjer", "tadrart-acacus", "messak", "pastoralism", "dairying", "green-sahara"),
    people: ["Savino di Lernia", "Marina Gallinaro", "Julie Dunne", "Richard P. Evershed"],
    civilisations: [],
    locationName: "Tassili n'Ajjer (Algeria), Tadrart Acacus and Messak Settafet (Libya)",
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Libya 5041 Petroglyphs Tadrart Acacus Luca Galuzzi 2007.jpg",
        caption:
          "Engraved elephants in the Tadrart Acacus, south-west Libya, photographed in 2007. Animals like these could not live in the present desert; the engravings belong to the wetter Sahara, though their exact age is not fixed.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "CC BY-SA 2.5",
        creator: "Luca Galuzzi",
        objectDate: "photographed 7 April 2007",
        pixelWidth: 2000,
        pixelHeight: 1333,
      }),
      commonsPicture({
        fileName: "Libya 5321 Meercatze (Gatti Mammoni) Petroglyphs Wadi Methkandoush Luca Galuzzi 2007.jpg",
        caption:
          "The engraving nicknamed 'Meercatze' by Leo Frobenius, in Wadi Methkandoush on the Messak plateau, Libya: large animal-headed figures among the Messak's thousands of engravings. Photographed in 2007; the date of the engraving is not established.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "CC BY-SA 2.5",
        creator: "Luca Galuzzi",
        objectDate: "photographed 7 April 2007",
        pixelWidth: 2000,
        pixelHeight: 1333,
      }),
      commonsPicture({
        fileName: "Fondazione Passaré V1 112.jpg",
        caption:
          "A masked female figure in the Round Head style at Sefar, Tassili n'Ajjer, Algeria, from the Fondazione Passaré archive. The file does not say whether this is a photograph or a documentary copy; the style attribution is the archive's.",
        shows: "evidence_photograph",
        identificationStatus: "probable",
        licence: "CC BY-SA 3.0",
        creator: "Alessandro Passaré",
        institution: "Fondazione Passaré",
        accessionNumber: "V1_112",
        pixelWidth: 584,
        pixelHeight: 899,
      }),
      commonsPicture({
        fileName: "Fondazione Passaré V31 502.jpg",
        caption:
          "Painted cattle from the Pastoral (Cattle Period) art of the Tassili n'Ajjer, Algeria, from the Fondazione Passaré archive — the kind of scene matched by the dairy residues found at Takarkori.",
        shows: "evidence_photograph",
        identificationStatus: "probable",
        licence: "CC BY-SA 3.0",
        creator: "Alessandro Passaré",
        institution: "Fondazione Passaré",
        accessionNumber: "V31_502",
        pixelWidth: 858,
        pixelHeight: 592,
      }),
    ],
    claims: [
      {
        sourceKey: "pre_dilernia2010",
        citations: [
          { sourceKey: "pre_dunne2012", relation: "context", note: "Independent excavated evidence that herders were milking cattle in the same region." },
          { sourceKey: "pre_wiki_pastoral", relation: "context", note: "Places the Pastoral engravings within the conventional style sequence." },
        ],
        startYear: ka(5.43),
        endYear: ka(5.15),
        datePrecision: "century",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "date_range",
        originalDateText: "about 5,430–5,150 years before present (Messak engraved stones in dated ceremonial platforms)",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        whatIsDated: "Pastoral-style cattle engravings on the Messak plateau",
        evidence:
          "Engraved stones built into excavated stone platforms with animal sacrifices, dated by radiocarbon from the platforms. A contextual date — the engravings are at least as old as the structures that incorporate them — and the authors allow that they may be earlier.",
      },
      {
        sourceKey: "pre_dunne2012",
        citations: [
          { sourceKey: "pre_dilernia2010", relation: "context", note: "Rock art of cattle on the Messak and in the Acacus is the iconographic counterpart to the residues." },
        ],
        startYear: bce(5000),
        endYear: bce(4000),
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "date_range",
        originalDateText: "fifth millennium BC (dairy residues in Takarkori pottery)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "Earliest dairying in the Green Sahara",
        evidence:
          "Milk-fat residues identified by lipid biomarkers and compound-specific carbon isotopes in potsherds from radiocarbon-dated Pastoral layers at Takarkori. Roughly 7,000–6,000 years ago.",
      },
      {
        sourceKey: "pre_unesco_acacus",
        citations: [
          { sourceKey: "pre_wiki_pastoral", relation: "context", note: "Describes the competing long and short chronologies and the circularity of both." },
          { sourceKey: "pre_dilernia2010", relation: "disputes", note: "Contextually dated Pastoral art is far younger than the start of this span; the oldest figure rests on style, not on dating." },
        ],
        startYear: bce(12000),
        endYear: 100,
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        originalDateText: "from about 12,000 BC to AD 100 (UNESCO description of the Tadrart Acacus art)",
        datingMethod: "stylistic_comparison",
        chronology: "disputed",
        whatIsDated: "Overall span of Tadrart Acacus rock art",
        evidence:
          "The span given in the official World Heritage description. Its early end reflects the 'long' chronology of the oldest styles, which is not established by direct dating.",
      },
    ],
  },

  // 9 -----------------------------------------------------------------------
  {
    slug: "neolithic-maghreb-farming-and-pottery",
    title: "The Neolithic Maghreb: first crops, Cardial pottery and the Oued Beht farmers",
    summary:
      "Domesticated lentils, wheat and barley and Cardium-impressed pottery appear in northern Morocco from about 7,600 years ago, carried in part by newcomers from Iberia; by 3400–2900 BCE Oued Beht was a large farming settlement.",
    description:
      "WHAT IT IS. The Neolithic — farming, herding and, here, pottery — reached the Mediterranean Maghreb in the mid-sixth millennium BCE. It did not arrive as a single package or a single people, and the region's own foragers took a large part in it.\n\n" +
      "THE FIRST CROPS AND POTS. At Ifri Oudadane, a rock shelter on the coast of north-east Morocco, Morales and colleagues (2013) found barley, several wheats, lentil and pea in the Early Neolithic levels; one lentil is directly radiocarbon-dated to 7,611 ± 37 cal BP (about 5660 BCE), the oldest directly dated domesticated plant in Morocco. Linstädter and Wagner (2013) date the first pottery phase there to 7,600–7,300 cal BP, its decoration dominated by impressions made with the edge of a cockle shell (Cardium) — the 'Cardial' style also found in eastern Iberia and southern France. At Kaf Taht el-Ghar near Tetouan, Cardial and other impressed pottery has been reported in contexts around 5400–5350 BCE, matching the brief's '5400 BCE' (a secondary report, not checked against the excavation publication here).\n\n" +
      "WHO BROUGHT IT. Ancient genomes (see the record on ancient Moroccan DNA) show the earliest Neolithic individuals in northern Morocco carrying mostly Iberian early-farmer ancestry, while others nearby, such as at Ifri n'Amr o Moussa, remained largely local foragers' descendants who adopted farming. Mediterranean contact and local uptake are both part of the story; later, Levantine-related herders added another strand.\n\n" +
      "OUED BEHT. Broodbank, Lucarini, Bokbot and colleagues (2024) identified a large farming settlement at Oued Beht in north-west Morocco, dated about 3400–2900 BCE, with many storage pits, pottery and stone tools — on their account the earliest and largest agricultural complex in Africa beyond the Nile corridor, and evidence that the Maghreb was an active participant in western Mediterranean later prehistory.\n\n" +
      "WHAT IT DOES NOT SHOW. 'Cardial' names a pottery style, not a people. Neither the pottery nor the genomes say what language these farmers spoke, and the spread of farming here cannot be read as the arrival of Amazigh (Berber) speech, which is first attested in writing thousands of years later.",
    category: "archaeology",
    subcategory: MOORS_LANES.prehistoric,
    eventType: "archaeological_interpretation",
    eventTypeNote: "Dated crops and pottery are secure; who introduced them is answered in part by ancient DNA.",
    tags: laneTags("prehistoric", "neolithic", "farming", "cardial-pottery", "ifri-oudadane", "kaf-taht-el-ghar", "oued-beht", "mediterranean-contact"),
    people: ["Jacob Morales", "Jörg Linstädter", "Cyprian Broodbank", "Giulio Lucarini", "Youssef Bokbot"],
    civilisations: ["Iberia"],
    locationName: "Northern Morocco (Ifri Oudadane, Kaf Taht el-Ghar, Oued Beht)",
    media: [
      commonsPicture({
        fileName: "Cerámica cardial-La Sarsa (España).jpg",
        caption:
          "A Cardial-decorated Neolithic bowl from the Tajos de Cacín cave near Granada, Spain. Comparison material from Iberia, not a Moroccan find: Early Neolithic pottery in northern Morocco carries the same cockle-shell impressions.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "Public domain",
        creator: "José-Manuel Benito Álvarez",
        pixelWidth: 834,
        pixelHeight: 834,
      }),
      commonsPicture({
        fileName: "Cardial map.png",
        caption:
          "A modern map of the spread of Cardial and impressed pottery around the western Mediterranean in the sixth and fifth millennia BCE. Drawn by a Commons user; northern Morocco is at the southern edge of the distribution.",
        shows: "map",
        identificationStatus: "probable",
        licence: "Public domain",
        creator: "José-Manuel Benito Álvarez",
        pixelWidth: 1044,
        pixelHeight: 657,
      }),
    ],
    claims: [
      {
        sourceKey: "pre_morales2013",
        citations: [
          { sourceKey: "pre_linstadter2013", relation: "supports", note: "Dates the first pottery phase at the same site to 7.6–7.3 thousand cal BP." },
          { sourceKey: "pre_simoes2023", relation: "context", note: "Genomes indicate farming was introduced in part by Iberian-related migrants." },
        ],
        startYear: ka(7.611),
        uncertaintyPlus: 37,
        uncertaintyMinus: 37,
        datePrecision: "decade",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "radiometric_date",
        originalDateText: "7,611 ± 37 cal BP (directly dated domesticated lentil, Ifri Oudadane)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "Earliest directly dated crop in Morocco",
        evidence:
          "Radiocarbon date on a single domesticated lentil seed from the Early Neolithic levels of Ifri Oudadane — about 5660 BCE.",
      },
      {
        sourceKey: "pre_linstadter2013",
        citations: [
          { sourceKey: "pre_morales2013", relation: "supports", note: "The domesticated crops from the same Early Neolithic levels." },
        ],
        startYear: ka(7.6),
        endYear: ka(7.3),
        datePrecision: "century",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "date_range",
        originalDateText: "7,600–7,300 cal BP (first pottery phase, Ifri Oudadane, Cardium impressions)",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        whatIsDated: "First Neolithic pottery phase in north-east Morocco",
        evidence:
          "Radiocarbon-dated layers of the first Early Neolithic phase at Ifri Oudadane, whose pottery is dominated by single Cardium-shell impressions — about 5650–5350 BCE.",
        notes: "The brief's '5400 BCE' sits at the younger end of this phase and matches dates reported for Kaf Taht el-Ghar.",
      },
      {
        sourceKey: "pre_broodbank2024",
        citations: [
          { sourceKey: "pre_fregel2018", relation: "context", note: "Late Neolithic genomes from Kelif el Boroud, of similar age, show mixed Iberian and local ancestry." },
        ],
        startYear: bce(3400),
        endYear: bce(2900),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        originalDateText: "c. 3400–2900 BC (Oued Beht farming complex)",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        whatIsDated: "Oued Beht farming settlement",
        evidence:
          "Radiocarbon dating of the pits and occupation at Oued Beht, a farming complex of the late fourth and early third millennia BCE, with numerous pits, pottery and lithics.",
      },
    ],
  },

  // 10 ----------------------------------------------------------------------
  {
    slug: "takarkori-ancient-genomes",
    title: "Takarkori, Libya: the first genomes from the Green Sahara",
    summary:
      "Two women buried about 7,000 years ago in a rock shelter in south-west Libya belonged mostly to a long-isolated North African lineage, related to the Taforalt foragers, with little sub-Saharan ancestry.",
    description:
      "WHAT IT IS. Takarkori is a rock shelter in the Tadrart Acacus mountains of south-west Libya, excavated for many years by the Italian–Libyan mission led by Savino di Lernia. During the humid period it was used by hunter-gatherers and then by Pastoral Neolithic herders; its deposits hold fish bones from vanished lakes, pottery with the earliest known African dairy residues, and burials. In 2025 Salem and colleagues published genome data from two of the buried women — the first ancient genomes from the Green Sahara.\n\n" +
      "HOW IT IS DATED. The two individuals are about 7,000 years old, from the Pastoral Neolithic. The brief's '5000 BCE' is consistent with this: 7,000 years before present is about 5050 BCE.\n\n" +
      "WHAT THE GENOMES SHOW. Most of their ancestry comes from a North African lineage not previously known, which separated from sub-Saharan African lineages around the time modern humans spread out of Africa (reported as about 50,000 years ago) and then stayed largely isolated. The same deep North African ancestry forms a large part of the 15,000-year-old Taforalt foragers of Morocco, who also carried Natufian-related ancestry from the Near East. They carry little sub-Saharan ancestry — so even a green Sahara was not a highway of gene flow — and only about a tenth of the Neanderthal ancestry of people outside Africa, more than contemporary sub-Saharan Africans. Because these women were herders yet their genomes show no sign of a large incoming farming or herding population, the authors infer that herding spread to them mainly by cultural exchange rather than by migration.\n\n" +
      "WHAT IT DOES NOT SHOW. Two individuals are a very small sample. The 'Takarkori lineage' is a statistical ancestry component, not a people, and says nothing about language. Nor does it show that the later Garamantes of the same region descended from these women; that link has not been tested genetically.",
    category: "science",
    subcategory: MOORS_LANES.prehistoric,
    eventType: "scientific_model",
    eventTypeNote: "Genomes from two dated individuals; the lineage and its split time are model-based.",
    tags: laneTags("prehistoric", "takarkori", "ancient-dna", "green-sahara", "pastoral-neolithic", "tadrart-acacus", "neanderthal-ancestry"),
    people: ["Nada Salem", "Savino di Lernia", "Johannes Krause"],
    civilisations: [],
    locationName: "Takarkori rock shelter, Tadrart Acacus, south-west Libya",
    identificationStatus: "secure",
    evidenceStatus: "verified_physical_remains",
    media: [
      commonsPicture({
        fileName: "Takakori Rock Shelter.jpg",
        caption:
          "The Takarkori rock shelter in the Tadrart Acacus, south-west Libya, seen from the south — the site of the two Pastoral Neolithic burials whose genomes were sequenced. Figure from an open-access 2020 study of the site.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY 4.0",
        creator: "Van Neer W, Alhaique F, Wouters W, Dierickx K, Gala M, Goffette Q, et al.",
        objectDate: "published 19 February 2020",
        pixelWidth: 1823,
        pixelHeight: 1364,
      }),
      commonsPicture({
        fileName: "Modelling of Takarkori.png",
        caption:
          "Admixture-graph model from the 2025 Takarkori genome study, showing how the Takarkori ancestry is fitted relative to Taforalt, Levantine and sub-Saharan reference populations. A statistical model, not a family tree of peoples.",
        shows: "scientific_figure",
        identificationStatus: "secure",
        licence: "CC BY 4.0",
        creator: "Nada Salem",
        objectDate: "2025",
        pixelWidth: 676,
        pixelHeight: 807,
      }),
    ],
    claims: [
      {
        sourceKey: "pre_salem2025",
        citations: [
          { sourceKey: "pre_dunne2012", relation: "context", note: "Dairy residues in Takarkori pottery show these people's community were herders." },
          { sourceKey: "pre_vanneer2020", relation: "context", note: "The aquatic fauna showing permanent water at the site during the humid period." },
        ],
        startYear: ka(7),
        datePrecision: "millennium",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "years_ago",
        originalDateText: "approximately 7,000 years ago (two Pastoral Neolithic women)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "The two Takarkori individuals",
        evidence:
          "Radiocarbon-dated Pastoral Neolithic burials at Takarkori, about 7,000 years old (about 5000 BCE).",
      },
      {
        sourceKey: "pre_salem2025",
        citations: [
          { sourceKey: "pre_vandeloosdrecht2018", relation: "supports", note: "The Taforalt genomes carry the same deep North African component, plus Natufian-related ancestry." },
        ],
        startYear: ka(50),
        datePrecision: "thousand_years",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "estimated_range",
        originalDateText: "about 50,000 years ago (estimated divergence of the North African lineage from sub-Saharan lineages)",
        datingMethod: "genetic",
        chronology: "scientific",
        whatIsDated: "Divergence of the North African ancestral lineage",
        evidence:
          "A model-based estimate from the genomes: the lineage that makes up most of the Takarkori ancestry separated from sub-Saharan African lineages around the time of the main out-of-Africa expansion, reported as about 50,000 years ago.",
        notes: "Dates a split between ancestral populations, not any event at Takarkori.",
      },
    ],
  },

  // 11 ----------------------------------------------------------------------
  {
    slug: "prehistoric-iberia-north-africa-crossings",
    title: "Across the Strait: prehistoric contact between Iberia and north-west Africa",
    summary:
      "Iberian farmers' ancestry in Neolithic Morocco from about 5400 BCE, African elephant ivory in Copper Age Iberia, and a few people of North African ancestry buried in Iberia by about 2500 BCE — real but limited crossings of a 14-kilometre strait.",
    description:
      "WHAT IT IS. The Strait of Gibraltar is about fourteen kilometres wide at its narrowest. Whether, when and how often prehistoric people crossed it has long been argued; since 2018 ancient DNA and materials science have turned much of that argument into evidence. This record collects the measured contacts. The separate, disputed claim of a large prehistoric African settlement of Iberia has its own record in the alternative-interpretations lane.\n\n" +
      "SOUTHWARD: FARMERS FROM IBERIA. The earliest Neolithic people sampled in northern Morocco carry mostly Iberian early-farmer ancestry (Simões et al. 2023), dated to about 7,400 years ago, roughly 5400 BCE; Cardial pottery like Iberia's appears in the same period. By the Late Neolithic, around 3000 BCE, people at Kelif el Boroud had about half Iberian-related ancestry (Fregel et al. 2018). This is the clearest prehistoric crossing, and it ran from north to south.\n\n" +
      "NORTHWARD: IVORY AND EXOTICA. Schuhmacher, Cardoso and Banerjee (2009) showed that much of the ivory in Chalcolithic and Beaker-period sites of Portugal came from African savannah elephants — then living in north-west Africa — and was concentrated near the coast, implying seaborne exchange in the first half of the third millennium BCE. Ostrich eggshell and other exotic materials point the same way; Beaker-style pottery is also reported from northern Morocco.\n\n" +
      "NORTHWARD: A FEW PEOPLE. Olalde and colleagues (2019), with genomes from 271 ancient Iberians, found sporadic contact with North Africa by about 2500 BCE, including a Copper Age individual from central Spain whose ancestry was entirely North African-related — but no lasting effect on the Iberian population until the Roman period and later. González-Fortes and colleagues (2019) found small African-related ancestry, and one sub-Saharan mitochondrial lineage, in individuals of around 4,000 years ago from Portugal and southern Spain.\n\n" +
      "WHAT IT DOES NOT SHOW. Neither direction amounts to a population replacement, and none of it concerns Moors: the people who crossed were Neolithic and Copper Age farmers and traders, millennia before the Latin word Mauri existed. Ancestry labels name genetic sources, not cultures or languages.",
    category: "archaeology",
    subcategory: MOORS_LANES.prehistoric,
    eventType: "archaeological_interpretation",
    eventTypeNote: "Several independent lines of evidence (genomes, ivory sourcing, pottery) for limited two-way contact.",
    tags: laneTags("prehistoric", "strait-of-gibraltar", "ancient-dna", "ivory", "chalcolithic", "bell-beaker", "iberia", "mediterranean-contact"),
    people: ["Thomas X. Schuhmacher", "João Luís Cardoso", "Iñigo Olalde", "Luciana G. Simões", "Rosa Fregel"],
    civilisations: ["Iberia"],
    locationName: "The Strait of Gibraltar, southern Iberia and northern Morocco",
    media: [
      commonsPicture({
        fileName: "The Strait of Gibraltar (iss071e414110).jpg",
        caption:
          "The Strait of Gibraltar photographed from the International Space Station in July 2024, Morocco on the left and Spain on the right — the narrow sea that prehistoric farmers, traders and ivory crossed.",
        shows: "site",
        identificationStatus: "secure",
        licence: "Public domain",
        creator: "NASA Johnson Space Center",
        institution: "NASA",
        accessionNumber: "iss071e414110",
        objectDate: "photographed 30 July 2024",
        pixelWidth: 8256,
        pixelHeight: 5504,
      }),
      commonsPicture({
        fileName: "Brazalete de marfil. Neolítico Final-Calcolítico. Museo Arqueológico Nacional de España.jpg",
        caption:
          "UNVERIFIED — an elephant-ivory bracelet of the Late Neolithic–Chalcolithic from Murcia, Spain, in the Museo Arqueológico Nacional, Madrid (inv. 1942/8982). Unverified: whether this particular bracelet is African ivory has not been checked; it shows the kind of ivory object whose sourcing to African elephants is discussed here.",
        shows: "museum_specimen",
        identificationStatus: "unverified",
        licence: "CC BY-SA 4.0",
        creator: "Dorieo",
        institution: "Museo Arqueológico Nacional de España",
        accessionNumber: "1942/8982",
        pixelWidth: 4000,
        pixelHeight: 2629,
      }),
      commonsPicture({
        fileName: "Bell Beaker Culture.png",
        caption:
          "A modern simplified map of the Bell Beaker culture's regional groups in the third millennium BCE, drawn by a Commons user. Context for the Beaker-period exchange; its treatment of North Africa is schematic.",
        shows: "map",
        identificationStatus: "possible",
        licence: "CC0",
        creator: "Maptist",
        pixelWidth: 3200,
        pixelHeight: 2741,
      }),
    ],
    claims: [
      {
        sourceKey: "pre_simoes2023",
        citations: [
          { sourceKey: "pre_fregel2018", relation: "supports", note: "Iberian-related Neolithic ancestry at Kelif el Boroud around 3000 BCE." },
          { sourceKey: "pre_linstadter2013", relation: "context", note: "Cardial pottery of Iberian type in north-east Morocco in the same centuries." },
        ],
        startYear: bce(5400),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        originalDateText: "from about 5400 BCE (Iberian early-farmer ancestry in the first Neolithic Moroccans)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "Southward crossing of Iberian farmers into Morocco",
        evidence:
          "Radiocarbon-dated earliest Neolithic burials in northern Morocco whose genomes are mostly Iberian early-farmer ancestry, about 7,400 years ago.",
      },
      {
        sourceKey: "pre_schuhmacher2009",
        citations: [
          { sourceKey: "pre_broodbank2024", relation: "context", note: "Oued Beht shows a substantial farming society on the Moroccan side in the centuries before." },
        ],
        startYear: bce(3000),
        endYear: bce(2500),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        originalDateText: "first half of the third millennium BC (African ivory in Chalcolithic Portugal)",
        datingMethod: "archaeological",
        chronology: "archaeological",
        whatIsDated: "Northward ivory exchange across the Strait",
        evidence:
          "Ivory objects from dated Chalcolithic and Beaker-period contexts in Portugal, identified by microscopy and spectroscopy as mostly African savannah elephant.",
      },
      {
        sourceKey: "pre_olalde2019",
        citations: [
          { sourceKey: "pre_gonzalezfortes2019", relation: "supports", note: "Independent evidence of African-related ancestry in Iberians of about 4,000 years ago." },
        ],
        startYear: bce(2500),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        originalDateText: "by about 2500 BCE (sporadic North African ancestry in Copper Age Iberia)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "Northward movement of individuals from North Africa into Iberia",
        evidence:
          "Radiocarbon-dated Iberian individuals with North African-related ancestry, among 271 ancient genomes; the contact left no lasting trace in the population before the Roman period.",
      },
      {
        sourceKey: "pre_gonzalezfortes2019",
        citations: [
          { sourceKey: "pre_olalde2019", relation: "context", note: "Places such contact in a larger Iberian sample, where it is sporadic." },
        ],
        startYear: ka(4),
        datePrecision: "millennium",
        isApproximate: true,
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "years_ago",
        originalDateText: "around 4,000 years before present (African-related ancestry in Portuguese and southern Spanish genomes)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "African-related ancestry in prehistoric western Iberia",
        evidence:
          "Whole genomes from four Middle Neolithic to Bronze Age individuals from northern Portugal and southern Spain, one with a sub-Saharan mitochondrial lineage and several with small African-related nuclear ancestry.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links — inside the section, to the other sections, and to records other
// datasets already seed. Each edge is written once; links are navigable both ways.
// ---------------------------------------------------------------------------

const links: SeedEventLink[] = [
  // inside the section
  { from: "pre-sapiens-occupation-of-morocco", to: "jebel-irhoud-early-homo-sapiens", relation: "precedes", note: "Older hominins and toolmakers lived in north-west Africa long before the first known Homo sapiens at Jebel Irhoud." },
  { from: "jebel-irhoud-early-homo-sapiens", to: "north-african-symbolic-behaviour", relation: "precedes", note: "The beads and bone tools of the North African Middle Stone Age were made by Homo sapiens populations of the kind first seen at Jebel Irhoud." },
  { from: "north-african-symbolic-behaviour", to: "aterian-industries", relation: "associated", note: "Many of the North African shell beads and bone tools come from layers attributed to the Aterian." },
  { from: "aterian-industries", to: "taforalt-iberomaurusian-burials", relation: "precedes", note: "Taforalt's sequence runs from Middle Stone Age (including Aterian) levels to the later Iberomaurusian cemetery." },
  { from: "taforalt-iberomaurusian-burials", to: "ancient-moroccan-dna-continuity-and-change", relation: "evidence_for", note: "The Taforalt genomes define the local Late Pleistocene ancestry whose persistence into the Neolithic the later studies trace." },
  { from: "taforalt-iberomaurusian-burials", to: "takarkori-ancient-genomes", relation: "related", note: "The Takarkori women's deep North African ancestry also forms a large part of the Taforalt foragers' ancestry." },
  { from: "green-sahara-humid-period", to: "saharan-rock-art-and-pastoralists", relation: "associated", note: "The humid Sahara is the world the rock art depicts and the herders lived in." },
  { from: "green-sahara-humid-period", to: "takarkori-ancient-genomes", relation: "associated", note: "Takarkori's people lived in the central Sahara during the humid period; their genomes test whether it was a corridor for gene flow." },
  { from: "saharan-rock-art-and-pastoralists", to: "takarkori-ancient-genomes", relation: "related", note: "Takarkori lies in the Tadrart Acacus rock-art region, and its pottery holds the dairy residues that match the Pastoral art." },
  { from: "neolithic-maghreb-farming-and-pottery", to: "ancient-moroccan-dna-continuity-and-change", relation: "related", note: "The genomes show who took part in the arrival of farming in Morocco: Iberian-related newcomers and local foragers' descendants." },
  { from: "neolithic-maghreb-farming-and-pottery", to: "prehistoric-iberia-north-africa-crossings", relation: "related", note: "Cardial pottery and Iberian farmer ancestry in Morocco are the earliest measurable crossing of the Strait." },
  { from: "ancient-moroccan-dna-continuity-and-change", to: "prehistoric-iberia-north-africa-crossings", relation: "evidence_for", note: "Iberian-related ancestry in Neolithic Moroccan genomes is direct evidence of prehistoric crossings." },

  // to records other datasets already seed
  { from: "pre-sapiens-occupation-of-morocco", to: "acheulean-technology-established", relation: "related", note: "The Casablanca and Tighennif handaxes are North Africa's part of the Acheulean tradition." },
  { from: "pre-sapiens-occupation-of-morocco", to: "multiple-archaic-human-populations", relation: "relevant", note: "The Grotte à Hominidés fossils are argued to be one of the African populations near the root of the Homo sapiens lineage." },
  { from: "pre-sapiens-occupation-of-morocco", to: "homo-heidelbergensis-populations", relation: "relevant", note: "The Thomas Quarry I hominins bear on which Middle Pleistocene populations led toward Homo sapiens." },
  { from: "jebel-irhoud-early-homo-sapiens", to: "qafzeh-early-homo-sapiens", relation: "related", note: "Jebel Irhoud is over 200,000 years older than the early Homo sapiens of Qafzeh in the Levant." },
  { from: "jebel-irhoud-early-homo-sapiens", to: "multiple-archaic-human-populations", relation: "related", note: "Jebel Irhoud is a key fossil for the view that Homo sapiens emerged across Africa among several coexisting populations." },
  { from: "north-african-symbolic-behaviour", to: "early-shell-beads-and-ornaments", relation: "part_of", note: "The North African bead finds (Bizmoune, Taforalt, Contrebandiers) are part of the wider early record of shell ornaments." },
  { from: "north-african-symbolic-behaviour", to: "middle-palaeolithic-ochre-use", relation: "related", note: "Some Taforalt beads were coated with red ochre, linking the two kinds of evidence." },
  { from: "aterian-industries", to: "qafzeh-early-homo-sapiens", relation: "relevant", note: "Whether Aterian-making populations were connected to early Homo sapiens outside Africa, such as at Qafzeh, is part of the debate about dispersals." },
  { from: "taforalt-iberomaurusian-burials", to: "qafzeh-and-skhul-burials", relation: "relevant", note: "Taforalt is one of the oldest cemeteries known; the Levantine burials are far older isolated graves, a useful contrast." },
  { from: "green-sahara-humid-period", to: "green-sahara-atlantis-window", relation: "related", note: "The same early-Holocene humid transition in North Africa, seen from another dataset." },

  // to other sections of this track
  { from: "taforalt-iberomaurusian-burials", to: "alt-iberomaurusian-ancestry", relation: "relevant", note: "The Taforalt genomes are the main evidence tested by the disputed claims about Iberomaurusian ancestry." },
  { from: "ancient-moroccan-dna-continuity-and-change", to: "alt-amazigh-population-origins", relation: "relevant", note: "Ancient genomes are often cited in claims about Amazigh origins; they bear on ancestry, not on language or identity." },
  { from: "takarkori-ancient-genomes", to: "garamantes-and-sub-saharan-africa", relation: "relevant", note: "Takarkori shows little sub-Saharan gene flow in the humid Sahara; the Garamantes record takes up contact across the later desert." },
  { from: "saharan-rock-art-and-pastoralists", to: "garamantes-emergence", relation: "precedes", note: "The Pastoral herders of the Fezzan and Acacus precede the Garamantes of the same region by thousands of years." },
  { from: "saharan-rock-art-and-pastoralists", to: "dromedary-in-north-africa", relation: "precedes", note: "The rock-art sequence ends with a Camel period, after the dromedary's arrival in North Africa." },
  { from: "neolithic-maghreb-farming-and-pottery", to: "amazigh-language-earliest-evidence", relation: "relevant", note: "Often linked to the origin of Amazigh languages, but genes and pottery are not language: the Neolithic evidence cannot say what anyone spoke." },
  { from: "neolithic-maghreb-farming-and-pottery", to: "ancient-north-african-burial-monuments", relation: "precedes", note: "The settled farming communities of the Neolithic Maghreb precede the protohistoric burial monuments of the region." },
  { from: "prehistoric-iberia-north-africa-crossings", to: "alt-prehistoric-african-settlement-of-iberia", relation: "relevant", note: "The measured, limited prehistoric crossings are the evidence against which the disputed claim of a large African settlement of Iberia is assessed." },
  { from: "prehistoric-iberia-north-africa-crossings", to: "phoenician-arrival-utica-lixus-gadir", relation: "precedes", note: "Crossings of the Strait were old long before Phoenician settlements on both its shores." },
];

export const PREHISTORY: MoorsSection = { sources, events, links };
