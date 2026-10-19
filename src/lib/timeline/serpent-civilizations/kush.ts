// SECTION D: NUBIAN AND KUSHITE SERPENT TRADITIONS.
//
// What this section is for. The Egypt lane documents the cobra of kingship
// (Wadjet, the uraeus) in the Nile Valley north of Aswan. This lane follows
// the same serpent south, into the kingdoms of Kush (Kerma, Napata, Meroë),
// and asks what the Kushites did with it: what they took from Egypt, what
// they made their own (the double uraeus, a serpent-bodied lion god, a
// mountain read as a cobra), and what the evidence says, and does not say,
// about any further movement of these ideas west across the Sahel.
//
// HOW IT WAS RESEARCHED. The Kushite royal inscriptions were read in English
// translation in Fontes Historiae Nubiorum vol. I (1994), whose full text was
// opened on archive.org in this session, and in Breasted's Ancient Records of
// Egypt vol. IV (1906), opened on archive.org. Kendall's reading of the Gebel
// Barkal pinnacle was checked through the Learning Sites page written with him
// and through Brigitte Gratien's summary. The scholarship on Meroitic, on Naqa
// and Musawwarat and on the end of Meroë was identified through catalogue and
// publisher records; where a book was not opened its use is paraphrased and
// flagged. Every Commons file was opened on its File: page in this session.
//
// WHAT THIS SECTION WILL NOT DO. Equate the Kushite cobra with the West
// African python; treat Egyptian-looking iconography in Kush as evidence of
// anything west of the Nile; or present Kendall's reading of the pinnacle as a
// statement the ancient sources make in so many words.

import type { SeedEvent, SeedEventLink, SeedSource } from "../seed-types";
import { SERPENT_LANE_ANCHORS, bce, commonsPicture, serpentTags, type SerpentSection } from "./shared";

const LANE = "kush" as const;
const SUBCATEGORY = "Nubian and Kushite serpent traditions";
const ANCHOR = SERPENT_LANE_ANCHORS.kush;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // ---- Primary texts in edition and translation --------------------------------
  {
    key: "fhn_1_1994_eighth_to_mid_fifth_century",
    title: "Fontes Historiae Nubiorum: Textual Sources for the History of the Middle Nile Region between the Eighth Century BC and the Sixth Century AD, vol. I: From the Eighth to the Mid-Fifth Century BC",
    author: "Tormod Eide, Tomas Hägg, Richard Holton Pierce and László Török (eds)",
    publisher: "University of Bergen, Department of Classics",
    reference: "No. 29 (Dream Stela of Tanutamani, Cairo JE 48863); no. 22 (Kawa V of Taharqo); no. 34 (Kawa VIII of Anlamani, Ny Carlsberg Glyptotek ÆIN 1709); no. 37 (Election Stela of Aspelta, Cairo JE 48866), with commentaries",
    url: "https://archive.org/details/romaindavid4_hotmail_FHNI",
    sourceType: "primary",
    publishedYear: 1994,
    publishedDisplay: "1994",
    notes:
      "THE STANDARD EDITION of the Kushite royal inscriptions, each with transliteration, English translation and commentary. Cited for the texts of Kawa V (Taharqo 'wearing the uraei', the Two Wadjets, on his head), Kawa VIII (Anlamani's journey to Kawa, the queen mother Nasalsa's arrival, four royal sisters made sistrum-players), the Election Stela of Aspelta (the army, the commanders and the oracle of Amun of Napata; the line of royal mothers), and the Dream Stela (two serpents read as the uraei of the crown). Also cited for its iconographic commentary: the king's 'Kushite skullcap-crown with the double uraeus' and the queen mothers' single uraeus, and the erasure under Psamtik II of one of the two uraei on Kushite royal images in Egypt. Full text read on archive.org in this session; short quotations only.",
  },
  {
    key: "breasted_1906_ancient_records_iv_kushite_kings",
    title: "Ancient Records of Egypt: Historical Documents from the Earliest Times to the Persian Conquest, vol. IV: The Twentieth to the Twenty-Sixth Dynasties",
    author: "James Henry Breasted",
    publisher: "University of Chicago Press, Chicago",
    reference: "Vol. IV, §§919–934 (Stela of Tanutamon), pp. 467–473; §922 (the dream), p. 469",
    url: "https://archive.org/details/ancientrecordse08breagoog",
    sourceType: "primary",
    publishedYear: 1906,
    publishedDisplay: "1906",
    notes:
      "Cited for the public-domain English translation of the Dream Stela of Tanutamani from Gebel Barkal: 'two serpents, one upon his right, the other upon his left ... Thine is the Southland; take for thyself (also) the Northland. The Two Goddesses shine upon thy brow', and for the king's arrival at 'the temple of Amon of Napata, residing in the Pure Mountain'. VIEWPOINT: early-twentieth-century philology; Breasted's dating (663 BC) is a year off later chronologies. Read in the archive.org scan in this session (the scan's identifier is labelled 08, but its contents are vol. IV).",
  },
  {
    key: "macadam_1949_temples_of_kawa_inscriptions",
    title: "The Temples of Kawa I: The Inscriptions",
    author: "M. F. Laming Macadam",
    publisher: "Oxford University Press for the Griffith Institute, London",
    reference: "Pp. 44–50 and pls 15–16 (Kawa VIII of Anlamani), as cited in FHN I",
    sourceType: "primary",
    publishedYear: 1949,
    publishedDisplay: "1949",
    notes:
      "The first edition of the Kawa stelae, including Taharqo's Kawa V and Anlamani's Kawa VIII. Cited as the editio princeps behind FHN's translations. Not opened in this session; its pages are those FHN gives.",
  },
  {
    key: "griffith_1911_karanog_meroitic_inscriptions",
    title: "Karanòg: The Meroitic Inscriptions of Shablûl and Karanòg",
    author: "F. Ll. Griffith",
    publisher: "University Museum, Philadelphia (Eckley B. Coxe Junior Expedition to Nubia, vol. VI)",
    url: "https://archive.org/details/karangmeroitic00grifuoft",
    sourceType: "primary",
    publishedYear: 1911,
    publishedDisplay: "1911",
    notes:
      "Cited as the publication in which Griffith set out his reading of the Meroitic script's sound values, the step that made Meroitic names and titles pronounceable but left most of the language untranslated. Located on archive.org in this session; its argument is reported here through later summaries, not quoted.",
  },
  {
    key: "reisner_1917_barkal_temples_1916",
    title: "The Barkal Temples in 1916",
    author: "George Andrew Reisner",
    publisher: "Journal of Egyptian Archaeology 4",
    reference: "Journal of Egyptian Archaeology 4 (1917), with the site plan reproduced on Commons (JSTOR stable 3853841)",
    url: "https://www.jstor.org/stable/3853841",
    sourceType: "archaeological",
    publishedYear: 1917,
    publishedDisplay: "1917",
    notes:
      "The first excavation report on the temples at the foot of Gebel Barkal, by the Harvard–Boston expedition, cited for the numbering of the temples (B 500 for the great Amun temple, B 300 for Taharqa's Mut temple) and for the plan reproduced here. The JSTOR record and the Commons copy of the plan were seen; the article text was not read.",
  },
  {
    key: "reisner_1923_excavations_at_kerma",
    title: "Excavations at Kerma, Parts I–III and IV–V",
    author: "George Andrew Reisner",
    publisher: "Harvard African Studies 5–6, Peabody Museum of Harvard University, Cambridge, MA",
    reference: "Harvard African Studies 5 and 6 (1923); amulets on pls 43–44",
    sourceType: "archaeological",
    publishedYear: 1923,
    publishedDisplay: "1923",
    notes:
      "The first excavation report on Kerma, cited for the discovery of the Kerma culture's cemetery and its amulets, and for Reisner's error (corrected by Junker, Säve-Söderbergh and Hintze) in taking Kerma for an Egyptian outpost. Known in this session through the D'Itria project summary; not opened.",
  },

  // ---- Museum and site records ------------------------------------------------
  {
    key: "walters_22258_tanyidamani_plaque",
    title: "Votive Plaque of King Tanyidamani (accession 22.258)",
    author: "Walters Art Museum, Baltimore",
    url: "https://art.thewalters.org/detail/28665",
    sourceType: "museum",
    publishedDisplay: "museum record, accessed October 2026 via its Wikimedia Commons copy",
    notes:
      "A museum catalogue record cited for a Meroitic object of about 100 BC: a plaque with the king on one side and the lion-headed Apedemak with sorghum and a lion-topped sceptre on the other, labelled in Meroitic script naming king and god. Seen through the Walters description reproduced on the Commons file page; the museum site itself was not opened.",
  },
  {
    key: "learning_sites_kendall_jebel_barkal",
    title: "Jebel Barkal, Nubia (Sudan): site history and setting",
    author: "Learning Sites, Inc., with Timothy Kendall",
    url: "https://learningsites.com/GebelBarkal-2/GB-hist2_CSS3-update.php",
    sourceType: "website",
    publishedYear: 2025,
    publishedDisplay: "page updated January 2025; read October 2026",
    notes:
      "A research website built with the excavator Timothy Kendall, cited for its plain statement of Kendall's reading: the free-standing pinnacle on the south corner of the butte 'was perceived in Antiquity as a gigantic natural statue with many overlapping identities: a rearing uraeus serpent, a phallus, a squatting god ... and ... a vaguely human form wearing a crown', and that it 'apparently proved to the Egyptians' that the mountain was an origin of their Upper Egyptian kingship. VIEWPOINT: the interpreter's own presentation. Read in this session.",
  },
  {
    key: "gratien_djebel_barkal_temple_amon",
    title: "Le djebel Barkal et le temple à Amon",
    author: "Brigitte Gratien",
    publisher: "Clio (online lecture notes), Paris",
    url: "https://www.clio.fr/BIBLIOTHEQUE/pdf/pdf_le_djebel_barkal_et_le_temple_a_amon.pdf",
    sourceType: "secondary",
    publishedDisplay: "undated; read October 2026",
    notes:
      "A CNRS Egyptologist's account of Gebel Barkal, cited as an independent statement that 'Timothy Kendall reconnaît les restes d'un uraeus colossal' in the pinnacle, that a Taharqa inscription and scaffolding holes were found there with a later restoration inscription of Nastasen, and that the Egyptians called the mountain dw w'b, 'the pure mountain', home of Amun of Napata. Read in full in this session.",
  },

  // ---- Modern scholarship ------------------------------------------------------
  {
    key: "kendall_mohamed_2017_barkal_new_kingdom",
    title: "Jebel Barkal in the New Kingdom: an emerging picture",
    author: "Timothy Kendall and El-Hassan Ahmed Mohamed",
    publisher: "In N. Spencer, A. Stevens and M. Binder (eds), Nubia in the New Kingdom: Lived Experience, Pharaonic Control and Indigenous Traditions, Peeters, Leuven",
    reference: "Pp. 155–188",
    sourceType: "academic_paper",
    publishedYear: 2017,
    publishedDisplay: "2017",
    notes:
      "Cited for the New Kingdom founding of the Amun sanctuary at Gebel Barkal and Kendall's argument that the Egyptians read the mountain and its pinnacle as a seat of Amun and a source of kingship. Bibliographic details confirmed from the Learning Sites bibliography; the chapter was not opened. NEEDS SOURCE VERIFICATION for specific claims.",
  },
  {
    key: "kendall_2004_monument_of_taharqa",
    title: "The Monument of Taharqa on Gebel Barkal",
    author: "Timothy Kendall",
    publisher: "In S. Wenig (ed.), Neueste Feldforschungen im Sudan und in Eritrea (Meroitica 21), Harrassowitz, Wiesbaden",
    reference: "Meroitica 21 (2004); pages not confirmed",
    sourceType: "academic_paper",
    publishedYear: 2004,
    publishedDisplay: "2004",
    notes:
      "The specialist study of Taharqa's inscribed monument on the summit of the pinnacle, cited for Kendall's identification of the pinnacle as a colossal natural uraeus. Its existence and year were confirmed by search; the volume and pages were not seen. NEEDS SOURCE VERIFICATION for the publication details and for any statement about gold sheathing, which in this session was found only in a popular source.",
  },
  {
    key: "russmann_1974_king_xxvth_dynasty",
    title: "The Representation of the King in the XXVth Dynasty",
    author: "Edna R. Russmann",
    publisher: "Fondation Égyptologique Reine Élisabeth, Brussels, and The Brooklyn Museum, Brooklyn (Monographies Reine Élisabeth 3)",
    reference: "Monographies Reine Élisabeth 3; pp. 28 ff., 33 ff., 62–67 as cited by FHN and museum catalogues",
    sourceType: "academic_book",
    publishedYear: 1974,
    publishedDisplay: "1974",
    notes:
      "THE STANDARD STUDY of Kushite royal iconography, cited (as FHN and museum catalogues cite it, pp. 28 ff., 33 ff., 62–67) for the Kushite cap-crown and the double uraeus as a distinctively 25th-Dynasty royal insignia. Bibliographic record confirmed in library catalogues; the book was not opened, so her own interpretation of WHY there are two cobras is not reported here. NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "torok_1997_kingdom_of_kush",
    title: "The Kingdom of Kush: Handbook of the Napatan-Meroitic Civilization",
    author: "László Török",
    publisher: "Brill, Leiden (Handbuch der Orientalistik I.31)",
    reference: "Handbuch der Orientalistik I.31 (1997); chapters on Napatan kingship and Meroitic chronology",
    sourceType: "academic_book",
    publishedYear: 1997,
    publishedDisplay: "1997",
    notes:
      "The standard handbook of Napatan and Meroitic history, cited for the royal chronology, the role of the queen mother in succession and the coronation journey between Napata, Kawa and other Amun temples. Not opened in this session; cited at the level of its general argument. NEEDS SOURCE VERIFICATION for specific pages.",
  },
  {
    key: "bonnet_valbelle_2006_nubian_pharaohs",
    title: "The Nubian Pharaohs: Black Kings on the Nile",
    author: "Charles Bonnet and Dominique Valbelle",
    publisher: "American University in Cairo Press, Cairo and New York",
    reference: "AUC Press, 2006; the chapters on the Doukki Gel cache",
    sourceType: "academic_book",
    publishedYear: 2006,
    publishedDisplay: "2006 (English edition of Des pharaons venus d'Afrique, 2005)",
    notes:
      "The excavators' account of the cache of royal statues found at Doukki Gel, Kerma, in 2003, cited for the find, the kings represented and the dating of their burial to the Egyptian campaign of the 590s BC. Bibliographic details confirmed from the Learning Sites bibliography; not opened. NEEDS SOURCE VERIFICATION for statue-by-statue details.",
  },
  {
    key: "bonnet_valbelle_2014_ville_de_kerma",
    title: "La ville de Kerma: une capitale nubienne au sud de l'Égypte",
    author: "Charles Bonnet and Dominique Valbelle",
    publisher: "Favre, Lausanne",
    reference: "Favre, Lausanne, 2014",
    sourceType: "academic_book",
    publishedYear: 2014,
    publishedDisplay: "2014",
    notes:
      "The Geneva mission's synthesis of fifty years at Kerma, cited for the city, the Western Deffufa as its principal temple and the chronology of Kerma Ancien, Moyen and Classique. Known from the D'Itria project bibliography; not opened. NEEDS SOURCE VERIFICATION for details.",
  },
  {
    key: "ditria_amulets_of_kerma_culture",
    title: "The Amulets of the Kerma Culture: iconography and manufacture technique of the amulets of the Kerma culture in Nubia, Sudan (2500–1400 BC)",
    author: "Elena D'Itria",
    publisher: "Open Context (project page; monograph forthcoming in the Harvard Egyptological Series)",
    url: "https://opencontext.org/projects/2c7ff3c8-b299-4138-ab04-f4e17e49ad64",
    sourceType: "academic_paper",
    publishedDisplay: "project abstract, read October 2026",
    notes:
      "Cited for the state of knowledge on Kerma religion: 'no written documents produced by the Kerma culture have ever been discovered', and 'the study of funerary monuments and religious customs has so far provided scant information on the Nubian pantheon'; 1,767 Kerma amulets studied, whose full typology is not yet published. Read in this session. The abstract does not say whether any amulets show snakes.",
  },
  {
    key: "zabkar_1975_apedemak",
    title: "Apedemak, Lion God of Meroe: A Study in Egyptian-Meroitic Syncretism",
    author: "Louis V. Žabkar",
    publisher: "Aris & Phillips, Warminster",
    reference: "Aris & Phillips, Warminster, 1975",
    sourceType: "academic_book",
    publishedYear: 1975,
    publishedDisplay: "1975",
    notes:
      "The monograph on Apedemak, cited for his forms (lion-headed man, lion, lion-headed serpent), his hymn at Musawwarat and the suggestion, reported in summaries, that the serpent form may be apotropaic. Bibliographic record confirmed; the book was not opened. NEEDS SOURCE VERIFICATION for every specific reading attributed to it.",
  },
  {
    key: "gamer_wallert_1983_lowentempel_naqa",
    title: "Der Löwentempel von Naq'a in der Butana (Sudan) III: Die Wandreliefs",
    author: "Ingrid Gamer-Wallert",
    publisher: "Reichert, Wiesbaden (Beihefte zum Tübinger Atlas des Vorderen Orients B 48)",
    reference: "TAVO Beihefte B 48 (1983)",
    sourceType: "academic_book",
    publishedYear: 1983,
    publishedDisplay: "1983",
    notes:
      "The full publication of the reliefs of the Lion Temple at Naqa, cited as the place where the serpent-bodied Apedemak on the pylon and the three-headed Apedemak on the rear wall are recorded wall by wall. Not opened in this session; its title and series are given from memory of standard bibliographies. NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "wildung_kroeper_2006_naga",
    title: "Naga: Royal City of Ancient Sudan",
    author: "Dietrich Wildung and Karla Kroeper",
    publisher: "Staatliche Museen zu Berlin, Berlin",
    reference: "Staatliche Museen zu Berlin, 2006",
    sourceType: "academic_book",
    publishedYear: 2006,
    publishedDisplay: "2006",
    notes:
      "The Naga Project's book on the site, cited for the Lion Temple of Natakamani and Amanitore, the 'Roman kiosk' and the Amun temple. Not opened; known through the Naqa article's bibliography. NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "hintze_1962_inschriften_lowentempel_musawwarat",
    title: "Die Inschriften des Löwentempels von Musawwarat es Sufra",
    author: "Fritz Hintze",
    publisher: "Akademie-Verlag, Berlin",
    reference: "Akademie-Verlag, Berlin, 1962",
    sourceType: "academic_book",
    publishedYear: 1962,
    publishedDisplay: "1962",
    notes:
      "The edition of the inscriptions of Arnekhamani's Lion Temple at Musawwarat es-Sufra, the earliest securely dated temple of Apedemak, excavated and re-erected by Hintze's Humboldt University expedition (1960–70). Not opened; known through the Apedemak and Musawwarat bibliographies. NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "rilly_devoogt_2012_meroitic_language",
    title: "The Meroitic Language and Writing System",
    author: "Claude Rilly and Alex de Voogt",
    publisher: "Cambridge University Press, Cambridge",
    url: "https://www.cambridge.org/core/books/meroitic-language-and-writing-system/DAF3BF91AC96026BBC249B88CCF15C5A",
    sourceType: "academic_book",
    publishedYear: 2012,
    publishedDisplay: "2012",
    notes:
      "The standard English introduction to Meroitic, cited for the script's use 'between circa 300 BC and 400 AD', the readable sound values and the small understood vocabulary, and Rilly's classification of Meroitic in the Eastern Sudanic branch of Nilo-Saharan. Publisher record seen; the book was not opened.",
  },
  {
    key: "rilly_2007_langue_royaume_meroe",
    title: "La langue du royaume de Méroé: un panorama de la plus ancienne culture écrite d'Afrique subsaharienne",
    author: "Claude Rilly",
    publisher: "Honoré Champion, Paris",
    reference: "Paris, 2007 (publisher unconfirmed)",
    sourceType: "academic_book",
    publishedYear: 2007,
    publishedDisplay: "2007",
    notes:
      "Rilly's first monograph on Meroitic, cited for the state of decipherment and the linguistic classification. Title and year confirmed (Collège de France and Rilly's own list); the publisher was not confirmed in this session. NEEDS SOURCE VERIFICATION for publisher.",
  },
  {
    key: "rilly_2016_uee_meroitic",
    title: "Meroitic",
    author: "Claude Rilly",
    publisher: "UCLA Encyclopedia of Egyptology (ed. W. Wendrich, J. Dieleman et al.), Los Angeles",
    url: "https://shs.hal.science/halshs-01482752",
    sourceType: "encyclopedia",
    publishedYear: 2016,
    publishedDisplay: "2016",
    notes:
      "An open-access specialist overview of the Meroitic language, cited with Rilly & de Voogt for what can and cannot be read. The HAL record was seen in this session; the text was not opened.",
  },
  {
    key: "kirwan_1960_decline_and_fall_of_meroe",
    title: "The Decline and Fall of Meroe",
    author: "L. P. Kirwan",
    publisher: "Kush 8",
    reference: "Kush 8 (1960); reprinted in Kirwan's collected Nubian studies (Variorum)",
    sourceType: "academic_paper",
    publishedYear: 1960,
    publishedDisplay: "1960",
    notes:
      "The classic article on the end of Meroë, which weighed Aksumite conquest against internal decline and the arrival of the Noba. The essay's title was confirmed in a table of contents of Kirwan's collected papers; the journal volume and year were not confirmed in this session. NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "munro_hay_1991_aksum",
    title: "Aksum: An African Civilisation of Late Antiquity",
    author: "Stuart Munro-Hay",
    publisher: "Edinburgh University Press, Edinburgh",
    reference: "Edinburgh University Press, 1991; on Ezana's campaigns (pp. 77–79 and 224 as cited by Wikipedia)",
    sourceType: "academic_book",
    publishedYear: 1991,
    publishedDisplay: "1991",
    notes:
      "Cited for Ezana's reign (c. 320s–c. 360 CE), his campaigns and the Ge'ez inscriptions that record a campaign to the Nile, including the stela fragments found at Meroë itself. Not opened; cited as the Wikipedia article on Ezana cites it. NEEDS SOURCE VERIFICATION for pages.",
  },
  {
    key: "trigger_1969_myth_of_meroe",
    title: "The Myth of Meroe and the African Iron Age",
    author: "Bruce G. Trigger",
    publisher: "African Historical Studies 2 (1)",
    reference: "African Historical Studies 2 (1969), no. 1, pp. 23–50",
    sourceType: "academic_paper",
    publishedYear: 1969,
    publishedDisplay: "1969",
    notes:
      "THE CRITIQUE of the idea that Meroë was the source from which iron-working, state-building and ideas spread across sub-Saharan Africa. Cited, through Humphris & Rehren's summary, for his finding of no eastern cultural traits or technological similarities in West Africa that would mark such a transmission. Citation confirmed in several places; the article was not opened.",
  },
  {
    key: "humphris_rehren_2014_iron_kush",
    title: "Iron production and the Kingdom of Kush: an introduction to UCL Qatar's research in Sudan",
    author: "Jane Humphris and Thilo Rehren",
    publisher: "In a Festschrift for Steffen Wenig (Sudanarchäologische Gesellschaft zu Berlin)",
    url: "https://www.sag-online.de/wp-content/uploads/2018/06/HumphrisRehren2014_IronProductionIntroductionUCLQatarsResearch_FSWenig.pdf",
    sourceType: "academic_paper",
    publishedYear: 2014,
    publishedDisplay: "2014",
    notes:
      "Cited for the history of the 'Meroë as Africa's iron centre' idea: Sayce's 1912 sentence that Meroë 'must have been the Birmingham of ancient Africa', Wainwright's diffusionism, Shinnie's suggestion that iron 'may well have diffused south and west from Meroe', Stuiver and van der Merwe's 1968 finding that Meroitic iron was younger than iron further west and south, and Trigger's 1969 critique. Read in full in this session.",
  },
  {
    key: "seligman_1934_egypt_and_negro_africa",
    title: "Egypt and Negro Africa: A Study in Divine Kingship",
    author: "C. G. Seligman",
    publisher: "George Routledge & Sons, London",
    reference: "Routledge, London, 1934",
    sourceType: "academic_book",
    publishedYear: 1934,
    publishedDisplay: "1934",
    notes:
      "Cited as the classic statement of the diffusionist model in which African divine kingship was explained by 'Hamitic' migrations from the Nile Valley. VIEWPOINT: the 'Hamitic hypothesis' since rejected by Africanists. Existence confirmed in catalogues; not opened. Cited for the genealogy of the westward-transmission idea, not for any fact about Kush.",
  },
  {
    key: "meyerowitz_1960_divine_kingship_ghana_egypt",
    title: "The Divine Kingship in Ghana and Ancient Egypt",
    author: "Eva L. R. Meyerowitz",
    publisher: "Faber and Faber, London",
    reference: "Faber and Faber, London, 1960; 260 pp. (ARCE library record)",
    sourceType: "book",
    publishedYear: 1960,
    publishedDisplay: "1960",
    notes:
      "Cited as a named proponent of a Nile-to-West-Africa link: it compares Akan and Egyptian divine kingship and connects them through migrations that a French encyclopaedia entry calls 'quite hypothetical'. Catalogue record confirmed (ARCE library); not opened. Cited for the genealogy of the westward idea only.",
  },
  {
    key: "lohwasser_2001_konigliche_frauen_kusch",
    title: "Die königlichen Frauen im antiken Reich von Kusch: 25. Dynastie bis zur Zeit des Nastasen",
    author: "Angelika Lohwasser",
    publisher: "Harrassowitz, Wiesbaden (Meroitica 19)",
    reference: "Meroitica 19 (2001)",
    sourceType: "academic_book",
    publishedYear: 2001,
    publishedDisplay: "2001",
    notes:
      "The study of royal women in Napatan Kush, cited for the titles and ritual roles of the king's mother and king's sister. Not opened in this session; given from standard bibliographies. NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "wikipedia_kush_navigation",
    title: "Wikipedia articles on Apedemak, Aspelta, Anlamani, Kandake, Naqa, Musawwarat es-Sufra, the Meroitic language and Ezana",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Apedemak",
    sourceType: "wikipedia",
    publishedYear: 2026,
    publishedDisplay: "accessed October 2026",
    notes:
      "Read in this session and USED ONLY TO LOCATE scholarship (Žabkar, Hintze, Rilly, Munro-Hay, Lohwasser) and to cross-check dates — never the sole support for a claim. Where it conflicts with a primary text (for example the Apedemak article placing the serpent form on a 'column'), the conflict is noted.",
  },
];

