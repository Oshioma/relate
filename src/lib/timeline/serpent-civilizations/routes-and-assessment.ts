// THE SERPENT ACROSS CIVILIZATIONS — ROUTES, COMPARISONS AND THE ASSESSMENT.
//
// Two lanes. "routes" sets out the five possible routes of transmission the
// brief named (A–E), each with its earliest and latest relevant dates, its
// archaeological, textual and linguistic evidence, its known intermediaries,
// its gaps, and what contradicts it. Routes A–C are hypotheses where religion
// is concerned and are filed as such, with their proponents named; D (local
// development) and E (the documented Atlantic crossing) are history.
//
// "assessment" holds eight of the ten named comparisons (the other two — the
// serpent ditch and the Genesis/hymn comparison — are in the rituals lane),
// two control records (python veneration elsewhere in Africa, and the history
// of the idea that Dangbé came from Israel or Egypt), and the conclusion page,
// which is the track's anchor.
//
// HOW IT WAS RESEARCHED. Primary texts read in full-text scans on archive.org
// in this session: Moreau de Saint-Méry's Description (1797, vol. 1,
// pp. 45–47, the Vaudoux and its snake), Leo Africanus in Pory's 1600 English
// (Hakluyt Society edition of 1896, vol. 3: Timbuktu and Tegorarin), and
// Labat's Des Marchais (1730, vol. 2, ch. VII). The Hebrew verses were checked
// against a Masoretic text (Sefaria's, accents omitted), the KJV wording from
// the 1769 standard text. Bibliographic details of modern scholarship were
// checked through Crossref, publisher and library records; it is paraphrased,
// not quoted. Every picture's file page on Wikimedia Commons was fetched in
// this session and its licence and creator copied from it.

import type { SeedClaim, SeedEvent, SeedEventLink, SeedSource } from "../seed-types";
import { SERPENT_LANES, SERPENT_LANE_ANCHORS, bce, commonsPicture, serpentTags, type SerpentSection } from "./shared";

const ROUTES = SERPENT_LANES.routes;
const ASSESSMENT = SERPENT_LANES.assessment;
const A = SERPENT_LANE_ANCHORS;

/** A claim that places nothing: an undated tradition, a reconstruction, a theory with no date. */
function undated(input: {
  sourceKey: string | null;
  citations?: SeedClaim["citations"];
  text: string;
  what: string;
  chronology: string;
  datingMethod?: string;
  evidence: string;
}): SeedClaim {
  return {
    sourceKey: input.sourceKey,
    citations: input.citations,
    datePrecision: "millennium",
    isApproximate: true,
    temporalClaimType: "unknown",
    originalDateText: input.text,
    whatIsDated: input.what,
    datingMethod: input.datingMethod ?? "source_assertion",
    chronology: input.chronology,
    evidence: input.evidence,
  };
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // ---- canonical keys shared with the other sections ------------------------
  {
    key: "kjv_bible",
    title: "The Holy Bible, King James Version",
    author: "King James translators (1611; standard 1769 Oxford text)",
    reference: "Genesis 30:6; 49:16–17; Numbers 21:8–9; 2 Kings 18:4",
    url: "https://www.kingjamesbibleonline.org/",
    sourceType: "religious_text",
    publishedYear: 1611,
    publishedDisplay: "1611; standard text 1769",
    notes:
      "Cited for the English wording of the verses compared here: the naming of Dan as 'judged' (Gen 30:6), Dan as 'a serpent by the way' (Gen 49:17), and the bronze serpent and its destruction (Num 21; 2 Kgs 18:4). Public domain. A translation, not evidence for the events narrated.",
  },
  {
    key: "wlc_hebrew_bible",
    title: "Westminster Leningrad Codex",
    author: "J. Alan Groves Center for Advanced Biblical Research (digital text of the Leningrad Codex)",
    reference: "Genesis 30:6; 49:16–17; 2 Kings 18:4 (accents omitted here)",
    url: "https://tanach.us/Tanach.xml",
    sourceType: "religious_text",
    publishedDisplay: "manuscript dated 1008/1009 CE; digital edition",
    notes:
      "Cited for the Hebrew of the verses compared: dān and the verb dānannî 'he has judged me' (Gen 30:6), nāḥāš 'serpent' and šəfîfōn (Gen 49:17), nəḥaš hannəḥōšet and Nəḥuštān (2 Kgs 18:4). The Leningrad Codex is an eleventh-century CE manuscript of a text composed much earlier; the wording here was checked against a Masoretic text in this session.",
  },
  {
    key: "porten_yardeni_tad",
    title: "Textbook of Aramaic Documents from Ancient Egypt",
    author: "Bezalel Porten and Ada Yardeni",
    publisher: "Hebrew University, Department of the History of the Jewish People, Jerusalem (4 vols, 1986–1999)",
    reference: "Vol. 1, A4.7 (the petition of 407 BCE about the destroyed temple of YHW at Elephantine)",
    sourceType: "academic_book",
    publishedYear: 1986,
    publishedDisplay: "1986–1999",
    notes:
      "THE STANDARD EDITION of the Elephantine Aramaic papyri, cited for the documented Judahite garrison community at Elephantine in the fifth century BCE and its temple of YHW, the strongest evidence that people of Israelite and Judahite origin lived on the Nile at the edge of Nubia. Not opened in this session; cited at document level.",
  },
  {
    key: "kaplan_1992_beta_israel",
    title: "The Beta Israel (Falasha) in Ethiopia: From Earliest Times to the Twentieth Century",
    author: "Steven Kaplan",
    publisher: "New York University Press",
    reference: "New York University Press, 1992 (monograph; chapters on origins and on the Danite identification)",
    sourceType: "academic_book",
    publishedYear: 1992,
    publishedDisplay: "1992",
    notes:
      "Cited for the mainstream historical reconstruction of Beta Israel origins as an Ethiopian development of the fourteenth to sixteenth centuries CE, and for the later (sixteenth-century and modern) identification of the Beta Israel with the tribe of Dan. Not opened in this session; cited for its thesis. NEEDS SOURCE VERIFICATION for page-level detail.",
  },
  {
    key: "quirin_1992_evolution_of_ethiopian_jews",
    title: "The Evolution of the Ethiopian Jews: A History of the Beta Israel (Falasha) to 1920",
    author: "James Quirin",
    publisher: "University of Pennsylvania Press, Philadelphia",
    reference: "University of Pennsylvania Press, 1992 (monograph; chapters on Beta Israel origins)",
    sourceType: "academic_book",
    publishedYear: 1992,
    publishedDisplay: "1992",
    notes:
      "Cited alongside Kaplan for the historical formation of the Beta Israel within Ethiopia, and for the distinction between their own origin traditions and the Danite identification made by outsiders. Not opened in this session. NEEDS SOURCE VERIFICATION for page-level detail.",
  },
  {
    key: "nobili_mathee_2015_tarikh_al_fattash",
    title: "Towards a New Study of the So-Called Tārīkh al-fattāsh",
    author: "Mauro Nobili and Mohamed Shahid Mathee",
    publisher: "History in Africa 42",
    reference: "History in Africa 42 (2015)",
    sourceType: "academic_paper",
    publishedYear: 2015,
    publishedDisplay: "2015",
    notes:
      "Cited for the finding that the text printed as Tārīkh al-fattāsh combines a seventeenth-century chronicle with nineteenth-century reworking, so that passages in it (including those cited for Jews in the Niger Bend) cannot be assumed to be early. Bibliographic details from the lead's canonical list; not opened in this session.",
  },
  {
    key: "adler_1930_jewish_travellers",
    title: "Jewish Travellers",
    author: "Elkan Nathan Adler (ed.)",
    publisher: "George Routledge & Sons, London",
    reference: "The account of Eldad ha-Dani (ninth century CE) in English translation",
    sourceType: "primary",
    publishedYear: 1930,
    publishedDisplay: "1930",
    notes:
      "Cited for an English translation of Eldad ha-Dani's ninth-century account placing the tribe of Dan, with Naphtali, Gad and Asher, in 'Havilah' beyond the rivers of Cush: the earliest surviving text to put Danites in Africa. A late text about an event it does not date, cited as the beginning of a tradition, not as evidence of a migration.",
  },
  {
    key: "capo_1991_comparative_phonology_gbe",
    title: "A Comparative Phonology of Gbe",
    author: "Hounkpati B. Christophe Capo",
    publisher: "Foris (Publications in African Languages and Linguistics 14), Berlin; Labo Gbe, Garome",
    reference: "Foris, Berlin, and Labo Gbe, Garome, 1991 (monograph)",
    sourceType: "academic_book",
    publishedYear: 1991,
    publishedDisplay: "1991",
    notes:
      "Cited for the Gbe languages (Ewe, Aja, Fon, Gun, Xwla/Xweda and others) as one family with regular internal sound correspondences, reconstructible on its own terms within Kwa (Niger-Congo) — the frame in which any comparison of 'dan' must be made. Not opened in this session.",
  },
  {
    key: "greer_2013_dinner_at_dan",
    title:
      "Dinner at Dan: Biblical and Archaeological Evidence for Sacred Feasts at Iron Age II Tel Dan and Their Significance",
    author: "Jonathan S. Greer",
    publisher: "Brill (Culture and History of the Ancient Near East 66), Leiden",
    reference: "Brill, Leiden, 2013 (CHANE 66; monograph on Tel Dan Area T)",
    sourceType: "academic_book",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for the excavated sacred precinct at Tel Dan (Area T) and its feasting remains, read with the biblical texts: what the archaeology of the Danite cult centre shows, and that it shows no serpent cult. Not opened in this session.",
  },
  {
    key: "biran_1994_biblical_dan",
    title: "Biblical Dan",
    author: "Avraham Biran",
    publisher: "Israel Exploration Society and Hebrew Union College–Jewish Institute of Religion, Jerusalem",
    reference: "Israel Exploration Society, Jerusalem, 1994 (excavation monograph)",
    sourceType: "academic_book",
    publishedYear: 1994,
    publishedDisplay: "1994",
    notes:
      "Cited for the excavator's account of Tel Dan (Laish): the Middle Bronze Age gate, the Iron Age high place and gates, and the stratigraphy against which the biblical Danite narratives are read. Not opened in this session.",
  },
  {
    key: "norman_kelly_2004_landscape_politics",
    title: "Landscape Politics: The Serpent Ditch and the Rainbow in West Africa",
    author: "Neil L. Norman and Kenneth G. Kelly",
    publisher: "American Anthropologist 106 (1)",
    reference: "American Anthropologist 106 (2004), pp. 98–110; doi:10.1525/aa.2004.106.1.98",
    url: "https://anthrosource.onlinelibrary.wiley.com/doi/pdf/10.1525/aa.2004.106.1.98",
    sourceType: "academic_paper",
    publishedYear: 2004,
    publishedDisplay: "2004",
    notes:
      "Cited for the archaeology of Hueda at Savi and its ditch systems read through the serpent and rainbow (Dan/Aido-Hwedo) in the Gbe landscape: the strongest evidence that Hueda serpent religion was embedded in a local political landscape. Bibliographic details checked in this session.",
  },
  {
    key: "des_marchais_labat_1730_voyage",
    title: "Voyage du chevalier Des Marchais en Guinée, isles voisines, et à Cayenne, fait en 1725, 1726 & 1727",
    author: "Jean-Baptiste Labat (from the papers of Renaud Des Marchais)",
    publisher: "Saugrain, Paris (4 vols)",
    reference: "Vol. 2, ch. VII, 'De la Religion du Royaume de Juda' (circumcision 'sans être Juifs ni Mahométans'; talion 'il semble qu'ils ayent emprunté cette Loi des Juifs'); the coronation plate",
    url: "https://archive.org/details/voyageduchevali02labagoog",
    sourceType: "primary",
    publishedYear: 1730,
    publishedDisplay: "1730",
    notes:
      "Cited for the Hueda coronation and the procession to the serpent's house, and — read in this session — for Labat's own comparisons of Hueda custom with Jewish law (circumcision, the law of talion), the eighteenth-century habit that later grew into the Dan-and-Israel derivation. Page numbers not fixed from the poor OCR.",
  },
  {
    key: "agbo_1959_histoire_de_ouidah",
    title: "Histoire de Ouidah du XVIe au XXe siècle",
    author: "Casimir Agbo (dit Alidji)",
    publisher: "Presses Universelles, Avignon",
    url: "https://fr.scribd.com/document/964715803/5645385058bad5d16acc1d5d4a970429400c64",
    sourceType: "book",
    publishedYear: 1959,
    publishedDisplay: "1959",
    notes:
      "Cited for the Ouidah historian's account of Dangbé and the hymn 'Dagbé wè houn noukoun na mi' that Merlo and Vidaud later compared with Genesis 3. A local, Christian-era written source for a living tradition. Not read in full in this session; the hymn is treated in the rituals lane.",
  },
  {
    key: "merlo_vidaud_1966_black_serpent",
    title: "The Black Serpent Who Opened the Eyes of Man",
    author: "Christian Merlo and Pierre Vidaud",
    publisher: "Diogenes 14 (55)",
    reference: "Diogenes 14, no. 55 (September 1966), pp. 61–88; doi:10.1177/039219216601405505",
    url: "https://journals.sagepub.com/doi/10.1177/039219216601405505",
    sourceType: "academic_paper",
    publishedYear: 1966,
    publishedDisplay: "1966",
    notes:
      "Cited as the principal modern proponents of a universal serpent myth running from the Hueda python to the serpent of Eden: their abstract describes tracing 'the mythic analogies of the Python' in Black Africa, then the whole continent, as a summary of a forthcoming book, Dangbé, du Python sacré dahoméen au mythe universel du Serpent. Volume, issue and pages confirmed through Crossref in this session; the article itself was not read beyond its abstract.",
  },
  {
    key: "law_1991_slave_coast",
    title: "The Slave Coast of West Africa 1550–1750: The Impact of the Atlantic Slave Trade on an African Society",
    author: "Robin Law",
    publisher: "Clarendon Press, Oxford",
    reference: "Clarendon Press, Oxford, 1991 (monograph; chapters on Allada and Hueda)",
    sourceType: "academic_book",
    publishedYear: 1991,
    publishedDisplay: "1991",
    notes:
      "THE STANDARD HISTORY of Allada and Hueda, cited for the documented political history of the coast from the sixteenth century, its links inland, and the European sources on its religion. Not opened in this session; cited at chapter level.",
  },
  {
    key: "blier_1995_african_vodun",
    title: "African Vodun: Art, Psychology, and Power",
    author: "Suzanne Preston Blier",
    publisher: "University of Chicago Press",
    reference: "University of Chicago Press, 1995 (monograph)",
    sourceType: "academic_book",
    publishedYear: 1995,
    publishedDisplay: "1995",
    notes:
      "Cited for the place of Dan and serpent imagery in Fon and Gbe vodun art and thought, read as a West African system in its own terms. Not opened in this session; cited for its approach.",
  },

  // ---- proponents of the routes as religious transmission -------------------
  {
    key: "lucas_1948_religion_of_the_yorubas",
    title: "The Religion of the Yorubas, being an account of the religious beliefs and practice of the Yoruba peoples of southern Nigeria, especially in relation to the religion of ancient Egypt",
    author: "J. Olumide Lucas",
    publisher: "C.M.S. Bookshop, Lagos",
    reference: "Lagos, 1948 (monograph)",
    sourceType: "book",
    publishedYear: 1948,
    publishedDisplay: "1948",
    notes:
      "Cited as the classic statement of an Egyptian origin for West African (Yoruba) religion, argued from resemblances of words, divine names and rites: the scholarly root of Route B as religious transmission. Not opened in this session; its subtitle and thesis are confirmed by bibliographic records. Publisher NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "diop_1974_african_origin_of_civilization",
    title: "The African Origin of Civilization: Myth or Reality",
    author: "Cheikh Anta Diop (tr. Mercer Cook)",
    publisher: "Lawrence Hill, New York",
    reference: "Lawrence Hill, New York, 1974 (English translation by Mercer Cook)",
    sourceType: "book",
    publishedYear: 1974,
    publishedDisplay: "1974 (from French works of 1954 and 1967)",
    notes:
      "Cited for the argument that ancient Egypt was a Black African civilisation and that African cultures share a common cultural foundation with it — the frame in which later writers placed Egypt-to-West-Africa derivations. Diop does not document a route for any Gbe cult. Not opened in this session.",
  },
  {
    key: "seligman_1934_egypt_and_negro_africa",
    title: "Egypt and Negro Africa: A Study in Divine Kingship",
    author: "C. G. Seligman",
    publisher: "George Routledge & Sons, London (the Frazer Lecture for 1933)",
    reference: "Routledge, London, 1934 (Frazer Lecture for 1933)",
    sourceType: "book",
    publishedYear: 1934,
    publishedDisplay: "1934",
    notes:
      "Cited as an early academic diffusionist statement deriving African divine kingship from Egypt, in the 'Hamitic' framework that later scholarship rejected. A proponent of Route B for kingship, not for serpent cults. Not opened in this session.",
  },
  {
    key: "meyerowitz_1960_divine_kingship",
    title: "The Divine Kingship in Ghana and Ancient Egypt",
    author: "Eva L. R. Meyerowitz",
    publisher: "Faber and Faber, London",
    reference: "Faber and Faber, London, 1960 (monograph)",
    sourceType: "book",
    publishedYear: 1960,
    publishedDisplay: "1960",
    notes:
      "Cited as a mid-twentieth-century proponent of Egyptian influence, through the Sudan, on Akan kingship in Ghana — the nearest published Route B argument for a West African coastal kingdom. Not opened in this session; cited for its thesis.",
  },
  {
    key: "williams_1930_hebrewisms_of_west_africa",
    title: "Hebrewisms of West Africa: From Nile to Niger with the Jews",
    author: "Joseph J. Williams, S.J.",
    publisher: "The Dial Press, New York; Allen & Unwin, London",
    url: "https://openlibrary.org/works/OL21166216W",
    sourceType: "book",
    publishedYear: 1930,
    publishedDisplay: "1930",
    notes:
      "Cited as the fullest early argument for Jewish diffusion 'from Nile to Niger', chiefly among the Ashanti (Akan): a Jesuit's catalogue of 'Hebrewisms, real or apparent', reviewed in Africa in 1930. A proponent of Routes A–C as Israelite transmission, not of a Danite origin for Dangbé. Bibliographic details confirmed in this session; not read in full.",
  },
  {
    key: "windsor_1969_from_babylon_to_timbuktu",
    title: "From Babylon to Timbuktu: A History of the Ancient Black Races Including the Black Hebrews",
    author: "Rudolph R. Windsor",
    publisher: "Exposition Press, New York",
    reference: "New York, 1969 (first edition; many reprints)",
    sourceType: "book",
    publishedYear: 1969,
    publishedDisplay: "1969",
    notes:
      "Cited as the most widely read Black Hebrew Israelite history arguing that Israelites fled into Africa and reached the empires of the western Sudan: the popular form of Routes A and C. Read only in summaries in this session; publisher NEEDS SOURCE VERIFICATION. It identifies no Danite route to the Bight of Benin.",
  },

  // ---- primary sources read in this session ---------------------------------
  {
    key: "leo_africanus_pory_1896",
    title: "The History and Description of Africa and of the Notable Things Therein Contained",
    author: "Leo Africanus (al-Ḥasan al-Wazzān), tr. John Pory (1600), ed. Robert Brown",
    publisher: "Hakluyt Society, London (3 vols)",
    reference: "Vol. 3: the kingdom of Tombuto, p. 825 (the king 'so deadly hateth all Iewes'); the region of Tegorarin, p. 789 (rich Jews expelled 'by the meanes of a certaine Mahumetan preacher' in the year of the Spanish expulsion)",
    url: "https://archive.org/details/india.history.resource.88580",
    sourceType: "primary",
    publishedYear: 1896,
    publishedDisplay: "Italian 1550 (written 1526); English 1600; Hakluyt edition 1896",
    notes:
      "Cited for an early sixteenth-century eyewitness of the Niger Bend: that the ruler of Timbuktu would admit no Jew to his city and confiscated the goods of merchants who traded with them, and that the rich Jewish community of the Gourara–Tuat oases was expelled and many killed in 1492. Read on archive.org in this session; spelling as in Pory.",
  },
  {
    key: "moreau_saint_mery_1797_description",
    title: "Description topographique, physique, civile, politique et historique de la partie française de l'isle Saint-Domingue",
    author: "Médéric Louis Élie Moreau de Saint-Méry",
    publisher: "Chez l'auteur, Philadelphia (2 vols)",
    reference: "Vol. 1, pp. 45–47 (the Vaudoux)",
    url: "https://archive.org/details/descriptiontopog00more",
    sourceType: "primary",
    publishedYear: 1797,
    publishedDisplay: "written in the 1780s; published 1797",
    notes:
      "Cited for the earliest substantial description of Vodou in Saint-Domingue: that 'according to the Arada negroes, who are the true sectaries of the Vaudoux', the word means an all-powerful supernatural being, 'the non-venomous serpent', kept in a box on an altar where initiates could see it through bars. Read on archive.org in this session. VIEWPOINT: a colonial lawyer writing about the enslaved, largely at second hand.",
  },
  {
    key: "bruce_1790_travels",
    title: "Travels to Discover the Source of the Nile, in the Years 1768, 1769, 1770, 1771, 1772, and 1773",
    author: "James Bruce",
    publisher: "G. G. J. and J. Robinson, Edinburgh and London (5 vols)",
    reference: "Vol. 1, the passage on the Falasha (Beta Israel)",
    url: "https://archive.org/details/travelstodiscove01bruc",
    sourceType: "primary",
    publishedYear: 1790,
    publishedDisplay: "1790",
    notes:
      "Cited for the first extended European account of the Beta Israel, which records their own Solomonic origin tradition (tied to the Queen of Sheba), not a Danite one — evidence that the Danite identification came to them from outside. Not read in full in this session; the passage is shown in a Commons scan.",
  },

  // ---- modern scholarship ----------------------------------------------------
  {
    key: "mark_horta_2011_forgotten_diaspora",
    title: "The Forgotten Diaspora: Jewish Communities in West Africa and the Making of the Atlantic World",
    author: "Peter Mark and José da Silva Horta",
    publisher: "Cambridge University Press",
    reference: "Cambridge University Press, 2011, ISBN 9780521192866",
    sourceType: "academic_book",
    publishedYear: 2011,
    publishedDisplay: "2011",
    notes:
      "Cited for the only documented Jewish communities on the West African coast before the nineteenth century: Portuguese Sephardic traders living openly as Jews at Porto de Ale and Joal on Senegal's Petite Côte in the early seventeenth century, with a rabbi sent from Amsterdam. Some 2,500 km from Ouidah, and arms traders rather than missionaries. Not opened in this session; its scope confirmed from the publisher's description.",
  },
  {
    key: "alpern_2005_iron_sub_saharan_africa",
    title: "Did They or Didn't They Invent It? Iron in Sub-Saharan Africa",
    author: "Stanley B. Alpern",
    publisher: "History in Africa 32",
    reference: "History in Africa 32 (2005), pp. 41–94; doi:10.1353/hia.2005.0003",
    sourceType: "academic_paper",
    publishedYear: 2005,
    publishedDisplay: "2005",
    notes:
      "Cited for the review of the old thesis that iron-working spread west from Meroë, and the West African radiocarbon dates (Termit, Taruga and others) that undercut it: the clearest test case of a proposed Kush-to-West-Africa diffusion. Bibliographic details checked through Crossref; not read in full in this session.",
  },
  {
    key: "torok_1997_kingdom_of_kush",
    title: "The Kingdom of Kush: Handbook of the Napatan-Meroitic Civilization",
    author: "László Török",
    publisher: "Brill (Handbuch der Orientalistik), Leiden",
    reference: "Brill, Leiden, 1997 (Handbuch der Orientalistik I.31)",
    sourceType: "academic_book",
    publishedYear: 1997,
    publishedDisplay: "1997",
    notes:
      "Cited for the documented Egyptian contribution to Kushite kingship and religion (the Amun cult at Jebel Barkal, the uraeus and double uraeus) and for Meroitic religion, including Apedemak: the case of established Egyptian influence on Kush. Not opened in this session; cited for its overall argument.",
  },
  {
    key: "bell_1985_luxor_royal_ka",
    title: "Luxor Temple and the Cult of the Royal Ka",
    author: "Lanny Bell",
    publisher: "Journal of Near Eastern Studies 44 (4)",
    reference: "JNES 44 (1985), pp. 251–294; doi:10.1086/373148",
    sourceType: "academic_paper",
    publishedYear: 1985,
    publishedDisplay: "1985",
    notes:
      "Cited for the Opet festival as the annual procession in which the king's royal ka was renewed at Luxor temple — the Egyptian royal ceremony used here as the comparison for Hueda's coronation processions. Bibliographic details checked through Crossref; not read in full.",
  },
  {
    key: "wilkinson_2003_complete_gods",
    title: "The Complete Gods and Goddesses of Ancient Egypt",
    author: "Richard H. Wilkinson",
    publisher: "Thames & Hudson, London",
    reference: "Thames & Hudson, London, 2003 (entry 'Wadjet')",
    sourceType: "academic_book",
    publishedYear: 2003,
    publishedDisplay: "2003",
    notes:
      "Cited for Wadjet as the cobra goddess of Buto and Lower Egypt, one of the 'Two Ladies' of the royal titulary, and the uraeus on the king's brow. Not opened in this session; cited for standard Egyptological identifications.",
  },
  {
    key: "met_wadjet_akanosh_35_9_2",
    title: "Statuette of Wadjet in the name of Akanosh son of Pediamenopet (35.9.2)",
    author: "The Metropolitan Museum of Art",
    url: "https://www.metmuseum.org/art/collection/search/550782",
    sourceType: "museum",
    publishedDisplay: "museum catalogue entry",
    notes:
      "Cited for a dated object showing Wadjet: a Third Intermediate Period to Kushite Period (Dynasties 21–25, c. 1070–664 BCE or later) statuette, open-access, so the cobra goddess can be set beside the Ouidah python.",
  },
  {
    key: "pares_2013_formation_of_candomble",
    title: "The Formation of Candomblé: Vodun History and Ritual in Brazil",
    author: "Luis Nicolau Parés",
    publisher: "University of North Carolina Press, Chapel Hill",
    reference: "University of North Carolina Press, 2013 (translation of A formação do candomblé, 2006)",
    sourceType: "academic_book",
    publishedYear: 2013,
    publishedDisplay: "2013 (Portuguese 2006)",
    notes:
      "Cited for the documented transmission of Gbe vodun to Bahia through the 'Jeje' nation of Candomblé, including the serpent vodun Bessen (Dan) and the Dangbé-related cult names: the Atlantic control case of what demonstrable religious transmission leaves behind. Not opened in this session; cited for its thesis.",
  },
  {
    key: "slavevoyages_estimates",
    title: "Trans-Atlantic Slave Trade Database: Estimates",
    author: "SlaveVoyages consortium (David Eltis, David Richardson and others)",
    url: "https://www.slavevoyages.org/assessment/estimates",
    sourceType: "website",
    publishedDisplay: "online database",
    notes:
      "Cited for the order of magnitude of the forced migration from the Bight of Benin — about two million people embarked, 1501–1866, by the database's estimates as tabulated in published work. The live query was not run in this session: NEEDS SOURCE VERIFICATION for the exact figure.",
  },
  {
    key: "cleveland_baga_headdress_1960_37",
    title: "Serpent Headdress (a-Mantsho-ña-Tshol), Guinea Coast, possibly Baga (1960.37)",
    author: "The Cleveland Museum of Art",
    url: "https://clevelandart.org/art/1960.37",
    sourceType: "museum",
    publishedDisplay: "museum catalogue entry",
    notes:
      "Cited for a documented serpent sculpture from the Baga of coastal Guinea, used in initiation, an example of serpent religion on the West African coast far from the Gbe and with no Nile or Israelite connection claimed for it. Open-access (CC0).",
  },
  {
    key: "herskovits_1938_dahomey",
    title: "Dahomey: An Ancient West African Kingdom",
    author: "Melville J. Herskovits",
    publisher: "J. J. Augustin, New York (2 vols)",
    reference: "J. J. Augustin, New York, 1938 (2 vols)",
    sourceType: "academic_book",
    publishedYear: 1938,
    publishedDisplay: "1938",
    notes:
      "Cited for the first systematic ethnography of Fon religion, including Da (Dan) as the serpent principle of movement and continuity and Aido-Hwedo as the serpent that carried the creator — the West African serpent cosmology compared here with Kush. Not opened in this session.",
  },
];

