// SECTION: EGYPT AND THE LIBYANS; ANCIENT AMAZIGH AND LIBYAN PEOPLES.
//
// Two lanes. The `egypt` lane is what Egyptian monuments say about the
// peoples to their west — Tjehenu, Tjemehu, Libu, Meshwesh — and the Libyan
// dynasts who ended up ruling Egypt. The `amazigh` lane is what can be said
// about those peoples in their own right: their writing, their language, their
// gods and their tombs, and what the first Greek ethnographer made of them.
//
// THE RULE THIS SECTION KEEPS. Every name here is somebody else's word until
// it is shown not to be. "Tjehenu", "Libu" and "Meshwesh" are what Egyptian
// scribes wrote; "Libyans" is what Greeks wrote; none of these people is
// called a Moor, a Mauri or a Berber in any source of the period, and no
// record here says they were. "Amazigh-speaking" is used only where a
// linguistic argument is actually being made, and that argument is reported
// with its limits.
//
// QUOTATIONS. Herodotus is quoted from A. D. Godley's Loeb translation
// (1920–21, public domain), read in this session from the University of
// Toronto scans on archive.org. Breasted's Ancient Records (1906) and Edgerton
// & Wilson's translations of the Medinet Habu texts (1936) were read the same
// way. Anything not opened in this session is paraphrased and says so.

import type { SeedEvent, SeedSource, SeedEventLink, SeedPicture } from "../seed-types";
import { MOORS_LANES, bce, ka, commonsPicture, laneTags, type MoorsSection } from "./shared";

const HDT_VOL2_URL = "https://archive.org/details/herodotuswitheng02herouoft";
const HDT_VOL1_URL = "https://archive.org/details/herodotus01hero";