// ---------------------------------------------------------------------------
// Pictures (every File: page opened in this session; licences as stated there)
// ---------------------------------------------------------------------------

const PD_MARK = "Public domain (PD-old / PD-1923; Creative Commons Public Domain Mark 1.0)";

const pNaqaSerpent = commonsPicture({
  fileName: "NaqaLionTempleApedemakSnake.jpg",
  caption:
    "The Lion Temple at Naqa, Sudan: on the narrow side face of a pylon tower, Apedemak as a long coiled serpent rising up the stone, with (now damaged) lion's head at the top. Relief of the 1st century CE; photograph 2017 by Clemens Schmillen.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Clemens Schmillen",
  objectDate: "1st century CE",
});

const pNaqaSide = commonsPicture({
  fileName: "Naqa Apeadmak side.jpg",
  caption:
    "Side wall of the Lion Temple at Naqa: King Natakamani and Queen Amanitore before Kushite gods, as the uploader describes it. Relief of the 1st century CE; photograph 2005.",
  shows: "site",
  identificationStatus: "secure",
  licence: "GFDL 1.2+ / CC BY-SA 4.0, 3.0, 2.5, 2.0, 1.0 (uploader's choice)",
  creator: "LassiHU",
  objectDate: "1st century CE",
});

const pNaqaThreeHeads = commonsPicture({
  fileName: "NaqaLionTempleApedemak3heads4arms.jpg",
  caption:
    "Lion Temple at Naqa: Apedemak with three lion heads and four arms, the form on the temple's rear wall. Relief of the 1st century CE; photograph 2017.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Clemens Schmillen",
  objectDate: "1st century CE",
});

const pNaqaPylon = commonsPicture({
  fileName: "Naga Löwentempel.jpg",
  caption:
    "Front pylon of the Lion Temple at Naqa: Natakamani and Amanitore subduing enemies, a lion at each one's feet. Relief of the 1st century CE; photograph 2010.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY 3.0",
  creator: "TrackHD",
  objectDate: "1st century CE",
});

