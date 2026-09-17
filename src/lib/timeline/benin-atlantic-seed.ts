// OUIDAH, THE ATLANTIC WORLD, COLONIAL RULE AND MODERN BÉNIN.
//
// WHAT THIS DATASET IS FOR. To follow this coast from the point where it became
// a node of the Atlantic world to the point where it began taking its own
// history back — and to refuse, at every step, the two stories that are usually
// told instead of it.
//
// THE FIRST STORY IT REFUSES: that Europeans arrived and took over. They did
// not, for most of this period. The forts at Ouidah were built BY PERMISSION,
// on land granted by African rulers, garrisoned by a handful of men, taxed,
// regulated, and dependent for food, water and labour on the kingdom around
// them. For roughly two hundred years, Europeans on this coast were tenants.
// That changed, catastrophically and quickly, in the 1890s — and the change is
// an event to be dated, not a background condition to be assumed.
//
// THE SECOND STORY IT REFUSES: that the slave trade was something done to a
// passive coast. Allada, Hueda and Dahomey were states with policies. They set
// terms, taxed, regulated, warred for captives and sold them. African merchants
// grew rich. Ouidah's most famous nineteenth-century figure was a Brazilian who
// helped put a king on the throne. NONE OF THIS REDUCES EUROPEAN
// RESPONSIBILITY, and a dataset that flinched from it would be unable to
// explain why Dahomey existed in the form it did.
//
// ON NUMBERS. Figures for people shipped from this coast are among the most
// worked-over quantities in African history, and they come from a real
// database built from surviving voyage records. This file says where a number
// comes from, and never supplies a total from memory.
//
// ON THE MEMORIALS. Ouidah's slave-route monuments date from the 1990s. They
// are heritage-making, by a modern state, with international partners, on
// historical ground — and they are excellent records of the 1990s as well as
// gestures towards the eighteenth century. Both things are said.
//
// ON SOURCES. Nothing could be fetched: the network refused every archive and
// database. Everything here is cited so it can be found and marked NEEDS SOURCE
// VERIFICATION where it came through a summary rather than the source itself.

import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

export const BENIN_ATLANTIC_ANCHOR_SLUG = "ouidah-one-landscape-many-worlds";

export const BENIN_ATLANTIC_TRACK: SeedTrack = {
  name: "Ouidah, the Atlantic, colonial rule and modern Bénin",
  slug: "benin-atlantic",
  kind: "region",
  color: "#3f6fa8",
};

