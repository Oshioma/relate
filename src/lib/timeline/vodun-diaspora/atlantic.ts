// TRACK C — THE ATLANTIC CROSSING: VODUN CARRIED AND REMADE.
// See VODUN_DIASPORA_TRACKS.atlantic in ./shared.ts.
//
// WHAT THIS SECTION IS ABOUT. The forced transportation of people from the
// Bight of Benin — the "Slave Coast" of European maps — and what religious
// knowledge could and could not travel with them: the ports at both ends, the
// "nation" names that are the best documentary thread back to this coast, the
// institutions in which people rebuilt religious life under slavery (cabildos,
// brotherhoods, calundus, terreiros), the law and the Inquisition that pressed
// on them, the historians' long argument about "survivals", and the return
// traffic from Brazil to the Bight of Benin.
//
// WHAT IT DOES NOT REPEAT. benin-atlantic already holds Ouidah's forts, the
// chacha de Souza, suppression and the Route des Esclaves; benin-vodun holds
// "Across the Atlantic: Haiti, Brazil, Cuba" and "Legba and Papa Legba";
// benin-deep-past holds the 1560s Arada record. These records link to them and
// go further rather than restating them.
//
// HOW THIS SECTION WAS RESEARCHED (October 2026). Bibliographic details,
// abstracts and catalogue records were checked through web search and through
// Wikipedia and Wikimedia Commons pages fetched in this session. The
// SlaveVoyages site itself could not be reached from this environment (its
// domain did not resolve), so NO FIGURE HERE IS QUOTED FROM THE DATABASE
// DIRECTLY: the one regional total used is an ESTIMATE reported in published
// secondary work and is labelled as such. Monographs (Law, Hall, Parés, Sweet,
// Thornton, Herskovits, Mintz and Price, Matory, Verger) were not opened; they
// are paraphrased from their published descriptions and the standard
// literature, never quoted, and claims that need checking against the page
// say NEEDS SOURCE VERIFICATION. Every picture is a Commons file whose page
// was fetched in this session; licence and creator are as that page states.

import type { SeedEvent, SeedEventLink, SeedSource } from "../seed-types";
import { commonsPicture, vodunTags, VODUN_DIASPORA_ANCHORS, type FollowTag, type VodunSection } from "./shared";

const T = (follow: FollowTag[], ...own: string[]) => vodunTags("atlantic", follow, ...own);

const A = VODUN_DIASPORA_ANCHORS;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // ---- Numbers, ports and the coast -----------------------------------------
  {
    key: "slavevoyages_tastdb",
    title: "SlaveVoyages: the Trans-Atlantic Slave Trade Database",
    author: "David Eltis, David Richardson and collaborators",
    publisher: "SlaveVoyages consortium (Emory University, Rice University and partners)",
    url: "https://www.slavevoyages.org/",
    sourceType: "academic_paper",
    publishedDisplay: "online database, first released 2008, revised since",
    notes:
      "Cited for the DISTINCTION between documented voyages (records that survive, each with ship, date and often a count of people) and estimated totals (a model built on top of them for voyages whose papers are lost), and for the regional scheme in which the 'Bight of Benin' runs from the Volta to the Nun. NOT CITED FOR ANY FIGURE: the site could not be reached from this environment, so every number in this section that could have come from it is marked NEEDS SOURCE VERIFICATION against the current release.",
  },
  {
    key: "eltis_richardson_atlas_2010",
    title: "Atlas of the Transatlantic Slave Trade",
    author: "David Eltis and David Richardson",
    publisher: "Yale University Press",
    reference: "New Haven and London, 2010",
    sourceType: "academic_book",
    publishedYear: 2010,
    notes:
      "Cited for the regional pattern of embarkation drawn from the database's estimates — West-Central Africa as the largest single region, the Bight of Benin among the principal West African ones — and for its explicit statement that its maps of totals rest on estimates rather than documented departures. Paraphrased from its published map notes; the regional table for the Bight of Benin was not consulted (NEEDS SOURCE VERIFICATION).",
  },
  {
    key: "fuglestad_slave_traders_2018",
    title: "Slave Traders by Invitation: West Africa's Slave Coast in the Precolonial Era",
    author: "Finn Fuglestad",
    publisher: "Oxford University Press / Hurst",
    reference: "2018; introduction, pp. 1–18, as cited in the Wikipedia article 'Slave Coast of West Africa'",
    sourceType: "academic_book",
    publishedYear: 2018,
    notes:
      "Cited for the ESTIMATE that roughly two million people were embarked from the Slave Coast, about 16 per cent of the c. 12.5 million carried across the Atlantic, and that more than half of them were probably embarked from the open beach south of Ouidah. Known here only through the Wikipedia summary of the introduction; the book was not consulted (NEEDS SOURCE VERIFICATION).",
  },
  {
    key: "wikipedia_slave_coast",
    title: "Slave Coast of West Africa",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Slave_Coast_of_West_Africa",
    sourceType: "wikipedia",
    publishedDisplay: "accessed October 2026",
    notes:
      "Extra, never sole, support: for the list of embarkation points (Ouidah, Jakin, Porto-Novo, Badagry, Lagos, Grand-Popo, Little Popo/Aného, Agoué), for the report that the name 'Slave Coast' arose in the seventeenth century, and as the route by which Fuglestad's estimate was located. One of its figures ('2–3 million') carries a broken citation and is not used.",
  },
  {
    key: "law_slave_coast_1991",
    title: "The Slave Coast of West Africa 1550–1750: The Impact of the Atlantic Slave Trade on an African Society",
    author: "Robin Law",
    publisher: "Clarendon Press, Oxford",
    reference: "Oxford, 1991",
    sourceType: "academic_book",
    publishedYear: 1991,
    notes:
      "THE STANDARD HISTORY of the coast before and during Dahomey's conquest: Allada and its port at Offra and Jakin, Hueda and Ouidah, Little Popo, the shift of trade between beaches, and the European nomenclature of the coast. Cited for the port history; paraphrased, not opened here (NEEDS SOURCE VERIFICATION for detail).",
  },
  {
    key: "law_ouidah_2004",
    title: "Ouidah: The Social History of a West African Slaving Port, 1727–1892",
    author: "Robin Law",
    publisher: "Ohio University Press / James Currey",
    reference: "Athens OH and Oxford, 2004",
    sourceType: "academic_book",
    publishedYear: 2004,
    notes:
      "Cited for Ouidah's Brazilian connections — the Portuguese fort, the Bahian tobacco trade, the returnee ('Agudá') families of the nineteenth century — and for the way the town kept trading illegally after 1807. Paraphrased; not opened here.",
  },
  {
    key: "law_mann_wmq_1999",
    title: "West Africa in the Atlantic Community: The Case of the Slave Coast",
    author: "Robin Law and Kristin Mann",
    publisher: "Omohundro Institute of Early American History and Culture",
    workTitle: "The William and Mary Quarterly",
    reference: "3rd series, vol. 56, no. 2 (1999), pp. 307–334",
    sourceType: "academic_paper",
    publishedYear: 1999,
    notes:
      "Cited for the argument that the Slave Coast — Ouidah, Porto-Novo, Badagry and above all Lagos in the nineteenth century — was part of an Atlantic community of exchange running BOTH ways, with Brazil in particular; the frame for the return-migration records.",
  },
  {
    key: "norris_bossa_ahadee_1789",
    title: "Memoirs of the Reign of Bossa Ahádee, King of Dahomy, an Inland Country of Guiney",
    author: "Robert Norris",
    publisher: "W. Lowndes, London",
    reference: "London, 1789; includes a map of the Slave Coast",
    url: "https://commons.wikimedia.org/wiki/File:Map_of_Slave_Coast-1789.jpg",
    sourceType: "primary",
    publishedYear: 1789,
    notes:
      "A slave trader's account of Dahomey under Tegbesu, published to argue AGAINST abolition. Cited only for its map of the Slave Coast (the European picture of the ports in the 1780s) and as an example of the trader's-eye sources on which the coast's history partly rests — a viewpoint, not a neutral one.",
  },

  // ---- Ethnonyms and the Africa-centred historiography ---------------------
  {
    key: "hall_slavery_african_ethnicities_2005",
    title: "Slavery and African Ethnicities in the Americas: Restoring the Links",
    author: "Gwendolyn Midlo Hall",
    publisher: "University of North Carolina Press",
    reference: "Chapel Hill, 2005",
    sourceType: "academic_book",
    publishedYear: 2005,
    notes:
      "Cited for the method of reading 'nation' labels in American records (Arada, Mina, Fon, Nago, Congo) against the voyage data, for the argument that Africans arrived in clusters rather than randomly mixed, and for the point that 'Mina' meant different things in Spanish America, Brazil and Louisiana. Paraphrased; not opened here.",
  },
  {
    key: "hall_africans_colonial_louisiana_1992",
    title: "Africans in Colonial Louisiana: The Development of Afro-Creole Culture in the Eighteenth Century",
    author: "Gwendolyn Midlo Hall",
    publisher: "Louisiana State University Press",
    reference: "Baton Rouge, 1992; on the French slave ships of 1719–1731, ch. 2 (pp. 56–61 are those cited in secondary summaries)",
    sourceType: "academic_book",
    publishedYear: 1992,
    notes:
      "Cited for the French Company of the Indies' slave ships to Louisiana in 1719–1731, which brought nearly all Africans who reached the colony under French rule, including ships loaded at Ouidah ('Juda'), and for Hall's argument that this short early window shaped Louisiana's Afro-Creole culture. The exact count of Ouidah ships NEEDS SOURCE VERIFICATION against the book.",
  },
  {
    key: "wikipedia_aurore_ship",
    title: "Aurore (slave ship)",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Aurore_(slave_ship)",
    sourceType: "wikipedia",
    publishedDisplay: "accessed October 2026",
    notes:
      "Extra support, resting on the Trans-Atlantic Slave Trade Database and on Hall: the Aurore left Saint-Malo in 1718, loaded captives at Whydah (Ouidah) and Cape Lahou, and landed 200 of 201 embarked in Louisiana on 6 June 1719, alongside the Duc du Maine from Senegambia.",
  },
  {
    key: "thornton_africa_africans_1998",
    title: "Africa and Africans in the Making of the Atlantic World, 1400–1800",
    author: "John Thornton",
    publisher: "Cambridge University Press",
    reference: "2nd edition, Cambridge, 1998 (1st edition 1992, to 1680)",
    sourceType: "academic_book",
    publishedYear: 1998,
    notes:
      "Cited for the argument that Africans were active participants in the Atlantic world, that slave ships drew on a limited number of African regions so that people often arrived among others who shared language and religion, and that African religions and African Christianity were 'continuous revelation' traditions able to absorb new material. Paraphrased; not opened here.",
  },
  {
    key: "thornton_trail_of_voodoo_1988",
    title: "On the Trail of Voodoo: African Christianity in Africa and the Americas",
    author: "John K. Thornton",
    publisher: "Cambridge University Press for the Academy of American Franciscan History",
    workTitle: "The Americas",
    reference: "1988",
    url: "https://www.cambridge.org/core/journals/americas/article/on-the-trail-of-voodoo-african-christianity-in-africa-and-the-americas/0ACDEFEEF94E6786DA78F1534408DDF1",
    sourceType: "academic_paper",
    publishedYear: 1988,
    notes:
      "Cited for the argument that many Central Africans arrived in the Americas ALREADY Christian, out of a Kongo Catholicism with more than two centuries of local history, so that 'syncretism' in the Americas often continued an African Christianity rather than beginning one. Its opening extract was seen; the full text was not.",
  },
  {
    key: "thornton_racines_vaudou_1998",
    title: "Les racines du vaudou : religion africaine et société haïtienne dans la Saint-Domingue prérévolutionnaire",
    author: "John K. Thornton",
    publisher: "Département d'anthropologie, Université Laval",
    workTitle: "Anthropologie et Sociétés",
    reference: "vol. 22, no. 1 (1998)",
    url: "https://www.erudit.org/en/journals/as/1998-v22-n1-as804/015523ar",
    sourceType: "academic_paper",
    publishedYear: 1998,
    notes:
      "Cited for the argument that Saint-Domingue's enslaved population, and hence its religion, came in large measure from two African source regions — Dahomey and its hinterland, and the Kongo region — and that the colony's Vodou drew on both.",
  },
  {
    key: "sweet_recreating_africa_2003",
    title: "Recreating Africa: Culture, Kinship, and Religion in the African-Portuguese World, 1441–1770",
    author: "James H. Sweet",
    publisher: "University of North Carolina Press",
    reference: "Chapel Hill, 2003",
    sourceType: "academic_book",
    publishedYear: 2003,
    notes:
      "Cited for the use of Portuguese Inquisition and ecclesiastical records to recover African religious practice in Brazil and Portugal — calundu, divination, healing, the mandinga pouch — and for Sweet's argument that these were African practices continued under slavery, not yet a 'creole' synthesis. Paraphrased; not opened here.",
  },
  {
    key: "sweet_domingos_alvares_2011",
    title: "Domingos Álvares, African Healing, and the Intellectual History of the Atlantic World",
    author: "James H. Sweet",
    publisher: "University of North Carolina Press",
    reference: "Chapel Hill, 2011",
    url: "https://history.wisc.edu/publications/domingos-alvares-african-healing-and-the-intellectual-history-of-the-atlantic-world/",
    sourceType: "academic_book",
    publishedYear: 2011,
    notes:
      "Cited for the life of Domingos Álvares, reconstructed from his Inquisition trials: born c. 1710 in Naogon in the Mahi country, enslaved after Dahomey's wars, shipped to Pernambuco, sold to Rio de Janeiro, arrested and tried in Lisbon, banished to Castro Marim, re-arrested in 1747 and tried again. Known here through the publisher's and reviewers' summaries; details NEED SOURCE VERIFICATION against the book.",
  },
  {
    key: "pares_formation_candomble_2013",
    title: "The Formation of Candomblé: Vodun History and Ritual in Brazil",
    author: "Luis Nicolau Parés",
    publisher: "University of North Carolina Press",
    reference: "Chapel Hill, 2013 (translated from A formação do candomblé: história e ritual da nação jeje na Bahia, Editora da Unicamp, 2006)",
    url: "https://uncpress.org/book/9781469610924/the-formation-of-candomble",
    sourceType: "academic_book",
    publishedYear: 2013,
    notes:
      "THE KEY WORK on the Jeje nation in Bahia: the label in manumission letters, wills, sale deeds and censuses from the early eighteenth century; the 1785 Cachoeira calundu; the Jeje brotherhoods; and the argument that Jeje ritual structures helped shape the Candomblé houses of the nineteenth century — an argument Matory rejects. Paraphrased; not opened here.",
  },
  {
    key: "pares_militiamen_brotherhood_2014",
    title: "Militiamen, barbers and slave-traders: Mina and Jeje Africans in a Catholic brotherhood (Bahia, 1770–1830)",
    author: "Luis Nicolau Parés",
    publisher: "Universidade Federal Fluminense",
    workTitle: "Tempo",
    reference: "2014",
    url: "https://www.scielo.br/j/tem/a/BXkcQS7JswBSDQPfZBj8vyH/abstract/?lang=en",
    sourceType: "academic_paper",
    publishedYear: 2014,
    notes:
      "Cited for the brotherhood of Senhor Bom Jesus das Necessidades e Redenção dos Homens Pretos in the Corpo Santo chapel of Salvador, whose members were largely Jeje and Mina Africans, and for the social profile of its members (militia officers, barbers, slave-traders). Abstract seen; full text not opened.",
  },
  {
    key: "pares_agoue_baptism_2015",
    title: "Afro-Catholic Baptism and the Articulation of a Merchant Community, Agoué, 1840–1860",
    author: "Luis Nicolau Parés",
    publisher: "Cambridge University Press",
    workTitle: "History in Africa",
    reference: "vol. 42 (2015), pp. 165–202",
    url: "https://www.cambridge.org/core/journals/history-in-africa/article/afrocatholic-baptism-and-the-articulation-of-a-merchant-community-agoue-18401860/8E1DC98AE3B9ECA4576DF58DDDCE98EF",
    sourceType: "academic_paper",
    publishedYear: 2015,
    notes:
      "Cited for the mass baptisms at Agoué in 1846 and 1855 and for the argument that Catholic baptism and godparenthood bound Brazilian returnees into a merchant community whose early business included the slave trade.",
  },
  {
    key: "reis_magia_jeje_1988",
    title: "Magia jeje na Bahia: a invasão do calundu do Pasto de Cachoeira, 1785",
    author: "João José Reis",
    publisher: "Associação Nacional de História (ANPUH)",
    workTitle: "Revista Brasileira de História",
    reference: "1988 (volume and pages NEED SOURCE VERIFICATION)",
    sourceType: "academic_paper",
    publishedYear: 1988,
    notes:
      "THE STUDY of the 1785 raid on a calundu led by a Dahomean (Jeje) African, Sebastião, in the Rua do Pasto of Cachoeira, reconstructed from the judicial record of the raid. Known here through later articles that cite it (with Parés 2006/2013); not opened.",
  },
  {
    key: "mott_luzia_pinta_1994",
    title: "O calundu-Angola de Luzia Pinta: Sabará, 1739",
    author: "Luiz Mott",
    publisher: "Instituto de Arte e Cultura, Universidade Federal de Ouro Preto",
    workTitle: "Revista do Instituto de Arte e Cultura",
    reference: "no. 1 (1994), pp. 73–82",
    sourceType: "academic_paper",
    publishedYear: 1994,
    notes:
      "Cited for the case of Luzia Pinta, an Angolan woman denounced in Sabará (Minas Gerais) in 1739, sent to Lisbon in 1742 and tried by the Inquisition — the best-known calundu case, and a CENTRAL African one, which keeps the calundu record from being read as Gbe alone.",
  },
  {
    key: "calainho_metropole_mandingas_2008",
    title: "Metrópole das mandingas: religiosidade negra e Inquisição portuguesa no Antigo Regime",
    author: "Daniela Buono Calainho",
    publisher: "Garamond",
    reference: "Rio de Janeiro, 2008",
    sourceType: "academic_book",
    publishedYear: 2008,
    notes:
      "Cited for the Lisbon Inquisition's cases against Africans in Portugal itself for making and carrying mandinga pouches and for other 'feitiçaria', and for Lisbon as a city with a large African population in the seventeenth and eighteenth centuries. Paraphrased; not opened here.",
  },
  {
    key: "rarey_insignificant_things_2023",
    title: "Insignificant Things: Amulets and the Art of Survival in the Early Black Atlantic",
    author: "Matthew Francis Rarey",
    publisher: "Duke University Press",
    reference: "Durham NC, 2023",
    sourceType: "academic_book",
    publishedYear: 2023,
    notes:
      "Cited for the mandinga pouch as an Atlantic object — made by West African, Central African and Brazilian-born men, combining Islamic, Catholic and African materials — and for the Lisbon trial of the pouch-maker José Francisco Pereira (1730). Paraphrased from its published descriptions.",
  },

  // ---- Law, Catholicism and Saint-Domingue ---------------------------------
  {
    key: "code_noir_1685",
    title: "Édit du Roi sur les esclaves des îles de l'Amérique (the 'Code Noir'), Versailles, March 1685",
    author: "Louis XIV of France",
    publisher: "French Crown; text as transcribed by the Université Laval (CEFAN) and Wikisource",
    url: "https://www.axl.cefan.ulaval.ca/amsudant/guyanefr1685.htm",
    sourceType: "primary",
    publishedYear: 1685,
    notes:
      "Cited for Article 2 ('Tous les esclaves qui seront dans nos îles seront baptisés et instruits dans la religion catholique, apostolique et romaine', with masters to report newly arrived Africans within eight days) and Article 3 (public exercise of any other religion forbidden; assemblies for it declared unlawful and seditious). Wording as reported from the transcriptions in search results; the 1724 Louisiana revision keeps both clauses.",
  },
  {
    key: "moreau_description_1797",
    title: "Description topographique, physique, civile, politique et historique de la partie française de l'isle Saint-Domingue",
    author: "Médéric Louis Élie Moreau de Saint-Méry",
    publisher: "Published by the author, Philadelphia",
    reference: "2 vols, 1797–1798; the 'Vaudoux' passage is in vol. 1",
    sourceType: "primary",
    publishedYear: 1797,
    notes:
      "THE FIRST EXTENDED WRITTEN DESCRIPTION of 'Vaudoux' in Saint-Domingue, by a Martinique-born colonial lawyer and defender of slavery. Cited for his attribution of the cult to the 'Arada', for the non-venomous serpent at its centre with a 'king' and 'queen' who speak for it, and as the text later writers on Haiti and Louisiana copied. Paraphrased from translations reported in secondary sources; the French text was not read in this session (NEEDS SOURCE VERIFICATION of wording).",
  },
  {
    key: "cable_creole_slave_songs_1886",
    title: "Creole Slave Songs",
    author: "George W. Cable",
    publisher: "The Century Company, New York",
    workTitle: "The Century Magazine",
    reference: "vol. 31 (April 1886); illustrated by E. W. Kemble (the Marie Laveau etching is on p. 819)",
    sourceType: "primary",
    publishedYear: 1886,
    notes:
      "A New Orleans novelist's account of Louisiana 'Voodoo' that leans on Moreau de Saint-Méry's Saint-Domingue description (including the serpent in its box). Cited as a STAGE IN THE GENEALOGY of the Louisiana snake stories, not as evidence of practice: what it adds is literary and second-hand.",
  },
  {
    key: "long_voudou_priestess_2006",
    title: "A New Orleans Voudou Priestess: The Legend and Reality of Marie Laveau",
    author: "Carolyn Morrow Long",
    publisher: "University Press of Florida",
    reference: "Gainesville, 2006",
    sourceType: "academic_book",
    publishedYear: 2006,
    notes:
      "Cited for the separation of documented facts about Marie Laveau and nineteenth-century New Orleans Voudou (court records, newspapers, sacramental registers) from the later legend — including the snake 'Zombi' — built by journalists, Cable, and the 1930s Federal Writers' Project. Paraphrased.",
  },
  {
    key: "bosman_guinea_1705",
    title: "A New and Accurate Description of the Coast of Guinea, Divided into the Gold, the Slave, and the Ivory Coasts",
    author: "Willem Bosman",
    publisher: "J. Knapton and others, London",
    reference: "English translation 1705 (Dutch original 1704), letters on Fida/Whydah",
    url: "https://archive.org/details/newaccuratedescr00bosm",
    sourceType: "primary",
    publishedYear: 1705,
    notes:
      "A Dutch West India Company factor's description of the serpent revered at Whydah (Ouidah), the earliest detailed European account of it. Cited only as the African end of the serpent comparison; benin-vodun's Bosman record treats it fully.",
  },

  // ---- The survivals debate -----------------------------------------------
  {
    key: "herskovits_myth_negro_past_1941",
    title: "The Myth of the Negro Past",
    author: "Melville J. Herskovits",
    publisher: "Harper & Brothers",
    reference: "New York and London, 1941",
    sourceType: "academic_book",
    publishedYear: 1941,
    notes:
      "Cited for the 'survivals' or 'Africanisms' thesis: that African cultural forms persisted in the Americas, strongest where Africans were most numerous and most isolated (Suriname's maroons, Haiti, Bahia) and weakest in the United States, and for the 'scale of intensity' of Africanisms. Written partly as a political argument against the idea that Black Americans had no past. Paraphrased; not opened here.",
  },
  {
    key: "herskovits_dahomey_1938",
    title: "Dahomey: An Ancient West African Kingdom",
    author: "Melville J. Herskovits",
    publisher: "J. J. Augustin",
    reference: "New York, 1938, 2 vols; fieldwork in Abomey with Frances S. Herskovits, 1931",
    sourceType: "academic_book",
    publishedYear: 1938,
    notes:
      "Cited for Herskovits's Dahomean fieldwork as the African baseline he used to measure 'survivals' in Haiti (Life in a Haitian Valley, 1937) and Suriname — and for the problem that a baseline recorded in 1931 is not the eighteenth-century religion the deported carried.",
  },
  {
    key: "frazier_negro_family_1939",
    title: "The Negro Family in the United States",
    author: "E. Franklin Frazier",
    publisher: "University of Chicago Press",
    reference: "Chicago, 1939",
    sourceType: "academic_book",
    publishedYear: 1939,
    notes:
      "Cited for Frazier's position that slavery in the United States largely destroyed African social organisation and memory, so that Black American institutions had to be explained by the experience of slavery and its aftermath, not by Africa — the other side of the 'Herskovits–Frazier debate'.",
  },
  {
    key: "mintz_price_1976",
    title: "An Anthropological Approach to the Afro-American Past: A Caribbean Perspective",
    author: "Sidney W. Mintz and Richard Price",
    publisher: "Institute for the Study of Human Issues (ISHI), Philadelphia",
    reference: "ISHI Occasional Papers in Social Change 2, 1976; republished as The Birth of African-American Culture: An Anthropological Perspective (Beacon Press, Boston, 1992)",
    sourceType: "academic_book",
    publishedYear: 1976,
    notes:
      "Cited for the creolisation model: enslaved Africans arrived as heterogeneous 'crowds', not as intact 'groups', so new institutions had to be built quickly from shared 'deep-level' orientations rather than transplanted; and for the special bond between shipmates. The principal target of the later Africa-centred critique.",
  },
  {
    key: "slenes_malungu_1992",
    title: "\"Malungu, ngoma vem!\": África coberta e descoberta do Brasil",
    author: "Robert W. Slenes",
    publisher: "Universidade de São Paulo",
    workTitle: "Revista USP",
    reference: "no. 12 (1992), pp. 48–67; DOI 10.11606/issn.2316-9036.v0i12p48-67",
    url: "https://revistas.usp.br/revusp/en/article/view/25575",
    sourceType: "academic_paper",
    publishedYear: 1992,
    notes:
      "Cited for the Central African (Kikongo/Kimbundu) word malungu used in Brazil for shipmates and companions, and for Slenes's argument that Bantu-speaking captives in south-east Brazil recognised one another's languages and ritual idioms — an argument for more continuity than Mintz and Price allowed. Bibliographic record seen; article not read in full.",
  },

  // ---- Brazil, Cuba, Suriname, return --------------------------------------
  {
    key: "verger_flux_reflux_1968",
    title: "Flux et reflux de la traite des nègres entre le golfe de Bénin et Bahia de Todos os Santos du XVIIe au XIXe siècle",
    author: "Pierre Verger",
    publisher: "Mouton, Paris and The Hague",
    reference: "1968, 720 pp. (English: Trade Relations between the Bight of Benin and Bahia, 17th–19th Century, Ibadan, 1976)",
    sourceType: "academic_book",
    publishedYear: 1968,
    notes:
      "THE FOUNDATIONAL STUDY of the direct Bahia–Bight of Benin route: the Portuguese 'Costa da Mina' trade, the use of Bahian third-grade tobacco as the currency of the trade, Dutch restrictions on Portuguese ships at Elmina, the Dahomean embassies to Bahia, and the nineteenth-century return of freed Africans. Built partly on the letters of the trader José Francisco dos Santos ('Alfaiate'), found in Ouidah in 1949. Paraphrased from its table of contents and published descriptions.",
  },
  {
    key: "matory_black_atlantic_religion_2005",
    title: "Black Atlantic Religion: Tradition, Transnationalism, and Matriarchy in the Afro-Brazilian Candomblé",
    author: "J. Lorand Matory",
    publisher: "Princeton University Press",
    reference: "Princeton, 2005",
    sourceType: "academic_book",
    publishedYear: 2005,
    notes:
      "Cited for the argument that Candomblé's 'African purity' — above all the prestige of the Nagô (Yoruba) houses — was built in the nineteenth and twentieth centuries through continuing traffic between Lagos and Bahia (merchants, returnees, Lagos-educated priests), and so is a transnational product, not an inert survival. Takes issue with Parés on the Jeje contribution.",
  },
  {
    key: "dantas_vovo_nago_1988",
    title: "Vovó Nagô e Papai Branco: usos e abusos da África no Brasil",
    author: "Beatriz Góis Dantas",
    publisher: "Graal",
    reference: "Rio de Janeiro, 1988",
    sourceType: "academic_book",
    publishedYear: 1988,
    notes:
      "Cited for the argument that 'Nagô purity' was in part constructed by Brazilian intellectuals and ethnographers who praised some houses as 'pure' and 'African' and disparaged others as mixed — the view Matory criticises for leaving out Black transatlantic agency.",
  },
  {
    key: "ferretti_querebenta_1985",
    title: "Querebentã de Zomadônu: etnografia da Casa das Minas do Maranhão",
    author: "Sergio Figueiredo Ferretti",
    publisher: "EDUFMA (Editora da Universidade Federal do Maranhão)",
    reference: "São Luís, 1985",
    sourceType: "academic_book",
    publishedYear: 1985,
    notes:
      "THE ETHNOGRAPHY of the Casa das Minas, from fieldwork in the 1970s–80s: its Dahomean vodun (Zomadonu and the royal family of Davice), its women initiates (vodunsi), and its own oral history of its founder; cited for the house's practice and for the status of the Agontimé identification as a scholar's hypothesis. Paraphrased; not opened here.",
  },
  {
    key: "wikipedia_casa_das_minas",
    title: "Casa das Minas",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Casa_das_Minas",
    sourceType: "wikipedia",
    publishedDisplay: "accessed October 2026",
    notes:
      "Extra support only: for the 1847 deed naming Maria Jesuína as owner of the corner building, the dedication to Zomadonu, Pierre Verger's statement that Maria Jesuína was probably Nã Agontimé, the IPHAN listing (2002), and the death of the last vodunsi, Dona Deni, in 2015.",
  },
  {
    key: "brown_santeria_enthroned_2003",
    title: "Santería Enthroned: Art, Ritual, and Innovation in an Afro-Cuban Religion",
    author: "David H. Brown",
    publisher: "University of Chicago Press",
    reference: "Chicago, 2003",
    sourceType: "academic_book",
    publishedYear: 2003,
    notes:
      "Cited for the cabildos de nación of Havana and Matanzas as the institutions in which African 'nations' — Lucumí, Arará, Congo, Carabalí — organised mutual aid, festival and worship under Spanish law, and for the nineteenth-century innovation (not mere preservation) that made Lucumí religion. Paraphrased.",
  },
  {
    key: "howard_changing_history_1998",
    title: "Changing History: Afro-Cuban Cabildos and Societies of Color in the Nineteenth Century",
    author: "Philip A. Howard",
    publisher: "Louisiana State University Press",
    reference: "Baton Rouge, 1998",
    sourceType: "academic_book",
    publishedYear: 1998,
    notes:
      "Cited for the African roots of the cabildos de nación and their difference from Spanish cofradías, and for colonial regulation of them (including the Havana bando de buen gobierno of 1792). Known through its published reviews.",
  },
  {
    key: "wikipedia_cabildo_cuba",
    title: "Cabildo (Cuba)",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Cabildo_(Cuba)",
    sourceType: "wikipedia",
    publishedDisplay: "accessed October 2026",
    notes:
      "Extra support only: for the late-sixteenth-century beginnings of cabildos de nación in Cuba (a 1568 date circulates, with disputed attribution), and for a Havana lot bought in 1691 by an Arará group and still called 'el solar de los Arará'. Several of the page's claims rest on self-published sources, and they are treated as such.",
  },
  {
    key: "borges_life_of_language_2014",
    title: "The Life of Language: Dynamics of Language Contact in Suriname",
    author: "Robert Borges",
    publisher: "LOT (Netherlands Graduate School of Linguistics), Utrecht",
    reference: "PhD thesis, Radboud University Nijmegen, 2014, p. 41 (citing Van Stipriaan 1994 and the slave-trade data)",
    sourceType: "academic_book",
    publishedYear: 2014,
    notes:
      "Cited for the ESTIMATED regional composition of the c. 220,000 Africans taken to Suriname — about 27 per cent from West-Central Africa, 21 per cent from the Gold Coast, 20 per cent from the Windward Coast, and more than 32,000 (about 14 per cent) from the Bight of Benin — as quoted in the Wikipedia article 'Afro-Surinamese'. NEEDS SOURCE VERIFICATION against the thesis.",
  },
  {
    key: "wikipedia_winti",
    title: "Winti",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Winti",
    sourceType: "wikipedia",
    publishedDisplay: "accessed October 2026",
    notes:
      "Extra support only: for Winti as a religion formed from the traditions of enslaved Akan, Fon (Gbe-speaking) and Kongo people, for Fodu among the earth winti, and for the legal prohibition of Winti practice from 1874 to 1971.",
  },
  {
    key: "wikipedia_brazilian_nigerians",
    title: "Brazilian Nigerians",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Brazilian_Nigerians",
    sourceType: "wikipedia",
    publishedDisplay: "accessed October 2026",
    notes:
      "Extra support only: for the 1835 deportations from Bahia after the Malê revolt as the first recorded repatriation, the 1852 grant of land in Lagos that became the Brazilian Quarter (Popo Aguda), returnees as c. 9 per cent of Lagos's population by the 1880s, the sobrado style, the Water House built by João Esan da Rocha, and the Holy Cross Cathedral (1878–81) built by Brazilian master builders including Lázaro Borges da Silva.",
  },
  {
    key: "wikipedia_tabom",
    title: "Tabom people",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Tabom_people",
    sourceType: "wikipedia",
    publishedDisplay: "accessed October 2026",
    notes:
      "Extra support only: for the Tabom of Accra as descendants of Afro-Brazilians who returned in the nineteenth century, the derivation of the name from Portuguese 'tá bom', and Brazil House in James Town. The arrival in 1836 of about seventy people in seven families is reported in Ghanaian press accounts and NEEDS SOURCE VERIFICATION.",
  },
];

