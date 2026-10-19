// TRACK: VODUN_DIASPORA_TRACKS.africa — "Vodun in West Africa: powers, ancestors and knowledge".
//
// WHAT THIS SECTION ADDS TO benin-vodun. The 35 Bénin records already cover the
// headline powers (Mawu and Lisa, Legba, Dan, Sakpata, Heviosso, Gu), the
// ancestors, twins and the Toxosu, Fa, initiation, possession, the Temple of
// Pythons and the 1658 catechism. This track does not repeat them. It goes
// sideways and further: the religious geography of Tado, Allada, Ouidah, Abomey,
// Notsé and Glidji; the powers benin-vodun lacks (Nana Buluku, Aido-Hwedo, Hu,
// Agbe and Naete, Loko, the Aziza, Agé, Zomadonu, Mami Wata, Gorovodu, Mama
// Tchamba, Yewe); the people who wrote the religion down, from Bosman to
// Herskovits; the institutions of service (the convent, the priest, the
// vodunsi); and four comparison records that the rest of the expansion leans
// on — the cosmic serpent, sacred trees and forests, divination, ancestors.
//
// HOW IT WAS RESEARCHED (October 2026). Primary texts were read in this
// session where they could be reached: Bosman's English edition (1705, read in
// the 1907 reprint on archive.org) for the "three sorts" of Hueda gods; Burton's
// Mission to Gelele (1864, vol. 2 ch. XVII, read in full text) for the Dahoman
// trees, the sea, Nate, Avrekete and Aydo-whe-do; Ellis's Ewe-Speaking Peoples
// (1890, read in part). The modern scholarship is cited from bibliographic
// records and from the author's knowledge of it; where a detail rests on a
// summary rather than the page, the claim says NEEDS SOURCE VERIFICATION.
// Every picture is a Wikimedia Commons file whose File: page was fetched in
// this session; licence and creator are copied from that page.
//
// THE RULES. No ancient religious origin gets a date. Traditions are recorded
// as traditions. Resemblance is never offered as proof of descent. The
// Egyptian-derivation theory appears once, as an attributed alternative with
// its genealogy.

import type { SeedEvent, SeedEventLink, SeedSource } from "../seed-types";
import { commonsPicture, vodunTags, type VodunSection } from "./shared";

const T = "africa" as const;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const sources: SeedSource[] = [
  // ---- Travellers and early ethnographers (primary) -----------------------
  {
    key: "wa_bosman_1705",
    title: "A New and Accurate Description of the Coast of Guinea, Divided into the Gold, the Slave, and the Ivory Coasts",
    author: "Willem Bosman",
    publisher: "James Knapton and Dan. Midwinter, London (English translation of the Dutch edition of 1704); reprinted 1907",
    reference: "Letter XIX (Fida/Whydah), p. 368 of the 1907 reprint: 'Their Principal Gods ... are of three sorts'",
    url: "https://archive.org/details/newaccuratedescr00bosm",
    sourceType: "primary",
    publishedYear: 1705,
    publishedDisplay: "Dutch 1704; English 1705; reprint 1907",
    notes:
      "Read in this session (1907 reprint, full text). Cited for the earliest European statement that the people of Fida (Hueda/Whydah) had three orders of gods: the snake, 'some lofty high Trees', and 'the Sea', the snake's province not to be 'intermeddled' with by the other two. A Dutch West India Company merchant's view, written for European readers and openly contemptuous; valuable as a dated outside observation, not as an account of the religion's own categories.",
  },
  {
    key: "wa_burton_gelele_1864",
    title: "A Mission to Gelele, King of Dahome",
    author: "Richard F. Burton",
    publisher: "Tinsley Brothers, London",
    reference: "Vol. 2, ch. XVII 'Of the Dahoman religion', pp. 139–149 (trees, Hu, Nate, Avrekete, Aydo-whe-do); vol. 1, pp. 330–331 (Afa)",
    url: "https://archive.org/details/missiontogelelek02burt_0",
    sourceType: "primary",
    publishedYear: 1864,
    publishedDisplay: "1864 (visit 1863–64)",
    notes:
      "Read in this session (full text of both volumes). Cited for the Hun-'tin (silk-cotton) and Loko trees and the Loko pottery; Hu the sea and the Hu-no 'considered the highest of all' priests at Whydah; Nate, 'the storekeeper of the sea', and Avrekete; Aydo-whe-do 'commonly called Danh, the Heavenly Snake'; and the Afa divination of the Buko-no. Burton was a British consul on a diplomatic mission, comparative and condescending by turns; his lists are a dated snapshot of what Whydah informants told him.",
  },
  {
    key: "wa_ellis_ewe_1890",
    title: "The Ewe-Speaking Peoples of the Slave Coast of West Africa: Their Religion, Manners, Customs, Laws, Languages, &c.",
    author: "A. B. Ellis",
    publisher: "Chapman and Hall, London",
    reference: "Ch. III 'General deities' (Mawu, Khebioso, Loko); ch. IV 'Tribal deities' (Dañh-gbi, the sea and its priest)",
    url: "https://archive.org/details/ewespeakingpeopl0000abel",
    sourceType: "primary",
    publishedYear: 1890,
    publishedDisplay: "1890",
    notes:
      "Read in part in this session. Cited for a British army officer's synthesis of Ewe and Fon religion: Mawu as chief god to whom sacrifice is 'never offered directly'; Loko 'chiefly sacrificed to in time of sickness'; the python spirit 'not worshipped, but rather its indwelling spirit'; the sea god's chief priest taking precedence at Whydah. Leans heavily on Burton and on informants at the coast; a colonial-era systematiser.",
  },
  {
    key: "wa_le_herisse_1911",
    title: "L'Ancien Royaume du Dahomey: mœurs, religion, histoire",
    author: "A. Le Hérissé",
    publisher: "Émile Larose, Paris",
    reference: "Part on religion (the vodun of Abomey, the royal ancestors, the Tohossou)",
    sourceType: "primary",
    publishedYear: 1911,
    publishedDisplay: "1911",
    notes:
      "Cited as the main French colonial administrator's account of Abomey religion written within twenty years of the conquest, from royal informants. Used for the existence of the systematised royal account of the vodun and the Tohossou; contents summarised from later scholarship that relies on it — NEEDS SOURCE VERIFICATION for any specific page.",
  },
  {
    key: "wa_spieth_1906",
    title: "Die Ewe-Stämme: Material zur Kunde des Ewe-Volkes in Deutsch-Togo",
    author: "Jakob Spieth",
    publisher: "Dietrich Reimer, Berlin",
    reference: "Traditions of the Ewe towns, including the departure from Notsie",
    sourceType: "primary",
    publishedYear: 1906,
    publishedDisplay: "1906",
    notes:
      "Cited for a Bremen (Norddeutsche) Mission missionary's large collection of Ewe oral traditions, town by town, recorded in Ewe with German translation — the documentary base for the Notsie dispersal tradition. Not read in this session; cited from its well-known place in Ewe historiography.",
  },
  {
    key: "wa_spieth_1911",
    title: "Die Religion der Eweer in Süd-Togo",
    author: "Jakob Spieth",
    publisher: "Vandenhoeck & Ruprecht, Göttingen / J. C. Hinrichs, Leipzig",
    reference: "The trɔwo, Mawu, Afa divination and the priesthoods of southern Togo",
    sourceType: "primary",
    publishedYear: 1911,
    publishedDisplay: "1911",
    notes:
      "Cited as the fullest early account of Ewe religion by a missionary who worked in Ewe and gave his informants' words in Ewe. A Protestant missionary's account, written to understand what conversion was replacing; its texts remain primary evidence. Not read in this session — NEEDS SOURCE VERIFICATION for specific passages.",
  },
  {
    key: "wa_aupiais_gadmer_1930",
    title: "Mission Dahomey, 9 January–14 May 1930: autochromes and films by Frédéric Gadmer for the Archives de la Planète",
    author: "Frédéric Gadmer (photographer), with Father Francis Aupiais",
    publisher: "Musée départemental Albert-Kahn (Département des Hauts-de-Seine)",
    reference: "Autochromes A63204–A64245 and related numbers; original captions transcribed on each Commons file page",
    url: "https://commons.wikimedia.org/wiki/File:Un_chronoxyle_d%27Iroko_(ou_milicia_exclesa)_sacr%C3%A9_ou_arbre_f%C3%A9tiche_-_A63237S.jpg",
    sourceType: "museum",
    publishedYear: 1930,
    publishedDisplay: "photographed January–May 1930",
    notes:
      "Each file page read in this session. Cited for dated colour photographs of named shrines, trees, priests and devotees at Porto-Novo, Adjarra, Ouidah, Abomey and Zado in 1930, with their original French captions ('arbre fétiche', 'case du fétiche Dan', 'féticheuses de Sapata'). The mission was organised by a Catholic missionary who was also a sympathetic ethnographer; the vocabulary is colonial, the photographs are documents.",
  },

  // ---- Twentieth-century ethnography ---------------------------------------
  {
    key: "wa_herskovits_outline_1933",
    title: "An Outline of Dahomean Religious Belief",
    author: "Melville J. Herskovits and Frances S. Herskovits",
    publisher: "American Anthropological Association (Memoirs, no. 41)",
    reference: "Memoirs of the American Anthropological Association 41 (1933)",
    sourceType: "academic_paper",
    publishedYear: 1933,
    publishedDisplay: "1933 (fieldwork in Abomey 1931)",
    notes:
      "Cited for the systematised account of the Abomey pantheons — Nana Buluku, Mawu-Lisa and their children heading sky, earth and sea pantheons — and for Aido-Hwedo. A synthesis made from Abomey informants close to the royal family, which later literature repeated as 'Fon religion'. Contents known from later citation; NEEDS SOURCE VERIFICATION for page-level detail.",
  },
  {
    key: "wa_herskovits_dahomey_1938",
    title: "Dahomey: An Ancient West African Kingdom",
    author: "Melville J. Herskovits",
    publisher: "J. J. Augustin, New York",
    reference: "2 vols; vol. 2 on religion, the cult-houses, the vodunsi, the Tohossou, the Aziza and Fa",
    sourceType: "academic_book",
    publishedYear: 1938,
    publishedDisplay: "1938",
    notes:
      "Cited for the most influential mid-century ethnography of Abomey: cult-house organisation, seclusion of initiates, the sib ancestors (tohwiyo, tovodun), the royal Tohossou, the Aziza and the priesthood. Serious fieldwork with an Abomey-centred and court-centred bias that later scholars (Blier, Bay) correct.",
  },
  {
    key: "wa_herskovits_narrative_1958",
    title: "Dahomean Narrative: A Cross-Cultural Analysis",
    author: "Melville J. Herskovits and Frances S. Herskovits",
    publisher: "Northwestern University Press, Evanston",
    reference: "Myths of creation, Aido-Hwedo and the ordering of the world",
    sourceType: "academic_book",
    publishedYear: 1958,
    publishedDisplay: "1958",
    notes:
      "Cited for the published texts of Dahomean myth collected in 1931, including the narrative in which the serpent Aido-Hwedo carries the creator and coils beneath the earth. Narratives as told to the authors by particular tellers; NEEDS SOURCE VERIFICATION for the wording of individual tales.",
  },
  {
    key: "wa_maupoil_1943",
    title: "La géomancie à l'ancienne Côte des Esclaves",
    author: "Bernard Maupoil",
    publisher: "Institut d'Ethnologie, Paris (Travaux et mémoires, 42)",
    reference: "Chapters on the history and introduction of Fa in Dahomey, the bokonon, and the du (signs)",
    sourceType: "academic_book",
    publishedYear: 1943,
    publishedDisplay: "1943",
    notes:
      "Cited for the classic study of Fa by a colonial administrator trained in ethnology, including the traditions that place Fa's arrival in Abomey from the east in the early eighteenth century. NEEDS SOURCE VERIFICATION for the reign to which each tradition attributes the arrival.",
  },
  {
    key: "wa_parrinder_1949",
    title: "West African Religion: A Study of the Beliefs and Practices of Akan, Ewe, Yoruba, Ibo, and Kindred Peoples",
    author: "Geoffrey Parrinder",
    publisher: "Epworth Press, London",
    reference: "Chapters on supreme beings (Nana Buluku, Mawu, Olorun) and on the gods",
    sourceType: "academic_book",
    publishedYear: 1949,
    publishedDisplay: "1949",
    notes:
      "Cited for an early comparative survey that set Ewe, Fon and Yoruba religion side by side, including Nana Buluku. A Methodist scholar's comparative frame; cited for how the comparison was first drawn, not as the last word on it.",
  },
  {
    key: "wa_verger_1957",
    title: "Notes sur le culte des Orisa et Vodun à Bahia, la Baie de tous les Saints, au Brésil et à l'ancienne Côte des Esclaves en Afrique",
    author: "Pierre Verger",
    publisher: "IFAN, Dakar (Mémoires de l'Institut Français d'Afrique Noire, 51)",
    reference: "Comparative sections on vodun and orisa on both sides of the Atlantic; Verger's hypothesis on Na Agontime and the Casa das Minas",
    sourceType: "academic_book",
    publishedYear: 1957,
    publishedDisplay: "1957",
    notes:
      "Cited for the first systematic two-sided comparison of vodun and orisa cults in Bénin, Nigeria and Bahia, and for Verger's identification of the founder of the Casa das Minas with the Dahomean queen Agontime — a hypothesis, recorded as such.",
  },
  {
    key: "wa_bascom_1969",
    title: "Ifa Divination: Communication between Gods and Men in West Africa",
    author: "William Bascom",
    publisher: "Indiana University Press, Bloomington",
    reference: "Introduction (the distribution of Ifa, Fa and Afa); the 256 figures; the verses",
    sourceType: "academic_book",
    publishedYear: 1969,
    publishedDisplay: "1969",
    notes:
      "Cited for the standard ethnography of Yoruba Ifá and for its documented distribution among the Fon (Fa), Ewe (Afa) and others, and for the binary structure of 16 × 16 figures shared across them.",
  },
  {
    key: "wa_abimbola_1976",
    title: "Ifá: An Exposition of Ifá Literary Corpus",
    author: "Wande Abimbola",
    publisher: "Oxford University Press Nigeria, Ibadan",
    reference: "The odù and ẹsẹ (verses); Ọ̀rúnmìlà",
    sourceType: "academic_book",
    publishedYear: 1976,
    publishedDisplay: "1976",
    notes:
      "Cited for an account of the Ifá corpus by a Yoruba scholar who is also an initiated babaláwo: Ọ̀rúnmìlà as the orisha of Ifá and the verse corpus as the body of knowledge. Insider scholarship, cited as such.",
  },
  {
    key: "wa_blier_1995",
    title: "African Vodun: Art, Psychology, and Power",
    author: "Suzanne Preston Blier",
    publisher: "University of Chicago Press",
    reference: "Chapters on bocio, on vodun as 'powers', and on the historical layering of cults in Fon and Ewe country",
    sourceType: "academic_book",
    publishedYear: 1995,
    publishedDisplay: "1995",
    notes:
      "Cited for the argument that vodun are best understood as powers addressed through objects and persons, and for her corrections of the Abomey-centred pantheon. Art-historical fieldwork across southern Bénin and Togo.",
  },
  {
    key: "wa_bay_1998",
    title: "Wives of the Leopard: Gender, Politics, and Culture in the Kingdom of Dahomey",
    author: "Edna G. Bay",
    publisher: "University of Virginia Press, Charlottesville",
    reference: "Chapters on Hwanjile and the introduction of Mawu-Lisa; on the Tohossou and Zomadonu; on the royal ancestors",
    sourceType: "academic_book",
    publishedYear: 1998,
    publishedDisplay: "1998",
    notes:
      "Cited for the political history of Dahomean religion: the eighteenth-century introduction of the Mawu-Lisa cult from Aja country under Tegbesu and the kpojito Hwanjile, the Tohossou and the royal ancestor cult. Based on oral history and European records; the reign-dates are historians' reconstructions.",
  },
  {
    key: "wa_law_slave_coast_1991",
    title: "The Slave Coast of West Africa 1550–1750: The Impact of the Atlantic Slave Trade on an African Society",
    author: "Robin Law",
    publisher: "Clarendon Press, Oxford",
    reference: "Ch. 4 on religion; the Tado and Allada traditions; Hueda",
    sourceType: "academic_book",
    publishedYear: 1991,
    publishedDisplay: "1991",
    notes:
      "Cited for the critical reading of the Tado–Allada origin traditions and of European accounts of Hueda and Allada religion, and for the chronology of the coastal kingdoms. The standard historian's treatment of the period.",
  },
  {
    key: "wa_law_ouidah_2004",
    title: "Ouidah: The Social History of a West African Slaving 'Port' 1727–1892",
    author: "Robin Law",
    publisher: "Ohio University Press, Athens OH / James Currey, Oxford",
    reference: "Ch. 1 on the founding traditions of Ouidah and Kpassè; chapters on the religious quarters and priestly lineages",
    sourceType: "academic_book",
    publishedYear: 2004,
    publishedDisplay: "2004",
    notes:
      "Cited for the founding tradition of Ouidah attributed to Kpassè, for the Hueda priestly lineages that survived the Dahomean conquest of 1727 (including the Dangbe and Hu priesthoods), and for the town's religious topography. NEEDS SOURCE VERIFICATION for page references.",
  },
  {
    key: "wa_capo_1991",
    title: "A Comparative Phonology of Gbe",
    author: "Hounkpati B. C. Capo",
    publisher: "Foris / Labo Gbe, Berlin and Garome",
    reference: "Definition and classification of the Gbe cluster (Ewe, Aja, Fon, Gen, Phla-Pherá)",
    sourceType: "academic_book",
    publishedYear: 1991,
    publishedDisplay: "1991",
    notes:
      "Cited for the linguistic definition of 'Gbe' as one dialect continuum running from south-eastern Ghana to south-western Nigeria, which is why the same religious vocabulary (vodu, -si, -no, hun) recurs across Ewe, Gen, Aja, Fon and Gun. A comparative phonology, not a study of religion.",
  },
  {
    key: "wa_norman_2009",
    title: "Powerful Pots, Humbling Holes, and Regional Ritual Processes: Towards an Archaeology of Huedan Vodun, ca. 1650–1727",
    author: "Neil L. Norman",
    publisher: "African Archaeological Review 26 (2009)",
    reference: "African Archaeological Review 26: 187–218",
    sourceType: "academic_paper",
    publishedYear: 2009,
    publishedDisplay: "2009",
    notes:
      "Cited for the only sustained archaeological attempt to identify vodun ritual deposits in the Hueda kingdom before 1727, and for its method: ritual is inferred from pots, pits and their placement, never read off them. Archaeology that extends the documented picture sideways, not backwards.",
  },

  // ---- Ewe and Togo ---------------------------------------------------------
  {
    key: "wa_greene_1996_supreme",
    title: "Religion, History and the Supreme Gods of Africa: A Contribution to the Debate",
    author: "Sandra E. Greene",
    publisher: "Journal of Religion in Africa 26, no. 2 (1996)",
    reference: "Journal of Religion in Africa 26(2): 122–138, doi:10.1163/157006696x00037",
    sourceType: "academic_paper",
    publishedYear: 1996,
    publishedDisplay: "1996",
    notes:
      "Cited for the historian's case that African 'supreme gods' — Mawu among the Ewe and Fon among them — have histories: their prominence changed over time and in contact with neighbours and missionaries. Bibliographic record confirmed in this session; the argument is summarised from the literature on the debate — NEEDS SOURCE VERIFICATION for her exact formulation.",
  },
  {
    key: "wa_greene_1996_anlo",
    title: "Gender, Ethnicity, and Social Change on the Upper Slave Coast: A History of the Anlo-Ewe",
    author: "Sandra E. Greene",
    publisher: "Heinemann, Portsmouth NH / James Currey, London",
    reference: "Chapters on the introduction of new religious orders, including Yewe, into Anlo in the nineteenth century",
    sourceType: "academic_book",
    publishedYear: 1996,
    publishedDisplay: "1996",
    notes:
      "Cited for the documented arrival of new religious orders in Anlo from the east, Yewe among them, and for how they reshaped kinship, gender and ethnicity. NEEDS SOURCE VERIFICATION for the date of Yewe's arrival.",
  },
  {
    key: "wa_greene_2002",
    title: "Sacred Sites and the Colonial Encounter: A History of Meaning and Memory in Ghana",
    author: "Sandra E. Greene",
    publisher: "Indiana University Press, Bloomington",
    reference: "Chapters on Anlo sacred groves, water and the Bremen Mission",
    sourceType: "academic_book",
    publishedYear: 2002,
    publishedDisplay: "2002",
    notes:
      "Cited for how Anlo-Ewe sacred places — groves, lagoons, burial grounds — changed meaning under German missionary and British colonial rule, and for the role of the Bremen Mission's translation work. Bibliographic record and a review seen in this session.",
  },
  {
    key: "wa_meyer_1999",
    title: "Translating the Devil: Religion and Modernity among the Ewe in Ghana",
    author: "Birgit Meyer",
    publisher: "Edinburgh University Press (for the International African Institute)",
    reference: "Ch. 3 on the Bremen missionaries' translation of 'God' as Mawu and of the devil as Abosam; ch. on trɔwo as demons",
    sourceType: "academic_book",
    publishedYear: 1999,
    publishedDisplay: "1999",
    notes:
      "Cited for the documented choice of the Bremen (Norddeutsche) Mission to render the Christian God as Mawu in Ewe, and to class the trɔwo as demons — the translation decision at the centre of the 'supreme god' debate.",
  },
  {
    key: "wa_rosenthal_1998",
    title: "Possession, Ecstasy, and Law in Ewe Voodoo",
    author: "Judy Rosenthal",
    publisher: "University of Virginia Press, Charlottesville",
    reference: "Chapters on Gorovodu (the kola gods from the north) and Mama Tchamba among the Ewe of coastal Togo and Ghana",
    url: "https://www.upress.virginia.edu/title/2273/",
    sourceType: "academic_book",
    publishedYear: 1998,
    publishedDisplay: "1998",
    notes:
      "Cited for eleven years' fieldwork on Gorovodu and Mama Tchamba, the Ewe 'medicine vodu' orders whose spirits are those of northern people bought by southern lineages; Rosenthal reads their ritual as law and moral memory. Publisher's page found in this session; the content is the author's knowledge of the book.",
  },
  {
    key: "wa_wendl_1999",
    title: "Slavery, Spirit Possession and Ritual Consciousness: The Tchamba Cult among the Mina of Togo",
    author: "Tobias Wendl",
    publisher: "In H. Behrend and U. Luig (eds), Spirit Possession, Modernity and Power in Africa (James Currey / University of Wisconsin Press)",
    reference: "pp. 111–123",
    sourceType: "academic_paper",
    publishedYear: 1999,
    publishedDisplay: "1999",
    notes:
      "Cited for Mama Tchamba among the Mina (Gen) of the Togolese coast: a cult in which descendants of slave-owning lineages honour the spirits of the enslaved northerners their ancestors bought. NEEDS SOURCE VERIFICATION for the page range.",
  },
  {
    key: "wa_montgomery_vannier_2017",
    title: "An Ethnography of a Vodu Shrine in Southern Togo: Of Spirit, Slave and Sea",
    author: "Eric J. Montgomery and Christian N. Vannier",
    publisher: "Brill, Leiden",
    reference: "Chapters on Gorovodu, Mama Tchamba and Mami Wata at one shrine",
    sourceType: "academic_book",
    publishedYear: 2017,
    publishedDisplay: "2017",
    notes:
      "Cited for a recent single-shrine ethnography in which Gorovodu, Mama Tchamba and Mami Wata are served side by side, showing how 'slave spirits' and sea spirits combine in present practice. Bibliographic details from the authors' publication lists seen in search results.",
  },

  // ---- Mami Wata ------------------------------------------------------------
  {
    key: "wa_drewal_1988",
    title: "Performing the Other: Mami Wata Worship in Africa",
    author: "Henry John Drewal",
    publisher: "TDR: The Drama Review 32, no. 2 (1988)",
    reference: "TDR 32(2): 160–185",
    sourceType: "academic_paper",
    publishedYear: 1988,
    publishedDisplay: "1988",
    notes:
      "Cited for the argument that Mami Wata worship incorporates foreignness — European, Indian — as a source of power, and for the chromolithograph of a snake charmer that shaped her image. NEEDS SOURCE VERIFICATION for page numbers.",
  },
  {
    key: "wa_drewal_2008",
    title: "Sacred Waters: Arts for Mami Wata and Other Divinities in Africa and the Diaspora",
    author: "Henry John Drewal (ed.)",
    publisher: "Indiana University Press, Bloomington",
    reference: "Introduction and essays on the snake-charmer print (Hamburg, 1880s) and its Indian reprints; Mami Wata in Togo and Bénin",
    sourceType: "academic_book",
    publishedYear: 2008,
    publishedDisplay: "2008",
    notes:
      "Cited for the documented history of Mami Wata imagery: a chromolithograph printed in Hamburg in the 1880s, reprinted and copied in Africa and India in the twentieth century; and for Mami Wata shrines in the Gbe-speaking region. Contents known from the volume and its summaries; individual details marked where unverified.",
  },

  // ---- Yoruba comparison and derivation theories -----------------------------
  {
    key: "wa_lucas_1948",
    title: "The Religion of the Yorubas, Being an Account of the Religious Beliefs and Practices of the Yoruba Peoples of Southern Nigeria, Especially in Relation to the Religion of Ancient Egypt",
    author: "J. Olumide Lucas",
    publisher: "C.M.S. Bookshop, Lagos",
    reference: "Whole work; the comparison of Yoruba divine names and words with Egyptian ones",
    sourceType: "book",
    publishedYear: 1948,
    publishedDisplay: "1948",
    notes:
      "Cited as the classic statement of the theory that Yoruba religion derives from ancient Egypt, argued from resemblances of words, divine names and practices. Its title and argument are confirmed by the bibliographic record and Wikipedia's article on Lucas (read in this session). Cited as a proponent of the theory, not as evidence for it.",
  },
  {
    key: "wa_diop_1974",
    title: "The African Origin of Civilization: Myth or Reality",
    author: "Cheikh Anta Diop (trans. Mercer Cook)",
    publisher: "Lawrence Hill, New York / Westport (from Nations nègres et culture, 1954, and Antériorité des civilisations nègres, 1967)",
    reference: "Arguments for Egypt as a Black African civilisation and for cultural continuity between Egypt and West Africa",
    sourceType: "book",
    publishedYear: 1974,
    publishedDisplay: "French 1954 and 1967; English 1974",
    notes:
      "Cited for the most influential argument for a cultural unity linking ancient Egypt to the rest of Africa, on which later popular claims of an Egyptian origin for Vodun and Orisha religion draw. Diop's thesis is about civilisational unity in general, not a documented route for any West African cult — that distinction is what the derivation record is about.",
  },
  {
    key: "wa_olupona_2011",
    title: "City of 201 Gods: Ilé-Ifẹ̀ in Time, Space, and the Imagination",
    author: "Jacob K. Olupona",
    publisher: "University of California Press, Berkeley",
    reference: "Introduction and chapters on Ifẹ̀ as a sacred centre and on the orisha cults of the city",
    sourceType: "academic_book",
    publishedYear: 2011,
    publishedDisplay: "2011",
    notes:
      "Cited for the Yoruba side of the comparison: Ilé-Ifẹ̀ as the ritual centre of orisha religion, with its own named cults and festivals, and for current scholarship's treatment of Yoruba religion as historically local rather than as a transplant from elsewhere.",
  },
  {
    key: "wa_unesco_ifa",
    title: "Ifa divination system (Nigeria), inscribed on the Representative List of the Intangible Cultural Heritage of Humanity",
    author: "UNESCO",
    publisher: "UNESCO Intangible Cultural Heritage section",
    reference: "Element 00146; proclaimed 2005, inscribed 2008 (3.COM)",
    url: "https://ich.unesco.org/en/RL/ifa-divination-system-00146",
    sourceType: "government",
    publishedYear: 2008,
    publishedDisplay: "2008",
    notes:
      "Cited for the official description of Ifá as a corpus of texts and 'mathematical formulas' interpreted by babalawo, practised among Yoruba communities and in the diaspora, and for its inscription date. Page found in search results in this session.",
  },

  // ---- The Atlantic and the diaspora ---------------------------------------
  {
    key: "wa_matory_2005",
    title: "Black Atlantic Religion: Tradition, Transnationalism, and Matriarchy in the Afro-Brazilian Candomblé",
    author: "J. Lorand Matory",
    publisher: "Princeton University Press",
    reference: "Chapters on the two-way Atlantic traffic that shaped 'Yoruba' and 'Jeje' identity",
    sourceType: "academic_book",
    publishedYear: 2005,
    publishedDisplay: "2005",
    notes:
      "Cited for the argument that African and American religious traditions shaped each other across the Atlantic in both directions, so that present-day resemblance can reflect later contact as well as descent.",
  },
  {
    key: "wa_pares_2013",
    title: "The Formation of Candomblé: Vodun History and Ritual in Brazil",
    author: "Luis Nicolau Parés",
    publisher: "University of North Carolina Press, Chapel Hill (Portuguese original 2006)",
    reference: "Chapters on the Jeje nation, Dan/Bessen, Nanã and the vodun of Bahia",
    sourceType: "academic_book",
    publishedYear: 2013,
    publishedDisplay: "Portuguese 2006; English 2013",
    notes:
      "Cited for the documented Gbe (Jeje) strand in Bahian Candomblé — vodun names, the serpent Bessen (Dan), Nanã — and for Parés's careful separation of name-correspondence from proof of continuous transmission.",
  },
  {
    key: "wa_pares_2016",
    title: "O rei, o pai e a morte: a religião vodum na antiga Costa dos Escravos na África Ocidental",
    author: "Luis Nicolau Parés",
    publisher: "Companhia das Letras, São Paulo",
    reference: "Chapters on the earliest documented vodun cults of Allada and Hueda and on the royal ancestor cult",
    sourceType: "academic_book",
    publishedYear: 2016,
    publishedDisplay: "2016",
    notes:
      "Cited for the most thorough modern history of vodun religion on the Slave Coast from the seventeenth century, built from European documents read against oral traditions: what can be dated, and what cannot.",
  },
  {
    key: "wa_ferretti_1996",
    title: "Querebentan de Zomadonu: etnografia da Casa das Minas do Maranhão",
    author: "Sergio Ferretti",
    publisher: "EDUFMA, São Luís (2nd edition; first edition 1985)",
    reference: "Whole work; the vodun of the Davice (royal) family and Zomadonu",
    sourceType: "academic_book",
    publishedYear: 1996,
    publishedDisplay: "1985; 2nd ed. 1996",
    notes:
      "Cited for the ethnography of the Casa das Minas in São Luís, whose house is named for Zomadonu and whose vodun include the Dahomean royal family — the strongest documented name-correspondence for the Tohossou outside Africa.",
  },
  {
    key: "wa_deren_1953",
    title: "Divine Horsemen: The Living Gods of Haiti",
    author: "Maya Deren",
    publisher: "Thames and Hudson, London / Vanguard, New York",
    reference: "Chapters on Legba, Danbala and Ayida Wedo, Agwe, Loko and the Gede",
    sourceType: "book",
    publishedYear: 1953,
    publishedDisplay: "1953",
    notes:
      "Cited for the Haitian side of several comparisons: Danbala and Ayida Wedo as serpent and rainbow, Agwe of the sea, Loko of the trees and the priesthood, the Gede and the dead. A film-maker and initiate's account, cited as such.",
  },
  {
    key: "wa_metraux_1959",
    title: "Voodoo in Haiti",
    author: "Alfred Métraux (trans. Hugo Charteris)",
    publisher: "Oxford University Press, New York (French original 1958)",
    reference: "Chapters on the lwa, the dead, the trees of the lwa (mapou), and the houngan",
    sourceType: "academic_book",
    publishedYear: 1959,
    publishedDisplay: "French 1958; English 1959",
    notes:
      "Cited for the ethnographic description of Haitian Vodou's treatment of trees as resting-places of the lwa, of the dead and the Gede, and of the rites that recover a dead person's spirit 'from under the water'.",
  },
  {
    key: "wa_thompson_1983",
    title: "Flash of the Spirit: African and Afro-American Art and Philosophy",
    author: "Robert Farris Thompson",
    publisher: "Random House, New York",
    reference: "Chapters on Yoruba, Fon and Kongo art and their American descendants, including sacred trees",
    sourceType: "academic_book",
    publishedYear: 1983,
    publishedDisplay: "1983",
    notes:
      "Cited for the influential (and sometimes over-confident) art-historical case for African continuities in American religious art, including the sacred silk-cotton tree. Cited for the comparison as he drew it; his attributions of particular forms to particular origins are themselves contested.",
  },
  {
    key: "wa_cabrera_1954",
    title: "El Monte: Igbo-Finda, Ewe Orisha, Vititi Nfinda",
    author: "Lydia Cabrera",
    publisher: "Ediciones C.R., Havana",
    reference: "Chapters on the ceiba (Iroko) and the sacred bush in Afro-Cuban religion",
    sourceType: "book",
    publishedYear: 1954,
    publishedDisplay: "1954",
    notes:
      "Cited for the Afro-Cuban treatment of the ceiba as the dwelling of Iroko and the dead, and of 'el monte' (the bush) as the source of all religious power — the Cuban side of the trees comparison, recorded from practitioners in the 1940s–50s.",
  },
  {
    key: "wa_brown_1991",
    title: "Mama Lola: A Vodou Priestess in Brooklyn",
    author: "Karen McCarthy Brown",
    publisher: "University of California Press, Berkeley",
    reference: "Chapters on Gede and on family spirits (the dead of the lineage)",
    sourceType: "academic_book",
    publishedYear: 1991,
    publishedDisplay: "1991",
    notes:
      "Cited for the Haitian Vodou treatment of the family dead and of Gede in a living practitioner's household, for the ancestors comparison.",
  },
  {
    key: "wa_sweet_2011",
    title: "Domingos Álvares, African Healing, and the Intellectual History of the Atlantic World",
    author: "James H. Sweet",
    publisher: "University of North Carolina Press, Chapel Hill",
    reference: "Chapters 1–2 on vodun healing and Sakpata-related knowledge in the Mahi region before enslavement",
    sourceType: "academic_book",
    publishedYear: 2011,
    publishedDisplay: "2011",
    notes:
      "Cited for an eighteenth-century Gbe healer whose Inquisition records show vodun healing knowledge — leaves, water, earth, and the power to name the cause of illness — travelling with one person from the Bight of Benin to Brazil and Portugal.",
  },

  // ---- Groves, place and practice --------------------------------------------
  {
    key: "wa_juhe_beaulaton_2008",
    title: "Sacred Forests and the Global Challenge of Biodiversity Conservation: The Case of Benin and Togo",
    author: "Dominique Juhé-Beaulaton",
    publisher: "Journal for the Study of Religion, Nature and Culture 2, no. 3 (2008)",
    reference: "JSRNC 2(3): 351–372",
    sourceType: "academic_paper",
    publishedYear: 2008,
    publishedDisplay: "2008",
    notes:
      "Cited for a historian of the Slave Coast's environment on vodun sacred groves: their histories as settlement sites, burial places and cult houses, and their recent reframing as biodiversity reserves. NEEDS SOURCE VERIFICATION for volume and pages.",
  },
  {
    key: "wa_rush_2013",
    title: "Vodun in Coastal Bénin: Unfinished, Open-Ended, Global",
    author: "Dana Rush",
    publisher: "Vanderbilt University Press, Nashville",
    reference: "Chapters on Mami Wata, on the absorption of foreign images into vodun, and on shrines as accumulations",
    sourceType: "academic_book",
    publishedYear: 2013,
    publishedDisplay: "2013",
    notes:
      "Cited for vodun as an open, accumulating system that takes in new powers and images — Mami Wata, Hindu prints, Christian saints — without ceasing to be itself.",
  },
  {
    key: "wa_kpasse_heritage_guide",
    title: "Tourism in Ouidah: a practical guide to exploring the historic city",
    author: "Republic of Bénin, official portal",
    publisher: "benin.bj",
    url: "https://benin.bj/en/news/tourism-in-ouidah-a-practical-guide-to-exploring-the-historic-city",
    sourceType: "government",
    publishedYear: 2024,
    publishedDisplay: "accessed October 2026",
    notes:
      "Cited only for the present-day public account of the Kpassè forest as given to visitors — the king who became an iroko tree — i.e. as evidence of how the tradition is told now, not as evidence for the sixteenth or seventeenth century. Found in search results in this session.",
  },
  {
    key: "wa_practitioner_tradition",
    title: "Vodun teaching and narrative as transmitted by priests, devotees and lineage elders",
    author: "Practitioners of Vodun in Bénin, Togo and south-eastern Ghana (as recorded by observers)",
    reference: "Oral tradition; recorded in the ethnographies cited alongside it in each claim",
    sourceType: "oral_tradition",
    notes:
      "Cited where a record states what the tradition itself says — that a power is primordial, that a king became a tree, that a vodun came from a named place. Always paired with the written source in which the statement was recorded, so a reader can see who wrote it down and when.",
  },
  {
    key: "wa_wikipedia",
    title: "Wikipedia articles on Nana Buluku, Dahomean religion, Ayida Wedo, Loco (loa), Aziza, Agassou, Casa das Minas, Mami Wata, Hwanjile, Notsé, Ewe people and Olumide Lucas",
    author: "Wikipedia contributors",
    workTitle: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Dahomean_religion",
    sourceType: "wikipedia",
    publishedYear: 2026,
    publishedDisplay: "read October 2026",
    notes:
      "Read in this session. Used only as a navigation aid and cross-check — for the spellings and variants of names (Aido-Hwedo / Aydo-whe-do / Ayida Wedo; Loko / Loco), and for which scholars the articles rely on. Never the sole source for a claim.",
  },
];

