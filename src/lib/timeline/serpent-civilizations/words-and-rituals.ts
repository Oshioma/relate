// SECTION: WORDS COMPARED, AND GODS, RITUALS AND LANDSCAPES COMPARED.
//
// Two lanes of "The Serpent Across Civilizations" (see ./shared.ts).
//
// WORDS. Does Hebrew Dān ("he judged") have anything to do with Gbe dan
// ("snake")? The answer is worked from the forms, not the sounds: every Gbe,
// Semitic, Egyptian and wider African form is given with its script, gloss,
// earliest attestation and source, and the full dataset is in
// /mnt/project-files/serpent-civilizations/lexicon.md. A finding of this
// section: the Gbe rows of the table in Oshi's request are, letter for letter,
// the cognate list of the English Wiktionary entry for Gun "odàn", which cites
// Capo (1991) p. 222 only for the proto-form. Ewe "da" and Fon "Danh" were
// confirmed independently (Westermann 1905/1930; Burton 1864).
//
// RITUALS. The fourteen figures (gods.md, 14 x 13) and the twenty-five ritual
// items (rituals.md, 25 rows, one assessment per pair of traditions) are
// grouped into records, each a comparison with one of the five assessments.
//
// HOW IT WAS RESEARCHED. Read in full text in this session: Westermann's Ewe
// dictionaries (1905, 1930), Burton (1864, vol. 2), Bouche (1885), Labat
// (1730, vol. 2, searched), Dillmann (1865), Christaller (1881), Crowther
// (1852), Williams (1930, searched), Norman's 2014 chapter on Hueda pythons,
// the Hebrew text (openscriptures WLC) and KJV, and the reference notes of
// Merlo and Vidaud (1966) on Cambridge Core. Not opened: Capo 1991 (read
// through Wiktionary's transcription), Agbo 1959 (behind a Cloudflare check),
// Norman and Kelly 2004 (paywalled), DULAT, the Wörterbuch, Crum. Those are
// marked where they carry a claim.

import type { SeedEvent, SeedEventLink, SeedSource } from "../seed-types";
import { SERPENT_LANE_ANCHORS, bce, commonsPicture, serpentTags, type SerpentSection } from "./shared";

const WORDS = SERPENT_LANE_ANCHORS.words;
const RITUALS = SERPENT_LANE_ANCHORS.rituals;
const A = SERPENT_LANE_ANCHORS;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // ---- Canonical keys shared across the track ---------------------------------
  {
    key: "wlc_hebrew_bible",
    title: "Westminster Leningrad Codex",
    author: "J. Alan Groves Center for Advanced Biblical Research (digital text of the Leningrad Codex)",
    publisher: "Open Scriptures Hebrew Bible (morphhb), from the WLC 4.x text",
    reference: "Gen 1:21; 3:1, 5–7; 30:6; 49:16–17; Num 21:6–9; 2 Kgs 18:4",
    url: "https://github.com/openscriptures/morphhb",
    sourceType: "religious_text",
    publishedDisplay: "manuscript 1008/9 CE; digital text 2016 onward",
    notes:
      "Cited for the Hebrew text of the verses quoted, copied in this session from the openscriptures OSIS files (Gen.xml, Num.xml, 2Kgs.xml). Cited FOR what the words are — דָּן, דָּנַנִּי, נָחָשׁ, שְׁפִיפֹן, תַּנִּין, נְחֻשְׁתָּן — not for the date of any event the text narrates.",
  },
  {
    key: "kjv_bible",
    title: "The Holy Bible, King James Version",
    author: "King James translators (1611; standard 1769 Oxford text)",
    reference: "Gen 3:1, 5–7; 30:6; 49:16–17; Num 21:8–9; 2 Kgs 18:4",
    url: "https://bible-api.com/genesis+3:5-7?translation=kjv",
    sourceType: "religious_text",
    publishedYear: 1611,
    publishedDisplay: "1611; 1769 text",
    notes:
      "Cited for the public-domain English rendering of the Hebrew verses, fetched in this session. VIEWPOINT: a seventeenth-century Protestant translation; 'adder' for šəfîfōn and 'brasen serpent' for Nehushtan are its choices, not facts about the Hebrew.",
  },
  {
    key: "capo_1991_comparative_phonology_gbe",
    title: "A Comparative Phonology of Gbe",
    author: "Hounkpati B. Christophe Capo",
    publisher: "Foris (Berlin and New York) and Labo Gbe (Garome, Bénin); Publications in African Languages and Linguistics 14",
    reference: "Proto-Gbe lexicon: *-dã 'snake' p. 222; *-dãgbói 'python' p. 221; *ʁʷũ 'open (door)' p. 220; *-gbɛ 'life' p. 218; *vodṹ 'deity' p. 214",
    url: "https://doi.org/10.1515/9783110870534",
    sourceType: "academic_book",
    publishedYear: 1991,
    publishedDisplay: "1991 (revision of a University of Ghana thesis, 1981)",
    notes:
      "THE STANDARD RECONSTRUCTION of Proto-Gbe, cited for the reconstructed snake and python words. NOT OPENED IN THIS SESSION: the forms and page numbers were read in Wiktionary's 'Appendix:Proto-Gbe reconstructions', which transcribes Capo. NEEDS SOURCE VERIFICATION against p. 222 itself, especially for tone, which the transcription omits.",
  },
  {
    key: "norman_kelly_2004_landscape_politics",
    title: "Landscape Politics: The Serpent Ditch and the Rainbow in West Africa",
    author: "Neil L. Norman and Kenneth G. Kelly",
    publisher: "American Anthropologist 106 (1)",
    reference: "American Anthropologist 106 (1), March 2004, pp. 98–110 (metadata confirmed via Crossref)",
    url: "https://doi.org/10.1525/aa.2004.106.1.98",
    sourceType: "academic_paper",
    publishedYear: 2004,
    publishedDisplay: "2004",
    notes:
      "THE ARGUMENT that the massive ditches of Savi and Dahomey (c. 17th–19th centuries) referenced cosmology — the serpent and the rainbow — rather than the military designs European travellers saw in them. Cited for that interpretation. The abstract was read via Crossref; the full text was paywalled and is known here through Norman's own 2014 summary. VIEWPOINT: archaeological interpretation drawing on present-day Hueda associations.",
  },
  {
    key: "des_marchais_labat_1730_voyage",
    title: "Voyage du chevalier Des Marchais en Guinée, isles voisines, et à Cayenne, fait en 1725, 1726 & 1727",
    author: "Jean-Baptiste Labat (from the papers of Renaud Des Marchais)",
    publisher: "Saugrain, Paris",
    reference: "Vol. 2: the serpent of Juda (approx. pp. 165–200); the coronation plate 'Couronnement du Roy de Juda à la coste de Guinée au Mois d'Avril 1725' and its 24-item legend",
    url: "https://archive.org/details/voyageduchevali02labagoog",
    sourceType: "primary",
    publishedYear: 1730,
    publishedDisplay: "1730",
    notes:
      "Cited for the Hueda coronation plate, whose legend was read in this session (the king, his wives, his dwarfs, a grandee holding the parasol, drums and trumpets, 'the grandee of Ardres who performs the coronation', 'a hut for a serpent about to give birth', 'the serpent'), and for the serpent consulted 'for rain, for good weather or in case of sickness or war' (as quoted by Merlo and Vidaud). The text dates the coronation to 1715 and the plate to April 1725 — see the gbe lane record hueda-coronation-1715-or-1725.",
  },
  {
    key: "agbo_1959_histoire_de_ouidah",
    title: "Histoire de Ouidah du XVIe au XXe siècle",
    author: "Casimir Agbo (dit Alidji)",
    publisher: "Les Presses universelles, Avignon",
    reference: "p. 16 (the hymn to Dagbé, per Merlo and Vidaud 1966, n. 29); an earlier version in Notes Africaines no. 31 (IFAN, Dakar, July 1946), p. 24 (Merlo and Vidaud, n. 28)",
    sourceType: "book",
    publishedYear: 1959,
    publishedDisplay: "1959",
    notes:
      "Cited for the Houéda praise-song 'chanted by the indigenous priests in ceremonies in honour of the fetish Dagbé', and for the tradition that King Kpassè brought Dagbé from Adja-Kpétékammè (Mono). NOT OPENED: a modern reissue's excerpt sits behind a Cloudflare check, and those two statements were read only in a search-engine extract. The exact Houéda wording of the hymn NEEDS SOURCE VERIFICATION against p. 16. VIEWPOINT: a local historian of Ouidah writing in French in the late colonial period.",
  },
  {
    key: "merlo_vidaud_1966_black_serpent",
    title: "The Black Serpent Who Opened the Eyes of Man",
    author: "Christian Merlo and Pierre Vidaud",
    publisher: "Diogenes 14 (55)",
    reference: "Diogenes 14 (55), September 1966, pp. 61–88 (Cambridge Core metadata); notes 26–31 and 48–51 read in this session",
    url: "https://doi.org/10.1177/039219216601405505",
    sourceType: "academic_paper",
    publishedYear: 1966,
    publishedDisplay: "1966",
    notes:
      "Cited for the earliest publication history of the 'opened eyes' tradition, which its notes trace through Abbé Bouche (Le Contemporain, December 1874), Father Kitti (La Reconnaissance africaine, 1927), Agbo (1946 and 1959) and Hazoumé (1957); for its own remark (n. 48) that in Genesis the eyes open after eating the fruit while Dangbé 'unseals the eyes with a vegetable medicine', that 'approximations like these favour syncretisms', and that 'we never heard any mention of good and evil, as related by the Abbé Bouche'. The article text was paywalled; the abstract and notes were read.",
  },
  {
    key: "law_1991_slave_coast",
    title: "The Slave Coast of West Africa 1550–1750: The Impact of the Atlantic Slave Trade on an African Society",
    author: "Robin Law",
    publisher: "Clarendon Press, Oxford",
    reference: "Chapters on Hueda politics and religion and the Dahomean conquest of 1727",
    sourceType: "academic_book",
    publishedYear: 1991,
    publishedDisplay: "1991",
    notes:
      "THE STANDARD HISTORY of Allada and Hueda, cited for the political setting of Hueda kingship, Allada's seniority and the 1727 conquest. Not opened in this session; cited at chapter level through Norman (2014), who relies on it. NEEDS SOURCE VERIFICATION for specific pages.",
  },
  {
    key: "blier_1995_african_vodun",
    title: "African Vodun: Art, Psychology, and Power",
    author: "Suzanne Preston Blier",
    publisher: "University of Chicago Press",
    sourceType: "academic_book",
    publishedYear: 1995,
    publishedDisplay: "1995",
    reference: "University of Chicago Press, 1995; ISBN 0-226-05858-9",
    notes:
      "Cited for the meaning of vodun as a category, for Dan and the serpent within Fon art and thought, and (through Norman 2014) for Hueda oral history of Dangbé. Not opened in this session; cited at book level. NEEDS SOURCE VERIFICATION for specific pages.",
  },

  // ---- Dictionaries and early word records read in this session -------------
  {
    key: "westermann_1905_ewe_worterbuch",
    title: "Wörterbuch der Ewe-Sprache. I. Teil: Ewe-Deutsches Wörterbuch",
    author: "Diedrich Westermann",
    publisher: "Dietrich Reimer (Ernst Vohsen), Berlin",
    reference: "s.v. da ('Schlange'); dagbe (D.) 'Schlange (heilige). cf. da'; dagbe (D.) 'gut; zu agbe Leben'; Dahome ('da ho me ... im Schlangenhaus oder -bauch'); introduction on the Yewe cult language ('Da, „Schlange“, auch Voduda')",
    url: "https://archive.org/details/wrterbuchderewe01westgoog",
    sourceType: "academic_book",
    publishedYear: 1905,
    publishedDisplay: "1905",
    notes:
      "THE FIRST LARGE EWE DICTIONARY, by a missionary linguist, read in full text in this session. Cited for Ewe 'da' snake; for 'dagbe', marked as a Dahomey-dialect word for the sacred snake; for the homophone 'dagbe' 'good' (from 'agbe' life); and for a German missionary folk-etymology of 'Dahome' as 'in the snake's house or belly'. The OCR does not show tones.",
  },
  {
    key: "westermann_1930_gbesela_yeye",
    title: "Gbesela Yeye, or English-Ewe Dictionary",
    author: "Diedrich Westermann",
    publisher: "Dietrich Reimer, Berlin",
    reference: "s.v. 'serpent n. da'; 'snake n. da'; 'water-snake n. tomeda'",
    url: "https://archive.org/details/gbeselayeyeengli0000dwes",
    sourceType: "academic_book",
    publishedYear: 1930,
    publishedDisplay: "1930",
    notes:
      "Cited as the second, English-language confirmation of Ewe 'da' snake, read in full text in this session. Same author as the 1905 dictionary, so not independent of it.",
  },
  {
    key: "burton_1864_mission_to_gelele",
    title: "A Mission to Gelele, King of Dahome",
    author: "Richard F. Burton",
    publisher: "Tinsley Brothers, London",
    reference: "Vol. 2: footnote glossing 'Danh (snake, or rainbow), to (water ...), and men (in)'; 'the Danh-gbwe, whose worship has been described ... it has 1000 Danh-si or snake wives'; vodun no. 23, 'Aydo-whe-do, — commonly called Danh, the Heavenly Snake, which makes the Popo beads and confers wealth upon man, — is the rainbow'",
    url: "https://archive.org/details/missiontogelelek02burt_0",
    sourceType: "primary",
    publishedYear: 1864,
    publishedDisplay: "visit 1863–64; published 1864",
    notes:
      "THE EARLIEST GLOSSED RECORD OF THE FON WORD found in this session: 'Danh (snake, or rainbow)'. Read in full text. Cited for the word, for 'Danh-gbwe' (Dangbé) and for Aido-Hwedo 'commonly called Danh'. VIEWPOINT: a British consul with strong prejudices, writing his informants' words in English spelling, without tones.",
  },
  {
    key: "bouche_1885_cote_des_esclaves",
    title: "Sept ans en Afrique occidentale: La Côte des Esclaves et le Dahomey",
    author: "Pierre Bouche",
    publisher: "Plon, Paris",
    reference: "pp. 268–269 (a Yoruba tradition: 'L'homme et la femme eurent les yeux ouverts par le serpent', which Bouche says seems 'calqué sur la Bible'); pp. 272–273 (Ophites and Dahomeans); pp. 385–387 ('Voici l'histoire du serpent, telle que nous l'avons entendu raconter à Wydah: Dan ou Danghé (le serpent sacré) ... Dieu ayant fait le premier homme et la première femme aveugles, Dan leur ouvrit les yeux, et ils virent le bien et le mal')",
    url: "https://archive.org/details/lactedesesclav00bouc",
    sourceType: "primary",
    publishedYear: 1885,
    publishedDisplay: "residence at Ouidah September 1866–April 1868; published 1885",
    notes:
      "THE EARLIEST RECORDED VERSION of the 'opened eyes' tradition found in this session, read in full text: heard at Ouidah by a Catholic missionary of the Société des Missions Africaines who was there from 1866 to 1868. Cited for it AND for the frame he put on it: he compares it at once with Genesis and with the Gnostic Ophites, 'who venerated the serpent because it had opened the eyes of our first parents and made them know good and evil'. VIEWPOINT: a missionary looking for a primitive revelation in African tradition.",
  },
  {
    key: "dillmann_1865_lexicon_aethiopicae",
    title: "Lexicon linguae aethiopicae cum indice latino",
    author: "August Dillmann",
    publisher: "T. O. Weigel, Leipzig",
    reference: "s.v. ʾarwē (አርዌ), sense 2 'in specie: serpens, anguis, aspis, draco', citing Gen 3:1; s.v. tämän (ተመን) 'serpens ingens, draco'",
    url: "https://archive.org/details/lexiconlinguaeae00dilluoft",
    sourceType: "academic_book",
    publishedYear: 1865,
    publishedDisplay: "1865",
    notes:
      "Cited for the Ge'ez serpent words, read in full text in this session (the OCR of the Ethiopic is poor; the Latin glosses are clear). Shows that the Ge'ez Bible's serpent of Eden is ʾarwē, not anything resembling dan.",
  },
  {
    key: "christaller_1881_twi_dictionary",
    title: "A Dictionary of the Asante and Fante Language called Tshi (Chwee, Twi)",
    author: "Johann Gottlieb Christaller",
    publisher: "Basel Evangelical Missionary Society, Basel",
    reference: "s.v. o-wo, pl. a-: 'snake, serpent'",
    url: "https://archive.org/details/dictionaryofasan00chriuoft",
    sourceType: "academic_book",
    publishedYear: 1881,
    publishedDisplay: "1881",
    notes: "Cited for Akan (Twi) ɔwɔ 'snake, serpent', read in full text in this session: the nearest large Kwa neighbour of Gbe has an unrelated snake word.",
  },
  {
    key: "crowther_1852_yoruba_vocabulary",
    title: "A Vocabulary of the Yoruba Language",
    author: "Samuel Crowther",
    publisher: "Seeleys, London",
    reference: "s.v. 'Ejo, s. serpent, snake'",
    url: "https://archive.org/details/vocabularyofyoru00crow",
    sourceType: "academic_book",
    publishedYear: 1852,
    publishedDisplay: "1852",
    notes: "Cited for Yoruba ejò 'serpent, snake', read in full text in this session. Yoruba is the Gbe coast's other great neighbour; its snake word is unrelated to dan.",
  },
  {
    key: "wiktionary_gun_odan",
    title: "odàn (Gun), English Wiktionary entry",
    author: "Wiktionary contributors",
    publisher: "Wikimedia Foundation",
    reference: "Entry 'odan', section Gun: 'From Proto-Gbe *-dã [Capo 1991: 222]. Cognates include Fon dàn, Saxwe odàn, Aja edan and Ewe da'; IPA /ō.dã̀/",
    url: "https://en.wiktionary.org/wiki/odan",
    sourceType: "website",
    publishedDisplay: "accessed 2026-10-19",
    notes:
      "Cited AS THE SOURCE OF THE GBE ROWS IN THE REQUEST'S TABLE, which reproduce this entry's cognate list exactly. Its cognates carry no reference of their own; only the proto-form is referenced to Capo. VIEWPOINT: a crowd-written dictionary; useful as a conduit, not as an authority.",
  },
  {
    key: "wiktionary_proto_gbe_appendix",
    title: "Appendix:Proto-Gbe reconstructions, English Wiktionary",
    author: "Wiktionary contributors",
    publisher: "Wikimedia Foundation",
    reference: "Rows 'snake *-dã 222', 'python *-dãgbói 221', 'open (door) *ʁʷũ 220', 'life *-gbɛ 218', 'deity *vodṹ 214'",
    url: "https://en.wiktionary.org/wiki/Appendix:Proto-Gbe_reconstructions",
    sourceType: "website",
    publishedDisplay: "accessed 2026-10-19",
    notes: "Cited as the conduit through which Capo's reconstructions and page numbers were read in this session. A transcription of a book, not the book.",
  },
  {
    key: "wiktionary_hausa_wolof_snake",
    title: "macìjī (Hausa) and jaan (Wolof), English Wiktionary entries",
    author: "Wiktionary contributors",
    publisher: "Wikimedia Foundation",
    reference: "Hausa 'macìjī, pl. macìjai: snake, serpent'; Wolof 'jaan: snake'",
    url: "https://en.wiktionary.org/wiki/maciji",
    sourceType: "website",
    publishedDisplay: "accessed 2026-10-19",
    notes: "Cited for the Hausa and Wolof snake words only, as a conduit; no printed dictionary of either language was opened in this session.",
  },
  {
    key: "dulat_2015_ugaritic",
    title: "A Dictionary of the Ugaritic Language in the Alphabetic Tradition",
    author: "Gregorio del Olmo Lete and Joaquín Sanmartín",
    publisher: "Brill, Leiden (Handbook of Oriental Studies 112), 3rd revised edition",
    reference: "s.vv. nḥš, tnn, bṯn, dn",
    sourceType: "academic_book",
    publishedYear: 2015,
    publishedDisplay: "3rd ed. 2015 (1st Spanish ed. 1996–2000)",
    notes:
      "THE STANDARD UGARITIC DICTIONARY, cited for the Ugaritic serpent words nḥš, tnn and bṯn and the verb dn 'to judge'. Not opened in this session; the tablet references (KTU 1.3, 1.5, 1.6, 1.17, 1.100, 1.107) are the standard ones and NEED SOURCE VERIFICATION line by line.",
  },
  {
    key: "erman_grapow_wb",
    title: "Wörterbuch der ägyptischen Sprache",
    author: "Adolf Erman and Hermann Grapow (eds)",
    publisher: "J. C. Hinrichs, Leipzig (5 vols and Belegstellen); online in the Thesaurus Linguae Aegyptiae",
    reference: "s.vv. ḥfꜣw 'snake', ꜥꜣpp 'Apophis', jꜥrt 'uraeus', wꜣḏyt 'Wadjet'",
    url: "https://thesaurus-linguae-aegyptiae.de",
    sourceType: "academic_book",
    publishedYear: 1926,
    publishedDisplay: "1926–1931",
    notes:
      "THE STANDARD EGYPTIAN DICTIONARY, cited for the Egyptian serpent words. Not opened in this session; the forms were checked only in Wiktionary's Egyptian entries (ḥfꜣw 'snake, worm'; jꜥrt 'uraeus', from jꜥr 'to ascend'). First occurrences NEED SOURCE VERIFICATION.",
  },
  {
    key: "crum_1939_coptic_dictionary",
    title: "A Coptic Dictionary",
    author: "Walter Ewing Crum",
    publisher: "Clarendon Press, Oxford",
    reference: "s.v. ϩⲟϥ 'snake'",
    url: "https://archive.org/details/copticdictionary0000crum",
    sourceType: "academic_book",
    publishedYear: 1939,
    publishedDisplay: "1939",
    notes:
      "Cited for Coptic ϩⲟϥ (hof) 'snake', the descendant of Egyptian ḥfꜣw. The archive.org OCR was too poor to locate the entry; the etymology is standard but the page NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "williams_1930_hebrewisms",
    title: "Hebrewisms of West Africa: From Nile to Niger with the Jews",
    author: "Joseph J. Williams",
    publisher: "Lincoln MacVeagh / The Dial Press, New York",
    url: "https://archive.org/details/hebrewismsofwest00will",
    sourceType: "book",
    publishedYear: 1930,
    publishedDisplay: "1930",
    notes:
      "Cited in genealogies as the best-known early twentieth-century argument for Hebrew survivals in West Africa (chiefly among the Ashanti), by a Jesuit anthropologist. Searched in full text in this session: it discusses the Dahomean python cult and cites Bouche, but does not equate Hebrew Dān with Gbe dan. VIEWPOINT: diffusionist.",
  },

  // ---- Modern scholarship on the comparanda --------------------------------
  {
    key: "norman_2014_pythons_pigs",
    title: "Pythons, Pigs, and Political Process in the Hueda Kingdom, Benin, West Africa AD 1650–1727",
    author: "Neil L. Norman",
    publisher: "In Benjamin S. Arbuckle and Sue Ann McCarty (eds), Animals and Inequality in the Ancient World, University Press of Colorado, Boulder",
    reference: "Chapter 14 (read in full on the publisher's open reading platform in this session)",
    url: "https://read.upcolorado.com/read/animals-and-inequality-in-the-ancient-world/section/519f78d2-12b8-4cfd-ad21-97b8e1d432cb",
    sourceType: "academic_paper",
    publishedYear: 2014,
    publishedDisplay: "2014",
    notes:
      "THE EXCAVATOR'S OWN SUMMARY of Hueda archaeology, read in full. Cited for: the Savi palace (c. 1.5 x 1 km) and a settlement area of c. 100 km²; ditches that were clay borrow-pits around house compounds, 'much like a coiled snake'; 'Huedans today associate ditches with pythons'; the royal parade to the python's temple with drummers, trumpeters, praise-singers and gifts of silk and cowries; and the burnt destruction layer of 1727. Also cited because it says Merlo and Vidaud recorded that Dangbé confers 'the knowledge of good and evil' — which Merlo and Vidaud's own note 48 denies hearing.",
  },
  {
    key: "greer_2013_dinner_at_dan",
    title: "Dinner at Dan: Biblical and Archaeological Evidence for Sacred Feasts at Iron Age II Tel Dan and Their Significance",
    author: "Jonathan S. Greer",
    publisher: "Brill, Leiden (Culture and History of the Ancient Near East 66)",
    sourceType: "academic_book",
    publishedYear: 2013,
    publishedDisplay: "2013",
    reference: "Culture and History of the Ancient Near East 66 (Leiden: Brill, 2013)",
    notes:
      "Cited for the sacrificial and feasting evidence (animal bones, priestly portions) from the sanctuary at Tel Dan, the Israelite term of the sacrifice comparison. Not opened in this session; cited at book level via the dan lane. NEEDS SOURCE VERIFICATION for specific findings.",
  },
  {
    key: "russmann_1974_xxvth_dynasty",
    title: "The Representation of the King in the XXVth Dynasty",
    author: "Edna R. Russmann",
    publisher: "Fondation Égyptologique Reine Élisabeth, Brussels, and Brooklyn Museum",
    sourceType: "academic_book",
    publishedYear: 1974,
    publishedDisplay: "1974",
    reference: "Monographies Reine Élisabeth 3 (Brussels and Brooklyn, 1974)",
    notes:
      "THE STANDARD STUDY of Kushite royal iconography in Egypt, cited for the double uraeus and the close-fitting 'Kushite cap' as Twenty-fifth-Dynasty innovations. Not opened in this session; the meaning of the double uraeus is debated and the interpretation here is labelled as such. NEEDS SOURCE VERIFICATION for specific pages.",
  },
  {
    key: "torok_1997_kingdom_of_kush",
    title: "The Kingdom of Kush: Handbook of the Napatan-Meroitic Civilization",
    author: "László Török",
    publisher: "Brill, Leiden (Handbuch der Orientalistik 1.31)",
    sourceType: "academic_book",
    publishedYear: 1997,
    publishedDisplay: "1997",
    reference: "Handbuch der Orientalistik I.31 (Leiden: Brill, 1997)",
    notes:
      "Cited for Kushite kingship, the coronation journey between the Amun temples of Napata, Kawa, Pnubs and Gematon, the role of the king's mother, Amun's oracle in royal election, and Apedemak at Naqa and Musawwarat es-Sufra. Not opened in this session; cited at book level. NEEDS SOURCE VERIFICATION for specific pages.",
  },
  {
    key: "epigraphic_survey_1994_opet",
    title: "Reliefs and Inscriptions at Luxor Temple, Volume 1: The Festival Procession of Opet in the Colonnade Hall",
    author: "The Epigraphic Survey (Oriental Institute, University of Chicago)",
    publisher: "Oriental Institute Publications 112, Chicago",
    sourceType: "academic_book",
    publishedYear: 1994,
    publishedDisplay: "1994",
    reference: "Oriental Institute Publications 112 (Chicago, 1994): Reliefs and Inscriptions at Luxor Temple, vol. 1, The Festival Procession of Opet in the Colonnade Hall",
    notes:
      "THE FACSIMILE PUBLICATION of the Opet procession reliefs (Tutankhamun, re-inscribed by Horemheb) in the Luxor colonnade, cited for the order of an Egyptian royal festival procession: barques carried by priests, the king officiating, musicians, dancers and offerings. Not opened in this session. Opet is an Amun festival, not a serpent festival.",
  },
  {
    key: "sauneron_1989_ophiologie",
    title: "Un traité égyptien d'ophiologie: Papyrus du Brooklyn Museum nos 47.218.48 et 85",
    author: "Serge Sauneron",
    publisher: "Institut français d'archéologie orientale, Cairo (Bibliothèque générale 11)",
    sourceType: "academic_book",
    publishedYear: 1989,
    publishedDisplay: "1989",
    reference: "Bibliothèque générale 11 (Cairo: IFAO, 1989): Un traité égyptien d'ophiologie (Brooklyn Papyrus 47.218.48 and 85)",
    notes:
      "Cited for the Brooklyn snakebite papyrus: an Egyptian classification of snakes with treatments, and the role of the priests of Serqet as snake-bite healers. Not opened in this session; cited at book level.",
  },
  {
    key: "ikram_2005_divine_creatures",
    title: "Divine Creatures: Animal Mummies in Ancient Egypt",
    author: "Salima Ikram (ed.)",
    publisher: "American University in Cairo Press",
    sourceType: "academic_book",
    publishedYear: 2005,
    publishedDisplay: "2005",
    reference: "American University in Cairo Press, 2005",
    notes:
      "Cited for the Egyptian animal-mummy categories — pets, victual mummies, sacred animals and votive mummies — and for the Late Period and Ptolemaic floruit of votive animal mummification, snakes included. Not opened in this session; cited at book level.",
  },
  {
    key: "faulkner_1937_bremner_rhind",
    title: "The Bremner-Rhind Papyrus — III: D. The Book of Overthrowing ʿApep",
    author: "Raymond O. Faulkner",
    publisher: "Journal of Egyptian Archaeology 23",
    reference: "JEA 23 (1937), pp. 166–185",
    sourceType: "academic_paper",
    publishedYear: 1937,
    publishedDisplay: "1937",
    notes:
      "Cited for the late Egyptian ritual for destroying Apep (Papyrus Bremner-Rhind, British Museum EA 10188, c. 310 BCE): wax and drawn images of the serpent spat on, trampled, speared and burned. Not opened in this session.",
  },
  {
    key: "kendall_mohamed_2016_jebel_barkal",
    title: "A Visitor's Guide to the Jebel Barkal Temples",
    author: "Timothy Kendall and El-Hassan Ahmed Mohamed",
    publisher: "NCAM Mission Project / Qatar-Sudan Archaeological Project, Khartoum",
    sourceType: "book",
    publishedYear: 2016,
    publishedDisplay: "2016",
    reference: "NCAM / Qatar–Sudan Archaeological Project, Khartoum, 2016",
    notes:
      "Cited for the reading of Jebel Barkal's free-standing pinnacle as a colossal rearing uraeus wearing the White Crown, and for Taharqa's temple of Mut (B300) built against the cliff so that the pinnacle appears in that shape, with inscriptions of Taharqa and a later restoration on the pinnacle. Known in this session only through search summaries; NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "herskovits_1938_dahomey",
    title: "Dahomey: An Ancient West African Kingdom",
    author: "Melville J. Herskovits",
    publisher: "J. J. Augustin, New York (2 vols)",
    sourceType: "academic_book",
    publishedYear: 1938,
    publishedDisplay: "1938",
    reference: "J. J. Augustin, New York, 1938; 2 vols",
    notes:
      "THE CLASSIC ETHNOGRAPHY of Dahomean religion, cited for Dan, Aido-Hwedo carrying Mawu and coiling under the earth, Sakpata, Hevioso and Legba, and possession and initiation in the vodun houses. Not opened in this session; Merlo and Vidaud cite vol. 1 p. 179 and vol. 2 p. 160. NEEDS SOURCE VERIFICATION for specific pages.",
  },
  {
    key: "metraux_1959_voodoo",
    title: "Voodoo in Haiti",
    author: "Alfred Métraux",
    publisher: "Oxford University Press, New York (translated by Hugo Charteris; French original 1958)",
    sourceType: "academic_book",
    publishedYear: 1959,
    publishedDisplay: "1958 French; 1959 English",
    reference: "Translated by Hugo Charteris (London: André Deutsch, 1959); French original Le vaudou haïtien (Paris: Gallimard, 1958)",
    notes:
      "Cited for Danbala Wedo and Ayida Wedo in the Haitian Rada rite: the serpent lwa and his rainbow wife, their white offerings and vèvè. Not opened in this session; cited at book level.",
  },
];

