// OKOMILO: HOW FAR BACK ONE FAMILY CAN RESPONSIBLY BE TRACED.
//
// WHAT THIS DATASET IS. A genealogical investigation that ends in an honest
// break rather than a complete tree. It runs from two documented twentieth-
// century people, up through a family, a kindred, a quarter, a town and a clan,
// into an oral tradition of migration from the Kingdom of Benin — and it marks,
// precisely, the point where documentation stops and tradition takes over.
//
// THE MOST IMPORTANT RECORD IN IT IS A GAP. Between the Okomilo family's
// founder and the descent structure of Ogbona there is no evidence available
// here at all. Nothing in this file bridges it, and the temptation to bridge it
// is exactly what a genealogy of this kind has to resist. KNOWN → UNKNOWN →
// ORAL TRADITION RESUMES is the shape of the answer, and it is a better answer
// than an unbroken line would be.
//
// THE TWO BENINS. This dataset is about the KINGDOM OF BENIN — the Edo state
// centred on Benin City in what is now Edo State, NIGERIA. It has nothing to do
// with the Republic of Bénin, formerly Dahomey, which is a different country
// with a different history and took its name in 1975 from the Bight of Benin.
// Every `civilisations` entry here says "Kingdom of Benin" or "Edo" and never
// simply "Benin", because the collision between the two names is the single
// commonest error in this whole subject area.
//
// WHAT IS ACTUALLY ESTABLISHED, IN ONE PARAGRAPH. Two Okomilo individuals are
// documented in a community-history publication: Sam Ikhenemho Okomilo and
// Veronica Okomilo. The Okomilo family is listed as one of nine families of
// Innih. Innih is a kindred of Ivhitse; Ivhitse sits within Ivhiochie; Ivhiochie
// is one of the quarters of Ogbona; Ogbona is one of four communities of
// Avhianwu; Avhianwu traces itself to Anwu, who is said to have come out of the
// Kingdom of Benin. EVERY LINK IN THAT CHAIN ABOVE THE FAMILY IS A STRUCTURAL
// STATEMENT ABOUT COMMUNITIES, NOT A DESCENT FROM FATHER TO SON — and the
// difference between those two things is what most family trees quietly lose.
//
// SOURCE DEPENDENCY, WHICH IS THE METHODOLOGICAL SPINE HERE. Almost everything
// specific in this dataset traces to ONE publisher: ogbonaelites.org, a
// community-history website. Several of its pages disagree with each other, and
// several of its claims probably descend from one 1999 book, The Descent of
// Avhianwu. FIVE PAGES REPEATING ONE SENTENCE ARE ONE SOURCE, NOT FIVE
// CONFIRMATIONS, and this file says so wherever it matters.
//
// WHAT COULD NOT BE REACHED. Everything. The network policy in the environment
// this was written in refused every archive, library catalogue, museum database
// and journal: the National Archives of Nigeria, the UK National Archives,
// Digital Benin, HathiTrust, Internet Archive, JSTOR and the rest. Search
// results were the only channel. NO QUOTATION FROM THE DESCENT OF AVHIANWU
// APPEARS HERE, because the book could not be opened. The missing-links record
// names what to go and read instead.

import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

export const OKOMILO_ANCHOR_SLUG = "okomilo-how-far-back";

export const OKOMILO_TRACK: SeedTrack = {
  name: "Okomilo: a family, a kindred, a clan, and where the evidence stops",
  slug: "okomilo-lineage",
  kind: "region",
  color: "#2f8f6b",
};

