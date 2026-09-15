import type { SeedEvent, SeedSource, SeedTrack, SeedEventLink } from "./seed-types";

// =============================================================================
// BRUTUS OF TROY, PART ONE: THE TEXTUAL SPINE
//
// First tranche of the Brutus cluster, and deliberately the part that needs
// manuscripts rather than science. The Bronze Age context, the tin networks and
// the ancient-DNA migration record are a separate tranche; so are the 33
// daughters, Prydein, and the London civic giants.
//
// THE QUESTION THIS TRANCHE ANSWERS, AND THE ONE IT DOES NOT. It answers: what
// do the texts actually say, when do they first say it, and what changed
// between versions? It does not answer whether Brutus existed. Nothing here
// could.
//
// "MYTH" IS NOT A TERMINAL LABEL, and this dataset is built on that rule. A
// legendary tradition can hold invented genealogy, political argument,
// remembered geography, real places, etymological guesswork, older oral
// material and later additions ALL AT ONCE. Calling the Brutus story a myth
// and stopping is as lazy as calling it history and stopping — and it throws
// away the only genuinely interesting question, which is what changed between
// 829 and 1136 and why.
//
// THE SHAPE OF THE EVIDENCE, STATED ONCE HERE. The traditional date is around
// 1100 BCE. The earliest surviving text mentioning Brutus is from about 829 CE.
// That is a gap of roughly nineteen centuries with no contemporary
// documentation of any kind, and it is the single most important fact in the
// cluster. It has its own record, because a fact that large should not be a
// footnote on somebody else's.
//
// AND THE GIANTS ARE NOT IN EVERY VERSION. The Historia Brittonum has Brutus
// and no Gogmagog conquest narrative. Geoffrey, three hundred years later, has
// giants, a wrestling match and a named cliff. Watching the story grow is the
// most useful thing a reader can do with these records, so the growth is drawn
// rather than smoothed over.
//
// A NOTE ON SOURCING, because it changes how this should be read. This tranche
// was assembled in an environment whose network policy blocks every host the
// primary texts and the scholarship live on. Search worked; opening the page
// did not. Translated wording, manuscript dates and scholarly positions here
// come from search results quoting those pages, NOT from reading them. Claims
// that need somebody to open a book say NEEDS SOURCE VERIFICATION and name what
// to check. See docs/timeline-research-briefs.md.
//
// NO CONFIDENCE SCORES. Alternative readings are labelled, not dismissed.
// =============================================================================

const bce = (year: number): number => 1 - year;

export const BRUTUS_ALBION_ANCHOR_SLUG = "brutus-comes-to-albion";