// ---------------------------------------------------------------------------
// Pictures (every file page fetched in this session)
// ---------------------------------------------------------------------------

const KAHN = "Musée départemental Albert-Kahn (Département des Hauts-de-Seine)";

const P = {
  kpasseTree: commonsPicture({
    fileName: "Arbre de l'incarnation du roi KPASSE LOKO, fondateur de la ville historique et de la forêt sacré de KPASSE OUIDAH au Bénin.jpg",
    caption:
      "The tree pointed out at Ouidah as the incarnation of King Kpassè, founder of the town and of the sacred forest. A modern photograph (2019) of a living tree; the identification of this tree with the king is the tradition's own, recorded here as tradition.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Yelouassi",
    objectDate: "photographed April 2019",
  }),
  kpasseForest: commonsPicture({
    fileName: "Sacred Forest Ouidah Benin Jan 2018.jpg",
    caption: "The sacred forest of Kpassè at Ouidah in January 2018: a remnant grove in the middle of the town, now kept as a heritage site with modern sculptures among the trees.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Kulttuurinavigaattori",
    objectDate: "photographed January 2018",
  }),
  kpasseEntrance: commonsPicture({
    fileName: "Entrée principale de la Forêt sacrée de Kpassè.jpg",
    caption: "The main entrance to the Kpassè sacred forest, Ouidah, photographed in 2026. The gateway is modern; the grove behind it is the old one.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Step may",
    objectDate: "photographed January 2026",
  }),
  kpasseConvent: commonsPicture({
    fileName: "Entrée du couvant de La Forêt Sacrée de Kpassè.jpg",
    caption: "The entrance to the convent (initiation enclosure) inside the Kpassè sacred forest, Ouidah, photographed in 2019. Only the threshold is public; what lies beyond it is for initiates.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Rachad sanoussi",
    objectDate: "photographed June 2019",
  }),
  kpasseGiantTree: commonsPicture({
    fileName: "Faux fromager géant à la Forêt Sacrée de Kpassè.jpg",
    caption: "A giant tree in the Kpassè forest, labelled by the photographer a 'faux fromager' (a kapok or silk-cotton type). Photographed 2019; the botanical identification is the photographer's, not checked here.",
    shows: "site",
    identificationStatus: "probable",
    licence: "CC BY-SA 4.0",
    creator: "Rachad sanoussi",
    objectDate: "photographed June 2019",
  }),
  kpasseDiviner: commonsPicture({
    fileName: "Devin à la Forêt Sacrée de Kpassè.jpg",
    caption: "A diviner at the Kpassè sacred forest, Ouidah, photographed in 2019 — a present-day practitioner, not a historical image.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Rachad sanoussi",
    objectDate: "photographed June 2019",
  }),
  tadoRemains: commonsPicture({
    fileName: "Vestiges du Royaume de Tado 24.jpg",
    caption: "Remains of old Tado, on the Togolese side of the Mono, photographed in 2024 and filed by the photographer as 'vestiges of the kingdom of Tado'. What the visible remains are, and how old, is not established by the photograph.",
    shows: "site",
    identificationStatus: "probable",
    licence: "CC BY-SA 4.0",
    creator: "Ubkoumbogny",
    objectDate: "photographed October 2024",
  }),
  tadoRemains2: commonsPicture({
    fileName: "Vestiges du Royaume de Tado 47.jpg",
    caption: "A second view among the 'vestiges of the kingdom of Tado', photographed in 2024 on the same visit. A different subject from the first view, not a crop of it.",
    shows: "site",
    identificationStatus: "probable",
    licence: "CC BY-SA 4.0",
    creator: "Ubkoumbogny",
    objectDate: "photographed October 2024",
  }),
  tadoMap: commonsPicture({
    fileName: "Togo Tado.png",
    caption: "A modern map of the canton of Tado in Togo's Plateaux region (2025), showing where the town that Aja traditions name as their origin lies today, close to the Bénin border.",
    shows: "map",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Agbeve",
    objectDate: "drawn December 2025",
  }),
  legbaAwouto: commonsPicture({
    fileName: "Divinite-vodun-legba-lac-sacre-awouto-allada-benin.jpg",
    caption: "A Legba figure on the shore of the sacred lake Awouto at Togoudo in the commune of Allada, photographed on the national Vodun holiday, 10 January 2022. A living shrine, photographed recently.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Netho639",
    objectDate: "photographed 10 January 2022",
  }),
  kahnIrokoAdjarra: commonsPicture({
    fileName: "Un chronoxyle d'Iroko (ou milicia exclesa) sacré ou arbre fétiche - A63237S.jpg",
    caption: "A sacred iroko at Adjarra, near Porto-Novo, photographed in colour (autochrome) by Frédéric Gadmer on 19 January 1930. The original caption reads 'Arbre fétiche (Zozo)'. A dated document of a tree under cult.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A63237S",
    objectDate: "19 January 1930",
  }),
  kahnIrokoPortoNovo: commonsPicture({
    fileName: "Un enfant sur les racines d'un Iroko (ou milicia exclesa) sacré - A63409S.jpg",
    caption: "A child sitting on the roots of a sacred iroko at Porto-Novo, autochrome by Frédéric Gadmer, 5 February 1930 (original caption: 'Base d'un rocco').",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A63409S",
    objectDate: "5 February 1930",
  }),
  kahnIrokoVillage: commonsPicture({
    fileName: "Dans le village indigène, un Iroko (ou milicia exclesa) sacré ou arbre fétiche - A71105XS.jpg",
    caption: "A sacred iroko standing among houses at Porto-Novo, autochrome by Frédéric Gadmer, 7 April 1930: the tree as part of a settlement rather than of a wild forest.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A71105XS",
    objectDate: "7 April 1930",
  }),
  kahnTreeOuidah: commonsPicture({
    fileName: "Un arbre (sacré) dans le village - A64092S.jpg",
    caption: "UNVERIFIED — a large tree in Ouidah town, autochrome by Frédéric Gadmer, 2 May 1930. The archive's title calls it '(sacré)' with the word in brackets; its original caption says only 'village indigène', so whether this tree was under cult is not verified.",
    shows: "evidence_photograph",
    identificationStatus: "unverified",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A64092S",
    objectDate: "2 May 1930",
  }),
  kahnDanHouse: commonsPicture({
    fileName: "Case du fétiche Dan - A63204S.jpg",
    caption: "The house of the vodun Dan at Porto-Novo, with painted decoration, autochrome by Frédéric Gadmer, 15 January 1930 (original caption 'Case du fétiche Dan').",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A63204S",
    objectDate: "15 January 1930",
  }),
  kahnLegbaDan: commonsPicture({
    fileName: "Autels des fétiches Lègba et Dan - A64079S.jpg",
    caption: "Altars of Legba and Dan at Ouidah, autochrome by Frédéric Gadmer, 2 May 1930 (original caption 'Fétiches Dan et Legbaa').",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A64079S",
    objectDate: "2 May 1930",
  }),
  kahnSerpentPriest: commonsPicture({
    fileName: "Le chef féticheur du Serpent, prêtre au culte de Dangbé - A63271.jpg",
    caption: "The chief priest of the serpent (Dangbe) at Porto-Novo, autochrome by Frédéric Gadmer, 24 January 1930 — a named office photographed in its regalia.",
    shows: "portrait",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A63271",
    objectDate: "24 January 1930",
  }),
  kahnSerpentAltars: commonsPicture({
    fileName: "Autels chez le féticheur du Serpent - A64238S.jpg",
    caption: "Altars and sculpture in the compound of the serpent priest at Porto-Novo, autochrome by Frédéric Gadmer, 10 May 1930.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A64238S",
    objectDate: "10 May 1930",
  }),
  kahnPythonTemple: commonsPicture({
    fileName: "Le temple des Serpents ou temple des Pythons - A64056S.jpg",
    caption: "The temple of the serpent (Temple of Pythons) at Ouidah, autochrome by Frédéric Gadmer, 2 May 1930 — the earliest colour photograph of it identified here.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A64056S",
    objectDate: "2 May 1930",
  }),
  kahnSakpata: commonsPicture({
    fileName: "Deux féticheuses de Sakpata - A63575S.jpg",
    caption: "Two women devotees of Sakpata at Zado, Abomey, autochrome by Frédéric Gadmer, 28 February 1930 (original caption 'Féticheuses de Sapata (Variole)').",
    shows: "portrait",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A63575S",
    objectDate: "28 February 1930",
  }),
  kahnRoyalEmblems: commonsPicture({
    fileName: "Emblèmes des rois défunts au palais de null Glélé (dans l'adandjèho, \" case de courage \") - A63547S.jpg",
    caption: "Emblems of the dead kings kept in the palace of Glèlè at Abomey, autochrome by Frédéric Gadmer, 26 February 1930: the royal dead remembered through objects.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A63547S",
    objectDate: "26 February 1930",
  }),
  kahnConvent: commonsPicture({
    fileName: "Couvent du fétiche zozo - A63253.jpg",
    caption: "A convent (initiation house) of a vodun at Adjarra, autochrome by Frédéric Gadmer, 19 January 1930 (original caption 'Couvent fétichiste zozo').",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A63253",
    objectDate: "19 January 1930",
  }),
  kahnHealingAltar: commonsPicture({
    fileName: "Autel du fétiche Djéholou - A63264S.jpg",
    caption: "The altar of a vodun named Djéholou at Adjarra, autochrome by Frédéric Gadmer, 19 January 1930. The archive files it under prophylaxis and illness — a shrine approached for healing.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A63264S",
    objectDate: "19 January 1930",
  }),
  kahnSquareAltar: commonsPicture({
    fileName: "Autel de fétiche sur une place de la ville indigène - A63739S.jpg",
    caption: "An altar on a public square in Porto-Novo, autochrome by Frédéric Gadmer, 7 April 1930; the archive classes it under both vodun cult and ancestor cult.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A63739S",
    objectDate: "7 April 1930",
  }),
  kahnGleleTomb: commonsPicture({
    fileName: "Femmes agenouillées devant le tombeau de null Glélé - A63536S.jpg",
    caption: "Women kneeling before the tomb of King Glèlè in the palace at Abomey, autochrome by Frédéric Gadmer, 20 February 1930.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Gadmer Frédéric",
    institution: KAHN,
    accessionNumber: "A63536S",
    objectDate: "20 February 1930",
  }),
  fortierAbomey1912: commonsPicture({
    fileName: "Féticheurs-Abomey-1912.jpg",
    caption: "Postcard photograph by François-Edmond Fortier, 1912: 'Féticheurs et féticheuses à Abomey' — priests and devotees at Abomey twenty years after the conquest, with the postcard's colonial caption.",
    shows: "evidence_photograph",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "François-Edmond Fortier",
    objectDate: "1912",
  }),
  barbotMap: commonsPicture({
    fileName: "Suite de la coste de Guinée depuis la rivière de Volta jusqu'à Jakin ou sont les royaumes de Koto, de Popo, de Whidah ou Juda et d'Ardra - (Jean Barbot) - btv1b8595586k.jpg",
    caption: "Map of the coast from the Volta to Jakin, with the kingdoms of Koto, Popo, Whidah (Juda) and Ardra (Allada), after Jean Barbot, in a printing dated 1747 (Bibliothèque nationale de France). An eighteenth-century European map: it shows how the coast was known to traders, not where its shrines were.",
    shows: "map",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Jean Barbot (cartographer)",
    institution: "Bibliothèque nationale de France, Cartes et plans, GE DD-2987 (8226)",
    objectDate: "1747",
  }),
  gbeMap: commonsPicture({
    fileName: "Gbe languages.png",
    caption: "A modern linguistic map of the Gbe languages — Ewe, Gen, Aja, Fon, Gun and others — from south-eastern Ghana to south-western Nigeria (2004 diagram).",
    shows: "map",
    identificationStatus: "secure",
    licence: "CC BY 2.5",
    creator: "Mark Dingemanse",
    objectDate: "2004",
  }),
  slaveCoastMap: commonsPicture({
    fileName: "Slave Coast map.png",
    caption: "A modern map of the 'Slave Coast' polities (2017 diagram) — useful for locating Hueda, Allada, Dahomey and the Ewe and Gen towns; its borders are a modern simplification.",
    shows: "map",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Maattik",
    objectDate: "2017",
  }),
  bosmanPortrait: commonsPicture({
    fileName: "Portret van Willem Bosman, RP-P-OB-88.051.jpg",
    caption: "Willem Bosman, chief merchant of the Dutch West India Company in Guinea, in an anonymous engraving made between 1702 and 1704 (Rijksmuseum) — a portrait print of the author, not a picture of anything he described.",
    shows: "engraving",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Anonymous printmaker (Rijksmuseum)",
    institution: "Rijksmuseum, Amsterdam",
    accessionNumber: "RP-P-OB-88.051",
    objectDate: "1702–1704",
  }),
  burtonPortrait: commonsPicture({
    fileName: "Richard Francis Burton by Rischgitz, 1864.jpg",
    caption: "Richard Francis Burton, photographed in 1864, the year his Mission to Gelele was published.",
    shows: "portrait",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Rischgitz/Stringer",
    objectDate: "1864",
  }),
  pythonOuidah: commonsPicture({
    fileName: "Python royal.jpg",
    caption: "A royal python (Python regius) at the Temple of Pythons in Ouidah, photographed in 2019 — the animal that is Dangbe's vessel, not Dangbe.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Padonou Dotou",
    objectDate: "photographed April 2019",
  }),
  veveDanbala: commonsPicture({
    fileName: "VeveDamballah.svg",
    caption: "A vèvè (ritual ground drawing) for Danbala and Ayida Wedo of Haitian Vodou, two serpents about a central post, redrawn as a modern digital diagram (2005–2007). It is a Haitian form, not a West African one.",
    shows: "diagram",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "chris 論",
    objectDate: "2005–2007 (digital redrawing)",
  }),
  dambalaFlag: commonsPicture({
    fileName: "Collectie Nationaal Museum van Wereldculturen AM-670-9 Dambala Haiti.jpg",
    caption: "A sequinned Haitian Vodou ceremonial flag (drapo) for Danbala, in the Nationaal Museum van Wereldculturen. A twentieth-century Haitian object; date not stated on the file page.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "Public domain",
    institution: "Nationaal Museum van Wereldculturen",
    accessionNumber: "AM-670-9",
  }),
  oshumareImage: commonsPicture({
    fileName: "Oshumare.jpg",
    caption: "A modern devotional image (2020) of Oshumare, the Yoruba rainbow-serpent orisha, as represented in Cuban-style practice. A contemporary artwork, not an old one.",
    shows: "later_artwork",
    identificationStatus: "modern_interpretation",
    licence: "CC BY-SA 4.0",
    creator: "Awoalex",
    objectDate: "2020",
  }),
  gedeLeogane: commonsPicture({
    fileName: "Gede nan Leyogan (Ayiti).jpg",
    caption: "Gede celebrations at Léogâne, Haiti, around All Saints, photographed on 1 November 2024 — the Haitian festival of the dead, for the ancestors comparison.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Geelav",
    objectDate: "1 November 2024",
  }),
  gedeCross: commonsPicture({
    fileName: "Haiti, vodou, candelabri cerimoniali e croce gédé, 1950 ca.jpg",
    caption: "Haitian Vodou ceremonial candlesticks and a Gede cross, about 1950, in the Musée du quai Branly (photographed 2016).",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY 3.0",
    creator: "Sailko",
    institution: "Musée du quai Branly",
    objectDate: "c. 1950 (objects); photographed 2016",
  }),
  casaDasMinas: commonsPicture({
    fileName: "Vista externa da fachada da casa.jpg",
    caption: "The Casa das Minas (Querebentã de Zomadonu) in São Luís, Maranhão, Brazil, photographed in 2018 — a house of Jeje (Gbe) tradition named for Zomadonu.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "clecio muller frança leal",
    objectDate: "photographed September 2018",
  }),
  casaVodunsi: commonsPicture({
    fileName: "Quadro com vodunsis.jpg",
    caption: "A framed photograph, kept at the Casa das Minas, of vodunsis possessed by their vodun in 1982; re-photographed in 2023.",
    shows: "historical_document",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "César Aquino Bezerra",
    objectDate: "1982 (original photograph); 2023 (this photograph)",
  }),
  casaTree: commonsPicture({
    fileName: "CAJAZEIRA SAGRADA DA CASA DAS MINAS.jpg",
    caption: "The sacred cajazeira (hog-plum tree) in the yard of the Casa das Minas, São Luís, photographed in 2019: a Brazilian Jeje house's sacred tree.",
    shows: "site",
    identificationStatus: "probable",
    licence: "CC BY-SA 4.0",
    creator: "João Maria Bezerra",
    objectDate: "photographed June 2019",
  }),
  mapouHaiti: commonsPicture({
    fileName: "Mapou tree in Petit-Goave, Haiti.jpg",
    caption: "A mapou (silk-cotton tree, Ceiba pentandra) at Delatte, Petit-Goâve, Haiti, photographed in 2017 — the kind of tree Haitian Vodou treats as a resting-place of the lwa.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Bdx",
    objectDate: "photographed June 2017",
  }),
  templeteCeiba: commonsPicture({
    fileName: "El Templete.jpg",
    caption: "El Templete in Havana with its ceiba, photographed in 2006. The ceiba here belongs to the Catholic and civic founding ritual of the city; in Afro-Cuban religion the ceiba is also the tree of Iroko and the dead. Both meanings are attached to the same species, not necessarily to this tree.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Angelo Lucia",
    objectDate: "photographed August 2006",
  }),
  oponIfa: commonsPicture({
    fileName: "Brooklyn Museum 75.147.1 Divination Tray Opon Ifa.jpg",
    caption: "A Yoruba Ifá divination tray (opon Ifá), early twentieth century, Brooklyn Museum 75.147.1.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY 3.0",
    institution: "Brooklyn Museum",
    accessionNumber: "75.147.1",
    objectDate: "early 20th century",
  }),
  faTrayReplica: commonsPicture({
    fileName: "Fa divination tray ritual Réplica of Gedegbe Fa tray1.jpg",
    caption: "A replica, made at Porto-Novo in 2024, of the Fa divination tray associated with Gedegbe, the nineteenth-century royal diviner of Abomey. A modern replica, not the original object.",
    shows: "replica",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Cargostperes",
    objectDate: "2024 (replica)",
  }),
  faSigns: commonsPicture({
    fileName: "Entrée de la chambre du prêtre du fâ et les 16 signes à porto-novo au Bénin.jpg",
    caption: "The entrance to a Fa priest's chamber at Porto-Novo with the sixteen principal signs painted around it, photographed in 2019.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Adoscam",
    objectDate: "photographed April 2019",
  }),
  faCowries: commonsPicture({
    fileName: "Le cauris pour le fa.jpg",
    caption: "Cowries used in Fa consultation, Bénin, photographed in 2019.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Rachad sanoussi",
    objectDate: "photographed September 2019",
  }),
  mamiWataPoster: commonsPicture({
    fileName: "Mami Wata poster.png",
    caption: "The chromolithograph of a snake charmer, printed in Hamburg in the 1880s (Adolph Friedländer firm, per the Wikipedia article that uses this file), which became the commonest image of Mami Wata in West Africa. The file page itself gives no date or printer, so the attribution is probable rather than secure.",
    shows: "later_artwork",
    identificationStatus: "probable",
    licence: "Public domain",
    objectDate: "1880s (as attributed)",
  }),
  mamiWataPot: commonsPicture({
    fileName: "Marmite rituelle pour le culte de Mami Wata (Bénin, Porto-Novo).jpg",
    caption: "A terracotta and kaolin ritual pot for the cult of Mami Wata from Porto-Novo, acquired in 1970, photographed in a collection in 2018.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Benoît Prieur",
    objectDate: "before 1970 (object); 2018 (photograph)",
  }),
  mamiWataEwe: commonsPicture({
    fileName: "Escultura de Mami-Wata. Cultura Ewe. Ghana. Siglo XX.jpg",
    caption: "A twentieth-century Ewe Mami Wata sculpture from Ghana, in the Museo de Arte Africano Arellano Alonso (photographed 2015).",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "FundacionArellanoAlonso",
    institution: "Museo de Arte Africano Arellano Alonso, Valladolid",
    objectDate: "20th century",
  }),
  mamiDanConvent: commonsPicture({
    fileName: "L'entrée d'un couvent de la divinité Mami Dan.jpg",
    caption: "The entrance of a convent of the water and serpent power Mami Dan in southern Togo, photographed in 2013.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Wisdom Mensah de Linitiateur",
    objectDate: "photographed August 2013",
  }),
  glidjiRegent: commonsPicture({
    fileName: "Glidji, cérémonies de la prise de la pierre sacrée du peuple Guin, le Régent de Glidji entouré de Grands Prêtres et.jpg",
    caption: "The regent of Glidji surrounded by the high priests of the sacred forest at the ceremony of the 'taking of the sacred stone' of the Guin (Gen) people, photographed 29 September 2024.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Wisdom Mensah de Linitiateur",
    objectDate: "29 September 2024",
  }),
  glidjiOsabu: commonsPicture({
    fileName: "Temple de la divinité Osabu de Glidji.jpg",
    caption: "The temple of the divinity Osabu at Glidji, described by the photographer as one of the forty-one divinities of the sacred forest; photographed 2025.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Wisdom Mensah de Linitiateur",
    objectDate: "photographed November 2025",
  }),
  togoPriestess: commonsPicture({
    fileName: "Cérémonies d'intronisation d'une Prêtresse vodu - Sortie de Zogbé.jpg",
    caption: "The installation of a vodu priestess in southern Togo: the emergence of Zogbé, photographed 2025 — a present-day enthronement.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Wisdom Mensah de Linitiateur",
    objectDate: "photographed November 2025",
  }),
  legbaHebiosso: commonsPicture({
    fileName: "Offrandes à la divinité Lègba par des adeptes du culte Hêbiosso.jpg",
    caption: "Devotees of the thunder vodu Hebiosso making offerings to Legba, southern Togo, photographed in December 2021.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Wisdom Mensah de Linitiateur",
    objectDate: "photographed December 2021",
  }),
  eweAltarGlidji: commonsPicture({
    fileName: "Fétiche Ewé-Togo (1).jpg",
    caption: "An altar of the priest Aklan Djogbé from Glidji, Togo (2007), now displayed in the Musée Vodou, Strasbourg; photographed 2017.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Ji-Elle",
    institution: "Musée Vodou, Strasbourg",
    objectDate: "2007 (altar); 2017 (photograph)",
  }),
  alegbaYewe: commonsPicture({
    fileName: "Alegba, a ritual object in Ewe religion, Ghana.jpg",
    caption: "An alegba — an earthen guardian mound with cowrie eyes — before a house in the Volta Region of Ghana, photographed 2008. The uploader describes it as belonging to Yewe; that attribution is the uploader's.",
    shows: "site",
    identificationStatus: "probable",
    licence: "CC BY-SA 3.0",
    creator: "ZSM",
    objectDate: "photographed November 2008",
  }),
  notseWall: commonsPicture({
    fileName: "Les vestiges du royaume EWE 01.jpg",
    caption: "A surviving stretch of the Agbogbo, the earthen wall of Notsé, Togo, photographed in 2024 beside the government's protection notice. Tradition attributes the wall to King Agokoli; the photograph shows what survives, not its date.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Kodjo Julien",
    objectDate: "photographed July 2024",
  }),
  notseMap: commonsPicture({
    fileName: "Togo - Notse.svg",
    caption: "A modern map locating the canton of Notsé in Togo (2025).",
    shows: "map",
    identificationStatus: "secure",
    licence: "CC0",
    creator: "Agbeve",
    objectDate: "drawn December 2025",
  }),
  togovilleAltar: commonsPicture({
    fileName: "Autel-vaudou-Togoville-2017.jpg",
    caption: "A vodu altar at Togoville on Lake Togo, photographed in 2017. A securely identified Ewe shrine shown for its setting only: it is not identified as a Gorovodu or Tchamba shrine.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Ypirétis",
    objectDate: "photographed August 2017",
  }),
  abomeyCourt: commonsPicture({
    fileName: "Abomey-Cour suprême du culte vodoun.jpg",
    caption: "The building of the 'Cour suprême du culte vodoun' at Abomey, photographed in 2017 — a present-day institution of Vodun authority in the old royal city.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Ji-Elle",
    objectDate: "photographed March 2017",
  }),
  tohossouSculpture: commonsPicture({
    fileName: "Représentant le symbole du Vodoun Tohossou au parc Agoualand au Bénin.jpg",
    caption: "A modern sculpture representing the symbol of the Tohossou, in the Agoualand park, Bénin, photographed in 2022. A recent artwork, not a shrine object.",
    shows: "later_artwork",
    identificationStatus: "modern_interpretation",
    licence: "CC BY-SA 4.0",
    creator: "Adoscam",
    objectDate: "photographed July 2022",
  }),
  sakpataAppliqué: commonsPicture({
    fileName: "Tenture appliquée Sakpata-Musée du Quai Branly (cropped).jpg",
    caption: "Detail of an Abomey appliqué hanging showing Sakpata, early twentieth century, Musée du quai Branly.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Ji-Elle",
    institution: "Musée du quai Branly",
    objectDate: "early 20th century",
  }),
  diopPortrait: commonsPicture({
    fileName: "Cheikh Anta Diop, late 1940s.jpg",
    caption: "Cheikh Anta Diop as a student in Paris in the late 1940s, a few years before Nations nègres et culture (1954).",
    shows: "portrait",
    identificationStatus: "secure",
    licence: "Public domain",
    creator: "Unknown author",
    objectDate: "late 1940s",
  }),
  eshuShrine: commonsPicture({
    fileName: "Esu's Shrine.jpg",
    caption: "A shrine of Èṣù in Nigeria, photographed in 2024 — the Yoruba counterpart of the threshold power the Fon call Legba.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "ExploreWithTunde",
    objectDate: "photographed June 2024",
  }),
  shangoFigure: commonsPicture({
    fileName: "Brooklyn Museum 1992.133.4 Figure of Shango on Horseback.jpg",
    caption: "A Yoruba carved figure of Shango on horseback, early twentieth century, Brooklyn Museum 1992.133.4.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY 3.0",
    institution: "Brooklyn Museum",
    accessionNumber: "1992.133.4",
    objectDate: "early 20th century",
  }),
  egungunCostume: commonsPicture({
    fileName: "National Museum of Ethnology, Osaka - Egungun Costume - Yorùbá people in Nigeria - Collected in 1996.jpg",
    caption: "A Yoruba Egungun masquerade costume collected in Nigeria in 1996, National Museum of Ethnology, Osaka (photographed 2013): the returning dead as masquerade.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Yanajin33",
    institution: "National Museum of Ethnology, Osaka",
    objectDate: "collected 1996",
  }),
  asenTogo: commonsPicture({
    fileName: "Pieniężno I Muzeum Misyjno-Etnograficzne assen Togo 2017-08-12 p.jpg",
    caption: "An asen (iron altar for the dead) from Togo in the Mission-Ethnographic Museum at Pieniężno, Poland, photographed 2017; the museum label describes it as an instrument for calling spirits.",
    shows: "artefact",
    identificationStatus: "secure",
    licence: "CC BY-SA 3.0",
    creator: "Przykuta",
    institution: "Muzeum Misyjno-Etnograficzne, Pieniężno",
    objectDate: "photographed August 2017",
  }),
  vodunsiAgatogbo: commonsPicture({
    fileName: "Danse des Vodunsi à Agatogbo 01.jpg",
    caption: "Vodunsi dancing at Agatogbo, Bénin, during their annual public outing, photographed in February 2023.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Président Fènou",
    objectDate: "photographed February 2023",
  }),
  ouidahBeachShrine: commonsPicture({
    fileName: "Ouidah-Petit temple vaudou sur la plage.jpg",
    caption: "A small vodun temple on the beach at Ouidah, recognisable by its flag, photographed in March 2017. Not identified as a shrine of Hu or Agbe specifically.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Ji-Elle",
    objectDate: "photographed March 2017",
  }),
  legbaGrandPopo: commonsPicture({
    fileName: "Vodun shrine in Grand Popo Benin.jpg",
    caption: "A partly broken Legba shrine at Grand-Popo, Bénin, photographed in November 2019.",
    shows: "site",
    identificationStatus: "secure",
    licence: "CC BY-SA 4.0",
    creator: "Kulttuurinavigaattori",
    objectDate: "photographed November 2019",
  }),
};

