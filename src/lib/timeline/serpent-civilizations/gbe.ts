// LANE: GBE SERPENT TRADITIONS — DAN, DANGBÉ AND AIDO-HWEDO.
//
// What this section is for. The vodun-diaspora "kingdoms" section and
// benin-vodun already tell most of the story of Hueda's python: Bosman, the
// April 1725 procession, the serpent's wives, the high priest, the origin
// stories, the penalties, the 1727 conquest and Dahomey's adoption of the cult.
// This lane does not retell any of it. It adds what those records do not have:
// the excavations at Savi and Norman and Kelly's "serpent ditch" argument, kept
// apart; the coronation rite itself as Labat's text describes it, and the date
// problem in that text (it says 1715; the plates say 1725); what Des Marchais's
// plates actually show; the oracle Father Braguez saw; Norman's reading of the
// python parade; the women in the coronation; the hymn Agbo printed; Merlo and
// Vidaud's interpretation; and the traditions of where Dan worship came from.
//
// HOW IT WAS RESEARCHED. Labat's Voyage du chevalier Des Marchais (1730), vol. 2,
// and his Nouveau voyage aux isles de l'Amérique (1724 edition, vol. 2) were
// read in archive.org OCR scans in this session, and the French is quoted from
// them with the long s modernised. Norman's 2014 chapter was read in full on the
// University Press of Colorado open reader; the 1999 Savi field report in Nyame
// Akuma in full. Norman and Kelly (2004) could NOT be read: only its abstract and
// Crossref record were reached, so statements about its detailed argument are
// marked. Agbo (1959) and Merlo and Vidaud's full texts could not be reached.
// Every Commons file page was fetched and its licence copied from it.

import type { SeedEvent, SeedEventLink, SeedSource } from "../seed-types";
import { SERPENT_LANE_ANCHORS, SERPENT_LANES, commonsPicture, serpentTags, type SerpentSection } from "./shared";

const LANE = "gbe" as const;
const SUB = SERPENT_LANES.gbe;
const ANCHOR = SERPENT_LANE_ANCHORS.gbe;
const A = SERPENT_LANE_ANCHORS;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  {
    key: "norman_kelly_2004_landscape_politics",
    title: "Landscape Politics: The Serpent Ditch and the Rainbow in West Africa",
    author: "Neil L. Norman and Kenneth G. Kelly",
    publisher: "American Anthropologist 106 (1): 98–110 (March 2004)",
    url: "https://doi.org/10.1525/aa.2004.106.1.98",
    reference: "Crossref record and abstract read in this session; full text not reached (publisher and ResearchGate copies blocked). ResearchGate figure 4: https://www.researchgate.net/figure/Huedan-coronation-ceremony-Note-the-conical-python-shrine-in-the-center-of-the-palace_fig4_255626396",
    sourceType: "academic_paper",
    publishedYear: 2004,
    notes:
      "Cited for the argument that the massive ditches of southern Bénin (c. 17th–19th centuries) were not the military works European travellers took them for, but built landscape referring to cosmology, used by Hueda and Dahomey to shape regional politics (the abstract's own words). VIEWPOINT: archaeological and anthropological interpretation by the two archaeologists who surveyed Savi. Its detailed reading of the ditches as python or rainbow serpent is known here only through its abstract, its figure captions and Norman's later summary (2014); those details are marked NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "kelly_brunache_norman_1999_savi_fieldwork",
    title: "Archaeological Fieldwork at Savi, Republic of Benin: The 1999 season",
    author: "Kenneth G. Kelly, Peggy Brunache and Neil L. Norman",
    publisher: "Nyame Akuma 52 (December 1999), Society of Africanist Archaeologists",
    url: "https://static1.squarespace.com/static/5bd0e66f8d97400eb0099556/t/5bdb0337c2241bcd3a05d695/1541079865884/Nyame+Akuma+Issue+052-Article+02.pdf",
    sourceType: "archaeological",
    publishedYear: 1999,
    notes:
      "Cited as the field report, read in full in this session: the Hueda Archaeological Project begun in 1991; six seasons by 1999; the ditch system first identified in 1994 and mapped in 1996, some ditches 8 m deep and 30 m wide; a causeway with a double-lobed gatehouse mound; the burned layer of the 1727 conquest; and the statement that no contemporary European account mentions any ditch system. VIEWPOINT: the excavators' own preliminary report.",
  },
  {
    key: "norman_2014_pythons_pigs",
    title: "Pythons, Pigs, and Political Process in the Hueda Kingdom, Benin, West Africa AD 1650–1727",
    author: "Neil L. Norman",
    publisher: "In Benjamin S. Arbuckle and Sue Ann McCarty (eds), Animals and Inequality in the Ancient World, University Press of Colorado, 2014, chapter 14 (doi 10.5876/9781607322863.c014)",
    url: "https://read.upcolorado.com/read/animals-and-inequality-in-the-ancient-world/section/519f78d2-12b8-4cfd-ad21-97b8e1d432cb",
    sourceType: "academic_paper",
    publishedYear: 2014,
    notes:
      "Read in full in this session. Cited for: the Savi palace (about 1.5 by 1 km) found by Kelly and the countryside surveyed by Norman 2002–2010; the 1727 burn layer; ditches dug as clay borrow pits that also bounded compounds; Huedans today associating ditches with pythons; Python regius as the venerated species; the king's parade to the python temple and its gifts; Bosman's king refusing more offerings; Merlo and Vidaud's 'opened their eyes' (1966: 66); and a temple to Dangbe in the palace complex at Abomey today. VIEWPOINT: an archaeologist's interpretation, building on his own excavations and on European accounts.",
  },
  {
    key: "norman_2010_feasts_in_motion",
    title: "Feasts in Motion: Archaeological Views of Parades, Ancestral Pageants, and Socio-Political Process in the Hueda Kingdom, 1650–1727 AD",
    author: "Neil L. Norman",
    publisher: "Journal of World Prehistory 23 (4): 239–254 (2010)",
    url: "https://doi.org/10.1007/s10963-010-9037-z",
    sourceType: "academic_paper",
    publishedYear: 2010,
    notes:
      "Cited for Norman's argument that Hueda's royal parades to the python temple were moving feasts of reciprocity whose curtailment fed discontent before 1727. Only the bibliographic record was reached in this session (the publisher page sits behind a browser check); its argument is cited as Norman himself summarises it in his 2014 chapter. NEEDS SOURCE VERIFICATION for anything beyond that summary.",
  },
  {
    key: "des_marchais_labat_1730_voyage",
    title: "Voyage du chevalier Des Marchais en Guinée, isles voisines, et à Cayenne, fait en 1725, 1726 & 1727",
    author: "Jean-Baptiste Labat (from the papers of Renaud Des Marchais)",
    publisher: "Saugrain, Paris, 1730 (4 vols); Amsterdam edition 1731",
    reference: "Vol. 2: ch. 5 on the kings of Juda (coronation, succession, pp. ~59–76) and the chapter on religion (processions to the serpent's house, pp. ~190–199); read in the archive.org OCR of vol. 2",
    url: "https://archive.org/details/voyageduchevali02labagoog",
    sourceType: "primary",
    publishedYear: 1730,
    publishedDisplay: "information of 1715 and 1725; published 1730",
    notes:
      "Cited for the coronation rite of the Hueda kings as Labat compiled it from Des Marchais's memoirs: the delay controlled by the grandees, the sacrifices ordered in the serpent's name, the royal wives' procession, the Allada grandee who crowned the king and his oath formula, the gifts, the succession rules, and the text's own date (April 1715) for the coronation Des Marchais attended. VIEWPOINT: a Dominican compiler in Paris who never visited Hueda, writing up a French slave-ship captain's notes for a French readership, with frequent sarcasm about the 'Dieu serpent'.",
  },
  {
    key: "labat_1724_nouveau_voyage",
    title: "Nouveau voyage aux isles de l'Amérique, tome second",
    author: "Jean-Baptiste Labat",
    publisher: "P. Husson et al., The Hague, 1724 (first edition Paris, 1722)",
    reference: "Vol. 2, pp. ~40–43, under the year 1698: the account of Father Braguez at Juda with the Chevalier Damon",
    url: "https://archive.org/details/nouveauvoyageaux01laba",
    sourceType: "primary",
    publishedYear: 1722,
    publishedDisplay: "told to Labat c. 1698; printed 1722 (Paris), 1724 (The Hague)",
    notes:
      "Read in this session. Cited for the earliest description found here of a Hueda king consulting the serpent: a festival 'pour consulter le serpent' three to four leagues from the king's town, the priest questioning a snake at a hole and carrying its answers to the kneeling king. Second-hand: Labat had it from Braguez, a fellow Dominican. VIEWPOINT: a missionary writer who reports the priest's explanation of serpent-worship in terms a Christian reader would recognise.",
  },
  {
    key: "bosman_1705_guinea",
    title: "A New and Accurate Description of the Coast of Guinea, Divided into the Gold, the Slave, and the Ivory Coasts",
    author: "Willem Bosman",
    publisher: "James Knapton and Dan. Midwinter, London, 1705 (Dutch 1704)",
    url: "https://archive.org/details/newaccuratedescr00bosm",
    sourceType: "primary",
    publishedYear: 1705,
    notes:
      "Cited only for what this lane adds to the existing Bosman records: the snake house 'about two [Dutch] miles from the King's Village', under a lofty tree, and the king who refused the priests' demand for more offerings. Those passages are quoted here as Norman (2014) quotes them from the 1705 and 1721 editions; not re-read in this session. VIEWPOINT: a Dutch factor writing satirically about 'idolatry'.",
  },
  {
    key: "law_1991_slave_coast",
    title: "The Slave Coast of West Africa 1550–1750: The Impact of the Atlantic Slave Trade on an African Society",
    author: "Robin Law",
    publisher: "Clarendon Press, Oxford",
    publishedYear: 1991,
    reference: "Chapters on Hueda politics and the reign of Huffon; page numbers not checked in this session",
    sourceType: "academic_book",
    notes:
      "Cited as the standard history of Hueda, for the frame this lane works within: Huffon's accession in 1708, Hueda's dependence on and independence from Allada, its factional politics and its conquest by Dahomey in 1727. Not re-read in this session; the specific statements are those it is widely cited for and are marked NEEDS SOURCE VERIFICATION where a page would matter.",
  },
  {
    key: "law_1990_common_people_divided",
    title: "'The Common People Were Divided': Monarchy, Aristocracy and Political Factionalism in the Kingdom of Whydah, 1671–1727",
    author: "Robin Law",
    publisher: "International Journal of African Historical Studies 23 (2): 201–229",
    url: "https://doi.org/10.2307/219335",
    publishedYear: 1990,
    sourceType: "academic_paper",
    notes:
      "Cited for the setting of Hueda succession disputes and the grandees' power over the crown, which Labat's account of delayed coronations and a younger son preferred in 1715 illustrates. Not read in this session (bibliographic record only); NEEDS SOURCE VERIFICATION for its specific arguments.",
  },
  {
    key: "wikipedia_haffon",
    title: "Haffon",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Haffon",
    sourceType: "wikipedia",
    notes:
      "Cited only as the place where the modern dating dispute surfaces: it gives Haffon's accession as 1708, a formal coronation at Savi in April 1725 after Des Marchais, and says 'some modern scholars' place the coronation in 1717–1718, naming none. Its only reference is Robert Harms, The Diligent (2002), pp. 152–155. Read in this session; a tertiary source, not evidence in its own right.",
  },
  {
    key: "agbo_1959_histoire_de_ouidah",
    title: "Histoire de Ouidah du XVIe au XXe siècle",
    author: "Casimir Agbo (dit Alidji)",
    publisher: "Avignon, 1959 (printer given as Les Presses universelles in WorldCat and as Presses de la Maison Aubanel Père in French Wikipedia's bibliography); digital reissue FeniXX",
    url: "https://search.worldcat.org/title/histoire-de-ouidah-du-xvie-au-xxe-siecle/oclc/18587236",
    publishedYear: 1959,
    sourceType: "book",
    notes:
      "Cited as the source the research request names for the Hueda hymn 'Dagbé wè houn noukoun na mi' ('C'est Dagbé qui a ouvert les yeux à l'homme'). The book itself could NOT be read in this session (the Scribd copy and Google Books preview were unreachable), so the wording and page are unverified. VIEWPOINT: a Ouidah-born historian writing local history from family and town traditions in the late colonial period.",
  },
  {
    key: "merlo_vidaud_1966_black_serpent",
    title: "The Black Serpent Who Opened the Eyes of Man",
    author: "Christian Merlo and Pierre Vidaud",
    publisher: "Diogenes 14 (55): 61–88 (September 1966)",
    url: "https://doi.org/10.1177/039219216601405505",
    sourceType: "academic_paper",
    publishedYear: 1966,
    notes:
      "Cited for Merlo and Vidaud's summary of their work on Dangbé, the Hueda python, in an international humanities journal; its opening (read in this session) cites Verger, Bosman and Labat and lists the god's modern attributes (fertility, fecundity, health, wealth, peace, wisdom, happiness). Norman (2014) cites p. 66 for the statement that Dangbé gave people the knowledge of good and evil, 'opened their eyes'. Full text not reached. VIEWPOINT: comparative mythology seeking a 'universal' serpent myth.",
  },
  {
    key: "houis_1975_review_merlo_vidaud",
    title: "Review of Christian Merlo and Pierre Vidaud, Dangbé. Du Python sacré des Houéda au mythe universel du Serpent",
    author: "Maurice Houis",
    publisher: "Journal de la Société des Africanistes 45 (1–2): 232–233 (1975)",
    url: "https://www.persee.fr/doc/jafr_0037-9166_1975_num_45_1_1769_t1_0232_0000_3",
    publishedYear: 1975,
    sourceType: "academic_paper",
    notes:
      "Read in this session. Cited for the existence and plan of Merlo and Vidaud's 600-page typescript of 1974 (consultable at the library of the Musée de l'Homme): a study of Dangbé's rites, myths and many temples, a search for the cult's origin in the clans of Lower Dahomey and then in neighbouring peoples of Togo and Nigeria, and comparison with python or serpent cults among the Asante, Baganda and Venda.",
  },
  {
    key: "herskovits_1938_dahomey",
    title: "Dahomey: An Ancient West African Kingdom",
    author: "Melville J. Herskovits",
    publisher: "J. J. Augustin, New York, 1938 (2 vols)",
    url: "https://archive.org/details/in.ernet.dli.2015.36395",
    reference: "Vol. 1, the ancestral cult (Dambada Hwedo as the personification of the unknown ancient dead; the Aido Hwedo house among ancestral shrines), pp. ~200–208; vol. 2 (the Da cult) not reached",
    publishedYear: 1938,
    sourceType: "academic_book",
    notes:
      "Cited for Abomey ethnography of 1931: that 'Da' (Dan) names a family of serpent powers, among them Aido Hwedo and Dambada Hwedo, the latter standing for the forgotten ancestors in the lineage cult. Vol. 1 read in an archive.org scan in this session. VIEWPOINT: an American anthropologist working mostly with informants at Abomey, the Dahomean capital, not at Ouidah.",
  },
  {
    key: "burton_1864_mission_gelele",
    title: "A Mission to Gelele, King of Dahome",
    author: "Richard F. Burton",
    publisher: "Tinsley Brothers, London, 1864 (2 vols)",
    url: "https://archive.org/details/missiontogelelek02burt",
    sourceType: "primary",
    publishedYear: 1864,
    notes:
      "Cited for the first dated description of Aido-Hwedo ('Aydo-whe-do, commonly called Danh, the Heavenly Snake ... is the rainbow') as quoted in the vodun-diaspora record aido-hwedo-the-rainbow-serpent, where it was read; not re-read in this session. VIEWPOINT: a British consul and prolific, opinionated observer.",
  },
  {
    key: "blier_1995_african_vodun",
    title: "African Vodun: Art, Psychology, and Power",
    author: "Suzanne Preston Blier",
    publisher: "University of Chicago Press, Chicago",
    publishedYear: 1995,
    sourceType: "academic_book",
    reference: "Suzanne Preston Blier, African Vodun: Art, Psychology, and Power. Chicago: University of Chicago Press, 1995.",
    notes:
      "Cited as context for the definition of vodun as many locally served powers rather than one theology (Norman 2014 relies on it for the same point). Not read in this session; no page-specific claim rests on it.",
  },
  {
    key: "etonnants_voyageurs_origines_vaudou",
    title: "Les origines africaines du vaudou",
    author: "Unsigned essay, Étonnants Voyageurs festival website",
    url: "https://www.etonnants-voyageurs.com/Les-origines-africaines-du-vaudou.html",
    sourceType: "website",
    notes:
      "Read in this session. Cited ONLY as the place where the tradition that the Dahomeans came to know 'Dan Aïdo Hwèdo' as a Mahi vodun 'particulier à la tribu des Djinou (gens d'en haut, tombés du ciel)' was found, inside quotation marks from an earlier writer it does not name. A popular essay; the original ethnographer is unidentified. NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "albert_kahn_dahomey_1930",
    title: "Archives de la Planète: autochromes of Dahomey by Frédéric Gadmer, January–May 1930",
    author: "Frédéric Gadmer (photographer); Musée départemental Albert-Kahn",
    publisher: "Musée départemental Albert-Kahn, Boulogne-Billancourt; on Wikimedia Commons under CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:Case_du_f%C3%A9tiche_Dan_-_A63204S.jpg",
    sourceType: "museum",
    publishedYear: 1930,
    notes:
      "Cited as dated photographic documentation with the mission's original captions: 'Case du fétiche Dan' at Porto-Novo (15 January 1930, A63204S), 'Le Chef féticheur du Serpent (dagbé)' at Porto-Novo (24 January 1930, A63271), an altar 'chez le féticheur du Serpent' at Porto-Novo (10 May 1930, A64238S) and the 'Temple du Serpent' at Ouidah (2 May 1930, A64056S). VIEWPOINT: a French colonial-era documentary mission; the captions are its own.",
  },
  {
    key: "fr_wikipedia_temple_des_pythons",
    title: "Temple des Pythons",
    author: "Wikipédia contributors (French)",
    url: "https://fr.wikipedia.org/wiki/Temple_des_Pythons",
    sourceType: "wikipedia",
    notes:
      "Read in this session. Cited for the present temple's layout (a truncated-cone building of about 12 m² housing the pythons, a round thatched hut, the sacred white jar or zingbin and its seven-yearly rite with 41 women, the iroko), for the observation that the coronation plate shows the serpent's hut in the centre, and as a pointer to Labat's Braguez passage and to Sinou (1991). A tertiary source drawing on Beninese press, a tourism office and Sinou; its modern details are practitioner and press accounts, not ethnography.",
  },
  {
    key: "ouidah_python_temple_tradition",
    title: "Traditions and practice at the Temple of Pythons (Dangbexwe), Ouidah, as presented to visitors and the press",
    reference: "As reported in Beninese press and summarised by the French Wikipedia article 'Temple des Pythons' (accessed in this session)",
    sourceType: "oral_tradition",
    notes:
      "WHAT THIS ENTRY IS: the custodians' and devotees' own accounts of the temple's rites, as they reach outsiders. Cited whenever a record states a present-day practice (the weekly release of the pythons, the seven-yearly rite of the sacred jar, the women chosen for it). A practitioner account recorded as such, not a historical document.",
  },
];

