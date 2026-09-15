import type { SeedEvent, SeedSource, SeedTrack, SeedEventLink } from "./seed-types";

// =============================================================================
// THE NUMBER 33, PART ONE: THE OLDEST CHAIN
//
// First tranche of a dataset asking why 33 keeps turning up in religion,
// cosmology and initiation — and whether the examples are historically
// connected or merely all equal to 33.
//
// THIS TRANCHE COVERS THE PART WHERE THE EVIDENCE IS STRONGEST: the Vedic 33
// gods, how they were later sorted into classes, the Buddhist Heaven of the
// Thirty-Three, and the two claims most often made about the number's age —
// that Zoroastrianism attests it too, and that the Vedas really speak of 330
// million gods. Both of those turn out to be weaker than they are usually
// presented, and saying so is most of what this tranche is for.
//
// FOUR DIFFERENT QUESTIONS WEAR ONE COAT, exactly as in the giants dataset:
//
//   1. WHEN DOES THE TEXT SAY IT HAPPENED? Usually nothing — a hymn addressing
//      thirty-three gods is not dating anything.
//   2. WHEN WAS THE TEXT COMPOSED? Arguable, and argued.
//   3. WHEN WAS THE OLDEST SURVIVING COPY WRITTEN? For the Rgveda that is the
//      eleventh century CE — roughly two and a half thousand years after
//      composition, which is the single most important fact on this record and
//      the one most often left out.
//   4. WHEN DID A TRADITION SAY THE TEXT BEGAN? The doctrinal position that the
//      Veda is authorless and beginningless is a claim about time and is
//      recorded as one, with no position on the strip.
//
// A NOTE ON THIS TRANCHE'S SOURCING, WRITTEN HERE SO NOBODY HAS TO GUESS. It
// was assembled in an environment whose network policy blocks every host the
// primary texts live on — wisdomlib, sacred-texts, avesta.org, Encyclopaedia
// Iranica, Wikipedia, archive.org. Search worked; opening the page did not. So
// verse numbers, translated wording and dates here come from search results
// quoting those pages, NOT from reading the pages. Every claim that needs
// somebody to open the book says NEEDS SOURCE VERIFICATION in its own notes,
// naming exactly what to check. See docs/timeline-research-briefs.md.
//
// NO CONFIDENCE SCORES. No verdicts. Where a tradition makes a claim, the claim
// is recorded and attributed to whoever makes it.
// =============================================================================

const bce = (year: number): number => 1 - year;

export const THIRTY_THREE_VEDIC_ANCHOR_SLUG = "rigveda-thirty-three-gods";

