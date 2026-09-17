// VODUN: A RELIGION OLDER THAN ITS FIRST WRITTEN WORD.
//
// THE PROBLEM THIS DATASET IS BUILT AROUND. Everybody wants a date for the
// beginning of Vodun, and there is not one. The traditions are certainly older
// than any surviving description of them; how much older is not established by
// anything. So the dataset does the only honest thing available: it separates
// WHEN A TRADITION IS FIRST DOCUMENTED from WHEN IT BEGAN, and it refuses to
// let the first stand in for the second.
//
// THE HERO RECORD. The earliest written occurrence of the word *vodu* identified
// here is 1658, in the Doctrina Christiana produced in connection with the
// kingdom of Allada. That document proves the vocabulary existed then, in a
// language of this coast, well enough developed for missionaries to translate
// Christian terms into it. IT PROVES NOTHING WHATEVER ABOUT WHEN THE UNDERLYING
// TRADITIONS BEGAN. The gap between those two statements is the shape of this
// whole dataset.
//
// WHAT THIS FILE WILL NOT DO.
//   - Give Vodun a prehistoric date. Not 2000 BCE, not 5,000 years, not "since
//     the dawn of humanity". No evidence supports any of them.
//   - Derive Vodun from ancient Egypt, or identify Dan with Set or Apep, or
//     treat sacred pythons as a sign of Egyptian influence. Visual and thematic
//     similarity is not evidence of transmission. If credible scholars propose
//     historical connections they can be added as attributed comparative
//     hypotheses; none is asserted here.
//   - Collapse Fon, Aja, Hueda, Gun and Yoruba traditions into one theology.
//     They differ, the differences matter, and a tidy pantheon printed in a
//     reference book is usually somebody's synthesis rather than anybody's
//     religion.
//   - "Debunk" practitioner belief out of the record. Where a devotee enters an
//     altered state during rhythmic ritual, this dataset records the observable
//     event, the practitioner's account of it, and the fact that supernatural
//     causation is not empirically established — three statements that can all
//     be true at once, and none of which replaces the others.
//   - Call it voodoo. That spelling belongs to a Hollywood genre and to a
//     century of racist caricature, and using it for a West African religion
//     imports all of it.
//
// ON THE DIASPORA. Haitian Vodou, Brazilian Jeje and Cuban Arará are related to
// the traditions of this coast, and they are not copies of them. They formed
// under slavery, in contact with other African traditions, with Catholicism and
// with the specific conditions of each colony. Every diaspora record here says
// what the evidence for a connection actually is — a name, a word, a documented
// route — and none treats resemblance as descent.
//
// ON UNESCO, AND A CORRECTION WORTH MAKING LOUDLY. Vodun as such is NOT on
// UNESCO's Representative List. The Oral Heritage of Gelede is, and Bénin has
// been preparing a broader Vodun nomination. Writing "UNESCO-listed Vodun" is a
// specific factual error and this dataset says so.
//
// ON SOURCES AND PICTURES. Nothing could be fetched: the network policy refused
// every archive, museum and journal. Sources are named so a reader can find
// them, and anything taken from a summary is marked NEEDS SOURCE VERIFICATION.
// The pictures are Commons files whose file pages were returned by a search
// index; their credits are fetched from those pages at seed time rather than
// typed here.

import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

export const BENIN_VODUN_ANCHOR_SLUG = "vodu-first-written-1658";

export const BENIN_VODUN_TRACK: SeedTrack = {
  name: "Vodun: cosmology, ritual, Fa, and the Atlantic",
  slug: "benin-vodun",
  kind: "theme",
  color: "#7a52a8",
};

const commons = (file: string, width = 1200) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
const commonsPage = (file: string) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;

export const BENIN_VODUN_SOURCES: SeedSource[] = [
  {
    key: "doctrina_christiana_1658",
    title: "Doctrina Christiana, in the language of Allada",
    reference: "Produced in connection with a Spanish Capuchin mission to the kingdom of Allada; printed 1658",
    sourceType: "historical_document",
    publishedYear: 1658,
    publishedDisplay: "1658",
    notes:
      "THE MOST IMPORTANT SINGLE DOCUMENT IN THIS DATASET. A Christian catechism rendered into the language " +
      "of Allada — variously described as Ayizo or as the 'Arda' language — for missionary use. It contains " +
      "the earliest written occurrence of the word VODU identified here, used in senses connected with god, " +
      "the sacred and the priestly. WHAT IT PROVES: that the vocabulary existed on this coast in 1658, " +
      "developed enough that Europeans translated INTO it. WHAT IT DOES NOT PROVE: anything about when the " +
      "traditions began. NEEDS SOURCE VERIFICATION for the exact entries and their glosses, which could not " +
      "be consulted here.",
  },
  {
    key: "emory_thesis_vodu_1658",
    title: "Doctoral research on the 1658 Allada catechism and the earliest attestations of vodu",
    publisher: "Emory University",
    url: "https://etd.library.emory.edu/downloads/z890rv11x",
    sourceType: "academic_paper",
    notes:
      "Cited for the identification of the 1658 Doctrina Christiana as carrying the earliest written use of " +
      "vodu currently known, and for the senses in which the word is glossed there. THIS IS THE SOURCE THAT " +
      "CARRIES THE DATASET'S ANCHOR CLAIM and it is the one most worth checking directly.",
  },
  {
    key: "bosman_guinea_1704",
    title: "A New and Accurate Description of the Coast of Guinea",
    author: "Willem Bosman",
    reference: "Dutch edition 1704; English translation 1705",
    sourceType: "primary",
    publishedYear: 1704,
    publishedDisplay: "1704",
    notes:
      "A DUTCH WEST INDIA COMPANY FACTOR'S ACCOUNT, and the earliest substantial European description of " +
      "serpent veneration at Whydah. Bosman describes the serpent as a divinity, the house of the serpent, " +
      "the offerings brought to it, the annual pilgrimage of the kings of Fida, and the penalties for " +
      "disrespecting it. HIS VIEWPOINT: a Protestant trader describing what he regards as idolatry, writing " +
      "for a European readership. THE REASON HE MATTERS SO MUCH HERE: his description PRE-DATES the " +
      "traditional foundation story of the temple at Ouidah by roughly two decades, which is a genuine " +
      "chronological problem for that story.",
  },
  {
    key: "blier_african_vodun",
    title: "African Vodun: Art, Psychology, and Power",
    author: "Suzanne Preston Blier",
    publisher: "University of Chicago Press",
    sourceType: "academic_book",
    publishedYear: 1995,
    notes:
      "The standard scholarly study of bocio and related power objects. Cited for the making, binding, " +
      "activation and use of these objects, and for the distinction between what an object physically IS " +
      "and what it is understood to DO. NEEDS SOURCE VERIFICATION for specific pages.",
  },
  {
    key: "bay_asen_ancestors_vodun",
    title: "Asen, Ancestors, and Vodun: Tracing Change in African Art",
    author: "Edna G. Bay",
    publisher: "University of Illinois Press",
    sourceType: "academic_book",
    notes:
      "Cited here for asen \u2014 the iron memorial altars \u2014 as a tradition WITH A HISTORY rather than a timeless " +
      "custom: roots related to earlier Yoruba practice, adoption and transformation by the Dahomean court, " +
      "elaboration by the Hountondji smiths in imported metal, spread beyond the elite, and decline in the " +
      "twentieth century in the face of Christianity and photography. NEEDS SOURCE VERIFICATION for pages.",
  },
  {
    key: "maupoil_geomancie_1943",
    title: "La géomancie à l'ancienne Côte des Esclaves",
    author: "Bernard Maupoil",
    publisher: "Institut d'Ethnologie, Paris",
    sourceType: "academic_book",
    publishedYear: 1943,
    publishedDisplay: "1943",
    notes:
      "THE FOUNDATIONAL STUDY OF FA AMONG THE FON, and still the most substantial. Cited for the structure " +
      "of the system, the practice of the bokonon, and the corpus. IT IS ALSO A COLONIAL-ERA WORK by a " +
      "French administrator-ethnographer, and later scholars describe it as incomplete and sometimes " +
      "mistaken in its interpretations. Cited as the major early documentation, not as the last word.",
  },
  {
    key: "herskovits_dahomey_1938",
    title: "Dahomey: An Ancient West African Kingdom",
    author: "Melville J. Herskovits",
    sourceType: "academic_book",
    publishedYear: 1938,
    publishedDisplay: "1938",
    notes:
      "An ethnography based on fieldwork in the 1930s, and one of the main routes by which descriptions of " +
      "Fon religion entered the anthropological literature. Cited for early systematic documentation of " +
      "cults, priesthoods and ritual. ITS PERIOD SHOWS: it is a colonial-era ethnography with the framing " +
      "and the confidence of one, and its synthesis of a 'pantheon' has shaped every later summary, " +
      "including the tidy ones this dataset warns about.",
  },
  {
    key: "rouget_vodun_songs",
    title: "Recorded documentation of Vodun initiation songs and dances in Bénin",
    author: "Gilbert Rouget",
    sourceType: "academic_book",
    notes:
      "Cited for systematic ethnomusicological documentation of Vodun ritual music, initiation song and " +
      "dance in Bénin, and for the study of the relationship between music and trance. NEEDS SOURCE " +
      "VERIFICATION for titles, dates and publishers of the specific publications and recordings.",
  },
  {
    key: "norman_huedan_vodun",
    title: "Powerful Pots, Humbling Holes, and Regional Ritual Processes: Towards an Archaeology of Huedan Vodun, ca. 1650–1727",
    author: "Neil L. Norman",
    workTitle: "African Archaeological Review",
    sourceType: "academic_paper",
    notes:
      "RARE AND IMPORTANT: an ARCHAEOLOGY of Vodun practice, from excavation in the Hueda kingdom before " +
      "the Dahomean conquest. Material evidence for ritual is the one line of evidence that does not depend " +
      "on either European observation or later oral tradition, which makes this the most independent " +
      "source in the dataset. NEEDS SOURCE VERIFICATION for the sites, deposits and interpretations.",
  },
  {
    key: "unesco_ich_gelede",
    title: "Oral heritage of Gelede",
    publisher: "UNESCO Intangible Cultural Heritage",
    url: "https://ich.unesco.org/en/RL/oral-heritage-of-gelede-00002",
    sourceType: "government",
    notes:
      "The UNESCO file: proclaimed a Masterpiece of the Oral and Intangible Heritage of Humanity in 2001 " +
      "and inscribed on the Representative List in 2008, covering Bénin, Nigeria and Togo. Cited for the " +
      "official description of Gèlèdé, including its songs as carriers of Yoruba-Nago history, its satire, " +
      "and the governing role of women in the society.",
  },
  {
    key: "unesco_ich_vodun_assistance",
    title: "Vodun, beliefs, social practices and ways of living — international assistance file",
    publisher: "UNESCO Intangible Cultural Heritage",
    url: "https://ich.unesco.org/en/assistances/vodun-beliefs-social-practices-and-ways-of-living-02386",
    sourceType: "government",
    notes:
      "THE SOURCE FOR A CORRECTION THIS DATASET MAKES DELIBERATELY. It records assistance to Bénin to " +
      "PREPARE a nomination on Vodun, running from August 2025 to April 2026 — which means Vodun is not, at " +
      "the time of writing, inscribed. Also cited for UNESCO's own description associating spiritual powers " +
      "with elemental domains and placing ancestors centrally.",
  },
  {
    key: "unesco_ich_benin_state",
    title: "Bénin — state party file",
    publisher: "UNESCO Intangible Cultural Heritage",
    url: "https://ich.unesco.org/en/state/benin-BJ",
    sourceType: "government",
    notes:
      "Cited for Bénin's ratification of the 2003 Convention and for which elements from Bénin are " +
      "inscribed — the check that distinguishes what is listed from what is being prepared.",
  },
  {
    key: "vodun_practitioner_tradition",
    title: "Vodun practice and teaching, as transmitted by practitioners and recorded by observers",
    reference: "Initiatory and priestly knowledge, ritual practice and oral teaching in Bénin and neighbouring countries",
    sourceType: "oral_tradition",
    notes:
      "WHAT THIS SOURCE ENTRY IS. The living tradition itself, as taught by priests and initiates and as " +
      "described to outsiders. It is the primary source for what practitioners hold, and it is cited " +
      "whenever this dataset states a belief. TWO LIMITS, STATED. Much of the tradition is restricted to " +
      "initiates and is not available to a dataset like this one, so what is recorded here is weighted " +
      "towards what practitioners have chosen to say in public. And 'the tradition' is not one thing: Fon, " +
      "Aja, Hueda, Gun and Yoruba communities differ, and a single entry like this one risks flattening " +
      "exactly the differences the dataset says matter.",
  },
  {
    key: "wikipedia_vodun_navigation",
    title: "Wikipedia articles on West African Vodun, Fa, Gèlèdé, Zangbeto and related subjects",
    url: "https://en.wikipedia.org/wiki/West_African_Vod%C3%BAn",
    sourceType: "wikipedia",
    notes:
      "USED FOR NAVIGATION AND CROSS-CHECKING ONLY. Never the evidence for a claim about belief or " +
      "practice; where a record rests on nothing better, its notes say so.",
  },
];

