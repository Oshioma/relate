// CARTHAGE AND ETRURIA — the Phoenician and Punic western Mediterranean, and
// the North African–Italian connections that ran through it.
//
// WHAT THIS SECTION IS ABOUT. Phoenician-speaking settlers from the Levant
// founded towns on the North African coast from about the tenth or ninth
// century BCE; Carthage became the largest of them, and for six centuries it
// was the North African power the Etruscans, the Greeks and then Rome dealt
// with. NONE OF THE PEOPLE IN THESE RECORDS WERE CALLED MAURI OR MOORS. The
// settlers called themselves by their cities (Tyrians, Carthaginians); Greek
// and Latin writers called them Phoenicians and Poeni; the indigenous people
// they met appear in the sources as "Libyans" (an exonym) or under particular
// tribal names. The word Mauri belongs to a later record in the Numidia and
// Mauretania lane.
//
// THE SOURCE PROBLEM. Carthage's own literature is lost. Almost every narrative
// below comes from Greek and Roman writers, many of them hostile or writing
// centuries later, so each record keeps the ancient tradition and the
// archaeology in separate claims, and says where they disagree.
//
// RESEARCH NOTE. During this research session the online text collections
// (Perseus, LacusCurtius, Wikisource) could not be reached, so no ancient
// passage below is quoted: every ancient author is cited by book and chapter
// and PARAPHRASED, and the paraphrase is labelled as one. Ancient-text sources
// therefore carry a reference but no URL.

import type { SeedEvent, SeedSource, SeedEventLink } from "../seed-types";
import { MOORS_LANES, bce, commonsPicture, laneTags, type MoorsSection } from "./shared";

