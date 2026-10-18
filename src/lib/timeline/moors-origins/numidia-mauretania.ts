// NUMIDIA AND MAURETANIA — the North African kingdoms, c. 310 BCE to 23 CE.
//
// Seventeen records on the indigenous kingdoms that grew up beside Carthage and
// then beside Rome: the Massylii and the Masaesyli, Syphax and Masinissa, the
// first kings the Greek and Latin writers call "Mauri", Jugurtha and Bocchus,
// Juba I, the Mauretanian partition, and the Mauretania of Juba II and
// Cleopatra Selene.
//
// HOW THIS SECTION READS ITS EVIDENCE. Almost every narrative statement comes
// from a Greek or Roman writer — Polybius, Livy, Sallust, Appian, Plutarch,
// Cassius Dio — who wrote about these kings from the outside and usually from
// the point of view of Rome. The kings' own voice survives only in coins, a few
// bilingual Punic–Libyco-Berber inscriptions (above all the dedication to
// Masinissa at Dougga) and their monuments. Each record says which kind of
// evidence it is resting on.
//
// THE WORD "MAURI". It is used here only where an ancient writer uses it, and
// for the people he applies it to. It is not used for anyone earlier, and it is
// not the same thing as the medieval and early-modern European word "Moors",
// which is treated in the words-and-theories section.
//
// VERIFICATION NOTE. During research the public-domain text sites (Perseus,
// LacusCurtius, Wikisource) could not be reached from the research
// environment. Ancient passages are therefore cited by book and chapter and
// PARAPHRASED; the only words quoted are ones read on a page during research
// (the English Wikipedia articles listed below, which quote the Loeb
// translations), and each such quotation says where it was read.

import type { SeedEvent, SeedSource, SeedEventLink } from "../seed-types";
import { MOORS_LANES, bce, commonsPicture, laneTags, type MoorsSection } from "./shared";

