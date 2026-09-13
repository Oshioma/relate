import type { SeedEvent, SeedSource, SeedEventLink } from "./seed-types";
import { GIANTS_HEBREW_TRACK } from "./giants-hebrew-seed";

// =============================================================================
// GIANTS, PART THREE: MESOPOTAMIA AND ANATOLIA — MEASURED HEROES, A STONE
// GIANT, AND A WORD THAT GREW IN TRANSLATION
//
// Third tranche. The first was a fossil and four texts; the second was three
// occasions when somebody dug enormous bones out of the ground. This one is
// about something quieter and more useful: WHERE THE WORD COMES FROM.
//
// Two of these four records are not about giants at all until somebody
// translates them. Nimrod is a gibbor in Hebrew — a word covering hero,
// warrior, champion, mighty man — and the Greek translators wrote gigas, which
// is how an English Bible ends up calling him a giant. Humbaba is a composite
// monster with a lion's face and seven supernatural auras, and no height
// anywhere; "giant" is a word modern retellings add.
//
// THE OTHER TWO ARE THE OPPOSITE CASE, and they are here for the contrast.
// Gilgamesh IS given a measurement — eleven cubits — and it comes from a
// manuscript found in Syria that changed what the epic's opening lines were
// thought to say. Ullikummi IS a being made of stone who grows out of the sea
// until his head touches the sky, and the Hittite tablets that carry him can be
// dated by the hands that wrote them.
//
// So the four together answer a question the first two tranches could not:
// WHEN A SOURCE CALLS SOMETHING A GIANT, WHICH OF THESE IS HAPPENING?
//
//   1. The text gives a measurement.        (Gilgamesh)
//   2. The text describes an enormous being. (Ullikummi)
//   3. The text describes a monster and says nothing about size. (Humbaba)
//   4. The text says none of it, and a translator supplied the word. (Nimrod)
//
// A reader who can tell those four apart can read almost any giant story.
//
// AND THE SAME RULE AS EVERY TRANCHE. An event does not have a date. Where the
// story sits, when the text was composed, when the surviving tablet was
// written, and when a modern scholar proposed something are four different
// claims and are never collapsed into one.
//
// NO CONFIDENCE SCORES. Nothing here says whether any of it happened.
// =============================================================================

export const GIANTS_MESOPOTAMIA_ANCHOR_SLUG = "gilgamesh-eleven-cubits";

