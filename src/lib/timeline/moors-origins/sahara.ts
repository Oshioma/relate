// THE SAHARA SECTION OF THE "ORIGINS OF THE MOORS" TRACK — the Garamantes of
// Fazzan, the oasis economy, the routes across the desert, Rome's expeditions
// into it, the dromedary, and the links south.
//
// HOW THIS SECTION WAS RESEARCHED. The ancient passages quoted here were read
// in public-domain translations on archive.org in this session (Godley's
// Herodotus, Bostock and Riley's Pliny, Fyfe's Tacitus, the Bohn Caesar, Yonge's
// Ammianus); every quotation is copied from those pages. The modern scholarship
// — the Fazzan Project and Desert Migrations Project volumes, the Trans-Saharan
// Archaeology series, the Libyan Studies papers — was identified and its
// bibliographic details and abstracts checked through publisher and repository
// records; their full texts could not be opened from this environment, so they
// are paraphrased, never quoted, and claims that rest on details not visible in
// those records are said to be unverified where they appear.
//
// NONE OF THE PEOPLE IN THESE RECORDS WERE "MOORS". The Garamantes were a
// Saharan people of Fazzan named by Greek and Roman writers; "Mauri" was a
// different name, for peoples of north-west Africa. Where these records reach
// the later Amazigh world they say so in their own words.

import type { SeedEvent, SeedSource, SeedEventLink } from "../seed-types";
import { MOORS_LANES, bce, commonsPicture, laneTags, type MoorsSection } from "./shared";