const LANE = MOORS_LANES.carthageEtruria;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // --- Ancient writers (cited by book and chapter; paraphrased) ------------
  {
    key: "ce_herodotus",
    title: "Histories",
    author: "Herodotus",
    workTitle: "Histories (tr. A. D. Godley, Loeb Classical Library, 1920)",
    reference: "1.163–167 (Phocaeans, Alalia, Agylla); 4.196 (the 'silent trade' beyond the Pillars of Heracles)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 430 BCE",
    notes:
      "Cited for (1) the Phocaean settlement at Alalia on Corsica, the sea battle against the combined Carthaginian and Etruscan ('Tyrrhenian') fleets, the stoning of Phocaean prisoners by the people of Agylla (Caere) and the Delphic remedy (1.165–167); and (2) the Carthaginian report of 'silent trade' for gold with a people of Libya beyond the Pillars of Heracles (4.196). Paraphrased; not quoted.",
  },
  {
    key: "ce_polybius",
    title: "Histories",
    author: "Polybius",
    workTitle: "Histories (tr. W. R. Paton, Loeb Classical Library)",
    reference: "3.22–26 (the treaties between Rome and Carthage); 38.19–22 (fragments on the fall of Carthage, 146 BCE)",
    sourceType: "historical_document",
    publishedDisplay: "written in the second century BCE",
    notes:
      "Cited for the text and date of the first Rome–Carthage treaty, which Polybius says he read on bronze tablets and dates to the first consuls after the kings (3.22), and for the eyewitness fragments on the destruction of Carthage in 146 BCE, where Polybius was present with Scipio Aemilianus (38.19–22). Paraphrased; not quoted.",
  },
  {
    key: "ce_appian",
    title: "Punica (The Libyan / Punic Wars)",
    author: "Appian of Alexandria",
    workTitle: "Roman History, book 8",
    reference: "Punica 105–106 (Scipio divides Masinissa's kingdom), 127–135 (the capture and destruction of Carthage and the settlement of Africa)",
    sourceType: "historical_document",
    publishedDisplay: "written in the second century CE",
    notes:
      "Cited for the narrative of the Third Punic War, the street fighting and burning of Carthage in 146 BCE, the senatorial commission that organised the new province, and the division of Masinissa's Numidian kingdom among his sons. A late narrative that drew on Polybius; paraphrased, not quoted.",
  },
  {
    key: "ce_justin",
    title: "Epitome of the Philippic Histories of Pompeius Trogus",
    author: "Marcus Junianus Justinus (Justin), epitomising Pompeius Trogus",
    reference: "18.3–6 (Tyre, Elissa, the founding of Carthage); 19.1–2 (the payment to the Africans)",
    sourceType: "historical_document",
    publishedDisplay: "Trogus wrote under Augustus; Justin's epitome is probably 2nd–4th century CE",
    notes:
      "Cited for the foundation story of Carthage: Elissa's flight from her brother Pygmalion of Tyre, the bargain for as much land as an ox-hide could cover (the Byrsa story), the annual payment for the land made to the local Africans, the demand of Hiarbas, king of the Maxitani, and Justin's statement that Carthage was founded seventy-two years before Rome (18.6.9). Paraphrased; not quoted.",
  },
  {
    key: "ce_dionysius",
    title: "Roman Antiquities",
    author: "Dionysius of Halicarnassus",
    reference: "1.74.1 (Timaeus' synchronism of the foundations of Rome and Carthage)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 7 BCE",
    notes:
      "Cited as the surviving witness to the lost Sicilian historian Timaeus of Tauromenium (c. 350–260 BCE), who placed the foundations of Rome and of Carthage in the same year, the thirty-eighth year before the first Olympiad — the origin of the conventional 814/813 BCE date for Carthage. Paraphrased; not quoted.",
  },
  {
    key: "ce_josephus",
    title: "Against Apion",
    author: "Flavius Josephus",
    reference: "1.17–18 (the Tyrian king list quoted from Menander of Ephesus)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 95 CE",
    notes:
      "Cited for the Tyrian king list Josephus quotes from Menander of Ephesus, which places the founding of Carthage in the seventh year of King Pygmalion of Tyre. Converting that into a calendar year depends on how the Tyrian list is anchored, and modern conversions cluster in the late ninth century BCE. Paraphrased; not quoted.",
  },
  {
    key: "ce_velleius",
    title: "Roman History",
    author: "Velleius Paterculus",
    reference: "1.2.3 (the foundation of Gades and then Utica by a Tyrian fleet)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 30 CE",
    notes:
      "Cited for the ancient tradition that a fleet from Tyre founded Gades (Cádiz) about eighty years after the fall of Troy, and Utica a few years later — the source of the 'c. 1100 BCE' dates. Paraphrased; not quoted.",
  },
  {
    key: "ce_pliny",
    title: "Natural History",
    author: "Pliny the Elder",
    reference: "16.216 (the cedar beams of the temple of Apollo at Utica); 19.63 (the shrine of Hercules at Lixus); 18.22 (Mago's agricultural treatise and the libraries of Carthage)",
    sourceType: "historical_document",
    publishedDisplay: "completed 77–79 CE",
    notes:
      "Cited for (1) Pliny's statement that the cedar beams in the temple of Apollo at Utica had stood for 1,178 years by his day — the basis of the traditional 'Utica 1101 BCE'; (2) the tradition that the shrine of Hercules (Melqart) at Lixus was older than that at Gades; (3) the Senate's decision after 146 BCE to give Carthage's libraries to the kings of Africa and to have Mago's treatise on agriculture translated into Latin. Passage references are the standard ones; the wording is paraphrased.",
  },
  {
    key: "ce_diodorus",
    title: "Library of History",
    author: "Diodorus Siculus",
    reference: "5.16.2–3 (Ebusus/Ibiza); 16.69.1 (the treaty of 348 BCE)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 60–30 BCE",
    notes:
      "Cited for the traditional foundation of Ebusus (Ibiza) by Carthaginians 160 years after the foundation of Carthage (i.e. c. 654/653 BCE on the Timaean date), and for Diodorus' notice of a Rome–Carthage treaty in 348 BCE, which he presents as the first — the basis for the minority view that Polybius' 'first treaty' belongs in 348. Paraphrased; not quoted.",
  },
  {
    key: "ce_livy",
    title: "Ab Urbe Condita",
    author: "Livy",
    reference: "7.27.2 (a treaty with Carthaginian envoys, 348 BCE)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 27 BCE–17 CE",
    notes:
      "Cited only for Livy's notice that a treaty was struck with Carthaginian envoys in 348 BCE, which with Diodorus is the evidence for re-dating Polybius' first treaty. Paraphrased; not quoted.",
  },
  {
    key: "ce_aristotle",
    title: "Politics",
    author: "Aristotle",
    reference: "3.9, 1280a35–40 (agreements between the Etruscans and the Carthaginians)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 335–322 BCE",
    notes:
      "Cited for Aristotle's passing remark that the Etruscans and the Carthaginians had agreements about imports and about not wronging one another, used as an example of states bound by treaties without being one state. Paraphrased; not quoted.",
  },
  {
    key: "ce_thucydides",
    title: "History of the Peloponnesian War",
    author: "Thucydides",
    reference: "6.2.6 (the Phoenicians in Sicily concentrate at Motya, Soloeis and Panormus)",
    sourceType: "historical_document",
    publishedDisplay: "written in the late fifth century BCE",
    notes:
      "Cited for the statement that, as Greek settlers arrived, the Phoenicians of Sicily withdrew to Motya, Soloeis and Panormus in the west of the island, near Carthage. Paraphrased; not quoted.",
  },
  {
    key: "ce_sallust",
    title: "Bellum Iugurthinum (The Jugurthine War)",
    author: "Sallust",
    reference: "17.7 (Punic books of King Hiempsal); 19.1 (Phoenician foundations on the African coast)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 41–40 BCE",
    notes:
      "Cited for (1) Sallust's list of coastal towns founded by Phoenicians — Hippo, Hadrumetum, Leptis and others (19.1); and (2) his statement that his account of the peoples of Africa was translated from Punic books said to be King Hiempsal's (17.7), evidence that Punic literacy lived on at the Numidian court after 146 BCE. Paraphrased; not quoted.",
  },
  {
    key: "ce_macrobius",
    title: "Saturnalia",
    author: "Macrobius",
    reference: "3.9.7–8 (the formula of evocatio said to have been used at Carthage)",
    sourceType: "historical_document",
    publishedDisplay: "written early fifth century CE",
    notes:
      "Cited for the Roman claim that the gods of Carthage were ritually 'called out' (evocatio) before the city was destroyed, with the formula Macrobius says he found in an older antiquarian work. A very late report of a ritual; paraphrased, not quoted.",
  },
  {
    key: "ce_herodian",
    title: "History of the Empire after Marcus",
    author: "Herodian",
    reference: "5.6.4–5 (Elagabalus brings the goddess 'Urania' of Carthage to Rome)",
    sourceType: "historical_document",
    publishedDisplay: "written mid-third century CE",
    notes:
      "Cited for the report that the emperor Elagabalus (218–222 CE) had the statue of the Carthaginian goddess the Greeks called Urania (Latin Caelestis) brought to Rome and 'married' to his own god. Paraphrased; not quoted.",
  },

  // --- Objects --------------------------------------------------------------
  {
    key: "ce_pyrgi_object",
    title: "The Pyrgi gold tablets (three inscribed gold sheets)",
    publisher: "Museo Nazionale Etrusco di Villa Giulia, Rome",
    reference: "Found 1964 in the sanctuary at Pyrgi (Santa Severa), Area C; Phoenician text KAI 277",
    sourceType: "archaeological",
    publishedDisplay: "made c. 500 BCE",
    notes:
      "Cited for the object itself: three gold sheets, two inscribed in Etruscan and one in Phoenician, recording a dedication by Thefarie Velianas, ruler of Caere, to a goddess named Uni in Etruscan and Astarte in Phoenician. The Etruscan and Phoenician texts are not word-for-word translations of each other.",
  },
  {
    key: "ce_carthage_tessera",
    title: "Ivory tablet in the shape of a boar with an Etruscan inscription, from Carthage",
    publisher: "Found 1898 in the Sainte-Monique necropolis, Carthage",
    reference: "Shown in the exhibition 'Carthago. Il mito immortale' (Rome, Colosseum, 2019) as a tessera hospitalis, 6th century BCE",
    sourceType: "archaeological",
    publishedDisplay: "6th century BCE",
    notes:
      "Cited for the object: a small pierced ivory plaque with a crouching boar on one face and an Etruscan inscription running right to left on the other, found in a Punic necropolis at Carthage, and exhibited in 2019 as a 'tessera hospitalis' carrying a personal name.",
  },
  {
    key: "ce_bm_isis_tomb",
    title: "Objects from the Isis Tomb, Polledrara cemetery, Vulci",
    publisher: "The British Museum, London",
    reference: "About sixty objects sold in 1844 by Alexandrine de Bleschamp to Emil Braun and later bought by the British Museum; e.g. the gypsum statue 1850,0227.1",
    sourceType: "museum",
    publishedDisplay: "contents dated c. 625–550 BCE",
    notes:
      "Cited for the assemblage itself: painted and incised ostrich eggs, Egyptian-style faience flasks and scarabs, bronzes and a gypsum statue from an Etruscan chamber tomb at Vulci — material that arrived in Etruria through Phoenician-run trade.",
  },

  // --- Modern scholarship ---------------------------------------------------
  {
    key: "ce_aubet",
    title: "The Phoenicians and the West: Politics, Colonies and Trade",
    author: "Maria Eugenia Aubet",
    publisher: "Cambridge University Press",
    publishedYear: 2001,
    publishedDisplay: "2nd edition, 2001",
    reference: "ISBN 0-521-79543-5",
    sourceType: "academic_book",
    notes:
      "The standard synthesis of Phoenician expansion westward. Cited for the gap between the ancient foundation dates (Gadir, Utica, Lixus c. 1100 BCE) and the archaeology, for the Atlantic sites (Lixus, Mogador), for Huelva as the earliest concentration of Phoenician material in the West, and for the network of Sicily, Sardinia and Ibiza.",
  },
  {
    key: "ce_lancel",
    title: "Carthage: A History",
    author: "Serge Lancel",
    publisher: "Blackwell",
    publishedYear: 1995,
    publishedDisplay: "1995 (English translation of the 1992 French edition)",
    reference: "tr. Antonia Nevill; ISBN 1-55786-468-7",
    sourceType: "academic_book",
    notes:
      "Cited for the foundation traditions (Timaeus, Justin, Menander via Josephus) and the excavated early levels of Carthage, for Carthage's relations with the Etruscans (Alalia, Pyrgi, Etruscan finds at Carthage), for the tophet, and for the destruction of 146 BCE.",
  },
  {
    key: "ce_hoyos",
    title: "The Carthaginians",
    author: "Dexter Hoyos",
    publisher: "Routledge",
    publishedYear: 2010,
    publishedDisplay: "2010",
    reference: "Peoples of the Ancient World series; ISBN 978-0-415-43645-8",
    sourceType: "academic_book",
    notes:
      "Cited for Carthage's relations with its Libyan neighbours (the land payment and its end), for the Rome–Carthage treaties and their dating, and for the persistence of Punic language and institutions in North Africa after 146 BCE.",
  },
  {
    key: "ce_quinn",
    title: "In Search of the Phoenicians",
    author: "Josephine Crawley Quinn",
    publisher: "Princeton University Press",
    publishedYear: 2018,
    publishedDisplay: "2018",
    reference: "ISBN 978-0-691-17527-0",
    sourceType: "academic_book",
    notes:
      "Cited for the warning that 'Phoenician' was a Greek label and not a self-designation: people of these cities identified by their city or family, so the records here avoid treating Phoenicians or Carthaginians as a single ethnic bloc.",
  },
  {
    key: "ce_miles",
    title: "Carthage Must Be Destroyed: The Rise and Fall of an Ancient Civilization",
    author: "Richard Miles",
    publisher: "Allen Lane / Viking",
    publishedYear: 2010,
    publishedDisplay: "2010",
    reference: "ISBN 978-0-7139-9793-4",
    sourceType: "academic_book",
    notes:
      "Cited for the destruction of 146 BCE and its aftermath — the province of Africa, the Numidian kingdoms, and the survival of Punic culture — and for the Roman framing of Carthage after its fall.",
  },
  {
    key: "ce_docter2008",
    title: "New radiocarbon dates from Carthage: bridging the gap between history and archaeology?",
    author: "Roald F. Docter, F. Chelbi, B. Maraoui Telmini, A. J. Nijboer, J. van der Plicht, W. Van Neer, K. Mansel, S. Garsallah",
    workTitle: "Beyond the Homeland: Markers in Phoenician Chronology (ed. C. Sagona), Ancient Near Eastern Studies Supplement 28",
    publisher: "Peeters, Leuven",
    publishedYear: 2008,
    publishedDisplay: "2008",
    reference: "pp. 379–422",
    sourceType: "academic_paper",
    notes:
      "Cited for the radiocarbon dating of animal bone and other samples from the earliest excavated levels of Carthage (Bir Massouda and nearby), which the authors argued bring the archaeology close to the late-ninth-century foundation tradition. The specific calibrated ranges are not quoted here because the paper itself could not be opened in this session.",
  },
  {
    key: "ce_maraoui2020",
    title: "New pottery contexts and radiocarbon data from early layers on the Byrsa Hill (Carthage): the 'Astarté 2'-sequence",
    author: "Boutheina Maraoui Telmini and Frerich Schön",
    workTitle: "Rivista di Studi Fenici 48",
    publisher: "Edizioni Quasar, Rome",
    publishedYear: 2020,
    publishedDisplay: "2020",
    reference: "Rivista di Studi Fenici 48 (2020), pp. 65–106",
    sourceType: "academic_paper",
    notes:
      "Cited for an early pottery sequence on the Byrsa Hill with radiocarbon data, dated by the authors to the first half of the eighth century BCE with a possible start at the end of the ninth — described by them as the oldest assemblage yet found at Carthage. Reported from the published abstract.",
  },
  {
    key: "ce_lopezcastro2016",
    title: "La colonización fenicia inicial en el Mediterráneo Central: nuevas excavaciones arqueológicas en Utica (Túnez)",
    author: "José Luis López Castro, Ahmed Ferjaoui, Alfredo Mederos Martín, Víctor Martínez Hahnmüller, Imed Ben Jerbania",
    workTitle: "Trabajos de Prehistoria 73(1)",
    publishedYear: 2016,
    publishedDisplay: "2016",
    reference: "Trabajos de Prehistoria 73(1): 68–89; doi:10.3989/tp.2016.12164",
    url: "https://doi.org/10.3989/tp.2016.12164",
    sourceType: "academic_paper",
    notes:
      "Cited for the first Tunisian–Spanish excavations at Utica: a well filled with Phoenician, Greek Geometric, Sardinian, Libyan (local North African), Villanovan and Tartessian pottery, whose seeds gave radiocarbon dates of about 925–900 cal BCE — earlier than the user's '9th–8th century' target and comparable to Huelva.",
  },
  {
    key: "ce_gonzalez2004",
    title: "El emporio fenicio precolonial de Huelva (ca. 900–770 a.C.)",
    author: "Fernando González de Canales, Leonardo Serena, Jorge Llompart",
    publisher: "Biblioteca Nueva, Madrid",
    publishedYear: 2004,
    publishedDisplay: "2004",
    reference: "Monograph publishing the finds from Calle Méndez Núñez / Plaza de las Monjas, Huelva",
    sourceType: "academic_book",
    notes:
      "Cited for the large deposit of Phoenician, Greek, Sardinian and local pottery found in central Huelva, dated by the excavators to c. 900–770 BCE (the source of the 'Huelva c. 900 BCE' figure). Later radiocarbon work has proposed both higher (tenth-century) and lower (late-ninth-century) dates, so the range is a debated one.",
  },
  {
    key: "ce_aranegui2005",
    title: "Lixus-2. Ladera sur: excavaciones arqueológicas marroquino-españolas en la colonia fenicia. Campañas 2000–2003",
    author: "Carmen Aranegui (ed.)",
    workTitle: "Saguntum Extra 6",
    publisher: "Universitat de València",
    publishedYear: 2005,
    publishedDisplay: "2005",
    reference: "Saguntum. Papeles del Laboratorio de Arqueología de Valencia, Extra 6",
    sourceType: "academic_book",
    notes:
      "Cited for the Moroccan–Spanish excavations at Lixus, whose earliest Phoenician levels are dated to the eighth century BCE (some scholars allow the late ninth) — centuries after the traditional c. 1100 BCE date.",
  },
  {
    key: "ce_jodin1966",
    title: "Mogador: comptoir phénicien du Maroc atlantique",
    author: "André Jodin",
    publisher: "Éditions Marocaines et Internationales, Tangier (Études et travaux d'archéologie marocaine 2)",
    publishedYear: 1966,
    publishedDisplay: "1966",
    reference: "Excavation monograph on the Phoenician levels of Mogador island, Essaouira",
    sourceType: "academic_book",
    notes:
      "Cited for the Phoenician trading station on Mogador island off Essaouira — red-slip pottery, amphorae and inscribed sherds of the seventh–sixth centuries BCE — the southernmost securely identified Phoenician site on the Atlantic coast of Africa.",
  },
  {
    key: "ce_schmitz1995",
    title: "The Phoenician text from the Etruscan sanctuary at Pyrgi",
    author: "Philip C. Schmitz",
    workTitle: "Journal of the American Oriental Society 115(4)",
    publishedYear: 1995,
    publishedDisplay: "1995",
    reference: "JAOS 115(4): 559–575; doi:10.2307/604727",
    url: "https://doi.org/10.2307/604727",
    sourceType: "academic_paper",
    notes:
      "Cited for a philological study of the Phoenician Pyrgi text: the dedication to Astarte, the title given to Thefarie Velianas, the date formula in the third year of his reign, and the disputed final lines. Schmitz later published a partial retraction and reassessment (2015–2016), so readings of the closing lines should be treated as open.",
  },
  {
    key: "ce_colonna1964",
    title: "Scavi nel santuario etrusco di Pyrgi: relazione preliminare della settima campagna, 1964, e scoperta di tre lamine d'oro inscritte in etrusco e in punico",
    author: "Giovanni Colonna, Giovanni Garbini, Massimo Pallottino, Licia Vlad Borrelli",
    workTitle: "Archeologia Classica 16",
    publishedYear: 1964,
    publishedDisplay: "1964",
    reference: "Archeologia Classica 16 (1964): 49–117",
    sourceType: "academic_paper",
    notes:
      "Cited as the first edition of the Pyrgi tablets and their excavation context. Pallottino's view that Thefarie Velianas ruled with Carthaginian backing originates in this circle and remains a hypothesis.",
  },
  {
    key: "ce_wp_pyrgi",
    title: "Pyrgi Tablets",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Pyrgi_Tablets",
    publishedDisplay: "consulted October 2026",
    sourceType: "wikipedia",
    notes:
      "Used only as a finding aid for the tablets' date (c. 500 BCE), find year (1964), museum (Villa Giulia) and bibliography (Colonna et al. 1964, Schmitz 1995 and 2015–2016, Adiego 2015–2016). Not relied on for any reading.",
  },
  {
    key: "ce_bonnet1996",
    title: "Astarté: dossier documentaire et perspectives historiques",
    author: "Corinne Bonnet",
    publisher: "Consiglio Nazionale delle Ricerche, Rome (Contributi alla storia della religione fenicio-punica 2)",
    publishedYear: 1996,
    publishedDisplay: "1996",
    reference: "Collezione di Studi Fenici 37",
    sourceType: "academic_book",
    notes:
      "Cited for the Levantine origin of Astarte, her worship in the Phoenician and Punic West, and her identifications with Greek, Etruscan and Roman goddesses — the basis for treating Pyrgi's Astarte as a Phoenician goddess in Etruria rather than as an 'African' one.",
  },
  {
    key: "ce_haynes2000",
    title: "Etruscan Civilization: A Cultural History",
    author: "Sybille Haynes",
    publisher: "J. Paul Getty Museum / British Museum Press",
    publishedYear: 2000,
    publishedDisplay: "2000",
    reference: "ISBN 978-0-89236-600-2; pp. 154–158 (the Isis Tomb)",
    sourceType: "academic_book",
    notes:
      "Cited for the Isis Tomb at Vulci and its imported ostrich eggs and faience, for the Etruscan–Carthaginian alliance at Alalia, and for the Pyrgi sanctuary in the setting of Caere's foreign relations.",
  },
  {
    key: "ce_benveniste1933",
    title: "Notes étrusques, I: La tablette d'ivoire de Carthage",
    author: "Émile Benveniste",
    workTitle: "Studi Etruschi 7",
    publishedYear: 1933,
    publishedDisplay: "1933",
    reference: "Studi Etruschi 7 (1933); the 'SE07' scan on studietruschi.org",
    sourceType: "academic_paper",
    notes:
      "Cited for the find (Sainte-Monique necropolis, 1898), the description (a pierced plaque with a crouching boar on one side and a right-to-left Etruscan inscription on the other), the history of the reading — Bréal's 1899 reading as a dedication to Melqart, corrected by J. Martha and R. Cagnat (the sixth letter is n, not m; the fourteenth is z, not v) — and Benveniste's argument that the 'Melqart' interpretation was an error repeated on authority. Known here from search excerpts of the scan; Benveniste's own final reading was not read in this session.",
  },
  {
    key: "ce_walbank1957",
    title: "A Historical Commentary on Polybius, vol. I (Books I–VI)",
    author: "F. W. Walbank",
    publisher: "Clarendon Press, Oxford",
    publishedYear: 1957,
    publishedDisplay: "1957",
    reference: "commentary on 3.22–26",
    sourceType: "academic_book",
    notes:
      "Cited for the standard discussion of the Rome–Carthage treaties in Polybius 3.22–26: the arguments for Polybius' 509/508 BCE date for the first treaty and for the alternative that it belongs in 348 BCE.",
  },
  {
    key: "ce_casson1991",
    title: "The Ancient Mariners: Seafarers and Sea Fighters of the Mediterranean in Ancient Times",
    author: "Lionel Casson",
    publisher: "Princeton University Press",
    publishedYear: 1991,
    publishedDisplay: "2nd edition, 1991",
    reference: "pp. 74–79",
    sourceType: "academic_book",
    notes:
      "Cited for the battle of Alalia as a naval engagement — the Phocaean pentekonters against the combined Etruscan and Carthaginian fleets — and its outcome: a costly Greek 'victory' followed by the abandonment of Corsica.",
  },
  {
    key: "ce_wp_alalia",
    title: "Battle of Alalia",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Battle_of_Alalia",
    publishedDisplay: "consulted October 2026",
    sourceType: "wikipedia",
    notes:
      "Used only as a finding aid: gives the date as some time between 540 and 535 BCE, the ship numbers from Herodotus, and the modern bibliography (Casson 1991, Lancel 1997). Not relied on for the narrative.",
  },
  {
    key: "ce_gras1985",
    title: "Trafics tyrrhéniens archaïques",
    author: "Michel Gras",
    publisher: "École française de Rome (BEFAR 258)",
    publishedYear: 1985,
    publishedDisplay: "1985",
    reference: "Bibliothèque des Écoles françaises d'Athènes et de Rome 258",
    sourceType: "academic_book",
    notes:
      "Cited for the archaic trade of the Tyrrhenian Sea: the distribution of Etruscan transport amphorae and bucchero around the western Mediterranean (including Carthage), and the Etruscan–Carthaginian relationship behind Alalia and the treaties Aristotle mentions.",
  },
  {
    key: "ce_docter_etruscan",
    title: "Etruscan pottery: some case studies in chronology and context",
    author: "Roald F. Docter",
    workTitle: "Proceedings of a conference of the Istituto Nazionale di Studi Etruschi ed Italici (file 'ATTISE24_17_DOCTER' on studietruschi.org)",
    publisher: "Istituto Nazionale di Studi Etruschi ed Italici",
    reference: "Conference volume not identified with certainty; read through search excerpts only",
    sourceType: "academic_paper",
    notes:
      "Cited for the report that Etruscan transport amphorae, recognisable by volcanic inclusions in their fabric and their manufacture, occur at Carthage in stratified layers of the last quarter of the eighth and the first half of the seventh century BCE, alongside Etruscan fine wares (impasto, bucchero, Etrusco-Corinthian). Reported from excerpts; the exact quantities were not read.",
  },
  {
    key: "ce_bechtold2010",
    title: "Transport amphorae from Punic Carthage: an overview",
    author: "Babette Bechtold and Roald F. Docter",
    workTitle: "Motya and the Phoenician Ceramic Repertoire between the Levant and the West, 9th–6th Century BC (ed. L. Nigro), Quaderni di Archeologia Fenicio-Punica 5",
    publisher: "Missione Archeologica a Mozia, Rome",
    publishedYear: 2010,
    publishedDisplay: "2010",
    reference: "pp. 85–116",
    sourceType: "academic_paper",
    notes:
      "Cited for the range of imported transport amphorae at Carthage — including Etruscan ones — as a measure of the city's Tyrrhenian trade.",
  },
  {
    key: "ce_hodos2020",
    title: "The origins of decorated ostrich eggs in the ancient Mediterranean and Middle East",
    author: "Tamar Hodos, Caroline Cartwright, Janet Montgomery, Geoff Nowell, Kayla Crowder, Alexandra Fletcher, Yvonne Gönster",
    workTitle: "Antiquity 94(374)",
    publishedYear: 2020,
    publishedDisplay: "2020",
    reference: "Antiquity 94(374): 381–400; doi:10.15184/aqy.2020.14",
    url: "https://doi.org/10.15184/aqy.2020.14",
    sourceType: "scientific_study",
    notes:
      "Cited for the isotopic and microscopic study of decorated ostrich eggs in the British Museum (including Etruscan finds), which examined where the eggs were sourced and how they were worked and concluded that eggs moved between the eastern and western Mediterranean trading zones. Cited for the method and its general conclusion, not for the origin of any single Vulci egg.",
  },
  {
    key: "ce_wp_isis_tomb",
    title: "Isis Tomb, Vulci",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Isis_Tomb,_Vulci",
    publishedDisplay: "consulted October 2026",
    sourceType: "wikipedia",
    notes:
      "Used only as a finding aid for the tomb's history (opened 1839 by Lucien Bonaparte; objects sold 1844 and later acquired by the British Museum), the dating of its contents (c. 625–550 BCE) and its bibliography (Haynes 2000; Bubenheimer-Erhart 2012).",
  },
  {
    key: "ce_posth2021",
    title: "The origin and legacy of the Etruscans through a 2000-year archeogenomic time transect",
    author: "Cosimo Posth, Valentina Zaro, Maria A. Spyrou, et al.",
    workTitle: "Science Advances 7(39)",
    publishedYear: 2021,
    publishedDisplay: "2021",
    reference: "Science Advances 7(39): eabi7673; doi:10.1126/sciadv.abi7673",
    url: "https://doi.org/10.1126/sciadv.abi7673",
    sourceType: "scientific_study",
    notes:
      "Cited for genome-wide data from 82 individuals from Etruria and southern Italy dated 800 BCE–1000 CE: an Etruscan gene pool that was locally rooted and largely stable through the first millennium BCE, with a sporadic presence of individuals of likely northern African, Near Eastern and central European origin; and a population-wide shift to roughly 50% eastern Mediterranean-related ancestry in the Roman Imperial period. Reported from the abstract; per-individual details were not read.",
  },
  {
    key: "ce_moots2023",
    title: "A genetic history of continuity and mobility in the Iron Age central Mediterranean",
    author: "Hannah M. Moots, Margaret Antonio, Susanna Sawyer, et al.",
    workTitle: "Nature Ecology & Evolution 7",
    publishedYear: 2023,
    publishedDisplay: "2023",
    reference: "doi:10.1038/s41559-023-02143-4",
    url: "https://doi.org/10.1038/s41559-023-02143-4",
    sourceType: "scientific_study",
    notes:
      "Cited for Iron Age genomes from Kerkouane (a Punic town in Tunisia), Sant'Imbenia (Sardinia) and Tarquinia (Etruria): heterogeneous ancestry at all three, a notable number of individuals with North African-related ancestry at Tarquinia, which the authors connect with Carthaginian–Etruscan ties, and individuals at Kerkouane resembling Italian and Greek populations — movement in both directions. Note: published in Nature Ecology & Evolution, not Science Advances.",
  },
  {
    key: "ce_antonio2019",
    title: "Ancient Rome: A genetic crossroads of Europe and the Mediterranean",
    author: "Margaret L. Antonio, Ziyue Gao, Hannah M. Moots, et al.",
    workTitle: "Science 366(6466)",
    publishedYear: 2019,
    publishedDisplay: "2019",
    reference: "Science 366(6466): 708–714; doi:10.1126/science.aay6826",
    url: "https://doi.org/10.1126/science.aay6826",
    sourceType: "scientific_study",
    notes:
      "Cited for 127 genomes from 29 sites in and around Rome across about 12,000 years, showing marked individual diversity from the Iron Age onward, gene flow from the eastern Mediterranean in the Imperial period, and the presence of individuals with ancestry related to North Africa. Per-period counts were not read in this session.",
  },
  {
    key: "ce_fernandes2020",
    title: "The spread of steppe and Iranian-related ancestry in the islands of the western Mediterranean",
    author: "Daniel M. Fernandes, Alissa Mittnik, Iñigo Olalde, et al.",
    workTitle: "Nature Ecology & Evolution 4",
    publishedYear: 2020,
    publishedDisplay: "2020",
    reference: "Nature Ecology & Evolution 4: 334–345; doi:10.1038/s41559-020-1102-0",
    url: "https://doi.org/10.1038/s41559-020-1102-0",
    sourceType: "scientific_study",
    notes:
      "Cited for ancient genomes from the Balearics, Sicily and Sardinia, including a third-millennium BCE individual from Sardinia with mostly North African-related ancestry — evidence of Africa-to-Europe movement long before Carthage — and for the later appearance of new ancestry on Sardinia in the first millennium BCE.",
  },
  {
    key: "ce_ringbauer2025",
    title: "Punic people were genetically diverse with almost no Levantine ancestors",
    author: "Harald Ringbauer, Ayelet Salman-Minkov, Dalit Regev, et al.",
    workTitle: "Nature 643",
    publishedYear: 2025,
    publishedDisplay: "2025",
    reference: "Nature 643: 139–147; doi:10.1038/s41586-025-08913-3",
    url: "https://doi.org/10.1038/s41586-025-08913-3",
    sourceType: "scientific_study",
    notes:
      "Cited for genome-wide data from 14 Phoenician and Punic sites across the Levant, North Africa, Iberia, Sicily, Sardinia and Ibiza: Levantine ancestry was a minority at every Punic site, including Carthage; most individuals carried Sicilian–Aegean-related ancestry, with substantial North African-related ancestry common — Punic culture spread largely by adoption, not mass migration.",
  },
  {
    key: "ce_xella2013",
    title: "Phoenician bones of contention",
    author: "Paolo Xella, Josephine Quinn, Valentina Melchiorri, Peter van Dommelen",
    workTitle: "Antiquity 87(338)",
    publishedYear: 2013,
    publishedDisplay: "2013",
    reference: "Antiquity 87(338): 1199–1207; doi:10.1017/S0003598X00049036",
    url: "https://doi.org/10.1017/S0003598X00049036",
    sourceType: "academic_paper",
    notes:
      "Cited for the argument that the tophets of Carthage, Motya, Tharros, Sulcis and other western Phoenician sites were sanctuaries where children were sacrificed, combining the inscriptions (vows to Baal Hammon and Tanit) with the ancient literary testimony.",
  },
  {
    key: "ce_schwartz2010",
    title: "Skeletal remains from Punic Carthage do not support systematic sacrifice of infants",
    author: "Jeffrey H. Schwartz, Frank Houghton, Roberto Macchiarelli, Luca Bondioli",
    workTitle: "PLoS ONE 5(2)",
    publishedYear: 2010,
    publishedDisplay: "2010",
    reference: "PLoS ONE 5(2): e9177; doi:10.1371/journal.pone.0009177",
    url: "https://doi.org/10.1371/journal.pone.0009177",
    sourceType: "scientific_study",
    notes:
      "Cited as the main counter-argument on the tophet: the age profile of the cremated infants from Carthage's tophet resembles natural perinatal mortality and does not, on its own, show systematic sacrifice.",
  },
  {
    key: "ce_leglay1966",
    title: "Saturne africain. Histoire",
    author: "Marcel Leglay",
    publisher: "De Boccard, Paris (BEFAR 205)",
    publishedYear: 1966,
    publishedDisplay: "1966",
    reference: "Bibliothèque des Écoles françaises d'Athènes et de Rome 205",
    sourceType: "academic_book",
    notes:
      "Cited for the African Saturn: the cult of Baal Hammon continued under Roman rule in North Africa under the Latin name Saturn, with thousands of votive stelae of the first to third centuries CE — an African god given a Roman name, not a Roman god imported into Africa.",
  },
  {
    key: "ce_rives1995",
    title: "Religion and Authority in Roman Carthage from Augustus to Constantine",
    author: "James B. Rives",
    publisher: "Clarendon Press, Oxford",
    publishedYear: 1995,
    publishedDisplay: "1995",
    reference: "ISBN 0-19-814083-4",
    sourceType: "academic_book",
    notes:
      "Cited for Caelestis (the Roman-period Carthaginian goddess, often linked to Tanit) and Saturn in Roman Carthage, and for how far Roman-period cults continued Punic ones — continuity of place and function rather than an unbroken unchanged cult.",
  },
];