// ---------------------------------------------------------------------------
// Pictures (every file page fetched in this session)
// ---------------------------------------------------------------------------

const P = {
  delisleAfrique1722: commonsPicture({
    fileName: "Carte d'Afrique dressée pour l'usage du roy - par Guillaume Delisle - btv1b8595153t.jpg",
    caption:
      "Guillaume Delisle's 'Carte d'Afrique dressée pour l'usage du Roy', Paris, 1722 (Bibliothèque nationale de France). An eighteenth-century European map: it shows what Europeans then knew of the Nile, the Sahara, the Niger and the Guinea coast — the stage on which every proposed route is drawn — not any route of religious transmission.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain (PD-1923)",
    creator: "Delisle, Guillaume (1675-1726). Cartographe",
    institution: "Bibliothèque nationale de France",
    objectDate: "1722",
  }),
  delisleBarbarieNigritie: commonsPicture({
    fileName: "Carte de la Barbarie, le la Nigritie et del la Guinée LOC 98687196.jpg",
    caption:
      "Guillaume de L'Isle's 'Carte de la Barbarie, de la Nigritie et de la Guinée' (map first drawn in the early eighteenth century; this Library of Congress impression is dated 1792 on its file page). It joins North Africa, the Sahara, the Niger ('Nigritie') and the Guinea coast on one sheet — the geography of Route C, drawn by a European who had travelled none of it.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Guillaume de L'Isle (1675–1726)",
    institution: "Library of Congress",
    objectDate: "1792 (printing recorded on the file page)",
  }),
  catalanAtlasSahara: commonsPicture({
    fileName: "Catalan Atlas BNF Sheet 6 Western Sahara.jpg",
    caption:
      "The Catalan Atlas of 1375, attributed to Abraham Cresques, a Jewish cartographer of Majorca (Bibliothèque nationale de France): the western Sahara, with the Atlas Mountains above, the Niger below, a veiled rider of the desert and Mansa Musa of Mali enthroned with a gold nugget. A medieval map, evidence of what the trans-Saharan gold trade made known in the Mediterranean — and that Jewish mapmakers knew of Mali — not of any religious transmission southward.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "attributed to Abraham Cresques",
    institution: "Bibliothèque nationale de France",
    objectDate: "1375",
  }),
  transSaharanRoutes: commonsPicture({
    fileName: "Trans-Saharan routes early.svg",
    caption:
      "A modern reconstruction map of the trade routes of the western Sahara, c. 1000–1500 CE, with the goldfields shaded. A diagram drawn from scholarship, not a historical document: it shows documented trade routes, which are not routes of religious transmission.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "CC0",
    creator: "Aa77zz",
    objectDate: "2011 (modern map)",
  }),
  orteliusAfrica1570: commonsPicture({
    fileName: "Ortelius Africae Tabula Nova 1570 UTA.jpg",
    caption:
      "Abraham Ortelius's 'Africae Tabula Nova', 1570 (UTA Libraries). A sixteenth-century European map of Africa, its Nile and 'Nubia' and 'Abissinorum' joined to the Niger by guesswork: the kind of map on which diffusionist routes from Egypt westward were later imagined. It shows European geography, not routes anyone travelled.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Abraham Ortelius (1527–1598)",
    institution: "University of Texas at Arlington Libraries",
    objectDate: "1570",
  }),
  meroePyramids: commonsPicture({
    fileName: "Sudan Meroe Pyramids 30sep2005.jpg",
    caption:
      "The pyramids of Meroë, Sudan, photographed in 2005; pyramid N19 in front. The royal cemetery of the Meroitic kingdom (c. third century BCE to fourth century CE): Egyptian-derived royal forms on the Middle Nile, the eastern end of Route B.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 2.0",
    creator: "Fabrizio Demartis",
    objectDate: "photographed 30 September 2005",
  }),
  taharqaSphinx: commonsPicture({
    fileName:
      "Ram sphinx of king Taharqa (Taharqo), 25th (Kushite) Dynasty, 690-664 BCE. From Kawa, Sudan. The British Museum, London.jpg",
    caption:
      "Ram sphinx of the Kushite king Taharqa (r. 690–664 BCE), from Kawa, Sudan, now in the British Museum: Amun as a ram protecting the king. Egyptian religion carried into Kush and worn by Kushite kings — the documented part of Route B.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Osama Shukir Muhammed Amin FRCP(Glasg)",
    institution: "British Museum",
    objectDate: "690–664 BCE (object); photographed 2016",
  }),
  elephantineIsland: commonsPicture({
    fileName: "Elephantine Island, Aswan, AG, EGY (48025587842).jpg",
    caption:
      "Elephantine Island at Aswan, photographed in 2019. In the fifth century BCE a garrison of Judahites lived here with their own temple of YHW, on Egypt's southern frontier with Nubia — the best-documented point on Route A.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Warren LeMay from Cullowhee, NC, United States",
    objectDate: "photographed 16 May 2019",
  }),
  elephantinePapyrus: commonsPicture({
    fileName: "Elephantine papyrus J 37113 (Sayce and Cowley 1906, J) from the Mibtahiah archive.jpg",
    caption:
      "An Aramaic papyrus from the archive of Mibtahiah, a Judahite woman of Elephantine (fifth century BCE), in the Egyptian Museum, Cairo, photographed in 2022. Contemporary documents of a Jewish community on the Nile: they show Judahites at the edge of Nubia, and nothing about Dan or serpents.",
    shows: "manuscript",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Onceinawhile",
    institution: "Egyptian Museum, Cairo",
    objectDate: "fifth century BCE (object); photographed 2022",
  }),
  bruceBetaIsrael: commonsPicture({
    fileName: "Travels to Discover the Source of the Nile Beta Israel.jpg",
    caption:
      "A page of James Bruce's Travels to Discover the Source of the Nile (1790), vol. 1, on the Beta Israel (Falasha) of Ethiopia. A printed eighteenth-century account: it records the community's Solomonic origin tradition, not a Danite one.",
    shows: "historical_document",
    identificationStatus: "secure",
    licence: "Public domain (PD-1923)",
    creator: "Unknown author",
    objectDate: "1790",
  }),
  tamentit: commonsPicture({
    fileName: "Ksar de Tamentit 01.jpg",
    caption:
      "The ksar (fortified village) of Tamentit in the Tuat oases of the Algerian Sahara, photographed in 2016. Tamentit had a Jewish community, a node in the trans-Saharan trade, until its expulsion in the 1490s. A present-day photograph of the place, not of the medieval community.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Benzita Abdelhadi",
    objectDate: "photographed 22 March 2016",
  }),
  whydahMap: commonsPicture({
    fileName: "Carte du royaume de Whidah - (des Marchais) - btv1b8595588d.jpg",
    caption:
      "'Carte du royaume de Whidah', the kingdom of Hueda, drawn from the papers of the French captain Renaud Des Marchais (BnF impression dated 1747). An eighteenth-century European map of the Hueda kingdom with Savi and the coast — the setting of Route D.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain (PD-1923)",
    creator: "Des Marchais, Renaud (16..-1728?). Cartographe",
    institution: "Bibliothèque nationale de France",
    objectDate: "1747 (impression); from observations of 1725",
  }),
  slaveCoast1789: commonsPicture({
    fileName: "Map of Slave Coast-1789.jpg",
    caption:
      "Robert Norris's map of the Slave Coast, published in his Memoirs of the Reign of Bossa Ahádee (1789). An eighteenth-century English slave-trader's map, showing Whydah, Allada and Dahomey in the period when the coast's people were being carried to the Americas.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Norris, Robert",
    objectDate: "1789",
  }),
  saviPalacePlan: commonsPicture({
    fileName:
      "Plan du palais du roy à Xavier ou Sabi dans le royaume de Whidah - tiré de Marchais - btv1b85955929.jpg",
    caption:
      "'Plan du palais du roy à Xavier ou Sabi', the Hueda king's palace at Savi, drawn from Des Marchais's papers (BnF impression dated 1747). An eighteenth-century European plan, the documentary counterpart of the excavations at Savi; drawn, not surveyed by modern methods.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain (PD-1923)",
    creator: "Des Marchais, Renaud (16..-1728?). Cartographe",
    institution: "Bibliothèque nationale de France",
    objectDate: "1747 (impression); from observations of 1725",
  }),
  saintDomingue1776: commonsPicture({
    fileName: "Carte générale de la partie française de l'isle de St. Domingue. LOC 74692178.jpg",
    caption:
      "Manuscript 'Carte générale de la partie française de l'isle de St. Domingue', 1776 (Library of Congress). An eighteenth-century map of the French colony where, in the 1780s, Moreau de Saint-Méry recorded the Arada 'Vaudoux' and its snake.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Unknown author",
    institution: "Library of Congress",
    objectDate: "1776",
  }),
  dambalaFlag: commonsPicture({
    fileName: "Collectie Nationaal Museum van Wereldculturen AM-670-9 Dambala Haiti.jpg",
    caption:
      "A Haitian Vodou ceremonial flag (drapo) for Dambala, the serpent lwa, in the Nationaal Museum van Wereldculturen (AM-670-9). A twentieth-century sacred object of the Haitian tradition whose serpent spirit's name descends from Gbe Dan.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "Public domain",
    institution: "Nationaal Museum van Wereldculturen",
    accessionNumber: "AM-670-9",
  }),
  oxumareDanDangbe: commonsPicture({
    fileName: "Oxumare. Dan. Dangbe.JPG",
    caption:
      "Candomblé in Bahia, Brazil, photographed in May 2008: an image the photographer labels 'Oxumare, Dan, Dangbe', the serpent-rainbow deity known by its Yoruba name Oxumarê and its Gbe names Dan and Dangbé in Jeje houses. A modern photograph of a living Afro-Brazilian practice.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Toluaye",
    objectDate: "photographed May 2008",
  }),
  pythonRoyal: commonsPicture({
    fileName: "Python royal.jpg",
    caption:
      "A royal or ball python (Python regius) at the Temple of Pythons, Ouidah, photographed in 2019. The non-venomous constrictor venerated as Dangbé — a different animal from the Egyptian cobra of Wadjet and the uraeus.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Padonou Dotou",
    objectDate: "photographed 7 April 2019",
  }),
  templePythons2019: commonsPicture({
    fileName: "Le Temple des Pythons de Ouidah.jpg",
    caption:
      "The Temple of Pythons (Dangbé's temple) at Ouidah, photographed in 2019. The present-day sanctuary of the python vodun, opposite the Catholic basilica; the building is modern, the cult first described by Europeans in the 1690s.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Rachad sanoussi",
    objectDate: "photographed 17 September 2019",
  }),
  templeEntrance2017: commonsPicture({
    fileName: "Entrée du Temple des Pythons (Ouidah).jpg",
    caption:
      "The entrance of the Temple of Pythons, Ouidah, Bénin, photographed in 2017. The gateway to Dangbé's sanctuary, shown here beside the Egyptian cobra goddess so that the two serpents are not confused.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Ji-Elle",
    objectDate: "photographed 13 March 2017",
  }),
  templeSerpents1900: commonsPicture({
    fileName: "Temple des serpents whydah.jpg",
    caption:
      "'Temple des Serpents, Whydah', a photograph of about 1900 from the Société des Missions Africaines. The serpent sanctuary of Ouidah under early French rule, a living cult housed in a shrine — unlike Nehushtan, an object, destroyed some two and a half thousand years earlier.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Unknown",
    institution: "Société des Missions Africaines",
    objectDate: "circa 1900",
  }),
  telDanIsraeliteGate: commonsPicture({
    fileName: "Tel Dan - Israelite Gate.jpg",
    caption:
      "The Iron Age (Israelite) gate complex at Tel Dan, northern Israel. The excavated city of the biblical tribe of Dan, where no serpent cult has been found; a modern photograph of the site.",
    shows: "site",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "en:User:Adrianlw",
  }),
  telDanCanaaniteGate: commonsPicture({
    fileName: "Tel-dan-kanaanite-gate-a.JPG",
    caption:
      "The Middle Bronze Age mud-brick gate at Tel Dan (Laish), photographed in 2014: the city as it stood centuries before the Danites of Judges 18 are said to have taken it. A modern photograph of an excavated monument.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Mboesch",
    objectDate: "photographed 28 April 2014",
  }),
  brazenSerpentPlaque: commonsPicture({
    fileName: "Plaque with Moses, Aaron, and the Brazen Serpent MET sf17-190-439s1.jpg",
    caption:
      "A German champlevé enamel plaque of about 1200 CE showing Moses, Aaron and the brazen serpent on its pole (Metropolitan Museum of Art). A later medieval Christian artwork illustrating Numbers 21, made some two thousand years after the events narrated: it shows how the story was imagined, not Nehushtan itself.",
    shows: "later_artwork",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Metropolitan Museum of Art",
    objectDate: "circa 1200 CE",
  }),
  wadjetAkanosh: commonsPicture({
    fileName: "Statuette of Wadjet in the name of Akanosh son of Pediamenopet MET 35.9.2 EGDP015556.jpg",
    caption:
      "Statuette of Wadjet in the name of Akanosh son of Pediamenopet, Third Intermediate to Kushite Period (Dynasties 21–25, c. 1070–664 BCE or later), Metropolitan Museum of Art 35.9.2. The cobra goddess of Lower Egypt in an Egyptian votive bronze.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "35.9.2",
    objectDate: "c. 1070–664 BCE or later",
  }),
  wadjetHorusChild: commonsPicture({
    fileName: "The goddess Wadjet with the Horus-child MET 1971.131 003.jpg",
    caption:
      "The goddess Wadjet with the Horus-child, Late to Ptolemaic Period (664–30 BCE), Metropolitan Museum of Art 1971.131. Wadjet as protective mother: a role with no counterpart in Dangbé, who is not a goddess and is not shown in human form.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "1971.131",
    objectDate: "664–30 BCE",
  }),
  labatCoronation: commonsPicture({
    fileName: "Labat CourOuidah 1725 B002.png",
    caption:
      "'Couronnement du Roy de Juda à la coste de Guinée au Mois d'Avril 1725', an etching in Labat's Voyage du chevalier Des Marchais (Paris, 1730), vol. 2. An eighteenth-century European engraving made in Paris from a traveller's report — not a picture taken at the ceremony. The plate's date of 1725 disagrees with Labat's text, which (as the Gbe lane reports) puts the coronation in 1715.",
    shows: "engraving",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "J.-B. Labat (?)",
    objectDate: "etching c. 1725–1730; published 1730",
  }),
  luxorOpetColonnade: commonsPicture({
    fileName: "Ramses II and The Colonnade of Amenophis III (14259621702).jpg",
    caption:
      "The colonnade of Amenhotep III at Luxor temple, photographed in 2012, whose walls were carved under Tutankhamun and Horemheb (fourteenth century BCE) with the Opet festival procession, the annual renewal of the king's ka. A modern photograph of the setting of an Egyptian royal ceremony.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 2.0",
    creator: "Jorge Láscar from Melbourne, Australia",
    objectDate: "photographed 14 September 2012",
  }),
  apedemakSerpent: commonsPicture({
    fileName: "NaqaLionTempleApedemakSnake.jpg",
    caption:
      "The Lion Temple at Naqa, Sudan (built under Natakamani and Amanitore, first century CE): Apedemak represented as a serpent with a lion's head, photographed in 2017. Kushite serpent iconography of a Meroitic god, not an Egyptian one.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Clemens Schmillen",
    objectDate: "first century CE (relief); photographed 2017",
  }),
  taharqaDoubleUraeus: commonsPicture({
    fileName: "Taharqa in double uraeus cap.jpg",
    caption:
      "The Kushite pharaoh Taharqa (Twenty-fifth Dynasty) in the close-fitting cap with a double uraeus, the two cobras that marked Kushite kingship. A modern photograph of an ancient royal sculpture; the exact object's museum is not stated on the file page.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "EditorfromMars",
  }),
  caseFeticheDan1930: commonsPicture({
    fileName: "Case du fétiche Dan - A63204S.jpg",
    caption:
      "'Case du fétiche Dan', a shrine of Dan at Porto-Novo, Dahomey, autochrome by Frédéric Gadmer, 15 January 1930 (Albert-Kahn collections). The earliest colour photographs of Gbe serpent shrines, taken under colonial rule.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: "Musée départemental Albert-Kahn",
    objectDate: "15 January 1930",
  }),
  chefFeticheurSerpent1930: commonsPicture({
    fileName: "Le chef féticheur du Serpent, prêtre au culte de Dangbé - A63271.jpg",
    caption:
      "'Le chef féticheur du Serpent, prêtre au culte de Dangbé', the chief priest of the serpent cult at Porto-Novo, autochrome by Frédéric Gadmer, 24 January 1930 (Albert-Kahn collections). A colonial-era photograph of a Dangbé priest — the African end of the Atlantic comparison.",
    shows: "portrait",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: "Musée départemental Albert-Kahn",
    objectDate: "24 January 1930",
  }),
  bagaHeaddress: commonsPicture({
    fileName:
      "Guinea Coast, Guinea, possibly Baga, late 19th-early 20th century - Serpent Headdress - 1960.37 - Cleveland Museum of Art.tif",
    caption:
      "Serpent headdress (a-Mantsho-ña-Tshol), Guinea coast, possibly Baga, late nineteenth to early twentieth century (Cleveland Museum of Art 1960.37). A serpent sculpture from a West African people far from the Gbe, used in initiation; nobody has proposed an Israelite or Egyptian origin for it.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    institution: "Cleveland Museum of Art",
    accessionNumber: "1960.37",
    objectDate: "late 19th–early 20th century",
  }),
  sethApep: commonsPicture({
    fileName: "Seth Slaying a Serpent, Temple of Amun at Hibis MET 48.105.6.jpg",
    caption:
      "Seth spearing the serpent Apep, a facsimile painted by Charles K. Wilkinson of a relief in the temple of Amun at Hibis (Kharga oasis), reign of Darius I, 521–486 BCE (Metropolitan Museum of Art 48.105.6). A modern copy of an ancient relief: in Egypt's best-known serpent myth the serpent is the enemy to be killed.",
    shows: "reconstruction",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Charles Wilkinson (1897–1986)",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "48.105.6",
    objectDate: "relief 521–486 BCE; facsimile twentieth century",
  }),
  labatPortrait: commonsPicture({
    fileName: "Jean-Baptiste Labat.jpg",
    caption:
      "Engraved portrait of Jean-Baptiste Labat (1663–1738), the Dominican who compiled Des Marchais's voyage, from his Nouveau voyage aux isles de l'Amérique (1742 edition), engraved by André Bouys and C. Mathey. An eighteenth-century engraving of the writer who compared Hueda customs with Jewish law.",
    shows: "portrait",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Labat, Jean Baptiste, 1663-1738 (author); André Bouys and C. Mathey (engravers)",
    institution: "John Carter Brown Library",
    objectDate: "1742",
  }),
  whydah1745: commonsPicture({
    fileName: "Whydah in 1745.jpg",
    caption:
      "'Whydah', a plate in Thomas Astley's New General Collection of Voyages and Travels (London, 1745–47), vol. 3. An eighteenth-century English engraving compiled from earlier travellers' accounts — the printed tradition through which European ideas about Hueda's serpent circulated.",
    shows: "engraving",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Thomas Astley (editor)",
    objectDate: "1745",
  }),
  mehenBoard: commonsPicture({
    fileName: "British Museum Mehen Board.jpg",
    caption:
      "A Mehen game board in the British Museum, photographed in 2025: the coiled serpent of early Egypt (Mehen) as a board game of the Early Dynastic and Old Kingdom periods. Egyptian serpent imagery with its own meaning and date, shown in the conclusion as one of the separate serpents the track keeps apart.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Waltros",
    institution: "British Museum",
    objectDate: "Early Dynastic–Old Kingdom (object); photographed 2025",
  }),
};

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

const EVIDENCE_LINE =
  "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH.";