// ---------------------------------------------------------------------------
// Pictures (every file page fetched in this session)
// ---------------------------------------------------------------------------

const P = {
  brookes: commonsPicture({
    fileName: "Slaveshipposter.jpg",
    caption:
      "'Stowage of the British slave ship Brookes under the regulated slave trade act of 1788': the abolitionist print of December 1788, drawn to show how many people a ship could legally carry. A late-eighteenth-century engraving made as propaganda against the trade — a real ship's plan, used to shock.",
    shows: "engraving",
    identificationStatus: "secure",
    licence: "Public domain (published before 1931; Creative Commons Public Domain Mark 1.0)",
    creator: "Plymouth Chapter of the Society for Effecting the Abolition of the Slave Trade",
    institution: "Library of Congress, Prints and Photographs Division",
    accessionNumber: "cph.3a34658",
    objectDate: "December 1788",
  }),
  norrisMap: commonsPicture({
    fileName: "Map of Slave Coast-1789.jpg",
    caption:
      "Robert Norris's map of the Slave Coast, published in London in 1789 in his Memoirs of the Reign of Bossa Ahádee. An eighteenth-century trader's map: it records the ports and kingdoms as a European slave trader saw them in the 1780s.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain (Creative Commons Public Domain Mark 1.0)",
    creator: "Robert Norris",
    institution: "Newberry Library (digital collections)",
    objectDate: "1789",
  }),
  mollMap: commonsPicture({
    fileName: "Negroland and Guinea with the European Settlements, 1736.jpg",
    caption:
      "Herman Moll's 'Negroland and Guinea with the European Settlements', first published 1727 (this printing 1729, despite the file name), marking the 'Slave Coast' beside the Gold and Ivory Coasts. An eighteenth-century English map: it shows how Europeans named and divided the coast, not how its peoples did.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain (Creative Commons Public Domain Mark 1.0)",
    creator: "Herman Moll",
    institution: "University of Florida, George A. Smathers Libraries",
    accessionNumber: "ALW1663",
    objectDate: "1727 (printed 1729)",
  }),
  danvilleMap: commonsPicture({
    fileName:
      "Carte de la Côte de Guinée et du pays, autant qu'il est connu, depuis la Rivière de Serre-lione jusqu'à celle des Camarones (Ier état) - par le S(ieur) d'Anville, Géographe Ord(inaire) du Roi, Juillet 1729... - btv1b530532334.jpg",
    caption:
      "Jean-Baptiste Bourguignon d'Anville's 'Carte de la Côte de Guinée', Paris, July 1729 — the French royal geographer's map of the coast from Sierra Leone to the Cameroons, drawn two years after Dahomey took Ouidah. An eighteenth-century map, useful for the European names of the ports.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain (France and United States)",
    creator: "Jean-Baptiste Bourguignon d'Anville (engraved by Jean-Baptiste Delahaye)",
    institution: "Bibliothèque nationale de France, Cartes et plans",
    accessionNumber: "GE DD-2987 (8166 B)",
    objectDate: "July 1729",
  }),
  hansenMap: commonsPicture({
    fileName: "Carte de la Côte des Esclaves - DPLA - c8ff70e150a97bfb96c82f7ac669f52d.jpg",
    caption:
      "Jules Hansen's 'Carte de la Côte des Esclaves' (1874), at 1:940,000: the Slave Coast — Little Popo, Ouidah, Porto-Novo, Badagry, Lagos — as French cartography drew it in the last years of Dahomey's independence. A nineteenth-century map.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain in the United States (No Copyright – United States)",
    creator: "Jules Hansen (1849–1931)",
    institution: "University of Illinois Urbana-Champaign Library, via the Digital Public Library of America",
    objectDate: "1874",
  }),
  kbGuineaMap: commonsPicture({
    fileName: "AMH-6460-KB Map of the African Gold and Slave coast.jpg",
    caption:
      "'Guinea nova descriptio', an anonymous Dutch engraved map of 1614 covering the Gold Coast — where the Portuguese castle of São Jorge da Mina (Elmina) stood — and the coast to the east, with an inset of São Tomé. A seventeenth-century map: it shows why 'Mina' began as a Gold Coast name before the Portuguese stretched it eastward.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain (Creative Commons Public Domain Mark 1.0)",
    creator: "Anonymous engraver",
    institution: "Koninklijke Bibliotheek, The Hague (Atlas of Mutual Heritage)",
    accessionNumber: "496 D 12 deel II, after p. 266",
    objectDate: "1614",
  }),
  triangleMap: commonsPicture({
    fileName: "Atlantic Triangular Trade, 1500-1800s.png",
    caption:
      "A modern diagram-map of the Atlantic 'triangular trade' between Europe, West Africa and the Americas, drawn in 2020. It is a simplified modern illustration, not a historical document: the direct Bahia–Bight of Benin route, which bypassed Europe, is exactly what the 'triangle' picture leaves out.",
    shows: "map",
    identificationStatus: "modern_interpretation",
    licence: "CC BY-SA 3.0",
    creator: "Isaac Pérez Bolado (after Jkwchui)",
    objectDate: "2020",
  }),
  rugendasHold: commonsPicture({
    fileName: "Rugendas - Nègres a fond de cale.jpg",
    caption:
      "'Nègres à fond de cale' — Africans in the hold of a slave ship, by Johann Moritz Rugendas, from his Voyage pittoresque dans le Brésil (published from 1827). A nineteenth-century artist's lithograph, composed for European readers, not a drawing made on a voyage.",
    shows: "later_artwork",
    identificationStatus: "secure",
    licence: "Public domain (Creative Commons Public Domain Mark 1.0)",
    creator: "Johann Moritz Rugendas",
    institution: "New York Public Library Digital Gallery",
    objectDate: "c. 1827–1835",
  }),
  batuque: commonsPicture({
    fileName: "Batuque.jpg",
    caption:
      "'Batuque' by Johann Moritz Rugendas, from his travels in Brazil in 1822–1825: Africans and Afro-Brazilians dancing in a ring to drums and clapping. A nineteenth-century artist's image of a secular dance — contextual for the ritual gatherings colonial authorities called calundu, not a picture of one.",
    shows: "later_artwork",
    identificationStatus: "secure",
    licence: "Public domain (Creative Commons Public Domain Mark 1.0)",
    creator: "Johann Moritz Rugendas (1802–1858)",
    objectDate: "1822–1825",
  }),
  capoeiraBahia: commonsPicture({
    fileName: "Capoeira in Bahia 1835.jpg",
    caption:
      "Rugendas's engraving of San Salvador (Salvador da Bahia) with Africans playing capoeira in a clearing on the Itapagipe peninsula, from Voyage pittoresque dans le Brésil (1835). A nineteenth-century artist's print of the city where Jeje and Nagô Africans lived and organised.",
    shows: "engraving",
    identificationStatus: "secure",
    licence: "Public domain (Creative Commons Public Domain Mark 1.0)",
    creator: "Johann Moritz Rugendas",
    objectDate: "1835",
  }),
  codeNoir1742: commonsPicture({
    fileName: "Le Code Noir 1742 edition.jpg",
    caption:
      "Title page of the 1742 Paris edition of the Code Noir, printed by Prault père, which collected the 1685 edict and later royal rulings on slavery in the French colonies. An eighteenth-century printed book; the 1685 text itself is not shown.",
    shows: "historical_document",
    identificationStatus: "secure",
    licence: "Public domain (Creative Commons Public Domain Mark 1.0)",
    creator: "Prault père (printer), for the French Crown",
    objectDate: "1742",
  }),
  codeNoirNantes: commonsPicture({
    fileName: "Code noir - Nantes museum.jpg",
    caption:
      "A copy of the 1742 edition of the Code Noir on display at the Musée d'histoire de Nantes — the museum of France's largest slave-trading port. Modern photograph (2012) of an eighteenth-century book.",
    shows: "historical_document",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Selbymay",
    institution: "Musée d'histoire de Nantes",
    objectDate: "photographed January 2012",
  }),
  capFrancais: commonsPicture({
    fileName: "Vue du Cap-Français (Nicolas Ozanne et Nicolas Ponce).png",
    caption:
      "'Vue du Cap-Français' — Cap-Français (today Cap-Haïtien), the chief port of Saint-Domingue, engraved by Nicolas Ponce after Nicolas Ozanne for Moreau de Saint-Méry's Recueil de vues (1791). An eighteenth-century engraving of the port where ships from Ouidah and Porto-Novo landed people.",
    shows: "engraving",
    identificationStatus: "secure",
    licence: "Public domain (Creative Commons Public Domain Mark 1.0)",
    creator: "Nicolas Ponce and Nicolas Ozanne",
    institution: "Bibliothèque nationale de France (Gallica)",
    objectDate: "1791",
  }),
  moreauPortrait: commonsPicture({
    fileName: "Mederic-Louis-Elie Moreau de Saint-Mery MET DT203407.jpg",
    caption:
      "Portrait of Médéric Louis Élie Moreau de Saint-Méry in pastel and black chalk by James Sharples, 1798 — made in the United States in the same years he published his description of Saint-Domingue, with its account of 'Vaudoux' among the Arada. An eighteenth-century portrait drawing.",
    shows: "portrait",
    identificationStatus: "secure",
    licence: "CC0 1.0",
    creator: "James Sharples",
    institution: "Metropolitan Museum of Art",
    accessionNumber: "24.109.89",
    objectDate: "1798",
  }),
  newOrleans1728: commonsPicture({
    fileName: "New orleans plan 1728.jpg",
    caption:
      "'Plan de la Nouvelle Orleans, capitale de la Louisiane, 1728', in an 1886 reprint by the US Census Office: the town as it stood while the Company of the Indies' slave ships, some from Ouidah, were arriving. An eighteenth-century plan in a nineteenth-century reproduction.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain (Creative Commons Public Domain Mark 1.0)",
    creator: "Unknown French surveyor (reprinted in G. E. Waring Jr., Report on the Social Statistics of Cities, 1886)",
    objectDate: "1728 (reprint 1886)",
  }),
  paramariboMap: commonsPicture({
    fileName: "AMH-8055-KB Map of Paramaribo.jpg",
    caption:
      "'Plan de la Ville de Paramaribo', an engraved plan of Suriname's capital published in 1780 by E. van Harrevelt and D. J. Changuion. An eighteenth-century map of the port where captives from the Bight of Benin, among others, were landed.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain (Creative Commons Public Domain Mark 1.0)",
    creator: "Unknown surveyor; published by E. van Harrevelt and D. J. Changuion",
    institution: "Koninklijke Bibliotheek, The Hague",
    accessionNumber: "693 C 6 dl. XXI, to p. 76",
    objectDate: "1780",
  }),
  paramariboView: commonsPicture({
    fileName: "AMH-6915-KB View of the city of Paramaribo and fort Zeelandia.jpg",
    caption:
      "'Gezicht op de stad Paramaribo en fort Zeelandia' — the waterfront of Paramaribo with Fort Zeelandia, engraved by Jacobus van der Schley around 1770. An eighteenth-century engraving.",
    shows: "engraving",
    identificationStatus: "secure",
    licence: "Public domain (Creative Commons Public Domain Mark 1.0)",
    creator: "Jacobus van der Schley",
    institution: "Koninklijke Bibliotheek, The Hague",
    accessionNumber: "136 C 5 deel II, na p. 566, 2",
    objectDate: "c. 1770",
  }),
  saramaka1910: commonsPicture({
    fileName: "Saramaka-1910.jpg",
    caption:
      "UNVERIFIED — published in 1910 by Harry Johnston as 'A Bush-Negro of the Saramaka tribe, Dutch Guiana'; the Commons file notes that the identification is probably wrong and the man is more likely Ndyuka. What it shows securely: a Surinamese Maroon man photographed in the early twentieth century, from the Maroon communities whose cultures Herskovits, and later Mintz and Price, made central to the 'survivals' debate.",
    shows: "evidence_photograph",
    identificationStatus: "unverified",
    licence: "Public domain (Creative Commons Public Domain Mark 1.0)",
    creator: "Sir Harry Hamilton Johnston",
    institution: "New York Public Library",
    objectDate: "published 1910",
  }),
  landaluze: commonsPicture({
    fileName: "Víctor Patrício de Landaluze - Día de Reyes en La Habana.jpg",
    caption:
      "'Día de Reyes en La Habana' by Víctor Patricio de Landaluze, oil on canvas, nineteenth century (c. 1850s–80s): Afro-Cubans of the cabildos dancing in the streets on Epiphany, the one day each year the colonial authorities allowed the 'nations' to parade. A nineteenth-century painting by a Spanish-Cuban artist whose images of Black Cubans are often caricatural.",
    shows: "later_artwork",
    identificationStatus: "secure",
    licence: "Public domain (author died 1889; Creative Commons Public Domain Mark 1.0)",
    creator: "Víctor Patricio de Landaluze (1830–1889)",
    institution: "Museo Nacional de Bellas Artes, Havana",
    objectDate: "19th century",
  }),
  rosarioPretos: commonsPicture({
    fileName: "Igreja do Rosário dos Pretos no Pelourinho.jpg",
    caption:
      "The church of Nossa Senhora do Rosário dos Pretos in the Pelourinho, Salvador, built in the eighteenth century by a Black lay brotherhood. Modern photograph (2007). It is the best-known brotherhood church in the city; the Jeje brotherhood discussed here met elsewhere, in the Corpo Santo chapel.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "JLPizzol",
    objectDate: "photographed December 2007",
  }),
  cachoeiraStreet: commonsPicture({
    fileName: "Rua Cel Rui Cachoeira Bahia Brazil 2017-8242.jpg",
    caption:
      "A street of colonial houses in Cachoeira, in Bahia's Recôncavo, photographed in 2017. Modern photograph of the town where a Jeje calundu was raided in 1785; it does not show the Rua do Pasto site itself.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Paul R. Burley",
    objectDate: "photographed October 2017",
  }),
  autoDeFe: commonsPicture({
    fileName: "Auto de Fé no Rossio 1744.png",
    caption:
      "'Representação de um Auto de Fé no Rossio, em Lisboa' — an eighteenth-century print of an auto-da-fé in Lisbon's Rossio square (dated in its title to 1744, in the catalogue to c. 1741). The kind of public ceremony at which the Inquisition sentenced Africans tried for 'feitiçaria', among them Domingos Álvares in 1744.",
    shows: "engraving",
    identificationStatus: "secure",
    licence: "Public domain (published before 1931; Creative Commons Public Domain Mark 1.0)",
    creator: "Unknown",
    institution: "Biblioteca Nacional de Portugal",
    objectDate: "c. 1741–1744",
  }),
  castroMarim: commonsPicture({
    fileName: "Castro Marim Castle 01.jpg",
    caption:
      "Inside the old castle of Castro Marim in the Algarve, a town the Portuguese Crown and Inquisition used as a place of internal exile. Modern photograph (2007); Domingos Álvares was banished here in 1744.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 2.5",
    creator: "Marc Ryckaert (MJJR)",
    objectDate: "photographed April 2007",
  }),
  nkangiBrooklyn: commonsPicture({
    fileName: "Brooklyn Museum 2011.74 Crucifix Nkangi Kiditu.jpg",
    caption:
      "A Kongo cast copper-alloy crucifix (nkangi kiditu), early seventeenth century, with kneeling figures on the arms and below the feet — Christian imagery made and used in the Kingdom of Kongo two centuries before most of the people of Saint-Domingue were shipped. Museum photograph of the object.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY 3.0",
    creator: "Unknown Kongo artist; photograph Brooklyn Museum",
    institution: "Brooklyn Museum",
    accessionNumber: "2011.74",
    objectDate: "early 17th century",
  }),
  nkangiTervuren: commonsPicture({
    fileName: "Nkangi kiditu MRAC HO.1949.211.1.jpg",
    caption:
      "A nkangi kiditu crucifix that belonged to a Ndibu (Kongo) chief of the Tumba area, perhaps made for a Capuchin missionary; dated by the museum, tentatively, to the seventeenth century. Modern photograph (2017) of the object at the Royal Museum for Central Africa.",
    shows: "artefact",
    identificationStatus: "probable",
    licence: "CC BY 4.0 (photograph); object public domain",
    creator: "Unknown Kongo artist; photograph Marie-Lan Nguyen",
    institution: "Royal Museum for Central Africa, Tervuren",
    accessionNumber: "HO.1949.211.1",
    objectDate: "17th century (?)",
  }),
  herskovits1960: commonsPicture({
    fileName:
      "Melville J. Herskovits and Nigerian Prime Minister Abubakar Tafawa Balewa posed holding a stack of books at Northwestern University.png",
    caption:
      "Melville J. Herskovits with Nigeria's Prime Minister Abubakar Tafawa Balewa at Northwestern University, 1960 — two decades after The Myth of the Negro Past, as the founder of African studies at Northwestern. A news photograph.",
    shows: "portrait",
    identificationStatus: "secure",
    licence: "Public domain in the United States (published 1931–1977 without a copyright notice)",
    creator: "Unknown photographer",
    institution: "New York Public Library Digital Collections",
    objectDate: "1960",
  }),
  herskovitsAreas: commonsPicture({
    fileName: "AreasCulturais-Africa-Herskovits.jpg",
    caption:
      "A modern redrawing (2011) of Melville Herskovits's 1945 map of the 'culture areas' of Africa. A modern diagram after a mid-twentieth-century scheme — the kind of classification Herskovits used to trace 'Africanisms' back to regions.",
    shows: "diagram",
    identificationStatus: "modern_interpretation",
    licence: "Public domain (released by the uploader, CostaPPPR)",
    creator: "CostaPPPR, after Melville J. Herskovits",
    objectDate: "2011 (after a 1945 map)",
  }),
  frazier: commonsPicture({
    fileName: "DR. E. FRANKLIN FRAZIER - SOCIOLOGIST - NARA - 535674.jpg",
    caption:
      "Dr E. Franklin Frazier, sociologist, drawn by Charles Alston for the Office of War Information in 1943 — four years after The Negro Family in the United States. A mid-twentieth-century portrait drawing.",
    shows: "portrait",
    identificationStatus: "secure",
    licence: "Public domain (US federal government work)",
    creator: "Charles Alston, for the Office of War Information",
    institution: "US National Archives and Records Administration",
    accessionNumber: "NAID 535674",
    objectDate: "1943",
  }),
  casaMinasFacade: commonsPicture({
    fileName: "Fachada da casa.jpg",
    caption:
      "The street front of the Terreiro Casa das Minas Jeje, Rua de São Pantaleão 857, São Luís do Maranhão. Modern photograph (2018) of the house whose oldest known document is an 1847 deed in the name of Maria Jesuína.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Clecio Muller França Leal (Mullerlux)",
    objectDate: "photographed September 2018",
  }),
  casaMinasPlaque: commonsPicture({
    fileName: "Placa Casa das Minas.jpg",
    caption: "A plaque on the Casa das Minas in São Luís, photographed in 2023. Modern photograph.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC0 1.0",
    creator: "César Aquino Bezerra",
    objectDate: "photographed July 2023",
  }),
  brazilHouseAccra: commonsPicture({
    fileName: "Brazil House, Accra.jpg",
    caption:
      "Brazil House on Brazil Lane, James Town, Accra — the house associated with the Tabom, descendants of Afro-Brazilian returnees, now a heritage site. Modern photograph (2021) of a rebuilt and restored building.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Fquasie",
    objectDate: "photographed June 2021",
  }),
  casaBrasilOuidah: commonsPicture({
    fileName: "Ouidah 05.jpg",
    caption:
      "The 'Casa do Brasil' museum in Ouidah, which presents the shared history of Bénin and Brazil. Modern photograph (2024); a heritage institution of the present, not a nineteenth-century returnee house.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY 4.0",
    creator: "Satovgrad",
    objectDate: "photographed December 2024",
  }),
  portoNovoMosque: commonsPicture({
    fileName: "Grande mosquee porto-novo.jpg",
    caption:
      "The Great Mosque of Porto-Novo, built in the early twentieth century in the Afro-Brazilian style, its painted façade recalling the baroque churches of Bahia. Modern photograph (2009).",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0 / GFDL 1.2",
    creator: "Babylas",
    objectDate: "photographed March 2009",
  }),
  waterHouseLagos: commonsPicture({
    fileName: "Water house Lagos Island.jpg",
    caption:
      "The Water House on Kakawa Street, Lagos Island, built by the returnee João Esan da Rocha and extended by his son Candido — one of the last surviving Brazilian-style houses of Lagos's old Brazilian Quarter. Modern photograph (2023).",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Beendy234",
    objectDate: "photographed September 2023",
  }),
  badagryMuseum: commonsPicture({
    fileName: "Mobee Royal Family Slave Relics Museum Badagry.jpg",
    caption:
      "The Mobee Royal Family Slave Relics Museum at Badagry, which keeps chains and other relics of the trade through the port. Modern photograph (2022) of a present-day memorial museum.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Tolulope Sanusi",
    objectDate: "photographed February 2022",
  }),
  pythonTemple: commonsPicture({
    fileName: "Entrée du Temple des Pythons (Ouidah).jpg",
    caption:
      "The entrance of the Temple of Pythons in Ouidah, Bénin, where royal pythons associated with Dangbe/Dan are kept. Modern photograph (2017) of a present-day shrine on a site whose eighteenth-century founding is a tradition (see benin-vodun).",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Ji-Elle",
    objectDate: "photographed March 2017",
  }),
  veveDamballa: commonsPicture({
    fileName: "VeveDamballah.svg",
    caption:
      "A vèvè — a ritual ground drawing of Haitian Vodou — for Danbala and Ayida Wèdo, the paired serpent lwa, redrawn as a vector graphic in 2005–2007 from hand-drawn designs. A modern drawing of one common form; vèvè are traced in cornmeal for each ceremony and vary between houses.",
    shows: "diagram",
    identificationStatus: "modern_interpretation",
    licence: "Public domain",
    creator: "Chrkl",
    objectDate: "2005–2007",
  }),
  oxumareRelief: commonsPicture({
    fileName: "Carybè, rilievi degli orixas, oxumare 01.JPG",
    caption:
      "Carybé's carved relief of the orixá Oxumarê, the rainbow serpent of Candomblé, in the Museu Afro-Brasileiro, Salvador. A twentieth-century artwork by the Argentine-Brazilian artist Carybé, photographed in 2013.",
    shows: "later_artwork",
    identificationStatus: "secure",
    licence: "CC BY 3.0",
    creator: "Sailko (photograph); Carybé (relief)",
    institution: "Museu Afro-Brasileiro, Salvador",
    objectDate: "photographed November 2013",
  }),
  laveauKemble: commonsPicture({
    fileName: "Marie Laveau by E.W. Kemble.png",
    caption:
      "E. W. Kemble's imagined etching of Marie Laveau and her daughter, drawn in 1885 for George W. Cable's 'Creole Slave Songs' (Century Magazine, 1886), years after the elder Laveau's death. A late-nineteenth-century illustration, not a portrait from life — part of the literary record that produced the 'Zombi' snake legend.",
    shows: "later_artwork",
    identificationStatus: "secure",
    licence: "Public domain in the United States (published before 1931)",
    creator: "E. W. Kemble",
    objectDate: "1885",
  }),
};

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