// ---------------------------------------------------------------------------
// Pictures (every file checked with the Commons API during research)
// ---------------------------------------------------------------------------

const PIC = {
  pyrgiPD: commonsPicture({
    fileName: "Pyrgi tablets.jpg",
    caption:
      "The three Pyrgi gold sheets side by side: two inscribed in Etruscan and one in Phoenician, recording Thefarie Velianas' dedication to Uni / Astarte. Reproduced from a published plate of the originals in the Villa Giulia museum, Rome.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Unknown author (plate reproduced in G. and L. Bonfante, The Etruscan Language, 2002)",
    institution: "Museo Nazionale Etrusco di Villa Giulia, Rome",
    objectDate: "c. 500 BCE",
    pixelWidth: 2300,
    pixelHeight: 1500,
  }),
  pyrgiVG: commonsPicture({
    fileName: "Lamine d'oro in lingua etrusca e fenicia con dedica di un luogo sacro a pyrgi, 510 ac ca. 01.jpg",
    caption:
      "The Pyrgi gold tablets as displayed in the Villa Giulia museum in Rome, photographed in 2017 — the actual objects found in the sanctuary of Pyrgi, Caere's harbour, in 1964.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Sailko",
    institution: "Museo Nazionale Etrusco di Villa Giulia, Rome",
    objectDate: "c. 500 BCE",
    pixelWidth: 4200,
    pixelHeight: 1555,
  }),
  carthagoEtruscan: commonsPicture({
    fileName: "Carthago exhibition - Etruscan Finds (49340680496).jpg",
    caption:
      "A display case in the 2019 Rome exhibition on Carthage: a modern gilded copy of the Pyrgi tablets, the ivory boar-shaped tessera with an Etruscan inscription from the Sainte-Monique necropolis at Carthage, and a feline-shaped Etruscan tessera (a resin copy) from Sant'Omobono in Rome.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.0",
    creator: "Jamie Heath",
    objectDate: "6th century BCE (originals); photographed 2019",
    provenanceNotes:
      "The exhibition label (transcribed on the Commons file page) identifies the boar plaque as from Carthage, Sainte-Monique necropolis, ivory, 6th century BCE; the Pyrgi tablets in this case are a modern copy.",
    pixelWidth: 4032,
    pixelHeight: 1960,
  }),
  byrsaHouses: commonsPicture({
    fileName: "Carthage, Byrsa hill (13585137033).jpg",
    caption:
      "Remains of houses of the Punic quarter on the Byrsa hill at Carthage, later buried under Roman construction — the hill that the ox-hide story is told about, though these houses are centuries later than any foundation.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 2.0",
    creator: "Verity Cridland",
    pixelWidth: 2288,
    pixelHeight: 1712,
  }),
  byrsaPorts: commonsPicture({
    fileName: "Carthage, Byrsa hill (13585102703).jpg",
    caption:
      "Distant view from the Byrsa hill towards the two Punic harbours of Carthage, the commercial basin and the circular naval harbour, which in their excavated form date to Carthage's last centuries.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 2.0",
    creator: "Verity Cridland",
    pixelWidth: 2288,
    pixelHeight: 1712,
  }),
  tophetStele: commonsPicture({
    fileName: "Tophet Carthage.2.jpg",
    caption:
      "A stele from the tophet of Carthage carved with the so-called sign of Tanit — one of thousands of votive stones from the sanctuary where cremated infants and animals were buried in urns.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Michel-georges bernard",
    pixelWidth: 407,
    pixelHeight: 637,
  }),
  tophetBardo: commonsPicture({
    fileName: "Stèle Tophet Bardo.jpg",
    caption:
      "A stele from the tophet of Salammbô at Carthage in the Bardo Museum, Tunis: the sanctuary type found also at Motya, Tharros, Sulcis and Hadrumetum, one of the clearest markers of the Punic network.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Pascal Radigue",
    institution: "Bardo National Museum, Tunis",
    pixelWidth: 825,
    pixelHeight: 1106,
  }),
  mogadorPlate: commonsPicture({
    fileName: "Phenician plate with red slip 7th century BCE excavated in Mogador island.jpg",
    caption:
      "A Phoenician red-slip plate of the 7th century BCE excavated on Mogador island off Essaouira, displayed in the Sidi Mohammed ben Abdallah museum — direct evidence of the Atlantic trading station.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Uploadalt",
    institution: "Sidi Mohammed ben Abdallah museum, Essaouira",
    objectDate: "7th century BCE",
    pixelWidth: 2679,
    pixelHeight: 1699,
  }),
  lixus: commonsPicture({
    fileName: "Lixus archeological site.jpg",
    caption:
      "The archaeological site of Lixus on its hill above the Loukkos river near Larache, Morocco. Most visible remains are Mauretanian and Roman; the earliest Phoenician levels lie beneath them.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Ideophagous",
    pixelWidth: 4080,
    pixelHeight: 3060,
  }),
  utica: commonsPicture({
    fileName: "Ancient Utica in 2019 04.jpg",
    caption:
      "Remains at ancient Utica, Tunisia, photographed in 2019. What stands is Roman; the Phoenician town that tradition dated to c. 1101 BCE is known from excavated deposits below and beside it.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Kritzolina",
    pixelWidth: 3648,
    pixelHeight: 5472,
  }),
  huelvaMelqart: commonsPicture({
    fileName: "Divinidad masculina, Reshef-Melqart (Museo de Huelva).jpg",
    caption:
      "A bronze figurine of a male god in the Reshef–Melqart pose, 8th–7th century BCE, found in the city of Huelva and now in the Museo de Huelva — Phoenician religious material from the earliest western contact zone.",
    shows: "artefact",
    identificationStatus: "probable",
    licence: "CC BY 4.0",
    creator: "José Luis Filpo Cabana",
    institution: "Museo de Huelva",
    objectDate: "8th–7th century BCE",
    pixelWidth: 2868,
    pixelHeight: 3824,
  }),
  cadizSarcophagus: commonsPicture({
    fileName: "Museo Arqueológico Provincial de Cádiz 50.jpg",
    caption:
      "The male anthropoid marble sarcophagus from Cádiz (ancient Gadir) in the Cádiz archaeological museum: a Phoenician-period burial centuries later than the first settlement, showing Gadir's wealth as the Atlantic hub of the network.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Axel Cotón Gutiérrez",
    institution: "Museo de Cádiz",
    pixelWidth: 3016,
    pixelHeight: 4032,
  }),
  kerkouane: commonsPicture({
    fileName: "Kerkouane - panorama.jpg",
    caption:
      "Panorama of Kerkouane on Cape Bon, Tunisia, a Punic town abandoned in the third century BCE and never rebuilt — one of the three Iron Age sites whose burials were sampled for ancient DNA by Moots et al. (2023).",
    shows: "site",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "CarlesVA",
    pixelWidth: 2592,
    pixelHeight: 1944,
  }),
  quartierPunique: commonsPicture({
    fileName: "Quartier Punique.JPG",
    caption:
      "The Punic quarter on the Byrsa hill, Carthage, photographed in 2004: the late Punic houses destroyed in 146 BCE, on the hill whose earliest layers carry the oldest dated pottery from the city.",
    shows: "site",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "BishkekRocks",
    pixelWidth: 2048,
    pixelHeight: 1536,
  }),
  aleriaForum: commonsPicture({
    fileName: "Aleria, le forum.jpg",
    caption:
      "The excavated forum of Aléria, eastern Corsica — the site of Greek Alalia. The forum itself is Roman; the Phocaean settlement over which the battle was fought lies in the same place.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Clio20",
    pixelWidth: 2048,
    pixelHeight: 1536,
  }),
  aleriaPanorama: commonsPicture({
    fileName: "Panorama Aleria Tavignano river Corsica.jpg",
    caption:
      "The Tavignano river and the town of Aléria on the east coast of Corsica, seen from Fort Matra: the coastal plain near which Herodotus' sea battle off Alalia was fought.",
    shows: "site",
    identificationStatus: "probable",
    licence: "CC BY-SA 4.0",
    creator: "Herbert wie",
    pixelWidth: 2048,
    pixelHeight: 1536,
  }),
  polybiusPerotti: commonsPicture({
    fileName: "Nicolai Perotti in Polybii Historiarum libros.jpg",
    caption:
      "A leaf of a 1482 manuscript of Niccolò Perotti's Latin translation of Polybius, with an illuminated border bearing the arms of the kings of Naples — one of the Renaissance routes by which Polybius' account of the treaties reached Western readers.",
    shows: "manuscript",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Bernardinus de Sardis (copyist)",
    objectDate: "1482",
    pixelWidth: 417,
    pixelHeight: 574,
  }),
  moziaKothon: commonsPicture({
    fileName: "Mozia-kothon-baal-tempel.JPG",
    caption:
      "The kothon basin and the adjacent sanctuary on the island of Motya (Mozia) off western Sicily, one of the main Phoenician and Carthaginian harbours facing North Africa.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Mboesch",
    pixelWidth: 3200,
    pixelHeight: 2133,
  }),
  tharros: commonsPicture({
    fileName: "Tharros - Sardinia - Italy - 08.jpg",
    caption:
      "Ruins of Tharros on the Sinis peninsula, west coast of Sardinia: a Phoenician and Punic town with its own tophet, later rebuilt by Rome — most of what is visible here is Roman-period.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Norbert Nagel",
    pixelWidth: 4217,
    pixelHeight: 2814,
  }),
  sulcisTophet: commonsPicture({
    fileName: "Carbonia-museo-archeologico-tophet.jpg",
    caption:
      "Tophet stelae and urns displayed in the Museo Archeologico Villa Sulcis at Carbonia, from the Punic sanctuaries of south-western Sardinia — the same sanctuary type as the tophet of Carthage.",
    shows: "museum_specimen",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Mboesch",
    institution: "Museo Archeologico Villa Sulcis, Carbonia",
    pixelWidth: 3200,
    pixelHeight: 2133,
  }),
  saCaleta: commonsPicture({
    fileName: "Phoenician Settlement remains, Sa Caleta, Ibiza 28 May 2012.JPG",
    caption:
      "Stone foundations of the Phoenician settlement on the headland of Sa Caleta, Ibiza — occupied in the later seventh century BCE and abandoned around 600 BCE for the site of Ibiza town.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 3.0",
    creator: "stavros1",
    pixelWidth: 3000,
    pixelHeight: 4000,
  }),
  galleyRelief: commonsPicture({
    fileName: "Relief depicting thin gypsum wall panel shows a Phoenician war galley sailing down the Euphrates River.jpg",
    caption:
      "UNVERIFIED — a carved gypsum wall panel, apparently Assyrian, showing a war galley with a ram, oars and shields along its side; the uploader describes it as a Phoenician galley, but the file names no museum, accession number or findspot, so neither the scene nor the identification is confirmed. Shown only as an example of how Levantine warships of the period were drawn.",
    shows: "artefact",
    identificationStatus: "unverified",
    licence: "CC BY-SA 4.0",
    creator: "SpeakingArch",
    pixelWidth: 857,
    pixelHeight: 643,
  }),
  ostrichEggVulci: commonsPicture({
    fileName: "Ostrich egg, carved & painted, Phoenician, Viterbo, Vulci, Polledrara cemetery, Isis Tomb, 625-600 BC, Brit Mus- The Etruscans exhibition - California Palace of the Legion of Honor - San Francisco, CA - DSC09649.jpg",
    caption:
      "A carved and painted ostrich egg from the Isis Tomb in the Polledrara cemetery at Vulci, labelled Phoenician work of 625–600 BCE, lent by the British Museum to an exhibition on the Etruscans in San Francisco.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Daderot",
    institution: "The British Museum, London",
    objectDate: "625–600 BCE",
    pixelWidth: 2749,
    pixelHeight: 3093,
  }),
  isisTombBM: commonsPicture({
    fileName: "IsisTomb-BM.JPG",
    caption:
      "Decorated ostrich eggs from the Isis Tomb at Vulci in their case at the British Museum, the group of Phoenician-traded eggs found together in one Etruscan tomb.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Jononmac46",
    institution: "The British Museum, London",
    pixelWidth: 4000,
    pixelHeight: 3000,
  }),
  buccheroOinochoe: commonsPicture({
    fileName: "Oinochoe in bucchero etruria meridionale, fine VII, inizio VI secolo ac..jpg",
    caption:
      "A black bucchero wine jug from southern Etruria, late 7th–early 6th century BCE, in the Florence archaeological museum — an example of the Etruscan tableware type found at Carthage, not a piece found there.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY 2.5",
    creator: "sailko",
    institution: "Museo Archeologico Nazionale, Florence",
    objectDate: "late 7th–early 6th century BCE",
    pixelWidth: 1332,
    pixelHeight: 1666,
  }),
  punicPendant: commonsPicture({
    fileName: "Glass double-headed pendant MET sf17194578color.jpg",
    caption:
      "A Punic glass pendant with two male masks, late 4th–3rd century BCE, in the Metropolitan Museum of Art — a type of Carthaginian-made ornament distributed across the western Mediterranean, including Italy and its islands.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "The Metropolitan Museum of Art, New York (17.194.578)",
    accessionNumber: "17.194.578",
    objectDate: "late 4th–3rd century BCE",
    pixelWidth: 1156,
    pixelHeight: 1168,
  }),
  villaricosEgg: commonsPicture({
    fileName: "Punic ostrich egg from Villaricos (M.A.N. 1935-4-VILL-T.609-7) 01.jpg",
    caption:
      "A Punic ostrich egg with painted red decoration from the cemetery of Villaricos (ancient Baria) in south-eastern Spain, in the National Archaeological Museum, Madrid — comparison material showing the same trade in eggs on the Iberian side of the network.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    institution: "Museo Arqueológico Nacional, Madrid",
    accessionNumber: "1935/4/VILL/T.609/7",
    objectDate: "c. 600–300 BCE",
    pixelWidth: 1898,
    pixelHeight: 1995,
  }),
  tanitBaalStele: commonsPicture({
    fileName: "Stèle avec inscription dédicataire à Tanit et Baʿal Ḥammon et décorée d'une fleur et d'un caducée - Musée du Louvre Antiquités orientales AO 23120.jpg",
    caption:
      "A Punic votive stele inscribed with a dedication to Tanit and Baal Hammon, decorated with a flower and a caduceus, in the Louvre — the pair of gods whose cults continued in Roman Africa as Caelestis and Saturn.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Shonagon",
    institution: "Musée du Louvre, Paris (Antiquités orientales)",
    accessionNumber: "AO 23120",
    pixelWidth: 1333,
    pixelHeight: 2762,
  }),
  caelestisDougga: commonsPicture({
    fileName: "Temple of Juno Caelestis (222-235 AD), Dougga (8158878783).jpg",
    caption:
      "The temple of Juno Caelestis at Dougga (Thugga), Tunisia, built 222–235 CE with a semicircular precinct: the Roman-period cult of the great goddess of Carthage in an African town.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.0",
    creator: "Carole Raddato",
    objectDate: "222–235 CE",
    pixelWidth: 2541,
    pixelHeight: 1907,
  }),
  saturnTimgad: commonsPicture({
    fileName: "Stèle Saturne Timgad.gif",
    caption:
      "A votive stele to Saturn from Timgad (Thamugadi), Algeria: the Roman-period form of the North African cult of Baal Hammon, worshipped under a Latin name.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 1.0",
    creator: "Nacéra Benseddik",
    pixelWidth: 162,
    pixelHeight: 324,
  }),
  tanitMosaic: commonsPicture({
    fileName: "Mosaik der Tanit in Kerkouane, Tunesien Januar 2015.JPG",
    caption:
      "The so-called sign of Tanit set in a floor at Kerkouane, Cape Bon — the emblem associated with Carthage's great goddess, in the floor of a Punic house there.",
    shows: "site",
    identificationStatus: "probable",
    licence: "CC BY-SA 4.0",
    creator: "Kritzolina",
    pixelWidth: 3648,
    pixelHeight: 2736,
  }),
  punicPorts: commonsPicture({
    fileName: "Punic Ports (Ports Puniques) of Carthage, Tunisia January 2024 - 2.jpg",
    caption:
      "The Punic ports of Carthage in 2024: the basins of the commercial and circular naval harbours that Scipio's army fought through in 146 BCE.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 2.0",
    creator: "Sharon Hahn Darlin",
    pixelWidth: 3993,
    pixelHeight: 2995,
  }),
  scipioPolybius: commonsPicture({
    fileName: "Scipion Emilien et Polybe devant les ruines de Carthage après la destruction de la ville.jpg",
    caption:
      "An 18th-century engraving (1797) after Jacobus Buys imagining Scipio Aemilianus and Polybius before the burning ruins of Carthage — a later artwork, not a record of the scene.",
    shows: "later_artwork",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Jacobus Buys (1724–1801)",
    objectDate: "1797",
    pixelWidth: 696,
    pixelHeight: 1122,
  }),
  douggaMausoleum: commonsPicture({
    fileName: "Libyco-Punic Mausoleum of Thugga - Dougga - Tunisia.jpg",
    caption:
      "The Libyco-Punic mausoleum at Dougga, Tunisia, a Numidian monument of about the second century BCE whose bilingual Libyco-Berber and Punic inscription shows Punic culture alive in Numidia after 146 BCE.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Skanlans007",
    pixelWidth: 1046,
    pixelHeight: 1351,
  }),
  leptisInscription: commonsPicture({
    fileName: "Inscription Theatre Leptis Magna Libya.JPG",
    caption:
      "The Latin text of a dedication over a theatre entrance at Leptis Magna, Libya, of 1–2 CE (IRT 321; its Neo-Punic counterpart is KAI 121), paid for by a local notable named Annobal Rufus — Punic names and Punic civic language continuing under Rome.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Papageizichta",
    pixelWidth: 3872,
    pixelHeight: 2592,
  }),
};

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

