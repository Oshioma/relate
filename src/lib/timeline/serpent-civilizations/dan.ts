// LANE: dan — "The tribe of Dan and Israelite serpent traditions".
//
// WHAT THIS SECTION IS FOR. The track asks whether the biblical tribe of Dan,
// Egyptian and Kushite serpent religion and the Dan/Dangbé traditions of the
// Gbe coast share any demonstrable connection. This lane sets out the Israelite
// end of that question as the sources actually stand: the biblical texts (each
// with its own composition date, kept apart from the date of what it narrates),
// the excavations at Tel Dan, the Tel Dan Stele, Nehushtan and the Timna
// serpent, Ugaritic serpent texts, the Denyen hypothesis and the end of the
// northern kingdom.
//
// HOW IT WAS RESEARCHED (2026-10-19). The Hebrew is the Westminster Leningrad
// Codex as encoded by the Open Scriptures Hebrew Bible (morphhb), extracted
// verse by verse; the English is the KJV text. Read in full in this session:
// Yadin (1968) in the Australian Journal of Biblical Archaeology; Greer's 2014
// Bible and Interpretation essay summarising Dinner at Dan; the stratigraphy
// table of the Nelson Glueck School's Tel Dan page; the BAS summary of Greer's
// BAR column; Bava Batra 109b and Bamidbar Rabbah 2:7 on Sefaria; the Timna
// pages of the Israel MFA (via the Jewish Virtual Library) and the BAS image
// caption of the Timna serpent. Biran (1994), Greer (2013) in full, Arie
// (2008), Pardee (2002), Wyatt (2002), Rothenberg (1972) and the Assyrian
// editions were identified through catalogue records, abstracts and reviews
// but not opened; statements resting on them say NEEDS SOURCE VERIFICATION
// where a detail (page, line, exact wording) was not seen. Every picture's
// Commons file page was fetched and its licence and creator copied from it.
//
// WHAT THIS SECTION WILL NOT DO. Treat a biblical narrative as an excavation
// report; date an event by a text written centuries later; read a serpent in
// Genesis 49 as evidence of a serpent cult at Dan; or treat the shared sound
// of "Dan" (Hebrew) and "Dan" (Gbe) as anything but a coincidence until
// someone shows otherwise.

import type { SeedEvent, SeedEventLink, SeedSource } from "../seed-types";
import { SERPENT_LANES, SERPENT_LANE_ANCHORS, bce, commonsPicture, serpentTags, type SerpentSection } from "./shared";

const LANE = "dan" as const;
const SUB = SERPENT_LANES[LANE];
const ANCHOR = SERPENT_LANE_ANCHORS.dan;
const A = SERPENT_LANE_ANCHORS;

const TEL_DAN = { locationName: "Tel Dan (Tell el-Qadi), northern Israel", lat: 33.2486, lng: 35.6525 } as const;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // ---- Texts ------------------------------------------------------------------
  {
    key: "wlc_hebrew_bible",
    title: "Westminster Leningrad Codex",
    author: "J. Alan Groves Center for Advanced Biblical Research (digital text of the Leningrad Codex)",
    publisher: "Open Scriptures Hebrew Bible (morphhb), public domain",
    reference: "Books Gen, Num, Judg, 1Kgs, 2Kgs, Isa, Deut of the morphhb WLC XML; verses extracted in this session",
    url: "https://github.com/openscriptures/morphhb",
    sourceType: "religious_text",
    publishedYear: 1008,
    publishedDisplay: "manuscript 1008–1009 CE; digital text 1987–",
    notes:
      "Cited for the Hebrew text of every verse quoted in this lane (Gen 30:6; 49:16–17; Judg 5:17; 18:29–31; Num 21:6–9; 1 Kgs 12:28–30; 2 Kgs 15:29; 18:4; Isa 27:1). It is the text of ONE manuscript, the Leningrad Codex of 1008–1009 CE, the oldest complete Masoretic Bible: a late witness to texts composed many centuries earlier, and its date is not the date of their composition.",
  },
  {
    key: "kjv_bible",
    title: "The Holy Bible, King James Version",
    author: "King James translators (1611; standard 1769 Oxford text)",
    reference: "Verses read via bible-api.com (KJV) in this session",
    url: "https://bible-api.com/",
    sourceType: "religious_text",
    publishedYear: 1611,
    publishedDisplay: "1611; standard text 1769",
    notes:
      "Cited for the public-domain English of the verses quoted, as a translation layer beside the Hebrew. VIEWPOINT: a seventeenth-century Protestant translation; where its renderings ('adder', 'brasen', 'Manasseh') carry an interpretation, the record says so.",
  },
  {
    key: "cross_freedman_1975_yahwistic_poetry",
    title: "Studies in Ancient Yahwistic Poetry",
    author: "Frank Moore Cross and David Noel Freedman",
    publisher: "Scholars Press, Missoula (SBL Dissertation Series 21); first written as a 1950 dissertation",
    reference: "Chapters on the Blessing of Jacob (Gen 49) and the Song of Deborah (Judg 5)",
    sourceType: "academic_book",
    publishedYear: 1975,
    publishedDisplay: "1975 (dissertation 1950)",
    notes:
      "Cited as the classic statement of the EARLY dating of Hebrew poems such as Genesis 49 and Judges 5 (late second / early first millennium BCE) on grounds of archaic grammar and orthography. VIEWPOINT: one side of a continuing debate; later scholars date some of this poetry much later. Not opened in this session; cited at chapter level.",
  },
  {
    key: "schmid_2012_ot_literary_history",
    title: "The Old Testament: A Literary History",
    author: "Konrad Schmid",
    publisher: "Fortress Press, Minneapolis (translated by Linda M. Maloney)",
    reference: "Chapters on the Assyrian and Babylonian periods (the Deuteronomistic books; the Pentateuchal sources)",
    sourceType: "academic_book",
    publishedYear: 2012,
    publishedDisplay: "2012 (German 2008)",
    notes:
      "Cited for the mainstream critical frame used here for COMPOSITION dates: Judges and Kings as parts of a Deuteronomistic history edited in the late seventh and sixth centuries BCE from older materials, and the Pentateuch reaching its final form in the Persian period. VIEWPOINT: European critical scholarship; dates are ranges and are argued, not measured. Not opened in this session; cited at chapter level.",
  },
  {
    key: "bava_batra_109b",
    title: "Babylonian Talmud, Bava Batra 109b (William Davidson edition)",
    publisher: "Sefaria",
    reference: "Bava Batra 109b, on Judges 17:7 and 18:30",
    url: "https://www.sefaria.org/Bava_Batra.109b",
    sourceType: "religious_text",
    publishedYear: 500,
    publishedDisplay: "redacted c. 500–600 CE; English translation 2017",
    notes:
      "Cited for the rabbinic explanation of Judges 18:30: Jonathan was the son of Moses, 'but because he acted as Manasseh the king of Judah... acted, the verse linked him to Manasseh'. Read on Sefaria in this session. VIEWPOINT: a late-antique rabbinic reading, not an independent witness to the Danite priesthood.",
  },
  {
    key: "numbers_rabbah_2_7",
    title: "Bamidbar (Numbers) Rabbah 2:7",
    publisher: "Sefaria",
    reference: "Numbers Rabbah 2:7, on the tribal banners of Numbers 2:2",
    url: "https://www.sefaria.org/Bamidbar_Rabbah.2.7",
    sourceType: "religious_text",
    publishedYear: 1150,
    publishedDisplay: "medieval midrash; this part usually dated to the 12th century CE",
    notes:
      "Cited for the medieval tradition that Dan's banner was sapphire-coloured 'with a serpent depicted on it, after the verse \"Dan shall be a serpent\" (Gen 49:17)'. Hebrew read on Sefaria in this session. It is the source of the modern 'serpent emblem of Dan' and is about two thousand years later than any tribe of Dan; the date given for its compilation is approximate and NEEDS SOURCE VERIFICATION.",
  },

  // ---- Tel Dan ----------------------------------------------------------------
  {
    key: "biran_1994_biblical_dan",
    title: "Biblical Dan",
    author: "Avraham Biran",
    publisher: "Israel Exploration Society and Hebrew Union College–Jewish Institute of Religion, Jerusalem",
    reference: "The chapters on the Iron Age sacred precinct (Area T), the gates, and the postscript on the stele",
    sourceType: "archaeological",
    publishedYear: 1994,
    publishedDisplay: "1994",
    notes:
      "THE EXCAVATOR'S OWN SYNTHESIS of 1966–1993, cited for the sacred precinct (the 'high place' or bamah, its phases, the horned altar, small altars and implements), Biran's identification of it with Jeroboam's sanctuary of 1 Kings 12, and the find of the stele. VIEWPOINT: the excavator, who read the site through the biblical text. Not opened in this session; specific pages and descriptions are NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "ngsba_tel_dan_strata",
    title: "Tel Dan (excavation page and stratigraphic table)",
    author: "Nelson Glueck School of Biblical Archaeology, Hebrew Union College–Jewish Institute of Religion",
    url: "https://ngsba.org/excavations/tel-dan/",
    sourceType: "archaeological",
    publishedYear: 2020,
    publishedDisplay: "page dated 2020",
    notes:
      "Cited as the excavating institution's current summary, read in full in this session: 33 seasons from 1966; the table of strata, which lists for Stratum IVA (Iron IIA, 9th century BCE, 'Bamah A') 'High Place; snake pithoi, oil press, faience figurines'; Stratum IIIB (late 9th century, Bamah B) with the 'House of David inscription'; destruction 'sometime after 750 BCE... probably wrought by one of the invading Assyrian armies', with 'no reference to Dan's destruction' by Tiglath-pileser III in the Bible or his annals; and Stratum V (11th century) with 'Sea People pottery'.",
  },
  {
    key: "arie_2008_tel_dan_strata",
    title: "Reconsidering the Iron Age II Strata at Tel Dan: Archaeological and Historical Implications",
    author: "Eran Arie",
    publisher: "Tel Aviv: Journal of the Institute of Archaeology of Tel Aviv University 35 (1)",
    reference: "Tel Aviv 35 (2008)",
    url: "https://www.academia.edu/1880738/Reconsidering_the_Iron_Age_II_Strata_at_Tel_Dan_Archaeological_and_Historical_Implications",
    sourceType: "academic_paper",
    publishedYear: 2008,
    publishedDisplay: "2008",
    notes:
      "Cited for the LOWER chronology of the Tel Dan sequence: Dan deserted or a small rural site in Iron IIA, and Stratum IVA down-dated to the end of the 9th / beginning of the 8th century BCE, with consequences for any link between the precinct and Jeroboam I. Known here from the abstract and from Greer's 2014 summary ('contra Arie 2008'); the article was not opened. NEEDS SOURCE VERIFICATION for page-level detail.",
  },
  {
    key: "greer_2013_dinner_at_dan",
    title: "Dinner at Dan: Biblical and Archaeological Evidence for Sacred Feasts at Iron Age II Tel Dan and Their Significance",
    author: "Jonathan S. Greer",
    publisher: "Brill, Leiden (Culture and History of the Ancient Near East); open access",
    reference: "Ch. 3, 'Archaeological Evidence of Sacred Feasts at Tel Dan', pp. 43–96; the section 'The Priestly Portions'",
    url: "https://library.oapen.org/handle/20.500.12657/86580",
    sourceType: "academic_book",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for the analysis of previously unpublished faunal and ceramic deposits from Area T, dated 'primarily to the 9th and 8th centuries B.C.E.', and the contrast between the western chambers and the courtyard (right-sided limb bones, phalanges, sheep/goat share, painted wares). The OAPEN copy sat behind a bot check in this session and was not opened; the figures are taken from Greer's own 2014 summary (greer_2014_israelite_sacrifice_tel_dan).",
  },
  {
    key: "greer_2014_israelite_sacrifice_tel_dan",
    title: "Was 'Israelite' Sacrifice Practiced at Tel Dan?",
    author: "Jonathan S. Greer",
    publisher: "The Bible and Interpretation (University of Arizona)",
    reference: "Essay, January 2014, 10 pp.",
    url: "https://bibleinterp.arizona.edu/sites/bibleinterp.arizona.edu/files/docs/was%20israelite.pdf",
    sourceType: "academic_paper",
    publishedYear: 2014,
    publishedDisplay: "January 2014",
    notes:
      "Read in full in this session. Cited for Greer's own figures: deposit WD2 in the western chambers had '67% right-sided and 33% left-sided' meaty sheep/goat limb bones against '37% right-sided and 63% left-sided' in the courtyard; 'toe bones' 26–63% against 4–17%; sheep and goat 80% against 74%; painted wares 11–25% against 0–6%. Also for his statement of the two problems (the date of the priestly texts; whether such rites were unique to Israel) and for the alternative that the cult honoured Hadad (Noll 1998; Athas 2003; cf. Arie 2008). VIEWPOINT: Greer argues for an Israelite cult and says so.",
  },
  {
    key: "bas_2016_greer_tel_dan",
    title: "Did the Northern Kingdom of Israel Practice Customary Ancient Israelite Religion?",
    author: "Biblical Archaeology Society Staff",
    publisher: "Bible History Daily, Biblical Archaeology Society",
    reference: "17 May 2016, summarising Greer's Archaeological Views column 'Cultic Practices at Tel Dan—Was the Northern Kingdom Deviant?' in Biblical Archaeology Review",
    url: "https://www.biblicalarchaeology.org/daily/biblical-sites-places/biblical-archaeology-sites/northern-kingdom-of-israel-practice-customary-ancient-israelite-religion/",
    sourceType: "website",
    publishedYear: 2016,
    publishedDisplay: "2016",
    notes:
      "Cited as an independent summary, read in this session, confirming Greer's right-side/left-side pattern ('the priestly area... had a higher proportion of right-sided meaty long bones, while the common worship area featured more left-sided bones', compared with Exod 29:27–28 and Lev 7:32–33) and describing a '1.5-foot-tall basalt \"horn\" from an Israelite altar'. The issue date of the BAR column is reported as March/April 2012 and NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "davis_2013_tel_dan_cultic_context",
    title: "Tel Dan in Its Northern Cultic Context",
    author: "Andrew R. Davis",
    publisher: "Society of Biblical Literature, Atlanta (Archaeology and Biblical Studies)",
    sourceType: "academic_book",
    publishedYear: 2013,
    publishedDisplay: "2013",
    reference: "Whole work; cited by Greer 2014 on the two spheres of activity in Area T",
    notes:
      "Cited as a second full-length study of the Area T precinct, treating it alongside other northern Israelite cult places and distinguishing the central altar area from the side chambers. Not opened in this session; known from Greer's citation and catalogue records.",
  },
  {
    key: "biran_naveh_1993_1995_tel_dan_stele",
    title: "An Aramaic Stele Fragment from Tel Dan; The Tel Dan Inscription: A New Fragment",
    author: "Avraham Biran and Joseph Naveh",
    publisher: "Israel Exploration Journal 43 (2–3) and 45 (1)",
    reference: "IEJ 43 (1993), pp. 81–98; IEJ 45 (1995), pp. 1–18",
    url: "https://www.jstor.org/stable/27926300",
    sourceType: "archaeological",
    publishedYear: 1993,
    publishedDisplay: "1993 and 1995",
    notes:
      "The editio princeps of the Aramaic stele (Fragment A found July 1993; B1 and B2 June 1994), cited for its discovery in the Iron Age gate area, its reading byt dwd ('House of David') and its dating to the 9th century BCE. Bibliographic details confirmed from catalogue records in this session; the articles were not opened.",
  },
  {
    key: "mazar_1982_bull_site",
    title: "The 'Bull Site': An Iron Age I Open Cult Place",
    author: "Amihai Mazar",
    publisher: "Bulletin of the American Schools of Oriental Research 247",
    reference: "BASOR 247 (1982)",
    sourceType: "academic_paper",
    publishedYear: 1982,
    publishedDisplay: "1982",
    notes:
      "Cited for the bronze bull figurine from an Iron Age I hilltop cult place in the northern Samaria hills, the nearest securely excavated bull image from early Israel's heartland. It is NOT from Dan and not a 'golden calf'; it shows that bull imagery was used in the region's cult. Not opened in this session; NEEDS SOURCE VERIFICATION for pages.",
  },

  // ---- Nehushtan and Timna ------------------------------------------------------
  {
    key: "joines_1968_bronze_serpent",
    title: "The Bronze Serpent in the Israelite Cult",
    author: "Karen Randolph Joines",
    publisher: "Journal of Biblical Literature 87",
    reference: "JBL 87 (1968)",
    sourceType: "academic_paper",
    publishedYear: 1968,
    publishedDisplay: "1968",
    notes:
      "Cited for the classic study placing Nehushtan among Bronze and Iron Age serpent objects from Canaan and Egypt and reading it as an apotropaic and healing image that came to be worshipped. VIEWPOINT: mid-twentieth-century comparative history of religion. Not opened in this session; NEEDS SOURCE VERIFICATION for pages.",
  },
  {
    key: "rothenberg_1972_timna",
    title: "Timna: Valley of the Biblical Copper Mines",
    author: "Beno Rothenberg",
    publisher: "Thames and Hudson, London",
    sourceType: "archaeological",
    publishedYear: 1972,
    publishedDisplay: "1972 (excavation of the shrine, Site 200, 1969)",
    reference: "The chapters on the Egyptian mining sanctuary and its Midianite phase",
    notes:
      "THE EXCAVATOR'S ACCOUNT of the Hathor shrine at Timna and its Midianite tent-shrine phase, including the copper serpent with gilded head. VIEWPOINT: Rothenberg himself drew the Nehushtan comparison. Not opened in this session; cited at chapter level and through the summaries below.",
  },
  {
    key: "israel_mfa_timna",
    title: "Timna — Valley of the Ancient Copper Mines",
    author: "Israel Ministry of Foreign Affairs (republished by the Jewish Virtual Library)",
    url: "https://jewishvirtuallibrary.org/jsource/Archaeology/timna.html",
    sourceType: "government",
    publishedYear: 1999,
    publishedDisplay: "undated web text (c. 1990s)",
    notes:
      "Read in this session. Cited for the official summary that the Midianites 'turned the Egyptian temple into a tented desert shrine', and that 'of particular significance is the find of a copper snake with gilded head. It is reminiscent of the copper serpent described in Numbers 21:6–9'. VIEWPOINT: a state heritage text that presents the biblical comparison favourably.",
  },
  {
    key: "bas_timna_serpent_image",
    title: "Image caption: the Timna serpent (photograph by Beno Rothenberg)",
    author: "Biblical Archaeology Society Library",
    url: "https://library.biblicalarchaeology.org/images/bsba330206113ljpg",
    sourceType: "website",
    publishedYear: 2007,
    publishedDisplay: "image page for a Bible Review/BAR article (issue not identified)",
    notes:
      "Read in this session. Cited for the description of the object: 'discovered in a 13th- or 12th-century B.C.E. temple at Timna... This copper snake with its gilded head stretches 5 inches and evokes the Biblical Nechushtan', and as the place where a photograph of the serpent (credited to Beno Rothenberg) can be seen. The year given here is a placeholder for an unidentified issue and NEEDS SOURCE VERIFICATION.",
  },

  // ---- Ugarit ----------------------------------------------------------------------
  {
    key: "pardee_2002_ritual_cult_ugarit",
    title: "Ritual and Cult at Ugarit",
    author: "Dennis Pardee",
    publisher: "Society of Biblical Literature, Atlanta (Writings from the Ancient World 10)",
    reference: "The incantations against snakebite: RS 24.244 (KTU 1.100) and RS 24.251+ (KTU 1.107)",
    sourceType: "academic_book",
    publishedYear: 2002,
    publishedDisplay: "2002",
    notes:
      "Cited for translations of the two Ugaritic snakebite texts: KTU 1.100, in which a mare appeals in turn to a series of gods to charm a serpent's venom, and only Horon succeeds; and KTU 1.107, a second, more fragmentary charm. Not opened in this session; known from catalogue records and reference summaries. The exact RS numbers of the joins of 1.107 NEED SOURCE VERIFICATION.",
  },
  {
    key: "wyatt_2002_religious_texts_ugarit",
    title: "Religious Texts from Ugarit",
    author: "Nicolas Wyatt",
    publisher: "Sheffield Academic Press, London (2nd edition)",
    reference: "KTU 1.3 III (Anat's list of defeated foes, including tnn); KTU 1.5 I 1–3 (ltn, 'the fleeing serpent... the twisting serpent... with seven heads'); KTU 1.100; KTU 1.107",
    sourceType: "academic_book",
    publishedYear: 2002,
    publishedDisplay: "2002",
    notes:
      "Cited for English translations of the Baal Cycle passages naming Lītānu (ltn) and Tunnanu (tnn) and of the snake charms. The transliteration given in the records (bṯn brḥ, bṯn ʿqltn, šlyṭ d šbʿt rašm) is the standard one quoted across the literature; it was not checked against Wyatt's page in this session and NEEDS SOURCE VERIFICATION for line numbers.",
  },
  {
    key: "ktu_1995_cuneiform_alphabetic_texts",
    title: "The Cuneiform Alphabetic Texts from Ugarit, Ras Ibn Hani and Other Places (KTU, 2nd enlarged edition)",
    author: "Manfried Dietrich, Oswald Loretz and Joaquín Sanmartín",
    publisher: "Ugarit-Verlag, Münster",
    reference: "KTU 1.3, 1.5, 1.100, 1.107",
    sourceType: "primary",
    publishedYear: 1995,
    publishedDisplay: "1995 (1st edition 1976)",
    notes:
      "Cited as the standard edition and numbering of the Ugaritic alphabetic tablets: the 'KTU' numbers used in every record here come from it. The tablets themselves were written before Ugarit's destruction in the early 12th century BCE. Not opened in this session.",
  },

  // ---- Denyen ------------------------------------------------------------------------
  {
    key: "yadin_1968_dan_ships",
    title: "\"And Dan, Why Did He Remain in Ships\" (Judges V, 17)",
    author: "Yigael Yadin",
    publisher: "Australian Journal of Biblical Archaeology 1 (1)",
    reference: "AJBA 1.1 (1968), pp. 9–23",
    url: "https://www.biblicalarchaeology.org.uk/pdf/ajba/01-1_009.pdf",
    sourceType: "academic_paper",
    publishedYear: 1968,
    publishedDisplay: "1968 (lecture to the Israel Exploration Society)",
    notes:
      "READ IN FULL in this session. The source of the Dan = Denyen/Danuna hypothesis. Yadin's conclusion offers 'one of two conclusions': either two tribes with 'an identical name and similar characteristics' in the same region and period, 'or that there is a link between the Tribe of Dan and the Tribe of the Danai, and possibly even a certain measure of identity'. He says he wished 'to consider a certain suggestion... without being too definite in formulating it'. VIEWPOINT: proponent.",
  },
  {
    key: "edgerton_wilson_1936_ramses_iii",
    title: "Historical Records of Ramses III: The Texts in Medinet Habu, Volumes I and II",
    author: "William F. Edgerton and John A. Wilson",
    publisher: "Oriental Institute, University of Chicago (Studies in Ancient Oriental Civilization 12)",
    reference: "The Year 8 inscription (the Sea Peoples list: Peleset, Tjeker, Shekelesh, Denyen, Weshesh)",
    sourceType: "primary",
    publishedYear: 1936,
    publishedDisplay: "1936",
    notes:
      "Cited for the translation of Ramesses III's Year 8 inscription at Medinet Habu naming the Denyen among the confederation of northern peoples. VIEWPOINT: a royal victory text, formulaic and boastful. Not opened in this session; cited for the list only.",
  },
  {
    key: "moran_1992_amarna_letters",
    title: "The Amarna Letters",
    author: "William L. Moran (ed. and trans.)",
    publisher: "Johns Hopkins University Press, Baltimore",
    reference: "EA 151 (Abi-Milku of Tyre), reporting that the king of Danuna has died and his brother rules",
    sourceType: "primary",
    publishedYear: 1992,
    publishedDisplay: "1992",
    notes:
      "Cited for the earliest mention of a land of Danuna, in a fourteenth-century BCE letter from Tyre to the Egyptian court, a century and a half before Medinet Habu. Not opened in this session; NEEDS SOURCE VERIFICATION for the wording.",
  },
  {
    key: "hawkins_2000_chli_karatepe",
    title: "Corpus of Hieroglyphic Luwian Inscriptions, Vol. I: Inscriptions of the Iron Age",
    author: "J. David Hawkins",
    publisher: "Walter de Gruyter, Berlin and New York",
    reference: "KARATEPE 1 (the Azatiwada bilingual; Phoenician text = KAI 26)",
    sourceType: "primary",
    publishedYear: 2000,
    publishedDisplay: "2000",
    notes:
      "Cited for the Karatepe bilingual of Azatiwada, ruler under the king of the Danunians (Phoenician dnnym) and the 'house of Mopsos' (mpš), in Luwian 'Adana(wa)': it places the Danuna in Cilicia around Adana, not on the coast of Canaan. Not opened in this session; the date of the inscription (late 8th or early 7th century BCE) is argued.",
  },
  {
    key: "bartusch_2003_understanding_dan",
    title: "Understanding Dan: An Exegetical Study of a Biblical City, Tribe and Ancestor",
    author: "Mark W. Bartusch",
    publisher: "Sheffield Academic Press (JSOT Supplement Series 379)",
    sourceType: "academic_book",
    publishedYear: 2003,
    publishedDisplay: "2003",
    reference: "Whole work; its discussion of the Sea Peoples hypothesis",
    notes:
      "Cited as the fullest modern study of every biblical text about Dan, and as a critic of Yadin's proposal, which it is reported to call speculative. The characterisation is known from secondary summaries and NEEDS SOURCE VERIFICATION against the book.",
  },
  {
    key: "margalith_1994_sea_peoples_bible",
    title: "The Sea Peoples in the Bible",
    author: "Othniel Margalith",
    publisher: "Harrassowitz, Wiesbaden",
    sourceType: "academic_book",
    publishedYear: 1994,
    publishedDisplay: "1994",
    reference: "Whole work",
    notes:
      "Cited as a proponent who extended the Aegean/Sea Peoples reading of Dan and Samson (Yadin mentions receiving Margalith's early essay on Samson after his lecture). Not opened in this session.",
  },
  {
    key: "armstrong_institute_denyen_dan",
    title: "Were the Seafaring Denyen the Tribe of Dan?",
    author: "Armstrong Institute of Biblical Archaeology",
    url: "https://armstronginstitute.org/736-were-the-seafaring-denyen-the-tribe-of-dan",
    sourceType: "website",
    publishedYear: 2022,
    publishedDisplay: "web article (2020s)",
    notes:
      "Cited ONLY as an example of the hypothesis in current popular advocacy, which presents critics as 'minimalists'. VIEWPOINT: a confessional organisation that defends biblical historicity; not peer-reviewed. Publication year approximate.",
  },

  // ---- Assyria and the lost tribes --------------------------------------------------
  {
    key: "tadmor_yamada_2011_rinap1",
    title: "The Royal Inscriptions of Tiglath-pileser III (744–727 BC) and Shalmaneser V (726–722 BC), Kings of Assyria",
    author: "Hayim Tadmor and Shigeo Yamada",
    publisher: "Eisenbrauns, Winona Lake (Royal Inscriptions of the Neo-Assyrian Period 1)",
    url: "https://oracc.museum.upenn.edu/rinap/rinap1/",
    sourceType: "primary",
    publishedYear: 2011,
    publishedDisplay: "2011",
    reference: "The summary inscriptions on the campaigns of 734–732 BCE against Aram-Damascus and Israel",
    notes:
      "Cited for the Assyrian side of the 732 BCE campaign: the annexation of Israel's northern territories and deportations from them. Not opened in this session; NEEDS SOURCE VERIFICATION for text numbers. No Assyrian text read here names Dan.",
  },
  {
    key: "younger_1998_deportations_israelites",
    title: "The Deportations of the Israelites",
    author: "K. Lawson Younger Jr.",
    publisher: "Journal of Biblical Literature 117 (2)",
    reference: "JBL 117 (1998)",
    sourceType: "academic_paper",
    publishedYear: 1998,
    publishedDisplay: "1998",
    notes:
      "Cited for the critical reconstruction of the 732 and 720 BCE deportations from the Assyrian and biblical evidence, including Sargon II's claim of 27,290 (or, in another inscription, 27,280) people carried off from Samaria, and the point that many Israelites were not deported. Not opened in this session; NEEDS SOURCE VERIFICATION for pages.",
  },
  {
    key: "parfitt_2002_lost_tribes",
    title: "The Lost Tribes of Israel: The History of a Myth",
    author: "Tudor Parfitt",
    publisher: "Weidenfeld & Nicolson, London",
    sourceType: "academic_book",
    publishedYear: 2002,
    publishedDisplay: "2002",
    reference: "Whole work",
    notes:
      "Cited for the history of 'lost tribes' identifications from antiquity to the present (Eldad ha-Dani, the Beta Israel, British Israelism and many others) as a history of ideas rather than of migrations. VIEWPOINT: critical historian of the myth. Not opened in this session.",
  },
  {
    key: "ben_dor_benite_2009_ten_lost_tribes",
    title: "The Ten Lost Tribes: A World History",
    author: "Zvi Ben-Dor Benite",
    publisher: "Oxford University Press, New York",
    sourceType: "academic_book",
    publishedYear: 2009,
    publishedDisplay: "2009",
    reference: "Whole work",
    notes:
      "Cited as a second scholarly history of the lost-tribes idea, emphasising how it shaped geographical and colonial thinking. Not opened in this session.",
  },
  {
    key: "adler_1930_jewish_travellers",
    title: "Jewish Travellers",
    author: "Elkan Nathan Adler (ed.)",
    publisher: "George Routledge & Sons, London (Broadway Travellers)",
    reference: "The chapter on Eldad the Danite (c. 880 CE)",
    sourceType: "historical_document",
    publishedYear: 1930,
    publishedDisplay: "1930",
    notes:
      "Cited here only for the existence of Eldad ha-Dani's ninth-century account placing the tribe of Dan in Cush, which the africanJewish lane treats in full. Not opened by this lane's writer.",
  },
  {
    key: "wilson_1840_israelitish_origin",
    title: "Lectures on Our Israelitish Origin",
    author: "John Wilson",
    publisher: "London",
    sourceType: "book",
    publishedYear: 1840,
    publishedDisplay: "1840",
    reference: "Whole work",
    notes:
      "Cited as the founding text of British Israelism, which identified the northern tribes with peoples of north-western Europe; later writers in that movement read 'Dan' into names such as Danube and Denmark. VIEWPOINT: a religious-nationalist theory without historical evidence. Not opened in this session; the Dan-specific place-name claims NEED SOURCE VERIFICATION against a named author.",
  },
];