export const BRUTUS_ALBION_TRACK: SeedTrack = {
  name: "Brutus, Albion and the giants: what the texts say, and when they start saying it",
  slug: "brutus-albion",
  kind: "theme",
  color: "#3f6f5a",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const BRUTUS_ALBION_SOURCES: SeedSource[] = [
  {
    key: "historia_brittonum",
    title: "Historia Brittonum",
    reference: "Compiled about 829–830; the Nennian preface is of disputed authenticity",
    url: "https://www.yorku.ca/inpar/nennius_giles.pdf",
    sourceType: "historical_document",
    publishedYear: 830,
    notes:
      "THE EARLIEST SURVIVING TEXT THAT HAS BRUTUS. A Latin compilation, traditionally attributed to Nennius on " +
      "the strength of a preface that a number of specialists regard as a later forgery — so it is most safely " +
      "described as anonymous. READ, in the J. A. Giles translation (Project Gutenberg EBook 1972), and the " +
      "readings this dataset rests on were checked in it directly. WHAT IT CONTAINS: Brutus at chapters 7-18, " +
      "the Eli/Ark synchronism at 11 verbatim, and the compiler flagging his sources TWICE — 'I have seen two " +
      "distinct relations' (10) and 'I have learned another account of this Brutus from the ancient books of our " +
      "ancestors' (17). WHAT IT DOES NOT CONTAIN, checked by reading the whole text: no giants, no Gogmagog, no " +
      "Corineus, no wrestling, no Albion, no Troia Nova. CAUTION ON ITS DATE: Giles's printed text says in its " +
      "own preface (1) that it was compiled 'in the 858th year of our Lord's incarnation', not 829; the " +
      "recensions differ and Giles conflates them. Victorian translation, so its wording is not evidence for the " +
      "Latin.",
  },
  {
    key: "chartres_codex",
    title: "The Chartres Codex of the Historia Brittonum",
    reference: "Bibliothèque municipale de Chartres; dated to about 900; destroyed in May 1944",
    sourceType: "primary",
    notes:
      "The oldest known manuscript of the Historia Brittonum — and it no longer exists. It was destroyed when the " +
      "library at Chartres was bombed in May 1944. Cited because the manuscript history is part of the evidence: " +
      "the oldest witness to the earliest Brutus text is now itself known only at second hand. NEEDS SOURCE " +
      "VERIFICATION for its shelfmark and for what survives of it in earlier transcriptions.",
  },
  {
    key: "harleian_recension",
    title: "The Harleian recension of the Historia Brittonum",
    reference: "British Library, Harley MS 3859",
    sourceType: "primary",
    notes:
      "Reported as the most complete surviving recension, and the basis of most modern editions. Cited for the " +
      "state of the text. At least five manuscripts preserve the work, and they do not all say the same thing — " +
      "which matters for any argument that rests on a particular sentence. NEEDS SOURCE VERIFICATION for the " +
      "manuscript's own date.",
  },
  {
    key: "geoffrey_hrb",
    title: "Historia Regum Britanniae",
    author: "Geoffrey of Monmouth",
    reference: "Completed in the 1130s, conventionally about 1136",
    url: "https://www.yorku.ca/inpar/geoffrey_thompson.pdf",
    sourceType: "historical_document",
    publishedYear: 1136,
    notes:
      "The version everybody actually knows: Brutus's exile, the oracle of Diana, the voyage, the landing at " +
      "Totnes, the giants, Corineus against Gogmagog, the renaming of Albion, and New Troy on the Thames. Cited " +
      "as the primary text for all of it — and as the place where most of it first appears, three centuries after " +
      "the Historia Brittonum. Linked in the Thompson translation.",
  },
  {
    key: "wikipedia_brutus",
    title: "Brutus of Troy",
    url: "https://en.wikipedia.org/wiki/Brutus_of_Troy",
    sourceType: "wikipedia",
    notes:
      "Orientation, and the route to the passages. Cited for the reported date of 1115 BC for the landing, for " +
      "Brutus as grandson of Ascanius through Silvius in Geoffrey's version, and for the plain statement that " +
      "Brutus appears in no classical text. Follow its references rather than trusting it.",
  },
  {
    key: "wikipedia_gogmagog",
    title: "Gogmagog (giant)",
    url: "https://en.wikipedia.org/wiki/Gogmagog_(giant)",
    sourceType: "wikipedia",
    notes:
      "Cited for the details of the fight as the tradition gives them — twelve cubits, oaks uprooted like hazel " +
      "wands, three of Corineus's ribs broken, the throw from the cliff, and the place remembered as Gogmagog's " +
      "Leap. Orientation only; the wording should be checked against Geoffrey.",
  },
  {
    key: "wikipedia_trinovantum",
    title: "Trinovantum",
    url: "https://en.wikipedia.org/wiki/Trinovantum",
    sourceType: "wikipedia",
    notes:
      "Cited for Geoffrey's etymology — Troia Nova corrupted to Trinovantum — and for the mainstream objection " +
      "that this reverses the actual direction: the Iron Age tribal name came first.",
  },
  {
    key: "trinovantum_evolution",
    title: "Trinovantum — the evolution of a legend",
    workTitle: "Journal of Medieval History",
    url: "https://www.sciencedirect.com/science/article/abs/pii/0304418181900245",
    sourceType: "academic_paper",
    notes:
      "The scholarly treatment of how the New Troy identification was built. Cited as the place to go for the " +
      "argument rather than the summary. NEEDS SOURCE VERIFICATION: the article is behind a paywall and could " +
      "not be read from the environment this dataset was built in, so it is cited for its subject and not for " +
      "any particular conclusion.",
  },
  {
    key: "clark_totnes",
    title: "Trojans at Totnes and Giants on the Hoe: Geoffrey of Monmouth, Historical Fiction and Geographical Reality",
    author: "J. Clark",
    workTitle: "Report and Transactions of the Devonshire Association for the Advancement of Science",
    reference: "Volume 148 (June 2016), pages 89-130",
    url: "https://devonassoc.org.uk/wp-content/uploads/2019/01/Trojans-at-Totnes-Clark-TDA-2016.pdf",
    sourceType: "academic_paper",
    publishedYear: 2016,
    notes:
      "On Geoffrey's use of real West Country geography for a fictional landing — Totnes, and the Hoe at " +
      "Plymouth where the wrestling is placed. Cited because it addresses the exact question a reader asks here: " +
      "what does it mean that an invented story is set in findable places? NOW READ. John Clark, Curator " +
      "Emeritus of the Museum of London. THE FINDING THAT MATTERS MOST HERE: Geoffrey never writes 'Totnes' as a " +
      "place at all — only the adjective Totonesius, 'Totnesian', in 'Totonesium litus' (the Totnesian coast) " +
      "and 'Totonesius portus'. Translators who write 'landed at Totnes' have added something he did not say. " +
      "SECOND FINDING, A WARNING ABOUT TEXTS: the Celtic form 'Lamgoemagot' that commentators built arguments on " +
      "is NOT Geoffrey's. It is a later gloss, probably by Ivo Cavellatus in the first printed edition of 1508, " +
      "and it stood in every printed edition until 1929. Four centuries of scholarship chasing a word the author " +
      "never wrote.",
  },
  {
    key: "culhwch_olwen",
    title: "Culhwch ac Olwen",
    reference: "White Book of Rhydderch (fragmentary, about 1325) and Red Book of Hergest (complete, about 1400)",
    url: "https://en.wikipedia.org/wiki/Culhwch_and_Olwen",
    sourceType: "historical_document",
    notes:
      "The Welsh prose tale with Ysbaddaden Pencawr, chief of giants, in it. Cited for the fact that matters most " +
      "here: Welsh tradition had giants independently of Geoffrey. Its date is argued — often placed about 1100, " +
      "and redated by Simon Rodway in 2005 to the later twelfth century, which would put it AFTER Geoffrey and " +
      "change what it can be used to show.",
  },
  {
    key: "rodway2005",
    title: "The Date and Authorship of Culhwch and Olwen",
    author: "Simon Rodway",
    workTitle: "Cambrian Medieval Celtic Studies",
    reference: "Volume 49 (2005), pages 21–44",
    sourceType: "academic_paper",
    publishedYear: 2005,
    notes:
      "The redating that moves the tale from about 1100 to the latter half of the twelfth century on linguistic " +
      "grounds. Cited because the whole 'Welsh giants before Geoffrey' argument turns on which date is right. " +
      "NEEDS SOURCE VERIFICATION of a narrower kind than before: the citation is now had, but the ARGUMENT has " +
      "not been read. Which linguistic features carry the redating, and how specialists have answered it, are " +
      "the things somebody with the article should put here.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const BRUTUS_ALBION_EVENTS: SeedEvent[] = [
  {
    slug: BRUTUS_ALBION_ANCHOR_SLUG,
    title: "Brutus of Troy comes to Albion",
    summary:
      "A great-grandson of Aeneas lands at Totnes, clears the island of giants, renames Albion after himself and founds New Troy on the Thames. No contemporary source records any of it.",
    description:
      "WHAT KIND OF RECORD IS THIS? A foundation tradition — legendary history. It is not filed as fiction and it is not filed as history, because it is neither and treating it as either destroys the thing worth studying.\n\n" +
      "THE TRADITION, AS GEOFFREY OF MONMOUTH GIVES IT. Brutus is descended from Aeneas of Troy — in Geoffrey's version the grandson of Ascanius, through Ascanius's son Silvius. A prophecy attends his birth; he kills his father accidentally and is exiled. He gathers Trojan descendants held in Greece, wins their freedom, and sails west. An oracle of Diana directs him to an island beyond Gaul. He travels by way of the Mediterranean and of Gaul, where Corineus and his people join him. They land at Totnes. The island is called Albion and is inhabited, in Geoffrey's words, by none but a few giants; the Trojans drive them into the caves of the mountains and divide the country. Corineus takes Cornwall and kills the giant Gogmagog. Brutus renames the island Britain after himself and his followers Britons, and founds Troia Nova on the Thames. At his death his three sons divide the island: Locrinus, Kamber, Albanactus — and the tradition uses their names to explain Loegria, Cambria and Albany.\n\n" +
      "WHAT IS NOT IN THE EARLIEST VERSION, AND THIS IS THE POINT. The Historia Brittonum, three hundred years older, has Brutus and the Trojan genealogy. IT DOES NOT HAVE the developed conquest narrative — no Gogmagog, no wrestling match, no named cliff. Almost everything most people know about Brutus first appears in a text of the 1130s.\n\n" +
      "THE DATES ON THIS RECORD ARE FOUR DIFFERENT KINDS OF THING. A year reported for the landing. A synchronism, which is how the text actually fixes it — Eli was judge in Israel and the Ark was taken by the Philistines. The date of the earliest surviving text that mentions Brutus at all. And a claim with no position: that nothing contemporary records him, which is not a date but is the most important thing a reader can know.\n\n" +
      "WHAT THIS RECORD IS CAREFUL NOT TO SAY. It does not say Brutus was real. It does not say the story is worthless. It says what the texts say, when they start saying it, and what changed — and it leaves the question open, because the evidence leaves it open.\n\n" +
      "THINGS TO ASK: Which parts of the story are in the ninth-century text and which arrive in the twelfth? If a story grows, does that tell you it was invented, or only that it was retold? What would a real memory of a migration look like after nineteen centuries of retelling — and how would you tell it from an invention?",
    category: "history",
    subcategory: "Foundation tradition",
    eventType: "traditional_account",
    eventTypeNote:
      "Legendary history. The tradition is real, well documented and enormously influential; the events it describes have no independent attestation of any kind. Both halves of that sentence belong on the record.",
    tags: ["brutus", "albion", "troy", "britain", "foundation-myth", "geoffrey-of-monmouth"],
    people: ["Brutus", "Corineus", "Aeneas", "Silvius", "Ascanius", "Locrinus", "Kamber", "Albanactus"],
    civilisations: ["Legendary Britain"],
    locationName: "Totnes, Devon, in the tradition",
    claims: [
      {
        sourceKey: "wikipedia_brutus",
        startYear: bce(1115),
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "traditional_date",
        whatIsDated: "The landing in Albion, in the traditional chronology",
        originalDateText: "1115 BC",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "WHAT IS CLAIMED: that Brutus reached Albion in 1115 BC. WHERE THE FIGURE COMES FROM: it is reported as " +
          "Geoffrey's date for the landing. A year of this precision in a text of the 1130s about the twelfth " +
          "century BCE is not a record of anything — it is the output of a chronology, arrived at by placing the " +
          "story against biblical and classical synchronisms and counting. WHAT IT ESTABLISHES: what the " +
          "tradition believed, which is a real and interesting fact. WHAT IT DOES NOT ESTABLISH: anything about " +
          "the twelfth century BCE.",
        notes:
          "NEEDS SOURCE VERIFICATION, and specifically this: whether 1115 BC is stated by Geoffrey himself or is " +
          "a figure computed by later chronographers from his synchronisms and then attached to him. The " +
          "difference matters and could not be checked here, because the text could not be opened.",
      },
      {
        sourceKey: "geoffrey_hrb",
        startYear: bce(1115),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "relative_date",
        whatIsDated: "When the landing happened, as the text itself fixes it",
        originalDateText: "When Eli was judge in Israel and the Ark of the Covenant was taken by the Philistines",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "HOW THE TEXT ACTUALLY DATES IT, before anybody converts it into a year. Geoffrey fixes Brutus by " +
          "synchronism: this happened while Eli was judge in Judaea and while the Philistines held the Ark. That " +
          "is a medieval chronographer's method and a perfectly serious one — it places a story inside a shared " +
          "framework of sacred and classical history. WHY IT IS KEPT SEPARATE FROM THE YEAR: a synchronism and a " +
          "BCE date are different claims. The synchronism is what the source gives; the year is what somebody " +
          "computed from it, and the computation depends on a biblical chronology that is itself argued about. " +
          "The year attached here is only so the claim can be drawn near the other one; the CLAIM is the " +
          "synchronism.",
        notes:
          "NEEDS SOURCE VERIFICATION for the wording and for where in the Historia it appears. The start year is " +
          "carried over from the traditional 1115 BC purely so the two claims sit together on the strip, and it " +
          "should not be read as an independent date.",
      },
      {
        sourceKey: "historia_brittonum",
        startYear: 830,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "When Brutus is first known to be written about",
        originalDateText: "about 829–830 CE, in the Historia Brittonum",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "THE ONLY DATE HERE THAT ATTACHES TO SOMETHING THAT DEMONSTRABLY EXISTED. The Historia Brittonum is " +
          "placed about 829–830, and it contains Brutus and the Trojan descent. WHAT IT ESTABLISHES: that the " +
          "Brutus tradition is at least ninth-century, and therefore that Geoffrey did not invent Brutus — a " +
          "point worth making because it is often assumed he did. WHAT IT DOES NOT ESTABLISH: that Brutus existed " +
          "in the twelfth century BCE, or that the ninth-century version resembled the twelfth-century one. It " +
          "did not.",
      },
      {
        sourceKey: "wikipedia_brutus",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether any contemporary source records Brutus",
        originalDateText: "No classical text mentions him; there is no contemporary record of any kind",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that Brutus appears in no classical text and cannot be regarded as historical on " +
          "present evidence. WHAT THAT MEANS PRECISELY: no Greek, Roman, Egyptian, Hittite or Near Eastern source " +
          "records a Trojan settlement of Britain; no inscription names him; no burial or site has been " +
          "identified with him. WHY IT HAS NO POSITION ON THE STRIP: it is not a date. It is a statement about " +
          "the absence of dates, and it belongs on the record as prominently as the traditional year does. " +
          "IMPORTANT LIMITATION, STATED BECAUSE IT CUTS BOTH WAYS: absence of evidence is not evidence of " +
          "absence. This claim records what is not there; it does not establish that nothing happened.",
      },
    ],
  },

  {
    slug: "documentary-gap-brutus",
    title: "Nineteen centuries with nothing in them",
    summary:
      "Between the traditional date of Brutus's landing and the first surviving text that mentions him there is a gap of roughly 1,900 years. This record exists so that gap cannot be skimmed past.",
    description:
      "WHAT KIND OF RECORD IS THIS? A statement about the shape of the evidence — and the most important thing in this cluster.\n\n" +
      "THE ARITHMETIC. Traditional landing: about 1115 BCE. Earliest surviving text mentioning Brutus: about 829 CE, the Historia Brittonum. That is roughly nineteen hundred and forty years. The fully developed story — giants, Gogmagog, the wrestling, New Troy — arrives about 1136 CE, roughly two thousand two hundred and fifty years after the date it describes.\n\n" +
      "WHAT FILLS THE GAP. Nothing. Not a fragmentary inscription, not a passing mention in a classical geographer, not an archaeological horizon anybody has connected to it. Britain is described by Greek and Roman writers from several centuries BCE onwards, in some detail, and none of them has heard of Brutus.\n\n" +
      "WHY THIS DESERVES ITS OWN RECORD RATHER THAN A SENTENCE. Because a timeline that puts 'Brutus lands, 1115 BCE' beside 'Caesar invades, 55 BCE' makes them look like the same kind of statement, and they are not remotely. One is attested by the man who did it. The other is attested by a book written two millennia later. Drawing them on one strip without saying so is the single most misleading thing this application could do, and this record is the correction.\n\n" +
      "WHAT THE GAP DOES NOT PROVE. It does not prove the tradition is empty. Oral tradition can carry material across very long spans, and the cluster's later tranches will examine whether anything in the story corresponds to real migration. What the gap does is set the standard of evidence: any claim that the story preserves a real memory has to explain how it crossed nineteen centuries, and that explanation is part of the claim.\n\n" +
      "THINGS TO ASK: What is the longest gap you would accept between an event and its first record? Does it change if the tradition is oral and formal, as Vedic recitation is? What would fill this gap — what specific find would change the picture?",
    category: "history",
    subcategory: "The shape of the evidence",
    eventType: "historical",
    eventTypeNote:
      "Not an event so much as a measurement of the record. Filed as historical because the dates it compares are themselves ordinary, checkable things.",
    tags: ["brutus", "evidence", "documentary-gap", "method", "britain"],
    claims: [
      {
        sourceKey: "historia_brittonum",
        startYear: bce(1115),
        endYear: 830,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_range",
        whatIsDated: "The span between the traditional date and the earliest surviving mention",
        originalDateText: "About 1115 BCE to about 829 CE — roughly 1,944 years",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS BEING MEASURED: not an event, but the distance between a claim and its earliest evidence. The " +
          "near end is the traditional landing date; the far end is the Historia Brittonum. WHAT LIES BETWEEN " +
          "THEM IN THE RECORD: nothing that names Brutus. WHY IT IS DRAWN AS A RANGE: because that is what it is " +
          "— a span, not a moment, and the span is the finding.",
      },
    ],
  },

  {
    slug: "historia-brittonum-brutus",
    title: "Brutus appears in the Historia Brittonum",
    summary:
      "About 829. The earliest surviving text with Brutus in it — and its compiler says outright that he had found more than one story about where the Britons came from.",
    description:
      "WHAT KIND OF RECORD IS THIS? A historical document, dated as a document.\n\n" +
      "WHAT IT IS. A Latin compilation of about 829–830, traditionally ascribed to Nennius on the strength of a preface that a number of specialists regard as a later forgery. It is most safely called anonymous. It contains a Trojan origin genealogy for the Britons and derives the island's name from Brutus.\n\n" +
      "WHAT IT PROVES, WHICH IS NARROW AND REAL. That the Brutus tradition existed three centuries before Geoffrey of Monmouth. Anybody who says Geoffrey made Brutus up is wrong, and this is the document that shows it.\n\n" +
      "WHAT IT DOES NOT PROVE. That Brutus existed in the twelfth century BCE. A ninth-century text is a ninth-century text.\n\n" +
      "THE COMPILER'S OWN SENTENCE, which is the best thing in the record and is usually left out. In the Giles translation: 'Respecting the period when this island became inhabited subsequently to the flood, I have seen two distinct relations.' He is not reporting a settled tradition. He is telling the reader that he has found competing accounts and is giving them what he has. That is a ninth-century compiler behaving better than most of the people who have since quoted him.\n\n" +
      "IT IS NOT TWO RELATIONS. IT IS AT LEAST THREE, AND THEY ARE DIFFERENT MEN. Reading the whole text " +
      "rather than the famous sentence: chapter 10 gives Brutus as a Roman consul who conquered Spain and " +
      "subdued Britain, and ALSO Brutus the great-grandson of Aeneas who killed his father with an arrow, was " +
      "exiled, founded Tours and then came to the island. Chapter 15 has 'Brutus, who first exercised the " +
      "consular office' over the Romans — that is Lucius Junius Brutus, of 509 BCE, a third man entirely. " +
      "Chapters 17-18 then give a wholly separate descent, flagged with 'I have learned another account of this " +
      "Brutus from the ancient books of our ancestors': Brutus son of Hisicion son of Alanus, brother of " +
      "Francus, Romanus and Alamanus, traced back through Japheth to Noah. That last is the Frankish Table of " +
      "Nations, not a Trojan story at all.\n\n" +
      "WHY THAT MATTERS MORE THAN THE SINGLE SENTENCE. The earliest Brutus text does not preserve a tradition. " +
      "It preserves a PROBLEM — several incompatible explanations of the same name, set side by side by a " +
      "compiler who marks each one as something he has been told rather than something he knows. The tidy " +
      "Trojan Brutus that later writers inherit is one option out of several that were live in the ninth " +
      "century.\n\n" +
      "WHAT IT DOES CONFIRM. Chapter 11 carries the Eli synchronism word for word: Brutus 'governed Britain at " +
      "the time Eli the high-priest judged Israel, and when the ark of the covenant was taken by a foreign " +
      "people'. The anchor record's claim that the text fixes its date by synchronism rather than by year is " +
      "checked and correct.\n\n" +
      "THE MANUSCRIPTS, AND A LOSS. At least five manuscripts preserve the work and they do not all agree. The most complete is the Harleian. The OLDEST known copy was the Chartres Codex, of about 900 — and it was destroyed when the library at Chartres was bombed in May 1944. So the oldest witness to the earliest Brutus text is now itself known only at second hand, which is a fact about this cluster's evidence that no summary should drop.\n\n" +
      "THINGS TO ASK: What is the difference between 'the tradition is ninth-century' and 'the events are twelfth-century BCE'? Why would a compiler say he had found two accounts rather than picking one? What was in the Chartres manuscript that the surviving copies might not have?",
    category: "history",
    subcategory: "Earliest sources",
    eventType: "historical",
    tags: ["brutus", "historia-brittonum", "nennius", "manuscript", "britain"],
    people: ["Nennius"],
    civilisations: ["Early medieval Britain"],
    claims: [
      {
        sourceKey: "historia_brittonum",
        startYear: 829,
        endYear: 830,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the Historia Brittonum was compiled",
        originalDateText: "about 829–830",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that the compilation was made about 829–830. HOW IT IS OBTAINED: from internal " +
          "evidence — the text's own reckoning of years and the events it knows about. WHAT IT ESTABLISHES: a " +
          "terminus for the Brutus tradition. The story is at least this old.",
        notes:
          "NEEDS SOURCE VERIFICATION for the internal evidence the date rests on, which is worth understanding " +
          "rather than accepting: a compilation's date is argued from what it knows and what it does not.",
      },
      {
        sourceKey: "chartres_codex",
        startYear: 900,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The oldest known manuscript of the text",
        originalDateText: "about 900 — destroyed in May 1944",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "THE OLDEST PHYSICAL WITNESS, AND IT IS GONE. The Chartres Codex is reported as dating to about 900 and " +
          "as having been destroyed when the library was bombed in May 1944. WHY IT IS ON THE RECORD ANYWAY: " +
          "because the composition date and the manuscript date are different questions, and because a reader " +
          "should know that the earliest copy of the earliest Brutus text is no longer available to be consulted. " +
          "WHAT SURVIVES OF IT: earlier transcriptions and collations, which is a weaker kind of evidence than " +
          "the object.",
        notes:
          "NEEDS SOURCE VERIFICATION for the shelfmark, the exact date, and what was recorded from the manuscript " +
          "before 1944.",
      },
    ],
  },

  {
    slug: "geoffrey-writes-the-historia-regum-britanniae",
    title: "Geoffrey of Monmouth writes the Historia Regum Britanniae",
    summary:
      "The 1130s. Everything most people know about Brutus — the oracle, the giants, Gogmagog, New Troy — is in this book and not in the one three hundred years older.",
    description:
      "WHAT KIND OF RECORD IS THIS? A historical document, and the hinge of the whole cluster.\n\n" +
      "WHAT IT DID. Geoffrey's Historia Regum Britanniae, completed in the 1130s and conventionally dated about 1136, gave Britain a continuous royal history from Brutus to the seventh century CE. It was extraordinarily successful — copied, translated, believed, and built into English and Welsh national historiography for centuries.\n\n" +
      "WHAT IS NEW IN IT. Set beside the Historia Brittonum, the additions are enormous: the prophecy at Brutus's birth, the accidental killing of his father, the freeing of the Trojans in Greece, the oracle of Diana, the voyage, the landing at Totnes, THE GIANTS, Corineus against Gogmagog, the cliff, the renaming of Albion, New Troy on the Thames, and the division among three sons. A reader comparing the two texts is watching a genealogy become a national epic.\n\n" +
      "WHAT TO DO WITH THAT, AND WHAT NOT TO DO WITH IT. The growth is a fact and it needs explaining — but 'Geoffrey invented all of it' and 'Geoffrey recorded older material' are both possible explanations and the second is not absurd. He claimed to be translating an ancient book in the British tongue given to him by Walter of Oxford. No such book is known. That claim may be a conventional authorising fiction, or it may be true, and medievalists have argued both.\n\n" +
      "HIS GEOGRAPHY IS REAL, WHICH IS GENUINELY INTERESTING. Totnes is a real place. The Hoe at Plymouth is a real place. Geoffrey set an invented story in findable country, and what that means is a live scholarly question rather than a rhetorical one.\n\n" +
      "THINGS TO ASK: If a story grows this much in three hundred years, what does that tell you about the first version? Does an author who cites a source nobody has seen deserve more suspicion than one who cites nothing? Why set an invented landing at a real port?",
    category: "history",
    subcategory: "Earliest sources",
    eventType: "historical",
    tags: ["brutus", "geoffrey-of-monmouth", "historia-regum-britanniae", "1136", "britain"],
    people: ["Geoffrey of Monmouth", "Walter of Oxford"],
    civilisations: ["Norman Britain"],
    claims: [
      {
        sourceKey: "geoffrey_hrb",
        startYear: 1136,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "approximate_date",
        whatIsDated: "When the Historia Regum Britanniae was completed",
        originalDateText: "the 1130s, conventionally about 1136",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: completion in the 1130s. HOW IT IS OBTAINED: from dedications, from datable events the " +
          "text refers to, and from when other writers begin using it. WHAT IT ESTABLISHES FOR THIS CLUSTER: that " +
          "the developed Brutus story is twelfth-century. Every element absent from the Historia Brittonum is " +
          "attested no earlier than this.",
        notes:
          "NEEDS SOURCE VERIFICATION for the basis of the 1136 date; 'the 1130s' is the safer statement and is " +
          "the one this record leads with.",
      },
    ],
  },

  {
    slug: "giants-of-albion",
    title: "The Giants of Albion",
    summary:
      "In Geoffrey, Albion is already inhabited — by a few giants, who are driven into the mountain caves so the land can be divided and farmed.",
    description:
      "WHAT KIND OF RECORD IS THIS? A mythic population, as a twelfth-century text describes it. Physical evidence: none. Earlier attestation: none in the Historia Brittonum.\n\n" +
      "WHAT GEOFFREY SAYS. The island is called Albion and is inhabited by none but a few giants. The Trojans force them to fly into the caves of the mountains. The incomers divide the country, cultivate it and build houses. Later, at a festival, the surviving giants attack, and their champion Gogmagog is dealt with separately.\n\n" +
      "TWO DETAILS WORTH NOT SKIMMING. First, A FEW giants — the text does not describe a populous rival nation but a remnant. Second, they are not exterminated at the point of landing; they are pushed to the margins, and they come back.\n\n" +
      "A READING, LABELLED AS A READING. Take the word 'giant' out and the structure is unremarkable: an earlier population, an incoming population, displacement, retreat into difficult country, occupation and cultivation of the good land, and a final ceremonial defeat of the strongest of the old people. That is what a colonisation narrative looks like, told from the incomers' side. THIS IS A READING OF THE NARRATIVE'S SHAPE. It is not evidence that such a displacement happened, and it is not evidence about who anybody was. A twelfth-century Norman-world cleric writing about conquest and legitimate possession had every reason to produce that shape whether or not anything like it ever occurred.\n\n" +
      "WHAT WOULD MAKE IT MORE THAN A READING. Independent evidence of the thing described — which, for the Late Bronze Age, is a question about migration and ancient DNA and belongs in a later tranche of this cluster, not here. The two must not be quietly joined: a narrative shape and a genetic signal are different kinds of thing, and finding both does not make one the record of the other.\n\n" +
      "THINGS TO ASK: Why 'a few' rather than many? What work is the word 'giant' doing in a text about who may rightfully hold land? If you removed the giants and left the structure, what would you have — and would you believe it?",
    category: "culture",
    subcategory: "Legendary population",
    eventType: "traditional_account",
    eventTypeNote:
      "A traditional account of a population, filed as such. The displacement reading on this record is an interpretation of the narrative's structure and is labelled as one throughout.",
    tags: ["giants", "albion", "brutus", "geoffrey-of-monmouth", "displacement", "britain"],
    civilisations: ["Legendary Britain"],
    claims: [
      {
        sourceKey: "geoffrey_hrb",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "primordial",
        whatIsDated: "When the giants held Albion",
        originalDateText: "Before Brutus — the island is already theirs when he arrives",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "WHAT THE TEXT GIVES: a position in a narrative, not a date. The giants are there before the Trojans " +
          "arrive; nothing says for how long, and no year is offered or implied. WHY THIS CLAIM HAS NO POSITION " +
          "ON THE STRIP: because 'before Brutus' is the whole of the information, and converting it into a year " +
          "would be manufacturing precision the source does not have. This is exactly the case the timeline's " +
          "positionless claims exist for.",
      },
      {
        sourceKey: "historia_brittonum",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether the giants are in the earliest Brutus text",
        originalDateText: "Not present in the Historia Brittonum; first attested about 1136",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "THE TEXTUAL FINDING THIS RECORD RESTS ON: the ninth-century text has Brutus and the Trojan descent and " +
          "does NOT have the giant conquest narrative. So the giants of Albion are attested from Geoffrey, three " +
          "centuries later, and not before. WHY IT MATTERS: any argument that the giants preserve a memory of a " +
          "real earlier population has to account for their absence from the earliest version of the very story " +
          "they belong to. WHAT IT DOES NOT SETTLE: whether Geoffrey invented them or drew on Welsh material " +
          "that happens not to survive — the next record is about exactly that.",
        notes:
          "VERIFIED. This was flagged as the riskiest claim in the tranche — a claim about what a text does NOT " +
          "contain, which is the kind most easily got wrong at second hand. The Historia Brittonum has now been " +
          "read in full in the Giles translation. There are no giants in it: no Gogmagog, no Corineus, no " +
          "wrestling match, no Albion, no Troia Nova. The absence is real. REMAINING CAVEAT, and it is not " +
          "nothing: this was checked in a Victorian English translation, not in the Latin recensions, and a " +
          "reading of the Harleian text is still the thing that would close it properly.",
      },
    ],
  },

  {
    slug: "gogmagog-and-corineus",
    title: "Corineus wrestles Gogmagog",
    summary:
      "Twelve cubits tall, able to uproot oaks like hazel wands. He breaks three of Corineus's ribs and is thrown from a cliff — at a place the tradition remembered as Gogmagog's Leap.",
    description:
      "WHAT KIND OF RECORD IS THIS? An episode in a twelfth-century text, and the single most durable image the tradition produced.\n\n" +
      "WHAT THE TRADITION GIVES. Gogmagog — Goemagot in Geoffrey's spelling — is the champion of the giants who held the island before the Trojans. He is twelve cubits tall and can pull up oak trees as though they were hazel wands. When the surviving giants attack, he is kept alive so that Corineus can wrestle him. On the cliffs by the sea they grapple; Gogmagog crushes three of Corineus's ribs; the enraged Corineus lifts him onto his shoulders and hurls him down onto the rocks. The place was long remembered as Gogmagog's Leap, and the tradition attaches it to the coast near Plymouth.\n\n" +
      "TWELVE CUBITS IS ABOUT FIVE AND A HALF METRES, on the usual reckoning. It is a literary measurement in a literary text and nothing about it invites checking — but noting what the figure actually amounts to is worth doing, because the same exercise is what makes Goliath's height interesting in the Hebrew dataset.\n\n" +
      "THE NAME IS A PROBLEM, AND A LATER TRANCHE'S PROBLEM. Goemagot, Gogmagog, and eventually Gog and Magog — two figures where there was one, carrying names out of Ezekiel and Revelation, standing in the Guildhall as guardians of the City of London. That transformation is real, datable and strange, and it gets its own records rather than being compressed into this one.\n\n" +
      "WHAT SURVIVES AND WHAT DOES NOT. No archaeology attaches to any of this. What does survive is the place-name tradition and, later, an unbroken civic ceremony — which is evidence about the story's life, not about its origin.\n\n" +
      "THINGS TO ASK: Why keep one giant alive for a wrestling match rather than simply winning? What does it mean that the defeated enemy is the one the tradition remembers by name? Where does a story go when it stops being believed and keeps being performed?",
    category: "culture",
    subcategory: "Legendary episode",
    eventType: "traditional_account",
    tags: ["gogmagog", "corineus", "giants", "cornwall", "plymouth", "brutus"],
    people: ["Gogmagog", "Corineus"],
    civilisations: ["Legendary Britain"],
    locationName: "The cliffs near Plymouth, in the tradition",
    claims: [
      {
        sourceKey: "wikipedia_gogmagog",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "primordial",
        whatIsDated: "When the wrestling happened",
        originalDateText: "Shortly after the Trojan landing — a position in the narrative, not a date",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "WHAT THE TEXT GIVES: a sequence. The landing, the division of the land, the festival, the giants' " +
          "attack, the wrestling. No interval is stated and no year is implied. RECORDED WITHOUT A POSITION " +
          "because the alternative is to inherit the landing's computed date and pass it off as this episode's, " +
          "which would be inventing a second date out of the first.",
        notes:
          "NEEDS SOURCE VERIFICATION for the details as Geoffrey gives them — twelve cubits, the oaks, the three " +
          "ribs, the cliff and the name of the place. They are quoted here from reference works rather than from " +
          "the text, and the specific numbers are exactly the sort of detail that drifts in retelling.",
      },
      {
        sourceKey: "geoffrey_hrb",
        startYear: 1136,
        datePrecision: "decade",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "When the wrestling episode is first attested",
        originalDateText: "First appears in the 1130s",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "THE DATE THAT CAN ACTUALLY BE ARGUED. The episode is not in the Historia Brittonum. It appears in " +
          "Geoffrey. So the earliest evidence for the most famous scene in British foundation legend is a text of " +
          "the 1130s — which is the kind of fact that ought to sit beside the story every time it is told.",
      },
    ],
  },

  {
    slug: "welsh-giants-before-geoffrey",
    title: "Did Welsh tradition have giants before Geoffrey?",
    summary:
      "Culhwch ac Olwen has Ysbaddaden Pencawr, chief of giants. Whether it is older than Geoffrey or younger is argued — and the whole question turns on that.",
    description:
      "WHAT KIND OF RECORD IS THIS? A dating dispute, and one that decides what a neighbouring record is allowed to say.\n\n" +
      "THE QUESTION. Geoffrey's giants of Albion are attested from the 1130s. Did he invent the idea of British giants, or was he drawing on a Welsh tradition that already had them?\n\n" +
      "THE EVIDENCE. Culhwch ac Olwen, a Welsh prose tale, has Ysbaddaden Pencawr — the name means something like chief of giants — as the father Culhwch must win Olwen from. It is among the earliest Welsh prose we have and is often placed about 1100, which would put it before Geoffrey.\n\n" +
      "AND THE COMPLICATION. A linguistic reassessment by Simon Rodway in 2005 dates it to the latter half of the twelfth century — which would put it AFTER Geoffrey, and destroy its value as independent evidence for pre-Geoffrey giants. Scholarly opinion is divided.\n\n" +
      "THE MANUSCRIPTS ARE LATER AGAIN, and this is a separate matter from composition. The tale survives in two: fragmentarily in the White Book of Rhydderch, about 1325, and completely in the Red Book of Hergest, about 1400. So the physical evidence is two hundred to three hundred years after even the late dating.\n\n" +
      "WHAT THIS RECORD CONCLUDES, WHICH IS NOT MUCH ON PURPOSE. Welsh tradition certainly has giants. Whether it had them before Geoffrey wrote is genuinely open, and a reader should know that the confident version of this argument — in either direction — is more confident than the evidence.\n\n" +
      "AND WHAT IT WOULD AND WOULD NOT SHOW EITHER WAY. If the early date is right, Geoffrey did not invent British giants from nothing. That still would not make his giants of Albion a Bronze Age memory: a twelfth-century author using an eleventh-century motif is a fact about literature.\n\n" +
      "THINGS TO ASK: What kind of evidence dates a text whose manuscripts are three centuries younger than its language? If both datings have serious support, what should a timeline show? Does it matter, for the Brutus story, which is right?",
    category: "culture",
    subcategory: "Dating dispute",
    eventType: "disputed",
    eventTypeNote:
      "Specialists actively disagree, and the disagreement is about a date rather than about what the text says. Both datings are recorded with their reasoning.",
    tags: ["welsh", "culhwch", "ysbaddaden", "giants", "dating", "mabinogion"],
    people: ["Ysbaddaden Pencawr", "Simon Rodway"],
    civilisations: ["Medieval Wales"],
    claims: [
      {
        sourceKey: "culhwch_olwen",
        startYear: 1100,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When Culhwch ac Olwen was composed, on the earlier dating",
        originalDateText: "about 1100",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: composition about 1100, which would place the tale a generation or more before " +
          "Geoffrey. HOW IT IS OBTAINED: from the archaism of the language and the tale's position among early " +
          "Welsh prose. WHAT IT WOULD ESTABLISH: that Welsh tradition had giants independently of Geoffrey, and " +
          "therefore that he was working with existing material rather than inventing a category.",
      },
      {
        sourceKey: "rodway2005",
        startYear: 1150,
        endYear: 1200,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When Culhwch ac Olwen was composed, on the later dating",
        originalDateText: "the latter half of the twelfth century",
        datingMethod: "stylistic_comparison",
        chronology: "disputed",
        evidence:
          "WHAT IS CLAIMED: that linguistic features place the tale in the second half of the twelfth century. " +
          "WHY IT MATTERS SO MUCH HERE: it would put Culhwch AFTER Geoffrey, which removes it as independent " +
          "evidence for pre-Geoffrey Welsh giants and leaves the question open again. THIS IS NOT A FRINGE " +
          "POSITION: it is a specialist linguistic redating, and it is why this record is filed as disputed " +
          "rather than settled.",
        notes:
          "NEEDS SOURCE VERIFICATION for the argument rather than the citation, which is now had: Cambrian " +
          "Medieval Celtic Studies 49 (2005), 21–44. Which features carry the redating, and what the replies to " +
          "it have been, still need somebody with the article open.",
      },
      {
        sourceKey: "culhwch_olwen",
        startYear: 1325,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The oldest surviving manuscript of the tale",
        originalDateText: "the White Book of Rhydderch, about 1325, and fragmentary",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "THE PHYSICAL EVIDENCE, which is later than either composition date by two centuries or more and is " +
          "incomplete. The complete text is in the Red Book of Hergest, about 1400. WHY IT IS ON THE RECORD: " +
          "because a dispute about a text's date should be read next to the fact that nobody has a copy from " +
          "anywhere near the period being argued about.",
      },
    ],
  },

  {
    slug: "trinovantum-new-troy",
    title: "Did Brutus found New Troy?",
    summary:
      "Geoffrey says London was Troia Nova, worn down to Trinovantum. Modern scholarship says the real Iron Age tribe came first and the legend was built backwards from its name.",
    description:
      "WHAT KIND OF RECORD IS THIS? Two claims about one word, pointing in opposite directions. Both are here.\n\n" +
      "THE TRADITIONAL CLAIM. Brutus founded a city on the Thames and called it Troia Nova, New Troy. The name was gradually corrupted to Trinovantum, and the city later became London. In the tradition this is the origin of London and the reason the Britons could claim Trojan descent as a civic fact and not only a royal one.\n\n" +
      "THE MAINSTREAM OBJECTION, WHICH IS ABOUT DIRECTION. There was a real Iron Age people in south-eastern Britain called the Trinovantes, named in Caesar. The linguistic reading of their name has nothing to do with Troy — it is generally taken as Celtic, with the intensive prefix tri- and an element meaning new, giving something like 'the very vigorous' or 'the newcomers'. On this account the tribal name is the older thing, the city name Trinovantum was inferred from it by early medieval writers reading ambiguous Latin in Caesar and Orosius, and Geoffrey then explained Trinovantum by inventing Troia Nova. The causality in the legend runs backwards.\n\n" +
      "WHAT THIS RECORD DOES WITH THAT. It records both, with their reasoning, and does not merge them. The mainstream account is the mainstream account and is marked as such. It is also worth seeing how it works: it is not a flat denial but a specific alternative history of a word, which is a much more interesting thing to put in front of a reader.\n\n" +
      "A CORRECTION THIS RECORD NEEDED, AND IT CUTS TOWARDS THE OBJECTION. This dataset implied the name " +
      "Trinovantum enters the story with Geoffrey. It does not. The Historia Brittonum, three centuries earlier, " +
      "already has it: at chapter 20 the Romans under Julius defeat the Britons 'near a place called " +
      "Trinovantum'. But it appears there as a BARE PLACE NAME — no Brutus, no foundation, no Troy, no " +
      "etymology. So the sequence is: the name is in circulation by the ninth century as somewhere a battle " +
      "happened; Geoffrey in the 1130s supplies Troia Nova to explain it. That is precisely the direction the " +
      "mainstream objection describes, and it is now attested rather than inferred.\n\n" +
      "THE SAME PATTERN RUNS THROUGH THE WHOLE TRADITION. Brutus explains Britain. Corineus explains Cornwall. Locrinus, Kamber and Albanactus explain Loegria, Cambria and Albany. Troia Nova explains Trinovantum. These are etymological legends — stories generated to account for names that already existed — and recognising the pattern is more useful than arguing about any single one of them.\n\n" +
      "THINGS TO ASK: Which is more likely, that a name wore down from Troia Nova to Trinovantum, or that somebody who knew the name Trinovantum built a story to explain it? What would settle it? Does the pattern across all the names strengthen the objection or weaken it?",
    category: "history",
    subcategory: "Etymology and origin",
    eventType: "disputed",
    eventTypeNote:
      "A genuine dispute with a clear mainstream position. Both the traditional etymology and the linguistic objection are recorded with their reasoning; the mainstream one is marked as mainstream.",
    tags: ["new-troy", "trinovantum", "trinovantes", "london", "etymology", "brutus"],
    civilisations: ["Legendary Britain", "Iron Age Britain"],
    locationName: "London",
    claims: [
      {
        sourceKey: "geoffrey_hrb",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether London was founded as New Troy",
        originalDateText: "Troia Nova, corrupted over time to Trinovantum",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "WHAT IS CLAIMED: that Brutus founded a city on the Thames named New Troy, and that the name wore down " +
          "into Trinovantum before the city became London. WHO CLAIMS IT: Geoffrey, in the 1130s. WHY NO " +
          "POSITION ON THE STRIP: the founding would belong to the traditional Brutus chronology, and giving it " +
          "its own year would be spending the landing's computed date twice. This is a claim about a name's " +
          "history, and it is recorded as one.",
      },
      {
        sourceKey: "historia_brittonum",
        startYear: 830,
        datePrecision: "year",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "When the name Trinovantum is first attested, without any Trojan etymology",
        originalDateText: "'a place called Trinovantum' — Historia Brittonum 20, about 829-830",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHAT IS ESTABLISHED, BY READING THE TEXT: the Historia Brittonum uses the name three centuries before " +
          "Geoffrey. At chapter 20 the Romans under Julius defeat the Britons 'near a place called Trinovantum', " +
          "forty-seven years before Christ. WHAT IS NOT THERE: any connection to Brutus, to a foundation, or to " +
          "Troy. It is a bare toponym in a battle notice. WHY THAT IS EVIDENCE AND NOT TRIVIA: it separates the " +
          "NAME from the ETYMOLOGY and dates them apart. The name is in circulation by the ninth century; the " +
          "Troia Nova explanation arrives with Geoffrey in the 1130s. An explanation that postdates the thing it " +
          "explains by three hundred years is the signature of an etymological legend. WHAT IT STILL DOES NOT " +
          "SETTLE: where the ninth-century compiler got the name, which is the next question and is open.",
        notes:
          "Read in the Giles translation. CAUTION: '(London)' in Giles at this point is the TRANSLATOR'S " +
          "parenthetical gloss, not the text's — the Historia does not there identify Trinovantum with London. " +
          "Mistaking a Victorian editor's helpfulness for a ninth-century statement is exactly the error this " +
          "claim is designed to prevent.",
      },
      {
        sourceKey: "wikipedia_trinovantum",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether London was founded as New Troy",
        originalDateText: "The tribal name came first; the legend was built backwards from it",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that the real Iron Age Trinovantes are the origin of the word, that their name is " +
          "Celtic and unrelated to Troy — read as the intensive prefix tri- with an element meaning new, so " +
          "roughly 'the very vigorous' or 'the newcomers' — and that a city called Trinovantum was inferred by " +
          "early medieval writers from ambiguities in Caesar and Orosius before Geoffrey explained it with Troia " +
          "Nova. WHAT SUPPORTS IT: ordinary historical linguistics, and the existence of the tribe in " +
          "contemporary Roman sources, which the legendary city conspicuously lacks. WHAT IT DOES NOT DO: " +
          "establish that Geoffrey acted dishonestly. Explaining an inherited name with a story is what " +
          "etymological legend IS, and he had plenty of company.",
        notes:
          "NEEDS SOURCE VERIFICATION for the linguistic reading of Trinovantes, which is given here at second " +
          "hand, and for the role attributed to Bede and to the Caesar and Orosius passages.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// The relationships
//
// As in the 33 tranche, the brief's A-to-G transmission classes do not exist in
// EVENT_RELATIONS and are not being invented ahead of the records that need
// them — the edges here are textual descent and dispute, which the existing
// vocabulary states accurately. The class each edge would take is in its note.
// ---------------------------------------------------------------------------

export const BRUTUS_ALBION_LINKS: SeedEventLink[] = [
  {
    from: "historia-brittonum-brutus",
    to: "geoffrey-writes-the-historia-regum-britanniae",
    relation: "source_of",
    viewpoint: "conventional",
    sourceKey: "geoffrey_hrb",
    note:
      "Class A where it can be seen — Geoffrey demonstrably had the earlier tradition, because the Trojan descent " +
      "is in both. What he did with it in between is the argument, and the two records are linked so the " +
      "comparison is one click rather than a paragraph.",
  },
  {
    from: "historia-brittonum-brutus",
    to: BRUTUS_ALBION_ANCHOR_SLUG,
    relation: "evidence_for",
    viewpoint: "conventional",
    sourceKey: "historia_brittonum",
    note:
      "The earliest evidence there is, and it is evidence for the TRADITION rather than for the events. That " +
      "distinction is the one this whole cluster is built to keep, so the edge states it.",
  },
  {
    from: "geoffrey-writes-the-historia-regum-britanniae",
    to: "giants-of-albion",
    relation: "source_of",
    viewpoint: "conventional",
    sourceKey: "geoffrey_hrb",
    note: "The giants of Albion are attested from here and not before. The edge is where that fact lives.",
  },
  {
    from: "geoffrey-writes-the-historia-regum-britanniae",
    to: "gogmagog-and-corineus",
    relation: "source_of",
    viewpoint: "conventional",
    sourceKey: "geoffrey_hrb",
    note: "Likewise the wrestling. The most famous scene in British foundation legend is first attested in the 1130s.",
  },
  {
    from: "giants-of-albion",
    to: "gogmagog-and-corineus",
    relation: "precedes",
    viewpoint: "traditional",
    sourceKey: "geoffrey_hrb",
    note: "Within the narrative: the giants are displaced first, and their champion is dealt with afterwards.",
  },
  {
    from: "welsh-giants-before-geoffrey",
    to: "giants-of-albion",
    relation: "relevant",
    viewpoint: "disputed",
    sourceKey: "culhwch_olwen",
    note:
      "Relevant WITHOUT being evidence, which is precisely the state of it: if the early dating of Culhwch is " +
      "right this bears on whether Geoffrey invented British giants, and if the later dating is right it bears on " +
      "nothing at all. The relation exists so the two can be seen together without the link being read as support.",
  },
  {
    from: BRUTUS_ALBION_ANCHOR_SLUG,
    to: "trinovantum-new-troy",
    relation: "responds_to",
    viewpoint: "traditional",
    sourceKey: "geoffrey_hrb",
    note:
      "New Troy is part of the same tradition and the same etymological habit — Brutus explains Britain, Corineus " +
      "explains Cornwall, Troia Nova explains Trinovantum.",
  },
  {
    from: "documentary-gap-brutus",
    to: BRUTUS_ALBION_ANCHOR_SLUG,
    relation: "relevant",
    viewpoint: "conventional",
    sourceKey: "historia_brittonum",
    note:
      "The gap is a fact about the anchor's evidence, kept as its own record so it cannot be skimmed past as a " +
      "footnote. Linked rather than merged for the same reason.",
  },
];
