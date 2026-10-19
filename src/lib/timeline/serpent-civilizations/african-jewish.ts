// LANE: Dan in Africa: Jewish communities and Danite traditions (SERPENT_LANES.africanJewish).
//
// WHAT THIS SECTION IS FOR. Section B of the request: can a line be drawn
// from the biblical tribe of Dan, through Africa, to the Dan and Dangbé
// serpent traditions of the Gbe-speaking coast? This lane separates two kinds
// of thing that are easily run together. On one side, JEWISH COMMUNITIES IN
// AFRICA that are documented by contemporary writing: the Judean garrison at
// Elephantine in the fifth century BCE, the Jews of Egypt, the Beta Israel of
// Ethiopia, the merchants of the Cairo Genizah, the Jews of the Tuat oases
// expelled in the 1490s, the Moroccan traders admitted to Timbuktu in 1858.
// On the other, DANITE IDENTITY TRADITIONS: Eldad ha-Dani's ninth-century
// account of Dan 'in the land of Cush', Radbaz's sixteenth-century
// identification of the Ethiopian Jews with Dan, and its twentieth-century
// legal consequence. Neither line, on the evidence found here, reaches Bénin.
//
// HOW IT WAS RESEARCHED. Read in this session: Cowley's 1923 edition of the
// Aramaic papyri (archive.org OCR), the Hebrew text of the Kairouan letter and
// Tzemah Gaon's reply in Eisenstein's Otzar Midrashim (1915, public domain,
// via the Sefaria API), Pory's 1600 translation of Leo Africanus in Brown's
// Hakluyt Society edition (1896), Thackeray's 1917 translation of the Letter
// of Aristeas, Macaulay's Herodotus, the WLC Hebrew of Zephaniah 3:10 and
// Isaiah 11:11 (Open Scriptures), and the Commons file pages of every picture.
// Modern scholarship (Kaplan, Quirin, Shelemay, Nobili and Mathee, Hunwick,
// van der Toorn, Perry) was identified through publisher and catalogue
// records and reviews; it is paraphrased, never quoted at length, and claims
// resting on details not seen here say NEEDS SOURCE VERIFICATION. John Reeves's
// online Eldad texts (UNC Charlotte) could not be reached from this machine.

import type { SeedEvent, SeedEventLink, SeedSource } from "../seed-types";
import { SERPENT_LANE_ANCHORS, bce, commonsPicture, serpentTags, type SerpentSection } from "./shared";

const LANE = "africanJewish" as const;
const SUB = "Dan in Africa: Jewish communities and Danite traditions";
const ANCHOR = SERPENT_LANE_ANCHORS.africanJewish;
const A = SERPENT_LANE_ANCHORS;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // ---- Canonical keys (shared with other sections; strings as the lead set them)
  {
    key: "porten_yardeni_tad",
    title: "Textbook of Aramaic Documents from Ancient Egypt",
    author: "Bezalel Porten and Ada Yardeni",
    publisher: "Hebrew University, Department of the History of the Jewish People, Jerusalem (4 vols)",
    reference: "Vol. 1, Letters (1986): A4.1 (the 'Passover letter'), A4.7 and A4.8 (the two drafts of the petition to Bagohi), A4.9 (the memorandum of Bagohi and Delaiah)",
    sourceType: "academic_book",
    publishedYear: 1986,
    publishedDisplay: "1986–1999",
    notes:
      "THE STANDARD EDITION of the Elephantine Aramaic papyri, cited for the TAD numbering used throughout this lane and for the modern dating of the petition to 25 November 407 BCE. Not opened in this session: the numbering and dates are confirmed by the Berlin museum's own catalogue records on Commons; NEEDS SOURCE VERIFICATION for any reading that differs from Cowley's.",
  },
  {
    key: "kjv_bible",
    title: "The Holy Bible, King James Version",
    author: "King James translators (1611; standard 1769 Oxford text)",
    reference: "Isaiah 11:11; Zephaniah 3:10",
    url: "https://www.kingjamesbibleonline.org/",
    sourceType: "religious_text",
    publishedYear: 1611,
    publishedDisplay: "1611; standard text 1769",
    notes:
      "Cited for the public-domain English of the prophetic verses that speak of Israelites 'from Cush' and 'beyond the rivers of Ethiopia', the verses medieval writers (including the Kairouan letter about Eldad) echoed. A seventeenth-century translation: 'Ethiopia' renders Hebrew Kush.",
  },
  {
    key: "wlc_hebrew_bible",
    title: "Westminster Leningrad Codex",
    author: "J. Alan Groves Center for Advanced Biblical Research (digital text of the Leningrad Codex)",
    reference: "Isaiah 11:11; Zephaniah 3:10 (read from the Open Scriptures Hebrew Bible XML in this session)",
    url: "https://github.com/openscriptures/morphhb",
    sourceType: "religious_text",
    publishedYear: 1008,
    publishedDisplay: "codex 1008/9 CE; digital text 1990s–",
    notes:
      "Cited for the Hebrew text of Isaiah 11:11 and Zephaniah 3:10 (me-ʿever le-naharei Kush, 'from beyond the rivers of Cush'). The codex is of 1008/9 CE; the prophetic books are older, and the date of the verses' composition is a separate, debated question.",
  },
  {
    key: "kaplan_1992_beta_israel",
    title: "The Beta Israel (Falasha) in Ethiopia: From Earliest Times to the Twentieth Century",
    author: "Steven Kaplan",
    publisher: "New York University Press, New York",
    sourceType: "academic_book",
    publishedYear: 1992,
    publishedDisplay: "1992",
    reference: "Whole book; the argument for an ethnogenesis in Ethiopia between the fourteenth and sixteenth centuries",
    notes:
      "Cited for the dominant scholarly view that the Beta Israel emerged as a distinct group within Ethiopia between the fourteenth and sixteenth centuries, from people the Christian state and church called 'ayhud', rather than descending from a lost tribe. VIEWPOINT: historian of Ethiopia; the view is contested by community historians and some geneticists. Not opened in this session; summarised from reviews.",
  },
  {
    key: "quirin_1992_evolution_of_ethiopian_jews",
    title: "The Evolution of the Ethiopian Jews: A History of the Beta Israel (Falasha) to 1920",
    author: "James Quirin",
    publisher: "University of Pennsylvania Press, Philadelphia",
    sourceType: "academic_book",
    publishedYear: 1992,
    publishedDisplay: "1992",
    reference: "Whole book; the caste-like formation of the Beta Israel and the weight given to an older Jewish element",
    notes:
      "Cited for a historian who agrees with Kaplan on a medieval Ethiopian formation but gives more weight than Kaplan to an older Jewish or Judaising element the Beta Israel preserved. Not opened in this session; summarised from reviews. NEEDS SOURCE VERIFICATION for page-level claims.",
  },
  {
    key: "nobili_mathee_2015_tarikh_al_fattash",
    title: "Towards a New Study of the So-Called Tārīkh al-fattāsh",
    author: "Mauro Nobili and Mohamed Shahid Mathee",
    publisher: "History in Africa 42",
    reference: "History in Africa 42 (2015), pp. 37–73",
    url: "https://www.cambridge.org/core/journals/history-in-africa/article/abs/towards-a-new-study-of-the-socalled-tarikh-alfattash/F9AC89F940A7085882CCCA63A63D11A8",
    sourceType: "academic_paper",
    publishedYear: 2015,
    publishedDisplay: "2015",
    notes:
      "Cited for the argument that the 1913 Houdas–Delafosse edition merges two texts: a seventeenth-century Timbuktu chronicle (the Tārīkh ibn al-Mukhtār) and a nineteenth-century work, preserved in 'Manuscript C', which is the real 'Tārīkh al-fattāsh', produced in the Caliphate of Ḥamdallāhi. Read in abstract and in summaries this session; the full article was not opened.",
  },
  {
    key: "adler_1930_jewish_travellers",
    title: "Jewish Travellers",
    author: "Elkan Nathan Adler (ed.)",
    publisher: "George Routledge and Sons, London (Broadway Travellers series); reissued by Routledge, 2014",
    reference: "Chapter 'Eldad the Danite (ca. 880)'",
    url: "https://www.taylorfrancis.com/chapters/mono/10.4324/9780203005712-3/eldad-danite-ca-880-elkan-nathan-adler",
    sourceType: "book",
    publishedYear: 1930,
    publishedDisplay: "1930; repr. 1987, 2014",
    notes:
      "Cited as the standard English translation of Eldad's narrative and the Kairouan correspondence. The translation is not reproduced here (its copyright status is not clear); this lane's English of the Hebrew is its own working translation from the 1915 Otzar Midrashim text.",
  },

  // ---- Elephantine and Egypt ---------------------------------------------------
  {
    key: "cowley_1923_aramaic_papyri",
    title: "Aramaic Papyri of the Fifth Century B.C.",
    author: "A. E. Cowley",
    publisher: "Clarendon Press, Oxford",
    reference: "No. 21 (the order to keep the Feast of Unleavened Bread, 419 BCE), pp. 60–65; no. 30 (the petition to Bigvai/Bagohi), pp. 108–119",
    url: "https://archive.org/details/aramaicpapyrioff00ahikuoft",
    sourceType: "primary",
    publishedYear: 1923,
    publishedDisplay: "1923",
    notes:
      "Cited for the Aramaic texts and public-domain English translations of the petition about the destroyed temple of Ya'u and the letter of Hananiah about the festival, read in the archive.org scan in this session. Cowley's own notes are cited too: he marks 'Passover' in no. 21 as a restoration and dates no. 30 to 408 BCE, a year earlier than the modern reckoning.",
  },
  {
    key: "smb_berlin_p13495",
    title: "Papyrus Berlin P. 13495: petition of the Jewish community of Elephantine to the governor of Judah",
    author: "Staatliche Museen zu Berlin, Ägyptisches Museum und Papyrussammlung",
    reference: "Inv. P. 13495 (with P. 13497, the reply-memorandum of Bagohi)",
    url: "https://id.smb.museum/object/823546",
    sourceType: "museum",
    publishedDisplay: "museum catalogue record",
    notes:
      "Cited for the physical object and its holding institution: the Berlin catalogue (as transcribed on the Commons file page read in this session) identifies P. 13495 as the community's petition for the rebuilding of the temple of YHW and dates it 25 November 407 BCE; P. 13497 as Bagohi's memorandum in reply.",
  },
  {
    key: "kraeling_1953_brooklyn_aramaic_papyri",
    title: "The Brooklyn Museum Aramaic Papyri: New Documents of the Fifth Century B.C. from the Jewish Colony at Elephantine",
    author: "Emil G. Kraeling",
    publisher: "Yale University Press for the Brooklyn Museum, New Haven",
    url: "https://archive.org/details/brooklynmuseumar0000broo",
    sourceType: "academic_book",
    publishedYear: 1953,
    publishedDisplay: "1953",
    notes:
      "Cited for the Brooklyn Museum's family archives from Elephantine (the Ananiah and Tamet papers), which show the Judean community's everyday legal life down to about 400 BCE and name the temple of YHW in property descriptions. Bibliographic record confirmed on archive.org; the volume was not read page by page. NEEDS SOURCE VERIFICATION for document-level details.",
  },
  {
    key: "van_der_toorn_2019_becoming_diaspora_jews",
    title: "Becoming Diaspora Jews: Behind the Story of Elephantine",
    author: "Karel van der Toorn",
    publisher: "Yale University Press, New Haven",
    url: "https://www.degruyterbrill.com/isbn/9780300249491",
    sourceType: "academic_book",
    publishedYear: 2019,
    publishedDisplay: "2019",
    notes:
      "Cited for a minority reconstruction: that the Elephantine community's ancestors were Israelites of the former northern kingdom (Samaria) who spent about a century among Aramaeans before reaching Egypt about 600 BCE, and took on a 'Judean' identity later. It leans on Papyrus Amherst 63, whose provenance and date reviewers question. Summarised from the publisher's description and a 2020 review.",
  },
  {
    key: "herodotus_macaulay_histories",
    title: "The History of Herodotus",
    author: "Herodotus, translated by G. C. Macaulay",
    publisher: "Macmillan, London (1890); Project Gutenberg e-text",
    reference: "Book 2, chapter 30",
    url: "https://www.gutenberg.org/ebooks/2707",
    sourceType: "primary",
    publishedDisplay: "written c. 430s BCE; translation 1890",
    notes:
      "Cited for the fifth-century BCE statement that garrisons were posted at Elephantine 'towards the Ethiopians' under Psammetichus and that the Persians kept outposts there in Herodotus's own time, which places the Judean garrison on the frontier with Kush. A Greek visitor's account from hearsay; read in Macaulay's public-domain translation.",
  },
  {
    key: "aristeas_thackeray_1917",
    title: "The Letter of Aristeas",
    author: "Translated by H. St. J. Thackeray",
    publisher: "SPCK, London (Translations of Early Documents)",
    reference: "§13 (p. 24 of the 1917 translation)",
    url: "https://archive.org/details/theletterofarist00unknuoft",
    sourceType: "primary",
    publishedYear: 1917,
    publishedDisplay: "Greek text c. 2nd century BCE; translation 1917",
    notes:
      "Cited for the Hellenistic Jewish claim that Jews 'had at a still earlier time been sent out as auxiliaries to fight in the army of Psammetichus against the king of the Ethiopians'. A text of the second century BCE (date debated) about events centuries earlier; read in Thackeray's translation on archive.org.",
  },

  // ---- Ethiopia and the Danite identification -----------------------------------
  {
    key: "shelemay_1986_music_ritual_falasha",
    title: "Music, Ritual, and Falasha History",
    author: "Kay Kaufman Shelemay",
    publisher: "African Studies Center, Michigan State University, East Lansing",
    sourceType: "academic_book",
    publishedYear: 1986,
    publishedDisplay: "1986; paperback 1989",
    reference: "Monograph (Michigan State University Press, 1986); cited as a whole, no page numbers given",
    notes:
      "Cited for the ethnomusicological finding that Beta Israel liturgy is closely linked to Ethiopian Christian monastic tradition, which supports a medieval Ethiopian formation of the community's religious life. Not opened in this session; summarised from reviews. NEEDS SOURCE VERIFICATION for specifics.",
  },
  {
    key: "behar_2010_genome_wide_jewish",
    title: "The genome-wide structure of the Jewish people",
    author: "Doron M. Behar et al.",
    publisher: "Nature 466",
    reference: "Nature 466 (2010), pp. 238–242",
    url: "https://doi.org/10.1038/nature09103",
    sourceType: "scientific_study",
    publishedYear: 2010,
    publishedDisplay: "2010",
    notes:
      "Cited for the genetic finding that Ethiopian Jews cluster with neighbouring populations of the Horn of Africa rather than with other Jewish diaspora groups. A genetic result about ancestry, which cannot by itself decide religious or tribal history. Quoted as summarised in the literature; the paper was not opened in this session.",
  },
  {
    key: "stern_1862_wanderings_falashas",
    title: "Wanderings among the Falashas in Abyssinia",
    author: "Henry Aaron Stern",
    publisher: "Wertheim, Macintosh and Hunt, London",
    sourceType: "primary",
    publishedYear: 1862,
    publishedDisplay: "1862",
    reference: "Wertheim, Macintosh and Hunt, London, 1862; cited as a whole, no page numbers given",
    notes:
      "Cited for a nineteenth-century missionary's eyewitness account of Beta Israel communities and for its engraved plates. VIEWPOINT: a convert from Judaism working for the London Society for Promoting Christianity amongst the Jews, whose aim was to convert the people he described. Known here through its plates on Commons.",
  },
  {
    key: "otzar_midrashim_1915_eldad",
    title: "Otzar Midrashim: Eldad ha-Dani (the Kairouan letter, Tzemah Gaon's reply and Eldad's narratives)",
    author: "Judah David Eisenstein (ed.)",
    publisher: "New York, 1915; digital text on Sefaria (public domain)",
    reference: "'Sefer Eldad ha-Dani', Story 1 (question and answer between the people of Kairouan and Rav Tzemah Gaon) and Story 2, following Epstein's edition",
    url: "https://www.sefaria.org/Otzar_Midrashim%2C_Eldad_HaDani%2C_The_Book_of_Eldad_HaDani%2C_Story_1",
    sourceType: "religious_text",
    publishedYear: 1915,
    publishedDisplay: "1915",
    notes:
      "Cited for the Hebrew text of the Kairouan community's letter about Eldad and Tzemah Gaon's reply, read in full through the Sefaria API in this session (version 'Otzar Midrashim, New York, 1915', public domain). Eisenstein reprints Epstein's text with his own bracketed notes; it is a modern printing of a medieval text known from later manuscripts.",
  },
  {
    key: "epstein_1891_eldad",
    title: "Eldad ha-Dani: seine Berichte über die zehn Stämme und deren Ritus in verschiedenen Versionen nach Handschriften und alten Drucken",
    author: "Abraham Epstein",
    publisher: "Adolf Alkalay, Pressburg",
    sourceType: "academic_book",
    publishedYear: 1891,
    publishedDisplay: "1891",
    reference: "Adolf Alkalay, Pressburg, 1891; cited as a whole, no page numbers given",
    notes:
      "Cited as the first critical edition of Eldad's narratives and halakhot in several versions from manuscripts and early prints, on which the later Hebrew texts (Otzar Midrashim, Sefaria) depend. Its existence and role confirmed from reference works in this session; not opened. NEEDS SOURCE VERIFICATION for manuscript sigla.",
  },
  {
    key: "muller_1892_eldad_recensions",
    title: "Die Recensionen und Versionen des Eldad had-Dânî",
    author: "David Heinrich Müller",
    publisher: "Denkschriften der Kaiserlichen Akademie der Wissenschaften, phil.-hist. Classe 41, Vienna",
    sourceType: "academic_paper",
    publishedYear: 1892,
    publishedDisplay: "1892",
    reference: "Denkschriften der Kaiserlichen Akademie der Wissenschaften, phil.-hist. Classe 41, Vienna, 1892; cited as a whole, no page numbers given",
    notes:
      "Cited for the classic classification of the Eldad material into recensions and versions (Hebrew, Arabic, Latin and others), showing how copyists remoulded and expanded the story. Known here from reference works; not opened in this session. NEEDS SOURCE VERIFICATION for its stemma.",
  },
  {
    key: "schloessinger_1908_ritual_eldad",
    title: "The Ritual of Eldad ha-Dani, reconstructed and edited from manuscripts and a Genizah fragment",
    author: "Max Schloessinger",
    publisher: "R. Haupt, Leipzig and New York",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/94/The_ritual_of_Eldad_ha-Dani_reconstructed_and_ed._from_manuscripts_and_a_genizah_fragment_%28IA_ritualofeldadhad00eldaiala%29.pdf",
    sourceType: "academic_book",
    publishedYear: 1908,
    publishedDisplay: "1908",
    notes:
      "Cited for the edition of Eldad's halakhot (his ritual-slaughter laws) from manuscripts and a Genizah fragment, the part of the Eldad corpus the Kairouan community asked Tzemah Gaon about. A public-domain PDF is hosted on Commons; its existence and title were confirmed in this session, the text not read in full.",
  },
  {
    key: "neubauer_1889_eldad_jqr",
    title: "Where Are the Ten Tribes? II. Eldad the Danite",
    author: "Adolf Neubauer",
    publisher: "Jewish Quarterly Review (old series) 1",
    sourceType: "academic_paper",
    publishedYear: 1889,
    publishedDisplay: "1889",
    reference: "Jewish Quarterly Review (old series) 1, 1889; cited as a whole, no page numbers given",
    notes:
      "Cited for an early English-language critical account of Eldad and his reception, written when the Eldad material was first being edited; part of a series on the lost-tribes legend. Known here from reference lists; not opened in this session. NEEDS SOURCE VERIFICATION for page numbers.",
  },
  {
    key: "perry_2019_eldads_travels",
    title: "Eldad's Travels: A Journey from the Lost Tribes to the Present",
    author: "Micha J. Perry",
    publisher: "Routledge, London (Routledge Focus)",
    url: "https://www.routledge.com/Eldads-Travels-A-Journey-from-the-Lost-Tribes-to-the-Present/Perry/p/book/9781138368354",
    sourceType: "academic_book",
    publishedYear: 2019,
    publishedDisplay: "2019",
    notes:
      "Cited as the most recent book-length study of how the Eldad story travelled and changed among Jews and Christians from the ninth century to the present, including its later use for the Ethiopian Jews. Bibliographic details confirmed from the publisher; not opened in this session.",
  },
  {
    key: "reeves_eldad_texts_online",
    title: "Eldad ha-Dani / Beney Mosheh texts (Trajectories in Near Eastern Apocalyptic)",
    author: "John C. Reeves",
    publisher: "University of North Carolina at Charlotte, online research project",
    url: "https://pages.charlotte.edu/john-reeves/research-projects/trajectories-in-near-eastern-apocalyptic/eldad-ha-dani-beney-mosheh-texts/",
    sourceType: "website",
    notes:
      "Cited because the request named it as a collection of Eldad and Beney Mosheh texts in translation. The page could NOT be reached from this machine (the host did not resolve), so nothing in this lane depends on it. NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "radbaz_responsa_ethiopian_jews",
    title: "She'elot u-Teshuvot ha-Radbaz (Responsa of R. David ibn Abi Zimra): the responsa on a captive woman and on a slave from the land of Cush",
    author: "David ben Solomon ibn Abi Zimra (Radbaz)",
    reference: "Responsa vol. 4, no. 219 (numbered 1290 in some editions), and vol. 7, no. 9",
    sourceType: "religious_text",
    publishedDisplay: "written in Egypt, 16th century; printed later",
    notes:
      "Cited for the two rulings in which the chief rabbinic authority of Egyptian Jewry treated Jews brought as captives 'from the land of Cush' as Jews 'of the tribe of Dan', comparing their non-rabbinic practice to the Karaites'. The Hebrew was not read in this session; content and numbering are taken from the Har Etzion study below and other summaries. NEEDS SOURCE VERIFICATION against a printed edition.",
  },
  {
    key: "etzion_ethiopian_jewry_halakha",
    title: "24 May, 1991: Operation Shelomo — Aliya of Ethiopian Jewry",
    author: "Yeshivat Har Etzion, Virtual Beit Midrash",
    url: "https://www.etzion.org.il/en/node/30980",
    sourceType: "website",
    notes:
      "Cited for a rabbinic study, read in this session, that sets out the Radbaz responsa, quotes Rav Ovadia Yosef's 1973 ruling in English ('the Falasha are the descendants of the tribes of Yisrael who have emigrated southwards to Cush'), and gives Rav Moshe Feinstein's 1984 doubts. VIEWPOINT: Orthodox halakhic; it is a secondary presentation of the rulings, not the rulings themselves.",
  },

  // ---- Kebra Nagast -----------------------------------------------------------------
  {
    key: "budge_1922_kebra_nagast",
    title: "The Queen of Sheba and Her Only Son Menyelek (Kebra Nagast)",
    author: "E. A. Wallis Budge (trans.)",
    publisher: "The Medici Society, London",
    url: "https://archive.org/details/queenofshebahero00kebr",
    sourceType: "primary",
    publishedYear: 1922,
    publishedDisplay: "Ge'ez text 14th century; translation 1922",
    notes:
      "Cited for the first English translation of the Kebra Nagast (public domain in the US; a PDF is on Commons), the Ethiopian royal epic of Solomon, the Queen of Sheba and their son Menelik, who brings the Ark to Aksum. Cited to show what the Solomonic tradition says, and that it is not a Danite tradition.",
  },
  {
    key: "bezold_1905_kebra_nagast",
    title: "Kebra Nagast: Die Herrlichkeit der Könige",
    author: "Carl Bezold",
    publisher: "Abhandlungen der Philosophisch-philologischen Klasse der Königlich Bayerischen Akademie der Wissenschaften 23/1, Munich",
    sourceType: "academic_book",
    publishedYear: 1905,
    publishedDisplay: "1905",
    reference: "Abhandlungen der Philosophisch-philologischen Klasse der Königlich Bayerischen Akademie der Wissenschaften 23/1, Munich, 1905; cited as a whole, no page numbers given",
    notes:
      "Cited as the first critical edition of the Ge'ez text with a German translation, and for the colophon on which the conventional dating (Yeshaq of Aksum, about 1314–1322) rests. A public-domain PDF is on Commons; not read in this session. NEEDS SOURCE VERIFICATION for colophon wording.",
  },

  // ---- North Africa, the Sahara and the Niger Bend ------------------------------------
  {
    key: "goitein_1967_mediterranean_society",
    title: "A Mediterranean Society: The Jewish Communities of the Arab World as Portrayed in the Documents of the Cairo Geniza, vol. 1: Economic Foundations",
    author: "S. D. Goitein",
    publisher: "University of California Press, Berkeley and Los Angeles",
    sourceType: "academic_book",
    publishedYear: 1967,
    publishedDisplay: "1967",
    reference: "University of California Press, Berkeley and Los Angeles, 1967; cited as a whole, no page numbers given",
    notes:
      "Cited for the foundational study of the Cairo Genizah merchants, whose letters document Jewish traders linking Egypt, Ifriqiya (Kairouan, Mahdia), Sicily, al-Andalus and the Maghreb in the tenth to thirteenth centuries. Not opened in this session; cited at volume level.",
  },
  {
    key: "goldberg_2012_geniza_merchants",
    title: "Trade and Institutions in the Medieval Mediterranean: The Geniza Merchants and their Business World",
    author: "Jessica L. Goldberg",
    publisher: "Cambridge University Press, Cambridge",
    sourceType: "academic_book",
    publishedYear: 2012,
    publishedDisplay: "2012",
    reference: "Cambridge University Press, Cambridge, 2012; cited as a whole, no page numbers given",
    notes:
      "Cited for the modern analysis of the eleventh-century Genizah merchants' networks, which were Mediterranean: the letters seldom reach south of the Maghreb oases, and the African gold they handled arrived through Muslim caravan trade. Not opened in this session; summarised from reviews. NEEDS SOURCE VERIFICATION for specific letters.",
  },
  {
    key: "catalan_atlas_1375",
    title: "Atlas de cartes marines, dit Atlas catalan (Catalan Atlas)",
    author: "Attributed to Abraham Cresques, Majorca",
    reference: "Bibliothèque nationale de France, Espagnol 30, sheet 6",
    url: "https://gallica.bnf.fr/ark:/12148/btv1b55002481n",
    sourceType: "historical_document",
    publishedYear: 1375,
    publishedDisplay: "1375",
    notes:
      "Cited for a world map made in Majorca and attributed to the Jewish cartographer Abraham Cresques, whose sheet 6 marks the Draa valley route 'through which the merchants pass who go to the land of the Blacks of Guinea', Taghaza, Timbuktu ('tenbuch') and Mansa Musa enthroned. Evidence that Mediterranean Jewish map-makers knew the trans-Saharan routes, not that Jews travelled them.",
  },
  {
    key: "hunwick_2006_jews_saharan_oasis",
    title: "Jews of a Saharan Oasis: The Elimination of the Tamantit Community",
    author: "John Hunwick",
    publisher: "Markus Wiener Publishers, Princeton",
    url: "https://markuswiener.com/?p=1762",
    sourceType: "academic_book",
    publishedYear: 2006,
    publishedDisplay: "2006",
    notes:
      "Cited for the destruction of the synagogue and the Jewish community of Tamentit in the Tuat oases at the instigation of Muhammad al-Maghili around 1490–1492, with translations of the Arabic legal writings for and against; and for al-Maghili's role in excluding Jews from the Songhay state. Publisher's description read; the book was not opened. NEEDS SOURCE VERIFICATION for exact dates.",
  },
  {
    key: "hunwick_1985_sharia_in_songhay",
    title: "Shari'a in Songhay: The Replies of al-Maghili to the Questions of Askia al-Hajj Muhammad",
    author: "John O. Hunwick",
    publisher: "Oxford University Press for the British Academy, Oxford",
    sourceType: "academic_book",
    publishedYear: 1985,
    publishedDisplay: "1985",
    reference: "Oxford University Press for the British Academy, Oxford, 1985; cited as a whole, no page numbers given",
    notes:
      "Cited for the edition and translation of al-Maghili's legal replies to Askia Muhammad of Songhay (late fifteenth century), the framework within which Jews were excluded from the Niger Bend. Not opened in this session; cited for the existence of the correspondence. NEEDS SOURCE VERIFICATION for the date of the replies.",
  },
  {
    key: "leo_africanus_pory_brown_1896",
    title: "The History and Description of Africa and of the Notable Things Therein Contained",
    author: "Leo Africanus (al-Hasan al-Wazzan), trans. John Pory (1600), ed. Robert Brown",
    publisher: "Hakluyt Society, London (3 vols)",
    reference: "Vol. 3: 'Of the region of Tegorarin', pp. 789–790; 'Of the kingdome of Tombuto', p. 825; Brown's note on Abi Serour",
    url: "https://archive.org/details/india.history.resource.88580",
    sourceType: "primary",
    publishedYear: 1896,
    publishedDisplay: "written 1526; printed in Italian 1550; English 1600; edition 1896",
    notes:
      "Cited for two statements by a traveller who knew the region in the 1510s, read in Pory's 1600 English in this session: that in Tegorarin (Gurara, next to Tuat) 'many rich Iewes' were 'expelled, and a great part of them slaine' through a Muslim preacher 'in the very same yeere when the Iewes were expelled out of Spaine'; and that the king of Timbuktu 'so deadly hateth all Iewes, that he will not admit any into his citie'.",
  },
  {
    key: "houdas_delafosse_1913_tarikh_el_fettach",
    title: "Tarikh el-fettach fi akhbâr el-bouldân oua-l-djouyoûch oua-akâbir en-nâs",
    author: "Attributed to Mahmoûd Kâti and his grandson; ed. and trans. O. Houdas and M. Delafosse",
    publisher: "Ernest Leroux, Paris",
    url: "https://archive.org/details/32882019262941-tarikhelfettach",
    sourceType: "historical_document",
    publishedYear: 1913,
    publishedDisplay: "1913",
    notes:
      "Cited as the edition that created the composite text read for a century as the 'Tarikh al-fattash', including the 'Manuscript C' material in which Jewish ('Bani Isra'il') settlements appear. The Arabic volume was located on archive.org in this session; the French translation volume was not found online, so passage-level references NEED SOURCE VERIFICATION.",
  },
  {
    key: "levtzion_1971_tarikh_ibn_al_mukhtar",
    title: "A Seventeenth-Century Chronicle by Ibn al-Mukhtār: A Critical Study of Ta'rīkh al-fattāsh",
    author: "Nehemia Levtzion",
    publisher: "Bulletin of the School of Oriental and African Studies 34",
    reference: "BSOAS 34 (1971)",
    sourceType: "academic_paper",
    publishedYear: 1971,
    publishedDisplay: "1971",
    notes:
      "Cited for the earlier critical study showing that the chronicle attributed to Mahmud Kati was largely written in the seventeenth century by Ibn al-Mukhtar, and that 'Manuscript C' contains later additions; the starting point Nobili and Mathee build on. Not opened in this session. NEEDS SOURCE VERIFICATION for page numbers.",
  },
  {
    key: "nobili_2020_sultan_caliph",
    title: "Sultan, Caliph, and the Renewer of the Faith: Aḥmad Lobbo, the Tārīkh al-fattāsh and the Making of an Islamic State in West Africa",
    author: "Mauro Nobili",
    publisher: "Cambridge University Press, Cambridge",
    sourceType: "academic_book",
    publishedYear: 2020,
    publishedDisplay: "2020",
    reference: "Cambridge University Press, Cambridge, 2020; cited as a whole, no page numbers given",
    notes:
      "Cited for the full argument that the Tārīkh al-fattāsh proper was written in the nineteenth century by the Fulani scholar Nūḥ b. al-Ṭāhir to legitimise Aḥmad Lobbo's Caliphate of Ḥamdallāhi. Read in publisher's summary and reviews; not opened in this session.",
  },
  {
    key: "encyclopaedia_judaica_zakhor",
    title: "Zakhor",
    author: "Encyclopaedia Judaica, 2nd ed.",
    publisher: "Macmillan Reference USA / Keter, Detroit and Jerusalem, 2007 (via Encyclopedia.com)",
    url: "https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/zakhor",
    sourceType: "encyclopedia",
    publishedYear: 2007,
    publishedDisplay: "2007",
    notes:
      "Cited for the account, read in this session, of Zakhor, the association founded in Timbuktu in 1993 by Ismaël Diadié Haïdara whose members claim descent from Saharan Jews of the Tuat, naming three founding families (Kehath now Kati, Cohen, Abana). It reports the families' own tradition and adds some loose claims of its own (e.g. that Leo Africanus visited 'in the first part of the 15th century', which is wrong).",
  },
  {
    key: "haidara_1999_juifs_tombouctou",
    title: "Les Juifs à Tombouctou: recueil de sources écrites relatives au commerce juif à Tombouctou au XIXe siècle",
    author: "Ismaël Diadié Haïdara",
    publisher: "Éditions Donniya, Bamako",
    sourceType: "book",
    publishedYear: 1999,
    publishedDisplay: "1999",
    reference: "Éditions Donniya, Bamako, 1999; cited as a whole, no page numbers given",
    notes:
      "Cited for a collection of nineteenth-century written sources on Jewish trade at Timbuktu by the historian who heads the Kati family library (Fondo Kati) and founded Zakhor. VIEWPOINT: the author is a member of the family whose ancestry is in question. Not opened in this session.",
  },

  // ---- The hypotheses and their critics ---------------------------------------------
  {
    key: "williams_1930_hebrewisms_west_africa",
    title: "Hebrewisms of West Africa: From Nile to Niger with the Jews",
    author: "Joseph J. Williams, S.J.",
    publisher: "George Allen & Unwin, London; Dial Press, New York",
    sourceType: "book",
    publishedYear: 1930,
    publishedDisplay: "1930; repr. Black Classic Press",
    reference: "George Allen & Unwin, London; Dial Press, New York, 1930; cited as a whole, no page numbers given",
    notes:
      "Cited as the classic statement of the diffusionist hypothesis that Hebrew customs travelled 'from Nile to Niger' and survive among the Asante and other West Africans. VIEWPOINT: a Jesuit anthropologist of Jamaica working in the diffusionist school of the 1920s. Cited for what it proposes; its method (lists of resemblances) is the one this track's safeguards warn against. Not opened in this session.",
  },
  {
    key: "windsor_1969_babylon_to_timbuktu",
    title: "From Babylon to Timbuktu: A History of the Ancient Black Races Including the Black Hebrews",
    author: "Rudolph R. Windsor",
    publisher: "Exposition Press, New York",
    sourceType: "book",
    publishedYear: 1969,
    publishedDisplay: "1969",
    reference: "Exposition Press, New York, 1969; cited as a whole, no page numbers given",
    notes:
      "Cited as an influential popular work of the Black Hebrew tradition that places Israelite migrants across Africa to the Niger and the West African coast. VIEWPOINT: community and religious history, not peer-reviewed. Cited for the claim's genealogy, not as evidence. Bibliographic details NEED SOURCE VERIFICATION.",
  },
  {
    key: "parfitt_2013_black_jews",
    title: "Black Jews in Africa and the Americas",
    author: "Tudor Parfitt",
    publisher: "Harvard University Press, Cambridge, Mass. (The Nathan I. Huggins Lectures)",
    sourceType: "academic_book",
    publishedYear: 2013,
    publishedDisplay: "2013",
    reference: "Harvard University Press, Cambridge, Mass. (The Nathan I. Huggins Lectures), 2013; cited as a whole, no page numbers given",
    notes:
      "Cited for the critical history of how European travellers, missionaries and colonial officials labelled many African peoples 'Hebrew' or 'Israelite' from the sixteenth century onward, and how African and diaspora communities later took up those labels. Not opened in this session; summarised from the publisher's description and reviews.",
  },
];