// ---------------------------------------------------------------------------
// Pictures (every Commons file page fetched in this session; licences as stated)
// ---------------------------------------------------------------------------

const PD = "Public domain (Creative Commons Public Domain Mark 1.0)";
const PD_FR = "Public domain (France: author died more than 70 years ago; US: published before 1931; PD-1923)";
const BYSA4 = "CC BY-SA 4.0";
const KAHN = "Musée départemental Albert-Kahn, Boulogne-Billancourt";

const pCoronationPlate = commonsPicture({
  fileName: "Labat CourOuidah 1725 B002.png",
  caption:
    "'Couronnement du Roy de Juda à la coste de Guinée au Mois d'Avril 1725': the eighteenth-century engraving printed in 1730 in Labat's Voyage du chevalier Des Marchais (vol. 2, facing p. 70). An engraving made in Paris after Des Marchais's drawing, not a photograph. Its title says April 1725; the text it illustrates dates the coronation Des Marchais attended to April 1715.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD,
  creator: "J.-B. Labat (?) after the Chevalier Des Marchais",
  objectDate: "drawn 1715–1725; engraved and published 1730",
});

const pProcessionPlate = commonsPicture({
  fileName: "Procession au grand serpent pour le couronnement du roy de Juda fait le 15 avril 1725 - par le R. père Labat - btv1b8595595j.jpg",
  caption:
    "'Procession au grand Serpent pour le Couronnement du Roy de Juda fait le 15 Avril 1725' (Tome 2, page 194), an eighteenth-century engraving from Labat's 1730 book, here on a Bibliothèque nationale sheet (GE DD-2987 (8235)) that also carries two unrelated plates (a coffee branch and a sugar furnace). Its key labels the musketeers, trumpets, drums and flutes, the king's wives carrying presents, the king's dwarfs, the king's mother (4), the grand sacrificateur (7) and 'D. Mosquée du Grand Serpent'. An engraver's composition after Des Marchais, not a photograph: it sets the serpent's house within sight of ships at anchor, though the text places it half a league west of Savi, some 7 km inland.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD_FR,
  creator: "Jean-Baptiste Labat (publisher), after Renaud Des Marchais",
  institution: "Bibliothèque nationale de France, Cartes et plans, GE DD-2987 (8235)",
  objectDate: "1730",
});

const pKroenung = commonsPicture({
  fileName: "Kroenung des Koeniges von Juida im April 1725, aus dem Des Marchais, XVIII secolo – BEIC IE8997996.jpg",
  caption:
    "'Krönung des Königes von Juida im April 1725, aus dem Des Marchais': an eighteenth-century German-titled print copying Labat's coronation plate, held by the library of the Museo di Storia naturale, Milan (digitised by BEIC). A later reproduction of the same composition, not independent evidence.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD,
  creator: "Unknown engraver after Des Marchais",
  institution: "Biblioteca del Museo di Storia naturale e dell'Acquario civico di Milano (via BEIC)",
  objectDate: "18th century",
  duplicateOf: "Labat CourOuidah 1725 B002.png",
});

const pPalacePlan = commonsPicture({
  fileName: "Plan du palais du roy à Xavier ou Sabi dans le royaume de Whidah - tiré de Marchais - btv1b85955929.jpg",
  caption:
    "'Plan du palais du roy à Xavier ou Sabi dans le royaume de Whidah, tiré de Marchais': an eighteenth-century plan of the Hueda king's palace at Savi, printed in 1747 after Des Marchais. A European plan drawn without survey instruments that the archaeology has since tested; it shows no ditch system.",
  shows: "map",
  identificationStatus: "secure",
  licence: PD_FR,
  creator: "Renaud Des Marchais (cartographer)",
  institution: "Bibliothèque nationale de France, Cartes et plans, GE DD-2987 (8232)",
  objectDate: "1747",
});

const pKingdomMap = commonsPicture({
  fileName: "Carte du royaume de Whidah - (des Marchais) - btv1b8595588d.jpg",
  caption:
    "'Carte du royaume de Whidah', the Hueda kingdom after Des Marchais, printed in 1747: Savi ('Xavier'), the coastal lagoon, the beach and the forts. An eighteenth-century European map.",
  shows: "map",
  identificationStatus: "secure",
  licence: PD_FR,
  creator: "Renaud Des Marchais (cartographer)",
  institution: "Bibliothèque nationale de France, Cartes et plans, GE DD-2987 (8228)",
  objectDate: "1747",
});

const pBirdsEye = commonsPicture({
  fileName: "AMH-7949-KB Bird's eye view of the kingdom of Whidah or Juida.jpg",
  caption:
    "'Carte du Royaume de Juida, ou Whidah, tirée de des Marchais': a bird's-eye engraving of the Hueda kingdom directed by Jacobus van der Schley for Pierre d'Hondt's Dutch-French collection of voyages, 1747. An eighteenth-century reworking of Des Marchais's map, one step further from the eyewitness.",
  shows: "map",
  identificationStatus: "secure",
  licence: PD,
  creator: "Jacobus van der Schley (direxit); Pierre d'Hondt (publisher)",
  institution: "Koninklijke Bibliotheek, The Hague (693 C 6 dl V, after p. 364), via the Atlas of Mutual Heritage",
  objectDate: "1747",
});

const pSlaveCoast1789 = commonsPicture({
  fileName: "Map of Slave Coast-1789.jpg",
  caption:
    "Robert Norris's map of the Slave Coast from his Memoirs of the Reign of Bossa Ahádee, King of Dahomy (1789): Dahomey, Whydah and the coast sixty years after the conquest of Savi. An eighteenth-century English slave-trader's map.",
  shows: "map",
  identificationStatus: "secure",
  licence: PD,
  creator: "Robert Norris",
  objectDate: "1789",
});

const pWhydah1745 = commonsPicture({
  fileName: "Whydah in 1745.jpg",
  caption:
    "'Whydah in 1745', plate 9 of vol. 3 of Thomas Astley's New General Collection of Voyages and Travels (London, 1745–47): an eighteenth-century English compilation engraving that merged earlier travellers' material, including Des Marchais's.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD,
  creator: "Thomas Astley (editor)",
  objectDate: "1745",
});

const pGbeMap = commonsPicture({
  fileName: "Gbe languages.png",
  caption:
    "Map of the distribution of the Gbe languages (Ewe, Gen, Aja, Fon, Gun, Xwla, Xweda and others) from the Volta to the Ouémé, drawn by Mark Dingemanse in 2004 after Capo (1988, 1991). A modern linguistic map: it shows languages, not the distribution of any cult.",
  shows: "map",
  identificationStatus: "secure",
  licence: "CC BY 2.5",
  creator: "Mark Dingemanse",
  objectDate: "2004",
});

const pSlaveCoastStates = commonsPicture({
  fileName: "Slave Coast map.png",
  caption:
    "A modern map of the states of the Slave Coast (drawn 2017), placing Allada, Hueda, Dahomey and their neighbours. A modern reconstruction map; its boundaries are approximate.",
  shows: "map",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Maattik",
  objectDate: "2017",
});

const pTempleToday = commonsPicture({
  fileName: "Le Temple des Pythons de Ouidah.jpg",
  caption:
    "The Temple of Pythons (Dangbexwe) at Ouidah, photographed on 17 September 2019: the temple of Dangbé, the python vodun of the Hueda, as it stands today opposite the Catholic basilica.",
  shows: "site",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Rachad sanoussi",
  objectDate: "2019",
});

const pTempleEntrance = commonsPicture({
  fileName: "Entrée du Temple des Pythons (Ouidah).jpg",
  caption: "The entrance to the Temple of Pythons, Ouidah, photographed on 13 March 2017.",
  shows: "site",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Ji-Elle",
  objectDate: "2017",
});

const pRoundHut = commonsPicture({
  fileName: "Ouidah-Temple des Pythons-Petite case ronde (1).jpg",
  caption:
    "One of the two small round huts in the first court of the Temple of Pythons, Ouidah, photographed on 13 March 2017. A modern photograph of the present building; whether it continues the form of an eighteenth-century shrine is not established.",
  shows: "site",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Ji-Elle",
  objectDate: "2017",
});

const pAltar = commonsPicture({
  fileName: "Ouidah-Temple des Pythons-Autel sacrificiel (1).jpg",
  caption:
    "The sacrificial altar at the Temple of Pythons, Ouidah, photographed on 13 March 2017, with yellow palm oil and white millet flour among the offerings, according to the photographer's description.",
  shows: "site",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Ji-Elle",
  objectDate: "2017",
});

const pRoyalPythons = commonsPicture({
  fileName: "Pythons royaux à Ouidah (1).jpg",
  caption: "Royal pythons (Python regius) at the Temple of Pythons, Ouidah, photographed on 13 March 2017: the species venerated as Dangbé.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Ji-Elle",
  objectDate: "2017",
});

const pPythonRoyal = commonsPicture({
  fileName: "Python royal.jpg",
  caption: "A royal python at the python temple in Ouidah, photographed on 7 April 2019.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Padonou Dotou",
  objectDate: "2019",
});

const pDangbeXo = commonsPicture({
  fileName: "Dangbe xɔ kɔn (temple de Python).jpg",
  caption:
    "'Dangbe xɔ kɔn' (temple de Python), the python temple at Ouidah facing the Basilica of the Immaculate Conception, photographed in May 2024. A modern photograph of the place where Dangbé is served today; it does not show any hymn or rite.",
  shows: "site",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Gbehlon",
  objectDate: "2024",
});

const pDagbeDre = commonsPicture({
  fileName: "Dagbe Dre (python femelle) au temple des pythons Ouidah.jpg",
  caption: "'Dagbe Dre' (female python) at the Temple of Pythons, Ouidah, photographed on 20 January 2019, with the local name for the female royal python.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Rachad sanoussi",
  objectDate: "2019",
});

const pTemple1900 = commonsPicture({
  fileName: "Temple des serpents whydah.jpg",
  caption: "'Temple des Serpents, Whydah, circa 1900': a photograph from the archives of the Société des Missions Africaines, the Catholic mission at Ouidah.",
  shows: "site",
  identificationStatus: "secure",
  licence: "Public domain (PD-old-70; Creative Commons Public Domain Mark 1.0)",
  creator: "Unknown photographer (Société des Missions Africaines)",
  objectDate: "c. 1900",
});

const pTempleInterior1863 = commonsPicture({
  fileName: "Le Tour du monde-07-p065.jpg",
  caption:
    "'Intérieur du temple des Serpents, à Wydah', a wood engraving by Valentin Foulquier in Le Tour du monde, vol. 7 (1863). A nineteenth-century illustration drawn after a traveller's sketches, not a photograph.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD,
  creator: "Valentin Foulquier",
  objectDate: "1863",
});

const pKahnTemple = commonsPicture({
  fileName: "Le temple des Serpents ou temple des Pythons - A64056S.jpg",
  caption: "'Dahomey, Ouidah, Temple du Serpent': an autochrome by Frédéric Gadmer of 2 May 1930, from the Archives de la Planète.",
  shows: "site",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A64056S",
  objectDate: "1930",
});