// ---------------------------------------------------------------------------
// Pictures (every Commons file page read in this session; licences as stated there)
// ---------------------------------------------------------------------------

const pLabat = commonsPicture({
  fileName: "Labat CourOuidah 1725 B002.png",
  caption:
    "'Couronnement du Roy de Juda à la coste de Guinée au Mois d'Avril 1725': an eighteenth-century engraving printed in 1730 in Labat's edition of Des Marchais's voyage. A European engraving made after a French captain's drawing, not a photograph. Its numbered legend names the king (2), a grandee with the parasol (3), the king's wives prostrate (4), the European directors (5–8), dwarfs (9), drums and trumpets (12), 'the grandee of Ardres who performs the coronation' (13), 'a hut for a serpent about to give birth' (23) and 'the serpent' (24).",
  shows: "engraving",
  identificationStatus: "secure",
  licence: "Public domain (PD-old-100)",
  creator: "J.-B. Labat (?) after Renaud Des Marchais",
  objectDate: "1725–1730",
});

const pSaviPlan = commonsPicture({
  fileName: "Plan du palais du roy à Xavier ou Sabi dans le royaume de Whidah - tiré de Marchais - btv1b85955929.jpg",
  caption:
    "'Plan du palais du roy à Xavier ou Sabi dans le royaume de Whidah, tiré de Marchais': an eighteenth-century European plan of the Hueda royal palace at Savi, printed in 1747 after Des Marchais. A drawn plan of the palace walls and courts as a French visitor recorded them; the serpent ditches of the archaeology are not identifiable on it.",
  shows: "map",
  identificationStatus: "secure",
  licence: "Public domain (PD-France; PD-US-expired)",
  creator: "Renaud Des Marchais (cartographer)",
  institution: "Bibliothèque nationale de France, Cartes et plans, GE DD-2987 (8232)",
  objectDate: "1747",
});

const pTemplePythons = commonsPicture({
  fileName: "Temple des Pythons de Ouidah 02.jpg",
  caption: "The Temple of Pythons at Ouidah, the present-day house of Dangbé, photographed in September 2020.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Gildaskiki",
  objectDate: "2020",
});

const pPythonHut = commonsPicture({
  fileName: "Ouidah-Temple des Pythons-Petite case ronde (1).jpg",
  caption: "One of the two small round huts in the first court of the Temple of Pythons, Ouidah, photographed in March 2017.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Ji-Elle",
  objectDate: "2017",
});

const pPython = commonsPicture({
  fileName: "Python regius - ball python.jpg",
  caption:
    "A royal or ball python (Python regius), photographed in 2010: the small, harmless constrictor that the Hueda and the Temple of Pythons venerate as Dangbé. A python, not a cobra — it has no hood, no venom and no rearing posture.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY 2.0",
  creator: "Brian Gratwicke",
  objectDate: "2010",
});

const pCobra = commonsPicture({
  fileName: "Egyptian cobra (Naja haje) at Jacksonville Zoo.jpg",
  caption:
    "An Egyptian cobra (Naja haje) at Jacksonville Zoo, photographed in 2013: the venomous, hooded snake that the uraeus and Wadjet represent. A different family from the python (Elapidae, not Pythonidae).",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY-SA 3.0",
  creator: "Moe Epsilon",
  objectDate: "2013",
});

const pLeningrad1b = commonsPicture({
  fileName: "Leningrad Codex Folio 001b.jpg",
  caption:
    "Folio 1v of the Leningrad Codex (1008/9 CE), the first page of Genesis (1:1–26). Gen 1:21's 'great tannînim' is on this page; it is shown here as the manuscript the Hebrew text of this track is taken from, not as a page containing the verses about Dan.",
  shows: "manuscript",
  identificationStatus: "secure",
  licence: "Public domain (PD-Art; PD-old-100)",
  creator: "Unknown author",
  institution: "National Library of Russia, St Petersburg",
  objectDate: "1008–1011",
});

const pLeningrad2b = commonsPicture({
  fileName: "Leningrad Codex Folio 002b.jpg",
  caption: "Folio 2v of the Leningrad Codex (1008/9 CE), carrying Genesis 2:19–3:18 — the serpent, the fruit and the opened eyes of Gen 3:5–7 — in the manuscript on which the Westminster Leningrad Codex text is based.",
  shows: "manuscript",
  identificationStatus: "secure",
  licence: "Public domain (PD-Art; PD-old-100)",
  creator: "Unknown author",
  institution: "National Library of Russia, St Petersburg",
  objectDate: "1008–1011",
});

const pGbeMap = commonsPicture({
  fileName: "Gbe languages.png",
  caption:
    "A modern linguistic map of the Gbe languages (Ewe, Gen, Aja, Fon, Gun, Phla-Phera and others) across south-eastern Ghana, Togo and Bénin, drawn in 2004 by Mark Dingemanse after Capo (1988, 1991). A modern diagram, not a historical map.",
  shows: "map",
  identificationStatus: "secure",
  licence: "CC BY 2.0",
  creator: "Mark Dingemanse",
  objectDate: "2004",
});

const pBaalTablet = commonsPicture({
  fileName: "Mythological poem Baal death AO16641 AO16642 mp3h8927.jpg",
  caption:
    "Tablet of the Ugaritic Baal cycle, 'Baal and Death' (Louvre AO 16641 and AO 16642), found at Ras Shamra by C. Schaeffer in 1930–31 and dated by the Louvre to the fourteenth century BCE; photographed in 2007. The poem in which the serpents Lotan (ltn) and bṯn appear is in this cycle.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CeCILL / CC BY-SA 2.0 FR",
  creator: "Rama",
  institution: "Musée du Louvre",
  accessionNumber: "AO 16641, AO 16642",
  objectDate: "14th century BCE (Louvre label)",
});

const pWadjetNyuserre = commonsPicture({
  fileName:
    "Pharaoh Nyuserre Ini protected by Wadjet and receives life from Anubis. Painted wall fragment from the mortuary temple of Nyuserre Ini at Abusir. Neues Museum.jpg",
  caption:
    "Painted relief fragment from the mortuary temple of King Nyuserre Ini at Abusir (Fifth Dynasty, 25th century BCE), showing the king protected by Wadjet and receiving life from Anubis; Neues Museum, Berlin, photographed in 2019. Old Kingdom evidence of the cobra goddess as royal protector.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Osama Shukir Muhammed Amin FRCP(Glasg)",
  institution: "Neues Museum, Berlin",
  objectDate: "25th century BCE",
});

const pShabaqo = commonsPicture({
  fileName: "Shabaqo-DonationStela.jpg",
  caption:
    "Donation stela of the Kushite king Shabaqo (Twenty-fifth Dynasty, c. 713–698 BCE), showing the king offering the hieroglyph for 'field' to Horus of Pe and the cobra goddess Wadjet; Metropolitan Museum of Art. A Kushite pharaoh serving the Egyptian cobra goddess of Buto — documented Egypt–Kush religious exchange.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 2.5",
  creator: "Keith Schengili-Roberts (photograph); AnnekeBart (derivative)",
  institution: "Metropolitan Museum of Art, New York",
  objectDate: "c. 713–698 BCE",
});

const pTaharqa = commonsPicture({
  fileName: "Taharqa in double uraeus cap.jpg",
  caption:
    "UNVERIFIED — a small bronze royal figure in a museum case, identified on its file page as the Kushite pharaoh Taharqa (690–664 BCE) wearing the cap with a double uraeus. What is unverified: the holding museum and object number are not given, and at this resolution the two cobras at the brow cannot be made out. What it shows: a standing bronze king in a close cap and kilt, hands held before the chest.",
  shows: "artefact",
  identificationStatus: "unverified",
  licence: "CC BY-SA 4.0",
  creator: "EditorfromMars",
  objectDate: "photographed 2020",
});

const pThroneUraei = commonsPicture({
  fileName: "Golden Uraes Cobra Tutankhamun's Throne.jpg",
  caption:
    "Gilded uraeus cobras on the back of Tutankhamun's throne (Eighteenth Dynasty, c. 1330s BCE), photographed in 2012. Rearing cobras with spread hoods as royal protection.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 3.0",
  creator: "GoShow",
  institution: "Egyptian Museum, Cairo",
  objectDate: "c. 1330s BCE",
});

const pApedemakSnake = commonsPicture({
  fileName: "NaqaLionTempleApedemakSnake.jpg",
  caption:
    "Relief on the Lion Temple at Naqa (1st century CE, under Natakamani and Amanitore) showing Apedemak as a coiled snake with a lion's head, photographed in 2017. The one place the lion god of Meroë takes serpent form.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Clemens Schmillen",
  objectDate: "1st century CE",
});

const pNaqaPylon = commonsPicture({
  fileName: "Naga Löwentempel.jpg",
  caption:
    "Front pylon of the Lion Temple of Apedemak at Naqa (1st century CE), photographed in 2010: King Natakamani (left tower) and Queen (Kandake) Amanitore (right tower) each subdue a bunch of captives, a lion at their feet, with a winged figure above. A Kushite royal relief in which the royal woman is the king's equal in the composition.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY 3.0",
  creator: "TrackHD",
  objectDate: "1st century CE",
});

const pApep = commonsPicture({
  fileName: "Ra slays Apep (tomb scene in Deir el-Medina).jpg",
  caption:
    "Tomb painting at Deir el-Medina (New Kingdom) of the Great Cat of Heliopolis cutting up the serpent Apep beneath a tree, photographed in 2004. Apep is the enemy to be destroyed, not a god to be served.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "GFDL / CC BY-SA 2.0",
  creator: "Hajor",
  objectDate: "New Kingdom",
});

const pMehen = commonsPicture({
  fileName: "Book of Gates Barque of Ra cropped.jpg",
  caption:
    "The sun god in his night barque, from the Book of Gates in the tomb of Ramesses I (KV16, c. 1290 BCE); in this scene the protective serpent Mehen coils around the shrine of the god. A New Kingdom royal tomb painting.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "Public domain (PD-Art; PD-old)",
  creator: "Unknown (New Kingdom painter); crop by A. Parrot",
  objectDate: "c. 1290 BCE",
});

const pVeve = commonsPicture({
  fileName: "VeveDamballah.svg",
  caption:
    "A vèvè of Danbala (Damballah), the Haitian serpent lwa: a modern drawing made by a Wikimedia contributor from several published vèvè, vectorised in 2007. It shows the kind of ritual ground-drawing used in Vodou, not any particular ceremony.",
  shows: "diagram",
  identificationStatus: "modern_interpretation",
  licence: "Public domain (PD-Art)",
  creator: "chris (Chrkl)",
  objectDate: "2005–2007 (drawing)",
});