// ---------------------------------------------------------------------------
// Pictures (every file page read in this session; licences as stated there)
// ---------------------------------------------------------------------------

const PD_ART = "Public domain (PD-Art; PD-old-100)";
const BERLIN = "Staatliche Museen zu Berlin, Ägyptisches Museum und Papyrussammlung";

const pBerlin13495 = commonsPicture({
  fileName: "Papyrus Berlin 13495 (recto).jpg",
  caption:
    "The petition of Yedoniah and the priests of Elephantine to Bagohi, governor of Judah, asking leave to rebuild the temple of YHW (Porten–Yardeni TAD A4.7; Cowley no. 30), dated 25 November 407 BCE. The papyrus itself, photographed for the Berlin museum.",
  shows: "manuscript",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Sandra Steiß (photograph); unknown scribe",
  institution: BERLIN,
  accessionNumber: "P. 13495",
  objectDate: "25 November 407 BCE",
});

const pBerlin13497 = commonsPicture({
  fileName: "Papyrus Berlin 13497 (recto).jpg",
  caption:
    "The memorandum recording the reply of Bagohi, governor of Judah, (and Delaiah of Samaria) to the Jews of Elephantine about rebuilding the temple (TAD A4.9), written after 407 BCE. The papyrus itself, in the Berlin collection.",
  shows: "manuscript",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Sandra Steiß (photograph); unknown scribe",
  institution: BERLIN,
  accessionNumber: "P. 13497",
  objectDate: "after 407 BCE",
});

const pElephantineSite2016 = commonsPicture({
  fileName: "Elephantine 2016-03-24l.jpg",
  caption:
    "The excavated town site on Elephantine island at Aswan, photographed in 2016. A modern photograph of the ruined town where the Judean garrison lived in the fifth century BCE; it does not single out the remains of the temple of YHW.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Djehouty",
  objectDate: "2016 (photograph)",
});

const pElephantineIsland2025 = commonsPicture({
  fileName: "1,2 Kilometer lang und 400 Meter breit ist die Insel Elephantine. 01.jpg",
  caption:
    "Elephantine island in the Nile at the First Cataract, the southern frontier of Egypt with Kush, photographed in 2025. A modern landscape photograph that shows the setting of the frontier garrison, not any particular ancient building.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Holger Uwe Schmitt",
  objectDate: "2025 (photograph)",
});

const pBrooklynHouse402 = commonsPicture({
  fileName: "Ananiah Gives Yehoishema a House, Marh 10, 402 B.C.E, 47.218.88.jpg",
  caption:
    "'Ananiah gives Yehoishema a house', an Aramaic deed from the family archive of the temple official Ananiah at Elephantine, dated 10 March 402 BCE. The papyrus itself, Brooklyn Museum 47.218.88.",
  shows: "manuscript",
  identificationStatus: "secure",
  licence: "No known copyright restrictions (Brooklyn Museum)",
  creator: "Unknown scribe; Brooklyn Museum photograph",
  institution: "Brooklyn Museum",
  accessionNumber: "47.218.88",
  objectDate: "10 March 402 BCE",
});

const pBrooklynMarriage449 = commonsPicture({
  fileName: "Aramaic. Marriage Document, July 3, 449 B.C.E..jpg",
  caption:
    "An Aramaic marriage document from Elephantine dated 3 July 449 BCE, in the Brooklyn Museum. The papyrus itself: everyday legal evidence for the Judean community a generation before the temple's destruction.",
  shows: "manuscript",
  identificationStatus: "secure",
  licence: "No known copyright restrictions (Brooklyn Museum)",
  creator: "Unknown scribe; Brooklyn Museum photograph",
  institution: "Brooklyn Museum",
  objectDate: "3 July 449 BCE",
});

const pAmyrtaiosPapyrus = commonsPicture({
  fileName: "Amyrtaios aramaic papyrus Sachau.png",
  caption:
    "An Aramaic loan contract from Elephantine dated to year 5 of Amyrtaios (about 400 BCE), as reproduced in Eduard Sachau's 1909 publication. A printed facsimile of one of the last dated documents of the community.",
  shows: "historical_document",
  identificationStatus: "secure",
  licence: "Public domain (PD-old-auto-expired)",
  creator: "Eduard Sachau (publication)",
  objectDate: "c. 400 BCE (papyrus); 1909 (publication)",
});

const pStern1862 = commonsPicture({
  fileName: "1862BetaIsraelPreach.jpg",
  caption:
    "'The author preaching to the Falashas at Shargee', an engraved plate from Henry Aaron Stern's Wanderings among the Falashas in Abyssinia (1862). A nineteenth-century missionary's illustration made for a European readership, not a documentary photograph.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD_ART,
  creator: "Henry Aaron Stern (book); unknown engraver",
  objectDate: "1862",
});

const pBetaIsraelMap = commonsPicture({
  fileName: "Beta Israel in Ethiopia - en.svg",
  caption:
    "A modern map of the regions of northern Ethiopia (Amhara, around Gondar, and Tigray) where Beta Israel communities lived before their emigration to Israel. A modern map drawn in 2023, not a historical document.",
  shows: "map",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Master Uegly (German original); Redx360 (English)",
  objectDate: "2023",
});

