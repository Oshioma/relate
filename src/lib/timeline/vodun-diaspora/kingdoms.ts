// TRACK: see VODUN_DIASPORA_TRACKS.kingdoms in ./shared.ts.
//
// VODUN AND THE KINGDOMS: ALLADA, HUEDA AND DAHOMEY.
//
// What this section is for. The Bénin datasets already tell the political
// story (benin-deep-past: Tado, the three brothers, Hueda and Savi;
// benin-dahomey: the kings, the Customs, human sacrifice) and the religious
// one in outline (benin-vodun: Dan, the Temple of Pythons, Bosman, "conquest
// did not destroy the religion of the conquered"). This section works the
// seam between them: how royal power and vodun held each other up in three
// kingdoms, and what the eyewitness record — read in this session — actually
// says, source by source.
//
// HOW IT WAS RESEARCHED. The European eyewitnesses were read in full-text
// scans on archive.org in this session: Phillips (1694, in Churchill's
// Collection, vol. 6), Bosman (English edition of 1705, Letter XIX), Barbot
// (Churchill, vol. 5, 1732), Labat's Des Marchais (1730, vol. 2), Snelgrave
// (1734), Atkins (1735), Dalzel (1793), Forbes (1851, vol. 1), Burton (1864,
// vols 1–2) and Skertchly (1874). Quotations from them are copied from those
// scans, with the long s modernised. Norris (1789) was downloaded but its
// scan could not be searched, so it is not cited. The modern scholarship
// (Law, Bay, Blier, Parés, Akinjogbin, Herskovits) was identified and its
// bibliographic details checked through publisher and catalogue records and
// reviews; it is paraphrased, never quoted, and claims that rest on details
// not seen in this session say NEEDS SOURCE VERIFICATION.
//
// WHAT THIS SECTION WILL NOT DO. Treat any European writer as neutral; treat
// a traveller's catalogue of "fetishes" as a theology; give a religious
// origin a date; or present a tradition about who introduced a god as a
// documented event.

import type { SeedEvent, SeedEventLink, SeedSource } from "../seed-types";
import { VODUN_DIASPORA_ANCHORS, commonsPicture, vodunTags, type VodunSection } from "./shared";

const TRACK = "kingdoms" as const;
const ANCHOR = VODUN_DIASPORA_ANCHORS.kingdoms;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // ---- European eyewitnesses, read in this session ---------------------------
  {
    key: "phillips_hannibal_1694",
    title: "A Journal of a Voyage made in the Hannibal of London, Ann. 1693, 1694",
    author: "Thomas Phillips",
    publisher: "In A. and J. Churchill (eds), A Collection of Voyages and Travels, vol. 6, London",
    reference: "The Whidaw section of the journal (the alligator pond, the snakes in Phillips's lodging, the king of Whidaw); read in the 1744–46 printing of vol. 6",
    url: "https://archive.org/details/b30455042_0006",
    sourceType: "primary",
    publishedYear: 1732,
    publishedDisplay: "voyage 1693–94; first printed 1732",
    notes:
      "Cited for an English slave-ship captain's first-hand observations at Whydah in 1694: the 'alligators' kept in a pond as 'the king of great Ardas's Fetish or god, as the snake is the god of the Whidawers', the tame snakes carried out of his room by boys, and the warning that killing one 'has cost the lives of some white men'. VIEWPOINT: a slaver who calls the snake 'this type of the devil'. Quotations copied from the archive.org scan.",
  },
  {
    key: "bosman_guinea_1705",
    title: "A New and Accurate Description of the Coast of Guinea, Divided into the Gold, the Slave, and the Ivory Coasts",
    author: "Willem Bosman",
    publisher: "James Knapton and Dan. Midwinter, London (English translation of the Dutch edition of 1704)",
    reference: "Letter XIX, pp. 357–382 of the 1705 English edition (read in the 1907 facsimile reprint)",
    url: "https://archive.org/details/newaccuratedescr00bosm",
    sourceType: "primary",
    publishedYear: 1705,
    publishedDisplay: "Dutch 1704; English 1705",
    notes:
      "Cited for things the benin-vodun record on Bosman does not cover: the hog slaughter of 1697 ordered by the Hueda king at the priests' request (pp. 381–382), the story of the English traders killed for killing a snake (pp. 376–377), the snake, the trees and the sea as three orders of gods, and the priests' authority. VIEWPOINT: a Dutch West India Company factor writing satirically about 'idolatry' for a Protestant readership. Quotations copied from the archive.org scan.",
  },
  {
    key: "barbot_description_1732",
    title: "A Description of the Coasts of North and South-Guinea",
    author: "John Barbot",
    publisher: "In A. and J. Churchill (eds), A Collection of Voyages and Travels, vol. 5, London",
    reference: "Book IV, ch. 3, 'Of the religion of the people of Fida', pp. 339–341",
    url: "https://archive.org/details/descriptionofcoa00barb",
    sourceType: "primary",
    publishedYear: 1732,
    publishedDisplay: "written c. 1680s–1712; printed 1732",
    notes:
      "Cited for a Huguenot trader's account of Hueda religion — a remote supreme being and three principal deities (snake, lofty trees, sea), the snake-house 'two leagues or more from the king's town', and a story of the chief snake leaving 'another country' because of men's wickedness. Also cited AS A CASE OF BORROWING: its story of the English killed for killing a snake follows Bosman closely. Read on archive.org.",
  },
  {
    key: "labat_des_marchais_1730",
    title: "Voyage du chevalier Des Marchais en Guinée, isles voisines, et à Cayenne, fait en 1725, 1726 & 1727, tome second",
    author: "Jean-Baptiste Labat (from the papers of Renaud Des Marchais)",
    publisher: "Saugrain, Paris",
    reference: "Vol. 2, the chapters on the religion of Juda (approx. pp. 150–200; page numbers read from a poor OCR scan)",
    url: "https://archive.org/details/voyageduchevali02labagoog",
    sourceType: "primary",
    publishedYear: 1730,
    publishedDisplay: "visit 1725; published 1730",
    notes:
      "Cited for a French account compiled by the Dominican Labat from the journals of the French captain Des Marchais, who was at Whydah in 1725: the tradition that the serpent came over from the army of Ardres (Allada) during a battle and gave Hueda the victory; the grand sacrificateur and order of priests; women consecrated to the serpent every year; the procession to the serpent's house after a king's coronation, presided over by the king's mother, a second one three months later with the king, and an annual one; and sacrifices to the sea. Read on archive.org; quoted in French.",
  },
  {
    key: "snelgrave_new_account_1734",
    title: "A New Account of Some Parts of Guinea, and the Slave-Trade",
    author: "William Snelgrave",
    publisher: "James, John and Paul Knapton, London",
    reference: "Introduction / first part, 'the history of the late conquest of the kingdom of Whidaw by the King of Dahomè' (the passage on the river crossing at Sabee and the snakes)",
    url: "https://archive.org/details/newaccountofsome00snel",
    sourceType: "primary",
    publishedYear: 1734,
    publishedDisplay: "events 1727; published 1734",
    notes:
      "Cited for the eyewitness-era report that the Hueda left the river crossing above Sabee unguarded, going morning and evening to make sacrifice to 'a particular harmless Snake', and that after the conquest Dahomean soldiers held the snakes up, said 'If you are Gods, speak and save yourselves', and then cut off their heads, roasted and ate them. VIEWPOINT: an English slave-ship captain with a defence of the trade to make. Read on archive.org.",
  },
  {
    key: "atkins_voyage_1735",
    title: "A Voyage to Guinea, Brasil, and the West-Indies; in His Majesty's Ships, the Swallow and Weymouth",
    author: "John Atkins",
    publisher: "Caesar Ward and Richard Chandler, London",
    reference: "pp. 113–119 (Whydah)",
    url: "https://archive.org/details/voyagetoguineabr00atki",
    sourceType: "primary",
    publishedYear: 1735,
    publishedDisplay: "voyage 1721; published 1735",
    notes:
      "Cited for a naval surgeon's report from Whydah in 1721: the snake as 'the principal Deity or Fetish of the Country'; a grand fetisher or high priest 'held in equal Reverence with the King himself; nay, sometimes more', able 'to humble the King himself'; death for a native who kills a snake; priestesses with virgins devoted to the snake; groves consecrated to it; and his own speculations that snake-worship might derive from Mosaic or Egyptian practice. VIEWPOINT: hostile and speculative. Read on archive.org.",
  },
  {
    key: "dalzel_history_dahomy_1793",
    title: "The History of Dahomy, an Inland Kingdom of Africa",
    author: "Archibald Dalzel",
    publisher: "Printed for the author, London",
    reference: "Introduction (on religion: 'The tiger is the fetish of Dahomy; the snake, that of Whydah'); p. 197 (the Tamegan sent to Allada 'to make fetish'); the reign of Trudo (Agaja)",
    url: "https://archive.org/details/historydahomyan00dalzgoog",
    sourceType: "primary",
    publishedYear: 1793,
    publishedDisplay: "1793",
    notes:
      "Cited for a former slave-trader's history compiled from his own and others' memoirs: the leopard ('tiger') as the fetish of Dahomey and the snake as that of Whydah; leopard skins withheld from display at the Customs because exposing them would be sacrilege; the king's prime minister, the Tamegan (Migan), sent with priests to Allada to 'make fetish' in the later 1780s; and Agaja contenting his priests with four hundred of eighteen hundred captives. VIEWPOINT: written to support the slave trade against abolition. Read on archive.org.",
  },
  {
    key: "forbes_dahomey_1851",
    title: "Dahomey and the Dahomans; being the journals of two missions to the King of Dahomey, and residence at his capital, in the years 1849 and 1850",
    author: "Frederick E. Forbes",
    publisher: "Longman, Brown, Green, and Longmans, London",
    reference: "Vol. 1, p. 82 (religion: 'The Fetish of Abomey is the leopard, that of Whydah the snake'); pp. 107–109 (Whydah: de Souza and the snake penalty; the snake fetish house)",
    url: "https://archive.org/details/dahomeyanddahom01forbgoog",
    sourceType: "primary",
    publishedYear: 1851,
    publishedDisplay: "visits 1849–50; published 1851",
    notes:
      "Cited for a British naval officer's statements that 'the religion of Dahomey is a mystery only known to the initiated'; that sacrifices at the Customs were offered to 'the Voh-dong' and to the ancestors; that Francisco Félix de Souza abolished death as the punishment for killing a 'fetish snake', replacing it with an ordeal; and for a description of the snake temple built round a cotton tree. VIEWPOINT: an anti-slave-trade envoy. Read on archive.org.",
  },
  {
    key: "burton_mission_gelele_1864",
    title: "A Mission to Gelele, King of Dahome",
    author: "Richard F. Burton",
    publisher: "Tinsley Brothers, London (2 vols)",
    reference: "Vol. 1, pp. 93–96 (the Danhgbwe at Whydah); vol. 2, the chapter 'Of the Dahoman Religion', pp. 135–150 (Mau and Lisa; Bosman's three orders; Hu and the Hu-no; Agasun and the Agasun-no; Li; Nesu); vol. 2, the palace walls (the barn 'called after Ahwanjile')",
    url: "https://archive.org/details/missiontogelelek02burt_0",
    sourceType: "primary",
    publishedYear: 1864,
    publishedDisplay: "visit 1863–64; published 1864",
    notes:
      "Cited for the most detailed nineteenth-century catalogue of Dahomean vodun by a European, including statements found nowhere earlier: that Nesu was 'the proper Ffon fetish of Agbome, established by Agaja the Conqueror'; that the king dismounted and prostrated at the Agasun-no's door; that the Hu-no of Whydah was 'now considered the highest of all, a fetish king'; that Catholic missionaries called themselves Mau-no; and that when Dahomey 'permitted serpent-worship to continue, the Whydahs ... became almost reconciled to the new stern rule'. VIEWPOINT: a British consul with strong racial prejudices and a taste for comparative speculation. Read on archive.org (both volumes).",
  },
  {
    key: "skertchly_dahomey_1874",
    title: "Dahomey As It Is; being a narrative of eight months' residence in that country",
    author: "J. A. Skertchly",
    publisher: "Chapman and Hall, London",
    reference: "pp. 54–55 (the snake temple at Whydah; the penalty for killing a Danhgbwe); p. 150 (the Agasunno as head of the metropolitan clergy); ch. XXVI (Hu and the Huno)",
    url: "https://archive.org/details/dahomeyasitisbei00sker",
    sourceType: "primary",
    publishedYear: 1874,
    publishedDisplay: "residence 1871; published 1874",
    notes:
      "Cited for an English naturalist's statements that the Danhgbwe 'when that kingdom was conquered, was introduced into the Dahoman Pantheon'; that under the late king (Ghezo) a native who killed one 'was at once sacrificed' and his property confiscated, now replaced by an ordeal; that the priest of Agasun 'is the head of all the metropolitan clergy' but does not rank next to the king 'as Burton says'; and for the Huno's procession to the beach. Read on archive.org.",
  },

  // ---- Modern scholarship ------------------------------------------------------
  {
    key: "law_slave_coast_1991",
    title: "The Slave Coast of West Africa 1550–1750: The Impact of the Atlantic Slave Trade on an African Society",
    author: "Robin Law",
    publisher: "Clarendon Press, Oxford",
    sourceType: "academic_book",
    publishedYear: 1991,
    publishedDisplay: "1991",
    reference: "Chapters on Allada and Hueda before the Dahomean conquest, on religion and kingship, and on the conquests of 1724 and 1727",
    notes:
      "THE STANDARD HISTORY of Allada and Hueda in the period of the European sources, cited for their political structure, the relation of their kings to priests and cults, and the critical use of Bosman, Barbot, Phillips, Snelgrave, Atkins and Labat. Not opened in this session; cited at chapter level. NEEDS SOURCE VERIFICATION for specific pages.",
  },
  {
    key: "law_religion_trade_politics_1991",
    title: "Religion, Trade and Politics on the 'Slave Coast': Roman Catholic Missions in Allada and Whydah in the Seventeenth Century",
    author: "Robin Law",
    publisher: "Journal of Religion in Africa 21 (1)",
    reference: "Journal of Religion in Africa 21 (1991), pp. 42–77",
    sourceType: "academic_paper",
    publishedYear: 1991,
    publishedDisplay: "1991",
    notes:
      "Cited for the Spanish Capuchin mission to Allada (1660–61) and later Catholic contacts with Allada and Whydah, read as diplomacy and trade as much as evangelisation. Bibliographic details confirmed from several reference lists in this session; the text was not opened. NEEDS SOURCE VERIFICATION for the mission's personnel and the reasons for its failure.",
  },
  {
    key: "tardieu_arda_capuchins_1995",
    title: "La embajada de Arda en Cartagena de Indias (1657) y la misión de los capuchinos (1658–1661): del quid pro quo al fracaso",
    author: "Jean-Pierre Tardieu",
    publisher: "América Negra 10",
    reference: "América Negra 10 (1995); open copy on HAL (hal-04058774), not reachable from this environment",
    url: "https://hal.univ-reunion.fr/hal-04058774/document",
    sourceType: "academic_paper",
    publishedYear: 1995,
    publishedDisplay: "1995",
    notes:
      "Cited for the embassy from the king of Arda (Allada) that reached Cartagena in 1657 and the Spanish Capuchin mission of 1658–1661, which the title itself describes as moving 'from misunderstanding to failure'. Identified and its title and scope confirmed in search results; the full text could not be opened. NEEDS SOURCE VERIFICATION for every detail beyond those.",
  },
  {
    key: "law_ouidah_2004",
    title: "Ouidah: The Social History of a West African Slaving Port, 1727–1892",
    author: "Robin Law",
    publisher: "Ohio University Press / James Currey, Athens OH and Oxford",
    sourceType: "academic_book",
    publishedYear: 2004,
    publishedDisplay: "2004",
    reference: "Chapters on Ouidah under Dahomean rule, its religious institutions, the Yovogan and the Brazilian community",
    notes:
      "Cited for Ouidah after the conquest of 1727: the survival of Hueda cults under Dahomean administration, the town's founding traditions, the Afro-Brazilian community and the Catholic presence at the Portuguese fort. Not opened in this session; cited at chapter level. NEEDS SOURCE VERIFICATION for specific pages.",
  },
  {
    key: "akinjogbin_dahomey_neighbours_1967",
    title: "Dahomey and Its Neighbours 1708–1818",
    author: "I. A. Akinjogbin",
    publisher: "Cambridge University Press",
    reference: "Cambridge University Press",
    sourceType: "academic_book",
    publishedYear: 1967,
    publishedDisplay: "1967",
    notes:
      "Cited for the political history of Dahomey's eighteenth century, including Agonglo's reception of Portuguese missionaries and his assassination in 1797, which Akinjogbin attributes to a palace conspiracy (a woman named Na Wanjile is reported as the killer). Details reached through the Wikipedia article on Agonglo, which cites it without pages. NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "bay_kpojito_1995",
    title: "Belief, Legitimacy and the Kpojito: An Institutional History of the 'Queen Mother' in Precolonial Dahomey",
    author: "Edna G. Bay",
    publisher: "Journal of African History 36 (1)",
    reference: "Journal of African History 36 (1995), pp. 1–27",
    sourceType: "academic_paper",
    publishedYear: 1995,
    publishedDisplay: "1995",
    notes:
      "Cited for the argument that eighteenth-century kpojito were central to the kings' efforts to establish legitimacy and control over an expanding territory, with the office at its height under Hwanjile and Tegbesu — and for Hwanjile's religious reorganisation as Bay reconstructs it from oral tradition. Abstract and bibliographic details seen in this session; the text was not opened.",
  },
  {
    key: "bay_wives_leopard_1998",
    title: "Wives of the Leopard: Gender, Politics, and Culture in the Kingdom of Dahomey",
    author: "Edna G. Bay",
    publisher: "University of Virginia Press, Charlottesville",
    reference: "University of Virginia Press, Charlottesville",
    sourceType: "academic_book",
    publishedYear: 1998,
    publishedDisplay: "1998",
    notes:
      "Cited for the palace as a religious as well as political institution: Hwanjile's introduction of Mawu and Lisa as heads of the Dahomean pantheon as remembered in tradition, the kpojito's role in bringing in vodun, and the case of Agonglo's wife Sophie, who is reported to have introduced a Christian shrine among the vodun. Not opened in this session; the Sophie and Hwanjile details were reached through Wikipedia articles that cite it. NEEDS SOURCE VERIFICATION for pages.",
  },
  {
    key: "blier_path_leopard_1995",
    title: "The Path of the Leopard: Motherhood and Majesty in Early Danhomè",
    author: "Suzanne Preston Blier",
    publisher: "Journal of African History 36 (3)",
    reference: "Journal of African History 36 (1995), pp. 391–417",
    sourceType: "academic_paper",
    publishedYear: 1995,
    publishedDisplay: "1995",
    notes:
      "Cited for the reading of Dahomey's leopard-origin story — the dynasty descended from Agasu, child of a princess and a leopard — as a mythologised account of the dynasty's beginnings, and for the importance of the early royal women in it. Abstract and details seen in this session; the text was not opened.",
  },
  {
    key: "herskovits_dahomey_1938",
    title: "Dahomey: An Ancient West African Kingdom",
    author: "Melville J. Herskovits",
    publisher: "J. J. Augustin, New York (2 vols)",
    reference: "J. J. Augustin, New York (2 vols)",
    sourceType: "academic_book",
    publishedYear: 1938,
    publishedDisplay: "1938",
    notes:
      "Cited for the 1930s description of the royal cults — the cult of the royal ancestors, the tohwiyo and toxosu, the Agasu cult — and of priesthoods under royal supervision. A colonial-era ethnography whose systematised 'pantheon' later summaries copy. Not opened in this session; cited at volume level. NEEDS SOURCE VERIFICATION for pages.",
  },
  {
    key: "pares_rei_pai_morte_2016",
    title: "O rei, o pai e a morte: a religião vodum na antiga Costa dos Escravos na África Ocidental",
    author: "Luis Nicolau Parés",
    publisher: "Companhia das Letras, São Paulo",
    reference: "Companhia das Letras, São Paulo",
    sourceType: "academic_book",
    publishedYear: 2016,
    publishedDisplay: "2016",
    notes:
      "THE MAIN MODERN STUDY OF VODUN AND KINGSHIP on the Slave Coast between about 1650 and 1850, covering Allada, Hueda and Dahomey; its title names the three axes — the king (politics), the father (kinship) and death (the ancestors). Cited for the overall argument that royal power and vodun shaped each other. Scope confirmed through catalogue records and a review in this session; the book was not opened. NEEDS SOURCE VERIFICATION for specific arguments and pages.",
  },
  {
    key: "pares_agoue_baptism_2015",
    title: "Afro-Catholic Baptism and the Articulation of a Merchant Community, Agoué, 1840–1860",
    author: "Luis Nicolau Parés",
    publisher: "History in Africa 42",
    reference: "History in Africa 42 (2015), pp. 165–202",
    sourceType: "academic_paper",
    publishedYear: 2015,
    publishedDisplay: "2015",
    notes:
      "Cited for the mass baptisms at Agoué in 1846 and 1855, conducted by Black priests based at the Portuguese fort at Ouidah before the French missionaries arrived in 1861, and for Catholicism as the identity marker of the returnee 'Brazilian' (Aguda) community. Abstract seen in this session.",
  },
  {
    key: "pares_formation_candomble_2013",
    title: "The Formation of Candomblé: Vodun History and Ritual in Brazil",
    author: "Luis Nicolau Parés",
    publisher: "University of North Carolina Press, Chapel Hill (trans. Richard Vernon)",
    reference: "University of North Carolina Press, Chapel Hill (trans. Richard Vernon)",
    sourceType: "academic_book",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for the links and the limits of the links between Dahomean royal vodun and the Jeje houses of Brazil, including the Casa das Minas of São Luís. Not opened in this session.",
  },
  {
    key: "verger_agontime_1953",
    title: "Le culte des vodoun d'Abomey aurait-il été apporté à Saint-Louis de Maranhon par la mère du roi Ghézo?",
    author: "Pierre Verger",
    publisher: "In Les Afro-Américains, Mémoires de l'IFAN 27, Dakar",
    reference: "In Les Afro-Américains, Mémoires de l'IFAN 27, Dakar",
    sourceType: "academic_paper",
    publishedYear: 1953,
    publishedDisplay: "1953",
    notes:
      "THE ORIGIN OF THE HYPOTHESIS that Na Agontimé, mother of King Ghezo, sold into slavery under Adandozan, founded the Casa das Minas in São Luís. Its title is itself a question. Not opened in this session; its content is reported through Cavalcanti 2019. NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "cavalcanti_casa_das_minas_2019",
    title: "A Casa das Minas de São Luís do Maranhão e a saga de Nã Agontimé",
    author: "Maria Laura Viveiros de Castro Cavalcanti",
    publisher: "Sociologia & Antropologia 9 (2)",
    reference: "Sociologia & Antropologia 9 (2019), no. 2",
    sourceType: "academic_paper",
    publishedYear: 2019,
    publishedDisplay: "2019",
    notes:
      "Cited for the history of the Agontimé hypothesis: the studies of the 1940s that established the Casa das Minas's Dahomean origin, Verger's 1953 narrative, and the argument that the 'saga of Nã Agontimé' sits at the confluence of myth and history. Abstract seen in this session.",
  },
  {
    key: "ferretti_querebenta_1985",
    title: "Querebentã de Zomadônu: etnografia da Casa das Minas do Maranhão",
    author: "Sergio Figueiredo Ferretti",
    publisher: "EDUFMA, São Luís",
    reference: "EDUFMA, São Luís",
    sourceType: "academic_book",
    publishedYear: 1985,
    publishedDisplay: "1985",
    notes:
      "The standard ethnography of the Casa das Minas, whose full name honours the vodun Zomadonu. Cited for Zomadonu's place at the head of the house and for the house's royal Dahomean vodun families. Not opened in this session. NEEDS SOURCE VERIFICATION for details.",
  },
  {
    key: "borghero_journal_1997",
    title: "Journal de Francesco Borghero, premier missionnaire du Dahomey (1861–1865)",
    author: "Francesco Borghero (ed. Renzo Mandirola and Yves Morel)",
    publisher: "Karthala, Paris",
    reference: "Karthala, Paris",
    sourceType: "primary",
    publishedYear: 1997,
    publishedDisplay: "written 1861–65; edited 1997",
    notes:
      "Cited for the first mission of the Société des Missions Africaines to Dahomey: Borghero's landing at Ouidah in April 1861, his audience with King Glele at Abomey, the conditions he set (no attendance at ceremonies involving human sacrifice) and the refusal of permission to evangelise Dahomeans. Not read directly; details reached through mission histories found in search. The edition year is from the editors' publication record and was not confirmed in the catalogue entry seen. NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "guran_agudas_2000",
    title: "Agudás: os 'brasileiros' do Benim",
    author: "Milton Guran",
    publisher: "Nova Fronteira / Editora Gama Filho, Rio de Janeiro",
    reference: "Nova Fronteira / Editora Gama Filho, Rio de Janeiro",
    sourceType: "academic_book",
    publishedYear: 2000,
    publishedDisplay: "2000",
    notes:
      "Cited for the Aguda community of returnees from Brazil and their descendants in Ouidah, Porto-Novo and Agoué, their Catholicism and festivals (the Bonfim celebration, the burian masquerade). Not opened; summarised from Guran's own Portuguese article on the Agudás found in this session.",
  },
  {
    key: "wikipedia_dahomey_navigation",
    title: "Wikipedia articles on Hwanjile, Agonglo, the Kpojito and the Casa das Minas",
    author: "Wikipedia contributors",
    url: "https://en.wikipedia.org/wiki/Hwanjile",
    sourceType: "wikipedia",
    publishedYear: 2026,
    publishedDisplay: "accessed October 2026",
    notes:
      "Read in this session and USED ONLY TO LOCATE the scholarship (Bay 1998, Akinjogbin 1967, Ferretti, Cavalcanti) and to cross-check dates — never the sole support for a claim. The Hwanjile article's citations are partly garbled (it attributes the same book to two authors), which is noted where it matters.",
  },
  {
    key: "ouidah_vodun_oral_tradition",
    title: "Oral and priestly traditions of Ouidah and Abomey, as told at shrines, palaces and sacred forests",
    reference: "Traditions about Kpassè, Dangbe, Agasu, the royal toxosu and the kings' vodun, as recorded by observers from the 1850s on and as presented at sites today",
    sourceType: "oral_tradition",
    notes:
      "WHAT THIS ENTRY IS: the traditions themselves, which are primary sources for what families, priests and royal lineages hold about their own past. Cited whenever a record states a tradition. LIMITS: the versions in print are the ones told to outsiders, often at heritage sites, and many have been reshaped by tourism, by the royal court's own historiography, and by earlier writers' summaries. A tradition is evidence of what is remembered, not a transcript of what happened.",
  },
];

