// ROMAN AND LATE ANTIQUE AFRICA, AND THE EMERGENCE OF MEDIEVAL MOORS.
//
// Fifteen records, 40 CE to 711 CE: from Rome's annexation of the Mauretanian
// kingdom to Tariq ibn Ziyad's crossing of the Strait. Two lanes — `roman`
// (Roman and post-Roman Africa, to the Byzantine wars) and `medieval` (the
// seventh-century conquests and the people a Latin chronicler of 754 would
// call "Mauri" in Spain).
//
// HOW THIS FILE WAS RESEARCHED. The ancient and early medieval texts quoted
// below were read in this session in public-domain editions on the Internet
// Archive: Pliny (Rackham, Loeb 1942), Cassius Dio (Cary, Loeb 1924–25),
// Ammianus (Yonge, Bohn 1862), Procopius (Dewing, Loeb 1916), Hydatius, Prosper,
// John of Biclaro and the Chronicle of 754 (Mommsen, MGH Chronica minora I–II,
// 1892–94), Ibn Abd al-Hakam (Jones, 1858) and Ibn Khaldun (de Slane, vol. 3).
// Where a text is quoted, the words are the ones on that page (OCR noise
// silently corrected only where the reading is unambiguous). Everything else is
// a paraphrase and says so. Modern works are cited by author, title, publisher
// and, where one was confirmed, DOI; URLs are given only for pages loaded in
// this session or for DOIs.
//
// THE DISTINCTION KEPT HERE. "Mauri" in these records is a Latin political and
// ethnographic label applied by Romans — and later taken up by some African
// rulers themselves (Masuna's "gentes Maurorum et Romanorum") — not a
// description of anyone's ancestry. The medieval European "Moors" grew out of
// it, and the Chronicle of 754 is where the reader can watch the word cross the
// Strait. Ancestry, language, religion, geography and political identity are
// kept apart throughout.

import type { SeedEvent, SeedSource, SeedEventLink } from "../seed-types";
import { MOORS_LANES, commonsPicture, laneTags, type MoorsSection } from "./shared";