// ---------------------------------------------------------------------------
// Pictures (every file page fetched on 2026-10-19; licence and creator copied)
// ---------------------------------------------------------------------------

const PD = "Public domain (Creative Commons Public Domain Mark 1.0)";

/** A folio of the Leningrad Codex; the passage is the one the Commons file page names. */
const folio = (n: string, passage: string, note: string) =>
  commonsPicture({
    fileName: `Leningrad Codex Folio ${n}.jpg`,
    caption: `Leningrad Codex, folio ${n.replace(/^0+/, "").replace("a", "r").replace("b", "v")} (${n}), containing ${passage} according to its Commons description. A Hebrew manuscript written in 1008–1009 CE: ${note}`,
    shows: "manuscript",
    identificationStatus: "secure",
    licence: PD,
    creator: "Unknown scribe; scan by USC Dornsife (via manuscripts.sefaria.org)",
    institution: "National Library of Russia, St Petersburg (Firkovich B 19 A)",
    objectDate: "1008–1009 CE",
  });

const pFolioGen30 = folio("017b", "Genesis 29:23–30:14", "the oldest complete Masoretic manuscript, about two thousand years later than any tribe of Dan, so it dates the copy and not the text.");
const pFolioGen49 = folio("030b", "Genesis 48:17–49:26", "the page on which Jacob's sayings over Dan (49:16–17) are written; a medieval copy, not an ancient witness.");
const pFolioJudg5 = folio("139a", "Judges 5:13–28", "the Song of Deborah, including verse 17 on Dan and ships, as copied in the eleventh century CE.");
const pFolioJudg18a = folio("147b", "Judges 18:7–29", "the Danite spies, the taking of Laish and its renaming as Dan.");
const pFolioJudg18b = folio("148a", "Judges 18:29–19:20", "verse 30, where the name of Jonathan's grandfather is written with a raised ('suspended') nun turning Moshe into Menashe.");
const pFolioNum21 = folio("088b", "Numbers 21:8–34", "the end of the bronze-serpent episode (21:8–9).");
const pFolio1Kgs12 = folio("194b", "1 Kings 12:26–13:12", "Jeroboam's calves at Bethel and Dan (12:28–30).");
const pFolio2Kgs18 = folio("214b", "2 Kings 17:32–18:12", "Hezekiah's breaking of Nehushtan (18:4).");

const pTelDanGeneral = commonsPicture({
  fileName: "Tel-Dan-NS-13703.jpg",
  caption: "Tel Dan archaeological site, northern Israel, photographed in August 2016: a general view of the excavated mound (Tell el-Qadi) at the springs of the Dan river. A modern photograph of the site, not of any particular find.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY 4.0",
  creator: "Bukvoed",
  objectDate: "photographed 6 August 2016",
});

const pTribesMap = commonsPicture({
  fileName: "12 Tribes of Israel Map.svg",
  caption: "A modern map of the tribal allotments described in Joshua 13–19, with Dan's first territory west of Benjamin and north of Philistia, before the move north. It maps a biblical description, not settlement shown by archaeology; the Commons description itself warns that the allotments may not be historically accurate.",
  shows: "map",
  identificationStatus: "modern_interpretation",
  licence: "CC BY-SA 3.0 or GFDL 1.2+",
  creator: "Richardprins (derivative of maps by Kordas, יוסי and Janz)",
  objectDate: "2010 (map)",
});

const pBlaeuDan = commonsPicture({
  fileName: "Dan. Willem Janszoon Blaeu and Joan Blaeu. Terra Sancta quae in Sacris Terra Promissionis olim Palestina. 1648-1664.jpg",
  caption: "Detail of 'Terra Sancta quae in Sacris Terra Promissionis olim Palestina', a seventeenth-century Dutch printed map by Willem and Joan Blaeu (1648–1664), showing Dan's territory as early modern cartographers drew it from the Bible. A later artwork and a reading of the text, not evidence for the tribe.",
  shows: "map",
  identificationStatus: "secure",
  licence: "Public domain",
  creator: "Willem Janszoon Blaeu and Joan Blaeu",
  institution: "New York Public Library, Lionel Pincus and Princess Firyal Map Division (ps_map_192)",
  objectDate: "1648–1664",
});

const pBneiBrakScales = commonsPicture({
  fileName: "Bnei Brak IMG 5851.JPG",
  caption: "The emblem of the tribe of Dan as a pair of scales, on a synagogue in Bnei Brak, Israel, photographed in 2010. A modern emblem playing on the name 'Dan' as 'he judged'; it illustrates the Genesis 30:6 etymology, not anything ancient.",
  shows: "later_artwork",
  identificationStatus: "secure",
  licence: "CC BY-SA 3.0 or GFDL 1.2+",
  creator: "Deror avi",
  objectDate: "photographed 3 December 2010",
});

const pHeichalShlomoSerpent = commonsPicture({
  fileName: "Dan tribe plate Heichal Shlomo door Jerusalem.jpg",
  caption: "The tribe of Dan's serpent emblem on the gate of Heichal Shlomo, Jerusalem, photographed in 2010. A twentieth-century emblem drawn from Genesis 49:17 through the medieval midrash (Numbers Rabbah 2:7) that put a serpent on Dan's banner. Modern, not evidence of any ancient Danite serpent symbol.",
  shows: "later_artwork",
  identificationStatus: "secure",
  licence: "CC BY 2.0",
  creator: "zeevveez (Flickr)",
  objectDate: "photographed 7 February 2010",
});

const pMadaba = commonsPicture({
  fileName: "Byzantine floor mosaic map at St. George Church Madaba P1090104.JPG",
  caption: "Part of the sixth-century CE Madaba mosaic map in St George's Church, Madaba, Jordan, which labels the lot of Dan near the coast. A Byzantine Christian reading of Joshua's allotments made over 1,500 years after the period described; photographed in 2012.",
  shows: "map",
  identificationStatus: "secure",
  licence: "GFDL 1.2+ or CC BY-SA 3.0",
  creator: "Deror avi",
  institution: "St George's Church, Madaba, Jordan",
  objectDate: "6th century CE (mosaic); photographed 26 January 2012",
});

const pCanaaniteGate = commonsPicture({
  fileName: "Tel Dan - Canaanite Gate.jpg",
  caption: "The mud-brick arched gate of Middle Bronze Age Laish at Tel Dan (18th century BCE in the excavators' sequence), photographed in 2008. It belongs to the city the Danites are said to have taken, centuries before any Israelite presence; it is not evidence of the conquest story.",
  shows: "site",
  identificationStatus: "secure",
  licence: "Public domain (released by the author)",
  creator: "Adrianlw",
  objectDate: "photographed 27 June 2008",
});

const pCanaaniteGate2017 = commonsPicture({
  fileName: "Canaanite Gate in 2017.jpg",
  caption: "The Middle Bronze Age 'Canaanite Gate' of Laish at Tel Dan, photographed in May 2017 under its modern protective structure.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "DinaKuzia",
  objectDate: "photographed 13 May 2017",
});

const pSacredPrecinct = commonsPicture({
  fileName: "Holy Land 2022 (1) P622 Tel Dan Sacred Precinct.jpg",
  caption: "The sacred precinct (Area T) at Tel Dan in May 2022: the excavated and partly restored Iron Age platform and enclosure. A modern photograph of a site with modern restoration; it does not show any of the small finds discussed in the records.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Fallaner",
  objectDate: "photographed 13 May 2022",
});

const pKultplatz = commonsPicture({
  fileName: "Tel-dan-kultplatz-a.JPG",
  caption: "Tel Dan, the cult place (Kultplatz) of Area T, photographed in April 2014: the ashlar podium of the 'high place' with the altar area in front of it.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Mboesch",
  objectDate: "photographed 28 April 2014",
});

const pAltarOutline = commonsPicture({
  fileName: "Tel-dan-kultplatz-d-altar.JPG",
  caption: "Tel Dan, Area T: the altar square with its modern metal outline (Altarnachbildung, a reconstruction of the altar's size), photographed in April 2014. The frame is a modern reconstruction marking where the large horned altar is thought to have stood; it is not the altar.",
  shows: "reconstruction",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Mboesch",
  objectDate: "photographed 28 April 2014",
});

const pAltarView = commonsPicture({
  fileName: "View of ancient Alter, Dan, Israel - panoramio.jpg",
  caption: "'View of ancient altar, Dan, Israel': the altar enclosure of the Tel Dan sacred precinct photographed in February 2006, before the present outline frame was installed.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY 3.0",
  creator: "buzzard525 (Panoramio)",
  objectDate: "photographed 22 February 2006",
});

const pBullStatuette = commonsPicture({
  fileName: "Israelite Bronze Bull Statuette, Samaria, Iron Age I, 12th Century BC (43217369651).jpg",
  caption: "Bronze bull statuette from the 'Bull Site' in the northern Samaria hills, Iron Age I (c. 12th century BCE), Israel Museum, photographed in 2018. It is NOT from Dan and NOT one of Jeroboam's calves; it shows that a bull image was used in an early cult place in the region.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC0 1.0",
  creator: "Gary Todd",
  institution: "Israel Museum, Jerusalem",
  objectDate: "Iron Age I (c. 12th century BCE); photographed 2018",
});

const pBibleHistoriale = commonsPicture({
  fileName: "Jeroboam sets up two golden calves.jpg",
  caption: "Jeroboam sets up two golden calves: a miniature from a Bible Historiale manuscript of 1372, Museum Meermanno, The Hague (MS 10 B 23). A medieval painting imagining the scene of 1 Kings 12 with gold idols on columns; a later artwork, not a depiction of the cult image.",
  shows: "later_artwork",
  identificationStatus: "secure",
  licence: "Public domain",
  creator: "Anonymous illuminator",
  institution: "Museum Meermanno-Westreenianum, The Hague (MS 10 B 23)",
  objectDate: "1372",
});