const pCippus = commonsPicture({
  fileName: "Magical stela or cippus of Horus MET DP243459.jpg",
  caption:
    "A cippus of Horus (Metropolitan Museum 20.2.23, chlorite schist, 332–280 BCE): the child Horus standing on crocodiles and gripping snakes and scorpions. Water poured over such stelae was drunk against snakebite and stings.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC0 (Metropolitan Museum of Art Open Access)",
  creator: "Unknown Egyptian sculptor",
  institution: "Metropolitan Museum of Art, New York",
  accessionNumber: "20.2.23",
  objectDate: "332–280 BCE",
});

const pMetternich = commonsPicture({
  fileName: "Metternich stela 1.jpg",
  caption:
    "The upper part of the Metternich Stela (reign of Nectanebo II, 360–343 BCE), as printed in 1904 in E. A. Wallis Budge's The Gods of the Egyptians: a published illustration of the most elaborate Egyptian healing stela against snakebite.",
  shows: "later_artwork",
  identificationStatus: "secure",
  licence: "Public domain (PD-US)",
  creator: "E. A. Wallis Budge (publication)",
  objectDate: "stela 360–343 BCE; illustration 1904",
});

const pSnakeMummy = commonsPicture({
  fileName: "Snake mummy - Museo Egizio, Turin P 6111 p01.jpg",
  caption: "A snake mummy in a wrapped linen package, Museo Egizio, Turin (P. 6111). A killed and embalmed snake — the opposite of Hueda practice, where the living python was protected.",
  shows: "museum_specimen",
  identificationStatus: "secure",
  licence: "CC0 (Museo Egizio)",
  creator: "Museo Egizio, Turin",
  institution: "Museo Egizio, Turin",
  accessionNumber: "P. 6111",
});

const pSnakeCoffin = commonsPicture({
  fileName: "Coffin for a snake containing a mummy - Museo Egizio, Turin C 2406 p01.jpg",
  caption: "A coffin made for a snake and containing its mummy, Museo Egizio, Turin (Cat. 2406). The file page gives no date; such coffins belong to the votive animal cults of the Late and Ptolemaic periods.",
  shows: "museum_specimen",
  identificationStatus: "secure",
  licence: "CC0 (Museo Egizio)",
  creator: "Museo Egizio, Turin",
  institution: "Museo Egizio, Turin",
  accessionNumber: "C. 2406",
});

const pSnakeBox = commonsPicture({
  fileName: "Bronze box for a snake relic, Late period, 600-100 BCE, Birmingham Museum and Art Gallery.jpg",
  caption: "A bronze box for a snake relic, Late Period (600–100 BCE), Birmingham Museum and Art Gallery, photographed in 2026.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "SpeakingArch",
  institution: "Birmingham Museum and Art Gallery",
  objectDate: "600–100 BCE",
});

const pBarqueAbydos = commonsPicture({
  fileName: "Barques of Amun, Mut, and Khonsu, Temple of Seti I at Abydos.jpg",
  caption:
    "Relief in the Chapel of Amun, temple of Seti I at Abydos (Nineteenth Dynasty, c. 1290–1279 BCE), photographed in 2015: the king burns incense before the festival barque of Amun on its stand, with the barques of Khonsu and Mut behind it and a heaped offering table before it.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC0",
  creator: "A. Parrot",
  objectDate: "c. 1290–1279 BCE",
});

const pColonnade = commonsPicture({
  fileName: "Ramses II and The Colonnade of Amenophis III (14259621702).jpg",
  caption:
    "The Colonnade of Amenhotep III at Luxor Temple, photographed in 2012, whose walls carry the reliefs of the Opet procession (Tutankhamun, re-inscribed by Horemheb). The relief detail is not legible in this view; the photograph shows the hall where the procession is carved.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY 2.0",
  creator: "Jorge Láscar",
  objectDate: "photographed 2012; colonnade 14th century BCE",
});

const pDreamStela = commonsPicture({
  fileName: "Stele of the Dream by Tantamani, Jebel Barkal, Sudan.jpg",
  caption:
    "The Dream Stela of the Kushite king Tantamani (664 BCE) from Jebel Barkal, in a line drawing published by Auguste Mariette in 1872. The lunette shows the king twice, offering to Amun in human and ram-headed form, each time followed by a royal woman, under a winged sun disc. A nineteenth-century drawing of the stela, not a photograph.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: "Public domain (PD-1923; PD-old)",
  creator: "Auguste Mariette",
  objectDate: "stela 664 BCE; drawing 1872",
});

const pBarkal = commonsPicture({
  fileName: "Jebel Barkal (34050941056).jpg",
  caption:
    "Jebel Barkal seen across the Nile, photographed in 2017. The free-standing pinnacle at the left end of the cliff is the rock that Kushite and Egyptian sources treat as a rearing uraeus wearing the White Crown.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 2.0",
  creator: "Hans Birger Nilsen",
  objectDate: "2017",
});

const pMusawwarat = commonsPicture({
  fileName: "Great Enclosure in Musawwarat es-sufra (33258904784).jpg",
  caption: "The Great Enclosure at Musawwarat es-Sufra (Meroitic period, with phases from the 3rd century BCE), photographed in 2017: a Kushite complex of walled courts, ramps and temples whose purpose is still debated.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 2.0",
  creator: "Hans Birger Nilsen",
  objectDate: "2017",
});

const pFaTray = commonsPicture({
  fileName: "Fa divination tray ritual Réplica of Gedegbe Fa tray1.jpg",
  caption: "A replica of a Fa divination tray attributed to the diviner Gedegbe, carved in Porto-Novo in 2024. A modern replica, not the historical object.",
  shows: "replica",
  identificationStatus: "secure",
  licence: "CC0",
  creator: "Cargostperes",
  objectDate: "2024 (replica)",
});

const pEden = commonsPicture({
  fileName: "Folio 25v - The Garden of Eden.jpg",
  caption:
    "'The Garden of Eden', folio 25v of the Très Riches Heures du Duc de Berry, painted by the Limbourg brothers between 1411 and 1416 (Musée Condé, Chantilly, Ms. 65). A late medieval Christian painting of Gen 3: a serpent with a woman's body offers Eve the fruit, Eve gives it to Adam, God reproves them and they are expelled.",
  shows: "later_artwork",
  identificationStatus: "secure",
  licence: "Public domain (PD-Art; PD-old-100)",
  creator: "Limbourg brothers",
  institution: "Musée Condé, Chantilly",
  accessionNumber: "Ms. 65, f. 25v",
  objectDate: "1411–1416",
});

// ---------------------------------------------------------------------------
// Shared passages
// ---------------------------------------------------------------------------