const sources: SeedSource[] = [
  // ---------------------------------------------------------------------------
  // Ancient texts and the translations actually read
  // ---------------------------------------------------------------------------
  {
    key: "egl_herodotus_godley",
    title: "Herodotus, Histories (Loeb Classical Library, trans. A. D. Godley)",
    author: "Herodotus; translated by A. D. Godley",
    publisher: "William Heinemann / G. P. Putnam's Sons (Loeb Classical Library)",
    workTitle: "Herodotus, with an English translation by A. D. Godley, vols. I (Books I–II, 1920) and II (Books III–IV, 1921)",
    reference: `Book II 18, 42 (vol. I); Book III 25–26 and Book IV 168–199 (vol. II). Vol. I scan: ${HDT_VOL1_URL}`,
    url: HDT_VOL2_URL,
    sourceType: "primary",
    publishedYear: 1921,
    publishedDisplay: "written c. 440–425 BCE; Godley's translation 1920–21",
    notes:
      "Cited for: the survey of Libyan peoples from Egypt westward (4.168–199) — the Adyrmachidae (4.168), the Nasamones' oaths and dream-divination at ancestors' tombs (4.172), the Garamantes (4.174, 4.183), the Atarantes and Atlantes (4.184), sacrifice to the sun and moon (4.188), seated burial among the Nasamones (4.190), the Maxyes (4.191), the four peoples of Libya (4.197); the Ammonians as speakers of a mixed Egyptian–Ethiopian tongue and the name Amun (2.42); the oracle of Ammon telling the men of Marea and Apis that they were Egyptians (2.18); Cambyses' lost army sent against the Ammonians (3.25–26). Every quotation in this section from Herodotus was read in this scan.",
  },
  {
    key: "egl_breasted_ar1",
    title: "Ancient Records of Egypt, vol. I: The First to the Seventeenth Dynasties",
    author: "James Henry Breasted",
    publisher: "University of Chicago Press",
    reference: "§311 (Weni recruits troops from the land of Temeh); §§333–336 (Harkhuf's third journey: the chief of Yam going 'to the land of Temeh')",
    url: "https://archive.org/details/ancient-records-of-egypt-vol-1-breasted",
    sourceType: "primary",
    publishedYear: 1906,
    publishedDisplay: "1906 (translations of Old Kingdom texts of the 24th–23rd centuries BCE)",
    notes:
      "Cited for the Sixth Dynasty references to the land of Temeh (Tjemeh/Tjemehu) in the autobiographies of Weni and Harkhuf, and Breasted's note that Temeh is the same as the later Temehu. A 1906 translation: its readings are serviceable but its ethnic vocabulary is of its time and is not reproduced here.",
  },
  {
    key: "egl_breasted_ar3",
    title: "Ancient Records of Egypt, vol. III: The Nineteenth Dynasty",
    author: "James Henry Breasted",
    publisher: "University of Chicago Press",
    reference: "§§569–617 (Merneptah's Libyan war: Great Karnak Inscription §§572–592, Athribis stela, 'Israel' stela §§602–617)",
    url: "https://archive.org/details/ancient-records-of-egypt-vol-3-breasted",
    sourceType: "primary",
    publishedYear: 1906,
    publishedDisplay: "1906",
    notes:
      "Cited for Merneptah's Year 5 war: the report that 'the wretched, fallen chief of Libya, Meryey' son of Ded had fallen on Tehenu with Sherden, Shekelesh, Ekwesh, Luka and Teresh (§579); the battle at Perire in the western Delta; and the Israel stela's lines that 'Sutekh has turned his back upon their chief' and 'Wasted is Tehenu' (§§611, 617). Breasted's identifications of the sea peoples with Sardinians, Etruscans and Achaeans are 1906 conjectures and are not adopted here.",
  },
  {
    key: "egl_breasted_ar4",
    title: "Ancient Records of Egypt, vol. IV: The Twentieth to the Twenty-sixth Dynasties",
    author: "James Henry Breasted",
    publisher: "University of Chicago Press",
    reference:
      "§§35–58 (Ramesses III, First Libyan War, Year 5); §§83–114 (Second Libyan War, Year 11, Meshwesh chiefs Keper and Meshesher); §§669–687 (stela of the 'Great Chief of Me' Sheshonk at Abydos); §§785–792 (Serapeum stela of Harpeson/Pasenhor, genealogy from 'the Libyan, Buyuwawa'); §§796–883 (Piankhi/Piye stela)",
    url: "https://archive.org/details/ancient-records-of-egypt-vol-4_202011",
    sourceType: "primary",
    publishedYear: 1906,
    publishedDisplay: "1906",
    notes:
      "Cited for: Ramesses III's two Libyan wars and the Libyan personal names Ded, Meshken, Meryey, Wermer, Themer, Keper and Meshesher; the Serapeum genealogy that traces the Twenty-second Dynasty back sixteen generations to Buyuwawa, written with the word Tjehenu ('Libyan'); and the Piye stela's picture of a Delta divided among kings and chiefs of the Ma. Breasted numbers the king of the Serapeum stela 'Sheshonk IV'; he is now usually counted Shoshenq V.",
  },
  {
    key: "egl_edgerton_wilson_1936",
    title: "Historical Records of Ramses III: The Texts in Medinet Habu Volumes I and II, Translated with Explanatory Notes",
    author: "William F. Edgerton and John A. Wilson",
    publisher: "University of Chicago Press (Oriental Institute, Studies in Ancient Oriental Civilization 12)",
    reference: "SAOC 12; commentary to Medinet Habu Pls. 27–28 (Year 5 inscription) and Pls. 68–78 (Second Libyan War), Pl. 75 (plunder list)",
    url: "https://archive.org/details/saoc-12.-historical-records-of-ramses-iii.-the-texts-in-medinet-habu-volumes-1-a",
    sourceType: "primary",
    publishedYear: 1936,
    publishedDisplay: "1936",
    notes:
      "Cited for the translation and analysis of the Medinet Habu war texts: that the 'Year 5' inscription also narrates events usually dated Year 8; that the Year 5 confederacy is listed as Rebu (Libu), Seped and Meshwesh; that the dress and hair of the captives in the First Libyan War reliefs are of the 'Rebu-Temeh type of Libyan rather than of the Meshwesh type', the Meshwesh type being clearly shown in the Second Libyan War reliefs; and the Year 11 plunder list naming 'The Chief of the Meshwesh, Mesher, son of Keper'.",
  },
  {
    key: "egl_epigraphic_mh1",
    title: "Medinet Habu, Volume I: Earlier Historical Records of Ramses III",
    author: "The Epigraphic Survey (Oriental Institute, University of Chicago)",
    publisher: "University of Chicago Press (Oriental Institute Publications 8)",
    reference: "OIP 8, Pls. 1–54 (Libyan war of Year 5 and Northern war of Year 8)",
    url: "https://archive.org/details/oip8_20220624",
    sourceType: "archaeological",
    publishedYear: 1930,
    publishedDisplay: "1930",
    notes:
      "The facsimile drawings of the Medinet Habu war reliefs and inscriptions themselves. Cited as the primary record of how Ramesses III's artists depicted Libyan enemies and captives in the First Libyan War, and as the edition Edgerton and Wilson translate.",
  },
  {
    key: "egl_epigraphic_mh2",
    title: "Medinet Habu, Volume II: Later Historical Records of Ramses III",
    author: "The Epigraphic Survey (Oriental Institute, University of Chicago)",
    publisher: "University of Chicago Press (Oriental Institute Publications 9)",
    reference: "OIP 9, Pls. 55–130 (incl. Second Libyan War of Year 11, Pls. 68–78)",
    url: "https://archive.org/details/oip9_20220624",
    sourceType: "archaeological",
    publishedYear: 1932,
    publishedDisplay: "1932",
    notes:
      "Facsimiles of the Year 11 war against the Meshwesh: the battle, the counting of hands, the presentation of captives and the chief Keper. Cited as the primary record of the Meshwesh as Egyptian artists drew them.",
  },
  {
    key: "egl_corippus",
    title: "Iohannis (De bellis Libycis)",
    author: "Flavius Cresconius Corippus",
    reference: "Iohannis, esp. books 2, 4–5 and 8 on the Laguatan and the god Gurzil; English translation by G. W. Shea, The Iohannis or De Bellis Libycis of Flavius Cresconius Corippus (Lewiston: Edwin Mellen, 1998)",
    sourceType: "primary",
    publishedDisplay: "Latin epic written c. 550 CE about the campaigns of John Troglita (546–548 CE)",
    notes:
      "Cited for the sixth-century CE report that the Laguatan of Tripolitania carried an image of Gurzil, called a son of Ammon, into battle. Not read in this session; the content is paraphrased from the secondary literature and Wikipedia's summary, and is late evidence written by a hostile Roman-Byzantine poet.",
  },
  {
    key: "egl_arrian",
    title: "Anabasis of Alexander",
    author: "Arrian (Lucius Flavius Arrianus)",
    reference: "Anabasis 3.3–3.4 (Alexander's journey to the oracle of Ammon)",
    sourceType: "primary",
    publishedDisplay: "written 2nd century CE from earlier Alexander historians",
    notes:
      "Cited for Alexander's visit to the oracle of Ammon after founding Alexandria, in the winter of 332/331 BCE. Not read in this session; paraphrased. Arrian wrote some four and a half centuries after the event from the lost histories of Ptolemy and Aristobulus.",
  },

  // ---------------------------------------------------------------------------
  // Objects (cited as the evidence itself)
  // ---------------------------------------------------------------------------
  {
    key: "egl_libyan_palette",
    title: "The 'Libyan' or 'Cities' Palette (Egyptian Museum, Cairo JE 27434 / CG 14238)",
    publisher: "Egyptian Museum, Cairo",
    reference: "JE 27434 = CG 14238; lower part of a schist cosmetic palette, c. 19 × 22 cm, said to come from Abydos",
    sourceType: "archaeological",
    publishedDisplay: "Naqada III / Protodynastic, c. 3200–3000 BCE",
    notes:
      "Cited as the earliest object usually brought into the Tjehenu question: one face shows registers of cattle, donkeys and rams above a grove of trees with a sign group commonly read Tjehenu (thnw); the other shows seven fortified enclosures attacked by animals or standards. Whether the sign names a people, a region of the western Delta, or something else is the debated point.",
  },
  {
    key: "egl_merneptah_stela",
    title: "Victory ('Israel') stela of Merneptah (Egyptian Museum, Cairo JE 31408)",
    publisher: "Egyptian Museum, Cairo",
    reference: "Cairo JE 31408; found by Flinders Petrie in 1896 in Merneptah's memorial temple at Thebes; dated Year 5 of Merneptah",
    sourceType: "archaeological",
    publishedDisplay: "Year 5 of Merneptah (conventionally 1208 BCE)",
    notes:
      "Cited as a primary record of the Libyan war: most of its 28 lines celebrate the defeat of the Libu chief, and only the last lines mention Canaan and 'Israel'. Its translation is cited from Breasted III §§602–617.",
  },
  {
    key: "egl_pasenhor_stela",
    title: "Serapeum stela of Pasenhor (Harpeson), year 37 of Shoshenq V (Louvre)",
    publisher: "Musée du Louvre, Paris",
    reference: "Found by Auguste Mariette in the Serapeum at Saqqara; Breasted (1906) gives its Louvre number as 278, the Commons file description S 1959; published by Lepsius and by Mariette, Le Sérapéum de Memphis III, pl. 31",
    sourceType: "archaeological",
    publishedDisplay: "year 37 of Shoshenq V (Breasted's 'Sheshonk IV'), mid-8th century BCE",
    notes:
      "Cited as the document that ties the Twenty-second Dynasty to a Libyan ancestor: a priest of Heracleopolis lists sixteen generations back to 'the Libyan (Tjehenu), Buyuwawa', with Libyan-named great chiefs in between, joining the royal line at Osorkon II. Read in Breasted's 1906 translation (Breasted IV §§785–792).",
  },
  {
    key: "egl_bubastite_portal",
    title: "The Bubastite Portal and Shoshenq I's triumph relief, Karnak",
    publisher: "Precinct of Amun-Re, Karnak (Luxor)",
    reference: "Gateway south-east of the temple of Ramesses III between the Second Pylon and the first court; topographical list of places in Palestine and the Negev",
    sourceType: "archaeological",
    publishedDisplay: "carved late in Shoshenq I's reign (campaign conventionally c. 925 BCE)",
    notes:
      "Cited as the principal surviving monument of Shoshenq I's kingship: the king smiting captives before Amun, with name-rings of conquered places. It records his foreign campaign; it does not itself state his Libyan descent.",
  },
  {
    key: "egl_dougga_ril2",
    title: "Libyco-Punic bilingual dedication of the temple of Masinissa, Dougga (RIL 2 = KAI 101)",
    reference: "Chabot, Recueil des inscriptions libyques no. 2; Donner & Röllig, KAI 101; found in 1904 in the south-west sector of the forum at Dougga (Thugga)",
    sourceType: "archaeological",
    publishedDisplay: "year 10 of Micipsa = 139/138 BCE",
    notes:
      "Cited as the only Libyco-Berber inscription with a date in it: the citizens of Thugga dedicate a sanctuary to Masinissa in the tenth year of his son Micipsa, which Chabot equated with 139 BCE (often given as 139/138). Every earlier date for the script is an inference from something else.",
  },
  {
    key: "egl_bm_ateban",
    title: "Libyco-Punic bilingual inscription from the mausoleum of Ateban, Dougga (British Museum 1852,0305.1 and 1852,0305.2)",
    publisher: "British Museum, London",
    reference: "BM 1852,0305.1 (Libyan half) and 1852,0305.2 (Punic half); removed from the mausoleum by the British consul Thomas Reade in 1842",
    sourceType: "museum",
    publishedDisplay: "Numidian, 2nd century BCE; the Museum's record gives about 146 BCE",
    notes:
      "Cited for the bilingual that let Ferdinand de Saulcy (1843) assign values to the eastern Libyco-Berber letters, and for its removal history. NOT a dated text: the Museum's 'about 146 BC' is an estimate. Details taken from search results summarising the Museum's online record, which could not be opened from this session.",
  },

  // ---------------------------------------------------------------------------
  // Modern scholarship
  // ---------------------------------------------------------------------------
  {
    key: "egl_leahy_1985",
    title: "The Libyan Period in Egypt: An Essay in Interpretation",
    author: "Anthony Leahy",
    workTitle: "Libyan Studies",
    publisher: "Society for Libyan Studies / Cambridge University Press",
    reference: "Libyan Studies 16 (1985)",
    url: "https://www.cambridge.org/core/journals/libyan-studies/article/libyan-period-in-egypt-an-essay-in-interpretation/4473A92DE4DD48EF41D15C198FD24DDA",
    sourceType: "academic_paper",
    publishedYear: 1985,
    publishedDisplay: "1985",
    notes:
      "Cited for the interpretation of the 22nd–24th Dynasties as a LIBYAN period rather than a merely 'Egyptianised' one: persistent Libyan names and titles, decentralised rule by chiefs read as Libyan political practice rather than anarchy, and changes in kingship, language, script and burial. Known here from its published abstract; the full text was not opened.",
  },
  {
    key: "egl_oconnor_1990",
    title: "The nature of Tjemhu (Libyan) society in the later New Kingdom",
    author: "David O'Connor",
    workTitle: "Libya and Egypt c1300–750 BC, ed. Anthony Leahy",
    publisher: "SOAS Centre of Near and Middle Eastern Studies and the Society for Libyan Studies, London",
    reference: "in A. Leahy (ed.), Libya and Egypt c1300–750 BC (1990)",
    sourceType: "academic_book",
    publishedYear: 1990,
    publishedDisplay: "1990",
    notes:
      "Cited as the standard analysis of what the Ramesside war texts reveal about Libu and Meshwesh society — chiefs, households, herds, metal goods — and of the Egyptian ethnonyms as Egyptian categories. Not opened in this session; cited for its subject and standing, not for particular wording.",
  },
  {
    key: "egl_snape_2003",
    title: "The emergence of Libya on the horizon of Egypt",
    author: "Steven Snape",
    workTitle: "Mysterious Lands (Encounters with Ancient Egypt), ed. David O'Connor and Stephen Quirke",
    publisher: "UCL Press, London",
    reference: "chapter 6",
    sourceType: "academic_book",
    publishedYear: 2003,
    publishedDisplay: "2003",
    notes:
      "Cited for the survey of Egyptian terms for western peoples from the Old Kingdom to the Ramesside period (Tjehenu, Tjemehu, Libu, Meshwesh) and for the Ramesside western fortresses, including Zawiyet Umm el-Rakham, excavated by Snape. Not opened in this session.",
  },
  {
    key: "egl_snape_wilson_2007",
    title: "Zawiyet Umm el-Rakham II: The Monuments of Neb-Re",
    author: "Steven Snape and Penelope Wilson",
    publisher: "Rutherford Press, Bolton",
    reference: "excavation report on the Ramesside fortress c. 300 km west of Alexandria",
    sourceType: "archaeological",
    publishedYear: 2007,
    publishedDisplay: "2007",
    notes:
      "Cited for the fortress Ramesses II built on the Marmarican coast, its commander Neb-Re, and evidence of contact (including Libyan presence) at Egypt's western edge before Merneptah's war. Not opened in this session.",
  },
  {
    key: "egl_manassa_2003",
    title: "The Great Karnak Inscription of Merneptah: Grand Strategy in the 13th Century BC",
    author: "Colleen Manassa",
    publisher: "Yale Egyptological Seminar (Yale Egyptological Studies 5), New Haven",
    reference: "YES 5",
    sourceType: "academic_book",
    publishedYear: 2003,
    publishedDisplay: "2003",
    notes:
      "Cited as the modern edition and analysis of the Great Karnak Inscription, which supersedes Breasted's 1906 translation for detailed readings. Not opened in this session.",
  },
  {
    key: "egl_epigraphic_sety_1986",
    title: "The Battle Reliefs of King Sety I (Reliefs and Inscriptions at Karnak IV)",
    author: "The Epigraphic Survey (Oriental Institute, University of Chicago)",
    publisher: "Oriental Institute (Oriental Institute Publications 107), Chicago",
    reference: "OIP 107, Libyan war scenes on the north exterior wall of the Hypostyle Hall",
    sourceType: "archaeological",
    publishedYear: 1986,
    publishedDisplay: "1986",
    notes:
      "Cited for Seti I's campaign scenes against the Tjehenu at Karnak — evidence that the western frontier was an active war front a generation before the Libu appear. Not opened in this session.",
  },
  {
    key: "egl_bates_1914",
    title: "The Eastern Libyans: An Essay",
    author: "Oric Bates",
    publisher: "Macmillan, London",
    reference: "ch. VI (dress and ornament), p. 135 on the side-lock",
    url: "https://archive.org/details/easternlibyanses00bate",
    sourceType: "academic_book",
    publishedYear: 1914,
    publishedDisplay: "1914",
    notes:
      "Cited for the early synthesis of Egyptian depictions of Libyans — side-lock, feathers, open cloaks, tattoos — and Bates's own caution that Egyptian artists gave the side-lock, 'rightly or wrongly', to most Libyans. A 1914 work that freely mixes ancient images with early-20th-century ethnography and racial classification; used here only for what it catalogues, never for its framework.",
  },
  {
    key: "egl_kitchen_tip",
    title: "The Third Intermediate Period in Egypt (1100–650 BC)",
    author: "K. A. Kitchen",
    publisher: "Aris & Phillips, Warminster",
    reference: "2nd edition with supplement (1986; reprinted 1996)",
    sourceType: "academic_book",
    publishedYear: 1996,
    publishedDisplay: "1st edn 1973; 2nd edn 1986, reprinted with new preface 1996",
    notes:
      "Cited for the conventional chronology of the 22nd Dynasty (Shoshenq I c. 945–924 BCE) and the reconstruction of the Libyan dynasties and chiefdoms. Not opened in this session.",
  },
  {
    key: "egl_hornung_2006",
    title: "Ancient Egyptian Chronology",
    author: "Erik Hornung, Rolf Krauss and David A. Warburton (eds)",
    publisher: "Brill, Leiden (Handbook of Oriental Studies 83)",
    reference: "HdO 1.83; Krauss's discussion of the wrš-feast on the Greater Dakhla Stela and the accession of Shoshenq I",
    sourceType: "academic_book",
    publishedYear: 2006,
    publishedDisplay: "2006",
    notes:
      "Cited for the alternative accession of Shoshenq I in 943 BCE derived from a lunar reading of the Year 5 wrš-feast on the Greater Dakhla Stela, and for the conventional ranges used for Merneptah and Ramesses III. Known here through the passage Wikipedia quotes from it, not opened directly.",
  },
  {
    key: "egl_ritner_2009",
    title: "The Libyan Anarchy: Inscriptions from Egypt's Third Intermediate Period",
    author: "Robert K. Ritner",
    publisher: "Society of Biblical Literature (Writings from the Ancient World 21), Atlanta",
    reference: "WAW 21",
    sourceType: "academic_book",
    publishedYear: 2009,
    publishedDisplay: "2009",
    notes:
      "Cited as the modern English translation of the 22nd–24th Dynasty inscriptions, including the Piye stela, the Pasenhor genealogy and the Dakhla stelae, and for the title's deliberately ironic use of the old label 'anarchy'. Not opened in this session.",
  },
  {
    key: "egl_wilkinson_1999",
    title: "Early Dynastic Egypt",
    author: "Toby A. H. Wilkinson",
    publisher: "Routledge, London",
    sourceType: "academic_book",
    reference: "on Protodynastic palettes, the Tjehenu sign and Narmer-era objects",
    publishedYear: 1999,
    publishedDisplay: "1999",
    notes:
      "Cited for the Protodynastic context of the Libyan (Cities) Palette and Narmer-era objects that show defeated western foreigners, and for the caution that the 'Tjehenu' reading of early sign-groups is a reading, not a certainty. Not opened in this session.",
  },
  {
    key: "egl_borchardt_1913",
    title: "Das Grabdenkmal des Königs Śaʾḥu-Reʿ, Band II: Die Wandbilder",
    author: "Ludwig Borchardt",
    publisher: "J. C. Hinrichs, Leipzig",
    reference: "plates of the Libyan booty and smiting scenes from Sahure's mortuary temple at Abusir",
    url: "https://archive.org/details/borchardt1913bd2b",
    sourceType: "archaeological",
    publishedYear: 1913,
    publishedDisplay: "1913",
    notes:
      "Cited as the original publication of Sahure's reliefs, including the 'Libyan booty' scene with its counted cattle, donkeys, goats and sheep and a named Libyan family. Only the catalogue record was opened in this session.",
  },
  {
    key: "egl_kuhlmann_1988",
    title: "Das Ammoneion: Archäologie, Geschichte und Kultpraxis des Orakels von Siwa",
    author: "Klaus P. Kuhlmann",
    publisher: "Philipp von Zabern, Mainz (Archäologische Veröffentlichungen des DAI Kairo 75)",
    reference: "AV 75",
    url: "https://zenon.dainst.org/Record/000013981",
    sourceType: "academic_book",
    publishedYear: 1988,
    publishedDisplay: "1988",
    notes:
      "Cited for the archaeology of the oracle temple at Aghurmi, its dating by royal names to Amasis (570–526 BCE), and the history of the oracle. Only the catalogue entry and secondary reports were seen in this session.",
  },
  {
    key: "egl_asheri_lloyd_corcella_2007",
    title: "A Commentary on Herodotus Books I–IV",
    author: "David Asheri, Alan Lloyd and Aldo Corcella (ed. Oswyn Murray and Alfonso Moreno)",
    publisher: "Oxford University Press",
    reference: "commentary on Book IV, 168–199 (Corcella)",
    sourceType: "academic_book",
    publishedYear: 2007,
    publishedDisplay: "2007",
    notes:
      "Cited for the standard modern assessment of Herodotus' Libyan ethnography: what can be matched to archaeology (the Garamantes, the Nasamones' date-gathering at Augila) and what is hearsay, schematic geography or Greek interpretation. Not opened in this session.",
  },
  {
    key: "egl_brett_fentress_1996",
    title: "The Berbers",
    author: "Michael Brett and Elizabeth Fentress",
    publisher: "Blackwell, Oxford (The Peoples of Africa)",
    reference: "chs. 1–2 (origins, Libyans in Egyptian and Greek sources, religion, funerary monuments)",
    sourceType: "academic_book",
    publishedYear: 1996,
    publishedDisplay: "1996",
    notes:
      "Cited for the general synthesis: the Egyptian and Greek names as exonyms, Libyan cults known through Greek and Roman interpretation (Ammon, the Dii Mauri), and the protohistoric funerary monuments of the Maghreb. Not opened in this session.",
  },
  {
    key: "egl_chabot_1940",
    title: "Recueil des inscriptions libyques",
    author: "Jean-Baptiste Chabot",
    publisher: "Imprimerie nationale, Paris (Gouvernement général de l'Algérie)",
    reference: "RIL no. 2 (Dougga, temple of Masinissa) and the Dougga bilinguals",
    url: "https://archive.org/details/RILRecueilDesInscriptionsLibyques",
    sourceType: "academic_book",
    publishedYear: 1940,
    publishedDisplay: "1940–41",
    notes:
      "Cited for the corpus edition of the Libyan inscriptions and for Chabot's note on RIL 2 equating 'year 10 of Micipsa, counting from the death of Masinissa' with 139 BCE (read in the OCR scan, which is poor at this point).",
  },
  {
    key: "egl_mora_aguiar",
    title: "El origen de la escritura líbico-bereber: dataciones e hipótesis",
    author: "Irma Mora Aguiar",
    workTitle: "Tabona: Revista de Prehistoria y de Arqueología",
    publisher: "Universidad de La Laguna",
    reference: "Tabona 21, pp. 11–28 (cited variously as 2015–2017)",
    sourceType: "academic_paper",
    publishedYear: 2017,
    publishedDisplay: "2015–2017 (the repository and citing works differ on the year)",
    notes:
      "Cited for the review of absolute and relative dates for the Libyco-Berber alphabets: precise dates are few and confined to northern Tunisia and Algeria, and the author favours creation by ancient Libyans under Phoenician alphabetic influence around the middle of the first millennium BCE. Known from its abstract via search results; not opened.",
  },
  {
    key: "egl_pichler_2007",
    title: "Origin and Development of the Libyco-Berber Script",
    author: "Werner Pichler",
    publisher: "Rüdiger Köppe, Köln (Berber Studies 15)",
    reference: "Berber Studies 15",
    sourceType: "academic_book",
    publishedYear: 2007,
    publishedDisplay: "2007",
    notes:
      "Cited for the survey of Libyco-Berber inscriptions across North Africa and the Canaries, the problem that rock inscriptions cannot be directly dated, and proposals placing the start of writing in Morocco and the Canaries around the 7th–6th centuries BCE (an estimate, not a measurement). Not opened in this session.",
  },
  {
    key: "egl_skounti_2003",
    title: "Tirra: aux origines de l'écriture au Maroc",
    author: "Ahmed Skounti, Abdelkhalek Lemjidi and El Mustapha Nami",
    publisher: "Institut Royal de la Culture Amazighe, Rabat",
    reference: "corpus of Libyco-Berber rock inscriptions of Morocco, including the High Atlas (Yagour, Azib n'Ikkis, Oukaïmeden)",
    sourceType: "academic_book",
    publishedYear: 2003,
    publishedDisplay: "2003",
    notes:
      "Cited for the Moroccan rock inscriptions, among them those of the High Atlas, whose early dates rest on association with engraved weapons and on patina rather than on any direct dating. Not opened in this session.",
  },
  {
    key: "egl_kossmann_2012",
    title: "Berber",
    author: "Maarten Kossmann",
    workTitle: "The Afroasiatic Languages, ed. Zygmunt Frajzyngier and Erin Shay",
    publisher: "Cambridge University Press",
    reference: "chapter 2",
    sourceType: "academic_book",
    publishedYear: 2012,
    publishedDisplay: "2012",
    notes:
      "Cited for Berber as a branch of Afroasiatic, the low internal diversity of the modern Berber languages, and the reconstruction of Proto-Berber. Not opened in this session.",
  },
  {
    key: "egl_kossmann_2013",
    title: "The Arabic Influence on Northern Berber",
    author: "Maarten Kossmann",
    publisher: "Brill, Leiden (Studies in Semitic Languages and Linguistics 70)",
    reference: "SSLL 70",
    sourceType: "academic_book",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for the scale of later Arabic contact in Northern Berber, which is one reason modern Berber vocabulary cannot be projected straight back into antiquity. Its subject is the medieval and later contact, not Proto-Berber's date. Not opened in this session.",
  },
  {
    key: "egl_blench_2018",
    title: "Reconciling archaeological and linguistic evidence for Berber prehistory",
    author: "Roger Blench",
    publisher: "circulation draft (Kay Williamson Educational Foundation, Cambridge); later version in Études et Documents Berbères",
    reference: "draft of May 2018 (academia.edu 36664366)",
    sourceType: "academic_paper",
    publishedYear: 2018,
    publishedDisplay: "2018 draft",
    notes:
      "Cited for the argument that reconstructable Proto-Berber looks very recent (as late as c. 200 CE), that this conflicts with textual evidence for Libyan languages long before, and that the gap is best explained by a language-levelling bottleneck in Roman times, with the original spread linked to pastoralism 4,000–5,000 years ago. Known from the abstract and secondary summaries; not opened.",
  },
  {
    key: "egl_fentress_wilson_2016",
    title: "The Saharan Berber diaspora and the southern frontiers of Byzantine North Africa",
    author: "Elizabeth Fentress and Andrew Wilson",
    workTitle: "North Africa under Byzantium and Early Islam, ed. Susan T. Stevens and Jonathan P. Conant",
    publisher: "Dumbarton Oaks Research Library and Collection, Washington DC (Dumbarton Oaks Byzantine Symposia and Colloquia)",
    reference: "pp. 41–63",
    sourceType: "academic_book",
    publishedYear: 2016,
    publishedDisplay: "2016",
    notes:
      "Cited for the argument that Berber-speaking groups moved north out of the Saharan oases in Late Antiquity — a historical mechanism compatible with the linguistic case for late levelling of Berber. Title as given in the Oxford and Cambridge bibliographic records ('... of Byzantine North Africa'; the user's brief gave 'Vandal and Byzantine'). Not opened in this session.",
  },
  {
    key: "egl_serrano_2023",
    title: "The genomic history of the indigenous people of the Canary Islands",
    author: "Javier G. Serrano et al.",
    workTitle: "Nature Communications",
    reference: "Nature Communications 14 (2023); doi:10.1038/s41467-023-40198-w",
    url: "https://doi.org/10.1038/s41467-023-40198-w",
    sourceType: "scientific_study",
    publishedYear: 2023,
    publishedDisplay: "2023",
    notes:
      "Cited for ancient genomes from all seven Canary Islands (3rd–16th centuries CE) showing North African ancestry related to Moroccan Neolithic populations — GENETIC evidence about who settled the islands, which is a separate question from the Berber language the Guanche spoke. Known from the abstract.",
  },
  {
    key: "egl_camps_1961",
    title: "Aux origines de la Berbérie: monuments et rites funéraires protohistoriques",
    author: "Gabriel Camps",
    publisher: "Arts et Métiers Graphiques, Paris",
    reference: "typology of bazinas, chouchet, dolmens and tumuli; distribution maps and dating",
    sourceType: "academic_book",
    publishedYear: 1961,
    publishedDisplay: "1961",
    notes:
      "Cited as the foundational typology and chronology of the protohistoric funerary monuments of the Maghreb: bazinas, chouchet (tower tombs), dolmens such as those of Roknia and Bou Nouara, and tumuli, most dated by grave goods to the first millennium BCE and continuing into the Roman period. Only the opening pages were seen in this session.",
  },
  {
    key: "egl_gatto_2019",
    title: "Burials, Migration and Identity in the Ancient Sahara and Beyond",
    author: "Maria Carmela Gatto, David J. Mattingly, Nick Ray and Martin Sterry (eds)",
    publisher: "Cambridge University Press (Trans-Saharan Archaeology 2)",
    reference: "ISBN 9781108474085",
    sourceType: "academic_book",
    publishedYear: 2019,
    publishedDisplay: "2019",
    notes:
      "Cited for the up-to-date comparative study of Saharan and Maghrebi burial monuments (including Garamantian tombs in the Wadi al-Ajal) and the caution against reading monument types as markers of a single people. Known from the publisher's description; not opened.",
  },

  // ---------------------------------------------------------------------------
  // Wikipedia, as an extra and never alone
  // ---------------------------------------------------------------------------
  {
    key: "egl_wp_libyan_palette",
    title: "Libyan Palette",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Libyan_Palette",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 18 October 2026",
    notes:
      "Extra, for the museum numbers (JE 27434 / CG 14238), the dimensions, the Naqada III date and the reading of the sign group as Tjehenu 'most likely a toponym of Western Nile Delta or ... what was later associated with Libya'.",
  },
  {
    key: "egl_wp_sahure",
    title: "Sahure",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Sahure",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 18 October 2026",
    notes:
      "Extra, for the summary that Sahure's Libyan campaign scene was reused in the temple of Pepi II and in Taharqa's temple at Kawa with the same chieftains' names, so that its historicity is doubtful.",
  },
  {
    key: "egl_wp_libu",
    title: "Libu",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Libu",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 18 October 2026",
    notes: "Extra, for the statement that the earliest occurrence of the name Libu (rbw) is in an inscription of Ramesses II, and the Great Chiefs of the Libu of the later Libyan Period.",
  },
  {
    key: "egl_wp_meshwesh",
    title: "Meshwesh",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Meshwesh",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 18 October 2026",
    notes:
      "Extra, for the first attestation of the Meshwesh under Amenhotep III (cattle delivered to the palace at Malkata), the abbreviation 'Ma', and the proposed but unproven equation with Herodotus' Maxyes.",
  },
  {
    key: "egl_wp_shoshenq",
    title: "Shoshenq I",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Shoshenq_I",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 18 October 2026",
    notes:
      "Extra, for its summary of the chronology debate — Kitchen's 945–924, Krauss's 943 accession from the Greater Dakhla Stela's wrš-feast, Leahy's objection that the lunar reading is hypothetical, and Schneider's 2010 proposal of 962–941 — and for the parentage of Shoshenq I as son of the Great Chief of the Ma Nimlot.",
  },
  {
    key: "egl_wp_proto_berber",
    title: "Proto-Berber language",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Proto-Berber_language",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 18 October 2026",
    notes:
      "Extra, for its summary of the time-depth estimates (Proto-Berber perhaps c. 3,000 years BP by glottochronology; Blench's c. 200 CE levelling), the Punic and Latin loanwords used to date the break-up, and the proposal that Ramesside Egyptian records preserve early Libyan language material.",
  },
  {
    key: "egl_wp_libyco_berber",
    title: "Libyco-Berber alphabet",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Libyco-Berber_alphabet",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 18 October 2026",
    notes:
      "Extra, for the summary that the script's origin is debated (Phoenician-derived, or a local creation inspired by a Phoenician model), that it survived in the Sahara as the ancestor of Tuareg Tifinagh, and that the Dougga bilinguals KAI 100 and 101 underpin its decipherment.",
  },
  {
    key: "egl_wp_siwa",
    title: "Siwa Oasis",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Siwa_Oasis",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 18 October 2026",
    notes:
      "Extra, for the statement that the earliest evidence of a connection with Egypt is Twenty-sixth Dynasty, that the oracle temple lies in the ruins of Aghurmi, and that modern Siwa speaks Siwi, an eastern Berber language.",
  },
  {
    key: "egl_wp_gurzil",
    title: "Gurzil",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Gurzil",
    sourceType: "wikipedia",
    publishedDisplay: "accessed 18 October 2026",
    notes:
      "Extra, for the summary of Corippus on Gurzil as son of Ammon and a cow, carried into battle by the Laguatan in 546 CE, and the proposed link with Ghirza.",
  },
];