const LANE = "sahara" as const;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // ---- Ancient texts (read in this session on archive.org) ----------------
  {
    key: "sahara-herodotus-godley",
    title: "Herodotus, Histories, Book 4 (Melpomene), translated by A. D. Godley",
    author: "Herodotus (trans. A. D. Godley)",
    publisher: "William Heinemann / G. P. Putnam's Sons (Loeb Classical Library)",
    workTitle: "Herodotus, with an English translation by A. D. Godley, vol. 2 (Books 3–4)",
    reference: "Book 4, chapters 174 and 183–184 (Loeb vol. 2, pp. 377 and 386–387 in the 1921 printing)",
    url: "https://archive.org/details/herodotuswitheng02herouoft",
    sourceType: "primary",
    publishedYear: 1921,
    publishedDisplay: "written c. 430s–420s BCE; translation 1921",
    notes:
      "Cited for the earliest surviving mention of the Garamantes (4.174, a people 'in the wild beasts' country' who shun the society of men — a passage some editors and commentators take to refer to a different people, the Gamphasantes of Pliny) and for 4.183: the Garamantes as 'an exceeding great nation' who sow in soil laid on salt, and who hunt the 'cave-dwelling Ethiopians' in four-horse chariots. Quotations are from Godley's translation as read on archive.org.",
  },
  {
    key: "sahara-pliny-bostock",
    title: "Pliny the Elder, Natural History, Book 5, translated by John Bostock and H. T. Riley",
    author: "Pliny the Elder (trans. J. Bostock and H. T. Riley)",
    publisher: "Henry G. Bohn (Bohn's Classical Library), London",
    workTitle: "The Natural History of Pliny, vol. 1",
    reference: "Book 5, ch. 5 in Bostock's numbering = NH 5.33–38 in the modern section numbering (pp. 398–401 of vol. 1)",
    url: "https://archive.org/details/naturalhistoryof01plinuoft",
    sourceType: "primary",
    publishedYear: 1855,
    publishedDisplay: "written c. 77 CE; translation 1855",
    notes:
      "Cited for the Garamantes and Phazania (NH 5.34–36), Garama as 'that most famous capital of the Garamantes', the triumph of Cornelius Balbus with the list of peoples and places carried in it (5.36–37), the trade with the Troglodytae for the 'carbuncle' stone (5.34), and the Garamantes filling up wells with sand and the four-day short cut found during the war of Vespasian's early reign (5.38). Quotations from the Bostock–Riley translation as read on archive.org; Bostock's footnote dating Balbus' triumph to 19 BCE is also cited.",
  },
  {
    key: "sahara-tacitus-fyfe",
    title: "Tacitus, Histories, Book 4, translated by W. Hamilton Fyfe",
    author: "Tacitus (trans. W. H. Fyfe)",
    publisher: "Clarendon Press, Oxford",
    workTitle: "Tacitus, The Histories, Books III–V",
    reference: "Histories 4.50 (Fyfe, vol. 2, p. 158)",
    url: "https://archive.org/details/fyfe-histories.-book-iii-v-1912-en",
    sourceType: "primary",
    publishedYear: 1912,
    publishedDisplay: "written c. 100–110 CE; translation 1912",
    notes:
      "Cited for the campaign of the legate Valerius Festus in 69/70 CE: Oea calls in the Garamantes against Lepcis, Roman auxiliaries rout them and recover the booty 'except what the nomads had already sold among the inaccessible hut-settlements of the far interior'. Quotation from Fyfe's translation as read on archive.org.",
  },
  {
    key: "sahara-ptolemy-berggren-jones",
    title: "Ptolemy's Geography: An Annotated Translation of the Theoretical Chapters",
    author: "J. Lennart Berggren and Alexander Jones",
    publisher: "Princeton University Press",
    workTitle: "Ptolemy, Geography, Book 1",
    reference: "Geography 1.8.4–7 (Ptolemy's criticism of Marinus of Tyre on the journeys of Septimius Flaccus and Julius Maternus); ISBN 0-691-01042-0",
    sourceType: "academic_book",
    publishedYear: 2000,
    publishedDisplay: "Ptolemy wrote c. 150 CE; translation 2000",
    notes:
      "Cited for Ptolemy's report, taken from Marinus of Tyre, that Septimius Flaccus reached the 'Ethiopians' three months' travel south from the Garamantes, and that Julius Maternus, setting out from Lepcis Magna and Garama with the king of the Garamantes, reached Agisymba, 'the country of the Ethiopians' where rhinoceroses gather, after four months — and for Ptolemy's own judgement that the distances were exaggerated. Paraphrased here; the translation itself was not read in this session.",
  },
  {
    key: "sahara-wikipedia-agisymba",
    title: "Agisymba",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Agisymba",
    sourceType: "wikipedia",
    publishedYear: 2024,
    publishedDisplay: "accessed 2026",
    notes:
      "Extra, never sole, support for the conventional dating of Julius Maternus' journey to about 90 CE and for Marinus of Tyre writing c. 107–115 CE; used only beside Ptolemy and the modern scholarship. Its identification of Agisymba with the Lake Chad region is unsourced on the page and is not adopted here.",
  },
  {
    key: "sahara-bellum-africum-bohn",
    title: "[Caesar], The African War (Bellum Africum), in Caesar's Commentaries, translated by W. A. McDevitte and W. S. Bohn",
    author: "Anonymous continuator of Caesar (trans. McDevitte and Bohn)",
    publisher: "Henry G. Bohn, London",
    workTitle: "Caesar's Commentaries on the Gallic and Civil Wars, with the supplementary books … including the Alexandrian, African and Spanish Wars",
    reference: "Bellum Africum 68",
    url: "https://archive.org/details/csarscommentari00bohngoog",
    sourceType: "primary",
    publishedYear: 1853,
    publishedDisplay: "written c. 46–40s BCE; translation 1853",
    notes:
      "Cited for the capture at Zeta in 46 BCE of 'twenty-two camels, belonging to king Juba' — one of the earliest securely dated mentions of camels in the Maghreb. Quotation from the Bohn translation as read on archive.org.",
  },
  {
    key: "sahara-ammianus-yonge",
    title: "Ammianus Marcellinus, The Roman History, translated by C. D. Yonge",
    author: "Ammianus Marcellinus (trans. C. D. Yonge)",
    publisher: "Henry G. Bohn, London",
    workTitle: "The Roman History of Ammianus Marcellinus during the reigns of the emperors Constantius, Julian, Jovianus, Valentinian, and Valens",
    reference: "Book 28, ch. 6, §§ 2–6",
    url: "https://archive.org/details/romanhistoryofam00ammiiala",
    sourceType: "primary",
    publishedYear: 1862,
    publishedDisplay: "written c. 390 CE; translation 1862",
    notes:
      "Cited for Count Romanus refusing to march to the relief of Lepcis in the 360s CE unless the city supplied 'four thousand camels' — evidence that camels existed in Tripolitania in numbers by the later fourth century. Quotation from Yonge's translation as read on archive.org.",
  },

  // ---- Fazzan Project / Desert Migrations Project ----------------------------
  {
    key: "sahara-fazzan-vol1",
    title: "The Archaeology of Fazzān, Volume 1: Synthesis",
    author: "David J. Mattingly (ed.)",
    publisher: "Society for Libyan Studies / Department of Antiquities, Tripoli (Society for Libyan Studies Monograph 5)",
    reference: "London, 2003; open access via DOAB/OAPEN",
    url: "https://directory.doabooks.org/handle/20.500.12854/81770",
    sourceType: "academic_book",
    publishedYear: 2003,
    publishedDisplay: "2003",
    notes:
      "Cited as the standard synthesis of Fazzan's archaeology and of the Garamantian sequence: the emergence of a Garamantian polity in the Wadi al-Ajal over the first millennium BCE, its oasis settlement and irrigation, and its long decline in late antiquity. Paraphrased; the full text was not opened in this session.",
  },
  {
    key: "sahara-wilson-mattingly-2003",
    title: "Irrigation technologies: foggaras, wells and field systems",
    author: "Andrew Wilson and David J. Mattingly",
    publisher: "Society for Libyan Studies",
    workTitle: "The Archaeology of Fazzān, Volume 1: Synthesis (ed. D. J. Mattingly)",
    reference: "pp. 235–278",
    sourceType: "academic_paper",
    publishedYear: 2003,
    publishedDisplay: "2003",
    notes:
      "Cited for the survey of the Wadi al-Ajal foggaras (underground channels, comparable to Iranian qanats), the wells and field systems, and for the stratigraphic argument that some foggaras are older than Garamantian settlements of the first to fourth centuries CE built over their spoil mounds.",
  },
  {
    key: "sahara-fazzan-vol3",
    title: "The Archaeology of Fazzān, Volume 3: Excavations carried out by C. M. Daniels",
    author: "David J. Mattingly (ed.), with C. M. Daniels, J. N. Dore, D. Edwards and J. Hawthorne",
    publisher: "Society for Libyan Studies / Department of Antiquities, Tripoli (Society for Libyan Studies Monograph 8)",
    reference: "London, 2010; includes J. Hawthorne et al., 'Zinkekra: an Early Garamantian escarpment settlement and associated sites'",
    url: "https://library.oapen.org/bitstream/20.500.12657/54108/1/external_content.pdf",
    sourceType: "academic_book",
    publishedYear: 2010,
    publishedDisplay: "2010",
    notes:
      "Cited for Charles Daniels' excavations of the 1960s–70s, including the hillfort of Zinkekra as an Early Garamantian escarpment settlement, the Garamantian cemeteries, and the first excavated evidence at Jarma. Paraphrased; the full text was not opened in this session.",
  },
  {
    key: "sahara-fazzan-vol4",
    title: "The Archaeology of Fazzān, Volume 4: Survey and Excavations at Old Jarma (Ancient Garama) carried out by C. M. Daniels (1962–69) and the Fazzān Project (1997–2001)",
    author: "David J. Mattingly (ed.)",
    publisher: "Society for Libyan Studies / Department of Antiquities, Tripoli (Society for Libyan Studies Monograph 9)",
    reference: "London, 2013",
    url: "https://library.oapen.org/handle/20.500.12657/54098",
    sourceType: "academic_book",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for Old Jarma as ancient Garama: a sequence of about ten major construction phases running from c. 400 BCE to the 1930s, the stone-footed Garamantian buildings at the heart of the site exposed by Ayoub's excavations of 1962–65, and the Classic Garamantian town of the first centuries CE. Paraphrased from the published descriptions of the volume.",
  },
  {
    key: "sahara-daniels-1970",
    title: "The Garamantes of Southern Libya",
    author: "Charles Daniels",
    publisher: "The Oleander Press, Harrow / Stoughton (Wisconsin)",
    reference: "47 pp., 14 plates, 10 figures; ISBN 0902675044",
    sourceType: "academic_book",
    publishedYear: 1970,
    publishedDisplay: "1970",
    notes:
      "Cited as the first modern archaeological overview of the Garamantes, written from Daniels' own excavations at Zinkekra, Jarma and the cemeteries; context for how the Garamantes came to be known archaeologically rather than only through Herodotus and Pliny.",
  },
  {
    key: "sahara-vanderveen-1992",
    title: "Garamantian agriculture: the plant remains from Zinchecra, Fezzan",
    author: "Marijke van der Veen",
    publisher: "Society for Libyan Studies",
    workTitle: "Libyan Studies",
    reference: "Libyan Studies 23 (1992), pp. 7–39",
    sourceType: "academic_paper",
    publishedYear: 1992,
    publishedDisplay: "1992",
    notes:
      "Cited for the radiocarbon dating of the Zinkekra (Zinchecra) hillfort's plant assemblage to 900–400 cal BC by eleven dates, and for the identification there of three cereal crops and three fruit crops — a well-developed farming regime in the early first millennium BCE.",
  },
  {
    key: "sahara-pelling-2008",
    title: "Garamantian agriculture: the plant remains from Jarma, Fazzān",
    author: "Ruth Pelling",
    publisher: "Society for Libyan Studies / Cambridge University Press",
    workTitle: "Libyan Studies",
    reference: "Libyan Studies 39 (2008), pp. 41–71",
    url: "https://www.cambridge.org/core/journals/libyan-studies/article/garamantian-agriculture-the-plant-remains-from-jarma-fazzan/213F38CDB809C47624A0A6952F42833A",
    sourceType: "academic_paper",
    publishedYear: 2008,
    publishedDisplay: "2008",
    notes:
      "Cited for the long sequence of charred and desiccated plant remains from Jarma: a broad range of cereal, fruit and fibre crops showing both winter and summer cultivation from the end of the first millennium BCE, and a sophisticated irrigated regime that the author ties to foggara irrigation.",
  },
  {
    key: "sahara-pelling-2007-thesis",
    title: "Agriculture and trade amongst the Garamantes and the Fezzanese: 3000 years of archaeobotanical data from the Sahara and its margins",
    author: "Ruth Pelling",
    publisher: "University College London (PhD thesis)",
    url: "https://discovery.ucl.ac.uk/1445977/",
    sourceType: "academic_paper",
    publishedYear: 2007,
    publishedDisplay: "2007",
    notes:
      "Cited for the archaeobotanical database behind the Fazzan crop sequence, including the Mediterranean and Near Eastern crops (emmer wheat, barley, grape, fig, date) already present at Zinkekra and the later arrival of African summer crops such as pearl millet and sorghum, and for the wider North African comparison.",
  },
  {
    key: "sahara-mattingly-sterry-2013",
    title: "The first towns in the central Sahara",
    author: "David J. Mattingly and Martin Sterry",
    publisher: "Antiquity Publications / Cambridge University Press",
    workTitle: "Antiquity",
    reference: "Antiquity 87 (2013), pp. 503–518",
    url: "https://www.cambridge.org/core/product/4288B3F3E753BBA5F22AD39019FB5994",
    sourceType: "academic_paper",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for the argument that Garama and other Garamantian oasis centres were genuine towns — the first urban communities of the central Sahara — and for their chronology in the first millennium BCE and first centuries CE.",
  },
  {
    key: "sahara-sterry-mattingly-2013-ams",
    title: "Desert Migrations Project XVII: further AMS dates for historic settlements from Fazzan, south-west Libya",
    author: "Martin Sterry and David J. Mattingly",
    publisher: "Society for Libyan Studies / Cambridge University Press",
    workTitle: "Libyan Studies",
    reference: "Libyan Studies 44 (2013)",
    url: "https://figshare.le.ac.uk/articles/journal_contribution/Desert_migrations_project_XVII_Further_AMS_dates_for_historic_settlements_from_Fazzan_South-West_Libya/10150016",
    sourceType: "academic_paper",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for 25 new AMS radiocarbon dates confirming numerous fortified villages and castle-like buildings in two of Fazzan's main oasis belts during the Garamantian period, mainly the third to sixth centuries CE.",
  },
  {
    key: "sahara-mattingly-2011-royal-cemetery",
    title: "DMP XII: excavations and survey of the so-called Garamantian Royal Cemetery (GSC030-031)",
    author: "David Mattingly, Hafed Abduli, Muftah Ahmed al-Haddad, Franca Cole, Corisande Fenwick, Brooklynne Fothergill, Mireya González Rodriguez, Matthew Hobson, Nadia Khalaf, Marta Lahr, Farès Moussa, Efthymia Nikita, Julia Nikolaus, Anita Radini, Nick Ray, Toby Savage, Martin Sterry and Andrew Wilson",
    publisher: "Society for Libyan Studies / Cambridge University Press",
    workTitle: "Libyan Studies",
    reference: "Libyan Studies 42 (2011), pp. 89–102",
    url: "https://pure.ulster.ac.uk/en/publications/dmp-xii-excavations-and-survey-of-the-so-called-garamantian-royal/",
    sourceType: "academic_paper",
    publishedYear: 2011,
    publishedDisplay: "2011",
    notes:
      "Cited for the monumental stepped tombs of the so-called Royal Cemetery below the Jarma escarpment, their stelae and offering tables, and for earlier dating evidence placing them in the fourth to sixth centuries CE.",
  },

  // ---- Foggaras and water ----------------------------------------------------
  {
    key: "sahara-wilson-2006",
    title: "The spread of foggara-based irrigation in the ancient Sahara",
    author: "Andrew Wilson",
    publisher: "Society for Libyan Studies (Monograph 6)",
    workTitle: "The Libyan Desert: Natural Resources and Cultural Heritage (ed. D. Mattingly, S. McLaren, E. Savage, Y. al-Fasatwi and K. Gadgood)",
    reference: "London, 2006, pp. 205–216",
    url: "https://www.academia.edu/435222/The_spread_of_foggara_based_irrigation_in_the_ancient_Sahara",
    sourceType: "academic_paper",
    publishedYear: 2006,
    publishedDisplay: "2006",
    notes:
      "Cited for the dating of the Wadi al-Ajal foggaras to the last centuries BCE and early centuries CE, with use into the early Middle Ages, and for Wilson's argument that the technique reached Fazzan from Egypt's Western Desert in the second half of the first millennium BCE (rejecting the older view that it arrived with Romans or Arabs).",
  },
  {
    key: "sahara-sterry-mattingly-wilson-2022",
    title: "Foggaras and the Garamantes: hydraulic landscapes in the central Sahara",
    author: "Martin Sterry, David J. Mattingly and Andrew Wilson",
    publisher: "Institute for the Study of Ancient Cultures (Oriental Institute), University of Chicago",
    workTitle: "Irrigation in Early States: New Directions (ed. Stephanie Rost), Oriental Institute Seminars 13",
    reference: "Chicago, 2022, ch. 3, pp. 41–61",
    url: "https://isac.uchicago.edu/node/4652",
    sourceType: "academic_paper",
    publishedYear: 2022,
    publishedDisplay: "2022",
    notes:
      "Cited for the hundreds of foggaras recorded in Fazzan, for radiocarbon dating that places their use from c. 400 BCE to c. 700 CE, and for the question whether falling water tables and failing foggaras contributed to the decline of Garamantian power.",
  },
  {
    key: "sahara-wilson-mattingly-sterry-2020",
    title: "The diffusion of irrigation technologies in the Sahara in antiquity: settlement, trade and migration",
    author: "Andrew Wilson, David J. Mattingly and Martin Sterry",
    publisher: "Cambridge University Press",
    workTitle: "Mobile Technologies in the Ancient Sahara and Beyond (ed. C. N. Duckworth, A. Cuénod and D. J. Mattingly), Trans-Saharan Archaeology 4",
    reference: "Cambridge, 2020; volume DOI 10.1017/9781108908047",
    url: "https://doi.org/10.1017/9781108908047",
    sourceType: "academic_paper",
    publishedYear: 2020,
    publishedDisplay: "2020",
    notes:
      "Cited for new AMS dating of Garamantian foggaras, the survey of foggara distribution beyond the Garamantian core, and the point that many Saharan oases grew large on wells and artesian springs rather than foggaras.",
  },
  {
    key: "sahara-drake-2004",
    title: "Water table decline, springline desiccation and the early development of irrigated agriculture in the Wadi al-Ajal, Libyan Fazzan",
    author: "N. A. Drake, A. I. Wilson, R. Pelling, K. White, D. J. Mattingly and S. Black",
    publisher: "University of Reading (CentAUR record)",
    reference: "2004; journal details as in the CentAUR record (full text not archived there)",
    url: "https://centaur.reading.ac.uk/3485/",
    sourceType: "academic_paper",
    publishedYear: 2004,
    publishedDisplay: "2004",
    notes:
      "Cited for the argument that the water table under the Wadi al-Ajal fell during the Holocene, drying the springs along the escarpment and pushing farmers toward ever-deeper irrigation — the long-term hydrological background to the foggaras and to Garamantian decline.",
  },

  // ---- Trade ------------------------------------------------------------------
  {
    key: "sahara-trade-2017",
    title: "Trade in the Ancient Sahara and Beyond",
    author: "D. J. Mattingly, V. Leitch, C. N. Duckworth, A. Cuénod, M. Sterry and F. Cole (eds)",
    publisher: "Cambridge University Press (Trans-Saharan Archaeology 1)",
    reference: "Cambridge, 2017; DOI 10.1017/9781108161091",
    url: "https://doi.org/10.1017/9781108161091",
    sourceType: "academic_book",
    publishedYear: 2017,
    publishedDisplay: "2017",
    notes:
      "Cited for the current reassessment of pre-Islamic trans-Saharan trade: the evidence of beads, textiles, metalwork and glass; the Garamantes as the central Saharan hub; and the caution that many key commodities (gold, ivory, slaves, textiles) are largely invisible archaeologically.",
  },
  {
    key: "sahara-wilson-2017-exports",
    title: "Saharan exports to the Roman world",
    author: "Andrew Wilson",
    publisher: "Cambridge University Press",
    workTitle: "Trade in the Ancient Sahara and Beyond (ed. D. J. Mattingly et al.), Trans-Saharan Archaeology 1",
    reference: "Cambridge, 2017, ch. 7 (begins p. 189)",
    url: "https://doi.org/10.1017/9781108161091",
    sourceType: "academic_paper",
    publishedYear: 2017,
    publishedDisplay: "2017",
    notes:
      "Cited for what the Roman world plausibly received from and through the Sahara — precious stones, wild animals, ivory, slaves and other goods — and for how weak the direct evidence for each is.",
  },
  {
    key: "sahara-wilson-2012-azania",
    title: "Saharan trade in the Roman period: short-, medium- and long-distance trade networks",
    author: "Andrew Wilson",
    publisher: "Taylor & Francis",
    workTitle: "Azania: Archaeological Research in Africa",
    reference: "Azania 47.4 (2012), pp. 409–449",
    sourceType: "academic_paper",
    publishedYear: 2012,
    publishedDisplay: "2012",
    notes:
      "Cited for the distinction between short-, medium- and long-distance Saharan exchange in the Roman period, and for the argument that the Garamantes were the organising power of central Saharan trade with the Mediterranean.",
  },
  {
    key: "sahara-law-1967",
    title: "The Garamantes and trans-Saharan enterprise in classical times",
    author: "R. C. C. Law",
    publisher: "Cambridge University Press",
    workTitle: "Journal of African History",
    reference: "Journal of African History 8.2 (1967)",
    url: "https://resolve.cambridge.org/core/journals/journal-of-african-history/article/garamantes-and-transsaharan-enterprise-in-classical-times/29DD85464FCA6778C39823DAEF028385",
    sourceType: "academic_paper",
    publishedYear: 1967,
    publishedDisplay: "1967",
    notes:
      "Cited for the older synthesis that trade is attested by imported Roman material in Fazzan tombs from the late first to the fourth centuries CE, and that Rome took ivory and slaves from or through the Garamantes.",
  },
  {
    key: "sahara-fentress-2011",
    title: "Slavers on chariots",
    author: "Elizabeth Fentress",
    publisher: "The British Museum (Research Publication 176)",
    workTitle: "Money, Trade and Trade Routes in Pre-Islamic North Africa (ed. A. Dowler and E. R. Galvin)",
    reference: "London, 2011, beginning p. 65",
    url: "https://edisciplinas.usp.br/pluginfile.php/4849002/mod_resource/content/1/Slavers%20on%20Chariots.pdf",
    sourceType: "academic_paper",
    publishedYear: 2011,
    publishedDisplay: "2011",
    notes:
      "Cited for the hypothesis that the Garamantes were slavers supplying the Roman world, built on Herodotus' chariot-hunt (4.183) and on a model of Rome letting outsiders do its slaving; used as a hypothesis, not a finding.",
  },

  // ---- People, bodies, genes -------------------------------------------------
  {
    key: "sahara-nikita-2012",
    title: "Sahara: barrier or corridor? Nonmetric cranial traits and biological affinities of North African late Holocene populations",
    author: "Efthymia Nikita, David Mattingly and Marta Mirazón Lahr",
    publisher: "Wiley",
    workTitle: "American Journal of Physical Anthropology",
    reference: "American Journal of Physical Anthropology 147.2 (2012), pp. 280–292",
    sourceType: "scientific_study",
    publishedYear: 2012,
    publishedDisplay: "2012",
    notes:
      "Cited for the finding that Garamantian crania from Fazzan show distant affinities to contemporaneous North African groups, which the authors read as the central Sahara acting partly as a barrier, and for the absence of a uniform pattern of gene flow across North Africa.",
  },
  {
    key: "sahara-power-2019",
    title: "Human mobility and identity: variation, diet and migration in relation to the Garamantes of Fazzan",
    author: "Ronika K. Power et al.",
    publisher: "Cambridge University Press",
    workTitle: "Burials, Migration and Identity in the Ancient Sahara and Beyond (ed. M. C. Gatto, D. J. Mattingly, N. Ray and M. Sterry), Trans-Saharan Archaeology 2",
    reference: "Cambridge, 2019, ch. 4; volume DOI 10.1017/9781108634311",
    url: "https://doi.org/10.1017/9781108634311",
    sourceType: "scientific_study",
    publishedYear: 2019,
    publishedDisplay: "2019",
    notes:
      "Cited for the Trans-SAHARA Project's biocultural study of the Wadi al-Ajal burials: cranial morphometrics and stable isotopes used to ask about biological links to earlier and neighbouring peoples and about diet and individual mobility; in particular mostly C3 (wheat/barley-type) diets in the first millennium BCE against mostly C4 (millet/sorghum-type) diets later at Watwat. Paraphrased from the chapter abstract and a published review.",
  },
  {
    key: "sahara-aja-review-2020",
    title: "Review of Gatto, Mattingly, Ray and Sterry (eds), Burials, Migration and Identity in the Ancient Sahara and Beyond",
    author: "American Journal of Archaeology (book review)",
    publisher: "Archaeological Institute of America",
    workTitle: "American Journal of Archaeology 124.4 (October 2020)",
    url: "https://ajaonline.org/book-review/4157/",
    sourceType: "secondary",
    publishedYear: 2020,
    publishedDisplay: "2020",
    notes:
      "Cited for its summary of the Power et al. chapter: the shift from C3 to C4 diets in the Wadi al-Ajal and the point that, because sorghum and pearl millet had become common by the second century CE, the shift could reflect either a change in local diet or incoming people — the data do not settle which.",
  },
  {
    key: "sahara-ottoni-2008-thesis",
    title: "Tracing the maternal origins of the Libyan Tuareg (doctoral thesis)",
    author: "Claudio Ottoni",
    publisher: "Università di Roma Tor Vergata",
    url: "https://art.torvergata.it/handle/2108/646",
    sourceType: "academic_paper",
    publishedYear: 2008,
    publishedDisplay: "2008",
    notes:
      "Cited for the attempt to test the Garamantes and prehistoric central Saharan pastoralists as ancestors of the Libyan Tuareg with ancient mitochondrial DNA, and for the result that the ancient bones yielded too little usable DNA (probably because of burial heat), so the analysis could be done only on living people.",
  },
  {
    key: "sahara-ottoni-2010",
    title: "Mitochondrial haplogroup H1 in North Africa: an early Holocene arrival from Iberia",
    author: "Claudio Ottoni et al.",
    publisher: "Public Library of Science",
    workTitle: "PLoS ONE",
    reference: "PLoS ONE 5.10 (2010), e13378; DOI 10.1371/journal.pone.0013378",
    url: "https://doi.org/10.1371/journal.pone.0013378",
    sourceType: "scientific_study",
    publishedYear: 2010,
    publishedDisplay: "2010",
    notes:
      "Cited for the maternal genetics of present-day Tuareg of the Fazzan (Al Awaynat and Tahala), among whom haplogroup H1 reaches about 61%, with lineages estimated to have arrived in North Africa c. 8,000–9,000 years ago — evidence about living people's deep ancestry, not about the Garamantes directly.",
  },
  {
    key: "sahara-ottoni-2011",
    title: "Deep into the roots of the Libyan Tuareg: a genetic survey of their paternal heritage",
    author: "C. Ottoni, M. Larmuseau, N. Vanderheyden, C. Martínez-Labarga, G. Primativo, G. Biondi, R. Decorte and O. Rickards",
    publisher: "Wiley",
    workTitle: "American Journal of Physical Anthropology",
    reference: "American Journal of Physical Anthropology 145.1 (2011), pp. 118–124; DOI 10.1002/ajpa.21473",
    url: "https://doi.org/10.1002/ajpa.21473",
    sourceType: "scientific_study",
    publishedYear: 2011,
    publishedDisplay: "2011",
    notes:
      "Cited for the Y-chromosome make-up of 47 Fazzan Tuareg men: mainly the north-west African E-M81 lineage, plus a notable south-Saharan contribution (E-U175) that the authors suggest may be recent, through slavery or fusion between groups; and for strong drift between the two villages.",
  },

  // ---- Camels -------------------------------------------------------------------
  {
    key: "sahara-bulliet-1975",
    title: "The Camel and the Wheel",
    author: "Richard W. Bulliet",
    publisher: "Harvard University Press",
    reference: "Cambridge, Mass., 1975",
    sourceType: "academic_book",
    publishedYear: 1975,
    publishedDisplay: "1975",
    notes:
      "Cited for the long history of camel use from its South Arabian beginnings to North Africa, the argument from saddle and harness design, and the thesis that in North Africa and the Middle East pack and riding camels came to replace wheeled transport.",
  },
  {
    key: "sahara-shaw-1979",
    title: "The camel in ancient North Africa and the Sahara: history, biology and human economy",
    author: "Brent D. Shaw",
    publisher: "Institut Fondamental d'Afrique Noire, Dakar",
    workTitle: "Bulletin de l'IFAN, série B, 41.4",
    reference: "Bulletin de l'IFAN sér. B 41.4 (1979, published 1981), pp. 663–721; reprinted in Shaw, Environment and Society in Roman North Africa (Variorum, 1995)",
    url: "https://bshaw.scholar.princeton.edu/document/6",
    sourceType: "academic_paper",
    publishedYear: 1981,
    publishedDisplay: "dated 1979, published 1981",
    notes:
      "Cited for the critical review of the textual, artistic and archaeological evidence for the dromedary in North Africa, against older claims that Rome 'introduced' the camel, and for the camel's slow spread and growing economic importance in the Roman centuries.",
  },
  {
    key: "sahara-merrills-2023",
    title: "War, Rebellion and Epic in Byzantine North Africa: A Historical Study of Corippus' Iohannis",
    author: "Andy Merrills",
    publisher: "Cambridge University Press",
    reference: "Cambridge, 2023; index: 'camel(s) used as defensive barricades', pp. 197–199 (Battle of the Campi Catonis, 548 CE)",
    sourceType: "academic_book",
    publishedYear: 2023,
    publishedDisplay: "2023",
    notes:
      "Cited for Corippus' description of Moorish forces in the 540s CE ringing their camp with camels as a barricade, and for Merrills' caution that the poem's ethnic names (Laguatan, Austur) may hide much more fluid affiliations than the labels suggest.",
  },

  // ---- Rock art ------------------------------------------------------------------
  {
    key: "sahara-lhote-1982",
    title: "Les chars rupestres sahariens: des Syrtes au Niger, par le pays des Garamantes et des Atlantes",
    author: "Henri Lhote",
    publisher: "Éditions des Hespérides",
    reference: "1982",
    url: "https://zenon.dainst.org/Record/000000713",
    sourceType: "academic_book",
    publishedYear: 1982,
    publishedDisplay: "1982",
    notes:
      "Cited as the classic corpus behind the idea of 'chariot routes' across the Sahara 'through the land of the Garamantes' — an interpretation of rock paintings and engravings of horse-drawn chariots that later scholars have heavily qualified.",
  },
  {
    key: "sahara-dupuy-2019",
    title: "À propos des chars rupestres sahariens : « Rendre à César ce qui appartient à César »",
    author: "Christian Dupuy",
    publisher: "HAL (halshs-02307820)",
    reference: "2019",
    url: "https://halshs.archives-ouvertes.fr/halshs-02307820",
    sourceType: "academic_paper",
    publishedYear: 2019,
    publishedDisplay: "2019",
    notes:
      "Cited for a modern reassessment of Saharan chariot rock art and of the inferences — chariot routes, Garamantian authorship — drawn from it; used as the counterweight to Lhote.",
  },
];