const pBetaIsraelPrayerBook = commonsPicture({
  fileName: "Beta israel prayer book.jpg",
  caption:
    "A page of a Beta Israel prayer book in Ge'ez, photographed in 2010. The manuscript's own date is not given on the file page; it shows the Ge'ez liturgical language of the community, which Shelemay linked to Ethiopian monastic tradition.",
  shows: "manuscript",
  identificationStatus: "secure",
  licence: "Public domain (PD-Author)",
  creator: "Lior Golgher (photograph)",
  objectDate: "2010 (photograph)",
});

const pBetaIsrael1908Letter = commonsPicture({
  fileName: "BetaIsrael1908Letter.jpg",
  caption:
    "The letter of the sages of the Beta Israel to the Jewish communities, October 1908 (Tishri 5669), written in the period when European Jewish activists such as Jacques Faitlovitch were building contacts with them. The document itself, scanned by the uploader.",
  shows: "historical_document",
  identificationStatus: "secure",
  licence: "Public domain (PD-old)",
  creator: "Beta Israel elders",
  objectDate: "October 1908",
});

const pKahenWesternWall = commonsPicture({
  fileName: "Beta Israeli Kahen at the Western Wall.jpg",
  caption:
    "A Beta Israel kahen (priest) at the Western Wall in Jerusalem during Passover 2012. A modern photograph of the community after its recognition under Israeli law; it records religious life today, not the community's origins.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY-SA 3.0",
  creator: "Oyoyoy",
  objectDate: "12 April 2012",
});

const pKairouanAerial = commonsPicture({
  fileName: "Vue aérienne de la Grande Mosquée de Kairouan - aerial view of Kairouan's Great Mosque.jpg",
  caption:
    "An aerial view of Kairouan and its Great Mosque, taken in 1964. Contextual: Kairouan was the city whose Jewish community received Eldad ha-Dani in the ninth century and wrote to the Gaon of Sura about him. The photograph shows the city, not any Jewish site.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 2.0",
  creator: "tourism landscapes (Flickr)",
  objectDate: "1964",
});

const pBenEzraGenizah = commonsPicture({
  fileName: "Interior view of Ben Ezra synagogue showing the entrance to the Cairo genizah high in the end wall.jpg",
  caption:
    "The interior of the Ben Ezra synagogue in Fustat (Old Cairo) in 1897, showing the opening of the Genizah high in the end wall, from which the documents of the medieval Jewish merchants were recovered. A nineteenth-century photograph, probably by Augusta de Wit.",
  shows: "site",
  identificationStatus: "secure",
  licence: "Public domain (PD-US-expired; PD-old-70)",
  creator: "Probably Augusta de Wit",
  institution: "Cambridge University Library (Genizah Research Unit)",
  objectDate: "1897",
});

const pBenEzraGenizahEldad = commonsPicture({
  fileName: "Interior view of Ben Ezra synagogue showing the entrance to the Cairo genizah high in the end wall.jpg",
  caption:
    "UNVERIFIED — the Ben Ezra synagogue in Fustat in 1897, with the opening of its Genizah in the end wall. What is unverified: that the 'Genizah fragment' of Eldad's ritual edited by Schloessinger in 1908 came from this genizah, which is likely but not confirmed here. What it shows: the synagogue and the genizah opening, photographed probably by Augusta de Wit.",
  shows: "site",
  identificationStatus: "unverified",
  licence: "Public domain (PD-US-expired; PD-old-70)",
  creator: "Probably Augusta de Wit",
  institution: "Cambridge University Library (Genizah Research Unit)",
  objectDate: "1897",
});

const pCatalanSahara = commonsPicture({
  fileName: "Catalan Atlas BNF Sheet 6 Western Sahara.jpg",
  caption:
    "The western Sahara on sheet 6 of the Catalan Atlas (1375), attributed to the Majorcan Jewish cartographer Abraham Cresques: the Atlas range, the Draa valley 'through which the merchants pass who go to the land of the Blacks of Guinea', veiled camel-riders, and Mansa Musa of Mali holding a gold piece. A fourteenth-century manuscript map, the object itself.",
  shows: "map",
  identificationStatus: "secure",
  licence: PD_ART,
  creator: "Attributed to Abraham Cresques",
  institution: "Bibliothèque nationale de France, Espagnol 30",
  objectDate: "1375",
});

const pCatalanMansaMusa = commonsPicture({
  fileName: "Catalan Atlas BNF Sheet 6 Mansa Musa.jpg",
  caption:
    "Mansa Musa enthroned, with 'tenbuch' (Timbuktu), 'ciutat de mally', 'tagaza' and 'Ginyia' marked, on sheet 6 of the Catalan Atlas of 1375 attributed to Abraham Cresques. A fourteenth-century manuscript map; it shows what Majorcan map-makers knew of the Niger Bend, not who lived there.",
  shows: "map",
  identificationStatus: "secure",
  licence: PD_ART,
  creator: "Attributed to Abraham Cresques",
  institution: "Bibliothèque nationale de France, Espagnol 30",
  objectDate: "1375",
});

const pSaharaRoutesEarly = commonsPicture({
  fileName: "Trans-Saharan routes early.svg",
  caption:
    "A modern map of the trade routes of the western Sahara about 1000–1500, with the goldfields shaded, drawn in 2011 from Raymond Mauny's 1961 maps. A modern reconstruction: the routes are those documented for caravan trade, not migration routes.",
  shows: "map",
  identificationStatus: "secure",
  licence: "CC0 1.0",
  creator: "Aa77zz",
  objectDate: "2011",
});

const pSaharaRoutesBlanc = commonsPicture({
  fileName: "Great Trading Routes of the Sahara WDL100.png",
  caption:
    "'Grandes routes commerciales du Sahara', a map of Saharan caravan routes compiled by the French traveller Édouard Blanc in 1889–90, held by the Library of Congress. A nineteenth-century colonial-era map of routes as they were then known, including the Tuat oases; it is not evidence for medieval routes.",
  shows: "map",
  identificationStatus: "secure",
  licence: "Public domain (PD-Art; PD-old-100)",
  creator: "Édouard Blanc",
  institution: "Library of Congress (World Digital Library 100)",
  objectDate: "1889–1890",
});

const pNigerRoutes1400 = commonsPicture({
  fileName: "Niger saharan medieval trade routes.PNG",
  caption:
    "A simple modern map of the main trans-Saharan caravan routes about 1400, with the Ghana and Mali empires and the western route from Djenné via Timbuktu to Sijilmasa. A modern sketch map drawn in 2008, flagged on Commons as low quality; a reconstruction, not a source.",
  shows: "map",
  identificationStatus: "secure",
  licence: "Public domain (PD-self)",
  creator: "T L Miles",
  objectDate: "2008",
});

const pTamentitKsar = commonsPicture({
  fileName: "Ksar de Tamentit 02.jpg",
  caption:
    "The ksar (fortified village) of Tamentit in the Tuat oases of the Algerian Sahara, photographed in 2016. A modern photograph of the oasis town whose Jewish community was destroyed at al-Maghili's instigation around 1490–1492; it shows no identified Jewish remains.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Benzita Abdelhadi",
  objectDate: "2016 (photograph)",
});

const pTamentitOasis = commonsPicture({
  fileName: "TAMANTIT.jpg",
  caption:
    "Tamentit in the Tuat, photographed in 2017. A modern photograph of the oasis setting; contextual.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "ADE Constantine",
  objectDate: "2017 (photograph)",
});

const pBarthTimbuktu = commonsPicture({
  fileName: "Barth 1858 Timbuktu from terrace.jpg",
  caption:
    "'Timbuktu from the terrace of the traveller's house', a lithograph drawn by Martin Bernatz after Heinrich Barth's sketch, the frontispiece of Barth's Travels and Discoveries, vol. 4 (1858). A nineteenth-century lithograph of the city Barth saw in 1853–54, the same decade in which Mordechai Abi Serour obtained leave for Jews to trade there.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: "Public domain (PD-old-100-1923)",
  creator: "Martin Bernatz after Heinrich Barth; printed by M. & N. Hanhart",
  objectDate: "1858",
});

const pBarthCaravan = commonsPicture({
  fileName: "Berber Trade with Timbuktu 1300s.jpg",
  caption:
    "A caravan approaching Timbuktu in 1853, a plate from Heinrich Barth's Travels and Discoveries in North and Central Africa, vol. 4 (1858). A nineteenth-century illustration (the Commons file name's '1300s' is wrong: the picture shows 1853).",
  shows: "engraving",
  identificationStatus: "secure",
  licence: "Public domain (PD-old)",
  creator: "After Heinrich Barth",
  objectDate: "1858",
});

const pFattashFolio1 = commonsPicture({
  fileName: "Ta'rikh al-Fattash Mamma Haidara Library 34122 n01.jpg",
  caption:
    "UNVERIFIED — a folio exhibited in Paris in 2017 as a page of the 'Ta'rikh al-fattash', Mamma Haidara Memorial Library, Timbuktu, no. 34122. What is unverified: which text this manuscript carries (the seventeenth-century Ta'rikh ibn al-Mukhtar or the nineteenth-century work Nobili and Mathee identify), and its own copying date; the '1622–1653' on the file page is the traditional date of composition, not of this copy. What it shows: an Arabic manuscript page from a Timbuktu library.",
  shows: "manuscript",
  identificationStatus: "unverified",
  licence: "CC BY 4.0 (photograph); public domain (manuscript)",
  creator: "Marie-Lan Nguyen (photograph)",
  institution: "Mamma Haidara Memorial Library, Timbuktu",
  accessionNumber: "34122",
  objectDate: "undated copy",
});

const pFattashFolio2 = commonsPicture({
  fileName: "Ta'rikh al-Fattash Mamma Haidara Library 34122 n02.jpg",
  caption:
    "UNVERIFIED — a second page of the same Timbuktu manuscript (Mamma Haidara Memorial Library 34122), exhibited in 2017 as the 'Ta'rikh al-fattash'. What is unverified: which recension it carries and when it was copied. What it shows: an Arabic manuscript page in West African script.",
  shows: "manuscript",
  identificationStatus: "unverified",
  licence: "CC BY 4.0 (photograph); public domain (manuscript)",
  creator: "Marie-Lan Nguyen (photograph)",
  institution: "Mamma Haidara Memorial Library, Timbuktu",
  accessionNumber: "34122",
  objectDate: "undated copy",
});

const pSolomonSheba = commonsPicture({
  fileName: "COLLECTIE TROPENMUSEUM De ontmoeting tussen Solomon en Sheba TMnr 5956-6.jpg",
  caption:
    "The meeting of Solomon and Sheba ('Queen Azeb and King Solomon' in the Amharic inscription), an Ethiopian oil painting on linen of about 1965–1975 in the Tropenmuseum collection. A modern painting of the Kebra Nagast story, not an ancient image.",
  shows: "later_artwork",
  identificationStatus: "secure",
  licence: "CC BY-SA 3.0 (Tropenmuseum / KIT licence)",
  creator: "Unknown Ethiopian painter",
  institution: "Tropenmuseum, Amsterdam (Wereldmuseum)",
  accessionNumber: "5956-6",
  objectDate: "c. 1965–1975",
});

const pArkAxum = commonsPicture({
  fileName: "ArkCovenant-Axum.jpg",
  caption:
    "UNVERIFIED — a painted image of the Ark of the Covenant being brought to Ethiopia with Menelik I, photographed at Aksum (Flickr photograph, uploaded 2011). What is unverified: the painting's date, artist and the building it is in. What it shows: a modern-looking Ethiopian church painting of the Kebra Nagast's central episode.",
  shows: "later_artwork",
  identificationStatus: "unverified",
  licence: "CC BY 2.0",
  creator: "gill_penney (photograph), modified by Fulviusbsas",
  objectDate: "photograph before 2011",
});

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

const DNE = "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH.";

