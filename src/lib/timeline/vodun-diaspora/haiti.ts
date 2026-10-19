// THE HAITIAN VODOU TRACK — from colonial Saint-Domingue to the present.
//
// WHAT THIS SECTION IS ABOUT. Haitian Vodou is a Haitian religion. It formed in
// the French colony of Saint-Domingue, over the eighteenth century and after,
// out of the religious knowledge of people deported from many parts of Africa
// (Gbe-speaking "Arada" people from the Bight of Benin, Kongo and other
// West-Central Africans, Yoruba "Nago", and many more), in forced contact with
// a compulsory Catholicism, and it kept changing through revolution,
// independence, prohibition, occupation, dictatorship and recognition. It is
// related to West African Vodun and is not a copy of it; the benin-vodun
// records "vodun-across-the-atlantic" and "legba-and-papa-legba" make the same
// point from the African side, and this section links to them instead of
// repeating them.
//
// SPELLING. "Vodou" (Kreyòl Vodou) for the Haitian religion; "Vaudoux" only
// where an eighteenth- or nineteenth-century French source wrote it; "Vodun"
// for West Africa; "voodoo" only where the stereotype itself is the subject.
//
// HOW THIS SECTION WAS RESEARCHED. In this session: web searches; Wikipedia's
// "Haitian Vodou", "Bois Caïman" and "Cécile Fatiman" articles were read; news
// and project pages on the 2003 decree, the 2010 Robertson remark and the
// 2010 Cité Soleil attack were seen in search results; publisher abstracts were
// seen for Garrigus (2021). The scholarly monographs (Métraux, Deren, Ramsey,
// Geggus, Fick, Dubois, Desmangles, Brown, Hurbon, McAlister) and the early
// accounts (Moreau de Saint-Méry, Dalmas, Métral, Dumesle, St John) were NOT
// opened here: they are cited at book or chapter level for what they are
// standardly cited for, and anything that rests on a detail not checked in this
// session says "NEEDS SOURCE VERIFICATION". No quotation is given that was not
// read. Every picture's Commons file page was fetched (as wikitext) in this
// session and its licence and author are recorded as the page states them.

import type { SeedClaim, SeedCitation, SeedEvent, SeedEventLink, SeedSource } from "../seed-types";
import { VODUN_DIASPORA_ANCHORS, commonsPicture, vodunTags, type FollowTag, type VodunSection } from "./shared";

const TRACK = "haiti" as const;
const tags = (follow: FollowTag[], ...own: string[]) => vodunTags(TRACK, follow, ...own);
const cite = (sourceKey: string, relation: SeedCitation["relation"], note: string): SeedCitation => ({ sourceKey, relation, note });

/** A documented date claim: defaults to a single, non-approximate year from a written record. */
function claim(input: Partial<SeedClaim> & Pick<SeedClaim, "originalDateText" | "evidence">): SeedClaim {
  return {
    sourceKey: null,
    datePrecision: "year",
    isApproximate: false,
    datingMethod: "historical_record",
    chronology: "historical",
    ...input,
  };
}

const ANCHOR = VODUN_DIASPORA_ANCHORS;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // ---- Colonial and early-national primary sources -------------------------
  {
    key: "haiti_code_noir_1685",
    title: "Édit du Roi touchant la police des îles de l'Amérique française (the \"Code Noir\")",
    author: "Louis XIV (royal edict)",
    publisher: "Versailles, March 1685; reprinted in Le Code noir, ou Recueil des règlements (Paris, 1742 and later)",
    reference: "Articles 2 and 3 (baptism and instruction in the Catholic religion; prohibition of the public exercise of any religion other than the Catholic)",
    url: "https://fr.wikisource.org/wiki/Code_noir/1685",
    sourceType: "government",
    publishedYear: 1685,
    publishedDisplay: "March 1685",
    notes:
      "Cited for the legal frame of religion in the French colonies: enslaved people were to be baptised and instructed as Catholics, and the public exercise of any other religion was forbidden. The article content is standardly cited; the Wikisource transcription was not opened in this session.",
  },
  {
    key: "haiti_moreau_loix",
    title: "Loix et constitutions des colonies françoises de l'Amérique sous le vent",
    author: "Médéric Louis Élie Moreau de Saint-Méry (compiler)",
    publisher: "Paris, 6 vols., 1784–1790",
    reference: "The volumes covering 1750–1765 (the Conseil du Cap rulings after the Makandal affair) and later police ordinances on slave assemblies",
    url: "https://commons.wikimedia.org/wiki/File:Loix_et_constitutions_des_colonies_franc%CC%A7oises_de_l%E2%80%99Am%C3%A9rique_sous_le_vent_-_1750-1765.djvu",
    sourceType: "government",
    publishedYear: 1784,
    publishedDisplay: "1784–1790",
    notes:
      "Cited as the compilation of colonial laws and council rulings for Saint-Domingue, including the post-1758 rulings against 'macandals' (ritual packets) and against night assemblies. The scans exist on Commons; the specific rulings were not read in this session — NEEDS SOURCE VERIFICATION for wording and dates.",
  },
  {
    key: "haiti_moreau_description_1797",
    title: "Description topographique, physique, civile, politique et historique de la partie française de l'isle Saint-Domingue",
    author: "Médéric Louis Élie Moreau de Saint-Méry",
    publisher: "Philadelphia (printed by the author), 2 vols., 1797–1798; 2nd edition Paris, 1875",
    reference: "Vol. 1, the passage on the 'Vaudoux' and on the 'danse à Dom Pèdre' (page numbers vary by edition)",
    url: "https://gallica.bnf.fr/ark:/12148/bpt6k5784239p",
    sourceType: "primary",
    publishedYear: 1797,
    publishedDisplay: "1797 (written from notes made in the colony before 1789)",
    notes:
      "Cited as the earliest substantial written description of a 'Vaudoux' assembly in Saint-Domingue: a serpent in a box, a 'king' and 'queen' presiding, an oath of secrecy, dancing and states of trance, and a separate, more violent 'Dom Pèdre' dance. The work of a white colonial lawyer hostile to what he described; summarised here from the standard secondary accounts (Métraux, Desmangles, Ramsey), not read in this session.",
  },
  {
    key: "haiti_dalmas_1814",
    title: "Histoire de la révolution de Saint-Domingue",
    author: "Antoine Dalmas",
    publisher: "Mame frères, Paris, 2 vols.",
    reference: "Vol. 1, the account of the gathering in the 'Bois-Caïman' before the August 1791 uprising",
    sourceType: "primary",
    publishedYear: 1814,
    publishedDisplay: "written 1793–1794; published 1814",
    notes:
      "Cited as the earliest known account of the ceremony now called Bwa Kayiman: a nocturnal gathering in a wood on the Lenormand de Mézy estate area, the sacrifice of a black pig, and an oath sealed in its blood. Dalmas was a colonist and surgeon who fled the uprising and wrote as its enemy; he names no priestess. Summarised from Geggus and the Wikipedia article; not read in this session.",
  },
  {
    key: "haiti_metral_1818",
    title: "Histoire de l'insurrection des esclaves dans le nord de Saint-Domingue",
    author: "Antoine Métral",
    publisher: "F. Scherff, Paris",
    reference: "The account of the gathering before the 1791 insurrection",
    sourceType: "secondary",
    publishedYear: 1818,
    publishedDisplay: "1818",
    notes:
      "Cited as the second early account of the ceremony, the first to give an oration by a priestess said to be present. Métral was a French writer sympathetic to the insurgents, writing a generation later from no stated eyewitness. Summarised from secondary accounts; not read in this session.",
  },
  {
    key: "haiti_dumesle_1824",
    title: "Voyage dans le nord d'Hayti, ou Révélations des lieux et des monuments historiques",
    author: "Hérard Dumesle",
    publisher: "Imprimerie du Gouvernement, Les Cayes",
    reference: "The chapter on the 1791 insurrection and the gathering before it, with the verse version of Boukman's prayer",
    sourceType: "secondary",
    publishedYear: 1824,
    publishedDisplay: "1824",
    notes:
      "Cited as the first Haitian account of the ceremony, based on Dumesle's visit to the north and on testimony he collected there, and the source of the earliest version of the prayer attributed to Boukman (given by Dumesle in verse). Summarised from secondary accounts; not read in this session.",
  },
  {
    key: "haiti_st_john_1884",
    title: "Hayti, or the Black Republic",
    author: "Spenser St John",
    publisher: "Smith, Elder & Co., London",
    reference: "Chapter on 'Vaudoux worship and cannibalism', including the Bizoton affair",
    url: "https://archive.org/search?query=Hayti+or+the+Black+Republic",
    sourceType: "primary",
    publishedYear: 1884,
    publishedDisplay: "1884 (2nd edition 1889)",
    notes:
      "Cited as the book that carried the claim of Vodou cannibalism to an English-speaking readership. St John had been British chargé d'affaires and minister resident in Haiti; his account of 'Vaudoux' rests heavily on the 1864 Bizoton trial and on hearsay. Cited as evidence of the libel, not of the practices it alleges. Not read in this session.",
  },
  {
    key: "haiti_harpers_1865",
    title: "The Civil War in Hayti (with an engraving of the Bizoton prisoners)",
    author: "James Redpath (text); unnamed engraver",
    publisher: "Harper's Weekly, New York",
    reference: "Harper's Weekly, 2 September 1865, p. 545",
    url: "https://www.flickr.com/photos/internetarchivebookimages/14578638789/",
    sourceType: "newspaper",
    publishedYear: 1865,
    publishedDisplay: "2 September 1865",
    notes:
      "Cited for the American press picture of the Bizoton prisoners, captioned as 'votaries of the god Vaudoux (snake-worshipers), executed for the crime of cannibalism' — evidence of how the trial was reported abroad within two years. Caption wording as recorded on the Commons file page.",
  },
  {
    key: "haiti_seabrook_1929",
    title: "The Magic Island",
    author: "William B. Seabrook (illustrated by Alexander King)",
    publisher: "Harcourt, Brace and Company, New York",
    reference: "Whole book, especially the chapters on ceremonies and the chapter on zombies ('Dead Men Working in the Cane Fields')",
    sourceType: "book",
    publishedYear: 1929,
    publishedDisplay: "1929",
    notes:
      "Cited as the travel book, written during the US occupation, that popularised the 'zombie' in English and fixed a sensational picture of Haitian Vodou for American readers. A primary source for the stereotype, not for Vodou.",
  },
  // ---- Accounts of Bwa Kayiman and the Revolution -------------------------
  {
    key: "haiti_geggus_2002",
    title: "Haitian Revolutionary Studies",
    author: "David Patrick Geggus",
    publisher: "Indiana University Press, Bloomington",
    reference: "Chapter 6, 'The Bois Caïman Ceremony' (revised from Journal of Caribbean History 25, 1991); also the chapters on the 1791 uprising",
    sourceType: "academic_book",
    publishedYear: 2002,
    publishedDisplay: "2002",
    notes:
      "Cited for the source-critical reconstruction of Bwa Kayiman: that a documented meeting of enslaved drivers and coachmen took place at the Lenormand de Mézy estate on Sunday 14 August 1791; that a religious ceremony probably did take place, most likely about a week later (around 21 August); and that many later details are embellishments. Known here through summaries; the chapter was not read in this session.",
  },
  {
    key: "haiti_hoffmann_1990",
    title: "Histoire, mythe et idéologie: la cérémonie du Bois-Caïman",
    author: "Léon-François Hoffmann",
    publisher: "Études créoles 13, no. 1",
    reference: "Études créoles 13:1 (1990); reprinted in Hoffmann, Haïti: lettres et l'être (Toronto, 1992)",
    sourceType: "academic_paper",
    publishedYear: 1990,
    publishedDisplay: "1990",
    notes:
      "Cited for the sceptical position: that the ceremony as narrated is a construction of the colonist Dalmas and of later nationalist historiography, with no reliable factual basis. Bibliographic details NEED SOURCE VERIFICATION (journal issue as commonly cited); the argument is summarised from Geggus and from the Wikipedia article.",
  },
  {
    key: "haiti_fick_1990",
    title: "The Making of Haiti: The Saint Domingue Revolution from Below",
    author: "Carolyn E. Fick",
    publisher: "University of Tennessee Press, Knoxville",
    reference: "Chapters on marronage and Makandal and on the 1791 uprising and Bois Caïman; book-level citation",
    sourceType: "academic_book",
    publishedYear: 1990,
    publishedDisplay: "1990",
    notes:
      "Cited for the argument that religious leadership, including Makandal's networks and the Bwa Kayiman ceremony, was part of how mass insurrection was organised; Fick accepts a ceremony on the night of 14 August 1791. Cited at book level; not read in this session.",
  },
  {
    key: "haiti_dubois_2004",
    title: "Avengers of the New World: The Story of the Haitian Revolution",
    author: "Laurent Dubois",
    publisher: "Belknap Press of Harvard University Press, Cambridge, MA",
    reference: "Chapters on the August 1791 insurrection and on independence (1803–1804); book-level citation",
    sourceType: "academic_book",
    publishedYear: 2004,
    publishedDisplay: "2004",
    notes:
      "Cited as a standard narrative of the Revolution from 1791 to independence on 1 January 1804, including the August 1791 uprising, Boukman's death, the place of religious leaders among the insurgents, and the naming of Cécile Fatiman in later Haitian tradition. Cited at book level.",
  },
  {
    key: "haiti_thornton_1993",
    title: "\"I Am the Subject of the King of Congo\": African Political Ideology and the Haitian Revolution",
    author: "John K. Thornton",
    publisher: "Journal of World History 4, no. 2",
    reference: "Journal of World History 4:2 (1993), pp. 181–214",
    sourceType: "academic_paper",
    publishedYear: 1993,
    publishedDisplay: "1993",
    notes:
      "Cited for the West-Central African (Kongo) contribution to the Revolution's personnel, ideas and military practice, and therefore to the many-sourced character of Saint-Domingue's African population. Cited at article level.",
  },
  {
    key: "haiti_burnard_garrigus_2016",
    title: "The Plantation Machine: Atlantic Capitalism in French Saint-Domingue and British Jamaica",
    author: "Trevor Burnard and John Garrigus",
    publisher: "University of Pennsylvania Press, Philadelphia",
    reference: "Chapter on the Makandal affair and the poison scare of the 1750s; book-level citation",
    sourceType: "academic_book",
    publishedYear: 2016,
    publishedDisplay: "2016",
    notes:
      "Cited for the re-reading of the Makandal affair as a colonial panic: confessions extracted under torture, colonists' fear and the politics of the 1750s, rather than proof of an island-wide poisoning conspiracy. Cited at book level; not read in this session.",
  },
  {
    key: "haiti_garrigus_2021",
    title: "\"Like an Epidemic One Could Only Stop with the Most Violent Remedies\": African Poisons versus Livestock Disease in Saint Domingue, 1750–88",
    author: "John D. Garrigus",
    publisher: "The William and Mary Quarterly 78, no. 4",
    reference: "WMQ 78:4 (October 2021), pp. 617–652; DOI 10.5309/willmaryquar.78.4.0617",
    url: "https://muse.jhu.edu/article/835803",
    sourceType: "academic_paper",
    publishedYear: 2021,
    publishedDisplay: "October 2021",
    notes:
      "Cited for the argument (abstract seen in this session) that colonists in the North Province blamed African poisoners for deaths actually caused by disease, notably recurring anthrax epizootics in livestock identified by doctors and veterinarians in the 1770s — and kept believing in poisoners regardless.",
  },
  {
    key: "haiti_mcalister_2012",
    title: "From Slave Revolt to a Blood Pact with Satan: The Evangelical Rewriting of Haitian History",
    author: "Elizabeth McAlister",
    publisher: "Studies in Religion / Sciences Religieuses 41, no. 2",
    reference: "Studies in Religion 41:2 (2012), pp. 187–215",
    sourceType: "academic_paper",
    publishedYear: 2012,
    publishedDisplay: "2012",
    notes:
      "Cited for the genealogy of the 'pact with the devil' story: how the colonial account of Bwa Kayiman was re-read by twentieth-century evangelical 'spiritual warfare' writers as a national blood pact with Satan, before Pat Robertson repeated it in 2010. Cited at article level; NEEDS SOURCE VERIFICATION for page range.",
  },
  // ---- Law, state and church ------------------------------------------------
  {
    key: "haiti_ramsey_2011",
    title: "The Spirits and the Law: Vodou and Power in Haiti",
    author: "Kate Ramsey",
    publisher: "University of Chicago Press, Chicago",
    reference: "Introduction and chapters 1–5 (colonial edicts to the 1987 Constitution); book-level citation",
    sourceType: "academic_book",
    publishedYear: 2011,
    publishedDisplay: "2011",
    notes:
      "Cited as the standard history of the laws against Vodou from the colony to 1987: colonial edicts, Louverture's ordinance against dances and night assemblies, the 1835 Code pénal articles against 'sortilèges', their 1864 revision, the 1935 decree-law against 'pratiques superstitieuses', the US occupation's enforcement, the 1941–42 anti-superstition campaign, and the abrogation in 1987. Known here through reviews and summaries; not read in this session.",
  },
  {
    key: "haiti_desmangles_1992",
    title: "The Faces of the Gods: Vodou and Roman Catholicism in Haiti",
    author: "Leslie G. Desmangles",
    publisher: "University of North Carolina Press, Chapel Hill",
    reference: "Chapters on the colonial and post-independence church and on pilgrimage; book-level citation",
    sourceType: "academic_book",
    publishedYear: 1992,
    publishedDisplay: "1992",
    notes:
      "Cited for the relation between Vodou and Catholicism in Haiti (the 'symbiosis' of lwa and saints), the Code Noir's baptism requirement, the schism after 1804, the 1860 Concordat and the return of the clergy, the anti-superstition campaigns, and pilgrimages such as Sodo. Cited at book level.",
  },
  {
    key: "haiti_nicholls_1979",
    title: "From Dessalines to Duvalier: Race, Colour and National Independence in Haiti",
    author: "David Nicholls",
    publisher: "Cambridge University Press",
    reference: "Chapters on the Griots, noirisme and the Duvalier regime; book-level citation",
    sourceType: "academic_book",
    publishedYear: 1979,
    publishedDisplay: "1979",
    notes:
      "Cited for the noiriste ideology behind François Duvalier and the Griots group, and for Duvalier's political use of Vodou and of oungan as local intermediaries. Cited at book level.",
  },
  {
    key: "haiti_hurbon_1988",
    title: "Le Barbare imaginaire",
    author: "Laënnec Hurbon",
    publisher: "Éditions du Cerf, Paris (first published Port-au-Prince: Henri Deschamps, 1987)",
    reference: "Book-level citation (history of the image of Vodou; the 1986 events)",
    sourceType: "academic_book",
    publishedYear: 1988,
    publishedDisplay: "1987/1988",
    notes:
      "Cited for the long history of the image of Vodou as 'barbarism' in Haitian and foreign writing, and for the 1986 violence against oungan and manbo after the fall of Jean-Claude Duvalier. Cited at book level; not read in this session.",
  },
  {
    key: "haiti_hurbon_1995",
    title: "Voodoo: Search for the Spirit (Les Mystères du vaudou)",
    author: "Laënnec Hurbon",
    publisher: "Harry N. Abrams / Thames & Hudson (Discoveries); French original Gallimard, 1993",
    reference: "Book-level citation (Discoveries series synthesis)",
    sourceType: "book",
    publishedYear: 1995,
    publishedDisplay: "1993 (French); 1995 (English)",
    notes:
      "Cited as a short scholarly synthesis by a Haitian sociologist of religion: the lwa, the ounfò, the formation of Vodou in the colony, and the twentieth-century campaigns against it. Cited at book level.",
  },
  {
    key: "haiti_constitution_1987",
    title: "Constitution de la République d'Haïti (1987)",
    author: "Republic of Haiti",
    publisher: "Le Moniteur, Port-au-Prince",
    reference: "Article 30 (freedom of religion and worship); Article 297 (abrogation of laws restricting fundamental rights, including the decree-law of 5 September 1935 on superstitious practices)",
    sourceType: "government",
    publishedYear: 1987,
    publishedDisplay: "approved by referendum, 29 March 1987",
    notes:
      "Cited for the constitutional guarantee of freedom of religion and the abrogation of the 1935 decree-law against 'superstitious practices'. Article content as reported by Ramsey and by the ICLRS law-and-religion overview; the official text was not opened in this session.",
  },
  {
    key: "haiti_iclrs_overview",
    title: "Republic of Haiti: Law and Religion Overview",
    author: "International Center for Law and Religion Studies",
    publisher: "ICLRS, Brigham Young University",
    url: "https://www.iclrs.org/?p=8808",
    sourceType: "website",
    publishedYear: 2020,
    publishedDisplay: "accessed 2026",
    notes:
      "Cited (via search-result summary) for the legal sequence: the 1935 decree against superstitious practices abrogated by Article 297 of the 1987 Constitution, the 2003 decree, and the 2012 constitutional amendment repealing Article 297 that alarmed Vodou organisations.",
  },
  {
    key: "haiti_pluralism_2003",
    title: "Voodoo Officially Recognized as a Religion by Government",
    author: "The Pluralism Project, Harvard University (reproducing Associated Press reporting)",
    publisher: "The Pluralism Project",
    url: "https://pluralism.org/news/voodoo-officially-recognized-religion-government",
    sourceType: "newspaper",
    publishedYear: 2003,
    publishedDisplay: "April 2003",
    notes:
      "Cited for the April 2003 decree under President Jean-Bertrand Aristide inviting Vodou practitioners and associations to register with the Ministry of Religious Affairs and allowing sworn practitioners to perform legally valid ceremonies such as marriages and baptisms, and for Catholic objections. Seen in search-result summary.",
  },
  {
    key: "haiti_tampabay_2003",
    title: "Haiti's recognition of voodoo brings new freedom to faithful",
    author: "Tampa Bay Times (wire report)",
    publisher: "Tampa Bay Times",
    url: "https://www.tampabay.com/archive/2003/08/04/haiti-s-recognition-of-voodoo-brings-new-freedom-to-faithful/",
    sourceType: "newspaper",
    publishedYear: 2003,
    publishedDisplay: "4 August 2003",
    notes:
      "Cited as a second contemporary press report of the 2003 recognition and of its reception among practitioners. Seen in search results only.",
  },
  {
    key: "haiti_newadvent_cap_haitien",
    title: "Cap-Haïtien (Catholic Encyclopedia)",
    author: "The Catholic Encyclopedia (1908)",
    publisher: "Robert Appleton Company / New Advent",
    url: "https://www.newadvent.org/cathen/03308c.htm",
    sourceType: "encyclopedia",
    publishedYear: 1908,
    publishedDisplay: "1908",
    notes:
      "Cited from the Catholic side for the concordat between the Holy See and Haiti concluded on 28 March 1860 under President Geffrard, and for the reorganisation of the Haitian church that followed. A church-written source of its time. Seen in search-result summary.",
  },
  {
    key: "haiti_smithsonian_bizoton_2013",
    title: "The Trial That Gave Vodou a Bad Name",
    author: "Mike Dash",
    publisher: "Smithsonian Magazine",
    url: "https://www.smithsonianmag.com/history/the-trial-that-gave-vodou-a-bad-name-83801276/",
    sourceType: "newspaper",
    publishedYear: 2013,
    publishedDisplay: "May 2013",
    notes:
      "Cited for the Bizoton affair: the killing of a girl at Bizoton near Port-au-Prince in late 1863, the trial in February 1864 under President Geffrard, the execution of eight people on 13 February 1864, the absence of surviving trial transcripts, confessions likely obtained under duress, and the trial's afterlife in Spenser St John's book. Seen in search-result summary.",
  },
  // ---- Ethnography, scholarship and art -----------------------------------
  {
    key: "haiti_price_mars_1928",
    title: "Ainsi parla l'oncle: essais d'ethnographie",
    author: "Jean Price-Mars",
    publisher: "Imprimerie de Compiègne, Paris",
    reference: "Book-level citation (the lectures on popular beliefs and on Vodou as religion)",
    sourceType: "primary",
    publishedYear: 1928,
    publishedDisplay: "1928",
    notes:
      "Cited as the founding text of Haitian ethnology and of the indigéniste movement: Price-Mars argued, against the Haitian elite's shame, that Vodou was a religion and that peasant culture was the national culture. A primary source for the movement it launched.",
  },
  {
    key: "haiti_roumain_1942",
    title: "À propos de la campagne « anti-superstitieuse » / Las supersticiones",
    author: "Jacques Roumain",
    publisher: "Imprimerie de l'État, Port-au-Prince",
    reference: "Pamphlet-level citation (Roumain's reply to the anti-superstition campaign and to Father Foisset)",
    sourceType: "primary",
    publishedYear: 1942,
    publishedDisplay: "1942",
    notes:
      "Cited as the contemporary public defence of Vodou against the 1941–42 Catholic campaign by the founder of the Bureau d'Ethnologie, written in controversy with the priest Joseph Foisset. Known through secondary accounts (Ramsey; the Gradhiva and Musée des Confluences publications on the Roumain–Foisset polemic); not read in this session.",
  },
  {
    key: "haiti_hurston_1938",
    title: "Tell My Horse: Voodoo and Life in Haiti and Jamaica",
    author: "Zora Neale Hurston",
    publisher: "J. B. Lippincott, Philadelphia",
    reference: "Part 2 (Haiti), including the chapters on the lwa, the Gede and zombies; book-level citation",
    sourceType: "primary",
    publishedYear: 1938,
    publishedDisplay: "1938",
    notes:
      "Cited for Hurston's fieldwork in Haiti in 1936–37 on Guggenheim fellowships, her accounts of lwa, ceremonies and the Gede, and her much-discussed zombie chapter and photograph. An African American anthropologist and novelist writing during and just after the US occupation. Cited at book level.",
  },
  {
    key: "haiti_dunham_1969",
    title: "Island Possessed",
    author: "Katherine Dunham",
    publisher: "Doubleday, Garden City, NY",
    reference: "Book-level citation (memoir of the 1935–36 fieldwork and initiation)",
    sourceType: "primary",
    publishedYear: 1969,
    publishedDisplay: "1969 (describing fieldwork from 1935–36)",
    notes:
      "Cited for Dunham's own account of her 1935–36 dance-ethnography in Haiti, her initiation in Vodou and her lifelong relationship with Haiti; written thirty years after the fieldwork, so a memoir as much as an ethnography.",
  },
  {
    key: "haiti_deren_1953",
    title: "Divine Horsemen: The Living Gods of Haiti",
    author: "Maya Deren",
    publisher: "Thames & Hudson, London; Vanguard Press, New York",
    reference: "Chapters on the lwa (including Legba, Ezili, Ogou, Gede), on ritual and on possession; book-level citation",
    sourceType: "primary",
    publishedYear: 1953,
    publishedDisplay: "1953",
    notes:
      "Cited for a participant's account of Vodou theology, the lwa, ritual and possession, written by a filmmaker who went to Haiti in 1947 to film dance and stayed to study the religion; the posthumous film of the same name (1985) was edited from her footage. Cited at book level.",
  },
  {
    key: "haiti_metraux_1958",
    title: "Le Vaudou haïtien (English: Voodoo in Haiti, trans. Hugo Charteris, 1959)",
    author: "Alfred Métraux",
    publisher: "Gallimard, Paris (English edition: André Deutsch, London / Oxford University Press, New York, 1959)",
    reference: "Chapters on history, the lwa, the ounfò and its personnel, ritual and possession (English edition 1959); book-level citation",
    sourceType: "academic_book",
    publishedYear: 1958,
    publishedDisplay: "1958 (English 1959)",
    notes:
      "Cited as the classic ethnography of Haitian Vodou, from fieldwork in the Marbial valley and Port-au-Prince in the 1940s–50s: the lwa and their nanchon (Rada, Petwo, Gede and others), the ounfò and its personnel, possession, the vèvè, drums, the Bizoton affair, and the 1941–42 campaign. Cited at book level.",
  },
  {
    key: "haiti_herskovits_1937",
    title: "Life in a Haitian Valley",
    author: "Melville J. Herskovits",
    publisher: "Alfred A. Knopf, New York",
    reference: "Book-level citation (Mirebalais fieldwork, 1934)",
    sourceType: "academic_book",
    publishedYear: 1937,
    publishedDisplay: "1937",
    notes:
      "Cited for the first long anthropological study of a Haitian rural community (Mirebalais, 1934 fieldwork), and for Herskovits's 'African retentions' argument, which tied Haitian lwa directly to Dahomean vodun — a framework later scholars kept, qualified or rejected.",
  },
  {
    key: "haiti_brown_1991",
    title: "Mama Lola: A Vodou Priestess in Brooklyn",
    author: "Karen McCarthy Brown",
    publisher: "University of California Press, Berkeley",
    reference: "Book-level citation (chapters organised around individual lwa)",
    sourceType: "academic_book",
    publishedYear: 1991,
    publishedDisplay: "1991 (updated edition 2001)",
    notes:
      "Cited for the life and practice of the manbo Marie Thérèse Alourdes Macena Margaux ('Mama Lola') in Brooklyn, for the lwa as figures of social relationship (Ezili, Ogou, Gede and others), and for Vodou as a diaspora religion. Cited at book level.",
  },
  {
    key: "haiti_mcalister_2002",
    title: "Rara! Vodou, Power, and Performance in Haiti and Its Diaspora",
    author: "Elizabeth McAlister",
    publisher: "University of California Press, Berkeley",
    reference: "Book-level citation (Rara, Gede, politics after 1986, diaspora)",
    sourceType: "academic_book",
    publishedYear: 2002,
    publishedDisplay: "2002",
    notes:
      "Cited for Rara processions, the Gede, the politics of Vodou in Haiti and New York, Catholic–Vodou pilgrimage, and the post-1986 period. Cited at book level.",
  },
  {
    key: "haiti_cosentino_1995",
    title: "Sacred Arts of Haitian Vodou",
    author: "Donald J. Cosentino (ed.)",
    publisher: "UCLA Fowler Museum of Cultural History, Los Angeles",
    reference: "Exhibition catalogue, chapters on vèvè, drapo, altars, the Gede and pilgrimage; book-level citation",
    sourceType: "museum",
    publishedYear: 1995,
    publishedDisplay: "1995",
    notes:
      "Cited for the material and visual culture of Vodou — vèvè, drapo (sequined flags), altars, chromolithographs of saints, the Gede, Plaine-du-Nord — and for chapters by specialists including Blier on the West African background. Cited at book level.",
  },
  {
    key: "haiti_fleurant_1996",
    title: "Dancing Spirits: Rhythms and Rituals of Haitian Vodun, the Rada Rite",
    author: "Gerdès Fleurant",
    publisher: "Greenwood Press, Westport, CT",
    reference: "Book-level citation (Rada drums, songs and ritual order)",
    sourceType: "academic_book",
    publishedYear: 1996,
    publishedDisplay: "1996",
    notes:
      "Cited for the music of the Rada rite — the three-drum battery (manman, segon, boula), the ogan (iron bell), the asson, and the sequence of songs for each lwa — by a Haitian ethnomusicologist who was also an oungan. Cited at book level.",
  },
  {
    key: "haiti_apter_2002",
    title: "On African Origins: Creolization and Connaissance in Haitian Vodou",
    author: "Andrew Apter",
    publisher: "American Ethnologist 29, no. 2",
    reference: "American Ethnologist 29:2 (2002), pp. 233–260",
    sourceType: "academic_paper",
    publishedYear: 2002,
    publishedDisplay: "2002",
    notes:
      "Cited for the comparison of Haitian lwa with Dahomean vodun and Yoruba òrìṣà: Rada ('Arada') and Nago names that preserve African origins, and the argument that 'Africa' in Vodou is a ritual category of knowledge (konesans) as well as a historical source. Cited at article level.",
  },
  {
    key: "haiti_rodman_1948",
    title: "Renaissance in Haiti: Popular Painters in the Black Republic",
    author: "Selden Rodman",
    publisher: "Pellegrini & Cudahy, New York",
    reference: "Book-level citation (founding of the Centre d'Art; Hector Hyppolite)",
    sourceType: "book",
    publishedYear: 1948,
    publishedDisplay: "1948",
    notes:
      "Cited for the founding of the Centre d'Art in Port-au-Prince in 1944 by DeWitt Peters with Haitian artists, and for Hector Hyppolite, the oungan-painter whose Vodou subjects made the Centre's reputation; by a co-director of the Centre, so an insider's and promoter's account.",
  },
  {
    key: "haiti_germain_2011",
    title: "The Earthquake, the Missionaries, and the Future of Vodou",
    author: "Felix Germain",
    publisher: "Journal of Black Studies 42, no. 2",
    reference: "Journal of Black Studies 42:2 (2011), pp. 247–263",
    sourceType: "academic_paper",
    publishedYear: 2011,
    publishedDisplay: "2011",
    notes:
      "Cited for the post-earthquake blaming of Vodou by some Protestant groups, mob violence against practitioners in 2010, and the competition of relief-linked missions. Cited at article level.",
  },
  {
    key: "haiti_afp_cite_soleil_2010",
    title: "Haitian voodoo leader vows 'war' after attack on ceremony",
    author: "Agence France-Presse (as syndicated)",
    publisher: "AFP wire, reproduced by Capital FM and others",
    url: "https://capitalfm.africa/voodoo-leader-vows-attack/",
    sourceType: "newspaper",
    publishedYear: 2010,
    publishedDisplay: "c. 25 February 2010",
    notes:
      "Cited for the attack on a Vodou memorial ceremony for earthquake victims in Cité Soleil, Port-au-Prince, in late February 2010, in which a crowd reportedly urged on by a pastor threw stones at participants, and for Max Beauvoir's furious response. Seen in search-result summary; exact day NEEDS SOURCE VERIFICATION.",
  },
  {
    key: "haiti_abc_robertson_2010",
    title: "White House Adviser Valerie Jarrett 'Speechless' Over Pat Robertson's Haiti Comment",
    author: "ABC News",
    publisher: "ABC News",
    url: "https://abcnews.go.com/GMA/white-house-advisor-valerie-jarrett-speechless-pat-robertson/story?id=9555714",
    sourceType: "newspaper",
    publishedYear: 2010,
    publishedDisplay: "14 January 2010",
    notes:
      "Cited for Pat Robertson's remark on the 700 Club broadcast of 13 January 2010 that Haitians had 'swore a pact to the devil' to be freed from the French, and for immediate criticism from the White House. Seen in search-result summary.",
  },
  {
    key: "haiti_csmonitor_robertson_2010",
    title: "For comments on Haiti, Pat Robertson blasted by White House",
    author: "The Christian Science Monitor",
    publisher: "The Christian Science Monitor",
    url: "https://www.csmonitor.com/USA/Politics/The-Vote/2010/0114/For-comments-on-Haiti-Pat-Robertson-blasted-by-White-House",
    sourceType: "newspaper",
    publishedYear: 2010,
    publishedDisplay: "14 January 2010",
    notes:
      "Cited as a second contemporary report of the Robertson remark and its reception (the White House press secretary called it 'utterly stupid'), and of CBN's statement that he had not said the quake was God's wrath. Seen in search-result summary.",
  },
  {
    key: "haiti_wrsp_saut_deau",
    title: "Saut-d'Eau Timeline",
    author: "World Religions and Spirituality Project",
    publisher: "WRSP (Virginia Commonwealth University)",
    url: "https://wrldrels.org/?p=13370",
    sourceType: "website",
    publishedYear: 2020,
    publishedDisplay: "accessed 2026",
    notes:
      "Cited (via search-result summary) for the tradition of an apparition of the Virgin on a palm tree near Ville-Bonheur, dated there to 1841, the reshaping of the falls by the 1842 earthquake, and the annual July pilgrimage. Its dates are those of a tradition, not of a document.",
  },
  {
    key: "haiti_blier_1995",
    title: "African Vodun: Art, Psychology, and Power",
    author: "Suzanne Preston Blier",
    publisher: "University of Chicago Press, Chicago",
    reference: "Book-level citation (Fon and Ewe vodun, Legba, bocio)",
    sourceType: "academic_book",
    publishedYear: 1995,
    publishedDisplay: "1995",
    notes:
      "Cited for the West African side of the comparisons: Fon and Ewe vodun, Legba at the threshold and in the market, and the bocio, against which Haitian forms are compared. The same work benin-vodun cites; cited here at book level.",
  },
  {
    key: "haiti_rosenthal_1998",
    title: "Possession, Ecstasy, and Law in Ewe Voodoo",
    author: "Judy Rosenthal",
    publisher: "University Press of Virginia, Charlottesville",
    reference: "Book-level citation (Ewe vodu possession and music)",
    sourceType: "academic_book",
    publishedYear: 1998,
    publishedDisplay: "1998",
    notes:
      "Cited for possession in Ewe vodu orders of Togo and Bénin (including Gorovodu), drums and song as the ritual means of calling the vodu, for comparison with Haitian possession. Cited at book level.",
  },
  {
    key: "haiti_matory_2005",
    title: "Black Atlantic Religion: Tradition, Transnationalism, and Matriarchy in the Afro-Brazilian Candomblé",
    author: "J. Lorand Matory",
    publisher: "Princeton University Press, Princeton",
    reference: "Book-level citation (introduction and chapters on the transatlantic Yoruba renaissance)",
    sourceType: "academic_book",
    publishedYear: 2005,
    publishedDisplay: "2005",
    notes:
      "Cited for the argument that Atlantic religions such as Candomblé, Lucumí and Vodou were shaped by continuing two-way traffic and by the nineteenth-century prestige of 'Yoruba' (Nago) identity, not only by one-way 'survival' — the frame used here for the Orisha comparison. Cited at book level.",
  },
  {
    key: "haiti_thompson_1983",
    title: "Flash of the Spirit: African and Afro-American Art and Philosophy",
    author: "Robert Farris Thompson",
    publisher: "Random House, New York",
    reference: "Chapters 'The Flash of the Spirit' on Yoruba Èṣù and on Kongo art and the cosmogram; book-level citation",
    sourceType: "academic_book",
    publishedYear: 1983,
    publishedDisplay: "1983",
    notes:
      "Cited for the Kongo cosmogram (the cross of the four moments of the sun, the crossing between the living and the dead) and the Yoruba Èṣù at the crossroads, and for the argument that these shaped Haitian vèvè and crossroads symbolism. An influential but in places speculative synthesis; cited at book level.",
  },
  {
    key: "haiti_wikipedia_vodou",
    title: "Haitian Vodou; Bois Caïman; Cécile Fatiman; National Confederation of Haitian Vodou; Max Beauvoir",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Haitian_Vodou",
    sourceType: "wikipedia",
    publishedYear: 2026,
    publishedDisplay: "accessed October 2026",
    notes:
      "Read in this session (Haitian Vodou, Bois Caïman, Cécile Fatiman) or seen in search results (KNVA, Max Beauvoir). Used only beside the scholarly sources, for the nanchon and their characters, the pilgrimages, the post-1986 civil-rights groups (Zantray, Bode Nasyonal), KNVA's founding dates, and the evidence cited for Fatiman. Never the sole source of a claim.",
  },
];