const events: SeedEvent[] = [
  // =========================================================================
  // 1. ANCHOR
  // =========================================================================
  {
    slug: "vodun-atlantic-what-crossed",
    title: "What crossed the Atlantic, what could not, and how anyone knows",
    summary:
      "People taken from the Bight of Benin could carry knowledge, names, songs, skills and obligations; they could not carry shrines, lineages, land, priesthoods intact or the political order that held them. This record sets out what the evidence can show about each.",
    description:
      "THE QUESTION. Between the sixteenth and the nineteenth centuries very large numbers of people were deported from the coast between the Volta and Lagos to the Americas. Benin-vodun's record 'Across the Atlantic' says that the religions which took shape at the far end — Vodou in Haiti, the Jeje nation within Candomblé in Brazil, Arará in Cuba, the vodu strand of Winti in Suriname, Voodoo in Louisiana — are related traditions, not transplanted copies. This record asks the next question: WHAT, CONCRETELY, COULD CROSS, AND HOW DO WE KNOW?\n\n" +
      "WHAT COULD CROSS. Things that live in people: language and ritual vocabulary; the names of powers (Legba, Dan, Hevioso, Sakpata, the vodun of the Abomey royal family); songs, drum rhythms and dance; techniques of healing and divination held in memory; the knowledge of how to prepare a shrine; and the obligations a person owed to a vodun that had claimed them. Initiates crossed — priests and priestesses among the captives are documented, the best-known individual being Domingos Álvares.\n\n" +
      "WHAT COULD NOT. Things that live in places and institutions: the shrine and its accumulated objects; the sacred grove and the land it stood on; the lineage that owned a cult and passed it down; the full sequence of initiation, which needs elders, time and a community; the royal order that sponsored, regulated and taxed cults in Dahomey; and the ancestors' graves. Every one of these had to be REBUILT, often from fragments, among strangers and under prohibition.\n\n" +
      "HOW HISTORIANS KNOW. Five kinds of evidence, each with limits. (1) VOYAGE RECORDS give ports, dates and numbers — the movement of people is not in doubt — but say nothing about belief. (2) NATION LABELS in colonial records (Arada, Mina, Jeje, Nagô) tie communities to regions of embarkation, but were made by traders and notaries. (3) HOSTILE RECORDS — Inquisition trials, police raids, colonial law — are the richest descriptions of practice, written by people trying to stamp it out. (4) ETHNOGRAPHY of the nineteenth and twentieth centuries records living religions after generations of change. (5) RITUAL LANGUAGE AND NAMES in the traditions themselves are internal evidence of origin. None of them is a description of belief written by the deported themselves before the nineteenth century.\n\n" +
      "SIGNIFICANCE. This is the hinge of the whole six-track expansion: between the Vodun of West Africa and the religions of the Americas lies an event that destroyed most of the institutions religion depends on. What survived it did so because people chose to remember and rebuild under the worst conditions imaginable. That is why 'survival' is the wrong word on its own: what the evidence shows is reconstruction, and the reconstruction is itself the religious history.\n\n" +
      "THINGS TO ASK: For any practice said to have 'come from Africa', which of the five kinds of evidence supports it?",
    category: "religion",
    subcategory: "What crossed",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(
      ["place: ouidah", "practice: initiation and priesthood", "practice: ancestors", "place: saint-domingue and haiti", "place: bahia and brazil", "place: cuba"],
      "method",
      "middle passage",
      "transmission"
    ),
    civilisations: ["Fon", "Aja", "Hueda", "Gbe-speaking peoples", "Kongo", "Yoruba"],
    people: ["Domingos Álvares"],
    locationName: "The Bight of Benin and the Atlantic",
    media: [P.brookes, P.norrisMap],
    claims: [
      {
        sourceKey: "eltis_richardson_atlas_2010",
        citations: [
          { sourceKey: "slavevoyages_tastdb", relation: "supports", note: "Documented voyages from the Bight of Benin at both ends of the span; figures to be checked against the current release." },
          { sourceKey: "thornton_africa_africans_1998", relation: "context", note: "Africans as participants in an Atlantic world from the fifteenth century." },
        ],
        startYear: 1550,
        endYear: 1865,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period of forced transportation from the Bight of Benin",
        originalDateText: "From the mid-sixteenth century to the 1860s",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Voyage, customs and colonial records document departures from this coast from the sixteenth century (people called Arada are in Spanish America by the 1560s) to the last illegal shipments of the 1860s. The range dates the MOVEMENT OF PEOPLE; it does not date the formation of any religion, which happened afterwards and is not datable as an event.",
      },
      {
        sourceKey: "sweet_recreating_africa_2003",
        citations: [
          { sourceKey: "mintz_price_1976", relation: "context", note: "The opposite emphasis: rebuilding from heterogeneous crowds rather than continuing." },
        ],
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "unknown",
        whatIsDated: "When transmitted knowledge became rebuilt religious communities",
        originalDateText: "Not datable: reconstruction happened at different times in each colony, over generations",
        datingMethod: "other",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Whether knowledge 'crossed' is inferred from later evidence (trials, names, ethnography) read back against the voyage data. No source records the moment a tradition was carried or rebuilt, and assigning one would invent it.",
      },
    ],
  },

  // =========================================================================
  // 2. NUMBERS
  // =========================================================================
  {
    slug: "bight-of-benin-two-million-estimate",
    title: "About two million: the estimate for the Bight of Benin, and what kind of number it is",
    summary:
      "Published work drawing on the slave-trade database puts embarkations from the Slave Coast at roughly two million people, about a sixth of the whole Atlantic trade. That is an ESTIMATE, not a count of surviving records — and this record says why the difference matters.",
    description:
      "WHAT IS BEING ADDED. Benin-atlantic's record 'How many people were shipped from this coast' deliberately quotes no number, because the database could not be reached. This record supplies the figure that circulates in published scholarship, with its status attached.\n\n" +
      "THE FIGURE. Finn Fuglestad's Slave Traders by Invitation (2018) gives about TWO MILLION people embarked from the Slave Coast — roughly 16 per cent of about 12.5 million carried across the Atlantic — and suggests that more than half of them left from the open beach south of Ouidah. Eltis and Richardson's Atlas of the Transatlantic Slave Trade (2010), built on the same database, places the Bight of Benin among the principal regions of embarkation, behind West-Central Africa, which supplied the largest share throughout.\n\n" +
      "WHAT KIND OF NUMBER IT IS. An ESTIMATE. The Trans-Atlantic Slave Trade Database holds DOCUMENTED voyages — ships whose papers survive, many with a count of people — and on top of them its compilers model the voyages whose records are lost, by flag, period and region. The documented total for any region is smaller than the estimate, and the estimate is revised as new records are found. The Atlas says plainly that its totals are estimates rather than documented departures. A modelled two million and a documented count must never be written as the same kind of fact.\n\n" +
      "WHAT IT COUNTS AND WHAT IT DOES NOT. Embarkations: people put on board. It does not count those who died between capture and the coast, nor say where in the interior people came from — a port of embarkation is not a homeland. Captives from the Mahi country, the Yoruba interior and further north left from the same beaches as people from Allada and Hueda.\n\n" +
      "SIGNIFICANCE. For religious history the scale matters in a specific way: a population this large, concentrated in particular decades and sent to particular colonies (Bahia, Saint-Domingue, Cuba in the nineteenth century), is what made it possible for Gbe-speaking people to find one another in the Americas and rebuild worship in a shared language. The number is also people, each of whom had a vodun, an ancestor or a family.\n\n" +
      "THINGS TO ASK: When a total appears in a sentence, is it documented or estimated, and from which release?",
    category: "history",
    subcategory: "Numbers and records",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["place: ouidah", "place: porto-novo"], "numbers", "slavevoyages", "method"),
    civilisations: ["Gbe-speaking peoples", "Yoruba", "Mahi"],
    people: ["Finn Fuglestad", "David Eltis", "David Richardson"],
    locationName: "The Bight of Benin (Volta to the Nun)",
    lat: 6.3,
    lng: 2.4,
    media: [P.mollMap, P.triangleMap],
    claims: [
      {
        sourceKey: "fuglestad_slave_traders_2018",
        citations: [
          { sourceKey: "wikipedia_slave_coast", relation: "supports", note: "Route by which the figure and its page range were found." },
          { sourceKey: "eltis_richardson_atlas_2010", relation: "context", note: "States that its regional totals are estimates built on documented voyages." },
          { sourceKey: "slavevoyages_tastdb", relation: "context", note: "The database the estimate ultimately rests on; NEEDS SOURCE VERIFICATION of the current figure." },
        ],
        startYear: 1550,
        endYear: 1865,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The span over which about two million people were embarked from the Slave Coast (an estimate)",
        originalDateText: "Roughly two million people over three centuries, about 16 per cent of the Atlantic total (estimated)",
        datingMethod: "estimate",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. A modelled ESTIMATE built by historians on top of documented voyage records, reported here from secondary summaries of Fuglestad (2018). It establishes order of magnitude and share; it is not a count of surviving documents, and the documented figure for the region is lower. NEEDS SOURCE VERIFICATION against the current SlaveVoyages estimates.",
      },
    ],
  },

  // =========================================================================
  // 3. PORTS
  // =========================================================================
  {
    slug: "slave-coast-ports-jakin-to-lagos",
    title: "From Jakin to Lagos: the shifting ports of the Slave Coast",
    summary:
      "The trade did not run through one harbour. It moved along a lagoon coast — Offra and Jakin under Allada, Ouidah under Hueda and then Dahomey, Little Popo, Grand-Popo, Porto-Novo, Badagry, and finally Lagos — as kingdoms rose, fought and competed for Europeans.",
    description:
      "THE GEOGRAPHY. The coast from the Volta to Lagos has no natural harbour: a surf-beaten beach backed by lagoons. Ships anchored offshore and people were taken out through the surf in canoes. A 'port' was a beach with a trading town inland and a ruler who controlled access — so ports could move.\n\n" +
      "THE SEQUENCE. In the seventeenth century the kingdom of ALLADA traded through OFFRA and JAKIN. From the later seventeenth century HUEDA's beach at OUIDAH, with its capital at Savi, overtook them. Dahomey conquered Allada in 1724 and Hueda in 1727, and destroyed Jakin in 1732; Ouidah became Dahomey's port. To the west, LITTLE POPO (Aného), settled by people from the Gold Coast, and GRAND-POPO traded independently; AGOUÉ grew in the nineteenth century. To the east, PORTO-NOVO (Hogbonu) and BADAGRY rose from the mid-eighteenth century partly by offering Europeans an alternative to Dahomey, and in the early nineteenth century LAGOS became the largest exporter on the coast until British intervention in 1851.\n\n" +
      "THE NAME. 'Slave Coast' — Côte des Esclaves, Slavenkust — is a European trader's name of the seventeenth century, set beside the Gold and Ivory Coasts on maps like Moll's (1727) and d'Anville's (1729). It names the coast by what Europeans bought there. The peoples of the coast did not call it that.\n\n" +
      "WHY PORTS MATTER FOR RELIGION. The port shaped who was shipped and where. Ouidah's long Portuguese and Brazilian connection sent people to Bahia; French ships at Ouidah and Porto-Novo supplied Saint-Domingue; the nineteenth-century Lagos trade sent Yoruba-speakers (Nagô, Lucumí) to Bahia and Cuba in great numbers. The 'nation' names of the Americas — Arada from Allada, Popo from the Popo beaches — preserve the ports.\n\n" +
      "SIGNIFICANCE. Religious communities in the Americas carry the names of these places and the deities of the peoples behind them. Ouidah itself is a Vodun town (benin-atlantic and benin-vodun), Porto-Novo a Gun and Yoruba one, Lagos a Yoruba one: the shift of the trade eastward over time is one reason the later diaspora religions of Brazil and Cuba are more Yoruba-shaped than the earlier ones of Saint-Domingue.\n\n" +
      "THINGS TO ASK: Which beach did a given ship load at, and which kingdom controlled it that year?",
    category: "history",
    subcategory: "Ports",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["place: ouidah", "place: allada", "place: porto-novo", "place: togo and ewe country", "place: oyo and yorubaland"], "ports", "slave coast", "maps"),
    civilisations: ["Allada", "Hueda", "Dahomey", "Hogbonu (Porto-Novo)", "Lagos", "Badagry", "Little Popo (Aného)"],
    locationName: "The lagoon coast from Little Popo to Lagos",
    media: [P.danvilleMap, P.hansenMap, P.badagryMuseum],
    claims: [
      {
        sourceKey: "law_slave_coast_1991",
        citations: [
          { sourceKey: "wikipedia_slave_coast", relation: "supports", note: "Lists Ouidah, Jakin, Porto-Novo, Badagry, Lagos, Grand-Popo, Little Popo and Agoué as embarkation points." },
          { sourceKey: "law_mann_wmq_1999", relation: "supports", note: "Lagos as the other main embarkation port in the nineteenth century." },
        ],
        startYear: 1650,
        endYear: 1851,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The succession of principal ports, from Allada's Offra and Jakin to Lagos",
        originalDateText: "Seventeenth century to 1851",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. European company records, traders' accounts and voyage data document which beaches were in use and when; Dahomey's conquests of Allada (1724) and Hueda (1727) and the destruction of Jakin (1732) are documented events. Dates for the rise of Porto-Novo and Badagry are approximate.",
      },
      {
        sourceKey: "law_slave_coast_1991",
        citations: [
          { sourceKey: "norris_bossa_ahadee_1789", relation: "context", note: "A trader's map of the coast in 1789 showing the names Europeans used." },
        ],
        startYear: 1650,
        endYear: 1699,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "When the European name 'Slave Coast' came into use",
        originalDateText: "The name 'Slave Coast' arises in the seventeenth century",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The label appears in seventeenth-century European usage and on eighteenth-century maps (Moll 1727, d'Anville 1729). It dates a European naming practice, not anything about the coast's peoples.",
      },
    ],
  },

  // =========================================================================
  // 4. ETHNONYMS
  // =========================================================================
  {
    slug: "nation-names-as-evidence",
    title: "Arada, Rada, Arará, Jeje, Mina, Nagô: what the 'nation' names can prove",
    summary:
      "The names under which Africans were recorded and later worshipped in the Americas are the strongest documentary thread back to the Bight of Benin. They are also traders' categories, and both facts must be held at once.",
    description:
      "THE NAMES. ARADA (French Caribbean) and ARARÁ (Spanish America, Cuba) come from ALLADA; RADA, the Haitian Vodou rite of the 'cool' Dahomean-derived lwa, is the same name. JEJE is the Brazilian name for Gbe-speakers. MINA, from the Portuguese 'Costa da Mina', is used for Gbe-speakers in Brazil and Louisiana but means something else elsewhere. NAGÔ (Brazil, also Haitian 'Nago' lwa) and LUCUMÍ (Cuba) are names for Yoruba-speakers; FON and POPO also appear in French and Dutch records.\n\n" +
      "WHERE THEY APPEAR. In the records of slavery — ship manifests, sale deeds, plantation inventories, baptisms, wills, manumission letters, censuses, police reports — and then in the religions themselves, which call their ritual lineages 'nations' (nação in Candomblé, nanchon in Haitian Vodou, the cabildos de nación of Cuba). A Haitian Vodou ceremony that salutes the Rada and then the Petwo lwa, or a Candomblé house that calls itself Jeje, is recording an origin in its own structure.\n\n" +
      "WHAT THEY PROVE. That communities in the Americas identified, or were identified, with particular coasts and peoples; that these identities persisted for generations; and — when the name is in the religion's own vocabulary — that its members remembered an origin on this coast. Combined with voyage data, nation names let historians test whether a colony really received many people from a region.\n\n" +
      "WHAT THEY DO NOT PROVE. A trader's 'Arada' meant 'shipped from the Allada coast', not 'Allada-born'; two people under one label might share nothing but a beach. Labels also drifted: a 'nation' in nineteenth-century Bahia could be joined by people who learned its language and rites. And a ritual nation is a religious lineage, not an ethnic census.\n\n" +
      "SIGNIFICANCE. The nation is the institution through which African religions were rebuilt in the Americas: Vodun of the Gbe-speakers survives as the Rada rite, the Jeje nation, the Arará cabildos, because people organised worship under these names. The names are therefore BOTH colonial classifications AND the self-chosen frames of religious communities, and the religious history is the passage from the first to the second.\n\n" +
      "THINGS TO ASK: Who first wrote this name down, and who later chose to use it?",
    category: "religion",
    subcategory: "Nations and names",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["place: allada", "place: saint-domingue and haiti", "place: bahia and brazil", "place: cuba", "deity: lwa"], "ethnonyms", "nations", "method"),
    civilisations: ["Arada", "Jeje", "Arará", "Mina", "Nagô", "Lucumí", "Fon", "Allada"],
    locationName: "The Americas, with names pointing to the Bight of Benin",
    media: [P.hansenMap, P.moreauPortrait],
    claims: [
      {
        sourceKey: "hall_slavery_african_ethnicities_2005",
        citations: [
          { sourceKey: "pares_formation_candomble_2013", relation: "supports", note: "Jeje as a label in Bahian records from the early eighteenth century." },
          { sourceKey: "moreau_description_1797", relation: "supports", note: "Arada named in Saint-Domingue as the people of 'Vaudoux'." },
        ],
        startYear: 1560,
        endYear: 1900,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The period over which nation names derived from this coast appear in American records",
        originalDateText: "Arada from the 1560s; Jeje from the early 1700s; Nagô and Lucumí above all in the nineteenth century",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Colonial administrative, notarial and ecclesiastical records. First appearances are LATEST-BY dates for the labels' use; the records are uneven, and the ritual use of the same names in religious communities is documented later, chiefly by nineteenth- and twentieth-century observers.",
      },
    ],
  },

  {
    slug: "mina-a-name-on-three-coasts",
    title: "'Mina': one label, three different coasts",
    summary:
      "'Mina' began with the Portuguese castle of São Jorge da Mina on the Gold Coast, was stretched by Portuguese and Brazilians to the whole 'Costa da Mina' including the Bight of Benin, and in Louisiana and Brazil often meant Gbe-speakers. A single word can therefore point to different peoples.",
    description:
      "WHERE THE WORD COMES FROM. The Portuguese built São Jorge da Mina — Elmina, 'the mine', for gold — on the Gold Coast in 1482. 'Mina' first named that coast and its people. In the seventeenth century, when the Dutch took Elmina (1637) and Portuguese and Brazilian ships traded further east, the 'COSTA DA MINA' came to include the Slave Coast: the 'Costa a sotavento da Mina', the coast leeward of Mina, where Ouidah was.\n\n" +
      "THREE MEANINGS IN THE AMERICAS. (1) In SPANISH AMERICA, 'Mina' generally pointed to the Gold Coast (Akan- and Gã-speakers). (2) In BRAZIL, 'Mina' was a broad label for West Africans shipped from the Costa da Mina — in Bahia and Rio often Gbe- and Yoruba-speakers — sometimes subdivided ('Mina-Jeje', 'Mina-Nagô'); in Maranhão the Gbe-derived religion is called TAMBOR DE MINA and its mother house the CASA DAS MINAS. (3) In LOUISIANA, Hall found that 'Mina' in eighteenth-century records usually meant people from the Bight of Benin coast, among them Gbe-speakers. In Ghana and Togo, finally, 'Mina' today names a Gã-Ewe people of the Aného coast.\n\n" +
      "WHY IT MATTERS FOR RELIGIOUS HISTORY. Reading 'Mina' as Akan everywhere would erase Gbe-speakers from Brazilian and Louisiana history; reading it as Gbe everywhere would erase Akan-speakers from Spanish America. The label must be read with the voyage data for that colony and decade. Hall's work is the standard argument for doing exactly this.\n\n" +
      "SIGNIFICANCE. The word survives inside religion: Tambor de Mina in Maranhão is a living Afro-Brazilian religion whose vodun are named from Dahomey, and its very name records the Portuguese geography of the trade. A ritual tradition remembers its origin by a slaver's coastal label — which is a small, exact picture of how the Atlantic shaped these religions.\n\n" +
      "THINGS TO ASK: In this document, from this colony and this decade, which coast does 'Mina' mean?",
    category: "religion",
    subcategory: "Nations and names",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["place: togo and ewe country", "place: bahia and brazil", "place: new orleans", "place: ouidah"], "ethnonyms", "mina", "tambor de mina"),
    civilisations: ["Mina", "Akan", "Gbe-speaking peoples", "Portuguese", "Gã"],
    locationName: "The Gold Coast, the Bight of Benin, Brazil and Louisiana",
    media: [P.kbGuineaMap, P.danvilleMap],
    claims: [
      {
        sourceKey: "hall_slavery_african_ethnicities_2005",
        citations: [
          { sourceKey: "verger_flux_reflux_1968", relation: "supports", note: "The Portuguese 'Costa da Mina' trade extending to the Bight of Benin." },
          { sourceKey: "law_slave_coast_1991", relation: "context", note: "European nomenclature of the coast." },
        ],
        startYear: 1482,
        endYear: 1800,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "From the founding of São Jorge da Mina to the eighteenth-century use of 'Mina' for the Bight of Benin",
        originalDateText: "1482 (Elmina founded) to the eighteenth-century 'Costa da Mina'",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The founding of Elmina in 1482 is documented; the spread of 'Costa da Mina' to the coast east of the Volta is visible in Portuguese and Brazilian commercial usage and on maps. The date range is for a naming practice, not for any people's identity.",
      },
    ],
  },

  {
    slug: "jeje-nation-in-bahia",
    title: "The Jeje nation in Bahia",
    summary:
      "From the early eighteenth century Gbe-speaking Africans in Bahia were recorded, and organised themselves, as 'Jeje'. Their vodun worship is documented in the 1700s and became one of the nations of Candomblé — the strongest case of Vodun religious structure continuing in Brazil.",
    description:
      "THE NAME. 'Jeje' appears in Bahian records from the early eighteenth century for Africans from the Gbe-speaking coast and its hinterland — Fon, Mahi, Gun, Hueda, Allada peoples, among others. Its derivation is not settled; Parés treats it as a term that came to cover Gbe-speakers collectively in Brazil. Benin-vodun notes the name; this record follows the community.\n\n" +
      "THE DOCUMENTS. Luis Nicolau Parés reconstructed Jeje life in Bahia from manumission letters, wills, sale deeds, censuses, brotherhood records and police files. They show Jeje men and women forming households, buying freedom, joining Catholic brotherhoods organised by nation, and — in hostile records — holding vodun ceremonies: the calundu raided at Cachoeira in 1785, led by a Dahomean, is the clearest case. Jeje were among the largest African groups in Bahia in the eighteenth century, reflecting Bahia's direct tobacco trade with Ouidah.\n\n" +
      "THE RELIGION. In the nineteenth century, terreiros (temple-communities) took shape in Salvador and the Recôncavo. The Jeje houses — such as the Bogum in Salvador and the Jeje houses of Cachoeira — worship vodun under Gbe names (Sogbo, Bessen, Azonsu, Loko) with Gbe-derived ritual language. Parés argues that Jeje ritual structures, older than the Nagô (Yoruba) dominance of the later nineteenth century, helped shape Candomblé as a whole.\n\n" +
      "THE DISPUTE. J. Lorand Matory rejects the claim that memory of earlier Jeje structures shaped twentieth-century Candomblé, emphasising instead the Lagos–Bahia traffic that made Nagô the prestige nation. Both agree that Jeje is a documented nation with documented Gbe roots; they disagree about its weight in the formation of Candomblé.\n\n" +
      "SIGNIFICANCE. The Jeje nation is where Vodun as such — vodun named as vodun, served by initiates in Gbe ritual language — is best documented continuing in the Americas. It is a Brazilian religion, shaped by Catholicism, by Nagô neighbours and by two centuries in Bahia; and it is also the clearest evidence that some of the institutional knowledge of Vodun crossed with the people who held it.\n\n" +
      "THINGS TO ASK: Is a Jeje house today a survival, a reconstruction, or a nineteenth-century Brazilian creation that keeps Gbe names?",
    category: "religion",
    subcategory: "Brazil",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["place: bahia and brazil", "practice: initiation and priesthood", "deity: heviosso", "deity: dan and aido-hwedo", "deity: sakpata"], "jeje", "candomble"),
    civilisations: ["Jeje", "Fon", "Mahi", "Nagô"],
    people: ["Luis Nicolau Parés", "J. Lorand Matory"],
    locationName: "Salvador and the Recôncavo, Bahia",
    lat: -12.97,
    lng: -38.51,
    media: [P.capoeiraBahia, P.casaMinasFacade],
    claims: [
      {
        sourceKey: "pares_formation_candomble_2013",
        citations: [
          { sourceKey: "reis_magia_jeje_1988", relation: "supports", note: "The 1785 Jeje calundu in Cachoeira as documented vodun practice." },
          { sourceKey: "matory_black_atlantic_religion_2005", relation: "disputes", note: "Rejects the weight Parés gives to Jeje structures in forming Candomblé." },
        ],
        startYear: 1700,
        endYear: 1739,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "First appearance of 'Jeje' as a nation label in Bahian records",
        originalDateText: "Early eighteenth century",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Notarial and ecclesiastical records from Bahia. A latest-by date for the label, not for the presence of Gbe-speakers, who were arriving earlier; the precise first occurrence NEEDS SOURCE VERIFICATION against Parés.",
      },
      {
        sourceKey: "pares_formation_candomble_2013",
        citations: [
          { sourceKey: "matory_black_atlantic_religion_2005", relation: "context", note: "Dates the consolidation of Candomblé's prestige houses to the later nineteenth and twentieth centuries." },
        ],
        startYear: 1800,
        endYear: 1899,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Formation of Jeje terreiros as lasting temple-communities",
        originalDateText: "Nineteenth century, by the houses' own traditions and police records",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Combines police and press records with the houses' own foundation traditions, which are religious and oral and give earlier dates than documents can confirm.",
      },
    ],
  },

  // =========================================================================
  // 5. DESTINATIONS
  // =========================================================================
  {
    slug: "arada-in-saint-domingue",
    title: "Arada in Saint-Domingue: the Bight of Benin in a sugar colony",
    summary:
      "French ships loading at Ouidah and Porto-Novo carried many thousands of Gbe-speakers to Saint-Domingue. Planters called them Arada, and the first written description of 'Vaudoux' (1797) ascribed the cult to them. They met, worked and worshipped beside a majority from West-Central Africa.",
    description:
      "THE ROUTE. Through the eighteenth century the French were among the main buyers at Ouidah and later at Porto-Novo, and Saint-Domingue — the richest sugar and coffee colony in the Caribbean — was their main market. Arriving at Cap-Français, Port-au-Prince and Les Cayes, people from the Bight of Benin were labelled ARADA (from Allada) or by narrower names (Fon, Nago, Mahi). By the later eighteenth century, however, the largest share of Africans in the colony came from West-Central Africa (the 'Congo').\n\n" +
      "THE FIRST DESCRIPTION. Médéric Louis Élie Moreau de Saint-Méry, a colonial lawyer, published in 1797 a description of a dance and cult called 'VAUDOUX' which he said came from the Arada: a non-venomous serpent at its centre, a 'king' and 'queen' who spoke for it, initiates, possession and secrecy. It is a hostile outsider's account, written by a defender of slavery, and later writers copied it endlessly. It is still the earliest extended written description of what became Haitian Vodou, and its name for the religion is a Gbe word.\n\n" +
      "TWO SOURCE REGIONS. John Thornton argues that Saint-Domingue's religion drew in large measure on two African worlds: the Gbe-speaking region around Dahomey, and Kongo with its own long Catholic history. The structure of Haitian Vodou records both: the RADA rite with lwa of Gbe origin, and the PETWO and Kongo rites. Benin-vodun's 'Legba and Papa Legba' follows one name across.\n\n" +
      "SIGNIFICANCE. Saint-Domingue is where Gbe-derived religion became part of a NEW religion, Haitian Vodou, under the most lethal plantation regime of the Caribbean and, after 1791, through a revolution. The Haitian track (anchor: haitian-vodou-formation-saint-domingue) takes up that history; this record fixes the Atlantic end — which ships, from which ports, under which label.\n\n" +
      "THINGS TO ASK: If the Arada were not the majority in the colony, why did the Rada name stand first in Vodou?",
    category: "religion",
    subcategory: "Destinations",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["place: saint-domingue and haiti", "place: allada", "place: ouidah", "deity: lwa", "practice: serpent veneration"], "arada", "rada", "saint-domingue"),
    civilisations: ["Arada", "Fon", "Nago", "Kongo", "French Saint-Domingue"],
    people: ["Médéric Louis Élie Moreau de Saint-Méry", "John Thornton"],
    locationName: "Cap-Français and the plantations of Saint-Domingue",
    lat: 19.76,
    lng: -72.2,
    media: [P.capFrancais, P.moreauPortrait],
    claims: [
      {
        sourceKey: "moreau_description_1797",
        citations: [
          { sourceKey: "thornton_racines_vaudou_1998", relation: "context", note: "Two source regions, Dahomey and Kongo, for Saint-Domingue's religion." },
        ],
        startYear: 1797,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Publication of the first extended description of 'Vaudoux' ascribed to the Arada",
        originalDateText: "Moreau de Saint-Méry's Description, Philadelphia, 1797",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The publication date is secure. What it describes was observed before the revolution of 1791 and is a hostile outsider's account; it dates the first extended WRITTEN description, not the origin of the practice.",
      },
      {
        sourceKey: "thornton_racines_vaudou_1998",
        citations: [
          { sourceKey: "eltis_richardson_atlas_2010", relation: "supports", note: "French purchases at the Bight of Benin and Saint-Domingue as their main market." },
        ],
        startYear: 1700,
        endYear: 1791,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The main period of French shipments from the Bight of Benin to Saint-Domingue",
        originalDateText: "The eighteenth century until the revolution of 1791",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. French shipping and plantation records as analysed by historians. Proportions by region shift over the century; exact shares NEED SOURCE VERIFICATION against the database.",
      },
    ],
  },

  {
    slug: "ouidah-to-louisiana-1719-1731",
    title: "Ships from Ouidah to French Louisiana, 1719–1731",
    summary:
      "Almost all the Africans brought to French Louisiana came on Company of the Indies ships in a dozen years, 1719–1731. Most came from Senegambia, but ships also loaded at Ouidah — the first, the Aurore, landed 200 people in June 1719.",
    description:
      "THE VOYAGES. The Company of the Indies, which held the French slave-trade monopoly to Louisiana, sent its first two slave ships in 1719. One, the AURORE, left Saint-Malo in 1718, loaded captives at Whydah (Ouidah) and Cape Lahou, and on 6 June 1719 landed 200 of the 201 people embarked — arriving with the Duc du Maine from Senegambia. Over the next twelve years some two dozen ships followed. Gwendolyn Midlo Hall's reconstruction shows that Senegambia, where the Company had its main posts, supplied the majority, with a significant minority from the Bight of Benin; after 1731 almost no ships came directly from Africa until the Spanish period.\n\n" +
      "WHY A SHORT WINDOW MATTERS. Hall argues that this early, concentrated arrival — Bambara and Wolof from Senegambia, Gbe-speakers from Ouidah — laid down Louisiana's Afro-Creole culture before later arrivals. Records from Louisiana use 'Mina', 'Fon' and 'Arada' among their nation labels.\n\n" +
      "WHAT IT DOES AND DOES NOT EXPLAIN. It explains why Gbe vocabulary and names could be present in eighteenth-century Louisiana. It does not explain Louisiana Voodoo by itself: nineteenth-century New Orleans religion was reshaped by the arrival in 1809–10 of some 10,000 refugees from Saint-Domingue (via Cuba), by Kongo-derived practice, and by Catholicism. The Americas track (anchor: louisiana-voodoo-formation) takes that up.\n\n" +
      "SIGNIFICANCE. This is the thinnest but most direct line between Ouidah and the Mississippi: documented ships from the Vodun coast to the colony whose religion the world later knew as 'Voodoo'. It also warns against easy derivation — the line is real but short, and most of what made Louisiana Voodoo happened later and elsewhere.\n\n" +
      "THINGS TO ASK: How much of a religion can be traced to a dozen years of voyages a century before it was described?",
    category: "history",
    subcategory: "Destinations",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["place: new orleans", "place: ouidah"], "louisiana", "company of the indies", "aurore"),
    civilisations: ["Company of the Indies", "Gbe-speaking peoples", "Bambara", "Wolof"],
    people: ["Gwendolyn Midlo Hall", "Captain Herpin"],
    locationName: "Ouidah to Biloxi, Dauphin Island and New Orleans",
    lat: 29.958,
    lng: -90.065,
    media: [P.newOrleans1728, P.mollMap],
    claims: [
      {
        sourceKey: "wikipedia_aurore_ship",
        citations: [
          { sourceKey: "slavevoyages_tastdb", relation: "supports", note: "The Aurore's voyage is a documented voyage in the database (as cited by the article)." },
          { sourceKey: "hall_africans_colonial_louisiana_1992", relation: "supports", note: "First African captives in Louisiana in 1719." },
        ],
        startYear: 1719,
        startMonth: 6,
        startDay: 6,
        datePrecision: "day",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        whatIsDated: "Arrival in Louisiana of the Aurore, loaded at Ouidah",
        originalDateText: "6 June 1719",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. French shipping records as entered in the voyage database: 201 embarked, 200 landed. A documented voyage, not an estimate.",
      },
      {
        sourceKey: "hall_africans_colonial_louisiana_1992",
        citations: [
          { sourceKey: "hall_slavery_african_ethnicities_2005", relation: "context", note: "Louisiana 'Mina' as Bight of Benin people." },
        ],
        startYear: 1719,
        endYear: 1731,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "The Company of the Indies' direct African slave trade to Louisiana",
        originalDateText: "1719–1731",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Company of the Indies records analysed by Hall. The number of ships loaded at Ouidah versus Senegambia NEEDS SOURCE VERIFICATION against Hall and the database.",
      },
    ],
  },

  {
    slug: "bahia-bight-of-benin-tobacco-route",
    title: "Tobacco for captives: the direct route between Bahia and the Bight of Benin",
    summary:
      "For two centuries ships sailed straight from Salvador da Bahia to Ouidah and back, bypassing Europe, trading Bahian tobacco for people. Pierre Verger's 'Flux et reflux' showed how this route tied the religion of the two coasts together.",
    description:
      "THE ROUTE. Unlike the 'triangular' trade of the textbooks, the Bahia trade was BILATERAL. Ships from Salvador carried rolls of Bahian third-grade tobacco, cured with molasses, and gold and cachaça, to the 'Costa da Mina', bought captives at Ouidah and its neighbours, and sailed back. Tobacco was so desired on the coast that it served as a currency of the trade. The Dutch at Elmina taxed Portuguese ships for the right to trade east of the Volta, and the Portuguese fort at Ouidah (from 1721) existed largely for Bahia.\n\n" +
      "VERGER'S BOOK. Pierre Verger (1902–1996), photographer, ethnographer and initiate in both Bahia and Bénin, began this research in Ouidah in 1949, when he was shown the letters of the nineteenth-century trader José Francisco dos Santos, 'Alfaiate'. His Flux et reflux de la traite des nègres (1968) traced the route from the seventeenth century to the nineteenth, including Dahomean embassies to Bahia and the return of freed Africans — the 'reflux'.\n\n" +
      "WHAT IT MEANT FOR RELIGION. Because the route was direct and lasted so long, Bahia received Gbe-speakers continuously through the eighteenth century and Yoruba-speakers in large numbers in the nineteenth, as the trade shifted east to Porto-Novo, Badagry and Lagos. That sequence is visible in Candomblé: Jeje nation houses with eighteenth-century roots, and Nagô houses that became dominant later. The route also kept carrying news, goods, and eventually people back.\n\n" +
      "SIGNIFICANCE. Benin-atlantic records the de Souza family and Ouidah's Brazilian quarter; this record is the ocean between them. A two-way route lasting two centuries is why Bahia and Ouidah came to share families, saints, foods and vodun — and why the religions of the two coasts must be studied together, not as origin and copy.\n\n" +
      "THINGS TO ASK: What does a direct, two-way route allow that a triangle does not?",
    category: "history",
    subcategory: "Destinations",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["place: bahia and brazil", "place: ouidah", "practice: catholic contact"], "tobacco", "verger", "bahia"),
    civilisations: ["Portuguese Brazil", "Dahomey", "Hueda"],
    people: ["Pierre Verger", "José Francisco dos Santos ('Alfaiate')"],
    locationName: "Salvador da Bahia and Ouidah",
    lat: -12.97,
    lng: -38.51,
    media: [P.casaBrasilOuidah, P.rugendasHold],
    claims: [
      {
        sourceKey: "verger_flux_reflux_1968",
        citations: [
          { sourceKey: "law_ouidah_2004", relation: "supports", note: "The Portuguese fort and Bahian tobacco at Ouidah." },
          { sourceKey: "eltis_richardson_atlas_2010", relation: "context", note: "Bahia as a principal destination of the Bight of Benin trade." },
        ],
        startYear: 1650,
        endYear: 1851,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The direct Bahia–Bight of Benin slave and tobacco trade",
        originalDateText: "Seventeenth century to the closing of the Brazilian trade in 1850–51",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Portuguese and Brazilian customs and commercial records, traders' letters (dos Santos), and voyage data. The start is approximate; the end follows Brazil's effective suppression of the trade in 1850–51.",
      },
    ],
  },

  {
    slug: "bight-of-benin-in-suriname",
    title: "Gbe-speakers in Suriname, and vodu in Winti",
    summary:
      "Roughly one in seven Africans taken to Suriname is estimated to have come from the Bight of Benin. Their presence is visible in Winti, the Afro-Surinamese religion formed from Akan, Gbe and Kongo traditions — including a snake spirit called Fodu.",
    description:
      "THE NUMBERS. Estimates reported by Robert Borges (2014), drawing on Van Stipriaan and the voyage data, put the Africans taken to Suriname at about 220,000: about 27 per cent from West-Central Africa, 21 per cent from the Gold Coast, 20 per cent from the Windward Coast, and more than 32,000 — about 14 per cent — from the Bight of Benin. These are estimates, not documented counts.\n\n" +
      "THE RELIGION. WINTI, formed among the enslaved on Suriname's plantations and among Maroons who escaped into the forest, combines elements of Akan, Gbe and Kongo religion. Its spirits (winti) are grouped by domain — sky, earth, water, forest. Among the earth winti is FODU, also called Papa Winti, a snake spirit; the name 'fodu' has been compared to Gbe 'vodu'. 'Papa' itself has been read as an echo of 'Popo', the coastal people and beaches of the Bight of Benin — a proposed etymology that NEEDS SOURCE VERIFICATION. Practice of Winti was forbidden by Dutch law from 1874 to 1971.\n\n" +
      "WHAT THIS SHOWS. Suriname is a case where Gbe-speakers were a minority among several African groups, and their contribution survives as one strand inside a composite religion, not as a separate 'nation'. The Americas track covers Winti as a religion; this record fixes the Atlantic connection.\n\n" +
      "SIGNIFICANCE. Suriname's Maroons became, through Herskovits's fieldwork in the 1920s, the classic case of African 'survivals' — and later, through Richard and Sally Price, the classic case of creolisation. A Gbe snake spirit inside an Akan-Kongo-Gbe religion is a reminder that what crossed was combined, renamed and re-ordered at the far end.\n\n" +
      "THINGS TO ASK: When one strand of a composite religion carries a West African name, what else about it has to be shown before calling it Vodun?",
    category: "religion",
    subcategory: "Destinations",
    eventType: "historical",
    evidenceStatus: "unresolved",
    tags: T(["place: suriname", "practice: serpent veneration"], "winti", "suriname", "numbers"),
    civilisations: ["Afro-Surinamese", "Maroons", "Akan", "Gbe-speaking peoples", "Kongo"],
    locationName: "Paramaribo and the plantations of Suriname",
    lat: 5.852,
    lng: -55.203,
    media: [P.paramariboMap, P.paramariboView],
    claims: [
      {
        sourceKey: "borges_life_of_language_2014",
        citations: [
          { sourceKey: "slavevoyages_tastdb", relation: "context", note: "The voyage data behind the estimate; NEEDS SOURCE VERIFICATION of the figures." },
          { sourceKey: "wikipedia_winti", relation: "context", note: "Winti's composite origins and the 1874–1971 prohibition." },
        ],
        startYear: 1667,
        endYear: 1830,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Period of the Dutch slave trade to Suriname, in which c. 14 per cent of arrivals came from the Bight of Benin (estimate)",
        originalDateText: "From Dutch rule (1667) to the end of the legal trade; more than 32,000 from the Bight of Benin (estimated)",
        datingMethod: "estimate",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Regional shares are estimates built on voyage data, reported second-hand. The dates bound Dutch Suriname's trade; the shares NEED SOURCE VERIFICATION against the thesis and the database.",
      },
      {
        sourceKey: "wikipedia_winti",
        citations: [
          { sourceKey: "herskovits_myth_negro_past_1941", relation: "context", note: "Suriname as Herskovits's high point on the scale of 'Africanisms'." },
        ],
        startYear: 1874,
        endYear: 1971,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "Legal prohibition of Winti practice in Suriname",
        originalDateText: "1874–1971",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Reported in secondary sources from colonial legislation; dates the prohibition, not the religion's formation, which is earlier and undatable.",
      },
    ],
  },

  // =========================================================================
  // 6. THE CROSSING AND THE CROWD
  // =========================================================================
  {
    slug: "shipmates-bonds-made-in-the-hold",
    title: "Shipmates: bonds made in the hold",
    summary:
      "Across the Americas, people who had crossed on the same ship called one another by a special name — malungo in Brazil, sippi in Suriname, 'shipmate' in the English Caribbean — and treated the bond as kinship. The crossing itself became a source of community.",
    description:
      "THE WORDS. In Brazil, MALUNGO (from a Central African word Slenes traces to Kikongo and Kimbundu, meaning companion, and associated with the sea crossing) named a shipmate; in Suriname, SIPPI or SIBI; in Jamaica and Trinidad, 'shipmate'; in Haiti, 'batiment' has been reported in the same sense. People who had crossed together avoided marrying each other as if they were siblings, and called on each other for help for the rest of their lives.\n\n" +
      "WHY HISTORIANS ARGUE ABOUT IT. Mintz and Price (1976) made the shipmate bond a key example of their model: the crossing destroyed old groups and created new ties among strangers, out of which new institutions grew. Robert Slenes answered from Brazil that the word malungu itself was Central African, and that many shipmates shared languages and ritual idioms — the bond was African in form even when new in content.\n\n" +
      "WHAT IT MEANT FOR RELIGION. A ship loaded at one beach in a short period often carried people from neighbouring communities; in the Americas they might be sold together. Shipmate networks were among the first places in which a vodun's obligations could be remembered aloud, songs sung, and a sick person treated in a familiar way. Religious communities in the Americas — calundus, cabildos, terreiros — drew on such networks.\n\n" +
      "SIGNIFICANCE. The hold of a slave ship, designed to reduce people to cargo (the Brookes plan shows how), became the place where they first made kin of strangers. That is not consolation; it is evidence of what people did with the worst conditions available, and it is part of the religious history because the bond was treated as sacred.\n\n" +
      "THINGS TO ASK: Was the shipmate bond an African institution adapted, or a new one invented — and does the answer change by colony?",
    category: "culture",
    subcategory: "The crossing",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["practice: ancestors", "place: bahia and brazil", "place: suriname", "place: trinidad and the caribbean"], "middle passage", "shipmates", "malungo"),
    civilisations: ["Enslaved Africans", "Kongo", "Mbundu"],
    people: ["Robert W. Slenes", "Sidney W. Mintz", "Richard Price"],
    locationName: "Slave ships and the colonies of the Americas",
    media: [P.rugendasHold, P.brookes],
    claims: [
      {
        sourceKey: "slenes_malungu_1992",
        citations: [
          { sourceKey: "mintz_price_1976", relation: "supports", note: "The shipmate bond as an example of new community formed by the crossing." },
        ],
        startYear: 1700,
        endYear: 1850,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Period in which the shipmate terms are documented in the Americas",
        originalDateText: "Eighteenth and nineteenth centuries",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Travellers', missionaries' and planters' reports and colonial records mention the terms and the customs around them; the dates bound the documentation, not the practice's beginning.",
      },
    ],
  },

  // =========================================================================
  // 7. INSTITUTIONS UNDER SLAVERY
  // =========================================================================


  {
    slug: "black-brotherhoods-by-nation-brazil",
    title: "Black Catholic brotherhoods organised by nation",
    summary:
      "In colonial Brazil Africans founded Catholic lay brotherhoods (irmandades), often restricted by nation. In Salvador a brotherhood of Jeje and Mina Africans met in the Corpo Santo chapel — Catholic institutions that also held African communities together.",
    description:
      "THE INSTITUTION. A brotherhood (irmandade) was a Catholic lay association with a patron saint, a statute approved by Church and Crown, elected officers, and duties to its members: a funeral, masses for the soul, help in sickness, loans towards manumission. In Brazil Black and African brotherhoods — of Our Lady of the Rosary, of Saint Benedict, of Saint Iphigenia — were among the few legal forms of association open to the enslaved and freed. Many restricted office, or membership, by African nation.\n\n" +
      "THE JEJE BROTHERHOOD. In Salvador the brotherhood of SENHOR BOM JESUS DAS NECESSIDADES E REDENÇÃO DOS HOMENS PRETOS, in the Corpo Santo chapel, was dominated by Jeje and Mina Africans. Parés's study of its members between 1770 and 1830 finds militia officers, barbers — who were also bleeders and healers — and slave-traders: a community with internal hierarchy, money and links back to the coast.\n\n" +
      "CATHOLIC AND AFRICAN AT ONCE. Brotherhoods were genuinely Catholic and their members' devotion was real. They also gave a nation a legal treasury, a meeting place, a calendar of festivals and an organisation for burials — and burial, in Gbe as in Catholic practice, is the moment obligations to the dead are fulfilled. The same people appear in brotherhood records and in records of African religious practice.\n\n" +
      "SIGNIFICANCE. The brotherhoods show that 'Catholic contact' was not only imposed baptism and saints used as masks: Africans built Catholic institutions of their own, by nation, and used them to keep communities alive. The same pattern — a Catholic frame holding an African community — appears in Cuba's cabildos and in the Agudá returnees' Catholicism on the Bight of Benin.\n\n" +
      "THINGS TO ASK: When a Jeje barber is both a brotherhood officer and a healer, is he living two religions or one?",
    category: "religion",
    subcategory: "Institutions under slavery",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["practice: catholic contact", "place: bahia and brazil", "practice: ancestors", "practice: healing and herbal knowledge"], "irmandades", "brotherhoods", "jeje"),
    civilisations: ["Jeje", "Mina", "Afro-Brazilians", "Catholic Church in Brazil"],
    people: ["Luis Nicolau Parés"],
    locationName: "Corpo Santo chapel, Salvador da Bahia",
    lat: -12.97,
    lng: -38.51,
    media: [P.rosarioPretos],
    claims: [
      {
        sourceKey: "pares_militiamen_brotherhood_2014",
        citations: [
          { sourceKey: "pares_formation_candomble_2013", relation: "supports", note: "Jeje brotherhoods as part of Jeje social organisation in Bahia." },
        ],
        startYear: 1770,
        endYear: 1830,
        datePrecision: "decade",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "Period of Parés's study of Jeje and Mina members of the Bom Jesus das Necessidades brotherhood",
        originalDateText: "Bahia, 1770–1830",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Brotherhood statutes, membership and account books. The range is that of the surviving records studied; the brotherhood's foundation date NEEDS SOURCE VERIFICATION.",
      },
    ],
  },

  {
    slug: "calundu-in-colonial-brazil",
    title: "Calundu: African ritual in colonial Brazil before Candomblé",
    summary:
      "In the seventeenth and eighteenth centuries Portuguese authorities used 'calundu' for African gatherings of drumming, possession, divination and healing. Inquisition and police records describe them — the best-documented, like Luzia Pinta's, Central African; some, Jeje.",
    description:
      "THE WORD. 'Calundu' is of Central African (Kimbundu) origin and in colonial Brazil became the general Portuguese term for African religious ceremonies: drumming, dancing, spirit possession, divination and healing, often at night in a house or a clearing. It is a word used by OUTSIDERS — priests, inquisitors, police, poets — for practices whose participants had their own names for them.\n\n" +
      "THE CASES. The best-known is LUZIA PINTA, an Angolan freedwoman in Sabará, Minas Gerais, denounced in 1739, sent to Lisbon in 1742 and tried by the Inquisition, which tortured her in 1743. Luiz Mott connected her ceremonies to Angolan xinguila priests described by seventeenth-century missionaries; she presented her healing as Christian. In Bahia in 1785 a calundu led by a Dahomean, Sebastião, was raided at Cachoeira — a JEJE calundu, with vodun practice in it.\n\n" +
      "WHAT THE RECORDS ARE. They are interrogations, denunciations and raids, produced by institutions trying to suppress the practices. They exaggerate 'devil worship', and they record what accused people said under pressure. They are also the richest descriptions of African ritual in colonial Brazil, and James Sweet has used them to argue that these were African practices, carried and continued, not yet a Brazilian synthesis.\n\n" +
      "SIGNIFICANCE. Calundu is the ancestor-in-practice of Candomblé: domestic, unstable, illegal ritual communities, Central African and West African, that in the nineteenth century gave way to established terreiros. It shows that Gbe practice in Brazil was never alone — it sat beside a larger Central African presence, as in Saint-Domingue — and that the record of it is the record of its repression.\n\n" +
      "THINGS TO ASK: How do you read a religion from the files of the people who prosecuted it?",
    category: "religion",
    subcategory: "Institutions under slavery",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["practice: possession", "practice: healing and herbal knowledge", "practice: drumming and song", "practice: divination", "place: bahia and brazil"], "calundu", "inquisition"),
    civilisations: ["Mbundu", "Kongo", "Jeje", "Portuguese Inquisition"],
    people: ["Luzia Pinta", "Sebastião (of Cachoeira)", "Luiz Mott", "James H. Sweet"],
    locationName: "Minas Gerais and Bahia, Brazil",
    media: [P.batuque],
    claims: [
      {
        sourceKey: "mott_luzia_pinta_1994",
        citations: [
          { sourceKey: "sweet_recreating_africa_2003", relation: "supports", note: "Calundu cases in Inquisition records as African religious practice." },
        ],
        startYear: 1739,
        endYear: 1744,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "Denunciation of Luzia Pinta in Sabará (1739) to her Lisbon trial (1742–44)",
        originalDateText: "Sabará 1739; Lisbon 1742–1744",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The Lisbon Inquisition's trial record (Arquivo Nacional da Torre do Tombo), as studied by Mott. It dates a prosecution, not the beginning of calundu, which is documented earlier in the seventeenth century.",
      },
    ],
  },

  {
    slug: "calundu-pasto-cachoeira-1785",
    title: "1785: a Jeje calundu at Cachoeira is raided",
    summary:
      "In 1785 the authorities raided a ceremony in the Rua do Pasto at Cachoeira, Bahia, led by a Dahomean African, Sebastião, already known in the Recôncavo as a healer. The record is one of the earliest detailed documents of vodun practice in Brazil.",
    description:
      "WHAT HAPPENED. In 1785 a calundu operating in the Rua do Pasto in Cachoeira, the river port of Bahia's Recôncavo, was raided and its participants arrested. Its leader, SEBASTIÃO, described as Dahomean (Jeje), was already well known in the region as a powerful healer and had faced earlier accusations of 'feitiçaria'. The judicial record of the raid — the objects seized, the people arrested, their statements — was studied by João José Reis in 1988 and again by Luis Nicolau Parés.\n\n" +
      "WHY IT MATTERS. Because the record names the participants' nation and describes a structured ritual community with a leader, a house, followers, objects and a reputation, it shows Jeje vodun practice organised in Brazil in the eighteenth century — not as a scattered memory but as an institution with infrastructure. Parés treats it as a stage between calundu and the Jeje terreiros of the nineteenth century. Cachoeira later became home to some of the best-known Jeje houses.\n\n" +
      "WHAT IT DOES NOT SHOW. A police file records what the police saw and what frightened people said. It does not give the participants' theology in their own words. Reis and Parés read it with care for exactly that reason.\n\n" +
      "SIGNIFICANCE. The 1785 raid is a documented point in time at which Vodun is visible as a working religious community in the Americas, under a Dahomean leader, eleven years before Moreau de Saint-Méry's description of 'Vaudoux' was published. It is one of the strongest single pieces of evidence that Gbe religious knowledge crossed with initiated people, not merely as names.\n\n" +
      "THINGS TO ASK: What does a raid make visible that a peaceful ceremony would not have left in the archive?",
    category: "religion",
    subcategory: "Brazil",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["place: bahia and brazil", "practice: healing and herbal knowledge", "practice: initiation and priesthood", "place: abomey"], "jeje", "calundu", "cachoeira"),
    civilisations: ["Jeje", "Dahomey", "Portuguese Bahia"],
    people: ["Sebastião (of Cachoeira)", "João José Reis", "Luis Nicolau Parés"],
    locationName: "Rua do Pasto, Cachoeira, Bahia",
    lat: -12.618,
    lng: -38.956,
    media: [P.cachoeiraStreet, P.batuque],
    claims: [
      {
        sourceKey: "reis_magia_jeje_1988",
        citations: [
          { sourceKey: "pares_formation_candomble_2013", relation: "supports", note: "Re-analysis of the 1785 raid as Jeje vodun practice." },
        ],
        startYear: 1785,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        whatIsDated: "Raid on Sebastião's calundu in the Rua do Pasto, Cachoeira",
        originalDateText: "1785",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The judicial record of the raid, as studied by Reis (1988) and Parés. Dates one documented event; the calundu itself had existed for some time before.",
      },
    ],
  },

  {
    slug: "domingos-alvares-gbe-healer",
    title: "Domingos Álvares: a Gbe healer in Brazil and Portugal",
    summary:
      "Born around 1710 in the Mahi country, enslaved after Dahomey's wars, shipped to Pernambuco and sold to Rio, Domingos Álvares healed, gathered followers, and was tried twice by the Lisbon Inquisition. His trials make him the best-documented individual carrier of Gbe religious practice across the Atlantic.",
    description:
      "THE LIFE, FROM THE TRIALS. James Sweet reconstructed Domingos Álvares's life from Inquisition records. He was born around 1710 in NAOGON in the Mahi country, north of Abomey, into a family of Vodun priests and healers. Around 1730, in the wars by which Agaja's Dahomey was expanding, he was captured and sold. He was shipped to PERNAMBUCO, worked on sugar estates, was accused of poisoning his master, and was sold south to RIO DE JANEIRO, where he became known as a healer with a following. In 1742 he was arrested and sent to LISBON. Tried for sorcery and a pact with the Devil — which he denied — he was made to abjure in public in 1744, whipped, and banished to CASTRO MARIM in the Algarve. He left his place of exile, healed again, was re-arrested in 1747, tried again in 1749, exiled once more, and then disappears from the record.\n\n" +
      "WHAT HE CARRIED. Sweet argues that Domingos's healing was the knowledge of a Gbe vodun priest — the treatment of illness as a social and spiritual disorder, divination, the use of plants and of a vodun's power — and that he adapted it in Brazil and Portugal to new patients, new illnesses and new materials, and to the Catholic language his accusers understood. He also argues that Domingos's opposition to Dahomey, which had destroyed his homeland, shaped his life in exile.\n\n" +
      "WHY ONE LIFE MATTERS. Most of the evidence for what crossed is collective (names, numbers, later ethnography). Domingos is one person, with a birthplace, a lineage of practice, a crossing, a career and two trials. His case proves at the level of a single life that a trained Gbe specialist could carry his knowledge across the Atlantic and practise it — while showing how much had to change.\n\n" +
      "SIGNIFICANCE. Sweet presents Domingos as an INTELLECTUAL — a thinker about healing and community whose ideas met European medicine and theology on equal terms in his own mind. That recasts the 'survival' of African religion as the work of individual specialists making decisions, not as residue.\n\n" +
      "THINGS TO ASK: What would we know about Vodun in Brazil if the Inquisition had not arrested this one man?",
    category: "religion",
    subcategory: "People",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["practice: healing and herbal knowledge", "practice: initiation and priesthood", "practice: divination", "place: bahia and brazil", "place: abomey"], "inquisition", "mahi", "biography"),
    people: ["Domingos Álvares", "James H. Sweet", "Agaja"],
    civilisations: ["Mahi", "Dahomey", "Portuguese Inquisition"],
    locationName: "Naogon (Mahi country), Pernambuco, Rio de Janeiro, Lisbon and Castro Marim",
    lat: 37.218,
    lng: -7.443,
    media: [P.autoDeFe, P.castroMarim],
    claims: [
      {
        sourceKey: "sweet_domingos_alvares_2011",
        citations: [
          { sourceKey: "sweet_recreating_africa_2003", relation: "context", note: "The wider Inquisition record of African healers in the Portuguese world." },
        ],
        startYear: 1742,
        endYear: 1749,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "Arrest in Rio (1742) to second Inquisition trial (1749)",
        originalDateText: "Arrested 1742; abjured in Lisbon 1744; re-arrested 1747; tried again 1749",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Lisbon Inquisition trial records as reconstructed by Sweet; dates here are taken from summaries of his book and NEED SOURCE VERIFICATION against it.",
      },
      {
        sourceKey: "sweet_domingos_alvares_2011",
        citations: [
          { sourceKey: "law_slave_coast_1991", relation: "context", note: "Dahomey's wars of the 1720s–30s under Agaja as the context of his capture." },
        ],
        startYear: 1710,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Birth of Domingos Álvares in Naogon",
        originalDateText: "About 1710",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Inferred by Sweet from ages and events stated in the trial records; approximate.",
      },
    ],
  },

  {
    slug: "mandinga-pouches-before-the-inquisition",
    title: "Mandinga pouches before the Lisbon Inquisition",
    summary:
      "In the eighteenth century Africans in Brazil and Portugal made and wore 'bolsas de mandinga' — protective pouches combining African, Islamic and Catholic materials — and the Inquisition prosecuted them. The pouch is an Atlantic object, made by Africans from many regions, including the Mina coast.",
    description:
      "THE OBJECT. A small cloth or leather pouch worn against the body for protection — against blades, bullets, illness, the master's violence. Inside, according to Inquisition records: roots and powders, stones, hair, slips of paper with written prayers, sometimes a fragment of consecrated altar stone or a Catholic prayer, sometimes Arabic script. The name 'mandinga' points to the Muslim Mande of Senegambia, famous for written amulets; but the makers in the records include men from the Mina coast, Central Africa and Brazil.\n\n" +
      "THE TRIALS. The Lisbon Inquisition prosecuted dozens of pouch-makers and wearers, in Portugal itself — Lisbon had a large African population — and in Brazil. Matthew Rarey studies the trial of JOSÉ FRANCISCO PEREIRA, an enslaved man raised in West Africa who learned to make pouches in Brazil and was arrested in Lisbon in 1730. Daniela Calainho surveyed the Portuguese 'metropolis of mandingas'.\n\n" +
      "WHAT IT SHOWS ABOUT TRANSMISSION. The pouch is not 'Vodun', 'Islam' or 'Catholicism' but a technology of protection built from all three by people who had passed through several religious worlds. It sits close to the Gbe bo/bocio — power objects made to protect and to act (see benin-vodun's bocio record) — without being the same thing. It is a clear case where resemblance to a West African practice is real but the object is an Atlantic creation.\n\n" +
      "SIGNIFICANCE. The pouch shows African religious knowledge travelling not only to the plantation Americas but into Europe — into Lisbon's streets and prisons — and being recombined there. The Inquisition, trying to destroy it, preserved its most detailed descriptions.\n\n" +
      "THINGS TO ASK: When an object is made from three religions' materials, which religion does it belong to?",
    category: "religion",
    subcategory: "Catholic contact",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["practice: healing and herbal knowledge", "practice: catholic contact", "place: bahia and brazil"], "mandinga", "inquisition", "amulets"),
    civilisations: ["Mande", "Mina", "Kongo", "Portuguese Inquisition"],
    people: ["José Francisco Pereira", "Matthew Francis Rarey", "Daniela Buono Calainho"],
    locationName: "Lisbon and colonial Brazil",
    lat: 38.714,
    lng: -9.139,
    media: [P.autoDeFe],
    claims: [
      {
        sourceKey: "rarey_insignificant_things_2023",
        citations: [
          { sourceKey: "calainho_metropole_mandingas_2008", relation: "supports", note: "Survey of Inquisition cases against mandinga pouch-makers in Portugal." },
          { sourceKey: "sweet_recreating_africa_2003", relation: "context", note: "The pouch among African religious practices in the Portuguese world." },
        ],
        startYear: 1700,
        endYear: 1780,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Peak of Inquisition prosecutions for mandinga pouches",
        originalDateText: "Eighteenth century, with José Francisco Pereira's arrest in 1730",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Inquisition trial records; the range bounds the prosecutions studied, not the use of pouches, which is earlier and later.",
      },
    ],
  },

  {
    slug: "code-noir-1685-religion-clauses",
    title: "The Code Noir of 1685: baptism required, every other worship forbidden",
    summary:
      "Louis XIV's edict on slavery in the French islands opened with religion: every enslaved person was to be baptised and instructed as a Catholic, and the public exercise of any other religion was banned. The law shaped the conditions under which Vodou formed in Saint-Domingue and Voodoo in Louisiana.",
    description:
      "WHAT THE LAW SAID. The edict of March 1685, later called the Code Noir, began with religion. ARTICLE 2: all enslaved people in the islands were to be baptised and instructed in the Catholic, Apostolic and Roman religion, and masters who bought newly arrived Africans were to inform the governor and intendant within eight days so that this could be done. ARTICLE 3: the public exercise of any religion other than the Catholic was forbidden; offenders were to be punished as rebels, and all assemblies for that purpose were declared unlawful and seditious — masters who permitted them were liable too. The Louisiana code of 1724 repeated both.\n\n" +
      "WHAT IT DID IN PRACTICE. Baptism was widespread but instruction was thin; many Africans were baptised on arrival with little or no catechesis. Sunday rest, also required by the Code, created time for gatherings. Ceremonies continued at night and in secret, and planters and authorities alternately tolerated and repressed them. Catholic saints, sacraments and calendar became part of the material from which Vodou was built.\n\n" +
      "TWO MISREADINGS. That the saints were only masks hiding African gods — Catholic devotion among the enslaved could be real, and many Kongo Africans were already Christian. And that the law achieved what it said — it made African religion illegal, not absent.\n\n" +
      "SIGNIFICANCE. The Code Noir is the legal frame of French Atlantic slavery and its religious clauses are the first thing in it. It defined African religion as sedition, which is why its practice became secret, why outsiders' accounts are full of fear, and why Vodou developed an esoteric structure. The Haitian and Americas tracks (anchors: haitian-vodou-formation-saint-domingue, louisiana-voodoo-formation) continue the story.\n\n" +
      "THINGS TO ASK: What happens to a religion when the law defines its gatherings as rebellion?",
    category: "religion",
    subcategory: "Catholic contact",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["practice: catholic contact", "place: saint-domingue and haiti", "place: new orleans"], "code noir", "law", "baptism"),
    people: ["Louis XIV", "Jean-Baptiste Colbert"],
    civilisations: ["Kingdom of France", "French Saint-Domingue", "French Louisiana"],
    locationName: "Versailles; the French Caribbean and Louisiana",
    media: [P.codeNoir1742, P.codeNoirNantes],
    claims: [
      {
        sourceKey: "code_noir_1685",
        citations: [
          { sourceKey: "thornton_trail_of_voodoo_1988", relation: "context", note: "Many Central Africans arrived already Christian, complicating the reading of 'forced' conversion." },
        ],
        startYear: 1685,
        startMonth: 3,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Promulgation of the edict on slavery in the French islands (the Code Noir)",
        originalDateText: "Versailles, March 1685",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The dated royal edict. It establishes when the religious clauses became law, not how they were enforced.",
      },
      {
        sourceKey: "code_noir_1685",
        citations: [
          { sourceKey: "hall_africans_colonial_louisiana_1992", relation: "context", note: "The 1724 Louisiana code in the colony's history." },
        ],
        startYear: 1724,
        startMonth: 3,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Reissue of the religious clauses for Louisiana",
        originalDateText: "Louisiana Code Noir, March 1724",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The 1724 edict for Louisiana repeating the baptism and prohibition clauses.",
      },
    ],
  },

  {
    slug: "kongo-christians-in-the-americas",
    title: "African Christians in the hold: Kongo Catholicism in the Americas",
    summary:
      "The Kingdom of Kongo had been Catholic since the 1490s. Many Central Africans shipped to Saint-Domingue, Brazil and Cuba were already baptised Christians, so 'syncretism' in the Americas often continued an African Christianity rather than starting one.",
    description:
      "THE AFRICAN BACKGROUND. The Mani Kongo Nzinga a Nkuwu was baptised in 1491, and under his son Afonso I (ruled c. 1509–1542) Christianity became the state religion of Kongo, with a literate elite, churches, lay teachers and, later, Capuchin missionaries. Kongo Christians made their own crucifixes (nkangi kiditu), their own saints' cults, and in the movement of Kimpa Vita (Dona Beatriz, executed 1706) their own prophetic theology. Kongo Catholicism was an African religion with two centuries of history before the main era of the trade to the Caribbean.\n\n" +
      "THORNTON'S ARGUMENT. John Thornton argued that when Kongo captives arrived in the Americas many already understood saints, the cross, baptism and holy water within a Kongo framework. What looked to missionaries like Africans 'mixing' Catholicism with paganism could be Kongo Christianity continuing. Saint-Domingue's enslaved population was, by the later eighteenth century, majority Central African, and Thornton places Kongo Christianity — alongside the Gbe religion of the Arada — at the root of Haitian Vodou.\n\n" +
      "WHY IT MATTERS FOR THE VODUN STORY. It changes the picture of 'Catholic contact'. Gbe-speakers from the Bight of Benin met Catholicism in the Americas not only through white priests and the Code Noir, but through African fellow-captives for whom it was already an African religion. Two African religions — Gbe Vodun and Kongo Christianity — met each other as well as meeting the Church.\n\n" +
      "SIGNIFICANCE. The Petwo and Kongo rites of Haitian Vodou, the Congo cabildos of Cuba and the Central African calundus of Brazil sit beside the Gbe-derived traditions this track follows. Kongo Christianity is why the Catholic element in these religions cannot simply be called European.\n\n" +
      "THINGS TO ASK: If a captive was baptised in Kongo before being shipped, what does 'forced conversion' in the Americas mean for that person?",
    category: "religion",
    subcategory: "Catholic contact",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["practice: catholic contact", "place: saint-domingue and haiti", "deity: lwa"], "kongo", "christianity", "syncretism"),
    people: ["Nzinga a Nkuwu (João I of Kongo)", "Afonso I of Kongo", "Kimpa Vita (Dona Beatriz)", "John Thornton"],
    civilisations: ["Kingdom of Kongo", "Kongo"],
    locationName: "Kingdom of Kongo and the Americas",
    lat: -6.267,
    lng: 14.24,
    media: [P.nkangiBrooklyn, P.nkangiTervuren],
    claims: [
      {
        sourceKey: "thornton_africa_africans_1998",
        citations: [
          { sourceKey: "thornton_trail_of_voodoo_1988", relation: "supports", note: "Kongo Christianity as the background of many Central Africans in the Americas." },
        ],
        startYear: 1491,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Baptism of the Mani Kongo Nzinga a Nkuwu",
        originalDateText: "1491",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Portuguese and Kongo royal correspondence and chronicles. Dates the beginning of Kongo's official Christianity, a documented political act — not the beginning of any African religion.",
      },
      {
        sourceKey: "thornton_racines_vaudou_1998",
        citations: [
          { sourceKey: "thornton_trail_of_voodoo_1988", relation: "context", note: "The argument that African Christianity continued in the Americas." },
        ],
        startYear: 1750,
        endYear: 1791,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Period when Central Africans were the majority of new arrivals in Saint-Domingue",
        originalDateText: "Later eighteenth century, before the revolution",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Historians' analysis of French voyage and plantation data; proportions by decade NEED SOURCE VERIFICATION against the database.",
      },
    ],
  },

  // =========================================================================
  // 8. HOW HISTORIANS HAVE ARGUED
  // =========================================================================
  {
    slug: "herskovits-dahomey-and-survivals",
    title: "Herskovits, Dahomey and the 'survivals' model",
    summary:
      "Melville Herskovits did fieldwork in Dahomey (1931), Haiti and Suriname, and in 1941 argued in The Myth of the Negro Past that African culture had survived in the Americas on a measurable 'scale of intensity'. His model made Dahomey the African baseline for Vodou studies for decades.",
    description:
      "THE FIELDWORK. Melville J. Herskovits (1895–1963) and Frances S. Herskovits worked among the Saramaka Maroons of Suriname in the late 1920s, in Abomey in 1931 (published as Dahomey: An Ancient West African Kingdom, 1938), in Haiti in 1934 (Life in a Haitian Valley, 1937), and later in Trinidad and Bahia. Their Dahomean material — on vodun cults, ancestors, Fa divination, the kingdom — became the African standard against which diaspora religion was measured.\n\n" +
      "THE THESIS. In THE MYTH OF THE NEGRO PAST (1941), written for the Carnegie study that became Myrdal's An American Dilemma, Herskovits attacked the 'myth' that Africans had arrived without a past and lost all their culture. He proposed that African cultural forms — 'Africanisms' or 'survivals' — persisted throughout the Americas, ranging on a 'scale of intensity' from Suriname's Maroons (most African) through Haiti and Bahia to the United States (least). Where open practice was impossible, Africanisms persisted through 'reinterpretation' and 'syncretism', notably the equation of saints with African deities.\n\n" +
      "WHAT WAS GAINED. Herskovits put African history at the centre of the study of the Americas, and his work on Haiti and Dahomey taught scholars to look for Gbe names and structures in Vodou. Many of the connections in this expansion were first proposed by him.\n\n" +
      "WHAT WAS WRONG OR RISKY. His Dahomey of 1931 was a colonial Dahomey, recorded nearly two centuries after the main era of shipments; using it as 'the original' read Africa as timeless. 'Survival' implied passive persistence rather than active rebuilding. And the scale ranked peoples by how 'African' they looked to an observer.\n\n" +
      "SIGNIFICANCE. Most of what non-specialists still assume — that Vodou is 'Dahomean religion in Haiti' — descends from this model. Seeing its origin as a 1930s–40s argument, made against racism and with real fieldwork but with real distortions, is the first step in reading the claim critically.\n\n" +
      "THINGS TO ASK: When an African 'original' is cited for a diaspora practice, when was that original recorded?",
    category: "religion",
    subcategory: "Historiography",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["place: abomey", "place: saint-domingue and haiti", "place: suriname", "practice: divination"], "historiography", "survivals", "herskovits"),
    people: ["Melville J. Herskovits", "Frances S. Herskovits"],
    civilisations: ["Dahomey", "Saramaka", "Haiti"],
    locationName: "Abomey, Mirebalais (Haiti), Suriname and Northwestern University",
    media: [P.herskovits1960, P.herskovitsAreas],
    claims: [
      {
        sourceKey: "herskovits_myth_negro_past_1941",
        citations: [
          { sourceKey: "herskovits_dahomey_1938", relation: "supports", note: "The Dahomean fieldwork that supplied his African baseline." },
        ],
        startYear: 1941,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of The Myth of the Negro Past",
        originalDateText: "1941",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The publication date of a scholarly argument; it dates the model, not the historical processes it describes.",
      },
      {
        sourceKey: "herskovits_dahomey_1938",
        citations: [
          { sourceKey: "herskovits_myth_negro_past_1941", relation: "context", note: "Uses the Dahomey material as baseline." },
        ],
        startYear: 1931,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Herskovitses' fieldwork in Abomey",
        originalDateText: "1931 (published 1938)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. The date of the fieldwork as stated in the 1938 monograph; it dates an ethnographic record made under French colonial rule, not the religion of the eighteenth century.",
      },
    ],
  },

  {
    slug: "herskovits-frazier-debate",
    title: "Herskovits versus Frazier: did African religion survive slavery?",
    summary:
      "E. Franklin Frazier argued that slavery in the United States had stripped Africans of their culture; Herskovits that Africanisms survived. Their argument, from 1939 into the 1960s, framed the question of what crossed for a generation — and both were partly right.",
    description:
      "THE TWO POSITIONS. E. FRANKLIN FRAZIER (1894–1962), sociologist at Howard University, argued in The Negro Family in the United States (1939) and later The Negro Church in America (1963) that the slave trade and slavery in the US destroyed African social organisation, language and religion: what Black Americans built — family forms, churches — had to be explained by slavery, emancipation and urbanisation. MELVILLE HERSKOVITS (1941) answered that African culture had survived everywhere in some degree, including in the United States, through reinterpretation.\n\n" +
      "WHAT WAS AT STAKE. Both men were opposing racism, by different routes. For Frazier, stressing destruction showed the scale of the crime and made Black Americans full participants in American society, not exotic survivors. For Herskovits, stressing survival gave Black Americans a respected past. The debate concerned mainly the United States, but its terms — survival or loss — were applied to Haiti, Brazil and Cuba too.\n\n" +
      "HOW IT LOOKS NOW. For the Caribbean and Brazil, the evidence of Gbe and Yoruba names, deities and rituals plainly supports more continuity than Frazier allowed for the US. For the United States outside Louisiana, African religious institutions were indeed largely broken, though African forms persisted in music, healing and Christian worship. And both shared a frame — survive or perish — that later scholars replaced with reconstruction and creation.\n\n" +
      "SIGNIFICANCE. This debate is why 'survival' remains a loaded word in this field. A reader who meets the claim that Louisiana Voodoo or Haitian Vodou 'is' African religion, or 'has nothing' African in it, is meeting one side of a 1940s argument. The evidence fits neither extreme.\n\n" +
      "THINGS TO ASK: Is a practice that was rebuilt from memory under new conditions a 'survival', a 'loss', or neither?",
    category: "religion",
    subcategory: "Historiography",
    eventType: "disputed",
    evidenceStatus: "disputed",
    tags: T(["place: new orleans", "place: saint-domingue and haiti", "practice: ancestors"], "historiography", "survivals", "debate"),
    people: ["E. Franklin Frazier", "Melville J. Herskovits"],
    civilisations: ["African Americans"],
    locationName: "United States (Howard and Northwestern universities)",
    argumentsFor:
      "For substantial survival (Herskovits): Gbe and Yoruba deity names, ritual vocabularies, drum rhythms and initiatory structures documented in Haiti, Brazil and Cuba; African forms in African-American music, healing and worship; Louisiana's documented Voodoo; and the logic that people do not forget everything they know.",
    argumentsAgainst:
      "For destruction (Frazier): in most of the United States, African languages, lineages, cult institutions and priesthoods did not survive slavery; family and church forms are well explained by slavery and its aftermath; and 'survivals' were often identified by resemblance alone, which proves nothing about descent.",
    media: [P.frazier, P.herskovits1960],
    claims: [
      {
        sourceKey: "frazier_negro_family_1939",
        citations: [
          { sourceKey: "herskovits_myth_negro_past_1941", relation: "disputes", note: "Herskovits's answer, arguing for survival." },
        ],
        startYear: 1939,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Frazier's statement of the 'loss' position",
        originalDateText: "The Negro Family in the United States, 1939",
        datingMethod: "historical_record",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Publication date of one side of a scholarly debate.",
      },
      {
        sourceKey: "herskovits_myth_negro_past_1941",
        citations: [
          { sourceKey: "frazier_negro_family_1939", relation: "disputes", note: "Frazier's position that slavery destroyed African culture in the US." },
        ],
        startYear: 1941,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Herskovits's statement of the 'survival' position",
        originalDateText: "The Myth of the Negro Past, 1941, answering Frazier",
        datingMethod: "historical_record",
        chronology: "disputed",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Publication date of the other side of the debate, which continued into the 1960s.",
      },
    ],
    genealogies: [
      {
        key: "african-religion-did-not-survive-slavery",
        claim: "Slavery wiped out African religion; nothing African survived in the religions of the enslaved",
        verdict: "partially_attested",
        verdictEvidence:
          "Partly true for the institutional fabric of African religion in most of the United States, where lineages, shrines and priesthoods did not survive. Not true for Haiti, Brazil, Cuba, Suriname or Louisiana, where Gbe, Yoruba and Kongo names, deities, rites and ritual languages are documented from the eighteenth century onward (the Cachoeira calundu of 1785, Moreau's 'Vaudoux' of 1797, the Jeje and Arará nations).",
        whatWouldChangeThis:
          "Evidence that the Gbe and Yoruba ritual vocabularies of Haiti, Bahia and Cuba entered those religions only through twentieth-century contact (for example, absence of the terms from all nineteenth-century records) would strengthen the 'loss' case for those places too.",
        links: [
          {
            stage: "early_scholarship",
            who: "E. Franklin Frazier",
            year: 1939,
            sourceKey: "frazier_negro_family_1939",
            saysAbsentReason: "The book was not opened in this session; paraphrased from its well-known argument.",
            adds: "States the loss thesis for the United States, explaining Black family and church forms by slavery and its aftermath.",
            citationStatus: "unverified",
          },
          {
            stage: "early_scholarship",
            who: "Melville J. Herskovits",
            year: 1941,
            sourceKey: "herskovits_myth_negro_past_1941",
            saysAbsentReason: "Not opened in this session; paraphrased.",
            adds: "Answers with the survivals thesis and the 'scale of intensity', drawing on Dahomey, Haiti and Suriname.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Sidney Mintz and Richard Price",
            year: 1976,
            sourceKey: "mintz_price_1976",
            saysAbsentReason: "Not opened in this session; paraphrased.",
            adds: "Moves the question from survival-or-loss to how new institutions were created from shared African orientations.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
  },

  {
    slug: "mintz-price-creolisation-model",
    title: "Mintz and Price: crowds, not groups — the creolisation model",
    summary:
      "In 1976 Sidney Mintz and Richard Price argued that enslaved Africans arrived as heterogeneous crowds, not intact communities, and had to create new institutions quickly from shared underlying orientations. Their creolisation model dominated the field for twenty years.",
    description:
      "THE ARGUMENT. In An Anthropological Approach to the Afro-American Past (1976; republished in 1992 as The Birth of African-American Culture), the anthropologists Sidney W. Mintz and Richard Price argued that enslaved Africans in any colony came from many societies and did not constitute 'groups' with shared institutions but 'CROWDS' of strangers. They could not simply transplant a religion, a kinship system or a court. What they shared were 'DEEP-LEVEL' cultural orientations — assumptions about how the world works, about causality, about the relation of the living and the dead — from which they built NEW institutions, rapidly, in the first generations. Price's work with the Saramaka of Suriname, whose society took shape in a few decades around 1700, was a model case.\n\n" +
      "WHAT IT CHANGED. It shifted the emphasis from 'survivals' to CREATIVITY and from Africa to the Americas: the religions of the diaspora were creations of enslaved people, made early and fast. It also explained why diaspora religions combine elements from many African regions.\n\n" +
      "THE CRITIQUE. From the 1990s, historians using the voyage database — Thornton, Hall, Lovejoy, Sweet — argued that ships drew on a limited number of regions and that people from one region often arrived in large concentrations (Gbe-speakers in Bahia and Saint-Domingue, Yoruba in nineteenth-century Bahia and Cuba). They could and did find each other and rebuild 'national' institutions — the Jeje nation, the Arará cabildos — with considerable specific continuity. Mintz and Price replied that their model had never denied African content.\n\n" +
      "SIGNIFICANCE. For the Vodun story the debate is concrete: is the Rada rite of Haitian Vodou a Gbe institution reconstituted, or a new Haitian creation using Gbe material? The best current answer is both — specific African continuities, organised in new institutions — and this model is half of that answer.\n\n" +
      "THINGS TO ASK: In a given colony and decade, were the newly arrived a crowd or a group?",
    category: "religion",
    subcategory: "Historiography",
    eventType: "historical",
    evidenceStatus: "disputed",
    tags: T(["place: suriname", "place: saint-domingue and haiti", "place: trinidad and the caribbean"], "historiography", "creolisation"),
    people: ["Sidney W. Mintz", "Richard Price"],
    civilisations: ["Saramaka", "Enslaved Africans in the Caribbean"],
    locationName: "The Caribbean and Suriname",
    media: [P.saramaka1910],
    claims: [
      {
        sourceKey: "mintz_price_1976",
        citations: [
          { sourceKey: "thornton_africa_africans_1998", relation: "disputes", note: "Argues for clustering of arrivals and more specific continuity." },
          { sourceKey: "hall_slavery_african_ethnicities_2005", relation: "disputes", note: "Uses nation labels and voyage data against the 'random crowd' picture." },
        ],
        startYear: 1976,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of the Mintz–Price creolisation model",
        originalDateText: "1976 (republished 1992)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Publication date of an interpretive model.",
      },
    ],
  },

  {
    slug: "africa-centred-turn-thornton-hall-sweet-pares",
    title: "The Africa-centred turn: Thornton, Hall, Sweet and Parés",
    summary:
      "From the 1990s historians combined the voyage database with African history and colonial records to argue for specific, traceable continuities — named peoples, named practices, named individuals — while treating diaspora religions as new formations. It is the approach most records in this track rely on.",
    description:
      "WHAT CHANGED. Three things made a new kind of argument possible: the Trans-Atlantic Slave Trade Database (published 1999, online 2008), which showed when and from where ships came to each colony; a generation of African history (Law on the Slave Coast, Thornton on Kongo) that described the societies captives came from in the period they left; and close reading of colonial records — notarial, ecclesiastical, Inquisitorial — for African detail.\n\n" +
      "THE WORKS. JOHN THORNTON (1992/1998) argued that Africans shaped the Atlantic world and that captives often arrived among speakers of their own languages. GWENDOLYN MIDLO HALL (1992, 2005) read nation labels against voyage data to restore 'links' between American communities and African regions. JAMES SWEET (2003, 2011) used Inquisition records to show African practices continuing in the Portuguese world, and wrote the biography of Domingos Álvares. LUIS NICOLAU PARÉS (2006/2013) traced the Jeje nation in Bahia from the eighteenth century to the terreiros.\n\n" +
      "WHAT IT CLAIMS AND DOES NOT. It claims SPECIFIC continuities that can be documented — this name, this practice, this person, from this coast. It does not claim that diaspora religions are African religions unchanged; Parés, for instance, calls the result the FORMATION of Candomblé. Critics, including Price and Matory, have warned of reading colonial labels as fixed ethnicities, and of underplaying how much was created later through transatlantic contact.\n\n" +
      "SIGNIFICANCE. This approach is what makes a track like this one possible: it lets records say 'documented' about ports, names and individuals and 'interpretation' about religious meaning, and keep them apart. It is also a debate, not a settled consensus, and the records that rely on it say so.\n\n" +
      "THINGS TO ASK: When a scholar says a practice 'came from' a region, is the evidence a voyage, a name, a document about a person, or a resemblance?",
    category: "religion",
    subcategory: "Historiography",
    eventType: "historical",
    evidenceStatus: "disputed",
    tags: T(["place: bahia and brazil", "place: saint-domingue and haiti", "place: ouidah"], "historiography", "method"),
    people: ["John Thornton", "Gwendolyn Midlo Hall", "James H. Sweet", "Luis Nicolau Parés", "Robin Law", "David Eltis"],
    civilisations: ["Historians of the Atlantic world"],
    locationName: "The Atlantic world",
    media: [P.norrisMap, P.nkangiBrooklyn],
    claims: [
      {
        sourceKey: "thornton_africa_africans_1998",
        citations: [
          { sourceKey: "hall_slavery_african_ethnicities_2005", relation: "supports", note: "Restoring links between American communities and African regions." },
          { sourceKey: "sweet_recreating_africa_2003", relation: "supports", note: "Inquisition records as evidence of African practice continuing." },
          { sourceKey: "pares_formation_candomble_2013", relation: "supports", note: "The Jeje nation traced through Bahian records." },
          { sourceKey: "mintz_price_1976", relation: "disputes", note: "The model this approach argues against." },
        ],
        startYear: 1992,
        endYear: 2013,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "From Thornton's first edition (1992) to the English edition of Parés (2013)",
        originalDateText: "1992–2013",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Publication dates of the principal works of a historiographical movement.",
      },
    ],
  },

  // =========================================================================
  // 9. A DOCUMENTED CASE AND A HYPOTHESIS
  // =========================================================================

  // =========================================================================
  // 10. RETURN
  // =========================================================================
  {
    slug: "agudas-and-tabom-returnees",
    title: "Agudás and Tabom: freed Africans return from Brazil",
    summary:
      "After the 1835 Malê revolt in Bahia, Brazil deported freed Africans and many more left by choice. They settled at Agoué, Ouidah, Porto-Novo and Lagos, where they became the 'Agudá' or 'Brazilians', and at Accra, where they are the Tabom — Catholic, Portuguese-speaking, and part of the region's history ever since.",
    description:
      "WHY THEY LEFT. In January 1835 Muslim Africans in Salvador, many of them Yoruba-speaking (Malê), rose in revolt. The authorities deported some freed Africans — about 200 by one estimate — and new laws pressed freedpeople so hard that at least several times as many chose to leave. Return continued through the nineteenth century.\n\n" +
      "WHERE THEY WENT. To the coast many had been shipped from: AGOUÉ, OUIDAH, PORTO-NOVO, BADAGRY and LAGOS, where they joined Brazilian and Portuguese merchant families already there (de Souza in Ouidah — see benin-atlantic). In 1852 the ruler of Lagos granted land that became the Brazilian Quarter (Popo Aguda); by the 1880s returnees were about a tenth of the town. In ACCRA, a group arriving in 1836 founded the community called TABOM, from their Portuguese 'tá bom' ('all right'); Brazil House in James Town is its emblem.\n\n" +
      "WHO THEY WERE. 'Agudá' covers a mixed community: freed Yoruba, Hausa, Nupe, Gbe-speaking and Mahi Africans, Brazilian-born people of African descent, and Luso-Brazilian traders. Catholicism, Portuguese names and the feast of Bonfim marked it off; but its members also included Muslims and people who served vodun and orisha. Parés shows that the mass baptisms at Agoué in 1846 and 1855 bound returnees into a merchant community — whose early business included the slave trade. That uncomfortable fact is part of the record.\n\n" +
      "SIGNIFICANCE. Return closes the circle this track draws: people taken from the Bight of Benin, or their children, came back carrying Brazilian Catholicism and Afro-Brazilian practice, and became intermediaries between the two coasts. Their presence is one reason present-day resemblances between Bénin and Brazil must not be read straight back as eighteenth-century survivals: some travelled in the nineteenth century, east to west.\n\n" +
      "THINGS TO ASK: Is a returnee community African, Brazilian, or a third thing made by the Atlantic?",
    category: "history",
    subcategory: "Return",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["place: ouidah", "place: porto-novo", "place: bahia and brazil", "practice: catholic contact", "place: oyo and yorubaland"], "agudas", "tabom", "return"),
    civilisations: ["Agudá", "Tabom", "Malê", "Afro-Brazilians"],
    people: ["Luis Nicolau Parés", "Francisco Félix de Souza"],
    locationName: "Agoué, Ouidah, Porto-Novo, Lagos and Accra",
    lat: 6.24,
    lng: 1.69,
    media: [P.brazilHouseAccra, P.casaBrasilOuidah],
    claims: [
      {
        sourceKey: "wikipedia_brazilian_nigerians",
        citations: [
          { sourceKey: "law_mann_wmq_1999", relation: "supports", note: "Returnees as part of the two-way Atlantic community of the Slave Coast." },
          { sourceKey: "verger_flux_reflux_1968", relation: "supports", note: "The 'reflux': return of freed Africans from Bahia." },
        ],
        startYear: 1835,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Deportations from Bahia after the Malê revolt — the first recorded repatriation",
        originalDateText: "1835, after the Malê revolt in Salvador",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Brazilian government records of deportation; the number (about 200) is an estimate reported in secondary sources and NEEDS SOURCE VERIFICATION.",
      },
      {
        sourceKey: "wikipedia_tabom",
        citations: [
          { sourceKey: "law_mann_wmq_1999", relation: "context", note: "Returnees across the coast in the nineteenth century." },
        ],
        startYear: 1836,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "traditional_date",
        whatIsDated: "Arrival of the first Tabom families in Accra",
        originalDateText: "1836, by community tradition (about seventy people in seven families)",
        datingMethod: "oral_tradition",
        chronology: "traditional",
        evidence:
          "EVIDENCE TYPE: oral tradition. The Tabom community's own account, repeated in Ghanaian press; the year, the ship and the numbers NEED SOURCE VERIFICATION against documents.",
      },
      {
        sourceKey: "pares_agoue_baptism_2015",
        citations: [
          { sourceKey: "law_ouidah_2004", relation: "context", note: "The Brazilian community of Ouidah in the same period." },
        ],
        startYear: 1846,
        endYear: 1855,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "Mass baptisms of the returnee community at Agoué",
        originalDateText: "Agoué, 1846 and 1855",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Sacramental records and missionary accounts studied by Parés.",
      },
    ],
  },

  {
    slug: "brazilian-style-buildings-bight-of-benin",
    title: "Brazilian-style buildings in Porto-Novo, Lagos and Ouidah",
    summary:
      "Returnee masons and carpenters brought Bahian building styles to the Bight of Benin: two-storey sobrados, stucco façades, the Holy Cross Cathedral of Lagos, and the Great Mosque of Porto-Novo. The architecture is the most visible trace of the return.",
    description:
      "THE BUILDERS. Many freed Africans in Bahia had worked as carpenters, masons and bricklayers. On their return from the 1830s they introduced the styles of colonial Brazil: symmetrical façades, stucco ornament, shuttered windows, one-storey houses and multi-storey SOBRADOS. By the end of the nineteenth century this 'Brazilian' style dominated Lagos Island and was prominent in Ouidah, Porto-Novo and Agoué.\n\n" +
      "LANDMARKS. In LAGOS: the WATER HOUSE on Kakawa Street, built by João Esan da Rocha, who sold water from his well, and extended by his son Candido; and the HOLY CROSS CATHEDRAL (1878–81), the city's first brick church, built by Brazilian master builders including Lázaro Borges da Silva — who also built the old Jamiu Central Mosque. In PORTO-NOVO: the GREAT MOSQUE, built in the early twentieth century in Afro-Brazilian style, its façade recalling the churches of Salvador. In OUIDAH: returnee houses in the Brazilian quarter (see benin-atlantic).\n\n" +
      "WHAT IT SHOWS ABOUT RELIGION. The same builders worked for Catholics and Muslims, and a mosque in a Bahian baroque style is the clearest sign that 'Brazilian' on this coast meant a craft and a social identity, not a single religion. Many of these buildings have since been demolished or remodelled; heritage campaigns in Lagos, Porto-Novo and Ouidah work to keep the rest.\n\n" +
      "SIGNIFICANCE. The return voyage carried not only people and religion but a built environment. When visitors to Ouidah or Porto-Novo today see 'Brazilian' houses near Vodun shrines, they are looking at nineteenth-century Atlantic history — a second layer laid over the first, not an original from which Brazil copied.\n\n" +
      "THINGS TO ASK: What does it mean that a mosque in Porto-Novo looks like a church in Bahia?",
    category: "culture",
    subcategory: "Return",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: T(["place: porto-novo", "place: ouidah", "place: oyo and yorubaland", "practice: catholic contact"], "architecture", "agudas", "heritage"),
    people: ["João Esan da Rocha", "Candido da Rocha", "Lázaro Borges da Silva"],
    civilisations: ["Agudá", "Afro-Brazilian returnees"],
    locationName: "Lagos Island, Porto-Novo and Ouidah",
    lat: 6.497,
    lng: 2.605,
    media: [P.portoNovoMosque, P.waterHouseLagos],
    claims: [
      {
        sourceKey: "wikipedia_brazilian_nigerians",
        citations: [
          { sourceKey: "law_mann_wmq_1999", relation: "context", note: "Lagos and the Brazilian returnee community in the nineteenth century." },
        ],
        startYear: 1878,
        endYear: 1881,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "Construction of the Holy Cross Cathedral, Lagos, by Brazilian master builders",
        originalDateText: "1878–1880, completed 1881",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Church and mission records as summarised in secondary sources, which disagree on the completion year.",
      },
      {
        sourceKey: "law_ouidah_2004",
        citations: [
          { sourceKey: "wikipedia_brazilian_nigerians", relation: "supports", note: "Returnees introduced Brazilian styles from the 1830s." },
        ],
        startYear: 1835,
        endYear: 1935,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The period of Afro-Brazilian building on the Bight of Benin, to the Porto-Novo mosque",
        originalDateText: "From the 1830s to the early twentieth century",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Architectural history and heritage surveys; the Porto-Novo mosque's construction dates NEED SOURCE VERIFICATION.",
      },
    ],
  },

  {
    slug: "lagos-bahia-traffic-and-nago-purity",
    title: "Lagos–Bahia traffic and the making of 'Nagô purity'",
    summary:
      "In the late nineteenth and early twentieth centuries, merchants, returnees and priests travelling between Lagos and Bahia brought Yoruba texts, goods and prestige to Candomblé. Matory argues that the 'purity' of the Nagô houses was made by this traffic — not preserved from the eighteenth century.",
    description:
      "THE TRAFFIC. After the Brazilian slave trade ended in 1850–51, ships kept sailing between Bahia and the Bight of Benin, now carrying free passengers, kola nuts, African cloth, black soap and ritual goods. Afro-Bahians went to Lagos to study, trade and learn; some came back. MARTINIANO ELISEU DO BONFIM, son of African parents in Salvador, spent years in Lagos in the 1870s–80s, learned English and Yoruba, returned as a babalawo and became an adviser to the leading terreiros of the early twentieth century. Lagos in those decades was the scene of a Yoruba cultural renaissance, which reached Bahia through such people.\n\n" +
      "MATORY'S ARGUMENT. In Black Atlantic Religion (2005) J. Lorand Matory argues that Candomblé was shaped by this TRANSNATIONAL movement: the prestige of the Nagô (Yoruba) nation, the ideal of 'African purity', the role of women priests, were products of a living two-way circuit, not passive survivals. He criticises both the 'survivals' tradition and Beatriz Góis Dantas, who had argued that Nagô purity was invented by Brazilian intellectuals, for leaving out Black travellers' own agency.\n\n" +
      "WHERE IT MEETS THE VODUN STORY. The rise of Nagô prestige is part of why the Jeje nation came to look secondary in Bahia, and why Parés and Matory disagree about Jeje influence. It also means that Gbe and Yoruba features in Candomblé may have arrived at different times and by different routes: some with eighteenth-century captives, some with nineteenth-century free travellers.\n\n" +
      "SIGNIFICANCE. This record turns 'what crossed?' into 'what crossed, when, and in which direction?'. Religious knowledge crossed during the slave trade AND after it, by choice, and both crossings shaped the religions now practised. Present-day exchange between Bénin, Nigeria and Brazil (the modern track) continues a traffic over a century old.\n\n" +
      "THINGS TO ASK: If 'pure' African tradition was reinforced by later travel, is it less authentic — or is the travel itself part of the tradition?",
    category: "religion",
    subcategory: "Return",
    eventType: "historical",
    evidenceStatus: "disputed",
    tags: T(["place: bahia and brazil", "place: oyo and yorubaland", "deity: orisha", "practice: divination"], "candomble", "nago", "transnational"),
    people: ["Martiniano Eliseu do Bonfim", "J. Lorand Matory", "Beatriz Góis Dantas", "Luis Nicolau Parés"],
    civilisations: ["Nagô", "Yoruba", "Afro-Bahians", "Lagos"],
    locationName: "Lagos and Salvador da Bahia",
    lat: 6.455,
    lng: 3.39,
    media: [P.waterHouseLagos, P.capoeiraBahia],
    claims: [
      {
        sourceKey: "matory_black_atlantic_religion_2005",
        citations: [
          { sourceKey: "dantas_vovo_nago_1988", relation: "disputes", note: "Explains Nagô purity as constructed by Brazilian intellectuals rather than by transatlantic Black agency." },
          { sourceKey: "pares_formation_candomble_2013", relation: "context", note: "Gives more weight to earlier Jeje structures." },
        ],
        startYear: 1850,
        endYear: 1940,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The Lagos–Bahia traffic of free travellers, priests and goods",
        originalDateText: "From the end of the Brazilian slave trade to the 1930s",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: later historical account. Shipping and press records, travellers' biographies and ethnography as analysed by Matory; details of Martiniano do Bonfim's Lagos years NEED SOURCE VERIFICATION.",
      },
    ],
  },

  // =========================================================================
  // 11. COMPARISON
  // =========================================================================
  {
    slug: "serpent-symbolism-across-the-atlantic",
    title: "Serpent symbolism across the Atlantic: Dan, Damballa, Oxumaré, Aido-Hwedo and the Louisiana snake",
    summary:
      "Serpent powers appear on both sides of the ocean: Dan and Aido-Hwedo in Gbe Vodun, Danbala and Ayida Wèdo in Haitian Vodou, Oxumarê and Bessen in Candomblé, Fodu in Winti, and the snake 'Zombi' of New Orleans stories. Some links are documented by names; others rest on resemblance or on literary borrowing.",
    description:
      "THE SERPENTS. GBE VODUN: DAN (Dangbe at Ouidah, where pythons are kept in the Temple of Pythons) and AIDO-HWEDO, the rainbow serpent associated with continuity and with holding the world together (benin-vodun: 'Dan: the serpent'). HAITIAN VODOU: DANBALA WÈDO and AYIDA WÈDO, paired serpent lwa of the Rada rite, white, cool, associated with water and the rainbow, saluted with vèvè like the one shown here. CANDOMBLÉ: OXUMARÊ, the Yoruba-derived orixá of the rainbow and the snake, and in Jeje houses BESSEN, the serpent vodun, often identified with him. SURINAME: FODU, a snake spirit among the earth winti. LOUISIANA: the snake called 'ZOMBI' or 'Li Grand Zombi' in nineteenth- and twentieth-century accounts of New Orleans Voodoo and Marie Laveau.\n\n" +
      "SIMILARITIES. Serpents associated with water, the rainbow, continuity, wealth and the coiling movement that links earth and sky; snakes treated as sacred and not to be killed; white as the colour of the serpent power; a pair of serpent powers (Dan and Aido-Hwedo, Danbala and Ayida).\n\n" +
      "DIFFERENCES. Ouidah's Dangbe was a royal and civic cult of living pythons; Haitian Danbala is a lwa who possesses devotees, with a Catholic saint (often Saint Patrick, driving out snakes) and no kept snakes. Oxumarê comes through Yoruba, not Gbe, tradition. Fodu sits in a Winti pantheon of mixed origin. The Louisiana 'Zombi' carries a Kongo-derived name (nzambi, 'god') and a story whose sources are literary.\n\n" +
      "EVIDENCE FOR TRANSMISSION. STRONG where names correspond: DAN → DANBALA and AIDO-HWEDO → AYIDA WÈDO (Wèdo from Hueda/Ouidah), and Jeje BESSEN, are Gbe names in diaspora religions. MODERATE for Fodu (a 'vodu' etymology is proposed). WEAK FOR LOUISIANA: Moreau de Saint-Méry's 1797 description of a serpent in a box at the centre of the Arada 'Vaudoux' in Saint-Domingue was reused by George W. Cable in 1886 for New Orleans, and Carolyn Morrow Long shows how much of the Laveau-and-snake story was built by journalists and writers. The jump from Ouidah's pythons to a New Orleans snake therefore passes through a chain of texts, not a documented line of practice. And many religions worldwide have sacred serpents (see serpent-is-not-one-symbol): resemblance alone proves nothing.\n\n" +
      "SIGNIFICANCE. The serpent is the image most often used to say 'Voodoo came from Ouidah'. The real evidence is better and narrower than the slogan: a set of Gbe serpent names inside Haitian and Brazilian religions, and a European literary tradition that spread one Saint-Domingue description across the Atlantic world.\n\n" +
      "THINGS TO ASK: For each serpent, is the link a name, a rite, a text, or only a shape?",
    category: "religion",
    subcategory: "Comparison",
    eventType: "historical",
    evidenceStatus: "disputed",
    tags: T(
      ["deity: dan and aido-hwedo", "practice: serpent veneration", "place: ouidah", "place: saint-domingue and haiti", "place: bahia and brazil", "place: new orleans", "place: suriname", "practice: veve and sacred art"],
      "comparison",
      "serpent"
    ),
    people: ["Marie Laveau", "Médéric Louis Élie Moreau de Saint-Méry", "George W. Cable", "Carolyn Morrow Long", "Willem Bosman"],
    civilisations: ["Hueda", "Fon", "Haiti", "Jeje", "Nagô", "Afro-Surinamese", "Louisiana Creoles"],
    locationName: "Ouidah, Haiti, Bahia, Suriname and New Orleans",
    media: [P.pythonTemple, P.veveDamballa, P.oxumareRelief, P.laveauKemble],
    claims: [
      {
        sourceKey: "bosman_guinea_1705",
        citations: [
          { sourceKey: "moreau_description_1797", relation: "supports", note: "Serpent at the centre of the Arada 'Vaudoux' in Saint-Domingue, a century later." },
        ],
        startYear: 1704,
        endYear: 1797,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "From Bosman's account of the Whydah serpent (1704/1705) to Moreau's Saint-Domingue serpent (1797)",
        originalDateText: "Bosman 1704–05; Moreau de Saint-Méry 1797",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Two European outsiders' descriptions, of Ouidah and of Saint-Domingue. They date written records of serpent veneration on both sides; neither dates the beginning of a cult, and the second may have been shaped by knowledge of the first.",
      },
      {
        sourceKey: "long_voudou_priestess_2006",
        citations: [
          { sourceKey: "cable_creole_slave_songs_1886", relation: "context", note: "Cable's 1886 reuse of Moreau's serpent description for New Orleans." },
        ],
        startYear: 1886,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Cable's transfer of the Saint-Domingue serpent story to New Orleans",
        originalDateText: "The Century Magazine, 1886",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Long's analysis of the literary sources; Cable's article is the dated text. It dates a literary borrowing, not a practice — and the precise first appearance of the name 'Zombi' for the snake NEEDS SOURCE VERIFICATION.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const links: SeedEventLink[] = [
  // ---- To the other five anchors ------------------------------------------
  { from: "vodun-atlantic-what-crossed", to: A.africa, relation: "responds_to", note: "What could be carried depends on what West African Vodun was; the Africa track's anchor sets out what can be recovered of it." },
  { from: "vodun-atlantic-what-crossed", to: A.kingdoms, relation: "related", note: "The kingdoms that sponsored and regulated cults were among the things that could not cross; their wars also supplied captives." },
  { from: "vodun-atlantic-what-crossed", to: A.haiti, relation: "precedes", note: "The crossing precedes the formation of Haitian Vodou in Saint-Domingue." },
  { from: "vodun-atlantic-what-crossed", to: A.americas, relation: "precedes", note: "The crossing precedes the formation of Louisiana Voodoo and the other American traditions." },
  { from: "vodun-atlantic-what-crossed", to: A.modern, relation: "related", note: "Present-day exchange between Bénin and the Americas reopens the question of what crossed, in both directions." },
  { from: "arada-in-saint-domingue", to: A.haiti, relation: "precedes", note: "The Arada arrivals and Moreau's 'Vaudoux' are the Atlantic end of Haitian Vodou's formation." },
  { from: "code-noir-1685-religion-clauses", to: A.haiti, relation: "relevant", note: "The Code Noir's ban on non-Catholic worship is the legal frame in which Vodou formed in Saint-Domingue." },
  { from: "code-noir-1685-religion-clauses", to: A.americas, relation: "relevant", note: "The 1724 Louisiana code repeated the religious clauses that shaped Louisiana Voodoo's conditions." },
  { from: "ouidah-to-louisiana-1719-1731", to: A.americas, relation: "precedes", note: "The direct Ouidah ships are the earliest Gbe link to the colony whose religion became Louisiana Voodoo." },
  { from: "serpent-symbolism-across-the-atlantic", to: A.americas, relation: "related", note: "The Louisiana 'Zombi' snake story is examined against its literary sources." },
  { from: "serpent-symbolism-across-the-atlantic", to: A.haiti, relation: "related", note: "Danbala and Ayida Wèdo are the Haitian serpent lwa compared here." },
  { from: "kongo-christians-in-the-americas", to: A.haiti, relation: "relevant", note: "Kongo Christianity is one of the two African roots Thornton identifies for Haitian Vodou." },
  { from: "herskovits-dahomey-and-survivals", to: A.africa, relation: "related", note: "Herskovits's 1931 Dahomey is one of the twentieth-century sources the Africa track must read critically." },
  { from: "lagos-bahia-traffic-and-nago-purity", to: A.modern, relation: "precedes", note: "Nineteenth-century Lagos–Bahia traffic is the forerunner of today's transatlantic religious exchange." },
  { from: "agudas-and-tabom-returnees", to: A.modern, relation: "precedes", note: "The returnee communities are part of the heritage presented in Bénin and Brazil today." },
  { from: "domingos-alvares-gbe-healer", to: A.kingdoms, relation: "related", note: "Domingos was enslaved in the wars of Agaja's expanding Dahomey, which he opposed." },
  { from: "na-agontime-and-the-casa-das-minas", to: A.kingdoms, relation: "related", note: "The royal vodun served in Maranhão were court cults of the Dahomean kingdom." },
  { from: "jeje-nation-in-bahia", to: A.americas, relation: "related", note: "The Jeje nation is part of the formation of Candomblé, covered in the Americas track." },
  { from: "cuban-cabildos-de-nacion", to: A.americas, relation: "related", note: "Cuba's cabildos are the institutional setting of Lucumí and Arará religion in the Americas track." },
  { from: "bight-of-benin-in-suriname", to: A.americas, relation: "related", note: "Winti in Suriname is treated as a religion in the Americas track; this record supplies the Atlantic link." },

  // ---- Into the Bénin datasets --------------------------------------------
  { from: "vodun-atlantic-what-crossed", to: "vodun-across-the-atlantic", relation: "responds_to", note: "Takes up the existing record's closing question — what can survive a forced crossing — and answers it in detail." },
  { from: "vodun-atlantic-what-crossed", to: "ouidah-and-the-scale-of-the-trade", relation: "related", note: "The scale of the trade is the precondition of everything that crossed." },
  { from: "vodun-atlantic-what-crossed", to: "initiation-and-restricted-knowledge", relation: "related", note: "Restricted initiatory knowledge is exactly what could only cross inside initiated people." },
  { from: "vodun-atlantic-what-crossed", to: "oral-knowledge-as-technology", relation: "related", note: "Oral knowledge is the form in which religion could be carried without objects or shrines." },
  { from: "bight-of-benin-two-million-estimate", to: "ouidah-and-the-scale-of-the-trade", relation: "responds_to", note: "Supplies the published estimate the existing record deliberately left out, with its estimated status attached." },
  { from: "bight-of-benin-two-million-estimate", to: "british-suppression-and-the-illegal-trade", relation: "related", note: "The estimate includes the illegal trade after 1807 that the suppression record describes." },
  { from: "slave-coast-ports-jakin-to-lagos", to: "european-forts-at-ouidah", relation: "related", note: "The forts at Ouidah were one stage in a sequence of shifting ports along the coast." },
  { from: "slave-coast-ports-jakin-to-lagos", to: "hueda-kingdom-and-savi", relation: "related", note: "Hueda's Ouidah overtook Allada's Offra and Jakin as the principal port." },
  { from: "slave-coast-ports-jakin-to-lagos", to: "porto-novo-hogbonu-founded", relation: "related", note: "Porto-Novo rose as an alternative port to Dahomey's Ouidah." },
  { from: "slave-coast-ports-jakin-to-lagos", to: "agaja", relation: "related", note: "Agaja's conquests of Allada (1724) and Hueda (1727) and the destruction of Jakin (1732) reshaped the ports." },
  { from: "nation-names-as-evidence", to: "arada-people-in-the-americas-1560s", relation: "responds_to", note: "Extends the 1560s Arada record to the whole family of nation names and their religious use." },
  { from: "nation-names-as-evidence", to: "allada-in-portuguese-records-1539", relation: "related", note: "Allada's appearance in Portuguese records is the source of the Arada/Arará/Rada names." },
  { from: "nation-names-as-evidence", to: "not-one-theology", relation: "related", note: "A single label like 'Arada' or 'Jeje' covered peoples who did not share one theology." },
  { from: "nation-names-as-evidence", to: "vodun-across-the-atlantic", relation: "related", note: "The existing record names Jeje and Arará as evidence; this one sets out what such names can and cannot prove." },
  { from: "mina-a-name-on-three-coasts", to: "portuguese-fort-until-1961", relation: "related", note: "The Portuguese presence at Ouidah belongs to the 'Costa da Mina' trade that gave the label its eastern meaning." },
  { from: "jeje-nation-in-bahia", to: "vodun-across-the-atlantic", relation: "responds_to", note: "Goes deeper into the Jeje traditions the existing record names." },
  { from: "jeje-nation-in-bahia", to: "heviosso-thunder", relation: "related", note: "Jeje houses serve thunder vodun (Sogbo) of the Hevioso family." },
  { from: "jeje-nation-in-bahia", to: "sakpata", relation: "related", note: "Jeje houses serve earth and disease vodun (Azonsu) related to Sakpata." },
  { from: "arada-in-saint-domingue", to: "arada-people-in-the-americas-1560s", relation: "related", note: "The same Allada-derived label, two centuries later, in the French Caribbean." },
  { from: "arada-in-saint-domingue", to: "legba-and-papa-legba", relation: "related", note: "Legba's crossing to Haiti is one documented case of what the Arada carried." },
  { from: "arada-in-saint-domingue", to: "vodun-is-not-voodoo", relation: "related", note: "Moreau's 'Vaudoux' is the first written form of the Haitian word whose relation to Vodun the existing record explains." },
  { from: "ouidah-to-louisiana-1719-1731", to: "european-forts-at-ouidah", relation: "related", note: "The French establishment at Ouidah supplied the Company of the Indies' ships to Louisiana." },
  { from: "bahia-bight-of-benin-tobacco-route", to: "portuguese-fort-until-1961", relation: "related", note: "The Portuguese fort at Ouidah existed largely to serve the Bahia trade." },
  { from: "bahia-bight-of-benin-tobacco-route", to: "de-souza-and-place-chacha", relation: "related", note: "De Souza, a Brazilian merchant at Ouidah, embodies the Bahia route in the nineteenth century." },
  { from: "bahia-bight-of-benin-tobacco-route", to: "ouidah-one-landscape-many-worlds", relation: "related", note: "Ouidah's mixture of Vodun, Catholic and Brazilian worlds was produced by the long Bahia connection." },
  { from: "shipmates-bonds-made-in-the-hold", to: "ouidah-slave-route-memorial", relation: "related", note: "The memorial route ends at the beach where the crossing began." },
  { from: "black-brotherhoods-by-nation-brazil", to: "temple-and-basilica-face-each-other", relation: "related", note: "Catholic and Vodun institutions side by side in Ouidah have a counterpart in Jeje Catholic brotherhoods in Bahia." },
  { from: "black-brotherhoods-by-nation-brazil", to: "ancestors-in-vodun", relation: "related", note: "Brotherhoods' care for funerals and the dead met obligations that Vodun places on the living." },
  { from: "calundu-in-colonial-brazil", to: "possession-and-trance", relation: "related", note: "Calundu ceremonies centred on spirit possession, as Vodun does." },
  { from: "calundu-pasto-cachoeira-1785", to: "offerings-shrines-and-sacrifice", relation: "related", note: "The objects seized in the raid were the shrine materials of a vodun community." },
  { from: "domingos-alvares-gbe-healer", to: "fa-divination", relation: "related", note: "Divination was part of the healing knowledge Domingos carried." },
  { from: "domingos-alvares-gbe-healer", to: "conquest-absorbs-cults", relation: "related", note: "Domingos's enslavement came in the conquests by which Dahomey absorbed or suppressed the cults of conquered peoples." },
  { from: "mandinga-pouches-before-the-inquisition", to: "bocio-power-figures", relation: "related", note: "Protective power objects in Vodun are the nearest West African parallel to the Atlantic mandinga pouch." },
  { from: "code-noir-1685-religion-clauses", to: "vodun-under-colonial-rule", relation: "related", note: "French colonial law confronted African religion in the Caribbean two centuries before it did so in Dahomey." },
  { from: "kongo-christians-in-the-americas", to: "temple-and-basilica-face-each-other", relation: "related", note: "African Christianity and African religion side by side, in Kongo and the Americas as in Ouidah." },
  { from: "herskovits-dahomey-and-survivals", to: "vodun-across-the-atlantic", relation: "related", note: "Herskovits's survivals model is the origin of much of the comparison the existing record treats cautiously." },
  { from: "herskovits-dahomey-and-survivals", to: "annual-customs-xwetanu", relation: "related", note: "Herskovits's Dahomey monograph is a major twentieth-century source on the royal customs." },
  { from: "herskovits-frazier-debate", to: "resemblance-is-not-descent", relation: "related", note: "The debate turned on when a resemblance counts as evidence of survival." },
  { from: "mintz-price-creolisation-model", to: "resemblance-is-not-descent", relation: "related", note: "The creolisation model explains resemblance by shared deep orientations rather than direct descent." },
  { from: "africa-centred-turn-thornton-hall-sweet-pares", to: "oral-tradition-is-evidence-but-not-a-transcript", relation: "related", note: "Both insist on stating what kind of evidence holds a claim up." },
  { from: "na-agontime-and-the-casa-das-minas", to: "adandozan", relation: "related", note: "Agontimé is said to have been sold into slavery by Adandozan." },
  { from: "na-agontime-and-the-casa-das-minas", to: "was-adandozan-erased", relation: "related", note: "The story of Adandozan's sale of the queen mother is part of why he was later erased from the king-list." },
  { from: "na-agontime-and-the-casa-das-minas", to: "ghezo", relation: "related", note: "Agontimé was Ghezo's mother; his supposed search for her is part of the tradition." },
  { from: "na-agontime-and-the-casa-das-minas", to: "kpojito-and-the-palace-women", relation: "related", note: "Agontimé belonged to the palace women whose cults and offices the Casa das Minas appears to continue." },
  { from: "agudas-and-tabom-returnees", to: "de-souza-and-place-chacha", relation: "related", note: "Returnees joined the Brazilian merchant community that de Souza had built at Ouidah." },
  { from: "agudas-and-tabom-returnees", to: "ouidah-one-landscape-many-worlds", relation: "related", note: "The Brazilian quarter is one of Ouidah's many worlds." },
  { from: "brazilian-style-buildings-bight-of-benin", to: "ouidah-one-landscape-many-worlds", relation: "related", note: "Afro-Brazilian houses are a visible layer of Ouidah's townscape." },
  { from: "brazilian-style-buildings-bight-of-benin", to: "living-traditions-now", relation: "related", note: "Afro-Brazilian heritage is part of what is still running in Bénin today." },
  { from: "lagos-bahia-traffic-and-nago-purity", to: "vodun-days-and-unesco-status", relation: "related", note: "Today's state-sponsored transatlantic heritage events continue a much older traffic." },
  { from: "serpent-symbolism-across-the-atlantic", to: "dan-the-serpent", relation: "responds_to", note: "Follows Dan and Aido-Hwedo across the Atlantic and tests each claimed descendant." },
  { from: "serpent-symbolism-across-the-atlantic", to: "bosman-describes-the-serpent-at-whydah", relation: "related", note: "Bosman's account is the African end of the serpent comparison.", sourceKey: "bosman_guinea_1705" },
  { from: "serpent-symbolism-across-the-atlantic", to: "temple-of-pythons-today", relation: "related", note: "The present-day Ouidah python cult is the living African counterpart in the comparison." },
  { from: "serpent-symbolism-across-the-atlantic", to: "resemblance-is-not-descent", relation: "related", note: "Applies the existing record's tests to serpent resemblances across the Atlantic." },

  // ---- To other existing datasets -----------------------------------------
  { from: "serpent-symbolism-across-the-atlantic", to: "serpent-is-not-one-symbol", relation: "related", note: "Sacred serpents occur worldwide with different meanings; resemblance alone is no evidence of transmission." },
  { from: "serpent-symbolism-across-the-atlantic", to: "okomilo-python-comparison", relation: "related", note: "A parallel test of python traditions in the Edo region, using the same distinction between resemblance and documented connection." },
  { from: "serpent-symbolism-across-the-atlantic", to: "okomilo-benin-palace-pythons", relation: "related", note: "Python imagery in the Kingdom of Benin, a neighbouring but distinct tradition, for comparison." },

  // ---- Inside this track -----------------------------------------------------
  { from: "bight-of-benin-two-million-estimate", to: "vodun-atlantic-what-crossed", relation: "part_of", note: "The scale of the trade is the first kind of evidence the anchor lists." },
  { from: "slave-coast-ports-jakin-to-lagos", to: "vodun-atlantic-what-crossed", relation: "part_of", note: "The ports determined who was shipped and where." },
  { from: "nation-names-as-evidence", to: "vodun-atlantic-what-crossed", relation: "evidence_for", note: "Nation names are the second kind of evidence for what crossed." },
  { from: "mina-a-name-on-three-coasts", to: "nation-names-as-evidence", relation: "part_of", note: "'Mina' is the hardest case of a nation name to read." },
  { from: "jeje-nation-in-bahia", to: "nation-names-as-evidence", relation: "part_of", note: "Jeje is the Brazilian nation name for Gbe-speakers." },
  { from: "arara-in-matanzas", to: "nation-names-as-evidence", relation: "part_of", note: "Arará is the Cuban nation name from Allada." },
  { from: "arada-in-saint-domingue", to: "nation-names-as-evidence", relation: "part_of", note: "Arada/Rada is the French Caribbean form of the Allada name." },
  { from: "arada-in-saint-domingue", to: "slave-coast-ports-jakin-to-lagos", relation: "related", note: "French ships at Ouidah and Porto-Novo supplied Saint-Domingue." },
  { from: "ouidah-to-louisiana-1719-1731", to: "mina-a-name-on-three-coasts", relation: "related", note: "Louisiana's 'Mina' meant Bight of Benin people, in Hall's reading." },
  { from: "bahia-bight-of-benin-tobacco-route", to: "jeje-nation-in-bahia", relation: "precedes", note: "The direct route brought the Gbe-speakers who became Bahia's Jeje." },
  { from: "bahia-bight-of-benin-tobacco-route", to: "agudas-and-tabom-returnees", relation: "precedes", note: "The same route later carried freed Africans back: Verger's 'reflux'." },
  { from: "bight-of-benin-in-suriname", to: "mintz-price-creolisation-model", relation: "related", note: "Suriname's Maroons were the model case for both Herskovits and Mintz and Price." },
  { from: "shipmates-bonds-made-in-the-hold", to: "mintz-price-creolisation-model", relation: "evidence_for", note: "The shipmate bond is a key example in the creolisation model.", sourceKey: "mintz_price_1976" },
  { from: "cuban-cabildos-de-nacion", to: "arara-in-matanzas", relation: "related", note: "Arará religion in Cuba lived inside cabildos." },
  { from: "cuban-cabildos-de-nacion", to: "black-brotherhoods-by-nation-brazil", relation: "related", note: "Both are Catholic-framed institutions organised by African nation." },
  { from: "calundu-pasto-cachoeira-1785", to: "calundu-in-colonial-brazil", relation: "part_of", note: "The 1785 raid is a Jeje case within the wider calundu record." },
  { from: "calundu-pasto-cachoeira-1785", to: "jeje-nation-in-bahia", relation: "evidence_for", note: "The raid documents organised Jeje vodun practice in eighteenth-century Bahia.", sourceKey: "reis_magia_jeje_1988" },
  { from: "domingos-alvares-gbe-healer", to: "vodun-atlantic-what-crossed", relation: "evidence_for", note: "Domingos is the best-documented individual carrier of Gbe religious knowledge.", sourceKey: "sweet_domingos_alvares_2011" },
  { from: "domingos-alvares-gbe-healer", to: "calundu-in-colonial-brazil", relation: "related", note: "Like calundu leaders, Domingos healed and gathered followers and was prosecuted for it." },
  { from: "mandinga-pouches-before-the-inquisition", to: "domingos-alvares-gbe-healer", relation: "related", note: "Both are known from the same Lisbon Inquisition's prosecutions of African practice." },
  { from: "code-noir-1685-religion-clauses", to: "arada-in-saint-domingue", relation: "relevant", note: "The Code Noir governed the colony the Arada were shipped to." },
  { from: "kongo-christians-in-the-americas", to: "code-noir-1685-religion-clauses", relation: "related", note: "Many Central Africans the Code ordered baptised were already Christians." },
  { from: "kongo-christians-in-the-americas", to: "arada-in-saint-domingue", relation: "related", note: "Kongo and Arada were the two principal African religious worlds of Saint-Domingue." },
  { from: "herskovits-frazier-debate", to: "herskovits-dahomey-and-survivals", relation: "responds_to", note: "The debate is Herskovits's survivals model meeting its critic." },
  { from: "mintz-price-creolisation-model", to: "herskovits-dahomey-and-survivals", relation: "responds_to", note: "The creolisation model replaced survivals with creation." },
  { from: "africa-centred-turn-thornton-hall-sweet-pares", to: "mintz-price-creolisation-model", relation: "responds_to", note: "The Africa-centred historians argued against the 'random crowd' picture." },
  { from: "africa-centred-turn-thornton-hall-sweet-pares", to: "domingos-alvares-gbe-healer", relation: "related", note: "Sweet's biography of Domingos is a flagship of the Africa-centred approach." },
  { from: "na-agontime-and-the-casa-das-minas", to: "mina-a-name-on-three-coasts", relation: "related", note: "The 'house of the Minas' and Tambor de Mina carry the Portuguese coastal label." },
  { from: "na-agontime-and-the-casa-das-minas", to: "vodun-atlantic-what-crossed", relation: "evidence_for", note: "Royal court vodun in Maranhão is evidence that restricted cult knowledge crossed with initiated people." },
  { from: "agudas-and-tabom-returnees", to: "brazilian-style-buildings-bight-of-benin", relation: "related", note: "The returnees were the builders of the Brazilian style." },
  { from: "lagos-bahia-traffic-and-nago-purity", to: "jeje-nation-in-bahia", relation: "related", note: "The rise of Nagô prestige is part of the dispute over the Jeje contribution." },
  { from: "lagos-bahia-traffic-and-nago-purity", to: "agudas-and-tabom-returnees", relation: "related", note: "The returnee communities of Lagos were one end of the traffic." },
  { from: "serpent-symbolism-across-the-atlantic", to: "arada-in-saint-domingue", relation: "related", note: "Moreau's serpent-centred 'Vaudoux' of the Arada is a key text in the comparison." },
  { from: "serpent-symbolism-across-the-atlantic", to: "bight-of-benin-in-suriname", relation: "related", note: "Fodu, the Winti snake spirit, is one of the serpents compared." },
];

export const ATLANTIC: VodunSection = {
  track: "atlantic",
  sources,
  events,
  links,
};
