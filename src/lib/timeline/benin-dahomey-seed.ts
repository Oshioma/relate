// DAHOMEY: THE KINGDOM, ITS RULERS, ITS ARMY AND ITS MEMORY.
//
// WHAT THIS DATASET IS FOR. To hold, at once, three things that are usually
// told separately and badly: a state with an unusually well-documented political
// history; an army and a court that turned conquest into captives and captives
// into revenue; and a system of royal art and symbol that is itself a way of
// storing history. The third is why so much survives. The second is why so much
// of it is in Paris.
//
// THE RULES THIS FILE IS WRITTEN UNDER.
//
//   1. NO REIGN HAS ONE DATE. Dahomey's chronology before the nineteenth
//      century is reconstructed from king lists and tradition, checked against
//      European records where those exist. Where accounts differ, both dates
//      are entered. Where a reign is a range in every source, it stays a range.
//
//   2. THE ORAL FOUNDATION TRADITIONS ARE RECORDED AS TRADITIONS. "In Dan's
//      belly" is a story about the name of the kingdom that also justifies the
//      dynasty's possession of the plateau. It is here in full, and it is not
//      presented as an account of what happened.
//
//   3. THE VIOLENCE IS NOT SOFTENED AND IT IS NOT INFLATED. Dahomey made war,
//      took captives, sold people across the Atlantic, and killed people in its
//      royal ceremonies. All of that is in this dataset. So is the distinction
//      between an eyewitness count, a second-hand report, a diplomatic
//      allegation and a colonial justification — because collapsing those four
//      is how a documented practice becomes a propaganda number, and how a
//      propaganda number becomes a reason for a conquest.
//
//   4. THE AGOJIE ARE NOT A COSTUME. They were a standing corps of women
//      soldiers in a slave-raiding monarchy. Both halves of that sentence are
//      true, and a dataset that drops either one is not telling the history.
//
//   5. THE RELIGIOUS BELIEFS ARE RECORDED AS BELIEFS. Where traditions hold
//      that a king was identified with his animal — could be it, act as it,
//      appear as it — this file records DOCUMENTED ROYAL AND RELIGIOUS BELIEF.
//      It does not write that a king turned into a buffalo, and it does not
//      delete the tradition because he did not.
//
// ON SOURCES. Nothing here was fetched: the network policy in the environment
// this file was written in refused every journal, museum and archive. Sources
// are therefore named so they can be found — Forbes 1851, Burton 1864, Dalzel
// 1793, Bay, Law, Monroe, Alpern — and any figure taken from a summary rather
// than from the work itself is marked NEEDS SOURCE VERIFICATION. The dataset
// would rather point accurately at a book it has not read than quote one it has
// not opened.
//
// ON PICTURES. The nineteenth-century European images here are EVIDENCE ABOUT
// EUROPEANS AS MUCH AS ABOUT DAHOMEY, and their captions say so. An engraving is
// never labelled as a photograph. A poster advertising a troupe of "Amazons" in
// a German city in 1891 is evidence about European exhibition culture, and it
// is in the dataset with that written on it.

import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

export const BENIN_DAHOMEY_ANCHOR_SLUG = "dahomey-foundation-question";

export const BENIN_DAHOMEY_TRACK: SeedTrack = {
  name: "Dahomey: rulers, Abomey, the Agojie and the wars",
  slug: "benin-dahomey",
  kind: "region",
  color: "#b23b3b",
};