const pAmanitore = commonsPicture({
  fileName: "Amanitore.jpg",
  caption:
    "Queen Amanitore smiting prisoners, from the pylon of the Lion Temple at Naqa (detail). Relief of the 1st century CE; photograph 2005.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 2.5 / CC BY-SA 3.0 / GFDL 1.2+",
  creator: "Lassi (hu.wikipedia)",
  objectDate: "1st century CE",
});

const pNaqaKiosk = commonsPicture({
  fileName: "Hathor Chapel (Roman Kiosk) (2) (34120647386).jpg",
  caption:
    "The so-called Roman Kiosk at Naqa, a small temple with Egyptian, Hellenistic and Roman elements, with the Lion Temple behind it to the right. 1st century CE; photograph 2017.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 2.0",
  creator: "Hans Birger Nilsen",
  objectDate: "1st century CE",
});

const pTaharqaDoubleUraeus = commonsPicture({
  fileName: "Taharqa in double uraeus cap.jpg",
  caption:
    "UNVERIFIED — the file page names the subject as Pharaoh Taharqa in the double-uraeus cap but does not say which statue this is or where it is held, so the object cannot be identified from the page. What it shows is a Kushite royal head with the close-fitting cap and two cobras at the brow. 25th Dynasty, 7th century BCE; photograph 2020.",
  shows: "artefact",
  identificationStatus: "unverified",
  licence: "CC BY-SA 4.0",
  creator: "EditorfromMars",
  objectDate: "7th century BCE (as stated)",
});

const pTaharqaSphinx = commonsPicture({
  fileName: "Sphinx of Taharqo front view.jpg",
  caption:
    "Granite-gneiss sphinx of Taharqo from Temple T at Kawa, Sudan, about 680 BCE: the king's face with a lion's mane and body. British Museum EA 1770 (1932,0611.1). Photograph 2012.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 3.0",
  creator: "BabelStone",
  institution: "British Museum, London",
  accessionNumber: "EA 1770",
  objectDate: "c. 680 BCE",
});

const pTaharqaKermaMuseum = commonsPicture({
  fileName: "Taharqa portrait, Kerma Museum.jpg",
  caption:
    "Head of the statue of Taharqa from the Doukki Gel cache, now in the Kerma Museum, Sudan. 7th century BCE; photograph 2018, cropped from a group photograph.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Matthias Gehricke",
  institution: "Kerma Museum, Sudan",
  objectDate: "7th century BCE",
  provenanceNotes:
    "The parent file's embedded metadata says 'All rights reserved', which conflicts with the CC BY-SA 4.0 licence stated on both file pages. The stated licence is recorded; the conflict is flagged for the seeding check.",
});

const pShabaqoHead = commonsPicture({
  fileName: "Cabeza del faraón Shabako, British Museum.jpg",
  caption:
    "Granite head of Shabaqo (Neferkare Shabaka), Kushite king of the 25th Dynasty, c. 716–702 BCE, said to be from Heliopolis; British Museum (EA 63833, per its Commons category). Photograph 2019.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Jl FilpoC",
  institution: "British Museum, London",
  accessionNumber: "EA 63833",
  objectDate: "late 8th century BCE",
});

const pPiyeStela = commonsPicture({
  fileName: "Stele of Piye (complete).jpg",
  caption:
    "The victory stela of Piye from Gebel Barkal (now Cairo), as drawn by Auguste Mariette and published in 1872 in Monuments divers. A nineteenth-century drawing of a stela of c. 727 BCE, not a photograph.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD_MARK,
  creator: "Auguste Mariette",
  objectDate: "stela c. 727 BCE; drawing published 1872",
});

const pPiyeFigure = commonsPicture({
  fileName: "Piye (crop).jpg",
  caption:
    "The partly erased figure of Piye in the lunette of his victory stela, cropped from Mariette's drawing published in 1872. A nineteenth-century drawing, not a photograph.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD_MARK,
  creator: "Auguste Mariette",
  objectDate: "stela c. 727 BCE; drawing published 1872",
});

const pDreamStela = commonsPicture({
  fileName: "Stele of the Dream by Tantamani, Jebel Barkal, Sudan.jpg",
  caption:
    "The Dream Stela of Tanutamani from Gebel Barkal (Cairo JE 48863), as drawn by Auguste Mariette and published in 1872. The stela records the king's dream of two serpents. A nineteenth-century drawing of a stela of 664 BCE.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD_MARK,
  creator: "Auguste Mariette",
  objectDate: "stela 664 BCE; drawing published 1872",
});

const pDeffufa = commonsPicture({
  fileName: "Western Deffufa - Kerma.jpg",
  caption:
    "The Western Deffufa at Kerma, Sudan: the great mud-brick temple at the centre of the Kerma culture's capital, built and enlarged during the 2nd millennium BCE. Photograph 2009.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY 2.0",
  creator: "Walter Callens",
  objectDate: "c. 2000–1500 BCE",
});

const pReisnerMap = commonsPicture({
  fileName: "Map from the 1916 Harvard-Boston Museum Expedition at Jabel Barkal.jpg",
  caption:
    "Plan of the temples at Gebel Barkal by George A. Reisner of the Harvard–Boston expedition, from 'The Barkal Temples in 1916' (published 1917). An excavation plan, not a photograph.",
  shows: "map",
  identificationStatus: "secure",
  licence: "Public domain (PD-1923; PD-old)",
  creator: "George Andrew Reisner",
  objectDate: "1916–1917",
});

const pBarkalUnesco = commonsPicture({
  fileName: "Gebel Barkal and the Sites of the Napatan Region-114668.jpg",
  caption:
    "Gebel Barkal and its pyramids, Napatan region, Sudan (UNESCO World Heritage site 1073). Photograph 2008, released by UNESCO.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 3.0 IGO",
  creator: "Maria Gropa / UNESCO",
});

const pBarkalFromNile = commonsPicture({
  fileName: "Jebel Barkal (34050941056).jpg",
  caption:
    "Gebel Barkal seen across the Nile from the south: the flat-topped butte with Karima in front of it. The free-standing pinnacle stands at the butte's south corner. Photograph 2017.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 2.0",
  creator: "Hans Birger Nilsen",
});

const pBarkalRock = commonsPicture({
  fileName: "Jebel barkal rock.jpg",
  caption:
    "Gebel Barkal near Karima, Sudan, with the remaining columns of Taharqa's temple of Mut (B 300) at the foot of the cliff, where the temple is partly cut into the rock. Photograph by Maarten van Beek, 2006 or earlier.",
  shows: "site",
  identificationStatus: "secure",
  licence: "Attribution only (Maarten van Beek, www.maartenvanbeek.nl)",
  creator: "Maarten van Beek",
});

const pBarkalMountain = commonsPicture({
  fileName: "Barkalmountain.jpg",
  caption: "Gebel Barkal, northern Sudan: a general view of the mountain. Photograph 2008.",
  shows: "site",
  identificationStatus: "secure",
  licence: "Public domain (released by the author)",
  creator: "Sudani",
});

const pMutTemple = commonsPicture({
  fileName: "Taharqa in the Temple of Mut, Jebel Barkal, Sudan.jpg",
  caption:
    "Relief of Taharqa in the rock-cut temple of Mut (B 300) at Gebel Barkal, 7th century BCE. Photograph by Clemens Schmillen, cropped from a larger view.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Clemens Schmillen",
  objectDate: "c. 690–664 BCE",
});

const pAmunBarkal = commonsPicture({
  fileName: "Amun in Barkal.jpg",
  caption:
    "Amun-Re and Taharqa in relief in temple B 300 at Gebel Barkal, as the uploader describes it. 7th century BCE; photograph 2005.",
  shows: "site",
  identificationStatus: "secure",
  licence: "GFDL 1.2+ / CC BY-SA 4.0, 3.0, 2.5, 2.0, 1.0 (uploader's choice)",
  creator: "LassiHU",
  objectDate: "c. 690–664 BCE",
});

const pThutmoseStela = commonsPicture({
  fileName: "Victory stele of Thutmose III.jpg",
  caption:
    "The granite stela set up by Thutmose III at Gebel Barkal in his 47th regnal year to mark his southern frontier, now in the Museum of Fine Arts, Boston. 15th century BCE; photograph 2012.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY 3.0",
  creator: "Marcus Cyron",
  institution: "Museum of Fine Arts, Boston",
  objectDate: "15th century BCE",
});

const pKawaVIII = commonsPicture({
  fileName:
    "Egitto, regno di taharqa, stele VIII, con faraone anlamani della XXV dinastia, dalla cappella del tempio di taharqa a kawa, 690-664 ac ca.jpg",
  caption:
    "Kawa stela VIII of Anlamani, the record of his enthronement journey to Kawa and of the queen mother Nasalsa's arrival, from the Amun temple at Kawa; Ny Carlsberg Glyptotek, Copenhagen (ÆIN 1709 in FHN). Late 7th century BCE (the file title's dates are Taharqa's, for the temple). Photograph 2024.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Francesco Bini (Sailko)",
  institution: "Ny Carlsberg Glyptotek, Copenhagen",
  accessionNumber: "ÆIN 1709",
  objectDate: "late 7th century BCE",
});

const pHamadab = commonsPicture({
  fileName: "British Museum - Hamadab Stela 01.jpg",
  caption:
    "The Hamadab Stela, with 45 lines of incised Meroitic cursive, sandstone, from Hamadab near Meroë; British Museum EA 1650. Late 1st century BCE. The longest Meroitic royal text, which can be read aloud but not fully translated.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY 3.0",
  creator: "Pymouss",
  institution: "British Museum, London",
  accessionNumber: "EA 1650",
  objectDate: "1st century BCE",
});

const pMeroiticMunich = commonsPicture({
  fileName: "Meroitische Inschrift, Meroe 1. Jh. n. Chr., Aegyptisches Museum, Muenchen-1.jpg",
  caption:
    "Meroitic inscription from Meroë, sandstone, 1st century CE; Staatliches Museum Ägyptischer Kunst, Munich (ÄS 2624; REM 1195). Photograph 2014.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 3.0",
  creator: "Rufus46",
  institution: "Staatliches Museum Ägyptischer Kunst, Munich",
  accessionNumber: "ÄS 2624",
  objectDate: "1st century CE",
});

const pMeroiticChart = commonsPicture({
  fileName: "Meroitic.png",
  caption:
    "A modern chart of the Meroitic hieroglyphic and cursive signs with their conventional sound values, drawn with a modern font. A reference diagram, not an ancient object.",
  shows: "diagram",
  identificationStatus: "secure",
  licence: "Public domain (released by the author)",
  creator: "Runic code (en.wikipedia), revised by Kwamikagami and AnonMoos",
});

const pTanyidamani = commonsPicture({
  fileName: "Egyptian - Votive Plaque of King Tanyidamani - Walters 22258.jpg",
  caption:
    "Votive plaque of the Meroitic king Tanyidamani, about 100 BCE: on the reverse the lion-headed Apedemak, with Meroitic inscriptions naming king and god; Walters Art Museum 22.258.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "Object public domain; photograph CC BY-SA 3.0 / GFDL (Walters Art Museum)",
  creator: "Walters Art Museum",
  institution: "Walters Art Museum, Baltimore",
  accessionNumber: "22.258",
  objectDate: "c. 100 BCE",
});

const pAmanishakheto = commonsPicture({
  fileName: "Relief Amanishakheto Munich.JPG",
  caption:
    "Stela of the kandake Amanishakheto between the goddess Amesemi and the god Apedemak, sandstone, from the Amun temple at Naqa, 1st century BCE; Munich, on loan from the National Museum, Khartoum. Photograph 2015.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Khruner",
  institution: "Staatliches Museum Ägyptischer Kunst, Munich (loan from the Sudan National Museum)",
  objectDate: "1st century BCE",
});

const pWingedPectoral = commonsPicture({
  fileName: "Winged goddess pectoral.jpg",
  caption:
    "Faience pectoral of a winged goddess with cobras on her upper arms, from the tomb of Queen Nefrukekashta at el-Kurru (Ku 52), reign of Piye (743–712 BCE), excavated 1919 by the Harvard–Boston expedition; Museum of Fine Arts, Boston.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC0 1.0 (Museum of Fine Arts, Boston)",
  creator: "Nubian artist; Harvard University–Boston Museum of Fine Arts Expedition",
  institution: "Museum of Fine Arts, Boston",
  objectDate: "8th century BCE",
});

const pMusawwaratTemple = commonsPicture({
  fileName: "MusawwaratLionTemple.jpg",
  caption:
    "The Lion Temple of Apedemak at Musawwarat es-Sufra, built under King Arnekhamani in the late 3rd century BCE and re-erected by Fritz Hintze's expedition in the 1960s. Photograph 2017.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Clemens Schmillen",
  objectDate: "late 3rd century BCE",
});

const pMusawwarat2018 = commonsPicture({
  fileName: "Apedemak temple in Musawwarat es-sufra 2018.jpg",
  caption: "The Apedemak (Lion) Temple at Musawwarat es-Sufra, Sudan, exterior. Late 3rd century BCE; photograph 2018.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Vaido Otsar",
  objectDate: "late 3rd century BCE",
});

const pMusawwaratRelief = commonsPicture({
  fileName: "Apedemak Relief (33279546314).jpg",
  caption:
    "UNVERIFIED — the photographer's title is only 'Apedemak Relief'; Commons files it under the Lion Temple at Musawwarat es-Sufra, but the photograph's exact wall and scene are not identified. What it shows is an interior wall of reassembled relief blocks with standing figures. Photograph 2017.",
  shows: "site",
  identificationStatus: "unverified",
  licence: "CC BY-SA 2.0",
  creator: "Hans Birger Nilsen",
});

const pMeroeSatellite = commonsPicture({
  fileName: "Meroe 9 October 2020.jpg",
  caption: "Satellite image of the Meroë region on the Nile, 9 October 2020 (NASA Worldview). A modern image of the landscape, not of any ancient structure in detail.",
  shows: "site",
  identificationStatus: "secure",
  licence: "Public domain (NASA)",
  creator: "NASA",
});

const pEzanaStone = commonsPicture({
  fileName: "The Ezana Stone (2840202630).jpg",
  caption:
    "The Ezana Stone at Aksum, Ethiopia: an inscription of King Ezana, 4th century CE. This is NOT the inscription recording his campaign to the Nile and Meroë; it is shown as an example of Ezana's royal inscriptions. Photograph 2007.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY 2.0",
  creator: "A. Davey",
  objectDate: "4th century CE",
});