// ---------------------------------------------------------------------------
// Pictures — every file checked with commons.py `info` in this session
// ---------------------------------------------------------------------------

const PIC = {
  garamaRuins: commonsPicture({
    fileName: "Garma (Garama) - Ruinen der antiken Stadt Garama.jpg",
    caption:
      "The mudbrick ruins of Old Germa (Jarma) in the Wadi al-Ajal, the site identified with Garama. What stands above ground is mostly the later, medieval and early-modern town; the Garamantian levels lie beneath and around it.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Franzfoto",
    objectDate: "photographed November 2010",
    pixelWidth: 4000,
    pixelHeight: 2346,
  }),
  garamaRuins02: commonsPicture({
    fileName: "Garma (Garama) - Ruinen der antiken Stadt Garma 02.jpg",
    caption:
      "Another view across the ruined mudbrick houses of Old Germa. The upstanding walls belong mainly to the post-Garamantian town that grew on the same mound — a reminder that Garama was occupied, rebuilt and re-occupied for some 2,300 years.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Franzfoto",
    objectDate: "photographed November 2010",
    pixelWidth: 3322,
    pixelHeight: 2991,
  }),
  garamaAerial: commonsPicture({
    fileName: "أطلال مدينة جرما في ليبيا.jpg",
    caption:
      "Aerial view of the ruins of Old Germa (ancient Garama), showing the compact walled mudbrick town on its mound in the oasis of the Wadi al-Ajal.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 2.0",
    creator: "Katy Tzaralunga",
    objectDate: "photographed c. 2015",
    pixelWidth: 800,
    pixelHeight: 531,
  }),
  germaCasbah: commonsPicture({
    fileName: "Germa casbah.jpg",
    caption:
      "The medieval casbah at Germa, photographed in 2002. It is NOT a Garamantian building: it is shown because it stands on the Garama mound, and because the long afterlife of the site is part of why the Garamantian town is hard to excavate.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.5",
    creator: "DavidThomas71 (English Wikipedia)",
    objectDate: "photographed January 2002",
    pixelWidth: 300,
    pixelHeight: 229,
  }),
  garamantianTombs: commonsPicture({
    fileName: "Germa - Garamantengräber.jpg",
    caption:
      "UNVERIFIED — Stone and mudbrick tombs near Germa photographed in 2010 and labelled 'Garamantian graves' on the file page. The photograph shows funerary monuments in the Germa area; which cemetery they belong to, and their date, are not stated and could not be checked.",
    shows: "site",
    identificationStatus: "unverified",
    licence: "CC BY-SA 3.0",
    creator: "Franzfoto",
    objectDate: "photographed November 2010",
    pixelWidth: 3991,
    pixelHeight: 2215,
  }),
  garamantesMap: commonsPicture({
    fileName: "Garamantların yaşadığı coğrafya.jpg",
    caption:
      "A modern map of the region in which the Garamantes lived, centred on Fazzan in south-west Libya. A modern drawing: its boundaries are an interpretation, not a surveyed frontier — the Garamantes' reach varied over a thousand years and is known only patchily.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "CC BY-SA 3.0",
    creator: "Mızrak",
    pixelWidth: 519,
    pixelHeight: 250,
  }),
  zlitenBeasts: commonsPicture({
    fileName: "Beasts and criminals from the Zliten mosaic.jpg",
    caption:
      "UNVERIFIED — Detail of the Roman amphitheatre mosaic from the villa of Dar Buc Ammera at Zliten, Tripolitania, showing condemned prisoners bound to stakes and exposed to wild beasts. The identification of these prisoners as Garamantes captured in Rome's wars with them is a modern interpretation; the mosaic carries no label saying so, and its date (Commons gives c. AD 200; scholars have proposed dates from the 1st to the 3rd century) is also uncertain.",
    shows: "artefact",
    identificationStatus: "unverified",
    licence: "Public domain",
    institution: "National Museum, Tripoli (Assaraya al-Hamra)",
    objectDate: "c. AD 200 (Commons); date debated",
    pixelWidth: 750,
    pixelHeight: 270,
  }),
  foggaraTala: commonsPicture({
    fileName: "Foggara in Tala.jpg",
    caption:
      "A foggara at Tala in Algeria, photographed in 2025 — NOT a Garamantian foggara. It is shown for comparison: the Algerian foggaras of Touat and Gourara are still used and show what the abandoned Fazzan channels, now visible mainly as lines of shaft-mounds, once delivered.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 4.0",
    creator: "Bernard Gagnon",
    objectDate: "photographed 2025",
    pixelWidth: 3564,
    pixelHeight: 2268,
  }),
  foggaraWeir: commonsPicture({
    fileName: "Foggara 02.jpg",
    caption:
      "Water being shared out through a distribution weir at the outlet of a modern foggara in Algeria — NOT Garamantian. Shown as a comparison for how foggara water is divided between fields and owners; how the Garamantes divided theirs is not known.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Taguelmoust (French Wikipedia)",
    pixelWidth: 402,
    pixelHeight: 269,
  }),
  qanatDiagram: commonsPicture({
    fileName: "Qanat cross section cc0.svg",
    caption:
      "A modern diagram of a qanat in cross-section: a gently sloping tunnel driven into the water-bearing layer, with vertical access shafts, bringing groundwater out to the surface by gravity. Fazzan's foggaras work on the same principle; the drawing is generic, not of any Garamantian channel.",
    shows: "diagram",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Samuel Bailey",
    pixelWidth: 718,
    pixelHeight: 443,
  }),
  garamantenEngravings: commonsPicture({
    fileName: "Garamanten.jpg",
    caption:
      "UNVERIFIED — Rock engravings photographed in Libya in 1999 and labelled 'Garamantian stone engravings' by the photographer. The picture shows pecked figures on a rock face; neither the exact site nor the attribution to the Garamantes is documented on the file page, and Saharan engravings are notoriously hard to date or assign to a people.",
    shows: "artefact",
    identificationStatus: "unverified",
    licence: "Copyrighted free use",
    creator: "Martin Emch",
    objectDate: "photographed October 1999",
    pixelWidth: 3103,
    pixelHeight: 1783,
  }),
  foggaraLibya: commonsPicture({
    fileName: "Foggara 01.jpg",
    caption:
      "UNVERIFIED — The outlet of a foggara, described by its uploader as being in Libya. Where exactly it is, whether it is in Fazzan, and how old it is are not stated on the file page; it is shown because it is what a foggara looks like where the underground channel reaches the surface, not as a dated Garamantian channel.",
    shows: "site",
    identificationStatus: "unverified",
    licence: "CC BY-SA 3.0",
    creator: "Taguelmoust (French Wikipedia)",
    pixelWidth: 1280,
    pixelHeight: 960,
  }),
  ainManawir: commonsPicture({
    fileName: "AinManawirQanat.jpg",
    caption:
      "A qanat at Ain Manawir in Kharga Oasis, in Egypt's Western Desert. Channels of this kind in the Egyptian oases, dug from the Persian period on, are the precedent Andrew Wilson proposes for the Garamantian foggaras; the photograph is of the Egyptian site, not of Fazzan.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Roland Unger",
    objectDate: "photographed 2006",
    pixelWidth: 800,
    pixelHeight: 600,
  }),
  hattiaPyramids: commonsPicture({
    fileName: "The Pyramids of Ubari-Hattia Libya by UN HABITAT 2018.jpg",
    caption:
      "UNVERIFIED — Small mudbrick and stone 'pyramid' tombs at Hattia (al-Hatiya) near Ubari in the Wadi al-Ajal, from a UN-Habitat city profile. Pyramid tombs of this kind in the Wadi al-Ajal are attributed to the Garamantian period, but the file gives no archaeological identification or date for these particular monuments.",
    shows: "site",
    identificationStatus: "unverified",
    licence: "CC BY-SA 4.0",
    creator: "UN-Habitat",
    pixelWidth: 1136,
    pixelHeight: 840,
  }),
  datePalmsGabrun: commonsPicture({
    fileName: "Alfejej - Oase Gabrun, Dattelpalmen.jpg",
    caption:
      "Date palms at the Gaberoun oasis in Fazzan, photographed in 2010. A present-day oasis, shown as context: the date palm was one of the Garamantes' staple crops from the earliest levels at Zinkekra onward.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Franzfoto",
    objectDate: "photographed November 2010",
    pixelWidth: 4000,
    pixelHeight: 3000,
  }),
  pearlMillet: commonsPicture({
    fileName: "Pearl millet (8668023718).jpg",
    caption:
      "A present-day local variety of pearl millet in northern Mozambique, with long bristles that deter birds. Pearl millet is a summer cereal domesticated in the West African Sahel; it is shown as the crop itself, not as Garamantian evidence — the Garamantian grains survive only as charred and desiccated seeds.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.0",
    creator: "Ton Rulkens",
    objectDate: "photographed 2013",
    pixelWidth: 1426,
    pixelHeight: 2138,
  }),
  sorghumSeeds: commonsPicture({
    fileName: "Sorghum bicolor noir MHNT.BOT.2016.12.2.jpg",
    caption:
      "Seeds of a modern dark-grained sorghum (Sorghum bicolor) from the botanical collection of the Muséum de Toulouse. Sorghum, domesticated in the eastern Sahel, is one of the African summer crops that appear in Garamantian fields; these are modern seeds, for comparison.",
    shows: "museum_specimen",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Roger Culos",
    institution: "Muséum de Toulouse",
    accessionNumber: "MHNT.BOT.2016.12.2",
    pixelWidth: 5184,
    pixelHeight: 3456,
  }),
  africanCotton: commonsPicture({
    fileName: "Gossypium herbaceum subsp. africanum S-2354.jpg",
    caption:
      "Wild African cotton (Gossypium herbaceum subsp. africanum) in southern Mozambique, its capsules opening to release cottony seeds. Shown as the plant group from which Old World cultivated cotton derives; whether Garamantian cotton was this species or the Asian G. arboreum is not settled here.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "SAplants",
    objectDate: "photographed 2002",
    pixelWidth: 3328,
    pixelHeight: 4992,
  }),
  dromedaries: commonsPicture({
    fileName: "Dromedarioak.jpg",
    caption:
      "Dromedaries (Camelus dromedarius) in the Tunisian Sahara, photographed in 2008. Present-day animals, shown for the species: the one-humped camel that spread slowly across North Africa in the Roman centuries.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "FAL",
    creator: "Joxerra Aihartza",
    objectDate: "photographed 2008",
    pixelWidth: 1680,
    pixelHeight: 1120,
  }),
  tassiliCamels: commonsPicture({
    fileName: "Tassili camellos.png",
    caption:
      "A modern rendering, by a 21st-century artist, of a Tassili n'Ajjer (Algeria) rock painting showing a camel rider and other figures. Camel images belong to the latest phase of Saharan rock art; they cannot be closely dated, and this one is not tied to any dated layer.",
    shows: "later_artwork",
    identificationStatus: "possible",
    licence: "Public domain",
    creator: "José-Manuel Benito Álvarez",
    pixelWidth: 994,
    pixelHeight: 640,
  }),
  bunburyPtolemy: commonsPicture({
    fileName: "Bunbury Vol 2 Map 10 Africa Ptolemy p 632.jpg",
    caption:
      "North-western Africa as reconstructed from Ptolemy's Geography, a 19th-century map from E. H. Bunbury's History of Ancient Geography (1879). It is a modern drawing of how Ptolemy's coordinates place peoples and places such as the Garamantes — useful for seeing how Roman-period geographers imagined the interior, not as a map of where those peoples lived.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "Public domain",
    creator: "Edward Bunbury",
    objectDate: "published 1879",
    pixelWidth: 2437,
    pixelHeight: 1702,
  }),
  africaPtolemy1920: commonsPicture({
    fileName: "AFRICA ACCORDING TO PTOLEMY, A . D . 150.png",
    caption:
      "'Africa according to Ptolemy, A.D. 150', an early-20th-century map published in F. B. Pearce's Zanzibar (1920). A later reconstruction of the whole continent as Ptolemy described it, including the vague southern interior where he placed Agisymba.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "Public domain",
    creator: "Francis Barrow Pearce",
    objectDate: "published 1920",
    pixelWidth: 1267,
    pixelHeight: 886,
  }),
  buNjem: commonsPicture({
    fileName: "Castra Gholaia - Bu Njem, Porta praetoria - view into the fort.jpg",
    caption:
      "The Roman fort of Gholaia (Bu Njem) on the desert frontier of Tripolitania, a third-century CE outpost of the Limes Tripolitanus. Later than the expeditions in this record, it shows the next stage: a fortified frontier and road watching the routes to the Garamantes rather than marching to them.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 1.0",
    creator: "Marco Prins",
    objectDate: "photographed 2008",
    pixelWidth: 1181,
    pixelHeight: 783,
  }),
  ghadames: commonsPicture({
    fileName: "Libya 4432 Ghadames Luca Galuzzi 2007.jpg",
    caption:
      "The old town of Ghadames, ancient Cydamus, the first place named in Balbus' triumph. The mudbrick town in the photograph (2007) is medieval and later; it is shown for the oasis whose Roman name Pliny records, not for any building of Balbus' time.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.5",
    creator: "Luca Galuzzi",
    objectDate: "photographed 2007",
    pixelWidth: 2000,
    pixelHeight: 1333,
  }),
  ubariSandSea: commonsPicture({
    fileName: "Libya 4709 Idehan Ubari Luca Galuzzi 2007.jpg",
    caption:
      "Dunes of the Ubari sand sea (Idehan Ubari) in Fazzan, which borders the Wadi al-Ajal on the north. A present-day landscape photograph, shown to make the setting plain: the Garamantian oases were green strips between sand sea and escarpment, watered from below the ground.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.5",
    creator: "Luca Galuzzi",
    objectDate: "photographed 2007",
    pixelWidth: 2000,
    pixelHeight: 1333,
  }),
};

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