// The giants tranches share one lane — see giants-greek-seed.ts for why the
// track object is imported rather than copied.
export const GIANTS_MESOPOTAMIA_TRACK = GIANTS_HEBREW_TRACK;

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const GIANTS_MESOPOTAMIA_SOURCES: SeedSource[] = [
  {
    key: "sb_gilgamesh_tablet1",
    title: "The Standard Babylonian Epic of Gilgameš, Tablet I",
    workTitle: "The Epic of Gilgamesh",
    reference: "Tablet I, the opening description of the king",
    sourceType: "primary",
    notes:
      "The passage describing Gilgamesh's body. Cited for the measurements themselves and for the fact that the " +
      "epic gives them at all — which is rarer than a reader of giant stories expects, and is what makes this " +
      "record the measuring stick for the other three here.",
  },
  {
    key: "george_2003",
    title: "The Babylonian Gilgamesh Epic: Introduction, Critical Edition and Cuneiform Texts",
    author: "Andrew R. George",
    publisher: "Oxford University Press",
    sourceType: "academic_book",
    publishedYear: 2003,
    notes:
      "The standard critical edition, in two volumes. Cited for the state of the text before the Syrian manuscript " +
      "was published — where the opening lines were restored differently — and for the dating of the Standard " +
      "Babylonian version and its manuscripts.",
  },
  {
    key: "george_2007",
    title: "The Civilising of Ea-Enkidu: An Unusual Tablet of the Babylonian Gilgameš Epic",
    author: "Andrew R. George",
    workTitle: "Revue d'Assyriologie",
    reference: "Volume 101 (2007), pages 59–80",
    sourceType: "academic_paper",
    publishedYear: 2007,
    notes:
      "The publication of a manuscript from Syria carrying the epic's opening lines, first translated into English " +
      "here. Cited for the reading 'eleven cubits was his height, four cubits his chest' — a figure that was not " +
      "available to read before this tablet was published, which is the point of the record.",
  },
  {
    key: "guterbock_ullikummi",
    title: "The Song of Ullikummi: Revised Text of the Hittite Version of a Hurrian Myth",
    author: "Hans Gustav Güterbock",
    workTitle: "Journal of Cuneiform Studies",
    reference: "Published in two parts, 1951–1952",
    sourceType: "academic_paper",
    publishedYear: 1952,
    notes:
      "The edition of the text, from the fragments recovered at Boğazköy. Cited for the narrative and for the " +
      "state of the tablets. NO VOLUME OR PAGE NUMBERS ARE GIVEN because they could not be confirmed from here; " +
      "the title, author and the two-part publication in 1951–1952 are as published.",
  },
  {
    key: "hoffner_hittite_myths",
    title: "Hittite Myths",
    author: "Harry A. Hoffner Jr.",
    publisher: "Society of Biblical Literature",
    reference: "Writings from the Ancient World; second edition, 1998",
    sourceType: "academic_book",
    publishedYear: 1998,
    notes:
      "The standard English translation of the Hittite mythological texts, including the Kumarbi cycle. Cited for " +
      "the Song of Ullikummi in translation and for its place in that cycle (catalogued as CTH 345).",
  },
  {
    key: "genesis10",
    title: "Genesis 10:8–9",
    workTitle: "The Hebrew Bible",
    sourceType: "religious_text",
    notes:
      "The two verses about Nimrod: he began to be a gibbor in the earth, a gibbor hunter before the LORD. Cited " +
      "as the primary text, and for a negative fact that is the whole point of the record — THE HEBREW DOES NOT " +
      "SAY HE WAS LARGE. It says he was mighty.",
  },
  {
    key: "septuagint_genesis",
    title: "Genesis 10:8–9 in the Septuagint",
    workTitle: "The Septuagint",
    sourceType: "primary",
    notes:
      "The Greek translation, which renders gibbor as gigas: 'he began to be a giant upon the earth. He was a " +
      "giant hunter before the Lord God.' Cited as the moment the word changes — the same translation decision " +
      "that turned nephilim into gigantes, made by the same tradition, and the reason an English Bible has giants " +
      "in it at all.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const GIANTS_MESOPOTAMIA_EVENTS: SeedEvent[] = [
  // =========================================================================
  // GILGAMESH — a measurement, and a tablet that changed what it was.
  // =========================================================================
  {
    slug: GIANTS_MESOPOTAMIA_ANCHOR_SLUG,
    title: "Gilgamesh is described as eleven cubits tall",
    summary:
      "The epic gives its hero an actual measurement — and the figure most people quote comes from a manuscript found in Syria and only published in 2007.",
    description:
      "WHAT KIND OF RECORD IS THIS? A literary text, in many manuscripts. Physical remains of the man: none, and none claimed. Physical evidence about the TEXT: thousands of clay tablets, which can be dated by the hands that wrote them.\n\n" +
      "WHAT THE TEXT SAYS. Tablet I of the Standard Babylonian epic describes the king's body before the story begins. The best-known reading — ELEVEN CUBITS WAS HIS HEIGHT, FOUR CUBITS HIS CHEST — comes from a manuscript found in Syria, published and translated into English by Andrew George in 2007. On a Babylonian cubit of roughly 50 cm that is about five and a half metres tall, with a chest two metres across.\n\n" +
      "AND THE READING BEFORE THAT ONE. The opening lines were previously restored differently, and the epic was quoted instead for a series of proportions: a triple cubit for his foot, half a rod for his leg, six cubits for his stride. Those describe an enormous man without stating his height. A NEW TABLET CHANGED WHAT THE OPENING OF THE MOST FAMOUS POEM IN THE WORLD WAS THOUGHT TO SAY, in 2007, within living memory. That is how texts actually work, and it is worth more to a student than the number itself.\n\n" +
      "COMPARE GOLIATH, WHICH IS THE SAME LESSON IN A DIFFERENT LANGUAGE. There, two manuscript traditions give two different heights for one man and the oldest witness gives the smaller. Here, a manuscript recovered in the twentieth century supplies a height where the tradition had proportions. In both cases the question 'how tall was he?' turns out to be a question about manuscripts.\n\n" +
      "WHAT A CUBIT IS, AND WHY THE CONVERSION IS SOFT. A cubit is a forearm, and forearms differ: the Babylonian cubit is usually taken as about 50 cm, but ancient measures varied by place and period. Every metric figure on this record is therefore an approximation of an approximation, and it is written that way rather than to the centimetre.\n\n" +
      "WHAT THIS DOES NOT ESTABLISH. That anybody was eleven cubits tall. Gilgamesh is described in the epic as two-thirds god and one-third man, which is a statement about what kind of being the poem says he is, not a biological claim a reader is meant to check. There is a historical figure behind the tradition — a king of Uruk named in the Sumerian King List — and nothing physical connects him to any measurement.\n\n" +
      "THINGS TO ASK: Where does a number in a famous story actually come from? What happens to 'the text says' when a new copy is found? If a measurement is given in cubits, do you know how long a cubit was — and does anyone?",
    category: "culture",
    subcategory: "Ancient literature",
    eventType: "traditional_account",
    eventTypeNote:
      "A literary description with a stated measurement, carried in manuscripts of different dates. The text is not disputed; what its opening lines say has changed as manuscripts were found.",
    tags: ["gilgamesh", "mesopotamia", "giants", "cubits", "manuscripts", "uruk"],
    people: ["Gilgamesh", "Andrew R. George"],
    civilisations: ["Babylonia", "Uruk"],
    locationName: "Uruk, southern Mesopotamia",
    lat: 31.32,
    lng: 45.64,
    claims: [
      {
        sourceKey: "george_2007",
        startYear: 2007,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "the reading 'eleven cubits was his height, four cubits his chest', published in 2007",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "absolute_date",
        whatIsDated: "When the measurement became readable — a date for a publication, not for a man",
        evidence:
          "WHAT IS DATED: the publication of a manuscript from Syria carrying the epic's opening lines, translated " +
          "into English by Andrew George. DATING METHOD: the historical record of scholarship. WHAT IT " +
          "ESTABLISHES: that the figure everyone now quotes entered the literature in 2007, and where it came " +
          "from. WHAT IT DOES NOT ESTABLISH: anybody's height. It dates a reading.\n\n" +
          "STORED AT THE PUBLICATION because that is what this claim is about. The epic is thousands of years " +
          "older, and has its own claims below.",
        notes:
          "About 5.5 m on a Babylonian cubit of roughly 50 cm, with a chest about 2 m across. The conversion is " +
          "soft: ancient cubits varied by place and period, and a figure given to the centimetre would be a " +
          "precision the source does not have.",
      },
      {
        sourceKey: "george_2003",
        startYear: -1299,
        endYear: -999,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Standard Babylonian version, composed between about 1300 and 1000 BCE",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "When the version of the epic that carries this description was composed",
        evidence:
          "WHAT IS DATED: the composition of the Standard Babylonian recension, the version this description " +
          "belongs to. DATING METHOD: scholarly dating from language and from the history of the text. WHAT IT " +
          "ESTABLISHES: that the description is roughly three thousand years old, and that it is much younger " +
          "than the older Sumerian poems about the same king. WHAT IT DOES NOT ESTABLISH: when any surviving copy " +
          "was written, which is later again, or when the king it describes lived, which is earlier.",
      },
      {
        sourceKey: "sb_gilgamesh_tablet1",
        startYear: -1299,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "a triple cubit his foot, half a rod his leg, six cubits his stride — proportions, not a height",
        datingMethod: "source_assertion",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "The reading the tradition had BEFORE the Syrian manuscript — proportions rather than a height",
        evidence:
          "WHAT IS DATED: nothing. This claim carries the OTHER reading, so that the record does not quietly " +
          "present one figure as what the epic has always said. DATING METHOD: the text's own words as previously " +
          "restored. WHAT IT ESTABLISHES: that the epic described an enormous man in proportions before it was " +
          "read as giving a height. WHAT IT DOES NOT ESTABLISH: a stature. Proportions without a scale do not " +
          "give one, which is exactly why the new tablet mattered.\n\n" +
          "TWO READINGS ON ONE RECORD, as at Goliath. Neither is presented as the true one; the record shows " +
          "where each comes from.",
      },
    ],
  },

  // =========================================================================
  // ULLIKUMMI — a being genuinely made of stone, and datable tablets.
  // =========================================================================
  {
    slug: "ullikummi-stone-giant",
    title: "Ullikummi, the stone child who grows out of the sea",
    summary:
      "A Hurrian story in Hittite: a being of stone set on a giant's shoulder in the sea, growing until the water reaches his waist and his head touches the sky.",
    description:
      "WHAT KIND OF RECORD IS THIS? A mythological narrative, in clay. Physical remains of the being: none, and none claimed. Physical evidence about the TEXT: fragmentary tablets excavated at Boğazköy, the Hittite capital, which can be dated by the script they are written in.\n\n" +
      "THE STORY. Kumarbi, a god who has lost the kingship in heaven, fathers a child on a rock, meaning to use him against the storm god Teššub. The child is diorite — he is made of stone — and he is set on the shoulder of Upelluri, who holds up heaven and earth. Standing in the sea, he grows: the water reaches his waist, and his head reaches the sky. In the end the god Ea has the ancient copper saw brought out, the one used to separate heaven from earth in the beginning, and cuts him from his base, which takes away what made him unbeatable.\n\n" +
      "WHY THIS RECORD IS HERE AND NOT MERELY INTERESTING. Of the four in this group, this is the one where the text really is describing something enormous. It is not a translator's word and not a modern retelling: the narrative is about size, and about a thing that grows. When a source does mean 'giant', it usually looks like this — and a reader who has seen it can tell the difference when a source does not.\n\n" +
      "THE STORY IS HURRIAN; THE TABLETS ARE HITTITE. That distinction matters and is easy to lose. The Hurrians were a people of northern Mesopotamia and Syria; the Hittites, in Anatolia, took their myths and wrote them in their own language, and the surviving copies are Hittite ones with Hurrian passages among them. So the composition and the copies are two different dates for two different peoples, and the record carries them separately.\n\n" +
      "THE FIGURES OFTEN QUOTED FOR HIS SIZE ARE NOT SEEDED HERE. Retellings give him a height and a girth in enormous units, and those numbers are repeated widely. They are not on this record, because they could not be traced to the tablet text from here. NEEDS SOURCE VERIFICATION is not a way of being coy — it is the difference between what a tablet says and what the internet says about a tablet.\n\n" +
      "THINGS TO ASK: What is the difference between a story that says something was huge and a story somebody later called a giant story? Who wrote this down, and were they the people whose story it was? If a number is in every retelling but not in the text, where did it come from?",
    category: "culture",
    subcategory: "Ancient Near Eastern myth",
    eventType: "traditional_account",
    eventTypeNote:
      "A mythological narrative, on datable tablets. The being is not presented as historical by anyone; the tablets are ordinary archaeology.",
    tags: ["ullikummi", "kumarbi", "hurrian", "hittite", "giants", "anatolia"],
    people: ["Hans Gustav Güterbock", "Harry A. Hoffner Jr."],
    civilisations: ["Hittites", "Hurrians"],
    locationName: "Hattusa (Boğazköy), Anatolia",
    lat: 40.02,
    lng: 34.62,
    claims: [
      {
        sourceKey: "hoffner_hittite_myths",
        datePrecision: "millennium",
        isApproximate: true,
        originalDateText: "born of Kumarbi and a rock, in the time when the gods contended for heaven — no year given",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        temporalClaimType: "primordial",
        whatIsDated: "Where the story sits — among the events that settle the kingship in heaven, which is not a date",
        evidence:
          "WHAT IS DATED: nothing, and that is the claim. The Song of Ullikummi belongs to the succession myths, " +
          "which happen before and outside human history. DATING METHOD: the text's own placement in the Kumarbi " +
          "cycle. WHAT IT ESTABLISHES: that the narrative claims no year and asks for none. WHAT IT DOES NOT " +
          "ESTABLISH: any date whatever — and a claim that places nothing on the axis is the honest record of " +
          "that, rather than a number invented to fill the column.",
      },
      {
        sourceKey: "guterbock_ullikummi",
        startYear: -1299,
        endYear: -1200,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the surviving Hittite tablets, thirteenth century BCE",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "When the surviving copies were written — the one physically datable thing here",
        evidence:
          "WHAT IS DATED: the clay tablets recovered at Boğazköy that carry the text. DATING METHOD: the dating of " +
          "Hittite cuneiform by the script, which is how tablets from the capital are placed. WHAT IT " +
          "ESTABLISHES: that the story was being copied in the Hittite capital in the thirteenth century BCE. " +
          "WHAT IT DOES NOT ESTABLISH: when it was composed. A copy gives a latest-possible date for a text and " +
          "says nothing about the earliest — the same point the Watchers record makes with a Dead Sea scroll.",
        notes:
          "Catalogued as CTH 345 among the Hittite texts, which is how it can be looked up rather than taken on " +
          "trust.",
      },
      {
        sourceKey: "hoffner_hittite_myths",
        startYear: -1599,
        endYear: -1200,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Hurrian original, argued to the later second millennium BCE",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "When the Hurrian story behind the Hittite copies was composed — argued, not measured",
        evidence:
          "WHAT IS DATED: the composition of the Hurrian original that the Hittite version translates and adapts. " +
          "DATING METHOD: argument from the history of the Kumarbi cycle and from when Hurrian material reached " +
          "Anatolia. WHAT IT ESTABLISHES: that the story is older than the tablets that carry it. WHAT IT DOES " +
          "NOT ESTABLISH: a date anyone can check against an object. This is the softest claim on the record and " +
          "is marked as such by its range rather than by a hedge in the prose.\n\n" +
          "NEEDS SOURCE VERIFICATION: the enormous height and girth figures quoted for Ullikummi in modern " +
          "retellings could not be traced to the tablet text from here, and are therefore described on this " +
          "record and deliberately not seeded as a claim.",
      },
    ],
  },

  // =========================================================================
  // HUMBABA — a monster with no measurement, called a giant by other people.
  // =========================================================================
  {
    slug: "humbaba-cedar-forest",
    title: "Humbaba, the guardian of the Cedar Forest",
    summary:
      "Retellings call him a giant. The texts describe a lion's face, seven supernatural auras and a voice like the flood — and give no size at all.",
    description:
      "WHAT KIND OF RECORD IS THIS? A figure in a literary text. Physical remains: none, and none claimed. What IS physical: clay plaques and heads showing his face, from Mesopotamian sites.\n\n" +
      "WHAT THE TEXTS ACTUALLY DESCRIBE. Humbaba — Huwawa in the older Sumerian material — guards the Cedar Forest, appointed by the god Enlil as a terror to human beings. His face is a lion's. He is protected by seven radiances, the auras a Mesopotamian text gives to a dangerous divine being. His voice is the Deluge, his mouth is fire, his breath is death, and he can hear anything stirring in his forest from a great distance. In art his face is often drawn as one coiling line, like the entrails a diviner reads omens from.\n\n" +
      "AND HERE IS THE POINT OF THE RECORD: NONE OF THAT IS A SIZE. He is terrifying, composite, supernatural and lethal, and the texts give no height, no length and no comparison to anything measurable. Modern retellings routinely call him a giant. That word is an addition, and a reader should know it is one.\n\n" +
      "WHY THE DISTINCTION IS WORTH THE TROUBLE. 'Monstrous' and 'gigantic' are not the same claim. A being with a lion's face and seven auras is frightening because of what it is, not because of how tall it is. Collapsing the two turns a whole class of ancient monsters into giants retrospectively, and then the giants look far more numerous in the record than they are.\n\n" +
      "WHAT THIS RECORD DOES NOT SAY. It does not say Humbaba was small, and it does not say the texts imply he was ordinary in size: they simply do not address it. Absence of a measurement is absence of a measurement. The honest statement is that anyone quoting a height for Humbaba should be asked where they got it.\n\n" +
      "THINGS TO ASK: What exactly does the text describe? Is 'giant' in the source, or in the retelling? If a story never mentions size, why do we picture one?",
    category: "culture",
    subcategory: "Ancient literature",
    eventType: "traditional_account",
    eventTypeNote:
      "A literary figure, recorded to correct an addition: this record exists because 'giant' is widely attached to a being the texts never measure.",
    tags: ["humbaba", "huwawa", "gilgamesh", "mesopotamia", "giants", "monsters"],
    civilisations: ["Babylonia", "Sumer"],
    locationName: "The Cedar Forest, in the Epic of Gilgamesh",
    lat: 34.25,
    lng: 36.05,
    claims: [
      {
        sourceKey: "sb_gilgamesh_tablet1",
        datePrecision: "millennium",
        isApproximate: true,
        originalDateText: "a lion's face, seven radiances, a voice like the Deluge — and no measurement anywhere",
        datingMethod: "source_assertion",
        chronology: "traditional",
        temporalClaimType: "unknown",
        whatIsDated: "How big he was — the texts give no figure, so this claim places nothing",
        evidence:
          "WHAT IS DATED: nothing, deliberately. DATING METHOD: none; there is no measurement to record. WHAT IT " +
          "ESTABLISHES: that the descriptions are of a composite, supernatural, lethal being — lion's face, seven " +
          "auras, a voice like the flood, fire for a mouth — and that no size is given. WHAT IT DOES NOT " +
          "ESTABLISH: that he was of ordinary size. The texts do not address it, and absence of a measurement is " +
          "absence of a measurement.\n\n" +
          "THIS IS WHY THE SCHEMA HOLDS A CLAIM WITH NO POSITION. A missing figure recorded as missing cannot " +
          "turn into a quoted one later, which is exactly what happened to this being outside the record.",
      },
      {
        sourceKey: "george_2003",
        startYear: -1299,
        endYear: -999,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Standard Babylonian account of the Cedar Forest, about 1300 to 1000 BCE",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "When the fullest surviving account of him was composed",
        evidence:
          "WHAT IS DATED: the composition of the Standard Babylonian recension containing the Cedar Forest " +
          "episode. DATING METHOD: the scholarly dating of the text. WHAT IT ESTABLISHES: roughly when the " +
          "description a modern reader meets was written down. WHAT IT DOES NOT ESTABLISH: the age of the " +
          "tradition, which is older — Sumerian poems about Huwawa are earlier — or anything about the being.",
      },
    ],
  },

  // =========================================================================
  // NIMROD — the clearest case in the dataset of a word doing the work.
  // =========================================================================
  {
    slug: "nimrod-gibbor-gigas",
    title: "Nimrod becomes a giant in translation",
    summary:
      "Two verses of Hebrew call him a gibbor — mighty, a champion. The Greek translators wrote gigas, and an English Bible has had a giant in it ever since.",
    description:
      "WHAT KIND OF RECORD IS THIS? A translation decision, which is a historical event with a date and consequences. Physical remains: none, and none claimed. What can be examined: the Hebrew text, the Greek text, and the difference between them.\n\n" +
      "WHAT THE HEBREW SAYS. Genesis 10:8–9, two verses: Cush fathered Nimrod, who began to be a GIBBOR in the earth; he was a gibbor hunter before the LORD. Gibbor is a broad word — mighty man, warrior, champion, man of power, hero. IT IS NOT A WORD ABOUT SIZE. The Hebrew Bible uses it of ordinary human warriors throughout.\n\n" +
      "WHAT THE GREEK SAYS. The Septuagint renders it GIGAS: he began to be a giant upon the earth, a giant hunter before the Lord God. That is the same word the same translators used for the nephilim of Genesis 6 — and it is how 'giants' entered the English Bible, through Greek, centuries after the Hebrew.\n\n" +
      "AND THE CARE THIS NEEDS, BECAUSE IT CUTS BOTH WAYS. It does not follow that the translators were careless or that they meant a physical giant. Gigas in Greek carries the Gigantes with it — beings defined by strength and hubris as much as by size — and the Greek word can be used of might rather than stature. Nor is it the case that every gibbor in the Hebrew Bible was rendered gigas. The honest statement is narrower and more interesting: A WORD WITH A RANGE WAS TRANSLATED BY A WORD WITH A DIFFERENT RANGE, and the overlap between them is where Nimrod's later career as a giant begins.\n\n" +
      "WHAT HAPPENED NEXT. Later traditions made Nimrod a builder of the Tower of Babel, a tyrant, and in some retellings a giant outright. Those are developments, each with its own sources and dates, and none of them is in Genesis 10. This record stops at the translation, which is the step everything else rests on.\n\n" +
      "WHY THIS RECORD MATTERS TO THE WHOLE DATASET. It is the clearest case here of the thing this project keeps warning about: a claim that appears to come from an ancient source, and actually comes from a later hand. Nothing was forged and nobody lied. A translator chose a word.\n\n" +
      "THINGS TO ASK: What did the word mean in the language it was written in? Who chose the word you are reading? Does a translation make a claim the original did not — and how would you find out?",
    category: "religion",
    subcategory: "Translation and transmission",
    eventType: "historical",
    eventTypeNote:
      "A record about a text rather than about a being: what the Hebrew says, what the Greek made of it, and when.",
    tags: ["nimrod", "septuagint", "translation", "giants", "gibbor", "genesis"],
    civilisations: ["Israel", "Hellenistic Egypt"],
    locationName: "Alexandria, where the Septuagint was made",
    lat: 31.2,
    lng: 29.92,
    claims: [
      {
        sourceKey: "genesis10",
        datePrecision: "millennium",
        isApproximate: true,
        originalDateText: "a gibbor in the earth — mighty, with no statement about size and no year",
        datingMethod: "textual_interpretation",
        chronology: "biblical",
        temporalClaimType: "primordial",
        whatIsDated: "Where the story sits — in the generations after the Flood, which the text does not date",
        evidence:
          "WHAT IS DATED: nothing. Genesis 10 places Nimrod in the table of nations after the Flood and gives no " +
          "year. DATING METHOD: the text's own narrative order. WHAT IT ESTABLISHES: that the Hebrew calls him a " +
          "gibbor — mighty man, warrior, champion — and says nothing whatever about how big he was. WHAT IT DOES " +
          "NOT ESTABLISH: a date, or a size. Both are supplied later and by other people.",
      },
      {
        sourceKey: "septuagint_genesis",
        startYear: -249,
        endYear: -99,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Septuagint renders gibbor as gigas, third to second century BCE",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "When the word changed — a date for a translation, not for a man",
        evidence:
          "WHAT IS DATED: the Greek translation of Genesis, made for the Jewish community of Alexandria and " +
          "usually placed in the third to second century BCE. DATING METHOD: the scholarly dating of the " +
          "Septuagint's books. WHAT IT ESTABLISHES: that 'giant' enters this passage in Greek, centuries after " +
          "the Hebrew, by the same translators' decision that turned nephilim into gigantes. WHAT IT DOES NOT " +
          "ESTABLISH: that the translators meant a being of great stature. Gigas can carry might as well as size, " +
          "and reading a physical giant back into their choice is the same over-reading in the other direction.",
        notes:
          "The Pentateuch is generally taken as the earliest part translated, in the third century BCE, with " +
          "other books following. The range here is deliberately wide for that reason.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

export const GIANTS_MESOPOTAMIA_LINKS: SeedEventLink[] = [
  {
    from: GIANTS_MESOPOTAMIA_ANCHOR_SLUG,
    to: "utnapishtim-gilgamesh-flood",
    relation: "related",
    note:
      "The same epic, already on this timeline for its flood tablet. The measurement is in Tablet I and the flood " +
      "in Tablet XI — one text, two records, linked rather than duplicated.",
  },
  {
    from: "humbaba-cedar-forest",
    to: GIANTS_MESOPOTAMIA_ANCHOR_SLUG,
    relation: "related",
    note:
      "Two beings from one epic, and the contrast is the lesson: the king is given a measurement in cubits, the " +
      "forest guardian is given none at all.",
  },
  {
    from: "nimrod-gibbor-gigas",
    to: "nephilim-genesis",
    relation: "associated",
    viewpoint: "religious",
    sourceKey: "septuagint_genesis",
    note:
      "The same translators' decision, in the same book: nephilim became gigantes and gibbor became gigas. A fact " +
      "about one translation's vocabulary, NOT a finding that the two are the same kind of being.",
  },
  {
    from: "nimrod-gibbor-gigas",
    to: "gigantes-gigantomachy",
    relation: "source_of",
    viewpoint: "religious",
    note:
      "Where the Greek word came from. Gigas belonged to the Gigantes before it was ever used of anyone in the " +
      "Hebrew Bible, and it carried their associations with it.",
  },
  {
    from: "ullikummi-stone-giant",
    to: "humbaba-cedar-forest",
    relation: "related",
    note:
      "Worth reading together: one text is unmistakably about something enormous, the other describes a monster " +
      "and never mentions size. Both are routinely called giant stories.",
  },
];