// ---------------------------------------------------------------------------
// Pictures (every file page fetched in this session; licences as stated there)
// ---------------------------------------------------------------------------

const PD = "Public domain (Creative Commons Public Domain Mark 1.0)";
const KAHN = "Musée départemental Albert-Kahn, Boulogne-Billancourt";

const pLabatCoronation = commonsPicture({
  fileName: "Labat CourOuidah 1725 B002.png",
  caption:
    "'Couronnement du Roy de Juda à la coste de Guinée au Mois d'Avril 1725': an eighteenth-century engraving published in 1730 in Labat's edition of the Chevalier des Marchais's voyage, showing the coronation of a Hueda king as a French visitor drew it. A European engraving, not a photograph; the file page marks the attribution to Labat as uncertain.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD,
  creator: "J.-B. Labat (?) after the Chevalier des Marchais",
  objectDate: "1725–1730",
});

const pKroenung = commonsPicture({
  fileName: "Kroenung des Koeniges von Juida im April 1725, aus dem Des Marchais, XVIII secolo – BEIC IE8997996.jpg",
  caption:
    "'Krönung des Königes von Juida im April 1725, aus dem Des Marchais': an eighteenth-century print of the Hueda coronation, a version of the plate in Labat's 1730 book issued with a German title; held by the BEIC digital library, Milan. The same composition as Labat's engraving, not independent evidence.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD,
  creator: "Unknown engraver after Des Marchais",
  institution: "Biblioteca Europea di Informazione e Cultura (BEIC), Milan",
  objectDate: "18th century",
  duplicateOf: "Labat CourOuidah 1725 B002.png",
});

const pTempleInterior1863 = commonsPicture({
  fileName: "Le Tour du monde-07-p065.jpg",
  caption:
    "'Intérieur du temple des Serpents, à Wydah': a wood-engraved illustration by Valentin Foulquier published in Le Tour du monde in 1863, accompanying a French visitor's account of Dahomey in the 1850s. A nineteenth-century European illustration, drawn after sketches, not a photograph.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD,
  creator: "Valentin Foulquier",
  objectDate: "1863",
});

const pTempleExterior1863 = commonsPicture({
  fileName: "Le Tour du monde-07-p072.jpg",
  caption:
    "'Vue extérieure du temple des Serpents, à Wydah': an engraved illustration by Valentin Foulquier from Le Tour du monde, 1863. A nineteenth-century European illustration of the Dangbe house at Ouidah under Dahomean rule.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD,
  creator: "Valentin Foulquier",
  objectDate: "1863",
});

const pBarWydah1863 = commonsPicture({
  fileName: "Le Tour du monde-07-p068.jpg",
  caption:
    "'La Barre des côtes de Guinée devant Wydah': the surf on the beach at Ouidah, where offerings to the sea were made, in an engraved illustration after Évremond de Bérard published in Le Tour du monde in 1863. A nineteenth-century illustration; it shows the sea and the boats, not a ritual.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD,
  creator: "Évremond de Bérard",
  objectDate: "1863",
});

const pAlladaTree1863 = commonsPicture({
  fileName: "Le Tour du monde-07-p077.jpg",
  caption:
    "'Arbre couvert de chauves-souris, à Allada': a great tree full of bats at Allada, engraved after Valentin Foulquier for Le Tour du monde, 1863. A nineteenth-century European illustration of the town that had been Dahomey's ritual centre; contextual, it shows no rite.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD,
  creator: "Valentin Foulquier",
  objectDate: "1863",
});

const pFetishDance1863 = commonsPicture({
  fileName: "Le Tour du monde-07-p081.jpg",
  caption:
    "'Danse des féticheuses au Dahomey': initiated women dancing, as engraved after Valentin Foulquier for Le Tour du monde in 1863. A nineteenth-century European illustration whose details may be the artist's; it shows how the cult women of the kingdom looked to French readers.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD,
  creator: "Valentin Foulquier",
  objectDate: "1863",
});

const pGhezo1863 = commonsPicture({
  fileName: "Le Tour du monde-07-p085.jpg",
  caption:
    "'Le roi Ghézo et le prince royal Bâhadou': King Ghezo and the crown prince Badohou (the future Glele), engraved after Valentin Foulquier for Le Tour du monde in 1863. A nineteenth-century European illustration, not a portrait from life.",
  shows: "engraving",
  identificationStatus: "probable",
  licence: PD,
  creator: "Valentin Foulquier",
  objectDate: "1863",
});

const pRoyalFuneral1863 = commonsPicture({
  fileName: "Le Tour du monde-07-p104.jpg",
  caption:
    "'Funérailles du roi': a royal funeral in Dahomey as engraved after Valentin Foulquier for Le Tour du monde in 1863. A nineteenth-century European illustration made after the event and from report; it is evidence of how the rites were pictured, not a record of one funeral.",
  shows: "engraving",
  identificationStatus: "possible",
  licence: PD,
  creator: "Valentin Foulquier",
  objectDate: "1863",
});

const pGramberg1861 = commonsPicture({
  fileName: "GRAMBERG(1861) p174 SLANGENHUIS OF FETICHE TEMPLE, TE WIJDAH, KONIGRIJK DAHOMEIJ.jpg",
  caption:
    "'Slangenhuis of fetiche temple, te Wijdah, koningrijk Dahomeij': the snake house at Ouidah in an illustration from J. S. G. Gramberg's Schetsen van Afrika's Westkust (1861). A nineteenth-century Dutch book illustration, digitised by the British Library.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: PD,
  creator: "Jan Simon Gerardus Gramberg",
  institution: "British Library (HMNTS 10096.dd.12)",
  objectDate: "1861",
});

const pTemple1900 = commonsPicture({
  fileName: "Temple des serpents whydah.jpg",
  caption:
    "The 'Temple des Serpents' at Ouidah about 1900, a photograph from the archives of the Société des Missions Africaines, the Catholic mission that settled in the town in 1861.",
  shows: "site",
  identificationStatus: "secure",
  licence: PD,
  creator: "Unknown photographer (Société des Missions Africaines)",
  objectDate: "c. 1900",
});

const pJeunePretresse = commonsPicture({
  fileName: "Jeune Pretresse de Juida - Mœurs, loix et costumes des habitans de la Côte des Esclaves, ca. 1788.jpg",
  caption:
    "UNVERIFIED — 'Jeune Prêtresse de Juida' ('young priestess of Whydah'), a hand-made engraving drawn by Jacques Grasset de Saint-Sauveur and engraved by J. Laroque for a costume book of about 1788. What is unverified: that the artist ever saw a Hueda priestess; costume books of this kind were compiled in Paris from earlier texts and images. It shows a European picture of a serpent devotee, not a portrait.",
  shows: "engraving",
  identificationStatus: "unverified",
  licence: PD,
  creator: "Jacques Grasset de Saint-Sauveur (drawing); J. Laroque (engraving)",
  institution: "African Studies Centre, Leiden",
  objectDate: "c. 1788",
});

const pPlanPalaisSabi = commonsPicture({
  fileName: "Plan du palais du roy à Xavier ou Sabi dans le royaume de Whidah - tiré de Marchais - btv1b85955929.jpg",
  caption:
    "'Plan du palais du roy à Xavier ou Sabi dans le royaume de Whidah', a plan of the Hueda king's palace at Savi taken from Des Marchais and printed in 1747. An eighteenth-century European plan of the capital where the king and the serpent's priests dealt with each other.",
  shows: "map",
  identificationStatus: "secure",
  licence: "Public domain (PD-France; PD-1923)",
  creator: "Renaud Des Marchais",
  institution: "Bibliothèque nationale de France, Cartes et plans, GE DD-2987 (8232)",
  objectDate: "1747",
});

const pCarteWhidah = commonsPicture({
  fileName: "Carte du royaume de Whidah - (des Marchais) - btv1b8595588d.jpg",
  caption:
    "'Carte du royaume de Whidah', a map of the Hueda kingdom after Des Marchais, printed in 1747 — the country of Savi, the forts and the coast as a French captain charted them in the 1720s.",
  shows: "map",
  identificationStatus: "secure",
  licence: "Public domain (PD-France; PD-1923)",
  creator: "Renaud Des Marchais",
  institution: "Bibliothèque nationale de France, Cartes et plans, GE DD-2987 (8228)",
  objectDate: "1747",
});

const pWhydah1745 = commonsPicture({
  fileName: "Whydah in 1745.jpg",
  caption:
    "'Whydah in 1745', a plate from Thomas Astley's New General Collection of Voyages and Travels (London, 1745–47), vol. 3, plate 9. An eighteenth-century engraving in a compilation that itself reprinted and merged earlier travellers' accounts.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: "Public domain",
  creator: "Thomas Astley (editor)",
  objectDate: "1745",
});

const pBritishFort1727 = commonsPicture({
  fileName: "The British fort at Ouidah c. 1727.png",
  caption:
    "William Smith's engraving of William's Fort, the English fort at Ouidah, from his Thirty Different Drafts of Guinea, about 1727 — the year Dahomey took the town. An eighteenth-century engraving, contextual: it shows the European fort, not the religious events of the conquest.",
  shows: "engraving",
  identificationStatus: "secure",
  licence: "CC0 1.0 Universal Public Domain Dedication",
  creator: "William Smith",
  objectDate: "c. 1727",
});

const pRoiAllada1900 = commonsPicture({
  fileName: "Roi d'Allada-1900.jpg",
  caption:
    "'Le roi d'Allada', the king of Allada photographed for the Notice sur le Dahomey prepared for the Paris Exposition of 1900. A colonial-period photograph of the town's royal office, long after Allada's conquest by Dahomey in 1724.",
  shows: "portrait",
  identificationStatus: "secure",
  licence: PD,
  creator: "Jean Baptiste Joseph Marie Pascal Fonssagrives",
  objectDate: "1900",
});

const pToussaintAllada = commonsPicture({
  fileName: "Place Toussaint Louverture à Allada.jpg",
  caption:
    "The monument to Toussaint Louverture on the Place Toussaint-Louverture at the northern exit of Allada, photographed in 2017. A modern monument: it records the Haitian leader's family tradition of descent from Allada, not a documented genealogy.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Ozz 229",
  objectDate: "2017",
});

const pTegbessouPalace = commonsPicture({
  fileName: "Abomey-Palais du roi Tegbessou (1).jpg",
  caption:
    "The remains of King Tegbesu's palace in the Royal Palaces of Abomey, photographed in 2017. A modern photograph of the eighteenth-century royal compound in whose reign, according to tradition, Hwanjile reorganised the kingdom's vodun.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Ji-Elle",
  objectDate: "2017",
});

const pForbesGezo = commonsPicture({
  fileName: "FORBES(1851) p1.010 GEZO, KING OF DAHOMEY.jpg",
  caption:
    "'Gezo, King of Dahomey', a plate from Frederick Forbes's Dahomey and the Dahomans (1851), digitised by the British Library. A nineteenth-century European book illustration.",
  shows: "portrait",
  identificationStatus: "secure",
  licence: PD,
  creator: "Frederick Edwyn Forbes",
  institution: "British Library (HMNTS 10097.d.21)",
  objectDate: "1851",
});

const pAgongloRecade = commonsPicture({
  fileName: "King Agonglo of Dahomey's récade.jpg",
  caption:
    "The head of King Agonglo's récade (makpo), the carved staff carried by royal messengers, with a pineapple or palm-fruit emblem; a photograph published in 1911. The object is a royal emblem, not a religious one.",
  shows: "artefact",
  identificationStatus: "probable",
  licence: PD,
  creator: "Unknown photographer",
  objectDate: "1911 (photograph)",
});

const pFeticheurs1912 = commonsPicture({
  fileName: "Féticheurs-Abomey-1912.jpg",
  caption:
    "'Féticheurs et féticheuses à Abomey': priests and initiated women at Abomey, photographed by Edmond Fortier and published in 1912, after the fall of the kingdom. A colonial-period photograph.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: PD,
  creator: "François-Edmond Fortier",
  objectDate: "1912",
});

const pKahnStones = commonsPicture({
  fileName: "Pierres fétiches exposées dans l'adandjèho (\" case de courage \") du palais de Glélé - A63630.jpg",
  caption:
    "Sacred stones displayed in the adandjèho ('house of courage') of King Glele's palace at Abomey, an autochrome taken by Frédéric Gadmer on 6 March 1930. The museum catalogue identifies a laterite stone with Agasu, a granite one with thunder and war, and a sandstone one with the ancestors of Allada; those identifications are the 1930 mission's, recorded by the museum.",
  shows: "evidence_photograph",
  identificationStatus: "probable",
  licence: "CC BY-SA 4.0",
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A63630",
  objectDate: "1930",
});

const pKahnGuede = commonsPicture({
  fileName: "Deux féticheuses de Guédé - A63557S.jpg",
  caption:
    "UNVERIFIED — two women catalogued as 'féticheuses de Gédé (Agassou)' at Zado, Dahomey, in an autochrome by Frédéric Gadmer of 28 February 1930. What is unverified: the 1930 caption's equation of the vodun 'Gédé' with Agasu, which this record cannot confirm. What it shows: two initiated women in ritual dress photographed by a French mission.",
  shows: "evidence_photograph",
  identificationStatus: "unverified",
  licence: "CC BY-SA 4.0",
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A63557S",
  objectDate: "1930",
});

const pKahnPanther = commonsPicture({
  fileName: "Décor peint de panthère et lions sur la djononho ou case des étrangers dans la première cour du palais de null Glélé - A63502S.jpg",
  caption:
    "Painted relief of a panther (leopard) and lions on the djononho, the house for strangers in the first court of Glele's palace at Abomey, in an autochrome by Frédéric Gadmer of 20 February 1930. The leopard is the dynasty's ancestral animal; the lions are Glele's own emblem.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A63502S",
  objectDate: "1930",
});

const pKahnGleleTomb = commonsPicture({
  fileName: "Le lit funéraire et ses ornements à l'intérieur de la tombe de null Glélé, palais d'Abomey - A63613.jpg",
  caption:
    "The funerary bed and its ornaments inside King Glele's tomb in the palace at Abomey, an autochrome by Frédéric Gadmer of 5 March 1930 — the kind of royal grave-house where the dead kings were served. (The catalogue's 'null' in the title is a metadata error.)",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A63613",
  objectDate: "1930",
});

const pKahnTombWomen = commonsPicture({
  fileName: "Femmes agenouillées devant le tombeau de null Glélé - A63535S.jpg",
  caption:
    "Women kneeling before the tomb of Glele at Abomey, an autochrome by Frédéric Gadmer of 20 February 1930 — service of the royal dead continuing thirty-six years after the kingdom's fall.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A63535S",
  objectDate: "1930",
});

const pKahnLegbaDan = commonsPicture({
  fileName: "Autels des fétiches Lègba et Dan - A64077S.jpg",
  caption:
    "Altars of Legba and Dan at Ouidah ('Fétiches Dan et Legbaa'), an autochrome by Frédéric Gadmer of 2 May 1930. Shrines of the serpent power in the former Hueda capital two centuries after the conquest.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A64077S",
  objectDate: "1930",
});

const pKahnIroko = commonsPicture({
  fileName: "Dans le village indigène, un chronoxyle d'Iroko (ou milicia exclesa) sacré ou arbre fétiche - A64084.jpg",
  caption:
    "A sacred iroko tree, struck dry by lightning, in Ouidah, in an autochrome by Frédéric Gadmer of 2 May 1930. Trees were the second of the three orders of Hueda gods in the European accounts; this photograph is two centuries later and shows a tree, not the trees those writers saw.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A64084",
  objectDate: "1930",
});

const pKahnCathedral = commonsPicture({
  fileName: "La cathédrale, actuelle basilique de l'Immaculée-Conception, au soleil couchant - A64104S.jpg",
  caption:
    "The Catholic cathedral of Ouidah (today the Basilica of the Immaculate Conception) at sunset, in an autochrome by Frédéric Gadmer of 2 May 1930 — the church that grew from the mission begun in 1861.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A64104S",
  objectDate: "1930",
});

const pKahnKiti = commonsPicture({
  fileName: "L'abbé Gabriel Kiti, premier prêtre dahoméen ordonné par Mgr Steinmetz (le 15 septembre 1929) entouré de deux enfants de chœur - A63650S.jpg",
  caption:
    "Abbé Gabriel Kiti, described in the catalogue as the first Dahomean priest ordained by Bishop Steinmetz (15 September 1929), with two altar boys at Abomey, in an autochrome by Frédéric Gadmer of 1930.",
  shows: "portrait",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Frédéric Gadmer",
  institution: KAHN,
  accessionNumber: "A63650S",
  objectDate: "1930",
});

const pDaagbo = commonsPicture({
  fileName: "Le Pontife Daagbo Hounon au temple des pythons avant les cérémonies officielles.jpg",
  caption:
    "The Daagbo Hounon, supreme vodun priest of Ouidah, at the Temple of Pythons before the official ceremonies of 9 January 2025. A modern photograph of the present holder of the office whose name continues the Hu-no, the sea-priest European writers described.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Fermi12",
  objectDate: "2025",
});