const pStele = commonsPicture({
  fileName: "JRSLM 300116 Tel Dan Stele 01.jpg",
  caption: "The Tel Dan Stele on display in the Israel Museum, Jerusalem, photographed in 2016: the joined basalt fragments of a ninth-century BCE Aramaic royal inscription found at Tel Dan in 1993–94.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Oren Rozen",
  institution: "Israel Museum, Jerusalem",
  objectDate: "9th century BCE; photographed 30 January 2016",
});

const pSteleDrawing = commonsPicture({
  fileName: "Tel dan inscription.png",
  caption: "A modern drawing of the Tel Dan inscription made by a Wikipedia contributor, with fragment A on the right and fragments B1 and B2 on the left as most editors place them. A drawing for reading, not a photograph; the placement of B relative to A is itself debated.",
  shows: "diagram",
  identificationStatus: "secure",
  licence: "GFDL 1.2+ or CC BY-SA 3.0",
  creator: "Schreiber",
  objectDate: "drawn 2005–2008",
});

const pSistineSerpent = commonsPicture({
  fileName: "Michelangelo Buonarroti 024.jpg",
  caption: "'The Brazen Serpent', Michelangelo's fresco in a corner spandrel of the Sistine Chapel ceiling (1508–1512), shown before restoration: a Renaissance painting of Numbers 21, a later artwork with no evidential value for the object.",
  shows: "later_artwork",
  identificationStatus: "secure",
  licence: "Public domain",
  creator: "Michelangelo Buonarroti",
  institution: "Sistine Chapel, Vatican Museums",
  objectDate: "1508–1512",
});

const pTimnaShrine = commonsPicture({
  fileName: "Temple of Hathor in Timna Park in summer 2011 (1).JPG",
  caption: "The site of the Egyptian Hathor shrine at Timna, southern Israel, photographed in August 2011: the small sanctuary against the cliff where Rothenberg found the copper serpent in its Midianite phase. The serpent itself is not shown.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY 3.0 or GFDL 1.2+",
  creator: "Chmee2",
  objectDate: "photographed 14 August 2011",
});

const pNeboMonument = commonsPicture({
  fileName: "Monument of the bronze serpent erected by Moses.jpg",
  caption: "A modern sculpture of the bronze serpent on a cross-like pole on Mount Nebo, Jordan, in front of the Church of Saint Moses, photographed in 2018. A late twentieth-century Christian monument, not an ancient object.",
  shows: "later_artwork",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "John Romano D'Orazio",
  objectDate: "photographed 27 June 2018",
});

const pSantAmbrogio = commonsPicture({
  fileName: "9647 - Milano - Sant'Ambrogio - Serpente di Basilio II (1007) - Foto Giovanni Dall'Orto 25-Apr-2007.jpg",
  caption: "The bronze serpent on a Roman column in the basilica of Sant'Ambrogio, Milan, said to have been given by the Byzantine emperor Basil II in 1007 and once believed to be the serpent Moses made. A medieval object and a medieval belief; photographed 2007.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "Attribution (attribution-only licence)",
  creator: "Giovanni Dall'Orto",
  institution: "Basilica of Sant'Ambrogio, Milan",
  objectDate: "given 1007 CE (tradition); photographed 25 April 2007",
});

const pBaalStatuette = commonsPicture({
  fileName: "Baal Ugarit Louvre AO17330.jpg",
  caption: "Bronze figurine of a god with raised right arm, usually identified as Baal, from Ras Shamra (Ugarit), excavated by Schaeffer and Chenet in 1934; Late Bronze Age (14th–12th century BCE), Louvre. The Commons page gives both AO 17329 and AO 17330 as the inventory number. The storm god of the Baal Cycle, Lotan's opponent, not a serpent image.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "Public domain (released by the photographer)",
  creator: "Jastrow",
  institution: "Musée du Louvre, Paris",
  accessionNumber: "AO 17330 (file name) / AO 17329 (file page)",
  objectDate: "c. 14th–12th century BCE; photographed 2006",
});

const pUgaritRuins = commonsPicture({
  fileName: "RasSchamraUgarit2.jpg",
  caption: "The ruins of Ugarit at Ras Shamra, Syria, photographed in December 1987: the city whose archives produced the Baal Cycle and the snakebite charms, destroyed in the early twelfth century BCE.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 3.0",
  creator: "Ziegler175",
  objectDate: "photographed December 1987",
});

const pDoreLeviathan = commonsPicture({
  fileName: "Destruction of Leviathan.png",
  caption: "'Destruction of Leviathan', an engraving by Gustave Doré (1865) illustrating Isaiah 27:1. A nineteenth-century European illustration of the Hebrew Leviathan, whose epithets echo Ugaritic Lotan; it depicts no ancient image.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: "Public domain",
  creator: "Gustave Doré",
  objectDate: "1865",
});

const pMedinetHabu = commonsPicture({
  fileName: "Medinet Habu Ramses III. Tempel Nordostwand 08.jpg",
  caption: "The north-east outer wall of Ramesses III's mortuary temple at Medinet Habu, Thebes, photographed in 2014: the wall that carries the Year 8 battle reliefs and inscription naming the Denyen among the northern peoples (early 12th century BCE).",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY 3.0 or GFDL 1.2+",
  creator: "Olaf Tausch",
  objectDate: "relief early 12th century BCE; photographed 17 October 2014",
});

const pKaratepe = commonsPicture({
  fileName: "Karatepe Azatiwada inscription Phoenician text 5313.jpg",
  caption: "Part of the Karatepe bilingual inscription of Azatiwada (Phoenician and Hieroglyphic Luwian), Karatepe, southern Turkey, photographed in 2008. The Phoenician text names the Danunians (dnnym) of the Adana plain; 8th or early 7th century BCE.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Dosseman",
  institution: "Karatepe-Aslantaş Open-Air Museum, Osmaniye, Turkey",
  objectDate: "8th or early 7th century BCE; photographed 17 September 2008",
});

const pTiglathSiege = commonsPicture({
  fileName: "Assyrian Relief Attack on Enemy Town from Kalhu (Nimrud) Central Palace reign of Tiglath-pileser III British Museum - 2.jpg",
  caption: "An Assyrian relief of an attack on an enemy town, from the Central Palace of Tiglath-pileser III at Kalhu (Nimrud), c. 730–727 BCE, British Museum, photographed on loan at the Getty Villa in 2019. It shows Assyrian siege warfare of the period; the town is not identified as Dan or any Israelite city.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY 4.0",
  creator: "Allan Gluck",
  institution: "British Museum",
  objectDate: "c. 730–727 BCE; photographed 2 October 2019",
});

const pBlackObelisk = commonsPicture({
  fileName: "Black Obelisk side 4 Israelite delegation.jpg",
  caption: "A crop of the Black Obelisk of Shalmaneser III from Nimrud (c. 841–827 BCE), British Museum: the panel of tribute bearers labelled as Israelite, from Jehu's kingdom. The earliest Assyrian image of Israelites, a century before the conquest.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Osama Shukir Muhammed Amin FRCP(Glasg)",
  institution: "British Museum",
  objectDate: "9th century BCE; photographed 2020",
});

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