const commons = (file: string, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
const commonsPage = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;

export const OKOMILO_SOURCES: SeedSource[] = [
  {
    key: "ogbona_elites",
    title: "Ogbona Elites",
    workTitle: "Community history website for Ogbona, Etsako Central, Edo State",
    url: "https://ogbonaelites.org/",
    sourceType: "website",
    notes:
      "THE SOURCE ALMOST EVERYTHING SPECIFIC IN THIS DATASET COMES FROM, and the reason the dataset has a " +
      "source-dependency record. A community-history site publishing biographies, family and kindred lists, " +
      "festival accounts, chieftaincy profiles and clan history for Ogbona and Avhianwu. WHAT IT IS GOOD " +
      "FOR: it is written by and for the community it describes, it names individuals and families, and it " +
      "publishes structural lists that no outside scholar has produced. WHAT TO WATCH: its pages disagree " +
      "with one another on the descent of Ogbona and on the date of the Benin migration; it is not edited " +
      "to a single standard; and several of its historical claims probably descend from The Descent of " +
      "Avhianwu without always saying so. NEEDS SOURCE VERIFICATION throughout — every page cited here was " +
      "reached through a search index rather than read directly, because the network policy refused it.",
  },
  {
    key: "ogbona_kindreds_list_2024",
    title: "Ogbona Sub-Clan, Villages and the Kindreds/Families and Palace Chiefs, November 2024",
    publisher: "Ogbona Elites",
    url: "https://ogbonaelites.org/ogbona-sub-clan-villages-and-the-kindreds-families/",
    sourceType: "website",
    publishedYear: 2024,
    publishedDisplay: "November 2024",
    notes:
      "THE SINGLE MOST IMPORTANT DOCUMENT FOR THE OKOMILO QUESTION. A structural list of Ogbona's quarters, " +
      "their kindreds, the villages and the families within them, with current palace chiefs. It is what " +
      "places the Okomilo family in Innih and Innih among the kindreds of Ivhitse. WHAT KIND OF SOURCE IT " +
      "IS: a CONTEMPORARY ADMINISTRATIVE LIST, dated 2024, describing the present arrangement. It is not a " +
      "genealogy and does not claim to be — it records which families exist where NOW, and says nothing " +
      "about when any of them arrived or whom they descend from.",
  },
  {
    key: "ogbona_profiles",
    title: "Profiles and biographies of Ogbona men and women",
    publisher: "Ogbona Elites",
    url: "https://ogbonaelites.org/profiles-of-some-of-ogbona-men-and-women/",
    sourceType: "website",
    notes:
      "Biographical notices of people from Ogbona, and the source for both documented Okomilo individuals: " +
      "Sam Ikhenemho Okomilo and Veronica Okomilo. WHAT KIND OF SOURCE: community biography, evidently " +
      "written from family information and personal knowledge rather than from documents. That makes it " +
      "GOOD on names, relationships and the order of a life, and WEAK on dates — which is exactly the " +
      "pattern visible in the chronological problem recorded on Sam's own record.",
  },
  {
    key: "descent_of_avhianwu_1999",
    title: "The Descent of Avhianwu",
    author: "Aha Idokpesi Okhaishie N'Avhianwu",
    publisher: "Stirling-Horden Publishers Ltd, Ibadan",
    reference: "First edition, 1999, 174 pages, illustrated",
    sourceType: "book",
    publishedYear: 1999,
    publishedDisplay: "1999",
    notes:
      "PROBABLY THE UNDERLYING SOURCE FOR MUCH OF WHAT CIRCULATES ABOUT AVHIANWU HISTORY, and it could not " +
      "be read here. Its existence, author, publisher, date, length and illustrated status are confirmed " +
      "from catalogue listings; NOTHING FROM ITS CONTENTS IS QUOTED ANYWHERE IN THIS DATASET, because no " +
      "copy or preview could be reached and inventing a quotation from an inaccessible book is the worst " +
      "thing a genealogical record can do. IT IS THE NUMBER ONE NEXT LEAD: the migration dates, the four " +
      "sons of Anwu, the Alokoko tradition and the descent of Ogbona should all be checked against it, and " +
      "the question of whether the community website's competing versions both come out of this one book " +
      "can only be answered by reading it.",
  },
  {
    key: "denton_kukuruku_1936",
    title: "Political Intelligence Report on the Etsako Clans of the Kukuruku Division",
    author: "Denton",
    publisher: "National Archives of Nigeria, Ibadan",
    reference: "1936",
    sourceType: "government",
    publishedYear: 1936,
    publishedDisplay: "1936",
    notes:
      "THE BEST UNEXAMINED DOCUMENTARY LEAD IN THIS WHOLE INVESTIGATION. A colonial political intelligence " +
      "report on the Etsako clans, written in 1936, held at the National Archives in Ibadan. Reports of " +
      "this class routinely record clan and village structure, the names of village and family heads, " +
      "genealogies as recited to the officer, land and succession disputes, and population. IF THE OKOMILO " +
      "FAMILY APPEARS IN A WRITTEN DOCUMENT BEFORE THE MODERN PERIOD, THIS IS THE MOST LIKELY PLACE. It " +
      "could not be consulted from here; its viewpoint, when it is consulted, is a colonial administrator " +
      "recording what he was told by the people he was administering.",
  },
  {
    key: "avhianwu_oral_tradition",
    title: "Avhianwu and Ogbona oral tradition, as published by community historians",
    reference: "Migration, foundation and descent traditions of Anwu, Alokoko and the four communities",
    sourceType: "oral_tradition",
    notes:
      "WHAT THIS ENTRY IS. The body of tradition itself — Anwu and Alokoko, the four sons, the migration " +
      "from Benin, the python taboo — as transmitted within Avhianwu and written down by community " +
      "historians. IT IS EVIDENCE AND IT IS NOT A TRANSCRIPT. What a better version of this dataset would " +
      "record for every tradition here, and cannot: who told it, to whom, where, and in what year. Those " +
      "four facts are what make an oral source checkable, and not one of them is available for any " +
      "tradition in this file.",
  },
  {
    key: "etsako_wikipedia",
    title: "Wikipedia articles on the Etsako/Afemai people, the Afenmai language, Osanobua, Ewuare, Ozolua and Odionwere",
    url: "https://en.wikipedia.org/wiki/Etsako_people",
    sourceType: "wikipedia",
    notes:
      "USED FOR NAVIGATION, FOR LANGUAGE CLASSIFICATION AND FOR CROSS-CHECKING REGNAL DATES. Never the " +
      "evidence for a claim about the Okomilo family or about Avhianwu tradition. Where a record rests on " +
      "nothing stronger, its notes say so.",
  },
  {
    key: "egharevba_short_history_1934",
    title: "A Short History of Benin",
    author: "Jacob U. Egharevba",
    publisher: "Church Missionary Society Press, Lagos",
    sourceType: "book",
    publishedYear: 1934,
    publishedDisplay: "First published 1934",
    notes:
      "THE BOOK THAT MADE MODERN BENIN HISTORY, AND THE ONE MOST OF IT STILL RESTS ON. Egharevba, a Bini " +
      "local historian, published on Benin history and culture from the 1930s to the 1970s, and the " +
      "reconstruction of early Benin history depends on his work almost exclusively — which is a " +
      "source-dependency problem of the same shape as this dataset's own, one level up. CITED HERE FOR THE " +
      "EGYPT CLAIM specifically: his statement that the Binis came from Egypt after a stay in the Sudan and " +
      "at Ile-Ife. Recorded as a dated published claim by a named author, never as an account of what " +
      "happened.",
  },
  {
    key: "connah_benin_earthworks",
    title: "Archaeological investigation of the Benin City earthworks (Iya)",
    author: "Graham Connah, and later Patrick Darling",
    reference: "Excavations from 1963 onwards; subsequent survey in the 1960s and 1970s",
    sourceType: "archaeological",
    notes:
      "Cited for the archaeology of Benin City: the excavation of the Iya earthworks, the radiocarbon " +
      "sample taken from a cut through the Iya in 1963, and the deep stratified sequence found in the " +
      "1960s. NEEDS SOURCE VERIFICATION for the individual determinations — and note the caveat that " +
      "travels with them, that the published error margin is large and the dates are reported uncalibrated.",
  },
  {
    key: "benin_court_art_scholarship",
    title: "Scholarship and museum documentation on Benin court and ceremonial art",
    reference: "Including the brass serpent heads from the palace turrets and their association with Olokun",
    sourceType: "museum",
    notes:
      "Cited for the brass pythons that ran down the turrets of the Oba's palace, cast in sections and " +
      "placed in pairs; for their association with Olokun, deity of the waters and of wealth; and for the " +
      "report that the palace fire of 1897 melted the brass. USED IN THIS DATASET ONLY FOR COMPARISON, and " +
      "the comparison record is explicit that a shared animal is not a shared tradition.",
  },
];

export const OKOMILO_EVENTS: SeedEvent[] = [
  // -------------------------------------------------------------------------
  // THE ANSWER, AND THE BREAK IN IT
  // -------------------------------------------------------------------------
  {
    slug: "okomilo-how-far-back",
    title: "How far back can the Okomilo family be traced?",
    summary:
      "To two documented twentieth-century individuals, one undocumented father, and a family name on a community list. Above that the chain is structural, not genealogical — and there is a break with nothing in it.",
    description:
      "THE ANCHOR RECORD OF THIS DATASET, and the honest short answer to the question it was built to ask.\n\n" +
      "WHAT IS DOCUMENTED, AS PEOPLE. Two. SAM IKHENEMHO OKOMILO, born in Jos in the 1940s, whose life is " +
      "published in a community biography. VERONICA OKOMILO, recorded as among the first females from " +
      "Ogbona to go to school. A third person is attested only by relationship: SAM'S FATHER, who is named " +
      "in no source reached here and is described only as an Okomilo who served in the Second World War.\n\n" +
      "WHAT IS DOCUMENTED, AS STRUCTURE. That an OKOMILO FAMILY is one of nine families of INNIH; that " +
      "Innih is a kindred of IVHITSE; that Ivhitse sits within IVHIOCHIE; that Ivhiochie is a quarter of " +
      "OGBONA; that Ogbona is one of four communities of AVHIANWU; and that Avhianwu traces itself to ANWU, " +
      "said to have come from the Kingdom of Benin.\n\n" +
      "THE DISTINCTION THAT THIS WHOLE DATASET TURNS ON. Those are two different kinds of fact. The first " +
      "is GENEALOGY — this person was the child of that one. The second is STRUCTURE — this family belongs " +
      "administratively and socially within that kindred, which belongs within that quarter. A structural " +
      "chain looks like a descent when it is drawn as a tree, AND IT IS NOT ONE. Being a family of Innih " +
      "does not by itself establish descent from whoever founded Innih.\n\n" +
      "SO THE SHAPE OF THE ANSWER IS:\n\n" +
      "  KNOWN            Sam Ikhenemho Okomilo; Veronica Okomilo; Sam's mother Uwomha Ikhuenena;\n" +
      "                   her father Pa Asekomhe; Sam's father, unnamed\n" +
      "  UNKNOWN          who Sam's father was; who his father was; who founded the Okomilo family;\n" +
      "                   when it came to Innih; whether it branched from another Innih family\n" +
      "  TRADITION        Ogbona's descent from Okhua and Omierele, from Imhakhena, from Anwu and\n" +
      "  RESUMES HERE     Alokoko, out of the Kingdom of Benin in the fifteenth century\n\n" +
      "HOW MANY GENERATIONS ARE ACTUALLY DOCUMENTED. Three, and only on the MOTHER'S side: Sam, his mother " +
      "Uwomha, and her father Pa Asekomhe. On the Okomilo side itself: two — Sam and his unnamed father. " +
      "THE PATERNAL LINE, WHICH IS THE ONE THE SURNAME FOLLOWS, IS THE SHORTER OF THE TWO.\n\n" +
      "THINGS TO ASK: When a family tree is drawn without gaps, what has happened to the gaps?",
    category: "people",
    subcategory: "Genealogy",
    eventType: "other",
    eventTypeNote: "A summary of the state of the evidence for one family, not an event.",
    evidenceStatus: "unresolved",
    identificationStatus: "probable",
    tags: ["okomilo", "genealogy", "innih", "ogbona", "avhianwu", "method", "etsako"],
    people: ["Sam Ikhenemho Okomilo", "Veronica Okomilo", "Uwomha Ikhuenena", "Pa Asekomhe"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Innih, Ogbona, Etsako Central, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "ogbona_profiles",
        startYear: 1940,
        endYear: 1949,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The earliest securely documented Okomilo individual",
        originalDateText: "The 1940s — the birth of Sam Ikhenemho Okomilo",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT THIS DATE IS: the earliest point at which a named Okomilo can be attached to a date from " +
          "any source reached here. IT IS NOT THE AGE OF THE FAMILY. It is the limit of the documentation " +
          "available to this investigation, which is a fact about the archives and the internet rather " +
          "than about the Okomilos.",
      },
      {
        sourceKey: "ogbona_profiles",
        startYear: 1900,
        endYear: 1925,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The implied lifetime of Sam's father, the earliest Okomilo attested at all",
        originalDateText: "Born within roughly a quarter-century before 1925, inferred from military service in the 1940s",
        datingMethod: "estimate",
        chronology: "historical",
        evidence:
          "HOW THIS RANGE IS REACHED, AND WHY IT IS SOFT. A man serving in the Second World War and " +
          "fathering a child in the 1940s was plausibly born between about 1900 and 1925. THAT IS AN " +
          "INFERENCE FROM TWO EVENTS, not a record of a birth, and it is entered as a wide range " +
          "precisely so it cannot be mistaken for one. No document naming this man was found.",
        notes:
          "NEEDS SOURCE VERIFICATION, and this is the most valuable single gap in the dataset: the name of " +
          "Sam Okomilo's father would immediately convert two documented generations into three and give " +
          "the paternal line a real foothold.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the Okomilo family was founded, and by whom",
        originalDateText: "Not established. No founder, no date, no attachment to the Innih genealogy",
        datingMethod: "other",
        chronology: "community",
        evidence:
          "THE CENTRAL ABSENCE OF THIS DATASET, recorded as a claim so that it appears on the record " +
          "rather than being felt as a silence. Nothing reached here names an Okomilo founder, dates the " +
          "family's arrival at Innih, or connects it to the descent of Ogbona. WHY IT IS POSITIONLESS: " +
          "because any position would be invented.",
      },
    ],
  },

  {
    slug: "okomilo-the-break",
    title: "The break: what sits between the family and the clan",
    summary:
      "Above Sam's father there is nothing. Below Ochie there is nothing. The gap between them is the whole unsolved problem, and it is several generations deep.",
    description:
      "WHAT KIND OF RECORD IS THIS? The gap itself, given a record so that it cannot be closed by accident.\n\n" +
      "WHAT IS ON THE LOWER EDGE OF THE GAP. Sam Ikhenemho Okomilo's father: unnamed, undated, attested " +
      "only through his son's biography and a family tradition about the war. Everything below him is " +
      "documented. Everything above him is not.\n\n" +
      "WHAT IS ON THE UPPER EDGE OF THE GAP. The descent of Ogbona as tradition gives it: Anwu and " +
      "Alokoko; their son Imhakhena; Okhua and Omierele; and Okhua's sons Ochie, Orevhor and Udokhakor. " +
      "IVHIOCHIE IS THE QUARTER OF OCHIE'S DESCENDANTS — the name says so. Everything above Ochie is " +
      "tradition. Everything below him is not recorded at all in what could be reached here.\n\n" +
      "HOW DEEP IS THE GAP. If the migration tradition is taken at face value and Anwu left Benin in the " +
      "fifteenth century, then roughly five hundred years separate Anwu from Sam's father — perhaps " +
      "fifteen to twenty generations. Of those, THE COMMUNITY TRADITION NAMES THE FIRST FOUR OR FIVE AND " +
      "THE FAMILY RECORD NAMES THE LAST TWO. Ten or more generations in the middle are named nowhere in " +
      "any source reached by this investigation.\n\n" +
      "WHY MIDDLES GO MISSING. This is the normal behaviour of oral genealogy everywhere, and it has a " +
      "name: telescoping. A tradition keeps the founding figures, because they explain who everybody is, " +
      "and it keeps the recent generations, because people remember their grandfathers. The middle has no " +
      "function and drops out. A CHAIN WITH A FULL TOP, A FULL BOTTOM AND AN EMPTY MIDDLE IS NOT A " +
      "DAMAGED GENEALOGY — IT IS THE CHARACTERISTIC SHAPE OF AN INTACT ONE.\n\n" +
      "WHAT MUST NOT BE DONE WITH THIS. Filled. A plausible list of intervening names would make the tree " +
      "look finished and would be fiction. This dataset would rather show the hole.\n\n" +
      "THINGS TO ASK: Which is more useful — a complete tree that might be wrong, or an incomplete one " +
      "you can check?",
    category: "people",
    subcategory: "Genealogy",
    eventType: "other",
    eventTypeNote: "A record of an evidential gap, deliberately not filled.",
    evidenceStatus: "unresolved",
    tags: ["okomilo", "genealogy", "method", "oral-knowledge", "innih", "ogbona", "telescoping"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Innih, Ogbona, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "The generations between Ochie and Sam Okomilo's father",
        originalDateText: "Unknown. Possibly ten or more generations, named in no source reached here",
        datingMethod: "genealogy",
        chronology: "community",
        evidence:
          "WHY THERE IS NO POSITION AND NO NUMBER. The count of ten or more is arithmetic from the " +
          "migration tradition's own date, not a count of remembered people — and if the migration date is " +
          "wrong, so is the count. WHAT WOULD FILL IT: a family genealogy recited by an Okomilo elder, an " +
          "Innih kindred genealogy, or a colonial file recording either.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE DOCUMENTED PEOPLE
  // -------------------------------------------------------------------------
  {
    slug: "sam-ikhenemho-okomilo",
    title: "Sam Ikhenemho Okomilo",
    summary:
      "Born in Jos in the 1940s to the Okomilo and Ikhuenena families; sent home to Ogbona in 1948; medical photographer, then Edinburgh, then a London publisher. The best-documented Okomilo.",
    description:
      "WHAT THE COMMUNITY BIOGRAPHY RECORDS. Sam Ikhenemho Okomilo was born in the early 1940s in JOS, in " +
      "northern Nigeria, to the families of OKOMILO and IKHUENENA, both described as of Ivhiochie quarter. " +
      "His father relocated to Ibadan. As the first son he was sent home in 1948 to learn Ogbona and " +
      "Avhianwu culture, and started at St John's Primary School, Ogbona, taught by Chief Patrick O " +
      "Oboarekpe under the headship of Chief MCK Orbih. He trained as a medical photographer at University " +
      "College Hospital Ibadan from 1960 to 1962, moved to Lagos University Teaching Hospital, and was " +
      "admitted to the University of Edinburgh where he read Politics, Philosophy and Economics from 1970 " +
      "to 1972. He is the publisher of the London-based African News File, parent of Africa Today, Who Is " +
      "Who In Africa and Makers of Modern Africa.\n\n" +
      "WHY HE IS THE PIVOT OF THIS DATASET. Because he is the one Okomilo about whom a connected life is " +
      "recorded, and because his biography is the ONLY SOURCE REACHED HERE THAT NAMES HIS PARENTS' " +
      "FAMILIES. Everything the investigation knows about the generation above him comes through this one " +
      "notice.\n\n" +
      "THE PATTERN HIS LIFE SHOWS. Born outside the homeland, in a northern city, to a father working away; " +
      "sent back as the first son specifically to be raised into the culture; educated through mission " +
      "schooling, a colonial-era teaching hospital, and a British university; and settled abroad. THAT IS " +
      "A TWENTIETH-CENTURY ETSAKO LIFE IN OUTLINE, and the 1948 return is the detail that matters most " +
      "genealogically: a family that sends its first son home is a family maintaining its position in a " +
      "kindred.\n\n" +
      "THINGS TO ASK: Why send the first son back? What is being protected?",
    category: "people",
    subcategory: "Okomilo individuals",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    identificationStatus: "secure",
    tags: ["okomilo", "genealogy", "jos", "ogbona", "ivhiochie", "education", "twentieth-century"],
    people: ["Sam Ikhenemho Okomilo"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Jos, Nigeria; Ogbona, Edo State",
    lat: 9.9,
    lng: 8.89,
    claims: [
      {
        sourceKey: "ogbona_profiles",
        startYear: 1940,
        endYear: 1944,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "Sam Okomilo's birth, as the biography states it",
        originalDateText: "Born in the early 1940s in Jos",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence:
          "WHAT THIS RESTS ON: the community biography's own wording, which gives a decade rather than a " +
          "year. A BIOGRAPHY WRITTEN FROM FAMILY KNOWLEDGE IS RELIABLE ON SEQUENCE AND VAGUE ON DATES, " +
          "which is exactly what this is.",
      },
      {
        sourceKey: "ogbona_profiles",
        startYear: 1945,
        endYear: 1948,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "calculated_date",
        whatIsDated: "Sam Okomilo's birth, as implied by the story of his naming",
        originalDateText: "After his father's survival of the Second World War, which ended in 1945",
        datingMethod: "claimant_inference",
        chronology: "disputed",
        evidence:
          "A CHRONOLOGICAL PROBLEM INSIDE ONE SOURCE, and the reason this is a second claim rather than a " +
          "correction. The biography says he was born in the EARLY 1940s AND that his father gave him the " +
          "name Ikhenemo AFTER SURVIVING the war. Those do not sit together comfortably: if the name was " +
          "given on the father's return, the birth is more likely mid-decade. THREE READINGS ARE " +
          "POSSIBLE — 'early 1940s' is loose; the father returned before the war ended; or the name was " +
          "given some time after birth, which is entirely normal. NOTHING HERE DECIDES BETWEEN THEM, and " +
          "the 1948 school start is consistent with either.",
        notes:
          "NEEDS SOURCE VERIFICATION: a birth record, a baptismal register, or a school admission register " +
          "for St John's Primary School, Ogbona would settle it.",
      },
      {
        sourceKey: "ogbona_profiles",
        startYear: 1948,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "His return to Ogbona and the start of his schooling",
        originalDateText: "In 1948 he was sent home and started St John's Primary School, Ogbona",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence:
          "THE FIRMEST DATE ON THIS RECORD, because it attaches to an institution with named staff — Chief " +
          "Patrick O Oboarekpe teaching under the headship of Chief MCK Orbih. A SCHOOL WITH NAMED " +
          "TEACHERS IS A CHECKABLE DATE: mission school registers of this period frequently survive.",
      },
      {
        sourceKey: "ogbona_profiles",
        startYear: 1960,
        endYear: 1962,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "His training as a medical photographer at UCH Ibadan",
        originalDateText: "1960 to 1962",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence:
          "An institutional training period with a start and an end, which is the kind of detail a " +
          "biography gets right because the person remembers it.",
      },
      {
        sourceKey: "ogbona_profiles",
        startYear: 1970,
        endYear: 1972,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "His studies at the University of Edinburgh",
        originalDateText: "Politics, Philosophy and Economics, 1970 to 1972",
        datingMethod: "source_assertion",
        chronology: "community",
        evidence:
          "A UNIVERSITY MATRICULATION IS THE MOST CHECKABLE FACT IN THIS DATASET: Edinburgh's student " +
          "records would confirm the dates and, more usefully for genealogy, would normally record a " +
          "FATHER'S NAME on the matriculation entry.",
        notes:
          "NEEDS SOURCE VERIFICATION — and this is lead number two in the whole investigation. A " +
          "matriculation record naming the father would close the largest gap in the paternal line.",
      },
    ],
  },

  {
    slug: "okomilo-father-and-the-war",
    title: "Sam Okomilo's father: a name that is missing and a war that is not",
    summary:
      "He is attested only through his son: an Okomilo who served with British West African forces, was in Egypt, survived, named his son for it, lived in Jos and moved to Ibadan. No source reached here names him.",
    description:
      "WHAT IS SAID ABOUT HIM. That he was of the Okomilo family; that he fought as part of the British " +
      "West African forces in Egypt and other parts of the world during the Second World War; that he " +
      "survived; that on his survival he gave his son the name IKHENEMO; that the family was in JOS when " +
      "that son was born; and that he later relocated to IBADAN.\n\n" +
      "WHAT IS NOT SAID. His name. Not in any source reached by this investigation. THE MOST IMPORTANT " +
      "PERSON IN THIS GENEALOGY IS THE ONE NOBODY WROTE DOWN.\n\n" +
      "THE MILITARY CLAIM, HANDLED CAREFULLY. 'British West African Frontiers' in the family account is " +
      "almost certainly the ROYAL WEST AFRICAN FRONTIER FORCE, within which Nigerians served in the " +
      "Nigeria Regiment. BUT THE UNIT MUST NOT BE ASSUMED. The RWAFF's two great documented Second World " +
      "War deployments were EAST AFRICA against the Italians in 1940–41 and BURMA, where the 81st and 82nd " +
      "(West Africa) Divisions were raised in 1943 and served until the regiment returned to Nigeria in " +
      "May 1946. EGYPT IS NOT ONE OF THE HEADLINE THEATRES in the general accounts of the force.\n\n" +
      "THAT IS NOT A REASON TO DOUBT THE FAMILY. Men moved through Egypt constantly: the East African " +
      "campaign ran up through Sudan into the Egyptian orbit, troops bound for India and Burma transited " +
      "the Middle East, and West Africans served in labour, transport, medical and garrison roles well " +
      "outside the two famous divisions. A FAMILY THAT REMEMBERS EGYPT PROBABLY REMEMBERS EGYPT. What " +
      "cannot be done is to pick a battalion to fit it.\n\n" +
      "WHY JOS MATTERS. Jos was a tin-mining and garrison town on the plateau, a long way from Etsako, " +
      "with a large migrant workforce. An Etsako family living in Jos in the 1940s is a family that had " +
      "moved for work or for service — which is the ordinary shape of a mid-century Nigerian life and is " +
      "also the reason the son had to be sent home to learn his own culture.\n\n" +
      "THINGS TO ASK: What would you need in order to find one soldier in an army of hundreds of thousands?",
    category: "people",
    subcategory: "Okomilo individuals",
    eventType: "historical",
    evidenceStatus: "historical_report_remains_lost",
    identificationStatus: "possible",
    tags: ["okomilo", "genealogy", "wwii", "rwaff", "egypt", "jos", "military", "missing-link"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Jos and Ibadan, Nigeria; Egypt",
    lat: 9.9,
    lng: 8.89,
    claims: [
      {
        sourceKey: "ogbona_profiles",
        startYear: 1939,
        endYear: 1945,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "His war service, as the family account places it",
        originalDateText: "The Second World War — served with British West African forces in Egypt and other parts of the world",
        datingMethod: "oral_tradition",
        chronology: "community",
        evidence:
          "WHAT THIS RESTS ON: a family account published in a community biography of his son. IT IS " +
          "TESTIMONY AT ONE REMOVE — the son's account of the father's war — and it is the only evidence " +
          "of this man's existence that the investigation has. WHAT IT IS GOOD FOR: establishing that he " +
          "served, roughly when, and that the family remembers Egypt. WHAT IT CANNOT ESTABLISH: unit, " +
          "rank, number, dates of enlistment or discharge, or theatre.",
        notes:
          "NEEDS SOURCE VERIFICATION AGAINST MILITARY RECORDS. Without a name this cannot be searched at " +
          "all, which is why the name is lead number one.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "His name, his parents, his birth and his death",
        originalDateText: "None of it established. He is attested only as 'the father', of the Okomilo family",
        datingMethod: "other",
        chronology: "community",
        evidence:
          "RECORDED AS A CLAIM SO THAT THE ABSENCE IS VISIBLE ON THE TIMELINE rather than being an empty " +
          "space a reader fills in. Every genealogical question about this man is open.",
      },
    ],
  },

  {
    slug: "ikhenemho-a-name-that-records-an-event",
    title: "Ikhenemho: a name given because a man came home",
    summary:
      "Sam's middle name was given by his father on surviving the war. In a naming culture that records circumstances, a name is a compressed historical document.",
    description:
      "WHAT HAPPENED. Sam's father, having survived the Second World War, gave his son the name IKHENEMO " +
      "(Ikhenemho). The name commemorates the survival.\n\n" +
      "WHY THIS IS A GENEALOGICAL SOURCE AND NOT A DETAIL. Because Edoid naming practice, in Etsako as in " +
      "Edo, routinely encodes the CIRCUMSTANCES OF A BIRTH OR OF THE FAMILY AT THE TIME OF IT — gratitude, " +
      "hardship, a return, a death, a statement about God or about enemies. Published Etsako name lists " +
      "are full of them: Oshione, God is the greatest; Oshiorenua, it is God that gives. A NAME OF THIS " +
      "KIND IS A SENTENCE ABOUT A MOMENT, and where records are missing it may be the only surviving " +
      "testimony about that moment.\n\n" +
      "WHAT IT DOES FOR THE CHRONOLOGY. It ties the birth to the father's return. That is why this dataset " +
      "carries two competing birth claims for Sam rather than one: the biography says early 1940s, and the " +
      "naming story points later. THE NAME IS EVIDENCE AGAINST THE DATE PRINTED BESIDE IT, in the same " +
      "source.\n\n" +
      "WHAT WOULD MAKE THIS MUCH STRONGER. A translation. The meaning of Ikhenemho is not established in " +
      "any source reached here, and a gloss from a competent Etsako speaker would turn a story about a " +
      "name into a reading of it.\n\n" +
      "THINGS TO ASK: If your name recorded the year you were born in, what would it say?",
    category: "culture",
    subcategory: "Naming",
    eventType: "historical",
    tags: ["okomilo", "naming", "language", "etsako", "wwii", "genealogy", "oral-knowledge"],
    people: ["Sam Ikhenemho Okomilo"],
    civilisations: ["Etsako"],
    locationName: "Jos, Nigeria",
    lat: 9.9,
    lng: 8.89,
    claims: [
      {
        sourceKey: "ogbona_profiles",
        startYear: 1945,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "relative_date",
        whatIsDated: "The giving of the name, relative to the father's return",
        originalDateText: "After surviving the Second World War",
        datingMethod: "oral_tradition",
        chronology: "community",
        evidence:
          "WHAT FIXES IT: not a date, but a RELATION — after the return. It is entered against 1945, the " +
          "end of the war, as the earliest plausible point, and it is approximate because the father's " +
          "own return date is unknown and demobilisation ran into 1946.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "What the name Ikhenemho means",
        originalDateText: "Not established here. No gloss found in any source reached",
        datingMethod: "other",
        chronology: "community",
        evidence:
          "WHY THIS IS RECORDED AS OPEN RATHER THAN GUESSED: because guessing at the meaning of a personal " +
          "name from its shape is exactly the error this dataset refuses on the surname Okomilo, and it " +
          "would be no better here.",
      },
    ],
  },

  {
    slug: "uwomha-ikhuenena-and-pa-asekomhe",
    title: "The maternal line: Uwomha Ikhuenena, daughter of Pa Asekomhe",
    summary:
      "Sam's mother and her father are both named — which makes the MOTHER'S line the better documented of the two, by one whole generation.",
    description:
      "WHAT IS RECORDED. Sam Okomilo's mother was UWOMHA IKHUENENA, of the Ikhuenena family, and she was " +
      "the daughter of PA ASEKOMHE.\n\n" +
      "WHY THIS IS THE MOST SURPRISING RESULT OF THE INVESTIGATION. Because the family being traced is " +
      "Okomilo, the surname descends in the male line, and the enquiry naturally follows the father — and " +
      "THE FATHER'S LINE STOPS ONE GENERATION SOONER THAN THE MOTHER'S. On the Okomilo side the record " +
      "reaches Sam's father and stops, unnamed. On the Ikhuenena side it reaches Sam's mother by name and " +
      "then her father by name: three generations.\n\n" +
      "WHAT THAT MEANS PRACTICALLY. That the best available route backwards from Sam may not be the " +
      "Okomilo route at all. IF PA ASEKOMHE CAN BE PLACED, a whole set of Innih relationships opens up, " +
      "and the Okomilo family's position among them becomes visible from the side.\n\n" +
      "THE NAME COINCIDENCE, WHICH IS HANDLED IN ITS OWN RECORD. There is an ASEKOMHE FAMILY among the " +
      "nine families of Innih. Whether Pa Asekomhe is of that family, gave his name to it, or simply " +
      "shares a common personal name is NOT ESTABLISHED, and the next record is about why that must not be " +
      "assumed.\n\n" +
      "A NOTE ON WHAT GENEALOGIES DROP. Maternal lines are recorded less, searched less and lost sooner, " +
      "almost everywhere. Here the maternal line is the stronger one, and it is stronger only because one " +
      "sentence in one biography happened to name a woman's father.\n\n" +
      "THINGS TO ASK: Why do we assume the surname is the line worth following?",
    category: "people",
    subcategory: "Okomilo individuals",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    identificationStatus: "probable",
    tags: ["okomilo", "ikhuenena", "asekomhe", "genealogy", "women", "innih", "ivhiochie"],
    people: ["Uwomha Ikhuenena", "Pa Asekomhe", "Sam Ikhenemho Okomilo"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Ivhiochie, Ogbona, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "ogbona_profiles",
        startYear: 1870,
        endYear: 1910,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The implied lifetime of Pa Asekomhe, the earliest named person in the family record",
        originalDateText: "Inferred: the grandfather of a man born in the 1940s",
        datingMethod: "estimate",
        chronology: "community",
        evidence:
          "HOW THE RANGE IS REACHED: two generations back from a birth in the 1940s, at twenty-five to " +
          "thirty-five years a generation, gives a birth somewhere in the late nineteenth or very early " +
          "twentieth century. IT IS ARITHMETIC, NOT A RECORD. The range is wide on purpose and no year is " +
          "offered. THIS IS THE DEEPEST NAMED INDIVIDUAL IN THE WHOLE DATASET, and he is reached through " +
          "the female line.",
        notes:
          "NEEDS SOURCE VERIFICATION for any dates at all attaching to Pa Asekomhe. If he held a title or " +
          "was an Odion, community records may fix him precisely.",
      },
    ],
  },

  {
    slug: "asekomhe-a-name-match-is-not-a-fact",
    title: "Is Pa Asekomhe the Asekomhe family of Innih?",
    summary:
      "One of Innih's nine families is Asekomhe. Sam's maternal grandfather was Pa Asekomhe. That is a lead, and it is not an identification.",
    description:
      "WHAT KIND OF RECORD IS THIS? An open question, recorded so that a coincidence is not quietly " +
      "promoted into a finding.\n\n" +
      "THE TWO FACTS. The nine families of Innih are listed as Asekomhe, Azoganokhai, Emoekpere, " +
      "Idegbesor, Iniaru, Odogbo, Ogedegbe, OKOMILO and Onokozi. Separately, Sam Okomilo's mother is " +
      "recorded as Uwomha Ikhuenena, daughter of PA ASEKOMHE.\n\n" +
      "WHY IT IS TEMPTING. If Pa Asekomhe is the eponym or the head of the Asekomhe family of Innih, then " +
      "both of Sam's parents came out of the same small kindred, and two of the nine Innih families are " +
      "joined by a marriage in living memory. THAT WOULD BE A REAL AND USEFUL FINDING.\n\n" +
      "WHY IT CANNOT BE ASSERTED. Three reasons, and each is sufficient on its own. FIRST, Asekomhe may " +
      "simply be a common personal name in this area, in which case the match means nothing. SECOND, the " +
      "biography places Pa Asekomhe's daughter in the IKHUENENA family, not the Asekomhe family — so the " +
      "two names already belong to different units, and the relationship between a personal name and a " +
      "family name is precisely what is unclear. THIRD, family names in the Innih list are contemporary, " +
      "recorded in 2024, and the process by which a family acquires its name is not documented here.\n\n" +
      "THE RULE BEING APPLIED. It is the same rule this project applies to the serpent vodun Dan and the " +
      "chief called Dan in Dahomey's foundation story, and to every other similar-name argument: SIMILAR " +
      "OR IDENTICAL NAMES ARE NOT EVIDENCE OF IDENTITY. A name match is a reason to go and check, and it " +
      "is the beginning of the work rather than the end of it.\n\n" +
      "WHAT WOULD SETTLE IT. One conversation with an Innih elder, or the Asekomhe family's own account of " +
      "its founder.\n\n" +
      "THINGS TO ASK: How many people in your own town share a surname without being related?",
    category: "people",
    subcategory: "Open question",
    eventType: "disputed",
    identificationStatus: "possible",
    tags: ["okomilo", "asekomhe", "innih", "genealogy", "method", "open-question"],
    people: ["Pa Asekomhe", "Uwomha Ikhuenena"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Innih, Ogbona, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether Pa Asekomhe belongs to the Asekomhe family of Innih",
        originalDateText: "Open. A name match with no corroboration",
        datingMethod: "genealogy",
        chronology: "disputed",
        evidence:
          "FOR: the names are identical and both sit in the same small community. AGAINST: the biography " +
          "assigns his daughter to the Ikhuenena family; personal names recur; and nothing links the man " +
          "to the family unit. WHY POSITIONLESS: it is a question about identity, not about when anything " +
          "happened.",
      },
    ],
  },

  {
    slug: "veronica-okomilo",
    title: "Veronica Okomilo, among the first girls from Ogbona to go to school",
    summary:
      "The second documented Okomilo, and evidence of something the family record otherwise cannot show: a decision about a daughter.",
    description:
      "WHAT IS RECORDED. Veronica Okomilo was among the first set of females from Ogbona to go to school.\n\n" +
      "WHY ONE SENTENCE IS WORTH A RECORD. Because of what it implies about a family rather than about a " +
      "person. In an Etsako community in the first half of the twentieth century, sending a GIRL to school " +
      "was a decision — mission schooling reached boys first almost everywhere, and the first girls to be " +
      "sent are a small, identifiable group. AN OKOMILO IS IN THAT GROUP.\n\n" +
      "WHAT IT CANNOT ESTABLISH. Her dates, her parents, her relationship to Sam Okomilo or to his father, " +
      "or which branch of the family she came from. None of it is in any source reached here.\n\n" +
      "WHY SHE MATTERS TO THE INVESTIGATION ANYWAY. Because she is a second, independent attestation that " +
      "the name existed at Ogbona in the first half of the twentieth century, in a context — mission " +
      "schooling — THAT GENERATES RECORDS. School admission registers, baptismal registers and mission " +
      "correspondence are among the likeliest surviving documents to carry an Okomilo name, and they " +
      "normally record a FATHER'S NAME beside the pupil's.\n\n" +
      "THINGS TO ASK: Which records get created about a person who is not important? Those are usually the " +
      "ones that survive.",
    category: "people",
    subcategory: "Okomilo individuals",
    eventType: "historical",
    identificationStatus: "probable",
    tags: ["okomilo", "women", "education", "ogbona", "missionaries", "genealogy"],
    people: ["Veronica Okomilo"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Ogbona, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "ogbona_profiles",
        startYear: 1920,
        endYear: 1950,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When Veronica Okomilo was at school",
        originalDateText: "Among the first set of females to go to school from Ogbona; no date given in the source",
        datingMethod: "estimate",
        chronology: "community",
        evidence:
          "WHY THE RANGE IS THIRTY YEARS WIDE: because the source gives no date at all, and the range is " +
          "bounded only by the plausible period of early mission schooling for girls in this area. IT IS A " +
          "PLACEHOLDER AROUND A REAL PERSON, and it should be replaced the moment a school record is found.",
        notes:
          "NEEDS SOURCE VERIFICATION, and this record would benefit more than any other from one document: " +
          "the admission register of the first school at Ogbona.",
      },
    ],
  },

  {
    slug: "okomilo-meaning-unresolved",
    title: "What does \"Okomilo\" mean?",
    summary:
      "Currently unresolved. No gloss was found in any source reached, and the obvious segmentation borrows from the wrong language.",
    description:
      "THE HONEST ANSWER. MEANING CURRENTLY UNRESOLVED. No dictionary, name list, ethnography or community " +
      "publication reached by this investigation glosses Okomilo.\n\n" +
      "WHAT LANGUAGE IT SHOULD BE. Etsako — also called Afenmai, Iyekhee or Yekhee — a North-Central EDOID " +
      "language, closely related to Edo (Bini). So the place to look is Etsako and Edo lexicography, not " +
      "Yoruba or Igbo.\n\n" +
      "THE SEGMENTATION THAT MUST NOT BE ASSUMED. Oko + mi + lo is the reading an English speaker reaches " +
      "for, usually via 'oko' meaning farm or husband in YORUBA. THERE IS A SPECIFIC PIECE OF EVIDENCE " +
      "AGAINST IMPORTING IT: in Etsako, farmer is AFIA. The Yoruba sense does not transfer, and a " +
      "segmentation borrowed from a neighbouring but different language is not analysis.\n\n" +
      "WHAT CAN BE SAID ABOUT THE SHAPE. Etsako personal and family names in the published lists are " +
      "frequently SENTENCE NAMES — whole propositions compressed into a word, often about God, about " +
      "circumstances, or about other people. Oshione, 'God is the greatest'; Oshiorenua, 'it is God that " +
      "gives'. IT IS THEREFORE LIKELY, ON PATTERN, that Okomilo is a phrase rather than a simple noun. " +
      "THAT IS A GUESS ABOUT THE CLASS OF NAME, NOT A TRANSLATION, and this record does not dress it as " +
      "one.\n\n" +
      "THE OTHER OPEN QUESTION. Whether Okomilo is the personal name of an ancestor that became the " +
      "family name, or a title, an occupational name, a praise name or a religious name. Family names in " +
      "the Innih list are not explained anywhere reached here, so this is unanswered for all nine of them " +
      "and not only for this one.\n\n" +
      "THINGS TO ASK: Why is it so tempting to translate a name you cannot read?",
    category: "culture",
    subcategory: "Language",
    eventType: "disputed",
    identificationStatus: "disputed",
    evidenceStatus: "unresolved",
    tags: ["okomilo", "language", "etsako", "edoid", "etymology", "method", "unresolved"],
    civilisations: ["Etsako"],
    locationName: "Etsako, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "etsako_wikipedia",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "The meaning and origin of the name Okomilo",
        originalDateText: "Unresolved. No gloss found in any source reached by this investigation",
        datingMethod: "textual_interpretation",
        chronology: "community",
        evidence:
          "WHAT WAS CHECKED: Etsako name lists and dictionaries reachable through search, and general " +
          "Edoid language description. WHAT WAS FOUND: that Etsako is a North-Central Edoid language " +
          "closely related to Edo, that its name stock is full of sentence names, and that the Yoruba " +
          "'oko' sense does not apply because Etsako uses afia. WHAT WAS NOT FOUND: this name. WHY THE " +
          "RECORD STANDS AS UNRESOLVED rather than offering a best guess: a plausible-looking etymology " +
          "would be repeated as fact within a generation.",
        notes:
          "NEEDS A SPEAKER, more than it needs a document. The fastest route to an answer is an Etsako " +
          "speaker from Ogbona, ideally an elder of Innih, and the second fastest is a full Etsako " +
          "dictionary with a morphological index.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE STRUCTURAL CHAIN: INNIH, IVHITSE, IVHIOCHIE, OGBONA
  // -------------------------------------------------------------------------
  {
    slug: "innih-and-its-nine-families",
    title: "Innih and its nine families",
    summary:
      "Okomilo is one of nine families of Innih: Asekomhe, Azoganokhai, Emoekpere, Idegbesor, Iniaru, Odogbo, Ogedegbe, Okomilo and Onokozi.",
    description:
      "WHAT THE LIST SAYS. Innih village, headed by Chief John Oshiomhogho Ogedegbe, comprises nine " +
      "families: ASEKOMHE, AZOGANOKHAI, EMOEKPERE, IDEGBESOR, INIARU, ODOGBO, OGEDEGBE, OKOMILO and " +
      "ONOKOZI.\n\n" +
      "WHY THIS IS THE FOUNDATION OF THE WHOLE INVESTIGATION. It is the document that places the Okomilo " +
      "family. Without it there is a surname and no location; with it there is a surname inside a named " +
      "unit inside a described structure.\n\n" +
      "WHAT KIND OF DOCUMENT IT IS, EXACTLY. A CONTEMPORARY ADMINISTRATIVE LIST, dated November 2024, " +
      "recording the present arrangement of the Ogbona sub-clan with its current palace chiefs. IT IS NOT " +
      "A GENEALOGY. It does not say when any family arrived, whom any family descends from, or in what " +
      "order the nine were established. A reader who takes a 2024 list of nine families as nine lines of " +
      "descent from a founder has added something the document does not contain.\n\n" +
      "THE QUESTIONS IT RAISES AND DOES NOT ANSWER. Were the nine always nine? Do they descend from one " +
      "founder of Innih, or did some arrive later? Did Okomilo branch from another of the eight? Is there " +
      "an order of seniority among them, and if so what is it? ALL NINE FAMILIES HAVE THIS PROBLEM " +
      "EQUALLY — this is not a gap peculiar to Okomilo.\n\n" +
      "WHAT WOULD ANSWER THEM. The Innih kindred's own genealogy, as held by its elders; a seniority order, " +
      "which in a gerontocratic system is usually known precisely; or a colonial-era list of the same " +
      "families, which would show whether the nine are stable over a century.\n\n" +
      "THINGS TO ASK: A list of families is a photograph of one moment. What does it look like in 1936?",
    category: "people",
    subcategory: "Kindred structure",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    identificationStatus: "secure",
    tags: ["okomilo", "innih", "ogbona", "kindred", "genealogy", "structure", "etsako"],
    people: ["John Oshiomhogho Ogedegbe"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Innih, Ogbona, Etsako Central, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "ogbona_kindreds_list_2024",
        startYear: 2024,
        startMonth: 11,
        datePrecision: "month",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The publication of the list of Ogbona's villages, kindreds and families",
        originalDateText: "November 2024",
        datingMethod: "historical_record",
        chronology: "community",
        evidence:
          "WHAT IS DATED IS THE LIST, NOT THE FAMILIES. This is the securest date in the dataset and it is " +
          "a date in 2024. It establishes that these nine families were recognised as the families of " +
          "Innih at that moment, and nothing whatever about how long any of them had been there.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the Okomilo family was established at Innih, and in what relation to the other eight",
        originalDateText: "Not established for Okomilo, and not established for any of the nine",
        datingMethod: "genealogy",
        chronology: "community",
        evidence:
          "WHY POSITIONLESS: because the only document is a list of the present. THE ABSENCE IS SHARED BY " +
          "ALL NINE FAMILIES, which is worth knowing — it means the missing information is a general " +
          "feature of what has been written down about Innih, not a peculiar silence about the Okomilos.",
      },
    ],
  },

  {
    slug: "ivhitse-sits-inside-ivhiochie",
    title: "Ivhitse sits inside Ivhiochie — which resolves an apparent contradiction",
    summary:
      "The family lists put Okomilo in Innih, a kindred of Ivhitse. Sam Okomilo's biography puts the family in Ivhiochie. Both are right, because Ivhitse is part of Ivhiochie.",
    description:
      "THE APPARENT CONTRADICTION. One source lists the Okomilo family under INNIH, and lists Innih among " +
      "the kindreds of IVHITSE — alongside Akpheokhai, Enamino and Ototo. Another source, the biography of " +
      "Sam Okomilo, says the Okomilo and Ikhuenena families are both of IVHIOCHIE quarter. And the list of " +
      "Ivhiochie's kindreds — Ivhiobore, Agiamhesor, Atogwe, Emhoepo, Oghie, Imela, Ivhiosano, Agba, " +
      "Ikhinaede, Okhakia, Osimua — DOES NOT CONTAIN INNIH.\n\n" +
      "THE RESOLUTION. Ivhitse is itself part of the Ivhiochie quarter. Once that is established the two " +
      "statements stop competing: the Okomilo family is of Innih, Innih is of Ivhitse, and Ivhitse is " +
      "within Ivhiochie — so the family is 'of Ivhiochie' at the quarter level and 'of Innih' at the " +
      "family level, and both sources are describing the same thing at different resolutions.\n\n" +
      "WHY THIS RECORD EXISTS RATHER THAN A SILENT CORRECTION. Because the contradiction is instructive. " +
      "Community sources describe the same structure at different levels without saying which level they " +
      "are using, and a researcher who meets the two statements cold will conclude that one of them is " +
      "wrong. NEITHER IS. The apparent error is an artefact of nesting, and the same trap is waiting in " +
      "every other family's records.\n\n" +
      "THE CHAIN, AS IT STANDS AFTER THIS. Okomilo → Innih → Ivhitse → Ivhiochie → Ogbona. Four steps, all " +
      "documented, none of them genealogical.\n\n" +
      "ONE CAUTION. The lists themselves are not perfectly consistent — some pages treat Ivhitse as a " +
      "quarter in its own right alongside Ivhiochie, and one treats the pair as 'Ivhioche/Ivhitse'. THAT " +
      "WOBBLE IS RECORDED RATHER THAN IRONED OUT, because it may reflect a real ambiguity in how the " +
      "community itself describes the unit.\n\n" +
      "THINGS TO ASK: When two sources disagree, how often is the disagreement about words rather than " +
      "facts?",
    category: "people",
    subcategory: "Kindred structure",
    eventType: "historical",
    identificationStatus: "probable",
    tags: ["okomilo", "innih", "ivhitse", "ivhiochie", "ogbona", "structure", "method"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Ivhiochie, Ogbona, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "ogbona_kindreds_list_2024",
        startYear: 2024,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The nesting of Innih within Ivhitse within Ivhiochie, as currently described",
        originalDateText: "As set out in the community structure published in 2024",
        datingMethod: "historical_record",
        chronology: "community",
        evidence:
          "WHAT IS ESTABLISHED: the present arrangement. WHAT IS NOT: that it has always been so. " +
          "Quarters, kindreds and villages in this region have been reorganised repeatedly, including by " +
          "colonial administration and by later chieftaincy decisions, and a structure recorded in 2024 " +
          "cannot be assumed backwards.",
        notes:
          "NEEDS SOURCE VERIFICATION against an earlier list — the 1936 intelligence report would show " +
          "whether this nesting is old or recent.",
      },
    ],
  },

  {
    slug: "ivhiochie-means-the-children-of-ochie",
    title: "Ivhiochie means the children of Ochie",
    summary:
      "The quarter names are patronymics. Ivhi- is the Edoid prefix for 'children of', and the names behind them are the sons in Ogbona's founding genealogy.",
    description:
      "THE LINGUISTIC POINT. IVHI- (also written Ivbi-, Ivie-) is the Edoid prefix meaning CHILDREN OF or " +
      "PEOPLE OF. The clearest published demonstration is not from Etsako but from Edo: the Benin name for " +
      "the Etsako, IVBIESAKON, is glossed as 'children of those who file their teeth' — the same prefix, " +
      "doing the same work.\n\n" +
      "WHAT IT UNLOCKS. Read the Ogbona quarter names as patronymics and they line up with the founding " +
      "genealogy:\n\n" +
      "  IVHIOCHIE       the children of OCHIE\n" +
      "  IVHIOREVHO      the children of OREVHOR\n" +
      "  IVHIANAGA       the children of ANAGA\n" +
      "  OKOTOR          from OKHOTOR\n\n" +
      "and Ochie, Orevhor and Udokhakor are named in the tradition as the sons of OKHUA, while Okhotor and " +
      "Anaga are named as the sons of OMIERELE. THE MAP OF THE TOWN IS A FAMILY TREE, written in the " +
      "ground.\n\n" +
      "WHY THIS MATTERS FOR OKOMILO. Because it means the chain from the family up to Ogbona is not purely " +
      "administrative after all. Belonging to Ivhiochie is, in the tradition's own terms, a claim of " +
      "descent from Ochie. SO THE STRUCTURAL CHAIN CARRIES A GENEALOGICAL CLAIM INSIDE IT — and that claim " +
      "is the tradition's, not this dataset's.\n\n" +
      "WHERE IT STOPS. It does not reach Okomilo. Knowing that Ivhiochie means 'children of Ochie' tells " +
      "you what the quarter asserts about itself; it does not tell you when the Okomilo family joined it, " +
      "whether by descent, by later settlement, or by absorption. THE PREFIX EXPLAINS THE QUARTER, NOT THE " +
      "FAMILY.\n\n" +
      "AND ONE UNRESOLVED NAME. IVHITSE does not obviously derive from any of the five sons, and UDOKHAKOR " +
      "does not obviously give IVHIDO. The correspondence is strong but not complete, and the gaps are " +
      "left visible.\n\n" +
      "THINGS TO ASK: If the neighbourhoods of a town are named after brothers, what was the town for?",
    category: "culture",
    subcategory: "Language",
    eventType: "archaeological_interpretation",
    eventTypeNote: "A linguistic reading of place names against a genealogy, offered as an interpretation.",
    identificationStatus: "probable",
    tags: ["language", "edoid", "etsako", "ogbona", "ivhiochie", "genealogy", "toponymy"],
    civilisations: ["Etsako", "Avhianwu", "Edo"],
    locationName: "Ogbona, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "etsako_wikipedia",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "The correspondence between Ogbona's quarter names and the sons in its founding genealogy",
        originalDateText: "A structural correspondence, not a dated event",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHAT SUPPORTS IT: the Ivhi- prefix is independently attested as 'children of' in the Edo name " +
          "Ivbiesakon for the Etsako, and four of the five quarter names correspond to names given in the " +
          "descent tradition. WHAT WEAKENS IT: the correspondence is not complete — Ivhitse is unexplained " +
          "— and the argument is made here from published name lists rather than from a linguist's " +
          "analysis. WHY POSITIONLESS: a naming pattern is not an event.",
        notes:
          "NEEDS SOURCE VERIFICATION from Edoid linguistic scholarship, which would confirm the prefix's " +
          "form and productivity in Etsako specifically rather than in Edo.",
      },
    ],
  },

  {
    slug: "ogbona-descent-okhua-and-omierele",
    title: "The descent of Ogbona: Okhua and Omierele, and their five sons",
    summary:
      "Tradition gives Ogbona two children — Okhua and Omierele — and names their sons: Ochie, Orevhor and Udokhakor; Okhotor and Anaga. The quarters carry their names.",
    description:
      "THE GENEALOGY AS THE COMMUNITY GIVES IT. Ogbona had two children, OKHUA and OMIERELE. Okhua had " +
      "OCHIE, OREVHOR and UDOKHAKOR. Omierele had OKHOTOR and ANAGA.\n\n" +
      "WHY THIS IS THE MOST USEFUL GENEALOGICAL DOCUMENT IN THE DATASET. Because it is the only place " +
      "where named individuals are connected by explicit parent-and-child relationships across more than " +
      "one generation, and because the names are still on the ground as quarter names. IT IS A GENEALOGY " +
      "THAT CAN BE CHECKED AGAINST A MAP.\n\n" +
      "WHAT KIND OF GENEALOGY IT IS. A SEGMENTARY ONE — the standard form across much of West Africa, in " +
      "which the divisions of a community are expressed as the descendants of the sons of a founder. " +
      "Segmentary genealogies are excellent at recording STRUCTURE and unreliable at recording PEOPLE: " +
      "they may preserve real ancestors, or they may express the relationship between groups in the " +
      "language of descent. A quarter that split from another quarter acquires a founder who is a brother " +
      "of the other's founder, whether or not such a man lived.\n\n" +
      "SO WHAT IS IT EVIDENCE OF. Firmly: that Ogbona understands itself as five descent groups in two " +
      "senior branches. Less firmly: that five men of these names existed. NEITHER OF THOSE IS A " +
      "DISMISSAL — segmentary genealogies do carry real ancestors, often — but the first is much better " +
      "established than the second.\n\n" +
      "WHAT IT DOES NOT REACH. Okomilo. The genealogy stops at the sons; the kindreds below them, and the " +
      "families below those, are not attached to it in anything reached here.\n\n" +
      "THINGS TO ASK: If two neighbourhoods say their founders were brothers, what have they told you — " +
      "about the past, or about themselves?",
    category: "people",
    subcategory: "Ogbona descent",
    eventType: "traditional_account",
    identificationStatus: "possible",
    tags: ["ogbona", "genealogy", "oral-knowledge", "descent", "ivhiochie", "avhianwu", "segmentary"],
    people: ["Okhua", "Omierele", "Ochie", "Orevhor", "Udokhakor", "Okhotor", "Anaga"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Ogbona, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "avhianwu_oral_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "primordial",
        whatIsDated: "When Okhua, Omierele and their sons lived",
        originalDateText: "In the founding generations after the settlement of Ogbona; the tradition gives no dates",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHY POSITIONLESS RATHER THAN CALCULATED BACK FROM THE MIGRATION: because doing that arithmetic " +
          "would inherit every uncertainty in the migration date and add a guessed generation length on " +
          "top. The tradition places these men in founding time and does not date them, and that is what " +
          "the record says.",
      },
    ],
  },

  {
    slug: "ogbona-one-generation-in-dispute",
    title: "Is Ogbona a man or a place? A one-generation discrepancy",
    summary:
      "One account has Imhakhena fathering Okhua and Omierele directly. Another inserts a person called Ogbona between them. The community record disagrees with itself by exactly one generation.",
    description:
      "WHAT KIND OF RECORD IS THIS? A genealogical dispute inside a single body of community history, " +
      "recorded rather than resolved.\n\n" +
      "VERSION ONE. Imhakhena, son of Anwu, migrated to the present site and founded the town. Imhakhena " +
      "had two children, Okhua and Omierele.\n\n" +
      "VERSION TWO. Ogbona was the FIRST BORN of Imhakhena, who was the last born of Anwu; and Ogbona " +
      "later gave birth to two children, Okhua and Omierele.\n\n" +
      "THE DIFFERENCE. One whole generation. In version one the town's eponym IS Imhakhena's settlement; " +
      "in version two there was a man called Ogbona, Imhakhena's son, and the town is named for him.\n\n" +
      "WHY IT MATTERS. Because a generation is roughly a quarter of a century, and because the two " +
      "versions say different things about what kind of name 'Ogbona' is — a place named by its founder, " +
      "or a person whose descendants are the town. EVERY GENERATION COUNT BUILT ON THIS GENEALOGY IS " +
      "AFFECTED BY IT.\n\n" +
      "WHY IT HAPPENS. This is one of the most common ambiguities in segmentary genealogies anywhere: the " +
      "eponymous ancestor and the settlement carry one name, and whether the name went from the man to the " +
      "place or from the place to a remembered 'man' is usually unrecoverable. THE SAME AMBIGUITY SITS ON " +
      "'ANWU', which is both an ancestor and now the name of a clan.\n\n" +
      "HOW THIS DATASET HANDLES IT. Both versions are recorded. No generation count in this file is " +
      "presented as exact, and the missing-links record names this as one of the things a reading of The " +
      "Descent of Avhianwu should settle first.\n\n" +
      "THINGS TO ASK: How would you tell a founder from a place name that grew a founder?",
    category: "people",
    subcategory: "Debate",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["debate", "ogbona", "genealogy", "oral-knowledge", "imhakhena", "method", "source-dependency"],
    people: ["Imhakhena", "Okhua", "Omierele"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Ogbona, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "ogbona_elites",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether there was a person called Ogbona between Imhakhena and Okhua",
        originalDateText: "Disputed within the community record: Imhakhena → Okhua, or Imhakhena → Ogbona → Okhua",
        datingMethod: "genealogy",
        chronology: "disputed",
        evidence:
          "WHAT MAKES THIS A REAL DISPUTE RATHER THAN A SLIP: both versions are published, in detail, by " +
          "the same community source on different pages, each stated positively. WHY IT CANNOT BE " +
          "RESOLVED HERE: there is no third witness. THE TEST WOULD BE the 1999 book and the recitation of " +
          "an Ogbona elder, which are exactly the two sources this investigation could not reach.",
      },
    ],
  },

  {
    slug: "imhakhena-founds-ogbona",
    title: "Imhakhena, and the founding of Ogbona",
    summary:
      "The last-born son of Anwu, who moved from the family's settlement at Utagbabor to found the town that bears his line — one of four founded by Anwu's sons.",
    description:
      "WHAT THE TRADITION SAYS. IMHAKHENA, described as the last born of Anwu, moved from Utagbabor in " +
      "what is now Fugar and founded OGBONA. His brothers founded the other three Avhianwu communities.\n\n" +
      "THE FOUR FOUNDATIONS, WHICH ARE ONE EVENT TOLD AS FOUR. Uralokhor founded Iviuralokhor, now " +
      "IRAOKHOR. Unone founded IVHIUNONE. Arua founded IVHIARUA. Imhakhena founded OGBONA. Ivhiunone and " +
      "Ivhiarua are today within Fugar; Ogbona and Iraokhor are separate towns. ALL FOUR NAMES ARE " +
      "PATRONYMIC IN THE SAME WAY as Ogbona's own quarters — the pattern runs at every level of this " +
      "society's map.\n\n" +
      "WHAT KIND OF EVENT A DISPERSAL LIKE THIS IS. A community outgrowing one site and segmenting, with " +
      "the segments recorded afterwards as brothers. Whether four men actually walked out in one " +
      "generation, or whether four settlements formed over a much longer period and were later organised " +
      "into a brotherhood, IS NOT ESTABLISHED AND IS THE ORDINARY QUESTION about foundation traditions of " +
      "this shape.\n\n" +
      "WHY OGBONA'S POSITION IN THE BIRTH ORDER IS WORTH NOTING. Imhakhena is given as the LAST born, and " +
      "birth order in a segmentary genealogy is a statement about seniority between communities — which " +
      "makes it exactly the kind of detail that gets contested when clans are reorganised. The modern " +
      "split of Avhianwu into Fugar and Anwu clans, and the protest it generated, is the same argument " +
      "continuing.\n\n" +
      "THINGS TO ASK: Who benefits from being the eldest brother in a story about four towns?",
    category: "people",
    subcategory: "Foundation tradition",
    eventType: "traditional_account",
    identificationStatus: "possible",
    tags: ["ogbona", "imhakhena", "anwu", "avhianwu", "foundation", "oral-knowledge", "fugar", "iraokhor"],
    people: ["Imhakhena", "Anwu", "Uralokhor", "Unone", "Arua"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Ogbona and Utagbabor, Fugar, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "avhianwu_oral_tradition",
        startYear: 1450,
        endYear: 1550,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The founding of the four Avhianwu communities, as the tradition's own chronology implies",
        originalDateText: "In the generation after Anwu's migration, which tradition places in the fifteenth or early sixteenth century",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "HOW THIS RANGE IS REACHED: it is one or two generations after whichever migration date is " +
          "accepted, and the two competing migration dates are themselves about forty years apart. THE " +
          "RANGE IS DELIBERATELY A CENTURY WIDE because narrowing it would require choosing between the " +
          "migration traditions and then assuming a generation length, and this dataset does neither.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // ANWU, ALOKOKO AND THE PYTHON
  // -------------------------------------------------------------------------
  {
    slug: "anwu-and-alokoko",
    title: "Anwu and Alokoko, and their four sons",
    summary:
      "The founding couple of Avhianwu: a father who gives the clan its name and a mother whose name attaches to a python taboo still observed.",
    description:
      "WHAT THE TRADITION SAYS. ANWU came out of the Kingdom of Benin with his wife ALOKOKO — also written " +
      "Aleokoko, Aloukoko, Aleukoko — and settled first at Afashio in Uzairue, later moving to Utagbabor " +
      "in what is now Fugar. Their four sons, described as the direct biological children of the same " +
      "parents, were URALOKHOR, UNONE, ARUA and IMHAKHENA, and each founded one of the four Avhianwu " +
      "communities. AVHIANWU — Ivhi-Anwu — means the children of Anwu.\n\n" +
      "WHY THE MOTHER IS THE INTERESTING ONE. Because she is remembered by name, which is unusual, and " +
      "because the clan's most distinctive religious observance attaches to her rather than to Anwu. A " +
      "founding tradition in which the FATHER gives the clan its name and the MOTHER gives it its taboo is " +
      "not the ordinary arrangement, and it is worth noticing rather than passing over.\n\n" +
      "WHAT KIND OF FIGURES THESE ARE. Eponymous founders. 'Anwu' is at once an ancestor and the name of a " +
      "clan — today, after a modern reorganisation, the name of an administrative clan containing Ogbona " +
      "and Iraokhor. The same ambiguity sits on 'Ogbona'. WHETHER A MAN CALLED ANWU LIVED IS NOT " +
      "ESTABLISHED by the fact that a clan is called Avhianwu, and this dataset does not treat the second " +
      "as evidence for the first.\n\n" +
      "WHAT IS GENUINELY STRIKING ANYWAY. That the tradition insists on the four sons being FULL brothers " +
      "— 'the direct biological children of the same parents'. That is a strong and specific assertion " +
      "about equality of standing between four communities, and in a segmentary system such insistence " +
      "usually means the question has been contested. The modern clan split suggests it still is.\n\n" +
      "THINGS TO ASK: Why would a tradition go out of its way to say that four brothers had the same " +
      "mother?",
    category: "people",
    subcategory: "Foundation tradition",
    eventType: "traditional_account",
    identificationStatus: "possible",
    tags: ["anwu", "alokoko", "avhianwu", "foundation", "oral-knowledge", "migration", "women"],
    people: ["Anwu", "Alokoko", "Uralokhor", "Unone", "Arua", "Imhakhena"],
    civilisations: ["Etsako", "Avhianwu", "Kingdom of Benin"],
    locationName: "Afashio in Uzairue, and Utagbabor in Fugar, Edo State, Nigeria",
    lat: 7.05,
    lng: 6.32,
    claims: [
      {
        sourceKey: "avhianwu_oral_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "primordial",
        whatIsDated: "When Anwu and Alokoko lived, in the tradition's own terms",
        originalDateText: "In the founding time of the clan; the tradition itself gives no date, though later tellings attach one",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHY THIS CLAIM IS POSITIONLESS WHILE THE MIGRATION RECORDS CARRY DATES: because the dates in " +
          "circulation attach to the MIGRATION, by way of the reign of a Benin Oba, and are a later " +
          "chronological framing. The tradition's own placement of Anwu is in founding time, and that is " +
          "what this claim records.",
      },
    ],
  },

  {
    slug: "alokoko-and-the-python",
    title: "Alokoko and the python: why Avhianwu do not eat it",
    summary:
      "The clan does not eat python, because the python stands for Alokoko. Eat one by mistake and you go to her shrine at Ogbona to be pardoned. The reason is ancestral, not cosmological.",
    description:
      "THE OBSERVANCE, WHICH IS LIVING AND SPECIFIC. Avhianwu by tradition DO NOT EAT PYTHON, because the " +
      "python represents Alokoko. If somebody eats one by mistake, they must go to the SHRINE AT OGBONA " +
      "built for her, appease her and ask pardon.\n\n" +
      "WHY THIS IS A REMARKABLE PIECE OF EVIDENCE. Because it is a taboo with a REMEDY — and a remedy with " +
      "an ADDRESS. A prohibition that names the shrine you must go to when you break it is an institution " +
      "rather than a sentiment, and it means the tradition is maintained by people who can be asked about " +
      "it. It also means Ogbona holds the clan's shrine, which is a statement about Ogbona's standing " +
      "among the four communities.\n\n" +
      "WHAT KIND OF SACRED ANIMAL THIS IS, AND THE DISTINCTION MATTERS ENORMOUSLY. The python here is " +
      "sacred because of WHO IT IS — the ancestress of the clan — and the obligation it creates is a " +
      "KINSHIP obligation: you do not eat your own mother. That is an ANCESTRAL and GENEALOGICAL " +
      "tradition. It is a different kind of thing from a python that is sacred as the emblem of a deity " +
      "of waters and wealth, and different again from one venerated at a temple as a vodun in its own " +
      "right.\n\n" +
      "SO THE COMPARISON RECORDS IN THIS DATASET START FROM A REAL DIFFERENCE rather than from a " +
      "resemblance. 'Pythons are sacred here and there' is the weakest possible observation. WHO the " +
      "python is, WHY it is spared, and WHAT you owe it are the questions that discriminate — and on all " +
      "three Avhianwu gives an answer that is about descent.\n\n" +
      "WHAT IS NOT ESTABLISHED. How old the observance is. No date, no earliest recorded version, no " +
      "outside description reached here. The shrine's location at Ogbona is publicly stated in community " +
      "sources; nothing more precise is recorded in this dataset, and a sacred site's exact position is " +
      "not something a public record should press.\n\n" +
      "THINGS TO ASK: What is the difference between a god you must not offend and an ancestor you must " +
      "not eat?",
    category: "religion",
    subcategory: "Ancestral tradition",
    eventType: "traditional_account",
    evidenceStatus: "unresolved",
    tags: ["alokoko", "python", "sacred-animals", "avhianwu", "ogbona", "ancestors", "taboo", "shrine"],
    people: ["Alokoko"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Ogbona, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "avhianwu_oral_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the python taboo began",
        originalDateText: "Date unknown. The tradition attaches it to the founding ancestress and does not date it",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHY NO DATE: the observance is attached to a founding figure who is herself undated, and no " +
          "outside description of the practice — colonial, missionary or ethnographic — was reached by " +
          "this investigation. THE EARLIEST RECORDED MENTION IS THE MISSING FACT, and a colonial " +
          "intelligence report or a mission account would supply a latest-by date immediately.",
        notes:
          "NEEDS SOURCE VERIFICATION: the 1936 Kukuruku intelligence report and any Catholic mission " +
          "records for Ogbona are the two places most likely to carry an early outside description of the " +
          "python observance.",
      },
    ],
  },

  {
    slug: "who-or-what-is-alokoko",
    title: "Is Alokoko the mother, the son, or the python?",
    summary:
      "The community account calls Alokoko the mother of the four sons — and in the next sentence calls Alokoko the last son and her pet, then reverts to 'her death'. The tradition does not resolve it.",
    description:
      "WHAT KIND OF RECORD IS THIS? An ambiguity inside a single passage of community history, recorded " +
      "because smoothing it out would destroy the evidence.\n\n" +
      "WHAT THE PASSAGE SAYS, IN ORDER. That the four sons are the children of 'Anwu, the father and " +
      "ALEOKOKO the mother'. Then that 'ALOUKOKO, the last son and the pet of Aleokoko their mother, " +
      "decided to stay with Imhakhena (Ogbona), and stayed there until HER death and was buried therein'. " +
      "Then that the clan does not eat python 'which represents ALOUKOKO THEIR MOTHER'. Then that the " +
      "shrine at Ogbona was built 'for their mother'.\n\n" +
      "THE THREE THINGS THE NAME IS DOING AT ONCE. It is the MOTHER's name. It is the name of a LAST SON " +
      "who is also called her PET. And it is what the PYTHON represents. The pronoun switches from 'the " +
      "last son' to 'her death' within one sentence.\n\n" +
      "THE READINGS, AND NONE IS PREFERRED HERE. (1) A TRANSMISSION SLIP: two figures have collapsed into " +
      "one in the telling or the writing. (2) THE PET WAS THE PYTHON: Aleokoko the mother kept a python, " +
      "which stayed at Ogbona and was buried there, and 'the last son... and the pet' is a way of saying " +
      "the animal was treated as a child of the house — which would explain both the name transfer and the " +
      "taboo cleanly. (3) THE MOTHER AND THE PYTHON ARE ONE: the ancestress is present as, or manifests " +
      "as, the python, in which case the apparent confusion is not confusion at all but a statement about " +
      "identity that a prose summary cannot hold.\n\n" +
      "WHY THIS DATASET DOES NOT CHOOSE. Because reading (3) is a religious claim, reading (1) is a " +
      "criticism of the source, and reading (2) is a reconstruction — and picking any of them would " +
      "convert a genuine uncertainty into an assertion. WHAT WOULD SETTLE IT IS A TELLING RATHER THAN A " +
      "SUMMARY: the tradition as recited by a custodian of the shrine.\n\n" +
      "ONE THING THAT IS NOT IN DOUBT. That the clan does not eat python, that the reason given is " +
      "Alokoko, and that the shrine is at Ogbona.\n\n" +
      "THINGS TO ASK: When a written summary of an oral tradition contradicts itself, which of the two is " +
      "the problem?",
    category: "religion",
    subcategory: "Debate",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["debate", "alokoko", "python", "avhianwu", "oral-knowledge", "method", "ancestors"],
    people: ["Alokoko", "Imhakhena"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Ogbona, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "ogbona_elites",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether Alokoko is the ancestress, a son, a python, or more than one of these",
        originalDateText: "Unresolved. One passage uses the name for the mother, for a last son called her pet, and for what the python represents",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "WHAT THE EVIDENCE IS: the wording of the community account itself, which is internally " +
          "inconsistent in a specific and interesting way. WHY THAT IS WORTH RECORDING RATHER THAN " +
          "CORRECTING: an inconsistency of this shape is usually the trace of something in the oral " +
          "original that prose flattens — and the flattening is itself a finding about how this tradition " +
          "has been written down.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE MIGRATION CLAIMS
  // -------------------------------------------------------------------------
  {
    slug: "migration-claim-ewuare",
    title: "Claim A: Anwu left Benin in the mid-fifteenth century, under Ewuare",
    summary:
      "One community account places the migration in the middle of the fifteenth century, during the reign of Oba Ewuare the Great — conventionally dated about 1440 to 1473.",
    description:
      "THE CLAIM. That Anwu and Alokoko, with their children, migrated from Benin in the MIDDLE OF THE " +
      "FIFTEENTH CENTURY, during the reign of OBA EWUARE THE GREAT.\n\n" +
      "THE REGNAL ANCHOR. Ewuare is conventionally dated to about 1440–1473. A migration dated by his " +
      "reign therefore falls in that window, and the 'middle of the 15th century' wording points at its " +
      "earlier part.\n\n" +
      "WHAT MAKES THIS CLAIM ATTRACTIVE. Ewuare is the Oba most associated in tradition with upheaval, " +
      "expansion and the reordering of Benin — and with the departure of people from it. Etsako traditions " +
      "generally, not only Avhianwu's, point at his reign, citing war, succession disputes and the search " +
      "for land. A MIGRATION TRADITION THAT NAMES EWUARE IS SAYING SOMETHING CONVENTIONAL FOR THIS REGION, " +
      "which is a reason to take it seriously and also a reason to ask whether it is a regional formula.\n\n" +
      "WHAT THE DATE ACTUALLY RESTS ON. Not a document, and not a count of generations from Anwu to the " +
      "present. It rests on the attachment of the tradition to a NAMED REIGN, and then on Egyptologist-" +
      "style regnal chronology for Benin — which for the fifteenth century is itself reconstructed, " +
      "largely from Egharevba's king list. SO THIS IS A TRADITIONAL DATE PINNED TO A RECONSTRUCTED DATE, " +
      "and the uncertainty of the second is inherited entirely by the first.\n\n" +
      "THINGS TO ASK: If a tradition dates itself by a king, how good is the king's date?",
    category: "history",
    subcategory: "Migration claim",
    eventType: "traditional_account",
    identificationStatus: "disputed",
    tags: ["migration", "anwu", "avhianwu", "ewuare", "kingdom-of-benin", "oral-knowledge", "chronology"],
    people: ["Anwu", "Alokoko", "Ewuare"],
    civilisations: ["Etsako", "Avhianwu", "Kingdom of Benin"],
    locationName: "Benin City, Edo State, Nigeria",
    lat: 6.34,
    lng: 5.62,
    claims: [
      {
        sourceKey: "ogbona_elites",
        startYear: 1440,
        endYear: 1473,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "Anwu's migration from Benin, on the Ewuare tradition",
        originalDateText: "The middle of the 15th Century, during the reign of Oba Eware the Great",
        datingMethod: "regnal_chronology",
        chronology: "oral_tradition",
        evidence:
          "WHAT PRODUCED THIS DATE: attachment of the tradition to a named reign, plus the conventional " +
          "dates for that reign. THE SECOND STEP IS WEAKER THAN IT LOOKS — fifteenth-century Benin regnal " +
          "chronology is a reconstruction from king lists, not an independently dated framework. WHAT IT " +
          "ESTABLISHES: what this version of the tradition says. WHAT IT DOES NOT: when anybody moved.",
      },
    ],
  },

  {
    slug: "migration-claim-ozolua",
    title: "Claim B: Anwu left Benin under Ozolua, 1481–1504",
    summary:
      "A second community account, from the same publisher, places the migration a generation later — in the reign of Oba Ozolua — and adds a first settlement at Afashio in Uzairue.",
    description:
      "THE CLAIM. That Anwu migrated from Benin DURING THE REIGN OF OBA OZOLUA, given as 1481–1504, and " +
      "initially settled at AFASHIO-UZAIRUE.\n\n" +
      "HOW IT DIFFERS FROM CLAIM A. By roughly forty years — a generation and a half — and, more usefully, " +
      "by carrying an EXTRA DETAIL that Claim A does not: a named first settlement. A tradition with a " +
      "route in it is doing more work than one with only a departure.\n\n" +
      "THE ROUTE THIS VERSION IMPLIES. Benin → AFASHIO in Uzairue → UTAGBABOR in what is now Fugar → and " +
      "from there the dispersal of the four sons to Ivhiunone, Ivhiarua, Ogbona and Iraokhor. THAT IS " +
      "THREE MOVES, NOT ONE, and it describes a staged advance northwards rather than a single journey.\n\n" +
      "WHY BOTH CLAIMS ARE KEPT. Because they are both published, both positively stated, and neither is " +
      "corroborated from outside. Averaging them into 'the late fifteenth century' would produce a figure " +
      "that neither source asserts and that no evidence supports.\n\n" +
      "THE THING A READER SHOULD NOTICE. Both claims come from the SAME PUBLISHER. They are not two " +
      "independent traditions agreeing roughly; they are one community record disagreeing with itself, " +
      "which is a different and more interesting situation — and it is the subject of the source-" +
      "dependency record.\n\n" +
      "THINGS TO ASK: Two dates forty years apart from one source. Is that two memories, or one memory and " +
      "one guess?",
    category: "history",
    subcategory: "Migration claim",
    eventType: "traditional_account",
    identificationStatus: "disputed",
    tags: ["migration", "anwu", "avhianwu", "ozolua", "kingdom-of-benin", "afashio", "uzairue", "chronology"],
    people: ["Anwu", "Ozolua"],
    civilisations: ["Etsako", "Avhianwu", "Kingdom of Benin"],
    locationName: "Afashio, Uzairue, Edo State, Nigeria",
    lat: 6.9,
    lng: 6.3,
    claims: [
      {
        sourceKey: "ogbona_elites",
        startYear: 1481,
        endYear: 1504,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "Anwu's migration from Benin, on the Ozolua tradition",
        originalDateText: "During the reign of Oba Ozolua, 1481–1504",
        datingMethod: "regnal_chronology",
        chronology: "oral_tradition",
        evidence:
          "WHAT PRODUCED THIS DATE: the same method as Claim A — a named reign with conventional dates — " +
          "applied to a different Oba. NOTE THAT THE REGNAL DATES ARE GIVEN PRECISELY, to the year, which " +
          "gives the claim an air of exactness it does not have: the precision belongs to the published " +
          "king list, not to the migration.",
      },
      {
        sourceKey: "ogbona_elites",
        startYear: 1481,
        endYear: 1600,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The staged route from Benin to the four settlements",
        originalDateText: "Benin, then Afashio-Uzairue, then Utagbabor in Fugar, then the dispersal to four towns",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHY THIS IS A SEPARATE CLAIM: because a route is a different assertion from a departure date, " +
          "and because a staged migration takes TIME. If there were three moves and a dispersal, the " +
          "process spans generations rather than a season — which is why the range runs to 1600 rather " +
          "than closing with Ozolua's reign.",
      },
    ],
  },

  {
    slug: "migration-source-dependency",
    title: "Two migration dates, one source",
    summary:
      "Claim A and Claim B look like independent traditions and are published by the same community website — and both may descend from one 1999 book. Repetition is not corroboration.",
    description:
      "WHAT KIND OF RECORD IS THIS? The methodological centre of the migration question.\n\n" +
      "THE SITUATION. The Ewuare date and the Ozolua date are both published by ogbonaelites.org, on " +
      "different pages, each stated as fact. Neither cites the other. Neither cites a source. A researcher " +
      "meeting them separately would reasonably take them for two traditions.\n\n" +
      "WHY THAT MATTERS SO MUCH. Because the natural response to two roughly-agreeing dates is to feel " +
      "more confident, and the natural response to two disagreeing ones is to split the difference. BOTH " +
      "RESPONSES ARE WRONG WHEN THE TWO ARE ONE. If five websites repeat one sentence that originated in a " +
      "1999 book, that is ONE underlying source with five copies, and the copies add nothing.\n\n" +
      "THE SPECIFIC SUSPICION. That both versions descend, directly or at a remove, from THE DESCENT OF " +
      "AVHIANWU (1999) — the one substantial published history of this clan, written by a member of it, " +
      "and the obvious quarry for anybody writing Avhianwu history since. IF THE BOOK GIVES ONE DATE, then " +
      "one of the two website versions is a later alteration and the question becomes which and why. IF " +
      "THE BOOK GIVES BOTH, then the disagreement is older than the website and may preserve a real " +
      "divergence between communities.\n\n" +
      "WHAT CANNOT BE SAID. Which of those it is. The book could not be read by this investigation, and " +
      "this record does not guess.\n\n" +
      "THE GENERAL RULE THIS DATASET FOLLOWS. Trace claims backwards: original source, then quotation, " +
      "then modern website — and count sources rather than pages.\n\n" +
      "THINGS TO ASK: How many independent witnesses do you actually have?",
    category: "history",
    subcategory: "Debate",
    eventType: "disputed",
    tags: ["debate", "method", "source-dependency", "migration", "avhianwu", "historiography"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Avhianwu, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "descent_of_avhianwu_1999",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether the competing migration dates are independent traditions or one source copied",
        originalDateText: "Unresolved, because the probable underlying book could not be read",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "WHAT IS KNOWN: both dates come from one publisher; a substantial clan history was published in " +
          "1999; and community websites in this field characteristically draw on such books without " +
          "citation. WHAT IS NOT KNOWN: what the book says. WHY THIS IS THE HIGHEST-VALUE UNANSWERED " +
          "QUESTION in the migration part of this dataset: one afternoon with the book would resolve it.",
      },
    ],
  },

  {
    slug: "people-were-already-there",
    title: "The land was not empty",
    summary:
      "Migration traditions describe arrivals. It has become clear that people were living in Afemai country before the migrations from Benin City — which changes what the traditions are evidence of.",
    description:
      "THE CORRECTIVE. Etsako and Afemai migration traditions, almost without exception, describe groups " +
      "ARRIVING from Benin. Taken together and taken literally, they would describe a country that was " +
      "empty until the fifteenth century and then filled up. IT WAS NOT. It has become clear that there " +
      "were people living in Afemai country before the migration from Benin City.\n\n" +
      "WHAT THAT DOES TO THE TRADITIONS. It does not make them false. It changes what they are ABOUT. A " +
      "migration tradition in a peopled landscape is not an account of settlement; it is an account of the " +
      "arrival of a particular group — usually the group that ended up leading — and of how it came to " +
      "hold the position it holds. THE PEOPLE WHO WERE ALREADY THERE ARE THE PART THAT DROPS OUT, because " +
      "the tradition belongs to the newcomers.\n\n" +
      "WHY THIS IS A FAMILIAR SHAPE. It is the same structure as Dahomey's foundation story on the other " +
      "side of the region, where the arriving dynasty deals with — and in the story kills — a Gedevi chief " +
      "who was there first. ARRIVAL TRADITIONS ARE ALMOST ALWAYS TOLD BY ARRIVERS, and the prior " +
      "inhabitants survive in them as obstacles, hosts or victims, if at all.\n\n" +
      "WHAT IT MEANS FOR THE OKOMILO QUESTION SPECIFICALLY. That a family attached to Innih need not " +
      "descend from the migration at all. A family may descend from the newcomers, from people already in " +
      "the area who were incorporated, or from later arrivals from elsewhere. THE STRUCTURAL CHAIN " +
      "OKOMILO → INNIH → IVHITSE → IVHIOCHIE → OGBONA IS COMPATIBLE WITH ALL THREE, and nothing reached " +
      "here decides between them.\n\n" +
      "THINGS TO ASK: Whose tradition survives, in a place where two peoples met?",
    category: "history",
    subcategory: "Debate",
    eventType: "disputed",
    tags: ["debate", "migration", "etsako", "afemai", "method", "oral-knowledge", "avhianwu"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Afemai country, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.2,
    claims: [
      {
        sourceKey: "etsako_wikipedia",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When Afemai country was first settled",
        originalDateText: "Before the Benin migrations; the prior occupation is not dated in any source reached here",
        datingMethod: "archaeological",
        chronology: "conventional",
        evidence:
          "WHAT IS ESTABLISHED: that there were people in Afemai country before the migrations the " +
          "traditions describe. WHAT IS NOT: when, who, or in what numbers — that is an archaeological " +
          "question and Afemai country has had far less archaeology than Benin City. WHY POSITIONLESS: " +
          "putting a date on a prior occupation nobody has excavated would be inventing the very thing " +
          "this record says is missing.",
        notes:
          "NEEDS BETTER SOURCING urgently: this is a general statement from reference material rather " +
          "than a citation of the archaeology or the scholarship that established it.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // INSTITUTIONS: TITLE, AGE, YEAR, ELDERSHIP
  // -------------------------------------------------------------------------
  {
    slug: "okhe-title-and-the-1851-ban",
    title: "Okhe, and the ban of 1851",
    summary:
      "The title a man must take before he can hold office. Community history records that in 1851 Fugar banned Ogbona from performing it, after an uninitiated Ogbona man killed a title holder.",
    description:
      "WHAT OKHE IS. A TITLE, taken by men, which is the qualification for chieftaincy and other office: " +
      "only men who have performed Okhe can become chiefs or title holders. The ceremony is closed — women " +
      "do not take part — and the knowledge attached to it is restricted to those who have.\n\n" +
      "WHY A TITLE SYSTEM MATTERS TO A GENEALOGY. Because it generates RANKED, REMEMBERED LISTS OF NAMED " +
      "MEN. A society in which office depends on a title records who took it, in what order, and in which " +
      "family — and those records, whether written or recited, are among the best genealogical sources any " +
      "community produces. AN OKHE LIST FOR INNIH WOULD BE WORTH MORE TO THIS INVESTIGATION THAN ANY " +
      "AMOUNT OF GENERAL HISTORY.\n\n" +
      "THE DATED EVENT, WHICH IS UNUSUAL. Community history records that in 1851 FUGAR BANNED OGBONA FROM " +
      "PERFORMING THE OKHE TITLE, because an uninitiated man from Ogbona had killed a title holder. A " +
      "SPECIFIC YEAR IN A PRE-COLONIAL ORAL RECORD IS RARE and is worth flagging as such: most traditions " +
      "in this dataset carry no date at all.\n\n" +
      "HOW TO TREAT THAT DATE. With interest and with caution. 1851 is precise, it is pre-colonial for " +
      "this area, and nothing independent corroborates it. Dates of this kind in community histories are " +
      "sometimes genuine, sometimes calculated later by a writer working backwards, and sometimes " +
      "borrowed. WHAT THE EVENT SHOWS REGARDLESS: that the four Avhianwu communities had authority over " +
      "one another in ritual matters, and that Fugar could sanction Ogbona — which is a statement about " +
      "seniority, and connects directly to the modern argument about clan status.\n\n" +
      "WHAT IS NOT ESTABLISHED. Whether the ban was lifted, when, or what Ogbona did about it in the " +
      "meantime.\n\n" +
      "THINGS TO ASK: What does it mean that one town could stop another from making chiefs?",
    category: "culture",
    subcategory: "Title and initiation",
    eventType: "traditional_account",
    identificationStatus: "possible",
    tags: ["okhe", "title", "initiation", "avhianwu", "ogbona", "fugar", "oral-knowledge", "genealogy"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Ogbona and Fugar, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "ogbona_elites",
        startYear: 1851,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "traditional_date",
        whatIsDated: "Fugar's ban on Ogbona performing the Okhe title",
        originalDateText: "In 1851, after an uninitiated man from Ogbona killed a title holder",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHY THIS DATE IS INTERESTING: it is a specific pre-colonial year in an oral record, which is " +
          "rare enough to be worth examining rather than accepting. WHAT SUPPORTS IT: nothing outside the " +
          "community account. WHAT WOULD TEST IT: whether the same year appears in The Descent of " +
          "Avhianwu, and whether the dispute left any trace in later colonial records of chieftaincy in " +
          "the division.",
        notes: "NEEDS SOURCE VERIFICATION. A precise year with no corroboration is a lead, not a fact.",
      },
    ],
  },

  {
    slug: "age-grades-and-the-year",
    title: "Age grades, Esi and Adui Iku Kwa",
    summary:
      "Men are ranked by age set — Ekpe and Iwogo, Ogore, Ikpisa. The year turns at Adui Iku Kwa, a cleansing festival in March or April, and the harvest is marked by Esi, the new yam.",
    description:
      "THE AGE SYSTEM. Male age stratification is a defining feature of social organisation in Avhianwu, as " +
      "across Edo-speaking groups. The population is divided into the UNINITIATED ADOLESCENTS — Ekpe and " +
      "Iwogo — the ADULTS, Ogore, and the ELDERS, Ikpisa.\n\n" +
      "WHY AGE GRADES ARE A GENEALOGICAL RESOURCE. Because an age set is a NAMED COHORT OF PEOPLE WHO " +
      "PASSED THROUGH AN INITIATION TOGETHER, and communities that run them normally remember which set a " +
      "man belonged to. That converts a vague 'he was old' into a position in a sequence of sets, and a " +
      "sequence of sets is a rough chronology. IF THE OKOMILO MEN OF THE LAST CENTURY CAN BE PLACED IN AGE " +
      "SETS, they can be ordered in time without any documents at all.\n\n" +
      "ADUI IKU KWA — THE NEW YEAR. Celebrated across the four Avhianwu communities between MARCH and " +
      "APRIL, marking the turn of the traditional year. The phrase is glossed as WASTE DISPOSAL or the " +
      "CLEANSING OF ALL PAST THINGS AND DEEDS. At midnight the Ivhiomu'kpes, the makers of the new year, " +
      "having kept watch around the UKPE SHRINE, invoke the powers to fashion a new year for the people.\n\n" +
      "ESI — THE NEW YAM. The harvest festival, in which the clan gives thanks at the end of the farming " +
      "season, and which is explicitly described as a mechanism for repairing relationships: eliminating " +
      "acrimony by cooking and eating together.\n\n" +
      "WHAT THE TWO FESTIVALS DO BETWEEN THEM. One closes the year and clears what is owed; the other " +
      "closes the farming season and repairs what is broken. A CALENDAR WITH TWO RESET POINTS, one moral " +
      "and one agricultural.\n\n" +
      "WHAT IS NOT ESTABLISHED HERE. Anything Okomilo-specific. These are GENERAL AVHIANWU TRADITIONS, and " +
      "this record says so: no source reached here describes the Okomilo family's particular part in " +
      "either festival, and assigning clan custom to one family would be exactly the error this dataset is " +
      "built to avoid.\n\n" +
      "THINGS TO ASK: What does a society need two new years for?",
    category: "culture",
    subcategory: "Festivals and age grades",
    eventType: "traditional_account",
    tags: ["esi", "ukpe", "adui-iku-kwa", "age-grades", "avhianwu", "ogbona", "ritual", "calendar"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Avhianwu, Etsako Central, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "ogbona_elites",
        datePrecision: "month",
        isApproximate: true,
        temporalClaimType: "cyclic",
        whatIsDated: "Adui Iku Kwa, the traditional new year, as an annually recurring festival",
        originalDateText: "Between March and April each year, as the situation warrants",
        datingMethod: "oral_tradition",
        chronology: "traditional",
        evidence:
          "WHY THIS IS TYPED AS A RECURRING CYCLE AND CARRIES NO YEAR: because a festival that happens " +
          "every year is not an event at a position, and pinning it to any one year would make a calendar " +
          "look like an occurrence. NOTE THAT THE TIMING IS NOT FIXED TO A DAY: 'as the " +
          "situation may warrant' is the source's own wording, and a movable feast is a real feature of " +
          "the calendar rather than vagueness in the record.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the age-grade system and the festivals began",
        originalDateText: "Date unknown",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHY NO DATE: these are living institutions described in the present, with no earliest recorded " +
          "description reached by this investigation. The 1936 intelligence report would give a latest-by " +
          "date for all of them at once.",
      },
    ],
  },

  {
    slug: "odion-is-gerontocracy-not-descent",
    title: "Why an Odion list will not give you a genealogy",
    summary:
      "The hope was that eldership succession might preserve the family line. It will not: the Odionwere is the oldest living man, chosen by age, and age jumps between branches.",
    description:
      "WHAT KIND OF RECORD IS THIS? The answer to a specific hypothesis, and the answer is no — with one " +
      "genuinely promising exception.\n\n" +
      "THE HYPOTHESIS. That if family shrine and eldership succession follows SENIOR MALE DESCENT, then " +
      "the succession of Odion in a family might preserve part of that family's genealogy. It is a good " +
      "idea, because in many societies it is true.\n\n" +
      "WHY IT DOES NOT HOLD FOR THE ODIONWERE. Because Odionwere succession in this Edo system is " +
      "GERONTOCRATIC. The Odionwere is simply the OLDEST MAN — the senior by age in the community or " +
      "unit, installed automatically on the death of his predecessor. AN AGE-BASED SUCCESSION DOES NOT " +
      "FOLLOW A LINE. It hops from branch to branch of a lineage according to who happens to be living " +
      "longest, so a list of Odionwere is a list of long-lived men in the order they died, and a " +
      "father-to-son chain is exactly what it does not record.\n\n" +
      "THE DISTINCTION THAT MATTERS. A succession list is genealogically useful when the office passes BY " +
      "DESCENT and useless when it passes BY AGE. Both systems exist, often side by side, and the " +
      "hypothesis is right about the first and wrong about the second.\n\n" +
      "THE EXCEPTION, WHICH IS WORTH PURSUING. ANCESTRAL ALTARS ARE DIFFERENT. In Edo practice the duty of " +
      "establishing and maintaining an ancestral shrine falls to the ELDEST SON, particularly for a " +
      "father. An institution transmitted eldest-son to eldest-son DOES track a senior male line — so a " +
      "FAMILY ancestral shrine, if the Okomilo family keeps one and if it follows that pattern, may well " +
      "carry the succession the Odion list cannot.\n\n" +
      "SO THE LEAD CHANGES SHAPE. Not 'get the Odion list', but 'ask who maintains the Okomilo family's " +
      "ancestral shrine, and from whom he received it'. THAT IS A DIFFERENT QUESTION WITH A BETTER CHANCE " +
      "OF AN ANSWER.\n\n" +
      "ONE CAUTION. Whether Etsako practice matches Edo practice in this respect is NOT ESTABLISHED here. " +
      "The Edo evidence is described in the general literature; the Etsako case, and the Avhianwu term " +
      "Adi, could not be documented from any source reached.\n\n" +
      "THINGS TO ASK: Does the office you are tracing pass by blood, or by birthday?",
    category: "people",
    subcategory: "Method",
    eventType: "archaeological_interpretation",
    eventTypeNote: "An assessment of whether a proposed genealogical source would actually work.",
    identificationStatus: "modern_interpretation",
    tags: ["odion", "odionwere", "adi", "genealogy", "method", "edo", "etsako", "shrine"],
    civilisations: ["Etsako", "Edo", "Avhianwu"],
    locationName: "Edo State, Nigeria",
    lat: 6.8,
    lng: 6.0,
    claims: [
      {
        sourceKey: "etsako_wikipedia",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether eldership succession preserves a descent line",
        originalDateText: "It does not for the Odionwere, which is gerontocratic; it may for a family ancestral shrine",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "FOR THE NEGATIVE: Odionwere succession is described as determined on the basis of gerontocracy " +
          "— the oldest male is automatically installed — which by its nature cannot encode a line. FOR " +
          "THE EXCEPTION: Edo ancestral altars are described as the responsibility of the eldest son, " +
          "which by its nature can. WHAT IS MISSING: any documentation of Etsako or specifically Avhianwu " +
          "practice, including the term Adi, which could not be verified anywhere.",
        notes:
          "NEEDS SOURCE VERIFICATION for the Etsako case specifically. The word Adi, used for a family " +
          "ancestral shrine, is not attested in any source reached by this investigation, and confirming " +
          "the term is a prerequisite to using the institution.",
      },
    ],
  },

  {
    slug: "avhianwu-split-into-two-clans",
    title: "Avhianwu is split into Fugar and Anwu clans",
    summary:
      "A modern administrative division separated the four communities: Fugar on one side, Ogbona and Iraokhor now in an Anwu clan. It was protested, formally, in writing.",
    description:
      "WHAT HAPPENED. Avhianwu clan was split, administratively, into a FUGAR clan and an ANWU clan, with " +
      "OGBONA AND IRAOKHOR placed in Anwu. A letter of protest against the creation of the Fugar clan was " +
      "addressed to the Executive Governor of Edo State.\n\n" +
      "WHY THIS BELONGS IN A GENEALOGICAL DATASET. Because it is the founding tradition, still operating, " +
      "in the present tense. The claim that the four communities descend from four FULL BROTHERS of the " +
      "same parents is a claim of EQUAL STANDING; a division that separates two from the other two is a " +
      "claim about difference. THE ARGUMENT ABOUT ANWU'S SONS IS BEING CONDUCTED THROUGH A STATE " +
      "GOVERNMENT'S CHIEFTAINCY MACHINERY.\n\n" +
      "AND WHY THAT CHANGES HOW THE TRADITION SHOULD BE READ. A tradition that is politically live is a " +
      "tradition with an interest in its own content. When Avhianwu sources insist that the four sons had " +
      "the same father AND the same mother, that insistence is doing work in a live dispute — which is " +
      "not a reason to disbelieve it, and is a reason to notice that it is not a neutral statement.\n\n" +
      "THE OLDER PARALLEL. The 1851 tradition, in which Fugar could ban Ogbona from performing Okhe, is " +
      "the same relationship in an earlier form: precedence between the four communities, contested.\n\n" +
      "WHAT IS NOT ESTABLISHED. The date of the split, its legal instrument, or its outcome. No year could " +
      "be confirmed from the material reached.\n\n" +
      "THINGS TO ASK: When a government redraws a clan, whose history is it editing?",
    category: "history",
    subcategory: "Modern",
    eventType: "historical",
    evidenceStatus: "unresolved",
    tags: ["avhianwu", "fugar", "ogbona", "iraokhor", "clan", "modern", "politics", "legitimacy"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Etsako Central, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "ogbona_elites",
        startYear: 2000,
        endYear: 2025,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The administrative split of Avhianwu into Fugar and Anwu clans",
        originalDateText: "A recent administrative division; no date could be confirmed",
        datingMethod: "estimate",
        chronology: "community",
        evidence:
          "WHY THE RANGE IS A QUARTER-CENTURY WIDE: because the source establishes that it happened and " +
          "that it was protested, and gives no date that could be read through search. THE RANGE IS A " +
          "PLACEHOLDER AROUND A REAL EVENT and should be replaced with the actual instrument and year.",
        notes:
          "NEEDS BETTER SOURCING: the Edo State gazette or chieftaincy declaration creating the clans " +
          "would date this precisely, and the letter of protest would carry its own date.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE WORLD THE TRADITION SAYS THEY CAME FROM
  // -------------------------------------------------------------------------
  {
    slug: "the-kingdom-of-benin-is-not-the-republic",
    title: "The Kingdom of Benin is not the Republic of Bénin",
    summary:
      "This lineage points at Edo State, Nigeria. It does not point at Dahomey. The two Benins are different countries and confusing them corrupts every search in this subject.",
    description:
      "WHY THIS RECORD OPENS THE BENIN SECTION OF AN OKOMILO DATASET. Because the moment an investigation " +
      "of this family reaches the word 'Benin', it acquires a permanent hazard.\n\n" +
      "THE KINGDOM OF BENIN. An EDO state centred on BENIN CITY, in what is now Edo State, NIGERIA. Famous " +
      "for its brass and ivory sculpture and for the sack of its capital by a British punitive expedition " +
      "in 1897. THIS IS THE BENIN THE AVHIANWU MIGRATION TRADITION MEANS.\n\n" +
      "THE REPUBLIC OF BÉNIN. A separate West African country, formerly the Kingdom and then the colony of " +
      "DAHOMEY, which took the name Bénin in 1975 from the Bight of Benin — the stretch of coast — rather " +
      "than from the kingdom. Different country, different language family for its main southern peoples, " +
      "different history. NOTHING IN THE OKOMILO LINEAGE POINTS THERE.\n\n" +
      "HOW THE CONFUSION ACTUALLY DAMAGES RESEARCH. A search for Benin history returns Dahomean material. " +
      "A search for Benin archaeology returns excavations in two countries. Museum captions for Benin " +
      "Bronzes are read as belonging to the Republic. AND IN THE OTHER DIRECTION, Dahomean royal python " +
      "traditions get pulled into arguments about Edo ones because both are 'Benin'.\n\n" +
      "THE ONE LEGITIMATE REASON TO PUT THEM SIDE BY SIDE. Deliberate comparison, clearly labelled, with " +
      "the evidence for any proposed connection stated. Both are West African, both have serpent " +
      "traditions, both had sacred kingship — and those are regional commonalities, not a relationship. " +
      "This project keeps two entirely separate datasets for exactly that reason.\n\n" +
      "THINGS TO ASK: How many of the results you are reading are about the other country?",
    category: "history",
    subcategory: "Method",
    eventType: "other",
    eventTypeNote: "A record about a naming collision and the errors it causes.",
    tags: ["method", "naming", "kingdom-of-benin", "edo", "nigeria", "historiography"],
    civilisations: ["Kingdom of Benin", "Edo"],
    locationName: "Benin City, Edo State, Nigeria",
    lat: 6.34,
    lng: 5.62,
    claims: [
      {
        sourceKey: "etsako_wikipedia",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Nothing. This record is about a name collision",
        originalDateText: "Not a dated event",
        datingMethod: "other",
        chronology: "conventional",
        evidence:
          "WHY IT CARRIES A POSITIONLESS CLAIM RATHER THAN NONE: so that it surfaces alongside every " +
          "record in this dataset that mentions Benin, without being drawn anywhere on the axis.",
      },
    ],
  },

  {
    slug: "benin-city-and-the-iya",
    title: "Benin City and the Iya earthworks",
    summary:
      "The city the migration tradition points back to is one of the most substantial archaeological landscapes in West Africa — vast earthworks, excavated from 1963, dated between roughly the eighth and fifteenth centuries.",
    description:
      "WHY THIS RECORD EXISTS IN A FAMILY HISTORY. Because the tradition says Anwu came from Benin, and a " +
      "reader is entitled to know what Benin was when he is said to have left it. THIS IS ANCESTRAL " +
      "CULTURAL CONTEXT AND IT IS NOT OKOMILO GENEALOGY — no Oba in this record is an ancestor of anybody " +
      "in this dataset, and none is claimed to be.\n\n" +
      "WHAT IS THERE. The IYA: a vast system of earthworks — banks and ditches — around and beyond Benin " +
      "City, among the largest earthwork complexes anywhere. Graham Connah excavated a cut through the Iya " +
      "in 1963 and took a radiocarbon sample from it; he and later Patrick Darling surveyed the system " +
      "through the 1960s and 1970s. Substantial excavation in the 1960s found a stratified sequence some " +
      "three metres deep, with thirteenth-to-fourteenth-century and eighteenth-to-nineteenth-century " +
      "phases including palace buildings.\n\n" +
      "THE DATES, WITH THE CAVEAT THAT TRAVELS WITH THEM. The earthworks as a whole are placed roughly " +
      "between 700 and 1400 CE; Connah's work put the Inner City Iya in the thirteenth to fifteenth " +
      "centuries. AND THE PUBLISHED FIGURES CARRY A LARGE ERROR MARGIN — around a century — AND ARE " +
      "REPORTED UNCALIBRATED, which means they are not directly comparable with modern calibrated dates. " +
      "A DATE FROM 1963 IS A DATE FROM 1963.\n\n" +
      "WHAT IT MEANS FOR THE MIGRATION TRADITION. That a fifteenth-century departure from Benin would be a " +
      "departure from a large, old, walled, hierarchical city at the height of its power — not from a " +
      "village. Whatever the tradition's accuracy about Anwu, it is pointing at a real and substantial " +
      "place.\n\n" +
      "THINGS TO ASK: What is an uncalibrated radiocarbon date from 1963 worth today?",
    category: "archaeology",
    subcategory: "Benin context",
    eventType: "archaeological_interpretation",
    evidenceStatus: "strongly_documented",
    tags: ["archaeology", "kingdom-of-benin", "benin-city", "earthworks", "iya", "connah", "dating"],
    people: ["Graham Connah", "Patrick Darling"],
    civilisations: ["Kingdom of Benin", "Edo"],
    locationName: "Benin City, Edo State, Nigeria",
    lat: 6.34,
    lng: 5.62,
    claims: [
      {
        sourceKey: "connah_benin_earthworks",
        startYear: 700,
        endYear: 1400,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The Benin earthworks as a whole",
        originalDateText: "Roughly 700 to 1400 AD",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        evidence:
          "WHAT PRODUCED THIS RANGE: radiocarbon dating of the earthworks. THE CAVEAT IS PART OF THE " +
          "CLAIM: the published margin of error is large, around a century, and the figures are reported " +
          "uncalibrated — so they should not be set beside calibrated dates from other projects without " +
          "conversion.",
        notes: "NEEDS SOURCE VERIFICATION for the individual determinations and their laboratory codes.",
      },
      {
        sourceKey: "connah_benin_earthworks",
        startYear: 1200,
        endYear: 1499,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The Inner City Iya, on Connah's excavation",
        originalDateText: "Thirteenth to fifteenth centuries",
        datingMethod: "radiocarbon",
        chronology: "archaeological",
        evidence:
          "A NARROWER AND BETTER-FOUNDED CLAIM than the one above, because it rests on an excavated cut " +
          "rather than on the complex as a whole. NOTE WHAT IT MEANS FOR THE MIGRATION TRADITION: the " +
          "Inner City earthworks and the fifteenth-century departure the tradition describes fall in the " +
          "same period.",
      },
      {
        sourceKey: "connah_benin_earthworks",
        startYear: 1963,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Connah's cut through the Iya and the taking of the radiocarbon sample",
        originalDateText: "1963",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: THE FIELDWORK, not the earthwork. Kept as its own claim because the date of an " +
          "excavation determines what methods were available to it, and a 1963 radiocarbon date is a " +
          "different object from a 2023 one.",
      },
    ],
  },

  {
    slug: "benin-palace-pythons-and-olokun",
    title: "The pythons on the Oba's palace",
    summary:
      "Brass serpents ran down the turrets of the Oba's palace in pairs, cast in sections, some with sheet-metal tongues that moved in the wind. The python there is the symbol of Olokun, deity of the waters.",
    description:
      "WHAT WAS THERE. Brass snakes, CAST IN SECTIONS, running down the turrets of the Oba's palace at " +
      "Benin City, made in PAIRS — two to a tower — with the wooden roof shingles nailed around them. Some " +
      "surviving heads have attached SHEET-METAL TONGUES that apparently moved in the wind, which makes " +
      "them a rare instance of early kinetic sculpture. Surviving examples include eighteenth-century " +
      "work.\n\n" +
      "WHAT THE PYTHON MEANS THERE. It is the symbol of OLOKUN, deity of the waters, the sea and wealth. " +
      "The association is with water, with the inflow of prosperity, and — through the Oba's own " +
      "relationship with Olokun — with kingship.\n\n" +
      "WHAT HAPPENED TO THEM. The palace burned in 1897, during the British punitive expedition. The heat " +
      "of the underlying wooden fire probably melted the brass, and at least one head dropped off. The " +
      "objects that survive are in museum collections outside Nigeria, as a consequence of that expedition.\n\n" +
      "WHY THIS RECORD IS IN AN OKOMILO DATASET. Solely for comparison with the Alokoko python tradition, " +
      "and the comparison record next to it is explicit that a shared animal is not a shared tradition. " +
      "NOTHING HERE IS OFFERED AS THE ORIGIN OF ANYTHING IN AVHIANWU.\n\n" +
      "THINGS TO ASK: A snake on a roof and a snake you must not eat. What would make them the same " +
      "tradition?",
    category: "culture",
    subcategory: "Benin context",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["kingdom-of-benin", "python", "olokun", "sacred-animals", "royal-art", "brass", "1897", "comparison"],
    civilisations: ["Kingdom of Benin", "Edo"],
    locationName: "Benin City, Edo State, Nigeria",
    lat: 6.34,
    lng: 5.62,
    imageUrl: commons("Oba of Benin Palace, Benin, Edo state.jpg"),
    claims: [
      {
        sourceKey: "benin_court_art_scholarship",
        startYear: 1700,
        endYear: 1799,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Surviving brass serpent heads from the palace turrets",
        originalDateText: "Eighteenth-century work, resembling the snake on a throne of the same period",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "WHAT PRODUCED THIS DATE: stylistic comparison with other dated court brass, which is the " +
          "standard method for Benin casting and carries the standard weakness — it inherits the " +
          "uncertainty of whatever it is compared with. WHAT IT DATES: particular surviving objects, NOT " +
          "the practice of putting serpents on the palace, which may be much older.",
      },
      {
        sourceKey: "benin_court_art_scholarship",
        startYear: 1897,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The burning of the palace and the loss of the brass serpents in place",
        originalDateText: "1897",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "A DOCUMENTED EVENT WITH A PRECISE DATE, and the reason these objects are in Europe and America " +
          "rather than on a roof in Benin City. The date is secure because it is the date of a British " +
          "military expedition, recorded by the people who conducted it.",
      },
    ],
    media: [
      {
        url: commons("Oba of Benin Palace, Benin, Edo state.jpg"),
        sourcePageUrl: commonsPage("Oba of Benin Palace, Benin, Edo state.jpg"),
        fileName: "Oba of Benin Palace, Benin, Edo state.jpg",
        caption:
          "The Oba's palace at Benin City, in Edo State, Nigeria. THIS IS NOT THE BUILDING THE BRASS SERPENTS STOOD ON: that palace was destroyed in 1897 and rebuilt in the twentieth century. The photograph shows the site and the institution, not the roof described in this record.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "DELIBERATELY LABELLED AGAINST ITSELF. A modern photograph of a rebuilt palace is constantly " +
          "reproduced as though it showed the pre-1897 building.",
        creditFrom: "source",
      },
      {
        url: commons("Benin brass plaque 01.jpg"),
        sourcePageUrl: commonsPage("Benin brass plaque 01.jpg"),
        fileName: "Benin brass plaque 01.jpg",
        caption:
          "A cast brass plaque from Benin City. NOT A PYTHON PLAQUE: it is attached here to show the material, the casting tradition and the palace context in which the brass serpents were made, and it should not be read as an illustration of them.",
        kind: "image",
        shows: "museum_specimen",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for the holding institution and for how the plaque left Benin City — " +
          "which for objects of this class is almost always the 1897 expedition.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "benin-python-versus-alokoko",
    title: "Benin's palace python and Avhianwu's Alokoko: same animal, different traditions",
    summary:
      "Both are pythons and that is nearly all they share. One is a water deity's emblem on a king's roof; the other is an ancestress you may not eat. The comparison is set out and not resolved.",
    description:
      "WHAT KIND OF RECORD IS THIS? A structured comparison, with the possible conclusions listed and none " +
      "chosen.\n\n" +
      "THE TWO TRADITIONS, SIDE BY SIDE.\n\n" +
      "  WHO IS THE PYTHON?   BENIN: the emblem of OLOKUN, deity of waters and wealth.\n" +
      "                       AVHIANWU: ALOKOKO, the ancestral mother of the clan.\n\n" +
      "  WHAT KIND OF POWER?  BENIN: a DEITY, in a cosmology of many.\n" +
      "                       AVHIANWU: an ANCESTOR, in a genealogy.\n\n" +
      "  WHERE IS IT?         BENIN: on the ROOF OF THE KING'S PALACE, in brass, in pairs.\n" +
      "                       AVHIANWU: alive, in the bush, and at a SHRINE AT OGBONA.\n\n" +
      "  WHAT DO YOU OWE IT?  BENIN: royal and religious association; no food taboo is recorded here.\n" +
      "                       AVHIANWU: YOU MAY NOT EAT IT, and if you do you must be pardoned at the shrine.\n\n" +
      "  WHOSE IS IT?         BENIN: the OBA'S, and the kingdom's.\n" +
      "                       AVHIANWU: THE CLAN'S, by descent from a named woman.\n\n" +
      "  WHAT IS THE NAME?    No shared terminology is established. Olokun and Alokoko are not shown to be\n" +
      "                       related, and the resemblance of the two names is NOT treated as evidence here.\n\n" +
      "THE ONE THING THAT SHOULD BE SAID ABOUT THE NAMES. Olokun and Alokoko look alike to an English " +
      "reader. THAT IS EXACTLY THE KIND OF OBSERVATION THIS PROJECT REFUSES TO BUILD ON. Establishing a " +
      "relationship would require regular sound correspondence between Edo and Etsako demonstrated by " +
      "somebody competent in both — not a resemblance noticed in transliteration. No such demonstration " +
      "was found, and none is assumed.\n\n" +
      "THE FIVE POSSIBLE CONCLUSIONS, ALL LEFT OPEN. (A) HISTORICAL CONTINUITY: the tradition travelled " +
      "with the migration. (B) BROADER EDO INHERITANCE: both descend from something older and wider, and " +
      "neither from the other. (C) LATER BORROWING: contact after the migration. (D) INDEPENDENT " +
      "TRADITIONS: pythons are large, dangerous, memorable and widely venerated in West Africa for reasons " +
      "that need no common origin. (E) INSUFFICIENT EVIDENCE.\n\n" +
      "WHERE THE WEIGHT CURRENTLY SITS, STATED HONESTLY. On (E), with (B) and (D) the most economical of " +
      "the substantive options — because the DIFFERENCES fall in exactly the places that discriminate " +
      "between traditions, and the SIMILARITY falls in the one place that discriminates least.\n\n" +
      "THINGS TO ASK: If two peoples both spare a snake, what would you need to know before calling it one " +
      "tradition?",
    category: "religion",
    subcategory: "Debate",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["debate", "python", "alokoko", "olokun", "kingdom-of-benin", "avhianwu", "comparison", "method"],
    civilisations: ["Kingdom of Benin", "Edo", "Avhianwu", "Etsako"],
    locationName: "Benin City and Ogbona, Edo State, Nigeria",
    lat: 6.7,
    lng: 6.0,
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether the Benin and Avhianwu python traditions are historically related",
        originalDateText: "Unresolved. Five readings remain open, and the evidence currently supports none of them",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "WHAT WOULD COUNT AS EVIDENCE FOR A CONNECTION: shared terminology demonstrated by regular sound " +
          "correspondence; shared taboo structure; shared ritual; or a migration tradition that names the " +
          "python as something brought. WHAT IS ACTUALLY SHARED: the species. WHY POSITIONLESS: the record " +
          "asks whether a relationship exists, not when it began.",
      },
    ],
  },

  {
    slug: "leopard-and-the-limits-of-comparison",
    title: "The leopard, and why this dataset stops short",
    summary:
      "The leopard is central to Benin kingship. Leopard references appear in Avhianwu material. Nothing reached here establishes what the leopard does in Avhianwu tradition — so the comparison is not made.",
    description:
      "WHAT IS ESTABLISHED FOR BENIN. The leopard is among the central royal symbols of the Kingdom of " +
      "Benin: the animal of the Oba, represented extensively in court brass and ivory, and associated with " +
      "sovereignty and with the king's power over life.\n\n" +
      "WHAT IS ESTABLISHED FOR AVHIANWU. Almost nothing. The leopard is mentioned in Avhianwu historical " +
      "material, and this investigation could not determine what it is doing there — whether it is a " +
      "taboo, a title, a praise name, a figure in a migration story, an emblem of an office, or an " +
      "incidental detail.\n\n" +
      "WHY THE COMPARISON IS NOT MADE. Because a comparison needs two terms. Setting 'the leopard is royal " +
      "in Benin' beside 'the leopard appears in Avhianwu material' and inviting the reader to draw a line " +
      "would be manufacturing a parallel out of one fact and one gap. THIS IS THE POINT AT WHICH A " +
      "COMPARATIVE RECORD BECOMES A SUGGESTION, and this dataset stops.\n\n" +
      "WHY THE RECORD EXISTS AT ALL RATHER THAN BEING OMITTED. Because the leopard question was asked, and " +
      "reporting that it could not be answered is more useful than silently dropping it — a reader " +
      "otherwise cannot tell whether the comparison was made and rejected, or never attempted.\n\n" +
      "WHAT WOULD MAKE THIS A REAL RECORD. Any documented Avhianwu or Ogbona leopard practice: a " +
      "prohibition, a title, a hunter's rite, a proverb, a name. The Alokoko python record shows what that " +
      "looks like when the material exists — WHO, WHY, and WHAT IS OWED. Until the leopard has those three, " +
      "it has nothing to compare.\n\n" +
      "THINGS TO ASK: What is the difference between a comparison and a hint?",
    category: "religion",
    subcategory: "Debate",
    eventType: "disputed",
    evidenceStatus: "unresolved",
    identificationStatus: "disputed",
    tags: ["debate", "leopard", "kingdom-of-benin", "avhianwu", "comparison", "method", "unresolved"],
    civilisations: ["Kingdom of Benin", "Avhianwu", "Etsako"],
    locationName: "Benin City and Avhianwu, Edo State, Nigeria",
    lat: 6.7,
    lng: 6.0,
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "What role the leopard plays in Avhianwu tradition",
        originalDateText: "Not established. The comparison with Benin leopard symbolism is therefore not attempted",
        datingMethod: "other",
        chronology: "community",
        evidence:
          "WHAT WAS LOOKED FOR AND NOT FOUND: any documented Avhianwu leopard taboo, title, rite, proverb " +
          "or emblem. WHY THE RECORD SAYS SO RATHER THAN SAYING NOTHING: a negative result is a result, " +
          "and it tells the next researcher exactly where to start.",
      },
    ],
  },

  {
    slug: "osanobua-oghena-osinegba",
    title: "Names for God, and what they point at",
    summary:
      "Edo says Osanobua. Etsako says Oghena, Osinegba, Osi, Oshio. One of those looks like Edo and another looks like Urhobo — so the vocabulary does not point in only one direction.",
    description:
      "THE EDO TERM. OSANOBUA, the creator and supreme God in Edo tradition, derived from OSA, a sky deity, " +
      "described as cognate with the Yoruba term orisha.\n\n" +
      "THE ETSAKO TERMS. OGHENA, OSINEGBA, OSI and OSHIO are the words used for God in different Etsako " +
      "communities and dialects. Afemai traditional religion is described as having worshipped OSINEGBA as " +
      "supreme God before Christianity and Islam.\n\n" +
      "THE INTERESTING RESULT, WHICH IS NOT THE EXPECTED ONE. The Etsako words do not all point the same " +
      "way. OSI-, OSINEGBA and OSHIO share an element with Edo OSA-nobua, which is consistent with the " +
      "close relationship between Etsako and Edo and would support the general Benin connection. BUT " +
      "OGHENA closely resembles CGHENE, the term used among the Urhobo and Isoko of the Niger Delta — " +
      "which points SOUTH AND WEST, into the Delta Edoid languages, NOT at Benin City.\n\n" +
      "WHAT THAT SUGGESTS. That Etsako sits inside a wider EDOID field with connections in more than one " +
      "direction, rather than being a simple offshoot of Benin. THE MIGRATION TRADITION SAYS 'WE CAME FROM " +
      "BENIN'; THE VOCABULARY SAYS 'WE ARE RELATED TO SEVERAL NEIGHBOURS', and those are compatible but " +
      "they are not the same statement. Language relationships are old and reflect long shared descent; " +
      "migration traditions describe particular movements of particular groups.\n\n" +
      "ON THE FORM 'OTSANOBUA'. This spelling was put to the investigation and could NOT be verified in " +
      "any source reached. It is not asserted here. If it is current in Avhianwu it would be a valuable " +
      "datum — a form intermediate between Edo Osanobua and the Etsako Osi- words — and it needs a speaker " +
      "to confirm it.\n\n" +
      "THE RULE. Cognates are real evidence of relationship, and they are evidence of LANGUAGE " +
      "relationship, which is not the same as a genealogy or a migration. A word cannot tell you that " +
      "somebody's ancestor walked out of a particular city in a particular reign.\n\n" +
      "THINGS TO ASK: What can a shared word for God prove, and what can it not?",
    category: "religion",
    subcategory: "Language",
    eventType: "archaeological_interpretation",
    eventTypeNote: "A linguistic comparison, offered as interpretation rather than as a finding about descent.",
    identificationStatus: "probable",
    tags: ["language", "edoid", "osanobua", "oghena", "etsako", "edo", "urhobo", "method", "religion"],
    civilisations: ["Etsako", "Edo", "Kingdom of Benin"],
    locationName: "Edo State and the Niger Delta, Nigeria",
    lat: 6.5,
    lng: 6.0,
    claims: [
      {
        sourceKey: "etsako_wikipedia",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "The relationship between the Edo and Etsako words for God",
        originalDateText: "A language relationship, not a dated event",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHAT SUPPORTS A CONNECTION TO EDO: the shared Osa-/Osi- element and the established " +
          "classification of Etsako as North-Central Edoid, closely related to Edo. WHAT COMPLICATES IT: " +
          "Oghena's resemblance to Delta Edoid Cghene, pointing in a different direction. WHY " +
          "POSITIONLESS: language relationships have no date that this dataset can supply, and putting one " +
          "on the axis would imply a moment of contact that nothing establishes.",
        notes:
          "NEEDS SOURCE VERIFICATION from Edoid comparative linguistics, and specifically NEEDS A CHECK on " +
          "the form Otsanobua, which could not be attested anywhere.",
      },
    ],
  },

  {
    slug: "the-egypt-claim",
    title: "The claim of Egyptian origin",
    summary:
      "Egharevba wrote in 1934 that the Binis came from Egypt by way of the Sudan and Ile-Ife. It is a dated published claim by a named colonial-era author, and it is recorded as one.",
    description:
      "WHAT KIND OF RECORD IS THIS. The Egypt claim, neither omitted nor endorsed.\n\n" +
      "THE CLAIM AND WHERE IT COMES FROM. Jacob U. Egharevba, in A SHORT HISTORY OF BENIN, first published " +
      "in 1934 by the Church Missionary Society Press in Lagos, wrote that 'many, many years ago, the " +
      "Binis came all the way from Egypt to found a more secure shelter in this part of the world after a " +
      "short stay in the Sudan and at Ile-Ife', and placed a second wave of migration from Egypt by way of " +
      "the Sahara and Ife at the beginning of the eighth century.\n\n" +
      "WHY EGHAREVBA MATTERS SO MUCH. Because the reconstruction of early Benin history rests on his work " +
      "almost exclusively. He published from the 1930s to the 1970s, and a great deal of what circulates " +
      "as Benin tradition descends from his books. THAT IS A SOURCE-DEPENDENCY SITUATION OF EXACTLY THE " +
      "SHAPE THIS DATASET HAS WITH ITS OWN COMMUNITY WEBSITE, one level up and much more consequential.\n\n" +
      "HOW IT SHOULD BE CLASSIFIED. As a LATER HISTORICAL CLAIM rather than as a pre-colonial oral " +
      "tradition. It is attested from 1934, in print, by an author writing within colonial-era " +
      "historiography; whether an Egyptian origin was part of Benin tradition BEFORE he wrote it down is " +
      "not established by anything reached here, and that is the single most important open question " +
      "about it.\n\n" +
      "THE CONTEXT THAT IS RELEVANT AND MUST NOT BE OVERSTATED. Claims of origin from Egypt, the Near East " +
      "or the Nile were widespread in African historical writing of this period, in a colonial " +
      "intellectual climate that habitually attributed African achievement to external sources. NOTING " +
      "THAT CLIMATE IS NOT A REFUTATION OF EGHAREVBA — a claim made in a period is not false because of " +
      "the period — and it is a reason to ask where his information came from.\n\n" +
      "THE SCHOLARLY POSITION. Later researchers dispute it, and connect the dispute to the contested " +
      "claim that Ile-Ife is the origin of the ruling dynasty.\n\n" +
      "WHAT THIS HAS TO DO WITH OKOMILO. Nothing directly, and that is worth saying plainly. It is two " +
      "steps removed: a claim about the origin of the Edo, whose kingdom a tradition says an ancestor of " +
      "the clan left. NOTHING IN THIS DATASET CONNECTS THE OKOMILO FAMILY TO EGYPT.\n\n" +
      "THINGS TO ASK: When was this first written down, and by whom, and what was he reading?",
    category: "history",
    subcategory: "Debate",
    eventType: "disputed",
    identificationStatus: "disputed",
    tags: ["debate", "egypt", "egharevba", "kingdom-of-benin", "historiography", "method", "origins"],
    people: ["Jacob U. Egharevba"],
    civilisations: ["Kingdom of Benin", "Edo"],
    locationName: "Benin City, Edo State, Nigeria",
    lat: 6.34,
    lng: 5.62,
    claims: [
      {
        sourceKey: "egharevba_short_history_1934",
        startYear: 1934,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The publication of the Egyptian-origin claim",
        originalDateText: "First published 1934, Church Missionary Society Press, Lagos",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS SECURELY DATED: A BOOK. That is the firm fact here, and it is a fact about 1934 rather " +
          "than about antiquity. WHETHER THE CLAIM PRE-DATES THE BOOK is the open question, and it is not " +
          "answered by the book's existence.",
      },
      {
        sourceKey: "egharevba_short_history_1934",
        startYear: 700,
        endYear: 799,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The second migration from Egypt, as Egharevba dates it",
        originalDateText: "The beginning of the 8th century, from Egypt via the Sahara and Ife",
        datingMethod: "source_assertion",
        chronology: "alternative",
        evidence:
          "WHAT PRODUCED THIS DATE: the author's assertion. No working is shown, no evidence is cited, and " +
          "no independent support was found. IT IS ENTERED SO THAT THE CLAIM CAN BE SEEN AND WEIGHED " +
          "rather than left as a rumour, and it is filed under an alternative viewpoint so that it is " +
          "never confused with the archaeological dates on the record beside it.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE ARCHIVES, AND WHAT TO DO NEXT
  // -------------------------------------------------------------------------
  {
    slug: "kukuruku-division-and-the-1936-report",
    title: "Kukuruku Division, and the intelligence report of 1936",
    summary:
      "Colonial administration called this area Kukuruku Division until 1956. A political intelligence report on the Etsako clans was written in 1936 and is held at Ibadan. It is the best unread lead here.",
    description:
      "WHY A RESEARCHER MUST KNOW THE OLD NAME. Because documents are filed under the terms of their own " +
      "time. Searching colonial records for 'Etsako' or 'Afemai' will miss most of what exists, because " +
      "for the whole of the period in which the records were made the administrative unit was KUKURUKU " +
      "DIVISION, in Benin Province. The name changed only in 1956, when the Afenmai Divisional Council " +
      "resolved to adopt 'Afenmai' and the Western Region House of Assembly recognised it.\n\n" +
      "THE SEARCH TERMS THAT ACTUALLY WORK. Kukuruku; Kukuruku Division; Benin Province; and then the clan " +
      "and place names as a colonial officer would have spelled them — Avianwu as well as Avhianwu, " +
      "Ogbona, Fugar, Uzairue, Iraokhor.\n\n" +
      "THE DOCUMENT. A POLITICAL INTELLIGENCE REPORT ON THE ETSAKO CLANS OF THE KUKURUKU DIVISION, by " +
      "Denton, 1936, in the National Archives of Nigeria at Ibadan. Reports of this class were written to " +
      "let an administration govern through existing structures, so they characteristically record: clan " +
      "and village organisation; the names of village and family heads; genealogies as recited to the " +
      "officer; land and chieftaincy disputes and the claims made in them; and population.\n\n" +
      "WHY IT IS THE BEST LEAD IN THIS INVESTIGATION. Because it is CONTEMPORANEOUS WITH THE GENERATION " +
      "THIS DATASET CANNOT NAME. In 1936 Sam Okomilo's father was alive and probably an adult; the men " +
      "who would have been the Okomilo family's elders were alive; and an officer was going from village " +
      "to village writing down who they were. IF THE OKOMILO NAME SURVIVES IN ANY PRE-WAR DOCUMENT, THIS " +
      "IS THE MOST LIKELY ONE.\n\n" +
      "HOW TO READ IT WHEN IT IS READ. As a colonial officer's record of what he was told, by people with " +
      "their own reasons for what they told him — a genealogy recited to an administrator who is about to " +
      "decide who is a chief is not a neutral recitation.\n\n" +
      "THINGS TO ASK: What was this document written for, and who benefited from what it said?",
    category: "history",
    subcategory: "Archives",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["archives", "kukuruku", "colonialism", "etsako", "1936", "method", "genealogy", "next-lead"],
    people: ["Denton"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Kukuruku Division, Benin Province; National Archives, Ibadan",
    lat: 7.0,
    lng: 6.2,
    claims: [
      {
        sourceKey: "denton_kukuruku_1936",
        startYear: 1936,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Denton's political intelligence report on the Etsako clans",
        originalDateText: "1936",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: a document, held in a named archive, by a named author. THE MOST CHECKABLE " +
          "SINGLE ITEM IN THIS ENTIRE INVESTIGATION, and the one that was not checked, because the archive " +
          "could not be reached.",
        notes:
          "NEEDS TO BE READ. This is lead number three overall and lead number one for the pre-war period.",
      },
      {
        sourceKey: "etsako_wikipedia",
        startYear: 1956,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The renaming of Kukuruku Division as Afenmai",
        originalDateText: "1956, adopted by the Afenmai Divisional Council and recognised by the Western Region House of Assembly",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: an administrative act with a documentary record. WHY IT IS IN THIS DATASET: " +
          "because it is the dividing line between two sets of search terms, and a researcher who does " +
          "not know it will conclude that the archives are empty.",
      },
    ],
  },

  {
    slug: "what-would-move-this-backwards",
    title: "What would actually move the Okomilo lineage backwards",
    summary:
      "Six gaps, and for each one the specific document, register, archive or person most likely to close it. Not 'more research is needed' — this is the list.",
    description:
      "WHAT KIND OF RECORD IS THIS? The missing-links report, as a record rather than as a closing " +
      "paragraph, so that it sits in the timeline beside the gaps it describes.\n\n" +
      "GAP 1 — THE NAME OF SAM OKOMILO'S FATHER. The single highest-value missing fact, because nothing " +
      "else can be searched without it. WHAT WOULD CLOSE IT: the University of Edinburgh's matriculation " +
      "record for Sam Okomilo, 1970, which would normally record a father's name; St John's Primary " +
      "School, Ogbona admission register for 1948, same reason; or the family itself.\n\n" +
      "GAP 2 — THE FATHER'S WAR SERVICE. Unsearchable until Gap 1 is closed, and then searchable. WHAT " +
      "WOULD CLOSE IT: Royal West African Frontier Force and Nigeria Regiment records; Nigerian ex-" +
      "servicemen's association records; and pension or gratuity files, which survive better than " +
      "attestation papers.\n\n" +
      "GAP 3 — OKOMILO BEFORE THE TWENTIETH CENTURY. WHAT WOULD CLOSE IT: Denton's 1936 intelligence " +
      "report at the National Archives, Ibadan; Catholic mission baptismal, marriage and burial registers " +
      "for Ogbona; Native Court records for the division, where land and family disputes recite " +
      "genealogies as evidence; and tax or census listings, which are organised by family head.\n\n" +
      "GAP 4 — HOW OKOMILO ATTACHES TO INNIH. WHAT WOULD CLOSE IT: the Innih kindred's own genealogy as " +
      "held by its elders; the order of seniority among the nine families, which a gerontocratic society " +
      "normally knows precisely; and — the most promising institutional route — WHO MAINTAINS THE OKOMILO " +
      "FAMILY'S ANCESTRAL SHRINE AND FROM WHOM HE RECEIVED IT, because an eldest-son transmission tracks a " +
      "line where an Odion list does not.\n\n" +
      "GAP 5 — WHAT THE NAME MEANS. WHAT WOULD CLOSE IT: an Etsako speaker from Ogbona, ideally an elder " +
      "of Innih; failing that a full Etsako dictionary with a morphological index. A DOCUMENT IS THE WRONG " +
      "TOOL FOR THIS ONE.\n\n" +
      "GAP 6 — WHETHER THE MIGRATION TRADITIONS ARE ONE SOURCE OR TWO. WHAT WOULD CLOSE IT: The Descent of " +
      "Avhianwu (1999), read for what it says about the migration date, the four sons, Alokoko and the " +
      "descent of Ogbona — and read for ITS OWN footnotes, which would show what the 1999 author was " +
      "working from.\n\n" +
      "THE PATTERN IN ALL SIX. Every one is closed by a NAMED, LOCATABLE THING — a register, a file, a " +
      "book, a person. None of them requires new research methods, and none of them is impossible. WHAT " +
      "THEY REQUIRE IS PHYSICAL OR AUTHENTICATED ACCESS, which is precisely what this investigation did " +
      "not have.\n\n" +
      "THINGS TO ASK: Of these six, which one would you do first?",
    category: "people",
    subcategory: "Method",
    eventType: "other",
    eventTypeNote: "A research agenda attached to the gaps it addresses.",
    evidenceStatus: "unresolved",
    tags: ["okomilo", "method", "archives", "genealogy", "next-lead", "missing-links", "innih"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Ogbona, Ibadan, Edinburgh and London",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Nothing. This is an agenda, not an event",
        originalDateText: "Not a dated event",
        datingMethod: "other",
        chronology: "community",
        evidence:
          "WHY IT IS A RECORD RATHER THAN A NOTE: because a reader who reaches any of the gap records " +
          "should be able to arrive at the specific thing that would close it, and because an agenda that " +
          "lives in a report gets lost while one that lives in the dataset stays next to the problem.",
      },
    ],
  },

  {
    slug: "one-website-is-not-five-sources",
    title: "One website is not five sources",
    summary:
      "Nearly everything specific in this dataset comes from one community-history site, which disagrees with itself in places and probably draws on one 1999 book. That is the shape of the evidence, and it is stated rather than hidden.",
    description:
      "WHAT KIND OF RECORD IS THIS? The dataset's account of its own foundations.\n\n" +
      "THE SITUATION. The family list that places Okomilo in Innih; the biography that names Sam Okomilo's " +
      "parents; the structure that nests Innih in Ivhitse in Ivhiochie; the descent of Ogbona; the four " +
      "sons of Anwu; Alokoko and the python; both migration dates; the Okhe ban of 1851; the festivals — " +
      "ALL OF IT COMES FROM ogbonaelites.org.\n\n" +
      "WHAT THAT IS GOOD FOR, AND IT IS CONSIDERABLE. The site is written by and for the community it " +
      "describes. It names individuals, families and offices that no outside scholar has recorded. It " +
      "publishes structural lists that exist nowhere else. FOR A FAMILY AT THIS SCALE, A COMMUNITY " +
      "PUBLICATION IS OFTEN THE ONLY SOURCE THERE WILL EVER BE, and treating it as inferior to an academic " +
      "one would be a category error.\n\n" +
      "WHAT IT CANNOT DO. Corroborate itself. Two pages of one site agreeing is one source; two pages " +
      "disagreeing — as they do on the migration date and on whether Ogbona is a man — is one source " +
      "uncertain about itself, which is useful information about the tradition and not two witnesses.\n\n" +
      "THE LAYER UNDERNEATH. Several claims probably descend from THE DESCENT OF AVHIANWU, published in " +
      "1999 — which would make the real count of independent sources for much of this dataset ONE, with " +
      "the website as its distribution channel.\n\n" +
      "WHAT WOULD CHANGE THE PICTURE. Genuinely independent sources: the 1936 intelligence report, mission " +
      "registers, Native Court files, an academic ethnography of Etsako, or recitation by elders who are " +
      "not working from the book. EACH OF THOSE WOULD BE A SECOND WITNESS, and at present this dataset has " +
      "none.\n\n" +
      "WHY THIS IS SAID SO PLAINLY. Because a reader who does not know it will take this dataset's " +
      "internal consistency for corroboration, and it is not.\n\n" +
      "THINGS TO ASK: How would you tell a well-attested fact from a well-copied one?",
    category: "history",
    subcategory: "Method",
    eventType: "other",
    eventTypeNote: "A record about the dataset's own source dependency.",
    tags: ["method", "source-dependency", "okomilo", "avhianwu", "historiography", "community-history"],
    civilisations: ["Etsako", "Avhianwu"],
    locationName: "Ogbona, Edo State, Nigeria",
    lat: 7.0,
    lng: 6.3,
    claims: [
      {
        sourceKey: "ogbona_elites",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Nothing. This record is about where the evidence comes from",
        originalDateText: "Not a dated event",
        datingMethod: "other",
        chronology: "community",
        evidence:
          "WHY IT CARRIES A POSITIONLESS CLAIM: so that it appears in filters alongside the records it " +
          "governs. THE COUNT THAT MATTERS: one publisher, probably one underlying book, and no " +
          "independent witness at all for any specifically Okomilo fact.",
      },
    ],
  },
];

export const OKOMILO_LINKS: SeedEventLink[] = [
  {
    from: "okomilo-how-far-back",
    to: "okomilo-the-break",
    relation: "related",
    note: "The summary of what is known, and the record of the gap in the middle of it.",
  },
  {
    from: "sam-ikhenemho-okomilo",
    to: "okomilo-father-and-the-war",
    relation: "source_of",
    viewpoint: "community",
    sourceKey: "ogbona_profiles",
    note: "Everything known about the father comes through the son's biography.",
  },
  {
    from: "okomilo-father-and-the-war",
    to: "ikhenemho-a-name-that-records-an-event",
    relation: "source_of",
    viewpoint: "community",
    note: "The name was given because the man came home.",
  },
  {
    from: "ikhenemho-a-name-that-records-an-event",
    to: "sam-ikhenemho-okomilo",
    relation: "evidence_for",
    viewpoint: "disputed",
    note: "The naming story is evidence against the birth date printed beside it in the same source.",
  },
  {
    from: "sam-ikhenemho-okomilo",
    to: "uwomha-ikhuenena-and-pa-asekomhe",
    relation: "source_of",
    viewpoint: "community",
    sourceKey: "ogbona_profiles",
    note: "The maternal line, which reaches one generation further back than the paternal one.",
  },
  {
    from: "uwomha-ikhuenena-and-pa-asekomhe",
    to: "asekomhe-a-name-match-is-not-a-fact",
    relation: "responds_to",
    viewpoint: "disputed",
    note: "A grandfather called Asekomhe, and a family called Asekomhe. The record next door is about why that is not yet an identification.",
  },
  {
    from: "innih-and-its-nine-families",
    to: "asekomhe-a-name-match-is-not-a-fact",
    relation: "evidence_for",
    viewpoint: "community",
    sourceKey: "ogbona_kindreds_list_2024",
    note: "The list in which the Asekomhe family appears is one half of the coincidence.",
  },
  {
    from: "innih-and-its-nine-families",
    to: "okomilo-how-far-back",
    relation: "evidence_for",
    viewpoint: "community",
    sourceKey: "ogbona_kindreds_list_2024",
    note: "The document that places the Okomilo family at all.",
  },
  {
    from: "innih-and-its-nine-families",
    to: "ivhitse-sits-inside-ivhiochie",
    relation: "precedes",
    viewpoint: "community",
    note: "The family list puts Okomilo in Innih; the next step up is where the apparent contradiction is resolved.",
  },
  {
    from: "ivhitse-sits-inside-ivhiochie",
    to: "ivhiochie-means-the-children-of-ochie",
    relation: "precedes",
    viewpoint: "conventional",
    note: "Having reached Ivhiochie structurally, the name turns out to carry a claim of descent.",
  },
  {
    from: "ivhiochie-means-the-children-of-ochie",
    to: "ogbona-descent-okhua-and-omierele",
    relation: "evidence_for",
    viewpoint: "conventional",
    note: "The quarter names line up with the sons in the descent tradition, which is what makes the reading work.",
  },
  {
    from: "ogbona-descent-okhua-and-omierele",
    to: "ogbona-one-generation-in-dispute",
    relation: "responds_to",
    viewpoint: "disputed",
    note: "The genealogy, and the one-generation disagreement inside it.",
  },
  {
    from: "imhakhena-founds-ogbona",
    to: "ogbona-descent-okhua-and-omierele",
    relation: "precedes",
    viewpoint: "oral_tradition",
    note: "The founder, and the generations after him.",
  },
  {
    from: "anwu-and-alokoko",
    to: "imhakhena-founds-ogbona",
    relation: "precedes",
    viewpoint: "oral_tradition",
    sourceKey: "avhianwu_oral_tradition",
    note: "The parents, and the last-born son who founded Ogbona.",
  },
  {
    from: "anwu-and-alokoko",
    to: "alokoko-and-the-python",
    relation: "source_of",
    viewpoint: "oral_tradition",
    note: "The clan's most distinctive observance attaches to the mother rather than the father.",
  },
  {
    from: "alokoko-and-the-python",
    to: "who-or-what-is-alokoko",
    relation: "responds_to",
    viewpoint: "disputed",
    note: "The taboo is clear; who or what Alokoko is, in the passage that reports it, is not.",
  },
  {
    from: "migration-claim-ewuare",
    to: "migration-claim-ozolua",
    relation: "related",
    viewpoint: "disputed",
    note: "Two dates about forty years apart for the same journey.",
  },
  {
    from: "migration-claim-ozolua",
    to: "migration-source-dependency",
    relation: "responds_to",
    viewpoint: "disputed",
    sourceKey: "descent_of_avhianwu_1999",
    note: "Both dates come from one publisher, and probably from one book.",
  },
  {
    from: "migration-claim-ewuare",
    to: "people-were-already-there",
    relation: "responds_to",
    viewpoint: "conventional",
    note: "A migration tradition in a landscape that was already occupied is an account of an arrival, not of a settlement.",
  },
  {
    from: "anwu-and-alokoko",
    to: "migration-claim-ewuare",
    relation: "related",
    viewpoint: "oral_tradition",
    note: "The founding couple, and the first of the two dates given for their departure.",
  },
  {
    from: "okomilo-the-break",
    to: "ivhiochie-means-the-children-of-ochie",
    relation: "related",
    viewpoint: "conventional",
    note: "Ochie is the upper edge of the gap; everything below him is unrecorded.",
  },
  {
    from: "okhe-title-and-the-1851-ban",
    to: "avhianwu-split-into-two-clans",
    relation: "precedes",
    viewpoint: "community",
    note: "Precedence between the four communities, contested in 1851 and contested again now.",
  },
  {
    from: "anwu-and-alokoko",
    to: "avhianwu-split-into-two-clans",
    relation: "relevant",
    viewpoint: "community",
    note: "The insistence that the four sons had the same mother is a claim of equal standing, and the split is the argument it belongs to.",
  },
  {
    from: "odion-is-gerontocracy-not-descent",
    to: "what-would-move-this-backwards",
    relation: "evidence_for",
    viewpoint: "conventional",
    note: "The assessment that redirects the eldership lead towards the family shrine instead.",
  },
  {
    from: "the-kingdom-of-benin-is-not-the-republic",
    to: "benin-city-and-the-iya",
    relation: "precedes",
    viewpoint: "conventional",
    note: "Establish which Benin is meant, then describe it.",
  },
  {
    from: "benin-city-and-the-iya",
    to: "migration-claim-ewuare",
    relation: "relevant",
    viewpoint: "archaeological",
    sourceKey: "connah_benin_earthworks",
    note: "The Inner City earthworks and the traditional departure date fall in the same period — a coincidence of dates, offered as context and not as corroboration.",
  },
  {
    from: "benin-palace-pythons-and-olokun",
    to: "benin-python-versus-alokoko",
    relation: "evidence_for",
    viewpoint: "conventional",
    note: "One half of the comparison.",
  },
  {
    from: "alokoko-and-the-python",
    to: "benin-python-versus-alokoko",
    relation: "evidence_for",
    viewpoint: "oral_tradition",
    note: "The other half.",
  },
  {
    from: "benin-python-versus-alokoko",
    to: "leopard-and-the-limits-of-comparison",
    relation: "related",
    viewpoint: "disputed",
    note: "A comparison that could be made, and one that could not.",
  },
  {
    from: "osanobua-oghena-osinegba",
    to: "benin-python-versus-alokoko",
    relation: "relevant",
    viewpoint: "conventional",
    note: "The vocabulary evidence points in more than one direction, which is the same caution the python comparison reaches by another route.",
  },
  {
    from: "the-egypt-claim",
    to: "the-kingdom-of-benin-is-not-the-republic",
    relation: "relevant",
    viewpoint: "conventional",
    note: "An origin claim about the Edo, two steps removed from this family — and filed where the naming hazard is explained.",
  },
  {
    from: "kukuruku-division-and-the-1936-report",
    to: "what-would-move-this-backwards",
    relation: "evidence_for",
    viewpoint: "historical",
    sourceKey: "denton_kukuruku_1936",
    note: "The best unread document, and the agenda it belongs to.",
  },
  {
    from: "one-website-is-not-five-sources",
    to: "migration-source-dependency",
    relation: "related",
    viewpoint: "conventional",
    note: "The general problem, and the specific case where it bites hardest.",
  },
  {
    from: "okomilo-meaning-unresolved",
    to: "what-would-move-this-backwards",
    relation: "related",
    note: "The one gap in the list that a document will not close.",
  },
];