const events: SeedEvent[] = [
  // =========================================================================
  // THE ANCHOR
  // =========================================================================
  {
    slug: ANCHOR,
    title: "Danites in Africa: what can be shown, and what cannot",
    summary:
      "Jewish communities in Africa are documented from the fifth century BCE (Elephantine) to the nineteenth century (Timbuktu). A tradition that the tribe of Dan lived 'in the land of Cush' is documented from the ninth century CE. No source of any period, documentary or traditional, places Danites, or any Jewish community, on the Gbe-speaking coast of Bénin.",
    description:
      "THE QUESTION. Did the tribe of Dan, or Israelites of any tribe, reach Africa, and could they have carried a serpent tradition to the Bight of Benin, where Dan is the name of a serpent vodun? This lane answers the first half with documents, and shows that the second half has no documents at all.\n\n" +
      "WHAT IS DOCUMENTED BY CONTEMPORARY WRITING. (1) A Judean military colony at ELEPHANTINE on Egypt's frontier with Kush, with its own temple of YHW, in Aramaic papyri of about 495–400 BCE. (2) Jews elsewhere in EGYPT from the sixth century BCE onward. (3) The BETA ISRAEL of northern Ethiopia, described by outsiders from the medieval period and studied closely since the nineteenth century. (4) Jewish traders in Egypt and the MAGHREB in the Cairo Genizah, tenth to thirteenth centuries. (5) A Jewish community in the TUAT oases of the Sahara, destroyed around 1490–1492. (6) The EXCLUSION of Jews from Songhay Timbuktu reported by Leo Africanus (written 1526), and the admission of Moroccan Jewish traders in 1858.\n\n" +
      "WHAT IS A DANITE IDENTITY TRADITION. Eldad ha-Dani's ninth-century claim that Dan, Naphtali, Gad and Asher lived in 'Havilah' in the land of Cush; Tzemah Gaon's reply that Dan went to Cush before the Assyrian exile; Radbaz's sixteenth-century identification of Ethiopian Jewish captives as 'of the tribe of Dan'; and Rav Ovadia Yosef's 1973 ruling built on it. These are religious and legal traditions with their own dates of record; they are evidence of belief and law, not of a migration in the eighth century BCE.\n\n" +
      "WHAT IS NOT DOCUMENTED. No Hebrew or Aramaic inscription, Jewish burial, synagogue or Jewish community is known anywhere on the Gbe-speaking coast before the modern period. The Saharan Jewish trade documented in Tuat and the Genizah ran north–south between the Maghreb and the Niger Bend, not to the Bight of Benin. The 'Bani Isra'il' of the Tārīkh al-fattāsh come from a nineteenth-century rewriting. Every Danite tradition places Dan in the EAST, in Cush, not in West Africa.\n\n" +
      DNE + " It establishes long, real and varied Jewish histories in Africa, and an equally real Danite identity tradition attached to Ethiopia. It does NOT establish any Danite or Jewish presence in Bénin, any link between the Danite tradition and serpent worship, or any route by which either could have reached Savi or Ouidah. The resemblance between Hebrew Dan ('judge') and Gbe dan ('snake') is examined in the words lane, and is a resemblance of sound only.\n\n" +
      "THINGS TO ASK: When a community's existence is proved, what further evidence would be needed to prove where it went?",
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["figure: dan (tribe)", "theme: migration traditions", "theme: trade routes", "place: elephantine", "place: ethiopia", "place: sahara and niger bend"], "overview", "jewish africa"),
    people: ["Eldad ha-Dani", "Tzemah ben Hayyim", "David ibn Abi Zimra (Radbaz)", "Ovadia Yosef", "Muhammad al-Maghili", "Leo Africanus"],
    civilisations: ["Judeans of Elephantine", "Beta Israel", "Jews of the Maghreb", "Jews of Tuat", "Songhay"],
    locationName: "Egypt, Nubia's frontier, Ethiopia, the Maghreb and the Sahara",
    claims: [
      {
        sourceKey: "porten_yardeni_tad",
        citations: [
          { sourceKey: "cowley_1923_aramaic_papyri", relation: "supports", note: "Publishes the fifth-century papyri that open the documented record." },
          { sourceKey: "hunwick_2006_jews_saharan_oasis", relation: "supports", note: "Documents the Jewish community of Tuat at the other end of the medieval record." },
        ],
        startYear: bce(495),
        endYear: 1858,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The span of contemporary written evidence for Jewish communities in Egypt, Nubia's frontier, the Maghreb and the Sahara drawn on in this lane",
        originalDateText: "From the earliest dated Elephantine papyri, about 495 BCE, to the admission of Jews to Timbuktu in 1858",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The range is the range of documents, not of settlement: Jews were at Elephantine before the first surviving papyrus, and the record has long gaps. It does not establish continuity between the communities.",
      },
      {
        sourceKey: "otzar_midrashim_1915_eldad",
        citations: [{ sourceKey: "perry_2019_eldads_travels", relation: "context", note: "Traces how the Eldad tradition was transmitted and reused from the ninth century on." }],
        startYear: 880,
        endYear: 890,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest record of the tradition that the tribe of Dan lives in Cush",
        originalDateText: "The Kairouan community's letter about Eldad ha-Dani, 880s CE",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: later manuscript. The letter is dated by the gaonate of Tzemah ben Hayyim of Sura, to whom it was addressed, and survives only in much later copies. It dates when the Danite-in-Cush claim was made, not when Dan went anywhere.",
      },
      {
        sourceKey: "parfitt_2013_black_jews",
        citations: [{ sourceKey: "williams_1930_hebrewisms_west_africa", relation: "context", note: "The best-known modern proposal of Hebrew diffusion to West Africa, which names no Danite settlement in Bénin." }],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "A Danite or Jewish presence on the Gbe-speaking coast",
        originalDateText: "No date: no source places Danites in Bénin",
        datingMethod: "claimant_inference",
        chronology: "hypothesis",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Modern claims of a Danite link to Bénin rest on the likeness of the names Dan and dan; no document, inscription, excavation or oral tradition recorded before the twentieth century supports them, so no date can be given.",
      },
    ],
    media: [pBerlin13495, pSaharaRoutesEarly, pBetaIsraelMap],
  },

  // =========================================================================
  // ELEPHANTINE
  // =========================================================================
  {
    slug: "elephantine-judean-garrison-and-temple-of-yhw",
    title: "Elephantine: a Judean garrison and its temple of YHW on Egypt's frontier with Kush",
    summary:
      "On Elephantine island at the First Cataract, a Judean military colony serving Persian Egypt kept a temple of YHW (Ya'u) with an altar for meal-offering, incense and burnt offering. Its Aramaic papyri, about 495–400 BCE, are the oldest documents of a Jewish community in Africa, and they never mention Dan.",
    description:
      "WHAT IS EXCAVATED AND WHAT IS WRITTEN. Aramaic papyri and ostraca bought and dug up on Elephantine from the 1890s to 1908 (now in Berlin, Cairo, Brooklyn, Oxford and Paris) document a community that calls itself 'the Jewish garrison' (ḥyl' yhwdy'), serving the Persian administration at the fortress of Yeb, opposite Syene (Aswan). Herodotus (2.30) says garrisons faced 'towards the Ethiopians' there from Psammetichus's time and that the Persians kept them: this was the frontier with Kush.\n\n" +
      "THE TEMPLE. The community had a temple of YHW ('Ya'u the God' in Cowley's English) with stone gateways, a cedar roof and an altar on which meal-offering, incense and burnt offering were made. The petition of 407 BCE says it was built 'in the days of the kings of Egypt' and that Cambyses 'found that temple built' when he came in 525 BCE. German excavations on the island have located remains attributed to it beside the temple of the ram god Khnum (NEEDS SOURCE VERIFICATION for the excavation reports).\n\n" +
      "THE FESTIVAL LETTER. In 419 BCE a certain Hananiah wrote to Yedoniah 'and his colleagues the Jewish garrison' that word had come from Darius to the satrap Arsames, and gave instructions for the fourteenth to twenty-first of Nisan, a festival of unleavened bread. Cowley prints the word 'Passover' in brackets: it is restored where the papyrus is lost.\n\n" +
      "WHO THEY WERE. The documents call them Judeans; their names are Yahwistic; their oaths and a temple-collection list also name the deities Anat-Yahu, Eshem-Bethel and Anat-Bethel. Karel van der Toorn (2019) argues their ancestors were northern Israelites from Samaria who had lived among Aramaeans; critics note his key text, Papyrus Amherst 63, is of uncertain origin.\n\n" +
      DNE + " It establishes a Jewish community with its own sacrificial temple on Africa's Nile frontier in the sixth and fifth centuries BCE. It does NOT establish any tribe of Dan among them: no papyrus mentions Dan, and the possible 'Bethel' element points, if anywhere, to Jeroboam's other shrine. It does not establish any movement south of the Cataract, and nothing in the archive concerns serpents.\n\n" +
      "THINGS TO ASK: Why would a community far from Jerusalem keep a temple that Deuteronomy forbids, and write to Jerusalem for help rebuilding it?",
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["place: elephantine", "figure: yhwh", "theme: priesthood", "theme: manuscripts and their dates"], "elephantine papyri", "judeans"),
    people: ["Yedoniah", "Hananiah", "Arsames", "Darius II", "Cambyses"],
    civilisations: ["Judeans of Elephantine", "Achaemenid Persian Egypt", "Egyptian priests of Khnum"],
    locationName: "Elephantine island, Aswan, Egypt",
    lat: 24.086,
    lng: 32.886,
    claims: [
      {
        sourceKey: "cowley_1923_aramaic_papyri",
        citations: [
          { sourceKey: "porten_yardeni_tad", relation: "supports", note: "Re-edits the petition as TAD A4.7 with the same statement about Cambyses." },
          { sourceKey: "smb_berlin_p13495", relation: "context", note: "The papyrus that carries the statement." },
        ],
        startYear: bce(525),
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "before_event",
        whatIsDated: "The temple of YHW at Elephantine was already standing when Cambyses conquered Egypt",
        originalDateText: "when Cambyses came into Egypt he found that temple built",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The community's own claim, made in 407 BCE about a time over a century earlier (Cowley no. 30, line 13–14). It establishes that the temple predated 525 BCE in the community's memory; how much earlier is not established.",
      },
      {
        sourceKey: "porten_yardeni_tad",
        citations: [{ sourceKey: "kraeling_1953_brooklyn_aramaic_papyri", relation: "supports", note: "The Brooklyn family archives run to about 400 BCE." }],
        startYear: bce(495),
        endYear: bce(399),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The span of dated Aramaic documents from the Judean community at Elephantine",
        originalDateText: "Dated papyri from about 495 to about 400 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. The papyri are dated by Persian and Egyptian regnal years, which convert to BCE dates within a year. The range dates the surviving archive, not the community's founding or end.",
      },
      {
        sourceKey: "cowley_1923_aramaic_papyri",
        citations: [{ sourceKey: "porten_yardeni_tad", relation: "supports", note: "Edited as TAD A4.1." }],
        startYear: bce(419),
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Hananiah's letter on the festival of unleavened bread",
        originalDateText: "this year, the 5th year of King Darius",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Year 5 of Darius II = 419/418 BCE (Cowley no. 21). The papyrus is badly damaged; the word 'Passover' is Cowley's restoration, and the letter's purpose (introducing, regulating or authorising the festival) is debated.",
      },
      {
        sourceKey: "van_der_toorn_2019_becoming_diaspora_jews",
        citations: [{ sourceKey: "porten_yardeni_tad", relation: "context", note: "The papyri themselves call the community Judean, the label van der Toorn reinterprets." }],
        startYear: bce(600),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Arrival in Egypt of the ancestors of the Elephantine community, on van der Toorn's reconstruction",
        originalDateText: "about 600 BCE, after a century among Aramaeans",
        datingMethod: "textual_interpretation",
        chronology: "alternative",
        evidence:
          "EVIDENCE TYPE: modern interpretation. A minority reconstruction resting largely on Papyrus Amherst 63, whose provenance and date are uncertain. It does not establish a northern-Israelite (let alone Danite) origin; it proposes one.",
      },
    ],
    passages: [
      {
        label: "The temple was older than the Persian conquest",
        reference: "Cowley no. 30 (TAD A4.7), lines 13–14",
        sourceKey: "cowley_1923_aramaic_papyri",
        objectName: "Papyrus Berlin P. 13495",
        holdingInstitution: BERLIN,
        accessionNumber: "P. 13495",
        layers: [
          {
            layer: "primary_object",
            sourceKey: "smb_berlin_p13495",
            contentAbsentReason: "The papyrus itself, 24.6 × 32 cm, written on both sides; see the photograph in the gallery. Its Aramaic is not transcribed here.",
            evidence: "The object establishes that the text exists in a fifth-century hand; its date is given in its own last line.",
          },
          {
            layer: "translation",
            sourceKey: "cowley_1923_aramaic_papyri",
            language: "English",
            content:
              "Already in the days of the kings of Egypt our fathers had built that temple in the fortress of Yeb, and when Cambyses came into Egypt he found that temple built, and the temples of the gods of Egypt all of them they overthrew, but no one did any harm to that temple.",
            evidence: "Cowley's 1923 translation (public domain), copied from the archive.org scan. It is the community's own claim, made to win support, about events over a century earlier.",
          },
        ],
      },
      {
        label: "Hananiah's festival letter of 419 BCE",
        reference: "Cowley no. 21 (TAD A4.1), lines 2–9",
        sourceKey: "cowley_1923_aramaic_papyri",
        layers: [
          {
            layer: "primary_object",
            sourceKey: "porten_yardeni_tad",
            contentAbsentReason: "The papyrus survives in fragments: about half of each of lines 4–10 is lost. It was published by Sachau from the Berlin collection; its present inventory number was not checked in this session.",
            evidence: "The damage is the main fact about this text: much of what it is said to order is restoration.",
          },
          {
            layer: "translation",
            sourceKey: "cowley_1923_aramaic_papyri",
            language: "English",
            content:
              "Now this year, the 5th year of King Darius, word was sent from the king to Arsames, saying: In the month of Tybi (?) let there be a Passover for the Jewish garrison. Now you accordingly count fourteen days of the month Nisan and keep the Passover, and from the 15th day to the 21st day of Nisan (are) seven days of Unleavened bread. Be clean and take heed. Do no work on the 15th day and on the 21st day.",
            evidence: "Cowley's 1923 translation (public domain), lightly normalised from his italic restorations. Cowley himself calls the restoration of 'Passover' 'a conjecture, but … probable'; Porten and Yardeni restore similarly. It is NOT a fully preserved Passover text.",
          },
        ],
      },
    ],
    media: [pElephantineSite2016, pBrooklynMarriage449, pBrooklynHouse402],
  },
  {
    slug: "elephantine-temple-destroyed-410-bce-petition-to-bagohi",
    title: "410 BCE: the temple of YHW at Elephantine is destroyed, and its priests petition the governor of Judah",
    summary:
      "In the month of Tammuz of Darius II's fourteenth year (410 BCE), the priests of Khnum and the Persian commander Vidranga had the Judean temple at Elephantine destroyed. Three years later the community petitioned Bagohi, governor of Judah, to support its rebuilding; his reply survives as a memorandum.",
    description:
      "WHAT THE SOURCE SAYS. The petition (Cowley no. 30; TAD A4.7; Berlin P. 13495, with a second draft, A4.8) is from 'your servants Yedoniah and his colleagues, the priests who are in Yeb the fortress' to 'our lord Bigvai (Bagohi), governor of Judah'. In Tammuz of year 14 of Darius, while the satrap Arsames was away, 'the priests of the god Khnub' conspired with Vidranga (Cowley's 'Waidrang'), who sent word to his son Nephayan at Syene; Egyptians and other troops 'destroyed it to the ground', broke its stone pillars and gateways, burned its cedar roof and took its gold and silver basins.\n\n" +
      "THE AFTERMATH. The community fasted in sackcloth; 'neither meal-offering, incense, nor sacrifice' had been offered since. They had already written to Bagohi, to 'Johanan the high priest' in Jerusalem and to the nobles of the Jews without reply; they also wrote to Delaiah and Shelemiah, sons of Sanballat, governor of Samaria. The reply memorandum (Berlin P. 13497; TAD A4.9) recommends rebuilding the 'altar-house' and offering meal-offering and incense, conspicuously not burnt offerings.\n\n" +
      "THE DATE. The petition is dated '20th of Marheshwan, the 17th year of Darius the king'. The Berlin museum and Porten–Yardeni convert this to 25 November 407 BCE; Cowley (1923) gave 408 BCE. The destruction itself is dated by the same text to Tammuz of year 14, i.e. summer 410 BCE.\n\n" +
      "WHY IT MATTERS FOR THIS TRACK. It is the clearest ancient evidence of a Jewish community in Africa looking to Jerusalem and Samaria, not southwards. The petition's addressees are the governors of Judah and Samaria, the two successor provinces of Judah and of the old northern kingdom where Dan had lain.\n\n" +
      DNE + " It establishes a dated act of religious violence, a sacrificial cult of YHW in Egypt, and the community's ties to Judah and Samaria. It does NOT establish any connection with Dan, any onward migration into Nubia or further, or anything about serpents; and the destruction was local and political, not an expulsion.\n\n" +
      "THINGS TO ASK: Why might the reply allow incense and meal-offering but say nothing of burnt offering?",
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["place: elephantine", "figure: yhwh", "theme: priesthood", "theme: manuscripts and their dates"], "elephantine papyri", "temple destruction"),
    people: ["Yedoniah", "Bagohi (Bigvai)", "Vidranga (Waidrang)", "Nephayan", "Arsames", "Johanan the high priest", "Delaiah son of Sanballat"],
    civilisations: ["Judeans of Elephantine", "Achaemenid Persian Egypt", "Priests of Khnum", "Province of Judah", "Province of Samaria"],
    locationName: "Elephantine island, Aswan, Egypt",
    lat: 24.085,
    lng: 32.885,
    claims: [
      {
        sourceKey: "cowley_1923_aramaic_papyri",
        citations: [{ sourceKey: "porten_yardeni_tad", relation: "supports", note: "Same reading of the date of destruction in TAD A4.7." }],
        startYear: bce(410),
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The destruction of the temple of YHW at Elephantine",
        originalDateText: "In the month of Tammuz in the 14th year of Darius the king",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Stated in the victims' own petition three years later; year 14 of Darius II is 410 BCE and Tammuz falls in June–July. A one-sided account, but there is no rival dating.",
      },
      {
        sourceKey: "smb_berlin_p13495",
        citations: [{ sourceKey: "porten_yardeni_tad", relation: "supports", note: "Same conversion in the standard edition." }],
        startYear: bce(407),
        startMonth: 11,
        startDay: 25,
        datePrecision: "day",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The writing of the petition to Bagohi",
        originalDateText: "On the 20th of Marheshwan the 17th year of Darius the king (25 November 407 BCE)",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. The papyrus's own date, converted by the museum and the standard edition. It dates the document.",
      },
      {
        sourceKey: "cowley_1923_aramaic_papyri",
        startYear: bce(408),
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The writing of the petition, on Cowley's older conversion",
        originalDateText: "408 B.C. (Cowley's date for no. 30)",
        datingMethod: "regnal_chronology",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Cowley's 1923 conversion of the same regnal date, a year earlier than the modern one; kept so that readers using Cowley see why the dates differ. It reflects an older reckoning of Darius II's regnal years, not a different text.",
      },
    ],
    passages: [
      {
        label: "The destruction of the temple",
        reference: "Cowley no. 30 (TAD A4.7), lines 4–12",
        sourceKey: "cowley_1923_aramaic_papyri",
        objectName: "Papyrus Berlin P. 13495",
        holdingInstitution: BERLIN,
        accessionNumber: "P. 13495",
        layers: [
          {
            layer: "translation",
            sourceKey: "cowley_1923_aramaic_papyri",
            language: "English",
            content:
              "In the month of Tammuz in the 14th year of Darius the king, when Arsames departed and went to the king, the priests of the god Khnub, who is in the fortress of Yeb, (were) in league with Waidrang who was governor here, saying: The temple of Ya'u the God, which is in the fortress of Yeb let them remove from there. … They came to the fortress of Yeb with their weapons, they entered that temple, they destroyed it to the ground, and the pillars of stone which were there they broke.",
            evidence: "Cowley's 1923 translation (public domain), copied from the archive.org scan with an ellipsis. The petitioners' account of their enemies.",
          },
        ],
      },
      {
        label: "The request to rebuild",
        reference: "Cowley no. 30 (TAD A4.7), lines 23–26",
        sourceKey: "cowley_1923_aramaic_papyri",
        layers: [
          {
            layer: "translation",
            sourceKey: "cowley_1923_aramaic_papyri",
            language: "English",
            content:
              "Let a letter be sent from you to them concerning the temple of the God Ya'u to build it in the fortress of Yeb as it was built before, and they shall offer the meal-offering and incense and sacrifice on the altar of the God Ya'u on your behalf, and we will pray for you at all times.",
            evidence: "Cowley's 1923 translation (public domain). Establishes that the cult included animal sacrifice on an altar, which the reply memorandum does not mention.",
          },
        ],
      },
    ],
    media: [pBerlin13495, pBerlin13497, pAmyrtaiosPapyrus],
  },
  {
    slug: "jews-in-egypt-and-on-the-nubian-frontier",
    title: "Jews in Egypt and on the frontier of Kush: the texts behind 'Israel in Cush'",
    summary:
      "Biblical prophets speak of exiles 'from Cush' and 'beyond the rivers of Cush'; a Hellenistic letter says Jewish auxiliaries fought for Psammetichus against the king of the Ethiopians; Herodotus puts a garrison at Elephantine facing Kush. Together they show Jews on Egypt's southern frontier, not inside Kush.",
    description:
      "WHAT THE SOURCES SAY. Three different kinds of text speak of Jews towards Kush. (1) BIBLICAL PROPHECY: Isaiah 11:11 lists 'Cush' among the lands from which a remnant will be gathered; Zephaniah 3:10 speaks of worshippers bringing offerings 'from beyond the rivers of Cush'. Jeremiah 44:1 addresses Judeans in Migdol, Tahpanhes, Memphis and 'the land of Pathros' (Upper Egypt). (2) A HELLENISTIC JEWISH TEXT: the Letter of Aristeas (§13, second century BCE) says Jews had come with 'the Persian' and, earlier, 'had been sent out as auxiliaries to fight in the army of Psammetichus against the king of the Ethiopians'. Psammetichus II's campaign into Nubia in 593 BCE is independently attested, though not its Jewish soldiers. (3) A GREEK HISTORIAN: Herodotus (2.30) says Egyptian kings garrisoned Elephantine 'towards the Ethiopians' and the Persians kept that outpost in his day.\n\n" +
      "HOW THEY FIT. The Elephantine papyri are the documentary core; Herodotus and Aristeas explain why soldiers were there; the prophets show that 'Cush' was a land of Israelite exile in Judean imagination from at least the sixth century BCE. It is from these verses, especially Zephaniah's phrase, that the ninth-century Kairouan letter takes its words 'the tribes beyond the rivers of Cush'.\n\n" +
      DNE + " It establishes Jews in Egypt and soldiers on the frontier of Kush in the sixth and fifth centuries BCE, and a scriptural image of Israelites in Cush. It does NOT establish a Jewish community inside Kush (Napata or Meroë), where no Hebrew or Aramaic Jewish document has been found; and the prophetic verses are religious texts about a hoped-for return, not records of settlement. None mentions the tribe of Dan.\n\n" +
      "THINGS TO ASK: When a later writer quotes a prophecy as geography, which is he relying on, the prophecy or the geography?",
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["place: elephantine", "place: napata and meroe", "theme: migration traditions", "theme: manuscripts and their dates"], "cush", "egyptian jews"),
    people: ["Psammetichus II", "Herodotus", "Aristeas (pseudonymous author)", "Zephaniah", "Jeremiah"],
    civilisations: ["Judeans in Egypt", "Saite Egypt", "Kush", "Achaemenid Persian Egypt"],
    locationName: "Upper Egypt and the First Cataract frontier with Kush",
    claims: [
      {
        sourceKey: "aristeas_thackeray_1917",
        citations: [{ sourceKey: "herodotus_macaulay_histories", relation: "context", note: "Herodotus describes the Saite and Persian garrisons at Elephantine facing Kush." }],
        startYear: bce(593),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "Jewish auxiliaries in Psammetichus's army against the king of the Ethiopians (if Psammetichus II's Nubian campaign is meant)",
        originalDateText: "sent out as auxiliaries to fight in the army of Psammetichus against the king of the Ethiopians",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: later historical account. Aristeas wrote some four centuries later and names only 'Psammetichus'; Thackeray's note allows either Psammetichus I or II. If II, the campaign of 593 BCE fits. The Jewish soldiers are attested only here.",
      },
      {
        sourceKey: "herodotus_macaulay_histories",
        startYear: bce(430),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "A Persian garrison at Elephantine facing Kush in Herodotus's own time",
        originalDateText: "even in my own time the garrisons of the Persians too are ordered in the same manner",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Herodotus's statement about his own day (Histories 2.30), contemporary with the papyri. He does not mention Jews.",
      },
      {
        sourceKey: "kjv_bible",
        citations: [{ sourceKey: "wlc_hebrew_bible", relation: "supports", note: "The Hebrew: me-ʿever le-naharei Kush." }],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "Israelite worshippers 'beyond the rivers of Cush' in prophecy",
        originalDateText: "From beyond the rivers of Ethiopia my suppliants … shall bring mine offering",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: biblical narrative. A prophetic promise whose date of composition (seventh to fifth century BCE) is debated; it describes a hoped-for future, not a dated settlement, so no year is given.",
      },
    ],
    passages: [
      {
        label: "Zephaniah 3:10: 'beyond the rivers of Cush'",
        reference: "Zephaniah 3:10",
        sourceKey: "wlc_hebrew_bible",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            language: "Hebrew",
            script: "Hebrew",
            content: "מֵעֵ֖בֶר לְנַֽהֲרֵי־כ֑וּשׁ עֲתָרַי֙ בַּת־פוּצַ֔י יוֹבִל֖וּן מִנְחָתִֽי׃",
            evidence: "The Masoretic text as in the Leningrad Codex (1008/9 CE), from the Open Scriptures WLC.",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            language: "English",
            content: "From beyond the rivers of Ethiopia my suppliants, even the daughter of my dispersed, shall bring mine offering.",
            evidence: "KJV. 'Ethiopia' renders Kush, the Nile kingdom south of Egypt, not the modern state. The verse names no tribe.",
          },
        ],
      },
      {
        label: "Isaiah 11:11: a remnant 'from Cush'",
        reference: "Isaiah 11:11",
        sourceKey: "wlc_hebrew_bible",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            language: "Hebrew",
            script: "Hebrew",
            content:
              "וְהָיָ֣ה׀ בַּיּ֣וֹם הַה֗וּא יוֹסִ֨יף אֲדֹנָ֤י׀ שֵׁנִית֙ יָד֔וֹ לִקְנ֖וֹת אֶת־שְׁאָ֣ר עַמּ֑וֹ אֲשֶׁ֣ר יִשָּׁאֵר֩ מֵאַשּׁ֨וּר וּמִמִּצְרַ֜יִם וּמִפַּתְר֣וֹס וּמִכּ֗וּשׁ וּמֵעֵילָ֤ם וּמִשִּׁנְעָר֙ וּמֵ֣חֲמָ֔ת וּמֵאִיֵּ֖י הַיָּֽם׃",
            evidence: "The Masoretic text as in the Leningrad Codex, from the Open Scriptures WLC.",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            language: "English",
            content:
              "And it shall come to pass in that day, that the Lord shall set his hand again the second time to recover the remnant of his people, which shall be left, from Assyria, and from Egypt, and from Pathros, and from Cush, and from Elam, and from Shinar, and from Hamath, and from the islands of the sea.",
            evidence: "KJV. A list of lands of dispersion; Pathros is Upper Egypt, where Elephantine lay.",
          },
        ],
      },
      {
        label: "Letter of Aristeas §13: Jewish soldiers against the Ethiopians",
        reference: "Letter of Aristeas 13",
        sourceKey: "aristeas_thackeray_1917",
        layers: [
          {
            layer: "translation",
            sourceKey: "aristeas_thackeray_1917",
            language: "English",
            content:
              "Many Jews had already before this entered the country along with the Persian, and others had at a still earlier time been sent out as auxiliaries to fight in the army of Psammetichus against the king of the Ethiopians.",
            evidence: "Thackeray's 1917 translation, copied from the archive.org scan. A Hellenistic text's claim about the distant past.",
          },
        ],
      },
    ],
    media: [pElephantineIsland2025, pAmyrtaiosPapyrus],
  },

  // =========================================================================
  // ETHIOPIA
  // =========================================================================
  {
    slug: "beta-israel-origins-debate",
    title: "Where did the Beta Israel come from? Lost tribe, Judaising Ethiopians, or both",
    summary:
      "The Jews of northern Ethiopia hold a tradition of Israelite descent, often specifically from Dan; most historians (Kaplan, Quirin, Shelemay) date their formation as a distinct group to fourteenth–sixteenth-century Ethiopia; genetic studies cluster them with their Ethiopian neighbours. The debate is about Ethiopia and the Red Sea, not West Africa.",
    description:
      "THE TRADITIONS. The Beta Israel ('House of Israel'; outsiders' term Falasha) practised a non-rabbinic, Torah-centred religion (Haymanot) with priests (kahenat), monks, sacrifice and purity laws, and Ge'ez liturgy. Within and around the community several origin stories circulated: descent from companions of Menelik son of Solomon (the Kebra Nagast line), from Jews who came via Egypt or Yemen, or, following Eldad ha-Dani and later rabbis, from the tribe of Dan.\n\n" +
      "THE SCHOLARLY VIEWS. Steven Kaplan (1992) argues that the Beta Israel are not a lost tribe but a group that took shape in Ethiopia between the fourteenth and sixteenth centuries, from people the Christian kings and chroniclers labelled 'ayhud' (Jews) in conflicts over religion and land. James Quirin (1992) agrees on the medieval formation but gives more weight to an older Jewish element. Kay Kaufman Shelemay (1986) found their liturgy intimately linked to Ethiopian Christian monasticism. Genetic studies (Behar et al. 2010) cluster the Beta Israel with neighbouring Horn of Africa populations rather than with other Jewish groups. Community historians and some scholars contest the 'invention' model as underrating an ancient Judaic layer.\n\n" +
      "WHAT IT HAS TO DO WITH DAN. The Danite identification enters through texts written OUTSIDE the community, Eldad's account (ninth century) and Radbaz's responsa (sixteenth), and became decisive through the Israeli rabbinate's 1973 ruling. It is a tradition about origins, recorded at known dates, not a record of a migration.\n\n" +
      DNE + " It establishes a Jewish community in Ethiopia with a long, documented history and a Danite identity tradition. It does NOT establish descent from the biblical Dan, any serpent element in Beta Israel religion (none is reported), or any westward movement towards the Niger or the Gulf of Guinea.\n\n" +
      "THINGS TO ASK: If a community's religion was shaped in medieval Ethiopia, does that make its claim to be Israel less real to its members, and is that a historian's question at all?",
    category: "religion",
    subcategory: SUB,
    eventType: "disputed",
    eventTypeNote: "Competing models of origin: an ancient Israelite (Danite) descent, held as tradition, and a medieval Ethiopian ethnogenesis, held by most historians.",
    identificationStatus: "disputed",
    tags: serpentTags(LANE, ["place: ethiopia", "figure: dan (tribe)", "theme: migration traditions"], "beta israel", "origins debate"),
    people: ["Steven Kaplan", "James Quirin", "Kay Kaufman Shelemay", "Henry Aaron Stern"],
    civilisations: ["Beta Israel", "Solomonic Ethiopia", "Agaw"],
    locationName: "Gondar and the Semien region, northern Ethiopia",
    lat: 12.6,
    lng: 37.47,
    argumentsFor:
      "For an ancient Israelite (including Danite) origin: the community's own tradition; Eldad ha-Dani's ninth-century report of Israelite tribes in Cush; Radbaz's sixteenth-century acceptance of Ethiopian captives as Jews of Dan; pre-rabbinic features of their practice (sacrifice, purity laws, no Talmud) that some read as signs of separation before the rabbinic period.",
    argumentsAgainst:
      "Against a descent from the tribe of Dan: no source before Eldad links Dan with Ethiopia, and Eldad's account is legendary in much of its content; Kaplan and Quirin trace the community's formation to Ethiopian religious and political conflict in the fourteenth to sixteenth centuries; Shelemay finds their liturgy rooted in Ethiopian Christian monasticism; genome-wide data cluster them with neighbouring Ethiopians.",
    genealogies: [
      {
        key: "beta-israel-are-dan",
        claim: "The Beta Israel are descendants of the biblical tribe of Dan",
        verdict: "later_interpretation",
        verdictEvidence:
          "The identification is first made by outsiders: Eldad (ninth century) places Dan in Cush without naming the Beta Israel; Radbaz (sixteenth century) applies it to Ethiopian captives; the Israeli rabbinate adopts it in 1973. No earlier evidence links Dan to Ethiopia.",
        whatWouldChangeThis:
          "An independent pre-modern Ethiopian or Beta Israel text, datable before Eldad, naming Dan; or archaeological evidence of an early Judaic community in the Lake Tana–Semien region.",
        links: [
          {
            stage: "later_antiquity",
            who: "The Kairouan community, reporting Eldad ha-Dani",
            year: 885,
            sourceKey: "otzar_midrashim_1915_eldad",
            reference: "Sefer Eldad ha-Dani, Story 1",
            says: "ארבעה שבטים הם במקום אחד, דן ונפתלי גד ואשר, שם המקום חוילה הקדומה אשר שם הזהב",
            adds: "Places four tribes, Dan among them, in 'Havilah', identified with Cush, without naming the Beta Israel.",
            citationStatus: "verified",
          },
          {
            stage: "early_scholarship",
            who: "David ibn Abi Zimra (Radbaz)",
            sourceKey: "radbaz_responsa_ethiopian_jews",
            reference: "Responsa 4:219 and 7:9",
            saysAbsentReason: "The Hebrew responsa were not read in this session; their content is known from the Har Etzion study.",
            adds: "Applies the Danite identification to specific Jews brought from 'the land of Cush' as captives.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Steven Kaplan",
            year: 1992,
            sourceKey: "kaplan_1992_beta_israel",
            saysAbsentReason: "Paraphrased from reviews; the book was not opened in this session.",
            adds: "Replaces descent with ethnogenesis: the group formed in Ethiopia in the fourteenth to sixteenth centuries.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "kaplan_1992_beta_israel",
        citations: [
          { sourceKey: "quirin_1992_evolution_of_ethiopian_jews", relation: "supports", note: "Also places the group's formation in medieval Ethiopia, with more weight on an older element." },
          { sourceKey: "shelemay_1986_music_ritual_falasha", relation: "supports", note: "Finds the liturgy rooted in Ethiopian Christian monasticism." },
        ],
        startYear: 1300,
        endYear: 1600,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The formation of the Beta Israel as a distinct community, on the majority historical view",
        originalDateText: "between the fourteenth and sixteenth centuries",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Built from Ethiopian royal chronicles and hagiographies that mention 'ayhud'. It dates the emergence of the community in the written record and in historians' reconstruction; it does not rule out older Judaic elements.",
      },
      {
        sourceKey: "otzar_midrashim_1915_eldad",
        citations: [{ sourceKey: "radbaz_responsa_ethiopian_jews", relation: "supports", note: "Radbaz applies the Danite identification to Ethiopian Jews." }],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The arrival of Danites in Ethiopia, according to the Danite tradition",
        originalDateText: "In the days of the Israelite kings, undated in the tradition",
        datingMethod: "oral_tradition",
        chronology: "traditional",
        evidence:
          "EVIDENCE TYPE: religious tradition. Eldad places Dan's departure after the division of the kingdom; Tzemah Gaon in the Assyrian period. Neither gives a checkable date, and the tradition is recorded only from the ninth century CE.",
      },
      {
        sourceKey: "behar_2010_genome_wide_jewish",
        startYear: 2010,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of genome-wide evidence clustering the Beta Israel with neighbouring Ethiopian populations",
        originalDateText: "Behar et al., Nature, 2010",
        datingMethod: "genetic",
        chronology: "scientific",
        evidence:
          "EVIDENCE TYPE: modern interpretation. A genetic finding about ancestry; it is consistent with a local formation or with a small founding group absorbed locally, and does not by itself decide the religious history.",
      },
    ],
    media: [pStern1862, pBetaIsraelPrayerBook, pBetaIsraelMap],
  },

  // =========================================================================
  // ELDAD HA-DANI
  // =========================================================================
  {
    slug: "eldad-ha-dani-dan-in-the-land-of-cush",
    title: "Eldad ha-Dani and the Kairouan letter: 'Dan, Naphtali, Gad and Asher' in the land of Cush",
    summary:
      "In the 880s a traveller calling himself Eldad of the tribe of Dan came to the Jews of Kairouan, told them four tribes lived as an independent people 'in ancient Havilah where there is gold', beyond the rivers of Cush, and taught a Hebrew-only law. Kairouan asked Tzemah Gaon of Sura, who replied that Dan had gone to Cush before the Assyrian exile.",
    description:
      "WHAT THE SOURCE SAYS. The Kairouan community's letter to 'Mar Rav Tzemah Gaon' (Hebrew text in Epstein's edition, reprinted in Otzar Midrashim 1915) reports: a man named Eldad ha-Dani 'of the tribe of Dan' stayed with them and said that four tribes, Dan, Naphtali, Gad and Asher, live in one place, 'ancient Havilah where there is gold'; that they have a judge named Abdon, live in tents and move from place to place, and are at war with the kings of Cush; that they have the whole Bible but not Esther or Lamentations; and that their Talmud cites no sages, only 'Joshua from the mouth of Moses from the mouth of the Almighty'. Eldad, they said, understood neither 'the language of Cush' nor Arabic, only Hebrew, with strange words. The letter opens by praising the gaon for sustaining not only the dispersed but 'the tribes beyond the rivers of Cush', the words of Zephaniah 3:10.\n\n" +
      "THE GAON'S REPLY. Tzemah Gaon answered that scholars had seen Eldad in Babylonia, that some of his laws resembled the rabbis' and some did not, and that Dan, 'warriors', had left the land of Israel for Cush when the king of Assyria began to rule over Israel, 135 years before the destruction, which is why Dan is missing from the rabbinic list of exiles. Differences in law were to be expected after long separation and Eldad's sufferings.\n\n" +
      "WHERE 'CUSH' IS. For Eldad and his readers Cush was the land south of Egypt along the Nile and the Red Sea, the region of Nubia and Ethiopia. Later readers, especially from the sixteenth century, identified Eldad's Danites with the Jews of Ethiopia. No version places them in West Africa.\n\n" +
      DNE + " It establishes that by the 880s a Danite-in-Cush tradition was told, written down and judged by the highest rabbinic authority of the day. It does NOT establish that Eldad came from Africa (scholars have argued for Arabia, Yemen and elsewhere), that his tribes existed, or that the letters are authentic in every part: Jacob Reifmann in the nineteenth century held them forgeries. It says nothing about serpents.\n\n" +
      "THINGS TO ASK: Why would a community already reading Zephaniah's 'rivers of Cush' find Eldad's story easy to believe?",
    category: "religion",
    subcategory: SUB,
    eventType: "disputed",
    eventTypeNote: "A ninth-century traveller's claim, recorded by his hearers and judged by a gaon; its truth and even the letters' authenticity are debated.",
    identificationStatus: "disputed",
    tags: serpentTags(LANE, ["figure: dan (tribe)", "theme: migration traditions", "theme: manuscripts and their dates", "place: ethiopia"], "eldad ha-dani", "kairouan", "lost tribes"),
    people: ["Eldad ha-Dani", "Tzemah ben Hayyim, Gaon of Sura", "Isaac ben Mar", "Simhah"],
    civilisations: ["Jews of Kairouan", "Babylonian geonim (Sura academy)", "Kush (as Eldad names it)"],
    locationName: "Kairouan, Ifriqiya (Tunisia)",
    lat: 35.678,
    lng: 10.096,
    argumentsFor:
      "For taking Eldad as evidence of Jews in Cush: the Kairouan letter is an early, specific and circumstantial report; the gaon accepted Eldad as a Jew and his laws as a genuine divergent tradition; Eldad's Hebrew-only vocabulary and his law code look like the product of a real community separated from Babylonian rabbinic Judaism; later writers (Radbaz) took the report as the origin of the Ethiopian Jews.",
    argumentsAgainst:
      "Against reading it as history: the narratives contain plainly legendary material (the Sambatyon river, the sons of Moses, cannibal 'Cushites'); the account survives only in later, divergent recensions; Reifmann and others doubted the letters' authenticity; Eldad's own origin is unknown and has been placed in Arabia or Yemen; nothing in the text connects the tribes with any identifiable African people, and nothing points west of the Nile.",
    genealogies: [
      {
        key: "eldad-dan-in-cush",
        claim: "The tribe of Dan lives as an independent nation in the land of Cush",
        verdict: "related_tradition_exists",
        verdictEvidence:
          "The claim is directly recorded in the ninth-century Kairouan letter and accepted by Tzemah Gaon, building on biblical images of Israelites 'from Cush'. No independent evidence of a Danite polity in Nubia or Ethiopia exists; the tradition is a real ninth-century belief, not an attested people.",
        whatWouldChangeThis:
          "A non-Jewish source of the period (Arabic geographers, Ethiopian chronicles) describing an Israelite tribal kingdom in Cush, or archaeological evidence for one.",
        links: [
          {
            stage: "ancient_primary",
            who: "Zephaniah",
            sourceKey: "wlc_hebrew_bible",
            reference: "Zephaniah 3:10",
            says: "מֵעֵ֖בֶר לְנַֽהֲרֵי־כ֑וּשׁ",
            adds: "Supplies the image of worshippers 'beyond the rivers of Cush', without tribes or Dan.",
            citationStatus: "verified",
          },
          {
            stage: "later_antiquity",
            who: "The Jews of Kairouan",
            year: 885,
            sourceKey: "otzar_midrashim_1915_eldad",
            reference: "Story 1",
            says: "ולא לנו המפוזרים בלבד אלא לשבטים אשר מעבר לנהרי כוש",
            adds: "Turns the prophetic phrase into living tribes, among them Dan, on Eldad's testimony.",
            citationStatus: "verified",
          },
          {
            stage: "later_antiquity",
            who: "Tzemah ben Hayyim, Gaon of Sura",
            sourceKey: "otzar_midrashim_1915_eldad",
            reference: "Story 1, the gaon's reply",
            says: "יצאו מארץ ישראל לכוש וחנו שם",
            adds: "Gives the migration a biblical-historical setting: Dan left for Cush when Assyria began to rule Israel.",
            citationStatus: "verified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "otzar_midrashim_1915_eldad",
        citations: [
          { sourceKey: "adler_1930_jewish_travellers", relation: "supports", note: "Translates the letter and dates Eldad 'ca. 880'." },
          { sourceKey: "epstein_1891_eldad", relation: "supports", note: "The critical edition on which the Otzar Midrashim text depends." },
        ],
        startYear: 880,
        endYear: 890,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Eldad's stay at Kairouan and the community's letter to Tzemah Gaon",
        originalDateText: "In the time of Mar Rav Tzemah Gaon, the 880s",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later manuscript. The letter carries no date; it is dated by its addressee's tenure as gaon of Sura, usually put in the 880s (exact years NEED SOURCE VERIFICATION). The text survives only in copies centuries later.",
      },
      {
        sourceKey: "otzar_midrashim_1915_eldad",
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "Dan's departure for Cush, according to Tzemah Gaon",
        originalDateText: "when the king of Assyria began to rule over Israel, 135 years before the destruction",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: religious tradition. A ninth-century rabbinic harmonisation of Eldad's story with biblical chronology. It dates nothing independently; no year is placed on the timeline.",
      },
    ],
    passages: [
      {
        label: "The Kairouan letter: four tribes in Havilah",
        reference: "Sefer Eldad ha-Dani, Story 1 (Epstein's edition, reprinted in Otzar Midrashim, 1915)",
        sourceKey: "otzar_midrashim_1915_eldad",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "otzar_midrashim_1915_eldad",
            language: "Hebrew",
            script: "Hebrew",
            content:
              "ולא לנו המפוזרים בלבד אלא לשבטים אשר מעבר לנהרי כוש … נודיע לאדונינו כי נתארח בינינו אדם אחד ושמו אלדד הדני משבט דן, וספר לנו כי ארבעה שבטים הם במקום אחד, דן ונפתלי גד ואשר, שם המקום חוילה הקדומה אשר שם הזהב. ויש להם שופט עבדון שמו … ונלחמים עם חמשת מלכי כוש",
            evidence: "Copied from the 1915 Otzar Midrashim text (public domain) via the Sefaria API, with ellipses. A modern printed text resting on Epstein's 1891 edition of later manuscripts.",
          },
          {
            layer: "translation",
            sourceKey: null,
            language: "English",
            content:
              "…and not only for us who are scattered, but for the tribes beyond the rivers of Cush … We inform our lord that a man named Eldad ha-Dani, of the tribe of Dan, stayed with us, and told us that four tribes are in one place, Dan and Naphtali, Gad and Asher; the name of the place is ancient Havilah, where there is gold. They have a judge named Abdon … and they fight with five kings of Cush.",
            viewpoint: "historical",
            evidence: "This lane's own literal working translation, made for this record; Adler (1930) gives a published English version. 'Havilah where there is gold' quotes Genesis 2:11.",
          },
        ],
      },
      {
        label: "Tzemah Gaon's reply: Dan went to Cush",
        reference: "Sefer Eldad ha-Dani, Story 1, the gaon's answer",
        sourceKey: "otzar_midrashim_1915_eldad",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "otzar_midrashim_1915_eldad",
            language: "Hebrew",
            script: "Hebrew",
            content:
              "וכיון שראו בני דן שהיו גבורי חיל שהתחיל מלך אשור לשלוט בישראל, יצאו מארץ ישראל לכוש וחנו שם, להיותה ארץ גנות ופרדסים שדות וכרמים … ולא הוזכר שבט דן בכל הגליות, לפי שמעצמו הלך לכוש קודם החורבן קל״ה שנה",
            evidence: "Copied from the 1915 Otzar Midrashim text (public domain) via the Sefaria API.",
          },
          {
            layer: "translation",
            sourceKey: null,
            language: "English",
            content:
              "When the sons of Dan, who were mighty warriors, saw that the king of Assyria had begun to rule over Israel, they left the land of Israel for Cush and encamped there, for it was a land of gardens and orchards, fields and vineyards … and the tribe of Dan is not mentioned among all the exiles, because it went to Cush of its own accord 135 years before the destruction.",
            viewpoint: "religious",
            evidence: "This lane's own literal working translation. The gaon is reconciling Eldad with the rabbinic list of exiles, not reporting a source.",
          },
        ],
      },
    ],
    media: [pKairouanAerial, pBenEzraGenizah],
  },
  {
    slug: "eldad-ha-dani-recensions-and-interpolations",
    title: "Eldad ha-Dani's text: recensions, early prints and later interpolations",
    summary:
      "Eldad's account survives not as one text but as a family of divergent versions in Hebrew, Arabic, Latin and other languages, printed from Mantua (1480) onward and sorted by Epstein (1891) and Müller (1892). Each copy added, cut and relocated; the Danite-in-Cush core is constant, while details grew.",
    description:
      "WHAT SURVIVES. No manuscript of the ninth century survives. The Eldad material reaches us as: (1) the Kairouan letter and Tzemah Gaon's reply; (2) Eldad's narrative of his shipwreck, captivity among 'Romranos' cannibals, rescue by a merchant of Issachar, and the tribes' lands; (3) his halakhot, especially on ritual slaughter. These circulated in many versions: Hebrew manuscripts in European libraries, a Genizah fragment of the ritual (edited by Schloessinger, 1908), an anonymous Arabic version (St Petersburg), and translations into Latin (Génébrard, Paris 1584), Yiddish and German.\n\n" +
      "THE PRINTED TRADITION. The first printed edition appeared at Mantua in 1480; others followed at Constantinople (1516, 1519) and Venice (1544, 1605, 1648). The critical work began with Abraham Epstein's edition (Pressburg 1891) and D. H. Müller's classification of recensions and versions (Vienna 1892); Max Schloessinger edited the ritual (1908); E. N. Adler gave an English translation (1930); Micha Perry's 2019 book traces the story's afterlives.\n\n" +
      "WHAT CHANGES BETWEEN VERSIONS. As Müller showed, copyists remoulded the story: names of the Danite king vary (Adiel, Uziel), the number of hostile Cushite kings varies (five or seven, as Eisenstein's bracket notes), episodes are added, and Eldad's laws are harmonised or expanded. Some versions frame the narrative as a letter to the Jews of Spain. The constant core is the claim that Dan and other tribes live independently beyond the rivers of Cush.\n\n" +
      "IMAGE GAP: manuscript pages of Eldad's text — no free single-page image of an Eldad manuscript or of the 1480 Mantua print was found on Commons; Schloessinger's 1908 edition is on Commons as a PDF at https://upload.wikimedia.org/wikipedia/commons/9/94/The_ritual_of_Eldad_ha-Dani_reconstructed_and_ed._from_manuscripts_and_a_genizah_fragment_%28IA_ritualofeldadhad00eldaiala%29.pdf. The picture used here is the Ben Ezra Genizah, marked UNVERIFIED as the fragment's source.\n\n" +
      DNE + " It establishes that the Eldad tradition was copied and re-copied for six centuries and changed as it went, so any single detail must be checked against the recensions before use. It does NOT establish what Eldad himself said beyond the core attested in the Kairouan letter, and late additions cannot be used as evidence for the ninth century, still less for the eighth century BCE.\n\n" +
      "THINGS TO ASK: When a story exists in a dozen versions, which details can be called 'Eldad's'?",
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: manuscripts and their dates", "figure: dan (tribe)", "theme: migration traditions"], "eldad ha-dani", "recensions"),
    people: ["Eldad ha-Dani", "Abraham Epstein", "David Heinrich Müller", "Max Schloessinger", "Elkan Nathan Adler", "Micha J. Perry", "Gilbert Génébrard"],
    civilisations: ["Medieval Jewish scribes", "Italian Hebrew printers"],
    locationName: "Mantua, Constantinople and the Cairo Genizah (manuscript and print tradition)",
    claims: [
      {
        sourceKey: "epstein_1891_eldad",
        citations: [{ sourceKey: "perry_2019_eldads_travels", relation: "context", note: "Discusses the print history and reception." }],
        startYear: 1480,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The first printed edition of Eldad's narrative",
        originalDateText: "Mantua, 1480",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later manuscript. A printed book six centuries after the events it reports. It dates a stage in the text's transmission, not Eldad's journey. Date from reference works; NEEDS SOURCE VERIFICATION against an incunabula catalogue.",
      },
      {
        sourceKey: "muller_1892_eldad_recensions",
        citations: [{ sourceKey: "epstein_1891_eldad", relation: "supports", note: "Edited the versions Müller classified." }],
        startYear: 1892,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Müller's classification of the recensions and versions",
        originalDateText: "Die Recensionen und Versionen des Eldad had-Dânî (1892)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The scholarly study that established the recensions; it dates the analysis.",
      },
      {
        sourceKey: "schloessinger_1908_ritual_eldad",
        startYear: 1908,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Edition of Eldad's ritual laws from manuscripts and a Genizah fragment",
        originalDateText: "The Ritual of Eldad ha-Dani … (1908)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later manuscript. The edition brings a Genizah fragment into the record; the fragment's own date is not established here (NEEDS SOURCE VERIFICATION).",
      },
    ],
    media: [pBenEzraGenizahEldad],
  },

  // =========================================================================
  // RADBAZ AND THE MODERN RULING
  // =========================================================================
  {
    slug: "radbaz-beta-israel-are-dan-and-the-1973-ruling",
    title: "Radbaz rules that Jews from Cush are 'of the tribe of Dan', and Rav Ovadia Yosef's ruling of 1973",
    summary:
      "In sixteenth-century Egypt, Rabbi David ibn Abi Zimra (Radbaz) ruled that captives from the land of Cush were Jews 'of the seed of Israel, of the tribe of Dan'. In 1973 Israel's Sephardi Chief Rabbi, Ovadia Yosef, relied chiefly on Radbaz to rule the Beta Israel Jews, opening the way to their immigration.",
    description:
      "THE RESPONSA. Radbaz (1479–1573), head of Egyptian Jewry, was asked about a woman brought as a captive from 'the land of Cush' after an attack in which the men were killed, bought by a Jew and the mother of his son: was she Jewish, and was the child a mamzer? He answered that 'it is clear that she is of the seed of Israel, of the tribe of Dan', but that their marriages, made without valid witnesses, resembled the Karaites', so no question of bastardy arose. A second responsum, on a slave bought from the same community, again treats them as Jews and their redemption as a duty (Responsa 4:219 and 7:9; NEEDS SOURCE VERIFICATION against a printed edition).\n\n" +
      "WHERE RADBAZ GOT DAN. He did not investigate Ethiopia; he relied on what was known, which in sixteenth-century Egypt meant the Eldad tradition and travellers' reports. His ruling turned a ninth-century tradition into law about real people.\n\n" +
      "THE MODERN CONSEQUENCE. In 1973 Rav Ovadia Yosef, Sephardi Chief Rabbi of Israel, 'basing himself mostly on the Radbaz', wrote that 'the Falasha are the descendants of the tribes of Yisrael who have emigrated southwards to Cush' and that those who 'declared them from amongst the tribe of Dan investigated and examined the evidence thoroughly'. The Ashkenazi Chief Rabbi Shlomo Goren concurred in 1974, and from 1975 the Israeli state applied the Law of Return. Rav Moshe Feinstein (1984) doubted that Radbaz knew the facts and required conversion; the rabbinate later required a symbolic conversion, which many in the community resented.\n\n" +
      DNE + " It establishes that the Danite identification became, through Radbaz, a legal finding, and that a twentieth-century ruling rested on it. It does NOT establish the historical truth of Danite descent: the rulings are halakhic judgements of status, made at a distance, on traditional evidence. It concerns Ethiopia only and has no bearing on West Africa.\n\n" +
      "THINGS TO ASK: Can a legal ruling that is right about who should be welcomed be wrong about where they came from?",
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["figure: dan (tribe)", "place: ethiopia", "theme: migration traditions"], "radbaz", "ovadia yosef", "halakha"),
    people: ["David ibn Abi Zimra (Radbaz)", "Ovadia Yosef", "Shlomo Goren", "Moshe Feinstein"],
    civilisations: ["Jews of Egypt", "Beta Israel", "Chief Rabbinate of Israel"],
    locationName: "Cairo (Radbaz) and Jerusalem (the 1973 ruling)",
    lat: 30.044,
    lng: 31.236,
    claims: [
      {
        sourceKey: "radbaz_responsa_ethiopian_jews",
        citations: [{ sourceKey: "etzion_ethiopian_jewry_halakha", relation: "supports", note: "Sets out both responsa and the 'tribe of Dan' wording." }],
        startYear: 1500,
        endYear: 1573,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Radbaz's responsa on Jews from the land of Cush",
        originalDateText: "It is clear that she is of the seed of Yisrael, of the tribe of Dan",
        datingMethod: "historical_record",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: contemporary written. The responsa were written in Radbaz's lifetime (1479–1573), most likely in Egypt; the exact year is not established here. They date a legal identification, not an ancient migration.",
      },
      {
        sourceKey: "etzion_ethiopian_jewry_halakha",
        citations: [{ sourceKey: "kaplan_1992_beta_israel", relation: "context", note: "Places the ruling in the history of the community's recognition." }],
        startYear: 1973,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Rav Ovadia Yosef's ruling that the Beta Israel are Jews descended from tribes that went to Cush",
        originalDateText: "the Falasha are the descendants of the tribes of Yisrael who have emigrated southwards to Cush",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The ruling's year as given in the Har Etzion study; quoted there in English translation. It establishes legal recognition, not descent.",
      },
    ],
    media: [pBetaIsrael1908Letter, pKahenWesternWall],
  },

  // =========================================================================
  // KEBRA NAGAST
  // =========================================================================
  {
    slug: "kebra-nagast-solomon-sheba-menelik-not-dan",
    title: "The Kebra Nagast: Solomon, Sheba and Menelik, a royal Israelite tradition that is not Danite",
    summary:
      "Ethiopia's royal epic, compiled in Ge'ez in the early fourteenth century, makes the kings of Ethiopia descendants of Solomon and the Queen of Sheba through Menelik, who brings the Ark of the Covenant to Aksum. It is an Israelite-descent tradition, but it concerns Judah's royal line and the Ark, not the tribe of Dan.",
    description:
      "WHAT THE SOURCE SAYS. The Kebra Nagast ('Glory of the Kings') tells how Makeda, Queen of Sheba, visited Solomon, bore his son Menelik, and how Menelik, visiting his father, returned to Ethiopia with the firstborn sons of Israel's nobles and, secretly, the Ark of the Covenant, so that the glory of Zion passed to Ethiopia. It legitimised the 'Solomonic' dynasty that took power in 1270.\n\n" +
      "THE DATE. Its colophon says it was translated from Coptic into Arabic in the 'year of mercy' 409 (AD 1225) and into Ge'ez by Yeshaq and colleagues under Ya'ibika Egzi', governor of Enderta; on this basis Conti Rossini, Littmann and others date the Ge'ez compilation to about 1314–1322. Many scholars doubt any Coptic original. Irfan Shahid (1976) argued that parts reflect sixth-century circumstances. Bezold edited the text (1905); Budge translated it into English (1922).\n\n" +
      "WHY IT IS KEPT APART HERE. It is easy to merge 'Israelite descent in Ethiopia' into one story. But the Kebra Nagast's Israelites are Solomon's son and the sons of Jerusalem's nobility, a JUDAHITE and royal tradition, claimed by the Christian monarchy; the Danite tradition comes from Eldad and Radbaz and was applied to the Jewish Beta Israel, the monarchy's religious rivals. Some Beta Israel traditions do link their ancestors to Menelik's companions, which is a third, distinct claim.\n\n" +
      DNE + " It establishes a fourteenth-century (or earlier) Ethiopian royal ideology of Israelite descent. It does NOT establish a migration of Israelites to Ethiopia, does NOT mention Dan as Ethiopia's ancestor, and contains no serpent cult linked to Dan. (Ethiopian tradition separately tells of a serpent-king, Arwe, killed before Sheba's reign; that story is not Danite either.)\n\n" +
      "THINGS TO ASK: Why might a Christian dynasty and a Jewish minority each claim Israel, but by different routes?",
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["place: ethiopia", "theme: kingship", "theme: manuscripts and their dates", "theme: migration traditions"], "kebra nagast", "solomonic dynasty"),
    people: ["Makeda, Queen of Sheba", "Solomon", "Menelik I", "Yeshaq of Aksum", "Ya'ibika Egzi'", "E. A. Wallis Budge", "Carl Bezold"],
    civilisations: ["Solomonic Ethiopia", "Aksum"],
    locationName: "Aksum, Tigray, Ethiopia",
    lat: 14.13,
    lng: 38.72,
    claims: [
      {
        sourceKey: "bezold_1905_kebra_nagast",
        citations: [{ sourceKey: "budge_1922_kebra_nagast", relation: "supports", note: "Translates the colophon naming Yeshaq and Ya'ibika Egzi'." }],
        startYear: 1314,
        endYear: 1322,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Ge'ez compilation of the Kebra Nagast",
        originalDateText: "Translated into Ge'ez by Yeshaq under Ya'ibika Egzi' of Enderta, c. 1314–1322",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: later manuscript. Dated from the colophon, preserved in manuscripts later than the compilation. It dates the text, not the events it narrates (the tenth century BCE in its own frame).",
      },
      {
        sourceKey: "budge_1922_kebra_nagast",
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "Menelik's journey with the Ark to Ethiopia",
        originalDateText: "In the days of Solomon, in the Kebra Nagast's own frame",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: religious tradition. The narrative sets its events in Solomon's reign; no independent evidence dates or confirms them, so no year is given.",
      },
      {
        sourceKey: "budge_1922_kebra_nagast",
        startYear: 1922,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "First English translation",
        originalDateText: "The Queen of Sheba and Her Only Son Menyelek (1922)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: modern interpretation. The translation through which most English readers know the text.",
      },
    ],
    media: [pSolomonSheba, pArkAxum],
  },

  // =========================================================================
  // MAGHREB, SAHARA, NIGER BEND
  // =========================================================================
  {
    slug: "genizah-merchants-maghreb-and-saharan-gold",
    title: "Jewish merchants of the Maghreb and the Saharan gold trade: what the Genizah and the Catalan Atlas show",
    summary:
      "Cairo Genizah letters of the tenth to thirteenth centuries document Jewish traders linking Egypt, Kairouan, Sicily, al-Andalus and the Maghreb, handling West African gold that arrived by Muslim caravan. In 1375 a Majorcan Jewish workshop mapped the Sahara routes to Timbuktu and Mali. Jews knew the trade; that is not the same as Jews crossing to the Gulf of Guinea.",
    description:
      "WHAT THE GENIZAH SHOWS. The storeroom of the Ben Ezra synagogue in Fustat preserved thousands of letters and accounts of Jewish merchants, studied by S. D. Goitein (A Mediterranean Society, 1967–1993) and Jessica Goldberg (2012). They document a network centred on Fustat, Kairouan and Mahdia, Palermo and the ports of al-Andalus and Morocco, dealing in textiles, spices, metals and gold. The Maghrebi oasis towns such as Sijilmasa, the northern terminus of the gold road, appear on its southern edge. The letters show Jews as part of the economy that received sub-Saharan gold, not, on the evidence found here, as caravan travellers to the Niger.\n\n" +
      "WHAT THE CATALAN ATLAS SHOWS. The map attributed to Abraham Cresques of Majorca (1375) marks the Draa valley route 'through which the merchants pass who go to the land of the Blacks of Guinea', Taghaza's salt, Timbuktu ('tenbuch') and the city of Mali, with Mansa Musa holding a gold nugget. Majorca's Jewish cartographers drew on North African informants; the map is evidence of knowledge flowing north, through a Jewish workshop.\n\n" +
      "CONTEXT. The Garamantes of the Fazzan had already traded across the Sahara in Roman times (see the Moors track); after the Arab conquest, Ibadi and Sunni Muslim merchants dominated the gold routes. Jewish participation is documented at the northern ends (Sijilmasa, Tlemcen, Tuat) and in the Mediterranean.\n\n" +
      DNE + " It establishes a medieval Jewish commercial world in North Africa with knowledge of, and profit from, the trans-Saharan trade. It does NOT establish Jewish settlement south of the Sahara before the fifteenth century, any route to the Bight of Benin (the gold came from Bambuk, Bure and the Akan fields, and went north), or any religious transmission. Long-distance trade is not migration.\n\n" +
      "THINGS TO ASK: Whose hands did the gold pass through between the goldfields and a Genizah merchant's ledger?",
    category: "history",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: trade routes", "place: sahara and niger bend"], "cairo genizah", "catalan atlas", "gold trade"),
    people: ["S. D. Goitein", "Jessica Goldberg", "Abraham Cresques", "Mansa Musa"],
    civilisations: ["Jews of the Maghreb and Egypt", "Fatimid and Zirid Ifriqiya", "Mali Empire", "Jews of Majorca"],
    locationName: "Fustat (Old Cairo), Kairouan, Sijilmasa and Majorca",
    lat: 30.006,
    lng: 31.23,
    claims: [
      {
        sourceKey: "goitein_1967_mediterranean_society",
        citations: [{ sourceKey: "goldberg_2012_geniza_merchants", relation: "supports", note: "Re-analyses the eleventh-century merchant letters and their geography." }],
        startYear: 950,
        endYear: 1250,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The documentary peak of the Genizah merchants' letters",
        originalDateText: "tenth to thirteenth centuries",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The letters are dated internally or by their writers' known careers. They establish trade networks; NEEDS SOURCE VERIFICATION for any specific letter naming Sahelian places.",
      },
      {
        sourceKey: "catalan_atlas_1375",
        startYear: 1375,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Catalan Atlas maps the routes to Timbuktu and Mali",
        originalDateText: "per aquest loch pasen los merchaders que entren en la terra del negres de Gineva",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. The atlas is dated 1375 and held by the BnF; the Catalan legend is quoted from the Commons transcription. It records Mediterranean knowledge of the routes, not who travelled them.",
      },
    ],
    media: [pCatalanSahara, pBenEzraGenizah, pSaharaRoutesEarly],
  },
  {
    slug: "tamentit-tuat-jews-and-al-maghili-1492",
    title: "Tamentit, 1490s: al-Maghili and the end of the Jewish community of the Tuat oases",
    summary:
      "The oases of Tuat and Gurara in the Algerian Sahara had a prosperous Jewish community with a synagogue at Tamentit, active in the caravan trade. Around 1490–1492 the Tlemcen jurist Muhammad al-Maghili campaigned against it; the synagogue was demolished and Jews were killed or fled. Leo Africanus dates it to the year of the Spanish expulsion.",
    description:
      "WHAT THE SOURCES SAY. Leo Africanus, writing in 1526, says of Tegorarin (Gurara, beside Tuat), a region with 'ordinarie traffique to the land of Negros': 'There were in times past many rich Iewes in this region, who by the meanes of a certaine Mahumetan preacher, were at length expelled, and a great part of them slaine by the seditious people; and that in the very same yeere when the Iewes were expelled out of Spaine and Sicily' (Pory's 1600 English). The preacher was Muhammad b. 'Abd al-Karim al-Maghili of Tlemcen, who argued that the Jews' synagogue at Tamentit violated the conditions of dhimma. Jurists in Fez and Tlemcen disagreed; al-Maghili obtained supporting opinions (including, it is reported, from al-Suyuti in Cairo), and his followers destroyed the synagogue. John Hunwick's study (2006) translates the legal exchanges.\n\n" +
      "WHY IT MATTERS. Tuat is the best-documented Jewish community in the Sahara itself, a node between the Maghreb and the Niger Bend. Its destruction is also the starting point of the Zakhor tradition in Timbuktu, which holds that Tuat's survivors fled south along the caravan routes.\n\n" +
      DNE + " It establishes a Saharan Jewish trading community, its destruction in the 1490s, and the role of a named jurist. It does NOT establish where the survivors went (beyond the generalities of conversion and flight), any link with Ethiopia or with the tribe of Dan (the Tuat Jews are not recorded as claiming Danite descent), or any presence on the Guinea coast.\n\n" +
      "THINGS TO ASK: Why did the same legal question about a synagogue divide the jurists of Fez and Tlemcen?",
    category: "history",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["place: sahara and niger bend", "theme: trade routes", "theme: migration traditions"], "tuat", "tamentit", "al-maghili"),
    people: ["Muhammad b. 'Abd al-Karim al-Maghili", "Leo Africanus (al-Hasan al-Wazzan)", "John Hunwick"],
    civilisations: ["Jews of Tuat", "Zayyanid Tlemcen", "Ksour of Tuat and Gurara"],
    locationName: "Tamentit, Tuat oases, Adrar province, Algeria",
    lat: 27.766,
    lng: -0.26,
    claims: [
      {
        sourceKey: "hunwick_2006_jews_saharan_oasis",
        citations: [{ sourceKey: "encyclopaedia_judaica_zakhor", relation: "context", note: "Dates the destruction to 1492 in the context of Zakhor's family traditions." }],
        startYear: 1490,
        endYear: 1492,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Al-Maghili's campaign and the destruction of the Tamentit synagogue",
        originalDateText: "about 895–897 AH / 1490–1492 CE",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Dated from the Arabic legal correspondence edited by Hunwick (NEEDS SOURCE VERIFICATION for the exact year, which secondary sources give as c. 1490 or 1492).",
      },
      {
        sourceKey: "leo_africanus_pory_brown_1896",
        startYear: 1492,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "The expulsion of the Jews of Gurara, as Leo Africanus dated it",
        originalDateText: "in the very same yeere when the Iewes were expelled out of Spaine and Sicily",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Leo wrote in 1526 about events a generation earlier, dating them by the Spanish expulsion; the synchronism may be approximate. Read in vol. 3, pp. 789–790, of Brown's edition.",
      },
    ],
    passages: [
      {
        label: "Leo Africanus on the Jews of Tegorarin",
        reference: "Description of Africa, book 6, 'Of the region of Tegorarin' (Brown ed., vol. 3, pp. 789–790)",
        sourceKey: "leo_africanus_pory_brown_1896",
        layers: [
          {
            layer: "translation",
            sourceKey: "leo_africanus_pory_brown_1896",
            language: "English (Early Modern)",
            content:
              "There were in times past many rich Iewes in this region, who by the meanes of a certaine Mahumetan preacher, were at length expelled, and a great part of them slaine by the seditious people; and that in the very same yeere when the Iewes were expelled out of Spaine and Sicily.",
            evidence: "John Pory's 1600 translation of Leo's Italian, copied from the archive.org scan of the 1896 Hakluyt edition. Leo knew the region in the 1510s.",
          },
        ],
      },
    ],
    media: [pTamentitKsar, pTamentitOasis, pSaharaRoutesBlanc],
  },
  {
    slug: "timbuktu-niger-bend-jews-excluded-and-admitted",
    title: "Timbuktu and the Niger Bend: Jews excluded under Songhay, admitted in 1858",
    summary:
      "Leo Africanus (1526) reports that the ruler of Timbuktu 'so deadly hateth all Iewes, that he will not admit any into his citie', and confiscated the goods of North African merchants who dealt with them, a policy tied to al-Maghili's advice to Askia Muhammad. The first documented Jewish residents were Moroccan traders under Rabbi Mordechai Abi Serour from 1858.",
    description:
      "WHAT THE SOURCES SAY. In his account of 'the kingdome of Tombuto', Leo Africanus, who visited the Niger Bend in the 1510s, says the king 'so deadly hateth all Iewes, that he will not admit any into his citie: and whatsoever Barbarie merchants he understandeth haue any dealings with the Iewes, he presently causeth their goods to be confiscate'. This matches the counsel of al-Maghili, who corresponded with Askia Muhammad of Songhay in the 1490s (the 'Replies' edited by Hunwick, 1985) and urged him against the Jews after Tuat. Robert Brown's 1896 note records that 'the exclusion of Jews from Timbuktu continued until the year 1858, when the late Rabbi Mordokhai Abi Serour, of Akka, succeeded in gaining permission to reside and trade in the city' (citing Beaumier, Bulletin de la Société de Géographie, 1870).\n\n" +
      "WHAT IS CLAIMED BEYOND THIS. Later writings, especially from the Zakhor movement and online, speak of Radhanite Jews in Timbuktu in the eighth century, a Jewish kingdom at Tindirma in 1402 (from the Tārīkh al-fattāsh, see the next record), and Sephardi refugees in the fourteenth and fifteenth centuries. These are not supported by contemporary documents seen here.\n\n" +
      DNE + " It establishes a documented exclusion of Jews from Songhay Timbuktu in the early sixteenth century, which implies Jewish merchants were trading with the region; and a documented Jewish trading presence from 1858. It does NOT establish a Jewish community at the Niger Bend before 1492, any Danite identity among Jews there, or any movement onward to the Gulf of Guinea, which was not part of the Timbuktu trading world's Jewish connections.\n\n" +
      "THINGS TO ASK: What does a ban on dealing with Jews tell you about who was dealing with them?",
    category: "history",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["place: sahara and niger bend", "theme: trade routes", "theme: kingship"], "timbuktu", "songhay", "abi serour"),
    people: ["Askia Muhammad I", "Muhammad al-Maghili", "Leo Africanus (al-Hasan al-Wazzan)", "Mordechai Abi Serour", "Heinrich Barth"],
    civilisations: ["Songhay Empire", "Jews of Morocco", "Timbuktu scholars and merchants"],
    locationName: "Timbuktu, Mali",
    lat: 16.775,
    lng: -3.009,
    claims: [
      {
        sourceKey: "leo_africanus_pory_brown_1896",
        citations: [{ sourceKey: "hunwick_1985_sharia_in_songhay", relation: "context", note: "Al-Maghili's correspondence with Askia Muhammad gives the policy its legal background." }],
        startYear: 1526,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Leo Africanus records the exclusion of Jews from Timbuktu",
        originalDateText: "He so deadly hateth all Iewes, that he will not admit any into his citie",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Leo completed his Description in 1526, describing what he learned on visits in the 1510s (vol. 3, p. 825 of Brown's edition). It establishes the policy in his time; its start is inferred from al-Maghili's activity in the 1490s.",
      },
      {
        sourceKey: "leo_africanus_pory_brown_1896",
        citations: [{ sourceKey: "haidara_1999_juifs_tombouctou", relation: "supports", note: "Collects nineteenth-century sources on Jewish trade at Timbuktu." }],
        startYear: 1858,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Mordechai Abi Serour obtains permission to reside and trade in Timbuktu",
        originalDateText: "until the year 1858, when the late Rabbi Mordokhai Abi Serour, of Akka, succeeded in gaining permission",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Robert Brown's 1896 editorial note, citing Beaumier (1870). Other secondary sources give 1859; the year NEEDS SOURCE VERIFICATION against Abi Serour's own account.",
      },
    ],
    passages: [
      {
        label: "Leo Africanus on Timbuktu and the Jews",
        reference: "Description of Africa, book 7, 'Of the kingdome of Tombuto' (Brown ed., vol. 3, p. 825)",
        sourceKey: "leo_africanus_pory_brown_1896",
        layers: [
          {
            layer: "translation",
            sourceKey: "leo_africanus_pory_brown_1896",
            language: "English (Early Modern)",
            content:
              "He so deadly hateth all Iewes, that he will not admit any into his citie: and whatsoeuer Barbarie merchants he vnderstandeth haue any dealings with the Iewes, he presently causeth their goods to be confiscate.",
            evidence: "Pory's 1600 English, copied from the archive.org scan with the OCR's punctuation corrected. 'He' is the king of Tombuto, i.e. the Songhay ruler's authority in the city.",
          },
        ],
      },
    ],
    media: [pBarthTimbuktu, pBarthCaravan, pCatalanMansaMusa],
  },
  {
    slug: "tarikh-al-fattash-bani-israil-a-nineteenth-century-text",
    title: "The Tārīkh al-fattāsh and its 'Bani Isra'il': a nineteenth-century rewriting, not a medieval witness",
    summary:
      "Passages describing Jewish 'Bani Isra'il' with seven princes and 333 wells at Tindirma in 1402, often quoted as proof of medieval Jews on the Niger, come from 'Manuscript C' of the chronicle edited in 1913. Nobili and Mathee (2015) show that this material belongs to a nineteenth-century work by Nūḥ b. al-Ṭāhir, written for the Caliphate of Ḥamdallāhi.",
    description:
      "THE TEXT AS PRINTED. In 1913 Octave Houdas and Maurice Delafosse published, as the 'Tarikh el-fettach' of Mahmud Kati, a chronicle of the Songhay empire built from several manuscripts. One of them, 'Manuscript C', contains material absent from the others, including (as widely reported) a passage on a community of 'Bani Isra'il' at Tindirma, near Timbuktu, with seven princes, 333 wells and an army, dated to 1402. That passage is the main textual support for a medieval Jewish polity on the Niger.\n\n" +
      "THE TEXTUAL HISTORY. Nehemia Levtzion (1971) showed that the bulk of the chronicle is a seventeenth-century work by Ibn al-Mukhtar, and that Manuscript C contains later additions. Mauro Nobili and Mohamed Shahid Mathee (2015), using manuscripts unknown to the editors, argue that the 1913 edition conflates two texts: the seventeenth-century Tārīkh ibn al-Mukhtār and a nineteenth-century work, the real 'Tārīkh al-fattāsh', preserved in Manuscript C and written by the Fulani scholar Nūḥ b. al-Ṭāhir to legitimise Aḥmad Lobbo's Caliphate of Ḥamdallāhi (Nobili 2020). The Manuscript C material, including the Bani Isra'il, therefore dates to the early nineteenth century.\n\n" +
      "CAUTION ON THIS RECORD. The French translation of 1913 was not found online in this session, so the exact wording and page of the Tindirma passage, and whether Nobili and Mathee discuss it by name, NEED SOURCE VERIFICATION. What is secure is the dating of the Manuscript C layer to which it belongs.\n\n" +
      DNE + " It establishes that a nineteenth-century West African text spoke of Jewish ancestors and communities in the Niger Bend, which is itself evidence of how that society imagined its past. It does NOT establish Jews at Tindirma in 1402: a text written four centuries later cannot prove that. It has nothing to do with Dan, and nothing to do with the Bight of Benin.\n\n" +
      "THINGS TO ASK: Why would a nineteenth-century caliphate want a chronicle that gave some families Jewish or non-Muslim origins?",
    category: "history",
    subcategory: SUB,
    eventType: "disputed",
    eventTypeNote: "A passage long read as fifteenth-century evidence, now assigned by textual scholarship to a nineteenth-century rewriting.",
    identificationStatus: "disputed",
    tags: serpentTags(LANE, ["theme: manuscripts and their dates", "place: sahara and niger bend", "theme: migration traditions"], "tarikh al-fattash", "bani israil", "forgery"),
    people: ["Nūḥ b. al-Ṭāhir al-Fulānī", "Aḥmad Lobbo", "Mahmud Kati (traditional author)", "Ibn al-Mukhtar", "Octave Houdas", "Maurice Delafosse", "Nehemia Levtzion", "Mauro Nobili", "Mohamed Shahid Mathee"],
    civilisations: ["Songhay Empire", "Caliphate of Ḥamdallāhi (Masina)"],
    locationName: "Timbuktu and Tindirma, Niger Bend, Mali",
    lat: 16.77,
    lng: -3.01,
    argumentsFor:
      "For reading the Bani Isra'il passage as evidence of medieval Jews: it gives a specific date (1402), place (Tindirma) and details (princes, wells, army); it is printed in the standard edition of a chronicle traditionally attributed to a sixteenth-century author, Mahmud Kati; Leo Africanus's report of a ban on Jews implies Jewish traders were known in the region.",
    argumentsAgainst:
      "Against: the passage is found in Manuscript C, which Levtzion (1971) already treated as containing later additions and which Nobili and Mathee (2015) identify as a nineteenth-century text by Nūḥ b. al-Ṭāhir, written for political purposes in Ḥamdallāhi; no earlier chronicle (the Tārīkh al-Sūdān, the seventeenth-century Tārīkh ibn al-Mukhtār) or Arabic geographer records a Jewish polity at Tindirma; and the round figures read as legend.",
    genealogies: [
      {
        key: "tindirma-bani-israil-1402",
        claim: "A Jewish community of the Bani Isra'il with seven princes lived at Tindirma in 1402",
        verdict: "source_disputed",
        verdictEvidence:
          "The only source is Manuscript C of the 1913 composite edition, a layer now dated to the early nineteenth century. No contemporary or earlier source attests the community.",
        whatWouldChangeThis:
          "A manuscript of the passage demonstrably copied before 1800, or an independent fifteenth-century source naming Jews at Tindirma.",
        links: [
          {
            stage: "colonial_record",
            who: "Octave Houdas and Maurice Delafosse",
            year: 1913,
            sourceKey: "houdas_delafosse_1913_tarikh_el_fettach",
            saysAbsentReason: "The French translation volume was not available in this session.",
            adds: "Prints Manuscript C material within a chronicle presented as sixteenth-century.",
            citationStatus: "unverified",
          },
          {
            stage: "early_scholarship",
            who: "Nehemia Levtzion",
            year: 1971,
            sourceKey: "levtzion_1971_tarikh_ibn_al_mukhtar",
            saysAbsentReason: "Not opened in this session; known from summaries.",
            adds: "Shows the main chronicle is Ibn al-Mukhtar's seventeenth-century work and treats Manuscript C as later.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Mauro Nobili and Mohamed Shahid Mathee",
            year: 2015,
            sourceKey: "nobili_mathee_2015_tarikh_al_fattash",
            saysAbsentReason: "Paraphrased from the abstract; the article was not opened.",
            adds: "Identifies Manuscript C as the nineteenth-century Tārīkh al-fattāsh of Nūḥ b. al-Ṭāhir.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "houdas_delafosse_1913_tarikh_el_fettach",
        citations: [{ sourceKey: "encyclopaedia_judaica_zakhor", relation: "context", note: "Repeats the Tendirma Jews from the 'Tarikh el-Fetash' as a sign of early settlement." }],
        startYear: 1402,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "Bani Isra'il at Tindirma, as the Manuscript C passage dates them",
        originalDateText: "Bani Isra'il at Tindirma in 1402 (Manuscript C)",
        datingMethod: "source_assertion",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: later manuscript. The date is asserted by a text now attributed to the early nineteenth century; it is the text's claim, not an established date. NEEDS SOURCE VERIFICATION for the exact wording in the 1913 edition.",
      },
      {
        sourceKey: "nobili_mathee_2015_tarikh_al_fattash",
        citations: [
          { sourceKey: "nobili_2020_sultan_caliph", relation: "supports", note: "Develops the attribution to Nūḥ b. al-Ṭāhir and the Ḥamdallāhi context." },
          { sourceKey: "levtzion_1971_tarikh_ibn_al_mukhtar", relation: "supports", note: "Earlier showed Manuscript C contains later material." },
        ],
        startYear: 1818,
        endYear: 1845,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Composition of the Manuscript C 'Tārīkh al-fattāsh' by Nūḥ b. al-Ṭāhir",
        originalDateText: "in the reign of Aḥmad Lobbo of Ḥamdallāhi, early nineteenth century",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Dated by the text's purpose and author within Aḥmad Lobbo's caliphate (founded 1818; he died 1845); the exact year of writing is not fixed here.",
      },
    ],
    media: [pFattashFolio1, pNigerRoutes1400],
  },
  {
    slug: "kati-family-jewish-ancestry-tradition",
    title: "The Kati family of Timbuktu and its tradition of Jewish ancestry",
    summary:
      "Descendants of the Kati family, keepers of the Fondo Kati library, trace themselves to 'Ali b. Ziyad al-Quti, who left Toledo in the 1460s, and, through the Zakhor association founded in 1993, some claim descent from Saharan Jews of Tuat who converted after 1492. These are family and community traditions, recorded in the late twentieth century.",
    description:
      "THE TRADITION. Ismaël Diadié Haïdara, historian and head of the Fondo Kati library in Timbuktu, holds that his family descends from 'Ali b. Ziyad al-Quti ('the Goth'), a Muslim of Toledo who emigrated to West Africa in 1467/8 and married into the Songhay elite; the chronicler Mahmud Kati is counted among his descendants. In 1993 Haïdara founded Zakhor, an association of Malians who 'recognize themselves as Jews' and declare descent from the Jews of Tuat; its founding families are named as the Levite Kehaths (now Kati), the Cohens and the Abanas. Zakhor's narrative: Tuat's survivors fled along the caravan routes after al-Maghili's persecution and, faced with Askia Muhammad's edict, 'converted' at the Niger.\n\n" +
      "HOW IT IS RECORDED. The tradition is set out in Haïdara's own writings and in the Encyclopaedia Judaica entry 'Zakhor' (2007), which reports it sympathetically and adds some loose claims (it puts Leo Africanus in the fifteenth century). The equation 'Kehath = Kati' is a family etymology. No document earlier than the twentieth century has been cited for the Jewish (as opposed to Andalusian) descent.\n\n" +
      DNE + " It establishes a living tradition of Jewish ancestry among some Timbuktu families, tied to the documented destruction of Tuat in the 1490s. It does NOT establish that the Kati family was Jewish, which rests on family memory and name-likeness; it involves no claim of Danite descent; and it does not extend to the Gulf of Guinea.\n\n" +
      "THINGS TO ASK: How should a historian treat a family tradition that is plausible, unprovable, and important to the people who hold it?",
    category: "religion",
    subcategory: SUB,
    eventType: "traditional_account",
    tags: serpentTags(LANE, ["theme: migration traditions", "place: sahara and niger bend", "theme: names and words"], "kati family", "zakhor", "fondo kati"),
    people: ["Ismaël Diadié Haïdara", "'Ali b. Ziyad al-Quti", "Mahmud Kati"],
    civilisations: ["Kati family of Timbuktu", "Zakhor association", "Jews of Tuat"],
    locationName: "Timbuktu, Mali",
    claims: [
      {
        sourceKey: "encyclopaedia_judaica_zakhor",
        citations: [{ sourceKey: "haidara_1999_juifs_tombouctou", relation: "context", note: "The founder's own collection of sources on Jewish trade at Timbuktu." }],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "Descent of the Kati, Cohen and Abana families from Saharan Jews",
        originalDateText: "Descended from the Jews of Touat; undated in the family tradition",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. A family and community tradition recorded in the 1990s. It establishes what the families hold; it does not establish when or whether the ancestors were Jews.",
      },
      {
        sourceKey: "encyclopaedia_judaica_zakhor",
        startYear: 1993,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Foundation of the Zakhor association in Timbuktu",
        originalDateText: "founded in Timbuktu in 1993 by the Malian historian Ismael Daidé Haïdara",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. The foundation date as the encyclopaedia records it; it dates the movement, not the ancestry.",
      },
      {
        sourceKey: "haidara_1999_juifs_tombouctou",
        startYear: 1467,
        endYear: 1468,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "'Ali b. Ziyad al-Quti leaves Toledo for West Africa, in the Kati family tradition",
        originalDateText: "left Toledo in 1467 or 1468",
        datingMethod: "genealogy",
        chronology: "traditional",
        evidence:
          "EVIDENCE TYPE: religious tradition. A family genealogy as presented by its modern heir; the documents in the Fondo Kati said to support it NEED SOURCE VERIFICATION. The tradition concerns an Andalusian Muslim ancestor, not a Jewish one.",
      },
    ],
    media: [pFattashFolio2, pBarthTimbuktu],
  },

  // =========================================================================
  // THE HYPOTHESES
  // =========================================================================
  {
    slug: "hypothesis-israelites-from-the-nile-to-the-niger",
    title: "Hypothesis: Israelites carried Hebrew customs from the Nile to the Niger and the Guinea coast",
    summary:
      "A diffusionist hypothesis, set out by Joseph J. Williams (1930) and taken up in Black Hebrew histories such as Rudolph Windsor's (1969), holds that Israelites, via Egypt, Nubia and the Sahel, brought Hebrew customs to West Africa. Some modern writers extend it to a Danite origin for the Gbe serpent Dan. No document, inscription or excavation supports the route.",
    description:
      "THE HYPOTHESIS. Israelites, including (in some versions) the tribe of Dan, moved from the Levant into Egypt, up the Nile into Kush, then westward along the Sahel to the Niger and on to the Gulf of Guinea, leaving 'Hebrewisms' in West African religion and, in the Danite version, the serpent name Dan among the Gbe.\n\n" +
      "WHO PROPOSES IT. Joseph J. Williams, S.J., Hebrewisms of West Africa: From Nile to Niger with the Jews (1930), argued from lists of resemblances (customs, words, the name Nyame and the Tetragrammaton) among the Asante especially, by way of diffusion across the Sudanic belt. Rudolph R. Windsor, From Babylon to Timbuktu (1969), popularised a Black Hebrew history of Israelite dispersal across Africa. Online and in some community histories, the coincidence of Hebrew Dan and Gbe dan ('snake') with Genesis 49:17 ('Dan shall be a serpent') is offered as a Danite trace in Bénin. An eighteenth-century version already appears in John Atkins (1735; see the vodun-diaspora record on Hueda speculation).\n\n" +
      "WHAT IT WOULD NEED. Each stage needs its own evidence: Egypt and Elephantine (documented); into Kush (not documented as a Jewish settlement); across the Sahel from the Nile to the Niger (no Jewish evidence for any period); to the Bight of Benin (none). The words and ritual lanes test the linguistic and ritual arguments.\n\n" +
      DNE + " It establishes that the hypothesis has a named history, from colonial-era ethnology to modern identity movements, which Tudor Parfitt (2013) traces as part of a long European habit of labelling African peoples 'Hebrew'. It does NOT establish any stage beyond Egypt: there is no Hebrew inscription, Jewish burial or Judaic object in Kush or the Sahel; Eldad's Danites are in the East; Gbe *dã is a regular inherited word for 'snake' with cognates across Gbe, while Hebrew Dan means 'judge'.\n\n" +
      "THINGS TO ASK: What would a single piece of physical evidence for this route look like, and where would one dig for it?",
    category: "religion",
    subcategory: SUB,
    eventType: "hypothesised",
    eventTypeNote: "A diffusionist hypothesis with named proponents; every stage after Egypt lacks evidence.",
    identificationStatus: "disputed",
    tags: serpentTags(LANE, ["figure: dan (tribe)", "figure: dan (vodun)", "theme: migration traditions", "theme: names and words", "place: napata and meroe", "place: savi and ouidah"], "hypothesis", "hebrewisms", "diffusionism"),
    people: ["Joseph J. Williams", "Rudolph R. Windsor", "Tudor Parfitt", "John Atkins"],
    civilisations: ["Israelites (proposed)", "Kush", "Sahelian states", "Asante", "Gbe-speaking peoples"],
    locationName: "Proposed route: Egypt, Nubia, the Sahel, the Niger and the Guinea coast",
    argumentsFor:
      "Proponents point to: real Jewish communities in Egypt and on the Kushite frontier (Elephantine); biblical images of Israelites in Cush; the Danite-in-Cush tradition of Eldad; customs in West Africa (circumcision, purity rules, sacrifice, Saturday or seventh-day observances) that resemble Israelite ones; and the identity of sound between Hebrew Dan and Gbe dan, together with Genesis 49:17, which calls Dan a serpent.",
    argumentsAgainst:
      "Against: the resemblances are widespread religious practices found across Africa and the world, not distinctive markers; no Hebrew, Aramaic or Judaic artefact or text has been found in Kush, the Sahel or the Guinea coast for the relevant periods; the Danite tradition places Dan in the East, never the West; Gbe dan is a regular inherited word for 'snake' and Dangbé a python cult, whereas Hebrew Dan means 'judge' and Genesis 49:17 names a viper; and the hypothesis grew from colonial-era diffusionism, which Parfitt shows labelled many unrelated peoples 'Hebrew'.",
    genealogies: [
      {
        key: "nile-to-niger-hebrews",
        claim: "Israelites (including Danites) migrated from the Nile to the Niger and gave West Africa its Hebrew-like customs and the serpent name Dan",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "The chain begins with real communities in Egypt and a real Danite-in-Cush tradition, but no primary evidence has been located for any step west of the Nile; the argument rests on resemblances and on the likeness of the word Dan.",
        whatWouldChangeThis:
          "A dated Judaic inscription or object from the Sahel or Guinea coast before 1500; an early Arabic or local source describing an Israelite people west of the Nile; a demonstrable loanword path from Hebrew into Gbe.",
        links: [
          {
            stage: "colonial_record",
            who: "John Atkins",
            year: 1735,
            saysAbsentReason: "Atkins's speculation is treated in the vodun-diaspora record on Hueda's serpents and Egypt or Israel; not re-quoted here.",
            adds: "An early European speculation that Hueda snake-worship derived from Mosaic or Egyptian practice.",
            citationStatus: "no_citation_given",
          },
          {
            stage: "early_scholarship",
            who: "Joseph J. Williams",
            year: 1930,
            sourceKey: "williams_1930_hebrewisms_west_africa",
            saysAbsentReason: "The book was not opened in this session; its thesis is summarised from its subtitle and contemporary notices.",
            adds: "Systematises a diffusion 'from Nile to Niger', with the Asante as the main case.",
            citationStatus: "unverified",
          },
          {
            stage: "community_history",
            who: "Rudolph R. Windsor",
            year: 1969,
            sourceKey: "windsor_1969_babylon_to_timbuktu",
            saysAbsentReason: "Not opened in this session.",
            adds: "Places the dispersal in a Black Hebrew history reaching Timbuktu and West Africa.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Tudor Parfitt",
            year: 2013,
            sourceKey: "parfitt_2013_black_jews",
            saysAbsentReason: "Summarised from the publisher's description and reviews.",
            adds: "Explains the hypothesis historically, as part of a long tradition of 'Judaising' African peoples.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "williams_1930_hebrewisms_west_africa",
        citations: [{ sourceKey: "parfitt_2013_black_jews", relation: "disputes", note: "Places Williams's method in the history of European 'Hebraising' of Africans." }],
        startYear: 1930,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of the classic statement of the Nile-to-Niger hypothesis",
        originalDateText: "Hebrewisms of West Africa: From Nile to Niger with the Jews (1930)",
        datingMethod: "historical_record",
        chronology: "hypothesis",
        evidence: "EVIDENCE TYPE: modern interpretation. Dates the hypothesis, not any migration.",
      },
      {
        sourceKey: "windsor_1969_babylon_to_timbuktu",
        citations: [{ sourceKey: "otzar_midrashim_1915_eldad", relation: "disputes", note: "The only early Danite tradition places Dan beyond the rivers of Cush, in the East." }],
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The proposed migration of Israelites from the Nile to the Niger",
        originalDateText: "In antiquity, undated by its proponents",
        datingMethod: "claimant_inference",
        chronology: "hypothesis",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Proponents give no date that any evidence supports; no year is placed on the timeline.",
      },
    ],
    media: [pSaharaRoutesBlanc, pNigerRoutes1400],
  },
  {
    slug: "hypothesis-tuat-and-songhay-jewish-refugees-reach-the-guinea-coast",
    title: "Hypothesis: Jewish refugees from Tuat and Songhay carried their traditions south to the Guinea coast",
    summary:
      "From the documented expulsions of the 1490s, some modern writers extend the Zakhor tradition (that Tuat's Jews fled to the Niger and converted) further south, to the forest and the coast, sometimes linking it to Gbe religion. The northern half of the story is documented; the southward extension has no source.",
    description:
      "THE HYPOTHESIS. After al-Maghili's campaign at Tamentit (c. 1490–1492) and the Songhay exclusion of Jews, Jewish or crypto-Jewish refugees went south from the Niger Bend into the savanna and forest, reaching the Gulf of Guinea and contributing to coastal religion.\n\n" +
      "WHO PROPOSES WHAT. Ismaël Diadié Haïdara and the Zakhor association (1990s) hold only the first step: survivors of Tuat reached the Niger and converted there ('the Jews could not go further, in front of the great Nile of the Arabs'). The further step to the coast is found in popular and online writing, often fused with the separate Danite-in-Bénin claim, without named scholarly proponents; it is recorded here so that it can be judged rather than circulate unexamined.\n\n" +
      "WHAT IS DOCUMENTED, STAGE BY STAGE. Tuat Jews and their destruction: documented (Leo Africanus; al-Maghili's correspondence; Hunwick). Exclusion of Jews from Songhay: documented (Leo). Converts along the Niger: family tradition, recorded in the twentieth century. Any movement from the Niger to the Bight of Benin: no source. The Hueda and Allada kingdoms, and Dangbé's cult, are described by Europeans from the seventeenth century with no mention of Jews or Jewish practice.\n\n" +
      DNE + " It establishes the documented northern events from which the hypothesis starts. It does NOT establish any refugee movement south of the Niger Bend, any Jewish element in Gbe religion, or any link to the tribe of Dan. Even Zakhor's own tradition stops at the Niger.\n\n" +
      "THINGS TO ASK: Where does a tradition's own account stop, and who extended it further?",
    category: "history",
    subcategory: SUB,
    eventType: "hypothesised",
    eventTypeNote: "A modern extension of a documented expulsion and a recorded family tradition; the southward stage has no source and no named scholarly proponent.",
    identificationStatus: "disputed",
    tags: serpentTags(LANE, ["theme: migration traditions", "theme: trade routes", "place: sahara and niger bend", "place: savi and ouidah"], "hypothesis", "refugees", "tuat"),
    people: ["Muhammad al-Maghili", "Askia Muhammad I", "Ismaël Diadié Haïdara"],
    civilisations: ["Jews of Tuat", "Songhay Empire", "Zakhor association", "Hueda", "Allada"],
    locationName: "Proposed route: Tuat, the Niger Bend and the Bight of Benin",
    argumentsFor:
      "For the hypothesis: the expulsions of the 1490s are real and dated; refugees had to go somewhere, and the caravan routes led south to the Niger; Zakhor families preserve a memory of Jewish descent at the Niger; trade linked the Niger Bend with the forest zone (kola, gold) in later centuries, so movement south was physically possible.",
    argumentsAgainst:
      "Against: no source describes Jewish refugees south of the Niger Bend; Zakhor's own narrative ends with conversion at the Niger; seventeenth- and eighteenth-century European accounts of Allada and Hueda, which describe their religion at length (Bosman, Barbot, Labat), report no Jews or Jewish practice; Dangbé's cult is already established when first described; and the movement of people between the Niger and the Bight of Benin is undocumented for the 1490s–1500s.",
    genealogies: [
      {
        key: "tuat-refugees-to-guinea-coast",
        claim: "Jews expelled from Tuat and Songhay in the 1490s reached the Guinea coast and influenced its religion",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "The expulsions are documented and a Niger Bend tradition of converted Jews exists, but no source of any kind carries the story south of the Niger.",
        whatWouldChangeThis:
          "A sixteenth- or seventeenth-century source (Arabic, Portuguese or local) describing Jews or converts in the forest or coastal states; Judaic material culture in a dated coastal context.",
        links: [
          {
            stage: "colonial_record",
            who: "Leo Africanus",
            year: 1526,
            sourceKey: "leo_africanus_pory_brown_1896",
            reference: "vol. 3, pp. 789–790 and 825",
            says: "many rich Iewes in this region, who by the meanes of a certaine Mahumetan preacher, were at length expelled",
            adds: "Documents the Gurara/Tuat expulsion and the Timbuktu exclusion.",
            citationStatus: "verified",
          },
          {
            stage: "community_history",
            who: "Ismaël Diadié Haïdara and Zakhor",
            year: 1996,
            sourceKey: "encyclopaedia_judaica_zakhor",
            says: "the Jews could not go further, in front of the great Nile of the Arabs … They converted.",
            adds: "Carries Tuat's survivors to the Niger Bend and their conversion, and stops there.",
            citationStatus: "verified",
          },
          {
            stage: "popular_claim",
            who: "Online and popular writing (no named scholarly proponent found)",
            saysAbsentReason: "No citable publication making the southward claim was identified in this session.",
            adds: "Extends the route from the Niger to the Bight of Benin and sometimes to the Gbe serpent Dan.",
            citationStatus: "no_citation_given",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "hunwick_2006_jews_saharan_oasis",
        citations: [{ sourceKey: "leo_africanus_pory_brown_1896", relation: "supports", note: "Leo dates the Gurara expulsion to the year of the Spanish expulsion." }],
        startYear: 1490,
        endYear: 1500,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The documented expulsions from which the hypothesis starts",
        originalDateText: "the 1490s, in Tuat and Songhay",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. Dates the expulsions, which are documented; it does not date or support any movement south.",
      },
      {
        sourceKey: "encyclopaedia_judaica_zakhor",
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "Arrival of Jewish refugees on the Guinea coast",
        originalDateText: "No date: the arrival is asserted without a source",
        datingMethod: "claimant_inference",
        chronology: "hypothesis",
        evidence: "EVIDENCE TYPE: modern interpretation. No source places refugees south of the Niger, so no date can be given.",
      },
    ],
    media: [pTamentitKsar, pSaharaRoutesEarly],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const links: SeedEventLink[] = [
  // ---- inside the lane ---------------------------------------------------------------
  { from: "elephantine-judean-garrison-and-temple-of-yhw", to: ANCHOR, relation: "evidence_for", note: "The oldest documented Jewish community in Africa, the anchor's first case." },
  { from: "elephantine-temple-destroyed-410-bce-petition-to-bagohi", to: "elephantine-judean-garrison-and-temple-of-yhw", relation: "part_of", note: "The destruction and petition belong to the history of the same temple." },
  { from: "jews-in-egypt-and-on-the-nubian-frontier", to: "elephantine-judean-garrison-and-temple-of-yhw", relation: "related", note: "Herodotus and Aristeas explain why soldiers were stationed at Elephantine." },
  { from: "jews-in-egypt-and-on-the-nubian-frontier", to: "eldad-ha-dani-dan-in-the-land-of-cush", relation: "source_of", note: "Zephaniah's 'beyond the rivers of Cush' is quoted in the Kairouan letter." },
  { from: "jews-in-egypt-and-on-the-nubian-frontier", to: ANCHOR, relation: "evidence_for", note: "Documents Jews on Egypt's frontier but not inside Kush." },
  { from: "eldad-ha-dani-dan-in-the-land-of-cush", to: ANCHOR, relation: "evidence_for", note: "The earliest Danite-in-Africa tradition, dated to the 880s." },
  { from: "eldad-ha-dani-recensions-and-interpolations", to: "eldad-ha-dani-dan-in-the-land-of-cush", relation: "responds_to", note: "Shows which parts of Eldad's account are early and which were added by copyists." },
  { from: "eldad-ha-dani-dan-in-the-land-of-cush", to: "radbaz-beta-israel-are-dan-and-the-1973-ruling", relation: "precedes", note: "Radbaz's identification of Ethiopian Jews with Dan rests on the Eldad tradition." },
  { from: "radbaz-beta-israel-are-dan-and-the-1973-ruling", to: "beta-israel-origins-debate", relation: "relevant", note: "The legal identification that the historical debate weighs against other evidence." },
  { from: "beta-israel-origins-debate", to: ANCHOR, relation: "evidence_for", note: "The Ethiopian case, where a Danite tradition attaches to a real community." },
  { from: "kebra-nagast-solomon-sheba-menelik-not-dan", to: "beta-israel-origins-debate", relation: "relevant", note: "A different Israelite-descent tradition, Judahite and royal, kept apart from the Danite one." },
  { from: "kebra-nagast-solomon-sheba-menelik-not-dan", to: "eldad-ha-dani-dan-in-the-land-of-cush", relation: "related", note: "Two Israel-in-Ethiopia traditions with different tribes, dates and purposes." },
  { from: "genizah-merchants-maghreb-and-saharan-gold", to: "eldad-ha-dani-dan-in-the-land-of-cush", relation: "related", note: "Kairouan, where Eldad was received, was a hub of the Genizah merchants' world." },
  { from: "genizah-merchants-maghreb-and-saharan-gold", to: "tamentit-tuat-jews-and-al-maghili-1492", relation: "precedes", note: "Medieval Jewish trade at the northern end of the gold routes, of which Tuat was a later Saharan node." },
  { from: "tamentit-tuat-jews-and-al-maghili-1492", to: "timbuktu-niger-bend-jews-excluded-and-admitted", relation: "precedes", note: "Al-Maghili moved from Tuat to advise the Songhay ruler against the Jews." },
  { from: "timbuktu-niger-bend-jews-excluded-and-admitted", to: "tarikh-al-fattash-bani-israil-a-nineteenth-century-text", relation: "related", note: "The chronicle's Tindirma passage is the main claim for Jews at the Niger Bend before 1492." },
  { from: "tarikh-al-fattash-bani-israil-a-nineteenth-century-text", to: "kati-family-jewish-ancestry-tradition", relation: "related", note: "The chronicle is attributed to Mahmud Kati, ancestor of the family whose tradition this is." },
  { from: "kati-family-jewish-ancestry-tradition", to: "tamentit-tuat-jews-and-al-maghili-1492", relation: "responds_to", note: "Zakhor traces its families to Tuat's survivors." },
  { from: "hypothesis-tuat-and-songhay-jewish-refugees-reach-the-guinea-coast", to: "kati-family-jewish-ancestry-tradition", relation: "responds_to", note: "Extends the Zakhor tradition beyond where the tradition itself stops." },
  { from: "hypothesis-tuat-and-songhay-jewish-refugees-reach-the-guinea-coast", to: "tamentit-tuat-jews-and-al-maghili-1492", relation: "responds_to", note: "Starts from the documented destruction of the Tuat community." },
  { from: "hypothesis-israelites-from-the-nile-to-the-niger", to: "jews-in-egypt-and-on-the-nubian-frontier", relation: "responds_to", note: "Uses the documented Egyptian stage as the first step of an undocumented route." },
  { from: "hypothesis-israelites-from-the-nile-to-the-niger", to: "eldad-ha-dani-dan-in-the-land-of-cush", relation: "responds_to", note: "Draws on the Danite-in-Cush tradition, which in fact places Dan in the East." },
  { from: "hypothesis-israelites-from-the-nile-to-the-niger", to: ANCHOR, relation: "relevant", note: "The anchor sets out why no stage beyond Egypt is documented." },
  { from: "hypothesis-tuat-and-songhay-jewish-refugees-reach-the-guinea-coast", to: ANCHOR, relation: "relevant", note: "The anchor separates the documented expulsions from the undocumented southward movement." },
  { from: "tarikh-al-fattash-bani-israil-a-nineteenth-century-text", to: ANCHOR, relation: "relevant", note: "Shows why a late text cannot be used as early evidence of Jews in West Africa." },

  // ---- to the other lanes' anchors --------------------------------------------------
  { from: ANCHOR, to: A.dan, relation: "responds_to", note: "Asks where the biblical tribe described in the Dan lane is said to have gone." },
  { from: ANCHOR, to: A.gbe, relation: "relevant", note: "The Gbe serpent Dan, which the Danite hypotheses try to reach." },
  { from: ANCHOR, to: A.routes, relation: "relevant", note: "The routes lane assesses Routes A–C, for which this lane supplies the documented communities." },
  { from: ANCHOR, to: A.assessment, relation: "evidence_for", note: "Supplies the evidence for the conclusion's 'Jewish migration' and 'direct Danite migration' hypotheses." },
  { from: "hypothesis-israelites-from-the-nile-to-the-niger", to: A.words, relation: "relevant", note: "The likeness of Hebrew Dan and Gbe dan is tested in the words lane." },
  { from: "hypothesis-israelites-from-the-nile-to-the-niger", to: A.kush, relation: "relevant", note: "The hypothesis needs a Jewish presence in Kush that the Kushite evidence does not show." },
  { from: "jews-in-egypt-and-on-the-nubian-frontier", to: A.kush, relation: "related", note: "The Kush of the biblical and Aramaic texts is the kingdom of Napata and Meroë." },
  { from: "elephantine-judean-garrison-and-temple-of-yhw", to: A.egypt, relation: "related", note: "The Judean temple stood beside the temple of the Egyptian ram god Khnum, whose priests had it destroyed." },
  { from: "eldad-ha-dani-dan-in-the-land-of-cush", to: A.dan, relation: "responds_to", note: "A ninth-century answer to the question of where the northern tribe of Dan went." },
  { from: "hypothesis-tuat-and-songhay-jewish-refugees-reach-the-guinea-coast", to: A.gbe, relation: "relevant", note: "The coastal Gbe traditions where the hypothesis would have to end." },
  { from: "hypothesis-israelites-from-the-nile-to-the-niger", to: A.rituals, relation: "relevant", note: "The ritual resemblances proponents cite are weighed in the rituals lane." },

  // ---- to records other datasets already seed ---------------------------------------
  { from: "genizah-merchants-maghreb-and-saharan-gold", to: "trans-saharan-exchange-garamantes", relation: "related", note: "Trans-Saharan exchange already existed in Garamantian times, long before the Jewish merchants of the Genizah." },
  { from: "genizah-merchants-maghreb-and-saharan-gold", to: "dromedary-in-north-africa", relation: "relevant", note: "The camel made the medieval caravan trade possible." },
  { from: "hypothesis-israelites-from-the-nile-to-the-niger", to: "garamantes-and-sub-saharan-africa", relation: "relevant", note: "The documented ancient contacts across the Sahara, which carried goods, not a recorded Israelite migration." },
  { from: "eldad-ha-dani-dan-in-the-land-of-cush", to: "foundation-of-kairouan", relation: "related", note: "The city whose Jewish community received Eldad was founded in the 670s." },
  { from: "hypothesis-israelites-from-the-nile-to-the-niger", to: "hueda-serpents-egypt-and-israel-speculation", relation: "related", note: "The eighteenth-century European speculation that Hueda's serpents came from Egypt or Israel is an early form of this hypothesis." },
  { from: "hypothesis-israelites-from-the-nile-to-the-niger", to: "egyptian-origin-theory-for-vodun-and-orisha", relation: "related", note: "A parallel derivation theory for West African religion, with a similar genealogy." },
  { from: "hypothesis-israelites-from-the-nile-to-the-niger", to: "resemblance-is-not-descent", relation: "responds_to", note: "The hypothesis rests on resemblances, which this record sets a standard for." },
  { from: "hypothesis-israelites-from-the-nile-to-the-niger", to: "dan-the-serpent", relation: "relevant", note: "The Gbe vodun Dan, whose name the Danite version tries to explain." },
  { from: "hypothesis-tuat-and-songhay-jewish-refugees-reach-the-guinea-coast", to: "bosman-describes-the-serpent-at-whydah", relation: "relevant", note: "Bosman's detailed account of Hueda religion before 1704 reports no Jews or Jewish practice." },
  { from: "hypothesis-tuat-and-songhay-jewish-refugees-reach-the-guinea-coast", to: "aja-and-the-tado-tradition", relation: "relevant", note: "The Gbe peoples' own origin traditions point to Tado, not to the Sahara or the Nile." },
  { from: ANCHOR, to: "serpent-is-not-one-symbol", relation: "relevant", note: "The Danite traditions involve no serpent; a serpent link would have to be argued separately." },
  { from: "tamentit-tuat-jews-and-al-maghili-1492", to: "trans-saharan-exchange-garamantes", relation: "related", note: "Tuat lay on the later successors of the Saharan routes the Garamantes had used." },
];

export const AFRICAN_JEWISH: SerpentSection = { sources, events, links };