export const BENIN_VODUN_EVENTS: SeedEvent[] = [
  // -------------------------------------------------------------------------
  // THE RED THREAD: HOW OLD IS VODUN?
  // -------------------------------------------------------------------------
  {
    slug: "how-old-is-vodun",
    title: "How old is Vodun?",
    summary:
      "The honest answer is that nobody knows. The earliest written evidence is 1658; the traditions are certainly older; how much older is not established. This record runs underneath the whole dataset.",
    description:
      "WHAT KIND OF RECORD IS THIS? The question this entire lane is arranged around, and it does not get " +
      "an answer.\n\n" +
      "WHAT IS ESTABLISHED. That the word VODU is in writing by 1658, in a language of this coast, in a " +
      "document made for missionary use in connection with the kingdom of Allada. That is a firm latest-by " +
      "date for the vocabulary, and it implies a developed religious language already in place — you cannot " +
      "translate Christian doctrine into a religious vocabulary that does not exist.\n\n" +
      "WHAT IS CERTAIN BUT UNDATED. That the traditions are older than 1658. Nothing appears in a " +
      "missionary catechism the year it is invented.\n\n" +
      "WHAT IS NOT ESTABLISHED. How much older. And this is where almost all popular writing goes wrong, in " +
      "both directions. NUMBERS IN CIRCULATION — six thousand years, ten thousand years, 'since the " +
      "beginning' — have no evidential basis whatever. They are not conclusions from anything; they are " +
      "assertions of antiquity, and antiquity is being used as a claim to authority.\n\n" +
      "WHY ARCHAEOLOGY CANNOT SIMPLY ANSWER IT. Because religion leaves ambiguous traces. A pot in a pit " +
      "may be an offering or rubbish. Neil Norman's archaeology of Huedan ritual before 1727 is real " +
      "evidence of ritual practice at a place and a time — and it is a century and a half later than 1658, " +
      "not earlier, so it extends the picture sideways rather than backwards.\n\n" +
      "WHAT WOULD ACTUALLY MOVE THE DATE BACK. Excavated ritual deposits securely dated and securely " +
      "identified; an earlier document; or linguistic reconstruction across the Gbe languages dating the " +
      "vocabulary itself. The third is the most promising and the least done.\n\n" +
      "THE POSITION THIS DATASET TAKES. Earliest documentation: 1658. Origin: date unknown. Those are two " +
      "different facts and they are recorded as two different facts.\n\n" +
      "THINGS TO ASK: Why do people want a religion to be old? What does the age of a tradition actually " +
      "establish about it?",
    category: "religion",
    subcategory: "Debate",
    eventType: "disputed",
    tags: ["debate", "vodun", "method", "dating", "religion", "oral-knowledge", "historiography"],
    civilisations: ["Aja", "Fon", "Hueda"],
    locationName: "Southern Bénin and the wider Gbe-speaking region",
    lat: 6.7,
    lng: 2.1,
    claims: [
      {
        sourceKey: "emory_thesis_vodu_1658",
        startYear: 1658,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest written occurrence of the word vodu identified here",
        originalDateText: "1658",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT THIS DATE IS: the date of a DOCUMENT. It establishes that the vocabulary existed by then " +
          "and nothing more. IT IS THE MOST MISREAD KIND OF DATE IN HISTORY — the earliest surviving " +
          "evidence of a thing constantly becomes, in retelling, the date the thing began.",
      },
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the traditions now called Vodun began",
        originalDateText: "Date unknown. Older than the earliest documentation, by an amount nothing establishes",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHY THIS CLAIM CARRIES NO POSITION: because supplying one would be inventing the answer to the " +
          "question the record is about. THE CLAIM IS NOT EMPTY — it asserts something real and " +
          "defensible: that the traditions pre-date their first documentation. It simply declines to say " +
          "by how much, because nothing available says.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "The figures of several thousand years that circulate online and in popular writing",
        originalDateText: "Assertions of great antiquity, with no evidential basis identified here",
        datingMethod: "claimant_inference",
        chronology: "alternative_widespread",
        evidence:
          "WHY THIS IS RECORDED AT ALL RATHER THAN IGNORED: because it is what a reader will meet first " +
          "when they search, and a dataset that leaves it out has left them without the means to weigh it. " +
          "WHAT SUPPORTS IT: nothing traceable. It is not derived from a document, an excavation or a " +
          "linguistic reconstruction. WHY NO NUMBER IS ENTERED: because entering one would give an " +
          "unsourced assertion a position on the timeline, which is precisely how it acquires the " +
          "appearance of evidence.",
      },
    ],
  },

  {
    slug: "vodu-first-written-1658",
    title: "1658: the word vodu is written down",
    summary:
      "A Christian catechism produced for a mission to Allada renders Christian terms into the local language — and in doing so records the word vodu, in senses touching god, the sacred and the priestly.",
    description:
      "THE DOCUMENT. A Doctrina Christiana — a catechism — produced in 1658 in connection with a Spanish " +
      "Capuchin mission to the kingdom of ALLADA, rendering Christian teaching into the language of that " +
      "coast. It is the earliest known written appearance of the word VODU.\n\n" +
      "WHY A MISSIONARY DOCUMENT IS SUCH GOOD EVIDENCE FOR AN INDIGENOUS RELIGION. Because of what " +
      "translation requires. To put Christian doctrine into a language you must find existing words for " +
      "god, sacred, spirit, priest, offering — and the words you find come from the religion already there. " +
      "THE CATECHISM IS EVIDENCE AGAINST ITSELF: a document intended to replace a religious vocabulary " +
      "preserves the earliest surviving record of it.\n\n" +
      "WHAT THE WORD IS DOING THERE. It is glossed in senses connected with god, the sacred and the " +
      "priestly. That means it was already a general religious term rather than the name of one thing, " +
      "which in turn means a developed system behind it.\n\n" +
      "THE THREE THINGS THIS PROVES, EXACTLY. That the word existed in 1658. That it belonged to a " +
      "religious vocabulary substantial enough to carry translation. And that Europeans encountering this " +
      "coast in the mid-seventeenth century met an established religion rather than something forming.\n\n" +
      "THE THING IT DOES NOT PROVE. When any of it began. That is the point of the debate record beside " +
      "this one, and it cannot be got around by emphasis.\n\n" +
      "WHY IT IS THE ANCHOR OF THIS DATASET. Because it is the hardest single fact available about the " +
      "history of this religion: a dated document, in a named place, with a word in it.\n\n" +
      "THINGS TO ASK: What can a dictionary made by outsiders tell you about the people who supplied the " +
      "words?",
    category: "religion",
    subcategory: "Documentary evidence",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    identificationStatus: "secure",
    tags: ["vodun", "documents", "allada", "missionaries", "language", "european-encounter", "earliest-evidence"],
    civilisations: ["Allada"],
    locationName: "Allada, southern Bénin",
    lat: 6.66,
    lng: 2.15,
    claims: [
      {
        sourceKey: "doctrina_christiana_1658",
        startYear: 1658,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The production of the catechism containing the word vodu",
        originalDateText: "1658",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT MAKES THIS SECURE: a printed document with a date, produced by an identifiable mission in " +
          "connection with an identifiable kingdom. THE SECUREST DATE IN THE VODUN DATASET, and it is a " +
          "date about a book.",
        notes:
          "NEEDS SOURCE VERIFICATION for the exact entries, their glosses and the language's " +
          "identification — described variously as Ayizo and as the 'Arda' language. Those details are " +
          "what would let a reader see what the word actually meant to the people who supplied it.",
      },
      {
        sourceKey: "emory_thesis_vodu_1658",
        startYear: 1658,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest identified written use of vodu, as established in modern scholarship",
        originalDateText: "The earliest written occurrence of the term currently identified",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHY THIS IS A SEPARATE CLAIM FROM THE ONE ABOVE: the date of the document is one fact; that no " +
          "earlier use is known is a different and weaker one, because it is a claim about the whole " +
          "surviving corpus and could be overturned tomorrow by one earlier text. A 'FIRST' IS ALWAYS " +
          "PROVISIONAL and should be stored as such.",
      },
    ],
  },

  {
    slug: "vodun-is-not-voodoo",
    title: "Vodun is not \"voodoo\"",
    summary:
      "A West African religion, a Haitian religion and a Hollywood genre are three different things sharing a family of names. Keeping them apart is a precondition for saying anything true.",
    description:
      "THE THREE THINGS. VODUN: the religious traditions of Gbe-speaking peoples in what is now Bénin, " +
      "Togo and south-western Nigeria — the subject of this dataset. VODOU: the religion that formed in " +
      "Haiti, related to Vodun and to Kongo and other African traditions, shaped by slavery and by " +
      "Catholicism, and a distinct religion in its own right. VOODOO: largely an invention of American and " +
      "European popular culture — dolls, pins, zombies, curses — built out of a century of racist " +
      "caricature of Haiti and of Black religion generally.\n\n" +
      "WHY THIS IS NOT PEDANTRY. Because the third is what most people know, and it is projected backwards " +
      "onto the first two constantly. A photograph of a shrine in Ouidah captioned 'voodoo' arrives " +
      "carrying Hollywood with it, and the reader has been told something false before reading a word.\n\n" +
      "WHAT THE WORD ACTUALLY MEANS. Vodun, in Fon and related languages, refers to spiritual powers — a " +
      "general term rather than the name of a religion, which is how it appears already in the catechism " +
      "of 1658. The idea of Vodun as a single bounded religion with a name is partly a product of outsiders " +
      "needing a label for it.\n\n" +
      "THE CASE FOR CARE WITH THE OTHER WORDS TOO. Fetish, juju, witch doctor, idol: every one is a " +
      "colonial-era term carrying a judgement, and every one appears throughout the sources this dataset " +
      "depends on. They are quoted where a source uses them, and not adopted.\n\n" +
      "THINGS TO ASK: How much of what you already believed about this subject came from a film?",
    category: "religion",
    subcategory: "Terminology",
    eventType: "other",
    eventTypeNote: "A record about words and how they mislead, not an event.",
    tags: ["vodun", "method", "terminology", "diaspora", "racism", "haiti", "reception"],
    locationName: "Bénin, Haiti, and the popular imagination",
    claims: [
      {
        sourceKey: "wikipedia_vodun_navigation",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Nothing. This record is about terminology",
        originalDateText: "Not a dated event",
        datingMethod: "other",
        chronology: "conventional",
        evidence:
          "WHY THIS RECORD CARRIES A POSITIONLESS CLAIM RATHER THAN NONE: so that it appears alongside the " +
          "records it governs when a reader filters this lane, without being drawn anywhere on the axis. " +
          "A distinction between words is not an event.",
      },
    ],
    media: [
      {
        url: commons("Lomé (Togo) banner Voodoo fetish market.jpg"),
        sourcePageUrl: commonsPage("Lomé (Togo) banner Voodoo fetish market.jpg"),
        fileName: "Lomé (Togo) banner Voodoo fetish market.jpg",
        caption:
          "A banner advertising a \"voodoo fetish market\" at Lomé in Togo. THE SIGN IS THE RECORD: both words on it are outsiders' terms that the market now uses about itself for visitors, which is exactly the process this record describes.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceNotes:
          "In TOGO, not Bénin. It is attached to a record about terminology rather than about a place.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "vodun-before-the-documents",
    title: "Before the documents: what can and cannot be said",
    summary:
      "Ancestors, spirits of place, water, earth, thunder, iron, divination, initiation, possession: all attested from the earliest descriptions onwards, and none of them datable to a beginning.",
    description:
      "WHAT THE EARLIEST DESCRIPTIONS ALREADY SHOW. By the time Europeans write about this coast in any " +
      "detail — Bosman at the end of the seventeenth century, the eighteenth-century traders, and the 1658 " +
      "catechism before all of them — the religious world they describe is not new. There are priesthoods. " +
      "There are shrines with histories. There is an established vocabulary. There is initiation, and " +
      "specialists, and divination with a structure to it.\n\n" +
      "WHAT THAT LICENSES SAYING. That the elements were in place before the record begins: veneration of " +
      "ancestors; powers associated with places, lineages and communities; powers of earth, water, thunder, " +
      "iron and the crossroads; specialist priesthoods and initiatory knowledge; possession; and " +
      "divination.\n\n" +
      "WHAT IT DOES NOT LICENSE. Dating any of them. 'Older than the documents' is a real statement and it " +
      "is not a date. This record therefore carries a POSITIONLESS claim — it asserts priority without " +
      "asserting a position — which is the only honest shape available.\n\n" +
      "THE OTHER THING THIS RECORD IS FOR. Blocking a specific move: taking archaeology from the territory " +
      "of modern Bénin and reading it as evidence of Vodun. An iron spearhead from 1000 BCE is not evidence " +
      "for Gu. A pot in a pit at Sodohomé is not evidence for an offering to a vodun. Those inferences " +
      "require a chain of continuity that nothing supplies, and the temptation to make them is strongest " +
      "exactly where the evidence is weakest.\n\n" +
      "THINGS TO ASK: If you know a tradition is older than its first mention, what have you actually " +
      "learned?",
    category: "religion",
    subcategory: "Origins",
    eventType: "traditional_account",
    evidenceStatus: "unresolved",
    tags: ["vodun", "ancestors", "ritual", "method", "dating", "oral-knowledge", "origins"],
    civilisations: ["Aja", "Fon", "Hueda", "Gun"],
    locationName: "Southern Bénin and the Gbe-speaking region",
    lat: 6.7,
    lng: 2.1,
    claims: [
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "primordial",
        whatIsDated: "The origin of the practices, in the tradition's own terms",
        originalDateText: "From the ancestors; the traditions do not date their own beginning",
        datingMethod: "oral_tradition",
        chronology: "traditional",
        evidence:
          "WHY 'PRIMORDIAL' RATHER THAN A DATE: because that is the kind of temporal statement the " +
          "tradition actually makes. It places these practices in founding time — with the ancestors, " +
          "before the present order — and converting that into a year would replace what the tradition " +
          "says with something it does not say.",
      },
      {
        sourceKey: "bosman_guinea_1704",
        startYear: 1658,
        endYear: 1704,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The period from which the practices are documented as already established",
        originalDateText: "Documented as established by the mid-seventeenth to early eighteenth century",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT THIS RANGE IS: the window in which outside documentation begins and already describes a " +
          "developed religious system — the catechism at one end, Bosman at the other. It is a date for " +
          "the EVIDENCE, and the record exists partly to keep that from being read as a date for the " +
          "practices.",
      },
    ],
    media: [
      {
        url: commons("Vodun altar.jpg"),
        sourcePageUrl: commonsPage("Vodun altar.jpg"),
        fileName: "Vodun altar.jpg",
        caption:
          "A Vodun altar. Altars accumulate the residue of repeated offering over years, which makes them the most physically durable part of the practice — and the part most likely to leave something an archaeologist could find.",
        kind: "image",
        shows: "site",
        identificationStatus: "probable",
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for place and date.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "not-one-theology",
    title: "Fon, Aja, Hueda, Gun, Yoruba: not one theology",
    summary:
      "The tidy pantheon in reference books is a synthesis. Communities differ in which powers they serve, what they call them, and how they explain them — and the differences are historical evidence.",
    description:
      "WHAT THE REFERENCE BOOKS DO. Present a list: Mawu-Lisa at the top, then Legba, Dan, Sakpata, " +
      "Heviosso, Gu, Fa, each with a domain, like a Greek pantheon. It is clear, memorable and partly an " +
      "artefact of the people who wrote it down — colonial-era ethnographers, working with particular " +
      "informants, producing systems for European readers who expected religions to have systems.\n\n" +
      "WHAT IS ACTUALLY THERE. Vodun are served by COMMUNITIES, LINEAGES AND INDIVIDUALS, and which ones " +
      "matter depends on who and where you are. A vodun central in one town may be unknown in the next. A " +
      "lineage has its own. A place has its own. Names, attributes and stories vary across the Fon, Aja, " +
      "Hueda, Gun and Yoruba-speaking communities of this region, and across time within each.\n\n" +
      "WHY THE VARIATION IS EVIDENCE AND NOT NOISE. Because it records history. DANGBÈ is Hueda's, and " +
      "enters the Dahomean religious world through conquest. Cults travelled with migration, with " +
      "marriage, with captives, with trade. A DISTRIBUTION MAP OF WHO SERVES WHAT IS A MAP OF PAST " +
      "MOVEMENT AND PAST POLITICS — and flattening it into one pantheon deletes exactly that information.\n\n" +
      "HOW THIS DATASET HANDLES IT. Records for individual vodun below say which communities the " +
      "attributes described come from, where that is known, and flag where a description is a synthesis " +
      "rather than a local account. It does this imperfectly, because the sources reachable here are " +
      "themselves mostly syntheses.\n\n" +
      "THINGS TO ASK: Who made the list you are reading, and who told them?",
    category: "religion",
    subcategory: "Method",
    eventType: "other",
    eventTypeNote: "A methodological record about how this dataset handles descriptions of belief.",
    tags: ["vodun", "method", "peoples", "variation", "historiography", "ethnography"],
    civilisations: ["Fon", "Aja", "Hueda", "Gun", "Yoruba"],
    locationName: "Southern Bénin, Togo and south-western Nigeria",
    lat: 6.9,
    lng: 2.0,
    claims: [
      {
        sourceKey: "herskovits_dahomey_1938",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Nothing. This record is about how belief gets described",
        originalDateText: "Not a dated event",
        datingMethod: "other",
        chronology: "conventional",
        evidence:
          "WHY HERSKOVITS IS CITED HERE RATHER THAN CONTRADICTED: his 1930s ethnography is one of the main " +
          "routes by which a systematised account of Fon religion entered the literature, and it is a " +
          "serious piece of fieldwork. The point of this record is not that such syntheses are worthless " +
          "but that they are SYNTHESES, made by somebody, from somebody, at a date.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE POWERS
  // -------------------------------------------------------------------------
  {
    slug: "mawu-lisa",
    title: "Mawu and Lisa",
    summary:
      "Widely described as a creator pair — Mawu with moon, night and a female principle, Lisa with sun, day and a male one — and sometimes as a single two-in-one being. The descriptions come from particular informants and traditions.",
    description:
      "WHAT IS COMMONLY DESCRIBED. MAWU associated with the moon, the night, coolness and a female " +
      "principle; LISA with the sun, the day, heat and a male principle; and MAWU-LISA as a creator " +
      "understood as a pair, a couple, or one being with two aspects. The pairing is presented as " +
      "complementary rather than oppositional: the two together make a whole, and the world is their " +
      "work.\n\n" +
      "WHERE THAT DESCRIPTION COMES FROM. Substantially from twentieth-century ethnography, Herskovits's " +
      "in particular, working with particular informants in particular places. THAT IS NOT A DISMISSAL — " +
      "it is where most systematic description of Fon religion comes from, and there is no undocumented " +
      "version available to compare it with.\n\n" +
      "WHY THE CAUTION MATTERS HERE MORE THAN ELSEWHERE. Because a supreme creator pair at the head of a " +
      "system is exactly the shape a European ethnographer would be looking for, and exactly the shape a " +
      "summary tends to acquire whether or not it fits. Traditions differ on whether Mawu and Lisa are two " +
      "or one, on their relation to other powers, and on how much they are involved with the world at all. " +
      "A creator who is distant from daily affairs — with practical religious attention directed to nearer " +
      "powers — is widely reported in this region, and a reference-book entry naming a supreme god can " +
      "give a misleading impression of where the religion's actual attention goes.\n\n" +
      "WHAT THIS RECORD FILES IT AS. DOCUMENTED RELIGIOUS BELIEF, as described in the ethnographic " +
      "literature and by practitioners — with the origin of the description recorded alongside the " +
      "description, because in this case the second is as informative as the first.\n\n" +
      "THINGS TO ASK: If you ask a question no one has been asked before, what kind of answer do you get?",
    category: "religion",
    subcategory: "Vodun cosmology",
    eventType: "traditional_account",
    tags: ["vodun", "mawu", "lisa", "cosmology", "creation", "religion", "ethnography"],
    civilisations: ["Fon", "Aja"],
    locationName: "Southern Bénin",
    lat: 7.0,
    lng: 2.0,
    claims: [
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "primordial",
        whatIsDated: "The creation, in the tradition's own terms",
        originalDateText: "At the beginning; the tradition places creation in founding time rather than at a date",
        datingMethod: "oral_tradition",
        chronology: "religious",
        evidence:
          "WHY POSITIONLESS: a creation account is a statement about the beginning of the world, not a " +
          "dated event within it. Putting a year on it would be inventing a chronology the tradition does " +
          "not have.",
      },
      {
        sourceKey: "herskovits_dahomey_1938",
        startYear: 1930,
        endYear: 1938,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The systematic ethnographic description of Mawu-Lisa that later summaries descend from",
        originalDateText: "Fieldwork of the 1930s, published 1938",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY THIS DATE IS ON THIS RECORD AT ALL: because the description most readers will meet has a " +
          "date and an author, and knowing them is part of weighing it. THE DATE OF AN ETHNOGRAPHY IS NOT " +
          "THE DATE OF A BELIEF, and this claim is explicit about which of the two it is.",
        notes:
          "NEEDS SOURCE VERIFICATION for how far the Mawu-Lisa material in circulation descends from this " +
          "one work, which is a real question about source dependency and not a rhetorical one.",
      },
    ],
  },

  {
    slug: "legba",
    title: "Legba, at the threshold",
    summary:
      "The power of entrances, crossroads and communication: nothing reaches the other vodun except through him. His shrines stand at doorways and village edges across the region.",
    description:
      "WHAT HE DOES. LEGBA stands at thresholds — the doorway of a compound, the entrance to a village, the " +
      "crossroads — and mediates. In the accounts, no communication reaches the other vodun except through " +
      "him: offerings, requests and divination all pass his way first. He is also associated with " +
      "language, with unpredictability, and with the disruption that makes movement possible.\n\n" +
      "WHERE YOU SEE HIM. In earth and clay figures at entrances, often prominently male, frequently " +
      "served with offerings — palm oil, drink, food. These are among the most visible and most " +
      "photographed religious objects in Bénin, and among the most misdescribed by visitors.\n\n" +
      "WHY A GOD OF THRESHOLDS MAKES STRUCTURAL SENSE. Because a religion of many powers needs a protocol. " +
      "Legba is the protocol: the rule that access is mediated, addressed first, and never assumed. That is " +
      "a religious idea and it is also an organising principle, and it has an obvious resonance with a " +
      "royal palace whose entire architecture controls who may pass which gate.\n\n" +
      "WHAT MUST NOT BE DONE WITH HIM. Two things. Calling him a trickster and leaving it there flattens " +
      "him into a comparative-mythology category. And reading Haitian Papa Legba backwards into West " +
      "African Legba treats a transformed tradition as a copy — the diaspora records handle that " +
      "separately and carefully.\n\n" +
      "THINGS TO ASK: Why would a religion need a doorkeeper? What does it say about how power is " +
      "approached?",
    category: "religion",
    subcategory: "Vodun powers",
    eventType: "traditional_account",
    tags: ["vodun", "legba", "crossroads", "shrines", "ritual", "religion", "diaspora"],
    civilisations: ["Fon", "Aja", "Gun"],
    locationName: "Southern Bénin",
    lat: 6.9,
    lng: 2.1,
    imageUrl: commons("VODOUN LEGBA DANS UNE LOCALITE DE LA VILLE DE SAVALOU AU BENIN.jpg"),
    claims: [
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When Legba traditions began",
        originalDateText: "Date unknown; documented from the earliest European descriptions onwards",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHY NO DATE: the same reason as every power in this lane. Legba is present in the record as soon " +
          "as there is a record, which fixes a latest-by point and nothing else.",
      },
    ],
    media: [
      {
        url: commons("VODOUN LEGBA DANS UNE LOCALITE DE LA VILLE DE SAVALOU AU BENIN.jpg"),
        sourcePageUrl: commonsPage("VODOUN LEGBA DANS UNE LOCALITE DE LA VILLE DE SAVALOU AU BENIN.jpg"),
        fileName: "VODOUN LEGBA DANS UNE LOCALITE DE LA VILLE DE SAVALOU AU BENIN.jpg",
        caption:
          "A Legba shrine in a locality of Savalou, Bénin. Figures of this kind stand at entrances and at the edges of settlements; a photograph shows the object and the offerings on it, and shows nothing about what is understood to be happening there.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "dan-the-serpent",
    title: "Dan: the serpent, movement and continuity",
    summary:
      "A serpent-associated power connected in the accounts with movement, flexibility, continuity and wealth, and in some traditions with the rainbow. Not to be confused with the chief in Dahomey's foundation story.",
    description:
      "WHAT IS DESCRIBED. DAN is associated with the serpent, and in the accounts with movement, " +
      "flexibility, continuity, and the circulation of wealth and life. In some traditions there is a " +
      "rainbow association, and imagery of a serpent encircling or supporting the world appears in " +
      "descriptions of the cosmology.\n\n" +
      "THE FIRST THING TO KEEP SEPARATE. Dan the vodun is NOT automatically the same as DAN the Gedevi " +
      "chief in Dahomey's foundation story — the one whose belly the kingdom's name is said to come from. " +
      "The two names look alike, and 'da' or 'dan' does mean snake in Gbe languages, and neither of those " +
      "facts is evidence that the story and the vodun are connected. If a reliable source establishes a " +
      "relationship it belongs here; none is entered, and the coincidence of names is explicitly not " +
      "treated as one.\n\n" +
      "THE SECOND THING TO KEEP SEPARATE. Dan is not simply Dangbè. The sacred python tradition of Hueda " +
      "and Ouidah is closely related in subject and is its own tradition with its own history, its own " +
      "place and its own politics — and it entered the Dahomean religious world through conquest rather " +
      "than by always having been there. It has its own records.\n\n" +
      "WHAT COMPARATIVE WORK IS AND IS NOT ALLOWED HERE. Serpent imagery in cosmology is widespread across " +
      "the world and this dataset draws no line from it to Egypt, to Mesopotamia or anywhere else. A shared " +
      "image is not a shared history, and the pattern where a serpent becomes evidence of ancient contact " +
      "is a durable one in popular writing and has no support in this record.\n\n" +
      "THINGS TO ASK: When two things share a name, what would make them the same thing?",
    category: "religion",
    subcategory: "Vodun powers",
    eventType: "traditional_account",
    identificationStatus: "modern_interpretation",
    tags: ["vodun", "dan", "serpent", "sacred-animals", "cosmology", "religion", "method"],
    civilisations: ["Fon", "Aja"],
    locationName: "Southern Bénin",
    lat: 6.9,
    lng: 2.1,
    claims: [
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When Dan traditions began",
        originalDateText: "Date unknown",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHY NO DATE: as elsewhere in this lane. What can be said is that serpent-associated powers are " +
          "described on this coast from the earliest European accounts — Bosman at Whydah before 1704 — " +
          "and that this fixes a latest-by point for serpent veneration in the region and nothing more.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether Dan the vodun and Dan the chief in the foundation story are connected",
        originalDateText: "Not established. Similar names are not evidence",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "WHY THIS CLAIM EXISTS AT ALL: because the connection is made constantly in popular accounts, " +
          "and a record that simply did not mention it would leave a reader to make it themselves. WHAT " +
          "WOULD SUPPORT IT: a source in which the tradition itself links them, or linguistic work on the " +
          "name. NEITHER IS ENTERED HERE, and the claim stands as unresolved rather than denied.",
      },
    ],
  },

  {
    slug: "sakpata",
    title: "Sakpata: the earth, and the disease that came out of it",
    summary:
      "A power of the earth associated in the documented traditions with smallpox and other eruptive diseases — and with healing them. The cult survived the disease's eradication.",
    description:
      "WHAT IS DESCRIBED. SAKPATA is associated with the EARTH, and in the documented traditions with " +
      "smallpox and related eruptive diseases: both their sending and their healing. Priests and healers of " +
      "Sakpata dealt with the sick, and the cult had a practical medical role alongside its religious one.\n\n" +
      "WHY THIS IS A HISTORY-OF-MEDICINE RECORD AS WELL AS A RELIGIOUS ONE. Because a specialist body of " +
      "practitioners dealing with a specific, recognisable, catastrophic disease is a medical institution " +
      "whatever else it is. Smallpox in West Africa was recurrent and lethal; the people who handled cases, " +
      "managed the sick and dealt with the dead had knowledge, and that knowledge sat inside a religious " +
      "framework rather than beside one.\n\n" +
      "THE COLONIAL COLLISION. Colonial administrations regulated, restricted and in places suppressed " +
      "cults of this kind — partly as 'fetishism', and partly because a religious institution that handled " +
      "epidemic disease was in direct competition with colonial public health. THAT CONFLICT IS " +
      "DOCUMENTABLE AND IS BADLY DOCUMENTED IN THIS DATASET, which is a gap worth naming.\n\n" +
      "WHAT HAPPENED AFTER SMALLPOX. The disease was declared eradicated worldwide in 1980. THE CULT DID " +
      "NOT END. Sakpata remains part of living Vodun, which is a useful correction to any account that " +
      "explains a religious tradition purely by the practical function it served: the function ended and " +
      "the tradition did not.\n\n" +
      "THINGS TO ASK: What happens to a body of specialist knowledge when the problem it addressed goes " +
      "away?",
    category: "religion",
    subcategory: "Vodun powers",
    eventType: "traditional_account",
    tags: ["vodun", "sakpata", "earth", "healing", "medicine", "smallpox", "colonialism", "religion"],
    civilisations: ["Fon", "Aja"],
    locationName: "Southern Bénin",
    lat: 7.0,
    lng: 2.0,
    claims: [
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When Sakpata traditions began",
        originalDateText: "Date unknown; documented in the nineteenth and twentieth centuries",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHY NO DATE: the cult is described by nineteenth-century observers and by twentieth-century " +
          "ethnographers, which dates the DESCRIPTIONS. Nothing available dates the tradition.",
      },
      {
        sourceKey: null,
        startYear: 1980,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The global eradication of smallpox",
        originalDateText: "1980, when eradication was declared",
        datingMethod: "historical_record",
        chronology: "scientific",
        evidence:
          "WHY A MEDICAL DATE IS ON A RELIGIOUS RECORD: because it is the clearest possible test of whether " +
          "a cult is reducible to its practical function. The disease ended; the tradition continued. That " +
          "is a dated, checkable fact with a real implication.",
      },
    ],
    media: [
      {
        url: commons("Sakpatassi.jpg"),
        sourcePageUrl: commonsPage("Sakpatassi.jpg"),
        fileName: "Sakpatassi.jpg",
        caption:
          "A Sakpatassi — a devotee of Sakpata — in ceremonial dress. The photograph records the costume and the occasion; what the ceremony is understood to accomplish is not something a camera can show, and is described in the text rather than claimed by the picture.",
        kind: "image",
        shows: "site",
        identificationStatus: "probable",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes: "NEEDS SOURCE VERIFICATION for place, date and occasion.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "heviosso-thunder",
    title: "Heviosso: thunder, lightning and judgement",
    summary:
      "The power of storm and lightning, associated in the accounts with justice and with sudden, public retribution. Stone axes found in the ground are identified with his strikes.",
    description:
      "WHAT IS DESCRIBED. HEVIOSSO — Hêbiosso, Xevioso — is associated with thunder, lightning, storm and " +
      "rain, and with JUSTICE: a power that strikes suddenly, visibly and from above, and whose strike is " +
      "read as judgement. The double axe is his emblem.\n\n" +
      "THE DETAIL THAT CONNECTS RELIGION TO ARCHAEOLOGY. Polished stone axes turned up by ploughing or " +
      "erosion are widely identified in this region as THUNDERSTONES — the physical residue of a " +
      "lightning strike — and are taken into shrines. They are in fact Neolithic or later stone tools, " +
      "made by people, thousands of years old.\n\n" +
      "WHY THAT IS ONE OF THE MOST INTERESTING FACTS IN THIS DATASET. Because it is a case of ancient " +
      "material culture being incorporated into living religion, with an explanation attached, in a place " +
      "where the archaeology is otherwise thin. The same identification of stone axes with thunder is " +
      "recorded across Europe, Asia and Africa independently — it is what people reasonably conclude when " +
      "a hard, shaped, obviously-not-natural object comes out of the ground where lightning fell.\n\n" +
      "THE THREE STATEMENTS, KEPT APART. OBSERVABLE: polished stone axes are found, collected and placed " +
      "in shrines. PRACTITIONER INTERPRETATION: they are the material trace of Heviosso's strike. " +
      "ARCHAEOLOGICAL STATUS: they are manufactured stone tools of considerable antiquity. All three are " +
      "true; the third does not cancel the second as an account of what the object MEANS in use.\n\n" +
      "THINGS TO ASK: What would you conclude if you found a polished stone axe where lightning had " +
      "struck?",
    category: "religion",
    subcategory: "Vodun powers",
    eventType: "traditional_account",
    tags: ["vodun", "heviosso", "thunder", "justice", "archaeology", "stone-age", "lithics", "religion"],
    civilisations: ["Fon", "Aja"],
    locationName: "Southern Bénin",
    lat: 6.9,
    lng: 2.0,
    claims: [
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When Heviosso traditions began",
        originalDateText: "Date unknown",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHY NO DATE: Heviosso is described by nineteenth-century observers and twentieth-century ethnographers, which dates the DESCRIPTIONS. The thunderstone practice may be very old — the identification of stone axes with lightning is recorded independently across three continents — and that is a reason to think it plausible, not a reason to put a year on it.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "The age of the stone axes identified as thunderstones",
        originalDateText: "Manufactured stone tools, considerably older than the traditions that collect them; individually undated",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHAT IS ESTABLISHED: that ground stone axes of this kind are human-made tools of substantial " +
          "antiquity. WHAT IS NOT: the age of any particular example, because objects collected from the " +
          "surface and taken into shrines have lost their archaeological context entirely. AN OBJECT IN A " +
          "SHRINE IS UNDATEABLE IN PRACTICE, and that is a real cost of its second life.",
      },
    ],
  },

  {
    slug: "gu-iron-and-war",
    title: "Gu: iron, tools, weapons and war",
    summary:
      "The power of iron, and therefore of the hoe, the knife, the gun and the smith. Where technology and religion in this region meet most directly.",
    description:
      "WHAT IS DESCRIBED. GU — Gou — is the power of IRON, and so of everything iron does: clearing, " +
      "cultivating, cutting, killing. Blacksmiths stand in a particular relation to him, and so do hunters " +
      "and warriors. In neighbouring Yoruba tradition the comparable figure is Ogun, and the two are " +
      "related historically as well as thematically.\n\n" +
      "WHY THIS IS THE CLEAREST TECHNOLOGY-AND-RELIGION RECORD IN THE DATASET. Because iron in this region " +
      "is not a metaphor. There was an ironworking settlement on the Abomey plateau by around 1000 BCE and " +
      "an iron-producing centre there again by 900 CE; iron-using farmers were established around Savè by " +
      "1000 CE; the hoe made the farming, and the blade and the gun made the kingdom. A power of iron sits " +
      "at the centre of the material history of this place.\n\n" +
      "WHAT MUST NOT BE INFERRED FROM THAT. That Gu was worshipped at Sodohomé in 1000 BCE. The " +
      "archaeology shows ironworking. It shows nothing about what anybody believed about it, and the " +
      "religious traditions are documented from thousands of years later. THE TWO FACTS SIT ON THE SAME " +
      "TIMELINE AND THE CONNECTION BETWEEN THEM IS NOT ESTABLISHED — putting them side by side is useful; " +
      "joining them with a line would be fabrication.\n\n" +
      "THE OBJECT. The great iron figure of Gou, attributed to the smith Akati Ekplékendo and dated around " +
      "1858, is made of the substance it represents, by a man whose trade was that substance. It is " +
      "recorded in the Dahomey dataset with its seizure and its museum history.\n\n" +
      "THINGS TO ASK: Where does technology stop and religion start, for the people using the tool?",
    category: "religion",
    subcategory: "Vodun powers",
    eventType: "traditional_account",
    tags: ["vodun", "gu", "iron", "metallurgy", "technology", "warfare", "agriculture", "religion"],
    civilisations: ["Fon", "Aja", "Yoruba"],
    locationName: "Southern Bénin",
    lat: 7.0,
    lng: 2.0,
    claims: [
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When Gu traditions began",
        originalDateText: "Date unknown. Ironworking in the territory is ancient; the religious tradition is documented late",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "THE MOST IMPORTANT 'NO DATE' IN THIS DATASET, because the temptation to supply one is strongest " +
          "here. Ancient ironworking is archaeologically dated; Gu is not. Transferring the first date to " +
          "the second would create, out of nothing, a three-thousand-year-old religion.",
      },
    ],
    media: [
      {
        url: commons("Benin, fon, il dio gou protettore del ferro battuto e della guerra, ante 1858, artista akati ekplékendo, 02.JPG"),
        sourcePageUrl: commonsPage("Benin, fon, il dio gou protettore del ferro battuto e della guerra, ante 1858, artista akati ekplékendo, 02.JPG"),
        fileName: "Benin, fon, il dio gou protettore del ferro battuto e della guerra, ante 1858, artista akati ekplékendo, 02.JPG",
        caption:
          "The iron figure of Gou, attributed to the smith Akati Ekplékendo and dated to about 1858. The figure is made of the substance it represents, by a man whose trade was that substance — which is as close as this dataset comes to a single object stating a whole argument.",
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
        url: commons("Benin, fon, il dio gou protettore del ferro battuto e della guerra, ante 1858, artista akati ekplékendo, 04.JPG"),
        sourcePageUrl: commonsPage("Benin, fon, il dio gou protettore del ferro battuto e della guerra, ante 1858, artista akati ekplékendo, 04.JPG"),
        fileName: "Benin, fon, il dio gou protettore del ferro battuto e della guerra, ante 1858, artista akati ekplékendo, 04.JPG",
        caption:
          "Another view of the Gou figure. Two views of one object are two records of it, not two pieces of evidence — but with a sculpture assembled from forged and sheet iron, a second angle shows construction that a single view hides.",
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
    slug: "ancestors-in-vodun",
    title: "The ancestors",
    summary:
      "The dead remain part of the community: consulted, fed, remembered and answerable to. Ancestral practice runs through everything else in this lane and through Dahomean kingship.",
    description:
      "WHAT IS DESCRIBED. The dead are not gone. They remain in relation with the living — receiving " +
      "offerings, consulted about decisions, capable of helping and of withholding help, and requiring " +
      "attention. Lineage shrines, memorial objects and funerary practice are the machinery of that " +
      "relationship, and UNESCO's own description of Vodun in Bénin places ancestors centrally.\n\n" +
      "WHY IT IS THE STRUCTURAL CENTRE RATHER THAN ONE TOPIC AMONG MANY. Because it connects everything " +
      "else. The ASEN — iron memorial altars — are objects for it. Divination is how the ancestors are " +
      "consulted. Funerals are where the transition is made. And DAHOMEAN KINGSHIP IS A SPECIAL CASE OF " +
      "IT: the Annual Customs are the servicing of royal ancestors, and the whole apparatus of the state's " +
      "ceremonial year is ancestral practice at royal scale.\n\n" +
      "THE POLITICAL CONSEQUENCE. A monarchy whose central obligation is to its own dead is a monarchy in " +
      "which the dynasty's continuity is the religion of the state. That is why a usurper needs to manage " +
      "the memory of his predecessor, and why the treatment of Adandozan in the royal tradition is a " +
      "religious fact as much as a political one.\n\n" +
      "WHAT SURVIVED. This is the part of Vodun that most obviously continued through colonial rule, " +
      "conversion and the twentieth century — partly because it is domestic and lineage-based rather than " +
      "public, and partly because it coexists with Christianity and Islam for many families more easily " +
      "than a public cult does.\n\n" +
      "THINGS TO ASK: What is the difference between remembering the dead and being in a relationship with " +
      "them?",
    category: "religion",
    subcategory: "Ancestors",
    eventType: "traditional_account",
    tags: ["vodun", "ancestors", "ritual", "asen", "kingship", "annual-customs", "continuity", "religion"],
    civilisations: ["Fon", "Aja", "Gun", "Yoruba"],
    locationName: "Southern Bénin",
    lat: 6.9,
    lng: 2.1,
    claims: [
      {
        sourceKey: "unesco_ich_vodun_assistance",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When ancestral practice in this region began",
        originalDateText: "Date unknown; described as central in the present and documented throughout the historical record",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHAT SUPPORTS THE IMPORTANCE OF THE PRACTICE: it is described by every observer from the " +
          "seventeenth century onwards, it is the organising principle of the best-documented state " +
          "ceremonial in the region, and it is central in UNESCO's present-day description. WHY NO DATE: " +
          "none of that dates a beginning.",
      },
    ],
  },

  {
    slug: "toxosu-and-twins",
    title: "Twins, unusual births and the Toxosu",
    summary:
      "Twins hold a special religious status in this region, and children born in unusual ways are associated with water powers. The practices are among the most visible in daily life and least understood by visitors.",
    description:
      "WHAT IS DESCRIBED. TWINS — hohovi — occupy a distinct religious position: honoured, served, and " +
      "requiring particular observances, continuing after the death of one or both. Carved figures " +
      "representing deceased twins are kept, carried, fed and cared for by mothers and families. The " +
      "TOXOSU are associated with children born in unusual ways and with water powers, and have their own " +
      "cult.\n\n" +
      "WHY THIS MATTERS FOR UNDERSTANDING THE RELIGION AS A WHOLE. Because it is where Vodun is most " +
      "obviously a DOMESTIC practice rather than a public cult — carried out by families, in houses, " +
      "continuously, without priests or ceremonies that an outsider would notice. Most writing about Vodun " +
      "describes spectacle: ceremonies, masks, drumming, trance. Most of the practice is this.\n\n" +
      "THE OBJECT PROBLEM. Twin figures are collected, traded and displayed as art objects worldwide. A " +
      "carved figure in a museum case was, in use, a member of a family who was fed, dressed and spoken " +
      "to. THE CATEGORY 'AFRICAN ART' PERFORMS THAT TRANSFORMATION QUIETLY, and a caption naming the " +
      "material and the ethnic group completes it.\n\n" +
      "WHAT THIS RECORD DOES NOT CLAIM. A date, an origin, or a uniform practice across communities. " +
      "Twin observances in this region are related to widespread Yoruba practice and are not identical to " +
      "it, and the details vary locally.\n\n" +
      "THINGS TO ASK: What changes about an object when it stops being used and starts being displayed?",
    category: "religion",
    subcategory: "Vodun practice",
    eventType: "traditional_account",
    tags: ["vodun", "twins", "toxosu", "water", "family", "ritual", "museum-object", "religion"],
    civilisations: ["Fon", "Aja", "Yoruba"],
    locationName: "Southern Bénin",
    lat: 6.9,
    lng: 2.1,
    claims: [
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When twin and Toxosu observances began",
        originalDateText: "Date unknown",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHY NO DATE: as with every practice in this lane. Documented by ethnographers from the " +
          "nineteenth and twentieth centuries and by practitioners today; undated at its origin.",
        notes:
          "NEEDS BETTER SOURCING throughout. Twin practice in this region is well studied and this record " +
          "cites none of that literature specifically, which makes it the weakest of the practice records " +
          "here.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // FA: DIVINATION AS AN INFORMATION SYSTEM
  // -------------------------------------------------------------------------
  {
    slug: "fa-divination",
    title: "Fa: two hundred and fifty-six signs, and the corpus behind them",
    summary:
      "A divination system in which a cast produces one of 256 configurations, each keyed to a body of memorised verses. The diviner is called a bokonon, and the training is long.",
    description:
      "HOW IT WORKS, MECHANICALLY. The diviner casts — palm nuts, or a chain strung with seed halves or " +
      "shells — and the fall produces a pattern. Sixteen basic signs combine in pairs to give TWO HUNDRED " +
      "AND FIFTY-SIX configurations, each with a name. The configuration is not the answer. It is an " +
      "ADDRESS: it tells the diviner which body of material to recite from.\n\n" +
      "WHAT IS AT THAT ADDRESS. Verses, narratives, precedents, proverbs, prescriptions — offerings to be " +
      "made, things to avoid, plants to use, conduct to follow. The diviner recites what belongs to the " +
      "sign; the client and the diviner between them work out which part applies. THE SYSTEM DOES NOT " +
      "PRODUCE A PREDICTION. It produces a body of relevant material and a course of action.\n\n" +
      "THE BOKONON. The specialist, trained over years, whose competence is memory: the signs, the verses " +
      "attached to each, the prescriptions, and the judgement to apply them. In Yoruba tradition the " +
      "equivalent is the babalawo and the system is Ifá; among the Ewe it is Afa. THE STRUCTURE IS SHARED — " +
      "sixteen signs, 256 combinations, an attached corpus — and the relationship between the traditions is " +
      "historical and close, involving real exchange between Yoruba and Fon religious worlds.\n\n" +
      "WHAT IT IS NOT. Fortune telling. Describing it that way loses the corpus, the training, the ethical " +
      "and medical content and the procedure, and keeps only the part that looks superstitious to an " +
      "outsider.\n\n" +
      "ITS PLACE IN DAHOMEY. Consultation of Fa is reported in royal decision-making as well as in " +
      "ordinary life, which puts a divination system inside the machinery of a state.\n\n" +
      "THINGS TO ASK: If a system gives you a text rather than an answer, what is it actually doing?",
    category: "religion",
    subcategory: "Divination",
    eventType: "traditional_account",
    evidenceStatus: "strongly_documented",
    tags: ["fa", "divination", "bokonon", "oral-knowledge", "vodun", "yoruba", "ifa", "religion"],
    civilisations: ["Fon", "Yoruba", "Aja"],
    locationName: "Southern Bénin",
    lat: 6.9,
    lng: 2.1,
    claims: [
      {
        sourceKey: "maupoil_geomancie_1943",
        startYear: 1943,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The first substantial systematic documentation of Fa",
        originalDateText: "1943, Maupoil's study",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: A BOOK, not a practice. Maupoil's study is the foundation of the scholarly " +
          "literature on Fa, and it is a colonial-era work later scholars describe as incomplete and " +
          "sometimes mistaken. Its date belongs to the history of documentation.",
      },
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When Fa divination began in this region",
        originalDateText: "Date unknown. Its relationship with Yoruba Ifá is historical and its direction is argued",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHAT IS ESTABLISHED: that Fon Fa, Yoruba Ifá and Ewe Afa share a structure and a substantially " +
          "related corpus, which means historical connection rather than coincidence. WHAT IS NOT: when, " +
          "in which direction, or through what contacts. THE EXCHANGE BETWEEN THE FON AND YORUBA " +
          "RELIGIOUS WORLDS IS REAL AND REPEATED — through Oyo's dominance, through war, through captives " +
          "moving in both directions — which makes a single origin story unlikely to be right.",
        notes:
          "NEEDS SOURCE VERIFICATION for the scholarly positions on the relationship, which is a " +
          "substantial literature this record summarises without citing.",
      },
    ],
    media: [
      {
        url: commons("Fa divination tray ritual Réplica of Gedegbe Fa tray1.jpg"),
        sourcePageUrl: commonsPage("Fa divination tray ritual Réplica of Gedegbe Fa tray1.jpg"),
        fileName: "Fa divination tray ritual Réplica of Gedegbe Fa tray1.jpg",
        caption:
          "A REPLICA of the Fa divination tray associated with Gedegbe, the celebrated diviner of the Dahomean court. A replica is not the object: it shows the form and the layout, and carries none of the original's provenance.",
        kind: "image",
        shows: "replica",
        identificationStatus: "modern_interpretation",
        depictsActualRemains: false,
        verifiedIdentity: false,
        provenanceNotes:
          "DELIBERATELY LABELLED AS A REPLICA. NEEDS SOURCE VERIFICATION for where the original is and what its history is.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Ifa divination tray ( Opele Ifa).jpg"),
        sourcePageUrl: commonsPage("Ifa divination tray ( Opele Ifa).jpg"),
        fileName: "Ifa divination tray ( Opele Ifa).jpg",
        caption:
          "A divination tray of the related Yoruba Ifá tradition. Fon Fa, Yoruba Ifá and Ewe Afa share sixteen basic signs, 256 combinations and a largely related corpus — so an Ifá tray shows the form of a system that crosses all three, and is not a Fon object.",
        kind: "image",
        shows: "artefact",
        identificationStatus: "secure",
        provenanceNotes:
          "YORUBA IFÁ, not Fon Fa. Attached to show the shared structure, and captioned so it is not mistaken for a Beninese object.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Odi meji.jpg"),
        sourcePageUrl: commonsPage("Odi meji.jpg"),
        fileName: "Odi meji.jpg",
        caption:
          "A diviner casting, with the resulting configuration on the tray. The cast selects one of 256 named configurations; the configuration is an address, and what the diviner then recites is the material held at that address.",
        kind: "image",
        shows: "site",
        identificationStatus: "probable",
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for place, date and tradition.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Brooklyn Museum 75.150.1 Divination Tapper Iroke Ifa.jpg"),
        sourcePageUrl: commonsPage("Brooklyn Museum 75.150.1 Divination Tapper Iroke Ifa.jpg"),
        fileName: "Brooklyn Museum 75.150.1 Divination Tapper Iroke Ifa.jpg",
        caption:
          "A divination tapper (iroke) from the Yoruba Ifá tradition, held by the Brooklyn Museum. The tapper is struck against the tray to open the consultation — an instrument of procedure rather than of prediction.",
        kind: "image",
        shows: "museum_specimen",
        institution: "Brooklyn Museum",
        accessionNumber: "75.150.1",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "fa-as-an-information-system",
    title: "Fa as an oral information-storage and retrieval system",
    summary:
      "A modern analytical description, labelled as one: 256 addresses, each holding a body of memorised material, with a randomising mechanism for retrieval. Useful, and not how practitioners describe it.",
    description:
      "WHAT THIS RECORD IS. A MODERN ANALYTICAL DESCRIPTION. It is not an indigenous term, not how a " +
      "bokonon would describe what he does, and not a claim about what Fa is FOR. It is a way of seeing " +
      "one aspect of the system's structure, offered as such.\n\n" +
      "THE DESCRIPTION. Consider Fa as a system for storing and retrieving information without writing. " +
      "There are 256 ADDRESSES — the configurations. Each address holds CONTENT: verses, narratives, " +
      "precedents, prescriptions, plant knowledge, ethical material, and historical memory. The cast is a " +
      "RETRIEVAL MECHANISM which selects an address. The bokonon is the STORAGE MEDIUM and the training is " +
      "how the corpus is copied from one generation to the next.\n\n" +
      "WHAT THAT DESCRIPTION EXPLAINS WELL. Why the training is so long, and why memory rather than " +
      "insight is what a diviner is judged on. Why the corpus is stable enough to be recognisable across " +
      "the Fon, Yoruba and Ewe traditions. Why a system with no writing can carry a very large body of " +
      "material reliably: indexing it to 256 named addresses makes it addressable and checkable, and a " +
      "verse that has drifted can be corrected by another practitioner who holds the same address.\n\n" +
      "WHAT IT LEAVES OUT, AND THIS IS MOST OF IT. That the consultation is a religious act; that the " +
      "sign is not chosen by chance in the practitioner's understanding; that the relationship between " +
      "client, diviner, ancestors and vodun is the point; and that describing it as information retrieval " +
      "is an outsider's reframing which the tradition does not make.\n\n" +
      "WHY IT IS RECORDED AT ALL. Because it is genuinely illuminating about how knowledge survives " +
      "without books — and because it is exactly the kind of description that gets repeated until it is " +
      "mistaken for what practitioners say. So it is here, explicitly labelled.\n\n" +
      "THINGS TO ASK: When you describe somebody else's practice in your own vocabulary, what do you gain " +
      "and what do you quietly replace?",
    category: "technology",
    subcategory: "Analytical description",
    eventType: "alternative",
    eventTypeNote: "A modern analytical reading of Fa, labelled as such. Not an indigenous description and not a historical event.",
    identificationStatus: "modern_interpretation",
    tags: ["fa", "divination", "oral-knowledge", "method", "information", "modern-interpretation", "technology"],
    civilisations: ["Fon"],
    locationName: "Southern Bénin",
    lat: 6.9,
    lng: 2.1,
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Nothing. This is an analytical description, not an event",
        originalDateText: "A modern reading of the system, with no date of its own",
        datingMethod: "claimant_inference",
        chronology: "other",
        evidence:
          "WHY POSITIONLESS AND WHY LABELLED SO HEAVILY: because an analytical reframing that acquires a " +
          "position on a timeline starts to look like something that happened. This one did not happen. " +
          "It is a way of looking, and the record's entire purpose is to be transparent about that.",
      },
    ],
  },

  {
    slug: "oral-knowledge-as-technology",
    title: "How history survived without books",
    summary:
      "Royal genealogies, praise names, proverbs, emblems, songs, divination corpora, ceremonial re-enactment: a set of interlocking systems, each redundant with the others.",
    description:
      "THE QUESTION. How does a society hold a large body of historical, technical, medical, legal and " +
      "religious knowledge across centuries without alphabetic writing? The answer in this region is not " +
      "'by remembering harder'. It is by building SEVERAL DIFFERENT SYSTEMS that carry overlapping " +
      "content in incompatible formats.\n\n" +
      "THE SYSTEMS. ROYAL GENEALOGIES: the king list, recited, with its sequence and its claims. PRAISE " +
      "NAMES: compressed statements attached to a ruler, memorable because they are poetic. PROVERBS: " +
      "general knowledge in portable form. EMBLEMS: the same content as an image, on a wall, a banner, a " +
      "staff. SONGS AND DRUMMING: rhythm and melody as error-correction, because a wrong word breaks the " +
      "line. DIVINATION CORPORA: hundreds of verses indexed to 256 addresses. CEREMONIAL RE-ENACTMENT: " +
      "history performed annually so that the performance itself is the transmission. And SPECIALISTS " +
      "whose office is to hold particular bodies of it.\n\n" +
      "WHY REDUNDANCY IS THE KEY. One channel fails — a lineage dies, a shrine is destroyed, a war " +
      "interrupts a ceremony — and the content survives in the others. A proverb, an emblem on a palace " +
      "wall, a banner, a staff and a song can all carry the same claim about the same king. THAT IS NOT " +
      "DECORATION. It is engineering, and it is why so much could be reconstructed after 1892.\n\n" +
      "WHAT IT IS BAD AT. The same thing every oral system is bad at: absolute dates, and the middle " +
      "distance. It preserves sequence and content well and years badly, which is why this timeline's " +
      "pre-eighteenth-century chronology is soft while its narrative detail is rich.\n\n" +
      "THE COMPARISON THAT MAKES IT VISIBLE. Where a historian can set an oral tradition beside a European " +
      "account, an excavation and a surviving royal object, the four can be checked against each other — " +
      "and this dataset tries to arrange exactly that where the material allows.\n\n" +
      "THINGS TO ASK: Which of these systems is still running today? What happens to the content when one " +
      "stops?",
    category: "technology",
    subcategory: "Oral knowledge",
    eventType: "historical",
    tags: ["oral-knowledge", "fa", "royal-symbolism", "proverbs", "memory", "method", "technology", "ritual"],
    civilisations: ["Fon", "Aja", "Yoruba", "Gun"],
    locationName: "Southern Bénin",
    lat: 7.0,
    lng: 2.0,
    claims: [
      {
        sourceKey: "vodun_practitioner_tradition",
        startYear: 1600,
        isOngoing: true,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period across which these systems are documented as operating",
        originalDateText: "From the earliest documentation to the present",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY IT IS ONGOING RATHER THAN A CLOSED SPAN: because these systems are still running. Fa is " +
          "practised, praise names are used, ceremonies are performed, and royal lineages at Abomey " +
          "maintain their responsibilities. A CLOSED RANGE WOULD SAY THIS WAS A PAST WAY OF DOING THINGS, " +
          "and that would be the wrong claim.",
      },
    ],
  },

  {
    slug: "bocio-power-figures",
    title: "Bocio: figures made to do something",
    summary:
      "Carved wooden figures bound with cord, cloth and applied substances, made and activated for protection, healing, binding or attack. What they are and what they are understood to do are separate questions.",
    description:
      "THE OBSERVABLE OBJECT. A carved wooden figure, usually human in form, with materials added: cords " +
      "and knots wound around it, cloth, iron, feathers, shells, seeds, clay, blood, palm oil, and " +
      "compounded substances packed into or onto it. The surface accumulates. Many are deliberately not " +
      "beautiful, and the roughness is not a lack of skill.\n\n" +
      "WHAT PRACTITIONERS AND SPECIALISTS DESCRIBE THEM AS DOING. Acting. A bocio is made for a purpose — " +
      "protection of a house or a person, healing, binding an enemy, holding an oath, turning aside harm — " +
      "and is ACTIVATED by ritual, not merely carved. The added materials are not ornament: they are what " +
      "gives the object its capacity, chosen for what they are and what they mean.\n\n" +
      "SUZANNE BLIER'S ARGUMENT, IN ONE LINE. That these objects are about the psychological and social " +
      "conditions of the people who commission them — anxiety, danger, vulnerability, conflict — and that " +
      "the binding is doing visible work on something felt. THAT IS AN INTERPRETATION by a named scholar, " +
      "recorded as such.\n\n" +
      "THE THREE LAYERS, KEPT APART DELIBERATELY. THE OBSERVABLE OBJECT: wood, cord, applied substances; " +
      "examinable, photographable, in museums. THE PRACTITIONER'S ACCOUNT: what it is for, how it was " +
      "activated, what it does. THE OUTSIDER'S INTERPRETATION: art-historical, psychological, " +
      "anthropological readings — including Blier's. Conflating the second and third is the standard " +
      "failure in writing about these objects, and calling them 'fetishes' does it in one word.\n\n" +
      "THE MUSEUM PROBLEM. A bocio in a case has been removed from the situation that made it and " +
      "generally from the person it was made for. It is displayed as sculpture. It was not sculpture.\n\n" +
      "THINGS TO ASK: If an object was made to act, what is left of it in a display case?",
    category: "religion",
    subcategory: "Power objects",
    eventType: "traditional_account",
    tags: ["vodun", "bocio", "ritual", "objects", "protection", "museum-object", "blier", "religion"],
    civilisations: ["Fon", "Aja"],
    locationName: "Southern Bénin and Togo",
    lat: 6.9,
    lng: 2.0,
    claims: [
      {
        sourceKey: "blier_african_vodun",
        startYear: 1995,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The publication of the major scholarly study of bocio",
        originalDateText: "1995",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: a book. Blier's study is where most of the careful description of these objects " +
          "in English comes from, and a reader should know that a great deal of what circulates about " +
          "bocio descends from one work.",
      },
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the making of bocio began",
        originalDateText: "Date unknown. Surviving examples are overwhelmingly nineteenth and twentieth century",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHY THE SURVIVING EXAMPLES SAY SO LITTLE ABOUT AGE: wood, cord and organic substances do not " +
          "survive long in this climate, and an object in use is maintained, added to and eventually " +
          "replaced. THE ABSENCE OF OLD EXAMPLES IS A FACT ABOUT MATERIALS, not about the practice.",
      },
    ],
    media: [
      {
        url: commons("Benin, regno del dahomey, fon, figura umana, 1900-50 ca.jpg"),
        sourcePageUrl: commonsPage("Benin, regno del dahomey, fon, figura umana, 1900-50 ca.jpg"),
        fileName: "Benin, regno del dahomey, fon, figura umana, 1900-50 ca.jpg",
        caption:
          "A Fon human figure from Bénin, dated in the museum record to roughly the first half of the twentieth century. The file's own dating — a fifty-year bracket — is typical for objects of this kind and shows how loosely they can be placed in time once out of use.",
        kind: "image",
        shows: "museum_specimen",
        objectDate: "c. 1900–1950",
        identificationStatus: "probable",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for whether this figure is a bocio specifically, for the holding " +
          "institution and for how it was acquired. It is attached here as an example of the CLASS of " +
          "object and the caption should not be read as identifying its function.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "asen-memory-in-iron",
    title: "Asen: biography, proverb and genealogy forged together",
    summary:
      "Iron memorial altars for the dead, carrying figures, emblems and proverbs specific to the person remembered. A sculpture and a memory system at once.",
    description:
      "WHAT AN ASEN IS. An iron staff or stand, driven into the ground or placed in a family shrine, made " +
      "to hold and receive the memory of a specific dead person. Offerings are made at it; the dead are " +
      "addressed through it.\n\n" +
      "WHAT MAKES IT UNUSUAL. Many asen carry FIGURES AND SCENES on a flat platform — people, animals, " +
      "objects, tools — chosen for the individual commemorated. They may refer to what the person did, an " +
      "episode from their life, a proverb they were known by, or their standing. So one object can hold, " +
      "at once: SCULPTURE, BIOGRAPHICAL MEMORY, A PROVERB, A CLAIM ABOUT GENEALOGY, and a RITUAL FUNCTION. " +
      "Almost nothing else in this dataset packs as much into a single artefact.\n\n" +
      "HOW THEY ARE READ. By people who hold the tradition. A figure is a reference; the reference needs " +
      "the story. An asen in a museum with no accompanying knowledge is a beautiful object that has lost " +
      "the thing it was made to carry.\n\n" +
      "THE HISTORY, WHICH IS NOT TIMELESS. Edna Bay's work traces asen as a tradition with a development: " +
      "roots related to Yoruba practice, adoption and transformation by the Dahomean court, elaboration in " +
      "the hands of the Hountondji smiths working in imported iron, brass and silver, spread from elite to " +
      "general use, and decline in the twentieth century as Christianity and PHOTOGRAPHY offered other " +
      "ways of holding the dead. THAT LAST POINT IS STRIKING: a photograph on a wall competes with an " +
      "asen for the same job.\n\n" +
      "THINGS TO ASK: What does a photograph do that an iron figure did? What does it not do?",
    category: "culture",
    subcategory: "Ancestral objects",
    eventType: "historical",
    tags: ["asen", "ancestors", "vodun", "hountondji", "metallurgy", "memory", "museum-object", "ouidah"],
    civilisations: ["Fon"],
    locationName: "Southern Bénin, particularly Ouidah and Abomey",
    lat: 6.9,
    lng: 2.1,
    claims: [
      {
        sourceKey: "bay_asen_ancestors_vodun",
        startYear: 1800,
        endYear: 1950,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period from which most surviving asen date, and across which the tradition changed",
        originalDateText: "Chiefly from the nineteenth century to the mid-twentieth",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "WHAT SUPPORTS IT: the dating of surviving examples in collections, and the documented history of " +
          "the tradition's elaboration and decline. WHY THE EARLY END IS SOFT: asen before the nineteenth " +
          "century are scarce, and scarcity of survivals is not a date of origin.",
      },
      {
        sourceKey: "bay_asen_ancestors_vodun",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the asen tradition began",
        originalDateText: "Not established; roots described as related to earlier Yoruba practice",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "WHAT IS PROPOSED: a derivation from earlier Yoruba-related practice, transformed at the " +
          "Dahomean court. WHY IT IS RECORDED AS UNRESOLVED: a proposed derivation is a historical " +
          "argument, not a dated origin, and the evidence for it is stylistic and comparative.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // PRACTICE: POSSESSION, INITIATION, SECRECY
  // -------------------------------------------------------------------------
  {
    slug: "possession-and-trance",
    title: "Possession: what is observed, what is claimed, and what is established",
    summary:
      "Devotees enter altered states in ritual accompanied by drumming and dance. This record keeps the observable event, the practitioner's account of it and its scientific status in three separate places.",
    description:
      "WHAT CAN BE OBSERVED, AND IS. Rhythmic drumming, specific to the power being addressed. Singing and " +
      "dancing, often for long periods. Then, in particular participants, a change: shaking, altered " +
      "posture and gait, changed facial expression, a loss of ordinary responsiveness, behaviour and speech " +
      "characteristic of the vodun concerned rather than of the person, and — commonly reported afterwards " +
      "— no memory of the episode. Attendants support the person. The episode ends and the person returns " +
      "to ordinary behaviour. ALL OF THAT IS WITNESSABLE, has been filmed and recorded many times, and is " +
      "not in dispute.\n\n" +
      "WHAT PRACTITIONERS SAY IS HAPPENING. That the vodun has arrived and is present through the devotee " +
      "— in the common formulation, that the power MOUNTS the initiate, who becomes its horse. The person " +
      "is not performing the vodun and is not pretending: they are, for that period, the means by which it " +
      "is present, and what is said may be addressed to the community as the vodun's speech.\n\n" +
      "WHAT THE SCIENTIFIC AND HISTORICAL STATUS IS. Supernatural causation is not empirically established. " +
      "The altered states themselves are real, well documented, and studied — rhythm, sustained movement, " +
      "expectation, training and the ritual setting are all understood to contribute. What is NOT " +
      "established, in either direction, is the practitioner's account of what the state consists of.\n\n" +
      "WHY ALL THREE ARE HERE. Because a record with only the first is a description of bodies and has " +
      "removed the meaning. A record with only the second asserts a religious claim as fact. A record with " +
      "only the third is a dismissal that teaches nothing. THE THREE DO NOT CONFLICT: they are answers to " +
      "different questions.\n\n" +
      "ONE THING THAT MUST NOT BE SAID. That possession is faked. That is a claim requiring evidence, the " +
      "evidence does not support it as a general account, and it is the standard colonial-era explanation.\n\n" +
      "THINGS TO ASK: What would you have to observe to decide between these accounts? Is there such an " +
      "observation?",
    category: "religion",
    subcategory: "Ritual practice",
    eventType: "traditional_account",
    tags: ["vodun", "possession", "trance", "ritual", "music", "dance", "method", "religion"],
    civilisations: ["Fon", "Aja", "Gun", "Yoruba"],
    locationName: "Southern Bénin",
    lat: 6.9,
    lng: 2.1,
    claims: [
      {
        sourceKey: "rouget_vodun_songs",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When possession practice began",
        originalDateText: "Date unknown; described by European observers from the seventeenth century onwards and documented systematically in the twentieth",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHAT DATES EXIST HERE ARE DATES OF DOCUMENTATION: early European descriptions, then " +
          "twentieth-century ethnography and ethnomusicology, including systematic recording of the music " +
          "and its relation to trance. None of them dates the practice.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether the practitioner's account of possession is correct",
        originalDateText: "Not empirically established, in either direction",
        datingMethod: "other",
        chronology: "scientific",
        evidence:
          "WHY THIS IS A CLAIM OF ITS OWN: because the interface should be able to show that the question " +
          "was asked and left open, rather than leaving a reader to assume the dataset has quietly taken " +
          "a side. The altered states are real and documented; the account of what they ARE is a religious " +
          "claim and is recorded as one.",
      },
    ],
    media: [
      {
        url: commons("Vodoun kouvito du Bénin la Danse du vodou shango du bénin, des pas de danse des adeptes du vodoun Mami et une demostration des kpodji 02.jpg"),
        sourcePageUrl: commonsPage("Vodoun kouvito du Bénin la Danse du vodou shango du bénin, des pas de danse des adeptes du vodoun Mami et une demostration des kpodji 02.jpg"),
        fileName: "Vodoun kouvito du Bénin la Danse du vodou shango du bénin, des pas de danse des adeptes du vodoun Mami et une demostration des kpodji 02.jpg",
        caption:
          "Devotees dancing at a Vodun ceremony in Bénin. The photograph records movement, dress and the occasion — the observable layer of this record. What is understood to be happening is described in the text, because a camera cannot record it.",
        kind: "image",
        shows: "site",
        identificationStatus: "probable",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes: "NEEDS SOURCE VERIFICATION for place, date and which ceremony is shown.",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "initiation-and-restricted-knowledge",
    title: "Initiation, and the levels of knowledge",
    summary:
      "Vodun knowledge is graded: some is public, some belongs to devotees, some to initiates, and some to specialists. What outsiders can record is structurally limited, and that limit is part of the subject.",
    description:
      "HOW KNOWLEDGE IS ORGANISED. Not as a single body available to anybody curious. In graded levels:\n\n" +
      "  PUBLIC — ceremonies held in the open, the existence of the vodun, the outward forms.\n" +
      "  DEVOTEE — what somebody who serves a particular power knows and does.\n" +
      "  INITIATE — obtained through initiation, which typically involves a period of seclusion, " +
      "instruction, ordeal and a changed status on emerging; often a new name, and obligations for life.\n" +
      "  SPECIALIST — priests, diviners, healers, makers of objects: long-trained and specific.\n" +
      "  RESTRICTED — held by particular offices and lineages and not transmitted outside them.\n\n" +
      "WHAT INITIATION INVOLVES, AS DOCUMENTED. Seclusion in a convent or initiation house for a period " +
      "that may run to months; learning songs, dances, language, prohibitions and the care of the power " +
      "served; and re-emergence into the community with a changed status. It is also expensive, which " +
      "makes it a social and economic fact as much as a religious one.\n\n" +
      "THE RULE THIS DATASET FOLLOWS, AND IT CUTS BOTH WAYS. SECRECY IS NOT EVIDENCE. The fact that " +
      "something is restricted does not make it remarkable, and a claim does not gain support from being " +
      "unavailable for checking. BUT THE ABSENCE OF OUTSIDER DOCUMENTATION IS NOT EVIDENCE EITHER: a " +
      "practice not described by ethnographers may simply be one that nobody told them about, and the " +
      "boundary of the written record is a boundary of access rather than of reality.\n\n" +
      "WHAT THAT MEANS FOR EVERY RECORD IN THIS LANE. What is documented is weighted towards what could be " +
      "seen from outside or what practitioners chose to make public. That is a systematic bias in the " +
      "sources, it is not correctable from here, and it should be assumed rather than forgotten.\n\n" +
      "THINGS TO ASK: If you can only see the public layer, what would you wrongly conclude about the " +
      "whole?",
    category: "religion",
    subcategory: "Initiation",
    eventType: "traditional_account",
    tags: ["vodun", "initiation", "secrecy", "oral-knowledge", "method", "ritual", "religion"],
    civilisations: ["Fon", "Aja", "Gun"],
    locationName: "Southern Bénin",
    lat: 6.9,
    lng: 2.1,
    claims: [
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When graded initiatory knowledge developed",
        originalDateText: "Date unknown; initiation is described by observers from the earliest accounts onwards",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHY NO DATE, AND WHY THIS ONE IS PARTICULARLY UNDATEABLE: restricted knowledge leaves the least " +
          "documentary trace of anything in this dataset, precisely because it is restricted. Its history " +
          "is the hardest to write and the easiest to speculate about.",
      },
    ],
  },

  {
    slug: "offerings-shrines-and-sacrifice",
    title: "Shrines, offerings and animal sacrifice",
    summary:
      "Vodun practice is material: shrines are built and maintained, and powers are fed — with drink, palm oil, food and animals. The blood and the meal are two aspects of one act.",
    description:
      "WHAT A SHRINE IS. A built and maintained place where a power is present and can be addressed: a " +
      "house, an enclosure, a figure at a threshold, a tree, a pot, a stone, a room in a compound. Shrines " +
      "require upkeep and they accumulate — the surfaces carry the residue of what has been poured and " +
      "placed on them over years, which is why shrine material is also, in principle, archaeological " +
      "material.\n\n" +
      "WHAT OFFERING MEANS. The powers are FED. Water, palm oil, maize flour, drink, kola, cooked food. And " +
      "animals — chickens, goats, and others — killed at the shrine.\n\n" +
      "HOW TO DESCRIBE ANIMAL SACRIFICE WITHOUT GETTING IT WRONG IN EITHER DIRECTION. It is not a " +
      "spectacle of cruelty, and it is not a metaphor. The animal is killed, the blood is directed to the " +
      "shrine, and in the normal case THE MEAT IS COOKED AND EATEN by the people present. The offering and " +
      "the meal are the same event. In a society where meat is not eaten daily, a sacrifice is also one of " +
      "the occasions on which a community eats together — and describing only the killing, as most outside " +
      "accounts do, removes the part that made it social.\n\n" +
      "WHAT THE ARCHAEOLOGY CAN ADD. Neil Norman's work on Huedan ritual before 1727 shows what this kind " +
      "of practice can leave behind — pots, deposits, cut features — which is the only line of evidence " +
      "about Vodun practice that comes neither from a European observer nor from a later tradition.\n\n" +
      "THINGS TO ASK: What is the difference between an offering and a meal? Does the tradition draw that " +
      "line where you would?",
    category: "religion",
    subcategory: "Ritual practice",
    eventType: "traditional_account",
    tags: ["vodun", "shrines", "offerings", "sacrifice", "ritual", "archaeology", "religion"],
    civilisations: ["Fon", "Aja", "Hueda", "Gun"],
    locationName: "Southern Bénin",
    lat: 6.8,
    lng: 2.1,
    imageUrl: commons("Vodun Voodoo Shrine - Abomey - Benin - 01.jpg"),
    claims: [
      {
        sourceKey: "norman_huedan_vodun",
        startYear: 1650,
        endYear: 1727,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "archaeological_date",
        whatIsDated: "The Huedan ritual practice recovered archaeologically",
        originalDateText: "ca. 1650–1727, before the Dahomean conquest",
        datingMethod: "archaeological",
        chronology: "archaeological",
        evidence:
          "WHY THIS IS THE MOST VALUABLE DATE IN THE VODUN LANE AFTER 1658: it is MATERIAL evidence of " +
          "ritual practice, at a place, in a dated range, independent of both European description and " +
          "later oral tradition. WHAT IT DOES NOT DO: date Vodun. It dates deposits in the Hueda kingdom " +
          "in the century before its conquest.",
        notes: "NEEDS SOURCE VERIFICATION for the sites, the deposits and the basis of the interpretation.",
      },
    ],
    media: [
      {
        url: commons("Vodun Voodoo Shrine - Abomey - Benin - 01.jpg"),
        sourcePageUrl: commonsPage("Vodun Voodoo Shrine - Abomey - Benin - 01.jpg"),
        fileName: "Vodun Voodoo Shrine - Abomey - Benin - 01.jpg",
        caption:
          "A Vodun shrine at Abomey. The accumulated surfaces are the record of repeated offering — which is what makes a shrine, in principle, an archaeological deposit as well as a religious place.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Vodun shrine in Grand Popo Benin.jpg"),
        sourcePageUrl: commonsPage("Vodun shrine in Grand Popo Benin.jpg"),
        fileName: "Vodun shrine in Grand Popo Benin.jpg",
        caption:
          "A Vodun shrine at Grand-Popo on the coast. Shrines differ between communities and powers; a single photograph shows one shrine and should not be read as showing what a shrine looks like.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Vodun altar in Heve, Grand-Popo, Benin.jpg"),
        sourcePageUrl: commonsPage("Vodun altar in Heve, Grand-Popo, Benin.jpg"),
        fileName: "Vodun altar in Heve, Grand-Popo, Benin.jpg",
        caption:
          "A Vodun altar at Hévé, Grand-Popo. The named location matters: recording where a photograph of a shrine was taken is what distinguishes evidence about a particular community from a generic illustration.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // THE SERPENT AT OUIDAH
  // -------------------------------------------------------------------------
  {
    slug: "bosman-describes-the-serpent-at-whydah",
    title: "Before 1704: Bosman describes serpent veneration at Whydah",
    summary:
      "The Dutch factor Willem Bosman describes the serpent as a divinity at Whydah, with a house, offerings, annual royal pilgrimage and penalties for disrespect. It is the earliest substantial account.",
    description:
      "WHAT BOSMAN RECORDS. Writing at the end of the seventeenth century and published in Dutch in 1704, " +
      "Willem Bosman — a Dutch West India Company factor — describes the serpent at Whydah as holding the " +
      "rank of a divinity. He describes the HOUSE OF THE SERPENT; the offerings brought to it; the annual " +
      "pilgrimage made to it by the kings of Fida; and the punishments meted out to Europeans or Africans " +
      "who failed to show it due respect.\n\n" +
      "WHY THIS IS THE MOST IMPORTANT RECORD IN THE PYTHON SEQUENCE. Because of its DATE. The traditional " +
      "foundation story of the temple at Ouidah is usually attached to 1717 — a defeated Hueda king " +
      "sheltered by pythons, who then built for them. BOSMAN'S DESCRIPTION IS EARLIER. A serpent cult with " +
      "a house, a priesthood, offerings and a royal annual pilgrimage was in place at Whydah before the " +
      "events the foundation story describes.\n\n" +
      "WHAT THAT DOES AND DOES NOT ESTABLISH. It does NOT prove the tradition false: a story may explain " +
      "the founding of a particular temple building rather than the origin of the cult, and traditions " +
      "often attach an old practice to a memorable later event. WHAT IT DOES ESTABLISH is that the " +
      "veneration is older than the story usually told to account for it, which is worth knowing before " +
      "reading either.\n\n" +
      "BOSMAN'S VIEWPOINT. A Protestant trader describing what he considers idolatry, for a European " +
      "readership, in a book partly about commercial opportunity. He is hostile, he is detailed, and he " +
      "was there.\n\n" +
      "THINGS TO ASK: When a foundation story is younger than the thing it explains, what is the story " +
      "for?",
    category: "religion",
    subcategory: "Serpent traditions",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["vodun", "dangbe", "serpent", "ouidah", "hueda", "european-encounter", "primary-source", "sacred-animals"],
    people: ["Willem Bosman"],
    civilisations: ["Hueda"],
    locationName: "Whydah (Ouidah), southern Bénin",
    lat: 6.36,
    lng: 2.09,
    claims: [
      {
        sourceKey: "bosman_guinea_1704",
        startYear: 1704,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The publication of Bosman's description of serpent veneration at Whydah",
        originalDateText: "Published 1704, describing observations from the preceding years",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: A BOOK. Bosman's observations are from his years on the coast in the 1690s, so " +
          "the practice he describes is earlier still than his publication date — which makes the gap with " +
          "the 1717 foundation story wider rather than narrower.",
      },
      {
        sourceKey: "bosman_guinea_1704",
        startYear: 1690,
        endYear: 1702,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period of the observations behind the description",
        originalDateText: "Bosman's years on the Guinea coast, in the 1690s and around 1700",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY A SECOND CLAIM: because the date of an observation and the date of its publication are " +
          "different facts, and in this case the difference is the whole point — it pushes the attested " +
          "serpent cult further back before the traditional foundation date.",
        notes: "NEEDS SOURCE VERIFICATION for the exact years of Bosman's residence.",
      },
    ],
    media: [
      {
        url: commons("Le Temple des Pythons à Ouidah.jpg"),
        sourcePageUrl: commonsPage("Le Temple des Pythons à Ouidah.jpg"),
        fileName: "Le Temple des Pythons à Ouidah.jpg",
        caption:
          "The python temple at Ouidah today. Bosman described a house of the serpent here at the end of the seventeenth century; what stands now is a much later building on a tradition his account already found established.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "temple-of-pythons-1717-tradition",
    title: "The 1717 tradition of the temple's founding",
    summary:
      "A widely told story has a defeated Hueda king sheltered in the forest by pythons, and building for them in gratitude. It is attached to 1717 and it post-dates Bosman's description.",
    description:
      "THE STORY. During warfare between Danxome and Hueda, the defeated king of Ouidah takes refuge in the " +
      "forest from pursuing warriors and is sheltered — in the tellings, by pythons. In gratitude he " +
      "establishes for his protectors: huts in the forest, and a place in the town. The date usually " +
      "attached is 1717.\n\n" +
      "WHY IT IS RECORDED HERE AS A TRADITION. Because that is what it is: a foundation account, told " +
      "about a sacred place, attributing its origin to a rescue. No contemporary document is offered for " +
      "it in the material reachable here.\n\n" +
      "THE CHRONOLOGICAL PROBLEM, WHICH IS REAL. Bosman describes a serpent cult at Whydah with a house, " +
      "offerings and an annual royal pilgrimage, and his book was published in 1704 from observations of " +
      "the 1690s. THAT IS TWENTY YEARS OR MORE BEFORE 1717. Whatever happened in 1717, it was not the " +
      "beginning of serpent veneration at Ouidah.\n\n" +
      "HOW THE TWO CAN BOTH BE TRUE. If the story describes the founding of a PARTICULAR SHRINE or the " +
      "re-establishment of one after a war, rather than the origin of the cult. That is an ordinary shape " +
      "for a foundation tradition and it fits the evidence better than either rejecting the story or " +
      "accepting it as an origin.\n\n" +
      "THE DATE ITSELF. 1717 sits in the period of Dahomean pressure on Hueda that ended in the conquest " +
      "of 1727, so it is at least plausible as a moment of warfare and flight. Whether the specific year " +
      "comes from a remembered event or from later attachment to a known period of war is not established.\n\n" +
      "THINGS TO ASK: What is the difference between the founding of a temple and the beginning of a " +
      "religion?",
    category: "religion",
    subcategory: "Serpent traditions",
    eventType: "traditional_account",
    identificationStatus: "disputed",
    tags: ["vodun", "dangbe", "serpent", "ouidah", "hueda", "oral-knowledge", "tradition", "sacred-animals"],
    civilisations: ["Hueda"],
    locationName: "Ouidah, southern Bénin",
    lat: 6.36,
    lng: 2.09,
    claims: [
      {
        sourceKey: "vodun_practitioner_tradition",
        startYear: 1717,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "traditional_date",
        whatIsDated: "The founding of the temple, as the tradition places it",
        originalDateText: "1717, following a war between Danxome and Hueda",
        datingMethod: "oral_tradition",
        chronology: "oral_tradition",
        evidence:
          "WHAT THIS DATE RESTS ON: tradition, attached to a period of warfare that is itself historically " +
          "real. WHAT CONTRADICTS IT AS AN ORIGIN: Bosman's earlier description of an established cult. " +
          "WHY BOTH ARE KEPT: because the tradition may be dating a building and the description may be " +
          "recording a practice, and those are compatible.",
        notes:
          "NEEDS SOURCE VERIFICATION for the earliest recorded version of this story, which would show " +
          "whether 1717 is a remembered date or a later attachment. That is the single most useful missing " +
          "fact here.",
      },
    ],
  },

  {
    slug: "temple-of-pythons-today",
    title: "The Temple of Pythons, Ouidah",
    summary:
      "An active religious site with living royal pythons, visited by pilgrims and tourists, in the middle of a town whose other landmark is a Catholic basilica facing it across the road.",
    description:
      "WHAT IS THERE. A temple in the centre of Ouidah housing royal pythons, with priests and custodians, " +
      "receiving both religious visitors and a steady flow of tourists. The snakes are handled, are " +
      "periodically released into the town, and are returned when found — a python found in a house in " +
      "Ouidah is not killed.\n\n" +
      "THE TABOO AND WHAT IT DOES. The prohibition on killing or harming the python is the practical core " +
      "of the tradition, and it is observable: it produces a town in which a large snake can move through " +
      "domestic space and be carried back rather than destroyed. Bosman records penalties for disrespect " +
      "to the serpent three centuries ago, which makes this one of the longest continuously documented " +
      "religious observances in the dataset.\n\n" +
      "WHAT IS DOCUMENTED ACROSS TIME. European written descriptions from the seventeenth century; " +
      "nineteenth-century illustrations, including a published view of the Temple of Dangbè in 1891; early " +
      "photography; and the modern site. THE SAME TRADITION, THROUGH FOUR SUCCESSIVE KINDS OF EVIDENCE — " +
      "which is unusual and is what makes it valuable to a timeline that cares about how things are known.\n\n" +
      "THE TOURISM QUESTION, ASKED HONESTLY. The temple is a major visitor attraction and is presented for " +
      "visitors. That is not evidence that the religion is a performance: a site can be both an active " +
      "shrine and a managed attraction, as cathedrals are. But photographs and accounts from visitors are " +
      "shaped by what visitors are shown, and that belongs in the reading of them.\n\n" +
      "THINGS TO ASK: What changes about a religious site when people buy tickets to it? What does not?",
    category: "religion",
    subcategory: "Serpent traditions",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["vodun", "dangbe", "serpent", "ouidah", "sacred-animals", "heritage", "tourism", "continuity"],
    civilisations: ["Hueda", "Fon"],
    locationName: "Temple of Pythons, Ouidah, southern Bénin",
    lat: 6.3625,
    lng: 2.0853,
    imageUrl: commons("Le Temple des Pythons de Ouidah.jpg"),
    claims: [
      {
        sourceKey: "bosman_guinea_1704",
        startYear: 1690,
        isOngoing: true,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "Documented serpent veneration at Ouidah, from the earliest description to the present",
        originalDateText: "From Bosman's observations in the 1690s to the present day",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT THIS CLAIM ASSERTS: continuity of DOCUMENTATION across more than three centuries — which " +
          "is a strong claim and a checkable one. WHAT IT DOES NOT ASSERT: that the practice was unchanged " +
          "across that time. A tradition surviving conquest, colonial rule, missionary pressure and mass " +
          "tourism has been changed by all of them.",
      },
    ],
    media: [
      {
        url: commons("Le Temple des Pythons de Ouidah.jpg"),
        sourcePageUrl: commonsPage("Le Temple des Pythons de Ouidah.jpg"),
        fileName: "Le Temple des Pythons de Ouidah.jpg",
        caption:
          "The Temple of Pythons at Ouidah. A modern photograph of an active religious site that is also a major visitor attraction — the building is presented to visitors, and what a camera is shown there is part of that presentation.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Entrée du Temple des Pythons (Ouidah).jpg"),
        sourcePageUrl: commonsPage("Entrée du Temple des Pythons (Ouidah).jpg"),
        fileName: "Entrée du Temple des Pythons (Ouidah).jpg",
        caption:
          "The entrance to the Temple of Pythons at Ouidah. The threshold of a shrine is where Legba stands in this religion, and where a visitor's access is decided — both of which make an entrance worth photographing in its own right.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Le Temple des Pythons à Ouidah.jpg"),
        sourcePageUrl: commonsPage("Le Temple des Pythons à Ouidah.jpg"),
        fileName: "Le Temple des Pythons à Ouidah.jpg",
        caption:
          "Another view of the Temple of Pythons. Three modern photographs of one site show the place from three angles; none of them is evidence about the tradition's age, which is what the written record is for.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "temple-and-basilica-face-each-other",
    title: "The temple and the basilica, facing each other",
    summary:
      "In Ouidah the python temple and the Catholic basilica stand opposite one another across a road. Two religious histories of the same town, in the same square, both active.",
    description:
      "WHAT IS ACTUALLY THERE. The Temple of Pythons and the Basilica of the Immaculate Conception stand " +
      "close together in central Ouidah, facing each other. Both are in use. People attend both — and in " +
      "many cases the same people attend both, which is the part that most surprises visitors expecting " +
      "the two to be in competition.\n\n" +
      "WHY THE ARRANGEMENT IS HISTORICALLY LEGIBLE. Ouidah is the place where an African religious centre, " +
      "an African kingdom, European trading forts, Catholic missions and the Atlantic slave trade all " +
      "occupied the same few square kilometres for two centuries. The mission was built where the " +
      "congregation and the trade were — which is where the shrine already was. The facing buildings are " +
      "not an irony; they are the town's history in plan.\n\n" +
      "WHAT IT SHOWS ABOUT RELIGIOUS CHANGE HERE. Not replacement. Conversion in this region has " +
      "frequently meant ADDITION rather than substitution: Catholic practice alongside Vodun obligation, " +
      "with the same family maintaining both, and with the balance differing between individuals and " +
      "occasions. Accounts that treat the arrival of Christianity as the displacement of Vodun are " +
      "describing something that did not happen.\n\n" +
      "THE DATES. The temple's institutional history runs back at least to the seventeenth-century " +
      "descriptions; the basilica is a twentieth-century building on a mission presence that is older. " +
      "Precise construction dates for the basilica could not be verified here and none is asserted.\n\n" +
      "THINGS TO ASK: Why do we expect two religions in one street to be in conflict?",
    category: "religion",
    subcategory: "Religious landscape",
    eventType: "historical",
    tags: ["vodun", "ouidah", "christianity", "missionaries", "serpent", "religion", "heritage", "coexistence"],
    civilisations: ["Hueda", "Fon"],
    locationName: "Ouidah, southern Bénin",
    lat: 6.3625,
    lng: 2.0853,
    claims: [
      {
        sourceKey: null,
        startYear: 1900,
        isOngoing: true,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period in which both buildings have stood facing each other in use",
        originalDateText: "The twentieth century to the present; the basilica's construction date is not verified here",
        datingMethod: "estimate",
        chronology: "historical",
        evidence:
          "WHY THIS RANGE IS DELIBERATELY VAGUE: because the basilica's dates could not be checked from " +
          "here, and a specific year would be invented. WHAT IS NOT VAGUE: that both buildings stand " +
          "there now and both are in use.",
        notes:
          "NEEDS SOURCE VERIFICATION for the foundation and construction dates of the Catholic mission and " +
          "the basilica at Ouidah, which would turn this into a properly dated record.",
      },
    ],
    media: [
      {
        url: commons("La chapelle de la Basilique de l'Immaculée-Conception de Ouidah au Bénin.jpg"),
        sourcePageUrl: commonsPage("La chapelle de la Basilique de l'Immaculée-Conception de Ouidah au Bénin.jpg"),
        fileName: "La chapelle de la Basilique de l'Immaculée-Conception de Ouidah au Bénin.jpg",
        caption:
          "The chapel of the Basilica of the Immaculate Conception at Ouidah. The building stands opposite the Temple of Pythons; a photograph of one of them is a photograph of half of this record.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Le Temple des Pythons de Ouidah.jpg"),
        sourcePageUrl: commonsPage("Le Temple des Pythons de Ouidah.jpg"),
        fileName: "Le Temple des Pythons de Ouidah.jpg",
        caption:
          "The Temple of Pythons — the other half of the pair. The basilica stands opposite it across the road, and both are in use, frequently by the same families.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // MASQUERADE: ZANGBETO, GÈLÈDÉ, EGUNGUN
  // -------------------------------------------------------------------------
  {
    slug: "zangbeto",
    title: "Zangbeto: the night watchmen",
    summary:
      "A Gun/Ogu institution of night guardianship, appearing as tall spinning raffia masquerades. It polices, mediates and judges — and its knowledge is restricted to its initiates.",
    description:
      "THE NAME. ZANGBETO, in Gun: from zan, night, and gbeto, person — the people or men of the night, the " +
      "night watchmen. The institution belongs to the OGU (Gun, Egun) communities of the coast around " +
      "Porto-Novo and Badagry, and it is a cultural emblem of that people specifically. IT IS NOT SIMPLY " +
      "'FON VODUN' and relabelling it as such loses its whole context.\n\n" +
      "WHAT IT DOES. Community security and order: patrolling at night, deterring and denouncing " +
      "wrongdoing, mediating disputes, and acting as a custodian of Ogu values. It is, in plain terms, a " +
      "policing and judicial institution that is also a religious one — and it operated long before, and " +
      "alongside, any colonial or national police force.\n\n" +
      "WHAT IS OBSERVED. A tall conical or dome-shaped structure of raffia or straw fibres, sometimes " +
      "dyed in strong colours, sometimes topped with a mask or horns, which moves, sways and SPINS " +
      "rapidly. In public displays it is shown to be empty, or to contain something unexpected, and this " +
      "revelation is part of the performance.\n\n" +
      "WHAT THE TRADITION HOLDS. That the Zangbeto is the manifestation of a guardian spirit of the night, " +
      "not a person in a costume — and the demonstration that nothing is inside is the tradition's own " +
      "assertion of this.\n\n" +
      "HOW THIS DATASET HANDLES THAT. It records the observable event — a large raffia structure moves and " +
      "spins, and is shown to be empty before onlookers — and the traditional interpretation — that a " +
      "guardian power is present — as two separate statements. It does not assert the second as fact and " +
      "does not explain the first away. WHAT THE DEMONSTRATION ESTABLISHES is what a demonstration " +
      "establishes: that onlookers see what they are shown.\n\n" +
      "THE RESTRICTED PART. Membership is initiated and the society's internal knowledge is not public. " +
      "What outsiders describe is the public face.\n\n" +
      "THINGS TO ASK: What is a masquerade for, in a society that has one? What does it let a community " +
      "do that nothing else does?",
    category: "culture",
    subcategory: "Masquerade",
    eventType: "traditional_account",
    tags: ["zangbeto", "gun", "ogu", "masquerade", "porto-novo", "initiation", "justice", "ritual"],
    civilisations: ["Gun"],
    locationName: "Porto-Novo and the Ogu coast, southern Bénin",
    lat: 6.5,
    lng: 2.62,
    imageUrl: commons("Le Zangbéto une culture du Bénin.jpg"),
    claims: [
      {
        sourceKey: "wikipedia_vodun_navigation",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the Zangbeto institution began",
        originalDateText: "Date unknown. Described as pre-colonial in origin among the Ogu",
        datingMethod: "oral_tradition",
        chronology: "traditional",
        evidence:
          "WHAT IS SAID: that it is pre-colonial and originates among the Ogu of this coast. WHY NO DATE: " +
          "'pre-colonial' is a boundary, not a date, and no earlier documentation was found here. NEEDS " +
          "BETTER SOURCING: the earliest European or missionary description of a Zangbeto performance " +
          "would give a latest-by date and would substantially improve this record.",
      },
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "What is present inside the moving structure",
        originalDateText: "Tradition holds that a guardian spirit is manifest, not a person",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "OBSERVABLE: a large raffia structure moves, spins and is displayed to onlookers as empty. " +
          "TRADITIONAL INTERPRETATION: a guardian power of the night is present. STATUS: the second is a " +
          "religious claim, recorded as one, and this dataset neither asserts nor debunks it. THE " +
          "DEMONSTRATION IS PART OF THE TRADITION rather than an independent test of it, and treating it " +
          "as proof in either direction would misunderstand what is being done.",
      },
    ],
    media: [
      {
        url: commons("Le Zangbéto une culture du Bénin.jpg"),
        sourcePageUrl: commonsPage("Le Zangbéto une culture du Bénin.jpg"),
        fileName: "Le Zangbéto une culture du Bénin.jpg",
        caption:
          "A Zangbeto in Bénin. The photograph records the raffia structure, its colours and its setting — the observable layer. It cannot record the movement that is central to a performance, and it cannot record what is understood to be present.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Zangbeto Masquerade 01.jpg"),
        sourcePageUrl: commonsPage("Zangbeto Masquerade 01.jpg"),
        fileName: "Zangbeto Masquerade 01.jpg",
        caption:
          "A Zangbeto masquerade. The institution runs across the Ogu communities of this coast and into Badagry in Nigeria, so photographs of it are not all from one country — a reminder that the tradition is older than the border it now crosses.",
        kind: "image",
        shows: "site",
        identificationStatus: "probable",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes: "NEEDS SOURCE VERIFICATION for place and date.",
        creditFrom: "source",
      },
      {
        url: commons("Kpakliyaho - Masque spécial de Zangbéto au Bénin.jpg"),
        sourcePageUrl: commonsPage("Kpakliyaho - Masque spécial de Zangbéto au Bénin.jpg"),
        fileName: "Kpakliyaho - Masque spécial de Zangbéto au Bénin.jpg",
        caption:
          "Kpakliyaho, described as a special Zangbeto mask in Bénin. Named variants within the institution show that 'Zangbeto' is a category containing distinct figures rather than a single costume.",
        kind: "image",
        shows: "site",
        identificationStatus: "probable",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Zangbeto Masquerade performance at the 2025 ogu - weme annual festival 2.jpg"),
        sourcePageUrl: commonsPage("Zangbeto Masquerade performance at the 2025 ogu - weme annual festival 2.jpg"),
        fileName: "Zangbeto Masquerade performance at the 2025 ogu - weme annual festival 2.jpg",
        caption:
          "A Zangbeto performance at the Ogu-Wémé annual festival in 2025. A dated photograph of a living institution — which is the kind of evidence that will matter most to somebody reading this record in fifty years.",
        kind: "image",
        shows: "site",
        imageDate: "2025",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "gelede",
    title: "Gèlèdé: masks, satire and the power of the mothers",
    summary:
      "A Yoruba-Nago masked tradition of southern Bénin, south-western Nigeria and Togo, honouring female spiritual power and using satire as social criticism. Its songs carry history.",
    description:
      "WHOSE TRADITION IT IS. Yoruba-Nago communities across what is now south-western Nigeria, southern " +
      "Bénin and Togo. LIKE ZANGBETO, IT IS NOT FON VODUN and must not be filed as such — this is a " +
      "different people's institution in the same country.\n\n" +
      "WHAT IT HONOURS. The spiritual power of women — of mothers, elderly women and ancestors, and of the " +
      "primordial mother figure often named Iyà Nlà. The power is understood as real and considerable, " +
      "capable of great benefit and great harm, and Gèlèdé is directed at honouring it and keeping it " +
      "well-disposed.\n\n" +
      "WHAT HAPPENS. Masked dancers — in this tradition, men wearing masks representing women and much " +
      "else — perform with elaborate carved headdresses, in pairs, to drumming and song. Ceremonies " +
      "follow the harvest and are also held in drought, epidemic or other crisis: the tradition is " +
      "deployed when a community is in trouble.\n\n" +
      "THE SATIRE, WHICH IS THE PART OUTSIDERS MISS. Gèlèdé is funny, and the humour has a job. Masks and " +
      "performances mock: the greedy, the pompous, the adulterous, the hypocritical, the colonial " +
      "official, the modern nuisance. A LICENSED PUBLIC CRITICISM OF BEHAVIOUR, PERFORMED BY THE WHOLE " +
      "COMMUNITY FOR THE WHOLE COMMUNITY, is a form of social regulation, and an institution that can say " +
      "in a mask what cannot be said in a street is doing serious political work.\n\n" +
      "THE SONGS. UNESCO's description records that the songs preserve Yoruba-Nago history and mythology — " +
      "so this is also an oral archive, alongside Fa and the royal praise systems, carrying content in " +
      "performance.\n\n" +
      "WOMEN'S ROLE IN RUNNING IT. The society has women in governing positions, which is worth stating " +
      "plainly given how often masking traditions are described as exclusively male affairs.\n\n" +
      "THINGS TO ASK: What can be said in a mask that cannot be said without one?",
    category: "culture",
    subcategory: "Masquerade",
    eventType: "traditional_account",
    evidenceStatus: "strongly_documented",
    tags: ["gelede", "yoruba", "nago", "masquerade", "women-and-power", "satire", "oral-knowledge", "unesco"],
    civilisations: ["Yoruba", "Nago"],
    locationName: "Yoruba-Nago communities of Bénin, Nigeria and Togo",
    lat: 7.2,
    lng: 2.6,
    imageUrl: commons("Benin, yoruba, maschera geledé, 02.JPG"),
    claims: [
      {
        sourceKey: "unesco_ich_gelede",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When Gèlèdé began",
        originalDateText: "Origins uncertain; the tradition is established well before the twentieth century",
        datingMethod: "oral_tradition",
        chronology: "traditional",
        evidence:
          "WHY NO DATE: the tradition's own accounts of its origin are not chronological, and no " +
          "documentary or archaeological date was found here. Masks in collections date from the " +
          "nineteenth century onwards, which dates the objects rather than the institution.",
        notes:
          "NEEDS SOURCE VERIFICATION for the earliest documented Gèlèdé performance and for the dating of " +
          "the earliest masks in museum collections.",
      },
      {
        sourceKey: "unesco_ich_gelede",
        startYear: 2001,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The UNESCO proclamation of the oral heritage of Gelede as a Masterpiece",
        originalDateText: "2001",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "AN ADMINISTRATIVE FACT WITH A DOCUMENT BEHIND IT. It records international recognition; it says " +
          "nothing about the tradition's age or its condition, and recognition is not preservation.",
      },
      {
        sourceKey: "unesco_ich_gelede",
        startYear: 2008,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Inscription on the Representative List of the Intangible Cultural Heritage of Humanity",
        originalDateText: "2008",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY TWO DATES RATHER THAN ONE: the 2001 Masterpiece proclamation and the 2008 inscription are " +
          "different acts under different instruments, and the elements proclaimed in the earlier " +
          "programme were transferred to the Representative List when the 2003 Convention came into " +
          "force. Collapsing them would lose a real piece of institutional history.",
      },
    ],
    media: [
      {
        url: commons("Benin, yoruba, maschera geledé, 02.JPG"),
        sourcePageUrl: commonsPage("Benin, yoruba, maschera geledé, 02.JPG"),
        fileName: "Benin, yoruba, maschera geledé, 02.JPG",
        caption:
          "A Yoruba Gèlèdé mask from Bénin, photographed in a collection. A mask on a stand is an object; in use it is worn above the face by a dancer moving to drums in a crowd, and the difference is most of what the tradition is.",
        kind: "image",
        shows: "museum_specimen",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Benin, kifouli dossou, maschere gueledé, 01.JPG"),
        sourcePageUrl: commonsPage("Benin, kifouli dossou, maschere gueledé, 01.JPG"),
        fileName: "Benin, kifouli dossou, maschere gueledé, 01.JPG",
        caption:
          "Gèlèdé masks by Kifouli Dossou of Bénin. A NAMED LIVING CARVER, which is rare in the display of West African masks and matters: these are not anonymous ethnographic specimens but the work of an artist who can be asked what he made and why.",
        kind: "image",
        shows: "artefact",
        creator: "Kifouli Dossou",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Gelede mask, Yoruba people, southwest Nigeria or Benin, wood, view 2 - Naturhistorisches Museum Nürnberg - Nuremberg, Germany - DSC03980.jpg"),
        sourcePageUrl: commonsPage("Gelede mask, Yoruba people, southwest Nigeria or Benin, wood, view 2 - Naturhistorisches Museum Nürnberg - Nuremberg, Germany - DSC03980.jpg"),
        fileName: "Gelede mask, Yoruba people, southwest Nigeria or Benin, wood, view 2 - Naturhistorisches Museum Nürnberg - Nuremberg, Germany - DSC03980.jpg",
        caption:
          "A Gèlèdé mask in a German museum, catalogued as Yoruba from south-western Nigeria or Bénin. The uncertainty in that catalogue entry is itself informative: the tradition crosses a border, and an object removed from its community often cannot be placed on either side of it.",
        kind: "image",
        shows: "museum_specimen",
        institution: "Naturhistorisches Museum Nürnberg",
        identificationStatus: "probable",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes:
          "The museum's own record does not resolve which country the mask came from, which limits what " +
          "it can be evidence for.",
        creditFrom: "source",
      },
      {
        url: commons("Mask, Yoruba peoples, Benin (Dahomey), collected 1966, wood - Hood Museum of Art - DSC09176.JPG"),
        sourcePageUrl: commonsPage("Mask, Yoruba peoples, Benin (Dahomey), collected 1966, wood - Hood Museum of Art - DSC09176.JPG"),
        fileName: "Mask, Yoruba peoples, Benin (Dahomey), collected 1966, wood - Hood Museum of Art - DSC09176.JPG",
        caption:
          "A Yoruba mask from Bénin, recorded by the museum as collected in 1966. THE COLLECTION DATE IS THE ONLY FIRM DATE ON MOST OBJECTS OF THIS KIND: it says when the mask left the community, not when it was carved or how long the tradition behind it had been running.",
        kind: "image",
        shows: "museum_specimen",
        institution: "Hood Museum of Art",
        objectDate: "Collected 1966",
        identificationStatus: "probable",
        provenanceNotes:
          "Catalogued as a Yoruba mask rather than specifically as Gèlèdé. NEEDS SOURCE VERIFICATION before it is read as one.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "egungun-in-benin",
    title: "Egungun: the dead in the street",
    summary:
      "A Yoruba-derived masquerade in which ancestors return in elaborate whirling cloth costumes. Active in Porto-Novo and across southern Bénin, and dangerous to approach.",
    description:
      "WHAT IS SEEN. A figure entirely covered in panels of cloth — often lavish, layered, and made to fly " +
      "outward when the wearer spins — moving through a street or compound, accompanied by attendants " +
      "carrying switches who keep spectators back. No part of a body is visible.\n\n" +
      "WHAT THE TRADITION HOLDS. That the ancestor has returned and is present. The costume is not a " +
      "representation of the dead; the dead are there, and contact with the cloth carries danger, which is " +
      "why the attendants clear the way.\n\n" +
      "WHERE IT SITS. Egungun is Yoruba in origin and is practised in southern Bénin — Porto-Novo " +
      "especially, in named compounds and convents — alongside Fon and Gun traditions. It is one of the " +
      "clearest demonstrations that the religious landscape of this country is not one system: a person " +
      "in Porto-Novo may live within reach of Egungun, Zangbeto, Vodun and Catholicism, and these are not " +
      "the same thing.\n\n" +
      "WHAT IT SHARES WITH THE REST OF THIS LANE. Ancestors at the centre; initiation and restricted " +
      "knowledge; a performance whose public face is what outsiders get; and a costume that is a physical " +
      "object anybody can photograph, attached to a claim that no photograph can address.\n\n" +
      "THINGS TO ASK: Why would a tradition make the returning dead untouchable?",
    category: "culture",
    subcategory: "Masquerade",
    eventType: "traditional_account",
    tags: ["egungun", "yoruba", "ancestors", "masquerade", "porto-novo", "ritual", "initiation"],
    civilisations: ["Yoruba", "Gun"],
    locationName: "Porto-Novo and southern Bénin",
    lat: 6.5,
    lng: 2.62,
    claims: [
      {
        sourceKey: "vodun_practitioner_tradition",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When Egungun practice began in this region",
        originalDateText: "Date unknown; Yoruba in origin, established in southern Bénin before the colonial period",
        datingMethod: "other",
        chronology: "traditional",
        evidence:
          "WHAT CAN BE SAID: the tradition is Yoruba in origin and its presence in southern Bénin reflects " +
          "the long movement of people, cults and captives between the Yoruba and Gbe-speaking worlds. " +
          "WHAT CANNOT: when it arrived. NEEDS BETTER SOURCING for the earliest documentation in Bénin " +
          "specifically.",
      },
    ],
    media: [
      {
        url: commons("Cérémonie Egungun du couvent Odjourongbé à Porto-Novo 08.jpg"),
        sourcePageUrl: commonsPage("Cérémonie Egungun du couvent Odjourongbé à Porto-Novo 08.jpg"),
        fileName: "Cérémonie Egungun du couvent Odjourongbé à Porto-Novo 08.jpg",
        caption:
          "An Egungun ceremony of the Odjourongbé convent at Porto-Novo. The named convent and named city are what make this a document rather than an illustration: it records a particular community's ceremony, not 'an African masquerade'.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
      {
        url: commons("Benin- Egungun masquerade.jpg"),
        sourcePageUrl: commonsPage("Benin- Egungun masquerade.jpg"),
        fileName: "Benin- Egungun masquerade.jpg",
        caption:
          "An Egungun masquerade in Bénin. The layered cloth is built to move: a still photograph shows the construction and loses the spinning that is the point of it.",
        kind: "image",
        shows: "site",
        identificationStatus: "probable",
        provenanceStatus: "resolved_at_seed",
        provenanceNotes: "NEEDS SOURCE VERIFICATION for place and date.",
        creditFrom: "source",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // VODUN AND POWER: KINGDOM, COLONY, REPUBLIC
  // -------------------------------------------------------------------------
  {
    slug: "conquest-absorbs-cults",
    title: "Conquest did not destroy the religion of the conquered",
    summary:
      "When Dahomey took Allada in 1724 and Hueda in 1727 it acquired their religious institutions as well as their territory. Cults of the defeated were absorbed rather than suppressed.",
    description:
      "THE PATTERN. Dahomey's expansion brought under its authority peoples with their own vodun, " +
      "priesthoods and shrines — Allada in 1724, Hueda in 1727, and many smaller conquests after. The " +
      "documented pattern is not eradication. Religious powers of conquered populations were " +
      "INCORPORATED: brought into the Dahomean religious world, sometimes physically relocated, sometimes " +
      "served by the court itself.\n\n" +
      "WHY A CONQUEROR WOULD DO THAT. Because a vodun is understood as a real power attached to a place " +
      "and a people, and a power that has just been defeated is not thereby unreal. Taking a territory " +
      "means taking on its powers, and offending them is dangerous. Absorption is the prudent policy and " +
      "it is also, incidentally, effective politics: honouring a conquered people's vodun is a way of " +
      "governing them.\n\n" +
      "THE CLEAREST CASE. DANGBÈ, the serpent tradition of Hueda at Ouidah, which entered the Dahomean " +
      "religious world through the conquest of 1727 and continued at its own place. A tradition often " +
      "described today as simply Beninese or Fon is in origin Hueda's, and became available to Dahomey by " +
      "force.\n\n" +
      "WHAT THIS EXPLAINS ABOUT THE RELIGION AS A WHOLE. Why it is plural and accretive rather than " +
      "systematic. A religious landscape assembled partly by conquest will contain traditions of different " +
      "origins side by side, with different histories, and will resist being reduced to one pantheon — " +
      "which is the point made separately in this dataset's methodological record.\n\n" +
      "THINGS TO ASK: What does a conqueror do with a god he does not believe is false?",
    category: "religion",
    subcategory: "Religion and the state",
    eventType: "historical",
    tags: ["vodun", "dahomey", "allada", "hueda", "conquest", "dangbe", "religion", "politics"],
    civilisations: ["Dahomey", "Allada", "Hueda"],
    locationName: "Southern Bénin",
    lat: 6.8,
    lng: 2.1,
    claims: [
      {
        sourceKey: "wikipedia_vodun_navigation",
        startYear: 1724,
        endYear: 1727,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The conquests of Allada and Hueda, through which their religious institutions entered Dahomey's world",
        originalDateText: "1724 and 1727",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS SECURELY DATED: the conquests, from contemporary European records. WHAT IS NOT DATED " +
          "AND CANNOT BE: the religious process, which was gradual and is described rather than " +
          "documented moment by moment. THE POLITICAL DATE IS FIRM AND THE RELIGIOUS CHANGE IS A PROCESS, " +
          "and this claim covers the first.",
        notes:
          "NEEDS SOURCE VERIFICATION, specifically for the incorporation of Hueda's serpent tradition — " +
          "it is widely stated and the primary evidence for it is not identified here.",
      },
    ],
    media: [
      {
        url: commons("Entrée du Temple des Pythons (Ouidah).jpg"),
        sourcePageUrl: commonsPage("Entrée du Temple des Pythons (Ouidah).jpg"),
        fileName: "Entrée du Temple des Pythons (Ouidah).jpg",
        caption:
          "The entrance to the python temple at Ouidah. Dangbè is Hueda's tradition before it is Dahomey's, and it entered the Dahomean religious world through the conquest of 1727 rather than by always having been part of it.",
        kind: "image",
        shows: "site",
        identificationStatus: "secure",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "vodun-under-colonial-rule",
    title: "Vodun under colonial rule",
    summary:
      "The kingdom fell in 1894, its royal ceremonial was dismantled and missions expanded. The domestic and community religion continued, altered, through sixty-six years of French administration.",
    description:
      "WHAT THE CONQUEST DID TO THE RELIGION. It destroyed the STATE apparatus of it. The Annual Customs " +
      "ended as a state occasion; the royal ceremonial economy stopped; palaces burned; the objects went " +
      "to Paris. A religion in which the monarchy's service of its ancestors was the central public rite " +
      "lost its central public rite.\n\n" +
      "WHAT IT DID NOT DO. End the religion. Lineage shrines, family ancestral practice, divination, " +
      "initiation, healing, the masquerade societies and the local cults were not organised through the " +
      "palace and did not depend on it. THE DOMESTIC LAYER SURVIVED BECAUSE IT WAS DOMESTIC.\n\n" +
      "WHAT THE COLONIAL ADMINISTRATION DID. Classified indigenous religion as fetishism; regulated and " +
      "in places restricted practice; supported the expansion of Christian missions and schools; and " +
      "dealt pragmatically with religious authorities where it needed them. Colonial rule was not " +
      "uniformly hostile in practice — it was hostile in doctrine and inconsistent in application, which " +
      "is a different and messier thing.\n\n" +
      "WHAT ROYAL RITUAL DID. Continued, in reduced form, at Abomey. Royal lineages kept obligations to " +
      "the royal dead after the kingdom that those obligations belonged to had ceased to exist as a state. " +
      "THAT IS A REMARKABLE FACT: the political institution ended and the religious one attached to it " +
      "did not.\n\n" +
      "THE GAP IN THIS RECORD, NAMED. Colonial administrative archives on religion in Dahomey would " +
      "document all of this in detail — restrictions, reports, correspondence, missionary accounts — and " +
      "none of it could be consulted here. This record describes a pattern that those files would either " +
      "confirm or complicate.\n\n" +
      "THINGS TO ASK: Which parts of a religion can a government actually reach?",
    category: "religion",
    subcategory: "Colonial period",
    eventType: "historical",
    tags: ["vodun", "colonialism", "france", "missionaries", "continuity", "ancestors", "abomey", "religion"],
    civilisations: ["French Dahomey"],
    locationName: "French Dahomey",
    lat: 7.0,
    lng: 2.2,
    claims: [
      {
        sourceKey: null,
        startYear: 1894,
        endYear: 1960,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The period of French colonial rule over which these changes ran",
        originalDateText: "From the end of the independent kingdom to independence in 1960",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "THE POLITICAL DATES ARE FIRM: 1894 and 1960 are both documented. WHAT IS NOT DATED is anything " +
          "in the religious history between them, which is described in this record as a pattern and " +
          "should be replaced with dated, sourced specifics when the colonial archive can be reached.",
        notes: "NEEDS BETTER SOURCING throughout — this is among the least well evidenced records in the dataset.",
      },
    ],
  },

  {
    slug: "vodun-officially-recognised-1996",
    title: "1996: Vodun is officially recognised, and 10 January becomes a holiday",
    summary:
      "After the democratic transition, Bénin's government recognised Vodun as a religion and made 10 January a national holiday for it — a reversal of a century of official hostility.",
    description:
      "WHAT HAPPENED. Under President Nicéphore Soglo, whose government began in 1991, a national festival " +
      "of Vodun was established and 10 JANUARY was declared a national public holiday for Vodun and the " +
      "country's other traditional religions. Formal recognition of Vodun as a religion followed in 1996.\n\n" +
      "WHY THIS IS A LARGE HISTORICAL FACT AND NOT AN ADMINISTRATIVE ONE. Because of what preceded it. " +
      "Sixty-six years of a colonial administration that classified this religion as fetishism, then a " +
      "Marxist-Leninist state from 1975 that campaigned against 'feudal' and 'obscurantist' practices — " +
      "traditional religion having been a target of both the colonial and the revolutionary periods, for " +
      "opposite stated reasons. A NATIONAL HOLIDAY IS THE REVERSAL OF ALL OF THAT.\n\n" +
      "WHAT IT IS ALSO. A decision by a state about national identity and, explicitly, about tourism and " +
      "the country's international image. Recognising a religion and promoting it as heritage are not the " +
      "same act, and in Bénin they happened together.\n\n" +
      "WHAT IT DID NOT DO. Make Vodun new, or restore something that had stopped. It made public and " +
      "official something that had continued for a century without either.\n\n" +
      "THINGS TO ASK: What does official recognition change for people who were practising anyway?",
    category: "religion",
    subcategory: "Modern Bénin",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["vodun", "modern-benin", "recognition", "heritage", "ouidah", "politics", "religion"],
    people: ["Nicéphore Soglo"],
    civilisations: ["Republic of Bénin"],
    locationName: "Bénin",
    lat: 6.36,
    lng: 2.09,
    claims: [
      {
        sourceKey: "wikipedia_vodun_navigation",
        startYear: 1996,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "Official recognition of Vodun as a religion, and 10 January as a national holiday",
        originalDateText: "1996",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: a government act. NOTE THE TWO DATES IN CIRCULATION: the national festival is " +
          "described as established in 1993 under the same president, with formal recognition in 1996. " +
          "They are different acts and both are real; this claim is for the second.",
        notes: "NEEDS BETTER SOURCING: the decree or law should be cited directly rather than through reference works.",
      },
      {
        sourceKey: "wikipedia_vodun_navigation",
        startYear: 1993,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "explicit_date",
        whatIsDated: "The establishment of the national Vodun festival",
        originalDateText: "1993, under President Soglo",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHY THIS IS A SEPARATE CLAIM: founding a festival and legally recognising a religion are two " +
          "acts three years apart, and merging them into one date would lose the sequence — which is " +
          "itself informative about how the change happened.",
      },
    ],
    media: [
      {
        url: commons("Sakpatassi.jpg"),
        sourcePageUrl: commonsPage("Sakpatassi.jpg"),
        fileName: "Sakpatassi.jpg",
        caption:
          "A devotee of Sakpata in ceremonial dress. Public ceremony of this kind is what the national holiday of 10 January made official — not a revival of something that had stopped, but public recognition of something that had continued for a century without it.",
        kind: "image",
        shows: "site",
        identificationStatus: "probable",
        provenanceNotes:
          "NEEDS SOURCE VERIFICATION for place, date and occasion.",
        provenanceStatus: "resolved_at_seed",
        creditFrom: "source",
      },
    ],
  },

  {
    slug: "vodun-days-and-unesco-status",
    title: "Vodun Days, and what UNESCO has and has not listed",
    summary:
      "The January festival became the two-day Vodun Days from 2024. Vodun itself is NOT on UNESCO's Representative List: Gèlèdé is, and a broader Vodun nomination was being prepared in 2025–26.",
    description:
      "WHAT CHANGED RECENTLY. From 2024 the January festival was expanded across two days, 9 and 10 " +
      "January, and relaunched as VODUN DAYS — presented as a gathering of Vodun arts, culture and " +
      "spirituality, and explicitly developed by the government as an event of international scale, " +
      "centred on Ouidah.\n\n" +
      "THE CORRECTION THIS RECORD EXISTS TO MAKE. It is extremely common to read that Vodun is " +
      "UNESCO-listed intangible cultural heritage. AS THINGS STAND, IT IS NOT. What is inscribed from " +
      "this tradition-world is the ORAL HERITAGE OF GELEDE — proclaimed a Masterpiece in 2001 and " +
      "inscribed on the Representative List in 2008, for Bénin, Nigeria and Togo.\n\n" +
      "WHAT IS ACTUALLY HAPPENING WITH VODUN AND UNESCO. Bénin received international assistance to " +
      "PREPARE a nomination titled 'Vodun, beliefs, social practices and ways of living', running from " +
      "August 2025 to April 2026, implemented through the Ministry of Culture with community " +
      "consultation. PREPARING A NOMINATION IS NOT INSCRIPTION, and the difference is exactly the kind of " +
      "thing this timeline exists to keep visible.\n\n" +
      "WHY THE ERROR IS SO EASY. Because heritage status has become a way of saying 'this is important', " +
      "and a festival promoted internationally by a government looks like recognition. The claim then " +
      "circulates, gets repeated, and acquires the appearance of a fact.\n\n" +
      "WHEN THIS RECORD WILL NEED UPDATING. If the nomination succeeds. At that point a new claim should " +
      "be ADDED with its date — and this one kept, because 'what was true in 2026' is part of the record.\n\n" +
      "THINGS TO ASK: What does a heritage listing actually do? Who is it for?",
    category: "religion",
    subcategory: "Modern Bénin",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["vodun", "unesco", "heritage", "modern-benin", "ouidah", "festival", "method", "gelede"],
    civilisations: ["Republic of Bénin"],
    locationName: "Ouidah and Bénin",
    lat: 6.36,
    lng: 2.09,
    claims: [
      {
        sourceKey: null,
        startYear: 2024,
        startMonth: 1,
        startDay: 9,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The first expanded Vodun Days festival",
        originalDateText: "9–10 January 2024",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT IS DATED: the relaunch of a state-supported festival, which is a documented event with " +
          "press coverage and an official programme.",
        notes: "NEEDS BETTER SOURCING: an official government source rather than press reporting.",
      },
      {
        sourceKey: "unesco_ich_vodun_assistance",
        startYear: 2025,
        startMonth: 8,
        startDay: 11,
        endYear: 2026,
        datePrecision: "exact_date",
        isApproximate: false,
        temporalClaimType: "explicit_date",
        whatIsDated: "The UNESCO-assisted preparation of a Vodun nomination",
        originalDateText: "11 August 2025 to 30 April 2026",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "FROM UNESCO'S OWN FILE. THIS IS THE EVIDENCE FOR THE CORRECTION: a project to PREPARE a " +
          "nomination, with start and end dates, is documentary proof that the element was not inscribed " +
          "during that period. An assistance file is one of the few places where the absence of a listing " +
          "is positively documented rather than merely unattested.",
      },
      {
        sourceKey: "unesco_ich_benin_state",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether Vodun is inscribed on UNESCO's Representative List",
        originalDateText: "Not inscribed as at the time of writing; Gèlèdé is",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHY A POSITIONLESS CLAIM: because it records a STATE OF AFFAIRS rather than an event. It is " +
          "here so that a reader meeting the common error has something to check it against, and so that " +
          "the record can be updated by adding a dated inscription claim rather than by rewriting this one.",
      },
    ],
  },

  // -------------------------------------------------------------------------
  // ACROSS THE ATLANTIC
  // -------------------------------------------------------------------------
  {
    slug: "vodun-across-the-atlantic",
    title: "Across the Atlantic: Haiti, Brazil, Cuba",
    summary:
      "Religious traditions related to those of this coast took root in the Americas with the people who were deported. They are related traditions, formed under slavery — not transplanted copies.",
    description:
      "HOW IT HAPPENED. People were taken from this coast in very large numbers over roughly three " +
      "centuries — documented from the 1560s, before Dahomey existed, and continuing into the nineteenth " +
      "century. They carried what people carry: language, practice, memory, knowledge, obligation.\n\n" +
      "WHAT FORMED AT THE OTHER END. HAITI: Vodou, formed in Saint-Domingue from Gbe-related traditions " +
      "together with Kongo and other African religions, under slavery, in forced contact with Catholicism. " +
      "BRAZIL: the JEJE traditions, whose very name derives from a term for Gbe-speaking people, " +
      "preserving vocabulary and ritual related to this region within the wider world of Candomblé. CUBA: " +
      "ARARÁ, whose name comes from Allada, alongside the Yoruba-derived Lucumí tradition.\n\n" +
      "THE EVIDENCE THAT MAKES THESE CONNECTIONS REAL RATHER THAN IMPRESSIONISTIC. NAMES: Jeje and Arará " +
      "are derived from Gbe and from Allada, which is documentary evidence of origin embedded in the " +
      "traditions' own names. VOCABULARY: ritual language in these traditions contains words traceable to " +
      "this coast. ROUTES: the voyages are documented and quantified, so the movement of people is not in " +
      "doubt. NAMED POWERS: figures whose names correspond — Legba, Dan and others — appear on both sides.\n\n" +
      "WHAT THE TRADITIONS ARE NOT. Copies. Each formed under conditions that did not exist in West " +
      "Africa: enslavement, the destruction of lineages, prohibition, forced baptism, and contact with " +
      "many other African traditions at once. A religion built by people who had been separated from their " +
      "communities is a NEW RELIGION made of old material, and Haitian Vodou in particular is a Haitian " +
      "religion with its own history, not a West African one in exile.\n\n" +
      "THE DIRECTION OF TRAVEL NOW. Contemporary exchange runs both ways: practitioners from the Americas " +
      "visit Bénin, and Bénin promotes those connections as heritage. Present-day similarity may therefore " +
      "reflect recent contact as well as old descent, which complicates any comparison made today.\n\n" +
      "THINGS TO ASK: What can survive a forced crossing? What necessarily changes?",
    category: "religion",
    subcategory: "Diaspora",
    eventType: "historical",
    evidenceStatus: "strongly_documented",
    tags: ["vodun", "diaspora", "slavery", "haiti", "brazil", "cuba", "atlantic", "religion"],
    civilisations: ["Allada", "Fon", "Aja", "Haiti", "Brazil", "Cuba"],
    locationName: "The Bight of Benin and the Americas",
    claims: [
      {
        sourceKey: null,
        startYear: 1560,
        endYear: 1867,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "The period of Atlantic deportation from this coast",
        originalDateText: "From the 1560s, when people identified as Arada appear in Spanish America, into the nineteenth century",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT SUPPORTS THE START: colonial records in Spanish America identifying people by an ethnonym " +
          "derived from Allada. WHAT SUPPORTS THE LATER END: the documented continuation of the trade, " +
          "including illegally, into the nineteenth century. THE RANGE IS FOR THE MOVEMENT OF PEOPLE, not " +
          "for the formation of any religion — those happened at the far end, over generations, and are " +
          "not datable in this way.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When the American traditions took the forms they now have",
        originalDateText: "Not datable as an event. Each formed over generations under distinct local conditions",
        datingMethod: "other",
        chronology: "historical",
        evidence:
          "WHY POSITIONLESS: because the formation of a religion out of several traditions, under slavery, " +
          "across generations, is not an event and has no date. Giving one — 'Vodou was founded in " +
          "Saint-Domingue in 17xx' — would impose a founding moment on a process that had none.",
      },
    ],
  },

  {
    slug: "legba-and-papa-legba",
    title: "Legba and Papa Legba: a connection, and a transformation",
    summary:
      "The name travelled and the function is recognisable. What arrived in Haiti is not what left this coast, and the differences are the history.",
    description:
      "THE CONNECTION, WHICH IS REAL. In Haitian Vodou, PAPA LEGBA stands at the gate: the spirit who must " +
      "be addressed first, who opens the way to the other lwa, who is associated with crossroads and with " +
      "communication. The name is the same name. The FUNCTION — mediation, thresholds, first address — is " +
      "recognisably the same function. This is one of the strongest single pieces of evidence for " +
      "religious continuity across the Atlantic, because it is a name AND a role together, not a " +
      "resemblance.\n\n" +
      "THE TRANSFORMATION, WHICH IS ALSO REAL. Papa Legba in Haiti is commonly depicted as an old man with " +
      "a crutch or a cane, associated with Saint Peter — who holds the keys and opens the gate, and whose " +
      "image was available under a Catholicism that was compulsory. West African Legba's strong " +
      "association with virility and with the prominently male figure at the threshold is not the Haitian " +
      "image. A DIFFERENT FIGURE, DOING THE SAME JOB, UNDER A DIFFERENT NAME'S PICTURE.\n\n" +
      "WHAT THAT TELLS YOU ABOUT HOW RELIGIONS TRAVEL. That FUNCTION and NAME can survive a crossing while " +
      "IMAGE and ASSOCIATION are rebuilt from whatever material is available at the other end. Catholic " +
      "saints were the material available, and their use was not simple concealment: it produced a real " +
      "and lasting fusion.\n\n" +
      "THE ERROR THIS RECORD IS AGAINST. Treating Haitian Vodou as an intact survival of West African " +
      "Vodun, with the Haitian material read as evidence for what Vodun 'originally' was. The direction of " +
      "that inference is backwards: Haiti tells you about Haiti, and about what could cross, and about " +
      "what happened afterwards.\n\n" +
      "THINGS TO ASK: If a name and a job survive but the picture changes, what has been preserved?",
    category: "religion",
    subcategory: "Diaspora",
    eventType: "historical",
    identificationStatus: "probable",
    tags: ["vodun", "legba", "haiti", "diaspora", "syncretism", "catholicism", "religion", "method"],
    civilisations: ["Fon", "Aja", "Haiti"],
    locationName: "Southern Bénin and Haiti",
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "When and how the Legba tradition reached Haiti",
        originalDateText: "Not datable as an event; carried by deported people over generations",
        datingMethod: "other",
        chronology: "historical",
        evidence:
          "WHAT SUPPORTS THE CONNECTION: a shared name and a shared ritual function, which together are " +
          "far stronger evidence than either alone. WHAT IS NOT ESTABLISHED: when, through whom, or in " +
          "what form — because the transmission was carried by people whose individual histories were not " +
          "recorded.",
      },
    ],
  },

  {
    slug: "resemblance-is-not-descent",
    title: "When is a similarity evidence?",
    summary:
      "Shared serpents, thunder gods, ancestor cults and possession appear worldwide. This record sets out what would make a particular similarity historical evidence, and what would not.",
    description:
      "WHY THIS RECORD IS NECESSARY. Because the material in this dataset attracts comparison constantly: " +
      "with Haiti and Brazil, with Yoruba religion, with ancient Egypt, with everywhere. Some of those " +
      "comparisons rest on real historical connection and some rest on nothing but resemblance, and they " +
      "look identical when written down.\n\n" +
      "WHAT MAKES A SIMILARITY INTO EVIDENCE. FOUR THINGS, and the more of them the better.\n" +
      "  1. LINGUISTIC CORRESPONDENCE — the same word, by regular sound correspondence, not just a similar " +
      "sound. 'Jeje' from Gbe and 'Arará' from Allada are of this kind.\n" +
      "  2. A DOCUMENTED ROUTE — a known historical contact by which transmission could occur. The Atlantic " +
      "slave trade is such a route and is quantified; between West Africa and pharaonic Egypt no " +
      "comparable route is documented.\n" +
      "  3. ARBITRARY SHARED DETAIL — not the general idea, but the specific and needless particulars. Two " +
      "traditions honouring thunder proves little; two traditions with the same name for a thunder power, " +
      "the same emblem and the same prohibition is another matter.\n" +
      "  4. A CHRONOLOGY THAT WORKS — the proposed source must precede the proposed recipient, and the gap " +
      "must be bridgeable by something.\n\n" +
      "WHAT IS NOT EVIDENCE. That both traditions venerate serpents. That both have a supreme being. That " +
      "both practise possession. That an image looks like another image. THESE ARE HUMAN UNIVERSALS OR " +
      "NEAR-UNIVERSALS, and they are distributed everywhere because people everywhere respond to thunder, " +
      "death, snakes and altered states.\n\n" +
      "THE SPECIFIC CASE THIS DATASET DECLINES. Derivations of Vodun from ancient Egypt — Dan identified " +
      "with Set or Apep, royal animal symbolism derived from Egyptian practice, sacred pythons taken as " +
      "evidence of Egyptian influence. None of these meets the four tests as far as this dataset can " +
      "establish. THEY ARE NOT RECORDED AS FACTS ANYWHERE HERE. If credible scholars propose historical " +
      "connections with evidence, those proposals can be added as clearly attributed comparative " +
      "hypotheses, with the evidence attached and the attribution visible.\n\n" +
      "THE OPPOSITE ERROR, WHICH IS ALSO REAL. Refusing every connection. The Atlantic transmissions ARE " +
      "documented, the Yoruba-Fon exchanges ARE real, and scepticism applied uniformly would delete them " +
      "along with the fantasies.\n\n" +
      "THINGS TO ASK: What would change your mind about a proposed connection — in either direction?",
    category: "history",
    subcategory: "Debate",
    eventType: "disputed",
    tags: ["debate", "method", "diaspora", "comparison", "egypt", "historiography", "vodun", "linguistics"],
    locationName: "West Africa and the Atlantic world",
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Nothing. This record is about what counts as evidence for a connection",
        originalDateText: "Not a dated event",
        datingMethod: "other",
        chronology: "conventional",
        evidence:
          "WHY IT EXISTS AS A RECORD RATHER THAN A NOTE IN A HEADER: because a reader following a " +
          "comparison from any other record in this dataset should be able to arrive somewhere that sets " +
          "out the standard being applied, and see that it is applied to the connections this dataset " +
          "ACCEPTS as well as to the ones it declines.",
      },
    ],
  },
];

export const BENIN_VODUN_LINKS: SeedEventLink[] = [
  {
    from: "how-old-is-vodun",
    to: "vodu-first-written-1658",
    relation: "responds_to",
    viewpoint: "historical",
    sourceKey: "emory_thesis_vodu_1658",
    note: "The question, and the single hard date that answers a much narrower version of it.",
  },
  {
    from: "vodu-first-written-1658",
    to: "vodun-before-the-documents",
    relation: "precedes",
    viewpoint: "traditional",
    note: "The document is a latest-by date. What was already there when it was written has no date at all.",
  },
  {
    from: "how-old-is-vodun",
    to: "vodun-is-not-voodoo",
    relation: "related",
    note: "Two records about how this subject goes wrong before any evidence is examined.",
  },
  {
    from: "not-one-theology",
    to: "mawu-lisa",
    relation: "relevant",
    viewpoint: "conventional",
    sourceKey: "herskovits_dahomey_1938",
    note: "The methodological warning, and the record where it applies most strongly.",
  },
  {
    from: "bosman-describes-the-serpent-at-whydah",
    to: "temple-of-pythons-1717-tradition",
    relation: "precedes",
    viewpoint: "historical",
    sourceKey: "bosman_guinea_1704",
    note: "The description is twenty years older than the founding story, which is the chronological problem the two records exist to show.",
  },
  {
    from: "temple-of-pythons-1717-tradition",
    to: "temple-of-pythons-today",
    relation: "precedes",
    viewpoint: "traditional",
    note: "The tradition of the founding, and the site as it stands.",
  },
  {
    from: "temple-of-pythons-today",
    to: "temple-and-basilica-face-each-other",
    relation: "related",
    viewpoint: "historical",
    note: "One of the two buildings in the pair.",
  },
  {
    from: "dan-the-serpent",
    to: "bosman-describes-the-serpent-at-whydah",
    relation: "relevant",
    viewpoint: "traditional",
    note: "Serpent-associated powers, and the earliest substantial description of serpent veneration on this coast. Related in subject; NOT an identification of Dan with Dangbè.",
  },
  {
    from: "conquest-absorbs-cults",
    to: "temple-of-pythons-today",
    relation: "relevant",
    viewpoint: "historical",
    note: "Dangbè is Hueda's before it is Dahomey's, and entered the Dahomean religious world through conquest.",
  },
  {
    from: "fa-divination",
    to: "fa-as-an-information-system",
    relation: "responds_to",
    viewpoint: "other",
    note: "The practice, and a modern analytical reading of it that is labelled as modern and analytical.",
  },
  {
    from: "fa-divination",
    to: "oral-knowledge-as-technology",
    relation: "related",
    viewpoint: "historical",
    note: "One of several interlocking systems for carrying knowledge without writing.",
  },
  {
    from: "ancestors-in-vodun",
    to: "asen-memory-in-iron",
    relation: "source_of",
    viewpoint: "traditional",
    sourceKey: "bay_asen_ancestors_vodun",
    note: "The relationship with the dead, and the objects made to hold it.",
  },
  {
    from: "initiation-and-restricted-knowledge",
    to: "possession-and-trance",
    relation: "related",
    viewpoint: "traditional",
    note: "Possession in the documented traditions is generally the province of initiates, which connects the two records directly.",
  },
  {
    from: "vodun-under-colonial-rule",
    to: "vodun-officially-recognised-1996",
    relation: "precedes",
    viewpoint: "historical",
    note: "A century of official hostility, and its reversal.",
  },
  {
    from: "vodun-officially-recognised-1996",
    to: "vodun-days-and-unesco-status",
    relation: "precedes",
    viewpoint: "historical",
    note: "Recognition, and what it grew into — including the heritage status that is widely misreported.",
  },
  {
    from: "gelede",
    to: "vodun-days-and-unesco-status",
    relation: "evidence_for",
    viewpoint: "conventional",
    sourceKey: "unesco_ich_gelede",
    note: "Gèlèdé is the element that IS inscribed, which is what the correction rests on.",
  },
  {
    from: "vodun-across-the-atlantic",
    to: "legba-and-papa-legba",
    relation: "source_of",
    viewpoint: "historical",
    note: "The general transmission, and the single clearest case of a name and a function surviving it.",
  },
  {
    from: "legba-and-papa-legba",
    to: "resemblance-is-not-descent",
    relation: "evidence_for",
    viewpoint: "conventional",
    note: "A connection that meets the tests, offered as the standard against which weaker ones can be measured.",
  },
  {
    from: "legba",
    to: "legba-and-papa-legba",
    relation: "precedes",
    viewpoint: "historical",
    note: "The West African tradition, and what became of the name across the Atlantic.",
  },
  {
    from: "gu-iron-and-war",
    to: "resemblance-is-not-descent",
    relation: "relevant",
    viewpoint: "conventional",
    note: "Ancient ironworking in this territory and a power of iron documented three thousand years later are exactly the pair this record warns against joining.",
  },
];