// ---------------------------------------------------------------------------
// Pictures used more than once (each file still appears only once per gallery)
// ---------------------------------------------------------------------------

const PIC_MAP_1776 = commonsPicture({
  fileName: "Carte générale de la partie française de l'isle de St. Domingue. LOC 74692178.jpg",
  caption:
    "Manuscript map of the French part of Saint-Domingue, pen-and-ink and watercolour, 1776, held by the Library of Congress: the colony in which Haitian Vodou formed, a generation before the Revolution.",
  shows: "map",
  identificationStatus: "secure",
  licence: "PD-Art (PD-old-100-expired)",
  creator: "Unknown cartographer",
  institution: "Library of Congress, Geography and Map Division",
  objectDate: "1776",
});

const PIC_ALTAR_2010 = commonsPicture({
  fileName: "Haitian vodou altar to Petwo, Rada, and Gede spirits; November 5, 2010..jpg",
  caption:
    "A Haitian Vodou altar made for a Gede festival in Boston, Massachusetts, photographed 5 November 2010: offerings to Rada lwa at top right, to Petwo lwa at top left and to the Gede below, with Catholic images among them. A modern diaspora altar, not a colonial one.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY 3.0",
  creator: "Calvin Hennick, for WBUR Boston",
  objectDate: "2010-11-05",
});

const PIC_VEVE_LEGBA = commonsPicture({
  fileName: "VeveLegba.svg",
  caption:
    "A vèvè (ritual ground drawing) for Papa Legba, redrawn by hand and vectorised by a Commons contributor in 2005–2007 from published examples. Vèvè vary between houses and are traced afresh, in cornmeal or other powders, for each ceremony; this is a modern drawing of one common form.",
  shows: "diagram",
  identificationStatus: "probable",
  licence: "PD-Art (as stated on the file page)",
  creator: "Commons user Chrkl",
});

const PIC_VEVE_DANBALA = commonsPicture({
  fileName: "VeveDamballah.svg",
  caption:
    "A vèvè for Danbala, redrawn and vectorised by a Commons contributor in 2005–2007 from published examples: the paired serpents are the commonest motif of Danbala's and Ayida Wedo's drawings. A modern drawing of one form among many.",
  shows: "diagram",
  identificationStatus: "probable",
  licence: "PD-Art (as stated on the file page)",
  creator: "Commons user Chrkl",
});

const PIC_VEVE_OGOU = commonsPicture({
  fileName: "VeveOgoun.svg",
  caption:
    "A vèvè for Ogou, redrawn and vectorised by a Commons contributor in 2005–2007 from published examples; Ogou's drawings commonly include a sword or flag motif. A modern drawing of one common form.",
  shows: "diagram",
  identificationStatus: "probable",
  licence: "PD-Art (as stated on the file page)",
  creator: "Commons user Chrkl",
});

const PIC_VEVE_BARON = commonsPicture({
  fileName: "VeveBaronSamedi.svg",
  caption:
    "A vèvè for Bawon Samdi (Baron Samedi), head of the Gede, built around a cross and coffin motif; redrawn and vectorised by a Commons contributor in 2007 from published examples. A modern drawing of one form.",
  shows: "diagram",
  identificationStatus: "probable",
  licence: "PD-Art (as stated on the file page)",
  creator: "Commons user Chrkl",
});

const PIC_PETWO_BAZILE = commonsPicture({
  fileName: "Petwo Ceremony Commemorating Bwa Kayiman.jpg",
  caption:
    "Castera Bazile, 'Petwo Ceremony Commemorating Bwa Kayiman', oil on Masonite, 1950: a painting by a Centre d'Art artist showing a twentieth-century commemoration of the 1791 ceremony. It is a later artwork and depicts memory, not the event.",
  shows: "later_artwork",
  identificationStatus: "secure",
  licence: "PD-Haiti",
  creator: "Castera Bazile",
  objectDate: "1950",
});

const PIC_FRISNER = commonsPicture({
  fileName: "Frisner Augustin drums for a Vodou dance in Brooklyn, early 1980s.jpg",
  caption:
    "The master drummer Frisner Augustin playing for a Haitian Vodou dance in a Brooklyn basement, New York, about 1983: diaspora Vodou in the city where Karen McCarthy Brown was then working with Mama Lola.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY-SA 3.0; GFDL",
  creator: "Chantal Regnault",
  objectDate: "c. 1983",
});

const PIC_ASSON = commonsPicture({
  fileName: "Haitian Vodou Asson.jpg",
  caption:
    "An asson: a calabash rattle strung with beads (and sometimes snake vertebrae), the instrument of the oungan or manbo 'of the asson' who has passed the highest grade of initiation in the Rada lineage. Photographed by a practitioner, 2017.",
  shows: "artefact",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Commons user DKDHoungan",
  objectDate: "photographed 2017",
});

const PIC_BENIN_LEGBA_ALLADA = commonsPicture({
  fileName: "Divinite-vodun-legba-lac-sacre-awouto-allada-benin.jpg",
  caption:
    "A Legba figure beside the sacred lake Awouto at Togoudo, commune of Allada, Bénin, photographed in 2022 — a village remembered locally as the homeland of Toussaint Louverture's father. A present-day West African Legba, for comparison; not evidence of eighteenth-century form.",
  shows: "evidence_photograph",
  identificationStatus: "secure",
  licence: "CC BY-SA 4.0",
  creator: "Commons user Netho639",
  objectDate: "2022-01-10",
});

const PIC_BENIN_CEREMONY = commonsPicture({
  fileName: "Cérémonies vodoun au Bénin 01.jpg",
  caption:
    "A Vodun ceremony in Bénin, photographed in 2022 and uploaded for Wiki Loves Africa. A present-day West African ceremony shown for comparison with Haitian practice; the exact place and order of the ceremony are not stated on the file page.",
  shows: "evidence_photograph",
  identificationStatus: "probable",
  licence: "CC BY-SA 4.0",
  creator: "Commons user ArisTheKing",
  objectDate: "2022-06-30",
});

// ---------------------------------------------------------------------------
// Events, part 1 — the colony, the Revolution, independence
// ---------------------------------------------------------------------------