const genesis30and49 = [
  {
    label: "Genesis 30:6 — the naming of Dan",
    reference: "Gen 30:6",
    sourceKey: "wlc_hebrew_bible",
    objectName: "Leningrad Codex (Firkovich B 19 A)",
    holdingInstitution: "National Library of Russia, St Petersburg",
    layers: [
      {
        layer: "primary_text",
        sourceKey: "wlc_hebrew_bible",
        content: "וַתֹּ֤אמֶר רָחֵל֙ דָּנַ֣נִּי אֱלֹהִ֔ים וְגַם֙ שָׁמַ֣ע בְּקֹלִ֔י וַיִּתֶּן־לִ֖י בֵּ֑ן עַל־כֵּ֛ן קָרְאָ֥ה שְׁמ֖וֹ דָּֽן׃",
        language: "Biblical Hebrew",
        script: "Hebrew (square, pointed)",
        evidence:
          "The verse explains the name by the verb: dānannî, 'he has judged me' (root d-y-n), and therefore Dān. That is the text's own etymology. Whether the name was in fact formed that way is a separate, historical question, but no reading of the verse connects it with a snake.",
      },
      {
        layer: "translation",
        sourceKey: "kjv_bible",
        content: "And Rachel said, God hath judged me, and hath also heard my voice, and hath given me a son: therefore called she his name Dan.",
        language: "English",
        evidence: "The King James rendering, public domain.",
      },
    ],
  },
  {
    label: "Genesis 49:16–17 — Dan as judge and as serpent",
    reference: "Gen 49:16–17",
    sourceKey: "wlc_hebrew_bible",
    objectName: "Leningrad Codex (Firkovich B 19 A)",
    holdingInstitution: "National Library of Russia, St Petersburg",
    layers: [
      {
        layer: "primary_text",
        sourceKey: "wlc_hebrew_bible",
        content:
          "דָּ֖ן יָדִ֣ין עַמּ֑וֹ כְּאַחַ֖ד שִׁבְטֵ֥י יִשְׂרָאֵֽל׃ יְהִי־דָן֙ נָחָ֣שׁ עֲלֵי־דֶ֔רֶךְ שְׁפִיפֹ֖ן עֲלֵי־אֹ֑רַח הַנֹּשֵׁךְ֙ עִקְּבֵי־ס֔וּס וַיִּפֹּ֥ל רֹכְב֖וֹ אָחֽוֹר׃",
        language: "Biblical Hebrew",
        script: "Hebrew (square, pointed)",
        evidence:
          "Two separate statements. Verse 16 is a pun on the name: Dān yādîn, 'Dan will judge'. Verse 17 is a simile: Dan will be like a nāḥāš (snake) and a šəfîfōn (a viper) on the road. The snake words here are nāḥāš and šəfîfōn, NOT dān: the serpent is what Dan is compared to, not what his name means.",
      },
      {
        layer: "translation",
        sourceKey: "kjv_bible",
        content:
          "Dan shall judge his people, as one of the tribes of Israel. Dan shall be a serpent by the way, an adder in the path, that biteth the horse heels, so that his rider shall fall backward.",
        language: "English",
        evidence: "The King James rendering, public domain.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

const events: SeedEvent[] = [
  // =========================================================================
  // WORDS — THE ANCHOR
  // =========================================================================
  {
    slug: WORDS,
    title: "Hebrew Dān and Gbe dan: a chance resemblance?",
    summary:
      "The Hebrew name Dān is built on a verb meaning 'to judge'; the Gbe word dan means 'snake'. Set side by side with their scripts, sources and relatives, the two words share three letters and nothing else that a comparative linguist would count.",
    description:
      `THE QUESTION. Popular writing that connects the tribe of Dan with the serpent cults of the Bight of Benin almost always begins with the name: Dan is a tribe of Israel, Dan is a serpent vodun, and Genesis 49:17 calls Dan 'a serpent by the way'. This record tests the name alone, with the forms in front of the reader.\n\n` +
      `THE HEBREW. דָּן Dān. The text explains it at Gen 30:6: Rachel says dānannî ʾĕlōhîm, 'God has judged me', 'therefore she called his name Dan'. The root is d-y-n, 'to judge', with relatives across Semitic — Akkadian dânu/diānu, Ugaritic dn (Danel 'judges the case of the widow' in the Aqhat poem), Aramaic dyn. Gen 49:16 repeats the pun: Dān yādîn, 'Dan shall judge'. Verse 17 then compares Dan to a snake, but the snake words are נָחָשׁ nāḥāš and שְׁפִיפֹן šəfîfōn — the Hebrew word for snake was never dān.\n\n` +
      `THE GBE. Fon dàn, Ewe da, 'snake', from Proto-Gbe *-dã (Capo 1991, p. 222, read here through Wiktionary's transcription). A nasal vowel, a lexical tone, and relatives only inside Gbe. Burton wrote it 'Danh (snake, or rainbow)' in 1864; Westermann's 1905 Ewe dictionary gives 'da, Schlange'. The Gbe word for judging is unrelated.\n\n` +
      `SIMILARITIES. Both words can be written d-a-n in Latin letters. Both are attached to a serpent in some text: the Hebrew by a simile in Gen 49:17, the Gbe because it is the word for snake. That is the whole of the likeness.\n\n` +
      `DIFFERENCES. Meaning: 'judge' against 'snake'. Structure: a Semitic triliteral root (d-y-n) against a Gbe noun stem with a nasal vowel and tone. Relatives: the Hebrew word's family is Semitic, the Gbe word's family is Gbe, and the two families do not overlap anywhere in the lexicon. The Hebrew serpent vocabulary (nāḥāš, peten, tannîn, šəfîfōn, śārāp̄) has no echo in Gbe, and the Gbe vocabulary has no echo in Hebrew.\n\n` +
      `EVIDENCE FOR TRANSMISSION. None. A cognate or a loan is shown by REGULAR SOUND CORRESPONDENCES across many words and by a plausible route of contact. Here there is one look-alike pair, no correspondence set, a mismatch in meaning, and no attested intermediate language between Hebrew and Gbe. Short CVC words with common consonants match by chance between unrelated languages all the time — Akan 'dan' means 'house', Yoruba 'dan' means 'to shine'.\n\n` +
      `ASSESSMENT. Unsupported hypothesis. The resemblance is real on paper and best explained as chance; the name cannot carry any of the weight a Dan-to-Benin argument puts on it. It does not by itself refute other kinds of evidence, which are weighed in the dan, africanJewish and routes lanes; whether the origin stories of the tribe and of the Dangbé cult ever meet is a separate question, taken up in dan-and-dangbe-name-and-origins-compared.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes what each word means, where each is first written, and that their families do not meet. It does NOT establish that no contact between Israelites and West Africans ever happened — only that this word is not evidence of it. The full table of forms, with scripts, sources and verification status, is in the lexicon dataset (lexicon.md).`,
    category: "culture",
    subcategory: "Words compared",
    eventType: "hypothesised",
    tags: serpentTags("words", ["theme: names and words", "figure: dan (tribe)", "figure: dan (vodun)", "figure: dangbe"], "comparison", "comparison: unsupported hypothesis", "anchor", "lexicon"),
    people: ["Rachel", "Hounkpati B. Christophe Capo", "Diedrich Westermann", "Richard F. Burton"],
    civilisations: ["Israelites", "Fon", "Ewe", "Gbe-speaking peoples"],
    locationName: "The Hebrew-speaking southern Levant and the Gbe-speaking coast of Ghana, Togo and Bénin",
    claims: [
      {
        sourceKey: "wlc_hebrew_bible",
        citations: [
          { sourceKey: "kjv_bible", relation: "context", note: "The public-domain English of Gen 30:6 and 49:16–17." },
        ],
        startYear: 1008,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The oldest complete Hebrew manuscript of Genesis that gives the name Dān and its etymology",
        originalDateText: "The Leningrad Codex, copied 1008/9 CE",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later manuscript. The Leningrad Codex's colophon dates it to 1008/9 CE. It dates this COPY of the text. Older fragments of Genesis survive at Qumran, and the composition of Gen 30 and 49 is much older and disputed; none of this dates the person or tribe the text names.",
      },
      {
        sourceKey: "burton_1864_mission_to_gelele",
        citations: [
          { sourceKey: "westermann_1905_ewe_worterbuch", relation: "supports", note: "Gives Ewe 'da, Schlange' and Dahome-dialect 'dagbe, Schlange (heilige)'." },
        ],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest glossed written record of the Gbe snake word found in this session",
        originalDateText: "Burton, 1864: 'Danh (snake, or rainbow)'",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Burton's footnote glosses the Fon word in 1864. It dates when a European first wrote it down WITH A MEANING in the sources read here, not when the word came into being; earlier records (the Allada catechism of 1658, seventeenth-century wordlists) were not checked for it.",
      },
      {
        sourceKey: "capo_1991_comparative_phonology_gbe",
        citations: [
          { sourceKey: "wiktionary_proto_gbe_appendix", relation: "context", note: "The transcription through which Capo's *-dã (p. 222) was read." },
        ],
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The Proto-Gbe snake word *-dã",
        originalDateText: "Proto-Gbe *-dã 'snake' — a reconstruction with no date",
        datingMethod: "other",
        chronology: "hypothesis",
        evidence:
          "EVIDENCE TYPE: linguistic reconstruction. Capo reconstructs *-dã from the regular correspondences among the Gbe languages. A reconstruction says what the ancestor of those languages probably had; it has no date, and none is given here.",
      },
    ],
    passages: genesis30and49,
    argumentsFor:
      "The two words look and sound alike in Latin spelling; the Hebrew blessing of Jacob does compare Dan to a serpent (Gen 49:17); and both a tribe and a serpent cult bear the name. To a reader meeting both for the first time, the coincidence of name and serpent seems too neat to be chance.",
    argumentsAgainst:
      "Dān means 'he judged' and comes from the Semitic root d-y-n; the Hebrew snake words are nāḥāš and šəfîfōn. Gbe dan means 'snake' and comes from Proto-Gbe *-dã with a nasal vowel and a tone. There is no set of regular sound correspondences between Hebrew and Gbe, no intermediate language, and the meanings do not match. One look-alike in a three-letter word is what chance produces.",
    genealogies: [
      {
        key: "dan-name-equals-dan-serpent",
        claim: "The serpent god Dan of Dahomey bears the name of the Israelite tribe of Dan, so the cult descends from the tribe",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "No ancient or early modern source makes the equation. Eighteenth- and nineteenth-century Europeans compared the Ouidah serpent with Egypt, Moses and the Ophites, but the sources read here never derive the WORD dan from Hebrew; Williams (1930) argues for Hebrew survivals in West Africa without making it. The name argument appears in modern popular writing and online, where no single originator was identified in this session.",
        whatWouldChangeThis:
          "A demonstration of regular sound correspondences between Hebrew (or another Semitic language) and Gbe across a body of basic vocabulary; or a documented intermediate — a Semitic-speaking community in the Bight of Benin whose words entered Gbe — with dated evidence.",
        links: [
          {
            stage: "colonial_record",
            who: "John Atkins, A Voyage to Guinea, Brasil, and the West-Indies",
            year: 1735,
            saysAbsentReason: "Not opened in this session; known through the vodun-diaspora record 'hueda-serpents-egypt-and-israel-speculation'.",
            adds: "The first speculation that Hueda snake-worship might derive from Mosaic or Egyptian practice — a derivation of the cult, not of the name.",
            citationStatus: "unverified",
          },
          {
            stage: "colonial_record",
            who: "Abbé Pierre Bouche, La Côte des Esclaves et le Dahomey",
            year: 1885,
            sourceKey: "bouche_1885_cote_des_esclaves",
            reference: "pp. 385–386",
            says: "Il est intéressant de retrouver de nos jours, à la côte occidentale d'Afrique, les doctrines et les pratiques d'une secte ... qui prit naissance en Egypte. Je veux parler des ophites.",
            adds: "Records the name 'Dan ou Danghé (le serpent sacré)' and links the cult to the Egyptian-born Gnostic Ophites — again a derivation of doctrine, not of the word.",
            citationStatus: "verified",
          },
          {
            stage: "early_scholarship",
            who: "Joseph J. Williams, Hebrewisms of West Africa",
            year: 1930,
            sourceKey: "williams_1930_hebrewisms",
            saysAbsentReason: "Searched in full text, not read through; no passage equating Hebrew Dān with Gbe dan was found.",
            adds: "A general case for Hebrew survivals in West Africa, which later popular writing draws on.",
            citationStatus: "verified",
          },
          {
            stage: "popular_claim",
            who: "Modern popular and online writing on Danites in West Africa",
            saysAbsentReason: "No single originator identified in this session.",
            adds: "The name equation itself: Dan the tribe = Dan the serpent.",
            citationStatus: "no_citation_given",
          },
          {
            stage: "current_scholarship",
            who: "Hounkpati B. C. Capo, A Comparative Phonology of Gbe",
            year: 1991,
            sourceKey: "capo_1991_comparative_phonology_gbe",
            reference: "p. 222",
            says: "*-dã 'snake' (as transcribed by Wiktionary)",
            adds: "Places Gbe dan inside a regular Gbe sound system with a nasal vowel — the internal history the name equation ignores.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    media: [pGbeMap, pLeningrad1b, pPython],
  },

  // =========================================================================
  // WORDS
  // =========================================================================
  {
    slug: "proto-gbe-snake-word-across-gbe",
    title: "Proto-Gbe *dã and the snake word across Gbe",
    summary:
      "Capo's reconstruction *-dã 'snake' (with *-dãgbói 'python') and what can actually be confirmed of its descendants: Ewe da and Fon dan independently, the other Gbe forms only through a single online entry.",
    description:
      `WHAT IS RECONSTRUCTED. Hounkpati Capo's Comparative Phonology of Gbe (1991) reconstructs, for the ancestor of the Gbe languages, *-dã 'snake' (p. 222) and *-dãgbói 'python' (p. 221). Read in this session through the Wiktionary appendix that transcribes Capo's Proto-Gbe lexicon, the forms carry a hyphen (a noun prefix slot) and a nasal vowel; the transcription gives no tone. The book itself was not opened.\n\n` +
      `WHAT WAS CONFIRMED INDEPENDENTLY. EWE: Diedrich Westermann's Wörterbuch der Ewe-Sprache (1905) gives 'da, Schlange', with a list of snake species, and marks a Dahomey-dialect word 'dagbe' as 'Schlange (heilige)', the sacred snake, 'cf. da'; his English-Ewe dictionary of 1930 repeats 'snake n. da'. FON: Burton (1864) glosses 'Danh (snake, or rainbow)' and writes the python vodun 'Danh-gbwe'. Bouche (1885) heard 'Dan ou Danghé (le serpent sacré)' at Ouidah. These are three independent European ears across four decades, agreeing on the word.\n\n` +
      `WHAT WAS NOT. The request's table — Fon dàn, Gun odàn/dàn, Saxwe odàn, Aja edan, Ewe da — matches, form for form, the cognate list in the English Wiktionary entry for Gun 'odàn'. That entry references Capo only for *-dã; the cognates have no source. Gun, Saxwe and Aja are therefore recorded as unverified. Forms for Xweda (the language of Hueda), Xwla, Gen and Mahi — which the brief asked for — could not be found: Capo's dialect tables and the SIL Gbe wordlists were not reachable.\n\n` +
      `REGULARITY. Inside Gbe the correspondence is regular in the sense Capo establishes it: the d-, the nasal vowel and the noun-prefix alternation (o-, e-, zero) recur across the family. That is what makes *-dã a reconstruction rather than a guess. It is also what makes it Gbe: the prefixes and the nasal vowel belong to the Gbe system.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that 'dan/da' is the ordinary inherited Gbe word for snake, present in languages from Ewe in Ghana to Fon in Bénin, and that it was written down with that meaning by 1864. It does NOT date the word — a reconstruction is positionless — and it does not show that the word was borrowed from anywhere. Nothing in the record suggests it was.`,
    category: "culture",
    subcategory: "Words compared",
    eventType: "mainstream",
    tags: serpentTags("words", ["theme: names and words", "figure: dan (vodun)", "figure: dangbe", "place: savi and ouidah"], "proto-gbe", "lexicon", "reconstruction"),
    people: ["Hounkpati B. Christophe Capo", "Diedrich Westermann", "Richard F. Burton", "Pierre Bouche"],
    civilisations: ["Ewe", "Fon", "Gun", "Aja", "Hueda (Xweda)", "Gbe-speaking peoples"],
    locationName: "The Gbe-speaking area, from south-eastern Ghana through Togo to southern Bénin",
    claims: [
      {
        sourceKey: "capo_1991_comparative_phonology_gbe",
        citations: [
          { sourceKey: "wiktionary_proto_gbe_appendix", relation: "context", note: "The conduit through which *-dã (p. 222) and *-dãgbói (p. 221) were read; tone not transcribed." },
        ],
        datePrecision: "millennium",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "Proto-Gbe *-dã 'snake' and *-dãgbói 'python'",
        originalDateText: "Proto-Gbe, undated: *-dã 'snake', *-dãgbói 'python'",
        datingMethod: "other",
        chronology: "hypothesis",
        evidence:
          "EVIDENCE TYPE: linguistic reconstruction. A form inferred from the regular correspondences of the daughter languages. When Proto-Gbe was spoken is not established by Capo's method and is not given here.",
      },
      {
        sourceKey: "westermann_1905_ewe_worterbuch",
        citations: [
          { sourceKey: "westermann_1930_gbesela_yeye", relation: "supports", note: "The same author's English-Ewe dictionary: 'snake n. da'." },
          { sourceKey: "wiktionary_gun_odan", relation: "context", note: "The online entry whose unsourced cognate list the request's table reproduces." },
        ],
        startYear: 1905,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Ewe 'da' snake and Dahome-dialect 'dagbe' sacred snake in a printed dictionary",
        originalDateText: "Westermann, Wörterbuch der Ewe-Sprache, 1905",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The dictionary's publication date. It dates the record of the word, not the word.",
      },
      {
        sourceKey: "burton_1864_mission_to_gelele",
        citations: [
          { sourceKey: "bouche_1885_cote_des_esclaves", relation: "supports", note: "'Dan ou Danghé (le serpent sacré)', heard at Ouidah 1866–68." },
        ],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Fon 'Danh' glossed as snake or rainbow",
        originalDateText: "Burton glosses Fon 'Danh' in 1864",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. A British consul's English spelling of a Fon word with its meaning, from his 1863–64 mission. It does not show tone.",
      },
    ],
    media: [pGbeMap, pPython],
  },
  {
    slug: "serpent-words-semitic-and-egyptian",
    title: "Serpent words in Semitic and Egyptian",
    summary:
      "Hebrew nāḥāš, šəfîfōn, tannîn and śārāp̄; Ugaritic nḥš, tnn and bṯn; Egyptian ḥfꜣw, ꜥꜣpp, jꜥrt and wꜣḏyt; Coptic hof. Each has its own family, and none is dan.",
    description:
      `THE HEBREW SERPENT VOCABULARY. נָחָשׁ nāḥāš, the general word (the serpent of Gen 3:1, the simile of Gen 49:17, the bronze serpent of Num 21:9); שְׁפִיפֹן šəfîfōn, used once, at Gen 49:17, usually taken as a horned viper (KJV 'adder'); תַּנִּין tannîn, sea-monster or dragon (Gen 1:21; Aaron's staff in Exod 7); שָׂרָף śārāp̄, the 'fiery' serpent of Num 21; and the name נְחֻשְׁתָּן Nəḥuštān (2 Kgs 18:4), a play on nāḥāš 'snake' and nəḥōšet 'bronze'. The text was copied in this session from the Westminster Leningrad Codex.\n\n` +
      `UGARITIC. The tablets of Ugarit (destroyed c. 1185 BCE) use nḥš for snake (in the snake-bite incantations KTU 1.100 and 1.107), tnn for the sea-dragon Anat boasts of muzzling (KTU 1.3), and bṯn in 'Lotan, the fleeing serpent' (KTU 1.5) — cognate with Hebrew peten. These are standard references (DULAT) that were not opened in this session.\n\n` +
      `EGYPTIAN. ḥfꜣw is the ordinary word for snake, written with a snake determinative; Coptic ϩⲟϥ (hof) descends from it. ꜥꜣpp is Apep, the chaos serpent. jꜥrt is the uraeus, 'the risen one', from jꜥr 'to rise'; Greek ouraios is generally derived from it. wꜣḏyt, Wadjet, is 'the green one', the cobra goddess of Buto. Forms were checked only in secondary entries; the Wörterbuch was not opened.\n\n` +
      `ARE THE CORRESPONDENCES REGULAR? Within Semitic, yes: Hebrew nāḥāš and Ugaritic nḥš, Hebrew tannîn and Ugaritic tnn, Hebrew peten and Ugaritic bṯn are textbook cognates. Within Egyptian, ḥfꜣw to Coptic hof follows the usual loss of ꜣ and vowel shift. Between Semitic and Egyptian there is no shared serpent root among these words. Between either and Gbe dan, there is nothing.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that the languages of the Levant and the Nile had rich serpent vocabularies, every item of which belongs to its own family. It does NOT tell us how serpents were thought of — words are not theology — and it says nothing for or against contact between peoples; it only shows that a snake word did not travel from these languages into Gbe.`,
    category: "culture",
    subcategory: "Words compared",
    eventType: "mainstream",
    tags: serpentTags("words", ["theme: names and words", "figure: nehushtan", "figure: wadjet and the uraeus", "figure: apep"], "lexicon", "semitic", "egyptian"),
    people: ["Gregorio del Olmo Lete", "Joaquín Sanmartín", "Adolf Erman", "Hermann Grapow", "Walter Ewing Crum"],
    civilisations: ["Israelites", "Ugarit", "Ancient Egypt", "Coptic Egypt"],
    locationName: "The southern Levant, Ugarit (Ras Shamra) and the Nile Valley",
    claims: [
      {
        sourceKey: "dulat_2015_ugaritic",
        citations: [
          { sourceKey: "wlc_hebrew_bible", relation: "context", note: "The Hebrew cognates nāḥāš, tannîn and peten." },
        ],
        startYear: bce(1300),
        endYear: bce(1185),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The Ugaritic tablets that use nḥš, tnn and bṯn",
        originalDateText: "Ugarit's alphabetic tablets, 13th century to c. 1185 BCE",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: archaeological. The tablets come from the last phase of Ugarit before its destruction around 1185 BCE. The date is of the tablets, not of the words, which are older.",
      },
      {
        sourceKey: "erman_grapow_wb",
        citations: [
          { sourceKey: "crum_1939_coptic_dictionary", relation: "context", note: "Coptic ϩⲟϥ hof, the descendant of ḥfꜣw." },
        ],
        startYear: bce(2350),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "The earliest Egyptian texts with serpent spells (the Pyramid Texts of Unas)",
        originalDateText: "Pyramid Texts of Unas, c. 2350 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. The Pyramid Texts are carved in the pyramid of Unas (Fifth Dynasty) and contain many spells against snakes. Which serpent words first appear there was not checked against the Wörterbuch (NEEDS SOURCE VERIFICATION).",
      },
      {
        sourceKey: "wlc_hebrew_bible",
        citations: [
          { sourceKey: "kjv_bible", relation: "context", note: "English of the verses using nāḥāš, šəfîfōn, tannîn and Nəḥuštān." },
        ],
        startYear: 1008,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The manuscript from which the Hebrew forms are quoted",
        originalDateText: "Hebrew forms quoted from the Leningrad Codex of 1008/9",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later manuscript. The date of the copy, not of the composition of Genesis, Numbers or Kings, which is disputed and much earlier.",
      },
    ],
    media: [pBaalTablet, pLeningrad1b, pCobra],
  },
  {
    slug: "snake-words-across-africa-no-shared-root",
    title: "Snake words across Africa: no shared root",
    summary:
      "Gbe dan, Yoruba ejò, Akan ɔwɔ, Hausa macìjī, Wolof jaan, Ge'ez ʾarwē and tämän, Amharic ʾəbab, Coptic hof: the languages along every proposed route from the Nile to the Gbe coast call the snake something different.",
    description:
      `WHY THIS TABLE MATTERS. If a serpent cult had travelled from the Nile or the Levant to the Gbe coast with its name, the name ought to show up somewhere along the way. The brief's routes run through Egypt, Nubia, Ethiopia, the Sahel and the Niger Bend; this record lists what those languages, and the Gbe coast's neighbours, actually call a snake.\n\n` +
      `THE FORMS. YORUBA ejò ('Ejo, s. serpent, snake', Crowther 1852). AKAN (Twi) ɔwɔ ('o-wo, pl. a-, snake, serpent', Christaller 1881). HAUSA macìjī (Wiktionary only). WOLOF jaan (Wiktionary only). GE'EZ ʾarwē, 'wild beast', specifically 'serpens, anguis, aspis, draco' — the word for the serpent of Eden in the Ge'ez Bible — and tämän, 'serpens ingens, draco' (Dillmann 1865). AMHARIC ʾəbab. COPTIC hof, from Egyptian ḥfꜣw. MEROITIC: no word for snake has been identified — Meroitic can be read aloud but is largely not understood. OLD NUBIAN: not located in this session.\n\n` +
      `SIMILARITIES. Every language has a snake word, and several have a special word for a great or mythical serpent (Ge'ez tämän, Hebrew tannîn, Gbe *-dãgbói for the python). That is a universal, not a link.\n\n` +
      `DIFFERENCES. No two of these forms share a root across family lines. Yoruba and Akan, the Gbe coast's nearest large neighbours, are unrelated to dan; so are Hausa and the Sahelian languages, Ge'ez and Amharic, and Coptic.\n\n` +
      `EVIDENCE FOR TRANSMISSION. None in the vocabulary. A route leaves traces in loanwords — the Arabic of the Sahel, Portuguese on the coast — and none of the snake words here is such a loan from Semitic or Egyptian.\n\n` +
      `ASSESSMENT. Significant difference. Along every proposed route the snake has a different name, inherited in each family.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that the Gbe word for snake was not inherited from or shared with any of these languages. It does NOT exclude the movement of a cult under a local name — a god can travel and be renamed — which is why the ritual and archaeological comparisons in the rituals lane are needed as well.`,
    category: "culture",
    subcategory: "Words compared",
    eventType: "mainstream",
    tags: serpentTags("words", ["theme: names and words", "theme: trade routes", "place: ethiopia", "place: sahara and niger bend", "place: napata and meroe"], "comparison", "comparison: significant difference", "lexicon"),
    people: ["Samuel Crowther", "Johann Gottlieb Christaller", "August Dillmann"],
    civilisations: ["Yoruba", "Akan", "Hausa", "Wolof", "Aksum", "Amhara", "Kush", "Coptic Egypt", "Gbe-speaking peoples"],
    locationName: "West Africa, the Sahel, Nubia and Ethiopia",
    claims: [
      {
        sourceKey: "crowther_1852_yoruba_vocabulary",
        citations: [
          { sourceKey: "christaller_1881_twi_dictionary", relation: "supports", note: "Akan o-wo 'snake, serpent', 1881." },
          { sourceKey: "wiktionary_hausa_wolof_snake", relation: "context", note: "Hausa macìjī and Wolof jaan, read only online." },
        ],
        startYear: 1852,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest printed records of the Yoruba and Akan snake words found in this session",
        originalDateText: "Crowther's Yoruba vocabulary, 1852 (Akan in Christaller, 1881)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. Mission-era dictionaries; they date the records, not the words.",
      },
      {
        sourceKey: "dillmann_1865_lexicon_aethiopicae",
        citations: [
          { sourceKey: "crum_1939_coptic_dictionary", relation: "context", note: "Coptic hof < Egyptian ḥfꜣw." },
        ],
        startYear: 450,
        endYear: 600,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The Ge'ez Bible translation in which ʾarwē names the serpent of Eden",
        originalDateText: "Aksumite-period Ge'ez Bible, c. 5th–6th century",
        datingMethod: "estimate",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: later manuscript. The translation is attributed to the Aksumite period; its surviving manuscripts are much later. Dillmann cites the Ge'ez Gen 3:1 for ʾarwē.",
      },
    ],
    media: [pCobra, pPython, pGbeMap],
  },
  {
    slug: "dan-sacred-name-and-everyday-word",
    title: "Dan as a sacred name versus dan as an everyday word",
    summary:
      "In Gbe, dan is first an ordinary noun — the snake in the grass — and only then the name of a family of vodun and part of the compound Dangbé. In Hebrew, Dān is a personal and tribal name that was never an ordinary word for anything.",
    description:
      `TWO KINDS OF WORD. The brief asks whether religious terminology differs from everyday vocabulary. In Gbe it does not: the vodun Dan bears the everyday word for snake. Westermann (1905) lists 'da' among ordinary nouns, with names of snake species and the sentence 'da de adi de nunye', 'the snake has poisoned me'. Burton (1864) writes the same word for the rainbow serpent: Aido-Hwedo is 'commonly called Danh'. The cult language of the Ewe Yewe order uses 'Da' and 'Voduda', 'vodu-snake'.\n\n` +
      `DANGBÉ. The Hueda python is Dangbé (Burton 'Danh-gbwe', Bouche 'Danghé'). Capo reconstructs a separate Proto-Gbe word for python, *-dãgbói; Westermann records Dahome-dialect 'dagbe', 'sacred snake'. The second element is often explained as 'gbé', life — giving 'snake of life' — and Westermann has a homophone 'dagbe', 'good', 'from agbe, life'. Those explanations are attractive but not demonstrated: *-dãgbói does not obviously contain the word for life (*-gbɛ). The meaning of the second element is recorded as UNRESOLVED.\n\n` +
      `THE HEBREW NAME. Dān occurs only as the name of Jacob's son, his tribe and the city of Laish renamed Dan (Judg 18:29). It is a name with an explanation attached (Gen 30:6), not a common noun in use; nobody in the Hebrew Bible calls a snake or a judge 'dān'.\n\n` +
      `WHY IT MATTERS. A god named with an everyday word is named FROM the local language. That is what one expects of a cult that grew up among Gbe speakers, and the opposite of what one expects of a foreign name carried in: imported sacred names usually stay opaque (Haitian 'Danbala' means nothing in Creole — it is a Gbe word).\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that Gbe 'dan' is transparent, ordinary and inherited, and that the vodun bear it as their name. It does NOT tell us how old the cult is, nor whether the Hueda cult was itself brought from elsewhere in the Gbe area — Agbo records that King Kpassè brought Dagbé from Adja-Kpétékammè on the Mono, which is a movement inside the Gbe world.`,
    category: "religion",
    subcategory: "Words compared",
    eventType: "mainstream",
    tags: serpentTags("words", ["theme: names and words", "figure: dan (vodun)", "figure: dangbe", "figure: aido-hwedo", "figure: dan (tribe)"], "lexicon", "sacred names"),
    people: ["Diedrich Westermann", "Richard F. Burton", "Pierre Bouche", "Casimir Agbo", "Kpassè"],
    civilisations: ["Fon", "Ewe", "Hueda (Xweda)", "Israelites"],
    locationName: "Ouidah and the Gbe-speaking coast",
    lat: 6.3667,
    lng: 2.0833,
    claims: [
      {
        sourceKey: "westermann_1905_ewe_worterbuch",
        citations: [
          { sourceKey: "burton_1864_mission_to_gelele", relation: "supports", note: "Aido-Hwedo 'commonly called Danh'; 'Danh-gbwe'." },
        ],
        startYear: 1905,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The dictionary record of 'da' as an everyday noun and 'dagbe' as the sacred snake",
        originalDateText: "Westermann 1905: 'da' snake; 'dagbe (D.)' sacred snake",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. The date of the dictionary, not of the words.",
      },
      {
        sourceKey: "agbo_1959_histoire_de_ouidah",
        citations: [
          { sourceKey: "capo_1991_comparative_phonology_gbe", relation: "context", note: "Proto-Gbe *-dãgbói 'python' (p. 221)." },
        ],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "When Dagbé was brought to Hueda",
        originalDateText: "King Kpassè brings Dagbé from Adja-Kpétékammè — an undated tradition",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. Agbo's account of Kpassè, read only in a search-engine extract (NEEDS SOURCE VERIFICATION). It places the cult's arrival inside the Gbe area and gives it no date; none is given here.",
      },
    ],
    passages: [genesis30and49[0]],
    media: [pPythonHut, pTemplePythons],
  },
  {
    slug: "danbala-the-gbe-snake-word-that-crossed-the-atlantic",
    title: "Danbala: the Gbe snake word that did cross the Atlantic",
    summary:
      "The one demonstrable journey of the word dan: from the Gbe coast to Saint-Domingue with captives of the eighteenth century, becoming Danbala Wedo of Haitian Vodou. A control case for what a real transmission looks like.",
    description:
      `WHY A CONTROL CASE. To judge whether Dān and dan are connected, it helps to look at a case where a serpent name certainly travelled. Haitian Vodou's serpent lwa Danbala (Danbala Wedo), with his rainbow wife Ayida Wedo, carries the Gbe word dan and the name of the Hueda kingdom (Wedo is read as Xweda/Whydah), just as Aido-Hwedo carries Hwedo.\n\n` +
      `SIMILARITIES. The name (dan + -bala; Ayida Wedo against Aido-Hwedo), the animal (a serpent), the pairing with the rainbow, white as the serpent's colour, and the Rada rite's identity as the 'Arada' (Allada) branch of Vodou.\n\n` +
      `DIFFERENCES. Danbala is not a living python kept in a temple; there is no Temple of Pythons in Haiti. He is served with vèvè, white offerings and possession in the ounfò. Ayida Wedo and Danbala are a couple, while Fon Dan and Aido-Hwedo are aspects of one serpent power. The Hueda royal role of Dangbé had no equivalent in a colony.\n\n` +
      `EVIDENCE FOR TRANSMISSION. Documented: the slave voyages from Ouidah to Saint-Domingue in the eighteenth century; Gbe-language names in Haitian ritual vocabulary; the 'Rada' rite named after Allada; and the existing records 'danbala-and-ayida-wedo' and 'serpent-symbolism-across-the-atlantic'. Every link in the chain is a dated, named thing — ships, ports, communities — and the word is the SAME word, transparently Gbe.\n\n` +
      `ASSESSMENT. Documented historical transmission. This is what a real transmission of a serpent name looks like: carriers, a route, dates and a word that keeps its form. Compare the Hebrew Dān: no carriers, no route, no dates, and a different word.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that a Gbe serpent name crossed the Atlantic with Gbe-speaking captives and was transformed in Haiti. It does NOT establish anything about the origin of the cult in Africa, and it does not make Danbala the same god as Dan or Dangbé: transmission is followed by change.`,
    category: "religion",
    subcategory: "Words compared",
    eventType: "historical",
    tags: serpentTags("words", ["theme: names and words", "figure: damballa and ayida-wedo", "figure: dan (vodun)", "figure: aido-hwedo", "place: haiti and brazil"], "comparison", "comparison: documented historical transmission", "atlantic", "control case"),
    people: ["Alfred Métraux"],
    civilisations: ["Fon", "Hueda (Xweda)", "Haitian Vodou practitioners"],
    locationName: "Ouidah and Saint-Domingue (Haiti)",
    claims: [
      {
        sourceKey: "metraux_1959_voodoo",
        citations: [
          { sourceKey: "blier_1995_african_vodun", relation: "context", note: "The Fon serpent vodun from which Danbala and Ayida Wedo derive." },
          { sourceKey: "burton_1864_mission_to_gelele", relation: "context", note: "Aido-Hwedo 'commonly called Danh', the African side of the pair." },
        ],
        startYear: 1958,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "A standard ethnographic description of Danbala Wedo and Ayida Wedo",
        originalDateText: "Métraux, Le Vaudou haïtien, 1958",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. An ethnography of Haitian Vodou. It dates a description, not the arrival of the cult, which came with eighteenth-century captives; earlier Haitian attestations of the name were not checked in this session.",
      },
      {
        sourceKey: "law_1991_slave_coast",
        startYear: 1700,
        endYear: 1790,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The main period of the slave trade from the Bight of Benin to Saint-Domingue",
        originalDateText: "Eighteenth-century voyages from Ouidah and neighbouring ports to Saint-Domingue",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Ship records and trading accounts date the movement of people who carried the word. The exact span used here is approximate.",
      },
    ],
    media: [pVeve, pTemplePythons],
  },

  // =========================================================================
  // RITUALS — THE ANCHOR
  // =========================================================================
  {
    slug: RITUALS,
    title: "Fourteen gods and powers compared",
    summary:
      "YHWH, the northern calf, Nehushtan, Wadjet, Apep, Mehen, Apedemak, Dan, Dangbé, Aido-Hwedo, Legba, Hevioso, Sakpata and Damballa with Ayida Wedo, compared field by field. Six are not serpents at all; the serpents are a cobra goddess, a chaos snake, a protective coil, a bronze object, a living python species and a rainbow.",
    description:
      `WHAT IS COMPARED. Fourteen figures, each on thirteen fields: name and language, earliest secure evidence, function, animal or object, healing, royal role, cosmology, place of worship, priests, rituals, primary sources, differences from the others, and any proposed historical connection with the evidence for and against. The full 14 x 13 matrix is in gods.md; this record summarises it and the three records that follow take the serpents in groups.\n\n` +
      `THE FIGURES WHO ARE NOT SERPENTS. YHWH, the national god of Israel and Judah (first outside the Bible on the Mesha stele, c. 840 BCE); the calves Jeroboam set up at Dan and Bethel (1 Kgs 12); Apedemak, Meroë's lion-headed war god (a serpent only once, on the Naqa Lion Temple); and among the Fon, Legba (the threshold), Hevioso (thunder) and Sakpata (earth and smallpox). They are in the list because the brief named them, and because leaving them out would make the comparison look more serpentine than the religions were.\n\n` +
      `SIMILARITIES. Serpents protect (Wadjet, Mehen, Dangbé), threaten (Apep), heal (Nehushtan, the Egyptian cippi), encircle the world (Mehen, Aido-Hwedo) and bring wealth (Dan). Most of the traditions have professional priests, sacrifice and processions.\n\n` +
      `DIFFERENCES. The ANIMAL differs: the cobra (Naja haje) of the uraeus is venomous and hooded; the royal python (Python regius) of Dangbé is a harmless constrictor; Apep and Mehen are cosmic; Nehushtan is bronze; Aido-Hwedo is the rainbow. The RELATION differs: Wadjet is worn by the king; Dangbé is a living species protected by law; Apep is destroyed in effigy; Nehushtan was looked at and then smashed by a king. The SOURCES differ: carved inscriptions and temple reliefs for Egypt and Kush; a religious text with disputed dates for Israel; European travellers from 1705 and Fon oral tradition for the Gbe coast.\n\n` +
      `EVIDENCE FOR TRANSMISSION. Documented only twice: Egypt to Kush (Kushite kings wearing the uraeus and serving Wadjet and Amun) and the Gbe coast to Haiti (Dan and Aido-Hwedo to Danbala and Ayida Wedo; Legba to Papa Legba). No figure on the Nile or in the Levant has a documented link to any figure on the Gbe coast.\n\n` +
      `ASSESSMENT. Significant difference. The figures share the serpent as an image, which is a near-universal, and differ in species, function, ritual and setting.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes what each figure was in its own sources and that no two are the same god. It does NOT rule out influence that left no record; it records that none has been found, and the conclusion page weighs that absence.`,
    category: "religion",
    subcategory: "Gods, rituals and landscapes compared",
    eventType: "mainstream",
    tags: serpentTags(
      "rituals",
      [
        "figure: yhwh",
        "figure: nehushtan",
        "figure: wadjet and the uraeus",
        "figure: apep",
        "figure: mehen",
        "figure: apedemak",
        "figure: dan (vodun)",
        "figure: dangbe",
        "figure: aido-hwedo",
        "figure: damballa and ayida-wedo",
      ],
      "comparison",
      "comparison: significant difference",
      "anchor",
      "gods compared"
    ),
    people: ["YHWH", "Wadjet", "Apep", "Mehen", "Apedemak", "Dan", "Dangbé", "Aido-Hwedo", "Legba", "Hevioso", "Sakpata", "Damballa", "Ayida Wedo", "Jeroboam I"],
    civilisations: ["Israelites", "Ancient Egypt", "Kush", "Fon", "Hueda (Xweda)", "Haitian Vodou practitioners"],
    locationName: "The Levant, the Nile Valley, the Gbe coast and Haiti",
    claims: [
      {
        sourceKey: "russmann_1974_xxvth_dynasty",
        citations: [
          { sourceKey: "torok_1997_kingdom_of_kush", relation: "supports", note: "Kushite kings and Egyptian gods, the documented Egypt–Kush transmission." },
        ],
        startYear: bce(747),
        endYear: bce(656),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Twenty-fifth (Kushite) Dynasty, when Kushite kings ruled Egypt wearing the uraeus",
        originalDateText: "The Kushite Twenty-fifth Dynasty, c. 747–656 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Royal monuments of Piye to Tantamani. Dates the documented Egypt–Kush exchange; exact regnal dates vary by a few years between chronologies.",
      },
      {
        sourceKey: "herskovits_1938_dahomey",
        citations: [
          { sourceKey: "burton_1864_mission_to_gelele", relation: "supports", note: "Burton's list of Dahomean vodun, including Danh, Aido-Hwedo, Legba, Hevioso and Sakpata." },
        ],
        startYear: 1864,
        endYear: 1938,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "The written documentation of the Fon figures used in the comparison",
        originalDateText: "From Burton (1864) to Herskovits (1938)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The Fon figures are documented in writing from the nineteenth century (the Ouidah serpent from 1705). This dates the documentation, not the gods.",
      },
    ],
    media: [pApedemakSnake, pWadjetNyuserre, pPython, pVeve],
  },

  // =========================================================================
  // GODS IN GROUPS
  // =========================================================================
  {
    slug: "serpents-that-protect-kings-wadjet-kush-dangbe",
    title: "Serpent figures that protect kings: Wadjet, the Kushite double uraeus, Dangbé",
    summary:
      "Three royal serpents: the Egyptian cobra worn on the king's brow, the two cobras of the Kushite pharaohs, and the python whose house a new Hueda king had to visit. The first two are one tradition passed from Egypt to Kush; the third is a different animal in a different kind of relationship with the king.",
    description:
      `WADJET AND THE URAEUS. The cobra goddess of Buto in the Delta, one of the 'Two Ladies' of the royal titulary, and the rearing cobra (jꜥrt) at the king's brow, spitting fire at his enemies. Old Kingdom reliefs show her protecting the king (Nyuserre, Fifth Dynasty, 25th century BCE); gilded uraei line Tutankhamun's throne. The serpent is worn — it is part of the crown.\n\n` +
      `THE KUSHITE DOUBLE URAEUS. The kings of the Twenty-fifth Dynasty, who came from Napata in Nubia and ruled Egypt c. 747–656 BCE, wore two cobras at the brow on a close-fitting cap. Russmann's study treats it as a Kushite innovation; what the two cobras meant (Egypt and Kush, or Upper and Lower Egypt) is DEBATED. Shabaqo's donation stela shows a Kushite king offering to Wadjet herself.\n\n` +
      `DANGBÉ. The royal python of Hueda, a living species kept and protected at Savi and Ouidah. After a coronation the new king's mother led a procession to the serpent's house and, three months later, the king went himself (Labat 1730); the Des Marchais coronation plate shows 'a hut for a serpent' and 'the serpent' in the palace court. Dangbé's high priest was said to be 'held in equal reverence with the King' (Atkins 1735).\n\n` +
      `SIMILARITIES. In all three a serpent stands beside the king as protector of his rule, and in Egypt and Hueda a woman's role is prominent (Wadjet is a goddess; the Hueda king's mother leads the first procession).\n\n` +
      `DIFFERENCES. Cobra against python. A goddess worn as insignia against a living animal species protected by law. An Egyptian king embodies the protection on his own head; a Hueda king goes to the god's house, through its priests. The Hueda serpent has its own priesthood that could, in European eyes, rival the king; the uraeus has no priesthood of its own.\n\n` +
      `EVIDENCE FOR TRANSMISSION. Egypt to Kush: documented — the uraeus, Wadjet and Amun on Kushite monuments. Kush to Hueda: none. Nothing links Napata or Meroë to the Gbe coast, and the Hueda serpent is not a cobra.\n\n` +
      `ASSESSMENT. Significant difference. The Egypt–Kush pair is a documented historical transmission; the comparison with Dangbé is of a widespread idea (a sacred animal protecting a king) in two unrelated forms.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes the royal serpent in each place from its own sources. It does NOT show any line from the uraeus to Dangbé; and the absence of Kushite serpent iconography west of the Nile is itself a finding, not a gap to be filled by assumption.`,
    category: "religion",
    subcategory: "Gods, rituals and landscapes compared",
    eventType: "mainstream",
    tags: serpentTags("rituals", ["figure: wadjet and the uraeus", "figure: dangbe", "theme: kingship", "place: napata and meroe", "place: savi and ouidah"], "comparison", "comparison: significant difference", "royal serpents"),
    people: ["Wadjet", "Nyuserre Ini", "Shabaqo", "Taharqa", "Dangbé", "Huffon (king of Hueda)"],
    civilisations: ["Ancient Egypt", "Kush", "Hueda (Xweda)"],
    locationName: "Buto and Thebes (Egypt), Napata (Kush), Savi and Ouidah (Hueda)",
    claims: [
      {
        sourceKey: "russmann_1974_xxvth_dynasty",
        citations: [
          { sourceKey: "torok_1997_kingdom_of_kush", relation: "supports", note: "The Kushite adoption of Egyptian royal iconography." },
        ],
        startYear: bce(747),
        endYear: bce(656),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The double uraeus of the Kushite kings of Egypt",
        originalDateText: "Double uraeus on Twenty-fifth Dynasty royal images, c. 747–656 BCE",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: archaeological. Dated statues and reliefs of the Kushite kings. The date of the iconography is secure; its meaning is debated.",
      },
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        citations: [
          { sourceKey: "norman_2014_pythons_pigs", relation: "supports", note: "The royal parade to the python's temple, from the European accounts and archaeology." },
          { sourceKey: "law_1991_slave_coast", relation: "context", note: "The Hueda monarchy before 1727." },
        ],
        startYear: 1725,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Hueda coronation plate showing the serpent and its hut in the palace court",
        originalDateText: "The coronation plate dated April 1725 (the text says 1715)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The plate's caption says April 1725; Labat's text dates the coronation Des Marchais attended to 1715. The discrepancy is examined in the gbe lane (hueda-coronation-1715-or-1725).",
      },
    ],
    media: [pWadjetNyuserre, pShabaqo, pThroneUraei, pTaharqa, pPython],
  },
  {
    slug: "cosmic-serpents-apep-mehen-aido-hwedo-damballa",
    title: "Cosmic serpents: Apep, Mehen, Aido-Hwedo, Damballa",
    summary:
      "The Egyptian enemy-serpent Apep and protector-serpent Mehen, the Fon rainbow serpent Aido-Hwedo who carried the creator and coils under the earth, and Haitian Danbala and Ayida Wedo. A world-serpent shape shared by many religions, with different roles in each.",
    description:
      `APEP. The serpent of chaos who attacks the sun god's barque every night. First in the Coffin Texts of the Middle Kingdom; painted in the netherworld books of New Kingdom royal tombs; and destroyed in effigy in the late 'Book of Overthrowing Apep' (Papyrus Bremner-Rhind, c. 310 BCE), where wax and drawn serpents are spat on, trampled, speared and burned. Apep is never worshipped.\n\n` +
      `MEHEN. 'The coiled one', who wraps the shrine of the sun god in the night barque to protect him (Book of Gates, Amduat). A board game of the same name, its board a coiled snake, goes back to the beginning of Egyptian history.\n\n` +
      `AIDO-HWEDO. In Fon tradition the rainbow serpent who carried the creator Mawu as she made the world and now lies coiled beneath it, holding it up (Herskovits 1938). Burton (1864): 'Aydo-whe-do, commonly called Danh, the Heavenly Snake, which makes the Popo beads and confers wealth upon man, is the rainbow', with a coiled clay serpent at the foot of a silk-cotton tree or by termite mounds, 'Danh's houses'.\n\n` +
      `DANBALA AND AYIDA WEDO. In Haitian Vodou, the white serpent lwa and his rainbow wife, carried from the Gbe coast in the eighteenth century and changed in Haiti.\n\n` +
      `SIMILARITIES. Mehen and Aido-Hwedo both encircle — one the sun god, one the world. Apep and Aido-Hwedo are both serpents of cosmic scale.\n\n` +
      `DIFFERENCES. Apep is an enemy, Mehen a guard, Aido-Hwedo a carrier and a source of wealth. Apep has rituals of destruction; Aido-Hwedo has offerings. Mehen and Apep live in the netherworld of a solar theology; Aido-Hwedo in a creation story with Mawu. None of the Egyptian serpents is a rainbow; Aido-Hwedo is.\n\n` +
      `EVIDENCE FOR TRANSMISSION. Gbe coast to Haiti: documented (see the words-lane record on Danbala). Egypt to the Gbe coast: none. World-encircling and world-supporting serpents are found from Norse Jörmungandr to Hindu Śeṣa, which is why the existing record 'serpent-is-not-one-symbol' treats such shapes as parallels, not inheritances.\n\n` +
      `ASSESSMENT. Widespread religious practice. A cosmic serpent is one of the commonest images in the world's religions; these four share the image and differ in role.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes each serpent's role in its own sources and the documented Atlantic transmission. It does NOT establish that a shared image implies a shared history.`,
    category: "religion",
    subcategory: "Gods, rituals and landscapes compared",
    eventType: "mainstream",
    tags: serpentTags("rituals", ["figure: apep", "figure: mehen", "figure: aido-hwedo", "figure: damballa and ayida-wedo", "place: thebes and luxor", "place: haiti and brazil"], "comparison", "comparison: widespread religious practice", "cosmology"),
    people: ["Apep", "Mehen", "Ra", "Aido-Hwedo", "Mawu", "Damballa", "Ayida Wedo"],
    civilisations: ["Ancient Egypt", "Fon", "Haitian Vodou practitioners"],
    locationName: "Thebes (Egypt), Abomey and Ouidah (Bénin), Haiti",
    claims: [
      {
        sourceKey: "faulkner_1937_bremner_rhind",
        citations: [
          { sourceKey: "erman_grapow_wb", relation: "context", note: "The Egyptian name ꜥꜣpp." },
        ],
        startYear: bce(310),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Papyrus Bremner-Rhind with the Book of Overthrowing Apep",
        originalDateText: "Papyrus Bremner-Rhind, c. 310 BCE",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: contemporary written. The papyrus is dated by its colophon to the early Ptolemaic period. Apep is much older (Middle Kingdom Coffin Texts); this dates the fullest ritual against him.",
      },
      {
        sourceKey: "herskovits_1938_dahomey",
        citations: [
          { sourceKey: "burton_1864_mission_to_gelele", relation: "supports", note: "'Aydo-whe-do ... is the rainbow', 1864." },
        ],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The Fon creation story in which Aido-Hwedo carries Mawu",
        originalDateText: "Aido-Hwedo carries the creator — an undated Fon tradition",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. Recorded in writing from 1864 (Burton) and in the creation story by Herskovits (1938). The tradition itself has no date and none is given.",
      },
    ],
    media: [pApep, pMehen, pVeve],
  },
  {
    slug: "healing-serpents-nehushtan-egypt-sakpata-dan",
    title: "Healing serpents: Nehushtan, Egyptian serpent magic, Sakpata and Dan",
    summary:
      "The bronze serpent Moses set on a pole, the Egyptian stelae and papyri against snakebite, and the Fon powers of disease and well-being. The Israelite and Egyptian practices are close cousins; the Gbe ones are a different kind of healing altogether.",
    description:
      `NEHUSHTAN. In Num 21:4–9 the Israelites are bitten by 'fiery serpents' and Moses makes a nəḥaš nəḥōšet, a serpent of bronze, on a pole: 'if a serpent had bitten any man, when he beheld the serpent of brass, he lived'. In 2 Kgs 18:4 King Hezekiah breaks 'the brasen serpent that Moses had made: for unto those days the children of Israel did burn incense to it: and he called it Nehushtan'. A copper serpent from the Timna mining shrine (Late Bronze to early Iron Age) is often cited alongside; the dan lane treats it.\n\n` +
      `EGYPTIAN SERPENT MAGIC. Healing statues and stelae — the cippi of Horus, on which the child god grasps snakes and stands on crocodiles — had water poured over them to be drunk against bites (Metropolitan Museum 20.2.23; the Metternich Stela of Nectanebo II). The Brooklyn snakebite papyrus classifies snakes and their treatments, and names the priests of the scorpion goddess Serqet as healers (Sauneron 1989).\n\n` +
      `SAKPATA AND DAN. Among the Fon, Sakpata is the earth and the smallpox it sends; his priests both cause and cure disease (Herskovits 1938). He is not a serpent. Dan and Dangbé bring wealth and well-being; Labat says people appealed to the serpent 'in case of sickness'. Healing here is through priests and offerings to a power, not through an image of the thing that bites.\n\n` +
      `SIMILARITIES. Nehushtan and the Egyptian cippi both use an IMAGE of a dangerous creature to cure its bite — an apotropaic logic the Hebrew text places in the wilderness after the exodus from Egypt. The Gbe and Egyptian traditions both have specialist priests of healing.\n\n` +
      `DIFFERENCES. Sakpata is not a serpent; the Gbe serpents are not used against snakebite; there is no Gbe image-against-bite practice in the sources read. Nehushtan was eventually destroyed as idolatry by a Judahite king; nothing like that happens to the cippi or to Dangbé.\n\n` +
      `EVIDENCE FOR TRANSMISSION. Israel–Egypt: plausible, and proposed by many commentators, from geography and shared practice, but not documented for this object. Either to the Gbe coast: none.\n\n` +
      `ASSESSMENT. Widespread religious practice. Healing through gods, priests and images is near-universal; the one close pairing is Israel and Egypt, not either with the Gbe coast.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes the practices in each source. It does NOT establish that Nehushtan was Egyptian-inspired (a plausible hypothesis), nor that any of these reached West Africa.`,
    category: "religion",
    subcategory: "Gods, rituals and landscapes compared",
    eventType: "mainstream",
    tags: serpentTags("rituals", ["figure: nehushtan", "figure: dan (vodun)", "theme: healing and protection", "figure: yhwh"], "comparison", "comparison: widespread religious practice", "healing"),
    people: ["Moses", "Hezekiah", "Nectanebo II", "Sakpata", "Dan"],
    civilisations: ["Israelites", "Judah", "Ancient Egypt", "Fon"],
    locationName: "Jerusalem, the Nile Valley and southern Bénin",
    claims: [
      {
        sourceKey: "wlc_hebrew_bible",
        citations: [
          { sourceKey: "kjv_bible", relation: "context", note: "English of Num 21:8–9 and 2 Kgs 18:4." },
        ],
        startYear: bce(715),
        endYear: bce(686),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "Hezekiah's destruction of Nehushtan, as the book of Kings narrates it",
        originalDateText: "Hezekiah breaks Nehushtan (2 Kgs 18:4), in his reign c. 715–686 BCE",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: biblical narrative. The date is Hezekiah's reign as reconstructed from Kings; the event itself is known only from the text, written later, and is not archaeologically confirmed.",
      },
      {
        sourceKey: "sauneron_1989_ophiologie",
        citations: [
          { sourceKey: "ikram_2005_divine_creatures", relation: "context", note: "The wider world of Egyptian animal cults in the Late Period." },
        ],
        startYear: bce(360),
        endYear: bce(343),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Metternich Stela, the fullest Egyptian healing stela against snakebite",
        originalDateText: "Metternich Stela, reign of Nectanebo II, 360–343 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: inscription. Dated by the king's name on the stela. The practice is older; this dates the best-known example.",
      },
    ],
    media: [pCippus, pMetternich, pFaTray],
  },

  // =========================================================================
  // RITUALS IN THEMES
  // =========================================================================
  {
    slug: "offerings-sacrifice-and-priests-compared",
    title: "Sacrifice, offerings and the priests between: Dan, Thebes, Napata and Savi",
    summary:
      "Animal sacrifice, food and drink, incense and priestly mediation in the sanctuary at Dan, the Egyptian daily temple ritual, Kushite temples and the Hueda serpent cult. The same broad acts, in different sequences, for different reasons.",
    description:
      `THE SEQUENCES. AT DAN: the excavated sanctuary has a monumental platform, an altar precinct and animal bones read as sacrifices and priestly portions (Greer 2013); the biblical text sets a Levite priest there whose line served 'until the day of the captivity of the land' (Judg 18:30). An Israelite sacrifice runs: bring the animal, slaughter, burn part on the altar, the priest takes his portion, the worshippers eat the rest. IN EGYPT: the daily temple ritual is performed by priests on the king's behalf before the god's statue in its shrine — break the seal, open the shrine, purify, cense, anoint, clothe, present food and drink, withdraw backwards, reseal. IN KUSH: Egyptian-style temple ritual in Amun temples, with offering tables carrying Meroitic texts. AT SAVI AND OUIDAH: Bosman, Labat and Norman describe offerings of food, liquor, cloth, cowries and livestock 'fed' to Dangbé through his priests, who decided what was due; the king paid heavily for the great processions.\n\n` +
      `SIMILARITIES. Everywhere gods are fed, priests stand between the god and the giver, and the king pays for the largest offerings.\n\n` +
      `DIFFERENCES. Incense is central in Israel and Egypt (the Israelites 'did burn incense' to Nehushtan) and not prominent in the early Hueda accounts. In Egypt the god's statue is clothed and fed in a closed shrine; in Hueda the god's living animals move freely through houses and roads. The Israelite altar burns; the Hueda offerings are 'fed' at shrines and accumulated, including imported Atlantic goods (Norman 2014).\n\n` +
      `EVIDENCE FOR TRANSMISSION. Egypt to Kush: documented. Between the Nile or the Levant and the Gbe coast: none beyond the universality of the acts.\n\n` +
      `ASSESSMENT. Widespread religious practice. Feeding gods through priests is among the most common features of religion; the comparison of sequences shows four distinct liturgies.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes the outline of each practice from its sources. It does NOT give the full Hueda sequence of a single offering, which no early source describes step by step; that is a real gap. The full row-by-row matrix (rows 1–3 and 7) is in rituals.md.`,
    category: "religion",
    subcategory: "Gods, rituals and landscapes compared",
    eventType: "mainstream",
    tags: serpentTags("rituals", ["theme: priesthood", "place: tel dan", "place: thebes and luxor", "place: savi and ouidah", "figure: dangbe"], "comparison", "comparison: widespread religious practice", "sacrifice"),
    people: ["Jonathan son of Gershom", "Willem Bosman", "Renaud Des Marchais", "Jean-Baptiste Labat"],
    civilisations: ["Israelites", "Ancient Egypt", "Kush", "Hueda (Xweda)"],
    locationName: "Tel Dan, Thebes, Napata and Savi",
    claims: [
      {
        sourceKey: "greer_2013_dinner_at_dan",
        startYear: bce(900),
        endYear: bce(733),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The Iron Age II sanctuary at Tel Dan with its altar precinct and sacrificial remains",
        originalDateText: "Iron Age II sanctuary at Tel Dan, 9th–8th centuries BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. Dated by stratigraphy and pottery in the excavators' reports. The exact phases are debated and are treated in the dan lane.",
      },
      {
        sourceKey: "norman_2014_pythons_pigs",
        citations: [
          { sourceKey: "des_marchais_labat_1730_voyage", relation: "supports", note: "Labat's account of offerings and processions to the serpent." },
        ],
        startYear: 1650,
        endYear: 1727,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Hueda kingdom whose offerings and shrines are excavated at Savi",
        originalDateText: "Hueda kingdom at Savi, c. 1650–1727",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. Trade goods (Dutch pipes) date the occupation; a burnt layer matches the Dahomean conquest of 1727. Dates the excavated offerings and shrines.",
      },
    ],
    media: [pBarqueAbydos, pTemplePythons],
  },
  {
    slug: "oracles-divination-possession-initiation-compared",
    title: "Oracles, divination, possession and initiation compared",
    summary:
      "Kings asking gods for answers: the Levite at Dan, Amun's moving barque, the Kushite election by oracle, and the Hueda king consulting the serpent. The forms of asking differ, and possession — central to vodun — is absent from the Nile.",
    description:
      `THE SEQUENCES. AT DAN: in Judg 18:5–6 the Danite scouts ask the Levite priest to 'ask counsel of God' and he answers 'Go in peace'; elsewhere the Israelite oracle is the ephod and the Urim and Thummim. IN EGYPT: from the New Kingdom the god's barque, carried on the shoulders of priests in procession, answered questions by moving forward or backward; the god 'chose' Thutmose III by stopping before him (as he later claimed). IN KUSH: Aspelta's Election Stela (c. 600 BCE) has the army and officials present candidate brothers before Amun of Napata, who chooses the king; Tantamani's Dream Stela (664 BCE) makes a dream the warrant for his campaign. IN HUEDA: the serpent is consulted 'for rain, for good weather or in case of sickness or war' (Labat), the king through the priests; Fa geomancy, the Gbe form of the Ifá system, is the main tool of divination.\n\n` +
      `POSSESSION AND INITIATION. Vodun devotees are initiated in seclusion and possessed by the god; Dangbé's female initiates were recruited yearly (Labat, Bosman). No possession cult is attested in pharaonic Egypt; Israel has prophetic ecstasy (1 Sam 10) but not initiation into a god's house.\n\n` +
      `SIMILARITIES. Royal decisions were referred to a god through specialists in all four. The Egyptian and Kushite barque oracle and the Hueda serpent are both a god 'answering' through a physical sign.\n\n` +
      `DIFFERENCES. The barque oracle depends on a carried image in procession; the Hueda serpent answers through its priests, and Fa through a diviner's tray and seeds. Possession, central in vodun, has no Nile counterpart.\n\n` +
      `EVIDENCE FOR TRANSMISSION. Egypt to Kush: documented (Amun's oracle). Fa from the Yoruba Ifá system: documented regional exchange (see 'divination-fa-ifa-afa-comparison'). Nile to Gbe coast: none.\n\n` +
      `ASSESSMENT. Widespread religious practice.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes who consulted whom, how, in each source. It does NOT show a shared oracle technique between the Nile and the Gbe coast.`,
    category: "religion",
    subcategory: "Gods, rituals and landscapes compared",
    eventType: "mainstream",
    tags: serpentTags("rituals", ["theme: oracle and divination", "theme: priesthood", "theme: kingship", "place: napata and meroe", "place: savi and ouidah"], "comparison", "comparison: widespread religious practice", "oracles"),
    people: ["Aspelta", "Tantamani", "Thutmose III", "Dangbé"],
    civilisations: ["Israelites", "Ancient Egypt", "Kush", "Hueda (Xweda)", "Fon"],
    locationName: "Dan, Thebes, Napata and Ouidah",
    claims: [
      {
        sourceKey: "torok_1997_kingdom_of_kush",
        citations: [
          { sourceKey: "russmann_1974_xxvth_dynasty", relation: "context", note: "Kushite kingship in its Egyptian dress." },
        ],
        startYear: bce(600),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Aspelta's Election Stela, a Kushite king chosen by Amun's oracle",
        originalDateText: "Aspelta's Election Stela, c. 600 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: inscription. A royal stela from Jebel Barkal; dated by Aspelta's reign. It records the royal account of the election.",
      },
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        citations: [
          { sourceKey: "merlo_vidaud_1966_black_serpent", relation: "context", note: "Quotes Labat on the serpent consulted for rain, sickness, war and trade." },
        ],
        startYear: 1730,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Labat's 1730 printing of the Hueda serpent consulted on public matters",
        originalDateText: "Labat 1730: the serpent consulted 'for rain ... sickness or war'",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. A French compiler's book (1730) from the Chevalier Des Marchais's papers; Des Marchais was at Whydah in 1715 and again in the 1720s. It dates this description only. It is not the first record: Father Braguez's account of the king's serpent oracle, from before 1698 (printed by Labat in 1722–24), is in the gbe lane (hueda-python-oracle-braguez).",
      },
    ],
    media: [pFaTray, pBarqueAbydos, pDreamStela],
  },
  {
    slug: "living-pythons-images-and-snake-mummies",
    title: "Living pythons, cult images and snake mummies",
    summary:
      "In Hueda the god lived in every royal python, and killing one was a capital crime; in Late Period Egypt snakes were killed, mummified and given as votive offerings; Israel's serpent was a bronze image. Three opposite relationships to the animal.",
    description:
      `THE SEQUENCES. HUEDA: pythons lived in houses and temples; if one crossed the road a priest picked it up and carried it back while traffic waited (Norman 2014, from Barbot); to kill one was punished by death, later by an ordeal (see 'killing-a-python-from-death-to-ordeal'). The god is the living species. EGYPT: in the Late and Ptolemaic periods, animals of many species, snakes among them, were bred or caught, killed, embalmed, wrapped and placed in coffins — wooden or bronze boxes topped with a snake figure — and deposited as votive gifts (Ikram 2005). A single chosen animal could also be a god's living image (the Apis bull), but most votive animals were killed to be offered. ISRAEL: the serpent is a manufactured bronze image; there is no living sacred animal.\n\n` +
      `SIMILARITIES. Egypt and Hueda both treat real animals as bearers of the sacred, and both kept large numbers of them near temples. The Apis bull — one living animal as the god's image — is the nearest Egyptian parallel to Dangbé.\n\n` +
      `DIFFERENCES. Egypt killed snakes to offer them; Hueda forbade killing pythons. Egyptian votive snakes are of many species; the Hueda sacred snake is one species, Python regius. Apis is one chosen bull; Dangbé is every royal python. The Dahomean soldiers who took Savi in 1727 killed and ate the pythons precisely because they were the Hueda god (Snelgrave 1734).\n\n` +
      `EVIDENCE FOR TRANSMISSION. None between Egypt or Kush and the Gbe coast. No snake mummy has been found in West Africa, and no Kushite snake-mummy tradition is documented.\n\n` +
      `ASSESSMENT. Significant difference. Where Egypt killed the sacred animal to send it to the god, Hueda kept it alive as the god.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes three opposite treatments of serpents. It does NOT show any sequence of borrowing.`,
    category: "religion",
    subcategory: "Gods, rituals and landscapes compared",
    eventType: "mainstream",
    tags: serpentTags("rituals", ["theme: living sacred animals", "figure: dangbe", "figure: nehushtan", "place: savi and ouidah"], "comparison", "comparison: significant difference", "animal cults", "mummification"),
    people: ["Dangbé", "William Snelgrave"],
    civilisations: ["Hueda (Xweda)", "Ancient Egypt", "Israelites", "Dahomey"],
    locationName: "Savi and Ouidah; Egyptian animal cemeteries",
    claims: [
      {
        sourceKey: "ikram_2005_divine_creatures",
        startYear: bce(664),
        endYear: bce(30),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The floruit of Egyptian votive animal mummification, snakes included",
        originalDateText: "Late and Ptolemaic periods, 664–30 BCE",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: archaeological. Dated animal cemeteries and coffins. Individual snake mummies are often undated, as the Turin coffin's file page shows.",
      },
      {
        sourceKey: "norman_2014_pythons_pigs",
        citations: [
          { sourceKey: "law_1991_slave_coast", relation: "context", note: "The conquest of 1727 and its aftermath." },
        ],
        startYear: 1727,
        startMonth: 3,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Dahomean conquest of Savi, when the soldiers killed and ate the sacred pythons",
        originalDateText: "March 1727: Dahomey sacks Savi",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. Snelgrave's eyewitness-era account, matched by the burnt destruction layer excavated at Savi.",
      },
    ],
    media: [pSnakeMummy, pSnakeCoffin, pSnakeBox, pPython],
  },
  {
    slug: "coronation-legitimacy-processions-oaths-compared",
    title: "Coronation, legitimacy and oaths in Israel, Egypt, Kush and Hueda: the sequence of actions compared",
    summary:
      "How a reign was made legitimate in four kingdoms, step by step: anointing in Israel, crowning and festival in Egypt, Amun's election and the coronation journey in Kush, and in Hueda sacrifices ordered in the serpent's name, crowning in the palace by an Allada grandee who charges the people to be faithful, gifts, then processions to the serpent's house. The Hueda sequence has no counterpart on the Nile.",
    description:
      `THE SEQUENCES. ISRAEL: a king is anointed with oil by a prophet or priest (Saul, 1 Sam 10; Solomon, 1 Kgs 1:39), acclaimed, enthroned. EGYPT: accession, coronation with the crowns and the uraeus, then the king leads festivals in which the god's barque is carried in procession by priests, with musicians, dancers and offerings — the Opet procession reliefs at Luxor show this in order (Epigraphic Survey 1994). Opet is an Amun festival, not a serpent festival. KUSH: after the old king's death, a coronation journey from Napata to the Amun temples of Kawa, Pnubs and Gematon, the king confirmed by Amun in each (Török 1997); royal women, especially the king's mother, are prominent. HUEDA, in the order of Labat's text (set out in full in the gbe lane, hueda-coronation-rite-allada-crowner): a delay of months or years controlled by the grandees; the serpent's high priest orders the sacrifices 'de la part du grand Serpent'; royal wives process with a clay figure of a seated child; fifteen days of homage before the empty throne; a grandee of Allada ('Ardres'), whose family held the right to crown Hueda kings, is fetched; after days of processions to the serpent's house the king is crowned at night in the palace court; gifts go out to the grandees and richer ones come back. On the Des Marchais plate (an engraving after his drawing, not a picture of the ceremony) the king sits enthroned under a parasol; his wives lie prostrate; European directors sit in a row; drums and trumpets play; the legend names 'the grandee of Ardres who performs the coronation' — the senior kingdom confirms the junior king — and a serpent's hut and a serpent are in the court. Then (Labat): a procession to the serpent's house half a league from Savi, presided over by the king's mother; three months later a second one with the king himself; then annual ones. Norman (2014) adds drummers, trumpeters, praise-singers and gifts of silk and cowries, and the king's gifts to regional chiefs and to the priests.\n\n` +
      `OATHS. Covenant oaths are well known in Israel and oaths by the king's name in Egypt. For Hueda no oath SWORN by the people or the grandees was found in the sources read. What Labat's text records is a charge of fidelity: the Allada crowner lifts the helmet and says three times 'voilà votre Roi, soyez-lui fidèles, & vos prières seront écoutées du Roi d'Ardres mon maître' ('here is your king; be faithful to him, and your prayers will be heard by the king of Ardres, my master'). Fidelity is commanded in the name of a foreign overlord, not sworn before the serpent (later practice NEEDS SOURCE VERIFICATION in Law 1991 and Norman 2010).\n\n` +
      `THIS RECORD AND ITS NEIGHBOURS. This record follows the order of actions across all four kingdoms, with legitimacy and oaths. The narrower question, whether Egypt's royal festivals could be the ancestor of the Hueda rite, is weighed in egyptian-royal-ceremonies-and-hueda-coronations-compared; what the three surviving pictures actually show is read in three-royal-ceremonies-side-by-side; the date of the coronation is examined in hueda-coronation-1715-or-1725.\n\n` +
      `SIMILARITIES. A new reign is completed by going to a god's house; music and public gifts accompany it; royal women matter (the Kushite king's mother, the Hueda king's mother).\n\n` +
      `DIFFERENCES. In Egypt the god travels to the king's festival in a barque; in Hueda the king and his mother travel to the god, who stays. Hueda's crowning is done by a foreign (Allada) dignitary who charges the people in his own king's name; Egyptian and Kushite kings are confirmed by their own gods. Anointing (Israel) has no Hueda equivalent.\n\n` +
      `EVIDENCE FOR TRANSMISSION. Egypt to Kush: documented. Nile to Hueda: none.\n\n` +
      `ASSESSMENT. Widespread religious practice. Ritual completion of a reign at a god's house is common in sacral kingship; the sequences themselves are different.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes the sequence each source gives. It does NOT show that any step was borrowed. Rows 14–19 of rituals.md hold the detail.`,
    category: "religion",
    subcategory: "Gods, rituals and landscapes compared",
    eventType: "mainstream",
    tags: serpentTags("rituals", ["theme: procession and coronation", "theme: kingship", "place: savi and ouidah", "place: thebes and luxor", "place: napata and meroe"], "comparison", "comparison: widespread religious practice", "coronation"),
    people: ["Huffon (king of Hueda)", "the king's mother", "Renaud Des Marchais", "Jean-Baptiste Labat", "Tutankhamun", "Horemheb", "Saul", "Solomon"],
    civilisations: ["Israelites", "Ancient Egypt", "Kush", "Hueda (Xweda)", "Allada"],
    locationName: "Jerusalem, Thebes (Luxor), Napata and Savi",
    claims: [
      {
        sourceKey: "epigraphic_survey_1994_opet",
        startYear: bce(1336),
        endYear: bce(1292),
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Opet procession reliefs of the Luxor colonnade (Tutankhamun, re-inscribed by Horemheb)",
        originalDateText: "Opet reliefs carved under Tutankhamun and Horemheb, c. 1336–1292 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: inscription. Dated by the royal names carved with the reliefs.",
      },
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        citations: [
          { sourceKey: "norman_2014_pythons_pigs", relation: "supports", note: "The parade's music, gifts and political role, from the excavator." },
        ],
        startYear: 1715,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Hueda coronation Des Marchais attended, as Labat's text dates it",
        originalDateText: "Hueda coronation, 1715 in Labat's text (the plate says April 1725)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The text and the plate disagree by ten years; see the gbe lane record hueda-coronation-1715-or-1725.",
      },
    ],
    media: [pLabat, pColonnade, pDreamStela],
  },

  // =========================================================================
  // SECTION 9 — SACRED LANDSCAPES
  // =========================================================================
  {
    slug: "savi-serpent-ditch-vs-nile-valley-landscapes",
    title: "Savi's serpent ditch vs Nile Valley sacred landscapes",
    summary:
      "The ditches around Savi's palace and house compounds, read by Norman and Kelly as python-and-rainbow landscape, set against Egyptian temple enclosures and processional avenues and Kush's Jebel Barkal, whose pinnacle was seen as a giant uraeus. One specific combination is shared — a serpent read into the landscape of kingship — and almost everything else differs.",
    description:
      `SAVI. The Hueda palace at Savi covered about 1.5 by 1 km within a settlement area of about 100 km² (Norman 2014). Its house compounds and villages were ringed by non-contiguous ditches that began as clay borrow-pits, forming with the house walls 'a relatively unbroken series' of boundaries, 'much like a coiled snake'. Norman and Kelly (2004) argue that these ditches, and the great ditches of Dahomey, which Europeans described as fortifications, referenced the python and the rainbow serpent: cool, damp, sinuous, a place pythons live. Norman states plainly that 'Huedans TODAY associate ditches with pythons' — the serpent reading rests on present-day associations projected back to the seventeenth century, supported by the logic of protection and boundary. The palace-to-temple road ran half a league to the serpent's house, with small python shrines along the main road.\n\n` +
      `EGYPT. Temples stood inside high mud-brick enclosure walls, some built in undulating courses that have been read as the waters of creation; avenues of sphinxes linked Karnak and Luxor for the Opet procession. Serpents guard gates and frame sacred space in the netherworld books, and the uraeus frieze crowns shrines. None of this is a serpent-shaped earthwork.\n\n` +
      `KUSH. At Jebel Barkal, the holy mountain of Napata, a free-standing pinnacle on the cliff was understood as a colossal rearing uraeus wearing the White Crown; Taharqa built the temple of Mut against the cliff so that the pinnacle appears in that shape, and his inscriptions were placed on the pinnacle (Kendall and Mohamed 2016). Musawwarat es-Sufra's Great Enclosure, a maze of walled courts and ramps, has no agreed purpose.\n\n` +
      `SIMILARITIES. The specific combination the brief asks for is present in two places: a SERPENT READ INTO THE LANDSCAPE OF KINGSHIP — at Jebel Barkal (a rock as the royal cobra) and at Savi (ditches as the python around the king's capital). Both also have a ceremonial route between palace and god's house.\n\n` +
      `DIFFERENCES. Barkal is a natural rock seen as a cobra wearing a crown, celebrated in royal inscriptions; Savi's ditches are dug boundaries around ordinary compounds as well as the palace, and their serpent meaning is an archaeological interpretation, not a text. Cobra against python and rainbow. Twenty centuries and some 3,500 km apart. The Egyptian enclosures carry no serpent meaning in the sources.\n\n` +
      `EVIDENCE FOR TRANSMISSION. None. No Kushite or Egyptian earthwork or serpent-landscape tradition is documented between the Nile and the Bight of Benin; the routes lane records the gap.\n\n` +
      `ASSESSMENT. Significant difference. One abstract combination is shared; the forms, the animals, the evidence and the dates are not.\n\n` +
      `IMAGE GAP: photographs and survey plans of the Savi ditches — published in Norman and Kelly 2004 (https://doi.org/10.1525/aa.2004.106.1.98) and Norman 2014, Figure 14.3 (https://read.upcolorado.com/read/animals-and-inequality-in-the-ancient-world/section/519f78d2-12b8-4cfd-ad21-97b8e1d432cb) — are not on Wikimedia Commons with a free licence. The 1747 plan of the Savi palace is shown instead, and it does not show the ditches.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes the ditches as excavated features, the Barkal pinnacle as a uraeus in Kushite royal ideology, and the Egyptian enclosures and avenues. It does NOT establish that the Savi ditches meant the python in the seventeenth century (a well-argued interpretation), nor any link between Savi and the Nile.`,
    category: "archaeology",
    subcategory: "Gods, rituals and landscapes compared",
    eventType: "archaeological_interpretation",
    tags: serpentTags("rituals", ["theme: sacred landscape", "theme: kingship", "place: savi and ouidah", "place: napata and meroe", "place: thebes and luxor", "figure: dangbe", "figure: aido-hwedo", "figure: wadjet and the uraeus"], "comparison", "comparison: significant difference", "ditch", "earthworks"),
    people: ["Neil L. Norman", "Kenneth G. Kelly", "Taharqa", "Timothy Kendall"],
    civilisations: ["Hueda (Xweda)", "Dahomey", "Ancient Egypt", "Kush"],
    locationName: "Savi (Bénin), Karnak and Luxor (Egypt), Jebel Barkal and Musawwarat es-Sufra (Sudan)",
    claims: [
      {
        sourceKey: "norman_kelly_2004_landscape_politics",
        citations: [
          { sourceKey: "norman_2014_pythons_pigs", relation: "supports", note: "The excavator's later summary: ditches as borrow-pits around compounds, associated today with pythons." },
        ],
        startYear: 1600,
        endYear: 1727,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The ditch systems around the Savi palace and compounds",
        originalDateText: "Savi's ditches, early 17th century to 1727",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. The settlement coalesces in the early seventeenth century and is destroyed in 1727 (trade goods and a burnt layer). The ditches belong to that occupation; their serpent meaning is an interpretation, not a date.",
      },
      {
        sourceKey: "kendall_mohamed_2016_jebel_barkal",
        citations: [
          { sourceKey: "torok_1997_kingdom_of_kush", relation: "context", note: "Jebel Barkal as the holy mountain of Napatan kingship." },
        ],
        startYear: bce(690),
        endYear: bce(664),
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Taharqa's works that framed the Barkal pinnacle as a uraeus",
        originalDateText: "Taharqa's reign, 690–664 BCE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: inscription. Dated by Taharqa's reign. The reading of the pinnacle as a uraeus is attested in Egyptian and Kushite depictions; the details NEED SOURCE VERIFICATION in Kendall's publications.",
      },
    ],
    media: [pSaviPlan, pBarkal, pMusawwarat],
  },

  // =========================================================================
  // SECTION 10 — THE HYMN AND GENESIS
  // =========================================================================
  {
    slug: "genesis-3-and-the-dangbe-hymn",
    title: "Genesis 3 and the Dangbé hymn: who opened the eyes?",
    summary:
      "In Genesis the serpent promises that eating the fruit will open the eyes, and the eyes are opened; at Ouidah a hymn says it was Dangbé who opened the eyes. The earliest record of the Ouidah tradition comes from a Catholic missionary who heard it in 1866–68 and read it through Genesis — so the resemblance is real, and so is the possibility that Genesis shaped how it was reported.",
    description:
      `THE TWO TEXTS. GENESIS 3:5–7: the serpent says 'in the day ye eat thereof, then your eyes shall be opened, and ye shall be as gods, knowing good and evil'; the woman eats and gives to her husband; 'and the eyes of them both were opened, and they knew that they were naked'. THE HUEDA HYMN as reported from Casimir Agbo: 'Dagbé wè houn noukoun na mi', given in French as 'C'est Dagbé qui a ouvert les yeux à l'homme'. Agbo (1959, p. 16) presents it as 'an éloge in the Houéda language sung by the indigenous fetish priests in ceremonies in honour of the fetish Dagbé'; Merlo and Vidaud cite an earlier version by Agbo in Notes Africaines no. 31 (1946), p. 24. The wording quoted here could not be checked against Agbo's page (NEEDS SOURCE VERIFICATION); the gbe lane's record 'agbo-dangbe-hymn-opened-the-eyes' treats the hymn itself.\n\n` +
      `A WORD-BY-WORD READING (provisional, from Fon cognates, tone unmarked in the source). Dagbé = Dangbé, the python vodun. wè = the Gbe focus particle, 'it is ... that'. houn = hùn, 'open' (Proto-Gbe *ʁʷũ, 'open (a door)', Capo p. 220). noukoun = nùkún, 'eye(s)'. na = ná, 'give, for, to'. mi = a pronoun, 'us' (1st plural) or 'you' (2nd plural) depending on tone. So: 'It is Dangbé who opened the eyes for us/you.' The French 'à l'homme', 'to man', is a gloss, not a translation — the hymn as written does not say 'man'.\n\n` +
      `THE EARLIEST VERSION. Abbé Pierre Bouche of the Société des Missions Africaines lived at Ouidah from September 1866 to April 1868 and printed in 1885: 'Here is the story of the serpent as we heard it told at Wydah: Dan or Danghé (the sacred serpent) is a great fetish, something like uncreated wisdom. God having made the first man and the first woman blind, Dan opened their eyes, and they saw good and evil.' Merlo and Vidaud cite an earlier Bouche article (Le Contemporain, December 1874). Bouche at once compares it with Genesis and with the Gnostic Ophites, 'who venerated the serpent because it had opened the eyes of our first parents and made them know good and evil'. He reports a Yoruba tradition in the same words — 'the man and the woman had their eyes opened by the serpent' — and says such details 'seem modelled on the Bible'. The next reports are by a Dahomean Catholic priest, Father Kitti (1927), then Agbo (1946, 1959) and Hazoumé (1957).\n\n` +
      `WHAT THE PHRASE MEANS LOCALLY. Merlo and Vidaud (n. 48) report that Dangbé 'unseals the eyes with a vegetable medicine' — the verb they chose, 'dessiller', is to unstitch a falcon's eyelids — and add: 'In any case, we never heard any mention of good and evil, as related by the Abbé Bouche.' In Gbe usage 'opening the eyes' commonly means coming to awareness, being initiated into knowledge or civilisation, as their note 31 implies ('the priests and the initiates were the beneficiaries of the "civilization" revealed by the Python-god'). The phrase is therefore about knowledge or initiation, not eyesight; whether it concerned MORAL knowledge rests on Bouche alone.\n\n` +
      `SIMILARITIES. A serpent, the first humans, eyes opened, knowledge gained. That is a distinctive combination, not a generic serpent motif.\n\n` +
      `DIFFERENCES. In Genesis the serpent tempts and is cursed, and opened eyes bring shame; in the hymn Dangbé is praised as humanity's benefactor. Genesis opens eyes by eating a fruit; Merlo and Vidaud's Dangbé uses a plant medicine. 'Good and evil' is in Genesis and in Bouche, and explicitly NOT in what Merlo and Vidaud heard. Norman (2014) says Merlo and Vidaud recorded that Dangbé confers 'the knowledge of good and evil' — the opposite of their own note — which shows how the Genesis frame creeps back in at each retelling.\n\n` +
      `EVIDENCE FOR TRANSMISSION. The only documented channel is recent and Christian: Catholic missionaries at Ouidah from 1861 (Borghero), the first recorder a missionary who heard Genesis in it, the second a Catholic priest, and later writers educated in mission schools (Agbo's own education is reported but NOT VERIFIED here). Portuguese and Brazilian Catholics had lived in Ouidah since the eighteenth century. No ancient channel from Israel or Egypt is documented.\n\n` +
      `ASSESSMENT. Distinctive similarity. The resemblance is specific. The evidence that would decide between independent invention, Christian influence on the tradition, and Christian influence on how it was reported does not exist before 1866; a nineteenth-century missionary channel is a documented possibility, while an ancient one is not.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes that by 1866–68 a tradition at Ouidah credited the serpent with opening the eyes of the first humans, and that every early recorder was Catholic. It does NOT establish the hymn's age, its pre-Christian form, or that 'good and evil' was ever part of it.`,
    category: "religion",
    subcategory: "Gods, rituals and landscapes compared",
    eventType: "disputed",
    tags: serpentTags("rituals", ["figure: dangbe", "figure: yhwh", "theme: names and words", "theme: manuscripts and their dates", "place: savi and ouidah"], "comparison", "comparison: distinctive similarity", "genesis", "hymn", "christian influence"),
    people: ["Casimir Agbo", "Pierre Bouche", "Christian Merlo", "Pierre Vidaud", "Gabriel Kiti", "Paul Hazoumé", "Francesco Borghero", "Neil L. Norman"],
    civilisations: ["Hueda (Xweda)", "Fon", "Israelites", "Société des Missions Africaines"],
    locationName: "Ouidah, Bénin",
    lat: 6.3667,
    lng: 2.0833,
    claims: [
      {
        sourceKey: "bouche_1885_cote_des_esclaves",
        citations: [
          { sourceKey: "merlo_vidaud_1966_black_serpent", relation: "supports", note: "Cites Bouche's earlier article in Le Contemporain (December 1874)." },
        ],
        startYear: 1866,
        endYear: 1868,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "When the earliest recorder heard the 'Dan opened their eyes' tradition at Ouidah",
        originalDateText: "Heard at Wydah by Bouche, September 1866 – April 1868",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Bouche gives the dates of his residence and says he heard the story told at Wydah. It dates the earliest record found, NOT the tradition, which may be older or may have been shaped by contact with Christians.",
      },
      {
        sourceKey: "agbo_1959_histoire_de_ouidah",
        citations: [
          { sourceKey: "merlo_vidaud_1966_black_serpent", relation: "context", note: "Cites Agbo 1946 (Notes Africaines 31, p. 24) and 1959 (p. 16)." },
        ],
        startYear: 1946,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Agbo's first publication of the hymn",
        originalDateText: "Agbo prints the hymn in Notes Africaines, July 1946",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. Known only through Merlo and Vidaud's note 28; the 1946 text was not seen.",
      },
      {
        sourceKey: "wlc_hebrew_bible",
        citations: [
          { sourceKey: "kjv_bible", relation: "context", note: "The English of Gen 3:5–7." },
        ],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The Eden story's own time",
        originalDateText: "Eden, 'in the beginning' — the narrative's own setting",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        evidence:
          "EVIDENCE TYPE: biblical narrative. The story sets itself at the beginning of human history and gives no date; its composition is a separate, disputed question. No position is given.",
      },
    ],
    passages: [
      {
        label: "Genesis 3:5–7 — 'your eyes shall be opened'",
        reference: "Gen 3:5–7",
        sourceKey: "wlc_hebrew_bible",
        objectName: "Leningrad Codex (Firkovich B 19 A), folio 2v",
        holdingInstitution: "National Library of Russia, St Petersburg",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "wlc_hebrew_bible",
            content:
              "כִּ֚י יֹדֵ֣עַ אֱלֹהִ֔ים כִּ֗י בְּיוֹם֙ אֲכָלְכֶ֣ם מִמֶּ֔נּוּ וְנִפְקְח֖וּ עֵֽינֵיכֶ֑ם וִהְיִיתֶם֙ כֵּֽאלֹהִ֔ים יֹדְעֵ֖י ט֥וֹב וָרָֽע׃ וַתֵּ֣רֶא הָֽאִשָּׁ֡ה כִּ֣י טוֹב֩ הָעֵ֨ץ לְמַאֲכָ֜ל וְכִ֧י תַֽאֲוָה־ה֣וּא לָעֵינַ֗יִם וְנֶחְמָ֤ד הָעֵץ֙ לְהַשְׂכִּ֔יל וַתִּקַּ֥ח מִפִּרְי֖וֹ וַתֹּאכַ֑ל וַתִּתֵּ֧ן גַּם־לְאִישָׁ֛הּ עִמָּ֖הּ וַיֹּאכַֽל׃ וַתִּפָּקַ֨חְנָה֙ עֵינֵ֣י שְׁנֵיהֶ֔ם וַיֵּ֣דְע֔וּ כִּ֥י עֵֽירֻמִּ֖ם הֵ֑ם וַֽיִּתְפְּרוּ֙ עֲלֵ֣ה תְאֵנָ֔ה וַיַּעֲשׂ֥וּ לָהֶ֖ם חֲגֹרֹֽת׃",
            language: "Biblical Hebrew",
            script: "Hebrew (square, pointed)",
            evidence:
              "The verb is p-q-ḥ, 'to open (the eyes)', passive: וְנִפְקְחוּ עֵינֵיכֶם, 'your eyes will be opened' (v. 5), וַתִּפָּקַחְנָה עֵינֵי שְׁנֵיהֶם, 'the eyes of both of them were opened' (v. 7). The serpent promises; the eating causes; the result is knowledge of nakedness.",
          },
          {
            layer: "translation",
            sourceKey: "kjv_bible",
            content:
              "For God doth know that in the day ye eat thereof, then your eyes shall be opened, and ye shall be as gods, knowing good and evil. And when the woman saw that the tree was good for food, and that it was pleasant to the eyes, and a tree to be desired to make one wise, she took of the fruit thereof, and did eat, and gave also unto her husband with her; and he did eat. And the eyes of them both were opened, and they knew that they were naked; and they sewed fig leaves together, and made themselves aprons.",
            language: "English",
            evidence: "The King James rendering, public domain.",
          },
        ],
      },
      {
        label: "Bouche at Ouidah, 1866–68: 'Dan leur ouvrit les yeux'",
        reference: "Bouche 1885, pp. 385–386",
        sourceKey: "bouche_1885_cote_des_esclaves",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "bouche_1885_cote_des_esclaves",
            content:
              "Voici l'histoire du serpent, telle que nous l'avons entendu raconter à Wydah : Dan ou Danghé (le serpent sacré) est un grand fétiche, quelque chose comme qui dirait la sagesse incréée. Dieu ayant fait le premier homme et la première femme aveugles, Dan leur ouvrit les yeux, et ils virent le bien et le mal. C'est pourquoi Dan est le plus grand bienfaiteur de l'humanité ; il mérite nos hommages les plus empressés, les plus respectueux.",
            language: "French",
            script: "Latin",
            evidence:
              "Copied from the archive.org scan of the 1885 Plon edition, with OCR errors corrected. A missionary's French retelling of what he heard, not the words of a hymn; 'la sagesse incréée' (uncreated wisdom) is a theological term of his own.",
          },
          {
            layer: "translation",
            sourceKey: null,
            content:
              "Here is the story of the serpent, as we heard it told at Wydah: Dan or Danghé (the sacred serpent) is a great fetish, something like what one might call uncreated wisdom. God having made the first man and the first woman blind, Dan opened their eyes, and they saw good and evil. That is why Dan is the greatest benefactor of humanity; he deserves our most eager, most respectful homage.",
            language: "English",
            viewpoint: "historical",
            evidence: "Translated for this record. 'Fétiche' is kept as 'fetish', the word the missionary used.",
          },
        ],
      },
      {
        label: "The hymn as reported from Agbo: 'Dagbé wè houn noukoun na mi'",
        reference: "Agbo 1959, p. 16 (per Merlo and Vidaud 1966, n. 29)",
        sourceKey: "agbo_1959_histoire_de_ouidah",
        layers: [
          {
            layer: "primary_text",
            sourceKey: "agbo_1959_histoire_de_ouidah",
            content: "Dagbé wè houn noukoun na mi",
            language: "Hueda (Xwela/Xweda Gbe), in French-based spelling",
            script: "Latin",
            evidence:
              "As given in the research request; NEEDS SOURCE VERIFICATION against Agbo's page, which could not be opened. Merlo and Vidaud say learned Dahomeans mixed IPA signs with French spelling and that they themselves dropped the tones.",
          },
          {
            layer: "translation",
            sourceKey: "agbo_1959_histoire_de_ouidah",
            content: "C'est Dagbé qui a ouvert les yeux à l'homme.",
            language: "French",
            evidence: "Agbo's French as reported in the request; not checked against the page. 'À l'homme' (to man) is not in the Gbe line as given.",
          },
          {
            layer: "interpretation",
            sourceKey: "capo_1991_comparative_phonology_gbe",
            content:
              "Dagbé (the python vodun) | wè (focus particle: 'it is ... that') | houn = hùn ('open'; cf. Proto-Gbe *ʁʷũ, 'open (door)', p. 220) | noukoun = nùkún ('eye, eyes') | na = ná ('give / for / to') | mi ('us' or 'you (plural)', by tone). 'It is Dangbé who opened the eyes for us.'",
            language: "English",
            viewpoint: "other",
            evidence:
              "A provisional gloss made for this record from Fon cognates; the Hueda forms, tones and the pronoun's person are not verified. It shows the line is grammatical Gbe, and that 'man' and 'good and evil' are not in it.",
          },
        ],
      },
    ],
    argumentsFor:
      "The combination — a serpent, the first humans, opened eyes, knowledge — is specific, not a generic serpent motif, and it is the closest point of contact between the Hueda tradition and the Hebrew Bible. Ancient-contact writers point to it as a survival; others read it as a shared, independent human idea about serpents and wisdom.",
    argumentsAgainst:
      "The earliest record (Bouche, heard 1866–68) comes from a Catholic missionary who framed it with Genesis and the Ophites, at a time when Catholic missions had been at Ouidah since 1861 and Portuguese and Brazilian Catholics for longer; the next recorder was a Catholic priest. The 'good and evil' element is in Bouche only — Merlo and Vidaud never heard it — and the Gbe line itself says only that Dangbé 'opened the eyes for us'. In Genesis the serpent is cursed; at Ouidah he is the benefactor.",
    genealogies: [
      {
        key: "dangbe-opened-the-eyes",
        claim: "The Ouidah hymn says Dangbé opened the eyes of the first humans to good and evil, as in Genesis",
        verdict: "source_disputed",
        verdictEvidence:
          "The serpent opening the eyes is attested at Ouidah from 1866–68 onward; 'good and evil' rests on one missionary, and the later fieldworkers who looked for it did not hear it. The chain of reports shows the Genesis frame entering with the first recorder and returning in a 2014 paraphrase.",
        whatWouldChangeThis:
          "A pre-1860s record of the tradition (a European trader's journal, a Portuguese or Brazilian account, an Arabic-script document) would test the Christian-influence explanation; a careful recording of the hymn in Hueda with priests' own explanations would show whether 'knowledge of good and evil' is part of it.",
        links: [
          {
            stage: "colonial_record",
            who: "Abbé Pierre Bouche (heard at Wydah 1866–68)",
            year: 1885,
            sourceKey: "bouche_1885_cote_des_esclaves",
            reference: "pp. 385–386",
            says: "Dieu ayant fait le premier homme et la première femme aveugles, Dan leur ouvrit les yeux, et ils virent le bien et le mal.",
            adds: "The first record — and the Genesis and Ophite frame, and 'good and evil'.",
            citationStatus: "verified",
          },
          {
            stage: "community_history",
            who: "Father Gabriel Kiti (Kitti), in La Reconnaissance africaine",
            year: 1927,
            saysAbsentReason: "Known only through Merlo and Vidaud's notes 32 and 50; not seen.",
            adds: "A Dahomean Catholic priest's account of the serpent cult at Ouidah.",
            citationStatus: "unverified",
          },
          {
            stage: "community_history",
            who: "Casimir Agbo, Notes Africaines 31 and Histoire de Ouidah",
            year: 1959,
            sourceKey: "agbo_1959_histoire_de_ouidah",
            reference: "1946, p. 24; 1959, p. 16",
            says: "Dagbé wè houn noukoun na mi — 'C'est Dagbé qui a ouvert les yeux à l'homme' (as reported; not checked)",
            adds: "The hymn in Hueda, said to be sung by the priests; no 'good and evil'.",
            citationStatus: "unverified",
          },
          {
            stage: "early_scholarship",
            who: "Christian Merlo and Pierre Vidaud",
            year: 1966,
            sourceKey: "merlo_vidaud_1966_black_serpent",
            reference: "Diogenes 14 (55), nn. 26–31, 48",
            says: "In any case, we never heard any mention of good and evil, as related by the Abbé Bouche.",
            adds: "Fieldwork at Ouidah; Dangbé unseals the eyes with a vegetable medicine; the Genesis likeness named as 'approximations' that 'favour syncretisms'.",
            citationStatus: "verified",
          },
          {
            stage: "current_scholarship",
            who: "Neil L. Norman, 'Pythons, Pigs, and Political Process'",
            year: 2014,
            sourceKey: "norman_2014_pythons_pigs",
            says: "Merlo and Vidaud (1966:66) recorded that Dangbe confers on people the knowledge of good and evil: he 'opened their eyes.'",
            adds: "Attributes to Merlo and Vidaud the 'good and evil' they say they never heard — the Genesis frame restored by paraphrase.",
            citationStatus: "misattributed",
          },
        ],
      },
    ],
    media: [pLeningrad2b, pEden, pTemplePythons],
  },

  // =========================================================================
  // SECTION 8 — THREE ROYAL CEREMONIES
  // =========================================================================
  {
    slug: "three-royal-ceremonies-side-by-side",
    title: "Three royal ceremonies side by side: Hueda, Egypt and Kush",
    summary:
      "The Des Marchais plate of a Hueda coronation, an Egyptian relief of a king before Amun's festival barque, and the Kushite pylon of Natakamani and Amanitore at Naqa, read feature by feature for only what can actually be seen in each.",
    description:
      `THE THREE PICTURES. (1) HUEDA: 'Couronnement du Roy de Juda ... Avril 1725', an engraving printed in 1730 after Des Marchais's drawing — a European picture with a numbered legend, not a photograph. (2) EGYPT: the relief of Seti I before the festival barque of Amun in his temple at Abydos (c. 1290–1279 BCE); the true Opet procession reliefs at Luxor are not on Commons in a legible free image, so the colonnade that holds them is added as a site view (IMAGE GAP: a legible free image of the Opet procession reliefs, published in The Epigraphic Survey, OIP 112, 1994, https://isac.uchicago.edu/research/publications/oip). (3) KUSH: the front pylon of the Lion Temple at Naqa (1st century CE).\n\n` +
      `RULER'S POSITION. Hueda: the king (legend 2) sits enthroned at the centre-back of the court in front of an open hall, under a parasol held by a grandee (3), while a second grandee fans him (10). Egypt: the king stands at the left, facing right, holding a censer towards the barque. Kush: Natakamani on the left tower and Amanitore on the right, each standing, weapon raised, holding captives.\n\n` +
      `PRIESTS AND RITUAL SPECIALISTS. Hueda: none labelled — the crowning is done by 'the grandee of Ardres' (13), a political envoy, not a priest. Egypt: the barque's bearers are not shown in procession; small attendant figures stand in the lower register, their role not identifiable at this resolution. Kush: not visible.\n\n` +
      `SACRED ANIMALS. Hueda: a serpent (24) on the open ground beside a small conical hut, 'a hut for a serpent about to give birth' (23). Egypt: ram heads on the prow and stern of Amun's barque. Kush: a lion at the feet of each ruler.\n\n` +
      `DIVINE IMAGES. Hueda: none other than the living serpent. Egypt: the barque's veiled cabin-shrine, which holds the god's image, unseen. Kush: none identifiable on the pylon front at this resolution; Apedemak appears on the temple's other walls.\n\n` +
      `OFFERINGS. Hueda: not visible. Egypt: a heaped offering table before the barque, and the king's censer. Kush: not visible.\n\n` +
      `MUSICAL INSTRUMENTS. Hueda: drums and trumpets (12), a large band at the right. Egypt: not visible. Kush: not visible.\n\n` +
      `PROCESSION ORDER. Hueda: not a procession — a seated assembly; the procession to the serpent's house came after (Labat). Egypt: three barques in sequence (Amun, then Khonsu and Mut behind), standing, not moving. Kush: not visible.\n\n` +
      `TEMPLE LOCATION. Hueda: the palace court (1), not a temple; the serpent's house was half a league away and is not in the picture. Egypt: inside the chapel of Amun in Seti I's temple. Kush: the temple front itself.\n\n` +
      `ROYAL WOMEN. Hueda: the king's wives (4), prostrate at the left of the throne. Egypt: not visible. Kush: Queen Amanitore, given the same scale and pose as the king.\n\n` +
      `RITUAL BOUNDARIES. Hueda: the court's walls and gate (15), with guards (20). Egypt: the frame of the chapel wall. Kush: the pylon is itself the temple's boundary.\n\n` +
      `SYMBOLIC OBJECTS AND INSIGNIA. Hueda: parasol, throne, fan; the Europeans' flag (21). Egypt: the censer, the king's crown (details not legible), fans on poles by the barque. Kush: crowns and weapons, details not legible at this resolution.\n\n` +
      `SIMILARITIES. A ruler at the centre of a ceremony with the god present in some form — a serpent, a barque shrine, a temple. DIFFERENCES. Almost everything visible: the Hueda image is a court assembly with Europeans, music and a living serpent; the Egyptian an act of censing before a carried god; the Kushite a royal victory on a temple gate in which the queen equals the king. EVIDENCE FOR TRANSMISSION. Egypt to Kush: the pylon and the smiting pose are Egyptian forms, documented. Either to Hueda: none visible or documented. ASSESSMENT. Significant difference. The label is for what the three pictures show; the broader pattern of completing a reign at a god's house is assessed as widespread religious practice in coronation-legitimacy-processions-oaths-compared and in egyptian-royal-ceremonies-and-hueda-coronations-compared.\n\n` +
      `WHAT THE EVIDENCE DOES AND DOES NOT ESTABLISH. It establishes what each image shows. It does NOT establish what the Hueda ceremony looked like beyond one French captain's drawing, and nothing here should be read as more than the picture shows.`,
    category: "history",
    subcategory: "Gods, rituals and landscapes compared",
    eventType: "mainstream",
    tags: serpentTags("rituals", ["theme: procession and coronation", "theme: kingship", "place: savi and ouidah", "place: naqa", "place: thebes and luxor", "figure: dangbe", "figure: apedemak"], "comparison", "comparison: significant difference", "visual comparison"),
    people: ["Huffon (king of Hueda)", "Renaud Des Marchais", "Seti I", "Natakamani", "Amanitore"],
    civilisations: ["Hueda (Xweda)", "Allada", "Ancient Egypt", "Kush"],
    locationName: "Savi (Bénin), Abydos (Egypt) and Naqa (Sudan)",
    claims: [
      {
        sourceKey: "des_marchais_labat_1730_voyage",
        citations: [
          { sourceKey: "norman_2014_pythons_pigs", relation: "context", note: "The archaeology of the Savi palace in which the scene is set." },
        ],
        startYear: 1730,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of the Hueda coronation engraving",
        originalDateText: "The coronation plate printed in Labat, 1730",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. The book's date; the plate's caption gives April 1725 and the text 1715 (see hueda-coronation-1715-or-1725).",
      },
      {
        sourceKey: "torok_1997_kingdom_of_kush",
        citations: [
          { sourceKey: "epigraphic_survey_1994_opet", relation: "context", note: "The Egyptian royal festival procession for comparison." },
        ],
        startYear: 1,
        endYear: 25,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The Naqa Lion Temple of Natakamani and Amanitore",
        originalDateText: "Naqa Lion Temple, early 1st century CE",
        datingMethod: "regnal_chronology",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: inscription. Dated by the royal names on the temple; Meroitic regnal dates are approximate.",
      },
    ],
    media: [pLabat, pBarqueAbydos, pNaqaPylon, pColonnade],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const link = (from: string, to: string, relation: string, note: string, extra: Partial<SeedEventLink> = {}): SeedEventLink => ({ from, to, relation, note, ...extra });

const links: SeedEventLink[] = [
  // ---- inside the section ----
  link(WORDS, "proto-gbe-snake-word-across-gbe", "evidence_for", "The Gbe side of the comparison, form by form."),
  link(WORDS, "serpent-words-semitic-and-egyptian", "evidence_for", "The Semitic and Egyptian side: Dān's family and the real serpent words."),
  link(WORDS, "snake-words-across-africa-no-shared-root", "related", "The snake words along every proposed route from the Nile to the Gbe coast."),
  link(WORDS, "dan-sacred-name-and-everyday-word", "related", "Why a god named with an everyday Gbe word is named from Gbe."),
  link(WORDS, "danbala-the-gbe-snake-word-that-crossed-the-atlantic", "related", "The control case: a serpent name whose journey is documented."),
  link("proto-gbe-snake-word-across-gbe", "dan-sacred-name-and-everyday-word", "related", "The ordinary noun and the sacred names built on it."),
  link(RITUALS, "serpents-that-protect-kings-wadjet-kush-dangbe", "child_of", "The royal serpents of the fourteen, compared in detail.", { from: "serpents-that-protect-kings-wadjet-kush-dangbe", to: RITUALS }),
  link("cosmic-serpents-apep-mehen-aido-hwedo-damballa", RITUALS, "child_of", "The cosmic serpents of the fourteen, compared in detail."),
  link("healing-serpents-nehushtan-egypt-sakpata-dan", RITUALS, "child_of", "The healing figures of the fourteen, compared in detail."),
  link(RITUALS, "offerings-sacrifice-and-priests-compared", "related", "From gods to the rituals done for them: sacrifice and priests."),
  link(RITUALS, "oracles-divination-possession-initiation-compared", "related", "From gods to rituals: oracles and possession."),
  link(RITUALS, "living-pythons-images-and-snake-mummies", "related", "From gods to rituals: living animals, images and mummies."),
  link(RITUALS, "coronation-legitimacy-processions-oaths-compared", "related", "From gods to rituals: coronation and procession."),
  link(RITUALS, "savi-serpent-ditch-vs-nile-valley-landscapes", "related", "From gods to the landscapes made for them."),
  link(RITUALS, "genesis-3-and-the-dangbe-hymn", "related", "The one textual motif shared between the Hebrew Bible and the Hueda tradition."),
  link("coronation-legitimacy-processions-oaths-compared", "three-royal-ceremonies-side-by-side", "related", "The same comparison done with three pictures, feature by feature."),
  link("serpents-that-protect-kings-wadjet-kush-dangbe", "three-royal-ceremonies-side-by-side", "related", "Kingship and the serpent, seen in the images."),
  link("genesis-3-and-the-dangbe-hymn", WORDS, "related", "The hymn's words — hùn, nùkún — and the Gbe lexicon."),
  link("snake-words-across-africa-no-shared-root", "cosmic-serpents-apep-mehen-aido-hwedo-damballa", "related", "Different words, a shared image: why the image is not evidence of a shared history."),
  link("danbala-the-gbe-snake-word-that-crossed-the-atlantic", "cosmic-serpents-apep-mehen-aido-hwedo-damballa", "related", "Danbala and Ayida Wedo among the cosmic serpents."),
  link("living-pythons-images-and-snake-mummies", "serpents-that-protect-kings-wadjet-kush-dangbe", "related", "Python against cobra: living animal against royal insignia."),
  link("offerings-sacrifice-and-priests-compared", "oracles-divination-possession-initiation-compared", "related", "The priests who receive offerings are the ones who consult the god."),

  // ---- to the other lanes' anchors ----
  link(WORDS, A.dan, "responds_to", "Tests the name argument that runs from the tribe of Dan."),
  link(WORDS, A.gbe, "related", "The Gbe word dan and the vodun that bear it."),
  link(WORDS, A.africanJewish, "related", "The name argument is one leg of the Danites-in-Africa case."),
  link(WORDS, A.routes, "evidence_for", "Linguistic evidence for the routes: no shared serpent word along any of them."),
  link(WORDS, A.assessment, "evidence_for", "Bears on the hypotheses 'shared name through common ancestry' and 'borrowing of serpent vocabulary'."),
  link(RITUALS, A.assessment, "evidence_for", "Bears on 'shared serpent mythology' and 'shared ritual practices'."),
  link(RITUALS, A.egypt, "related", "Wadjet, Apep and Mehen in the comparison."),
  link(RITUALS, A.kush, "related", "Apedemak and the Kushite uraeus in the comparison."),
  link(RITUALS, A.gbe, "related", "Dan, Dangbé, Aido-Hwedo, Legba, Hevioso and Sakpata in the comparison."),
  link(RITUALS, A.dan, "related", "YHWH, the calf at Dan and Nehushtan in the comparison."),
  link(RITUALS, A.routes, "evidence_for", "Ritual evidence for and against each proposed route."),
  link("serpents-that-protect-kings-wadjet-kush-dangbe", A.egypt, "related", "Wadjet and the uraeus from the Egyptian evidence."),
  link("serpents-that-protect-kings-wadjet-kush-dangbe", A.kush, "related", "The Kushite double uraeus from the Kushite evidence."),
  link("cosmic-serpents-apep-mehen-aido-hwedo-damballa", A.egypt, "related", "Apep and Mehen from the Egyptian evidence."),
  link("healing-serpents-nehushtan-egypt-sakpata-dan", A.dan, "related", "Nehushtan from the Israelite evidence."),
  link("offerings-sacrifice-and-priests-compared", A.dan, "related", "The sanctuary and sacrifices at Tel Dan."),
  link("oracles-divination-possession-initiation-compared", A.kush, "related", "Amun's oracle in Kushite royal election."),
  link("coronation-legitimacy-processions-oaths-compared", A.egypt, "related", "Egyptian royal festival processions."),
  link("coronation-legitimacy-processions-oaths-compared", A.kush, "related", "The Kushite coronation journey."),
  link("savi-serpent-ditch-vs-nile-valley-landscapes", A.gbe, "related", "Savi and its ditches in the Gbe lane."),
  link("savi-serpent-ditch-vs-nile-valley-landscapes", A.kush, "related", "Jebel Barkal and Musawwarat in the Kushite lane."),
  link("savi-serpent-ditch-vs-nile-valley-landscapes", A.routes, "evidence_for", "No serpent-landscape tradition is documented between the Nile and the Bight of Benin."),
  link("genesis-3-and-the-dangbe-hymn", A.dan, "related", "The Hebrew Bible's serpent beside the Hueda serpent."),
  link("genesis-3-and-the-dangbe-hymn", A.assessment, "evidence_for", "Bears on 'shared serpent mythology' and 'later cultural transmission through trade and religion'."),
  link("three-royal-ceremonies-side-by-side", A.kush, "related", "Natakamani and Amanitore at Naqa."),
  link("three-royal-ceremonies-side-by-side", A.egypt, "related", "The Egyptian royal barque rites."),
  link("snake-words-across-africa-no-shared-root", A.routes, "evidence_for", "The languages of every route checked for a shared snake word."),
  link("danbala-the-gbe-snake-word-that-crossed-the-atlantic", A.routes, "evidence_for", "Route E: the documented Atlantic transmission as the comparison model."),
  link("dan-sacred-name-and-everyday-word", A.gbe, "related", "Dan, Dangbé and Aido-Hwedo in the Gbe lane."),
  link("serpent-words-semitic-and-egyptian", A.dan, "related", "The Hebrew serpent vocabulary of the tribe of Dan's texts."),
  link("serpent-words-semitic-and-egyptian", A.egypt, "related", "The Egyptian names of Apep, Wadjet and the uraeus."),
  link("living-pythons-images-and-snake-mummies", A.egypt, "related", "Egyptian animal cults and snake mummies."),

  // ---- to records in other sections of this track ----
  link("genesis-3-and-the-dangbe-hymn", "agbo-dangbe-hymn-opened-the-eyes", "responds_to", "Compares the hymn this gbe-lane record presents with Genesis 3."),
  link("coronation-legitimacy-processions-oaths-compared", "hueda-coronation-1715-or-1725", "related", "The date of the coronation Des Marchais attended: 1715 in the text, 1725 on the plate."),
  link("three-royal-ceremonies-side-by-side", "hueda-coronation-1715-or-1725", "related", "The plate read here is the one whose date that record examines."),

  // ---- to records other datasets already seed ----
  link(WORDS, "resemblance-is-not-descent", "relevant", "The general method this word comparison applies: when is a similarity evidence?"),
  link(WORDS, "okomilo-olokun-not-alokoko", "related", "Another resemblance of sound, recorded so it is not mistaken for evidence."),
  link(WORDS, "dan-the-serpent", "related", "The Gbe vodun Dan, whose name is the everyday word for snake."),
  link(WORDS, "dans-belly-foundation-story", "related", "Another 'Dan' — the chief of Dahomey's foundation story — kept apart from both the snake word and the tribe."),
  link(WORDS, "hueda-serpents-egypt-and-israel-speculation", "responds_to", "Atkins's eighteenth-century Israel-or-Egypt derivation, tested here on the name."),
  link("proto-gbe-snake-word-across-gbe", "vodu-first-written-1658", "related", "The 1658 Allada catechism, the earliest written Gbe religious vocabulary; whether it contains dan was not checked."),
  link("dan-sacred-name-and-everyday-word", "how-the-serpent-came-to-hueda", "related", "Where the Hueda serpent came from, in three traditions — all inside the Gbe world."),
  link("danbala-the-gbe-snake-word-that-crossed-the-atlantic", "danbala-and-ayida-wedo", "evidence_for", "The Haitian serpent and rainbow lwa whose names carry Gbe dan and Hwedo."),
  link("danbala-the-gbe-snake-word-that-crossed-the-atlantic", "serpent-symbolism-across-the-atlantic", "related", "The wider Atlantic serpent record."),
  link(RITUALS, "serpent-is-not-one-symbol", "relevant", "The collection's control: three serpents, three meanings — the principle this comparison applies to fourteen figures."),
  link(RITUALS, "not-one-theology", "related", "Fon, Aja, Hueda, Gun and Yoruba religion are not one theology; nor are these fourteen figures."),
  link(RITUALS, "egyptian-origin-theory-for-vodun-and-orisha", "responds_to", "The derivation theory, checked against the gods one by one."),
  link("serpents-that-protect-kings-wadjet-kush-dangbe", "uraeus-kundalini-comparison", "related", "The uraeus in another comparison: the Kundalini reading."),
  link("serpents-that-protect-kings-wadjet-kush-dangbe", "hueda-serpent-priesthood-and-the-king", "related", "The serpent's high priest and the Hueda king."),
  link("serpents-that-protect-kings-wadjet-kush-dangbe", "temple-of-pythons-today", "related", "Dangbé's house today."),
  link("cosmic-serpents-apep-mehen-aido-hwedo-damballa", "set-spears-apep", "related", "Set spearing Apep from the solar barque — the enemy serpent in action."),
  link("cosmic-serpents-apep-mehen-aido-hwedo-damballa", "dan-aido-hwedo-and-the-cosmic-serpent-comparison", "related", "The existing comparison of Dan and Aido-Hwedo with the world's cosmic serpents; this record adds Apep and Mehen."),
  link("cosmic-serpents-apep-mehen-aido-hwedo-damballa", "aido-hwedo-the-rainbow-serpent", "related", "The existing Aido-Hwedo record tells the rainbow-serpent tradition in full; this comparison only summarises it."),
  link("cosmic-serpents-apep-mehen-aido-hwedo-damballa", "danbala-and-ayida-wedo", "related", "Danbala and Ayida Wedo in full."),
  link("healing-serpents-nehushtan-egypt-sakpata-dan", "nehushtan-kundalini-comparison", "related", "Nehushtan in another comparison: the Kundalini reading."),
  link("healing-serpents-nehushtan-egypt-sakpata-dan", "sakpata", "related", "Sakpata, earth and disease."),
  link(RITUALS, "legba", "related", "Legba, one of the fourteen, who is not a serpent."),
  link(RITUALS, "heviosso-thunder", "related", "Hevioso, one of the fourteen, who is not a serpent."),
  link("oracles-divination-possession-initiation-compared", "divination-fa-ifa-afa-comparison", "related", "Fa, Ifá and Afa: the documented regional exchange of a divination system."),
  link("oracles-divination-possession-initiation-compared", "initiation-and-restricted-knowledge", "related", "Initiation and the levels of knowledge in vodun."),
  link("offerings-sacrifice-and-priests-compared", "hueda-serpent-priesthood-and-the-king", "related", "The priests who received the serpent's offerings."),
  link("offerings-sacrifice-and-priests-compared", "hueda-snake-trees-and-sea", "related", "Snake, trees and sea: what the Hueda fed."),
  link("living-pythons-images-and-snake-mummies", "killing-a-python-from-death-to-ordeal", "related", "The law protecting living pythons."),
  link("living-pythons-images-and-snake-mummies", "dahomey-soldiers-and-the-pythons-1727", "related", "The day the Hueda god was killed and eaten."),
  link("living-pythons-images-and-snake-mummies", "hueda-hog-slaughter-1697", "related", "A hog eats a python, and the king orders the hogs killed."),
  link("coronation-legitimacy-processions-oaths-compared", "hueda-coronation-and-serpent-processions-1725", "related", "The coronation and serpent processions as Des Marchais recorded them."),
  link("coronation-legitimacy-processions-oaths-compared", "dangbe-wives-in-european-accounts", "related", "The serpent's female devotees, who walked in the processions."),
  link("three-royal-ceremonies-side-by-side", "hueda-coronation-and-serpent-processions-1725", "related", "The written account that goes with the plate."),
  link("savi-serpent-ditch-vs-nile-valley-landscapes", "savi-excavated", "evidence_for", "The excavation of the Hueda capital whose ditches are compared here."),
  link("savi-serpent-ditch-vs-nile-valley-landscapes", "hueda-kingdom-and-savi", "related", "Hueda and its capital."),
  link("savi-serpent-ditch-vs-nile-valley-landscapes", "kpasse-forest-ouidah", "related", "The Kpassè forest, a sacred landscape of Ouidah."),
  link("genesis-3-and-the-dangbe-hymn", "borghero-meets-glele-1861", "related", "1861: the Catholic mission reaches Ouidah, five years before Bouche heard the story."),
  link("genesis-3-and-the-dangbe-hymn", "supreme-god-question-mawu-and-the-missionaries", "related", "The same question asked of Mawu: how did missionaries shape the record of African theology?"),
  link("genesis-3-and-the-dangbe-hymn", "aguda-catholics-in-a-vodun-kingdom", "related", "Brazilian Catholic returnees at Ouidah — another Christian channel."),
];

export const WORDS_AND_RITUALS: SerpentSection = { sources, events, links };