// =============================================================================
// PICTURES — every file checked with commons.py `info` in this session.
// =============================================================================

const PICS: Record<string, SeedPicture[]> = {
  "tjehenu-and-tjemehu-early-egyptian-records": [
    commonsPicture({
      fileName: "Libyan Palette.jpg",
      caption:
        "The Libyan or Cities Palette in the Egyptian Museum, Cairo: the surviving lower part of a Protodynastic schist palette with registers of animals and a grove of trees, beside which a sign group is usually read 'Tjehenu'. It is the object itself; whether the sign names a western people or a region of the Delta is the debated part.",
      shows: "artefact",
      identificationStatus: "secure",
      licence: "CC BY-SA 2.0",
      creator: "Zeinab Mohamed",
      institution: "Egyptian Museum, Cairo",
      accessionNumber: "JE 27434 / CG 14238",
      objectDate: "Naqada III / Protodynastic, c. 3200–3000 BCE",
      pixelWidth: 4592,
      pixelHeight: 2576,
    }),
    commonsPicture({
      fileName:
        "Gods Seth and Sopdu presenting Libyan, Nubian, and West Asiatic prisoners to Pharaoh Sahure. From the Pyramid Complex of Sahure at Abusir, Egypt. 2496-2483 BCE. Neues Museum.jpg",
      caption:
        "Relief fragment from Sahure's mortuary temple at Abusir (Fifth Dynasty): the gods Seth and Sopdu lead bound foreign captives, Libyans among them, towards the king. It is from the same temple as the 'Libyan booty' scene but is not that scene; it shows the Egyptian convention of foreigners presented as tribute to the king.",
      shows: "artefact",
      identificationStatus: "secure",
      licence: "CC BY-SA 4.0",
      creator: "Osama Shukir Muhammed Amin FRCP(Glasg)",
      institution: "Neues Museum, Berlin",
      accessionNumber: "ÄM 21782",
      objectDate: "Fifth Dynasty, reign of Sahure",
      pixelWidth: 4016,
      pixelHeight: 4604,
    }),
    commonsPicture({
      fileName:
        "A procession of Libyan, Nubian, and West Asiatic prisoners before Pharaoh Sahure. From the Pyramid Complex of Sahure at Abusir, Egypt. 2496-2483 BCE. Neues Museum.jpg",
      caption:
        "Detail of the same Berlin relief block from Sahure's temple, showing the registers of bound captives. The museum identifies Libyans, Nubians and West Asiatics among them by the Egyptian conventions of hair and dress for each — an Egyptian classification, not a portrait of individuals.",
      shows: "artefact",
      identificationStatus: "secure",
      licence: "CC BY-SA 4.0",
      creator: "Osama Shukir Muhammed Amin FRCP(Glasg)",
      institution: "Neues Museum, Berlin",
      accessionNumber: "ÄM 21782",
      objectDate: "Fifth Dynasty, reign of Sahure",
      pixelWidth: 5784,
      pixelHeight: 2960,
    }),
    commonsPicture({
      fileName: "Flickr - schmuela - IMG 6388.jpg",
      caption:
        "Relief from the tomb of Harkhuf at Qubbet el-Hawa, Aswan, whose autobiography reports that the ruler of Yam was going 'to the land of Temeh to smite Temeh'. The tomb is the source of that Sixth Dynasty reference to the Tjemehu; this photograph shows its decoration, not the passage itself.",
      shows: "artefact",
      identificationStatus: "secure",
      licence: "CC BY-SA 2.0",
      creator: "Karen Green",
      institution: "Qubbet el-Hawa, Aswan",
      objectDate: "Sixth Dynasty, 23rd century BCE",
      pixelWidth: 1200,
      pixelHeight: 1600,
    }),
  ],

  "libu-merneptah-libyan-war": [
    commonsPicture({
      fileName: "Merenptah Israel Stele Cairo.jpg",
      caption:
        "The victory stela of Merneptah ('Israel stela') in the Egyptian Museum, Cairo. Most of its 28 lines celebrate the Year 5 defeat of the Libu chief Meryey; only the closing lines turn to Canaan and name Israel.",
      shows: "manuscript",
      identificationStatus: "secure",
      licence: "CC BY-SA 3.0",
      creator: "Webscribe",
      institution: "Egyptian Museum, Cairo",
      accessionNumber: "JE 31408",
      objectDate: "Year 5 of Merneptah (conventionally 1208 BCE)",
      pixelWidth: 491,
      pixelHeight: 768,
    }),
    commonsPicture({
      fileName: "Great Karnak inscription (first part) - plate 52 from Mariette Bey.jpg",
      caption:
        "Auguste Mariette's 1875 hand copy of the first part of Merneptah's Great Karnak Inscription, the longest account of the Libyan war. A 19th-century copy, not a photograph: useful for seeing the text's layout and damage, but modern editions correct its readings.",
      shows: "historical_document",
      identificationStatus: "secure",
      licence: "Public domain",
      creator: "Auguste Mariette",
      objectDate: "inscription: reign of Merneptah; copy published 1875",
      pixelWidth: 1242,
      pixelHeight: 1296,
    }),
    commonsPicture({
      fileName: "Zawiyet Umm el-Rakham 11.JPG",
      caption:
        "Remains of the Ramesside fortress at Zawiyet Umm el-Rakham on the Mediterranean coast west of Alexandria, one of the strongholds Ramesses II built on the western frontier before Merneptah's Libyan war. Site context for the frontier, not a picture of the war.",
      shows: "site",
      identificationStatus: "secure",
      licence: "CC BY-SA 3.0",
      creator: "Einsamer Schütze",
      objectDate: "fortress: reign of Ramesses II; photographed 2006",
      pixelWidth: 3456,
      pixelHeight: 2304,
    }),
  ],

  "meshwesh-ramesses-iii-medinet-habu": [
    commonsPicture({
      fileName: "Medinet Habu-plate -1.png",
      caption:
        "Libyan captives of Ramesses III's First Libyan War (Year 5), from the Oriental Institute's 1930 facsimile drawings of the Medinet Habu reliefs. A scholarly line drawing of the relief, with the side-locks and long cloaks Egyptian artists gave Libyans; it records the carving, and the carving records an Egyptian ideal of the defeated enemy.",
      shows: "scientific_figure",
      identificationStatus: "secure",
      licence: "Public domain",
      creator: "The Epigraphic Survey, Oriental Institute (ed. James H. Breasted)",
      institution: "Medinet Habu, western Thebes (the relief)",
      objectDate: "relief: reign of Ramesses III; drawing published 1930",
      pixelWidth: 796,
      pixelHeight: 714,
    }),
    commonsPicture({
      fileName: "Medinet Habu-plate 20.png",
      caption:
        "Battle with the Libyans in Ramesses III's Year 5 war, from the Oriental Institute's 1930 facsimile of the Medinet Habu reliefs: the king in his chariot overruns Libyan warriors. Royal battle art follows a set composition, so the scene is evidence of how the war was presented, not a record of the field.",
      shows: "scientific_figure",
      identificationStatus: "secure",
      licence: "Public domain",
      creator: "The Epigraphic Survey, Oriental Institute (ed. James H. Breasted)",
      institution: "Medinet Habu, western Thebes (the relief)",
      objectDate: "relief: reign of Ramesses III; drawing published 1930",
      pixelWidth: 1023,
      pixelHeight: 802,
    }),
    commonsPicture({
      fileName: "Ramesses III faience tile - Libyan chief.jpg",
      caption:
        "Glazed tile of a tattooed Libyan chief with side-lock and patterned robe, made for a palace of Ramesses III and found at Tell el-Yahudiya, now in the Cleveland Museum of Art. Such tiles lined throne-room surfaces so the king literally stood over foreigners: it is ideological decoration, though its tattoo patterns echo the reliefs.",
      shows: "artefact",
      identificationStatus: "secure",
      licence: "CC BY-SA 2.0",
      creator: "Tim Evanson",
      institution: "Cleveland Museum of Art",
      objectDate: "reign of Ramesses III, 12th century BCE",
      pixelWidth: 1371,
      pixelHeight: 2500,
    }),
    commonsPicture({
      fileName:
        'From Richard Lepsius - Ethnic groups "Table Nations" portrayed in the Book of Gates, 4th Division, 5th Hour, Tomb of Seti I.jpg',
      caption:
        "Lepsius's 19th-century engraving of the 'peoples of the world' scene in the Book of Gates in the tomb of Seti I: Egyptians, Asiatics, Nubians and Libyans, the Libyans with side-locks, feathers and tattooed robes. It is an Egyptian theological picture of the four kinds of humanity under the sun god, drawn again by a European copyist — not an ethnographic record, and not a 'race' chart.",
      shows: "engraving",
      identificationStatus: "secure",
      licence: "Public domain",
      creator: "Karl Richard Lepsius; illustrator Ernst Weidenbach",
      institution: "Tomb of Seti I (KV17), Valley of the Kings",
      objectDate: "painting: reign of Seti I; engraving published 1849–1859",
      pixelWidth: 500,
      pixelHeight: 349,
    }),
  ],

  "shoshenq-i-twenty-second-dynasty": [
    commonsPicture({
      fileName: "Bubastis portal at Karnak.jpg",
      caption:
        "The Bubastite Portal in the precinct of Amun-Re at Karnak, carrying the cartouches of Shoshenq I. The gateway and the triumph relief beside it are his principal monument; they present him as a traditional pharaoh and say nothing of his Libyan descent.",
      shows: "site",
      identificationStatus: "secure",
      licence: "CC BY-SA 3.0",
      creator: "Markh at English Wikipedia",
      institution: "Karnak, Luxor",
      objectDate: "late reign of Shoshenq I, 10th century BCE",
      pixelWidth: 3072,
      pixelHeight: 2048,
    }),
    commonsPicture({
      fileName: "Karnak Tempel 19.jpg",
      caption:
        "Shoshenq I's triumph relief on the south exterior wall at Karnak, beside the Bubastite Portal: the god Amun with rows of name-rings for places in Palestine and the Negev, the basis for identifying Shoshenq with the biblical Shishak.",
      shows: "artefact",
      identificationStatus: "secure",
      licence: "CC BY 3.0",
      creator: "Olaf Tausch",
      institution: "Karnak, Luxor",
      objectDate: "late reign of Shoshenq I, 10th century BCE",
      pixelWidth: 3128,
      pixelHeight: 4170,
    }),
    commonsPicture({
      fileName: "Apis Aakheperre 37 Mariette.jpg",
      caption:
        "Auguste Mariette's 19th-century drawing of the Serapeum stela of Pasenhor, dated to the burial of an Apis bull in Year 37 of Shoshenq V. Its text traces Pasenhor's family — and through it the Twenty-second Dynasty — back sixteen generations to 'the Libyan, Buyuwawa'. A drawing of the stela, not a photograph.",
      shows: "historical_document",
      identificationStatus: "secure",
      licence: "Public domain",
      creator: "Auguste Mariette",
      institution: "Musée du Louvre, Paris",
      accessionNumber: "S 1959 (per the Commons description)",
      objectDate: "stela: Year 37 of Shoshenq V, 8th century BCE; drawing 19th century",
      pixelWidth: 649,
      pixelHeight: 1025,
    }),
    commonsPicture({
      fileName: "Stele Shoshenq Abydos Mariette.jpg",
      caption:
        "Mariette's 1880 drawing of the Abydos stela on which a 'Great Chief of the Ma' named Shoshenq, with the approval of Amun's oracle under Psusennes II, endows the cult of Nimlot. Usually read as the future Shoshenq I honouring his father; Breasted took him for the king's grandfather.",
      shows: "historical_document",
      identificationStatus: "probable",
      licence: "Public domain",
      creator: "Auguste Mariette",
      objectDate: "stela: reign of Psusennes II, mid-10th century BCE; drawing 1880",
      pixelWidth: 2180,
      pixelHeight: 2080,
    }),
  ],

  "libyan-chiefdoms-of-the-ma": [
    commonsPicture({
      fileName: "Tefnakht Athens stela (T. Efthimiadis).jpg",
      caption:
        "Donation stela of Tefnakht from Sais, dedicated to the goddess Neith, now in the National Archaeological Museum, Athens. Tefnakht held the titles Great Chief of the Libu and of the Ma before claiming kingship; this stela dates from his reign as king.",
      shows: "artefact",
      identificationStatus: "secure",
      licence: "CC BY 2.0",
      creator: "Tilemahos Efthimiadis",
      institution: "National Archaeological Museum, Athens",
      objectDate: "reign of Tefnakht, late 8th century BCE",
      pixelWidth: 3000,
      pixelHeight: 4000,
    }),
  ],

  "siwa-oracle-of-ammon": [
    commonsPicture({
      fileName: "Siwa Oasis, Temple of the Oracle of Amun, Egypt.jpg",
      caption:
        "The ruins of the oracle temple of Amun (Ammon) on the rock of Aghurmi in the Siwa Oasis. The temple building is dated to the reign of Amasis (570–526 BCE); this is the sanctuary Alexander visited in 332/331 BCE.",
      shows: "site",
      identificationStatus: "secure",
      licence: "CC BY 4.0",
      creator: "Vyacheslav Argenberg",
      institution: "Aghurmi, Siwa Oasis",
      objectDate: "temple: 6th century BCE; photographed 2007",
      pixelWidth: 3072,
      pixelHeight: 2048,
    }),
    commonsPicture({
      fileName: "SiwaAghurmiTemple.jpg",
      caption:
        "The oracle temple at Aghurmi seen from the south, a separate photograph of the same building, showing its plain stone walls rising out of the mud-brick remains of the old village.",
      shows: "site",
      identificationStatus: "secure",
      licence: "CC BY-SA 3.0",
      creator: "Roland Unger",
      institution: "Aghurmi, Siwa Oasis",
      objectDate: "temple: 6th century BCE; photographed 2001",
      pixelWidth: 800,
      pixelHeight: 530,
    }),
    commonsPicture({
      fileName: "SiwaUbeidaEastWall.jpg",
      caption:
        "The surviving east wall of the second temple of Amun at Umm Ubayda in the Siwa depression, a later building of the 4th century BCE near the oracle temple, with Egyptian-style relief decoration.",
      shows: "site",
      identificationStatus: "secure",
      licence: "CC BY-SA 3.0",
      creator: "Roland Unger",
      institution: "Umm Ubayda, Siwa Oasis",
      objectDate: "temple: 4th century BCE; photographed 2007",
      pixelWidth: 530,
      pixelHeight: 800,
    }),
    commonsPicture({
      fileName: "Kyrene - 435-375 BC - silver tetradrachm - silphium plant - head of Zeus Ammon - Berlin MK AM 18216669.jpg",
      caption:
        "Silver tetradrachm of the Greek city of Cyrene, c. 435–375 BCE, with the silphium plant on one side and the ram-horned head of Zeus Ammon on the other: Greek Cyrenaica made the oracle god of the Libyan desert its own.",
      shows: "artefact",
      identificationStatus: "secure",
      licence: "CC BY-SA 4.0",
      creator: "ArchaiOptix",
      institution: "Münzkabinett, Staatliche Museen zu Berlin",
      accessionNumber: "18216669",
      objectDate: "c. 435–375 BCE",
      pixelWidth: 2477,
      pixelHeight: 2477,
    }),
  ],

  "herodotus-describes-libya": [
    commonsPicture({
      fileName: "Herodotus world map-en.svg",
      caption:
        "A modern reconstruction map of the world as Herodotus described it, with 'Libya' as the land west of Egypt. It is a modern drawing of a 5th-century BCE mental map, so it shows his geography, not real coastlines or the positions of peoples.",
      shows: "map",
      identificationStatus: "secure",
      licence: "Public domain",
      creator: "Bibi Saint-Pol",
      objectDate: "modern reconstruction, 2006",
      pixelWidth: 840,
      pixelHeight: 508,
    }),
    commonsPicture({
      fileName: "Marble bust of Herodotos MET DT11742 (cropped).jpg",
      caption:
        "Roman marble portrait bust of Herodotus, 2nd century CE, in the Metropolitan Museum of Art — a Roman copy made some six centuries after his death, presumably of a Greek original. A portrait of the writer, not evidence about Libya.",
      shows: "portrait",
      identificationStatus: "probable",
      licence: "CC0",
      institution: "Metropolitan Museum of Art, New York",
      objectDate: "2nd century CE",
      pixelWidth: 2232,
      pixelHeight: 2978,
    }),
  ],

  "libyco-berber-script-earliest-inscriptions": [
    commonsPicture({
      fileName: "Dédicace punico-berbère en l'honneur du roi Massinissa.jpg",
      caption:
        "The bilingual Libyan and Punic dedication from Dougga to the Numidian king Masinissa (RIL 2), the only Libyco-Berber inscription with an internal date, year 10 of Micipsa (139/138 BCE). The identification rests on the file's description of a bilingual stela dedicated to the Numidian king at Dougga.",
      shows: "manuscript",
      identificationStatus: "probable",
      licence: "CC0",
      creator: "MTLCanadien",
      objectDate: "139/138 BCE",
      pixelWidth: 1028,
      pixelHeight: 771,
    }),
    commonsPicture({
      fileName: "Stèle libyque bilingue de Dougga.png",
      caption:
        "A cast of the bilingual Libyan-Punic dedication from Dougga dated to the reign of Micipsa, showing the Libyco-Berber lines above or beside the Punic text. A cast, not the original stone; it may be a cast of the same inscription as the previous picture.",
      shows: "replica",
      identificationStatus: "probable",
      licence: "CC0",
      creator: "MTLCanadien",
      objectDate: "original 139/138 BCE; cast modern",
      pixelWidth: 1700,
      pixelHeight: 1276,
    }),
    commonsPicture({
      fileName: "Inscription bilingue de Thugga.jpg",
      caption:
        "UNVERIFIED — The file is labelled only as the Numidian–Punic bilingual inscription of Thugga (Dougga), 2nd century BCE, with no statement of which of the Dougga bilinguals it shows or whether it is a photograph or an old drawing. It shows a two-part inscription in Libyan and Punic letters; it is probably, but not certainly, the Ateban mausoleum bilingual now in the British Museum.",
      shows: "unverified_image",
      identificationStatus: "unverified",
      licence: "Public domain",
      objectDate: "2nd century BCE (per file)",
      pixelWidth: 800,
      pixelHeight: 409,
    }),
    commonsPicture({
      fileName: "Mausoleum of Ateban (25085508337).jpg",
      caption:
        "The Libyco-Punic mausoleum at Dougga, rebuilt in 1908–10 after the consul Thomas Reade cut out its bilingual inscription in 1842. That inscription, now in the British Museum, gave the key to the eastern Libyan alphabet in 1843; it is not dated.",
      shows: "site",
      identificationStatus: "secure",
      licence: "CC BY 2.0",
      creator: "David Stanley",
      institution: "Dougga (Thugga), Tunisia",
      objectDate: "monument: 2nd century BCE; photographed 2017",
      pixelWidth: 768,
      pixelHeight: 1024,
    }),
    commonsPicture({
      fileName: "Tifinagh Algeria.jpg",
      caption:
        "Tifinagh letters painted or engraved on a rock in the Tamanrasset region of the Algerian Sahara. Tuareg Tifinagh descends from the ancient Libyco-Berber script; inscriptions like this are generally undated and many are recent.",
      shows: "site",
      identificationStatus: "secure",
      licence: "CC BY-SA 2.0",
      creator: "Patrick Gruban",
      institution: "Tamanrasset Province, Algeria",
      objectDate: "undated; photographed 2006",
      pixelWidth: 3072,
      pixelHeight: 2044,
    }),
  ],

  "amazigh-language-earliest-evidence": [
    commonsPicture({
      fileName: "Numidjanska stela3.jpg",
      caption:
        "A Numidian stela with a vertical Libyan (Libyco-Berber) inscription in the Bardo National Museum, Tunis. Texts like this are the earliest writing in an ancient Libyan language; they can be transliterated but are only partly understood.",
      shows: "manuscript",
      identificationStatus: "secure",
      licence: "CC BY-SA 3.0 rs",
      creator: "Gmihail at Serbian Wikipedia",
      institution: "Bardo National Museum, Tunis",
      objectDate: "Numidian period, c. 2nd–1st century BCE (not individually dated)",
      pixelWidth: 2304,
      pixelHeight: 3072,
    }),
    commonsPicture({
      fileName: "Libyco-berber alphabet funerary stele of Tunisia Sbeitla Museum.jpg",
      caption:
        "Funerary stele with a vertical Libyco-Berber inscription from Sidi Ali Bahloul (Jedilane region, Tunisia), in the Sbeitla Museum. Most surviving Libyan texts are short epitaphs of this kind, mostly personal names and kin terms.",
      shows: "manuscript",
      identificationStatus: "secure",
      licence: "CC BY-SA 4.0",
      creator: "DrRachT",
      institution: "Sbeitla Museum, Tunisia",
      objectDate: "undated (Numidian or Roman period)",
      pixelWidth: 2277,
      pixelHeight: 2665,
    }),
  ],

  "indigenous-north-african-religion-and-sacred-sites": [
    commonsPicture({
      fileName: "Chimtou, Felsrelief der Dii Mauri.jpg",
      caption:
        "Rock relief at Chemtou (ancient Simitthus, Tunisia) usually identified as a row of the Dii Mauri, the 'Moorish gods' of Roman-period dedications. The Latin label is Roman; the relief is our nearest image of these indigenous deities, and its identification rests on scholarly interpretation.",
      shows: "artefact",
      identificationStatus: "probable",
      licence: "CC BY-SA 3.0",
      creator: "Daniela Gauss",
      institution: "Chemtou (Simitthus), Tunisia",
      objectDate: "Roman period",
      pixelWidth: 787,
      pixelHeight: 527,
    }),
    commonsPicture({
      fileName: "Gurzil.PNG",
      caption:
        "Fulgence Fresnel's 1846 copy of a neo-Punic inscription from Lepcis Magna in which the name of the god Gurzil has been read. A 19th-century hand copy, so the reading depends on the copy's accuracy as well as the interpretation.",
      shows: "historical_document",
      identificationStatus: "possible",
      licence: "Public domain",
      creator: "Fulgence Fresnel",
      objectDate: "inscription: Roman period; copy 1846",
      pixelWidth: 1008,
      pixelHeight: 613,
    }),
    commonsPicture({
      fileName: "Ghirza n general.JPG",
      caption:
        "The northern cemetery of Ghirza in the Libyan pre-desert, a late Roman farming settlement whose name has been linked to the god Gurzil and where a relief of bull sacrifice was found. The site is secure; the link to Gurzil is a proposal.",
      shows: "site",
      identificationStatus: "secure",
      licence: "CC BY-SA 4.0",
      creator: "Jona Lendering",
      institution: "Ghirza, Libya",
      objectDate: "tombs: 3rd–5th centuries CE; photographed 2006",
      pixelWidth: 800,
      pixelHeight: 531,
    }),
  ],

  "ancient-north-african-burial-monuments": [
    commonsPicture({
      fileName: "Bazina Sigus.jpg",
      caption:
        "A bazina — a round stepped stone tomb — at Sigus in eastern Algeria, one of the commonest indigenous funerary monuments of the protohistoric Maghreb.",
      shows: "site",
      identificationStatus: "secure",
      licence: "CC BY-SA 4.0",
      creator: "Potymkin",
      institution: "Sigus, Algeria",
      objectDate: "undated monument; photographed 2024",
      pixelWidth: 1330,
      pixelHeight: 653,
    }),
    commonsPicture({
      fileName: "GM Guelma Roknia01.jpg",
      caption:
        "Part of the dolmen necropolis of Roknia near Guelma, Algeria, where thousands of slab-built chamber tombs line the hillside. Their contents point mostly to the first millennium BCE.",
      shows: "site",
      identificationStatus: "secure",
      licence: "CC BY-SA 3.0",
      creator: "M. Gasmi",
      institution: "Roknia, Guelma Province, Algeria",
      objectDate: "photographed before 2006",
      pixelWidth: 500,
      pixelHeight: 314,
    }),
    commonsPicture({
      fileName: "PSM V58 D409 Dolmens at rocknia algeria.png",
      caption:
        "Dolmens at Roknia as published in Popular Science Monthly around 1900 — an early illustration, valuable for showing the tombs before modern disturbance, from a period when they were often wrongly linked to European megalith builders.",
      shows: "historical_document",
      identificationStatus: "secure",
      licence: "Public domain",
      objectDate: "published c. 1900–1901",
      pixelWidth: 1183,
      pixelHeight: 2682,
    }),
    commonsPicture({
      fileName: "Drum-shaped tomb.png",
      caption:
        "A modern explanatory drawing of a drum-shaped (chouchet-type) tomb of the Garamantian Sahara, with and without a stele: a diagram of the monument type, not a picture of a particular tomb.",
      shows: "diagram",
      identificationStatus: "secure",
      licence: "CC BY-SA 4.0",
      creator: "Heribertus2",
      objectDate: "modern drawing, 2026",
      pixelWidth: 2236,
      pixelHeight: 1260,
    }),
  ],
};