const LANE = MOORS_LANES.numidiaMauretania;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // --- Ancient narrative sources --------------------------------------------
  {
    key: "nm_polybius",
    title: "Histories",
    author: "Polybius",
    reference: "3.33.15 (African troops of 218 BCE); 9.25 (conversation with Masinissa); 15.3–16 (Zama); 16.23 (Syphax in the triumph); 36.16 (obituary of Masinissa)",
    sourceType: "historical_document",
    publishedYear: -149,
    publishedDisplay: "written in the second century BCE",
    notes:
      "Cited for: the earliest datable list naming Massylii, Masaesyli and Maurusii among African troops moved between Africa and Iberia in 218 BCE (3.33.15); the battle of Zama and the role of Masinissa's cavalry (15.9–16); his own report of talking with Masinissa (9.25); the version in which Syphax was led in Scipio's triumph (16.23); and the obituary of Masinissa — age about ninety, vigour, and the claim that he made Numidia productive (36.16). Polybius knew Scipio Aemilianus and is the nearest surviving witness to Masinissa's court; he also wrote as an admirer of Rome's allies.",
  },
  {
    key: "nm_livy",
    title: "Ab Urbe Condita (History of Rome), Books 21–30",
    author: "Titus Livius (Livy)",
    reference: "24.48–49 (Syphax, Gala, Masinissa aged seventeen); 28.17–18 (Scipio and Hasdrubal at Siga); 29.29–33 (Masinissa's succession war, Baga king of the Mauri); 30.3–15 (Syphax captured, Sophonisba); 30.29–35 (Zama); 30.45 (death of Syphax)",
    sourceType: "historical_document",
    publishedDisplay: "written in the late first century BCE",
    notes:
      "Cited for the narrative of the Numidian kingdoms in the Second Punic War: Syphax and Gala (Gaia) in 213 BCE; the visit of Scipio and Hasdrubal to Syphax at Siga in 206; Baga, king of the Mauri, who gave Masinissa an escort of Mauri (29.30); the capture of Syphax and the death of Sophonisba (30.12–15); Zama (30.29–35); and his explicit disagreement with Polybius on how Syphax died (30.45). Livy wrote two centuries later, from Polybius and from lost Roman annalists.",
  },
  {
    key: "nm_appian",
    title: "Roman History: The African Wars (Punica / Libyke)",
    author: "Appian of Alexandria",
    reference: "Punica 10–48 (Syphax, Masinissa, Zama); 68–73 (Masinissa against Carthage); 105–106 (death of Masinissa)",
    sourceType: "historical_document",
    publishedDisplay: "written in the second century CE",
    notes:
      "Cited for a parallel narrative of Masinissa's career and Zama, and for his death notice (Punica 106): Masinissa died at about ninety, leaving a young son, and was credited with turning much of Numidia to cultivation. Appian is late and derivative (largely from Polybius), so he corroborates rather than adds independent evidence.",
  },
  {
    key: "nm_sallust",
    title: "Bellum Iugurthinum (The War with Jugurtha)",
    author: "Gaius Sallustius Crispus (Sallust)",
    reference: "5–16 (Masinissa's line, Micipsa, Jugurtha's rise); 17–19 (ethnographic excursus on Africa, Numidae and Mauri); 21–26 (siege of Cirta, massacre of the Italians); 43–114 (Metellus, Marius, Bocchus, Sulla, capture of Jugurtha)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 41–40 BCE",
    notes:
      "The only continuous account of the Jugurthine War and of Bocchus I. Cited for: the Cirta massacre of 112 BCE (26); the Mulucha river as the boundary between Bocchus's Mauri and Numidia (19, 92, 110); Bocchus's daughter married to Jugurtha (80); and the negotiations with Sulla and the betrayal of Jugurtha (102–113). Sallust wrote over sixty years later, as a partisan critic of the Roman nobility, and had governed Africa Nova himself; his excursus on the origins of the Numidae and Mauri (17–18) is reported, not endorsed, here.",
  },
  {
    key: "nm_plutarch_lives",
    title: "Parallel Lives: Marius, Sulla, Caesar, Antony",
    author: "Plutarch",
    reference: "Marius 10, 12, 32; Sulla 3, 6; Caesar 52–55; Antony 36, 87",
    sourceType: "historical_document",
    publishedDisplay: "written c. 100–120 CE",
    notes:
      "Cited for: Sulla's signet ring showing Bocchus surrendering Jugurtha (Marius 10, Sulla 3); Jugurtha in Marius's triumph and his death in the Roman prison (Marius 12); Bocchus's dedication on the Capitol (Sulla 6, Marius 32); Juba I at Thapsus and the infant Juba II in Caesar's triumph (Caesar 52–55); the birth of Antony and Cleopatra's twins and the marriage of their daughter to Juba II (Antony 36, 87). Biography written for moral purposes, about two centuries after most of these events.",
  },
  {
    key: "nm_bellum_africum",
    title: "Bellum Africum (The African War)",
    author: "Anonymous officer in Caesar's army (transmitted with Caesar's works)",
    reference: "Chapters 1–98, esp. 25 (Sittius and Bocchus invade Numidia), 48–57 (Juba's forces), 68 (camels), 79–86 (Thapsus), 94–97 (deaths of Juba and Petreius; Africa Nova)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 45–40 BCE by a participant",
    notes:
      "An eyewitness Caesarian narrative of the campaign of 47–46 BCE. Cited for Juba I's alliance with the Pompeians, the invasion of his kingdom by Bocchus II and Publius Sittius, the battle of Thapsus, the deaths of Juba and Petreius, and the creation of the province later called Africa Nova. It is partisan for Caesar and hostile to Juba.",
  },
  {
    key: "nm_caesar_bc",
    title: "Commentarii de Bello Civili (The Civil War)",
    author: "Gaius Julius Caesar",
    reference: "2.23–44 (Curio's African campaign and his defeat by Juba's forces, 49 BCE)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 48–47 BCE",
    notes:
      "Cited for the defeat and death of Caesar's legate Curio at the Bagradas in 49 BCE at the hands of Juba I's army under Saburra — the event that made Juba a principal enemy of Caesar. Caesar's own self-justifying account.",
  },
  {
    key: "nm_dio",
    title: "Roman History",
    author: "Cassius Dio",
    reference: "43.2–9 (Thapsus, Africa Nova); 48.45 (Bocchus seizes Bogud's kingdom); 49.43 (death of Bocchus II, 33 BCE); 50.11 (Bogud at Methone); 51.15 (Cleopatra Selene married to Juba); 53.26 (Juba given Mauretania, 25 BCE)",
    sourceType: "historical_document",
    publishedDisplay: "written early third century CE",
    notes:
      "Cited for the chronology of the Mauretanian kingdoms between 49 and 25 BCE: Bocchus II's seizure of Bogud's lands c. 38 BCE, Bocchus's death without heirs in 33 BCE and the passing of his kingdom to Rome, Octavian's grant of Mauretania to Juba II in 25 BCE, and the statement that Cleopatra Selene was given in marriage to Juba. Late, but with access to good sources for the Augustan period.",
  },
  {
    key: "nm_strabo",
    title: "Geography, Book 17",
    author: "Strabo",
    reference: "17.3.2–9 (Maurusia, Mauri, the kings Bogus/Bogud and Bocchus, Juba II); 17.3.12–15 (Masaesylii and Massylii; Masinissa); 8.4.3 (Bogud at Methone)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 7 BCE – 23 CE",
    notes:
      "A contemporary of Juba II. Cited for the geography of Maurusia and Numidia, for the statement that Masinissa turned the Numidian nomads to settled farming (17.3.15), for the Mauretanian kings of the first century BCE, and for Juba II as a ruler who had recently died when Strabo wrote. Paraphrased here; not read in the original during research.",
  },
  {
    key: "nm_pliny",
    title: "Natural History",
    author: "Pliny the Elder",
    reference: "5.1–20 (Mauretania, Volubilis, Caesarea); 5.51 (Juba on the Nile, crocodile in the temple of Isis at Caesarea); 6.201 (Juba's purple dye-works on the Purpurariae islands); 37.8 (Sulla's seal)",
    sourceType: "historical_document",
    publishedDisplay: "completed 77–79 CE",
    notes:
      "Cited for Juba II as a scholar whose books Pliny used constantly (especially in Books 5–6); for Iol renamed Caesarea; for Juba's claim, reported at 5.51, that a crocodile from the source of the Nile was dedicated in the temple of Isis at Caesarea; for Juba's Gaetulian purple industry on the islands off the Atlantic coast (6.201); and for Sulla's seal showing the surrender of Jugurtha (37.8).",
  },
  {
    key: "nm_mela",
    title: "De Chorographia (Description of the World)",
    author: "Pomponius Mela",
    reference: "1.30–31 (Iol/Caesarea and the coast of Mauretania; the common royal monument)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 43–44 CE",
    notes:
      "A geographer from Tingentera in southern Spain, writing in the reign of Claudius. Cited for the phrase monumentum commune regiae gentis — a common monument of the royal family — on the coast beyond Iol/Caesarea, which is usually identified with the Royal Mausoleum of Mauretania. The section number (1.31) is the one given in the English Wikipedia article read during research; dictionaries differ on the numbering of this part of Book 1.",
  },
  {
    key: "nm_cicero_senectute",
    title: "Cato Maior de Senectute (On Old Age)",
    author: "Marcus Tullius Cicero",
    reference: "Section 34",
    sourceType: "historical_document",
    publishedDisplay: "written 44 BCE",
    notes:
      "Cited only as corroboration that Masinissa was remembered at Rome as a man still physically vigorous at ninety (Cato, the dialogue's speaker, describes him so). A literary dialogue, not a chronicle.",
  },
  {
    key: "nm_crinagoras",
    title: "Epigrams (Greek Anthology)",
    author: "Crinagoras of Mytilene",
    reference: "Anthologia Graeca 7.633 (the moon darkened at the death of 'Selene'); 9.235 (on the marriage of Juba and Cleopatra Selene)",
    sourceType: "historical_document",
    publishedDisplay: "written in the late first century BCE",
    notes:
      "A Greek poet at the Augustan court. Cited for two epigrams usually read as about Cleopatra Selene: one celebrating her union with Juba as a joining of Egypt and Libya, and one on her death in which the moon is darkened — the basis for the modern attempt to date her death by a lunar eclipse. Not read in the original during research; paraphrased.",
  },

  {
    key: "nm_diodorus",
    title: "Bibliotheca Historica (Library of History), Book 20",
    author: "Diodorus Siculus",
    reference: "20.17–18 (Agathocles in Africa and Ailymas, king of the Libyans); 20.38–39 (Numidian groups in the war)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 60–30 BCE",
    notes:
      "Cited only for the earliest narrative evidence of indigenous kingship west of Carthage: during Agathocles' invasion of Carthaginian Africa (310–307 BCE) Diodorus has a 'king of the Libyans', Ailymas, ally with and then turn against the invader, and Numidian groups switching sides. He does not use the names Massylii or Masaesyli. Paraphrased; not read in the original during research.",
  },
  {
    key: "nm_zonaras",
    title: "Epitome of Histories",
    author: "John Zonaras",
    reference: "9.14 (epitome of Cassius Dio on the end of the Second Punic War)",
    sourceType: "historical_document",
    publishedDisplay: "written in the twelfth century CE",
    notes:
      "A Byzantine epitome preserving lost books of Cassius Dio. Cited only as the source of the report of an eclipse during the battle in Africa, from which the modern day-date of 19 October 202 BCE for Zama is computed. Late and indirect; paraphrased, not read in the original during research.",
  },

  // --- Inscriptions, coins and monuments ------------------------------------
  {
    key: "nm_dougga_dedication",
    title: "Bilingual Punic–Libyco-Berber dedication of the temple of Masinissa at Thugga (Dougga)",
    author: "The citizens of Thugga",
    reference: "RIL 2; KAI 101. Found 1904 at Dougga, Tunisia; dated to year 10 of King Micipsa",
    sourceType: "archaeological",
    publishedDisplay: "set up 139/138 BCE",
    notes:
      "Cited for the most direct indigenous evidence about Masinissa: a dedication by the people of Thugga of a sanctuary to king MSNSN son of king GYY (Gaia), dated in the tenth year of Micipsa, i.e. 139/138 BCE. It gives the father's name as GYY — against Livy's 'Gala' — and shows Punic and Libyco-Berber writing used side by side in a Numidian town. Dating and catalogue references as reported in the World History Encyclopedia and Livius articles found during research; not checked against Chabot's corpus itself.",
  },
  {
    key: "nm_ateban_inscription",
    title: "Bilingual inscription from the Libyco-Punic Mausoleum of Dougga (the 'Ateban' inscription)",
    reference: "RIL 1; KAI 100. Removed from the monument in 1842; now in the British Museum",
    sourceType: "archaeological",
    publishedDisplay: "third or second century BCE",
    notes:
      "Cited for the date range and builders of the Dougga mausoleum: a Punic and Libyco-Berber text naming the man for whom the tomb was built (conventionally read Ateban, son of Iepmatath, son of Palu) and the craftsmen who built it. Its removal by the British consul Thomas Reade in 1842 wrecked the monument, which was rebuilt by French archaeologists in 1908–1910. Cited at second hand (Libyan-inscriptions survey articles); not examined directly.",
  },
  {
    key: "nm_faustus_denarius",
    title: "Silver denarius of Faustus Cornelius Sulla (RRC 426/1)",
    author: "Moneyer Faustus Cornelius Sulla",
    reference: "Crawford, Roman Republican Coinage, no. 426/1; Rome mint, 56 BCE",
    sourceType: "archaeological",
    publishedDisplay: "struck 56 BCE",
    notes:
      "Cited as surviving physical evidence for how the capture of Jugurtha was remembered in the Sulla family: the reverse shows Sulla seated, with Bocchus kneeling to offer an olive branch and the bound Jugurtha kneeling behind — the design Plutarch and Pliny say Sulla used on his seal. Struck by Sulla's son half a century after the event.",
  },

  // --- Modern scholarship ---------------------------------------------------
  {
    key: "nm_gsell",
    title: "Histoire ancienne de l'Afrique du Nord (8 vols)",
    author: "Stéphane Gsell",
    publisher: "Hachette",
    publishedYear: 1913,
    publishedDisplay: "1913–1928",
    reference: "Vols 3 (wars of Carthage), 5–6 (the indigenous kingdoms), 7 (the Roman republic and the native kings), 8 (Caesar and the end of the kingdoms)",
    url: "https://commons.wikimedia.org/wiki/File:Histoire_ancienne_de_l%C3%81frique_du_nord_(IA_histoireancienne06gsel).pdf",
    sourceType: "academic_book",
    notes:
      "The foundational modern synthesis, still the reference for the Numidian and Mauretanian kingdoms. Cited for the political history of the Massylii and Masaesyli, the reigns of Syphax, Masinissa and his successors, and the Mauretanian kings; also for the caution that the narratives are Roman. The URL is the Commons copy of one volume scanned by the Internet Archive.",
  },
  {
    key: "nm_camps_masinissa",
    title: "Aux origines de la Berbérie: Massinissa ou les débuts de l'histoire",
    author: "Gabriel Camps",
    workTitle: "Libyca (Archéologie–Épigraphie) 8",
    publishedYear: 1960,
    publishedDisplay: "1960",
    reference: "Libyca 8 (1960), whole fascicle",
    sourceType: "academic_book",
    notes:
      "The standard study of Masinissa and the Numidian state. Cited for Masinissa's chronology (birth c. 238 BCE from the ancient statements of his age at death), for the case that Numidian agriculture and sedentary life predate Masinissa — so that the ancient claim that he first made Numidia fertile is praise rather than history — and for the protohistoric burial monuments as the background to the royal tombs.",
  },
  {
    key: "nm_camps_medracen",
    title: "Nouvelles observations sur l'architecture et l'âge du Medracen, mausolée royal de Numidie",
    author: "Gabriel Camps",
    workTitle: "Comptes rendus des séances de l'Académie des Inscriptions et Belles-Lettres 117(3)",
    publishedYear: 1973,
    reference: "CRAI 117 (1973), no. 3, pp. 470–517",
    sourceType: "academic_paper",
    notes:
      "Cited for the dating of the Medracen: Camps used radiocarbon measurements on wood from the monument to argue that it is older than Masinissa, generally reported as the fourth to third century BCE, and for its architecture (a Numidian round tumulus with an engaged Doric colonnade and an Egyptian-style cavetto cornice). The exact laboratory figures were not checked during research and are not reproduced here.",
  },
  {
    key: "nm_rakob",
    title: "Numidische Königsarchitektur in Nordafrika",
    author: "Friedrich Rakob",
    workTitle: "Die Numider: Reiter und Könige nördlich der Sahara (ed. H. G. Horn and C. B. Rüger)",
    publisher: "Rheinland-Verlag / Rheinisches Landesmuseum Bonn",
    publishedYear: 1979,
    reference: "Exhibition catalogue, Bonn 1979",
    sourceType: "academic_book",
    notes:
      "The standard architectural survey of the Numidian royal monuments — the Medracen, the Beni Rhenane mausoleum near Siga (excavated by Rakob), the tower tombs of Dougga and Es-Soumâa du Khroub, and the Royal Mausoleum of Mauretania. Cited for their dating and for the argument that they combine an indigenous tumulus tradition with Hellenistic and Punic architectural vocabulary.",
  },
  {
    key: "nm_vuillemot",
    title: "Siga et son port fluvial",
    author: "Gustave Vuillemot",
    workTitle: "Antiquités africaines 5",
    publishedYear: 1971,
    reference: "Antiquités africaines 5 (1971), pp. 39–86",
    sourceType: "academic_paper",
    notes:
      "Cited for the archaeology of Siga, the Masaesylian royal city at the mouth of the Tafna, and its harbour; and for the site of the royal mausoleum on the hill of Beni Rhenane opposite, attributed either to Syphax or to his son Vermina.",
  },
  {
    key: "nm_desanges",
    title: "Catalogue des tribus africaines de l'Antiquité classique à l'ouest du Nil",
    author: "Jehan Desanges",
    publisher: "Université de Dakar, Faculté des Lettres et Sciences humaines",
    publishedYear: 1962,
    reference: "Publications de la Section d'Histoire 4; entries Massyli, Masaesyli, Mauri",
    sourceType: "academic_book",
    notes:
      "Cited for the ancient attestations of the peoples' names — Massylii, Masaesyli, Maurusii/Mauri, Numidae — and where each is located by the Greek and Latin writers. Used for the point that these are names as outsiders recorded them, not necessarily the peoples' own self-designations.",
  },
  {
    key: "nm_brett_fentress",
    title: "The Berbers",
    author: "Michael Brett and Elizabeth Fentress",
    publisher: "Blackwell",
    publishedYear: 1996,
    reference: "Chapter 1–2 (the Libyans, the kingdoms and Rome)",
    sourceType: "academic_book",
    notes:
      "Cited for a modern overview of the Numidian and Mauretanian kingdoms as indigenous states shaped by Punic and Hellenistic culture, for the royal tombs as statements of kingship, and for the caution against reading ancient ethnic names as fixed nations or as the direct ancestors of any modern group.",
  },
  {
    key: "nm_lazenby",
    title: "Hannibal's War: A Military History of the Second Punic War",
    author: "J. F. Lazenby",
    publisher: "Aris & Phillips",
    publishedYear: 1978,
    reference: "Chapters on Africa, 204–202 BCE, and the battle of Zama",
    sourceType: "academic_book",
    notes:
      "Cited for the modern reconstruction of Zama — the uncertain site (inland, west of Carthage, probably near Sicca/El Kef rather than at the town of Zama itself), the cavalry numbers and the decisive return of Masinissa's and Laelius's horse to the Carthaginian rear.",
  },
  {
    key: "nm_syme",
    title: "Sallust",
    author: "Ronald Syme",
    publisher: "University of California Press",
    publishedYear: 1964,
    reference: "Sather Classical Lectures 33; chapters on the Bellum Iugurthinum",
    sourceType: "academic_book",
    notes:
      "Cited for the date and purpose of the Bellum Iugurthinum and for Sallust's bias: a former partisan of Caesar, writing in retirement, who used the war to attack the corruption of the Roman nobility, and whose Numidian geography, chronology and speeches are often imprecise or composed.",
  },
  {
    key: "nm_roller",
    title: "The World of Juba II and Kleopatra Selene: Royal Scholarship on Rome's African Frontier",
    author: "Duane W. Roller",
    publisher: "Routledge",
    publishedYear: 2003,
    reference: "Whole book; chapters on Juba's youth, Caesarea, the coinage and the scholarship",
    sourceType: "academic_book",
    notes:
      "The standard English study of Juba II and Cleopatra Selene. Cited for Juba's upbringing in Rome, his birth (Roller argues for c. 48 BCE rather than 52–50), his writings and their survival in Pliny and others, the building of Caesarea, the purple industry, the royal coinage, and the uncertainties over Selene's death date and the Royal Mausoleum.",
  },
  {
    key: "nm_coltelloni",
    title: "Le royaume de Maurétanie sous Juba II et Ptolémée (25 av. J.-C. – 40 ap. J.-C.)",
    author: "Michèle Coltelloni-Trannoy",
    publisher: "CNRS Éditions",
    publishedYear: 1997,
    reference: "Études d'Antiquités africaines",
    sourceType: "academic_book",
    notes:
      "Cited for the administration, cities and coinage of the Mauretanian client kingdom under Juba II and Ptolemy, including the dating of Juba's reign from his regnal-year coins, and the cities of Iol-Caesarea and Volubilis.",
  },
  {
    key: "nm_draycott",
    title: "Cleopatra's Daughter: From Roman Prisoner to African Queen",
    author: "Jane Draycott",
    publisher: "Head of Zeus",
    publishedYear: 2022,
    reference: "Whole book",
    sourceType: "academic_book",
    notes:
      "A recent scholarly biography of Cleopatra Selene II. Cited for her life from Alexandria to Rome to Caesarea, her coinage (including the crocodile reverses and Greek legends), Egyptian and Isiac imagery at Caesarea, and the debated identifications of portraits said to show her.",
  },
  {
    key: "nm_mazard",
    title: "Corpus Nummorum Numidiae Mauretaniaeque",
    author: "Jean Mazard",
    publisher: "Arts et Métiers Graphiques",
    publishedYear: 1955,
    reference: "Paris 1955 (cited in numismatic catalogues as 'Mazard' with a catalogue number)",
    sourceType: "academic_book",
    notes:
      "The corpus of Numidian and Mauretanian royal coinage. Cited for the coin types of Syphax and Vermina, the uninscribed or Punic-initialled bronzes assigned to Masinissa and his successors, the bilingual silver of Juba I, the coinage of Bogud and Bocchus II, and the Latin and Greek coinage of Juba II and Cleopatra Selene. Many of its royal attributions have since been revised.",
  },
  {
    key: "nm_alexandropoulos",
    title: "Les monnaies de l'Afrique antique, 400 av. J.-C. – 40 ap. J.-C.",
    author: "Jacques Alexandropoulos",
    publisher: "Presses universitaires du Mirail",
    publishedYear: 2000,
    reference: "Toulouse 2000 (cited in catalogues as 'MAA' with a catalogue number)",
    sourceType: "academic_book",
    notes:
      "The current reference catalogue for North African coinage. Cited for the revised attributions — above all that the common bronzes with a bearded diademed head and a horse, long called 'coins of Masinissa', cannot be assigned securely to one king and are catalogued as 'Masinissa or Micipsa' or more broadly — and for the dating of the Mauretanian issues.",
  },
  {
    key: "nm_bouchenaki",
    title: "Le mausolée royal de Maurétanie",
    author: "Mounir Bouchenaki",
    publisher: "Ministère de l'Information et de la Culture",
    publishedYear: 1970,
    reference: "Alger 1970",
    sourceType: "academic_book",
    notes:
      "Cited for the description and dating of the Royal Mausoleum of Mauretania (Kbor er-Roumia): its circular drum with sixty engaged Ionic columns, stepped cone, spiral interior gallery and central chambers, the absence of any surviving burial, and the case for and against its attribution to Juba II and Cleopatra Selene.",
  },

  // --- Encyclopaedia articles read during research ---------------------------
  {
    key: "nm_wiki_masinissa",
    title: "Masinissa",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Masinissa",
    sourceType: "wikipedia",
    publishedDisplay: "read October 2026",
    notes:
      "Read during research. Cited only as the place where the English translation of Polybius 36.16 on Masinissa's agricultural achievement was read, and as a convenient summary of his career. One statement in it — that Masinissa's tomb at Cirta bears his name — is not supported by the evidence and is not followed here.",
  },
  {
    key: "nm_wiki_medracen",
    title: "Medracen",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Medracen",
    sourceType: "wikipedia",
    publishedDisplay: "read October 2026",
    notes:
      "Read during research. Cited for the two dates in circulation for the Medracen — fourth century BCE, or the time of Masinissa — and for the 2006/2007 ICOMOS report of damaging restoration work.",
  },
  {
    key: "nm_wiki_royal_mausoleum",
    title: "Royal Mausoleum of Mauretania",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Royal_Mausoleum_of_Mauretania",
    sourceType: "wikipedia",
    publishedDisplay: "read October 2026",
    notes:
      "Read during research. Cited for the Pomponius Mela reference (given there as 1.31) and its Latin phrase, the dimensions of the monument, the absence of human remains, and the later legends and attempts at demolition.",
  },
  {
    key: "nm_wiki_bocchus",
    title: "Bocchus I",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Bocchus_I",
    sourceType: "wikipedia",
    publishedDisplay: "read October 2026",
    notes:
      "Read during research. Cited only as the place where the English (Loeb) rendering of Sallust, Bellum Iugurthinum 19.7, on Bocchus ruling all the Mauri, was read; the statements in the record rest on Sallust himself.",
  },
  {
    key: "nm_wiki_volubilis",
    title: "Volubilis",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Volubilis",
    sourceType: "wikipedia",
    publishedDisplay: "read October 2026",
    notes:
      "Read during research. Cited for the Punic phase of Volubilis (a sanctuary, pottery and Punic inscriptions from the third century BCE; magistrates still called suffetes until after 44 CE) and for the debated view that Juba II made it a second capital.",
  },
  {
    key: "nm_wiki_zama",
    title: "Battle of Zama",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Battle_of_Zama",
    sourceType: "wikipedia",
    publishedDisplay: "read October 2026",
    notes:
      "Read during research. Cited for the modern consensus that the battlefield is uncertain and generally placed on the plain south of Sicca (El Kef), the Draa el Metnan, rather than at a securely identified 'Zama'.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

const events: SeedEvent[] = [
  // 1 -----------------------------------------------------------------------
  {
    slug: "massylii-and-masaesyli",
    title: "The Massylii and the Masaesyli: the two Numidian kingdoms",
    summary:
      "By the late third century BCE Greek and Latin writers name two indigenous kingdoms west of Carthage: the Massylii in the east, ruled by Gaia, and the Masaesyli in the west, ruled by Syphax.",
    description:
      "WHAT IT IS. The first North African kingdoms beyond Carthage that the written sources name. Polybius, listing the African troops Hannibal moved between Africa and Iberia in 218 BCE, names Massylii, Masaesyli and Maurusii among them (3.33.15). Livy, narrating 213 BCE, has two kings: Gala — the Gaia (GYY) of the Dougga inscription — ruling the Massylii in what is now eastern Algeria and western Tunisia, and Syphax ruling the Masaesyli from the Mulucha (Moulouya) to the Ampsaga (Oued el-Kebir) in what is now western and central Algeria. Appian tells the same story later and at second hand.\n\n" +
      "WHAT THE NAMES ARE. 'Massylii' and 'Masaesyli' are the forms Greek and Latin writers used; the Punic legend on later coins gives the Massylian name as MSLYYM. 'Numidae', the umbrella term, was explained in antiquity as the Greek nomades, 'nomads' — Sallust tells a fable deriving it from Persian settlers who called themselves Nomadas (Bellum Iugurthinum 18). The etymology is probably a Greek re-reading of a local name, and in any case the picture of the Numidians as nomads is an outsider's stereotype: the kingdoms had towns such as Cirta, Thugga and Siga and an agricultural base.\n\n" +
      "HOW IT IS DATED. The user's '300 BCE' is a round modern figure, not a date in any source, and has been CORRECTED here. The first datable mention of either name is Polybius's list for 218 BCE; the first datable kings are Gaia and Syphax in Livy's narrative of 213. Before that, Diodorus describes Agathocles' invasion of Carthaginian Africa (310–307 BCE) dealing with a 'king of the Libyans', Ailymas, and with Numidian groups — evidence that indigenous kingship existed earlier, though not under these names. The monumental tomb called the Medracen, inside later Massylian territory, has been radiocarbon-dated earlier still (see the royal-tombs record).\n\n" +
      "WHAT IT DOES NOT SHOW. These are political formations — kingdoms and confederations whose names the Romans recorded — not fixed ethnic nations or 'races'. Their people were among the Libyco-Berber-speaking populations of North Africa; linking them directly to any modern group is a separate, much harder question. Nobody in the sources calls them Mauri: that name belongs, in this period, to the peoples further west.\n\n" +
      "WHERE THE ACCOUNTS DISAGREE. Livy calls Masinissa's father Gala; the Dougga inscription, set up by Numidians, calls him GYY, usually written Gaia. The indigenous evidence is preferred here.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "numidia", "massylii", "masaesyli", "second-punic-war", "ethnonyms"),
    people: ["Gaia (Gala)", "Syphax", "Masinissa", "Ailymas"],
    civilisations: ["Numidia", "Carthage", "Rome", "Amazigh peoples"],
    locationName: "Numidia (eastern and central Algeria, western Tunisia)",
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Numidia 220 BC-fr.svg",
        caption:
          "A modern map of Numidia around 220 BCE showing the kingdom of Syphax (Masaesyli) in the west and of Gaia (Massylii) in the east, beside Carthaginian Africa. A reconstruction drawn from the ancient narratives; the frontiers were never so precise.",
        shows: "map",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "user:Redtony retouched by user:Sacamol",
        pixelWidth: 752,
        pixelHeight: 434,
      }),
      commonsPicture({
        fileName: "Western Mediterranean territory, 150 BC.svg",
        caption:
          "A modern map of the western Mediterranean around 150 BCE, after Masinissa had united the two Numidian kingdoms: Numidia, the shrunken Carthaginian territory and Roman holdings. Context for how the Massylian and Masaesylian lands ended up as one state.",
        shows: "map",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Goran_tek-en",
        pixelWidth: 1356,
        pixelHeight: 803,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_polybius",
        citations: [
          { sourceKey: "nm_desanges", relation: "supports", note: "Catalogues the ancient attestations of Massylii and Masaesyli and confirms Polybius's list as the earliest securely datable one." },
          { sourceKey: "nm_gsell", relation: "context", note: "Places the two kingdoms in the political history of Carthaginian Africa and explains how little is known of them before the Second Punic War." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "the African troops Hannibal sent across in 218 BCE, including Massylii, Masaesyli and Maurusii",
        datingMethod: "historical_record",
        chronology: "conventional",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "the first datable written mention of the Massylii and Masaesyli",
        evidence:
          "Polybius 3.33.15 lists the African contingents Hannibal transferred at the start of the war; he says he took his figures from Hannibal's own bronze inscription at the Lacinian promontory. The date is the start of the Second Punic War, fixed by both traditions. It dates the first surviving mention of the names, not the origin of the peoples or kingdoms.",
      },
      {
        sourceKey: "nm_livy",
        citations: [
          { sourceKey: "nm_appian", relation: "supports", note: "Gives a parallel, later account of Syphax and of Masinissa's father as the two Numidian rulers of the war years." },
          { sourceKey: "nm_dougga_dedication", relation: "context", note: "The Numidian inscription naming Masinissa's father as GYY — evidence that Livy's 'Gala' is a Latin garbling of the name." },
        ],
        startYear: bce(213),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Syphax and Gala, kings of the Numidians, in the consular year of 213 BCE",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "the first named kings of the two Numidian kingdoms",
        evidence:
          "Livy 24.48–49 narrates Roman envoys to Syphax and Carthage's alliance with Gala against him in 213 BCE. A consular-year date in a narrative written two centuries later, from earlier sources.",
      },
      {
        sourceKey: "nm_brett_fentress",
        citations: [
          { sourceKey: "nm_camps_masinissa", relation: "supports", note: "Argues that Numidian kingship and settled life were older than the Second Punic War sources reveal, citing the Medracen and Diodorus's 'king of the Libyans'." },
          { sourceKey: "nm_camps_medracen", relation: "context", note: "Radiocarbon evidence that a royal-scale tomb existed in the later Massylian heartland before Masinissa's time." },
          { sourceKey: "nm_diodorus", relation: "supports", note: "Reports a 'king of the Libyans' dealing with Agathocles in 310–307 BCE — indigenous kingship a century before the names appear." },
        ],
        startYear: bce(400),
        endYear: bce(220),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "formation of the Numidian kingdoms in the fourth and third centuries BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "estimated_range",
        whatIsDated: "the emergence of the kingdoms themselves, before they are named",
        evidence:
          "An inference, not a record. It combines the existence of a royal mausoleum (the Medracen) radiocarbon-dated before Masinissa, Diodorus's mention of a Libyan king allied to Agathocles in 310–307 BCE, and the fact that by 213 BCE both kingdoms are fully formed. No source names the Massylii or Masaesyli before 218 BCE.",
      },
    ],
  },

  // 2 -----------------------------------------------------------------------
  {
    slug: "syphax-and-siga",
    title: "Syphax of the Masaesyli and his capital at Siga",
    summary:
      "Syphax, king of the western Numidians, switched between Rome and Carthage, received both Scipio and Hasdrubal at Siga in 206 BCE, married the Carthaginian noblewoman Sophonisba, and was captured in 203 BCE.",
    description:
      "WHAT IT IS. Syphax was the most powerful North African king of the Second Punic War until 203 BCE. Livy has him negotiating with Rome as early as 213 BCE and fighting Carthage and its Massylian allies (24.48–49). In 206, according to Livy 28.17–18, both Scipio and the Carthaginian general Hasdrubal son of Gisco crossed to his capital, Siga, near the mouth of the Tafna in western Algeria, and found themselves dining at his table on the same day — a scene that shows how far the two great powers needed him.\n\n" +
      "ALLIANCES THAT SHIFTED. Syphax ended up on Carthage's side. Hasdrubal gave him his daughter in marriage — the woman Livy calls Sophonisba, whose Punic name is probably Ṣaphanbaʿal — which tied the Masaesylian dynasty into the Carthaginian aristocracy; she had earlier been promised to Masinissa. After Scipio invaded Africa in 204, Syphax's army was destroyed at the Great Plains and he was captured in 203 by Laelius and Masinissa (Livy 30.11–12). Masinissa then married Sophonisba himself; when Scipio demanded her as a prisoner for Rome, Masinissa sent her poison and she drank it (Livy 30.12–15). The romance and the speeches are Livy's composition; the marriage alliances between the Carthaginian and Numidian elites are real politics.\n\n" +
      "EVIDENCE ON THE GROUND. Siga's harbour town and acropolis have been excavated; on the hill of Beni Rhenane opposite stands a large royal mausoleum dated around 200 BCE and attributed to Syphax or to his son and successor Vermina — an attribution that is reasonable but not proved. Bronze coins with a bearded, diademed head and a Punic legend naming 'Syphax the king' are among the earliest royal coins struck by an indigenous North African ruler; his son Vermina struck silver.\n\n" +
      "WHERE THE ACCOUNTS DISAGREE. Polybius (16.23) says Syphax was led in Scipio's triumph in 201 and died in captivity afterwards. Livy (30.45) knows that version and rejects it: in his account Syphax died at Tibur shortly before the triumph. Both are kept below.\n\n" +
      "WHAT IT DOES NOT SHOW. Syphax is not called a Maurus by any source; he was king of the Masaesyli, a Numidian people. His western neighbours, the Maurusii, appear in Livy only as the people he retreated among.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "numidia", "masaesyli", "syphax", "siga", "sophonisba", "second-punic-war"),
    people: ["Syphax", "Sophonisba", "Hasdrubal son of Gisco", "Publius Cornelius Scipio Africanus", "Masinissa", "Gaius Laelius", "Vermina"],
    civilisations: ["Numidia", "Carthage", "Rome"],
    locationName: "Siga (Takembrit, mouth of the Tafna, western Algeria)",
    lat: 35.26,
    lng: -1.44,
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Monnaie - Bronze, Incertain, Maurétanie, Scyphax - btv1b84840208 (1 of 2).jpg",
        caption:
          "A bronze coin in the Bibliothèque nationale de France catalogued under Syphax (as 'Scyphax'), photographed by the library. Royal bronzes of this group, with a diademed head and a Punic legend, are the coins numismatists attribute to Syphax; the attribution is the BnF's.",
        shows: "artefact",
        identificationStatus: "probable",
        licence: "Public domain",
        creator: "Bibliothèque nationale de France, département des Monnaies, médailles et antiques",
        institution: "Bibliothèque nationale de France",
        accessionNumber: "btv1b84840208",
        objectDate: "late 3rd century BCE (as catalogued)",
        pixelWidth: 1642,
        pixelHeight: 1642,
      }),
      commonsPicture({
        fileName: "Royal Mausoleum of Syphax 01.jpg",
        caption:
          "UNVERIFIED — a photograph labelled by its uploader as the 'Royal Mausoleum of Syphax', taken in 2026 and presumably showing the remains of the royal mausoleum at Beni Rhenane opposite Siga. That the photograph shows Beni Rhenane rests on the uploader's label, and the tomb's attribution to Syphax rather than to his son Vermina is itself unproved.",
        shows: "site",
        identificationStatus: "unverified",
        licence: "CC BY-SA 3.0",
        creator: "Faycal.09",
        pixelWidth: 2048,
        pixelHeight: 1536,
      }),
      commonsPicture({
        fileName: "Giovanni Antonio Pellegrini - Sophonisba Receiving the Cup of Poison - Google Art Project.jpg",
        caption:
          "Giovanni Antonio Pellegrini's painting of Sophonisba receiving the cup of poison, made about 1708–1713 — a later artwork showing how Livy's story was retold in eighteenth-century Europe, not evidence for her appearance or for the event.",
        shows: "later_artwork",
        identificationStatus: "modern_interpretation",
        licence: "Public domain",
        creator: "Giovanni Antonio Pellegrini",
        objectDate: "c. 1708–1713",
        pixelWidth: 3365,
        pixelHeight: 4062,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_livy",
        citations: [
          { sourceKey: "nm_gsell", relation: "supports", note: "Reconstructs Syphax's reign and alliances from Livy and Polybius and accepts the outline of 213–203 BCE." },
          { sourceKey: "nm_appian", relation: "supports", note: "A later parallel account of Syphax's shifting alliances and his capture." },
        ],
        startYear: bce(213),
        endYear: bce(203),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Syphax's reign as recorded, 213–203 BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "the years in which Syphax is attested as king",
        evidence:
          "From his first appearance in Livy 24.48 (213 BCE) to his capture in 203 (Livy 30.11–12). His accession is not recorded, so the start is the first attestation, not the beginning of the reign.",
      },
      {
        sourceKey: "nm_livy",
        citations: [
          { sourceKey: "nm_vuillemot", relation: "context", note: "Identifies and describes Siga, the royal city where Livy sets the meeting." },
        ],
        startYear: bce(206),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Scipio and Hasdrubal both received by Syphax at Siga, 206 BCE",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "the visit of the Roman and Carthaginian commanders to Siga",
        evidence:
          "Livy 28.17–18. The detail that the two enemies shared a couch at the king's dinner may be embellishment; the diplomatic visit itself is accepted by modern historians.",
      },
      {
        sourceKey: "nm_livy",
        citations: [
          { sourceKey: "nm_appian", relation: "supports", note: "Also tells of Sophonisba's marriage to Syphax and her death by poison sent by Masinissa." },
        ],
        startYear: bce(203),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "capture of Syphax and death of Sophonisba, 203 BCE",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "Syphax's capture and the death of Sophonisba",
        evidence:
          "Livy 30.11–15. The narrative of Sophonisba is literary — speeches and a tragic arc — but the alliance-by-marriage and her death are not doubted in outline.",
      },
      {
        sourceKey: "nm_polybius",
        citations: [
          { sourceKey: "nm_livy", relation: "disputes", note: "Livy 30.45 reports Polybius's version and rejects it, saying Syphax died at Tibur before the triumph." },
        ],
        startYear: bce(201),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Syphax led in Scipio's triumph, then died a prisoner (Polybius 16.23)",
        datingMethod: "historical_record",
        chronology: "disputed",
        whatIsDated: "the death of Syphax",
        evidence:
          "Two ancient versions of the same death. Polybius, closer in time, has him in the triumph; Livy says he died just before it. Neither can be checked.",
      },
      {
        sourceKey: "nm_rakob",
        citations: [
          { sourceKey: "nm_vuillemot", relation: "supports", note: "Places the Beni Rhenane mausoleum at Siga and discusses its attribution to Syphax or Vermina." },
        ],
        startYear: bce(220),
        endYear: bce(190),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "royal mausoleum of Beni Rhenane, about 200 BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        whatIsDated: "the royal tomb opposite Siga",
        evidence:
          "Dated from its architecture and finds around 200 BCE. Its attribution to Syphax (who died in Italy) or to Vermina is an inference from the date and location.",
      },
    ],
  },

  // 3 -----------------------------------------------------------------------
  {
    slug: "mauri-and-early-mauretanian-kingdom",
    title: "The first Mauri and the kingdom west of the Mulucha",
    summary:
      "The earliest datable written references to the Maurusii or Mauri come from the Second Punic War, and the first king of the Mauri named in a surviving text is Baga, who escorted Masinissa around 206 BCE.",
    description:
      "WHAT IT IS. The beginning of the written history of the people from whose Latin name — Mauri — the much later European word 'Moors' descends. The names appear in two forms: Greek Maurousioi (Latin Maurusii) and Latin Mauri. Polybius lists Maurusii among the African troops Hannibal moved in 218 BCE (3.33.15). Livy's narrative of 213 has Syphax, defeated, withdrawing to the Maurusii who live near the Ocean opposite Gades (24.49). And around 206, when Masinissa returned from Spain to fight for his father's throne, Livy says he went first to Baga, king of the Mauri, who gave him an escort of four thousand Mauri (29.30). Baga is the first king of the Mauri named in any surviving text.\n\n" +
      "WHERE THEY WERE. In the sources the Mauri live in the far west of North Africa, in what is now northern Morocco and the westernmost part of Algeria, west of the Masaesylian kingdom. Sallust, writing c. 41 BCE about the years around 110 BCE, makes the river Mulucha (the Moulouya) the frontier between Bocchus's Mauri and Numidia (Bellum Iugurthinum 19, 92, 110). That frontier belongs to his own period and should not be projected back to Baga's time with confidence.\n\n" +
      "HOW IT IS DATED. The user's '300–200 BCE' has been NARROWED. Nothing earlier than 218 BCE names the Mauri; '300 BCE' would be a guess. The word's earlier history, and whether Greek writers before Polybius used it, is treated in the words-and-theories record on the earliest written Mauri.\n\n" +
      "MAURI AS SOLDIERS. Polybius's list shows Maurusian men already serving in Carthage's armies in 218. Modern accounts often call them 'mercenaries'; strictly the sources say only that they were among the African contingents, and whether they were hired, levied through allied chiefs, or both is not stated.\n\n" +
      "WHAT IT DOES NOT SHOW. 'Mauri' here is a Greek and Latin name for a set of peoples and a kingdom in north-west Africa — a political and geographical label recorded by outsiders. It says nothing about ancestry or skin colour, it is not the same as the medieval 'Moors' (a term Europeans later stretched over Muslims of many origins), and it cannot be read back onto the earlier populations of the region. Sallust's tale that the Mauri descend from Medes in Hercules' army (Bellum Iugurthinum 18) is a learned fable, reported but not believed here.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "mauretania", "mauri", "maurusii", "ethnonyms", "second-punic-war"),
    people: ["Baga", "Masinissa", "Syphax"],
    civilisations: ["Mauretania", "Numidia", "Carthage", "Amazigh peoples"],
    locationName: "North-west Africa west of the Moulouya (northern Morocco)",
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Map of the Kingdom of Mauretania.jpg",
        caption:
          "A modern map of the kingdom of Mauretania and its cities set within the Roman world, drawn for the late first century BCE. It shows the later, larger kingdom; in Baga's time the Mauri lay further west, beyond the Masaesylian kingdom.",
        shows: "map",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Arienne King",
        pixelWidth: 1472,
        pixelHeight: 792,
      }),
      commonsPicture({
        fileName: "Houghton MS Richardson 17 - Sallust manuscript, ca. 1490, f1.jpg",
        caption:
          "The opening folio of a manuscript of Sallust copied about 1490, now at Harvard's Houghton Library. Sallust's Jugurthine War is the source of the Mulucha frontier and of the fable of the Mauri's origin; this is how his text survived — through medieval and Renaissance copies.",
        shows: "manuscript",
        identificationStatus: "secure",
        licence: "Public domain",
        creator: "Sallust (text); unknown scribe",
        institution: "Houghton Library, Harvard University",
        accessionNumber: "MS Richardson 17",
        objectDate: "c. 1490",
        pixelWidth: 1083,
        pixelHeight: 1638,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_polybius",
        citations: [
          { sourceKey: "nm_desanges", relation: "supports", note: "Lists Polybius 3.33.15 among the earliest attestations of the Maurusii and locates them in the far west." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Maurusii among the African troops of 218 BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "the earliest datable written mention of the Maurusii",
        evidence:
          "Polybius's list of the contingents Hannibal moved at the outbreak of the war, said to be drawn from Hannibal's own inscription. It dates the first surviving mention, not the beginning of the people.",
      },
      {
        sourceKey: "nm_livy",
        citations: [
          { sourceKey: "nm_gsell", relation: "supports", note: "Accepts Baga as the earliest named Mauretanian king and places his kingdom in the far west." },
          { sourceKey: "nm_camps_masinissa", relation: "context", note: "Discusses Masinissa's return to Africa and the Mauretanian escort within his succession war." },
        ],
        startYear: bce(206),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Baga, king of the Mauri, gives Masinissa an escort of four thousand, c. 206 BCE",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "the first named king of the Mauri",
        evidence:
          "Livy 29.30 places the episode after Gaia's death, during Masinissa's return from Spain. Livy's chronology of these African years is loose, so 206 is approximate (some put it in 205).",
      },
      {
        sourceKey: "nm_sallust",
        citations: [
          { sourceKey: "nm_wiki_bocchus", relation: "context", note: "Where the English rendering of Sallust 19.7, on Bocchus ruling all the Mauri, was read during research." },
          { sourceKey: "nm_syme", relation: "context", note: "Warns that Sallust's African geography is imprecise, so the Mulucha frontier is his period's, not a timeless border." },
        ],
        startYear: bce(112),
        endYear: bce(105),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "the Mulucha as the frontier of the Mauri in Sallust's time",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        whatIsDated: "the river frontier between the kingdom of the Mauri and Numidia",
        evidence:
          "Sallust describes the Mulucha as the boundary of Bocchus's kingdom during the Jugurthine War. It is the first explicit western frontier, a century after Baga.",
      },
    ],
  },

  // 4 -----------------------------------------------------------------------
  {
    slug: "masinissa-birth",
    title: "Masinissa: birth, upbringing and early career",
    summary:
      "Masinissa, son of the Massylian king Gaia, was born around 238 BCE according to the ancient statements of his age at death; he was brought up in Carthage and first fought for it in Africa and Spain.",
    description:
      "WHAT IT IS. The beginning of the most important indigenous North African ruler of antiquity. Masinissa (Numidian MSNSN) was the son of Gaia, king of the Massylii. Ancient writers say he was educated at Carthage, his father's ally, and by about 213 BCE he was commanding Massylian and Carthaginian forces against Syphax. He then led Numidian cavalry for Carthage in Spain (212–206), before changing sides to Rome after the Carthaginian defeat at Ilipa.\n\n" +
      "HOW HIS BIRTH IS DATED. No source records the year. It is calculated backwards from his death in 148 BCE. Polybius (36.16) and Appian (Punica 106) say he was about ninety when he died, and Cicero's Cato speaks of him as still riding and campaigning at ninety (On Old Age 34). That gives about 238 BCE; modern works round it to c. 240/238. Livy, however, calls him a youth of seventeen in 213 BCE (24.49), which would put his birth about 230. The figures cannot both be exact. Most historians, following Camps, prefer the age-at-death tradition because it comes from Polybius, who met Masinissa; but 'ninety' is itself the sort of round figure ancient writers liked, so c. 238 is an approximation, not a known year.\n\n" +
      "THE FAMILY. Masinissa's father's name is given as Gala by Livy and as GYY (Gaia) by the Numidian inscription at Dougga, which also gives his grandfather's name (usually read Zilalsan). The dynasty therefore goes back at least two generations before the war — which matters, because it shows the Massylian kingship was not created by Rome.\n\n" +
      "WHAT IT DOES NOT SHOW. Masinissa is widely honoured today as an Amazigh ancestor-figure, and he was certainly an indigenous North African king who ruled Libyco-Berber-speaking subjects. But the ancient sources call him a Numidian king, not a Maurus, and modern claims about his descendants or his 'race' go well beyond what any evidence can support.",
    category: "people",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "numidia", "masinissa", "massylii", "second-punic-war"),
    people: ["Masinissa", "Gaia (Gala)"],
    civilisations: ["Numidia", "Carthage", "Amazigh peoples"],
    locationName: "Massylian Numidia (eastern Algeria)",
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "MASSINISSA - MAA 23 - 87000716.jpg",
        caption:
          "A Numidian royal bronze catalogued as 'Massinissa or Micipsa' (MAA 23; Mazard 60): a diademed bearded head and, on the other side, a rearing horse with the Punic letters MN. The attribution to Masinissa himself is possible but not secure — which is exactly the problem with 'portraits' of him.",
        shows: "artefact",
        identificationStatus: "possible",
        licence: "Public domain",
        creator: "Classical Numismatic Group (CNG)",
        objectDate: "203–148 BCE or 148–118 BCE",
        pixelWidth: 800,
        pixelHeight: 378,
      }),
      commonsPicture({
        fileName: "Statue of the Amazigh leader Masinissa.jpg",
        caption:
          "A modern public statue of Masinissa, photographed in 2025 — a present-day image of how he is remembered as an Amazigh ancestor-figure. It is a modern artwork and preserves nothing of his actual appearance.",
        shows: "later_artwork",
        identificationStatus: "modern_interpretation",
        licence: "CC BY-SA 4.0",
        creator: "Dzkouslavia",
        pixelWidth: 2268,
        pixelHeight: 4032,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_polybius",
        citations: [
          { sourceKey: "nm_appian", relation: "supports", note: "Punica 106 also gives his age at death as about ninety." },
          { sourceKey: "nm_cicero_senectute", relation: "supports", note: "Remembers him as still vigorous at ninety; literary, but independent of Polybius." },
          { sourceKey: "nm_camps_masinissa", relation: "supports", note: "Adopts c. 238 BCE as the working birth date on this basis." },
        ],
        startYear: bce(238),
        datePrecision: "year",
        isApproximate: true,
        uncertaintyPlus: 3,
        uncertaintyMinus: 3,
        originalDateText: "about ninety years old at his death in 148 BCE",
        datingMethod: "claimant_inference",
        chronology: "conventional",
        temporalClaimType: "calculated_date",
        whatIsDated: "Masinissa's birth",
        evidence:
          "148 BCE (his death, fixed by the Third Punic War narrative) minus about ninety years. The tolerance reflects that 'ninety' is a round figure and that ancient age reckoning was inclusive.",
      },
      {
        sourceKey: "nm_livy",
        citations: [
          { sourceKey: "nm_gsell", relation: "context", note: "Discusses the conflict between Livy's 'seventeen in 213' and the ninety years at death." },
        ],
        startYear: bce(230),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "a youth of seventeen when he fought Syphax in 213 BCE",
        datingMethod: "claimant_inference",
        chronology: "alternative",
        temporalClaimType: "calculated_date",
        whatIsDated: "Masinissa's birth",
        evidence:
          "Livy 24.49. Taken literally it puts his birth around 230 BCE and makes him about eighty-two at death. Usually regarded as a rhetorical 'youth' figure; kept because it is in a primary narrative.",
      },
      {
        sourceKey: "nm_livy",
        citations: [
          { sourceKey: "nm_appian", relation: "supports", note: "Appian also has Masinissa raised at Carthage and serving Carthage in Spain before his defection." },
        ],
        startYear: bce(212),
        endYear: bce(206),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Masinissa commanding Numidian cavalry for Carthage in Spain until his defection",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "his service with Carthage in Iberia",
        evidence:
          "Livy's narrative of the Spanish war (books 25–28). The defection after Ilipa (206) is placed by Livy in 206–205.",
      },
    ],
  },

  // 5 -----------------------------------------------------------------------
  {
    slug: "battle-of-zama",
    title: "Zama: Numidian cavalry and the defeat of Hannibal",
    summary:
      "In 202 BCE Scipio defeated Hannibal in Africa; the ancient accounts make the return of Masinissa's Numidian and Laelius's Roman cavalry to the Carthaginian rear decisive.",
    description:
      "WHAT IT IS. The last battle of the Second Punic War, fought inland, west of Carthage, in 202 BCE. Scipio had about 29,000 infantry and some 6,000 horse, the larger part of them Numidians brought by Masinissa; Hannibal had more infantry, some eighty elephants and fewer cavalry, among them Numidians loyal to Carthage. The surviving narratives are Polybius 15.9–16, the nearer and better account, and Livy 30.29–35, which follows Polybius closely; Appian (Punica 40–47) adds a romanticised duel.\n\n" +
      "WHAT THE NUMIDIANS DID. The elephant charge was disrupted; the Roman and Numidian cavalry on the wings drove off the Carthaginian horse and pursued it from the field. The infantry fight was long and close. Polybius says the outcome was decided when Masinissa's and Laelius's cavalry returned and fell on the rear of Hannibal's line. Numidian horsemen had done the same thing for Hannibal at Cannae fourteen years earlier; at Zama the best of them were on the other side, which is a large part of why Rome won.\n\n" +
      "WHERE IT WAS. Not certainly known. 'Zama' is the name later Roman writers attached to it, after a town Hannibal had marched to; Polybius places the armies near a place he calls Margaron and Livy near Naraggara. Most modern historians put the battlefield on the plain south-east of Sicca (El Kef, Tunisia) — the Draa el Metnan is often proposed — rather than at either of the sites identified as Zama Regia. No battlefield archaeology fixes it. No coordinates are given here for that reason.\n\n" +
      "HOW IT IS DATED. The year, 202 BCE, is secure in both traditions. The often-printed day, 19 October 202 BCE, is a MODERN CONJECTURE, not an ancient date: it comes from computing a solar eclipse that a late Byzantine epitome (Zonaras) says occurred during the battle, and the identification of that eclipse with the battle is uncertain. It is kept below as a separate, labelled claim.\n\n" +
      "WHAT FOLLOWED. The peace of 201 BCE confirmed Masinissa as king over both the Massylii and the former kingdom of Syphax, and forbade Carthage to make war in Africa without Roman permission — the clause that let Masinissa encroach on Carthaginian land for fifty years.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "numidia", "carthage", "second-punic-war", "cavalry", "masinissa", "hannibal"),
    people: ["Masinissa", "Hannibal Barca", "Publius Cornelius Scipio Africanus", "Gaius Laelius"],
    civilisations: ["Numidia", "Carthage", "Rome"],
    locationName: "Inland Tunisia, probably near Sicca (El Kef); exact site unknown",
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Battle of Zama, 202 BC.svg",
        caption:
          "A modern schematic reconstruction of the battle of Zama: the Roman and Carthaginian infantry lines, the elephants, and the cavalry on the wings — Masinissa's Numidians on the Roman right. Drawn from Polybius; the positions are a modern interpretation and the battlefield itself is unlocated.",
        shows: "diagram",
        identificationStatus: "modern_interpretation",
        licence: "Public domain",
        creator: "MagentaGreen",
        pixelWidth: 512,
        pixelHeight: 362,
      }),
      commonsPicture({
        fileName: "Battle of Zama-battleplan.png",
        caption:
          "A second modern battle plan of Zama, drawn independently, showing the phases of the cavalry action and the infantry fight. A reconstruction for orientation only: it commits to details the ancient accounts leave open.",
        shows: "reconstruction",
        identificationStatus: "modern_interpretation",
        licence: "Public domain",
        pixelWidth: 744,
        pixelHeight: 526,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_polybius",
        citations: [
          { sourceKey: "nm_livy", relation: "supports", note: "Livy 30.29–35 follows Polybius on the year, the order of battle and the decisive cavalry return." },
          { sourceKey: "nm_appian", relation: "supports", note: "Punica 40–47 gives the same year and outcome in a more embellished narrative." },
          { sourceKey: "nm_lazenby", relation: "context", note: "Modern military reconstruction of the battle and its uncertainties." },
        ],
        startYear: bce(202),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "the battle at the end of the Second Punic War, 202 BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "the battle",
        evidence:
          "Fixed by the consular year in Livy and by Polybius's sequence of events leading to the peace of 201 BCE. Secure to the year.",
      },
      {
        sourceKey: "nm_lazenby",
        citations: [
          { sourceKey: "nm_wiki_zama", relation: "context", note: "Summarises the modern view that the site is uncertain and that the exact day is not given by Polybius or Livy." },
          { sourceKey: "nm_zonaras", relation: "context", note: "The late epitome that reports an eclipse during the battle — the only basis for the computed day." },
        ],
        startYear: bce(202),
        startMonth: 10,
        startDay: 19,
        datePrecision: "day",
        isApproximate: true,
        originalDateText: "19 October 202 BCE, from a solar eclipse said to have occurred during the battle",
        datingMethod: "astronomical",
        chronology: "hypothesis",
        temporalClaimType: "proposed_correlation",
        whatIsDated: "the day of the battle",
        evidence:
          "A modern correlation between the eclipse that the late epitome of Zonaras associates with the battle and a computed solar eclipse of 19 October 202 BCE (proleptic Julian). Neither Polybius nor Livy gives a day, and the eclipse report is late and may not belong to the battle; treat the day as conjecture.",
      },
      {
        sourceKey: "nm_polybius",
        citations: [
          { sourceKey: "nm_gsell", relation: "supports", note: "Explains how the peace terms gave Masinissa the kingdom of Syphax and the right to press Carthage." },
        ],
        startYear: bce(201),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "the peace of 201 BCE confirming Masinissa as king",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "the settlement that followed the battle",
        evidence:
          "Polybius 15.18 and Livy 30.37 give the peace terms, including the restoration to Masinissa of what had belonged to him and his ancestors.",
      },
    ],
  },

  // 6 -----------------------------------------------------------------------
  {
    slug: "masinissa-kingdom",
    title: "Masinissa's kingdom: Numidia united, 202–148 BCE",
    summary:
      "For over fifty years Masinissa ruled a united Numidia from Cirta, took land from Carthage, traded grain across the Mediterranean and was honoured at Thugga with a temple dedicated in 139 BCE.",
    description:
      "WHAT IT IS. After Zama, Masinissa held both the Massylian kingdom and the former lands of Syphax. He ruled from Cirta (Constantine, Algeria) until his death in 148 BCE, using the treaty of 201 — which bound Carthage not to make war without Rome's leave — to annex Carthaginian territory piece by piece. When Carthage finally fought back in 150 BCE it gave Rome the pretext for the Third Punic War, which ended with the destruction of Carthage in 146, two years after Masinissa died.\n\n" +
      "STATECRAFT. Masinissa ran a Hellenistic-style monarchy: royal estates, a standing army, coinage, sons sent to be educated in Greek, gifts of grain to Rhodes and Delos (where statues of him and his sons were set up). Polybius met him — he reports Masinissa telling him about Hannibal's character (9.25) — and wrote his obituary (36.16).\n\n" +
      "THE AGRICULTURE CLAIM — CHECKED. Polybius's praise, in W. R. Paton's translation as quoted in the English Wikipedia article read during research: 'Numidia had been before his time universally unproductive, and was looked upon as incapable of producing any cultivated fruits. He was the first and only man who showed that it could produce cultivated fruits just as well as any other country.' Appian (Punica 106) and Strabo (17.3.15) make the same point — that Masinissa turned nomads into farmers. As a statement of what Masinissa's admirers believed, it is genuine. As history it is EXAGGERATED: farming and settled villages in the Maghreb go back to the Neolithic, Numidian towns existed before him, and Camps showed that the Roman and Greek picture of Numidians as pure nomads is a stereotype. What Masinissa plausibly did was expand royal estates and grain production for export.\n\n" +
      "CITIES. Cirta was the royal capital; Thugga (Dougga, Tunisia), Bulla Regia, Hippo Regius and others were Numidian towns. At Thugga the citizens dedicated a sanctuary to the deified Masinissa in the tenth year of his son Micipsa, 139/138 BCE, with an inscription in Punic and in Libyco-Berber script — the most direct Numidian voice to survive from his reign's aftermath.\n\n" +
      "WHAT IT DOES NOT SHOW. Masinissa's tomb is not securely identified; the tower at Es-Soumâa du Khroub near Cirta is often called 'Masinissa's tomb', but that attribution is unproved (see the royal-tombs record).",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "numidia", "masinissa", "cirta", "thugga", "dougga", "libyco-berber", "agriculture"),
    people: ["Masinissa", "Micipsa", "Polybius", "Scipio Aemilianus"],
    civilisations: ["Numidia", "Carthage", "Rome", "Ancient Greece"],
    locationName: "Cirta (Constantine, Algeria) and Thugga (Dougga, Tunisia)",
    lat: 36.365,
    lng: 6.615,
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Dédicace punico-berbère en l'honneur du roi Massinissa.jpg",
        caption:
          "The bilingual Punic and Libyco-Berber dedication from Dougga in honour of King Masinissa, son of Gaia, set up in the tenth year of Micipsa (139/138 BCE): Punic letters above, the Libyco-Berber lines in their geometric script. Direct evidence from a Numidian town.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "CC0",
        creator: "MTLCanadien",
        objectDate: "139/138 BCE",
        pixelWidth: 1028,
        pixelHeight: 771,
      }),
      commonsPicture({
        fileName: "Kingdom of Numidia-02.png",
        caption:
          "A modern map of the kingdom of Numidia at its height, built from historical-atlas boundaries and settlement data, with Cirta, Thugga and the other towns. A reconstruction for orientation; Numidia's frontiers moved throughout Masinissa's reign.",
        shows: "map",
        identificationStatus: "secure",
        licence: "CC BY 4.0",
        creator: "Cattette",
        pixelWidth: 2246,
        pixelHeight: 971,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_polybius",
        citations: [
          { sourceKey: "nm_appian", relation: "supports", note: "Appian gives the same span, from the end of the Second Punic War to his death early in the Third." },
          { sourceKey: "nm_camps_masinissa", relation: "context", note: "The standard reconstruction of his reign and state." },
        ],
        startYear: bce(202),
        endYear: bce(148),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "king of all Numidia from Zama to his death in 148 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "Masinissa's reign over the united kingdom",
        evidence:
          "From his recognition after Zama and the peace of 201 to his death in 148 during the Roman siege of Carthage. He had been a claimant to the Massylian throne since 206.",
      },
      {
        sourceKey: "nm_dougga_dedication",
        citations: [
          { sourceKey: "nm_gsell", relation: "supports", note: "Discusses the Dougga dedication as evidence for a royal cult of Masinissa after his death." },
          { sourceKey: "nm_brett_fentress", relation: "context", note: "Uses the bilingual inscriptions of Dougga to show Punic and Libyco-Berber writing in civic use." },
        ],
        startYear: bce(139),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "in the tenth year of King Micipsa",
        datingMethod: "regnal_chronology",
        chronology: "archaeological",
        whatIsDated: "the dedication of the sanctuary of Masinissa at Thugga",
        evidence:
          "The inscription dates itself by Micipsa's regnal year; counting from his accession in 148 gives 139/138 BCE. The astronomical year here uses 139.",
      },
      {
        sourceKey: "nm_polybius",
        citations: [
          { sourceKey: "nm_wiki_masinissa", relation: "context", note: "The page where Paton's English rendering of Polybius 36.16 was read during research." },
          { sourceKey: "nm_strabo", relation: "supports", note: "Strabo 17.3.15 likewise credits Masinissa with turning Numidian nomads into farmers." },
          { sourceKey: "nm_camps_masinissa", relation: "disputes", note: "Shows that settled agriculture in the region long predates Masinissa; the claim is praise, not history." },
        ],
        startYear: bce(148),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Polybius's obituary: Numidia unproductive before him, fruitful after",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        whatIsDated: "the ancient claim about Masinissa's agricultural achievement",
        evidence:
          "Dated to the obituary Polybius wrote at Masinissa's death. The claim is real as a claim; its content is contradicted by the archaeology of earlier farming in the Maghreb.",
      },
    ],
  },

  // 7 -----------------------------------------------------------------------
  {
    slug: "numidian-royal-tombs-medracen-and-dougga",
    title: "Numidian royal tombs: the Medracen, Dougga and Es-Soumâa",
    summary:
      "Monumental tombs built for Numidian rulers between about the fourth and second centuries BCE combine the indigenous round tumulus with Greek and Punic architecture.",
    description:
      "WHAT IT IS. A group of royal or princely tombs that are the largest surviving buildings of the Numidian kingdoms. The MEDRACEN (Imedghassen), near Batna in Algeria, is a huge stepped cone on a cylindrical drum about 59 m across, ringed by sixty engaged Doric columns under an Egyptian-style cavetto cornice. The LIBYCO-PUNIC MAUSOLEUM OF DOUGGA, in Tunisia, is a three-storey tower about 21 m high crowned by a pyramid, with Aeolic and Ionic details. ES-SOUMÂA DU KHROUB, near Constantine, is a tower mausoleum on a stepped base, excavated in 1915, in which a cremation burial with weapons and silver vessels was found. Further west, the BENI RHENANE mausoleum opposite Siga belongs to the Masaesylian kings (see the Syphax record).\n\n" +
      "WHAT THEY SHOW. Rulers who borrowed the architectural language of the Hellenistic Mediterranean and of Carthage to monumentalise a much older local form — the round tumulus and bazina tombs found across the Maghreb (see the record on ancient North African burial monuments). Tomb-building was a statement of kingship, made in a style other Mediterranean kings would recognise.\n\n" +
      "HOW THEY ARE DATED. Separately, and with real uncertainty. Camps used radiocarbon measurements on wood from the Medracen to argue that it is older than Masinissa — usually reported as the fourth to third century BCE — while others had placed it in Masinissa's time. The Dougga mausoleum carried a bilingual Punic and Libyco-Berber inscription naming the man it was built for, conventionally read Ateban son of Iepmatath, and its builders; it is dated by its architecture and script to the third or early second century BCE. Es-Soumâa is dated to the second century BCE and is often said to be Masinissa's or Micipsa's tomb; neither attribution is proved.\n\n" +
      "WHAT HAPPENED TO THEM. In 1842 the British consul Thomas Reade had the Dougga inscription removed — it is now in the British Museum — and the tower largely collapsed; French archaeologists rebuilt it in 1908–1910, so what stands is a reconstruction. ICOMOS reported damaging 'repair work' at the Medracen in 2006/2007.\n\n" +
      "WHAT IT DOES NOT SHOW. None of these tombs is securely Masinissa's, and the Dougga mausoleum is not a king's tomb in the inscription's own terms. Calling them 'Moorish' would be anachronistic: they are Numidian.",
    category: "archaeology",
    subcategory: LANE,
    eventType: "archaeological_interpretation",
    tags: laneTags("numidiaMauretania", "numidia", "royal-tombs", "medracen", "dougga", "architecture", "libyco-berber"),
    people: ["Ateban", "Masinissa", "Micipsa", "Thomas Reade"],
    civilisations: ["Numidia", "Carthage", "Ancient Greece", "Amazigh peoples"],
    locationName: "Medracen (Batna, Algeria); Dougga (Tunisia); El Khroub (Algeria)",
    identificationStatus: "secure",
    evidenceStatus: "strongly_documented",
    media: [
      commonsPicture({
        fileName: "Medracen tomb (Numidian) (15253633173).jpg",
        caption:
          "The Medracen (Imedghassen) near Batna, Algeria: a stepped cone on a drum ringed with engaged Doric columns. Photographed in 2014. The monument itself — the oldest of the great Numidian royal tombs.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY-SA 2.0",
        creator: "Dan Sloan",
        objectDate: "4th–3rd century BCE (radiocarbon, disputed)",
        pixelWidth: 4912,
        pixelHeight: 3264,
      }),
      commonsPicture({
        fileName: "The Mausoleum of Ateban, Dougga, Tunisia 1.jpg",
        caption:
          "The Libyco-Punic Mausoleum at Dougga, Tunisia, as it stands today after its rebuilding in 1908–1910: a three-storey tower crowned by a pyramid. Photographed in 2018.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Monaam Ben Fredj",
        objectDate: "3rd–2nd century BCE (rebuilt 1908–1910)",
        pixelWidth: 3821,
        pixelHeight: 5724,
      }),
      commonsPicture({
        fileName: "1900 monument dougga.jpg",
        caption:
          "The Dougga mausoleum around 1900, before its reconstruction, still a ruin after the 1842 removal of its bilingual inscription. Useful for seeing how much of today's tower is a modern rebuilding.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "Public domain",
        creator: "Unknown photographer (uploaded by Profburp)",
        objectDate: "c. 1900",
        pixelWidth: 1000,
        pixelHeight: 735,
      }),
      commonsPicture({
        fileName: "Massinissa Tomb 01.jpg",
        caption:
          "UNVERIFIED — the tower mausoleum of Es-Soumâa du Khroub near Constantine, Algeria, labelled on Commons as 'Massinissa Tomb'. The photograph shows the monument; what is unverified is its popular identification as Masinissa's tomb, which no inscription or burial evidence establishes.",
        shows: "site",
        identificationStatus: "unverified",
        licence: "CC BY 4.0",
        creator: "Bernard Gagnon",
        objectDate: "2nd century BCE (monument)",
        pixelWidth: 3832,
        pixelHeight: 2555,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_camps_medracen",
        citations: [
          { sourceKey: "nm_wiki_medracen", relation: "context", note: "Records the two dates in circulation for the Medracen and the damaging modern repairs." },
          { sourceKey: "nm_rakob", relation: "supports", note: "Places the Medracen at the head of the series of Numidian royal mausolea." },
        ],
        startYear: bce(400),
        endYear: bce(200),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Medracen: fourth to third century BCE by radiocarbon on its timbers",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "construction of the Medracen",
        evidence:
          "Radiocarbon on wood from the monument as argued by Camps (1973). A radiocarbon date on timber dates the felling of the tree, which can be earlier than the building; the precise calibrated figures were not checked during research.",
      },
      {
        sourceKey: "nm_wiki_medracen",
        citations: [
          { sourceKey: "nm_gsell", relation: "supports", note: "Earlier scholarship that associated the great royal tombs with Masinissa's dynasty." },
        ],
        startYear: bce(210),
        endYear: bce(150),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Medracen: the time of Masinissa",
        datingMethod: "stylistic_comparison",
        chronology: "alternative",
        whatIsDated: "construction of the Medracen",
        evidence:
          "The older, stylistic dating that tied the Medracen to Masinissa's reign. Largely superseded by the radiocarbon argument but still found in the literature.",
      },
      {
        sourceKey: "nm_ateban_inscription",
        citations: [
          { sourceKey: "nm_rakob", relation: "supports", note: "Dates the Dougga tower architecturally to the third or early second century BCE." },
          { sourceKey: "nm_brett_fentress", relation: "context", note: "Reads the Dougga tomb as an indigenous elite monument in a Punic-Hellenistic idiom." },
        ],
        startYear: bce(250),
        endYear: bce(150),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Dougga mausoleum: third or second century BCE",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        whatIsDated: "construction of the Libyco-Punic Mausoleum of Dougga",
        evidence:
          "Dated by its architecture and the letter-forms of its bilingual inscription. The inscription names its builders but gives no regnal date.",
      },
      {
        sourceKey: "nm_rakob",
        citations: [
          { sourceKey: "nm_camps_masinissa", relation: "context", note: "Discusses, and doubts, the identification of Es-Soumâa as Masinissa's tomb." },
        ],
        startYear: bce(200),
        endYear: bce(100),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Es-Soumâa du Khroub: second century BCE",
        datingMethod: "archaeological",
        chronology: "historical",
        whatIsDated: "construction of the Es-Soumâa mausoleum",
        evidence:
          "Dated by architecture and by the grave goods found in 1915. Attribution to Masinissa (d. 148) or Micipsa (d. 118) is a hypothesis.",
      },
    ],
  },

  // 8 -----------------------------------------------------------------------
  {
    slug: "jugurthine-war",
    title: "The Jugurthine War: Numidian resistance and Roman expansion",
    summary:
      "Between 112 and 105 BCE Rome fought Jugurtha, Masinissa's grandson, after his capture of Cirta ended in the killing of Italian traders; Sallust's partisan history is almost the only account.",
    description:
      "WHAT IT IS. After Micipsa died in 118 BCE his kingdom was meant to be shared between his sons Adherbal and Hiempsal and his adopted nephew Jugurtha, who had served with distinction under Scipio Aemilianus at Numantia. Jugurtha had Hiempsal killed, drove out Adherbal, and in 112 BCE took Cirta after a siege. Sallust says that the Italian businessmen who had helped defend the city were killed along with Adherbal (Bellum Iugurthinum 26). That massacre turned a Numidian succession dispute into a Roman war.\n\n" +
      "THE COURSE OF THE WAR. Rome declared war in 111. The first commanders made deals Sallust calls bribery; a Roman army surrendered at Suthul in 110. Quintus Caecilius Metellus restored discipline and won battles from 109 but could not catch Jugurtha. Gaius Marius, elected consul for 107, took over, recruited from the poor, and pressed into the interior; Jugurtha drew in his father-in-law Bocchus of Mauretania. The war ended in 105 when Bocchus betrayed Jugurtha to Marius's quaestor Sulla (see the capture record).\n\n" +
      "HOW WE KNOW. Almost entirely from Sallust, who wrote around 41–40 BCE, more than sixty years later. He had been governor of Africa Nova, so he knew the country, but he was writing a political pamphlet as much as a history: his theme is the venality of the Roman nobility ('a city for sale'), and his Marius is a hero of the people against the aristocracy. His chronology is vague, his geography sometimes wrong, and his speeches are his own. Plutarch's Marius and scraps in Livy's summaries, Diodorus and Velleius add little independent detail.\n\n" +
      "WHAT IT SHOWS. Rome intervening in an independent African kingdom to protect Roman and Italian commercial interests and its own authority; the war also made the careers of Marius and Sulla, whose rivalry later tore the Republic apart. It is presented in the sources as 'resistance' only from the Roman side — Jugurtha's own aims survive only through his enemies.\n\n" +
      "WHAT IT DOES NOT SHOW. Jugurtha was a Numidian king, not a Maurus, though Mauretanian forces fought with him. Sallust's ethnographic digression on Africa (17–19) is a learned compilation, not ethnography of the war.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "numidia", "jugurtha", "sallust", "marius", "metellus", "roman-expansion"),
    people: ["Jugurtha", "Adherbal", "Hiempsal I", "Micipsa", "Quintus Caecilius Metellus Numidicus", "Gaius Marius", "Lucius Cornelius Sulla", "Sallust"],
    civilisations: ["Numidia", "Mauretania", "Rome"],
    locationName: "Numidia (Algeria and Tunisia)",
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Jugurthine war Numidia-en.svg",
        caption:
          "A modern map of Numidia between 112 and 105 BCE with the main battles of the Jugurthine War, vectorised from a United States Military Academy atlas. A reconstruction: several of the sites Sallust names are not securely located.",
        shows: "map",
        identificationStatus: "modern_interpretation",
        licence: "Public domain",
        creator: "Frank Martini, Department of History, United States Military Academy",
        pixelWidth: 859,
        pixelHeight: 1112,
      }),
      commonsPicture({
        fileName: "Sallust, Bellum Iugurthinum, Vaticanus Palatinus lat. 883.jpg",
        caption:
          "The opening of Sallust's Bellum Iugurthinum, with interlinear glosses, in a medieval manuscript in the Vatican Library (Pal. lat. 883, fol. 21r). The war is known almost entirely through copies like this of one partisan Roman author.",
        shows: "manuscript",
        identificationStatus: "secure",
        licence: "Public domain",
        creator: "Sallust (text); medieval scribe",
        institution: "Biblioteca Apostolica Vaticana",
        accessionNumber: "Vat. Pal. lat. 883",
        pixelWidth: 1420,
        pixelHeight: 2236,
      }),
      commonsPicture({
        fileName: "Monnaie, Didrachme, Argent, Incertain, Numidie, Jugurtha.jpg",
        caption:
          "UNVERIFIED — a silver Numidian coin in the Bibliothèque nationale de France catalogued under Jugurtha. The photograph is of a genuine Numidian royal silver piece; what is unverified is the attribution to Jugurtha, since no coin bears his name and modern catalogues assign such pieces to Masinissa's successors more cautiously.",
        shows: "artefact",
        identificationStatus: "unverified",
        licence: "CC0",
        creator: "Bibliothèque nationale de France, département des Monnaies, médailles et antiques",
        institution: "Bibliothèque nationale de France",
        objectDate: "catalogued as 160–104 BCE",
        pixelWidth: 1069,
        pixelHeight: 1054,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_sallust",
        citations: [
          { sourceKey: "nm_syme", relation: "context", note: "Explains Sallust's date, purpose and partisan slant, and the vagueness of his chronology." },
          { sourceKey: "nm_plutarch_lives", relation: "supports", note: "Plutarch's Marius gives the same outline of the war's end and Marius's command." },
          { sourceKey: "nm_gsell", relation: "context", note: "Reconstructs the war's chronology from Sallust and the fragments." },
        ],
        startYear: bce(112),
        endYear: bce(105),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "from the fall of Cirta to the surrender of Jugurtha, 112–105 BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "the war",
        evidence:
          "Rome formally declared war in 111; the conflict is conventionally counted from the Cirta massacre of 112 that provoked it. The end is fixed by Jugurtha's capture in 105.",
      },
      {
        sourceKey: "nm_sallust",
        citations: [
          { sourceKey: "nm_syme", relation: "context", note: "Notes that Sallust may exaggerate the scale of the massacre to sharpen his attack on the Senate's inaction." },
        ],
        startYear: bce(112),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "the killing of the Italians at Cirta",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "the Cirta massacre",
        evidence:
          "Bellum Iugurthinum 26. Sallust is the sole narrative; the event is accepted, the numbers and blame less certain.",
      },
      {
        sourceKey: "nm_syme",
        citations: [
          { sourceKey: "nm_sallust", relation: "context", note: "The work itself, which Syme dates by its relation to Sallust's other writings and career." },
        ],
        startYear: bce(41),
        endYear: bce(40),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Sallust writing the Bellum Iugurthinum, c. 41–40 BCE",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        whatIsDated: "the composition of the main source",
        evidence:
          "Dated from Sallust's career (retirement after 44 BCE) and the sequence of his works. Shows the distance — over sixty years — between the war and its only full account.",
      },
    ],
  },

  // 9 -----------------------------------------------------------------------
  {
    slug: "bocchus-i-of-mauretania",
    title: "Bocchus I and Mauretanian power in the Jugurthine War",
    summary:
      "Bocchus I, king of the Mauri beyond the Mulucha and father-in-law of Jugurtha, joined the war against Rome about 108 BCE and then changed sides, emerging as a Roman ally with an enlarged kingdom.",
    description:
      "WHAT IT IS. The first Mauretanian king who appears as a major player in Mediterranean politics. Sallust introduces Bocchus in his geographical excursus: the English (Loeb) rendering of Bellum Iugurthinum 19.7, as read during research on the English Wikipedia page for Bocchus I, says 'All the Moors were ruled by King Bocchus, who knew nothing of the Roman people save their name and was in turn unknown to us before that time either in peace or in war.' ('Moors' there is the translator's word for Sallust's Mauri.) He was probably a descendant of Baga.\n\n" +
      "HOW HE ENTERED THE WAR. Jugurtha was married to a daughter of Bocchus (Sallust 80.6). After Metellus's victories Jugurtha won Bocchus over, Sallust says, partly with the promise of a third of Numidia, and the two kings fought Marius together near Cirta in 106 BCE. Bocchus then reopened talks with the Romans through Marius's quaestor Sulla, wavered between the two sides, and in 105 handed Jugurtha over (see the capture record). His reward was the western part of Numidia; Rome gave the rest to Jugurtha's half-brother Gauda.\n\n" +
      "AFTERWARDS. Bocchus remained a Roman ally. In 91 BCE he set up on the Capitol a group of statues showing himself surrendering Jugurtha to Sulla, which Plutarch says almost provoked a riot between the partisans of Marius and Sulla (Sulla 6; Marius 32). He probably died in the 80s BCE; his son Sosus (Mastanesosus) followed him.\n\n" +
      "HOW IT IS DATED. The user's '110 BCE' is close but loose: Bocchus is first described for the war's opening years (c. 111) and enters the fighting around 108–106 BCE. His accession and death dates are unknown and estimated.\n\n" +
      "WHAT IT DOES NOT SHOW. Sallust's picture of Bocchus as a fickle, calculating barbarian is a Roman literary type. What survives is the outline of a king pursuing his kingdom's interest between two dangerous neighbours — and doing well out of it.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "mauretania", "mauri", "bocchus", "jugurtha", "sulla", "sallust"),
    people: ["Bocchus I", "Jugurtha", "Lucius Cornelius Sulla", "Gaius Marius", "Gauda", "Sosus (Mastanesosus)"],
    civilisations: ["Mauretania", "Numidia", "Rome"],
    locationName: "Mauretania (northern Morocco and western Algeria)",
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Bocchus I offers Jugurtha to Sulla.jpeg",
        caption:
          "A small image of the denarius struck in 56 BCE by Sulla's son Faustus, whose reverse shows Bocchus kneeling to offer an olive branch to the seated Sulla, with Jugurtha bound behind. Roman propaganda about Bocchus's change of side, made half a century later. A different specimen of the same type appears on the capture record.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "CC BY-SA 3.0",
        creator: "Classical Numismatic Group (CNG)",
        objectDate: "56 BCE",
        pixelWidth: 224,
        pixelHeight: 226,
      }),
      commonsPicture({
        fileName: "Map of Numidia.jpg",
        caption:
          "A modern map of Numidia and its neighbours used here for the geography of Bocchus's world: Mauretania in the west beyond the Mulucha, Numidia in the centre and Roman Africa in the east. A reconstruction, simplified.",
        shows: "map",
        identificationStatus: "modern_interpretation",
        licence: "CC BY-SA 4.0",
        creator: "Kabz15",
        pixelWidth: 1125,
        pixelHeight: 442,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_sallust",
        citations: [
          { sourceKey: "nm_gsell", relation: "supports", note: "Reconstructs Bocchus's entry into the war in 108–107 and the joint campaign of 106." },
          { sourceKey: "nm_wiki_bocchus", relation: "context", note: "Where the English text of Sallust 19.7 was read during research." },
        ],
        startYear: bce(108),
        endYear: bce(105),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Bocchus allied with Jugurtha, then negotiating with Sulla, c. 108–105 BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "Bocchus's part in the Jugurthine War",
        evidence:
          "Bellum Iugurthinum 80–113. Sallust's chronology is loose; the sequence (alliance, battles near Cirta, talks, betrayal) is clear, the exact years less so.",
      },
      {
        sourceKey: "nm_plutarch_lives",
        citations: [
          { sourceKey: "nm_gsell", relation: "context", note: "Dates the Capitol dedication to 91 BCE and discusses its political consequences." },
        ],
        startYear: bce(91),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "statues on the Capitol showing Bocchus surrendering Jugurtha to Sulla",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "Bocchus's dedication at Rome",
        evidence:
          "Plutarch, Sulla 6 and Marius 32, set the dedication just before the Social War; 91 BCE is the usual modern date.",
      },
      {
        sourceKey: "nm_gsell",
        citations: [
          { sourceKey: "nm_brett_fentress", relation: "context", note: "Summarises the Mauretanian kingdom of the late second and early first centuries BCE." },
        ],
        startYear: bce(120),
        endYear: bce(80),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "reign of Bocchus I, roughly 120s to 80s BCE",
        datingMethod: "estimate",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "Bocchus I's reign",
        evidence:
          "Neither accession nor death is recorded. Bracketed by Sallust's description of him as already king at the war's outbreak and the appearance of his son by the 80s BCE.",
      },
    ],
  },

  // 10 ----------------------------------------------------------------------
  {
    slug: "capture-of-jugurtha",
    title: "Bocchus, Sulla and the capture of Jugurtha, 105 BCE",
    summary:
      "In 105 BCE Bocchus I lured Jugurtha into an ambush and handed him to Sulla; Jugurtha was paraded in Marius's triumph on 1 January 104 BCE and died in Rome's prison.",
    description:
      "WHAT IT IS. The diplomatic end of the Jugurthine War. Sallust devotes his final chapters (102–113) to the negotiations: Bocchus sent envoys to Rome and asked for Sulla, Marius's young quaestor; Sulla crossed Mauretanian territory with a small escort, and for a time Bocchus kept both Romans and Jugurtha's agents waiting while he decided whom to betray. In the end Jugurtha was invited to a meeting and seized, and Bocchus handed him over to Sulla.\n\n" +
      "THE RING AND THE COIN. Plutarch says that Sulla had the scene engraved on his signet ring and used it ever after — a claim to credit that infuriated Marius (Marius 10; Sulla 3). Pliny also mentions the seal (Natural History 37.8). The design survives on the denarius struck in 56 BCE by Sulla's son Faustus: Sulla seated, Bocchus kneeling with an olive branch, Jugurtha kneeling bound. That coin is the nearest thing to contemporary visual evidence, though it is a family monument made fifty years later.\n\n" +
      "THE END OF JUGURTHA. Marius celebrated his triumph on 1 January 104 BCE, the day he entered his second consulship, and Jugurtha walked in it. Plutarch (Marius 12) says that he was then thrown into the underground prison — the Tullianum — and died there of hunger after six days. Sallust stops before this; the details come from Plutarch.\n\n" +
      "WHAT IT SHOWS. Mauretanian kings already acting as brokers between Numidia and Rome; and the beginning of the personal rivalry between Marius and Sulla that would lead to civil war.\n\n" +
      "WHERE THE ACCOUNTS DISAGREE. Sallust makes Bocchus's choice uncertain until the last moment; Plutarch, following Sulla's own lost memoirs, makes Sulla the hero. Both reflect Roman partisanship; Bocchus's own reasons are not recorded.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "mauretania", "jugurtha", "bocchus", "sulla", "marius", "diplomacy"),
    people: ["Jugurtha", "Bocchus I", "Lucius Cornelius Sulla", "Gaius Marius", "Faustus Cornelius Sulla"],
    civilisations: ["Mauretania", "Numidia", "Rome"],
    locationName: "Mauretania (place of the seizure unknown); Rome (triumph and prison)",
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Faustus Cornelius Sulla, AR denarius, 56 BC, RRC 426-1.jpg",
        caption:
          "Silver denarius of Faustus Cornelius Sulla, Rome, 56 BCE (RRC 426/1): Diana on the obverse; on the reverse Sulla seated, Bocchus kneeling with an olive branch and Jugurtha kneeling bound — the design of Sulla's signet ring. The actual surviving coin type.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "CC BY-SA 2.5",
        creator: "Classical Numismatic Group (CNG)",
        accessionNumber: "RRC 426/1",
        objectDate: "56 BCE",
        pixelWidth: 800,
        pixelHeight: 389,
      }),
      commonsPicture({
        fileName: "Mamertine Prison.jpg",
        caption:
          "The Carcer (Mamertine Prison) at the foot of the Capitol in Rome, whose lower chamber is the Tullianum, where Plutarch says Jugurtha died of hunger in 104 BCE. A photograph of the site as it is today, beneath a later church.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY-SA 3.0",
        creator: "Chris 73",
        pixelWidth: 3655,
        pixelHeight: 1579,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_sallust",
        citations: [
          { sourceKey: "nm_plutarch_lives", relation: "supports", note: "Marius 10 and Sulla 3 tell the same betrayal from the Sullan side." },
          { sourceKey: "nm_faustus_denarius", relation: "supports", note: "The 56 BCE coin shows the surrender scene, confirming how the event was commemorated." },
        ],
        startYear: bce(105),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Jugurtha handed to Sulla by Bocchus, 105 BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "the capture of Jugurtha",
        evidence:
          "Bellum Iugurthinum 102–113. Dated by Marius's consulship (107–105 BCE) and his triumph at the start of 104.",
      },
      {
        sourceKey: "nm_plutarch_lives",
        citations: [
          { sourceKey: "nm_gsell", relation: "context", note: "Accepts 1 January 104 BCE for the triumph, the day Marius began his second consulship." },
        ],
        startYear: bce(104),
        startMonth: 1,
        startDay: 1,
        datePrecision: "day",
        isApproximate: false,
        originalDateText: "Marius's triumph on the Kalends of January, as he entered his second consulship",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "Jugurtha led in Marius's triumph",
        evidence:
          "Plutarch, Marius 12. The day is a Roman calendar date (pre-Julian), so its exact correspondence to a proleptic Julian day is uncertain; it is given as the source gives it.",
      },
      {
        sourceKey: "nm_plutarch_lives",
        citations: [
          { sourceKey: "nm_pliny", relation: "context", note: "Natural History 37.8 mentions Sulla's seal, corroborating the ring story." },
        ],
        startYear: bce(104),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Jugurtha starved to death in the prison after six days",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "the death of Jugurtha",
        evidence:
          "Plutarch, Marius 12, alone gives the manner and timing; Sallust is silent. Accepted in outline.",
      },
    ],
  },

  // 11 ----------------------------------------------------------------------
  {
    slug: "juba-i-and-thapsus",
    title: "Juba I, Caesar's civil war and Thapsus",
    summary:
      "Juba I of Numidia sided with Pompey's party, destroyed Caesar's legate Curio in 49 BCE, and fell with the Pompeians after Thapsus in 46 BCE, when Caesar annexed his kingdom as Africa Nova.",
    description:
      "WHAT IT IS. The end of the independent Numidian kingdom. Juba I succeeded his father Hiempsal II around 60 BCE. Hiempsal had been restored by Pompey, and Juba was an enemy of Caesar personally — Suetonius (Caesar 71) tells the story of Caesar pulling his beard during a lawsuit in Rome. When civil war broke out, Caesar's legate Curio invaded Africa in 49 BCE and was trapped and killed with most of his army at the Bagradas by Juba's general Saburra (Caesar, Civil War 2.38–42).\n\n" +
      "THAPSUS. In 47–46 BCE Caesar himself came to Africa against Metellus Scipio, Cato and Juba. His allies Publius Sittius, an Italian adventurer with a private army, and Bocchus II of Mauretania invaded Numidia from the west and took Cirta, forcing Juba to divide his forces (Bellum Africum 25). At Thapsus (Ras Dimass, Tunisia) Caesar destroyed the Pompeian army; the eyewitness Bellum Africum describes Juba's elephants and cavalry, and — in passing — camels captured from the king's baggage, among the first mentions of camels in North Africa. Juba fled, was refused entry to his own town of Zama, and died in a suicide pact with the Roman general Petreius.\n\n" +
      "WHAT FOLLOWED. Caesar annexed most of Juba's kingdom as a new province, later called Africa Nova; its first governor was the historian Sallust. Bocchus II and Sittius were rewarded with western lands. Juba's infant son was carried in Caesar's triumph and raised in Rome — the future Juba II.\n\n" +
      "COINS. Juba I struck silver denarii with his own bearded portrait and the Latin legend REX IVBA, and on the reverse a temple with a Neo-Punic legend naming 'Yubaʿi the king' — a bilingual royal coinage that circulated widely (examples have even been found in Britain).\n\n" +
      "WHAT IT DOES NOT SHOW. The Bellum Africum is written by one of Caesar's officers and treats Juba as an arrogant barbarian; his own policy appears only through enemies.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "numidia", "juba-i", "thapsus", "caesar", "civil-war", "africa-nova"),
    people: ["Juba I", "Hiempsal II", "Gaius Julius Caesar", "Gaius Scribonius Curio", "Saburra", "Quintus Caecilius Metellus Pius Scipio", "Marcus Petreius", "Publius Sittius", "Bocchus II", "Sallust"],
    civilisations: ["Numidia", "Mauretania", "Rome"],
    locationName: "Thapsus (Ras Dimass, Tunisia)",
    lat: 35.62,
    lng: 11.05,
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Juba denarius in support of Pompey against Cesar 60 46 BCE.jpg",
        caption:
          "A silver denarius of Juba I (60–46 BCE): the king's bearded, diademed portrait with the Latin title REX IVBA, the coin type of the ally of the Pompeians. A photograph of an actual coin of the type.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "Public domain",
        creator: "PHGCOM",
        objectDate: "60–46 BCE",
        pixelWidth: 429,
        pixelHeight: 419,
      }),
      commonsPicture({
        fileName: "Head of Juba I (Cherchell).jpg",
        caption:
          "A marble head in the Archaeological Museum of Cherchell, Algeria, identified as Juba I by comparison with his coin portraits (the long beard and curled hair). The identification is probable rather than certain: no inscription accompanies it, and it was found at the capital of his son.",
        shows: "artefact",
        identificationStatus: "probable",
        licence: "CC BY 4.0",
        creator: "Bernard Gagnon",
        institution: "Archaeological Museum of Cherchell",
        pixelWidth: 3000,
        pixelHeight: 4200,
      }),
      commonsPicture({
        fileName: "Plan de la bataille de Thapse en Afrique gagnée par Jule César contre Q. Scipion et le roy Juba l'an de Rome 707 - btv1b8495504g.jpg",
        caption:
          "A French engraved plan of the battle of Thapsus, 'won by Julius Caesar against Q. Scipio and King Juba', printed in 1732. An eighteenth-century reconstruction drawn from the Bellum Africum, not a survey of the site.",
        shows: "later_artwork",
        identificationStatus: "modern_interpretation",
        licence: "Public domain",
        institution: "Bibliothèque nationale de France",
        accessionNumber: "btv1b8495504g",
        objectDate: "1732",
        pixelWidth: 6278,
        pixelHeight: 4444,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_bellum_africum",
        citations: [
          { sourceKey: "nm_plutarch_lives", relation: "supports", note: "Caesar 53–55 narrates Thapsus and Juba's death and the infant Juba in the triumph." },
          { sourceKey: "nm_dio", relation: "supports", note: "Dio 43.2–9 gives the campaign, the battle and the annexation." },
        ],
        startYear: bce(46),
        startMonth: 4,
        startDay: 6,
        datePrecision: "day",
        isApproximate: false,
        originalDateText: "Thapsus, a.d. VIII Id. Apr. (6 April in the Roman calendar), 46 BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "the battle of Thapsus",
        evidence:
          "The Roman calendar date preserved in the Roman tradition (the anniversary was kept in the calendars) corresponds to 6 April 46 BCE in the unreformed Republican calendar, which was then running months ahead of the seasons; converted to the proleptic Julian calendar it falls earlier, around February. The year is secure; the day is given in the Roman calendar of the time.",
      },
      {
        sourceKey: "nm_caesar_bc",
        citations: [
          { sourceKey: "nm_gsell", relation: "context", note: "Places Curio's defeat and Juba's role in the history of the last Numidian kings." },
        ],
        startYear: bce(49),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Curio destroyed at the Bagradas by Juba's army, 49 BCE",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "Juba's victory over Curio",
        evidence:
          "Caesar, Civil War 2.23–44, written by Curio's commander. Secure to the year.",
      },
      {
        sourceKey: "nm_gsell",
        citations: [
          { sourceKey: "nm_bellum_africum", relation: "supports", note: "Shows Juba already king and a Pompeian ally before 49 BCE." },
        ],
        startYear: bce(60),
        endYear: bce(46),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "reign of Juba I, c. 60–46 BCE",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        temporalClaimType: "date_range",
        whatIsDated: "Juba I's reign",
        evidence:
          "The accession is estimated from the last mention of Hiempsal II; the end is fixed by Thapsus. 46 BCE also marks the end of the Numidian kingdom as an independent state.",
      },
    ],
  },

  // 12 ----------------------------------------------------------------------
  {
    slug: "bocchus-ii-bogud-and-mauretania-to-rome",
    title: "Bogud, Bocchus II and the passing of Mauretania to Rome",
    summary:
      "In the civil wars Mauretania was split between Bogud in the west and Bocchus II in the east; Bocchus seized his rival's half about 38 BCE and on his death in 33 BCE his kingdom passed to Rome.",
    description:
      "WHAT IT IS. The last generation of the first Mauretanian dynasty. By 49 BCE Mauretania was divided between two kings: Bogud in the west and Bocchus II in the east (Bocchus's coins call him son of Sosus). Both backed Caesar. Bocchus invaded Juba I's Numidia with Sittius in 46 and was rewarded with territory; Bogud fought for Caesar in Spain, and his cavalry played a part at Munda in 45 BCE.\n\n" +
      "THE SPLIT AND THE SEIZURE. After Caesar's murder the two kings backed opposite sides: Bogud supported Mark Antony, Bocchus supported Octavian. About 38 BCE, while Bogud was campaigning in Spain, Bocchus took over his kingdom, and Octavian confirmed him as sole king (Dio 48.45). Bogud fled to Antony and was killed at Methone in Greece during the Actium campaign of 31 BCE (Strabo 8.4.3).\n\n" +
      "TO ROME. Bocchus II died in 33 BCE without an heir. Dio (49.43) says his kingdom became Roman; whether Bocchus formally bequeathed it or Octavian simply took it over is not clear from the sources. For the next eight years Mauretania had no king: Augustus founded colonies of veterans there, and in 25 BCE gave the kingdom to Juba II.\n\n" +
      "HOW IT IS DATED. 49 BCE for the partition is the first attestation, not its beginning; the seizure is dated about 38 BCE; Bocchus's death and the beginning of the interregnum, 33 BCE, is secure; the interregnum ends with Juba's appointment in 25 BCE.\n\n" +
      "WHAT IT DOES NOT SHOW. The 33 BCE handover is not the creation of the Roman provinces of Mauretania, which came only after Caligula's execution of King Ptolemy in 40 CE (see the Roman annexation record). It is also an example of how fragile these client kingdoms were: two African kings ended up on opposite sides of a Roman civil war, and their kingdom's fate was settled in Rome.",
    category: "history",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "mauretania", "bogud", "bocchus", "civil-war", "client-kingdom"),
    people: ["Bogud", "Bocchus II", "Gaius Julius Caesar", "Mark Antony", "Octavian (Augustus)", "Publius Sittius"],
    civilisations: ["Mauretania", "Rome"],
    locationName: "Mauretania (Morocco and western Algeria)",
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Bogud. AR Denarius 802149.jpg",
        caption:
          "Silver denarius of Bogud, king of western Mauretania (49–38 BCE): a head of Africa in an elephant-skin headdress on one side, and a griffin with the Latin REX BOCVT on the other. A coin of the king himself.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "CC BY-SA 3.0",
        creator: "Classical Numismatic Group (CNG), uploaded by Aṭlas",
        objectDate: "49–38 BCE",
        pixelWidth: 732,
        pixelHeight: 337,
      }),
      commonsPicture({
        fileName: "Bocchus II obverse.jpeg",
        caption:
          "Bronze coin of Bocchus II (49–33 BCE) from the Iol/Caesarea mint: a bearded head with the Latin legend naming 'King Bocchus son of Sosus'; the reverse (not shown) carries a lion and a Neo-Punic legend. The basis for knowing his father's name.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "CC BY-SA 3.0",
        creator: "Classical Numismatic Group (CNG), uploaded by Aṭlas",
        objectDate: "49–33 BCE",
        pixelWidth: 249,
        pixelHeight: 242,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_dio",
        citations: [
          { sourceKey: "nm_coltelloni", relation: "supports", note: "Places the death of Bocchus II and the Roman interregnum at 33–25 BCE." },
          { sourceKey: "nm_gsell", relation: "context", note: "Discusses whether Mauretania was bequeathed or simply taken over." },
        ],
        startYear: bce(33),
        endYear: bce(25),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Bocchus died in 33 BCE and his kingdom became Roman until Juba was given it",
        datingMethod: "historical_record",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "the interregnum between Bocchus II and Juba II",
        evidence:
          "Dio 49.43 (33 BCE) and 53.26 (25 BCE). Both years are secure; the legal form of the transfer is not.",
      },
      {
        sourceKey: "nm_dio",
        citations: [
          { sourceKey: "nm_strabo", relation: "supports", note: "Strabo knows the two kings and Bogud's end at Methone." },
        ],
        startYear: bce(38),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Bocchus seizes Bogud's kingdom while Bogud is in Spain",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "the reunification of Mauretania under Bocchus II",
        evidence:
          "Dio 48.45. Usually dated 38 BCE; the narrative context allows a year either side.",
      },
      {
        sourceKey: "nm_bellum_africum",
        citations: [
          { sourceKey: "nm_mazard", relation: "context", note: "Catalogues the separate coinages of Bogud and Bocchus II that confirm the divided kingdom." },
        ],
        startYear: bce(49),
        endYear: bce(38),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Mauretania divided between Bogud and Bocchus II",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "date_range",
        whatIsDated: "the partition of Mauretania",
        evidence:
          "Both kings are attested as Caesar's allies from 49 BCE; how and when the partition began is unknown.",
      },
    ],
  },

  // 13 ----------------------------------------------------------------------
  {
    slug: "juba-ii-of-mauretania",
    title: "Juba II: a scholar-king of Mauretania",
    summary:
      "Juba II, son of Juba I, raised in Rome, ruled Mauretania as a client king from 25 BCE to about 23 CE from his new capital Caesarea, and wrote learned books in Greek that Pliny used extensively.",
    description:
      "WHAT IT IS. The best-documented North African king after Masinissa. Juba was a small child when his father died after Thapsus; he was carried in Caesar's triumph of 46 BCE and brought up in Rome, first in Caesar's household and then in Octavian's. Plutarch calls him one of the most learned historians of his time (Caesar 55). In 25 BCE Augustus gave him the kingdom of Mauretania (Dio 53.26), enlarged with part of western Numidia, and married him to Cleopatra Selene, daughter of Cleopatra VII and Mark Antony.\n\n" +
      "THE KINGDOM. Juba made the old Punic harbour town of Iol his capital and renamed it Caesarea in honour of Augustus (modern Cherchell, Algeria), filling it with Greek and Roman sculpture, a theatre and temples; Volubilis in the west was another royal centre. Pliny says he set up dye-works on the islands off the Atlantic coast to make Gaetulian purple (Natural History 6.201) — usually identified with the Purple Islands at Mogador (Essaouira, Morocco), where excavation has found Juba-period occupation. His coins, in Latin for himself and Greek for his queen, are dated by regnal year up to his forty-eighth.\n\n" +
      "THE SCHOLAR. Juba wrote in Greek on Libya, Arabia, Assyria, Roman antiquities, theatre, painting and language. Nothing survives whole; his works are known from about a hundred citations, roughly half of them in Pliny's Natural History, where he is a main authority for Books 5 and 6 on Africa and the Atlantic islands.\n\n" +
      "HOW IT IS DATED. The user's '25 BCE' is correct for the start of his reign in Mauretania. His birth is disputed (c. 52–50 BCE in older works; Roller argues for c. 48). Some sources say Octavian first made him king of Numidia about 30 BCE; this is uncertain. His death is put in 23 or 24 CE from his last regnal-year coins and from Strabo, who speaks of him as recently dead; his son Ptolemy succeeded.\n\n" +
      "WHAT IT DOES NOT SHOW. Juba was a Numidian prince ruling the Mauri as a Roman client. Calling him 'a Moor' or 'a Berber king' collapses ancestry (Numidian), culture (thoroughly Greco-Roman), political identity (a Roman citizen and client king) and the people he ruled (the Mauri) into one word.",
    category: "people",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "mauretania", "juba-ii", "caesarea", "client-kingdom", "scholarship", "purple-dye"),
    people: ["Juba II", "Cleopatra Selene II", "Augustus", "Ptolemy of Mauretania", "Pliny the Elder"],
    civilisations: ["Mauretania", "Rome", "Roman Empire", "Ancient Greece", "Ancient Egypt"],
    locationName: "Iol-Caesarea (Cherchell, Algeria)",
    lat: 36.6075,
    lng: 2.19,
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Head of Juba II (Cherchell).jpg",
        caption:
          "A marble head of Juba II in the Archaeological Museum of Cherchell — the site of his capital, Caesarea. It is identified as Juba II by comparison with his coin portraits; likely but, without an inscription, not beyond question.",
        shows: "artefact",
        identificationStatus: "probable",
        licence: "CC BY 4.0",
        creator: "Bernard Gagnon",
        institution: "Archaeological Museum of Cherchell",
        pixelWidth: 3922,
        pixelHeight: 5491,
      }),
      commonsPicture({
        fileName: "Portrait Juba II Louvre Ma1886.jpg",
        caption:
          "A Roman marble portrait from Cherchell (ancient Caesarea) in the Louvre (Ma 1886), catalogued as Juba II and dated around the turn of the era. A second, independent sculpture; the identification again rests on comparison with coins.",
        shows: "artefact",
        identificationStatus: "probable",
        licence: "CC BY 2.5",
        institution: "Musée du Louvre",
        accessionNumber: "Ma 1886",
        objectDate: "late 1st century BCE – early 1st century CE",
        pixelWidth: 2250,
        pixelHeight: 3000,
      }),
      commonsPicture({
        fileName: "Mogador Iles purpuraires 0001.jpg",
        caption:
          "Mogador, the largest of the Îles Purpuraires off Essaouira, Morocco — usually identified with the islands where Pliny says Juba set up dye-works for Gaetulian purple. A photograph of the place today; the identification with Pliny's islands is the standard one.",
        shows: "site",
        identificationStatus: "probable",
        licence: "CC BY-SA 4.0",
        creator: "Christian Pirkl",
        pixelWidth: 3300,
        pixelHeight: 2200,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_dio",
        citations: [
          { sourceKey: "nm_strabo", relation: "supports", note: "Strabo 17.3.7, a contemporary, has Augustus give Juba the kingdom of Bocchus." },
          { sourceKey: "nm_roller", relation: "supports", note: "Dates the reign 25 BCE–23 CE and discusses the evidence." },
          { sourceKey: "nm_coltelloni", relation: "supports", note: "Uses the regnal-year coinage to fix the length of the reign." },
        ],
        startYear: bce(25),
        endYear: 23,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "king of Mauretania from 25 BCE to his death about 23 CE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "Juba II's reign in Mauretania",
        evidence:
          "Dio 53.26 for the start. The end is inferred from his coins (regnal years up to 48) and from Strabo writing of him as recently dead; 23 or 24 CE.",
      },
      {
        sourceKey: "nm_dio",
        citations: [
          { sourceKey: "nm_roller", relation: "disputes", note: "Doubts that Juba ever ruled Numidia as king before receiving Mauretania." },
        ],
        startYear: bce(30),
        endYear: bce(25),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "first given his father's kingdom of Numidia by Octavian",
        datingMethod: "historical_record",
        chronology: "disputed",
        whatIsDated: "a possible earlier Numidian kingship",
        evidence:
          "Dio 51.15 says Octavian gave Juba his father's kingdom; most modern historians read this as a confusion with the Mauretanian grant of 25 BCE.",
      },
      {
        sourceKey: "nm_pliny",
        citations: [
          { sourceKey: "nm_roller", relation: "supports", note: "Discusses the Mogador purple works and their archaeology." },
        ],
        startYear: bce(25),
        endYear: 23,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Juba's purple dye-works on the islands off the Gaetulian coast",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        whatIsDated: "the royal purple industry",
        evidence:
          "Pliny 6.201 says Juba had established it, without a year; it can only be placed within his reign. Identification with Mogador is standard.",
      },
    ],
  },

  // 14 ----------------------------------------------------------------------
  {
    slug: "cleopatra-selene-ii",
    title: "Cleopatra Selene II: Egyptian royal heritage in Mauretania",
    summary:
      "The daughter of Cleopatra VII and Mark Antony, raised in Rome after 30 BCE, became queen of Mauretania with Juba II and brought Ptolemaic and Egyptian imagery to Caesarea; she died around 5 BCE, though the date is uncertain.",
    description:
      "WHAT IT IS. A link between the last Ptolemaic court of Egypt and the kingdom of the Mauri. Cleopatra Selene ('Moon') was born in 40 BCE, the twin of Alexander Helios ('Sun'), to Cleopatra VII and Mark Antony (Plutarch, Antony 36). After her parents' deaths in 30 BCE she was walked in Octavian's triumph and raised in Rome by Octavia, her father's former wife; Plutarch says Octavia married her to Juba, 'the most accomplished of kings' (Antony 87 — paraphrase), and Dio says she was given to him in marriage (51.15).\n\n" +
      "QUEEN OF MAURETANIA. She ruled at Caesarea with Juba from around 25 or 20 BCE. Coins name her in Greek as Queen Cleopatra, and some carry a crocodile — an emblem of Egypt — or other Isiac symbols; one joint issue pairs Juba's Latin with her Greek. Pliny reports Juba's claim that a crocodile from the source of the Nile was dedicated in the temple of Isis at Caesarea (Natural History 5.51), which is evidence for an Egyptian cult there. The son they named Ptolemy carried her dynasty's name.\n\n" +
      "HOW HER DEATH IS DATED. Not securely. An epigram by Crinagoras about the moon being darkened at Selene's death is often taken to refer to a lunar eclipse; matching it to the eclipse of 5 BCE gives the date usually printed. That is a modern hypothesis built on a poem. Other scholars argue from coins and from Juba's later marriage to Glaphyra that she died before about 4 CE, and some propose later dates.\n\n" +
      "PICTURES OF HER. Portraits are a problem. Several marble heads from Cherchell are catalogued as Selene, but some may be Cleopatra VII or another royal woman. The silver dish from the Boscoreale treasure with a woman in an elephant-skin headdress surrounded by symbols of Africa and Egypt has been interpreted as Selene, but it may be a personification of Africa; that identification is debated.\n\n" +
      "WHAT IT DOES NOT SHOW. Selene was a Macedonian-Greek Ptolemaic princess with a Roman father. Her presence shows political and cultural connections between Egypt, Rome and Mauretania; it does not show any Egyptian ancestry for the Mauri, and it should not be used to argue for one.",
    category: "people",
    subcategory: LANE,
    eventType: "historical",
    tags: laneTags("numidiaMauretania", "mauretania", "cleopatra-selene", "ptolemies", "isis", "caesarea", "egypt"),
    people: ["Cleopatra Selene II", "Cleopatra VII", "Mark Antony", "Octavia the Younger", "Juba II", "Ptolemy of Mauretania", "Alexander Helios", "Crinagoras of Mytilene"],
    civilisations: ["Mauretania", "Ancient Egypt", "Rome", "Ancient Greece"],
    locationName: "Iol-Caesarea (Cherchell, Algeria)",
    lat: 36.6075,
    lng: 2.19,
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Monnaie - Bronze, Incertain, Maurétanie, Cléopâtre Séléné II - btv1b8484203f (1 of 2).jpg",
        caption:
          "A Mauretanian bronze coin in the Bibliothèque nationale de France catalogued under Cleopatra Selene II, with a Greek legend as recorded by the library. A coin issued in her name as queen; the description of its type here follows the BnF catalogue, not an inspection of the image.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "Public domain",
        creator: "Bibliothèque nationale de France, département des Monnaies, médailles et antiques",
        institution: "Bibliothèque nationale de France",
        accessionNumber: "btv1b8484203f",
        objectDate: "c. 25 BCE – c. 5 BCE (as catalogued)",
        pixelWidth: 2872,
        pixelHeight: 2872,
      }),
      commonsPicture({
        fileName: "Cleopatra Selene II bust, Cherchell, Algeria 1.jpg",
        caption:
          "UNVERIFIED — a Roman marble female portrait in the Archaeological Museum of Cherchell labelled as Cleopatra Selene II. The photograph shows a royal portrait from Caesarea; that it portrays Selene rather than her mother Cleopatra VII or another woman is unverified and debated.",
        shows: "artefact",
        identificationStatus: "unverified",
        licence: "CC0",
        creator: "PericlesofAthens",
        institution: "Archaeological Museum of Cherchell",
        pixelWidth: 960,
        pixelHeight: 720,
      }),
      commonsPicture({
        fileName: "Cleopatra Selene, Boscoreale treasure.png",
        caption:
          "UNVERIFIED — an 1899 black-and-white photograph of the silver 'Africa' dish from the Boscoreale treasure, showing a woman in an elephant-skin headdress with a cornucopia and emblems. Some scholars identify her as Cleopatra Selene; others read her as a personification of Africa. The identification is unverified.",
        shows: "evidence_photograph",
        identificationStatus: "unverified",
        licence: "Public domain",
        creator: "Antoine Héron de Villefosse (publication, 1899)",
        institution: "Musée du Louvre",
        objectDate: "dish: late 1st century BCE – 1st century CE; photograph 1899",
        pixelWidth: 1391,
        pixelHeight: 1345,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_plutarch_lives",
        citations: [
          { sourceKey: "nm_draycott", relation: "supports", note: "Accepts 40 BCE for the birth of the twins." },
          { sourceKey: "nm_roller", relation: "supports", note: "Same birth date, with the evidence for the twins' names." },
        ],
        startYear: bce(40),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "born a twin to Cleopatra and Antony, 40 BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "Cleopatra Selene's birth",
        evidence:
          "Plutarch, Antony 36, and the chronology of Antony's stay in Alexandria in 41–40 BCE.",
      },
      {
        sourceKey: "nm_dio",
        citations: [
          { sourceKey: "nm_crinagoras", relation: "supports", note: "An epigram on the union of Egypt and Libya, read as a wedding poem for Juba and Selene." },
          { sourceKey: "nm_roller", relation: "context", note: "Discusses whether the marriage was in 25 or c. 20 BCE." },
        ],
        startYear: bce(25),
        endYear: bce(20),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "given in marriage to Juba",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        whatIsDated: "the marriage and her reign as queen",
        evidence:
          "Dio 51.15 and Plutarch, Antony 87, give the marriage without a year; it is placed between Juba's appointment in 25 BCE and about 20 BCE.",
      },
      {
        sourceKey: "nm_crinagoras",
        citations: [
          { sourceKey: "nm_roller", relation: "supports", note: "Discusses the lunar-eclipse reading and favours a death around 5 BCE." },
          { sourceKey: "nm_draycott", relation: "context", note: "Sets out the competing arguments for her death date." },
        ],
        startYear: bce(5),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "the moon darkened at the death of Selene",
        datingMethod: "astronomical",
        chronology: "hypothesis",
        temporalClaimType: "proposed_correlation",
        whatIsDated: "Cleopatra Selene's death",
        evidence:
          "A modern correlation of Crinagoras's poem with the lunar eclipse of 5 BCE. A poem's eclipse may be metaphor, and other eclipses fit; the date is a hypothesis.",
      },
      {
        sourceKey: "nm_draycott",
        citations: [
          { sourceKey: "nm_coltelloni", relation: "context", note: "Discusses coin evidence for the queen's lifetime and for Juba's second marriage." },
        ],
        startYear: bce(5),
        endYear: 4,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "dead before Juba married Glaphyra",
        datingMethod: "textual_interpretation",
        chronology: "alternative",
        whatIsDated: "Cleopatra Selene's death",
        evidence:
          "A terminus inferred from Juba's later marriage to Glaphyra of Cappadocia (early 1st century CE). Gives a window rather than a year.",
      },
    ],
  },

  // 15 ----------------------------------------------------------------------
  {
    slug: "numidian-and-mauretanian-coinage",
    title: "Numidian and Mauretanian royal coinage",
    summary:
      "From Syphax to Juba II the North African kings struck coins with Punic, Neo-Punic, Latin and Greek legends; they are the kings' own surviving statements, though many early issues cannot be assigned to one ruler.",
    description:
      "WHAT IT IS. The largest body of evidence produced by the kingdoms themselves. Coins were struck in Numidia and Mauretania from the late third century BCE to the end of the kingdom in 40 CE, and they record titles, languages and images the rulers chose.\n\n" +
      "THE SEQUENCE. SYPHAX struck bronze with a bearded, diademed head and a Punic legend naming him king; his son VERMINA struck silver. The large series of bronzes with a bearded head and a horse, often with the Punic letters MN, have been called 'coins of Masinissa' since the nineteenth century; modern catalogues (Alexandropoulos, MAA) treat them more cautiously as 'Masinissa or Micipsa' or simply as royal Numidian, because most carry no king's name and the head may be a royal ancestor or a god. JUGURTHA has no securely attributed coins. JUBA I struck silver denarii with his portrait and the Latin REX IVBA, and a temple or horse with a Neo-Punic legend — a deliberately bilingual royal coinage. In Mauretania, BOGUD and BOCCHUS II used Latin and Neo-Punic. JUBA II and CLEOPATRA SELENE struck an abundant silver coinage, his legends in Latin (REX IVBA) and hers in Greek (BASILISSA KLEOPATRA), some dated by regnal year; their son PTOLEMY continued it until 40 CE.\n\n" +
      "WHAT THEY SHOW. Kings presenting themselves in the visual language of Hellenistic monarchy — diadem, portrait, royal title — while using Punic, the prestige written language of the region, then Latin and Greek as Rome's influence grew. The coins travelled: a hoard of 60 of Juba II's denarii was found at Banasa in Morocco, and single denarii of Juba I have turned up as far away as Britain.\n\n" +
      "HOW THEY ARE DATED. By the reigns of named kings where there is a name; by style, metrology and hoards otherwise. That is why the early 'Masinissa' bronzes span decades in any catalogue.\n\n" +
      "WHAT IT DOES NOT SHOW. A coin portrait is an official image, not a likeness that can be used to judge anyone's appearance or ancestry. And an attribution in a museum catalogue is a scholarly judgement, sometimes an old one: the Bibliothèque nationale's online labels follow older attributions that newer catalogues have revised.",
    category: "archaeology",
    subcategory: LANE,
    eventType: "archaeological_interpretation",
    tags: laneTags("numidiaMauretania", "numidia", "mauretania", "coinage", "numismatics", "punic", "latin", "greek"),
    people: ["Syphax", "Vermina", "Masinissa", "Micipsa", "Juba I", "Bogud", "Bocchus II", "Juba II", "Cleopatra Selene II", "Ptolemy of Mauretania"],
    civilisations: ["Numidia", "Mauretania", "Carthage", "Rome"],
    locationName: "Numidia and Mauretania; mints at Siga, Cirta, Iol-Caesarea and elsewhere",
    identificationStatus: "secure",
    evidenceStatus: "strongly_documented",
    media: [
      commonsPicture({
        fileName: "Denaro Giuba II e Tolomeo.jpg",
        caption:
          "Silver denarius of Juba II with his son Ptolemy, Caesarea mint: on one side REX IVBA with Juba's diademed head, on the other the young Ptolemy named as king and son of King Juba (MAA 111; Mazard 379). A royal coin of the joint reign at its end.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "CC BY-SA 2.5",
        creator: "Classical Numismatic Group (CNG)",
        objectDate: "c. 21–23 CE",
        pixelWidth: 800,
        pixelHeight: 395,
      }),
      commonsPicture({
        fileName: "Banasa hoard.jpg",
        caption:
          "A hoard of 60 silver denarii of Juba II's Mauretania found at Banasa (Sidi Ali Bou Djenoun, Morocco) in 1907, now in the British Museum. Evidence of how much royal silver circulated in the kingdom.",
        shows: "museum_specimen",
        identificationStatus: "secure",
        licence: "CC BY-SA 3.0",
        creator: "BabelStone",
        institution: "British Museum",
        pixelWidth: 3537,
        pixelHeight: 2577,
      }),
      commonsPicture({
        fileName: "Roman provinicial coin; denarius of Juba I of Numidia, octastyle temple reverse (FindID 403505).jpg",
        caption:
          "A silver denarius (possibly a plated ancient copy) of Juba I of Numidia, with the eight-columned temple reverse, recorded by the Portable Antiquities Scheme as found in England. A Numidian royal coin that travelled to the far edge of the Roman world.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Derby Museums Trust, Rachel Atherton",
        accessionNumber: "PAS FindID 403505",
        objectDate: "60–46 BCE",
        pixelWidth: 1923,
        pixelHeight: 1269,
      }),
      commonsPicture({
        fileName: "Monnaie - Didrachme, Argent, Incertain, Numidie, Micipsa - btv1b11319046g (1 of 2).jpg",
        caption:
          "A Numidian silver didrachm in the Bibliothèque nationale de France attributed to Micipsa (from the Luynes collection). Shown as an example of the early Numidian royal silver whose attribution to a particular king rests on catalogue judgement rather than a legend.",
        shows: "artefact",
        identificationStatus: "possible",
        licence: "Public domain",
        creator: "Bibliothèque nationale de France, département des Monnaies, médailles et antiques",
        institution: "Bibliothèque nationale de France",
        accessionNumber: "btv1b11319046g",
        objectDate: "2nd century BCE (as catalogued)",
        pixelWidth: 2366,
        pixelHeight: 2366,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_alexandropoulos",
        citations: [
          { sourceKey: "nm_mazard", relation: "supports", note: "The earlier corpus establishing the sequence from Syphax to Ptolemy, many of whose attributions Alexandropoulos revises." },
          { sourceKey: "nm_roller", relation: "context", note: "Discusses the Juba II and Selene coinage as political statements." },
        ],
        startYear: bce(215),
        endYear: 40,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "royal coinage from Syphax to Ptolemy, late third century BCE to 40 CE",
        datingMethod: "archaeological",
        chronology: "conventional",
        temporalClaimType: "date_range",
        whatIsDated: "the span of indigenous royal coinage",
        evidence:
          "From the first royal bronzes of Syphax (in power by 213 BCE) to the last coins of Ptolemy of Mauretania, killed in 40 CE. Dated by the reigns of named kings.",
      },
      {
        sourceKey: "nm_alexandropoulos",
        citations: [
          { sourceKey: "nm_mazard", relation: "disputes", note: "Mazard assigned many of these bronzes directly to Masinissa; the attribution is now regarded as unsafe." },
        ],
        startYear: bce(203),
        endYear: bce(118),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "bronzes of 'Masinissa or Micipsa', 203–118 BCE",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        whatIsDated: "the uninscribed Numidian royal bronzes",
        evidence:
          "Catalogued across both reigns because they carry no king's name; dated by style and hoard contexts.",
      },
      {
        sourceKey: "nm_bellum_africum",
        citations: [
          { sourceKey: "nm_mazard", relation: "supports", note: "Catalogues Juba I's bilingual Latin and Neo-Punic silver." },
        ],
        startYear: bce(60),
        endYear: bce(46),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "the bilingual silver of King Juba",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        whatIsDated: "Juba I's coinage",
        evidence:
          "Dated by his reign, which ended at Thapsus (described in the Bellum Africum).",
      },
    ],
  },

  // 16 ----------------------------------------------------------------------
  {
    slug: "volubilis-and-iol-caesarea",
    title: "Volubilis and Iol-Caesarea: the cities of Mauretania",
    summary:
      "Volubilis in Morocco grew from a third-century BCE settlement with Punic inscriptions into a Mauretanian and then Roman city; Iol, a Punic port, became Juba II's capital Caesarea (Cherchell).",
    description:
      "WHAT IT IS. The two best-known cities of the Mauretanian kingdom. VOLUBILIS lies on a ridge under the Zerhoun massif near Meknes, Morocco. Excavation has found a settlement from at least the third century BCE with a sanctuary and pottery and stones inscribed in Punic; its magistrates were still called suffetes, the Carthaginian title, until after Rome annexed the kingdom in the 40s CE. It may have been a royal centre under Juba II, though whether it was a formal second capital is debated. What a visitor sees today — the basilica, the capitol, the triumphal arch, the mosaic houses — is overwhelmingly Roman, of the second and third centuries CE.\n\n" +
      "IOL-CAESAREA. Iol, on the coast of central Algeria, was a Phoenician–Punic harbour town. Juba II made it his capital and renamed it Caesarea in honour of Augustus (Pliny, Natural History 5.20). Under Juba and Cleopatra Selene it was built up as a Hellenistic royal city — palace, theatre, temples, a lighthouse — and filled with copies of Greek sculpture; the Archaeological Museum of Cherchell holds much of it. After 40 CE it became the capital of the Roman province of Mauretania Caesariensis.\n\n" +
      "WHAT THEY SHOW. Mauretanian towns had a long Punic and indigenous history before Rome; the Mauretanian kings built on that, and Roman provincial cities then built over them. The Punic phase is the hardest to see because it lies under the Roman one.\n\n" +
      "HOW IT IS DATED. Volubilis's earliest phases by archaeology; Caesarea's refoundation by Juba's reign, from 25 BCE (some date the renaming a few years later). UNESCO inscribed Volubilis (1997) and Tipasa nearby, but not Cherchell itself.\n\n" +
      "WHAT IT DOES NOT SHOW. The population of these cities was mixed — Mauri, Numidians, Punic-speaking descendants of earlier settlers, and later Roman colonists — and the cities' monuments tell us about their elites far more than about anyone else.",
    category: "archaeology",
    subcategory: LANE,
    eventType: "archaeological_interpretation",
    tags: laneTags("numidiaMauretania", "mauretania", "volubilis", "caesarea", "cherchell", "punic", "urbanism"),
    people: ["Juba II", "Cleopatra Selene II"],
    civilisations: ["Mauretania", "Phoenicians", "Carthage", "Rome", "Roman Empire"],
    locationName: "Volubilis (near Meknes, Morocco) and Iol-Caesarea (Cherchell, Algeria)",
    identificationStatus: "secure",
    media: [
      commonsPicture({
        fileName: "Volubilis - wide view.JPG",
        caption:
          "A wide view of Volubilis under the Zerhoun massif near Meknes, Morocco. Most of the visible remains are Roman (2nd–3rd century CE); the Punic and Mauretanian town lies beneath them.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY-SA 3.0",
        creator: "Pilecka",
        pixelWidth: 3072,
        pixelHeight: 1314,
      }),
      commonsPicture({
        fileName: "Volubilis - Basilica romana.jpg",
        caption:
          "The Roman basilica of Volubilis, completed in the early third century CE — a building of the Roman provincial city, about two centuries after Juba II. Shown to make clear how late most of what stands is.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Mhobl",
        objectDate: "early 3rd century CE",
        pixelWidth: 6000,
        pixelHeight: 4000,
      }),
      commonsPicture({
        fileName: "Cherchell Musée.jpg",
        caption:
          "The Archaeological Museum of Cherchell, Algeria, on the site of Iol-Caesarea, which holds much of the sculpture of Juba II's capital. A photograph of the museum building in 2008.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY 2.0",
        creator: "Jean-Pierre Dalbéra",
        institution: "Archaeological Museum of Cherchell",
        pixelWidth: 1800,
        pixelHeight: 1200,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_coltelloni",
        citations: [
          { sourceKey: "nm_wiki_volubilis", relation: "context", note: "Summary read during research of the Punic sanctuary, pottery and inscriptions under the Roman city." },
          { sourceKey: "nm_brett_fentress", relation: "context", note: "Places the Punic-influenced towns of Mauretania in the longer history of the region." },
        ],
        startYear: bce(300),
        endYear: bce(200),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Volubilis: a settlement with Punic inscriptions by the third century BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        whatIsDated: "the earliest urban phase of Volubilis",
        evidence:
          "Dated by pottery, a sanctuary and Punic-inscribed stones beneath the Roman city; the earliest phases are poorly exposed.",
      },
      {
        sourceKey: "nm_pliny",
        citations: [
          { sourceKey: "nm_roller", relation: "supports", note: "Dates the refoundation of Iol as Caesarea to the start of Juba's reign." },
          { sourceKey: "nm_coltelloni", relation: "supports", note: "Same, with the archaeological evidence for the royal city." },
        ],
        startYear: bce(25),
        endYear: bce(20),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Iol, royal residence of Juba, renamed Caesarea",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        whatIsDated: "the renaming of Iol as Caesarea",
        evidence:
          "Pliny names the city as Juba's royal seat; the renaming is placed at or soon after Juba's appointment in 25 BCE.",
      },
    ],
  },

  // 17 ----------------------------------------------------------------------
  {
    slug: "royal-mausoleum-of-mauretania",
    title: "The Royal Mausoleum of Mauretania ('Tomb of the Christian Woman')",
    summary:
      "A great drum-and-cone tomb near Tipasa, Algeria, usually attributed to Juba II and Cleopatra Selene and identified with Pomponius Mela's 'common monument of the royal family'; the attribution is probable but not proved.",
    description:
      "WHAT IT IS. A circular stone mausoleum on a hill about 250 m above the sea between Cherchell and Algiers, near Sidi Rached in Tipaza province. A drum about 60 m across, ringed by sixty engaged Ionic columns, rises to a stepped cone originally about 40 m high (now about 30 m). Four false doors mark the cardinal points; the real entrance leads to a spiral gallery and two vaulted central chambers. No burial has been found.\n\n" +
      "THE NAME. In Arabic it is Kbor er-Roumia, 'tomb of the Roumia' — the Christian (literally 'Roman') woman — from which comes the French Tombeau de la Chrétienne. The name probably came from the cross-like mouldings on the false doors. It has nothing to do with the tomb's builders; later legends attached to it, including a sixteenth-century Spanish story identifying it with La Cava, the woman blamed for the Muslim conquest of Iberia in 711.\n\n" +
      "WHO BUILT IT. The geographer Pomponius Mela, writing about 43 CE, mentions beyond Iol-Caesarea a monumentum commune regiae gentis, a common monument of the royal family (1.31 in the numbering given by the English Wikipedia article read during research). Most scholars identify the mausoleum with this and attribute it to Juba II and Cleopatra Selene, around the last decades BCE, comparing its design with the Mausoleum of Augustus in Rome and with the older Medracen. The attribution is reasonable but rests on Mela and on style; no inscription naming the king survives on the monument, and some scholars have argued that the tomb, or an earlier phase of it, belongs to an earlier Mauretanian dynasty.\n\n" +
      "WHAT HAPPENED TO IT. It was robbed in antiquity; in 1555 the Pasha of Algiers ordered it demolished, an attempt abandoned according to local tradition; in the colonial period French forces damaged it with artillery. It is part of the Tipasa World Heritage Site (inscribed 1982).\n\n" +
      "WHAT IT DOES NOT SHOW. That Juba and Selene were actually buried here: their remains have never been found. And it belongs to the North African royal-tomb tradition — the 'Tomb of the Christian Woman' is a later popular name, not evidence of Christian or Moorish origin.",
    category: "archaeology",
    subcategory: LANE,
    eventType: "archaeological_interpretation",
    tags: laneTags("numidiaMauretania", "mauretania", "royal-tombs", "juba-ii", "cleopatra-selene", "tipasa", "architecture"),
    people: ["Juba II", "Cleopatra Selene II", "Pomponius Mela", "Salah Rais"],
    civilisations: ["Mauretania", "Rome", "Amazigh peoples"],
    locationName: "Sidi Rached, near Tipasa, Algeria",
    lat: 36.576,
    lng: 2.694,
    identificationStatus: "probable",
    evidenceStatus: "strongly_documented",
    media: [
      commonsPicture({
        fileName: "Royal Mausoleum of Mauretania 02.jpg",
        caption:
          "The Royal Mausoleum of Mauretania near Sidi Rached, Algeria: the column-ringed drum and stepped cone. The monument itself, photographed in 2025.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY 4.0",
        creator: "Bernard Gagnon",
        pixelWidth: 6807,
        pixelHeight: 4538,
      }),
      commonsPicture({
        fileName: "Tombeau de la Chrétienne.JPG",
        caption:
          "A second view of the mausoleum (2004), showing the ruined state of the outer facing and the engaged Ionic columns whose capitals are lost.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY-SA 3.0",
        creator: "Yelles",
        pixelWidth: 1792,
        pixelHeight: 1200,
      }),
      commonsPicture({
        fileName: "Historical door of the Royal Mausoleum of Mauretania.jpg",
        caption:
          "One of the false doors of the mausoleum, whose cross-shaped mouldings probably gave it the name 'tomb of the Christian woman'. A detail of the monument photographed in 2018.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Zakaria370z",
        pixelWidth: 3168,
        pixelHeight: 4752,
      }),
    ],
    claims: [
      {
        sourceKey: "nm_bouchenaki",
        citations: [
          { sourceKey: "nm_mela", relation: "supports", note: "The 'common monument of the royal family' beyond Caesarea, usually identified with this tomb." },
          { sourceKey: "nm_roller", relation: "supports", note: "Attributes the mausoleum to Juba II and Cleopatra Selene in the late first century BCE." },
          { sourceKey: "nm_wiki_royal_mausoleum", relation: "context", note: "Records the Mela reference, the dimensions, and the absence of remains." },
        ],
        startYear: bce(25),
        endYear: bce(1),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "built under Juba II and Cleopatra Selene, late first century BCE",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        whatIsDated: "construction of the mausoleum",
        evidence:
          "From Mela's description and comparison with the Mausoleum of Augustus. No building inscription survives.",
      },
      {
        sourceKey: "nm_mela",
        citations: [
          { sourceKey: "nm_wiki_royal_mausoleum", relation: "context", note: "Where the section number and the Latin phrase were read during research." },
        ],
        startYear: 43,
        endYear: 44,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "monumentum commune regiae gentis",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "the first written mention of a royal tomb on this coast",
        evidence:
          "Mela wrote under Claudius; the phrase shows a dynastic monument existed by then, without naming the king.",
      },
      {
        sourceKey: "nm_rakob",
        citations: [
          { sourceKey: "nm_camps_medracen", relation: "context", note: "The older Medracen shows the drum-and-cone royal tomb type was local and centuries older." },
        ],
        startYear: bce(150),
        endYear: bce(25),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "possibly an earlier Mauretanian royal tomb, reused or completed by Juba",
        datingMethod: "stylistic_comparison",
        chronology: "alternative",
        whatIsDated: "construction of the mausoleum",
        evidence:
          "A minority view that the tomb, or its first phase, predates Juba. It rests on architectural comparison with the Numidian tombs and on the absence of a dedicatory inscription.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const links: SeedEventLink[] = [
  // Inside the section
  { from: "massylii-and-masaesyli", to: "syphax-and-siga", relation: "child_of", note: "Syphax was the king of the western of the two Numidian kingdoms this record describes." },
  { from: "massylii-and-masaesyli", to: "masinissa-birth", relation: "related", note: "Masinissa was the son of Gaia, king of the eastern (Massylian) kingdom." },
  { from: "massylii-and-masaesyli", to: "mauri-and-early-mauretanian-kingdom", relation: "related", note: "Polybius names the Massylii, Masaesyli and Maurusii in the same list of 218 BCE; the Mauri lay west of the Masaesyli." },
  { from: "syphax-and-siga", to: "battle-of-zama", relation: "precedes", note: "Syphax's capture in 203 BCE left Masinissa the leading Numidian ally of Rome at Zama." },
  { from: "mauri-and-early-mauretanian-kingdom", to: "masinissa-birth", relation: "related", note: "Baga, the first named king of the Mauri, escorted the young Masinissa back to Numidia." },
  { from: "mauri-and-early-mauretanian-kingdom", to: "bocchus-i-of-mauretania", relation: "precedes", note: "Bocchus I, a century later, is the next king of the Mauri the sources describe, probably Baga's descendant." },
  { from: "masinissa-birth", to: "battle-of-zama", relation: "precedes", note: "His early service and defection to Rome led to his command of the Numidian cavalry at Zama." },
  { from: "battle-of-zama", to: "masinissa-kingdom", relation: "precedes", note: "The peace after Zama made Masinissa king of a united Numidia." },
  { from: "masinissa-kingdom", to: "numidian-royal-tombs-medracen-and-dougga", relation: "related", note: "The royal tombs of Numidia include monuments often, but unprovably, linked to Masinissa's dynasty." },
  { from: "masinissa-kingdom", to: "jugurthine-war", relation: "precedes", note: "The succession to Masinissa's son Micipsa produced the war with Jugurtha, Masinissa's grandson." },
  { from: "masinissa-kingdom", to: "numidian-and-mauretanian-coinage", relation: "related", note: "The 'Masinissa or Micipsa' bronzes are the coinage of this kingdom, with attribution problems." },
  { from: "jugurthine-war", to: "bocchus-i-of-mauretania", relation: "related", note: "Bocchus I entered the Jugurthine War as Jugurtha's father-in-law and ally." },
  { from: "bocchus-i-of-mauretania", to: "capture-of-jugurtha", relation: "precedes", note: "Bocchus's change of side ended with his betrayal of Jugurtha to Sulla." },
  { from: "capture-of-jugurtha", to: "jugurthine-war", relation: "part_of", note: "The capture was the final act of the Jugurthine War." },
  { from: "juba-i-and-thapsus", to: "bocchus-ii-bogud-and-mauretania-to-rome", relation: "related", note: "Bocchus II invaded Juba I's kingdom for Caesar and was rewarded with Numidian land after Thapsus." },
  { from: "juba-i-and-thapsus", to: "juba-ii-of-mauretania", relation: "precedes", note: "Juba II was Juba I's son, carried in Caesar's triumph after Thapsus and raised in Rome." },
  { from: "bocchus-ii-bogud-and-mauretania-to-rome", to: "juba-ii-of-mauretania", relation: "precedes", note: "The interregnum after Bocchus II's death in 33 BCE ended when Augustus gave Mauretania to Juba II in 25 BCE." },
  { from: "juba-ii-of-mauretania", to: "cleopatra-selene-ii", relation: "related", note: "Juba II and Cleopatra Selene ruled Mauretania together from Caesarea." },
  { from: "juba-ii-of-mauretania", to: "volubilis-and-iol-caesarea", relation: "related", note: "Juba II made Iol his capital as Caesarea and built at Volubilis." },
  { from: "juba-ii-of-mauretania", to: "royal-mausoleum-of-mauretania", relation: "related", note: "The Royal Mausoleum is usually attributed to Juba II and Cleopatra Selene." },
  { from: "juba-ii-of-mauretania", to: "numidian-and-mauretanian-coinage", relation: "related", note: "Juba II's Latin and Greek silver is the largest of the royal coinages." },
  { from: "cleopatra-selene-ii", to: "royal-mausoleum-of-mauretania", relation: "related", note: "Selene is traditionally said to have been buried in the Royal Mausoleum, though no remains survive." },
  { from: "numidian-royal-tombs-medracen-and-dougga", to: "royal-mausoleum-of-mauretania", relation: "related", note: "The Mauretanian mausoleum continues the drum-and-cone royal tomb type of the Medracen." },
  { from: "syphax-and-siga", to: "numidian-and-mauretanian-coinage", relation: "related", note: "Syphax's bronzes are among the first indigenous royal coins of North Africa." },
  { from: "syphax-and-siga", to: "numidian-royal-tombs-medracen-and-dougga", relation: "related", note: "The Beni Rhenane mausoleum opposite Siga belongs to the same series of royal tombs." },

  // To other sections of this track
  { from: "mauri-and-early-mauretanian-kingdom", to: "alt-ancient-mauri-and-medieval-moorish-identity", relation: "relevant", note: "The ancient Mauri described here are the starting point of the disputed claim that they and the medieval Moors were one people." },
  { from: "mauri-and-early-mauretanian-kingdom", to: "mauri-cavalry-in-the-roman-army", relation: "precedes", note: "Mauri served in Carthage's armies from 218 BCE, long before they became Rome's famous auxiliary cavalry." },
  { from: "battle-of-zama", to: "mauri-cavalry-in-the-roman-army", relation: "related", note: "The North African light-cavalry tradition decisive at Zama continued in the Moorish cavalry of the Roman army." },
  { from: "massylii-and-masaesyli", to: "rome-carthage-first-treaty", relation: "relevant", note: "The early Rome–Carthage treaties defined the Carthaginian sphere in Africa that the Numidian kingdoms bordered." },
  { from: "volubilis-and-iol-caesarea", to: "phoenician-arrival-utica-lixus-gadir", relation: "related", note: "The Punic phases of Volubilis and Iol belong to the network of Phoenician and Punic settlements on the African coast." },
  { from: "juba-ii-of-mauretania", to: "roman-north-african-cultural-exchange", relation: "related", note: "Juba's Greco-Roman court at Caesarea is an early case of the cultural exchange the Roman-period record traces." },
  { from: "cleopatra-selene-ii", to: "african-gods-in-etruscan-and-roman-religion", relation: "relevant", note: "Selene's Isis cult at Caesarea shows Egyptian religion moving west through royal patronage." },

  // To records seeded by other datasets (Hannibal)
  { from: "hannibal-campaign-in-italy", to: "battle-of-zama", relation: "precedes", note: "Hannibal's recall from Italy in 203 BCE led directly to the battle in Africa." },
  { from: "battle-of-cannae", to: "battle-of-zama", relation: "relevant", note: "Numidian cavalry fought for Hannibal at Cannae; at Zama Masinissa's Numidians fought for Rome." },
  { from: "second-punic-war-begins", to: "battle-of-zama", relation: "related", note: "Zama was the last battle of the war that began in 218 BCE." },
  { from: "hannibals-elephants", to: "battle-of-zama", relation: "relevant", note: "Hannibal's eighty elephants opened the battle at Zama and failed." },
  { from: "hannibal-takes-command-in-iberia", to: "massylii-and-masaesyli", relation: "relevant", note: "Massylian and Masaesylian contingents served in the Carthaginian forces in Iberia that Hannibal commanded." },
  { from: "masinissa-birth", to: "hannibal-birth", relation: "related", note: "Masinissa and Hannibal were near-contemporaries, both raised in the Carthaginian world." },
];

export const NUMIDIA_MAURETANIA: MoorsSection = { sources, events, links };