const pKahnDanHouse = commonsPicture({
  fileName: "Case du fétiche Dan - A63204S.jpg",
  caption: "'Dahomey, Porto Novo, Case du fétiche Dan': a house of the vodun Dan at Porto-Novo, in an autochrome by Frédéric Gadmer of 15 January 1930.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A63204S",
  objectDate: "1930",
});

const pKahnSerpentPriest = commonsPicture({
  fileName: "Le chef féticheur du Serpent, prêtre au culte de Dangbé - A63271.jpg",
  caption:
    "'Dahomey, Porto-Novo, Le Chef féticheur du Serpent (dagbé)': the chief priest of the serpent at Porto-Novo, in an autochrome by Frédéric Gadmer of 24 January 1930. The 1930 caption itself names the cult 'dagbé', at Porto-Novo, 40 km east of Ouidah.",
  shows: "portrait",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A63271",
  objectDate: "1930",
});

const pKahnSerpentAltar = commonsPicture({
  fileName: "Autels chez le féticheur du Serpent - A64238S.jpg",
  caption: "'Dahomey, Porto-Novo, Chez le féticheur du Serpent – Autel fétichiste': altars at the serpent priest's house in Porto-Novo, autochrome by Frédéric Gadmer, 10 May 1930.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: BYSA4,
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A64238S",
  objectDate: "1930",
});

const pJeunePretresse = commonsPicture({
  fileName: "Jeune Pretresse de Juida - Mœurs, loix et costumes des habitans de la Côte des Esclaves, ca. 1788.jpg",
  caption:
    "UNVERIFIED — 'Jeune Prêtresse de Juida', an engraving drawn by Jacques Grasset de Saint-Sauveur and engraved by J. Laroque for a costume book of about 1788. What is unverified: that the artist ever saw a Hueda priestess or worked from a drawing made on the coast; Paris costume books were compiled from earlier texts. It shows a European picture of a serpent devotee, sixty years after Hueda fell.",
  shows: "engraving",
  identificationStatus: "unverified",
  licence: PD,
  creator: "Jacques Grasset de Saint-Sauveur (drawing); J. Laroque (engraving)",
  institution: "African Studies Centre, Leiden",
  objectDate: "c. 1788",
});

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