const events: SeedEvent[] = [
  // ===========================================================================
  // EGYPT LANE
  // ===========================================================================
  {
    slug: "tjehenu-and-tjemehu-early-egyptian-records",
    title: "Tjehenu and Tjemehu: Egypt's earliest records of its western neighbours",
    summary:
      "From about 3200–3000 BCE Egyptian objects and, later, royal reliefs and officials' autobiographies name peoples to the west — Tjehenu and Tjemehu. They are Egyptian words for outsiders, and the pictures are royal propaganda as much as reporting.",
    description:
      "WHAT IT IS. The oldest written Egyptian words for the people living west of the Nile valley. Two names recur. TJEHENU (Egyptian thnw) is the older and is tied to the western Delta and its fringe; TJEMEHU (tmḥw, earlier tmḥ) appears in the Sixth Dynasty for people further out in the desert. Neither is what these people called themselves, and neither is an ethnic label in any modern sense: they are geographical and political categories in an Egyptian view of the world, in which the west was one of the directions foreigners came from.\n\n" +
      "THE EVIDENCE, OLDEST FIRST. (1) The so-called Libyan or Cities Palette (Cairo JE 27434 / CG 14238), Naqada III, roughly 3200–3000 BCE: one face shows registers of cattle, donkeys and rams above a grove of trees with a sign group most scholars read 'Tjehenu'; the other shows seven walled places attacked by animals or standards. Whether this is booty from a western people, a list of places in the western Delta, or something else is not settled. (2) Narmer-era objects showing a king subduing captives are sometimes connected with the west; the readings are uncertain and are not relied on here. (3) In the Fifth Dynasty, King Sahure's mortuary temple at Abusir (c. 2480s BCE) carried a 'Libyan booty' relief: the king smiting a Libyan chief, a named Libyan family, and huge counts of cattle, donkeys, goats and sheep. (4) In the Sixth Dynasty, the official Weni recruited troops 'in the land of Temeh', and Harkhuf, on his third journey, found the ruler of Yam going 'to the land of Temeh to smite Temeh as far as the western corner of heaven' (Breasted's translation).\n\n" +
      "WHAT IT DOES NOT SHOW. The Sahure scene was copied — chieftains' names and all — in the temple of Pepi II some two centuries later and again by Taharqa at Kawa about 1,800 years later. A scene that can be recopied with the same names is a template of victory, so it is not safe evidence of a particular war under Sahure; he may himself have copied an older original. The palette's 'Tjehenu' may name a place rather than a people. None of this tells us what language these people spoke or how they were related to later North Africans.\n\n" +
      "ON NAMES. These are the earliest records of populations of the western desert and Delta fringe. They are not 'Berbers', 'Amazigh' or 'Moors' in any source; the much later Greek word 'Libyans' is itself an exonym, borrowed from the Libu (see the next record).\n\n" +
      "WHERE THE DATES DISAGREE. The palette is dated by style, not by any text; Old Kingdom reign dates vary by a few decades between chronologies. The user's brief proposed c. 3100 BCE for the palette and c. 2450 BCE for Sahure; both are within the ranges below.",
    category: "history",
    subcategory: MOORS_LANES.egypt,
    eventType: "historical",
    identificationStatus: "probable",
    tags: laneTags("egypt", "tjehenu", "tjemehu", "libyans", "old-kingdom", "sahure", "libyan-palette", "western-desert"),
    people: ["Sahure", "Weni", "Harkhuf", "Pepi II", "Taharqa"],
    civilisations: ["Ancient Egypt", "Amazigh peoples"],
    locationName: "Egypt's western frontier: the western Delta and the Western Desert (objects from Abydos and Abusir)",
    claims: [
      {
        sourceKey: "egl_libyan_palette",
        citations: [
          { sourceKey: "egl_wilkinson_1999", relation: "context", note: "Places the palette among Protodynastic ceremonial palettes and cautions that early sign-group readings such as 'Tjehenu' are interpretations." },
          { sourceKey: "egl_wp_libyan_palette", relation: "supports", note: "Gives the museum numbers, the Naqada III date of c. 3200–3000 BCE and the usual reading of the sign as Tjehenu." },
        ],
        startYear: bce(3200),
        endYear: bce(3000),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The Libyan (Cities) Palette with the sign group read 'Tjehenu'",
        originalDateText: "Naqada III / Protodynastic, c. 3200–3000 BCE",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        evidence:
          "Dated by the style of its carving and by comparison with other late predynastic palettes; there is no inscription giving a date or a king. The range is therefore a period, not a year. The sign group's reading as 'Tjehenu' is widely accepted but it is a reading of an early sign, and whether it names a people or a region of the western Delta is debated.",
      },
      {
        sourceKey: "egl_borchardt_1913",
        citations: [
          { sourceKey: "egl_wp_sahure", relation: "supports", note: "Summarises the Libyan campaign scene and its reuse with the same chieftains' names by Pepi II and by Taharqa at Kawa." },
          { sourceKey: "egl_snape_2003", relation: "context", note: "Surveys Old Kingdom references to western peoples and the propaganda character of the booty scenes." },
        ],
        startYear: bce(2490),
        endYear: bce(2470),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Sahure's 'Libyan booty' relief at Abusir",
        originalDateText: "Reign of Sahure, Fifth Dynasty, c. 2490–2470 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "The relief belongs to Sahure's mortuary temple and so is dated by his reign; Fifth Dynasty absolute dates differ by a few decades between chronologies. The date is the date of the RELIEF. Because the same scene with the same names recurs centuries later, it does not date a historical war.",
      },
      {
        sourceKey: "egl_breasted_ar1",
        citations: [{ sourceKey: "egl_snape_2003", relation: "context", note: "Treats Tjemehu as the Sixth Dynasty term for desert peoples further from the valley than the Tjehenu." }],
        startYear: bce(2330),
        endYear: bce(2250),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Weni's and Harkhuf's references to the land of Temeh (Tjemehu)",
        originalDateText: "Sixth Dynasty, reigns of Pepi I and Merenre, c. 2330–2250 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "Both texts are tomb autobiographies of officials whose careers are dated by the kings they served (Weni under Pepi I and Merenre; Harkhuf under Merenre and Pepi II). The passages are Breasted I §311 and §§333–336. The absolute dates are conventional and approximate.",
      },
    ],
    media: [],
  },

  {
    slug: "libu-merneptah-libyan-war",
    title: "The Libu and Merneptah's Libyan war (Year 5, c. 1208 BCE)",
    summary:
      "The Libu first appear in Egyptian texts under Ramesses II; in Merneptah's fifth year (conventionally 1208 BCE) their chief Meryey, son of Ded, led a coalition with 'sea peoples' into the western Delta and was defeated at Perire. The Greek name 'Libyans' comes from them.",
    description:
      "DATE CORRECTED. The brief's '1300 BCE — Libu: early Egyptian references' is too early. The name Libu (Egyptian rbw) is first attested under Ramesses II (c. 1279–1213 BCE), and the event that makes the Libu famous is Merneptah's war in his Year 5, conventionally 1208 BCE. Before the Libu, Seti I had already fought 'Tjehenu' on the western frontier, and Ramesses II built a chain of fortresses along the coast west of the Delta, the best known at Zawiyet Umm el-Rakham some 300 km west of Alexandria.\n\n" +
      "WHAT THE TEXTS SAY. Three Egyptian monuments carry the war: the Great Karnak Inscription (the longest), a stela from Athribis, and the Cairo 'Israel' stela. Breasted's translation of the Karnak text has a messenger report that 'the wretched, fallen chief of Libya, Meryey, son of Ded, has fallen upon the country of Tehenu with his bowmen', together with Sherden, Shekelesh, Ekwesh, Luka and Teresh, and that he had brought his wife and children — the detail that has made historians read the invasion as a migration rather than a raid. The battle was fought at Perire in the western Delta; the Egyptian figures are over 9,000 enemy dead, with prisoners, cattle and weapons. The Israel stela, whose last lines contain the first mention of Israel, is mostly about this war; in Breasted's translation it says that 'Sutekh has turned his back upon their chief' and closes 'Wasted is Tehenu'.\n\n" +
      "WHY SET APPEARS. The Egyptian god of the desert and foreign lands, Seth (Sutekh), is here the god who withdraws favour from the Libyan chief — in a Nineteenth Dynasty whose kings were named for Seth. Read with the Set records already on this timeline.\n\n" +
      "WHAT IT DOES NOT SHOW. These are royal victory texts with formulaic numbers and insults. Identifications of the sea peoples (Sherden = Sardinians, Teresh = Tyrsenoi/Etruscans, Ekwesh = Achaeans), stated confidently by Breasted in 1906, remain conjectures. The texts tell us what the Egyptian state wanted remembered about a Libyan coalition, not how Libu society saw itself.\n\n" +
      "ON NAMES. Greek settlers in Cyrenaica took over the name of the Libu, and 'Libya' became the Greek word for all of Africa west of Egypt. That makes 'Libyan' an exonym twice over. It does not make every later North African a descendant of the Libu.",
    category: "history",
    subcategory: MOORS_LANES.egypt,
    eventType: "historical",
    identificationStatus: "secure",
    evidenceStatus: "strongly_documented",
    tags: laneTags("egypt", "libu", "merneptah", "meryey", "sea-peoples", "perire", "israel-stela", "great-karnak-inscription", "nineteenth-dynasty", "zawiyet-umm-el-rakham"),
    people: ["Merneptah", "Meryey", "Ded", "Ramesses II", "Seti I"],
    civilisations: ["Ancient Egypt", "Amazigh peoples"],
    locationName: "Western Nile Delta (battle at Perire, exact site unknown); texts at Karnak, Thebes and Athribis",
    claims: [
      {
        sourceKey: "egl_breasted_ar3",
        citations: [
          { sourceKey: "egl_merneptah_stela", relation: "supports", note: "The Cairo stela is itself dated to Year 5 of Merneptah and celebrates the Libyan victory." },
          { sourceKey: "egl_manassa_2003", relation: "supports", note: "Modern edition and analysis of the Great Karnak Inscription, the fullest account of the campaign." },
          { sourceKey: "egl_hornung_2006", relation: "supports", note: "Source for the conventional absolute chronology that places Merneptah's accession c. 1213 and so Year 5 c. 1208 BCE." },
          { sourceKey: "egl_wp_libu", relation: "context", note: "Gives the 1208 BCE equivalent and summarises the war and the name's later Greek use." },
        ],
        startYear: bce(1208),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "absolute_date",
        whatIsDated: "Merneptah's Year 5 victory over Meryey of the Libu at Perire",
        originalDateText: "Year 5 of Merneptah, third month of the third season (conventionally 1208 BCE)",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "The texts date the battle precisely within Merneptah's reign (Year 5, in the eleventh month of the Egyptian year). Converting that to 1208 BCE depends on the absolute chronology of the Nineteenth Dynasty, which can shift by a few years; older literature (including Breasted, 1906) used higher dates. CORRECTION: the brief's 1300 BCE predates both the first attestation of the Libu and this war.",
      },
      {
        sourceKey: "egl_wp_libu",
        citations: [
          { sourceKey: "egl_snape_2003", relation: "supports", note: "Discusses the appearance of the Libu in Ramesside sources and Ramesses II's western fortresses." },
          { sourceKey: "egl_snape_wilson_2007", relation: "context", note: "Excavation report of the Ramesses II fortress at Zawiyet Umm el-Rakham, the archaeology of the frontier the Libu crossed." },
          { sourceKey: "egl_epigraphic_sety_1986", relation: "context", note: "Seti I's Karnak war reliefs against the Tjehenu show the western frontier at war a generation before the Libu appear." },
        ],
        startYear: bce(1279),
        endYear: bce(1213),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "First attestation of the name Libu (rbw)",
        originalDateText: "Reign of Ramesses II (c. 1279–1213 BCE): earliest occurrence of the name Libu",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "A date of first record, not of origin: the people called Libu were obviously there before Egyptian scribes wrote their name. The reign dates of Ramesses II are conventional. The specific inscription is not quoted here because it was not read in this session.",
      },
    ],
    media: [],
  },

  {
    slug: "meshwesh-ramesses-iii-medinet-habu",
    title: "The Meshwesh and Ramesses III's Libyan wars at Medinet Habu",
    summary:
      "Ramesses III's temple at Medinet Habu records two Libyan wars — Year 5 against a coalition led by the Libu, and Year 11 against the Meshwesh under Keper and his son Meshesher — with reliefs that are the fullest Egyptian picture of Libyan warriors.",
    description:
      "WHAT IT IS. Ramesses III (Twentieth Dynasty) covered his memorial temple at Medinet Habu, western Thebes, with war scenes and long poetic inscriptions. Two of the wars are Libyan. In YEAR 5 a confederacy — listed as Rebu (Libu), Seped and Meshwesh — pushed into the western Delta and was defeated; Libyan chiefs named in the texts include Ded, Meshken, Meryey, Wermer and Themer. In YEAR 11 the Meshwesh under the chief Keper and his son Meshesher invaded again; Meshesher was killed, Keper captured, and the reliefs count the hands and phalli cut from the dead. The plunder list in Edgerton and Wilson's translation names 'The Chief of the Meshwesh, Mesher, son of Keper' and records 2,175 Meshwesh slain.\n\n" +
      "THE MESHWESH. They are first named under Amenhotep III, as a source of cattle for his palace. Egyptian writers often abbreviate the name to 'Ma' — the Ma who, two centuries later, will rule Egypt (see the Shoshenq I record).\n\n" +
      "THE PICTURES — AND WHAT THEY ARE. The reliefs show Libyan men with a long side-lock, one or two feathers in the hair, long open cloaks over a kilt or sheath, and body tattoos; the Year 11 Meshwesh differ in hair and dress from the Year 5 Libu. Edgerton and Wilson note that the captives of the First Libyan War are 'of the Rebu-Temeh type of Libyan rather than of the Meshwesh type', the latter 'clearly depicted' in the Year 11 reliefs. These are Egyptian ideological images. Egyptian art had fixed visual formulas for each kind of foreigner — the famous painting of four peoples in the tomb of Seti I (Book of Gates) shows Egyptians, Asiatics, Nubians and Libyans as types — and the formula can override observation. Oric Bates already noted in 1914 that Egyptian artists gave the side-lock 'rightly or wrongly' to most Libyans. These pictures are evidence of Egyptian categories first, and of Libyan dress only through them.\n\n" +
      "WHERE THE ACCOUNTS DISAGREE. The texts are not straightforward annals: the great 'Year 5' inscription also narrates events usually dated to Year 8, and Edgerton and Wilson write of the First Libyan War as 'traditionally dated by Egyptologists to the year 5'. Ramesses III's absolute dates differ between chronologies by several years (accession roughly 1187–1184 BCE), so the brief's '1180 BCE' is a fair round figure for the first war and about right for the reign.",
    category: "history",
    subcategory: MOORS_LANES.egypt,
    eventType: "historical",
    identificationStatus: "secure",
    evidenceStatus: "strongly_documented",
    tags: laneTags("egypt", "meshwesh", "libu", "ramesses-iii", "medinet-habu", "keper", "meshesher", "twentieth-dynasty", "egyptian-art"),
    people: ["Ramesses III", "Keper", "Meshesher", "Themer", "Wermer", "Meshken", "Ded", "Meryey"],
    civilisations: ["Ancient Egypt", "Amazigh peoples"],
    locationName: "Medinet Habu, western Thebes (the battles in the western Delta)",
    lat: 25.7197,
    lng: 32.6011,
    claims: [
      {
        sourceKey: "egl_edgerton_wilson_1936",
        citations: [
          { sourceKey: "egl_epigraphic_mh1", relation: "supports", note: "The facsimile record of the Year 5 reliefs and inscription." },
          { sourceKey: "egl_breasted_ar4", relation: "supports", note: "Earlier translation of the First Libyan War texts (§§35–58), with the list of Libyan chiefs." },
          { sourceKey: "egl_hornung_2006", relation: "context", note: "Conventional absolute chronology for Ramesses III's accession (late 1180s BCE), from which the BCE equivalent is derived." },
          { sourceKey: "egl_bates_1914", relation: "context", note: "Early catalogue of how Egyptian artists depicted Libyans (side-lock, feathers, cloaks, tattoos), with the caution that the side-lock was given to Libyans 'rightly or wrongly'." },
        ],
        startYear: bce(1183),
        endYear: bce(1179),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "First Libyan War of Ramesses III (Year 5)",
        originalDateText: "Year 5 of Ramesses III (c. 1183–1179 BCE depending on chronology)",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "The regnal year comes from the inscription itself; the BCE range spans the main competing accession dates for Ramesses III. Edgerton and Wilson warn that the 'Year 5' inscription is a composite that also narrates events usually placed in Year 8, so the regnal date of the war itself is traditional rather than certain.",
      },
      {
        sourceKey: "egl_epigraphic_mh2",
        citations: [
          { sourceKey: "egl_edgerton_wilson_1936", relation: "supports", note: "Translation of the Year 11 texts, including the plunder list naming Mesher (Meshesher) son of Keper." },
          { sourceKey: "egl_breasted_ar4", relation: "supports", note: "Narrative of the Second Libyan War (§§83–114): the Meshwesh chieftains Keper and Meshesher, battle near the 'Water of Re'." },
          { sourceKey: "egl_oconnor_1990", relation: "context", note: "Uses these texts to reconstruct the organisation of Meshwesh society." },
        ],
        startYear: bce(1177),
        endYear: bce(1173),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Second Libyan War of Ramesses III (Year 11) against the Meshwesh",
        originalDateText: "Year 11 of Ramesses III, twelfth month (c. 1177–1173 BCE)",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence: "Regnal date from the Medinet Habu texts; the BCE range again reflects the uncertainty in Ramesses III's accession.",
      },
      {
        sourceKey: "egl_wp_meshwesh",
        citations: [{ sourceKey: "egl_oconnor_1990", relation: "context", note: "Standard discussion of the Meshwesh in New Kingdom sources." }],
        startYear: bce(1390),
        endYear: bce(1352),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "First attestation of the Meshwesh",
        originalDateText: "Reign of Amenhotep III: Meshwesh cattle delivered to the palace at Malkata",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence: "A first record, not an origin. The Malkata attestation is reported from the secondary literature and was not read in this session.",
      },
    ],
    media: [],
  },

  {
    slug: "shoshenq-i-twenty-second-dynasty",
    title: "Shoshenq I and the Twenty-second Dynasty: a Libyan family on Egypt's throne",
    summary:
      "Around 945–943 BCE Shoshenq I, a Great Chief of the Ma (Meshwesh) descended from Libyan settlers, became king and founded the Twenty-second Dynasty. A later genealogy traces the family back to 'the Libyan, Buyuwawa'.",
    description:
      "WHAT IT IS. The moment a family of Libyan descent became the royal house of Egypt. Shoshenq I was the son of Nimlot, a Great Chief of the Ma — the Egyptian abbreviation of Meshwesh — and was army commander and chief adviser under the last king of the Twenty-first Dynasty, Psusennes II, before taking the throne himself. His dynasty is called 'Bubastite' after Manetho's claim that it came from Bubastis; the family's documented base was Heracleopolis.\n\n" +
      "HOW WE KNOW HE WAS OF LIBYAN DESCENT. Not from his own monuments, which present him as a conventional pharaoh, but from (1) the title 'Great Chief of the Ma' borne by his father and grandfather — a stela at Abydos records a 'great chief of Me' Sheshonk endowing the cult of Namlot (Nimlot) with the approval of Amun's oracle under Psusennes II; Breasted (1906) took this Sheshonk for the king's grandfather, while later scholarship generally reads him as the future Shoshenq I honouring his father; (2) the family's non-Egyptian names (Shoshenq, Osorkon, Takelot, Nimlot); and (3) above all the Serapeum stela of Pasenhor (Breasted's 'Harpeson'), set up in Year 37 of a much later Shoshenq, which lists sixteen generations of a priestly family back to 'the Libyan, Buyuwawa'. The word translated 'Libyan' there is Tjehenu. The genealogy joins the royal line at Osorkon II, so Buyuwawa is the ancestor of the dynasty. Breasted, who read the stela in Paris, observed that Buyuwawa 'bears no Egyptian title, but his son, Musen' became a priest and 'great chief'.\n\n" +
      "THE BUBASTITE PORTAL. Shoshenq's great surviving monument is the gate and triumph relief at Karnak listing places in Palestine and the Negev, the basis for identifying him with the biblical Shishak (1 Kings 14:25). That identification is conventional, and the relationship between the biblical story and the Karnak list is argued over.\n\n" +
      "THE DATE IS A CHRONOLOGY QUESTION, AND IS SHOWN AS ONE. Kitchen's conventional reign is 945–924 BCE; Krauss's astronomical reading of a festival on the Greater Dakhla Stela (Year 5 of Shoshenq, in the oasis cult of Seth) gives an accession in 943; Schneider has proposed 962–941. The Dakhla Stela's own attribution and reading are debated — see that record. The brief's '945 BCE' is Kitchen's figure.\n\n" +
      "WHAT IT DOES NOT SHOW. That 'Libyans conquered Egypt'. The family had lived in Egypt for generations; by the time of Shoshenq they were Egyptian army officers and priests who kept Libyan titles and names. It also says nothing about the ancestry of later North Africans.",
    category: "history",
    subcategory: MOORS_LANES.egypt,
    eventType: "historical",
    identificationStatus: "secure",
    evidenceStatus: "strongly_documented",
    tags: laneTags("egypt", "shoshenq-i", "twenty-second-dynasty", "meshwesh", "ma", "bubastite-portal", "pasenhor-stela", "buyuwawa", "libyan-period", "shishak"),
    people: ["Shoshenq I", "Nimlot", "Buyuwawa", "Musen", "Pasenhor", "Psusennes II", "Osorkon II"],
    civilisations: ["Ancient Egypt", "Amazigh peoples"],
    locationName: "Karnak (Bubastite Portal); the family's base at Heracleopolis; genealogy from the Serapeum, Saqqara",
    lat: 25.7183,
    lng: 32.6575,
    claims: [
      {
        sourceKey: "egl_kitchen_tip",
        citations: [
          { sourceKey: "egl_wp_shoshenq", relation: "supports", note: "Reports Kitchen's 945–924 BCE as the conventional dates." },
          { sourceKey: "egl_bubastite_portal", relation: "context", note: "The campaign record carved late in the reign, conventionally c. 925 BCE." },
        ],
        startYear: bce(945),
        endYear: bce(924),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Reign of Shoshenq I",
        originalDateText: "945–924 BCE (Kitchen)",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "Derived by counting back from better-fixed later reigns using the highest attested regnal years, and by synchronism with the biblical Shishak's campaign in Rehoboam's fifth year. Both steps carry uncertainty of several years.",
      },
      {
        sourceKey: "egl_hornung_2006",
        citations: [
          { sourceKey: "egl_wp_shoshenq", relation: "supports", note: "Quotes Krauss and Warburton's derivation of 943 BCE from the Greater Dakhla Stela's wrš-feast." },
          { sourceKey: "egl_wp_shoshenq", relation: "disputes", note: "Also reports Anthony Leahy's objection that identifying the wrš-feast of Seth as lunar is hypothetical and its fall on day 1 of a lunar month an assumption." },
        ],
        startYear: bce(943),
        endYear: bce(922),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "calculated_date",
        whatIsDated: "Reign of Shoshenq I",
        originalDateText: "943–922 BCE (accession from the Dakhla wrš-feast, Krauss)",
        datingMethod: "astronomical",
        chronology: "alternative",
        evidence:
          "Rests on treating the wrš-festival recorded for Year 5 on the Greater Dakhla Stela as a lunar feast, which yields an accession between December 944 and November 943 BCE. If the festival is not lunar, the argument fails. Note that the stela's own attribution to Shoshenq I is itself under discussion.",
      },
      {
        sourceKey: "egl_wp_shoshenq",
        citations: [{ sourceKey: "egl_kitchen_tip", relation: "disputes", note: "Kitchen's lower conventional chronology is the position Schneider's proposal departs from." }],
        startYear: bce(962),
        endYear: bce(941),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Reign of Shoshenq I",
        originalDateText: "962–941 BCE (Thomas Schneider, 2010)",
        datingMethod: "regnal_chronology",
        chronology: "hypothesis",
        evidence:
          "A higher chronology proposed by Thomas Schneider in 2010, reported here at second hand from Wikipedia's summary; Schneider's paper was not read. Archaeomagnetic dating of a destruction at Beit She'an that may be Shoshenq's is said to favour the later conventional range.",
      },
      {
        sourceKey: "egl_breasted_ar4",
        citations: [{ sourceKey: "egl_kitchen_tip", relation: "context", note: "The modern reconstruction that replaced Breasted's early-20th-century figures." }],
        startYear: bce(926),
        endYear: bce(924),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Shoshenq I's Palestinian campaign and the end of his reign",
        originalDateText: "campaign 'about 926 B.C.'; twenty-first year 'about 924 B.C.' (Breasted, 1906)",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        evidence: "Breasted's 1906 dating, quoted from his text. Kept because it shows how stable the late-reign figure has been even as accession dates moved.",
      },
      {
        sourceKey: "egl_pasenhor_stela",
        citations: [
          { sourceKey: "egl_breasted_ar4", relation: "supports", note: "Translation of the genealogy (§§785–792), back sixteen generations to 'the Libyan (Tjehenu), Buyuwawa'." },
          { sourceKey: "egl_ritner_2009", relation: "context", note: "Modern translation of the Pasenhor stela among the Libyan Period inscriptions." },
        ],
        startYear: bce(740),
        endYear: bce(725),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "The Serapeum stela of Pasenhor that records the descent from Buyuwawa",
        originalDateText: "Year 37 of Shoshenq V (Breasted's 'Sheshonk IV'), when an Apis bull was buried",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "The stela dates itself to Year 37 of a late Twenty-second Dynasty Shoshenq; with Shoshenq V's reign conventionally placed c. 767–730 BCE, that falls in the 730s. The GENEALOGY reaches back some two centuries before the stela was carved; its earliest generations cannot be dated independently.",
      },
    ],
    media: [],
  },

  {
    slug: "libyan-chiefdoms-of-the-ma",
    title: "The Libyan Period: Great Chiefs of the Ma and a divided Egypt",
    summary:
      "From the Twenty-second to the Twenty-fourth Dynasty (c. 945–715 BCE) Egypt, and especially the Delta, was ruled by kings and 'Great Chiefs of the Ma' and 'of the Libu' of Libyan descent — a political system Anthony Leahy reads as Libyan in character, not as mere anarchy.",
    description:
      "WHAT IT IS. After Shoshenq I's dynasty weakened, Egypt north of Thebes broke into competing seats of power: rival kings at Tanis, Bubastis, Leontopolis and Heracleopolis, and Delta lords titled 'Great Chief of the Ma' (Meshwesh) or 'Great Chief of the Libu'. Their monuments carry Libyan names and titles and are often dated by the reign of whichever king they acknowledged. Tefnakht of Sais, who held both the Libu and Ma titles, made himself king and is counted as founder of the Twenty-fourth Dynasty — though whether he was himself of Libyan descent is doubted.\n\n" +
      "HOW IT ENDED. The Kushite king Piye marched north in about 728 BCE (his Year 21 stela from Gebel Barkal records it). The stela lists the Delta rulers who submitted — kings Osorkon of Bubastis and Iuput, princes and chiefs of the Ma — and, in Breasted's translation, says most of them did not enter the king's house 'because they were unclean and eaters of fish', a Kushite purity judgement on their Delta ways. Piye's successors, the Twenty-fifth Dynasty, absorbed the Libyan chiefdoms.\n\n" +
      "HOW HISTORIANS READ IT. The old label for these centuries was 'anarchy' — Robert Ritner's translation volume uses 'The Libyan Anarchy' deliberately and ironically. Anthony Leahy's 1985 essay argued instead that the fragmentation reflects a Libyan political tradition of shared, kin-based chiefship, and that the rulers kept a Libyan identity that Egyptian-style monuments conceal: Libyan names and titles persisted, kingship changed in character, and changes in language, script and burial can be tied to Libyan influence.\n\n" +
      "WHAT IT DOES NOT SHOW. This is a period of Egyptian history ruled by families descended from Libyan settlers. It is not a period of 'Moorish' rule, and nothing in it establishes descent from or to later Numidians, Mauri or medieval Moors.\n\n" +
      "WHERE THE DATES DISAGREE. The end-points depend on Twenty-second Dynasty chronology (see Shoshenq I) and on how Piye's campaign is dated: conventional modern work puts his Year 21 around 728 BCE; Breasted in 1906 put the campaign 'not earlier than about 720 B.C.'.",
    category: "history",
    subcategory: MOORS_LANES.egypt,
    eventType: "historical",
    identificationStatus: "secure",
    tags: laneTags("egypt", "libyan-period", "great-chiefs-of-the-ma", "meshwesh", "libu", "tefnakht", "piye", "third-intermediate-period", "twenty-second-dynasty", "twenty-fourth-dynasty"),
    people: ["Tefnakht", "Piye", "Osorkon IV", "Iuput II", "Nimlot of Hermopolis"],
    civilisations: ["Ancient Egypt", "Amazigh peoples"],
    locationName: "Nile Delta and Middle Egypt (Tanis, Bubastis, Sais, Heracleopolis)",
    claims: [
      {
        sourceKey: "egl_kitchen_tip",
        citations: [
          { sourceKey: "egl_leahy_1985", relation: "context", note: "Reinterprets the period's fragmentation as Libyan decentralisation rather than anarchy." },
          { sourceKey: "egl_ritner_2009", relation: "supports", note: "Collects and translates the inscriptions of the period, including the Great Chiefs' donation stelae." },
          { sourceKey: "egl_wp_libu", relation: "context", note: "Summarises the 'Great Chiefs of the Libu' of the western Delta and Tefnakht's titles." },
        ],
        startYear: bce(945),
        endYear: bce(715),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The Libyan Period (Twenty-second to Twenty-fourth Dynasties)",
        originalDateText: "Twenty-second to Twenty-fourth Dynasties, c. 945–715 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "A modern period label covering the dynasties of Libyan descent, bounded by the accession of Shoshenq I and the end of the Twenty-fourth Dynasty under Kushite rule. Both ends move with the chronology debates for those reigns.",
      },
      {
        sourceKey: "egl_kitchen_tip",
        citations: [
          { sourceKey: "egl_breasted_ar4", relation: "supports", note: "Translation of the Piye (Piankhi) stela (§§796–883), including the list of Delta dynasts and chiefs of the Ma." },
          { sourceKey: "egl_ritner_2009", relation: "supports", note: "Modern translation of the Piye victory stela." },
        ],
        startYear: bce(728),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Piye's campaign and the submission of the Libyan Delta rulers",
        originalDateText: "Year 21 of Piye, c. 728 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence: "The stela is dated to Piye's Year 21; its BCE equivalent depends on Kushite and late Libyan chronology, conventionally c. 728 BCE.",
      },
      {
        sourceKey: "egl_breasted_ar4",
        citations: [{ sourceKey: "egl_kitchen_tip", relation: "disputes", note: "The later standard chronology raised Piye's campaign to c. 728 BCE." }],
        startYear: bce(720),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Piye's campaign and the submission of the Libyan Delta rulers",
        originalDateText: "'not earlier than about 720 B.C.' (Breasted, 1906)",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        evidence: "Breasted's 1906 estimate, quoted from his text; superseded but kept to show the range of dates in the literature.",
      },
    ],
    media: [],
  },

  {
    slug: "siwa-oracle-of-ammon",
    title: "Siwa and the oracle of Ammon",
    summary:
      "In the Siwa oasis, deep in the Libyan Desert, a temple built under Amasis (570–526 BCE) housed an oracle of Ammon consulted by Greeks and Libyans alike and, in 332/331 BCE, by Alexander. How far Libyan Ammon and Egyptian Amun were one god is debated.",
    description:
      "WHAT IT IS. A ram-associated oracle god in the oasis of Siwa, about 560 km west of the Nile and 50 km from the modern Libyan border. The oracle temple stands on the rock of Aghurmi; a second temple at Umm Ubayda nearby was built under Nectanebo II. The earliest datable Egyptian connection is the Twenty-sixth Dynasty: Kuhlmann's study dates the oracle temple by its royal names to Amasis (570–526 BCE).\n\n" +
      "WHAT HERODOTUS SAYS (read in Godley's translation). The Ammonians 'follow the worship of the Zeus of Thebes; for ... the image of Zeus at Thebes has the head of a ram' (4.181), and they 'are colonists from Egypt and Ethiopia and speak a language compounded of the tongues of both countries'; 'Amun is the Egyptian name for Zeus' (2.42). He tells how the men of Marea and Apis on the Libyan border, 'thinking themselves to be not Egyptians but Libyans', asked Ammon to release them from Egyptian food taboos, and the god answered that all who drank the Nile below Elephantine were Egyptians (2.18). He also tells of Cambyses' army sent against the Ammonians and lost in the sand (3.25–26), and that Croesus sent to test 'Ammon in Libya' (1.46).\n\n" +
      "ALEXANDER. In the winter of 332/331 BCE Alexander travelled to Siwa; his historians said the oracle greeted him as son of Ammon (Arrian, Anabasis 3.3–4). Coins and portraits later gave him Ammon's ram's horns.\n\n" +
      "WHERE THE ACCOUNTS DISAGREE. Was 'Ammon' a Libyan god whom Egyptians identified with Amun, or Egyptian Amun carried west? Greek writers simply equated him with both Amun and Zeus. Herodotus' 'colonists from Egypt and Ethiopia' is a Greek theory, not testimony. Later Libyan religion certainly honoured an Ammon (a sixth-century CE poet calls the god Gurzil his son), but the relationship to Theban Amun cannot be settled from the Greek sources, and the Egyptian temple is late relative to the oasis' long settlement. Today Siwa speaks Siwi, the easternmost Berber language — a fact about medieval and modern Siwa, not evidence of what was spoken there in the sixth century BCE.",
    category: "religion",
    subcategory: MOORS_LANES.egypt,
    eventType: "historical",
    identificationStatus: "secure",
    tags: laneTags("egypt", "siwa", "ammon", "amun", "oracle", "alexander-the-great", "amasis", "twenty-sixth-dynasty", "libyan-desert", "herodotus"),
    people: ["Amasis II", "Alexander the Great", "Cambyses II", "Croesus", "Nectanebo II"],
    civilisations: ["Ancient Egypt", "Ancient Greece", "Amazigh peoples"],
    locationName: "Aghurmi, Siwa Oasis, Western Desert of Egypt",
    lat: 29.2026,
    lng: 25.5443,
    claims: [
      {
        sourceKey: "egl_kuhlmann_1988",
        citations: [
          { sourceKey: "egl_wp_siwa", relation: "supports", note: "States that the earliest evidence of an Egyptian connection is Twenty-sixth Dynasty and that the oracle temple lies in the ruins of Aghurmi." },
          { sourceKey: "egl_brett_fentress_1996", relation: "context", note: "Places the cult of Ammon within the religion of the Libyan peoples." },
        ],
        startYear: bce(570),
        endYear: bce(526),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Construction of the oracle temple at Aghurmi",
        originalDateText: "Reign of Amasis (570–526 BCE), by the royal names in the temple",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "Dated by the king's name in the temple's hieroglyphic decoration, as reported from Kuhlmann. It dates the Egyptian-style building, not the beginning of the cult, which may be older.",
      },
      {
        sourceKey: "egl_herodotus_godley",
        citations: [{ sourceKey: "egl_asheri_lloyd_corcella_2007", relation: "context", note: "Commentary on how far Herodotus' reports of Croesus' consultations are historical." }],
        startYear: bce(560),
        endYear: bce(546),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "before_event",
        whatIsDated: "Earliest Greek report of the oracle being consulted",
        originalDateText: "Croesus 'bade others go to inquire of Ammon in Libya' (Herodotus 1.46), before the fall of Sardis c. 546 BCE",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "Herodotus, writing a century later, places the consultation in Croesus' reign; the story is a famous test-of-the-oracles tale and its historicity is uncertain. It shows that by Herodotus' time the oracle of Ammon was ranked with the great Greek oracles.",
      },
      {
        sourceKey: "egl_arrian",
        citations: [{ sourceKey: "egl_wp_siwa", relation: "supports", note: "Summarises Alexander's visit and the court historians' claim that the oracle confirmed his divine status." }],
        startYear: bce(332),
        endYear: bce(331),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Alexander's visit to the oracle",
        originalDateText: "Winter 332/331 BCE, after the foundation of Alexandria (Arrian, Anabasis 3.3–4)",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "Fixed by its place in Alexander's well-dated campaign between the founding of Alexandria and the march to Gaugamela (331 BCE).",
      },
    ],
    media: [],
  },

  // ===========================================================================
  // AMAZIGH LANE
  // ===========================================================================
  {
    slug: "herodotus-describes-libya",
    title: "Herodotus describes the peoples of Libya (Histories 4.168–199)",
    summary:
      "Writing about 440–425 BCE, Herodotus lists the peoples of 'Libya' from Egypt westward — Adyrmachidae, Nasamones, Garamantes, Atarantes, Atlantes, Maxyes, Gyzantes and more — the first systematic description of North African peoples by an outsider, and full of hearsay.",
    description:
      "WHAT IT IS. The 'Libyan logos' at the end of Book IV of Herodotus' Histories. Greek 'Libya' means the whole continent west of Egypt; 'Libyans' are its native peoples, distinguished from Ethiopians to the south and from Greek and Phoenician settlers. Herodotus closes by saying that 'four nations and no more, as far as our knowledge serves, inhabit it, whereof two are aboriginal and two are not; the Libyans in the north and the Ethiopians in the south of Libya are aboriginal, the Phoenicians and Greeks are later settlers' (4.197, Godley). 'Ethiopians' here is a Greek label for darker-skinned southern peoples; it is reported as his term, not used as a category in this timeline.\n\n" +
      "THE PEOPLES, IN HIS ORDER. Along the coast: the Adyrmachidae next to Egypt, who 'follow Egyptian usages for the most part' (4.168); the Nasamones, who go up to Augila to gather dates and swear and divine at the tombs of their ancestors (4.172); the Psylli, swallowed — he says the Libyans say — by a south wind (4.173). Inland along a 'ridge' of salt hills and springs at ten-day intervals: the Ammonians, Augila, the Garamantes, 'an exceeding great nation, who sow in earth which they have laid on the salt' and hunt 'cave-dwelling Ethiopians' in four-horse chariots (4.183); the Atarantes, who have no individual names and curse the sun (4.184); the Atlantes by Mount Atlas, 'the pillar of heaven' (4.184). West of the Triton river the Libyans are farmers with houses: the Maxyes, who 'wear their hair long on the right side of their heads and shave the left, and they paint their bodies with vermilion' (4.191), then the Zaueces and Gyzantes (4.193–194). East of the lake the Libyans are nomads who 'eat meat and drink milk' and will not eat cows (4.186).\n\n" +
      "WHAT IT DOES NOT SHOW. Herodotus never went west of Cyrene; much is hearsay from Cyreneans and Carthaginians, he says so repeatedly ('I tell the story as it is told by the Libyans'; 'I cannot with exactness say'), and the ten-day stations are a schematic geography. Some details check out — the Garamantes of the Fezzan are archaeologically real, and the Nasamones' date harvest at Augila fits the oasis — others (bat-voiced cave-dwellers, people who never dream) are travellers' tales. The Maxyes have been compared with the Egyptian Meshwesh and with later Latin Mazices; that equation is a hypothesis. No people in his list is called Mauri: that name appears only later.",
    category: "culture",
    subcategory: MOORS_LANES.amazigh,
    eventType: "historical",
    identificationStatus: "secure",
    tags: laneTags("amazigh", "herodotus", "libya", "nasamones", "garamantes", "atlantes", "maxyes", "greek-ethnography", "ancient-sources"),
    people: ["Herodotus"],
    civilisations: ["Ancient Greece", "Amazigh peoples", "Garamantes"],
    locationName: "Libya in the Greek sense: North Africa west of Egypt, described from Cyrene",
    claims: [
      {
        sourceKey: "egl_herodotus_godley",
        citations: [
          { sourceKey: "egl_asheri_lloyd_corcella_2007", relation: "context", note: "Modern commentary on what in Book IV can be matched to archaeology and what is hearsay or schematic geography." },
          { sourceKey: "egl_brett_fentress_1996", relation: "context", note: "Uses Herodotus as the first outside description of Libyan peoples while stressing its Greek viewpoint." },
        ],
        startYear: bce(440),
        endYear: bce(425),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Composition of Herodotus' Libyan account",
        originalDateText: "Histories composed c. 440–425 BCE (Book IV, 168–199)",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "Herodotus' work is dated by internal references to events of the early Peloponnesian War (430s–420s BCE). The brief's '450 BCE' is a fair round date for his travels but slightly early for the finished text. The account describes conditions Herodotus believed current in his own day and, through hearsay, a little earlier.",
      },
    ],
    media: [],
  },

  {
    slug: "libyco-berber-script-earliest-inscriptions",
    title: "Libyco-Berber writing: the earliest dated inscription and the debate over its origins",
    summary:
      "The only Libyco-Berber inscription with an internal date is the bilingual dedication to Masinissa at Dougga, year 10 of Micipsa (139/138 BCE). Origins in the mid-first millennium BCE, or as early as the 7th–6th century, are proposed but rest on indirect arguments.",
    description:
      "WHAT IT IS. An alphabetic script (consonants only) used across North Africa and the Canary Islands to write ancient Libyan (Amazigh-family) speech. There are thousands of short funerary texts and rock inscriptions in several regional variants; the eastern (Numidian) variant of Tunisia and eastern Algeria is the best understood. In the Sahara the script continued and developed into Tuareg Tifinagh, which is still written.\n\n" +
      "WHAT IS SECURELY DATED — ONE TEXT. In 1904 excavators at Dougga (Thugga, Tunisia) found a bilingual Libyan and Punic dedication of a sanctuary to King Masinissa, dated in its text to the tenth year of his son Micipsa; Chabot equated this with 139 BCE (often given as 139/138). It is RIL 2 / KAI 101 and, as the online corpus projects put it, the only reasonably dated Libyan inscription. A second famous bilingual, from the tower tomb of Ateban at Dougga, was cut out in 1842 by the British consul Thomas Reade and is now in the British Museum; it gave Ferdinand de Saulcy the key to the eastern alphabet in 1843. It carries no date; the Museum's 'about 146 BC' is an estimate.\n\n" +
      "WHAT IS PROPOSED. (1) A mid-first-millennium BCE origin, under the influence of the Phoenician alphabet, is the commonest scholarly view (Mora Aguiar reviews the arguments); it relies on letter-form comparison and the density of inscriptions near Carthage. (2) Some researchers estimate that writing began in Morocco and the Canaries in the 7th–6th centuries BCE; the High Atlas rock inscriptions (Azib n'Ikkis, Yagour, Oukaïmeden) are drawn into this because they sit with engravings of weapons, but rock inscriptions cannot at present be dated directly. (3) A purely local invention, or derivation from other scripts (Greek, South Arabian), are minority views. The brief's '600 BCE' corresponds to the early end of these PROPOSALS; it is not an attested date.\n\n" +
      "WHAT IT DOES NOT SHOW. That the script was 'Punic' or that its users were Carthaginians: the Dougga dedication is by the citizens of a Numidian town to a Numidian king, in their own script, with a Punic version beside it. Nor does the script's long survival prove continuity of a single language or people from antiquity to modern Tuareg; scripts travel.",
    category: "culture",
    subcategory: MOORS_LANES.amazigh,
    eventType: "historical",
    identificationStatus: "secure",
    tags: laneTags("amazigh", "libyco-berber", "dougga", "masinissa", "micipsa", "tifinagh", "punic", "inscriptions", "numidia", "writing"),
    people: ["Masinissa", "Micipsa", "Ateban", "Thomas Reade", "Ferdinand de Saulcy"],
    civilisations: ["Numidia", "Amazigh peoples", "Carthage"],
    locationName: "Dougga (Thugga), northern Tunisia",
    lat: 36.4233,
    lng: 9.2186,
    claims: [
      {
        sourceKey: "egl_dougga_ril2",
        citations: [
          { sourceKey: "egl_chabot_1940", relation: "supports", note: "Corpus edition of RIL 2, equating year 10 of Micipsa with 139 BCE." },
          { sourceKey: "egl_wp_libyco_berber", relation: "context", note: "Notes the Dougga bilinguals KAI 100–101 as the basis of decipherment." },
        ],
        startYear: bce(139),
        endYear: bce(138),
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Earliest internally dated Libyco-Berber inscription",
        originalDateText: "Tenth year of Micipsa, counted from the death of Masinissa (139/138 BCE)",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "The inscription dates itself by regnal year; Masinissa's death in 148 BCE is fixed by Roman sources, so year 10 of Micipsa is 139/138. This is a date for one inscription — the script is certainly older than its earliest dated example.",
      },
      {
        sourceKey: "egl_bm_ateban",
        citations: [{ sourceKey: "egl_chabot_1940", relation: "context", note: "Includes the Dougga bilinguals in the corpus." }],
        startYear: bce(200),
        endYear: bce(101),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The Ateban mausoleum bilingual (British Museum)",
        originalDateText: "2nd century BCE (museum estimate 'about 146 BC')",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        evidence: "No internal date; placed by the monument's architecture and the inscription's similarity to RIL 2. The Museum's figure is an estimate and should not be cited as a date.",
      },
      {
        sourceKey: "egl_mora_aguiar",
        citations: [
          { sourceKey: "egl_pichler_2007", relation: "supports", note: "Surveys the corpus and the estimates placing the start of writing in Morocco and the Canaries around the 7th–6th centuries BCE." },
          { sourceKey: "egl_skounti_2003", relation: "context", note: "Publishes the Moroccan rock inscriptions, including the High Atlas sites whose early dating is argued from associated engravings." },
          { sourceKey: "egl_wp_libyco_berber", relation: "context", note: "Summarises the debate: Phoenician-derived, or local creation on a Phoenician model." },
        ],
        startYear: bce(700),
        endYear: bce(400),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Proposed origin of the Libyco-Berber script",
        originalDateText: "Middle of the first millennium BCE, perhaps as early as the 7th–6th centuries BCE (proposed)",
        datingMethod: "estimate",
        chronology: "hypothesis",
        evidence:
          "An inference from letter forms, the Phoenician model, the distribution of inscriptions and their association with rock art — none of it a direct date. The user's '600 BCE' falls inside this proposed range and is recorded here, as a proposal.",
      },
    ],
    media: [],
  },

  {
    slug: "amazigh-language-earliest-evidence",
    title: "The Amazigh (Berber) languages: what the earliest evidence can and cannot show",
    summary:
      "Libyan personal names appear in Egyptian records from the late second millennium BCE and Libyan writing by the 2nd century BCE, but reconstructed Proto-Berber looks surprisingly recent — perhaps only 2,000–3,000 years old — and none of this is evidence about genes.",
    description:
      "WHAT IT IS. Berber (Amazigh, Tamazight) is a branch of the Afroasiatic language family, alongside Egyptian, Semitic, Cushitic, Chadic and Omotic. The branch split from the rest of Afroasiatic very long ago, but the modern Berber languages — from Siwa in Egypt to the Atlas and the Tuareg Sahara, and once the Canary Islands — are surprisingly similar to one another.\n\n" +
      "THE EARLIEST EVIDENCE, IN ORDER. (1) NAMES. Egyptian records of the Ramesside wars give personal names of Libyan chiefs — Ded, Meryey, Meshken, Wermer, Themer, Keper, Meshesher — and the Libyan Period kings keep names such as Shoshenq, Osorkon, Takelot and Nimlot. These are the earliest language material plausibly from Libyan speech, and some scholars argue they are early Berber or 'para-Berber'. That is an interpretation of names written in a foreign script without vowels; it is not proven. (2) WRITING. Libyco-Berber inscriptions, with one dated to 139/138 BCE, record Numidian-period Libyan; most can be read only partially. (3) LATER TESTIMONY: Herodotus heard that the Ammonians spoke a language 'compounded' of Egyptian and Ethiopian (2.42) — a Greek guess, not linguistics.\n\n" +
      "THE TIME-DEPTH PROBLEM. Linguists who reconstruct Proto-Berber (Kossmann, Prasse and others) find a parent language that looks only a few thousand years old; glottochronological estimates of about 3,000 years before present circulate, and Roger Blench argues that reconstructable Proto-Berber may be as late as c. 200 CE, because Punic and Latin loanwords are spread through most of the family (Guanche and Zenaga lack Punic loans). His explanation is a 'levelling' bottleneck in Roman times, when a trading lingua franca spread and older diversity was lost; Fentress and Wilson's case for northward movement of Saharan Berber groups in Late Antiquity offers a historical mechanism. So the Libyan names of the 13th century BCE and modern Berber may be related through a language that has since been largely replaced by one of its own later forms.\n\n" +
      "LANGUAGE IS NOT ANCESTRY. Ancient DNA from the Canary Islands shows the islanders' North African genetic ancestry; their Guanche language was Berber. These are two independent lines of evidence that happen to agree there, and they do not always agree elsewhere. Nothing here supports a 'race' of Berbers; the old 'Hamitic' language-and-race theory is rejected by linguists and geneticists alike and is named here only to say so.",
    category: "culture",
    subcategory: MOORS_LANES.amazigh,
    eventType: "scientific_model",
    identificationStatus: "probable",
    tags: laneTags("amazigh", "berber-languages", "proto-berber", "afroasiatic", "libyan-names", "guanche", "linguistics", "libyco-berber", "language-not-genes"),
    people: ["Maarten Kossmann", "Roger Blench"],
    civilisations: ["Amazigh peoples", "Ancient Egypt"],
    locationName: "North Africa from Siwa to the Atlantic, and the Canary Islands",
    claims: [
      {
        sourceKey: "egl_breasted_ar4",
        citations: [
          { sourceKey: "egl_breasted_ar3", relation: "supports", note: "Gives Meryey son of Ded, the Libu chief of Merneptah's war." },
          { sourceKey: "egl_wp_proto_berber", relation: "context", note: "Reports the proposal that Ramesside Egyptian records preserve early (para-)Berber names and words." },
          { sourceKey: "egl_leahy_1985", relation: "context", note: "Argues Libyan names and titles persisted among the Libyan Period rulers." },
        ],
        startYear: bce(1250),
        endYear: bce(1150),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Earliest personal names plausibly from Libyan speech (in Egyptian records)",
        originalDateText: "Ramesside war texts of Merneptah and Ramesses III, 13th–12th centuries BCE",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        evidence:
          "The names are securely dated by the Egyptian texts that record them. Their linguistic affiliation is the uncertain part: they are written in Egyptian consonantal script, and assigning them to an early form of Berber is a hypothesis, not an established reading.",
      },
      {
        sourceKey: "egl_wp_proto_berber",
        citations: [
          { sourceKey: "egl_kossmann_2012", relation: "context", note: "Describes Berber as an Afroasiatic branch with low internal diversity and gives the Proto-Berber reconstruction." },
          { sourceKey: "egl_kossmann_2013", relation: "context", note: "Shows the depth of later Arabic contact, a reason modern vocabulary cannot be projected straight back." },
          { sourceKey: "egl_serrano_2023", relation: "context", note: "Ancient Canary Island genomes show North African ancestry among speakers of Guanche, a Berber language — genetic evidence that bears on settlement, not on the language's age." },
        ],
        startYear: ka(3),
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "years_ago",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        whatIsDated: "Common ancestor of the modern Berber languages (Proto-Berber)",
        originalDateText: "Proto-Berber 'might be as recent as 3,000 years' ago (glottochronological estimates)",
        datingMethod: "estimate",
        chronology: "hypothesis",
        evidence:
          "Glottochronology estimates time from the rate of vocabulary replacement and is widely regarded as unreliable in detail; the figure is reported, at second hand, as an order of magnitude only. It agrees with the qualitative observation that modern Berber languages are closely related.",
      },
      {
        sourceKey: "egl_blench_2018",
        citations: [
          { sourceKey: "egl_fentress_wilson_2016", relation: "supports", note: "Historical case for northward movement of Saharan Berber groups in Late Antiquity, a possible mechanism for levelling." },
          { sourceKey: "egl_wp_proto_berber", relation: "supports", note: "Summarises Blench's argument from Punic and Latin loanwords that Proto-Berber's break-up post-dates 146 BCE and falls c. 1–200 CE." },
          { sourceKey: "egl_kossmann_2012", relation: "context", note: "The reconstruction against which time-depth claims are made." },
        ],
        startYear: 1,
        endYear: 200,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Common ancestor of the modern Berber languages (Proto-Berber)",
        originalDateText: "Reconstructable Proto-Berber as late as c. 200 CE, after Roman-era levelling (Blench)",
        datingMethod: "estimate",
        chronology: "hypothesis",
        evidence:
          "An argument from loanword layers: words borrowed from Punic and Latin are shared across most Berber languages, so the ancestor of those languages must post-date the contact. Blench himself notes that it conflicts with textual evidence for Libyan languages long before, and resolves the conflict with a bottleneck model. It dates the ancestor of today's languages, not the arrival of Berber speech in North Africa.",
      },
    ],
    media: [],
  },

  {
    slug: "indigenous-north-african-religion-and-sacred-sites",
    title: "Indigenous North African religion, through Greek and Roman eyes",
    summary:
      "What is known of ancient Libyan religion comes almost entirely from outsiders: Herodotus on sacrifice to the sun and moon and on dream-oracles at ancestors' tombs; Roman-era dedications to the 'Dii Mauri'; and a 6th-century CE poet's account of the god Gurzil, son of Ammon.",
    description:
      "WHAT IT IS. An attempt to say what the peoples west of Egypt worshipped before Christianity and Islam — and an honest account of how little of it is in their own words.\n\n" +
      "HERODOTUS, c. 430 BCE (Godley's translation). The nomads 'sacrifice to no gods save the sun and moon; that is, this is the practice of the whole nation; but the dwellers by the Tritonian lake sacrifice to Athene chiefly, and next to Triton and Poseidon' (4.188). The Nasamones 'lay their hands on the graves of the men reputed most just and good among them, and by these men they swear; their practice of divination is to go to the tombs of their ancestors, where after making prayers they lie down to sleep, and take whatever dreams come to them for oracles' (4.172). The Atarantes 'curse and most foully revile' the sun (4.184). He believed the Greeks took Athena's aegis and the ritual cry from Libyan women (4.189).\n\n" +
      "AMMON. The oracle god of Siwa was honoured across the Libyan world, and later Libyan religion knew a god Ammon (see the Siwa record).\n\n" +
      "THE ROMAN PERIOD. Latin inscriptions of the 2nd–4th centuries CE from Numidia and Mauretania address the 'Dii Mauri' — 'the Moorish gods' — often as a group, sometimes with local names, and a rock relief at Chemtou (Simitthus) shows a row of such deities. The Latin label is Roman: it is the first time these gods are called after the Mauri, and it tells us more about Roman provincial classification than about indigenous theology.\n\n" +
      "LATE ANTIQUITY. Corippus, a Latin poet writing about 550 CE on John Troglita's wars, says the Laguatan of Tripolitania carried an image of Gurzil — called a son of Ammon and a cow — into battle in 546 CE. A hostile Byzantine epic is a thin basis for theology.\n\n" +
      "WHAT IT DOES NOT SHOW. Sacred mountains, caves and springs are often said to be the core of indigenous religion; there is evidence for some (Herodotus' Atlas as 'pillar of heaven', Roman dedications at springs and peaks), but much of the modern picture is reconstruction from later folklore. Every ancient description here is an INTERPRETATION: Herodotus names Libyan gods as Athena, Poseidon and Zeus; Romans group them as 'Moorish'. The underlying beliefs survive only through those filters.",
    category: "religion",
    subcategory: MOORS_LANES.amazigh,
    eventType: "historical",
    identificationStatus: "probable",
    tags: laneTags("amazigh", "religion", "ammon", "gurzil", "dii-mauri", "herodotus", "nasamones", "incubation", "sun-and-moon", "corippus", "chemtou"),
    people: ["Herodotus", "Corippus", "John Troglita", "Ierna"],
    civilisations: ["Amazigh peoples", "Ancient Greece", "Roman Empire", "Byzantine Empire", "Numidia", "Mauretania"],
    locationName: "North Africa west of Egypt",
    claims: [
      {
        sourceKey: "egl_herodotus_godley",
        citations: [
          { sourceKey: "egl_brett_fentress_1996", relation: "context", note: "Discusses Herodotus' religious reports as Greek interpretation of Libyan practice." },
          { sourceKey: "egl_asheri_lloyd_corcella_2007", relation: "context", note: "Commentary on the sources and reliability of Herodotus 4.172, 4.184 and 4.188–189." },
        ],
        startYear: bce(440),
        endYear: bce(425),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Herodotus' reports of Libyan sacrifice, oaths and dream-divination",
        originalDateText: "Herodotus 4.172, 4.184, 4.188 (written c. 440–425 BCE)",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence: "The date of the report, not of the practices, which Herodotus presents as long-standing customs. Partly hearsay.",
      },
      {
        sourceKey: "egl_brett_fentress_1996",
        citations: [{ sourceKey: "egl_camps_1961", relation: "context", note: "Camps' wider work on Maghrebi protohistory frames the Dii Mauri as indigenous cults seen through Latin epigraphy." }],
        startYear: 100,
        endYear: 400,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Roman-period dedications to the Dii Mauri",
        originalDateText: "Latin dedications to the Dii Mauri, 2nd–4th centuries CE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence: "Dated by the inscriptions' formulae and contexts. Individual inscriptions were not read in this session; the range is the general one given in the secondary literature.",
      },
      {
        sourceKey: "egl_corippus",
        citations: [{ sourceKey: "egl_wp_gurzil", relation: "supports", note: "Summarises Corippus' account of Gurzil and the battle of 546 CE, and the proposed link with Ghirza." }],
        startYear: 546,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Corippus' report of the Laguatan carrying Gurzil into battle",
        originalDateText: "Revolt of the Laguatan and Austurii, 546 CE (Corippus, Iohannis, written c. 550)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "Dated by the Byzantine campaigns Corippus narrates. Late, literary and hostile evidence for a cult whose antiquity cannot be established from it.",
      },
    ],
    media: [],
  },

  {
    slug: "ancient-north-african-burial-monuments",
    title: "Bazinas, tower tombs and dolmens: the funerary monuments of ancient North Africa",
    summary:
      "Tens of thousands of stone tombs — stepped bazinas, cylindrical chouchet, dolmens like those of Roknia and Bou Nouara, and tumuli — cover the Maghreb and Sahara. Most dated examples belong to the first millennium BCE and continue into Roman times; they lead up to the great royal tombs.",
    description:
      "WHAT IT IS. The commonest monuments the indigenous peoples of North Africa left behind are graves. Gabriel Camps' 1961 typology is still the framework: the BAZINA, a round or oval tomb built up in steps or courses of stone over the burial; the CHOUCHET (sing. chouchet, a Maghrebi word), a small cylindrical drum or tower of dressed stones, often on hilltops in the Aurès and eastern Algeria; the DOLMEN, a chamber of upright slabs under a capstone, found in thousands at Roknia near Guelma and at Bou Nouara near Constantine; and the TUMULUS, a heap of stones over a pit or cist. Many have chapels, niches or platforms for offerings at the east side.\n\n" +
      "HOW THEY ARE DATED. Mostly by the objects in them: handmade pottery, iron and bronze ornaments, and at times imported Punic or Roman pottery and coins. On that basis Camps placed most of these monuments in the first millennium BCE, with many still built in the Roman period and some later. Few have radiocarbon dates; the dolmens of eastern Algeria in particular are often given older ages in popular literature than their contents support. In the Sahara, stone burial monuments go back much further, into the pastoral Holocene, and Garamantian cemeteries of the Fezzan are now among the best dated (Gatto, Mattingly, Ray and Sterry eds, 2019).\n\n" +
      "WHAT THEY SHOW ABOUT BELIEF. Attention to the dead and to ancestors: the Nasamones, Herodotus says, swore by and slept at the tombs of their ancestors (4.172) and buried their dead sitting (4.190: 'These bury their dead sitting, being careful to make the dying man sit when he gives up the ghost'). Contracted and seated burials are in fact found in North African protohistoric tombs, though linking particular graves to Herodotus' Nasamones is not possible.\n\n" +
      "WHAT THEY DO NOT SHOW. That one people built them all, or that dolmens prove a link with megalith-builders of Europe; similar forms arose independently in many places. The monumental royal tombs — the Medracen in Algeria, the mausoleum at Dougga, the 'Royal Mausoleum of Mauretania' — grow out of this tradition but belong to the Numidian and Mauretanian kingdoms, and are treated in their own records.",
    category: "archaeology",
    subcategory: MOORS_LANES.amazigh,
    eventType: "archaeological_interpretation",
    identificationStatus: "secure",
    tags: laneTags("amazigh", "bazina", "chouchet", "dolmens", "roknia", "bou-nouara", "tumuli", "funerary-monuments", "camps", "protohistory"),
    people: ["Gabriel Camps"],
    civilisations: ["Amazigh peoples", "Numidia", "Garamantes"],
    locationName: "Maghreb and northern Sahara (Roknia and Bou Nouara in eastern Algeria; the Aurès; the Fezzan)",
    claims: [
      {
        sourceKey: "egl_camps_1961",
        citations: [
          { sourceKey: "egl_gatto_2019", relation: "supports", note: "Modern comparative study of Saharan and Maghrebi funerary monuments with new dating, especially for the Garamantian heartland." },
          { sourceKey: "egl_brett_fentress_1996", relation: "supports", note: "Synthesis placing the protohistoric tombs of the Maghreb in the first millennium BCE and into the Roman period." },
        ],
        startYear: bce(1000),
        endYear: 400,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Main period of bazinas, chouchet, dolmens and tumuli in the Maghreb",
        originalDateText: "First millennium BCE, continuing into the Roman period (Camps' protohistoric monuments)",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "Based on grave goods and a small number of scientific dates. Individual monuments can be much older or younger; the range describes where most dated examples fall, not every tomb. Older ages sometimes quoted for the Roknia dolmens are not supported by their contents.",
      },
      {
        sourceKey: "egl_herodotus_godley",
        citations: [{ sourceKey: "egl_camps_1961", relation: "context", note: "Records contracted and seated burial positions in protohistoric North African tombs." }],
        startYear: bce(440),
        endYear: bce(425),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Herodotus' report of Nasamonian seated burial and tomb cult",
        originalDateText: "Herodotus 4.172 and 4.190 (written c. 440–425 BCE)",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence: "The date of the Greek report, which describes the customs of one Libyan people in Herodotus' own time.",
      },
    ],
    media: [],
  },
];