const IA = "https://archive.org/details/";

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // --- Ancient and early medieval texts (read in this session) -------------
  {
    key: "rla_pliny_nh5",
    title: "Natural History, Book 5 (Africa)",
    author: "Pliny the Elder",
    workTitle: "Naturalis Historia, ed. and trans. H. Rackham, Loeb Classical Library vol. 2",
    publisher: "Harvard University Press / Heinemann",
    reference: "5.11 (first Roman war in Mauretania, Aedemon avenging Ptolemy); 5.14 (Suetonius Paulinus crosses the Atlas); 5.17 (the Mauri of Tingitana 'reduced by wars to a few families')",
    url: `${IA}naturalhistory02plinuoft`,
    sourceType: "historical_document",
    publishedYear: 1942,
    publishedDisplay: "written c. 77 CE; Rackham's Loeb edition 1942",
    notes:
      "Cited for the annexation of Mauretania: Pliny, writing about thirty-five years after the event, says Roman arms first fought in Mauretania under Claudius, when the freedman Aedemon took up arms to avenge King Ptolemy, killed by Gaius (Caligula); that Suetonius Paulinus was the first Roman commander to cross the Atlas; and that the Mauri who gave Tingitana its name had been reduced by war to a few families. Read in this session in the Internet Archive scan of Rackham's Loeb edition.",
  },
  {
    key: "rla_dio_cary_7",
    title: "Roman History, Books 56–60",
    author: "Cassius Dio",
    workTitle: "Dio's Roman History, trans. Earnest Cary, Loeb Classical Library vol. 7",
    publisher: "Harvard University Press / Heinemann",
    reference: "59.25.1 (Gaius summons Ptolemy son of Juba and kills him for his wealth); 60.8.6 and 60.9.1–5 (the Moorish war of 41–42 CE: Suetonius Paulinus to the Atlas, Hosidius Geta against Salabus; Claudius divides the subject Moors into Tingitana and Caesariensis under two equestrian governors)",
    url: `${IA}diosromanhistory07cassuoft`,
    sourceType: "historical_document",
    publishedYear: 1924,
    publishedDisplay: "written early 3rd century CE; Cary's Loeb translation 1924",
    notes:
      "Cited for the date and mechanics of the annexation: Dio places Ptolemy's execution in Gaius' reign (40 CE), the war against the Mauri in 41–42, and Claudius' division of the subject Mauri into two provinces named after Tingis and Caesarea, each under an equestrian governor, in the consular year 42. Read in this session (Internet Archive scan).",
  },
  {
    key: "rla_dio_cary_8",
    title: "Roman History, Books 61–70",
    author: "Cassius Dio",
    workTitle: "Dio's Roman History, trans. Earnest Cary, Loeb Classical Library vol. 8",
    publisher: "Harvard University Press / Heinemann",
    reference: "68.32.4–5 (Lusius Quietus)",
    url: `${IA}diosromanhistory08cassuoft`,
    sourceType: "historical_document",
    publishedYear: 1925,
    publishedDisplay: "written early 3rd century CE; Cary's Loeb translation 1925",
    notes:
      "Cited for Lusius Quietus: Dio (in a Byzantine excerpt) says Quietus was a Moor who ranked as a leader of the Moors and commanded a troop of cavalry, was dismissed in disgrace, and then came of his own accord to Trajan when Trajan needed the Moors for the Dacian war, rising to praetorian and consular rank and the governorship of Palestine. Read in this session.",
  },
  {
    key: "rla_suetonius_caligula",
    title: "Life of Gaius (Caligula)",
    author: "Suetonius",
    workTitle: "De vita Caesarum",
    reference: "Gaius 35.1",
    sourceType: "historical_document",
    publishedDisplay: "written early 2nd century CE",
    notes:
      "Cited as the second ancient account of Ptolemy of Mauretania's execution, which Suetonius attributes to Gaius' jealousy of the purple cloak Ptolemy wore at a show. NOT read in this session (the online editions were unreachable); cited by book and chapter from the standard text and paraphrased, not quoted.",
  },
  {
    key: "rla_ammianus_yonge",
    title: "The Roman History of Ammianus Marcellinus",
    author: "Ammianus Marcellinus",
    workTitle: "Res Gestae, trans. C. D. Yonge (Bohn's Classical Library)",
    publisher: "Henry G. Bohn",
    reference: "29.5 (the war of Theodosius against Firmus); 28.6.26",
    url: `${IA}romanhistoryofam00ammiuoft`,
    sourceType: "historical_document",
    publishedYear: 1862,
    publishedDisplay: "written c. 390 CE; Yonge's translation 1862",
    notes:
      "Cited for the revolt of Firmus: Ammianus, a near-contemporary, says Nubel, 'the most powerful chieftain among the Mauritanian nations', died leaving several sons, that Firmus killed his brother Zamma (a favourite of the comes Romanus), and narrates Theodosius' campaign, the role of Igmazen king of the Isaflenses, and Firmus' suicide. Read in this session in Yonge's public-domain translation.",
  },
  {
    key: "rla_claudian_gildo",
    title: "De bello Gildonico (The War against Gildo)",
    author: "Claudian",
    reference: "Carmina 15",
    sourceType: "historical_document",
    publishedDisplay: "composed 398 CE",
    notes:
      "Cited for the Gildonic war of 397–398 as told at the court of Honorius: a hostile panegyric poem, the main narrative source for Gildo's revolt. Not read in this session; cited for its existence, date and partisan character, and paraphrased.",
  },
  {
    key: "rla_hydatius",
    title: "Chronicle of Hydatius",
    author: "Hydatius",
    workTitle: "Chronica minora saec. IV–VII, vol. 2, ed. Theodor Mommsen (Monumenta Germaniae Historica, Auctores antiquissimi 11)",
    publisher: "Weidmann",
    reference: "Hydatius §90 (Mommsen's numbering), under 429",
    url: `${IA}chronicaminorasa11momm`,
    sourceType: "historical_document",
    publishedYear: 1894,
    publishedDisplay: "written c. 469 CE; Mommsen's edition 1894",
    notes:
      "Cited for the Vandal crossing: Hydatius, a contemporary bishop in Gallaecia, records that King Gaiseric left the coast of Baetica with all the Vandals and their families in the month of May and crossed to Mauretania and Africa (mense Maio ad Mauritaniam et Africam ... transit). Read in this session in the Internet Archive scan of Mommsen's edition.",
  },
  {
    key: "rla_prosper",
    title: "Epitoma chronicon",
    author: "Prosper of Aquitaine",
    workTitle: "Chronica minora saec. IV–VII, vol. 1, ed. Theodor Mommsen (MGH Auctores antiquissimi 9)",
    publisher: "Weidmann",
    reference: "§1339 (under 439)",
    url: `${IA}chronicaminorasa09momm`,
    sourceType: "historical_document",
    publishedYear: 1892,
    publishedDisplay: "written mid-5th century; Mommsen's edition 1892",
    notes:
      "Cited for the date of the fall of Carthage: Prosper, a contemporary, writes that Gaiseric, 'of whose friendship nothing was feared', seized Carthage by a trick of peace on the fourteenth day before the Kalends of November (19 October) 439. Read in this session (Mommsen's edition).",
  },
  {
    key: "rla_procopius_dewing",
    title: "History of the Wars, Books III–IV (The Vandalic War)",
    author: "Procopius of Caesarea",
    workTitle: "Procopius, with an English translation by H. B. Dewing, Loeb Classical Library vol. 2",
    publisher: "Heinemann / Macmillan",
    reference: "3.8.5 (the Moors of Mount Aurasium revolt from the Vandals under Huneric and never come under them again); 4.13 (Iaudas, ruler of the Moors in Aurasium); 4.20.30–31 (Mastigas holds Caesarean Mauretania, except Caesarea itself)",
    url: `${IA}procopiuswitheng02procuoft`,
    sourceType: "historical_document",
    publishedYear: 1916,
    publishedDisplay: "written c. 550 CE; Dewing's Loeb translation 1916",
    notes:
      "Cited for the Vandal and Byzantine periods: Procopius, Belisarius' secretary and an eyewitness of the 533 campaign, is the main narrative for the Byzantine reconquest and the wars with Moorish rulers (Antalas, Iaudas, Mastigas). Read in this session. He writes from the imperial side and his 'Moors' are a category of outsiders; how far his picture of them is a literary construction is discussed by Modéran (2003) and Merrills (2004).",
  },
  {
    key: "rla_john_biclaro",
    title: "Chronicle of John of Biclaro",
    author: "John of Biclaro",
    workTitle: "Chronica minora saec. IV–VII, vol. 2, ed. Theodor Mommsen (MGH Auctores antiquissimi 11)",
    publisher: "Weidmann",
    reference: "entries for 570, 571 and 578",
    url: `${IA}chronicaminorasa11momm`,
    sourceType: "historical_document",
    publishedYear: 1894,
    publishedDisplay: "written c. 590 CE; Mommsen's edition 1894",
    notes:
      "Cited for Garmul: John records that Theoctistus, magister militum of Africa, was overcome by the Moors and died (570), that Amabilis, magister militiae of Africa, was killed by the Moors (571), and that in 578 Gennadius 'laid waste the Moors, overcame in war Garmul, a most powerful king, who had already killed three commanders of the Roman army, and killed the king himself with the sword' (Garmulem fortissimum regem ... bello superat et ipsum regem gladio interficit). Read in this session.",
  },
  {
    key: "rla_chronicle_754",
    title: "Chronicle of 754 (Continuatio Hispana, Mozarabic Chronicle)",
    author: "Anonymous Christian chronicler in al-Andalus",
    workTitle: "Chronica minora saec. IV–VII, vol. 2, ed. Theodor Mommsen (MGH Auctores antiquissimi 11), as 'Continuatio Hispana anno DCCLIV'",
    publisher: "Weidmann",
    reference: "Mommsen §§68–69 (= §52 in Wolf's and López Pereira's numbering): Roderic and the invasion",
    url: `${IA}chronicaminorasa11momm`,
    sourceType: "historical_document",
    publishedYear: 1894,
    publishedDisplay: "written 754 CE; Mommsen's edition 1894",
    notes:
      "Cited for the conquest of 711–712 and for the word: the earliest surviving narrative of the invasion, written about forty years after it by a Christian living under Muslim rule. It begins with Heraclius' accession in 610. Its account of Roderic says he gathered an army against the Arabs together with 'the Moors sent by Musa, that is, Taric Abuzara and the others' (Mauros a Muze missos, id est Taric Abuzara), and met them at the 'Transductine promontories' (Transductos promonturiis), where the Gothic army fled and he fell — dated by the chronicle to era 750 (712 CE). Read in this session in Mommsen's edition.",
  },
  {
    key: "rla_ibn_abd_al_hakam",
    title: "Ibn Abd-el-Hakem's History of the Conquest of Spain (Dhikr Fath al-Andalus)",
    author: "Ibn Abd al-Hakam (trans. John Harris Jones)",
    workTitle: "Futuh Misr wa'l-Maghrib (excerpt on al-Andalus)",
    publisher: "W. Fr. Kaestner, Göttingen",
    reference: "pp. 18–20 of the translation; with Jones's notes on Tarik's name (pp. 56–57) and on Ilyan (p. 47 ff.)",
    url: `${IA}dhikrfatalandal00jonegoog`,
    sourceType: "historical_document",
    publishedYear: 1858,
    publishedDisplay: "written mid-9th century (d. 871); Jones's translation 1858",
    notes:
      "Cited for the earliest Arabic narrative of the crossing: Musa made Tarik ibn Zeiyad governor of Tangiers 'in the year 92'; Ilyan, 'Lord of Septa', a subject of Roderic, offered to bring Tarik over after Roderic got his daughter pregnant; a mountain 'called the mountain of Tarik' stood between Septa and al-Andalus; Tarik's men crossed in Ilyan's vessels at night, taken by the locals for traders. The same pages carry plainly legendary material (a staged act of cannibalism, a locked house holding portraits of Arabs). Read in this session in Jones's translation, which is old and should be checked against Torrey's 1922 edition.",
  },
  {
    key: "rla_ibn_khaldun_slane",
    title: "Histoire des Berbères et des dynasties musulmanes de l'Afrique septentrionale, tome troisième",
    author: "Ibn Khaldun (trans. William McGuckin de Slane)",
    workTitle: "Kitab al-'Ibar",
    publisher: "Imprimerie du Gouvernement, Algiers",
    reference: "vol. 3, pp. 191–194 (the Zenata; 'Histoire de la Kahena et de son peuple, les Djeraoua')",
    url: `${IA}histoiredesberb00khalgoog`,
    sourceType: "historical_document",
    publishedDisplay: "written c. 1377–1382; de Slane's French translation 1852–1856",
    notes:
      "Cited for Ibn Khaldun's account of the Kahena (Dihya): written some seven centuries after her, it makes her the leader of the Djeraoua (Jarawa) of the Aurès, says the Romans had imposed Christianity on the Zenata, credits her with urging the Berbers of Tehouda to kill Uqba, quotes an informant that she ruled sixty-five years and lived 127, and dates Hassan's victory and her death to 'l'an 74 (693-4)'. The separate passage (in vol. 1) on Judaized Berber tribes, including the Jarawa, was not read in this session; it is cited via Hirschberg (1963). De Slane's translation is regarded as outdated (Cheddadi's is preferred). Read in this session in the Internet Archive scan of vol. 3.",
  },
  {
    key: "rla_victor_vita",
    title: "Historia persecutionis Africanae provinciae",
    author: "Victor of Vita",
    reference: "Books 1–3",
    sourceType: "historical_document",
    publishedDisplay: "written c. 484–489 CE",
    notes:
      "Cited as the contemporary Nicene Christian account of the Vandal kingdom under Gaiseric and Huneric, including Huneric's persecution of 484. Not read in this session; cited for its date and standpoint, and paraphrased. Its figures and its picture of the Vandals are those of a victim of persecution.",
  },
  {
    key: "rla_corippus",
    title: "Iohannis (De bellis Libycis)",
    author: "Flavius Cresconius Corippus",
    reference: "Books 1–8",
    sourceType: "historical_document",
    publishedDisplay: "composed c. 549–550 CE",
    notes:
      "Cited for John Troglita's wars of 546–548 against Moorish coalitions (Antalas, Carcasan and the Laguatan) and his alliance with Cusina: a Latin epic by an African poet, the fullest source for these campaigns and for Moorish names, gods and fighting. Not read in this session; cited for its date and contents and paraphrased, with Merrills (2023) as the modern guide.",
  },
  {
    key: "rla_theophanes",
    title: "Chronographia",
    author: "Theophanes the Confessor",
    workTitle: "trans. C. Mango and R. Scott, The Chronicle of Theophanes Confessor (Oxford: Clarendon, 1997)",
    reference: "AM 6102 (Heraclius); AM 6190 (the loss of Carthage and John the Patrician's expedition)",
    sourceType: "historical_document",
    publishedDisplay: "written c. 810–815 CE",
    notes:
      "Cited as the main Byzantine narrative source for Heraclius' coup from Africa (610) and for the fall of Carthage and the failed relief expedition of John the Patrician (697–698). Not read in this session; cited by annus mundi entry and paraphrased.",
  },
  {
    key: "rla_augustine_romans",
    title: "Epistulae ad Romanos inchoata expositio",
    author: "Augustine of Hippo",
    reference: "§13",
    sourceType: "religious_text",
    publishedDisplay: "written c. 394–395 CE",
    notes:
      "Cited for Punic as a living rural language in Augustine's Africa: in a much-quoted passage Augustine says that country people near Hippo, asked what they were, answered in Punic that they were 'Chanani' (Canaanites). Not read in this session; paraphrased from the standard text, and cited alongside modern discussions of late Punic.",
  },
  {
    key: "rla_apuleius_apologia",
    title: "Apologia (Pro se de magia)",
    author: "Apuleius of Madauros",
    reference: "§24",
    sourceType: "historical_document",
    publishedDisplay: "delivered c. 158–159 CE at Sabratha",
    notes:
      "Cited for Apuleius' description of himself, in a speech defending himself against a charge of magic, as half-Numidian and half-Gaetulian (seminumida et semigaetulus) — a statement of regional and political belonging by a Latin writer born at Madauros. Not read in this session; paraphrased from the standard text.",
  },

  // --- Inscriptions and objects -------------------------------------------
  {
    key: "rla_rib_2042",
    title: "RIB 2042: altar of the numerus Maurorum Aurelianorum at Aballava (Burgh-by-Sands)",
    author: "Dedicated by the unit of Aurelian Moors",
    workTitle: "R. G. Collingwood and R. P. Wright, The Roman Inscriptions of Britain I: Inscriptions on Stone (Oxford, 1965)",
    reference: "RIB I 2042 (online record romaninscriptionsofbritain.org/inscriptions/2042)",
    sourceType: "archaeological",
    publishedYear: 1965,
    publishedDisplay: "altar of 253–258 CE, found 1934; RIB 1965",
    notes:
      "Cited for Moorish soldiers on Hadrian's Wall: an altar to Jupiter, the divinities of the two emperors and the genius of the 'unit of Aurelian Moors, Valerian's and Gallienus' own', which RIB dates to 253–258 by the imperial titles (the Heidelberg database narrows it to 253–255). The RIB page itself could not be loaded from the research environment; its contents were confirmed through a search index and through the Wikipedia article on Aballava, which cites it.",
  },
  {
    key: "rla_notitia",
    title: "Notitia Dignitatum, pars Occidentis",
    author: "Late Roman imperial chancery (compiler unknown)",
    reference: "Occ. XL, list of the Dux Britanniarum: praefectus numeri Maurorum Aurelianorum, Aballaba",
    sourceType: "government",
    publishedDisplay: "compiled c. 395–420s CE; survives in 15th–16th-century copies of a Carolingian copy",
    notes:
      "Cited for the long life of the Moorish unit at Aballava: the official list of offices names a prefect of the numerus of Aurelian Moors at Aballaba under the Duke of the Britains, about a century and a half after RIB 2042. Paraphrased; the date of the British section of the Notitia is itself argued over.",
  },
  {
    key: "rla_masuna_inscription",
    title: "The Altava inscription of King Masuna",
    author: "Set up for King Masuna by his prefect Masgivinus",
    reference: "CIL VIII 9835 (= AE 1998, 1595); Altava, modern Ouled Mimoun, Algeria; dated provincial year 469",
    sourceType: "archaeological",
    publishedDisplay: "508 CE",
    notes:
      "Cited for Masuna and his title: a building inscription for a fort (castrum) put up 'for the health and safety of King Masuna, [king] of the peoples of the Mauri and the Romans' (pro sal(ute) et incol(umitate) reg(is) Masunae gent(ium) Maur(orum) et Romanor(um)), naming his prefect at Safar and his procurators at Castra Severiana and Altava, dated by the Mauretanian provincial era (year 469 from 40 CE = 508 CE). The Latin is cited as transcribed in the Wikipedia article on the Mauro-Roman Kingdom; the stone itself was not examined.",
  },
  {
    key: "rla_masties_inscription",
    title: "The epitaph (elogium) of Masties at Arris",
    author: "Set up by Vartaia and his brothers",
    reference: "AE 1945, 97 (EDH HD019959); found 1941 at Arris in the Aurès; National Museum of Antiquities, Algiers",
    sourceType: "archaeological",
    publishedDisplay: "undated; late 5th or early 6th century CE",
    notes:
      "Cited for Masties: a Latin epitaph in which Masties says he was dux for 67 years and imperator for 10, that he never broke faith 'with the Romans or with the Moors', and that God rewarded him; Vartaia records paying for the monument. The readings of the numbers and the coin are disputed (Morizot 1989, 2002). Paraphrased; the English rendering in Wikipedia's article was consulted.",
  },
  {
    key: "rla_lepcis_bilingual",
    title: "Latin–Neo-Punic dedication of Annobal Rufus at the theatre of Lepcis Magna",
    author: "Annobal Tapapius Rufus",
    reference: "IRT 321; KAI 121",
    sourceType: "archaeological",
    publishedDisplay: "1–2 CE",
    notes:
      "Cited as a datable example of public bilingualism in Roman Africa: the dedication of the theatre at Lepcis Magna by a local magnate with a Punic name, in Latin and in Neo-Punic, dated by Augustus' 24th tribunician power. Cited from the Commons file description of the photograph used here and the standard corpus numbers.",
  },
  {
    key: "rla_cil_8_20433",
    title: "Stele dedicated to Saturnus Augustus, Beni Fouda (CIL VIII 20433)",
    author: "Q. Caelius Felix, sacerdos",
    reference: "CIL VIII 20433; Musée national des Antiquités, Algiers",
    sourceType: "archaeological",
    publishedDisplay: "Roman imperial period (2nd–3rd century CE)",
    notes:
      "Cited as an example of the African Saturn stelae: a three-register stele with Saturn, veiled and bearded, at the top, dedicated Saturno Aug(usto) by a priest. Its text and description are taken from the museum photograph's Commons record; the date range is the general one for the series (Le Glay).",
  },
  {
    key: "rla_dinar_716",
    title: "Bilingual Latin–Arabic gold coin (solidus/dinar) struck in al-Andalus, AH 98",
    author: "Umayyad mint in al-Andalus",
    reference: "Gold, 4.16 g; Latin legend FERITOS SOLI IN SPAN... with Arabic 'Muhammad rasul Allah'; Classical Numismatic Group photograph on Wikimedia Commons",
    sourceType: "archaeological",
    publishedDisplay: "716–717 CE",
    notes:
      "Cited as physical evidence of the new regime in Iberia within five or six years of 711: a gold coin with a Latin legend saying it was struck in Spania and an Arabic Muslim profession of faith — a two-language coinage for a two-language conquest. Cited from the dealer's description on its Commons file page.",
  },

  // --- Modern scholarship -------------------------------------------------
  {
    key: "rla_vanacker_2013",
    title: "Aedemon, Lusius Quietus and the Baquates: ties of resistance and cooperation",
    author: "Wouter Vanacker",
    workTitle: "Mnemosyne 66 (4–5)",
    reference: "Mnemosyne 66 (2013) 708 ff. DOI 10.1163/156852512X617588",
    url: "https://doi.org/10.1163/156852512X617588",
    sourceType: "academic_paper",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for the indigenous side of the annexation and of Moorish service: argues for links between Aedemon's revolt, the family of Lusius Quietus and the Baquates of Tingitana, i.e. that resistance and cooperation ran through the same Mauretanian networks. DOI confirmed via the Wikipedia article on Lusius Quietus; the paper itself was not read.",
  },
  {
    key: "rla_hamdoune_2015",
    title: "Lusius Quietus",
    author: "Christine Hamdoune",
    workTitle: "Encyclopédie berbère 39",
    reference: "pp. 6679–6685; DOI 10.4000/encyclopedieberbere.4042",
    url: "https://doi.org/10.4000/encyclopedieberbere.4042",
    sourceType: "encyclopedia",
    publishedYear: 2015,
    publishedDisplay: "2015",
    notes:
      "Cited for the modern discussion of Lusius Quietus' origins (Dio's 'Moor'; proposals of an 'Ethiopian' or Punic background that remain unverified). Bibliographic details confirmed via Wikipedia; not read in this session.",
  },
  {
    key: "rla_lepper_frere_1988",
    title: "Trajan's Column: A New Edition of the Cichorius Plates",
    author: "Frank Lepper and Sheppard Frere",
    publisher: "Alan Sutton, Gloucester",
    reference: "commentary on the scene of the Moorish cavalry (scene LXIV in Cichorius' numbering)",
    sourceType: "academic_book",
    publishedYear: 1988,
    publishedDisplay: "1988",
    notes:
      "Cited for the standard reading of the Trajan's Column scene in which bareheaded riders with corkscrew curls on small horses, without saddle or bridle, are identified as Moorish cavalry and often associated with Lusius Quietus. Cited for the identification, which rests on dress and style rather than on any label on the column; not read in this session.",
  },
  {
    key: "rla_speidel_1975",
    title: "The rise of ethnic units in the Roman imperial army",
    author: "Michael P. Speidel",
    workTitle: "Aufstieg und Niedergang der römischen Welt II.3",
    publisher: "De Gruyter, Berlin",
    reference: "ANRW II.3 (1975) 202–231",
    sourceType: "academic_paper",
    publishedYear: 1975,
    publishedDisplay: "1975",
    notes:
      "Cited for the institutional history of 'ethnic' numeri and irregular units such as the Mauri gentiles and numeri Maurorum from the 2nd century on. Not read in this session; cited for its subject.",
  },
  {
    key: "rla_leglay_1966",
    title: "Saturne africain. Histoire",
    author: "Marcel Le Glay",
    publisher: "De Boccard, Paris (Bibliothèque des Écoles françaises d'Athènes et de Rome 205)",
    reference: "with the companion volumes Saturne africain. Monuments I–II (1961–1966)",
    sourceType: "academic_book",
    publishedYear: 1966,
    publishedDisplay: "1966",
    notes:
      "Cited for the African Saturn cult as the Roman-period continuation of the Punic Baal Hammon, attested by thousands of votive stelae across Africa Proconsularis and Numidia, and for its rural, indigenous base. Not read in this session; the standard study.",
  },
  {
    key: "rla_rives_1995",
    title: "Religion and Authority in Roman Carthage from Augustus to Constantine",
    author: "J. B. Rives",
    publisher: "Clarendon Press, Oxford",
    sourceType: "academic_book",
    publishedYear: 1995,
    publishedDisplay: "1995",
    reference: "J. B. Rives, Religion and Authority in Roman Carthage from Augustus to Constantine (Oxford: Clarendon Press, 1995)",
    notes:
      "Cited for how Roman, Punic and local cults were reorganised in Roman Carthage and its territory, including Saturn and Caelestis. Not read in this session; cited for its subject.",
  },
  {
    key: "rla_wilson_2012",
    title: "Neo-Punic and Latin inscriptions in Roman North Africa: function and display",
    author: "Andrew Wilson",
    workTitle: "in A. Mullen and P. James (eds), Multilingualism in the Graeco-Roman Worlds",
    publisher: "Cambridge University Press",
    reference: "pp. 265–316",
    sourceType: "academic_book",
    publishedYear: 2012,
    publishedDisplay: "2012",
    notes:
      "Cited for the survival and public use of Neo-Punic alongside Latin under Roman rule (into the 2nd century CE in inscriptions, later in Latin-letter 'Latino-Punic'), and for bilingual dedications such as those of Lepcis Magna. Not read in this session; cited for its subject.",
  },
  {
    key: "rla_brett_fentress_1996",
    title: "The Berbers",
    author: "Michael Brett and Elizabeth Fentress",
    publisher: "Blackwell, Oxford",
    reference: "ISBN 978-0-631-20767-2; chs 2–3 (Roman and late antique Africa)",
    sourceType: "academic_book",
    publishedYear: 1996,
    publishedDisplay: "1996",
    notes:
      "Cited as the standard English survey for Roman and late antique Africa from the point of view of the indigenous population: the Dii Mauri, the Libyan inscriptions, Moorish service in the army (including Lusius Quietus), the late-antique kingdoms and the conquest. Not read in this session.",
  },
  {
    key: "rla_shaw_2011",
    title: "Sacred Violence: African Christians and Sectarian Hatred in the Age of Augustine",
    author: "Brent D. Shaw",
    publisher: "Cambridge University Press",
    sourceType: "academic_book",
    publishedYear: 2011,
    publishedDisplay: "2011",
    reference: "B. D. Shaw, Sacred Violence: African Christians and Sectarian Hatred in the Age of Augustine (Cambridge: Cambridge University Press, 2011)",
    notes:
      "Cited for the Donatist–Catholic schism as the religious setting of the revolts of Firmus and Gildo, and for caution about the old idea that Donatism was an 'African national' or Berber movement. Not read in this session; cited for its subject and argument as summarised in reviews.",
  },
  {
    key: "rla_blackhurst_2004",
    title: "The house of Nubel: rebels or players?",
    author: "Andy Blackhurst",
    workTitle: "in A. H. Merrills (ed.), Vandals, Romans and Berbers",
    publisher: "Ashgate, Aldershot",
    reference: "pp. 59–75",
    sourceType: "academic_book",
    publishedYear: 2004,
    publishedDisplay: "2004",
    notes:
      "Cited for the argument that Firmus and Gildo are better understood as players in Roman provincial and court politics, from a family integrated into the army and the Church, than as 'native rebels'. Not read in this session; cited for its argument.",
  },
  {
    key: "rla_merrills_2004",
    title: "Vandals, Romans and Berbers: New Perspectives on Late Antique North Africa",
    author: "A. H. Merrills (ed.)",
    publisher: "Ashgate, Aldershot",
    reference: "ISBN 0-7546-4145-7; editor's introduction pp. 3–28",
    sourceType: "academic_book",
    publishedYear: 2004,
    publishedDisplay: "2004 (reissued Routledge 2016)",
    notes:
      "Cited for the post-Roman Moorish polities (Altava, the Aurès, the Ouarsenis/Djedars) and for the methodological point that 'Berber' kingdoms were Latin-literate, Christian and Roman in vocabulary while ruling tribal populations. Not read in this session.",
  },
  {
    key: "rla_merrills_miles_2010",
    title: "The Vandals",
    author: "Andy Merrills and Richard Miles",
    publisher: "Wiley-Blackwell, Chichester",
    reference: "ISBN 978-1-405-16068-1",
    sourceType: "academic_book",
    publishedYear: 2010,
    publishedDisplay: "2010",
    notes:
      "Cited for the Vandal crossing (429), the treaty of 435, the seizure of Carthage (439), and the growth of independent Moorish power inside and beyond the Vandal kingdom, including Masties and the Aurès (pp. 127–128). Not read in this session.",
  },
  {
    key: "rla_courtois_1955",
    title: "Les Vandales et l'Afrique",
    author: "Christian Courtois",
    publisher: "Arts et Métiers graphiques, Paris",
    sourceType: "academic_book",
    publishedYear: 1955,
    publishedDisplay: "1955",
    reference: "C. Courtois, Les Vandales et l'Afrique (Paris: Arts et Métiers graphiques, 1955)",
    notes:
      "Cited for the classic mapping of the independent Moorish kingdoms of the Vandal period (including his association of the Djedars with a kingdom of the Ouarsenis) and for the limits of Vandal control. Not read in this session.",
  },
  {
    key: "rla_camps_1984",
    title: "Rex gentium Maurorum et Romanorum. Recherches sur les royaumes de Maurétanie des VIe et VIIe siècles",
    author: "Gabriel Camps",
    workTitle: "Antiquités africaines 20",
    reference: "pp. 183–218; DOI 10.3406/antaf.1984.1105",
    url: "https://doi.org/10.3406/antaf.1984.1105",
    sourceType: "academic_paper",
    publishedYear: 1984,
    publishedDisplay: "1984",
    notes:
      "Cited for the post-Roman Mauretanian kingdoms: Masuna's title, the succession Masuna–Mastigas–Garmul, and Camps' attribution of Djedar F to Garmul or his dynasty. DOI confirmed from the Wikipedia articles' citations; not read in this session.",
  },
  {
    key: "rla_morizot_1989",
    title: "Pour une nouvelle lecture de l'elogium de Masties",
    author: "Pierre Morizot",
    workTitle: "Antiquités africaines 25",
    reference: "pp. 263–284; DOI 10.3406/antaf.1989.1164",
    url: "https://doi.org/10.3406/antaf.1989.1164",
    sourceType: "academic_paper",
    publishedYear: 1989,
    publishedDisplay: "1989",
    notes:
      "Cited for the disputed reading of the Masties epitaph (imperator for ten years, not forty; the sum paid by Vartaia) and for placing Masties in the last years of the Vandal kingdom, possibly to be identified with Procopius' Mastigas. Bibliographic details and the abstract's argument confirmed via search; the article itself was not read.",
  },
  {
    key: "rla_moderan_2003",
    title: "Les Maures et l'Afrique romaine (IVe–VIIe siècle)",
    author: "Yves Modéran",
    publisher: "École française de Rome (BEFAR 314)",
    reference: "ISBN 2-7283-0640-0; open-access edition at books.openedition.org/efr/1395",
    sourceType: "academic_book",
    publishedYear: 2003,
    publishedDisplay: "2003",
    notes:
      "Cited as the fundamental modern study of the Mauri of late antiquity: the distinction between 'interior' Moors living inside the old provinces and 'exterior' Moors beyond them, the praefecti gentis and tribal rulers, the late-antique kingdoms, and the critique of Procopius and Corippus. Not read in this session; cited for its argument as summarised in the Wikipedia articles and in Merrills (2004).",
  },
  {
    key: "rla_camps_djedar_1995",
    title: "Djedar",
    author: "Gabriel Camps",
    workTitle: "Encyclopédie berbère 16",
    reference: "pp. 2409–2422; DOI 10.4000/encyclopedieberbere.2177",
    url: "https://doi.org/10.4000/encyclopedieberbere.2177",
    sourceType: "encyclopedia",
    publishedYear: 1995,
    publishedDisplay: "1995",
    notes:
      "Cited for the Djedars of Frenda (thirteen pyramidal mausolea on Jabal Lakhdar and Jabal Araoui) and their attribution to a late-antique Moorish dynasty, Djedar F possibly to Garmul or his successors. DOI confirmed via Wikipedia; not read in this session.",
  },
  {
    key: "rla_kadra_1983",
    title: "Les Djedars. Monuments funéraires berbères de la région de Frenda",
    author: "Fatima Kadria Kadra",
    publisher: "Office des Publications Universitaires, Algiers",
    sourceType: "academic_book",
    publishedYear: 1983,
    publishedDisplay: "1983",
    reference: "F. K. Kadra, Les Djedars. Monuments funéraires berbères de la région de Frenda (Algiers: Office des Publications Universitaires, 1983)",
    notes:
      "Cited as the definitive archaeological study of the Djedars, from her 1968–70 fieldwork: construction, stonemasons' marks, the Latin inscriptions and Christian symbols, and the radiocarbon date from the wooden coffin of Djedar B. Not read in this session; cited via the Wikipedia article on the Jedars, which draws on it.",
  },
  {
    key: "rla_merrills_2023",
    title: "War, Rebellion and Epic in Byzantine North Africa: A Historical Study of Corippus' Iohannis",
    author: "Andy Merrills",
    publisher: "Cambridge University Press",
    reference: "ISBN 978-1-009-39198-6",
    sourceType: "academic_book",
    publishedYear: 2023,
    publishedDisplay: "2023",
    notes:
      "Cited for John Troglita's campaigns (546–548) and for how to read Corippus' Iohannis as history: the Moorish coalitions, Cusina as Byzantine ally, and the poem's own agenda. Not read in this session.",
  },
  {
    key: "rla_pringle_1981",
    title: "The Defence of Byzantine Africa from Justinian to the Arab Conquest",
    author: "Denys Pringle",
    publisher: "British Archaeological Reports, Oxford (BAR International Series 99)",
    reference: "ISBN 0-86054-119-3",
    sourceType: "academic_book",
    publishedYear: 1981,
    publishedDisplay: "1981",
    notes:
      "Cited for the Byzantine fortifications of Africa (Theveste, Ammaedara/Haidra, Sufetula) built under Solomon and his successors, and for the military history of 533–698. Not read in this session.",
  },
  {
    key: "rla_conant_2012",
    title: "Staying Roman: Conquest and Identity in Africa and the Mediterranean, 439–700",
    author: "Jonathan Conant",
    publisher: "Cambridge University Press",
    reference: "ISBN 978-0-521-19697-0",
    sourceType: "academic_book",
    publishedYear: 2012,
    publishedDisplay: "2012",
    notes:
      "Cited for Roman identity under Vandal and Byzantine rule and for the Moorish polities' use of Roman forms; also for seventh-century Africa before the conquest. Not read in this session.",
  },
  {
    key: "rla_kaegi_2010",
    title: "Muslim Expansion and Byzantine Collapse in North Africa",
    author: "Walter E. Kaegi",
    publisher: "Cambridge University Press",
    reference: "ISBN 978-0-521-19677-2",
    sourceType: "academic_book",
    publishedYear: 2010,
    publishedDisplay: "2010",
    notes:
      "Cited for the conquest from the first raids into Byzacena in 647 to the invasion of Spain in 711: Sufetula and Gregory, the slow pace of the conquest, Byzantine weakness, and the importance of Berber resistance and recruitment. Not read in this session; its scope confirmed from the publisher's description.",
  },
  {
    key: "rla_fenwick_2020",
    title: "Early Islamic North Africa: A New Perspective",
    author: "Corisande Fenwick",
    publisher: "Bloomsbury Academic, London",
    reference: "ISBN 978-1-350-07519-1",
    sourceType: "academic_book",
    publishedYear: 2020,
    publishedDisplay: "2020",
    notes:
      "Cited for the archaeology of early Islamic Ifriqiya and the Maghreb — Kairouan, urban continuity and change, and gradual conversion — as a corrective to narratives drawn only from late Arabic chronicles. Not read in this session.",
  },
  {
    key: "rla_collins_1989",
    title: "The Arab Conquest of Spain 710–797",
    author: "Roger Collins",
    publisher: "Basil Blackwell, Oxford",
    reference: "ISBN 0-631-15923-1",
    sourceType: "academic_book",
    publishedYear: 1989,
    publishedDisplay: "1989",
    notes:
      "Cited for the critical reconstruction of 710–711 from the Chronicle of 754 and the Arabic sources, the problems with Julian/Ilyan, and the late, legendary accretions to the conquest story. Not read in this session.",
  },
  {
    key: "rla_wolf_1990",
    title: "Conquerors and Chroniclers of Early Medieval Spain",
    author: "Kenneth Baxter Wolf",
    publisher: "Liverpool University Press (Translated Texts for Historians 9)",
    sourceType: "academic_book",
    publishedYear: 1990,
    publishedDisplay: "1990 (2nd edn 1999)",
    reference: "K. B. Wolf, Conquerors and Chroniclers of Early Medieval Spain, Translated Texts for Historians 9 (Liverpool: Liverpool University Press, 1990)",
    notes:
      "Cited as the standard English translation of the Chronicle of 754, with introduction. Not read in this session; the Latin was read in Mommsen's edition.",
  },
  {
    key: "rla_hirschberg_1963",
    title: "The problem of the Judaized Berbers",
    author: "H. Z. Hirschberg",
    workTitle: "Journal of African History 4 (3)",
    reference: "pp. 313–339; DOI 10.1017/S0021853700004278",
    url: "https://doi.org/10.1017/S0021853700004278",
    sourceType: "academic_paper",
    publishedYear: 1963,
    publishedDisplay: "1963",
    notes:
      "Cited for the critique of Ibn Khaldun's statement that some Berber tribes (the Jarawa among them) professed Judaism: Hirschberg retranslated the passage, argued it refers to a time before Roman and Byzantine Christianisation, and judged the Berber conversions 'the least authenticated' of known Judaizing movements. Bibliographic details confirmed via Wikipedia; not read in this session.",
  },
  {
    key: "rla_hannoum_2001",
    title: "Colonial Histories, Post-Colonial Memories: The Legend of the Kahina, a North African Heroine",
    author: "Abdelmajid Hannoum",
    publisher: "Heinemann, Portsmouth NH (Studies in African Literature)",
    reference: "ISBN 0-325-00253-3",
    sourceType: "academic_book",
    publishedYear: 2001,
    publishedDisplay: "2001",
    notes:
      "Cited for how the Kahina legend was built up from the 9th to the 14th centuries and then reworked by French colonial writers, Algerian nationalists, Berberists and feminists. Title corrected from the user's research target ('Post-colonial memories: the legend of the Kahina'): the published title begins 'Colonial Histories, Post-Colonial Memories'. Not read in this session; title and argument confirmed via the Princeton publication record and an IJMES review notice.",
  },
  {
    key: "rla_hannoum_1997",
    title: "Historiography, mythology and memory in modern North Africa: the story of the Kahina",
    author: "Abdelmajid Hannoum",
    workTitle: "Studia Islamica 85",
    reference: "pp. 85–130; DOI 10.2307/1595873",
    url: "https://doi.org/10.2307/1595873",
    sourceType: "academic_paper",
    publishedYear: 1997,
    publishedDisplay: "1997",
    notes:
      "Cited for the colonial and nationalist uses of the Kahina: French writers casting her as a Christian or Jewish resister to the Arabs, nationalists casting her as a resister to all invaders. Not read in this session.",
  },
  {
    key: "rla_moderan_kahena",
    title: "Kahena (al-Kâhina)",
    author: "Yves Modéran",
    workTitle: "Encyclopédie berbère 27",
    reference: "pp. 4102–4111; DOI 10.4000/encyclopedieberbere.1306",
    url: "https://doi.org/10.4000/encyclopedieberbere.1306",
    sourceType: "encyclopedia",
    publishedYear: 2005,
    publishedDisplay: "2005",
    notes:
      "Cited as the most recent critical study of the sources for Dihya/the Kahina: their late date, contradictory chronology, and the likelihood that she was Christian rather than Jewish. Not read in this session; its conclusions as summarised in the Wikipedia article.",
  },
  {
    key: "rla_talbi_1971",
    title: "Un nouveau fragment de l'histoire de l'Occident musulman (62–196/682–812): l'épopée d'al-Kahina",
    author: "Mohamed Talbi",
    workTitle: "Cahiers de Tunisie 19",
    reference: "pp. 19–52",
    sourceType: "academic_paper",
    publishedYear: 1971,
    publishedDisplay: "1971",
    notes:
      "Cited for the critical chronology of Hassan ibn al-Nu'man's campaigns (entry into Ifriqiya 692/3–695; Carthage; the final campaign against the Kahina most likely 701–703) and for reading the Kahina's 'idol' as a Christian icon. Not read in this session; cited as summarised in the Wikipedia articles on the Kahina and Hassan ibn al-Nu'man.",
  },
  {
    key: "rla_moderan_kusayla",
    title: "Kusayla, l'Afrique et les Arabes",
    author: "Yves Modéran",
    workTitle: "in Identités et cultures dans l'Algérie antique",
    publisher: "Publications des Universités de Rouen et du Havre",
    reference: "ISBN 2-87775-391-3",
    sourceType: "academic_book",
    publishedYear: 2005,
    publishedDisplay: "2005",
    notes:
      "Cited for the critical reading of the late Arabic traditions about Kusaila and the Awraba: what can be said of his Christian, Romano-Moorish background, and how far his story was later shaped. Not read in this session.",
  },
  {
    key: "rla_molina_ei2_tariq",
    title: "Ṭāriḳ b. Ziyād",
    author: "Luis Molina",
    workTitle: "Encyclopaedia of Islam, 2nd edition, vol. 10",
    publisher: "Brill, Leiden",
    reference: "p. 242",
    sourceType: "encyclopedia",
    publishedYear: 2000,
    publishedDisplay: "2000",
    notes:
      "Cited for the contradictory medieval accounts of Tariq's origins (Berber of the Nafza or another tribe, Persian of Hamadan, Arab of Sadif) and for the majority modern view that he was a Berber mawla of Musa ibn Nusayr. Cited via the Wikipedia article on Tariq ibn Ziyad; not read in this session.",
  },

  // --- Encyclopaedias and Wikipedia (loaded in this session) ---------------
  {
    key: "rla_wp_tingitana",
    title: "Mauretania Tingitana",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Mauretania_Tingitana",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra, never the only source: consulted for the modern summary of the annexation and the creation of the two provinces, and for the common modern dating of the division to 42 or 44 CE.",
  },
  {
    key: "rla_wp_aballava",
    title: "Aballava",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Aballava",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the garrison history of Burgh-by-Sands and its citation of RIB 2042 for the mid-3rd-century numerus of Aurelian Moors.",
  },
  {
    key: "rla_wp_lusius",
    title: "Lusius Quietus",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Lusius_Quietus",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for Lusius Quietus' career (Dacian and Parthian wars, Judaea, death in 118) and for the modern literature on his origins (Hamdoune 2015; Vanacker 2013).",
  },
  {
    key: "rla_wp_punic",
    title: "Punic language",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Punic_language",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the survival of Punic and Neo-Punic in Roman Africa and the late-antique testimony (Augustine).",
  },
  {
    key: "rla_wp_firmus",
    title: "Firmus (4th-century usurper)",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Firmus_(4th-century_usurper)",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the dating of Firmus' revolt (372–375), his alliances (Abanni, Caprarienses, Isaflenses), his Donatist connections, and Camps' Encyclopédie berbère article on him.",
  },
  {
    key: "rla_wp_gildo",
    title: "Gildo",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Gildo",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for Gildo's career as comes Africae (from 386), his revolt and death on 31 July 398, and the comes Gildoniaci patrimonii created to manage his confiscated estates.",
  },
  {
    key: "rla_wp_mauro_roman",
    title: "Mauro-Roman Kingdom",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Mauro-Roman_Kingdom",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the transcription of the Masuna inscription, the succession of kings, and the bibliography (Camps 1984; Morizot 1989; Merrills; Hamdoune 2018).",
  },
  {
    key: "rla_wp_jedars",
    title: "Jedars",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Jedars",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the Djedars' description, epigraphy, the radiocarbon date from the coffin of Djedar B (410 ± 50, calibrated 410–615 CE at 95.4%), the 494 CE latest reused tombstone in Djedar F, and the research history (Kadra 1983; Laporte 2005; Lepelley & Salama 2006).",
  },
  {
    key: "rla_wp_masties",
    title: "Masties",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Masties",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the find (1941, Arris), the English rendering of the epitaph, and the competing datings of Masties (c. 484–494 vs. the last years of the Vandal kingdom).",
  },
  {
    key: "rla_wp_vandal_conquest",
    title: "Vandal conquest of Roman Africa",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Vandal_conquest_of_Roman_Africa",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes: "Extra: consulted for the sequence 429 crossing – 430 siege of Hippo – 435 treaty – 439 Carthage.",
  },
  {
    key: "rla_wp_exarchate",
    title: "Exarchate of Africa",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Exarchate_of_Africa",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes: "Extra: consulted for the creation of the exarchate (c. 590s), Heraclius' revolt from Carthage (608–610), and Gregory's usurpation (646/647).",
  },
  {
    key: "rla_wp_doctrina_jacobi",
    title: "Doctrina Jacobi",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Doctrina_Jacobi",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the Doctrina Jacobi nuper baptizati, a Greek dialogue set in Carthage in 634 among Jews forcibly baptised under Heraclius' decree, with an early non-Muslim reference to a prophet among the Saracens.",
  },
  {
    key: "rla_wp_sufetula",
    title: "Battle of Sufetula (647)",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Battle_of_Sufetula_(647)",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the battle (647), the fifteen-month campaign ending with withdrawal in 648, Gregory's fate in the Arabic versus Syriac traditions, and the tribute paid by his successor.",
  },
  {
    key: "rla_wp_great_mosque_kairouan",
    title: "Great Mosque of Kairouan",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Great_Mosque_of_Kairouan",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the traditional foundation by Uqba ibn Nafi in 670, the reuse of Roman and Byzantine columns and capitals, the work attributed to the governor Bishr ibn Safwan (c. 725), and the rebuilding under Ziyadat Allah I in 836, which gives the present building.",
  },
  {
    key: "rla_wp_kusaila",
    title: "Kusaila",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Kusaila",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the conflicting dates of Uqba's death at Tahuda (682 / 683) and Kusaila's death at Mamma (688), and for the critical point (after Modéran) that the earliest sources make no link between Abu al-Muhajir and Kusaila.",
  },
  {
    key: "rla_wp_kahina",
    title: "Kahina",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Kahina",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the name and title (Dihya; al-Kahina, 'the soothsayer'), the late date of the sources (al-Maliki, al-Tijani, Ibn Khaldun), the debate over her religion (Hirschberg, Talbi, Modéran), and the modern uses of her image, including the Khenchela statue. It gives 703 for her death.",
  },
  {
    key: "rla_wp_hassan",
    title: "Hassan ibn al-Nu'man",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Hassan_ibn_al-Nu%27man",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for Talbi's chronology (Hassan entering Ifriqiya in 692/3, 693/4 or 695; Byzantine recapture of Carthage 697; final capture and destruction 698; Tunis founded 699; final campaign against the Kahina 701, 702 or 703; dismissal 704).",
  },
  {
    key: "rla_wp_carthage_698",
    title: "Battle of Carthage (698)",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Battle_of_Carthage_(698)",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the sequence of Hassan's first capture, John the Patrician's recapture and the final fall in 698. It also repeats, without critical comment, that the Kahina was a 'Jewish queen' — an example of the late, debated tradition being passed on as fact.",
  },
  {
    key: "rla_wp_musa",
    title: "Musa ibn Nusayr",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Musa_ibn_Nusayr",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for Musa's governorship (dated here to 698; other reconstructions put his appointment c. 703–705), the taking of Tangier and the Sous, Berber recruitment, the reconnaissance raid at Tarifa, and the Julian story as told in Ibn Abd al-Hakam.",
  },
  {
    key: "rla_wp_tariq",
    title: "Tariq ibn Ziyad",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Tariq_ibn_Ziyad",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the landing (on or about 26 April 711), the defeat of Roderic (19 July 711), the contradictory medieval accounts of Tariq's origins (via Molina, EI2), and the note that the ship-burning story is a legend.",
  },
  {
    key: "rla_wp_chronicle_754",
    title: "Chronicle of 754",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Chronicle_of_754",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 2026-10-18",
    notes:
      "Extra: consulted for the manuscripts (the earliest of the 9th century, divided between the British Library, Egerton 1934, and the Real Academia de la Historia, Madrid), the anonymous author, and the editions (Mommsen 1894; López Pereira 2009; Wolf 1990).",
  },
];