const events: SeedEvent[] = [
  {
    slug: ANCHOR.haiti,
    title: "How Haitian Vodou formed in colonial Saint-Domingue",
    summary:
      "Haitian Vodou took shape over the eighteenth century in the French sugar and coffee colony of Saint-Domingue, built by enslaved people from many African societies out of their own religious knowledge, under a compulsory Catholicism. It is a new religion made of old material, not a West African religion in exile.",
    description:
      "WHAT SAINT-DOMINGUE WAS. The western third of Hispaniola, French from 1697, became by the 1780s the richest plantation colony in the Atlantic world. Its wealth was made by enslaved Africans: roughly half a million people by 1789, most of them born in Africa, because deaths outran births and the trade replaced the dead. They came from many places — Gbe-speaking 'Arada' people from the Bight of Benin, 'Nago' (Yoruba), 'Congo' from West-Central Africa (by the late century the largest single group), and people from Senegambia, the Gold Coast and the Bight of Biafra.\n\n" +
      "WHAT FORMED. No single African religion could be reproduced. Lineages, temples, priesthoods and kings had been left behind; people of a dozen traditions lived on the same plantations. What emerged was a new religious system in which powers from several African sources were served together and organised into nanchon ('nations') — the Rada spirits, whose name derives from Allada; the Petwo spirits, strongly marked by Kongo ritual; the Nago, Ibo, Kongo and other groupings — alongside the dead (later the Gede) and above them a distant creator, Bondye. The vocabulary shows the mixture: lwa (spirits), ounfò (temple), oungan (priest) and the very word vodou come from Gbe languages; much ritual language and many Petwo practices from Kikongo.\n\n" +
      "CATHOLICISM. The Code Noir of 1685 required baptism and forbade the public exercise of any other religion. Catholic saints, prayers and calendars entered the religion and stayed — not only as camouflage but as part of how the lwa came to be imagined.\n\n" +
      "WHEN. There is no founding date. The religion is first described at length by Moreau de Saint-Méry, published in 1797, from observations before 1789; colonial records of 'macandals' and night assemblies go back to the 1750s. Scholars place the crystallisation of something recognisable as Vodou in the second half of the eighteenth century and continuing after independence, when the countryside, largely without Catholic clergy from 1804 to 1860, developed it further.\n\n" +
      "SIGNIFICANCE. This is the record the rest of the track hangs from. It establishes that Haitian Vodou is a Haitian religion with its own history — formed under slavery from many African traditions and Catholicism — and that its connections to Bénin are real, specific and partial, not a matter of transplantation. Every later chapter (revolution, prohibition, ethnography, recognition) is a chapter in the life of this new religion.",
    category: "religion",
    subcategory: "Formation",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(
      ["place: saint-domingue and haiti", "deity: lwa", "deity: bondye", "practice: catholic contact", "place: allada"],
      "formation",
      "creolisation",
      "slavery"
    ),
    people: ["Médéric Louis Élie Moreau de Saint-Méry"],
    civilisations: ["Saint-Domingue", "Arada (Gbe-speaking peoples)", "Kongo", "Nago (Yoruba)", "Haitian Vodou"],
    locationName: "Saint-Domingue (colonial Haiti)",
    lat: 19.0,
    lng: -72.5,
    media: [PIC_MAP_1776, PIC_ALTAR_2010],
    claims: [
      claim({
        sourceKey: "haiti_metraux_1958",
        datePrecision: "century",
        isApproximate: true,
        startYear: 1700,
        endYear: 1800,
        temporalClaimType: "estimated_range",
        datingMethod: "estimate",
        whatIsDated: "The period in which a recognisable Haitian Vodou crystallised in the colony",
        originalDateText: "Formed over the eighteenth century in Saint-Domingue, continuing after 1804",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Scholars infer the period from the growth and changing composition of the enslaved population, colonial rulings against assemblies and ritual objects from the 1750s, and Moreau's description of the 1780s. The range dates a process, not an event, and it does not say when any particular lwa or rite first appeared.",
        citations: [
          cite("haiti_desmangles_1992", "supports", "Places the formation of Vodou in the colonial period under Catholic contact."),
          cite("haiti_thornton_1993", "context", "Shows the large West-Central African share of the late-colonial population, which shaped the Petwo rites."),
          cite("haiti_wikipedia_vodou", "context", "Summarises scholarly dating to the mid-eighteenth century (citing Derby 2015)."),
        ],
      }),
      claim({
        sourceKey: "haiti_moreau_description_1797",
        startYear: 1797,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest substantial written description of the religion",
        originalDateText: "First described at length in Moreau de Saint-Méry's Description, published 1797",
        evidence:
          "EVIDENCE TYPE: contemporary written. The 1797 publication records observations made before 1789. It proves the religion existed in recognisable form by the 1780s; it does not date its beginning, and it is the view of a hostile colonial outsider.",
      }),
      claim({
        sourceKey: null,
        temporalClaimType: "unknown",
        whatIsDated: "A founding moment of Haitian Vodou",
        originalDateText: "Not datable as an event: the religion had no founding moment",
        datingMethod: "other",
        evidence:
          "EVIDENCE TYPE: modern interpretation. A religion formed from many traditions over generations has no founding date. Popular dates (1791, '1724', etc.) attach the origin to a famous event or invent one; none is supported as a date of formation.",
        citations: [cite("haiti_hurbon_1995", "supports", "Treats Vodou's emergence as a colonial-era process rather than a founding.")],
      }),
    ],
  },


  {
    slug: "makandal-executed-1758",
    title: "Makandal is burned at Cap-Français, January 1758",
    summary:
      "François Makandal, a maroon leader and ritual specialist accused of organising a poisoning campaign, was burned alive at Cap-Français on 20 January 1758. His name became a word for ritual packets and a figure of memory.",
    description:
      "WHO HE WAS. Makandal (also Mackandal, Macandal) was an enslaved man, described in colonial sources as African-born and one-handed after a mill accident, who escaped and lived as a maroon in the mountains of the North Province for years. Colonial records describe him as a maker of ritual packets and a diviner with a following among enslaved people on many plantations.\n\n" +
      "WHAT HAPPENED. Captured in early 1758, he was tried by the colonial authorities at Cap-Français and condemned to be burned alive, which was done on 20 January 1758. Stories about the execution — that he broke free from the stake, that he escaped by transforming himself — circulated at once and are part of his legend rather than of the record.\n\n" +
      "WHAT HIS NAME DID. 'Makandal' became a colonial word for a ritual packet or charm, and possessing 'macandals' was forbidden by later rulings. In Haiti he became a hero of resistance, remembered in the Revolution's prehistory, on a 1968 Haitian coin, and in literature (Alejo Carpentier's El reino de este mundo, 1949).\n\n" +
      "WHAT IS AND IS NOT ESTABLISHED. That he was a real person, a ritual specialist, a maroon, and executed in 1758 is well documented. Whether he led an island-wide poisoning conspiracy is a separate and disputed question (see the next record). Calling him an 'oungan' in the later Haitian sense projects a later religious vocabulary back onto him.\n\n" +
      "SIGNIFICANCE. Makandal is the first individual whose ritual practice appears clearly in the colonial record, and the first in whom colonial fear of African religion and of revolt fused into one image — a fusion that would shape how Vodou was seen for two centuries.",
    category: "religion",
    subcategory: "Colonial Saint-Domingue",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["place: saint-domingue and haiti", "practice: healing and herbal knowledge", "practice: initiation and priesthood"], "makandal", "maroons", "resistance"),
    people: ["François Makandal"],
    civilisations: ["Saint-Domingue", "Maroons of the North Province"],
    locationName: "Cap-Français (now Cap-Haïtien), Saint-Domingue",
    lat: 19.757,
    lng: -72.204,
    media: [
      commonsPicture({
        fileName: "Mackandal coin haiti.jpg",
        caption:
          "A Haitian 20-gourde coin of 1968 bearing an imagined portrait of François Makandal: a twentieth-century national image of the maroon leader. No portrait of Makandal from life exists.",
        shows: "later_artwork",
        identificationStatus: "modern_interpretation",
        licence: "Public domain (Haitian currency, per the Haitian copyright decree of 9 January 1968, as stated on the file page)",
        creator: "Banque Nationale de la République d'Haïti (uncredited designer)",
        objectDate: "1968",
      }),
      commonsPicture({
        fileName: "Vue du Cap-Français (Nicolas Ponce).png",
        caption:
          "View of Cap-Français, engraving by Nicolas Ponce for Moreau de Saint-Méry's Recueil de vues (1791): the colonial capital where Makandal was executed thirty years earlier.",
        shows: "engraving",
        identificationStatus: "secure",
        licence: "PD-old-70; PD-Art (PD-old-100-1923)",
        creator: "Nicolas Ponce",
        objectDate: "1791",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_fick_1990",
        startYear: 1758,
        startMonth: 1,
        startDay: 20,
        datePrecision: "day",
        temporalClaimType: "explicit_date",
        whatIsDated: "The execution of Makandal",
        originalDateText: "Burned at Cap-Français on 20 January 1758",
        evidence:
          "EVIDENCE TYPE: contemporary written. The date comes from colonial judicial records and contemporary reports, as reproduced by historians. It dates the execution only; the stories of his escape from the flames are legend.",
        citations: [
          cite("haiti_burnard_garrigus_2016", "supports", "Reconstructs the 1757–58 trial and execution from the colonial record."),
          cite("haiti_dubois_2004", "supports", "Narrates Makandal's capture and execution."),
        ],
      }),
    ],
  },

  {
    slug: "makandal-poison-panic-evidence",
    title: "Was there a Makandal poisoning conspiracy? The poison panic and its evidence",
    summary:
      "Colonists believed Makandal led a vast plot to poison the whites of Saint-Domingue. Recent historians argue that the 'epidemic of poison' was largely a panic built on tortured confessions, with many deaths actually caused by disease.",
    description:
      "THE COLONIAL ACCOUNT. In 1757–58 the authorities of the North Province became convinced that a network of enslaved poisoners, led by Makandal, had killed many people and animals and planned to kill all the whites. Arrests, interrogations under torture and executions followed, and the conviction outlived Makandal: for the rest of the colony's life, unexplained deaths of people and livestock were blamed on African poison.\n\n" +
      "THE OLDER HISTORIOGRAPHY. Many nineteenth- and twentieth-century writers, Haitian and foreign, accepted the plot as real — either as proof of African savagery or, in nationalist and later radical history, as the first great act of resistance on the road to 1791. Carolyn Fick treated Makandal's networks as an organised movement. Very large death tolls circulate without reliable basis.\n\n" +
      "THE RE-EXAMINATION. Trevor Burnard and John Garrigus (2016) re-read the trial evidence as the product of torture and of colonial politics in the 1750s. Garrigus (2021) shows that the North Province suffered recurring anthrax epizootics among livestock — identified by doctors and veterinarians in the 1770s — and that planters went on blaming poisoners anyway, to the point of exonerating a colonist who tortured two enslaved women to death on suspicion of poisoning in 1788.\n\n" +
      "WHAT IS ESTABLISHED. That colonists believed in a poison conspiracy, acted on that belief with extreme violence, and wrote it into law. That Makandal was a ritual specialist with a following. What is NOT established: that an island-wide poisoning plot existed, or the numbers killed by it.\n\n" +
      "SIGNIFICANCE. The poison panic is where the colonial equation of African religion with secret murder was first fixed in law and print. The same equation reappears in the Bizoton affair, in Spenser St John, and in the twentieth-century stereotype; seeing how thin the evidence was in 1758 is a key to reading what came after.",
    category: "religion",
    subcategory: "Colonial Saint-Domingue",
    eventType: "disputed",
    evidenceStatus: "disputed",
    tags: tags(["place: saint-domingue and haiti", "practice: healing and herbal knowledge"], "makandal", "poison", "historiography", "colonial-panic"),
    people: ["François Makandal", "Trevor Burnard", "John Garrigus", "Carolyn Fick"],
    civilisations: ["Saint-Domingue"],
    locationName: "North Province of Saint-Domingue",
    lat: 19.65,
    lng: -72.3,
    argumentsFor:
      "Colonial investigators recorded confessions naming many accomplices and poisons; deaths of people and animals were real; Makandal certainly had a wide following and ritual knowledge of plants; and the knowledge of poisons among enslaved people is attested elsewhere in the Caribbean. For historians such as Fick, an organised underground movement is consistent with the later scale of 1791.",
    argumentsAgainst:
      "The confessions were extracted under torture by men who already believed in the plot; no independent evidence links most deaths to poison; Garrigus shows that anthrax epizootics explain livestock and some human deaths and were recognised as disease by colonial doctors in the 1770s; the 'thousands killed' figures have no documentary basis; and the panic served planters' interests and fears.",
    genealogies: [
      {
        key: "makandal-plot",
        claim: "Makandal led a conspiracy to poison all the whites of Saint-Domingue",
        verdict: "source_disputed",
        verdictEvidence:
          "The claim rests on colonial trial records made under torture. Modern work argues that disease and panic explain much of what was attributed to poison. A ritual specialist with a following is attested; an island-wide plot is not.",
        whatWouldChangeThis:
          "Independent contemporary evidence — not derived from interrogations — of coordinated poisonings, or medical evidence from the 1750s contradicting the epizootic explanation.",
        links: [
          {
            stage: "colonial_record",
            who: "Conseil du Cap and colonial investigators",
            year: 1758,
            sourceKey: "haiti_moreau_loix",
            saysAbsentReason: "The interrogation records and rulings were not read in this session.",
            adds: "Records confessions, names, and the conviction that a plot existed; writes the fear into law.",
            citationStatus: "unverified",
          },
          {
            stage: "early_scholarship",
            who: "Carolyn Fick",
            year: 1990,
            sourceKey: "haiti_fick_1990",
            saysAbsentReason: "Book not read in this session; position as commonly summarised.",
            adds: "Reads Makandal's networks as organised resistance prefiguring 1791.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Trevor Burnard and John Garrigus",
            year: 2016,
            sourceKey: "haiti_burnard_garrigus_2016",
            saysAbsentReason: "Book not read in this session; position as commonly summarised.",
            adds: "Reads the trial as a colonial panic built on torture.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "John D. Garrigus",
            year: 2021,
            sourceKey: "haiti_garrigus_2021",
            says: "Colonists in the North Province blamed African poisoners for deaths actually caused by disease, including recurring anthrax epizootics (paraphrase of the abstract).",
            adds: "A specific alternative cause, and evidence that colonial doctors recognised it.",
            citationStatus: "verified",
          },
        ],
      },
    ],
    media: [
      commonsPicture({
        fileName: "Portail de l'église paroissiale du Cap François (Nicolas Ponce).jpg",
        caption:
          "The portal of the parish church of Cap-Français, engraving by Nicolas Ponce for Moreau de Saint-Méry's Recueil de vues (1791). Contextual: the colonial town whose courts tried the poisoning cases; the church stood on the square where executions took place.",
        shows: "engraving",
        identificationStatus: "secure",
        licence: "PD-Art (PD-old-100-1923)",
        creator: "Nicolas Ponce",
        objectDate: "1791",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_moreau_loix",
        startYear: 1757,
        endYear: 1758,
        temporalClaimType: "date_range",
        chronology: "disputed",
        whatIsDated: "The colonial investigation of an alleged poisoning conspiracy",
        originalDateText: "The poison investigations of 1757–1758 in the North Province",
        evidence:
          "EVIDENCE TYPE: contemporary written. Colonial judicial records date the investigations and executions. They are evidence of what colonists believed and did; as evidence of a real conspiracy they are disputed because confessions were obtained under torture.",
        citations: [cite("haiti_fick_1990", "supports", "Treats the networks as real organised resistance.")],
      }),
      claim({
        sourceKey: "haiti_garrigus_2021",
        startYear: 1750,
        endYear: 1788,
        temporalClaimType: "date_range",
        chronology: "historical",
        whatIsDated: "The period of recurring livestock epizootics and continued poison accusations",
        originalDateText: "Anthrax epizootics and poison accusations in Saint Domingue, 1750–88",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Garrigus reconstructs the epizootics from colonial medical and administrative records. This dates the disease explanation and the persistence of the panic; it does not prove that no poisoning ever occurred.",
        citations: [cite("haiti_burnard_garrigus_2016", "supports", "Earlier re-reading of the Makandal trial as panic.")],
      }),
    ],
  },

  {
    slug: "moreau-de-saint-mery-describes-vaudoux-1797",
    title: "Moreau de Saint-Méry describes the 'Vaudoux', published 1797",
    summary:
      "In his Description of the French part of Saint-Domingue, the colonial lawyer Moreau de Saint-Méry gave the earliest substantial written account of a 'Vaudoux' assembly: a sacred serpent, a king and queen, an oath, song, dance and trance.",
    description:
      "THE AUTHOR. Médéric Louis Élie Moreau de Saint-Méry (1750–1819), born in Martinique, was a lawyer and member of the Conseil supérieur of Saint-Domingue who compiled its laws. He left the colony before the Revolution and published his Description in Philadelphia in 1797–98, from notes made in the 1780s.\n\n" +
      "WHAT HE DESCRIBED. Moreau says that 'Vaudoux' means an all-powerful, supernatural being, and that its devotees, whom he associates with the 'Arada' nation, venerate a serpent kept in a box. Assemblies are held at night, presided over by a 'king' and 'queen' who speak for the serpent; participants take an oath of secrecy, ask for favours, dance, and some fall into states of trance or convulsion. He also describes a separate, more violent dance he calls 'Dom Pèdre', which later writers connect with the Petwo rites. He presents the cult as dangerous and says the authorities feared it.\n\n" +
      "HOW TO READ IT. The account is precious and partial. Moreau was a hostile outsider describing something he probably had not fully witnessed; he uses an Arada (Gbe) frame and a serpent cult that recalls Ouidah — itself an important clue to Gbe influence — but he could not see the whole religious world of the plantations. The serpent, the king and queen, and the trance are recognisable; the theology is his guess.\n\n" +
      "SIGNIFICANCE. This is the first substantial description of the religion that became Haitian Vodou and the earliest printed use of the word in connection with Saint-Domingue that later writers relied on. It shows Gbe elements (the word vaudoux, the serpent associated with Danbala and with the Ouidah python, the Arada label) and a distinct second rite already present before the Revolution. Earliest documentation, though, is not origin.",
    category: "religion",
    subcategory: "Colonial Saint-Domingue",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(
      ["place: saint-domingue and haiti", "practice: serpent veneration", "deity: dan and aido-hwedo", "practice: possession", "place: ouidah"],
      "moreau-de-saint-mery",
      "earliest-description",
      "colonial-ethnography"
    ),
    people: ["Médéric Louis Élie Moreau de Saint-Méry"],
    civilisations: ["Saint-Domingue", "Arada (Gbe-speaking peoples)"],
    locationName: "Saint-Domingue (observed); Philadelphia (published)",
    media: [
      commonsPicture({
        fileName: "Mederic-Louis-Elie Moreau de Saint-Mery MET DT203407.jpg",
        caption:
          "Portrait drawing of Médéric Louis Élie Moreau de Saint-Méry by James Sharples, 1798, made in the United States the year after the first volume of his Description was printed in Philadelphia. Metropolitan Museum of Art.",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "CC0 (Metropolitan Museum of Art Open Access)",
        creator: "James Sharples",
        institution: "Metropolitan Museum of Art",
        accessionNumber: "24.109.89",
        objectDate: "1798",
      }),
      commonsPicture({
        fileName: "Une édition du Code Noir à Saint-Domingue, in Saint-Méry, 1775.png",
        caption:
          "A page of the 1875 second edition of Moreau de Saint-Méry's Description (page 420), reproduced by a Commons contributor in 2016, showing his note on an edition of the Code Noir: an example of the work itself, though not the 'Vaudoux' passage.",
        shows: "historical_document",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Commons user Ambre Troizat (reproduction); text by Moreau de Saint-Méry",
        objectDate: "text written before 1797; this edition 1875",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_moreau_description_1797",
        startYear: 1797,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Publication of the earliest substantial description of a 'Vaudoux' assembly",
        originalDateText: "Printed in Philadelphia in 1797 (vol. 1)",
        evidence:
          "EVIDENCE TYPE: contemporary written. The imprint dates the publication; the observations it rests on were made before Moreau left the colony in the late 1780s. It is the earliest substantial account, not evidence of when the practices began.",
        citations: [
          cite("haiti_metraux_1958", "supports", "Uses Moreau's account as the starting point of the documentary history of Vodou."),
          cite("haiti_desmangles_1992", "supports", "Discusses Moreau's description of the rite and its serpent."),
        ],
      }),
      claim({
        sourceKey: "haiti_moreau_description_1797",
        startYear: 1780,
        endYear: 1789,
        isApproximate: true,
        datePrecision: "decade",
        temporalClaimType: "estimated_range",
        whatIsDated: "When the observations behind the description were made",
        originalDateText: "Observed in the colony in the 1780s, before the Revolution",
        evidence:
          "EVIDENCE TYPE: later historical account. Inferred from Moreau's residence in Saint-Domingue and departure before 1789; the text itself does not date each observation. NEEDS SOURCE VERIFICATION of the exact years.",
      }),
    ],
  },

  {
    slug: "bwa-kayiman-ceremony-august-1791",
    title: "Bwa Kayiman (Bois Caïman), August 1791: the ceremony before the uprising",
    summary:
      "Haitian tradition holds that a Vodou ceremony in a wood called Bwa Kayiman, led by Dutty Boukman, launched the great slave uprising of August 1791. The date and details are disputed: a documented meeting on 14 August and a probable ceremony about a week later are often merged.",
    description:
      "THE STORY AS IT IS TOLD. On a stormy night in August 1791, enslaved men and women from the plantations of the northern plain gathered in a wood called Bwa Kayiman (Bois Caïman). A priest, Dutty Boukman, and a priestess — later named as Cécile Fatiman — led a ceremony; a black pig was sacrificed, its blood shared, and an oath sworn to rise against the masters. Boukman is said to have prayed that the god of the whites, who demanded crime, be cast away, and that the god of the enslaved, who is good, give them vengeance. Within days the North Province was in flames.\n\n" +
      "WHAT THE RECORD SHOWS. Colonial interrogations document that on Sunday 14 August 1791 enslaved drivers, coachmen and other plantation 'elite' from around a hundred estates met at the Lenormand de Mézy plantation at Morne-Rouge and planned a rising. The uprising began on the night of 22–23 August 1791 and was the beginning of the Haitian Revolution. The ceremony itself is known first from the colonist Antoine Dalmas, writing in 1793–94 (published 1814), and then from Métral (1818) and Dumesle (1824).\n\n" +
      "THE TWO DATES. Haitian tradition, the national commemoration and many historians (including Carolyn Fick) place the ceremony on the night of 14 August. David Geggus argued that the documented 14 August meeting was a political assembly, and that the religious ceremony Dalmas describes probably took place about a week later, around 21 August, nearer the outbreak — and that tradition merged the two. Both dates are given below as separate claims.\n\n" +
      "BOUKMAN. Boukman was a driver and coachman — said in later accounts to have come from Jamaica, which may explain the name 'Book man' — and one of the uprising's first leaders. He was killed in fighting in November 1791; the colonial authorities displayed his head at Le Cap.\n\n" +
      "SIGNIFICANCE. Bwa Kayiman is the founding religious event of Haitian national memory: the moment when African religion, in this telling, became the oath of a revolution. Its real importance is that both things are true at once — a religious gathering very probably happened, and the version Haitians know was shaped by later writers. The next record sets out that evidence problem.",
    category: "religion",
    subcategory: "Revolution",
    eventType: "historical",
    evidenceStatus: "disputed",
    tags: tags(["place: saint-domingue and haiti", "deity: lwa", "practice: drumming and song", "practice: initiation and priesthood"], "bwa-kayiman", "revolution", "boukman", "1791"),
    people: ["Dutty Boukman", "Cécile Fatiman", "Jean-François Papillon", "Georges Biassou", "Jeannot Bullet"],
    civilisations: ["Saint-Domingue", "Insurgents of the North Province"],
    locationName: "Bwa Kayiman (Bois Caïman), near Morne-Rouge, Plaine-du-Nord, northern Haiti",
    lat: 19.723,
    lng: -72.273,
    media: [
      PIC_PETWO_BAZILE,
      commonsPicture({
        fileName: "Vue des 40 jours d'incendie des Habitations de la plaine du Cap Français - Gravure de J.-B. Chapuy d’après J.-L. Boquet, 1795 - Archives départementales de la Gironde, cote 61 J 66.94.jpg",
        caption:
          "'View of the forty days of burning of the plantations of the plain of Cap-Français', engraving by J.-B. Chapuy after J.-L. Boquet, 1795 (Archives départementales de la Gironde): a French image, made four years later, of the uprising that followed the August 1791 gatherings.",
        shows: "engraving",
        identificationStatus: "secure",
        licence: "PD-old-70",
        creator: "J.-B. Chapuy, after J.-L. Boquet",
        institution: "Archives départementales de la Gironde",
        accessionNumber: "61 J 66.94",
        objectDate: "1795",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_fick_1990",
        startYear: 1791,
        startMonth: 8,
        startDay: 14,
        datePrecision: "day",
        temporalClaimType: "traditional_date",
        chronology: "traditional",
        whatIsDated: "The Bwa Kayiman ceremony (traditional and commemorative date)",
        originalDateText: "The night of 14 August 1791, as Haitian tradition and the annual commemoration hold",
        evidence:
          "EVIDENCE TYPE: later historical account. The 14 August date for the CEREMONY rests on later Haitian historiography and tradition, supported by the documented meeting of that day; no contemporary document dates a religious ceremony to that night. Fick accepts it.",
        citations: [
          cite("haiti_wikipedia_vodou", "supports", "Gives the night of 14 August 1791 as the ceremony's date."),
          cite("haiti_geggus_2002", "disputes", "Argues that 14 August was the date of a political meeting, not of the ceremony."),
        ],
      }),
      claim({
        sourceKey: "haiti_geggus_2002",
        startYear: 1791,
        startMonth: 8,
        startDay: 14,
        datePrecision: "day",
        temporalClaimType: "explicit_date",
        whatIsDated: "The documented meeting of enslaved drivers and coachmen at the Lenormand de Mézy estate",
        originalDateText: "Sunday 14 August 1791: the assembly at the Lenormand de Mézy plantation, Morne-Rouge",
        evidence:
          "EVIDENCE TYPE: contemporary written. Colonial interrogations of captured insurgents in 1791 describe this meeting and its date, as reconstructed by Geggus. It dates a planning meeting; the records do not describe it as a religious ceremony. Details known here from summaries — NEEDS SOURCE VERIFICATION.",
      }),
      claim({
        sourceKey: "haiti_geggus_2002",
        startYear: 1791,
        startMonth: 8,
        startDay: 21,
        datePrecision: "day",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        chronology: "historical",
        whatIsDated: "The Bwa Kayiman ceremony (Geggus's revised date)",
        originalDateText: "About a week after the 14 August meeting, probably around 21 August 1791",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Geggus infers the date from the sequence in Dalmas and the colonial records; it is approximate and contested. It supports the reality of a ceremony while separating it from the 14 August assembly. Known here from summaries of his chapter — NEEDS SOURCE VERIFICATION.",
        citations: [cite("haiti_fick_1990", "disputes", "Keeps the traditional 14 August date for the ceremony.")],
      }),
      claim({
        sourceKey: "haiti_dubois_2004",
        startYear: 1791,
        startMonth: 8,
        startDay: 22,
        datePrecision: "day",
        temporalClaimType: "explicit_date",
        whatIsDated: "The outbreak of the general uprising in the North Province",
        originalDateText: "The night of 22–23 August 1791",
        evidence:
          "EVIDENCE TYPE: contemporary written. Colonial correspondence and reports of the first plantation burnings date the outbreak. This is the best-documented date in the sequence and anchors the others.",
        citations: [cite("haiti_geggus_2002", "supports", "Uses the outbreak date to order the preceding gatherings.")],
      }),
      claim({
        sourceKey: "haiti_dubois_2004",
        startYear: 1791,
        startMonth: 11,
        datePrecision: "month",
        temporalClaimType: "approximate_date",
        whatIsDated: "The death of Dutty Boukman",
        originalDateText: "Boukman killed in November 1791 and his head displayed at Le Cap",
        evidence:
          "EVIDENCE TYPE: contemporary written. Colonial reports record Boukman's death in fighting and the display of his head. The month is standard in the historiography; the exact day NEEDS SOURCE VERIFICATION.",
      }),
    ],
  },

  {
    slug: "bwa-kayiman-evidence-problem",
    title: "Did Bwa Kayiman happen as it is told? Dalmas, Métral, Dumesle, and the priestess named later",
    summary:
      "Every detail of the Bwa Kayiman story enters the record in stages: the pig and the oath with a colonist in 1814, a priestess's words in 1818, Boukman's prayer in 1824, and the name Cécile Fatiman only much later. Historians disagree about how much is event and how much is later construction.",
    description:
      "THE STAGES. 1) ANTOINE DALMAS, a colonist and surgeon who fled the uprising, wrote in 1793–94 (published 1814) of a nocturnal gathering in a wood near the Lenormand estate, the sacrifice of a black pig, and an oath sworn over its blood. He was hostile and wrote at second hand; he names no priestess. 2) ANTOINE MÉTRAL (1818), a sympathetic French writer, added the oration of a priestess. 3) HÉRARD DUMESLE (1824), a Haitian who travelled the north and collected testimony, gave the earliest version of the prayer attributed to Boukman (in verse) and placed the event in Haitian national history. 4) Later Haitian historians — Céligny Ardouin, Thomas Madiou, Beaubrun Ardouin and, in the twentieth century, Étienne Charlier — elaborated the story. 5) THE PRIESTESS'S NAME, Cécile Fatiman, is absent from all three early accounts; it enters later Haitian writing, associated with family tradition among descendants (her daughter's line through General Jean-Louis Pierrot) and with Charlier's use of oral testimony. When she is first named in print NEEDS SOURCE VERIFICATION.\n\n" +
      "THE POSITIONS. Léon-François Hoffmann (1990) argued that the ceremony as told is a myth, rooted in a hostile colonist's story and adopted by nationalists. David Geggus (1991/2002) answered that the colonial records make a ceremony very probable, though he redated it and treated many details as embellishment; he also found no firm trace of a place called Bois Caïman, the nearest match being a swampy 'caïman' (alligator) site near the Lenormand estate. Fick and most Haitian historians treat the ceremony as historical. Practitioners treat it as a sacred event, commemorated each year and in Petwo ritual.\n\n" +
      "WHAT A READER CAN HOLD AS ESTABLISHED. A planning meeting on 14 August; an uprising on 22–23 August; a religious gathering very probably in between; Boukman's leadership; a pig sacrifice and oath in the earliest account. Not established: the exact date of the ceremony, the words of any prayer, the identity of the priestess.\n\n" +
      "SIGNIFICANCE. The Bwa Kayiman problem is a model case of how a religious founding story is built — from a hostile eyewitness-at-one-remove, a sympathiser, a nationalist collector of testimony and family memory — and why that does not make it false. It also matters politically: the same story is the basis of national pride in Haiti and of the evangelical 'pact with the devil' claim.",
    category: "religion",
    subcategory: "Revolution",
    eventType: "disputed",
    evidenceStatus: "disputed",
    tags: tags(["place: saint-domingue and haiti", "practice: initiation and priesthood"], "bwa-kayiman", "historiography", "cecile-fatiman", "boukman"),
    people: ["Antoine Dalmas", "Antoine Métral", "Hérard Dumesle", "Cécile Fatiman", "Dutty Boukman", "Léon-François Hoffmann", "David Geggus", "Étienne Charlier"],
    civilisations: ["Saint-Domingue", "Haiti"],
    locationName: "Bwa Kayiman, northern Haiti, and the writers who described it",
    argumentsFor:
      "The ceremony happened substantially as told: Dalmas, though hostile, was in the colony and wrote within three years; colonial interrogations confirm organised gatherings in the days before the rising; Dumesle collected testimony from people of the region within a generation; and the oath-and-sacrifice form fits documented African and Haitian ritual practice of binding oaths.",
    argumentsAgainst:
      "The ceremony as told is largely a construction: no contemporary document describes it; Dalmas wrote at second hand to show the rebels as savage; Métral's priestess and Dumesle's prayer appear decades later with no named witnesses; the place-name is not securely located; and Fatiman's name appears only in much later writing. Hoffmann argued it had no factual basis; Geggus accepts a ceremony but not most of the details.",
    genealogies: [
      {
        key: "bwa-kayiman-narrative",
        claim: "On 14 August 1791 Boukman and the priestess Cécile Fatiman led a Vodou ceremony at Bois Caïman that launched the Haitian Revolution",
        verdict: "partially_attested",
        verdictEvidence:
          "A gathering with a sacrifice and oath is attested in the earliest (hostile) account and made probable by colonial records; the 14 August date, the prayer and the priestess's name are later additions or conflations.",
        whatWouldChangeThis:
          "A contemporary 1791 document describing the ceremony; colonial interrogation records naming a priestess; or evidence that Dalmas's account derived from no informant at all.",
        links: [
          {
            stage: "colonial_record",
            who: "Antoine Dalmas",
            year: 1814,
            sourceKey: "haiti_dalmas_1814",
            reference: "Written 1793–94",
            saysAbsentReason: "Not read in this session; content as summarised by Geggus and Wikipedia.",
            adds: "The nocturnal gathering, the black pig, the blood oath.",
            citationStatus: "unverified",
          },
          {
            stage: "early_scholarship",
            who: "Antoine Métral",
            year: 1818,
            sourceKey: "haiti_metral_1818",
            saysAbsentReason: "Not read in this session.",
            adds: "The oration of a priestess.",
            citationStatus: "unverified",
          },
          {
            stage: "oral_testimony",
            who: "Hérard Dumesle",
            year: 1824,
            sourceKey: "haiti_dumesle_1824",
            saysAbsentReason: "Not read in this session.",
            adds: "Boukman's prayer (in verse), from testimony gathered in the north; the event as Haitian national history.",
            citationStatus: "unverified",
          },
          {
            stage: "community_history",
            who: "Later Haitian historians and descendants' family tradition (incl. Étienne Charlier, 1954)",
            sourceKey: "haiti_wikipedia_vodou",
            saysAbsentReason: "Charlier's work not located in this session; reported via the Wikipedia article on Fatiman.",
            adds: "The priestess's name, Cécile Fatiman, and her family line.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "Léon-François Hoffmann",
            year: 1990,
            sourceKey: "haiti_hoffmann_1990",
            saysAbsentReason: "Not read in this session.",
            adds: "The sceptical reading: a myth with no factual basis.",
            citationStatus: "unverified",
          },
          {
            stage: "current_scholarship",
            who: "David Geggus",
            year: 2002,
            sourceKey: "haiti_geggus_2002",
            saysAbsentReason: "Not read in this session; position known from summaries.",
            adds: "A probable ceremony around 21 August, separated from the 14 August meeting; many details embellished.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    media: [
      commonsPicture({
        fileName: "Incendie de la Plaine du Cap. Massacre des Blancs par les esclaves noirs révoltés. France militaire. Martinet et Masson.jpg",
        caption:
          "'Incendie de la Plaine du Cap. Massacre des Blancs par les Noirs', drawn by Aaron Martinet, engraved by Masson, for the French illustrated history France militaire (1833): a French image of the August 1791 uprising, made over forty years later, of the kind that framed the rising as savagery.",
        shows: "engraving",
        identificationStatus: "secure",
        licence: "PD-old-70",
        creator: "Aaron Martinet (draughtsman); Masson (engraver)",
        objectDate: "1833",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_dalmas_1814",
        startYear: 1814,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Publication of the earliest account of the ceremony",
        originalDateText: "Dalmas's Histoire, written 1793–94, published 1814",
        evidence:
          "EVIDENCE TYPE: later historical account. A colonist's account written two to three years after the event and printed twenty-three years after it. It dates the earliest surviving narrative, not the event, and it is hostile.",
        citations: [cite("haiti_geggus_2002", "context", "Treats Dalmas as the primary but problematic source.")],
      }),
      claim({
        sourceKey: "haiti_metral_1818",
        startYear: 1818,
        temporalClaimType: "explicit_date",
        whatIsDated: "First account including a priestess's oration",
        originalDateText: "Métral's Histoire de l'insurrection, 1818",
        evidence:
          "EVIDENCE TYPE: later historical account. Dates when the priestess first appears in print. Métral names no source for the oration.",
      }),
      claim({
        sourceKey: "haiti_dumesle_1824",
        startYear: 1824,
        temporalClaimType: "explicit_date",
        whatIsDated: "First version of Boukman's prayer",
        originalDateText: "Dumesle's Voyage dans le nord d'Hayti, 1824",
        evidence:
          "EVIDENCE TYPE: oral tradition. Dumesle wrote down, in verse, what he presented as the prayer, from testimony in the north a generation after the event. It dates the written version of an oral memory.",
      }),
      claim({
        sourceKey: "haiti_wikipedia_vodou",
        startYear: 1950,
        isApproximate: true,
        datePrecision: "century",
        temporalClaimType: "approximate_date",
        whatIsDated: "When the priestess's name, Cécile Fatiman, becomes current in the written record",
        originalDateText: "The name Cécile Fatiman recorded much later, in Haitian historiography of the twentieth century (Charlier 1954 is often cited)",
        evidence:
          "EVIDENCE TYPE: later historical account. Fatiman is not named in Dalmas, Métral or Dumesle. The name is associated with descendants' family tradition and with Étienne Charlier's 1954 history; when it was first printed NEEDS SOURCE VERIFICATION, and some summaries give earlier dates.",
        citations: [cite("haiti_dubois_2004", "context", "Names Fatiman as the priestess in a modern narrative history.")],
      }),
      claim({
        sourceKey: "haiti_hoffmann_1990",
        startYear: 1990,
        temporalClaimType: "explicit_date",
        whatIsDated: "The sceptical case that the ceremony is a myth",
        originalDateText: "Hoffmann's 'Histoire, mythe et idéologie', 1990",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Dates the sceptical argument, which Geggus answered in 1991. Bibliographic details NEED SOURCE VERIFICATION.",
        citations: [cite("haiti_geggus_2002", "disputes", "Argues that a ceremony probably did take place.")],
      }),
    ],
  },

  {
    slug: "vodou-and-the-haitian-revolution",
    title: "Vodou and the Haitian Revolution, 1791–1804",
    summary:
      "Religious leaders, amulets, oaths and drums were part of the insurgent world from 1791, and African-born fighters brought their own ritual and military traditions. But the Revolution's leaders were often Catholic and sometimes hostile to Vodou, and the religion was not one organised church directing the war.",
    description:
      "WHAT IS DOCUMENTED. Colonial and insurgent sources from the 1790s describe religious specialists among the rebels: Romaine-la-Prophétesse, a free man of colour in the south-west who claimed to be the godson of the Virgin Mary and led an insurgent band in 1791–92; leaders said to carry amulets and to promise invulnerability; the use of drums, conch shells and songs in battle; oaths; and African-born fighters (many from Kongo) whose military and ritual experience shaped the war, as John Thornton has shown.\n\n" +
      "WHAT THE LEADERS DID. The best-known leaders were not Vodou priests. Toussaint Louverture was a devout Catholic who repressed Vodou assemblies in the areas he governed; Jean-François and Biassou used Catholic and royalist symbolism; Dessalines and Christophe also acted against independent religious leaders. The revolution's religious world was plural: Catholic, African in many forms, and in creative mixtures of both.\n\n" +
      "HOW VODOU CHANGED. The war destroyed the plantation order, killed or dispersed much of the population and mixed people further; after 1804 the countryside was largely without Catholic clergy until 1860. Scholars see the revolutionary and early national period as one in which Vodou consolidated — in the lakou (family compounds), the nanchon and the land-based lwa — rather than one in which it 'caused' the Revolution.\n\n" +
      "TWO OPPOSITE MISREADINGS. One makes the Revolution a Vodou revolution, directed by priests from Bwa Kayiman to Vertières; the other, in its hostile form, makes it a satanic pact (see the Robertson record). Both turn a long, many-sided war into a single religious act.\n\n" +
      "SIGNIFICANCE. The relationship matters because it is at the centre of Haitian identity: Vodou as the religion of the people who freed themselves. It is best understood as a real but diffuse presence — in oaths, leaders, songs and courage — within a revolution that was also Catholic, political, African and French-revolutionary.",
    category: "religion",
    subcategory: "Revolution",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["place: saint-domingue and haiti", "practice: drumming and song", "practice: catholic contact"], "revolution", "kongo", "resistance"),
    people: ["Romaine-la-Prophétesse", "Toussaint Louverture", "Jean-Jacques Dessalines", "Henri Christophe", "Jean-François Papillon", "Georges Biassou"],
    civilisations: ["Saint-Domingue", "Haiti", "Kongo"],
    locationName: "Saint-Domingue / Haiti",
    lat: 19.0,
    lng: -72.5,
    media: [
      commonsPicture({
        fileName: "Portrait équestre de Toussaint Louverture sur son cheval Bel-Argent, vers 1800.jpg",
        caption:
          "Denis Alexandre Volozan, equestrian portrait of Toussaint Louverture on his horse Bel-Argent, painted about 1800 in Saint-Domingue (Musée d'Aquitaine, Bordeaux). Louverture, a Catholic, repressed Vodou assemblies while governing the colony.",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "PD-old-70",
        creator: "Denis Alexandre Volozan",
        institution: "Musée d'Aquitaine, Bordeaux",
        objectDate: "c. 1800",
      }),
      commonsPicture({
        fileName: "Burning of Cap‑Français.png",
        caption:
          "'Incendie du Cap. Révolte générale des Nègres. Massacre des Blancs', frontispiece of the French book Saint-Domingue, ou Histoire de ses révolutions, published between about 1791 and 1820: a contemporary French print of the burning of Cap-Français (1793).",
        shows: "engraving",
        identificationStatus: "secure",
        licence: "PD-old-70-1923",
        creator: "Unknown engraver",
        objectDate: "c. 1791–1820",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_dubois_2004",
        startYear: 1791,
        endYear: 1804,
        temporalClaimType: "date_range",
        whatIsDated: "The Haitian Revolution, from the August 1791 uprising to independence",
        originalDateText: "From the uprising of August 1791 to independence on 1 January 1804",
        evidence:
          "EVIDENCE TYPE: contemporary written. Both ends are documented in contemporary records. The range dates the war; it does not date any change in Vodou, which can only be inferred.",
        citations: [
          cite("haiti_thornton_1993", "supports", "Documents the Kongo contribution to the insurgent armies."),
          cite("haiti_fick_1990", "supports", "Discusses religious leaders and practice among the insurgents."),
          cite("haiti_geggus_2002", "context", "Discusses the evidence for religion in the uprising and its limits."),
        ],
      }),
    ],
  },

  {
    slug: "haiti-pact-with-the-devil-claim",
    title: "\"A pact with the devil\": how Bwa Kayiman was turned into a curse",
    summary:
      "On 13 January 2010, the day after the Port-au-Prince earthquake, the American televangelist Pat Robertson said Haitians had 'swore a pact to the devil' to win their freedom. The claim is a modern evangelical re-reading of the Bwa Kayiman story, recorded here as a misrepresentation, with its genealogy and its critics.",
    description:
      "WHAT WAS SAID. On the 700 Club broadcast of 13 January 2010, Pat Robertson told viewers that Haitians, under the French, 'got together and swore a pact to the devil' in exchange for freedom, and that they had been 'cursed by one thing after the other' since. The White House press secretary called the remark 'utterly stupid'; Haitian commentators, scholars, clergy of many denominations and comedians condemned it; CBN said he had not said the earthquake was God's wrath.\n\n" +
      "WHERE IT CAME FROM. Elizabeth McAlister traced the genealogy. The colonial account (Dalmas) presented the ceremony as savage; nineteenth-century Haitian writers made it a heroic oath to the god of the oppressed; in the late twentieth century some evangelical 'spiritual warfare' writers and Haitian Protestant preachers re-read the same story as a national blood pact with Satan that had to be renounced, and organised prayer campaigns to 'break' it (including around the bicentennial in 2004). Robertson was repeating a story already current in those circles.\n\n" +
      "WHY IT IS A MISREPRESENTATION. Historically: nothing in the earliest sources describes a pact with a devil — Dalmas reports a sacrifice and an oath; the prayer attributed to Boukman (Dumesle, 1824) rejects the 'god of the whites' who demands crime in favour of a good god; and the lwa are not devils in Vodou theology. Theologically: it reads an African religious oath through a Christian demonology foreign to it. Morally and politically: it blames a people for their own disaster and for their freedom, while ignoring the documented causes of Haiti's poverty, including the 1825 indemnity to France.\n\n" +
      "SIGNIFICANCE. The claim is part of the modern history of Vodou because it had consequences: it fed post-earthquake hostility to practitioners, including attacks in 2010. It is recorded here as a claim — with who made it, when, from what, and who answered — not as an account of the past.",
    category: "religion",
    subcategory: "Revolution and memory",
    eventType: "disputed",
    evidenceStatus: "disputed",
    tags: tags(["place: saint-domingue and haiti", "deity: lwa"], "bwa-kayiman", "misrepresentation", "evangelical", "2010", "stereotype"),
    people: ["Pat Robertson", "Elizabeth McAlister", "Robert Gibbs", "Dutty Boukman"],
    civilisations: ["Haiti", "Christian Broadcasting Network", "US evangelical movement"],
    locationName: "Virginia Beach, Virginia (broadcast) and Haiti (subject)",
    argumentsFor:
      "Proponents (Robertson; some evangelical and Haitian Protestant preachers) say that the founding ceremony of the nation invoked spirits that Christianity identifies as demons, that its leaders made a binding covenant with them in exchange for victory, and that Haiti's misfortunes are the spiritual consequence, which only national repentance can lift.",
    argumentsAgainst:
      "No early source describes a pact with the devil; the earliest account reports a sacrifice and an insurgent oath, and the 1824 prayer contrasts a cruel 'god of the whites' with a good god of the enslaved. The lwa are not devils in Vodou. The story is a twentieth-century evangelical re-reading (McAlister 2012); and Haiti's poverty has documented political and economic causes, including the 1825 French indemnity and foreign occupation.",
    genealogies: [
      {
        key: "pact-with-the-devil",
        claim: "Haiti's founders swore a pact with the devil at Bois Caïman in 1791, and the nation has been cursed ever since",
        verdict: "later_interpretation",
        verdictEvidence:
          "The underlying ceremony is probable (see the Bwa Kayiman records), but the 'pact with Satan' reading appears only in modern evangelical writing; no early account contains it.",
        whatWouldChangeThis:
          "An eighteenth- or early-nineteenth-century source describing the ceremony as a covenant with a devil figure — none is known.",
        links: [
          {
            stage: "colonial_record",
            who: "Antoine Dalmas",
            year: 1814,
            sourceKey: "haiti_dalmas_1814",
            saysAbsentReason: "Not read in this session; summarised from Geggus and McAlister.",
            adds: "A sacrifice and oath described as savage — but no devil.",
            citationStatus: "unverified",
          },
          {
            stage: "oral_testimony",
            who: "Hérard Dumesle",
            year: 1824,
            sourceKey: "haiti_dumesle_1824",
            saysAbsentReason: "Not read in this session.",
            adds: "Boukman's prayer, contrasting the god of the whites with a good god of the enslaved: an anti-colonial, not satanic, theology.",
            citationStatus: "unverified",
          },
          {
            stage: "popular_claim",
            who: "Evangelical 'spiritual warfare' writers and Haitian Protestant preachers, late twentieth century",
            sourceKey: "haiti_mcalister_2012",
            saysAbsentReason: "The original evangelical texts were not located in this session; reported by McAlister.",
            adds: "The reinterpretation of the oath as a national blood pact with Satan requiring renunciation.",
            citationStatus: "unverified",
          },
          {
            stage: "popular_claim",
            who: "Pat Robertson, 700 Club",
            year: 2010,
            sourceKey: "haiti_abc_robertson_2010",
            says: "Haitians 'swore a pact to the devil' to be free of the French (as reported by ABC News and others).",
            adds: "A mass-media audience, and the link to the 2010 earthquake.",
            citationStatus: "verified",
          },
          {
            stage: "current_scholarship",
            who: "Elizabeth McAlister",
            year: 2012,
            sourceKey: "haiti_mcalister_2012",
            saysAbsentReason: "Article not read in this session; argument as summarised.",
            adds: "The genealogy of the claim as an evangelical rewriting of Haitian history.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    media: [
      commonsPicture({
        fileName: "Cathédrale Notre-Dame de Port-au-Prince 2010-01-26.jpg",
        caption:
          "The ruined Catholic cathedral of Port-au-Prince on 26 January 2010, two weeks after the earthquake of 12 January — the disaster to which Robertson tied his claim. US Air Force photograph.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "PD-USGov-Military-Air Force",
        creator: "Tech. Sgt. Prentice Colter, USAF",
        objectDate: "2010-01-26",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_abc_robertson_2010",
        startYear: 2010,
        startMonth: 1,
        startDay: 13,
        datePrecision: "day",
        temporalClaimType: "explicit_date",
        whatIsDated: "Pat Robertson's broadcast remark",
        originalDateText: "The 700 Club broadcast of 13 January 2010",
        evidence:
          "EVIDENCE TYPE: contemporary written. News reports of 13–14 January 2010 date the broadcast. This dates the remark only; it is evidence of the claim, not of anything in 1791.",
        citations: [cite("haiti_csmonitor_robertson_2010", "supports", "Reports the remark and the White House response on 14 January 2010.")],
      }),
      claim({
        sourceKey: "haiti_mcalister_2012",
        startYear: 1990,
        endYear: 2010,
        isApproximate: true,
        datePrecision: "decade",
        temporalClaimType: "estimated_range",
        chronology: "historical",
        whatIsDated: "Circulation of the 'blood pact with Satan' reading in evangelical writing before Robertson",
        originalDateText: "Current in evangelical 'spiritual warfare' circles from the late twentieth century",
        evidence:
          "EVIDENCE TYPE: modern interpretation. McAlister traces the reading through evangelical texts and campaigns; the start of the range is approximate and NEEDS SOURCE VERIFICATION against her article.",
      }),
    ],
  },

  {
    slug: "haitian-independence-1-january-1804",
    title: "1 January 1804: independence, and a new state's religion",
    summary:
      "Jean-Jacques Dessalines proclaimed the independence of Haiti at Gonaïves on 1 January 1804. The new state recognised no established church in Rome's eyes for over half a century, and the countryside's religion developed largely beyond clerical control.",
    description:
      "THE EVENT. After the defeat of Napoleon's expedition at Vertières in November 1803, the generals of the indigenous army met at Gonaïves, and on 1 January 1804 Dessalines proclaimed the independence of the former colony under the Taíno name Haiti. It was the first state founded by formerly enslaved people, and the second independent state in the Americas.\n\n" +
      "RELIGION IN THE NEW STATE. Haiti's early constitutions varied: Dessalines's 1805 constitution declared that the law recognised no dominant religion and tolerated freedom of worship; later constitutions made Catholicism the religion of the state. In practice Rome did not recognise Haiti's clergy arrangements, and the church suffered a schism: until the 1860 Concordat, the country had very few priests, many of them irregular. None of this made Vodou legal — Dessalines, Christophe and later governments all acted against it — but the thin clerical presence left the rural religion to develop in family compounds (lakou) and communities.\n\n" +
      "WHAT INDEPENDENCE MEANT FOR VODOU. The land reform and the rise of a small-holding peasantry gave the religion its classic nineteenth-century setting: lwa inherited with land, served by families, with the dead buried in the yard. Many scholars date the consolidation of the Rada–Petwo system and of family-based service to this period rather than to the colony.\n\n" +
      "SIGNIFICANCE. Independence turned Vodou from the religion of enslaved people in a colony into the religion of the majority of a free nation — and, at the same time, into a religion that the new elite, anxious for international respectability, would try for 150 years to suppress.",
    category: "history",
    subcategory: "Independence",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["place: saint-domingue and haiti", "practice: catholic contact", "practice: ancestors"], "independence", "1804", "dessalines"),
    people: ["Jean-Jacques Dessalines"],
    civilisations: ["Haiti", "Indigenous Army (Armée indigène)"],
    locationName: "Gonaïves, Haiti",
    lat: 19.45,
    lng: -72.683,
    media: [
      commonsPicture({
        fileName: "Surviving 19th century Haitian flag.jpg",
        caption:
          "A surviving nineteenth-century Haitian flag, held by the Smithsonian National Museum of African American History and Culture (2020.46): a material emblem of the independent state proclaimed in 1804. Its exact date is not stated.",
        shows: "artefact",
        identificationStatus: "probable",
        licence: "PD-scan (PD-old-assumed)",
        creator: "Unknown maker",
        institution: "Smithsonian National Museum of African American History and Culture",
        accessionNumber: "2020.46",
        objectDate: "nineteenth century, before 1900",
      }),
      commonsPicture({
        fileName: "Dessalines emperor haiti.jpg",
        caption:
          "UNVERIFIED — an image uploaded in 2019 as a portrait of Jean-Jacques Dessalines, emperor of Haiti; the file page records only the uploader as author and gives no original source or date, so what original it reproduces is not verified. No portrait of Dessalines from life is securely identified.",
        shows: "portrait",
        identificationStatus: "unverified",
        licence: "CC BY-SA 4.0 (as stated on the file page)",
        creator: "Commons user Pôlehistoire",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_dubois_2004",
        startYear: 1804,
        startMonth: 1,
        startDay: 1,
        datePrecision: "day",
        temporalClaimType: "explicit_date",
        whatIsDated: "The proclamation of Haitian independence",
        originalDateText: "Proclaimed at Gonaïves, 1 January 1804",
        evidence:
          "EVIDENCE TYPE: contemporary written. The Act of Independence is dated in its own text. It dates the political event; it does not date any change in religious practice.",
        citations: [cite("haiti_desmangles_1992", "context", "Describes the church's position after 1804 and the schism until 1860.")],
      }),
    ],
  },

  // ---- The nineteenth century: a state against its majority's religion -----

  {
    slug: "haitian-state-against-vodou-1800-1835",
    title: "Louverture, Dessalines, Christophe and Boyer: the new state against Vodou, 1800–1835",
    summary:
      "The leaders who freed Haiti also repressed Vodou: Louverture banned nocturnal dances and assemblies, Dessalines and Christophe acted against independent religious leaders, and Boyer's Code pénal of 1835 made 'sortilèges' a crime — the law that stood, in revised forms, for a century and a half.",
    description:
      "LOUVERTURE. Governing Saint-Domingue around 1800, Toussaint Louverture — a Catholic who wanted a disciplined plantation labour force and international respectability — issued an ordinance against 'danses' and all nocturnal assemblies, which Kate Ramsey identifies as the first measure to target 'le vaudoux' by name or by its practices so directly. The date commonly given is January 1800; NEEDS SOURCE VERIFICATION.\n\n" +
      "DESSALINES AND CHRISTOPHE. Reports from the early national period describe Dessalines having followers of independent religious leaders shot, and Henri Christophe's northern kingdom (1811–1820) policing popular religion as part of its regime of plantation labour and royal Catholicism. The details of these measures are thinly documented and NEED SOURCE VERIFICATION; the direction is clear: the revolutionary leadership saw autonomous religious authority as a political threat.\n\n" +
      "BOYER'S CODE PÉNAL (1835). Under President Jean-Pierre Boyer (1818–1843), Haiti adopted a Code pénal modelled on the French one, with articles — commonly cited as articles 405–407 — punishing those who practised 'sortilèges' (spell-making), made 'ouangas', 'macandals' or other charms, or engaged in divination, dream-reading and card-reading for money, with fines, imprisonment and confiscation of ritual objects. 'Le vaudoux' was treated as a species of sortilège. Geffrard's government revised and harshened the articles in 1864, after the Bizoton affair.\n\n" +
      "HOW IT WORKED. Ramsey shows that these laws were enforced unevenly — tolerated in rural communities for long stretches, applied sharply in periods of political anxiety or foreign scrutiny — and that their vagueness made them tools for disciplining the peasantry. They did not distinguish sorcery from family and community religion.\n\n" +
      "SIGNIFICANCE. This is the legal frame within which Haitian Vodou lived from independence to 1987: a religion of the majority, formally criminal, practised under the shadow of laws written by its own people's governments in the vocabulary of 'civilisation'.",
    category: "religion",
    subcategory: "Suppression",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["place: saint-domingue and haiti", "practice: catholic contact", "practice: drumming and song"], "law", "prohibition", "sortileges", "nineteenth-century"),
    people: ["Toussaint Louverture", "Jean-Jacques Dessalines", "Henri Christophe", "Jean-Pierre Boyer", "Fabre Geffrard"],
    civilisations: ["Haiti", "Kingdom of Haiti (north, 1811–1820)"],
    locationName: "Haiti",
    media: [
      commonsPicture({
        fileName: "Henri Christophe.jpg",
        caption:
          "Portrait of Henri Christophe, King Henry I of Haiti, painted by Richard Evans in 1816 (Musée du Panthéon National Haïtien).",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "PD-Art (PD-old-auto-expired)",
        creator: "Richard Evans",
        institution: "Musée du Panthéon National Haïtien",
        objectDate: "1816",
      }),
      commonsPicture({
        fileName: "Jean-Pierre Boyer.jpg",
        caption:
          "Portrait of Jean-Pierre Boyer, President of Haiti 1818–1843, under whom the Code pénal of 1835 made 'sortilèges' a crime; an unattributed painted portrait of his presidency (1822–1843 per the file page).",
        shows: "portrait",
        identificationStatus: "probable",
        licence: "PD-Art (PD-old-100-expired)",
        creator: "Unknown artist",
        objectDate: "between 1822 and 1843",
      }),
      commonsPicture({
        fileName: "Toussaint Louverture par Montfayon.jpg",
        caption:
          "Toussaint Louverture, portrait engraving attributed to M. de Montfayon, late eighteenth or early nineteenth century: one of many posthumous or second-hand images; no portrait from life is securely established.",
        shows: "engraving",
        identificationStatus: "probable",
        licence: "PD-old",
        creator: "M. de Montfayon",
        objectDate: "late eighteenth or early nineteenth century",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_ramsey_2011",
        startYear: 1800,
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Louverture's ordinance against dances and nocturnal assemblies",
        originalDateText: "Toussaint Louverture's ordinance of about 1800 against 'danses' and nocturnal assemblies",
        evidence:
          "EVIDENCE TYPE: contemporary written. The ordinance survives in the colonial record and is discussed by Ramsey (pp. 48–49, per a review). The exact date (often given as January 1800) NEEDS SOURCE VERIFICATION.",
      }),
      claim({
        sourceKey: "haiti_ramsey_2011",
        startYear: 1835,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Code pénal articles against 'sortilèges'",
        originalDateText: "The Haitian Code pénal of 1835 (articles commonly cited as 405–407)",
        evidence:
          "EVIDENCE TYPE: contemporary written. The code is dated by its promulgation under Boyer. The article numbers are as commonly cited and NEED SOURCE VERIFICATION against the text. It establishes the law; enforcement varied widely.",
        citations: [
          cite("haiti_metraux_1958", "supports", "Discusses the penal articles against sortilèges and their enforcement."),
          cite("haiti_hurbon_1995", "context", "Places the penal code in the history of the campaigns against Vodou."),
        ],
      }),
    ],
  },

  {
    slug: "haiti-vatican-concordat-1860",
    title: "The Concordat of 1860: Rome returns to Haiti",
    summary:
      "On 28 March 1860 the government of Fabre Geffrard concluded a concordat with the Holy See, ending decades of schism. A largely French clergy arrived, and the reorganised Catholic Church became the chief institutional opponent of Vodou for the next century.",
    description:
      "BEFORE 1860. From independence the Holy See refused to recognise Haitian control of church appointments, and Haiti had few priests, many of them irregular or self-appointed. Catholicism remained the official or majority religion in law, but parish life outside the towns was thin; the rural religion was largely unsupervised.\n\n" +
      "THE AGREEMENT. President Fabre Geffrard, seeking international recognition and a 'civilising' modernisation, concluded a concordat with Pope Pius IX on 28 March 1860. It established a hierarchy (an archdiocese at Port-au-Prince and suffragan dioceses), gave the state a role in nominations and salaries, and opened the country to religious orders: Holy Ghost Fathers, Sisters of St Joseph of Cluny, Brothers of Christian Instruction and others. The clergy who came were overwhelmingly French, many from Brittany, and they ran the elite schools.\n\n" +
      "WHAT IT MEANT FOR VODOU. The Concordat church saw Vodou as superstition to be extirpated, and over the following decades it organised missions, catechisms and periodic campaigns against it — culminating in the 'campagne anti-superstitieuse' of 1941–42. At the same time, Catholic saints' images (cheap chromolithographs from Europe) spread through the countryside and were absorbed into the iconography of the lwa: Saint Patrick for Danbala, Saint James for Ogou, the Mater Dolorosa for Ezili Freda, the Black Madonna for Ezili Dantò.\n\n" +
      "SIGNIFICANCE. The Concordat made the Catholic Church in Haiti an organised, foreign-staffed institution with a mission against Vodou — and, paradoxically, multiplied the Catholic images through which Vodou imagined its spirits. The relationship of 'symbiosis' that Desmangles describes was shaped as much after 1860 as in the colony.",
    category: "religion",
    subcategory: "Suppression",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["practice: catholic contact", "place: saint-domingue and haiti"], "concordat", "catholic-church", "1860"),
    people: ["Fabre Geffrard", "Pope Pius IX"],
    civilisations: ["Haiti", "Holy See", "Catholic Church in Haiti"],
    locationName: "Port-au-Prince, Haiti, and Rome",
    lat: 18.543,
    lng: -72.339,
    media: [
      commonsPicture({
        fileName: "Fabre Geffrard, président d'Haïti.jpg",
        caption:
          "Fabre Geffrard, President of Haiti 1859–1867, who concluded the Concordat with the Holy See in 1860; photograph from the London branch of the Disdéri studio, 1867.",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "PD-old-assumed; PD-US-expired",
        creator: "Studio of André-Adolphe-Eugène Disdéri (London branch)",
        objectDate: "1867",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_newadvent_cap_haitien",
        startYear: 1860,
        startMonth: 3,
        startDay: 28,
        datePrecision: "day",
        temporalClaimType: "explicit_date",
        whatIsDated: "Conclusion of the Concordat between Haiti and the Holy See",
        originalDateText: "Concordat concluded 28 March 1860",
        evidence:
          "EVIDENCE TYPE: contemporary written. The treaty is dated. This dates the agreement; the arrival of clergy and new dioceses followed over the 1860s.",
        citations: [cite("haiti_desmangles_1992", "supports", "Describes the end of the schism in 1860 and the church's subsequent stance on Vodou.")],
      }),
    ],
  },

  {
    slug: "bizoton-affair-and-cannibalism-libel",
    title: "The Bizoton affair (1864) and the cannibalism libel",
    summary:
      "In February 1864 eight people were tried and executed in Port-au-Prince for the ritual murder of a girl at Bizoton. With no transcript surviving and confessions likely coerced, the case became, through foreign reporting and Spenser St John's 'Hayti, or the Black Republic' (1884), the basis of a lasting libel of Vodou as cannibal.",
    description:
      "THE CASE. In late 1863 a young girl, Claircine, disappeared at Bizoton, on the coast just west of Port-au-Prince. Eight people — four men and four women, including the girl's uncle, Congo Pelé, and a manbo, Jeanne Pelé — were charged with killing her in a Vodou ceremony and eating parts of her body. They were tried in February 1864 before a court under President Geffrard, who was anxious to show the world a modern, Catholic Haiti, and were executed by firing squad on 13 February 1864.\n\n" +
      "THE EVIDENCE. No trial transcript survives. Accounts of the confessions come through officials, foreign diplomats and the press; contemporaries, including some of the accused, said confessions were obtained under torture. What happened to the girl cannot now be established. Mike Dash's review of the evidence calls the truth 'long obscured by prejudice and misreporting'.\n\n" +
      "THE LIBEL. Harper's Weekly in New York printed an engraving of the condemned in 1865 as 'votaries of the god Vaudoux (snake-worshipers), executed for the crime of cannibalism'. Spenser St John, a British diplomat in Haiti, made Bizoton the centrepiece of his chapter on 'Vaudoux worship and cannibalism' in Hayti, or the Black Republic (1884), presenting human sacrifice as routine. The book was widely read and cited for decades, including by American writers during the US occupation. The Haitian penal articles were harshened after the trial.\n\n" +
      "SIGNIFICANCE. Bizoton is where an uncertain criminal case was converted into a general claim about a religion. Like the 1758 poison panic before it and the zombie literature after it, it shows how the image of Vodou was built from a few sensational cases, retold abroad by people with political reasons to tell them.",
    category: "religion",
    subcategory: "Suppression",
    eventType: "historical",
    evidenceStatus: "disputed",
    tags: tags(["place: saint-domingue and haiti", "practice: serpent veneration"], "bizoton", "stereotype", "libel", "trial"),
    people: ["Claircine", "Congo Pelé", "Jeanne Pelé", "Fabre Geffrard", "Spenser St John"],
    civilisations: ["Haiti", "British diplomatic service"],
    locationName: "Bizoton, near Port-au-Prince, Haiti",
    lat: 18.53,
    lng: -72.38,
    media: [
      commonsPicture({
        fileName: "Affaire de Bizoton 1864.png",
        caption:
          "Engraving of the eight people condemned in the Bizoton affair, from Harper's Weekly, 2 September 1865 (p. 545), originally captioned 'Votaries of the God Vaudoux (Snake-Worshipers), Executed for the Crime of Cannibalism at Hayti'. A hostile press image made after the executions, not a record of guilt.",
        shows: "engraving",
        identificationStatus: "secure",
        licence: "PD-US",
        creator: "Unknown engraver for Harper's Weekly",
        objectDate: "1865",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_smithsonian_bizoton_2013",
        startYear: 1864,
        startMonth: 2,
        startDay: 13,
        datePrecision: "day",
        temporalClaimType: "explicit_date",
        whatIsDated: "The execution of the eight Bizoton defendants",
        originalDateText: "Executed in Port-au-Prince on 13 February 1864",
        evidence:
          "EVIDENCE TYPE: contemporary written. Contemporary reports date the executions. They do not establish what happened to the victim; the trial record is lost and confessions were reportedly coerced.",
        citations: [
          cite("haiti_harpers_1865", "context", "Shows how the American press reported the case in 1865."),
          cite("haiti_metraux_1958", "context", "Discusses the Bizoton affair and its use against Vodou."),
        ],
      }),
      claim({
        sourceKey: "haiti_st_john_1884",
        startYear: 1884,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of the book that spread the cannibalism claim",
        originalDateText: "Hayti, or the Black Republic, London 1884",
        evidence:
          "EVIDENCE TYPE: contemporary written. The imprint dates the book. It is evidence of the libel's circulation, not of the practices alleged.",
        citations: [cite("haiti_hurbon_1988", "context", "Analyses St John among the writers who built the image of Vodou as barbarism.")],
      }),
    ],
  },

  // ---- Occupation, ethnography and art -------------------------------------

  {
    slug: "us-occupation-vodou-and-zombie-imagery",
    title: "The US occupation (1915–1934), anti-Vodou policing and the zombie of 'The Magic Island'",
    summary:
      "During the American occupation, Marines and the Haitian gendarmerie enforced the laws against 'sortilèges' while American writers — above all William Seabrook in 'The Magic Island' (1929) — turned Vodou and the zombie into a sensational export.",
    description:
      "THE OCCUPATION. US Marines landed at Port-au-Prince on 28 July 1915 and stayed until August 1934. The occupation controlled customs and finance, revived forced road labour (the corvée), and fought the caco insurgency led by Charlemagne Péralte, whose body was photographed and displayed by the Marines after his killing in 1919.\n\n" +
      "POLICING RELIGION. American officers and the US-trained Gendarmerie (later Garde) enforced the penal articles against 'sortilèges' and ordered raids on ceremonies; drums and ritual objects were seized. Ramsey shows that the occupation treated Vodou as both a sign of barbarism and a security threat, linked in officers' minds with the caco resistance. In 1935, a year after the Marines left, President Sténio Vincent issued a decree-law against 'pratiques superstitieuses' that consolidated the prohibition.\n\n" +
      "THE BOOKS. Occupation-era American writing created the image most of the world still has. William Seabrook's The Magic Island (1929), with Alexander King's drawings, presented ceremonies, blood sacrifice and above all the zombie — a dead labourer raised to work the fields — as Haitian reality; Faustin Wirkus's The White King of La Gonave (1931) and others followed, and Hollywood (White Zombie, 1932) took it from there. The detail of that stereotype and its cinema is the subject of the vodun-today track.\n\n" +
      "THE HAITIAN ANSWER. The occupation also provoked the response: Jean Price-Mars's Ainsi parla l'oncle (1928), indigénisme in literature and art, and an ethnology that took Vodou seriously as religion.\n\n" +
      "SIGNIFICANCE. The occupation joined two kinds of power over Vodou: the policing of practitioners in Haiti and the authorship of their image abroad. The zombie of the American imagination, born in this period, became one of the most durable misrepresentations of any religion.",
    category: "religion",
    subcategory: "Occupation and stereotype",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["place: saint-domingue and haiti", "deity: gede and the dead", "practice: drumming and song"], "us-occupation", "zombie", "stereotype", "seabrook"),
    people: ["William B. Seabrook", "Alexander King", "Charlemagne Péralte", "Faustin Wirkus", "Sténio Vincent"],
    civilisations: ["Haiti", "United States Marine Corps", "Gendarmerie d'Haïti"],
    locationName: "Haiti",
    media: [
      commonsPicture({
        fileName: "US Marines and sailors from the USS Washington ashore for the capture of Port-au-Prince, Haiti, 1915.jpg",
        caption:
          "US Marines and sailors from the USS Washington ashore for the capture of Port-au-Prince, 1915: the beginning of the nineteen-year occupation.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "PD-US-expired",
        creator: "Unknown photographer",
        objectDate: "1915",
      }),
      commonsPicture({
        fileName: "W. B. Seabrook - The Magic Island (1929, The Literary Guild of America printing) (page 8 crop).jpg",
        caption:
          "An illustration by Alexander King from William Seabrook's The Magic Island (1929, Literary Guild printing), cropped from page 8: the occupation-era book that made the 'zombie' famous. A later artwork expressing an outsider's sensational vision, not a document of Vodou practice.",
        shows: "later_artwork",
        identificationStatus: "secure",
        licence: "PD-scan (PD-old-auto-expired, as stated on the file page)",
        creator: "Alexander King",
        objectDate: "1929",
      }),
      commonsPicture({
        fileName: "Corps de Charlemagne Péralte.jpg",
        caption:
          "The body of the caco leader Charlemagne Péralte, killed by US Marines in 1919, photographed by the occupying forces and widely distributed to discourage his followers. A distressing image, included because the occupation's war on the cacos and its policing of Vodou were linked in officers' minds.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "PD-USGov (as stated on the file page; Haitian status undetermined)",
        creator: "US occupying forces (attributed)",
        objectDate: "1919-11",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_ramsey_2011",
        startYear: 1915,
        startMonth: 7,
        startDay: 28,
        endYear: 1934,
        datePrecision: "day",
        temporalClaimType: "date_range",
        whatIsDated: "The US military occupation of Haiti",
        originalDateText: "From the Marine landing of 28 July 1915 to the withdrawal in August 1934",
        evidence:
          "EVIDENCE TYPE: contemporary written. US and Haitian government records date the occupation. The range dates the regime under which anti-Vodou laws were enforced by an occupying army.",
        citations: [cite("haiti_hurbon_1995", "supports", "Describes anti-Vodou action during the occupation.")],
      }),
      claim({
        sourceKey: "haiti_seabrook_1929",
        startYear: 1929,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of The Magic Island",
        originalDateText: "The Magic Island, New York 1929",
        evidence:
          "EVIDENCE TYPE: contemporary written. The imprint dates the book that popularised the zombie in English. It is evidence of the stereotype, not of Vodou.",
        citations: [cite("haiti_ramsey_2011", "context", "Places occupation-era American writing within the politics of the occupation.")],
      }),
      claim({
        sourceKey: "haiti_iclrs_overview",
        startYear: 1935,
        startMonth: 9,
        startDay: 5,
        datePrecision: "day",
        temporalClaimType: "explicit_date",
        whatIsDated: "Vincent's decree-law against 'superstitious practices'",
        originalDateText: "Decree-law of 5 September 1935 on superstitious practices",
        evidence:
          "EVIDENCE TYPE: contemporary written. The decree-law is dated; its abrogation by Article 297 of the 1987 Constitution names it by date. Its text was not read in this session.",
        citations: [cite("haiti_ramsey_2011", "supports", "Describes the 1935 decree-law as criminalising Vodou until 1987.")],
      }),
    ],
  },

  {
    slug: "price-mars-and-the-bureau-d-ethnologie",
    title: "\"Ainsi parla l'oncle\" (1928) and the Bureau d'Ethnologie (1941): Haitians take Vodou seriously",
    summary:
      "Jean Price-Mars's 'Ainsi parla l'oncle' (1928) argued, against the elite's shame, that Vodou was a religion and peasant culture the nation's culture. In 1941 Jacques Roumain founded the Bureau d'Ethnologie to study it.",
    description:
      "PRICE-MARS. Jean Price-Mars (1876–1969), physician, diplomat and teacher, gave the lectures that became Ainsi parla l'oncle ('So spoke the uncle') during the US occupation and published them in 1928. He attacked the 'collective bovarysme' of an elite that imagined itself French, and argued that the folklore, tales, songs and religion of the Haitian peasantry were the country's real culture. Vodou, he wrote, was a religion — with a theology, a priesthood and a ritual — and deserved study rather than contempt. The book launched the indigéniste movement in literature and art and made ethnology a Haitian intellectual project.\n\n" +
      "THE BUREAU. Jacques Roumain (1907–1944), novelist, communist and founder of the Haitian Communist Party, studied ethnology in Paris and founded the Bureau d'Ethnologie in Port-au-Prince in late October 1941, with Price-Mars and with help from Alfred Métraux. Its purpose was to collect and protect the material and knowledge of popular religion — at the very moment the Catholic anti-superstition campaign was destroying it. Roumain publicly defended Vodou against the campaign in 1942.\n\n" +
      "WHAT FOLLOWED. The Institut d'Ethnologie, the journal of the Bureau, and a generation of Haitian ethnographers (Lorimer Denis, François Duvalier among them, in the Griots group) came out of this movement. So did a politics: the noiriste reading that made Vodou the authentic religion of the black majority, which Duvalier would later exploit.\n\n" +
      "SIGNIFICANCE. This is the moment when Haitians themselves, not foreign travellers, began to write the scholarly history of Vodou — and when the religion's defenders and its future political manipulators came out of the same movement.",
    category: "culture",
    subcategory: "Scholarship and art",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["place: saint-domingue and haiti", "deity: lwa"], "indigenisme", "ethnology", "price-mars", "roumain"),
    people: ["Jean Price-Mars", "Jacques Roumain", "Alfred Métraux", "Lorimer Denis"],
    civilisations: ["Haiti", "Bureau d'Ethnologie"],
    locationName: "Port-au-Prince, Haiti",
    lat: 18.543,
    lng: -72.339,
    media: [
      commonsPicture({
        fileName: "Jean Price-Mars.jpg",
        caption: "Jean Price-Mars, photographed in Port-au-Prince in October 1956, nearly thirty years after Ainsi parla l'oncle.",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "CC BY-SA (cc-by-sa-old, as stated on the file page)",
        creator: "CIDIHCA (photograph, D.R.)",
        objectDate: "1956-10",
      }),
      commonsPicture({
        fileName: "Jacques Roumain.jpg",
        caption: "Jacques Roumain, founder of the Bureau d'Ethnologie, photographed in 1942 (CIDIHCA archives).",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "PD-Haiti; PD-1996",
        creator: "Unknown photographer",
        objectDate: "1942",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_price_mars_1928",
        startYear: 1928,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of Ainsi parla l'oncle",
        originalDateText: "Ainsi parla l'oncle, 1928",
        evidence:
          "EVIDENCE TYPE: contemporary written. The imprint dates the book; the lectures behind it were given during the occupation in the early 1920s.",
        citations: [cite("haiti_nicholls_1979", "supports", "Places Price-Mars at the origin of indigénisme and noirisme.")],
      }),
      claim({
        sourceKey: "haiti_roumain_1942",
        startYear: 1941,
        startMonth: 10,
        datePrecision: "month",
        temporalClaimType: "explicit_date",
        whatIsDated: "Founding of the Bureau d'Ethnologie",
        originalDateText: "Founded by Jacques Roumain in Port-au-Prince in late October 1941",
        evidence:
          "EVIDENCE TYPE: later historical account. Dated by Métraux's later account and by Haitian sources (seen via search summaries); the exact day (often 31 October) NEEDS SOURCE VERIFICATION.",
        citations: [cite("haiti_metraux_1958", "supports", "Métraux worked with Roumain on the Bureau's founding.")],
      }),
    ],
  },

  {
    slug: "hurston-and-dunham-in-haiti",
    title: "Zora Neale Hurston and Katherine Dunham in Haiti, 1935–1938",
    summary:
      "Two African American women — the anthropologist-novelist Zora Neale Hurston and the dancer-anthropologist Katherine Dunham — did fieldwork in Haiti in the mid-1930s, producing 'Tell My Horse' (1938) and a lifetime of Vodou-inspired dance and writing.",
    description:
      "DUNHAM. Katherine Dunham (1909–2006), trained in anthropology at the University of Chicago under Robert Redfield and Melville Herskovits, travelled in the Caribbean in 1935–36 on a Rosenwald fellowship to study dance, spending months in Haiti. She took part in ceremonies and underwent initiation, and Vodou dance became central to her choreography and her company's international career. She later bought the Habitation Leclerc estate near Port-au-Prince and wrote Island Possessed (1969), her own account of those years.\n\n" +
      "HURSTON. Zora Neale Hurston (1891–1960), already the author of Mules and Men (1935) on hoodoo in the American South, went to Jamaica and Haiti in 1936–37 on Guggenheim fellowships, wrote Their Eyes Were Watching God in Haiti, and published Tell My Horse (1938). The book describes lwa, ceremonies and the Gede with sympathy and wit, and also includes a chapter on zombies with a photograph of a woman said to be one — which helped sustain the very stereotype the rest of the book complicates.\n\n" +
      "WHY THEY MATTER TOGETHER. Both were Black American women working in a field dominated by white men, during and just after the US occupation; both treated Vodou as a religion of living people and recorded women's roles; both moved between scholarship and art. Their work connected Haitian Vodou with the African American cultural world of the Harlem Renaissance and the Black Atlantic.\n\n" +
      "SIGNIFICANCE. Hurston and Dunham are part of how Vodou entered American culture on terms other than Seabrook's — through dance, literature and participant ethnography — while their own work shows how hard it was to escape the sensational frame entirely.",
    category: "culture",
    subcategory: "Scholarship and art",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["place: saint-domingue and haiti", "practice: drumming and song", "practice: possession", "deity: gede and the dead"], "ethnography", "dance", "hurston", "dunham"),
    people: ["Zora Neale Hurston", "Katherine Dunham", "Melville J. Herskovits"],
    civilisations: ["Haiti", "African American intellectual and artistic world"],
    locationName: "Haiti (fieldwork) and the United States",
    media: [
      commonsPicture({
        fileName: "Zora Hurston, half-length portrait, standing, facing slightly left, beating the hountar, or mama drum (LCCN93513271).jpg",
        caption:
          "Zora Neale Hurston beating the hountar, or mama drum, photographed in 1937 by a New York World-Telegram staff photographer (Library of Congress) — the year of her Haitian fieldwork.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "No known copyright restriction (New York World-Telegram & Sun Collection, Library of Congress)",
        creator: "World-Telegram staff photographer",
        institution: "Library of Congress, Prints and Photographs Division",
        accessionNumber: "cph.3c08549",
        objectDate: "1937",
      }),
      commonsPicture({
        fileName: "Katherine Dunham by Van Vechten cph.3b46690.jpg",
        caption: "Katherine Dunham photographed by Carl Van Vechten on 10 May 1940, a few years after her Haitian fieldwork (Library of Congress).",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "PD-Van Vechten (Library of Congress)",
        creator: "Carl Van Vechten",
        institution: "Library of Congress",
        accessionNumber: "cph.3b46690",
        objectDate: "1940-05-10",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_dunham_1969",
        startYear: 1935,
        endYear: 1936,
        temporalClaimType: "date_range",
        whatIsDated: "Katherine Dunham's Caribbean and Haitian fieldwork",
        originalDateText: "Fieldwork in Haiti in 1935–36",
        evidence:
          "EVIDENCE TYPE: later historical account. Dunham's own memoir, written in 1969, and her biographers date the fieldwork. Precise months NEED SOURCE VERIFICATION.",
      }),
      claim({
        sourceKey: "haiti_hurston_1938",
        startYear: 1938,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of Tell My Horse",
        originalDateText: "Tell My Horse, Philadelphia 1938",
        evidence:
          "EVIDENCE TYPE: contemporary written. The imprint dates the book, which rests on fieldwork in 1936–37.",
        citations: [cite("haiti_herskovits_1937", "context", "Herskovits's Haitian ethnography of the same years, and the teacher of both women's generation.")],
      }),
    ],
  },

  {
    slug: "campagne-anti-superstitieuse-1941-1942",
    title: "The 'campagne anti-superstitieuse' of 1941–1942",
    summary:
      "With the backing of President Élie Lescot, the Catholic Church in Haiti waged its most violent campaign against Vodou in 1941–42: ounfò destroyed, sacred trees cut, drums and objects burned, and Catholics required to swear an oath renouncing the lwa. Public opposition and violence ended state support in 1942.",
    description:
      "WHAT HAPPENED. Building on earlier missions (including a 'rejeté' renunciation movement in the late 1930s), the Catholic hierarchy — largely French clergy since the Concordat — launched in 1941 a campaign to extirpate 'superstition', with initial support from the government of Élie Lescot (president 1941–1946) and the army. Clergy and their helpers went through the countryside destroying ounfò, cutting sacred trees (mapou and others), burning drums, altars and ritual objects. Métraux reports that Catholics were required to take an anti-superstition oath renouncing service of the lwa as a condition of the sacraments.\n\n" +
      "THE OPPOSITION. Jacques Roumain, founder of the Bureau d'Ethnologie, attacked the campaign in print in 1942, in a public controversy with the priest Joseph Foisset; ethnologists, writers and many ordinary Haitians resisted. When the campaign was extended to Port-au-Prince in early 1942 the controversy intensified, and after violent incidents — including shooting during a mass reported in the literature — the government withdrew its backing in 1942. NEEDS SOURCE VERIFICATION for the specific incidents.\n\n" +
      "WHAT WAS LOST. Métraux and later writers describe the destruction of a great deal of ritual material and of some sacred groves; Ramsey argues the campaign also hardened the association between Vodou and the peasantry, and between Catholic orthodoxy and the elite.\n\n" +
      "SIGNIFICANCE. The campaign was the largest single attempt to destroy Vodou in Haiti's history. Its failure, and the defence of Vodou it provoked, mark a turning point: after 1942 the Haitian state never again lent its army to the Church against the lwa in the same way, and the religion's defenders gained a public voice.",
    category: "religion",
    subcategory: "Suppression",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["practice: catholic contact", "practice: sacred trees and forests", "place: saint-domingue and haiti", "practice: drumming and song"], "anti-superstition-campaign", "lescot", "1941"),
    people: ["Élie Lescot", "Jacques Roumain", "Joseph Foisset", "Alfred Métraux"],
    civilisations: ["Haiti", "Catholic Church in Haiti"],
    locationName: "Haiti, countryside and Port-au-Prince",
    media: [
      commonsPicture({
        fileName: "Elie Lescot portrait.jpg",
        caption: "Élie Lescot, President of Haiti 1941–1946, whose government backed the Catholic anti-superstition campaign at its start; undated portrait.",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "PD-Haiti",
        creator: "Unknown photographer",
      }),
      commonsPicture({
        fileName: "Ceremonie de Mapou Bazile.jpg",
        caption:
          "Castera Bazile, 'Cérémonie de Mapou' (ceremony at a ceiba tree), painting made before the artist's death in 1966, now in the Figge Art Museum: a later artwork showing the kind of sacred-tree service the 1941–42 campaign attacked by cutting mapou trees.",
        shows: "later_artwork",
        identificationStatus: "secure",
        licence: "PD-Haiti",
        creator: "Castera Bazile",
        institution: "Figge Art Museum",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_ramsey_2011",
        startYear: 1941,
        endYear: 1942,
        temporalClaimType: "date_range",
        whatIsDated: "The Catholic anti-superstition campaign with government backing",
        originalDateText: "The campaign of 1941–42 under President Lescot",
        evidence:
          "EVIDENCE TYPE: contemporary written. Church publications, press and government records date the campaign; Ramsey and Métraux reconstruct it. The start month and the exact end NEED SOURCE VERIFICATION.",
        citations: [
          cite("haiti_metraux_1958", "supports", "Describes the campaign, the destruction it caused and the renunciation oath."),
          cite("haiti_roumain_1942", "context", "The contemporary public defence of Vodou against the campaign."),
        ],
      }),
    ],
  },

  {
    slug: "centre-d-art-and-hector-hyppolite",
    title: "The Centre d'Art (1944) and Hector Hyppolite, the oungan who painted the lwa",
    summary:
      "The Centre d'Art opened in Port-au-Prince in 1944. Its most celebrated discovery, Hector Hyppolite, was an oungan whose paintings of Ezili, Danbala and the dead brought the images of Vodou to galleries in Paris and New York.",
    description:
      "THE CENTRE. The American watercolourist DeWitt Peters, teaching in Haiti, founded the Centre d'Art in Port-au-Prince with Haitian artists and intellectuals in 1944. It offered materials, space and sales to self-taught painters and sculptors, and within a few years 'Haitian art' had become an international category.\n\n" +
      "HYPPOLITE. Hector Hyppolite (1894–1948), from Saint-Marc, a house-painter and oungan, joined in 1945. His paintings — Maîtresse Erzulie, Damballah La Flambeau, Vol de zombis, scenes of ceremonies — showed the lwa as he served and imagined them, in house paint on cardboard and board, with flowers, serpents and crowned figures. André Breton, visiting in 1945, bought several and exhibited him in Paris (1947); Hyppolite died in 1948 at the height of his fame. Castera Bazile, Rigaud Benoît, Wilson Bigaud and others followed.\n\n" +
      "WHAT IT DID FOR VODOU'S IMAGE. For the first time, images of the lwa by a practitioner circulated as art rather than as evidence of savagery. The paintings also fixed certain iconographies — Ezili with hearts and jewellery, Danbala as a serpent — for audiences who knew nothing else. Critics have since debated the 'primitive' label, and the role of foreign patrons in shaping what Haitian artists painted.\n\n" +
      "SIGNIFICANCE. The Centre d'Art made Haitian Vodou visible internationally through its own artists. The relationship between sacred imagery (vèvè, drapo, altar art) and gallery painting begun here is still central to Haitian art and to how Vodou is seen.",
    category: "culture",
    subcategory: "Scholarship and art",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["practice: veve and sacred art", "deity: ezili and water spirits", "deity: dan and aido-hwedo", "place: saint-domingue and haiti"], "art", "centre-d-art", "hyppolite"),
    people: ["Hector Hyppolite", "DeWitt Peters", "André Breton", "Castera Bazile", "Rigaud Benoît", "Selden Rodman"],
    civilisations: ["Haiti", "Centre d'Art"],
    locationName: "Centre d'Art, Port-au-Prince, Haiti",
    lat: 18.543,
    lng: -72.339,
    media: [
      commonsPicture({
        fileName: "Maitresse Erzulie (Hector Hyppolite painting).jpg",
        caption: "Hector Hyppolite, 'Maîtresse Erzulie', painted between 1945 and 1948: the lwa Ezili as imagined by an oungan-painter of the Centre d'Art. A later artwork.",
        shows: "later_artwork",
        identificationStatus: "secure",
        licence: "PD-Haiti",
        creator: "Hector Hyppolite",
        objectDate: "1945–1948",
      }),
      commonsPicture({
        fileName: "Hector Hyppolite.jpg",
        caption: "Profile photograph of Hector Hyppolite, before his death in 1948; photographer and date unknown.",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "PD-Haiti",
        creator: "Unknown photographer",
        objectDate: "1948 or earlier",
      }),
      commonsPicture({
        fileName: "Le Centre d’Art in Port-au-Prince, Haiti before 2010 earthquake.jpg",
        caption: "The Centre d'Art at 58 rue Roy, Port-au-Prince, photographed on 11 August 2006; the building was destroyed in the 2010 earthquake.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY 2.0",
        creator: "Cristian Borquez",
        objectDate: "2006-08-11",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_rodman_1948",
        startYear: 1944,
        temporalClaimType: "explicit_date",
        whatIsDated: "Opening of the Centre d'Art",
        originalDateText: "Founded in Port-au-Prince in 1944 by DeWitt Peters and Haitian artists",
        evidence:
          "EVIDENCE TYPE: contemporary written. Rodman, a co-director, dates the founding. The month (often given as May 1944) NEEDS SOURCE VERIFICATION.",
        citations: [cite("haiti_cosentino_1995", "context", "Places Centre d'Art painting in relation to sacred arts of Vodou.")],
      }),
      claim({
        sourceKey: "haiti_rodman_1948",
        startYear: 1948,
        temporalClaimType: "explicit_date",
        whatIsDated: "Death of Hector Hyppolite",
        originalDateText: "Hyppolite died in 1948",
        evidence:
          "EVIDENCE TYPE: contemporary written. Rodman's book appeared the same year. This dates the end of his three-year career at the Centre.",
      }),
    ],
  },

  {
    slug: "deren-and-metraux-describe-vodou",
    title: "\"Divine Horsemen\" (1953) and \"Le Vaudou haïtien\" (1958): the classic accounts",
    summary:
      "The filmmaker Maya Deren's 'Divine Horsemen' (1953) and the anthropologist Alfred Métraux's 'Le Vaudou haïtien' (1958) became the two most influential descriptions of Haitian Vodou in the mid-twentieth century — one from inside the experience of possession, one a systematic ethnography.",
    description:
      "DEREN. Maya Deren (1917–1961), an avant-garde filmmaker, went to Haiti in 1947 on a Guggenheim fellowship to film dance and found herself drawn into the religion. Over several visits to 1954 she shot film, recorded music and took part in ceremonies; she described being possessed by Ezili. Divine Horsemen: The Living Gods of Haiti (1953), with a foreword by Joseph Campbell, presents Vodou as a coherent theology and possession as the 'riding' of a person by the lwa. The film assembled from her footage appeared only in 1985.\n\n" +
      "MÉTRAUX. Alfred Métraux (1902–1963), a Swiss-born anthropologist who had worked in South America and Easter Island, first came to Haiti in 1941 and helped found the Bureau d'Ethnologie; in 1948–50 he directed UNESCO's pilot project in the Marbial valley. Le Vaudou haïtien (1958; English 1959) describes the lwa and their nanchon, the ounfò and its personnel, initiation (kanzo), possession, the vèvè, magic, the dead, and the history of persecution including the 1941–42 campaign. It remains the standard reference.\n\n" +
      "TOGETHER. Deren writes from experience and theology; Métraux from observation and comparison. Both insist that Vodou is a religion and not sorcery; both were outsiders. Their books, with Herskovits's earlier work, Milo Rigaud's studies, and later Karen McCarthy Brown's, form the shelf most later writing draws on.\n\n" +
      "SIGNIFICANCE. These two works gave the world its first widely read, serious accounts of Haitian Vodou, displacing (without defeating) the Seabrook image, and their vocabulary — 'divine horsemen', the nanchon, the ounfò — shaped how outsiders and some practitioners describe the religion.",
    category: "culture",
    subcategory: "Scholarship and art",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["practice: possession", "deity: lwa", "practice: initiation and priesthood", "place: saint-domingue and haiti"], "ethnography", "deren", "metraux"),
    people: ["Maya Deren", "Alfred Métraux", "Joseph Campbell", "Milo Rigaud"],
    civilisations: ["Haiti", "UNESCO"],
    locationName: "Haiti (fieldwork), New York and Paris (publication)",
    media: [
      commonsPicture({
        fileName: "Maya Deren.jpg",
        caption: "Maya Deren in a still from her film Meshes of the Afternoon (1943), four years before she first went to Haiti.",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "PD-US-no notice",
        creator: "Maya Deren (film still)",
        objectDate: "1943",
      }),
      commonsPicture({
        fileName: "Alfred Métraux.jpg",
        caption: "Alfred Métraux at Candelaria, Argentina, in July 1932, years before his Haitian fieldwork.",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "CC BY-SA 3.0",
        creator: "Charles Mallison (as stated on the file page)",
        objectDate: "1932-07",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_deren_1953",
        startYear: 1953,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of Divine Horsemen",
        originalDateText: "Divine Horsemen: The Living Gods of Haiti, 1953",
        evidence: "EVIDENCE TYPE: contemporary written. The imprint dates the book, which rests on visits to Haiti from 1947.",
      }),
      claim({
        sourceKey: "haiti_metraux_1958",
        startYear: 1958,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of Le Vaudou haïtien",
        originalDateText: "Le Vaudou haïtien, Paris 1958",
        evidence: "EVIDENCE TYPE: contemporary written. The imprint dates the book; its fieldwork spans the 1940s and 1950s. The English translation followed in 1959.",
      }),
    ],
  },

  {
    slug: "duvalier-vodou-and-dechoukaj-1986",
    title: "Duvalier's use of Vodou (1957–1986), and the dechoukaj attacks on oungan",
    summary:
      "François 'Papa Doc' Duvalier, an ethnologist of the noiriste school, cultivated Vodou leaders as allies and let his image borrow from the lwa. When his son fell in February 1986, the 'uprooting' (dechoukaj) that followed included killings of oungan and manbo accused of serving the dictatorship.",
    description:
      "DUVALIER THE ETHNOLOGIST. François Duvalier (1907–1971) was a physician and, in the 1930s–40s, a member of the Griots group and the Bureau d'Ethnologie milieu, co-writing noiriste essays with Lorimer Denis on Vodou as the authentic religion of the black masses. Elected president in 1957, he made himself president-for-life in 1964.\n\n" +
      "HOW HE USED VODOU. Duvalier ended the anti-Vodou posture of earlier governments, recruited oungan as local informants, section chiefs and members of his Tonton Macoute militia, and cultivated a public persona — black suit, hat, glasses, nasal voice — that many Haitians associated with Bawon Samdi, master of the cemetery. He also expelled foreign Catholic clergy (1959–66) and obtained a Haitian hierarchy. Scholars caution that his 'Vodou policy' was opportunistic and selective: he co-opted some leaders, repressed others, and used rumour of his spiritual power as an instrument of fear.\n\n" +
      "1986. Jean-Claude Duvalier, president from 1971, fled on 7 February 1986. In the dechoukaj ('uprooting') that followed, crowds attacked Macoutes and symbols of the regime — and, in many places, oungan and manbo accused of having been its agents or of sorcery. Protestant preachers encouraged some of the violence. Laënnec Hurbon and others record killings and the destruction of temples; reliable totals are not available (secondary sources speak of dozens to hundreds).\n\n" +
      "THE RESPONSE. Practitioners organised: associations such as Zantray and Bode Nasyonal were formed to defend the religion, and their pressure contributed to the guarantees of the 1987 Constitution.\n\n" +
      "SIGNIFICANCE. The Duvalier years show the danger of a religion's political patronage: protection by a dictator made practitioners targets when he fell. The violence of 1986 is the immediate background to Vodou's legal recognition.",
    category: "religion",
    subcategory: "Dictatorship and after",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["place: saint-domingue and haiti", "deity: gede and the dead", "practice: initiation and priesthood"], "duvalier", "dechoukaj", "1986", "politics"),
    people: ["François Duvalier", "Jean-Claude Duvalier", "Lorimer Denis", "Laënnec Hurbon"],
    civilisations: ["Haiti", "Tonton Macoutes", "Les Griots"],
    locationName: "Haiti",
    media: [
      commonsPicture({
        fileName: "François Duvalier Presidential Portrait (1957).png",
        caption: "Presidential portrait of François Duvalier at the start of his first term, dated 22 October 1957.",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "PD-1996 (Haiti); PD-Haiti",
        creator: "Unknown photographer",
        objectDate: "1957-10-22",
      }),
      commonsPicture({
        fileName: "Les Griots.png",
        caption:
          "Cover of Les Griots, no. 2 (October–December 1938), the review of the noiriste group to which Duvalier and Lorimer Denis belonged, edited with Carl Brouard.",
        shows: "historical_document",
        identificationStatus: "secure",
        licence: "PD-scan",
        creator: "Les Griots (Carl Brouard et al.)",
        objectDate: "1938",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_nicholls_1979",
        startYear: 1957,
        endYear: 1986,
        temporalClaimType: "date_range",
        whatIsDated: "The Duvalier dictatorship (François 1957–1971, Jean-Claude 1971–1986)",
        originalDateText: "From François Duvalier's election in 1957 to Jean-Claude Duvalier's flight in February 1986",
        evidence:
          "EVIDENCE TYPE: contemporary written. Election and exile are documented. The range dates the regime; Duvalier's use of Vodou is a matter of interpretation within it.",
      }),
      claim({
        sourceKey: "haiti_hurbon_1988",
        startYear: 1986,
        startMonth: 2,
        datePrecision: "month",
        temporalClaimType: "approximate_date",
        whatIsDated: "The dechoukaj attacks on oungan and manbo",
        originalDateText: "After the fall of Jean-Claude Duvalier on 7 February 1986",
        evidence:
          "EVIDENCE TYPE: contemporary written. Press reports and Hurbon's near-contemporary analysis date the violence to the weeks after 7 February 1986. No reliable count of victims is established.",
        citations: [cite("haiti_mcalister_2002", "supports", "Discusses the 1986 violence against practitioners and its Protestant dimension.")],
      }),
    ],
  },

  // ---- Recognition and the present -----------------------------------------

  {
    slug: "haiti-vodou-legal-recognition-1987-2003",
    title: "From crime to recognised religion: the 1987 Constitution and the decree of 4 April 2003",
    summary:
      "The 1987 Constitution guaranteed freedom of religion and abrogated the 1935 decree-law against 'superstitious practices'. On 4 April 2003 a decree under President Jean-Bertrand Aristide recognised Vodou as a religion, allowing registered practitioners to perform legally valid ceremonies such as marriages and baptisms.",
    description:
      "1987. After the fall of the Duvaliers and the violence against practitioners in 1986, a new constitution was approved by referendum on 29 March 1987. Article 30 guaranteed freedom of religion and worship; Article 297 declared abrogated all laws and decrees arbitrarily restricting fundamental rights — expressly including the decree-law of 5 September 1935 on superstitious beliefs. For the first time since the colony, the practice of Vodou was not, on the face of the law, a crime. Vodou organisations' pressure is credited with Article 297's wording.\n\n" +
      "2003. A decree issued under President Jean-Bertrand Aristide, dated 4 April 2003, invited Vodou practitioners and associations to register with the Ministry of Religious Affairs and allowed those who swore an oath before a civil judge to celebrate ceremonies — marriages, baptisms, funerals — with civil effect, as clergy of other religions could. Aristide, a former Catholic priest, described Vodou as an essential part of national identity. The Catholic bishop of Port-au-Prince called the measure excessive; commentators also read it as a political move by a president under pressure.\n\n" +
      "2012. A constitutional amendment published in 2012 removed Article 297 among other changes, alarming Vodou organisations that the old prohibition might revive; officials pointed to the 2003 decree as continuing protection.\n\n" +
      "WHAT RECOGNITION DID NOT DO. It did not end stigma, Protestant or Catholic opposition, or violence; nor did it create a single Vodou hierarchy, which the religion has never had.\n\n" +
      "SIGNIFICANCE. After two and a half centuries in which colonial and Haitian law treated it as sorcery, Haitian Vodou became, in law, a religion. The parallel with Bénin's recognition of Vodun and its 10 January holiday (1996) is real and was noticed at the time, but the two histories are separate.",
    category: "religion",
    subcategory: "Recognition",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["place: saint-domingue and haiti", "practice: initiation and priesthood", "practice: catholic contact"], "law", "recognition", "1987", "2003"),
    people: ["Jean-Bertrand Aristide", "Joseph Lafontant"],
    civilisations: ["Republic of Haiti", "Ministry of Religious Affairs (Haiti)"],
    locationName: "Port-au-Prince, Haiti",
    lat: 18.543,
    lng: -72.339,
    media: [
      commonsPicture({
        fileName: "Jean-Bertrand Aristide.jpg",
        caption: "Jean-Bertrand Aristide, photographed in 2018; as president he issued the 2003 decree recognising Vodou.",
        shows: "portrait",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Commons user LLs",
        objectDate: "2018-03-19",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_constitution_1987",
        startYear: 1987,
        startMonth: 3,
        startDay: 29,
        datePrecision: "day",
        temporalClaimType: "explicit_date",
        whatIsDated: "Approval of the Constitution guaranteeing freedom of religion and abrogating the 1935 decree-law",
        originalDateText: "Constitution approved by referendum on 29 March 1987 (Articles 30 and 297)",
        evidence:
          "EVIDENCE TYPE: contemporary written. The referendum date is documented; the article content is as reported by Ramsey and the ICLRS overview.",
        citations: [
          cite("haiti_ramsey_2011", "supports", "Describes the 1935 decree-law as in force until abrogated by Article 297."),
          cite("haiti_iclrs_overview", "supports", "Summarises Article 297 and its 2012 repeal."),
        ],
      }),
      claim({
        sourceKey: "haiti_pluralism_2003",
        startYear: 2003,
        startMonth: 4,
        startDay: 4,
        datePrecision: "day",
        temporalClaimType: "explicit_date",
        whatIsDated: "The decree recognising Vodou as a religion",
        originalDateText: "Decree of 4 April 2003 under President Aristide",
        evidence:
          "EVIDENCE TYPE: contemporary written. Press reports from April 2003 describe the decree; the 4 April date is as commonly given and NEEDS SOURCE VERIFICATION against Le Moniteur.",
        citations: [cite("haiti_tampabay_2003", "supports", "A second contemporary press report of the recognition.")],
      }),
    ],
  },

  {
    slug: "knva-zantray-and-max-beauvoir",
    title: "Zantray, the KNVA and Max Beauvoir, Ati of Haitian Vodou",
    summary:
      "After 1986 practitioners organised to defend their religion, first through groups such as Zantray and Bode Nasyonal, then through the Konfederasyon Nasyonal Vodou Ayisyen (KNVA), whose leader, the biochemist-turned-oungan Max Beauvoir, took the title Ati. No body speaks for all of Vodou.",
    description:
      "THE FIRST ASSOCIATIONS. In the wake of the 1986 attacks, oungan and manbo formed civil-rights associations — Zantray, Bode Nasyonal and others — to defend practitioners, lobby the constitutional assembly and represent Vodou to the state and the press.\n\n" +
      "THE KNVA. Max Beauvoir (1936–2015), a Haitian chemist educated in the United States and France who became an oungan in the 1970s and ran a well-known peristil at Mariani near Port-au-Prince, launched a national federation in 2005, renamed in 2007 or 2008 the Konfederasyon Nasyonal Vodou Ayisyen. He was named Ati — supreme chief — in 2008 (sources differ between 2005, 2007 and 2008). The KNVA has since installed regional and diaspora clergy (gwètòde), including a ceremony in Harlem in 2017.\n\n" +
      "WHAT BEAUVOIR DID. He spoke for practitioners nationally and abroad: against mass graves for earthquake victims in 2010, against evangelical attacks (vowing 'war' after the Cité Soleil attack of February 2010, a statement he later tempered), and for Vodou's place in public life. He died on 12 September 2015.\n\n" +
      "THE LIMITS. Vodou has no pope and no central doctrine; authority lies in houses, lineages and initiations. Many practitioners never accepted the KNVA or Beauvoir as their representatives, and commentators at the time stressed that he led a faction, not 'Vodou'.\n\n" +
      "SIGNIFICANCE. The associations and the KNVA are how a decentralised religion learned to speak to a state that had recognised it: a new, contested form of religious institution, and itself part of Vodou's history.",
    category: "religion",
    subcategory: "Recognition",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["practice: initiation and priesthood", "place: saint-domingue and haiti"], "knva", "zantray", "max-beauvoir", "organisation"),
    people: ["Max Beauvoir"],
    civilisations: ["Konfederasyon Nasyonal Vodou Ayisyen (KNVA)", "Zantray", "Bode Nasyonal"],
    locationName: "Port-au-Prince (Mariani), Haiti, and the diaspora",
    media: [
      commonsPicture({
        fileName: "Swearing-in ceremony of Diaspora GwètòDe by Konfederasyon Nasyonal Vodou Ayisyen 08.jpg",
        caption:
          "The KNVA's first swearing-in of diaspora gwètòde (regional Vodou clergy), held on 25 February 2017 at the National Black Theatre, Harlem, New York.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Commons user Aliceba",
        objectDate: "2017-02-25",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_wikipedia_vodou",
        startYear: 2005,
        temporalClaimType: "explicit_date",
        whatIsDated: "Founding of the national federation that became the KNVA (as Federasyon Nasyonal Vodou Ayisyen)",
        originalDateText: "Launched by Max Beauvoir as a federation in 2005",
        evidence:
          "EVIDENCE TYPE: later historical account. Reported by Wikipedia (citing press sources) and seen only in summary; NEEDS SOURCE VERIFICATION.",
      }),
      claim({
        sourceKey: "haiti_wikipedia_vodou",
        startYear: 2008,
        temporalClaimType: "explicit_date",
        whatIsDated: "Renaming as KNVA and Beauvoir's title of Ati",
        originalDateText: "Renamed Konfederasyon Nasyonal Vodou Ayisyen, and Beauvoir named Ati, in 2008",
        evidence:
          "EVIDENCE TYPE: later historical account. Obituaries and Wikipedia give 2008; an Italian magazine of 2014 dates the renaming to 2007. Recorded as the commonest date; the disagreement is unresolved.",
        citations: [cite("haiti_afp_cite_soleil_2010", "context", "Shows Beauvoir acting as the KNVA's public voice in 2010.")],
      }),
      claim({
        sourceKey: "haiti_mcalister_2002",
        startYear: 1986,
        endYear: 1995,
        isApproximate: true,
        datePrecision: "decade",
        temporalClaimType: "estimated_range",
        whatIsDated: "Formation of the post-Duvalier defence associations (Zantray, Bode Nasyonal)",
        originalDateText: "Formed after 1986, into the early 1990s",
        evidence: "EVIDENCE TYPE: later historical account. Scholarly accounts place the associations in the post-1986 period; founding years NEED SOURCE VERIFICATION.",
      }),
    ],
  },

  {
    slug: "haitian-vodou-in-the-diaspora-mama-lola",
    title: "Vodou in the diaspora: Brooklyn, Miami, Montreal — and 'Mama Lola' (1991)",
    summary:
      "Migration since the 1950s, and especially after 1960, carried Vodou to New York, Miami, Montreal, Paris and beyond. Karen McCarthy Brown's 'Mama Lola' (1991), the portrait of a Brooklyn manbo, became the best-known account of Vodou as a living religion of the diaspora.",
    description:
      "MIGRATION. Haitians left in large numbers from the Duvalier years onward — professionals in the 1960s, then working people and 'boat people' in the 1970s–80s, and again after 1991 and 2010. Vodou went with them: temples in apartments and basements of Brooklyn and Queens, botánicas and peristil in Miami's Little Haiti, houses in Montreal and Paris, and ceremonies that link these cities with home villages.\n\n" +
      "MAMA LOLA. Marie Thérèse Alourdes Macena Margaux ('Mama Lola'), born in Haiti in the 1930s and settled in Brooklyn, was a manbo who served clients and a spiritual family across New York. The anthropologist Karen McCarthy Brown worked with her from 1978 and became her initiate; Mama Lola: A Vodou Priestess in Brooklyn (1991) interleaves the family's history with fictionalised ancestral stories and detailed accounts of ritual. Brown's central argument is that the lwa are mirrors of social relationships — Ezili Dantò the fierce single mother, Ogou the soldier torn between duty and anger, Gede the irreverent truth-teller — and that healing in Vodou is the healing of relationships.\n\n" +
      "DIASPORA PRACTICE. Diaspora Vodou has adapted: shorter ceremonies, rented spaces, recorded music, pilgrimages to Our Lady of Mount Carmel in East Harlem in July as a northern Sodo, and constant travel to Haiti for initiation. Elizabeth McAlister has traced how Rara and Vodou music became part of Haitian-American identity.\n\n" +
      "SIGNIFICANCE. Haitian Vodou is now a transnational religion. Mama Lola matters because it made a practitioner, not a stereotype, the centre of the story, and because it described the religion as it is lived in a modern city — a model followed by much later scholarship.",
    category: "religion",
    subcategory: "Diaspora",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["deity: ezili and water spirits", "deity: gu and ogou", "deity: gede and the dead", "practice: healing and herbal knowledge"], "diaspora", "new-york", "mama-lola"),
    people: ["Marie Thérèse Alourdes Macena Margaux (Mama Lola)", "Karen McCarthy Brown", "Frisner Augustin", "Elizabeth McAlister"],
    civilisations: ["Haitian diaspora", "Haitian Americans"],
    locationName: "Brooklyn, New York, and the Haitian diaspora",
    lat: 40.65,
    lng: -73.95,
    media: [PIC_FRISNER],
    claims: [
      claim({
        sourceKey: "haiti_brown_1991",
        startYear: 1991,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of Mama Lola",
        originalDateText: "Mama Lola: A Vodou Priestess in Brooklyn, 1991",
        evidence: "EVIDENCE TYPE: contemporary written. The imprint dates the book, based on fieldwork from 1978; an updated edition followed in 2001.",
      }),
      claim({
        sourceKey: "haiti_mcalister_2002",
        startYear: 1957,
        endYear: 2010,
        isApproximate: true,
        datePrecision: "decade",
        temporalClaimType: "estimated_range",
        whatIsDated: "The main waves of Haitian emigration that carried Vodou abroad",
        originalDateText: "From the Duvalier years to the post-earthquake period",
        evidence: "EVIDENCE TYPE: modern interpretation. Migration history dates the waves; the spread of practice can only be inferred from them and from ethnography.",
      }),
    ],
  },

  {
    slug: "haiti-earthquake-2010-and-vodou",
    title: "The 2010 earthquake: mourning, blame, and attacks on Vodou practitioners",
    summary:
      "The earthquake of 12 January 2010 killed tens of thousands in and around Port-au-Prince. Some preachers blamed Vodou, and in February 2010 a crowd stoned a Vodou memorial ceremony in Cité Soleil; practitioners also mourned the dead buried without rites in mass graves.",
    description:
      "THE DISASTER. A magnitude-7.0 earthquake struck near Léogâne on 12 January 2010, destroying much of Port-au-Prince, including the National Palace, the cathedral and many ounfò. Death-toll estimates range very widely, from about 100,000 to the Haitian government's figure of over 300,000.\n\n" +
      "THE DEAD. Many victims were buried quickly in mass graves outside the city. For Vodou practitioners this meant the dead were not given the rites — including the desounen that separates the person's spiritual components from the body — that make them proper ancestors. Max Beauvoir and the KNVA protested, and ceremonies were held to address the dead collectively.\n\n" +
      "BLAME AND VIOLENCE. The day after the earthquake, Pat Robertson's 'pact with the devil' remark linked the disaster to Bwa Kayiman, and some Haitian Protestant preachers taught that Vodou had caused it. On a Tuesday in late February 2010, a memorial ceremony for earthquake victims in Cité Soleil was attacked by a crowd throwing stones, reportedly urged on by a pastor; aftershocks were blamed on the practitioners. Felix Germain and others document a wider pattern of hostility, and the role of missions linked to relief.\n\n" +
      "RECOVERY. The Gede festival of November 2010 was held amid the ruins; Bawon Samdi's cross in the national cemetery, destroyed by the quake, was rebuilt for it. Later memorials passed peacefully.\n\n" +
      "SIGNIFICANCE. The earthquake showed both the depth of Vodou's place in how Haitians care for the dead and the persistence, even after legal recognition, of the old equation between Vodou and evil.",
    category: "religion",
    subcategory: "Present",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(["deity: gede and the dead", "practice: ancestors", "place: saint-domingue and haiti"], "earthquake", "2010", "persecution"),
    people: ["Max Beauvoir", "Pat Robertson"],
    civilisations: ["Haiti", "Konfederasyon Nasyonal Vodou Ayisyen (KNVA)"],
    locationName: "Port-au-Prince and Cité Soleil, Haiti",
    lat: 18.543,
    lng: -72.339,
    media: [
      commonsPicture({
        fileName: "CrossOfBaronSamedi.jpg",
        caption:
          "Bawon Samdi's cross in the national cemetery of Port-au-Prince, photographed on 2 November 2010 during the Gede festival; destroyed by the earthquake, it was rebuilt before the holidays.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY-SA 3.0; GFDL",
        creator: "Andrew Welch",
        objectDate: "2010-11-02",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_germain_2011",
        startYear: 2010,
        startMonth: 1,
        startDay: 12,
        datePrecision: "day",
        temporalClaimType: "explicit_date",
        whatIsDated: "The earthquake",
        originalDateText: "12 January 2010, shortly before 5 p.m.",
        evidence: "EVIDENCE TYPE: contemporary written. Seismological and press records date the earthquake exactly.",
      }),
      claim({
        sourceKey: "haiti_afp_cite_soleil_2010",
        startYear: 2010,
        startMonth: 2,
        datePrecision: "month",
        temporalClaimType: "approximate_date",
        whatIsDated: "The attack on the Vodou memorial ceremony in Cité Soleil",
        originalDateText: "A Tuesday in late February 2010 (reported c. 25 February)",
        evidence:
          "EVIDENCE TYPE: contemporary written. Wire reports dated about 25 February 2010 describe the attack 'on Tuesday'; the day (probably 23 February) NEEDS SOURCE VERIFICATION.",
        citations: [cite("haiti_germain_2011", "supports", "Documents post-earthquake hostility to Vodou practitioners.")],
      }),
    ],
  },

  {
    slug: "sodo-and-plaine-du-nord-pilgrimages",
    title: "Sodo (Saut-d'Eau) and Plaine-du-Nord: the July pilgrimages to the Virgin, Ezili, Saint James and Ogou",
    summary:
      "Every July tens of thousands of Haitians travel to the waterfalls of Saut-d'Eau (Sodo), where the Virgin is said to have appeared on a palm tree, and to the mud pool of Saint James at Plaine-du-Nord, near Bwa Kayiman — Catholic feasts served at the same time as feasts of Ezili and Ogou.",
    description:
      "SODO. At Ville-Bonheur and the falls of Saut-d'Eau, near Mirebalais in the Central Plateau, a tradition tells of an apparition of the Virgin on a palm tree in the nineteenth century: dates of 1841 and 1849 are both given in different accounts, and an earthquake of 1842 is said to have reshaped the stream into the falls. The church at Ville-Bonheur celebrates Our Lady of Mount Carmel on 16 July; pilgrims attend mass, then bathe under the falls, tie ribbons to trees, and are possessed by Ezili, Danbala and other water lwa. Catholic and Vodou devotion run side by side, sometimes uneasily: priests have at times cut sacred trees.\n\n" +
      "PLAINE-DU-NORD. On 24–25 July, around the feast of Saint James the Greater (Sen Jak Majè, identified with Ogou), pilgrims gather at Plaine-du-Nord, a few kilometres from the traditional site of Bwa Kayiman. At the twou Sen Jak (Saint James's hole), a mud pool near the church, devotees in red and blue bathe, make offerings, sacrifice bulls and are mounted by Ogou; initiates are presented. On the following day the pilgrimage moves to Limonade for Saint Anne.\n\n" +
      "WHAT IS DATED AND WHAT IS NOT. The feast days are fixed by the Catholic calendar; the apparition dates are traditions recorded later; the age of the Plaine-du-Nord pilgrimage is not documented.\n\n" +
      "SIGNIFICANCE. These pilgrimages are where the 'symbiosis' of Catholicism and Vodou is most visible: the same people, at the same feast, serving the Virgin and Ezili, Saint James and Ogou. They also tie Vodou to sacred geography — water, trees, mud, the land of Bwa Kayiman — in a way that echoes, without copying, West African shrines of water and earth.",
    category: "religion",
    subcategory: "Pilgrimage",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(
      ["deity: ezili and water spirits", "deity: gu and ogou", "practice: catholic contact", "practice: sacred trees and forests", "practice: possession", "place: saint-domingue and haiti"],
      "pilgrimage",
      "saut-d-eau",
      "plaine-du-nord"
    ),
    people: ["Our Lady of Mount Carmel (Virgin Mary)", "Saint James the Greater"],
    civilisations: ["Haitian Vodou", "Catholic Church in Haiti"],
    locationName: "Saut-d'Eau / Ville-Bonheur (Centre) and Plaine-du-Nord (Nord), Haiti",
    lat: 18.817,
    lng: -72.2,
    media: [
      commonsPicture({
        fileName: "Haiti Saut-d'Eau.JPG",
        caption: "The waterfall at Saut-d'Eau, photographed on 28 August 2010, a month after the pilgrimage season.",
        shows: "site",
        identificationStatus: "secure",
        licence: "Public domain (PD-self)",
        creator: "Commons user Jstplace",
        objectDate: "2010-08-28",
      }),
      commonsPicture({
        fileName: "Saut d'eau. Haiti.jpg",
        caption: "Saut-d'Eau near Mirebalais, photographed on 24 August 2018.",
        shows: "site",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Commons user La métisse Joassaint",
        objectDate: "2018-08-24",
      }),
      PIC_VEVE_OGOU,
    ],
    claims: [
      claim({
        sourceKey: "haiti_wrsp_saut_deau",
        startYear: 1841,
        temporalClaimType: "traditional_date",
        chronology: "religious",
        datingMethod: "oral_tradition",
        whatIsDated: "The apparition of the Virgin at Saut-d'Eau (one traditional date)",
        originalDateText: "Apparition on a palm tree near Ville-Bonheur, 1841",
        evidence:
          "EVIDENCE TYPE: religious tradition. The WRSP timeline gives 1841, with the falls reshaped by the 1842 earthquake. It dates a devotional tradition recorded later, not a documented event.",
        citations: [cite("haiti_desmangles_1992", "context", "Describes the Sodo pilgrimage and its Catholic–Vodou character.")],
      }),
      claim({
        sourceKey: "haiti_wikipedia_vodou",
        startYear: 1849,
        isApproximate: true,
        temporalClaimType: "traditional_date",
        chronology: "religious",
        datingMethod: "oral_tradition",
        whatIsDated: "The apparition of the Virgin at Saut-d'Eau (a second traditional date)",
        originalDateText: "Apparition in the 1840s, often given as 1849",
        evidence:
          "EVIDENCE TYPE: religious tradition. Wikipedia (citing Desmangles and McAlister) places the apparition in the 1840s; 1849 is a commonly repeated popular date that NEEDS SOURCE VERIFICATION.",
      }),
      claim({
        sourceKey: "haiti_cosentino_1995",
        datePrecision: "year",
        temporalClaimType: "cyclic",
        chronology: "religious",
        whatIsDated: "The annual Plaine-du-Nord pilgrimage for Saint James / Ogou",
        originalDateText: "Each year on 24–25 July, around the feast of Saint James the Greater",
        evidence:
          "EVIDENCE TYPE: religious tradition. The date is fixed by the Catholic feast of 25 July and observed annually. When the pilgrimage began is not documented.",
      }),
    ],
  },

  {
    slug: "souvenance-rada-festival",
    title: "Lakou Souvenans: the Rada festival near Gonaïves",
    summary:
      "At Souvenance (Souvenans), a lakou in the Artibonite outside Gonaïves, a week-long festival in the Easter season serves the Rada lwa in rites that the community itself calls Dahomean ('Ginen'), one of the most important Rada centres in Haiti.",
    description:
      "THE PLACE. A lakou is a family compound and its shared spiritual estate: houses, the ounfò, sacred trees, the graves of ancestors, and the lwa inherited with the land. Lakou Souvenans, near Gonaïves, is one of the great 'mother' lakou of Haitian Vodou, together with Soukri (Kongo rites) and Badjo (Nago rites) in the same region.\n\n" +
      "THE FESTIVAL. Each year, in the Easter season (commonly from Good Friday for about a week), thousands gather at Souvenance. Ceremonies follow the Rada order: songs and drums for Legba first, then for the other Rada lwa — Danbala, Ayida Wedo, Agwe, Ezili, Ogou and the lwa specific to the lakou — with animal offerings, processions to the sacred trees and the stream, possession, and ritual bathing in mud and water. Participants describe the rites as those of 'Ginen' (Africa) and 'Dahomey', and the lakou is commonly said to preserve Arada traditions with particular fidelity.\n\n" +
      "WHAT IS NOT ESTABLISHED. The lakou's founding date and founding family history are matters of oral tradition (a founding in the early nineteenth century is sometimes stated) and were not verified here. 'Dahomean' here is a Haitian ritual category — a claim of lineage the community makes — as well as a pointer to a likely historical connection; it does not mean the rites are unchanged Fon practice.\n\n" +
      "SIGNIFICANCE. Souvenance is where the Rada nanchon, with its explicit claim to descend from Allada and Dahomey, is served on the largest scale today. It is the best place in Haiti to see what 'African' means inside Vodou: memory, lineage and ritual exactness, in a Haitian institution.",
    category: "religion",
    subcategory: "Pilgrimage",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: tags(
      ["place: saint-domingue and haiti", "deity: legba", "practice: possession", "practice: drumming and song", "practice: ancestors", "place: abomey", "place: allada"],
      "souvenance",
      "lakou",
      "rada"
    ),
    civilisations: ["Lakou Souvenans", "Haitian Vodou (Rada rite)"],
    locationName: "Lakou Souvenans, near Gonaïves, Artibonite, Haiti",
    media: [
      commonsPicture({
        fileName: "Dancing for the Gods.jpg",
        caption: "Dancing for the lwa at a ceremony at La Souvenance, Gonaïves, photographed on 3 April 2010, the eve of Easter.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Commons user Nlecoro",
        objectDate: "2010-04-03",
      }),
      commonsPicture({
        fileName: "Woman in transe.jpg",
        caption: "A participant in trance (possession) during a ceremony at La Souvenance, Gonaïves, photographed on 4 April 2010.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Commons user Nlecoro",
        objectDate: "2010-04-04",
      }),
      commonsPicture({
        fileName: "Cleaning the soul.jpg",
        caption: "After the sacrifice, participants wash in a mud pool at La Souvenance, Gonaïves, photographed on 4 April 2010.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Commons user Nlecoro",
        objectDate: "2010-04-04",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_wikipedia_vodou",
        datePrecision: "year",
        temporalClaimType: "cyclic",
        chronology: "religious",
        whatIsDated: "The annual Souvenance festival",
        originalDateText: "Held every year in the Easter season, for about a week",
        evidence:
          "EVIDENCE TYPE: religious tradition. The festival's place in the calendar (Easter season) is reported by visitors and in the photographs dated Easter 2010; the exact span NEEDS SOURCE VERIFICATION.",
        citations: [cite("haiti_mcalister_2002", "context", "Discusses the great lakou and the Rada–Kongo–Nago geography of the Artibonite.")],
      }),
      claim({
        sourceKey: null,
        temporalClaimType: "unknown",
        chronology: "oral_tradition",
        datingMethod: "oral_tradition",
        whatIsDated: "The founding of the lakou",
        originalDateText: "Founding not documented; carried by the community's oral tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. Founding dates circulate (early nineteenth century is sometimes said) but none was verified in this session.",
        citations: [cite("haiti_metraux_1958", "context", "Describes the lakou as the setting of family-inherited lwa.")],
      }),
    ],
  },

  // ---- The religion: beings, places, people, practices ---------------------

  {
    slug: "bondye-lwa-and-nanchon",
    title: "Bondye, the lwa and the nanchon: Rada, Petwo and Gede",
    summary:
      "Haitian Vodou recognises a distant creator, Bondye ('Good God'), and serves many lwa — spirits — who are organised into nanchon ('nations'), above all the 'cool' Rada and the 'hot' Petwo, with the Gede as the family of the dead.",
    description:
      "BONDYE. Practitioners say Bondye (from French bon Dieu) created the world and is ultimately responsible for everything, but is remote: one does not serve Bondye with offerings or possession. Bondye is commonly identified with the Christian God, which is one reason many practitioners consider themselves Catholics.\n\n" +
      "THE LWA. The lwa (also called mistè, zanj, sen or envizib) are the spirits who are served: they receive songs, drums, food, drink and animals, they possess their servitors (sèvitè), and they give help, protection and demands in return. Some are known throughout Haiti; others belong to a family, a lakou or a single temple. Lwa are inherited with land and lineage, acquired through initiation, or come uninvited.\n\n" +
      "THE NANCHON. The lwa are grouped into nations whose names record origins: RADA (from Allada) — Legba, Danbala and Ayida Wedo, Agwe, Ezili Freda, Loko, Ayizan and others — described as dous ('sweet', cool), served with the three Rada drums and the asson; PETWO (Petro), strongly shaped by Kongo ritual and perhaps by the colonial 'Dom Pèdre' dance, described as cho ('hot'), forceful, fast and morally ambiguous, served with different drums, whips and fire — Ezili Dantò, the Petwo Legba and Ogou forms, Simbi and many more; and smaller nations — Nago (Yoruba), Kongo, Ibo, Wangol and others. Many lwa are served 'in two waters', in both Rada and Petwo forms. The GEDE, led by Bawon Samdi and Manman Brijit, are usually treated as a family of the dead rather than a nation.\n\n" +
      "SIGNIFICANCE. The nanchon are the religion's own history of its African origins, written into its structure: a ritual map of Allada, Kongo, Yorubaland and Igboland. They show that Haitian Vodou did not reproduce one African religion but organised many — and that it kept their names as a memory of where people came from.",
    category: "religion",
    subcategory: "Beliefs",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    tags: tags(
      ["deity: bondye", "deity: lwa", "deity: gede and the dead", "place: allada", "practice: catholic contact", "place: saint-domingue and haiti"],
      "nanchon",
      "rada",
      "petwo"
    ),
    people: ["Bondye", "Papa Legba", "Danbala", "Ezili Freda", "Ezili Dantò", "Bawon Samdi"],
    civilisations: ["Haitian Vodou", "Rada nanchon", "Petwo nanchon", "Kongo"],
    locationName: "Haiti and the Haitian diaspora",
    media: [
      PIC_ALTAR_2010,
      commonsPicture({
        fileName: "Trop Pou Te Haitian Vodou banners.jpg",
        caption:
          "Haitian Vodou sequinned banners (drapo), the front one reading 'Trop Pou Te' in Kreyòl, on exhibit at the Ethnological Museum of Berlin, photographed in 2010. Drapo carry the vèvè or image of a lwa and are paraded at the start of ceremonies.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "CC BY-SA 2.0",
        creator: "Thom Quine",
        institution: "Ethnologisches Museum, Berlin",
        objectDate: "photographed 2010-08-11",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_metraux_1958",
        temporalClaimType: "unknown",
        chronology: "religious",
        datingMethod: "other",
        whatIsDated: "When the nanchon system took its present form",
        originalDateText: "Not datable; the Rada–Petwo organisation is attested by the mid-twentieth century and partly prefigured in 1797",
        evidence:
          "EVIDENCE TYPE: religious tradition. The nanchon are described by Métraux, Deren and others from 1940s–50s fieldwork; Moreau's 1797 'Vaudoux' and 'Dom Pèdre' suggest two rites already existed. Their consolidation is not datable.",
        citations: [
          cite("haiti_apter_2002", "supports", "Analyses the nanchon names as a ritual memory of African origins."),
          cite("haiti_wikipedia_vodou", "context", "Summarises the characters of Rada, Petwo and Gede with citations to Métraux, McAlister and Desmangles."),
        ],
      }),
    ],
  },

  {
    slug: "ounfo-peristil-oungan-manbo",
    title: "The ounfò and its people: peristil, poto mitan, oungan, manbo and the asson",
    summary:
      "A Vodou temple (ounfò) centres on a roofed dance space, the peristil, around a central post, the poto mitan, by which the lwa descend. It is led by an oungan (priest) or manbo (priestess), assisted by initiates (ounsi), with the asson rattle as the emblem of priestly authority in the Rada lineage.",
    description:
      "THE SPACE. An ounfò (hounfort, from Fon hun-xɔ, 'house of the vodun') typically includes the PERISTIL, a roofed, often open-sided court where ceremonies take place; the POTO MITAN, the central post, painted and decorated, which practitioners describe as the road of the lwa and around which vèvè are drawn and dancers turn; and one or more BADJI (inner rooms) holding altars (pe) with the lwa's objects, bottles, govi (clay vessels for spirits), images of saints and drapo. Outside stand sacred trees, a cross for the Gede and sometimes a basin for Danbala.\n\n" +
      "THE PEOPLE. An OUNGAN (priest) or MANBO (priestess) heads the house as spiritual parent of its initiates. Women are as fully priests as men; many of the best-known houses are led by manbo. The OUNSI are initiated servitors who sing, dance and are possessed; the OUNGENIKON leads the songs; the LAPLAS carries the sword and flags. Rank comes through the stages of initiation (kanzo): ounsi bosal, ounsi kanzo, si pwen, and finally asogwe — the grade at which a priest is said to 'take the asson'.\n\n" +
      "THE ASSON. The asson, a calabash rattle covered with a net of beads or snake vertebrae, with a small bell, is used to call and direct the lwa and to lead the drums in Rada ceremonies; its possession signifies the highest initiation in the Rada lineage. Petwo and Kongo houses use other emblems, such as the tcha-tcha rattle.\n\n" +
      "SIGNIFICANCE. The ounfò is the institution that makes Vodou a religion of communities rather than of individuals: a spiritual family with its own lineage, house and authority. Its names — ounfò, oungan (from Fon hùngán), ounsi (hùnsí) — are among the clearest traces of Gbe religious vocabulary in Haiti.",
    category: "religion",
    subcategory: "Practice",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    tags: tags(["practice: initiation and priesthood", "practice: drumming and song", "deity: lwa"], "ounfo", "peristil", "poto-mitan", "asson", "manbo"),
    people: ["Oungan", "Manbo", "Ounsi"],
    civilisations: ["Haitian Vodou"],
    locationName: "Haiti and the Haitian diaspora",
    media: [
      PIC_ASSON,
      commonsPicture({
        fileName: "Houngan ceremony ritual.jpg",
        caption: "An oungan (Vodou priest) at a ceremony in Haiti, photographed by Anthony Karen on 21 June 2011.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "CC BY 4.0",
        creator: "Anthony Karen",
        objectDate: "2011-06-21",
      }),
      commonsPicture({
        fileName: "Vodou mirror museum exhibit.jpg",
        caption:
          "A Vodou mirror object on display at the Ethnological Museum of Berlin, photographed in 2010; the museum label describes mirrors in Vodou as a doorway to the world of the dead. A museum object out of its ounfò context.",
        shows: "artefact",
        identificationStatus: "probable",
        licence: "CC BY-SA 2.0",
        creator: "Thom Quine (quinet)",
        institution: "Ethnologisches Museum, Berlin",
        objectDate: "photographed 2010-08-11",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_metraux_1958",
        startYear: 1958,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Systematic ethnographic description of the ounfò, its personnel and grades",
        originalDateText: "Described systematically in Métraux's Le Vaudou haïtien, 1958",
        evidence:
          "EVIDENCE TYPE: contemporary written. Métraux's ethnography dates a full description, not the institution, which Moreau's 'king and queen' of the 1780s already partly prefigure.",
        citations: [
          cite("haiti_deren_1953", "supports", "Describes the peristil, poto mitan and roles of oungan, manbo and ounsi."),
          cite("haiti_fleurant_1996", "supports", "Describes the asson and its ritual use in the Rada rite."),
        ],
      }),
    ],
  },

  {
    slug: "veve-haitian-sacred-drawings",
    title: "Vèvè: drawing the lwa on the ground",
    summary:
      "Vèvè are symbolic designs traced on the ground with cornmeal, flour, ash or coffee at the start of a ceremony; each lwa has its own, and the drawing both invites and represents the spirit.",
    description:
      "WHAT THEY ARE. A vèvè is a ritual drawing, traced freehand by the oungan or manbo by letting powder fall from the fingers, usually around the poto mitan or at the threshold. Each lwa has characteristic vèvè: crossed lines and a cane or key for Legba; paired serpents for Danbala and Ayida Wedo; a heart for Ezili Freda; a heart pierced with a dagger for Ezili Dantò; a sword or flag for Ogou; a boat for Agwe; a cross and coffin for Bawon Samdi; palm fronds for Ayizan. They are saluted, given offerings, and danced over and effaced in the course of the ceremony. The same designs are sewn on drapo and forged in cut-metal art.\n\n" +
      "WHERE THEY COME FROM. The origins are debated. Scholars point to Kongo cosmograms and ground-drawings, to Fon and Yoruba ritual marks, to European grimoire seals and Catholic emblems, and possibly to Taíno designs; the vèvè as a developed system is a Haitian creation. Milo Rigaud's Vè-Vè: diagrammes rituels du voudou (1974) is the best-known collection, though its esoteric interpretations are his own.\n\n" +
      "VARIATION. There is no canonical set. Vèvè differ between houses, regions and lineages, and between Rada and Petwo services of the same lwa; published versions, including those shown here, are single examples.\n\n" +
      "SIGNIFICANCE. Vèvè are the most recognisable visual sign of Haitian Vodou and a meeting-point of its sources: African graphic traditions, European magical seals and Catholic symbols, combined into a ritual art that is made to be destroyed. They also became a national emblem, used in Haitian art and design far beyond the ounfò.",
    category: "religion",
    subcategory: "Practice",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    tags: tags(["practice: veve and sacred art", "deity: legba", "deity: dan and aido-hwedo", "deity: gede and the dead", "deity: ezili and water spirits"], "veve", "sacred-art", "milo-rigaud"),
    people: ["Milo Rigaud", "Papa Legba", "Danbala", "Bawon Samdi", "Manman Brijit"],
    civilisations: ["Haitian Vodou", "Kongo"],
    locationName: "Haiti",
    media: [
      PIC_VEVE_LEGBA,
      commonsPicture({
        fileName: "VeveBrigitte.svg",
        caption:
          "A vèvè for Manman Brijit, consort of Bawon Samdi among the Gede, redrawn and vectorised by a Commons contributor in 2005–2007 from published examples. A modern drawing of one form.",
        shows: "diagram",
        identificationStatus: "probable",
        licence: "PD-Art (as stated on the file page)",
        creator: "Commons user Chrkl",
      }),
      commonsPicture({
        fileName: "Vevé Ezili Dantor.jpg",
        caption: "A cut-metal work reproducing the vèvè of Ezili Dantò (a heart pierced by a dagger), photographed in 2014: vèvè as Haitian metal art, outside ritual use.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Commons user Oficinalis",
        objectDate: "photographed 2014-11-15",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_metraux_1958",
        temporalClaimType: "unknown",
        chronology: "religious",
        datingMethod: "other",
        whatIsDated: "When vèvè came into use",
        originalDateText: "Origin not datable; vèvè are described in twentieth-century ethnography",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Vèvè are described by Métraux, Deren and Rigaud from mid-twentieth-century practice; no colonial source securely describes them. Their sources are inferred by comparison and are disputed.",
        citations: [cite("haiti_cosentino_1995", "supports", "Discusses vèvè, drapo and their visual sources.")],
      }),
    ],
  },

  {
    slug: "haitian-vodou-drums-and-possession",
    title: "Drums, song and possession: how the lwa 'mount their horses'",
    summary:
      "In Haitian Vodou the lwa are called by drums, songs and dance and arrive by possessing participants, who are said to be 'mounted' like a horse (chwal). The Rada rite uses a battery of three drums and an iron bell; the Petwo rite its own drums and rhythms.",
    description:
      "THE MUSIC. A ceremony moves through a fixed order of songs and rhythms, beginning with Legba to open the gate, then the other lwa in turn. The RADA battery has three drums played with sticks and hands — the large MANMAN, the SEGON and the small BOULA — with the OGAN, an iron bell or hoe-blade struck with a rod, keeping time, and the asson directing. PETWO and Kongo rites use other, typically two-headed or rope-tuned drums, played with the hands, with sharp, fast rhythms, whistles and whips. The oungenikon leads call-and-response songs in Kreyòl and in langaj, a ritual language with African words.\n\n" +
      "POSSESSION. When a lwa arrives it 'mounts' a person, its CHWAL (horse); the person's own consciousness, practitioners say, is displaced, and they do not remember what the lwa did. The lwa is recognised by its behaviour — Danbala hisses and climbs, Ogou demands rum and brandishes a machete, Gede jokes and smokes — and is dressed, greeted, consulted and fed. Possession is ritually controlled: it is expected in initiates, managed by the oungan or manbo, and ended when the lwa leaves.\n\n" +
      "WHAT IS OBSERVED, AND WHAT IS CLAIMED. Observers since Moreau (1797) have described trance in Vodou ceremonies; ethnographers from Herskovits to Deren and Brown describe its social forms. That participants enter altered states with characteristic behaviours under drumming is observable; that a lwa is present is the practitioners' account; that supernatural causation is involved is not empirically established. All three statements are recorded here as such.\n\n" +
      "SIGNIFICANCE. Possession is the centre of Vodou worship: the moment at which the lwa are present among the living and speak. Drums are the means. Together they explain why prohibitions so often targeted drums, and why Haitian music and dance carry so much of the religion.",
    category: "religion",
    subcategory: "Practice",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    tags: tags(["practice: possession", "practice: drumming and song", "deity: lwa", "deity: legba"], "drums", "possession", "ritual-music"),
    people: ["Gerdès Fleurant", "Maya Deren"],
    civilisations: ["Haitian Vodou"],
    locationName: "Haiti and the Haitian diaspora",
    media: [
      commonsPicture({
        fileName: "Antique Haitian Vodou ceremonial drum.jpg",
        caption: "A historic Haitian Vodou ceremonial drum on exhibit at the Ethnological Museum of Berlin, photographed on 11 August 2010; its date of manufacture is not stated.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "CC BY-SA 2.0",
        creator: "Thom Quine",
        institution: "Ethnologisches Museum, Berlin",
        objectDate: "photographed 2010-08-11",
      }),
      commonsPicture({
        fileName: "Tambor vudú MNA.jpg",
        caption: "A Haitian Vodou ceremonial drum in the Museo Nacional de Antropología, Madrid (CE1193); date of manufacture not stated.",
        shows: "museum_specimen",
        identificationStatus: "secure",
        licence: "Attribution (as stated on the file page)",
        institution: "Museo Nacional de Antropología, Madrid",
        accessionNumber: "CE1193",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_moreau_description_1797",
        startYear: 1797,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Earliest substantial written description of trance and dance in a Vaudoux assembly",
        originalDateText: "Trance and dance described by Moreau de Saint-Méry, 1797",
        evidence:
          "EVIDENCE TYPE: contemporary written. Moreau's account records trance and dancing in the 1780s. It is the earliest substantial description, not the origin of possession practice, which participants brought from Africa.",
        citations: [
          cite("haiti_fleurant_1996", "supports", "Describes the Rada drum battery and song order."),
          cite("haiti_deren_1953", "supports", "Describes possession as the 'riding' of the chwal by the lwa."),
        ],
      }),
    ],
  },

  {
    slug: "danbala-and-ayida-wedo",
    title: "Danbala and Ayida Wedo: the serpent and the rainbow",
    summary:
      "Danbala Wedo, the white serpent, oldest and purest of the Rada lwa, and his wife Ayida Wedo, the rainbow, carry the name and the serpent of the Hueda kingdom of Ouidah into Haitian Vodou.",
    description:
      "WHO THEY ARE. DANBALA (Damballah) Wedo is a serpent lwa, ancient, gentle and silent, associated with water, fertility and cosmic continuity. He does not speak when he possesses: his horse hisses, writhes on the ground and climbs the poto mitan or a tree. He is served in white, with eggs, white rice, milk and orgeat, and a basin of water. AYIDA WEDO, the rainbow, is his consort; the pair are often drawn as two serpents in their vèvè. Danbala is commonly associated with Saint Patrick, shown driving the snakes from Ireland, and sometimes with Moses and his serpent staff.\n\n" +
      "THE NAMES. 'Wedo' is generally taken to derive from Hueda (Whydah, Ouidah), the coastal kingdom famous in the seventeenth and eighteenth centuries for its sacred pythons (Dangbe). 'Danbala' is related to Dan, the Gbe serpent vodun, and 'Ayida' to Aido-Hwedo, the rainbow-serpent of Fon cosmology. Moreau de Saint-Méry's 'Vaudoux' of the 1780s already centred on a serpent in a box. These are among the most specific links between Haitian Vodou and the Bight of Benin.\n\n" +
      "WHAT CHANGED. In Haiti there are no temple pythons; the serpent is a lwa who comes in possession, not a living animal kept and protected. Danbala's whiteness and purity, and his association with Saint Patrick, belong to Haitian Catholic contact; his place at the head of the Rada lwa reflects Haitian ritual order.\n\n" +
      "SIGNIFICANCE. Danbala and Ayida Wedo show transmission at its clearest — names, the serpent, the rainbow, the Hueda link — and transformation at the same time. The benin-vodun records on Dan and on the Temple of Pythons are the other half of this story.",
    category: "religion",
    subcategory: "The lwa",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    tags: tags(["deity: dan and aido-hwedo", "practice: serpent veneration", "deity: lwa", "place: ouidah", "practice: catholic contact"], "danbala", "ayida-wedo", "rada"),
    people: ["Danbala Wedo", "Ayida Wedo", "Saint Patrick"],
    civilisations: ["Haitian Vodou (Rada)", "Hueda (Ouidah)"],
    locationName: "Haiti",
    media: [
      PIC_VEVE_DANBALA,
      commonsPicture({
        fileName: "Damballah La Flambeau.jpg",
        caption: "Hector Hyppolite, 'Damballah La Flambeau' (Danbala the torch), painted between 1945 and 1948. A later artwork by an oungan-painter.",
        shows: "later_artwork",
        identificationStatus: "secure",
        licence: "PD-Haiti",
        creator: "Hector Hyppolite",
        objectDate: "1945–1948",
      }),
      commonsPicture({
        fileName: "Collectie Nationaal Museum van Wereldculturen AM-670-9 Dambala Haiti.jpg",
        caption:
          "A Haitian Vodou ceremonial flag (drapo) catalogued as 'Dambala', from a collection formed by the Holy Ghost Fathers (Congregatie van de Heilige Geest), now in the Nationaal Museum van Wereldculturen (AM-670-9). Its date is not stated.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "PD-anon (as stated on the file page)",
        institution: "Nationaal Museum van Wereldculturen",
        accessionNumber: "AM-670-9",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_moreau_description_1797",
        startYear: 1797,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Earliest description of serpent veneration in Saint-Domingue",
        originalDateText: "The serpent of the 'Vaudoux', described by Moreau de Saint-Méry, 1797",
        evidence:
          "EVIDENCE TYPE: contemporary written. Moreau describes a serpent at the centre of the cult in the 1780s. This is the earliest Haitian evidence for serpent veneration; the name Danbala Wedo is recorded later, in nineteenth- and twentieth-century sources.",
        citations: [
          cite("haiti_metraux_1958", "supports", "Describes Danbala and Ayida Wedo and their service."),
          cite("haiti_apter_2002", "supports", "Discusses Wedo/Hueda and other Dahomean names in the Rada pantheon."),
        ],
      }),
    ],
  },

  {
    slug: "ezili-freda-danto-and-the-water-lwa",
    title: "Ezili Freda, Ezili Dantò, Lasirèn and Agwe: love, motherhood and the sea",
    summary:
      "The Ezili are lwa of love, women's lives and power: Ezili Freda, the luxurious Rada lady pictured as the Mater Dolorosa, and Ezili Dantò, the fierce Petwo mother pictured as the Black Madonna of Częstochowa. With Lasirèn the mermaid and Agwe of the sea, they form the water lwa of Haitian Vodou.",
    description:
      "EZILI FREDA. A Rada lwa of love, beauty and luxury, Ezili Freda (Erzulie Freda) is served with perfume, jewellery, sweet cakes, champagne and pink or white; her vèvè is a heart. She is imagined as a light-skinned lady of wealth, flirtatious and always disappointed, who weeps at the end of her possessions. Her image is the Mater Dolorosa, the sorrowful Virgin with a pierced heart.\n\n" +
      "EZILI DANTÒ. A Petwo lwa, Ezili Dantò is a dark-skinned, scarred, hard-working single mother, fiercely protective, who in possession cannot speak and communicates in sounds. She is pictured through the Black Madonna of Częstochowa (whose scarred cheek is part of the identification); a popular explanation connects the image with the Polish soldiers who deserted Napoleon's army to fight with the Haitians in 1802–03, but how the icon arrived is not documented. Karen McCarthy Brown made Dantò central to her account of Mama Lola.\n\n" +
      "LASIRÈN AND AGWE. Lasirèn, the mermaid, is a water spirit of wealth and music, sometimes counted among the Ezili; La Balèn (the whale) is her companion. Agwe (Agwe Tawoyo), lord of the sea, is served by the sea with a decorated boat (barque) laden with offerings that is floated out; his image is a ship and a naval officer, and sometimes Saint Ulrich holding a fish.\n\n" +
      "CONNECTIONS. The name Ezili is generally connected with Aziri, a vodun of water in the region of Ouidah, and the mermaid imagery with Mami Wata images current around the Atlantic; Haitian Ezili are nonetheless very different figures, their personalities shaped by Haitian women's lives and by Catholic images of Mary.\n\n" +
      "SIGNIFICANCE. The Ezili are among the most important lwa in contemporary practice and in Haitian art, and the clearest example of how a lwa can split into contrasting forms in the Rada and Petwo nations.",
    category: "religion",
    subcategory: "The lwa",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    tags: tags(["deity: ezili and water spirits", "deity: mami wata", "deity: lwa", "practice: catholic contact"], "ezili", "lasiren", "agwe", "women"),
    people: ["Ezili Freda", "Ezili Dantò", "Lasirèn", "Agwe", "Virgin Mary (Mater Dolorosa; Our Lady of Częstochowa)"],
    civilisations: ["Haitian Vodou (Rada and Petwo)"],
    locationName: "Haiti and the Haitian diaspora",
    media: [
      commonsPicture({
        fileName: "Czestochowska.jpg",
        caption:
          "The icon of Our Lady of Częstochowa (the Black Madonna), Jasna Góra Monastery, Poland — a medieval Catholic icon (tradition dates its presence there to 1382) whose prints serve in Haiti as the image of Ezili Dantò. A comparative image: it is a Polish Catholic icon, not a Vodou object.",
        shows: "artefact",
        identificationStatus: "secure",
        licence: "PD-Art (PD-Art-100)",
        institution: "Jasna Góra Monastery, Częstochowa",
        objectDate: "medieval; at Jasna Góra from c. 1382",
      }),
      commonsPicture({
        fileName: "Erzuliedantoroltarz.jpg",
        caption: "A household altar to Ezili Dantò built around a print of the Black Madonna of Częstochowa, photographed on 23 May 2025 (uploaded from Poland).",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Commons user Slavicbruja",
        objectDate: "2025-05-23",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_brown_1991",
        temporalClaimType: "unknown",
        chronology: "religious",
        datingMethod: "other",
        whatIsDated: "When the Ezili took their Haitian forms",
        originalDateText: "Not datable; Ezili Freda and Dantò are described in twentieth-century ethnography",
        evidence:
          "EVIDENCE TYPE: religious tradition. The figures are known from practice described by Herskovits, Deren, Métraux and Brown; their iconography depends on Catholic prints available from the nineteenth century. When the distinct forms emerged is not documented.",
        citations: [
          cite("haiti_deren_1953", "supports", "Gives an extended account of Ezili and of being possessed by her."),
          cite("haiti_desmangles_1992", "supports", "Discusses the identification of the Ezili with images of Mary."),
        ],
      }),
    ],
  },

  {
    slug: "ogou-in-haiti",
    title: "Ogou in Haiti: iron, war, politics and Saint James",
    summary:
      "Ogou is a family of warrior lwa — Ogou Feray, Ogou Badagri, Ogou Balendjo and others — associated with iron, fire, soldiers and politics, served in red with rum and the machete, and pictured as Saint James the Greater.",
    description:
      "WHO OGOU IS. Ogou is not one lwa but a family. OGOU FERAY is the soldier and smith; OGOU BADAGRI the general and diplomat; OGOU BALENDJO the healer and protector of children; others include Ogou Shango and Ogou Panama. In possession Ogou drinks rum (sometimes set on fire and poured over his hands), wields a machete or sabre, wears red, and speaks in the commanding French of the army. He is pictured as Saint James the Greater (Sen Jak Majè), the knight on a white horse, and honoured above all at the Plaine-du-Nord pilgrimage around 25 July.\n\n" +
      "WHAT OGOU MEANS IN HAITI. Ogou is the lwa of the Revolution's soldiers and of Haiti's long military-political history; Karen McCarthy Brown describes him as a figure of power that can protect or destroy, of anger and loyalty in tension. Political leaders have been said to be under Ogou's protection.\n\n" +
      "WHERE HE COMES FROM. The name and the iron are Yoruba: Ògún, the orisha of iron, hunting and war, carried by 'Nago' captives; 'Badagri' is a coastal town between Lagos and Porto-Novo. The Fon equivalent is Gu, the vodun of iron in Dahomey, whose great iron figure is now in Paris. In Haiti, Ogou is generally classed among the Nago lwa served within the Rada rite.\n\n" +
      "WHAT CHANGED. In West Africa, Ògún and Gu are gods of tools, roads and hunters as well as war; in Haiti the agricultural and craft roles largely passed to other lwa, and Ogou became the soldier, his iron the sabre rather than the hoe.\n\n" +
      "SIGNIFICANCE. Ogou is the best case of a Yoruba power in Haitian Vodou, a reminder that the religion is not 'Dahomean' only, and a lwa whose history is bound up with the Haitian state itself.",
    category: "religion",
    subcategory: "The lwa",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    tags: tags(["deity: gu and ogou", "deity: orisha", "deity: lwa", "place: oyo and yorubaland", "practice: catholic contact"], "ogou", "saint-james", "nago"),
    people: ["Ogou Feray", "Ogou Badagri", "Ogou Balendjo", "Saint James the Greater"],
    civilisations: ["Haitian Vodou (Nago lwa)", "Yoruba"],
    locationName: "Haiti, especially Plaine-du-Nord",
    media: [
      PIC_VEVE_OGOU,
      commonsPicture({
        fileName: "Divinité Ogou à Abomey.jpg",
        caption:
          "A shrine of the vodun Ogou (Gu/Ògún) in a household at Abomey, Bénin, photographed on 22 December 2024 — a present-day West African counterpart for comparison, not an image of Haitian practice.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Commons user Chado07",
        objectDate: "2024-12-22",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_metraux_1958",
        temporalClaimType: "unknown",
        chronology: "religious",
        datingMethod: "other",
        whatIsDated: "When Ogou became a Haitian lwa",
        originalDateText: "Not datable; carried by Yoruba ('Nago') captives in the eighteenth century and described in twentieth-century ethnography",
        evidence:
          "EVIDENCE TYPE: religious tradition. The presence of Nago people in Saint-Domingue is documented; Ogou's Haitian forms are described by Herskovits, Métraux and Brown. No document dates his arrival.",
        citations: [
          cite("haiti_brown_1991", "supports", "Analyses Ogou's Haitian character as soldier and figure of power."),
          cite("haiti_apter_2002", "supports", "Discusses Nago lwa and their Yoruba origins."),
        ],
      }),
    ],
  },

  {
    slug: "gede-and-bawon-samdi",
    title: "The Gede and Bawon Samdi: the dead who laugh",
    summary:
      "The Gede are the spirits of the dead, led by Bawon Samdi (Baron Samedi) and Manman Brijit and guardians of the cemetery. Rude, funny and sexual, they are honoured at Fèt Gede on 1–2 November, and they protect children and tell the truth no one else will.",
    description:
      "WHO THEY ARE. The Gede (Guédé) family includes Bawon Samdi (Baron Samedi), Bawon Lakwa (of the cross) and Bawon Simityè (of the cemetery) — often treated as aspects of one — with Manman Brijit, his wife, and many Gede such as Gede Nibo and Gede Zaranyen. Every cemetery has a cross for the Bawon, usually over the first man buried there. The Gede dress in black and purple, wear top hats, dark glasses and white face powder, smoke, drink rum infused with hot peppers, and dance the banda, with its explicit hip movements.\n\n" +
      "WHAT THEY DO. The Gede preside over death and the dead, but also over life and sexuality; they heal, especially children, and they decide whether a sick person will die. In ceremonies they mock pretension, satirise priests and politicians, and say what others cannot. At FÈT GEDE, on 1–2 November (All Saints and All Souls), crowds visit the cemeteries, and Gede possessions fill the streets of Port-au-Prince.\n\n" +
      "ORIGINS. The name has been linked to the Gedevi, an early population of the Abomey plateau conquered by the Dahomean dynasty, though the connection is debated. The Gede as a whole are widely regarded as a Haitian development: the dead of Saint-Domingue and Haiti, organised as a family of lwa, with Catholic All Souls and the cemetery cross as their frame.\n\n" +
      "SIGNIFICANCE. The Gede are among the most beloved and most visible lwa, and the ones most distorted abroad: 'Baron Samedi' became a film villain, while in Haiti the Gede are protectors, healers and comedians of death. They link Vodou's care for the dead with the West African ancestor traditions without being a copy of them.",
    category: "religion",
    subcategory: "The lwa",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    tags: tags(["deity: gede and the dead", "practice: ancestors", "deity: lwa", "practice: catholic contact", "place: abomey"], "gede", "bawon-samdi", "fet-gede"),
    people: ["Bawon Samdi (Baron Samedi)", "Manman Brijit", "Gede Nibo"],
    civilisations: ["Haitian Vodou (Gede family)", "Gedevi (Abomey plateau)"],
    locationName: "Haiti, especially the cemeteries of Port-au-Prince",
    media: [
      PIC_VEVE_BARON,
      commonsPicture({
        fileName: "Haiti, vodou, candelabri cerimoniali e croce gédé, 1950 ca.jpg",
        caption: "Haitian Vodou ceremonial candelabra and a Gede cross, about 1950, in the Musée du quai Branly, Paris; photographed in 2016.",
        shows: "museum_specimen",
        identificationStatus: "secure",
        licence: "CC BY 3.0",
        creator: "Sailko (photograph)",
        institution: "Musée du quai Branly – Jacques Chirac",
        objectDate: "c. 1950",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_mcalister_2002",
        datePrecision: "year",
        temporalClaimType: "cyclic",
        chronology: "religious",
        whatIsDated: "Fèt Gede, the annual festival of the Gede",
        originalDateText: "Each year on 1–2 November (All Saints and All Souls)",
        evidence:
          "EVIDENCE TYPE: religious tradition. The festival follows the Catholic calendar. When the Gede festival took its present form is not documented.",
        citations: [cite("haiti_metraux_1958", "supports", "Describes the Gede, Bawon Samdi and their festival.")],
      }),
    ],
  },

  {
    slug: "azaka-and-loko",
    title: "Azaka and Loko: the farmer, the tree, and the first oungan",
    summary:
      "Kouzen Zaka (Azaka Mede), the peasant farmer lwa in straw hat and denim, and Loko, the lwa of trees and healing said to be the first oungan, with his wife Ayizan, patron of initiation — lwa of the land, the countryside and the priesthood.",
    description:
      "AZAKA. Kouzen ('Cousin') Zaka, or Azaka Mede, is the lwa of agriculture and the peasant. He arrives as a shy, suspicious, hard-bargaining countryman in a straw hat, blue denim and a shoulder bag (makout), smoking a pipe and eating cornmeal, cassava and raw sugar; he speaks a rough rural Kreyòl and is anxious about his crops and his money. He is honoured at harvest and on 1 May (Labour and Agriculture Day). Zaka is widely regarded as a distinctly Haitian figure, formed among the post-independence small farmers, though his name may have West African roots (Azaka has been linked to a Fon agricultural vodun).\n\n" +
      "LOKO. Loko (Loko Atisou) is the lwa of trees and vegetation, of healing leaves, and of the priesthood: tradition holds that he was the first oungan, and he watches over the ounfò and its initiates. He lives in trees, especially the mapou (ceiba) and the medsiyen; sacred trees in the yard of an ounfò are often his. His name corresponds to Loko, the Fon vodun of the iroko tree. His consort AYIZAN, symbolised by the shredded palm frond (mariwo), is patron of initiation, the marketplace and purification.\n\n" +
      "TREES. Because the lwa live in trees, trees were a target of the anti-superstition campaigns; their protection is part of what practitioners mean by defending Vodou.\n\n" +
      "SIGNIFICANCE. Azaka and Loko show two sides of Vodou's relationship with the land: one a lwa of the Haitian peasantry created by Haitian history, the other a lwa of trees and priesthood whose name crossed the Atlantic from the Fon. Together they illustrate the mix of new and carried that defines the religion.",
    category: "religion",
    subcategory: "The lwa",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    tags: tags(["deity: lwa", "practice: sacred trees and forests", "practice: initiation and priesthood", "practice: healing and herbal knowledge"], "azaka", "loko", "ayizan", "agriculture"),
    people: ["Kouzen Zaka (Azaka Mede)", "Loko Atisou", "Ayizan"],
    civilisations: ["Haitian Vodou", "Haitian peasantry", "Fon"],
    locationName: "Rural Haiti",
    media: [
      commonsPicture({
        fileName: "VeveAyizan.svg",
        caption:
          "A vèvè for Ayizan, Loko's consort and patron of initiation, redrawn and vectorised by a Commons contributor in 2007 from published examples. A modern drawing of one form.",
        shows: "diagram",
        identificationStatus: "probable",
        licence: "PD-Art (as stated on the file page)",
        creator: "Commons user Chrkl",
      }),
      commonsPicture({
        fileName: "Ceremonie de Mapou Bazile.jpg",
        caption:
          "Castera Bazile, 'Cérémonie de Mapou', a painted ceremony at a ceiba tree, made before the artist's death in 1966 (Figge Art Museum): the kind of tree service associated with Loko. A later artwork.",
        shows: "later_artwork",
        identificationStatus: "secure",
        licence: "PD-Haiti",
        creator: "Castera Bazile",
        institution: "Figge Art Museum",
      }),
    ],
    claims: [
      claim({
        sourceKey: "haiti_metraux_1958",
        temporalClaimType: "unknown",
        chronology: "religious",
        datingMethod: "other",
        whatIsDated: "When Azaka and Loko took their Haitian forms",
        originalDateText: "Not datable; both described in twentieth-century ethnography",
        evidence:
          "EVIDENCE TYPE: religious tradition. Both lwa are described by Herskovits, Métraux and Deren. Zaka's peasant character presupposes the post-1804 smallholding economy; Loko's name presupposes Fon contact. Neither arrival is dated.",
        citations: [
          cite("haiti_herskovits_1937", "supports", "Describes rural lwa and tree cults in Mirebalais in the 1930s."),
          cite("haiti_deren_1953", "supports", "Describes Loko and Ayizan as patrons of the priesthood and initiation."),
        ],
      }),
    ],
  },

  // ---- Comparisons ----------------------------------------------------------

  {
    slug: "legba-at-the-haitian-gate-atibon-legba-compared",
    title: "Legba at the Haitian gate: Atibon Legba compared with Legba of the Fon",
    summary:
      "Every Haitian Vodou ceremony begins by asking Papa Legba — Atibon Legba, the old man with a cane — to open the gate. The name and the role of first address came from the Gbe-speaking coast; the old man, Saint Peter's keys and the loss of Legba's Fa and market roles are Haitian.",
    description:
      "THE HAITIAN LEGBA. In Haiti, Legba (Papa Legba, Atibon Legba, Legba Atibon) is the lwa saluted first: 'Papa Legba, ouvri baryè a pou mwen' — 'Papa Legba, open the gate for me' — begins the service, because no other lwa can come until he opens the way between the visible and the invisible. He is pictured as an old man, lame, with a cane or crutch, a straw bag (makout) and a pipe, associated with Saint Peter, holder of the keys, and sometimes with Saint Lazarus. He stands at gates, doorways and crossroads; his Petwo counterpart is often given as Mèt Kalfou, master of the crossroads, who is hot and dangerous where Legba is gentle.\n\n" +
      "SIMILARITIES. The name is the same. The FUNCTION is the same core function: Legba is the intermediary who must be addressed first, guardian of thresholds and openings, the one through whom communication with the other powers passes. In both places he is honoured at entrances and crossroads.\n\n" +
      "DIFFERENCES. Among the Fon and Ewe, Legba is a youthful, sexual trickster, represented by a clay mound or figure with an erect phallus at the gates of houses, compounds, markets and towns; he is the 'linguist' of Fa divination who carries messages between people and the vodun and Mawu, and he is famous for his disorderly humour. In Haiti the phallic image, the trickster's sexuality and the link to Fa divination (which did not establish itself in Haiti) are largely absent; Legba became a gentle, old, Catholic-looking grandfather. The benin-vodun record 'Legba and Papa Legba: a connection, and a transformation' sets out the same contrast from the African side.\n\n" +
      "EVIDENCE FOR TRANSMISSION. Strong: a shared name AND a shared ritual role, in a religion whose Rada nation is named after Allada; documented deportation of Gbe-speaking 'Arada' people to Saint-Domingue; Rada liturgy that opens with Legba as Fon ceremonies do. This is genuine historical transmission, not mere resemblance. What is not established is when, through whom, or in what form the figure crossed, or why the old-man image prevailed (Catholic images and the logic of an elder at the gate are the usual explanations).\n\n" +
      "SIGNIFICANCE. Legba is the textbook case of how a power can survive a crossing by name and function while its picture is rebuilt: continuity and transformation in the same figure, and the first lwa any ceremony meets.",
    category: "religion",
    subcategory: "Comparison",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    transmissionStatus: "contact_documented",
    tags: tags(["deity: legba", "practice: crossroads", "practice: catholic contact", "place: allada", "place: saint-domingue and haiti"], "comparison", "legba", "atibon-legba"),
    people: ["Papa Legba (Atibon Legba)", "Legba (Fon)", "Mèt Kalfou", "Saint Peter"],
    civilisations: ["Haitian Vodou (Rada)", "Fon", "Ewe", "Arada"],
    locationName: "Haiti and southern Bénin / Togo",
    media: [
      PIC_VEVE_LEGBA,
      PIC_BENIN_LEGBA_ALLADA,
    ],
    claims: [
      claim({
        sourceKey: "haiti_metraux_1958",
        temporalClaimType: "unknown",
        chronology: "historical",
        datingMethod: "other",
        whatIsDated: "When the Legba tradition reached Saint-Domingue",
        originalDateText: "Not datable: carried by Gbe-speaking people deported over the eighteenth century",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The transmission is inferred from the shared name and function and from the documented deportation of 'Arada' people; no record dates it. Métraux and Deren describe the Haitian figure from twentieth-century practice.",
        citations: [
          cite("haiti_blier_1995", "supports", "Describes Fon and Ewe Legba at thresholds and markets, for the West African side."),
          cite("haiti_apter_2002", "supports", "Treats Rada names, including Legba's, as markers of Dahomean origin."),
        ],
      }),
    ],
  },

  {
    slug: "african-vodun-and-haitian-lwa-compared",
    title: "African Vodun and Haitian lwa: which names crossed, and what they became",
    summary:
      "Many Rada lwa carry names of Gbe vodun — Legba, Dan and Aido-Hwedo, Gu, Loko, Agbe, Aziri, Sogbo and Badé — and the Haitian ritual vocabulary is full of Fon words. But the lwa are organised, served and imagined in ways that have no direct African model.",
    description:
      "SIMILARITIES. NAMES: Legba ↔ Legba; Danbala and Ayida Wedo ↔ Dan and Aido-Hwedo, with 'Wedo' from Hueda (Ouidah); Ogou ↔ Gu (and Yoruba Ògún); Loko ↔ Loko, the iroko vodun; Agwe ↔ Agbe, the Fon sea vodun of the Xu family; Ezili ↔ Aziri, a water vodun of the Ouidah region; Sogbo and Badé (Haitian Rada lwa of thunder and wind) ↔ Sogbo and Badé of the Xevioso (Heviosso) thunder pantheon; Mawu appears in some Haitian songs. VOCABULARY: vodou, ounfò (hùn-xɔ), oungan (hùngán), ounsi (hùnsí), asogwe and others are Gbe words. PRACTICE: songs and drums to call powers, possession of initiates, offerings of animals and food, and ancestral obligations.\n\n" +
      "DIFFERENCES. In Bénin and Togo a vodun is usually served by a distinct cult group or lineage with its own convent, priesthood and territory; a vodunsi is initiated into one vodun and is possessed by it. In Haiti one ounfò serves dozens of lwa from several nations, and one person may be possessed by many. Haitian lwa include figures with no West African counterpart (Azaka the peasant, the Gede as a family, many Petwo lwa) and Kongo, Yoruba and Igbo powers alongside the Gbe. Royal Dahomean institutions — the kings' vodun, the Annual Customs — did not cross. Catholic saints, prayers and calendars are part of the Haitian system. And important vodun such as Sakpata and Heviosso himself are marginal or transformed in Haiti.\n\n" +
      "EVIDENCE FOR TRANSMISSION. Strong for the Gbe names and vocabulary: regular correspondences of names and words, the 'Rada' (Allada) label, the documented deportation of Gbe speakers to Saint-Domingue through the eighteenth century, and Moreau's 1797 serpent cult. What the evidence does not support is reading Haiti as an unchanged Dahomey: the correspondences are in names and roles, while organisation and imagery are Haitian. Present-day exchange between Haitian and Béninois practitioners also creates new resemblances that are not old descent.\n\n" +
      "SIGNIFICANCE. This comparison is the core of the case that Haitian Vodou is related to West African Vodun — the evidence is specific and verifiable — and the core of the case that it is a different religion.",
    category: "religion",
    subcategory: "Comparison",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    transmissionStatus: "contact_documented",
    tags: tags(
      ["deity: lwa", "deity: legba", "deity: dan and aido-hwedo", "deity: gu and ogou", "deity: heviosso", "deity: ezili and water spirits", "place: allada", "place: ouidah"],
      "comparison",
      "rada",
      "vocabulary"
    ),
    people: ["Legba", "Danbala", "Ayida Wedo", "Agwe", "Loko", "Sogbo", "Badé"],
    civilisations: ["Fon", "Hueda", "Allada", "Haitian Vodou (Rada)"],
    locationName: "Southern Bénin and Haiti",
    media: [
      PIC_BENIN_CEREMONY,
      PIC_VEVE_DANBALA,
    ],
    claims: [
      claim({
        sourceKey: "haiti_apter_2002",
        startYear: 1700,
        endYear: 1800,
        isApproximate: true,
        datePrecision: "century",
        temporalClaimType: "estimated_range",
        datingMethod: "estimate",
        whatIsDated: "The main period of deportation of Gbe speakers to Saint-Domingue",
        originalDateText: "Chiefly over the eighteenth century, through the Bight of Benin",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Inferred from slave-trade records and ethnonyms ('Arada') in colonial documents. It dates the movement of people who carried the names, not the formation of any lwa.",
        citations: [
          cite("haiti_blier_1995", "supports", "Describes the Fon vodun named here, for comparison."),
          cite("haiti_herskovits_1937", "context", "The 'Dahomean retentions' argument that first set out many of these correspondences."),
        ],
      }),
    ],
  },

  {
    slug: "yoruba-orisha-and-haitian-vodou-compared",
    title: "Yoruba Orisha and Haitian religious traditions: the Nago lwa, Ogou, and why there is no Ifá",
    summary:
      "Haitian Vodou has a Nago (Yoruba) nation, Ogou is the Yoruba Ògún, and Legba parallels Èṣù. But Haiti's African inflow ended before the great nineteenth-century Yoruba deportations that shaped Cuban Lucumí and Brazilian Candomblé, so Orisha religion is one strand among many in Vodou rather than its frame.",
    description:
      "SIMILARITIES. The NAGO nanchon takes its name from the Fon term for Yoruba-speaking people, and colonial records list 'Nago' among the enslaved. OGOU and his family correspond to Ògún, orisha of iron and war, and the name 'Ogou Badagri' recalls a Yoruba-coast town. Some Haitian songs name Shango (Chango), the Yoruba thunder orisha, as an Ogou. LEGBA in his gatekeeping role parallels the Yoruba Èṣù-Elegba, whom Yoruba and Fon traditions themselves link. The structure of possession, initiation and offerings to named powers is shared across the Yoruba and Gbe region, which was itself a zone of long religious exchange.\n\n" +
      "DIFFERENCES. In Yoruba religion, and in Cuban Lucumí and Brazilian Candomblé, the orisha are served through a priesthood organised around initiation into a single head orisha, with IFÁ divination (the same corpus as the Fon Fa) at the centre of religious authority. Haitian Vodou has no Ifá or Fa system; its divination uses cards, shells and the lwa's own speech in possession. Major orisha such as Yemọja, Ọṣun and Ọbàtálá are absent or minor in Haiti; Ezili, Danbala and the Gede fill the corresponding spaces. Kongo and Gbe elements weigh more heavily than Yoruba ones.\n\n" +
      "EVIDENCE FOR TRANSMISSION. Real but limited: the Nago ethnonym in colonial documents, the Ogou names, and correspondences of role. The difference from Cuba and Brazil has a documented historical cause: the collapse of Oyo and the Yoruba wars of the 1810s–30s sent very large numbers of Yoruba to Cuba and Bahia in the nineteenth century, after Haiti's independence had ended its slave trade. J. Lorand Matory's work also shows that the prestige of 'Yoruba' tradition in Brazil and Cuba was partly built by later transatlantic traffic, a process Haiti largely missed.\n\n" +
      "SIGNIFICANCE. The Orisha comparison explains why the Afro-Atlantic religions differ: not because some 'preserved' Africa better, but because different African peoples arrived at different times under different regimes. In Haiti, Yoruba powers became Nago lwa inside a Vodou already formed.",
    category: "religion",
    subcategory: "Comparison",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    transmissionStatus: "contact_documented",
    tags: tags(
      ["deity: orisha", "deity: gu and ogou", "deity: legba", "practice: divination", "place: oyo and yorubaland", "place: cuba", "place: bahia and brazil"],
      "comparison",
      "nago",
      "yoruba"
    ),
    people: ["Ogou", "Ògún", "Èṣù-Elegba", "Shango"],
    civilisations: ["Yoruba", "Nago", "Haitian Vodou", "Lucumí", "Candomblé"],
    locationName: "Yorubaland, Haiti, Cuba and Bahia",
    media: [
      commonsPicture({
        fileName: "Statue of Ogun shrine at the Sacred Grove Of Oshun.jpg",
        caption:
          "A statue at the shrine of Ògún in the Osun-Osogbo Sacred Grove, Nigeria, photographed on 21 September 2016 — a modern Yoruba sculpture in a UNESCO-listed grove, shown for comparison with Haitian Ogou.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Commons user Yeniajayiii",
        objectDate: "2016-09-21",
      }),
      PIC_VEVE_OGOU,
    ],
    claims: [
      claim({
        sourceKey: "haiti_matory_2005",
        startYear: 1810,
        endYear: 1850,
        isApproximate: true,
        datePrecision: "decade",
        temporalClaimType: "estimated_range",
        whatIsDated: "The peak of Yoruba deportations to Cuba and Brazil, after Haiti's slave trade had ended",
        originalDateText: "The Yoruba wars and the fall of Oyo, roughly 1810s–1840s",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Slave-trade data and Yoruba history date the wave. It explains, in part, why Orisha religion shaped Cuba and Bahia more than Haiti; it does not date any Haitian development.",
        citations: [cite("haiti_apter_2002", "supports", "Discusses Nago lwa and Yoruba elements in Haitian Vodou.")],
      }),
    ],
  },

  {
    slug: "possession-and-drum-music-benin-and-haiti",
    title: "Possession and drum music across Bénin and Haiti",
    summary:
      "In both Bénin and Haiti, drums and songs call the powers and initiates are possessed. The forms differ — one vodun to a devotee in Bénin, many lwa to a horse in Haiti — and the Haitian drum batteries are Haitian creations from several African models.",
    description:
      "SIMILARITIES. In Gbe-speaking Bénin and Togo, as in Haiti, ceremonies are organised by music: drum ensembles, iron bells and rattles, and call-and-response songs in a fixed order call the powers; dancers move in the styles proper to each power; initiates enter possession, are recognised as the power, are dressed and greeted, and are brought back. In both, possession is learned, ritually managed and the culmination of the ceremony, and its bodily signs (falling, trembling, changed voice and gait) are observably similar. The Haitian iron bell (ogan) corresponds to the West African iron gong; the asson to calabash rattles.\n\n" +
      "DIFFERENCES. In much West African vodun a devotee is initiated, often through long seclusion in a convent, into the cult of ONE vodun, receives a new name and language, and is possessed by that vodun; possession is tied to lineage and territory. In Haiti one initiate can be the 'horse' of many lwa from different nations, in the same ceremony. The Rada three-drum battery (manman, segon, boula) and the Petwo drums are Haitian ensembles drawing on Gbe, Kongo and other models, not copies of any one; Petwo rhythms and whips have no Gbe counterpart. Haitian songs are mostly in Kreyòl with ritual langaj; Fon songs in Fon.\n\n" +
      "EVIDENCE FOR TRANSMISSION. Moderate. Specific words (ounsi from hùnsí, the Rada label), the iron bell and the order of service beginning with Legba point to Gbe transmission in the Rada rite; Kongo terms and instruments to Kongo transmission in Petwo. But possession under drumming is found across West and Central Africa and in many religions worldwide, so the shared practice alone is not evidence of a particular route. The observable phenomenon, the practitioners' account of it, and the absence of established supernatural causation are recorded as three separate statements, as the benin-vodun record on possession does.\n\n" +
      "SIGNIFICANCE. Possession and music are where the two religions feel closest to observers, which makes it the comparison most in need of care: the experience is shared, the institutions differ, and the specific links are carried by words and instruments.",
    category: "religion",
    subcategory: "Comparison",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    transmissionStatus: "contact_documented",
    tags: tags(["practice: possession", "practice: drumming and song", "practice: initiation and priesthood", "place: togo and ewe country"], "comparison", "possession", "drums"),
    people: ["Vodunsi", "Ounsi"],
    civilisations: ["Fon", "Ewe", "Haitian Vodou"],
    locationName: "Southern Bénin, Togo and Haiti",
    media: [
      commonsPicture({
        fileName: "Cérémonies vodoun au Bénin 05.jpg",
        caption:
          "A Vodun ceremony in Bénin, photographed in 2022 and uploaded for Wiki Loves Africa; place and occasion not stated on the file page. A present-day image shown for comparison with Haitian ceremonies.",
        shows: "evidence_photograph",
        identificationStatus: "probable",
        licence: "CC BY-SA 4.0",
        creator: "Commons user ArisTheKing",
        objectDate: "2022-06-30",
      }),
      PIC_FRISNER,
    ],
    claims: [
      claim({
        sourceKey: "haiti_rosenthal_1998",
        temporalClaimType: "unknown",
        chronology: "historical",
        datingMethod: "other",
        whatIsDated: "When possession practice crossed the Atlantic",
        originalDateText: "Not datable; carried by deported people and described on both sides only from the eighteenth century onward",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Possession is described in Saint-Domingue by Moreau (1797) and on the Slave Coast by European travellers from the late seventeenth century; the comparison rests on ethnography from both sides. No date of transmission can be given.",
        citations: [
          cite("haiti_fleurant_1996", "supports", "Describes Rada drums and song order in Haiti."),
          cite("haiti_deren_1953", "supports", "Describes Haitian possession from a participant's view."),
        ],
      }),
    ],
  },

  {
    slug: "sacred-crossroads-benin-and-haiti",
    title: "The sacred crossroads in Bénin and Haiti: Legba, Kalfou, the cross and the cosmogram",
    summary:
      "The crossroads is sacred in both West African Vodun and Haitian Vodou: Legba stands there, offerings are left there, and in Haiti the cross of the vèvè and of the Gede is read as a crossroads between worlds. Some of this crossed the Atlantic; some of it is common to many religions.",
    description:
      "SIMILARITIES. In Fon and Ewe practice, Legba's shrines stand at the entrances of compounds and villages and at crossroads and markets, and offerings for protection or to send misfortune away are left at crossroads. In Haiti, Legba is lord of the gate and the crossroads (kafou), Mèt Kalfou rules the crossroads in the Petwo rite, offerings and 'expeditions' are placed at crossroads, and the cross recurs: in vèvè, on the poto mitan, on the Gede's cemetery cross. In both, the crossroads is where the human world meets the other world and where a ritual specialist can open or close the way.\n\n" +
      "DIFFERENCES. The Haitian crossroads is shaped by Kongo as much as Gbe thought: Robert Farris Thompson connected the Haitian cross to the Kongo cosmogram, a cross marking the meeting of the world of the living and the land of the dead, and Petwo crossroads ritual is distinctly Kongo-inflected. The Catholic cross is also present, so a Haitian cross can be Christian, Kongo and Vodou at once. Kalfou has no direct Fon counterpart. In Bénin the crossroads is one of several thresholds Legba guards (house, market, town); in Haiti it became a central image.\n\n" +
      "EVIDENCE FOR TRANSMISSION. Mixed. Legba's presence at crossroads in both places rests on the same strong evidence as Legba himself (name plus function). The Kongo-cosmogram reading is influential but partly speculative. And crossroads magic is widespread — in Yoruba Èṣù worship, in European folk magic and grimoires (and in the crossroads of African American hoodoo and the blues) — so the sacred crossroads by itself is a resemblance, not proof of a single origin.\n\n" +
      "SIGNIFICANCE. The crossroads shows how a Haitian symbol can have several genuine ancestors at once, and why a comparison must say which links are documented (Legba), which are argued (the Kongo cosmogram) and which are simply shared human ideas.",
    category: "religion",
    subcategory: "Comparison",
    eventType: "religious_account",
    evidenceStatus: "strongly_documented",
    transmissionStatus: "contact_documented",
    tags: tags(["practice: crossroads", "deity: legba", "deity: gede and the dead", "practice: veve and sacred art", "place: togo and ewe country", "place: new orleans"], "comparison", "crossroads", "kongo"),
    people: ["Legba", "Mèt Kalfou", "Èṣù", "Bawon Samdi"],
    civilisations: ["Fon", "Ewe", "Kongo", "Haitian Vodou"],
    locationName: "Southern Bénin and Togo, Haiti",
    media: [
      commonsPicture({
        fileName: "La divinité lègba, Gardien des lieux.jpg",
        caption:
          "'The divinity Lègba, guardian of places': a Legba shrine photographed in Togo on 29 August 2013 (Wiki Loves Africa). A present-day West African guardian shrine, shown for comparison.",
        shows: "evidence_photograph",
        identificationStatus: "secure",
        licence: "CC BY-SA 4.0",
        creator: "Commons user Wisdom Mensah de Linitiateur",
        objectDate: "2013-08-29",
      }),
      PIC_VEVE_BARON,
    ],
    claims: [
      claim({
        sourceKey: "haiti_thompson_1983",
        temporalClaimType: "unknown",
        chronology: "historical",
        datingMethod: "other",
        whatIsDated: "When crossroads symbolism entered Haitian Vodou",
        originalDateText: "Not datable; inferred from Gbe, Kongo and Catholic sources of the eighteenth century onward",
        evidence:
          "EVIDENCE TYPE: modern interpretation. The comparison rests on twentieth-century ethnography on both sides and on Thompson's art-historical argument; no document dates the adoption of crossroads ritual in Saint-Domingue.",
        citations: [
          cite("haiti_blier_1995", "supports", "Describes Legba's shrines at thresholds and crossroads in Fon and Ewe practice."),
          cite("haiti_cosentino_1995", "context", "Discusses crosses and crossroads in Haitian sacred art."),
        ],
      }),
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const links: SeedEventLink[] = [
  // ---- inside the track -----------------------------------------------------
  { from: "code-noir-1685-religion-clauses", to: ANCHOR.haiti, relation: "relevant", note: "The edict's baptism requirement and ban on other public religion framed the colony in which Vodou formed." },
  { from: "makandal-executed-1758", to: "makandal-poison-panic-evidence", relation: "related", note: "The execution and the disputed conspiracy are separate questions; this pair keeps them apart." },
  { from: "makandal-poison-panic-evidence", to: "code-noir-1685-religion-clauses", relation: "precedes", note: "The poison panic produced the post-1758 rulings against 'macandals' and night assemblies." },
  { from: "moreau-de-saint-mery-describes-vaudoux-1797", to: ANCHOR.haiti, relation: "evidence_for", note: "Moreau's account is the earliest substantial description of the religion whose formation the anchor describes." },
  { from: "moreau-de-saint-mery-describes-vaudoux-1797", to: "danbala-and-ayida-wedo", relation: "evidence_for", note: "Moreau's serpent in a box is the earliest Haitian evidence for the serpent cult later served as Danbala." },
  { from: "moreau-de-saint-mery-describes-vaudoux-1797", to: "bondye-lwa-and-nanchon", relation: "evidence_for", note: "His 'Vaudoux' and 'Dom Pèdre' dances suggest two rites, prefiguring Rada and Petwo." },
  { from: "bwa-kayiman-ceremony-august-1791", to: "bwa-kayiman-evidence-problem", relation: "related", note: "The event and the history of how it came to be told must be read together." },
  { from: "bwa-kayiman-ceremony-august-1791", to: "vodou-and-the-haitian-revolution", relation: "part_of", note: "The ceremony preceded the uprising that began the Revolution." },
  { from: "haiti-pact-with-the-devil-claim", to: "bwa-kayiman-evidence-problem", relation: "responds_to", note: "The 'pact' claim is a modern re-reading of the same sources the evidence record examines." },
  { from: "haiti-pact-with-the-devil-claim", to: "haiti-earthquake-2010-and-vodou", relation: "associated", note: "Robertson tied the claim to the 2010 earthquake, and post-quake hostility to practitioners followed." },
  { from: "vodou-and-the-haitian-revolution", to: "haitian-independence-1-january-1804", relation: "precedes", note: "The Revolution ended with the proclamation of independence." },
  { from: "haitian-independence-1-january-1804", to: "haitian-state-against-vodou-1800-1835", relation: "related", note: "The founders of the state were also the first to legislate against Vodou." },
  { from: "haitian-state-against-vodou-1800-1835", to: "bizoton-affair-and-cannibalism-libel", relation: "precedes", note: "The 1835 penal articles were harshened after the 1864 Bizoton trial." },
  { from: "haiti-vatican-concordat-1860", to: "campagne-anti-superstitieuse-1941-1942", relation: "precedes", note: "The Concordat church organised the anti-superstition campaigns that culminated in 1941–42." },
  { from: "bizoton-affair-and-cannibalism-libel", to: "us-occupation-vodou-and-zombie-imagery", relation: "precedes", note: "St John's libel was read and repeated by occupation-era American writers." },
  { from: "us-occupation-vodou-and-zombie-imagery", to: "price-mars-and-the-bureau-d-ethnologie", relation: "responds_to", note: "Ainsi parla l'oncle was the Haitian intellectual answer to the occupation and its image of Haiti." },
  { from: "price-mars-and-the-bureau-d-ethnologie", to: "campagne-anti-superstitieuse-1941-1942", relation: "responds_to", note: "Roumain and the Bureau defended Vodou against the campaign in 1942." },
  { from: "price-mars-and-the-bureau-d-ethnologie", to: "duvalier-vodou-and-dechoukaj-1986", relation: "precedes", note: "Duvalier came out of the noiriste ethnology that indigénisme launched." },
  { from: "hurston-and-dunham-in-haiti", to: "deren-and-metraux-describe-vodou", relation: "related", note: "Successive outside ethnographies of Haitian Vodou in the 1930s–50s." },
  { from: "centre-d-art-and-hector-hyppolite", to: "ezili-freda-danto-and-the-water-lwa", relation: "relevant", note: "Hyppolite's Maîtresse Erzulie is among the best-known images of Ezili." },
  { from: "duvalier-vodou-and-dechoukaj-1986", to: "haiti-vodou-legal-recognition-1987-2003", relation: "precedes", note: "The 1986 violence was the immediate background to the 1987 Constitution's guarantees." },
  { from: "duvalier-vodou-and-dechoukaj-1986", to: "knva-zantray-and-max-beauvoir", relation: "precedes", note: "Practitioners' defence associations formed in response to the 1986 attacks." },
  { from: "haiti-vodou-legal-recognition-1987-2003", to: "us-occupation-vodou-and-zombie-imagery", relation: "responds_to", note: "Article 297 abrogated the 1935 decree-law issued just after the occupation." },
  { from: "knva-zantray-and-max-beauvoir", to: "haiti-earthquake-2010-and-vodou", relation: "related", note: "Beauvoir and the KNVA spoke for practitioners after the earthquake and the Cité Soleil attack." },
  { from: "haitian-vodou-in-the-diaspora-mama-lola", to: "ezili-freda-danto-and-the-water-lwa", relation: "relevant", note: "Brown's Mama Lola centres on Ezili Dantò and the other lwa as social relationships." },
  { from: "haitian-vodou-in-the-diaspora-mama-lola", to: "knva-zantray-and-max-beauvoir", relation: "related", note: "The KNVA installed diaspora clergy in New York in 2017." },
  { from: "sodo-and-plaine-du-nord-pilgrimages", to: "ogou-in-haiti", relation: "relevant", note: "Plaine-du-Nord is Ogou's great pilgrimage, on the feast of Saint James." },
  { from: "sodo-and-plaine-du-nord-pilgrimages", to: "bwa-kayiman-ceremony-august-1791", relation: "related", note: "Plaine-du-Nord lies a few kilometres from the traditional site of Bwa Kayiman." },
  { from: "souvenance-rada-festival", to: "bondye-lwa-and-nanchon", relation: "relevant", note: "Souvenance is a principal centre of the Rada nation's service." },
  { from: "bondye-lwa-and-nanchon", to: ANCHOR.haiti, relation: "part_of", note: "The nanchon system is the structure the formation of Vodou produced." },
  { from: "ounfo-peristil-oungan-manbo", to: "haitian-vodou-drums-and-possession", relation: "related", note: "Drums and possession take place in the peristil under the direction of the oungan or manbo." },
  { from: "veve-haitian-sacred-drawings", to: "ounfo-peristil-oungan-manbo", relation: "related", note: "Vèvè are traced around the poto mitan by the officiant at the start of a ceremony." },
  { from: "gede-and-bawon-samdi", to: "haiti-earthquake-2010-and-vodou", relation: "related", note: "Bawon Samdi's cross was rebuilt for the Gede festival after the earthquake." },
  { from: "gede-and-bawon-samdi", to: "duvalier-vodou-and-dechoukaj-1986", relation: "relevant", note: "Duvalier's public persona was widely associated with Bawon Samdi." },
  { from: "azaka-and-loko", to: "campagne-anti-superstitieuse-1941-1942", relation: "relevant", note: "The campaign cut sacred trees, the homes of Loko and other lwa." },
  { from: "legba-at-the-haitian-gate-atibon-legba-compared", to: "sacred-crossroads-benin-and-haiti", relation: "related", note: "Legba is the figure at the centre of both the gate and the crossroads comparisons." },
  { from: "african-vodun-and-haitian-lwa-compared", to: "bondye-lwa-and-nanchon", relation: "relevant", note: "The comparison explains the Rada names within the nanchon system." },
  { from: "yoruba-orisha-and-haitian-vodou-compared", to: "ogou-in-haiti", relation: "relevant", note: "Ogou is the clearest Yoruba power among the lwa." },
  { from: "possession-and-drum-music-benin-and-haiti", to: "haitian-vodou-drums-and-possession", relation: "relevant", note: "The comparison extends the Haitian record across the Atlantic." },
  // ---- to the other five tracks' anchors -----------------------------------
  { from: ANCHOR.atlantic, to: ANCHOR.haiti, relation: "precedes", note: "What crossed the Atlantic is the material from which Haitian Vodou was made." },
  { from: ANCHOR.haiti, to: ANCHOR.americas, relation: "related", note: "Refugees from Saint-Domingue, free and enslaved, reached New Orleans in 1809–10, one strand in Louisiana Voodoo's formation." },
  { from: ANCHOR.africa, to: "african-vodun-and-haitian-lwa-compared", relation: "relevant", note: "The West African side of the names and practices compared with the lwa." },
  { from: ANCHOR.kingdoms, to: "souvenance-rada-festival", relation: "relevant", note: "Souvenance's rites are called 'Dahomean' by the community; the kingdoms track sets out what Dahomean religion was." },
  { from: "us-occupation-vodou-and-zombie-imagery", to: ANCHOR.modern, relation: "precedes", note: "The zombie and 'voodoo' stereotype born in occupation-era writing is followed into film and the present on the today track." },
  { from: "haiti-pact-with-the-devil-claim", to: ANCHOR.modern, relation: "related", note: "Modern misrepresentations of Vodou are a theme of the today track." },
  { from: "sacred-crossroads-benin-and-haiti", to: ANCHOR.americas, relation: "related", note: "Crossroads lore also runs through Louisiana Voodoo and hoodoo, with its own history." },
  { from: "yoruba-orisha-and-haitian-vodou-compared", to: ANCHOR.americas, relation: "related", note: "Lucumí and Candomblé, the Orisha-centred religions of Cuba and Brazil, are on the Americas track." },
  { from: "haiti-vodou-legal-recognition-1987-2003", to: ANCHOR.modern, relation: "related", note: "Legal recognition in Haiti belongs with the present-day status of Vodun and Vodou." },
  // ---- into the Bénin datasets ---------------------------------------------
  { from: "vodun-across-the-atlantic", to: ANCHOR.haiti, relation: "precedes", note: "The benin-vodun overview of the diaspora points here for how Haitian Vodou formed." },
  { from: ANCHOR.haiti, to: "not-one-theology", relation: "related", note: "Haitian Vodou drew on Fon, Aja, Hueda, Yoruba and Kongo traditions that were never one theology." },
  { from: ANCHOR.haiti, to: "how-old-is-vodun", relation: "related", note: "Both records refuse a founding date for a religion formed over generations." },
  { from: "legba-at-the-haitian-gate-atibon-legba-compared", to: "legba-and-papa-legba", relation: "responds_to", note: "Extends the Bénin record's comparison with Haitian ritual detail, Mèt Kalfou and the evidence for transmission." },
  { from: "legba-at-the-haitian-gate-atibon-legba-compared", to: "legba", relation: "related", note: "The Fon and Ewe Legba compared with Atibon Legba." },
  { from: "legba-at-the-haitian-gate-atibon-legba-compared", to: "fa-divination", relation: "relevant", note: "Legba is Fa's linguist in Bénin; Fa did not take root in Haiti, which is one of the differences." },
  { from: "danbala-and-ayida-wedo", to: "dan-the-serpent", relation: "related", note: "Danbala and Ayida Wedo carry the names of Dan and Aido-Hwedo into Haiti." },
  { from: "danbala-and-ayida-wedo", to: "bosman-describes-the-serpent-at-whydah", relation: "relevant", note: "'Wedo' is generally derived from Hueda (Whydah), whose serpent cult Bosman described." },
  { from: "moreau-de-saint-mery-describes-vaudoux-1797", to: "temple-of-pythons-today", relation: "relevant", note: "Moreau's serpent cult recalls the python veneration of Ouidah." },
  { from: "possession-and-drum-music-benin-and-haiti", to: "possession-and-trance", relation: "related", note: "Applies the Bénin record's distinction between observed, claimed and established to Haiti." },
  { from: "possession-and-drum-music-benin-and-haiti", to: "initiation-and-restricted-knowledge", relation: "relevant", note: "Initiation into a single vodun in Bénin is compared with Haitian kanzo." },
  { from: "haitian-vodou-drums-and-possession", to: "possession-and-trance", relation: "related", note: "The same three-part treatment of possession on both sides of the Atlantic." },
  { from: "ogou-in-haiti", to: "gu-iron-and-war", relation: "related", note: "Gu, the Fon vodun of iron, is one counterpart of Haitian Ogou." },
  { from: "ogou-in-haiti", to: "gou-iron-figure", relation: "relevant", note: "The Abomey iron figure of Gou is the most famous image of the Fon iron vodun." },
  { from: "yoruba-orisha-and-haitian-vodou-compared", to: "okomilo-benin-osanobua-olokun-ogun", relation: "relevant", note: "Ogun in Edo religion is another West African form of the iron power." },
  { from: "yoruba-orisha-and-haitian-vodou-compared", to: "fa-divination", relation: "relevant", note: "Fa/Ifá divination is central in Bénin and Yoruba religion and absent from Haitian Vodou." },
  { from: "african-vodun-and-haitian-lwa-compared", to: "heviosso-thunder", relation: "related", note: "Sogbo and Badé, Haitian Rada lwa, are named after members of the Xevioso thunder pantheon." },
  { from: "african-vodun-and-haitian-lwa-compared", to: "resemblance-is-not-descent", relation: "relevant", note: "The comparison applies the Bénin dataset's tests for when a similarity is evidence." },
  { from: "african-vodun-and-haitian-lwa-compared", to: "mawu-lisa", relation: "relevant", note: "Mawu appears in some Haitian songs, while Bondye fills the role of distant creator." },
  { from: "sacred-crossroads-benin-and-haiti", to: "resemblance-is-not-descent", relation: "relevant", note: "Crossroads symbolism is widespread, so the comparison separates documented from merely shared features." },
  { from: "gede-and-bawon-samdi", to: "ancestors-in-vodun", relation: "related", note: "Haitian care for the dead compared with the ancestors of Bénin's Vodun." },
  { from: "gede-and-bawon-samdi", to: "egungun-in-benin", relation: "relevant", note: "The Egungun's masked dead are a West African counterpart to the Gede in the street." },
  { from: "souvenance-rada-festival", to: "abomey-palaces-three-centuries", relation: "relevant", note: "The community calls its rites Dahomean; Abomey was Dahomey's royal centre." },
  { from: "azaka-and-loko", to: "not-one-theology", relation: "relevant", note: "Loko's name is Fon, while Azaka is largely Haitian — the mixture the Bénin record warns against flattening." },
  { from: "haiti-vodou-legal-recognition-1987-2003", to: "vodun-officially-recognised-1996", relation: "related", note: "Bénin recognised Vodun in 1996, seven years before Haiti's 2003 decree; separate histories, noticed together." },
  { from: "campagne-anti-superstitieuse-1941-1942", to: "vodun-under-colonial-rule", relation: "related", note: "Church and state campaigns against Vodun in colonial Dahomey and against Vodou in Haiti ran in the same decades." },
  { from: "ezili-freda-danto-and-the-water-lwa", to: "temple-and-basilica-face-each-other", relation: "relevant", note: "Catholic Marian images serving as Ezili parallel the Catholic–Vodun proximity at Ouidah." },
  { from: ANCHOR.haiti, to: "ouidah-and-the-scale-of-the-trade", relation: "relevant", note: "The deportations from the Bight of Benin brought the Arada people whose traditions shaped the Rada rite." },
  { from: "bizoton-affair-and-cannibalism-libel", to: "human-sacrifice-what-is-documented", relation: "related", note: "Both records separate documented evidence from foreign sensational accounts of sacrifice." },
  { from: "vodou-and-the-haitian-revolution", to: "ouidah-slave-route-memorial", relation: "relevant", note: "The memory of the deportations on the Bénin coast and of the Revolution in Haiti are two ends of one history." },
  { from: "haiti-pact-with-the-devil-claim", to: "vodun-is-not-voodoo", relation: "related", note: "Both records concern how outsiders have misnamed and demonised these religions." },
];

export const HAITI: VodunSection = { track: TRACK, sources, events, links };