const links: SeedEventLink[] = [
  // --- Inside the section ----------------------------------------------------
  { from: "tjehenu-and-tjemehu-early-egyptian-records", to: "libu-merneptah-libyan-war", relation: "precedes", note: "The Old Kingdom Tjehenu and Tjemehu are the earlier Egyptian names for western peoples; the Libu are the Ramesside successor term." },
  { from: "libu-merneptah-libyan-war", to: "meshwesh-ramesses-iii-medinet-habu", relation: "precedes", note: "Meryey son of Ded, Merneptah's opponent, is named again among the defeated chiefs in Ramesses III's Year 5 texts." },
  { from: "meshwesh-ramesses-iii-medinet-habu", to: "shoshenq-i-twenty-second-dynasty", relation: "precedes", note: "The Meshwesh ('Ma') defeated by Ramesses III were settled in Egypt; two centuries later a Great Chief of the Ma became king." },
  { from: "shoshenq-i-twenty-second-dynasty", to: "libyan-chiefdoms-of-the-ma", relation: "precedes", note: "Shoshenq I's dynasty opens the Libyan Period; its later fragmentation produced the Delta chiefdoms Piye found." },
  { from: "meshwesh-ramesses-iii-medinet-habu", to: "amazigh-language-earliest-evidence", relation: "evidence_for", note: "The Libyan chiefs' names in the Ramesside war texts are the earliest language material plausibly from Libyan speech." },
  { from: "herodotus-describes-libya", to: "indigenous-north-african-religion-and-sacred-sites", relation: "source_of", note: "Herodotus 4.172, 4.184 and 4.188 are the earliest descriptions of Libyan religious practice." },
  { from: "herodotus-describes-libya", to: "siwa-oracle-of-ammon", relation: "source_of", note: "Herodotus (2.18, 2.42, 3.25–26, 4.181) is the earliest extended account of the Ammonians and their oracle." },
  { from: "herodotus-describes-libya", to: "ancient-north-african-burial-monuments", relation: "source_of", note: "Herodotus reports the Nasamones' seated burial and their oaths and dream-oracles at ancestors' tombs (4.172, 4.190)." },
  { from: "siwa-oracle-of-ammon", to: "indigenous-north-african-religion-and-sacred-sites", relation: "related", note: "Ammon of Siwa was honoured among Libyan peoples, and the later god Gurzil was called his son." },
  { from: "libyco-berber-script-earliest-inscriptions", to: "amazigh-language-earliest-evidence", relation: "evidence_for", note: "Libyco-Berber inscriptions are the earliest texts written in an ancient Libyan language." },
  { from: "ancient-north-african-burial-monuments", to: "indigenous-north-african-religion-and-sacred-sites", relation: "related", note: "Tomb cult and ancestor veneration are among the best attested elements of indigenous religion." },

  // --- To other sections of this track --------------------------------------
  { from: "herodotus-describes-libya", to: "garamantes-emergence", relation: "source_of", note: "Herodotus 4.174 and 4.183 are the first written mention of the Garamantes, 'an exceeding great nation'." },
  { from: "herodotus-describes-libya", to: "earliest-written-mauri-maurousioi-mauretania", relation: "precedes", note: "Herodotus' detailed list of Libyan peoples contains no Mauri; the name appears in later writers." },
  { from: "libyco-berber-script-earliest-inscriptions", to: "numidian-royal-tombs-medracen-and-dougga", relation: "related", note: "The two Dougga bilinguals come from the temple of Masinissa and the mausoleum of Ateban in the same Numidian town." },
  { from: "libyco-berber-script-earliest-inscriptions", to: "masinissa-kingdom", relation: "related", note: "The earliest dated Libyco-Berber inscription dedicates a sanctuary to Masinissa in his son Micipsa's tenth year." },
  { from: "ancient-north-african-burial-monuments", to: "numidian-royal-tombs-medracen-and-dougga", relation: "precedes", note: "The Numidian royal tombs monumentalise the indigenous bazina and tower-tomb traditions." },
  { from: "ancient-north-african-burial-monuments", to: "royal-mausoleum-of-mauretania", relation: "related", note: "The 'Royal Mausoleum of Mauretania' is a monumental descendant of the round stepped tomb tradition." },
  { from: "indigenous-north-african-religion-and-sacred-sites", to: "roman-north-african-cultural-exchange", relation: "related", note: "The Dii Mauri are indigenous gods known through Roman provincial inscriptions." },
  { from: "indigenous-north-african-religion-and-sacred-sites", to: "african-gods-in-etruscan-and-roman-religion", relation: "related", note: "Ammon and other North African deities were taken up, and renamed, in Greek and Roman religion." },
  { from: "amazigh-language-earliest-evidence", to: "ancient-moroccan-dna-continuity-and-change", relation: "related", note: "Genetic ancestry and language are separate lines of evidence; read the two records together without merging them." },
  { from: "amazigh-language-earliest-evidence", to: "alt-amazigh-population-origins", relation: "relevant", note: "The linguistic time-depth evidence here is central to the disputed theories of Amazigh population origins." },
  { from: "tjehenu-and-tjemehu-early-egyptian-records", to: "saharan-rock-art-and-pastoralists", relation: "relevant", note: "The herds counted as Libyan booty in Egyptian reliefs fit the pastoral economies shown in Saharan rock art." },
  { from: "shoshenq-i-twenty-second-dynasty", to: "alt-moors-descend-from-egyptian-libyans", relation: "relevant", note: "The documented Libyan descent of the 22nd Dynasty is the evidence usually invoked by the claim that Moors descend from Egypt's Libyans." },
  { from: "libu-merneptah-libyan-war", to: "alt-etruscans-from-north-africa", relation: "relevant", viewpoint: "disputed", note: "The Teresh in Meryey's coalition have been conjecturally equated with the Tyrsenoi (Etruscans) — a contested identification." },
  { from: "libyan-chiefdoms-of-the-ma", to: "cleopatra-selene-ii", relation: "related", note: "Seven centuries later contact ran the other way, when a Ptolemaic princess became queen of Mauretania; no continuity between the two is implied." },

  // --- To records other datasets already seeded -----------------------------
  { from: "tjehenu-and-tjemehu-early-egyptian-records", to: "set-lord-of-the-red-land", relation: "relevant", note: "A relief from Sahure's temple shows Seth presenting Libyan captives to the king — Seth as lord of the desert and foreign lands at work." },
  { from: "libu-merneptah-libyan-war", to: "set-lord-of-the-red-land", relation: "relevant", note: "Merneptah's victory stela says 'Sutekh has turned his back upon their chief' — the god of foreign lands withdrawing favour from the Libyan leader." },
  { from: "libu-merneptah-libyan-war", to: "nineteenth-dynasty-named-for-set", relation: "associated", note: "Merneptah, son of Ramesses II, fought the Libyan war as a king of the Seth-named Nineteenth Dynasty." },
  { from: "meshwesh-ramesses-iii-medinet-habu", to: "set-lord-of-the-red-land", relation: "relevant", note: "In the Year 5 lament the defeated Libyans say of Ramesses III that 'their lord is like Sutekh' (Breasted IV §43)." },
  { from: "shoshenq-i-twenty-second-dynasty", to: "greater-dakhleh-stela-oracle-of-seth", relation: "related", note: "The Greater Dakhla Stela is often dated to Shoshenq I's Year 5 and its Seth festival underlies the 943 BCE accession date — both points debated." },
  { from: "libyan-chiefdoms-of-the-ma", to: "smaller-dakhleh-stela-piye", relation: "related", note: "The Smaller Dakhla Stela of Piye's reign comes from the oases at the time Piye ended the Libyan chiefdoms in the Delta." },
];

// Each record's gallery, attached by slug so the pictures sit together above
// where they were checked. The first picture in each list is the cover.
for (const event of events) event.media = PICS[event.slug] ?? [];

export const EGYPT_LIBYANS: MoorsSection = { sources, events, links };