const events: SeedEvent[] = [
  // =========================================================================
  // 1. THE ANCHOR
  // =========================================================================
  {
    slug: ANCHOR,
    title: "Dan, Dangbé and Aido-Hwedo: three serpent powers of the Gbe coast, and where each is served",
    summary:
      "Dan is a family of serpent vodun served across the Gbe-speaking world; Dangbé is the living python of the Hueda at Savi and Ouidah; Aido-Hwedo is the rainbow serpent of Fon cosmology. They overlap in name and image, but differ in place, history, ritual and what they are for.",
    description:
      "WHY THIS LANE STARTS BY SEPARATING THEM. Every comparison in this track that reaches West Africa, whether with the tribe of Dan, Wadjet, Nehushtan or Apedemak, depends on knowing which Gbe serpent is being compared. Popular writing merges three different powers into one 'Dan', and then compares the merged figure with something else. This record keeps them apart, and the rest of the lane follows them one at a time.\n\n" +
      "DAN (Da, Danh). A family of serpent vodun, not one god. In the Abomey ethnography of 1931 (Herskovits, published 1938) 'Da' names powers of movement, continuity and wealth, with forms served by individuals, lineages and villages; among them Dambada Hwedo stands for the forgotten ancestors of a lineage, and Aido Hwedo has its own house in the ancestral cult. Dan shrines are documented far from Ouidah: a 'case du fétiche Dan' was photographed at Porto-Novo in January 1930. WHERE SERVED: across the Gbe world, at Abomey, Porto-Novo, Ouidah and in the Mahi country, by lineages as well as by priests. benin-vodun's record 'Dan: the serpent, movement and continuity' gives the outline; this lane does not repeat it.\n\n" +
      "DANGBÉ (Dagbe, Danhgbwe). The living royal python (Python regius) of the Hueda kingdom, its senior or tutelary vodun, with a principal house near Savi before 1727 and the Temple of Pythons at Ouidah today. It is a particular cult with a datable written history from Bosman (published 1704–05) onward: priests, initiated women, processions, penalties for killing a python. It entered Dahomey's religious world by conquest after 1727. Its name contains 'dan' (snake), and the python is one of the snakes the word covers, but Dangbé is a Hueda institution, not the Dan of every lineage. WHERE SERVED: Ouidah above all; also, by 1930, Porto-Novo, whose 'chef féticheur du Serpent (dagbé)' Gadmer photographed; and, according to Norman (2014), at a temple in the palace complex at Abomey.\n\n" +
      "AIDO-HWEDO. The rainbow and cosmic serpent: in Burton's list (1864) 'Aydo-whe-do, commonly called Danh, the Heavenly Snake ... is the rainbow'; in the Abomey myths the serpent that carried the creator and now lies coiled beneath the earth. It is a figure of cosmology and of the lineage cult, not a living animal kept in a temple. WHERE SERVED: as a shrine of pots or a clay coiled serpent in lineage compounds, and as a name carried to Haiti as Ayida Wedo. The vodun-diaspora record 'Aido-Hwedo: the rainbow serpent who carried the creator' gives the cosmology.\n\n" +
      "HOW THEY DIFFER, IN ONE LINE EACH. Dangbé is a living python cult of one kingdom with a court, priests and politics. Dan is a category of serpent powers served by lineages and individuals throughout the Gbe area. Aido-Hwedo is the rainbow and world-serpent within that category. Informants used 'Danh' for more than one of them, so the boundaries are partly theirs and partly the ethnographers' system-making.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that Hueda served a living python as its senior god by the 1690s, and that serpent vodun called Dan were served across the Gbe region in the nineteenth and twentieth centuries. It does NOT establish when any of these cults began, whether Dangbé grew out of a wider Dan cult or the reverse, or that the three were ever one god. Nor does the shared syllable 'dan' connect any of them to the biblical tribe of Dan: that question is weighed in the words lane and the assessment, not assumed here.",
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: dan (vodun)", "figure: dangbe", "figure: aido-hwedo", "theme: names and words", "place: savi and ouidah", "theme: living sacred animals"], "lane overview"),
    people: ["Dan", "Dangbé", "Aido-Hwedo", "Dambada Hwedo"],
    civilisations: ["Hueda", "Fon", "Gbe-speaking peoples"],
    locationName: "The Gbe-speaking coast of Bénin and Togo",
    lat: 6.6,
    lng: 2.1,
    claims: [
      {
        sourceKey: "bosman_1705_guinea",
        citations: [
          { sourceKey: "norman_2014_pythons_pigs", relation: "supports", note: "Identifies the venerated snake as Python regius and calls Dangbe the kingdom's principal vodun." },
        ],
        startYear: 1704,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first printed description of the Hueda python cult (Dangbé)",
        originalDateText: "Bosman's Dutch edition of 1704: the snake as the first god of Fida",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Bosman's letters from the 1690s, printed in 1704 (Dutch) and 1705 (English). Dates the earliest description of Dangbé, not the cult's beginning; the cult was already fully developed.",
      },
      {
        sourceKey: "burton_1864_mission_gelele",
        citations: [
          { sourceKey: "herskovits_1938_dahomey", relation: "supports", note: "Records Aido Hwedo and Dambada Hwedo as forms of Da in the Abomey lineage cult of 1931." },
        ],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first dated description of Aido-Hwedo as the rainbow, 'commonly called Danh'",
        originalDateText: "Aydo-whe-do, commonly called Danh, the Heavenly Snake ... is the rainbow",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Burton's list of Dahomean gods (1864), as quoted in the vodun-diaspora record that read it. Dates a description at the Dahomean court; it says nothing about how old the figure is.",
      },
      {
        sourceKey: "herskovits_1938_dahomey",
        citations: [
          { sourceKey: "blier_1995_african_vodun", relation: "context", note: "Vodun as many locally served powers rather than one system; context only." },
        ],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The age of the Dan family of serpent vodun",
        originalDateText: "No date: Dan cults are older than any record of them",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. The lineage cults of Dan are known from ethnography of 1931 and later and from what lineages say of themselves. No document or excavation dates their beginning, so no year is given.",
      },
    ],
    media: [pTempleToday, pKahnDanHouse, pGbeMap],
  },

  // =========================================================================
  // 2. THE ARCHAEOLOGY OF SAVI
  // =========================================================================
  {
    slug: "savi-hueda-archaeological-project-1991-2010",
    title: "Digging Savi: the Hueda palace, its ditches and its countryside, 1991–2010",
    summary:
      "From 1991 Kenneth Kelly's Hueda Archaeological Project surveyed and excavated the royal town of Savi, and from 2002 Neil Norman surveyed its countryside. They found a palace district of about 1.5 by 1 km, a ditch system up to 8 m deep and 30 m wide, and the burned layer of 1727.",
    description:
      "WHAT THIS RECORD ADDS. benin-atlantic's 'Savi: excavating an Atlantic-era African capital' names the site but, by its own account, cites no excavation report. This record gives the reports. It is about WHAT WAS DUG, measured and dated. The interpretation of the ditches as a serpent is a separate record.\n\n" +
      "THE FIELDWORK. Kenneth G. Kelly (then UCLA, later South Carolina) began the Hueda Archaeological Project at Savi in 1991. By 1999 it had completed six seasons. It surveyed the site to fix its dimensions, excavated places believed to be townsfolk's houses, discovered and mapped part of a large ditch system, and from 1994 concentrated on the elite district and palace complex (Kelly, Brunache and Norman 1999). Kelly's 1995 dissertation and a 1997 World Archaeology article report the palace and the European trading lodges. From 2002 to 2010 Neil Norman surveyed and excavated the countryside and the regional centres around the palace (Norman 2014).\n\n" +
      "WHAT WAS FOUND. The palace district stretches about 1.5 by 1 km, about 7 km from the sea beside Lake Toho. The wider settlement covers some 100 km², with four dense concentrations interpreted as the compounds of regional leaders, and villages of farmers and artisans. Buildings were of rammed clay, some with walls nearly a metre thick, surviving as low mounds. European trade goods (Dutch pipes with maker's marks, case-gin bottles) run from the early seventeenth to the early eighteenth century and lie beneath a common layer of burned material: the sack of Savi by Dahomey in March 1727. Household shrines held human skulls set on incised bowls or in jars with imported goods, and offering caches lay in walls and under floors.\n\n" +
      "THE DITCHES, AS EXCAVATED. Identified in 1994 and mapped in 1996, the ditch system around the elite district has sections up to 8 m deep and 30 m wide. In 1999 clearing exposed a 70 m segment and a causeway into the inner district, with a double-lobed mound across it that the excavators read as a gatehouse controlling access; further branches enclose adjacent areas. The 1999 report notes that no contemporary European account describes any ditch system at Savi. Smaller, non-contiguous ditches, dug as clay borrow pits, surround house compounds and villages throughout the countryside.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a large planned royal centre, occupied through the seventeenth century and destroyed by fire in 1727, with monumental ditches restricting access to the elite district. It does NOT by itself establish what the ditches meant: their size and the absence of any written mention are facts, the serpent reading is an interpretation (next record). No excavation of the principal python temple is reported in the sources reached here. Radiocarbon dates and final site reports were not reached; the chronology rests on imported goods and the documented date of the conquest. IMAGE GAP: excavation plans and ditch photographs — the palace-district map is Figure 2 of the 1999 field report (https://static1.squarespace.com/static/5bd0e66f8d97400eb0099556/t/5bdb0337c2241bcd3a05d695/1541079865884/Nyame+Akuma+Issue+052-Article+02.pdf); the Savi region and Locus 2 excavations are Figures 14.2–14.4 of Norman 2014 (https://read.upcolorado.com/read/animals-and-inequality-in-the-ancient-world/section/519f78d2-12b8-4cfd-ad21-97b8e1d432cb). Neither is on Commons with a free licence; the pictures here are the eighteenth-century plan and maps the excavators tested.",
    category: "archaeology",
    subcategory: SUB,
    eventType: "archaeological_interpretation",
    evidenceStatus: "verified_physical_remains",
    tags: serpentTags(LANE, ["place: savi and ouidah", "theme: sacred landscape", "theme: kingship"], "excavation", "ditches"),
    people: ["Kenneth G. Kelly", "Neil L. Norman", "Peggy Brunache"],
    civilisations: ["Hueda", "Dahomey"],
    locationName: "Savi, Ouidah commune, Bénin",
    lat: 6.43,
    lng: 2.07,
    claims: [
      {
        sourceKey: "kelly_brunache_norman_1999_savi_fieldwork",
        citations: [
          { sourceKey: "norman_2014_pythons_pigs", relation: "supports", note: "Summarises Kelly's survey of the palace and Norman's own countryside work of 2002–2010." },
        ],
        startYear: 1991,
        endYear: 2010,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "The archaeological fieldwork at Savi, from the project's inception to the end of Norman's survey",
        originalDateText: "Since its inception in 1991, the project has surveyed the site",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The excavators' field report (1999) and Norman's chapter (2014) date the fieldwork itself. These are dates of research, not of the site.",
      },
      {
        sourceKey: "norman_2014_pythons_pigs",
        citations: [
          { sourceKey: "kelly_brunache_norman_1999_savi_fieldwork", relation: "supports", note: "Reports the burned destruction layer in palace structures and dated imported pipes and bottles." },
          { sourceKey: "law_1991_slave_coast", relation: "context", note: "The documentary date of the Dahomean sack of Savi, March 1727." },
        ],
        startYear: 1600,
        endYear: 1727,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The occupation of the Savi palace complex, from its coalescence to its burning",
        originalDateText: "coalesced as a densely settled urban center in the early seventeenth century and collapsed spectacularly in the early eighteenth century",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. Imported trade goods give the occupation span; a burn layer is tied to the documented conquest of 1727. The start is approximate and the end precise because a document dates it.",
      },
    ],
    media: [pPalacePlan, pKingdomMap, pBirdsEye],
  },

  // =========================================================================
  // 3. THE SERPENT DITCH ARGUMENT
  // =========================================================================
  {
    slug: "savi-serpent-ditch-argument",
    title: "The serpent ditch: Norman and Kelly's reading of Savi's earthworks (2004)",
    summary:
      "In 2004 Neil Norman and Kenneth Kelly argued that the huge ditches of Hueda and Dahomey were not the forts Europeans assumed, but built landscape that referred to cosmology, the python and the rainbow serpent. It is an archaeological interpretation, kept apart here from the excavated facts.",
    description:
      "THE ARGUMENT, IN THE AUTHORS' ABSTRACT. Norman and Kelly analysed 'a series of massive ditches (c. 17th–19th centuries A.D.) in southern Bénin'. European travellers described such features 'through tropes and terminology that ascribe Western military designs and exploits'. Drawing on archaeological and anthropological data, the authors argue instead 'that groups from the West African kingdoms of Hueda and Dahomey used the built landscape to reference cosmological factors, in attempts to negotiate and shape the political landscape of the region' (American Anthropologist 106: 98–110).\n\n" +
      "THE SERPENT AND THE RAINBOW. The title pairs a 'serpent ditch' with 'the rainbow'. As Norman later summarised the argument (2014): Huedans today associate ditches with pythons, because ditches share the python's aesthetic. They are cool, damp, full of vermin, and from the surface they trace a sinuous line that bends movement around their voids, as do a python, a strip of white cloth in the wind or a cord laid on the ground. So ditches that evoke the python and restrict movement protect those inside a compound from the uncertainty outside, 'much like a coiled snake'. Secondary summaries reached in this session add two points: a Fon collaborator reluctant to measure a ditch because it evoked Dangbé, and Dahomey's adoption of ditches around its palace at Abomey in the early eighteenth century. How the article uses the rainbow serpent (Dan Aido-Hwedo) is not known here: the full text was not reached. NEEDS SOURCE VERIFICATION.\n\n" +
      "WHAT IS ARCHAEOLOGY AND WHAT IS INTERPRETATION. ARCHAEOLOGY: the ditches exist; some are 8 m deep and 30 m wide; they enclose the elite district with a controlled causeway; no European account of Savi mentions them (Kelly, Brunache and Norman 1999). INTERPRETATION: that they meant a serpent. Two lines of evidence support it, both later than the ditches. One is present-day Fon and Hueda association of ditches with pythons. The other is the general place of Dan, the python and the rainbow in Gbe cosmology. The excavators had already proposed, before the serpent reading, that the ditches were 'socially symbolic landscape features' marking the elite district, because no record supports a defensive purpose.\n\n" +
      "COUNTER-CONSIDERATIONS. Ditches dug as clay pits are a practical by-product of building in rammed earth; boundary ditches enclose towns elsewhere in West Africa (Notsé, Benin City's walls) without a serpent reading. And a modern association is not proof of an eighteenth-century meaning. Absence from European accounts may mean the ditches were unremarkable to visitors rather than secret. The authors know these objections; the article's answer to them was not reached.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that the serpent reading is a published, peer-reviewed interpretation by the excavators, resting on excavation plus ethnography. It does NOT establish that eighteenth-century Huedans conceived the ditches as Dangbé or as the rainbow; no document from the period says so. And it says nothing about Egypt, Kush or Israel. The comparison with Nile Valley enclosures belongs to the rituals and assessment lanes, which link here. IMAGE GAP: photographs or survey drawings of the Savi ditches — in Kelly, Brunache and Norman 1999, Figure 2 (URL in the sources) and in the 2004 article (https://doi.org/10.1525/aa.2004.106.1.98); none on Commons with a free licence.",
    category: "archaeology",
    subcategory: SUB,
    eventType: "archaeological_interpretation",
    identificationStatus: "modern_interpretation",
    tags: serpentTags(LANE, ["theme: sacred landscape", "figure: dangbe", "figure: aido-hwedo", "place: savi and ouidah", "theme: kingship"], "ditches", "interpretation"),
    people: ["Neil L. Norman", "Kenneth G. Kelly", "Dangbé", "Aido-Hwedo"],
    civilisations: ["Hueda", "Dahomey"],
    locationName: "Savi, Bénin (and Abomey)",
    lat: 6.43,
    lng: 2.07,
    claims: [
      {
        sourceKey: "norman_kelly_2004_landscape_politics",
        citations: [
          { sourceKey: "norman_2014_pythons_pigs", relation: "supports", note: "Restates the argument: ditches evoke the python and protect the interior of compounds." },
        ],
        startYear: 2004,
        startMonth: 3,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of the serpent-ditch interpretation",
        originalDateText: "groups from the West African kingdoms of Hueda and Dahomey used the built landscape to reference cosmological factors",
        datingMethod: "historical_record",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Dates the argument, not the ditches. The abstract was read; the body of the article was not.",
      },
      {
        sourceKey: "kelly_brunache_norman_1999_savi_fieldwork",
        citations: [
          { sourceKey: "norman_kelly_2004_landscape_politics", relation: "context", note: "Dates the ditch features they analyse to c. 17th–19th centuries across Hueda and Dahomey." },
        ],
        startYear: 1650,
        endYear: 1727,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The use of the Savi palace ditch system, ending with the destruction of 1727",
        originalDateText: "ditch system that surrounds the elite palace district",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. The ditches enclose structures with seventeenth- and early-eighteenth-century trade goods and the 1727 burn layer. When they were first dug is not reported in the sources reached; the range follows Norman's 'Hueda era' of c. 1650–1727.",
      },
    ],
    media: [pPalacePlan, pSlaveCoast1789],
  },

  // =========================================================================
  // 4. THE DATE OF THE CORONATION
  // =========================================================================
  {
    slug: "hueda-coronation-1715-or-1725",
    title: "Crowned in 1715 or 1725? Labat's text and Des Marchais's plates disagree",
    summary:
      "The engraved plates in Labat's 1730 book date a Hueda coronation and its procession to April 1725, the year of Des Marchais's last voyage. Labat's own text says the king 'now reigning' was crowned in April 1715, with Des Marchais present. King Huffon had succeeded in 1708; Labat says crownings could wait up to seven years.",
    description:
      "WHY THIS MATTERS. The existing record 'April 1725: a Hueda coronation and the processions to the serpent's house' takes the plate's date and marks it NEEDS SOURCE VERIFICATION, noting that Huffon had reigned since about 1708. Reading Labat's text closely resolves part of the puzzle and opens another. The research request's 'c. 1713–1715' turns out to rest on the text.\n\n" +
      "WHAT THE TEXT SAYS. In vol. 2, ch. 5 ('Des Rois de Juda'), Labat writes that the grand sacrificateur was reasonable 'au couronnement d'Amar [OCR unclear], Roi de Juda à présent régnant, qui fut couronné au mois d'Avril de l'année 1715, en présence du sieur Derigouin, Directeur général de la Compagnie de France, du Chevalier des M*** & de plusieurs autres Officiers François'. Describing the seating at the ceremony: 'Le Directeur François, c'étoit en 1715 le sieur Derigouin, occupoit la première place'. Elsewhere: Des Marchais 'fut témoin' of an execution 'en 1715, peu de tems après le couronnement du Roi à présent régnant'. The procession chapter says only that it took place 'le 15 Avril', without a year.\n\n" +
      "WHAT THE PLATES SAY. 'Couronnement du Roy de Juda ... au Mois d'Avril 1725' and 'Procession au grand Serpent pour le Couronnement du Roy de Juda fait le 15 Avril 1725'. The book's title page announces the voyage of 1725–27, and Des Marchais's ship was on the coast in 1725. A print dealer and French Wikipedia report a van der Schley re-engraving (1748) captioned April 1723. NEEDS SOURCE VERIFICATION.\n\n" +
      "HOW A DELAY FITS. Labat says a new king is not crowned at once: 'il se passe bien des mois et souvent des années', the grandees delaying it for their own interests, 'jusqu'à sept ans', the longest they may. A king who succeeded in 1708 (the date modern historians give for Huffon's accession) and was crowned in 1715 fits that rule exactly. A crowning in 1725 would not, since seventeen years exceeds seven.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that the 1725 date is the plates', and that the text dates the coronation Des Marchais attended to April 1715. The two most likely explanations are that the engraver dated the plates by the voyage the book was named for, or that Des Marchais saw a later ceremony. It does NOT establish which is right, nor whether the 1725 procession was a coronation at all. The 'some modern scholars' who argue for 1717–1718, according to Wikipedia's 'Haffon' article, are unnamed there; that position is unverified. Note also what changes if 1715 is right: the procession scene is two years after Huffon's accession was settled, and ten years before Dahomey's pressure on Hueda became acute.",
    category: "history",
    subcategory: SUB,
    eventType: "disputed",
    eventTypeNote: "The primary source contradicts itself between text and plates; modern accounts give 1725, 1717–1718 and c. 1715.",
    identificationStatus: "disputed",
    tags: serpentTags(LANE, ["theme: procession and coronation", "theme: kingship", "theme: manuscripts and their dates", "place: savi and ouidah", "figure: dangbe"], "huffon", "chronology"),
    people: ["Huffon (Haffon), king of Hueda", "Renaud Des Marchais", "Jean-Baptiste Labat", "Derigouin, director of the French Compagnie"],
    civilisations: ["Hueda", "French Compagnie des Indes"],
    locationName: "Savi, Bénin",
    lat: 6.43,
    lng: 2.07,
    argumentsFor:
      "FOR 1715: Labat's text gives the year three times, ties it to a named French director (Derigouin) and to a dated execution Des Marchais witnessed, and fits Labat's own rule that coronations followed accession by up to seven years (Huffon succeeded in 1708). Des Marchais travelled on the coast from 1704, so a 1715 presence is possible.",
    argumentsAgainst:
      "FOR 1725: both plates say April 1725, and the book presents the voyage of 1725–27; Des Marchais was certainly at Whydah in 1725, and his maps of the kingdom date from that visit. The OCR of the text is poor, and 'en 1715' could be a printer's error. Modern secondary accounts (Wikipedia, print dealers) repeat 1725. The 1717–1718 alternative has no named proponent in the sources reached.",
    genealogies: [
      {
        key: "hueda-coronation-date",
        claim: "King Huffon of Hueda was crowned at Savi in April 1725, as the Des Marchais plates say",
        verdict: "source_disputed",
        verdictEvidence:
          "The plates in Labat (1730) say April 1725; the text of the same volume says the reigning king was crowned in April 1715 in Des Marchais's presence. Secondary accounts follow the plates.",
        whatWouldChangeThis:
          "Des Marchais's surviving journals or the French Compagnie's correspondence from Juda for 1715 or 1725 (Derigouin's letters), or a clean reading of the 1730 and 1731 editions' text and plate captions side by side.",
        links: [
          {
            stage: "colonial_record",
            who: "Jean-Baptiste Labat, from Des Marchais's memoirs (text)",
            year: 1730,
            sourceKey: "des_marchais_labat_1730_voyage",
            reference: "vol. 2, ch. 5, pp. ~60–70",
            says: "qui fut couronné au mois d'Avril de l'année 1715, en présence du sieur Derigouin ... du Chevalier des M***",
            adds: "Dates the coronation to April 1715 and places Des Marchais there.",
            citationStatus: "verified",
          },
          {
            stage: "colonial_record",
            who: "The engraved plates in the same book",
            year: 1730,
            sourceKey: "des_marchais_labat_1730_voyage",
            reference: "vol. 2, plates facing pp. 70 and 194",
            says: "Procession au grand Serpent pour le Couronnement du Roy de Juda fait le 15 Avril 1725",
            adds: "Dates the coronation and procession to April 1725.",
            citationStatus: "verified",
          },
          {
            stage: "current_scholarship",
            who: "Wikipedia, 'Haffon' (citing Harms 2002 generally)",
            sourceKey: "wikipedia_haffon",
            says: "some modern scholars argue it happened in 1717–1718",
            adds: "A third date, with no named scholar.",
            citationStatus: "no_citation_given",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "law_1991_slave_coast",
        citations: [{ sourceKey: "wikipedia_haffon", relation: "supports", note: "Gives Haffon's accession as 1708." }],
        startYear: 1708,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Huffon's accession to the throne of Hueda",
        originalDateText: "Huffon succeeds as king of Hueda, 1708",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The accession year modern historians derive from European company records; Law's page not checked in this session. NEEDS SOURCE VERIFICATION for the documents behind it.",
      },
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        startYear: 1715,
        startMonth: 4,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The coronation of the reigning king of Juda, as dated in Labat's text",
        originalDateText: "qui fut couronné au mois d'Avril de l'année 1715",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Labat (1730) from Des Marchais's memoirs; the year recurs ('c'étoit en 1715 le sieur Derigouin'). Labat was not present; Des Marchais was, according to the text.",
      },
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        startYear: 1725,
        startMonth: 4,
        startDay: 15,
        datePrecision: "day",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The procession to the serpent's house for the coronation, as dated on the engraved plate",
        originalDateText: "fait le 15 Avril 1725",
        datingMethod: "historical_record",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: contemporary written. The plate caption (1730). It conflicts with the text of the same volume; the engraver may have dated it by the voyage the book was named after.",
      },
      {
        sourceKey: "wikipedia_haffon",
        startYear: 1717,
        endYear: 1718,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "An alternative modern dating of Huffon's coronation",
        originalDateText: "some modern scholars argue it happened in 1717–1718",
        datingMethod: "source_assertion",
        chronology: "alternative",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Stated without a named proponent in a tertiary source. NEEDS SOURCE VERIFICATION; possibly from Harms (2002) or Law (1991).",
      },
    ],
    media: [pCoronationPlate, pProcessionPlate, pKroenung],
  },

  // =========================================================================
  // 5. THE CORONATION RITE ITSELF
  // =========================================================================
  {
    slug: "hueda-coronation-rite-allada-crowner",
    title: "Crowned by a grandee of Allada: the Hueda coronation rite as Labat's text describes it",
    summary:
      "Labat's text describes a coronation, not just a procession. Grandees chose the date. The serpent's priest dictated the sacrifices. Royal wives carried a clay figure of a seated child. A hereditary Allada noble placed the helmet on the king and made the people swear fidelity. Gifts went out and came back richer. The rite ended at the serpent's house.",
    description:
      "WHAT THE EXISTING RECORDS COVER, AND WHAT THEY DO NOT. vodun-diaspora's coronation record covers the processions to the serpent's house. This record covers the CORONATION itself: delay, sacrifice, homage, crowning, oath and gifts, in the order Labat gives (vol. 2, ch. 5, pp. ~59–76, read in this session). It is Labat's compilation from Des Marchais's memoirs, and Labat was never in Hueda.\n\n" +
      "1. DELAY AND DISPUTE. The king is installed in the palace at once, but not crowned for months, often years, up to seven, 'les Grands en reglent le temps selon leurs intérêts particuliers'. Meanwhile government is more in the grandees' hands than the king's, and he may not set foot outside the palace. Succession was itself contested. The heir was the eldest son born AFTER the father's coronation, raised incognito in the province of Zingué; the reigning king was found guarding his foster-father's pigs. Labat adds that the grandees could pass over the eldest 'comme il est arrivé en 1715', and credits the French director Derigouin with putting the younger son on the throne, an intervention he calls unprecedented.\n\n" +
      "2. THE SERPENT'S ORDERS. When the grandees agree a date, a council meets and seventeen cannon announce it. Next morning the grand sacrificateur goes to the palace and orders the king, 'de la part du grand Serpent', what offerings to make. At the 1715 coronation an ox, a horse, a sheep and a hen were killed and laid on mats in the public square beside nine millet loaves rubbed with palm oil. The priest planted a pole with a cloth banner, and the bodies stayed until birds ate them, to the sound of drums, flutes and trumpets.\n\n" +
      "3. THE WIVES AND THE CLAY CHILD. Eighteen wives of the third rank came out two by two with the king's flutes, four drums and twenty soldiers, singing. The senior one walked last carrying a terracotta figure 'qui représente grossièrement un enfant assis', which she set down beside the victims.\n\n" +
      "4. HOMAGE, ALLADA AND THE OATH. For fifteen days the grandees prostrated themselves before the empty throne. Then an embassy fetched from Allada ('Ardres') a grandee whose family had the right, 'de tems immémorial', to crown the kings of Juda. He would not enter Savi until assured that Hueda had repaired the main gate of Allada's capital, as old treaties required. After forty days' lodging two leagues off and five days of processions by grandees and people to the serpent's house, the coronation took place at night on the sixth day. The king sat in the 'cour du couronnement' with forty wives at his left and Europeans at his right; two dwarfs praised his predecessor and urged him to surpass him. The Allada grandee lifted the gilded helmet, turned to the people and said three times: 'voilà votre Roi, soyez-lui fidèles, & vos prières seront écoutées du Roi d'Ardres mon maître'.\n\n" +
      "5. GIFTS. The king's regalia belonged by right to the crowner, who settled for a present and fifteen captives. Next day the king sent presents to every grandee, and each returned richer ones, which Labat reads as homage and tribute. Festivities ran fifteen more days and closed with the solemn procession to the serpent's house.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that by 1715–1725 a French account described Hueda kingship as completed in stages: by grandees, by the serpent's priest, by an Allada noble's oath formula, and by gifts. It is the most detailed early description of a Gbe coronation. It does NOT establish that every reign followed this pattern, and its numbers (17 cannon, 40 days, 15 captives) are Labat's from Des Marchais's notes. Nor is it independent of European framing: 'couronnement' and 'casque' are French words for what may have been a different act. Nothing in it resembles Egyptian or Kushite coronation as a sequence; the comparison lane weighs that.",
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: serpentTags(LANE, ["theme: procession and coronation", "theme: kingship", "theme: priesthood", "figure: dangbe", "place: savi and ouidah", "place: tado and allada"], "oath", "succession", "gift-exchange"),
    people: ["Huffon (Haffon), king of Hueda", "the grand sacrificateur of the serpent", "the hereditary crowner from Allada", "Derigouin", "Renaud Des Marchais", "Jean-Baptiste Labat"],
    civilisations: ["Hueda", "Allada"],
    locationName: "Savi (Xavier), capital of Hueda",
    lat: 6.43,
    lng: 2.07,
    passages: [
      {
        label: "The Allada grandee's words at the crowning",
        reference: "Labat, Voyage du chevalier Des Marchais, vol. 2 (1730), ch. 5, pp. ~73–74",
        sourceKey: "des_marchais_labat_1730_voyage",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "des_marchais_labat_1730_voyage",
            language: "fr",
            content: "Alors le Grand dit à haute voix : voilà votre Roi, soyez-lui fidèles, & vos prières seront écoutées du Roi d'Ardres mon maître. Il répète trois fois ces paroles & remet le casque sur la tête du Roi.",
            evidence: "Copied from the archive.org OCR of vol. 2, with spelling normalised where the OCR was garbled. The words are Labat's French rendering of what Des Marchais was told was said; the Gbe original is not recorded.",
          },
          {
            layer: "translation",
            sourceKey: null,
            language: "en",
            content: "Then the Grandee says aloud: here is your King, be faithful to him, and your prayers will be heard by the King of Ardres [Allada], my master. He repeats these words three times and puts the helmet back on the King's head.",
            evidence: "Translation made for this record.",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        citations: [
          { sourceKey: "law_1990_common_people_divided", relation: "context", note: "The grandees' power over the Hueda crown and factional succession, 1671–1727." },
          { sourceKey: "law_1991_slave_coast", relation: "context", note: "Hueda's tributary relationship to Allada, which the Allada crowner embodies." },
        ],
        startYear: 1715,
        startMonth: 4,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The coronation whose sacrifices and crowning Labat describes",
        originalDateText: "Il ne lui en coûta que la vie qu'à un boeuf, un cheval, un mouton & une poule",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Labat's text dates this coronation April 1715 (see the record on the date); compiled from Des Marchais's memoirs, printed 1730. Rule-like statements (delays, the Allada crowner) describe custom, not one event.",
      },
    ],
    media: [pCoronationPlate, pWhydah1745],
  },

  // =========================================================================
  // 6. THE PLATES
  // =========================================================================
  {
    slug: "des-marchais-hueda-plates",
    title: "Des Marchais's Hueda plates: what was drawn on the spot and what was redrawn",
    summary:
      "Four images of Hueda go back to the Chevalier Des Marchais: the coronation, the procession to the serpent, the palace plan and the kingdom map. All reached print through Paris engravers in 1730 and 1747 and were then copied in Dutch, German and English compilations. None is a photograph, and the engravers changed what they saw.",
    description:
      "WHAT SURVIVES. (1) 'Couronnement du Roy de Juda ... Avril 1725', facing vol. 2, p. 70, of Labat's 1730 book. (2) 'Procession au grand Serpent pour le Couronnement du Roy de Juda fait le 15 Avril 1725', vol. 2, p. 194 (BnF GE DD-2987 (8235)). (3) 'Plan du palais du roy à Xavier ou Sabi' (BnF 8232) and (4) 'Carte du royaume de Whidah' (BnF 8228), both printed 1747 'tiré de Marchais'. Labat says of the procession that he gives the plate 'telle qu'il l'a dessinée avec beaucoup de soin': Des Marchais drew it.\n\n" +
      "LAYER 1, THE EYEWITNESS. Des Marchais's lost drawing and notes. Labat's text keeps details a drawing alone would not give: Des Marchais 'took the trouble to count' the procession, 266 men and 176 women, 442 in all; the queen mother entered only the first court; and nobody saw the serpent.\n\n" +
      "LAYER 2, LABAT AND THE PARIS ENGRAVER. The plates are keyed to Labat's text letter by letter. On the procession plate: A, the ships' roadstead; B, ships' tents on the beach; D, 'Mosquée du Grand Serpent'; then the musketeers, 20 trumpets, 20 drums, 20 flutes, wives carrying the king's presents and food, dwarfs, the master of ceremonies, the queen mother (4) and the grand sacrificateur (7). The engraver set this procession on a broad plain in front of the sea and the anchored ships. Yet the text puts the serpent's house half a league west of Savi, about 7 km inland. The 'mosque' with a columned porch is a European convention for a foreign temple. The scene is therefore a composite: the order of march may be Des Marchais's, but the setting is the engraver's.\n\n" +
      "THE CONICAL SHRINE. Norman and Kelly reproduce the coronation plate as 'Huedan coronation ceremony. Note the conical python shrine in the center of the palace' (2004, fig. 4), and French Wikipedia describes the serpent's hut at the centre with the serpent itself hurrying towards it. That a python shrine stood INSIDE the palace is a reading of the engraving that no text in Labat states, and it was not checked against a high-resolution scan in this session. NEEDS SOURCE VERIFICATION.\n\n" +
      "LAYER 3, LATER REPRODUCTIONS. The coronation was re-engraved with a German title ('Krönung des Königes von Juida im April 1725'). The kingdom map was redrawn as a bird's-eye view by van der Schley for d'Hondt's Hague collection (1747). Astley's English collection (1745–47) folded Des Marchais's material into its own plates. A colourised version of the coronation plate on Commons is a modern derivative of unknown method and is not used here.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. The plates establish what a French captain and his Paris engravers thought worth showing: order of march, numbers, European seating, the serpent's house. They do NOT show the ceremony as a camera would, and where they disagree with the text (the seaside setting, the year 1725) the text is closer to the eyewitness. No detail should be read off them unless it is also in Labat's legend or text. IMAGE GAP: Norman and Kelly's annotated figure of the coronation plate (https://www.researchgate.net/figure/Huedan-coronation-ceremony-Note-the-conical-python-shrine-in-the-center-of-the-palace_fig4_255626396), not freely licensed; the unannotated plate it reproduces is shown here.",
    category: "history",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: procession and coronation", "theme: manuscripts and their dates", "figure: dangbe", "place: savi and ouidah"], "engravings", "image provenance"),
    people: ["Renaud Des Marchais", "Jean-Baptiste Labat", "Jacobus van der Schley", "Thomas Astley"],
    civilisations: ["Hueda", "French Compagnie des Indes"],
    locationName: "Savi (Xavier), Hueda; plates engraved in Paris",
    lat: 6.43,
    lng: 2.07,
    claims: [
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        citations: [
          { sourceKey: "norman_kelly_2004_landscape_politics", relation: "context", note: "Reproduce the coronation plate and read a conical python shrine at the palace's centre." },
        ],
        startYear: 1730,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of the coronation and procession plates in Labat's Voyage",
        originalDateText: "je la vais rapporter telle qu'il l'a laissée dans ses mémoires & en donner l'estampe telle qu'il l'a dessinée avec beaucoup de soin",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Labat's statement that the plate follows Des Marchais's drawing, and the 1730 imprint. The drawing itself (1715 or 1725) is lost.",
      },
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        citations: [
          { sourceKey: "norman_2014_pythons_pigs", relation: "context", note: "Places Savi about seven kilometres from the coast, as the excavations confirm." },
        ],
        startYear: 1747,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Printing of the palace plan and kingdom map 'tiré de Marchais', and van der Schley's bird's-eye reworking",
        originalDateText: "Plan du palais du roy à Xavier ou Sabi dans le royaume de Whidah, tiré de Marchais",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. The BnF and KB catalogue dates of the derived plans (1747). They are twenty years after the kingdom's fall and one or two steps removed from the eyewitness.",
      },
    ],
    media: [pProcessionPlate, pCoronationPlate, pBirdsEye],
  },

  // =========================================================================
  // 7. THE ROUTE AND THE TEMPLE'S POSITION
  // =========================================================================
  {
    slug: "savi-palace-to-python-house-route",
    title: "From palace to python house: the road, the conical shrine and where Dangbé's temple stood",
    summary:
      "Where was Hueda's principal python temple? Bosman put it about two Dutch miles from the king's village under a great tree; Labat half a league west of Savi at the end of the kingdom's widest road; Norman places small temples along the Savi–coast road. The plate shows a shrine inside the palace. The site is unexcavated, and today's temple is at Ouidah.",
    description:
      "THE QUESTION. Norman and Kelly's argument concerns palace boundaries and the route from palace to shrine. The research request asks where the principal Dangbé temple stood. The sources give at least four answers, and they do not all describe the same building.\n\n" +
      "1. BOSMAN (1690s, printed 1704–05): the snake house 'situated about two [Dutch] Miles from the King's Village, and built under a very beautiful lofty Tree, In which (say they) the Chief and largest of all Snakes resides ... a sort of grandfather to all the rest' (as quoted by Norman 2014 from the 1705 edition, p. 370). Norman glosses the distance as about seven English miles.\n\n" +
      "2. LABAT FROM DES MARCHAIS (1715/1725, printed 1730): 'La Case, la Maison, le Palais, le Temple du grand Serpent ... sont à une demie lieue ou environ à l'Ouest de la ville de Xavier'. The road to it is 'sans contredit le plus grand du Royaume', straight, wide enough for five or six men abreast. The procession halted at the gate, prostrated, clapped and threw dust on their heads; only the queen mother and four officials entered the first court. The king himself, Labat says, never enters even the first hall.\n\n" +
      "3. THE ORACLE FIELD (before 1698, printed 1722): Father Braguez's festival 'pour consulter le serpent' was held three to four leagues from the king's residence, in a fenced field with palm-leaf huts. This is a different site, a ritual ground used occasionally (see the oracle record).\n\n" +
      "4. ROADSIDE TEMPLES (Barbot, via Norman 2014): thatched temples spaced along the main road from Savi to the coast. If a python lay on the road, a specialist returned it, and traffic stopped until he did. Norman's archaeology finds settlements strung along a northeast–southwest road, which he identifies with that corridor.\n\n" +
      "5. INSIDE THE PALACE? The coronation plate shows a conical shrine at the palace's centre, read by Norman and Kelly as a python shrine and by French Wikipedia as the serpent's hut with the serpent approaching it. No text describes a python house inside the palace walls (see the plates record).\n\n" +
      "6. OUIDAH TODAY: the Temple of Pythons (Dangbexwe) stands in the centre of Ouidah, about 9 km south of Savi. Its foundation tradition is dated 1717 (benin-vodun). The French Wikipedia article notes that the cult site 'pourrait avoir subi plusieurs déplacements', and Sinou's 1991 heritage survey found no information on the temple's earlier form.\n\n" +
      "NORMAN'S READING. The principal temple stood outside the palace bounds and 'outside of the direct control of the king'; the parade from palace to temple was the one time in the year the king left the palace. This sharpens Norman and Kelly's landscape argument: the ditch bounded the king's space, the road joined it to the god's.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes a principal serpent house outside Savi, west of it at a distance variously given, reached by a major road, with lesser shrines along the roads. It does NOT establish its exact site, which has not been located or excavated in any source reached. Nor does it establish that the Ouidah temple is the same building, or that a python shrine stood inside the palace. The distances (half a league versus two Dutch miles) disagree, so they may describe different buildings or different reigns.",
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: sacred landscape", "theme: procession and coronation", "figure: dangbe", "place: savi and ouidah"], "temple location", "roads"),
    people: ["Willem Bosman", "Renaud Des Marchais", "Jean-Baptiste Labat", "Neil L. Norman"],
    civilisations: ["Hueda"],
    locationName: "Between Savi and Ouidah, Bénin",
    lat: 6.4,
    lng: 2.075,
    claims: [
      {
        sourceKey: "bosman_1705_guinea",
        citations: [
          { sourceKey: "norman_2014_pythons_pigs", relation: "supports", note: "Quotes Bosman's location of the snake house and adds the roadside temples along the Savi–coast road." },
        ],
        startYear: 1704,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest placing of the principal snake house, about two Dutch miles from the king's village",
        originalDateText: "situated about two Miles from the King's Village, and built under a very beautiful lofty Tree",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Bosman's letters of the 1690s, printed 1704–05, as quoted by Norman (2014). A distance given by a factor who probably never measured it.",
      },
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        startYear: 1715,
        endYear: 1725,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Des Marchais's placing of the serpent's house half a league west of Savi",
        originalDateText: "à une demie lieue ou environ à l'Ouest de la ville de Xavier",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Labat (1730) from Des Marchais, whose presence is dated to 1715 by the text and 1725 by the plates; hence the range.",
      },
    ],
    media: [pProcessionPlate, pTemple1900, pKahnTemple, pRoundHut],
  },

  // =========================================================================
  // 8. THE ORACLE
  // =========================================================================
  {
    slug: "hueda-python-oracle-braguez",
    title: "Asking the python: the Hueda king's oracle in Father Braguez's account",
    summary:
      "The earliest account found here of a royal consultation of the serpent comes from the Dominican Father Braguez, at Whydah with the Chevalier Damon before 1698. The priest questioned a snake at a hole about next year's ships, war and harvest and carried each answer to the kneeling king. Labat's later book says the king always consulted the serpent through its priest.",
    description:
      "THE ACCOUNT. In his Nouveau voyage aux isles de l'Amérique (Paris 1722; The Hague 1724, vol. 2, under the year 1698), Labat reports what his fellow Dominican Father Braguez told him. Braguez was at Juda with the Chevalier Damon, commanding a ship of the Compagnie de Guinée, at the time of 'la grande Fête pour consulter le serpent'. The king's household walked out at noon, his women carrying everything he owned. The ceremony took place three or four leagues from his town, in a large field surrounded by palm-leaf huts, its centre enclosed by a barrier. After days of feasting, the people knelt in silence far off. 'Le Roi seul avec le Prêtre du pays entrèrent dans l'enceinte.' After prostrations and prayers 'le Prêtre s'approcha d'un trou où l'on supposoit qu'il y avoit un serpent. Il lui parla de la part du Roi, & lui fit les questions accoutumées sur le nombre des Vaisseaux qui viendroient l'année suivante, sur la Guerre, la Moisson, & autres choses.' As the serpent answered each question, the priest carried the answer to the king, who knelt a little way off 'en posture de suppliant'. At the end it was announced that next year would be happy, with much trade, 'et qu'on prendroit bien des Esclaves'. The people rejoiced with shouts, dances and feasts.\n\n" +
      "THE LATER TEXT. Labat's Des Marchais volume (1730) says the same of the principal temple: the king never entered even the first room and addressed the serpent 'par le canal du grand Sacrificateur, qui lui sert d'interprète, & qui lui rapporte en secret les réponses vrayes ou fausses que le Serpent daigne faire aux demandes que le Prince lui fait faire'. At the coronation, the priest ordered the offerings 'de la part du grand Serpent'. The Diogenes summary by Merlo and Vidaud quotes Labat: 'everybody appeals to him for advice, for rain, for good weather or in case of sickness or war, for trade, for harvest, for weddings'.\n\n" +
      "WHAT THE QUESTIONS SHOW. The oracle was asked about the slave trade: ships, war and captives. In this account the python cult is bound up with Hueda's Atlantic economy. And the mediation is total: only the priest speaks to the snake, and only the priest reports what it said. That is the structural basis of the priest's power over the king that Atkins and Bosman describe (vodun-diaspora: 'Held in equal reverence with the King').\n\n" +
      "THE PRIEST'S THEOLOGY, AND A WARNING. Braguez reports the priest, a man of about sixty, saying that the serpent-cult was 'un culte relatif à l'Être souverain'. The Creator, knowing man's pride, humbled him by making him crawl before a serpent, 'le plus méprisable & le plus méchant de tous les animaux'. The phrasing echoes Christian views of the serpent, and it reaches us through two Dominicans. Whether it is the priest's thought or the missionaries' translation of it cannot be known. This is the earliest instance of a problem that recurs with Agbo's hymn (see that record).\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that by the 1690s Europeans reported a royal consultation of the python in which a priest put questions and relayed answers. It does NOT establish how the answers were obtained, since Braguez saw only the priest at the hole, nor the Gbe words used. The date is uncertain: Braguez told the story to Labat, who files it under 1698. It is not a divination system like Fa (vodun-diaspora: divination-fa-ifa-afa-comparison). Nor is it evidence of Egyptian-style temple oracles: the resemblance is that of oracles generally, and the rituals lane weighs it.",
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: oracle and divination", "theme: kingship", "theme: priesthood", "figure: dangbe", "theme: living sacred animals", "theme: trade routes"], "braguez", "slave trade"),
    people: ["Father Braguez (Dominican)", "the Chevalier Damon", "the king of Juda (Hueda)", "the serpent's priest", "Jean-Baptiste Labat"],
    civilisations: ["Hueda", "Compagnie de Guinée"],
    locationName: "An oracle field three to four leagues from the Hueda king's town",
    claims: [
      {
        sourceKey: "labat_1724_nouveau_voyage",
        startYear: 1698,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "before_event",
        whatIsDated: "Father Braguez's observation of the festival to consult the serpent, filed by Labat under 1698",
        originalDateText: "la grande Fête pour consulter le serpent",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Second-hand: Braguez told Labat, who printed it in 1722 under the year 1698. The visit was on or before that date; the exact year is not given.",
      },
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        citations: [
          { sourceKey: "merlo_vidaud_1966_black_serpent", relation: "supports", note: "Quote Labat that everyone appealed to the serpent for advice on rain, war, sickness, trade and harvest." },
        ],
        startYear: 1730,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Labat's general statement that the king consults the serpent only through its priest",
        originalDateText: "les réponses vrayes ou fausses que le Serpent daigne faire aux demandes que le Prince lui fait faire",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Labat's compilation from Des Marchais (1730). A general statement of custom with Labat's sarcasm ('vrayes ou fausses'), not an observed consultation.",
      },
    ],
    media: [pAltar, pPythonRoyal, pRoyalPythons],
  },

  // =========================================================================
  // 9. THE PARADE AS ECONOMY
  // =========================================================================
  {
    slug: "hueda-python-parade-feasts-in-motion",
    title: "A moving feast for the python: Norman's reading of Hueda's royal parade and why it was cut",
    summary:
      "Neil Norman reads the king's parade to the python temple as a moving feast. Drummers, trumpeters and praise-singers led hundreds of bearers of silk, cowries, European goods and food, and the king repaid people and priests for the god's bounty. When Bosman's king stopped going, Norman argues, the kingdom lost a bond it needed.",
    description:
      "WHAT THE SOURCES SAY. Bosman (as quoted by Norman 2014): the high priest demanded 'Money', 'Silk', 'Cattle, Eatables and Drinks', all exacted from the king, 'and he sometimes grows tired and refuses them'. One year the king, asked through a viceroy in the priests' name for further offerings against a barren year, answered that he would send no more: 'if the Snake would not bestow a plentiful Harvest on them, he might let it alone ... the greatest Part of my Corn being already rotten in the Field'. In other years, Norman reports from Bosman, the priest prescribed barrels of cowries, spirits, gunpowder, cattle, goats and chickens. And the king had 'broke off the custom' of the annual pilgrimage, sending his wives instead. In the procession Des Marchais counted, twelve of the king's wives carried the king's presents to the serpent: cowries ('bouges'), brandy, cloth, Indian prints and silk. Twelve more carried food, and twelve the queen mother's gifts.\n\n" +
      "NORMAN'S READING (2010, summarised 2014). The parade was 'a moving feast'. Drummers, trumpeters and praise-singers went before hundreds who carried silk, cowries, imported goods and prepared food. It mirrored the household rite in which vodun are 'fed', and 'all wealth was seen as coming from Dangbe'. At it the king gave gifts to regional leaders and to the temple priests, in partial return for corvée labour and military service. He also displayed his following, Europeans and people whose bodies marked them as belonging to particular vodun (dwarfs to Toho, for example). It was the only time in the year the king left the palace. Its cost was 'particularly onerous to Huedan kings', and 'the expense in not having the parade was even more dear'. Before 1727 the parades had been 'reduced and restricted' by the king, and Norman links that to the discontent behind Hueda's failure to defend itself.\n\n" +
      "HOW IT DIFFERS FROM THE EXISTING RECORDS. vodun-diaspora's coronation record describes who led which procession; its priesthood record describes the priest's power. This record concerns the ECONOMICS of the rite: what was carried, to whom, and what stopping it may have cost. That is Norman's interpretation, built on the same few European texts plus the archaeology of feasting (storage jars concentrated in regional centres).\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that the python cult moved large quantities of cowries, cloth, drink and livestock between king, priests and people, and that at least one king resisted the cost. It does NOT establish that cutting the parades caused the fall of Hueda. That is a hypothesis linking an economic reading to a military collapse with many other causes: the factional quarrels Law describes and Dahomey's army. Norman's 2010 article itself was not read here. 'Distribution of wealth' at royal rites is widespread in Africa and elsewhere, which the rituals lane notes.",
    category: "religion",
    subcategory: SUB,
    eventType: "archaeological_interpretation",
    identificationStatus: "modern_interpretation",
    tags: serpentTags(LANE, ["theme: procession and coronation", "theme: kingship", "theme: priesthood", "figure: dangbe", "place: savi and ouidah"], "cowries", "offerings", "feasting"),
    people: ["Neil L. Norman", "Willem Bosman", "the king of Hueda", "the high priest of Dangbe"],
    civilisations: ["Hueda"],
    locationName: "Savi and the road to the python temple, Bénin",
    lat: 6.42,
    lng: 2.07,
    claims: [
      {
        sourceKey: "norman_2010_feasts_in_motion",
        citations: [
          { sourceKey: "norman_2014_pythons_pigs", relation: "supports", note: "Summarises the 2010 argument: the parade as a moving feast of reciprocity, its curtailment and the collapse." },
          { sourceKey: "bosman_1705_guinea", relation: "context", note: "The king who broke off the pilgrimage and refused further offerings, as quoted by Norman." },
        ],
        startYear: 2010,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of Norman's interpretation of the parades as moving feasts",
        originalDateText: "The parade represents a moving feast",
        datingMethod: "historical_record",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The 2010 article is known here from its bibliographic record and Norman's 2014 summary, from which the quoted words come.",
      },
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        startYear: 1715,
        endYear: 1725,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The procession in which the king's wives carried cowries, brandy, cloth and silk to the serpent",
        originalDateText: "Ce sont des Bouges, de l'eau de vie, des pièces de toille, d'Indiennes & de soye",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Labat (1730) from Des Marchais, dated 1715 by the text and 1725 by the plate. 'Bouges' are cowries, the coast's currency, which Labat describes elsewhere.",
      },
    ],
    media: [pProcessionPlate, pTempleInterior1863],
  },

  // =========================================================================
  // 10. WOMEN
  // =========================================================================
  {
    slug: "hueda-royal-women-in-serpent-rites",
    title: "The king's mother, the royal wives and the serpent's wives: women in Hueda's serpent rites",
    summary:
      "Women did most of the ritual work in the Hueda serpent rites Des Marchais recorded. The king's mother led the first procession. Wives of the third rank carried the gifts, food and a clay child-figure. Women musicians played. The serpent's own initiated wives were a separate institution. Today 41 women carry the water for the temple's seven-yearly rite.",
    description:
      "THREE KINDS OF WOMEN, NOT ONE. European writers and modern summaries run together (a) royal women acting for the crown, (b) women initiated to the serpent, and (c) women who serve the temple today. vodun-diaspora's 'The serpent's wives' covers (b) through European eyes from 1705 to 1874. This record adds (a), from Labat's text read in this session, and (c), and keeps the terms apart.\n\n" +
      "(A) ROYAL WOMEN IN THE CORONATION AND PROCESSION. Labat divides the king's wives into ranks. At the coronation eighteen wives 'de la troisième classe' processed two by two with flutes and drums, singing. The senior, walking last, carried 'une figure de terre cuite qui représente grossièrement un enfant assis' and set it beside the sacrificed animals. Forty favourite wives, dressed in silk and loaded with gold, sat on the ground at the king's left during the crowning. Wives of the third rank served the Allada crowner's meals. In the procession to the serpent, the king's MOTHER presided, walking alone with a cane, followed by three senior palace ladies. Wives carried the king's presents, his food and his mother's gifts, and the palace's women musicians played drums, trumpets and flutes 'en trois corps'. Des Marchais counted 176 women among 442 participants. Only the queen mother, three palace ladies and two officials entered the serpent's first court, and Labat doubts she saw the serpent.\n\n" +
      "(B) THE SERPENT'S WIVES. Initiated women 'consecrated' to the serpent, the Danh'si of Burton, are the subject of the existing record and are not retold here. TERMINOLOGY: '-si' is the Gbe suffix 'wife of' (vodunsi, Dangbesi). The research request also offers 'kpɔsi'. In the Dahomean literature kpɔsi refers to wives of the king (the leopard), not of the python. That is a royal Dahomean category, and it should not be transferred to Hueda's serpent devotees without a source. NEEDS SOURCE VERIFICATION in Bay (1998).\n\n" +
      "(C) WOMEN AT THE TEMPLE TODAY. According to the temple's custodians, as reported in Beninese press and summarised in French Wikipedia, a great white jar (zingbin) said to be over 200 years old is the centre of a rite held every seven years. Sacred leaves are steeped in sacred water, part taken away for healing. The water was once fetched by 41 virgin girls; today 41 post-menopausal women are chosen. Devotees of the python bear facial scarifications. This is a practitioner account, recorded as such.\n\n" +
      "WHY THE QUEEN MOTHER MATTERS. A royal woman leading the first state rite to the serpent anticipates Dahomey's kpojito (the king's female reign-mate). That parallel is drawn in the existing coronation record and not repeated here.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that in the coronation rites Labat describes, royal women led, carried and played, and that a clay figure of a seated child was part of the sacrifice. It does NOT establish what the child-figure meant: Labat does not say, and no later source reached explains it. Nor does it establish that the modern 41-women rite is old, or that Hueda used 'kpɔsi' for any group of women. The 'Jeune Prêtresse' engraving is a Paris costume-book image of about 1788 and is marked UNVERIFIED.",
    category: "religion",
    subcategory: SUB,
    eventType: "historical",
    tags: serpentTags(LANE, ["theme: procession and coronation", "theme: priesthood", "figure: dangbe", "theme: healing and protection", "place: savi and ouidah"], "women", "queen mother", "vodunsi"),
    people: ["the king's mother (Hueda)", "the wives of the king of Hueda", "the serpent's initiated women", "Renaud Des Marchais"],
    civilisations: ["Hueda", "Ouidah"],
    locationName: "Savi and Ouidah, Bénin",
    lat: 6.4,
    lng: 2.08,
    claims: [
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        startYear: 1715,
        endYear: 1725,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The royal wives' roles in the coronation and in the procession counted by Des Marchais",
        originalDateText: "deux cent soixante & six hommes, & cent soixante & seize femmes, ce qui fait en tout quatre cens quarante-deux personnes",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Labat (1730) from Des Marchais; the coronation is dated 1715 by the text and the procession 1725 by its plate.",
      },
      {
        sourceKey: "ouidah_python_temple_tradition",
        citations: [
          { sourceKey: "fr_wikipedia_temple_des_pythons", relation: "supports", note: "Summarises the press accounts of the seven-yearly zingbin rite and the 41 women." },
        ],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The age of the seven-yearly rite of the sacred jar with 41 women",
        originalDateText: "Autrefois on désignait 41 jeunes filles vierges pour aller chercher de l'eau sacrée",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. A custodians' account reported in the press. The jar is said to be over 200 years old; no document dates the rite, so no year is given.",
      },
    ],
    media: [pProcessionPlate, pJeunePretresse, pDagbeDre],
  },

  // =========================================================================
  // 11. AGBO'S HYMN
  // =========================================================================
  {
    slug: "agbo-dangbe-hymn-opened-the-eyes",
    title: "'Dagbé opened the eyes': the hymn Agbo printed, its wording and its earliest version",
    summary:
      "Casimir Agbo's Histoire de Ouidah (1959) is reported to print a Hueda hymn: 'Dagbé wè houn noukoun na mi', 'C'est Dagbé qui a ouvert les yeux à l'homme'. Merlo and Vidaud made 'the black serpent who opened the eyes of man' their title in 1966. Neither text could be read here; the wording, a provisional gloss and the question of Christian influence are set out.",
    description:
      "THE REPORTED TEXT. As given in the research request: Hueda 'Dagbé wè houn noukoun na mi'; Agbo's French 'C'est Dagbé qui a ouvert les yeux à l'homme' ('It is Dagbé who opened man's eyes'). The source is Casimir Agbo, called Alidji, Histoire de Ouidah du XVIe au XXe siècle (Avignon, 1959; about 307–338 pp. depending on edition). The book could NOT be consulted in this session, so neither the wording, its orthography nor the page is verified. NEEDS SOURCE VERIFICATION.\n\n" +
      "A PROVISIONAL WORD-BY-WORD GLOSS. Read as Fon/Gbe in a modern spelling, 'Dagbé wɛ hùn nùkún ná mì': DAGBÉ, the python vodun; WƐ, the focus particle ('it is ... who'); HÙN, 'open'; NÙKÚN, 'eye(s)'; NÁ, 'give / for' (benefactive); MÌ, 'us' (first person plural; in some varieties 'you' plural). Literally: 'It is Dagbé who opened eyes for us.' If that is right, the French 'à l'homme' (to MAN, humanity) is an interpretive widening of 'for us', perhaps 'for us, the Hueda'. Two cautions. HÙN is a homophone in Fon of the words for drum, blood and vodun, so tone and context matter. And this gloss is this record's, not a lexicographer's: it must be checked against Segurola's Dictionnaire fon-français (1963) or a Xweda (Hueda) speaker. NEEDS SOURCE VERIFICATION.\n\n" +
      "WHAT 'OPENING THE EYES' CAN MEAN. In Gbe usage 'opening the eyes' can mean giving knowledge, making someone wise or alert, and, in ritual, the stage of initiation in which a novice is given sight of things hidden. Which sense the hymn bears is unknown without its context: whether it is sung at the temple, at initiation or at royal rites. Norman (2014), citing Merlo and Vidaud (1966: 66), says that in the oral histories they collected Dangbé 'confers on people the knowledge of good and evil: he “opened their eyes”'. 'Knowledge of good and evil' is already Genesis's phrase. Whether it is the informants' or the authors' cannot be told from here.\n\n" +
      "THE EARLIEST VERSION FOUND. (1) Agbo, 1959, if the request's citation is right. (2) Merlo and Vidaud, Diogenes, September 1966, whose title is 'The Black Serpent Who Opened the Eyes of Man' (the royal python is brown and gold, not black, so 'black' needs explaining too). (3) Their 600-page typescript Dangbé (1974). Nothing earlier was found. Bosman, Labat, Burton and Herskovits, all read or searched here, do not record it. An oral hymn is of course older than its first printing, but by how much is unknown.\n\n" +
      "COULD CHRISTIAN INFLUENCE HAVE SHAPED IT? The question must be asked. Ouidah has had a Catholic mission since 1861; its basilica faces the python temple. Agbo wrote in French for readers who knew Genesis 3:5–7 ('your eyes shall be opened'). Merlo and Vidaud were looking for a 'universal myth of the serpent'. And already before 1698 a Hueda priest's explanation of the serpent cult came to Europe in words that echo the Christian view of the serpent (see the oracle record). None of this shows the hymn is Christian. It shows that the earliest recorded wording and its French gloss passed through minds and readers primed for the Genesis comparison. The comparison itself is in the comparisons lane, which links here.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that by 1959–1966 a Hueda formula linking Dangbé with 'opening the eyes' was in print, and that French writers glossed it as giving knowledge to humanity. It does NOT establish the exact Hueda wording, its date of origin, its ritual context, or any historical connection with Genesis.",
    category: "religion",
    subcategory: SUB,
    eventType: "religious_account",
    tags: serpentTags(LANE, ["figure: dangbe", "theme: names and words", "theme: manuscripts and their dates", "place: savi and ouidah"], "hymn", "opened the eyes", "agbo"),
    people: ["Casimir Agbo (Alidji)", "Christian Merlo", "Pierre Vidaud", "Dangbé"],
    civilisations: ["Hueda", "Ouidah"],
    locationName: "Ouidah, Bénin",
    lat: 6.3625,
    lng: 2.0853,
    passages: [
      {
        label: "The hymn to Dagbé, as reported from Agbo (1959)",
        reference: "Agbo, Histoire de Ouidah (1959), page not verified",
        sourceKey: "agbo_1959_histoire_de_ouidah",
        layers: [
          {
            layer: "transcription",
            sourceKey: "agbo_1959_histoire_de_ouidah",
            language: "fon (Xweda/Hueda), in Agbo's French-based spelling as reported",
            content: "Dagbé wè houn noukoun na mi",
            evidence: "As given in the research request, attributed to Agbo; NOT checked against the printed page in this session. NEEDS SOURCE VERIFICATION.",
          },
          {
            layer: "translation",
            sourceKey: "agbo_1959_histoire_de_ouidah",
            language: "fr",
            content: "C'est Dagbé qui a ouvert les yeux à l'homme.",
            viewpoint: "community",
            evidence: "Agbo's French rendering as reported in the research request; unverified against the book.",
          },
          {
            layer: "interpretation",
            sourceKey: null,
            language: "en",
            content: "Dagbé (python vodun) + wɛ (focus: 'it is ... who') + hùn ('open') + nùkún ('eye/eyes') + ná ('give, for') + mì ('us'): 'It is Dagbé who opened eyes for us.'",
            evidence: "A provisional gloss made for this record from general Fon vocabulary, not from a dictionary consulted in this session. NEEDS SOURCE VERIFICATION against Segurola (1963) and a Xweda speaker; tone marks are conjectural.",
          },
          {
            layer: "modern_summary",
            sourceKey: "norman_2014_pythons_pigs",
            language: "en",
            content: "In the oral histories that they collected ... Merlo and Vidaud (1966:66) recorded that Dangbe confers on people the knowledge of good and evil: he “opened their eyes.”",
            viewpoint: "archaeological",
            evidence: "Norman (2014), read in this session, citing Merlo and Vidaud's Diogenes article, which was not read.",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "agbo_1959_histoire_de_ouidah",
        startYear: 1959,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest printing of the hymn found (as reported)",
        originalDateText: "Agbo prints 'Dagbé wè houn noukoun na mi' (1959)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: religious tradition. A devotional formula first printed, as far as is known, in Agbo's 1959 history. The book was not seen here, so even this terminus is NEEDS SOURCE VERIFICATION.",
      },
      {
        sourceKey: "merlo_vidaud_1966_black_serpent",
        citations: [
          { sourceKey: "norman_2014_pythons_pigs", relation: "supports", note: "Cites Merlo and Vidaud 1966: 66 for Dangbé having 'opened their eyes'." },
        ],
        startYear: 1966,
        startMonth: 9,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Merlo and Vidaud's article titled after the 'opened the eyes' theme",
        originalDateText: "The Black Serpent Who Opened the Eyes of Man",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The Diogenes article (vol. 14, no. 55) dates the scholarly use of the theme, not the hymn.",
      },
      {
        sourceKey: "ouidah_python_temple_tradition",
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The age of the hymn in Hueda oral liturgy",
        originalDateText: "No date: the hymn's oral age is unknown",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. A sung formula is older than its first printing, but nothing dates it; it is absent from the eighteenth- and nineteenth-century accounts searched here.",
      },
    ],
    media: [pDangbeXo, pTempleEntrance],
  },

  // =========================================================================
  // 12. MERLO AND VIDAUD
  // =========================================================================
  {
    slug: "merlo-vidaud-dangbe-universal-serpent",
    title: "Merlo and Vidaud's Dangbé: from the Hueda python to a 'universal myth of the serpent'",
    summary:
      "Christian Merlo and Pierre Vidaud studied Dangbé's rites, myths and many temples. They traced the cult's origin through the clans of Lower Dahomey and neighbouring Togo and Nigeria, then compared python cults from Asante to Uganda and the Transvaal, aiming at a universal serpent myth. Their work is an interpretation and is recorded as one.",
    description:
      "THE WORKS. (1) 'The Black Serpent Who Opened the Eyes of Man', Diogenes 14 (55): 61–88, September 1966, a summary of their research for an international readership. (2) Dangbé. Du Python sacré des Houéda au mythe universel du Serpent, a 600-page typescript of 1974 with index, maps and appendices, deposited at the library of the Musée de l'Homme. French Wikipedia gives a variant title with 'dahoméen'. It was reviewed by Maurice Houis in the Journal de la Société des Africanistes (1975). (3) 'Dangbé et le peuplement houéda', in F. de Medeiros (ed.), Peuples du Golfe du Bénin (Karthala, 1984), pp. 269–304. Only (1)'s opening and Houis's review were read in this session.\n\n" +
      "WHAT THEY DID, ACCORDING TO HOUIS. They studied in Dahomey the cult of Dangbé and 'les nombreux temples qui lui sont consacrés, dont celui de Ouidah'. They examined its rites and myths, then sought its origin 'd'abord dans les clans du Bas-Dahomey, puis dans les ethnies limitrophes du Togo et du Nigeria'. Finally they followed parallel cults elsewhere in Africa, 'particulièrement chez les Ashanti du Ghana, les Baganda du lac Victoria et les Venda du Transvaal'.\n\n" +
      "WHAT THEY CLAIM, ACCORDING TO THE DIOGENES OPENING. Dangbé, 'the Good Serpent', has come to symbolise and procure fertility, fecundity, good health, wealth, peace, wisdom and happiness. Labat's list of the serpent's powers (rain, weather, sickness, war, trade, harvest, weddings) already shows that 'confusion of heteroclitic attributes'. According to Norman (2014) they placed python worship alongside the earliest history of the kingdom and the ethnolinguistic identity of its people (1984), and recorded Dangbé as giving 'knowledge of good and evil' (1966: 66).\n\n" +
      "HOW TO READ THEM. As two kinds of work. Their FIELDWORK on the many Dangbé temples and the clans that serve them is evidence of value, and nobody else has matched its scope; it is cited by Norman, the archaeologist of Savi. Their CONCLUSION, a universal myth of the serpent, belongs to mid-twentieth-century comparative mythology. That school treated similar images across Africa and the world as variants of one myth, and its premise is exactly what this track's safeguards warn against.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that two researchers documented Dangbé temples and clan traditions across southern Bénin in the 1960s–70s and proposed a universal serpent myth. It does NOT establish that myth: a serpent cult among the Baganda or the Venda is no evidence of a historical link with Hueda. Nor does their comparative frame bear on the tribe of Dan or Egypt, which, as far as the review and abstract show, they did not argue for. Their origin search within the Gbe and neighbouring peoples is the strand most useful to the 'local development' route (Route D).",
    category: "religion",
    subcategory: SUB,
    eventType: "alternative",
    eventTypeNote: "A scholarly interpretation proposing a universal serpent myth; its fieldwork is evidence, its universal thesis is a hypothesis.",
    identificationStatus: "modern_interpretation",
    tags: serpentTags(LANE, ["figure: dangbe", "theme: migration traditions", "theme: living sacred animals", "place: savi and ouidah"], "comparative mythology", "merlo and vidaud"),
    people: ["Christian Merlo", "Pierre Vidaud", "Maurice Houis", "Pierre Verger"],
    civilisations: ["Hueda", "Asante", "Baganda", "Venda"],
    locationName: "Southern Bénin (fieldwork); comparisons across Africa",
    lat: 6.4,
    lng: 2.1,
    argumentsFor:
      "Merlo and Vidaud did extensive fieldwork on Dangbé's many temples and the clans that serve them, and traced origins within Lower Dahomey, Togo and Nigeria before going further. Their work is cited by the archaeologist Norman, and python cults with protected living snakes do occur in several African societies (Asante, Baganda, Venda), so a comparative frame is not arbitrary.",
    argumentsAgainst:
      "A 'universal myth of the serpent' is a premise of comparative mythology, not a finding: python cults in Ghana, Uganda and South Africa share an animal, not a demonstrated history. The 1974 study remains an unpublished typescript, and the full Diogenes text and 1984 chapter were not reached here. The 'opened the eyes / knowledge of good and evil' wording may carry the authors' own Genesis framing.",
    genealogies: [
      {
        key: "dangbe-universal-serpent",
        claim: "Dangbé of the Hueda is a local form of a universal African (and world) myth of the serpent",
        verdict: "later_interpretation",
        verdictEvidence:
          "The claim first appears in Merlo and Vidaud's 1966 article and 1974 typescript as a comparative-mythology conclusion; no historical evidence of transmission between the cults compared is reported in the review or abstract.",
        whatWouldChangeThis:
          "Documented historical contact, shared vocabulary with regular sound correspondences, or shared ritual sequences specific enough to rule out independent invention, between the Hueda cult and the others compared.",
        links: [
          {
            stage: "colonial_record",
            who: "Jean-Baptiste Labat",
            year: 1730,
            sourceKey: "des_marchais_labat_1730_voyage",
            says: "everybody appeals to him for advice, for rain, for good weather or in case of sickness or war, for trade, for harvest, for weddings",
            adds: "The serpent as an all-purpose divinity, which Merlo and Vidaud take as their starting point.",
            citationStatus: "verified",
            notes: "Quoted in English in the Diogenes opening.",
          },
          {
            stage: "early_scholarship",
            who: "Christian Merlo and Pierre Vidaud",
            year: 1966,
            sourceKey: "merlo_vidaud_1966_black_serpent",
            says: "Few African Gods have attracted the attention of travellers as has Dangbé, the Good Serpent",
            adds: "Frames Dangbé as the black serpent who opened the eyes of man.",
            citationStatus: "verified",
          },
          {
            stage: "early_scholarship",
            who: "Maurice Houis, reviewing the 1974 typescript",
            year: 1975,
            sourceKey: "houis_1975_review_merlo_vidaud",
            says: "Leur enquête se poursuit dans les pays africains où l'on observe un culte parallèle, particulièrement chez les Ashanti du Ghana, les Baganda du lac Victoria et les Venda du Transvaal.",
            adds: "Shows the universal comparison was the book's endpoint.",
            citationStatus: "verified",
          },
          {
            stage: "current_scholarship",
            who: "Neil L. Norman",
            year: 2014,
            sourceKey: "norman_2014_pythons_pigs",
            says: "they chart the trajectory of python worship alongside the earliest iterations of the kingdom",
            adds: "Uses their Hueda material for local history, not their universal thesis.",
            citationStatus: "verified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "houis_1975_review_merlo_vidaud",
        citations: [
          { sourceKey: "merlo_vidaud_1966_black_serpent", relation: "context", note: "The 1966 article summarising the research that became the 1974 typescript." },
        ],
        startYear: 1974,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Completion of Merlo and Vidaud's 600-page typescript Dangbé",
        originalDateText: "1974, 600 p. dactylogr., index, cartes, annexes",
        datingMethod: "historical_record",
        chronology: "alternative",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Houis's review dates the typescript; it dates an interpretation, not anything about the cult's past.",
      },
    ],
    media: [pKahnSerpentPriest, pTempleEntrance],
  },

  // =========================================================================
  // 13. ORIGINS AND MOVEMENT OF DAN WORSHIP
  // =========================================================================
  {
    slug: "dan-worship-origins-and-movement",
    title: "Where Dan worship is said to come from, and how serpent vodun moved: Mahi, Abomey, Porto-Novo",
    summary:
      "Gbe traditions give Dan cults several homes. One, quoted in a popular essay, says Dahomey met 'Dan Aïdo Hwèdo' as a vodun of the Mahi. Dangbé is said to have entered Dahomey after 1727. By 1930 a Dan house and a serpent priest ('dagbé') were photographed at Porto-Novo. The movement is documented; the origins are traditions.",
    description:
      "THE TRADITIONS OF ORIGIN, EACH LABELLED. (1) HUEDA'S OWN: the serpent came from elsewhere because of men's wickedness (Bosman, Barbot), or crossed from Allada's army in battle (Labat). Those stories are in vodun-diaspora's 'How the serpent came to Hueda' and not repeated here. (2) A MAHI ORIGIN FOR THE RAINBOW SERPENT: a popular French essay states, quoting an unnamed earlier writer, that during the expansion of the Abomey kingdom after Dako (c. 1625) 'les Dahoméens firent connaissance avec Dan Aïdo Hwèdo, « le serpent arc en ciel, qui est aussi un vodun Mahi, particulier à la tribu des Djinou (gens d'en haut, tombés du ciel) »'. The Mahi are the Gbe-speaking peoples of the hills north of Abomey (Savalou, Dassa). The original ethnographer, plausibly Le Hérissé (1911) or Maupoil, was not identified. NEEDS SOURCE VERIFICATION. (3) DANGBÉ INTO DAHOMEY: the same essay quotes 'Agadja, vainqueur d'un pays où on l'honorait, voulut se ménager sa faveur. Il l'acheta et le fit connaître au Dahomey.' The existing record 'Dahomey takes Hueda's serpent under its protection' documents that move from Burton and Skertchly. (4) TADO: many Aja and Fon lineages say their cults are 'from Tado' (vodun-diaspora: tado-as-a-religious-source).\n\n" +
      "THE MOVEMENT THAT IS DOCUMENTED. (a) Herskovits's Abomey ethnography (1931, published 1938) found Da cults in every lineage: Dambada Hwedo for the forgotten dead, an Aido Hwedo house among ancestral shrines. (b) Gadmer's autochromes for the Archives de la Planète, captioned at the time, show a 'Case du fétiche Dan' at Porto-Novo on 15 January 1930. On 24 January he photographed 'Le Chef féticheur du Serpent (dagbé)' there, and on 10 May altars 'chez le féticheur du Serpent'. Porto-Novo, the Gun kingdom of Hogbonu, lies some 40 km east of Ouidah and was never ruled by Hueda, so a serpent cult named 'dagbé' was established there by 1930, whatever its route. (c) Norman (2014) reports 'a prominent temple to Dangbe in the Dahomean palace complex at Abomey' today. (d) Across the Atlantic, Dan names were carried as Danbala and Ayida Wedo in Haiti and Bessen in the Jeje houses of Brazil (vodun-diaspora records).\n\n" +
      "HOW VODUN MOVE. In the Gbe world gods travel with people: with lineages that migrate, with wives who marry out, with captives, with conquerors who buy or capture a cult to win its favour, and with kings who import a priest. Merlo and Vidaud's search for Dangbé's origin 'in the clans of Lower Dahomey, then in the neighbouring peoples of Togo and Nigeria' (Houis 1975) follows the same logic. A map of who serves which Dan is therefore a map of past movement, as benin-vodun's 'not one theology' says.\n\n" +
      "WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes serpent cults called Dan or Dangbé at Ouidah (from the 1690s), Abomey (from the eighteenth century, by tradition after 1727), and Porto-Novo (by 1930). It establishes that cults moved within the Gbe region by conquest and migration. It does NOT establish where Dan worship first arose: the Mahi tradition is a single quotation of unknown origin. Nor does it show any route from outside West Africa. Gbe traditions of origin point to Tado, Allada, the Mahi hills and neighbouring peoples, not to the Nile or the Levant. That fact belongs in the routes lane's assessment of Route D, local development.",
    category: "religion",
    subcategory: SUB,
    eventType: "traditional_account",
    tags: serpentTags(LANE, ["figure: dan (vodun)", "figure: dangbe", "figure: aido-hwedo", "theme: migration traditions", "place: tado and allada", "place: haiti and brazil"], "mahi", "porto-novo", "movement of vodun"),
    people: ["Agaja", "Dako", "Melville J. Herskovits", "Frédéric Gadmer", "the chief priest of the serpent at Porto-Novo"],
    civilisations: ["Mahi", "Fon (Dahomey)", "Hueda", "Gun (Porto-Novo)"],
    locationName: "Porto-Novo, Abomey, Ouidah and the Mahi hills, Bénin",
    lat: 6.4969,
    lng: 2.6289,
    claims: [
      {
        sourceKey: "albert_kahn_dahomey_1930",
        citations: [
          { sourceKey: "norman_2014_pythons_pigs", relation: "supports", note: "Reports a temple to Dangbe in the Abomey palace complex today, another sign of the cult's movement." },
        ],
        startYear: 1930,
        startMonth: 1,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Photographs captioned 'Case du fétiche Dan' and 'Chef féticheur du Serpent (dagbé)' at Porto-Novo",
        originalDateText: "Dahomey, Porto-Novo, Le Chef féticheur du Serpent (dagbé)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Dated autochromes with the 1930 mission's own captions (15 and 24 January 1930). They date the cult's presence at Porto-Novo, not its arrival.",
      },
      {
        sourceKey: "etonnants_voyageurs_origines_vaudou",
        citations: [
          { sourceKey: "herskovits_1938_dahomey", relation: "context", note: "Abomey ethnography of the Da family of serpent vodun in the lineage cult." },
        ],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The tradition that Dan Aido-Hwedo came to Dahomey as a Mahi vodun",
        originalDateText: "le serpent arc en ciel, qui est aussi un vodun Mahi, particulier à la tribu des Djinou",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. A tradition quoted, without its source, in a popular essay; it places the encounter 'probably' in Abomey's seventeenth-century expansion, but nothing dates it, so no year is given.",
      },
    ],
    media: [pKahnDanHouse, pKahnSerpentPriest, pKahnSerpentAltar, pSlaveCoastStates],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const L = (from: string, to: string, relation: string, note: string, sourceKey?: string): SeedEventLink =>
  sourceKey ? { from, to, relation, note, sourceKey } : { from, to, relation, note };

const links: SeedEventLink[] = [
  // ---- inside the lane
  L(ANCHOR, "savi-hueda-archaeological-project-1991-2010", "related", "The lane overview leads to the excavated capital where Dangbé's cult was a state institution."),
  L(ANCHOR, "agbo-dangbe-hymn-opened-the-eyes", "related", "The overview distinguishes Dangbé, the god the hymn addresses, from Dan and Aido-Hwedo."),
  L(ANCHOR, "dan-worship-origins-and-movement", "related", "Where each of the three serpent powers is said to come from and where it is served."),
  L("savi-hueda-archaeological-project-1991-2010", "savi-serpent-ditch-argument", "evidence_for", "The excavated ditches are the evidence the serpent interpretation reads.", "kelly_brunache_norman_1999_savi_fieldwork"),
  L("savi-serpent-ditch-argument", "savi-palace-to-python-house-route", "related", "The ditch bounds the king's space; the road joins it to the python temple outside."),
  L("hueda-coronation-1715-or-1725", "hueda-coronation-rite-allada-crowner", "related", "Dates the coronation whose rite Labat's text describes."),
  L("hueda-coronation-1715-or-1725", "des-marchais-hueda-plates", "related", "The plates carry the 1725 date that the text contradicts."),
  L("hueda-coronation-rite-allada-crowner", "hueda-royal-women-in-serpent-rites", "related", "The royal wives and the clay child-figure belong to the same coronation sequence."),
  L("des-marchais-hueda-plates", "savi-palace-to-python-house-route", "evidence_for", "The plates are one source, with the texts, for where the serpent's house and shrine stood."),
  L("hueda-python-oracle-braguez", "hueda-coronation-rite-allada-crowner", "related", "At the coronation the priest orders offerings 'de la part du grand Serpent', the same mediation as the oracle."),
  L("hueda-python-parade-feasts-in-motion", "savi-palace-to-python-house-route", "related", "The parade travelled the road from palace to temple."),
  L("hueda-python-oracle-braguez", "agbo-dangbe-hymn-opened-the-eyes", "related", "Both show Hueda serpent theology reaching print through Christian interlocutors."),
  L("merlo-vidaud-dangbe-universal-serpent", "agbo-dangbe-hymn-opened-the-eyes", "related", "Merlo and Vidaud's 1966 title takes up the 'opened the eyes' theme of the hymn.", "merlo_vidaud_1966_black_serpent"),
  L("merlo-vidaud-dangbe-universal-serpent", "dan-worship-origins-and-movement", "related", "Their search for Dangbé's origin in the clans of Lower Dahomey and neighbouring peoples.", "houis_1975_review_merlo_vidaud"),

  // ---- to records already seeded (no duplication: these go further)
  L("hueda-coronation-1715-or-1725", "hueda-coronation-and-serpent-processions-1725", "responds_to", "Resolves that record's NEEDS SOURCE VERIFICATION: Labat's text dates the coronation to April 1715; only the plates say 1725.", "des_marchais_labat_1730_voyage"),
  L("hueda-coronation-rite-allada-crowner", "hueda-coronation-and-serpent-processions-1725", "related", "The coronation rite itself, which precedes the processions that record describes."),
  L("des-marchais-hueda-plates", "hueda-coronation-and-serpent-processions-1725", "related", "What the plates used in that record show, and where they depart from the text."),
  L("hueda-royal-women-in-serpent-rites", "dangbe-wives-in-european-accounts", "related", "Royal women in the rites, kept apart from the serpent's initiated wives that record covers."),
  L("hueda-python-oracle-braguez", "hueda-serpent-priesthood-and-the-king", "evidence_for", "The oracle's total mediation by the priest is the basis of the priestly power that record describes."),
  L("hueda-python-parade-feasts-in-motion", "hueda-serpent-priesthood-and-the-king", "related", "The economic side of the priests' demands on the king."),
  L("hueda-python-parade-feasts-in-motion", "dahomey-soldiers-and-the-pythons-1727", "related", "Norman links the curtailed parades to the failure to defend Savi in 1727."),
  L("savi-hueda-archaeological-project-1991-2010", "savi-excavated", "responds_to", "Supplies the excavation reports that record says it lacks."),
  L("savi-hueda-archaeological-project-1991-2010", "hueda-kingdom-and-savi", "related", "The archaeology of the capital described there."),
  L("savi-palace-to-python-house-route", "temple-of-pythons-today", "related", "Whether today's temple at Ouidah is the principal temple of the Hueda era is not established."),
  L("savi-palace-to-python-house-route", "temple-of-pythons-1717-tradition", "related", "The 1717 founding tradition may concern a relocation of the cult's house to Ouidah."),
  L("savi-palace-to-python-house-route", "bosman-describes-the-serpent-at-whydah", "related", "Bosman's placing of the snake house under a lofty tree two Dutch miles from the king's village."),
  L(ANCHOR, "dan-the-serpent", "related", "benin-vodun's outline of Dan, which this overview distinguishes from Dangbé and Aido-Hwedo."),
  L(ANCHOR, "aido-hwedo-the-rainbow-serpent", "related", "The rainbow serpent's cosmology, as recorded by Burton and the Herskovitses."),
  L(ANCHOR, "not-one-theology", "related", "The three serpent powers illustrate why Gbe religion is not one theology."),
  L(ANCHOR, "gbe-languages-and-the-vocabulary-of-the-sacred", "related", "The Gbe continuum in which 'dan' means snake and '-si' means wife of a vodun."),
  L("dan-worship-origins-and-movement", "dahomey-takes-dangbe-under-protection", "related", "The documented absorption of Dangbé into Dahomey's pantheon after 1727."),
  L("dan-worship-origins-and-movement", "how-the-serpent-came-to-hueda", "related", "Hueda's own three stories of the serpent's arrival, not repeated here."),
  L("dan-worship-origins-and-movement", "tado-as-a-religious-source", "related", "The other great claimed source of Gbe cults."),
  L("dan-worship-origins-and-movement", "serpent-symbolism-across-the-atlantic", "precedes", "Dan cults moved within the Gbe region before and while their names crossed the Atlantic."),
  L("dan-worship-origins-and-movement", "kpasse-forest-ouidah", "related", "Kpassè, Ouidah's founder-turned-tree, is a Hueda ancestor served at Ouidah beside the python."),
  L("savi-palace-to-python-house-route", "kpasse-sacred-forest-and-sacred-forest-law", "related", "Ouidah's other sacred site of Hueda origin, protected as a sacred forest."),
  L("hueda-python-oracle-braguez", "divination-fa-ifa-afa-comparison", "related", "The serpent oracle is distinct from Fa divination, which that record compares."),
  L("agbo-dangbe-hymn-opened-the-eyes", "hueda-serpents-egypt-and-israel-speculation", "related", "European speculation linking Hueda's serpent to Israel began in the eighteenth century, long before the hymn was printed."),
  L("des-marchais-hueda-plates", "european-accounts-of-hueda-copied-each-other", "related", "The plates were copied through Dutch, German and English compilations, as the texts were."),
  L("savi-serpent-ditch-argument", "vodun-kingdoms-religion-and-royal-power", "related", "Landscape as one of the ways royal power and vodun held each other up."),
  L("merlo-vidaud-dangbe-universal-serpent", "dan-aido-hwedo-and-the-cosmic-serpent-comparison", "related", "That record tests the 'universal serpent' idea that Merlo and Vidaud proposed."),
  L("merlo-vidaud-dangbe-universal-serpent", "okomilo-benin-palace-pythons", "related", "Another West African royal python tradition, compared without assuming a common origin."),

  // ---- to the other lanes' anchors
  L(ANCHOR, A.words, "related", "The word comparison weighs Gbe 'dan' (snake) against Hebrew Dān; this overview says which Gbe serpent is meant."),
  L(ANCHOR, A.rituals, "related", "The gods-compared lane compares Dan, Dangbé and Aido-Hwedo one at a time, as distinguished here."),
  L(ANCHOR, A.dan, "related", "The biblical tribe of Dan, whose name is compared with the Gbe serpent word."),
  L(ANCHOR, A.assessment, "evidence_for", "The overview's distinctions feed the conclusion's weighing of shared-name and shared-mythology hypotheses."),
  L("savi-serpent-ditch-argument", A.egypt, "related", "The sacred-landscape comparison sets Savi's ditches beside Egyptian temple enclosures."),
  L("savi-serpent-ditch-argument", A.kush, "related", "The sacred-landscape comparison also sets Savi beside Kushite temple precincts."),
  L("hueda-coronation-rite-allada-crowner", A.egypt, "related", "The comparison of Egyptian royal ceremonies with Hueda coronations uses this sequence of actions."),
  L("hueda-coronation-rite-allada-crowner", A.kush, "related", "Kushite coronation is compared with this rite in the rituals lane."),
  L("dan-worship-origins-and-movement", A.routes, "evidence_for", "Gbe origin traditions point to Tado, Allada and the Mahi hills: evidence for Route D, local development."),
  L("dan-worship-origins-and-movement", A.africanJewish, "related", "African Jewish communities are a separate question; no Gbe tradition reached here names them."),
  L("agbo-dangbe-hymn-opened-the-eyes", A.rituals, "related", "The comparison of Genesis 3 with the hymn links to this record of the hymn itself."),
  L("hueda-python-oracle-braguez", A.egypt, "related", "Egyptian temple oracles are compared with the Hueda python oracle in the rituals lane."),
];

export const GBE: SerpentSection = { sources, events, links };