const events: SeedEvent[] = [
  // 1 -----------------------------------------------------------------------
  {
    slug: "phoenician-arrival-utica-lixus-gadir",
    title: "Phoenicians reach the far west: Utica, Lixus and Gadir",
    summary:
      "Ancient writers put the first Tyrian foundations in the west around 1100 BCE; the archaeology starts some two centuries later, with Huelva and Utica around 950–900 BCE.",
    description:
      "WHAT IT IS. Sailors and merchants from Tyre and the other Phoenician cities of the Levant set up trading posts and towns on both sides of the Strait of Gibraltar and along the coast of what is now Tunisia. Three names stand at the head of the tradition: Gadir (Cádiz) in southern Iberia, Lixus on the Atlantic coast of Morocco, and Utica north-west of later Carthage.\n\n" +
      "THE TRADITIONAL DATES. Velleius Paterculus (1.2.3) says a Tyrian fleet founded Gades about eighty years after the fall of Troy, and Utica shortly afterwards — on the usual ancient date for Troy, around 1104–1100 BCE. Pliny (NH 16.216) says the cedar beams of Utica's temple of Apollo had stood 1,178 years by his day, which gives about 1101 BCE. Pliny (NH 19.63) also reports that the shrine of Hercules (the Phoenician Melqart) at Lixus was said to be older than the one at Gades. These are claims of antiquity made by later writers, not records made at the time.\n\n" +
      "WHAT THE GROUND SAYS. No excavated Phoenician level anywhere in the West is as old as 1100 BCE. The earliest large concentration of Phoenician material is at Huelva, dated by its excavators to c. 900–770 BCE (others argue a little earlier or later). At Utica, a well excavated by a Tunisian–Spanish team gave radiocarbon dates of about 925–900 cal BCE, with Phoenician pottery alongside Greek, Sardinian, Villanovan, Tartessian and local Libyan wares. Lixus's earliest Phoenician levels are of the eighth century BCE, possibly the late ninth.\n\n" +
      "CORRECTED HERE. The research brief gave 'Lixus and Utica, 9th–8th century'. Utica now has dates around the turn of the tenth to ninth century, so the two sites are given separate archaeological claims.\n\n" +
      "WHO WAS ALREADY THERE. These towns were built among existing populations — in Africa the peoples Greek writers called Libyans — and the Utica well already contains locally made North African pottery beside the imports. Nobody involved is called a Moor in any source; that word belongs to a much later age.\n\n" +
      "WHAT IT DOES NOT SHOW. Neither the traditional nor the archaeological dates show a mass migration. Phoenician settlement in the West was a network of small trading communities, and 'Phoenician' was itself a Greek label rather than these people's own collective name.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    eventTypeNote: "Ancient foundation dates set against excavated and radiocarbon-dated levels.",
    tags: laneTags("carthageEtruria", "phoenicians", "utica", "lixus", "gadir", "huelva", "radiocarbon", "foundation-traditions"),
    civilisations: ["Phoenicians", "Iberia", "Amazigh peoples"],
    locationName: "Utica (Tunisia), Lixus (Morocco) and Gadir (Cádiz, Spain)",
    lat: 37.056,
    lng: 10.062,
    identificationStatus: "secure",
    imageUrl: PIC.lixus.url,
    media: [PIC.lixus, PIC.utica, PIC.huelvaMelqart],
    claims: [
      {
        sourceKey: "ce_velleius",
        citations: [
          { sourceKey: "ce_aubet", relation: "context", note: "Explains how the classical foundation dates were built from Troy-based chronologies and why archaeologists no longer take them at face value." },
          { sourceKey: "ce_quinn", relation: "context", note: "Warns that these traditions served later identities and that 'Phoenician' was an outsiders' label." },
        ],
        startYear: bce(1104),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Gades founded by a Tyrian fleet about eighty years after the fall of Troy (c. 1104 BCE)",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        temporalClaimType: "traditional_date",
        whatIsDated: "the foundation of Gadir (Cádiz)",
        evidence:
          "Velleius' relative date (paraphrased) converted with the commonly used ancient date for the fall of Troy (1184/1183 BCE). The figure is only as good as the Troy date it hangs on, which is itself a Hellenistic calculation.",
      },
      {
        sourceKey: "ce_pliny",
        citations: [
          { sourceKey: "ce_aubet", relation: "context", note: "Discusses Pliny's Utica figure as part of the same family of 'high' traditional dates." },
          { sourceKey: "ce_velleius", relation: "supports", note: "Independently places Utica a few years after Gadir, in the same horizon." },
        ],
        startYear: bce(1101),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Utica's temple beams had stood 1,178 years by Pliny's day (c. 1101 BCE)",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        temporalClaimType: "traditional_date",
        whatIsDated: "the foundation of Utica",
        evidence:
          "Arithmetic on Pliny's statement (NH 16.216, paraphrased): 1,178 years before the 70s CE. The apparent precision comes from the arithmetic, not from any record of the founding.",
      },
      {
        sourceKey: "ce_lopezcastro2016",
        citations: [
          { sourceKey: "ce_aubet", relation: "context", note: "Places Utica in the wider early Phoenician horizon of the central and western Mediterranean." },
        ],
        startYear: bce(925),
        endYear: bce(900),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Utica well deposit, c. 925–900 cal BCE (radiocarbon on seeds)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        temporalClaimType: "radiometric_date",
        whatIsDated: "the earliest excavated Phoenician deposit at Utica",
        evidence:
          "Calibrated radiocarbon dates on seeds from the fill of a well associated with a building, reported by the excavators as matching the earliest Phoenician levels in southern Iberia. It dates the deposit, not the town's first day; older levels could lie elsewhere on the site.",
      },
      {
        sourceKey: "ce_gonzalez2004",
        citations: [
          { sourceKey: "ce_aubet", relation: "supports", note: "Treats Huelva as the earliest concentration of Phoenician material in the West, from the tenth or early ninth century BCE." },
        ],
        startYear: bce(900),
        endYear: bce(770),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Huelva Phoenician emporium, c. 900–770 BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "archaeological_date",
        whatIsDated: "the earliest large body of Phoenician material in the far West (Huelva, near Gadir)",
        evidence:
          "Pottery chronology of a large deposit of sherds from central Huelva, with later radiocarbon work pulling the start both higher (tenth century) and lower (late ninth). Huelva was a local Tartessian town where Phoenicians traded, not a Phoenician foundation.",
      },
      {
        sourceKey: "ce_aranegui2005",
        citations: [
          { sourceKey: "ce_aubet", relation: "supports", note: "Dates the first Phoenician presence at Lixus to the eighth century BCE." },
          { sourceKey: "ce_pliny", relation: "disputes", note: "The tradition that Lixus' Melqart shrine was older than Gades' implies a far earlier date than the excavated levels show." },
        ],
        startYear: bce(825),
        endYear: bce(700),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Lixus earliest Phoenician levels, 8th century BCE (possibly late 9th)",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "archaeological_date",
        whatIsDated: "the earliest excavated Phoenician occupation at Lixus",
        evidence:
          "Stratified Phoenician pottery from the Moroccan–Spanish excavations on the hill above the Loukkos river. The range is given as the eighth century with a possible late-ninth-century start because the excavators and later commentators differ on the earliest material.",
      },
    ],
  },

  // 2 -----------------------------------------------------------------------
  {
    slug: "carthage-foundation",
    title: "Foundation of Carthage",
    summary:
      "Tradition dates Carthage's founding by Tyrian settlers to 814/813 BCE; the earliest excavated levels belong to the late ninth or first half of the eighth century BCE.",
    description:
      "WHAT IT IS. Carthage — Qart-ḥadasht, 'New City', in Phoenician — was founded by settlers from Tyre on a peninsula in the Gulf of Tunis, in a region already inhabited by North African peoples whom Greek writers called Libyans. It became the largest Phoenician city of the West.\n\n" +
      "THE TRADITIONAL DATE. The familiar date, 814/813 BCE, goes back to the Sicilian historian Timaeus (fourth–third century BCE), whose work is lost; Dionysius of Halicarnassus (1.74.1) reports that Timaeus put the foundations of Rome and of Carthage in the same year, the thirty-eighth before the first Olympiad. Josephus (Against Apion 1.18) quotes a Tyrian king list from Menander of Ephesus that places the founding in the seventh year of Pygmalion of Tyre, which modern conversions also put in the late ninth century. Justin (18.6.9), abridging Pompeius Trogus, says seventy-two years before Rome — about 825 BCE.\n\n" +
      "THE STORY. Justin (18.4–6, paraphrased) tells how Elissa — Virgil's Dido — fled her brother Pygmalion, landed in Africa, and bargained with the local people for as much land as an ox-hide could cover, then cut the hide into strips to enclose the hill later called Byrsa (a Greek pun on byrsa, 'hide'). He adds that the settlers paid the Africans an annual rent for the land, and that Hiarbas, king of the Maxitani, demanded Elissa in marriage. The story is a foundation legend, but its frame — newcomers on land held by others, paying for it — matches the later historical fact that Carthage paid tribute to its Libyan neighbours for generations.\n\n" +
      "WHAT THE GROUND SAYS. Radiocarbon dates from the earliest deposits excavated in the city (Docter et al. 2008) were argued to bring the archaeology close to the late ninth century, and an early pottery sequence on the Byrsa hill is dated to the first half of the eighth century, possibly starting at the end of the ninth (Maraoui Telmini & Schön 2020).\n\n" +
      "CORRECTED HERE. The brief cited '820–760 BCE' from Docter et al.; that exact range could not be checked against the paper in this session, so the archaeological claim is given as 'late ninth to first half of the eighth century', the range the published abstracts support.\n\n" +
      "WHAT IT DOES NOT SHOW. Neither date makes the Libyan population newcomers or the Carthaginians a single 'race'. Recent ancient DNA from Carthage itself shows a mixed population with little Levantine ancestry (see the ancestry record).",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    eventTypeNote: "A foundation tradition and the archaeology, kept as separate claims.",
    tags: laneTags("carthageEtruria", "carthage", "phoenicians", "tyre", "elissa-dido", "byrsa", "radiocarbon", "foundation-traditions"),
    people: ["Elissa (Dido)", "Pygmalion of Tyre", "Hiarbas", "Timaeus of Tauromenium"],
    civilisations: ["Carthage", "Phoenicians", "Amazigh peoples"],
    locationName: "Carthage (near modern Tunis)",
    lat: 36.8528,
    lng: 10.3233,
    identificationStatus: "secure",
    imageUrl: PIC.byrsaHouses.url,
    media: [PIC.byrsaHouses, PIC.quartierPunique],
    claims: [
      {
        sourceKey: "ce_dionysius",
        citations: [
          { sourceKey: "ce_lancel", relation: "context", note: "Explains how Timaeus' synchronism produced 814/813 BCE and why it became the conventional date." },
          { sourceKey: "ce_josephus", relation: "supports", note: "The Tyrian king list from Menander, independently of Timaeus, places the founding in the late ninth century." },
        ],
        startYear: bce(814),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "814/813 BCE — Timaeus, as reported by Dionysius of Halicarnassus",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        temporalClaimType: "traditional_date",
        evidence:
          "Timaeus' date (38 years before the first Olympiad of 776 BCE), preserved by Dionysius 1.74.1 (paraphrased). It is a Greek historian's synchronism made about five centuries after the event, and its neat pairing with Rome is itself a reason for caution.",
      },
      {
        sourceKey: "ce_justin",
        citations: [
          { sourceKey: "ce_lancel", relation: "context", note: "Discusses Justin's version of the Elissa story and its dating statement alongside Timaeus." },
          { sourceKey: "ce_hoyos", relation: "context", note: "On the land payment to the Libyans and what the legend may preserve about Carthage's relations with its neighbours." },
        ],
        startYear: bce(825),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "seventy-two years before the foundation of Rome (Justin 18.6.9)",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        temporalClaimType: "traditional_date",
        evidence:
          "Justin's relative date (paraphrased), converted with Varro's 753 BCE for Rome. It shows the ancient tradition did not speak with one voice even before modern archaeology.",
      },
      {
        sourceKey: "ce_docter2008",
        citations: [
          { sourceKey: "ce_maraoui2020", relation: "supports", note: "An early Byrsa pottery sequence with radiocarbon data dated to the first half of the eighth century, possibly from the end of the ninth." },
          { sourceKey: "ce_lancel", relation: "context", note: "Summarises the older excavated evidence: nothing found at Carthage had been securely older than the eighth century." },
        ],
        startYear: bce(825),
        endYear: bce(750),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "earliest excavated levels, late 9th to first half of the 8th century BCE (radiocarbon and pottery)",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        temporalClaimType: "archaeological_date",
        evidence:
          "Radiocarbon on bone and seeds from the lowest deposits in the city centre, together with the pottery sequence. The dates show the city existed by around 800 BCE; they cannot confirm or refute a particular year, and the very first settlement may lie in unexcavated ground.",
        notes: "The brief's '820–760 BCE' is not repeated because it could not be checked against Docter et al. in this session.",
      },
    ],
  },

  // 3 -----------------------------------------------------------------------
  {
    slug: "phoenician-trading-networks-north-africa",
    title: "Phoenician and Punic trading posts along the North African coast",
    summary:
      "Between about 800 and 600 BCE a chain of Phoenician and later Carthaginian harbours ran from Leptis in Libya to Mogador on the Atlantic coast of Morocco.",
    description:
      "WHAT IT IS. Beyond Utica and Carthage, Phoenician-speaking traders founded or frequented harbours all along the North African coast. Sallust (Bellum Iugurthinum 19.1, paraphrased) lists Hippo, Hadrumetum (Sousse) and Leptis among towns founded by Phoenicians. On the Atlantic side, Lixus on the Loukkos river and the small island of Mogador off Essaouira were the far end of the network.\n\n" +
      "MOGADOR. Excavations on the island from the 1950s (published by André Jodin in 1966) and later by Spanish and German teams found red-slip pottery, amphorae and inscribed sherds of the seventh and sixth centuries BCE. It is the southernmost securely identified Phoenician site on the African Atlantic coast, probably a seasonal station tied to Lixus and Gadir.\n\n" +
      "THE SILENT TRADE. Herodotus (4.196, paraphrased) reports a Carthaginian account of trade with a people of Libya beyond the Pillars of Heracles: goods left on the shore, gold set beside them, and exchange completed without either side meeting the other until both were satisfied. It is a hearsay report of the fifth century BCE and cannot be tied to a place; it shows how Carthaginians described their Atlantic trade to Greeks, not exactly how it worked.\n\n" +
      "LOCAL PEOPLE. These were contact zones. At Utica, Lixus and Mogador local handmade pottery sits beside imports, and the hinterland belonged to North African communities whose later descendants include the Numidian and Mauretanian kingdoms. Calling the inhabitants 'Moors' at this date would be wrong: the term is not attested for centuries.\n\n" +
      "HOW IT IS DATED. Mostly by imported pottery — Phoenician red-slip wares, amphorae, Greek fine wares — whose dates come from sequences in the Levant, Greece and Iberia, with radiocarbon at a few sites.\n\n" +
      "WHERE THE ACCOUNTS DISAGREE. The ancient lists of foundations do not give dates for most of these towns, and archaeology has reached the earliest levels at only a few of them; the 800–600 BCE bracket is the period with excavated evidence, not a statement that every site began then.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("carthageEtruria", "phoenicians", "carthage", "mogador", "lixus", "silent-trade", "trade-networks"),
    civilisations: ["Phoenicians", "Carthage", "Amazigh peoples"],
    locationName: "North African coast from Leptis (Libya) to Mogador (Essaouira, Morocco)",
    imageUrl: PIC.mogadorPlate.url,
    media: [PIC.mogadorPlate, PIC.cadizSarcophagus],
    claims: [
      {
        sourceKey: "ce_aubet",
        citations: [
          { sourceKey: "ce_jodin1966", relation: "supports", note: "Publishes the seventh–sixth century BCE Phoenician material from Mogador island." },
          { sourceKey: "ce_aranegui2005", relation: "supports", note: "Eighth-century Phoenician levels at Lixus, the main Atlantic port behind Mogador." },
          { sourceKey: "ce_sallust", relation: "context", note: "Lists Hippo, Hadrumetum and Leptis as Phoenician foundations, without dates." },
        ],
        startYear: bce(800),
        endYear: bce(600),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "c. 800–600 BCE — Phoenician harbours from Leptis to Mogador",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "date_range",
        evidence:
          "The period in which excavated Phoenician material appears at the Atlantic sites and is well established on the Tunisian coast. A bracket for the network as known from excavation, not a foundation date for each site.",
      },
      {
        sourceKey: "ce_jodin1966",
        citations: [
          { sourceKey: "ce_aubet", relation: "supports", note: "Treats Mogador as a seasonal Phoenician station of the seventh century BCE, dependent on Lixus and Gadir." },
        ],
        startYear: bce(700),
        endYear: bce(550),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Mogador island, 7th–6th century BCE",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        temporalClaimType: "archaeological_date",
        whatIsDated: "the Phoenician use of Mogador island",
        evidence:
          "Dated by the types of imported red-slip pottery and amphorae. Later German–Moroccan excavations have refined the picture, but the seventh-century core of the occupation is not in dispute.",
      },
      {
        sourceKey: "ce_herodotus",
        citations: [
          { sourceKey: "ce_lancel", relation: "context", note: "Discusses the silent-trade passage as evidence for Carthaginian Atlantic trade in gold." },
        ],
        startYear: bce(430),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Herodotus records the Carthaginian report of 'silent trade', written c. 430 BCE",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "the first written report of Carthaginian trade beyond the Pillars of Heracles",
        evidence:
          "The date of Herodotus' writing, not of the trade it describes. The passage (4.196) is paraphrased here.",
      },
    ],
  },

  // 4 -----------------------------------------------------------------------
  {
    slug: "battle-of-alalia",
    title: "Battle of Alalia: Etruscans and Carthaginians against the Phocaeans",
    summary:
      "Around 540–535 BCE a combined Etruscan and Carthaginian fleet fought Phocaean Greeks off Alalia in Corsica; the Greeks won at ruinous cost and left the island.",
    description:
      "WHAT IT IS. The earliest recorded military alliance between a North African power and an Italian one. Greek settlers from Phocaea in Asia Minor had founded Alalia (modern Aléria) on the east coast of Corsica; after the Persians took Phocaea, more refugees arrived, and Herodotus says they spent five years raiding their neighbours. The Carthaginians and the Etruscans — Herodotus calls them Tyrrhenians — then sent sixty ships each against the Phocaeans' sixty.\n\n" +
      "WHAT HERODOTUS SAYS (1.165–167, paraphrased). The Phocaeans won, but lost forty ships and had the rams of the rest bent, and they abandoned Alalia for Rhegium and later founded Hyele (Elea/Velia) in southern Italy. The crews captured by the Carthaginians and the Etruscans were divided by lot; the people of Agylla (the Greek name for Caere/Cerveteri) took their share ashore and stoned them to death. Afterwards, Herodotus says, anything that passed the place where they lay became crippled, until the Delphic oracle told the Agyllaeans to honour the dead with funeral sacrifices and games, which they were still holding in his day.\n\n" +
      "HOW IT IS DATED. Herodotus gives no year. Modern dates are built from his relative chronology — the Persian capture of Phocaea, conventionally c. 546–545 BCE, then five years at Alalia — which gives 'some time between 540 and 535 BCE'.\n\n" +
      "WHAT IT MEANT. Corsica fell into the Etruscan sphere and Sardinia into the Carthaginian one; Greek westward expansion in the Tyrrhenian Sea was checked. The Pyrgi tablets from Caere's own harbour, a generation later, and Aristotle's remark that Etruscans and Carthaginians had formal agreements, show the alliance was not a one-off.\n\n" +
      "WHAT IT DOES NOT SHOW. It is an alliance of states, not a mixing of peoples, and it tells us nothing about the ancestry of either side. Herodotus' account is Greek, written about a century later, and the moral tale of the stoned prisoners is told to explain a cult practice at Caere.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("carthageEtruria", "carthage", "etruscans", "alalia", "phocaeans", "caere", "naval-battle"),
    civilisations: ["Carthage", "Etruscans", "Ancient Greece"],
    locationName: "Off Alalia (Aléria), eastern Corsica",
    lat: 42.106,
    lng: 9.513,
    identificationStatus: "secure",
    imageUrl: PIC.aleriaForum.url,
    media: [PIC.aleriaForum, PIC.aleriaPanorama],
    claims: [
      {
        sourceKey: "ce_herodotus",
        citations: [
          { sourceKey: "ce_casson1991", relation: "supports", note: "Reconstructs the battle and its date from Herodotus' sequence of events." },
          { sourceKey: "ce_wp_alalia", relation: "context", note: "Gives the conventional modern range, between 540 and 535 BCE." },
          { sourceKey: "ce_gras1985", relation: "context", note: "Sets the battle in the archaic Tyrrhenian trade rivalry of Etruscans, Carthaginians and Greeks." },
        ],
        startYear: bce(540),
        endYear: bce(535),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "some time between 540 and 535 BCE",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        temporalClaimType: "estimated_range",
        evidence:
          "A modern reconstruction: the conventional date of the fall of Phocaea to Harpagus (c. 546–545 BCE) plus the five years Herodotus says the Phocaeans spent at Alalia before the battle.",
      },
      {
        sourceKey: "ce_herodotus",
        citations: [
          { sourceKey: "ce_lancel", relation: "context", note: "Discusses Herodotus' account as the only narrative of the battle and its consequences for Carthage in Sardinia." },
          { sourceKey: "ce_haynes2000", relation: "context", note: "On Caere (Agylla) and the cult that Herodotus connects with the killing of the prisoners." },
        ],
        startYear: bce(545),
        endYear: bce(535),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "five years after the Phocaean refugees came to Alalia",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "relative_date",
        evidence:
          "What the ancient source itself gives: a relative date (1.165–166, paraphrased), shown as the window it implies once the Persian capture of Phocaea is placed in the 540s.",
      },
    ],
  },

  // 5 -----------------------------------------------------------------------
  {
    slug: "pyrgi-gold-tablets",
    title: "The Pyrgi gold tablets: an Etruscan–Phoenician dedication",
    summary:
      "Three inscribed gold sheets of about 500 BCE from Caere's harbour sanctuary record a dedication by Thefarie Velianas to a goddess called Uni in Etruscan and Astarte in Phoenician.",
    description:
      "WHAT IT IS. In 1964 excavators at Pyrgi (Santa Severa), the port and sanctuary of the Etruscan city of Caere, found three thin gold sheets that had been nailed up in a temple and later folded and buried. Two carry Etruscan text and one Phoenician. They are now in the Villa Giulia museum in Rome, and they are the most important bilingual text for Etruscan.\n\n" +
      "WHAT THEY SAY (paraphrased). The Phoenician text dedicates a holy place to 'the Lady', Astarte, on behalf of Thefarie Velianas (in Phoenician 'Tiberius Velianas'), who is given a royal title over the people of Caere; it is dated to the third year of his reign, in a named month, on a day connected with the burial of a deity, and it ends with a wish that the years of the goddess's statue in her temple be as many as the stars. The Etruscan texts name the goddess Uni (the Etruscan counterpart of Juno) and call Thefarie a zilath, a magistrate, rather than a king. The two languages say similar things but are not word-for-word translations, which is why the Etruscan cannot simply be read off the Phoenician. The final lines of the Phoenician are disputed.\n\n" +
      "HOW IT IS DATED. By the archaeological context of the temple (Temple B, built c. 510–500 BCE) and the letter forms; 'c. 500 BCE' is the usual figure. The text's own date is relative — the third year of a reign we cannot place exactly.\n\n" +
      "THE AFRICA QUESTION. Astarte is a Levantine Phoenician goddess, not an indigenous North African one. Why an Etruscan ruler honoured her in Phoenician is debated: traders from Carthage or other Punic cities in Caere's port, a political alliance, or Carthaginian backing for Thefarie (Pallottino's hypothesis) are all proposed. The tablets show close Etruscan–Phoenician contact in the decade of the first Rome–Carthage treaty; they do not show that Etruscans came from Africa or that Etruscan religion came from Africa.\n\n" +
      "CORRECTED HERE. The brief's '510–500 BCE' is kept as the range for the temple and the dedication; the Pyrgi literature generally writes 'c. 500 BCE'.",
    category: "archaeology",
    subcategory: LANE,
    eventType: "archaeological_interpretation",
    tags: laneTags("carthageEtruria", "etruscans", "phoenicians", "pyrgi", "caere", "astarte", "uni", "bilingual-inscription"),
    people: ["Thefarie Velianas"],
    civilisations: ["Etruscans", "Phoenicians", "Carthage"],
    locationName: "Pyrgi (Santa Severa), the harbour sanctuary of Caere, Italy",
    lat: 42.016,
    lng: 11.958,
    identificationStatus: "secure",
    evidenceStatus: "verified_physical_remains",
    imageUrl: PIC.pyrgiVG.url,
    media: [PIC.pyrgiVG, PIC.pyrgiPD],
    claims: [
      {
        sourceKey: "ce_pyrgi_object",
        citations: [
          { sourceKey: "ce_colonna1964", relation: "supports", note: "First edition: excavation context in the sanctuary and the date of Temple B." },
          { sourceKey: "ce_schmitz1995", relation: "supports", note: "Philological study of the Phoenician text; dates and reads the dedication." },
          { sourceKey: "ce_wp_pyrgi", relation: "context", note: "Finding aid giving the usual date (c. 500 BCE) and bibliography." },
        ],
        startYear: bce(510),
        endYear: bce(490),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "c. 500 BCE (temple context and letter forms)",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "archaeological_date",
        evidence:
          "Dated by the building of the temple they belonged to and by the forms of the Phoenician and Etruscan letters. A date for the sheets, not for the beginning of Etruscan–Phoenician contact, which is centuries older.",
      },
      {
        sourceKey: "ce_schmitz1995",
        citations: [
          { sourceKey: "ce_bonnet1996", relation: "context", note: "On Astarte's cult in the Phoenician West and her identification with other goddesses, including Uni." },
          { sourceKey: "ce_haynes2000", relation: "context", note: "Sets Thefarie Velianas and the Pyrgi sanctuary in Caere's history." },
        ],
        startYear: bce(510),
        endYear: bce(490),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "in the third year of Thefarie Velianas' reign (the text's own date)",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "relative_date",
        evidence:
          "The inscription dates itself by regnal year and month, which cannot be converted to a calendar year independently; it is placed in the same window as the archaeological date.",
      },
    ],
  },

  // 6 -----------------------------------------------------------------------
  {
    slug: "carthage-etruscan-ivory-tessera",
    title: "An Etruscan ivory token from a Carthage cemetery",
    summary:
      "A small 6th-century BCE ivory boar with an Etruscan inscription, found in the Sainte-Monique necropolis at Carthage in 1898, is usually read as a guest-friendship token naming a person.",
    description:
      "WHAT IT IS. A small pierced ivory plaque, carved on one face as a crouching boar and inscribed on the other with a short Etruscan text running right to left. It was found in 1898 in the Punic necropolis of Sainte-Monique at Carthage. Émile Benveniste called it the only Etruscan inscription found outside Italy, leaving aside the Zagreb mummy wrappings (not an inscription) and the Lemnos stele (not strictly Etruscan). In the 2019 Rome exhibition on Carthage it was shown as a tessera hospitalis, a token of guest-friendship carrying a personal name, beside a similar Etruscan token from Rome's Sant'Omobono sanctuary.\n\n" +
      "WHAT IT SAYS. Its first editor, Michel Bréal (1899), read a dedication to the Carthaginian god Melqart. That reading was corrected the same year on two letters (the sixth is n, not m; the fourteenth is z, not v) by J. Martha, from a photograph and from R. Cagnat's look at the original, and Benveniste (1933) argued that the 'Melqart' interpretation had survived only because it was repeated on authority. The reading usually quoted today begins mi puinel karθazie — interpreted as 'I am Puinel the Carthaginian' or 'Puinel from Carthage'. UNVERIFIED: that transcription and translation could not be checked against an epigraphic edition during this research, and it is given here as the commonly cited reading, not as an established one.\n\n" +
      "WHY IT MATTERS. A token of this kind was split or matched between partners to prove a guest-friendship. If the usual reading is right, an Etruscan-writing person recorded a tie with someone identified by the name of Carthage, and the token ended up in a Carthaginian grave — personal relationships, not just traded goods, crossing between Etruria and North Africa.\n\n" +
      "HOW IT IS DATED. By its burial context in the Sainte-Monique necropolis and the style of the letters: sixth century BCE.\n\n" +
      "WHAT IT DOES NOT SHOW. One token is evidence of one relationship. It does not show an Etruscan colony at Carthage, nor anything about either person's ancestry.",
    category: "archaeology",
    subcategory: LANE,
    eventType: "archaeological_interpretation",
    eventTypeNote: "A real object whose inscription's reading is partly disputed.",
    tags: laneTags("carthageEtruria", "etruscans", "carthage", "tessera-hospitalis", "inscription", "guest-friendship"),
    civilisations: ["Etruscans", "Carthage"],
    locationName: "Sainte-Monique necropolis, Carthage",
    lat: 36.8528,
    lng: 10.3233,
    identificationStatus: "probable",
    evidenceStatus: "verified_physical_remains",
    imageUrl: PIC.carthagoEtruscan.url,
    media: [PIC.carthagoEtruscan],
    claims: [
      {
        sourceKey: "ce_carthage_tessera",
        citations: [
          { sourceKey: "ce_benveniste1933", relation: "supports", note: "Records the 1898 find in the Sainte-Monique necropolis, the boar and the right-to-left Etruscan inscription, and corrects the early 'Melqart' reading." },
          { sourceKey: "ce_lancel", relation: "context", note: "Discusses Etruscan finds at Carthage as evidence of close archaic relations between the two." },
        ],
        startYear: bce(600),
        endYear: bce(501),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "6th century BCE (burial context and letter forms)",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "archaeological_date",
        evidence:
          "The date of the necropolis context and the script, as displayed in the 2019 exhibition. Not a narrower date: no published stratigraphy for the individual grave was read in this session.",
      },
    ],
  },

  // 7 -----------------------------------------------------------------------
  {
    slug: "rome-carthage-first-treaty",
    title: "The first treaty between Rome and Carthage",
    summary:
      "Polybius dates the first Rome–Carthage treaty to the first year of the Republic (509/508 BCE); a minority of scholars place it in 348 BCE.",
    description:
      "WHAT IT IS. Polybius (3.22–26) says he saw the bronze tablets of the treaties between Rome and Carthage kept in Rome, and translated the archaic Latin of the first one with difficulty. He dates it to the consulship of Lucius Junius Brutus and Marcus Horatius, the first consuls after the expulsion of the kings — 509/508 BCE on the conventional chronology.\n\n" +
      "WHAT IT SAYS (paraphrased from Polybius 3.22). Romans and their allies were not to sail beyond the 'Fair Promontory' (usually taken to be Cape Bon or Cape Farina, north-east of Carthage) unless driven by storm or enemies; any Roman who came to Africa or Sardinia to trade could conclude business only in the presence of a herald or clerk, with the sale guaranteed by the Carthaginian state; in the Carthaginian part of Sicily Romans were to have equal rights; and Carthage was not to harm the Latin towns subject to Rome — Ardea, Antium, Laurentum, Circeii, Tarracina — nor build forts in Latium.\n\n" +
      "WHAT IT SHOWS. Carthage controlled access to the North African coast west of Carthage and to Sardinia, and regulated foreign traders there. The treaty belongs to a world of such agreements: Aristotle (Politics 3.9) remarks in passing that Etruscans and Carthaginians had treaties about imports and about not wronging one another, and the Pyrgi tablets come from the same decade. Rome had just ceased to be ruled by kings of Etruscan origin, and was stepping into treaty relations that Etruscan cities already had.\n\n" +
      "WHERE THE ACCOUNTS DISAGREE. Diodorus (16.69.1) and Livy (7.27.2) record a treaty in 348 BCE, and Diodorus calls it the first. Some historians, from Mommsen on, have therefore argued that Polybius' 'first treaty' is the 348 one and his early date a mistake. Most now accept Polybius' date, because he says he read the document and remarks on its archaic language, but the question is treated as open; both claims are kept here.\n\n" +
      "WHAT IT DOES NOT SHOW. It is not evidence of hostility — at this stage it is a commercial and spheres-of-influence agreement, centuries before the Punic Wars.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("carthageEtruria", "carthage", "rome", "treaty", "polybius", "sardinia", "etruscans"),
    people: ["Lucius Junius Brutus", "Marcus Horatius", "Polybius"],
    civilisations: ["Carthage", "Rome", "Etruscans"],
    locationName: "Rome and Carthage",
    imageUrl: PIC.polybiusPerotti.url,
    media: [PIC.polybiusPerotti, PIC.byrsaPorts],
    claims: [
      {
        sourceKey: "ce_polybius",
        citations: [
          { sourceKey: "ce_walbank1957", relation: "supports", note: "The standard commentary; weighs the evidence and accepts the early date as defensible." },
          { sourceKey: "ce_hoyos", relation: "context", note: "Sets the treaty in Carthage's control of African and Sardinian trade." },
          { sourceKey: "ce_aristotle", relation: "context", note: "Etruscan–Carthaginian treaties of the same kind existed, so an early Roman one fits its world." },
        ],
        startYear: bce(509),
        endYear: bce(508),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "the consulship of Lucius Junius Brutus and Marcus Horatius, the first consuls (509/508 BCE)",
        datingMethod: "historical_record",
        chronology: "conventional",
        temporalClaimType: "explicit_date",
        evidence:
          "Polybius dates by the consuls named on or with the document he says he saw (3.22, paraphrased). The calendar year depends on the reconstructed list of early consuls, which is itself uncertain for this period.",
      },
      {
        sourceKey: "ce_diodorus",
        citations: [
          { sourceKey: "ce_livy", relation: "supports", note: "Records a treaty with Carthaginian envoys in 348 BCE." },
          { sourceKey: "ce_walbank1957", relation: "context", note: "Reviews the argument that Polybius' first treaty should be identified with the 348 BCE agreement." },
        ],
        startYear: bce(348),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "348 BCE — the treaty Diodorus calls the first",
        datingMethod: "historical_record",
        chronology: "disputed",
        temporalClaimType: "explicit_date",
        evidence:
          "Diodorus (16.69.1, paraphrased) presents the 348 BCE treaty as the first between the two states. Whether this contradicts Polybius or simply ignores an earlier text is the heart of the debate.",
      },
    ],
  },

  // 8 -----------------------------------------------------------------------
  {
    slug: "western-mediterranean-trade-routes-africa-iberia-islands",
    title: "Carthage's sea routes to Sicily, Sardinia, Ibiza and Iberia",
    summary:
      "From the eighth century BCE a network of Phoenician and Punic harbours — Motya, Tharros, Sulcis, Ebusus, Gadir — linked North Africa with the islands and southern Iberia, marked by its distinctive tophet sanctuaries.",
    description:
      "WHAT IT IS. Carthage sat at the narrowest point of the central Mediterranean, opposite western Sicily and southern Sardinia. Around it grew a web of Phoenician and later Carthaginian (Punic) towns: Motya on its island off western Sicily (Thucydides 6.2.6 says the Phoenicians of Sicily pulled back to Motya, Soloeis and Panormus as Greek settlers arrived); Sulcis (Sant'Antioco), Nora and Tharros in Sardinia; Ebusus (Ibiza); and the Iberian coast from Gadir to Málaga. Corsica was in the Etruscan sphere after Alalia.\n\n" +
      "IBIZA'S DATE. Diodorus (5.16, paraphrased) says the Carthaginians colonised Ebusus 160 years after the foundation of Carthage — 654/653 BCE on Timaeus' date. Archaeology finds a Phoenician settlement at Sa Caleta on Ibiza in the second half of the seventh century BCE, perhaps with an earlier phase, abandoned around 600 BCE for the site of Ibiza town, where the Puig des Molins cemetery grew. The settlers seem to have come from southern Iberia, so 'Carthaginian' for the first phase is doubtful.\n\n" +
      "THE TOPHETS. A shared marker of this network is the tophet — an open-air sanctuary where urns of cremated infants and young animals were buried under stone markers dedicated to Baal Hammon and Tanit. They are known at Carthage (from the eighth century BCE until 146 BCE), Hadrumetum (Sousse), Motya, Tharros, Sulcis, Monte Sirai and others, but not in Phoenician Iberia or the Levant in the same form. Whether these were places of child sacrifice, as Greek and Roman writers claimed and many epigraphers accept, or cemeteries for children who died young, is one of the sharpest disputes in the field; both arguments are cited here.\n\n" +
      "LINK TO LATER HISTORY. This network is the base from which the Barcid family later built Carthaginian power in Iberia.\n\n" +
      "WHAT IT DOES NOT SHOW. A shared material culture is not a shared ancestry: ancient genomes from these sites show very mixed communities with little Levantine ancestry (see the ancestry record).",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("carthageEtruria", "carthage", "phoenicians", "motya", "tharros", "sulcis", "ibiza", "tophet", "trade-networks"),
    civilisations: ["Carthage", "Phoenicians", "Iberia", "Etruscans"],
    locationName: "Western Mediterranean: Carthage, western Sicily, Sardinia, Ibiza and southern Iberia",
    imageUrl: PIC.tophetBardo.url,
    media: [PIC.tophetBardo, PIC.moziaKothon, PIC.tharros, PIC.sulcisTophet, PIC.saCaleta, PIC.tophetStele, PIC.galleyRelief],
    claims: [
      {
        sourceKey: "ce_aubet",
        citations: [
          { sourceKey: "ce_thucydides", relation: "supports", note: "Places the Phoenician concentration at Motya, Soloeis and Panormus in western Sicily." },
          { sourceKey: "ce_lancel", relation: "context", note: "Describes the growth of Carthage's overseas dependencies through the sixth century." },
        ],
        startYear: bce(750),
        endYear: bce(241),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "from the mid-8th century BCE until the loss of Sicily in 241 BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "date_range",
        evidence:
          "From the earliest excavated Phoenician levels at Motya and in Sardinia (eighth century BCE) to the end of Carthaginian Sicily after the First Punic War. A span for the network, not one event.",
      },
      {
        sourceKey: "ce_diodorus",
        citations: [
          { sourceKey: "ce_aubet", relation: "disputes", note: "Archaeology puts the first Phoenician settlement on Ibiza (Sa Caleta) in the later seventh century and links it with southern Iberia rather than Carthage." },
        ],
        startYear: bce(654),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Ebusus colonised 160 years after Carthage (654/653 BCE)",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        temporalClaimType: "traditional_date",
        whatIsDated: "the foundation of Ebusus (Ibiza)",
        evidence:
          "Diodorus' relative date (5.16, paraphrased) converted with Timaeus' 814/813 BCE for Carthage; it inherits that date's uncertainty.",
      },
      {
        sourceKey: "ce_xella2013",
        citations: [
          { sourceKey: "ce_schwartz2010", relation: "disputes", note: "Argues that the age profile of the Carthage tophet burials does not show systematic infant sacrifice." },
          { sourceKey: "ce_lancel", relation: "context", note: "Describes the excavated tophet of Carthage (Salammbô) and its long sequence." },
        ],
        startYear: bce(750),
        endYear: bce(146),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Carthage tophet in use from the 8th century BCE until 146 BCE",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        temporalClaimType: "date_range",
        whatIsDated: "the use of the tophet of Carthage",
        evidence:
          "The stratified sequence of urns and stelae at Salammbô, from the earliest levels (eighth century BCE) to the destruction of the city. The dating is not in dispute; what the burials mean is.",
      },
    ],
  },

  // 9 -----------------------------------------------------------------------
  {
    slug: "north-african-ancestry-in-etruscan-and-italian-dna",
    title: "North African ancestry in ancient genomes from Etruria and Italy",
    summary:
      "Ancient DNA finds a minority of individuals with North African-related ancestry in Iron Age Etruria, Rome and the Punic islands, inside populations that were mostly locally rooted.",
    description:
      "WHAT 'NORTH AFRICAN ANCESTRY' MEANS HERE. In these studies it is a statistical statement: part of a person's genome is best modelled as coming from a population related to ancient or present-day people of North Africa (for example, Punic-period or earlier Maghreb genomes). It is not a race, a skin colour, a language or a culture, and it does not say what a person called themselves. The individuals discussed here are counted, not imagined.\n\n" +
      "ETRURIA (Posth et al. 2021). Eighty-two people from Etruria and southern Italy, 800 BCE–1000 CE. The Etruscans' ancestry was overwhelmingly local and resembled that of their Latin neighbours, including steppe-related ancestry, and it stayed largely stable through the first millennium BCE. Within that, the authors report the sporadic presence of individuals of likely northern African, Near Eastern and central European origin. The big change came later: in the Roman Imperial period the whole population shifted to roughly half eastern Mediterranean-related ancestry.\n\n" +
      "TARQUINIA, KERKOUANE, SANT'IMBENIA (Moots et al. 2023). Iron Age genomes from an Etruscan city, a Punic town on Cape Bon and a Sardinian site. All three were mixed. Tarquinia had a notable number of people with North African-related ancestry, which the authors link with Carthaginian–Etruscan ties; some people buried at Kerkouane resembled Italian and Greek populations. Movement ran both ways, and people of different ancestry were buried together without visible difference in treatment.\n\n" +
      "ROME (Antonio et al. 2019). Individual-level diversity from the Iron Age on, including people with North African-related ancestry, and heavy eastern Mediterranean input under the Empire.\n\n" +
      "THE ISLANDS. Fernandes et al. (2020) found a third-millennium BCE Sardinian with mostly North African-related ancestry — movement across the sea two thousand years before Carthage. Ringbauer et al. (2025) found that people at Punic sites in Sicily, Sardinia and Ibiza, and at Carthage itself, had little Levantine ancestry and often substantial North African-related ancestry.\n\n" +
      "WHAT IT DOES NOT SHOW. These data do not support the idea that the Etruscans as a people came from North Africa (or from Anatolia): their gene pool was local. They show individual mobility in both directions.",
    category: "science",
    subcategory: LANE,
    eventType: "scientific_model",
    eventTypeNote: "Population-genetic findings; numbers of individuals are small and ancestry is modelled, not observed.",
    tags: laneTags("carthageEtruria", "ancient-dna", "etruscans", "carthage", "population-genetics", "mobility"),
    civilisations: ["Etruscans", "Carthage", "Rome", "Roman Empire"],
    locationName: "Etruria, Latium, Sardinia, Sicily and Punic North Africa",
    imageUrl: PIC.kerkouane.url,
    media: [PIC.kerkouane],
    claims: [
      {
        sourceKey: "ce_posth2021",
        citations: [
          { sourceKey: "ce_antonio2019", relation: "supports", note: "Finds a comparable pattern around Rome: individual diversity, including North African-related ancestry, before the large Imperial-period shift." },
        ],
        startYear: bce(800),
        endYear: bce(1),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "first millennium BCE Etruria: sporadic individuals of likely northern African origin",
        datingMethod: "genetic",
        chronology: "scientific",
        temporalClaimType: "date_range",
        whatIsDated: "the period in which the Etruscan-period individuals were buried",
        evidence:
          "The burials are dated archaeologically and by radiocarbon; the ancestry is modelled from genome-wide data. The paper's abstract describes the northern African individuals as sporadic within a stable local gene pool.",
      },
      {
        sourceKey: "ce_moots2023",
        citations: [
          { sourceKey: "ce_ringbauer2025", relation: "supports", note: "Punic-period communities across the central Mediterranean were likewise very mixed, often with substantial North African-related ancestry." },
        ],
        startYear: bce(900),
        endYear: bce(100),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Iron Age Tarquinia and Kerkouane: mixed communities with movement in both directions",
        datingMethod: "genetic",
        chronology: "scientific",
        temporalClaimType: "date_range",
        whatIsDated: "the Iron Age burials sampled at Tarquinia, Kerkouane and Sant'Imbenia",
        evidence:
          "Genome-wide data from thirty individuals at three sites; the bracket is the broad Iron Age span of the sampled burials. The per-site dates were not read in this session, so the range is deliberately wide.",
      },
      {
        sourceKey: "ce_fernandes2020",
        citations: [
          { sourceKey: "ce_posth2021", relation: "context", note: "A reminder that North African-related ancestry in Italy and its islands is not a single Etruscan-period event." },
        ],
        startYear: bce(3000),
        endYear: bce(2001),
        datePrecision: "millennium",
        isApproximate: true,
        originalDateText: "third-millennium BCE Sardinian individual with mostly North African-related ancestry",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        temporalClaimType: "radiometric_date",
        whatIsDated: "the burial of one Chalcolithic individual in Sardinia",
        evidence:
          "One individual, directly dated, whose ancestry is modelled as mostly North African-related; the authors read it, with a roughly contemporary Iberian, as Africa-to-Europe movement in the Copper Age.",
      },
    ],
  },

  // 10 ----------------------------------------------------------------------
  {
    slug: "objects-crossing-africa-and-italy",
    title: "Objects that crossed between North Africa and Etruria",
    summary:
      "Ostrich eggs and Egyptian-style faience reached Etruscan tombs through Phoenician trade, while Etruscan wine amphorae and bucchero tableware reached Carthage from the late eighth century BCE.",
    description:
      "WHAT IT IS. Two-way traffic in goods, visible in tombs and rubbish deposits on both sides of the Tyrrhenian Sea.\n\n" +
      "INTO ITALY. The Isis Tomb at Vulci, opened in 1839 by Lucien Bonaparte and now largely in the British Museum, contained painted and incised ostrich eggs, Egyptian-style blue faience flasks and scarabs, bronzes and a gypsum statue of a woman, all dated about 625–550 BCE. The ostrich eggs are usually attributed to Phoenician workshops. Ostriches then lived in North Africa and the Near East, and the shells reached Etruria through Phoenician and Punic trade; an isotopic study of British Museum eggs (Hodos et al. 2020) found that eggs were sourced from different regions and moved between the eastern and western Mediterranean, so a 'North African' origin should not be assumed for any single egg. Punic glass pendants and amulets of later centuries are another class of object found widely in Italy and the islands.\n\n" +
      "INTO AFRICA. At Carthage, Etruscan transport amphorae — recognisable by volcanic inclusions in the clay and the way they were made — appear in stratified layers of the last quarter of the eighth and the first half of the seventh century BCE, alongside Etruscan fine wares such as impasto, black bucchero drinking cups and Etrusco-Corinthian pottery (Docter; Bechtold & Docter 2010). The amphorae mostly carried wine. They show Etruscan products reaching Carthaginian tables a century and a half before Alalia.\n\n" +
      "HOW IT IS DATED. Vulci by the style of the objects; Carthage by stratigraphy, cross-dated with Greek pottery.\n\n" +
      "WHAT IT DOES NOT SHOW. Imported goods show trade and taste, not migration. An ostrich egg in an Etruscan tomb says that Vulci's elite could buy exotic things through Phoenician middlemen; it does not say that North Africans lived in Vulci, and the 'Isis' name of the tomb is a nineteenth-century label for a bronze figure that may not be Isis at all.",
    category: "archaeology",
    subcategory: LANE,
    eventType: "archaeological_interpretation",
    tags: laneTags("carthageEtruria", "etruscans", "carthage", "vulci", "ostrich-eggs", "bucchero", "amphorae", "trade-networks"),
    civilisations: ["Etruscans", "Carthage", "Phoenicians"],
    locationName: "Vulci (Etruria) and Carthage",
    imageUrl: PIC.ostrichEggVulci.url,
    media: [PIC.ostrichEggVulci, PIC.isisTombBM, PIC.buccheroOinochoe, PIC.punicPendant, PIC.villaricosEgg],
    claims: [
      {
        sourceKey: "ce_bm_isis_tomb",
        citations: [
          { sourceKey: "ce_haynes2000", relation: "supports", note: "Describes the Isis Tomb assemblage and its Phoenician-traded imports." },
          { sourceKey: "ce_wp_isis_tomb", relation: "context", note: "Finding aid for the tomb's history and the 625–550 BCE date of its contents." },
          { sourceKey: "ce_hodos2020", relation: "context", note: "Isotopic study showing that decorated ostrich eggs were sourced from several regions and moved between trading zones." },
        ],
        startYear: bce(625),
        endYear: bce(550),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Isis Tomb, Vulci: contents c. 625–550 BCE",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        temporalClaimType: "archaeological_date",
        whatIsDated: "the imported objects in the Isis Tomb at Vulci",
        evidence:
          "Dated by the styles of the objects; the tomb was emptied in 1839 without recording, so there is no stratigraphy, and the assemblage may span more than one burial.",
      },
      {
        sourceKey: "ce_docter_etruscan",
        citations: [
          { sourceKey: "ce_bechtold2010", relation: "supports", note: "Includes Etruscan amphorae in the overview of transport amphorae imported to Punic Carthage." },
          { sourceKey: "ce_gras1985", relation: "supports", note: "Maps Etruscan amphorae and bucchero across the western Mediterranean, Carthage included." },
        ],
        startYear: bce(725),
        endYear: bce(650),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Etruscan amphorae in Carthage layers of the last quarter of the 8th and first half of the 7th century BCE",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        temporalClaimType: "archaeological_date",
        whatIsDated: "the earliest Etruscan imports at Carthage",
        evidence:
          "Stratified finds from excavations in central Carthage, identified as Etruscan by fabric and manufacturing technique. Etruscan imports continue later; this claim dates only their first appearance.",
      },
    ],
  },

  // 11 ----------------------------------------------------------------------
  {
    slug: "african-gods-in-etruscan-and-roman-religion",
    title: "Gods between Carthage, Etruria and Rome",
    summary:
      "Astarte was honoured at Pyrgi beside the Etruscan Uni; Rome claimed to have 'called out' Carthage's gods in 146 BCE and later brought the goddess Caelestis to Rome; in Africa, Baal Hammon was worshipped as Saturn.",
    description:
      "DIRECTION MATTERS. 'African influence' on Etruscan and Roman religion is really four different movements, with very different evidence.\n\n" +
      "1. PHOENICIAN GODDESS IN ETRURIA, c. 500 BCE. At Pyrgi the Etruscan ruler of Caere dedicated a sanctuary to a goddess called Uni in Etruscan and Astarte in Phoenician. Astarte is a Levantine Phoenician deity worshipped across the Punic West; the identification shows Etruscans and Phoenician-speakers equating their goddesses, probably through Carthaginian or other Punic contacts. Evidence: excellent (the gold tablets themselves).\n\n" +
      "2. CARTHAGE'S GODDESS 'CALLED OUT' TO ROME, 146 BCE. Macrobius (Saturnalia 3.9, early fifth century CE, paraphrased) gives the prayer with which, he says, the Romans invited the gods of Carthage to leave the city before its destruction (evocatio), copied from an older antiquarian. Later Roman tradition associated Carthage's chief goddess with Juno. Evidence: late and literary; whether the ritual was performed in this form is uncertain.\n\n" +
      "3. CAELESTIS IN ROME, third century CE. In Roman Africa the great goddess of Carthage was worshipped as Caelestis ('the Heavenly One'), widely thought to continue the Punic Tanit, with major temples at Carthage and Dougga. Herodian (5.6.4–5, paraphrased) reports that Elagabalus had her statue brought from Carthage to Rome to be 'married' to his sun god. Evidence: a contemporary historian, plus the Roman-period temples; continuity with Tanit is a scholarly inference.\n\n" +
      "4. THE REVERSE DIRECTION: SATURN IN AFRICA. Baal Hammon, the chief god of Carthage, went on being worshipped in Roman North Africa under the Latin name Saturn, on thousands of stelae of the first to third centuries CE (Leglay 1966). This is an African god wearing a Roman name, not a Roman import.\n\n" +
      "AMMON. The ram-horned oracle god of Siwa, called Ammon by Greeks (Zeus Ammon) and Romans (Jupiter Ammon), is Egyptian–Libyan, and its cult reached the Greek world early. A link between Ammon and Baal Hammon has been suggested from the names and ram imagery but is disputed.\n\n" +
      "WHAT IT DOES NOT SHOW. None of this shows that Etruscan or Roman religion originated in Africa; it shows identifications and borrowings between neighbours, recorded mostly by Romans.",
    category: "religion",
    subcategory: LANE,
    eventType: "historical",
    eventTypeNote: "Four cult movements of very different evidential quality, kept apart.",
    tags: laneTags("carthageEtruria", "astarte", "tanit", "caelestis", "baal-hammon", "saturn", "evocatio", "religion"),
    people: ["Thefarie Velianas", "Elagabalus"],
    civilisations: ["Carthage", "Etruscans", "Rome", "Roman Empire", "Phoenicians"],
    locationName: "Pyrgi, Rome and Roman North Africa",
    imageUrl: PIC.tanitBaalStele.url,
    media: [PIC.tanitBaalStele, PIC.caelestisDougga, PIC.saturnTimgad, PIC.tanitMosaic],
    claims: [
      {
        sourceKey: "ce_pyrgi_object",
        citations: [
          { sourceKey: "ce_bonnet1996", relation: "supports", note: "Astarte's Levantine origin and her western cult, including her identification with Uni at Pyrgi." },
          { sourceKey: "ce_schmitz1995", relation: "supports", note: "Reads the Phoenician dedication to Astarte." },
        ],
        startYear: bce(510),
        endYear: bce(490),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Astarte and Uni equated at Pyrgi, c. 500 BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "archaeological_date",
        whatIsDated: "the Pyrgi dedication identifying Astarte with Uni",
        evidence: "The gold tablets' archaeological date (see the Pyrgi record).",
      },
      {
        sourceKey: "ce_macrobius",
        citations: [
          { sourceKey: "ce_rives1995", relation: "context", note: "Discusses the evocatio tradition and the Roman reshaping of Carthage's goddess." },
          { sourceKey: "ce_polybius", relation: "context", note: "The eyewitness fragments of 146 BCE survive without any account of an evocatio, so the ritual rests on later writers." },
        ],
        startYear: bce(146),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "the gods of Carthage 'called out' before its destruction in 146 BCE (Macrobius)",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        temporalClaimType: "traditional_date",
        evidence:
          "A ritual dated by the event it accompanied; reported only by a writer of the fifth century CE, quoting an older source. Paraphrased.",
      },
      {
        sourceKey: "ce_herodian",
        citations: [
          { sourceKey: "ce_rives1995", relation: "supports", note: "On Caelestis at Carthage and her Roman-period cult." },
        ],
        startYear: 219,
        endYear: 222,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Elagabalus brings Caelestis' statue from Carthage to Rome (219–222 CE)",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "date_range",
        whatIsDated: "the transfer of the Carthaginian goddess to Rome",
        evidence: "Herodian's contemporary account (paraphrased), within the dated reign of Elagabalus.",
      },
      {
        sourceKey: "ce_leglay1966",
        citations: [
          { sourceKey: "ce_rives1995", relation: "supports", note: "Treats the African Saturn as the Roman-period continuation of Baal Hammon's cult." },
        ],
        startYear: 1,
        endYear: 300,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Baal Hammon worshipped as Saturn in Roman Africa, 1st–3rd century CE",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        temporalClaimType: "date_range",
        whatIsDated: "the votive stelae of the African Saturn",
        evidence: "Dated by inscriptions and style of thousands of votive stelae from sanctuaries across Roman North Africa.",
      },
    ],
  },

  // 12 ----------------------------------------------------------------------
  {
    slug: "destruction-of-carthage-146-bce",
    title: "Destruction of Carthage and what followed in North Africa",
    summary:
      "In spring 146 BCE Rome captured and burned Carthage; its territory became the province of Africa, while Numidian kings — Masinissa's heirs — ruled the rest and Punic culture lived on in their cities.",
    description:
      "WHAT HAPPENED. After a siege of nearly three years, Roman forces under Scipio Aemilianus broke into Carthage in the spring of 146 BCE. Appian (Punica 127–135, paraphrased) describes six days of street fighting, the surrender of tens of thousands on the Byrsa, and the burning of the city. Polybius, who was there, survives in fragments (38.19–22): he records Scipio weeping as he watched the city burn and reflecting that Rome might one day suffer the same. The survivors were sold into slavery; the site was cursed against resettlement.\n\n" +
      "THE SETTLEMENT. A senatorial commission made Carthage's remaining territory the province of Africa, governed from Utica, which had sided with Rome. A boundary ditch, the fossa regia, separated it from the Numidian kingdom. Masinissa had died in 148 BCE; Scipio divided his royal functions among his sons Micipsa, Gulussa and Mastanabal (Appian, Punica 106, paraphrased). Pliny (NH 18.22, paraphrased) says the Senate gave Carthage's libraries to the kings of Africa, keeping only Mago's treatise on farming, which it had translated into Latin.\n\n" +
      "CONSEQUENCES FOR NORTH AFRICAN SOCIETIES. The fall of Carthage did not end Punic civilisation in Africa. Numidian royal centres such as Cirta and Dougga used Punic as a language of state; Neo-Punic inscriptions, coins and bilingual Libyco-Punic texts (the Dougga mausoleum's is the most famous) continue for centuries; Sallust (Bellum Iugurthinum 17.7) drew on Punic books said to be King Hiempsal's. The Numidian kingdoms, not Rome, were the main power in most of North Africa for another century, until Caesar annexed eastern Numidia in 46 BCE. Rome refounded Carthage itself as a Roman colony under Caesar and Augustus.\n\n" +
      "WHAT IT DOES NOT SHOW. The population of North Africa was not replaced. Carthage's citizens were killed or enslaved, but the wider Libyan and Punic-speaking population remained, and its descendants are the people later Roman writers called Numidians and Mauri. The idea that Rome sowed the ground with salt is a modern embellishment, absent from the ancient sources.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("carthageEtruria", "carthage", "rome", "third-punic-war", "numidia", "province-of-africa", "neo-punic"),
    people: ["Scipio Aemilianus", "Polybius", "Micipsa", "Gulussa", "Mastanabal"],
    civilisations: ["Carthage", "Rome", "Numidia"],
    locationName: "Carthage (near modern Tunis)",
    lat: 36.8528,
    lng: 10.3233,
    identificationStatus: "secure",
    imageUrl: PIC.punicPorts.url,
    media: [PIC.punicPorts, PIC.douggaMausoleum, PIC.leptisInscription, PIC.scipioPolybius],
    claims: [
      {
        sourceKey: "ce_appian",
        citations: [
          { sourceKey: "ce_polybius", relation: "supports", note: "Eyewitness fragments of the fall of the city (38.19–22), the source Appian drew on." },
          { sourceKey: "ce_miles", relation: "context", note: "Modern narrative of the siege and destruction." },
          { sourceKey: "ce_lancel", relation: "context", note: "On the archaeological destruction layer on the Byrsa." },
        ],
        startYear: bce(146),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "spring 146 BCE — capture and burning of Carthage",
        datingMethod: "historical_record",
        chronology: "conventional",
        temporalClaimType: "absolute_date",
        evidence:
          "Fixed by Roman consular dating and by its pairing with the sack of Corinth in the same year; the burnt destruction layer on the Byrsa matches it.",
      },
      {
        sourceKey: "ce_hoyos",
        citations: [
          { sourceKey: "ce_sallust", relation: "supports", note: "Punic books at the Numidian court after 146 BCE show Punic literacy surviving." },
          { sourceKey: "ce_pliny", relation: "supports", note: "Carthage's libraries were handed to the African kings and Mago's treatise translated." },
          { sourceKey: "ce_appian", relation: "supports", note: "The division of Masinissa's kingdom among his sons and the organisation of the province." },
        ],
        startYear: bce(146),
        endYear: bce(46),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "146–46 BCE — the province of Africa beside the Numidian kingdoms",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "date_range",
        whatIsDated: "the century in which Roman Africa was a small province beside Numidian kingdoms that kept Punic culture",
        evidence:
          "From the creation of the province to Caesar's annexation of eastern Numidia after Thapsus. A span chosen to show the consequences, not a single event.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const links: SeedEventLink[] = [
  // Inside the section
  { from: "phoenician-arrival-utica-lixus-gadir", to: "carthage-foundation", relation: "precedes", note: "Utica and the far-western stations are older than Carthage in both the ancient tradition and the excavated record." },
  { from: "carthage-foundation", to: "phoenician-trading-networks-north-africa", relation: "precedes", note: "Carthage became the hub of the Phoenician harbours along the North African coast." },
  { from: "carthage-foundation", to: "western-mediterranean-trade-routes-africa-iberia-islands", relation: "precedes", note: "Carthage's growth made it the centre of the island and Iberian network." },
  { from: "battle-of-alalia", to: "pyrgi-gold-tablets", relation: "associated", note: "Caere (Agylla), which fought at Alalia, is the city whose ruler made the Pyrgi dedication a generation later." },
  { from: "battle-of-alalia", to: "rome-carthage-first-treaty", relation: "related", note: "Both show Carthage dividing the Tyrrhenian Sea into spheres by alliance and treaty." },
  { from: "pyrgi-gold-tablets", to: "african-gods-in-etruscan-and-roman-religion", relation: "evidence_for", note: "The tablets are the direct evidence for Astarte being equated with the Etruscan Uni." },
  { from: "carthage-etruscan-ivory-tessera", to: "objects-crossing-africa-and-italy", relation: "related", note: "An Etruscan personal token in a Carthage grave, alongside the traded goods moving the same way." },
  { from: "objects-crossing-africa-and-italy", to: "north-african-ancestry-in-etruscan-and-italian-dna", relation: "related", note: "Goods and people both moved between Carthage and Etruria; the DNA shows individuals, the objects show trade." },
  { from: "western-mediterranean-trade-routes-africa-iberia-islands", to: "destruction-of-carthage-146-bce", relation: "precedes", note: "The network ended as a Carthaginian system with the losses of the Punic Wars and the fall of the city." },
  { from: "pyrgi-gold-tablets", to: "rome-carthage-first-treaty", relation: "related", note: "The Pyrgi dedication and Polybius' first treaty belong to the same decade of Carthaginian dealings with central Italy." },
  // To other sections of the track
  { from: "phoenician-arrival-utica-lixus-gadir", to: "prehistoric-iberia-north-africa-crossings", relation: "relevant", note: "The Phoenician stations on both sides of the Strait continue a much older history of contact across it." },
  { from: "phoenician-trading-networks-north-africa", to: "herodotus-describes-libya", relation: "relevant", note: "Herodotus' 'silent trade' passage (4.196) belongs to his wider description of the peoples of Libya." },
  { from: "carthage-foundation", to: "herodotus-describes-libya", relation: "relevant", note: "The Libyans with whom Carthage's founders bargained are the peoples Greek writers described as the inhabitants of Libya." },
  { from: "north-african-ancestry-in-etruscan-and-italian-dna", to: "alt-etruscans-from-north-africa", relation: "relevant", note: "The ancient DNA shows a locally rooted Etruscan population with only individual North African-related outliers — evidence against a North African origin of the Etruscans." },
  { from: "african-gods-in-etruscan-and-roman-religion", to: "alt-african-origins-of-mediterranean-symbols", relation: "relevant", note: "The documented cult borrowings here are the evidence any claim about African origins of Mediterranean religious symbols has to be measured against." },
  { from: "african-gods-in-etruscan-and-roman-religion", to: "siwa-oracle-of-ammon", relation: "related", note: "Ammon of Siwa is the North African god whose cult Greeks and Romans adopted, and whose link to Baal Hammon is debated." },
  { from: "battle-of-zama", to: "destruction-of-carthage-146-bce", relation: "precedes", note: "Zama ended Carthage's great-power status and set up the Numidian–Carthaginian conflict that led to the Third Punic War." },
  { from: "destruction-of-carthage-146-bce", to: "masinissa-kingdom", relation: "relevant", note: "Masinissa's kingdom was divided among his sons by Scipio and remained the chief power in North Africa after Carthage fell." },
  { from: "destruction-of-carthage-146-bce", to: "numidian-royal-tombs-medracen-and-dougga", relation: "related", note: "The Libyco-Punic mausoleum at Dougga shows Punic culture continuing in Numidian royal settings after 146 BCE." },
  // Out to the Hannibal dataset
  { from: "carthage-foundation", to: "hannibal-birth", relation: "precedes", note: "Carthage's history from its foundation is the background of the Hannibal dataset, which begins with his birth into its leading military family." },
  { from: "rome-carthage-first-treaty", to: "second-punic-war-begins", relation: "precedes", note: "The first of the treaties whose later successors, and their breakdown, lie behind the Second Punic War." },
  { from: "western-mediterranean-trade-routes-africa-iberia-islands", to: "hannibal-takes-command-in-iberia", relation: "relevant", note: "The Punic network in southern Iberia was the base the Barcids expanded into a territorial empire." },
  { from: "destruction-of-carthage-146-bce", to: "second-punic-war-begins", relation: "relevant", note: "The destruction of 146 BCE was the final outcome of the conflict the Second Punic War had decided." },
];

export const CARTHAGE_ETRURIA: MoorsSection = { sources, events, links };