const pDeSouza = commonsPicture({
  fileName: "Francisco Félix de Souza.jpg",
  caption:
    "UNVERIFIED — an oil portrait identified as Francisco Félix de Souza, the Chacha of Ouidah (d. 1849), photographed for Alberto da Costa e Silva's book. What is unverified: the sitter's identity and the painting's date, which the file page gives only as 'before 1849'. It shows a nineteenth-century painted portrait of a man in European dress.",
  shows: "portrait",
  identificationStatus: "unverified",
  licence: "Public domain (Brazilian law 9.610; PD-Art)",
  creator: "Unknown painter",
  objectDate: "before 1849",
});

const pDeSouzaHouse = commonsPicture({
  fileName: "Maison de la famille de Souza, à Ouidah.jpg",
  caption: "The house of Francisco Félix de Souza and his descendants at Ouidah, photographed in 2019.",
  shows: "site",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Konstantinos",
  objectDate: "2019",
});

const pMissionnaire1930 = commonsPicture({
  fileName: "Missionnaire Dahomey.jpg",
  caption:
    "A missionary of the Société des Missions Africaines in Dahomey, about 1930, from the society's archives. A colonial-period photograph, seventy years after the mission's founder Borghero reached Ouidah.",
  shows: "portrait",
  identificationStatus: "secure",
  licence: PD,
  creator: "Unknown photographer (Société des Missions Africaines de Lyon)",
  objectDate: "c. 1930",
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
    title: "Vodun and royal power in Allada, Hueda and Dahomey",
    summary:
      "In the three kingdoms of the Slave Coast, kings needed vodun and vodun needed kings: royal ancestors, a dynastic leopard, a national serpent and the priests who served them were instruments of government, and governments in turn made, moved and policed the gods.",
    description:
      "THE QUESTION THIS TRACK ASKS. Not 'what did the people of this coast believe' — the benin-vodun dataset answers that as far as it can — but how RELIGION AND KINGSHIP HELD EACH OTHER UP in the three states that dominated the coast between the sixteenth and nineteenth centuries: Allada, the senior kingdom; Hueda, with its capital at Savi and its port at Ouidah; and Dahomey, which conquered both in 1724 and 1727.\n\n" +
      "THREE PATTERNS, ONE COAST. In ALLADA the European record of the 1690s already shows a royal cult attached to the king's person (Phillips's 'king of great Ardas's Fetish or god'), and after the conquest Allada kept a ritual role for the Dahomean kings, whose dynasty claimed descent from it. In HUEDA the serpent Dangbe was the kingdom's principal power, its high priest could, in one visitor's words, 'humble the King himself', and the king's own coronation was followed by processions to the serpent's house. In DAHOMEY the court built a religion of the dynasty — the leopard ancestor Agasu, the royal dead served at the Nesuhwe, the royal toxosu — and at the same time absorbed, regulated and sometimes redirected the vodun of the peoples it conquered.\n\n" +
      "WHAT THE EVIDENCE IS. Two kinds, never to be merged. EUROPEAN EYEWITNESSES from 1694 to 1874 — slavers, factors, a naval surgeon, a missionary editor, consuls — each with a purpose and a prejudice, several copying each other. And the TRADITIONS of the royal court and of priestly families, recorded from the nineteenth century on, which are the court's own history of itself. Where the two agree something is probably secure; where they diverge the divergence is itself information.\n\n" +
      "WHAT THIS TRACK ADDS TO THE BÉNIN DATASETS. It does not retell Tado, the three brothers, the Customs or the Temple of Pythons' founding story; it links to them. It reads the eyewitnesses one by one, separates the documented from the remembered, and follows the seam where a king's authority and a god's met: who appointed priests, who could punish a python-killer, who brought Mawu and Lisa to Abomey, why a conquering army ate the snakes of the conquered and why its kings then protected them.\n\n" +
      "SIGNIFICANCE. This is where Vodun stops being described as timeless belief and acquires a political history. The structures built here — royal vodun families, the cult of the royal dead, the regulation of priesthoods, the serpent of Ouidah under a Dahomean king — are the ones the Atlantic trade carried, through captives from these same wars, to Saint-Domingue, Bahia and São Luís, where houses like the Casa das Minas still name Dahomean royal vodun. Understanding the kingdoms is a precondition for understanding what crossed and what did not.\n\n" +
      "THINGS TO ASK: When a state takes charge of a religion, what does the religion gain, and what does it lose?",
    category: "religion",
    subcategory: "Religion and royal power",
    eventType: "historical",
    tags: vodunTags(TRACK, ["place: allada", "place: ouidah", "place: abomey", "deity: dan and aido-hwedo", "practice: ancestors", "practice: initiation and priesthood"], "kingship", "religion and the state", "overview"),
    people: ["Agaja", "Tegbesu", "Hwanjile", "Ghezo", "Glele"],
    civilisations: ["Allada", "Hueda", "Dahomey", "Fon", "Aja"],
    locationName: "Allada, Ouidah and Abomey, southern Bénin",
    lat: 6.8,
    lng: 2.1,
    claims: [
      {
        sourceKey: "pares_rei_pai_morte_2016",
        citations: [
          { sourceKey: "law_slave_coast_1991", relation: "supports", note: "Documents the kingdoms' religious institutions from the European record of the 1550–1750 period." },
          { sourceKey: "burton_mission_gelele_1864", relation: "context", note: "The fullest European catalogue of Dahomean vodun before the kingdom fell." },
        ],
        startYear: 1658,
        endYear: 1894,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "The period in which the interlocking of vodun and royal power in these kingdoms is documented in writing",
        originalDateText: "From the Allada catechism of 1658 to the end of the Dahomean monarchy in 1894",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The range runs from the earliest written vodu (1658) to the French deposition of the last independent king. IT DATES THE DOCUMENTATION, NOT THE INSTITUTIONS: royal cults in Allada and Hueda are already established when Europeans first describe them, and how much older they are is not known.",
      },
      {
        sourceKey: "ouidah_vodun_oral_tradition",
        citations: [
          { sourceKey: "blier_path_leopard_1995", relation: "context", note: "Reads the dynasty's leopard-origin tradition as myth shaped by later royal needs." },
        ],
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "When royal cults began among the Aja-Fon dynasties",
        originalDateText: "Before any European description; the court traditions place it at the dynasty's beginnings, undated",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. The royal traditions trace the dynasty's cults back to Agasu and Tado, before any date. That establishes what the court remembered and taught, NOT when the cults began, which nothing establishes.",
      },
    ],
    media: [pLabatCoronation, pForbesGezo, pTegbessouPalace],
  },

  // =========================================================================
  // ALLADA AND THE DYNASTY'S RELIGION
  // =========================================================================
  {
    slug: "agasu-the-leopard-ancestor-and-his-priest",
    title: "Agasu: the leopard ancestor and his priest at Abomey",
    summary:
      "The kings of Allada and Dahomey traced their line to Agasu, born of a princess and a leopard, and Agasu's cult and its priest, the Agasunon, were at the head of the capital's religion. European visitors of the 1860s–70s describe the king prostrating at the priest's door.",
    description:
      "THE TRADITION. The ruling lineage of Allada and, through it, of Dahomey — the Aladaxonu — remembered its founder as AGASU, son of a princess of Tado and a leopard. The leopard was therefore not a symbol the dynasty chose but an ancestor it claimed, and the cult of Agasu was a cult of the royal family's own origin. The benin-deep-past dataset treats Tado and the migration traditions; this record treats the cult.\n\n" +
      "WHAT THE EYEWITNESSES RECORD. Burton (1864) lists Agasun among the vodun of Abomey, says the King dismounts at the Agasun-no's door and prostrates to him, and calls that priest the capital's equivalent of the Hu-no of Whydah. Skertchly (1874) calls the priest of Agasun 'the palladium of Dahomey', 'the head of all the metropolitan clergy', with the Agasunno 'the cardinals of the Dahoman religion' — and pointedly corrects Burton: the chief priest does not rank next to the king, because the king is far above everyone. In 1930 a French photographic mission catalogued a laterite stone in Glele's palace as Agasu's.\n\n" +
      "WHERE THE SOURCES DISAGREE. Burton also writes that Agasun was 'the old Makhi fetish that ruled Agbome before Dako conquered it', which makes Agasu a conquered people's god adopted by the dynasty — the opposite of the court tradition that makes him the dynasty's own ancestor. Burton's informants, his interpreters and his own guesswork cannot be separated here, and the contradiction is kept rather than resolved. Blier (1995) argues that the leopard-birth story is a mythologised account of the dynasty's beginnings, shaped by later politics.\n\n" +
      "SIGNIFICANCE. Agasu shows a royal house making its genealogy sacred: to serve the dynasty's ancestor was to serve the state. It also explains why the leopard runs through Dahomean art, regalia and the wives of the king ('wives of the leopard'), and why Europeans called the leopard 'the fetish of Dahomey'.\n\n" +
      "THINGS TO ASK: When a royal family's ancestor is also a god, can anyone else claim him?",
    category: "religion",
    subcategory: "Royal cults",
    eventType: "traditional_account",
    tags: vodunTags(TRACK, ["practice: ancestors", "practice: initiation and priesthood", "place: abomey", "place: allada", "place: tado"], "agasu", "leopard", "dynasty"),
    people: ["Agasu", "Agasunon (priest of Agasu)", "Dakodonu", "Richard F. Burton", "J. A. Skertchly"],
    civilisations: ["Dahomey", "Allada", "Aladaxonu dynasty", "Fon"],
    locationName: "Abomey, Bénin",
    lat: 7.185,
    lng: 1.991,
    claims: [
      {
        sourceKey: "ouidah_vodun_oral_tradition",
        citations: [
          { sourceKey: "blier_path_leopard_1995", relation: "context", note: "Treats the leopard birth as a mythologised account of the dynasty's origins." },
          { sourceKey: "herskovits_dahomey_1938", relation: "supports", note: "Records the Agasu cult among the royal cults in the 1930s." },
        ],
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "The birth of Agasu and the beginning of his cult",
        originalDateText: "At the beginning of the dynasty, in Tado; undated in the tradition",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. The court tradition places Agasu before the move from Tado to Allada. It establishes the dynasty's self-understanding; it does not establish a date or that the cult existed in its later form at the start.",
      },
      {
        sourceKey: "burton_mission_gelele_1864",
        citations: [
          { sourceKey: "skertchly_dahomey_1874", relation: "supports", note: "Ten years later calls the priest of Agasun the head of the capital's clergy, while disputing his rank relative to the king." },
        ],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "A European eyewitness records the Agasunon's precedence and the king's prostration at his door",
        originalDateText: "the King dismounts at the Agasu-no's door, and prostrates to him",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Burton's 1864 statement, read in this session (vol. 2, p. 150). It establishes the practice in the 1860s as Burton was told of it or saw it; the gesture's age is not established.",
      },
      {
        sourceKey: "burton_mission_gelele_1864",
        citations: [
          { sourceKey: "blier_path_leopard_1995", relation: "disputes", note: "The court tradition, which Blier analyses, makes Agasu the dynasty's own ancestor rather than a conquered people's god." },
        ],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Burton's alternative account: Agasun as the god of the people Dahomey displaced",
        originalDateText: "Agasun, the old Makhi fetish that ruled Agbome before Dako conquered it",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: contemporary written. Burton's own words (vol. 2, pp. 146–147). A single European statement that contradicts the court tradition; it may reflect an informant's view, a confusion with another vodun, or Burton's speculation.",
      },
    ],
    media: [pKahnStones, pKahnPanther, pKahnGuede],
  },
  {
    slug: "leopard-of-dahomey-snake-of-whydah",
    title: "'The tiger is the fetish of Dahomy; the snake, that of Whydah'",
    summary:
      "Dalzel in 1793 and Forbes in 1851 summed up two kingdoms as two animals — the leopard for Dahomey, the serpent for conquered Whydah. The formula is a European shorthand, but it captures a real distinction between a dynasty's god and a conquered people's.",
    description:
      "THE FORMULA. Archibald Dalzel's History of Dahomy (1793): 'The tiger is the fetish of Dahomy; the snake, that of Whydah.' ('Tiger' is the coast's English for leopard.) Frederick Forbes, nearly sixty years later (1851): 'The Fetish of Abomey is the leopard, that of Whydah the snake.' Dalzel also reports that when the king displayed captured clothing at the Customs he held back the leopard-skin garments, because exposing the skins of the country's 'fetish, or deity' would be sacrilege.\n\n" +
      "WHAT IT GETS RIGHT. Two different kinds of sacred animal. The leopard was the dynasty's — the ancestor Agasu, the king's emblem, the royal wives as 'wives of the leopard'. The python was Hueda's, the national power of a kingdom Dahomey had conquered and kept in being as a cult. The pairing shows Europeans noticing that Dahomey's religion was layered: the conquerors' god over the conquered's.\n\n" +
      "WHAT IT GETS WRONG. Everything else. Neither kingdom had a single 'fetish'. Forbes in the same paragraph speaks of 'the invincible god Seh' and 'the Fetish Voh-dong', and says the religion is 'a mystery only known to the initiated'. A one-animal-per-kingdom formula turns plural, local, family and priestly cults into a heraldic device, which is how European readers liked their Africa summarised.\n\n" +
      "WHO WROTE IT. Dalzel was a former slave-trader and governor of the English fort at Whydah writing against abolition; Forbes was a naval officer sent to persuade Ghezo to end the trade. Neither is neutral, and they agree here partly because the second had read the first.\n\n" +
      "SIGNIFICANCE. The formula is the earliest European recognition that conquest had produced a two-tier religious landscape, and it fixed an image — leopard Abomey, python Ouidah — that guidebooks still repeat. It is useful as a first approximation and misleading as a description.\n\n" +
      "THINGS TO ASK: Why do outsiders so often describe a religion by its animal?",
    category: "religion",
    subcategory: "European descriptions",
    eventType: "historical",
    tags: vodunTags(TRACK, ["deity: dan and aido-hwedo", "practice: serpent veneration", "place: abomey", "place: ouidah"], "leopard", "european-accounts", "dalzel", "forbes"),
    people: ["Archibald Dalzel", "Frederick E. Forbes", "Ghezo"],
    civilisations: ["Dahomey", "Hueda"],
    locationName: "Abomey and Ouidah, Bénin",
    lat: 6.8,
    lng: 2.04,
    claims: [
      {
        sourceKey: "dalzel_history_dahomy_1793",
        startYear: 1793,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Dalzel's formula pairing the leopard with Dahomey and the snake with Whydah",
        originalDateText: "The tiger is the fetish of Dahomy; the snake, that of Whydah",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. A sentence in Dalzel's introduction, read in this session. It dates a European description, compiled from traders' memoirs of the preceding decades.",
      },
      {
        sourceKey: "forbes_dahomey_1851",
        citations: [
          { sourceKey: "blier_path_leopard_1995", relation: "context", note: "Explains why the leopard belonged to the dynasty: the Agasu descent tradition." },
        ],
        startYear: 1851,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Forbes repeats the pairing after his visits of 1849–50",
        originalDateText: "The Fetish of Abomey is the leopard, that of Whydah the snake",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Forbes, vol. 1, p. 82, read in this session. A second European statement, possibly dependent on the first.",
      },
    ],
    media: [pKahnPanther, pTempleExterior1863],
  },
  {
    slug: "allada-religion-in-phillips-1694",
    title: "1694: Thomas Phillips and the 'Fetish' of the king of great Ardra",
    summary:
      "The slave-ship captain Thomas Phillips, at Whydah in 1694, recorded a pond of crocodiles honoured as 'the king of great Ardas's Fetish or god, as the snake is the god of the Whidawers' — an early glimpse of a royal cult attached to the senior kingdom of Allada.",
    description:
      "THE PASSAGE. Phillips commanded the Hannibal of London, which loaded slaves at Whydah in 1694. Near his lodging was a pond of 'alligators' (crocodiles): 'The blacks have a great respect for this hideous monster, it being their neighbour the king of great Ardas's Fetish or god, as the snake is the god of the Whidawers.' He wanted to shoot them and the Africans would not let him. In the same pages he describes snakes entering his room and being carried gently out by the boys who slept by his bed, and he heard that 'the killing one has cost the lives of some white men'.\n\n" +
      "WHAT IT SHOWS ABOUT ALLADA. That by the 1690s people at Whydah distinguished their own principal power from that of the neighbouring and senior kingdom of Allada ('great Ardra'), and associated the latter with ITS KING. The phrase 'the king of great Ardas's Fetish' is a European rendering, but the association of a power with a royal person is exactly what later royal cults in Dahomey institutionalised. Burton (1864), listing the sacred animals of the coast, also mentions 'the crocodile at Savi'.\n\n" +
      "WHAT IT CANNOT SHOW. What the crocodiles were called, who served them, or whether the cult was the king of Allada's in any formal sense. Phillips did not go to Allada and did not speak the language. Allada's religion before 1724 is otherwise known mainly through the 1658 catechism and the Capuchin mission.\n\n" +
      "SIGNIFICANCE. Phillips is one of the earliest datable eyewitnesses to the region's religious geography and the earliest English one used here. His crocodile pond, beside Bosman's serpent, shows that Hueda was not a one-god country and that neighbouring kingdoms were identified with different powers — the pattern Dalzel later reduced to 'the tiger of Dahomy, the snake of Whydah'.\n\n" +
      "THINGS TO ASK: How much can a visitor who could not speak the language tell you about whose god something was?",
    category: "religion",
    subcategory: "European descriptions",
    eventType: "historical",
    tags: vodunTags(TRACK, ["place: allada", "place: ouidah", "practice: serpent veneration"], "phillips", "crocodile", "european-accounts"),
    people: ["Thomas Phillips"],
    civilisations: ["Allada", "Hueda"],
    locationName: "Whydah (Ouidah), Bénin",
    lat: 6.363,
    lng: 2.085,
    claims: [
      {
        sourceKey: "phillips_hannibal_1694",
        citations: [
          { sourceKey: "law_slave_coast_1991", relation: "context", note: "Uses Phillips among the late-seventeenth-century sources for Hueda and Allada." },
          { sourceKey: "burton_mission_gelele_1864", relation: "supports", note: "Still lists a crocodile cult at Savi in the 1860s." },
        ],
        startYear: 1694,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Phillips's observation of the crocodile pond at Whydah and its attribution to the king of Allada",
        originalDateText: "it being their neighbour the king of great Ardas's Fetish or god",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. A ship's journal of the 1694 voyage, first printed in 1732 and read in this session. It dates an observation and a piece of hearsay; it does not date the cult's origin.",
      },
    ],
    media: [pWhydah1745, pAlladaTree1863],
  },
  {
    slug: "allada-as-dahomeys-ritual-centre",
    title: "Allada after 1724: the conquered kingdom as Dahomey's ritual centre",
    summary:
      "Dahomey conquered Allada in 1724 but did not erase it: its kings claimed descent from Allada's royal house, and in the 1780s the king's chief minister, the Migan, was sent there with priests to 'make fetish'. Allada remained a place where the dynasty's religion had to be served.",
    description:
      "THE PARADOX. Agaja's army took Allada in 1724 (benin-dahomey: agaja). Yet the dynasty that conquered it remembered Allada as its own place of origin — the three-brothers tradition (benin-deep-past) makes Abomey's founder a prince of Allada — and its ancestor Agasu came by way of Allada from Tado. A conquering house could not simply destroy the seat of its own ancestors.\n\n" +
      "WHAT THE DOCUMENTS SHOW. Dalzel (1793, p. 197), describing events of the later 1780s under King Kpengla, writes that in the midst of war 'he did not forget to solemnize the rites of superstition. His prime minister, the Tamegan, was sent to Alladah, one of his palaces, ... with a Gong-gong beater, many drums, a number of priests and attendants, to make fetish.' The TAMEGAN is the MIGAN, the kingdom's senior minister and executioner — that the highest secular officer led the ritual party shows how state and cult offices overlapped. In 1930 a French mission photographed in Glele's palace at Abomey a sandstone catalogued as belonging to 'the ancestors of Allada'.\n\n" +
      "WHAT IS TRADITION RATHER THAN DOCUMENT. That Dahomean kings went to Allada, or sent there, as part of their accession; that the shrine of Agasu at Allada was senior. These are widely stated in later accounts and are consistent with Dalzel, but this record has not located the primary evidence. NEEDS SOURCE VERIFICATION.\n\n" +
      "SIGNIFICANCE. Allada is the clearest case of a conquered kingdom becoming a RELIGIOUS ASSET of its conqueror: politically subordinate, ritually indispensable. It is also the name that travelled furthest: 'Arada' and 'Rada' in Saint-Domingue and Haiti, and the tradition that Toussaint Louverture's father was an Allada prince, keep Allada's name in the Americas.\n\n" +
      "THINGS TO ASK: Why would a dynasty keep honouring the kingdom it destroyed?",
    category: "religion",
    subcategory: "Royal cults",
    eventType: "historical",
    tags: vodunTags(TRACK, ["place: allada", "practice: ancestors", "practice: initiation and priesthood"], "migan", "kpengla", "dynasty"),
    people: ["Kpengla", "the Migan (Tamegan)", "Agaja", "Archibald Dalzel"],
    civilisations: ["Allada", "Dahomey"],
    locationName: "Allada, Bénin",
    lat: 6.665,
    lng: 2.151,
    claims: [
      {
        sourceKey: "dalzel_history_dahomy_1793",
        citations: [
          { sourceKey: "akinjogbin_dahomey_neighbours_1967", relation: "context", note: "The political history of Kpengla's reign and Dahomey's relations with Oyo in the 1780s." },
        ],
        startYear: 1787,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "The Migan sent with priests to Allada 'to make fetish' during Kpengla's wars",
        originalDateText: "His prime minister, the Tamegan, was sent to Alladah ... to make fetish",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Dalzel, p. 197, read in this session, in a chapter narrating the years around 1786–88; the year is approximate. It documents one ritual mission; it does not document a regular accession rite.",
      },
      {
        sourceKey: "ouidah_vodun_oral_tradition",
        citations: [
          { sourceKey: "law_slave_coast_1991", relation: "context", note: "Discusses the Aladaxonu dynasty's claimed descent from Allada." },
        ],
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "Allada's ritual seniority for the Dahomean dynasty",
        originalDateText: "Since the dynasty left Allada, in the tradition; no date",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. The dynasty's tradition of origin in Allada. It explains why Allada mattered; it does not date when the ritual relationship began. NEEDS SOURCE VERIFICATION for accession rites at Allada.",
      },
    ],
    media: [pRoiAllada1900, pKahnStones, pToussaintAllada],
  },
  {
    slug: "capuchin-mission-to-allada-1660",
    title: "The Capuchins at Allada, 1660–1661: a mission that became a misunderstanding",
    summary:
      "After an embassy from the king of Allada reached the Spanish world in 1657–58, Spanish Capuchins arrived at Allada in 1660 with a catechism in the local language. The mission collapsed within about a year: the king wanted trade and alliance, the friars wanted his conversion.",
    description:
      "THE SEQUENCE. In 1657 an envoy of the king of Arda (Allada) reached Cartagena de Indias and then Spain, asking — as the Spanish understood it — for missionaries. The Capuchins prepared, and the catechism printed in 1658 in the language of Allada (benin-vodun: vodu-first-written-1658) was produced for the mission. Friars arrived at Allada at the start of 1660. By 1661 the mission had failed and the missionaries had left.\n\n" +
      "WHY IT FAILED, ACCORDING TO THE SCHOLARSHIP. Tardieu's study is titled 'from quid pro quo to failure': each side had misread the other. Law (1991) reads the episode as diplomacy and trade at least as much as religion — Allada sought a Spanish commercial and political connection; the king was not prepared to abandon the religious practice on which his kingship rested, and Dutch traders at the court were hostile. The precise course of events, the names of the friars and the king's own words could not be checked here. NEEDS SOURCE VERIFICATION.\n\n" +
      "WHAT IT SHOWS ABOUT ROYAL RELIGION. A king of Allada could entertain Christian missionaries, as later kings of Hueda tolerated chaplains at the forts and Agonglo of Dahomey would in 1796–97, without that touching the vodun that sustained his office. Christianity was available as a diplomatic resource and, for a king, almost never as a replacement.\n\n" +
      "SIGNIFICANCE. The mission is why the word vodu was written down in 1658, and it is the first documented encounter between the Catholic Church and the royal religion of this coast — the beginning of a relationship that runs through the Portuguese chaplains of Ouidah, the 1861 mission, the cathedral facing the python temple, and the Catholic-Vodou entanglements of Haiti.\n\n" +
      "THINGS TO ASK: When two parties each think the other has agreed to something, who wrote down what happened?",
    category: "religion",
    subcategory: "Catholic contact",
    eventType: "historical",
    tags: vodunTags(TRACK, ["place: allada", "practice: catholic contact"], "capuchins", "missions", "spain"),
    people: ["The king of Allada (Tojonu, as usually named)", "Spanish Capuchin missionaries"],
    civilisations: ["Allada", "Spanish monarchy", "Capuchin order"],
    locationName: "Allada, Bénin",
    lat: 6.665,
    lng: 2.151,
    claims: [
      {
        sourceKey: "tardieu_arda_capuchins_1995",
        citations: [
          { sourceKey: "law_religion_trade_politics_1991", relation: "supports", note: "Treats the same mission within seventeenth-century Catholic contacts with Allada and Whydah." },
        ],
        startYear: 1658,
        endYear: 1661,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "The Spanish Capuchin mission to Allada, from preparation to failure",
        originalDateText: "la misión de los capuchinos (1658–1661)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. The range is given in the title of Tardieu's study of the Spanish archival record. The dates rest on mission documents; the details of the failure NEED SOURCE VERIFICATION.",
      },
      {
        sourceKey: "law_religion_trade_politics_1991",
        citations: [
          { sourceKey: "tardieu_arda_capuchins_1995", relation: "context", note: "Places the embassy at Cartagena in 1657." },
        ],
        startYear: 1660,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "The friars' arrival at Allada",
        originalDateText: "Capuchins arrive at Allada, early 1660",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Law's reconstruction from the mission sources; the month could not be checked here and the year is marked approximate.",
      },
    ],
    media: [pAlladaTree1863, pRoiAllada1900],
  },

  // =========================================================================
  // HUEDA: SERPENT, PRIESTS AND KING
  // =========================================================================
  {
    slug: "hueda-snake-trees-and-sea",
    title: "Snake, trees and sea: the three orders of Hueda gods in European eyes",
    summary:
      "Bosman, Barbot and Atkins all describe Hueda religion as a remote creator above three principal powers — the serpent, great trees and the sea — with the serpent supreme. The scheme is European, but it records real cults that survive at Ouidah today.",
    description:
      "THE SCHEME. Barbot (printed 1732): the people of Fida have an 'imperfect notion of a supreme Being' to whom, because he is so exalted, 'they neither pray, or offer any sacrifices', leaving the world to inferior deities, 'amongst which they reckon as the principal, first, a sort of reddish brown snake; next to it, the high lofty trees ...; and next to them again, the sea'. The snake-god 'has an unlimited power over the trees and sea'. Bosman's Letter XIX gives the same order: 'The Trees are the second-rate Gods of the Natives of Fida. The Sea their third God.' Atkins (1735): 'Besides the Snake, they have two other principal Deities ... their Groves, and the high Sea.'\n\n" +
      "WHAT IS REAL IN IT. Each element corresponds to a cult that is independently attested: DANGBE, the python; tree cults (Burton in 1864 names the silk-cotton and the loko or iroko); and HU, the sea, with its priest the Hu-no and offerings thrown into the surf (Labat, 1730). And the idea of a creator too remote for daily worship recurs in later accounts of Mawu.\n\n" +
      "WHAT IS IMPOSED. The ranking. 'First, second, third' is a European way of ordering gods, and the agreement of the three writers is weakened by their dependence on each other — Barbot follows Bosman closely, and Burton in 1864 explicitly paraphrases Bosman ('In the days of Bosman ... the little kingdom of Whydah adored three orders of gods'). One description repeated is not three observations.\n\n" +
      "SIGNIFICANCE. This is the first STRUCTURED description of a Vodun religious system in any European language, and it is about Hueda, not Dahomey. It shows serpent, tree and sea cults as the public religion of a coastal kingdom before 1727, and it is the template through which every later European account of Ouidah was written.\n\n" +
      "THINGS TO ASK: When three writers agree, how do you tell three witnesses from one witness copied twice?",
    category: "religion",
    subcategory: "Hueda religion",
    eventType: "historical",
    tags: vodunTags(TRACK, ["deity: dan and aido-hwedo", "practice: serpent veneration", "practice: sacred trees and forests", "place: ouidah"], "hueda", "sea", "european-accounts"),
    people: ["Willem Bosman", "John Barbot", "John Atkins"],
    civilisations: ["Hueda"],
    locationName: "Savi and Ouidah, Bénin",
    lat: 6.4,
    lng: 2.08,
    claims: [
      {
        sourceKey: "bosman_guinea_1705",
        citations: [
          { sourceKey: "barbot_description_1732", relation: "supports", note: "Gives the same three-tier order, partly copied from Bosman." },
          { sourceKey: "atkins_voyage_1735", relation: "supports", note: "Independently names the snake, the groves and the sea as the three principal deities in 1721." },
        ],
        startYear: 1705,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest printed description of Hueda gods in three orders",
        originalDateText: "The Trees are the second-rate Gods of the Natives of Fida. The Sea their third God.",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Bosman's Letter XIX (English 1705; Dutch 1704), from his years on the coast in the 1690s, read in this session. Dates a description, not the cults.",
      },
    ],
    media: [pKahnIroko, pBarWydah1863, pKahnLegbaDan],
  },
  {
    slug: "hueda-serpent-priesthood-and-the-king",
    title: "'Held in equal reverence with the King': the serpent's high priest in Hueda",
    summary:
      "In 1721 the naval surgeon John Atkins was told that Hueda's grand fetisher was revered as much as the king, 'sometimes more', and could 'humble the King himself'. Bosman and Labat also describe a powerful priesthood. In Hueda the serpent's priests were a power the crown had to manage.",
    description:
      "THE STATEMENT. Atkins, at Whydah in 1721: the snake 'is the principal Deity or Fetish of the Country, and brought into more Regularity than others, by the superiour Cunning of their Fetishers, who have one presiding over them, called the grand Fetisher, or High-Priest, who is held in equal Reverence with the King himself; nay, sometimes more ... He hath the craft by this means, to humble the King himself on all occasions for their Service, and to drain both him and the People.'\n\n" +
      "THE OTHER WITNESSES. Bosman (1705) heads part of Letter XIX 'Priests and Priestesses in great esteem ... Their great Authority', and describes priests able to rouse 'the Rabble' against anyone who harmed a snake. He also shows the KING ACTING FOR THE PRIESTS: in 1697 the priests complained to the king that a hog had eaten a snake, and the king ordered every hog in the kingdom killed. Labat's account of 1725 gives the serpent 'un grand Sacrificateur & un ordre entier' of priests, and has the grand sacrificateur lift the serpent before the army.\n\n" +
      "HOW TO READ IT. Atkins was hostile to priests on principle and his account of 'cunning' is a Protestant cliché. But the STRUCTURE he describes — a high priest whose standing rivalled the king's and whose cult the king financed — matches the others and fits what followed: Dahomey, after 1727, made sure no priest at Ouidah stood near the king, and Skertchly in 1874 insisted that in Dahomey 'church and state' had no shared precedence.\n\n" +
      "SIGNIFICANCE. Hueda shows the possibility Dahomey's kings set out to prevent: a national cult with its own hierarchy, revenues and capacity to pressure the throne. The contrast between the two kingdoms is one of the clearest documented differences between Vodun under a weak monarchy and Vodun under a strong one.\n\n" +
      "THINGS TO ASK: Is a priest who can 'humble the King' a sign of a weak king or of a strong religion?",
    category: "religion",
    subcategory: "Hueda religion",
    eventType: "historical",
    tags: vodunTags(TRACK, ["practice: initiation and priesthood", "practice: serpent veneration", "deity: dan and aido-hwedo", "place: ouidah"], "hueda", "high-priest", "kingship"),
    people: ["John Atkins", "Willem Bosman", "Huffon (king of Hueda)", "the grand sacrificateur of Dangbe"],
    civilisations: ["Hueda"],
    locationName: "Savi, Bénin",
    lat: 6.43,
    lng: 2.07,
    claims: [
      {
        sourceKey: "atkins_voyage_1735",
        citations: [
          { sourceKey: "bosman_guinea_1705", relation: "supports", note: "Describes priests of 'great authority' and a king who acted on their demands in 1697." },
          { sourceKey: "law_slave_coast_1991", relation: "context", note: "Places the priesthood within Hueda's factional politics." },
        ],
        startYear: 1721,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Atkins's visit to Whydah, when he was told of the high priest's standing",
        originalDateText: "held in equal Reverence with the King himself; nay, sometimes more",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Atkins was at Whydah on the 1721 voyage of the Swallow; his book appeared in 1735 (pp. 113–114, read in this session). The date is of his information, which is hearsay from traders.",
      },
      {
        sourceKey: "labat_des_marchais_1730",
        startYear: 1725,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Des Marchais's information on the serpent's grand sacrificateur and order of priests",
        originalDateText: "on lui donna un grand Sacrificateur & un ordre entier de Marabous pour le servir",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Labat's compilation from Des Marchais's 1725 papers, read in this session. Describes the priesthood as Labat understood it; 'Marabous' is the French traders' borrowed word for priests.",
      },
    ],
    media: [pPlanPalaisSabi, pCarteWhidah],
  },
  {
    slug: "how-the-serpent-came-to-hueda",
    title: "How the serpent came to Hueda: three stories, three dates",
    summary:
      "European sources record competing origin stories for Hueda's serpent: it left another country because of men's wickedness (Barbot); it crossed from the army of Allada in a battle and won Hueda's freedom (Labat, 1730); and, in today's best-known version, pythons sheltered a defeated king in 1717. None can be dated, and they contradict each other.",
    description:
      "STORY ONE: THE SERPENT CHOSE HUEDA. Barbot (printed 1732) reports that the chief snake, 'as big as a common-sized man, and of an immense length', the progenitor of all the snake-gods, 'having been found out very many years ago, when by reason of the wickedness of men, it left another country, to come to them', was carried on a silk carpet to its house. Bosman's version is similar.\n\n" +
      "STORY TWO: THE SERPENT CHANGED SIDES. Labat (1730), from Des Marchais's information of 1725: in a battle against 'ceux d'Ardres' (Allada), a great serpent came out of the enemy army and over to Hueda's; it was gentle, the grand sacrificateur lifted it up for the army to see, the army prostrated, then fell on the enemy and routed them. They built it a house, and 'the most reasonable Negroes say quite seriously that the serpent they revere today is really the same one that came to their ancestors and won them that famous victory which delivered them from the oppression of the King of Ardres'.\n\n" +
      "STORY THREE: THE PYTHONS SHELTERED A KING. The tradition attached to the Temple of Pythons today, dated to 1717, in which pythons sheltered a fleeing Hueda king in the forest (benin-vodun: temple-of-pythons-1717-tradition). It post-dates Bosman's description by two decades.\n\n" +
      "WHAT THE CONFLICT MEANS. Each story does political work. The first makes the serpent a gift to a righteous people; the second makes it the guarantor of Hueda's independence FROM ALLADA, which fits Hueda's history of breaking away from Allada's overlordship; the third ties it to a particular king and building. Their incompatibility shows origin stories being told for the needs of their time, not handed down unchanged.\n\n" +
      "SIGNIFICANCE. Serpent veneration on this coast is older than any of these stories can show, and the recorded traditions are about the cult's place in Hueda's politics rather than its beginning. That is the honest conclusion; a single 'founding date' is not available.\n\n" +
      "THINGS TO ASK: Why might a kingdom tell a story in which its god deserted its overlord?",
    category: "religion",
    subcategory: "Hueda religion",
    eventType: "disputed",
    eventTypeNote: "Competing origin traditions for the same cult, recorded by different Europeans at different times; none can be confirmed.",
    tags: vodunTags(TRACK, ["deity: dan and aido-hwedo", "practice: serpent veneration", "place: ouidah", "place: allada"], "origin-traditions", "hueda", "disputed"),
    people: ["John Barbot", "Jean-Baptiste Labat", "Renaud Des Marchais"],
    civilisations: ["Hueda", "Allada"],
    locationName: "Savi and Ouidah, Bénin",
    lat: 6.4,
    lng: 2.08,
    identificationStatus: "disputed",
    argumentsFor:
      "Each story is genuinely recorded: Barbot and Bosman from the 1680s–1700s, Labat from Des Marchais's 1725 information, and the 1717 tradition from modern Ouidah. Labat's version fits Hueda's documented history of throwing off Allada's overlordship, which gives it a plausible political setting.",
    argumentsAgainst:
      "None is datable; the stories contradict each other; each serves a political purpose; the earliest European description (Bosman, before 1704) already shows a fully developed cult with a house, priests and royal pilgrimages, so all three stories describe something that existed before the events they narrate could have happened — or narrate events too vague to date.",
    genealogies: [
      {
        key: "serpent-origin-traditions",
        claim: "The Hueda serpent cult began with a specific founding event that can be dated",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "Three incompatible founding stories are recorded, by Barbot/Bosman, by Labat, and in modern Ouidah. None is accompanied by any independent evidence of date, and the cult is already fully developed in the earliest description.",
        whatWouldChangeThis:
          "An archaeological sequence at Savi or Ouidah tying serpent-related ritual deposits to a datable horizon (Norman's excavations of Hueda ritual sites are the nearest approach), or an independent document narrating the events of one of the stories.",
        links: [
          {
            stage: "colonial_record",
            who: "John Barbot",
            year: 1732,
            sourceKey: "barbot_description_1732",
            reference: "Book IV, ch. 3, pp. 340–341",
            says: "having been found out very many years ago, when by reason of the wickedness of men, it left another country, to come to them",
            adds: "The serpent arrives from elsewhere, unprompted, because of others' wickedness.",
            citationStatus: "verified",
          },
          {
            stage: "colonial_record",
            who: "Jean-Baptiste Labat, from Des Marchais",
            year: 1730,
            sourceKey: "labat_des_marchais_1730",
            reference: "vol. 2, the chapter on the serpent of Juda",
            says: "le Serpent qu'ils révèrent aujourd'hui est réellement le même qui vint trouver leurs ancêtres, & qui leur fit remporter cette victoire célèbre qui les délivra de l'oppression du Roi d'Ardres",
            adds: "The serpent defects from Allada's army and secures Hueda's independence.",
            citationStatus: "verified",
          },
          {
            stage: "community_history",
            who: "Ouidah tradition of the Temple of Pythons",
            sourceKey: "ouidah_vodun_oral_tradition",
            saysAbsentReason: "An oral tradition presented at the temple; recorded in the benin-vodun dataset, not quoted from a fixed text.",
            adds: "Ties the cult to a fleeing king, a forest and the year 1717.",
            citationStatus: "no_citation_given",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "barbot_description_1732",
        citations: [{ sourceKey: "bosman_guinea_1705", relation: "supports", note: "Gives a closely similar account, on which Barbot draws." }],
        startYear: 1732,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The printing of Barbot's version: the serpent left another country",
        originalDateText: "it left another country, to come to them",
        datingMethod: "historical_record",
        chronology: "traditional",
        evidence:
          "EVIDENCE TYPE: contemporary written. Dates the publication of a tradition (the information is from Barbot's and Bosman's time, c. 1680s–1700s). It does not date the event narrated, which the tradition itself places 'very many years ago'.",
      },
      {
        sourceKey: "labat_des_marchais_1730",
        citations: [{ sourceKey: "law_slave_coast_1991", relation: "context", note: "Documents Hueda's earlier subordination to Allada and its independence." }],
        startYear: 1730,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The printing of Labat's version: the serpent crossed from Allada's army",
        originalDateText: "un gros Serpent sortit de l'armée ennemie, & vint se rendre à celle de Juda",
        datingMethod: "historical_record",
        chronology: "traditional",
        evidence:
          "EVIDENCE TYPE: contemporary written. Dates a tradition told to Des Marchais in 1725 and printed in 1730. The battle it narrates is undated.",
      },
      {
        sourceKey: "ouidah_vodun_oral_tradition",
        datePrecision: "year",
        isApproximate: true,
        startYear: 1717,
        temporalClaimType: "traditional_date",
        whatIsDated: "The modern temple tradition's date for the sheltering of a Hueda king by pythons",
        originalDateText: "1717, in the tradition told at the Temple of Pythons",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. A date attached to a story in modern Ouidah; it post-dates Bosman's description of an established cult and cannot date the cult's beginning.",
      },
    ],
    media: [pKroenung, pTempleInterior1863],
  },
  {
    slug: "hueda-coronation-and-serpent-processions-1725",
    title: "April 1725: a Hueda coronation and the processions to the serpent's house",
    summary:
      "Des Marchais, at Whydah in 1725, recorded that a king's coronation was followed by a solemn procession to the serpent's house presided over by the king's mother, a second one three months later led by the king himself, and annual ones thereafter. He witnessed one and drew it.",
    description:
      "WHAT LABAT PRINTED. 'The greatest ceremony held in the Serpent's honour is the solemn procession after the King's coronation. It is the King's mother who presides. Three months later another is held, at which the King assists in person. Besides these two processions, which are held only once in each reign, there is one every year, over which the Grand Master of the King's House presides by his order' — unless public calamity (drought, excessive rain, epidemic) calls for more. Des Marchais 'having been present at the procession made in honour of the Serpent after the King's coronation', Labat reproduces his account and the engraving 'he drew with great care'. The coronation plate is titled April 1725.\n\n" +
      "THE ROAD. The serpent's house lay about half a league west of the capital Savi ('Xavier'), reached by what Labat calls the widest road in the kingdom, along which the whole population gathered on the announced day.\n\n" +
      "WHY THE KING'S MOTHER. That a royal woman, not the king, led the first procession prefigures the Dahomean pattern in which the KPOJITO — the king's female reign-mate — had religious functions (benin-dahomey: kpojito-and-the-palace-women). It suggests that ritual responsibilities shared between king and senior royal woman were a regional pattern, not a Dahomean invention.\n\n" +
      "WHAT THIS ADDS TO BOSMAN. Bosman (benin-vodun) describes annual royal pilgrimages that the then king had abandoned on grounds of cost, sending his wives instead. Labat's account two decades later shows the processions reorganised around the coronation, each reign's ritual inauguration including the serpent. Hueda kingship was ritually completed at Dangbe's house — two years before Dahomey destroyed it.\n\n" +
      "SIGNIFICANCE. This is the most detailed eyewitness record of a Vodun cult being used to INAUGURATE a reign on this coast before 1727, and it gives the serpent cult a constitutional role in Hueda.\n\n" +
      "THINGS TO ASK: If a king is not fully king until he has gone to the god's house, who controls the door?",
    category: "religion",
    subcategory: "Hueda religion",
    eventType: "historical",
    tags: vodunTags(TRACK, ["deity: dan and aido-hwedo", "practice: serpent veneration", "place: ouidah"], "coronation", "procession", "hueda", "kingship"),
    people: ["Renaud Des Marchais", "Jean-Baptiste Labat", "Huffon (king of Hueda)", "the king's mother"],
    civilisations: ["Hueda"],
    locationName: "Savi, Bénin",
    lat: 6.43,
    lng: 2.07,
    claims: [
      {
        sourceKey: "labat_des_marchais_1730",
        citations: [
          { sourceKey: "bosman_guinea_1705", relation: "context", note: "Bosman's earlier account of annual royal pilgrimages, discontinued by the king of his time." },
          { sourceKey: "law_slave_coast_1991", relation: "context", note: "The reigns and succession of the last Hueda kings." },
        ],
        startYear: 1725,
        startMonth: 4,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The coronation of a Hueda king and the procession to the serpent's house that Des Marchais witnessed",
        originalDateText: "Couronnement du Roy de Juda à la coste de Guinée au Mois d'Avril 1725",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The plate's own title and Labat's text (1730), read in this session. Which king was crowned, and whether this was a first coronation or a ceremonial renewal, is not established here — Huffon had reigned since about 1708. NEEDS SOURCE VERIFICATION.",
      },
    ],
    media: [pLabatCoronation, pCarteWhidah],
  },
  {
    slug: "dangbe-wives-in-european-accounts",
    title: "The serpent's wives: Dangbe's devotees in European accounts, 1705–1874",
    summary:
      "Every European writer on Ouidah describes women consecrated to the serpent — seized during the growing season according to Bosman, chosen each year according to Labat, a thousand 'Danh'si' according to Burton. The accounts are hostile and sexualised; the institution they misdescribe was initiation.",
    description:
      "WHAT THEY SAY. Bosman (1705): in the season when the millet grows, people believe the snakes seize young women at night and make them 'distracted'; the women are then confined and trained by priestesses at their parents' cost, a revenue for 'the King and Priests'. Atkins (1735): priestesses 'that live separated with a number of Virgins under their Care, devoted to the Snake's Service', whom rich men allegedly bought. Labat (1730): from early on 'the most beautiful girls' were consecrated to the serpent, and more were chosen 'every year so that he would not lack servants'; they were marked by the priestesses. Burton (1864): the Danh-gbwe 'has 1000 Danh'si or snake wives, married and single votaries'. Skertchly (1874): the 'Danhgbwe-no, snake mothers, or Danh-si, snake wives', instructing neophytes.\n\n" +
      "WHAT THE INSTITUTION WAS. Read against the hostility, the accounts describe INITIATION: a period of seclusion and instruction (Bosman's 'confinement'), a consecrated status marked on the body, a new identity as 'wife' of the vodun (vodunsi, 'wife of the vodun', is the general term), and a hierarchy of senior women ('mothers') who trained the novices. The same structure appears in later ethnography and in the Dahomean and diaspora houses.\n\n" +
      "WHY EUROPEANS SEXUALISED IT. Because a woman called the god's wife invited it, because 'possession' read as madness, and because a story of priests profiting from girls fitted Protestant anticlericalism. Atkins's tale of girls sold to rich men is gossip. Not one of these writers spoke to an initiate.\n\n" +
      "SIGNIFICANCE. This is the longest continuous European record of a Vodun initiatory institution — nearly 170 years of the same cult — and an object lesson in how a thing can be accurately located and wrongly explained. 'Wife of the vodun' is a category that crossed the Atlantic: the vodunsi of Brazil's Jeje houses and the ounsi of Haitian Vodou belong to the same family of terms.\n\n" +
      "THINGS TO ASK: How do you recover an institution from witnesses who only described it to disapprove of it?",
    category: "religion",
    subcategory: "Hueda religion",
    eventType: "historical",
    tags: vodunTags(TRACK, ["practice: initiation and priesthood", "practice: possession", "practice: serpent veneration", "deity: dan and aido-hwedo", "place: ouidah"], "vodunsi", "women", "european-accounts"),
    people: ["Willem Bosman", "John Atkins", "Jean-Baptiste Labat", "Richard F. Burton", "J. A. Skertchly"],
    civilisations: ["Hueda", "Dahomey"],
    locationName: "Ouidah, Bénin",
    lat: 6.363,
    lng: 2.085,
    claims: [
      {
        sourceKey: "bosman_guinea_1705",
        citations: [
          { sourceKey: "labat_des_marchais_1730", relation: "supports", note: "Describes girls consecrated to the serpent annually and marked by priestesses." },
          { sourceKey: "atkins_voyage_1735", relation: "supports", note: "Describes priestesses with virgins devoted to the snake (1721)." },
        ],
        startYear: 1705,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest printed account of women taken into the serpent's service",
        originalDateText: "the Snake or Snakes make it their Business every Evening and Night to seize all the beautiful young Women",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Bosman, Letter XIX (pp. 371–372), read in this session. Dates the description; the institution is presented as long-established.",
      },
      {
        sourceKey: "burton_mission_gelele_1864",
        citations: [{ sourceKey: "skertchly_dahomey_1874", relation: "supports", note: "Calls the senior women snake mothers and the devotees snake wives, still training neophytes in 1871." }],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The serpent's devotees under Dahomean rule, as Burton recorded them",
        originalDateText: "it has 1000 Danh'si or snake wives, married and single votaries",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Burton, vol. 2, p. 139, read in this session. The figure 1000 is his informants' or his own round number, not a count.",
      },
    ],
    media: [pJeunePretresse, pFetishDance1863],
  },
  {
    slug: "hueda-hog-slaughter-1697",
    title: "1697: a hog eats a python, and the king of Hueda orders the hogs killed",
    summary:
      "Bosman reports that in 1697 a hog at Whydah ate a sacred snake; the priests complained to the king, who ordered every hog in the kingdom killed, then countermanded the order. It is the earliest dated incident showing a Hueda king enforcing the serpent's protection.",
    description:
      "WHAT BOSMAN SAYS. 'In the Year 1697 my Brother Factor Mr. Nicholas Poll, (who then managed the Slave Trade for our Company at Fida) had the Diversion of a very pleasant Scene. A Hog being bitten by a Snake ... seiz'd and devour'd him in sight of the Negroes.' The priests complained to the king and asked for 'a Royal Order, that all the Hogs in his Kingdom should be forthwith kill'd'. The order was published; thousands armed with swords and clubs carried it out while owners defended their pigs, 'and nothing was heard but the dismal Sound of Kill, Kill'. The king then recalled the order, 'with the Addition, that there was already enough of innocent Blood spilt, and that their God ought to be appeased with so rich a Sacrifice'. On his next visit Bosman found pork very dear.\n\n" +
      "HOW TO READ IT. Bosman tells it as farce, at second hand (from Poll), for readers who would laugh. Strip the tone and the sequence is political: an offence against the national power; a formal complaint by its priests; a royal decree applying to the whole kingdom; enforcement by the population; resistance by property-owners; and a royal climb-down framed as the god being satisfied. The king acted for the cult and then limited the cult's demand.\n\n" +
      "WHAT IT DOES NOT SHOW. How many hogs died, whether the order was enforced everywhere, or how the priests saw it. Bosman's numbers ('Thousands of Blacks', 'some Hundreds' of hogs in his chapter summary) are a storyteller's.\n\n" +
      "SIGNIFICANCE. The earliest DATED case in which the protection of Dangbe is enforced by royal law across a kingdom, and an unusually clear picture of the triangle of king, priests and people in a Vodun state. It belongs beside the penalties for killing a python, which later passed from Hueda's kings to Dahomey's.\n\n" +
      "THINGS TO ASK: When a story is told as a joke, what serious facts can still be recovered from it?",
    category: "religion",
    subcategory: "Hueda religion",
    eventType: "historical",
    tags: vodunTags(TRACK, ["practice: serpent veneration", "deity: dan and aido-hwedo", "place: ouidah"], "hueda", "royal-decree", "bosman"),
    people: ["Willem Bosman", "Nicholas Poll", "the king of Hueda"],
    civilisations: ["Hueda", "Dutch West India Company"],
    locationName: "Whydah (Ouidah) and Savi, Bénin",
    lat: 6.4,
    lng: 2.08,
    claims: [
      {
        sourceKey: "bosman_guinea_1705",
        citations: [
          { sourceKey: "law_slave_coast_1991", relation: "context", note: "Uses Bosman's Hueda letters critically as evidence of Hueda politics in the 1690s." },
        ],
        startYear: 1697,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The hog incident and the royal order to kill the hogs",
        originalDateText: "In the Year 1697. my Brother Factor Mr. Nicholas Poll",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Bosman, Letter XIX, pp. 381–382 (1705 English edition), read in this session. A dated report at second hand from a named colleague, written within a few years of the event.",
      },
    ],
    media: [pPlanPalaisSabi, pWhydah1745],
  },
  {
    slug: "killing-a-python-from-death-to-ordeal",
    title: "Killing a python at Ouidah: from death sentence to ordeal of fire, 1694–1874",
    summary:
      "From the 1690s Europeans report that killing Dangbe meant death. By 1851 Forbes credits Francisco Félix de Souza with replacing the death penalty by an ordeal; Burton (1864) and Skertchly (1874) describe the burning hut, the gauntlet of priests and the washing in water. The sources disagree about when the change came.",
    description:
      "UNDER HUEDA. Phillips (1694): killing a snake 'has cost the lives of some white men'. Bosman (1705): a native who kills one 'is a dead Man, and certainly Condemned to the Flames'; he tells of English traders who killed a snake and were all killed and their house burned, so that the English stayed away for years; a European today, he thinks, might escape with a fine paid to the priests if he could reach the king first. Barbot repeats the English story. Atkins (1721): 'Death for a Native to kill one of these Snakes, and severe Punishments to Europeans.'\n\n" +
      "UNDER DAHOMEY. Forbes (1851) says that the late Francisco Félix de Souza (d. 1849), the Brazilian Chacha of Ouidah, abolished 'death as the punishment for killing (by accident or otherwise) a fetish snake. Now, the unfortunate criminal has to enter a house of straw covered with palm oil, to which a light is set, and thence to run the gauntlet through the fetish priests ... and he is not free until he reaches water in which he washes out the sin.' Burton (1864) describes the same ordeal — a hut of faggots greased with palm oil, fired; the culprit runs to running water beaten by the Danhgbwe-no — and adds that de Souza saved many by surrounding the culprit with his own slaves who beat him only 'in semblance'. Skertchly (1874) says that 'so recent as the late king's reign' (Ghezo, d. 1858) a native who killed one 'was at once sacrificed, and his wives and property confiscated'.\n\n" +
      "THE DISAGREEMENT. Forbes credits de Souza with abolition before 1849; Skertchly has the death penalty under Ghezo. Both may be partly right — a Chacha's influence at Ouidah, a king's law at Abomey — or Skertchly's informants may have exaggerated. That a Brazilian slave-trader is credited with reforming a Vodun penalty is itself significant: under Dahomey the punishment of an offence against Hueda's god was a matter for the king's agents.\n\n" +
      "SIGNIFICANCE. One rule followed across two centuries and two kingdoms shows a cult's protection passing from its own kings to its conquerors, and a penalty changing from execution to a purification rite of fire and water — a recognisably religious resolution of a religious offence.\n\n" +
      "THINGS TO ASK: Who has the power to soften a god's law, and what does it say about him that he can?",
    category: "religion",
    subcategory: "Serpent, crown and law",
    eventType: "historical",
    tags: vodunTags(TRACK, ["practice: serpent veneration", "deity: dan and aido-hwedo", "place: ouidah"], "law", "ordeal", "de-souza"),
    people: ["Thomas Phillips", "Willem Bosman", "John Atkins", "Francisco Félix de Souza", "Frederick E. Forbes", "Richard F. Burton", "J. A. Skertchly", "Ghezo"],
    civilisations: ["Hueda", "Dahomey"],
    locationName: "Ouidah, Bénin",
    lat: 6.363,
    lng: 2.085,
    claims: [
      {
        sourceKey: "bosman_guinea_1705",
        citations: [
          { sourceKey: "phillips_hannibal_1694", relation: "supports", note: "Already in 1694 reports that killing a snake had cost Europeans their lives." },
          { sourceKey: "atkins_voyage_1735", relation: "supports", note: "Reports death for a native who kills one (1721)." },
        ],
        startYear: 1694,
        endYear: 1721,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "European reports of death as the penalty for killing the serpent under Hueda",
        originalDateText: "he is a dead Man, and certainly Condemned to the Flames",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Phillips (1694), Bosman (1690s, printed 1704–05) and Atkins (1721), read in this session. Partly hearsay; the English massacre story is undated ('a long time past').",
      },
      {
        sourceKey: "forbes_dahomey_1851",
        citations: [
          { sourceKey: "burton_mission_gelele_1864", relation: "supports", note: "Describes the same fire-and-water ordeal and de Souza's mitigation of it." },
        ],
        startYear: 1849,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "before_event",
        whatIsDated: "De Souza's replacement of the death penalty by an ordeal, before his death in 1849",
        originalDateText: "abolishing death as the punishment for killing (by accident or otherwise) a fetish snake",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Forbes, vol. 1, p. 107, read in this session. The change is dated only as before de Souza's death; Forbes reports it, he did not see it decreed.",
      },
      {
        sourceKey: "skertchly_dahomey_1874",
        startYear: 1858,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "before_event",
        whatIsDated: "Skertchly's contrary claim: death for killing a Danhgbwe until the end of Ghezo's reign",
        originalDateText: "So recent as the late king's reign, if a native had the misfortune to accidentally ... kill a Danhgbwe, he was at once sacrificed",
        datingMethod: "historical_record",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: contemporary written. Skertchly, pp. 54–55, read in this session; Ghezo died in 1858. It conflicts with Forbes's attribution of abolition to de Souza before 1849.",
      },
    ],
    media: [pTempleInterior1863, pTemple1900],
  },

  // =========================================================================
  // DAHOMEY TAKES HUEDA'S GODS
  // =========================================================================
  {
    slug: "dahomey-soldiers-and-the-pythons-1727",
    title: "1727: 'If you are gods, speak and save yourselves' — Dahomey's soldiers and the pythons of Savi",
    summary:
      "Snelgrave reports that the Hueda left the river crossing to the protection of the snake, sacrificing to it morning and evening, and that after the fall of Savi Dahomean soldiers held the snakes up, challenged them to save themselves, then killed, roasted and ate them.",
    description:
      "THE PASSAGE. William Snelgrave, who visited Agaja's camp in 1727, describes the Dahomean advance on Savi ('Sabee'). A river half a mile north of the capital could have been held by five hundred men, but the Hueda 'kept no set Guard. They only went every Morning and Evening to the River side, to make Fetiche ... to offer Sacrifice to their principal God, which was a particular harmless Snake they adored, and prayed to on this occasion, to keep their Enemies from coming over the River.' After the conquest, finding the snakes in the houses, the conquerors 'held them up by the middle, and spoke to them in this manner: If you are Gods, speak and save yourselves: Which the poor Snakes not being able to do, the Dahomes cut their Heads off, ripped them open, broiled them on the Coals, and eat them.' Dalzel (1793), following, says the Whydahs 'were contented to place, with great ceremony, the fetish snake in the path, to oppose the invading army'.\n\n" +
      "HOW TO READ IT. Snelgrave has two axes to grind: contempt for 'cowardly luxurious' Hueda, whose fall made the Dahomeans' conquest of the slave port easy, and a sneer at Dahomey ('It is very strange, the Conquerors should so far contemn the Gods of this Country, since they are so barbarous ... themselves'). The story of the unguarded ford is a moral fable as much as a report. But the desecration is specific, and in a war of conquest an army demonstrating that the enemy's god cannot save him is a recognisable act.\n\n" +
      "WHAT HAPPENED NEXT. Within a generation Dahomey was protecting the same serpent and punishing those who harmed it (see the record on Dahomey taking Dangbe under protection). The killing of 1727 and the protection that followed are two phases of one policy: first prove the god defeated, then take it over.\n\n" +
      "SIGNIFICANCE. The only eyewitness-era account of what conquest did to Hueda's god in the moment of conquest. It corrects the impression, easily drawn from the later 'absorption' of conquered cults (benin-vodun: conquest-absorbs-cults), that the takeover was peaceful from the start.\n\n" +
      "THINGS TO ASK: Is mocking an enemy's god a denial that it is a god — or a test of whether it is?",
    category: "religion",
    subcategory: "Conquest and religion",
    eventType: "historical",
    tags: vodunTags(TRACK, ["deity: dan and aido-hwedo", "practice: serpent veneration", "place: ouidah"], "conquest", "1727", "snelgrave", "desecration"),
    people: ["William Snelgrave", "Agaja", "Huffon (king of Hueda)", "Archibald Dalzel"],
    civilisations: ["Dahomey", "Hueda"],
    locationName: "Savi, Bénin",
    lat: 6.43,
    lng: 2.07,
    claims: [
      {
        sourceKey: "snelgrave_new_account_1734",
        citations: [
          { sourceKey: "dalzel_history_dahomy_1793", relation: "supports", note: "Repeats the account of the snake placed in the path of the invaders." },
          { sourceKey: "law_slave_coast_1991", relation: "context", note: "The military history of the conquest of Hueda in 1727." },
        ],
        startYear: 1727,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The fall of Savi and the Dahomean soldiers' killing of the snakes",
        originalDateText: "If you are Gods, speak and save your selves",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Snelgrave (1734), writing of events of 1727 at which he was not present but about which he heard within weeks at Agaja's camp; read in this session. The conquest is securely dated; the desecration rests on his report alone.",
      },
    ],
    media: [pBritishFort1727, pCarteWhidah],
  },
  {
    slug: "dahomey-takes-dangbe-under-protection",
    title: "Dahomey takes Hueda's serpent under its protection",
    summary:
      "After 1727 Dahomey kept the serpent cult of Ouidah in being, and by the nineteenth century its kings' agents enforced Dangbe's protection. Burton heard that permitting the cult reconciled the Hueda to Dahomean rule; Skertchly that the serpent 'was introduced into the Dahoman Pantheon'.",
    description:
      "WHAT THE BÉNIN DATASET ALREADY SAYS. benin-vodun's 'Conquest did not destroy the religion of the conquered' states the pattern of absorption and marks the Dangbe case NEEDS SOURCE VERIFICATION. This record supplies the documentary evidence found in this session.\n\n" +
      "THE EVIDENCE. Burton (1864, vol. 1, p. 96): 'the snakes lost their kingdom; yet we are told that when the Dahomans permitted serpent-worship to continue, the Whydahs, abundantly thankful, became almost reconciled to the new stern rule.' Skertchly (1874, p. 55): the Danhgbwes, 'whose power was relied upon to save the kingdom from the conquering armies of Agajah ... the tutelary saint of Whydah', were, 'when that kingdom was conquered, ... introduced into the Dahoman Pantheon'. Forbes (1851) and Burton show Dahomey's Ouidah establishment involved in punishing python-killers. Burton (vol. 2, p. 147) also lists 'Li', 'a great fetish at Whydah, in charge of the town before it was conquered by Agaja', still worshipped at a shed west of Savi.\n\n" +
      "WHAT IS NOT DOCUMENTED HERE. When and by which king the policy was decided. Law (2004) treats Ouidah's religious institutions under Dahomean rule and the survival of Hueda cults; the reign usually credited with organising Dahomey's relations with conquered cults is Tegbesu's. NEEDS SOURCE VERIFICATION for the date and the decision.\n\n" +
      "WHY A CONQUEROR WOULD DO IT. Ouidah was Dahomey's port and revenue. Its population, merchants and priests had to be governed, and Hueda exiles to the west kept attacking for decades. Protecting the serpent was cheap legitimacy; controlling who punished offences against it was control of the town's religion.\n\n" +
      "SIGNIFICANCE. The serpent of Ouidah — the most famous image of Vodun in the world — survived because a conqueror decided it should. Dangbe as visitors see it today is Hueda's god kept alive by Dahomean policy.\n\n" +
      "THINGS TO ASK: When a conqueror protects your god, whose god is it afterwards?",
    category: "religion",
    subcategory: "Conquest and religion",
    eventType: "historical",
    tags: vodunTags(TRACK, ["deity: dan and aido-hwedo", "practice: serpent veneration", "place: ouidah"], "conquest", "incorporation", "dahomey"),
    people: ["Agaja", "Tegbesu", "Richard F. Burton", "J. A. Skertchly"],
    civilisations: ["Dahomey", "Hueda"],
    locationName: "Ouidah, Bénin",
    lat: 6.363,
    lng: 2.085,
    claims: [
      {
        sourceKey: "burton_mission_gelele_1864",
        citations: [
          { sourceKey: "skertchly_dahomey_1874", relation: "supports", note: "States that the Danhgbwe was introduced into the Dahoman pantheon after the conquest." },
          { sourceKey: "law_ouidah_2004", relation: "context", note: "Ouidah's religious institutions under Dahomean administration." },
        ],
        startYear: 1727,
        endYear: 1864,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The serpent cult's continuation under Dahomean rule, from the conquest to Burton's visit",
        originalDateText: "when the Dahomans permitted serpent-worship to continue",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Burton reports a tradition ('we are told') about a policy of the eighteenth century; the end date is his visit. The start of the policy is approximate and its author unknown here.",
      },
    ],
    media: [pGramberg1861, pTempleExterior1863, pKahnLegbaDan],
  },
  {
    slug: "hu-the-sea-and-the-hunon-of-ouidah",
    title: "Hu, the sea, and the Hunon of Ouidah",
    summary:
      "The sea was a principal power at Ouidah under Hueda and remained one under Dahomey: Labat describes blood and a gold ring cast into the surf; Burton calls the Hu-no, the sea-priest, 'the highest of all, a fetish king'; Dahomean kings sent offerings — at times a human victim — from Abomey. The title survives as the Daagbo Hounon.",
    description:
      "UNDER HUEDA. Bosman and Barbot rank the sea as the third of Hueda's gods. Labat (1730) describes the grand sacrificateur at the shore pronouncing prayers, an ox or sheep killed so that its blood runs into the water, and a gold ring thrown 'as far as possible' into the waves; the carcasses went to the priest.\n\n" +
      "UNDER DAHOMEY. Burton (1864, vol. 2, pp. 141–142): 'The Hu-no, or ocean priest, is now considered the highest of all, a fetish king, at Whydah, where he has 500 wives. At stated times he repairs to the beach, begs \"Agbwe\" ... not to be boisterous, and throws in rice and corn, oil and beans, cloth, cowries, and other valuables.' And: 'At times the King sends as an ocean sacrifice from Agbome a man carried in a hammock, with the dress, the stool, and the umbrella of a caboceer; a canoe takes him out to sea.' Skertchly (1874) describes the Huno's procession to the beach at the end of the dry season and says the royal sacrifice was 'now happily discontinued'. Burton also says the Agasunon at Abomey is the Hu-no's 'equivalent' — the Hu-no being the measure of rank.\n\n" +
      "WHY THE SEA MATTERED TO DAHOMEY. Because Ouidah's beach was where the kingdom's wealth arrived and departed: the European ships, the goods, and the captives sold. A king who sent offerings to the sea was addressing the power over his trade. The human victim dressed as a dignitary — a 'messenger' to the sea — is the grim corollary.\n\n" +
      "THE OFFICE TODAY. The supreme vodun priest of Ouidah bears the title DAAGBO HOUNON (Hunon), and presides at the national Vodun day of 10 January. The modern office claims continuity with the sea-priesthood the eighteenth- and nineteenth-century writers describe; how the succession ran through the colonial period is not traced here.\n\n" +
      "SIGNIFICANCE. Hu shows a Hueda cult not merely surviving conquest but rising under it — to the top of the Ouidah hierarchy, by Burton's account — because it served the conqueror's interests at the sea's edge. The water and sea powers that crossed the Atlantic (benin-vodun; the Ezili and Agwe of Haiti) have a political history here.\n\n" +
      "THINGS TO ASK: What does a kingdom that sells people across the sea ask of the sea?",
    category: "religion",
    subcategory: "Conquest and religion",
    eventType: "historical",
    tags: vodunTags(TRACK, ["deity: ezili and water spirits", "practice: initiation and priesthood", "place: ouidah"], "hu", "sea", "hunon", "daagbo-hounon"),
    people: ["The Hunon (Hu-no) of Ouidah", "Daagbo Hounon", "Jean-Baptiste Labat", "Richard F. Burton", "J. A. Skertchly"],
    civilisations: ["Hueda", "Dahomey"],
    locationName: "The beach at Ouidah, Bénin",
    lat: 6.32,
    lng: 2.09,
    claims: [
      {
        sourceKey: "labat_des_marchais_1730",
        citations: [{ sourceKey: "bosman_guinea_1705", relation: "supports", note: "Ranks the sea as the third god of Fida." }],
        startYear: 1725,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Labat's description of sacrifice to the sea under Hueda",
        originalDateText: "on jette un anneau d'or dans les flots le plus avant qu'il est possible",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. From Des Marchais's 1725 information, printed 1730; read in this session. Dates a description.",
      },
      {
        sourceKey: "burton_mission_gelele_1864",
        citations: [{ sourceKey: "skertchly_dahomey_1874", relation: "supports", note: "Describes the Huno's beach procession and the royal offering, reported discontinued by 1871." }],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Burton's statement that the Hu-no was the highest priest at Whydah",
        originalDateText: "The Hu-no, or ocean priest, is now considered the highest of all, a fetish king, at Whydah",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Burton, vol. 2, p. 141, read in this session. The human sacrifice to the sea is reported, not witnessed.",
      },
    ],
    media: [pDaagbo, pBarWydah1863],
  },

  // =========================================================================
  // THE DYNASTY'S OWN RELIGION
  // =========================================================================
  {
    slug: "nesuhwe-cult-of-the-royal-dead",
    title: "Nesuhwe: the cult of the royal dead",
    summary:
      "Dahomey's royal family served its dead in a cult of its own, the Nesu or Nesuhwe, housed in sheds beside the palaces and, according to what Burton was told, established by Agaja. It is the religious core of the Customs and of royal funerals.",
    description:
      "WHAT IT IS. NESUHWE (Nesu-hwe, 'house of Nesu') is the cult in which the deceased kings and members of the royal lineage were deified and served, with initiates possessed by royal ancestors. It is distinct from the ancestral practice of ordinary lineages (benin-vodun: ancestors-in-vodun) in being the cult of THE dynasty, and therefore of the state.\n\n" +
      "WHAT BURTON RECORDED. 'Nesu, the proper Ffon fetish of Agbome, established by Agaja the Conqueror. It is worshipped in large sheds called Nesu-hwe, adjoining the various palaces. Its water pot is known as Bagwe, and when the fetish women, guarded by Amazons, pass in strings towards the wells, they are fetching the element for the mysterious rites of Nesu' (1864, vol. 2, p. 147). Burton also passed a Nesu-hwe 'in which the King' worshipped on the road. Skertchly (1874) mentions 'Nesu-water' as the expiation for a grave offence. Herskovits (1938) describes the royal ancestral cult in the 1930s.\n\n" +
      "THE ATTRIBUTION TO AGAJA. Burton's informants credited Agaja (c. 1718–1740), the conqueror of Allada and Hueda. That is a court tradition, not a document; it fits a king who expanded the state and needed its dynasty's dead to rank above the gods of the conquered, but it cannot be checked.\n\n" +
      "HOW IT CONNECTS. The Annual Customs, with their 'watering of the graves', and the Grand Customs at a king's death (benin-dahomey) were the public face of this cult; the human sacrifices that so preoccupied Europeans were offered largely to and for the royal dead (benin-dahomey: human-sacrifice-what-is-documented). Forbes in 1851 already says that at the Customs 'there are sacrifices to the manes of their ancestors'.\n\n" +
      "SIGNIFICANCE. Nesuhwe is the institution that made the royal dead into vodun and so put the dynasty's past into the religion's present. Its logic — deceased royals as possessing spirits — reappears in Brazil, where the Casa das Minas served Dahomean royal vodun.\n\n" +
      "THINGS TO ASK: What happens to a state's religion when the state's own founders become its gods?",
    category: "religion",
    subcategory: "Royal cults",
    eventType: "historical",
    tags: vodunTags(TRACK, ["practice: ancestors", "practice: possession", "practice: initiation and priesthood", "place: abomey"], "nesuhwe", "royal-dead", "customs"),
    people: ["Agaja", "Richard F. Burton", "Frederick E. Forbes"],
    civilisations: ["Dahomey", "Fon"],
    locationName: "Abomey, Bénin",
    lat: 7.185,
    lng: 1.991,
    claims: [
      {
        sourceKey: "burton_mission_gelele_1864",
        citations: [
          { sourceKey: "herskovits_dahomey_1938", relation: "supports", note: "Describes the royal ancestral cult in the 1930s." },
        ],
        startYear: 1718,
        endYear: 1740,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The establishment of the Nesu cult, attributed by Burton's informants to Agaja's reign",
        originalDateText: "Nesu, the proper Ffon fetish of Agbome, established by Agaja the Conqueror",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence:
          "EVIDENCE TYPE: later historical account. A court tradition reported by Burton in 1864, dated here by Agaja's approximate reign. It establishes what the court said; it does not establish that the cult began then.",
      },
      {
        sourceKey: "forbes_dahomey_1851",
        startYear: 1850,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Forbes's statement that sacrifices at the Customs were offered to the royal ancestors",
        originalDateText: "at the See-que-ah-hee there are sacrifices to the manes of their ancestors",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Forbes, vol. 1, p. 82, from his 1850 visit to the Customs; read in this session.",
      },
    ],
    media: [pKahnTombWomen, pKahnGleleTomb, pRoyalFuneral1863],
  },
  {
    slug: "hwanjile-and-the-installation-of-mawu-lisa",
    title: "Did Hwanjile bring Mawu and Lisa to Abomey?",
    summary:
      "Tradition, as reconstructed by Edna Bay, credits Hwanjile, the kpojito of King Tegbesu (c. 1740–1774), with bringing the creator pair Mawu and Lisa from Aja country, establishing their temple and making them heads of the Dahomean pantheon. The tradition is coherent but undocumented, and Burton's informants placed her differently.",
    description:
      "THE TRADITION. HWANJILE, an Aja woman from Home, west of Abomey, is remembered as having helped Tegbesu to the throne over an older brother and been named his KPOJITO (benin-dahomey: kpojito-and-the-palace-women). Tradition credits her with a religious reorganisation: she brought MAWU and LISA from the Aja country and proclaimed them heads of the pantheon, established their shrine outside the palace and served as their chief priest, and encouraged Fa divination. Bay (1995, 1998) makes this a centrepiece of her argument that the kpojito gave the eighteenth-century kings religious legitimacy over an expanding, plural kingdom. Several vodun she is credited with introducing are still worshipped; her title passed to successors.\n\n" +
      "WHAT SUPPORTS IT. It fits the period: Tegbesu's reign followed the conquests that brought many peoples' vodun into the kingdom, and a high god placed above all of them would serve a centralising monarchy. It is a strong and specific court tradition. And the office of Hwanjile continued — in 1797 a woman called Na Wanjile is named among King Agonglo's killers.\n\n" +
      "WHAT CUTS AGAINST IT. No document of Tegbesu's reign mentions it; the earliest written accounts are from the twentieth century. Mawu is a high-god name across the Ewe and Aja region, so the TRADITION concerns the installation of a royal cult, not the invention of a god — summaries that say Hwanjile 'introduced Mawu-Lisa' to Dahomean religion overstate it. And Burton (1864, vol. 2) passed a palace barn 'called after Ahwanjile, mother of Sinmenkpen (Adahoonzou II.)' — i.e. of Kpengla — which may show the title held by a later woman, a confusion of reigns, or a different tradition.\n\n" +
      "SIGNIFICANCE. If the tradition is right, the creator pair that most textbooks put at the top of 'the Fon pantheon' was put there by a royal woman for political reasons in the mid-eighteenth century — the clearest example on this coast of a state reorganising a pantheon. If it is wrong, the claim still shows how the court explained its religion to itself. Either way, 'Mawu-Lisa heads the pantheon' is a historical arrangement, not a timeless fact (benin-vodun: mawu-lisa, not-one-theology).\n\n" +
      "THINGS TO ASK: When a tradition says a god was 'brought', what exactly is being claimed to have moved?",
    category: "religion",
    subcategory: "Royal women and religion",
    eventType: "disputed",
    eventTypeNote: "A court tradition, developed by modern scholarship into a historical argument, that no contemporary document confirms.",
    tags: vodunTags(TRACK, ["deity: mawu-lisa", "practice: divination", "practice: initiation and priesthood", "place: abomey"], "hwanjile", "kpojito", "tegbesu", "disputed"),
    people: ["Hwanjile", "Tegbesu", "Kpengla", "Na Wanjile", "Edna G. Bay", "Richard F. Burton"],
    civilisations: ["Dahomey", "Aja", "Fon"],
    locationName: "Abomey, Bénin",
    lat: 7.185,
    lng: 1.991,
    identificationStatus: "disputed",
    argumentsFor:
      "A specific, widely held court tradition names the woman, her origin, her office, the gods, the place of their shrine and her priestly role; it fits the political needs of Tegbesu's reign after the conquests; Bay's study of the kpojito office makes it part of a consistent institutional history; and the Hwanjile title is attested as continuing in the 1797 killing of Agonglo.",
    argumentsAgainst:
      "No eighteenth-century document records it; the earliest written versions are twentieth-century; Mawu was a regional high-god name, so the god was not new; Burton's 1864 informants associated 'Ahwanjile' with the mother of Kpengla rather than Tegbesu's kpojito; and court traditions are known to reassign innovations to celebrated figures.",
    genealogies: [
      {
        key: "hwanjile-mawu-lisa",
        claim: "Hwanjile, Tegbesu's kpojito, introduced Mawu and Lisa as heads of the Dahomean pantheon",
        verdict: "related_tradition_exists",
        verdictEvidence:
          "The claim rests on royal oral tradition recorded in the twentieth century and developed by Bay (1995, 1998). It is not attested in eighteenth- or nineteenth-century European sources read in this session; Burton (1864) names Mau and Lisa as creator figures without connecting them to Hwanjile, and connects the name Ahwanjile to Kpengla's mother.",
        whatWouldChangeThis:
          "A Portuguese, French or English document from Tegbesu's reign mentioning a new royal cult of Mawu; or a nineteenth-century record of the tradition earlier than those now known.",
        links: [
          {
            stage: "colonial_record",
            who: "Richard F. Burton",
            year: 1864,
            sourceKey: "burton_mission_gelele_1864",
            reference: "vol. 2, pp. 135–136 (Mau and Lisa) and the palace walls (Ahwanjile)",
            says: "a large barn, called after Ahwanjile, mother of Sinmenkpen (Adahoonzou II.)",
            adds: "Records Mau and Lisa as creator figures and names Ahwanjile, but as mother of Kpengla and with no religious role.",
            citationStatus: "verified",
          },
          {
            stage: "current_scholarship",
            who: "Edna G. Bay",
            year: 1995,
            sourceKey: "bay_kpojito_1995",
            reference: "Journal of African History 36 (1995), 1–27",
            saysAbsentReason: "Not read in this session; its argument is reported from the abstract and from works citing it.",
            adds: "Makes Hwanjile's religious reforms central to the kpojito's role in establishing royal legitimacy.",
            citationStatus: "unverified",
          },
          {
            stage: "popular_claim",
            who: "Wikipedia, 'Hwanjile'",
            sourceKey: "wikipedia_dahomey_navigation",
            says: "She imported the creator gods Mawu and Lisa from Aja and proclaimed them rulers of the Dahomean pantheon",
            adds: "States the tradition as fact, with partly garbled citations.",
            citationStatus: "misattributed",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "bay_wives_leopard_1998",
        citations: [
          { sourceKey: "bay_kpojito_1995", relation: "supports", note: "Places the kpojito office at its height under Hwanjile and Tegbesu." },
          { sourceKey: "ouidah_vodun_oral_tradition", relation: "context", note: "The court tradition on which the reconstruction rests." },
        ],
        startYear: 1740,
        endYear: 1774,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "Hwanjile's installation of Mawu and Lisa, dated by Tegbesu's reign",
        originalDateText: "In the reign of Tegbesu, when Hwanjile was kpojito",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence:
          "EVIDENCE TYPE: oral tradition. Dated only by the reign to which tradition assigns it; Tegbesu's own dates are approximate. Not confirmed by any contemporary document.",
      },
      {
        sourceKey: "burton_mission_gelele_1864",
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Burton's record of the name Ahwanjile attached to Kpengla's mother",
        originalDateText: "called after Ahwanjile, mother of Sinmenkpen (Adahoonzou II.)",
        datingMethod: "historical_record",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: contemporary written. Burton, vol. 2, read in this session. A nineteenth-century statement that does not fit the tradition's placement of Hwanjile under Tegbesu; it may reflect the title passing to a successor.",
      },
    ],
    media: [pTegbessouPalace, pFeticheurs1912],
  },
  {
    slug: "kings-priests-and-the-control-of-vodun",
    title: "Kings and priests: how Dahomey governed the vodun",
    summary:
      "Where Hueda's high priest could 'humble the King', Dahomey's kings kept priests firmly beneath them: they sanctioned or suppressed cults, appointed heads of worship, took their share of captives for the gods, and in Burton's phrase used 'fetish' as 'the strongest engine of government'.",
    description:
      "THE CONTRAST WITH HUEDA. Atkins in 1721 found a Hueda high priest revered 'equal with the King'. A century and a half later Skertchly insisted that in Dahomey the chief priest did not rank next to the king, 'for ... His Majesty of Dahomey is as far above his subjects as Buddah is above his devotees; besides which, church and state have not the slightest connection as regards precedence'. Burton, describing the king's prostration before the Agasunon, also called fetish 'throughout the dark continent, the strongest engine of government — a moral police'. Both describe a monarchy that used religion and did not share power with it.\n\n" +
      "THE INSTRUMENTS. The record assembled in this track shows several. The king RECOGNISED AND ADOPTED cults (Dangbe and Hu after 1727; the vodun of conquered peoples brought to Abomey). He REGULATED offences against them (the python penalty passing to Dahomean agents). His officers LED RITES (the Migan sent to Allada). His female counterpart, the kpojito, REORGANISED THE PANTHEON (Hwanjile, in tradition). He FINANCED AND RATIONED the gods: Dalzel reports that Agaja, having taken eighteen hundred prisoners, 'contented his priests with four hundred of them' — ships being in the road to buy the rest. Twentieth-century ethnography (Herskovits) records heads of worship appointed by the king.\n\n" +
      "VODUN OF THE KING AND VODUN OF THE PEOPLE. Scholars, Parés above all, distinguish the royal cults — Agasu, Nesuhwe, the royal toxosu — which were the dynasty's own, from the public and lineage vodun that the king supervised but did not own. The distinction is not always clean in practice; it is a way of seeing that a Vodun state had a religion of its own as well as a policy towards everyone else's.\n\n" +
      "SIGNIFICANCE. The kingdom of Dahomey is the clearest documented case of a West African state making Vodun an instrument of rule — which is why the fall of the monarchy in 1894 changed Vodun's public shape so much (benin-vodun: vodun-under-colonial-rule), and why the religion that reached the Americas came out of a world where gods had politics.\n\n" +
      "THINGS TO ASK: Can a religion be both the people's and the state's at once?",
    category: "religion",
    subcategory: "Religion and royal power",
    eventType: "historical",
    tags: vodunTags(TRACK, ["practice: initiation and priesthood", "practice: ancestors", "place: abomey"], "religion and the state", "priesthood", "kingship"),
    people: ["Agaja", "Tegbesu", "Ghezo", "Glele", "J. A. Skertchly", "Richard F. Burton", "Archibald Dalzel"],
    civilisations: ["Dahomey", "Hueda"],
    locationName: "Abomey, Bénin",
    lat: 7.185,
    lng: 1.991,
    claims: [
      {
        sourceKey: "dalzel_history_dahomy_1793",
        citations: [{ sourceKey: "law_slave_coast_1991", relation: "context", note: "Agaja's campaigns of the 1720s and the sale of captives at Ouidah." }],
        startYear: 1720,
        endYear: 1730,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Agaja's allocation of captives between the priests and the slave ships",
        originalDateText: "he contented his priests with four hundred of them: ships being then in the road",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Dalzel (1793), compiling earlier traders' memoirs about Agaja's wars; read in this session. The decade is approximate and the numbers are a trader's report.",
      },
      {
        sourceKey: "skertchly_dahomey_1874",
        citations: [{ sourceKey: "burton_mission_gelele_1864", relation: "disputes", note: "Burton had placed the Agasunon next to the king in rank; Skertchly corrects him." }],
        startYear: 1874,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Skertchly's statement that Dahomean 'church and state' shared no precedence",
        originalDateText: "church and state have not the slightest connection as regards precedence",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Skertchly, p. 150, read in this session; based on his residence in 1871.",
      },
    ],
    media: [pFeticheurs1912, pForbesGezo],
  },

  // =========================================================================
  // CATHOLICISM, BRAZIL AND THE KINGS
  // =========================================================================
  {
    slug: "agonglo-portuguese-priests-and-a-christian-shrine",
    title: "Agonglo, the Portuguese priests and the Christian shrine, 1796–1797",
    summary:
      "King Agonglo received two Portuguese priests and showed willingness to be baptised; he was killed in a palace conspiracy on 1 May 1797. Whether his Catholic flirtation caused his death is argued; that the palace already contained a Christian shrine among its vodun is reported by Bay.",
    description:
      "WHAT HAPPENED. Agonglo (reigned c. 1789–1797; benin-dahomey: agonglo) sent envoys to Portugal to restore a trade disrupted by the French revolutionary wars. Queen Maria I responded by sending two Catholic priests, who reached Abomey in 1796–97 and urged the king to convert as the condition of good relations. One of them, Vicente Ferreira Pires, later wrote an account of the journey. Agonglo received them and expressed willingness to be baptised. On 1 May 1797 he was killed in the palace — shot according to Akinjogbin, poisoned according to Bay — by a conspiracy that included his brother Dogan and a woman named Na Wanjile. His son Adandozan succeeded.\n\n" +
      "THE DISPUTE. That the conversion question CAUSED the killing is argued, not proved. The succession politics of the palace, the crisis in the slave trade and factional enmities all had their own momentum; Bay notes that it is unknown whether Agonglo was sincere or seeking to appease the Portuguese. What is reasonably clear is that the proposal provoked strong opposition among royal factions — unsurprising in a monarchy whose legitimacy ran through Nesuhwe, Agasu and the royal vodun.\n\n" +
      "THE CHRISTIAN VODUN. Bay (1998) reports that one of Agonglo's wives, Sophie, a Dutch-African woman formerly married to the commander of the French fort at Ouidah, had introduced a Christian shrine into the palace's pantheon. Catholicism here entered not as a replacement for vodun but AS ANOTHER VODUN — a power to be served alongside the others, which is exactly the pattern later visible in Haitian Vodou's saints and lwa.\n\n" +
      "SIGNIFICANCE. The episode marks the limit of royal religious flexibility: a king could add a Christian power to the palace, but not, it seems, put himself under the Church. It is also among the last royal religious events before the Portuguese-Brazilian world of Ouidah (de Souza, the Aguda) took shape.\n\n" +
      "THINGS TO ASK: Can a sacred king change religion without ceasing to be the thing that made him king?",
    category: "religion",
    subcategory: "Catholic contact",
    eventType: "disputed",
    eventTypeNote: "The events are documented; the causal link between the conversion question and the assassination is argued.",
    tags: vodunTags(TRACK, ["practice: catholic contact", "place: abomey"], "agonglo", "portugal", "assassination", "disputed"),
    people: ["Agonglo", "Maria I of Portugal", "Vicente Ferreira Pires", "Sophie (wife of Agonglo)", "Dogan", "Na Wanjile", "Adandozan"],
    civilisations: ["Dahomey", "Portugal"],
    locationName: "Abomey, Bénin",
    lat: 7.185,
    lng: 1.991,
    identificationStatus: "disputed",
    argumentsFor:
      "The killing followed closely on the king's public willingness to be baptised; the conspirators came from royal factions whose standing depended on the royal cults; Akinjogbin presents the conversion question as a major cause of the palace crisis.",
    argumentsAgainst:
      "Palace successions in Dahomey were violent for other reasons; the trade crisis of the 1790s had its own political effects; the sources disagree on the manner of death; and Bay notes that the sincerity of the king's interest is unknown, which makes it a weak motive to reconstruct.",
    genealogies: [
      {
        key: "agonglo-killed-for-conversion",
        claim: "Agonglo was assassinated because he intended to become a Catholic",
        verdict: "partially_attested",
        verdictEvidence:
          "The reception of the priests, the king's expressed willingness to convert, and the assassination of 1 May 1797 are all reported by the historians; the causal link is an interpretation that the sources cited here state with varying confidence.",
        whatWouldChangeThis: "Pires's narrative or Portuguese official correspondence explicitly linking the conspiracy to the conversion, or Dahomean court tradition attributing a different motive.",
        links: [
          {
            stage: "colonial_record",
            who: "Vicente Ferreira Pires",
            year: 1800,
            reference: "Viagem de África em o Reino de Dahomé (written c. 1800; published 1957)",
            saysAbsentReason: "Not read in this session.",
            adds: "The missionary's own narrative of the embassy.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "I. A. Akinjogbin",
            year: 1967,
            sourceKey: "akinjogbin_dahomey_neighbours_1967",
            saysAbsentReason: "Reported through the Wikipedia article on Agonglo, which cites it without pages.",
            adds: "Presents the conversion as provoking the conspiracy; says Na Wanjile shot the king.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Edna G. Bay",
            year: 1998,
            sourceKey: "bay_wives_leopard_1998",
            saysAbsentReason: "Reported through the Wikipedia article on Agonglo.",
            adds: "Says he was poisoned, that his sincerity is unknown, and reports Sophie's Christian shrine.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "akinjogbin_dahomey_neighbours_1967",
        citations: [
          { sourceKey: "bay_wives_leopard_1998", relation: "supports", note: "Agrees on the date and the conspiracy; differs on the manner of death." },
          { sourceKey: "wikipedia_dahomey_navigation", relation: "context", note: "Used to locate the scholarship and cross-check the date." },
        ],
        startYear: 1797,
        startMonth: 5,
        startDay: 1,
        datePrecision: "day",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The assassination of Agonglo in the palace",
        originalDateText: "1 May 1797",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. The date as given by the modern historians from Portuguese and Dahomean sources; not checked against a primary document here. NEEDS SOURCE VERIFICATION.",
      },
      {
        sourceKey: "bay_wives_leopard_1998",
        startYear: 1796,
        endYear: 1797,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Portuguese priests at Abomey and the king's willingness to convert",
        originalDateText: "Agonglo receives two Portuguese priests and expresses willingness to be baptised",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. The scholarship's dating of the mission; approximate.",
      },
    ],
    media: [pAgongloRecade, pWhydah1745],
  },
  {
    slug: "aguda-catholics-in-a-vodun-kingdom",
    title: "The Aguda: Catholic returnees from Brazil in Dahomey's ports",
    summary:
      "From the 1830s formerly enslaved Africans returning from Brazil settled at Ouidah, Agoué, Porto-Novo and Lagos. Under kings who were the patrons of Vodun, they made Catholicism the mark of their 'Brazilian' identity — baptised in the 1840s–50s by Black priests from the Portuguese fort at Ouidah.",
    description:
      "WHO THEY WERE. The AGUDA (Agudá, 'Brazilians') were returnees from Brazil — many expelled from Bahia after the Malê revolt of 1835, others freed and choosing to return — together with Brazilian and Portuguese traders such as Francisco Félix de Souza and their dependants. They settled in Dahomey's port of Ouidah and in Agoué, Porto-Novo and Lagos, and many worked in the slave and later the palm-oil trades (benin-atlantic: de-souza-and-place-chacha).\n\n" +
      "CATHOLICISM AS IDENTITY. Parés (2015) studies two mass baptisms at Agoué in 1846 and 1855, conducted by Black priests based at the Portuguese fort at Ouidah — before the French missionaries arrived in 1861 — and argues that the community took Catholicism as its key marker of identity. Guran (2000) describes the Aguda festivals that continue, including the Bonfim celebration in January, carried over from Bahia, and the burian masquerade.\n\n" +
      "IN A VODUN KINGDOM. The Aguda lived under kings whose authority rested on Vodun and who regulated religion at Ouidah. The arrangement worked: Ghezo needed de Souza; the returnees' Catholicism marked them as a trading community with Atlantic connections rather than as subjects. And the boundary was porous — some families kept vodun, and Burton notes a vodun at the English fort worshipped by Europeans' dependants.\n\n" +
      "SIGNIFICANCE. The Aguda brought the Atlantic back to Africa: people who had lived as Catholics in Brazil, and sometimes in Candomblé, resettled beside the Temple of Pythons. Their presence is why Ouidah's Catholic history begins with Africans and Brazilians, not with French missionaries — and it is part of the background to the cathedral and the python temple facing each other (benin-vodun: temple-and-basilica-face-each-other).\n\n" +
      "THINGS TO ASK: When people return to a place they were taken from, which religion do they bring home?",
    category: "religion",
    subcategory: "Catholic contact",
    eventType: "historical",
    tags: vodunTags(TRACK, ["practice: catholic contact", "place: ouidah", "place: porto-novo", "place: bahia and brazil"], "aguda", "returnees", "brazil"),
    people: ["Francisco Félix de Souza", "Ghezo"],
    civilisations: ["Aguda (Afro-Brazilian returnees)", "Dahomey"],
    locationName: "Ouidah, Agoué and Porto-Novo",
    lat: 6.363,
    lng: 2.085,
    claims: [
      {
        sourceKey: "pares_agoue_baptism_2015",
        citations: [{ sourceKey: "guran_agudas_2000", relation: "supports", note: "Describes the Aguda's Catholic identity and festivals." }],
        startYear: 1846,
        endYear: 1855,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "The mass baptisms at Agoué conducted by priests from the Portuguese fort at Ouidah",
        originalDateText: "two mass baptisms in Agoué in 1846 and 1855",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Parés's study of the baptismal records (History in Africa, 2015), of which the abstract was read in this session. The baptisms are documented events.",
      },
    ],
    media: [pDeSouzaHouse, pDeSouza, pKahnCathedral],
  },
  {
    slug: "borghero-meets-glele-1861",
    title: "1861: Francesco Borghero at the court of Glele",
    summary:
      "In April 1861 Francesco Borghero of the Société des Missions Africaines landed at Ouidah and went up to Abomey, where King Glele received him on condition-bound terms but did not allow him to evangelise Dahomeans. The mission settled among the Aguda and Europeans of the coast.",
    description:
      "THE MISSION. The Société des Missions Africaines (SMA), founded at Lyon in 1856, sent Francesco Borghero and Francisco Fernandez to Dahomey; they landed at Ouidah in April 1861 (sources give the 16th or the 18th). Borghero then travelled to Abomey to seek the king's permission. His journal (edited 1997) is the principal source.\n\n" +
      "THE AUDIENCE. Borghero set conditions in advance: he would not be required to perform acts contrary to his faith and would attend no ceremony involving human sacrifice. Glele accepted, received him at Abomey and escorted him from the palace, but did not give permission to convert Dahomeans. The mission was confined in practice to Ouidah's Europeans, Aguda and dependants, and to building its station near the Portuguese fort.\n\n" +
      "WHY GLELE SAID YES AND NO. A Catholic presence at Ouidah was useful — Europeans and Aguda already practised, and a mission brought schools and diplomatic contact with France. Conversion of the king's subjects was another matter in a kingdom where royal authority, the Customs and the royal dead were bound to the vodun. Glele's answer is the same one Allada's king gave the Capuchins in 1660–61 and the one Agonglo's killers enforced in 1797.\n\n" +
      "WHAT FOLLOWED. The mission grew under colonial rule after 1894; the first Dahomean priest was ordained in 1929; the cathedral of Ouidah was built opposite the python temple. These later developments belong to the modern track.\n\n" +
      "SIGNIFICANCE. Borghero's audience is the last formal encounter between the Church and an independent Vodun monarchy on this coast. It shows the monarchy, at the height of its ceremonial power, setting the terms on which Christianity could exist in its territory.\n\n" +
      "THINGS TO ASK: Why might a king welcome missionaries he forbids to make converts?",
    category: "religion",
    subcategory: "Catholic contact",
    eventType: "historical",
    tags: vodunTags(TRACK, ["practice: catholic contact", "place: ouidah", "place: abomey"], "missions", "sma", "glele"),
    people: ["Francesco Borghero", "Francisco Fernandez", "Glele"],
    civilisations: ["Dahomey", "Société des Missions Africaines"],
    locationName: "Ouidah and Abomey, Bénin",
    lat: 6.363,
    lng: 2.085,
    claims: [
      {
        sourceKey: "borghero_journal_1997",
        citations: [{ sourceKey: "law_ouidah_2004", relation: "context", note: "The Catholic mission's place in Ouidah's history." }],
        startYear: 1861,
        startMonth: 4,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Borghero's landing at Ouidah",
        originalDateText: "April 1861 (16 or 18 April in different accounts)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Borghero's own journal, as reported by mission histories found in search; the day differs between accounts and the journal was not read here. NEEDS SOURCE VERIFICATION for the day.",
      },
    ],
    media: [pMissionnaire1930, pKahnKiti],
  },
  {
    slug: "burton-catalogues-the-dahoman-religion-1864",
    title: "1864: Burton catalogues 'the Dahoman religion'",
    summary:
      "Richard Burton's 'Of the Dahoman Religion' (1864) is the fullest European catalogue of the kingdom's vodun before its fall: Mau and Lisa, Bosman's three orders, Hu and the Hu-no, Agasun, Li, Nesu, Sapatan and a score more. Invaluable as a record, it also made a list into a 'pantheon'.",
    description:
      "WHAT IT CONTAINS. Burton, British consul at Fernando Po, spent three months at Glele's court in 1863–64. His chapter 'Of the Dahoman Religion' (vol. 2, pp. 135–150) gives: Mau, the deity, whose name Catholic missionaries borrowed (calling themselves 'Mau-no'), and Lisa, 'the fetish representative of the sun'; Bosman's three orders of Whydah gods; Hu and the Hu-no; then a numbered list including 'Sapatan, or small pox', 'Kpo, the leopard — a royal fetish', 'Aizan', 'Agasun', 'Li' of Whydah, 'Lisa, the fetish of Khwezioso', 'Dohen' worshipped at the English fort, and 'Nesu, the proper Ffon fetish of Agbome, established by Agaja the Conqueror'.\n\n" +
      "WHAT MAKES IT VALUABLE. Statements found nowhere earlier: the Nesu attribution to Agaja, the Agasunon's precedence, the Hu-no as 'highest of all', the king's sea sacrifices, Li as Whydah's pre-conquest town god. Many name a cult, a place and an office together, which lets them be checked against later ethnography.\n\n" +
      "WHAT MAKES IT DANGEROUS. Burton numbered what he was told into a list, and lists become pantheons. He mixed what informants said with what he guessed (Agasun as 'the old Makhi fetish'), and he framed everything in his own comparative speculation — 'Sabaeanism', Yggdrasil, Hindu deities, the suggestion that a Yoruba high god might derive from Christians fleeing the Vandals. Skertchly, ten years later, corrected him on precedence. Herskovits's 1938 systematisation inherits the habit (benin-vodun: not-one-theology).\n\n" +
      "SIGNIFICANCE. Burton's chapter is the document most later summaries of 'Fon religion' ultimately rest on, directly or through Herskovits; reading it as a catalogue made by a prejudiced consul from interpreters' answers is the first step to reading those summaries critically.\n\n" +
      "THINGS TO ASK: When someone counts your gods for you, whose arithmetic is it?",
    category: "religion",
    subcategory: "European descriptions",
    eventType: "historical",
    tags: vodunTags(TRACK, ["deity: mawu-lisa", "deity: sakpata", "deity: heviosso", "practice: initiation and priesthood", "place: abomey"], "burton", "european-accounts", "pantheon"),
    people: ["Richard F. Burton", "Glele"],
    civilisations: ["Dahomey", "Fon"],
    locationName: "Abomey, Bénin",
    lat: 7.185,
    lng: 1.991,
    claims: [
      {
        sourceKey: "burton_mission_gelele_1864",
        citations: [
          { sourceKey: "skertchly_dahomey_1874", relation: "disputes", note: "Corrects Burton on the rank of the chief priest." },
          { sourceKey: "herskovits_dahomey_1938", relation: "context", note: "The later systematisation that inherits Burton's catalogue habit." },
        ],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The publication of Burton's catalogue of Dahomean vodun",
        originalDateText: "Of the Dahoman Religion (A Mission to Gelele, 1864, vol. 2)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Read in this session. Dates a European compilation from interpreters' information gathered in 1863–64.",
      },
    ],
    media: [pFetishDance1863, pGhezo1863],
  },
  {
    slug: "european-accounts-of-hueda-copied-each-other",
    title: "One witness or four? How European accounts of Hueda religion copied each other",
    summary:
      "Barbot's account of the English killed for killing a snake follows Bosman almost line by line; Burton opens his survey of Whydah's gods by paraphrasing Bosman; Astley's 1745 collection merged everyone. Agreement between European sources on Hueda often means dependence, not confirmation.",
    description:
      "THE EVIDENCE OF COPYING. Bosman (1705): 'when the English first began to Trade here ... An English Captain being landed, some of his Men and part of his Cargo, they found a Snake in their House, which they immediately killed ... threw out the dead Snake at their Door ... the English preventing the Question who had done the Fact, ascribed the Honour to themselves', and were all killed. Barbot (printed 1732): 'At first settling of the English at Fida, a captain of that nation, having landed and housed his cargo, or part of it, his men found one night a snake in their lodge, which they immediately killed, and threw it out at their door ... the English very innocently telling them, without being ask'd who had killed it' — the same story, sequence and detail. Barbot's three-order scheme also follows Bosman's. Burton (1864): 'In the days of Bosman (1700) the little kingdom of Whydah adored three orders of gods', followed by Bosman's scheme quoted. Thomas Astley's New General Collection (1745–47) combined Bosman, Barbot, Snelgrave, Atkins and Labat into a single composite account.\n\n" +
      "WHY IT HAPPENED. Eighteenth-century travel writing was a market; editors expanded manuscripts with published material; Barbot's text was revised for publication over decades after his voyages; and later travellers read their predecessors before they went, so they saw what they expected.\n\n" +
      "WHAT SURVIVES THE TEST. Observations with a specific witness, date and circumstance and no earlier model: Phillips's crocodile pond (1694); Bosman's own dated hog incident (1697); Atkins's 1721 high priest; Des Marchais's 1725 coronation procession; Snelgrave's 1727 soldiers. These are the backbone of this track.\n\n" +
      "SIGNIFICANCE. Most of what is 'known' about Vodun before 1727 comes from a handful of Europeans. Knowing which statements are independent and which are echoes is the difference between evidence and repetition — the same critical method Law (1991) applies, and the reason this track quotes each witness separately.\n\n" +
      "THINGS TO ASK: How many sources does a fact need, if they all read the same book?",
    category: "religion",
    subcategory: "European descriptions",
    eventType: "historical",
    tags: vodunTags(TRACK, ["practice: serpent veneration", "deity: dan and aido-hwedo", "place: ouidah"], "source-criticism", "european-accounts", "bosman", "barbot"),
    people: ["Willem Bosman", "John Barbot", "Richard F. Burton", "Thomas Astley"],
    civilisations: ["Hueda"],
    locationName: "Whydah (Ouidah), Bénin",
    lat: 6.363,
    lng: 2.085,
    claims: [
      {
        sourceKey: "barbot_description_1732",
        citations: [
          { sourceKey: "bosman_guinea_1705", relation: "context", note: "The earlier printed text that Barbot's story follows." },
          { sourceKey: "law_slave_coast_1991", relation: "supports", note: "Applies source criticism to the European accounts of the Slave Coast." },
        ],
        startYear: 1732,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The printing of Barbot's version of Bosman's story",
        originalDateText: "At first settling of the English at Fida, a captain of that nation",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The two passages were compared in this session (Bosman, pp. 376–377; Barbot, p. 341). The dependence is inferred from the parallel wording; Barbot's manuscript history makes the direction of borrowing probable but not certain.",
      },
    ],
    media: [pWhydah1745, pPlanPalaisSabi],
  },
  {
    slug: "hueda-serpents-egypt-and-israel-speculation",
    title: "Hueda's serpents from Egypt or Israel? An eighteenth-century European speculation",
    summary:
      "In 1735 John Atkins speculated that Whydah's snake-worship might descend from 'the old Serpent' of Genesis or Moses's serpent, or be like the Egyptians' animal cults. It is the earliest such derivation idea attached to Vodun found here; it rested on resemblance alone and no evidence for transmission has been produced since.",
    description:
      "THE SPECULATION. Atkins, after describing the snake-worship he heard of at Whydah in 1721, asks 'whether or no it's too foreign to imagine, some traditional Story might be derived from them concerning the old Serpent, the Deceiver of Mankind? or that fiery one lifted up by Moses in the Wilderness'. He cites a geographer's claim that 'the Mosaical Law was once introduced into some parts of Negro-land' and notes circumcision. Then: 'Others think this Snake-Worship might be taken up as of old the Egyptians did their Ox and Cow, their Crocodile and Cat' — the Egyptians revering useful animals, as the Whydah snakes 'are said to kill the black and poisonous sort, and to destroy various Species of Vermin'. Burton (1864) continued the habit, comparing Vodun to 'Sabaeanism', Yggdrasil and Hindu deities.\n\n" +
      "WHAT IT IS. Not a theory with evidence but a reflex of eighteenth-century learning, which explained unfamiliar religions by deriving them from biblical or classical antiquity. Atkins himself offers the Egyptian parallel as an ANALOGY (both peoples honoured useful animals) as much as a derivation, and ends by saying that reverence for creatures is common everywhere, Europe included.\n\n" +
      "THE STATE OF THE EVIDENCE. No archaeological, linguistic or documentary evidence links Hueda serpent veneration to ancient Egypt or Israel. Serpent symbolism is extremely widespread and arises independently (the serpent-is-not-one-symbol record). The Egyptian serpent best known — Apep, enemy of the sun, speared by Set — is a destructive power, the opposite of a protective household python. Modern claims of Egyptian origins for Vodun repeat the structure of Atkins's reasoning, resemblance in place of transmission (benin-vodun: resemblance-is-not-descent).\n\n" +
      "SIGNIFICANCE. Showing where an idea came from is the best way to evaluate it. The 'Egyptian Vodun' idea is not ancient knowledge resurfacing; its earliest form here is a ship's surgeon's armchair conjecture of 1735, born of a European need to fit Africa into biblical history.\n\n" +
      "THINGS TO ASK: Why did Europeans need African religions to have come from somewhere else?",
    category: "religion",
    subcategory: "Derivation theories",
    eventType: "alternative",
    eventTypeNote: "An attributed eighteenth-century speculation about origins, recorded with its history and the evidence against it; not a scholarly position.",
    tags: vodunTags(TRACK, ["practice: serpent veneration", "deity: dan and aido-hwedo", "place: ouidah"], "derivation-theory", "egypt", "atkins", "comparison-history"),
    people: ["John Atkins", "Richard F. Burton"],
    civilisations: ["Hueda", "Ancient Egypt (as invoked)", "Ancient Israel (as invoked)"],
    locationName: "Whydah (Ouidah), Bénin",
    lat: 6.363,
    lng: 2.085,
    identificationStatus: "rejected",
    argumentsFor:
      "Atkins's reasoning: serpents feature in biblical narratives (the serpent of Eden, Moses's brazen serpent); circumcision and other customs suggested to some writers an ancient Mosaic influence in West Africa; Egyptians revered useful animals as Hueda revered snakes that killed vermin and venomous snakes. Modern proponents of Egyptian derivations add the general prominence of serpents in Egyptian religion.",
    argumentsAgainst:
      "No evidence of transmission exists — no Egyptian or Hebrew loanwords in the cult vocabulary, no intermediate archaeological trail, no documentary link. Serpent veneration arises independently worldwide. Egypt's chief serpent Apep is a chaos power, unlike Dangbe. Atkins himself concedes the parallel may be mere 'Reverence to many Creatures' common to all peoples. The idea arose from the European habit of deriving all religions from biblical antiquity.",
    genealogies: [
      {
        key: "vodun-serpent-from-egypt-or-israel",
        claim: "The serpent cult of Whydah derives from ancient Egyptian or Israelite religion",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "The earliest occurrence found is Atkins's 1735 speculation, which offers resemblance and a citation of another writer's conjecture, not evidence. No later source supplies evidence for transmission.",
        whatWouldChangeThis: "Linguistic, archaeological or documentary evidence of a historical connection between the Nile valley or the Levant and the Slave Coast cults — none has been produced.",
        links: [
          {
            stage: "colonial_record",
            who: "John Atkins",
            year: 1735,
            sourceKey: "atkins_voyage_1735",
            reference: "pp. 115–117",
            says: "Others think this Snake-Worship might be taken up as of old the Egyptians did their Ox and Cow, their Crocodile and Cat",
            adds: "Proposes biblical and Egyptian parallels as possible origins, on resemblance alone.",
            citationStatus: "verified",
          },
          {
            stage: "colonial_record",
            who: "Richard F. Burton",
            year: 1864,
            sourceKey: "burton_mission_gelele_1864",
            reference: "vol. 2, pp. 135–141",
            says: "Mau is the moon, a distinct trace of Sabaeanism",
            adds: "Extends the comparative habit to Mawu and to tree and serpent cults generally.",
            citationStatus: "verified",
          },
          {
            stage: "current_scholarship",
            who: "Robin Law",
            year: 1991,
            sourceKey: "law_slave_coast_1991",
            saysAbsentReason: "Law treats the cult historically and does not engage the derivation idea; cited for the absence of any such evidence in the documentary record.",
            adds: "Places Hueda religion in its regional and political history.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "atkins_voyage_1735",
        citations: [{ sourceKey: "burton_mission_gelele_1864", relation: "context", note: "Continues the comparative-derivation habit in 1864." }],
        startYear: 1735,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest printed speculation found linking Whydah's serpent cult to Egypt or Israel",
        originalDateText: "some traditional Story might be derived from them concerning the old Serpent",
        datingMethod: "historical_record",
        chronology: "alternative",
        evidence:
          "EVIDENCE TYPE: contemporary written. Dates the publication of a speculation (Atkins, pp. 115–117, read in this session). It is evidence of an eighteenth-century European idea, not of any ancient connection.",
      },
    ],
    media: [pGramberg1861, pTemple1900],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const A = VODUN_DIASPORA_ANCHORS;

const links: SeedEventLink[] = [
  // ---- inside the track ------------------------------------------------------
  { from: ANCHOR, to: "agasu-the-leopard-ancestor-and-his-priest", relation: "associated", note: "Agasu is the dynasty's own cult, the heart of royal religion in Allada and Dahomey." },
  { from: ANCHOR, to: "hueda-serpent-priesthood-and-the-king", relation: "associated", note: "Hueda shows the opposite balance: a priesthood able to pressure the king." },
  { from: ANCHOR, to: "kings-priests-and-the-control-of-vodun", relation: "associated", note: "The Dahomean pattern of royal control is the anchor's central case." },
  { from: ANCHOR, to: "dahomey-takes-dangbe-under-protection", relation: "associated", note: "The serpent's survival under Dahomey is the best-known example of conquest reshaping religion." },
  { from: ANCHOR, to: "nesuhwe-cult-of-the-royal-dead", relation: "associated", note: "The cult of the royal dead is the dynasty's religion of itself." },
  { from: ANCHOR, to: "european-accounts-of-hueda-copied-each-other", relation: "relevant", note: "Explains how far the European eyewitnesses on which this track rests can be trusted." },
  { from: "agasu-the-leopard-ancestor-and-his-priest", to: "leopard-of-dahomey-snake-of-whydah", relation: "evidence_for", note: "Agasu's descent explains why Europeans called the leopard Dahomey's fetish." },
  { from: "agasu-the-leopard-ancestor-and-his-priest", to: "allada-as-dahomeys-ritual-centre", relation: "related", note: "Agasu's line came through Allada, which kept a ritual role after its conquest." },
  { from: "agasu-the-leopard-ancestor-and-his-priest", to: "hu-the-sea-and-the-hunon-of-ouidah", relation: "related", note: "Burton makes the Agasunon at Abomey the counterpart of the Hu-no at Ouidah." },
  { from: "allada-religion-in-phillips-1694", to: "allada-as-dahomeys-ritual-centre", relation: "precedes", note: "Allada's royal cult before the conquest, then its ritual role after it." },
  { from: "capuchin-mission-to-allada-1660", to: "allada-religion-in-phillips-1694", relation: "precedes", note: "Two of the few windows on Allada's religion before 1724." },
  { from: "capuchin-mission-to-allada-1660", to: "agonglo-portuguese-priests-and-a-christian-shrine", relation: "related", note: "Two kings who entertained Catholic missionaries without abandoning royal vodun." },
  { from: "agonglo-portuguese-priests-and-a-christian-shrine", to: "borghero-meets-glele-1861", relation: "precedes", note: "Glele's terms for the 1861 mission echo the limits Agonglo's killers enforced." },
  { from: "hueda-snake-trees-and-sea", to: "hu-the-sea-and-the-hunon-of-ouidah", relation: "associated", note: "The sea, Hueda's third god, became Ouidah's leading cult under Dahomey." },
  { from: "hueda-snake-trees-and-sea", to: "kpasse-forest-ouidah", relation: "related", note: "The founder who became a tree joins two of the three orders of Hueda gods." },
  { from: "hueda-snake-trees-and-sea", to: "european-accounts-of-hueda-copied-each-other", relation: "related", note: "The three-order scheme is one of the passages Barbot and Burton took from Bosman." },
  { from: "hueda-serpent-priesthood-and-the-king", to: "hueda-hog-slaughter-1697", relation: "evidence_for", note: "The hog decree shows a king acting on the priests' demand." },
  { from: "hueda-serpent-priesthood-and-the-king", to: "kings-priests-and-the-control-of-vodun", relation: "related", note: "Hueda's strong priesthood is the contrast for Dahomey's royal control." },
  { from: "how-the-serpent-came-to-hueda", to: "hueda-coronation-and-serpent-processions-1725", relation: "related", note: "Labat's origin story and his account of the coronation processions come from the same 1725 information." },
  { from: "hueda-coronation-and-serpent-processions-1725", to: "dahomey-soldiers-and-the-pythons-1727", relation: "precedes", note: "Two years after the coronation procession, Dahomey's soldiers killed the serpents of Savi." },
  { from: "dangbe-wives-in-european-accounts", to: "hueda-serpent-priesthood-and-the-king", relation: "related", note: "The serpent's women were part of the priesthood's establishment and revenues." },
  { from: "hueda-hog-slaughter-1697", to: "killing-a-python-from-death-to-ordeal", relation: "related", note: "Both show the serpent's protection enforced by law." },
  { from: "dahomey-soldiers-and-the-pythons-1727", to: "dahomey-takes-dangbe-under-protection", relation: "precedes", note: "Desecration at the conquest, then protection under Dahomean rule." },
  { from: "dahomey-takes-dangbe-under-protection", to: "killing-a-python-from-death-to-ordeal", relation: "evidence_for", note: "The python penalty enforced under Dahomey shows the serpent protected by the conqueror." },
  { from: "dahomey-takes-dangbe-under-protection", to: "hu-the-sea-and-the-hunon-of-ouidah", relation: "related", note: "Hu, like Dangbe, survived the conquest and prospered under it." },
  { from: "leopard-of-dahomey-snake-of-whydah", to: "dahomey-takes-dangbe-under-protection", relation: "related", note: "The formula records the two-tier landscape the conquest created." },
  { from: "nesuhwe-cult-of-the-royal-dead", to: "zomadonu-and-the-royal-tohossou", relation: "associated", note: "Both are cults of the royal family's own members." },
  { from: "zomadonu-and-the-royal-tohossou", to: "na-agontime-and-the-casa-das-minas", relation: "related", note: "The Casa das Minas is consecrated to Zomadonu; who founded it is the Agontimé question." },
  { from: "hwanjile-and-the-installation-of-mawu-lisa", to: "kings-priests-and-the-control-of-vodun", relation: "evidence_for", note: "If the tradition holds, it is the clearest case of the court reorganising a pantheon." },
  { from: "hwanjile-and-the-installation-of-mawu-lisa", to: "agonglo-portuguese-priests-and-a-christian-shrine", relation: "related", note: "A Na Wanjile is named among Agonglo's killers, showing the title continuing." },
  { from: "hwanjile-and-the-installation-of-mawu-lisa", to: "burton-catalogues-the-dahoman-religion-1864", relation: "related", note: "Burton names Mau and Lisa and an Ahwanjile, but does not connect them." },
  { from: "agonglo-portuguese-priests-and-a-christian-shrine", to: "na-agontime-and-the-casa-das-minas", relation: "related", note: "Agontimé was Agonglo's wife; her sale followed his death and Adandozan's accession." },
  { from: "killing-a-python-from-death-to-ordeal", to: "aguda-catholics-in-a-vodun-kingdom", relation: "related", note: "De Souza, patron of the Brazilian community, is credited with softening the python penalty." },
  { from: "aguda-catholics-in-a-vodun-kingdom", to: "borghero-meets-glele-1861", relation: "precedes", note: "Black priests from the Portuguese fort baptised Aguda before the French mission arrived." },
  { from: "burton-catalogues-the-dahoman-religion-1864", to: "european-accounts-of-hueda-copied-each-other", relation: "related", note: "Burton's survey begins by paraphrasing Bosman." },
  { from: "hueda-serpents-egypt-and-israel-speculation", to: "european-accounts-of-hueda-copied-each-other", relation: "related", note: "Both concern how European writers shaped what was said about Hueda's serpent." },
  { from: "hueda-serpents-egypt-and-israel-speculation", to: "how-the-serpent-came-to-hueda", relation: "responds_to", note: "European derivation speculations set beside the Hueda's own origin stories for the cult." },

  // ---- to the other five tracks' anchors ---------------------------------------
  { from: ANCHOR, to: A.africa, relation: "related", note: "The royal cults are one part of the wider West African Vodun the africa track reconstructs." },
  { from: ANCHOR, to: A.atlantic, relation: "precedes", note: "Captives of the Dahomean wars carried the religion of these kingdoms across the Atlantic." },
  { from: "allada-as-dahomeys-ritual-centre", to: A.haiti, relation: "relevant", note: "Allada's name survives as 'Rada' in Haitian Vodou, and Toussaint Louverture's family claimed Allada descent." },
  { from: "dangbe-wives-in-european-accounts", to: A.haiti, relation: "relevant", note: "The vodunsi, 'wives of the vodun', belong to the same family of terms as Haiti's ounsi." },
  { from: "agonglo-portuguese-priests-and-a-christian-shrine", to: A.haiti, relation: "relevant", note: "A Christian shrine served among vodun prefigures the saints beside the lwa in Saint-Domingue." },
  { from: "dangbe-wives-in-european-accounts", to: A.americas, relation: "relevant", note: "Serpent devotion and its devotees are among the threads Louisiana Voodoo's Li Grand Zombi stories are compared with." },
  { from: "dahomey-takes-dangbe-under-protection", to: A.modern, relation: "relevant", note: "The serpent of Ouidah that Dahomey protected is today's most visited Vodun site." },
  { from: "hu-the-sea-and-the-hunon-of-ouidah", to: A.modern, relation: "relevant", note: "The Daagbo Hounon presides over Vodun's national day in modern Bénin." },
  { from: "zomadonu-and-the-royal-tohossou", to: A.atlantic, relation: "relevant", note: "Zomadonu is a royal vodun known by name on both sides of the Atlantic." },

  // ---- into the Bénin datasets -------------------------------------------------
  { from: ANCHOR, to: "conquest-absorbs-cults", relation: "related", note: "This track documents in detail the absorption of conquered cults that benin-vodun states in outline." },
  { from: ANCHOR, to: "dahomey-foundation-question", relation: "related", note: "The political history of the kingdom whose religion this track follows begins with this question." },
  { from: ANCHOR, to: "hueda-kingdom-and-savi", relation: "related", note: "The Hueda kingdom whose serpent cult is central here." },
  { from: ANCHOR, to: "not-one-theology", relation: "relevant", note: "Royal reorganisation of the vodun is one reason there is no single theology." },
  { from: "agasu-the-leopard-ancestor-and-his-priest", to: "aja-and-the-tado-tradition", relation: "related", note: "Agasu's birth belongs to the Tado tradition of origin." },
  { from: "agasu-the-leopard-ancestor-and-his-priest", to: "king-as-his-animal", relation: "related", note: "The leopard as dynastic ancestor underlies the identification of kings with animals." },
  { from: "agasu-the-leopard-ancestor-and-his-priest", to: "dahomey-foundation-question", relation: "relevant", note: "Burton's 'old Makhi fetish' version bears on who held Abomey before the dynasty." },
  { from: "leopard-of-dahomey-snake-of-whydah", to: "royal-emblems-system", relation: "related", note: "The leopard is the shared emblem behind each king's personal one." },
  { from: "allada-as-dahomeys-ritual-centre", to: "three-brothers-tradition-allada-abomey-hogbonu", relation: "related", note: "The tradition that makes Abomey's founder an Allada prince explains Allada's ritual seniority." },
  { from: "allada-as-dahomeys-ritual-centre", to: "kpengla", relation: "related", note: "Dalzel's ritual mission to Allada took place in Kpengla's reign." },
  { from: "allada-as-dahomeys-ritual-centre", to: "agaja", relation: "related", note: "Agaja conquered Allada in 1724." },
  { from: "allada-religion-in-phillips-1694", to: "allada-in-portuguese-records-1539", relation: "related", note: "Phillips adds a religious detail to the documentary record of Allada that begins in 1539." },
  { from: "capuchin-mission-to-allada-1660", to: "vodu-first-written-1658", relation: "responds_to", note: "The 1658 catechism that records vodu was made for this mission." },
  { from: "capuchin-mission-to-allada-1660", to: "arada-people-in-the-americas-1560s", relation: "related", note: "Allada's connections with the Spanish Atlantic precede the mission by a century." },
  { from: "hueda-snake-trees-and-sea", to: "bosman-describes-the-serpent-at-whydah", relation: "responds_to", note: "Extends the benin-vodun Bosman record to the trees and the sea and to the later writers who copied him." },
  { from: "hueda-serpent-priesthood-and-the-king", to: "bosman-describes-the-serpent-at-whydah", relation: "related", note: "Bosman's priests of 'great authority' beside Atkins's high priest equal to the king." },
  { from: "hueda-serpent-priesthood-and-the-king", to: "savi-excavated", relation: "related", note: "Savi, where the king and the serpent's priests dealt with each other, has been excavated." },
  { from: "how-the-serpent-came-to-hueda", to: "temple-of-pythons-1717-tradition", relation: "responds_to", note: "Sets the 1717 tradition beside two earlier recorded origin stories." },
  { from: "how-the-serpent-came-to-hueda", to: "dan-the-serpent", relation: "related", note: "The serpent power whose Hueda cult the stories explain." },
  { from: "hueda-coronation-and-serpent-processions-1725", to: "bosman-describes-the-serpent-at-whydah", relation: "responds_to", note: "Labat's processions update Bosman's account of royal pilgrimages to the serpent." },
  { from: "hueda-coronation-and-serpent-processions-1725", to: "kpojito-and-the-palace-women", relation: "relevant", note: "The king's mother presiding at the procession prefigures the kpojito's religious role." },
  { from: "dangbe-wives-in-european-accounts", to: "initiation-and-restricted-knowledge", relation: "related", note: "The serpent's 'wives' were initiates in seclusion and training." },
  { from: "dangbe-wives-in-european-accounts", to: "possession-and-trance", relation: "relevant", note: "Bosman's women made 'distracted' by the snake describe possession through hostile eyes." },
  { from: "hueda-hog-slaughter-1697", to: "bosman-describes-the-serpent-at-whydah", relation: "related", note: "A dated incident from the same letter of Bosman's that benin-vodun summarises." },
  { from: "killing-a-python-from-death-to-ordeal", to: "de-souza-and-place-chacha", relation: "related", note: "Forbes credits de Souza with abolishing the death penalty for killing a python." },
  { from: "killing-a-python-from-death-to-ordeal", to: "temple-of-pythons-today", relation: "precedes", note: "The serpents protected by these penalties are the pythons of today's temple." },
  { from: "killing-a-python-from-death-to-ordeal", to: "ghezo", relation: "relevant", note: "Skertchly places the death penalty in Ghezo's reign, against Forbes." },
  { from: "dahomey-soldiers-and-the-pythons-1727", to: "agaja", relation: "related", note: "Agaja's army took Savi in 1727." },
  { from: "dahomey-soldiers-and-the-pythons-1727", to: "conquest-absorbs-cults", relation: "responds_to", note: "Shows that absorption followed an initial desecration, not a peaceful takeover." },
  { from: "dahomey-soldiers-and-the-pythons-1727", to: "hueda-kingdom-and-savi", relation: "part_of", note: "The killing of the snakes belongs to the destruction of Hueda in 1727." },
  { from: "dahomey-takes-dangbe-under-protection", to: "conquest-absorbs-cults", relation: "evidence_for", note: "Supplies the eyewitness evidence (Burton, Skertchly) that benin-vodun's record lacked." },
  { from: "dahomey-takes-dangbe-under-protection", to: "tegbesu", relation: "relevant", note: "The reign usually credited with organising Dahomey's relations with conquered cults." },
  { from: "hu-the-sea-and-the-hunon-of-ouidah", to: "ouidah-one-landscape-many-worlds", relation: "related", note: "The beach where the sea-priest made offerings is the beach of the slave trade." },
  { from: "hu-the-sea-and-the-hunon-of-ouidah", to: "vodun-days-and-unesco-status", relation: "related", note: "The Daagbo Hounon presides at the national Vodun days." },
  { from: "kpasse-forest-ouidah", to: "hueda-kingdom-and-savi", relation: "related", note: "Kpassè is remembered as a Hueda founder of Ouidah." },
  { from: "kpasse-forest-ouidah", to: "oral-tradition-is-evidence-but-not-a-transcript", relation: "relevant", note: "A founding tradition to be read as evidence of memory, not of events." },
  { from: "nesuhwe-cult-of-the-royal-dead", to: "annual-customs-xwetanu", relation: "related", note: "The Customs' service of the royal dead is the public face of the Nesuhwe cult." },
  { from: "nesuhwe-cult-of-the-royal-dead", to: "grand-customs-royal-funerals", relation: "related", note: "A king's funeral made him one of the royal dead the cult served." },
  { from: "nesuhwe-cult-of-the-royal-dead", to: "ancestors-in-vodun", relation: "child_of", note: "The royal cult is the dynasty's form of ancestral practice." },
  { from: "nesuhwe-cult-of-the-royal-dead", to: "human-sacrifice-what-is-documented", relation: "relevant", note: "Sacrifices at the Customs were largely offered to the royal dead." },
  { from: "zomadonu-and-the-royal-tohossou", to: "toxosu-and-twins", relation: "child_of", note: "The royal toxosu are the court's form of the toxosu tradition." },
  { from: "zomadonu-and-the-royal-tohossou", to: "vodun-across-the-atlantic", relation: "related", note: "Zomadonu's house in São Luís is one of the clearest transatlantic continuities." },
  { from: "hwanjile-and-the-installation-of-mawu-lisa", to: "mawu-lisa", relation: "responds_to", note: "Gives the creator pair's place at the head of the pantheon a political history." },
  { from: "hwanjile-and-the-installation-of-mawu-lisa", to: "kpojito-and-the-palace-women", relation: "related", note: "Hwanjile is the most celebrated holder of the kpojito office." },
  { from: "hwanjile-and-the-installation-of-mawu-lisa", to: "tegbesu", relation: "related", note: "The tradition places the reform in Tegbesu's reign." },
  { from: "hwanjile-and-the-installation-of-mawu-lisa", to: "fa-divination", relation: "relevant", note: "Hwanjile is also credited with encouraging Fa divination." },
  { from: "kings-priests-and-the-control-of-vodun", to: "vodun-under-colonial-rule", relation: "precedes", note: "The fall of the monarchy removed the royal patron and regulator of Vodun." },
  { from: "kings-priests-and-the-control-of-vodun", to: "agaja", relation: "relevant", note: "Dalzel's account of Agaja rationing captives between priests and ships." },
  { from: "agonglo-portuguese-priests-and-a-christian-shrine", to: "agonglo", relation: "responds_to", note: "Adds the religious dimension and the dispute over his assassination." },
  { from: "agonglo-portuguese-priests-and-a-christian-shrine", to: "portuguese-fort-until-1961", relation: "related", note: "The Portuguese connection at Ouidah behind the 1796–97 mission." },
  { from: "aguda-catholics-in-a-vodun-kingdom", to: "de-souza-and-place-chacha", relation: "related", note: "De Souza was the patron of the Brazilian community at Ouidah." },
  { from: "aguda-catholics-in-a-vodun-kingdom", to: "temple-and-basilica-face-each-other", relation: "precedes", note: "Ouidah's Catholic history begins with the Aguda and the fort's priests." },
  { from: "borghero-meets-glele-1861", to: "glele", relation: "related", note: "Glele received the first SMA missionary in 1861." },
  { from: "borghero-meets-glele-1861", to: "temple-and-basilica-face-each-other", relation: "precedes", note: "The mission founded in 1861 built the church that faces the python temple." },
  { from: "burton-catalogues-the-dahoman-religion-1864", to: "not-one-theology", relation: "responds_to", note: "Burton's numbered list is one source of the tidy 'pantheon' that record warns against." },
  { from: "burton-catalogues-the-dahoman-religion-1864", to: "glele", relation: "related", note: "Burton's catalogue was compiled at Glele's court." },
  { from: "burton-catalogues-the-dahoman-religion-1864", to: "sakpata", relation: "related", note: "Burton lists 'Sapatan, or small pox' among the vodun of Dahomey." },
  { from: "european-accounts-of-hueda-copied-each-other", to: "bosman-describes-the-serpent-at-whydah", relation: "responds_to", note: "Shows which later accounts depend on Bosman's." },
  { from: "european-accounts-of-hueda-copied-each-other", to: "european-forts-at-ouidah", relation: "relevant", note: "The writers were traders and officers based at or visiting the forts." },
  { from: "hueda-serpents-egypt-and-israel-speculation", to: "resemblance-is-not-descent", relation: "responds_to", note: "The earliest derivation idea found, judged by the standard that record sets." },

  // ---- to other existing records ---------------------------------------------
  { from: "hueda-serpents-egypt-and-israel-speculation", to: "serpent-is-not-one-symbol", relation: "relevant", note: "Serpent symbolism arises independently in many cultures; resemblance is not transmission." },
  { from: "hueda-serpents-egypt-and-israel-speculation", to: "set-spears-apep", relation: "relevant", note: "Egypt's best-known serpent, Apep, is a chaos power, unlike Hueda's protective python." },
  { from: "how-the-serpent-came-to-hueda", to: "okomilo-python-comparison", relation: "relevant", note: "Another West African royal python tradition whose historical connections are examined case by case." },
];

export const KINGDOMS: VodunSection = {
  track: TRACK,
  sources,
  events,
  links,
};