const events: SeedEvent[] = [
  // =========================================================================
  // ROUTES
  // =========================================================================
  {
    slug: A.routes,
    title: "Five possible routes, and what each would have to show",
    summary:
      "Five routes by which a serpent tradition could, in principle, have reached the Bight of Benin or left it. Only one religious crossing is documented — the outward one, across the Atlantic; contact along the others is real in places, but no religious transmission along them has been shown.",
    description:
      "THE QUESTION THIS LANE ASKS. If the Dan and Dangbé traditions of the Gbe-speaking coast were connected to the tribe of Dan, to Egypt or to Kush, something must have travelled: people, words, objects or rites. This lane lays out the five routes the brief named and, for each, the earliest and latest relevant dates, the archaeological, textual and linguistic evidence, the known intermediaries, the gaps, and what contradicts it.\n\n" +
      "THE FIVE ROUTES. Route A: the Levant to Egypt, Nubia and Ethiopia — Israelite and Judahite contact with the Nile is documented (Elephantine, fifth century BCE), and a Danite identity for the Ethiopian Beta Israel is a later tradition to be assessed separately. Route B: Egypt to Kush, the Sahel and West Africa — Egyptian influence on Kush is established; any continuation westward is hypothesis. Route C: North Africa across the Sahara to the Niger Bend and on to Bénin — trade is richly documented; religious transmission along it is inferred, not shown. Route D: local development among Gbe speakers — Tado, Allada and Hueda, with Gbe historical linguistics. Route E: the Bight of Benin to Saint-Domingue and Bahia — the documented crossing, used as the model of what transmission looks like when it happened.\n\n" +
      "HOW THE ROUTES ARE DRAWN. No arrow on any map in this lane is an established route of religious transmission unless the record says so. A trade route is not a migration, a migration is not a religious transmission, and a resemblance at the two ends is not a route. Routes A, B and C are filed as hypotheses for this reason, with their proponents named; Route D is the mainstream reconstruction; Route E is history.\n\n" +
      "THE CONTROL. Route E is here so the other four can be measured against it. When Gbe religion did cross an ocean, it left a documented forced migration of people from named ports, eyewitness descriptions on both sides within a lifetime (Moreau de Saint-Méry's 'Vaudoux' with its snake, recorded in the 1780s), names that correspond regularly (Gbe vodun → Vaudoux, Dan → Danbala, Dangbé and Bessen in Bahia), and communities that named their own origin (Rada from Allada, Jeje in Brazil). None of the other routes has produced that kind of evidence for serpent religion.\n\n" +
      EVIDENCE_LINE + " It establishes that the Nile, the Sahara and the Atlantic were all crossed by people, goods and, on the Atlantic, by religion. It does not establish any route from Israel, Egypt or Kush to the Gbe serpent cults; the records below say exactly where the evidence stops.",
    category: "religion",
    subcategory: ROUTES,
    eventType: "other",
    eventTypeNote: "A guide to the routes lane: what each route claims and the standard of evidence it is measured against.",
    tags: serpentTags("routes", ["theme: migration traditions", "theme: trade routes", "place: sahara and niger bend", "place: savi and ouidah"], "routes", "method"),
    people: ["Moreau de Saint-Méry", "Leo Africanus"],
    civilisations: ["Israelites and Judahites", "Ancient Egypt", "Kush", "Hueda", "Fon", "Haitian Vodou", "Candomblé"],
    locationName: "From the Levant and the Nile to the Bight of Benin and the Americas",
    claims: [
      {
        sourceKey: "porten_yardeni_tad",
        citations: [
          { sourceKey: "moreau_saint_mery_1797_description", relation: "context", note: "The latest end of the documented routes: Vodou in Saint-Domingue in the 1780s." },
        ],
        startYear: bce(495),
        endYear: bce(399),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The earliest securely documented point on any of the five routes: Judahites at Elephantine",
        originalDateText: "Elephantine papyri, fifth century BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. The Elephantine archives date themselves by Persian regnal years. They establish a Judahite community on the Nile at the Nubian frontier; they do not establish any movement beyond it.",
      },
      {
        sourceKey: "moreau_saint_mery_1797_description",
        citations: [{ sourceKey: "slavevoyages_estimates", relation: "context", note: "The forced migration that carried Gbe religion to Saint-Domingue." }],
        startYear: 1797,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first substantial written record of a Gbe serpent cult outside Africa",
        originalDateText: "Moreau de Saint-Méry's Vaudoux, printed 1797",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. Printed in 1797 from observations of the 1780s (read in this session). It establishes the latest and only documented religious crossing on the five routes; it says nothing about the earlier routes.",
      },
    ],
    media: [P.delisleAfrique1722, P.catalanAtlasSahara, P.transSaharanRoutes],
  },
  {
    slug: "route-a-levant-egypt-nubia-ethiopia",
    title: "Route A: the Levant to Egypt, Nubia and Ethiopia — documented contact, a later Danite identity",
    summary:
      "Judahites lived at Elephantine on the Nubian frontier in the fifth century BCE, and Jewish communities existed in Ethiopia by the late Middle Ages. That contact is history. That the Ethiopian community descends from the tribe of Dan is a later identity tradition, first written by Eldad ha-Dani in the ninth century CE and applied to the Beta Israel in the sixteenth.",
    description:
      "THE ROUTE. From Israel and Judah down the Nile to Egypt, to the Nubian frontier at Aswan, and on to the Ethiopian highlands. It is the best-documented of the three ancient routes, and the one on which Danite traditions first appear.\n\n" +
      "EARLIEST AND LATEST DATES. Earliest secure: the Judahite garrison and temple of YHW at Elephantine, documented by Aramaic papyri of the fifth century BCE (the temple was destroyed in 410 BCE; the community's petition of 407 BCE says it already stood when Cambyses entered Egypt in 525 BCE). Latest relevant: the modern recognition of the Beta Israel as Jews of Danite descent (Rabbi Ovadia Yosef's ruling of 1973) and their emigration to Israel in the 1980s–1990s.\n\n" +
      "ARCHAEOLOGICAL EVIDENCE. Elephantine itself, excavated since the early twentieth century, with the papyri and ostraca (including a Passover ostracon). Nothing archaeological links Elephantine's Judahites to Ethiopia, and no excavated site attests a Jewish community in Ethiopia in antiquity.\n\n" +
      "TEXTUAL EVIDENCE. The Elephantine papyri (Porten and Yardeni, TAD); Eldad ha-Dani's ninth-century account, which puts Dan, Naphtali, Gad and Asher in 'Havilah' beyond the rivers of Cush (Adler 1930); the sixteenth-century responsum of Rabbi David ibn Abi Zimra (Radbaz) identifying the Ethiopian Jews as Danites; James Bruce's 1790 account, which records the Beta Israel's own Solomonic origin tradition rather than a Danite one.\n\n" +
      "LINGUISTIC EVIDENCE. The Elephantine community wrote Aramaic and named its god YHW. The Beta Israel used Ge'ez for their scriptures and spoke Agaw languages and later Amharic and Tigrinya; they had no Hebrew tradition before modern contact. Nothing linguistic connects either community to the tribe of Dan in particular.\n\n" +
      "KNOWN INTERMEDIARIES. Persian-period garrisons; Jewish merchants of the Red Sea and Nile; Eldad ha-Dani himself, a traveller whose account reached Kairouan; Radbaz in Egypt; later European missionaries and Jewish emissaries (Jacques Faitlovitch from 1904).\n\n" +
      "GAPS IN THE RECORD. Some fifteen centuries separate Elephantine (fifth century BCE) from the first secure Ethiopian evidence for the communities later called Beta Israel (fourteenth to fifteenth centuries CE). Eldad's 'Dan in Cush' cannot be located on the ground and is not confirmed by any independent source of his time.\n\n" +
      "WHAT CONTRADICTS IT. As a route of Danite descent: the mainstream historians (Kaplan 1992; Quirin 1992) reconstruct the Beta Israel as an Ethiopian development of the fourteenth to sixteenth centuries from Ethiopian Christian and older Agaw roots, with their Danite label applied from outside by Radbaz. The community's own tradition, as Bruce recorded it, is Solomonic. As a route for serpent religion: no serpent cult is attested at Elephantine, among the Beta Israel, or at Tel Dan.\n\n" +
      EVIDENCE_LINE + " It establishes Israelite and Judahite contact with the Nile and the Nubian frontier, and a Jewish community in Ethiopia by the late Middle Ages. It does not establish a Danite migration, does not reach West Africa, and carries no serpent tradition.",
    category: "religion",
    subcategory: ROUTES,
    eventType: "hypothesised",
    eventTypeNote: "Contact along the route is documented; a Danite migration along it is a later identity tradition and is filed as a hypothesis.",
    tags: serpentTags("routes", ["figure: dan (tribe)", "theme: migration traditions", "place: elephantine", "place: ethiopia", "theme: manuscripts and their dates"], "routes", "route a"),
    people: ["Eldad ha-Dani", "David ibn Abi Zimra (Radbaz)", "James Bruce", "Steven Kaplan", "James Quirin", "Ovadia Yosef"],
    civilisations: ["Judahites of Elephantine", "Beta Israel", "Kush", "Aksum and the Ethiopian kingdom"],
    locationName: "Elephantine (Aswan) to the Ethiopian highlands",
    lat: 24.086,
    lng: 32.887,
    argumentsFor:
      "Contact is documented: Judahites lived at Elephantine with their own temple in the fifth century BCE, on the frontier with Nubia; Jewish and Judaising communities existed in Ethiopia by the late Middle Ages; Eldad ha-Dani placed Dan in Cush in the ninth century; and Radbaz and later the Israeli Chief Rabbinate accepted the Beta Israel as Danites, which supporters read as preserving a real memory of migration up the Nile.",
    argumentsAgainst:
      "No source connects Elephantine to Ethiopia; some fifteen centuries separate them. Eldad's account is fabulous in places and unconfirmed. Radbaz's identification is a sixteenth-century legal judgement, not historical evidence. Kaplan and Quirin reconstruct the Beta Israel as a medieval Ethiopian development, and Bruce records their own origin tradition as Solomonic, not Danite. And the route ends in Ethiopia: it does not reach West Africa and carries no serpent cult.",
    genealogies: [
      {
        key: "route-a-danites-in-cush",
        claim: "The tribe of Dan went down the Nile to Cush and Ethiopia, and the Beta Israel are its descendants",
        verdict: "later_interpretation",
        verdictEvidence:
          "The claim's earliest text is Eldad ha-Dani (ninth century CE), some fifteen centuries after the tribe's last biblical appearance; its application to the Beta Israel is a sixteenth-century legal identification. Mainstream history reconstructs the Beta Israel as a medieval Ethiopian development.",
        whatWouldChangeThis:
          "Ancient evidence — an inscription, papyrus or excavated community — placing Israelites (and specifically Danites) in Nubia or Ethiopia before the Middle Ages, or genetic and textual evidence of a pre-medieval Israelite source for the Beta Israel.",
        links: [
          {
            stage: "ancient_primary",
            who: "The Judahite community of Elephantine (Aramaic papyri)",
            year: bce(407),
            sourceKey: "porten_yardeni_tad",
            reference: "TAD A4.7",
            saysAbsentReason: "Not read in this session; cited for the documented community, which never mentions Dan.",
            adds: "Documented Judahites on the Nubian frontier — the real basis for 'Israelites on the Nile'.",
            citationStatus: "unverified",
          },
          {
            stage: "later_antiquity",
            who: "Eldad ha-Dani",
            year: 880,
            sourceKey: "adler_1930_jewish_travellers",
            saysAbsentReason: "Eldad's account is read in Adler's translation by the Dan in Africa lane; summarised here.",
            adds: "Places the tribe of Dan, with three other tribes, beyond the rivers of Cush: the first Danites-in-Africa text.",
            citationStatus: "unverified",
          },
          {
            stage: "early_scholarship",
            who: "Rabbi David ibn Abi Zimra (Radbaz), responsum",
            year: 1550,
            sourceKey: "kaplan_1992_beta_israel",
            saysAbsentReason: "The responsum is cited through Kaplan's discussion; not read directly in this session.",
            adds: "Applies the Danite identity to the Ethiopian Jews for the purposes of Jewish law.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Steven Kaplan; James Quirin",
            year: 1992,
            sourceKey: "quirin_1992_evolution_of_ethiopian_jews",
            saysAbsentReason: "Not opened in this session; cited for their reconstruction, summarised.",
            adds: "Reconstructs Beta Israel origins as a medieval Ethiopian development and treats the Danite label as a later identification.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "porten_yardeni_tad",
        startYear: bce(407),
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Elephantine community's petition about its destroyed temple of YHW",
        originalDateText: "the petition of 407 BCE (TAD A4.7)",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Dated by the regnal year of Darius II. It establishes Judahites with a temple at the Nubian frontier; it says nothing of Dan, of Ethiopia, or of serpents.",
      },
      {
        sourceKey: "adler_1930_jewish_travellers",
        citations: [{ sourceKey: "kaplan_1992_beta_israel", relation: "context", note: "Places Eldad's claim within the history of the Danite label." }],
        startYear: 880,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first text placing the tribe of Dan in Cush",
        originalDateText: "Eldad ha-Dani's account, c. 880s CE",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later manuscript. Eldad's letters survive in later manuscripts and recensions; the date is that of his reported visit to Kairouan. It dates a tradition's first appearance, not any migration.",
      },
      undated({
        sourceKey: "kaplan_1992_beta_israel",
        citations: [{ sourceKey: "quirin_1992_evolution_of_ethiopian_jews", relation: "disputes", note: "Reconstructs the Beta Israel as a medieval Ethiopian formation, not ancient Danite migrants." }],
        text: "a Danite descent placed at no recoverable date",
        what: "When, on the tradition, Danites reached Ethiopia",
        chronology: "traditional",
        datingMethod: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: religious tradition. The tradition supplies no date and no route that can be checked, so none is entered.",
      }),
    ],
    media: [P.elephantineIsland, P.elephantinePapyrus, P.bruceBetaIsrael],
  },
  {
    slug: "route-b-egypt-kush-sahel-west-africa",
    title: "Route B: Egypt to Kush, the Sahel and West Africa — the diffusionist route",
    summary:
      "Egyptian religion and kingship reached Kush; that is established. That they went on across the Sahel to West Africa — and with them serpent religion — was argued by Seligman (1934), Lucas (1948), Meyerowitz (1960) and, in a broader frame, Diop; it has never been documented.",
    description:
      "THE ROUTE. Up the Nile from Egypt to Napata and Meroë, then west across Kordofan, Darfur, Lake Chad and the Hausa country to the Niger and the coast. It is the route of the twentieth-century diffusionists.\n\n" +
      "EARLIEST AND LATEST DATES. Earliest relevant: the New Kingdom's conquest of Nubia (sixteenth to fifteenth centuries BCE), which brought Egyptian temples and the Amun cult to Kush. Then the Kushite Twenty-fifth Dynasty in Egypt (c. 747–656 BCE) and the Meroitic kingdom (to the fourth century CE). Latest relevant: the published diffusion theories, 1934–1974.\n\n" +
      "ARCHAEOLOGICAL EVIDENCE. Abundant on the Nile: Jebel Barkal, Kawa, Meroë, Naqa, with Egyptian-derived royal regalia including the uraeus and the Kushite double uraeus. West of the Nile, nothing: no Meroitic inscription, temple or royal object has been found in West Africa. The one archaeological test of a Meroë-westward diffusion — the idea that iron-working spread from Meroë — has failed: West African iron at Termit, Taruga and other sites has radiocarbon dates as early as or earlier than large-scale Meroitic iron (Alpern 2005).\n\n" +
      "TEXTUAL EVIDENCE. Egyptian and Meroitic inscriptions document the Nile valley; no Egyptian or Meroitic text mentions the Niger or the Bight of Benin. The proponents' texts are modern: C. G. Seligman, Egypt and Negro Africa (1934), on divine kingship; J. Olumide Lucas, The Religion of the Yorubas (1948), from resemblances of words and rites; Eva Meyerowitz, The Divine Kingship in Ghana and Ancient Egypt (1960); Cheikh Anta Diop's case for African cultural unity with Egypt (1954–1974).\n\n" +
      "LINGUISTIC EVIDENCE. Egyptian is Afroasiatic; Meroitic is now generally classed as Nilo-Saharan (Northern East Sudanic); Gbe is Niger-Congo (Kwa). Lucas's word comparisons do not show regular sound correspondences, and no Egyptian or Meroitic loanword has been demonstrated in Gbe religious vocabulary (see the words lane).\n\n" +
      "KNOWN INTERMEDIARIES. None documented for religion. Proposed: Meroitic refugees after the fall of Meroë moving west (a twentieth-century suggestion, NEEDS SOURCE VERIFICATION for its earliest proponent); later Saharan and Sahelian states. The Hausa Bayajidda tradition brings a hero from the east to Daura who KILLS the serpent at the well — an oral tradition (NEEDS SOURCE VERIFICATION for its earliest written form) in which the serpent is an obstacle, not a god.\n\n" +
      "GAPS IN THE RECORD. Some two thousand kilometres and, for the Gbe serpent cults, more than a millennium separate Meroë's end (fourth century CE) from the first description of Dangbé (1690s).\n\n" +
      "WHAT CONTRADICTS IT. The iron chronology; the absence of any Meroitic or Egyptian object west of Darfur; the linguistic families; and the species: the Egyptian and Kushite royal serpent is a cobra, the Gbe sacred serpent a python. Current scholarship (summarised in the existing record on the Egyptian-origin theory) treats Yoruba and Gbe religions as historically West African.\n\n" +
      EVIDENCE_LINE + " It establishes Egyptian influence on Kush. It does not establish any Kushite or Egyptian influence on the Gbe, and the one testable prediction of westward diffusion — iron — has gone against it.",
    category: "religion",
    subcategory: ROUTES,
    eventType: "alternative",
    eventTypeNote: "Egypt-to-Kush is established; the continuation to West Africa is an attributed alternative theory recorded with its proponents and the evidence against it.",
    tags: serpentTags("routes", ["figure: wadjet and the uraeus", "figure: apedemak", "theme: kingship", "theme: migration traditions", "place: napata and meroe"], "routes", "route b", "diffusionism"),
    people: ["C. G. Seligman", "J. Olumide Lucas", "Eva Meyerowitz", "Cheikh Anta Diop", "Taharqa"],
    civilisations: ["Ancient Egypt", "Kush (Napata and Meroë)", "Hausa", "Yoruba", "Gbe-speaking peoples"],
    locationName: "From Meroë across the Sahel to the Bight of Benin",
    lat: 16.938,
    lng: 33.749,
    argumentsFor:
      "Egypt demonstrably shaped Kushite religion and kingship, so a chain of influence starting there is not absurd; divine kingship, royal serpents and animal cults occur in both Nile and West African kingdoms; Lucas proposed Egyptian–Yoruba word resemblances; Seligman and Meyerowitz argued kingship diffused from Egypt through the Sudan; and Diop's case that Egypt was African makes cultural connection across the continent seem natural to its supporters.",
    argumentsAgainst:
      "No Egyptian or Meroitic object or inscription has been found in West Africa; no text of either mentions the region; the languages belong to three different families and no regular correspondences link their religious vocabulary; the iron-from-Meroë hypothesis, the one testable prediction, is contradicted by West African radiocarbon dates; the royal serpent of the Nile is a cobra and the Gbe sacred serpent a python; and more than a millennium separates Meroë from the first record of Dangbé.",
    genealogies: [
      {
        key: "route-b-egypt-to-west-africa",
        claim: "Egyptian religion and kingship, serpent cults included, spread through Kush and the Sahel to West Africa",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "The Egypt-to-Kush stage is directly attested. Every later stage rests on twentieth-century comparison (Seligman, Lucas, Meyerowitz) and on a general thesis of African unity (Diop); no object, text or demonstrated loanword documents the westward stages.",
        whatWouldChangeThis:
          "A dated Meroitic or Egyptian object, inscription or workshop west of Darfur; regular sound correspondences between Egyptian or Meroitic and Gbe religious vocabulary; or a dated archaeological sequence of serpent cult running across the Sahel.",
        links: [
          {
            stage: "ancient_primary",
            who: "Kushite royal monuments (Jebel Barkal, Kawa, Meroë)",
            year: bce(690),
            sourceKey: "torok_1997_kingdom_of_kush",
            saysAbsentReason: "Monuments, not statements; summarised from Török.",
            adds: "Documents Egyptian religion and royal serpent regalia adopted in Kush.",
            citationStatus: "unverified",
          },
          {
            stage: "early_scholarship",
            who: "C. G. Seligman, Egypt and Negro Africa",
            year: 1934,
            sourceKey: "seligman_1934_egypt_and_negro_africa",
            saysAbsentReason: "Not opened in this session; its thesis summarised.",
            adds: "Derives African divine kingship from Egypt, in a 'Hamitic' frame.",
            citationStatus: "unverified",
          },
          {
            stage: "early_scholarship",
            who: "J. Olumide Lucas, The Religion of the Yorubas",
            year: 1948,
            sourceKey: "lucas_1948_religion_of_the_yorubas",
            saysAbsentReason: "Not opened in this session; its thesis is confirmed by bibliographic records.",
            adds: "Argues Yoruba religion from Egyptian, by resemblance of words and rites.",
            citationStatus: "unverified",
          },
          {
            stage: "early_scholarship",
            who: "Eva Meyerowitz, The Divine Kingship in Ghana and Ancient Egypt",
            year: 1960,
            sourceKey: "meyerowitz_1960_divine_kingship",
            saysAbsentReason: "Not opened in this session; its thesis summarised.",
            adds: "Applies the Egyptian-kingship derivation to the Akan of the Gold Coast.",
            citationStatus: "unverified",
          },
          {
            stage: "alternative_interpretation",
            who: "Cheikh Anta Diop, The African Origin of Civilization",
            year: 1974,
            sourceKey: "diop_1974_african_origin_of_civilization",
            saysAbsentReason: "Not opened in this session; its general thesis summarised.",
            adds: "A civilisational frame — Egypt as African, African cultures as a unity — that later popular claims of Egyptian Vodun draw on; it documents no route for a Gbe cult.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Stanley B. Alpern",
            year: 2005,
            sourceKey: "alpern_2005_iron_sub_saharan_africa",
            saysAbsentReason: "Not read in full in this session; cited for its review of the iron dates.",
            adds: "Shows the one testable westward-diffusion claim, iron from Meroë, is not supported by West African chronology.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "torok_1997_kingdom_of_kush",
        startYear: bce(747),
        endYear: bce(656),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Kushite Twenty-fifth Dynasty ruling Egypt: the peak of documented Egypt–Kush exchange",
        originalDateText: "Twenty-fifth (Kushite) Dynasty, c. 747–656 BCE",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: inscription. Royal inscriptions and king lists. They establish Egyptian–Kushite exchange, which is the documented part of Route B; they say nothing about West Africa.",
      },
      {
        sourceKey: "lucas_1948_religion_of_the_yorubas",
        citations: [{ sourceKey: "alpern_2005_iron_sub_saharan_africa", relation: "disputes", note: "The iron chronology contradicts the general westward-diffusion model." }],
        startYear: 1948,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of the classic Egyptian-derivation thesis for West African religion",
        originalDateText: "Lucas, The Religion of the Yorubas, 1948",
        datingMethod: "historical_record",
        chronology: "alternative",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Dates the theory's publication; it is evidence that the theory was proposed, not that it is true.",
      },
      undated({
        sourceKey: "seligman_1934_egypt_and_negro_africa",
        citations: [{ sourceKey: "torok_1997_kingdom_of_kush", relation: "context", note: "Documents the Egypt–Kush stage, which the diffusion theories extend without evidence." }],
        text: "a westward diffusion from Kush, at no stated date",
        what: "When, on the theory, Egyptian or Kushite religion reached West Africa",
        chronology: "alternative",
        evidence:
          "EVIDENCE TYPE: modern interpretation. No proponent supplies a date or a dated site for the westward stages, so none is entered.",
      }),
    ],
    media: [P.orteliusAfrica1570, P.meroePyramids, P.taharqaSphinx],
  },
  {
    slug: "route-c-north-africa-sahara-niger-bend-benin",
    title: "Route C: North Africa across the Sahara to the Niger Bend and Bénin — trade documented, religion inferred",
    summary:
      "Gold, salt, slaves, books and merchants — among them Jewish merchants in the Saharan oases — crossed the Sahara for a thousand years. That trade is documented. That it carried Israelite or Danite religion to the Gbe coast is an inference that the documents do not make, and one early eyewitness says Jews were barred from Timbuktu.",
    description:
      "THE ROUTE. From the Maghrib through the Saharan oases (Sijilmasa, Tuat and Gourara) to the Niger Bend (Timbuktu, Gao), then south through the savanna to the Bight of Benin. It is the route of the Black Hebrew Israelite histories and of Williams's 'Nile to Niger'.\n\n" +
      "EARLIEST AND LATEST DATES. Earliest relevant: the Garamantian trade of the first millennium BCE and first centuries CE (existing records), and the Arabic geographers' descriptions of Ghana from the eighth to eleventh centuries (al-Bakri, 1068). The Catalan Atlas of 1375, by a Jewish cartographer of Majorca, shows Mansa Musa of Mali. Latest: the expulsion of the Tuat Jews in the 1490s, and Leo Africanus's description of the Niger Bend in the early sixteenth century.\n\n" +
      "ARCHAEOLOGICAL EVIDENCE. The trade is archaeologically real: Saharan towns, Islamic-period sites in the Niger Bend, imported goods. No archaeological evidence of a Jewish community has been published from the Niger Bend, and none from the Gbe coast.\n\n" +
      "TEXTUAL EVIDENCE. The Genoese merchant Antonio Malfante wrote from Tuat in 1447 (single late copy in the BnF); Leo Africanus, read in this session in Pory's 1600 English (Hakluyt edition, vol. 3), says that in Tegorarin (Gourara) 'there were in times past many rich Iewes', expelled and many slain 'by the meanes of a certaine Mahumetan preacher' in the year of the Spanish expulsion — the episode associated with al-Maghili — and that the ruler of Timbuktu 'so deadly hateth all Iewes, that he will not admit any into his citie' and confiscates the goods of merchants who deal with them. The Tārīkh al-fattāsh contains passages cited for Jews in the Niger Bend, but Nobili and Mathee (2015) show that the text as printed mixes a seventeenth-century chronicle with nineteenth-century reworking; such passages cannot be assumed to be early. Modern proponents: Joseph J. Williams, Hebrewisms of West Africa: From Nile to Niger with the Jews (1930), chiefly on the Ashanti; Rudolph Windsor, From Babylon to Timbuktu (1969).\n\n" +
      "LINGUISTIC EVIDENCE. Trans-Saharan contact left Arabic loanwords in Sahelian languages and, through Hausa and Yoruba, some in the south. No Hebrew loanword has been demonstrated in Gbe, and none in Gbe serpent vocabulary.\n\n" +
      "KNOWN INTERMEDIARIES. Berber and Arab caravan merchants; Jewish merchants and craftsmen of the oases (documented in Tuat until the 1490s); Muslim scholars; later Hausa and Oyo traders who linked the savanna to the coast. The only documented Jewish communities on the West African coast before the nineteenth century were Portuguese Sephardim at Porto de Ale and Joal in Senegal in the early seventeenth century (Mark and Horta 2011), some 2,500 km from Ouidah.\n\n" +
      "GAPS IN THE RECORD. No document places a Jewish or Israelite community south of the Niger Bend, or anywhere among the Gbe. Between the Niger and the coast, the route is drawn by inference.\n\n" +
      "WHAT CONTRADICTS IT. Leo Africanus's statement that Jews were excluded from Timbuktu; the expulsion from Tuat in the 1490s; the Islamic, not Israelite, character of the religion the trade did carry south; and the absence of any Hebrew vocabulary, script or rite among the Gbe.\n\n" +
      EVIDENCE_LINE + " It establishes that the Sahara was crossed by trade for a millennium, and that Jews took part in that trade in the northern oases. It does not establish that any Jew, Israelite or Danite reached the Gbe coast, or that any religion travelled along the route except Islam.",
    category: "religion",
    subcategory: ROUTES,
    eventType: "hypothesised",
    eventTypeNote: "Trade along the route is documented; religious transmission to the Gbe coast is inferred by proponents and is filed as a hypothesis.",
    tags: serpentTags("routes", ["theme: trade routes", "theme: migration traditions", "place: sahara and niger bend", "theme: manuscripts and their dates"], "routes", "route c", "black hebrew israelite"),
    people: ["Leo Africanus", "Antonio Malfante", "Muhammad al-Maghili", "Abraham Cresques", "Joseph J. Williams", "Rudolph R. Windsor", "Mauro Nobili"],
    civilisations: ["Jews of Tuat", "Mali", "Songhay", "Hausa", "Oyo", "Gbe-speaking peoples"],
    locationName: "From Tuat across the Sahara to Timbuktu and the Bight of Benin",
    lat: 16.773,
    lng: -3.008,
    argumentsFor:
      "The Sahara was crossed by regular trade for a thousand years; Jewish merchants lived in the oases of Tuat and were part of that trade; a Jewish cartographer mapped Mali in 1375; the Tārīkh al-fattāsh has passages on Jews in the Niger Bend; Williams (1930) catalogued 'Hebrewisms' among the Akan; and Windsor (1969) argued that Israelites reached the empires of the western Sudan. Proponents argue that what reached the Niger could have reached the coast.",
    argumentsAgainst:
      "Trade is not migration and migration is not religious transmission. Leo Africanus says the ruler of Timbuktu excluded Jews; the Tuat community was expelled in the 1490s; the Tārīkh al-fattāsh passages may belong to a nineteenth-century layer (Nobili and Mathee); no Jewish community is documented south of the Niger Bend; the religion the trade carried south was Islam; and no Hebrew word, script or rite has been found among the Gbe.",
    genealogies: [
      {
        key: "route-c-israelites-to-west-africa",
        claim: "Israelites (or Danites) crossed the Sahara and settled among West African peoples, bringing their religion",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "Jewish participation in the northern Saharan trade is attested (Malfante, Leo Africanus). Settlement south of the Niger Bend, and any contribution to Gbe religion, rests on modern catalogues of resemblances (Williams) and popular histories (Windsor), not on documents.",
        whatWouldChangeThis:
          "A dated document, inscription or excavated community placing Jews south of the Niger Bend before the Atlantic era; or Hebrew loanwords demonstrated in Gbe religious vocabulary.",
        links: [
          {
            stage: "colonial_record",
            who: "Leo Africanus (tr. Pory 1600)",
            year: 1526,
            sourceKey: "leo_africanus_pory_1896",
            reference: "vol. 3, p. 825",
            says: "He so deadly hateth all Iewes, that he will not admit any into his citie",
            adds: "An early sixteenth-century eyewitness that Jews were excluded from Timbuktu — evidence against the route as a Jewish settlement corridor.",
            citationStatus: "verified",
          },
          {
            stage: "alternative_interpretation",
            who: "Joseph J. Williams, S.J., Hebrewisms of West Africa",
            year: 1930,
            sourceKey: "williams_1930_hebrewisms_of_west_africa",
            saysAbsentReason: "Not read in full; its thesis is confirmed by catalogue records and a 1930 notice.",
            adds: "Argues Jewish diffusion 'from Nile to Niger', mainly among the Ashanti, from resemblances of custom.",
            citationStatus: "unverified",
          },
          {
            stage: "popular_claim",
            who: "Rudolph R. Windsor, From Babylon to Timbuktu",
            year: 1969,
            sourceKey: "windsor_1969_from_babylon_to_timbuktu",
            saysAbsentReason: "Read only in summary in this session.",
            adds: "Turns the diffusion into an Israelite migration narrative for the Black Hebrew Israelite readership.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Mauro Nobili and Mohamed Shahid Mathee",
            year: 2015,
            sourceKey: "nobili_mathee_2015_tarikh_al_fattash",
            saysAbsentReason: "Not opened in this session; cited for its finding on the text's layers.",
            adds: "Shows that passages of the Tārīkh al-fattāsh may be nineteenth-century, undermining their use as early evidence.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    passages: [
      {
        label: "Leo Africanus on Timbuktu and the Jews",
        reference: "Leo Africanus, Description of Africa, Book 7 (Tombuto); Pory's translation, Hakluyt edition vol. 3, p. 825",
        sourceKey: "leo_africanus_pory_1896",
        layers: [
          {
            layer: "translation",
            sourceKey: "leo_africanus_pory_1896",
            language: "English (Early Modern)",
            content:
              "He so deadly hateth all Iewes, that he will not admit any into his citie: and whatsoever Barbarie merchants he vnderstandeth haue any dealings with the Iewes, he presently causeth their goods to be confiscate.",
            evidence:
              "Pory's 1600 English of an Italian text printed in 1550 and written in 1526, copied from the archive.org scan in this session. It is one ruler's policy as reported by a visitor; it is evidence that Timbuktu was not a Jewish settlement in the early sixteenth century.",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "leo_africanus_pory_1896",
        citations: [
          { sourceKey: "mark_horta_2011_forgotten_diaspora", relation: "context", note: "The only documented Jewish communities on the West African coast before the nineteenth century were in Senegal, not on the Gbe coast." },
        ],
        startYear: 1526,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Leo Africanus's description of the Niger Bend, with Timbuktu closed to Jews",
        originalDateText: "Leo's description, completed 1526",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Leo completed his text in 1526 (printed 1550). It establishes conditions in the Niger Bend in his time; it counts against, not for, a Jewish corridor to the south.",
      },
      {
        sourceKey: "leo_africanus_pory_1896",
        startYear: 1492,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "The expulsion of the rich Jews of Gourara and Tuat",
        originalDateText: "in the very same yeere when the Iewes were expelled out of Spaine",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Leo dates it to the year of the Spanish expulsion (1492); other sources associate it with al-Maghili in the 1490s, hence decade precision. It establishes a Jewish community in the northern Sahara and its end; it says nothing of the south.",
      },
      {
        sourceKey: "williams_1930_hebrewisms_of_west_africa",
        citations: [{ sourceKey: "windsor_1969_from_babylon_to_timbuktu", relation: "context", note: "The later popular form of the same idea." }],
        startYear: 1930,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of the 'Nile to Niger' Jewish-diffusion thesis",
        originalDateText: "Williams, Hebrewisms of West Africa, 1930",
        datingMethod: "historical_record",
        chronology: "alternative",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Dates the theory, not any migration.",
      },
    ],
    media: [P.catalanAtlasSahara, P.transSaharanRoutes, P.tamentit, P.delisleBarbarieNigritie],
  },
  {
    slug: "route-d-local-gbe-development",
    title: "Route D: local development among the Gbe — Tado, Allada and Hueda",
    summary:
      "The mainstream reconstruction: the Gbe serpent traditions developed among Gbe-speaking peoples themselves, carried by regional migrations remembered in the Tado and Allada traditions, and organised by the Hueda kingship at Savi before the Dahomean conquest of 1727.",
    description:
      "THE ROUTE. Not a long-distance route at all: movements within the Gbe-speaking region — from Tado (in present-day Togo), the remembered homeland of the Aja, to Allada, to the Hueda kingdom at Savi and its port at Ouidah — and the regional exchange of cults among Gbe, Yoruba and their neighbours.\n\n" +
      "EARLIEST AND LATEST DATES. Earliest: undatable — Proto-Gbe is a reconstruction and gets no year, and the Tado migration traditions are oral; Portuguese and Dutch sources document Allada from the sixteenth century. The serpent cult at Whydah is first described in the 1690s (Phillips 1694; Bosman, printed 1704). Latest relevant: the Dahomean conquest of Hueda in 1727 and Dahomey's subsequent protection of the serpent cult.\n\n" +
      "ARCHAEOLOGICAL EVIDENCE. The excavations at Savi (Kelly; Norman), including the ditch systems that Norman and Kelly (2004) read in terms of the serpent and rainbow — Dan and Aido-Hwedo — in the political landscape of Hueda. These tie Hueda serpent religion to a local landscape and a local kingship.\n\n" +
      "TEXTUAL EVIDENCE. European eyewitnesses from the 1690s on (Phillips, Bosman, Barbot, Labat's Des Marchais, Snelgrave, Atkins) and later local historians (Agbo 1959). The earliest describe an established cult with priests, a temple and royal patronage. Labat records a Hueda tradition that the serpent came over from the army of Allada during a battle — a local, not a distant, origin.\n\n" +
      "LINGUISTIC EVIDENCE. Gbe is a single family with regular internal sound correspondences (Capo 1991). Dan is a Gbe word for the snake and the serpent principle, with cognates across the family (see the words lane); it needs no outside source.\n\n" +
      "KNOWN INTERMEDIARIES. Gbe-speaking migrants and priests; the courts of Allada, Hueda and later Dahomey; Yoruba neighbours (with whose Oshumare the rainbow serpent is paired in Brazil).\n\n" +
      "GAPS IN THE RECORD. Nothing written survives from the coast before the sixteenth century; the cult's age before the 1690s rests on its established state when first seen and on oral tradition. Proto-Gbe has no date.\n\n" +
      "WHAT CONTRADICTS IT. Nothing documentary. Its weakness is not counterevidence but silence: it cannot show how old the serpent cult is, and it cannot by itself exclude an earlier outside contribution — it can only show that none is needed and none is attested.\n\n" +
      EVIDENCE_LINE + " It establishes a Gbe serpent religion embedded in Gbe language, landscape and kingship by the late seventeenth century. It does not establish when that religion began, and its earliest phases are reconstruction and oral tradition, which carry no dates.",
    category: "religion",
    subcategory: ROUTES,
    eventType: "mainstream",
    eventTypeNote: "The mainstream reconstruction in current scholarship: local development, documented from the sixteenth century, undated before it.",
    tags: serpentTags("routes", ["figure: dan (vodun)", "figure: dangbe", "theme: kingship", "theme: sacred landscape", "place: tado and allada", "place: savi and ouidah"], "routes", "route d"),
    people: ["Neil L. Norman", "Kenneth G. Kelly", "Hounkpati B. C. Capo", "Robin Law", "Casimir Agbo"],
    civilisations: ["Aja", "Allada", "Hueda", "Fon", "Dahomey", "Gbe-speaking peoples"],
    locationName: "Tado, Allada, Savi and Ouidah",
    lat: 6.363,
    lng: 2.085,
    claims: [
      {
        sourceKey: "law_1991_slave_coast",
        citations: [
          { sourceKey: "norman_kelly_2004_landscape_politics", relation: "supports", note: "The archaeology of Savi ties the serpent to Hueda's landscape and kingship." },
        ],
        startYear: 1690,
        endYear: 1704,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first European descriptions of the serpent cult at Whydah",
        originalDateText: "Phillips 1694 and Bosman 1704: first descriptions",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. These are the first written descriptions found, of a cult already established with priests and royal patronage. They date its first record, not its origin.",
      },
      {
        sourceKey: "law_1991_slave_coast",
        startYear: 1727,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Dahomean conquest of Hueda",
        originalDateText: "Dahomey conquers Savi, 1727",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. Documented by European eyewitnesses; it closes the independent Hueda phase of the cult.",
      },
      undated({
        sourceKey: "capo_1991_comparative_phonology_gbe",
        text: "Proto-Gbe, a reconstruction with no date",
        what: "When the Gbe word for serpent, Dan, came into being",
        chronology: "scientific",
        datingMethod: "other",
        evidence:
          "EVIDENCE TYPE: linguistic reconstruction. A reconstructed proto-language is not a dated inscription; no year is entered.",
      }),
      undated({
        sourceKey: "agbo_1959_histoire_de_ouidah",
        text: "the migrations from Tado, remembered without dates",
        what: "When the ancestors of the Aja and Hueda left Tado",
        chronology: "oral_tradition",
        datingMethod: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. Remembered migrations with no recoverable date; none is entered.",
      }),
    ],
    media: [P.whydahMap, P.slaveCoast1789, P.saviPalacePlan],
  },
  {
    slug: "route-e-bight-of-benin-to-haiti-and-brazil",
    title: "Route E: the Bight of Benin to Saint-Domingue and Bahia — the documented crossing",
    summary:
      "The one religious crossing on the five routes that is documented: some two million people carried from the Bight of Benin, Gbe serpent religion recorded in Saint-Domingue by the 1780s, and Dan and Dangbé still named in Haitian Vodou and Bahian Candomblé.",
    description:
      "THE ROUTE. From Ouidah, Allada (Ardra), Porto-Novo and neighbouring ports across the Atlantic to Saint-Domingue (Haiti), Bahia and Maranhão (Brazil), Cuba and Louisiana. It was not a migration but a forced one: the slave trade.\n\n" +
      "EARLIEST AND LATEST DATES. Earliest: European slaving at Allada and Whydah from the seventeenth century. First religious record overseas: Moreau de Saint-Méry's account of the 'Vaudoux' in Saint-Domingue, written in the 1780s and printed in 1797. Latest: the end of the Brazilian trade in the 1850s; the traditions continue today.\n\n" +
      "ARCHAEOLOGICAL EVIDENCE. Ouidah's forts and trading quarters; plantation and shrine sites in the Americas; ritual objects in museum collections on both sides (Haitian drapo for Dambala; Candomblé shrine objects).\n\n" +
      "TEXTUAL EVIDENCE. Ship records compiled in the Trans-Atlantic Slave Trade Database, whose estimates put embarkations from the Bight of Benin at about two million people, 1501–1866 (NEEDS SOURCE VERIFICATION for the exact live figure). Moreau de Saint-Méry, read in this session: 'according to the Arada negroes, who are the true sectaries of the Vaudoux in the colony', Vaudoux means 'an all-powerful and supernatural being', namely 'the non-venomous serpent', kept in a box on an altar where each initiate could see it through bars. Later ethnographies of Haiti and Bahia (Herskovits; Parés 2013).\n\n" +
      "LINGUISTIC EVIDENCE. Regular, demonstrable correspondences: Gbe vodun → Vaudoux, Vodou; Dan → Danbala (with Ayida Wedo from Aido-Hwedo); in Bahia the Jeje names Dan, Dangbé and Bessen; Arada → Rada, the Haitian rite. The name of the place of origin is carried in the name of the rite.\n\n" +
      "KNOWN INTERMEDIARIES. Named ports and ships; the Arada nation in Saint-Domingue; the Jeje nation in Bahia; priests and priestesses, including the 'King' and 'Queen' Moreau describes.\n\n" +
      "GAPS IN THE RECORD. The first decades of practice in the colonies are poorly documented, and the earliest witnesses are hostile outsiders writing at second hand.\n\n" +
      "WHAT CONTRADICTS IT. Nothing contradicts the crossing itself; what is debated is how much changed in it. Danbala is not Dangbé unchanged: he took on Catholic saints (Saint Patrick), Haitian theology and new rites, and in Bahia the Gbe serpent merged with the Yoruba rainbow Oxumarê.\n\n" +
      EVIDENCE_LINE + " It establishes that Gbe serpent religion was carried to the Americas by enslaved people from the Bight of Benin and survives there under recognisably Gbe names. It is the standard of evidence a transmission can leave behind — and it shows, by contrast, how little the other routes have left.",
    category: "religion",
    subcategory: ROUTES,
    eventType: "historical",
    tags: serpentTags("routes", ["figure: dan (vodun)", "figure: dangbe", "figure: damballa and ayida-wedo", "place: savi and ouidah", "place: haiti and brazil", "theme: migration traditions"], "routes", "route e", "atlantic"),
    people: ["Moreau de Saint-Méry", "Luis Nicolau Parés", "Melville J. Herskovits"],
    civilisations: ["Hueda", "Fon", "Arada of Saint-Domingue", "Haitian Vodou", "Jeje Candomblé"],
    locationName: "Ouidah to Saint-Domingue and Bahia",
    lat: 6.363,
    lng: 2.085,
    passages: [
      {
        label: "Moreau de Saint-Méry on the Vaudoux and its serpent",
        reference: "Description … de la partie française de l'isle Saint-Domingue (Philadelphia, 1797), vol. 1, pp. 45–47",
        sourceKey: "moreau_saint_mery_1797_description",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "moreau_saint_mery_1797_description",
            language: "French",
            script: "Latin",
            content:
              "Selon les nègres Aradas, qui sont les véritables sectateurs du Vaudoux dans la Colonie, & qui en maintiennent les principes & les règles, Vaudoux signifie un être tout-puissant & surnaturel, dont dépendent tous les événemens qui se passent sur ce globe. Or, cet être c'est le serpent non venimeux, ou une espèce de couleuvre …",
            evidence:
              "Copied from the archive.org scan of the 1797 edition in this session, with the long s modernised. A colonial lawyer's account of the 1780s, largely at second hand.",
          },
          {
            layer: "translation",
            sourceKey: null,
            language: "English",
            content:
              "According to the Arada negroes, who are the true sectaries of the Vaudoux in the colony and who maintain its principles and rules, Vaudoux means an all-powerful and supernatural being on whom depend all the events that take place on this globe. Now, this being is the non-venomous serpent, or a kind of grass-snake …",
            evidence:
              "A literal translation made for this record. It shows the cult named after the Gbe word vodun, attributed to the Arada (from Allada), and centred on a harmless snake, as Dangbé is.",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "moreau_saint_mery_1797_description",
        citations: [
          { sourceKey: "pares_2013_formation_of_candomble", relation: "supports", note: "Documents the parallel transmission of Gbe vodun, including the serpent, to Bahia." },
          { sourceKey: "slavevoyages_estimates", relation: "context", note: "The forced migration underlying the transmission." },
        ],
        startYear: 1780,
        endYear: 1789,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Moreau's observation of the Arada Vaudoux and its snake in Saint-Domingue",
        originalDateText: "the Vaudoux as observed in the 1780s",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. Moreau says he wrote the Description in the 1780s; printed 1797. It establishes Gbe serpent religion in the Caribbean within the lifetime of people carried from Ouidah.",
      },
      {
        sourceKey: "slavevoyages_estimates",
        startYear: 1501,
        endYear: 1866,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The span of the database's estimates of forced embarkations, including the Bight of Benin",
        originalDateText: "estimates 1501–1866",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. Compiled from ship records; the span is the database's own. It dates the forced migration, not any one religious transmission.",
      },
    ],
    media: [P.saintDomingue1776, P.dambalaFlag, P.oxumareDanDangbe],
  },

  // =========================================================================
  // THE COMPARISONS
  // =========================================================================
  {
    slug: "dan-and-dangbe-name-and-origins-compared",
    title: "Dan and Dangbé: what each name names, and where each tradition places its origin",
    summary:
      "Not the two words (the words lane tests those) but what they name: a tribe called after an ancestor whose name Genesis explains as 'God has judged', and a serpent vodun called after the animal. Each tradition's own origin story, a northward move to Laish for the tribe and a serpent from Allada or a neighbouring country for Dangbé, stays in its own region, and neither mentions the other. Assessment: unsupported hypothesis.",
    description:
      "WHAT IS COMPARED. Not the two words: the words lane (dan-and-dan-the-word-comparison) sets Hebrew Dān beside Gbe dan with scripts, roots and cognates and finds a chance resemblance, and that analysis is not repeated here. This page compares the two things the names name, and the origin each tradition gives them: the tribe of Dan and its city on one side; the serpent vodun Dan and Dangbé, the python of Hueda and Ouidah, on the other. If the names had a common origin, the stories of where the tribe and the cult came from ought somewhere to meet.\n\n" +
      "THE HEBREW SIDE. The name is an eponym. Dan is a son of Jacob by Bilhah, and Genesis 30:6 explains the name in the narrative, 'God has judged me' (dan-named-in-genesis-30). The tribe is placed first near the coast ('why did Dan remain in ships?', Judges 5:17) and then, in Judges 18, moves north, takes Laish and renames it Dan 'after the name of Dan their father' (danite-migration-to-laish-judges-18); the excavated city is Tel Dan, whose ninth-century BCE stele anchors the site's date. Its only serpent is a simile, Genesis 49:17 (dan-serpent-by-the-way-genesis-49). Its later 'origins' outside the Levant, Dan in the land of Cush, begin with Eldad ha-Dani in the ninth century CE (eldad-ha-dani-dan-in-the-land-of-cush).\n\n" +
      "THE GBE SIDE. Dan is an ordinary noun before it is a god's name: dan, 'snake', inherited from Proto-Gbe *-dã with cognates across the family (proto-gbe-snake-word-across-gbe; dan-sacred-name-and-everyday-word). Dangbé (Dagbé, Danhgbwe) corresponds to the word for python that Capo reconstructs as *-dãgbói; the meaning of its second element is not settled. The origins the Hueda themselves gave Dangbé are local: Barbot's serpent that left another country, Labat's serpent that crossed over from the army of Allada and won Hueda its freedom, and the 1717 story of pythons sheltering a king (how-the-serpent-came-to-hueda). Other Dan cults are traced by tradition to the Mahi country and moved within the Gbe region (dan-worship-origins-and-movement). None of these stories looks outside West Africa.\n\n" +
      "SIMILARITIES. Both are the syllable dan. Both, at some point, are connected with a serpent: the Gbe word by meaning, the Hebrew name by one biblical simile.\n\n" +
      "DIFFERENCES. What is named: the tribe takes its name from an ancestor and gives it to a city; the vodun takes its name from the animal. Where the origin lies: the Israelite story moves Dan north within the Levant; the Hueda stories bring the serpent from Allada or a nearby country. Date: the Hebrew name is attested in the first millennium BCE, the Gbe word from the late seventeenth century CE. The linguistic differences (meaning, family, structure) are set out in the words lane.\n\n" +
      "EVIDENCE FOR TRANSMISSION. None. No intermediate form has been found in any language between the Levant and the Bight of Benin; no Hueda origin story recorded by Europeans from the 1690s names Israel; and the idea that the two Dans are one appears first in European writing (dangbe-from-israel-or-egypt-history-of-the-idea).\n\n" +
      "ASSESSMENT. Unsupported hypothesis. The resemblance is a coincidence of one syllable, the meanings that the comparison needs do not match, and the origin traditions on each side never meet.\n\n" +
      EVIDENCE_LINE + " It establishes that the two words share a sound. It does not establish a common origin, a borrowing or a migration; a name resemblance cannot by itself establish any of those, and here the meanings also diverge.",
    category: "religion",
    subcategory: ASSESSMENT,
    eventType: "hypothesised",
    eventTypeNote: "A proposed connection between two names, weighed as a comparison; filed as a hypothesis with its proponents and the evidence against it.",
    tags: serpentTags("assessment", ["figure: dan (tribe)", "figure: dan (vodun)", "figure: dangbe", "theme: names and words", "place: tel dan", "place: savi and ouidah"], "comparison", "comparison: unsupported hypothesis"),
    people: ["Rachel (in the Genesis narrative)", "Hounkpati B. C. Capo", "Christian Merlo", "Pierre Vidaud"],
    civilisations: ["Israelites", "Gbe-speaking peoples", "Hueda"],
    locationName: "Tel Dan (Israel) and Ouidah (Bénin), compared",
    argumentsFor:
      "The syllable is identical; the Gbe word means serpent and Genesis 49:17 compares Dan to a serpent; popular writers (and, in a universalising frame, Merlo and Vidaud's 'universal myth of the Serpent') have set the two side by side; and Eldad ha-Dani's tradition put Danites in Africa, which proponents take as a possible carrier of the name.",
    argumentsAgainst:
      "The Hebrew name means 'judge', not 'serpent'; the Hebrew word for serpent is nāḥāš; the languages are unrelated and no regular correspondence links them; no intermediate form exists in any language between; the attestations are about two and a half thousand years apart; and a one-syllable resemblance is expected by chance between any two large vocabularies.",
    genealogies: [
      {
        key: "dan-equals-dan",
        claim: "The Gbe serpent Dan is named after (or shares an origin with) the tribe of Dan",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "No text before the twentieth century connects the two words. The idea appears in modern comparative and popular writing, resting on the shared syllable and on Genesis 49:17.",
        whatWouldChangeThis:
          "Regular sound correspondences between Hebrew and Gbe, or an attested intermediate form of the name in a language along a documented route, with dates that run in the right order.",
        links: [
          {
            stage: "ancient_primary",
            who: "Genesis 30:6 (the naming of Dan)",
            sourceKey: "kjv_bible",
            reference: "Genesis 30:6",
            says: "God hath judged me … therefore called she his name Dan.",
            adds: "Gives the Hebrew name its narrative meaning, 'judge'.",
            citationStatus: "verified",
          },
          {
            stage: "alternative_interpretation",
            who: "Christian Merlo and Pierre Vidaud",
            year: 1966,
            sourceKey: "merlo_vidaud_1966_black_serpent",
            saysAbsentReason: "Only the abstract was read in this session; whether they draw the name comparison themselves NEEDS SOURCE VERIFICATION.",
            adds: "Sets the Hueda python within a 'universal myth of the Serpent' running to Eden, the frame in which the name comparison circulates.",
            citationStatus: "unverified",
          },
          {
            stage: "popular_claim",
            who: "Online and devotional writing equating the tribe of Dan with Dan and Dangbé",
            saysAbsentReason: "No single citable work was found; the identification circulates without sources.",
            adds: "Turns the resemblance into a claimed descent.",
            citationStatus: "no_citation_given",
          },
          {
            stage: "current_scholarship",
            who: "Hounkpati B. C. Capo, A Comparative Phonology of Gbe",
            year: 1991,
            sourceKey: "capo_1991_comparative_phonology_gbe",
            saysAbsentReason: "Not opened in this session; cited for the frame in which Gbe words are compared.",
            adds: "Places Gbe words in their own family, where Dan's cognates are found.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    passages: [
      {
        label: "Genesis 30:6 — the naming of Dan",
        reference: "Genesis 30:6",
        sourceKey: "wlc_hebrew_bible",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            language: "Hebrew",
            script: "Hebrew",
            content: "וַתֹּאמֶר רָחֵל דָּנַנִּי אֱלֹהִים וְגַם שָׁמַע בְּקֹלִי וַיִּתֶּן־לִי בֵּן עַל־כֵּן קָרְאָה שְׁמוֹ דָּן׃",
            evidence: "Masoretic text with accents omitted, checked in this session. The verb dānannî and the name dān share the root d-y-n.",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            language: "English",
            content:
              "And Rachel said, God hath judged me, and hath also heard my voice, and hath given me a son: therefore called she his name Dan.",
            evidence: "KJV (1769 text). The narrative's own explanation of the name: 'judge', not 'serpent'.",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "wlc_hebrew_bible",
        citations: [{ sourceKey: "biran_1994_biblical_dan", relation: "context", note: "The excavated city named Dan, against which the narratives are read." }],
        startYear: bce(900),
        endYear: bce(500),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The composition of the Genesis texts that explain the name Dan",
        originalDateText: "Genesis composed in the first millennium BCE",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The date of composition of Genesis is a scholarly reconstruction with wide disagreement; this range is indicative. It dates the text, not the events it narrates.",
      },
      undated({
        sourceKey: "wlc_hebrew_bible",
        citations: [{ sourceKey: "kjv_bible", relation: "context", note: "English text of Genesis 30:6." }],
        text: "Rachel names Dan (patriarchal narrative)",
        what: "When, in the narrative, Dan was born to Bilhah and named by Rachel",
        chronology: "religious",
        datingMethod: "textual_interpretation",
        evidence:
          "EVIDENCE TYPE: biblical narrative. The patriarchal narrative gives no date that history can check; none is entered.",
      }),
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        citations: [{ sourceKey: "capo_1991_comparative_phonology_gbe", relation: "context", note: "The Gbe family in which dan has its cognates." }],
        startYear: 1694,
        endYear: 1730,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first written records of the Hueda serpent cult and its names",
        originalDateText: "Hueda serpent names first written, 1690s–1730",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. European accounts from Phillips (1694) to Labat (1730). They date when the Gbe names were first written down, not their age.",
      },
    ],
    media: [P.telDanIsraeliteGate, P.pythonRoyal, P.templePythons2019],
  },
  {
    slug: "tribe-of-dan-and-the-biblical-serpent-compared",
    title: "The tribe of Dan and the biblical serpent: a simile in Jacob's blessing, not a serpent cult",
    summary:
      "Genesis 49:17 says 'Dan shall be a serpent by the way'. Read against the excavations at Tel Dan and the rest of the Bible, it is a poetic image of a small tribe striking from ambush; no Danite serpent cult is attested in text or archaeology. Assessment: unsupported hypothesis (as a claim that Dan was a serpent tribe).",
    description:
      "WHAT IS COMPARED. The biblical tribe of Dan and the serpent imagery attached to it, to test the idea — common in popular writing about Dan and Dangbé — that Dan was a 'serpent tribe' with a serpent emblem or cult that could have travelled.\n\n" +
      "WHAT THE TEXTS SAY. Jacob's blessing (Genesis 49:16–17): 'Dan shall judge his people … Dan shall be a serpent (nāḥāš) by the way, an adder (šəfîfōn) in the path, that biteth the horse heels, so that his rider shall fall backward.' Moses's blessing (Deuteronomy 33:22) gives Dan a different animal: 'Dan is a lion's whelp: he shall leap from Bashan.' Judges 17–18 tells how the Danites took Laish, renamed it Dan, and set up a graven image with a Levite priesthood; 1 Kings 12:29 puts one of Jeroboam's golden calves at Dan. None of these texts describes a serpent at Dan. (The verse itself, its Hebrew and the debate over its date are in dan-serpent-by-the-way-genesis-49; this page asks whether the tribe as a whole, in text and excavation, was a 'serpent tribe'.) Later rabbinic traditions about tribal banners (NEEDS SOURCE VERIFICATION for any serpent on Dan's banner) are many centuries later still.\n\n" +
      "WHAT IS EXCAVATED. At Tel Dan (Biran 1994; Greer 2013): the Middle Bronze Age gate of Laish, Iron Age gates, and a sacred precinct with a high place, altars and feasting remains. The excavated cult is of altars, offerings and feasts (tel-dan-altars-and-priestly-portions). The one serpent motif reported is on large storage jars, the 'snake pithoi' of Stratum IVA (ninth century BCE, or a little later on Arie's chronology), each with a snake modelled in relief: a decorative motif with a long regional history, not a cult image (tel-dan-serpent-imagery-what-is-reported).\n\n" +
      "SIMILARITIES. The tribe is likened to a serpent in one poem; snake-decorated jars stood in Dan's sanctuary; and the Gbe word dan means serpent.\n\n" +
      "DIFFERENCES. Genesis 49:17 is a simile in a series of animal similes (Judah a lion, Issachar an ass, Naphtali a hind, Benjamin a wolf); the serpent is a hazard on the road, not a god. Deuteronomy uses a lion for Dan instead. The cult the Bible attributes to Dan is a graven image and a golden calf, not a serpent. The serpent that the Bible does show venerated, Nehushtan, is in Jerusalem, not Dan.\n\n" +
      "EVIDENCE FOR TRANSMISSION. None for a Danite serpent cult, and therefore nothing that could have been transmitted.\n\n" +
      "ASSESSMENT. Unsupported hypothesis, as a claim that the tribe of Dan was a serpent-worshipping tribe. The serpent simile is real; a serpent cult at Dan is not attested.\n\n" +
      EVIDENCE_LINE + " It establishes that one biblical poem likens Dan to a serpent. It does not establish a Danite serpent emblem or cult, and biblical narrative is in any case not archaeological confirmation of the tribe's history.",
    category: "religion",
    subcategory: ASSESSMENT,
    eventType: "hypothesised",
    eventTypeNote: "Weighs the popular idea that Dan was a serpent tribe; filed as a hypothesis with the case for and against.",
    tags: serpentTags("assessment", ["figure: dan (tribe)", "place: tel dan", "theme: names and words"], "comparison", "comparison: unsupported hypothesis", "genesis 49"),
    people: ["Jacob (in the Genesis narrative)", "Avraham Biran", "Jonathan S. Greer"],
    civilisations: ["Israelites (the tribe of Dan)"],
    locationName: "Tel Dan, northern Israel",
    lat: 33.248,
    lng: 35.652,
    argumentsFor:
      "Genesis 49:17 explicitly calls Dan a serpent and an adder; popular writers take this as a tribal emblem; Dan was a cult centre in the northern kingdom with its own priesthood, which proponents suggest could have included serpent veneration like that given to Nehushtan in Jerusalem.",
    argumentsAgainst:
      "The verse is one of a series of animal similes; Deuteronomy 33:22 gives Dan a lion instead; the biblical cult at Dan is a graven image and a golden calf, never a serpent; the excavated sacred precinct at Tel Dan is one of altars and feasts; and the venerated bronze serpent of the Bible stood in Jerusalem, not Dan.",
    genealogies: [
      {
        key: "dan-serpent-tribe",
        claim: "The tribe of Dan was a serpent tribe, with a serpent emblem or cult",
        verdict: "later_interpretation",
        verdictEvidence:
          "The only ancient basis is the simile of Genesis 49:17. The emblem and cult are later readings of it; no text or excavation attests a Danite serpent cult.",
        whatWouldChangeThis:
          "Securely dated serpent cult objects from the sacred precinct at Tel Dan, or an ancient text describing serpent veneration by Danites.",
        links: [
          {
            stage: "ancient_primary",
            who: "Genesis 49:17 (Jacob's blessing)",
            sourceKey: "kjv_bible",
            reference: "Genesis 49:17",
            says: "Dan shall be a serpent by the way, an adder in the path",
            adds: "The simile on which the 'serpent tribe' idea rests.",
            citationStatus: "verified",
          },
          {
            stage: "popular_claim",
            who: "Popular writing on Dan as a 'serpent tribe'",
            saysAbsentReason: "No single citable work; the claim circulates widely without sources.",
            adds: "Turns the simile into an emblem and a cult, and the cult into a candidate for Dangbé.",
            citationStatus: "no_citation_given",
          },
          {
            stage: "current_scholarship",
            who: "Jonathan S. Greer, Dinner at Dan",
            year: 2013,
            sourceKey: "greer_2013_dinner_at_dan",
            saysAbsentReason: "Not opened in this session; cited for its account of the excavated cult at Tel Dan.",
            adds: "Describes the Danite cult that is actually excavated: altars, offerings and feasts.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    passages: [
      {
        label: "Genesis 49:16–17 — Dan in Jacob's blessing",
        reference: "Genesis 49:16–17",
        sourceKey: "wlc_hebrew_bible",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            language: "Hebrew",
            script: "Hebrew",
            content:
              "דָּן יָדִין עַמּוֹ כְּאַחַד שִׁבְטֵי יִשְׂרָאֵל׃ יְהִי־דָן נָחָשׁ עֲלֵי־דֶרֶךְ שְׁפִיפֹן עֲלֵי־אֹרַח הַנֹּשֵׁךְ עִקְּבֵי־סוּס וַיִּפֹּל רֹכְבוֹ אָחוֹר׃",
            evidence: "Masoretic text, accents omitted, checked in this session. nāḥāš is the ordinary word for serpent; the pun is on yādîn 'he will judge'.",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            language: "English",
            content:
              "Dan shall judge his people, as one of the tribes of Israel. Dan shall be a serpent by the way, an adder in the path, that biteth the horse heels, so that his rider shall fall backward.",
            evidence: "KJV (1769 text). A simile of ambush, in a poem of animal similes for the tribes.",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "wlc_hebrew_bible",
        citations: [{ sourceKey: "greer_2013_dinner_at_dan", relation: "context", note: "The excavated cult at Dan, against which the poem is read." }],
        startYear: bce(1000),
        endYear: bce(600),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The composition of the Blessing of Jacob (Genesis 49)",
        originalDateText: "Blessing of Jacob, composed in the early first millennium BCE",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Scholars date the poem variously, some early in the Iron Age, others later; the range is indicative and disputed. It dates the poem, not the tribe's history.",
      },
      {
        sourceKey: "biran_1994_biblical_dan",
        citations: [{ sourceKey: "greer_2013_dinner_at_dan", relation: "supports", note: "The Iron II sacred precinct and its feasting remains." }],
        startYear: bce(900),
        endYear: bce(733),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The Iron Age II sacred precinct at Tel Dan in use",
        originalDateText: "Tel Dan Area T, Iron Age II",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. Stratified remains dated by ceramics and context; the end date is the Assyrian conquest of the north (733/732 BCE). It establishes a cult centre at Dan; it does not establish a serpent cult there.",
      },
    ],
    media: [P.telDanCanaaniteGate, P.telDanIsraeliteGate],
  },
  {
    slug: "nehushtan-and-dangbe-compared",
    title: "Nehushtan and Dangbé: any link between a bronze serpent destroyed in Jerusalem and the living pythons of Ouidah?",
    summary:
      "Both received offerings as serpents. Nehushtan was a bronze object, a healing image in the Moses story, burned incense to in Jerusalem until Hezekiah broke it in pieces around 700 BCE; Dangbé is a vodun present in living pythons, first described at Whydah in the 1690s. Assessment: significant difference.",
    description:
      "WHAT IS COMPARED. Nehushtan, the bronze serpent of Numbers 21 and 2 Kings 18, and Dangbé, the python vodun of Hueda and Ouidah. The existing serpent-kundalini record compares Nehushtan with the Kundalini reading; this page asks only whether Nehushtan and Dangbé are historically connected.\n\n" +
      "THE BIBLICAL SIDE, IN BRIEF. The texts (Numbers 21:8–9; 2 Kings 18:4) and their dates are set out in the dan lane (nehushtan-bronze-serpent-numbers-and-kings), which also finds no link between Nehushtan and the tribe of Dan (nehushtan-and-the-tribe-of-dan); how the image against the bite compares with Egyptian snakebite magic and Fon healing is in the rituals lane (healing-serpents-nehushtan-egypt-sakpata-dan). What matters for this question: Nehushtan was a single bronze cult object in Jerusalem that received incense until Hezekiah of Judah broke it in pieces (reign c. 715–686 BCE). The Numbers story of its making is narrative; the Kings notice is a report in a text compiled in the seventh–sixth centuries BCE.\n\n" +
      "THE GBE SIDE. Dangbé is honoured in living royal pythons (Python regius), kept and allowed to roam at Ouidah, with a temple, priests and wives (vodunsi). European eyewitnesses describe the cult from the 1690s; it protected the Hueda kingdom and was concerned with fertility, rain and wellbeing.\n\n" +
      "SIMILARITIES. Both are serpents receiving offerings (incense in Jerusalem; offerings at Ouidah). Both are associated with protection from harm.\n\n" +
      "DIFFERENCES. An object against living animals. A venomous snake's image (the śārāf, 'fiery serpent', of Numbers) against a harmless constrictor. A healing image against a vodun of the kingdom, fertility and continuity. A cult ended in Judah by royal reform around 700 BCE against a cult first recorded about two thousand four hundred years later on another continent. Nehushtan is in Jerusalem, not at Dan.\n\n" +
      "EVIDENCE FOR TRANSMISSION. None. Nehushtan was destroyed; no text, object or community connects it with the Bight of Benin.\n\n" +
      "ASSESSMENT. Significant difference. The likeness — offerings to a serpent — is the kind found wherever serpents are revered.\n\n" +
      EVIDENCE_LINE + " It establishes that serpents received offerings in Iron Age Jerusalem and in early modern Hueda. It does not establish any link between them, and the biblical narrative of Moses's serpent is not archaeological evidence for the object's origin.",
    category: "religion",
    subcategory: ASSESSMENT,
    eventType: "other",
    eventTypeNote: "A comparison of two serpent cults, assessed with one of the track's five comparison labels.",
    tags: serpentTags("assessment", ["figure: nehushtan", "figure: dangbe", "theme: healing and protection", "theme: living sacred animals", "place: savi and ouidah"], "comparison", "comparison: significant difference"),
    people: ["Hezekiah", "Moses (in the Numbers narrative)"],
    civilisations: ["Kingdom of Judah", "Hueda", "Fon"],
    locationName: "Jerusalem and Ouidah, compared",
    passages: [
      {
        label: "2 Kings 18:4 — Hezekiah breaks Nehushtan",
        reference: "2 Kings 18:4",
        sourceKey: "wlc_hebrew_bible",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            language: "Hebrew",
            script: "Hebrew",
            content:
              "הוּא הֵסִיר אֶת־הַבָּמוֹת וְשִׁבַּר אֶת־הַמַּצֵּבֹת וְכָרַת אֶת־הָאֲשֵׁרָה וְכִתַּת נְחַשׁ הַנְּחֹשֶׁת אֲשֶׁר־עָשָׂה מֹשֶׁה כִּי עַד־הַיָּמִים הָהֵמָּה הָיוּ בְנֵי־יִשְׂרָאֵל מְקַטְּרִים לוֹ וַיִּקְרָא־לוֹ נְחֻשְׁתָּן׃",
            evidence: "Masoretic text, accents omitted, checked in this session. nəḥaš hannəḥōšet, 'the serpent of bronze', and the name Nəḥuštān play on nāḥāš 'serpent' and nəḥōšet 'bronze'.",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            language: "English",
            content:
              "He removed the high places, and brake the images, and cut down the groves, and brake in pieces the brasen serpent that Moses had made: for unto those days the children of Israel did burn incense to it: and he called it Nehushtan.",
            evidence: "KJV (1769 text). A report of a cult object and its destruction in a text compiled after the event.",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "wlc_hebrew_bible",
        citations: [{ sourceKey: "kjv_bible", relation: "context", note: "English text of 2 Kings 18:4." }],
        startYear: bce(715),
        endYear: bce(686),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Hezekiah's reign, in which Kings places the destruction of Nehushtan",
        originalDateText: "Hezekiah breaks Nehushtan, reign c. 715–686 BCE",
        datingMethod: "regnal_chronology",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: biblical narrative. The date comes from the regnal chronology of Kings, itself reconstructed; no excavated object has been identified as Nehushtan. Filed under the religious chronology, not the conventional one.",
      },
      {
        sourceKey: "law_1991_slave_coast",
        citations: [{ sourceKey: "blier_1995_african_vodun", relation: "context", note: "Dangbé and Dan in Gbe vodun thought." }],
        startYear: 1694,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first European description of Dangbé's living pythons at Whydah",
        originalDateText: "pythons venerated at Whydah, first described 1690s",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. First record, not origin. It establishes the Gbe cult some two and a half thousand years after Nehushtan's destruction.",
      },
    ],
    media: [P.brazenSerpentPlaque, P.templeSerpents1900],
  },
  {
    slug: "wadjet-and-dangbe-compared",
    title: "Wadjet and Dangbé: is the python vodun of Hueda the Egyptian cobra goddess?",
    summary:
      "The identification some popular 'Vodun comes from Kemet' writing makes, tested: Wadjet is a cobra goddess, protector of Lower Egypt and of the king as the uraeus on his brow, attested for over three thousand years in Egypt; Dangbé is a python vodun honoured in living snakes at Ouidah. Both protect a kingdom; they are different animals, different kinds of divine being, and no link is attested. Assessment: significant difference.",
    description:
      "WHAT IS COMPARED. Wadjet, the Egyptian cobra goddess, and Dangbé, the python vodun of Hueda. Modern popular claims that 'Vodun comes from Kemet' sometimes identify Dan or Dangbé with Wadjet; the existing record on the Egyptian-origin theory traces those claims.\n\n" +
      "THE EGYPTIAN SIDE. Wadjet was the cobra goddess of Buto (Per-Wadjet) in the Delta and of Lower Egypt; paired with the vulture Nekhbet as the 'Two Ladies' of the royal titulary from the First Dynasty; and present as the rearing cobra, the uraeus, on the king's brow, spitting fire at his enemies. She is shown as a cobra, a woman, or a lion-headed woman, and in votive bronzes such as the Met's statuette dedicated by Akanosh (Third Intermediate–Kushite Period) and Wadjet with the Horus-child (Late–Ptolemaic).\n\n" +
      "THE GBE SIDE. Dangbé is honoured in living royal pythons at Ouidah; a protector of Hueda and its kings, with a temple, a priesthood and devotees. Dangbé is not shown in human form, and is not the uraeus of a king; Hueda kings honoured Dangbé in processions after their coronation.\n\n" +
      "SIMILARITIES. A serpent associated with a kingdom and its ruler; a protective role; a cult with priests and processions.\n\n" +
      "DIFFERENCES. Species and behaviour: the Egyptian cobra (Naja haje) is venomous and rears with its hood spread, which is the whole point of the uraeus; the royal python is a non-venomous constrictor that coils. Kind of being: Wadjet is a goddess with a cult city and anthropomorphic images; Dangbé is a vodun present in the snakes themselves. Function in kingship: Wadjet is worn by the king; Dangbé is visited by him (how each guards a ruler, with the Kushite double uraeus between them, is compared in the rituals lane, serpents-that-protect-kings-wadjet-kush-dangbe). Date and place: Wadjet from about 3000 BCE to the Roman period in Egypt; Dangbé recorded from the 1690s on the Gbe coast.\n\n" +
      "EVIDENCE FOR TRANSMISSION. None. No uraeus, cobra image or Egyptian object has been found on the Gbe coast, and no Egyptian name of Wadjet or the cobra has a Gbe counterpart.\n\n" +
      "ASSESSMENT. Significant difference. Royal protective serpents occur in many kingdoms; these two are different animals in different theologies.\n\n" +
      EVIDENCE_LINE + " It establishes two serpent cults bound up with kingship. It does not establish that they are the same deity, related deities, or historically connected; the Egyptian cobra is not the West African python.",
    category: "religion",
    subcategory: ASSESSMENT,
    eventType: "other",
    eventTypeNote: "A comparison of two serpent deities, assessed with one of the track's five comparison labels.",
    tags: serpentTags("assessment", ["figure: wadjet and the uraeus", "figure: dangbe", "theme: kingship", "theme: living sacred animals", "place: savi and ouidah"], "comparison", "comparison: significant difference"),
    people: ["Akanosh son of Pediamenopet"],
    civilisations: ["Ancient Egypt", "Hueda", "Fon"],
    locationName: "Buto (Lower Egypt) and Ouidah, compared",
    claims: [
      {
        sourceKey: "wilkinson_2003_complete_gods",
        citations: [{ sourceKey: "met_wadjet_akanosh_35_9_2", relation: "supports", note: "A dated votive statuette of Wadjet." }],
        startYear: bce(3000),
        endYear: bce(2900),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The 'Two Ladies' (Wadjet and Nekhbet) in the royal titulary from the First Dynasty",
        originalDateText: "Wadjet in the nebty name, First Dynasty",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Early Dynastic royal names on objects; dating by the conventional Egyptian chronology. It establishes Wadjet's antiquity in Egypt; it says nothing about West Africa.",
      },
      {
        sourceKey: "met_wadjet_akanosh_35_9_2",
        startYear: bce(1070),
        endYear: bce(664),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Met's Wadjet statuette for Akanosh",
        originalDateText: "Dynasties 21–25 or later",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: archaeological. The museum's dating of the object, by style and inscription. It dates one Egyptian image of the goddess.",
      },
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        citations: [{ sourceKey: "law_1991_slave_coast", relation: "context", note: "Hueda's kingship and its cults." }],
        startYear: 1694,
        endYear: 1730,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Dangbé as protector of the Hueda kingdom in European accounts",
        originalDateText: "Dangbé and the Hueda kings, accounts of 1694–1730",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. First records of the cult's royal role; not its origin.",
      },
    ],
    media: [P.wadjetAkanosh, P.wadjetHorusChild, P.templeEntrance2017],
  },
  {
    slug: "egyptian-royal-ceremonies-and-hueda-coronations-compared",
    title: "Egyptian royal ceremonies and Hueda coronations: could the Opet procession be the Hueda rite's ancestor?",
    summary:
      "A question of descent, not of sequence: could Egypt's royal festivals, above all Opet, where the gods were carried in procession to renew the king's royal ka, be the ancestor of the Hueda coronation and its processions to the serpent's house? The shared pattern, procession and cult making kingship sacred, is found in sacral kingships across the world, and nothing links the two. Assessment: widespread religious practice.",
    description:
      "WHAT IS COMPARED. Egyptian royal ceremonies — coronation, and above all the Opet festival at Thebes — and the Hueda coronation as described from Des Marchais's papers by Labat (1730). The vodun-diaspora record on the 1725 coronation and the Gbe lane's record on its date (1715 or 1725) give the Hueda detail; the rituals lane has the royal-ceremony images side by side; this page weighs the comparison.\n\n" +
      "THE EGYPTIAN SIDE. At the Opet festival the barques of Amun, Mut and Khonsu were carried from Karnak to Luxor; there, Lanny Bell (1985) argued, the king's royal ka — the divine power of kingship — was renewed. The procession is carved on the walls of the Luxor colonnade under Tutankhamun and Horemheb (fourteenth century BCE). At coronation the king received the crowns, with the uraeus, from the gods.\n\n" +
      "THE HUEDA SIDE, IN BRIEF. The full order of the rite is in the Gbe lane (hueda-coronation-rite-allada-crowner) and is set step by step beside Israel and Kush in the rituals lane (coronation-legitimacy-processions-oaths-compared); it is not repeated here. What matters for this question: the king is crowned in his own palace court by a grandee of Allada, not by a god or a priest; the serpent's priest orders the sacrifices; and the processions go from the palace to the serpent's house, which stays where it is. Labat's text dates the coronation Des Marchais attended to April 1715, the plate to April 1725 (hueda-coronation-1715-or-1725). The plate is an engraving made in Paris, not a picture taken at the ceremony.\n\n" +
      "SIMILARITIES. A coronation followed by processions to a cult centre; the cult's sanction for the king; public spectacle with priests, music and the court; a serpent present in royal religion (the uraeus in Egypt; Dangbé in Hueda).\n\n" +
      "DIFFERENCES. In Egypt the gods came to the king in their barques, and the serpent was on the king's own crown; in Hueda the king went to the serpent. The Egyptian king's legitimacy came from his own gods; the Hueda king's crown was placed by the envoy of a foreign overlord. Egypt's ceremonies were recorded by the state itself in temple reliefs over two millennia; Hueda's are known from a few European visitors. The deities differ (Amun and his family; Dangbé). About three thousand years and some four thousand kilometres separate them.\n\n" +
      "EVIDENCE FOR TRANSMISSION. None. Royal processions to cult centres are found in many sacral kingships (Mesopotamian akītu, Yoruba and Akan festivals, European coronations) without any connection to Egypt.\n\n" +
      "ASSESSMENT. Widespread religious practice. The resemblance is real at the level of structure and is what sacral kingship tends to produce.\n\n" +
      EVIDENCE_LINE + " It establishes that both kingdoms used processions to a cult to sanctify the king. It does not establish a historical link, and an eighteenth-century engraving is not a photograph of the Hueda ceremony.",
    category: "religion",
    subcategory: ASSESSMENT,
    eventType: "other",
    eventTypeNote: "A comparison of royal ceremonies, assessed with one of the track's five comparison labels.",
    tags: serpentTags("assessment", ["figure: dangbe", "figure: wadjet and the uraeus", "theme: kingship", "theme: procession and coronation", "place: thebes and luxor", "place: savi and ouidah"], "comparison", "comparison: widespread religious practice"),
    people: ["Renaud Des Marchais", "Jean-Baptiste Labat", "Tutankhamun", "Horemheb", "Lanny Bell"],
    civilisations: ["Ancient Egypt", "Hueda"],
    locationName: "Luxor and Savi, compared",
    claims: [
      {
        sourceKey: "bell_1985_luxor_royal_ka",
        startYear: bce(1336),
        endYear: bce(1292),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The carving of the Opet procession on the Luxor colonnade, under Tutankhamun and Horemheb",
        originalDateText: "Opet reliefs of the Luxor colonnade, late Eighteenth Dynasty",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Dated by the kings named in the reliefs, on the conventional chronology. It establishes the Egyptian ceremony; it says nothing about Hueda.",
      },
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        citations: [{ sourceKey: "law_1991_slave_coast", relation: "context", note: "Hueda kingship and the reliability of the European sources." }],
        startYear: 1725,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Hueda coronation as dated on Labat's plate",
        originalDateText: "Couronnement du Roy de Juda … au Mois d'Avril 1725",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The plate's caption. It conflicts with Labat's text, which the Gbe lane reads as dating the coronation to 1715.",
      },
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        startYear: 1715,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Hueda coronation as dated in Labat's text",
        originalDateText: "the coronation dated 1715 in Labat's text",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Reported by the Gbe lane from its reading of Labat's text; a separate claim from the plate's 1725 because the two disagree.",
      },
    ],
    media: [P.labatCoronation, P.luxorOpetColonnade, P.saviPalacePlan],
  },
  {
    slug: "kushite-serpent-iconography-and-west-african-cosmology-compared",
    title: "Kushite serpent iconography and West African serpent cosmology",
    summary:
      "Kush wore the Egyptian uraeus doubled, and at Naqa carved its own god Apedemak as a lion-headed serpent. The Fon tell of Aido-Hwedo, the serpent who carried the creator and coils beneath the earth, and Dan, the serpent of continuity. Both are serpent imagery of kings and cosmos; they share no named figure, no form and no documented contact. Assessment: significant difference.",
    description:
      "WHAT IS COMPARED. The serpent imagery of Kush (Napatan and Meroitic Sudan) and the serpent cosmology of the Fon and other Gbe peoples. The Kush lane documents the Kushite side; the Gbe lane and the existing Aido-Hwedo record document the Fon side.\n\n" +
      "THE KUSHITE SIDE. Kushite kings of the Twenty-fifth Dynasty and after wore the double uraeus — two rearing cobras — an Egyptian royal symbol doubled, perhaps for the two lands they ruled. At the Lion Temple of Naqa, built under Natakamani and Amanitore in the first century CE, the Meroitic war and lion god Apedemak is shown as a serpent with a lion's head rising from a lotus. These are iconographic images on royal monuments, in an Egyptian-derived visual language adapted to Meroitic religion.\n\n" +
      "THE WEST AFRICAN SIDE. In Fon thought as recorded by Herskovits (1938) and later scholars (Blier 1995), Aido-Hwedo is the rainbow serpent who carried the creator Mawu as the world was made and lies coiled beneath the earth, holding it up; Dan is the serpent principle of movement, wealth and continuity, imaged in the serpent biting its tail. Iconography: serpents in palace bas-reliefs of Abomey, shrine paintings and iron sculpture.\n\n" +
      "SIMILARITIES. Serpents associated with kingship and with cosmic order; composite and coiled imagery.\n\n" +
      "DIFFERENCES. Species and form: Kush's royal serpent is the cobra of the uraeus, and its distinctive composite is lion-plus-serpent; the Fon serpent is a python and a rainbow. Function: in Kush the serpent is a royal emblem and the body of a war god; in Fon thought it is a cosmic support and a principle of continuity. No figure, name or myth is shared. Date: Naqa's relief is first century CE; the Fon cosmology is recorded in the nineteenth and twentieth centuries.\n\n" +
      "EVIDENCE FOR TRANSMISSION. None. No Meroitic object or inscription has been found west of the Nile Valley's hinterland, and the one testable westward diffusion from Meroë, iron, is contradicted by West African dates (Route B).\n\n" +
      "ASSESSMENT. Significant difference. Kingly and cosmic serpents are widespread; these two traditions put them to different uses in different forms.\n\n" +
      EVIDENCE_LINE + " It establishes serpent imagery in both royal traditions. It does not establish Kushite influence on West Africa, and it does not make Apedemak, the uraeus, Aido-Hwedo and Dan one deity.",
    category: "religion",
    subcategory: ASSESSMENT,
    eventType: "other",
    eventTypeNote: "A comparison of two iconographic and cosmological traditions, assessed with one of the track's five comparison labels.",
    tags: serpentTags("assessment", ["figure: apedemak", "figure: wadjet and the uraeus", "figure: aido-hwedo", "figure: dan (vodun)", "theme: kingship", "place: naqa", "place: napata and meroe"], "comparison", "comparison: significant difference"),
    people: ["Natakamani", "Amanitore", "Taharqa", "Melville J. Herskovits", "Suzanne Preston Blier"],
    civilisations: ["Kush (Napata and Meroë)", "Fon", "Dahomey"],
    locationName: "Naqa (Sudan) and Abomey (Bénin), compared",
    claims: [
      {
        sourceKey: "torok_1997_kingdom_of_kush",
        startYear: 1,
        endYear: 50,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Lion Temple at Naqa, with Apedemak as a lion-headed serpent, built under Natakamani and Amanitore",
        originalDateText: "Naqa Lion Temple, first century CE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Dated by the royal names on the temple; Meroitic regnal dates are approximate. It establishes the Kushite image.",
      },
      {
        sourceKey: "herskovits_1938_dahomey",
        citations: [{ sourceKey: "blier_1995_african_vodun", relation: "supports", note: "Later study of Dan and serpent imagery in Fon art and thought." }],
        startYear: 1938,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first systematic ethnographic record of Fon serpent cosmology",
        originalDateText: "Herskovits, Dahomey, 1938",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: later historical account. A twentieth-century ethnography of a living tradition; it dates the record, not the cosmology's age.",
      },
      undated({
        sourceKey: "blier_1995_african_vodun",
        text: "Aido-Hwedo carrying the creator, in mythic time",
        what: "When, in the Fon account, the serpent carried Mawu",
        chronology: "religious",
        datingMethod: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: religious tradition. A creation narrative with no historical date; none is entered.",
      }),
    ],
    media: [P.apedemakSerpent, P.taharqaDoubleUraeus, P.caseFeticheDan1930],
  },
  {
    slug: "danite-migration-traditions-and-african-jewish-history-compared",
    title: "Danite migration traditions and documented African Jewish history: two kinds of evidence side by side",
    summary:
      "African Jewish history is real and documented: Elephantine, the Beta Israel, the Jews of the Saharan oases, the Sephardim of Senegal. Danite migration traditions are later identity claims laid over parts of that history. Neither reaches the Gbe coast. Assessment: unsupported hypothesis (as a route to Bénin).",
    description:
      "WHAT IS COMPARED. Two different kinds of thing that are often run together: the traditions that the tribe of Dan migrated into Africa, and the documented history of Jewish communities in Africa. The Dan in Africa lane sets out each community and text, and its overview (danites-in-africa-what-can-be-shown) lists what is and is not documented; this page asks a narrower question: how the dates and kinds of evidence on the two sides compare, and whether any Danite tradition ever attaches to a community the documents place west of the Nile.\n\n" +
      "THE DOCUMENTED HISTORY. Judahites at Elephantine with a temple of YHW (fifth century BCE; Aramaic papyri). Jewish communities of Egypt and North Africa throughout antiquity and the Middle Ages. The Beta Israel of Ethiopia, attested by the late Middle Ages and reconstructed by Kaplan and Quirin as an Ethiopian formation of the fourteenth to sixteenth centuries. Jewish merchants of Tuat and Gourara in the Sahara, attested by Malfante (1447) and Leo Africanus, expelled in the 1490s. Portuguese Sephardim living openly as Jews at Porto de Ale and Joal in Senegal in the early seventeenth century (Mark and Horta 2011).\n\n" +
      "THE DANITE TRADITIONS. Eldad ha-Dani (ninth century CE) puts Dan with three other tribes in Havilah beyond the rivers of Cush. Radbaz (sixteenth century) identifies the Ethiopian Jews as Danites; the Israeli Chief Rabbinate accepted their Jewishness on that basis in the 1970s. Modern writers extend Israelite identity further west (Williams 1930 among the Ashanti; Windsor 1969 to the western Sudan), and popular claims connect Dan with the Gbe Dan and Dangbé.\n\n" +
      "SIMILARITIES. Both concern Jews in Africa; the traditions attach themselves to real communities (Eldad to the Jews of North Africa who read him; Radbaz to the Beta Israel).\n\n" +
      "DIFFERENCES. The documented history is contemporary evidence, dated, located and connected to communities that wrote or were written about. The Danite traditions are later: Eldad writes some fifteen centuries after the tribe's last biblical appearance; Radbaz applies the label in the sixteenth century; the Beta Israel's own early tradition, as Bruce recorded it, is Solomonic. And the documented history stops well short of the Gbe coast: the nearest attested Jewish community, in Senegal, lived some 2,500 km away and traded arms, not religion; Leo Africanus says Timbuktu admitted no Jews.\n\n" +
      "EVIDENCE FOR TRANSMISSION. For Jewish presence in Egypt, Nubia's frontier, Ethiopia, the Sahara and Senegal: yes, documented. For a Danite migration: none beyond later tradition. For any Jewish or Danite presence among the Gbe: none.\n\n" +
      "ASSESSMENT. Unsupported hypothesis, as a route by which Danites reached Bénin. The existence of African Jewish communities is established; it is not evidence that Danites reached the Bight of Benin.\n\n" +
      EVIDENCE_LINE + " It establishes a long, documented history of Jewish communities in parts of Africa. It does not establish that any of them were Danites, and it does not place any of them among the Gbe.",
    category: "religion",
    subcategory: ASSESSMENT,
    eventType: "hypothesised",
    eventTypeNote: "Weighs Danite migration traditions against documented history; the Danite route to Bénin is filed as a hypothesis.",
    tags: serpentTags("assessment", ["figure: dan (tribe)", "theme: migration traditions", "theme: manuscripts and their dates", "place: elephantine", "place: ethiopia", "place: sahara and niger bend"], "comparison", "comparison: unsupported hypothesis"),
    people: ["Eldad ha-Dani", "David ibn Abi Zimra (Radbaz)", "Steven Kaplan", "James Quirin", "Peter Mark", "José da Silva Horta", "Leo Africanus", "Joseph J. Williams", "Rudolph R. Windsor"],
    civilisations: ["Judahites of Elephantine", "Beta Israel", "Jews of Tuat", "Sephardim of the Petite Côte"],
    locationName: "Elephantine, Ethiopia, the Sahara and Senegal, compared with the Bight of Benin",
    argumentsFor:
      "Jewish communities did live in Africa from the fifth century BCE onward, and some moved along the Nile, into Ethiopia and across the Sahara; Eldad ha-Dani and Radbaz located Danites in Cush and Ethiopia; and modern writers (Williams, Windsor) argue the diffusion continued into West Africa, which proponents see as the bridge to the Gbe Dan.",
    argumentsAgainst:
      "The Danite traditions are much later than the events they describe; the Beta Israel's own tradition was Solomonic; Jewish presence is documented only as far as the northern Sahara and, separately, the Senegal coast in the 1600s; Leo Africanus says Timbuktu excluded Jews; and no Jewish or Israelite community, word, script or rite is documented among the Gbe.",
    genealogies: [
      {
        key: "danites-to-benin",
        claim: "Danite migrants, moving through Africa, reached the Bight of Benin and gave rise to the Dan and Dangbé cults",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "Each stage of documented African Jewish history stops short of the Gbe coast, and the Danite traditions are later identity claims; the final step to Bénin rests on the resemblance of the name Dan alone.",
        whatWouldChangeThis:
          "A document, inscription or excavated community placing Jews or Israelites among the Gbe before the Atlantic era, or demonstrated Hebrew vocabulary or rites in Hueda or Fon religion.",
        links: [
          {
            stage: "later_antiquity",
            who: "Eldad ha-Dani",
            year: 880,
            sourceKey: "adler_1930_jewish_travellers",
            saysAbsentReason: "Summarised from the Dan in Africa lane's reading of Adler's translation.",
            adds: "First places Danites in Africa ('beyond the rivers of Cush').",
            citationStatus: "unverified",
          },
          {
            stage: "colonial_record",
            who: "Leo Africanus",
            year: 1526,
            sourceKey: "leo_africanus_pory_1896",
            reference: "vol. 3, p. 825",
            says: "he will not admit any into his citie",
            adds: "Evidence against a Jewish presence on the Niger Bend in the early sixteenth century.",
            citationStatus: "verified",
          },
          {
            stage: "alternative_interpretation",
            who: "Joseph J. Williams, S.J.",
            year: 1930,
            sourceKey: "williams_1930_hebrewisms_of_west_africa",
            saysAbsentReason: "Not read in full in this session.",
            adds: "Extends Jewish diffusion to West Africa from resemblances of custom.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Peter Mark and José da Silva Horta",
            year: 2011,
            sourceKey: "mark_horta_2011_forgotten_diaspora",
            saysAbsentReason: "Not opened in this session; scope confirmed from the publisher.",
            adds: "Documents the only early Jewish communities on the West African coast — in Senegal, in the seventeenth century.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "porten_yardeni_tad",
        startYear: bce(495),
        endYear: bce(399),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Judahite community of Elephantine, documented",
        originalDateText: "Judahites at Elephantine, fifth century BCE",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Dated papyri. Documented African Jewish history at its earliest; no mention of Dan.",
      },
      {
        sourceKey: "mark_horta_2011_forgotten_diaspora",
        startYear: 1600,
        endYear: 1630,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Sephardic communities at Porto de Ale and Joal, Senegal",
        originalDateText: "Jews on the Petite Côte, early seventeenth century",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Inquisition and Amsterdam records studied by Mark and Horta; the span is indicative (NEEDS SOURCE VERIFICATION for exact years). The nearest documented Jewish community to the Gbe coast, and far from it.",
      },
      {
        sourceKey: "adler_1930_jewish_travellers",
        startYear: 880,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first Danites-in-Africa tradition",
        originalDateText: "Eldad's Dan beyond the rivers of Cush, c. 880s",
        datingMethod: "historical_record",
        chronology: "traditional",
        evidence:
          "EVIDENCE TYPE: later manuscript. The date of Eldad's account, surviving in later manuscripts; it dates the tradition, not a migration.",
      },
    ],
    media: [P.elephantinePapyrus, P.bruceBetaIsrael, P.tamentit],
  },
  {
    slug: "african-serpent-traditions-atlantic-transmission-compared",
    title: "African serpent traditions and their Atlantic transmission: what a documented religious crossing leaves behind",
    summary:
      "Dangbé and Dan of the Gbe coast crossed the Atlantic with enslaved people and became Danbala in Haiti and Dan, Dangbé and Bessen in Bahia. Every kind of evidence the Dan-to-Bénin hypotheses lack is present here: dated eyewitnesses on both sides, regular name correspondences, named communities of origin. Assessment: documented historical transmission.",
    description:
      "WHAT IS COMPARED. The serpent traditions of the Gbe coast and their forms in the Americas — and, through them, the standard of evidence a real transmission meets. The existing record 'Serpent symbolism across the Atlantic' describes Dan, Damballa, Oxumaré, Aido-Hwedo and the Louisiana snake; this page goes further by using the crossing as a test against which the other comparisons in the track are measured.\n\n" +
      "THE AFRICAN SIDE. Dangbé, the python vodun of Hueda, honoured in living pythons at Ouidah from at least the 1690s; Dan, the serpent of movement and continuity; Aido-Hwedo, the rainbow serpent.\n\n" +
      "THE AMERICAN SIDE. In Saint-Domingue in the 1780s Moreau de Saint-Méry recorded that among the Arada — people from Allada — the Vaudoux meant an all-powerful being, 'the non-venomous serpent', kept in a box on an altar. In Haiti today Danbala Wedo, the serpent lwa, with his wife Ayida Wedo the rainbow, belongs to the Rada rite. In Bahia's Jeje Candomblé the serpent vodun is called Dan, Dangbé or Bessen, and paired with the Yoruba rainbow Oxumarê (Parés 2013). Louisiana's 'Li Grand Zombi' is a snake spirit of the same family.\n\n" +
      "SIMILARITIES. The same animal — a harmless snake, on both sides. The same names, changed by regular processes: vodun → Vaudoux/Vodou; Dan → Danbala; Aido-Hwedo → Ayida Wedo; Dan, Dangbé, Bessen kept in Bahia (the word-level case is set out in the words lane, danbala-the-gbe-snake-word-that-crossed-the-atlantic). The same pairing of serpent and rainbow. A named place of origin carried in the rite: Arada → Rada; Jeje for the Gbe peoples.\n\n" +
      "DIFFERENCES. Danbala is identified with Saint Patrick and takes on Haitian theology; in Bahia the Gbe serpent and the Yoruba rainbow merge. Practice changed under slavery and Catholicism.\n\n" +
      "EVIDENCE FOR TRANSMISSION. Documented at every level: a forced migration of about two million people from the Bight of Benin (Trans-Atlantic Slave Trade Database estimates; NEEDS SOURCE VERIFICATION for the exact figure), ship by ship and port by port; an eyewitness in the colony within living memory of embarkation, naming the source people; names with regular correspondences; communities naming their own origin; continuity into the present.\n\n" +
      "THE TEST FOR THE OTHER COMPARISONS. Set Dan-of-Israel to Dan-of-the-Gbe, or Wadjet to Dangbé, against this checklist — a documented movement of people, dated witnesses near both ends, regular name correspondences with matching meanings, an origin named by the receiving community, continuity of the animal and the rite — and none of the boxes is filled.\n\n" +
      "ASSESSMENT. Documented historical transmission.\n\n" +
      EVIDENCE_LINE + " It establishes that Gbe serpent religion was carried to Haiti and Brazil and survives there. It does not establish anything about where the Gbe serpent religion itself came from; it shows only what a demonstrated transmission looks like.",
    category: "religion",
    subcategory: ASSESSMENT,
    eventType: "historical",
    tags: serpentTags("assessment", ["figure: dangbe", "figure: dan (vodun)", "figure: aido-hwedo", "figure: damballa and ayida-wedo", "place: haiti and brazil", "place: savi and ouidah", "theme: migration traditions"], "comparison", "comparison: documented historical transmission", "atlantic"),
    people: ["Moreau de Saint-Méry", "Luis Nicolau Parés"],
    civilisations: ["Hueda", "Fon", "Arada of Saint-Domingue", "Haitian Vodou", "Jeje Candomblé"],
    locationName: "Ouidah, Saint-Domingue and Bahia",
    lat: 6.363,
    lng: 2.085,
    claims: [
      {
        sourceKey: "moreau_saint_mery_1797_description",
        citations: [{ sourceKey: "slavevoyages_estimates", relation: "context", note: "The forced migration from the Bight of Benin." }],
        startYear: 1797,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first printed description of the Arada serpent cult in the Americas",
        originalDateText: "Vaudoux and its serpent, printed 1797",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. Read in this session (vol. 1, pp. 45–47). Establishes the transmission's American end in the colonial period.",
      },
      {
        sourceKey: "pares_2013_formation_of_candomble",
        citations: [{ sourceKey: "herskovits_1938_dahomey", relation: "context", note: "The Fon side of the comparison, recorded ethnographically." }],
        startYear: 1750,
        endYear: 1850,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The formation of Jeje vodun cults in Bahia",
        originalDateText: "Jeje Candomblé forming, eighteenth–nineteenth centuries",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Parés's reconstruction from Bahian records; the range is indicative (NEEDS SOURCE VERIFICATION for his exact dates).",
      },
    ],
    media: [P.chefFeticheurSerpent1930, P.dambalaFlag, P.oxumareDanDangbe],
  },

  // =========================================================================
  // TWO CONTROL RECORDS
  // =========================================================================
  {
    slug: "python-veneration-elsewhere-in-africa-control",
    title: "Python veneration elsewhere in Africa: the control case for every serpent comparison",
    summary:
      "Pythons and serpents are revered by many African peoples with no claimed link to Israel, Egypt or Kush — the Baga of Guinea, the Edo of Benin City, the Avhianwu, and others. A resemblance between Dangbé and any distant serpent cult must be weighed against this background. Assessment: widespread religious practice.",
    description:
      "WHY THIS RECORD EXISTS. A similarity is evidence of connection only if it is unusual. Before Dangbé's resemblance to Nehushtan, Wadjet or Apedemak can count for anything, one has to ask how often serpent veneration arises in Africa without any such connection. This record is that control; the existing record 'Resemblance is not descent' states the principle, and 'Three serpents, three meanings, three dates' applies it elsewhere.\n\n" +
      "THE CASES. The Baga and their neighbours on the Guinea coast carved great serpent headdresses (a-Mantsho-ña-Tshol) used in initiation (Cleveland Museum of Art 1960.37, late nineteenth to early twentieth century). In the Edo kingdom of Benin (Nigeria), brass pythons ran down the turrets of the Oba's palace (existing records on the palace pythons and the Avhianwu sacred-python tradition, with their own comparison of whether those two are connected). Elsewhere in Africa python and serpent cults are reported from many peoples; their documentation varies and is not reviewed here.\n\n" +
      "THE CONTROL IN EGYPT. Egypt's own serpents are many and different: Wadjet the protective cobra, Mehen the coiled guardian, Apep the enemy of the sun whom Seth spears — a serpent to be killed, not revered. 'The serpent' is not one symbol even inside one civilisation.\n\n" +
      "SIMILARITIES. Living or sculpted serpents revered by communities, linked to kingship, initiation, fertility or water.\n\n" +
      "DIFFERENCES. Species, rites and meanings differ from people to people; each tradition is embedded in its own language and history.\n\n" +
      "EVIDENCE FOR TRANSMISSION. None is claimed among these cases, and none is needed: pythons live across tropical Africa, and peoples who live among them have repeatedly given them religious meaning.\n\n" +
      "ASSESSMENT. Widespread religious practice. Serpent veneration alone cannot carry an argument for historical connection; only a distinctive, specific match, with a route, could.\n\n" +
      EVIDENCE_LINE + " It establishes that serpent veneration recurs independently across Africa. It does not establish that Dangbé had no outside influence; it establishes that resemblance in serpent veneration is not, by itself, evidence of any.",
    category: "religion",
    subcategory: ASSESSMENT,
    eventType: "other",
    eventTypeNote: "A control record for the comparisons, assessed with one of the track's five comparison labels.",
    tags: serpentTags("assessment", ["figure: dangbe", "figure: apep", "theme: living sacred animals", "theme: kingship"], "comparison", "comparison: widespread religious practice", "control"),
    people: ["Frederick Lamp"],
    civilisations: ["Baga", "Edo (Benin kingdom)", "Hueda", "Ancient Egypt"],
    locationName: "Coastal Guinea, Benin City and Ouidah, compared",
    claims: [
      {
        sourceKey: "cleveland_baga_headdress_1960_37",
        startYear: 1875,
        endYear: 1925,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Cleveland serpent headdress from the Guinea coast",
        originalDateText: "Baga serpent headdress, late 19th–early 20th century",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: archaeological. The museum's dating of a collected object, by style and collection history. It dates one serpent sculpture of a non-Gbe people.",
      },
      {
        sourceKey: "law_1991_slave_coast",
        citations: [{ sourceKey: "blier_1995_african_vodun", relation: "context", note: "The Gbe serpent cults in their regional setting." }],
        startYear: 1694,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first record of python veneration at Whydah",
        originalDateText: "Whydah's pythons, first described in the 1690s",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. The first record of Dangbé, for comparison with the other African cases.",
      },
    ],
    media: [P.bagaHeaddress, P.pythonRoyal, P.sethApep],
  },
  {
    slug: "dangbe-from-israel-or-egypt-history-of-the-idea",
    title: "Who first linked Dangbé to Israel and Egypt? The idea's history, from Labat to the internet",
    summary:
      "The idea that Hueda's serpent religion came from Israel or Egypt has a history of its own: Labat's comparisons of Hueda custom with Jewish law (1730), Atkins's serpent speculation (1735), Williams's 'Hebrewisms' (1930), Lucas (1948), Merlo and Vidaud's universal serpent myth (1966), Black Hebrew Israelite histories, and today's online equations of Dan with the tribe of Dan. Tracing it shows where each piece was added.",
    description:
      "WHY TRACE IT. A claim that arrives fully formed — 'Dangbé is the serpent of the tribe of Dan' — is hard to weigh. Traced link by link, it becomes a history of ideas, and each link can be checked. The existing record on Atkins's 1735 speculation covers the earliest serpent-specific link; this record follows the whole chain.\n\n" +
      "1730: LABAT. Compiling Des Marchais's papers, Labat — read in this session — notes that the people of 'Juda' practise circumcision 'without being Jews or Muslims', and that they punish 'eye for eye, tooth for tooth', so that 'it seems they borrowed this law from the Jews'. He does not derive the serpent from Israel; he compares customs, as an educated Dominican would.\n\n" +
      "1735: ATKINS. The ship's surgeon speculates that Whydah's snake-worship might derive from 'the old Serpent' or Moses's serpent, or resemble Egyptian animal cults (existing record). Resemblance only.\n\n" +
      "1866–1885: BOUCHE. The missionary Pierre Bouche, at Ouidah in 1866–68, printed in 1885 a story he heard there: 'Dan ou Danghé (le serpent sacré)' opened the eyes of the first, blind, man and woman, 'et ils virent le bien et le mal'. He set it at once beside Genesis and the Ophites, a serpent-venerating sect he says 'prit naissance en Egypte' (archive.org full text, checked in review). This is the first point found at which Genesis, Egypt and the Gbe serpent are joined in print, and it is a missionary's frame (the rituals lane: genesis-3-and-the-dangbe-hymn).\n\n" +
      "1930–1969: DIFFUSION AND IDENTITY. Joseph J. Williams, S.J., catalogues 'Hebrewisms' among the Ashanti and argues a Jewish diffusion 'from Nile to Niger' (1930). J. Olumide Lucas derives Yoruba religion from Egypt (1948). Rudolph Windsor's From Babylon to Timbuktu (1969) gives Black Hebrew Israelite readers an Israelite history of West Africa. Each adds a route or an identity; none adds evidence from the Gbe.\n\n" +
      "1966: MERLO AND VIDAUD. Their Diogenes article, 'The Black Serpent Who Opened the Eyes of Man', summarises a forthcoming book on 'Dangbé, from the sacred Dahomean python to the universal myth of the Serpent', tracing the python's mythic analogies across Africa and beyond; it sets a Hueda hymn about the serpent opening man's eyes beside Genesis 3 (the rituals lane weighs that comparison).\n\n" +
      "TODAY. Online and devotional writing equates the tribe of Dan with the Gbe Dan and Dangbé, and Dangbé with Wadjet or Apep, usually without citing any of the above.\n\n" +
      "WHAT EACH LINK ADDED. Labat: comparison of customs. Atkins: the serpent as a possible Israelite or Egyptian survival. Bouche: the Genesis frame for a Ouidah story, and an Egyptian-born sect as its imagined channel. Williams and Windsor: a route and an Israelite identity for West Africans. Lucas: Egyptian derivation by word resemblance. Merlo and Vidaud: a universal serpent myth with Dangbé at its centre. The internet: the name Dan as proof.\n\n" +
      EVIDENCE_LINE + " It establishes how and when the idea grew, and that each step added interpretation rather than evidence. It does not establish that the idea is false — only that its history contains no point at which evidence for a connection entered.",
    category: "religion",
    subcategory: ASSESSMENT,
    eventType: "alternative",
    eventTypeNote: "The genealogy of an attributed alternative claim, recorded with its proponents and the evidence at each stage.",
    tags: serpentTags("assessment", ["figure: dangbe", "figure: dan (tribe)", "theme: names and words", "place: savi and ouidah"], "history of the idea", "derivation theory"),
    people: ["Jean-Baptiste Labat", "John Atkins", "Joseph J. Williams", "J. Olumide Lucas", "Christian Merlo", "Pierre Vidaud", "Rudolph R. Windsor"],
    civilisations: ["Hueda", "Israelites (as invoked)", "Ancient Egypt (as invoked)"],
    locationName: "Ouidah (the subject) and Paris, Lagos and New York (the proponents)",
    lat: 6.363,
    lng: 2.085,
    argumentsFor:
      "Labat and Atkins, writing within a generation of first contact, already saw resemblances to Jewish and Egyptian practice; circumcision, laws of retaliation and serpent veneration are real features of Hueda life; and Williams, Lucas, Merlo and Vidaud, and Black Hebrew Israelite writers have each assembled further resemblances that, taken together, persuade their readers of a deep connection.",
    argumentsAgainst:
      "Every link in the chain is a comparison made by an outsider, from resemblance; none produces a document, object, route or demonstrated loanword. Circumcision and retaliation are widespread in Africa (Labat himself says circumcision is practised 'almost throughout Africa'); serpent veneration is widespread; and the eighteenth-century writers were fitting Africa into biblical history, as their own words show.",
    genealogies: [
      {
        key: "dangbe-from-israel-or-egypt",
        claim: "The serpent religion of Hueda (Dangbé) came from ancient Israel or Egypt",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "Traced from 1730 to today, the claim grows by comparison and resemblance at each step. No link supplies evidence of transmission.",
        whatWouldChangeThis:
          "Any of the evidence the Atlantic crossing shows: a documented movement of people, dated witnesses, regular name correspondences with matching meanings, or an origin named by Hueda tradition itself.",
        links: [
          {
            stage: "colonial_record",
            who: "Jean-Baptiste Labat, from Des Marchais's papers",
            year: 1730,
            sourceKey: "des_marchais_labat_1730_voyage",
            reference: "vol. 2, ch. VII",
            says: "il semble qu'ils ayent emprunté cette Loi des Juifs",
            adds: "Compares Hueda customs (talion, circumcision) with Jewish law; does not derive the serpent.",
            citationStatus: "verified",
          },
          {
            stage: "alternative_interpretation",
            who: "Joseph J. Williams, S.J.",
            year: 1930,
            sourceKey: "williams_1930_hebrewisms_of_west_africa",
            saysAbsentReason: "Not read in full in this session.",
            adds: "A systematic catalogue of supposed Hebrew survivals in West Africa, with a route 'from Nile to Niger'.",
            citationStatus: "unverified",
          },
          {
            stage: "early_scholarship",
            who: "J. Olumide Lucas",
            year: 1948,
            sourceKey: "lucas_1948_religion_of_the_yorubas",
            saysAbsentReason: "Not opened in this session.",
            adds: "Egyptian derivation of West African religion by word resemblance.",
            citationStatus: "unverified",
          },
          {
            stage: "alternative_interpretation",
            who: "Christian Merlo and Pierre Vidaud",
            year: 1966,
            sourceKey: "merlo_vidaud_1966_black_serpent",
            saysAbsentReason: "Only the abstract was read in this session.",
            adds: "Places Dangbé at the centre of a universal serpent myth reaching to Eden.",
            citationStatus: "unverified",
          },
          {
            stage: "popular_claim",
            who: "Rudolph R. Windsor, and later online writing",
            year: 1969,
            sourceKey: "windsor_1969_from_babylon_to_timbuktu",
            saysAbsentReason: "Windsor read in summary only; online claims have no single citable work.",
            adds: "An Israelite identity for West Africans, and finally the name Dan offered as proof.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        startYear: 1730,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest printed comparison of Hueda custom with Jewish law found in this session",
        originalDateText: "il semble qu'ils ayent emprunté cette Loi des Juifs",
        datingMethod: "historical_record",
        chronology: "alternative",
        evidence:
          "EVIDENCE TYPE: contemporary written. Read in Labat's 1730 text in this session. It dates a European comparison, not any connection.",
      },
      {
        sourceKey: "merlo_vidaud_1966_black_serpent",
        citations: [{ sourceKey: "agbo_1959_histoire_de_ouidah", relation: "context", note: "Agbo's hymn, on which the Genesis comparison draws." }],
        startYear: 1966,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of the universal serpent-myth thesis centred on Dangbé",
        originalDateText: "Merlo and Vidaud in Diogenes, September 1966",
        datingMethod: "historical_record",
        chronology: "alternative",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Dates the article (Crossref, checked in this session).",
      },
    ],
    media: [P.labatPortrait, P.whydah1745],
  },

  // =========================================================================
  // THE CONCLUSION (track anchor)
  // =========================================================================
  {
    slug: A.assessment,
    title: "Is there a connection? The evidence weighed",
    summary:
      "Ten hypotheses, each weighed separately in words, not numbers. Egyptian influence on Kush is established evidence; Jewish communities in parts of Africa are established; the Atlantic transmission of Gbe serpent religion is established. A common origin for Dan and Dan, a Danite migration to Bénin and a borrowed serpent vocabulary are contradicted or unsupported. Independent development of Gbe serpent religion is plausible but unproven, because its beginnings are undocumented.",
    description:
      "THE QUESTION. Could the biblical tribe of Dan, ancient Egyptian and Kushite serpent traditions, and the Dan and Dangbé serpent traditions of West Africa share any historical, religious, linguistic or migratory connection? This page does not assume an answer. It weighs ten separate hypotheses, each with one of four labels — established evidence, plausible but unproven, speculative, contradicted or unsupported — which name kinds of statement, not degrees of confidence. Each hypothesis is given its strongest supporting evidence, its strongest counterevidence, its missing links, what would strengthen it, and what would weaken or falsify it. The matrix is repeated as a table in the project files (evidence-matrix.md).\n\n" +
      "1. A SHARED NAME THROUGH COMMON ANCESTRY (Hebrew Dan and Gbe Dan). LABEL: contradicted or unsupported. STRONGEST SUPPORTING EVIDENCE: the identical syllable, and Genesis 49:17's simile likening Dan to a serpent. STRONGEST COUNTEREVIDENCE: the Hebrew name means 'judge' (Genesis 30:6, root d-y-n), the Hebrew for serpent is nāḥāš, and the languages belong to unrelated families with no regular correspondences. MISSING LINKS: any intermediate form in any language between the Levant and the Bight of Benin. WHAT WOULD STRENGTHEN IT: regular sound correspondences, or an attested intermediate form on a documented route. WHAT WOULD WEAKEN OR FALSIFY IT: already weakened by the mismatch of meaning, and the words lane finds Gbe dan inherited from Proto-Gbe *-dã with regular cognates inside Gbe (Ewe da, Fon dan), which closes it as far as the Gbe side can (dan-and-dan-the-word-comparison; proto-gbe-snake-word-across-gbe). The origin traditions of the tribe and of the Dangbé cult never meet either (dan-and-dangbe-name-and-origins-compared).\n\n" +
      "2. BORROWING OF SERPENT VOCABULARY (from Hebrew, Egyptian or Meroitic into Gbe). LABEL: contradicted or unsupported. STRONGEST SUPPORTING EVIDENCE: popular lists of look-alike words. STRONGEST COUNTEREVIDENCE: none of the serpent words of Hebrew (nāḥāš, śārāf), Egyptian (the names of Wadjet, Apep, Mehen) has a Gbe counterpart, no Meroitic word for snake is known at all, and the languages along every route call the snake something different (snake-words-across-africa-no-shared-root); Gbe serpent words have cognates inside the Gbe family (Capo 1991). MISSING LINKS: a single demonstrated loanword. WHAT WOULD STRENGTHEN IT: a set of Gbe religious terms with regular correspondences to an outside language. WHAT WOULD WEAKEN OR FALSIFY IT: a full Proto-Gbe reconstruction of the serpent vocabulary showing it inherited, which the words lane begins.\n\n" +
      "3. SHARED SERPENT MYTHOLOGY. LABEL: speculative. STRONGEST SUPPORTING EVIDENCE: the Ouidah tradition that Dan or Dangbé 'opened the eyes' of the first humans, a specific combination the rituals lane assesses as a distinctive similarity to Genesis 3 (genesis-3-and-the-dangbe-hymn); serpents tied to kingship and cosmic order in Egypt, Kush and the Fon. STRONGEST COUNTEREVIDENCE: the mythologies differ in content — the Eden serpent is a tempter and Apep an enemy, where Dangbé and Aido-Hwedo are benevolent; serpent myths are found worldwide (the control record); and the earliest record of the Ouidah tradition is a Catholic missionary's, Pierre Bouche's, heard in 1866–68 and printed in 1885 already framed by Genesis; Merlo and Vidaud, who collected the tradition in the 1960s, say they never heard 'good and evil' in it. A nineteenth-century Christian channel is documented as possible; an ancient one is not. MISSING LINKS: an early, independent record of the hymn, and any shared named figure. WHAT WOULD STRENGTHEN IT: a pre-missionary record of the hymn with the same wording, and a narrative element too specific to arise twice. WHAT WOULD WEAKEN OR FALSIFY IT: showing the tradition's wording post-dates Christian contact, or that 'opening the eyes' has a local initiatory meaning unrelated to Genesis; Merlo and Vidaud's report of eyes unsealed with a plant medicine already points that way.\n\n" +
      "4. SHARED RITUAL PRACTICES. LABEL: speculative. STRONGEST SUPPORTING EVIDENCE: processions to a cult centre around a coronation (Egypt's Opet; Hueda); offerings to serpents (Nehushtan; Dangbé); sacred animals kept in temples (Late Period Egypt; Ouidah). STRONGEST COUNTEREVIDENCE: these are general features of sacral kingship and animal cult found worldwide; the specific rites differ (the uraeus is worn, Dangbé is visited; Nehushtan is an object, Dangbé living pythons); and three thousand years separate the Egyptian and Hueda evidence. MISSING LINKS: a rite specific enough to be distinctive, found in both and at points between. The rituals lane compares twenty-five practices and finds none: the Hueda coronation's order (sacrifices ordered in the serpent's name, crowning by an Allada envoy, a charge of fidelity, gifts, processions to a god's house that stays put) has no Nile counterpart, and the one specific combination in landscape, a serpent read into a royal landscape at Gebel Barkal and Savi, is a modern interpretation in both places (savi-serpent-ditch-vs-nile-valley-landscapes). WHAT WOULD STRENGTHEN IT: such a distinctive rite, dated along a route. WHAT WOULD WEAKEN OR FALSIFY IT: further evidence that the shared features are widespread in African kingdoms with no Nile connection.\n\n" +
      "5. EGYPTIAN INFLUENCE ON KUSH. LABEL: established evidence. STRONGEST SUPPORTING EVIDENCE: Egyptian temples and the Amun cult at Jebel Barkal and Kawa; Kushite kings ruling Egypt as the Twenty-fifth Dynasty; the uraeus and double uraeus on Kushite royal images; Egyptian hieroglyphs used in Kush. STRONGEST COUNTEREVIDENCE: none against the influence; scholars debate only its direction in places and Kush's own contributions (Apedemak, Meroitic writing). MISSING LINKS: none for the fact. WHAT WOULD STRENGTHEN IT: not needed. WHAT WOULD WEAKEN OR FALSIFY IT: nothing plausible; the evidence is monumental and inscribed.\n\n" +
      "6. KUSHITE INFLUENCE FARTHER WEST. LABEL: speculative. STRONGEST SUPPORTING EVIDENCE: Kush's prominence and its location on the eastern edge of the Sahel; diffusionist proposals (Seligman 1934; Meyerowitz 1960). STRONGEST COUNTEREVIDENCE: no Meroitic object or inscription has been found in West Africa; the iron-from-Meroë hypothesis is contradicted by West African dates (Alpern 2005); Kushite royal serpents are cobras and Gbe sacred serpents pythons. MISSING LINKS: any dated site between the Nile and the Niger showing Kushite material. WHAT WOULD STRENGTHEN IT: a Meroitic object, inscription or workshop in the Chad basin or beyond. WHAT WOULD WEAKEN OR FALSIFY IT: continued survey of the Sahel without such finds, and further early West African dates for the traits supposed to have come from Kush.\n\n" +
      "7. JEWISH MIGRATION INTO AFRICAN COMMUNITIES. LABEL: established evidence — for the Nile, Ethiopia, the Saharan oases and the Senegal coast; not for the Gbe. STRONGEST SUPPORTING EVIDENCE: the Elephantine papyri (fifth century BCE); the Beta Israel; the Jews of Tuat (Malfante 1447; Leo Africanus); the Sephardim of Porto de Ale and Joal (Mark and Horta 2011). STRONGEST COUNTEREVIDENCE: for the Gbe coast, Leo's statement that Timbuktu admitted no Jews, the expulsion from Tuat in the 1490s, and the absence of any Jewish trace among the Gbe. MISSING LINKS: any Jewish presence south of the Niger Bend before the nineteenth century. WHAT WOULD STRENGTHEN IT (for the Gbe): a document or excavation placing Jews on the Slave Coast before the Atlantic era. WHAT WOULD WEAKEN OR FALSIFY IT: for the documented communities, nothing plausible; for the Gbe, continued silence in the rich European record of the coast from the 1600s.\n\n" +
      "8. DIRECT DANITE MIGRATION TO BÉNIN. LABEL: contradicted or unsupported. STRONGEST SUPPORTING EVIDENCE: the name Dan; Eldad ha-Dani's Danites in Cush; the Danite identity of the Beta Israel. STRONGEST COUNTEREVIDENCE: the Danite traditions are much later than the events they describe and are located in Cush and Ethiopia, not West Africa; no Danite migration is documented anywhere; the Gbe Dan means snake, not judge; and none of the evidence a real transmission leaves (Route E) is present. MISSING LINKS: every link between Ethiopia or the Sahara and the Gbe coast. WHAT WOULD STRENGTHEN IT: evidence of an Israelite community among the Gbe before the Atlantic era, Hebrew vocabulary or rites in Hueda religion, or a Hueda tradition naming an Israelite origin that predates missionary contact. WHAT WOULD WEAKEN OR FALSIFY IT: already contradicted by the meaning of the names and the absence of any route; a secure Gbe-internal history of the cult would close it.\n\n" +
      "9. INDEPENDENT DEVELOPMENT OF GBE SERPENT RELIGION. LABEL: plausible but unproven. STRONGEST SUPPORTING EVIDENCE: the serpent vocabulary is Gbe; Hueda serpent religion is embedded in Hueda's landscape and kingship (Norman and Kelly 2004); Hueda's own tradition gives the serpent a local origin (from the army of Allada, in Labat); pythons are native to the region; serpent veneration recurs independently across Africa. STRONGEST COUNTEREVIDENCE: none against it; its weakness is that nothing is written before the sixteenth century, so the cult's earliest history cannot be documented. MISSING LINKS: dated archaeological evidence of serpent cult before the 1690s. WHAT WOULD STRENGTHEN IT: excavated, dated shrine contexts at Savi or Tado with serpent imagery; a fuller Proto-Gbe reconstruction of the religious vocabulary. WHAT WOULD WEAKEN OR FALSIFY IT: demonstrated outside loanwords in the core serpent vocabulary, or outside objects in early cult contexts.\n\n" +
      "10. LATER CULTURAL TRANSMISSION THROUGH TRADE AND RELIGION. LABEL: established evidence for the outward Atlantic transmission; speculative for any earlier transmission into the Gbe cults. STRONGEST SUPPORTING EVIDENCE: the forced migration from the Bight of Benin; Moreau de Saint-Méry's Arada Vaudoux and its serpent (1780s); Danbala, Dan, Dangbé and Bessen in Haiti and Bahia; Islamic and Christian contacts in the region from the sixteenth century. STRONGEST COUNTEREVIDENCE: for inward transmission, no outside serpent cult is documented reaching the coast; Christian influence on recorded hymns is possible but its direction is from Europe, not Israel or Egypt. MISSING LINKS: for inward transmission, any documented carrier. WHAT WOULD STRENGTHEN IT: for inward transmission, a datable outside rite or object in Hueda cult. WHAT WOULD WEAKEN OR FALSIFY IT: for the Atlantic, nothing plausible; the documentation is extensive.\n\n" +
      "WHAT THE TEN TOGETHER SHOW. The connections that are documented run along the Nile (Egypt to Kush; Judahites at Elephantine), into Ethiopia and the northern Sahara, and outward across the Atlantic from the Gbe coast. Between the Nile and the Niger, and between the Niger and the Gbe coast, the record is empty for religion. The resemblances that have been offered — a syllable, serpents near kings, processions, offerings — are of the kind that arise independently, as the python-veneration control shows. The independent development of Gbe serpent religion explains everything documented and requires nothing undocumented; its weakness is only that its own beginnings are unrecorded. Nothing found here closes the question for ever: each hypothesis names the discovery that would reopen it.\n\n" +
      EVIDENCE_LINE + " It establishes Egyptian influence on Kush, Jewish communities in parts of Africa, and the Atlantic transmission of Gbe serpent religion. It does not establish any historical, linguistic or migratory connection between the tribe of Dan, Egypt or Kush and the Dan and Dangbé traditions of the Gbe coast; it finds none of the evidence such a connection would be expected to leave, and it says so in words, not numbers.",
    category: "religion",
    subcategory: ASSESSMENT,
    eventType: "other",
    eventTypeNote: "The track's conclusion: ten hypotheses weighed separately with four named assessment labels and no numerical confidence.",
    tags: serpentTags(
      "assessment",
      ["figure: dan (tribe)", "figure: dan (vodun)", "figure: dangbe", "figure: wadjet and the uraeus", "figure: apedemak", "figure: nehushtan", "theme: migration traditions", "theme: names and words", "theme: trade routes"],
      "conclusion",
      "evidence matrix"
    ),
    people: ["Eldad ha-Dani", "Jean-Baptiste Labat", "J. Olumide Lucas", "Joseph J. Williams", "Christian Merlo", "Pierre Vidaud", "Moreau de Saint-Méry", "Leo Africanus"],
    civilisations: ["Israelites", "Ancient Egypt", "Kush", "Beta Israel", "Hueda", "Fon", "Haitian Vodou", "Jeje Candomblé"],
    locationName: "The Levant, the Nile, the Sahara, the Bight of Benin and the Americas",
    claims: [
      {
        sourceKey: "porten_yardeni_tad",
        citations: [
          { sourceKey: "torok_1997_kingdom_of_kush", relation: "context", note: "Egyptian influence on Kush, the other established ancient connection." },
          { sourceKey: "leo_africanus_pory_1896", relation: "context", note: "Where the documented Jewish presence stops." },
        ],
        startYear: bce(495),
        endYear: bce(399),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The earliest documented connection the assessment accepts: Judahites at Elephantine",
        originalDateText: "the earliest established connection, fifth century BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. Dated papyri. They establish Jewish presence on the Nile; the assessment finds no documented connection from there to the Gbe coast.",
      },
      {
        sourceKey: "moreau_saint_mery_1797_description",
        citations: [{ sourceKey: "pares_2013_formation_of_candomble", relation: "supports", note: "The Bahian end of the documented transmission." }],
        startYear: 1780,
        endYear: 1797,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The documented transmission of Gbe serpent religion across the Atlantic, first recorded",
        originalDateText: "Gbe serpent religion recorded in Saint-Domingue, 1780s–1797",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. The only religious transmission involving Dan and Dangbé that the evidence establishes.",
      },
      undated({
        sourceKey: "capo_1991_comparative_phonology_gbe",
        citations: [{ sourceKey: "norman_kelly_2004_landscape_politics", relation: "supports", note: "Hueda serpent religion embedded in a local landscape and kingship." }],
        text: "the beginnings of Gbe serpent religion, undated",
        what: "When the Gbe serpent religion began",
        chronology: "scientific",
        datingMethod: "other",
        evidence:
          "EVIDENCE TYPE: linguistic reconstruction. Its origins lie before writing on the coast and can be approached only through reconstruction and tradition, which carry no dates; none is entered.",
      }),
    ],
    media: [P.delisleAfrique1722, P.wadjetAkanosh, P.pythonRoyal, P.mehenBoard],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const ROUTE_A = "route-a-levant-egypt-nubia-ethiopia";
const ROUTE_B = "route-b-egypt-kush-sahel-west-africa";
const ROUTE_C = "route-c-north-africa-sahara-niger-bend-benin";
const ROUTE_D = "route-d-local-gbe-development";
const ROUTE_E = "route-e-bight-of-benin-to-haiti-and-brazil";
const C_NAME = "dan-and-dangbe-name-and-origins-compared";
const C_TRIBE = "tribe-of-dan-and-the-biblical-serpent-compared";
const C_NEHUSHTAN = "nehushtan-and-dangbe-compared";
const C_WADJET = "wadjet-and-dangbe-compared";
const C_CORONATION = "egyptian-royal-ceremonies-and-hueda-coronations-compared";
const C_KUSH = "kushite-serpent-iconography-and-west-african-cosmology-compared";
const C_DANITE = "danite-migration-traditions-and-african-jewish-history-compared";
const C_ATLANTIC = "african-serpent-traditions-atlantic-transmission-compared";
const C_CONTROL = "python-veneration-elsewhere-in-africa-control";
const C_IDEA = "dangbe-from-israel-or-egypt-history-of-the-idea";
const CONCLUSION = A.assessment;

const links: SeedEventLink[] = [
  // ---- the routes lane -------------------------------------------------------
  { from: ROUTE_A, to: A.routes, relation: "part_of", note: "Route A is one of the five routes the overview sets out." },
  { from: ROUTE_B, to: A.routes, relation: "part_of", note: "Route B is one of the five routes the overview sets out." },
  { from: ROUTE_C, to: A.routes, relation: "part_of", note: "Route C is one of the five routes the overview sets out." },
  { from: ROUTE_D, to: A.routes, relation: "part_of", note: "Route D is one of the five routes the overview sets out." },
  { from: ROUTE_E, to: A.routes, relation: "part_of", note: "Route E is the documented crossing the overview uses as its control." },
  { from: A.routes, to: CONCLUSION, relation: "evidence_for", note: "The routes' evidence and gaps feed hypotheses 6, 7, 8 and 10 of the conclusion." },
  { from: ROUTE_A, to: ROUTE_C, relation: "related", note: "Both are proposed corridors for Israelite movement into Africa; neither reaches the Gbe coast." },
  { from: ROUTE_B, to: ROUTE_C, relation: "related", note: "The two long-distance westward routes, one by the Nile and Sahel, one across the Sahara." },
  { from: ROUTE_D, to: ROUTE_E, relation: "precedes", note: "The Gbe serpent religion that developed locally is what the Atlantic trade carried west." },

  // ---- routes to the other lanes' anchors ------------------------------------
  { from: ROUTE_A, to: A.africanJewish, relation: "related", note: "The Dan in Africa lane documents the communities and texts on Route A in detail." },
  { from: ROUTE_A, to: A.dan, relation: "related", note: "Route A begins with the tribe of Dan, whose sources the dan lane sets out." },
  { from: ROUTE_B, to: A.kush, relation: "related", note: "The Kush lane documents the Egypt-to-Kush stage, the only documented part of Route B." },
  { from: ROUTE_B, to: A.egypt, relation: "related", note: "Route B starts from the Egyptian serpent religion the Egypt lane documents." },
  { from: ROUTE_C, to: A.africanJewish, relation: "related", note: "The Jews of Tuat and the Tārīkh al-fattāsh passages are treated in the Dan in Africa lane." },
  { from: ROUTE_D, to: A.gbe, relation: "related", note: "Route D is the history the Gbe lane documents record by record." },
  { from: ROUTE_D, to: A.words, relation: "evidence_for", note: "Gbe-internal cognates of dan are the linguistic evidence for local development." },
  { from: ROUTE_E, to: A.gbe, relation: "related", note: "Route E carries the Gbe serpent traditions of the Gbe lane across the Atlantic." },

  // ---- routes to existing records ----------------------------------------------
  { from: ROUTE_A, to: "hueda-serpents-egypt-and-israel-speculation", relation: "related", note: "Atkins's 1735 speculation is the earliest serpent-specific Egypt-or-Israel idea; Route A is the documented contact it presumed." },
  { from: ROUTE_B, to: "egyptian-origin-theory-for-vodun-and-orisha", relation: "related", note: "The existing record traces the Egyptian-origin theory (Lucas, Diop); Route B weighs its route and the iron test." },
  { from: ROUTE_B, to: "alt-african-origins-of-mediterranean-symbols", relation: "related", note: "Another diffusion claim across Africa, assessed elsewhere with the same standard of evidence." },
  { from: ROUTE_C, to: "trans-saharan-exchange-garamantes", relation: "related", note: "The early trans-Saharan exchange that Route C's later trade grew from." },
  { from: ROUTE_C, to: "garamantes-and-sub-saharan-africa", relation: "related", note: "The Garamantes' links southward: documented trade, not religious transmission." },
  { from: ROUTE_D, to: "aja-and-the-tado-tradition", relation: "related", note: "The Tado tradition is Route D's remembered starting point." },
  { from: ROUTE_D, to: "tado-as-a-religious-source", relation: "related", note: "Tado as the remembered source of the cults, a local origin for Route D." },
  { from: ROUTE_D, to: "hueda-kingdom-and-savi", relation: "related", note: "The Hueda kingdom whose kingship organised the serpent cult." },
  { from: ROUTE_D, to: "savi-excavated", relation: "evidence_for", note: "The excavations at Savi are Route D's archaeological evidence." },
  { from: ROUTE_D, to: "how-the-serpent-came-to-hueda", relation: "related", note: "Hueda's own stories give the serpent a local, regional origin." },
  { from: ROUTE_E, to: "vodun-atlantic-what-crossed", relation: "related", note: "The existing account of what crossed the Atlantic, of which the serpent is one part." },
  { from: ROUTE_E, to: "haitian-vodou-formation-saint-domingue", relation: "related", note: "Moreau's Vaudoux belongs to the formation of Haitian Vodou in Saint-Domingue." },
  { from: ROUTE_E, to: "ouidah-and-the-scale-of-the-trade", relation: "evidence_for", note: "The scale of the forced migration from Ouidah underlies the documented crossing." },

  // ---- comparisons to the conclusion and to each other ---------------------------
  { from: C_NAME, to: CONCLUSION, relation: "evidence_for", note: "Weighs hypotheses 1 and 2 of the conclusion: common ancestry and borrowing of the name." },
  { from: C_TRIBE, to: CONCLUSION, relation: "evidence_for", note: "Tests whether the tribe of Dan had a serpent cult that could have travelled (hypothesis 8)." },
  { from: C_NEHUSHTAN, to: CONCLUSION, relation: "evidence_for", note: "Bears on shared ritual (hypothesis 4): offerings to a serpent in Jerusalem and Ouidah." },
  { from: C_WADJET, to: CONCLUSION, relation: "evidence_for", note: "Bears on shared mythology and ritual (hypotheses 3 and 4)." },
  { from: C_CORONATION, to: CONCLUSION, relation: "evidence_for", note: "Bears on shared ritual practices (hypothesis 4)." },
  { from: C_KUSH, to: CONCLUSION, relation: "evidence_for", note: "Bears on Kushite influence farther west (hypothesis 6)." },
  { from: C_DANITE, to: CONCLUSION, relation: "evidence_for", note: "Bears on Jewish migration and direct Danite migration (hypotheses 7 and 8)." },
  { from: C_ATLANTIC, to: CONCLUSION, relation: "evidence_for", note: "The documented Atlantic crossing is hypothesis 10 and the control for all the others." },
  { from: C_CONTROL, to: CONCLUSION, relation: "evidence_for", note: "The control case against which every serpent resemblance in the conclusion is weighed." },
  { from: C_IDEA, to: CONCLUSION, relation: "evidence_for", note: "The history of the connection idea shows where each claimed link was added." },
  { from: C_NAME, to: C_TRIBE, relation: "related", note: "The name and the serpent simile are the two halves of the popular Dan-Dangbé equation." },
  { from: C_NEHUSHTAN, to: C_TRIBE, relation: "related", note: "The Bible's venerated serpent was in Jerusalem, not at Dan." },
  { from: C_WADJET, to: C_KUSH, relation: "related", note: "The uraeus passed from Egypt to Kush, where it was doubled." },
  { from: C_WADJET, to: C_CORONATION, relation: "related", note: "Wadjet's uraeus is the serpent of Egyptian coronation." },
  { from: C_DANITE, to: ROUTE_A, relation: "related", note: "Route A is where the Danite traditions and documented Jewish history overlap." },
  { from: C_DANITE, to: ROUTE_C, relation: "related", note: "Route C is where documented Jewish trade stops short of the Gbe coast." },
  { from: C_KUSH, to: ROUTE_B, relation: "related", note: "Route B is the proposed path for Kushite influence westward." },
  { from: C_ATLANTIC, to: ROUTE_E, relation: "related", note: "Route E documents the crossing that this comparison uses as its standard." },
  { from: C_CONTROL, to: C_WADJET, relation: "relevant", note: "Royal and sacred serpents across Africa are the background to the Wadjet–Dangbé resemblance." },
  { from: C_CONTROL, to: C_NEHUSHTAN, relation: "relevant", note: "Offerings to serpents recur without connection; the control weighs the Nehushtan resemblance." },
  { from: C_IDEA, to: C_NAME, relation: "related", note: "The name comparison is the last link the idea's history added." },
  { from: C_IDEA, to: ROUTE_B, relation: "related", note: "Lucas and the diffusionists are links in both the idea's history and Route B." },
  { from: C_IDEA, to: ROUTE_C, relation: "related", note: "Williams and Windsor are links in both the idea's history and Route C." },

  // ---- comparisons to every lane's anchor -------------------------------------------
  { from: C_NAME, to: A.words, relation: "related", note: "The words lane sets out the linguistic detail of Dan and dan that this comparison weighs." },
  { from: C_NAME, to: A.dan, relation: "related", note: "The tribe's name and its sources are set out in the dan lane." },
  { from: C_NAME, to: A.gbe, relation: "related", note: "Dan and Dangbé as Gbe vodun are set out in the Gbe lane." },
  { from: C_TRIBE, to: A.dan, relation: "related", note: "The dan lane documents Tel Dan and the texts on the tribe." },
  { from: C_NEHUSHTAN, to: A.dan, relation: "related", note: "Nehushtan and Israelite serpent traditions are documented in the dan lane." },
  { from: C_NEHUSHTAN, to: A.rituals, relation: "related", note: "The rituals lane compares the serpent gods and their rites in detail." },
  { from: C_WADJET, to: A.egypt, relation: "related", note: "Wadjet and the uraeus are documented in the Egypt lane." },
  { from: C_WADJET, to: A.gbe, relation: "related", note: "Dangbé is documented in the Gbe lane." },
  { from: C_CORONATION, to: A.rituals, relation: "related", note: "The rituals lane sets the royal ceremonies' images side by side." },
  { from: C_CORONATION, to: A.egypt, relation: "related", note: "Egyptian royal ceremonies and the uraeus are documented in the Egypt lane." },
  { from: C_KUSH, to: A.kush, relation: "related", note: "Apedemak and the double uraeus are documented in the Kush lane." },
  { from: C_KUSH, to: A.gbe, relation: "related", note: "Fon serpent cosmology is documented in the Gbe lane." },
  { from: C_DANITE, to: A.africanJewish, relation: "related", note: "The Dan in Africa lane documents each community and tradition compared here." },
  { from: C_ATLANTIC, to: A.gbe, relation: "related", note: "The African end of the crossing is the Gbe lane's subject." },
  { from: C_ATLANTIC, to: A.routes, relation: "related", note: "The Atlantic crossing is Route E in the routes lane." },
  { from: C_CONTROL, to: A.rituals, relation: "related", note: "The rituals lane's comparisons rest on the same control." },
  { from: CONCLUSION, to: A.dan, relation: "related", note: "The conclusion weighs the tribe of Dan's sources as the dan lane sets them out." },
  { from: CONCLUSION, to: A.africanJewish, relation: "related", note: "The conclusion weighs the Danite traditions and African Jewish history as that lane sets them out." },
  { from: CONCLUSION, to: A.egypt, relation: "related", note: "The conclusion weighs Egyptian serpent religion as that lane documents it." },
  { from: CONCLUSION, to: A.kush, relation: "related", note: "The conclusion's hypotheses 5 and 6 rest on the Kush lane." },
  { from: CONCLUSION, to: A.gbe, relation: "related", note: "The conclusion's hypothesis 9 rests on the Gbe lane." },
  { from: CONCLUSION, to: A.words, relation: "related", note: "The conclusion's hypotheses 1 and 2 rest on the words lane." },
  { from: CONCLUSION, to: A.rituals, relation: "related", note: "The conclusion's hypotheses 3 and 4 rest on the rituals lane." },

  // ---- comparisons to existing records -------------------------------------------
  { from: C_NAME, to: "dan-the-serpent", relation: "related", note: "The existing record on Dan as the serpent of movement and continuity: the Gbe side of the name." },
  { from: C_NAME, to: "resemblance-is-not-descent", relation: "relevant", note: "The principle this comparison applies: a shared sound is not a shared origin." },
  { from: C_NEHUSHTAN, to: "nehushtan-kundalini-comparison", relation: "related", note: "The existing record compares Nehushtan with Kundalini; this one asks only about Dangbé." },
  { from: C_NEHUSHTAN, to: "temple-of-pythons-today", relation: "related", note: "Dangbé's living pythons at the Temple of Pythons, Ouidah." },
  { from: C_WADJET, to: "uraeus-kundalini-comparison", relation: "related", note: "The existing record on the uraeus as forehead cobra." },
  { from: C_WADJET, to: "egyptian-origin-theory-for-vodun-and-orisha", relation: "responds_to", note: "Popular claims equating Dan or Dangbé with Wadjet belong to the Egyptian-origin theory traced there." },
  { from: C_CORONATION, to: "hueda-coronation-and-serpent-processions-1725", relation: "related", note: "The existing account of the Hueda coronation and processions, from Des Marchais." },
  { from: C_CORONATION, to: "hueda-serpent-priesthood-and-the-king", relation: "related", note: "The serpent priesthood's power over the Hueda king, the context of the coronation processions." },
  { from: C_KUSH, to: "aido-hwedo-the-rainbow-serpent", relation: "related", note: "Aido-Hwedo, the Fon cosmic serpent compared here with Kushite imagery." },
  { from: C_KUSH, to: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", relation: "related", note: "The existing comparison of Dan and Aido-Hwedo with cosmic serpents elsewhere." },
  { from: C_ATLANTIC, to: "serpent-symbolism-across-the-atlantic", relation: "related", note: "The existing record describes the Atlantic serpents; this one uses their transmission as the track's evidential standard." },
  { from: C_ATLANTIC, to: "danbala-and-ayida-wedo", relation: "related", note: "Danbala and Ayida Wedo, the Haitian forms of Dan and Aido-Hwedo." },
  { from: C_ATLANTIC, to: "african-vodun-and-haitian-lwa-compared", relation: "related", note: "The existing comparison of which vodun names crossed and what they became." },
  { from: C_CONTROL, to: "okomilo-python-comparison", relation: "related", note: "Another African python tradition, with its own comparison of whether two cults are connected." },
  { from: C_CONTROL, to: "okomilo-benin-palace-pythons", relation: "related", note: "The brass pythons of the Benin palace: royal serpent imagery with no Nile or Israelite link claimed." },
  { from: C_CONTROL, to: "serpent-is-not-one-symbol", relation: "relevant", note: "The serpent-kundalini control record makes the same point across three civilisations." },
  { from: C_CONTROL, to: "set-spears-apep", relation: "related", note: "In Egypt's best-known serpent myth the serpent is the enemy, which the control sets beside venerated serpents." },
  { from: C_IDEA, to: "hueda-serpents-egypt-and-israel-speculation", relation: "related", note: "Atkins's 1735 speculation is the earliest serpent-specific link in the idea's history." },
  { from: C_IDEA, to: "egyptian-origin-theory-for-vodun-and-orisha", relation: "related", note: "The Egyptian-origin theory's genealogy runs parallel to the Israelite one traced here." },
  { from: C_IDEA, to: "european-accounts-of-hueda-copied-each-other", relation: "related", note: "The European accounts that carried the idea copied each other." },
  { from: CONCLUSION, to: "resemblance-is-not-descent", relation: "relevant", note: "The conclusion applies the principle that similarity alone is not evidence of descent." },
  { from: CONCLUSION, to: "vodun-west-africa-what-can-be-recovered", relation: "related", note: "What can be recovered of the coast's earliest religion bounds hypothesis 9." },

  // ---- to specific records of the other lanes ----------------------------------
  { from: ROUTE_A, to: "elephantine-judean-garrison-and-temple-of-yhw", relation: "evidence_for", note: "The Elephantine garrison and temple are Route A's documented point on the Nubian frontier." },
  { from: ROUTE_A, to: "eldad-ha-dani-dan-in-the-land-of-cush", relation: "related", note: "Eldad's 'Dan in the land of Cush' is the earliest Danite tradition on Route A." },
  { from: ROUTE_A, to: "radbaz-beta-israel-are-dan-and-the-1973-ruling", relation: "related", note: "The Danite identification of the Beta Israel, a later legal identity on Route A." },
  { from: ROUTE_A, to: "beta-israel-origins-debate", relation: "related", note: "The competing reconstructions of Beta Israel origins that decide what Route A can carry." },
  { from: ROUTE_A, to: "kebra-nagast-solomon-sheba-menelik-not-dan", relation: "related", note: "Ethiopia's royal Israelite tradition is Solomonic, not Danite: evidence against the Danite route." },
  { from: ROUTE_B, to: "kush-westward-contact-what-is-not-known", relation: "related", note: "The Kush lane's account of the westward-contact idea and the missing evidence." },
  { from: ROUTE_B, to: "end-of-meroe-fourth-century", relation: "related", note: "The end of Meroë bounds Route B's last possible Kushite stage." },
  { from: ROUTE_C, to: "tamentit-tuat-jews-and-al-maghili-1492", relation: "related", note: "The Jews of Tuat and their expulsion: Route C's documented Jewish community, and where it ends." },
  { from: ROUTE_C, to: "timbuktu-niger-bend-jews-excluded-and-admitted", relation: "related", note: "Leo Africanus's exclusion of Jews from Timbuktu, examined in the Dan in Africa lane." },
  { from: ROUTE_C, to: "tarikh-al-fattash-bani-israil-a-nineteenth-century-text", relation: "related", note: "The Tārīkh al-fattāsh passages cited for Route C are a nineteenth-century rewriting." },
  { from: ROUTE_C, to: "hypothesis-israelites-from-the-nile-to-the-niger", relation: "related", note: "The Nile-to-Niger hypothesis that Route C's religious leg rests on." },
  { from: ROUTE_C, to: "hypothesis-tuat-and-songhay-jewish-refugees-reach-the-guinea-coast", relation: "related", note: "The proposal that refugees from Tuat and Songhay carried traditions south: Route C's final leg." },
  { from: ROUTE_C, to: "genizah-merchants-maghreb-and-saharan-gold", relation: "related", note: "Jewish merchants in the Saharan gold trade: documented trade on Route C, not religious transmission." },
  { from: ROUTE_D, to: "savi-hueda-archaeological-project-1991-2010", relation: "evidence_for", note: "The Savi excavations are Route D's archaeological evidence." },
  { from: ROUTE_D, to: "savi-serpent-ditch-argument", relation: "related", note: "Norman and Kelly's serpent-ditch reading ties the cult to Hueda's own landscape." },
  { from: ROUTE_D, to: "dan-worship-origins-and-movement", relation: "related", note: "How serpent vodun moved within the Gbe region: the local movements of Route D." },
  { from: C_CORONATION, to: "hueda-coronation-1715-or-1725", relation: "related", note: "The Gbe lane's finding that Labat's text (1715) and the plate (1725) disagree on the coronation's date." },
  { from: C_CORONATION, to: "hueda-coronation-rite-allada-crowner", relation: "related", note: "The Hueda coronation rite as Labat's text describes it, the West African side of this comparison." },
  { from: C_CORONATION, to: "des-marchais-hueda-plates", relation: "relevant", note: "What in the coronation engraving was drawn on the spot and what was redrawn in Paris." },
  { from: C_CORONATION, to: "anlamani-aspelta-enthronement-journey", relation: "related", note: "A Kushite enthronement journey: another Nile royal procession set beside the Hueda one." },
  { from: C_KUSH, to: "kushite-double-uraeus", relation: "related", note: "The double uraeus of the Kushite kings, documented in the Kush lane." },
  { from: C_KUSH, to: "naqa-lion-temple-serpent-bodied-apedemak", relation: "related", note: "Apedemak as a lion-headed serpent at Naqa, documented in the Kush lane." },
  { from: C_DANITE, to: "eldad-ha-dani-dan-in-the-land-of-cush", relation: "related", note: "Eldad's account is the root of the Danite migration traditions compared here." },
  { from: C_DANITE, to: "beta-israel-origins-debate", relation: "related", note: "The Beta Israel origins debate sets documented history against the Danite tradition." },
  { from: C_DANITE, to: "tamentit-tuat-jews-and-al-maghili-1492", relation: "related", note: "The Jews of Tuat: documented African Jewish history at its closest to West Africa before the Atlantic era." },
  { from: C_IDEA, to: "merlo-vidaud-dangbe-universal-serpent", relation: "related", note: "The Gbe lane's record of Merlo and Vidaud's universal-serpent thesis, a link in the idea's history." },
  { from: C_IDEA, to: "hypothesis-israelites-from-the-nile-to-the-niger", relation: "related", note: "Williams's and Windsor's Nile-to-Niger idea, recorded as a hypothesis in the Dan in Africa lane." },
  { from: CONCLUSION, to: "agbo-dangbe-hymn-opened-the-eyes", relation: "related", note: "The hymn behind hypothesis 3 (shared mythology), examined in the Gbe lane." },
  // Cross-lane links added in review: specific records that bear on each other.
  { from: "wadjet-and-dangbe-compared", to: "serpents-that-protect-kings-wadjet-kush-dangbe", relation: "related", note: "How each royal serpent guards its king, worn or visited, is compared there; this record asks only whether the two are one deity." },
  { from: "kushite-serpent-iconography-and-west-african-cosmology-compared", to: "serpents-that-protect-kings-wadjet-kush-dangbe", relation: "related", note: "The Kushite royal cobra appears in both; this record compares Kush with Fon cosmology, that one compares royal protection." },
  { from: "egyptian-royal-ceremonies-and-hueda-coronations-compared", to: "coronation-legitimacy-processions-oaths-compared", relation: "related", note: "That record follows the order of actions in four kingdoms; this one asks only whether Egypt's festivals could be the Hueda rite's ancestor." },
  { from: "african-serpent-traditions-atlantic-transmission-compared", to: "danbala-the-gbe-snake-word-that-crossed-the-atlantic", relation: "related", note: "The word-level case of the crossing; this record weighs the religion as a whole." },
  { from: "nehushtan-and-dangbe-compared", to: "healing-serpents-nehushtan-egypt-sakpata-dan", relation: "related", note: "Healing through serpent images is compared there; this record asks whether Nehushtan and Dangbé are historically linked." },
];

export const ROUTES_AND_ASSESSMENT: SerpentSection = { sources, events, links };