// ---------------------------------------------------------------------------
// Pictures (all checked with the Commons helper in this session)
// ---------------------------------------------------------------------------

const P = {
  trajanCast: commonsPicture({
    fileName: "Colonne trajane 1-50 rec.jpg",
    caption:
      "Plaster cast of a scene from Trajan's Column (Museum of Roman Civilization, Rome): bareheaded riders with corkscrew curls on small unbridled horses, conventionally identified as Moorish cavalry and associated with Lusius Quietus in the Dacian wars. The identification rests on dress and style; nothing on the column names them.",
    shows: "replica",
    identificationStatus: "probable",
    licence: "Public domain",
    creator: "User:Cassius Ahenobarbus",
    institution: "Museo della Civiltà Romana, Rome (cast)",
    objectDate: "column dedicated 113 CE; cast modern",
    pixelWidth: 1102,
    pixelHeight: 779,
  }),
  notitiaBritain: commonsPicture({
    fileName: "Notitia Dignitatum - Dux Britanniarum.jpg",
    caption:
      "The page of the Notitia Dignitatum for the Dux Britanniarum (Duke of the Britains), in a late medieval copy of a Carolingian copy. The command's list of units includes a prefect of the numerus of Aurelian Moors at Aballaba; this page shows the insignia and forts, not that line itself.",
    shows: "manuscript",
    identificationStatus: "secure",
    licence: "Public domain",
    objectDate: "list compiled c. 395–420s; this copy 15th century",
    pixelWidth: 304,
    pixelHeight: 454,
  }),
  aballavaPlan: commonsPicture({
    fileName: "Kastell Aballava HW.png",
    caption:
      "Modern plan of the Roman fort of Aballava (Burgh-by-Sands) on Hadrian's Wall, drawn from excavation findings. The altar RIB 2042 of the 'unit of Aurelian Moors' (253–258 CE) and the Notitia's later entry place a Moorish unit here.",
    shows: "diagram",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Veleius",
    pixelWidth: 1104,
    pixelHeight: 1274,
  }),
  burghVillage: commonsPicture({
    fileName: "Houses at Burgh by Sands - geograph.org.uk - 1945694.jpg",
    caption:
      "Burgh-by-Sands today, built over the site of the fort of Aballava. Nothing Roman is visible in this view; the photograph is of the place, not of evidence.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.0",
    creator: "James Denham",
    objectDate: "photographed 2010",
    pixelWidth: 1024,
    pixelHeight: 576,
  }),
  ptolemyBust: commonsPicture({
    fileName: "Ptolemy of Mauretania Louvre Ma1887.jpg",
    caption:
      "Marble portrait identified as Ptolemy of Mauretania, son of Juba II and Cleopatra Selene, in the Louvre. His execution on Gaius' orders in 40 CE ended the client kingdom and opened the way to annexation.",
    shows: "portrait",
    identificationStatus: "probable",
    licence: "Public domain",
    creator: "Marie-Lan Nguyen",
    institution: "Musée du Louvre",
    accessionNumber: "Ma 1887",
    objectDate: "early 1st century CE",
    pixelWidth: 2400,
    pixelHeight: 3636,
  }),
  jubaPtolemyCoin: commonsPicture({
    fileName: "Denaro Giuba II e Tolomeo.jpg",
    caption:
      "Silver denarius of the Caesarea mint naming REX IVBA on one side and REX PTOLEMAEVS REGIS IVBAE F(ilius) on the other — the client dynasty whose end in 40 CE brought Mauretania under direct Roman rule.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.5",
    creator: "Classical Numismatic Group",
    objectDate: "c. 20s CE",
    pixelWidth: 800,
    pixelHeight: 395,
  }),
  mapAfricaKiepert: commonsPicture({
    fileName: "Mauretania et Numidia.jpg",
    caption:
      "Nineteenth-century historical map of Roman Mauretania and Numidia, showing the provinces Rome created out of the Mauretanian kingdom. A later scholarly reconstruction, not an ancient map.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "Public domain",
    pixelWidth: 3509,
    pixelHeight: 1383,
  }),
  ghorfa: commonsPicture({
    fileName: "Bardo Stèles Ghorfa.JPG",
    caption:
      "The 'La Ghorfa' stelae in the Bardo Museum, Tunis: Roman-period votive stelae from the Maktar region that combine a Punic religious tradition (the sign of Tanit, the cult descended from Baal Hammon) with Roman architectural frames and dress.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY 3.0",
    creator: "Pradigue",
    institution: "Musée national du Bardo, Tunis",
    objectDate: "Roman imperial period",
    pixelWidth: 1280,
    pixelHeight: 960,
  }),
  saturnStele: commonsPicture({
    fileName: "Dedication to Saturnus (CIL VIII 20433), from Beni Fouda near Djemila, Musée national des Antiquités, Algiers, Algeria.jpg",
    caption:
      "Stele dedicated to Saturnus Augustus by the priest Q. Caelius Felix (CIL VIII 20433), from Beni Fouda near Djemila: Saturn, veiled and bearded, in the top register. African Saturn is the Roman-period form of the Punic Baal Hammon.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.0",
    creator: "Following Hadrian",
    institution: "Musée national des Antiquités, Algiers",
    accessionNumber: "CIL VIII 20433",
    objectDate: "2nd–3rd century CE",
    pixelWidth: 3147,
    pixelHeight: 6016,
  }),
  diiMauri: commonsPicture({
    fileName: "Chimtou, Felsrelief der Dii Mauri.jpg",
    caption:
      "Rock relief at Chemtou (Simitthus), Tunisia, identified on its Commons record as a relief of the Dii Mauri, the 'Moorish gods' honoured in Latin dedications by soldiers and officials. Good for the subject; the identification here is the file's, not checked against a publication.",
    shows: "site",
    identificationStatus: "probable",
    licence: "CC BY-SA 3.0",
    creator: "Daniela Gauss",
    objectDate: "Roman period",
    pixelWidth: 787,
    pixelHeight: 527,
  }),
  lepcisBilingual: commonsPicture({
    fileName: "Inscription Theatre Leptis Magna Libya.JPG",
    caption:
      "The Latin dedication (IRT 321) at the theatre of Lepcis Magna, set up in 1–2 CE by Annobal Rufus, a local magnate with a Punic name, who also put up a Neo-Punic version: public bilingualism a century before the period of this record.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Papageizichta",
    objectDate: "1–2 CE",
    pixelWidth: 3872,
    pixelHeight: 2592,
  }),
  severanTondo: commonsPicture({
    fileName: "Severan dynasty - tondo.jpg",
    caption:
      "The Severan Tondo (Berlin), a painted wooden panel from Egypt of c. 200 CE: Septimius Severus of Lepcis Magna, Julia Domna, Caracalla and the erased face of Geta. The first emperor born in Africa, from a family of Punic descent.",
    shows: "portrait",
    identificationStatus: "secure",
    licence: "Public domain",
    institution: "Antikensammlung, Staatliche Museen zu Berlin",
    objectDate: "c. 200 CE",
    pixelWidth: 1069,
    pixelHeight: 1087,
  }),
  apuleiusContorniate: commonsPicture({
    fileName: "Apuleius-Kontorniat-2.jpg",
    caption:
      "UNVERIFIED — a late-antique contorniate (commemorative medallion, 4th–5th century) inscribed with Apuleius' name, from a 19th-century publication. It is not a portrait from life: made two centuries after him, it shows how Apuleius was remembered, not what he looked like.",
    shows: "artefact",
    identificationStatus: "unverified",
    licence: "Public domain",
    creator: "Johann Jakob Bernoulli (publication)",
    objectDate: "4th–5th century CE",
    pixelWidth: 1300,
    pixelHeight: 1300,
  }),
  dioceseMap: commonsPicture({
    fileName: "Diocese of Africa - AD 400.png",
    caption:
      "Modern map of the Roman diocese of Africa around 400 CE, with its provinces from Tripolitania to the Mauretanias — the territory over which Firmus and then Gildo held sway.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "Public domain",
    creator: "Cplakidas; derivative by Jbribeiro1",
    pixelWidth: 1697,
    pixelHeight: 1175,
  }),
  corbita: commonsPicture({
    fileName: "Corbita BM GR1850.3-4.32.jpg",
    caption:
      "Relief of a man sailing a small merchant ship, found at Carthage, c. 200 CE (British Museum). African grain shipped to Rome is what gave Gildo his leverage over the western court in 397.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "Public domain",
    institution: "British Museum",
    accessionNumber: "1850,0304.32",
    objectDate: "c. 200 CE",
    pixelWidth: 2400,
    pixelHeight: 1375,
  }),
  ammianus1533: commonsPicture({
    fileName: "Ammianus Marcellinus 1533.jpg",
    caption:
      "Title page of Accursius' 1533 Augsburg printed edition of Ammianus Marcellinus, whose Book 29 is the near-contemporary account of the revolt of Firmus.",
    shows: "historical_document",
    identificationStatus: "secure",
    licence: "Public domain",
    objectDate: "1533",
    pixelWidth: 409,
    pixelHeight: 586,
  }),
  vandalRider: commonsPicture({
    fileName: "Vandal cavalryman, c. AD 500, from a mosaic pavement at Bordj Djedid near Carthage.jpg",
    caption:
      "Mosaic of a horseman leaving a walled villa, from Bordj Djedid near Carthage, late 5th–early 6th century (British Museum). Often called a 'Vandal' rider; the museum's own label allows 'Vandal or late Roman'.",
    shows: "artefact",
    identificationStatus: "possible",
    licence: "Public domain",
    institution: "British Museum",
    objectDate: "late 5th–early 6th century CE",
    pixelWidth: 750,
    pixelHeight: 545,
  }),
  gelimerCoin: commonsPicture({
    fileName: "AR 50 Denarii - Vandals - Gelimer - Carthage.jpg",
    caption:
      "Silver coin of 50 denarii struck at Carthage by Gelimer, last king of the Vandals (530–534), inscribed D N REX GEILAMIR: the Vandal kings struck coins in Latin in the Roman manner.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "DrFO.Jr.Tn",
    objectDate: "530–534 CE",
    pixelWidth: 500,
    pixelHeight: 252,
  }),
  vandalMap533: commonsPicture({
    fileName: "Vandals and North Africa 533.png",
    caption:
      "Modern map of North Africa on the eve of 533, showing the Vandal kingdom and the independent Moorish kingdoms around it (Altava, the Aurès, the Ouarsenis and others), drawn from Procopius, Courtois and Merrills. Boundaries are reconstructions.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "CC0",
    creator: "Whatever748",
    pixelWidth: 1797,
    pixelHeight: 1338,
  }),
  masunaInscription: commonsPicture({
    fileName: "Inscription that refers to king Masuna.png",
    caption:
      "UNVERIFIED — image filed on Commons as the Altava inscription of King Masuna (508 CE), with an unknown author and no museum or publication named. Whether this is a photograph or drawing of the actual stone could not be checked; the text of the inscription is cited separately.",
    shows: "unverified_image",
    identificationStatus: "unverified",
    licence: "CC BY 4.0",
    objectDate: "inscription 508 CE",
    pixelWidth: 1248,
    pixelHeight: 482,
  }),
  mastiesInscription: commonsPicture({
    fileName: "Inscription de Masties.jpg",
    caption:
      "The epitaph of Masties from Arris in the Aurès (AE 1945, 97), photographed for the Centre Camille Jullian: Masties calls himself dux and imperator and says he kept faith with both Romans and Moors.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Centre Camille Jullian, CNRS, Aix-en-Provence",
    institution: "Musée national des Antiquités, Algiers",
    accessionNumber: "AE 1945, 97",
    objectDate: "late 5th or early 6th century CE",
    pixelWidth: 1367,
    pixelHeight: 951,
  }),
  djedarView: commonsPicture({
    fileName: "Djeddar Monuments funéraires à Frenda wilaya de Tiaret 14.jpg",
    caption:
      "One of the Djedars near Frenda (Tiaret province, Algeria): a ruined square stepped mausoleum of late antiquity, one of thirteen built for an unnamed Moorish ruling dynasty between roughly the 5th and 7th centuries.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Mus52",
    objectDate: "monument 5th–7th century CE; photographed 2014",
    pixelWidth: 3696,
    pixelHeight: 2448,
  }),
  djedarF: commonsPicture({
    fileName: "Djedar F - Chi-Rho and rosette at the entrance to the gallery.jpg",
    caption:
      "Chi-Rho and hexafoil rosette carved at the entrance to the gallery of Djedar F, from F. Kadra's documentation: Christian symbols on a monument Gabriel Camps attributed to King Garmul or his dynasty — an attribution, not a reading of any name.",
    shows: "excavation_context",
    identificationStatus: "secure",
    licence: "CC BY 4.0",
    creator: "F. Kadra",
    objectDate: "6th–7th century CE",
    pixelWidth: 580,
    pixelHeight: 408,
  }),
  kingdomsMap: commonsPicture({
    fileName: "Map depicting the Romano-Berber Kingdoms.png",
    caption:
      "Modern map, after Courtois (1955) as reproduced by Merrills (2004), of the Romano-Moorish states that emerged in the 5th and 6th centuries. A scholarly reconstruction; the frontiers of these kingdoms are not documented.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "CC BY-SA 4.0",
    creator: "LeGabrie",
    pixelWidth: 900,
    pixelHeight: 662,
  }),
  sanVitale: commonsPicture({
    fileName: "Meister von San Vitale in Ravenna 013.jpg",
    caption:
      "The Justinian panel in San Vitale, Ravenna (before 547): the emperor whose general Belisarius ended the Vandal kingdom in 533–534. The bearded figure at the emperor's right is often identified as Belisarius; that identification is not secure.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "Public domain",
    institution: "Basilica of San Vitale, Ravenna",
    objectDate: "before 547 CE",
    pixelWidth: 1576,
    pixelHeight: 1888,
  }),
  haidra: commonsPicture({
    fileName: "Citadelle de Haidra.jpg",
    caption:
      "The Byzantine citadel at Haidra (Ammaedara), Tunisia, rebuilt under Justinian: one of the forts Solomon and his successors built to hold the provinces against Moorish coalitions.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Youssefbensaad",
    objectDate: "6th century CE; photographed 2018",
    pixelWidth: 3648,
    pixelHeight: 2736,
  }),
  tebessa: commonsPicture({
    fileName: "Tébessa.4.jpg",
    caption:
      "The Byzantine walls of Theveste (Tébessa, Algeria) beside the earlier Arch of Caracalla. Procopius credits Solomon with fortifying the city in the 530s.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Michel-georges bernard",
    objectDate: "6th century CE; photographed 1975",
    pixelWidth: 1142,
    pixelHeight: 880,
  }),
  byzMaghrebMap: commonsPicture({
    fileName: "Byzantine Maghreb.png",
    caption:
      "Modern map comparing the extent of Vandal Africa with the areas the Byzantines reconquered after 533. A reconstruction; inland frontiers were contested with Moorish rulers throughout.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "CC BY-SA 4.0",
    creator: "Antisyntagmatarchos",
    pixelWidth: 935,
    pixelHeight: 628,
  }),
  gelimerLitho: commonsPicture({
    fileName: "Gelimer-surrenders-to-belisarius.jpg",
    caption:
      "Belisarius presents the captive Vandal king Gelimer to Justinian and Theodora: a 19th-century lithograph by Peter Johann Nepomuk Geiger (1840), an imagined scene, not a record of the triumph of 534.",
    shows: "later_artwork",
    identificationStatus: "modern_interpretation",
    licence: "Public domain",
    creator: "Peter Johann Nepomuk Geiger",
    objectDate: "1840",
    pixelWidth: 812,
    pixelHeight: 1200,
  }),
  naroMosaic: commonsPicture({
    fileName: "Mosaïque de la sainte synagogue de Naro de la synagogue d'Hammam Lif - BardoNationalMuseum 36.jpg",
    caption:
      "Mosaic inscription from the synagogue of Naro (Hammam Lif, Tunisia), 6th century, now in the Bardo: direct evidence of an organised Jewish community in Byzantine Africa, its dedications written in Latin.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Ovva olfa",
    institution: "Musée national du Bardo, Tunis",
    objectDate: "6th century CE",
    pixelWidth: 1152,
    pixelHeight: 768,
  }),
  naroPalm: commonsPicture({
    fileName: "Date Palm Tree, Hammam Lif, Tunisia, 6th century AD, mosaic of stone, mortar - Brooklyn Museum - Brooklyn, NY - DSC08250.JPG",
    caption:
      "A date-palm panel from the same Hammam Lif (Naro) synagogue floor, now in the Brooklyn Museum: the synagogue's mosaics are divided between Tunis and New York.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Daderot",
    institution: "Brooklyn Museum",
    objectDate: "6th century CE",
    pixelWidth: 3648,
    pixelHeight: 5472,
  }),
  doctrinaJacobi: commonsPicture({
    fileName: "François Nau edition of Doctrina Jacobi, 1907 (cropped).jpg",
    caption:
      "First page of François Nau's 1907 edition of the Greek Doctrina Jacobi, a dialogue set in Carthage in 634 among Jews forcibly baptised under Heraclius' decree — a printed edition, not the manuscript.",
    shows: "historical_document",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "François Nau (editor)",
    objectDate: "1907 edition of a 7th-century text",
    pixelWidth: 1871,
    pixelHeight: 2323,
  }),
  exarchateMap: commonsPicture({
    fileName: "Exarchat von Karthago.jpg",
    caption:
      "Modern map of Byzantine North Africa, 533–698 (the exarchate of Carthage). A reconstruction for orientation; Moorish polities held much of the interior.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "Public domain",
    creator: "Antisyntagmatarchos",
    pixelWidth: 1324,
    pixelHeight: 852,
  }),
  sbeitlaTemples: commonsPicture({
    fileName: "SUF - Capitoline temples of Sufetula, Sbeitla, Tunisia, 2023.jpg",
    caption:
      "The three Capitoline temples of Sufetula (Sbeitla, Tunisia), a Roman town that Gregory the Patrician made his base in 647 and near which the Arab army under Abd Allah ibn Sa'd defeated him.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Josep M. Gracia",
    objectDate: "2nd century CE; photographed 2023",
    pixelWidth: 4229,
    pixelHeight: 2809,
  }),
  sbeitlaFort: commonsPicture({
    fileName: "Sbeitla Byzantine Fort.jpg",
    caption:
      "A Byzantine fort among the ruins of Sufetula: the town had been fortified in the 6th–7th centuries, the defensive landscape Gregory's army was fighting from.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.0",
    creator: "Dennis G. Jarvis",
    objectDate: "6th–7th century CE; photographed 2012",
    pixelWidth: 4288,
    pixelHeight: 2848,
  }),
  byzacenaMap: commonsPicture({
    fileName: "Map of Byzacena.png",
    caption:
      "Modern map of the late Roman and Byzantine province of Byzacena, with Hadrumetum as capital and Sufetula in the interior — the province the first Arab raids of 647 entered.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "CC BY-SA 4.0",
    creator: "Grassfuel",
    pixelWidth: 1288,
    pixelHeight: 1438,
  }),
  kairouanPanorama: commonsPicture({
    fileName: "Great Mosque of Kairouan Panorama - Grande Mosquée de Kairouan Panorama.jpg",
    caption:
      "The Great Mosque of Kairouan today. Tradition places Uqba ibn Nafi's first mosque on this site in 670, but what stands is essentially the Aghlabid rebuilding of 836 and later work; nothing visible can be dated to Uqba.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.0",
    creator: "Marek Szarejko",
    objectDate: "mostly 9th century CE; photographed 2008",
    pixelWidth: 1024,
    pixelHeight: 709,
  }),
  kairouanCapitals: commonsPicture({
    fileName: "Ancient capitals, Great Mosque of Kairouan, Tunisia.jpg",
    caption:
      "Roman and Byzantine capitals reused in the prayer hall of the Great Mosque of Kairouan: the material continuity between the Christian cities of Africa and the new Muslim foundation.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.0",
    creator: "Kai Schreiber",
    objectDate: "capitals 2nd–6th century, reused 9th century",
    pixelWidth: 3888,
    pixelHeight: 2592,
  }),
  kairouanInscription: commonsPicture({
    fileName: "Kairouan great mosque inscription.jpg",
    caption:
      "A Latin inscription of the reign of Septimius Severus (CIL VIII 80 = 11218) built into the minaret of the Great Mosque of Kairouan — Roman stone carried in and reused by the builders of the mosque.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY 2.0",
    creator: "damian entwistle",
    accessionNumber: "CIL VIII 80 = CIL VIII 11218",
    objectDate: "inscription c. 200 CE; reused 8th–9th century",
    pixelWidth: 2816,
    pixelHeight: 2112,
  }),
  sidiOkba: commonsPicture({
    fileName: "Mausoleum of Uqba ibn Nafi 02.jpg",
    caption:
      "The shrine venerated as the tomb of Uqba ibn Nafi in the Sidi Okba mosque near Biskra, Algeria, close to where he was killed at Tahuda in 682/683. That he lies here is local tradition; the present building is much later.",
    shows: "site",
    identificationStatus: "probable",
    licence: "CC BY 4.0",
    creator: "Bernard Gagnon",
    objectDate: "photographed 2025",
    pixelWidth: 3383,
    pixelHeight: 2255,
  }),
  thouda: commonsPicture({
    fileName: "The ruins of THOUDA Biskra Algeria 04.jpg",
    caption:
      "Stone ruins at the oasis beside the village of Sidi Okba, identified with the late Roman town of Thabudeos/Tahuda, near which Kusaila's forces ambushed and killed Uqba ibn Nafi.",
    shows: "site",
    identificationStatus: "probable",
    licence: "CC BY-SA 4.0",
    creator: "Hydrosami",
    objectDate: "photographed 2016",
    pixelWidth: 5312,
    pixelHeight: 2988,
  }),
  aksilStatue: commonsPicture({
    fileName: "Aksil-el-hamma-khenchela.jpg",
    caption:
      "Modern statue of Aksil (Kusaila) at El Hamma, Khenchela, Algeria, put up in the 21st century: an expression of present-day Amazigh memory, not a likeness — no image of Kusaila survives.",
    shows: "later_artwork",
    identificationStatus: "modern_interpretation",
    licence: "CC BY-SA 4.0",
    creator: "Jubafighter",
    objectDate: "21st century; photographed 2024",
    pixelWidth: 573,
    pixelHeight: 1024,
  }),
  dihyaStatue: commonsPicture({
    fileName: "Statue of Dyhia in Khenchela (Algeria).jpg",
    caption:
      "Modern statue of Dihya ('La Kahena') in central Khenchela, Algeria: a 21st-century monument and an artist's imagining, not a portrait. It stands for the modern uses of her memory the record describes.",
    shows: "later_artwork",
    identificationStatus: "modern_interpretation",
    licence: "CC BY-SA 1.0",
    creator: "Numide05; derivative by Ghezaltar",
    objectDate: "modern statue; photographed 2009",
    pixelWidth: 738,
    pixelHeight: 1344,
  }),
  auresLandscape: commonsPicture({
    fileName: "Entrée des aouras par le sud.jpg",
    caption:
      "The southern edge of the Aurès massif near Thaghit, Algeria: the mountain country Procopius describes as independent of the Vandals and that the Arabic sources make Dihya's home.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Superazzouz123",
    objectDate: "photographed 2014",
    pixelWidth: 5184,
    pixelHeight: 3456,
  }),
  dihyaFortress: commonsPicture({
    fileName: "Aurès Algeria, Queen Dihya fortress 7th C.jpg",
    caption:
      "UNVERIFIED — ruined stone walls in the Aurès, filed on Commons as 'Queen Dihya fortress, 7th century'. No archaeological study links this structure to Dihya and its date is not established; it shows a ruin in the Khenchela area, nothing more.",
    shows: "unverified_image",
    identificationStatus: "unverified",
    licence: "CC BY-SA 4.0",
    creator: "Kallilus",
    objectDate: "photographed 2018",
    pixelWidth: 638,
    pixelHeight: 960,
  }),
  elDjem: commonsPicture({
    fileName: "El Djem Amphitheater aerial view.jpg",
    caption:
      "The amphitheatre of Thysdrus (El Djem), Tunisia. Late Arabic traditions say the Kahina fortified herself here; the story is told centuries after the event.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Hp.Baumeler",
    objectDate: "3rd century CE; photographed 1986",
    pixelWidth: 3107,
    pixelHeight: 1705,
  }),
  carthageBaths: commonsPicture({
    fileName: "01996 Ruins of Antonine Baths at Carthage.jpg",
    caption:
      "The ruins of the Antonine Baths at Carthage. The city Hassan ibn al-Nu'man took and destroyed in 698 was the Roman and Byzantine Carthage these ruins belong to; its stone was later carried off for Tunis, Kairouan and beyond.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Silar",
    objectDate: "2nd century CE; photographed 1996",
    pixelWidth: 2399,
    pixelHeight: 1599,
  }),
  carthageMap: commonsPicture({
    fileName: "Carthage archaeological sites map-fr.svg",
    caption:
      "Modern map (in French) of the archaeological sites of Carthage, including the ports where John the Patrician's fleet forced its way in in 697.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "CC BY-SA 4.0",
    creator: "Eric Gaba",
    pixelWidth: 1030,
    pixelHeight: 880,
  }),
  conquestMap: commonsPicture({
    fileName: "Muslim conquest of the Maghreb.png",
    caption:
      "Modern map of the final Umayyad conquest of the Maghreb under Hassan ibn al-Nu'man and Musa ibn Nusayr, with battles, routes and Berber kingdoms. A reconstruction from late sources.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "CC BY-SA 4.0",
    creator: "Cattette",
    pixelWidth: 3742,
    pixelHeight: 1247,
  }),
  ceuta: commonsPicture({
    fileName: "Monte Hacho (Ceuta).jpg",
    caption:
      "Monte Hacho at Ceuta, ancient Septem: the Byzantine-held outpost on the African side of the Strait whose lord (Julian in Latin, Ilyan in Arabic) the traditions say helped Tariq across.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "CarlosVdeHabsburgo",
    objectDate: "photographed 2019",
    pixelWidth: 3962,
    pixelHeight: 2536,
  }),
  tangierBay: commonsPicture({
    fileName: "Bay of Tangier.jpg",
    caption: "The bay of Tangier (Tingis), the city Musa ibn Nusayr took and placed under Tariq ibn Ziyad's command before 711.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.0",
    creator: "Chris Yunker",
    objectDate: "photographed 2008",
    pixelWidth: 1536,
    pixelHeight: 1024,
  }),
  dinar716: commonsPicture({
    fileName: "Arabic-Latin Umayyad dinar from Spain, 715-717 AD.jpg",
    caption:
      "A bilingual gold coin struck in al-Andalus, dated AH 98 (716–717): a Latin legend naming Spania on one side, the Arabic profession of faith on the other — the conquest's two languages on one coin.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.5",
    creator: "Classical Numismatic Group",
    objectDate: "716–717 CE",
    pixelWidth: 500,
    pixelHeight: 223,
  }),
  gibraltar: commonsPicture({
    fileName: "View of the Rock of Gibraltar from the Strait.jpg",
    caption:
      "The Rock of Gibraltar seen from the Strait. Its name comes from Arabic Jabal Tariq, 'Tariq's mountain'; Ibn Abd al-Hakam already calls it 'the mountain of Tarik' in the 9th century.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 2.0",
    creator: "rob Stoeltje",
    objectDate: "photographed 2012",
    pixelWidth: 4592,
    pixelHeight: 2549,
  }),
  chronicle754: commonsPicture({
    fileName: "Chronicle of 754, London, Egerton 1934, fol. 2r.jpg",
    caption:
      "A page of the Chronicle of 754 in British Library MS Egerton 1934, written in Visigothic script, the earliest surviving manuscript of the text. The chronicle calls Tariq's army 'Mauri' sent by Musa.",
    shows: "manuscript",
    identificationStatus: "secure",
    licence: "Public domain",
    institution: "British Library",
    accessionNumber: "Egerton MS 1934, fol. 2r",
    objectDate: "8th or 9th century CE",
    pixelWidth: 2383,
    pixelHeight: 3262,
  }),
  straitView: commonsPicture({
    fileName: "Vue sur les côtes africaines depuis le belvédère du détroit.jpg",
    caption:
      "The African coast seen from the Spanish side of the Strait, less than 15 km away: the crossing Tariq's men made in borrowed ships in 711, and Carthaginian armies before them.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 2.0",
    creator: "Nicolas Vollmer",
    objectDate: "photographed 2012",
    pixelWidth: 3932,
    pixelHeight: 2502,
  }),
  tariqManuscript: commonsPicture({
    fileName: "Ṭāriq b. Ziyād, the conqueror of Andalousia, opening a treasure, folio 162r. Aja'ib al-Makhluqat. 1388, Baghdad (BNF, Sup. Pers. 332).jpg",
    caption:
      "Tariq ibn Ziyad opening a treasure, a painting in a Persian copy of the 'Aja'ib al-Makhluqat made in Baghdad in 1388 (BnF Suppl. persan 332): a late medieval illustration of a wonder-tale about him, made almost seven centuries later, not a portrait.",
    shows: "later_artwork",
    identificationStatus: "modern_interpretation",
    licence: "Public domain",
    institution: "Bibliothèque nationale de France",
    accessionNumber: "Supplément persan 332, fol. 162r",
    objectDate: "1388",
    pixelWidth: 1023,
    pixelHeight: 1566,
  }),
  guadalete: commonsPicture({
    fileName: "The battle of Guadelete.jpg",
    caption:
      "The battle of Guadalete as imagined by the Spanish painter Salvador Martínez Cubells (1845–1914): a 19th-century history painting made some twelve centuries after the event.",
    shows: "later_artwork",
    identificationStatus: "modern_interpretation",
    licence: "Public domain",
    creator: "Salvador Martínez Cubells",
    objectDate: "late 19th century",
    pixelWidth: 2832,
    pixelHeight: 2088,
  }),
};

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