const commons = (file: string, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
const commonsPage = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;

export const BENIN_ATLANTIC_SOURCES: SeedSource[] = [
  {
    key: "law_ouidah_social_history",
    title: "Ouidah: The Social History of a West African Slaving Port, 1727–1892",
    author: "Robin Law",
    publisher: "Ohio University Press",
    sourceType: "academic_book",
    publishedYear: 2004,
    notes:
      "THE STANDARD HISTORY OF THE TOWN, and the work most of this dataset's Ouidah records should " +
      "eventually be cited to line by line. Covers the period from the Dahomean conquest to the French " +
      "conquest: the forts, the merchant families, the Brazilian returnees, the trade and the town's " +
      "internal politics. NEEDS SOURCE VERIFICATION throughout — it could not be consulted from here, and " +
      "every Ouidah record below would be improved by being rewritten from it.",
  },
  {
    key: "slavevoyages_database",
    title: "SlaveVoyages: the Trans-Atlantic Slave Trade Database",
    publisher: "Emory University and partner institutions",
    url: "https://www.slavevoyages.org/",
    sourceType: "academic_paper",
    notes:
      "A DATABASE OF DOCUMENTED VOYAGES, assembled from surviving shipping, customs, insurance and port " +
      "records across many archives, with estimates built on top of the documented cases to account for " +
      "voyages whose records are lost. IT IS THE REASON ANY NUMBER IN THIS FIELD CAN BE CHECKED AT ALL. " +
      "Two things about it must travel with any figure taken from it: the difference between DOCUMENTED " +
      "voyages and ESTIMATED totals, and the fact that its estimates are periodically revised. NEEDS " +
      "SOURCE VERIFICATION: the site could not be reached from here, and no figure from it is quoted in " +
      "this dataset for that reason.",
  },
  {
    key: "unesco_slave_route_project",
    title: "The Slave Route Project",
    publisher: "UNESCO",
    sourceType: "government",
    notes:
      "The international programme, launched in the early 1990s, under which slave-trade memory sites " +
      "were identified and developed — including the route and monuments at Ouidah. Cited for the " +
      "institutional history of the memorials, which is a history of the 1990s.",
  },
  {
    key: "unesco_abomey_whc_atlantic",
    title: "Royal Palaces of Abomey — World Heritage file",
    publisher: "UNESCO World Heritage Centre",
    url: "https://whc.unesco.org/en/list/323/",
    sourceType: "government",
    notes:
      "Cited for the inscription of 1985, the simultaneous placement on the List of World Heritage in " +
      "Danger following the tornado of 1984, and the removal from the Danger List in 2007 after a " +
      "conservation programme part-financed by the World Heritage Fund.",
  },
  {
    key: "quai_branly_restitution_atlantic",
    title: "Restitution of 26 works to the Republic of Benin",
    publisher: "Musée du quai Branly – Jacques Chirac",
    url: "https://m.quaibranly.fr/en/collections/living-collections/news/restitution-of-26-works-to-the-republic-of-benin",
    sourceType: "museum",
    notes:
      "The holding museum's account of the twenty-six objects taken from Abomey in 1892 and transferred " +
      "to Bénin in 2021, including the French legislation of 2020 that made it possible. An institution " +
      "describing its own conduct, and a precise record of dates and objects.",
  },
  {
    key: "french_colonial_record",
    title: "French colonial administration of Dahomey: official records and published accounts",
    reference: "Colonial decrees, administrative reporting and the archives of French West Africa",
    sourceType: "government",
    notes:
      "WHAT THIS SOURCE ENTRY IS. The documentary apparatus of the colonial state — the record from which " +
      "most dates in the colonial records below are drawn. It is precise about administration and " +
      "systematically partial about everything else: it records what the colonial state did and thought, " +
      "and records the people it governed chiefly as objects of administration. NEEDS SOURCE " +
      "VERIFICATION: no file is cited individually in this dataset, which is the main weakness of its " +
      "colonial records.",
  },
  {
    key: "britannica_history_of_benin",
    title: "History of Benin",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/topic/history-of-Benin",
    sourceType: "encyclopedia",
    notes:
      "A reference overview, cited for the outline of the post-independence political history — coups, " +
      "the 1972 seizure of power, the Marxist-Leninist period, the renaming, and the transition of " +
      "1989–1991. A summary of other people's work, used as such and not as evidence for anything " +
      "contested.",
  },
  {
    key: "wikipedia_benin_atlantic_navigation",
    title: "Wikipedia articles on Ouidah, the forts, French Dahomey and the Republic of Bénin",
    url: "https://en.wikipedia.org/wiki/Ouidah",
    sourceType: "wikipedia",
    notes:
      "USED FOR NAVIGATION AND CROSS-CHECKING DATES ONLY. Where a record rests on nothing better, its " +
      "notes say so.",
  },
];

export const BENIN_ATLANTIC_EVENTS: SeedEvent[] = [
  // -------------------------------------------------------------------------
  // OUIDAH
  // -------------------------------------------------------------------------
  {
    slug: "ouidah-one-landscape-many-worlds",
    title: "Ouidah: African religion, an African monarchy, European forts, missionaries and Atlantic commerce in the same few streets",
    summary:
      "A serpent shrine, a royal administration, three European forts, a Catholic mission and the largest slave-exporting beach on this coast occupied one small town at the same time. That is the point of Ouidah.",
    description:
      "WHAT WAS IN THE SAME PLACE. Within a few square kilometres, across the eighteenth and nineteenth " +
      "centuries: the shrine of the serpent vodun, with its priesthood and its annual royal pilgrimage; " +
      "the administration of the kingdom that controlled the port, first Hueda and after 1727 Dahomey; " +
      "three European forts, Portuguese, English and French, each with a handful of men; the compounds of " +
      "African and Afro-Brazilian merchant families; a Catholic mission; and the beach from which people " +
      "were loaded onto ships.\n\n" +
      "WHY THE COEXISTENCE IS THE HISTORICAL FACT. Because each of those is usually written about " +
      "separately — a history of the slave trade, a history of Vodun, a history of European expansion, a " +
      "history of missions — and the separation makes each of them wrong. The fort commander bought from " +
      "the king's officials, the merchant was an initiate, the mission converted the merchant's children, " +
      "and the same road ran past all of them.\n\n" +
      "THE ARRANGEMENT, IN ONE SENTENCE. Europeans were here on African terms, doing business that African " +
      "states taxed and regulated, in a town whose religious life they had no power over — and the " +
      "business was people.\n\n" +
      "WHAT CHANGED THAT. The French conquest of the 1890s, in a few years, after two centuries of the " +
      "other arrangement.\n\n" +
      "WHAT IS THERE NOW. The Portuguese fort as a museum, the python temple in use, the basilica facing " +
      "it, the merchant houses, the memorial route to the beach, and a January festival that brings the " +
      "world back. THE TOWN IS STILL DOING ALL OF IT AT ONCE.\n\n" +
      "THINGS TO ASK: What do you lose by telling each of these histories on its own?",
    category: "history",
    subcategory: "Atlantic world",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["ouidah", "atlantic", "slavery", "european-encounter", "vodun", "trade", "hueda", "dahomey", "forts"],
    civilisations: ["Hueda", "Dahomey", "Portugal", "England", "France"],
    locationName: "Ouidah, southern Bénin",
    lat: 6.3625,
    lng: 2.0853,
    imageUrl: commons("Le Fort Portugais de Ouidah Bénin.jpg"),
    claims: [
      {
        sourceKey: "law_ouidah_social_history",
        startYear: 1671,
        endYear: 1892,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period in which all of these occupied the town together",
        originalDateText: "From the first European establishments to the French conquest",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT FIXES THE ENDS: a documented early French establishment at one end and the French conquest " +
          "at the other. WHAT DOES NOT: the town itself, which existed before the Europeans and continues " +
          "after them. THIS RANGE IS FOR THE ARRANGEMENT, not for Ouidah.",
      },
    ],
    media: [
      {
        url: commons("Le Fort Portugais de Ouidah Bénin.jpg"),
        sourcePageUrl: commonsPage("Le Fort Portugais de Ouidah Bénin.jpg"),
        fileName: "Le Fort Portugais de Ouidah Bénin.jpg",
        caption:
          "The Portuguese fort at Ouidah, now the town's history museum. A small square building a few hundred metres from a python temple and a Catholic basilica: the compression of this landscape is visible in how close everything is.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("The French fort at Ouidah, Dahomey (now Benin) early 1900s.jpg"),
        sourcePageUrl: commonsPage("The French fort at Ouidah, Dahomey (now Benin) early 1900s.jpg"),
        fileName: "The French fort at Ouidah, Dahomey (now Benin) early 1900s.jpg",
        caption:
          "The French fort at Ouidah photographed in the early 1900s, after the conquest. A photograph of a building from the trading era, taken under colonial rule — the fort is a survival from one arrangement, pictured under the next.",
        kind: "image",
        shows: "site",
        imageDate: "Early 1900s",
        identificationStatus: "probable",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes: "NEEDS SOURCE VERIFICATION for photographer and exact date.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "european-forts-at-ouidah",
    title: "Three forts, built by permission",
    summary:
      "The French establishment from about 1671 and fort from 1704, the English William's Fort from 1682, and the Portuguese São João Baptista de Ajudá from 1721 — each about a hundred metres square, each built with African consent.",
    description:
      "THE THREE. THE FRENCH, at Ouidah from about 1671 and with a fort — Saint-Louis de Grégoy — built " +
      "around 1704. THE ENGLISH, William's Fort, from 1682. THE PORTUGUESE, São João Baptista de Ajudá, " +
      "built in 1721 at the invitation of the king of Whydah. Danish and Dutch establishments also " +
      "existed. Each was roughly a hundred metres square, and they stood three to five hundred metres " +
      "apart.\n\n" +
      "HOW THEY WERE BUILT. In dried mud, by African labour, using local building methods. THIS IS NOT A " +
      "DETAIL: a European fort on this coast was an African building with European occupants, and it " +
      "could not have been built, maintained or supplied without the permission and the workforce of the " +
      "state around it.\n\n" +
      "WHAT THEY WERE FOR. Storage, accommodation, a defensible place for goods, a flag, and a station " +
      "from which to bargain. NOT territorial control. A garrison of a few dozen men, dependent on local " +
      "food and water, in a town governed by somebody else, controlled the ground it stood on and nothing " +
      "beyond it.\n\n" +
      "THE RULE THIS RECORD ENFORCES. A European fort is not evidence of European control of the " +
      "surrounding territory, and maps that shade a coastline because a fort stood on it are drawing " +
      "something that did not exist. The forts sat inside kingdoms; the kingdoms did not sit inside the " +
      "forts.\n\n" +
      "WHAT HAPPENED TO THEM. The French fort was razed in 1908. The English fort is gone. The Portuguese " +
      "fort stands, and its afterlife is one of the strangest records in this dataset.\n\n" +
      "THINGS TO ASK: What would you need to see, on a map, to know who actually governed a place?",
    category: "history",
    subcategory: "European forts",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["ouidah", "forts", "european-encounter", "portugal", "england", "france", "trade", "method"],
    civilisations: ["Hueda", "Dahomey", "Portugal", "England", "France"],
    locationName: "Ouidah, southern Bénin",
    lat: 6.3625,
    lng: 2.0853,
    claims: [
      {
        sourceKey: "wikipedia_benin_atlantic_navigation",
        startYear: 1671,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "The first French establishment at Ouidah",
        originalDateText: "Probably founded 1671; the fort Saint-Louis-de-Grégoy built from 1704",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "NOTE THE HEDGING IN THE SOURCE'S OWN WORDING — 'probably founded' — which distinguishes a " +
          "trading presence from a built fort. The two are different things and the second is much better " +
          "dated than the first.",
        notes: "NEEDS BETTER SOURCING: these dates should come from Law's history of the town.",
      },
      {
        sourceKey: "wikipedia_benin_atlantic_navigation",
        startYear: 1682,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The building of the English William's Fort",
        originalDateText: "1682",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "FROM THE RECORDS OF THE ENGLISH COMPANY THAT BUILT IT, which is good evidence for the date of construction and none at all for what it meant locally: the company recorded its own investment, not the terms on which the king of Whydah permitted it.",
      },
      {
        sourceKey: "wikipedia_benin_atlantic_navigation",
        startYear: 1721,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The building of the Portuguese fort São João Baptista de Ajudá",
        originalDateText: "1721, at the invitation of the local king of Whydah",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT THE PHRASE 'AT THE INVITATION OF' CARRIES: the arrangement in a nutshell. The Portuguese " +
          "did not seize a site; they were granted one by a king who wanted the trade and the leverage " +
          "that came from having several European powers present at once.",
      },
    ],
    media: [
      {
        url: commons("Le Fort Portugais de Ouidah Bénin.jpg"),
        sourcePageUrl: commonsPage("Le Fort Portugais de Ouidah Bénin.jpg"),
        fileName: "Le Fort Portugais de Ouidah Bénin.jpg",
        caption:
          "The Portuguese fort at Ouidah. About a hundred metres square, built of earth by African labour on land granted by an African king — the scale is the argument, and it is visible in the photograph.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("The French fort at Ouidah, Dahomey (now Benin) early 1900s.jpg"),
        sourcePageUrl: commonsPage("The French fort at Ouidah, Dahomey (now Benin) early 1900s.jpg"),
        fileName: "The French fort at Ouidah, Dahomey (now Benin) early 1900s.jpg",
        caption:
          "The French fort at Ouidah, photographed in the early 1900s. The French establishment was razed in 1908, so photographs from this decade are among the last records of a building that had stood since the trading era.",
        kind: "image",
        shows: "site",
        imageDate: "Early 1900s",
        identificationStatus: "probable",
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for photographer and exact date.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "portuguese-fort-until-1961",
    title: "The Portuguese fort was still Portuguese in 1961",
    summary:
      "Portugal held São João Baptista de Ajudá as an enclave long after Dahomey's independence. When Dahomey took it in 1961, the last occupants are said to have burned it behind them.",
    description:
      "THE SITUATION. Portugal did not give up the fort at Ouidah when France colonised Dahomey, and did " +
      "not give it up when Dahomey became independent in August 1960. A tiny Portuguese enclave persisted, " +
      "with a handful of inhabitants, inside another country — for a period it was described as among the " +
      "smallest territories in the world.\n\n" +
      "HOW IT ENDED. In 1961 the newly independent Republic of Dahomey took possession. The accounts say " +
      "the departing occupants set the fort on fire rather than hand it over intact.\n\n" +
      "WHY THIS IS NOT A CURIOSITY. Because it dates the end of something with unusual precision. The " +
      "Portuguese presence at Ouidah began in 1721 by invitation of an African king and ended in 1961 by " +
      "the act of an African state. TWO HUNDRED AND FORTY YEARS, bracketed at both ends by an African " +
      "decision, with the colonial period in the middle as an interruption rather than the whole story.\n\n" +
      "AND BECAUSE OF WHAT PORTUGAL WAS DOING ELSEWHERE. In 1961 Portugal was fighting to keep its African " +
      "empire and would not concede independence to Angola, Mozambique or Guinea-Bissau for more than a " +
      "decade. Its refusal to leave a hundred-metre fort in Bénin belongs to that policy rather than to " +
      "sentiment about Ouidah.\n\n" +
      "WHAT STANDS THERE NOW. The restored fort, as the Ouidah Museum of History.\n\n" +
      "THINGS TO ASK: When did European presence on this coast actually end? Is there one date?",
    category: "history",
    subcategory: "European forts",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["ouidah", "forts", "portugal", "colonialism", "independence", "modern-benin", "heritage"],
    civilisations: ["Portugal", "Republic of Dahomey"],
    locationName: "Ouidah, southern Bénin",
    lat: 6.3625,
    lng: 2.0853,
    claims: [
      {
        sourceKey: "wikipedia_benin_atlantic_navigation",
        startYear: 1961,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Dahomey's takeover of the Portuguese fort",
        originalDateText: "1961",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS SECURE: the year, which was an international incident between two states and is " +
          "documented on both sides. WHAT IS LESS SECURE: the burning, which is widely reported and is " +
          "the kind of vivid final detail that attaches itself to stories of this shape.",
        notes:
          "NEEDS SOURCE VERIFICATION for the burning specifically, and for the exact date and the " +
          "diplomatic exchange around it.",
      },
      {
        sourceKey: "wikipedia_benin_atlantic_navigation",
        startYear: 1721,
        endYear: 1961,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_range",
        whatIsDated: "The duration of the Portuguese presence at Ouidah",
        originalDateText: "1721 to 1961, two hundred and forty years",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY THE SPAN IS WORTH ENTERING AS A CLAIM IN ITSELF: because it puts a number on something " +
          "usually left vague. The European presence on this coast was not a brief prelude to colonialism " +
          "— it was longer than the colonial period several times over, and it was mostly not colonial.",
      },
    ],
    media: [
      {
        url: commons("Le Fort Portugais de Ouidah Bénin.jpg"),
        sourcePageUrl: commonsPage("Le Fort Portugais de Ouidah Bénin.jpg"),
        fileName: "Le Fort Portugais de Ouidah Bénin.jpg",
        caption:
          "The Portuguese fort at Ouidah as it stands today, restored, as the town's history museum. It was still a Portuguese possession in 1961, and the building visible here is the one the last occupants are said to have burned behind them.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "savi-excavated",
    title: "Savi: excavating an Atlantic-era African capital",
    summary:
      "The Hueda capital a few kilometres inland from Ouidah has been excavated — one of the few places where the archaeology of a West African kingdom at the height of the Atlantic trade can be read directly.",
    description:
      "WHY SAVI MATTERS OUT OF PROPORTION TO ITS FAME. Almost everything known about African polities in " +
      "the Atlantic era comes from European writing. Savi is a place where the ground can be asked " +
      "instead: the capital of Hueda, occupied through the period of intensive trade, destroyed with the " +
      "kingdom in 1727, and therefore SEALED — not overbuilt by three centuries of later occupation.\n\n" +
      "WHAT THAT MAKES POSSIBLE. Reading the layout of a royal centre; finding imported goods in context " +
      "and seeing where they ended up; and — in Neil Norman's work — excavating ritual deposits, which " +
      "gives material evidence for religious practice independent of both European description and later " +
      "tradition.\n\n" +
      "THE EUROPEAN LODGES. Traders were quartered at Savi as well as at the beach, under the king's eye " +
      "and at his convenience — an arrangement that the archaeology can examine: where they were put, how " +
      "far from the palace, with what access.\n\n" +
      "WHY 1727 IS AN ARCHAEOLOGICAL GIFT AND A HUMAN CATASTROPHE. The Dahomean conquest ended the " +
      "kingdom, scattered its people and left the site. The first half of that sentence is why the " +
      "evidence survives, and it should not be said without the second.\n\n" +
      "WHAT IS THIN HERE. This record names the site and its significance and cites no excavation report " +
      "directly, which is the state of the dataset rather than the state of the field.\n\n" +
      "THINGS TO ASK: What can you learn from a place that stopped, that you cannot learn from one that " +
      "kept going?",
    category: "archaeology",
    subcategory: "Atlantic era",
    eventType: "archaeological_interpretation",
    evidenceStatus: "strongly_documented",
    tags: ["archaeology", "savi", "hueda", "ouidah", "atlantic", "trade", "vodun", "excavation"],
    civilisations: ["Hueda"],
    locationName: "Savi, near Ouidah, southern Bénin",
    lat: 6.42,
    lng: 2.09,
    claims: [
      {
        sourceKey: "law_ouidah_social_history",
        startYear: 1650,
        endYear: 1727,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The occupation of Savi as the Hueda capital",
        originalDateText: "Through the period of Hueda's Atlantic trade, to the conquest of 1727",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT FIXES THE END PRECISELY: a historically documented conquest, which is a rare luxury for an " +
          "archaeological site — a terminal date from a document rather than from a laboratory. WHAT IS " +
          "SOFTER: the beginning, which is the kingdom's own and is not established here.",
        notes:
          "NEEDS SOURCE VERIFICATION for the excavation reports, the radiocarbon dates and the site's " +
          "published phasing.",
      },
    ],
  },

  {
    slug: "ouidah-and-the-scale-of-the-trade",
    title: "How many people were shipped from this coast, and how anyone knows",
    summary:
      "The Bight of Benin was one of the largest sources of enslaved Africans in the Atlantic trade. The figures come from a database built from surviving voyage records, and this dataset quotes none from memory.",
    description:
      "WHERE THE NUMBERS COME FROM. Not from an estimate somebody made. From the TRANS-ATLANTIC SLAVE " +
      "TRADE DATABASE, assembled over decades from surviving shipping papers, customs returns, insurance " +
      "records, port books and correspondence in archives across Europe, Africa and the Americas. Each " +
      "documented voyage is a record with a ship, a date, a port and — often — a number of people.\n\n" +
      "THE TWO KINDS OF FIGURE, WHICH MUST NEVER BE MERGED. DOCUMENTED: what the surviving records " +
      "actually show. ESTIMATED: a modelled total that accounts for voyages whose records are lost. The " +
      "second is larger and is a scholarly reconstruction, revised as new records are found. Quoting an " +
      "estimate as a count is the standard error, and it runs in both directions politically.\n\n" +
      "WHY THIS RECORD QUOTES NO NUMBER. Because the database could not be consulted from the environment " +
      "this file was written in, and a figure typed from memory would be exactly what the paragraph above " +
      "warns against. A NUMBER WITHOUT A SOURCE IS NOT EVIDENCE, and this record would rather be " +
      "incomplete than wrong.\n\n" +
      "WHAT CAN BE SAID WITHOUT A FIGURE. That the Bight of Benin — the stretch of coast including Ouidah " +
      "— was one of the principal regions of embarkation in the entire Atlantic trade; that Ouidah was " +
      "among its busiest ports over a very long period; and that the scale was such that it shaped the " +
      "demography and politics of the whole region.\n\n" +
      "WHAT THE NUMBERS CANNOT CARRY. Each entry is people. The database's own designers have said as " +
      "much, and it is worth repeating whenever a total appears in a sentence.\n\n" +
      "THINGS TO ASK: What is the difference between a documented figure and an estimated one, and why " +
      "does it keep getting lost?",
    category: "history",
    subcategory: "Atlantic slave trade",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["slavery", "atlantic", "ouidah", "method", "numbers", "trade", "database"],
    locationName: "The Bight of Benin",
    lat: 6.3,
    lng: 2.2,
    claims: [
      {
        sourceKey: "slavevoyages_database",
        startYear: 1560,
        endYear: 1867,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period of documented Atlantic deportation from this region",
        originalDateText: "From the sixteenth century into the second half of the nineteenth",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT SUPPORTS THE RANGE: documented voyages at both ends, together with the colonial records " +
          "showing people from this coast in Spanish America by the 1560s. NO TOTAL IS ENTERED HERE, " +
          "deliberately — see the description.",
        notes:
          "NEEDS SOURCE VERIFICATION and a specific figure: a properly cited number from the database, " +
          "with its documented-versus-estimated status attached and the date of the version it came from, " +
          "is the single most valuable addition anybody could make to this record.",
      },
    ],
  },

  {
    slug: "de-souza-and-place-chacha",
    title: "Francisco Félix de Souza, the chacha of Ouidah",
    summary:
      "A Brazilian merchant who helped put Ghezo on the throne in 1818 and was made Dahomey's agent for the trade at Ouidah. Place Chacha carries his title, and an auction took place there.",
    description:
      "WHO HE WAS. A Brazilian who settled at Ouidah, became the most important merchant on the coast, " +
      "supported Ghezo's seizure of the throne in 1818, and was rewarded with the office of CHACHA — the " +
      "king's agent for the trade at the port. He founded a large family that remains prominent in Ouidah, " +
      "and he died there in 1849.\n\n" +
      "WHY HE COMPLICATES EVERY SIMPLE ACCOUNT. He was a Brazilian in Africa, working for an African king, " +
      "selling African captives to European and American ships, and his descendants are Beninese. He is " +
      "not a European coloniser, not an African ruler, and not a passive intermediary: he is the " +
      "Atlantic system in one person, and the system needed people like him at every port.\n\n" +
      "PLACE CHACHA. The square in Ouidah named from his title, and identified in the memorial route as " +
      "the place where captives were auctioned. It is the first station of the route to the beach.\n\n" +
      "HOW HE IS REMEMBERED. Not simply. He is a founding figure of a Ouidah family and a celebrated " +
      "historical personality in the town; he is also one of the largest slave traders of his century. " +
      "Both are locally known, and the tension is part of Ouidah's present rather than a problem outsiders " +
      "bring to it.\n\n" +
      "THINGS TO ASK: What do you do with a person who is a founder and a slave trader in the same life?",
    category: "people",
    subcategory: "Atlantic slave trade",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["ouidah", "slavery", "atlantic", "ghezo", "brazil", "trade", "memory"],
    people: ["Francisco Félix de Souza", "Ghezo"],
    civilisations: ["Dahomey", "Brazil"],
    locationName: "Ouidah, southern Bénin",
    lat: 6.362,
    lng: 2.085,
    claims: [
      {
        sourceKey: "law_ouidah_social_history",
        startYear: 1818,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "De Souza's part in Ghezo's seizure of the throne, and his appointment as chacha",
        originalDateText: "1818",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DOCUMENTED: the coup and his role in it, recorded by contemporaries on the coast and in " +
          "Brazilian sources. A CHANGE OF KING SUPPORTED BY A MERCHANT is the kind of event that leaves " +
          "traces in commercial correspondence as well as in royal tradition.",
      },
      {
        sourceKey: "law_ouidah_social_history",
        startYear: 1849,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "De Souza's death at Ouidah",
        originalDateText: "1849",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "RECORDED IN CONTEMPORARY CORRESPONDENCE AND IN THE FAMILY'S OWN TRADITION — two independent kinds of source agreeing, which is unusual and is what makes this date solid. The family remains prominent at Ouidah, so the tradition is a living one with an interest in its founder.",
        notes: "NEEDS BETTER SOURCING for the exact date.",
      },
    ],
  },

  {
    slug: "british-suppression-and-the-illegal-trade",
    title: "Suppression, blockade, and a trade that did not stop",
    summary:
      "Britain abolished its own slave trade in 1807 and spent decades pressing others to stop. The export from this coast continued illegally for half a century after that.",
    description:
      "WHAT BRITAIN DID. Abolished its own slave trade in 1807, then used treaties, payments, diplomacy " +
      "and the West Africa Squadron to suppress everyone else's — intercepting ships, negotiating with " +
      "African rulers, and sending missions like Forbes's to Ghezo in 1849 and 1850.\n\n" +
      "WHAT HAPPENED INSTEAD OF STOPPING. The trade to Brazil and Cuba continued for decades, illegally. " +
      "Ships were faster and better armed; cargoes were insured against seizure; and a blockade of " +
      "thousands of miles of coast by a limited number of ships intercepted a fraction of what sailed. " +
      "SUPPRESSION MADE THE TRADE MORE DANGEROUS FOR THE PEOPLE IN THE HOLD, not less: a slaver pursued " +
      "by a cruiser had reasons to act that do not bear describing here and are fully documented.\n\n" +
      "WHY DAHOMEY DID NOT SIMPLY AGREE. Because the revenue was structural. Ghezo's recorded reply to " +
      "Forbes — that the trade was the ruling principle of his people, the source of their glory and " +
      "wealth, and that he could not end it alone — is quoted from the man sent to persuade him, and " +
      "however it is read it describes a state that could not easily stop.\n\n" +
      "THE BRITISH POSITION, DESCRIBED ACCURATELY. Britain campaigned against a trade it had dominated for " +
      "a century and a half, after growing rich on it, and used suppression as an instrument of influence " +
      "on this coast as well as a moral cause. Both of those are true at once, and the moral campaign was " +
      "real.\n\n" +
      "WHAT REPLACED IT. Palm oil, exported in growing quantity — produced substantially by enslaved " +
      "labour inside Dahomey. THE END OF THE EXPORT TRADE WAS NOT THE END OF SLAVERY: it moved.\n\n" +
      "THINGS TO ASK: When does a trade actually end — when it is banned, or when it stops?",
    category: "history",
    subcategory: "Atlantic slave trade",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["slavery", "atlantic", "british", "abolition", "ghezo", "palm-oil", "ouidah", "trade"],
    people: ["Ghezo", "Frederick Edwyn Forbes"],
    civilisations: ["Dahomey", "Britain", "Brazil", "Cuba"],
    locationName: "The Bight of Benin",
    lat: 6.3,
    lng: 2.2,
    claims: [
      {
        sourceKey: "britannica_history_of_benin",
        startYear: 1807,
        endYear: 1867,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period from British abolition to the effective end of the Atlantic trade from this coast",
        originalDateText: "From 1807 into the 1860s",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT FIXES THE START: an act of parliament, which is as firm as a date gets. WHAT MAKES THE END " +
          "SOFT: an illegal trade does not have a closing date, and the last voyages are known " +
          "individually rather than as a moment.",
      },
      {
        sourceKey: "britannica_history_of_benin",
        startYear: 1840,
        isOngoing: true,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "The shift towards palm oil as the region's principal export",
        originalDateText: "From the middle of the nineteenth century",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY THIS IS MARKED AS ONGOING: because palm oil remained the region's dominant export through " +
          "the colonial period and long after, so the change begun here does not have an end date within " +
          "this dataset's scope.",
      },
    ],
  },

  {
    slug: "ouidah-slave-route-memorial",
    title: "The Route des Esclaves and the Door of No Return",
    summary:
      "A four-kilometre memorial route from Place Chacha to the beach, with stations marking the auction, the tree of forgetting, the barracoons and the embarkation — built in the 1990s with UNESCO.",
    description:
      "WHAT WAS BUILT, AND WHEN. A memorial route of about four kilometres running from Place Chacha in " +
      "the town down to the beach, marked by stations, ending at the DOOR OF NO RETURN — a concrete and " +
      "bronze arch erected on the sand in 1992 by the Beninese government in partnership with UNESCO, " +
      "under the Slave Route Project. The route's stations include the auction place, the Tree of " +
      "Forgetting, the barracoons where people were held, the Tree of Return, the memorial at Zomachi, " +
      "and the mass grave site at Zoungbodji.\n\n" +
      "WHAT THE MONUMENTS ARE AND ARE NOT. They are LATE-TWENTIETH-CENTURY MEMORIALS on historically real " +
      "ground. The route the captives walked is real; the arch is from 1992. The Tree of Forgetting, " +
      "around which people are said to have been made to circle so as to forget their origins, is a " +
      "replica marking a tradition. NONE OF THIS MAKES THE SITE INAUTHENTIC — it makes it a memorial, " +
      "which is a different kind of object from a ruin, and one whose own date is part of what it means.\n\n" +
      "WHY THE 1990S. Because this is when the Beninese state, UNESCO and an international public " +
      "converged on slave-trade memory: the Slave Route Project, the Ouidah '92 festival held in January " +
      "1993, and the beginning of heritage tourism and of return visits by people from the African " +
      "diaspora. THE MEMORIALS ARE EVIDENCE ABOUT THE 1990S AS WELL AS GESTURES TOWARDS THE EIGHTEENTH " +
      "CENTURY, and reading them only as the latter misses half of what they record.\n\n" +
      "THE HONEST TENSION. The same decade's heritage-making produced both a place where descendants can " +
      "stand on the sand their ancestors were taken from, and an economy of visitors. Those are not " +
      "opposites and Ouidah lives with both.\n\n" +
      "THINGS TO ASK: What is a memorial for? Who is it for?",
    category: "history",
    subcategory: "Memory and heritage",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["ouidah", "slavery", "memory", "heritage", "unesco", "diaspora", "modern-benin", "tourism"],
    civilisations: ["Republic of Bénin"],
    locationName: "Ouidah, southern Bénin",
    lat: 6.3455,
    lng: 2.0872,
    imageUrl: commons("Porte du non-retour au Benin.jpg"),
    claims: [
      {
        sourceKey: "unesco_slave_route_project",
        startYear: 1992,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The erection of the Door of No Return arch",
        originalDateText: "1992, by the Beninese government in partnership with UNESCO",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: A MONUMENT, not an event of the slave trade. The distinction is the whole reason " +
          "this claim is worded as it is: the most photographed object at Ouidah is younger than most " +
          "people reading about it.",
      },
      {
        sourceKey: "unesco_slave_route_project",
        startYear: 1993,
        startMonth: 1,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Ouidah '92 festival of Vodun arts and cultures",
        originalDateText: "Held in January 1993, despite its name",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "A SMALL DISCREPANCY WORTH PRESERVING RATHER THAN TIDYING: the festival is named for 1992 and " +
          "took place in January 1993. Silently correcting the name, or silently accepting it as the " +
          "date, would each lose something.",
      },
    ],
    media: [
      {
        url: commons("Porte du non-retour au Benin.jpg"),
        sourcePageUrl: commonsPage("Porte du non-retour au Benin.jpg"),
        fileName: "Porte du non-retour au Benin.jpg",
        caption:
          "The Door of No Return on the beach at Ouidah. The arch was erected in 1992: it is a memorial marking where people were taken from, and it is not a structure the captives passed through.",
        kind: "image",
        shows: "site",
        objectDate: "1992",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "THE CAPTION MUST KEEP SAYING THIS. Images of the arch circulate widely as though it were an " +
          "eighteenth-century structure, which it is not.",
        creditFrom: "source",
      },
      {
        url: commons("The Door of No Return in Ouidah, November 2007.jpg"),
        sourcePageUrl: commonsPage("The Door of No Return in Ouidah, November 2007.jpg"),
        fileName: "The Door of No Return in Ouidah, November 2007.jpg",
        caption:
          "The Door of No Return photographed in November 2007. A dated photograph of a monument erected in 1992 — which makes it a straightforward record of what stood on that beach at that moment, and of nothing earlier.",
        kind: "image",
        shows: "site",
        imageDate: "November 2007",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Ouidah-Esplanade de la Porte du Non-Retour-Côté route (1).jpg"),
        sourcePageUrl: commonsPage("Ouidah-Esplanade de la Porte du Non-Retour-Côté route (1).jpg"),
        fileName: "Ouidah-Esplanade de la Porte du Non-Retour-Côté route (1).jpg",
        caption:
          "The esplanade at the Door of No Return, seen from the road side. The approach and its landscaping are part of the memorial as designed, and show how the site is arranged for the people who come to it.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // COLONIAL RULE
  // -------------------------------------------------------------------------
  {
    slug: "french-dahomey-colony",
    title: "French Dahomey",
    summary:
      "From the conquest of the 1890s the territory was administered as a French colony within French West Africa, with its capital at Porto-Novo rather than Abomey.",
    description:
      "WHAT WAS CREATED. A colony, assembled from the conquered kingdom of Dahomey, the protectorate of " +
      "Porto-Novo, the coastal districts and — pushed northwards in the following years — Borgu and the " +
      "Atakora, which had never been part of Dahomey at all. The colony was incorporated into FRENCH WEST " +
      "AFRICA, the federation governed from Dakar.\n\n" +
      "THE BORDERS, AND WHAT THEY DID. Drawn in negotiation with Britain and Germany, they cut across " +
      "peoples rather than around them: Baatombu divided between French and British spheres, Yoruba " +
      "communities separated from the bulk of Yorubaland, Batammariba split from their neighbours across " +
      "the Togo line. THE SHAPE OF THE MODERN COUNTRY — a narrow strip running seven hundred kilometres " +
      "inland from a short coast — is a product of this and of nothing else.\n\n" +
      "THE CAPITAL. Porto-Novo, not Abomey. The colonial administration was placed in the lagoon town that " +
      "had sought French protection AGAINST Dahomey, not in the capital of the kingdom France had " +
      "destroyed. That decision still shapes the country: Porto-Novo remains the official capital.\n\n" +
      "HOW IT WAS RUN. Through appointed administrators, taxation, forced labour, conscription, and " +
      "chiefs recognised or created by the administration. Mission schools produced an educated class " +
      "from which, in time, the independence movement came.\n\n" +
      "THE NAME IT KEPT. 'Dahomey', for the whole territory — the name of one southern kingdom applied to " +
      "a country containing Bariba, Somba, Dendi, Yoruba, Gun and many others. THAT CHOICE IS WHY THE " +
      "COUNTRY IS CALLED BÉNIN TODAY.\n\n" +
      "THINGS TO ASK: What does it do to a country to be named after one of its parts?",
    category: "history",
    subcategory: "Colonial period",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["colonialism", "france", "porto-novo", "borders", "administration", "modern-benin", "naming"],
    civilisations: ["French Dahomey", "France"],
    locationName: "French Dahomey",
    lat: 9.3,
    lng: 2.3,
    claims: [
      {
        sourceKey: "french_colonial_record",
        startYear: 1894,
        endYear: 1960,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The colonial period",
        originalDateText: "From the establishment of the colony after the conquest to independence in 1960",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT FIXES IT: administrative acts on both sides. NOTE THAT THE START DATE IS ARGUABLE — the " +
          "protectorate over Porto-Novo runs from 1882, the conquest of Dahomey completes in 1894, and " +
          "the northern territories are brought in later still. A COLONY IS ASSEMBLED RATHER THAN " +
          "FOUNDED, and a single start date hides that.",
      },
    ],
    media: [
      {
        url: commons("The French fort at Ouidah, Dahomey (now Benin) early 1900s.jpg"),
        sourcePageUrl: commonsPage("The French fort at Ouidah, Dahomey (now Benin) early 1900s.jpg"),
        fileName: "The French fort at Ouidah, Dahomey (now Benin) early 1900s.jpg",
        caption:
          "Ouidah in the early 1900s, under French administration. The fort in the picture belongs to the trading era that preceded the colony; the photograph belongs to the colony that followed it.",
        kind: "image",
        shows: "site",
        imageDate: "Early 1900s",
        identificationStatus: "probable",
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for photographer and exact date.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "colonial-taxation-labour-and-resistance",
    title: "Taxation, forced labour and resistance",
    summary:
      "Colonial rule was paid for by the people it governed, through head tax, forced labour and conscription — and was resisted, repeatedly, in ways the archive records chiefly as disorder.",
    description:
      "HOW THE COLONY PAID FOR ITSELF. A head tax, payable in cash, which obliged people to produce for " +
      "the market or to work for wages. FORCED LABOUR on roads, buildings and porterage. And military " +
      "CONSCRIPTION — the reason large numbers of men from this territory served in French forces in both " +
      "world wars.\n\n" +
      "WHY THE HEAD TAX MATTERS MORE THAN IT SOUNDS. A tax payable only in cash restructures an economy " +
      "from the bottom. It forces the growing of export crops, pushes men into migrant labour, and " +
      "converts subsistence farming into a cash-earning obligation. Much of what is described as economic " +
      "modernisation in the colonial record is this.\n\n" +
      "THE RESISTANCE. Repeated, across the territory and across the period, and recorded in the archive " +
      "chiefly as revolt, disorder or refusal to pay. Because the record is the administration's, the " +
      "resistance appears in it from the administration's side — its causes explained by officials, its " +
      "leaders named by their opponents, its suppression documented in detail while its aims are not.\n\n" +
      "WHAT THIS RECORD CANNOT DO, AND SAYS SO. Name the risings, date them or describe them. That " +
      "material is in the colonial archive and in Beninese historical scholarship, and neither could be " +
      "reached from here. A RECORD THAT KNOWS RESISTANCE HAPPENED AND CANNOT SAY WHEN is an honest " +
      "placeholder and a poor substitute for the real one.\n\n" +
      "THINGS TO ASK: If the only record of a rebellion was written by the people who put it down, what " +
      "can you still learn from it?",
    category: "history",
    subcategory: "Colonial period",
    eventType: "historical",
    evidenceStatus: "unresolved",
    tags: ["colonialism", "resistance", "taxation", "forced-labour", "france", "method", "archives"],
    civilisations: ["French Dahomey"],
    locationName: "French Dahomey",
    lat: 9.3,
    lng: 2.3,
    claims: [
      {
        sourceKey: "french_colonial_record",
        startYear: 1900,
        endYear: 1960,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period of colonial taxation, forced labour and recurrent resistance",
        originalDateText: "Across the colonial period",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY THE RANGE IS THE WHOLE PERIOD: because this is a description of how the colony worked " +
          "rather than of an event. THIS RECORD IS DELIBERATELY MARKED AS UNRESOLVED IN ITS EVIDENCE " +
          "STATUS, because a dataset that can date the French army's battles to the day and cannot date a " +
          "single tax revolt is showing whose records survive and were reachable.",
        notes:
          "NEEDS BETTER SOURCING, more than any other record in this dataset. Specific risings, their " +
          "dates, leaders and causes should replace this placeholder.",
      },
    ],
  },

  {
    slug: "world-wars-and-conscription",
    title: "Dahomeans in the world wars",
    summary:
      "Men from this territory were recruited into French forces in both world wars. The returning soldiers were among those who afterwards questioned the colonial order.",
    description:
      "WHAT HAPPENED. Men from French Dahomey served in French forces in the First World War and the " +
      "Second, recruited through a conscription system operating across French West Africa. They fought in " +
      "Europe and elsewhere, in a war between European powers, for the empire that governed them.\n\n" +
      "WHY IT MATTERS POLITICALLY. Because of what service did to the relationship. A man who has fought " +
      "in France, seen French society, been paid, decorated and demobilised does not return to a colony " +
      "with the same assumptions he left with. Across French and British Africa alike, veterans are " +
      "prominent in the post-war politics that leads to independence — and their claims start as claims " +
      "for what they were promised rather than as claims for independence.\n\n" +
      "THE SECOND WAR'S PARTICULAR EFFECT. A war fought explicitly against racial doctrine, by empires " +
      "that governed on racial lines, with African troops in it. The contradiction was not lost on the " +
      "people asked to hold both.\n\n" +
      "WHAT THIS RECORD LACKS. Numbers, units, campaigns and names. French military records document all " +
      "of this in detail and none of it could be reached from here. A version of this record with the " +
      "recruitment figures for Dahomey and the formations they served in would be worth far more than " +
      "this one.\n\n" +
      "THINGS TO ASK: What does a government owe someone it conscripted?",
    category: "history",
    subcategory: "Colonial period",
    eventType: "historical",
    tags: ["colonialism", "france", "wwi", "wwii", "military", "resistance", "independence"],
    civilisations: ["French Dahomey", "France"],
    locationName: "French Dahomey, and the theatres of both world wars",
    claims: [
      {
        sourceKey: "french_colonial_record",
        startYear: 1914,
        endYear: 1918,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The First World War, in which men from the territory served",
        originalDateText: "1914–1918",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "THE WAR'S DATES ARE NOT IN QUESTION. What is missing from this record is everything local: how many men were recruited from this territory, by what mechanism, into which formations, and how many returned. French military records hold all of it and none could be reached from here.",
        notes: "NEEDS SOURCE VERIFICATION for recruitment figures and units from Dahomey specifically.",
      },
      {
        sourceKey: "french_colonial_record",
        startYear: 1939,
        endYear: 1945,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The Second World War, in which men from the territory served",
        originalDateText: "1939–1945",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "As above. The political consequences of service are described in this record and are not " +
          "themselves dated here, because they unfolded across the following fifteen years.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // INDEPENDENCE AND AFTER
  // -------------------------------------------------------------------------
  {
    slug: "independence-1960",
    title: "1 August 1960: independence",
    summary:
      "The Republic of Dahomey became independent from France, having been an autonomous republic within the French Community since 1958.",
    description:
      "WHAT HAPPENED. On 1 August 1960 the Republic of Dahomey became fully independent. It had been an " +
      "autonomous republic within the French Community since 1958, in the sequence by which most of French " +
      "West Africa moved to independence in that year.\n\n" +
      "WHAT THE NEW STATE INHERITED. Borders drawn in European negotiation, cutting across peoples. A " +
      "capital at Porto-Novo and an economic centre at Cotonou. A north and a south with different " +
      "histories, different religions and different relationships to colonial education. An economy built " +
      "on palm oil. And a name belonging to one of its constituent kingdoms.\n\n" +
      "WHY THE FIRST DECADE WAS AS IT WAS. Regional and ethnic blocs with rival leaders, a small " +
      "educated elite, a weak tax base and an army — a combination that produced repeated coups across " +
      "West Africa and produced them here with particular frequency.\n\n" +
      "WHAT INDEPENDENCE DID NOT INCLUDE. The Portuguese fort at Ouidah, which stayed Portuguese until the " +
      "following year; the royal objects taken from Abomey, which stayed in Paris for another sixty-one " +
      "years; and the borders, which stayed exactly as drawn.\n\n" +
      "THINGS TO ASK: What is actually transferred on a day of independence, and what is not?",
    category: "history",
    subcategory: "Modern Bénin",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["independence", "modern-benin", "france", "colonialism", "politics"],
    civilisations: ["Republic of Dahomey"],
    locationName: "Porto-Novo and Cotonou, Bénin",
    lat: 6.5,
    lng: 2.62,
    claims: [
      {
        sourceKey: "britannica_history_of_benin",
        startYear: 1960,
        startMonth: 8,
        startDay: 1,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Independence",
        originalDateText: "1 August 1960",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "ONE OF THE FEW DATES IN THIS WHOLE PROJECT THAT IS SIMPLY A DATE: a constitutional act, " +
          "recorded by both states, celebrated annually since.",
      },
      {
        sourceKey: "britannica_history_of_benin",
        startYear: 1958,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Autonomous republic status within the French Community",
        originalDateText: "1958",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY THIS IS A SEPARATE CLAIM: because independence was a process with stages, and the " +
          "two-year gap between autonomy and independence is where the shape of the new state was settled.",
      },
    ],
  },

  {
    slug: "coups-1963-1972",
    title: "Six coups in nine years",
    summary:
      "Between 1963 and 1972 Dahomey had one of the most unstable political records in Africa, with repeated military seizures of power and rotating civilian arrangements.",
    description:
      "WHAT HAPPENED. Repeated military coups between 1963 and 1972 — commonly counted as six successful " +
      "seizures of power — interspersed with civilian governments, provisional arrangements and, at one " +
      "point, a rotating presidency shared between the three leading regional politicians.\n\n" +
      "WHY. Politics organised around three regional blocs with three leaders, each with a base and none " +
      "with a national majority; an economy too small to fund the promises any of them made; and an army " +
      "positioned to act when the arrangements broke down. The state's revenue was thin and the stakes of " +
      "holding it were high.\n\n" +
      "WHAT IT IS NOT EVIDENCE OF. Anything essential about this country or its people. It is the ordinary " +
      "arithmetic of a small state with a narrow tax base, a colonial border, regionally organised " +
      "politics and a standing army — a combination that produced the same pattern across West Africa in " +
      "the same years.\n\n" +
      "WHAT IT PRODUCED. A reputation for instability, and the conditions for the seizure of power in 1972 " +
      "that ended the sequence and lasted seventeen years.\n\n" +
      "THINGS TO ASK: What would have had to be different for this not to happen?",
    category: "history",
    subcategory: "Modern Bénin",
    eventType: "historical",
    tags: ["modern-benin", "politics", "coups", "military", "independence"],
    civilisations: ["Republic of Dahomey"],
    locationName: "Cotonou and Porto-Novo, Bénin",
    lat: 6.37,
    lng: 2.4,
    claims: [
      {
        sourceKey: "britannica_history_of_benin",
        startYear: 1963,
        endYear: 1972,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period of repeated military coups",
        originalDateText: "Six successful military coups between 1963 and 1972",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DOCUMENTED: each seizure of power individually, in contemporary reporting and " +
          "government records. WHY THE COUNT VARIES BETWEEN ACCOUNTS: because what counts as a successful " +
          "coup, as against a forced resignation or a reshuffle under pressure, is a judgement.",
        notes:
          "NEEDS BETTER SOURCING: each coup should have its own dated record with its participants named. " +
          "This record summarises a decade that deserves ten.",
      },
    ],
  },

  {
    slug: "kerekou-1972-and-marxism-leninism",
    title: "1972: Kérékou takes power, and the state turns Marxist-Leninist",
    summary:
      "Major Mathieu Kérékou seized power on 26 October 1972. From 1974 the government adopted Marxism-Leninism, nationalised the economy and attacked practices it called feudal — including traditional religion.",
    description:
      "WHAT HAPPENED. On 26 October 1972, Major — later General — Mathieu Kérékou seized power in the last " +
      "of the sequence of coups. From 1974 his government adopted MARXISM-LENINISM as state ideology, with " +
      "nationalisation, state planning and a single party.\n\n" +
      "WHAT IT MEANT FOR THE SUBJECTS OF THIS TIMELINE. A revolutionary state committed to modernisation " +
      "treated traditional religious practice as FEUDAL AND OBSCURANTIST — and campaigned against it. " +
      "Vodun, which had survived a colonial administration that called it fetishism, now faced a " +
      "revolutionary one that called it backwardness. THE TWO CAMPAIGNS HAD OPPOSITE JUSTIFICATIONS AND " +
      "THE SAME TARGET, which is worth noticing before assuming that hostility to traditional religion " +
      "belongs to any one politics.\n\n" +
      "IT ALSO SURVIVED THIS. Which is the point the Vodun records make: the practice outlasted a colonial " +
      "administration, a revolutionary state, and both of their campaigns, and was recognised by a later " +
      "government within two decades of the second.\n\n" +
      "HOW THE PERIOD ENDED. In economic crisis at the end of the 1980s, with the state unable to pay its " +
      "employees. Kérékou renounced Marxism-Leninism as state ideology in 1989, and the National " +
      "Conference followed.\n\n" +
      "THINGS TO ASK: Why would two governments with opposite ideologies attack the same religion?",
    category: "history",
    subcategory: "Modern Bénin",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["modern-benin", "politics", "kerekou", "marxism", "vodun", "religion", "coups"],
    people: ["Mathieu Kérékou"],
    civilisations: ["People's Republic of Bénin"],
    locationName: "Cotonou, Bénin",
    lat: 6.37,
    lng: 2.4,
    claims: [
      {
        sourceKey: "britannica_history_of_benin",
        startYear: 1972,
        startMonth: 10,
        startDay: 26,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Kérékou's seizure of power",
        originalDateText: "26 October 1972",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "A DOCUMENTED EVENT with contemporary reporting and official records on both sides. A COUP IS ONE OF THE BEST-DATED KINDS OF EVENT THERE IS, because everybody involved has a reason to fix the moment authority changed hands.",
      },
      {
        sourceKey: "britannica_history_of_benin",
        startYear: 1974,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "The adoption of Marxism-Leninism as state ideology",
        originalDateText: "From 1974",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY IT IS A SEPARATE CLAIM FROM THE COUP: the seizure of power in 1972 was not ideological on " +
          "its face, and the turn to Marxism-Leninism came afterwards. Merging them would make the second " +
          "look like the purpose of the first.",
      },
      {
        sourceKey: "britannica_history_of_benin",
        startYear: 1989,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The renunciation of Marxism-Leninism as state ideology",
        originalDateText: "1989",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "AN ANNOUNCED CHANGE OF POLICY, in the context of an economic crisis that had left the state unable to pay its employees. WHAT IS DATED IS THE ANNOUNCEMENT, not the change in what the government actually did, which had been under way for some time and continued afterwards.",
      },
    ],
    media: [
      {
        url: commons("Monument to the victims of the coup attempt of January 16, 1977. Place des Martyrs, Cotonou, Bénin.JPG"),
        sourcePageUrl: commonsPage("Monument to the victims of the coup attempt of January 16, 1977. Place des Martyrs, Cotonou, Bénin.JPG"),
        fileName: "Monument to the victims of the coup attempt of January 16, 1977. Place des Martyrs, Cotonou, Bénin.JPG",
        caption:
          "The monument at Place des Martyrs in Cotonou to the victims of the attempted coup of 16 January 1977. It commemorates an attack on the revolutionary government five years into its rule — a monument of the period rather than a record of the seizure of power in 1972.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceNotes:
          "The monument is to the 1977 attempt, NOT to the 1972 coup this record is about. The caption says so because the two are easily conflated.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "renamed-benin-1975",
    title: "1975: Dahomey becomes Bénin",
    summary:
      "The country was renamed the People's Republic of Bénin, taking a neutral geographical name from the Bight of Benin rather than the name of one southern kingdom.",
    description:
      "WHAT HAPPENED. In 1975 the Republic of Dahomey was renamed the PEOPLE'S REPUBLIC OF BÉNIN.\n\n" +
      "WHY THE NAME WAS CHANGED. Because 'Dahomey' was the name of ONE KINGDOM, in the south, which had " +
      "conquered some of its neighbours and never ruled others at all — and using it for a country " +
      "containing Bariba, Somba, Dendi, Yoruba, Gun, Hueda and many more made the whole nation an " +
      "extension of the Fon south. A revolutionary government committed to national unity had an obvious " +
      "reason to want a name that belonged to nobody in particular.\n\n" +
      "WHERE THE NEW NAME CAME FROM. The BIGHT OF BENIN, the stretch of coast — a geographical feature, " +
      "shared, neutral between the country's peoples.\n\n" +
      "THE CONSEQUENCE NOBODY WANTED. A permanent confusion with the KINGDOM OF BENIN, the Edo state in " +
      "what is now Nigeria, famous for the Benin Bronzes taken by a British expedition in 1897. The two " +
      "are different places with different histories, and the collision between them now pollutes every " +
      "search anybody makes about either.\n\n" +
      "WHAT SURVIVED THE CHANGE. 'People's Republic' did not — the country became simply the Republic of " +
      "Bénin after 1990. 'Bénin' did.\n\n" +
      "THINGS TO ASK: Is there any name this country could have taken that would not have privileged " +
      "somebody?",
    category: "history",
    subcategory: "Modern Bénin",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["modern-benin", "naming", "politics", "identity", "kerekou", "method"],
    civilisations: ["People's Republic of Bénin"],
    locationName: "Bénin",
    lat: 9.3,
    lng: 2.3,
    claims: [
      {
        sourceKey: "britannica_history_of_benin",
        startYear: 1975,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The renaming of the country",
        originalDateText: "1975",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "A GOVERNMENT ACT WITH AN OFFICIAL RECORD, which makes the date firm. WHAT THE DATE DOES NOT CAPTURE: the argument behind it, which was about whether a country containing Bariba, Somba, Dendi, Yoruba and Gun peoples should carry the name of one southern kingdom.",
      },
    ],
  },

  {
    slug: "national-conference-1990",
    title: "February 1990: the National Conference",
    summary:
      "A national conference of the country's political and social forces stripped the government of power and set a democratic transition in motion — a model copied across francophone Africa.",
    description:
      "WHAT HAPPENED. In February 1990, with the state bankrupt and unable to pay its employees, a " +
      "CONFERENCE OF THE LIVING FORCES OF THE NATION was convened, bringing together political figures, " +
      "trade unions, religious leaders, professional bodies and exiles. The conference declared itself " +
      "SOVEREIGN, suspended the constitution, stripped Kérékou of most of his powers, appointed a " +
      "transitional government and set elections in motion.\n\n" +
      "WHY IT IS INTERNATIONALLY IMPORTANT. Because it worked, and because it was copied. Bénin's national " +
      "conference became the model for transitions across francophone Africa in the early 1990s. AND " +
      "BECAUSE OF HOW IT ENDED: Kérékou accepted the outcome, lost the presidential election of 1991, left " +
      "office — and was elected president again in 1996, by vote.\n\n" +
      "WHAT FOLLOWED. A new constitution in 1990, multiparty elections, and the Republic of Bénin. Among " +
      "the acts of the governments that followed was the recognition of Vodun as a religion and the " +
      "establishment of its national holiday — a direct consequence of this transition and the reason it " +
      "matters to the other lanes of this timeline.\n\n" +
      "WHAT THIS RECORD DOES NOT DO. Present the transition as a completed or untroubled story. It " +
      "records a specific, dated, consequential sequence and stops there.\n\n" +
      "THINGS TO ASK: Why did this work here when similar attempts elsewhere did not?",
    category: "history",
    subcategory: "Modern Bénin",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["modern-benin", "politics", "democracy", "kerekou", "transition", "constitution"],
    people: ["Mathieu Kérékou", "Nicéphore Soglo"],
    civilisations: ["Republic of Bénin"],
    locationName: "Cotonou, Bénin",
    lat: 6.37,
    lng: 2.4,
    claims: [
      {
        sourceKey: "britannica_history_of_benin",
        startYear: 1990,
        startMonth: 2,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The National Conference",
        originalDateText: "February 1990",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "A DOCUMENTED, TELEVISED, INTERNATIONALLY REPORTED EVENT with an official record, watched across francophone Africa at the time. THE PUBLICITY IS PART OF WHY IT WORKED and part of why it was copied, so the fact that it was broadcast is evidence rather than background.",
      },
      {
        sourceKey: "britannica_history_of_benin",
        startYear: 1990,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The new constitution",
        originalDateText: "1990",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY SEPARATE FROM THE CONFERENCE: a conference is an event and a constitution is a document, " +
          "and the second was the conference's product rather than the conference itself.",
      },
    ],
  },

  {
    slug: "abomey-world-heritage",
    title: "The Royal Palaces of Abomey become World Heritage — and go straight onto the Danger List",
    summary:
      "Inscribed in 1985 and placed on the List of World Heritage in Danger at the same moment, because a tornado in 1984 had done severe damage. Removed from the Danger List in 2007.",
    description:
      "WHAT HAPPENED, AND IN WHAT ORDER. A tornado struck in 1984, causing severe damage to earthen " +
      "structures already fragile. In 1985 the Royal Palaces of Abomey were inscribed on the World " +
      "Heritage List AND, simultaneously, on the LIST OF WORLD HERITAGE IN DANGER — the Committee citing " +
      "the tornado damage and the urgency of the work needed.\n\n" +
      "WHY SIMULTANEOUS LISTING IS UNUSUAL AND TELLING. It is a recognition and an alarm in one act: this " +
      "is of outstanding value to humanity, AND it may not survive. It also unlocked assistance, which was " +
      "the practical point.\n\n" +
      "WHAT FOLLOWED. A conservation programme, part-financed by the World Heritage Fund, improving " +
      "management, resources for the site's museums and staffing. In 2007 the World Heritage Committee " +
      "removed the palaces from the Danger List.\n\n" +
      "WHY EARTHEN ARCHITECTURE IS THE HARD CASE FOR CONSERVATION. Because it must be MAINTAINED to " +
      "survive — replastered, reroofed, repaired — which means the fabric is continually renewed, and the " +
      "distinction between conservation and reconstruction is genuinely difficult. A stone cathedral can " +
      "be stabilised and left. An earthen palace cannot.\n\n" +
      "THE HISTORY THIS RECORD IS PART OF. The palaces were burned in 1892, their contents removed to " +
      "Paris, damaged again in 1984, conserved from 1985, taken off the Danger List in 2007, and in 2021 " +
      "began receiving objects back. THE SITE'S OWN HISTORY SINCE THE KINGDOM ENDED IS AS EVENTFUL AS " +
      "MUCH OF WHAT PRECEDED IT.\n\n" +
      "THINGS TO ASK: When a building must be renewed to survive, what exactly is being preserved?",
    category: "history",
    subcategory: "Heritage",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["heritage", "unesco", "abomey", "architecture", "conservation", "modern-benin"],
    civilisations: ["Republic of Bénin"],
    locationName: "Royal Palaces of Abomey, southern Bénin",
    lat: 7.185,
    lng: 1.99,
    claims: [
      {
        sourceKey: "unesco_abomey_whc_atlantic",
        startYear: 1984,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The tornado that damaged the palaces",
        originalDateText: "1984",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "RECORDED IN THE WORLD HERITAGE COMMITTEE'S OWN REASONING for the Danger listing, which names the tornado damage as the ground for it. THE DOCUMENT DATING THE DISASTER IS THE ONE RESPONDING TO IT, a year later — which is ordinary, and is why the damage is dated to a year rather than a day here.",
      },
      {
        sourceKey: "unesco_abomey_whc_atlantic",
        startYear: 1985,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Inscription on the World Heritage List and simultaneous Danger listing",
        originalDateText: "1985",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "TWO DECISIONS OF THE WORLD HERITAGE COMMITTEE IN THE SAME SESSION, with published records. Inscribing a property and declaring it endangered at once is a recognition and an alarm in a single act, and it is what unlocked the assistance that eventually paid for the conservation.",
      },
      {
        sourceKey: "unesco_abomey_whc_atlantic",
        startYear: 2007,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Removal from the List of World Heritage in Danger",
        originalDateText: "2007",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "A Committee decision, following assessment of the conservation programme. TWENTY-TWO YEARS " +
          "BETWEEN THE ALARM AND THE ALL-CLEAR, which is a useful measure of how long this kind of work " +
          "actually takes.",
      },
    ],
  },

  {
    slug: "restitution-2021",
    title: "November 2021: twenty-six royal treasures return",
    summary:
      "Objects taken from Abomey in 1892 were transferred to Bénin under a French law of 2020. The transfer of ownership was signed on 9 November 2021.",
    description:
      "WHAT WAS RETURNED. Twenty-six objects taken from the palaces of Abomey by General Dodds's " +
      "expedition in 1892, held in France since 1893 — first at the Musée d'Ethnographie du Trocadéro, " +
      "then in the collections of the Musée du quai Branly – Jacques Chirac. Among them are the large " +
      "anthropomorphic royal statues: Ghezo, Glèlè as a lion-man, Béhanzin as a shark-man.\n\n" +
      "HOW IT WAS DONE, LEGALLY. French public collections are in principle inalienable, so a specific law " +
      "was required. A bill was passed by the National Assembly in October 2020, amended by the Senate in " +
      "November, and adopted in December 2020. The objects were shown in Paris for a final week at the " +
      "end of October 2021, and the transfer of ownership was signed at the Élysée on 9 NOVEMBER 2021 by " +
      "the presidents of France and Bénin.\n\n" +
      "WHY THE LEGAL MECHANISM MATTERS. Because it establishes what kind of act this was: a one-off " +
      "transfer by specific legislation, not a change in the general rule. That is the point on which the " +
      "wider restitution argument turns.\n\n" +
      "WHAT IT SETTLED AND WHAT IT DID NOT. It returned twenty-six objects. Many thousands of African " +
      "objects remain in European collections, including a great many from this region, and Bénin has " +
      "continued to press for more. A RESTITUTION OF TWENTY-SIX ITEMS IS A PRECEDENT, A CEREMONY AND A " +
      "BEGINNING, and it was described as all three at the time.\n\n" +
      "WHAT CHANGES FOR THE OBJECTS. A statue made at Abomey, taken in 1892, displayed in Paris for 128 " +
      "years and returned in 2021 has a biography, and this timeline's photographs of it in Paris are now " +
      "records of a period that has ended.\n\n" +
      "THINGS TO ASK: What does an object gain by going home? What does the museum that held it lose?",
    category: "history",
    subcategory: "Restitution",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["restitution", "heritage", "royal-art", "france", "abomey", "museum-object", "modern-benin", "looting"],
    people: ["Patrice Talon", "Emmanuel Macron"],
    civilisations: ["Republic of Bénin", "France"],
    locationName: "Paris and Cotonou",
    lat: 6.37,
    lng: 2.4,
    claims: [
      {
        sourceKey: "quai_branly_restitution_atlantic",
        startYear: 2020,
        startMonth: 12,
        startDay: 17,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The final adoption of the French law permitting the transfer",
        originalDateText: "Passed by the National Assembly on 17 December 2020, after first reading on 6 October and Senate amendment on 4 November",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "A LEGISLATIVE RECORD, with each stage dated. The sequence is entered in one claim because it " +
          "is one process; the three dates in the wording are its stages.",
      },
      {
        sourceKey: "quai_branly_restitution_atlantic",
        startYear: 2021,
        startMonth: 11,
        startDay: 9,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The signing of the transfer of ownership",
        originalDateText: "9 November 2021, at the Élysée Palace",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "A DOCUMENTED CEREMONIAL ACT between two heads of state. NOTE WHAT IS BEING DATED: the transfer " +
          "of OWNERSHIP, which is not the same as the objects' arrival in Bénin or their going on display " +
          "there — those are further dates and are not entered here.",
      },
    ],
    media: [
      {
        url: commons("Statues royales, Abomey, Musée du quai Branly.jpg"),
        sourcePageUrl: commonsPage("Statues royales, Abomey, Musée du quai Branly.jpg"),
        fileName: "Statues royales, Abomey, Musée du quai Branly.jpg",
        caption:
          "The royal statues of Abomey photographed in the Musée du quai Branly in Paris, before the 2021 transfer. The photograph now documents a period that has ended — which is what makes dated pictures of museum displays worth keeping.",
        kind: "image",
        shows: "artefact",
        institution: "Musée du quai Branly – Jacques Chirac (at the time of the photograph)",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "Taken from Abomey in 1892; transferred to Bénin in 2021. The caption must carry the date of " +
          "the photograph for exactly that reason.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "restitution-what-next",
    title: "What should happen to the rest?",
    summary:
      "Twenty-six objects went back. Enormous holdings from this region remain in European and American collections, and the arguments on every side of what to do about them are live.",
    description:
      "WHAT KIND OF RECORD IS THIS? A live argument, recorded as one, about a question this timeline has " +
      "no business settling.\n\n" +
      "THE CASE FOR RETURN. The objects were taken by force in a war of conquest; they belong to the " +
      "communities that made them and to their descendants; holding them is a continuation of the act " +
      "that acquired them; and Bénin has built museums to receive them.\n\n" +
      "THE CASES MADE AGAINST OR FOR CAUTION. That collections are held for a world public; that " +
      "provenance is often unclear, so a general rule would be applied to cases that do not resemble each " +
      "other; that conservation conditions must be assured; and that once inalienability is breached the " +
      "legal position of every collection changes. THESE ARGUMENTS VARY ENORMOUSLY IN STRENGTH, and some " +
      "are made in good faith by people who also support returns.\n\n" +
      "WHAT IS DIFFERENT ABOUT THE ABOMEY CASE. Very little is unclear. The objects were taken in a " +
      "documented military campaign, from a named place, in a known year, and the holding museum says so " +
      "in its own catalogue. THE PROVENANCE ARGUMENT DOES NOT APPLY HERE, which is part of why this case " +
      "moved first.\n\n" +
      "WHAT A TIMELINE CAN USEFULLY DO. Record what was taken, when, from where, by whom, where it went, " +
      "what has been returned and when. That is a factual basis for an argument other people will have.\n\n" +
      "THINGS TO ASK: Who should decide? And on what principle that would work for every case, not just " +
      "the clear ones?",
    category: "history",
    subcategory: "Debate",
    eventType: "disputed",
    tags: ["debate", "restitution", "heritage", "museum-object", "colonialism", "modern-benin", "ethics"],
    civilisations: ["Republic of Bénin", "France"],
    locationName: "Bénin, France and the museums of Europe and North America",
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "What should happen to the objects still held abroad",
        originalDateText: "Unresolved and actively argued",
        datingMethod: "other",
        chronology: "disputed",
        evidence:
          "WHY THIS CLAIM CARRIES NO POSITION: it is a question about what ought to happen, not about " +
          "when something did. It is entered as a claim so the interface can show it as open, rather than " +
          "leaving the 2021 return to read as the end of the story.",
      },
    ],
    media: [
      {
        url: commons("Statues royales, Abomey, Musée du quai Branly.jpg"),
        sourcePageUrl: commonsPage("Statues royales, Abomey, Musée du quai Branly.jpg"),
        fileName: "Statues royales, Abomey, Musée du quai Branly.jpg",
        caption:
          "The Abomey royal statues photographed in Paris before their return. Twenty-six objects went home in 2021; the argument this record is about concerns everything that did not.",
        kind: "image",
        shows: "artefact",
        institution: "Musée du quai Branly – Jacques Chirac (at the time of the photograph)",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "living-traditions-now",
    title: "What is still running",
    summary:
      "Fa is consulted, Zangbeto patrol, Gèlèdé performs, pythons are carried home, royal lineages keep their obligations, and Vodun has a national holiday. The timeline does not end in the past.",
    description:
      "WHAT THIS RECORD IS FOR. To stop the timeline reading as a sequence that finished. Every major " +
      "tradition in this dataset is in use.\n\n" +
      "WHAT IS ACTIVE. FA is consulted and bokonon are trained. ZANGBETO societies operate in Ogu " +
      "communities and perform publicly. GÈLÈDÉ is performed, and is inscribed by UNESCO. EGUNGUN comes " +
      "out at Porto-Novo. The PYTHONS at Ouidah are venerated, and a python found in a house is carried " +
      "back rather than killed. SHRINES are maintained, offerings made, initiations conducted. ROYAL " +
      "LINEAGES at Abomey keep obligations to the royal dead, more than a century after the kingdom ended " +
      "as a state. And VODUN has a national holiday on 10 January, expanded since 2024 into Vodun Days.\n\n" +
      "WHAT HAS CHANGED, BECAUSE SAYING 'IT CONTINUES' IS NOT ENOUGH. These traditions have passed through " +
      "conquest, colonial administration, missionary expansion, a revolutionary state hostile to them, " +
      "and now state promotion, heritage listing and international tourism. THE LAST OF THOSE IS NOT " +
      "NEUTRAL EITHER: a tradition that is promoted, ticketed and photographed changes, as traditions " +
      "under any other pressure do.\n\n" +
      "THE HONEST POSITION. Continuity and change are not opposites. What runs today is genuinely " +
      "descended from what this timeline describes, and it is not identical to it, and no living tradition " +
      "anywhere ever is.\n\n" +
      "THINGS TO ASK: What would it take for you to say a tradition had ended?",
    category: "culture",
    subcategory: "Continuity",
    eventType: "historical",
    tags: ["modern-benin", "vodun", "fa", "zangbeto", "gelede", "continuity", "heritage", "ouidah"],
    civilisations: ["Republic of Bénin"],
    locationName: "Bénin",
    lat: 7.0,
    lng: 2.2,
    claims: [
      {
        sourceKey: null,
        startYear: 1990,
        isOngoing: true,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period of public revival, recognition and heritage promotion",
        originalDateText: "From the democratic transition to the present",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY THE RANGE STARTS AT 1990 AND NOT EARLIER: because what changed then was PUBLIC AND " +
          "OFFICIAL status, not the practice, which had continued throughout. Dating the practice from " +
          "1990 would describe a revival of something that had not stopped.",
      },
    ],
    media: [
      {
        url: commons("Zangbeto Masquerade performance at the 2025 ogu - weme annual festival 2.jpg"),
        sourcePageUrl: commonsPage("Zangbeto Masquerade performance at the 2025 ogu - weme annual festival 2.jpg"),
        fileName: "Zangbeto Masquerade performance at the 2025 ogu - weme annual festival 2.jpg",
        caption:
          "A Zangbeto performance at the Ogu-Wémé annual festival in 2025. A dated photograph of a living institution, which is the most straightforward possible evidence that this timeline does not end in the past.",
        kind: "image",
        shows: "site",
        imageDate: "2025",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Le Temple des Pythons de Ouidah.jpg"),
        sourcePageUrl: commonsPage("Le Temple des Pythons de Ouidah.jpg"),
        fileName: "Le Temple des Pythons de Ouidah.jpg",
        caption:
          "The python temple at Ouidah, in use. Pythons are still carried back when found in the town rather than killed — the oldest continuously documented observance in this dataset, and an entirely ordinary part of the present.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },
];

export const BENIN_ATLANTIC_LINKS: SeedEventLink[] = [
  {
    from: "ouidah-one-landscape-many-worlds",
    to: "european-forts-at-ouidah",
    relation: "related",
    viewpoint: "historical",
    sourceKey: "law_ouidah_social_history",
    note: "The town, and the three small buildings in it that stand for European presence.",
  },
  {
    from: "european-forts-at-ouidah",
    to: "portuguese-fort-until-1961",
    relation: "precedes",
    viewpoint: "historical",
    note: "One of the three outlasted the kingdom, the colony and independence itself.",
  },
  {
    from: "savi-excavated",
    to: "ouidah-one-landscape-many-worlds",
    relation: "related",
    viewpoint: "archaeological",
    note: "The inland capital and its port: two parts of one kingdom's Atlantic arrangement.",
  },
  {
    from: "ouidah-and-the-scale-of-the-trade",
    to: "de-souza-and-place-chacha",
    relation: "related",
    viewpoint: "historical",
    note: "The scale, and one of the people who organised it at this port.",
  },
  {
    from: "ouidah-and-the-scale-of-the-trade",
    to: "british-suppression-and-the-illegal-trade",
    relation: "precedes",
    viewpoint: "historical",
    note: "The trade, and the long campaign that eventually ended it without ending slavery.",
  },
  {
    from: "ouidah-and-the-scale-of-the-trade",
    to: "ouidah-slave-route-memorial",
    relation: "related",
    viewpoint: "community",
    sourceKey: "unesco_slave_route_project",
    note: "What happened, and how the town commemorates it two centuries later.",
  },
  {
    from: "french-dahomey-colony",
    to: "colonial-taxation-labour-and-resistance",
    relation: "source_of",
    viewpoint: "historical",
    note: "The colony, and how it was paid for.",
  },
  {
    from: "colonial-taxation-labour-and-resistance",
    to: "world-wars-and-conscription",
    relation: "related",
    viewpoint: "historical",
    note: "Conscription is one of the obligations the colonial state imposed, and one with unusually direct political consequences.",
  },
  {
    from: "world-wars-and-conscription",
    to: "independence-1960",
    relation: "precedes",
    viewpoint: "historical",
    note: "Veterans were prominent in the post-war politics that led here.",
  },
  {
    from: "independence-1960",
    to: "coups-1963-1972",
    relation: "precedes",
    viewpoint: "historical",
    note: "The inheritance, and the decade it produced.",
  },
  {
    from: "coups-1963-1972",
    to: "kerekou-1972-and-marxism-leninism",
    relation: "precedes",
    viewpoint: "historical",
    note: "The last coup of the sequence, and the seventeen years that followed it.",
  },
  {
    from: "kerekou-1972-and-marxism-leninism",
    to: "renamed-benin-1975",
    relation: "source_of",
    viewpoint: "historical",
    note: "A revolutionary government committed to national unity had a reason to change the country's name.",
  },
  {
    from: "kerekou-1972-and-marxism-leninism",
    to: "national-conference-1990",
    relation: "precedes",
    viewpoint: "historical",
    note: "Economic collapse at the end of the 1980s produced the conference.",
  },
  {
    from: "national-conference-1990",
    to: "ouidah-slave-route-memorial",
    relation: "precedes",
    viewpoint: "historical",
    note: "The memorials, the festival and the recognition of Vodun all follow the transition and the opening that came with it.",
  },
  {
    from: "abomey-world-heritage",
    to: "restitution-2021",
    relation: "precedes",
    viewpoint: "historical",
    note: "A conserved site able to receive what had been taken from it.",
  },
  {
    from: "restitution-2021",
    to: "restitution-what-next",
    relation: "responds_to",
    viewpoint: "disputed",
    note: "Twenty-six objects, and the argument about everything else.",
  },
  {
    from: "renamed-benin-1975",
    to: "living-traditions-now",
    relation: "precedes",
    viewpoint: "historical",
    note: "From a state hostile to traditional religion to one that gave it a national holiday, in under twenty years.",
  },
];