const events: SeedEvent[] = [
  // =========================================================================
  // THE ANCHOR
  // =========================================================================
  {
    slug: ANCHOR,
    title: "The tribe of Dan: what the sources are and how they relate",
    summary:
      "Everything known about Dan comes from three kinds of evidence of very different dates: biblical texts composed between roughly the tenth and the fifth centuries BCE and copied in medieval manuscripts; the excavated city of Tel Dan; and a ninth-century Aramaic stele found there. This record says what each is and what each can carry.",
    description:
      "WHY THIS RECORD COMES FIRST. The track asks whether the biblical tribe of Dan could be connected with Egyptian, Kushite or West African serpent traditions. Before any comparison can be made the Israelite end has to be stated as the evidence actually stands, and that evidence is not one thing.\n\n" +
      "ONE: THE BIBLICAL TEXTS. Dan appears as a son of Jacob named by Rachel (Genesis 30:6), as the subject of a saying that calls him 'a serpent by the way' (Genesis 49:16–17) and 'a lion's whelp' (Deuteronomy 33:22), as a tribe that 'remained in ships' (Judges 5:17), as a tribe without land that migrates north and takes the city of Laish (Judges 18; Joshua 19:47), and as the site of one of Jeroboam's two golden calves (1 Kings 12:28–30). These are texts of different genres and dates: poetry that some scholars date to the late second millennium BCE and others much later; narrative books edited in the seventh and sixth centuries BCE from older material; a Pentateuch that reached its final form in the Persian period. The oldest complete Hebrew copy is the Leningrad Codex of 1008–1009 CE. A text's date is not the date of what it narrates, and none of these texts is a contemporary record of a tribe.\n\n" +
      "TWO: TEL DAN. The mound of Tell el-Qadi at the springs of the Jordan, identified with Laish/Dan, was excavated by Avraham Biran in 33 seasons from 1966 and is still being worked by the Nelson Glueck School. It has a Middle Bronze Age gate, an Iron Age I village, and in Area T a large Iron Age II sacred precinct with a monumental altar, smaller altars, implements and thousands of animal bones. The dating of its phases is disputed between a ninth-century and an early eighth-century sequence.\n\n" +
      "THREE: THE TEL DAN STELE. Fragments of an Aramaic royal inscription found in 1993–94, generally attributed to Hazael of Damascus in the later ninth century BCE, which names a king of Israel and the 'House of David'. It dates a phase of the site; it does not mention the tribe of Dan.\n\n" +
      "HOW THEY RELATE. The archaeology confirms a city and a major Iron Age sanctuary at Dan, which fits the biblical claim that Dan was a royal cult centre of the northern kingdom. It does not confirm the tribal genealogy, the migration story or the identity of the god worshipped. No excavated object names the tribe. And there is NO Israelite source that attaches a serpent cult to Dan: the serpent belongs to a single poetic simile in Genesis 49, and to medieval and modern emblems derived from it.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a city called Dan in the Iron Age, a royal sanctuary there in the ninth and eighth centuries BCE, and a body of biblical tradition about a tribe of that name. It does not establish when or whether a tribe migrated from the coast to Laish, it gives no serpent cult at Dan, and it records no movement of Danites towards Africa: that idea first appears in a ninth-century CE text (Eldad ha-Dani), treated in the africanJewish lane.",
    category: "religion",
    subcategory: SUB,
    eventType: "mainstream",
    tags: serpentTags(LANE, ["figure: dan (tribe)", "place: tel dan", "theme: manuscripts and their dates"], "overview", "sources"),
    people: ["Dan (son of Jacob)", "Avraham Biran", "Jeroboam I", "Hazael"],
    civilisations: ["Tribe of Dan", "Kingdom of Israel", "Aram-Damascus"],
    ...TEL_DAN,
    claims: [
      {
        sourceKey: "ngsba_tel_dan_strata",
        citations: [
          { sourceKey: "biran_1994_biblical_dan", relation: "supports", note: "The excavator's synthesis of the Iron Age city and sanctuary." },
          { sourceKey: "arie_2008_tel_dan_strata", relation: "disputes", note: "Lowers the date of the precinct's first phase to the late 9th or early 8th century." },
        ],
        startYear: bce(900),
        endYear: bce(732),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The Iron Age II city and sanctuary at Tel Dan, the only directly excavated evidence for 'Dan'",
        originalDateText: "Iron Age II strata IVA–II, 9th century to after 750 BCE",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. The excavators' stratigraphic sequence (pottery and architecture) places the sacred precinct in the 9th and 8th centuries BCE and the city's destruction after 750. It dates a city and a sanctuary; it does not date a tribe, and nothing excavated names one.",
      },
      {
        sourceKey: "schmid_2012_ot_literary_history",
        citations: [
          { sourceKey: "cross_freedman_1975_yahwistic_poetry", relation: "context", note: "Argues that some of the poetry about Dan (Gen 49, Judg 5) is much older than the prose books around it." },
          { sourceKey: "wlc_hebrew_bible", relation: "context", note: "The text as preserved in the Leningrad Codex of 1008–1009 CE." },
        ],
        startYear: bce(1000),
        endYear: bce(450),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The composition of the biblical texts that mention Dan",
        originalDateText: "Composed between about the 10th and the 5th centuries BCE, in critical scholarship",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: modern interpretation. A range covering the earliest proposed dates for the poems and the latest for the Pentateuch's final form. It dates the WRITING; it says nothing about when the events the texts narrate happened, or whether they did.",
      },
      {
        sourceKey: "wlc_hebrew_bible",
        startYear: 1008,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The oldest complete Hebrew manuscript of the texts about Dan",
        originalDateText: "Leningrad Codex, copied 1008–1009 CE",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later manuscript. The codex's colophon dates the copy. Older fragments of some books survive among the Dead Sea Scrolls, but the complete text read here is medieval; it shows the text existed by then, not when it was first written.",
      },
    ],
    media: [pTelDanGeneral, pTribesMap, pBlaeuDan],
  },

  // =========================================================================
  // THE TEXTS
  // =========================================================================
  {
    slug: "dan-named-in-genesis-30",
    title: "Genesis 30:6: Rachel names Dan, 'God has judged me'",
    summary:
      "Genesis explains the name Dan by a pun on the Hebrew root d-y-n, 'to judge': Rachel says dānannî ʾĕlōhîm, 'God has judged me (in my favour)', when her servant Bilhah bears a son. It is a folk etymology inside a narrative, and it is the only explanation of the name the Bible gives.",
    description:
      "WHAT THE TEXT SAYS. Rachel, childless, gives her servant Bilhah to Jacob; when Bilhah bears a son Rachel says 'God has judged me, and has also heard my voice, and has given me a son', 'therefore she called his name Dan' (Genesis 30:6). The Hebrew dānannî ('he has judged me', from the root d-y-n, 'judge, vindicate, plead a cause') plays on the name dān. Genesis 49:16 repeats the pun: dān yādîn ʿammô, 'Dan shall judge his people'.\n\n" +
      "WHAT KIND OF STATEMENT IT IS. A naming story of the kind Genesis tells for each of Jacob's sons, each explaining a name by a word the mother speaks. Such etymologies are literary, not linguistic analyses; but in this case the pun is a natural one, because dān is a regular Hebrew form of the verb 'he judged' and the same root forms personal names across the West Semitic world (the Ugaritic hero dnil, Danel, who 'judges the cause of the widow' in the Aqhat epic, is the nearest example).\n\n" +
      "DAN'S STATUS IN THE STORY. Dan is the son of a servant, not of Rachel or Leah, and the tribe's genealogy is the thinnest of any: Genesis 46:23 gives one son, Hushim. Yadin (1968) and others read this as a memory that Dan was a late or marginal member of the tribal league.\n\n" +
      "WHY IT MATTERS FOR THIS TRACK. The Gbe word dan / dã means 'snake'. The Hebrew name means 'judge' and is explained by the Bible as 'judge', not 'serpent'. The serpent enters only with a simile in Genesis 49:17, which plays on a different word (nāḥāš). Any comparison of the two names starts from words of different meaning in unrelated language families (the words lane treats this in detail).\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes how the biblical writer explained the name, and that d-y-n 'judge' is a real and productive Semitic root. It does not establish a historical individual called Dan, the date of the tradition, or any meaning 'serpent' for the Hebrew name.",
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: dan (tribe)", "theme: names and words"], "genesis", "etymology"),
    people: ["Rachel", "Bilhah", "Jacob", "Dan (son of Jacob)"],
    civilisations: ["Tribe of Dan", "Ancient Israel"],
    locationName: "Haran, upper Mesopotamia (setting of the narrative)",
    claims: [
      {
        sourceKey: "wlc_hebrew_bible",
        citations: [{ sourceKey: "kjv_bible", relation: "context", note: "The English rendering 'God hath judged me'." }],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The birth and naming of Dan as narrated",
        originalDateText: "In the days of Jacob in Haran; the narrative gives no date",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: biblical narrative. The story belongs to the patriarchal narratives, which carry no calendar date and no external confirmation. Traditional chronologies that place Jacob in the early second millennium BCE are calculations from biblical numbers, not evidence, so no year is given.",
      },
      {
        sourceKey: "schmid_2012_ot_literary_history",
        startYear: bce(900),
        endYear: bce(500),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The writing of the Jacob birth narratives of Genesis 29–30",
        originalDateText: "Non-priestly Genesis narrative, variously dated from the monarchy to the exile",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Source critics assign Genesis 30 to the non-priestly material, dated anywhere from the early monarchy to the sixth century BCE depending on the model. It dates the text, not Dan.",
      },
    ],
    passages: [
      {
        label: "Genesis 30:6, the naming of Dan",
        reference: "Genesis 30:6",
        sourceKey: "wlc_hebrew_bible",
        objectName: "Leningrad Codex, folio 17v",
        holdingInstitution: "National Library of Russia, St Petersburg",
        accessionNumber: "Firkovich B 19 A",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            content: "וַתֹּ֤אמֶר רָחֵל֙ דָּנַ֣נִּי אֱלֹהִ֔ים וְגַם֙ שָׁמַ֣ע בְּקֹלִ֔י וַיִּתֶּן־לִ֖י בֵּ֑ן עַל־כֵּ֛ן קָרְאָ֥ה שְׁמ֖וֹ דָּֽן׃",
            language: "Hebrew",
            script: "Hebrew (square script with Tiberian vowels and accents)",
            evidence: "The Masoretic text as encoded in the Westminster Leningrad Codex. dānannî (דָּנַנִּי) 'he has judged me' and dān (דָּן) are the pun.",
          },
          {
            layer: "transliteration",
            sourceKey: null,
            content: "wattōʾmer rāḥēl dānannî ʾĕlōhîm wəḡam šāmaʿ bəqōlî wayyitten-lî bēn ʿal-kēn qārəʾâ šəmô dān",
            language: "Hebrew",
            script: "Latin (academic transliteration)",
            evidence: "Transliteration made for this record from the vocalised text; it shows the root d-n in dānannî and dān.",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            content:
              "And Rachel said, God hath judged me, and hath also heard my voice, and hath given me a son: therefore called she his name Dan.",
            language: "English",
            viewpoint: "religious",
            evidence: "KJV 1611/1769. 'Judged' renders the verb accurately; many modern versions add 'vindicated' to bring out the sense of a verdict in her favour.",
          },
        ],
      },
    ],
    media: [pFolioGen30, pBneiBrakScales],
  },
  {
    slug: "dan-serpent-by-the-way-genesis-49",
    title: "Genesis 49:16–17: 'Dan shall be a serpent by the way'",
    summary:
      "In Jacob's last sayings Dan is first a judge of his people and then a nāḥāš on the road and a šəp̄îp̄ōn on the path that bites the horse's heels. It is the only place in the Hebrew Bible where Dan is likened to a serpent, and it is a simile for a small tribe's ambush tactics, not a description of a cult.",
    description:
      "WHAT THE TEXT SAYS. 'Dan shall judge his people, as one of the tribes of Israel. Dan shall be a serpent (nāḥāš) by the way, an adder (šəp̄îp̄ōn) in the path, that biteth the horse heels, so that his rider shall fall backward' (Genesis 49:16–17, KJV). Verse 18 follows with an abrupt prayer: 'I have waited for thy salvation, O LORD.'\n\n" +
      "THE WORDS. nāḥāš is the ordinary Hebrew word for snake, the same word used of the serpent in Eden and of Moses' bronze serpent (nəḥaš nəḥōšet). šəp̄îp̄ōn occurs only here; it is usually taken as a horned viper (a Cerastes, which lies buried in sand by a track) on the basis of the context and of Arabic and Syriac cognates, and the KJV's 'adder' is a guess. The image is of a small snake that brings down a mounted enemy by striking from the roadside: a weak tribe that wins by ambush. Deuteronomy 33:22 gives Dan a different animal, 'a lion's whelp: he shall leap from Bashan'.\n\n" +
      "WHAT IT IS NOT. It is not evidence that Danites worshipped a serpent, kept snakes or used a serpent emblem. The serpent is a simile in a poem that gives animals to several tribes (Judah a lion, Issachar an ass, Naphtali a hind, Benjamin a wolf). The tradition of a serpent on Dan's banner is medieval: Numbers Rabbah 2:7 says Dan's flag was sapphire-coloured 'with a serpent depicted on it, after \"Dan shall be a serpent\"', and modern tribal emblems (such as the plate on Heichal Shlomo in Jerusalem) descend from that.\n\n" +
      "THE DATE OF THE POEM. Cross and Freedman argued from archaic language that the Blessing of Jacob is among the oldest Hebrew poetry; others see it as a collection of tribal sayings assembled under the monarchy or later. Either way it is centuries older than the midrash and millennia older than the emblem.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that one ancient Israelite poet compared Dan to a roadside snake. It does not establish any serpent cult, priesthood or symbol among the Danites, and it is the single text on which every 'Dan the serpent tribe' argument ultimately rests. The Gbe vodun Dan is a different word in a different language (see the gbe and words lanes).",
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: dan (tribe)", "theme: names and words", "theme: manuscripts and their dates"], "genesis", "blessing of jacob"),
    people: ["Jacob", "Dan (son of Jacob)"],
    civilisations: ["Tribe of Dan", "Ancient Israel"],
    locationName: "Egypt (setting of Jacob's deathbed in the narrative)",
    claims: [
      {
        sourceKey: "cross_freedman_1975_yahwistic_poetry",
        citations: [{ sourceKey: "schmid_2012_ot_literary_history", relation: "disputes", note: "Critical scholarship more often dates the collected tribal sayings to the monarchy or later." }],
        startYear: bce(1100),
        endYear: bce(900),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The composition of the Blessing of Jacob, on the early-dating view",
        originalDateText: "Archaic Hebrew poetry of the 11th–10th centuries BCE (Cross and Freedman)",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Dated by linguistic features judged archaic. It is a scholarly argument, contested, and it dates the poem, not any events.",
      },
      {
        sourceKey: "schmid_2012_ot_literary_history",
        startYear: bce(800),
        endYear: bce(550),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The composition or collection of the Blessing of Jacob, on later-dating views",
        originalDateText: "Tribal sayings collected under the monarchy or in the exile",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Many critical scholars treat Genesis 49 as a compilation reflecting the monarchy's view of the tribes. The range is approximate and covers several positions.",
      },
      {
        sourceKey: "numbers_rabbah_2_7",
        startYear: 1150,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first known statement that Dan's banner bore a serpent",
        originalDateText: "Dan's banner 'with a serpent depicted on it', Numbers Rabbah 2:7",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: religious tradition. A medieval midrash deriving an emblem from Genesis 49:17. It dates the emblem idea to the Middle Ages; it is not evidence of an ancient banner. The century NEEDS SOURCE VERIFICATION.",
      },
    ],
    passages: [
      {
        label: "Genesis 49:16–17, Dan as judge and serpent",
        reference: "Genesis 49:16–17",
        sourceKey: "wlc_hebrew_bible",
        objectName: "Leningrad Codex, folio 30v",
        holdingInstitution: "National Library of Russia, St Petersburg",
        accessionNumber: "Firkovich B 19 A",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            content: "דָּ֖ן יָדִ֣ין עַמּ֑וֹ כְּאַחַ֖ד שִׁבְטֵ֥י יִשְׂרָאֵֽל׃ יְהִי־דָן֙ נָחָ֣שׁ עֲלֵי־דֶ֔רֶךְ שְׁפִיפֹ֖ן עֲלֵי־אֹ֑רַח הַנֹּשֵׁךְ֙ עִקְּבֵי־ס֔וּס וַיִּפֹּ֥ל רֹכְב֖וֹ אָחֽוֹר׃",
            language: "Hebrew",
            script: "Hebrew (square script with Tiberian vowels and accents)",
            evidence: "Masoretic text. נָחָשׁ (nāḥāš, 'snake') and שְׁפִיפֹן (šəp̄îp̄ōn, a hapax legomenon, probably 'horned viper') are the two serpent words; דָּן יָדִין repeats the pun on d-y-n.",
          },
          {
            layer: "transliteration",
            sourceKey: null,
            content:
              "dān yādîn ʿammô kəʾaḥad šiḇṭê yiśrāʾēl / yəhî-ḏān nāḥāš ʿălê-ḏereḵ šəp̄îp̄ōn ʿălê-ʾōraḥ hannōšēḵ ʿiqqəḇê-sûs wayyippōl rōḵəḇô ʾāḥôr",
            language: "Hebrew",
            script: "Latin (academic transliteration)",
            evidence: "Transliteration made for this record.",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            content:
              "Dan shall judge his people, as one of the tribes of Israel. Dan shall be a serpent by the way, an adder in the path, that biteth the horse heels, so that his rider shall fall backward.",
            language: "English",
            viewpoint: "religious",
            evidence: "KJV. 'Adder' is a translator's guess for šəp̄îp̄ōn; modern versions often have 'viper' or 'horned snake'.",
          },
        ],
      },
    ],
    media: [pFolioGen49, pHeichalShlomoSerpent],
  },
  {
    slug: "dan-and-ships-judges-5-17",
    title: "Judges 5:17: 'Why did Dan remain in ships?'",
    summary:
      "The Song of Deborah rebukes tribes that did not join the battle, asking why Dan 'abides' (yāḡûr) by ships (ʾŏniyyôṯ). It is the only text tying Dan to the sea, and it is the foundation of Yadin's Sea Peoples hypothesis.",
    description:
      "WHAT THE TEXT SAYS. 'Gilead abode beyond Jordan: and why did Dan remain in ships? Asher continued on the sea shore, and abode in his breaches' (Judges 5:17, KJV). The Song of Deborah praises the tribes that fought against Sisera and taunts those that stayed away.\n\n" +
      "THE DIFFICULTIES. The verb yāḡûr can mean 'sojourn, dwell as a client' or, from a homonymous root, 'fear'. The Danites of Judges 18 live inland, between Zorah and Eshtaol, and then far inland at Laish, so the ships are hard to place. Ancient and medieval commentators struggled: the Targum and Rashi read 'Dan put his money in ships so that he could flee'; David Kimhi insisted Dan had no coast and the ships were on the Jordan. Joshua 19:46 gives Dan a southern allotment reaching 'over against Joppa', which would put Dan by the sea if it reflects any reality. Some modern readers take the line as Dan serving as hired labour on Phoenician or other ships.\n\n" +
      "THE DATE OF THE SONG. Judges 5 is widely held to be one of the oldest poems in the Bible; Cross and Freedman placed it in the twelfth century BCE, and even scholars who date it later accept that it is older than the prose of Judges 4. It is still a poem preserved in a book edited centuries later.\n\n" +
      "WHY IT MATTERS. Yigael Yadin (1968) built his argument that Dan was connected with the Denyen/Danuna Sea People on this verse (see the record on that hypothesis). For this track it is also the closest the Bible comes to placing Danites on the Mediterranean, the only conceivable starting point for any sea route, and it says nothing about Africa.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes an early Israelite tradition associating Dan with ships. It does not establish where Dan lived when the poem was composed, what the ships were, or any maritime migration.",
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: dan (tribe)", "theme: migration traditions"], "judges", "song of deborah", "ships"),
    people: ["Deborah", "Barak", "Sisera"],
    civilisations: ["Tribe of Dan", "Ancient Israel"],
    locationName: "Dan's southern allotment near the coast by Joppa (Joshua 19:40–46)",
    lat: 31.78,
    lng: 34.98,
    claims: [
      {
        sourceKey: "cross_freedman_1975_yahwistic_poetry",
        citations: [{ sourceKey: "yadin_1968_dan_ships", relation: "supports", note: "Yadin dates the verse to an early stage of Dan's settlement on the coast, in the 12th century BCE." }],
        startYear: bce(1150),
        endYear: bce(1050),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The composition of the Song of Deborah, on the early-dating view",
        originalDateText: "Twelfth-century BCE victory song, on the early-dating view",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Dated by archaic language and by its fit with an Iron I setting. It dates the poem; the battle itself has no independent attestation.",
      },
      {
        sourceKey: "wlc_hebrew_bible",
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "Dan's absence from Deborah's battle as narrated",
        originalDateText: "In the days of Deborah; no date in the text",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: biblical narrative. The Song names no king, year or external event that can be dated, so the narrated moment is not placed on the timeline.",
      },
    ],
    passages: [
      {
        label: "Judges 5:17, Dan and the ships",
        reference: "Judges 5:17",
        sourceKey: "wlc_hebrew_bible",
        objectName: "Leningrad Codex, folio 139r",
        holdingInstitution: "National Library of Russia, St Petersburg",
        accessionNumber: "Firkovich B 19 A",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            content: "גִּלְעָ֗ד בְּעֵ֤בֶר הַיַּרְדֵּן֙ שָׁכֵ֔ן וְדָ֕ן לָ֥מָּה יָג֖וּר אֳנִיּ֑וֹת אָשֵׁ֗ר יָשַׁב֙ לְח֣וֹף יַמִּ֔ים וְעַ֥ל מִפְרָצָ֖יו יִשְׁכּֽוֹן׃",
            language: "Hebrew",
            script: "Hebrew (square script with Tiberian vowels and accents)",
            evidence: "Masoretic text. וְדָן לָמָּה יָגוּר אֳנִיּוֹת: 'and Dan, why does he sojourn (or: fear) ships?'",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            content:
              "Gilead abode beyond Jordan: and why did Dan remain in ships? Asher continued on the sea shore, and abode in his breaches.",
            language: "English",
            viewpoint: "religious",
            evidence: "KJV. 'Remain in ships' supplies a preposition the Hebrew does not have.",
          },
          {
            layer: "interpretation",
            sourceKey: "yadin_1968_dan_ships",
            content:
              "Yadin: 'one must inevitably reach the conclusion that this verse, as it stands, refers to a stage at which Dan dwelt by the shores of the Great Sea and engaged in ships.'",
            language: "English",
            viewpoint: "hypothesis",
            evidence: "Quoted from Yadin 1968, p. 14, read in this session. A proponent's reading, kept as an interpretation.",
          },
        ],
      },
    ],
    media: [pFolioJudg5, pMadaba],
  },
  {
    slug: "danite-migration-to-laish-judges-18",
    title: "Judges 18: the Danites take Laish and rename it Dan",
    summary:
      "Judges 18 tells how the landless Danites sent spies north, took Micah's image and his Levite on the way, destroyed the 'quiet and secure' city of Laish and rebuilt it as Dan. The excavated Bronze Age city of Laish is real; the migration is known only from this text, written after 732 BCE.",
    description:
      "WHAT THE TEXT SAYS. 'In those days the tribe of the Danites sought them an inheritance to dwell in; for unto that day all their inheritance had not fallen unto them among the tribes of Israel' (Judges 18:1). Five men from Zorah and Eshtaol scout the land, find Laish living 'after the manner of the Zidonians, quiet and secure', and report back. Six hundred armed men set out with their families, take the carved image, ephod and teraphim from the shrine of Micah in Ephraim and persuade his Levite to come with them, burn Laish and rebuild it: 'they called the name of the city Dan, after the name of Dan their father... howbeit the name of the city was Laish at the first' (18:29). Joshua 19:47 gives a short version, calling the city Leshem.\n\n" +
      "WHAT IS EXCAVATED. Laish existed. The site at Tel Dan has a massive Middle Bronze Age rampart and an arched mud-brick gate of the eighteenth century BCE, and Laish appears in Egyptian Execration Texts, at Mari, and in Thutmose III's list of conquered cities. The Iron Age I strata (twelfth to eleventh centuries BCE) show a new settlement with grain pits, metal-working and collared-rim jars, which Biran associated with the Danite arrival. Pottery alone cannot say who the settlers were, and the excavators also record Phoenician and 'Sea People' pottery in that horizon.\n\n" +
      "THE DATE OF THE TEXT. The narrator ends by saying that the Danite priests served 'until the day of the captivity of the land' (18:30), so the text in its present form was written after the Assyrian deportations of 732 or 722 BCE. Its refrain 'in those days there was no king in Israel' frames the story as a picture of disorder before the monarchy, and its account of a stolen idol and a hired priest is hostile to the sanctuary at Dan.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a pre-Israelite city at the site, a change of settlement in Iron Age I and a later Israelite story explaining the city's name and its shrine. It does not establish who the Iron I settlers were, that they came from the south-west coast, or when; the migration is a single tradition, and Yadin's Sea Peoples reading of it is a hypothesis.",
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: dan (tribe)", "theme: migration traditions", "place: tel dan"], "judges", "laish"),
    people: ["Micah (of Ephraim)", "Jonathan son of Gershom"],
    civilisations: ["Tribe of Dan", "Laish (Canaanite city)", "Sidonians"],
    ...TEL_DAN,
    claims: [
      {
        sourceKey: "wlc_hebrew_bible",
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The Danite conquest of Laish as narrated",
        originalDateText: "'In those days there was no king in Israel'",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "EVIDENCE TYPE: biblical narrative. The story is set before the monarchy but gives no date; Yadin's c. 1100 BCE is an inference from the weakness of Sidon, not a date in the text. Not placed on the timeline.",
      },
      {
        sourceKey: "ngsba_tel_dan_strata",
        citations: [{ sourceKey: "biran_1994_biblical_dan", relation: "context", note: "Biran linked the Iron I settlement with the Danite arrival; the link is an interpretation." }],
        startYear: bce(1200),
        endYear: bce(1000),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The Iron Age I settlement at Tel Dan (strata VI–V)",
        originalDateText: "Strata VI–V, Iron IA, 12th–11th centuries BCE",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. A new village of storage pits and metal-working dated by pottery. It shows a change in settlement; it carries no ethnic label and does not show where the newcomers came from.",
      },
      {
        sourceKey: "schmid_2012_ot_literary_history",
        startYear: bce(722),
        endYear: bce(550),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "after_event",
        whatIsDated: "The writing of Judges 18 in its present form",
        originalDateText: "'Until the day of the captivity of the land': written after the Assyrian deportations",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The text's own reference to 'the captivity of the land' gives a date after 732/722 BCE for its present form; older material may lie behind it.",
      },
    ],
    passages: [
      {
        label: "Judges 18:29, Laish renamed Dan",
        reference: "Judges 18:29",
        sourceKey: "wlc_hebrew_bible",
        objectName: "Leningrad Codex, folios 147v–148r",
        holdingInstitution: "National Library of Russia, St Petersburg",
        accessionNumber: "Firkovich B 19 A",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            content: "וַיִּקְרְא֤וּ שֵׁם־הָעִיר֙ דָּ֔ן בְּשֵׁם֙ דָּ֣ן אֲבִיהֶ֔ם אֲשֶׁ֥ר יוּלַּ֖ד לְיִשְׂרָאֵ֑ל וְאוּלָ֛ם לַ֥יִשׁ שֵׁם־הָעִ֖יר לָרִאשֹׁנָֽה׃",
            language: "Hebrew",
            script: "Hebrew (square script with Tiberian vowels and accents)",
            evidence: "Masoretic text. לַיִשׁ (layiš, 'Laish') is the city's former name.",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            content:
              "And they called the name of the city Dan, after the name of Dan their father, who was born unto Israel: howbeit the name of the city was Laish at the first.",
            language: "English",
            viewpoint: "religious",
            evidence: "KJV.",
          },
        ],
      },
    ],
    media: [pCanaaniteGate, pFolioJudg18a, pCanaaniteGate2017],
  },
  {
    slug: "jonathan-son-of-gershom-danite-priesthood",
    title: "Jonathan son of Gershom: the Danite priesthood and the suspended nun",
    summary:
      "Judges 18:30 names the priest of Dan's image as 'Jonathan, son of Gershom, son of M(n)sh', with the n written above the line. The consonants without it spell Moses; the Masoretic text, by raising the letter, reads Manasseh. The verse claims a priestly line descended from Moses served at Dan 'until the captivity of the land'.",
    description:
      "WHAT THE TEXT SAYS. 'And the children of Dan set up the graven image: and Jonathan, the son of Gershom, the son of Manasseh, he and his sons were priests to the tribe of Dan until the day of the captivity of the land. And they set them up Micah's graven image, which he made, all the time that the house of God was in Shiloh' (Judges 18:30–31, KJV).\n\n" +
      "THE SUSPENDED NUN. In the Masoretic manuscripts the name of Jonathan's grandfather is written מ־נ־שה with the nun raised above the line. Without it the consonants are משה, Moses; and Gershom is the name of Moses' son (Exodus 2:22; 1 Chronicles 23:15). The Babylonian Talmud (Bava Batra 109b) states the problem directly: 'wasn't he the son of Moses?... because he acted as Manasseh the king of Judah... acted, the verse linked him to Manasseh.' The Vulgate and some Greek manuscripts read Moses outright. Most modern scholars accept that 'Moses' is original and that the nun was added to spare Moses' name the association with an idolatrous shrine.\n\n" +
      "WHAT IT CLAIMS. A hereditary priesthood at Dan, descended from Moses through Gershom, lasting until the deportations. Many historians take this as a genuine memory that the priests of Dan claimed Mosaic descent, in rivalry with the Aaronide priests of Jerusalem; the hostile frame (a stolen image, a priest who goes to the highest bidder) is the Jerusalem view of that rival line.\n\n" +
      "WHY IT MATTERS FOR THIS TRACK. It is the closest textual link between Dan and Moses, and so the nearest the Bible comes to connecting Dan with Moses' bronze serpent. It does not make that connection: no text says the Danite priests kept Nehushtan or any serpent image, and the image at Dan is called a pesel (carved image) and, under Jeroboam, a calf.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a biblical tradition of a Mosaic priestly line at Dan and a deliberate scribal alteration of its ancestor's name. It does not establish the historical existence of Jonathan, the date of the priesthood's founding, or any serpent cult.",
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: dan (tribe)", "theme: priesthood", "theme: manuscripts and their dates", "place: tel dan"], "judges", "suspended nun", "moses"),
    people: ["Jonathan son of Gershom", "Gershom", "Moses", "Micah (of Ephraim)"],
    civilisations: ["Tribe of Dan", "Ancient Israel"],
    ...TEL_DAN,
    claims: [
      {
        sourceKey: "wlc_hebrew_bible",
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The founding of Jonathan's priesthood at Dan as narrated",
        originalDateText: "Jonathan, grandson of Moses, priest at Dan 'until the day of the captivity of the land'",
        datingMethod: "genealogy",
        chronology: "traditional",
        evidence:
          "EVIDENCE TYPE: biblical narrative. A genealogical claim in a hostile narrative; it gives no date and has no outside confirmation, so it is not placed on the timeline.",
      },
      {
        sourceKey: "bava_batra_109b",
        startYear: 500,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest dated discussion of the Moses/Manasseh reading",
        originalDateText: "Bava Batra 109b: 'because he acted as Manasseh... the verse linked him to Manasseh'",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: religious tradition. The Talmud's redaction (c. 500–600 CE) dates this explanation, not the scribal alteration, which must be older.",
      },
      {
        sourceKey: "wlc_hebrew_bible",
        startYear: 1008,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The suspended nun as written in the oldest complete Masoretic codex",
        originalDateText: "Folio 148r of the Leningrad Codex, 1008–1009 CE",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later manuscript. The raised nun is a fixed Masoretic feature; this copy shows it by 1008–1009 CE.",
      },
    ],
    passages: [
      {
        label: "Judges 18:30–31, the priests of Dan",
        reference: "Judges 18:30–31",
        sourceKey: "wlc_hebrew_bible",
        objectName: "Leningrad Codex, folio 148r",
        holdingInstitution: "National Library of Russia, St Petersburg",
        accessionNumber: "Firkovich B 19 A",
        notes: "The Westminster encoding marks the nun of מְנַשֶּׁה as a suspended letter; plain Unicode cannot raise it, so it is printed on the line here.",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            content: "וַיָּקִ֧ימוּ לָהֶ֛ם בְּנֵי־דָ֖ן אֶת־הַפָּ֑סֶל וִ֠יהוֹנָתָן בֶּן־גֵּרְשֹׁ֨ם בֶּן־מְנַשֶּׁ֜ה ה֣וּא וּבָנָ֗יו הָי֤וּ כֹהֲנִים֙ לְשֵׁ֣בֶט הַדָּנִ֔י עַד־י֖וֹם גְּל֥וֹת הָאָֽרֶץ׃ וַיָּשִׂ֣ימוּ לָהֶ֔ם אֶת־פֶּ֥סֶל מִיכָ֖ה אֲשֶׁ֣ר עָשָׂ֑ה כָּל־יְמֵ֛י הֱי֥וֹת בֵּית־הָאֱלֹהִ֖ים בְּשִׁלֹֽה׃",
            language: "Hebrew",
            script: "Hebrew (square script with Tiberian vowels and accents)",
            evidence: "Masoretic text. In the manuscript the נ of מְנַשֶּׁה is written above the line (the WLC marks it 'x-suspended').",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            content:
              "And the children of Dan set up the graven image: and Jonathan, the son of Gershom, the son of Manasseh, he and his sons were priests to the tribe of Dan until the day of the captivity of the land. And they set them up Micah's graven image, which he made, all the time that the house of God was in Shiloh.",
            language: "English",
            viewpoint: "religious",
            evidence: "KJV, following the Masoretic reading 'Manasseh'.",
          },
          {
            layer: "interpretation",
            sourceKey: "bava_batra_109b",
            content:
              "But is it so that he was the son of Manasseh; but wasn't he the son of Moses...? Rather, although he was the son of Moses, because he acted as Manasseh the king of Judah, who was notorious for idol worship, acted, the verse linked him to Manasseh.",
            language: "English",
            viewpoint: "religious",
            evidence: "Bava Batra 109b, William Davidson English edition on Sefaria, read in this session.",
          },
        ],
      },
    ],
    media: [pFolioJudg18b, pKultplatz],
  },

  // =========================================================================
  // TEL DAN
  // =========================================================================
  {
    slug: "tel-dan-sacred-precinct-area-t",
    title: "The sacred precinct at Tel Dan (Area T): what was excavated and when",
    summary:
      "Biran's excavations uncovered in Area T a large Iron Age II cult complex: an ashlar platform (the 'bamah'), a courtyard with a monumental horned altar, side chambers, small altars and implements. Biran tied its first phase to Jeroboam I in the late tenth century BCE; the excavators' own table now gives the ninth century, and Arie argues for the late ninth or early eighth.",
    description:
      "WHAT IS EXCAVATED. In the north of the mound, near the springs, Biran found from 1968 a sacred enclosure built in several phases: a large platform of well-dressed ashlar masonry with headers and stretchers, a courtyard in front of it with a square altar enclosure in which one large stone horn of a four-horned altar was found, a row of chambers to the west, smaller altars, metal implements (iron shovels and a bronze bowl), a stone installation first read as a water-libation installation and later as an olive-oil press, stands, figurines and very large quantities of animal bone and pottery. Cult activity continued at the spot in the Hellenistic and Roman periods, when a bilingual Greek and Aramaic dedication 'to the god who is in Dan' was set up.\n\n" +
      "THE PHASES. The Nelson Glueck School's stratigraphy assigns 'Bamah A' with the 'High Place; snake pithoi, oil press, faience figurines' to Stratum IVA (Iron IIA, ninth century BCE), 'Bamah B' to IIIB (late ninth century, with the stele), 'Bamah C' with the ashlar 'high place' and 'yellow floor' to IIIA (early eighth century), and altars and standing stones to Stratum II (late eighth century), ending in the Assyrian-period destruction.\n\n" +
      "THE DATE DEBATE. Biran identified Bamah A with the sanctuary Jeroboam I founded (1 Kings 12), i.e. the late tenth century BCE. Eran Arie (2008) re-examined the pottery and argued that Dan was deserted or a small rural site in Iron IIA and that Stratum IVA should be down-dated to the end of the ninth or the beginning of the eighth century, which would make the precinct a monument of later Israelite (or Aramaean-period) Dan rather than Jeroboam's foundation. Greer (2013) works with the excavators' ninth–eighth-century dates 'contra Arie'. The difference matters because the identification of the precinct with Jeroboam's shrine rests partly on its date.\n\n" +
      "WHOSE GOD. The precinct's god is not named in any Iron Age find. Greer argues for a Yahwistic cult (Yahwistic seal names, an 'altar kit', the biblical tradition); others (Noll, Athas) have suggested the Aramaean storm god Hadad during the period of Aramaean control attested by the stele.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a major, long-lived Iron Age II sanctuary with animal sacrifice at Dan. It does not establish that it was founded by Jeroboam I, that a calf stood in it (none was found), which god was worshipped in each phase, or any serpent cult (see the record on serpent imagery).",
    category: "archaeology",
    subcategory: SUB,
    eventType: "archaeological_interpretation",
    tags: serpentTags(LANE, ["place: tel dan", "theme: priesthood", "theme: sacred landscape", "figure: yhwh"], "area t", "high place", "biran"),
    people: ["Avraham Biran", "Eran Arie", "Jonathan S. Greer", "David Ilan", "Jeroboam I"],
    civilisations: ["Kingdom of Israel", "Aram-Damascus"],
    ...TEL_DAN,
    claims: [
      {
        sourceKey: "biran_1994_biblical_dan",
        startYear: bce(931),
        endYear: bce(910),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "proposed_correlation",
        whatIsDated: "The founding of the first phase of the precinct (Bamah A), on Biran's identification with Jeroboam I",
        originalDateText: "Bamah A as the sanctuary of Jeroboam I, late 10th century BCE (Biran)",
        datingMethod: "regnal_chronology",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Biran correlated the first phase with the biblical account of Jeroboam, whose reign is placed c. 931–910 BCE from the biblical regnal figures. It is a correlation with a text, not a measurement. NEEDS SOURCE VERIFICATION for Biran's exact wording.",
      },
      {
        sourceKey: "ngsba_tel_dan_strata",
        citations: [{ sourceKey: "greer_2013_dinner_at_dan", relation: "supports", note: "Dates the analysed deposits 'primarily to the 9th and 8th centuries B.C.E.'" }],
        startYear: bce(900),
        endYear: bce(800),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "Stratum IVA, Bamah A, in the excavators' current table",
        originalDateText: "IVA, Iron IIA, 9th century BCE (Bamah A)",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. The excavating institution's own table dates the first precinct phase to the ninth century by pottery and stratigraphy.",
      },
      {
        sourceKey: "arie_2008_tel_dan_strata",
        startYear: bce(810),
        endYear: bce(780),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "Stratum IVA on the low chronology",
        originalDateText: "Stratum IVA down-dated to the end of the 9th / beginning of the 8th century BCE (Arie)",
        datingMethod: "stylistic_comparison",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: archaeological. Arie's ceramic re-analysis. If correct, the precinct postdates Jeroboam I by over a century. Known from the abstract; NEEDS SOURCE VERIFICATION for the exact range.",
      },
    ],
    media: [pSacredPrecinct, pKultplatz, pTelDanGeneral],
  },
  {
    slug: "jeroboam-golden-calves-dan-and-bethel",
    title: "Jeroboam's golden calves at Dan and Bethel (1 Kings 12)",
    summary:
      "1 Kings 12:28–30 says Jeroboam I made two calves of gold, set one at Bethel and one at Dan, and proclaimed 'Behold thy gods, O Israel, which brought thee up out of the land of Egypt'. No calf has been found at Dan; the account is a Judahite condemnation written after the northern kingdom fell.",
    description:
      "WHAT THE TEXT SAYS. After the division of the kingdom, Jeroboam, fearing that pilgrimages to Jerusalem would win his people back to Judah, 'made two calves of gold, and said unto them, It is too much for you to go up to Jerusalem: behold thy gods, O Israel, which brought thee up out of the land of Egypt. And he set the one in Bethel, and the other put he in Dan. And this thing became a sin: for the people went to worship before the one, even unto Dan' (1 Kings 12:28–30). He also built a 'house of high places' and appointed non-Levite priests (12:31). 'The sin of Jeroboam' becomes the Deuteronomistic historian's verdict on every northern king.\n\n" +
      "THE BULL IMAGE. The word is ʿēgel, a young bull. Many historians think the bulls were pedestals or emblems of the invisible God of Israel (as the cherubim were in Jerusalem) rather than idols, and that the historian has turned them into 'gods' to condemn them; the phrase repeats Aaron's calf in Exodus 32, and the two stories are literary mirrors. Bull imagery was at home in the region: the bronze bull from the Iron Age I 'Bull Site' in the Samaria hills (Mazar 1982) and the storm god's bull in Canaanite and Aramaean iconography. Hosea (8:5–6; 10:5) condemns the 'calf of Samaria' and the calf of Beth-aven, independent evidence that bull images were part of northern cult in the eighth century.\n\n" +
      "WHAT IS NOT FOUND. No bull or calf image, and no gold, has been recovered from the Tel Dan precinct. Biran's identification of Area T with Jeroboam's 'house of high places' is an inference from location and (disputed) date.\n\n" +
      "WHY IT MATTERS FOR THIS TRACK. The cult image the Bible attaches to Dan is a BULL, not a serpent. The serpent object of the Bible, Nehushtan, is located in Jerusalem, not Dan.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a Judahite tradition that Dan was a royal cult centre of the northern kingdom with a bull image, consistent with the excavated sanctuary and with Hosea. It does not establish the form or meaning of the image, that it stood in the excavated precinct, or Jeroboam's date of founding.",
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: yhwh", "place: tel dan", "theme: kingship", "theme: priesthood"], "golden calf", "bull", "bethel"),
    people: ["Jeroboam I", "Hosea"],
    civilisations: ["Kingdom of Israel", "Kingdom of Judah"],
    ...TEL_DAN,
    claims: [
      {
        sourceKey: "wlc_hebrew_bible",
        startYear: bce(931),
        endYear: bce(910),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "Jeroboam's setting up of the calf at Dan as narrated",
        originalDateText: "In the reign of Jeroboam I, after the division of the kingdom",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence:
          "EVIDENCE TYPE: biblical narrative. The reign is placed c. 931–910 BCE by reckoning the biblical regnal figures against later Assyrian synchronisms. That dates the king in the biblical framework; it does not confirm the act.",
      },
      {
        sourceKey: "schmid_2012_ot_literary_history",
        startYear: bce(620),
        endYear: bce(550),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The writing of 1 Kings 12:25–33",
        originalDateText: "Deuteronomistic history, late 7th to mid-6th century BCE",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The account is part of a Judahite history written about three centuries after Jeroboam and after the north had fallen; its purpose is to explain that fall.",
      },
      {
        sourceKey: "mazar_1982_bull_site",
        startYear: bce(1200),
        endYear: bce(1100),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The bronze bull from the 'Bull Site' in the Samaria hills (comparative, not from Dan)",
        originalDateText: "Iron Age I bronze bull, 12th century BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. A dated bull image from an early Israelite-area cult place. It shows bull imagery in regional cult; it is not Jeroboam's calf.",
      },
    ],
    passages: [
      {
        label: "1 Kings 12:28–30, the calves of Bethel and Dan",
        reference: "1 Kings 12:28–30",
        sourceKey: "wlc_hebrew_bible",
        objectName: "Leningrad Codex, folio 194v",
        holdingInstitution: "National Library of Russia, St Petersburg",
        accessionNumber: "Firkovich B 19 A",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            content: "וַיִּוָּעַ֣ץ הַמֶּ֔לֶךְ וַיַּ֕עַשׂ שְׁנֵ֖י עֶגְלֵ֣י זָהָ֑ב וַיֹּ֣אמֶר אֲלֵהֶ֗ם רַב־לָכֶם֙ מֵעֲל֣וֹת יְרוּשָׁלִַ֔ם הִנֵּ֤ה אֱלֹהֶ֨יךָ֙ יִשְׂרָאֵ֔ל אֲשֶׁ֥ר הֶעֱל֖וּךָ מֵאֶ֥רֶץ מִצְרָֽיִם׃ וַיָּ֥שֶׂם אֶת־הָאֶחָ֖ד בְּבֵֽית־אֵ֑ל וְאֶת־הָאֶחָ֖ד נָתַ֥ן בְּדָֽן׃ וַיְהִ֛י הַדָּבָ֥ר הַזֶּ֖ה לְחַטָּ֑את וַיֵּלְכ֥וּ הָעָ֛ם לִפְנֵ֥י הָאֶחָ֖ד עַד־דָּֽן׃",
            language: "Hebrew",
            script: "Hebrew (square script with Tiberian vowels and accents)",
            evidence: "Masoretic text. עֶגְלֵי זָהָב ('calves of gold'); בְּדָן ('in Dan').",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            content:
              "Whereupon the king took counsel, and made two calves of gold, and said unto them, It is too much for you to go up to Jerusalem: behold thy gods, O Israel, which brought thee up out of the land of Egypt. And he set the one in Bethel, and the other put he in Dan. And this thing became a sin: for the people went to worship before the one, even unto Dan.",
            language: "English",
            viewpoint: "religious",
            evidence: "KJV. 'Thy gods' renders the plural-form ʾĕlōhîm, which can also mean 'your God'.",
          },
        ],
      },
    ],
    media: [pFolio1Kgs12, pBullStatuette, pBibleHistoriale],
  },
  {
    slug: "tel-dan-altars-and-priestly-portions",
    title: "Altars, an altar kit and right-side bones: sacrifice at Tel Dan",
    summary:
      "Area T produced a monumental horned altar, small altars, iron shovels and a bronze bowl, and thousands of animal bones. Jonathan Greer's analysis found right-sided sheep and goat limbs concentrated in the western chambers (67% right) and left-sided ones in the courtyard (63% left), which he reads as the priests' 'right thigh' of Leviticus 7:32–33.",
    description:
      "WHAT IS EXCAVATED. In the courtyard of the precinct stood a large altar of which one stone horn survives; the BAS describes a '1.5-foot-tall basalt \"horn\" from an Israelite altar'. Smaller horned altars, iron shovels and a bronze bowl were found in the western chambers, which Greer calls an 'altar kit' comparable with the implements of the Tabernacle and Temple and reads the bowl as a mizraq for blood rites (Greer 2010). The bones are almost entirely sheep, goat and cattle, with a few gazelle, deer, donkey and bird; no pig.\n\n" +
      "GREER'S ANALYSIS. From the unpublished field records Greer isolated six feasting deposits 'dating primarily to the 9th and 8th centuries B.C.E.', some around the altar and some in the western chambers. In his own summary (2014): the western chamber deposit WD2 contained '67% right-sided and 33% left-sided' meaty sheep/goat limb bones, against '37% right-sided and 63% left-sided' in the courtyard; 'toe bones' made up 26–63% of the western assemblages against 4–17% in the courtyard; sheep and goat were 80% against 74%; painted wares 11–25% against at most 6%. All four contrasts were statistically significant (χ² test).\n\n" +
      "HIS INTERPRETATION. If the western chambers were the priests' domain (as Biran first suggested) the contrasts match priestly prescriptions: the priest receives the right leg of the fellowship offering (Exod 29:27–28; Lev 7:32–33), the skin of the burnt offering, with the toe bones still in the hooves (Lev 7:8), and whole sheep or goats from sin and guilt offerings. Greer himself names two problems: the priestly texts may be Persian-period, and similar rites are known from Ugarit, Mari, Hatti and Egypt, so the pattern may not be specifically Israelite. Right-foreleg concentrations are known elsewhere (for example at Tel Qiri).\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes animal sacrifice and sacred meals at Dan in the Iron Age II period, with a statistically distinct priestly area. It does not establish that the rules followed were those of Leviticus, which god was worshipped, or anything about serpents; no snake bones or serpent cult equipment are reported in these deposits.",
    category: "archaeology",
    subcategory: SUB,
    eventType: "archaeological_interpretation",
    tags: serpentTags(LANE, ["place: tel dan", "theme: priesthood", "figure: yhwh"], "sacrifice", "faunal remains", "altar"),
    people: ["Jonathan S. Greer", "Avraham Biran", "Paula Wapnish", "Brian Hesse"],
    civilisations: ["Kingdom of Israel"],
    ...TEL_DAN,
    claims: [
      {
        sourceKey: "greer_2014_israelite_sacrifice_tel_dan",
        citations: [
          { sourceKey: "greer_2013_dinner_at_dan", relation: "supports", note: "The full publication of the analysis summarised in 2014." },
          { sourceKey: "arie_2008_tel_dan_strata", relation: "disputes", note: "Greer dates the deposits 'with Biran 1994a; contra Arie 2008'; on Arie's chronology they shift later." },
        ],
        startYear: bce(900),
        endYear: bce(732),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The feasting deposits with the right/left contrast",
        originalDateText: "Deposits dating primarily to the 9th and 8th centuries B.C.E.",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. Dated by stratigraphy and associated pottery on the excavators' sequence. The date is only as good as that sequence, which is disputed.",
      },
      {
        sourceKey: "greer_2013_dinner_at_dan",
        citations: [{ sourceKey: "bas_2016_greer_tel_dan", relation: "supports", note: "An independent summary of the right/left pattern and the priestly reading." }],
        startYear: 2013,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of the faunal analysis and the priestly-portion interpretation",
        originalDateText: "Dinner at Dan (Brill, 2013)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The date of the scholarly argument, which connects archaeological patterns to biblical prescriptions; the connection is an interpretation, as Greer says.",
      },
    ],
    passages: [
      {
        label: "Greer's summary of the right/left contrast",
        reference: "Greer 2014, pp. 3–4",
        sourceKey: "greer_2014_israelite_sacrifice_tel_dan",
        layers: [
          {
            layer: "modern_summary",
            sourceKey: "greer_2014_israelite_sacrifice_tel_dan",
            content:
              "the western chamber deposit WD2 (the sample size in WD1 was too small for analysis) contained 67% right-sided and 33% left-sided remains from sideable meaty limb bone sheep and goat remains... in contrast to the combined courtyard deposits containing 37% right-sided and 63% left-sided remains.",
            language: "English",
            viewpoint: "archaeological",
            evidence: "Quoted from Greer's essay, read in full in this session.",
          },
          {
            layer: "interpretation",
            sourceKey: "greer_2014_israelite_sacrifice_tel_dan",
            content:
              "when the side of the limb portion is specified it is always the right-sided portion that is given to the priest (cf. Exod 29:27-28; Lev 7:32-33). Thus, the higher percentage of right-sided limb bone fragments in the western chambers may be explained as the remains of meals in which the priests consumed their portions of fellowship offerings surrendered by worshipers.",
            language: "English",
            viewpoint: "archaeological",
            evidence: "Greer's own interpretation, p. 6; he goes on to state the two problems with it.",
          },
        ],
      },
    ],
    media: [pAltarOutline, pAltarView],
  },
  {
    slug: "tel-dan-serpent-imagery-what-is-reported",
    title: "Serpent imagery at Tel Dan: the 'snake pithoi' and what is not reported",
    summary:
      "The excavators' own table lists 'snake pithoi' (large storage jars with snake decoration in relief) from the first phase of the sacred precinct, ninth century BCE. That is the only serpent imagery from Tel Dan found in this research. No serpent figurine, bronze serpent, serpent shrine or text linking the precinct to a serpent god is reported.",
    description:
      "WHAT IS REPORTED. The Nelson Glueck School's stratigraphic table for Tel Dan lists, for Stratum IVA (Iron IIA, ninth century BCE, 'Bamah A'): 'High Place; snake pithoi, oil press, faience figurines'. Secondary descriptions of Biran's finds speak of two large pithoi (storage jars of a few hundred litres) found near the oil-press installation in Area T, each with a snake modelled in relief coiling around the body of the jar, and of further fragments in later phases of the precinct. Biran published them in Biblical Dan (1994) and in a 1998 Biblical Archaeology Review article; neither was opened in this session, and the description of the decoration NEEDS SOURCE VERIFICATION against them.\n\n" +
      "HOW THEY HAVE BEEN READ. As cult vessels for liquids (oil or libations) used in the precinct; one popular summary says Biran linked the snake to cult and to Baal, a claim not confirmed here from Biran's own words. Snake decoration in relief on pottery has a long history in the southern Levant, from the Early Bronze Age onward, and snake-decorated cult vessels are known from Bronze Age Canaanite sites, so the motif at Dan belongs to a wider regional repertoire (serpents associated with fertility, healing or protection) rather than to anything specific to Dan.\n\n" +
      "WHAT IS NOT REPORTED. No bronze serpent like those from Late Bronze Age Hazor, Megiddo, Gezer or Timna; no serpent figurine; no inscription naming a serpent deity; no text tying the snake jars to Genesis 49:17. Nothing at Tel Dan has been identified as Nehushtan or as a serpent cult image.\n\n" +
      "IMAGE GAP: the Tel Dan snake pithoi — no freely licensed photograph or drawing was found on Wikimedia Commons; the excavation's own publication is Biran, Biblical Dan (1994) and the stratigraphy page https://ngsba.org/excavations/tel-dan/ (which names but does not picture them). The picture here is of the precinct where they were found, not of the jars.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that serpent decoration was used on large cult vessels in Dan's sanctuary in the ninth century BCE (or the late ninth / early eighth on Arie's chronology). It does not establish a serpent cult, a serpent god, or any connection with the Genesis simile, with Nehushtan, with Egyptian cobra iconography or with West African python veneration.",
    category: "archaeology",
    subcategory: SUB,
    eventType: "archaeological_interpretation",
    tags: serpentTags(LANE, ["place: tel dan", "figure: dan (tribe)", "theme: healing and protection"], "snake pithoi", "serpent motif"),
    people: ["Avraham Biran"],
    civilisations: ["Kingdom of Israel"],
    ...TEL_DAN,
    claims: [
      {
        sourceKey: "ngsba_tel_dan_strata",
        citations: [{ sourceKey: "biran_1994_biblical_dan", relation: "supports", note: "The excavator's publication of the precinct finds; the snake jars' description NEEDS SOURCE VERIFICATION there." }],
        startYear: bce(900),
        endYear: bce(800),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The snake pithoi of the first precinct phase",
        originalDateText: "IVA, Iron IIA, 9th century BCE (Bamah A): 'snake pithoi'",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. Dated with Stratum IVA in the excavators' table. Fragments from later phases are reported in secondary summaries only.",
      },
      {
        sourceKey: "arie_2008_tel_dan_strata",
        startYear: bce(810),
        endYear: bce(780),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The same stratum on the low chronology",
        originalDateText: "Stratum IVA at the end of the 9th / start of the 8th century BCE",
        datingMethod: "stylistic_comparison",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: archaeological. Arie's lower dating of Stratum IVA would move the snake jars with it.",
      },
    ],
    media: [pSacredPrecinct],
  },
  {
    slug: "tel-dan-stele-date-anchor",
    title: "The Tel Dan Stele: a ninth-century date anchor for the site",
    summary:
      "Fragments of a basalt Aramaic royal inscription found at Tel Dan in 1993–94 record a king of Damascus, generally taken to be Hazael, boasting of killing a king of Israel and a king of the 'House of David'. For this lane it matters as a fixed point: Dan was under Aramaean control at some point in the later ninth century BCE.",
    description:
      "WHAT WAS FOUND. Fragment A was found in July 1993 built into a later wall near the Iron Age gate plaza; fragments B1 and B2 in June 1994. Biran and Naveh published them in the Israel Exploration Journal (1993, 1995). The text is in Old Aramaic in the Phoenician-derived alphabet; the speaker is a king of Aram whose father 'lay down' and who claims that Hadad made him king and went before him; he says he killed '[...]ram son of [...] king of Israel' and '[...]yahu son of [...] of the House of David' (byt dwd). The names are usually restored as Joram of Israel and Ahaziah of Judah, which fits Hazael's wars of c. 841 BCE (2 Kings 8–9), though the restoration and the joining of the fragments are debated.\n\n" +
      "WHY IT IS HERE ONLY AS A DATE ANCHOR. The stele says nothing about the tribe of Dan, Danites or serpents. Its value for this track is chronological: it was set up at Dan by an Aramaean ruler in the second half of the ninth century and broken and reused when Israel recovered the city (the Nelson Glueck School suggests under Jeroboam II, early eighth century). It shows Aramaean control of Dan in the period of Bamah B, and it is the reason some scholars ask whether the precinct's god in that phase was Hadad rather than YHWH.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes an Aramaean royal monument at Dan in the later ninth century BCE and the earliest extra-biblical mention of a dynasty called the House of David. It does not mention Dan's tribe, does not date the founding of the sanctuary, and tells nothing about serpent imagery.",
    category: "archaeology",
    subcategory: SUB,
    eventType: "archaeological_interpretation",
    tags: serpentTags(LANE, ["place: tel dan", "theme: kingship", "theme: manuscripts and their dates"], "inscription", "house of david", "aramaic"),
    people: ["Hazael", "Avraham Biran", "Joseph Naveh", "Gila Cook"],
    civilisations: ["Aram-Damascus", "Kingdom of Israel", "Kingdom of Judah"],
    ...TEL_DAN,
    claims: [
      {
        sourceKey: "biran_naveh_1993_1995_tel_dan_stele",
        citations: [{ sourceKey: "ngsba_tel_dan_strata", relation: "supports", note: "Places the inscription in Stratum IIIB, late 9th century, 'probably written... by the Aramaean king Hazael'." }],
        startYear: bce(841),
        endYear: bce(800),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The setting up of the stele",
        originalDateText: "Second half of the 9th century BCE, probably by Hazael",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Dated by palaeography, context and the historical fit with Hazael's wars. Other proposals (Ben-Hadad III, c. 796 BCE) keep it within a few decades.",
      },
      {
        sourceKey: "biran_naveh_1993_1995_tel_dan_stele",
        startYear: 1993,
        startMonth: 7,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The discovery of Fragment A",
        originalDateText: "Fragment A found July 1993; B1 and B2 June 1994",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The excavators' publication records the discovery dates.",
      },
    ],
    media: [pStele, pSteleDrawing],
  },

  // =========================================================================
  // NEHUSHTAN AND TIMNA
  // =========================================================================
  {
    slug: "nehushtan-bronze-serpent-numbers-and-kings",
    title: "Nehushtan: the bronze serpent in Numbers 21 and 2 Kings 18",
    summary:
      "Numbers 21:4–9 says Moses made a nəḥaš nəḥōšet, a serpent of bronze, set it on a pole, and those bitten by the 'fiery serpents' who looked at it lived. 2 Kings 18:4 says King Hezekiah broke it in pieces because Israelites were burning incense to it, and that it was called Nehushtan. A healing image became a cult object in Jerusalem's temple and was destroyed in a reform.",
    description:
      "WHAT THE TEXTS SAY. In the wilderness the people complain; 'the LORD sent fiery serpents (hannəḥāšîm haśśərāp̄îm) among the people'; Moses is told 'Make thee a fiery serpent (śārāp̄), and set it upon a pole'; 'Moses made a serpent of brass (nəḥaš nəḥōšet)... and it came to pass, that if a serpent had bitten any man, when he beheld the serpent of brass, he lived' (Numbers 21:6–9). Centuries later in the narrative, Hezekiah of Judah (c. 715–686 BCE) 'removed the high places... and brake in pieces the brasen serpent that Moses had made: for unto those days the children of Israel did burn incense to it: and he called it Nehushtan' (2 Kings 18:4). The name plays on nāḥāš 'serpent' and nəḥōšet 'bronze'.\n\n" +
      "WHAT IT WAS. An apotropaic and healing image of a type well known in the Bronze and Iron Age Levant: bronze serpents were found at Late Bronze Age Hazor, Megiddo, Gezer and Shechem, and a copper serpent with a gilded head in the shrine at Timna. Joines (1968) and later writers read Nehushtan as such an object, given a Mosaic origin story, that had become a focus of worship in Jerusalem. Śārāp̄ ('burning one') is also the word for the winged serpents of Isaiah 6, which many relate to the Egyptian winged uraeus, a comparison the egypt lane can test.\n\n" +
      "THE DATES. The Hezekiah notice belongs to the Deuteronomistic account of a reform in the late eighth century; its historicity is debated but widely accepted in outline. Numbers 21 is part of the Pentateuch; most critical scholars think the story explains an existing temple object and that its written form is later than the object it explains.\n\n" +
      "WHERE IT STOOD. In Jerusalem, in Judah. No text places Nehushtan at Dan. The existing record 'The bronze serpent and Nehushtan: healing pole versus Kundalini reading' (serpent-kundalini) treats a modern esoteric reading; this record is the historical one.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a bronze serpent cult object in Judah, destroyed in a royal reform, and an Israelite tradition crediting it to Moses as a healing device. It does not establish the wilderness event, the object's age, or any link with the tribe of Dan, with Egyptian cobras or with West African pythons.",
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: nehushtan", "figure: yhwh", "theme: healing and protection", "theme: kingship"], "bronze serpent", "hezekiah"),
    people: ["Moses", "Hezekiah"],
    civilisations: ["Kingdom of Judah", "Ancient Israel"],
    locationName: "Jerusalem (where Nehushtan stood until Hezekiah's reform)",
    lat: 31.778,
    lng: 35.235,
    claims: [
      {
        sourceKey: "wlc_hebrew_bible",
        citations: [{ sourceKey: "schmid_2012_ot_literary_history", relation: "context", note: "Places the Kings account in a Deuteronomistic history of the late 7th–6th centuries BCE." }],
        startYear: bce(715),
        endYear: bce(686),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "Hezekiah's destruction of Nehushtan as narrated",
        originalDateText: "In the reign of Hezekiah, king of Judah",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence:
          "EVIDENCE TYPE: biblical narrative. Hezekiah is independently attested in Sennacherib's annals, so the reign is secure; the reform itself is known only from Kings and Chronicles.",
      },
      {
        sourceKey: "wlc_hebrew_bible",
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "Moses' making of the bronze serpent in the wilderness as narrated",
        originalDateText: "In the wilderness, after Mount Hor",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: biblical narrative. The wilderness story has no external date or confirmation; no year is given.",
      },
      {
        sourceKey: "joines_1968_bronze_serpent",
        startYear: bce(1550),
        endYear: bce(1150),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "Comparable bronze serpent objects from Canaanite cities (Hazor, Megiddo, Gezer, Shechem)",
        originalDateText: "Late Bronze Age bronze serpents from Canaanite sites",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. Excavated serpent objects older than any text about Nehushtan. They show the type of object; they are not Nehushtan. NEEDS SOURCE VERIFICATION for each find's stratum.",
      },
    ],
    passages: [
      {
        label: "Numbers 21:8–9, the bronze serpent made",
        reference: "Numbers 21:8–9",
        sourceKey: "wlc_hebrew_bible",
        objectName: "Leningrad Codex, folio 88v",
        holdingInstitution: "National Library of Russia, St Petersburg",
        accessionNumber: "Firkovich B 19 A",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            content: "וַיֹּ֨אמֶר יְהוָ֜ה אֶל־מֹשֶׁ֗ה עֲשֵׂ֤ה לְךָ֙ שָׂרָ֔ף וְשִׂ֥ים אֹת֖וֹ עַל־נֵ֑ס וְהָיָה֙ כָּל־הַנָּשׁ֔וּךְ וְרָאָ֥ה אֹת֖וֹ וָחָֽי׃ וַיַּ֤עַשׂ מֹשֶׁה֙ נְחַ֣שׁ נְחֹ֔שֶׁת וַיְשִׂמֵ֖הוּ עַל־הַנֵּ֑ס וְהָיָ֗ה אִם־נָשַׁ֤ךְ הַנָּחָשׁ֙ אֶת־אִ֔ישׁ וְהִבִּ֛יט אֶל־נְחַ֥שׁ הַנְּחֹ֖שֶׁת וָחָֽי׃",
            language: "Hebrew",
            script: "Hebrew (square script with Tiberian vowels and accents)",
            evidence: "Masoretic text. שָׂרָף (śārāp̄, 'fiery one') in v. 8; נְחַשׁ נְחֹשֶׁת (nəḥaš nəḥōšet, 'serpent of bronze') in v. 9.",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            content:
              "And the LORD said unto Moses, Make thee a fiery serpent, and set it upon a pole: and it shall come to pass, that every one that is bitten, when he looketh upon it, shall live. And Moses made a serpent of brass, and put it upon a pole, and it came to pass, that if a serpent had bitten any man, when he beheld the serpent of brass, he lived.",
            language: "English",
            viewpoint: "religious",
            evidence: "KJV. 'Brass' for nəḥōšet, which means copper or bronze.",
          },
        ],
      },
      {
        label: "2 Kings 18:4, Hezekiah breaks Nehushtan",
        reference: "2 Kings 18:4",
        sourceKey: "wlc_hebrew_bible",
        objectName: "Leningrad Codex, folio 214v",
        holdingInstitution: "National Library of Russia, St Petersburg",
        accessionNumber: "Firkovich B 19 A",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            content: "ה֣וּא׀ הֵסִ֣יר אֶת־הַבָּמ֗וֹת וְשִׁבַּר֙ אֶת־הַמַּצֵּבֹ֔ת וְכָרַ֖ת אֶת־הָֽאֲשֵׁרָ֑ה וְכִתַּת֩ נְחַ֨שׁ הַנְּחֹ֜שֶׁת אֲשֶׁר־עָשָׂ֣ה מֹשֶׁ֗ה כִּ֣י עַד־הַיָּמִ֤ים הָהֵ֨מָּה֙ הָי֤וּ בְנֵֽי־יִשְׂרָאֵל֙ מְקַטְּרִ֣ים ל֔וֹ וַיִּקְרָא־ל֖וֹ נְחֻשְׁתָּֽן׃",
            language: "Hebrew",
            script: "Hebrew (square script with Tiberian vowels and accents)",
            evidence: "Masoretic text. מְקַטְּרִים לוֹ ('burning incense to it'); נְחֻשְׁתָּן (nəḥuštān).",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            content:
              "He removed the high places, and brake the images, and cut down the groves, and brake in pieces the brasen serpent that Moses had made: for unto those days the children of Israel did burn incense to it: and he called it Nehushtan.",
            language: "English",
            viewpoint: "religious",
            evidence: "KJV. 'He called it' may also be read impersonally, 'it was called'.",
          },
        ],
      },
    ],
    media: [pFolioNum21, pFolio2Kgs18, pSistineSerpent],
  },
  {
    slug: "timna-copper-serpent-rothenberg",
    title: "The copper serpent from the Timna shrine",
    summary:
      "In 1969 Beno Rothenberg excavated a small Egyptian shrine of Hathor at the Timna copper mines. In its last, Midianite phase (12th century BCE) the shrine was turned into a tent sanctuary, and among the finds was a copper snake about 5 inches long with a gilded head. It is the closest excavated parallel to Nehushtan, and it is not from Dan.",
    description:
      "WHAT WAS EXCAVATED. At the foot of 'Solomon's Pillars' in the Timna valley, north of the Gulf of Aqaba, Rothenberg's Arabah expedition excavated in 1969 a small sanctuary built by Egyptian mining expeditions of the Ramesside period and dedicated to Hathor. After the Egyptians left, the shrine was reused: Egyptian inscriptions were defaced, a row of standing stones (massebot) was set up, and remains of woollen cloth along the courtyard walls led Rothenberg to reconstruct a tent covering the shrine. Among the votive finds was a copper serpent with a gilded head; the BAS caption describes 'this copper snake with its gilded head' stretching '5 inches', from a '13th- or 12th-century B.C.E. temple'.\n\n" +
      "THE INTERPRETATION. Rothenberg attributed the final phase to Midianites, on the strength of the distinctive painted 'Midianite' (Qurayya) pottery, and the Israeli Foreign Ministry's Timna text says the snake 'is reminiscent of the copper serpent described in Numbers 21:6–9' and links the Midianite shrine to Jethro, Moses' Midianite father-in-law. The comparison is attractive: a copper serpent, in a tented shrine, in a copper-mining region of the southern desert, associated with Midian, the setting of Numbers 21. But it is a comparison: no inscription names the object, the 'tent' is a reconstruction, and the Midianite identification of the phase rests on pottery.\n\n" +
      "IMAGE GAP: the Timna copper serpent itself — no freely licensed image found on Wikimedia Commons; a photograph credited to Beno Rothenberg is on the Biblical Archaeology Society's image page https://library.biblicalarchaeology.org/images/bsba330206113ljpg and in Rothenberg, Timna (1972). The picture here shows the shrine site, not the serpent.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a real, dated copper serpent cult object in a southern Levantine desert shrine of the twelfth century BCE, the kind of object Nehushtan was. It does not establish that Nehushtan was made at Timna or by Midianites, that the wilderness story is historical, or any link with Dan, which lies at the opposite end of the country.",
    category: "archaeology",
    subcategory: SUB,
    eventType: "archaeological_interpretation",
    tags: serpentTags(LANE, ["figure: nehushtan", "theme: healing and protection"], "timna", "midian", "hathor", "copper serpent"),
    people: ["Beno Rothenberg"],
    civilisations: ["Midianites", "New Kingdom Egypt"],
    locationName: "Hathor shrine (Site 200), Timna valley, southern Israel",
    lat: 29.7685,
    lng: 34.9579,
    claims: [
      {
        sourceKey: "rothenberg_1972_timna",
        citations: [
          { sourceKey: "bas_timna_serpent_image", relation: "supports", note: "Dates the temple of the find to the 13th or 12th century BCE and describes the 5-inch gilded-head serpent." },
          { sourceKey: "israel_mfa_timna", relation: "supports", note: "Places the serpent in the Midianite tent-shrine phase." },
        ],
        startYear: bce(1150),
        endYear: bce(1100),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The Midianite phase of the Timna shrine, in which the copper serpent was found",
        originalDateText: "Midianite phase of the Hathor shrine, 12th century BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. Dated by Egyptian royal names in the earlier phases and by Midianite pottery in the last. Later research at Timna has revised parts of Rothenberg's chronology; the 12th-century date for this phase NEEDS SOURCE VERIFICATION against current publications.",
      },
      {
        sourceKey: "rothenberg_1972_timna",
        startYear: 1969,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The excavation of the Hathor shrine",
        originalDateText: "Excavated by the Arabah expedition in 1969",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. The excavator's own report of the season.",
      },
      {
        sourceKey: "israel_mfa_timna",
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The proposed identification of the Timna serpent with the Nehushtan tradition",
        originalDateText: "'Reminiscent of the copper serpent described in Numbers 21:6–9'",
        datingMethod: "textual_interpretation",
        chronology: "hypothesis",
        evidence:
          "EVIDENCE TYPE: modern interpretation. A comparison made by the excavator and repeated in official heritage texts; it has no date of its own beyond Rothenberg's publications and is not evidence that the two objects are related.",
      },
    ],
    media: [pTimnaShrine],
  },
  {
    slug: "nehushtan-and-the-tribe-of-dan",
    title: "Nehushtan and the tribe of Dan: is there any link?",
    summary:
      "Two serpents are attached to Israelite tradition: the simile of Genesis 49:17 for Dan, and the bronze serpent Nehushtan. No biblical or archaeological source connects them. Nehushtan stood in Jerusalem, was credited to Moses, and was destroyed by a Judahite king; Dan's cult image was a calf.",
    description:
      "THE QUESTION. The request behind this track asks whether Nehushtan relates to the tribe of Dan. The temptation is obvious: Dan is 'a serpent by the way' (Genesis 49:17), Dan's priests claimed descent from Moses (Judges 18:30), and Moses made the bronze serpent (Numbers 21). Put together, they suggest a Danite serpent cult under a Mosaic priesthood.\n\n" +
      "WHAT THE TEXTS ACTUALLY SAY. Genesis 49:17 uses nāḥāš as a simile for ambush; it mentions no object or cult. Judges 18 says the Danite shrine held Micah's pesel (carved image), ephod and teraphim; nothing about a serpent. 1 Kings 12 puts a calf at Dan. Numbers 21 puts the bronze serpent in the wilderness on the way round Edom, and 2 Kings 18:4 puts Nehushtan in Judah, where Hezekiah destroyed it; Kings never mentions it in connection with the northern shrines it condemns at length. The Mosaic genealogy of the Danite priest and the Mosaic origin of Nehushtan are two separate claims, one in Judges and one in Numbers, which no ancient text links.\n\n" +
      "WHAT THE ARCHAEOLOGY SAYS. Serpent decoration appears on cult storage jars at Tel Dan in the ninth century BCE (see the record on serpent imagery). That shows the serpent motif in Dan's sanctuary, as in many Levantine sanctuaries; it is not a bronze serpent, and nothing identifies it with Nehushtan.\n\n" +
      "LATER READINGS. Medieval Jewish tradition put a serpent on Dan's banner (Numbers Rabbah 2:7) by reading Genesis 49:17, and Christian writers from the Gospel of John (3:14) onward made the bronze serpent a type of Christ; neither tradition joins Dan and Nehushtan. The eighteenth-century traveller John Atkins wondered whether Whydah's snake worship derived from 'that fiery one lifted up by Moses', a speculation the existing record on it traces to its source.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes two separate serpent traditions in ancient Israel, and serpent decoration at Dan's sanctuary. It does not establish any textual or archaeological link between Nehushtan and the tribe or city of Dan. NO MATCH: this is recorded as an absence, not a gap waiting to be filled.",
    category: "religion",
    subcategory: SUB,
    eventType: "mainstream",
    tags: serpentTags(LANE, ["figure: nehushtan", "figure: dan (tribe)", "place: tel dan"], "no textual link"),
    people: ["Moses", "Hezekiah", "Jonathan son of Gershom", "John Atkins"],
    civilisations: ["Tribe of Dan", "Kingdom of Judah", "Kingdom of Israel"],
    locationName: "Dan and Jerusalem (the two places the question joins)",
    claims: [
      {
        sourceKey: "wlc_hebrew_bible",
        citations: [
          { sourceKey: "bartusch_2003_understanding_dan", relation: "context", note: "A study of every biblical text about Dan; no Nehushtan link is among them." },
          { sourceKey: "joines_1968_bronze_serpent", relation: "context", note: "Places Nehushtan in Jerusalem's cult, not Dan's." },
        ],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "Any ancient statement linking Nehushtan with Dan",
        originalDateText: "None found in the Hebrew Bible or in excavated material",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: biblical narrative. A search of the texts that mention Dan and Nehushtan finds no link. A negative result has no date; it would change if a text or an inscribed object joining them were found.",
      },
      {
        sourceKey: "numbers_rabbah_2_7",
        startYear: 1150,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest serpent emblem for Dan, which still does not mention Nehushtan",
        originalDateText: "Medieval midrash on Dan's banner",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: religious tradition. Even the medieval serpent emblem derives from Genesis 49:17 alone. The century NEEDS SOURCE VERIFICATION.",
      },
    ],
    genealogies: [
      {
        key: "dan-serpent-tribe-and-nehushtan",
        claim: "The tribe of Dan was a serpent tribe that kept Moses' bronze serpent",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "Looked for and not found. The pieces are real but separate: a serpent simile for Dan (Gen 49:17), a Mosaic priest at Dan (Judg 18:30), a bronze serpent credited to Moses (Num 21) and kept in Jerusalem (2 Kgs 18:4), serpent-decorated jars at Tel Dan, and a medieval serpent banner. No source joins them.",
        whatWouldChangeThis:
          "An inscription or text placing a bronze serpent at Dan; a serpent cult object from Tel Dan identified by inscription; or an ancient text attributing Nehushtan to the Danite priesthood.",
        links: [
          {
            stage: "ancient_primary",
            who: "Genesis 49:17",
            sourceKey: "wlc_hebrew_bible",
            reference: "Gen 49:17",
            says: "Dan shall be a serpent by the way, an adder in the path",
            adds: "The serpent simile for Dan; no object or cult.",
            citationStatus: "verified",
          },
          {
            stage: "ancient_primary",
            who: "2 Kings 18:4",
            sourceKey: "wlc_hebrew_bible",
            reference: "2 Kgs 18:4",
            says: "brake in pieces the brasen serpent that Moses had made... and he called it Nehushtan",
            adds: "Nehushtan in Judah, destroyed by Hezekiah; no mention of Dan.",
            citationStatus: "verified",
          },
          {
            stage: "later_antiquity",
            who: "Numbers Rabbah 2:7",
            year: 1150,
            sourceKey: "numbers_rabbah_2_7",
            reference: "2:7",
            says: "Dan... the colour of his banner like sapphire, with a serpent depicted on it, after 'Dan shall be a serpent'",
            adds: "A serpent emblem for Dan, derived from Genesis; still no Nehushtan.",
            citationStatus: "verified",
          },
          {
            stage: "current_scholarship",
            who: "This lane's survey of the sources",
            year: 2026,
            saysAbsentReason: "A negative finding, stated in this record rather than in a published source.",
            adds: "Records the absence of any link.",
            citationStatus: "no_citation_given",
          },
        ],
      },
    ],
    argumentsFor:
      "Dan is the only tribe compared to a serpent; its priests claimed Mosaic descent; Moses is credited with the bronze serpent; serpent-decorated cult jars were found in Dan's sanctuary. Someone looking for a Danite serpent cult can assemble these into a coherent-looking picture.",
    argumentsAgainst:
      "Each piece comes from a different text or context and none refers to another. Nehushtan is placed in Jerusalem and destroyed by a Judahite king; Dan's image was a calf; the Genesis serpent is a simile among animal similes for several tribes; serpent decoration is common across Levantine sanctuaries. Assembling them is a modern construction.",
    media: [pNeboMonument, pSantAmbrogio],
  },

  // =========================================================================
  // UGARIT
  // =========================================================================
  {
    slug: "ugarit-serpent-charms-and-lotan",
    title: "Ugarit's serpents: the snakebite charms and Lotan in the Baal Cycle",
    summary:
      "The tablets of Ugarit (destroyed in the early 12th century BCE) give the nearest Canaanite background to Israelite serpent language: two incantations against snakebite (KTU 1.100 and 1.107), and the Baal Cycle's sea-serpent Lītānu (ltn), 'the fleeing serpent... the twisting serpent... with seven heads', with Tunnanu (tnn), whose epithets reappear in Isaiah 27:1 as Leviathan and tannîn.",
    description:
      "THE SOURCES. Ugarit (Ras Shamra, on the Syrian coast) produced thousands of tablets, many in its own alphabetic cuneiform, written before the city's destruction around 1185 BCE. They are the largest body of Canaanite religious texts and the standard comparison for Israelite religious language.\n\n" +
      "THE SNAKEBITE CHARMS. KTU 1.100 (RS 24.244), which Pardee titles 'Ridding the land of serpents', is a mythological incantation: the mare, daughter of the sun-goddess Shapshu, asks a series of gods in their home cities to charm away a serpent's venom (the recurring formula uses the words nḥš 'snake' and bṯn 'serpent'), and only Horon, a god of magic, succeeds. KTU 1.107 is a second, damaged snakebite text. They show serpents in Canaanite religion as a danger handled by healing magic and by named gods, a context for the healing function of Nehushtan. The exact transliteration of their formulas NEEDS SOURCE VERIFICATION in Pardee (2002).\n\n" +
      "LOTAN AND TUNNANU. In the Baal Cycle, Mot reminds Baal: 'when you smote Lītānu (ltn) the fleeing serpent (bṯn brḥ), finished off the twisting serpent (bṯn ʿqltn), the mighty one with seven heads (šlyṭ d šbʿt rašm)' (KTU 1.5 I 1–3); Anat lists Tunnanu (tnn) among the foes she has muzzled (KTU 1.3 III). Isaiah 27:1 reuses the same epithets: YHWH will punish 'Leviathan the fleeing serpent (nāḥāš bāriaḥ), Leviathan the twisting serpent (nāḥāš ʿăqallāṯôn)' and slay 'the dragon (tannîn) in the sea'. Hebrew liwyāṯān corresponds to Ugaritic ltn, and Hebrew nāḥāš translates Ugaritic bṯn. This is a documented literary inheritance within the Canaanite-Hebrew language family.\n\n" +
      "WHY IT MATTERS FOR THIS TRACK. It is the closest documented case of serpent imagery passing between neighbouring cultures, and it shows what such a case looks like: shared language, regular correspondences, matching formulas. The Ugaritic serpents are chaos monsters defeated by a storm god (comparable in role to Apep defeated by Re's defenders in Egypt) or venomous snakes to be charmed; neither is a protective royal serpent or a sacred living python. None of these texts mentions Dan.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes Late Bronze Age Canaanite serpent mythology and serpent-healing magic, and a demonstrable textual link between Ugaritic ltn and Hebrew Leviathan. It does not establish any special serpent tradition of the tribe of Dan, nor any link to Egyptian or West African serpents.",
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: healing and protection", "theme: names and words", "figure: yhwh"], "ugarit", "lotan", "leviathan", "baal cycle", "incantation"),
    people: ["Baal", "Anat", "Mot", "Shapshu", "Horon", "Lītānu (Lotan)"],
    civilisations: ["Ugarit", "Canaanites"],
    locationName: "Ugarit (Ras Shamra), Syria",
    lat: 35.602,
    lng: 35.782,
    claims: [
      {
        sourceKey: "ktu_1995_cuneiform_alphabetic_texts",
        citations: [
          { sourceKey: "pardee_2002_ritual_cult_ugarit", relation: "supports", note: "Translates KTU 1.100 and 1.107 as incantations against snakebite." },
          { sourceKey: "wyatt_2002_religious_texts_ugarit", relation: "supports", note: "Translates the Baal Cycle passages on ltn and tnn." },
        ],
        startYear: bce(1300),
        endYear: bce(1185),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The writing of the Ugaritic tablets (Baal Cycle; snakebite charms)",
        originalDateText: "Late Bronze Age tablets from Ugarit, before its destruction c. 1185 BCE",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. The tablets were found in the destruction levels and archives of the city; the scribe of the Baal Cycle tablets, Ilimilku, is dated to the late 13th or early 12th century. The myths may be older than these copies.",
      },
      {
        sourceKey: "wlc_hebrew_bible",
        citations: [{ sourceKey: "wyatt_2002_religious_texts_ugarit", relation: "context", note: "The Ugaritic parallel to Isaiah's epithets." }],
        startYear: bce(600),
        endYear: bce(400),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The writing of Isaiah 27:1 (the 'Isaiah Apocalypse', chapters 24–27)",
        originalDateText: "Isaiah 24–27, usually dated to the exilic or Persian period",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Critical scholarship places Isaiah 24–27 well after the eighth-century prophet; the date is argued. The point here is that the Ugaritic epithets survived some seven centuries into Hebrew poetry.",
      },
    ],
    passages: [
      {
        label: "Isaiah 27:1, Leviathan the fleeing and twisting serpent",
        reference: "Isaiah 27:1",
        sourceKey: "wlc_hebrew_bible",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            content: "בַּיּ֣וֹם הַה֡וּא יִפְקֹ֣ד יְהוָה֩ בְּחַרְב֨וֹ הַקָּשָׁ֜ה וְהַגְּדוֹלָ֣ה וְהַֽחֲזָקָ֗ה עַ֤ל לִוְיָתָן֙ נָחָ֣שׁ בָּרִ֔חַ וְעַל֙ לִוְיָתָ֔ן נָחָ֖שׁ עֲקַלָּת֑וֹן וְהָרַ֥ג אֶת־הַתַּנִּ֖ין אֲשֶׁ֥ר בַּיָּֽם׃",
            language: "Hebrew",
            script: "Hebrew (square script with Tiberian vowels and accents)",
            evidence: "Masoretic text. לִוְיָתָן נָחָשׁ בָּרִחַ / נָחָשׁ עֲקַלָּתוֹן / הַתַּנִּין: the epithets of Ugaritic ltn bṯn brḥ / bṯn ʿqltn, and tnn.",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            content:
              "In that day the LORD with his sore and great and strong sword shall punish leviathan the piercing serpent, even leviathan that crooked serpent; and he shall slay the dragon that is in the sea.",
            language: "English",
            viewpoint: "religious",
            evidence: "KJV. 'Piercing' renders bāriaḥ, now usually understood as 'fleeing' in the light of Ugaritic brḥ.",
          },
          {
            layer: "transliteration",
            sourceKey: "wyatt_2002_religious_texts_ugarit",
            content: "k tmḫṣ ltn bṯn brḥ / tkly bṯn ʿqltn / šlyṭ d šbʿt rašm (KTU 1.5 I 1–3)",
            language: "Ugaritic",
            script: "Latin (academic transliteration of alphabetic cuneiform)",
            evidence:
              "The Ugaritic lines as standardly transliterated: 'when you smote Lītānu the fleeing serpent, finished off the twisting serpent, the mighty one with seven heads'. NEEDS SOURCE VERIFICATION for line numbering against Wyatt or KTU.",
          },
        ],
      },
    ],
    media: [pUgaritRuins, pBaalStatuette, pDoreLeviathan],
  },

  // =========================================================================
  // DENYEN
  // =========================================================================
  {
    slug: "denyen-danuna-and-dan-yadin-hypothesis",
    title: "The Denyen/Danuna and Dan: Yadin's Sea Peoples hypothesis",
    summary:
      "Egyptian texts name a people dꜣjnjnjw (Denyen) among the Sea Peoples who fought Ramesses III, and a Danuna/Danunians are known from the Amarna letters and the Karatepe inscription in Cilicia. In 1968 Yigael Yadin proposed that the tribe of Dan was linked with them, 'possibly even a certain measure of identity'. It is a minority hypothesis with named proponents and critics.",
    description:
      "THE EXTERNAL EVIDENCE. (1) Amarna letter EA 151 (fourteenth century BCE) from Abi-Milku of Tyre reports that the king of Danuna has died. (2) Ramesses III's Year 8 inscription at Medinet Habu (early twelfth century BCE) lists the Peleset (Philistines), Tjeker, Shekelesh, Denyen and Weshesh among northern peoples who attacked Egypt by land and sea. (3) The Karatepe bilingual (Phoenician and Luwian, eighth or early seventh century BCE) is the record of Azatiwada, servant of the king of the dnnym, the Danunians of the Adana plain in Cilicia, of the 'house of Mopsos'. The Denyen are also often compared with Homer's Danaoi.\n\n" +
      "YADIN'S ARGUMENT (read in full). Dan is anomalous among the tribes: it 'judges his people as one of the tribes' (Gen 49:16), which Yadin reads as late admission to the league; it has no inheritance in Judges 18:1 but a coastal one near Joppa in Joshua 19; it has almost no genealogy; Samson's world is Philistine; and Judges 5:17 puts Dan in ships. The Egyptian reliefs show Philistines, Tjeker and a third people in the same feathered helmets; the Philistines settled the south coast and the Tjeker Dor; the gap between, around Joppa, is where Joshua puts Dan. He suggests the Danuna settled there, perhaps at Tel Qasila, were pushed inland and migrated to Laish around 1100 BCE. He concludes there was 'a link between the Tribe of Dan and the Tribe of the Danai, and possibly even a certain measure of identity', presenting it as 'a certain suggestion... without being too definite'.\n\n" +
      "PROPONENTS AND CRITICS. Cyrus Gordon agreed with part of the argument (as Yadin reports); Othniel Margalith (1994) and Michael Astour developed Aegean readings of Dan and Samson; popular advocates continue it. Critics, including Mark Bartusch (2003), call it speculative, and it has not been adopted in mainstream reconstructions. The Karatepe evidence places the Danuna in Cilicia; the archaeology of Tel Dan's Iron I village shows mixed material culture, with some Aegean-style and 'Sea People' pottery, which does not identify its inhabitants.\n\n" +
      "THE SERPENT QUESTION. Nothing in the Denyen evidence involves serpents (Yadin notes only a Greek tradition that Mopsus died of a snakebite). The hypothesis concerns Dan's origins, not any serpent cult, and it points to the Aegean and Anatolia, not to Africa.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a people or land called Danuna/Denyen in the Late Bronze and Iron Ages, among the Sea Peoples and in Cilicia. It does not establish that they were connected with the biblical Dan: the link rests on a resemblance of names, a verse about ships and the gaps in Dan's genealogy, and no text or inscription joins them.",
    category: "history",
    subcategory: SUB,
    eventType: "disputed",
    tags: serpentTags(LANE, ["figure: dan (tribe)", "theme: migration traditions", "theme: names and words"], "sea peoples", "denyen", "danuna", "yadin"),
    people: ["Yigael Yadin", "Ramesses III", "Azatiwada", "Othniel Margalith", "Mark W. Bartusch", "Cyrus H. Gordon"],
    civilisations: ["Denyen (Sea Peoples)", "Danunians of Adana", "Tribe of Dan", "Philistines", "Tjeker"],
    locationName: "Medinet Habu, Thebes (where the Denyen are named)",
    lat: 25.7197,
    lng: 32.6008,
    claims: [
      {
        sourceKey: "edgerton_wilson_1936_ramses_iii",
        startYear: bce(1177),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "Ramesses III's Year 8 record naming the Denyen among the Sea Peoples",
        originalDateText: "Year 8 of Ramesses III, early 12th century BCE",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: inscription. A dated royal inscription; the absolute year depends on the Egyptian chronology used (c. 1179–1175 BCE). It attests the Denyen; it says nothing about Israel or Dan.",
      },
      {
        sourceKey: "hawkins_2000_chli_karatepe",
        startYear: bce(700),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "The Karatepe bilingual naming the Danunians of Cilicia",
        originalDateText: "Azatiwada's bilingual, 8th or early 7th century BCE",
        datingMethod: "stylistic_comparison",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: inscription. Dated by script and historical context, within a range still argued; it locates the Danuna in Cilicia.",
      },
      {
        sourceKey: "yadin_1968_dan_ships",
        citations: [
          { sourceKey: "bartusch_2003_understanding_dan", relation: "disputes", note: "Treats the proposal as speculative (NEEDS SOURCE VERIFICATION for wording)." },
          { sourceKey: "margalith_1994_sea_peoples_bible", relation: "supports", note: "Develops an Aegean reading of Dan and Samson." },
        ],
        startYear: bce(1100),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "proposed_correlation",
        whatIsDated: "Yadin's proposed date for the Danuna/Danite move inland and north to Laish",
        originalDateText: "Round about the year 1100, when the Kingdom of Sidon began to weaken (Yadin)",
        datingMethod: "textual_interpretation",
        chronology: "hypothesis",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Yadin correlates the end of Tel Qasila Stratum XII with a weakened Sidon and the Judges 18 migration. It is a hypothesis built on correlations, not a dated event.",
      },
    ],
    genealogies: [
      {
        key: "dan-equals-denyen",
        claim: "The tribe of Dan was (or came from) the Denyen/Danuna Sea People",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "Each component is attested: the Denyen in Egyptian texts, the Danuna in Amarna and at Karatepe, Dan in the Bible. No ancient text or object identifies them with each other. The identification is a modern inference from the similarity of names and from biblical anomalies, first argued by Yadin in 1968.",
        whatWouldChangeThis:
          "An inscription or text calling Danites Danuna or vice versa; or excavated evidence at a Danite-associated site (Zorah, Eshtaol, Tel Dan) of a distinct Aegean-derived population continuous with the later Israelite city.",
        links: [
          {
            stage: "ancient_primary",
            who: "Amarna letter EA 151 (Abi-Milku of Tyre)",
            year: bce(1350),
            sourceKey: "moran_1992_amarna_letters",
            reference: "EA 151",
            saysAbsentReason: "Not opened in this session; known from the edition's index and summaries.",
            adds: "A land of Danuna with a king, in the Levant of the fourteenth century BCE.",
            citationStatus: "unverified",
          },
          {
            stage: "ancient_primary",
            who: "Ramesses III, Year 8 inscription, Medinet Habu",
            year: bce(1177),
            sourceKey: "edgerton_wilson_1936_ramses_iii",
            reference: "Year 8 inscription",
            saysAbsentReason: "The translation was not opened in this session.",
            adds: "The Denyen among the Sea Peoples who fought Egypt.",
            citationStatus: "unverified",
          },
          {
            stage: "ancient_primary",
            who: "Azatiwada's Karatepe bilingual",
            year: bce(700),
            sourceKey: "hawkins_2000_chli_karatepe",
            reference: "KARATEPE 1 / KAI 26",
            saysAbsentReason: "Not opened in this session.",
            adds: "Danunians (dnnym) in Cilicia under the house of Mopsos.",
            citationStatus: "unverified",
          },
          {
            stage: "alternative_interpretation",
            who: "Yigael Yadin",
            year: 1968,
            sourceKey: "yadin_1968_dan_ships",
            reference: "AJBA 1.1, p. 22",
            says: "there is a link between the Tribe of Dan and the Tribe of the Danai, and possibly even a certain measure of identity",
            adds: "Joins the biblical Dan to the Danuna/Danai via Judges 5:17, Joshua 19 and the Sea Peoples' settlement pattern.",
            citationStatus: "verified",
          },
          {
            stage: "alternative_interpretation",
            who: "Othniel Margalith",
            year: 1994,
            sourceKey: "margalith_1994_sea_peoples_bible",
            saysAbsentReason: "Not opened in this session.",
            adds: "A book-length Aegean reading of Dan and Samson.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Mark W. Bartusch",
            year: 2003,
            sourceKey: "bartusch_2003_understanding_dan",
            saysAbsentReason: "Not opened; his view is reported in secondary summaries.",
            adds: "Judges the proposal speculative.",
            citationStatus: "unverified",
          },
          {
            stage: "popular_claim",
            who: "Armstrong Institute of Biblical Archaeology",
            year: 2022,
            sourceKey: "armstrong_institute_denyen_dan",
            saysAbsentReason: "Not read beyond its summary in this session.",
            adds: "Presents the identification as likely and its critics as minimalists.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    argumentsFor:
      "The names are similar; Judges 5:17 puts Dan in ships, which the inland Dan of Judges 18 cannot explain; Joshua 19 gives Dan coastal towns near Joppa, between the known settlements of the Philistines and the Tjeker; Dan has almost no genealogy and is called a servant's son; Samson's stories are set among Philistines and resemble Aegean hero tales (Yadin 1968).",
    argumentsAgainst:
      "No ancient source equates the two; similar names in different languages are weak evidence; the Danuna are located in Cilicia by the Karatepe inscription; the biblical tradition consistently presents Dan as a son of Jacob; the Iron I material at Tel Dan does not identify an Aegean population; Yadin himself offered it tentatively, and specialists (e.g. Bartusch) treat it as speculative.",
    media: [pMedinetHabu, pKaratepe],
  },

  // =========================================================================
  // THE END OF THE NORTHERN KINGDOM
  // =========================================================================
  {
    slug: "assyrian-conquest-and-the-lost-tribe-of-dan",
    title: "732 and 722 BCE: the Assyrian conquest and where Dan was later 'found'",
    summary:
      "Tiglath-pileser III took Israel's northern territories in 732 BCE and Samaria fell in 722/720. Dan was destroyed some time after 750 BCE, though no text names it among the conquests. The deportees became the 'lost tribes', and Dan was later 'found' in many places, from Eldad ha-Dani's Cush (9th century CE) to British-Israelite Europe: identifications that are a history of ideas, not of migrations.",
    description:
      "WHAT THE TEXTS SAY. 'In the days of Pekah king of Israel came Tiglath-pileser king of Assyria, and took Ijon, and Abel-beth-maachah, and Janoah, and Kedesh, and Hazor, and Gilead, and Galilee, all the land of Naphtali, and carried them captive to Assyria' (2 Kings 15:29). Ijon and Abel-beth-maacah lie just south-west of Dan, but Dan itself is not named. 'In the ninth year of Hoshea the king of Assyria took Samaria, and carried Israel away into Assyria, and placed them in Halah and in Habor by the river of Gozan, and in the cities of the Medes' (17:6). Assyrian inscriptions of Tiglath-pileser III record the annexation of the north as provinces and deportations; Sargon II claims 27,290 (another text has 27,280) people carried off from Samaria.\n\n" +
      "WHAT IS EXCAVATED. The Nelson Glueck School reports that 'sometime after 750 BCE the entire site was destroyed in a great conflagration, probably wrought by one of the invading Assyrian armies', and notes that there is 'no reference to Dan's destruction' by Tiglath-pileser III in either the Bible or his annals. Cult activity at the precinct continued, and the city was reoccupied in the seventh century.\n\n" +
      "THE DEPORTATIONS IN PERSPECTIVE. Historians (e.g. Younger 1998) stress that deportations were partial: many Israelites stayed, others fled south to Judah, and those deported were settled in Assyria and Media and largely assimilated. 'Lost' describes the end of the northern tribes as political units, not the disappearance of a people to an unknown place.\n\n" +
      "WHERE DAN WAS 'FOUND'. From late antiquity on, writers looked for the ten tribes. For Dan specifically: Eldad ha-Dani (ninth century CE) claimed to come from an independent Danite kingdom 'beyond the rivers of Cush', the earliest text placing Dan in Africa (treated in the africanJewish lane); Ethiopian Beta Israel traditions and later rabbinic rulings identified them with Dan; British Israelism (from John Wilson, 1840) and later writers in that movement read Dan into European place names. Parfitt (2002) and Ben-Dor Benite (2009) treat these identifications as a history of a myth and of colonial and religious imagination. None of them is evidence of a Danite migration, and none involves a serpent cult.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes the Assyrian conquest and partial deportation of northern Israel in 732–720 BCE and the destruction of Tel Dan in the later eighth century. It does not establish what became of the people of Dan, and it gives no support to any later identification of Danites in Africa or elsewhere; those begin some 1,600 years after the conquest.",
    category: "history",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["figure: dan (tribe)", "theme: migration traditions", "place: tel dan", "place: ethiopia"], "assyria", "lost tribes", "deportation"),
    people: ["Tiglath-pileser III", "Shalmaneser V", "Sargon II", "Pekah", "Hoshea", "Eldad ha-Dani", "John Wilson"],
    civilisations: ["Neo-Assyrian Empire", "Kingdom of Israel", "Tribe of Dan"],
    ...TEL_DAN,
    claims: [
      {
        sourceKey: "tadmor_yamada_2011_rinap1",
        citations: [{ sourceKey: "wlc_hebrew_bible", relation: "supports", note: "2 Kings 15:29 lists the northern towns taken, without naming Dan." }],
        startYear: bce(732),
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Tiglath-pileser III's annexation of Israel's northern territories",
        originalDateText: "Campaign of 733–732 BCE against Aram-Damascus and Israel",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Dated by the Assyrian eponym chronology, which is anchored astronomically. It dates the conquest of the region; Dan is not named in the texts read here.",
      },
      {
        sourceKey: "younger_1998_deportations_israelites",
        startYear: bce(722),
        endYear: bce(720),
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "The fall of Samaria and the deportations under Shalmaneser V and Sargon II",
        originalDateText: "Samaria taken 722 BCE; deportations completed by Sargon II c. 720 BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Assyrian royal inscriptions and the Babylonian Chronicle, with 2 Kings 17. The split between Shalmaneser V and Sargon II is debated.",
      },
      {
        sourceKey: "ngsba_tel_dan_strata",
        startYear: bce(750),
        endYear: bce(700),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The destruction of the Iron Age city at Tel Dan",
        originalDateText: "Sometime after 750 BCE, in a great conflagration",
        datingMethod: "stratigraphic",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. A destruction layer dated by pottery; its attribution to an Assyrian army is probable, its attribution to the 732 campaign is not proven.",
      },
      {
        sourceKey: "adler_1930_jewish_travellers",
        citations: [{ sourceKey: "parfitt_2002_lost_tribes", relation: "context", note: "Places Eldad within the long history of lost-tribes claims." }],
        startYear: 880,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest known text placing the tribe of Dan in Africa (Eldad ha-Dani)",
        originalDateText: "Eldad the Danite, c. 880 CE",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Dates Eldad's claim, about 1,600 years after the deportations; it is evidence for the claim, not for a migration (see the africanJewish lane).",
      },
    ],
    passages: [
      {
        label: "2 Kings 15:29, Tiglath-pileser takes the north",
        reference: "2 Kings 15:29",
        sourceKey: "wlc_hebrew_bible",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            content: "בִּימֵ֞י פֶּ֣קַח מֶֽלֶךְ־יִשְׂרָאֵ֗ל בָּא֮ תִּגְלַ֣ת פִּלְאֶסֶר֮ מֶ֣לֶךְ אַשּׁוּר֒ וַיִּקַּ֣ח אֶת־עִיּ֡וֹן וְאֶת־אָבֵ֣ל בֵּֽית־מַעֲכָ֡ה וְאֶת־יָ֠נוֹחַ וְאֶת־קֶ֨דֶשׁ וְאֶת־חָצ֤וֹר וְאֶת־הַגִּלְעָד֙ וְאֶת־הַגָּלִ֔ילָה כֹּ֖ל אֶ֣רֶץ נַפְתָּלִ֑י וַיַּגְלֵ֖ם אַשּֽׁוּרָה׃",
            language: "Hebrew",
            script: "Hebrew (square script with Tiberian vowels and accents)",
            evidence: "Masoretic text. The list of places does not include Dan.",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            content:
              "In the days of Pekah king of Israel came Tiglath-pileser king of Assyria, and took Ijon, and Abel-beth-maachah, and Janoah, and Kedesh, and Hazor, and Gilead, and Galilee, all the land of Naphtali, and carried them captive to Assyria.",
            language: "English",
            viewpoint: "religious",
            evidence: "KJV.",
          },
        ],
      },
    ],
    media: [pTiglathSiege, pBlackObelisk],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const links: SeedEventLink[] = [
  // ---- inside the lane ------------------------------------------------------
  { from: ANCHOR, to: "dan-named-in-genesis-30", relation: "associated", note: "The naming story is the first of the biblical texts the anchor lists." },
  { from: ANCHOR, to: "dan-serpent-by-the-way-genesis-49", relation: "associated", note: "The only text likening Dan to a serpent, central to the track's question." },
  { from: ANCHOR, to: "tel-dan-sacred-precinct-area-t", relation: "associated", note: "The excavated sanctuary is the anchor's second kind of evidence." },
  { from: ANCHOR, to: "tel-dan-stele-date-anchor", relation: "associated", note: "The stele is the anchor's third kind of evidence and dates a phase of the site." },
  { from: ANCHOR, to: "nehushtan-and-the-tribe-of-dan", relation: "relevant", note: "States the absence of any link between Dan and Israel's bronze serpent." },
  { from: ANCHOR, to: "assyrian-conquest-and-the-lost-tribe-of-dan", relation: "associated", note: "The end of the northern kingdom and the start of later Danite identifications." },
  { from: "dan-named-in-genesis-30", to: "dan-serpent-by-the-way-genesis-49", relation: "related", note: "Genesis 49:16 repeats the d-y-n pun before adding the serpent simile." },
  { from: "dan-serpent-by-the-way-genesis-49", to: "tel-dan-serpent-imagery-what-is-reported", relation: "related", note: "A literary serpent and an excavated one at Dan, which no source connects." },
  { from: "dan-and-ships-judges-5-17", to: "denyen-danuna-and-dan-yadin-hypothesis", relation: "evidence_for", sourceKey: "yadin_1968_dan_ships", viewpoint: "hypothesis", note: "Yadin builds his Sea Peoples hypothesis on this verse." },
  { from: "dan-and-ships-judges-5-17", to: "danite-migration-to-laish-judges-18", relation: "precedes", note: "On Yadin's reading the coastal Dan of Judges 5 precedes the northern move of Judges 18." },
  { from: "danite-migration-to-laish-judges-18", to: "jonathan-son-of-gershom-danite-priesthood", relation: "part_of", note: "The priest is installed at Dan at the end of the migration story." },
  { from: "danite-migration-to-laish-judges-18", to: "tel-dan-sacred-precinct-area-t", relation: "related", note: "The shrine founded in the story and the sanctuary excavated at the site." },
  { from: "jonathan-son-of-gershom-danite-priesthood", to: "jeroboam-golden-calves-dan-and-bethel", relation: "related", note: "Two biblical accounts of Dan's cult, both hostile, from different books." },
  { from: "jonathan-son-of-gershom-danite-priesthood", to: "nehushtan-and-the-tribe-of-dan", relation: "relevant", note: "The Mosaic priest is the nearest textual link between Dan and Moses' serpent, and it is not a link." },
  { from: "tel-dan-sacred-precinct-area-t", to: "jeroboam-golden-calves-dan-and-bethel", relation: "identified", viewpoint: "disputed", sourceKey: "biran_1994_biblical_dan", note: "Biran identified the precinct with Jeroboam's sanctuary; the date is disputed." },
  { from: "tel-dan-sacred-precinct-area-t", to: "tel-dan-altars-and-priestly-portions", relation: "part_of", note: "The altars and bone deposits are finds of the precinct." },
  { from: "tel-dan-sacred-precinct-area-t", to: "tel-dan-serpent-imagery-what-is-reported", relation: "part_of", note: "The snake pithoi come from the precinct's first phase." },
  { from: "tel-dan-stele-date-anchor", to: "tel-dan-sacred-precinct-area-t", relation: "evidence_for", sourceKey: "ngsba_tel_dan_strata", note: "The stele dates Stratum IIIB (Bamah B) to the later ninth century." },
  { from: "tel-dan-altars-and-priestly-portions", to: "jeroboam-golden-calves-dan-and-bethel", relation: "relevant", note: "Greer reads the sacrificial evidence as an Israelite royal cult of the kind 1 Kings 12 condemns." },
  { from: "tel-dan-serpent-imagery-what-is-reported", to: "nehushtan-and-the-tribe-of-dan", relation: "evidence_for", note: "The only serpent imagery at Dan, which does not identify Nehushtan." },
  { from: "nehushtan-bronze-serpent-numbers-and-kings", to: "timna-copper-serpent-rothenberg", relation: "related", sourceKey: "israel_mfa_timna", note: "Rothenberg compared the Timna copper serpent with the bronze serpent of Numbers 21." },
  { from: "nehushtan-bronze-serpent-numbers-and-kings", to: "nehushtan-and-the-tribe-of-dan", relation: "relevant", note: "The historical Nehushtan record, and the question of a Danite link." },
  { from: "ugarit-serpent-charms-and-lotan", to: "nehushtan-bronze-serpent-numbers-and-kings", relation: "relevant", note: "Ugaritic snakebite charms are the Canaanite background to Nehushtan's healing role." },
  { from: "ugarit-serpent-charms-and-lotan", to: "dan-serpent-by-the-way-genesis-49", relation: "relevant", note: "Ugaritic nḥš and bṯn are the cognate vocabulary of Hebrew serpent words." },
  { from: "denyen-danuna-and-dan-yadin-hypothesis", to: "danite-migration-to-laish-judges-18", relation: "responds_to", sourceKey: "yadin_1968_dan_ships", viewpoint: "hypothesis", note: "Yadin dates the Laish migration c. 1100 BCE as a Danuna retreat from the coast." },
  { from: "jeroboam-golden-calves-dan-and-bethel", to: "assyrian-conquest-and-the-lost-tribe-of-dan", relation: "precedes", note: "Kings presents 'the sin of Jeroboam' as the cause of the north's fall." },
  { from: "jonathan-son-of-gershom-danite-priesthood", to: "assyrian-conquest-and-the-lost-tribe-of-dan", relation: "precedes", note: "The priesthood lasted 'until the day of the captivity of the land'." },

  // ---- to the other lanes' anchors --------------------------------------------
  { from: ANCHOR, to: A.africanJewish, relation: "precedes", note: "The Israelite sources come first; Danite traditions in Africa begin in the ninth century CE." },
  { from: "assyrian-conquest-and-the-lost-tribe-of-dan", to: A.africanJewish, relation: "precedes", note: "The deportations are the starting point of every later claim that Danites reached Africa." },
  { from: ANCHOR, to: A.assessment, relation: "evidence_for", note: "The lane's evidence feeds the conclusion's weighing of Danite-migration hypotheses." },
  { from: "dan-named-in-genesis-30", to: A.words, relation: "evidence_for", note: "The Hebrew name means 'judge'; the words lane compares it with Gbe dan 'snake'." },
  { from: "dan-serpent-by-the-way-genesis-49", to: A.words, relation: "evidence_for", note: "nāḥāš and šəp̄îp̄ōn are the Hebrew serpent words the comparison must use, not dān." },
  { from: "dan-serpent-by-the-way-genesis-49", to: A.gbe, relation: "relevant", note: "The Gbe Dan is a vodun; the Hebrew Dan is compared to a serpent only in this simile." },
  { from: "nehushtan-bronze-serpent-numbers-and-kings", to: A.rituals, relation: "evidence_for", note: "Nehushtan is one of the gods and objects the comparison lane sets side by side." },
  { from: "nehushtan-bronze-serpent-numbers-and-kings", to: A.egypt, relation: "relevant", note: "The śārāp̄ and the winged serpents of Isaiah 6 are often compared with the Egyptian uraeus." },
  { from: "ugarit-serpent-charms-and-lotan", to: A.egypt, relation: "relevant", note: "Lotan the chaos serpent invites comparison with Apep; both are adversaries, not protectors." },
  { from: "tel-dan-altars-and-priestly-portions", to: A.rituals, relation: "evidence_for", note: "The excavated sequence of sacrifice and priestly portions is the Israelite case for the ritual comparison." },
  { from: "denyen-danuna-and-dan-yadin-hypothesis", to: A.routes, relation: "relevant", note: "The only proposed Danite migration with ancient texts behind each end, and it points north-west, not to Africa." },
  { from: "tel-dan-serpent-imagery-what-is-reported", to: A.kush, relation: "relevant", note: "Serpent imagery at Dan is to be compared with Kushite royal cobra imagery only as a separate regional motif." },
  { from: "timna-copper-serpent-rothenberg", to: A.egypt, relation: "related", note: "The Timna shrine was built by Egyptian mining expeditions for Hathor." },

  // ---- to records other datasets already seed ------------------------------------
  { from: "nehushtan-bronze-serpent-numbers-and-kings", to: "nehushtan-kundalini-comparison", relation: "relevant", note: "That record treats a modern Kundalini reading; this is the historical record of the object." },
  { from: "nehushtan-bronze-serpent-numbers-and-kings", to: "asclepius-staff-kundalini-comparison", relation: "related", note: "Two healing serpents on staffs, in Israel and Greece, with no shown connection." },
  { from: "nehushtan-and-the-tribe-of-dan", to: "serpent-is-not-one-symbol", relation: "relevant", note: "The rule that two serpents are not one symbol applies inside Israel too." },
  { from: "nehushtan-and-the-tribe-of-dan", to: "hueda-serpents-egypt-and-israel-speculation", relation: "relevant", note: "Atkins (1735) wondered whether Whydah's snakes came from Moses' serpent; this record shows the Israelite side gives no basis." },
  { from: "dan-serpent-by-the-way-genesis-49", to: "dan-the-serpent", relation: "relevant", note: "The Gbe vodun Dan is a different word in an unrelated language; the shared sound is not evidence of a link." },
  { from: "ugarit-serpent-charms-and-lotan", to: "set-spears-apep", relation: "relevant", note: "A storm god defeating a chaos serpent in Ugarit; Set defending Re's barque against Apep in Egypt." },
  { from: "ugarit-serpent-charms-and-lotan", to: "hyksos-avaris-sutekh", relation: "related", note: "The Canaanite storm god Baal was identified with Set/Sutekh by Egyptians and Levantines in the Delta." },
  { from: "ugarit-serpent-charms-and-lotan", to: "gudea-vase-entwined-serpents", relation: "related", note: "Another Bronze Age Near Eastern serpent image, Mesopotamian, kept separate." },
  { from: "denyen-danuna-and-dan-yadin-hypothesis", to: "meshwesh-ramesses-iii-medinet-habu", relation: "related", note: "Ramesses III's Medinet Habu records name both the Sea Peoples and the Libyan Meshwesh." },
  { from: "denyen-danuna-and-dan-yadin-hypothesis", to: "goliath-of-gath", relation: "related", note: "The Philistines, Yadin's model for a Sea People settled in Canaan." },
  { from: "jeroboam-golden-calves-dan-and-bethel", to: "set-lord-of-the-red-land", relation: "related", note: "Storm-god and bull imagery of the Levant; kept separate from any serpent." },
  { from: "tel-dan-serpent-imagery-what-is-reported", to: "primordial-serpent-energy-doctrine", relation: "relevant", note: "A serpent motif on Levantine jars is a regional decoration, not evidence for a single universal serpent doctrine." },
];

export const DAN: SerpentSection = { sources, events, links };