export const THIRTY_THREE_TRACK: SeedTrack = {
  name: "The number 33: where it appears, and whether the appearances are connected",
  slug: "thirty-three",
  kind: "theme",
  color: "#8a5a2b",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const THIRTY_THREE_VEDIC_SOURCES: SeedSource[] = [
  {
    key: "rigveda",
    title: "The Rgveda",
    workTitle: "The Rgveda",
    sourceType: "religious_text",
    notes:
      "The primary text. Cited for the hymns that address thirty-three gods, among them 8.30.2, which addresses " +
      "them collectively, and 1.139.11, which groups them as three elevens. NEEDS SOURCE VERIFICATION for the " +
      "full list of passages: this dataset was built without access to a searchable text, so the verses named " +
      "here are the ones that surfaced in reference works rather than the result of a search of the Samhita.",
  },
  {
    key: "griffith_rigveda",
    title: "The Hymns of the Rigveda, translated by Ralph T. H. Griffith",
    author: "Ralph T. H. Griffith",
    reference: "1889–1892; the translation most often quoted in English",
    url: "http://sanskritweb.net/rigveda/griffith-p.pdf",
    sourceType: "book",
    publishedYear: 1892,
    notes:
      "The English wording quoted on these records. Cited as a TRANSLATION and not as the text: Griffith is " +
      "Victorian, his renderings are dated, and a reader comparing numbers across traditions should know they are " +
      "comparing one nineteenth-century Englishman's choices. Used because it is public and checkable.",
  },
  {
    key: "satapatha_brahmana",
    title: "The Satapatha Brahmana",
    workTitle: "The Satapatha Brahmana",
    reference: "Madhyandina recension; the enumeration of the thirty-three is cited at 11.6.3",
    url: "https://www.wisdomlib.org/hinduism/book/satapatha-brahmana-sanskrit/d/doc1057139.html",
    sourceType: "religious_text",
    notes:
      "The ritual prose that sorts the thirty-three into classes, and the setting of the Yajnavalkya dialogue " +
      "about how many gods there are. NEEDS SOURCE VERIFICATION for the exact wording and for whether the " +
      "enumeration ending in Indra and Prajapati and the one ending in Dyaus and Prthivi sit in different places " +
      "in the text or different recensions.",
  },
  {
    key: "brhadaranyaka",
    title: "Brhadaranyaka Upanisad 3.9",
    workTitle: "The Brhadaranyaka Upanisad",
    url: "http://www.swami-krishnananda.org/brdup/brhad_III-09.html",
    sourceType: "religious_text",
    notes:
      "Vidagdha Sakalya asks Yajnavalkya how many gods there are and is answered three thousand three hundred and " +
      "six, then thirty-three, then six, three, two, one and a half, and one. Cited because the passage does the " +
      "job this whole dataset exists to do: it holds several answers at once and says what each is an answer TO.",
  },
  {
    key: "wikipedia_thirty_three",
    title: "Thirty-three gods",
    url: "https://en.wikipedia.org/wiki/Thirty-three_gods",
    sourceType: "wikipedia",
    notes:
      "Orientation only, and the route to the passages. Cited where it reports which text says what — the " +
      "collective address at Rgveda 8.30.2, the Satapatha enumeration, Yaska's division into three groups of " +
      "eleven. Follow its references rather than trusting it; that is what it is for.",
  },
  {
    key: "encyclopedia_buddhism_trayastrimsa",
    title: "Trayastrimsa",
    workTitle: "Encyclopedia of Buddhism",
    url: "https://encyclopediaofbuddhism.org/wiki/Tr%C4%81yastri%E1%B9%83%C5%9Ba",
    sourceType: "encyclopedia",
    notes:
      "Cited for the statement that the heaven takes its name from the thirty-three gods of an older Indian " +
      "tradition, and that the number is a general term inherited from Vedic mythology rather than a count of the " +
      "beings who live there — there are said to be far more. That distinction is the whole of the transmission " +
      "argument on this record.",
  },
  {
    key: "palikanon_tavatimsa",
    title: "Tavatimsa",
    workTitle: "Dictionary of Pali Proper Names",
    url: "https://www.palikanon.com/english/pali_names/t/taavatimsa.htm",
    sourceType: "encyclopedia",
    notes:
      "The Pali-canon references for Tavatimsa gathered in one place — Sakka as its king, the Pandukambala stone " +
      "seat, the Paricchattaka tree, the tradition that the Buddha taught there for three months. Cited for where " +
      "in the canon the heaven appears. NEEDS SOURCE VERIFICATION for which of those references is earliest.",
  },
  {
    key: "iranica_amesa_spenta",
    title: "AMESA SPENTA",
    workTitle: "Encyclopaedia Iranica",
    url: "https://www.iranicaonline.org/articles/amesa-spenta-beneficent-divinity/",
    sourceType: "encyclopedia",
    notes:
      "THE KEY SOURCE FOR THE NEGATIVE FINDING. Reported as stating that in present-day Zoroastrianism the term " +
      "is frequently used for the thirty-three divinities that have either a day-name dedication in the " +
      "Zoroastrian calendar or a Yasht of their own. That is a modern usage generated by a calendar, and it is " +
      "not the same kind of thing as a text naming thirty-three gods. NEEDS SOURCE VERIFICATION: this is quoted " +
      "from a search result, and the article itself could not be opened.",
  },
  {
    key: "avesta_yasna",
    title: "The Yasna",
    workTitle: "The Avesta",
    url: "https://www.avesta.org/yasna/yasna.htm",
    sourceType: "religious_text",
    notes:
      "Cited for what could NOT be found in it. Searches for an Avestan passage naming thirty-three divine beings " +
      "returned the Visperad's vispe ratavo, 'all the ratus', and the thirty-three dedications of the Siroza — the " +
      "thirty-day calendar text — and no enumeration of thirty-three gods. NEEDS SOURCE VERIFICATION by somebody " +
      "who can read Yasna 1.10 and the Visperad in Avestan; absence found by searching is not absence.",
  },
  {
    key: "vkic_thirty_three_koti",
    title: "Thirty Three Koti Divinities",
    publisher: "Vivekananda Kendra Institute of Culture",
    url: "https://www.vkic.org/Thirty-Three-Koti-Divinities",
    sourceType: "website",
    notes:
      "Cited as a statement of the widely-held traditional reading: that koti in trayastrimsati koti means class " +
      "or pre-eminence rather than ten million, so the texts mean thirty-three supreme divinities and not three " +
      "hundred and thirty million. Used as evidence that this reading is held and by whom — NOT as philology. " +
      "NEEDS SOURCE VERIFICATION against a Sanskrit lexicon and a critical edition.",
  },
  {
    key: "hup_two_oldest_veda_mss",
    title: "The Two Oldest Veda Manuscripts",
    publisher: "Harvard University Press",
    url: "https://www.hup.harvard.edu/catalog.php?isbn=9780674988262",
    sourceType: "academic_book",
    notes:
      "Cited for the manuscript question rather than the textual one: the oldest surviving Veda manuscripts are " +
      "medieval, and reported as Nepalese and of about the eleventh century. The gap between composition and the " +
      "oldest physical copy is the fact this record is built around.",
  },
  {
    key: "wikipedia_rigvedic_deities",
    title: "Rigvedic deities",
    url: "https://en.wikipedia.org/wiki/Rigvedic_deities",
    sourceType: "wikipedia",
    notes:
      "Orientation for which deities the Rgveda actually addresses and how often, which is the context that makes " +
      "the number thirty-three interesting: the hymns name far more than thirty-three gods, so thirty-three is a " +
      "formula rather than a census.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const THIRTY_THREE_VEDIC_EVENTS: SeedEvent[] = [
  {
    slug: THIRTY_THREE_VEDIC_ANCHOR_SLUG,
    title: "The Rgveda addresses thirty-three gods",
    summary:
      "The oldest securely attested religious use of the number. The hymns address thirty-three gods — and name far more than thirty-three gods, which is the first thing worth noticing.",
    description:
      "WHAT KIND OF RECORD IS THIS? A religious text. What is dated is the text, not an event: nothing happens in these verses that could be given a year.\n\n" +
      "WHAT THE HYMNS ACTUALLY DO. They address a body of gods numbered at thirty-three. Rgveda 8.30.2 speaks to them collectively as the Three-and-Thirty. Rgveda 1.139.11 sorts them into three elevens, and Griffith's English runs: 'O ye Eleven Gods whose home is heaven, O ye Eleven who make earth your dwelling, Ye who with might, Eleven, live in waters, accept this sacrifice, O Gods, with pleasure.'\n\n" +
      "THIRTY-THREE IS A FORMULA, NOT A CENSUS, and the text itself shows it. The Rgveda names many more than thirty-three divine beings across its hymns. So the number is not a count of everything divine; it is a way of saying the whole body of them, arranged. A reader who arrives expecting a list of thirty-three names and finds hundreds of gods has not caught the text out — they have found the point.\n\n" +
      "THREE DATES, AND THEY ARE ANSWERS TO THREE DIFFERENT QUESTIONS. When the hymns were composed is a scholarly argument, generally placed in the second millennium BCE. When they were fixed into the collection we have is a later moment again. And when the oldest surviving physical copy was written is the eleventh century CE — about two and a half thousand years after composition, because the text was carried orally and carried with extraordinary care. All three are on this record, kept apart.\n\n" +
      "AND A FOURTH KIND OF CLAIM, which is not a scholarly date at all. The doctrinal position within the tradition is that the Veda is apauruseya — not of human authorship, and without beginning. That is a claim about time, it is held by a great many people, and it is recorded here as what it is: a claim with no position on a strip, rather than an early date.\n\n" +
      "WHY THIS RECORD ANCHORS THE DATASET. On present evidence this is the oldest securely attested spiritual use of thirty-three anywhere. Whether anything older lies behind it — an Indo-Iranian inheritance shared with the Avesta — is a separate record, and the short answer there is that the usual argument for it does not hold up.\n\n" +
      "THINGS TO ASK: Is thirty-three a count or a formula? Which of the three dates does a claim about 'the age of the Vedic 33' actually mean? Does a text carried orally for two thousand years before anyone wrote it down count as older or younger evidence than one written at the time — and why?",
    category: "religion",
    subcategory: "Vedic religion",
    eventType: "religious_account",
    eventTypeNote:
      "A religious text, dated as a text. The existence of the passages is not disputed; their date is argued, and the tradition's own view of their origin is a different kind of claim again.",
    tags: ["thirty-three", "rigveda", "vedic", "gods", "india", "oral-transmission"],
    civilisations: ["Vedic India"],
    locationName: "North-western South Asia",
    claims: [
      {
        sourceKey: "wikipedia_thirty_three",
        startYear: bce(1500),
        endYear: bce(1200),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the bulk of the hymns were composed",
        originalDateText: "roughly 1500 to 1200 BCE",
        datingMethod: "estimate",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that most of the Rgvedic hymns were composed in the second half of the second millennium BCE. " +
          "HOW IT IS OBTAINED: not by dating an object — there is no object — but by historical linguistics. The " +
          "language is archaic Old Indo-Aryan, its relationship to Avestan and to later Sanskrit puts it in a " +
          "sequence, and the material culture the hymns describe is placed against what archaeology shows. The " +
          "range is associated above all with Michael Witzel. WHAT IT DOES NOT ESTABLISH: any particular verse's " +
          "date. A collection composed over centuries does not have one birthday, and the thirty-three passages " +
          "are not individually dated by it.",
        notes:
          "NEEDS SOURCE VERIFICATION for the primary publication: the attribution to Witzel and the 1500–1200 BCE " +
          "range are taken from reference works quoting him, not from his own paper, which could not be opened " +
          "from the environment this dataset was built in.",
      },
      {
        sourceKey: "wikipedia_thirty_three",
        startYear: bce(1200),
        endYear: bce(1000),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the hymns were codified into the collection that survives",
        originalDateText: "about 1200 to 1000 BCE, in the early Kuru kingdom",
        datingMethod: "estimate",
        chronology: "conventional",
        evidence:
          "A SECOND AND DIFFERENT MOMENT: composing hymns and arranging them into a fixed, ordered, memorised " +
          "collection are separate acts, and the second is placed later than the first. It matters here because " +
          "'the Rgveda says thirty-three' is a statement about the collection, and the collection is the later " +
          "thing.",
        notes:
          "Held apart from the composition range rather than merged with it. A single span from 1500 to 1000 BCE " +
          "would hide the distinction this claim exists to make.",
      },
      {
        sourceKey: "hup_two_oldest_veda_mss",
        startYear: 1040,
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The oldest surviving physical manuscript of the text",
        originalDateText: "about 1040 CE",
        datingMethod: "stylistic_comparison",
        chronology: "conventional",
        evidence:
          "THE ONLY DATE HERE THAT ATTACHES TO AN OBJECT SOMEBODY CAN HOLD. The oldest surviving Rgveda " +
          "manuscripts are medieval and reported as Nepalese, of about the eleventh century — roughly two and a " +
          "half thousand years after the hymns are placed. WHAT THAT DOES AND DOES NOT MEAN: it does not mean the " +
          "text is medieval. The Vedic recitation tradition preserved the sound of the text to a degree that has " +
          "no parallel, with memorisation schemes built specifically to make corruption detectable. But it does " +
          "mean that every argument from the wording is an argument about a tradition of reciting, not about a " +
          "surviving ancient document — which is a different evidential situation from a Qumran scroll.",
        notes:
          "NEEDS SOURCE VERIFICATION for the manuscript's shelfmark and its palaeographic date; the eleventh-century " +
          "Nepalese figure comes from reference works rather than a catalogue entry.",
      },
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "no_beginning",
        whatIsDated: "Whether the Veda has an origin in time at all",
        originalDateText: "Apauruseya — not of human authorship, and without beginning",
        datingMethod: "source_assertion",
        chronology: "religious",
        evidence:
          "WHAT IS CLAIMED: within the orthodox tradition the Veda is apauruseya, not composed by any person, " +
          "human or divine, and beginningless — heard by the rsis rather than written by them. WHY IT HAS NO " +
          "POSITION ON THE STRIP: it is not an early date. It is the position that the question 'when was it " +
          "composed?' does not apply, which is a different answer and is recorded as one. This timeline can hold " +
          "a claim with no position, and this is what that is for. NOT OFFERED AS A RIVAL to the linguistic " +
          "dating: the two are answers to different questions and only look like competitors when both are forced " +
          "into a single number.",
        notes:
          "NEEDS SOURCE VERIFICATION for a citable statement of the doctrine — Mimamsa sources set it out at " +
          "length, and one of those should be cited here rather than the position being stated unattributed.",
      },
    ],
  },

  {
    slug: "thirty-three-sorted-into-classes",
    title: "The thirty-three are sorted into classes",
    summary:
      "Eight Vasus, eleven Rudras, twelve Adityas — and then two more, which are not the same two in every telling. The classifications disagree, and the disagreement is informative.",
    description:
      "WHAT KIND OF RECORD IS THIS? Ritual prose interpreting an older formula. The Rgveda gives the number; the Brahmana literature gives the breakdown, and the breakdown is later than the number.\n\n" +
      "THE USUAL ENUMERATION: eight Vasus, eleven Rudras, twelve Adityas — thirty-one — and then two more to make thirty-three. The Satapatha Brahmana is cited for Indra and Prajapati as the last two. Other statements of the scheme give Dyaus and Prthivi, sky and earth. Elsewhere again the pair is the two Asvins.\n\n" +
      "WHY THE CLASSIFICATIONS DIFFER, AND WHY THAT IS THE INTERESTING PART. Thirty-one is fixed and the last two float. That is what it looks like when a number is inherited and the contents are worked out afterwards: the total is the thing being preserved, and the filling is being argued about. A scheme invented all at once does not usually behave like this.\n\n" +
      "A SEPARATE AND OLDER ARRANGEMENT sits alongside the classes. Yaska, in the Nirukta, divides the thirty-three not into named families but across three worlds — eleven in heaven, eleven in the atmosphere, eleven on earth. That is the arrangement the Rgveda itself uses at 1.139.11, so it may be the older of the two ways of cutting the number up.\n\n" +
      "WHAT THIS RECORD IS NOT. It is not a list of which gods are 'really' the thirty-three. No such list exists to be recovered; several lists exist, they are attributed, and they are set side by side.\n\n" +
      "THINGS TO ASK: If the total is stable and the members are not, which came first? Does a tradition that keeps changing its mind about the contents look more like invention or more like inheritance? What would tell the difference?",
    category: "religion",
    subcategory: "Vedic religion",
    eventType: "religious_account",
    eventTypeNote:
      "Several sources give several enumerations. Filed as a religious account rather than disputed because the sources are not in conflict about facts — they are different interpretations of an inherited formula.",
    tags: ["thirty-three", "vedic", "vasus", "rudras", "adityas", "classification"],
    civilisations: ["Vedic India"],
    claims: [
      {
        sourceKey: "satapatha_brahmana",
        startYear: bce(900),
        endYear: bce(700),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the Brahmana prose that gives the enumeration was composed",
        originalDateText: "roughly the ninth to seventh centuries BCE",
        datingMethod: "estimate",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that the Satapatha Brahmana belongs to the later Vedic prose period, some centuries " +
          "after the Rgvedic hymns. HOW IT IS OBTAINED: by the language, which is later than the hymns' and " +
          "earlier than classical Sanskrit, and by the ritual system it presupposes. WHAT IT ESTABLISHES FOR THIS " +
          "RECORD: that the eight-eleven-twelve-and-two breakdown is demonstrably LATER than the number it " +
          "explains. The classification is an interpretation of an inherited total, not the source of it.",
        notes:
          "NEEDS SOURCE VERIFICATION for both the date range and the passage. The enumeration is attributed to " +
          "Satapatha Brahmana 11.6.3 in reference works; the text itself could not be opened, so whether the " +
          "Indra-and-Prajapati and Dyaus-and-Prthivi versions sit in different passages or different recensions " +
          "is unchecked and matters.",
      },
    ],
  },

  {
    slug: "yajnavalkya-how-many-gods",
    title: "\"How many gods are there?\" — the answer given seven times",
    summary:
      "Vidagdha Sakalya asks, and Yajnavalkya answers three thousand three hundred and six, then thirty-three, then six, three, two, one and a half, and one. All seven answers are correct.",
    description:
      "WHAT KIND OF RECORD IS THIS? A dialogue in a religious text — and the closest thing in this dataset to a statement of its own method.\n\n" +
      "WHAT HAPPENS. Sakalya asks Yajnavalkya how many gods there are. The answer is three thousand three hundred and six. He asks again; thirty-three. Again; six. Again; three, then two, then one and a half, then one. Each time the questioner presses, and each time a smaller number is given without the earlier one being withdrawn.\n\n" +
      "THE POINT IS NOT THAT SOMEBODY CHANGED THEIR MIND. The larger numbers are not errors corrected by the smaller. Each answer is an answer at a different level of description — the many powers, the thirty-three, and behind them the one. A reader who wants to know 'the real number' is being shown that the question has more than one correct answer depending on what is being counted.\n\n" +
      "WHY IT SITS IN THIS DATASET. It is the earliest place where somebody explicitly handles thirty-three as one figure among several rather than as the figure — and it does so inside the tradition that produced the number. Any modern argument that thirty-three is the hidden true count of something has this passage sitting awkwardly behind it.\n\n" +
      "WHERE IT IS. The dialogue is in the Brhadaranyaka Upanisad at 3.9, and the Brhadaranyaka is itself part of the Satapatha Brahmana — so this record and the classification record above are, in the manuscripts, closer together than they look here.\n\n" +
      "THINGS TO ASK: Can a question have several true answers at once? What is being counted differently each time? Does this passage support or undercut the idea that thirty-three is a fixed sacred quantity?",
    category: "religion",
    subcategory: "Upanisadic dialogue",
    eventType: "religious_account",
    tags: ["thirty-three", "upanisad", "yajnavalkya", "brhadaranyaka", "india"],
    people: ["Yajnavalkya", "Vidagdha Sakalya"],
    civilisations: ["Vedic India"],
    claims: [
      {
        sourceKey: "brhadaranyaka",
        startYear: bce(800),
        endYear: bce(600),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the Brhadaranyaka Upanisad was composed",
        originalDateText: "roughly the eighth to sixth centuries BCE",
        datingMethod: "estimate",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that the Brhadaranyaka is among the oldest Upanisads, later than the Rgvedic hymns " +
          "and earlier than the Buddhist canon. HOW IT IS OBTAINED: by language and by its place in the Vedic " +
          "corpus — it forms the closing part of the Satapatha Brahmana — and by which ideas it does and does not " +
          "yet have. WHAT IT DOES NOT ESTABLISH: a date for the dialogue as an event. Whether Yajnavalkya and " +
          "Sakalya ever spoke is not a question the text can answer.",
        notes:
          "NEEDS SOURCE VERIFICATION for the range, which is quoted from reference works rather than read out of " +
          "a critical edition, and for the exact sequence of numbers, which is given here as 3306, 33, 6, 3, 2, " +
          "one and a half, and 1.",
      },
    ],
  },

  {
    slug: "trayastrimsa-heaven-of-the-thirty-three",
    title: "The Buddhist Heaven of the Thirty-Three",
    summary:
      "Trayastrimsa in Sanskrit, Tavatimsa in Pali, and the name means exactly what it says. The number is inherited from Vedic religion — and it is not a count of who lives there.",
    description:
      "WHAT KIND OF RECORD IS THIS? A religious cosmology, and the clearest case of transmission in this dataset.\n\n" +
      "WHAT IT IS. The second of the heavens of the desire realm, on the summit of Mount Meru, ruled by Sakra — Sakka in Pali. It appears throughout the Pali canon; the tradition that the Buddha spent three months teaching there, seated on Sakka's stone throne beneath the Paricchattaka tree, is among the best-known episodes attached to it.\n\n" +
      "THE NAME IS THE EVIDENCE. Trayastrimsa is simply 'thirty-three'. Reference works state that the heaven takes its name from the thirty-three gods of the older Indian tradition — and, importantly, that the number is a general term inherited from Vedic mythology rather than an enumeration of its inhabitants, who are said to be far more numerous than thirty-three.\n\n" +
      "THAT SECOND HALF IS WHAT MAKES THIS TRANSMISSION RATHER THAN COINCIDENCE. If the heaven had thirty-three residents, two traditions could have arrived at thirty-three separately. Instead it has a great many residents and a name meaning thirty-three — which is what an inherited formula looks like after it has stopped being a count. A name that no longer fits its referent is carried, not invented.\n\n" +
      "AND SAKRA IS INDRA. The king of this heaven is the Vedic Indra under another name — the same thunderbolt, the same lordship over the gods. So the chain runs: the Vedic thirty-three, with Indra among them, becomes a heaven called Thirty-Three with Indra as Sakra at its head.\n\n" +
      "WHAT IS STILL OPEN. How early the specific arrangement of thirty-two gods around Sakra as the thirty-third is attested — a geometry often quoted — is not established by anything cited here, and it is a different claim from the name's inheritance.\n\n" +
      "THINGS TO ASK: What is the difference between two traditions sharing a number and one inheriting it? Does a name that no longer matches what it names count as stronger or weaker evidence of borrowing?",
    category: "religion",
    subcategory: "Buddhist cosmology",
    eventType: "religious_account",
    eventTypeNote:
      "A religious cosmology. The inheritance of the name from Vedic religion is the ordinary scholarly reading and is not contested; what is not established here is how early particular details of the heaven's arrangement appear.",
    tags: ["thirty-three", "buddhism", "trayastrimsa", "tavatimsa", "sakra", "indra", "meru"],
    people: ["Sakra", "Indra"],
    civilisations: ["Early Buddhism"],
    claims: [
      {
        sourceKey: "palikanon_tavatimsa",
        startYear: bce(400),
        endYear: bce(100),
        datePrecision: "century",
        isApproximate: true,
        temporalClaimType: "estimated_range",
        whatIsDated: "When the Pali canonical texts naming Tavatimsa took shape",
        originalDateText: "the Pali canon, generally placed between roughly the fourth and first centuries BCE",
        datingMethod: "estimate",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that the heaven is named across the Pali canon, whose material is generally placed in " +
          "the centuries after the Buddha and whose written fixing is placed later still. WHY THE RANGE IS WIDE: " +
          "the canon is a body of texts of different ages transmitted orally before being written, so a single " +
          "date for 'when Tavatimsa first appears' is not available from what is cited here. WHAT IT ESTABLISHES: " +
          "that the name is early Buddhist rather than a later addition — not the century of its first use.",
        notes:
          "NEEDS SOURCE VERIFICATION, and this is the weakest date in the tranche. The earliest specific canonical " +
          "reference to Tavatimsa has not been identified; a specialist should replace this range with a named " +
          "sutta and its own dating.",
      },
      {
        sourceKey: "encyclopedia_buddhism_trayastrimsa",
        datePrecision: "year",
        isApproximate: false,
        // "unknown" and not "proposed_correlation": the database permits a claim
        // with no year ONLY for cyclic, eternal, no_beginning, primordial,
        // previous_world and unknown. A proposed_correlation with no start year
        // is rejected at seed time, silently, leaving the record short of its
        // most important claim — which is exactly how this one nearly shipped.
        temporalClaimType: "unknown",
        whatIsDated: "That the name is inherited from the Vedic thirty-three rather than arrived at independently",
        originalDateText: "The number is inherited from Vedic mythology, not a count of the heaven's inhabitants",
        datingMethod: "textual_interpretation",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that Trayastrimsa takes its name from the thirty-three gods of the older Indian " +
          "tradition, and that within Buddhism the number functions as a general term for the whole body of gods " +
          "rather than as an enumeration — the heaven is said to hold far more than thirty-three. WHAT MAKES THIS " +
          "MORE THAN A RESEMBLANCE: the same religious culture, continuous in time and place; a shared name for " +
          "its king, Sakra being Indra; and a number that no longer matches what it counts, which is the " +
          "signature of an inherited formula rather than a fresh one. WHAT IT IS NOT: a documented act of " +
          "borrowing. Nobody wrote down that they took the number from the Vedas.",
        notes:
          "This is the transmission claim the tranche rests on. In the A-to-G scheme the brief asks for it is a B " +
          "— highly probable historical transmission — rather than an A, because the inheritance is inferred from " +
          "the evidence and not stated by any source.",
      },
    ],
  },

  {
    slug: "avestan-thirty-three-unresolved",
    title: "Is there an Avestan thirty-three?",
    summary:
      "Widely asserted online, and not found. What exists in Zoroastrianism is a modern usage counted off a thirty-day calendar — which is a different kind of thing.",
    description:
      "WHAT KIND OF RECORD IS THIS? An open question, and a negative finding — recorded because the claim it examines is repeated constantly and because a dataset that only holds positive results is a dataset that will mislead.\n\n" +
      "THE CLAIM. That the Avesta attests thirty-three divine beings, parallel to the Vedic thirty-three, and that the two together prove a shared Indo-Iranian inheritance older than either. It is stated widely and usually without a passage attached.\n\n" +
      "WHAT WAS LOOKED FOR AND NOT FOUND. Searches for an Avestan passage naming thirty-three divine beings — in the Yasna, in the Yashts, among the Amesa Spentas and yazatas — did not produce one. What they produced instead was the Visperad's vispe ratavo, 'all the ratus', which is a phrase about all of them rather than a count, and the thirty-three dedications of the Siroza, the thirty-day calendar text.\n\n" +
      "WHAT DOES EXIST, AND WHY IT IS NOT THE SAME THING. Encyclopaedia Iranica is reported as stating that in PRESENT-DAY Zoroastrianism the term Amesa Spenta is frequently used for the thirty-three divinities that have either a day-name dedication in the Zoroastrian calendar or a Yasht of their own. That is a real thirty-three. It is also a modern usage produced by counting entries in a calendar and a body of hymns — arithmetic on a liturgical system, not a text saying there are thirty-three gods.\n\n" +
      "WHY THE DIFFERENCE MATTERS SO MUCH HERE. If the Iranian thirty-three is generated by a thirty-day calendar, it cannot be evidence of a formula shared with the Vedas before the two traditions separated. It would be a second thirty-three arrived at independently, many centuries later, by a different route. The whole Proto-Indo-Iranian argument rests on this one point.\n\n" +
      "THE HONEST STATE OF IT. Absence found by searching is not absence. This dataset was assembled without access to the Avestan texts, and a negative search result is exactly the kind of finding that a specialist with the texts open could overturn in an afternoon. The record is filed as unresolved, not as refuted.\n\n" +
      "THINGS TO ASK: What would count as a real Avestan thirty-three — and what would not? If a number falls out of a calendar, in what sense does a tradition 'have' it? Who is asserting the parallel, and do they cite a passage?",
    category: "religion",
    subcategory: "Zoroastrianism",
    eventType: "disputed",
    eventTypeNote:
      "Disputed in the plainest sense: a claim is widely made, a passage supporting it has not been produced here, and the environment this record was written in could not open the texts to settle it. Filed as unresolved rather than as refuted.",
    tags: ["thirty-three", "avesta", "zoroastrian", "yasna", "amesa-spenta", "negative-finding"],
    civilisations: ["Ancient Iran"],
    claims: [
      {
        sourceKey: "iranica_amesa_spenta",
        startYear: 1900,
        isApproximate: true,
        datePrecision: "century",
        temporalClaimType: "approximate_date",
        whatIsDated: "When the thirty-three divinities of the calendar came to be spoken of that way",
        originalDateText: "In present-day Zoroastrianism — a modern usage, not an ancient one",
        datingMethod: "source_assertion",
        chronology: "conventional",
        evidence:
          "WHAT IS CLAIMED: that Amesa Spenta is used in present-day Zoroastrianism for the thirty-three " +
          "divinities with a day-name dedication in the calendar or a Yasht of their own. WHY IT IS DATED TO THE " +
          "MODERN PERIOD: because the source describes it as present-day usage. THE DATE IS DELIBERATELY VAGUE " +
          "and is a placeholder for 'recent, not ancient' rather than a finding about when the usage began — " +
          "which is not known from anything cited here. WHAT IT ESTABLISHES: that there is a genuine Zoroastrian " +
          "thirty-three, and that it is generated by a liturgical calendar rather than asserted by a text.",
        notes:
          "NEEDS SOURCE VERIFICATION. Quoted from a search result; the Encyclopaedia Iranica article could not be " +
          "opened. Somebody should read it and replace both the wording and this date with what it actually says.",
      },
      {
        sourceKey: "avesta_yasna",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether any Avestan passage names thirty-three divine beings",
        originalDateText: "No such passage found; the question is open",
        datingMethod: "textual_interpretation",
        chronology: "disputed",
        evidence:
          "WHAT WAS SEARCHED FOR: an Avestan passage enumerating thirty-three divine beings, of the kind the " +
          "Vedic hymns contain. WHAT CAME BACK: vispe ratavo, 'all the ratus', from the Visperad — a phrase " +
          "meaning all of them rather than a number — and the thirty-three dedications of the Siroza, which is " +
          "the thirty-day calendar text. NEITHER IS AN ENUMERATION OF GODS. WHAT THIS ESTABLISHES: nothing about " +
          "the Avesta. It establishes only that the passage is not easy to find, which is worth recording " +
          "precisely because the claim is made so confidently and so often without one. THE CLAIM COULD STILL BE " +
          "RIGHT: a specialist reading Yasna 1.10 and the Visperad in Avestan is the person to settle this, and " +
          "no such reading lies behind this record.",
        notes:
          "NEEDS SOURCE VERIFICATION, and this is the record in the tranche where it matters most. This claim is " +
          "positionless on purpose: it is a statement that the answer is not known, not a date. If an Avestan " +
          "thirty-three is produced, this record changes and so does the one about Proto-Indo-Iranian.",
      },
    ],
  },

  {
    slug: "proto-indo-iranian-thirty-three-hypothesis",
    title: "Was there a thirty-three before the Indo-Iranians separated?",
    summary:
      "The proposal that would make the number far older than the Rgveda — and it needs an Iranian thirty-three that has not been produced.",
    description:
      "WHAT KIND OF RECORD IS THIS? A hypothesis, filed as one. Nothing here is established.\n\n" +
      "THE PROPOSAL. Vedic religion and Iranian religion descend from a common Indo-Iranian ancestor: they share gods whose names correspond regularly — Mitra and Mithra, soma and haoma — and share a poetic and ritual vocabulary. If BOTH branches attested a body of thirty-three divine beings, the natural conclusion would be that the formula predates their separation, conventionally placed in the third or early second millennium BCE. That would make thirty-three substantially older than the surviving Rgveda.\n\n" +
      "WHY THE ARGUMENT IS SHAPED WELL. This is not a loose resemblance between distant cultures. Comparative Indo-Iranian reconstruction is an established method with real results, and a shared numerical formula would be an ordinary thing for it to recover.\n\n" +
      "WHY IT DOES NOT CURRENTLY STAND. It requires two branches, and only one has been produced. The Vedic thirty-three is secure. The Iranian thirty-three, on what this dataset could find, is a modern usage counted off a thirty-day calendar rather than an Avestan formula — and a number generated centuries later by a different mechanism cannot be the second witness the reconstruction needs.\n\n" +
      "WHAT WOULD CHANGE THIS. An Avestan passage naming thirty-three divine beings, read in Avestan, with its own textual date. That is all. It is a specific, findable thing, and its absence here is a limitation of this dataset and not a demonstration that it does not exist.\n\n" +
      "WHAT MUST NOT BE DONE WITH THIS RECORD. It must not be given a date in the third millennium BCE. The brief this dataset was built from asked for that date to be investigated and explicitly forbade assigning it without evidence, and there is no evidence. The claim below is therefore positionless: it is a live proposal with no established date, which is a different thing from an early one.\n\n" +
      "THINGS TO ASK: What exactly would a reconstruction need? Is one attested branch plus one modern calendar enough for anything? If the Iranian side fell away entirely, would the Vedic thirty-three become less interesting or more?",
    category: "religion",
    subcategory: "Comparative reconstruction",
    eventType: "hypothesised",
    eventTypeNote:
      "Proposed, not established. Filed here so the proposal can be examined rather than either asserted or quietly dropped — and deliberately carrying no date, because the evidence for one has not been produced.",
    tags: ["thirty-three", "proto-indo-iranian", "reconstruction", "comparative", "hypothesis"],
    civilisations: ["Proto-Indo-Iranian"],
    claims: [
      {
        sourceKey: null,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether a body of thirty-three divine beings predates the Indo-Iranian separation",
        originalDateText: "Proposed, undated — the evidence needed for a date has not been produced",
        datingMethod: "other",
        chronology: "hypothesis",
        evidence:
          "WHAT IS PROPOSED: that a formula of thirty-three divine beings was inherited by both the Vedic and the " +
          "Iranian traditions from their common ancestor, and therefore predates the Rgveda by a long way. " +
          "WHAT THE PROPOSAL WOULD NEED: attestation in both branches. WHAT IS AVAILABLE: attestation in one. " +
          "The Iranian thirty-three found by this dataset is a present-day usage counted from a thirty-day " +
          "calendar and a set of Yashts, which cannot serve as an independent ancient witness. WHY NO DATE IS " +
          "GIVEN: assigning this record to the third millennium BCE would be asserting the conclusion as its own " +
          "premise. IMPORTANT LIMITATION: this dataset could not open the Avestan texts, so the negative half of " +
          "the argument is as provisional as the positive half would be.",
        notes:
          "NEEDS SOURCE VERIFICATION throughout. No scholar is cited here as holding this position, because none " +
          "was identified — the proposal circulates widely in popular writing and whether it has a serious " +
          "academic proponent is itself unchecked. If it does, that person should be named and cited; if it does " +
          "not, that is worth recording too.",
      },
    ],
  },

  {
    slug: "thirty-three-becomes-three-hundred-and-thirty-million",
    title: "How thirty-three became 330 million",
    summary:
      "\"Hinduism has 33 crore gods\" is the most repeated claim about this number anywhere. The traditional answer is that koti was read as ten million when it meant something else.",
    description:
      "WHAT KIND OF RECORD IS THIS? A claim about a reading — and a dispute about one Sanskrit word.\n\n" +
      "THE FIGURE EVERYBODY HAS HEARD. That Hinduism has thirty-three crore gods — three hundred and thirty million. It appears in schoolbooks, in tourist guides, in arguments on both sides about Hindu polytheism.\n\n" +
      "WHERE IT COMES FROM. The expression trayastrimsati koti, reported in the Yajurveda, the Atharvaveda and the Satapatha Brahmana. In modern Indian usage koti means a crore, ten million. Multiply and you have 330 million.\n\n" +
      "THE OBJECTION, WHICH IS WIDELY HELD. That koti in this phrase does not mean ten million but class, category, or pre-eminence — so the texts are saying thirty-three supreme divinities, and the enormous figure is an artefact of picking the wrong sense of a word with several. This reading is set out by Hindu institutions and educators and is very widely repeated.\n\n" +
      "HOW THIS RECORD TREATS IT. The objection is recorded as a claim with a claimant, because that is what it is. It fits the rest of the evidence well: the Rgveda addresses thirty-three, the Brahmanas enumerate thirty-three, the Upanisad counts down to thirty-three, and nothing anywhere in that literature behaves as though there were hundreds of millions of gods. But this dataset could not open a Sanskrit lexicon or a critical edition, and the philology has not been checked here. IT IS NOT RECORDED AS SETTLED.\n\n" +
      "WHAT IS NOT IN DOUBT: that the thirty-three is the older and better-attested figure, and that any account of the number 33 in religion that starts from 330 million has started downstream of the interesting part.\n\n" +
      "THINGS TO ASK: Which sense of koti does the earliest commentary use? Who first translated it as crore, and when? Does the rest of the literature behave as though there were 330 million gods?",
    category: "religion",
    subcategory: "Interpretation and translation",
    eventType: "disputed",
    eventTypeNote:
      "A genuine dispute about the sense of one word, with a widely-held traditional reading on one side and long-established translation practice on the other. Not settled here, because the philology could not be checked.",
    tags: ["thirty-three", "koti", "crore", "translation", "hinduism", "misreading"],
    civilisations: ["Vedic India"],
    claims: [
      {
        sourceKey: "vkic_thirty_three_koti",
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "unknown",
        whatIsDated: "Whether trayastrimsati koti means thirty-three crore or thirty-three classes",
        originalDateText: "Koti here means class or pre-eminence, not ten million",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        evidence:
          "WHAT IS CLAIMED: that koti in trayastrimsati koti carries the sense of type, class or eminence, so the " +
          "phrase means thirty-three supreme divinities, and that reading it as a crore produces the familiar 330 " +
          "million by mistake. WHO CLAIMS IT: Hindu educational and cultural institutions, widely and " +
          "consistently. WHAT SUPPORTS IT: the surrounding literature, which addresses, enumerates and counts " +
          "down to thirty-three and never operates with a figure in the hundreds of millions. WHAT IS NOT " +
          "ESTABLISHED HERE: the philology. Whether the early commentators take koti that way, and who first " +
          "rendered it as crore, are checkable questions that were not checked. NO POSITION ON THE STRIP: this " +
          "is a claim about what a word means, not about when anything happened.",
        notes:
          "NEEDS SOURCE VERIFICATION, and of a particular kind: the sources available for this reading are " +
          "devotional and educational rather than philological. A Sanskrit dictionary entry, a commentator, and a " +
          "history of the English translation would settle it, and none of the three could be consulted. Recorded " +
          "as a well-supported traditional reading rather than as a demonstrated fact.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// The relationships
//
// The brief this dataset was built from asks for transmission to be classified
// A to G — documented, highly probable, possible, thematic parallel, numerical
// coincidence, later retrospective, unsupported. THOSE CLASSES DO NOT EXIST IN
// EVENT_RELATIONS YET and are deliberately not being invented here: the edges
// in this tranche are all inheritance or relevance, which the existing
// vocabulary states accurately, and a vocabulary added before there is anything
// to say with it is a vocabulary nobody uses correctly. The class each edge
// would take is written into its note so the mapping is not lost.
// ---------------------------------------------------------------------------

export const THIRTY_THREE_VEDIC_LINKS: SeedEventLink[] = [
  {
    from: THIRTY_THREE_VEDIC_ANCHOR_SLUG,
    to: "thirty-three-sorted-into-classes",
    relation: "precedes",
    viewpoint: "conventional",
    sourceKey: "satapatha_brahmana",
    note:
      "The number first, the breakdown afterwards. The order matters: the classification is an interpretation of " +
      "an inherited total, which is why the total is stable and the last two members are not.",
  },
  {
    from: "thirty-three-sorted-into-classes",
    to: "yajnavalkya-how-many-gods",
    relation: "related",
    viewpoint: "conventional",
    sourceKey: "brhadaranyaka",
    note:
      "Closer together than they look: the Brhadaranyaka forms the closing part of the Satapatha Brahmana, so the " +
      "enumeration and the dialogue that counts down past it belong to one body of text.",
  },
  {
    from: THIRTY_THREE_VEDIC_ANCHOR_SLUG,
    to: "trayastrimsa-heaven-of-the-thirty-three",
    relation: "source_of",
    viewpoint: "conventional",
    sourceKey: "encyclopedia_buddhism_trayastrimsa",
    note:
      "Class B in the brief's scheme — highly probable historical transmission, not directly documented. The " +
      "Buddhist heaven takes its name from the Vedic thirty-three, holds far more than thirty-three beings, and " +
      "is ruled by Indra under the name Sakra. A number that no longer counts what it names is an inherited one.",
  },
  {
    from: THIRTY_THREE_VEDIC_ANCHOR_SLUG,
    to: "thirty-three-becomes-three-hundred-and-thirty-million",
    relation: "responds_to",
    viewpoint: "traditional",
    sourceKey: "vkic_thirty_three_koti",
    note:
      "The 330 million figure is downstream of this record, not parallel to it. Whether it is a mistranslation is " +
      "argued on the later record; what is not argued is which figure is older.",
  },
  {
    from: "avestan-thirty-three-unresolved",
    to: "proto-indo-iranian-thirty-three-hypothesis",
    relation: "evidence_for",
    viewpoint: "disputed",
    sourceKey: "iranica_amesa_spenta",
    note:
      "The hypothesis needs this record to produce an ancient Iranian thirty-three, and on present evidence it " +
      "produces a modern calendrical one instead. The edge exists so that a reader who meets the reconstruction " +
      "can see immediately what it is resting on.",
  },
  {
    from: THIRTY_THREE_VEDIC_ANCHOR_SLUG,
    to: "avestan-thirty-three-unresolved",
    relation: "relevant",
    viewpoint: "disputed",
    note:
      "Class C at best in the brief's scheme — a possible connection, not a demonstrable one, and quite possibly " +
      "class E, two thirty-threes arrived at separately. Linked WITHOUT the link being read as support: the " +
      "relation exists so the comparison can be seen and weighed, not so it can be assumed.",
  },
  {
    from: THIRTY_THREE_VEDIC_ANCHOR_SLUG,
    to: "proto-indo-iranian-thirty-three-hypothesis",
    relation: "evidence_for",
    viewpoint: "hypothesis",
    note:
      "The one branch the reconstruction certainly has. A single attested branch does not reconstruct anything on " +
      "its own, which is the whole difficulty stated on the hypothesis record.",
  },
];