// ---------------------------------------------------------------------------
// Claim helpers
// ---------------------------------------------------------------------------

type Cite = { sourceKey: string; relation: "supports" | "disputes" | "context"; note: string };

/** A claim that places nothing on the axis: the honest shape for an undated origin or a method record. */
function undated(input: {
  sourceKey: string | null;
  text: string;
  what: string;
  evidence: string;
  chronology?: string;
  method?: string;
  kind?: string;
  citations?: Cite[];
}) {
  return {
    sourceKey: input.sourceKey,
    citations: input.citations,
    datePrecision: "year",
    isApproximate: false,
    temporalClaimType: input.kind ?? "unknown",
    whatIsDated: input.what,
    originalDateText: input.text,
    datingMethod: input.method ?? "other",
    chronology: input.chronology ?? "conventional",
    evidence: input.evidence,
  };
}

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

const events: SeedEvent[] = [
  // =========================================================================
  // THE ANCHOR, AND THE PEOPLE WHO WROTE IT DOWN
  // =========================================================================
  {
    slug: "vodun-west-africa-what-can-be-recovered",
    title: "What can be recovered about the earliest religion of the Bight of Benin",
    summary:
      "Five kinds of evidence reach back toward the earliest Vodun of the Gbe-speaking coast — documents, archaeology, language, oral tradition and the shape of practice itself. Each reaches a different distance, and none reaches a beginning.",
    description:
      "WHAT THIS RECORD IS. The anchor of the West African track. benin-vodun's 'How old is Vodun?' and 'Before the documents' establish that the religion is older than its first written word (1658) by an amount nothing measures. This record goes one step further and asks, evidence class by evidence class, HOW FAR BACK EACH KIND OF EVIDENCE CAN ACTUALLY SEE, and what it can see when it gets there.\n\n" +
      "1. DOCUMENTS. The 1658 Allada catechism, then Bosman (Hueda, letters of about 1700, published 1704), Barbot, Labat's compilation of Des Marchais (1730), Snelgrave, Norris, Dalzel, Forbes and Burton. They reach the mid-seventeenth century and no further, and they are outsiders' texts: they see shrines, priests, pythons, the sea and great trees, and they miss almost everything inside the convent wall. WHAT THEY RECOVER: that by 1700 Hueda already had three recognised orders of gods (snake, trees, sea), professional priesthoods and an established Dangbe cult.\n\n" +
      "2. ARCHAEOLOGY. Norman's work on Hueda (c. 1650–1727) identifies probable ritual deposits — pots in pits, in particular places — and is careful never to read a vodun off a pot. Older sites in this territory (Sodohomé, the Agongointo souterrains) are real and dated and are NOT evidence for any particular vodun; the inference would need a chain of continuity that nobody has. WHAT IT RECOVERS: ritual practice at dated places, nameless.\n\n" +
      "3. LANGUAGE. The Gbe languages — Ewe, Gen, Aja, Fon, Gun — share a religious vocabulary (vodu/vodun, -si 'wife of', -no 'owner/mother of', hun 'drum/blood'). Shared vocabulary across a dialect continuum implies that much of it predates the continuum's break-up. That is the most promising route back and the least worked: no one has published a dated reconstruction of proto-Gbe religious terms.\n\n" +
      "4. ORAL TRADITION. Tado, Notsé, the three brothers of Allada, the founding of Ouidah by Kpassè, the arrival of Fa from the east, of Mawu-Lisa from the Aja west, of Sakpata and Dangbe through conquest. These are historical evidence about how communities remember and justify their cults, and sometimes about real movements; they are not transcripts, and their chronologies are reckoned by generation.\n\n" +
      "5. THE SHAPE OF THE RELIGION ITSELF. Vodun are added, imported, bought and conquered: the system is open, and new powers (Mami Wata in the nineteenth century, Gorovodu and Tchamba in the twentieth) arrive within the documented period. A religion that changes like this has no single 'earliest form' to recover — the earliest Vodun is not a pure original under later layers but an earlier set of layers.\n\n" +
      "WHAT CANNOT BE RECOVERED, AND SHOULD NOT BE PRETENDED. A founding date; an original pantheon; a single place of origin for the religion as a whole; a derivation from Egypt or anywhere else. Each has been asserted; none is supported by any of the five kinds of evidence.\n\n" +
      "THE FOUR RELIGIOUS CENTRES, IN ONE PARAGRAPH. TADO is remembered as the source — of the Aja, of royal lineages, of cults carried out of it — and is a place of memory more than of documentation. ALLADA is the first centre documented in writing (the Portuguese records of 1539; the catechism of 1658) and the seat of the Agasu royal ancestor cult. OUIDAH (Glexwe, the Hueda port) is the best-documented religious town on the coast: the Dangbe temple, the Kpassè forest, the Hu priesthood. ABOMEY, from the seventeenth century, became the place where conquered and imported cults were concentrated around a monarchy. Each record below takes one of them further.\n\n" +
      "SIGNIFICANCE. This is the frame the other five tracks stand on. Everything said later about what 'crossed the Atlantic', what Haitian Vodou 'kept', or what present-day Vodun 'preserves' depends on what can be said about the West African religion of the seventeenth and eighteenth centuries — and the honest answer is: a good deal about its institutions, quite a lot about its powers, something about its geography, and nothing about its beginning.",
    category: "religion",
    subcategory: "Evidence and method",
    eventType: "disputed",
    eventTypeNote: "A method record: it says what each class of evidence can and cannot establish.",
    tags: vodunTags(T, ["place: tado", "place: allada", "place: ouidah", "place: abomey", "practice: ancestors"], "method", "earliest evidence", "historiography"),
    civilisations: ["Aja", "Fon", "Hueda", "Ewe", "Gun", "Gen (Mina)", "Allada"],
    locationName: "The Bight of Benin: southern Bénin, southern Togo and south-eastern Ghana",
    lat: 6.6,
    lng: 2.0,
    media: [P.barbotMap, P.gbeMap, P.kahnPythonTemple],
    claims: [
      {
        sourceKey: "wa_bosman_1705",
        citations: [
          { sourceKey: "wa_law_slave_coast_1991", relation: "supports", note: "Law reads the seventeenth-century European record of Allada and Hueda religion and finds it already institutionalised." },
          { sourceKey: "wa_pares_2016", relation: "supports", note: "Parés's history of Slave Coast vodun starts its documented narrative in the seventeenth century for the same reason." },
        ],
        startYear: 1658,
        endYear: 1704,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The window in which written evidence for the religion of this coast begins",
        originalDateText: "From the 1658 catechism to Bosman's printed letters of 1704",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "EVIDENCE TYPE: contemporary written. Dated documents bracket the start of the written record: the Allada catechism (1658) and Bosman's account of Hueda (letters of about 1700, printed 1704). This dates the EVIDENCE. It shows an established religion already in place; it does not date the religion's beginning.",
      },
      {
        sourceKey: "wa_norman_2009",
        citations: [{ sourceKey: "wa_pares_2016", relation: "context", note: "Parés uses the documentary and archaeological record together for the Hueda period." }],
        startYear: 1650,
        endYear: 1727,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The Hueda-period deposits interpreted as ritual",
        originalDateText: "Huedan ritual deposits, c. 1650–1727",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "EVIDENCE TYPE: archaeological. Excavated deposits from the Hueda kingdom interpreted as ritual by their placement and contents. This extends the documentary picture with physical evidence of practice; it does not identify which vodun the deposits were for, and it does not push the record back before the documents.",
      },
      undated({
        sourceKey: "wa_practitioner_tradition",
        citations: [{ sourceKey: "wa_capo_1991", relation: "context", note: "The shared Gbe religious vocabulary implies age without supplying a date; no dated reconstruction exists." }],
        text: "The religion's beginning: not recoverable from any available evidence",
        what: "When the religious traditions of the Bight of Benin began",
        evidence:
          "EVIDENCE TYPE: modern interpretation. None of the five classes of evidence reaches a beginning: documents start in 1658, archaeology identifies nameless ritual, language implies but does not date, and oral tradition places origins in founding time. The claim therefore carries no position, deliberately.",
      }),
    ],
  },

  {
    slug: "gbe-languages-and-the-vocabulary-of-the-sacred",
    title: "One language continuum, one sacred vocabulary: Gbe and the words for power",
    summary:
      "Ewe, Gen, Aja, Fon and Gun are dialects of one continuum, and they share their words for a power (vodu), its devotee (-si) and its owner (-no). Linguists have mapped the continuum; nobody has yet dated its religious words.",
    description:
      "WHAT GBE IS. 'Gbe' — the word for 'language' in all of them — is the linguists' name for a cluster of closely related languages spoken from the Volta in Ghana to the Ouémé in Bénin and into Nigeria: Ewe, Gen (Mina), Aja, Fon, Gun, Phla-Pherá and others. Capo's comparative phonology (1991) established the cluster as one continuum; the map is not ethnic but linguistic.\n\n" +
      "THE RELIGIOUS WORDS THAT RECUR. VODU / VODUN, the word for a power (in Ewe also trɔ̃, pl. trɔwo); the suffix -SI, 'wife of' (vodunsi, Dangbesi, Lisa-si — Burton glosses 'si' as 'a wife'); -NO, 'mother/owner of' (vodunon, the owner of a vodun; Hu-no, the priest of the sea); HUN, which in Fon means drum, blood and also a vodun, and the distinct HU, the sea (Hu-no, Hu-gbe); LEGBA, FA/AFA, MAWU across the whole cluster. The distribution matters: when the same institutional vocabulary is shared across a continuum whose dialects have diverged, the simplest explanation is that the vocabulary is older than the divergence.\n\n" +
      "WHY THAT IS NOT A DATE. Because nobody has dated the divergence. Dialect continua diverge gradually, borrow constantly from one another, and words for religious institutions are exactly the kind of words that travel with cults: Fa came to Abomey from the east, Yewe to Anlo from the east, Gorovodu to the Ewe from the north. Shared vocabulary may be inherited or borrowed, and telling which requires the regular sound-correspondence work that has been done for Gbe phonology but not for its religious lexicon.\n\n" +
      "WHAT THE 1658 CATECHISM ADDS. It records vodu in a language of the Allada coast in the mid-seventeenth century, glossed in senses touching god and the sacred: the word was already a general term, not the name of one deity. That is the oldest dated point in the linguistic evidence.\n\n" +
      "SIGNIFICANCE. The vocabulary is why one can speak of 'Vodun' across Bénin, Togo and Ghana without pretending they are one church: the same words for power, devotee and priest organise many different local pantheons. It is also why the diaspora names are such strong evidence — Jeje, Arará, Rada, vodunsi, Hounon and hounsi in Haiti, Brazil and Cuba are Gbe words, and a word is a harder thing to fake than a resemblance.",
    category: "religion",
    subcategory: "Language",
    eventType: "historical",
    tags: vodunTags(T, ["place: togo and ewe country", "place: allada", "practice: initiation and priesthood"], "language", "gbe"),
    civilisations: ["Ewe", "Gen (Mina)", "Aja", "Fon", "Gun"],
    locationName: "The Gbe-speaking region, from the Volta to the Ouémé",
    lat: 6.6,
    lng: 1.6,
    media: [P.gbeMap, P.slaveCoastMap],
    claims: [
      {
        sourceKey: "wa_capo_1991",
        citations: [{ sourceKey: "wa_burton_gelele_1864", relation: "context", note: "Burton's glosses ('si (a wife)', 'Lisa-si') record the suffixes in the 1860s." }],
        startYear: 1991,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The publication that defined Gbe as one comparative unit",
        originalDateText: "Capo's Comparative Phonology of Gbe, 1991",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "EVIDENCE TYPE: modern interpretation. A dated piece of scholarship that classified the cluster. It dates the CLASSIFICATION, not the languages or their words.",
      },
      undated({
        sourceKey: "wa_practitioner_tradition",
        citations: [{ sourceKey: "wa_blier_1995", relation: "context", note: "Blier treats vodun as a general term for powers across Fon and Ewe country." }],
        text: "Age of the shared religious vocabulary: undated",
        what: "When the shared Gbe religious terms came into use",
        evidence:
          "EVIDENCE TYPE: modern interpretation. Distribution across a continuum suggests the vocabulary is old, but no dated reconstruction exists and borrowing between Gbe languages is well documented. No position is given.",
      }),
    ],
  },



  {
    slug: "the-pantheon-written-down-1911-1943",
    title: "The pantheon written down: Le Hérissé, Herskovits and Maupoil, 1911–1943",
    summary:
      "Three works made between the French conquest and the Second World War produced the 'Fon pantheon' that reference books still print: Le Hérissé's Abomey (1911), the Herskovitses' Abomey fieldwork (1931; 1933, 1938) and Maupoil's Fa (1943).",
    description:
      "THE THREE. A. LE HÉRISSÉ, a French administrator, published L'Ancien Royaume du Dahomey in 1911 from informants of the former royal court. MELVILLE and FRANCES HERSKOVITS spent part of 1931 in Abomey; An Outline of Dahomean Religious Belief (1933) and Dahomey: An Ancient West African Kingdom (1938) gave English readers a tidy structure: Nana Buluku, then Mawu-Lisa, then their children heading the sky, earth (Sakpata) and sea (Agbe) pantheons, plus Gu, Agé, Loko, Legba, the Tohossou and the sib ancestors. BERNARD MAUPOIL, another administrator trained in ethnology, published La géomancie à l'ancienne Côte des Esclaves (1943), still the fundamental work on Fa.\n\n" +
      "WHAT THEY GOT RIGHT. A great deal of detail that would otherwise be lost: cult-house organisation, initiation by seclusion, the names and attributes of powers, myths as told by named people in 1931, the corpus and practice of Fa.\n\n" +
      "WHAT THEY BUILT. A SYSTEM, made in and around Abomey, from royal and priestly informants with an interest in presenting the kingdom's religion as ordered and the monarchy as its centre. Herskovits's pantheons are a synthesis of cults that, as benin-vodun's 'not one theology' record argues, had separate histories — some Aja, some Hueda, some Yoruba, some imported by queens and kings. Blier and Bay later showed how much of the order was political.\n\n" +
      "HOW THIS TRACK USES THEM. As dated sources for what Abomey informants said between 1910 and 1940, and never as a description of 'Fon religion' in general or of what the religion was in 1600.\n\n" +
      "SIGNIFICANCE. These three books are the main channel by which West African Vodun entered anthropology and, through Herskovits especially, the study of the African diaspora: his search for 'Africanisms' in Haiti and Brazil began from the Abomey pantheon. When a comparison elsewhere in this expansion says 'in Dahomey, X was the child of Mawu-Lisa', it is usually quoting 1931.",
    category: "religion",
    subcategory: "Historiography",
    eventType: "historical",
    tags: vodunTags(T, ["deity: mawu-lisa", "practice: divination", "place: abomey"], "historiography", "ethnography"),
    people: ["A. Le Hérissé", "Melville J. Herskovits", "Frances S. Herskovits", "Bernard Maupoil"],
    civilisations: ["Fon", "Kingdom of Dahomey", "French Dahomey"],
    locationName: "Abomey, French Dahomey",
    lat: 7.18,
    lng: 1.99,
    media: [P.fortierAbomey1912, P.kahnRoyalEmblems],
    claims: [
      {
        sourceKey: "wa_le_herisse_1911",
        startYear: 1911,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Le Hérissé's account of Abomey religion",
        originalDateText: "L'Ancien Royaume du Dahomey, 1911",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. A colonial administrator's book written from royal informants within twenty years of conquest; it dates their account, not the cults.",
      },
      {
        sourceKey: "wa_herskovits_dahomey_1938",
        citations: [{ sourceKey: "wa_herskovits_outline_1933", relation: "supports", note: "The 1933 Outline is the first publication of the 1931 fieldwork's religious system." }],
        startYear: 1931,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Herskovitses' fieldwork in Abomey",
        originalDateText: "Fieldwork in Abomey in 1931, published 1933 and 1938",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. Dated ethnographic fieldwork. It records what Abomey informants said in 1931 and how the authors organised it.",
      },
      {
        sourceKey: "wa_maupoil_1943",
        startYear: 1943,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Maupoil's study of Fa",
        originalDateText: "La géomancie à l'ancienne Côte des Esclaves, 1943",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. A dated scholarly monograph built on fieldwork in the 1930s.",
      },
    ],
  },

  {
    slug: "spieth-records-ewe-religion-1906-1911",
    title: "Spieth records the religion of the Ewe, 1906–1911",
    summary:
      "Jakob Spieth of the Bremen Mission published the largest early body of Ewe traditions and religious texts, in Ewe and German: Die Ewe-Stämme (1906) and Die Religion der Eweer in Süd-Togo (1911). The western half of the Gbe world enters the record through him.",
    description:
      "WHO HE WAS. Jakob Spieth (1856–1914) was a missionary of the Norddeutsche (Bremen) Mission, which worked among the Ewe of what became German Togo and the British Gold Coast from 1847. Stationed at Ho and elsewhere, he learned Ewe thoroughly, worked on the Ewe Bible and collected traditions from town after town, writing down what his informants said in Ewe and translating it.\n\n" +
      "WHAT HE RECORDED. In Die Ewe-Stämme (1906), the histories and customs of dozens of Ewe communities, including the traditions of the flight from Notsie. In Die Religion der Eweer in Süd-Togo (1911), the trɔwo (the Ewe word for vodu powers), Mawu, the priesthoods, Afa divination, the dead, and prayers and songs in the original language.\n\n" +
      "HOW TO READ HIM. He was a Protestant missionary, writing to understand what conversion would replace — and the Bremen Mission's translations made choices that changed Ewe religion itself, above all rendering the Christian God as Mawu and the trɔwo as demons (see the record on the supreme-god question). His books are therefore both primary evidence and part of the history they record. Because he printed the Ewe texts, later scholars can read his informants past him.\n\n" +
      "WHY IT BALANCES THE RECORD. The written history of Vodun is heavily weighted to Ouidah and Abomey because that is where the slave trade and then the French put their writers. Spieth (with Ellis) is the main early source for the Ewe and western Gbe world — the Togo and Volta side of the same religious continuum.\n\n" +
      "SIGNIFICANCE. Without Spieth the Notsie tradition, the Afa of the Ewe and the trɔwo would be known only from the late twentieth century. His work is why Ewe religion can be compared with Fon religion on equal documentary terms, and why the Ewe strand in the diaspora (Afrekete, the Mina, the 'Popo' of colonial records) can be traced at all.",
    category: "religion",
    subcategory: "Historiography",
    eventType: "historical",
    tags: vodunTags(T, ["place: togo and ewe country", "practice: divination", "practice: catholic contact"], "spieth", "bremen mission", "historiography", "ewe"),
    people: ["Jakob Spieth"],
    civilisations: ["Ewe", "Norddeutsche Mission (Bremen Mission)", "German Togo"],
    locationName: "Ho and the Ewe country of German Togo",
    lat: 6.6,
    lng: 0.47,
    media: [P.legbaHebiosso, P.gbeMap],
    claims: [
      {
        sourceKey: "wa_spieth_1906",
        citations: [{ sourceKey: "wa_meyer_1999", relation: "context", note: "Meyer places Spieth's work within the Bremen Mission's translation project and its consequences." }],
        startYear: 1906,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of Die Ewe-Stämme",
        originalDateText: "Die Ewe-Stämme, Berlin 1906",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. A dated publication of traditions recorded from named communities; it dates the recording, not the traditions.",
      },
      {
        sourceKey: "wa_spieth_1911",
        startYear: 1911,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of Die Religion der Eweer in Süd-Togo",
        originalDateText: "Die Religion der Eweer in Süd-Togo, 1911",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. A dated missionary ethnography with texts in Ewe.",
      },
    ],
  },

  {
    slug: "aupiais-gadmer-photograph-the-shrines-1930",
    title: "1930: a colour survey of shrines, trees and priests in Dahomey",
    summary:
      "Between January and May 1930 the photographer Frédéric Gadmer, travelling with the missionary-ethnographer Francis Aupiais for Albert Kahn's Archives de la Planète, made autochromes and films of shrines, sacred trees, priests and devotees across southern Dahomey.",
    description:
      "WHAT WAS MADE. The 'Mission Dahomey' of 9 January–14 May 1930 produced several hundred autochrome plates (an early colour process on glass) and film reels, now in the Musée départemental Albert-Kahn. Their original captions — 'Case du fétiche Dan', 'Arbre fétiche (Zozo)', 'Féticheuses de Sapata (Variole)', 'Couvent fétichiste zozo', 'Le Chef féticheur du Serpent (dagbé)' — name places, powers and offices at Porto-Novo, Adjarra, Ouidah, Abomey and Zado. Films include Fa consultations, a prayer to the python god and ceremonies for the Tohossou.\n\n" +
      "WHY IT IS EVIDENCE. Because it is dated to the day and located to the town. A photograph of an iroko at Adjarra on 19 January 1930 with the caption 'arbre fétiche' is a document that a tree was under cult there then — the kind of statement that before 1930 rests on travellers' prose. The plates show how shrines were built and dressed, what devotees wore, which powers had houses in which towns.\n\n" +
      "WHAT TO BEAR IN MIND. Aupiais was a Catholic priest of the Society of African Missions who had come to admire the religion he was supposed to replace and argued for its dignity in Paris; the mission was a staged survey, with sitters arranged for the camera; and some subjects were sensitive — one plate of a Legba figure is captioned 'not to be shown to everyone', and is not reproduced in this track for that reason. The vocabulary ('fétiche', 'féticheur') is the period's.\n\n" +
      "SIGNIFICANCE. This is the earliest large body of colour images of West African Vodun, made sixty years after Burton and sixty-six before the 1996 recognition. The pictures used across this track — the sacred irokos, the Dan house at Porto-Novo, the serpent priest, the Sakpata devotees, the royal emblems at Abomey — come from it. They let a reader check a written claim against what a camera saw.",
    category: "religion",
    subcategory: "Documentary evidence",
    eventType: "historical",
    tags: vodunTags(T, ["practice: sacred trees and forests", "practice: serpent veneration", "place: porto-novo", "place: abomey", "place: ouidah", "practice: catholic contact"], "photography", "albert kahn", "historiography"),
    people: ["Frédéric Gadmer", "Francis Aupiais", "Albert Kahn"],
    civilisations: ["French Dahomey", "Fon", "Gun"],
    locationName: "Porto-Novo, Adjarra, Ouidah, Abomey and Zado, French Dahomey",
    lat: 6.5,
    lng: 2.6,
    media: [P.kahnDanHouse, P.kahnSerpentPriest, P.kahnSakpata],
    claims: [
      {
        sourceKey: "wa_aupiais_gadmer_1930",
        citations: [{ sourceKey: "wa_blier_1995", relation: "context", note: "Blier's art history of vodun objects is the frame in which such photographs of shrines and bocio are read." }],
        startYear: 1930,
        startMonth: 1,
        startDay: 9,
        endYear: 1930,
        datePrecision: "day",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Aupiais–Gadmer photographic mission in Dahomey",
        originalDateText: "Mission Dahomey, 9 January – 14 May 1930",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. Each plate carries its date and place in the archive's register. The dates establish what was photographed where in 1930; they say nothing about how long any shrine or tree had been there.",
      },
    ],
  },

  // =========================================================================
  // RELIGIOUS GEOGRAPHY
  // =========================================================================
  {
    slug: "tado-as-a-religious-source",
    title: "Tado as a religious source: where the cults are said to come from",
    summary:
      "Tado, on the Mono in present-day Togo, is remembered across the Aja, Fon and Gun world as the place royal lineages and their ancestral cults came out of. It is a source in memory far more than in documents.",
    description:
      "WHAT benin-deep-past ALREADY SAYS. Its record on Tado sets out the Aja origin traditions and the historians' disagreement about their routes and chronology. This record takes the RELIGIOUS side: what it means, ritually, to come 'from Tado'.\n\n" +
      "THE TRADITION. Royal and priestly lineages from Allada, Abomey and Porto-Novo trace their founding ancestor to Tado, and so do many Aja and Ewe lineages; the leopard ancestor Agasu, whose cult is the dynastic cult of the Allada–Abomey–Porto-Novo houses, is remembered as born there of a princess and a leopard. To come from Tado is to have a legitimate ancestor and a legitimate cult. Lineages that moved carried their tovodun (deified ancestors) and their vodun with them, and the shrines of the new towns are said to be 'from Tado'. Annual or occasional journeys and offerings to Tado by descendant communities are reported in the ethnography.\n\n" +
      "WHAT IS DOCUMENTED. Remarkably little. Tado does not appear in the European record of the coast in the seventeenth century the way Allada and Hueda do; it lies inland, off the trade. The traditions about it were written down in the colonial period and later. The photographs of 'vestiges of the kingdom of Tado' in this record show what survives at the site today; what those remains are and how old they are is not established by the pictures or by any excavation reported here.\n\n" +
      "HOW TO READ IT. As benin-deep-past says of oral tradition generally: evidence, not a transcript. 'From Tado' is a claim about legitimacy and kinship as much as about migration, and a cult's claimed origin may be where its authority is said to come from rather than where it was first served.\n\n" +
      "SIGNIFICANCE. Tado is why so many Gbe ritual genealogies converge on one place, and why Haitian and Brazilian Jeje vocabulary sometimes names 'Adja' or 'Adjahoun' as a nation of spirits: the memory of an Aja source travelled, as a name, much further than any document about the town.",
    category: "religion",
    subcategory: "Religious geography",
    eventType: "traditional_account",
    tags: vodunTags(T, ["place: tado", "practice: ancestors", "place: allada"], "aja", "origin traditions"),
    people: ["Agasu"],
    civilisations: ["Aja", "Fon", "Gun", "Ewe"],
    locationName: "Tado, on the Mono river, Togo",
    lat: 7.0,
    lng: 1.7,
    media: [P.tadoRemains, P.tadoRemains2, P.tadoMap],
    claims: [
      undated({
        sourceKey: "wa_practitioner_tradition",
        citations: [
          { sourceKey: "wa_law_slave_coast_1991", relation: "context", note: "Law discusses the Tado traditions and their uncertain chronology." },
          { sourceKey: "wa_bay_1998", relation: "context", note: "Bay treats the Tado–Agasu genealogy as the charter of Dahomean kingship and its cults." },
        ],
        text: "From Tado, in founding time",
        what: "When lineages and their cults are said to have left Tado",
        chronology: "oral_tradition",
        method: "oral_tradition",
        evidence:
          "EVIDENCE TYPE: oral tradition. The traditions place the departure from Tado before the founding of Allada; they do not supply a calendar date, and the generation-counting dates historians have attached to them are reconstructions. No position is given.",
      }),
    ],
  },

  {
    slug: "allada-sacred-geography",
    title: "Allada's sacred geography: Agasu, the lake at Togoudo and the first written vodu",
    summary:
      "Allada is where the written history of Vodun begins (1658) and where the dynastic cult of Agasu, the leopard ancestor of the Allada, Abomey and Porto-Novo kings, was centred. Its shrines are still served.",
    description:
      "WHY ALLADA. It is the oldest of the coastal kingdoms in the documents — named in Portuguese records by 1539 — and the place the 1658 catechism was made for, so the word vodu is first written in its language. It is also, in the royal traditions of Dahomey and Porto-Novo, the town their founders left after a succession quarrel: the 'three brothers' tradition. Both histories make Allada a religious source second only to Tado.\n\n" +
      "AGASU. The dynastic ancestor of the Agasuvi — the 'children of Agasu' — is the leopard-born founder whose cult the Allada, Abomey and Porto-Novo houses all served. Agasu's priests and shrine at Allada had authority over the installation of kings: the leopard is a royal emblem across the Gbe-speaking monarchies for this reason. The cult is RELIGIOUS GEOGRAPHY as much as kingship: it links three cities to one shrine. (Its political use belongs to the kingdoms track.) In Haitian Vodou, a lwa named Agasou belongs to the Rada rite — a name-correspondence recorded, not a demonstrated continuity of cult.\n\n" +
      "TOGOUDO AND LAKE AWOUTO. In the commune of Allada, the village of Togoudo with its sacred lake Awouto is the place tradition gives as the home of the father of Toussaint Louverture, Gaou Guinou — a modern heritage connection that draws Haitian visitors. The Legba figure on the lake shore, photographed on the 2022 Vodun holiday, is a living shrine; the Louverture link is a family tradition recorded in the nineteenth century and NEEDS SOURCE VERIFICATION in its details.\n\n" +
      "WHAT IS NOT KNOWN. Which cults were served at Allada in 1658 beyond the vocabulary the catechism preserves; how old the Agasu cult is; where exactly the old royal shrines stood. Allada was destroyed by Dahomey in 1724 and rebuilt; its present shrines are its present shrines.\n\n" +
      "SIGNIFICANCE. Allada joins the first written vodu to the royal ancestor cult that structured three kingdoms — and its name, as 'Arada' and 'Arará', became one of the most durable labels for Gbe people and their religion in the Americas (Arada in Saint-Domingue, Rada in Haiti, Arará in Cuba).",
    category: "religion",
    subcategory: "Religious geography",
    eventType: "historical",
    tags: vodunTags(T, ["place: allada", "practice: ancestors", "deity: legba"], "agasu", "leopard"),
    people: ["Agasu", "Gaou Guinou"],
    civilisations: ["Allada", "Aja", "Agasuvi"],
    locationName: "Allada and Togoudo, southern Bénin",
    lat: 6.66,
    lng: 2.15,
    media: [P.legbaAwouto, P.barbotMap],
    claims: [
      {
        sourceKey: "wa_law_slave_coast_1991",
        citations: [{ sourceKey: "wa_pares_2016", relation: "supports", note: "Parés begins the documented history of vodun with Allada and the 1658 catechism." }],
        startYear: 1658,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first written vodu, in the language of Allada",
        originalDateText: "1658, the Allada catechism",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. The dated catechism gives a latest-by date for the vocabulary at Allada; it does not date the Agasu cult or any shrine.",
      },
      undated({
        sourceKey: "wa_practitioner_tradition",
        citations: [{ sourceKey: "wa_bay_1998", relation: "context", note: "Bay records the Agasu cult as the dynastic cult of the Agasuvi kings." }],
        text: "Agasu, born at Tado of a princess and a leopard",
        what: "The origin of the Agasu cult, in the tradition's terms",
        chronology: "oral_tradition",
        method: "oral_tradition",
        kind: "primordial",
        evidence: "EVIDENCE TYPE: oral tradition. A founding narrative placed in ancestral time; it supplies no calendar date and none is given.",
      }),
    ],
  },

  {
    slug: "kpasse-forest-ouidah",
    title: "The Kpassè forest at Ouidah: a king who became a tree",
    summary:
      "Ouidah's sacred forest is named for Kpassè, remembered as the Hueda chief who founded the town and who, pursued by enemies, became an iroko. Burton in 1864 recorded a different Kpase; the forest survives in the middle of the town.",
    description:
      "THE TRADITION AS TOLD NOW. Kpassè, a Hueda ruler of the place that became Ouidah (Glexwe), escaped his enemies by vanishing into the forest and reappearing as an iroko (loko) tree. The tree pointed out as his incarnation stands in the grove; the forest is his, and it is kept as a sacred forest with shrines, a convent enclosure and, since the 1992 Ouidah festival, modern sculptures of vodun among the trees. Visitors are told to touch the tree and make a wish. That is the present public form of the story, recorded as such.\n\n" +
      "WHAT THE OLDER RECORD SAYS. Law's history of Ouidah treats Kpassè as the town's founding figure in its own traditions, a Hueda notable under the kings at Savi before the Dahomean conquest of 1727. Burton in 1864 lists among the Whydah gods 'Kpate, the first Whydah man who, sighting a ship from his plantation, brought it to anchor ... and led the captain into the town' and 'Kpase, the man who helped Kpate' — a founder-cult attached to the first contact with European shipping. The two traditions are not the same story, and both concern deified founders: one turned into a tree, one honoured for bringing in the ships.\n\n" +
      "WHAT IS NOT ESTABLISHED. A date for Kpassè (the sixteenth and seventeenth centuries are both offered in popular accounts); that the present tree is the tree of the tradition (irokos live long, but not indefinitely); how much of the present forest's layout is old. The forest's survival as woodland in a growing town is itself evidence that it was protected.\n\n" +
      "WHY A KING BECOMES A TREE. Because in Gbe religion the dead and the powers dwell in places: great trees, groves and pools are among their most common seats, and a lineage founder who 'becomes' a tree has become a permanent, locatable presence that can be fed and consulted. The Kpassè story is a particularly clear case of the tree cult Bosman saw at Hueda about 1700.\n\n" +
      "SIGNIFICANCE. The Kpassè forest joins three threads of this track in one place: an ancestor, a sacred tree and a sacred forest. It is also among the most visited Vodun sites in Bénin, which means its story is now told mostly to outsiders — a change in audience that is part of its history.",
    category: "religion",
    subcategory: "Sacred trees and forests",
    eventType: "traditional_account",
    tags: vodunTags(T, ["practice: sacred trees and forests", "practice: ancestors", "place: ouidah"], "kpasse", "iroko", "hueda"),
    people: ["Kpassè", "Kpate"],
    civilisations: ["Hueda"],
    locationName: "Kpassè sacred forest, Ouidah, Bénin",
    lat: 6.364,
    lng: 2.088,
    media: [P.kpasseTree, P.kpasseForest, P.kpasseEntrance],
    claims: [
      undated({
        sourceKey: "wa_practitioner_tradition",
        citations: [
          { sourceKey: "wa_law_ouidah_2004", relation: "context", note: "Law records Kpassè as Ouidah's founder in local tradition and places him before 1727." },
          { sourceKey: "wa_kpasse_heritage_guide", relation: "supports", note: "The present-day official visitor account tells the king-into-iroko story." },
        ],
        text: "Kpassè became an iroko, in the time of the founding of Glexwe",
        what: "Kpassè's transformation into a tree, in the tradition's terms",
        chronology: "oral_tradition",
        method: "oral_tradition",
        evidence: "EVIDENCE TYPE: oral tradition. A founding narrative of Ouidah. Popular accounts attach it to the sixteenth or seventeenth century; neither date rests on a document, so none is entered.",
      }),
      {
        sourceKey: "wa_burton_gelele_1864",
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Burton's record of Kpate and Kpase as deified Whydah founders",
        originalDateText: "Burton's list of Whydah gods, nos. 10 and 11 (1864)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. The earliest dated written mention of a Kpase in a cult context found here. It is a different story from the tree tradition, which shows the founder-cult was told in more than one form.",
      },
    ],
  },

  {
    slug: "notse-in-ewe-sacred-memory",
    title: "Notsé: the walled town in Ewe sacred memory",
    summary:
      "Ewe communities from Togo to the Volta remember Notsé, a walled town ruled by the tyrant Agokoli, as the place their ancestors escaped from. The memory is renewed in ritual and festival; the wall partly survives.",
    description:
      "THE TRADITION. The Ewe left Notsé (Notsie) because King Agokoli oppressed them — set them to knead clay full of thorns and broken glass for his wall, killed their elders. They escaped by night, walking backwards so their footprints seemed to lead into the town, the women having softened a section of the wall by throwing their washing water against it. From Notsé they dispersed to found the Ewe towns of present-day Togo and Ghana. Spieth recorded versions in town after town in the early 1900s.\n\n" +
      "THE RELIGIOUS SIDE. Notsé is the source to which many Ewe lineages trace their ancestral stools and cults; some trɔwo are said to have been brought out of Notsé; and the flight is re-enacted and celebrated in festivals — the Agbogbozã at Notsé itself, and the Hogbetsotso ('festival of the exodus') of the Anlo — at which ancestors are honoured and the dispersal remembered. NEEDS SOURCE VERIFICATION for the dates at which these festivals took their present form, which appear to be twentieth-century.\n\n" +
      "WHAT IS DOCUMENTED. A wall: stretches of the earthen Agbogbo survive at Notsé and are now protected. Its age is not fixed by the photograph or by any dating reported here; the tradition attributes it to Agokoli, conventionally placed in the seventeenth century by generation-counting. Behind Notsé, traditions point further east, to Ketu and to Tado.\n\n" +
      "SIGNIFICANCE. Notsé is to the Ewe what Tado is to the Aja: a remembered centre from which lineage, cult and legitimacy are derived. Its memory of escaping a tyrant is also why Ewe historians have read the tradition as political and moral charter — a people defined by refusing an oppressive king — and why it is ritually renewed rather than merely recited.",
    category: "religion",
    subcategory: "Religious geography",
    eventType: "traditional_account",
    tags: vodunTags(T, ["place: togo and ewe country", "practice: ancestors"], "notse", "ewe", "origin traditions"),
    people: ["Agokoli"],
    civilisations: ["Ewe"],
    locationName: "Notsé (Notsie), Plateaux region, Togo",
    lat: 6.95,
    lng: 1.17,
    media: [P.notseWall, P.notseMap],
    claims: [
      {
        sourceKey: "wa_spieth_1906",
        citations: [{ sourceKey: "wa_greene_1996_anlo", relation: "context", note: "Greene uses the Notsie traditions critically in her history of the Anlo-Ewe." }],
        startYear: 1906,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Spieth's publication of the Notsie traditions",
        originalDateText: "Recorded by Spieth and published in 1906",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. The date of a missionary's large written record of the tradition. It dates the recording, not the events.",
      },
      {
        sourceKey: "wa_practitioner_tradition",
        citations: [{ sourceKey: "wa_wikipedia", relation: "context", note: "Wikipedia's Ewe and Notsé articles repeat the conventional seventeenth-century placing of Agokoli." }],
        startYear: 1600,
        endYear: 1700,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "genealogical_date",
        whatIsDated: "The reign of Agokoli and the dispersal from Notsé, as conventionally placed",
        originalDateText: "Agokoli's reign, placed in the seventeenth century",
        datingMethod: "genealogy",
        chronology: "oral_tradition",
        evidence: "EVIDENCE TYPE: oral tradition. A century placed by counting generations back from documented chiefs. It is a reconstruction from tradition, approximate by nature.",
      },
    ],
  },

  {
    slug: "glidji-and-the-sacred-stone-of-the-guin",
    title: "Glidji and the sacred stone of the Guin: Epe-Ekpe",
    summary:
      "Every year at Glidji, near Aného in Togo, the priests of the sacred forest bring out a stone whose colour foretells the coming year for the Guin (Gen, Mina) people. A coastal Gbe festival with a documented history from the seventeenth-century migrations from the Gold Coast.",
    description:
      "WHO THE GUIN ARE. The Guin or Gen — the Mina of colonial records — are Gbe-speaking people of the Togolese coast around Aného and Glidji whose ruling lineages trace themselves to migrants from Accra and Elmina on the Gold Coast in the late seventeenth century, who settled among Gbe speakers and adopted their language. Their religion is accordingly a meeting of Gbe vodu and Ga/Akan elements.\n\n" +
      "THE CEREMONY. Epe-Ekpe ('the year's stone') is held at Glidji, the Guin religious capital, around September. Priests of the sacred forest, where tradition says forty-one divinities dwell, retrieve a sacred stone; its colour — read publicly — announces whether the year will be good, troubled or mixed. The regent of Glidji presides with the high priests; vodu devotees (the Guin-Yehuessi) dance; the ceremony is also the Guin new year. The 2024 photographs in this record show the regent and priests at the ceremony.\n\n" +
      "WHAT IS DOCUMENTED AND WHAT IS NOT. The Glidji migrations are documented in European records of the coast; the date at which Epe-Ekpe was first held is not. The festival's present public form, with dignitaries and press, is recent. NEEDS SOURCE VERIFICATION for the claim, common in festival literature, that it has been held without interruption since 1663.\n\n" +
      "SIGNIFICANCE. Glidji shows the Gbe religious world absorbing incomers: Akan and Ga migrants became Gbe-speaking Guin, and their sacred forest, priesthood and divination stone are now among the most important vodu institutions of Togo. It is a West African case of exactly the process the diaspora tracks describe — religion remade in a new place — and it is why 'Mina' and 'Popo' appear as nations in Brazil and Saint-Domingue.",
    category: "religion",
    subcategory: "Religious geography",
    eventType: "historical",
    tags: vodunTags(T, ["place: togo and ewe country", "practice: divination", "practice: sacred trees and forests"], "guin", "mina", "epe-ekpe"),
    civilisations: ["Guin (Gen, Mina)", "Ga", "Ewe"],
    locationName: "Glidji, near Aného, Togo",
    lat: 6.25,
    lng: 1.6,
    media: [P.glidjiRegent, P.glidjiOsabu, P.eweAltarGlidji],
    claims: [
      {
        sourceKey: "wa_law_slave_coast_1991",
        citations: [{ sourceKey: "wa_wendl_1999", relation: "context", note: "Wendl's work on the Mina describes their composite Gold Coast and Gbe origins." }],
        startYear: 1680,
        endYear: 1700,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Settlement of the Gold Coast migrants at Glidji and Aného",
        originalDateText: "Migrants from Accra and Elmina settle at Glidji, late seventeenth century",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. Historians' reconstruction from European records of the coast and Guin tradition. It dates the settlement approximately; it does not date the stone ceremony.",
      },
      undated({
        sourceKey: "wa_practitioner_tradition",
        text: "Epe-Ekpe: held 'since the founding', in the priests' account",
        what: "When the sacred-stone ceremony began",
        chronology: "oral_tradition",
        method: "oral_tradition",
        citations: [{ sourceKey: "wa_rush_2013", relation: "context", note: "Rush describes the coastal vodun festivals' recent public, touristic forms." }],
        evidence: "EVIDENCE TYPE: oral tradition. The festival claims continuity from the founding; a specific year (1663) circulates but has not been traced to a document here, so none is entered.",
      }),
    ],
  },

  // =========================================================================
  // POWERS benin-vodun DOES NOT HAVE
  // =========================================================================
  {
    slug: "nana-buluku-the-elder-creator",
    title: "Nana Buluku: the elder creator behind Mawu and Lisa",
    summary:
      "In the Abomey account recorded in 1931, Nana Buluku made the world, bore Mawu and Lisa, and withdrew. Her temple was at Dume, north-west of Abomey. As Nanã she is a major orisha-vodun of Brazilian Candomblé.",
    description:
      "WHAT THE ABOMEY ACCOUNT SAYS. In the Herskovitses' system — taken from informants in Abomey in 1931 — Nana Buluku is the first creator, androgynous or female, who bore the twins Mawu (female, moon, night, west) and Lisa (male, sun, day, east), handed the world to them and retired. Her temple is placed at Dume, north-west of Abomey. benin-vodun's Mawu-Lisa record covers the twins; this record is about the figure behind them.\n\n" +
      "WHY SHE IS DIFFICULT. Because a remote, retired creator is exactly the figure a missionary or an ethnographer looking for a 'high god' wants to find, and exactly the figure who is least served. Nana Buluku has few cult houses; she appears more in cosmology told to outsiders than in ritual. The name has cognates — Nana Buruku, Nana Bukuu — across the Yoruba-Gbe borderland and among Akan peoples, which has led some writers to call her 'the oldest deity of West Africa'. That is a claim of age made from wide distribution, which is not the same as evidence of age (see the record on ancient-derivation theories).\n\n" +
      "IN BRAZIL. NANÃ, the elder water-and-mud vodun of the Jeje and orisha of the Nagô, mother of Omolu (Sakpata's counterpart), is one of the most important figures of Candomblé. Parés treats her as a documented case of a Gbe power that crossed, with her name; her Brazilian character — old, associated with swamps, death and the beginning of things — was elaborated in Bahia.\n\n" +
      "SIGNIFICANCE. Nana Buluku shows how a cosmology recorded in one city in 1931 became 'Fon religion' in reference books, and how a name with a real Gbe-Yoruba history became, in Brazil, a living power with its own iconography. Both facts are true; neither should be read as the other.",
    category: "religion",
    subcategory: "Powers",
    eventType: "religious_account",
    tags: vodunTags(T, ["deity: mawu-lisa", "place: abomey", "place: bahia and brazil"], "nana buluku", "nana"),
    people: ["Nana Buluku", "Mawu", "Lisa", "Nanã"],
    civilisations: ["Fon", "Jeje (Brazil)"],
    locationName: "Dume, north-west of Abomey, and Abomey",
    lat: 7.25,
    lng: 1.9,
    media: [P.kahnRoyalEmblems, P.casaVodunsi],
    claims: [
      {
        sourceKey: "wa_herskovits_outline_1933",
        citations: [
          { sourceKey: "wa_parrinder_1949", relation: "supports", note: "Parrinder repeats Nana Buluku as the Fon supreme being in his comparative survey." },
          { sourceKey: "wa_wikipedia", relation: "context", note: "The Wikipedia article on Nana Buluku gives the Dume temple and the variants of the name." },
        ],
        startYear: 1931,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The recording of the Nana Buluku cosmology in Abomey",
        originalDateText: "Recorded in Abomey in 1931, published 1933",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. The fieldwork date of the account that made Nana Buluku the Fon creator in the literature. It dates the account, not the figure; earlier mentions may exist and were not found here.",
      },
      undated({
        sourceKey: "wa_practitioner_tradition",
        citations: [{ sourceKey: "wa_pares_2013", relation: "context", note: "Parés treats Nanã's Brazilian cult as formed in Bahia from a Gbe name." }],
        text: "Before the world: Nana Buluku makes it and withdraws",
        what: "Nana Buluku's place in time, in the cosmology",
        chronology: "religious",
        method: "oral_tradition",
        kind: "primordial",
        evidence: "EVIDENCE TYPE: religious tradition. Creation time, not historical time. No date can or should be given.",
      }),
    ],
  },

  {
    slug: "supreme-god-question-mawu-and-the-missionaries",
    title: "Was Mawu always the supreme god? Missionaries, translation and the Ewe debate",
    summary:
      "When the Bremen Mission chose 'Mawu' for the Christian God in Ewe, it made a Gbe power into the God of the Bible. Historians since have asked how far Mawu's 'supremacy' is old, and how far it grew in that encounter.",
    description:
      "THE TRANSLATION. Protestant missionaries of the Norddeutsche (Bremen) Mission, working among the Ewe from 1847, rendered the Christian God as MAWU and classed the trɔwo — the powers actually served in shrines — as demons, with the devil as Abosam. Meyer's Translating the Devil documents the choice and its consequences: Ewe Christians inherited a God with an Ewe name and a demonology made of their own gods.\n\n" +
      "THE OLDER EVIDENCE. Mawu is certainly older than the missions: Mau appears in Burton (1864) as the moon who 'made man in conjunction with Lisa'; Ellis (1890) calls Mawu 'the chief' of the Ewe gods, to whom sacrifice is 'never offered directly'. In Abomey, the Mawu-Lisa cult was brought in from Aja country in the eighteenth century by Tegbesu and his kpojito Hwanjile, according to the oral history Bay reconstructs — which makes Mawu's royal prominence there a dated political event.\n\n" +
      "THE DISPUTE. POSITION 1 (older views; Parrinder): African peoples generally had a remote supreme being, and Mawu is the Ewe and Fon one. POSITION 2 (historians including Greene, 1996): 'supreme gods' have histories; their prominence rose and fell with politics, contact with neighbours and, in the nineteenth and twentieth centuries, with missionaries who needed a word for God and enlarged the one they chose. NEEDS SOURCE VERIFICATION for Greene's exact argument, summarised here from the literature on the debate. The two positions are not wholly opposed: Mawu can be old and also have grown.\n\n" +
      "SIGNIFICANCE. The question decides how the top of every Gbe 'pantheon' in this expansion should be read. It also bears on Haiti, where Bondye ('Bon Dieu') occupies the remote-creator position — a structure that resembles the Mawu pattern and has its own, Catholic, history. Resemblance there is not evidence that one was copied from the other.",
    category: "religion",
    subcategory: "Debate",
    eventType: "disputed",
    tags: vodunTags(T, ["deity: mawu-lisa", "deity: bondye", "practice: catholic contact", "place: togo and ewe country"], "debate", "missionaries", "translation"),
    people: ["Mawu", "Hwanjile", "Tegbesu"],
    civilisations: ["Ewe", "Fon", "Norddeutsche Mission (Bremen Mission)"],
    locationName: "Ewe country (Togo and the Volta Region) and Abomey",
    lat: 6.6,
    lng: 0.9,
    media: [P.legbaHebiosso, P.kahnRoyalEmblems],
    claims: [
      {
        sourceKey: "wa_burton_gelele_1864",
        citations: [{ sourceKey: "wa_ellis_ewe_1890", relation: "supports", note: "Ellis (1890) records Mawu as chief of the Ewe gods, without direct sacrifice." }],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "A dated pre-Bible description of Mawu as a creator in Dahomey",
        originalDateText: "Burton: Mau 'made man in conjunction with Lisa' (1864)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. A dated description of Mawu as creator before the complete Ewe Bible. It shows the figure existed independently of the missions' translation; it does not settle how 'supreme' she was.",
      },
      {
        sourceKey: "wa_bay_1998",
        startYear: 1740,
        endYear: 1774,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The introduction of the Mawu-Lisa cult to Abomey under Tegbesu and Hwanjile",
        originalDateText: "Under Tegbesu, with the kpojito Hwanjile, mid-eighteenth century",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: oral tradition. Dahomean oral history, dated by the historians' reign-chronology of Tegbesu. A date for the cult's royal installation at Abomey, not for Mawu.",
      },
      undated({
        sourceKey: "wa_greene_1996_supreme",
        citations: [{ sourceKey: "wa_meyer_1999", relation: "supports", note: "Meyer documents the missionary choice of Mawu for God and its effects." }],
        text: "Supremacy as a history, not a given",
        what: "When Mawu became the supreme god",
        chronology: "disputed",
        evidence: "EVIDENCE TYPE: modern interpretation. The historians' position that a supreme god's status changes over time cannot be expressed as one date. NEEDS SOURCE VERIFICATION for Greene's formulation.",
      }),
    ],
  },

  {
    slug: "aido-hwedo-the-rainbow-serpent",
    title: "Aido-Hwedo: the rainbow serpent who carried the creator",
    summary:
      "Aido-Hwedo — 'Aydo-whe-do, commonly called Danh, the Heavenly Snake' in Burton's 1864 list — is the rainbow serpent of Gbe cosmology who carried the creator and coils beneath the earth. Haitian Vodou's Ayida Wedo carries the name.",
    description:
      "THE DOCUMENTED NAME. Burton, 1864: '23. Aydo-whe-do, — commonly called Danh, the Heavenly Snake, which makes the Popo beads and confers wealth upon man, — is the rainbow. Its emblem is ... a coiled and horned snake of clay, in a pot or calabash. This utensil, duly whitewashed, is placed at the foot of a silk-cotton tree, or near hills of white ants, which are called Danh's houses.' Ellis (1890) refers to a boa 'regarded as the messenger of the rainbow-god'. These are the earliest dated descriptions found here.\n\n" +
      "THE COSMOLOGY. In the narratives the Herskovitses collected in Abomey in 1931 (published 1958), Aido-Hwedo carried the creator through the world as it was being made — mountains are where the serpent rested and its excrement became metal — and now lies coiled beneath the earth, tail in mouth, holding it together; were it to fail, the world would slide into the sea. Red monkeys forge iron bars beneath the sea to feed it.\n\n" +
      "HOW IT RELATES TO DAN. benin-vodun's Dan record treats Dan as the serpent of movement and continuity and Dangbe as the Hueda python. Aido-Hwedo is the cosmic, celestial aspect — the rainbow — of the same serpent family of powers; Burton's informants used 'Danh' for both. The distinction between earthly python, rainbow and cosmic serpent is partly the informants' and partly the ethnographers' systematisation.\n\n" +
      "IN THE DIASPORA. AYIDA WEDO in Haitian Vodou, paired with Danbala as rainbow and serpent, is a direct correspondence of name (Aido-Hwedo → Ayida Wedo). In Brazilian Jeje Candomblé the serpent vodun is Bessen; the Yoruba rainbow serpent OSHUMARE (Oxumarê) is a separate figure from the Yoruba side, which in Brazil and Cuba is often identified with the Gbe one. The comparison record weighs what those correspondences show.\n\n" +
      "SIGNIFICANCE. Aido-Hwedo is the best-documented case of a Gbe cosmological figure whose name crossed to Haiti intact. It is also, because the image of a world-encircling serpent biting its tail is common across many cultures, the figure most often pulled into claims of a single 'universal serpent' — which the comparison record answers.",
    category: "religion",
    subcategory: "Powers",
    eventType: "religious_account",
    tags: vodunTags(T, ["deity: dan and aido-hwedo", "practice: serpent veneration", "place: abomey", "place: ouidah"], "rainbow", "cosmology"),
    people: ["Aido-Hwedo", "Dan", "Mawu"],
    civilisations: ["Fon", "Hueda"],
    locationName: "Whydah (Ouidah) and Abomey",
    lat: 7.18,
    lng: 1.99,
    media: [P.kahnDanHouse, P.veveDanbala, P.oshumareImage],
    claims: [
      {
        sourceKey: "wa_burton_gelele_1864",
        citations: [{ sourceKey: "wa_ellis_ewe_1890", relation: "supports", note: "Ellis mentions the boa as 'messenger of the rainbow-god' in 1890." }],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Burton's description of Aydo-whe-do, the rainbow serpent",
        originalDateText: "'Aydo-whe-do, commonly called Danh, the Heavenly Snake' (Burton 1864)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. The earliest dated written description found here; a latest-by date for the name and the shrine form, nothing more.",
      },
      {
        sourceKey: "wa_herskovits_narrative_1958",
        startYear: 1931,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Collection of the Aido-Hwedo creation narratives in Abomey",
        originalDateText: "Narratives collected in 1931, published 1958",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. The date the cosmological story was written down from tellers; NEEDS SOURCE VERIFICATION for the wording of individual narratives.",
      },
      undated({
        sourceKey: "wa_practitioner_tradition",
        text: "From the making of the world",
        what: "Aido-Hwedo in cosmological time",
        chronology: "religious",
        method: "oral_tradition",
        kind: "primordial",
        citations: [{ sourceKey: "wa_wikipedia", relation: "context", note: "Name variants (Aido Hwedo, Aydo-whe-do, Ayida Wedo) cross-checked." }],
        evidence: "EVIDENCE TYPE: religious tradition. Creation time. No date is given.",
      }),
    ],
  },

  {
    slug: "dan-aido-hwedo-and-the-cosmic-serpent-comparison",
    title: "Dan, Aido-Hwedo and the cosmic serpent: a comparison across the Atlantic and beyond",
    summary:
      "Gbe serpent powers have named descendants in Haiti (Danbala, Ayida Wedo) and Brazil (Bessen), a Yoruba neighbour (Oshumare), and look-alikes from the Nile to Scandinavia. What connects which, and on what evidence?",
    description:
      "THE CASES. (1) DAN / DANGBE, the python power of Hueda and the Dan cults of the Gbe coast (benin-vodun's Dan record; the Temple of Pythons). (2) AIDO-HWEDO, the rainbow and cosmic serpent coiled beneath the world. (3) In HAITI: DANBALA (Danbala Wedo) and AYIDA WEDO, serpent and rainbow, honoured with white offerings and drawn as twin serpents in the vèvè. (4) In BRAZIL: BESSEN, the serpent vodun of the Jeje houses, and the Yoruba OXUMARÊ. (5) In YORUBALAND: OSHUMARE, rainbow serpent orisha. (6) Further off: the Edo royal pythons (ikpin) at Benin City; Avhianwu's sacred python; Egyptian Apep and the uraeus; Norse Jörmungandr; the ouroboros.\n\n" +
      "SIMILARITIES. Serpent associated with water, rainbow, wealth and continuity in (1)–(5); a serpent encircling or supporting the world in (2), Jörmungandr and the ouroboros; living pythons protected and fed in (1), Benin City and Avhianwu; pairing of serpent and rainbow in (2), (3) and (5).\n\n" +
      "DIFFERENCES. Dangbe is a protective python of one kingdom; Aido-Hwedo is a cosmic support; Danbala is a Haitian lwa of the Rada rite with Catholic associations (St Patrick, Moses) and his own Haitian personality; Bessen and Oxumarê are distinct figures in Brazil though often merged. Apep is the enemy of the sun, speared nightly by Set — the opposite of a benevolent serpent. Jörmungandr is a monster whose release ends the world. The 'same' image carries opposite values.\n\n" +
      "EVIDENCE FOR TRANSMISSION. STRONG between the Gbe coast and Haiti and Brazil: the NAMES (Dan → Danbala; Aido-Hwedo → Ayida Wedo; Bessen from the Gbe 'Dan' cult family per Parés), the documented movement of hundreds of thousands of Gbe-speaking captives, and Rada and Jeje liturgical vocabulary in Gbe. Even here, the American forms were remade in the Americas; correspondence of name is evidence of origin, not of unchanged content. PLAUSIBLE BUT UNDOCUMENTED between Gbe and Yoruba rainbow serpents: neighbours exchanged cults constantly, but which direction is not established. NONE between West Africa and Egypt or Scandinavia: no route, no name, no intermediate attestation; the resemblance is of a kind (serpents, water, rings) found independently across the world. The serpent-kundalini collection's own control record — 'three serpents, three meanings, three dates' — makes the same point.\n\n" +
      "SIGNIFICANCE. The cosmic serpent is the clearest test of this expansion's rule: a name carried by people is evidence; a shape found everywhere is not. Danbala is a Haitian god with a Gbe name; he is not Apep, and he is not 'the universal serpent'.",
    category: "religion",
    subcategory: "Comparison",
    eventType: "other",
    eventTypeNote: "A comparison record: it sets cases side by side and says what the evidence for any connection is.",
    tags: vodunTags(
      T,
      ["deity: dan and aido-hwedo", "practice: serpent veneration", "place: saint-domingue and haiti", "place: bahia and brazil", "place: oyo and yorubaland", "deity: lwa"],
      "comparison",
      "serpent",
    ),
    people: ["Dan", "Dangbe", "Aido-Hwedo", "Danbala", "Ayida Wedo", "Bessen", "Oshumare"],
    civilisations: ["Hueda", "Fon", "Yoruba", "Haitian Vodou", "Jeje Candomblé"],
    locationName: "The Bight of Benin, Haiti and Brazil",
    lat: 6.36,
    lng: 2.09,
    media: [P.pythonOuidah, P.veveDanbala, P.dambalaFlag],
    claims: [
      {
        sourceKey: "wa_bosman_1705",
        citations: [
          { sourceKey: "wa_pares_2013", relation: "supports", note: "Parés documents the Gbe serpent vodun in Brazilian Jeje houses." },
          { sourceKey: "wa_deren_1953", relation: "supports", note: "Deren describes Danbala and Ayida Wedo in Haitian Vodou in the 1940s." },
        ],
        startYear: 1700,
        endYear: 1704,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest dated description of the Gbe serpent cult, the African end of the comparison",
        originalDateText: "Bosman's snake, the first of Hueda's three orders, about 1700",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. Dates the African side of the comparison by its earliest document. The American sides are dated in their own tracks; neither date proves continuity of content.",
      },
      undated({
        sourceKey: "wa_thompson_1983",
        citations: [{ sourceKey: "wa_matory_2005", relation: "context", note: "Matory cautions that present-day resemblance across the Atlantic can come from later two-way contact." }],
        text: "No dated connection between Gbe serpents and Egyptian or Norse ones",
        what: "Any historical link between West African and non-African cosmic serpents",
        chronology: "disputed",
        evidence: "EVIDENCE TYPE: modern interpretation. No document, name or route connects them; the claim is entered without position because there is nothing to date.",
      }),
    ],
  },

  {
    slug: "hu-agbe-and-naete-powers-of-the-sea",
    title: "Hu, Agbe and Naete: the powers of the sea",
    summary:
      "Bosman's 'third' god of Hueda was the sea. Burton names Hu the ocean, Agbe its god, Nate its storekeeper and Avrekete the trickster who steals Nate's keys for mankind. Haiti's Agwe and the Avrekete of Trinidad and Brazil carry the names.",
    description:
      "THE EARLIEST LAYER. Bosman, about 1700: 'The third and meanest God or Younger Brother to the other is the Sea.' A sea cult at the Hueda coast, ranked below the snake and trees, with offerings to calm the surf for canoes and shipping.\n\n" +
      "BURTON, 1864. 'The youngest brother of the triad is Hu, the ocean or sea ... The Hu-no, or ocean priest, is now considered the highest of all, a fetish king, at Whydah ... At stated times he repairs to the beach, begs \"Agbwe\" ... not to be boisterous, and throws in rice and corn, oil and beans, cloth, cowries, and other valuables.' He adds that the king of Dahomey sent a man in a caboceer's regalia from Abomey, carried by canoe out to sea and thrown to the sharks, as an ocean sacrifice — a report, recorded as such. His list continues: 'Nate, the storekeeper of the sea, who is worshipped by fishermen, and those who work by water', and 'Avrekete, a fetish which steals the keys from Nate and gives to man — hence he has some 500 wives.'\n\n" +
      "THE LATER SYSTEM. In the Herskovitses' Abomey account (1931), AGBE (with his female twin NAETE) heads the sea pantheon as one of Mawu-Lisa's children, and Avrekete is the youngest, the go-between. The sea pantheon was strongest on the coast — Ouidah, Grand-Popo, the Gen and Ewe shore — and much less in Abomey.\n\n" +
      "IN THE DIASPORA. AGWE (Agwe Tawoyo), lwa of the sea in Haitian Vodou, offered a 'barque' sent out on the water, corresponds by name to Agbe. AVREKETE (Afrekete) is found among the Ewe, in the Tambor de Mina of Maranhão and in Trinidad's Rada tradition. These are documented name-correspondences; the American cults were formed in the Americas.\n\n" +
      "SIGNIFICANCE. The sea vodun are the coastal Gbe religion par excellence: powers of fishing, surf, trade and, after 1500, of the ships that came over the horizon. That the sea priest of Ouidah became 'the highest of all' by the nineteenth century is one of the clearest documented changes in the religion's internal hierarchy.",
    category: "religion",
    subcategory: "Powers",
    eventType: "historical",
    tags: vodunTags(T, ["deity: ezili and water spirits", "place: ouidah", "deity: lwa", "place: trinidad and the caribbean"], "sea", "agbe", "avrekete"),
    people: ["Hu", "Agbe", "Naete", "Avrekete"],
    civilisations: ["Hueda", "Fon", "Ewe", "Gen (Mina)"],
    locationName: "The beach at Ouidah and the Gbe coast",
    lat: 6.33,
    lng: 2.08,
    media: [P.ouidahBeachShrine, P.mamiDanConvent],
    claims: [
      {
        sourceKey: "wa_bosman_1705",
        startYear: 1700,
        endYear: 1704,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest written record of the Hueda sea cult",
        originalDateText: "'The third ... is the Sea' (Bosman, about 1700)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. A latest-by date for a cult of the sea at Hueda. It names no deity.",
      },
      {
        sourceKey: "wa_burton_gelele_1864",
        citations: [{ sourceKey: "wa_herskovits_dahomey_1938", relation: "supports", note: "Herskovits places Agbe and Naete at the head of the sea pantheon in the 1931 Abomey account." }],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Burton's naming of Hu, Agbwe, Nate and Avrekete",
        originalDateText: "Hu, Agbwe, Nate and Avrekete in Burton's list (1864)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. The earliest dated written use of these names found here. It dates the record of them.",
      },
    ],
  },


  {
    slug: "loko-and-the-great-trees",
    title: "Loko and Hun-tin: the vodun who live in great trees",
    summary:
      "Burton recorded two tree powers at Whydah in 1864: the Hun-'tin or silk-cotton, with as many devotees as the snake, and Loko, the iroko, with its own pottery 'bought in every market'. In Haiti, Loko is the lwa of trees and of the priesthood.",
    description:
      "THE TREES. Two species dominate the sacred trees of the Gbe coast: the IROKO (Milicia excelsa), called loko, and the SILK-COTTON or kapok (Ceiba pentandra; in Burton 'Hun-'tin'). Both are huge, long-lived and conspicuous in a cleared landscape. Bosman, about 1700, called the Hueda tree gods 'lofty high Trees'.\n\n" +
      "BURTON, 1864. The trees 'are prayed to and presented with offerings in times of sickness, and especially of fever. Those most revered are the Hun-'tin, or acanthaceous silk cotton (Bombax), whose wives equal those of the snake, and the Loko ... The latter numbers few Loko-'si, or Loko spouses: on the other hand, it has its own fetish pottery, which may be bought in every market. An inverted pipkin full of cullender holes is placed upon the ground at the tree foot, and by its side is a narrow-necked little pot into which the water offering is poured.' Ellis (1890) repeats that Loko is 'chiefly sacrificed to in time of sickness'. In the Herskovitses' Abomey system Loko is a child of Mawu-Lisa.\n\n" +
      "WHAT A TREE VODUN IS. Not the tree as a plant but a power that dwells in or with it; the cloth tied round the trunk, the pots at its foot and the prohibition on felling mark it. Trees are also where other powers are approached: Burton's Aido-Hwedo pots stand 'at the foot of a silk-cotton tree'.\n\n" +
      "THE 1930 PHOTOGRAPHS. Gadmer's autochromes of sacred irokos at Adjarra and Porto-Novo, captioned 'arbre fétiche' and 'base d'un rocco', are dated images of tree cult sixty-six years after Burton.\n\n" +
      "IN HAITI. LOKO (Papa Loko, Loko Atisou) is the lwa of trees and healing leaves and, with Ayizan, the patron of the priesthood and of kanzo initiation; the poto mitan (centre-post) of the temple is associated with him, and the mapou (silk-cotton) is a resting place of lwa. A name-correspondence with a documented Gbe power, and a Haitian elaboration.\n\n" +
      "SIGNIFICANCE. Loko connects the oldest written evidence (Bosman's tree gods), the most detailed (Burton's pottery), the first colour photographs (1930) and a major Haitian lwa. It is the best case in this track for a cult of trees with a continuous documented name.",
    category: "religion",
    subcategory: "Sacred trees and forests",
    eventType: "historical",
    tags: vodunTags(T, ["practice: sacred trees and forests", "practice: healing and herbal knowledge", "place: ouidah", "place: porto-novo", "deity: lwa"], "loko", "iroko", "silk-cotton"),
    people: ["Loko"],
    civilisations: ["Hueda", "Fon", "Gun"],
    locationName: "Whydah (Ouidah), Adjarra and Porto-Novo",
    lat: 6.5,
    lng: 2.4,
    media: [P.kahnIrokoAdjarra, P.kahnIrokoPortoNovo, P.kahnIrokoVillage],
    claims: [
      {
        sourceKey: "wa_burton_gelele_1864",
        citations: [{ sourceKey: "wa_ellis_ewe_1890", relation: "supports", note: "Ellis repeats Loko's role in sickness in 1890." }],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Burton's description of the Loko and silk-cotton tree cults",
        originalDateText: "Hun-'tin and Loko in Burton's chapter XVII (1864)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. The earliest dated naming of Loko found here. A latest-by date.",
      },
      {
        sourceKey: "wa_aupiais_gadmer_1930",
        startYear: 1930,
        startMonth: 1,
        startDay: 19,
        datePrecision: "day",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Autochrome of a sacred iroko ('arbre fétiche') at Adjarra",
        originalDateText: "Adjarra, 19 January 1930",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. A dated, captioned photograph from a museum archive. It establishes that this tree was under cult in 1930.",
      },
    ],
  },

  {
    slug: "sacred-trees-and-forests-comparison",
    title: "Sacred trees and forests: the iroko, the silk-cotton, the mapou and the ceiba",
    summary:
      "Iroko and silk-cotton on the Gbe coast; the iroko-orisha of the Yoruba; the mapou of Haiti; the ceiba of Cuba; the gameleira and cajazeira of Brazil. A comparison of sacred trees and groves, and of the evidence that links them.",
    description:
      "THE CASES. (1) GBE COAST: Loko (iroko) and the silk-cotton (Burton 1864); sacred groves such as Kpassè at Ouidah and the forest of Glidji; Bosman's 'lofty trees' at Hueda (c. 1700). (2) YORUBA: Iroko as an orisha-tree; sacred groves such as Oshogbo's. (3) HAITI: the MAPOU (Ceiba pentandra) as a reposwa, resting-place of lwa, and Loko as lwa of trees (Métraux, Deren). (4) CUBA: the CEIBA as the tree of Iroko and of the dead, and 'el monte' as the source of power (Cabrera 1954). (5) BRAZIL: the gameleira (Ficus) as Iroko/Loko in Candomblé, the cajazeira in the yard of the Casa das Minas. (6) For contrast, from other collections in this timeline: the Egyptian sycamore goddess, the Assyrian 'sacred tree' reliefs.\n\n" +
      "SIMILARITIES. Great, long-lived trees as dwellings of powers or of the dead in (1)–(5); offerings at the foot; cloth tied round the trunk; prohibitions on felling; groves as places of initiation and burial.\n\n" +
      "DIFFERENCES. The SPECIES changed because the flora did: no iroko grows in Haiti or Cuba, so the silk-cotton — native to both sides of the Atlantic — took the role, and in Brazil a fig did. The THEOLOGY changed: in Haiti the mapou is one of several trees where lwa rest, and Loko presides over the priesthood rather than over sickness; in Cuba the ceiba is also Catholic (the Templete in Havana) and Kongo (nfinda). In Egypt and Assyria the tree is an icon in temple art, not a living shrine.\n\n" +
      "EVIDENCE FOR TRANSMISSION. GOOD for the Gbe–Haiti–Brazil link: a documented NAME (Loko on both sides; Iroko in Cuba and Brazil), documented movement of people, and the substitution of a local tree for an African one, which is what transmission under new ecological conditions looks like. MIXED for which African source: Kongo traditions also treat trees as seats of the dead, and Thompson's attribution of American forms to particular African peoples is contested. NONE between West Africa and Egypt or Mesopotamia: tree-veneration is too widespread for resemblance to mean anything without a route.\n\n" +
      "SIGNIFICANCE. The sacred tree is the cleanest example in this expansion of a practice that crossed by NAME and FUNCTION while its physical vessel was replaced — a reminder that continuity in a diaspora religion is more often a matter of role than of object.",
    category: "religion",
    subcategory: "Comparison",
    eventType: "other",
    eventTypeNote: "A comparison record.",
    tags: vodunTags(
      T,
      ["practice: sacred trees and forests", "place: saint-domingue and haiti", "place: cuba", "place: bahia and brazil", "place: oyo and yorubaland", "deity: orisha"],
      "comparison",
      "trees",
    ),
    people: ["Loko", "Iroko"],
    civilisations: ["Fon", "Hueda", "Yoruba", "Haitian Vodou", "Lucumí (Santería)", "Candomblé"],
    locationName: "The Bight of Benin, Haiti, Cuba and Brazil",
    lat: 6.36,
    lng: 2.09,
    media: [P.kahnIrokoVillage, P.mapouHaiti, P.templeteCeiba, P.casaTree],
    claims: [
      {
        sourceKey: "wa_bosman_1705",
        citations: [
          { sourceKey: "wa_metraux_1959", relation: "supports", note: "Métraux documents the mapou as a tree of the lwa in Haiti." },
          { sourceKey: "wa_cabrera_1954", relation: "supports", note: "Cabrera documents the ceiba as Iroko's tree in Cuba." },
        ],
        startYear: 1700,
        endYear: 1704,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest written evidence for the African side of the comparison",
        originalDateText: "Bosman's 'lofty high Trees', about 1700",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. Dates the African tree cult's first appearance in writing; the diaspora sides are dated by their own sources. It does not establish continuity of content.",
      },
      undated({
        sourceKey: "wa_thompson_1983",
        text: "Which African traditions the American tree cults derive from: contested",
        what: "The African source of American sacred-tree practice",
        chronology: "disputed",
        citations: [{ sourceKey: "wa_matory_2005", relation: "context", note: "Matory's caution about reading present resemblance as descent." }],
        evidence: "EVIDENCE TYPE: modern interpretation. Gbe and Kongo sources are both plausible; the attribution is argued, not dated.",
      }),
    ],
  },

  {
    slug: "sacred-groves-as-surviving-forest",
    title: "Sacred groves as surviving forest: vodun forests and the ecology of the Dahomey Gap",
    summary:
      "Southern Bénin and Togo lie in the Dahomey Gap, a savanna corridor where rainforest gave way thousands of years ago. Many of the forest patches that remain are vodun groves — protected because powers live there — and are now also biodiversity reserves.",
    description:
      "THE LANDSCAPE. benin-deep-past's records on the Dahomey Gap describe how the forest belt was broken here in the Holocene, leaving a drier, more open coast between the forests of Ghana and Nigeria. In that cleared landscape, remaining patches of dense forest stand out — and a large share of them are sacred groves (zoun, vodun forests): burial grounds, cult houses, convents, the dwellings of powers, kept from cutting by prohibition.\n\n" +
      "WHAT THE RESEARCH SAYS. Juhé-Beaulaton and other historians and ecologists of Bénin and Togo have documented hundreds of such groves, ranging from a few trees to several hectares, with their own histories as former settlement sites, royal burial places or the forests of particular vodun. Since the 1990s, conservation projects have recognised them as refuges for species lost elsewhere, and some have been given legal protection as community forests. NEEDS SOURCE VERIFICATION for the numbers of groves inventoried, which vary by survey and are not reproduced here.\n\n" +
      "WHAT IS NOT ESTABLISHED. That the groves are relics of the ancient rainforest. Some may be; many are secondary forest that has grown up on sites protected for religious reasons for decades or centuries. The religious protection is the cause of the forest's survival in many cases, not a consequence of its antiquity.\n\n" +
      "THE TENSION. Reframing a grove as a 'biodiversity reserve' changes who has authority over it — priests and lineages, or the state and NGOs — and has been contested. Some priests welcome protection; others resent rules made for a forest they understand differently.\n\n" +
      "SIGNIFICANCE. The vodun grove is the place where religious history and environmental history meet: the shape of the present landscape of southern Bénin is partly a map of where powers were said to live.",
    category: "religion",
    subcategory: "Sacred trees and forests",
    eventType: "historical",
    tags: vodunTags(T, ["practice: sacred trees and forests", "place: ouidah", "place: togo and ewe country"], "ecology", "conservation", "dahomey gap"),
    civilisations: ["Fon", "Gun", "Hueda", "Ewe", "Guin (Gen, Mina)"],
    locationName: "Southern Bénin and Togo (the Dahomey Gap)",
    lat: 6.7,
    lng: 2.0,
    media: [P.kpasseGiantTree, P.kpasseForest],
    claims: [
      {
        sourceKey: "wa_juhe_beaulaton_2008",
        citations: [{ sourceKey: "wa_greene_2002", relation: "supports", note: "Greene documents the history of Anlo sacred groves and their colonial reinterpretation." }],
        startYear: 1990,
        endYear: 2008,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The reframing of vodun groves as conservation sites",
        originalDateText: "Sacred groves enter conservation policy, 1990s–2000s",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: modern interpretation. The period in which research and policy recast the groves as biodiversity reserves; it dates the reframing, not the groves.",
      },
      undated({
        sourceKey: "wa_practitioner_tradition",
        text: "Groves kept because the powers live there",
        what: "When the groves began to be protected",
        chronology: "traditional",
        method: "oral_tradition",
        citations: [{ sourceKey: "wa_bosman_1705", relation: "context", note: "Tree cults are attested at Hueda by about 1700, giving a latest-by date for the practice, not for any grove." }],
        evidence: "EVIDENCE TYPE: oral tradition. Each grove has its own story; the practice is attested by about 1700, and individual groves are usually undated.",
      }),
    ],
  },

  {
    slug: "age-aziza-and-the-power-of-the-bush",
    title: "Agé, the Aziza and the power of the bush: hunters, healers and forest beings",
    summary:
      "Beyond the village lies the bush, and its powers: Agé, vodun of hunters and wild animals; the Aziza, small forest beings said to have taught hunters fire, medicine and the use of leaves; Burton's 'great bush fetish, which helps huntsmen'.",
    description:
      "THE BUSH AS A RELIGIOUS PLACE. In Gbe thought the cultivated village and the uncultivated bush (gbe, the same word as 'language' in some Gbe tongues by homophony, and the root of 'gbeto', hunter) are different domains with different powers. Hunters cross between them; so do healers, whose leaves come from the bush.\n\n" +
      "AGÉ. In the Abomey account recorded by the Herskovitses, AGÉ is a child of Mawu-Lisa given the bush and its animals; hunters serve him. Burton in 1864 already records 'Gbwe-ji, the great bush fetish, which helps huntsmen and foresters. It is in the shape of a small snake, marked like a boa' — a bush power under another name, which is the normal state of the record: the same domain is held by differently named powers in different towns.\n\n" +
      "THE AZIZA. Small beings who live in the forest — in anthills and silk-cotton trees — and who gave hunters magic, and gave people knowledge of fire, of the medicinal use of plants and of the ways of the bush. Herskovits recorded them in Abomey; they appear in Jeje Brazil as a single 'Aziza' figure. Wikipedia's article notes that a winged image of the Aziza rests on one late source and should not be taken as traditional.\n\n" +
      "HEALING. The bush is the pharmacy. Vodun priests and Fa diviners are also herbalists: leaves (ama) are gathered with incantations, prepared as baths and medicines, and their knowledge is guarded. The 1930 autochrome of the altar of Djéholou at Adjarra, filed by the archive under 'prophylaxis' and 'illness', shows a shrine approached for healing. Sweet's history of the eighteenth-century healer Domingos Álvares shows such knowledge travelling with one man from the Mahi country to Brazil and Portugal.\n\n" +
      "SIGNIFICANCE. Hunters are the founders in many Gbe origin traditions, and the bush is where knowledge comes from in many myths: these powers explain why healing, hunting and founding are religious acts. In Haiti, the leaf-knowledge of the houngan and the lwa Loko and Gran Bwa ('great wood') keep the bush as a religious domain in a new landscape.",
    category: "religion",
    subcategory: "Powers",
    eventType: "religious_account",
    tags: vodunTags(T, ["practice: healing and herbal knowledge", "practice: sacred trees and forests", "place: abomey"], "aziza", "age", "hunters", "bush"),
    people: ["Agé", "Aziza", "Domingos Álvares"],
    civilisations: ["Fon", "Mahi"],
    locationName: "Abomey plateau and the bush of southern Bénin",
    lat: 7.2,
    lng: 2.0,
    media: [P.kahnHealingAltar, P.kpasseDiviner],
    claims: [
      {
        sourceKey: "wa_burton_gelele_1864",
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Burton's 'great bush fetish, which helps huntsmen and foresters'",
        originalDateText: "Gbwe-ji, the great bush fetish (Burton 1864)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. A dated record of a bush and hunting power at Whydah; it does not date Agé or the Aziza.",
      },
      {
        sourceKey: "wa_herskovits_dahomey_1938",
        citations: [{ sourceKey: "wa_sweet_2011", relation: "context", note: "Sweet documents vodun healing knowledge in the eighteenth century through one healer's Inquisition records." }],
        startYear: 1931,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The recording of Agé and the Aziza in Abomey",
        originalDateText: "Agé and the Aziza in the Abomey account of 1931",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. The fieldwork date of the account; NEEDS SOURCE VERIFICATION for page references.",
      },
    ],
  },

  {
    slug: "zomadonu-and-the-royal-tohossou",
    title: "Zomadonu and the royal Tohossou of Abomey — and a house in Brazil named for him",
    summary:
      "The Tohossou are royal children born with unusual bodies who became powerful vodun of the rivers; Zomadonu is the first of them. In São Luís do Maranhão the Casa das Minas, founded in the 1840s, is the 'Querebentã de Zomadonu'.",
    description:
      "WHAT benin-vodun COVERS. Its 'Twins, unusual births and the Toxosu' record explains the general category: children born with unusual features are toxosu, 'kings of the water', returned to the rivers and served as vodun. This record is about the ROYAL Tohossou of Abomey and the one who leads them.\n\n" +
      "THE ROYAL TOHOSSOU. In the accounts given to Le Hérissé (1911) and the Herskovitses (1931), children of the Dahomean royal family born with abnormal features were taken to the water, and became the Tohossou of the royal lineage, with their own temples in Abomey and their own priesthood. ZOMADONU is their chief — in tradition the first such royal child, dangerous and powerful, whose cult the kings maintained. Bay places the elaboration of the royal Tohossou cult within the eighteenth- and nineteenth-century development of the royal ancestor cult. NEEDS SOURCE VERIFICATION for which reign tradition attaches Zomadonu to.\n\n" +
      "THE BRAZILIAN HOUSE. The CASA DAS MINAS in São Luís, Maranhão, the only house of the Jeje (Dahomean) tradition in Maranhão, is called Querebentã de Zomadonu; its liturgy is in Fon, and its vodun include the royal family of Dahomey (the Davice). Its oldest document is a deed of 1847. Verger proposed that its founder, Maria Jesuína, was NA AGONTIME, a wife of King Agonglo and mother of Ghezo, sold into slavery by Adandozan — a hypothesis, often repeated as fact, and recorded here as a hypothesis.\n\n" +
      "WHAT THE CONNECTION SHOWS. A specific royal cult of one West African city, named in a specific Brazilian house, with Fon liturgy, founded within a few decades of the events in Abomey that tradition links it to. Even without Verger's identification, this is among the strongest documented Gbe–American links in the whole expansion — stronger than any resemblance, because it is a name of a particular royal cult.\n\n" +
      "SIGNIFICANCE. The Tohossou show Abomey making a royal religion out of the general Gbe treatment of unusual births. Zomadonu's house in São Luís shows that a cult so particular could cross the Atlantic with people who knew it from the inside.",
    category: "religion",
    subcategory: "Powers",
    eventType: "historical",
    tags: vodunTags(T, ["practice: ancestors", "deity: ezili and water spirits", "place: abomey", "place: bahia and brazil"], "tohossou", "zomadonu", "casa das minas"),
    people: ["Zomadonu", "Na Agontime", "Maria Jesuína", "Agonglo", "Ghezo", "Adandozan"],
    civilisations: ["Kingdom of Dahomey", "Fon", "Tambor de Mina"],
    locationName: "Abomey, Bénin, and São Luís, Maranhão, Brazil",
    lat: 7.18,
    lng: 1.99,
    media: [P.tohossouSculpture, P.casaDasMinas, P.casaVodunsi],
    claims: [
      {
        sourceKey: "wa_le_herisse_1911",
        citations: [{ sourceKey: "wa_herskovits_dahomey_1938", relation: "supports", note: "Herskovits records the royal Tohossou and Zomadonu in the 1931 Abomey account." }],
        startYear: 1911,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest written account of the royal Tohossou found here",
        originalDateText: "The royal Tohossou in Le Hérissé (1911)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. A colonial ethnography from royal informants; a latest-by date for the written record, not for the cult.",
      },
      {
        sourceKey: "wa_ferretti_1996",
        citations: [
          { sourceKey: "wa_verger_1957", relation: "context", note: "Verger's hypothesis identifying the founder with Na Agontime." },
          { sourceKey: "wa_wikipedia", relation: "supports", note: "The Casa das Minas article gives the 1847 deed as the house's oldest document." },
        ],
        startYear: 1847,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The oldest document of the Casa das Minas (Querebentã de Zomadonu)",
        originalDateText: "A deed of 1847 for the house in São Luís",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. A dated property deed. It dates the house's documentary record; the founder's identity with Na Agontime remains a hypothesis.",
      },
    ],
  },

  {
    slug: "mami-wata-and-the-snake-charmer-print",
    title: "Mami Wata on the Gbe coast: a water spirit and a Hamburg print",
    summary:
      "Mami Wata — 'mother water' in coastal pidgin — is a water spirit of wealth and danger whose commonest image comes from a chromolithograph of a snake charmer printed in Hamburg in the 1880s. In Togo and Bénin she joined the vodun.",
    description:
      "WHAT IS DOCUMENTED. Drewal's research traced the image most West Africans associate with Mami Wata — a long-haired woman with snakes about her shoulders — to a chromolithograph of a snake charmer printed in Hamburg in the 1880s (attributed to the Adolph Friedländer firm, and said to show the performer billed as Maladamatjaute), which circulated in West Africa from around 1900 and was later reprinted in India. Earlier imagery drew on European mermaids — ships' figureheads and Portuguese sereias. Hindu chromolithographs added further figures (some served as Mami Wata's 'family').\n\n" +
      "WHAT SHE IS. A water spirit of the sea and lagoons, bringing wealth, beauty and children or taking them away; foreign, often white or Indian, fond of imported goods — perfume, mirrors, gin, sweets. Her devotees, many of them women, are possessed by her; her shrines in Togo and Bénin (Mami Dan, Mami Sika, Densu and others) are distinctive. Drewal and Rush read the cult as a way of mastering the foreign by incorporating it.\n\n" +
      "ON THE GBE COAST. Mami Wata is served within vodun: Mami convents in southern Togo, Mami shrines in Porto-Novo (the pot in this record was acquired there in 1970), Ewe sculptures of Mami Wata in Ghana. She sits beside the older sea powers (Hu, Agbe, Naete) and the serpent powers (Mami Dan) rather than replacing them.\n\n" +
      "WHAT NOT TO CLAIM. That Mami Wata is an ancient African goddess unchanged for millennia — a claim made in some modern devotional literature. Water spirits are old; THIS image and THIS name are documented as nineteenth- and twentieth-century.\n\n" +
      "SIGNIFICANCE. Mami Wata is the clearest case of the open, accumulating character of Vodun: a power whose iconography was printed in Germany, copied in India and adopted on the Bight of Benin, and who now has convents. She also bridges the Atlantic in the other direction: Lasirèn in Haiti and the Watramama of Suriname are related water spirits, with their own histories.",
    category: "religion",
    subcategory: "Powers",
    eventType: "historical",
    tags: vodunTags(T, ["deity: mami wata", "deity: ezili and water spirits", "place: togo and ewe country", "place: porto-novo", "practice: possession"], "mami wata", "globalisation"),
    people: ["Mami Wata"],
    civilisations: ["Ewe", "Gen (Mina)", "Gun", "Fon"],
    locationName: "The lagoons and coast of Togo and Bénin",
    lat: 6.3,
    lng: 1.8,
    media: [P.mamiWataPoster, P.mamiWataPot, P.mamiWataEwe, P.mamiDanConvent],
    claims: [
      {
        sourceKey: "wa_drewal_2008",
        citations: [{ sourceKey: "wa_drewal_1988", relation: "supports", note: "Drewal's 1988 article first set out the snake-charmer print's role." }],
        startYear: 1880,
        endYear: 1890,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Printing of the snake-charmer chromolithograph that became Mami Wata's image",
        originalDateText: "Printed in Hamburg in the 1880s",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: modern interpretation. Art-historical dating of a print; the decade is approximate. It dates the image, not the belief in water spirits.",
      },
      {
        sourceKey: "wa_rush_2013",
        citations: [{ sourceKey: "wa_montgomery_vannier_2017", relation: "supports", note: "A Togolese shrine where Mami Wata is served alongside Gorovodu and Tchamba." }],
        startYear: 1900,
        endYear: 2000,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Mami Wata cults spread within coastal vodun",
        originalDateText: "Twentieth-century spread of Mami cults in Togo and Bénin",
        datingMethod: "estimate",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: modern interpretation. Ethnographers' dating of the cult's growth from the documented circulation of images and shrines; approximate.",
      },
    ],
  },

  {
    slug: "gorovodu-the-kola-gods-from-the-north",
    title: "Gorovodu: the kola gods who came from the north",
    summary:
      "In the early twentieth century Ewe communities on the Togo and Ghana coast took in 'kola vodu' — Kunde, Ablewa, Sacra Bode and others — from the savanna north. Their spirits are northerners; their orders judge, heal and police witchcraft.",
    description:
      "WHAT GOROVODU IS. 'Goro' is the kola nut (a Hausa word), and Gorovodu are 'kola gods': a family of powers including Kunde, Ablewa, Sacra Bode (Sakrabode) and Banguele, served in orders that spread among coastal Ewe in Togo, Ghana and Bénin. Their spirits are understood to be northerners — savanna people — and their shrines use northern things: kola, Muslim-style dress, northern names.\n\n" +
      "WHERE AND WHEN. Rosenthal, who worked with Gorovodu communities for eleven years, describes them as arriving in the south in the early twentieth century, part of a wave of 'medicine' orders from the north (the anti-witchcraft Tigare of the Gold Coast belongs to the same movement). NEEDS SOURCE VERIFICATION for the earliest documented date in each community.\n\n" +
      "WHAT THEY DO. Heal; detect and punish witchcraft; arbitrate disputes; and hold devotees to strict moral law. Possession is central: the spirits come to judge and to enjoy themselves. Rosenthal reads Gorovodu as a legal order as much as a religion, and as one in which southern Ewe acknowledge their dependence on the northerners their ancestors bought.\n\n" +
      "WHY IT MATTERS FOR 'ORIGINS'. Gorovodu is a vodun that came into Ewe religion within living memory of the people who first wrote about it — documented arrival, documented spread. It shows the system's openness at work in the twentieth century exactly as the traditions say it worked earlier, when Fa came from the east or Dangbe was absorbed by Dahomey.\n\n" +
      "SIGNIFICANCE. Any picture of 'traditional' Ewe Vodun that leaves Gorovodu out is a picture of an imagined past. The kola gods are now among the most active vodun orders on the Togolese coast and among the most studied.",
    category: "religion",
    subcategory: "Powers",
    eventType: "historical",
    tags: vodunTags(T, ["place: togo and ewe country", "practice: possession", "practice: healing and herbal knowledge"], "gorovodu", "kola", "anti-witchcraft"),
    people: ["Kunde", "Ablewa", "Sacra Bode"],
    civilisations: ["Ewe", "Gen (Mina)"],
    locationName: "Coastal Togo and south-eastern Ghana",
    lat: 6.2,
    lng: 1.3,
    media: [P.togovilleAltar, P.slaveCoastMap],
    claims: [
      {
        sourceKey: "wa_rosenthal_1998",
        citations: [{ sourceKey: "wa_montgomery_vannier_2017", relation: "supports", note: "A recent ethnography of a Gorovodu shrine in southern Togo." }],
        startYear: 1900,
        endYear: 1940,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Arrival of Gorovodu orders among the coastal Ewe",
        originalDateText: "Early twentieth century, from the savanna north",
        datingMethod: "estimate",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: modern interpretation. An ethnographer's dating from practitioners' accounts and colonial-era evidence of northern 'medicine' cults; approximate. NEEDS SOURCE VERIFICATION.",
      },
    ],
  },

  {
    slug: "mama-tchamba-spirits-of-the-bought-people",
    title: "Mama Tchamba: serving the spirits of the people the ancestors bought",
    summary:
      "Among the Ewe and Mina of the Togo coast, Mama Tchamba honours the spirits of enslaved northerners whom ancestors bought — some sold on, some kept as wives. The descendants of slave-owners serve the enslaved as powers.",
    description:
      "WHAT IT IS. A vodun order named for Tchamba, a northern people and town (in present Togo), standing for the north and its people generally. Its spirits are those of 'bought people' — men and women from the savanna purchased by coastal lineages in the eighteenth and nineteenth centuries, some sold into the Atlantic trade, many kept, married into the lineage and becoming mothers and grandmothers of its members. Descendants inherit the obligation to honour them: they wear Tchamba iron bracelets, use northern names, keep shrines with northern objects, and are possessed by the spirits, who demand recognition.\n\n" +
      "WHAT THE SCHOLARSHIP SAYS. Wendl (1999), Rosenthal (1998) and Montgomery and Vannier (2017) describe Mama Tchamba as a ritual memory of domestic and Atlantic slavery from the slave-holders' side: a cult in which guilt, kinship and debt to the enslaved are acknowledged and served. That domestic slavery and the purchase of northern captives were part of coastal Ewe and Mina history is documented independently.\n\n" +
      "WHEN. The slavery remembered is eighteenth- and nineteenth-century. The cult in its present form is documented from the twentieth century and grew strongly after independence. NEEDS SOURCE VERIFICATION for earliest attestation.\n\n" +
      "WHY IT IS HERE. Because the brief of this track includes ancestors, and Mama Tchamba is ancestor religion turned toward people who were not, by birth, ancestors at all — strangers who became kin through enslavement and marriage. It is also the West African mirror of the diaspora tracks: on the Atlantic's other side, the enslaved remembered Africa; here, the people who sold and kept them remember the enslaved.\n\n" +
      "SIGNIFICANCE. Mama Tchamba shows Vodun carrying a moral and historical memory of slavery that written history on this coast long avoided, and shows the religion as an instrument for living with that history, not escaping it.",
    category: "religion",
    subcategory: "Ancestors",
    eventType: "historical",
    tags: vodunTags(T, ["practice: ancestors", "practice: possession", "place: togo and ewe country"], "tchamba", "slavery", "memory"),
    civilisations: ["Ewe", "Gen (Mina)", "Tchamba"],
    locationName: "Coastal Togo (Aného, Lomé) and south-eastern Ghana",
    lat: 6.23,
    lng: 1.6,
    media: [P.togovilleAltar, P.slaveCoastMap],
    claims: [
      {
        sourceKey: "wa_wendl_1999",
        citations: [
          { sourceKey: "wa_rosenthal_1998", relation: "supports", note: "Rosenthal describes Mama Tchamba alongside Gorovodu." },
          { sourceKey: "wa_montgomery_vannier_2017", relation: "supports", note: "Montgomery and Vannier describe Tchamba spirits as those of slaves bought by ancestors." },
        ],
        startYear: 1990,
        endYear: 1999,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Scholarly documentation of the Mama Tchamba cult",
        originalDateText: "Described by Rosenthal (1998) and Wendl (1999)",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: modern interpretation. Dates the ethnographic record. The slavery the cult remembers is eighteenth- and nineteenth-century; the cult's own beginning is not dated here.",
      },
    ],
  },

  {
    slug: "yewe-the-thunder-order-of-the-anlo",
    title: "Yewe: the closed thunder order of the Ewe",
    summary:
      "Yewe — the order of Hebieso (thunder), Avleketi (the sea) and Voduda (the python) — came west into Anlo-Ewe country in the nineteenth century. It has its own secret language, new names for initiates and its own drumming, and changed Anlo society.",
    description:
      "WHAT YEWE IS. An initiatory order serving a group of powers: HEBIESO (the thunder, Heviosso/Xevioso in Fon), AVLEKETI (the sea — the same name as Burton's Avrekete) and VODUDA (the python). Initiates are secluded, learn a secret ritual language, receive new names, wear distinctive cloth and are marked off from non-initiates; Yewe drumming is among the most elaborate sacred music of the Ewe. Benin-vodun's Heviosso record covers the thunder power; this record is about the order that carried it into Ewe country.\n\n" +
      "ITS ARRIVAL. Greene's history of the Anlo-Ewe documents new religious orders entering Anlo from the east in the nineteenth century, Yewe among them, and shows how they offered protection and status — notably to women and to people of slave or stranger origin — that clan religion did not. NEEDS SOURCE VERIFICATION for the date usually given for Yewe's establishment in Anlo.\n\n" +
      "WHY IT MATTERS. Yewe is a documented case of a Fon-Gun thunder, sea and serpent complex moving WEST into Ewe country within the historical period, adapting, and reshaping social life. It is the mirror image of the Gorovodu and Tchamba spirits that came from the north, and of Fa from the east: Ewe and Fon religion were in constant exchange.\n\n" +
      "IN GHANA TODAY. Alegba guardian figures and Yewe shrines stand before houses in the Volta Region; colonial and missionary opposition to the order in the British Gold Coast is part of its documented history.\n\n" +
      "SIGNIFICANCE. With Yewe, three powers that benin-vodun treats separately — thunder, sea and python — appear as one initiatory order in a different people's religion: evidence that 'pantheons' are assembled locally and that the units that travel are often orders and their rituals, not single gods.",
    category: "religion",
    subcategory: "Initiation and priesthood",
    eventType: "historical",
    tags: vodunTags(T, ["deity: heviosso", "deity: dan and aido-hwedo", "practice: initiation and priesthood", "practice: drumming and song", "place: togo and ewe country"], "yewe", "anlo"),
    people: ["Hebieso", "Avleketi", "Voduda"],
    civilisations: ["Anlo-Ewe", "Ewe", "Fon", "Gun"],
    locationName: "Anlo, south-eastern Volta Region, Ghana",
    lat: 5.92,
    lng: 0.99,
    media: [P.alegbaYewe, P.legbaHebiosso],
    claims: [
      {
        sourceKey: "wa_greene_1996_anlo",
        citations: [{ sourceKey: "wa_burton_gelele_1864", relation: "context", note: "Burton's Avrekete (1864) is the Fon-side name of the sea power Yewe calls Avleketi." }],
        startYear: 1800,
        endYear: 1900,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Yewe's establishment in Anlo",
        originalDateText: "In Anlo from the nineteenth century",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. A historian's dating from Anlo oral history and missionary records; given only to the century here. NEEDS SOURCE VERIFICATION for a closer date.",
      },
    ],
  },

  // =========================================================================
  // KNOWLEDGE, DIVINATION AND THE YORUBA NEIGHBOUR
  // =========================================================================
  {
    slug: "when-fa-reached-abomey",
    title: "When did Fa reach Abomey? The traditions of its arrival from the east",
    summary:
      "Fa is remembered in Dahomey as having come from the east — 'from Ife, or Fe', Burton wrote — and Dahomean traditions attach its royal adoption to particular eighteenth-century reigns. They do not agree on which.",
    description:
      "WHAT benin-vodun COVERS. Its two Fa records describe the 256 signs, the verse corpus and Fa as an information system. This record asks a historical question they leave open: when and how Fa entered the Fon kingdom.\n\n" +
      "THE DIRECTION IS NOT IN DOUBT. Fa's vocabulary, its association with Ifẹ̀ and its close match with Yoruba Ifá make an eastern, Yoruba-borderland origin for the Fon system the consensus. Burton (1864) glossed Afa as 'the Dahoman form of the Ifa of Egba-land ... His origin is from the mythical city of Ife, or Fe, as the Ffon contracts the word.' Fa diviners (bokɔnɔ) were already central at court when Burton visited.\n\n" +
      "THE DATES ARE. Dahomean traditions recorded by Maupoil and others attach the formal adoption of Fa by the kings to the early eighteenth century — under Agaja (r. c. 1718–1740), in some accounts brought by diviners from the east; under Tegbesu (r. c. 1740–1774), with the kpojito Hwanjile encouraging Fa alongside the Mawu-Lisa cult, in others. Some accounts make Fa older at Allada. These are SEPARATE CLAIMS and are kept separate here; NEEDS SOURCE VERIFICATION for the precise attributions in Maupoil.\n\n" +
      "WHAT IS LIKELY. That Fa was known on the coast before any royal adoption (divination with palm nuts and a divining chain is not something a king invents), and that 'arrival' in the traditions means arrival at court, with royal patronage. The coastal Afa of the Ewe and the Fa of the Gun and Hueda may have separate routes.\n\n" +
      "SIGNIFICANCE. Fa's arrival is the best-remembered case of the Fon importing a whole system of knowledge from a neighbour — the same openness that later brought in Mawu-Lisa, Sakpata and Dangbe. It also explains why Fa and Ifá are so close: they are one system's branches, not convergent inventions.",
    category: "religion",
    subcategory: "Divination",
    eventType: "disputed",
    tags: vodunTags(T, ["practice: divination", "place: abomey", "place: oyo and yorubaland"], "fa", "ifa", "debate"),
    people: ["Agaja", "Tegbesu", "Hwanjile"],
    civilisations: ["Kingdom of Dahomey", "Fon", "Yoruba"],
    locationName: "Abomey, Kingdom of Dahomey",
    lat: 7.18,
    lng: 1.99,
    media: [P.faTrayReplica, P.faSigns],
    claims: [
      {
        sourceKey: "wa_maupoil_1943",
        startYear: 1718,
        endYear: 1740,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "Royal adoption of Fa at Abomey, in the tradition that attaches it to Agaja",
        originalDateText: "Under Agaja, early eighteenth century",
        datingMethod: "regnal_chronology",
        chronology: "oral_tradition",
        evidence: "EVIDENCE TYPE: oral tradition. A court tradition dated by the reign it names. It dates the remembered royal adoption, not Fa's first presence. NEEDS SOURCE VERIFICATION.",
      },
      {
        sourceKey: "wa_bay_1998",
        citations: [{ sourceKey: "wa_wikipedia", relation: "context", note: "The Hwanjile article, citing Semley, says she 'encouraged the use of fa divination'." }],
        startYear: 1740,
        endYear: 1774,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "Royal promotion of Fa under Tegbesu and Hwanjile",
        originalDateText: "Under Tegbesu and the kpojito Hwanjile, mid-eighteenth century",
        datingMethod: "regnal_chronology",
        chronology: "oral_tradition",
        evidence: "EVIDENCE TYPE: oral tradition. A competing attribution dated by reign. Kept as a separate claim because the traditions do not agree.",
      },
      {
        sourceKey: "wa_burton_gelele_1864",
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Burton's description of Afa and its origin at Ife",
        originalDateText: "'His origin is from the mythical city of Ife, or Fe' (Burton 1864)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. A dated outside record of Fa practice at court and of the tradition of its eastern origin.",
      },
    ],
  },

  {
    slug: "divination-fa-ifa-afa-comparison",
    title: "Divination from the Bight of Benin to the Americas: Fa, Ifá, Afa and their descendants",
    summary:
      "Yoruba Ifá, Fon Fa and Ewe Afa are one divination family built on 16 × 16 = 256 figures and a verse corpus. In Cuba Ifá survived as a full priesthood; in Brazil it narrowed to cowrie divination before a modern revival; in Haiti it largely did not survive as a system.",
    description:
      "THE AFRICAN FAMILY. IFÁ (Yoruba): babaláwo, palm nuts (ikin) or a divining chain (ọ̀pẹ̀lẹ̀), the tray (ọpọ́n), 256 odù each with verses; Ọ̀rúnmìlà as its orisha; inscribed by UNESCO in 2008 as intangible heritage of Nigeria. FA (Fon, Gun): bokɔnɔ, the same figures (du), a personal Fa received at initiation, Legba as Fa's indispensable partner; documented at Abomey by Burton (1864) and Maupoil (1943). AFA (Ewe): the same system among the Ewe, recorded by Spieth (1911). Bascom (1969) documented the shared structure across all three.\n\n" +
      "SIMILARITIES. The binary 16 × 16 structure; the names of the principal figures (e.g. Ogbe/Gbe, Yeku/Oyeku); the use of the divining chain and tray; a memorised corpus indexed by figure; sacrifice prescribed by the verse; the diviner as scholar and healer.\n\n" +
      "DIFFERENCES. The deity of divination differs (Ọ̀rúnmìlà; Fa as a power in Fon; Afa). The relation to the other powers differs: Fa is tied to Legba in a way Ifá's Èṣù relation only partly parallels. Initiation and access differ by place and period.\n\n" +
      "IN THE AMERICAS. CUBA: Ifá survived as a full priesthood of babalawos within Lucumí religion, documented from the nineteenth century, with its own Cuban corpus; the Arará tradition kept Gbe forms. BRAZIL: the Candomblé houses mostly used cowrie divination (jogo de búzios, related to Yoruba ẹ́rìndínlógún), with full Ifá rare until twentieth-century reconnections with Nigeria. HAITI: no Fa or Ifá priesthood is documented in colonial Saint-Domingue or later; Haitian Vodou divines by other means, though Fa's partner Legba became Papa Legba.\n\n" +
      "EVIDENCE FOR TRANSMISSION. Within Africa: a shared technical vocabulary and identical structure, plus traditions of Fa's arrival from the east — strong evidence of one system spread across neighbours. To Cuba: named Yoruba-born babalawos in nineteenth-century Havana and continuous lineages — strong. To Brazil: cowrie divination continuous; Ifá revival documented as recent re-transmission. To Haiti: absence — the loss of a system requiring long apprenticeship is itself evidence about what the conditions of Saint-Domingue allowed.\n\n" +
      "SIGNIFICANCE. Divination is where knowledge, not just devotion, crossed or failed to cross. Its uneven survival is a measure of how much institutional continuity each American society allowed.",
    category: "religion",
    subcategory: "Comparison",
    eventType: "other",
    eventTypeNote: "A comparison record.",
    tags: vodunTags(
      T,
      ["practice: divination", "place: oyo and yorubaland", "place: cuba", "place: bahia and brazil", "place: saint-domingue and haiti", "deity: legba"],
      "comparison",
      "fa",
      "ifa",
    ),
    people: ["Ọ̀rúnmìlà", "Fa", "Legba"],
    civilisations: ["Yoruba", "Fon", "Ewe", "Lucumí (Santería)", "Candomblé", "Haitian Vodou"],
    locationName: "Yorubaland, the Gbe coast, Cuba, Brazil and Haiti",
    lat: 7.0,
    lng: 3.0,
    media: [P.oponIfa, P.faSigns, P.faCowries],
    claims: [
      {
        sourceKey: "wa_bascom_1969",
        citations: [
          { sourceKey: "wa_abimbola_1976", relation: "supports", note: "Abimbola describes the Ifá corpus from inside the tradition." },
          { sourceKey: "wa_spieth_1911", relation: "supports", note: "Spieth records Afa among the Ewe in 1911." },
        ],
        startYear: 1969,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Bascom's documentation of the shared Ifá–Fa–Afa structure",
        originalDateText: "Ifa Divination, 1969",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: modern interpretation. Dates the scholarly demonstration of the shared system, not the system.",
      },
      {
        sourceKey: "wa_unesco_ifa",
        startYear: 2008,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Inscription of the Ifá divination system on UNESCO's Representative List",
        originalDateText: "Inscribed 2008 (proclaimed 2005)",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: contemporary written. An official dated listing for Nigeria's Ifá. It does not list Fon Fa or Ewe Afa.",
      },
    ],
  },

  {
    slug: "orisha-and-vodun-shared-names-separate-systems",
    title: "Orisha and vodun: shared names, separate systems",
    summary:
      "Yoruba orisha and Gbe vodun are neighbours with a long exchange: Sakpata and Ṣọ̀pọ̀nnọ́, Heviosso and Ṣàngó, Gu and Ògún, Legba and Èṣù, Fa and Ifá. Some cults crossed the border; others are parallel. The systems are not the same.",
    description:
      "THE PAIRS. EARTH AND DISEASE: Sakpata (Gbe) and Ṣọ̀pọ̀nnọ́/Ọbalúayé (Yoruba). THUNDER: Heviosso/Xevioso and Ṣàngó — the Fon even called some thunder cults 'Nago' (Yoruba). IRON: Gu and Ògún. THRESHOLD AND MESSAGE: Legba and Èṣù. DIVINATION: Fa and Ifá. Others match less closely: Mawu-Lisa and Olódùmarè/Ọbàtálá; the sea's Agbe and Olókun; Dan and Ọ̀ṣùmàrè.\n\n" +
      "SIMILARITIES. Domains often correspond; some names are cognate (Fa/Ifá); possession, initiation, convents, sacrifice and divination organise both; both are 'open' systems that absorb cults.\n\n" +
      "DIFFERENCES. The vocabulary of the Gbe system (vodun, -si, -no) is not Yoruba (orisha, ìyàwó, olórìṣà). Orisha religion has a sacred centre, Ilé-Ifẹ̀, and an imperial patron, Ọ̀yọ́; vodun has several remembered centres and no single one. Ancestor cults differ: the Yoruba Egungun masquerade entered Bénin through Yoruba communities (benin-vodun's Egungun record), while Fon royal ancestors were served through the Nesuhwe and Tohossou. Personal destiny is handled through Ifá's orí in one system, Fa's personal sign in the other.\n\n" +
      "EVIDENCE FOR TRANSMISSION. Real and two-way. The Dahomean kingdom paid tribute to Ọ̀yọ́ from the 1730s to the 1820s and absorbed Yoruba captives, priests and cults; Yoruba-speaking communities (Nago, Holli, Ketu) live within Bénin; Burton and Maupoil record Fa's eastern origin. Conversely, Gbe cults (Sakpata's earth cult, according to some scholars) influenced Yoruba neighbours. But a matching domain is not evidence of shared origin: every agrarian, iron-using society has thunder, iron and disease powers. Only names, documented routes and traditions of arrival count.\n\n" +
      "IN THE AMERICAS. The distinction survived as 'nations': Jeje and Nagô in Brazil, Arará and Lucumí in Cuba, Rada and Nago lwa in Haiti — evidence that enslaved people themselves kept the two systems apart even when they worshipped side by side.\n\n" +
      "SIGNIFICANCE. Treating vodun as 'the Fon version of the orisha' — a common shorthand — erases the separate histories that the American nations preserved. Treating them as unrelated erases two centuries of documented exchange. Both errors are avoidable.",
    category: "religion",
    subcategory: "Comparison",
    eventType: "other",
    eventTypeNote: "A comparison record.",
    tags: vodunTags(
      T,
      ["deity: orisha", "deity: sakpata", "deity: heviosso", "deity: gu and ogou", "deity: legba", "place: oyo and yorubaland"],
      "comparison",
      "yoruba",
    ),
    people: ["Sakpata", "Ṣọ̀pọ̀nnọ́", "Heviosso", "Ṣàngó", "Gu", "Ògún", "Legba", "Èṣù"],
    civilisations: ["Yoruba", "Fon", "Ọ̀yọ́", "Kingdom of Dahomey", "Nago"],
    locationName: "The Yoruba–Gbe borderland: Ketu, Porto-Novo, Abomey and Ọ̀yọ́",
    lat: 7.3,
    lng: 2.6,
    media: [P.eshuShrine, P.shangoFigure, P.sakpataAppliqué],
    claims: [
      {
        sourceKey: "wa_verger_1957",
        citations: [
          { sourceKey: "wa_olupona_2011", relation: "context", note: "Olupona describes Ilé-Ifẹ̀ as the sacred centre of orisha religion." },
          { sourceKey: "wa_pares_2013", relation: "supports", note: "Parés documents the Jeje–Nagô distinction in Bahia." },
        ],
        startYear: 1957,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Verger's first systematic two-sided comparison of orisha and vodun",
        originalDateText: "Notes sur le culte des Orisa et Vodun, 1957",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "EVIDENCE TYPE: modern interpretation. Dates the comparison as scholarship. The exchanges themselves are dated by the reigns and documents cited in the text.",
      },
      {
        sourceKey: "wa_law_slave_coast_1991",
        startYear: 1730,
        endYear: 1823,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "Dahomey's tributary relationship with Ọ̀yọ́, a channel of Yoruba influence",
        originalDateText: "Dahomey tributary to Oyo, 1730s to 1820s",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. A documented political relationship that explains one route of cult exchange; approximate at both ends.",
      },
    ],
  },

  // =========================================================================
  // INSTITUTIONS OF SERVICE
  // =========================================================================
  {
    slug: "hunkpame-the-vodun-convent",
    title: "Inside the convent wall: the hunkpame and the making of a vodunsi",
    summary:
      "A vodunsi is made in the convent — the hunkpame or vodun enclosure — through months (formerly often longer) of seclusion, a new name, a ritual language and a public emergence. The institution is the religion's main school.",
    description:
      "WHAT benin-vodun COVERS. Its initiation record explains graded knowledge and why outsiders cannot record the core. This record describes the institution itself, as far as public sources allow.\n\n" +
      "THE ENCLOSURE. Each vodun cult house has a convent (Fon hunkpamɛ, 'the vodun's enclosure'; in French 'couvent'), a walled compound or a grove where novices live apart. Herskovits (1938) recorded seclusions that differed in length by cult, from months to, in some cases, years; recent practice is usually shorter. The 1930 autochrome of a 'couvent' at Adjarra and the present-day entrances at Kpassè and in Togo show the threshold, which is as far as the public goes.\n\n" +
      "WHAT HAPPENS, AS PUBLICLY DESCRIBED. Novices are 'killed' to their old life; they learn songs, dances, the cult's ritual language (incomprehensible to outsiders), prohibitions and obligations; they receive scarification or other marks in some cults; they take a new name. They emerge in a public ceremony — the 'outing' — dressed and adorned, often in trance, and return home as vodunsi, 'wives' of the vodun, whatever their sex.\n\n" +
      "WHAT IS NOT DESCRIBED. The core of the teaching. Every ethnographer from Herskovits to Rush reports that initiates refuse to disclose it, and this track does not speculate.\n\n" +
      "CHANGE AND CONTROVERSY. Colonial administrators restricted convents as places where children were withheld from school and labour; the Marxist-Leninist government of the 1970s and 1980s campaigned against them; the post-1990 state recognised them. Their length, the age of novices and consent are debated in Bénin today.\n\n" +
      "IN THE DIASPORA. The Haitian kanzo initiation with its djèvo (seclusion room), the Candomblé roncó and the Brazilian 'feitura' of an iaô or vodunsi preserve the shape: seclusion, a new name, emergence. The Jeje houses kept the Gbe word vodunsi.\n\n" +
      "SIGNIFICANCE. The convent is how the religion reproduces itself without books: it is the oral university behind the possession, the songs and the knowledge of the powers. That the American religions kept the shape of seclusion and emergence is among the strongest structural continuities in the whole expansion.",
    category: "religion",
    subcategory: "Initiation and priesthood",
    eventType: "historical",
    tags: vodunTags(T, ["practice: initiation and priesthood", "practice: possession", "practice: drumming and song", "place: porto-novo"], "convent", "vodunsi"),
    civilisations: ["Fon", "Gun", "Hueda", "Ewe"],
    locationName: "Southern Bénin and Togo",
    lat: 6.5,
    lng: 2.4,
    media: [P.kahnConvent, P.kpasseConvent, P.vodunsiAgatogbo],
    claims: [
      {
        sourceKey: "wa_herskovits_dahomey_1938",
        citations: [{ sourceKey: "wa_aupiais_gadmer_1930", relation: "supports", note: "A convent at Adjarra photographed and captioned 19 January 1930." }],
        startYear: 1931,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Ethnographic description of convent seclusion in Abomey",
        originalDateText: "Seclusion of cult initiates described from the 1931 fieldwork",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. Dates a detailed description; earlier European accounts mention initiates and cult houses without describing seclusion in detail. NEEDS SOURCE VERIFICATION for the seclusion lengths reported.",
      },
      undated({
        sourceKey: "wa_practitioner_tradition",
        citations: [{ sourceKey: "wa_blier_1995", relation: "context", note: "Blier on the restricted knowledge of initiates." }],
        text: "As old as the vodun, in the priests' account",
        what: "When the convent institution began",
        chronology: "traditional",
        method: "oral_tradition",
        kind: "primordial",
        evidence: "EVIDENCE TYPE: religious tradition. The tradition places the convent with the founding of each cult; no historical date is available.",
      }),
    ],
  },

  {
    slug: "vodunon-hounon-vodunsi-the-offices-of-service",
    title: "Vodunon, hungan, vodunsi, bokɔnɔ: the offices of service, and their names in Haiti",
    summary:
      "The vodunon owns and keeps a vodun; the hungan is chief of a cult; the vodunsi is its devotee; the bokɔnɔ is the Fa diviner. Haitian Vodou's houngan and hounsi carry two of these Fon words — the strongest linguistic evidence of Gbe origin in Haitian religion.",
    description:
      "THE OFFICES. VODUNON (vodun-no, 'owner/mother of the vodun'): the person, often by lineage inheritance, who keeps a vodun and its house. HUNGAN (hùn-gán, 'chief of the vodun' in Fon usage): the head priest of a cult. VODUNSI ('wife of the vodun'): an initiated devotee, possessed by the power. BOKƆNƆ: a Fa diviner, a separate specialist. HU-NO, DANGBE-NO, LEGBA-NO: priests named for their power. Above them, in the kingdom, Dahomean officials (the 'Agasunon' of Agasu, the royal ministers who supervised cult houses) linked religious office to the court.\n\n" +
      "WOMEN. Most vodunsi have been women, and women held high priestly office — the kpojito Hwanjile as priest of Mawu-Lisa, the Nae of particular cults. The word 'wife' is relational: men, too, are vodunsi.\n\n" +
      "IN HAITI. HOUNGAN (priest), HOUNSI (initiate) and HOUNFÒ (temple; Fon hùn-xɔ, 'vodun-house') are Fon words; Asogwe, the highest Haitian grade, is also Gbe-derived. MANBO (priestess) has a disputed etymology. These are not resemblances but borrowings, preserved in the Rada liturgy and in everyday Haitian Creole religious speech. The Haitian offices themselves — the asson-holding houngan of a Port-au-Prince peristyle — are Haitian institutions.\n\n" +
      "WHAT IS DATED. Burton (1864) uses 'Danh'si', 'Loko-'si' and 'Hu-no', which gives a latest-by date for the suffix system; the 1658 catechism's religious vocabulary is earlier but its terms for priest are NEEDS SOURCE VERIFICATION.\n\n" +
      "SIGNIFICANCE. Offices are what make a religion institutional. That Haiti kept the Fon NAMES for priest, initiate and temple — while losing Fa, the convents' long seclusions and the lineage ownership of vodun — tells precisely which parts of the Gbe system could be rebuilt on a plantation and which could not.",
    category: "religion",
    subcategory: "Initiation and priesthood",
    eventType: "historical",
    tags: vodunTags(T, ["practice: initiation and priesthood", "practice: divination", "place: saint-domingue and haiti", "deity: lwa"], "priesthood", "language", "houngan"),
    people: ["Hwanjile"],
    civilisations: ["Fon", "Hueda", "Haitian Vodou"],
    locationName: "Southern Bénin, and Haiti",
    lat: 6.9,
    lng: 2.1,
    media: [P.fortierAbomey1912, P.kahnSakpata, P.togoPriestess],
    claims: [
      {
        sourceKey: "wa_burton_gelele_1864",
        citations: [{ sourceKey: "wa_herskovits_dahomey_1938", relation: "supports", note: "Herskovits describes the priestly offices of the Abomey cult houses." }],
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Burton's use of the -si and -no office terms",
        originalDateText: "'Danh'si', 'Loko-'si', 'Hu-no' in Burton (1864)",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: contemporary written. A latest-by date for the office vocabulary in writing.",
      },
      {
        sourceKey: "wa_metraux_1959",
        citations: [{ sourceKey: "wa_deren_1953", relation: "supports", note: "Deren records houngan, hounsi and hounfor in 1940s Haiti." }],
        startYear: 1948,
        endYear: 1959,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Ethnographic documentation of the Fon-derived office words in Haitian Vodou",
        originalDateText: "Houngan, hounsi, hounfò in the Haitian ethnographies of the 1940s–50s",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. Dates well-documented use; the words are older in Haiti, and the Haiti track dates them further.",
      },
    ],
  },

  {
    slug: "ancestor-veneration-west-africa-and-the-diaspora",
    title: "Ancestor veneration from the Bight of Benin to the diaspora",
    summary:
      "Gbe asen and tovodun, royal Nesuhwe and Tohossou, Yoruba Egungun, Mama Tchamba; Haitian lemò and Gede; Brazilian Egungun of Itaparica; Cuban eggun. A comparison of how the dead are kept present, and what links the practices.",
    description:
      "THE CASES. (1) GBE: the sib founder (tohwiyo) and the deified dead (tovodun), served through iron asen altars; funerals that must be completed for the dead to join the ancestors (benin-vodun's ancestors and asen records). (2) DAHOMEAN ROYAL: the Nesuhwe and Tohossou cults; the Annual Customs (xwetanu) at which the royal dead were fed. (3) EWE AND MINA: lineage stools, the remembered dead of Notsé, and Mama Tchamba's enslaved 'ancestors'. (4) YORUBA: Egungun masquerades in which the dead return in cloth; entered Bénin through Yoruba communities. (5) HAITI: the family dead (lemò, les morts), the rite of retrieving a dead person's spirit 'from under the water' a year and a day after death (Métraux), and the GEDE, spirits of death and sexuality celebrated at All Saints. (6) BRAZIL: the Egungun cult of the island of Itaparica, Bahia, a Yoruba ancestor cult re-established in the nineteenth century. (7) CUBA: the eggun honoured before the orishas.\n\n" +
      "SIMILARITIES. The dead remain part of the lineage and must be fed, named and remembered; neglected dead cause harm; correct funerals are obligatory; the dead can be called into the present through objects, masquerade or possession.\n\n" +
      "DIFFERENCES. In Africa the ancestors are a LINEAGE's, known by name and generation; slavery broke lineages, so in Haiti the dead are often the family dead of a few generations, while the Gede are a collective family of the dead not tied to one lineage. The royal ancestor cults of Abomey had no American continuation. Masquerade (Egungun) survived in Brazil, not in Haiti. Catholic All Souls and All Saints shaped the Haitian calendar.\n\n" +
      "EVIDENCE FOR TRANSMISSION. STRONG for Egungun in Brazil (named, Yoruba-language cult houses with documented founders). STRONG for the general principle (the dead as present kin) across all the American religions, but it is so widespread in Africa that no single source can be named. CONTESTED for the Gede: some scholars connect the name to the Guédévi, a people of the Abomey plateau conquered by Dahomey; others see the Gede as a Haitian creation. That link is a hypothesis.\n\n" +
      "SIGNIFICANCE. Ancestor veneration is the most widely shared element of all the religions in this expansion and the hardest to trace to one origin. It survived the Atlantic in part because it was everyone's: enslaved Africans of many origins could agree on the dead.",
    category: "religion",
    subcategory: "Comparison",
    eventType: "other",
    eventTypeNote: "A comparison record.",
    tags: vodunTags(
      T,
      ["practice: ancestors", "deity: gede and the dead", "practice: masquerade", "place: saint-domingue and haiti", "place: bahia and brazil", "place: cuba", "place: abomey"],
      "comparison",
      "ancestors",
    ),
    people: ["Gede"],
    civilisations: ["Fon", "Ewe", "Yoruba", "Haitian Vodou", "Candomblé", "Lucumí (Santería)"],
    locationName: "The Bight of Benin, Haiti, Brazil and Cuba",
    lat: 7.18,
    lng: 1.99,
    media: [P.kahnGleleTomb, P.asenTogo, P.egungunCostume, P.gedeLeogane],
    claims: [
      {
        sourceKey: "wa_herskovits_dahomey_1938",
        citations: [
          { sourceKey: "wa_metraux_1959", relation: "supports", note: "Métraux documents the Haitian treatment of the dead and the Gede." },
          { sourceKey: "wa_brown_1991", relation: "supports", note: "Brown documents the family dead and Gede in a Haitian household." },
        ],
        startYear: 1931,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "Detailed ethnography of Fon ancestor cults, the African reference point of the comparison",
        originalDateText: "The sib ancestors described from Abomey fieldwork, 1931",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "EVIDENCE TYPE: later historical account. Dates a detailed record; ancestor cults are attested in European accounts of the coast much earlier (the Dahomean Customs from the 1720s). It does not date the practice.",
      },
      undated({
        sourceKey: "wa_practitioner_tradition",
        citations: [{ sourceKey: "wa_thompson_1983", relation: "context", note: "Thompson's arguments for African continuities in American treatments of the dead." }],
        text: "The dead have always been fed",
        what: "When ancestor veneration began on the Gbe coast",
        chronology: "traditional",
        method: "oral_tradition",
        kind: "primordial",
        evidence: "EVIDENCE TYPE: religious tradition. The tradition places it at the beginning; history cannot date it.",
      }),
    ],
  },

  // =========================================================================
  // THE DERIVATION THEORY
  // =========================================================================
  {
    slug: "egyptian-origin-theory-for-vodun-and-orisha",
    title: "Did Vodun and Orisha religion come from ancient Egypt? The derivation theory and its genealogy",
    summary:
      "From J. Olumide Lucas (1948) through Cheikh Anta Diop's arguments for African cultural unity to today's online claims that 'Vodun is from Kemet', an Egyptian origin has been proposed for West African religion. No document, name, route or archaeological link supports it.",
    description:
      "THE THEORY. That the religions of the Yoruba and of the Gbe peoples descend from ancient Egyptian religion, carried west by migration. Its most-cited scholarly statement is J. OLUMIDE LUCAS's The Religion of the Yorubas (Lagos, 1948), subtitled 'especially in relation to the religion of ancient Egypt', which compares Yoruba and Egyptian words, divine names and rites. It belongs to a wider early twentieth-century pattern in which West African historians traced their peoples to the Nile or the Near East — partly in answer to colonial claims that Africans had no history. CHEIKH ANTA DIOP (Nations nègres et culture, 1954; The African Origin of Civilization, 1974) argued, more broadly, that Egypt was a Black African civilisation and that African cultures form a unity with it. Popular writing since the 1990s extends this to Vodun specifically: Dan as Apep or Wadjet, Legba as an Egyptian god, the pythons of Ouidah as Egyptian serpents.\n\n" +
      "WHAT IS RIGHT ABOUT THE IMPULSE. Egypt is in Africa, and the refusal to treat African religion as without history is correct. Diop's work changed the study of Egypt's African context.\n\n" +
      "WHY THE DERIVATION FAILS AS HISTORY. No Egyptian text mentions the Bight of Benin; no Gbe or Yoruba word has been shown by regular sound correspondence to come from Egyptian; no archaeological horizon links them; the Gbe religious vocabulary has its own distribution and the earliest written vodu (1658) is three thousand years and three thousand kilometres from New Kingdom Egypt. Lucas's method was resemblance of sound and function, which can be found between any two religions. Serpents, thunder, sun and moon, and the dead are near-universal religious themes.\n\n" +
      "THE GENEALOGY. Traced in the claim genealogy below: an early-scholarship proposal (Lucas), a broader civilisational thesis that does not itself document a route for any cult (Diop), popular claims that cite neither, and current scholarship that treats both Yoruba and Gbe religions as historically local.\n\n" +
      "SIGNIFICANCE. The theory is recorded because a reader will meet it, and because the reason it fails — resemblance is not evidence of descent — is the same reason Danbala is not Apep and Haitian Vodou is not 'African religion in exile'. The real history of Vodun, documented from 1658 and remembered further back, needs no borrowed antiquity.",
    category: "religion",
    subcategory: "Alternative interpretations",
    eventType: "alternative",
    eventTypeNote: "An attributed alternative claim, with its proponents, its evidence and its criticisms.",
    tags: vodunTags(T, ["deity: orisha", "deity: dan and aido-hwedo", "place: oyo and yorubaland"], "alternative", "egypt", "derivation theory"),
    people: ["J. Olumide Lucas", "Cheikh Anta Diop"],
    civilisations: ["Yoruba", "Fon", "Ancient Egypt"],
    locationName: "Lagos and Dakar (the theory's proponents); the Bight of Benin (its subject)",
    lat: 6.45,
    lng: 3.39,
    media: [P.diopPortrait, P.oponIfa],
    argumentsFor:
      "Proponents point to resemblances between Yoruba or Gbe words and divine names and Egyptian ones (Lucas), to shared themes — serpents, sun and moon, the judgement of the dead, divine kingship — and to Diop's case that Egypt was culturally African and part of a wider African unity, which makes westward diffusion seem plausible.",
    argumentsAgainst:
      "No Egyptian or classical source mentions the region; no regular sound correspondences link Gbe or Yoruba to Egyptian; no archaeological sequence connects the Nile to the Bight of Benin; the earliest vodun evidence is seventeenth-century and local; and the shared themes are found in religions worldwide, so resemblance cannot distinguish descent from independent invention. Current scholarship (e.g. Olupona on Ifẹ̀) treats these religions as historically West African.",
    genealogies: [
      {
        key: "vodun-from-egypt",
        claim: "Vodun (and Yoruba orisha religion) came from ancient Egypt",
        verdict: "no_primary_evidence_located",
        verdictEvidence:
          "Looked for and not found: no ancient text, archaeological link, documented route or demonstrated linguistic descent. The nearest real things are Lucas's word comparisons (1948), Diop's general thesis of African cultural unity (1954–1974), and modern popular claims that cite neither systematically.",
        whatWouldChangeThis:
          "Regular sound correspondences between Egyptian and Gbe or Yoruba religious vocabulary, accepted by comparative linguists; an archaeological sequence linking the Nile valley to the Bight of Benin with dated intermediate sites; or an ancient text naming the region or its cults.",
        links: [
          {
            stage: "early_scholarship",
            who: "J. Olumide Lucas, The Religion of the Yorubas",
            year: 1948,
            sourceKey: "wa_lucas_1948",
            saysAbsentReason: "The book was not opened in this session; its title and thesis are confirmed by bibliographic records.",
            adds: "The derivation argued systematically for Yoruba religion, from resemblances of words, names and rites.",
            citationStatus: "unverified",
          },
          {
            stage: "alternative_interpretation",
            who: "Cheikh Anta Diop, Nations nègres et culture; The African Origin of Civilization",
            year: 1974,
            sourceKey: "wa_diop_1974",
            saysAbsentReason: "Not opened in this session; its general thesis is well known and summarised, not quoted.",
            adds: "A civilisational frame — Egypt as Black African, African cultures as a unity — that later popular claims about Vodun draw on. It does not document a route for any Gbe cult.",
            citationStatus: "unverified",
          },
          {
            stage: "popular_claim",
            who: "Online and devotional writing asserting that Vodun 'comes from Kemet' and that Dan is Apep or Wadjet",
            saysAbsentReason: "No single citable work; the claim circulates without sources.",
            adds: "Applies the derivation to Vodun specifically, and adds serpent identifications with no documentary basis.",
            citationStatus: "no_citation_given",
          },
          {
            stage: "current_scholarship",
            who: "Jacob K. Olupona, City of 201 Gods",
            year: 2011,
            sourceKey: "wa_olupona_2011",
            saysAbsentReason: "Not opened in this session; cited for its approach, summarised.",
            adds: "Treats Yoruba religion as historically rooted at Ilé-Ifẹ̀ and in West African history, not as a transplant.",
            citationStatus: "unverified",
          },
        ],
      },
    ],
    claims: [
      {
        sourceKey: "wa_lucas_1948",
        citations: [{ sourceKey: "wa_wikipedia", relation: "context", note: "The Wikipedia article on Lucas places him among West African writers who proposed Hamitic origins." }],
        startYear: 1948,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Publication of the classic statement of the Egyptian-derivation theory for Yoruba religion",
        originalDateText: "The Religion of the Yorubas, Lagos 1948",
        datingMethod: "historical_record",
        chronology: "alternative",
        evidence: "EVIDENCE TYPE: modern interpretation. Dates the theory's publication. It is evidence that the theory was proposed, not that it is true.",
      },
      undated({
        sourceKey: "wa_diop_1974",
        citations: [{ sourceKey: "wa_olupona_2011", relation: "disputes", note: "Current scholarship treats orisha religion as historically local to Yorubaland." }],
        text: "An Egyptian origin, at no stated date",
        what: "When, on the theory, Vodun and orisha religion would have left Egypt",
        chronology: "alternative",
        evidence: "EVIDENCE TYPE: modern interpretation. The theory supplies no date or route, so none is entered.",
      }),
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

const A = "vodun-west-africa-what-can-be-recovered";

const links: SeedEventLink[] = [
  // --- Anchor to the other tracks' anchors ---
  { from: A, to: "vodun-kingdoms-religion-and-royal-power", relation: "precedes", note: "The religious landscape recovered here is what the kingdoms of Allada, Hueda and Dahomey later organised, taxed and absorbed." },
  { from: A, to: "vodun-atlantic-what-crossed", relation: "precedes", note: "Only what existed on the coast before and during the trade could cross the Atlantic; this track sets out that baseline." },
  { from: A, to: "haitian-vodou-formation-saint-domingue", relation: "relevant", note: "Haitian Vodou's Rada rite names its African sources Arada and Ouidah, the places described in this track." },
  { from: A, to: "louisiana-voodoo-formation", relation: "relevant", note: "Louisiana Voodoo's word and its serpent spirit come from the Gbe-speaking coast discussed in this track." },
  { from: A, to: "vodun-today-overview", relation: "relevant", note: "Present-day Vodun in Bénin and Togo is the living continuation of the traditions recovered here." },

  // --- Anchor to its own records ---
  { from: "gbe-languages-and-the-vocabulary-of-the-sacred", to: A, relation: "part_of", note: "The Gbe vocabulary is the first evidence for what the coastal religion called its own categories." },
  { from: "hueda-snake-trees-and-sea", to: A, relation: "evidence_for", note: "Bosman's 1705 three orders of snake, trees and sea are the earliest structured description of coastal Vodun." },
  { from: "burton-catalogues-the-dahoman-religion-1864", to: A, relation: "evidence_for", note: "Burton and Ellis give the first named catalogues of the coastal powers, uneven but datable." },
  { from: "the-pantheon-written-down-1911-1943", to: A, relation: "evidence_for", note: "Le Hérissé, Herskovits and Maupoil fixed the Fon pantheon in writing, shaping every later account." },
  { from: "spieth-records-ewe-religion-1906-1911", to: A, relation: "evidence_for", note: "Spieth's Ewe texts are the main early record of western Gbe religion in its own language." },
  { from: "aupiais-gadmer-photograph-the-shrines-1930", to: A, relation: "evidence_for", note: "The 1930 autochromes are the earliest colour visual record of the shrines discussed in this track." },
  { from: "tado-as-a-religious-source", to: A, relation: "part_of", note: "Tado is the remembered point of origin from which Aja and Ewe traditions trace their gods." },
  { from: "egyptian-origin-theory-for-vodun-and-orisha", to: A, relation: "responds_to", viewpoint: "alternative", note: "The Egyptian-origin theory offers an answer to the question of origins that the anchor leaves open." },

  // --- Sources and observers ---
  { from: "hueda-snake-trees-and-sea", to: "burton-catalogues-the-dahoman-religion-1864", relation: "precedes", note: "Bosman's three orders reappear, renamed and multiplied, in Burton's and Ellis's lists." },
  { from: "burton-catalogues-the-dahoman-religion-1864", to: "the-pantheon-written-down-1911-1943", relation: "precedes", note: "The twentieth-century ethnographers corrected and systematised the nineteenth-century catalogues." },
  { from: "spieth-records-ewe-religion-1906-1911", to: "the-pantheon-written-down-1911-1943", relation: "related", note: "Spieth's Ewe material and Le Hérissé's Fon material were written in the same decade, on two halves of one language family." },
  { from: "aupiais-gadmer-photograph-the-shrines-1930", to: "the-pantheon-written-down-1911-1943", relation: "related", note: "Aupiais's photography belongs to the same period of missionary and colonial documentation as the written pantheons." },
  { from: "gbe-languages-and-the-vocabulary-of-the-sacred", to: "spieth-records-ewe-religion-1906-1911", relation: "related", note: "Spieth recorded the Ewe end of the Gbe vocabulary of the sacred directly in the language." },
  { from: "hueda-snake-trees-and-sea", to: "bosman-describes-the-serpent-at-whydah", relation: "related", sourceKey: "wa_bosman_1705", note: "Both records rest on Bosman's 1705 letter; this one takes his whole three-part scheme rather than the serpent alone." },
  { from: "hueda-snake-trees-and-sea", to: "hueda-kingdom-and-savi", relation: "part_of", note: "Bosman described the religion of the Hueda kingdom whose capital was Savi." },
  { from: "hueda-snake-trees-and-sea", to: "savi-excavated", relation: "related", note: "The excavations at Savi give the material setting of the kingdom whose religion Bosman described." },
  { from: "the-pantheon-written-down-1911-1943", to: "not-one-theology", relation: "relevant", note: "The written pantheons gave Fon Vodun a tidier system than practice ever had, which the Bénin record cautions against." },
  { from: "the-pantheon-written-down-1911-1943", to: "vodun-under-colonial-rule", relation: "part_of", note: "The ethnographies were produced inside, and partly for, the French colonial administration." },
  { from: "aupiais-gadmer-photograph-the-shrines-1930", to: "vodun-under-colonial-rule", relation: "part_of", note: "Aupiais photographed under colonial rule as a missionary presenting African religion sympathetically in Paris." },
  { from: A, to: "vodu-first-written-1658", relation: "relevant", note: "The 1658 Doctrina Christiana is the earliest written form of the word vodu and frames what written evidence can show." },
  { from: A, to: "vodun-before-the-documents", relation: "relevant", note: "This track takes up the Bénin record's question of what can be known before the documents." },
  { from: A, to: "how-old-is-vodun", relation: "relevant", note: "The anchor shares the Bénin record's caution about dating Vodun's origins." },
  { from: A, to: "oral-tradition-is-evidence-but-not-a-transcript", relation: "relevant", note: "Most early evidence here is oral tradition, used under the rule this deep-past record sets out." },
  { from: "gbe-languages-and-the-vocabulary-of-the-sacred", to: "oral-knowledge-as-technology", relation: "related", note: "Gbe sacred vocabulary and praise names are part of the oral knowledge system the Bénin record describes." },

  // --- Places ---
  { from: "tado-as-a-religious-source", to: "aja-and-the-tado-tradition", relation: "related", note: "The deep-past record treats Tado as a political origin; this record treats it as a religious one." },
  { from: "tado-as-a-religious-source", to: "allada-sacred-geography", relation: "precedes", note: "Tradition carries the Agasu line and its gods from Tado to Allada." },
  { from: "tado-as-a-religious-source", to: "notse-in-ewe-sacred-memory", relation: "related", note: "Ewe tradition places Notsé after Tado on the migration path, with its own sacred memory." },
  { from: "allada-sacred-geography", to: "three-brothers-tradition-allada-abomey-hogbonu", relation: "related", note: "The three-brothers tradition makes Allada the religious parent of Abomey and Hogbonu." },
  { from: "allada-sacred-geography", to: "allada-in-portuguese-records-1539", relation: "related", note: "Portuguese records give Allada a written history older than the religious traditions told about it." },
  { from: "allada-sacred-geography", to: "arada-people-in-the-americas-1560s", relation: "relevant", note: "Arada, the American name for Allada people, carried Allada's sacred name into the diaspora." },
  { from: "allada-sacred-geography", to: "porto-novo-hogbonu-founded", relation: "related", note: "Hogbonu (Porto-Novo) claimed Allada's religious inheritance through its founding tradition." },
  { from: "kpasse-forest-ouidah", to: "ouidah-one-landscape-many-worlds", relation: "part_of", note: "The Kpassè forest is one of Ouidah's sacred sites, alongside the python temple and the slave route." },
  { from: "kpasse-forest-ouidah", to: "temple-of-pythons-today", relation: "related", note: "The forest and the python temple are Ouidah's two most visited Vodun sites and tell linked stories." },
  { from: "kpasse-forest-ouidah", to: "hueda-kingdom-and-savi", relation: "related", note: "Tradition makes Kpassè a Hueda king who became a tree, tying the grove to the Hueda kingdom." },
  { from: "kpasse-forest-ouidah", to: "sacred-groves-as-surviving-forest", relation: "evidence_for", note: "Kpassè is a small urban example of a grove kept as forest by religious protection." },
  { from: "notse-in-ewe-sacred-memory", to: "spieth-records-ewe-religion-1906-1911", relation: "related", note: "Spieth recorded the Ewe Notsé traditions in the language early in the twentieth century." },
  { from: "glidji-and-the-sacred-stone-of-the-guin", to: "notse-in-ewe-sacred-memory", relation: "related", note: "The Guin of Glidji and the Ewe of Notsé are neighbouring Gbe groups whose sacred memories intersect on the Togo coast." },
  { from: "glidji-and-the-sacred-stone-of-the-guin", to: "vodun-today-overview", relation: "relevant", note: "The annual Epe Ekpe stone ceremony at Glidji is one of the best-attended living Vodun festivals." },
  { from: "hu-the-sea-and-the-hunon-of-ouidah", to: "ouidah-one-landscape-many-worlds", relation: "part_of", note: "The sea priest belongs to Ouidah's landscape of beach, lagoon and town." },

  // --- Creator and supreme god ---
  { from: "nana-buluku-the-elder-creator", to: "mawu-lisa", relation: "precedes", note: "Herskovits's accounts make Nana Buluku the parent of Mawu-Lisa; the Bénin record covers the twins." },
  { from: "supreme-god-question-mawu-and-the-missionaries", to: "mawu-lisa", relation: "responds_to", viewpoint: "disputed", note: "The supremacy debate is about how far Mawu was a high god before missionaries used the name for God." },
  { from: "supreme-god-question-mawu-and-the-missionaries", to: "nana-buluku-the-elder-creator", relation: "related", note: "Nana Buluku complicates any claim that Mawu stood alone at the top of the system." },
  { from: "supreme-god-question-mawu-and-the-missionaries", to: "vodu-first-written-1658", relation: "related", note: "The 1658 catechism is the first case of missionaries translating the Christian God into Gbe terms." },
  { from: "supreme-god-question-mawu-and-the-missionaries", to: "spieth-records-ewe-religion-1906-1911", relation: "related", sourceKey: "wa_spieth_1911", note: "Spieth's Ewe Mawu material, collected by a missionary, is central evidence in the debate." },
  { from: "nana-buluku-the-elder-creator", to: "orisha-and-vodun-shared-names-separate-systems", relation: "related", note: "Nana Buluku, as Nanã in Brazil, is one of the names shared across the Gbe–Yoruba boundary." },

  // --- Serpent ---
  { from: "aido-hwedo-the-rainbow-serpent", to: "dan-the-serpent", relation: "related", note: "Aido-Hwedo is the cosmic form of the serpent; the Bénin record covers Dan as a vodun." },
  { from: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", to: "aido-hwedo-the-rainbow-serpent", relation: "part_of", note: "The comparison draws on the Aido-Hwedo record for the African half." },
  { from: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", to: "dan-the-serpent", relation: "responds_to", note: "The comparison extends the Bénin Dan record across the Atlantic." },
  { from: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", to: "okomilo-python-comparison", relation: "related", note: "Edo palace python imagery is the nearest non-Gbe serpent comparison and supports a regional, not one-way, pattern." },
  { from: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", to: "okomilo-benin-palace-pythons", relation: "related", note: "The Benin City palace pythons show a serpent cult of royal power beside the Gbe one." },
  { from: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", to: "serpent-is-not-one-symbol", relation: "relevant", note: "The serpent-dataset rule that the serpent is not one symbol governs this comparison." },
  { from: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", to: "primordial-serpent-energy-doctrine", relation: "relevant", viewpoint: "alternative", note: "Popular claims that Dan is a universal serpent energy are compared and set aside here." },
  { from: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", to: "jormungandr-kundalini-comparison", relation: "related", note: "Aido-Hwedo coiled round the earth invites the same world-serpent comparison as Jormungandr." },
  { from: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", to: "set-spears-apep", relation: "related", note: "Apep is the Egyptian world-serpent most often compared, wrongly as descent, with Aido-Hwedo." },
  { from: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", to: "vodun-atlantic-what-crossed", relation: "relevant", note: "Danbala in Haiti and Li Grand Zombi in Louisiana are the serpent's best-documented crossings." },
  { from: "dan-aido-hwedo-and-the-cosmic-serpent-comparison", to: "resemblance-is-not-descent", relation: "relevant", note: "The comparison applies the Bénin rule that resemblance does not prove descent." },
  { from: "aido-hwedo-the-rainbow-serpent", to: "temple-of-pythons-1717-tradition", relation: "related", note: "The Ouidah python cult is the living serpent beside the cosmic Aido-Hwedo." },
  { from: "aido-hwedo-the-rainbow-serpent", to: "uraeus-kundalini-comparison", relation: "related", note: "Aido-Hwedo is sometimes placed in modern serpent-energy comparisons alongside the uraeus, which this record does not endorse." },
  { from: "mami-wata-and-the-snake-charmer-print", to: "dan-the-serpent", relation: "related", note: "The snake in the Mami Wata print merged in Gbe practice with Dan and the python." },

  // --- Sea and water ---
  { from: "hu-agbe-and-naete-powers-of-the-sea", to: "hueda-snake-trees-and-sea", relation: "child_of", note: "Agbe and Naeté are the named form of Bosman's third order, the sea." },
  { from: "hu-the-sea-and-the-hunon-of-ouidah", to: "hu-agbe-and-naete-powers-of-the-sea", relation: "part_of", note: "The Hu-no served the sea that Agbe and Naeté personify." },
  { from: "hu-the-sea-and-the-hunon-of-ouidah", to: "burton-catalogues-the-dahoman-religion-1864", relation: "related", sourceKey: "wa_burton_gelele_1864", note: "Burton calls the Hu-no the highest priest of all, the main nineteenth-century witness to the office." },
  { from: "hu-agbe-and-naete-powers-of-the-sea", to: "heviosso-thunder", relation: "related", note: "Agbe and Naeté belong to the Xevioso thunder family covered by the Bénin record." },
  { from: "mami-wata-and-the-snake-charmer-print", to: "hu-agbe-and-naete-powers-of-the-sea", relation: "related", note: "Mami Wata joined the older Gbe sea powers rather than replacing them." },
  { from: "mami-wata-and-the-snake-charmer-print", to: "vodun-today-overview", relation: "relevant", note: "Mami Wata is among the fastest-growing Vodun orders of the present." },

  // --- Trees and forests ---
  { from: "loko-and-the-great-trees", to: "hueda-snake-trees-and-sea", relation: "child_of", note: "Loko is the named form of Bosman's second order, the high trees." },
  { from: "sacred-trees-and-forests-comparison", to: "loko-and-the-great-trees", relation: "part_of", note: "The comparison draws on the Loko record for the African half." },
  { from: "sacred-trees-and-forests-comparison", to: "kpasse-forest-ouidah", relation: "part_of", note: "The Kpassè forest is the comparison's main West African site." },
  { from: "sacred-trees-and-forests-comparison", to: "kv34-sycamore-tree-goddess", relation: "related", note: "The Egyptian tree-goddess is a tree-cult parallel without demonstrated transmission to the Gbe coast." },
  { from: "sacred-trees-and-forests-comparison", to: "nimrud-sacred-tree-relief", relation: "related", note: "The Assyrian sacred tree is an often-cited comparison that shares form but no proven history with Loko." },
  { from: "sacred-trees-and-forests-comparison", to: "vodun-atlantic-what-crossed", relation: "relevant", note: "The mapou in Haiti and the ceiba in Cuba took over Loko's role, the comparison's evidence for transmission." },
  { from: "sacred-trees-and-forests-comparison", to: "resemblance-is-not-descent", relation: "relevant", note: "Tree cults are almost universal, so the Bénin caution against reading resemblance as descent applies with force." },
  { from: "sacred-groves-as-surviving-forest", to: "lac-sele-rainforest-mid-holocene", relation: "responds_to", note: "Groves are remnants of forest that once covered the region before the Dahomey Gap opened." },
  { from: "sacred-groves-as-surviving-forest", to: "dahomey-gap-opens", relation: "responds_to", note: "The Dahomey Gap explains why surviving forest on the coast is rare and religiously protected." },
  { from: "sacred-groves-as-surviving-forest", to: "vodun-today-overview", relation: "relevant", note: "Grove conservation is an active present-day concern linking Vodun and environmental policy." },
  { from: "age-aziza-and-the-power-of-the-bush", to: "loko-and-the-great-trees", relation: "related", note: "Agé and the Aziza live in the bush and the great trees, alongside Loko." },
  { from: "age-aziza-and-the-power-of-the-bush", to: "legba", relation: "related", note: "Fon tradition links the Aziza, givers of medicine, with the knowledge that passes through Legba." },
  { from: "age-aziza-and-the-power-of-the-bush", to: "sakpata", relation: "related", note: "Agé, the hunter's power of the bush, is placed by Herskovits in the earth family of Sakpata." },

  // --- Royal and imported powers ---
  { from: "zomadonu-and-the-royal-tohossou", to: "toxosu-and-twins", relation: "related", note: "The Bénin record treats the toxosu with twins; this record takes Zomadonu and the royal line." },
  { from: "zomadonu-and-the-royal-tohossou", to: "vodun-kingdoms-religion-and-royal-power", relation: "part_of", note: "The royal tohossou are a royal cult and belong to the kingdoms track's story of power." },
  { from: "zomadonu-and-the-royal-tohossou", to: "annual-customs-xwetanu", relation: "related", note: "The annual customs honoured the royal dead whose abnormal kin the tohossou were." },
  { from: "zomadonu-and-the-royal-tohossou", to: "conquest-absorbs-cults", relation: "related", note: "The tohossou are royal cults built up beside the cults Dahomey absorbed from conquered peoples." },
  { from: "gorovodu-the-kola-gods-from-the-north", to: "mama-tchamba-spirits-of-the-bought-people", relation: "related", note: "Both orders brought northern, non-Gbe spirits into Ewe Vodun, and are often kept together." },
  { from: "mama-tchamba-spirits-of-the-bought-people", to: "vodun-atlantic-what-crossed", relation: "relevant", note: "Tchamba remembers the slaves bought into Ewe households, the inland side of the trade." },
  { from: "gorovodu-the-kola-gods-from-the-north", to: "vodun-under-colonial-rule", relation: "part_of", note: "Gorovodu spread along colonial-era labour and trade routes from the north." },
  { from: "yewe-the-thunder-order-of-the-anlo", to: "heviosso-thunder", relation: "related", note: "Yewe is the Anlo Ewe order of the thunder god the Bénin record treats as Heviosso." },
  { from: "yewe-the-thunder-order-of-the-anlo", to: "hunkpame-the-vodun-convent", relation: "related", note: "Yewe initiates go through seclusion in a convent of the kind this track describes." },

  // --- Divination ---
  { from: "when-fa-reached-abomey", to: "fa-divination", relation: "related", note: "The Bénin record covers Fa itself; this record weighs the disputed timing of its arrival at court." },
  { from: "when-fa-reached-abomey", to: "dahomey-tributary-to-oyo", relation: "related", note: "Fa reached Abomey in the period of Yoruba-Oyo influence, which some accounts give as the channel." },
  { from: "when-fa-reached-abomey", to: "burton-catalogues-the-dahoman-religion-1864", relation: "related", sourceKey: "wa_burton_gelele_1864", note: "Burton recorded in 1864 that Afa was said to come from Ife." },
  { from: "divination-fa-ifa-afa-comparison", to: "fa-divination", relation: "part_of", note: "The comparison draws on the Bénin Fa record for the Fon half." },
  { from: "divination-fa-ifa-afa-comparison", to: "fa-as-an-information-system", relation: "related", note: "Treating Fa as a binary information system is the shared ground of Fa, Ifá and Afa." },
  { from: "divination-fa-ifa-afa-comparison", to: "when-fa-reached-abomey", relation: "related", note: "The dates of Fa's arrival are part of the evidence for transmission from Ifá." },
  { from: "divination-fa-ifa-afa-comparison", to: "vodun-atlantic-what-crossed", relation: "relevant", note: "Ifá crossed to Cuba and Brazil as an institution; Fa left few traces in Haiti, a contrast the comparison explains." },
  { from: "divination-fa-ifa-afa-comparison", to: "orisha-and-vodun-shared-names-separate-systems", relation: "related", note: "Divination is the clearest case of a system shared across the Gbe–Yoruba boundary." },

  // --- Vodun and Orisha ---
  { from: "orisha-and-vodun-shared-names-separate-systems", to: "legba-and-papa-legba", relation: "related", note: "Legba and Eshu are the most quoted pair in the Vodun–Orisha comparison." },
  { from: "orisha-and-vodun-shared-names-separate-systems", to: "gu-iron-and-war", relation: "related", note: "Gu and Ogun form the clearest iron-god pair across the Gbe–Yoruba boundary." },
  { from: "orisha-and-vodun-shared-names-separate-systems", to: "egungun-in-benin", relation: "related", note: "Egungun is a Yoruba institution present in Bénin, an example of transfer across the boundary." },
  { from: "orisha-and-vodun-shared-names-separate-systems", to: "okomilo-benin-osanobua-olokun-ogun", relation: "related", note: "Edo gods give a third comparison beside Yoruba and Gbe, showing a region rather than a single source." },
  { from: "orisha-and-vodun-shared-names-separate-systems", to: "vodun-atlantic-what-crossed", relation: "relevant", note: "In Brazil and Cuba, Vodun and Orisha met again and partly merged in the Jeje and Arará nations." },
  { from: "orisha-and-vodun-shared-names-separate-systems", to: "vodun-is-not-voodoo", relation: "relevant", note: "Clear names for separate systems matter to the Bénin point that Vodun is not Voodoo." },

  // --- Priesthood, initiation, convents ---
  { from: "hunkpame-the-vodun-convent", to: "initiation-and-restricted-knowledge", relation: "related", note: "The convent is where the restricted knowledge described by the Bénin record is passed on." },
  { from: "hunkpame-the-vodun-convent", to: "possession-and-trance", relation: "related", note: "Convent initiation trains the novice to receive the vodun in possession." },
  { from: "vodunon-hounon-vodunsi-the-offices-of-service", to: "hunkpame-the-vodun-convent", relation: "related", note: "The vodunsi are made in the convent; the vodunon and hounon run it." },
  { from: "vodunon-hounon-vodunsi-the-offices-of-service", to: "kpojito-and-the-palace-women", relation: "related", note: "Royal women such as the kpojito held priestly power that overlapped with these offices." },
  { from: "vodunon-hounon-vodunsi-the-offices-of-service", to: "haitian-vodou-formation-saint-domingue", relation: "relevant", note: "Haitian houngan, hounsi and ason echo the Gbe titles of service." },
  { from: "vodunon-hounon-vodunsi-the-offices-of-service", to: "hu-the-sea-and-the-hunon-of-ouidah", relation: "related", note: "The Hu-no is the senior example of a hounon, a priest named for his god." },
  { from: "vodunon-hounon-vodunsi-the-offices-of-service", to: "okomilo-okhe-title-institution", relation: "related", note: "Edo titled cult offices provide a regional comparison for Gbe priestly titles." },
  { from: "hunkpame-the-vodun-convent", to: "the-pantheon-written-down-1911-1943", relation: "related", sourceKey: "wa_herskovits_dahomey_1938", note: "Herskovits gave the first detailed account of convent seclusion, though its lengths need checking." },

  // --- Ancestors ---
  { from: "ancestor-veneration-west-africa-and-the-diaspora", to: "ancestors-in-vodun", relation: "responds_to", note: "The comparison extends the Bénin ancestors record across the Atlantic." },
  { from: "ancestor-veneration-west-africa-and-the-diaspora", to: "asen-memory-in-iron", relation: "related", note: "The asen altar is the West African object the comparison sets against diaspora practice." },
  { from: "ancestor-veneration-west-africa-and-the-diaspora", to: "egungun-in-benin", relation: "related", note: "Egungun masks are the ancestors' public return in Bénin." },
  { from: "ancestor-veneration-west-africa-and-the-diaspora", to: "haitian-vodou-formation-saint-domingue", relation: "relevant", note: "The Gede and the lineage dead in Haiti are the comparison's main diaspora case." },
  { from: "ancestor-veneration-west-africa-and-the-diaspora", to: "zomadonu-and-the-royal-tohossou", relation: "related", note: "The royal tohossou are a special class of the dead kept by the Dahomean royal line." },
  { from: "ancestor-veneration-west-africa-and-the-diaspora", to: "adandozan", relation: "related", note: "Adandozan's erasure from the royal ancestor cult shows the dead could be politically removed." },

  // --- Derivation theory ---
  { from: "egyptian-origin-theory-for-vodun-and-orisha", to: "set-the-egyptian-satan-claim", relation: "related", viewpoint: "alternative", note: "Both records examine popular claims tying a later religion to an Egyptian source." },
  { from: "egyptian-origin-theory-for-vodun-and-orisha", to: "resemblance-is-not-descent", relation: "relevant", note: "The Egypt theory rests on resemblances, which the Bénin record says are not proof of descent." },
  { from: "egyptian-origin-theory-for-vodun-and-orisha", to: "orisha-and-vodun-shared-names-separate-systems", relation: "related", viewpoint: "alternative", note: "Lucas made the Yoruba case for Egypt; the theory reaches Vodun through the Orisha comparison." },
  { from: "egyptian-origin-theory-for-vodun-and-orisha", to: "how-old-is-vodun", relation: "responds_to", viewpoint: "alternative", note: "The theory answers the age question with a far deeper origin than evidence supports." },
];

export const AFRICAN_ORIGINS: VodunSection = { track: T, sources, events, links };