const R = (lane: "roman" | "medieval") => MOORS_LANES[lane];

const events: SeedEvent[] = [
  // =========================================================================
  {
    slug: "roman-annexation-of-mauretania",
    title: "Rome annexes Mauretania (40–44 CE)",
    summary:
      "After Caligula had King Ptolemy of Mauretania killed in 40 CE, a war with his former subjects followed and Claudius turned the kingdom into two Roman provinces, Mauretania Tingitana and Mauretania Caesariensis.",
    description:
      "WHAT HAPPENED. Mauretania had been a client kingdom under Juba II and then his son Ptolemy, grandson of Mark Antony and Cleopatra. In 40 CE the emperor Gaius (Caligula) summoned Ptolemy and had him killed — for his wealth, says Cassius Dio; out of jealousy of his purple cloak, says Suetonius. Pliny, writing a generation later, says Roman arms first fought in Mauretania when 'the freedman Aedemon' took up arms to avenge his king, and that Roman troops pursued the 'routed natives' as far as the Atlas. Dio puts the main fighting in 41–42: Suetonius Paulinus overran the country as far as Mount Atlas — Pliny has him the first Roman commander to cross it — and Gnaeus Hosidius Geta pursued a leader called Salabus into the desert. Claudius then divided 'the subject Moors' into two provinces named after Tingis and Caesarea, each under an equestrian governor.\n\n" +
      "INDIGENOUS RESPONSES WERE NOT ONE THING. Some of Ptolemy's former subjects fought; others fought for Rome. An inscription from Volubilis honours a local magistrate, M. Valerius Severus, for commanding auxiliaries against Aedemon, and the town was rewarded with Roman municipal status. Vanacker (2013) argues that the same Mauretanian networks produced both resistance and cooperation — the family of Lusius Quietus, later Trajan's cavalry general, may have been rewarded with citizenship in this war.\n\n" +
      "HOW IT IS DATED. Ptolemy's death in 40 is secure from Dio's year-by-year narrative. Later Mauretanian inscriptions count years from an era of the province beginning in 40 — Masuna's inscription of 508 is dated 'year 469 of the province' — so the provincial administration itself reckoned from Ptolemy's death. Dio places the division into two provinces in the consular year 42; many modern summaries give 42 or 44 for the full organisation, after the war had ended.\n\n" +
      "WHAT IT DOES NOT SHOW. 'Mauri' here is the Roman name for the peoples of the kingdom; it says nothing about their ancestry. The war is told only from the Roman side, and its scale is unknown.\n\n" +
      "CORRECTION TO THE RESEARCH TARGET. The target cited 'Pliny NH 5.11–16' and 'Dio 60.8–9'; the passages are Pliny 5.11 (Aedemon) and 5.14 (Paulinus crossing the Atlas) and Dio 59.25.1, 60.8.6 and 60.9.1–5. Dio dates the division to 42, so '42/44' is kept as two claims rather than one.",
    category: "history",
    subcategory: R("roman"),
    eventType: "historical",
    tags: laneTags("roman", "mauretania", "mauri", "roman-provinces", "claudius", "caligula", "aedemon"),
    people: ["Ptolemy of Mauretania", "Gaius (Caligula)", "Claudius", "Aedemon", "Gaius Suetonius Paulinus", "Gnaeus Hosidius Geta", "Salabus", "Marcus Valerius Severus"],
    civilisations: ["Mauretania", "Rome", "Roman Empire", "Amazigh peoples"],
    locationName: "Mauretania (the kingdom's capital Iol Caesarea, modern Cherchell, Algeria)",
    lat: 36.607,
    lng: 2.19,
    identificationStatus: "secure",
    media: [P.ptolemyBust, P.jubaPtolemyCoin, P.mapAfricaKiepert],
    claims: [
      {
        sourceKey: "rla_dio_cary_7",
        citations: [
          { sourceKey: "rla_suetonius_caligula", relation: "supports", note: "A second ancient account of Ptolemy's execution under Gaius, giving jealousy over a purple cloak as the motive where Dio gives his wealth." },
          { sourceKey: "rla_pliny_nh5", relation: "supports", note: "Pliny 5.11 links the first Roman war in Mauretania directly to Ptolemy's killing and Aedemon's attempt to avenge him." },
          { sourceKey: "rla_wp_tingitana", relation: "context", note: "Modern summary of the annexation, used only as an extra." },
        ],
        startYear: 40,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Gaius sent for Ptolemy, the son of Juba, and on learning that he was wealthy put him to death",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "The execution of Ptolemy, which ended the client kingdom",
        evidence:
          "Dio's annalistic narrative places the summons and execution of Ptolemy among the events of 40 CE (59.25.1, read in Cary's translation). Suetonius agrees on the reign and the fact, disagrees on the motive. No source gives the month.",
      },
      {
        sourceKey: "rla_dio_cary_7",
        citations: [
          { sourceKey: "rla_pliny_nh5", relation: "supports", note: "Pliny 5.14 confirms Suetonius Paulinus' expedition across the Atlas, and 5.11 the pursuit of the rebels to the mountains." },
          { sourceKey: "rla_vanacker_2013", relation: "context", note: "Discusses the indigenous actors — Aedemon, the Baquates, the family of Lusius Quietus — on both sides of the war." },
          { sourceKey: "rla_wp_tingitana", relation: "context", note: "Gives the common modern dating of the provincial division (42 or 44)." },
        ],
        startYear: 42,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Claudius divided the subject Moors into two groups, those around Tingis and those around Caesarea (Dio 60.9.5, consular year 42)",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The division into the provinces of Mauretania Tingitana and Caesariensis",
        evidence:
          "Dio narrates the campaigns of Paulinus and Geta and then the division into two provinces under two equestrian governors, in the year when Claudius was consul with Gaius Largus (42 CE). This is a paraphrase of Cary's translation.",
      },
      {
        sourceKey: "rla_wp_tingitana",
        citations: [
          { sourceKey: "rla_dio_cary_7", relation: "context", note: "Dio's dating to 42 is the ancient basis; the later date reflects the end of the fighting rather than a different ancient statement." },
          { sourceKey: "rla_vanacker_2013", relation: "context", note: "Modern scholarship on the war's duration and the local actors." },
        ],
        startYear: 42,
        endYear: 44,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "provinces organised 42–44 CE (modern summaries)",
        datingMethod: "estimate",
        chronology: "alternative",
        whatIsDated: "The completed organisation of the two provinces",
        evidence:
          "Modern summaries often give 44 CE for the annexation's completion, after the end of the revolt. This is a modern estimate of when the provincial order was in place, not a second ancient date; it is kept as its own claim so that '42/44' is not flattened into one number.",
      },
      {
        sourceKey: "rla_masuna_inscription",
        citations: [
          { sourceKey: "rla_camps_1984", relation: "context", note: "Uses the provincial era to date the Mauretanian royal inscriptions." },
          { sourceKey: "rla_wp_mauro_roman", relation: "context", note: "Transcription of the Masuna inscription ending in the provincial year." },
        ],
        startYear: 40,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "anno provinciae — the Mauretanian provincial era counted from 40 CE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        whatIsDated: "The starting point Mauretanian inscriptions used for the province",
        evidence:
          "Inscriptions of Roman and post-Roman Mauretania date themselves by 'the year of the province'. The arithmetic works only if year 1 is 40 CE: Masuna's 'year 469' is 508 CE. The provincial system thus dated itself from Ptolemy's death, not from the formal division.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "mauri-cavalry-in-the-roman-army",
    title: "Moorish cavalry in the Roman army (2nd–4th centuries)",
    summary:
      "From Trajan's Dacian wars to Hadrian's Wall, horsemen and units recruited from the Mauri served across the Empire; their commander Lusius Quietus rose to the consulship.",
    description:
      "WHAT THE EVIDENCE IS. Three kinds of evidence, of very different weight. First, a historian: Cassius Dio (68.32) says Lusius Quietus 'was a Moor and likewise ranked as a leader of the Moors and as commander of a troop in the cavalry'; dismissed in disgrace, he came of his own accord to Trajan 'when the Dacian war came on and Trajan needed the assistance of the Moors', did great deeds, and rose to praetorian and consular rank and the governorship of Palestine. He crushed the Jewish revolt in Mesopotamia in 116–117 (the rabbinic 'war of Kitos' preserves his name) and was killed in 118 at the start of Hadrian's reign.\n\n" +
      "Second, an image: a scene on Trajan's Column (scene LXIV in Cichorius' numbering) shows bareheaded riders with corkscrew curls on small horses with neither saddle nor bridle. Since the 19th century they have been read as Moorish cavalry and linked to Quietus. The identification is a good one — it fits Strabo's and others' descriptions of Mauri riding without bridles — but it is an interpretation of costume; nothing on the column names them.\n\n" +
      "Third, inscriptions: at Aballava (Burgh-by-Sands), on Hadrian's Wall, an altar (RIB 2042) was dedicated by the 'unit of Aurelian Moors, Valerian's and Gallienus' own', datable to 253–258. The late-Roman Notitia Dignitatum still lists a 'prefect of the numerus of Aurelian Moors' at Aballaba under the Duke of the Britains. The Notitia also lists many cavalry units called equites Mauri in the eastern and western field armies.\n\n" +
      "WHAT IT DOES NOT SHOW. A unit's name records where it was first raised. After a generation or two its soldiers were recruited wherever it was stationed, so a 'numerus Maurorum' in Cumbria in the 250s does not mean its men were born in Africa. The record is about service under a Moorish label, not about the ancestry of anyone in Britain.\n\n" +
      "CORRECTION TO THE RESEARCH TARGET. The target framed this as 100–300 CE. The direct evidence runs from the Dacian wars (101–106) to the Notitia (late 4th–early 5th century), so the record is dated by its three kinds of evidence rather than by one span.",
    category: "history",
    subcategory: R("roman"),
    eventType: "historical",
    tags: laneTags("roman", "mauri", "roman-army", "cavalry", "trajans-column", "hadrians-wall", "lusius-quietus"),
    people: ["Lusius Quietus", "Trajan", "Hadrian", "Valerian", "Gallienus"],
    civilisations: ["Roman Empire", "Mauretania", "Amazigh peoples"],
    locationName: "Aballava (Burgh-by-Sands, Cumbria) and the Danube front",
    lat: 54.922,
    lng: -3.05,
    identificationStatus: "secure",
    media: [P.trajanCast, P.aballavaPlan, P.notitiaBritain, P.burghVillage],
    claims: [
      {
        sourceKey: "rla_dio_cary_8",
        citations: [
          { sourceKey: "rla_lepper_frere_1988", relation: "supports", note: "The standard reading of the column's Moorish-cavalry scene, which most commentators associate with Quietus' men." },
          { sourceKey: "rla_hamdoune_2015", relation: "context", note: "Reviews the modern debate on Quietus' origins; Dio's 'Moor' remains the only ancient statement." },
          { sourceKey: "rla_wp_lusius", relation: "context", note: "Extra summary of his career and death in 118." },
          { sourceKey: "rla_brett_fentress_1996", relation: "context", note: "Places Quietus within the wider pattern of Mauri recruited by Rome." },
        ],
        startYear: 101,
        endYear: 106,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "when the Dacian war came on and Trajan needed the assistance of the Moors, he came to him of his own accord",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "Moorish cavalry under Lusius Quietus in Trajan's Dacian wars",
        evidence:
          "Dio's excerpt (read in Cary's translation) ties Quietus' return to service to the Dacian wars, which ran 101–102 and 105–106. Trajan's Column, dedicated in 113, depicts those wars.",
      },
      {
        sourceKey: "rla_rib_2042",
        citations: [
          { sourceKey: "rla_wp_aballava", relation: "supports", note: "Cites RIB 2042 for the mid-3rd-century numerus of Aurelian Moors at Burgh-by-Sands." },
          { sourceKey: "rla_speidel_1975", relation: "context", note: "Explains the irregular numeri and how such units were named and recruited." },
        ],
        startYear: 253,
        endYear: 258,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "numerus Maurorum Aurelianorum Valeriani Gallienique (RIB 2042)",
        datingMethod: "regnal_chronology",
        chronology: "archaeological",
        whatIsDated: "The Moorish unit attested at Aballava on Hadrian's Wall",
        evidence:
          "The unit's titles honour the joint emperors Valerian and Gallienus, which RIB uses to date the altar to 253–258 (the Heidelberg Epigraphic Database narrows it to 253–255). The altar was found in 1934.",
      },
      {
        sourceKey: "rla_notitia",
        citations: [
          { sourceKey: "rla_rib_2042", relation: "supports", note: "The same unit, under the same name, a century and a half earlier at the same fort." },
          { sourceKey: "rla_speidel_1975", relation: "context", note: "On the survival of ethnic unit names long after local recruitment had taken over." },
        ],
        startYear: 395,
        endYear: 425,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "praefectus numeri Maurorum Aurelianorum, Aballaba (Notitia Dignitatum, Occ. XL)",
        datingMethod: "estimate",
        chronology: "historical",
        whatIsDated: "The last attestation of the Aurelian Moors at Aballava",
        evidence:
          "The western Notitia was compiled around 395 and revised into the 420s; the British lists may preserve an older state of affairs. The date is a range for the document, not a date for the unit's presence.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "roman-north-african-cultural-exchange",
    title: "Gods, languages and writing in Roman Africa (1st–4th centuries)",
    summary:
      "Under Roman rule, African religion, Punic and Libyan speech and Latin culture mixed rather than replaced one another: Baal Hammon became Saturn, 'Moorish gods' received Latin dedications, and Punic was still spoken in Augustine's day.",
    description:
      "RELIGION. The most widespread cult of Roman Africa was that of Saturn — not the Italian Saturn but the African continuation of the Punic Baal Hammon. Thousands of votive stelae, from Carthage's hinterland to Numidia, show a bearded, veiled god above dedicants and offerings, often with Punic symbols carried over (Le Glay 1966). Alongside Saturn, Latin inscriptions honour the Dii Mauri, 'the Moorish gods', usually without naming them, many set up by soldiers and officials in Mauretania and Numidia; local gods sometimes appear under their own names (Brett and Fentress 1996).\n\n" +
      "LANGUAGE AND WRITING. Latin became the language of government and of most inscriptions, but it did not erase the others. Neo-Punic was used in public dedications into the 2nd century CE — the theatre of Lepcis Magna was dedicated in 1–2 CE by Annobal Rufus in both Latin and Neo-Punic — and Punic later survived in Latin letters (Wilson 2012). Libyco-Berber script continued to be cut on stones, sometimes beside Latin. Augustine, in the 390s, says country people near Hippo, asked what they were, answered in Punic 'Chanani' — Canaanites (paraphrased, not quoted).\n\n" +
      "PEOPLE. Apuleius of Madauros, the Latin novelist, described himself in his own defence speech (c. 158–159) as half-Numidian and half-Gaetulian — a regional and political self-description. Septimius Severus, emperor 193–211, came from Lepcis Magna, a city of Punic origin; the Arch of Severus and the rebuilt city show how African elites used Roman forms for local pride.\n\n" +
      "WHAT THIS DOES NOT SHOW. These are elite, written and religious traces. They tell us that several languages and cults coexisted; they do not tell us what most rural people spoke at home, and 'Punic', 'Libyan', 'Moorish' and 'Roman' were not fixed ethnic boxes. The 'Dii Mauri' are a Roman category, not necessarily one their worshippers used.\n\n" +
      "CORRECTION TO THE RESEARCH TARGET. The target mentioned 'Latin/Neo-Punic/Libyan trilingual' inscriptions. Latin–Neo-Punic bilinguals are well attested; true trilinguals are rare and none was checked in this session, so none is claimed here.",
    category: "culture",
    subcategory: R("roman"),
    eventType: "historical",
    tags: laneTags("roman", "saturn", "baal-hammon", "punic", "libyco-berber", "dii-mauri", "bilingual-inscriptions", "apuleius", "septimius-severus"),
    people: ["Apuleius", "Septimius Severus", "Augustine of Hippo", "Annobal Tapapius Rufus"],
    civilisations: ["Roman Empire", "Carthage", "Numidia", "Mauretania", "Amazigh peoples", "Phoenicians"],
    locationName: "Roman Africa (Proconsularis, Numidia, the Mauretanias)",
    identificationStatus: "secure",
    media: [P.saturnStele, P.ghorfa, P.diiMauri, P.lepcisBilingual, P.severanTondo, P.apuleiusContorniate],
    claims: [
      {
        sourceKey: "rla_leglay_1966",
        citations: [
          { sourceKey: "rla_rives_1995", relation: "supports", note: "Shows how Punic, Roman and local cults were reorganised in Roman Carthage, including Saturn." },
          { sourceKey: "rla_cil_8_20433", relation: "supports", note: "An example of the Saturn stelae: Saturnus Augustus in the top register, dedicated by a priest." },
          { sourceKey: "rla_brett_fentress_1996", relation: "context", note: "On the Dii Mauri and local gods in Latin dedications." },
          { sourceKey: "rla_wilson_2012", relation: "context", note: "On Neo-Punic and Latin in public writing." },
        ],
        startYear: 100,
        endYear: 300,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "2nd–3rd centuries CE, the peak of the Saturn stelae and Latin dedications",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        whatIsDated: "The main period of the religious and epigraphic mixture described",
        evidence:
          "The great majority of dated Saturn stelae and Dii Mauri dedications fall in the 2nd and 3rd centuries, dated by formulae, imperial titles and style. The range is a modern summary of a long process, not an event.",
      },
      {
        sourceKey: "rla_lepcis_bilingual",
        citations: [
          { sourceKey: "rla_wilson_2012", relation: "supports", note: "Discusses the Lepcis bilinguals as public display in two languages." },
          { sourceKey: "rla_wp_punic", relation: "context", note: "Extra summary of the survival of Punic." },
        ],
        startYear: 1,
        endYear: 2,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "IMP CAESARE DIVI F AUG ... TR POT XXIV (IRT 321)",
        datingMethod: "regnal_chronology",
        chronology: "archaeological",
        whatIsDated: "The Latin–Neo-Punic dedication of the theatre at Lepcis Magna",
        evidence:
          "Augustus' 24th tribunician power runs from mid-1 to mid-2 CE, which dates the dedication. It is earlier than the main period of this record and is given as the clearest datable case of the bilingual practice.",
      },
      {
        sourceKey: "rla_augustine_romans",
        citations: [
          { sourceKey: "rla_wp_punic", relation: "supports", note: "Reports Augustine's testimony to Punic among the rural population." },
          { sourceKey: "rla_wilson_2012", relation: "context", note: "Places the late testimony after the end of Neo-Punic epigraphy." },
        ],
        startYear: 394,
        endYear: 395,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "asked what they were, country people answered in Punic 'Chanani' (Augustine, paraphrase)",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        whatIsDated: "Punic still spoken in the countryside near Hippo",
        evidence:
          "Augustine's unfinished commentary on Romans is usually dated to 394–395. The passage is paraphrased here; it shows Punic as a living rural language, and that some speakers named themselves after Canaan.",
      },
      {
        sourceKey: "rla_apuleius_apologia",
        citations: [
          { sourceKey: "rla_brett_fentress_1996", relation: "context", note: "Uses Apuleius as an example of layered African identity within Latin culture." },
        ],
        startYear: 158,
        endYear: 159,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "half-Numidian and half-Gaetulian (Apuleius, Apologia 24, paraphrase)",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        whatIsDated: "Apuleius' self-description in his defence speech at Sabratha",
        evidence:
          "The trial before the proconsul Claudius Maximus is dated to c. 158–159. The words are paraphrased; they describe a frontier town's regional and political belonging, not a racial category.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "late-roman-indigenous-communities-firmus-gildo",
    title: "Firmus and Gildo: Moorish princes in late Roman Africa (372–398)",
    summary:
      "Two sons of Nubel, a Moorish chieftain who was also a Roman officer and a Christian, played for power inside the Roman state: Firmus revolted in 372–375; his brother Gildo helped crush him, governed Africa for Rome, and revolted in turn in 397–398.",
    description:
      "WHO THEY WERE. Ammianus Marcellinus calls Nubel 'the most powerful chieftain among the Mauritanian nations'. An inscription from Rusguniae (near Algiers) of a Flavius Nuvel, a Roman cavalry officer who dedicated a church, is usually taken to be the same man: a regulus who was at once tribal leader, Roman officer and Christian landowner. His sons inherited all three roles.\n\n" +
      "FIRMUS (372–375). After Nubel's death Firmus killed his brother Zamma, a favourite of the comes Africae Romanus. Accused by Romanus at court, Firmus rose in revolt; Ammianus (29.5) describes how Theodosius the Elder, father of the later emperor, crossed to Africa, fought through a shifting web of gentes — the Abanni, Caprarienses, Isaflenses under their king Igmazen — and pursued Firmus until, about to be handed over, he hanged himself. Firmus had allies among the Donatist Christians.\n\n" +
      "GILDO (386–398). Gildo fought for Theodosius against his brother and was rewarded: from 386 he was comes et magister utriusque militiae per Africam, the senior Roman commander in Africa, and married his daughter into the imperial family. In 397 he transferred his allegiance to the eastern court and held back the grain ships Rome depended on; Stilicho had the Senate declare him a public enemy and sent Gildo's own brother Mascezel against him. Claudian's hostile poem De bello Gildonico celebrates the quick victory; Gildo died on 31 July 398. His confiscated estates were so large that a special office managed them.\n\n" +
      "HOW TO READ IT. Older accounts made these 'native revolts' or even proto-national Berber risings linked to Donatism. Recent work (Blackhurst 2004; Modéran 2003; Shaw 2011) sees a provincial family playing Roman politics with tribal, military and church resources. Both brothers acted through Roman offices and Roman factions.\n\n" +
      "WHAT IT DOES NOT SHOW. That the gentes of Mauretania acted as one people, or that 'Moorish' and 'Roman' were opposites: the house of Nubel was both.\n\n" +
      "CORRECTION TO THE RESEARCH TARGET. The target gave 300–400 CE; the evidence is concentrated in 372–398. 'Praefecti gentis' — Roman-appointed prefects over tribes — are attested in the 4th–5th centuries but are not documented for these particular groups here.",
    category: "history",
    subcategory: R("roman"),
    eventType: "historical",
    tags: laneTags("roman", "mauri", "firmus", "gildo", "donatism", "late-antiquity", "mauretania"),
    people: ["Firmus", "Gildo", "Nubel (Flavius Nuvel)", "Zamma", "Mascezel", "Theodosius the Elder", "Romanus", "Igmazen", "Stilicho", "Honorius"],
    civilisations: ["Roman Empire", "Mauretania", "Amazigh peoples"],
    locationName: "Mauretania Caesariensis and Africa Proconsularis",
    identificationStatus: "secure",
    media: [P.dioceseMap, P.ammianus1533, P.corbita],
    claims: [
      {
        sourceKey: "rla_ammianus_yonge",
        citations: [
          { sourceKey: "rla_wp_firmus", relation: "supports", note: "Gives 372–375 for the revolt, from the modern literature (Camps, PLRE)." },
          { sourceKey: "rla_blackhurst_2004", relation: "context", note: "Reinterprets the revolt as provincial politics rather than a 'native rising'." },
          { sourceKey: "rla_moderan_2003", relation: "context", note: "Places Firmus' allies within the system of interior gentes." },
          { sourceKey: "rla_shaw_2011", relation: "context", note: "The Donatist setting and caution about reading the schism as ethnic." },
        ],
        startYear: 372,
        endYear: 375,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Nubel ... died, and left several sons ... of whom Zamma ... was slain by his brother Firmus",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "The revolt of Firmus and Theodosius' campaign",
        evidence:
          "Ammianus narrates the revolt as one continuous story in Book 29 (read in Yonge's translation) rather than year by year, so the start (372 or 373) and end (374 or 375) are modern reconstructions from his chronology and the laws of Valentinian.",
      },
      {
        sourceKey: "rla_claudian_gildo",
        citations: [
          { sourceKey: "rla_wp_gildo", relation: "supports", note: "Gives Gildo's command from 386 and his death on 31 July 398." },
          { sourceKey: "rla_blackhurst_2004", relation: "context", note: "Reads Gildo's switch to the eastern court as court politics." },
        ],
        startYear: 397,
        endYear: 398,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Bellum Gildonicum, 397–398",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "Gildo's revolt against Honorius and his death",
        evidence:
          "Claudian's poem was written in 398 for the western court; the Theodosian Code and the chroniclers fix the declaration against Gildo in 397 and his defeat in 398. The poem is a panegyric and its picture of Gildo is propaganda.",
      },
      {
        sourceKey: "rla_wp_gildo",
        citations: [
          { sourceKey: "rla_moderan_2003", relation: "context", note: "On Gildo's place in the late-Roman system of African command." },
        ],
        startYear: 386,
        endYear: 398,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "comes et magister utriusque militiae per Africam, from 386",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "Gildo's Roman command in Africa",
        evidence: "The office is attested in imperial legislation and in PLRE's reconstruction of his career; a Moorish prince held the highest military command in Roman Africa for twelve years.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "vandal-conquest-of-africa",
    title: "The Vandals cross to Africa and take Carthage (429–439)",
    summary:
      "In May 429 the Vandal king Gaiseric led his people from Spain into Mauretania; ten years later, on 19 October 439, he seized Carthage. Moorish leaders inside and beyond the Vandal kingdom gained growing autonomy.",
    description:
      "WHAT HAPPENED. Hydatius, a contemporary bishop in north-west Spain, records that King Gaiseric left the coast of Baetica 'with all the Vandals and their families' in May 429 and crossed to Mauretania and Africa. The Vandals moved east along the coast; Augustine died in 430 inside besieged Hippo. A treaty in 435 left them much of Numidia; then, Prosper writes, Gaiseric, 'of whose friendship nothing was feared', took Carthage by a trick of peace on 19 October 439. The richest provinces of the West were lost to Rome, and Carthage became the capital of a Vandal kingdom that lasted until 534.\n\n" +
      "WHAT IT MEANT FOR THE MAURI. The Vandal kingdom held the coast and the old core of Africa Proconsularis, Byzacena and part of Numidia. Much of the Mauretanias and the mountain country was never firmly held. Procopius says that under Huneric (477–484) the Moors of Mount Aurasium (the Aurès) revolted and 'never came under the Vandals again', and that after Gaiseric's death the Moors won many victories. Out of this came the independent kingdoms of the next record. Victor of Vita's account of Huneric's persecution of Nicene Christians in 484 is the background to Masties' appeal to God and to faith with Romans and Moors.\n\n" +
      "HOW IT IS DATED. The crossing and the fall of Carthage are among the best-dated events in this track: contemporary chroniclers give the month (Hydatius) and the day (Prosper).\n\n" +
      "WHERE THE ACCOUNTS DISAGREE. The size of the migrating group (Victor's 80,000 is probably a count of the whole people, not of warriors) and the role of Count Boniface, who later writers said had invited the Vandals in, are debated; the invitation story is not in the contemporary chronicles and is regarded by many modern historians as a later explanation.\n\n" +
      "WHAT IT DOES NOT SHOW. That 'Vandal' Africa ceased to be Roman in culture. Latin, Roman law and Roman landholding went on; the Albertini tablets of the 490s record land sales in Latin in the Vandal kingdom.",
    category: "history",
    subcategory: R("roman"),
    eventType: "historical",
    tags: laneTags("roman", "vandals", "carthage", "gaiseric", "late-antiquity", "mauri"),
    people: ["Gaiseric", "Huneric", "Augustine of Hippo", "Boniface", "Victor of Vita", "Gelimer"],
    civilisations: ["Vandal Kingdom", "Roman Empire", "Amazigh peoples"],
    locationName: "Carthage (Tunisia)",
    lat: 36.8528,
    lng: 10.3233,
    identificationStatus: "secure",
    media: [P.vandalRider, P.gelimerCoin, P.vandalMap533, P.carthageBaths],
    claims: [
      {
        sourceKey: "rla_merrills_miles_2010",
        citations: [
          { sourceKey: "rla_hydatius", relation: "supports", note: "Contemporary date of the crossing: May 429." },
          { sourceKey: "rla_prosper", relation: "supports", note: "Contemporary date of the seizure of Carthage: 19 October 439." },
          { sourceKey: "rla_courtois_1955", relation: "context", note: "The classic account of the Vandal kingdom and its limits." },
          { sourceKey: "rla_wp_vandal_conquest", relation: "context", note: "Extra summary of the sequence 429–439." },
        ],
        startYear: 429,
        endYear: 439,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "429–439: from the crossing to the fall of Carthage",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "The Vandal conquest of Roman Africa",
        evidence: "The span is bounded by two contemporary chronicle entries, each with its own month or day.",
      },
      {
        sourceKey: "rla_hydatius",
        citations: [
          { sourceKey: "rla_merrills_miles_2010", relation: "supports", note: "Accepts May 429 for the crossing." },
        ],
        startYear: 429,
        startMonth: 5,
        datePrecision: "month",
        isApproximate: false,
        originalDateText: "mense Maio ad Mauritaniam et Africam ... transit",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The Vandal crossing from Baetica to Mauretania",
        evidence: "Hydatius' chronicle (read in Mommsen's edition) gives the month. He was a contemporary in Gallaecia, writing from reports.",
      },
      {
        sourceKey: "rla_prosper",
        citations: [
          { sourceKey: "rla_victor_vita", relation: "context", note: "The Nicene account of what followed for the Church in Carthage." },
        ],
        startYear: 439,
        startMonth: 10,
        startDay: 19,
        datePrecision: "day",
        isApproximate: false,
        originalDateText: "XIIII kal. Nov. Carthaginem dolo pacis invadit",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "Gaiseric's seizure of Carthage",
        evidence: "Prosper (read in Mommsen's edition) gives the day by the Roman calendar: the fourteenth day before the Kalends of November is 19 October.",
      },
      {
        sourceKey: "rla_procopius_dewing",
        citations: [
          { sourceKey: "rla_merrills_miles_2010", relation: "supports", note: "Discusses Moorish independence in the Aurès and the Mauretanias under the later Vandal kings." },
          { sourceKey: "rla_moderan_2003", relation: "context", note: "Critiques Procopius' picture of the Moors." },
        ],
        startYear: 477,
        endYear: 484,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "the Moors dwelling on Mt. Aurasium had revolted from the Vandals and were independent",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        whatIsDated: "Moorish independence in the Aurès under Huneric",
        evidence:
          "Procopius (Wars 3.8.5, read in Dewing's translation) places the revolt by Huneric's reign (477–484) and adds that the Aurès never came under the Vandals again.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "romano-amazigh-kingdoms",
    title: "Moorish kingdoms of late antiquity: Altava, the Aurès and the Djedars (c. 430–600)",
    summary:
      "As Vandal and then Byzantine power stayed on the coast, local rulers built kingdoms that were Latin-writing, Christian and Roman in vocabulary: Masuna styled himself king 'of the peoples of the Mauri and the Romans' in 508; Masties called himself dux and imperator.",
    description:
      "WHAT THE EVIDENCE IS. Almost entirely stones and buildings, with a few lines in Procopius and John of Biclaro.\n\n" +
      "ALTAVA. A building inscription at Altava (Ouled Mimoun, western Algeria) records a fort built 'for the health and safety of King Masuna, [king] of the peoples of the Mauri and the Romans', with his prefect at Safar and procurators at Castra Severiana and Altava, dated year 469 of the province — 508 CE. The title names two populations under one ruler: tribal Mauri and provincial Romani. Procopius' Massonas and Mastigas, who in the 530s held Caesarean Mauretania except Caesarea itself, may belong to the same line.\n\n" +
      "THE AURÈS. The epitaph of Masties, found at Arris in 1941, has him say that he was dux for 67 years and imperator for 10, that he never broke faith 'with the Romans or with the Moors', and that God rewarded him. Its date is disputed: one view places him c. 484–494, after Huneric's persecution; Morizot puts him in the last years of the Vandal kingdom. Iaudas ruled the Aurès in the 530s.\n\n" +
      "THE DJEDARS. Thirteen square stepped mausolea on two hills near Frenda, south of Tiaret, were built for an unnamed dynasty. Their Latin inscriptions are almost illegible ('egregius', 'duci', 'filius' can be made out), they carry Christian symbols, and they reuse Roman tombstones dated as late as 494. A radiocarbon date from the coffin in Djedar B calibrates to 410–615 CE. Camps attributed Djedar F to King Garmul, who killed three Byzantine commanders before Gennadius defeated and killed him in 578 (John of Biclaro).\n\n" +
      "HOW TO READ IT. These polities show regional political continuity: Moorish rulers took over Roman titles, Latin, Christianity and provincial dating. 'Romano-Amazigh' and 'Mauro-Roman' are modern labels for this; Masuna's own phrase is the best guide.\n\n" +
      "WHAT IT DOES NOT SHOW. The kingdoms' borders, their languages at home, or their ancestry. Linking the Djedars or Masties to named kings is a modern hypothesis.",
    category: "history",
    subcategory: R("roman"),
    eventType: "historical",
    tags: laneTags("roman", "mauri", "masuna", "masties", "altava", "aures", "djedars", "garmul", "late-antiquity"),
    people: ["Masuna", "Masties", "Vartaia", "Mastigas", "Iaudas", "Garmul", "Gennadius", "Masgivinus"],
    civilisations: ["Amazigh peoples", "Mauretania", "Vandal Kingdom", "Byzantine Empire"],
    locationName: "Altava (Ouled Mimoun), the Aurès, and Frenda (Algeria)",
    lat: 34.904,
    lng: -1.035,
    identificationStatus: "secure",
    media: [P.mastiesInscription, P.djedarView, P.djedarF, P.kingdomsMap, P.masunaInscription],
    claims: [
      {
        sourceKey: "rla_merrills_2004",
        citations: [
          { sourceKey: "rla_moderan_2003", relation: "supports", note: "The fundamental study of the late-antique Moorish polities." },
          { sourceKey: "rla_camps_1984", relation: "supports", note: "The royal titles and succession in Mauretania." },
          { sourceKey: "rla_courtois_1955", relation: "context", note: "The classic map of the independent kingdoms." },
        ],
        startYear: 430,
        endYear: 600,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "c. 430–600: the independent Moorish kingdoms of the Vandal and Byzantine periods",
        datingMethod: "estimate",
        chronology: "conventional",
        whatIsDated: "The period of the late-antique Moorish kingdoms",
        evidence: "A modern framing bounded by the Vandal arrival and the last documented king (Garmul, d. 578); some of the polities lasted into the 7th century.",
      },
      {
        sourceKey: "rla_masuna_inscription",
        citations: [
          { sourceKey: "rla_camps_1984", relation: "supports", note: "Takes the title 'rex gentium Maurorum et Romanorum' as the starting point of his study." },
          { sourceKey: "rla_wp_mauro_roman", relation: "context", note: "Transcription of the inscription (extra)." },
        ],
        startYear: 508,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "regis Masunae gent(ium) Maur(orum) et Romanor(um) ... p(rovinciae) CCCCLXVIIII",
        datingMethod: "archaeological",
        chronology: "archaeological",
        whatIsDated: "Masuna's fort at Altava",
        evidence: "Dated by the Mauretanian provincial era: year 469 counted from 40 CE is 508 CE. (The online transcription drops one C; 469 is the reading that gives 508.)",
      },
      {
        sourceKey: "rla_masties_inscription",
        citations: [
          { sourceKey: "rla_morizot_1989", relation: "disputes", note: "Places Masties in the last years of the Vandal kingdom and rereads his titles (imperator for ten years)." },
          { sourceKey: "rla_wp_masties", relation: "context", note: "Gives the alternative c. 484–494, linked to Huneric's persecution." },
          { sourceKey: "rla_merrills_miles_2010", relation: "context", note: "Discusses Masties and the Aurès." },
        ],
        startYear: 484,
        endYear: 535,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Masties, dux for 67 years, imperator for 10 (undated epitaph)",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        whatIsDated: "Masties' reign in the Aurès",
        evidence: "The epitaph has no date. One reconstruction puts his assumption of the imperial title after the persecution of 484 and his death c. 494; Morizot puts him in the last years before 533. The range covers both.",
      },
      {
        sourceKey: "rla_wp_jedars",
        citations: [
          { sourceKey: "rla_kadra_1983", relation: "supports", note: "The excavation and documentation on which the dating rests." },
          { sourceKey: "rla_camps_djedar_1995", relation: "context", note: "Attributes Djedar F to Garmul or his dynasty." },
        ],
        startYear: 410,
        endYear: 615,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "410 ± 50, calibrated 410–615 CE at 95.4% (coffin of Djedar B)",
        datingMethod: "radiocarbon",
        chronology: "scientific",
        whatIsDated: "The burial in Djedar B",
        evidence: "A single radiocarbon date on wood from the coffin under Djedar B, calibrated with OxCal. It dates the wood, not the building; reused tombstones up to 494 in Djedar F and a proposed 4th-century reading of Djedar A's dedication bracket the series.",
      },
      {
        sourceKey: "rla_john_biclaro",
        citations: [
          { sourceKey: "rla_camps_1984", relation: "supports", note: "Places Garmul in the line of Masuna's kingdom." },
        ],
        startYear: 578,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Gennadius ... Garmulem fortissimum regem ... bello superat et ipsum regem gladio interficit",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        whatIsDated: "The defeat and death of King Garmul",
        evidence: "John of Biclaro (read in Mommsen's edition) enters it under the second year of Tiberius II, 578; the deaths of Theoctistus (570) and Amabilis (571) at Moorish hands are entered earlier.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "byzantine-reconquest-and-the-mauri-wars",
    title: "Byzantine reconquest and the Moorish wars (533–548)",
    summary:
      "Belisarius destroyed the Vandal kingdom in 533–534, but the Byzantines spent the next fifteen years fighting and bargaining with Moorish rulers — Antalas, Iaudas, Cusina and others — until John Troglita's campaigns of 546–548.",
    description:
      "WHAT HAPPENED. Justinian's general Belisarius landed in September 533, beat Gelimer at Ad Decimum and Tricamarum, and took him to Constantinople in 534. Procopius, Belisarius' secretary, tells what followed: Moorish rulers who had submitted asked for the insignia of office the Romans had always given them, and soon many were fighting the new regime. Solomon, general and prefect, campaigned in Byzacena and the Aurès against Iaudas (535 and 539), and built or rebuilt the forts whose walls still stand at Theveste (Tébessa), Ammaedara (Haidra) and elsewhere. Antalas, once Byzantium's ally, turned against it after the execution of his brother; Solomon was killed fighting Antalas' coalition at Cillium in 544. The emperor's nephew John Troglita, with Moorish allies led by Cusina, defeated the coalitions in 546–548. His campaigns are the subject of Corippus' Latin epic Iohannis, the fullest description of Moorish names, gods and fighting from antiquity.\n\n" +
      "HOW TO READ IT. These were not wars of 'Romans against natives'. Both sides were coalitions; Moorish rulers fought on the imperial side (Masuna/Massonas, Ortaias, Cusina) as well as against it, and Byzantine policy alternated war with gifts and titles. Procopius and Corippus wrote for the imperial side and use 'Moors' as a category of outsiders; Modéran (2003) and Merrills (2023) show how much their pictures are shaped by literary tradition.\n\n" +
      "HOW IT IS DATED. Procopius dates the 533 campaign closely; the Moorish wars of 534–548 come from his narrative and from Corippus. The later wars with Garmul (570s) come from John of Biclaro (see the previous record).\n\n" +
      "WHAT IT DOES NOT SHOW. The numbers in these sources are unreliable, and the coastal view leaves the interior kingdoms almost undescribed.\n\n" +
      "CORRECTION TO THE RESEARCH TARGET. None needed to the dates; 'Cusina' is the Latin form used by Corippus.",
    category: "history",
    subcategory: R("roman"),
    eventType: "historical",
    tags: laneTags("roman", "byzantine", "belisarius", "solomon", "john-troglita", "corippus", "antalas", "iaudas", "cusina", "mauri"),
    people: ["Justinian I", "Belisarius", "Gelimer", "Solomon", "Antalas", "Iaudas", "Cusina", "John Troglita", "Corippus", "Procopius"],
    civilisations: ["Byzantine Empire", "Vandal Kingdom", "Amazigh peoples"],
    locationName: "Byzacena and Numidia (Tunisia and eastern Algeria)",
    identificationStatus: "secure",
    media: [P.haidra, P.tebessa, P.sanVitale, P.byzMaghrebMap, P.gelimerLitho],
    claims: [
      {
        sourceKey: "rla_procopius_dewing",
        citations: [
          { sourceKey: "rla_pringle_1981", relation: "supports", note: "Military history and fortifications of Byzantine Africa from 533." },
          { sourceKey: "rla_conant_2012", relation: "context", note: "How the reconquest changed — and did not change — identities in Africa." },
          { sourceKey: "rla_moderan_2003", relation: "context", note: "Critique of Procopius' Moors." },
        ],
        startYear: 533,
        startMonth: 9,
        endYear: 534,
        datePrecision: "month",
        isApproximate: false,
        originalDateText: "Belisarius lands in Africa, September 533; Gelimer surrenders, 534",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The Byzantine destruction of the Vandal kingdom",
        evidence: "Procopius was present and dates the campaign by season and by the Byzantine regnal year; the month of the landing is secure.",
      },
      {
        sourceKey: "rla_merrills_2023",
        citations: [
          { sourceKey: "rla_corippus", relation: "supports", note: "The epic narrative of John Troglita's campaigns and his alliance with Cusina." },
          { sourceKey: "rla_procopius_dewing", relation: "supports", note: "Procopius' narrative of the wars with Antalas and Iaudas, Solomon's campaigns and death." },
          { sourceKey: "rla_pringle_1981", relation: "context", note: "Military reconstruction of the campaigns." },
        ],
        startYear: 534,
        endYear: 548,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "534–548: the Moorish wars, from the first risings to John Troglita's victory",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "The wars between the Byzantine government and Moorish coalitions",
        evidence: "The end-point is John Troglita's decisive campaign of 548; Solomon's death in 544 and John's arrival in 546 are fixed points in between.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "north-africa-before-the-arab-conquests",
    title: "North Africa before the Arab conquests (c. 600–647)",
    summary:
      "On the eve of the conquests, Byzantine Africa was a Christian exarchate centred on Carthage — the base from which Heraclius seized the empire in 610 — with Jewish communities on the coast and Moorish kingdoms in the interior.",
    description:
      "THE EXARCHATE. From the 590s the Byzantine provinces of Africa were governed by an exarch combining civil and military power at Carthage. In 608 the exarch Heraclius the Elder revolted against the emperor Phocas; his son Heraclius sailed from Carthage and was crowned in Constantinople on 5 October 610. The Chronicle of 754, a Spanish Latin text, begins its story with that accession. Africa remained one of the empire's secure and Latin-speaking provinces; refugees and monks came there from the East as Persians and then Arabs advanced.\n\n" +
      "CHRISTIANITY. The Church of Africa was large, Latin and argumentative: its bishops opposed imperial doctrine (monotheletism) in the 640s, and Maximus the Confessor debated in Carthage in 645. Christianity had also spread among the Moorish kingdoms, as the Djedars and Masties' epitaph show.\n\n" +
      "JUDAISM. Jewish communities are directly attested on the coast — the 6th-century synagogue of Naro (Hammam Lif), whose mosaic dedications are in Latin, and the burials at Gammarth near Carthage. Justinian had ordered synagogues in Africa converted into churches (535), and the Doctrina Jacobi, a Greek dialogue set in Carthage in 634, is about Jews forcibly baptised under a decree of Heraclius.\n\n" +
      "'JUDAIZED BERBER TRIBES'. Ibn Khaldun, writing in the 1370s–80s, says some Berber tribes, the Jarawa among them, had professed Judaism. This is late, indirect and debated: Hirschberg (1963) argued the passage refers to a time before Christianisation and judged these conversions the least authenticated of all Judaizing movements; in another passage Ibn Khaldun himself says the Romans had imposed Christianity on the Zenata. No archaeological evidence of Jewish tribes in the interior has been identified.\n\n" +
      "LOCAL RELIGION. Corippus' Iohannis (c. 550) names Moorish gods such as Gurzil and Ammon worshipped by the Laguatan; traditional cults thus coexisted with Christianity among some groups.\n\n" +
      "WHAT IT DOES NOT SHOW. The religious map of the interior is very poorly known; the Arabic sources describing it were written centuries later.",
    category: "religion",
    subcategory: R("medieval"),
    eventType: "historical",
    tags: laneTags("medieval", "exarchate-of-africa", "heraclius", "carthage", "christianity", "judaism", "late-antiquity"),
    people: ["Heraclius", "Heraclius the Elder", "Maximus the Confessor", "Ibn Khaldun"],
    civilisations: ["Byzantine Empire", "Amazigh peoples"],
    locationName: "Carthage and the Byzantine provinces of Africa",
    lat: 36.8528,
    lng: 10.3233,
    identificationStatus: "secure",
    media: [P.naroMosaic, P.naroPalm, P.doctrinaJacobi, P.exarchateMap],
    claims: [
      {
        sourceKey: "rla_conant_2012",
        citations: [
          { sourceKey: "rla_kaegi_2010", relation: "supports", note: "The state of Byzantine Africa on the eve of the first raids." },
          { sourceKey: "rla_wp_exarchate", relation: "context", note: "Extra summary of the exarchate." },
        ],
        startYear: 600,
        endYear: 647,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "c. 600–647: Byzantine Africa before the first Arab raid into Byzacena",
        datingMethod: "estimate",
        chronology: "conventional",
        whatIsDated: "The pre-conquest period described",
        evidence: "Bounded by the established exarchate and the first Arab raid into Byzacena in 647.",
      },
      {
        sourceKey: "rla_theophanes",
        citations: [
          { sourceKey: "rla_chronicle_754", relation: "supports", note: "Begins its narrative with Heraclius' accession in era 648 (610 CE)." },
          { sourceKey: "rla_wp_exarchate", relation: "context", note: "The revolt of the exarch Heraclius the Elder from 608." },
        ],
        startYear: 610,
        startMonth: 10,
        startDay: 5,
        datePrecision: "day",
        isApproximate: false,
        originalDateText: "Heraclius, having sailed from Africa, is crowned (Theophanes AM 6102)",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "Heraclius' coup from Carthage and coronation",
        evidence: "The day of the coronation (5 October 610) comes from the Byzantine chronicle tradition (Chronicon Paschale, Theophanes); paraphrased.",
      },
      {
        sourceKey: "rla_wp_doctrina_jacobi",
        citations: [
          { sourceKey: "rla_hirschberg_1963", relation: "context", note: "On the evidence for Jews in North Africa and the weakness of the 'Judaized Berber' tradition." },
        ],
        startYear: 634,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Doctrina Jacobi nuper baptizati, set in Carthage in 634",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        whatIsDated: "The forced baptism of Jews in Carthage under Heraclius",
        evidence: "The dialogue's internal dating places it in 634; it is a literary text with a polemical aim, but its setting is taken as evidence for Heraclius' decree in Africa.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "early-arab-muslim-campaigns-sbeitla",
    title: "First Arab campaigns into Byzantine Africa: Sufetula (647)",
    summary:
      "After the conquest of Egypt, Arab armies took Barqa and Tripoli in 642–643; in 647 Abd Allah ibn Sa'd invaded Byzacena and defeated the self-proclaimed emperor Gregory near Sufetula (Sbeitla), then withdrew for a large tribute.",
    description:
      "WHAT HAPPENED. Amr ibn al-As, conqueror of Egypt, moved west along the coast and took Barqa (Cyrenaica) and then Tripoli in 642–643, receiving the submission of Berber groups there. In 646/647 Gregory, the exarch of Africa, had rebelled against Constans II and claimed the throne, perhaps with the support of the African Church. In 647 Abd Allah ibn Sa'd ibn Abi Sarh, governor of Egypt, invaded Byzacena with some 20,000 men and defeated Gregory near Sufetula, the inland town Gregory had made his base. The Arabic tradition says Gregory was killed; Agapius of Hierapolis and some Syriac sources say he survived and fled. His successor bought the Arab withdrawal with a large tribute, and the army returned to Egypt after a campaign of about fifteen months.\n\n" +
      "HOW IT IS DATED. The Arabic sources place the expedition in AH 27 (647–648). The earliest full narrative is that of Ibn Abd al-Hakam, written in Egypt in the mid-9th century, two hundred years later; it is already full of story-telling (Gregory's daughter offered as a prize, for example). Kaegi (2010) stresses that this was a raid for plunder and tribute, not yet a conquest, and that Byzantine Africa survived it for half a century.\n\n" +
      "THE BERBERS. Ibn Khaldun says Gregory had the support of the Zenata and other Berbers; the Arabic sources describe Berber groups both fighting the Arabs and coming to terms with them. These are late generalisations, but the pattern — local leaders bargaining with each side — fits what is known from the Byzantine wars.\n\n" +
      "WHAT IT DOES NOT SHOW. The size of the armies, the battle's exact site, or the motives of Gregory's rebellion are not established. The ruins of Sbeitla give the setting, not evidence of the battle itself.",
    category: "history",
    subcategory: R("medieval"),
    eventType: "historical",
    tags: laneTags("medieval", "arab-conquest", "sufetula", "sbeitla", "byzantine", "gregory-the-patrician"),
    people: ["Abd Allah ibn Sa'd ibn Abi Sarh", "Gregory the Patrician", "Amr ibn al-As", "Constans II", "Uthman ibn Affan"],
    civilisations: ["Byzantine Empire", "Amazigh peoples"],
    locationName: "Sufetula (Sbeitla, Tunisia)",
    lat: 35.2393,
    lng: 9.1206,
    identificationStatus: "secure",
    media: [P.sbeitlaTemples, P.sbeitlaFort, P.byzacenaMap],
    claims: [
      {
        sourceKey: "rla_kaegi_2010",
        citations: [
          { sourceKey: "rla_wp_sufetula", relation: "supports", note: "Gives 647 for the battle and 648 for the end of the fifteen-month campaign; notes the Syriac tradition of Gregory's survival." },
          { sourceKey: "rla_ibn_khaldun_slane", relation: "context", note: "A 14th-century summary: Gregory had the support of the Zenata and Berbers, and lost the battle and his life; Sbeitla fell to the Arabs." },
        ],
        startYear: 647,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "647: the battle of Sufetula",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "The defeat of Gregory near Sufetula",
        evidence: "The modern consensus date, from the Arabic tradition's AH 27 and the Byzantine chronology of Gregory's revolt.",
      },
      {
        sourceKey: "rla_wp_sufetula",
        citations: [
          { sourceKey: "rla_kaegi_2010", relation: "context", note: "Treats the expedition as a raid ending in tribute and withdrawal." },
        ],
        startYear: 647,
        endYear: 648,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "AH 27, a campaign of fifteen months",
        datingMethod: "historical_record",
        chronology: "islamic",
        whatIsDated: "The whole expedition, from invasion to the return to Egypt",
        evidence: "AH 27 runs from October 647 to September 648; with a fifteen-month campaign the army's return falls in 648, which is why '647/648' appears in the literature.",
      },
      {
        sourceKey: "rla_kaegi_2010",
        citations: [
          { sourceKey: "rla_fenwick_2020", relation: "context", note: "The early stages of the conquest in Cyrenaica and Tripolitania." },
        ],
        startYear: 642,
        endYear: 643,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Amr ibn al-As takes Barqa and Tripoli, 642–643",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "The first Arab conquests west of Egypt",
        evidence: "Dated in the Arabic tradition to AH 21–22; Barqa's Berber population (the Lawata) is said to have agreed tribute.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "foundation-of-kairouan",
    title: "Uqba ibn Nafi founds Kairouan (c. 670)",
    summary:
      "Uqba ibn Nafi founded Kairouan, inland in Byzacena, as a fortified camp and capital for the conquest of Ifriqiya; its Great Mosque, rebuilt many times, became the region's religious centre.",
    description:
      "WHAT IT WAS. Kairouan (al-Qayrawan, from a Persian-derived word for a camp or caravan halt) was founded by Uqba ibn Nafi, a commander of the caliph Mu'awiya, at an inland site away from the Byzantine-held coast. It was at once a military base, an administrative capital and a religious centre: Uqba is said to have laid out the mosque next to the governor's residence. Arab and Berber troops were settled there, and it became the capital of the province of Ifriqiya.\n\n" +
      "HOW IT IS DATED. The traditional date is AH 50 (670 CE), given by the Arabic historians; it is a traditional date from sources written two centuries or more later, not an inscription. The city's foundation fits Mu'awiya's reign (661–680). Uqba was replaced by Abu al-Muhajir Dinar (c. 674/675), who reportedly founded a rival base nearby, before Uqba returned in 681.\n\n" +
      "THE GREAT MOSQUE. Nothing visible in today's Great Mosque can be dated to Uqba. The governor Bishr ibn Safwan is credited with works around 725, and the present building is essentially the reconstruction of the Aghlabid emir Ziyadat Allah I in 836 (outside this track's window), with later additions. Its prayer hall reuses columns and capitals from Roman and Byzantine buildings, and a Latin inscription of Septimius Severus is built into the minaret: the stone of Roman Africa went into the new city.\n\n" +
      "WHAT IT DOES NOT SHOW. The size or make-up of the first settlement; the early city has not been extensively excavated. The legends of Uqba clearing the site of wild beasts by command are hagiography.\n\n" +
      "CORRECTION TO THE RESEARCH TARGET. The target gave '670 CE'. That is the traditional date and is kept, but marked as traditional; the 9th-century rebuilding cannot be placed on this track because the track ends in 800.",
    category: "religion",
    subcategory: R("medieval"),
    eventType: "historical",
    tags: laneTags("medieval", "kairouan", "great-mosque-of-kairouan", "uqba-ibn-nafi", "ifriqiya", "arab-conquest"),
    people: ["Uqba ibn Nafi", "Mu'awiya I", "Abu al-Muhajir Dinar", "Bishr ibn Safwan"],
    civilisations: ["Umayyad Caliphate", "Amazigh peoples"],
    locationName: "Kairouan (Tunisia)",
    lat: 35.6814,
    lng: 10.1036,
    identificationStatus: "secure",
    media: [P.kairouanPanorama, P.kairouanCapitals, P.kairouanInscription],
    claims: [
      {
        sourceKey: "rla_wp_great_mosque_kairouan",
        citations: [
          { sourceKey: "rla_kaegi_2010", relation: "supports", note: "Uses the traditional foundation date and discusses Kairouan's strategic purpose." },
          { sourceKey: "rla_fenwick_2020", relation: "context", note: "Archaeology of early Islamic Kairouan and its limits." },
        ],
        startYear: 670,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "AH 50 (670 CE), the foundation by Uqba ibn Nafi",
        datingMethod: "historical_record",
        chronology: "traditional",
        whatIsDated: "The foundation of Kairouan and its first mosque",
        evidence: "The date of the Arabic historical tradition, repeated by modern accounts. It is precise in form but rests on sources written long after the event.",
      },
      {
        sourceKey: "rla_kaegi_2010",
        citations: [
          { sourceKey: "rla_wp_great_mosque_kairouan", relation: "context", note: "Places the foundation in Mu'awiya's caliphate." },
        ],
        startYear: 661,
        endYear: 680,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "in the reign of the caliph Mu'awiya (661–680)",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        whatIsDated: "The foundation, bounded by the reign of the caliph who sent Uqba",
        evidence: "The outer bound the foundation must fall within, independent of the exact traditional year.",
      },
      {
        sourceKey: "rla_wp_great_mosque_kairouan",
        citations: [
          { sourceKey: "rla_fenwick_2020", relation: "context", note: "Discusses the phasing of the early mosque." },
        ],
        startYear: 724,
        endYear: 728,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "works under the governor Bishr ibn Safwan, about 725",
        datingMethod: "estimate",
        chronology: "historical",
        whatIsDated: "The earliest attributed building works in the surviving mosque (base of the minaret)",
        evidence: "An attribution of the lowest part of the minaret to Bishr's governorship (c. 721–727); the rest of the standing building is 9th-century.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "kusaila-and-the-awraba",
    title: "Kusaila, the Awraba, and the death of Uqba (682/683–688)",
    summary:
      "Kusaila, a Christian leader of the Awraba and allied Moorish groups, ambushed and killed Uqba ibn Nafi at Tahuda near Biskra in 682 or 683, held Kairouan for some years, and was killed at Mamma around 688.",
    description:
      "WHO HE WAS. The Arabic sources call him Kusaila (Berber Aksel) and make him a leader of the Awraba, a Berber group of the Aurès and later of northern Morocco, and often a Christian. Modern historians (Modéran 2005; Talbi in EI2) see him as heir to the late-antique Moorish kingdoms of the previous record — possibly ruling from the region of Altava or Tlemcen — rather than a tribal chief from nowhere. The stories that Abu al-Muhajir converted him to Islam and that Uqba humiliated him are not in the earliest sources; they appear in later tellings and may explain his 'betrayal'.\n\n" +
      "WHAT HAPPENED. Returning from his famous march to the Atlantic, Uqba was cut off with a small force near Tahuda, south of the Aurès near Biskra, and killed with his men by a Berber force with Byzantine allies. Kusaila then took Kairouan and held it, while the Arab garrison withdrew to Barqa. Around 688 the new commander Zuhayr ibn Qays defeated and killed Kusaila at Mamma (Mems), west of Kairouan. Uqba's traditional tomb is the centre of the mosque of Sidi Okba near Biskra.\n\n" +
      "HOW IT IS DATED. The Arabic historians disagree by a year or two: AH 63 or 64 for Uqba's death (682–684), AH 67–69 for Kusaila's (686–689). Modern accounts give 682 or 683 for Tahuda and 688 for Mamma.\n\n" +
      "WHERE THE ACCOUNTS DISAGREE. Ibn Khaldun credits the Kahena (Dihya), not Kusaila alone, with pushing the Berbers of Tehouda to kill Uqba. The late sources organise this resistance around two heroic figures, one male and one female; how they really related is unknown.\n\n" +
      "WHAT IT DOES NOT SHOW. Whether 'Awraba' meant one people or a coalition, what Kusaila's title was, or how far his rule extended.",
    category: "history",
    subcategory: R("medieval"),
    eventType: "historical",
    tags: laneTags("medieval", "kusaila", "awraba", "uqba-ibn-nafi", "tahuda", "arab-conquest", "amazigh-resistance"),
    people: ["Kusaila (Aksel)", "Uqba ibn Nafi", "Abu al-Muhajir Dinar", "Zuhayr ibn Qays"],
    civilisations: ["Amazigh peoples", "Umayyad Caliphate", "Byzantine Empire"],
    locationName: "Tahuda near Biskra (Sidi Okba, Algeria)",
    lat: 34.745,
    lng: 5.9,
    identificationStatus: "secure",
    media: [P.thouda, P.sidiOkba, P.aksilStatue],
    claims: [
      {
        sourceKey: "rla_wp_kusaila",
        citations: [
          { sourceKey: "rla_moderan_kusayla", relation: "supports", note: "Critical reconstruction of Kusaila's career from the Arabic sources." },
          { sourceKey: "rla_kaegi_2010", relation: "supports", note: "Places the defeat of Uqba within the Byzantine-Berber resistance." },
        ],
        startYear: 683,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "683: Uqba killed at Tahudha near Biskra",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "The ambush and death of Uqba ibn Nafi",
        evidence: "The date most modern accounts give, from AH 63/64 in the Arabic tradition.",
      },
      {
        sourceKey: "rla_wp_kusaila",
        citations: [
          { sourceKey: "rla_moderan_kusayla", relation: "context", note: "Discusses the conflicting Arabic dates." },
        ],
        startYear: 682,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "682: the battle of Vescera",
        datingMethod: "historical_record",
        chronology: "alternative",
        whatIsDated: "The ambush and death of Uqba ibn Nafi",
        evidence: "Some accounts (including parts of the same Wikipedia article) give 682; the difference reflects the Arabic sources' variation between AH 62, 63 and 64.",
      },
      {
        sourceKey: "rla_wp_kusaila",
        citations: [
          { sourceKey: "rla_kaegi_2010", relation: "supports", note: "The Arab recovery of Ifriqiya under Zuhayr." },
        ],
        startYear: 688,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "688: Kusaila killed at the battle of Mamma",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "Kusaila's defeat and death",
        evidence: "AH 69 in the tradition followed by most modern accounts; others give AH 67 (686). The research target's 'c. 688/690' is kept as approximate.",
      },
      {
        sourceKey: "rla_ibn_khaldun_slane",
        citations: [
          { sourceKey: "rla_hannoum_2001", relation: "context", note: "Traces how the Kahena legend grew in the Arabic tradition up to Ibn Khaldun." },
        ],
        startYear: 683,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Ce fut elle qui poussa les Berbères de Tehouda à tuer Ocba-Ibn-Nafé",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        whatIsDated: "Ibn Khaldun's attribution of Uqba's death to the Kahena's instigation",
        evidence: "A 14th-century statement (read in de Slane's translation, vol. 3 p. 193) that the Kahena urged the Berbers of Tehouda to kill Uqba — a tradition at odds with the Kusaila-centred accounts, kept as its own claim.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "dihya-al-kahina",
    title: "Dihya, 'al-Kahina', and the resistance in the Aurès (c. 690s–703)",
    summary:
      "Dihya, called al-Kahina ('the soothsayer') by her enemies, led Berber resistance from the Aurès, defeated Hassan ibn al-Nu'man, and was finally defeated and killed; her dates, her religion and her story are known only from Arabic sources written centuries later, and her legend has been reshaped ever since.",
    description:
      "WHAT THE SOURCES SAY. After Kusaila's death the Arabic sources make a woman of the Aurès the main leader of resistance. They give her name as Dihya, daughter of Tabat (or Matiya), and call her al-Kahina, 'the soothsayer', for her supposed foresight. Hassan ibn al-Nu'man, after taking Carthage, marched against her; she defeated him (on the Meskiana or the Wadi Nini) and drove him back to Cyrenaica for several years. A scorched-earth policy attributed to her is said to have lost her the support of the oasis and town dwellers. Hassan returned with reinforcements, defeated her, and killed her near a well afterwards called Bir al-Kahina. The sources add that she sent her sons over to Hassan, who gave them command of her people, the Jarawa.\n\n" +
      "HOW LATE THE SOURCES ARE. The first narratives date from the 9th century (Ibn Abd al-Hakam) and grow richer later: al-Maliki (11th century) places her in the Aurès; al-Tijani (14th) was told she was of the Luwata; Ibn Khaldun (14th) makes her a Jarawa, says she ruled 65 years and lived 127, and dates her death to AH 74 (693–4). Talbi's critical chronology puts the final campaign in 701–703. Her details — speeches, the adoption of a captive Arab, Khalid ibn Yazid — are story-telling.\n\n" +
      "HER RELIGION. Ibn Khaldun's statement that some Berber tribes, including the Jarawa, had once professed Judaism is the source of the modern claim that she was Jewish. It is late and debated; Hirschberg (1963) doubted it, and Modéran (2005) and Talbi judged a Christian Dihya more likely, reading the 'idol' she carried as an icon. Some modern pages still call her a 'Jewish queen' as fact.\n\n" +
      "MODERN USES. Hannoum (2001) traces how French colonial writers made her a Christian or Jewish resister to the Arabs, nationalists a resister to all invaders, Berberists a national heroine, feminists a model. The statue in Khenchela belongs to that modern history.\n\n" +
      "CORRECTION TO THE RESEARCH TARGET. 'Hannoum 2001' is 'Colonial Histories, Post-Colonial Memories: The Legend of the Kahina, a North African Heroine'. Several death dates are kept as separate claims.",
    category: "people",
    subcategory: R("medieval"),
    eventType: "disputed",
    eventTypeNote: "A historical person whose dates, religion and deeds are known only from late and contradictory sources, and whose legend is itself a subject of study.",
    tags: laneTags("medieval", "dihya", "kahina", "aures", "amazigh-resistance", "hassan-ibn-al-numan", "historiography", "jarawa"),
    people: ["Dihya (al-Kahina)", "Hassan ibn al-Nu'man", "Khalid ibn Yazid al-Qaysi", "Ibn Khaldun", "Abd al-Malik ibn Marwan"],
    civilisations: ["Amazigh peoples", "Umayyad Caliphate", "Byzantine Empire"],
    locationName: "The Aurès mountains (Algeria)",
    identificationStatus: "disputed",
    argumentsFor:
      "That a woman leader of the Aurès resisted Hassan ibn al-Nu'man and defeated him once is reported in every Arabic tradition from the 9th century on, with a consistent outline (defeat of Hassan, his retreat to Barqa, his return and her death), and fits what is known of the Aurès as an independent region since the 5th century.",
    argumentsAgainst:
      "No source is contemporary; the earliest is two centuries later and the fullest seven. Her dates differ by up to ten years between traditions; her tribe, father and religion vary; and her story is full of folkloric motifs (prophecy, the age of 127, the adoption by nursing). Her Jewishness rests on a late, ambiguous passage of Ibn Khaldun.",
    genealogies: [
      {
        key: "kahina-jewish",
        claim: "Dihya al-Kahina was a Jewish queen leading Judaized Berber tribes",
        verdict: "later_interpretation",
        verdictEvidence:
          "The claim derives from Ibn Khaldun's 14th-century statement that some Berber tribes, including the Jarawa, had professed Judaism, combined with a reading of 'Kahina' as 'Cohen'. Hirschberg (1963) argued the passage refers to a remote period, and the most recent critical study (Modéran 2005) judges a Christian Dihya the more likely hypothesis. No early source calls her Jewish.",
        whatWouldChangeThis:
          "An earlier Arabic or Christian source describing Dihya or the Jarawa as Jewish, or archaeological evidence (inscriptions, synagogues, burials) of Jewish communities in the 7th-century Aurès.",
        links: [
          {
            stage: "later_antiquity",
            who: "Ibn Khaldun, Kitab al-'Ibar",
            sourceKey: "rla_ibn_khaldun_slane",
            reference: "de Slane trans., vol. 1 (Judaized tribes) and vol. 3 pp. 191–194 (the Kahena)",
            saysAbsentReason: "The volume 1 passage on Judaized tribes was not read in this session; the volume 3 account of the Kahena, which was read, makes her a Jarawa and says the Romans had imposed Christianity on the Zenata, without calling her Jewish.",
            adds: "Supplies the tribal identification (Jarawa) and, elsewhere, the list of tribes said once to have professed Judaism, from which the 'Jewish Kahina' was later assembled.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "H. Z. Hirschberg",
            year: 1963,
            sourceKey: "rla_hirschberg_1963",
            reference: "Journal of African History 4 (1963) 313–339",
            saysAbsentReason: "Not read in this session; its argument is reported from secondary summaries.",
            adds: "Retranslates Ibn Khaldun and argues the Judaized-tribes passage refers to a time before Christianisation, questioning the existence of large Jewish Berber tribes in late antiquity.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Yves Modéran",
            year: 2005,
            sourceKey: "rla_moderan_kahena",
            reference: "Encyclopédie berbère 27, 4102–4111",
            saysAbsentReason: "Not read in this session; conclusion reported via the Wikipedia article.",
            adds: "Judges the Christian hypothesis the most likely and treats the sources as a late, layered tradition.",
            citationStatus: "unverified",
          },
          {
            stage: "popular_claim",
            who: "Wikipedia, 'Battle of Carthage (698)'",
            sourceKey: "rla_wp_carthage_698",
            says: "the Jewish queen Kahina led what could today be described as a fierce guerilla war against the Arab forces",
            adds: "Drops every hedge: the late, debated tradition becomes a plain statement of fact.",
            citationStatus: "verified",
          },
        ],
      },
    ],
    media: [P.auresLandscape, P.dihyaStatue, P.elDjem, P.dihyaFortress],
    claims: [
      {
        sourceKey: "rla_ibn_khaldun_slane",
        citations: [
          { sourceKey: "rla_talbi_1971", relation: "disputes", note: "Talbi's critical chronology puts the final campaign against her later, most likely in 701–703." },
          { sourceKey: "rla_hannoum_2001", relation: "context", note: "On how the tradition's details accumulated between the 9th and 14th centuries." },
        ],
        startYear: 693,
        endYear: 694,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "En l'an 74 (693-4), il culbuta les Berbères, tua la Kahena",
        datingMethod: "historical_record",
        chronology: "traditional",
        whatIsDated: "Dihya's defeat and death",
        evidence: "Ibn Khaldun (read in de Slane's translation, vol. 3 p. 194) dates Hassan's victory and her death to AH 74 (May 693–April 694). This puts her death before the fall of Carthage in the chronology of most other sources, one sign of how confused the tradition is.",
      },
      {
        sourceKey: "rla_talbi_1971",
        citations: [
          { sourceKey: "rla_wp_hassan", relation: "supports", note: "Reports Talbi's chronology: the final campaign 'most likely by 701, 702 or 703'." },
          { sourceKey: "rla_moderan_kahena", relation: "context", note: "Reviews the conflicting dates in the Arabic sources." },
          { sourceKey: "rla_kaegi_2010", relation: "context", note: "Places the end of organised Berber resistance in the early 8th century." },
        ],
        startYear: 701,
        endYear: 703,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "most likely 701, 702 or 703 (Talbi's chronology)",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        whatIsDated: "Dihya's defeat and death",
        evidence: "A modern critical reconstruction from the conflicting hijri dates, placing Hassan's return after his years at Barqa.",
      },
      {
        sourceKey: "rla_wp_kahina",
        citations: [
          { sourceKey: "rla_talbi_1971", relation: "context", note: "The 703 date is the latest of Talbi's possible years." },
        ],
        startYear: 703,
        startMonth: 9,
        datePrecision: "month",
        isApproximate: true,
        originalDateText: "in Ramadan (September or October) 703",
        datingMethod: "source_assertion",
        chronology: "alternative",
        whatIsDated: "Dihya's death",
        evidence: "The precise date given by the Wikipedia article. Its month comes from one Arabic tradition; the precision is greater than the sources as a whole justify.",
      },
      {
        sourceKey: "rla_wp_kahina",
        citations: [
          { sourceKey: "rla_wp_hassan", relation: "supports", note: "Hassan's defeat and retreat to Barqa after his first capture of Carthage." },
          { sourceKey: "rla_moderan_kahena", relation: "context", note: "The battle's site and date are both uncertain." },
        ],
        startYear: 697,
        endYear: 698,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "c. 697–698: Dihya defeats Hassan in the Meskiana valley",
        datingMethod: "estimate",
        chronology: "historical",
        whatIsDated: "Dihya's victory over Hassan ibn al-Nu'man",
        evidence: "A modern placement between Hassan's first capture of Carthage and his years waiting at Barqa; the sources disagree on the order of events.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "fall-of-byzantine-carthage-698",
    title: "Hassan ibn al-Nu'man takes Carthage (695/697–698)",
    summary:
      "Hassan ibn al-Nu'man captured Carthage, lost it to a Byzantine relief fleet under John the Patrician in 697, and took it again in 698, destroying it; Tunis was founded nearby. Byzantine Africa was over, though Septem (Ceuta) held out.",
    description:
      "WHAT HAPPENED. Sent by the caliph Abd al-Malik with a large army, Hassan ibn al-Nu'man entered Ifriqiya in the early or mid-690s and took Carthage, the capital of Byzantine Africa. In 697 the emperor Leontius sent a fleet under John the Patrician that broke into the harbour and retook the city; the Arab garrison fell back to Kairouan. In 698 Hassan returned; John's force withdrew by sea, and Hassan took the city and destroyed it — walls pulled down, harbours made unusable — so that it could not serve again as a Byzantine base. The failure set off a mutiny in the Byzantine fleet that made Apsimar emperor as Tiberius III. In 699 Hassan founded Tunis on the lake nearby, with an arsenal and a canal to the sea, and Carthage's stone began to be carried away to new buildings.\n\n" +
      "HOW IT IS DATED. The Byzantine chronicles (Theophanes, Nikephoros) give the relief expedition and the loss of Carthage under Leontius (695–698), which fixes the final fall in 698. The first capture is less certain: Talbi's chronology has Hassan entering Ifriqiya in 692/3, 693/4 or 695, and modern accounts give 695, 696 or 697 for the first taking of Carthage.\n\n" +
      "THE END OF BYZANTINE AFRICA. Some coastal places held out briefly, and Septem (Ceuta), on the African side of the Strait, remained outside Arab control until about the time of the crossing to Spain; the Arabic sources make its lord, Ilyan (Julian), a key figure in 711. Its status — Byzantine, Visigothic or independent — is debated.\n\n" +
      "WHAT IT DOES NOT SHOW. That the Roman population vanished: Latin-speaking Christians (the Afariq of the Arabic sources) remained in the cities of Ifriqiya for centuries.\n\n" +
      "CORRECTION TO THE RESEARCH TARGET. The target gave '695 and again 698'. 698 is secure; 695 is one of several dates for the first capture and is kept as a range.",
    category: "history",
    subcategory: R("medieval"),
    eventType: "historical",
    tags: laneTags("medieval", "carthage", "hassan-ibn-al-numan", "byzantine", "tunis", "arab-conquest", "septem"),
    people: ["Hassan ibn al-Nu'man", "John the Patrician", "Leontius", "Tiberius III (Apsimar)", "Abd al-Malik ibn Marwan"],
    civilisations: ["Umayyad Caliphate", "Byzantine Empire", "Amazigh peoples"],
    locationName: "Carthage (Tunisia)",
    lat: 36.8528,
    lng: 10.3233,
    identificationStatus: "secure",
    media: [P.carthageBaths, P.carthageMap, P.conquestMap],
    claims: [
      {
        sourceKey: "rla_theophanes",
        citations: [
          { sourceKey: "rla_wp_carthage_698", relation: "supports", note: "The sequence of the recapture by John and the final fall in 698." },
          { sourceKey: "rla_kaegi_2010", relation: "supports", note: "Treats 698 as the end of Byzantine Carthage." },
          { sourceKey: "rla_wp_hassan", relation: "context", note: "Reports Talbi's chronology for the destruction (698) and the foundation of Tunis (699)." },
        ],
        startYear: 698,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "698: the final fall and destruction of Carthage",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        whatIsDated: "Hassan's final capture of Carthage",
        evidence: "Fixed by the Byzantine chronicles' linkage of the failed relief and Apsimar's mutiny to the end of Leontius' reign in 698 (Theophanes AM 6190, paraphrased).",
      },
      {
        sourceKey: "rla_wp_hassan",
        citations: [
          { sourceKey: "rla_talbi_1971", relation: "supports", note: "The critical chronology of Hassan's entry into Ifriqiya." },
          { sourceKey: "rla_wp_carthage_698", relation: "context", note: "Places Hassan's first advance on Carthage in 697." },
        ],
        startYear: 695,
        endYear: 697,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "first capture of Carthage, 695–697",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        whatIsDated: "Hassan's first capture of Carthage, before the Byzantine recapture",
        evidence: "The Arabic and Byzantine sources do not fix the first capture; reconstructions range from 695 to early 697, before John the Patrician's fleet arrived in 697.",
      },
      {
        sourceKey: "rla_wp_hassan",
        citations: [
          { sourceKey: "rla_fenwick_2020", relation: "context", note: "On the early Islamic foundation of Tunis and the shift from Carthage." },
        ],
        startYear: 699,
        startMonth: 3,
        datePrecision: "month",
        isApproximate: true,
        originalDateText: "Hassan founded the medina of Tunis in March 699",
        datingMethod: "source_assertion",
        chronology: "historical",
        whatIsDated: "The foundation of Tunis",
        evidence: "A date given in the Wikipedia article after Sebag; reported, not independently checked.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "islamization-and-arab-amazigh-alliances",
    title: "Musa ibn Nusayr, Berber armies and the road to Tangier (c. 698–710)",
    summary:
      "Under Musa ibn Nusayr the conquest of the far Maghreb proceeded as much by agreements with Berber leaders as by war: Berber troops were enlisted, Tangier was taken and put under Tariq ibn Ziyad, and conversion to Islam began — gradually, and unevenly.",
    description:
      "WHAT HAPPENED. Musa ibn Nusayr replaced Hassan as governor of Ifriqiya (the date is uncertain: 698 in some accounts, c. 703–705 in others), with authority over the whole western conquest. His campaigns, and those of his sons, reached the Sous and northern Morocco; he took Tangier, the old Tingis, and put it under his mawla (client) Tariq ibn Ziyad. Ibn Abd al-Hakam, the earliest Arabic narrator, says Musa sent his son Marwan to Tangier, that Tariq was left with the army there, and mentions the Berber tribes of the Botr and Beranes who had not yet submitted.\n\n" +
      "ALLIANCE AND CONVERSION. The armies that went on to Spain in 711 were largely Berber — the Chronicle of 754 calls them 'Mauri sent by Musa'. Recruitment came through agreements with Berber leaders, hostages and the status of mawla; Berber soldiers received a share of the spoils, though less than Arabs, a grievance that exploded in the Great Berber Revolt of 739–743. Conversion was gradual: the Arabic sources speak of whole groups 'accepting Islam' after defeat, but archaeology and later history show Christians, Jews and traditional cults persisting for generations (Fenwick 2020).\n\n" +
      "JULIAN OF CEUTA — LEGEND AND HISTORY. Ibn Abd al-Hakam names Ilyan, 'Lord of Septa', a subject of Roderic, who offered to bring Tariq to al-Andalus because Roderic had got his daughter pregnant. The Christian Chronicle of 754 does not mention him; the daughter (later named 'La Cava') belongs to legend, and some historians have doubted Julian existed at all. A ruler of Septem who helped the crossing is plausible; the romance around him is not evidence.\n\n" +
      "HOW IT IS DATED. A reconnaissance raid by Tarif across the Strait (giving its name to Tarifa) is dated to 710. Musa's governorship ran to 714, when he was recalled to Damascus.\n\n" +
      "WHAT IT DOES NOT SHOW. How many Berbers had converted by 711; 'Berber' itself is an Arabic umbrella term for many groups.",
    category: "history",
    subcategory: R("medieval"),
    eventType: "historical",
    tags: laneTags("medieval", "musa-ibn-nusayr", "tangier", "islamization", "berber-armies", "julian-of-ceuta", "septem", "arab-conquest"),
    people: ["Musa ibn Nusayr", "Tariq ibn Ziyad", "Julian (Ilyan) of Septem", "Tarif", "Marwan ibn Musa"],
    civilisations: ["Umayyad Caliphate", "Amazigh peoples", "Byzantine Empire", "Visigothic Kingdom"],
    locationName: "Tangier and Septem (Ceuta), Morocco",
    lat: 35.7595,
    lng: -5.834,
    identificationStatus: "secure",
    media: [P.tangierBay, P.ceuta, P.conquestMap],
    claims: [
      {
        sourceKey: "rla_kaegi_2010",
        citations: [
          { sourceKey: "rla_wp_musa", relation: "supports", note: "Musa's governorship, Berber recruitment and the taking of Tangier." },
          { sourceKey: "rla_ibn_abd_al_hakam", relation: "supports", note: "The earliest Arabic narrative of Musa's western campaigns and Tariq's command at Tangier." },
          { sourceKey: "rla_fenwick_2020", relation: "context", note: "Archaeological evidence for gradual conversion." },
        ],
        startYear: 698,
        endYear: 710,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "c. 698–710: Musa's western campaigns and alliances",
        datingMethod: "estimate",
        chronology: "conventional",
        whatIsDated: "The extension of Umayyad rule and Berber recruitment in the far Maghreb",
        evidence: "Bounded by the end of Byzantine Carthage and the raid of 710; Musa's own start date is uncertain.",
      },
      {
        sourceKey: "rla_wp_musa",
        citations: [
          { sourceKey: "rla_kaegi_2010", relation: "context", note: "Discusses the uncertain start of Musa's governorship." },
        ],
        startYear: 698,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "In 698, Musa was made the governor of Ifriqiya",
        datingMethod: "source_assertion",
        chronology: "alternative",
        whatIsDated: "Musa's appointment as governor",
        evidence: "The date given by the Wikipedia article; other reconstructions put his appointment c. 703–705, after Hassan's dismissal (dated 704 in Talbi's chronology). Both cannot be right.",
      },
      {
        sourceKey: "rla_ibn_abd_al_hakam",
        citations: [
          { sourceKey: "rla_collins_1989", relation: "context", note: "Critically assesses the Julian story and the Arabic narratives of 710–711." },
        ],
        startYear: 710,
        endYear: 711,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "This was in the year 92 (Tarik at Tangiers; Ilyan, Lord of Septa)",
        datingMethod: "historical_record",
        chronology: "islamic",
        whatIsDated: "Tariq's command at Tangier and his dealings with Ilyan of Septem",
        evidence: "Ibn Abd al-Hakam (read in Jones's translation) dates Tariq's holy war around Tangier to AH 92 (October 710–October 711), immediately before the crossing.",
      },
    ],
  },

  // =========================================================================
  {
    slug: "tariq-ibn-ziyad-crosses-to-iberia-711",
    title: "Tariq ibn Ziyad crosses to Iberia (711)",
    summary:
      "In spring 711 Tariq ibn Ziyad, a client of Musa ibn Nusayr, crossed the Strait with a largely Berber army, landed near the rock that would bear his name — Jabal Tariq, Gibraltar — and defeated the Visigothic king Roderic, beginning Muslim rule in much of Iberia.",
    description:
      "WHAT HAPPENED. Tariq crossed from the Tangier–Ceuta coast in borrowed ships, in several trips; Ibn Abd al-Hakam (9th century) says Ilyan of Septa supplied the vessels and that the locals took them for traders. The force landed by the rock later called Jabal Tariq ('Tariq's mountain', Gibraltar). Roderic, who had seized the Visigothic throne the year before and was fighting in the north, marched south and was defeated and killed — at the Wadi Lakka in the Arabic sources (usually placed by the Guadalete or the Barbate), at the 'Transductine promontories' in the Chronicle of 754. Tariq went on to Toledo, the Visigothic capital; Musa followed in 712 with an Arab army.\n\n" +
      "THE WORD. The Chronicle of 754, the earliest Latin account, written about forty years later by a Christian in al-Andalus, describes Roderic gathering his army against 'the Arabs and the Moors sent by Musa, that is, Taric Abuzara and the others'. Here 'Mauri', the old Roman name for the peoples of north-west Africa, crosses into Spain as the name for the invading army. That usage — and its later stretching to Muslims of any origin — is the medieval 'Moor' (see the words-and-theories records).\n\n" +
      "WHO TARIQ WAS. The medieval sources disagree: a Berber (of the Nafza or another tribe), a Persian from Hamadan, or an Arab. Most modern scholars think him a Berber mawla of Musa. His name is also confused in the sources with that of Tarif, who led the 710 raid; the Chronicle's 'Taric Abuzara' may conflate the two.\n\n" +
      "LEGENDS. The story that Tariq burned his ships, and the speech beginning 'the sea is behind you, the enemy before you', appear only in much later writers; they are legends. Ibn Abd al-Hakam's own account already includes a staged act of cannibalism and a locked house containing portraits of the conquerors.\n\n" +
      "HOW IT IS DATED. 711 — landing in spring (often given as late April), battle in July (often 19 July). The Chronicle of 754 dates the battle to era 750, i.e. 712, a disagreement kept as its own claim. The track ends here.",
    category: "history",
    subcategory: R("medieval"),
    eventType: "historical",
    tags: laneTags("medieval", "tariq-ibn-ziyad", "gibraltar", "al-andalus", "visigoths", "guadalete", "chronicle-of-754", "mauri", "moors"),
    people: ["Tariq ibn Ziyad", "Roderic", "Musa ibn Nusayr", "Julian (Ilyan) of Septem", "Tarif"],
    civilisations: ["Umayyad Caliphate", "Amazigh peoples", "Visigothic Kingdom", "Iberia"],
    locationName: "Strait of Gibraltar (Jabal Tariq)",
    lat: 36.1408,
    lng: -5.3536,
    identificationStatus: "secure",
    media: [P.chronicle754, P.gibraltar, P.straitView, P.dinar716, P.tariqManuscript, P.guadalete],
    claims: [
      {
        sourceKey: "rla_collins_1989",
        citations: [
          { sourceKey: "rla_ibn_abd_al_hakam", relation: "supports", note: "The earliest Arabic narrative of the crossing, placed in AH 92 (710–711)." },
          { sourceKey: "rla_wp_tariq", relation: "supports", note: "Gives the landing on or about 26 April 711 and Roderic's defeat on 19 July 711." },
          { sourceKey: "rla_molina_ei2_tariq", relation: "context", note: "On Tariq's disputed origins and the legendary accretions." },
          { sourceKey: "rla_dinar_716", relation: "context", note: "Physical evidence of the new regime's bilingual coinage in Spain within five or six years." },
        ],
        startYear: 711,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "711: Tariq crosses the Strait and defeats Roderic",
        datingMethod: "historical_record",
        chronology: "conventional",
        whatIsDated: "The crossing and the defeat of Roderic",
        evidence: "The year agreed by the Arabic tradition (AH 92, which ends in October 711) and modern scholarship.",
      },
      {
        sourceKey: "rla_wp_tariq",
        citations: [
          { sourceKey: "rla_collins_1989", relation: "context", note: "Discusses how the exact days were derived from the Arabic sources." },
        ],
        startYear: 711,
        startMonth: 7,
        startDay: 19,
        datePrecision: "day",
        isApproximate: true,
        originalDateText: "Roderic was defeated and killed on July 19",
        datingMethod: "source_assertion",
        chronology: "historical",
        whatIsDated: "The battle against Roderic (Wadi Lakka / Guadalete)",
        evidence: "A precise date repeated in modern accounts, derived from Arabic reports of the battle late in Ramadan 92; reported, not independently checked. The landing is placed in late April or early May.",
      },
      {
        sourceKey: "rla_chronicle_754",
        citations: [
          { sourceKey: "rla_wolf_1990", relation: "context", note: "Standard translation and discussion of the chronicle's dating system." },
          { sourceKey: "rla_wp_chronicle_754", relation: "context", note: "Manuscripts and editions (extra)." },
          { sourceKey: "rla_collins_1989", relation: "disputes", note: "Modern reconstructions follow the Arabic chronology (711) rather than the chronicle's era 750." },
        ],
        startYear: 712,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "in era DCCL Transductos promonturiis sese cum eis confligendo recepit",
        datingMethod: "historical_record",
        chronology: "historical",
        whatIsDated: "Roderic's defeat as dated by the Chronicle of 754",
        evidence: "The chronicle (read in Mommsen's edition) dates the battle to era 750 of the Spanish era, i.e. 712 CE, and calls the invaders 'Mauri sent by Musa, that is, Taric Abuzara and the others'. Its synchronisms are internally inconsistent; the one-year difference from the Arabic date is a known problem.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links (written once; navigable both ways)
// ---------------------------------------------------------------------------

const links: SeedEventLink[] = [
  // Within this section
  { from: "roman-annexation-of-mauretania", to: "mauri-cavalry-in-the-roman-army", relation: "precedes", note: "Mauretanian groups who fought for Rome in the annexation war, perhaps including Lusius Quietus' family, became a source of the Moorish cavalry Rome used across the Empire." },
  { from: "roman-annexation-of-mauretania", to: "roman-north-african-cultural-exchange", relation: "related", note: "The provinces created in 42 CE were one setting of the religious and linguistic mixing described in the cultural record." },
  { from: "roman-annexation-of-mauretania", to: "romano-amazigh-kingdoms", relation: "related", note: "The Mauretanian provincial era counted from 40 CE was still used to date King Masuna's inscription in 508." },
  { from: "late-roman-indigenous-communities-firmus-gildo", to: "vandal-conquest-of-africa", relation: "precedes", note: "The Moorish princes of the 370s–390s show the provincial and tribal power that the Vandal conquest of 429–439 left in place in the interior." },
  { from: "vandal-conquest-of-africa", to: "romano-amazigh-kingdoms", relation: "precedes", note: "Moorish independence in the Aurès and the Mauretanias grew under the later Vandal kings, producing the kingdoms of Masuna and Masties." },
  { from: "romano-amazigh-kingdoms", to: "byzantine-reconquest-and-the-mauri-wars", relation: "precedes", note: "The kingdoms' rulers — Massonas, Mastigas, Iaudas, Antalas — were the allies and enemies of the Byzantine reconquest." },
  { from: "byzantine-reconquest-and-the-mauri-wars", to: "north-africa-before-the-arab-conquests", relation: "precedes", note: "The Byzantine provinces that survived the Moorish wars became the seventh-century exarchate of Africa." },
  { from: "north-africa-before-the-arab-conquests", to: "early-arab-muslim-campaigns-sbeitla", relation: "precedes", note: "The exarch Gregory's revolt and his defeat at Sufetula in 647 end the pre-conquest period." },
  { from: "early-arab-muslim-campaigns-sbeitla", to: "foundation-of-kairouan", relation: "precedes", note: "After the raids of the 640s–660s, Kairouan was founded as a permanent base inside Byzacena." },
  { from: "foundation-of-kairouan", to: "kusaila-and-the-awraba", relation: "precedes", note: "Kairouan's founder Uqba was killed by Kusaila's forces, who then held the city for several years." },
  { from: "kusaila-and-the-awraba", to: "dihya-al-kahina", relation: "precedes", note: "After Kusaila's death the Arabic sources make Dihya of the Aurès the leader of Berber resistance; Ibn Khaldun even credits her with Uqba's death." },
  { from: "fall-of-byzantine-carthage-698", to: "dihya-al-kahina", relation: "related", note: "Hassan's campaigns against Carthage and against Dihya are interleaved, and the sources disagree on their order." },
  { from: "fall-of-byzantine-carthage-698", to: "islamization-and-arab-amazigh-alliances", relation: "precedes", note: "With Byzantine Carthage gone, Musa ibn Nusayr's campaigns turned west to the far Maghreb and Tangier." },
  { from: "islamization-and-arab-amazigh-alliances", to: "tariq-ibn-ziyad-crosses-to-iberia-711", relation: "precedes", note: "The Berber army Musa had built up and placed under Tariq at Tangier crossed to Iberia in 711." },
  { from: "romano-amazigh-kingdoms", to: "kusaila-and-the-awraba", relation: "related", note: "Modern historians see Kusaila as heir to the late-antique Moorish kingdoms of western Algeria rather than a chief from nowhere." },
  { from: "romano-amazigh-kingdoms", to: "dihya-al-kahina", relation: "related", note: "Dihya's Aurès is the same mountain country whose rulers (Masties, Iaudas) had been independent since the 480s." },

  // To other sections of this track
  { from: "juba-ii-of-mauretania", to: "roman-annexation-of-mauretania", relation: "precedes", note: "Juba II's son Ptolemy was the last king of Mauretania; his execution in 40 CE led directly to annexation." },
  { from: "volubilis-and-iol-caesarea", to: "roman-annexation-of-mauretania", relation: "relevant", note: "Volubilis supplied auxiliaries against Aedemon and was rewarded with municipal status; Iol Caesarea became the capital of Mauretania Caesariensis." },
  { from: "roman-annexation-of-mauretania", to: "roman-expeditions-into-the-sahara", relation: "relevant", note: "Suetonius Paulinus' march across the Atlas in 41–42 CE was one of the Roman expeditions to the desert's edge." },
  { from: "earliest-written-mauri-maurousioi-mauretania", to: "mauri-cavalry-in-the-roman-army", relation: "relevant", note: "The same Latin name, Mauri, labels the cavalry units and the numerus at Aballava three centuries after its first attestation." },
  { from: "indigenous-north-african-religion-and-sacred-sites", to: "roman-north-african-cultural-exchange", relation: "relevant", note: "The Dii Mauri and the African Saturn continue indigenous and Punic religious traditions under Roman forms." },
  { from: "african-gods-in-etruscan-and-roman-religion", to: "roman-north-african-cultural-exchange", relation: "related", note: "Another side of the traffic in gods between Africa and Italy." },
  { from: "libyco-berber-script-earliest-inscriptions", to: "roman-north-african-cultural-exchange", relation: "relevant", note: "Libyco-Berber script went on being cut in the Roman period, sometimes alongside Latin." },
  { from: "tariq-ibn-ziyad-crosses-to-iberia-711", to: "from-mauri-to-medieval-moors", relation: "relevant", note: "The Chronicle of 754's 'Mauri sent by Musa' is the moment the old Roman name crosses into Spain for the conquering army." },
  { from: "tariq-ibn-ziyad-crosses-to-iberia-711", to: "origin-of-the-word-moor", relation: "relevant", note: "The medieval 'Moor' grows out of the Latin usage visible in the earliest account of 711." },
  { from: "tariq-ibn-ziyad-crosses-to-iberia-711", to: "alt-ancient-mauri-and-medieval-moorish-identity", relation: "relevant", note: "The army of 711 was called 'Mauri', but its soldiers were Berber groups and Arabs, not a continuation of an ancient Mauri people — the question that alternative record examines." },
  { from: "dihya-al-kahina", to: "alt-amazigh-population-origins", relation: "related", note: "Dihya's legend has been used in modern arguments about Berber origins and identity." },

  // To records that already exist in other datasets
  { from: "hannibal-takes-command-in-iberia", to: "tariq-ibn-ziyad-crosses-to-iberia-711", relation: "relevant", note: "Nine centuries earlier a Carthaginian army had also used the African–Iberian route; Tariq's crossing is the next time an army from Africa took and held much of Iberia." },
  { from: "destruction-of-carthage-146-bce", to: "fall-of-byzantine-carthage-698", relation: "related", note: "Carthage was destroyed twice: by Rome in 146 BCE and, as the Roman city refounded after it, by Hassan ibn al-Nu'man in 698." },
];

export const ROMAN_LATE_ANTIQUE: MoorsSection = { sources, events, links };
