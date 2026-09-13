import type { SeedEvent, SeedSource, SeedEventLink } from "./seed-types";
import { GIANTS_HEBREW_TRACK } from "./giants-hebrew-seed";

// =============================================================================
// GIANTS, PART TWO: WHERE THE BONES WERE ACTUALLY DUG UP
//
// Second tranche of the giants dataset. The first one was built around a fossil
// and four texts. This one is built around something better: THREE OCCASIONS,
// REPORTED BY ANCIENT WRITERS, WHEN SOMEBODY DUG UP ENORMOUS BONES, MEASURED
// THEM, AND WROTE DOWN WHAT THEY FOUND.
//
// That makes the Greek and Roman world the most useful part of this whole
// subject, because it is the one place where all of the following are true at
// once:
//
//   1. People reported finding giant remains — not in legend, in what they
//      presented as current events.
//   2. Somebody measured them. At Tegea a blacksmith opened a coffin BECAUSE HE
//      DID NOT BELIEVE IT, and measured the body inside.
//   3. There is a modern explanation that can be examined: the lands around the
//      Mediterranean are full of the bones of very large extinct mammals.
//   4. Every single one of the reported bodies is LOST, so the explanation
//      cannot be tested against any of them.
//
// FOUR IS THE REASON THIS GROUP IS WORTH A CHILD'S TIME. It is an honest
// standing position — a good proposal, real supporting context, and no way to
// check the individual cases — and a reader who can sit in that position
// without resolving it has learned something that no amount of being told the
// answer teaches.
//
// THE SAME RULE AS EVERY OTHER TRANCHE. An event does not have a date. Each
// record here separates: where the story sits, when the text was composed, when
// the reported find happened, when the source describing it was written, and
// when the animals in the ground actually lived. Those are five different
// questions and the last one is seven million years away from the others.
//
// WHAT THIS TRANCHE REFUSES TO DO. It does not apply the fossil explanation to
// every case just because it fits three of them. At Skyros the coffin came with
// a bronze spear and a sword beside it, which a fossil bed does not supply — so
// that record is NOT linked to the fossil record, and the reason is written on
// it. A favourite explanation that gets applied everywhere has stopped being
// evidence and become a habit.
//
// NO CONFIDENCE SCORES. No verdicts. Absence of accepted evidence is not proof
// that something never existed, and a record that cannot be checked is recorded
// as a record that cannot be checked.
// =============================================================================

export const GIANTS_GREEK_ANCHOR_SLUG = "mediterranean-fossil-beds";

// ALL THE GIANTS TRANCHES SHARE ONE LANE, DELIBERATELY. seedDataset looks a
// track up by slug and reuses the existing row, so importing the first
// tranche's track puts these records in the same lane rather than opening a
// rival lane with the same name. Sharing the object rather than copying the
// literal also means the name and colour cannot drift apart between files.
export const GIANTS_GREEK_TRACK = GIANTS_HEBREW_TRACK;

// ---------------------------------------------------------------------------
// Sources
//
// Every ancient text here is cited for a specific passage, and every modern
// work for the specific thing it argues. Where a bibliographic detail could not
// be verified from here it says so in its own notes rather than being guessed:
// Abel's 1914 proposal is the one case, and it is named as a proposal with a
// year rather than given a title invented to look like a citation.
// ---------------------------------------------------------------------------