const events: SeedEvent[] = [
  // -------------------------------------------------------------------------
  {
    slug: "garamantes-emergence",
    title: "The Garamantes emerge in Fazzan",
    summary:
      "From hillfort villages on the Wadi al-Ajal escarpment in the early first millennium BCE, a Saharan people the Greeks called Garamantes grew into the central Sahara's first state.",
    description:
      "WHAT IT IS. The Garamantes are the people Greek and Roman writers placed in Fazzan, the oasis country of south-west Libya. Archaeology — Charles Daniels' excavations from the 1960s and the Fazzan and Desert Migrations Projects led by David Mattingly since 1997 — has turned them from a name in Herodotus into a sequence: hilltop villages on the escarpment above the Wadi al-Ajal, then a lowland town at Garama (Old Jarma), irrigated oases, cemeteries of tens of thousands of tombs, and a polity that dominated the central Sahara for most of a millennium.\n\n" +
      "HOW IT IS DATED. The earliest well-dated Garamantian settlement is the hillfort of Zinkekra (Zinchecra), whose plant remains were dated by eleven radiocarbon measurements to 900–400 cal BC. The research target given for this record — Zinkekra 'c. 1000 BCE' — is slightly early on that evidence: c. 900 BCE is the defensible start, and 1000 BCE is a round figure for the opening of the Early Garamantian phase that the radiocarbon series does not itself reach. The first written mention is Herodotus, who finished his Histories in the 430s–420s BCE. The '500 BCE' in the record's working title is a reasonable round date for the move from scattered hill villages towards a regional power, but it is a modern phase boundary, not an event: no source records a founding.\n\n" +
      "WHERE THE ACCOUNTS DISAGREE. Herodotus mentions Garamantes twice. At 4.174 they are a people 'in the wild beasts' country' who shun human company and have no weapons; at 4.183 they are 'an exceeding great nation' of farmers with chariots. Many commentators think the first passage is about a different people (Pliny's Gamphasantes) and that the name crept in by confusion. So the earliest text already shows how thin and second-hand Greek knowledge of the Sahara was.\n\n" +
      "WHO THEY WERE. The Garamantes were a Saharan people, not 'Moors': Mauri was a different name for peoples of north-west Africa, attested later and far to the west. They are often described as ancestors of some later Amazigh (Berber) groups, and a Libyco-Berber-type script was used in Fazzan, but their language is not directly recorded, and population ancestry, language and political identity have to be argued separately (see the record on the Garamantes and sub-Saharan Africa).\n\n" +
      "WHAT IT DOES NOT SHOW. The Garamantian state did not grow in a vacuum: it sits on thousands of years of Saharan pastoralism and on a landscape drying since the end of the African Humid Period. Their wealth came from irrigated farming and from controlling routes — both covered in separate records.",
    category: "civilisation",
    subcategory: MOORS_LANES.sahara,
    eventType: "archaeological_interpretation",
    eventTypeNote:
      "A state-formation process reconstructed from excavation and radiocarbon dating; the date in the working title is a modern phase boundary.",
    tags: laneTags(LANE, "garamantes", "fazzan", "zinkekra", "herodotus", "state-formation", "wadi-al-ajal"),
    people: ["Herodotus", "Charles Daniels", "David Mattingly"],
    civilisations: ["Garamantes", "Ancient Greece"],
    locationName: "Wadi al-Ajal, Fazzan, south-west Libya",
    media: [PIC.garamaRuins, PIC.garamantesMap, PIC.ubariSandSea, PIC.garamantenEngravings],
    claims: [
      {
        sourceKey: "sahara-fazzan-vol1",
        citations: [
          { sourceKey: "sahara-mattingly-sterry-2013", relation: "supports", note: "Sets out the move from hill villages to the first Saharan towns over the first millennium BCE." },
          { sourceKey: "sahara-daniels-1970", relation: "context", note: "The first archaeological overview, on which the later phase scheme was built." },
          { sourceKey: "sahara-herodotus-godley", relation: "context", note: "Shows a 'great nation' of Garamantes was known by name in the Greek world by the mid-fifth century BCE." },
        ],
        startYear: bce(500),
        endYear: 1,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "c. 500 BCE to the turn of the era: the Garamantes become a regional power",
        datingMethod: "archaeological",
        chronology: "conventional",
        temporalClaimType: "estimated_range",
        whatIsDated: "The growth of a Garamantian polity in the Wadi al-Ajal",
        evidence:
          "A modern phase boundary from the Fazzan Project's synthesis: by the second half of the first millennium BCE settlement shifts from escarpment hillforts to the oasis floor, Garama is founded (c. 400 BCE), and irrigation and long-distance contacts expand. It dates a process, not a founding event.",
      },
      {
        sourceKey: "sahara-vanderveen-1992",
        citations: [
          { sourceKey: "sahara-fazzan-vol3", relation: "supports", note: "Publishes Zinkekra as an Early Garamantian escarpment settlement from Daniels' excavations." },
          { sourceKey: "sahara-pelling-2007-thesis", relation: "context", note: "Places the Zinkekra crops in the wider Fazzan archaeobotanical sequence." },
        ],
        startYear: bce(900),
        endYear: bce(400),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "900–400 cal BC (eleven radiocarbon dates, Zinkekra)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        temporalClaimType: "radiometric_date",
        whatIsDated: "Occupation and farming at the Zinkekra hillfort",
        evidence:
          "Eleven radiocarbon dates on the plant assemblage from Zinkekra. The user's research target gave 'c. 1000 BCE'; on this series 900 BCE is the earliest defensible start, so the record uses it and notes the correction.",
      },
      {
        sourceKey: "sahara-herodotus-godley",
        citations: [
          { sourceKey: "sahara-fazzan-vol1", relation: "context", note: "Discusses how far Herodotus' Garamantes can be matched to the archaeology of Fazzan." },
          { sourceKey: "sahara-pliny-bostock", relation: "context", note: "Pliny later names the Gamphasantes, the people many commentators think Herodotus 4.174 really describes." },
        ],
        startYear: bce(440),
        endYear: bce(425),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Herodotus 4.183: 'men dwell there called Garamantes, an exceeding great nation'",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first surviving written mention of the Garamantes",
        evidence:
          "The date is the composition of the Histories (completed in the 430s–420s BCE), not of any Garamantian event. Herodotus describes the Libyan interior by days' journeys between salt hills and springs, from informants he does not name.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: "garamantian-foggara-irrigation",
    title: "Garamantian foggara irrigation",
    summary:
      "Underground channels (foggaras) tapped the groundwater of the Wadi al-Ajal; they are dated mainly to the last centuries BCE and the first half of the first millennium CE, not to 400–300 BCE.",
    description:
      "WHAT IT IS. A foggara is a gently sloping tunnel dug into a water-bearing layer and led out to the surface, with a line of vertical shafts for digging and maintenance — the same principle as the Iranian qanat. Hundreds have been recorded in Fazzan, especially along the Wadi al-Ajal, where their shaft-mounds still run in long lines across the desert from the escarpment to the old fields.\n\n" +
      "HOW IT IS DATED — AND THE CORRECTION. The research target for this record was '400–300 BCE'. The evidence does not support that as the date of the foggaras' introduction. Andrew Wilson's work for the Fazzan Project dates the Wadi al-Ajal foggaras to the last centuries BCE and the early centuries CE, with use continuing into the early Middle Ages; at Fjayj a Garamantian settlement with pottery of the first to fourth centuries CE overlies a foggara's spoil, so that foggara is older. Wilson's summary is that they were probably introduced by the final few centuries BCE and certainly before the fourth century CE. Newer radiocarbon dating gives a range of use of c. 400 BCE to c. 700 CE — and it is this range, the span of the Garamantian heyday, that appears to lie behind the '400 BCE' figure. A range of use is not a date of first construction, so this record dates the introduction to the last centuries BCE and lists the 400 BCE–700 CE span separately.\n\n" +
      "WHERE IT CAME FROM. Wilson argues the technique reached Fazzan from Egypt's Western Desert, where qanat-type channels were dug in the Persian period, sometime in the second half of the first millennium BCE — overturning an older view that Romans or Arabs brought it. That route is a well-argued hypothesis, not a demonstrated transfer.\n\n" +
      "WHAT IT DOES NOT SHOW. Garamantian farming did not begin with foggaras. The earliest fields at Zinkekra (900–400 cal BC) were watered from springs along the escarpment and shallow wells, and many Saharan oases grew large on wells and artesian springs with no foggaras at all. Foggaras were an answer to a falling water table: they reached water that the springs no longer delivered, and they could not be extended forever — which is why their failure is one of the explanations offered for Garamantian decline.\n\n" +
      "ABOUT THE PICTURES. Foggaras still working today are mostly in Algeria (Touat, Gourara, Tidikelt) and are not Garamantian; any such picture is labelled as a comparison.",
    category: "technology",
    subcategory: MOORS_LANES.sahara,
    eventType: "archaeological_interpretation",
    eventTypeNote:
      "The user's 400–300 BCE target is corrected: the introduction is dated to the last centuries BCE, and 400 BCE–700 CE is the radiocarbon span of use.",
    tags: laneTags(LANE, "garamantes", "foggara", "qanat", "irrigation", "groundwater", "fazzan"),
    people: ["Andrew Wilson", "David Mattingly", "Martin Sterry"],
    civilisations: ["Garamantes"],
    locationName: "Wadi al-Ajal, Fazzan, south-west Libya",
    media: [PIC.qanatDiagram, PIC.foggaraLibya, PIC.ainManawir, PIC.foggaraTala, PIC.foggaraWeir],
    claims: [
      {
        sourceKey: "sahara-wilson-2006",
        citations: [
          { sourceKey: "sahara-wilson-mattingly-2003", relation: "supports", note: "The field survey and stratigraphic evidence (settlements of the 1st–4th c. CE over foggara spoil) behind the dating." },
          { sourceKey: "sahara-wilson-mattingly-sterry-2020", relation: "supports", note: "Presents new AMS dates for Garamantian foggaras and their spread." },
          { sourceKey: "sahara-pelling-2008", relation: "context", note: "Ties the summer-and-winter cropping at Jarma to a foggara-irrigated regime." },
        ],
        startYear: bce(300),
        endYear: 300,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "probably introduced by the final few centuries BC, certainly before the 4th century AD",
        datingMethod: "archaeological",
        chronology: "conventional",
        temporalClaimType: "estimated_range",
        whatIsDated: "Introduction of foggaras in the Wadi al-Ajal",
        evidence:
          "Stratigraphy (settlements of the first to fourth centuries CE built over foggara spoil heaps), associated pottery, and radiocarbon dating. Corrects the 400–300 BCE target: no evidence cited by the excavators places the first foggaras that early.",
      },
      {
        sourceKey: "sahara-sterry-mattingly-wilson-2022",
        citations: [
          { sourceKey: "sahara-wilson-mattingly-sterry-2020", relation: "supports", note: "The AMS dating programme on which the range rests." },
        ],
        startYear: bce(400),
        endYear: 700,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "in use from c. 400 B.C. to A.D. 700 (radiocarbon)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        temporalClaimType: "date_range",
        whatIsDated: "The span over which the Fazzan foggaras were in use",
        evidence:
          "Radiocarbon dates from foggaras and associated sites, matching the Garamantian heyday. A span of use; read on its own it can look like a construction date of 400 BCE, which is probably how the research target arose.",
      },
      {
        sourceKey: "sahara-wilson-2006",
        citations: [
          { sourceKey: "sahara-wilson-mattingly-sterry-2020", relation: "context", note: "Reviews the distribution of foggaras beyond the Garamantian core and whether it reflects Garamantian influence." },
        ],
        startYear: bce(500),
        endYear: bce(1),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "transmitted from Egypt in the second half of the first millennium BC",
        datingMethod: "estimate",
        chronology: "hypothesis",
        temporalClaimType: "proposed_correlation",
        whatIsDated: "Proposed transfer of qanat technology from Egypt's Western Desert to Fazzan",
        evidence:
          "An argument from the Persian-period qanats of the Egyptian oases and from the Fazzan dates; a plausible route, not a documented one.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: "garama-capital-germa",
    title: "Garama (Old Jarma), the Garamantian capital",
    summary:
      "Garama, under the mudbrick ruins of Old Jarma in the Wadi al-Ajal, was occupied from about 400 BCE and was a walled town with stone-footed public buildings by the first centuries CE.",
    description:
      "WHAT IT IS. Old Jarma (Germa) in the Wadi al-Ajal is identified with Garama, which Pliny called 'that most famous capital of the Garamantes'. The site is a mound of superimposed towns: the excavators recognise about ten major building phases from c. 400 BCE to the 1930s, when the old town was finally abandoned for the modern village beside it. Most of what a visitor sees — mudbrick houses, the casbah — belongs to the later towns.\n\n" +
      "WHAT HAS BEEN FOUND. Excavations by Muhammad Ayoub (1962–65), Charles Daniels (1960s) and the Fazzan Project (1997–2001) exposed, at the heart of the site, a series of Garamantian buildings on stone footings, including a substantial building often described as a temple, and evidence of the Classic Garamantian town of roughly the first to fourth centuries CE. Mattingly and Sterry argue that Garama and other oasis centres were genuine towns — dense, planned, walled, with craft production — and so the first towns of the central Sahara. Around Jarma lie very large Garamantian cemeteries: shaft and chamber tombs, mudbrick 'pyramid' tombs and, below the escarpment, the so-called Royal Cemetery of monumental stepped tombs with stelae and offering tables, earlier dated to the fourth to sixth centuries CE and re-excavated in 2011.\n\n" +
      "HOW IT IS DATED. Pottery, imported Roman objects and radiocarbon. Some details often repeated about the town — exact phase dates of particular buildings, the function of the 'temple' — rest on the excavation volume, which could not be read in full here and should be checked there.\n\n" +
      "WHAT IT DOES NOT SHOW. Garama was a capital in the Roman writers' sense, but nothing tells us how Garamantian kings ruled, what they called their state, or what language was spoken in the town. Its imported Roman goods show contact, not Roman rule: Roman armies reached Garama, but Fazzan was never a province.",
    category: "archaeology",
    subcategory: MOORS_LANES.sahara,
    eventType: "archaeological_interpretation",
    tags: laneTags(LANE, "garamantes", "garama", "germa", "jarma", "urbanism", "pyramid-tombs", "fazzan"),
    people: ["Charles Daniels", "David Mattingly", "Martin Sterry", "Pliny the Elder"],
    civilisations: ["Garamantes", "Roman Empire"],
    locationName: "Old Jarma (Germa), Wadi al-Ajal, Fazzan, Libya",
    lat: 26.55,
    lng: 13.07,
    identificationStatus: "secure",
    media: [PIC.garamaAerial, PIC.garamaRuins02, PIC.hattiaPyramids, PIC.garamantianTombs, PIC.germaCasbah],
    claims: [
      {
        sourceKey: "sahara-fazzan-vol4",
        citations: [
          { sourceKey: "sahara-mattingly-sterry-2013", relation: "supports", note: "Argues Garama was a true town of the first centuries CE and places it in a wider urban network." },
          { sourceKey: "sahara-sterry-mattingly-2013-ams", relation: "context", note: "AMS dates for other fortified Garamantian settlements, mainly 3rd–6th centuries CE." },
        ],
        startYear: 1,
        endYear: 400,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "1st–4th centuries AD: the Classic Garamantian town",
        datingMethod: "archaeological",
        chronology: "conventional",
        temporalClaimType: "archaeological_date",
        whatIsDated: "Garama at its height",
        evidence:
          "Stratified buildings with Roman imports and radiocarbon dates. The phase is a modern grouping.",
      },
      {
        sourceKey: "sahara-fazzan-vol4",
        citations: [
          { sourceKey: "sahara-fazzan-vol3", relation: "supports", note: "Daniels' earlier excavations at Jarma, republished with the Fazzan Project results." },
        ],
        startYear: bce(400),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "c. 400 BC: earliest of ten major construction phases at Old Jarma",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "archaeological_date",
        whatIsDated: "Earliest occupation of the Garama mound",
        evidence:
          "The lowest excavated deposits in the deep sequence at Old Jarma; the date is approximate and comes from the excavators' phasing.",
      },
      {
        sourceKey: "sahara-pliny-bostock",
        citations: [
          { sourceKey: "sahara-fazzan-vol1", relation: "supports", note: "Accepts the identification of Pliny's Garama with Old Jarma." },
        ],
        startYear: bce(19),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Garama too, that most famous capital of the Garamantes",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Garama named among the places in Balbus' triumph",
        evidence:
          "Pliny (NH 5.36), writing c. 77 CE, says Garama was among the places carried in the triumph of Cornelius Balbus, which Bostock's note dates to 19 BCE. The year is of the triumph, not of the town's foundation.",
      },
      {
        sourceKey: "sahara-mattingly-2011-royal-cemetery",
        citations: [
          { sourceKey: "sahara-fazzan-vol3", relation: "context", note: "Daniels' earlier work on the Garamantian cemeteries of the Wadi al-Ajal." },
        ],
        startYear: 300,
        endYear: 600,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "previous dating evidence: 4th–6th centuries AD (Royal Cemetery)",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "archaeological_date",
        whatIsDated: "The monumental stepped tombs of the so-called Royal Cemetery",
        evidence:
          "Dating evidence summarised before the 2011 excavations, which were designed to test it; 'royal' is a modern label for the largest tombs, not an inscription.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: "garamantian-oasis-agriculture",
    title: "Garamantian oasis agriculture",
    summary:
      "Garamantian farmers grew Mediterranean winter crops and dates from the early first millennium BCE and later added African summer crops — pearl millet, sorghum and cotton — on fossil groundwater that eventually ran down.",
    description:
      "WHAT IT IS. The Garamantes were above all oasis farmers. Desiccated and charred plant remains from Zinkekra and Jarma make Fazzan one of the best-documented ancient farming landscapes in Africa.\n\n" +
      "THE CROPS. At Zinkekra (900–400 cal BC) the farmers already grew three cereals and three fruits — emmer wheat, barley, grape, fig and the date palm among them: a crop package of Near Eastern, Mediterranean and Egyptian origin, watered from escarpment springs. At Jarma, from the end of the first millennium BCE, Pelling found a broad range of cereal, fruit and fibre crops showing cultivation in both winter and summer. Summer cropping is the significant change: it is when the African crops domesticated in the Sahel — pearl millet and sorghum — appear, and cotton is reported among the fibre crops. By the second century CE sorghum and pearl millet were common in the Wadi al-Ajal. The research target named cotton 'at Jarma'; that cotton was grown in Fazzan in the Garamantian period is reported in the Fazzan literature, but the exact phase of the earliest Jarma cotton could not be checked here and is not given a date of its own.\n\n" +
      "WHY IT MATTERS. Summer crops from the south and winter crops from the north on the same irrigated fields make the Garamantian oasis a meeting point of two farming worlds. It also means foggara water was needed all year — one reason the system was so heavy a burden on labour.\n\n" +
      "DECLINE. The water came from aquifers filled during the wetter early Holocene and barely recharged since. Over the Holocene the water table under the Wadi al-Ajal fell, the escarpment springs dried, and farmers had to dig deeper; foggaras tapped water just below the water table and failed when it sank further. Sterry, Mattingly and Wilson ask whether failing foggaras helped bring down Garamantian power in late antiquity; this is a leading hypothesis, not a proven single cause — politics, trade shifts and insecurity are also in play.\n\n" +
      "WHAT IT DOES NOT SHOW. That crops came from the south does not by itself mean people did; plants travel through exchange.",
    category: "archaeology",
    subcategory: MOORS_LANES.sahara,
    eventType: "archaeological_interpretation",
    tags: laneTags(LANE, "garamantes", "archaeobotany", "date-palm", "pearl-millet", "sorghum", "cotton", "groundwater", "fazzan"),
    people: ["Ruth Pelling", "Marijke van der Veen"],
    civilisations: ["Garamantes"],
    locationName: "Wadi al-Ajal, Fazzan, south-west Libya",
    media: [PIC.datePalmsGabrun, PIC.pearlMillet, PIC.sorghumSeeds, PIC.africanCotton, PIC.ubariSandSea],
    claims: [
      {
        sourceKey: "sahara-pelling-2008",
        citations: [
          { sourceKey: "sahara-pelling-2007-thesis", relation: "supports", note: "The archaeobotanical database behind the Jarma sequence and the later arrival of pearl millet and sorghum." },
          { sourceKey: "sahara-fazzan-vol4", relation: "context", note: "The excavated contexts at Jarma from which the plant remains come." },
        ],
        startYear: bce(200),
        endYear: 1,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "winter and summer season cultivation from the end of the first millennium BC",
        datingMethod: "archaeological",
        chronology: "conventional",
        temporalClaimType: "archaeological_date",
        whatIsDated: "Beginning of year-round (winter and summer) cropping at Jarma",
        evidence:
          "Charred and desiccated plant remains in dated contexts at Jarma. 'End of the first millennium BC' is rendered here as the last two centuries BCE; the phase is approximate.",
      },
      {
        sourceKey: "sahara-vanderveen-1992",
        citations: [
          { sourceKey: "sahara-pelling-2007-thesis", relation: "supports", note: "Identifies emmer wheat, barley, grape, fig and date as already widely grown at Zinkekra." },
        ],
        startYear: bce(900),
        endYear: bce(400),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "three cereal crops and three fruit crops, 900–400 cal BC",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        temporalClaimType: "radiometric_date",
        whatIsDated: "Earliest Garamantian crop package at Zinkekra",
        evidence: "Eleven radiocarbon dates on the plant assemblage itself.",
      },
      {
        sourceKey: "sahara-power-2019",
        citations: [
          { sourceKey: "sahara-aja-review-2020", relation: "supports", note: "Summarises the chapter: sorghum and pearl millet common by the 2nd century CE; C3-to-C4 diet shift." },
        ],
        startYear: 100,
        endYear: 200,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "sorghum and pearl millet common by the second century CE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "before_event",
        whatIsDated: "African summer cereals established in the Wadi al-Ajal",
        evidence: "Archaeobotany and the shift to C4 diets in dated burials.",
      },
      {
        sourceKey: "sahara-sterry-mattingly-wilson-2022",
        citations: [
          { sourceKey: "sahara-drake-2004", relation: "supports", note: "The long-term fall of the water table and drying of springs in the Wadi al-Ajal." },
          { sourceKey: "sahara-fazzan-vol1", relation: "context", note: "Sets the decline in the wider political and economic changes of late antiquity." },
        ],
        startYear: 400,
        endYear: 700,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "declining water tables and failing foggaras as a possible factor in Garamantian decline",
        datingMethod: "archaeological",
        chronology: "hypothesis",
        temporalClaimType: "estimated_range",
        whatIsDated: "Proposed role of groundwater depletion in the decline of the Garamantian state",
        evidence: "A hypothesis tested against foggara dates and settlement change; not established as the sole cause.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: "trans-saharan-exchange-garamantes",
    title: "Garamantian exchange across the Sahara",
    summary:
      "Roman pottery, glass and amphorae in Garamantian graves, local glass and bead-making, and a few ancient texts show the Garamantes at the centre of Saharan exchange; what went north — slaves, stones, ivory — is far harder to see.",
    description:
      "WHAT IT IS. The Garamantes sat between the Mediterranean coast (Lepcis Magna, Oea, Sabratha) and the Sahel. Their graves are full of imports: Roman fine pottery, amphorae for wine and oil, glass vessels and beads, from the late first to the fourth centuries CE and later. In the other direction, the Garamantes worked glass, made beads, wove textiles and smelted metal, and grew crops that came from the south.\n\n" +
      "WHAT THE TEXTS SAY. Herodotus (4.183) says the Garamantes went 'in their four-horse chariots chasing the cave-dwelling Ethiopians'. Pliny (NH 5.34) says the Romans' 'only intercourse' with the Troglodytae was 'for the purpose of procuring from them the precious stone which we call the carbuncle', which he says came from the interior; Balbus' triumph included a mountain 'where precious stones were produced' (5.37). Tacitus (Hist. 4.50) has Garamantian raiders selling their booty 'among the inaccessible hut-settlements of the far interior' — a glimpse of exchange networks beyond Roman sight.\n\n" +
      "THE DEBATE. How big was this trade, and what was it in? The older view (Law 1967) already saw slaves and ivory moving north. Fentress' 'slavers on chariots' argues the Garamantes were major suppliers of slaves to the Roman world, reading Herodotus' chariot-hunt as slave-raiding. Wilson (2012, 2017) and the Trans-Saharan Archaeology volume (2017) argue for a real, organised trade with short-, medium- and long-distance layers, but stress that the main commodities — gold, ivory, slaves, textiles — are largely invisible archaeologically. So the import side is well evidenced; the export side is inferred.\n\n" +
      "USING HERODOTUS CAREFULLY. The chariot-hunt passage is second-hand, set at the edge of the known world, and attached to fabulous details (people whose speech is 'like the squeaking of bats'). It can support a hypothesis about raiding; it cannot carry a slave trade by itself. 'Ethiopians' (Aithiopes) is a Greek word for peoples living south of Egypt and Libya, describing appearance; it is the writer's label, not a population category used here.\n\n" +
      "WHAT IT DOES NOT SHOW. This is not yet the camel-caravan gold trade of the medieval Sahara; that system came later, on Garamantian foundations among others.",
    category: "history",
    subcategory: MOORS_LANES.sahara,
    eventType: "archaeological_interpretation",
    eventTypeNote: "Imports are well evidenced; the size and content of the trade going north is debated.",
    tags: laneTags(LANE, "garamantes", "trans-saharan-trade", "roman-glass", "amphorae", "carnelian", "slavery", "herodotus"),
    people: ["Herodotus", "Pliny the Elder", "Tacitus"],
    civilisations: ["Garamantes", "Roman Empire", "Rome"],
    locationName: "Fazzan and the routes to Tripolitania",
    media: [PIC.ghadames, PIC.zlitenBeasts, PIC.garamantesMap, PIC.hattiaPyramids],
    claims: [
      {
        sourceKey: "sahara-law-1967",
        citations: [
          { sourceKey: "sahara-trade-2017", relation: "supports", note: "Re-evaluates the imported beads, glass, metalwork and textiles from Fazzan graves and settlements." },
          { sourceKey: "sahara-wilson-2012-azania", relation: "supports", note: "Models the short-, medium- and long-distance networks the imports belong to." },
          { sourceKey: "sahara-fazzan-vol1", relation: "context", note: "Catalogues the Roman material from Garamantian cemeteries and settlements." },
        ],
        startYear: 70,
        endYear: 400,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "imported Roman material in tombs of the Fezzan from the late first to the fourth centuries",
        datingMethod: "archaeological",
        chronology: "conventional",
        temporalClaimType: "archaeological_date",
        whatIsDated: "Roman imports in Garamantian graves",
        evidence: "Dated imported pottery, amphorae and glass found in Garamantian tombs and settlements.",
      },
      {
        sourceKey: "sahara-herodotus-godley",
        citations: [
          { sourceKey: "sahara-fentress-2011", relation: "context", note: "Reads the passage as slave-raiding and builds the 'slavers on chariots' model on it." },
          { sourceKey: "sahara-wilson-2017-exports", relation: "context", note: "Weighs how much of a slave trade the evidence can support." },
        ],
        startYear: bce(440),
        endYear: bce(425),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "These Garamantes go in their four-horse chariots chasing the cave-dwelling Ethiopians",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Herodotus' report of Garamantian chariot-hunting",
        evidence:
          "Herodotus 4.183, dated by the composition of the Histories. Second-hand ethnography; it records a story told in the Greek world, not an observed raid.",
      },
      {
        sourceKey: "sahara-pliny-bostock",
        citations: [
          { sourceKey: "sahara-wilson-2017-exports", relation: "supports", note: "Discusses precious stones (carnelian and similar) among plausible Saharan exports." },
        ],
        startYear: 77,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "procuring from them the precious stone which we call the carbuncle",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Pliny's report of a Saharan gem trade",
        evidence:
          "NH 5.34, dated by the publication of the Natural History (77 CE). Which stone 'carbuncle' meant is uncertain; carnelian and garnet are both proposed.",
      },
      {
        sourceKey: "sahara-fentress-2011",
        citations: [
          { sourceKey: "sahara-trade-2017", relation: "context", note: "Notes that slaves are among the commodities the archaeology can hardly see." },
          { sourceKey: "sahara-law-1967", relation: "supports", note: "Already treated slaves as attested among goods coming north." },
        ],
        startYear: 1,
        endYear: 400,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Garamantes as suppliers of slaves to the Roman world",
        datingMethod: "estimate",
        chronology: "hypothesis",
        temporalClaimType: "estimated_range",
        whatIsDated: "Proposed Garamantian slave trade with Rome",
        evidence: "A model built from a few texts and Roman demand for slaves; plausible, but not directly evidenced in quantity.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: "roman-expeditions-into-the-sahara",
    title: "Roman expeditions into the Sahara",
    summary:
      "Cornelius Balbus won a triumph over the Garamantes in 19 BCE; Valerius Festus fought them in 69/70 CE; and Septimius Flaccus and Julius Maternus travelled south from Garama towards the land Ptolemy called Agisymba.",
    description:
      "WHAT IT IS. Rome never annexed Fazzan, but it fought, threatened and travelled with the Garamantes for two centuries.\n\n" +
      "BALBUS, 20–19 BCE. Lucius Cornelius Balbus the Younger, proconsul of Africa and a native of Gades (Cadiz), campaigned south of Tripolitania and celebrated a triumph in 19 BCE — the last triumph awarded to anyone outside the imperial family, and the only one, Pliny says, to a man not born a Roman. Pliny (NH 5.35–37) lists the places carried in the procession: Cydamus (Ghadames), Garama, and a long string of towns, peoples, rivers and mountains, most of them now unidentifiable. Pliny calls Garama 'that most famous capital of the Garamantes'. The list proves a campaign and a claim of victory; it is not a map of conquest.\n\n" +
      "VALERIUS FESTUS, 69–70 CE. Tacitus (Hist. 4.50) tells how Oea, quarrelling with Lepcis, called in the Garamantes, 'an invincible tribe', and how Roman auxiliaries under the legate Valerius Festus routed them. Pliny (5.38) adds that the road to the Garamantes had been impassable because they filled the wells with sand, but that in this war a short cut of four days was found.\n\n" +
      "FLACCUS AND MATERNUS, LATE FIRST CENTURY CE. Ptolemy (Geography 1.8), criticising the geographer Marinus of Tyre, reports that Septimius Flaccus marched from the Garamantes to the 'Ethiopians' in three months, and that Julius Maternus set out from Lepcis Magna and Garama with the king of the Garamantes, who was campaigning against the Ethiopians, and after four months reached Agisymba, where rhinoceroses gather. Ptolemy himself thought the distances exaggerated. The journeys are usually put around 70–90 CE; Agisymba's location — often guessed as the Aïr, Tibesti or Lake Chad region — is unknown. Maternus travelling with the Garamantian king suggests by then an alliance, not war.\n\n" +
      "WHAT IT DOES NOT SHOW. None of these sources is Garamantian. We see the Garamantes only when Rome fought or used them, and Roman writers' categories ('nomads', 'Ethiopians') are theirs, not descriptions of how these people saw themselves.",
    category: "history",
    subcategory: MOORS_LANES.sahara,
    eventType: "historical",
    tags: laneTags(LANE, "garamantes", "roman-army", "balbus", "agisymba", "tripolitania", "exploration"),
    people: ["Lucius Cornelius Balbus", "Valerius Festus", "Septimius Flaccus", "Julius Maternus", "Marinus of Tyre", "Ptolemy", "Pliny the Elder", "Tacitus"],
    civilisations: ["Garamantes", "Rome", "Roman Empire"],
    locationName: "Tripolitania and Fazzan",
    media: [PIC.bunburyPtolemy, PIC.ghadames, PIC.zlitenBeasts, PIC.buNjem],
    claims: [
      {
        sourceKey: "sahara-pliny-bostock",
        citations: [
          { sourceKey: "sahara-fazzan-vol1", relation: "context", note: "Assesses Balbus' campaign and the identification of the places in Pliny's list." },
          { sourceKey: "sahara-law-1967", relation: "context", note: "Places the campaign in the history of Roman–Garamantian relations." },
        ],
        startYear: bce(19),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Cornelius Balbus was honoured with a triumph",
        datingMethod: "historical_record",
        chronology: "conventional",
        temporalClaimType: "explicit_date",
        whatIsDated: "Balbus' triumph over the Garamantes",
        evidence:
          "Pliny NH 5.36; the year (19 BCE) is from the Roman triumphal record, as given in Bostock's note. The campaign itself was in 20–19 BCE.",
      },
      {
        sourceKey: "sahara-tacitus-fyfe",
        citations: [
          { sourceKey: "sahara-pliny-bostock", relation: "supports", note: "NH 5.38: the war at the beginning of Vespasian's reign and the four-day short cut to the Garamantes." },
        ],
        startYear: 69,
        endYear: 70,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Oea … had called in the aid of the Garamantes, an invincible tribe",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "explicit_date",
        whatIsDated: "Valerius Festus' campaign against the Garamantes",
        evidence: "Tacitus places it in the events of 69–70 CE, at the accession of Vespasian; Pliny independently mentions the war.",
      },
      {
        sourceKey: "sahara-ptolemy-berggren-jones",
        citations: [
          { sourceKey: "sahara-wikipedia-agisymba", relation: "context", note: "Gives the conventional c. 90 CE date for Maternus and Marinus' writing c. 107–115 CE." },
        ],
        startYear: 70,
        endYear: 100,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Julius Maternus … came within four months to Agisymba",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        temporalClaimType: "estimated_range",
        whatIsDated: "The journeys of Septimius Flaccus and Julius Maternus",
        evidence:
          "Ptolemy gives no dates; the journeys are dated from Marinus (writing early second century) and from what is known of Roman Africa under the Flavians. Paraphrased from Geography 1.8; the quoted phrase is a short paraphrase, not a checked translation.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: "dromedary-in-north-africa",
    title: "The dromedary spreads across North Africa and the Sahara",
    summary:
      "Camels are mentioned in North Africa by 46 BCE and were numerous in Tripolitania by the 360s CE; their slow spread over the Roman centuries changed Saharan mobility, warfare and trade.",
    description:
      "WHAT IT IS. The one-humped camel, domesticated in Arabia, was known in Egypt long before it was common west of the Nile. In the Maghreb and the Sahara it spread slowly, over roughly the last centuries BCE and the first centuries CE.\n\n" +
      "WHAT THE TEXTS SHOW. The African War (Bellum Africum 68) records that in 46 BCE Caesar's men captured 'twenty-two camels, belonging to king Juba' of Numidia — few enough to be worth counting. Four centuries later Ammianus (28.6.5) has Count Romanus refuse to march to the help of Lepcis unless the city supplied 'four thousand camels'. By the sixth century the poet Corippus describes Moorish armies ringing their camps with camels as a living barricade (Merrills discusses this for the battle of 548 CE).\n\n" +
      "THE DEBATE. An older story had Rome 'introducing' the camel to North Africa in the third or fourth century CE. Brent Shaw's review of the evidence rejects that: camels were present earlier and spread gradually through indigenous herding, not imperial policy. Bulliet argued, from saddles and harness, that camels came to replace wheeled transport across North Africa and the Middle East. The exact chronology of the spread into the central and western Sahara is still thinly documented: camel bones and dated camel rock art are scarce, and rock-art camels can only be dated loosely.\n\n" +
      "WHY IT MATTERS. The camel made long desert crossings and deep raids easier, and it favoured mobile pastoral groups over the oasis states. Late-Roman and Byzantine writers' camel-riding enemies — the Austuriani and Laguatan of Tripolitania — and later the camel-borne networks of the Islamic-period Sahara grew on it. Some historians link the decline of the Garamantian oasis state partly to this shift in power towards camel-herding peoples; that link is plausible but not demonstrated.\n\n" +
      "WHAT IT DOES NOT SHOW. The camel did not create trans-Saharan contact: Garamantian exchange with the Sahel began earlier, with horses, donkeys, oxen and people on foot.",
    category: "history",
    subcategory: MOORS_LANES.sahara,
    eventType: "historical",
    tags: laneTags(LANE, "dromedary", "camel", "tripolitania", "numidia", "pastoralism", "corippus"),
    people: ["Juba I of Numidia", "Romanus (comes Africae)", "Corippus", "Ammianus Marcellinus"],
    civilisations: ["Numidia", "Roman Empire", "Byzantine Empire", "Amazigh peoples", "Garamantes"],
    locationName: "North Africa and the Sahara",
    media: [PIC.dromedaries, PIC.tassiliCamels],
    claims: [
      {
        sourceKey: "sahara-shaw-1979",
        citations: [
          { sourceKey: "sahara-bulliet-1975", relation: "supports", note: "Traces camel use and saddle technology into North Africa and the displacement of the wheel." },
          { sourceKey: "sahara-ammianus-yonge", relation: "supports", note: "Shows camels in large numbers in Tripolitania by the 360s CE." },
        ],
        startYear: bce(200),
        endYear: 400,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "gradual spread over the late first millennium BCE and the first centuries CE",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        temporalClaimType: "estimated_range",
        whatIsDated: "Spread of the dromedary in the Maghreb and the northern Sahara",
        evidence: "Texts, art and the few faunal finds reviewed by Shaw; the bounds are approximate.",
      },
      {
        sourceKey: "sahara-bellum-africum-bohn",
        citations: [
          { sourceKey: "sahara-shaw-1979", relation: "context", note: "Discusses the early textual mentions of camels in North Africa." },
        ],
        startYear: bce(46),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "twenty-two camels, belonging to king Juba",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "explicit_date",
        whatIsDated: "Camels in the Numidian royal army",
        evidence: "Bellum Africum 68, an eyewitness-era account of Caesar's African campaign of 46 BCE.",
      },
      {
        sourceKey: "sahara-ammianus-yonge",
        citations: [
          { sourceKey: "sahara-shaw-1979", relation: "context", note: "Uses the passage as evidence for camel numbers in late-Roman Tripolitania." },
        ],
        startYear: 363,
        endYear: 365,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "four thousand camels were provided for his troops",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "explicit_date",
        whatIsDated: "Count Romanus' demand for camels at Lepcis",
        evidence: "Ammianus 28.6.5, describing the Austuriani raids on Lepcis early in Valentinian's reign.",
      },
      {
        sourceKey: "sahara-merrills-2023",
        citations: [
          { sourceKey: "sahara-bulliet-1975", relation: "context", note: "Places camel-borne warfare in the long history of camel use." },
        ],
        startYear: 546,
        endYear: 548,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "camels used as defensive barricades (Corippus, Iohannis)",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "explicit_date",
        whatIsDated: "Camel barricades in Moorish warfare against John Troglita",
        evidence: "Corippus' epic on the campaigns of 546–548 CE, as analysed by Merrills.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  {
    slug: "garamantes-and-sub-saharan-africa",
    title: "The Garamantes and sub-Saharan Africa",
    summary:
      "Crops, goods, routes and skeletons link the Garamantes to the Sahel as well as to the Mediterranean; no Garamantian genome has yet been sequenced, so their ancestry is studied through bones, isotopes and living people's DNA.",
    description:
      "WHAT IT IS. The Garamantes faced both ways. Their wheat, barley, grapes and imported glass came from the north; their summer crops — pearl millet and sorghum — and probably some of their people and trade partners came from the south. Ptolemy has Julius Maternus travel with the Garamantian king four months south to Agisymba; Garamantian raids, according to Herodotus, reached peoples Greeks called 'Ethiopians'.\n\n" +
      "WHAT THE BONES SAY. Nikita, Mattingly and Lahr compared non-metric cranial traits of Garamantian burials with other North African groups and found the Garamantes distant from their neighbours, which they read as the central Sahara acting partly as a barrier, with no uniform gene flow across the region. Power and colleagues' isotope work on the Wadi al-Ajal burials found mostly C3 diets (wheat and barley) in the first millennium BCE and mostly C4 diets (millet and sorghum) later; because those crops were common by the second century CE, the shift could be dietary change or migration, and the data do not settle which. A cemetery population of mixed origins is likely; how mixed is not known.\n\n" +
      "WHAT DNA SAYS — AND DOES NOT. No ancient genome from a Garamantian burial has been published as far as could be found. An attempt to extract ancient mitochondrial DNA from Garamantian and earlier Acacus remains failed: the bones had too little usable DNA, probably because of heat. Studies of present-day Tuareg of Fazzan find mainly north-west African paternal lineages (E-M81), maternal lineages including a very high frequency of H1, and a smaller south-Saharan component that the authors suggest may be partly recent, through slavery or group fusion. Those studies describe living people; that they descend from the Garamantes is a reasonable but untested hypothesis. The Takarkori genomes describe a much older Saharan population and should not be stretched to the Garamantes.\n\n" +
      "ABOUT SKIN COLOUR IN THE TEXTS. Greek and Roman writers sorted Africans by appearance: 'Aithiopes' meant roughly 'burnt-faced people' to the south, and some Roman writers called particular Garamantes dark. These are outsiders' descriptions, applied loosely and often from hearsay. This record does not turn them into population categories: ancestry is a matter of genealogy measured by genetics, and it does not map onto ancient colour words or modern racial labels.\n\n" +
      "WHAT IT DOES NOT SHOW. The Sahara was neither a wall nor a highway. The evidence points to selective, changing connections — crops and goods moving easily, people moving in smaller numbers.",
    category: "people",
    subcategory: MOORS_LANES.sahara,
    eventType: "archaeological_interpretation",
    tags: laneTags(LANE, "garamantes", "sahel", "ancient-dna", "isotopes", "craniometry", "tuareg", "migration"),
    people: ["Efthymia Nikita", "Marta Mirazón Lahr", "Julius Maternus", "Claudio Ottoni"],
    civilisations: ["Garamantes", "Amazigh peoples"],
    locationName: "Fazzan and the central Sahara",
    media: [PIC.africaPtolemy1920, PIC.pearlMillet, PIC.garamantesMap, PIC.hattiaPyramids],
    claims: [
      {
        sourceKey: "sahara-nikita-2012",
        citations: [
          { sourceKey: "sahara-power-2019", relation: "supports", note: "The wider biocultural study of the same burials, adding isotopes and morphometrics." },
          { sourceKey: "sahara-ottoni-2008-thesis", relation: "context", note: "Explains why ancient DNA could not be used: the ancient bones yielded too little DNA." },
        ],
        startYear: bce(500),
        endYear: 500,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Garamantian crania show distant affinities to their neighbours",
        datingMethod: "archaeological",
        chronology: "scientific",
        temporalClaimType: "archaeological_date",
        whatIsDated: "The Garamantian burial population compared with other North Africans",
        evidence: "The date is the broad span of the Garamantian burials studied, not a moment.",
      },
      {
        sourceKey: "sahara-power-2019",
        citations: [
          { sourceKey: "sahara-aja-review-2020", relation: "supports", note: "Summarises the C3-to-C4 shift and its two possible explanations." },
          { sourceKey: "sahara-pelling-2007-thesis", relation: "context", note: "The crop history that makes a dietary explanation possible." },
        ],
        startYear: bce(1000),
        endYear: 500,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "mostly C3 diets in the first millennium BCE, mostly C4 diets later at Watwat",
        datingMethod: "archaeological",
        chronology: "scientific",
        temporalClaimType: "estimated_range",
        whatIsDated: "Change in diet among people buried in the Wadi al-Ajal",
        evidence: "Stable isotopes from dated burials; dietary change or migration, not resolved.",
      },
      {
        sourceKey: "sahara-ottoni-2011",
        citations: [
          { sourceKey: "sahara-ottoni-2010", relation: "supports", note: "The maternal side: H1-rich, village-specific lineages among Fazzan Tuareg." },
          { sourceKey: "sahara-ottoni-2008-thesis", relation: "context", note: "Shows the Garamantian link could not be tested with ancient DNA." },
        ],
        startYear: 400,
        endYear: 700,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Tuareg of Fazzan as possible descendants of the Garamantes",
        datingMethod: "genetic",
        chronology: "hypothesis",
        temporalClaimType: "proposed_correlation",
        whatIsDated: "Proposed link between the decline of the Garamantes and the origins of the Fazzan Tuareg",
        evidence:
          "Inferred from living people's DNA, not tested on Garamantian remains. The date is the Garamantian decline that the hypothesis links to.",
      },
      {
        sourceKey: "sahara-ptolemy-berggren-jones",
        citations: [
          { sourceKey: "sahara-wilson-2012-azania", relation: "context", note: "Places Garamantian links to the south in a network of medium- and long-distance trade." },
        ],
        startYear: 70,
        endYear: 100,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "with the king of the Garamantes on campaign against the 'Ethiopians'",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "A Garamantian king's expedition to the south",
        evidence: "Geography 1.8 (paraphrased); dated as for Maternus' journey.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const links: SeedEventLink[] = [
  // inside the section
  { from: "garamantian-foggara-irrigation", to: "garamantian-oasis-agriculture", relation: "associated", note: "Foggara water made year-round irrigated cropping possible, and its failure is one explanation of decline." },
  { from: "garamantes-emergence", to: "garama-capital-germa", relation: "associated", note: "Garama was founded in the course of the Garamantian state's growth and became its capital." },
  { from: "garama-capital-germa", to: "trans-saharan-exchange-garamantes", relation: "evidence_for", note: "Roman imports in Garama's buildings and cemeteries are much of the evidence for Garamantian trade." },
  { from: "roman-expeditions-into-the-sahara", to: "garama-capital-germa", relation: "related", note: "Balbus' triumph and Maternus' journey both name Garama." },
  { from: "dromedary-in-north-africa", to: "trans-saharan-exchange-garamantes", relation: "related", note: "The camel later transformed Saharan transport, but Garamantian exchange largely predates its spread." },
  { from: "garamantian-oasis-agriculture", to: "garamantes-and-sub-saharan-africa", relation: "evidence_for", note: "Pearl millet and sorghum in Garamantian fields are among the clearest links to the Sahel." },
  { from: "trans-saharan-exchange-garamantes", to: "garamantes-and-sub-saharan-africa", relation: "related", note: "Exchange with the south is part of how Garamantian links to sub-Saharan Africa are traced." },
  // to other sections (the Herodotus, rock-art and Takarkori edges are written by the sections that own those records)
  { from: "green-sahara-humid-period", to: "garamantes-emergence", relation: "precedes", note: "Garamantian oases drew on groundwater stored during the African Humid Period, long after the Sahara dried." },
  { from: "roman-expeditions-into-the-sahara", to: "roman-annexation-of-mauretania", relation: "related", note: "Both belong to the Augustan and Julio-Claudian extension of Roman power around North Africa." },
  { from: "dromedary-in-north-africa", to: "byzantine-reconquest-and-the-mauri-wars", relation: "relevant", note: "Corippus' account of the Mauri wars describes camel barricades used against Byzantine armies." },
  { from: "dromedary-in-north-africa", to: "mauri-cavalry-in-the-roman-army", relation: "related", note: "Horse and later camel mobility shaped how North African peoples fought, with and against Rome." },
  { from: "trans-saharan-exchange-garamantes", to: "islamization-and-arab-amazigh-alliances", relation: "relevant", note: "The early Islamic Saharan networks reused routes and oases that Garamantian exchange had organised." },
  { from: "dromedary-in-north-africa", to: "juba-i-and-thapsus", relation: "relevant", note: "The camels of King Juba captured in 46 BCE come from the campaign that ended at Thapsus." },
  // to records already in the community
  { from: "green-sahara-atlantis-window", to: "garamantian-foggara-irrigation", relation: "relevant", note: "The early-Holocene humid phase recharged the aquifers the foggaras later tapped." },
  { from: "set-survives-in-the-oases", to: "garamantian-foggara-irrigation", relation: "relevant", note: "Egypt's Western Desert oases, where Seth's cult survived, are the proposed source of the qanat technique that reached Fazzan." },
];

export const SAHARA: MoorsSection = { sources, events, links };