const commons = (file: string, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
const commonsPage = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;

export const BENIN_DAHOMEY_SOURCES: SeedSource[] = [
  {
    key: "forbes_dahomey_1851",
    title: "Dahomey and the Dahomans: being the journals of two missions to the King of Dahomey",
    author: "Frederick Edwyn Forbes",
    publisher: "Longman, Brown, Green and Longmans",
    reference: "Two volumes, illustrated",
    sourceType: "primary",
    publishedYear: 1851,
    publishedDisplay: "1851",
    notes:
      "A ROYAL NAVY OFFICER'S JOURNAL OF TWO MISSIONS TO GHEZO IN 1849 AND 1850, and one of the most " +
      "important eyewitness sources in this dataset. Forbes was there on anti-slave-trade business: he was " +
      "trying to persuade Ghezo to end the export of captives, and he failed. THAT IS HIS VIEWPOINT AND IT " +
      "IS NOT NEUTRAL — he is describing a kingdom he has come to change, for a readership he needs to " +
      "convince. He is also an actual witness who counted things, and his plates are among the earliest " +
      "images of the Agojie and of Ghezo drawn from life. Cited throughout for what Forbes REPORTED.",
  },
  {
    key: "burton_mission_gelele_1864",
    title: "A Mission to Gelele, King of Dahome",
    author: "Richard Francis Burton",
    reference: "Two volumes; from the British mission of 1863–64",
    sourceType: "primary",
    publishedYear: 1864,
    publishedDisplay: "1864",
    notes:
      "BURTON WENT TO ABOMEY FOR THE BRITISH GOVERNMENT IN 1863–64 AND WROTE THE MOST QUOTED AND LEAST " +
      "TRUSTWORTHY BOOK ABOUT IT. He attended the Customs, described the Agojie, and put numbers on things. " +
      "His racial opinions are extreme even by the standards of his own time and they shape what he sees. " +
      "HIS EVIDENTIAL VALUE IS DOUBLE-EDGED: he sometimes DEFLATES the sacrifice figures circulating in " +
      "Britain, which cuts against the propaganda use of his material and is a reason to take his " +
      "eyewitness counts seriously — and he is also performing contempt for his readers throughout. Always " +
      "cited as 'Burton reported', never as 'it happened'.",
  },
  {
    key: "dalzel_history_of_dahomy_1793",
    title: "The History of Dahomy, an Inland Kingdom of Africa",
    author: "Archibald Dalzel",
    sourceType: "primary",
    publishedYear: 1793,
    publishedDisplay: "1793",
    notes:
      "DALZEL WAS A SLAVE TRADER AND LATER GOVERNOR OF CAPE COAST CASTLE, AND HE WROTE THIS BOOK WHILE THE " +
      "ABOLITION DEBATE WAS RUNNING IN BRITAIN. Its account of Dahomean violence is doing political work: " +
      "a kingdom that kills its captives at home makes the trade that removes them look merciful. That " +
      "argument is explicitly present in the abolition literature of the period. THE BOOK IS STILL A MAJOR " +
      "SOURCE — it preserves eighteenth-century information, including material from Norris and from " +
      "traders — but no figure in it can be read as a neutral observation, and the engravings published " +
      "with it circulate to this day as though they were reportage.",
  },
  {
    key: "norris_bossa_ahadee_1789",
    title: "Memoirs of the Reign of Bossa Ahádee, King of Dahomy",
    author: "Robert Norris",
    sourceType: "primary",
    publishedYear: 1789,
    publishedDisplay: "1789",
    notes:
      "A SLAVE TRADER'S ACCOUNT, based on a visit to Abomey in 1772 and on trading experience on the coast. " +
      "Cited for the 1772 eyewitness material on royal ceremonial, and carrying the same problem as Dalzel: " +
      "Norris gave evidence to Parliament against abolition, and his descriptions of Dahomey were part of " +
      "that case.",
  },
  {
    key: "snelgrave_new_account_1734",
    title: "A New Account of Some Parts of Guinea and the Slave Trade",
    author: "William Snelgrave",
    sourceType: "primary",
    publishedYear: 1734,
    publishedDisplay: "1734",
    notes:
      "A slaving captain's account, including the conquests of Allada and Hueda by Agaja, which Snelgrave " +
      "was close to in time and place. The earliest substantial European narrative of Dahomey's expansion " +
      "to the coast, and — again — written by a man whose business was buying the people that expansion " +
      "produced.",
  },
  {
    key: "bay_wives_of_the_leopard",
    title: "Wives of the Leopard: Gender, Politics, and Culture in the Kingdom of Dahomey",
    author: "Edna G. Bay",
    publisher: "University of Virginia Press",
    sourceType: "academic_book",
    publishedYear: 1998,
    notes:
      "THE STANDARD SCHOLARLY WORK ON WOMEN, THE PALACE AND POLITICAL POWER IN DAHOMEY. Cited for the " +
      "kpojito, for the organisation of the palace, for the Agojie's place within it, for the treatment of " +
      "Hangbe in the royal tradition, and for the observation that the shared origin story of the names " +
      "Dahomey, Danxome and Danhome may be a false etymology. NEEDS SOURCE VERIFICATION for specific pages " +
      "throughout: the book could not be consulted directly from here.",
  },
  {
    key: "bay_asen_ancestors_vodun",
    title: "Asen, Ancestors, and Vodun: Tracing Change in African Art",
    author: "Edna G. Bay",
    publisher: "University of Illinois Press",
    sourceType: "academic_book",
    notes:
      "Cited for asen — the iron memorial altars — as a tradition with a history rather than a timeless " +
      "custom: their Yoruba-related roots, their adoption and transformation by the Dahomean court, the " +
      "Hountondji smiths' role, and their decline in the face of Christianity and photography.",
  },
  {
    key: "law_history_and_legitimacy",
    title: "History and Legitimacy: Aspects of the Use of the Past in Precolonial Dahomey",
    author: "Robin Law",
    workTitle: "History in Africa",
    url: "https://www.cambridge.org/core/journals/history-in-africa/article/abs/history-and-legitimacy-aspects-of-the-use-of-the-past-in-precolonial-dahomey/E3290D7AAF7CD89D9ACEC97E970CD8E1",
    sourceType: "academic_paper",
    notes:
      "THE KEY SOURCE FOR THE IDEA THAT RUNS THROUGH THIS WHOLE DATASET: that Dahomey's official history " +
      "was actively managed by the court, and that what the royal tradition preserved was shaped by what " +
      "the reigning dynasty needed the past to say. Cited on the foundation traditions, on the treatment of " +
      "Adandozan, and on why a royal tradition is evidence about the court that maintained it.",
  },
  {
    key: "law_rise_of_dahomey_jah",
    title: "Dahomey and the Slave Trade: Reflections on the Historiography of the Rise of Dahomey",
    author: "Robin Law",
    workTitle: "The Journal of African History",
    url: "https://www.cambridge.org/core/journals/journal-of-african-history/article/abs/dahomey-and-the-slave-trade-reflections-on-the-historiography-of-the-rise-of-dahomey/A293827948246D98B83BBAA5828E740F",
    sourceType: "academic_paper",
    notes:
      "Cited for the critique of I. A. Akinjogbin's argument that Dahomey expanded to the coast in order to " +
      "END the slave trade, and for the documentary framework of the kingdom's rise.",
  },
  {
    key: "akinjogbin_dahomey_neighbours",
    title: "Dahomey and Its Neighbours 1708–1818",
    author: "I. A. Akinjogbin",
    publisher: "Cambridge University Press",
    sourceType: "academic_book",
    publishedYear: 1967,
    notes:
      "A LANDMARK BOOK WHOSE CENTRAL THESIS IS NOW LARGELY REJECTED. Akinjogbin argued that Agaja moved to " +
      "the coast to suppress the slave trade rather than to profit from it. It is cited here as one side of " +
      "a historiographical dispute, not as a settled account — and it matters because a great deal of " +
      "popular writing still repeats it without knowing that it is contested.",
  },
  {
    key: "alpern_amazons_black_sparta",
    title: "Amazons of Black Sparta: The Women Warriors of Dahomey",
    author: "Stanley B. Alpern",
    publisher: "New York University Press",
    sourceType: "academic_book",
    publishedYear: 1998,
    notes:
      "THE FULLEST SINGLE STUDY OF THE AGOJIE, assembled largely from European eyewitness accounts because " +
      "that is where most of the surviving description is. Cited for the corps's organisation, recruitment, " +
      "weapons and numbers, and for the history of the origin traditions. NEEDS SOURCE VERIFICATION for " +
      "specific figures, which are reported here at second hand.",
  },
  {
    key: "monroe_precolonial_state",
    title: "The Precolonial State in West Africa: Building Power in Dahomey",
    author: "J. Cameron Monroe",
    publisher: "Cambridge University Press",
    sourceType: "academic_book",
    notes:
      "Archaeology of palaces, settlement and landscape on the Abomey plateau. Cited for the physical " +
      "development of royal power, for palace architecture as a means of controlling access, and for the " +
      "argument that Dahomey's Allada descent is a later construction.",
  },
  {
    key: "unesco_abomey_whc",
    title: "Royal Palaces of Abomey",
    publisher: "UNESCO World Heritage Centre",
    url: "https://whc.unesco.org/en/list/323/",
    sourceType: "government",
    notes:
      "The World Heritage file: inscription in 1985, simultaneous listing as World Heritage in Danger after " +
      "the tornado of 1984, and removal from the Danger List in 2007. Cited for the heritage history of the " +
      "site, which is a separate history from that of the kingdom.",
  },
  {
    key: "quai_branly_restitution",
    title: "Restitution of 26 works to the Republic of Benin",
    publisher: "Musée du quai Branly – Jacques Chirac",
    url: "https://m.quaibranly.fr/en/collections/living-collections/news/restitution-of-26-works-to-the-republic-of-benin",
    sourceType: "museum",
    notes:
      "The holding museum's own account of the twenty-six objects taken from Abomey in 1892 and returned in " +
      "2021. Cited for the objects, their provenance and the legal process — and read as an institution " +
      "describing its own conduct, which is a viewpoint and not a neutral record.",
  },
  {
    key: "louvre_gou_sculpture",
    title: "Sculpture dédiée à Gou, attributed to Akati Ekplékendo",
    publisher: "Musée du quai Branly – Jacques Chirac, Pavillon des Sessions, Musée du Louvre",
    reference: "Inventory number 71.1894.32.1",
    sourceType: "museum",
    notes:
      "Cited for the iron figure of Gou: its attribution to the smith Akati Ekplékendo, its date of around " +
      "1858, its seizure by French forces and its museum history. NEEDS SOURCE VERIFICATION for the " +
      "circumstances of its removal, where accounts differ on the date and the place it was taken from.",
  },
  {
    key: "servicehistorique_dahomey",
    title: "The conquest of Dahomey (1890–1894)",
    publisher: "Service historique de la Défense",
    url: "https://www.servicehistorique.sga.defense.gouv.fr/en/thematic-topics/conquest-dahomey-1890-1894",
    sourceType: "government",
    notes:
      "THE FRENCH ARMY'S OWN ARCHIVE ON THE CAMPAIGN IT FOUGHT. An outstanding source for dates, units, " +
      "orders and casualties on the French side, and a source with an obvious position on why the campaign " +
      "happened and what it achieved. Cited as French military testimony, labelled as such.",
  },
  {
    key: "dahomean_royal_tradition",
    title: "Dahomean royal tradition, as maintained at Abomey and recorded by later collectors",
    reference: "King lists, praise names, emblems and reign traditions transmitted at the court and by royal lineages",
    sourceType: "oral_tradition",
    notes:
      "WHAT THIS SOURCE ENTRY IS. The official memory of the dynasty — the king list, the emblems, the " +
      "praise names, the sequence of reigns — as maintained at Abomey and written down by outsiders and by " +
      "Beninese scholars from the nineteenth century onwards. IT IS A REAL AND RICH SOURCE AND IT IS NOT " +
      "DISINTERESTED: it was curated by a court, for a court, and what it omits — Hangbe's kingship, " +
      "Adandozan's reign — is as informative as what it keeps.",
  },
  {
    key: "wikipedia_dahomey_navigation",
    title: "Wikipedia articles on Dahomey, its kings, the Dahomey Amazons and the Franco-Dahomean wars",
    url: "https://en.wikipedia.org/wiki/Kingdom_of_Dahomey",
    sourceType: "wikipedia",
    notes:
      "USED FOR NAVIGATION AND FOR CROSS-CHECKING REIGN DATES ONLY. Where a record below rests on nothing " +
      "stronger, its notes say so. The reign dates in this dataset should eventually be replaced by dates " +
      "cited to Law, Bay or Akinjogbin with their reasoning attached.",
  },
];

export const BENIN_DAHOMEY_EVENTS: SeedEvent[] = [
  // -------------------------------------------------------------------------
  // FOUNDATION, AND THE STORIES TOLD ABOUT IT
  // -------------------------------------------------------------------------
  {
    slug: "dahomey-foundation-question",
    title: "When was Dahomey actually founded?",
    summary:
      "The kingdom's own tradition gives a founder, a place and a sequence of kings. It does not give a year, and the years in circulation are reconstructions. This record holds the competing answers.",
    description:
      "WHAT KIND OF RECORD IS THIS? The anchor of this dataset, and a debate rather than an answer.\n\n" +
      "WHAT IS NOT IN DISPUTE. That by the early eighteenth century a kingdom centred on Abomey, on the " +
      "plateau above the coastal plain, was powerful enough to conquer Allada and Hueda and reach the sea. " +
      "From that point Dahomey is documented by Europeans continuously.\n\n" +
      "WHAT IS IN DISPUTE. Everything before it. The dynasty's own tradition names Do-Aklin, Dakodonou and " +
      "Houegbadja as the first rulers of the line at Abomey, and modern lists give them dates — commonly " +
      "the early seventeenth century for Dakodonou and roughly 1645–1685 for Houegbadja. THOSE DATES ARE " +
      "RECONSTRUCTIONS, made by counting back from the first securely dated reign using the king list.\n\n" +
      "THREE DIFFERENT QUESTIONS GET MERGED INTO ONE. When did the ruling lineage arrive on the plateau? " +
      "When did it become a kingdom rather than one chiefdom among several? When did it start calling " +
      "itself Dahomey? A single founding date implies these happened together, and there is no reason to " +
      "think they did.\n\n" +
      "WHAT THE ARCHAEOLOGY ADDS. That the plateau was not empty: it had carried a large iron-producing " +
      "settlement centuries earlier, and the Gedevi communities the tradition describes the newcomers " +
      "dealing with were there before them. Dahomey was founded ON somebody, which is the part the " +
      "foundation story is arranged to explain.\n\n" +
      "THINGS TO ASK: What would count as the founding of a kingdom? Would the people living through it " +
      "have agreed on a date?",
    category: "history",
    subcategory: "Debate",
    eventType: "disputed",
    tags: ["debate", "dahomey", "kingdoms", "chronology", "abomey", "oral-knowledge", "method"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "dahomean_royal_tradition",
        startYear: 1600,
        endYear: 1625,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The establishment of the ruling line at Abomey",
        originalDateText: "The early seventeenth century, in the reign traditionally assigned to Dakodonou",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence:
          "WHAT THIS DATE RESTS ON: back-counting through the king list from reigns that ARE documented. " +
          "The method is standard and its weakness is compounding: every uncertain reign length above the " +
          "anchor point shifts everything below it.",
      },
      {
        sourceKey: "wikipedia_dahomey_navigation",
        startYear: 1645,
        endYear: 1685,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The consolidation of the kingdom under Houegbadja",
        originalDateText: "c. 1645 – c. 1685, the reign commonly credited with founding the kingdom proper",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence:
          "WHY A SECOND DATE RATHER THAN A CORRECTION OF THE FIRST: because they answer different " +
          "questions. Houegbadja is the ruler credited with the palace, the institutions and the dynastic " +
          "rule that the later kingdom recognised as its own beginning. 'When the lineage arrived' and " +
          "'when the kingdom began' are two events and deserve two claims.",
      },
      {
        sourceKey: "law_rise_of_dahomey_jah",
        startYear: 1724,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "When Dahomey becomes a documented power in the European record",
        originalDateText: "1724, the conquest of Allada, after which Dahomey is continuously documented",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "THE ONLY DATE ON THIS RECORD THAT RESTS ON CONTEMPORARY DOCUMENTS. It is not a foundation date " +
          "and is not offered as one: it is the point at which outsiders begin writing about the kingdom " +
          "continuously, which is a fact about the sources rather than about the state.",
      },
    ],
    media: [
      {
        url: commons("Map of Kingdom of Dahomey.jpg"),
        sourcePageUrl: commonsPage("Map of Kingdom of Dahomey.jpg"),
        fileName: "Map of Kingdom of Dahomey.jpg",
        caption:
          "A map of the Kingdom of Dahomey. Maps of African states drawn by and for Europeans show firm borders where authority was in fact graded and negotiated, and they show the extent of a kingdom at one moment as though it were permanent — worth remembering before reading any line on this one as a frontier.",
        kind: "image",
        shows: "map",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for the map's date, maker and publication, which determine what it is " +
          "evidence of. Until those are known it should be read as a depiction rather than as a document.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "dans-belly-foundation-story",
    title: "\"In Dan's belly\": the story behind the name",
    summary:
      "Tradition explains the name Danxome from a chief called Dan who asked sarcastically whether he should open his belly for the newcomers — and had a palace built on it. It is a foundation tradition, not an established etymology.",
    description:
      "THE STORY AS IT IS TOLD. The newcomers on the Abomey plateau ask a Gedevi chief named Dan for more " +
      "land. Dan answers sarcastically: should he open up his belly and let them build in it? He is then " +
      "killed, and a palace is built over his body — DAN-XO-ME, in Dan's belly — and that is where the " +
      "kingdom's name comes from. The king to whom the story is usually attached is Dakodonou.\n\n" +
      "WHAT THE STORY IS DOING. Three things at once, which is why it lasts. It explains a name. It " +
      "explains how the dynasty came to possess land it did not originally hold — by a killing that the " +
      "victim's own insolence is made to justify. And it makes the kingdom's foundation an act of violence " +
      "against a named predecessor, which is a striking thing for a royal tradition to keep rather than " +
      "hide.\n\n" +
      "WHY SCHOLARS ARE CAUTIOUS. Edna Bay has observed that the shared origin story behind the forms " +
      "Dahomey, Danxome and Danhome may be a FALSE ETYMOLOGY — a story generated to explain a name whose " +
      "real derivation is something else. Stories that explain names are one of the commonest kinds of " +
      "folk etymology anywhere in the world, and a name that sounds like a phrase will reliably attract " +
      "one.\n\n" +
      "THE OTHER DAN. In Vodun, DAN is a serpent power. The coincidence of the names is noticeable and it " +
      "is NOT treated here as a connection: the serpent vodun Dan and a Gedevi chief called Dan share a " +
      "syllable, and similar names are not evidence. If a source establishes a relationship it belongs " +
      "here; none is entered.\n\n" +
      "WHAT THIS RECORD IS. An ORAL FOUNDATION TRADITION and a CONTESTED HISTORICAL CLAIM, recorded in " +
      "full because it is one of the best-known things about this kingdom, and recorded as a tradition " +
      "because that is what it is.\n\n" +
      "THINGS TO ASK: Why would a dynasty keep a story in which its founder murders his host? What does " +
      "the story make legitimate?",
    category: "history",
    subcategory: "Foundation tradition",
    eventType: "traditional_account",
    identificationStatus: "disputed",
    tags: ["oral-knowledge", "dahomey", "etymology", "foundation", "tradition", "legitimacy", "abomey", "debate"],
    people: ["Dakodonou", "Dan"],
    civilisations: ["Dahomey", "Gedevi"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "dahomean_royal_tradition",
        startYear: 1620,
        endYear: 1645,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The killing of Dan and the building of the palace, as tradition places it",
        originalDateText: "In the reign traditionally assigned to Dakodonou, commonly given as c. 1620–1645",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHAT THIS DATE RESTS ON: attachment of the story to a reign, and reconstruction of that reign " +
          "from the king list. BOTH STEPS ARE TRADITIONAL. Nothing contemporary records the event and " +
          "nothing archaeological is offered for it.",
      },
      {
        sourceKey: "bay_wives_of_the_leopard",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether 'in Dan's belly' is the real derivation of the kingdom's name",
        originalDateText: "Disputed. Bay notes the shared origin story may be a false etymology",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "FOR THE STORY: it is old, widely told, and internally consistent with the Fon language. AGAINST " +
          "IT: folk etymologies of exactly this shape are generated constantly for place names, and a story " +
          "that also justifies a land seizure has a motive for existing beyond explaining a word. WHAT " +
          "WOULD SETTLE IT: linguistic work on the name's attested early forms, and evidence of the story " +
          "before the eighteenth century. Neither is entered here.",
        notes:
          "NEEDS SOURCE VERIFICATION for the EARLIEST WRITTEN VERSION of this story, which is the single " +
          "most useful missing fact about it. If it first appears in a nineteenth-century European book, " +
          "that matters; if it is attested in the eighteenth century, that matters more.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE KINGS
  // -------------------------------------------------------------------------
  {
    slug: "gangnihessou",
    title: "Gangnihessou, first in the list",
    summary:
      "The king list opens with Gangnihessou, whose emblem is a bird. Almost nothing about him is documented, and his place in the list has been questioned.",
    description:
      "WHAT THE TRADITION SAYS. Gangnihessou stands first in the Dahomean king list, associated with the " +
      "period before the dynasty settled at Abomey, and remembered with a bird emblem. In the sequence of " +
      "royal symbols painted and carved at Abomey he has his place like the rest.\n\n" +
      "WHAT IS DOCUMENTED. Essentially nothing outside the tradition itself. There is no contemporary " +
      "record; there is a name, a position in a list, and an emblem.\n\n" +
      "WHY A NEARLY EMPTY RECORD IS WORTH HAVING. Because the king list is not a neutral inventory. It is " +
      "a curated object that grows and is edited, and the figures at its top are exactly where additions " +
      "and adjustments are most likely and least detectable. Recording Gangnihessou as a NAME IN A " +
      "TRADITION, rather than quietly as a reign with dates, keeps the difference visible between the " +
      "rulers Europeans met and wrote about and the rulers who exist only because a list says so.\n\n" +
      "THE SAME CAUTION APPLIES TO DAKODONOU. Some analysis holds that Dakodonou was inserted into the " +
      "royal line in the eighteenth century in order to legitimise the dynasty's rule over the plateau's " +
      "earlier inhabitants. Whether or not that is right, it is the kind of thing that happens to the top " +
      "of king lists.\n\n" +
      "THINGS TO ASK: How would you tell a remembered king from an added one?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "traditional_account",
    identificationStatus: "disputed",
    tags: ["rulers", "dahomey", "oral-knowledge", "royal-symbolism", "king-list", "tradition"],
    people: ["Gangnihessou"],
    civilisations: ["Dahomey"],
    locationName: "Abomey plateau, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "dahomean_royal_tradition",
        startYear: 1600,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "Gangnihessou's place in the royal sequence",
        originalDateText: "Around 1600, in the traditional chronology; frequently given no dates at all",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence:
          "WHAT THIS DATE RESTS ON: position in a king list and nothing else. IT IS ENTERED AS A SINGLE " +
          "APPROXIMATE POINT RATHER THAN A REIGN because assigning start and end years to a ruler with no " +
          "documentation would manufacture a reign out of a name.",
        notes: "NEEDS BETTER SOURCING throughout; this is among the weakest records in the dataset.",
      },
    ],
    media: [
      {
        url: commons("Symbole de Gangnihessou roi du Dahomey au mur de la place Goho à Abomey au Bénin (2).jpg"),
        sourcePageUrl: commonsPage("Symbole de Gangnihessou roi du Dahomey au mur de la place Goho à Abomey au Bénin (2).jpg"),
        fileName: "Symbole de Gangnihessou roi du Dahomey au mur de la place Goho à Abomey au Bénin (2).jpg",
        caption:
          "The symbol of Gangnihessou on the wall at Place Goho in Abomey. This is a modern rendering of a royal emblem in a public commemorative setting — evidence of how the dynasty is remembered and displayed today, not an object from the reign it names.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "IMPORTANT: the Place Goho wall symbols throughout this dataset are contemporary public art " +
          "presenting the traditional emblems. They are excellent evidence for the emblem system and for " +
          "modern commemoration, and they are not historical objects.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "do-aklin",
    title: "Do-Aklin, and the arrival on the plateau",
    summary:
      "In the three-brothers tradition, Do-Aklin is the one who goes north from Allada to the Abomey plateau. The tradition is also the dynasty's claim to a prestigious descent.",
    description:
      "WHAT THE TRADITION SAYS. When the rulership of Allada is divided between three brothers around 1600, " +
      "Do-Aklin goes north and settles on the plateau that will become Dahomey's heartland. His line will " +
      "produce the kings of Abomey.\n\n" +
      "WHAT THE TRADITION IS FOR. It makes Dahomey a branch of Allada rather than an upstart, gives its " +
      "kings the seniority of an old coastal dynasty, and turns the later conquest of Allada into a family " +
      "matter. J. Cameron Monroe and others have argued that the Allada descent is PROBABLY A LATER " +
      "CONSTRUCTION serving exactly that purpose.\n\n" +
      "WHAT THE ARRIVAL MEANT ON THE GROUND. The plateau was occupied. The Gedevi communities already " +
      "there are present in the tradition — as the people the newcomers negotiate with, and in the Dan " +
      "story as the people they kill. The founding of Dahomey is, in its own tradition, an arrival among " +
      "others rather than a settlement of empty land.\n\n" +
      "THINGS TO ASK: Whose account of an arrival survives, and what does the other side's version look " +
      "like when it does not?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "traditional_account",
    identificationStatus: "disputed",
    tags: ["rulers", "dahomey", "migration", "allada", "oral-knowledge", "legitimacy", "abomey"],
    people: ["Do-Aklin"],
    civilisations: ["Dahomey", "Allada"],
    locationName: "Abomey plateau, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "dahomean_royal_tradition",
        startYear: 1600,
        endYear: 1625,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "Do-Aklin's move to the plateau",
        originalDateText: "The early seventeenth century, in the traditional chronology",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHAT THIS DATE RESTS ON: the three-brothers tradition and the king list. No contemporary source " +
          "records the move, and the whole sequence is anchored only at its recent end.",
      },
      {
        sourceKey: "monroe_precolonial_state",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether the Allada descent is a genuine memory",
        originalDateText: "Argued to be a later construction serving the 1724 conquest",
        datingMethod: "archaeological",
        chronology: "disputed",
        evidence:
          "WHY THIS IS ITS OWN CLAIM: the question of whether Do-Aklin came from Allada is separate from " +
          "the question of when anybody arrived on the plateau, and a reader should be able to doubt the " +
          "first without doubting the second.",
      },
    ],
  },

  {
    slug: "dakodonou",
    title: "Dakodonou",
    summary:
      "The king to whom the Dan story is attached, and whose place in the royal line has itself been argued to be a later addition.",
    description:
      "WHAT THE TRADITION SAYS. Dakodonou rules on the plateau in the first half of the seventeenth " +
      "century, commonly given as about 1620 to 1645. He is the king in the story of Dan's belly, and " +
      "therefore the figure through whom the dynasty's possession of the plateau is explained. The " +
      "souterrains at Agongointo are traditionally attached to his reign as well.\n\n" +
      "THE SUSPICION. Some analysis holds that Dakodonou was ADDED to the royal line in the eighteenth " +
      "century, to legitimise the dynasty's rule over the plateau's earlier inhabitants. If that is right, " +
      "then the king in the foundation story is himself part of the foundation story.\n\n" +
      "HOW TO HOLD BOTH. This dataset does not decide. It records the traditional reign, records the " +
      "suspicion as a separate claim, and leaves the two visible together — which is the honest " +
      "representation of a figure who may be a remembered king, a constructed ancestor, or a real person " +
      "around whom a legitimating story later grew.\n\n" +
      "THINGS TO ASK: If a king exists to explain something, does that mean he did not exist?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "traditional_account",
    identificationStatus: "disputed",
    tags: ["rulers", "dahomey", "oral-knowledge", "legitimacy", "abomey", "tradition", "agongointo"],
    people: ["Dakodonou"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "wikipedia_dahomey_navigation",
        startYear: 1620,
        endYear: 1645,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The reign of Dakodonou",
        originalDateText: "c. 1620 – c. 1645",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence:
          "WHAT THIS DATE RESTS ON: the king list, back-counted. THE ROUNDNESS OF BOTH FIGURES IS THE TELL " +
          "— a reign known from documents rarely begins and ends on a multiple of five.",
        notes:
          "NEEDS BETTER SOURCING: these dates are taken from general reference material and should be " +
          "replaced with dates cited to a historian who shows the reasoning.",
      },
      {
        sourceKey: "law_history_and_legitimacy",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether Dakodonou was a later addition to the royal line",
        originalDateText: "Argued: inserted in the eighteenth century to legitimise rule over the plateau's earlier inhabitants",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "WHY THE ARGUMENT IS PLAUSIBLE: Dahomey's court is known to have managed its official history, " +
          "and the figure whose story justifies the seizure of the plateau is precisely the figure a court " +
          "would have reason to supply. WHAT WOULD TEST IT: attestation of Dakodonou in any source earlier " +
          "than the eighteenth century.",
        notes: "NEEDS SOURCE VERIFICATION for who makes this argument in print and on what evidence.",
      },
    ],
  },

  {
    slug: "houegbadja",
    title: "Houegbadja, and the making of a kingdom",
    summary:
      "The reign traditionally credited with founding Dahomey as a state: the palace at Abomey, the institutions, the rule that the kingdom is not to be shared, and the beginnings of the Annual Customs.",
    description:
      "WHAT HE IS CREDITED WITH. Houegbadja, whose reign is usually given as about 1645 to 1685, is the " +
      "ruler the tradition treats as the real founder. He is associated with establishing the palace at " +
      "Abomey, with the principle that the kingdom is a single inheritance not to be divided, and with the " +
      "ancestral ceremonies — the 'watering of the graves' of the royal dead — out of which the Annual " +
      "Customs grow.\n\n" +
      "WHY THAT LAST POINT MATTERS MORE THAN IT LOOKS. A kingdom whose central annual ritual is the " +
      "servicing of dead kings is a kingdom in which the dynasty's continuity IS the religion of the state. " +
      "Every later king inherits an obligation to his predecessors that is expensive, public and " +
      "non-optional. That structure explains a great deal about Dahomey's later behaviour, including the " +
      "scale of its ceremonies.\n\n" +
      "HE IS ALSO CREDITED WITH THE GBETO. Tradition holds that Houegbadja formed, or organised, a corps " +
      "of women elephant hunters — and one version of the Agojie's origin runs back through them to him. " +
      "Another tradition has the gbeto pre-dating him, with Houegbadja merely organising groups that " +
      "existed. Both are recorded in the Agojie records.\n\n" +
      "WHAT IS DOCUMENTED CONTEMPORARY. Nothing directly. Houegbadja is before the continuous European " +
      "record of the kingdom, and everything above comes through the royal tradition.\n\n" +
      "THINGS TO ASK: What does it change about a state if its main annual event is for the dead?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "traditional_account",
    tags: ["rulers", "dahomey", "abomey", "ancestors", "annual-customs", "agojie", "institutions", "oral-knowledge"],
    people: ["Houegbadja"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "wikipedia_dahomey_navigation",
        startYear: 1645,
        endYear: 1685,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The reign of Houegbadja",
        originalDateText: "c. 1645 – c. 1685",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence:
          "WHAT THIS DATE RESTS ON: the king list, anchored by the better-documented reigns that follow. " +
          "It is the earliest reign in the sequence that later European informants could plausibly have " +
          "been told about by people who remembered it.",
        notes: "NEEDS BETTER SOURCING, as with every pre-1700 reign in this dataset.",
      },
    ],
  },

  {
    slug: "akaba",
    title: "Akaba",
    summary:
      "Reigned from about 1685 to about 1716, campaigning in the Ouémé valley. His death without an adult heir opens the succession crisis that Hangbe and Agaja stand on either side of.",
    description:
      "WHAT IS TRADITIONALLY RECORDED. Akaba ruled from about 1685 to about 1716, continuing the " +
      "kingdom's expansion, particularly in the valley of the Ouémé. His reign belongs to the period when " +
      "Dahomey was becoming a power on the plateau but had not yet reached the coast.\n\n" +
      "HIS DEATH IS THE IMPORTANT EVENT. Tradition holds that Akaba died suddenly, and that his eldest son " +
      "Agbo Sassa was not of age. What happened next is the most disputed passage in the whole king list: " +
      "his twin sister Hangbe is remembered as taking power — as regent, or as ruler in her own right, " +
      "depending on the account — and Agaja follows.\n\n" +
      "WHY A SUCCESSION CRISIS IS WORTH A RECORD. Because the way a monarchy handles one reveals its rules. " +
      "Dahomey's practice was not straightforward primogeniture, and the events of 1716–1718 are the " +
      "clearest surviving evidence of how the succession could actually be contested, and of who could " +
      "contest it.\n\n" +
      "THINGS TO ASK: When a king dies leaving a child, who decides what happens? What do the answers tell " +
      "you about where power really sits?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "traditional_account",
    tags: ["rulers", "dahomey", "succession", "hangbe", "warfare", "oral-knowledge"],
    people: ["Akaba", "Agbo Sassa"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "wikipedia_dahomey_navigation",
        startYear: 1685,
        endYear: 1716,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The reign of Akaba",
        originalDateText: "1685 to c. 1716",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence:
          "WHAT THIS DATE RESTS ON: the king list, now close enough to the documented period that the end " +
          "date is constrained by Agaja's accession, which European traders on the coast were in a " +
          "position to know about.",
      },
    ],
    media: [
      {
        url: commons("Symbole de Akaba roi du Dahomey au mur de la place Goho à Abomey au Bénin5.jpg"),
        sourcePageUrl: commonsPage("Symbole de Akaba roi du Dahomey au mur de la place Goho à Abomey au Bénin5.jpg"),
        fileName: "Symbole de Akaba roi du Dahomey au mur de la place Goho à Abomey au Bénin5.jpg",
        caption:
          "Akaba's royal symbol on the wall at Place Goho, Abomey. A modern rendering of the traditional emblem in a public commemorative display — evidence for the emblem system and for how the kings are remembered now, rather than an object of the reign.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "hangbe-reign",
    title: "Hangbe takes power after Akaba",
    summary:
      "Akaba's twin sister held authority between about 1716 and 1718, continued his campaigns, and was then removed. Whether she was regent or king is the question the next record is about.",
    description:
      "WHAT THE TRADITIONS AGREE ON. That on Akaba's sudden death his twin sister Hangbe — Tassi Hangbe, Na " +
      "Hangbe — held power at Abomey, because Akaba's eldest son Agbo Sassa was too young. That she " +
      "continued the warfare Akaba had been conducting in the Ouémé valley, and may have led expeditions " +
      "herself. That her rule was short. And that it ended with her removal, after which Agaja reigned.\n\n" +
      "WHAT THEY DISAGREE ON. How long: accounts give either about three MONTHS or about three YEARS, a " +
      "difference of an order of magnitude. Whether she ruled as monarch or held authority in trust. And " +
      "how she lost it — versions range from abdication to deposition by Agaja.\n\n" +
      "THE FACT THAT SHAPES ALL THE OTHERS. Hangbe is absent from, or marginal in, the official king list " +
      "as it was maintained afterwards. An omission from the list of a reign that oral tradition remembers " +
      "is not a gap in the evidence: it is evidence, about the court that kept the list and about what " +
      "followed her removal.\n\n" +
      "WHAT SURVIVES NOW. A Hangbe lineage continues at Abomey, in a compound near the royal palaces, with " +
      "a titleholder bearing her name. A living institution maintaining a tradition about a disputed reign " +
      "is a source in the present about the past, and it has an interest in that past — which is true of " +
      "every royal tradition in this dataset, hers no more than the rest.\n\n" +
      "THINGS TO ASK: If a list leaves somebody out, what are you looking at — an error, or a decision?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "traditional_account",
    identificationStatus: "disputed",
    tags: ["rulers", "dahomey", "women-and-power", "hangbe", "succession", "oral-knowledge", "agojie"],
    people: ["Hangbe", "Akaba", "Agaja", "Agbo Sassa"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "wikipedia_dahomey_navigation",
        startYear: 1716,
        endYear: 1718,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "Hangbe's period of authority",
        originalDateText: "1716–1718",
        datingMethod: "regnal_chronology",
        chronology: "traditional",
        evidence:
          "WHAT FIXES THE WINDOW: Akaba's death at one end and Agaja's accession at the other, both " +
          "constrained by the European record on the coast. WHAT DOES NOT FIX IT: any account of Hangbe's " +
          "own reign, which is why the length within that window is disputed.",
      },
      {
        sourceKey: "dahomean_royal_tradition",
        durationYears: 0.25,
        datePrecision: "month",
        isApproximate: true,
        temporalClaimType: "unknown",
        dateConvention: "relative",
        whatIsDated: "How long Hangbe held power, on the short tradition",
        originalDateText: "About three months",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "THE SHORT VERSION, which reduces Hangbe to a brief interregnum. WHY IT IS ENTERED AS A LENGTH " +
          "WITHOUT A POSITION: because it is a claim about DURATION, not about when — the window is fixed " +
          "by the reigns on either side, and what is disputed is how much of it she occupied. Storing it " +
          "as a start and end date would invent months nobody recorded.",
        notes:
          "The two duration claims on this record are the clearest example in this dataset of why a " +
          "timeline needs to store lengths separately from positions.",
      },
      {
        sourceKey: "dahomean_royal_tradition",
        durationYears: 3,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "unknown",
        dateConvention: "relative",
        whatIsDated: "How long Hangbe held power, on the long tradition",
        originalDateText: "About three years",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "THE LONG VERSION, which makes her a reigning monarch with a full if short reign. THE TWO " +
          "VERSIONS ARE NOT A SMALL DISCREPANCY: three months is a caretaker and three years is a king, " +
          "and the choice between them is the substance of the next record rather than a detail.",
      },
    ],
  },

  {
    slug: "did-hangbe-rule-dahomey",
    title: "Did Queen Hangbe rule Dahomey?",
    summary:
      "Regent or monarch; three months or three years; removed or retired; remembered or erased. The evidence on each side, with no answer supplied.",
    description:
      "WHAT KIND OF RECORD IS THIS? A debate. It does not resolve.\n\n" +
      "THE CASE THAT SHE REIGNED. Oral traditions at Abomey — including those maintained by the lineage " +
      "descended from her — hold that she ruled in her own right, not merely in trust. She is credited with " +
      "continuing military campaigns, which is the activity of a monarch rather than a placeholder. And a " +
      "surviving titled Hangbe lineage is a continuing institutional assertion of her kingship.\n\n" +
      "THE CASE THAT SHE DID NOT. The official king list, as maintained by the court, does not accord her " +
      "a reign in the way it does the male rulers. Some traditions describe her explicitly as regent for " +
      "Agbo Sassa. And the short chronology — three months — is hard to square with a full reign.\n\n" +
      "THE ARGUMENT THAT CUTS THROUGH BOTH. That the list is evidence about the court, not about 1716. A " +
      "successor who took power by removing her would have every reason to minimise her, and the court " +
      "that maintained the official history was that successor's. On this reading her absence from the list " +
      "supports her having reigned, because a mere regent would not have needed removing from it.\n\n" +
      "THE COUNTER-ARGUMENT THAT SHOULD NOT BE SKIPPED. That reading makes silence into proof. If an " +
      "absence can only ever confirm the thesis, it is not evidence. A regency genuinely omitted from a " +
      "king list looks exactly the same.\n\n" +
      "WHAT WOULD ACTUALLY MOVE IT. A European account from the coast in 1716–1718 naming who was ruling " +
      "at Abomey. Traders were present, corresponding, and interested in who held power. If such a letter " +
      "exists it is the most valuable unexamined document in this dataset.\n\n" +
      "ON THE AGOJIE CONNECTION. The tradition that Hangbe founded the women's corps is dealt with " +
      "separately, and should not be used as evidence here: whether she ruled and whether she founded an " +
      "army are two claims, and using each to support the other is circular.\n\n" +
      "THINGS TO ASK: Is being left out of a list evidence of anything? Under what conditions?",
    category: "history",
    subcategory: "Debate",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["debate", "women-and-power", "hangbe", "dahomey", "rulers", "oral-knowledge", "memory", "method"],
    people: ["Hangbe"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "bay_wives_of_the_leopard",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether Hangbe reigned as monarch",
        originalDateText: "Unresolved. Oral traditions depict her variously as regent and as ruler in her own right",
        datingMethod: "oral_tradition",
        chronology: "disputed",
        evidence:
          "FOR: traditions at Abomey including her own lineage's; attributed military leadership; the " +
          "argument that omission from the list reflects a successor's interest. AGAINST: her standing in " +
          "the official king list; traditions describing a regency; the short chronology. WHY THIS CLAIM " +
          "HAS NO POSITION ON THE AXIS: it is a question about the status of an office-holder, not about " +
          "when something happened — the dates are already on the reign record next to it.",
        notes:
          "NEEDS SOURCE VERIFICATION for Bay's treatment specifically, which is the most careful published " +
          "discussion and is summarised here rather than cited.",
      },
    ],
  },

  {
    slug: "agaja",
    title: "Agaja, and the march to the sea",
    summary:
      "Under Agaja (c. 1718–1740) Dahomey conquered Allada in 1724 and Hueda in 1727, reached the Atlantic, and became tributary to Oyo. Why he did it is one of the field's long arguments.",
    description:
      "WHAT HAPPENED. Agaja took Allada in 1724 and Hueda, with its capital at Savi and its port at Ouidah, " +
      "in 1727. In three years an inland kingdom became an Atlantic one, in direct contact with European " +
      "traders and their forts. It also became a neighbour of Oyo, the Yoruba empire to the east, whose " +
      "cavalry repeatedly invaded and to which Dahomey became TRIBUTARY — a subordination that lasted " +
      "roughly a century.\n\n" +
      "WHY HE DID IT: THE ARGUMENT. I. A. Akinjogbin argued in 1967 that Agaja moved to the coast in order " +
      "to SUPPRESS the slave trade, which was devastating the region. It is a striking thesis and it was " +
      "influential. Robin Law and others have argued against it at length: Dahomey continued and expanded " +
      "the export of captives after taking the coast, the evidence for an anti-trade motive is thin, and " +
      "the pattern of conquest fits control of a lucrative trade better than abolition of it.\n\n" +
      "WHY THE ARGUMENT MATTERS BEYOND ITSELF. Because a great deal of popular writing still repeats " +
      "Akinjogbin's version without flagging that it is contested. This dataset keeps both, and marks " +
      "which is the current scholarly weight.\n\n" +
      "WHAT AGAJA IS ALSO CREDITED WITH. Reorganising the army; the earliest European reports of armed " +
      "women in Dahomean service fall around this period; and the establishment of the Annual Customs in " +
      "something like their documented form, conventionally dated to around 1730.\n\n" +
      "THINGS TO ASK: How would you tell a conquest meant to stop a trade from one meant to capture it?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["rulers", "dahomey", "warfare", "allada", "hueda", "ouidah", "slavery", "oyo", "debate"],
    people: ["Agaja"],
    civilisations: ["Dahomey", "Allada", "Hueda", "Oyo"],
    locationName: "Abomey, Allada and the coast",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "wikipedia_dahomey_navigation",
        startYear: 1718,
        endYear: 1740,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The reign of Agaja",
        originalDateText: "1718–1740",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT SUPPORTS THIS DATE: from Agaja onwards, European traders and officials on the coast are " +
          "writing continuously about who rules at Abomey, so the reign dates are constrained by " +
          "contemporary correspondence rather than by a king list alone. Some accounts give 1716 for the " +
          "accession, following the short chronology for Hangbe.",
      },
      {
        sourceKey: "snelgrave_new_account_1734",
        startYear: 1724,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The conquest of Allada",
        originalDateText: "1724",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT MAKES THIS SECURE: European traders on the coast recorded the conquest close to the event " +
          "and had every commercial reason to get it right — their business depended on who controlled the " +
          "routes inland.",
      },
      {
        sourceKey: "snelgrave_new_account_1734",
        startYear: 1727,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The conquest of Hueda",
        originalDateText: "1727",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT MAKES THIS SECURE: the same contemporary European presence, this time at the place being " +
          "conquered — the forts at Ouidah were in the middle of it.",
      },
      {
        sourceKey: "akinjogbin_dahomey_neighbours",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Why Agaja conquered the coast",
        originalDateText: "Argued: to suppress the slave trade rather than to profit from it",
        datingMethod: "textual_interpretation",
        chronology: "alternative",
        evidence:
          "AKINJOGBIN'S CASE: that the trade was destroying the region's societies, and that Dahomey's " +
          "expansion is better read as a response to that than as participation in it. THE CASE AGAINST, " +
          "made by Law and others: Dahomey's exports of captives rose after the conquest; contemporary " +
          "European sources describe a kingdom trading rather than suppressing; and the thesis requires " +
          "reading motives that the documents do not supply. WHY IT IS RECORDED AS ALTERNATIVE RATHER THAN " +
          "DELETED: it was a serious scholarly position by a major historian, it changed how the field " +
          "argued, and its influence on popular accounts persists.",
      },
    ],
  },

  {
    slug: "dahomey-tributary-to-oyo",
    title: "Dahomey pays tribute to Oyo",
    summary:
      "From around 1730 Dahomey was a tributary of the Yoruba empire of Oyo, whose cavalry it could not defeat on open ground. The subordination lasted until Ghezo ended it in the 1820s.",
    description:
      "WHAT HAPPENED. Dahomey's expansion to the coast brought it up against OYO, the Yoruba empire to the " +
      "north-east, which invaded repeatedly in the 1720s and 1730s. Dahomey lost, and from around 1730 paid " +
      "annual tribute to Oyo. It remained a tributary for roughly a century.\n\n" +
      "WHY DAHOMEY COULD NOT WIN. CAVALRY. Oyo's power rested on horsemen, and Dahomey's army was " +
      "infantry. On the open savanna of the north-east, cavalry could destroy infantry in the field; " +
      "Dahomey's answer was to avoid battle, fortify, and endure the raids until the horsemen withdrew. " +
      "The tsetse belt that made horses unviable further south is the reason Oyo could not simply conquer " +
      "Dahomey outright, and it is why the frontier between them sat where it did. MILITARY GEOGRAPHY " +
      "EXPLAINS MORE OF THIS REGION'S POLITICAL HISTORY THAN ANY AMOUNT OF NARRATIVE ABOUT KINGS.\n\n" +
      "WHAT TRIBUTARY STATUS MEANT. Annual payment, constraint on campaigns, and a subordinate position " +
      "that Dahomey's own royal tradition did not dwell on. A kingdom famous in Europe for ferocity spent a " +
      "century paying somebody else.\n\n" +
      "HOW IT ENDED. Ghezo ceased payment in the 1820s, as Oyo collapsed under internal crisis and the " +
      "Sokoto jihad pressed from the north. Dahomey's independence was recovered less by victory than by " +
      "outlasting the power that held it.\n\n" +
      "THINGS TO ASK: How much of what a state can do is decided by what animals can live where?",
    category: "history",
    subcategory: "Warfare and diplomacy",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["warfare", "dahomey", "oyo", "tribute", "cavalry", "yoruba", "military"],
    civilisations: ["Dahomey", "Oyo"],
    locationName: "Dahomey and the Oyo frontier",
    lat: 7.5,
    lng: 2.5,
    claims: [
      {
        sourceKey: "law_rise_of_dahomey_jah",
        startYear: 1730,
        endYear: 1823,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Dahomey's tributary relationship with Oyo",
        originalDateText: "From about 1730 until the 1820s",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT SUPPORTS THE START: the Oyo invasions of the 1720s and 1730s and the imposition of tribute, " +
          "reported by European traders. WHAT SUPPORTS THE END: the cessation of payment under Ghezo, " +
          "coinciding with Oyo's disintegration. BOTH ENDS ARE PROCESSES rather than moments, which is why " +
          "this is a range with approximate boundaries.",
        notes: "NEEDS SOURCE VERIFICATION for the specific year tribute ceased, where accounts differ.",
      },
    ],
  },

  {
    slug: "tegbesu",
    title: "Tegbesu",
    summary:
      "Reigned about 1740–1774, consolidating the administration of a kingdom that now stretched to the coast and drew a large revenue from the sale of captives.",
    description:
      "WHAT THE REIGN IS KNOWN FOR. Consolidation rather than conquest. Tegbesu inherited a kingdom that " +
      "had expanded fast and was tributary to Oyo, and his reign is associated with organising its " +
      "administration, its court offices and its management of the trade at Ouidah.\n\n" +
      "THE REVENUE. Under Tegbesu the kingdom's income from the sale of captives was very large, and the " +
      "administration of that trade — the offices, the tolls, the regulation of European traders at Ouidah " +
      "— is a substantial part of what 'consolidation' means here. THIS IS NOT A DETAIL THAT CAN BE SET " +
      "ASIDE: the Dahomean state of the later eighteenth century was financed substantially by selling " +
      "people.\n\n" +
      "WHAT SURVIVES OF HIM. His emblem and praise names in the royal tradition, his palace within the " +
      "Abomey complex, and the administrative structures later Europeans described.\n\n" +
      "WHAT THIS RECORD CANNOT DO. Give reliable figures. Estimates of Dahomean royal revenue from the " +
      "trade circulate widely, and this dataset does not reproduce them because they could not be traced " +
      "to a source with a method. A number without a derivation is not evidence.\n\n" +
      "THINGS TO ASK: What does it mean to say a state was 'financed by' something? How would you show it?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "historical",
    tags: ["rulers", "dahomey", "slavery", "administration", "ouidah", "trade"],
    people: ["Tegbesu"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "wikipedia_dahomey_navigation",
        startYear: 1740,
        endYear: 1774,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The reign of Tegbesu",
        originalDateText: "1740–1774",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT SUPPORTS THIS DATE: European trading correspondence from Ouidah, where a change of king at " +
          "Abomey was commercially important news.",
      },
    ],
    media: [
      {
        url: commons("Symbole de Tegbessou roi du Dahomey au mur de la place Goho à Abomey au Bénin.jpg"),
        sourcePageUrl: commonsPage("Symbole de Tegbessou roi du Dahomey au mur de la place Goho à Abomey au Bénin.jpg"),
        fileName: "Symbole de Tegbessou roi du Dahomey au mur de la place Goho à Abomey au Bénin.jpg",
        caption:
          "Tegbesu's royal symbol on the wall at Place Goho, Abomey — a modern public rendering of the traditional emblem, and evidence for how the royal symbol system is maintained and displayed today rather than an eighteenth-century object.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Symbole de Tegbessou roi du Dahomey au mur de la place Goho à Abomey au Bénin1.jpg"),
        sourcePageUrl: commonsPage("Symbole de Tegbessou roi du Dahomey au mur de la place Goho à Abomey au Bénin1.jpg"),
        fileName: "Symbole de Tegbessou roi du Dahomey au mur de la place Goho à Abomey au Bénin1.jpg",
        caption:
          "A second view of Tegbesu's symbol at Place Goho. Two photographs of the same wall are two records of one object, not two pieces of evidence — which is worth saying in a gallery, where accumulation reads as corroboration.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "kpengla",
    title: "Kpengla",
    summary:
      "Reigned about 1774–1789. His reign covers the period from which the eyewitness accounts of Norris and Dalzel derive, including the 1772 description of royal ceremonial.",
    description:
      "WHAT THE REIGN IS KNOWN FOR. Continued warfare, competition for control of the coastal trade against " +
      "neighbours including Porto-Novo, and attempts to force European traders to deal on Dahomey's terms.\n\n" +
      "WHY IT MATTERS FOR THE EVIDENCE. This is the period from which the fullest eighteenth-century " +
      "European descriptions of Dahomey come. Robert Norris visited Abomey in 1772 and published in 1789; " +
      "Archibald Dalzel's history appeared in 1793 drawing on Norris and on traders' accounts. The " +
      "eighteenth-century picture of Dahomey that reached Europe — including its picture of human sacrifice " +
      "— is substantially made of these two books.\n\n" +
      "AND WHY THAT IS A PROBLEM. Both men were slave traders, and Dalzel wrote while abolition was being " +
      "debated in Britain. Their accounts of Dahomean violence carried an argument: that Africans sold into " +
      "the Atlantic trade were being saved from something worse at home. That does not make their reports " +
      "false. It makes them testimony with a purpose, and the purpose has to be recorded alongside the " +
      "testimony.\n\n" +
      "THINGS TO ASK: If the only eyewitness to an event had a reason to describe it a particular way, what " +
      "do you do with the account?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "historical",
    tags: ["rulers", "dahomey", "slavery", "european-encounter", "primary-source", "warfare"],
    people: ["Kpengla", "Robert Norris", "Archibald Dalzel"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "wikipedia_dahomey_navigation",
        startYear: 1774,
        endYear: 1789,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The reign of Kpengla",
        originalDateText: "1774–1789",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT SUPPORTS THIS DATE: continuous European trading correspondence from Ouidah, where a change of king at Abomey was commercially urgent news, together with the accounts of Norris, who was at Abomey in 1772, and Dalzel, who drew on him. THE REIGN IS BETTER DATED THAN THE EIGHTEENTH-CENTURY REIGNS BEFORE IT because more Europeans were writing more often by this point.",
      },
      {
        sourceKey: "norris_bossa_ahadee_1789",
        startYear: 1772,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Norris's visit to Abomey, the basis of his published description",
        originalDateText: "1772",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: a journey, not an institution. This is entered as its own claim because the date " +
          "of a SOURCE is a different fact from the date of what it describes, and the 1772 material is " +
          "cited repeatedly in the sacrifice records where the distinction matters most.",
      },
    ],
  },

  {
    slug: "agonglo",
    title: "Agonglo",
    summary:
      "Reigned about 1789–1797. Remembered for changes in royal ceremonial and art, and killed — in a period when the Atlantic trade that financed the kingdom was coming under pressure.",
    description:
      "WHAT THE REIGN IS KNOWN FOR. A shorter reign than his predecessors', in a period of strain. Agonglo " +
      "is associated in the royal tradition with changes in ceremonial and with developments in court art. " +
      "His reign ended violently.\n\n" +
      "THE CONTEXT THAT MATTERS. The 1790s are when the Atlantic slave trade's political ground begins to " +
      "shift: abolitionist pressure in Britain, revolution in France, and the revolution in Saint-Domingue " +
      "from 1791 which will end in Haitian independence. A kingdom whose revenue depends on selling " +
      "captives across that ocean is exposed to all of it, and the strains of Dahomean politics in this " +
      "period cannot be read apart from that exposure.\n\n" +
      "WHAT IS THIN HERE. The detail. Agonglo's reign is among the less well documented of the eighteenth " +
      "century and this record says so rather than padding it.\n\n" +
      "THINGS TO ASK: What happens to a state when the thing that pays for it starts to become impossible?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "historical",
    tags: ["rulers", "dahomey", "slavery", "royal-art", "atlantic"],
    people: ["Agonglo"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "wikipedia_dahomey_navigation",
        startYear: 1789,
        endYear: 1797,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The reign of Agonglo",
        originalDateText: "1789–1797",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT SUPPORTS THIS DATE: European trading correspondence from the coast, which records accessions because they determined who the traders had to deal with. WHY IT IS STILL APPROXIMATE: Agonglo's reign is short, less well covered than his father's or his successors', and the circumstances of its end differ between accounts.",
        notes: "NEEDS BETTER SOURCING for the circumstances of his death, which differ between accounts.",
      },
    ],
    media: [
      {
        url: commons("Symbole de Agonglo roi du Dahomey 5 au mur de la place Goho à Abomey au Bénin.jpg"),
        sourcePageUrl: commonsPage("Symbole de Agonglo roi du Dahomey 5 au mur de la place Goho à Abomey au Bénin.jpg"),
        fileName: "Symbole de Agonglo roi du Dahomey 5 au mur de la place Goho à Abomey au Bénin.jpg",
        caption:
          "Agonglo's royal symbol at Place Goho, Abomey. A modern public rendering of the traditional emblem, photographed in place — evidence for the emblem system as it is maintained today.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Palais du roi Agonglo - Site des Palais royaux d'Abomey 01.jpg"),
        sourcePageUrl: commonsPage("Palais du roi Agonglo - Site des Palais royaux d'Abomey 01.jpg"),
        fileName: "Palais du roi Agonglo - Site des Palais royaux d'Abomey 01.jpg",
        caption:
          "The palace of King Agonglo within the royal palace site at Abomey. Each king built his own palace inside the growing enclosure, so the complex is a sequence of reigns in earth — and what stands today has been repeatedly damaged, rebuilt and conserved.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "adandozan",
    title: "Adandozan",
    summary:
      "Reigned from about 1797 until 1818, when Ghezo overthrew him. What the royal tradition says about him afterwards is the subject of a debate of its own.",
    description:
      "WHAT HAPPENED. Adandozan came to the throne around 1797 and was deposed in 1818 by his brother " +
      "Ghezo, with the support of the Brazilian merchant Francisco Félix de Souza, who became the chacha " +
      "at Ouidah under the new king. Adandozan was not killed; he is reported to have lived on at Abomey " +
      "for decades afterwards.\n\n" +
      "WHAT THE TRADITION SAYS ABOUT HIM. That he was cruel, unstable, ruinous, and that his removal saved " +
      "the kingdom. In the official royal narrative maintained after 1818 he is a cautionary figure rather " +
      "than a predecessor to be honoured.\n\n" +
      "WHY THAT IS NOT SIMPLY EVIDENCE ABOUT ADANDOZAN. The narrative was maintained by the court of the " +
      "man who overthrew him, in a monarchy whose legitimacy ran through descent and succession. A " +
      "usurpation needs a justification, and 'my predecessor was a monster' is the standard one, " +
      "everywhere. THAT DOES NOT MAKE IT FALSE. It makes it testimony from an interested party.\n\n" +
      "WHAT SURVIVES OUTSIDE THE TRADITION. Contemporary European and Brazilian references to Adandozan's " +
      "reign, including correspondence — the letters exchanged with the Portuguese crown are among the " +
      "most valuable surviving documents of any Dahomean reign. Objects associated with him survive too, " +
      "including in the collections removed from Abomey.\n\n" +
      "WHAT MODERN SCHOLARSHIP HAS DONE. Reopened the question, arguing that the picture of Adandozan is " +
      "substantially the product of the regime that replaced him, and reading the contemporary documents " +
      "against the royal tradition rather than through it.\n\n" +
      "THINGS TO ASK: Who wrote the history of a king who was overthrown? Whose interests did it serve?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["rulers", "dahomey", "adandozan", "ghezo", "memory", "legitimacy", "debate", "slavery"],
    people: ["Adandozan", "Ghezo", "Francisco Félix de Souza"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "wikipedia_dahomey_navigation",
        startYear: 1797,
        endYear: 1818,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The reign of Adandozan",
        originalDateText: "c. 1797 – 1818",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT FIXES THE END: the coup of 1818, which is documented by Europeans and Brazilians on the " +
          "coast and is not in doubt. The start is less firm, following the uncertainty around Agonglo's " +
          "death.",
      },
      {
        sourceKey: "law_history_and_legitimacy",
        startYear: 1818,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The overthrow of Adandozan by Ghezo",
        originalDateText: "1818",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT MAKES THIS SECURE: the change of king was immediately consequential for the trade at " +
          "Ouidah and was recorded by the Europeans and Brazilians involved in it — de Souza's part in it " +
          "is documented from the other side of the Atlantic as well.",
      },
    ],
  },

  {
    slug: "was-adandozan-erased",
    title: "Was Adandozan deliberately erased from Dahomey's official memory?",
    summary:
      "He is treated in the royal tradition as a bad king barely to be commemorated. Whether that amounts to a deliberate erasure, and whether the portrait is deserved, are separate questions. Both are open here.",
    description:
      "WHAT KIND OF RECORD IS THIS? A debate, and one of the clearest cases in this dataset of a timeline " +
      "having to hold a disagreement rather than settle it.\n\n" +
      "THE CASE THAT HE WAS ERASED. He is the king the tradition does not honour. His treatment in the " +
      "royal narrative — and reportedly in the ceremonial that maintained the memory of past kings — is " +
      "unlike that of any other ruler in the list. The narrative was maintained by the court of the brother " +
      "who deposed him. The motive is plain, the mechanism existed, and Dahomey's court is independently " +
      "known to have used its official history as an instrument.\n\n" +
      "THE CASE AGAINST OVERSTATING IT. 'Erasure' is a strong word and it can be made unfalsifiable: if " +
      "absence proves erasure, then nothing could ever count against it. Adandozan was NOT killed and NOT " +
      "forgotten — his name is in the list, his reign is known, his existence was never denied. Objects " +
      "and documents from his reign survive. A king remembered badly is not the same as a king removed.\n\n" +
      "AND THE SEPARATE QUESTION. Whether the portrait is DESERVED. It is possible for a ruler to be both " +
      "genuinely disastrous and subsequently blackened by his successor, and the two are not alternatives. " +
      "Contemporary European and Brazilian sources describe his reign in ways that are not simply the " +
      "court's version, and those are the documents that can test it.\n\n" +
      "WHAT WOULD MOVE THIS. Systematic comparison of the contemporary correspondence of Adandozan's reign " +
      "against the royal tradition recorded later; and evidence about what the ceremonial actually did or " +
      "did not do for him, as against what later writers say it did.\n\n" +
      "THIS RECORD DOES NOT ANSWER THE QUESTION. It is not supposed to.\n\n" +
      "THINGS TO ASK: What is the difference between being remembered badly and being erased? How would " +
      "you tell them apart in the record?",
    category: "history",
    subcategory: "Debate",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["debate", "adandozan", "memory", "dahomey", "oral-knowledge", "legitimacy", "historiography", "ghezo"],
    people: ["Adandozan", "Ghezo"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "law_history_and_legitimacy",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether Adandozan was deliberately written out of Dahomey's official memory",
        originalDateText: "Open. The royal tradition condemns him; whether that is erasure, and whether it is deserved, are argued",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "FOR: the tradition's exceptional treatment of him; the interest of the successor regime that " +
          "maintained it; and the independently documented management of official history by this court. " +
          "AGAINST: he remains in the king list and was never denied; he survived, at Abomey, for years " +
          "after his deposition; contemporary documents from his reign survive and are not all " +
          "flattering. WHY NO POSITION ON THE AXIS: this is a question about a body of memory maintained " +
          "over a century, not an event with a date.",
        notes:
          "NEEDS SOURCE VERIFICATION for the modern reassessment specifically — the Brazilian and " +
          "Portuguese correspondence of Adandozan's reign has been studied, and this record should cite " +
          "that work rather than gesture at it.",
      },
    ],
  },

  {
    slug: "ghezo",
    title: "Ghezo, the buffalo king",
    summary:
      "Reigned 1818–1858. Ended the tribute to Oyo, expanded the Agojie into a substantial military force, resisted British pressure to end the slave trade, and turned towards palm oil.",
    description:
      "WHAT THE REIGN IS KNOWN FOR. Ghezo took the throne in 1818 by overthrowing his brother, and ruled " +
      "for forty years — the longest and best-documented reign in the kingdom's history before its fall.\n\n" +
      "THE THINGS HE IS CREDITED WITH. Ending Dahomey's century of tribute to Oyo. Rebuilding and " +
      "professionalising the army, including the expansion of the women's corps from a ceremonial and " +
      "palace body into a substantial fighting force. And presiding over the kingdom at the moment when " +
      "the Atlantic slave trade, which financed it, came under decisive external pressure.\n\n" +
      "THE BRITISH PRESSURE. Britain, having abolished its own slave trade, spent the middle decades of " +
      "the century trying to end everyone else's, by naval blockade and by diplomacy. Forbes came to " +
      "Abomey in 1849 and 1850 on exactly that errand. GHEZO'S RECORDED ANSWER — that the trade was the " +
      "ruling principle of his people, the source of their glory and wealth, and that he could not end it " +
      "alone — is quoted constantly. It is quoted from Forbes, who was the man he was refusing, and that " +
      "is how it should be read: a REPORTED statement, by an interested listener, of a position the " +
      "listener wanted to overcome.\n\n" +
      "THE PALM OIL TURN. Under pressure, Dahomey shifted increasingly towards exporting palm oil, using " +
      "plantation labour. THIS IS NOT A TRANSITION FROM SLAVERY TO SOMETHING ELSE: it is a transition from " +
      "exporting enslaved people to using them.\n\n" +
      "HIS EMBLEM. The buffalo, with the ram also attached to him in some accounts — a heavy, dangerous " +
      "animal, and a warning.\n\n" +
      "THINGS TO ASK: When a king is quoted by his opponent, what exactly do you have?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["rulers", "dahomey", "ghezo", "agojie", "slavery", "oyo", "palm-oil", "royal-symbolism", "british"],
    people: ["Ghezo", "Frederick Edwyn Forbes"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    imageUrl: commons("FORBES(1851) p1.010 GEZO, KING OF DAHOMEY.jpg"),
    claims: [
      {
        sourceKey: "forbes_dahomey_1851",
        startYear: 1818,
        endYear: 1858,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The reign of Ghezo",
        originalDateText: "1818–1858",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY THIS IS AMONG THE SECUREST REIGN DATES IN THE DATASET: both ends are attested by " +
          "contemporaries. The coup of 1818 was reported on the coast; Ghezo's death in 1858 was reported " +
          "by Europeans present in the kingdom, and Forbes and others met him in between.",
      },
      {
        sourceKey: "forbes_dahomey_1851",
        startYear: 1849,
        endYear: 1850,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Forbes's two missions to Ghezo",
        originalDateText: "1849 and 1850",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: the visits that produced the journals. Kept as its own claim because Forbes's " +
          "descriptions of the Agojie, of Ghezo and of the Customs are cited across this dataset, and the " +
          "date of the OBSERVATION is a different fact from the date of the thing observed.",
      },
    ],
    media: [
      {
        url: commons("FORBES(1851) p1.010 GEZO, KING OF DAHOMEY.jpg"),
        sourcePageUrl: commonsPage("FORBES(1851) p1.010 GEZO, KING OF DAHOMEY.jpg"),
        fileName: "FORBES(1851) p1.010 GEZO, KING OF DAHOMEY.jpg",
        caption:
          "Ghezo as published in Frederick Forbes's Dahomey and the Dahomans, 1851. AN ENGRAVING, NOT A PHOTOGRAPH: it was worked up for publication from a drawing by a British naval officer who was in Abomey trying to persuade this man to stop selling people, and it should be read as a European depiction rather than as a likeness.",
        kind: "image",
        shows: "later_artwork",
        institution: "British Library (digitised original)",
        creator: "After Frederick Edwyn Forbes",
        imageDate: "1851",
        objectDate: "1849–1851",
        identificationStatus: "probable",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "The identification rests on the plate's own caption in Forbes's book. Whether the image " +
          "resembles Ghezo is not establishable from here, and the record does not claim it does.",
        creditFrom: "source",
      },
      {
        url: commons("Gezo King of Dahomey.jpg"),
        sourcePageUrl: commonsPage("Gezo King of Dahomey.jpg"),
        fileName: "Gezo King of Dahomey.jpg",
        caption:
          "A second nineteenth-century European depiction of Ghezo. Two engravings of one king, made by and for Europeans, are two pieces of evidence about European picture-making and one very thin piece of evidence about his appearance.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "probable",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "resolved_at_seed",
        provenanceNotes: "NEEDS SOURCE VERIFICATION for artist, publication and date.",
        creditFrom: "source",
      },
      {
        url: commons("Symbole de Guézo roi du Dahomey au mur de la place Goho à Abomey au Bénin.jpg"),
        sourcePageUrl: commonsPage("Symbole de Guézo roi du Dahomey au mur de la place Goho à Abomey au Bénin.jpg"),
        fileName: "Symbole de Guézo roi du Dahomey au mur de la place Goho à Abomey au Bénin.jpg",
        caption:
          "Ghezo's royal symbol on the wall at Place Goho, Abomey — the buffalo emblem as it is displayed publicly in Abomey today. Evidence for the continuing emblem tradition rather than a nineteenth-century object.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Statue du roi Ghézo-Musée du Quai Branly (11).jpg"),
        sourcePageUrl: commonsPage("Statue du roi Ghézo-Musée du Quai Branly (11).jpg"),
        fileName: "Statue du roi Ghézo-Musée du Quai Branly (11).jpg",
        caption:
          "The royal statue of Ghezo, photographed in the Musée du quai Branly in Paris. One of the large anthropomorphic royal figures taken from Abomey by French forces in 1892 and returned to Bénin in 2021 — so a photograph of it in Paris is also a document of where it had been for over a century.",
        kind: "image",
        shows: "artefact",
        institution: "Musée du quai Branly – Jacques Chirac (at the time of the photograph)",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "The object has since been transferred to Bénin. A caption saying where it is should always " +
          "carry the date of the photograph, because for this group of objects the answer changed in 2021.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "glele",
    title: "Glèlè, the lion",
    summary:
      "Reigned 1858–1889. The reign from which most of Dahomey's surviving royal art comes, and the one Richard Burton visited and wrote up in 1864.",
    description:
      "WHAT THE REIGN IS KNOWN FOR. Thirty-one years of warfare, ceremonial and court art, in a period when " +
      "the Atlantic trade was closing, the palm oil economy was growing, and European powers were moving " +
      "from trading on this coast to claiming it.\n\n" +
      "WHY SO MUCH SURVIVES FROM IT. Because it is late enough for the objects to have been standing in the " +
      "palaces in 1892, when the French took them — and because it was a reign of conspicuous artistic " +
      "production. The great iron Gou figure, attributed to the smith Akati Ekplékendo and dated to about " +
      "1858, belongs to the beginning of it. The anthropomorphic royal statues, the thrones, the doors, the " +
      "appliqué banners and the recades that fill the European museum collections are substantially " +
      "Glèlè's reign and his son's.\n\n" +
      "BURTON'S MISSION. Richard Burton came in 1863–64 as a British envoy, failed in his objectives, and " +
      "published a two-volume account. It is the fullest European description of the Dahomean court in the " +
      "nineteenth century and one of the most hostile documents in this dataset. HIS COUNTS OF SACRIFICIAL " +
      "VICTIMS ARE LOWER THAN THE FIGURES THEN CIRCULATING IN BRITAIN, which is worth knowing: the most " +
      "contemptuous eyewitness is also the one who deflates the atrocity numbers.\n\n" +
      "HIS EMBLEM. The lion, with the praise tradition that the lion cub has grown teeth — a statement " +
      "about a king succeeding a great predecessor.\n\n" +
      "THINGS TO ASK: Why does more survive from some reigns than others? What does the survival pattern " +
      "of objects tell you about the history of the people who took them?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["rulers", "dahomey", "glele", "royal-art", "royal-symbolism", "burton", "european-encounter", "warfare"],
    people: ["Glèlè", "Richard Francis Burton", "Akati Ekplékendo"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "burton_mission_gelele_1864",
        startYear: 1858,
        endYear: 1889,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The reign of Glèlè",
        originalDateText: "1858–1889",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "SECURE AT BOTH ENDS: Ghezo's death and Glèlè's accession in 1858, and Glèlè's death in 1889, are " +
          "both recorded by Europeans in contact with the kingdom, and the second is within living memory " +
          "of the French conquest three years later.",
      },
      {
        sourceKey: "burton_mission_gelele_1864",
        startYear: 1863,
        endYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Burton's mission to Abomey",
        originalDateText: "1863–64",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: the visit that produced the book. Kept separate from the reign because Burton's " +
          "observations are cited throughout this dataset and every citation needs to carry the date of " +
          "the observation, not of the reign it fell in.",
      },
    ],
    media: [
      {
        url: commons("Symbole de Glèlè roi du Dahomey au mur de la place Goho à Abomey au Bénin.jpg"),
        sourcePageUrl: commonsPage("Symbole de Glèlè roi du Dahomey au mur de la place Goho à Abomey au Bénin.jpg"),
        fileName: "Symbole de Glèlè roi du Dahomey au mur de la place Goho à Abomey au Bénin.jpg",
        caption:
          "Glèlè's lion symbol on the wall at Place Goho, Abomey. The emblem is the king's identifier across every medium the court used — relief, banner, staff, statue — and here it appears in a modern public display of the royal sequence.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Statue royale mi-homme mi-lion du roi Glèlè, Musée du quai Branly.jpg"),
        sourcePageUrl: commonsPage("Statue royale mi-homme mi-lion du roi Glèlè, Musée du quai Branly.jpg"),
        fileName: "Statue royale mi-homme mi-lion du roi Glèlè, Musée du quai Branly.jpg",
        caption:
          "The royal statue of Glèlè as a lion-man, attributed to the Abomey sculptor Sossa Dede, photographed in Paris. The figure does not illustrate a belief that the king became a lion; it is an object made by a court to state that the king IS the lion, which is a claim about kingship made in wood.",
        kind: "image",
        shows: "artefact",
        institution: "Musée du quai Branly – Jacques Chirac (at the time of the photograph)",
        creator: "Attributed to Sossa Dede",
        objectDate: "Nineteenth century",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "Taken from Abomey by French forces in 1892 and returned to Bénin in 2021; the photograph " +
          "records the Paris period. NEEDS SOURCE VERIFICATION for the attribution to Sossa Dede, which " +
          "is standard in the literature but is an attribution rather than a signature.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "behanzin",
    title: "Béhanzin, the shark",
    summary:
      "The last independent king, 1889–1894. Fought both Franco-Dahomean wars, lost Abomey in 1892, surrendered in 1894 and died in exile.",
    description:
      "WHAT HE INHERITED. A kingdom under direct pressure from France, which had established itself at " +
      "Porto-Novo and Cotonou and was converting trading arrangements into claims of sovereignty.\n\n" +
      "WHAT HE DID. Refused to accept the French reading of the agreements over Cotonou; fought the First " +
      "Franco-Dahomean War in 1890 and signed a treaty; rearmed; fought the Second from 1892; and, when " +
      "Abomey fell in November 1892, burned the palaces rather than hand them over and continued resistance " +
      "in the country for more than a year. He surrendered in January 1894.\n\n" +
      "WHERE HE WENT. Deported by France — first to Martinique, later to Algeria, where he died. The " +
      "photographs of him in exile are among the most reproduced images in this dataset, and they are " +
      "photographs of a prisoner taken by his captors' society.\n\n" +
      "HIS EMBLEMS. The shark, with the praise associating him with an egg — the world held in the hand, " +
      "which breaks if gripped too hard. The shark-man statue in the Paris collections is the visual form " +
      "of the first.\n\n" +
      "WHAT HE BECAME AFTERWARDS. A national figure in independent Bénin: the king who fought. That is a " +
      "real history of its own, running from 1894 to the present, and it is not the same history as the " +
      "reign.\n\n" +
      "THINGS TO ASK: What is a photograph of a defeated king evidence of?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["rulers", "dahomey", "behanzin", "resistance", "warfare", "france", "colonialism", "royal-symbolism", "exile"],
    people: ["Béhanzin"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    imageUrl: commons("Blida (Algeria) - Béhanzin, former King of Dahomey.jpg"),
    claims: [
      {
        sourceKey: "servicehistorique_dahomey",
        startYear: 1889,
        endYear: 1894,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The reign of Béhanzin",
        originalDateText: "1889–1894",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "THE BEST-DOCUMENTED REIGN IN THE DATASET, because France was recording it as an enemy and the " +
          "campaign archive survives. Note what that means: the securest dates here come from the army " +
          "that destroyed the kingdom.",
      },
      {
        sourceKey: "servicehistorique_dahomey",
        startYear: 1894,
        startMonth: 1,
        startDay: 15,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Béhanzin's surrender and the end of the Second Franco-Dahomean War",
        originalDateText: "15 January 1894",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "FROM THE FRENCH MILITARY RECORD, which dates the end of its own campaign. A surrender date is " +
          "the kind of fact an army records precisely, and it is also a French framing of an event the " +
          "other side would describe differently.",
      },
    ],
    media: [
      {
        url: commons("Blida (Algeria) - Béhanzin, former King of Dahomey.jpg"),
        sourcePageUrl: commonsPage("Blida (Algeria) - Béhanzin, former King of Dahomey.jpg"),
        fileName: "Blida (Algeria) - Béhanzin, former King of Dahomey.jpg",
        caption:
          "Béhanzin photographed at Blida in Algeria, where he was held after deportation. A PHOTOGRAPH, unlike the engravings of his predecessors — and a photograph of a deposed king in the custody of the power that deposed him, made for a French public.",
        kind: "image",
        shows: "portrait",
        identificationStatus: "secure",
        depictsActualRemains: false,
        verifiedIdentity: true,
        provenanceStatus: "resolved_at_seed",
        provenanceNotes: "NEEDS SOURCE VERIFICATION for photographer and exact date.",
        creditFrom: "source",
      },
      {
        url: commons("King Bihuazin (i.e. Béhanzin) of Dahomey, and His Two Wives (Standing on Porch)- French Government Prisoner in Martinique, Fort de France WDL269.png"),
        sourcePageUrl: commonsPage("King Bihuazin (i.e. Béhanzin) of Dahomey, and His Two Wives (Standing on Porch)- French Government Prisoner in Martinique, Fort de France WDL269.png"),
        fileName: "King Bihuazin (i.e. Béhanzin) of Dahomey, and His Two Wives (Standing on Porch)- French Government Prisoner in Martinique, Fort de France WDL269.png",
        caption:
          "Béhanzin with two of his wives on a porch at Fort-de-France, Martinique, described in the original caption as a French government prisoner. The deportation carried the household as well as the king, and the photograph is a colonial record of custody.",
        kind: "image",
        shows: "portrait",
        identificationStatus: "secure",
        depictsActualRemains: false,
        verifiedIdentity: true,
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Statue royale mi-homme mi-requin du roi Béhanzin, Musée du quai Branly.jpg"),
        sourcePageUrl: commonsPage("Statue royale mi-homme mi-requin du roi Béhanzin, Musée du quai Branly.jpg"),
        fileName: "Statue royale mi-homme mi-requin du roi Béhanzin, Musée du quai Branly.jpg",
        caption:
          "The royal statue of Béhanzin as a shark-man, photographed in Paris. Taken from Abomey by the French expedition of 1892 and returned to Bénin in 2021 — the same object, in two countries, in two centuries.",
        kind: "image",
        shows: "artefact",
        institution: "Musée du quai Branly – Jacques Chirac (at the time of the photograph)",
        creator: "Attributed to Sossa Dede",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Statue du roi Béhanzin-Musée du Quai Branly (9).jpg"),
        sourcePageUrl: commonsPage("Statue du roi Béhanzin-Musée du Quai Branly (9).jpg"),
        fileName: "Statue du roi Béhanzin-Musée du Quai Branly (9).jpg",
        caption:
          "Another view of the Béhanzin royal statue in the Paris collections. A second photograph of one object: useful for seeing it, and not a second piece of evidence about it.",
        kind: "image",
        shows: "artefact",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "agoli-agbo",
    title: "Agoli-Agbo, king under the French",
    summary:
      "Installed by France in 1894 as a subordinate ruler and deposed by France in 1900. The monarchy continued as an office of the colonial administration, and then did not.",
    description:
      "WHAT HAPPENED. With Béhanzin deported, the French installed Agoli-Agbo at Abomey. He was not an " +
      "independent king and the arrangement was not a restoration: he ruled by French permission, within " +
      "French purposes, and was deposed and exiled by the same authority in 1900.\n\n" +
      "WHY THE ARRANGEMENT EXISTED AT ALL. Because a conquering power without administrators uses the " +
      "structures it finds. A recognised king could collect, order and legitimate in ways a French officer " +
      "could not. The arrangement lasted exactly as long as it was useful.\n\n" +
      "WHAT IT MEANS FOR THE KING LIST. Agoli-Agbo is in it, and what follows him is not another king but " +
      "a colony. The independent monarchy ends in 1894; the office continues in a changed form; and royal " +
      "lineages, titles and ritual obligations at Abomey continue after that in yet another form, into the " +
      "present.\n\n" +
      "THE DISTINCTION THIS RECORD IS FOR. Between the END OF SOVEREIGNTY, the END OF AN OFFICE, and the " +
      "END OF A TRADITION. The first happened in 1894, the second in 1900, and the third did not happen: " +
      "royal families at Abomey maintain ritual responsibilities today. Collapsing these produces either " +
      "'the monarchy was destroyed' or 'the monarchy survived', and neither is right on its own.\n\n" +
      "THINGS TO ASK: When does a kingdom end — when it loses its war, its king, or its meaning?",
    category: "people",
    subcategory: "Rulers of Dahomey",
    eventType: "historical",
    tags: ["rulers", "dahomey", "colonialism", "france", "abomey", "sovereignty", "continuity"],
    people: ["Agoli-Agbo"],
    civilisations: ["Dahomey", "French Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "servicehistorique_dahomey",
        startYear: 1894,
        endYear: 1900,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Agoli-Agbo's period as king under French authority",
        originalDateText: "1894–1900",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "FROM THE COLONIAL ADMINISTRATIVE RECORD, which documents both his installation and his removal " +
          "because both were French decisions. The securest kind of date, recording the least " +
          "self-determined reign in the list.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // ABOMEY: BUILDING A ROYAL CAPITAL
  // -------------------------------------------------------------------------
  {
    slug: "abomey-palaces-three-centuries",
    title: "Abomey: three centuries of palace building",
    summary:
      "Each king built his own palace inside a growing earthen enclosure. The result is not one building but a sequence of reigns, laid out in adjoining compounds over about 44 hectares.",
    description:
      "HOW THE SITE GREW. From Houegbadja onwards, the custom was that a new king did not inherit his " +
      "predecessor's palace but built his own, adjoining it, inside the same great enclosure. Over twelve " +
      "reigns this produced a walled complex covering some forty-four hectares — a city of courtyards " +
      "rather than a castle.\n\n" +
      "WHAT IT WAS BUILT OF. Earth. Rammed and moulded, plastered, roofed in thatch and later in other " +
      "materials, decorated with polychrome bas-reliefs. Earth architecture on this scale needs constant " +
      "maintenance and it is vulnerable: to rain, to neglect, to fire, and — in 1984 — to a tornado.\n\n" +
      "WHAT THE PLAN DOES. It controls access, in graded stages. The outer spaces are public: assembly, " +
      "parade, audience. Beyond them are intermediate courts where officials, tribute and ceremony are " +
      "handled. Beyond those, the restricted areas of the royal household — where the palace women lived " +
      "and worked, and where outsiders did not go. And within all of it, the ancestral shrines and the " +
      "tombs of previous kings.\n\n" +
      "WHY THAT LAYOUT IS AN ARGUMENT. Because proximity to the king was the currency of Dahomean " +
      "politics, and the architecture converts it into distance. Who may go how far in is the political " +
      "system, built.\n\n" +
      "WHAT ELSE WAS INSIDE. Craft workshops, including smiths and the makers of appliqué; military and " +
      "administrative space; storage; and the apparatus of a large royal household.\n\n" +
      "THINGS TO ASK: If you wanted to know who had power in a palace, what would you measure?",
    category: "culture",
    subcategory: "Architecture",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["architecture", "abomey", "dahomey", "palace", "heritage", "royal-art", "women-and-power"],
    civilisations: ["Dahomey"],
    locationName: "Royal Palaces of Abomey, southern Bénin",
    lat: 7.185,
    lng: 1.99,
    imageUrl: commons("Palais royaux d'Abomey en 2020 03.jpg"),
    claims: [
      {
        sourceKey: "unesco_abomey_whc",
        startYear: 1645,
        endYear: 1900,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The building of the palace complex across successive reigns",
        originalDateText: "From the seventeenth century to the end of the independent monarchy",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY A RANGE RATHER THAN A DATE: a complex built by twelve kings over two and a half centuries " +
          "has no date of construction. The range runs from the reign traditionally credited with the " +
          "first palace to the end of the monarchy that maintained it, and both ends are soft.",
      },
      {
        sourceKey: "monroe_precolonial_state",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "What the palace plan shows about political access",
        originalDateText: "An archaeological reading of the layout, not a dated event",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT SUPPORTS IT: the physical sequence of enclosures, gates and courts, read as a system for " +
          "controlling who reaches whom. WHY IT IS A CLAIM RATHER THAN A DESCRIPTION: 'the architecture " +
          "encodes political access' is an interpretation, and a good one, but it is not what the walls " +
          "say — it is what an archaeologist says about the walls.",
      },
    ],
    media: [
      {
        url: commons("Palais royaux d'Abomey en 2020 03.jpg"),
        sourcePageUrl: commonsPage("Palais royaux d'Abomey en 2020 03.jpg"),
        fileName: "Palais royaux d'Abomey en 2020 03.jpg",
        caption:
          "The royal palaces of Abomey in 2020. What stands is the product of destruction in 1892, a tornado in 1984 and decades of conservation since — a heritage site rather than a nineteenth-century palace, and it should be read as the current state of a much-damaged place.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Royal Palaces of Abomey-133469.jpg"),
        sourcePageUrl: commonsPage("Royal Palaces of Abomey-133469.jpg"),
        fileName: "Royal Palaces of Abomey-133469.jpg",
        caption:
          "A view within the Royal Palaces of Abomey. The earthen walls and the graded sequence of courtyards are the physical form of the access system this record describes.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Royal Palaces of Abomey-133477.jpg"),
        sourcePageUrl: commonsPage("Royal Palaces of Abomey-133477.jpg"),
        fileName: "Royal Palaces of Abomey-133477.jpg",
        caption:
          "Another part of the Abomey palace site. Photographs of this complex are of a place that has been rebuilt more than once, and the distinction between original fabric and restoration is rarely visible in a picture.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Palais du roi Guézo - entrée du musée historique d'Abomey.jpg"),
        sourcePageUrl: commonsPage("Palais du roi Guézo - entrée du musée historique d'Abomey.jpg"),
        fileName: "Palais du roi Guézo - entrée du musée historique d'Abomey.jpg",
        caption:
          "The palace of Ghezo, now the entrance to the historical museum at Abomey. A royal compound that has become a museum is doing two jobs at once, and the second one changes how the first is presented.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "abomey-bas-reliefs",
    title: "The bas-reliefs: a wall that remembers",
    summary:
      "Polychrome earthen reliefs on the palace walls carry battles, rulers, animals, weapons, enemies and proverbs. They are a system of historical record kept in architecture.",
    description:
      "WHAT THEY ARE. Figures modelled in earth on the palace walls and painted — a king's emblem, an " +
      "enemy defeated, a weapon, an animal, a proverb rendered as an image. They are not decoration that " +
      "happens to show things. They are a REGISTER, and the court that built them expected them to be " +
      "read.\n\n" +
      "THE CHAIN THEY BELONG TO. A proverb is spoken. It attaches to a king as a praise name. The praise " +
      "name is condensed into an emblem. The emblem is carved into a wall, appliquéd onto a banner, forged " +
      "into a staff, and carried in a ceremony. ONE PIECE OF HISTORICAL INFORMATION EXISTS SIMULTANEOUSLY " +
      "AS SPEECH, IMAGE, OBJECT AND PERFORMANCE — and if any one channel is interrupted, the others still " +
      "carry it. That redundancy is the design.\n\n" +
      "WHAT THEY RECORD. Victories and the enemies defeated in them; the identity of each king; animals " +
      "carrying meanings; instruments of war and of rule. What survives is a court's account of itself, " +
      "which is exactly what any royal monument is anywhere.\n\n" +
      "THE PROBLEM WITH READING THEM. Earthen relief needs renewing. Reliefs have been repaired, " +
      "reconstructed and remade, and distinguishing an original from a restoration is specialist work that " +
      "a photograph does not do for you. A relief on the wall today is not necessarily a nineteenth-century " +
      "object, and dating one requires conservation records rather than looking.\n\n" +
      "WHAT THEY ARE NOT. Writing. They do not encode language. They are a mnemonic system that works for " +
      "people who already hold the tradition the images point at — which is why a visitor needs a guide, " +
      "and why the interpretation of individual panels depends on oral knowledge that is itself " +
      "transmitted.\n\n" +
      "THINGS TO ASK: How much history can a picture hold if the people looking at it already know the " +
      "story?",
    category: "culture",
    subcategory: "Royal art",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["royal-art", "abomey", "bas-reliefs", "oral-knowledge", "royal-symbolism", "architecture", "heritage"],
    civilisations: ["Dahomey"],
    locationName: "Royal Palaces of Abomey, southern Bénin",
    lat: 7.185,
    lng: 1.99,
    claims: [
      {
        sourceKey: "unesco_abomey_whc",
        startYear: 1700,
        endYear: 1892,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The making of the palace bas-reliefs during the independent kingdom",
        originalDateText: "Across the reigns of the eighteenth and nineteenth centuries",
        datingMethod: "archaeological",
        chronology: "historical",
        evidence:
          "WHY THIS IS A RANGE AND WHY IT IS SOFT AT THE EARLY END: reliefs were made, damaged and remade " +
          "continuously. The end date is the destruction of 1892, after which what exists is restoration " +
          "and reconstruction rather than court production.",
        notes:
          "NEEDS SOURCE VERIFICATION for the earliest surviving relief and for the conservation history, " +
          "which is what would let individual panels be dated rather than the tradition as a whole.",
      },
    ],
    media: [
      {
        url: commons("Royal Palaces of Abomey-133471.jpg"),
        sourcePageUrl: commonsPage("Royal Palaces of Abomey-133471.jpg"),
        fileName: "Royal Palaces of Abomey-133471.jpg",
        caption:
          "Wall decoration at the Royal Palaces of Abomey. Earthen relief of this kind has been renewed repeatedly, so what a photograph shows may be original fabric, restoration or reconstruction — and the picture alone cannot tell you which.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for which panel this is and for its conservation history, without " +
          "which it cannot be dated.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "royal-emblems-system",
    title: "Every king is an animal: the emblem system",
    summary:
      "Each ruler carried a symbol and a praise name that condensed a statement about his reign — Ghezo the buffalo, Glèlè the lion, Béhanzin the shark and the egg. The system is a way of storing history.",
    description:
      "HOW IT WORKED. On accession a king acquired a set of identifiers: an emblem, usually an animal or " +
      "object; a praise name or motto; and a strong proverb attached to them. These were then reproduced " +
      "everywhere the court produced anything — reliefs, banners, staffs, thrones, statues, songs.\n\n" +
      "WHAT THE EMBLEMS SAY. They are not portraits and not totems. They are ARGUMENTS ABOUT THE REIGN. " +
      "The buffalo of Ghezo is a heavy animal nobody crosses safely: a warning. The lion of Glèlè carries " +
      "a praise about a cub whose teeth have grown, which is a claim about succeeding a formidable father. " +
      "Béhanzin's shark and egg are a statement about a king holding the world, and a warning about what " +
      "happens if it is gripped too hard.\n\n" +
      "WHY THIS IS AN INFORMATION SYSTEM AND NOT DECORATION. A person who knows the emblems can identify " +
      "the reign a relief, a banner or a staff belongs to, and recover the claim that reign made about " +
      "itself — without reading anything. That is a serious historical technology, and it is the reason " +
      "so much can still be reconstructed about Dahomean kingship from objects scattered across foreign " +
      "museums.\n\n" +
      "THE CAUTION. Emblems as they are listed today come substantially through the ROYAL TRADITION as " +
      "recorded in the nineteenth and twentieth centuries, and through the objects that survived. " +
      "Attributions for the earlier kings are less secure than for the later ones, and tidiness in a " +
      "published list of twelve kings and twelve symbols should be treated as a sign of later " +
      "systematisation as much as of ancient practice.\n\n" +
      "THINGS TO ASK: What can a symbol store that a sentence cannot? What does it lose?",
    category: "culture",
    subcategory: "Royal symbolism",
    eventType: "historical",
    tags: ["royal-symbolism", "dahomey", "oral-knowledge", "royal-art", "proverbs", "kingship", "rulers"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "dahomean_royal_tradition",
        startYear: 1650,
        endYear: 1894,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The royal emblem system as a working institution",
        originalDateText: "Through the reigns of the independent kingdom",
        datingMethod: "oral_tradition",
        chronology: "traditional",
        evidence:
          "WHAT IS ESTABLISHED: that the system existed and was in full use in the nineteenth century, " +
          "where it is documented by surviving objects and by European description. WHAT IS NOT: how far " +
          "back it ran in this form. The emblems of the early kings are known through a tradition recorded " +
          "late, which is not the same as being attested early.",
      },
    ],
    media: [
      {
        url: commons("Symbole de Guezo roi du Dahomey au mur de la place Goho à Abomey au Bénin.jpg"),
        sourcePageUrl: commonsPage("Symbole de Guezo roi du Dahomey au mur de la place Goho à Abomey au Bénin.jpg"),
        fileName: "Symbole de Guezo roi du Dahomey au mur de la place Goho à Abomey au Bénin.jpg",
        caption:
          "A royal symbol on the wall at Place Goho in Abomey. The whole sequence of kings is displayed there in emblem form, which is the clearest single illustration of how the system worked: each reign identifiable at a glance by anybody who holds the tradition.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "king-as-his-animal",
    title: "Could a king be his animal? A documented belief, recorded as a belief",
    summary:
      "Dahomean royal tradition identifies a king with his emblem closely enough that the statue of Glèlè is a lion-man and that of Béhanzin a shark-man. This record sets out what is documented and what is not.",
    description:
      "WHAT IS DOCUMENTED. That the identification of king with animal was not loose metaphor. The court " +
      "produced large anthropomorphic figures in which the king IS the animal — Glèlè with a lion's head, " +
      "Béhanzin with a shark's — and the praise language treats the king and the emblem as a single " +
      "subject rather than comparing one to the other.\n\n" +
      "WHAT MUSEUM AND SCHOLARLY DESCRIPTION RECORDS. That the relationship, in the tradition, is one of " +
      "IDENTITY OR MANIFESTATION rather than resemblance: the king is spoken of as being the animal, " +
      "acting as it, and having its power available to him.\n\n" +
      "HOW THIS DATASET FILES IT. As DOCUMENTED ROYAL AND RELIGIOUS BELIEF. That is the accurate category, " +
      "and it is deliberately not two other things. It is NOT 'the king literally transformed into a " +
      "buffalo' — no such event is evidenced and this timeline does not assert one. And it is NOT a " +
      "debunking: the belief is a real, consequential, documented part of how this monarchy understood " +
      "itself, and deleting it because it is not physically true would remove the thing the whole royal " +
      "art system was built to say.\n\n" +
      "THE THREE LAYERS, KEPT APART. OBSERVABLE: objects, praise names and ceremonies identifying king " +
      "with animal survive and can be examined. TRADITION'S CLAIM: that the king possesses or manifests " +
      "the animal's nature and power. HISTORICAL STATUS: physical transformation is not established and " +
      "there is no evidence for it. All three of those statements are true at once, and a record that " +
      "carried only the first would be incomplete while one that asserted the second as fact would be " +
      "wrong.\n\n" +
      "THINGS TO ASK: What is the difference between a metaphor and an identity? How would you tell which " +
      "one a tradition means?",
    category: "religion",
    subcategory: "Royal belief",
    eventType: "traditional_account",
    identificationStatus: "modern_interpretation",
    tags: ["royal-symbolism", "religion", "kingship", "dahomey", "belief", "royal-art", "sacred-animals"],
    people: ["Ghezo", "Glèlè", "Béhanzin"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "dahomean_royal_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the identification of king with animal emerged as a belief",
        originalDateText: "Not established. Documented in the nineteenth century; earlier history unknown",
        datingMethod: "oral_tradition",
        chronology: "traditional",
        evidence:
          "WHY NO DATE: the belief is attested where the objects and the descriptions are, which is the " +
          "nineteenth century. That is when it is DOCUMENTED, not when it began, and there is no basis " +
          "here for saying anything about the second.",
      },
    ],
    media: [
      {
        url: commons("Statues royales, Abomey, Musée du quai Branly.jpg"),
        sourcePageUrl: commonsPage("Statues royales, Abomey, Musée du quai Branly.jpg"),
        fileName: "Statues royales, Abomey, Musée du quai Branly.jpg",
        caption:
          "The royal statues from Abomey together, photographed in Paris: the kings rendered as their emblems. The three figures are objects made by a court to state an identity between ruler and animal, and they are evidence for that statement — not for a transformation.",
        kind: "image",
        shows: "artefact",
        institution: "Musée du quai Branly – Jacques Chirac (at the time of the photograph)",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "Taken from Abomey in 1892; returned to Bénin in 2021. The photograph documents the Paris period.",
        creditFrom: "source",
      },
      {
        url: commons("Homme-requin Dahomey.jpg"),
        sourcePageUrl: commonsPage("Homme-requin Dahomey.jpg"),
        fileName: "Homme-requin Dahomey.jpg",
        caption:
          "The shark-man figure of Béhanzin. The body is a man's and the head is a shark's, without transition — the object does not show a man becoming an animal, it shows a king who is one.",
        kind: "image",
        shows: "artefact",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "gou-iron-figure",
    title: "The iron figure of Gou",
    summary:
      "A large iron figure of the vodun of iron and war, attributed to the smith Akati Ekplékendo and dated to about 1858. Seized by French forces and held in Paris ever since.",
    description:
      "THE OBJECT. A standing figure, about 165 centimetres high, forged and assembled in iron with wood, " +
      "representing GOU — the vodun of iron, tools, weapons and war. It is one of the most celebrated " +
      "objects of African art in any European collection, and it was made by a named artist, which is rare " +
      "for nineteenth-century West African sculpture.\n\n" +
      "THE MAKER. Akati Ekplékendo, reported to have been taken captive in a Dahomean campaign and brought " +
      "into the royal establishment, where he worked as a master smith under Glèlè. IF THAT ACCOUNT IS " +
      "RIGHT, one of the great works of this court was made by somebody the court had captured — which is " +
      "a fact about how Dahomean royal art was produced and not an incidental detail.\n\n" +
      "WHY IRON. Because the material is the subject. Gou is the power of iron; a figure of Gou made of " +
      "iron, by a smith, is not a depiction of a god so much as a statement in the god's own substance. " +
      "The chain connecting iron ore, smelting, blacksmiths, hoes, guns, warfare and royal power runs " +
      "straight through this object.\n\n" +
      "HOW IT LEFT. Seized by French forces in the 1890s campaign and taken to France, where it passed " +
      "through the Trocadéro ethnography museum and the Musée de l'Homme to the collections of the Musée " +
      "du quai Branly, displayed at the Pavillon des Sessions in the Louvre. It carries the inventory " +
      "number 71.1894.32.1 — and the 1894 in that number is the year it entered a French collection.\n\n" +
      "WHAT IS UNCERTAIN. Accounts differ on exactly where it was taken from and in what year. The record " +
      "notes this rather than choosing.\n\n" +
      "THINGS TO ASK: What does an inventory number record? Whose history is it a date in?",
    category: "culture",
    subcategory: "Royal art",
    eventType: "historical",
    evidenceStatus: "verified_physical_remains",
    identificationStatus: "secure",
    tags: ["royal-art", "metallurgy", "iron", "gou", "vodun", "museum-object", "looting", "restitution", "glele"],
    people: ["Akati Ekplékendo", "Glèlè"],
    civilisations: ["Dahomey"],
    locationName: "Made in Dahomey; now Paris",
    accessionNumber: "71.1894.32.1",
    remainsLocation: "Musée du quai Branly – Jacques Chirac, shown at the Pavillon des Sessions, Musée du Louvre, Paris",
    claims: [
      {
        sourceKey: "louvre_gou_sculpture",
        startYear: 1858,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "The making of the figure",
        originalDateText: "circa 1858; some catalogue wording gives 'before 1858'",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "WHAT THIS DATE RESTS ON: museum attribution, tied to the accession of Glèlè in 1858 and to the " +
          "smith's period of work. NOTE THE TWO FORMS: 'circa 1858' and 'before 1858' are different " +
          "statements, and the difference matters if the figure is being used to date the reign's art " +
          "rather than the other way round.",
        notes: "NEEDS SOURCE VERIFICATION for the museum's current catalogue wording.",
      },
      {
        sourceKey: "louvre_gou_sculpture",
        startYear: 1894,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "When the figure entered a French collection",
        originalDateText: "1894, from the inventory number 71.1894.32.1; the seizure is variously dated",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: an accession, which is an administrative act with paperwork. WHAT IS NOT: the " +
          "seizure, which accounts date differently and place differently. THE TWO ARE KEPT APART BECAUSE " +
          "A MUSEUM'S DATE IS A DATE IN THE MUSEUM'S HISTORY, and using it for the taking would " +
          "quietly convert a bureaucratic record into an account of an event.",
      },
    ],
    media: [
      {
        url: commons("Benin, fon, il dio gou protettore del ferro battuto e della guerra, ante 1858, artista akati ekplékendo, 01.JPG"),
        sourcePageUrl: commonsPage("Benin, fon, il dio gou protettore del ferro battuto e della guerra, ante 1858, artista akati ekplékendo, 01.JPG"),
        fileName: "Benin, fon, il dio gou protettore del ferro battuto e della guerra, ante 1858, artista akati ekplékendo, 01.JPG",
        caption:
          "The iron figure of Gou, attributed to Akati Ekplékendo, in its museum display. The figure is assembled from forged and sheet iron: the material is the point, because Gou is the power of iron itself.",
        kind: "image",
        shows: "museum_specimen",
        institution: "Musée du quai Branly – Jacques Chirac / Pavillon des Sessions, Musée du Louvre",
        creator: "Attributed to Akati Ekplékendo",
        objectDate: "circa 1858",
        accessionNumber: "71.1894.32.1",
        identificationStatus: "secure",
        verifiedIdentity: true,
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Benin, fon, il dio gou protettore del ferro battuto e della guerra, ante 1858, artista akati ekplékendo, 03.JPG"),
        sourcePageUrl: commonsPage("Benin, fon, il dio gou protettore del ferro battuto e della guerra, ante 1858, artista akati ekplékendo, 03.JPG"),
        fileName: "Benin, fon, il dio gou protettore del ferro battuto e della guerra, ante 1858, artista akati ekplékendo, 03.JPG",
        caption:
          "A closer view of the Gou figure, showing the worked iron surface and the assembly of sheet and forged elements. The file's own title gives the date as 'ante 1858' — before 1858 — where other descriptions say circa; the disagreement is preserved rather than resolved.",
        kind: "image",
        shows: "museum_specimen",
        institution: "Musée du quai Branly – Jacques Chirac / Pavillon des Sessions, Musée du Louvre",
        accessionNumber: "71.1894.32.1",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "hountondji-and-court-workshops",
    title: "The Hountondji smiths and the court workshops",
    summary:
      "A lineage of metalsmiths worked for the court at Abomey in iron, brass, copper and silver — including working imported European material into royal objects.",
    description:
      "WHO THEY WERE. The HOUNTONDJI, a lineage of metalworkers attached to the royal court at Abomey, " +
      "working iron, brass, copper and silver. Court craft in Dahomey was organised by lineage and by " +
      "attachment to the palace, which means the production of royal objects was an institution with " +
      "families in it rather than a trade practised at large.\n\n" +
      "WHAT THEY MADE. Royal regalia and objects of state — recades and staffs, silver and brass animals, " +
      "fittings, and elements of the asen memorial altars that carry so much of Dahomean ancestral memory. " +
      "The techniques included sheet-metal work and assembly as well as casting.\n\n" +
      "THE IMPORTED MATERIAL. Brass, copper and silver reaching this coast through the Atlantic trade were " +
      "worked into objects of Dahomean kingship. European coins, in particular, are reported as raw " +
      "material for royal silverwork. THE OBJECT THAT RESULTS IS NOT A EUROPEAN INFLUENCE ON AFRICAN ART — " +
      "it is African art consuming European material, which is the opposite relationship and is routinely " +
      "described the wrong way round.\n\n" +
      "WHAT THIS MEANS FOR DATING. An object made of imported metal cannot be older than the trade that " +
      "brought the metal, which occasionally gives a hard earliest-possible date where style alone gives " +
      "nothing. That is a real dating method and it is underused.\n\n" +
      "THINGS TO ASK: When a coin becomes a king's ornament, whose object is it?",
    category: "technology",
    subcategory: "Court craft",
    eventType: "historical",
    tags: ["royal-art", "metallurgy", "hountondji", "asen", "technology", "trade", "abomey", "silver"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "bay_asen_ancestors_vodun",
        startYear: 1700,
        endYear: 1900,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The Hountondji working for the court at Abomey",
        originalDateText: "Through the eighteenth and nineteenth centuries",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT SUPPORTS IT: surviving objects, European description of court craft, and the lineage's own " +
          "continuing tradition. WHY THE RANGE IS SOFT: the lineage's attachment to the court is an " +
          "institution with no recorded start, and objects securely attributable to it cluster in the " +
          "nineteenth century because that is what survived 1892.",
        notes: "NEEDS SOURCE VERIFICATION for the earliest documented Hountondji work.",
      },
    ],
    media: [
      {
        url: commons("Musée royal d'Afrique centrale - Récade (sceptre), Fon, Dahomey.JPG"),
        sourcePageUrl: commonsPage("Musée royal d'Afrique centrale - Récade (sceptre), Fon, Dahomey.JPG"),
        fileName: "Musée royal d'Afrique centrale - Récade (sceptre), Fon, Dahomey.JPG",
        caption:
          "A Fon récade — a royal staff of office from Dahomey — in a Belgian museum collection. The récade is a portable emblem: carried by an envoy, it identified whose authority he spoke with, which made the object itself a credential.",
        kind: "image",
        shows: "museum_specimen",
        institution: "Royal Museum for Central Africa, Tervuren",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for the object's date, maker and the circumstances by which it " +
          "reached a European collection — which for objects of this kind and period is rarely a neutral " +
          "matter.",
        creditFrom: "source",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE AGOJIE
  // -------------------------------------------------------------------------
  {
    slug: "where-did-the-agojie-come-from",
    title: "Where did the Agojie come from?",
    summary:
      "Three origin traditions compete: royal elephant huntresses, palace guards, and a corps founded by Hangbe. None is documented at the time, and they are not mutually exclusive.",
    description:
      "WHAT KIND OF RECORD IS THIS? A debate about origins, placed before the records of what the corps " +
      "became, because the popular accounts run the origins together into one confident story.\n\n" +
      "TRADITION ONE: THE GBETO. That the corps descends from the GBETO, women elephant hunters, either " +
      "formed by Houegbadja in the seventeenth century or existing before him and merely organised by him. " +
      "The strength of this version is that it explains a body of women already trained with weapons and " +
      "already in the king's service.\n\n" +
      "TRADITION TWO: THE PALACE. That armed women in the royal household — bodyguards inside a palace " +
      "where men could not remain overnight — expanded into a military formation. The strength of this " +
      "version is structural: a monarchy that excluded men from the inner palace at night needed somebody " +
      "armed inside it, and that requirement is documented.\n\n" +
      "TRADITION THREE: HANGBE. That the corps was founded by Queen Hangbe around 1716–1718. This is the " +
      "version most often repeated in popular accounts and in the publicity around the 2022 film. It is " +
      "attested in oral tradition, and it should not be leaned on to prove that Hangbe reigned — using an " +
      "uncertain foundation to support an uncertain reign, and the reign to support the foundation, is a " +
      "circle.\n\n" +
      "WHAT IS ACTUALLY DOCUMENTED. Armed women in Dahomean service appear in European reports from the " +
      "early eighteenth century, around Agaja's campaigns. The corps as a large standing military force is " +
      "documented from the nineteenth century, under Ghezo.\n\n" +
      "WHY THE THREE ARE NOT ALTERNATIVES. Hunters, palace guards and an expanded army could be three " +
      "stages of one institution. The traditions may be describing different moments in a long development " +
      "rather than competing for a single founding.\n\n" +
      "THINGS TO ASK: Why do institutions attract foundation stories? What does each of these three " +
      "stories make the corps be?",
    category: "history",
    subcategory: "Debate",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["debate", "agojie", "women-and-power", "dahomey", "military", "oral-knowledge", "hangbe", "houegbadja"],
    people: ["Hangbe", "Houegbadja", "Agaja"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "alpern_amazons_black_sparta",
        startYear: 1645,
        endYear: 1685,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The gbeto origin, in the reign of Houegbadja",
        originalDateText: "In Houegbadja's reign, c. 1645–1685 — or earlier, with Houegbadja merely organising existing groups",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHAT SUPPORTS IT: a tradition of women elephant hunters in royal service, and the plausibility " +
          "of a hunting corps becoming a fighting one. WHAT UNDERMINES IT AS A FOUNDING DATE: the same " +
          "tradition also says the gbeto pre-dated Houegbadja, in which case his reign is not an origin at " +
          "all but a reorganisation.",
      },
      {
        sourceKey: "dahomean_royal_tradition",
        startYear: 1716,
        endYear: 1718,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The Hangbe foundation, on the popular tradition",
        originalDateText: "1716–1718, founded by Queen Hangbe",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHAT SUPPORTS IT: oral tradition at Abomey, including in the lineage that maintains Hangbe's " +
          "memory. WHAT TO WATCH: this version is by far the most repeated in modern popular writing and " +
          "film publicity, and popularity is not attestation. IT MUST NOT BE USED AS EVIDENCE THAT HANGBE " +
          "REIGNED, because that reign is itself disputed and the two claims would then be propping each " +
          "other up.",
      },
      {
        sourceKey: "alpern_amazons_black_sparta",
        startYear: 1720,
        endYear: 1740,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest European reports of armed women in Dahomean service",
        originalDateText: "Around Agaja's campaigns of the 1720s and 1730s",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "THE ONLY CLAIM ON THIS RECORD THAT RESTS ON CONTEMPORARY DOCUMENTS. It is a latest-by date for " +
          "the existence of armed women in Dahomean service, and it says nothing about when the " +
          "institution began — only about when outsiders first wrote it down.",
        notes:
          "NEEDS SOURCE VERIFICATION for the specific European reports and their dates, which are the " +
          "hardest evidence available on this question and are reported here at second hand.",
      },
    ],
  },

  {
    slug: "agojie-under-ghezo",
    title: "Ghezo makes the Agojie an army",
    summary:
      "Under Ghezo the women's corps was expanded, budgeted and organised into a standing military force with its own regiments, weapons and command — reported at between about 1,000 and 6,000 at its peak.",
    description:
      "WHAT CHANGED. Under Ghezo, from 1818, the women's corps moved from a ceremonial and household " +
      "function to a serious military one: increased in numbers, given a budget, trained systematically, " +
      "and organised into specialist formations. THIS IS THE AGOJIE THAT EUROPEANS DESCRIBED AND THAT THE " +
      "WORLD REMEMBERS.\n\n" +
      "WHY GHEZO DID IT. Dahomey's population was not large and its wars were constant. A state that needs " +
      "soldiers and has run short of men has one obvious remaining source. The corps was an answer to a " +
      "manpower problem as well as an institution of the palace.\n\n" +
      "HOW IT WAS ORGANISED. Reported formations include gbeto (huntresses), gulohento (riflewomen), " +
      "nyekplohento (reapers, with blades), gohento (archers) and artillery. Command, drill, uniforms, " +
      "songs, insignia and ceremonial were all part of it.\n\n" +
      "RECRUITMENT. By several routes: volunteers, women placed into royal service by their families, " +
      "women assigned by the king, and captives. THE CORPS WAS NOT SIMPLY A CAREER FREELY ENTERED, and " +
      "descriptions of it as an early women's liberation movement do not survive contact with how it was " +
      "filled.\n\n" +
      "THE NUMBERS. Figures for the corps at its peak range from about a thousand to about six thousand in " +
      "the literature. That spread should be read as what it is: European estimates, made at different " +
      "dates, by observers with limited access and reasons to be impressed.\n\n" +
      "WHAT THEY WERE FOR. War, and war in this kingdom meant campaigns that produced captives, for sale " +
      "and for sacrifice. The Agojie were the instrument of a slave-raiding state. That is not a detraction " +
      "from their skill or discipline, and it is not separable from their history.\n\n" +
      "THINGS TO ASK: What does it take to build a standing army out of a population that has already been " +
      "drained by war?",
    category: "history",
    subcategory: "Military",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["agojie", "women-and-power", "military", "warfare", "ghezo", "dahomey", "slavery", "recruitment"],
    people: ["Ghezo"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    imageUrl: commons("FORBES(1851) p1.045 A AMAZON IN THE DAHOMEY ARMY - SEH-DONG-HONG-BEH.jpg"),
    claims: [
      {
        sourceKey: "alpern_amazons_black_sparta",
        startYear: 1818,
        endYear: 1858,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The expansion of the corps into a standing military force",
        originalDateText: "Under Ghezo, 1818–1858",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT SUPPORTS IT: European eyewitness description across the reign, including Forbes in 1849–50, " +
          "and the visible difference between earlier and later reports of the corps's size and role.",
      },
      {
        sourceKey: "alpern_amazons_black_sparta",
        startYear: 1840,
        endYear: 1892,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period for which peak strength figures of roughly 1,000 to 6,000 are reported",
        originalDateText: "Estimates ranging from about 1,000 to about 6,000 at the corps's height",
        datingMethod: "estimate",
        chronology: "historical",
        evidence:
          "WHY THE RANGE IS SO WIDE: because the figures are European estimates, made at different moments " +
          "by observers who saw parades rather than muster rolls. A SIXFOLD SPREAD IS NOT A MEASUREMENT " +
          "AND MUST NOT BE AVERAGED INTO ONE. The spread itself is the honest statement of what is known.",
        notes:
          "NEEDS SOURCE VERIFICATION for which figure comes from which observer and year — that " +
          "breakdown would turn a vague range into a set of dated, attributable claims, and it is the " +
          "single biggest improvement available to this record.",
      },
    ],
    media: [
      {
        url: commons("FORBES(1851) p1.045 A AMAZON IN THE DAHOMEY ARMY - SEH-DONG-HONG-BEH.jpg"),
        sourcePageUrl: commonsPage("FORBES(1851) p1.045 A AMAZON IN THE DAHOMEY ARMY - SEH-DONG-HONG-BEH.jpg"),
        fileName: "FORBES(1851) p1.045 A AMAZON IN THE DAHOMEY ARMY - SEH-DONG-HONG-BEH.jpg",
        caption:
          "Seh-Dong-Hong-Beh, named as an officer of the Dahomean women's army, as published in Forbes's book of 1851. AN ENGRAVING WORKED UP FROM A DRAWING, not a photograph — but one of very few nineteenth-century images of a NAMED Agojie, which makes it unusually valuable and still a European rendering.",
        kind: "image",
        shows: "later_artwork",
        institution: "British Library (digitised original)",
        creator: "After Frederick Edwyn Forbes",
        imageDate: "1851",
        objectDate: "1849–1851",
        subject: "Seh-Dong-Hong-Beh",
        identificationStatus: "probable",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "The name comes from the plate's own caption in Forbes. Whether the image is a likeness of a " +
          "particular woman, or a composite worked up by an engraver in London from a sketch, is not " +
          "established here.",
        creditFrom: "source",
      },
      {
        url: commons("Dahomey amazon1.jpg"),
        sourcePageUrl: commonsPage("Dahomey amazon1.jpg"),
        fileName: "Dahomey amazon1.jpg",
        caption:
          "A nineteenth-century image of a Dahomean woman soldier. Images of the Agojie circulated widely in Europe and were reproduced, redrawn and recaptioned repeatedly, so each one needs its own provenance before it can be treated as a record of anything.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "probable",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes: "NEEDS SOURCE VERIFICATION for artist, publication, date and whether it is drawn from life.",
        creditFrom: "source",
      },
      {
        url: commons("Amazones-Dahomey.jpg"),
        sourcePageUrl: commonsPage("Amazones-Dahomey.jpg"),
        fileName: "Amazones-Dahomey.jpg",
        caption:
          "A French depiction of Dahomean women soldiers. French images of the Agojie multiply around the wars of 1890 and 1892, when the corps became an enemy and a subject of public fascination at the same time.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "probable",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes: "NEEDS SOURCE VERIFICATION for publication and date.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "agojie-in-european-eyes",
    title: "\"Amazons\": what Europeans saw, and what they called it",
    summary:
      "Every substantial description of the corps was written by a European visitor. The name they gave it came from Greek myth, and the fascination it produced shaped what got recorded.",
    description:
      "THE EVIDENCE PROBLEM, STATED PLAINLY. Almost everything written about the Agojie in their own time " +
      "was written by European men who were in Dahomey to negotiate, trade or spy, who saw the corps on " +
      "parade rather than in barracks, who did not speak the language, and who were astonished. Their " +
      "astonishment is itself a distorting lens: what astonished them got recorded, and what did not, did " +
      "not.\n\n" +
      "THE NAME. 'Amazons', from Greek myth — a European classification applied to an African institution, " +
      "which carried with it a whole set of classical associations that had nothing to do with Dahomey. " +
      "The Fon terms are different and are not one term: AGOJIE, MINO, GBETO are used in the sources, and " +
      "reducing them all to 'Amazons' erases the distinctions the kingdom itself made.\n\n" +
      "WHAT THE EUROPEAN ACCOUNTS ARE GOOD FOR. Numbers on parade, weapons, drill, uniforms, songs, " +
      "ceremonies, named individuals, and the behaviour of the corps in specific engagements. Forbes in " +
      "1849–50 and Burton in 1863–64 are the fullest, and the French military accounts of 1890 and 1892 " +
      "are detailed about the corps in combat because it was killing their soldiers.\n\n" +
      "WHAT THEY ARE BAD FOR. Motivation, internal organisation, what the women thought, how they were " +
      "recruited in practice, and what the institution meant inside Dahomean society.\n\n" +
      "THE RULE THIS DATASET FOLLOWS. Every statement from these sources is recorded as 'X reported' " +
      "rather than as what happened, unless corroborated. That is not scepticism about the corps's " +
      "existence — the corps is not in doubt — it is accuracy about who is speaking.\n\n" +
      "THINGS TO ASK: If all the witnesses are astonished, what does the record look like afterwards?",
    category: "history",
    subcategory: "Sources",
    eventType: "historical",
    tags: ["agojie", "european-encounter", "primary-source", "method", "burton", "forbes", "historiography"],
    people: ["Frederick Edwyn Forbes", "Richard Francis Burton"],
    civilisations: ["Dahomey"],
    locationName: "Abomey and the coast",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "forbes_dahomey_1851",
        startYear: 1849,
        endYear: 1850,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Forbes's eyewitness observation of the corps",
        originalDateText: "1849 and 1850",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: the observation. Forbes reviewed and counted the corps, named individuals " +
          "including Seh-Dong-Hong-Beh, and published illustrations. He was also there to end the slave " +
          "trade and failed, which is the frame around everything he wrote.",
      },
      {
        sourceKey: "burton_mission_gelele_1864",
        startYear: 1863,
        endYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Burton's eyewitness observation of the corps",
        originalDateText: "1863–64",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: the observation. Burton's descriptions are detailed and his opinions are " +
          "contemptuous, and the two arrive in the same sentences. Reading him requires separating what he " +
          "SAW from what he thought about it, constantly.",
      },
    ],
    media: [
      {
        url: commons("Dahomey amazon2.jpg"),
        sourcePageUrl: commonsPage("Dahomey amazon2.jpg"),
        fileName: "Dahomey amazon2.jpg",
        caption:
          "A European image of a Dahomean woman soldier. The word 'Amazon' in the titles attached to pictures like this one is a European classification borrowed from Greek myth, and it travelled with the images into every later reproduction.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "probable",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes: "NEEDS SOURCE VERIFICATION for artist, publication and date.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "agojie-on-show-in-europe",
    title: "Agojie on show in Europe, 1891 onwards",
    summary:
      "Troupes billed as Dahomean Amazons toured European cities in ethnographic exhibitions. The posters and photographs from those tours are among the most reproduced images of the corps — and they are evidence about Europe.",
    description:
      "WHAT HAPPENED. From around 1890, groups of women billed as Dahomean Amazons appeared in European " +
      "ethnographic exhibitions — Völkerschauen — in Germany, France, Norway and elsewhere, performing " +
      "drills and dances for paying audiences. Posters advertised them; photographers made group portraits; " +
      "the images circulated widely.\n\n" +
      "WHY THIS RECORD EXISTS SEPARATELY. Because those images are constantly reproduced today as pictures " +
      "of the Dahomean army. They are not. They are pictures of a commercial exhibition in Europe, made " +
      "for a European public, at exactly the moment France was at war with Dahomey and public interest was " +
      "at its height.\n\n" +
      "WHAT IS UNKNOWN AND MATTERS. Whether the women in any particular troupe had served in the corps at " +
      "all. Some may have; impresarios had every commercial reason to claim they had; and the claim cannot " +
      "be checked from the poster. A CAPTION IS NOT PROVENANCE, and here the caption is advertising.\n\n" +
      "WHAT THE IMAGES ARE GOOD EVIDENCE FOR. European exhibition culture; the racial display industry of " +
      "the late nineteenth century; the public appetite that ran alongside a colonial war; and the way an " +
      "African institution became a European entertainment while it was being destroyed.\n\n" +
      "HOW THIS DATASET LABELS THEM. As what they are, in the caption, every time.\n\n" +
      "THINGS TO ASK: Who made this picture, for whom, and what were they selling?",
    category: "history",
    subcategory: "Display and spectacle",
    eventType: "historical",
    identificationStatus: "disputed",
    tags: ["agojie", "european-encounter", "spectacle", "colonialism", "images", "method", "racism"],
    civilisations: ["Dahomey"],
    locationName: "European cities including Frankfurt, Paris and Arendal",
    claims: [
      {
        sourceKey: null,
        startYear: 1891,
        endYear: 1900,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The European exhibition tours billed as Dahomean Amazons",
        originalDateText: "From about 1891, with posters surviving from Frankfurt in 1891 and later tours",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT DATES IT: the surviving posters and printed matter, which carry cities and years. THAT IS A " +
          "SECURE DATE FOR A SHOW, and no date at all for the women's biographies, which the posters do not " +
          "record.",
        notes:
          "NEEDS SOURCE VERIFICATION for the history of these tours: who organised them, how the " +
          "performers were recruited, and whether any can be shown to have served.",
      },
    ],
    media: [
      {
        url: commons("Völkerschau Amazonen Dahomey Frankfurt Main 1891 Plakat 2.jpg"),
        sourcePageUrl: commonsPage("Völkerschau Amazonen Dahomey Frankfurt Main 1891 Plakat 2.jpg"),
        fileName: "Völkerschau Amazonen Dahomey Frankfurt Main 1891 Plakat 2.jpg",
        caption:
          "A poster advertising a Dahomean Amazons exhibition in Frankfurt am Main, 1891. THIS IS ADVERTISING, not documentation: it is evidence for the European show business of human display, and it tells you nothing reliable about whether the performers had served in Dahomey's army.",
        kind: "image",
        shows: "later_artwork",
        imageDate: "1891",
        identificationStatus: "disputed",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "DELIBERATELY FILED AS DISPUTED IDENTIFICATION. The poster asserts that its subjects are " +
          "Dahomean Amazons; nothing here corroborates it, and the commercial motive to make the claim is " +
          "obvious.",
        creditFrom: "source",
      },
      {
        url: commons("Poster Dahomey Amazons in Arendal, Norway.png"),
        sourcePageUrl: commonsPage("Poster Dahomey Amazons in Arendal, Norway.png"),
        fileName: "Poster Dahomey Amazons in Arendal, Norway.png",
        caption:
          "A poster for a Dahomey Amazons appearance in Arendal, Norway. The reach of these tours — into small Norwegian towns — shows how completely the corps had been turned into a European attraction by the end of the century.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "disputed",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("COLLECTIE TROPENMUSEUM Groepsportret van de zogenaamde 'Amazones uit Dahomey' tijdens hun verblijf in Parijs TMnr 60038362.jpg"),
        sourcePageUrl: commonsPage("COLLECTIE TROPENMUSEUM Groepsportret van de zogenaamde 'Amazones uit Dahomey' tijdens hun verblijf in Parijs TMnr 60038362.jpg"),
        fileName: "COLLECTIE TROPENMUSEUM Groepsportret van de zogenaamde 'Amazones uit Dahomey' tijdens hun verblijf in Parijs TMnr 60038362.jpg",
        caption:
          "A group portrait made in Paris of a troupe described in the museum's own title as the SO-CALLED Amazons from Dahomey. The cataloguing institution itself flags the claim, which is the correct way to handle an image of this kind.",
        kind: "image",
        shows: "portrait",
        institution: "Tropenmuseum",
        accessionNumber: "TMnr 60038362",
        identificationStatus: "disputed",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "agojie-last-veterans",
    title: "The last veterans",
    summary:
      "Women who had served survived into the twentieth century and were photographed. What can responsibly be said about individuals is much less than what circulates.",
    description:
      "WHAT IS DOCUMENTED. Photographs exist that are captioned as survivors of Béhanzin's Amazons, and " +
      "women who had served in the corps lived into the twentieth century — the wars ended in 1894, so a " +
      "young soldier then could live for another six decades.\n\n" +
      "WHAT IS ROUTINELY ASSERTED AND NOT ESTABLISHED. Named 'last surviving Agojie' with specific death " +
      "dates circulate widely, usually without a citation that can be followed. Claims of this kind — the " +
      "last survivor of a famous thing — are exactly where documentation is thinnest and repetition is " +
      "heaviest, because the claim is attractive and hard to check.\n\n" +
      "WHAT THIS RECORD WILL NOT DO. Name a last veteran or give a death date. No such identification could " +
      "be verified from here, and a name in this dataset would be repeated as though it had been checked.\n\n" +
      "WHAT WOULD ESTABLISH IT. A dated interview, a photograph with contemporaneous documentation, an " +
      "administrative record, or a published ethnographic account naming the person and the circumstances. " +
      "Those may well exist — French colonial administrative records and mid-twentieth-century " +
      "ethnography are the places to look — and they are not in this dataset.\n\n" +
      "WHY THE RECORD EXISTS ANYWAY. Because the survival of veterans into the age of photography and " +
      "interview is a real and important fact about how close this history is, and because saying 'we " +
      "cannot name her' is more useful than naming somebody on the strength of a caption.\n\n" +
      "THINGS TO ASK: Why are 'last survivor' claims so common and so rarely sourced?",
    category: "people",
    subcategory: "Later lives",
    eventType: "historical",
    identificationStatus: "disputed",
    evidenceStatus: "unresolved",
    tags: ["agojie", "women-and-power", "memory", "photography", "method", "twentieth-century"],
    civilisations: ["Dahomey"],
    locationName: "Dahomey, under French colonial rule",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: null,
        startYear: 1894,
        endYear: 1960,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period in which women who had served were still living",
        originalDateText: "From the end of the wars into the twentieth century; no individual death date entered",
        datingMethod: "estimate",
        chronology: "historical",
        evidence:
          "WHAT SUPPORTS THE RANGE: simple demography — the corps was fighting in 1892 and its younger " +
          "members could live for decades — together with photographs captioned as showing survivors. " +
          "WHAT IS DELIBERATELY ABSENT: any named individual or death date, because none could be verified.",
        notes:
          "NEEDS BETTER SOURCING, specifically: French colonial records and twentieth-century ethnography " +
          "in Dahomey, which are where documented individual veterans would be found.",
      },
    ],
    media: [
      {
        url: commons("Les survivantes des Amazones de Behanzin (Dahomey).jpg"),
        sourcePageUrl: commonsPage("Les survivantes des Amazones de Behanzin (Dahomey).jpg"),
        fileName: "Les survivantes des Amazones de Behanzin (Dahomey).jpg",
        caption:
          "A photograph captioned as survivors of Béhanzin's Amazons. The caption is the only thing identifying the women, and this record does not treat it as established — but a photograph of women who may have fought in 1892, taken decades later, is a real and rare document either way.",
        kind: "image",
        shows: "portrait",
        identificationStatus: "disputed",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for photographer, date, place and the basis of the identification. " +
          "The picture is worth having and the caption is worth doubting, and both are recorded.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "the-woman-king-2022",
    title: "The Woman King (2022), and the argument it started",
    summary:
      "A Hollywood film about the Agojie brought the corps to a global audience and set off a public argument about Dahomey's part in the slave trade. Both the film and the argument belong in the record.",
    description:
      "WHAT HAPPENED. The Woman King, released in 2022, dramatised the Agojie under Ghezo. It was widely " +
      "seen, well reviewed, and followed immediately by a public controversy about its treatment of " +
      "Dahomey's role in the Atlantic slave trade.\n\n" +
      "THE SUBSTANCE OF THE ARGUMENT. Dahomey's wealth and military power were substantially built on " +
      "capturing people and selling them to European and Brazilian traders, and Ghezo in particular is " +
      "documented — by the British officer sent to persuade him otherwise — as defending that trade. " +
      "Critics argued that a film casting the kingdom's soldiers as liberators inverted the history. " +
      "Defenders argued that the film is a drama rather than a documentary, that it does depict the " +
      "kingdom's involvement, and that African historical subjects are held to standards of accuracy no " +
      "other popular cinema meets.\n\n" +
      "WHY IT BELONGS IN A HISTORICAL TIMELINE. Because a film is now, for most people in the world, the " +
      "primary source of what they know about this kingdom. THE RECEPTION OF HISTORY IS PART OF HISTORY, " +
      "and a dataset that records nineteenth-century European representations while ignoring a " +
      "twenty-first-century one would be applying a double standard.\n\n" +
      "WHAT THIS RECORD DOES NOT DO. Rule on the film. It records that it was made, that it was popular, " +
      "and that it produced a specific historical argument — and it points at the records in this dataset " +
      "where the underlying evidence sits: Ghezo's reply to Forbes, the Agojie's role in campaigns, the " +
      "revenue records, and the transition to palm oil.\n\n" +
      "THINGS TO ASK: What is a historical film for? What would it mean for one to be 'accurate'?",
    category: "culture",
    subcategory: "Reception",
    eventType: "historical",
    tags: ["agojie", "memory", "reception", "film", "slavery", "debate", "modern-benin"],
    civilisations: ["Dahomey"],
    locationName: "International release",
    claims: [
      {
        sourceKey: null,
        startYear: 2022,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The release of the film",
        originalDateText: "2022",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: a release, which is a documented commercial fact. WHAT IS NOT DATED BY IT: " +
          "anything about the nineteenth century. This record is about the film and its reception, and it " +
          "sits on the timeline in 2022 where it belongs.",
        notes: "NEEDS BETTER SOURCING for the controversy specifically: the historians who intervened and what they wrote.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // WOMEN, THE PALACE AND POWER
  // -------------------------------------------------------------------------
  {
    slug: "kpojito-and-the-palace-women",
    title: "The kpojito, and the women who ran the palace",
    summary:
      "Every king had a female counterpart, the kpojito, and the palace was staffed and administered by women. Dahomean government ran through institutions that had no European equivalent.",
    description:
      "THE OFFICE. Each king was paired with a KPOJITO — commonly translated 'queen mother', which is " +
      "misleading because she was not necessarily his mother and the office was not defined by " +
      "motherhood. She was installed with him, held her own establishment, and had standing in the " +
      "kingdom's politics in her own right.\n\n" +
      "THE STRUCTURE BEHIND IT. Dahomean government worked substantially through PAIRED OFFICES: a male " +
      "officeholder outside the palace and a female counterpart inside it, the second able to monitor and " +
      "check the first. The palace, where men did not remain at night, was staffed and run by women, and " +
      "the officials inside it were therefore women. A state's central administration was female-staffed, " +
      "not as an exception but as its design.\n\n" +
      "WHY IT IS EASY TO GET WRONG IN BOTH DIRECTIONS. Reading it as evidence that Dahomey was an " +
      "egalitarian society is wrong: the women in these positions held power within an autocratic " +
      "slave-holding monarchy, and many women in the palace were there without choice. Reading it as " +
      "merely decorative is equally wrong: these were offices with authority, and the documentary record " +
      "shows them being exercised.\n\n" +
      "WHAT IT CONNECTS TO. The Agojie are part of this structure rather than an oddity beside it. An " +
      "armed women's corps makes a different kind of sense in a monarchy whose interior administration was " +
      "already female.\n\n" +
      "THINGS TO ASK: What does it take to see an institution that has no equivalent in your own society?",
    category: "history",
    subcategory: "Women and power",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["women-and-power", "kpojito", "dahomey", "administration", "palace", "agojie", "institutions"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "bay_wives_of_the_leopard",
        startYear: 1700,
        endYear: 1894,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The kpojito and the paired-office system as working institutions",
        originalDateText: "Through the eighteenth and nineteenth centuries",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT SUPPORTS IT: European description of the court from the eighteenth century onwards, the " +
          "royal tradition's own lists of kpojito paired with kings, and the analysis of the system in " +
          "Bay's work. WHY IT IS A RANGE: an institution has a working life rather than a date, and its " +
          "origin is not established here.",
      },
    ],
    media: [
      {
        url: commons("Palais royaux d'Abomey en 2020 03.jpg"),
        sourcePageUrl: commonsPage("Palais royaux d'Abomey en 2020 03.jpg"),
        fileName: "Palais royaux d'Abomey en 2020 03.jpg",
        caption:
          "The royal palace site at Abomey. The inner areas of this complex were the working place of the palace women who staffed and administered the household, and men did not remain there overnight — a fact of the architecture as much as of the court.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE ROYAL CEREMONIES
  // -------------------------------------------------------------------------
  {
    slug: "annual-customs-xwetanu",
    title: "The Annual Customs (xwetanu)",
    summary:
      "The kingdom's yearly assembly at Abomey: tribute collected and redistributed, the royal dead served, the army reviewed, policy settled, and campaigns declared. Europeans called all of it the Customs.",
    description:
      "WHAT THE NAME COVERS, AND WHY THAT IS A PROBLEM. Europeans used 'the Annual Customs' for a cluster " +
      "of ceremonies and functions that the Fon terms — XWETANU, HUETANU — group differently, and that " +
      "were not one event. Reading the European name as the name of a single festival is the first error " +
      "to avoid.\n\n" +
      "WHAT ACTUALLY HAPPENED DURING IT. TRIBUTE came in from the provinces and GIFTS went out, in a " +
      "redistribution that was the fiscal centre of the kingdom's year. The ROYAL ANCESTORS were served — " +
      "the 'watering of the graves' of past kings, traced in tradition to Houegbadja. The ARMY was " +
      "reviewed and displayed, including the women's corps. DIGNITARIES met and the coming year was " +
      "discussed. JUSTICE was done. And CAMPAIGNS were declared, with the ceremonies falling before the " +
      "dry-season fighting.\n\n" +
      "AND HUMAN SACRIFICE. Victims were killed, in numbers that are argued about, as part of the service " +
      "of the royal dead. That is dealt with in its own records, with the evidence separated by type, " +
      "because it is the part of this subject where careless handling does the most damage.\n\n" +
      "WHY A STATE WOULD DO ALL THIS AT ONCE. Because it works. An event that collects revenue, pays " +
      "obligations to the ancestors, displays military strength, gathers the political class, settles " +
      "disputes and launches the campaign season is a government's entire year, compressed and made " +
      "visible.\n\n" +
      "WHERE THE DESCRIPTIONS COME FROM. Norris in 1772, Dalzel in 1793, Forbes in 1849–50, Burton in " +
      "1863–64 — every one a European visitor with a purpose, none of them a neutral witness, and " +
      "collectively the reason anything is known about the ceremonies in detail.\n\n" +
      "THINGS TO ASK: If your only descriptions of a ritual come from people who disapproved of it, what " +
      "can you still learn?",
    category: "culture",
    subcategory: "Royal ceremonial",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["annual-customs", "ritual", "ancestors", "dahomey", "tribute", "military", "abomey", "european-encounter"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "wikipedia_dahomey_navigation",
        startYear: 1730,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "The establishment of the Annual Customs in their documented form",
        originalDateText: "Largely established under Agaja, around 1730",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT THIS DATE RESTS ON: the association in the literature of the developed ceremonies with " +
          "Agaja's reign. WHAT IT DOES NOT MEAN: that royal ancestral ceremony began then. Tradition traces " +
          "the servicing of royal graves to Houegbadja, two generations earlier; what is dated here is the " +
          "large state occasion, not the rite at its centre.",
        notes: "NEEDS BETTER SOURCING: this date should be cited to a historian rather than a reference work.",
      },
      {
        sourceKey: "dahomean_royal_tradition",
        startYear: 1645,
        endYear: 1685,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The origin of the 'watering of the graves' of the royal dead",
        originalDateText: "Traced in tradition to Houegbadja",
        datingMethod: "oral_tradition",
        chronology: "traditional",
        evidence:
          "A SECOND AND EARLIER CLAIM, for a different thing: the ancestral rite rather than the state " +
          "occasion built around it. Keeping them apart is the point — a ceremony that grows over a " +
          "century has no single date, and picking one would hide the growth.",
      },
    ],
    media: [
      {
        url: commons("Royal Palaces of Abomey-133477.jpg"),
        sourcePageUrl: commonsPage("Royal Palaces of Abomey-133477.jpg"),
        fileName: "Royal Palaces of Abomey-133477.jpg",
        caption:
          "A courtyard within the royal palaces at Abomey. Spaces of this kind are where the Annual Customs were held — the tribute received, the army reviewed, the assemblies seated — and the graded sequence of courts is itself the record of who was allowed how close.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "grand-customs-royal-funerals",
    title: "The Grand Customs: what happened when a king died",
    summary:
      "A king's death brought funerary ceremonies on a far larger scale than the annual ones, including sacrifice. Ghezo's death in 1858 produced the most reported example.",
    description:
      "WHAT MADE THEM DIFFERENT. The Annual Customs happened every year. The GRAND CUSTOMS happened when a " +
      "king died, and were larger: the whole apparatus of royal ceremonial directed at installing a dead " +
      "king among the ancestors and a living one on the throne, with the wealth and the killing scaled " +
      "accordingly.\n\n" +
      "WHY A ROYAL FUNERAL WAS A POLITICAL EVENT. Because succession is the moment a monarchy is most " +
      "vulnerable. A funeral that displays overwhelming resources, gathers every officeholder, and " +
      "establishes the dead king's place among the ancestors is also the new king's first demonstration " +
      "that he can command all of it.\n\n" +
      "THE RELIGIOUS LOGIC AS REPORTED. That the dead king required a household and attendants in the " +
      "world of the ancestors, and that people killed at the ceremonies went as MESSENGERS — carrying word " +
      "to the royal dead. That is how the sources report the practice being explained within Dahomey, and " +
      "it is recorded here as the reported religious understanding rather than as this timeline's " +
      "explanation of it.\n\n" +
      "GHEZO'S DEATH IN 1858. The best-documented case, because Europeans were present in the kingdom and " +
      "reporting home, and because the scale of the expected Grand Customs became a subject of British " +
      "diplomatic and parliamentary attention. What was ALLEGED about them, and what is actually " +
      "established, are separated in the next records — and that separation is the most important thing " +
      "in this part of the dataset.\n\n" +
      "THINGS TO ASK: Why is the death of a ruler dangerous? What is a funeral for, politically?",
    category: "culture",
    subcategory: "Royal ceremonial",
    eventType: "historical",
    tags: ["grand-customs", "ritual", "ancestors", "sacrifice", "dahomey", "succession", "ghezo", "glele"],
    people: ["Ghezo", "Glèlè"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "burton_mission_gelele_1864",
        startYear: 1858,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Ghezo's death, and the Grand Customs that followed",
        originalDateText: "1858",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS SECURE: the death, and that Grand Customs followed. WHAT IS NOT: their scale, which is " +
          "the subject of the allegation record and is not established by the fact that the ceremonies " +
          "took place.",
      },
    ],
    media: [
      {
        url: commons("Gezo (2).jpg"),
        sourcePageUrl: commonsPage("Gezo (2).jpg"),
        fileName: "Gezo (2).jpg",
        caption:
          "A nineteenth-century European depiction of Ghezo, whose death in 1858 produced the best-reported Grand Customs of any Dahomean king. AN ENGRAVING RATHER THAN A PHOTOGRAPH, and a European rendering of a king it never shows at the ceremonies this record is about.",
        kind: "image",
        shows: "later_artwork",
        identificationStatus: "probable",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for artist, publication and date.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "human-sacrifice-what-is-documented",
    title: "Human sacrifice in Dahomey: what is actually documented",
    summary:
      "That people were killed in Dahomey's royal ceremonies is established by multiple independent eyewitnesses. Almost everything else about it — numbers above all — is not.",
    description:
      "WHAT IS ESTABLISHED, AND THIS RECORD DOES NOT SOFTEN IT. Human sacrifice was part of Dahomean royal " +
      "ceremonial. People were killed at the Annual Customs and, on a larger scale, at the Grand Customs " +
      "following a king's death. This is reported by multiple European eyewitnesses across more than a " +
      "century, by observers with different purposes and different biases, and it is corroborated by " +
      "Dahomean tradition. It is not a colonial invention.\n\n" +
      "WHO THE VICTIMS WERE, AS REPORTED. Principally WAR CAPTIVES, and CONDEMNED CRIMINALS. That is what " +
      "the sources say and it connects the ceremonies directly to the kingdom's warfare: campaigns " +
      "produced captives, and captives were sold, retained or killed.\n\n" +
      "HOW IT WAS UNDERSTOOD, AS REPORTED. As service to the royal ancestors, with the dead sent as " +
      "messengers to them. Recorded here as the reported understanding within Dahomey.\n\n" +
      "SIX KINDS OF EVIDENCE THAT MUST NOT BE MERGED, and merging them is how this subject goes wrong:\n" +
      "  A. THE DOCUMENTED OCCURRENCE of the practice — well supported.\n" +
      "  B. AN EYEWITNESS COUNT — somebody present, counting. Rare, and the best evidence there is.\n" +
      "  C. A SECOND-HAND REPORT — somebody told somebody. Common, and much weaker.\n" +
      "  D. A DIPLOMATIC OR NEWSPAPER ALLEGATION — a figure in circulation, often with no traceable origin.\n" +
      "  E. COLONIAL PROPAGANDA — a figure deployed to justify intervention.\n" +
      "  F. A MODERN HISTORIAN'S ESTIMATE — reasoned from the evidence, and still an estimate.\n\n" +
      "THE STANDARD FAILURE. A figure that begins life in category D is quoted in a book, repeated, and " +
      "ends up read as category B. This dataset files the famous numbers where they actually belong.\n\n" +
      "THE OTHER FAILURE, EQUALLY BAD. Concluding that because the numbers were inflated for political " +
      "purposes, nothing happened. The inflation is real AND the practice is real, and both have to be " +
      "held.\n\n" +
      "THINGS TO ASK: How would you count something like this? Who was in a position to, and what did they " +
      "want the answer to be?",
    category: "history",
    subcategory: "Royal ceremonial",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["sacrifice", "ritual", "dahomey", "annual-customs", "method", "slavery", "warfare", "primary-source"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "norris_bossa_ahadee_1789",
        startYear: 1772,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Norris's eyewitness account of royal ceremonial at Abomey",
        originalDateText: "1772, published 1789",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "CATEGORY B AND E AT ONCE, which is why it is hard. Norris was present in 1772 and describes what " +
          "he saw — and he published in 1789, gave evidence against abolition, and his descriptions of " +
          "Dahomean violence served an argument that the slave trade rescued people from it. The eyewitness " +
          "status and the motive are both real and neither cancels the other.",
      },
      {
        sourceKey: "forbes_dahomey_1851",
        startYear: 1850,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Forbes's eyewitness account of sacrifices at the Customs",
        originalDateText: "1850",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "CATEGORY B: an eyewitness, counting. Forbes's figures for the ceremonies he attended are far " +
          "lower than the numbers circulating in Britain at the time, which is the most useful thing about " +
          "them: a man campaigning against Dahomey's slave trade had every reason to report a high figure " +
          "and did not.",
        notes:
          "NEEDS SOURCE VERIFICATION for Forbes's actual figures, which should be entered as their own " +
          "claims with his wording. This is the most valuable single improvement available to this record.",
      },
      {
        sourceKey: "burton_mission_gelele_1864",
        startYear: 1864,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Burton's eyewitness account of the Customs",
        originalDateText: "1863–64",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "CATEGORY B, FROM THE MOST HOSTILE WITNESS IN THE DATASET — and he too reports figures lower " +
          "than those in general circulation. When a contemptuous observer deflates an atrocity number, " +
          "that is evidence worth weighing.",
      },
    ],
    media: [
      {
        url: commons("Victims for sacrifice-1793.jpg"),
        sourcePageUrl: commonsPage("Victims for sacrifice-1793.jpg"),
        fileName: "Victims for sacrifice-1793.jpg",
        caption:
          "An engraving of 1793 depicting victims for sacrifice in Dahomey. AN ENGRAVING, NOT A PHOTOGRAPH, made for a British publication during the abolition debate — it is evidence of how the practice was PICTURED for a British readership with an argument to win, and it is not a record of a scene anyone drew from life.",
        kind: "image",
        shows: "later_artwork",
        imageDate: "1793",
        objectDate: "1793",
        identificationStatus: "modern_interpretation",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "PUBLISHED IN THE CONTEXT OF THE ABOLITION CONTROVERSY. Images of this kind were used on both " +
          "sides of that argument, and a reader should know which publication this came from before " +
          "treating it as descriptive. NEEDS SOURCE VERIFICATION for engraver and volume.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "how-many-were-sacrificed",
    title: "How many people were sacrificed?",
    summary:
      "Figures from a handful to two thousand circulate. This record files the famous numbers by what kind of evidence each actually is, and does not produce a total.",
    description:
      "WHAT KIND OF RECORD IS THIS? A debate about numbers, and a demonstration of why a single figure " +
      "would be worse than none.\n\n" +
      "THE 1860 ALLEGATION. British reports and parliamentary discussion around 1860 carried the claim " +
      "that as many as two thousand people might be sacrificed at the Grand Customs for Ghezo. THAT " +
      "SENTENCE — 'a British report alleged that two thousand might be sacrificed' — IS A HISTORICAL FACT " +
      "ABOUT A BRITISH REPORT. The sentence 'two thousand people were sacrificed' is a different claim " +
      "entirely, requires independent evidence, and cannot be derived from the first.\n\n" +
      "WHAT THE EYEWITNESSES SAY. Forbes and Burton, both present at ceremonies, report figures very much " +
      "lower than the numbers in public circulation in Britain. They disagree with the allegations, from " +
      "the stronger evidential position, and they had no motive to minimise.\n\n" +
      "WHY THE BIG NUMBERS EXISTED ANYWAY. Because they were useful. An enormous figure supported the case " +
      "for naval intervention, for pressure on Dahomey, and eventually for conquest. THAT DOES NOT MAKE " +
      "THEM FABRICATED — it makes them claims with an interest attached, which is a reason to ask for " +
      "their sourcing and usually to find none.\n\n" +
      "THE RANGE THAT CAN HONESTLY BE STATED. That people were killed at the annual ceremonies, in numbers " +
      "an eyewitness could count; that the Grand Customs for a dead king were larger; and that beyond that " +
      "the figures are contested and the highest ones are allegations rather than counts.\n\n" +
      "WHAT THIS RECORD REFUSES TO DO. Give a total. There is no defensible one, and supplying a figure to " +
      "satisfy the question would be doing exactly what the nineteenth-century pamphlets did.\n\n" +
      "THINGS TO ASK: Where did this number come from? Who first wrote it down, and what did they want?",
    category: "history",
    subcategory: "Debate",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["debate", "sacrifice", "dahomey", "method", "colonialism", "propaganda", "british", "numbers"],
    civilisations: ["Dahomey"],
    locationName: "Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: null,
        startYear: 1860,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "The British allegation that up to two thousand might be sacrificed at Ghezo's Grand Customs",
        originalDateText: "Around 1860: British reporting and parliamentary discussion cited figures up to 2,000",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED AND WHAT IS NOT. DATED: that this figure was in British circulation around 1860 — " +
          "an allegation with a date, which is a real historical object. NOT DATED, NOT ESTABLISHED, AND " +
          "NOT ASSERTED ANYWHERE IN THIS DATASET: that two thousand people were killed. No eyewitness " +
          "count supports it; the eyewitnesses who were present report far fewer.",
        notes:
          "NEEDS SOURCE VERIFICATION, urgently and specifically: the exact parliamentary paper or " +
          "despatch, its author and its own stated source. A figure whose origin cannot be traced is the " +
          "definition of the problem this record exists to describe.",
      },
      {
        sourceKey: "burton_mission_gelele_1864",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "How many people were killed in Dahomey's royal ceremonies",
        originalDateText: "Not established. Eyewitness counts are far lower than circulating allegations",
        datingMethod: "estimate",
        chronology: "disputed",
        evidence:
          "WHY THIS CLAIM CARRIES NO POSITION AND NO NUMBER: because the honest answer is a disagreement " +
          "rather than a figure. Eyewitness observation, second-hand report, diplomatic allegation and " +
          "propaganda all produced numbers, they do not agree, and the ones furthest from the evidence are " +
          "the largest.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE FRANCO-DAHOMEAN WARS
  // -------------------------------------------------------------------------
  {
    slug: "first-franco-dahomean-war",
    title: "The First Franco-Dahomean War, 1890",
    summary:
      "Fighting over French claims at Cotonou and Porto-Novo. Dahomey attacked Cotonou in March and fought at Atchoukpa in April; a treaty in October conceded Cotonou.",
    description:
      "WHAT IT WAS ABOUT. France had a protectorate over Porto-Novo and a foothold at Cotonou, and read " +
      "earlier agreements as ceding sovereignty there. Dahomey did not. Beneath the legal dispute was the " +
      "ordinary substance of the period: a European power converting trading positions into territory.\n\n" +
      "THE FIGHTING. A large Dahomean attack on Cotonou on 4 March 1890 was repulsed after hard fighting. " +
      "On 20 April a French force under Colonel Terrillon, briefly assisted by warriors of King Toffa of " +
      "Porto-Novo, fought a much larger Dahomean force at ATCHOUKPA. French accounts give the Dahomean " +
      "strength as around seven thousand warriors and two thousand Agojie — FRENCH ESTIMATES, made by men " +
      "being attacked, and to be read as such.\n\n" +
      "HOW IT ENDED. A treaty on 3 October 1890, recognising the French protectorate over Porto-Novo and " +
      "conceding Cotonou. Both sides then spent two years buying weapons.\n\n" +
      "WHAT THE WAR SHOWED. That Dahomey could not be beaten quickly, and that its army — including the " +
      "women's corps, in combat against European troops with modern rifles — would fight. French accounts " +
      "of the Agojie after 1890 are written by soldiers who had faced them.\n\n" +
      "THE SOURCES, AND THEIR SIDE. Almost everything detailed about these engagements comes from the " +
      "French military record. It is precise about dates, units and casualties, and it is the account of " +
      "one belligerent.\n\n" +
      "THINGS TO ASK: When a treaty ends a war that both sides then prepare to fight again, what did the " +
      "treaty do?",
    category: "history",
    subcategory: "Warfare",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["warfare", "france", "colonialism", "behanzin", "agojie", "cotonou", "porto-novo", "resistance"],
    people: ["Béhanzin", "Toffa I"],
    civilisations: ["Dahomey", "France"],
    locationName: "Cotonou and the Ouémé, southern Bénin",
    lat: 6.36,
    lng: 2.42,
    claims: [
      {
        sourceKey: "servicehistorique_dahomey",
        startYear: 1890,
        startMonth: 2,
        startDay: 21,
        endYear: 1890,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The First Franco-Dahomean War",
        originalDateText: "21 February – 4 October 1890",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "FROM THE FRENCH MILITARY RECORD, which dates its own campaigns to the day. A campaign's opening " +
          "and closing dates are administrative facts of the army that fought it, and the other side would " +
          "not necessarily have drawn the boundaries in the same places.",
      },
      {
        sourceKey: "servicehistorique_dahomey",
        startYear: 1890,
        startMonth: 3,
        startDay: 4,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Dahomean attack on Cotonou",
        originalDateText: "4 March 1890",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "FRENCH CONTEMPORARY MILITARY REPORTING of an action its own garrison fought, which is why the date is exact. WHAT THE SAME SOURCE IS WEAKER ON: the size of the attacking force and its losses, both of which are estimates made by men under attack rather than counts.",
      },
      {
        sourceKey: "servicehistorique_dahomey",
        startYear: 1890,
        startMonth: 4,
        startDay: 20,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Battle of Atchoukpa",
        originalDateText: "20 April 1890",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "FRENCH MILITARY RECORD. The force figures that travel with this date — about 7,000 Dahomean " +
          "warriors and 2,000 Agojie against some 350 French troops and 500 of Toffa's — are FRENCH " +
          "ESTIMATES OF AN ENEMY, made under attack. They are the only figures available and they are not " +
          "a count.",
      },
      {
        sourceKey: "servicehistorique_dahomey",
        startYear: 1890,
        startMonth: 10,
        startDay: 3,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The treaty ending the first war",
        originalDateText: "3 October 1890",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "A DOCUMENT WITH A DATE ON IT — the securest kind of evidence in this dataset, and a text whose " +
          "meaning the two parties understood differently, which is why there was a second war.",
      },
    ],
  },

  {
    slug: "second-franco-dahomean-war",
    title: "The Second Franco-Dahomean War, 1892–94",
    summary:
      "A French column under Dodds fought up the Ouémé through a series of battles, took Abomey in November 1892, and pursued Béhanzin until his surrender in January 1894.",
    description:
      "HOW IT STARTED. Both sides had rearmed. In 1892 Dahomean forces attacked villages near Grand-Popo " +
      "and Porto-Novo, asserting older boundaries; France mounted a full expedition under Colonel — later " +
      "General — Alfred-Amédée Dodds.\n\n" +
      "THE CAMPAIGN. A column moving inland along the Ouémé, fighting a series of engagements from " +
      "September 1892 — Dogba, Poguessa, Adegon, Cana among them — against an army that fought hard and " +
      "included the women's corps, and that was destroyed piece by piece by artillery, repeating rifles " +
      "and machine guns.\n\n" +
      "WHY THE OUTCOME WAS NOT IN DOUBT ONCE IT BEGAN. Not courage, and not tactics. FIREPOWER. A force " +
      "with modern breech-loading rifles, quick-firing artillery and machine guns against one with a " +
      "mixture of imported weapons was not an even contest, and the French casualty returns beside the " +
      "Dahomean losses show it.\n\n" +
      "ABOMEY. The capital fell in November 1892. Béhanzin BURNED THE PALACES rather than surrender them, " +
      "and withdrew to continue the war in the country. What the French then took from the site — and " +
      "what survived the fire — is the subject of the looting record.\n\n" +
      "THE END. More than a year of pursuit, and Béhanzin's surrender on 15 January 1894. France installed " +
      "Agoli-Agbo, and Dahomey became a French colony.\n\n" +
      "THE AGOJIE IN THIS WAR. They fought, they were reported by the French as among the most determined " +
      "of their opponents, and they were killed in large numbers. The corps did not survive the war as an " +
      "institution.\n\n" +
      "THINGS TO ASK: What does it mean that the best records of an army's destruction were kept by the " +
      "army that destroyed it?",
    category: "history",
    subcategory: "Warfare",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["warfare", "france", "colonialism", "behanzin", "agojie", "abomey", "resistance", "dodds"],
    people: ["Béhanzin", "Alfred-Amédée Dodds"],
    civilisations: ["Dahomey", "France"],
    locationName: "The Ouémé valley and Abomey, southern Bénin",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "servicehistorique_dahomey",
        startYear: 1892,
        startMonth: 7,
        startDay: 4,
        endYear: 1894,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Second Franco-Dahomean War",
        originalDateText: "4 July 1892 – 15 January 1894",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "FRENCH MILITARY RECORD, dating its own campaign at both ends. A CAMPAIGN'S BOUNDARIES ARE AN ADMINISTRATIVE FACT OF THE ARMY THAT FOUGHT IT: Dahomey would not necessarily have dated the war from the same day, and the surrender date is the date France accepted one.",
      },
      {
        sourceKey: "servicehistorique_dahomey",
        startYear: 1892,
        startMonth: 9,
        startDay: 14,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The French force assembling at Dogba on the Ouémé",
        originalDateText: "14 September 1892, some 80 kilometres upriver",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "FRENCH CONTEMPORARY MILITARY REPORTING of its own movements, which is where almost all the campaign's detail comes from. THE ASYMMETRY IS WORTH SEEING: French positions and dates are recorded to the day, and the Dahomean side of the same engagements survives mainly as what the French could observe of it.",
      },
      {
        sourceKey: "servicehistorique_dahomey",
        startYear: 1892,
        startMonth: 11,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The fall of Abomey and the burning of the palaces",
        originalDateText: "November 1892",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS SECURE: that Abomey fell in November 1892 and that the palaces burned. WHAT VARIES " +
          "BETWEEN ACCOUNTS: the exact days, and how much of the destruction was Béhanzin's deliberate " +
          "firing and how much was the fighting. The claim is entered to the month for that reason.",
      },
    ],
    media: [
      {
        url: commons("Dahomey. 2, Béhanzin - (mission) d'Albéca ; (photogr. reprod. par) Molteni (pour la conférence donnée par) d'Albéca - btv1b53231324s.jpg"),
        sourcePageUrl: commonsPage("Dahomey. 2, Béhanzin - (mission) d'Albéca ; (photogr. reprod. par) Molteni (pour la conférence donnée par) d'Albéca - btv1b53231324s.jpg"),
        fileName: "Dahomey. 2, Béhanzin - (mission) d'Albéca ; (photogr. reprod. par) Molteni (pour la conférence donnée par) d'Albéca - btv1b53231324s.jpg",
        caption:
          "Béhanzin, in an image from the d'Albéca mission reproduced by Molteni as a projection slide for a public lecture. It is a French colonial lecture illustration about an enemy — made to be shown to an audience in France while the conquest was being justified to them.",
        kind: "image",
        shows: "later_artwork",
        institution: "Bibliothèque nationale de France (digitised original)",
        identificationStatus: "probable",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for the date of the underlying photograph and for whether it was taken from life.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "looting-of-abomey-1892",
    title: "What the French took from Abomey",
    summary:
      "Thrones, doors, statues, regalia and religious objects were removed from Abomey by the expedition of 1892 and entered French museums, where most remained for more than a century.",
    description:
      "WHAT WAS TAKEN. Royal thrones; carved palace doors; the large anthropomorphic statues of Ghezo, " +
      "Glèlè and Béhanzin; recades; appliqué work; religious objects. The material went to France as the " +
      "spoils of General Dodds's campaign, was exhibited from 1893 at the Musée d'Ethnographie du " +
      "Trocadéro, and passed later into the Musée du quai Branly – Jacques Chirac, which opened in 2006.\n\n" +
      "WHY SO MUCH SURVIVED. Because it was taken. That is an uncomfortable sentence and it is part of the " +
      "picture: the palaces burned, and a substantial part of what is now known about nineteenth-century " +
      "Dahomean court art is known from objects that were removed before, during or after the fire. IT IS " +
      "NOT AN ARGUMENT FOR THE TAKING. It is a fact about why the evidence is where it is.\n\n" +
      "WHAT THE OBJECTS LOST. Context. A throne in a Paris gallery is separated from the compound it stood " +
      "in, the ceremonies it was used in, the people who maintained it and the knowledge that explained it. " +
      "Much of the interpretation of these objects in European museums was subsequently reconstructed from " +
      "oral tradition in Bénin — the knowledge and the objects had to be reunited across a continent.\n\n" +
      "WHAT HAPPENED NEXT, EVENTUALLY. Twenty-six of these objects were returned to Bénin in 2021, under a " +
      "French law passed for the purpose. That has its own record.\n\n" +
      "THINGS TO ASK: Who is a museum object evidence for? Does that change when it goes home?",
    category: "history",
    subcategory: "Looting and collections",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["looting", "restitution", "royal-art", "france", "colonialism", "abomey", "museum-object", "heritage"],
    people: ["Alfred-Amédée Dodds", "Béhanzin"],
    civilisations: ["Dahomey", "France"],
    locationName: "Abomey, and Paris",
    lat: 7.19,
    lng: 1.99,
    claims: [
      {
        sourceKey: "quai_branly_restitution",
        startYear: 1892,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The removal of royal objects from Abomey",
        originalDateText: "1892, as the spoils of General Dodds's campaign",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "FROM THE HOLDING MUSEUM'S OWN ACCOUNT OF ITS COLLECTION'S ORIGIN — which is the strongest kind " +
          "of provenance evidence and also an institution describing how it came to hold something.",
      },
      {
        sourceKey: "quai_branly_restitution",
        startYear: 1893,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The objects going on display in Paris",
        originalDateText: "Exhibited from 1893 at the Musée d'Ethnographie du Trocadéro",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: an exhibition. Kept separate from the seizure because the gap between taking " +
          "something and displaying it is where an object becomes a specimen, and that transformation has " +
          "a date of its own.",
      },
    ],
    media: [
      {
        url: commons("Statues royales, Abomey, Musée du quai Branly.jpg"),
        sourcePageUrl: commonsPage("Statues royales, Abomey, Musée du quai Branly.jpg"),
        fileName: "Statues royales, Abomey, Musée du quai Branly.jpg",
        caption:
          "The royal statues from Abomey in the Musée du quai Branly in Paris, where they stood for more than a century after the expedition of 1892. A photograph of what was taken, in the place it was taken to.",
        kind: "image",
        shows: "artefact",
        institution: "Musée du quai Branly – Jacques Chirac (at the time of the photograph)",
        identificationStatus: "secure",
        provenanceNotes:
          "Transferred to Bénin in 2021; the photograph records the Paris period.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },
];

export const BENIN_DAHOMEY_LINKS: SeedEventLink[] = [
  {
    from: "dahomey-foundation-question",
    to: "dans-belly-foundation-story",
    relation: "related",
    viewpoint: "oral_tradition",
    note: "The debate about when the kingdom began, and the story the kingdom told about how it began.",
  },
  {
    from: "dans-belly-foundation-story",
    to: "dakodonou",
    relation: "related",
    viewpoint: "oral_tradition",
    sourceKey: "dahomean_royal_tradition",
    note: "The king the foundation story is attached to — and whose own place in the list is argued about.",
  },
  {
    from: "akaba",
    to: "hangbe-reign",
    relation: "precedes",
    viewpoint: "traditional",
    note: "Akaba's sudden death is where the disputed succession begins.",
  },
  {
    from: "hangbe-reign",
    to: "did-hangbe-rule-dahomey",
    relation: "responds_to",
    viewpoint: "disputed",
    note: "The reign as tradition reports it, and the argument about what it was.",
  },
  {
    from: "hangbe-reign",
    to: "where-did-the-agojie-come-from",
    relation: "relevant",
    viewpoint: "oral_tradition",
    note: "One origin tradition credits Hangbe with founding the corps. Connected for the reader, NOT offered as evidence — the reign and the foundation are each uncertain and must not be used to support each other.",
  },
  {
    from: "agaja",
    to: "dahomey-tributary-to-oyo",
    relation: "precedes",
    viewpoint: "historical",
    sourceKey: "law_rise_of_dahomey_jah",
    note: "The expansion to the coast brought Dahomey up against Oyo, and into tribute.",
  },
  {
    from: "dahomey-tributary-to-oyo",
    to: "ghezo",
    relation: "precedes",
    viewpoint: "historical",
    note: "Ghezo is the king who ended the tribute.",
  },
  {
    from: "adandozan",
    to: "was-adandozan-erased",
    relation: "responds_to",
    viewpoint: "disputed",
    sourceKey: "law_history_and_legitimacy",
    note: "The reign, and the argument about what the royal tradition did with it afterwards.",
  },
  {
    from: "ghezo",
    to: "agojie-under-ghezo",
    relation: "source_of",
    viewpoint: "historical",
    sourceKey: "alpern_amazons_black_sparta",
    note: "The reign in which the women's corps became a standing army.",
  },
  {
    from: "where-did-the-agojie-come-from",
    to: "agojie-under-ghezo",
    relation: "precedes",
    viewpoint: "historical",
    note: "Whatever the origins, this is the corps that Europeans described and the world remembers.",
  },
  {
    from: "agojie-under-ghezo",
    to: "agojie-in-european-eyes",
    relation: "related",
    viewpoint: "historical",
    note: "The institution, and the problem that nearly all the description of it is European.",
  },
  {
    from: "agojie-in-european-eyes",
    to: "agojie-on-show-in-europe",
    relation: "precedes",
    viewpoint: "historical",
    note: "Fascination became an industry: the corps described in books became a troupe on a poster.",
  },
  {
    from: "agojie-under-ghezo",
    to: "the-woman-king-2022",
    relation: "related",
    viewpoint: "community",
    note: "The film's subject, and the reason most people alive have heard of the corps at all.",
  },
  {
    from: "annual-customs-xwetanu",
    to: "human-sacrifice-what-is-documented",
    relation: "related",
    viewpoint: "historical",
    note: "The ceremonies at which the killings took place.",
  },
  {
    from: "human-sacrifice-what-is-documented",
    to: "how-many-were-sacrificed",
    relation: "responds_to",
    viewpoint: "disputed",
    note: "That it happened, and the separate question of scale — which the evidence answers far less well.",
  },
  {
    from: "grand-customs-royal-funerals",
    to: "how-many-were-sacrificed",
    relation: "evidence_for",
    viewpoint: "disputed",
    note: "Ghezo's Grand Customs are what the 1860 British allegation was about.",
  },
  {
    from: "first-franco-dahomean-war",
    to: "second-franco-dahomean-war",
    relation: "precedes",
    viewpoint: "historical",
    sourceKey: "servicehistorique_dahomey",
    note: "A treaty in 1890, and two years of rearmament on both sides.",
  },
  {
    from: "second-franco-dahomean-war",
    to: "looting-of-abomey-1892",
    relation: "source_of",
    viewpoint: "historical",
    sourceKey: "quai_branly_restitution",
    note: "The campaign that produced the collections.",
  },
  {
    from: "second-franco-dahomean-war",
    to: "behanzin",
    relation: "related",
    viewpoint: "historical",
    note: "The king who fought it, and who was deported at the end of it.",
  },
  {
    from: "behanzin",
    to: "agoli-agbo",
    relation: "precedes",
    viewpoint: "historical",
    note: "An independent king, and then a king installed by the power that removed him.",
  },
  {
    from: "royal-emblems-system",
    to: "king-as-his-animal",
    relation: "related",
    viewpoint: "traditional",
    note: "The system of emblems, and how closely the tradition identifies a king with his.",
  },
  {
    from: "king-as-his-animal",
    to: "looting-of-abomey-1892",
    relation: "relevant",
    viewpoint: "historical",
    note: "The statues that state the identity most plainly are the ones that spent a century in Paris.",
  },
  {
    from: "hountondji-and-court-workshops",
    to: "gou-iron-figure",
    relation: "related",
    viewpoint: "historical",
    note: "Court metalworking, and its most famous surviving object.",
  },
  {
    from: "abomey-palaces-three-centuries",
    to: "abomey-bas-reliefs",
    relation: "related",
    viewpoint: "historical",
    note: "The walls, and what is on them.",
  },
  {
    from: "abomey-palaces-three-centuries",
    to: "second-franco-dahomean-war",
    relation: "related",
    viewpoint: "historical",
    note: "The complex that burned in November 1892.",
  },
  {
    from: "kpojito-and-the-palace-women",
    to: "agojie-under-ghezo",
    relation: "related",
    viewpoint: "historical",
    sourceKey: "bay_wives_of_the_leopard",
    note: "An armed women's corps is less surprising inside a palace administration already staffed by women.",
  },
];