export const GIANTS_GREEK_SOURCES: SeedSource[] = [
  // --- Greek texts --------------------------------------------------------
  {
    key: "hesiod_theogony",
    title: "Theogony",
    author: "Hesiod",
    reference: "Lines 185–186",
    sourceType: "primary",
    notes:
      "The earliest surviving account of the Gigantes: the blood of Ouranos falls on Gaia and she bears the " +
      "Erinyes, the Gigantes and the Meliai. Cited for what the passage does and does not say — the Giants are " +
      "'strong' (krateroi) and 'great' (megaloi), they are born already armed, gleaming in armour and holding long " +
      "spears, and there is NO height, no measurement and no date. Whether 'great' refers to size at all is a " +
      "genuine question in the scholarship rather than a quibble.",
  },
  {
    key: "apollodorus",
    title: "Bibliotheca",
    author: "Apollodorus",
    reference: "1.6.1–2",
    sourceType: "primary",
    notes:
      "The handbook version that most retellings descend from, and the one that makes the Gigantomachy a single " +
      "organised war. Cited for the systematised narrative and for its date: it is a compilation of the first or " +
      "second century CE, some eight hundred years after Hesiod, and the tidiness is a feature of the handbook " +
      "rather than of the tradition.",
  },
  {
    key: "homer_odyssey",
    title: "Odyssey",
    author: "Homer",
    reference: "Book 9",
    sourceType: "primary",
    notes:
      "Polyphemus: a one-eyed herdsman living alone with his flocks, who traps Odysseus and his men in a cave and " +
      "is blinded with a sharpened stake. Cited for the narrative and for a negative fact that matters — Homer " +
      "calls him monstrous but GIVES NO MEASUREMENT, so any figure for the height of a Cyclops comes from " +
      "somewhere other than this text.",
  },
  {
    key: "herodotus_orestes",
    title: "Histories",
    author: "Herodotus",
    reference: "1.67–68",
    sourceType: "primary",
    notes:
      "The bones of Orestes at Tegea: the oracle, Lichas, and the blacksmith who struck a coffin seven cubits long " +
      "while digging a well. Cited above all for the blacksmith's own reasoning, which Herodotus reports in the " +
      "first person: he did not believe men had ever been taller than in his own day, SO HE OPENED THE COFFIN AND " +
      "MEASURED THE BODY. That is a sixth-century BCE act of checking, and it is the most valuable sentence in " +
      "this tranche.",
  },
  {
    key: "plutarch_theseus",
    title: "Life of Theseus",
    author: "Plutarch",
    reference: "Chapter 36",
    sourceType: "primary",
    notes:
      "Cimon on Skyros: the Delphic instruction to bring home the bones of Theseus, the eagle tearing at a mound, " +
      "and the coffin of a man of extraordinary size with a bronze spear and a sword lying beside it. Cited for " +
      "the find, for the archon year that dates it, and for the fact that Plutarch gives NO measurement at all.",
  },
  {
    key: "plutarch_sertorius",
    title: "Life of Sertorius",
    author: "Plutarch",
    reference: "Chapter 9",
    sourceType: "primary",
    notes:
      "Tingis, and the tomb the Libyans said held Antaeus. Cited for the sequence Plutarch reports: Sertorius " +
      "DOUBTED the story because of the size claimed, had the mound opened, found a body said to be sixty cubits " +
      "long, was astonished, sacrificed, and heaped the tomb up again. The doubt comes first in the text, and it " +
      "belongs first in any account of it.",
  },

  // --- Modern scholarship -------------------------------------------------
  {
    key: "vian_1952",
    title: "La guerre des Géants: le mythe avant l'époque hellénistique",
    author: "Francis Vian",
    publisher: "Klincksieck",
    sourceType: "academic_book",
    publishedYear: 1952,
    notes:
      "The standard study of the Gigantomachy before the Hellenistic period, built on the depictions as much as on " +
      "the texts. Cited for the finding that the Gigantes of Archaic and Classical art are man-sized warriors in " +
      "hoplite armour, fully human in form — which is the opposite of what the English word 'giant' now suggests, " +
      "and is the evidence that the monstrous serpent-legged type is a later development rather than the original.",
  },
  {
    key: "mayor_2000",
    title: "The First Fossil Hunters: Paleontology in Greek and Roman Times",
    author: "Adrienne Mayor",
    publisher: "Princeton University Press",
    sourceType: "academic_book",
    publishedYear: 2000,
    notes:
      "The argument that ancient Greeks and Romans collected, measured, displayed and attempted to explain the " +
      "bones of extinct animals, and that some reports of the remains of giants and heroes are reports of real " +
      "fossils. Cited for that argument and for its application to the hero-bone finds. Reissued in 2011 as 'The " +
      "First Fossil Hunters: Dinosaurs, Mammoths, and Myth in Greek and Roman Times'.",
  },
  {
    key: "aguirre_buxton_2020",
    title: "Cyclops: The Myth and Its Cultural History",
    author: "Mercedes Aguirre and Richard Buxton",
    publisher: "Oxford University Press",
    sourceType: "academic_book",
    publishedYear: 2020,
    notes:
      "Cited for the criticism of the elephant-skull explanation of the Cyclops: there is no ancient text and no " +
      "ancient image of a Greek looking at such a skull and describing a one-eyed being, which leaves the " +
      "proposal without anything that could confirm or refute it. A criticism about TESTABILITY rather than about " +
      "plausibility, and a useful thing for a reader to be able to tell apart.",
  },
  {
    key: "witton_hing_2024",
    title: "Did the horned dinosaur Protoceratops inspire the griffin?",
    author: "Mark P. Witton and Richard A. Hing",
    workTitle: "Interdisciplinary Science Reviews",
    reference: "2024; doi:10.1177/03080188241255543",
    url: "https://journals.sagepub.com/doi/10.1177/03080188241255543",
    sourceType: "academic_paper",
    publishedYear: 2024,
    notes:
      "A critical examination of geomythological arguments generally. Cited for the specific point that Abel's " +
      "Cyclops proposal was popularised on the claim that Empedocles identified elephant bones as the remains of " +
      "Cyclopes, and THAT CLAIM HAS NO BASIS IN ANY SURVIVING ANCIENT TEXT — with the consequence the authors " +
      "draw, that without it the argument reduces to the observation that elephant fossils and one-eyed monsters " +
      "both occur in many parts of the world.",
  },
  {
    key: "abel_1914",
    title: "Othenio Abel's 1914 proposal that dwarf elephant skulls underlie the Cyclops",
    author: "Othenio Abel",
    reference: "1914",
    sourceType: "modern_interpretation",
    publishedYear: 1914,
    notes:
      "THE TITLE OF THIS ENTRY DESCRIBES THE PROPOSAL RATHER THAN NAMING A PUBLICATION, because the proposal is " +
      "well attested in the later literature while the exact 1914 publication could not be verified from here, and " +
      "a plausible-looking title invented to fill the gap would be a fabricated citation. Abel, an Austrian " +
      "palaeobiologist, proposed that the skull of a Pleistocene dwarf elephant — which has one large opening in " +
      "the middle of the face, for the trunk — was taken for the skull of a one-eyed giant. Cited as the ORIGIN of " +
      "the proposal, which is not the same as its best-known defender: Adrienne Mayor is that, and attributing the " +
      "idea to her would repeat exactly the error this dataset keeps guarding against.",
  },
  {
    key: "zaccarini_2015",
    title: "The Return of Theseus to Athens: A Case Study in Layered Tradition and Reception",
    author: "Matteo Zaccarini",
    workTitle: "Histos",
    reference: "Volume 9 (2015)",
    url: "https://histos.org/index.php/histos/article/download/289/283",
    sourceType: "academic_paper",
    publishedYear: 2015,
    notes:
      "Cited for the source-critical point about the Skyros story: the tradition is layered, the surviving " +
      "accounts are considerably later than the events, and Cimon's role in recovering the bones has no " +
      "contemporary evidence behind it. This is a different kind of doubt from 'were the bones a hero's' — it can " +
      "be argued from the sources, and it is the kind a student can learn to run themselves.",
  },

  // --- Palaeontology ------------------------------------------------------
  {
    key: "proboscidea_greece",
    title: "The Fossil Record of the Neogene Proboscidea (Mammalia) in Greece",
    workTitle: "Fossil Vertebrates of Greece",
    reference: "doi:10.1007/978-3-030-68398-6_12",
    url: "https://link.springer.com/chapter/10.1007/978-3-030-68398-6_12",
    sourceType: "academic_paper",
    notes:
      "Cited for what is in the ground in Greece: Pikermi in Attica and Samos are the richest localities for " +
      "fossil elephant relatives, with at least four proboscidean species recorded at each, including the " +
      "huge-bodied deinothere Deinotherium proavum, in deposits of the Late Miocene. NO AUTHOR IS GIVEN HERE " +
      "because the chapter's authorship could not be confirmed from here; the title, volume and DOI are as " +
      "published.",
  },
  {
    key: "falconeri_2021",
    title: "Palaeohistology reveals a slow pace of life for the dwarfed Sicilian elephant",
    workTitle: "Scientific Reports",
    reference: "Volume 11 (2021)",
    url: "https://www.nature.com/articles/s41598-021-02192-4",
    sourceType: "academic_paper",
    publishedYear: 2021,
    notes:
      "Cited for the size and setting of Palaeoloxodon falconeri, the Sicilian dwarf elephant of the Middle " +
      "Pleistocene: remains from Spinagallo Cave near Syracuse, a composite adult male estimated at about 96.5 cm " +
      "at the shoulder and an adult female at about 80 cm — the smallest elephant known to have evolved, derived " +
      "by insular dwarfism from the mainland straight-tusked elephant. The size is cited because it cuts both " +
      "ways in the Cyclops argument, and the record says so.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const GIANTS_GREEK_EVENTS: SeedEvent[] = [
  // =========================================================================
  // THE GIGANTES — where the English word comes from, and they start man-sized.
  // =========================================================================
  {
    slug: "gigantes-gigantomachy",
    title: "The Gigantes and their war against the gods",
    summary:
      "The beings our word 'giant' is named after — and in the earliest Greek poetry they have no stated height, while in the earliest Greek art they are man-sized soldiers.",
    description:
      "WHAT KIND OF RECORD IS THIS? Greek mythological tradition, in poetry and in a later handbook, plus a great deal of dated sculpture. Physical remains of the beings: none, and none claimed. Physical evidence about the STORY: abundant, because the pictures survive and can be dated.\n\n" +
      "THIS IS THE RECORD THAT EXPLAINS THE WORD. English 'giant' descends, through Latin, from Greek Gigantes — these beings. So the modern sense of the word, 'something enormous', is an inheritance FROM this tradition, and it is worth knowing that it may not be what the tradition started with. What gigas originally meant is unresolved: it was long glossed as 'earth-born', fitting their mother Gaia, and no agreed derivation has replaced that.\n\n" +
      "WHAT HESIOD ACTUALLY SAYS. In the Theogony the blood of the castrated Ouranos falls on Gaia, and she bears the Erinyes, the Meliai and the Gigantes. The Giants are called strong (krateroi) and great (megaloi), and they are born already armed — gleaming in armour, holding long spears. THERE IS NO HEIGHT, NO MEASUREMENT AND NO DATE. Whether 'great' means physically big or merely mighty is a real question in the scholarship, not a quibble, and a reader should know that the earliest text does not settle it.\n\n" +
      "WHAT THE PICTURES SHOW, AND WHEN THEY CHANGE. This is the part that surprises people. In Archaic and Classical Greek art the Gigantes are man-sized hoplites: helmet, shield, spear, fully human in form, fighting the gods as soldiers fight. The snake-legged monster that the word now brings to mind appears later — the art-historical literature puts the change after about 380 BCE — and by the Pergamon Altar in the second century BCE the Giants are serpent-limbed. THE MONSTROUS GIANT IS THE END OF THIS TRADITION, NOT ITS BEGINNING.\n\n" +
      "SO WHAT IS DATED HERE? Five different things, and they are five claims below: where the story sits (nowhere on any calendar — before human history), when the earliest surviving account was composed, when the tidy systematic version was compiled eight hundred years later, when a particular monument carved the war in stone, and when the pictures stopped showing man-sized warriors. Only the last three can be dated by anything physical.\n\n" +
      "A CONNECTION WORTH FOLLOWING. When the Hebrew Bible was translated into Greek, the translators rendered nephilim as gigantes — these beings' name. That is how 'giants' entered the English Bible, and it means a Greek mythological word was laid over a Hebrew one whose own meaning is uncertain. The two traditions are linked on this timeline for that reason, and the link says what it is: a fact about a translation, not a finding that the beings are the same.\n\n" +
      "THINGS TO ASK: If the earliest text gives no height, where does the height in your head come from? Why would pictures of the same beings change so much over three hundred years? Does a word's modern meaning tell you anything about what it meant when it was new?",
    category: "culture",
    subcategory: "Greek tradition",
    eventType: "traditional_account",
    eventTypeNote:
      "A mythological tradition with no date of its own, carried in texts and images that have dates. The texts and the sculpture are real datable objects; the war is not an event anybody places in history.",
    tags: ["gigantes", "gigantomachy", "greek", "giants", "hesiod", "pergamon"],
    people: ["Hesiod", "Apollodorus", "Francis Vian"],
    locationName: "Greece",
    lat: 39.0,
    lng: 22.0,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Pergamonaltarathena.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Pergamonaltarathena.jpg?width=1024",
        shows: "artefact",
        caption:
          "Athena against the Giant Alkyoneus on the Pergamon Altar frieze, second century BCE. Note the legs: by " +
          "this date the Giants are serpent-limbed. In Archaic and Classical art, three centuries earlier, they are " +
          "drawn as man-sized hoplites.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Pergamon_Altar_Gigantomachy_frieze_section_1.JPG?width=1024",
        shows: "artefact",
        caption:
          "A stretch of the same frieze, which runs about 113 metres. A dated monument showing the war in stone — " +
          "evidence that the story was current and worth enormous public expense, and no evidence at all about " +
          "giants.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "hesiod_theogony",
        // NO YEAR, SO THE PRECISION IS A FORMALITY. date_precision has no value
        // meaning "not applicable", so a positionless claim follows the first
        // tranche's convention and takes the coarsest unit available. What the
        // claim means is in its heading and its type, never in this column.
        datePrecision: "millennium",
        isApproximate: true,
        originalDateText: "born when the blood of Ouranos fell upon Gaia — before human history, with no year given",
        datingMethod: "textual_interpretation",
        chronology: "traditional",
        temporalClaimType: "primordial",
        whatIsDated: "Where the story sits — in the primeval history of the world, which is not a position on a calendar",
        evidence:
          "WHAT IS DATED: nothing, and that is the claim. The Gigantes are born during the events that make the " +
          "world, before any human chronology exists. DATING METHOD: reading the text's own ordering. WHAT IT " +
          "ESTABLISHES: that the tradition places them before history rather than at a date within it. WHAT IT " +
          "DOES NOT ESTABLISH: any year. A claim that places nothing on the axis is the honest record of a source " +
          "that gives no date, and the schema holds it rather than inventing a number to fill the column.",
        notes:
          "THIS IS WHY THE DATABASE ALLOWS A CLAIM WITH NO YEAR. The alternative would be to guess, or to quietly " +
          "drop the most important thing the earliest source says about when this happened: nothing.",
      },
      {
        sourceKey: "hesiod_theogony",
        startYear: -729,
        endYear: -699,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Theogony, composed around 730–700 BCE",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "When the earliest surviving account was composed",
        evidence:
          "WHAT IS DATED: the composition of Hesiod's Theogony. DATING METHOD: the usual scholarly dating of " +
          "archaic Greek poetry, from language, metre and relation to other early poetry. WHAT IT ESTABLISHES: " +
          "that an account of the Gigantes existed by about 700 BCE. WHAT IT DOES NOT ESTABLISH: when the " +
          "tradition began, which is earlier and unmeasurable, or anything at all about when the events described " +
          "are supposed to have happened.",
        notes:
          "The surviving manuscripts are medieval, which is the normal state of a classical text and a third date " +
          "again. This record does not carry it as a separate claim because no single manuscript is the basis of " +
          "the text — the edition is reconstructed from many.",
      },
      {
        sourceKey: "apollodorus",
        startYear: 50,
        endYear: 200,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Bibliotheca, compiled in the first or second century CE",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "When the tidy, systematic version was compiled — about eight hundred years after Hesiod",
        evidence:
          "WHAT IS DATED: the compilation of the handbook most modern retellings descend from. DATING METHOD: " +
          "scholarly dating of the text. WHAT IT ESTABLISHES: that the organised single-war version of the " +
          "Gigantomachy is attested from the Roman imperial period. WHAT IT DOES NOT ESTABLISH: that the tradition " +
          "was ever as orderly as the handbook makes it. A handbook's job is to tidy, and the tidiness should be " +
          "credited to the handbook rather than to the Greeks.",
      },
      {
        sourceKey: "vian_1952",
        startYear: -179,
        endYear: -159,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "the Pergamon Altar frieze, about 180–160 BCE",
        datingMethod: "archaeological",
        chronology: "archaeological",
        temporalClaimType: "archaeological_date",
        whatIsDated: "When a dated monument carved the war in stone — an object, not a text",
        evidence:
          "WHAT IS DATED: the great Gigantomachy frieze at Pergamon, about 113 metres long and 2.3 metres high, " +
          "built under Eumenes II. DATING METHOD: archaeology and art history, with the reign as the frame. WHAT " +
          "IT ESTABLISHES: that the story was current, and worth enormous public expense, in the second century " +
          "BCE — and what the Giants looked like by then, which is serpent-limbed. WHAT IT DOES NOT ESTABLISH: " +
          "anything about the age of the tradition, and nothing whatever about giants existing.",
        notes:
          "The dating is argued rather than fixed: about 180–160 BCE is the usual range, and a later bracket of " +
          "166–156 BCE has been proposed. Either way it is Hellenistic, which is the point that matters here.",
      },
      {
        sourceKey: "vian_1952",
        startYear: -379,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "serpent-legged Gigantes appear in art after about 380 BCE",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        temporalClaimType: "approximate_date",
        whatIsDated: "When the Gigantes stopped being man-sized in art — a date for a change in pictures",
        evidence:
          "WHAT IS DATED: a change in iconography. Before it, Gigantes are shown as hoplites of human size and " +
          "fully human form; after it, the serpent-legged type spreads. DATING METHOD: stylistic comparison across " +
          "dated vases and sculpture. WHAT IT ESTABLISHES: that the monstrous giant is a later development inside " +
          "a tradition that did not start with it. WHAT IT DOES NOT ESTABLISH: that anyone's beliefs changed in " +
          "that year, or that the earlier artists thought the Giants were ordinary men — they show them fighting " +
          "gods.\n\n" +
          "NEEDS SOURCE VERIFICATION: the precise threshold of about 380 BCE is taken from reference literature on " +
          "Greek iconography that could not be consulted directly from here. The finding that the change happens, " +
          "and its direction, is well established; the year should be checked before it is quoted as exact.",
      },
    ],
  },

  // =========================================================================
  // POLYPHEMUS — one word, two traditions, and a skull with one hole in it.
  // =========================================================================
  {
    slug: "polyphemus-cyclopes",
    title: "Polyphemus, the Cyclopes, and the elephant-skull proposal",
    summary:
      "Two different Greek traditions share the word Cyclops, and a 1914 palaeontological proposal about where the one-eyed image came from is still argued about — because it cannot be tested.",
    description:
      "WHAT KIND OF RECORD IS THIS? Greek literary tradition, plus a modern scientific proposal about the origin of an image. Physical remains of a Cyclops: none. Physical remains relevant to the PROPOSAL: plenty, in Sicilian caves, and they are not what most retellings imply.\n\n" +
      "TWO TRADITIONS, ONE WORD, AND COLLAPSING THEM IS THE COMMONEST ERROR. In Homer's Odyssey the Cyclopes are herdsmen living without law, agriculture or ships, and Polyphemus traps Odysseus and his men in a cave and is blinded with a sharpened stake. In Hesiod the Cyclopes are three named craftsmen — Brontes, Steropes and Arges — who forge Zeus' thunderbolt. Same word; different beings, different numbers, different work. Any statement beginning 'the Cyclopes were' has to say WHICH.\n\n" +
      "AND HOMER GIVES NO MEASUREMENT. Polyphemus is monstrous and immensely strong, and the text supplies no height. Every figure you have ever read for the size of a Cyclops came from somewhere else.\n\n" +
      "THE FOSSIL PROPOSAL, AND WHOSE IT IS. In 1914 the Austrian palaeobiologist Othenio Abel proposed that the one-eyed image came from fossil skulls of Pleistocene dwarf elephants found in Mediterranean caves. An elephant skull has a single large opening in the middle of the face — it is where the trunk attaches, not an eye socket — and to anyone who had never seen an elephant it reads as one enormous eye. ABEL PROPOSED IT. Adrienne Mayor is its best-known modern defender. Those are two different roles and this record keeps them apart, because attributing a proposal to its most prominent advocate is the same mistake as crediting a discovery to the person who later wrote about it.\n\n" +
      "WHAT THE CRITICS SAY, AND IT IS GOOD CRITICISM. Mercedes Aguirre and Richard Buxton point out that there is no ancient text and no ancient image of a Greek looking at such a skull and describing a one-eyed being: nothing could confirm the proposal and nothing could refute it. Mark Witton and Richard Hing add something sharper. Abel's case was popularised on the claim that the philosopher Empedocles identified elephant bones as the remains of Cyclopes — AND THAT CLAIM HAS NO BASIS IN ANY SURVIVING ANCIENT TEXT. Take it away and what remains is that elephant fossils occur in many places and so do one-eyed monsters.\n\n" +
      "THE SIZE PROBLEM, WHICH CUTS BOTH WAYS. The Sicilian dwarf elephant, Palaeoloxodon falconeri, stood about 96 cm at the shoulder — the smallest elephant known to have evolved, shrunk by island living from a mainland ancestor. Its skull is strange and striking, and it is a small skull. Sicily also held larger elephants at other periods, so 'an elephant skull in a Sicilian cave' is not one fixed thing; but the species the proposal is usually told with is roughly the size of a large dog.\n\n" +
      "SO WHERE DOES THIS LEAVE A READER? With an interesting proposal, a real mechanism, no evidence tying it to any Greek, and a famous supporting detail that dissolves when traced. That is an honest place to stand, and it is more useful than a verdict. Note also what the criticism does NOT establish: showing that one proposed origin is untestable says nothing about whether ancient people ever misread fossil bones, which the next record shows they demonstrably did.\n\n" +
      "THINGS TO ASK: Which Cyclopes are being talked about? Who first proposed an explanation, and who merely repeated it? What evidence would settle this — and if none could, what does that mean? If a famous supporting detail turns out to have no source, what happens to the argument built on it?",
    category: "culture",
    subcategory: "Greek tradition",
    eventType: "traditional_account",
    eventTypeNote:
      "A literary tradition, carried with a modern hypothesis about its origin. The hypothesis is a separate claim with its own date and its own critics, and it is not evidence about the tradition's truth.",
    tags: ["cyclops", "polyphemus", "homer", "greek", "giants", "fossil", "geomythology"],
    people: ["Homer", "Hesiod", "Othenio Abel", "Adrienne Mayor", "Mercedes Aguirre", "Richard Buxton"],
    locationName: "Sicily and the Greek world",
    lat: 37.1,
    lng: 14.9,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Odysseus_and_Polyphemus,_Proto-Attic_neck_amphora,_ca_650_BC,_AM_Eleusis,_081141.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Odysseus_and_Polyphemus,_Proto-Attic_neck_amphora,_ca_650_BC,_AM_Eleusis,_081141.jpg?width=1024",
        shows: "artefact",
        caption:
          "Odysseus and his men driving the stake into Polyphemus' eye, on a proto-Attic amphora of about 650 BCE. " +
          "One of the earliest surviving images of the story — and, like Homer, it gives no measurement.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Skull_and_mandibula_of_Elephas_Falconeri,_Sicily,_AM_Syracuse,_121262.jpg?width=1024",
        shows: "evidence_photograph",
        caption:
          "The skull and jaw of the Sicilian dwarf elephant. The large central opening is the nasal cavity, where " +
          "the trunk attached — it is not an eye socket. This is the object Abel's 1914 proposal rests on; the " +
          "animal stood about a metre at the shoulder.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Palaeoloxodon_falconeri_(Sicilian_dwarf_elephant).jpg?width=1024",
        shows: "reconstruction",
        caption:
          "The Sicilian dwarf elephant as a living animal, reconstructed. Worth seeing next to its skull on this " +
          "record: the skull is strange enough to start a story, and the animal is about a metre tall and looks " +
          "like nothing anybody would call a Cyclops. Both facts belong to the same proposal.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "homer_odyssey",
        startYear: -749,
        endYear: -649,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Odyssey, composed in the eighth or seventh century BCE",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "When the poem containing Polyphemus was composed",
        evidence:
          "WHAT IS DATED: the composition of the Odyssey. DATING METHOD: the standard scholarly dating of Homeric " +
          "poetry, from language and historical references, with the oral tradition behind it older still. WHAT IT " +
          "ESTABLISHES: that the Polyphemus story was current by the seventh century BCE at the latest. WHAT IT " +
          "DOES NOT ESTABLISH: when anything in it happened, which the poem does not claim to say, or any height " +
          "for a Cyclops, which the poem does not give.",
      },
      {
        sourceKey: "hesiod_theogony",
        startYear: -729,
        endYear: -699,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Hesiod's three Cyclopes — Brontes, Steropes and Arges — around 730–700 BCE",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "When the OTHER tradition using this word was written down",
        evidence:
          "WHAT IS DATED: the composition of the Theogony, which contains a completely different set of Cyclopes: " +
          "three named smiths who make Zeus' thunderbolt. DATING METHOD: as for the Theogony generally. WHAT IT " +
          "ESTABLISHES: that two incompatible traditions share one word, both attested at about the same date, so " +
          "neither is a corruption of the other. WHAT IT DOES NOT ESTABLISH: which is 'the real' Cyclops — a " +
          "question with no answer, because the word covers both.",
        notes:
          "This claim exists so that the distinction cannot be lost. A record about Polyphemus that mentioned only " +
          "Homer would leave a reader thinking 'Cyclops' names one kind of being.",
      },
      {
        sourceKey: "falconeri_2021",
        startYear: -498050,
        endYear: -198050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "Palaeoloxodon falconeri of Sicily and Malta, about 500,000 to 200,000 years ago",
        datingMethod: "geological",
        chronology: "scientific",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "geological_date",
        whatIsDated: "When the dwarf elephants actually lived — the one measurable thing in this record",
        evidence:
          "WHAT IS DATED: the Middle Pleistocene existence of the Sicilian dwarf elephant, known from cave " +
          "deposits including Spinagallo near Syracuse. DATING METHOD: the geological dating of the deposits the " +
          "remains come from. WHAT IT ESTABLISHES: that the skulls the proposal depends on were genuinely there to " +
          "be found, and how big the animal was — about 96 cm at the shoulder for a composite adult male, about " +
          "80 cm for a female, the smallest elephant known. WHAT IT DOES NOT ESTABLISH: that any Greek found one, " +
          "which is the whole question and is not a palaeontological matter at all.",
        notes:
          "Converted from years before present rather than carried across: 500,000 years ago is −498050 and " +
          "200,000 years ago is −198050.\n\n" +
          "THE SIZE IS IN THIS CLAIM BECAUSE IT IS AWKWARD FOR THE PROPOSAL. A record that gave the species name " +
          "without the shoulder height would let a reader picture a mammoth skull.",
      },
      {
        sourceKey: "abel_1914",
        startYear: 1914,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "proposed in 1914 that dwarf elephant skulls underlie the one-eyed Cyclops",
        datingMethod: "claimant_inference",
        chronology: "hypothesis",
        temporalClaimType: "proposed_correlation",
        whatIsDated: "When the modern explanation was proposed — a date for an idea, not for an event",
        citations: [
          {
            sourceKey: "mayor_2000",
            relation: "supports",
            note:
              "Mayor is the proposal's best-known modern defender, setting it within a wider argument that ancient " +
              "people found and interpreted fossil bones. She defends Abel's idea; she did not originate it.",
          },
          {
            sourceKey: "aguirre_buxton_2020",
            relation: "disputes",
            note:
              "Aguirre and Buxton object that no ancient text or image shows a Greek examining such a skull, which " +
              "leaves nothing that could confirm or refute the proposal. A criticism about testability.",
          },
          {
            sourceKey: "witton_hing_2024",
            relation: "disputes",
            note:
              "Witton and Hing show that the widely repeated claim that Empedocles identified elephant bones as " +
              "Cyclopes' remains has no basis in any surviving ancient record, and argue that without it the case " +
              "reduces to the coincidence of fossils and one-eyed monsters both being widespread.",
          },
        ],
        evidence:
          "WHAT IS DATED: Abel's proposal, in 1914. DATING METHOD: the historical record of modern scholarship. " +
          "WHAT IT ESTABLISHES: that the explanation exists, who made it, and when. WHAT IT DOES NOT ESTABLISH: " +
          "the explanation itself. Nothing connects any Greek to any skull, and the supporting detail that made the " +
          "proposal famous — Empedocles — has no ancient source.\n\n" +
          "A DATE FOR A MODERN IDEA IS STORED AT THE IDEA'S OWN YEAR, not at the ancient material it is about. " +
          "Putting it at 1914 keeps the two clocks apart: this is an event in the history of scholarship.",
        notes:
          "NEEDS SOURCE VERIFICATION: the exact 1914 publication. The proposal and its year are well attested in " +
          "the later literature, and the source entry for it deliberately describes the proposal rather than " +
          "inventing a title that would look like a citation.",
      },
    ],
  },

  // =========================================================================
  // ORESTES — an ancient report, and the best piece of checking in the dataset.
  // =========================================================================
  {
    slug: "orestes-bones-tegea",
    title: "The bones of Orestes, dug up at Tegea",
    summary:
      "A blacksmith digging a well struck a coffin seven cubits long. He did not believe men had ever been that tall, so he opened it and measured the body — and Sparta took the bones to win a war.",
    description:
      "WHAT KIND OF RECORD IS THIS? A historian's report, written roughly 130 years after the event, of a physical discovery. Physical remains: reported, opened, measured — and lost. Nothing survives to examine.\n\n" +
      "WHAT HERODOTUS SAYS. Sparta is losing a war against Tegea. Delphi tells them they must bring home the bones of Orestes, son of Agamemnon. A Spartan named Lichas finds them through a conversation with a Tegean blacksmith, who tells him that while digging a well in his courtyard he struck a coffin seven cubits long.\n\n" +
      "AND HERE IS THE BEST SENTENCE IN THIS WHOLE DATASET. The blacksmith says he did not believe that men had ever been taller than men of his own day — SO HE OPENED THE COFFIN, AND HE MEASURED THE BODY. He found it as long as the coffin. That is someone in the sixth century BCE meeting an extraordinary claim by testing it, and it is exactly what this timeline asks of a reader. The finder's scepticism is not a modern addition; it is in the ancient text.\n\n" +
      "WHAT SEVEN CUBITS IS. On a cubit of roughly 45 cm, about 3.15 metres. Herodotus reports the measurement; he does not vouch for the identification as Orestes, which came from an oracle and a war, not from the bones.\n\n" +
      "WHAT THE TEXT DOES NOT CONTAIN. No description of the bones themselves — no skull, no limbs, nothing anatomical. Nothing that would let anyone today say what was in the coffin. The remains were taken to Sparta and are gone.\n\n" +
      "WHY ANYONE WANTED THEM. Sparta was told it could not win without them, and after acquiring them it won. Hero-relics were politically valuable, and the identification served that purpose. THAT DOES NOT MAKE THE OBJECT IMAGINARY — it means the NAME on it was a claim made by interested parties, while the coffin and the bones inside it were something a blacksmith hit with a spade.\n\n" +
      "THE MODERN PROPOSAL, AND ITS DIFFICULTY. Adrienne Mayor argues that finds like this are finds of fossil megafauna, of which Greece has a great deal. The difficulty, which this record states rather than hides, is that Herodotus describes a COFFIN with a body inside it, which is a burial rather than a fossil bed. Either the coffin is a detail of the story rather than of the find, or the find was a grave — and nobody can now check.\n\n" +
      "THINGS TO ASK: What was measured, and by whom? Would you believe a measurement you could not repeat? What would a very large human skeleton look like to someone who had never seen an elephant's? Who benefited from the identification — and does that make the report false, or just interested?",
    category: "history",
    subcategory: "Ancient report of a discovery",
    eventType: "historical",
    eventTypeNote:
      "A reported find, not an established one: the account is good evidence that the find was made and described, and no evidence at all about what the bones were.",
    tags: ["orestes", "tegea", "sparta", "herodotus", "giants", "bones", "greek"],
    people: ["Herodotus", "Lichas", "Adrienne Mayor"],
    civilisations: ["Sparta", "Tegea"],
    locationName: "Tegea, Arcadia",
    lat: 37.46,
    lng: 22.42,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Archaeological_site_of_the_Temple_of_Athena_Alea_at_Tegea_(2017,_image_1).jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Archaeological_site_of_the_Temple_of_Athena_Alea_at_Tegea_(2017,_image_1).jpg?width=1024",
        shows: "site",
        caption:
          "Tegea, where the coffin was reportedly dug up. These are the foundations of the temple of Athena Alea, " +
          "the town's sanctuary — NOT the blacksmith's courtyard, which nobody has identified. The place is real " +
          "and the find is a report.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "herodotus_orestes",
        startYear: -559,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "in the reigns of Anaxandridas and Ariston, about 560 BCE",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        temporalClaimType: "approximate_date",
        whatIsDated: "When the find is reported to have happened",
        evidence:
          "WHAT IS DATED: the discovery and removal of the bones. DATING METHOD: Herodotus places the Spartan " +
          "recovery in the reigns of the kings he names, and the absolute year is a modern inference from Spartan " +
          "regnal chronology. WHAT IT ESTABLISHES: roughly when the episode is placed — the middle of the sixth " +
          "century BCE. WHAT IT DOES NOT ESTABLISH: the year, to any precision; the figure is a decade at best. " +
          "And it dates the FINDING of the bones, not the bones.",
        notes:
          "The stored year is about 560 BCE, which is −559 in astronomical numbering. Treating it as precise would " +
          "be a false precision laid on top of a reign.",
      },
      {
        sourceKey: "herodotus_orestes",
        startYear: -429,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Herodotus writing around 430 BCE, about 130 years later",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "When the report was written — the date of the source, not of the find",
        evidence:
          "WHAT IS DATED: the composition of the Histories. DATING METHOD: the standard dating of Herodotus' work. " +
          "WHAT IT ESTABLISHES: that the account is separated from the event by roughly a century and a third, and " +
          "that it reaches us through one writer who was not there. WHAT IT DOES NOT ESTABLISH: that the story is " +
          "wrong. A gap is a thing to know about a source, not a verdict on it.",
      },
      {
        sourceKey: "herodotus_orestes",
        startYear: -559,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "a coffin seven cubits long, and the corpse as long as the coffin",
        datingMethod: "source_assertion",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "How long the body was said to be — a length, not a date",
        evidence:
          "WHAT IS DATED: nothing. This claim carries the MEASUREMENT, so that it cannot be mistaken for a date or " +
          "lost inside the narrative. DATING METHOD: the source's own assertion, which in this case rests on " +
          "somebody actually measuring. WHAT IT ESTABLISHES: what was reported — seven cubits, about 3.15 m on a " +
          "cubit of roughly 45 cm, with the body said to match the coffin's length. WHAT IT DOES NOT ESTABLISH: " +
          "that the body was human, or that the measurement was taken in a way anyone could now audit.",
        notes:
          "Stored at the year of the find because a measurement has no date of its own; what it measures is in its " +
          "own heading.",
      },
      {
        sourceKey: "mayor_2000",
        startYear: -559,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "proposed as a find of fossil megafauna rather than of a human skeleton",
        datingMethod: "claimant_inference",
        chronology: "hypothesis",
        temporalClaimType: "proposed_correlation",
        whatIsDated: "Whether the bones were fossil animal remains — a modern proposal about an ancient find",
        evidence:
          "WHAT IS DATED: nothing. The proposal is carried as its own claim because it is a real explanation that " +
          "deserves to be stated and examined rather than attached to the narrative as a conclusion. DATING " +
          "METHOD: inference from the abundance of large extinct mammals in Greek deposits to the content of " +
          "ancient reports. WHAT IT ESTABLISHES: a plausible mechanism by which an honest report of enormous bones " +
          "arises with no giant humans involved. WHAT IT DOES NOT ESTABLISH: what was in this coffin. The remains " +
          "are lost, nothing anatomical was recorded, and Herodotus describes a coffin — which a fossil bed does " +
          "not provide.",
        notes:
          "Stored at the ancient find rather than at 2000, when the argument was published, so that it sits beside " +
          "what it is about. The publication date is on the source.\n\n" +
          "WHAT WOULD CHANGE THIS EITHER WAY: the bones, which do not exist; or an ancient description detailed " +
          "enough to identify an animal, which this text does not give.",
      },
    ],
  },

  // =========================================================================
  // THESEUS — the record where the source gives NO measurement, and a spear.
  // =========================================================================
  {
    slug: "theseus-bones-skyros",
    title: "The bones of Theseus, brought to Athens from Skyros",
    summary:
      "Cimon dug up a coffin holding a man of extraordinary size, with a bronze spear and a sword beside it. Plutarch gives no measurement at all — and the grave goods point to a burial, not a fossil bed.",
    description:
      "WHAT KIND OF RECORD IS THIS? A biography written nearly six hundred years after the event, reporting a find. Physical remains: reported, reburied in Athens, lost. Grave goods: reported, and they matter.\n\n" +
      "WHAT PLUTARCH SAYS. After the Persian wars, in the archonship of Phaedo — 476/475 BCE — the Athenians are told by Delphi to bring home the bones of Theseus and guard them. Cimon takes Skyros, and wanting to find the grave, sees an eagle tearing at the ground on what looked like a mound. He digs there, and finds the coffin of a man of extraordinary size, with a bronze spear lying beside it and a sword.\n\n" +
      "THE MOST IMPORTANT THING IN THIS RECORD IS A MISSING NUMBER. PLUTARCH GIVES NO MEASUREMENT. 'A man of extraordinary size' is the whole of it. A dataset that wrote 'the skeleton of Theseus was three metres long' would be inventing a figure, and the number would then be quoted forever. So this record carries a claim that deliberately places nothing: the source states no size, and the honest way to record a size that was never given is to record that it was never given.\n\n" +
      "THE BRONZE SPEAR AND THE SWORD ARE THE REAL EVIDENCE HERE, AND THEY POINT AWAY FROM GIANTS AND AWAY FROM FOSSILS AT THE SAME TIME. Weapons laid beside a body mean a burial. A large man in a grave on a Greek island, buried with his weapons, is an entirely ordinary thing to dig up — Bronze Age and Early Iron Age graves on Skyros are real archaeology. And a fossil deposit does not supply a bronze spear. So of the three bone-finds in this group, THIS is the one the fossil explanation should not be applied to, and this record is deliberately not linked to it.\n\n" +
      "A SECOND DOUBT, OF A COMPLETELY DIFFERENT KIND. Matteo Zaccarini's study of the tradition shows it is layered, and that Cimon's role in the recovery has no contemporary evidence: the accounts we have are considerably later than 476 BCE. So this record carries two uncertainties that should never be confused. One is 'were the bones Theseus?' — untestable, because the bones are gone and Theseus is a legendary figure. The other is 'is the story of the recovery reliable?' — a question about sources, which can be argued from the sources, and which a student can learn to run themselves.\n\n" +
      "WHY ATHENS WANTED THEM. A founding hero's relics in your own city, with a shrine, are worth having; Athens gave them one. The political use of a find is a fact about the finders.\n\n" +
      "THINGS TO ASK: If a source gives no number, where would a number in a retelling have come from? What do grave goods tell you about what was in the ground? Can you doubt a story's details and still think something was dug up? Which of those two doubts can actually be investigated?",
    category: "history",
    subcategory: "Ancient report of a discovery",
    eventType: "historical",
    eventTypeNote:
      "A reported find, transmitted through later writers. The archon year gives it a real date; the size of the skeleton has no figure, and the record keeps it that way.",
    tags: ["theseus", "skyros", "cimon", "plutarch", "athens", "giants", "bones"],
    people: ["Plutarch", "Cimon", "Matteo Zaccarini"],
    civilisations: ["Athens"],
    locationName: "Skyros",
    lat: 38.9,
    lng: 24.56,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Theseus_Minotaur_BM_Vase_E84.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Theseus_Minotaur_BM_Vase_E84.jpg?width=1024",
        shows: "artefact",
        caption:
          "Theseus and the Minotaur on an Attic vase. A DIFFERENT EPISODE ENTIRELY, shown because it is what " +
          "survives: there is no ancient image of Cimon opening the grave on Skyros, and a picture of the hero is " +
          "not evidence about the bones.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "plutarch_theseus",
        startYear: -475,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "in the archonship of Phaedo, 476/475 BCE",
        datingMethod: "regnal_chronology",
        chronology: "historical",
        temporalClaimType: "absolute_date",
        citations: [
          {
            sourceKey: "zaccarini_2015",
            relation: "disputes",
            note:
              "Zaccarini shows the tradition is layered and that Cimon's part in the recovery has no contemporary " +
              "evidence. The archon year dates the oracle and the episode as the tradition places it; whether the " +
              "recovery happened as described is a separate question, argued from the sources.",
          },
        ],
        whatIsDated: "When the bones are said to have been brought to Athens",
        evidence:
          "WHAT IS DATED: the recovery of the bones, by the Athenian archon year — which is how absolute dates in " +
          "Greek history are fixed at all, by naming the official the year is named after. DATING METHOD: the " +
          "archon list. WHAT IT ESTABLISHES: a genuinely precise year for the episode as reported, which is rare " +
          "in this dataset. WHAT IT DOES NOT ESTABLISH: that the find happened as described, or anything about what " +
          "the bones were.",
        notes:
          "476/475 BCE is a single Athenian year straddling two of ours, because the archon year did not begin in " +
          "January. Stored as −475, which is 476 BCE.",
      },
      {
        sourceKey: "plutarch_theseus",
        // Positionless, for the same reason as the Gigantes claim above: there is
        // nothing to place, and the precision column has no way to say so.
        datePrecision: "millennium",
        isApproximate: true,
        originalDateText: "a coffin of a man of extraordinary size — no measurement given",
        datingMethod: "source_assertion",
        chronology: "historical",
        temporalClaimType: "unknown",
        whatIsDated: "How big the skeleton was — the source gives no figure, so this claim places nothing",
        evidence:
          "WHAT IS DATED: nothing, deliberately. DATING METHOD: none; there is no measurement to record. WHAT IT " +
          "ESTABLISHES: that the only description of the skeleton's size in the source is the words 'extraordinary " +
          "size', together with a bronze spear and a sword beside the coffin. WHAT IT DOES NOT ESTABLISH: any " +
          "height, length or proportion — and the absence is the finding.\n\n" +
          "THIS IS WHAT A POSITIONLESS CLAIM IS FOR. A missing number recorded as a missing number cannot turn " +
          "into a quoted one later.",
        notes:
          "Compare the Tegea record, where a figure IS given and is carried as its own claim. Two reports of the " +
          "same kind of find, one with a measurement and one without: the difference is visible on the timeline " +
          "only because neither was tidied up to match the other.",
      },
      {
        sourceKey: "plutarch_theseus",
        startYear: 100,
        endYear: 120,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Plutarch writing around 100–120 CE, nearly six hundred years after the event",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "When the surviving account was written",
        evidence:
          "WHAT IS DATED: the composition of Plutarch's Lives. DATING METHOD: the standard dating of his career. " +
          "WHAT IT ESTABLISHES: the distance between the event and the fullest surviving account of it — nearly six " +
          "centuries. WHAT IT DOES NOT ESTABLISH: that Plutarch is the first to report it. Earlier accounts existed " +
          "and he drew on them; his is the one that survives in full, which is a different thing and is the reason " +
          "this claim is an estimated range for a composition rather than a first record.",
      },
    ],
  },

  // =========================================================================
  // ANTAEUS — sixty cubits, and a Roman general who doubted it first.
  // =========================================================================
  {
    slug: "antaeus-bones-tingis",
    title: "Sertorius opens the tomb of Antaeus at Tingis",
    summary:
      "Told that a giant lay under a mound at Tangier, a Roman general refused to believe it and had it dug open. Plutarch says he found a body sixty cubits long — about 27 metres — and reburied it.",
    description:
      "WHAT KIND OF RECORD IS THIS? A biography reporting what a Roman commander did in about 81 BCE, at three removes: a local Libyan tradition, a Roman's account of acting on it, and Plutarch writing nearly two centuries later. Physical remains: reported, reburied, never examined again.\n\n" +
      "WHAT PLUTARCH SAYS, IN THE ORDER HE SAYS IT. At Tingis — modern Tangier — the Libyans said that Antaeus, the giant Heracles wrestled, was buried in a great mound. SERTORIUS DID NOT BELIEVE THEM, because of the size claimed, and had the mound opened. Plutarch reports that a body sixty cubits long was found, that Sertorius was astonished, that he sacrificed, and that he heaped the tomb up again.\n\n" +
      "THE DOUBT COMES FIRST IN THE TEXT AND IT BELONGS FIRST IN ANY ACCOUNT OF IT. Sertorius did the right thing: he met an extraordinary claim by going and digging. What he did not do is anything a reader today could audit — no description of the bones, no account of how a length was arrived at, nothing retained.\n\n" +
      "SIXTY CUBITS IS ABOUT 27 METRES, and this is the place to stop and think. The record will not tell you what to conclude, but it will give you the physics, because the physics is checkable. A land animal's weight grows roughly with the cube of its length, while the cross-section of bone carrying that weight grows roughly with the square. Scale a 1.8 m person to 27 m — fifteen times taller — and the mass goes up about 3,400 times while the load-bearing area of the bones goes up about 225 times. The stress in the skeleton rises roughly fifteen-fold. Nothing shaped like a human being stands up at that size. THAT IS A STATEMENT ABOUT SCALING AND ABOUT PRIMATE SKELETONS, AND IT IS NOT A STATEMENT ABOUT WHAT WAS IN THE MOUND.\n\n" +
      "SO WHAT WAS IN THE MOUND? Nobody can now say, and this record does not pretend otherwise. What can be said is how a figure like sixty cubits is produced: scattered large bones measured as if they belonged to one upright body give enormous totals, and Mayor argues that reports of this class come from finds of fossil animals. Whether that is what happened at Tingis is untestable — the mound was closed again and nothing was recorded anatomically.\n\n" +
      "AND THE REASON TO BE CAREFUL WITH SERTORIUS PARTICULARLY. He was fighting a war in a province where a local wonder was politically useful, and a general who confirms a marvel has a story to tell. That does not make the report false. It is a reason to want the bones, which we do not have.\n\n" +
      "THINGS TO ASK: What did Sertorius do right, and where does his account stop being checkable? Why does a 27 m person not work, and is that the same question as what was found? Who is telling you this, and how many hands has it passed through? Is 'we cannot tell' an acceptable answer — and what would change it?",
    category: "history",
    subcategory: "Ancient report of a discovery",
    eventType: "historical",
    eventTypeNote:
      "A reported find at three removes. The report is good evidence that a mound was opened and a wonder announced, and no evidence about what the bones were.",
    tags: ["antaeus", "sertorius", "tingis", "plutarch", "giants", "bones", "rome"],
    people: ["Plutarch", "Quintus Sertorius", "Adrienne Mayor"],
    civilisations: ["Rome"],
    locationName: "Tingis (Tangier)",
    lat: 35.78,
    lng: -5.81,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Herakles_Antaios_Louvre_G103.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Herakles_Antaios_Louvre_G103.jpg?width=1024",
        shows: "artefact",
        caption:
          "Heracles wrestling Antaeus, on a krater by Euphronios, Louvre G 103. A Greek painter's image of the " +
          "story centuries before Sertorius opened a mound at Tingis and was told whose bones they were.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "plutarch_sertorius",
        startYear: -80,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "Sertorius in Mauretania, about 81 BCE",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "approximate_date",
        whatIsDated: "When the mound is reported to have been opened",
        evidence:
          "WHAT IS DATED: the episode at Tingis. DATING METHOD: the historical record of Sertorius' career, his " +
          "crossing to Africa being placed at about 81 BCE. WHAT IT ESTABLISHES: roughly when the digging is " +
          "reported to have happened. WHAT IT DOES NOT ESTABLISH: the exact year — the date comes from the " +
          "campaign rather than from the episode — and nothing at all about the bones.",
        notes: "About 81 BCE is −80 in astronomical numbering.",
      },
      {
        sourceKey: "plutarch_sertorius",
        startYear: -80,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "a body sixty cubits long — about 27 metres",
        datingMethod: "source_assertion",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "How long the body was said to be — the claim, carried as a claim",
        evidence:
          "WHAT IS DATED: nothing. The figure is carried as its own claim so that it is neither hidden in the " +
          "narrative nor mistaken for a finding. DATING METHOD: the source's assertion. WHAT IT ESTABLISHES: what " +
          "was reported — sixty cubits, about 27 m on a cubit of roughly 45 cm. WHAT IT DOES NOT ESTABLISH: that " +
          "anything 27 m long was there. No account survives of how the length was arrived at, and a body that " +
          "long cannot be a human being for reasons of scaling that have nothing to do with this report's honesty.",
        notes:
          "THE SCALING, SO A READER CAN CHECK IT RATHER THAN TAKE IT. Fifteen times the height of a 1.8 m person: " +
          "mass rises by about 15³, roughly 3,400 times; bone cross-section by about 15², roughly 225 times; so " +
          "the stress in the skeleton rises about fifteenfold. This is why large land animals have thick, " +
          "straight, pillar-like limbs and are not scaled-up people.",
      },
      {
        sourceKey: "mayor_2000",
        startYear: -80,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "proposed as a find of large fossil animal bones measured as one body",
        datingMethod: "claimant_inference",
        chronology: "hypothesis",
        temporalClaimType: "proposed_correlation",
        whatIsDated: "Whether the bones were fossil animal remains — a modern proposal about an ancient report",
        evidence:
          "WHAT IS DATED: nothing. DATING METHOD: inference from how such reports arise — scattered large bones " +
          "measured as though they formed one upright skeleton produce very large totals. WHAT IT ESTABLISHES: a " +
          "mechanism that accounts for an enormous figure in an honest report. WHAT IT DOES NOT ESTABLISH: what " +
          "was under the mound at Tingis. It was covered again, nothing anatomical was recorded, and this record " +
          "names no species.\n\n" +
          "THE RECORD DOES NOT ASSERT WHICH ANIMAL, because asserting one would be exactly the move this dataset " +
          "objects to elsewhere: turning 'found associated with large bones' into a scientific identification.",
        notes:
          "Stored at the ancient report rather than at 2000, when Mayor's argument was published, so it sits " +
          "beside what it is about.",
      },
    ],
  },

  // =========================================================================
  // THE FOSSIL BEDS — the measuring stick, as Gigantopithecus was in part one.
  // =========================================================================
  {
    slug: GIANTS_GREEK_ANCHOR_SLUG,
    title: "What is actually in the ground: the fossil beds of the Greek world",
    summary:
      "Greece sits on beds of enormous extinct mammals, and the Mediterranean islands on dwarf elephants. These bones are real, measurable and curated — and seven million years older than anyone who dug them up.",
    description:
      "WHAT KIND OF RECORD IS THIS? Palaeontology. Physical remains: abundant, curated in museums, published and datable. This record is the measuring stick for the three bone-finds in this group, in the way Gigantopithecus is the measuring stick for the texts in part one — it is what it looks like when the evidence can be held in a hand.\n\n" +
      "WHAT IS IN GREECE. Pikermi in Attica and the island of Samos hold the richest Greek deposits of fossil elephant relatives, with at least four proboscidean species recorded at each. Among them is the deinothere Deinotherium proavum, a huge-bodied animal with downward-curving tusks, from the Late Miocene — roughly seven million years ago. A single femur or tusk from an animal like this is larger than any human bone, and to someone who had never seen an elephant skeleton it looks like the bone of an enormous person.\n\n" +
      "AND WHAT IS ON THE ISLANDS, MUCH LATER AND MUCH SMALLER. Sicily and Malta had dwarf elephants: Palaeoloxodon falconeri, Middle Pleistocene, known from cave deposits such as Spinagallo near Syracuse. A composite adult male is estimated at about 96.5 cm at the shoulder — the smallest elephant known to have evolved, shrunk by island living from the mainland straight-tusked elephant. Both kinds of deposit are in the same sea, and they are a world apart in age and in size.\n\n" +
      "MAYOR'S ARGUMENT, STATED PLAINLY. Adrienne Mayor argues that Greeks and Romans found these bones, collected them, measured them, displayed them and tried to explain them, and that some ancient reports of the remains of giants and heroes are reports of real fossils. This is a historical claim about a practice, and it is a strong one: the ancient world had no framework in which a seven-million-year-old elephant relative was a possible answer, and a hero was.\n\n" +
      "WHAT THE ARGUMENT CAN AND CANNOT DO, which is the whole reason this record exists. IT CAN explain how careful, honest people produced credible reports of enormous bones with no giant humans anywhere. IT CANNOT identify any particular find: every reported body in this group is lost, none was described anatomically, and at Skyros the coffin came with a bronze spear, which no fossil bed supplies. A general explanation that fits a class of reports is not a finding about any member of the class.\n\n" +
      "THE CRITICAL DISTINCTION THIS RECORD EXISTS TO PROTECT. THE AGE OF THESE FOSSILS IS NOT THE AGE OF ANYTHING ANYBODY REPORTED. Deinotherium died out roughly seven million years before Herodotus was born. A reader who takes 'the bones were fossils' and writes 'the giants were seven million years old' has made exactly the error this whole timeline is built to prevent: the age of the material and the date of the report are two different claims, and nothing here dates a giant at all.\n\n" +
      "THINGS TO ASK: What would you think an elephant's thigh bone was, if you had never seen an elephant? Does explaining how a report could arise prove that it did arise that way? And what is the difference between the date of a bone and the date of a story about a bone?",
    category: "nature",
    subcategory: "Fossil evidence",
    eventType: "scientific_model",
    eventTypeNote:
      "Palaeontological evidence with measured dates, carried alongside a historical argument about how ancient people interpreted it. The fossils are not disputed; what they explain is argued.",
    tags: ["fossil", "greece", "pikermi", "samos", "deinotherium", "dwarf-elephant", "giants", "physical-evidence"],
    people: ["Adrienne Mayor"],
    locationName: "Pikermi, Samos, and the Mediterranean islands",
    lat: 38.01,
    lng: 23.93,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Deinotherium_skull.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Deinotherium_skull.jpg?width=1024",
        shows: "evidence_photograph",
        caption:
          "The skull of a deinothere, with its downward-curving tusks. Animals like this are in the fossil beds of " +
          "Attica and Samos — and died about seven million years before Herodotus. A single bone of one is larger " +
          "than any human bone.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Palaeoloxodon_falconeri_Size_Comparison.svg?width=1024",
        shows: "diagram",
        caption:
          "The Sicilian dwarf elephant beside a human figure, to scale. The same sea holds both this animal and the " +
          "huge deinotheres of the Greek mainland — which is why 'an elephant fossil in the Mediterranean' is not " +
          "one thing.",
        kind: "image",
        // Written WITHOUT its credit: the credit is worked out from the
        // picture's own source at seed time, so it says what the source says
        // today rather than what was typed here from memory.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "proboscidea_greece",
        startYear: -7500000,
        endYear: -7000000,
        datePrecision: "million_years",
        isApproximate: true,
        originalDateText: "Pikermi and Samos, Late Miocene — about 7.5 to 7 million years ago",
        datingMethod: "geological",
        chronology: "geological",
        temporalClaimType: "geological_date",
        whatIsDated: "When the huge mammals of the Greek fossil beds lived",
        evidence:
          "WHAT IS DATED: the deposits at Pikermi in Attica and on Samos, the richest Greek localities for fossil " +
          "proboscideans, with at least four species recorded at each including the huge deinothere Deinotherium " +
          "proavum. DATING METHOD: geological and biochronological dating of the Late Miocene deposits. WHAT IT " +
          "ESTABLISHES: that animals far larger than any human were lying in the ground of classical Greece, " +
          "available to be dug up. WHAT IT DOES NOT ESTABLISH: that any particular ancient report is a report of " +
          "them. The bones are evidence about the ground, not about the stories.",
        notes:
          "Stored as plain negative years at million-year scale, with no before-present offset: 1,950 years is " +
          "noise against seven million, and a convention that matters at 200,000 years does not at 7,000,000.\n\n" +
          "THE GAP IS THE LESSON. These animals died about seven million years before Herodotus. Nothing about " +
          "this claim dates a giant, a hero or a report.",
      },
      {
        sourceKey: "falconeri_2021",
        startYear: -498050,
        endYear: -198050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "Mediterranean dwarf elephants, about 500,000 to 200,000 years ago",
        datingMethod: "geological",
        chronology: "scientific",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "geological_date",
        whatIsDated: "When the island dwarf elephants lived",
        evidence:
          "WHAT IS DATED: the Middle Pleistocene existence of Palaeoloxodon falconeri on Sicily and Malta, from " +
          "cave deposits including Spinagallo near Syracuse. DATING METHOD: geological dating of the deposits. " +
          "WHAT IT ESTABLISHES: that small elephants with large, strange skulls lived and died on Mediterranean " +
          "islands, about 96.5 cm at the shoulder for a composite adult male. WHAT IT DOES NOT ESTABLISH: that " +
          "anyone in antiquity saw one of their skulls, which is the claim the Cyclops proposal needs and does not " +
          "have.",
        notes:
          "Converted from years before present rather than carried across: 500,000 years ago is −498050 and " +
          "200,000 years ago is −198050.",
      },
      {
        sourceKey: "mayor_2000",
        startYear: 2000,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "argued in 2000 that ancient reports of giants' bones are reports of fossils",
        datingMethod: "textual_interpretation",
        chronology: "hypothesis",
        temporalClaimType: "proposed_correlation",
        whatIsDated: "When the modern argument was published — and here the date IS a modern one",
        evidence:
          "WHAT IS DATED: the publication of Mayor's argument. DATING METHOD: the historical record of scholarship. " +
          "WHAT IT ESTABLISHES: that a documented, citable case exists for ancient people collecting and " +
          "interpreting fossil bones, and who makes it. WHAT IT DOES NOT ESTABLISH: any particular " +
          "identification. The argument is about a practice, and the individual finds are gone.\n\n" +
          "A DELIBERATE CONTRAST WITH THE SAME ARGUMENT ON THE OTHER RECORDS. There it is stored at the ancient " +
          "find, because it is a claim ABOUT that find. Here it is stored at 2000, because what is dated is the " +
          "book. Same argument, two different things being dated, and the headings say which.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
//
// Every edge says who asserts the relationship and what kind of relationship it
// is. Note what is NOT here: no edge from the fossil record to the Skyros bones.
// The coffin there came with a bronze spear and a sword, which a fossil bed does
// not supply, and linking it anyway would spread a favourite explanation over a
// case that argues against it.
// ---------------------------------------------------------------------------

export const GIANTS_GREEK_LINKS: SeedEventLink[] = [
  {
    from: GIANTS_GREEK_ANCHOR_SLUG,
    to: "orestes-bones-tegea",
    relation: "evidence_for",
    viewpoint: "hypothesis",
    sourceKey: "mayor_2000",
    note:
      "Mayor offers the Greek fossil beds as the explanation of finds like the Tegea coffin. Offered as evidence, " +
      "and not a finding: the remains are lost, and Herodotus describes a coffin, which a fossil bed does not " +
      "provide.",
  },
  {
    from: GIANTS_GREEK_ANCHOR_SLUG,
    to: "antaeus-bones-tingis",
    relation: "evidence_for",
    viewpoint: "hypothesis",
    sourceKey: "mayor_2000",
    note:
      "The same argument applied to the sixty-cubit body at Tingis: large fossil bones measured as one skeleton " +
      "give enormous totals. The mound was reburied, so nothing confirms it here either.",
  },
  {
    from: GIANTS_GREEK_ANCHOR_SLUG,
    to: "polyphemus-cyclopes",
    relation: "evidence_for",
    viewpoint: "hypothesis",
    sourceKey: "abel_1914",
    note:
      "Abel's 1914 proposal that dwarf elephant skulls underlie the one-eyed Cyclops. The edge carries the source " +
      "so a reader meets the proposer rather than the proposal, and the record itself carries the criticism.",
  },
  {
    from: "orestes-bones-tegea",
    to: "theseus-bones-skyros",
    relation: "related",
    note:
      "Two hero-bone recoveries a century apart, both prompted by Delphi, both politically useful, and differing " +
      "in exactly the way that matters: one reports a measurement, the other reports none and adds grave goods.",
  },
  {
    from: "antaeus-bones-tingis",
    to: "orestes-bones-tegea",
    relation: "related",
    note:
      "Worth reading together for the finders' behaviour: a blacksmith who disbelieved and measured, and a Roman " +
      "general who disbelieved and dug. Ancient scepticism is not a modern invention.",
  },
  {
    from: "gigantes-gigantomachy",
    to: "nephilim-genesis",
    relation: "associated",
    viewpoint: "religious",
    note:
      "The Greek translators of the Hebrew Bible rendered nephilim as gigantes — the name of these beings — which " +
      "is how 'giants' entered the English Bible. A fact about a translation decision, NOT a finding that the two " +
      "traditions describe the same beings.",
  },
  {
    from: "polyphemus-cyclopes",
    to: "gigantes-gigantomachy",
    relation: "related",
    note:
      "Both Greek, both named by words English has absorbed, and both cases where the earliest sources give no " +
      "measurement while later tradition supplies vivid ones.",
  },
];