const pNubiaMap = commonsPicture({
  fileName: "Nubia NASA-WW places german.jpg",
  caption:
    "Map of ancient Nubia drawn over a NASA World Wind satellite image, with ancient place names in German (Kerma, Napata, Meroë and others along the Nile). A modern map, made 2006.",
  shows: "map",
  identificationStatus: "secure",
  licence: "Public domain (PD-WorldWind)",
  creator: "Udimu (de.wikipedia), on NASA World Wind imagery",
});

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

const events: SeedEvent[] = [
  // =========================================================================
  // THE ANCHOR
  // =========================================================================
  {
    slug: ANCHOR,
    title: "Kushite serpents: what the evidence is",
    summary:
      "Kush took the Egyptian royal cobra and made it its own: kings with two cobras at the brow, a lion god with a serpent's body, a mountain read as a rearing uraeus. Every step of that is documented on the Nile. Nothing in the record carries it west across the Sahel.",
    description:
      "THE QUESTION THIS LANE ASKS. Oshi's research question passes through Kush: if Egyptian serpent religion reached West Africa by land, the Middle Nile kingdoms are the obvious way it would have gone. So this lane asks two separate things. First, what the Kushite kingdoms (Kerma, about 2500–1500 BCE; Napata, from the 9th century BCE; Meroë, to the 4th century CE) actually did with serpents. Second, what the evidence says about any movement of those ideas west.\n\n" +
      "WHAT IS DOCUMENTED. (1) Egyptian conquest and temple-building in Nubia from the 15th century BCE, centred on Amun of Napata 'residing in the Pure Mountain', Gebel Barkal. (2) A distinctive Kushite royal insignia, the DOUBLE URAEUS, worn by Piye, Shabaqo, Taharqa and their successors, and explained in Tanutamani's own Dream Stela as the 'Two Goddesses' of a king of South and North; when Egypt turned against Kush, Psamtik II's sculptors chiselled one of the two cobras off Kushite royal images. (3) Enthronement texts in which a king is chosen by Amun's oracle and legitimated through his mother. (4) At Meroë and Naqa, a home-grown god, Apedemak, shown once as a serpent with a lion's head. (5) A Meroitic script that can be pronounced but only partly understood.\n\n" +
      "WHAT IS INTERPRETATION. Timothy Kendall's reading of the Gebel Barkal pinnacle as a natural colossal uraeus is an archaeologist's argument from the rock's shape, a Taharqa monument on its summit and Egyptian texts about the mountain. It is persuasive to many and is labelled here as his.\n\n" +
      "WHAT IS ABSENT. Kerma, the older indigenous kingdom, has left almost no readable evidence of serpent religion. And there is no archaeological, textual or linguistic evidence of Kushite religious contact west of the Nile Valley toward the Gbe-speaking coast; the old idea that Meroë seeded West African iron and kingship was taken apart by Trigger in 1969.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes documented Egypt–Kush exchange in serpent iconography over a thousand years, and genuine Kushite innovation within it. The Kushite serpent is a COBRA, the uraeus, a sign of kingship worn on the brow; it is not a python and is nowhere a living temple animal. Nothing here establishes any link to the python Dangbé of Hueda or the vodun Dan.",
    category: "religion",
    subcategory: SUBCATEGORY,
    eventType: "historical",
    tags: serpentTags(LANE, ["figure: wadjet and the uraeus", "figure: apedemak", "theme: kingship", "place: napata and meroe", "place: naqa", "theme: sacred landscape"], "overview"),
    people: ["Piye", "Shabaqo", "Taharqa", "Tanutamani", "Aspelta", "Natakamani", "Amanitore", "Timothy Kendall"],
    civilisations: ["Kingdom of Kush", "Kerma culture", "Napatan Kush", "Meroitic Kush", "New Kingdom Egypt"],
    locationName: "Middle Nile, Sudan (Kerma, Napata, Meroë)",
    lat: 18.5367,
    lng: 31.8275,
    claims: [
      {
        sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century",
        citations: [
          { sourceKey: "torok_1997_kingdom_of_kush", relation: "context", note: "Gives the Napatan and Meroitic royal chronology the range rests on." },
          { sourceKey: "kirwan_1960_decline_and_fall_of_meroe", relation: "context", note: "On the end of the Meroitic kingdom in the 4th century CE." },
        ],
        startYear: bce(750),
        endYear: 350,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The span of the Kushite royal inscriptions and monuments this lane draws on, from Piye to the end of Meroë",
        originalDateText: "From Piye's reign in the 8th century BC to the fall of Meroë in the 4th century AD",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. The range runs from the earliest Kushite royal inscriptions in FHN to the last Meroitic kings. It dates the DOCUMENTATION; Kushite religion before Piye is known only from archaeology.",
      },
      {
        sourceKey: "ditria_amulets_of_kerma_culture",
        citations: [
          { sourceKey: "bonnet_valbelle_2014_ville_de_kerma", relation: "context", note: "The excavators' chronology for the Kerma culture." },
        ],
        startYear: bce(2500),
        endYear: bce(1450),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Kerma culture, the indigenous kingdom before Egyptian conquest",
        originalDateText: "Kerma culture, 2500–1400 BC",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. The project's dates for the Kerma culture. They date the culture, not any serpent belief within it, of which almost nothing is known.",
      },
    ],
    media: [pNubiaMap, pNaqaSerpent, pTaharqaSphinx],
  },

  // =========================================================================
  // KERMA
  // =========================================================================
  {
    slug: "kerma-religion-and-the-missing-serpent",
    title: "Kerma's own religion, and how little of it shows a serpent",
    summary:
      "Kerma, the first kingdom of Kush (about 2500–1500 BCE), had great temples and rich burials but left no writing; its gods are unknown, and no published evidence found in this session shows a serpent cult there.",
    description:
      "WHAT IS EXCAVATED. Kerma, at the Third Cataract, was the capital of the earliest kingdom of Kush, the 'Kush' of Middle Kingdom Egyptian texts. Reisner dug its royal cemetery in 1913–16, mistaking it for an Egyptian outpost; Charles Bonnet's Geneva mission, working there since 1973, showed it to be an indigenous capital of more than 30 hectares. At its centre stands the Western Deffufa, a massive mud-brick temple enlarged over centuries. The eastern cemetery holds great tumuli with sacrificed attendants and animals, and funerary chapels.\n\n" +
      "WHAT IS KNOWN OF ITS RELIGION. Very little. In D'Itria's words, 'no written documents produced by the Kerma culture have ever been discovered', and the study of funerary monuments 'has so far provided scant information on the Nubian pantheon'. Her study of 1,767 Kerma amulets is the main hope of naming its gods; its typology is not yet published, and the project summary does not say whether any amulets depict snakes.\n\n" +
      "THE SERPENT QUESTION. This session found NO published Kerma serpent cult, serpent deity or uraeus used as a local royal symbol. Where Egyptian objects with uraei occur at Kerma they are imports or Egyptian-made. That absence is recorded as an absence: Kerma's religion is poorly known, not known to lack serpents.\n\n" +
      "WHY IT MATTERS. Any claim that serpent kingship in Kush was older than Egyptian influence would have to rest on Kerma. At present it cannot. The Kushite royal cobra appears with the Napatan kings, after five centuries of Egyptian rule in Nubia.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a powerful indigenous kingdom with its own temples and burial rites. It does not establish any serpent belief at Kerma, for or against. IMAGE GAP: no Kerma object securely showing a snake was found on Commons; the amulets are in the Museum of Fine Arts, Boston, the Sudan National Museum and the Musée d'Art et d'Histoire, Geneva (project page: https://opencontext.org/projects/2c7ff3c8-b299-4138-ab04-f4e17e49ad64).",
    category: "religion",
    subcategory: SUBCATEGORY,
    eventType: "archaeological_interpretation",
    tags: serpentTags(LANE, ["theme: kingship", "theme: healing and protection"], "kerma", "absence of evidence"),
    people: ["George Andrew Reisner", "Charles Bonnet", "Elena D'Itria"],
    civilisations: ["Kerma culture", "Kingdom of Kush"],
    locationName: "Kerma, Third Cataract, Sudan",
    lat: 19.6014,
    lng: 30.4094,
    claims: [
      {
        sourceKey: "ditria_amulets_of_kerma_culture",
        citations: [
          { sourceKey: "bonnet_valbelle_2014_ville_de_kerma", relation: "supports", note: "The Geneva mission's synthesis of the city and its temples." },
          { sourceKey: "reisner_1923_excavations_at_kerma", relation: "context", note: "First excavation of the cemetery and the source of most of the amulets." },
        ],
        startYear: bce(2450),
        endYear: bce(1550),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Kingdom of Kush with its capital at Kerma",
        originalDateText: "the flourishing Kingdom of Kush (2450-1550 BC)",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. The kingdom's span from the excavated sequence and Egyptian synchronisms. It dates the kingdom; it says nothing about serpent belief within it.",
      },
      {
        sourceKey: "ditria_amulets_of_kerma_culture",
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "Any serpent cult or serpent deity at Kerma",
        originalDateText: "No serpent cult attested at Kerma; Kerma pantheon unknown",
        datingMethod: "other",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. A recorded absence. Nothing published and found in this session dates a serpent cult at Kerma, so no date is given. The unpublished amulet typology could change this.",
      },
    ],
    media: [pDeffufa],
  },

  // =========================================================================
  // EGYPT IN NUBIA: AMUN OF NAPATA
  // =========================================================================
  {
    slug: "amun-of-napata-in-the-pure-mountain",
    title: "Amun of Napata 'residing in the Pure Mountain': Egypt's god at Gebel Barkal",
    summary:
      "Thutmose III's armies reached Gebel Barkal in the 15th century BCE; Egypt built a temple to Amun at the foot of the mountain it called the 'Pure Mountain', and Kushite kings later made that Amun their own source of kingship.",
    description:
      "WHAT IS DOCUMENTED. In his 47th regnal year (c. 1433 BCE in the conventional chronology; Commons gives c. 1443) Thutmose III set up a granite stela at Gebel Barkal, near the Fourth Cataract, as the southern boundary of his empire; it is now in Boston. Egypt founded Napata there and built the first temple of Amun at the foot of the mountain, which Egyptian texts call dw w'b, 'the Pure Mountain'. Egyptian rule lasted about three centuries, alongside temples at Soleb, Sesebi, Kawa and elsewhere in Nubia.\n\n" +
      "WHAT THE KUSHITE KINGS MADE OF IT. When the kings of Kush rose in the 8th century BCE, they adopted this Amun as the god who chose and crowned them. Tanutamani's Dream Stela has him go to 'the temple of Amon of Napata, residing in the Pure Mountain' to be crowned; Aspelta's Election Stela calls the god 'Amen-Re, lord of the Thrones of Two-lands, who resides in Pure-mountain'. Napata's Amun temple (B 500) remained the premier coronation site for centuries. Reisner's 1916 excavation began the modern study of its temples.\n\n" +
      "THE SERPENT CONNECTION. Amun himself is not a serpent god. His ram-headed Kushite form wears a sun disc and a uraeus, as Egyptian gods do. The serpent enters this landscape through the uraeus of kingship, and through Kendall's reading of the mountain's pinnacle (a separate record).\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes direct, documented Egyptian religious influence in Nubia: an Egyptian god, an Egyptian temple plan and Egyptian royal ideology, taken over by Kush. It is the strongest case of documented transmission in this whole track. It does not establish that Amun's cult spread beyond the Nile Valley. The Siwa oracle of Ammon in the Libyan desert (an existing record) is a separate Egyptian outpost, not evidence of a Kushite westward route.",
    category: "religion",
    subcategory: SUBCATEGORY,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: kingship", "theme: oracle and divination", "place: napata and meroe", "theme: sacred landscape"], "amun", "egypt in nubia"),
    people: ["Thutmose III", "Amun of Napata", "George Andrew Reisner"],
    civilisations: ["New Kingdom Egypt", "Napatan Kush"],
    locationName: "Gebel Barkal (ancient Napata), near Karima, Sudan",
    lat: 18.5367,
    lng: 31.8275,
    claims: [
      {
        sourceKey: "kendall_mohamed_2017_barkal_new_kingdom",
        citations: [
          { sourceKey: "gratien_djebel_barkal_temple_amon", relation: "supports", note: "Places the first temple to Amun of Napata at the start of the New Kingdom." },
          { sourceKey: "learning_sites_kendall_jebel_barkal", relation: "supports", note: "Thutmose III extended his conquests to Gebel Barkal and founded Napata; Egypt stayed about 300 years." },
        ],
        startYear: bce(1433),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Thutmose III's Year 47 stela at Gebel Barkal, the first datable Egyptian royal monument there",
        originalDateText: "Year 47 of Thutmose III",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. The stela is dated by regnal year; converting Year 47 to c. 1433 BCE depends on the chosen Egyptian chronology (some give c. 1443). It dates Egypt's presence, not the beginning of local worship at the mountain.",
      },
      {
        sourceKey: "breasted_1906_ancient_records_iv_kushite_kings",
        citations: [
          { sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century", relation: "supports", note: "Gives the same epithet in Aspelta's Election Stela and the Dream Stela." },
        ],
        startYear: bce(664),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "A Kushite king is crowned before Amun of Napata 'residing in the Pure Mountain'",
        originalDateText: "His majesty arrived at the temple of Amon of Napata, residing in the Pure Mountain",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Tanutamani's Dream Stela, Year 1 (664 BCE conventionally; Breasted 663). It documents the Kushite coronation at Napata in the king's own words.",
      },
    ],
    media: [pThutmoseStela, pReisnerMap, pAmunBarkal],
  },

  // =========================================================================
  // THE PINNACLE (KENDALL)
  // =========================================================================
  {
    slug: "gebel-barkal-pinnacle-as-uraeus",
    title: "The Gebel Barkal pinnacle as a rearing uraeus: Timothy Kendall's reading",
    summary:
      "The free-standing rock pinnacle on Gebel Barkal's cliff looks, from some angles, like a rearing cobra wearing a crown. Timothy Kendall argues that Egyptians and Kushites saw it that way and made the mountain a source of kingship; Taharqa put an inscribed monument on its summit.",
    description:
      "WHAT IS THERE. At the south corner of Gebel Barkal's 98-metre cliff stands a free-standing pinnacle, unparalleled in the Nile Valley. Taharqa (c. 690–664 BCE) built his temple of Mut (B 300) partly into the cliff beneath it. Excavators found a Taharqa inscription on the pinnacle with the holes of the scaffolding used to place it, and an inscription of King Nastasen, who restored the monument in the late 4th century BCE (as reported by Gratien, following Kendall).\n\n" +
      "KENDALL'S READING. Timothy Kendall, who excavated at Barkal for the Museum of Fine Arts, Boston, argues that the pinnacle was 'perceived in Antiquity as a gigantic natural statue with many overlapping identities: a rearing uraeus serpent, a phallus, a squatting god ... and ... a vaguely human form wearing a crown', and that because the uraeus and the White Crown were symbols of kingship, the pinnacle 'apparently proved to the Egyptians that the mountain was an original source of their Upper Egyptian kingship'. Gratien summarises: Kendall 'reconnaît les restes d'un uraeus colossal'. On this reading Taharqa's monument on the summit dressed the natural cobra as a royal one.\n\n" +
      "WHAT SUPPORTS IT. The shape (seen from the west, a hooded serpent with a crown-like top); the Egyptian name 'Pure Mountain' and the texts making it Amun's seat; the Mut temple cut into the rock beneath it; and the costly summit monument, which only makes sense if the pinnacle mattered. WHAT IS UNCERTAIN. No ancient text found in this session says in so many words 'the pinnacle is a uraeus'. The identification is an inference from shape, placement and royal investment.\n\n" +
      "WHY IT MATTERS HERE. This is the clearest candidate in the whole track for a SERPENT-ASSOCIATED SACRED LANDSCAPE tied to kingship, the comparison Oshi asked for with Savi's ditches. It is a natural rock read as a cobra and a crown, at a coronation sanctuary.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes royal monumental investment in the pinnacle under Taharqa and Nastasen. The uraeus reading is Kendall's, widely repeated and plausible, but an interpretation. It does not establish any parallel with Savi: there the serpent is a python and the earthworks are dug ditches, not a natural rock.",
    category: "religion",
    subcategory: SUBCATEGORY,
    eventType: "archaeological_interpretation",
    tags: serpentTags(LANE, ["theme: sacred landscape", "figure: wadjet and the uraeus", "theme: kingship", "place: napata and meroe"], "gebel barkal", "kendall"),
    people: ["Timothy Kendall", "Taharqa", "Nastasen", "Brigitte Gratien"],
    civilisations: ["Napatan Kush", "New Kingdom Egypt"],
    locationName: "Gebel Barkal pinnacle, near Karima, Sudan",
    lat: 18.5355,
    lng: 31.8282,
    argumentsFor:
      "The pinnacle's shape resembles a rearing cobra with a crown-like top; Egyptian texts make the mountain the 'Pure Mountain' and seat of Amun who grants kingship; Taharqa cut a temple of Mut into the cliff beneath it and placed an inscribed monument on its inaccessible summit, later restored by Nastasen — investment that implies the pinnacle had royal significance.",
    argumentsAgainst:
      "No ancient text located in this session explicitly calls the pinnacle a uraeus; the identification rests on its modern appearance and on inference from building work. The rock is read as several things at once (serpent, phallus, crowned figure, seated god) even by its proponent, which makes the cobra reading one among several.",
    genealogies: [
      {
        key: "barkal-pinnacle-uraeus",
        claim: "The pinnacle of Gebel Barkal was seen in antiquity as a giant uraeus, making the mountain a source of kingship",
        verdict: "partially_attested",
        verdictEvidence:
          "The royal monument on the summit and the mountain's sacred status are attested; the specific perception of the pinnacle as a uraeus is an archaeologist's inference, not a statement in an ancient text found here.",
        whatWouldChangeThis:
          "An ancient inscription or relief explicitly naming or drawing the pinnacle as a cobra would make it directly attested; a study showing the summit monument had another meaning, or that the pinnacle's present shape owes much to later erosion, would weaken it.",
        links: [
          {
            stage: "ancient_primary",
            who: "Taharqa's monument on the pinnacle; Nastasen's restoration inscription",
            year: bce(680),
            sourceKey: "gratien_djebel_barkal_temple_amon",
            saysAbsentReason: "The inscriptions were not read in this session; their existence is reported by Gratien and Kendall.",
            adds: "Royal investment in the pinnacle itself.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Timothy Kendall",
            year: 2004,
            sourceKey: "kendall_2004_monument_of_taharqa",
            saysAbsentReason: "The 2004 study was not opened; Kendall's view is quoted from the Learning Sites page written with him.",
            adds: "The reading of the pinnacle as a natural colossal uraeus wearing the White Crown.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Learning Sites, with Timothy Kendall",
            year: 2025,
            sourceKey: "learning_sites_kendall_jebel_barkal",
            says: "perceived in Antiquity as a gigantic natural statue with many overlapping identities: a rearing uraeus serpent, a phallus, a squatting god",
            adds: "The plain public statement of the reading, with its multiple identities.",
            citationStatus: "verified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "gratien_djebel_barkal_temple_amon",
        citations: [
          { sourceKey: "kendall_2004_monument_of_taharqa", relation: "supports", note: "The specialist study of Taharqa's monument on the pinnacle." },
        ],
        startYear: bce(690),
        endYear: bce(664),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Taharqa's inscribed monument on the pinnacle and his Mut temple beneath it",
        originalDateText: "une inscription de Taharqa (-690/-664) y fut d'ailleurs découverte",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Dated by Taharqa's reign. It dates the royal monument, not the moment anyone first saw a cobra in the rock.",
      },
      {
        sourceKey: "learning_sites_kendall_jebel_barkal",
        citations: [
          { sourceKey: "kendall_mohamed_2017_barkal_new_kingdom", relation: "supports", note: "Kendall's published argument on Barkal in the New Kingdom." },
        ],
        startYear: 2004,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Kendall's published identification of the pinnacle as a colossal uraeus",
        originalDateText: "Kendall's reading published from 2004 onwards",
        datingMethod: "source_assertion",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The date of the interpretation in print (Kendall's 2004 study; the exact first publication NEEDS SOURCE VERIFICATION). It is an archaeologist's reading, not an ancient statement.",
      },
    ],
    media: [pBarkalFromNile, pBarkalRock, pMutTemple, pBarkalUnesco, pBarkalMountain],
  },

  // =========================================================================
  // THE DOUBLE URAEUS
  // =========================================================================
  {
    slug: "kushite-double-uraeus",
    title: "The double uraeus: two cobras at the brow of the Kushite kings",
    summary:
      "From Piye and Shabaqo onwards, the kings of Kush wore a close cap-crown with two cobras at the brow. Tanutamani's Dream Stela explains two serpents as the 'Two Goddesses' of a king of South and North, and when Egypt turned on Kush, one cobra was chiselled off their images.",
    description:
      "WHAT THE OBJECTS SHOW. Kushite kings of the 25th Dynasty, who ruled Egypt as well as Kush in the late 8th and 7th centuries BCE, are shown in a close-fitting skullcap crown with a diadem, long streamers and TWO uraei at the brow. FHN's commentary describes Tanutamani 'wearing the Kushite skullcap-crown with diadem, streamers and the double uraeus above the brow' and Aspelta with 'the double uraeus at his brow', citing Russmann's 1974 study as the standard account. The head of Shabaqo in the British Museum and statues of Taharqa show it in the round. In the same scenes the queen mothers and queens wear ONE uraeus.\n\n" +
      "WHAT THE TEXTS SAY. Taharqa's Kawa V stela has him 'wearing the uraei (Wadjty) on my head'. The clearest text is the Dream Stela of Tanutamani from Gebel Barkal (664 BCE): 'his majesty saw a dream by night: two serpents, one upon his right, the other upon his left ... Thine is the Southland; take for thyself (also) the Northland. The \"Two Goddesses\" shine upon thy brow' (Breasted's translation). FHN reads the episode as a temple incubation in which priests interpreted the serpents 'as the uraei of the crown'.\n\n" +
      "WHAT HAPPENED TO IT. After Psamtik II's campaign against Kush (593/592 BCE), Kushite rulers' names were erased across Egypt and 'one of the two uraei of the diadem' was cut away on their images (FHN, citing Yoyotte and Leclant). Egypt's sculptors treated the second cobra as Kushite property.\n\n" +
      "WHAT IT MEANS, AND WHAT IS INTERPRETATION. The usual reading is that the two cobras stand for rule over two lands, Kush and Egypt, or the Two Goddesses of Upper and Lower Egypt claimed by a southern dynasty. The Dream Stela supports a two-lands reading; Russmann's own argument was not read in this session.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a distinctively Kushite royal insignia, built from the Egyptian uraeus and recognised as Kushite by Egypt itself. It is a cobra worn as regalia. It is not a living animal, a temple serpent or a python, and it never appears outside the Nile Valley.",
    category: "religion",
    subcategory: SUBCATEGORY,
    eventType: "historical",
    tags: serpentTags(LANE, ["figure: wadjet and the uraeus", "theme: kingship", "theme: oracle and divination", "place: napata and meroe"], "double uraeus", "25th dynasty"),
    people: ["Piye", "Shabaqo", "Taharqa", "Tanutamani", "Psamtik II", "Edna R. Russmann"],
    civilisations: ["Napatan Kush", "25th Dynasty of Egypt", "26th Dynasty of Egypt"],
    locationName: "Gebel Barkal and Kawa, Sudan; Thebes and Memphis, Egypt",
    lat: 18.5367,
    lng: 31.8275,
    claims: [
      {
        sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century",
        citations: [
          { sourceKey: "russmann_1974_king_xxvth_dynasty", relation: "supports", note: "The standard study of the Kushite cap-crown and double uraeus, cited by FHN." },
        ],
        startYear: bce(744),
        endYear: bce(593),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The double uraeus worn by Kushite kings from the 25th Dynasty to Aspelta",
        originalDateText: "the Kushite skullcap-crown with the double uraeus",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: archaeological. Dated by the reigns of the kings whose images carry it, from Piye and Shabaqo to Aspelta. Kushite kings went on using it later; this range covers the period discussed here.",
      },
      {
        sourceKey: "breasted_1906_ancient_records_iv_kushite_kings",
        citations: [
          { sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century", relation: "supports", note: "Modern translation and commentary reading the serpents as the uraei of the crown." },
        ],
        startYear: bce(664),
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Tanutamani's dream of two serpents, in the first year of his reign",
        originalDateText: "In the year 1, of his coronation as king his majesty saw a dream by night: two serpents",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Year 1 of Tanutamani, 664 BCE in current chronology. It dates the king's own explanation of the two serpents.",
      },
      {
        sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century",
        startYear: bce(593),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Psamtik II's campaign, after which one of the two uraei was erased from Kushite royal images in Egypt",
        originalDateText: "one of the two uraei of the diadem ... in all their representations",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: archaeological. The erasures are dated by association with Psamtik II's hostile policy (593/592 BCE). FHN reports them; the individual erased monuments were not seen in this session.",
      },
    ],
    passages: [
      {
        label: "Tanutamani's dream of two serpents",
        reference: "Dream Stela, lines 3–6; Breasted, Ancient Records IV §922, p. 469",
        sourceKey: "breasted_1906_ancient_records_iv_kushite_kings",
        objectName: "Dream Stela of Tanutamani, granite, from the Amun temple at Gebel Barkal",
        holdingInstitution: "Egyptian Museum, Cairo",
        accessionNumber: "JE 48863",
        layers: [
          {
            layer: "translation",
            sourceKey: "breasted_1906_ancient_records_iv_kushite_kings",
            content:
              "In the year 1, of his coronation as king his majesty saw a dream by night: two serpents, one upon his right, the other upon his left. Then his majesty awoke, and he found them not. His majesty said: 'Wherefore [has] this [come] to me?' Then they answered him, saying: 'Thine is the Southland; take for thyself (also) the Northland. The \"Two Goddesses\" shine upon thy brow, the land is given to thee, in its length and its breadth. [No] other divides it with thee.'",
            language: "English",
            evidence:
              "Breasted's 1906 translation, public domain, copied from the archive.org scan (OCR slips corrected). His footnote glosses the 'Two Goddesses' as 'the double diadem of Upper and Lower Egypt'. It establishes the king's own statement linking two serpents to rule over South and North.",
          },
          {
            layer: "translation",
            sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century",
            contentAbsentReason: "FHN's 1994 translation (no. 29) is in copyright; it is cited, not reproduced.",
            evidence:
              "FHN's commentary reads the dream as a temple incubation and says the attendants interpreted the two serpents 'as the uraei of the crown'.",
          },
        ],
      },
    ],
    media: [pShabaqoHead, pTaharqaDoubleUraeus, pDreamStela, pPiyeStela, pPiyeFigure],
  },

  // =========================================================================
  // DOUKKI GEL
  // =========================================================================
  {
    slug: "doukki-gel-cache-of-kushite-kings",
    title: "The Doukki Gel cache: seven broken Kushite kings, buried around 593 BCE",
    summary:
      "In 2003 Charles Bonnet's mission found a pit at Doukki Gel, beside Kerma, holding seven smashed granite statues of Kushite kings from Taharqa to Aspelta, probably broken in the Egyptian invasion of the 590s and buried by the Kushites.",
    description:
      "WHAT WAS FOUND. In January 2003 the Swiss mission led by Charles Bonnet found a cache in the temple area at Doukki Gel, about a kilometre from ancient Kerma. It held seven monumental granite statues of the kings Taharqa, Tanutamani, Senkamanisken, Anlamani and Aspelta, broken into pieces and carefully buried. Restored, they are now in the Kerma Museum.\n\n" +
      "WHY THEY WERE BROKEN. The excavators link the breakage to the Egyptian campaign of Psamtik II (593/592 BCE), which reached Napata, and see the pit as a respectful burial of damaged royal images by Kushites. A similar cache of statues was found by Reisner in the Amun temple at Gebel Barkal.\n\n" +
      "THE SERPENTS. The statues show the Kushite royal costume, with the cap-crown and the uraeus at the brow. The head of Taharqa from the cache is the one shown here. Which statues keep both uraei, and how the cobras were finished (gilding has been reported), NEEDS SOURCE VERIFICATION from the excavation publication. The statues are the best surviving three-dimensional evidence that the double uraeus belonged to Kushite royal sculpture at home in Kush, not only in Egypt.\n\n" +
      "THE KERMA SETTING. Doukki Gel sits beside the old Kerma capital. The Napatan kings built Amun temples on a site with a much older indigenous past. That juxtaposition is why the cache is sometimes cited for continuity between Kerma and Napata, but continuity of place is not continuity of religion, and no Kerma serpent tradition is attested.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes the royal iconography of six to seven decades of Kushite kings in their own kingdom, and a violent Egyptian intervention around 593 BCE. It does not establish what the cobras meant to Kushite viewers beyond what the inscriptions say.",
    category: "archaeology",
    subcategory: SUBCATEGORY,
    eventType: "historical",
    tags: serpentTags(LANE, ["figure: wadjet and the uraeus", "theme: kingship"], "doukki gel", "statue cache"),
    people: ["Charles Bonnet", "Dominique Valbelle", "Taharqa", "Tanutamani", "Senkamanisken", "Anlamani", "Aspelta", "Psamtik II"],
    civilisations: ["Napatan Kush", "26th Dynasty of Egypt"],
    locationName: "Doukki Gel, beside Kerma, Sudan",
    lat: 19.6,
    lng: 30.41,
    claims: [
      {
        sourceKey: "bonnet_valbelle_2006_nubian_pharaohs",
        citations: [
          { sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century", relation: "context", note: "Documents Psamtik II's hostile campaign and erasures of Kushite regalia." },
        ],
        startYear: bce(593),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Breakage and burial of the statues",
        originalDateText: "broken and hidden in a cache around 590 BC",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. The date comes from the latest king represented (Aspelta) and the historical Egyptian campaign. It is an excavators' inference, not a date written on the cache.",
      },
      {
        sourceKey: "bonnet_valbelle_2006_nubian_pharaohs",
        citations: [
          { sourceKey: "learning_sites_kendall_jebel_barkal", relation: "context", note: "Lists Bonnet and Valbelle 2006 as the account of the Nubian pharaohs and the Kerma cache." },
        ],
        startYear: 2003,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Discovery of the cache",
        originalDateText: "found in 2003 by Swiss archaeologist Charles Bonnet in Dukki Gel",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. The year of discovery, reported by the excavators and repeated on the Commons file page.",
      },
    ],
    media: [pTaharqaKermaMuseum],
  },

  // =========================================================================
  // ENTHRONEMENT
  // =========================================================================
  {
    slug: "anlamani-aspelta-enthronement-journey",
    title: "Chosen by Amun, shown to his mother: the Kushite enthronement journey of Anlamani and Aspelta",
    summary:
      "Kushite stelae of the late 7th century BCE record a new king chosen by the army and by Amun's oracle at Napata, then travelling to other Amun temples; at Kawa, Anlamani's mother Nasalsa came to see him 'like Isis saw her son Horus', and the king gave four sisters to the gods as sistrum-players.",
    description:
      "WHAT THE TEXTS SAY. ASPELTA'S ELECTION STELA (Cairo JE 48866, from the outer court of temple B 500 at Gebel Barkal, Year 1) tells how, after Anlamani's death, the army and its six commanders, six overseers of fortresses, six overseers of documents and the royal treasurers put the succession to Amen-Re of Napata. Led by the priests, they presented the king's brothers to the god, who chose Aspelta; Aspelta then entered alone and 'found all the crowns of the kings of Kush and their dominion-scepters set before this god'. The text names his mother Nasalsa and a line of royal women before her, each the daughter of a 'king's sister'. ANLAMANI'S KAWA VIII (Ny Carlsberg Glyptotek ÆIN 1709) records his journey to Kawa after enthronement; his mother Nasalsa was fetched, 'and she was exceedingly joyful after she saw His Majesty's beauty, (just) like Isis (was when she) saw her son Horus', and the king gave four sisters to Amun of Napata, Amun of Kawa, Amun of Pnubs and Amun of Nubia as sistrum-players.\n\n" +
      "THE SEQUENCE OF ACTIONS. As FHN reconstructs it: legitimation by the court and army; oracular choice by Amun at Napata; a private dialogue between king and god in the sanctuary; presentation to the people; then a journey to further Amun temples (Kawa, Pnubs and others) with festivals and gifts. The QUEEN MOTHER appears as priestess, shaking the sistrum, praying for her son's kingship, and in the lunette wearing ONE uraeus while the king wears two.\n\n" +
      "WHERE THE SERPENT IS. The uraeus marks the king, the queen mother and the gods in the lunettes. The ceremony is a coronation by oracle, not a serpent rite: there is no procession to a serpent's house and no living snake.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. The stelae are the kings' own records and establish the ideology of Kushite enthronement, deliberately built, FHN says, from Egyptian New Kingdom, Theban and Kushite elements. They do not establish how often the full journey was made, or any link with West African coronations. The Hueda coronation Des Marchais attended (dated April 1715 in Labat's text and April 1725 on the engraved plate; see hueda-coronation-1715-or-1725), with its procession to Dangbé's house under the king's mother, is a separate ceremony in a separate world. Any likeness, such as a king's mother in a coronation, is a widespread feature of African and Near Eastern kingship.",
    category: "religion",
    subcategory: SUBCATEGORY,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: procession and coronation", "theme: oracle and divination", "theme: kingship", "theme: priesthood", "place: napata and meroe"], "election stela", "kawa"),
    people: ["Anlamani", "Aspelta", "Nasalsa", "Amun of Napata", "Amun of Kawa"],
    civilisations: ["Napatan Kush"],
    locationName: "Gebel Barkal (Napata) and Kawa, Sudan",
    lat: 18.5367,
    lng: 31.8275,
    claims: [
      {
        sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century",
        citations: [
          { sourceKey: "macadam_1949_temples_of_kawa_inscriptions", relation: "supports", note: "The first edition of Kawa VIII, which FHN translates." },
          { sourceKey: "torok_1997_kingdom_of_kush", relation: "context", note: "Places Anlamani's reign in the late 7th century BCE." },
        ],
        startYear: bce(620),
        endYear: bce(600),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Anlamani's enthronement journey and Nasalsa's visit to Kawa (Kawa VIII)",
        originalDateText: "Enthronement stela of Anlamani from Kawa (Kawa VIII). Late 7th century BC.",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. The stela's own date is destroyed; it is placed by Anlamani's reign. It documents the ceremony as the king chose to record it.",
      },
      {
        sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century",
        citations: [
          { sourceKey: "lohwasser_2001_konigliche_frauen_kusch", relation: "context", note: "On the roles of royal women in Napatan succession." },
        ],
        startYear: bce(600),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Aspelta's election by the army and the oracle of Amun of Napata (Year 1)",
        originalDateText: "Election Stela of Aspelta from Year 1, from the Amun temple at Gebel Barkal",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Year 1 of Aspelta, c. 600 BCE; exact Napatan regnal dates are uncertain by a decade or more. The names of the king, his mother and female ancestors were later erased on the stela.",
      },
    ],
    passages: [
      {
        label: "The queen mother arrives at Kawa",
        reference: "Kawa VIII, lines 22–25 (FHN I no. 34)",
        sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century",
        objectName: "Kawa stela VIII of Anlamani",
        holdingInstitution: "Ny Carlsberg Glyptotek, Copenhagen",
        accessionNumber: "ÆIN 1709",
        layers: [
          {
            layer: "transliteration",
            sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century",
            content: "gm.n=s s3=s h'(w) mi Hr hr-tp srh=f ... mi m33 3st s3=s Hr h'(w) hr t3",
            language: "Egyptian",
            script: "Latin transliteration",
            evidence: "A short extract from FHN's transliteration (lines 23–24), normalised from the OCR text. It shows the Isis–Horus comparison is in the Egyptian text itself.",
          },
          {
            layer: "translation",
            sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century",
            content:
              "(When) she found her son effulgent like Horus on his throne, and she was exceedingly joyful after she saw His Majesty's beauty, (just) like Isis (was when she) saw her son Horus effulgent on earth.",
            language: "English",
            evidence:
              "A short quotation from FHN's translation (R. H. Pierce), used for comment. It establishes the queen mother's role in the king's own account of his enthronement.",
          },
        ],
      },
    ],
    media: [pKawaVIII, pReisnerMap],
  },

  // =========================================================================
  // ROYAL WOMEN
  // =========================================================================
  {
    slug: "kushite-queen-mothers-and-the-kandake",
    title: "King's mother and kandake: royal women of Kush and the single uraeus",
    summary:
      "Kushite queen mothers appear beside their sons in enthronement scenes wearing a single uraeus and shaking the sistrum; in the Meroitic period the title kandake (Meroitic kdke) was held by queens and queen mothers, some of whom ruled in their own right.",
    description:
      "NAPATAN QUEEN MOTHERS. In the Napatan stelae the king's mother is a priestess and a legitimator. In the Dream Stela Tanutamani's mother Kalhata and wife Piye-ere each wear 'a skullcap with one uraeus' and shake the sistrum; in Aspelta's Election Stela Nasalsa prays for her son's universal kingship, shakes two sistra and wears a single uraeus; FHN connects the double-sistrum detail to the titles of the Theban God's Wives of Amun. Aspelta's text lists a line of royal mothers, each descended from a 'king's sister', which Török and others read as a female succession line through which kingship was legitimated.\n\n" +
      "SERPENTS IN QUEENS' TOMBS. From el-Kurru, tomb Ku 52 of Queen Nefrukekashta (reign of Piye), comes a faience pectoral of a winged goddess with cobras on her upper arms; the Boston museum notes that such amulets were found in burials of early Napatan queens. It is the clearest WINGED goddess-and-cobra image in this lane, and it is Egyptianising work made for a Kushite queen.\n\n" +
      "THE KANDAKE. Meroitic kdke, 'kandake', was a title of royal women: a king's mother or wife, or a woman ruling as qore. Greek and Roman writers took it for a name ('Candace'): Strabo's one-eyed queen who fought Rome in the 20s BCE, Pliny, and Acts 8:27's 'Candace, queen of the Ethiopians'. Ruling kandakes included Shanakdakheto, Amanirenas, Amanishakheto and Amanitore, who appears as an equal of Natakamani on the Naqa pylon.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a strong, ritually central role for royal women in Kushite kingship, marked by the single uraeus. It does not establish any link to the king's mother who presided over the Hueda procession to Dangbé's house in Labat's account (published 1730; the coronation is dated 1715 in his text and 1725 on the plate): royal mothers are important in many monarchies, and nothing connects these two.",
    category: "religion",
    subcategory: SUBCATEGORY,
    eventType: "historical",
    tags: serpentTags(LANE, ["figure: wadjet and the uraeus", "theme: kingship", "theme: priesthood", "theme: procession and coronation", "place: napata and meroe"], "royal women", "kandake"),
    people: ["Nasalsa", "Kalhata", "Nefrukekashta", "Shanakdakheto", "Amanirenas", "Amanishakheto", "Amanitore"],
    civilisations: ["Napatan Kush", "Meroitic Kush"],
    locationName: "El-Kurru, Gebel Barkal and Meroë, Sudan",
    lat: 18.41,
    lng: 31.77,
    claims: [
      {
        sourceKey: "fhn_1_1994_eighth_to_mid_fifth_century",
        citations: [
          { sourceKey: "lohwasser_2001_konigliche_frauen_kusch", relation: "supports", note: "The study of royal women from the 25th Dynasty to Nastasen." },
        ],
        startYear: bce(664),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "Queen mother and queen shown with one uraeus beside a king with two (Dream Stela lunette)",
        originalDateText: "his mother Kalhata who wears skullcap with one uraeus",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: inscription. The lunette of the Dream Stela, Year 1 of Tanutamani. It dates one securely recorded instance, not the beginning of the convention.",
      },
      {
        sourceKey: "wikipedia_kush_navigation",
        citations: [
          { sourceKey: "rilly_devoogt_2012_meroitic_language", relation: "supports", note: "The Meroitic title kdke is among the words of known meaning." },
          { sourceKey: "torok_1997_kingdom_of_kush", relation: "context", note: "Chronology of the ruling Meroitic queens." },
        ],
        startYear: bce(170),
        endYear: 50,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Ruling kandakes from Shanakdakheto to Amanitore",
        originalDateText: "Shanakdakheto (c. 170 BCE) to Amanitore (mid-1st c. CE)",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Meroitic royal chronology is reconstructed from monuments and pyramids and is uncertain by decades; the Wikipedia summary was used only to collect the dates.",
      },
    ],
    media: [pWingedPectoral, pAmanishakheto, pAmanitore],
  },

  // =========================================================================
  // MUSAWWARAT
  // =========================================================================
  {
    slug: "musawwarat-lion-temple-of-arnekhamani",
    title: "Musawwarat es-Sufra: Arnekhamani's Lion Temple, the earliest dated temple of Apedemak",
    summary:
      "In the late 3rd century BCE King Arnekhamani built a temple to the lion god Apedemak at Musawwarat es-Sufra, in the Butana steppe; it is the earliest dated monument to a god of Meroë who had no Egyptian equivalent.",
    description:
      "WHAT IS THERE. Musawwarat es-Sufra lies in a valley of the Butana, east of the Nile and away from the river. Its Great Enclosure, a maze of courts, ramps and temples covering about 45,000 square metres, was largely built in the 3rd century BCE, and Hintze called its plan 'without parallel in the entire Nile valley'; its purpose is still debated. Nearby stands the single-chambered LION TEMPLE, built by King Arnekhamani and dedicated to Apedemak, the lion-headed war god of Meroë. It had collapsed and was re-erected by Fritz Hintze's Humboldt University expedition between 1960 and 1970.\n\n" +
      "WHY IT MATTERS. The temple's reliefs and Egyptian-language hieroglyphic inscriptions, edited by Hintze in 1962, give the earliest securely dated images of Apedemak and a hymn to him, which is the core of Žabkar's study. Apedemak is a Kushite god with no Egyptian counterpart, shown in Egyptian style and praised in Egyptian words: the clearest example of Meroitic religious innovation inside an Egyptian frame.\n\n" +
      "SERPENTS AT MUSAWWARAT. The brief asked for serpent amulets and reliefs here. This session found NO published serpent amulet or serpent-bodied relief from Musawwarat. Apedemak's serpent form is attested at Naqa (next record). Uraei occur in the Egyptian-style royal and divine regalia of the reliefs, as everywhere in Kushite temple art; that much is general, and specific scenes NEED SOURCE VERIFICATION against Hintze's plates.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes Apedemak's cult under Arnekhamani by the late 3rd century BCE. It does not establish a serpent cult at Musawwarat, nor how old Apedemak's worship is, since a god may be worshipped long before his first surviving temple.",
    category: "religion",
    subcategory: SUBCATEGORY,
    eventType: "historical",
    tags: serpentTags(LANE, ["figure: apedemak", "theme: kingship", "place: napata and meroe"], "musawwarat es-sufra", "lion temple"),
    people: ["Arnekhamani", "Apedemak", "Fritz Hintze"],
    civilisations: ["Meroitic Kush"],
    locationName: "Musawwarat es-Sufra, Butana, Sudan",
    lat: 16.4167,
    lng: 33.3236,
    claims: [
      {
        sourceKey: "hintze_1962_inschriften_lowentempel_musawwarat",
        citations: [
          { sourceKey: "zabkar_1975_apedemak", relation: "supports", note: "Treats the Musawwarat Lion Temple and its hymn as the earliest dated evidence for Apedemak." },
          { sourceKey: "wikipedia_kush_navigation", relation: "context", note: "Used to locate Hintze and the dates of the Humboldt expedition (1960–70)." },
        ],
        startYear: bce(235),
        endYear: bce(218),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Arnekhamani's Lion Temple of Apedemak",
        originalDateText: "built under King Arnekhamani, late 3rd century BC",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Dated by Arnekhamani's reign as reconstructed (c. 235–218 BCE); Meroitic regnal dates are uncertain by decades. It is the earliest dated temple of Apedemak, not the beginning of his cult.",
      },
    ],
    media: [pMusawwaratTemple, pMusawwarat2018, pMusawwaratRelief],
  },

  // =========================================================================
  // NAQA
  // =========================================================================
  {
    slug: "naqa-lion-temple-serpent-bodied-apedemak",
    title: "Naqa's Lion Temple: Apedemak as a lion-headed serpent",
    summary:
      "On the Lion Temple that Natakamani and Amanitore built at Naqa in the 1st century CE, Apedemak appears in three forms: a lion-headed man, a three-headed four-armed god, and, on the side of the pylon, a long serpent with a lion's head rising from a lotus.",
    description:
      "THE TEMPLE. At Naqa, in the Butana south-east of Meroë, the Meroitic king Natakamani and the kandake Amanitore built a single-roomed temple to Apedemak in the 1st century CE. Its PYLON shows the royal couple smiting enemies with lions at their feet. The SIDE WALLS show the king and queen before Kushite and Egyptian gods; the REAR WALL shows Apedemak with three lion heads and four arms receiving their offerings.\n\n" +
      "THE SERPENT. On the narrow side face of the pylon, as the photograph here shows, Apedemak is carved as a very long coiled serpent rising up the tower, with a lion's head and human arms and torso, emerging from a lotus. The Naqa article puts it 'near the edges of the front gateway'; Wikipedia's Apedemak article puts it on a 'column', which the photograph does not support. It is the only serpent form of Apedemak known to this session. Louis Žabkar suggested, as summaries report, that it may be apotropaic, a god who could ward off snakes; this NEEDS SOURCE VERIFICATION against his book. The lotus has led some to speculate about Indian influence, a speculation rather than a finding.\n\n" +
      "WINGED URAEI AND COBRAS. The temple's Egyptianising decoration uses the standard uraeus friezes and winged sun discs with cobras, and the nearby 'Roman Kiosk' has a uraeus lintel over its Egyptian-style doorway. These are Egyptian forms carried into Meroitic architecture. The detailed list wall by wall is in Gamer-Wallert's 1983 publication, not opened in this session.\n\n" +
      "WHAT IS NEW. A lion god given a serpent body is a Meroitic creation. It combines the Kushite lion god with the serpent, a form Egypt also used for protective and cosmic powers, but in a combination Egypt did not use for any god called Apedemak.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a serpent-bodied Kushite god on one royal temple, 1st century CE. It does not establish a serpent cult, a living serpent or any priesthood of serpents; nor is it comparable as a python. Apedemak is a lion god first, and his serpent form is rare.",
    category: "religion",
    subcategory: SUBCATEGORY,
    eventType: "historical",
    tags: serpentTags(LANE, ["figure: apedemak", "figure: wadjet and the uraeus", "theme: kingship", "place: naqa"], "lion temple", "serpent-bodied god"),
    people: ["Natakamani", "Amanitore", "Apedemak", "Louis V. Žabkar"],
    civilisations: ["Meroitic Kush"],
    locationName: "Naqa (Naga), Butana, Sudan",
    lat: 16.2694,
    lng: 33.2725,
    claims: [
      {
        sourceKey: "gamer_wallert_1983_lowentempel_naqa",
        citations: [
          { sourceKey: "wildung_kroeper_2006_naga", relation: "supports", note: "The Naga Project's account of the Lion Temple of Natakamani and Amanitore." },
          { sourceKey: "zabkar_1975_apedemak", relation: "supports", note: "Discusses the three forms of Apedemak at Naqa, including the lion-headed serpent." },
          { sourceKey: "wikipedia_kush_navigation", relation: "context", note: "Used to cross-check the reliefs' placement; conflicts noted in the description." },
        ],
        startYear: 1,
        endYear: 50,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The building and decoration of the Lion Temple by Natakamani and Amanitore",
        originalDateText: "commissioned by King Natakamani and Queen Amanitore in Naga in the 1st century CE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Dated by the royal couple named in the reliefs. Their reign is placed variously from about the turn of the era to the mid-1st century CE; this range spans those views.",
      },
    ],
    media: [pNaqaSerpent, pNaqaPylon, pNaqaSide, pNaqaThreeHeads, pNaqaKiosk, pTanyidamani],
  },

  // =========================================================================
  // MEROITIC
  // =========================================================================
  {
    slug: "meroitic-script-what-can-be-read",
    title: "Meroitic: a script that can be read aloud, a language barely understood",
    summary:
      "Griffith worked out the sound values of Meroitic writing in 1909–11, so names and titles such as Apedemak, qore and kdke can be read. The language itself is still mostly untranslated, so Meroitic religious vocabulary, including any word for a serpent, cannot be used in comparisons.",
    description:
      "WHAT CAN BE READ. Meroitic was written from about 300 BCE to the 5th century CE in two scripts, a hieroglyphic one for royal and religious display and a cursive one for most texts, both derived from Egyptian. F. Ll. Griffith established the sound values in 1909–1911, using bilingual royal names. So Meroitic texts can be pronounced, and proper names, titles and the formulae of funerary texts are understood. Rilly and de Voogt give a short list of words of known meaning, among them qore 'king', kdke (kandake) 'queen', mk 'god', ato 'water' and at 'bread'.\n\n" +
      "WHAT CANNOT. Continuous texts, such as the 45-line Hamadab Stela of the late 1st century BCE, cannot be translated beyond their names and a few words. Rilly classifies Meroitic in the Eastern Sudanic branch of Nilo-Saharan, related to the Nubian languages; others (Rowan, Lipiński) have argued for Afroasiatic. The last known Meroitic inscription is of the 5th century CE.\n\n" +
      "THE SERPENT QUESTION. No Meroitic word for 'snake' or 'serpent' was found in the sources checked here. The god's name Apedemak is read from Meroitic and Egyptian spellings; its etymology is uncertain. So there is NO Meroitic serpent term to set beside Hebrew nāḥāš or Gbe *dã, and any comparison of Meroitic words with Gbe or Hebrew words would rest on nothing.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes how much of Kushite religion is visible only through Egyptian-language inscriptions and images. It does not establish any Meroitic religious vocabulary relevant to serpents, and that gap is itself the main finding for the Words compared lane.",
    category: "culture",
    subcategory: SUBCATEGORY,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: names and words", "theme: manuscripts and their dates", "place: napata and meroe"], "meroitic", "decipherment"),
    people: ["F. Ll. Griffith", "Claude Rilly", "Alex de Voogt", "Kirsty Rowan"],
    civilisations: ["Meroitic Kush"],
    locationName: "Meroë and the Middle Nile, Sudan",
    lat: 16.9383,
    lng: 33.7489,
    claims: [
      {
        sourceKey: "rilly_devoogt_2012_meroitic_language",
        citations: [
          { sourceKey: "rilly_2016_uee_meroitic", relation: "supports", note: "Rilly's encyclopaedia overview of the same material." },
          { sourceKey: "rilly_2007_langue_royaume_meroe", relation: "context", note: "Rilly's fuller French monograph." },
        ],
        startYear: bce(300),
        endYear: 400,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The use of Meroitic writing",
        originalDateText: "used between circa 300 BC and 400 AD in the kingdom of Meroe",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. The span of dated Meroitic inscriptions, as the publisher's description summarises it; a 5th-century inscription of the Blemmye king Kharamadoye extends it slightly.",
      },
      {
        sourceKey: "griffith_1911_karanog_meroitic_inscriptions",
        citations: [
          { sourceKey: "wikipedia_kush_navigation", relation: "context", note: "Gives 1909 for the decipherment of the alphabet." },
        ],
        startYear: 1909,
        endYear: 1911,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "Griffith's decipherment of the Meroitic sound values",
        originalDateText: "the alphabet was deciphered in 1909",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Griffith's publications of 1909–1911. They mark when Meroitic became pronounceable, not when it became translatable, which it still is not.",
      },
    ],
    media: [pHamadab, pMeroiticMunich, pMeroiticChart],
  },

  // =========================================================================
  // THE END OF MEROË
  // =========================================================================
  {
    slug: "end-of-meroe-fourth-century",
    title: "The end of Meroë in the 4th century CE",
    summary:
      "The Meroitic kingdom ended in the 4th century CE amid internal decline, the arrival of Nubian-speaking Noba and an Aksumite campaign under King Ezana recorded in Ge'ez inscriptions, one fragment of which was found at Meroë itself.",
    description:
      "WHAT IS DOCUMENTED. Royal burials in the pyramid fields at Meroë stop in the 4th century CE. Ezana of Aksum (reigned c. 320s–c. 360 CE) recorded a campaign to the Nile against the Noba and Kasu, and a stela fragment in Ge'ez found at Meroë is usually read as evidence of an Aksumite presence there. After Meroë come the post-Meroitic cultures (Ballana, Tanqasi) and later the Christian kingdoms of Nobadia, Makuria and Alodia.\n\n" +
      "HOW HISTORIANS READ IT. L. P. Kirwan's 'The Decline and Fall of Meroe' (1960) set the terms of the debate: an Aksumite conquest, or a kingdom already broken by economic decline and Noba settlement, which Ezana's army found. Some read the Meroë stela as Aksumite military help to Meroë against the Noba. No source settles which happened first.\n\n" +
      "THE SERPENT. Apedemak, the Kushite uraeus and Amun of Napata have no documented continuation after Meroë. The Christian Nubian kingdoms abandoned them. The serpent iconography of Kush therefore stops on the Nile in the 4th century CE, about 1,300 years before the first European account of Hueda's python (Bosman, 1704).\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes the end of the Meroitic royal cults in the 4th century CE. It does not establish any dispersal of Meroitic people or cults westward at the kingdom's end. That idea has been proposed (see the next record), but no evidence for it was found.",
    category: "history",
    subcategory: SUBCATEGORY,
    eventType: "historical",
    tags: serpentTags(LANE, ["place: napata and meroe", "theme: kingship", "place: ethiopia"], "fall of meroe", "ezana"),
    people: ["Ezana of Aksum", "L. P. Kirwan"],
    civilisations: ["Meroitic Kush", "Kingdom of Aksum", "Noba"],
    locationName: "Meroë (Begarawiya), Sudan",
    lat: 16.9383,
    lng: 33.7489,
    claims: [
      {
        sourceKey: "munro_hay_1991_aksum",
        citations: [
          { sourceKey: "kirwan_1960_decline_and_fall_of_meroe", relation: "context", note: "Frames the debate between Aksumite conquest and internal decline." },
          { sourceKey: "wikipedia_kush_navigation", relation: "context", note: "Used to locate the Ezana inscriptions and the Meroë stela fragment." },
        ],
        startYear: 330,
        endYear: 360,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Ezana's campaign to the Nile and the Aksumite inscription at Meroë",
        originalDateText: "A pair of inscriptions on a stela in Ge'ez found at Meroë is thought of as evidence of a campaign in the fourth century",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Dated by Ezana's reign. The inscriptions date the campaign, not the end of Meroë, which may have come before or after it.",
      },
      {
        sourceKey: "kirwan_1960_decline_and_fall_of_meroe",
        startYear: 300,
        endYear: 350,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Decline of the Meroitic state before the Aksumite campaign",
        originalDateText: "economic and political decline in Meroë around 300",
        datingMethod: "archaeological",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The internal-decline reading, set against the conquest reading. NEEDS SOURCE VERIFICATION against Kirwan's article, not opened.",
      },
    ],
    media: [pMeroeSatellite, pEzanaStone],
  },

  // =========================================================================
  // WESTWARD: WHAT IS NOT KNOWN
  // =========================================================================
  {
    slug: "kush-westward-contact-what-is-not-known",
    title: "Did Kush reach West Africa? The westward-contact idea and the missing evidence",
    summary:
      "From Sayce's 'Birmingham of ancient Africa' (1912) to Seligman's divine kingship (1934) and Meyerowitz's Akan–Egypt link (1960), writers proposed that Meroë passed iron, kingship or religion west. No archaeological, textual or linguistic evidence of Kushite religious contact with the Gbe-speaking coast has been found.",
    description:
      "THE IDEA. Several twentieth-century writers proposed that Meroë was the gateway through which Nile Valley civilisation reached sub-Saharan and West Africa. In 1912 A. H. Sayce, reporting on the Meroë slag heaps, wrote that 'Meroë, in fact, must have been the Birmingham of ancient Africa'. C. G. Seligman (1934) explained African divine kingship by migrations from the Nile, the 'Hamitic' model. Eva Meyerowitz (1960) compared Akan kingship in Ghana with Egypt's and connected them through migration. Shinnie (1967) allowed that iron 'may well have diffused south and west from Meroe'. These are the intellectual ancestors of Route B in this track (Egypt to Kush to Sahel to West Africa).\n\n" +
      "WHAT THE EVIDENCE SHOWS. Stuiver and van der Merwe (1968) found Meroitic iron younger than iron further west and south. Trigger (1969) found no eastern cultural traits or technological similarities in West Africa that would mark transmission from Meroë and called much of the story a myth. Humphris and Rehren (2014) say even Meroë's own iron industry is still 'notably superficial[ly]' known. No Meroitic inscription, Kushite object or Kushite-style temple has been found west of the Nile Valley in Kordofan, Darfur, Lake Chad or the Niger basin in any source checked here. No text, Kushite or other, mentions Kushite contact with the Bight of Benin.\n\n" +
      "WHAT IS NOT KNOWN. The archaeology of Kordofan, Darfur and the central Sahel in the 1st millennia BCE and CE is thin, so absence of evidence is partly absence of fieldwork. The Saharan trade of the Garamantes (existing records) shows the desert could be crossed, but it ran north–south, not east from the Nile.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that the westward idea has named proponents and a history rooted partly in colonial-era diffusionism. It does not establish any contact between Kush and the Gbe coast. The Kushite serpent is a cobra worn as regalia; the Hueda serpent is a living python. Similar ideas about divine kings are widespread and do not show transmission.",
    category: "history",
    subcategory: SUBCATEGORY,
    eventType: "hypothesised",
    tags: serpentTags(LANE, ["theme: migration traditions", "theme: trade routes", "place: sahara and niger bend", "place: napata and meroe"], "diffusionism", "absence of evidence", "route b"),
    people: ["A. H. Sayce", "C. G. Seligman", "Eva L. R. Meyerowitz", "P. L. Shinnie", "Bruce G. Trigger", "Jane Humphris", "Thilo Rehren"],
    civilisations: ["Meroitic Kush", "Akan", "Gbe-speaking peoples"],
    locationName: "From the Middle Nile westward across the Sahel (no specific place)",
    argumentsFor:
      "Meroë was a large iron-producing state with long-distance trade; Sahelian routes linked the Nile to Lake Chad in later centuries; divine kingship, royal mothers and sacred animals occur in both Nile and West African kingdoms; named scholars (Sayce, Seligman, Meyerowitz, Shinnie) proposed diffusion westward.",
    argumentsAgainst:
      "Meroitic iron is not older than West African iron; no Meroitic object, inscription or temple has been found west of the Nile Valley; Trigger found no eastern traits in West Africa marking transmission; no text records contact; the serpent forms differ in kind (cobra regalia vs living python); the diffusion model grew out of the discredited Hamitic hypothesis.",
    genealogies: [
      {
        key: "meroe-transmitted-west",
        claim: "Meroë passed iron, divine kingship and religion westward into West Africa",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "Searched and not found: no archaeological, textual or linguistic evidence linking Kush with West Africa. The claim's chain runs through early-twentieth-century diffusionist scholarship and has been critiqued since 1969.",
        whatWouldChangeThis:
          "A securely dated Meroitic or Napatan object, inscription or building in the central or western Sahel; a stratified sequence showing Meroitic iron technology older than and ancestral to West African iron; or a Meroitic loanword in a West African language with regular correspondences.",
        links: [
          {
            stage: "early_scholarship",
            who: "A. H. Sayce, report on the Meroë excavations",
            year: 1912,
            sourceKey: "humphris_rehren_2014_iron_kush",
            reference: "Sayce 1912, p. 55, as quoted by Humphris & Rehren 2014",
            says: "Meroë, in fact, must have been the Birmingham of ancient Africa",
            adds: "The image of Meroë as Africa's iron centre supplying the continent.",
            citationStatus: "verified",
          },
          {
            stage: "early_scholarship",
            who: "C. G. Seligman, Egypt and Negro Africa",
            year: 1934,
            sourceKey: "seligman_1934_egypt_and_negro_africa",
            saysAbsentReason: "The book was not opened; its model is reported from an encyclopaedia summary.",
            adds: "Divine kingship across Africa explained by migration from the Nile Valley.",
            citationStatus: "unverified",
          },
          {
            stage: "alternative_interpretation",
            who: "Eva L. R. Meyerowitz, The Divine Kingship in Ghana and Ancient Egypt",
            year: 1960,
            sourceKey: "meyerowitz_1960_divine_kingship_ghana_egypt",
            saysAbsentReason: "The book was not opened; its argument is reported from catalogue and encyclopaedia summaries.",
            adds: "A specific West African (Akan) kingship tied to Egypt through hypothetical migrations.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Bruce G. Trigger, 'The Myth of Meroe and the African Iron Age'",
            year: 1969,
            sourceKey: "trigger_1969_myth_of_meroe",
            saysAbsentReason: "The article was not opened; its findings are reported through Humphris & Rehren 2014.",
            adds: "The critique: no eastern cultural traits or technological similarities in West Africa.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "humphris_rehren_2014_iron_kush",
        startYear: 1912,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Sayce's 'Birmingham of ancient Africa' sentence",
        originalDateText: "Meroë, in fact, must have been the Birmingham of ancient Africa",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The date of the claim's best-known formulation, quoted by Humphris & Rehren. It dates the idea, not any contact.",
      },
      {
        sourceKey: "trigger_1969_myth_of_meroe",
        citations: [
          { sourceKey: "humphris_rehren_2014_iron_kush", relation: "supports", note: "Summarises Trigger's findings and Stuiver and van der Merwe's dates." },
        ],
        startYear: 1969,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Trigger's critique of Meroë as the source of West African iron and culture",
        originalDateText: "The Myth of Meroe and the African Iron Age (1969)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: modern interpretation. The publication date of the main critique.",
      },
      {
        sourceKey: "meyerowitz_1960_divine_kingship_ghana_egypt",
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "Any Kushite contact with West Africa",
        originalDateText: "Proposed Kushite contact with West Africa, undated by its proponents",
        datingMethod: "claimant_inference",
        chronology: "hypothesis",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The proponents give no date supported by evidence, so none is given here.",
      },
    ],
    media: [pNubiaMap, pMeroeSatellite],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const links: SeedEventLink[] = [
  // ---- inside the lane ---------------------------------------------------------
  { from: ANCHOR, to: "kerma-religion-and-the-missing-serpent", relation: "part_of", note: "Kerma is the indigenous kingdom before Egyptian influence, and the lane's first absence." },
  { from: ANCHOR, to: "amun-of-napata-in-the-pure-mountain", relation: "part_of", note: "Egyptian religion arrives in Nubia through Amun of Napata." },
  { from: ANCHOR, to: "gebel-barkal-pinnacle-as-uraeus", relation: "part_of", note: "The lane's candidate serpent-associated sacred landscape, as Kendall reads it." },
  { from: ANCHOR, to: "kushite-double-uraeus", relation: "part_of", note: "The double uraeus is the distinctively Kushite form of the royal cobra." },
  { from: ANCHOR, to: "doukki-gel-cache-of-kushite-kings", relation: "part_of", note: "The statues show the Kushite royal costume in Kush itself." },
  { from: ANCHOR, to: "anlamani-aspelta-enthronement-journey", relation: "part_of", note: "Kushite coronation by oracle, the ceremony beside which serpents appear as regalia." },
  { from: ANCHOR, to: "kushite-queen-mothers-and-the-kandake", relation: "part_of", note: "Royal women, marked by a single uraeus, legitimated Kushite kings." },
  { from: ANCHOR, to: "musawwarat-lion-temple-of-arnekhamani", relation: "part_of", note: "The earliest dated temple of the Kushite god Apedemak." },
  { from: ANCHOR, to: "naqa-lion-temple-serpent-bodied-apedemak", relation: "part_of", note: "The one serpent-bodied form of a Kushite god found in this lane." },
  { from: ANCHOR, to: "meroitic-script-what-can-be-read", relation: "part_of", note: "Explains why Kushite religion is read mainly through Egyptian-language sources." },
  { from: ANCHOR, to: "end-of-meroe-fourth-century", relation: "part_of", note: "Where the Kushite serpent iconography stops." },
  { from: ANCHOR, to: "kush-westward-contact-what-is-not-known", relation: "part_of", note: "The lane's answer to the westward question: no evidence of contact." },
  { from: "kerma-religion-and-the-missing-serpent", to: "amun-of-napata-in-the-pure-mountain", relation: "precedes", note: "Egyptian conquest ended Kerma and brought Amun to Napata." },
  { from: "kerma-religion-and-the-missing-serpent", to: "doukki-gel-cache-of-kushite-kings", relation: "related", note: "The Napatan cache was buried beside the old Kerma capital." },
  { from: "amun-of-napata-in-the-pure-mountain", to: "gebel-barkal-pinnacle-as-uraeus", relation: "associated", note: "The pinnacle stands on Amun's 'Pure Mountain'; Kendall ties the two readings together." },
  { from: "amun-of-napata-in-the-pure-mountain", to: "anlamani-aspelta-enthronement-journey", relation: "associated", note: "Amun of Napata is the god whose oracle chose Aspelta." },
  { from: "gebel-barkal-pinnacle-as-uraeus", to: "kushite-double-uraeus", relation: "related", note: "Both make the uraeus a sign of Kushite kingship; Taharqa invested in both." },
  { from: "kushite-double-uraeus", to: "doukki-gel-cache-of-kushite-kings", relation: "evidence_for", note: "The cache statues show the Kushite royal crown in three dimensions." },
  { from: "kushite-double-uraeus", to: "kushite-queen-mothers-and-the-kandake", relation: "related", note: "King with two uraei, queen mother with one, in the same lunettes." },
  { from: "anlamani-aspelta-enthronement-journey", to: "kushite-queen-mothers-and-the-kandake", relation: "associated", note: "Nasalsa appears in both Kawa VIII and the Election Stela." },
  { from: "musawwarat-lion-temple-of-arnekhamani", to: "naqa-lion-temple-serpent-bodied-apedemak", relation: "precedes", note: "Musawwarat's Lion Temple is the model for Naqa's, about two centuries earlier." },
  { from: "naqa-lion-temple-serpent-bodied-apedemak", to: "kushite-queen-mothers-and-the-kandake", relation: "related", note: "Amanitore, builder of the Naqa temple, is a ruling kandake." },
  { from: "meroitic-script-what-can-be-read", to: "naqa-lion-temple-serpent-bodied-apedemak", relation: "relevant", note: "Apedemak's name is among the few readable Meroitic religious words." },
  { from: "end-of-meroe-fourth-century", to: "kush-westward-contact-what-is-not-known", relation: "relevant", note: "The kingdom's end is sometimes imagined as a westward dispersal; no evidence supports it." },

  // ---- to other lanes' anchors -------------------------------------------------
  { from: ANCHOR, to: SERPENT_LANE_ANCHORS.egypt, relation: "related", note: "The Kushite uraeus is borrowed from the Egyptian royal cobra documented in the Egypt lane." },
  { from: "kushite-double-uraeus", to: SERPENT_LANE_ANCHORS.egypt, relation: "responds_to", note: "The double uraeus adapts the Egyptian uraeus and was erased by Egypt as Kushite." },
  { from: "amun-of-napata-in-the-pure-mountain", to: SERPENT_LANE_ANCHORS.egypt, relation: "related", note: "Amun of Napata is an Egyptian god installed in Nubia by New Kingdom kings." },
  { from: ANCHOR, to: SERPENT_LANE_ANCHORS.gbe, relation: "relevant", note: "The Gbe python traditions are the West African end of the comparison this lane serves." },
  { from: "kush-westward-contact-what-is-not-known", to: SERPENT_LANE_ANCHORS.routes, relation: "evidence_for", note: "Supplies the evidence and the gaps for Route B, Egypt to Kush to the Sahel." },
  { from: "kush-westward-contact-what-is-not-known", to: SERPENT_LANE_ANCHORS.assessment, relation: "evidence_for", note: "Bears on the hypothesis of Kushite influence farther west in the conclusion." },
  { from: "gebel-barkal-pinnacle-as-uraeus", to: SERPENT_LANE_ANCHORS.rituals, relation: "relevant", note: "The Kushite case for the sacred-landscape comparison with Savi's ditches." },
  { from: "anlamani-aspelta-enthronement-journey", to: SERPENT_LANE_ANCHORS.rituals, relation: "relevant", note: "The Kushite coronation sequence for the ritual comparisons." },
  { from: "meroitic-script-what-can-be-read", to: SERPENT_LANE_ANCHORS.words, relation: "relevant", note: "No Meroitic serpent word is known, so Meroitic cannot enter the word comparison." },
  { from: ANCHOR, to: SERPENT_LANE_ANCHORS.africanJewish, relation: "related", note: "Eldad ha-Dani's 'Dan in Cush' uses the biblical name for this region; the lane records what Kush actually was." },
  { from: "naqa-lion-temple-serpent-bodied-apedemak", to: SERPENT_LANE_ANCHORS.rituals, relation: "relevant", note: "Apedemak is one of the gods set side by side in the gods comparison." },
  { from: ANCHOR, to: SERPENT_LANE_ANCHORS.assessment, relation: "evidence_for", note: "The lane's findings feed the hypotheses on Egyptian influence on Kush and Kushite influence west." },

  // ---- to existing records -----------------------------------------------------
  { from: "kushite-double-uraeus", to: "uraeus-kundalini-comparison", relation: "related", note: "That record treats the Egyptian uraeus; this one its Kushite doubling." },
  { from: "kushite-double-uraeus", to: "serpent-is-not-one-symbol", relation: "relevant", note: "The Kushite cobra is a royal sign, not a general serpent symbol, the control that record sets." },
  { from: "amun-of-napata-in-the-pure-mountain", to: "smaller-dakhleh-stela-piye", relation: "related", note: "A stela of Piye's reign from Dakhleh, another Egyptian temple context of the Kushite king." },
  { from: "anlamani-aspelta-enthronement-journey", to: "siwa-oracle-of-ammon", relation: "related", note: "Siwa is the other great oracle of Amun outside the Nile; Aspelta's election is Napata's." },
  { from: "anlamani-aspelta-enthronement-journey", to: "hueda-coronation-and-serpent-processions-1725", relation: "relevant", note: "The Hueda coronation and its procession to the serpent's house, for comparison of sequences, not kinship." },
  { from: "kushite-queen-mothers-and-the-kandake", to: "hueda-coronation-and-serpent-processions-1725", relation: "relevant", note: "Both feature a king's mother in the ceremony; nothing connects them historically." },
  { from: "kush-westward-contact-what-is-not-known", to: "egyptian-origin-theory-for-vodun-and-orisha", relation: "related", note: "The Egypt-to-Vodun derivation theory needs a route; this record shows none through Kush." },
  { from: "kush-westward-contact-what-is-not-known", to: "hueda-serpents-egypt-and-israel-speculation", relation: "related", note: "An eighteenth-century version of the same Nile-to-Hueda speculation." },
  { from: "kush-westward-contact-what-is-not-known", to: "garamantes-and-sub-saharan-africa", relation: "relevant", note: "Saharan crossings documented for the Garamantes, north to south, not from the Nile westward." },
  { from: "kush-westward-contact-what-is-not-known", to: "trans-saharan-exchange-garamantes", relation: "relevant", note: "The documented ancient trans-Saharan exchange, for contrast with the undocumented Kushite route." },
  { from: "naqa-lion-temple-serpent-bodied-apedemak", to: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", relation: "relevant", note: "A serpent-bodied god of Kush to set beside the cosmic serpents compared there, without equating them." },
];

export const KUSH: SerpentSection = { sources, events, links };
