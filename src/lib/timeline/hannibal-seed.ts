import type { SeedEvent, SeedSource, SeedTrack } from "./seed-types";

// HANNIBAL BARCA AND THE SECOND PUNIC WAR.
//
// Seventeen events about a war fought between 218 and 201 BCE, seeded as one
// dataset so a reader can follow a single question the whole way down:
//
//     HOW DO WE KNOW ANY OF THIS?
//
// The answer is a chain, and the chain is the point of the dataset:
//
//   1. CONTEMPORARY PHYSICAL AND DOCUMENTARY EVIDENCE — coins struck by the
//      Barcid regime in Iberia; a bronze tablet Hannibal set up in Italy.
//   2. CONTEMPORARY AND NEAR-CONTEMPORARY WITNESSES — Cincius Alimentus, a
//      Roman senator captured by Hannibal who says he had his numbers from
//      Hannibal himself; Cato, born during the war.
//   3. LATER SURVIVING HISTORIES — Polybius, writing about two generations
//      afterwards from interviews, travel and that tablet; Livy, writing two
//      centuries afterwards from earlier Roman annalists who are now lost.
//   4. MODERN SCHOLARSHIP — which mostly argues about what 1–3 can carry.
//
// Almost nothing here is direct. The tablet is lost and survives as a sentence
// in Polybius. Cincius' history is lost and survives as a sentence in Livy.
// Fabius Pictor, the first Roman historian and a contemporary of the war, is
// lost too. The dataset is built so that a reader meets that fact rather than
// being protected from it.
//
// RULES THIS DATA FOLLOWS.
//
//   · Nothing is invented. No fabricated quotations, page numbers, DOIs or
//     scholarly positions. Where a bibliographic detail could not be verified
//     it is omitted or the work is identified by author, journal and year
//     rather than by a guessed title.
//   · An event carries no date. Every date is a claim, with the source that
//     makes it and the reasoning that produced it.
//   · No confidence scores, and none may be added. `chronology` says where a
//     claim comes from; it never says how likely it is to be right.
//   · At most one claim per event is marked "conventional". Everything else is
//     labelled for what it actually is — an ancient narrative, a later
//     tradition, a modern reconstruction, a contested reading.
//   · Where the ancient sources give different numbers, BOTH numbers are
//     claims. Choosing one silently and printing it as fact is the single
//     commonest way a timeline lies.
//   · Ancient writers did not date events "BCE". They dated by consuls,
//     olympiads and seasons. The conversion is modern, and it is shown as a
//     separate claim wherever that distinction teaches something.

/** BCE year → astronomical year. 247 BCE is −246. See time.ts. */
const bce = (year: number): number => 1 - year;

/** Any one of these being present means the dataset has already been seeded. */
export const HANNIBAL_ANCHOR_SLUG = "hannibal-crosses-the-alps";

export const HANNIBAL_TRACK: SeedTrack = {
  name: "Carthage and Rome",
  slug: "carthage-and-rome",
  kind: "theme",
  color: "#a8543f",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const HANNIBAL_SOURCES: SeedSource[] = [
  // --- The nearest thing to contemporary evidence --------------------------
  {
    key: "lacinium",
    title: "Hannibal's inscription at the Lacinian promontory",
    author: "Set up by Hannibal Barca",
    reference: "Reported by Polybius, Histories 3.33 and 3.56",
    sourceType: "historical_document",
    publishedDisplay: "set up during the Italian campaign, after 218 BCE",
    notes:
      "A bronze tablet at the sanctuary of Hera Lacinia on the Lacinian promontory (Capo Colonna, near Crotone), recording the forces Hannibal brought with him. Polybius says he used it for his figures. THE OBJECT DOES NOT SURVIVE. Everything known about it is known because Polybius says he read it, which makes it the most direct Carthaginian evidence in this dataset and, at the same time, evidence nobody can go and check.",
    citedBy: "polybius",
  },
  {
    key: "barcid_coins",
    title: "Barcid silver coinage from Punic Iberia",
    sourceType: "archaeological",
    publishedDisplay: "struck c. 237–206 BCE",
    notes:
      "Silver shekels and fractions struck under Carthaginian rule in Iberia, many carrying a male head — usually identified as the god Melqart, with Herakles' club at the shoulder — and an elephant on the reverse. These are contemporary physical objects made by the regime Hannibal grew up in and later led. Cited here for what they are and when they were struck. Whether the head carries the features of Hamilcar or of Hannibal is argued about and cannot be settled from the coins themselves; they are not portraits in the modern sense and none of them is labelled.",
  },
  {
    key: "capo_colonna",
    title: "The sanctuary of Hera Lacinia at Capo Colonna, Crotone",
    sourceType: "archaeological",
    publishedDisplay: "excavated site; the sanctuary was in use long before and after 218 BCE",
    notes:
      "The place Polybius names. The sanctuary has been excavated and a single column of the temple still stands on the headland. Cited for the existence and location of the sanctuary — not for the tablet, of which no trace has been found.",
  },
  {
    key: "cincius",
    title: "Lucius Cincius Alimentus, quoted by Livy",
    author: "Lucius Cincius Alimentus",
    reference: "His history is lost; the statement survives at Livy 21.38",
    sourceType: "historical_document",
    publishedDisplay: "written c. 200 BCE; survives only as a quotation",
    notes:
      "A Roman senator and annalist who says he was captured by Hannibal, and who reports that he had a casualty figure from Hannibal's own mouth. His history is lost. The sentence survives because Livy quoted it two centuries later, which is as close as this dataset gets to Hannibal speaking about his own campaign.",
    citedBy: "livy",
  },

  // --- The surviving ancient narratives ------------------------------------
  {
    key: "polybius",
    title: "Histories",
    author: "Polybius",
    reference: "Books 3 and 9",
    sourceType: "historical_document",
    publishedDisplay: "written in the second century BCE",
    notes:
      "The earliest surviving continuous account of the war. Polybius was a Greek statesman born around 200 BCE — after the war ended — who was deported to Rome and became close to the Roman aristocracy. He interviewed people who had been there, travelled the ground including the Alpine route, and says he consulted Hannibal's own inscription in Italy. He is also the closest thing in the dataset to a critical historian: he argues about method, names his evidence, and attacks other writers for inventing detail.",
  },
  {
    key: "livy",
    title: "Ab Urbe Condita (The History of Rome), Books 21–30",
    author: "Titus Livius (Livy)",
    reference: "The third decade, Books 21–30",
    sourceType: "historical_document",
    publishedDisplay: "written in the late first century BCE",
    notes:
      "The fullest surviving narrative of the war, and the latest of the three — written about two centuries after the events, in Rome, by a writer with no military experience, working from earlier Roman annalists who are now lost and from Polybius. It preserves detail found nowhere else, including quotations from lost historians. It is also the most rhetorical: speeches, omens and scenes are composed the way ancient historiography expected them to be.",
  },
  {
    key: "nepos",
    title: "Life of Hannibal",
    author: "Cornelius Nepos",
    workTitle: "Excellentium Imperatorum Vitae (Lives of the Eminent Commanders)",
    sourceType: "historical_document",
    publishedDisplay: "written in the first century BCE",
    notes:
      "A short Latin life of Hannibal, written for a Roman readership about a century and a half after the war. Cited here for the shape the story had taken by then rather than for evidence of what happened.",
  },
  {
    key: "pliny",
    title: "Natural History, Book 8",
    author: "Pliny the Elder",
    reference: "Natural History 8.11, quoting Cato's Origines",
    sourceType: "historical_document",
    publishedDisplay: "written c. 77 CE, quoting a work of the second century BCE",
    notes:
      "Cited for one thing only: Pliny preserves a line from Cato the Elder's lost Origines naming an elephant 'Surus' as the best of the Carthaginian elephants, and noting that it had lost a tusk. Cato was born during the Second Punic War, which makes the underlying testimony nearly contemporary — but the work it came from is gone, and what survives is a sentence inside a Roman encyclopedia written two and a half centuries later.",
  },
  {
    key: "cicero",
    title: "Philippics",
    author: "Marcus Tullius Cicero",
    reference: "First Philippic",
    sourceType: "historical_document",
    publishedDisplay: "delivered 44 BCE",
    notes:
      "Cited as evidence for the PHRASE 'Hannibal ad portas' and for the fact that it still carried force in Roman political speech — not as evidence for anything that happened in 211 BCE. Cicero was speaking 167 years after Hannibal was outside the walls.",
  },

  // --- Modern scholarship ---------------------------------------------------
  {
    key: "lancel",
    title: "Hannibal",
    author: "Serge Lancel",
    publisher: "Blackwell",
    sourceType: "academic_book",
    publishedYear: 1998,
    publishedDisplay: "1998 (English translation)",
    notes:
      "A biography by an archaeologist and historian of Carthage. Cited for the mainstream modern reconstruction of Hannibal's life and for how the ancient evidence is weighed.",
  },
  {
    key: "lazenby",
    title: "Hannibal's War: A Military History of the Second Punic War",
    author: "J. F. Lazenby",
    publisher: "Aris & Phillips",
    sourceType: "academic_book",
    publishedYear: 1978,
    publishedDisplay: "1978 (reissued by the University of Oklahoma Press, 1998)",
    notes:
      "A standard military history of the war. Cited for the analysis of the ancient casualty and army figures — what the numbers can and cannot bear, and where the ancient accounts leave people out of their own totals.",
  },
  {
    key: "goldsworthy",
    title: "The Punic Wars",
    author: "Adrian Goldsworthy",
    publisher: "Cassell",
    sourceType: "book",
    publishedYear: 2000,
    publishedDisplay: "2000 (also published as The Fall of Carthage)",
    notes:
      "A narrative history of all three Punic wars for a general reader, by a Roman military historian. Cited for the mainstream account of the campaigns and their chronology.",
  },
  {
    key: "hoyos",
    title: "A Companion to the Punic Wars",
    author: "Dexter Hoyos (editor)",
    publisher: "Wiley-Blackwell",
    sourceType: "academic_book",
    publishedYear: 2011,
    publishedDisplay: "2011",
    notes:
      "A multi-author handbook in which specialists survey the state of the question on the sources, the chronology, the armies and the archaeology. Cited as a guide to where scholarly disagreement actually sits.",
  },
  {
    key: "hunt",
    title: "Hannibal",
    author: "Patrick N. Hunt",
    publisher: "Simon & Schuster",
    sourceType: "book",
    publishedYear: 2017,
    publishedDisplay: "2017",
    notes:
      "By the archaeologist who directed Stanford's Alpine Archaeology Project, which surveyed Alpine passes over some two decades looking for ground that matches the ancient descriptions. Cited for the argument that the Col du Clapier best fits Polybius' account of the pass.",
  },
  {
    key: "mahaney",
    title: "Mahaney et al. — the Col de la Traversette mire study (Archaeometry, 2016)",
    author: "William Mahaney and colleagues",
    publisher: "Wiley",
    workTitle: "Archaeometry",
    reference: "Published in Archaeometry in 2016",
    sourceType: "academic_paper",
    publishedYear: 2016,
    publishedDisplay: "2016",
    notes:
      "An interdisciplinary team led by William Mahaney of York University, Toronto, reporting a disturbed layer in a peat mire just below the Col de la Traversette: a churned horizon rich in the gut bacteria of large herbivores, radiocarbon-dated to around 200 BCE. Cited for that measurement and for the inference the team draws from it. The paper's exact title is not reproduced here because it could not be verified from this machine — the work is identified by author, journal and year instead of by a guess.",
  },

  // --- A starting point, named as such --------------------------------------
  {
    key: "wikipedia",
    title: "Second Punic War — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Second_Punic_War",
    sourceType: "wikipedia",
    publishedDisplay: "continuously edited",
    notes:
      "Cited deliberately, and only for one job: it is where the traditional day-dates for Trasimene and Cannae are met by most readers, and it is a fair record of what is commonly repeated. It is a tertiary source — a summary of other people's work that anyone can edit — so it is the place to start and the wrong place to stop. Its own references are better than it is.",
  },
];

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export const HANNIBAL_EVENTS: SeedEvent[] = [
  // 1 -----------------------------------------------------------------------
  {
    slug: "hannibal-birth",
    title: "Birth of Hannibal Barca",
    summary: "A reconstructed date, not a record — no Carthaginian document of his birth survives.",
    description:
      "Hannibal Barca was born into the leading military family of Carthage, the eldest son of Hamilcar Barca, who had commanded Carthaginian forces in the last years of the First Punic War.\n\n" +
      "NOTHING RECORDS HIS BIRTH. There is no Carthaginian register, no inscription, no contemporary notice. Carthage's own written records did not survive the destruction of the city in 146 BCE, and what is known of Carthaginian history comes overwhelmingly through Greek and Roman writers who were the enemy's descendants.\n\n" +
      "So the familiar date — 247 BCE — is arithmetic, not testimony. It is derived from a single statement about how old he was at a moment that can itself only be dated approximately. That is worth seeing clearly at the start of the dataset, because almost every date that follows is built the same way.",
    category: "people",
    subcategory: "Carthage",
    eventType: "historical",
    eventTypeNote: "A date reconstructed from later texts, not taken from a record made at the time.",
    tags: ["hannibal", "carthage", "second-punic-war", "barcid"],
    people: ["Hannibal Barca", "Hamilcar Barca"],
    civilisations: ["Carthage"],
    locationName: "Carthage (near modern Tunis)",
    lat: 36.8528,
    lng: 10.3233,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mommsen_p265.jpg?width=1024",
    media: [
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Mommsen_p265.jpg?width=1024",
        shows: "artefact",
        caption:
          "The marble bust from Capua long called Hannibal, engraved for Mommsen's history. THE IDENTIFICATION IS DOUBTED: the Naples museum catalogue of 1888 marked it with a question mark, and it has been argued to be a Renaissance work rather than an ancient one. Public domain, via Wikimedia Commons.",
        kind: "image",
      },
    ],
    claims: [
      {
        sourceKey: "lancel",
        citations: [
          { sourceKey: "polybius", relation: "supports", note: "The age statement the whole calculation rests on: Hannibal was nine years old when his father was about to leave for Iberia." },
          { sourceKey: "hoyos", relation: "context", note: "A survey of how the Barcid chronology is reconstructed, and how much weight the reconstruction will bear." },
          { sourceKey: "barcid_coins", relation: "context", note: "Contemporary objects from the regime he was born into — and a reminder of what contemporary Carthaginian evidence actually looks like: coins, not records of people." },
        ],
        startYear: bce(247),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "c. 247 BCE",
        datingMethod: "Back-calculated from an age given in a Greek history written about a century later",
        chronology: "conventional",
        evidence:
          "The standard modern date, and every careful account writes it with a 'c.'. The chain is short and entirely visible: Polybius says Hannibal was nine years old when Hamilcar set out for Iberia; that expedition is conventionally placed in 237 BCE; nine years before 237 gives 247 or 246. There is no independent confirmation, because there is no Carthaginian documentary record to confirm it against.",
        notes: "What this does NOT establish: a day, a month, or even a certain year. It establishes roughly when, on the strength of one sentence.",
      },
      {
        sourceKey: "polybius",
        citations: [
          { sourceKey: "livy", relation: "context", note: "Livy carries the same age in his own retelling of the oath, but he is drawing on the same tradition rather than confirming it independently." },
        ],
        startYear: bce(247),
        endYear: bce(246),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "nine years old when Hamilcar crossed to Iberia",
        datingMethod: "The age statement itself, shown as the window it actually implies",
        chronology: "historical",
        evidence:
          "This is what the ancient source says — an age, not a date. Shown as a two-year window because that is what an age in whole years gives you: a boy who is 'nine' has a birthday somewhere in a twelve-month band, and the year of Hamilcar's crossing is itself a modern reconstruction. The single year in the claim above is this window rounded to its more likely end.",
      },
    ],
  },

  // 2 -----------------------------------------------------------------------
  {
    slug: "hannibal-oath-against-rome",
    title: "Hannibal's oath against Rome",
    summary: "A story Hannibal is said to have told about himself, half a century after the moment it describes.",
    description:
      "The most famous scene of Hannibal's childhood: at a sacrifice before his father left for Iberia, Hamilcar is said to have led the nine-year-old boy to the altar, put his hand on the victim, and had him swear never to be a friend to Rome.\n\n" +
      "WHAT THE EVIDENCE ACTUALLY IS. The earliest surviving source is Polybius, and he does not present it as something he learned from a document. He presents it as something HANNIBAL SAID, decades later and far from Carthage — an exile in his fifties at the court of the Seleucid king Antiochus III, needing to convince the king that he could be trusted as an enemy of Rome. The story is told to make a point, by a man with a reason to make it.\n\n" +
      "That does not make it false. It does make it a different kind of thing from an excavation report or an inscription, and the dataset keeps the two apart: there are two dates here, one for the swearing and one for the telling, because only the second is attested by anything.\n\n" +
      "Later writers repeat and polish it. By Livy's day it stands at the opening of the war narrative as an explanation of Hannibal's whole career, and the oath has become the psychological engine of the Second Punic War. That is a literary development, and the record of it is the record of a story spreading.",
    category: "culture",
    subcategory: "Tradition and memory",
    eventType: "traditional_account",
    eventTypeNote:
      "What is attested is the TELLING. The swearing is reported at one remove by a source who says he is repeating what Hannibal told a king.",
    tags: ["hannibal", "carthage", "rome", "tradition", "second-punic-war"],
    people: ["Hannibal Barca", "Hamilcar Barca", "Antiochus III"],
    civilisations: ["Carthage"],
    locationName: "Carthage",
    lat: 36.8528,
    lng: 10.3233,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Benjamin_West_(1738-1820)_-_The_Oath_of_Hannibal_-_RCIN_405417_-_Royal_Collection.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Benjamin_West_(1738-1820)_-_The_Oath_of_Hannibal_-_RCIN_405417_-_Royal_Collection.jpg?width=1024",
        shows: "later_artwork",
        caption:
          "Benjamin West painted this in 1770 \u2014 some two thousand years after the sacrifice it shows, and with " +
          "nothing to work from but the text. It is a record of how the scene has been imagined. Every detail in " +
          "it beyond \u201ca boy, an altar, and his father\u201d is West's invention.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "polybius",
        citations: [
          { sourceKey: "livy", relation: "context", note: "Livy retells the scene at the opening of his war narrative, two centuries later, with the emphasis firmly on Hannibal's hatred of Rome." },
          { sourceKey: "nepos", relation: "context", note: "The story is in Nepos' short Latin life too — by the first century BCE it is a fixed part of the Hannibal that Roman readers expected." },
          { sourceKey: "hoyos", relation: "context", note: "Modern discussion of whether the anecdote can be traced to anything earlier than Hannibal's own account of it, and of what it was doing in the tradition." },
        ],
        startYear: bce(237),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "at the sacrifice before Hamilcar's crossing to Iberia, Hannibal being nine years old",
        datingMethod: "Placed by the occasion the story attaches it to, not by any record of the day",
        chronology: "historical",
        evidence:
          "The scene is dated by the event it is attached to — Hamilcar's departure for Iberia, conventionally 237 BCE. No contemporary record of the sacrifice exists, and none is claimed by the source. What Polybius offers is a report of Hannibal's own words about his own childhood, given about forty-four years after the event described.",
        notes:
          "The chain to weigh: a boy's private oath → recalled by the man himself decades later to persuade a foreign king → written down by a Greek historian who was not present at either moment. Each link is plausible. None of them is a document.",
      },
      {
        sourceKey: "polybius",
        startYear: bce(195),
        endYear: bce(193),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "told by Hannibal at the court of Antiochus III",
        datingMethod: "Dated by the occasion of the TELLING, which is the part the source witnesses to",
        chronology: "historical",
        evidence:
          "The earliest datable moment in the story's life is not the altar but the anecdote: Hannibal in exile at the Seleucid court, conventionally placed in the years after his flight from Carthage around 195 BCE, telling the story to dispel the king's suspicion that he might come to terms with Rome. This is the claim the evidence most directly supports — that in the 190s BCE Hannibal was telling this story about himself.",
        notes:
          "Two dates, two different assertions. 237 BCE is when the oath is said to have been sworn. The 190s is when somebody is known to have said so. A timeline that showed only the first would be hiding the more certain of the two.",
      },
    ],
  },

  // 3 -----------------------------------------------------------------------
  {
    slug: "hannibal-takes-command-in-iberia",
    title: "Hannibal takes command in Iberia",
    summary: "Acclaimed by the army in Iberia after the assassination of his brother-in-law Hasdrubal.",
    description:
      "By the 220s BCE the Barcid family had built something close to a personal dominion in southern and eastern Iberia: silver mines, a new capital at Qart Hadasht (New Carthage, modern Cartagena), treaties with local peoples, and an army loyal to the family that paid it.\n\n" +
      "Hamilcar died in about 229 BCE and was succeeded by his son-in-law Hasdrubal, who was assassinated in 221. The army in Iberia then acclaimed Hannibal, and Carthage confirmed the choice.\n\n" +
      "THE POINT WORTH NOTICING is that this is a fact about an army, not about a state: the succession happened in the field and was ratified afterwards. Much of the modern argument about who was responsible for the war that followed turns on how independent this Iberian command really was of the government at home.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    tags: ["hannibal", "carthage", "iberia", "second-punic-war", "barcid"],
    people: ["Hannibal Barca", "Hasdrubal the Fair", "Hamilcar Barca"],
    civilisations: ["Carthage"],
    locationName: "Qart Hadasht / New Carthage (Cartagena, Spain)",
    lat: 37.6,
    lng: -0.9819,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Carthage%2C_quarter_shekel%2C_237-209_BC%2C_SNG_BM_Spain_102.jpg?width=1024",
    media: [
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Carthage%2C_quarter_shekel%2C_237-209_BC%2C_SNG_BM_Spain_102.jpg?width=1024",
        shows: "artefact",
        caption:
          "Silver quarter shekel struck under Carthaginian rule in Iberia, c. 237–209 BCE: a male head with a club at the shoulder — usually identified as Melqart — and an elephant. Photograph by Classical Numismatic Group, CC BY-SA 2.5, via Wikimedia Commons.",
        kind: "image",
      },
    ],
    claims: [
      {
        sourceKey: "goldsworthy",
        citations: [
          { sourceKey: "polybius", relation: "supports", note: "The narrative of the succession: Hasdrubal assassinated, the army in Iberia acclaiming Hannibal, Carthage ratifying." },
          { sourceKey: "livy", relation: "supports", note: "The same succession, told with a Roman emphasis on the enthusiasm of the soldiers for Hamilcar's son." },
          { sourceKey: "barcid_coins", relation: "context", note: "The coinage of the Barcid regime in Iberia — contemporary physical evidence for the independent power base Hannibal inherited." },
        ],
        startYear: bce(221),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "221 BCE",
        datingMethod: "Modern conversion of the ancient reckoning by consular year and olympiad",
        chronology: "conventional",
        evidence:
          "The mainstream date, agreed across the modern literature and resting on the ancient narratives rather than on any document from Iberia. The ancient writers place the succession by its position in a sequence of events they date by Roman consulships and Greek olympiads; '221 BCE' is the modern conversion of that reckoning.",
      },
      {
        sourceKey: "polybius",
        startYear: bce(221),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "on the assassination of Hasdrubal, the army in Iberia chose Hannibal",
        datingMethod: "Position in the narrative sequence of the Iberian command",
        chronology: "historical",
        evidence:
          "The ancient statement, which fixes the moment by what happened rather than by a number: Hasdrubal is killed, the soldiers choose Hamilcar's son, Carthage agrees. The year is ours; the sequence is theirs.",
        notes:
          "Ancient accounts also give Hannibal's age at this point, and modern summaries repeat different figures for it — a reminder that an age in an ancient text is a soft number, and that the birth date in this dataset is derived from exactly that kind of statement.",
      },
    ],
  },

  // 4 -----------------------------------------------------------------------
  {
    slug: "siege-and-fall-of-saguntum",
    title: "The siege and fall of Saguntum",
    summary: "An eight-month siege of a city allied to Rome — and the act both sides argued about afterwards.",
    description:
      "Saguntum (modern Sagunto, north of Valencia) was a city on the Iberian coast with some form of friendship with Rome. Hannibal besieged and took it; Livy reports that the siege lasted about eight months.\n\n" +
      "WHY IT MATTERS OUT OF ALL PROPORTION TO ITS SIZE. Rome had a treaty with Carthage setting the River Ebro as a limit on Carthaginian expansion. Saguntum lay south of the Ebro — on the Carthaginian side of that line — but claimed Roman friendship. Whether attacking it broke the treaty, and whose fault the resulting war was, is the oldest argument in the historiography of the Second Punic War, and both surviving ancient accounts are already arguing about it.\n\n" +
      "Polybius devotes the opening of his third book to the distinction that argument needs: the CAUSES of a war are not the same as its BEGINNINGS. He explicitly refuses to let Saguntum and the Ebro crossing count as causes; they are where the fighting starts, not why it started. It is one of the earliest surviving pieces of historical method, and it is being applied to this event.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    tags: ["hannibal", "saguntum", "rome", "carthage", "second-punic-war"],
    people: ["Hannibal Barca"],
    civilisations: ["Carthage", "Rome"],
    locationName: "Saguntum (Sagunto, Spain)",
    lat: 39.6766,
    lng: -0.2733,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Castillo04_Sagunto.JPG?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Castillo04_Sagunto.JPG?width=1024",
        shows: "site",
        caption:
          "The ridge above Sagunto, where the Iberian town stood. THE WALLS IN THE PICTURE ARE NOT THE WALLS " +
          "HANNIBAL BESIEGED: the castle is a Roman, Islamic and Spanish accumulation on the same height. What " +
          "the photograph shows honestly is the position \u2014 a hill above a coastal plain, held for eight months.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "goldsworthy",
        citations: [
          { sourceKey: "polybius", relation: "supports", note: "The siege, and the argument that it is a beginning of the war rather than a cause of it." },
          { sourceKey: "livy", relation: "supports", note: "The fullest surviving narrative of the siege, including its length." },
          { sourceKey: "hoyos", relation: "context", note: "Where the modern argument about the Ebro treaty, Saguntum's status and the responsibility for the war currently stands." },
        ],
        startYear: bce(219),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "219 BCE",
        datingMethod: "Modern conversion of the ancient reckoning",
        chronology: "conventional",
        evidence:
          "The standard modern date for the siege. It rests on the ancient narratives and on their place in the Roman consular year, not on anything found at Saguntum.",
      },
      {
        sourceKey: "livy",
        citations: [
          { sourceKey: "polybius", relation: "context", note: "Polybius' narrative of the same siege, and his treatment of it as one of the war's beginnings." },
        ],
        startYear: bce(219),
        endYear: bce(218),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "an eight-month siege",
        datingMethod: "A stated duration, which does not by itself say which months",
        chronology: "historical",
        evidence:
          "Livy gives the siege a length — about eight months — but a duration is not a date. Eight months beginning in 219 can end late in 219 or in the first part of 218 depending on where the siege is started, and reconstructions differ on exactly that. The span is shown here rather than collapsed into a single year, because the collapse is the thing that hides the problem.",
        notes:
          "This is why the war's start date is itself contested further down the dataset: if the fall of Saguntum belongs to 218 rather than 219, the sequence of embassies and declarations that follows has to be squeezed differently.",
      },
    ],
  },

  // 5 -----------------------------------------------------------------------
  {
    slug: "second-punic-war-begins",
    title: "The Second Punic War begins",
    summary: "Three defensible answers to 'when did it start?' — and an ancient historian explaining why the question is hard.",
    description:
      "Rome declared war on Carthage in 218 BCE after an embassy to the Carthaginian senate demanded Hannibal's surrender and was refused. Livy gives the scene its famous staging: the Roman envoy Quintus Fabius gathering a fold of his toga and offering the Carthaginians peace or war in it, and the Carthaginians telling him to drop whichever he liked.\n\n" +
      "BUT A DECLARATION IS NOT ALWAYS THE START. Fighting had already happened at Saguntum. Polybius, writing closest to the events, opens his third book by separating the war's CAUSES from its BEGINNINGS and refusing to accept the fall of Saguntum and the crossing of the Ebro as causes: they are, he says, where the war starts, not why it came about. He puts the causes further back — in Carthaginian resentment after the First Punic War, in the seizure of Sardinia, in the growth of Barcid power in Iberia.\n\n" +
      "So this event carries more than one date on purpose. They are not rival guesses at one fact; they are answers to slightly different questions, and telling them apart is most of what historical thinking is.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    eventTypeNote: "The dates below answer different questions — declaration, first fighting, first breach — rather than competing over one.",
    tags: ["hannibal", "rome", "carthage", "second-punic-war", "historiography"],
    people: ["Hannibal Barca", "Quintus Fabius Maximus"],
    civilisations: ["Carthage", "Rome"],
    locationName: "Carthage and Rome",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mediterranean_at_218_BC-en.svg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Mediterranean_at_218_BC-en.svg?width=1024",
        shows: "map",
        caption:
          "The Mediterranean as drawn for 218 BCE, with the two powers shaded. Shading makes a border look " +
          "settled, and the declaration of war turned on exactly the thing shading cannot show: whether Saguntum " +
          "lay inside an agreed line at all, and whether such a line had ever been agreed.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "goldsworthy",
        citations: [
          { sourceKey: "livy", relation: "supports", note: "The Roman embassy to Carthage and the declaration of war, including the scene with the toga." },
          { sourceKey: "polybius", relation: "context", note: "The same sequence of embassies, with far less drama and far more analysis of what each side was arguing." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "218 BCE",
        datingMethod: "Modern conversion; the ancient reckoning is by the consulship of Publius Cornelius Scipio and Tiberius Sempronius Longus",
        chronology: "conventional",
        evidence:
          "The conventional date, and the one a modern reader will meet everywhere. It dates the war from Rome's formal declaration after the refusal at Carthage.",
      },
      {
        sourceKey: "polybius",
        citations: [
          { sourceKey: "hoyos", relation: "context", note: "Modern discussion of Polybius' causes-and-beginnings distinction and of how well his own narrative keeps to it." },
        ],
        startYear: bce(219),
        endYear: bce(218),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "with the siege of Saguntum and the crossing of the Ebro",
        datingMethod: "An explicit ancient argument about what counts as the beginning of a war",
        chronology: "historical",
        evidence:
          "Polybius names the siege of Saguntum and the crossing of the Ebro as the BEGINNINGS of the war and argues, against other historians, that they must not be called its causes. On his own account the war is already under way before the declaration — which is why this claim spans 219 into 218.",
        notes:
          "This is the oldest surviving piece of reasoning in the dataset about how to date an event, and it is doing exactly what this timeline exists to make visible: the same event, two defensible dates, because two different questions are being answered.",
      },
      {
        sourceKey: "livy",
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "in the consulship of Publius Cornelius Scipio and Tiberius Sempronius Longus",
        datingMethod: "Roman consular dating — the year named by its magistrates",
        chronology: "historical",
        evidence:
          "How a Roman actually dated this year. Rome had no era count: a year was 'the consulship of so-and-so', and the lists of consuls are how modern historians convert Roman years into BCE at all. Shown as its own claim because the conversion is a modern operation performed on an ancient record, and readers rarely see that it happened.",
      },
    ],
  },

  // 6 -----------------------------------------------------------------------
  {
    slug: "hannibal-crosses-the-pyrenees",
    title: "Hannibal crosses the Pyrenees",
    summary: "The march out of Iberia — and the first large losses, before a single Roman had been met.",
    description:
      "In the summer of 218 BCE Hannibal moved his army north from New Carthage, fought his way through the peoples between the Ebro and the Pyrenees, left a force behind to hold the new territory, and crossed the mountains into Gaul.\n\n" +
      "Polybius gives running totals at the stages of the march, and they fall steeply: garrisons detached, troops sent home, men lost in fighting. The army that eventually reached Italy was a fraction of the one that left Iberia, and most of the loss happened before the Alps.\n\n" +
      "There is no archaeology for any of this. The crossing is known from narrative alone, and its date comes from the narrative's position in a year that was itself named after two Roman consuls.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    tags: ["hannibal", "pyrenees", "second-punic-war", "march-to-italy"],
    people: ["Hannibal Barca"],
    civilisations: ["Carthage"],
    locationName: "The Pyrenees, between Iberia and Gaul",
    claims: [
      {
        sourceKey: "lancel",
        citations: [
          { sourceKey: "polybius", relation: "supports", note: "The march from New Carthage, the detachments left behind, and the running totals of the army at each stage." },
          { sourceKey: "livy", relation: "supports", note: "The same march, with more on the negotiations and resistance among the peoples of the Pyrenean foothills." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "summer 218 BCE",
        datingMethod: "Modern reconstruction from the narrative sequence and the season implied by it",
        chronology: "conventional",
        evidence:
          "Dated by where it falls in a march whose end — the Alpine crossing in late autumn — is fixed by an astronomical marker in the ancient account. Working backwards from that, and from the time the stages take, puts the Pyrenees in the summer.",
      },
      {
        sourceKey: "polybius",
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "part of a march from New Carthage to Italy that took five months in all",
        datingMethod: "A stated total duration for the whole march, into which the stages have to fit",
        chronology: "historical",
        evidence:
          "Polybius states that the whole march from New Carthage occupied five months, with fifteen days spent crossing the Alps. That total is the frame every reconstruction of the individual stages has to fit inside — including this one, which is dated by subtraction rather than by any statement about the Pyrenees themselves.",
      },
    ],
  },

  // 7 -----------------------------------------------------------------------
  {
    slug: "hannibal-crosses-the-rhone",
    title: "Hannibal crosses the Rhône",
    summary: "Elephants ferried over on rafts, a Gallic army on the far bank, and a Roman consul who arrived too late.",
    description:
      "Somewhere on the lower Rhône, Hannibal's army crossed a wide river in the face of hostile Gauls on the opposite bank. Polybius describes boats and rafts collected from the locals, a detachment sent upstream to cross secretly and take the defenders from behind, and the elephants brought over on rafts covered with earth so that they would take them for solid ground.\n\n" +
      "The Roman consul Publius Cornelius Scipio had landed near Massalia (Marseille) intending to fight Hannibal in Gaul, and sent a cavalry force which met Hannibal's scouts. By the time the main Roman force reached the crossing, Hannibal had gone. Scipio sent his army on to Iberia and returned to Italy himself — a decision that shaped the rest of the war.\n\n" +
      "WHERE the crossing happened is not known. Several stretches of the lower Rhône have been argued for, and the dataset gives no coordinates for a place the evidence does not fix.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    tags: ["hannibal", "rhone", "elephants", "second-punic-war", "march-to-italy"],
    people: ["Hannibal Barca", "Publius Cornelius Scipio"],
    civilisations: ["Carthage", "Rome"],
    locationName: "The lower Rhône, southern Gaul",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hannibal_traverse_le_Rh%C3%B4ne_Henri_Motte_1878.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Hannibal_traverse_le_Rh%C3%B4ne_Henri_Motte_1878.jpg?width=1024",
        shows: "later_artwork",
        caption:
          "Henri-Paul Motte showed this at the Salon of 1878: elephants ferried over the Rh\u00f4ne on rafts covered " +
          "with earth. The rafts and the earth are in Polybius. The dress, the faces, the rearing panic and the " +
          "crowd are nineteenth-century French history painting.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "goldsworthy",
        citations: [
          { sourceKey: "polybius", relation: "supports", note: "The rafts, the flanking detachment, the elephants taken across on earth-covered rafts, and the brush with Scipio's cavalry." },
          { sourceKey: "livy", relation: "supports", note: "The same crossing, with additional detail and rather more colour about the elephants." },
          { sourceKey: "cincius", relation: "context", note: "The one figure in the record that claims to come from Hannibal himself: he told his Roman prisoner that he lost 36,000 men after crossing the Rhône." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "218 BCE, before the Alpine crossing",
        datingMethod: "Modern reconstruction from the narrative sequence",
        chronology: "conventional",
        evidence:
          "Dated by its position between the Pyrenees and the Alps within the five-month march, and by the movements of Scipio's fleet, which the Roman sources date to the consular year.",
      },
      {
        sourceKey: "cincius",
        citations: [
          { sourceKey: "livy", relation: "supports", note: "Livy quotes the statement and says he would give it more weight than the alternatives if it could be relied on." },
          { sourceKey: "lazenby", relation: "context", note: "Modern assessment of the ancient figures for Hannibal's losses on the march, and of how far any of them can be trusted." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "after crossing the Rhône he lost thirty-six thousand men",
        datingMethod: "A statement attributed to Hannibal, reported by a prisoner, quoted two centuries later",
        chronology: "historical",
        evidence:
          "Lucius Cincius Alimentus, a Roman senator and annalist, says he was captured by Hannibal and that Hannibal told him he lost 36,000 men after crossing the Rhône. His history is lost; the sentence survives only because Livy quoted it. It is the closest this dataset comes to Hannibal's own testimony about his own campaign — and it comes through a prisoner's memory and another writer's quotation.",
        notes:
          "Worth holding next to the Lacinian inscription further down the dataset. Both are Hannibal's own numbers; both reach us only because someone else wrote them down; and they are not easy to reconcile with each other, which is itself a fact about the evidence.",
      },
    ],
  },

  // 8 -----------------------------------------------------------------------
  {
    slug: "hannibal-crosses-the-alps",
    title: "Hannibal crosses the Alps",
    summary: "That he crossed is not in doubt. Which pass he used has been argued about for two thousand years.",
    description:
      "In late 218 BCE Hannibal took an army with cavalry and elephants over the Alps and came down into the plain of the Po. Polybius says the passage of the pass itself took fifteen days, at the end of a march from New Carthage that had taken five months, and that he reached the plains with 12,000 Libyan and 8,000 Iberian infantry and not more than 6,000 cavalry — figures he says he took from Hannibal's own inscription in Italy.\n\n" +
      "THE CONSENSUS AND THE DISPUTE ARE DIFFERENT THINGS, and this entry keeps them apart.\n\n" +
      "The consensus: Hannibal crossed the Alps with an army in 218 BCE, losing very heavily to weather, terrain and hostile mountain peoples. No serious historian disputes this. Two independent ancient narratives describe it, a Roman prisoner reports Hannibal's own account of the losses, and the campaign that follows in Italy is not explicable any other way.\n\n" +
      "The dispute: WHICH PASS. Polybius and Livy describe the route in terms that have never been matched to the ground with certainty — a place where the army was blocked by fallen rock, a point from which Hannibal is said to have shown his men the plains of Italy below. Candidate passes include the Col de la Traversette, the Col du Clapier, the Col de Montgenèvre, the Col du Mont Cenis and the Little St Bernard. No Punic weapons, coins or burials have been recovered from any of them.\n\n" +
      "AND THE LEGEND IS A THIRD THING AGAIN. Livy has the army split a rock face by heating it with fire and pouring vinegar on it. Polybius, the earlier and more careful source, describes the blocked path and the road-building but has no vinegar. Elephants crossing snowy passes, the crowd of later paintings, and the vinegar are all part of the story's afterlife rather than part of its evidence.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    eventTypeNote:
      "The crossing is established. The route is genuinely contested, and the claims below are labelled accordingly rather than being blended into one.",
    tags: ["hannibal", "alps", "elephants", "second-punic-war", "disputed-route", "march-to-italy"],
    people: ["Hannibal Barca"],
    civilisations: ["Carthage"],
    locationName: "The western Alps — the pass is disputed",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Joseph_Mallord_William_Turner_-_Snow_Storm%2C_Hannibal_and_his_Army_Crossing_the_Alps_-_WGA23167.jpg?width=1024",
    media: [
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Joseph_Mallord_William_Turner_-_Snow_Storm%2C_Hannibal_and_his_Army_Crossing_the_Alps_-_WGA23167.jpg?width=1024",
        shows: "later_artwork",
        caption:
          "J. M. W. Turner, 'Snow Storm: Hannibal and his Army Crossing the Alps', 1812, Tate. A Romantic painting of a storm, made two thousand years after the event and evidence for nothing about the route. Public domain, via Wikimedia Commons.",
        kind: "image",
      },
    ],
    claims: [
      {
        sourceKey: "lancel",
        citations: [
          { sourceKey: "polybius", relation: "supports", note: "Fifteen days in the pass; five months for the whole march; the numbers that came down into Italy, attributed to Hannibal's own inscription." },
          { sourceKey: "livy", relation: "supports", note: "An independent surviving narrative of the same crossing, fuller and more dramatic, and not always reconcilable with Polybius on the route." },
          { sourceKey: "cincius", relation: "supports", note: "Hannibal's own figure for his losses on the march, reported by a Roman he had captured." },
          { sourceKey: "hoyos", relation: "context", note: "A survey of the state of the question — what is agreed, what is argued, and what the evidence could ever settle." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "218 BCE",
        datingMethod: "Modern conversion of the ancient reckoning, anchored by an astronomical marker in the ancient account",
        chronology: "conventional",
        evidence:
          "THE MAINSTREAM POSITION: Hannibal crossed the Alps in 218 BCE. The year is fixed by the consular year of the campaign and by the sequence of battles that follows in Italy within the same and the following year; the season is fixed by the ancient account, which places the crossing near the setting of the Pleiades — an astronomical marker corresponding to late autumn — and describes snow already lying on the pass.",
        notes: "This claim is about WHEN and WHETHER. It says nothing about which pass, because the mainstream position says nothing about which pass.",
      },
      {
        sourceKey: "polybius",
        citations: [
          { sourceKey: "lacinium", relation: "supports", note: "The inscription Polybius says he consulted for the numbers that came down into Italy." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "fifteen days in the pass, at the end of a five-month march",
        datingMethod: "Durations and an astronomical marker given in the earliest surviving account",
        chronology: "historical",
        evidence:
          "What the earliest surviving source actually asserts: a fifteen-day passage of the pass, a five-month march from New Carthage, and an army arriving in the plains reduced to 12,000 Libyans, 8,000 Iberians and no more than 6,000 cavalry — numbers Polybius attributes to Hannibal's own inscription rather than to hearsay. Polybius also says he went and looked at the ground himself.",
      },
      {
        sourceKey: "mahaney",
        citations: [
          { sourceKey: "hunt", relation: "disputes", note: "Argues for a different pass, the Col du Clapier, on the grounds that its topography fits the ancient descriptions better." },
          { sourceKey: "hoyos", relation: "context", note: "The wider scholarly frame in which any route proposal has to be assessed." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "by the Col de la Traversette",
        datingMethod: "Radiocarbon and microbial analysis of a disturbed layer in an Alpine mire",
        chronology: "scientific",
        evidence:
          "A team led by William Mahaney reported a churned layer in a peat mire just below the Col de la Traversette, rich in the gut bacteria of large herbivores and radiocarbon-dated to around 200 BCE. The inference is that a very large number of animals were held or driven through that spot at about the right time.",
        notes:
          "WHAT IT DOES NOT ESTABLISH: that the animals were Hannibal's. The layer dates a mass of animal traffic, not an identity — there are no artefacts, no weapons and no coins in it. It is a genuine piece of physical evidence bearing on a question that previously had none, and it is also exactly as far as that evidence reaches.",
      },
      {
        sourceKey: "hunt",
        citations: [
          { sourceKey: "polybius", relation: "supports", note: "The description of the pass that route arguments are matched against — including the view of the plains said to have been shown to the army." },
          { sourceKey: "mahaney", relation: "disputes", note: "Reports physical evidence from a different pass entirely." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "by the Col du Clapier",
        datingMethod: "Topographical matching of the ancient descriptions against surveyed passes",
        chronology: "disputed",
        evidence:
          "Two decades of Alpine survey work comparing candidate passes with the ancient route descriptions, arguing that the Col du Clapier fits Polybius' account — including the difficult descent and the vantage point over Italy — better than the alternatives.",
        notes:
          "Topographical argument is the oldest method used on this problem and remains the main one, because the physical record is so nearly empty. Its weakness is that the ancient descriptions were not written to be used as maps.",
      },
      {
        sourceKey: "livy",
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "the rock face split with fire and vinegar",
        datingMethod: "A narrative detail in a source written about two centuries later",
        chronology: "traditional",
        evidence:
          "Livy describes the army clearing a blocked path by heating the rock with fires and pouring vinegar on it to break it up. It is the single most repeated detail of the crossing.",
        notes:
          "IT IS NOT IN POLYBIUS, who is the earlier source, who describes the same blockage and the road-building that cleared it, and who is generally the more careful of the two. Kept here as a claim rather than deleted, because 'a famous detail that appears only in the later account' is something a reader should be able to see happening — it is how legend accumulates on top of an event that really occurred.",
      },
    ],
  },

  // 9 -----------------------------------------------------------------------
  {
    slug: "hannibals-elephants",
    title: "Hannibal's elephants",
    summary: "Thirty-seven set out. What the sources say about them is much less than what the pictures show.",
    description:
      "The elephants are the most famous thing about Hannibal and among the least well evidenced. Here is what the ancient sources actually give:\n\n" +
      "· A NUMBER. Thirty-seven elephants on the march.\n" +
      "· A RIVER CROSSING. Polybius describes them ferried over the Rhône on rafts covered with earth, some panicking in the water.\n" +
      "· A BATTLE. They were used at the Trebia, in the winter of 218.\n" +
      "· AN END. After that winter the elephants died, and the accounts have only a single animal left alive for the campaign into Etruria in the spring of 217.\n" +
      "· A NAME, at one remove. Pliny preserves a line from Cato's lost Origines calling an elephant 'Surus' the best of the Carthaginian elephants, and noting it had lost a tusk.\n\n" +
      "WHAT THE SOURCES DO NOT GIVE: elephants trampling legions, elephants as a decisive weapon, or a sure identification of Surus with the last survivor — that link is a modern inference from two separate statements, not something Cato or Pliny says. The armoured elephant of later painting and popular retelling is an image built long afterwards on a handful of sentences.\n\n" +
      "There is no direct archaeology of Hannibal's elephants on the route. The animals are attested in text and in the elephants that appear on Barcid coins struck in Iberia — which show that the elephant was part of how this regime pictured itself, and no more than that.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    eventTypeNote: "An unusually clear case of a well-known image resting on a small number of ancient sentences.",
    tags: ["hannibal", "elephants", "second-punic-war", "evidence"],
    people: ["Hannibal Barca", "Cato the Elder"],
    civilisations: ["Carthage"],
    locationName: "From Iberia to northern Italy",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Heinrich_Leutemann_-_Hannibals_%C3%9Cbergang_%C3%BCber_die_Alpen_%28cropped%29.jpg?width=1024",
    media: [
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Heinrich_Leutemann_-_Hannibals_%C3%9Cbergang_%C3%BCber_die_Alpen_%28cropped%29.jpg?width=1024",
        shows: "later_artwork",
        caption:
          "Heinrich Leutemann, 'Hannibals Übergang über die Alpen', woodcut, 1866. This is where the popular image of elephants in the snow comes from — a 19th-century illustration, not a record. Public domain, via Wikimedia Commons.",
        kind: "image",
      },
    ],
    claims: [
      {
        sourceKey: "polybius",
        citations: [
          { sourceKey: "livy", relation: "supports", note: "The same number and the same river crossing, told with more incident." },
          { sourceKey: "barcid_coins", relation: "context", note: "Elephants on the reverse of Barcid coinage — contemporary evidence that the elephant was part of the regime's self-image, not evidence of any particular campaign." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "thirty-seven elephants on the march",
        datingMethod: "A figure in the earliest surviving narrative of the march",
        chronology: "historical",
        evidence:
          "The number the ancient accounts give for the elephants that set out with the army, and the point at which they are described in most detail — the ferrying of the animals across the Rhône on rafts covered with earth so that they would step onto them.",
      },
      {
        sourceKey: "polybius",
        citations: [
          { sourceKey: "livy", relation: "context", note: "Livy's account of the march through the flooded ground of Etruria in 217, in which the surviving animal appears." },
        ],
        startYear: bce(218),
        endYear: bce(217),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "after the winter, one elephant left alive",
        datingMethod: "Narrative sequence across the winter of 218–217",
        chronology: "historical",
        evidence:
          "The elephants were used at the Trebia in the winter of 218, and the accounts of the campaign that follows in the spring of 217 have only one animal still alive. The war Hannibal actually fought in Italy — fifteen years of it — was fought without elephants.",
        notes:
          "The span is 218 into 217 because the deaths are described as a process over a winter, not an event on a day. Shown as a range for that reason.",
      },
      {
        sourceKey: "pliny",
        citations: [
          { sourceKey: "polybius", relation: "context", note: "The narrative in which a single surviving elephant appears — the statement that the modern identification of Surus is joined to." },
        ],
        startYear: bce(218),
        endYear: bce(217),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "'Surus', the best of the Carthaginian elephants, having lost a tusk",
        datingMethod: "A quotation from a near-contemporary Roman work, preserved in an encyclopedia of the first century CE",
        chronology: "historical",
        evidence:
          "Pliny quotes Cato the Elder's lost Origines for the name and the broken tusk. Cato was born during the war, which puts the underlying testimony close to the events — but it reaches us at two removes, through a work that survives and a work that does not.",
        notes:
          "THE INFERENCE TO BE CAREFUL WITH: Surus is widely described as the one elephant that survived the crossing and the animal Hannibal rode. Neither Cato nor Pliny says that. It is a modern joining of two separate statements — a named best elephant in one source, a single surviving elephant in another — and it may well be right, but it is a reconstruction and is marked as one here.",
      },
    ],
  },

  // 10 ----------------------------------------------------------------------
  {
    slug: "battle-of-the-ticinus",
    title: "Battle of the Ticinus",
    summary: "A cavalry action, not a battle line — and the first meeting between Hannibal and a Roman army in Italy.",
    description:
      "Shortly after coming down from the Alps, Hannibal's cavalry met a Roman force under the consul Publius Cornelius Scipio near the River Ticinus, west of modern Pavia. It was a reconnaissance action fought by horsemen rather than a pitched battle of legions, and the Romans had the worse of it. Scipio was wounded and withdrew east across the Po.\n\n" +
      "The engagement matters for two reasons. It gave Hannibal an immediate reputation among the Gallic peoples of the plain, whose support he needed and largely got. And it is where the ancient tradition places the rescue of the wounded consul by his teenage son — the future Scipio Africanus, the man who would eventually defeat Hannibal at Zama. That is a good story attached to the right person, which is precisely the kind of story to hold at arm's length.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    tags: ["hannibal", "rome", "battle", "second-punic-war"],
    people: ["Hannibal Barca", "Publius Cornelius Scipio", "Scipio Africanus"],
    civilisations: ["Carthage", "Rome"],
    locationName: "Near the River Ticinus, northern Italy",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Le_combat_du_Tessin_(Tapisserie,_Louvre,_OA_6067).jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Le_combat_du_Tessin_(Tapisserie,_Louvre,_OA_6067).jpg?width=1024",
        shows: "later_artwork",
        caption:
          "The fight at the Ticinus woven on a tapestry now in the Louvre, roughly seventeen centuries after the " +
          "cavalry action it depicts, in the armour of the weaver's own day. It records that the battle stayed " +
          "worth picturing \u2014 nothing about how it looked.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "goldsworthy",
        citations: [
          { sourceKey: "polybius", relation: "supports", note: "The cavalry engagement, the consul's wound, and the withdrawal across the Po." },
          { sourceKey: "livy", relation: "supports", note: "The same action, with the rescue of the consul given more prominence." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "218 BCE",
        datingMethod: "Modern conversion of the consular year, fixed by the sequence of the campaign",
        chronology: "conventional",
        evidence:
          "Dated by its place between the descent from the Alps in late autumn 218 and the battle of the Trebia, which the same sources put shortly afterwards in the same year.",
      },
      {
        sourceKey: "livy",
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "the wounded consul saved by his son",
        datingMethod: "A narrative episode within the account of the engagement",
        chronology: "traditional",
        evidence:
          "The tradition that the consul was rescued by his young son, later Scipio Africanus. It appears in the ancient accounts of this action and is one of the best-known scenes of the war's opening.",
        notes:
          "Kept as a separate claim because it is a different kind of statement from 'a cavalry action was fought here in 218'. Stories that explain a great man's future by an episode in his youth are exactly the material that accumulates around famous careers — the oath at the start of this dataset is the Carthaginian version of the same phenomenon.",
      },
    ],
  },

  // 11 ----------------------------------------------------------------------
  {
    slug: "battle-of-the-trebia",
    title: "Battle of the Trebia",
    summary: "Hannibal's first full victory in Italy, won before the fighting started.",
    description:
      "In the winter of 218 BCE, on the plain by the River Trebia near modern Piacenza, Hannibal destroyed a Roman army under the consul Tiberius Sempronius Longus.\n\n" +
      "The ancient accounts describe a battle decided by preparation rather than by the clash: Hannibal's brother Mago concealed with a force in a watercourse to fall on the Roman rear; a skirmish designed to provoke the Romans into crossing the freezing river before they had eaten; Roman soldiers arriving on the far bank wet, cold and hungry. The elephants were used here. The Roman centre broke through and escaped; the rest of the army did not.\n\n" +
      "It is the first of three catastrophes in under two years, and the first to show the pattern: Hannibal chose the ground and the moment, and a Roman commander with a numerical advantage accepted battle on both.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    tags: ["hannibal", "rome", "battle", "elephants", "second-punic-war"],
    people: ["Hannibal Barca", "Tiberius Sempronius Longus", "Mago Barca"],
    civilisations: ["Carthage", "Rome"],
    locationName: "The River Trebia, near Placentia (Piacenza), Italy",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Battle_Trebia-en.svg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Battle_Trebia-en.svg?width=1024",
        shows: "map",
        caption:
          "A United States Military Academy teaching map of the Trebia. Arrows turn a reconstruction into a " +
          "diagram: the ambush position, the numbers on each side and even which bank the Romans crossed to are " +
          "all argued over, and none of that argument survives being drawn as a line.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "goldsworthy",
        citations: [
          { sourceKey: "polybius", relation: "supports", note: "The ambush, the provoked river crossing and the condition of the Roman troops when they reached the far bank." },
          { sourceKey: "livy", relation: "supports", note: "The same battle, with more attention to the consul's eagerness for a victory before his year of office ended." },
          { sourceKey: "lazenby", relation: "context", note: "Modern analysis of the tactics and of the numbers on each side." },
        ],
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "winter 218 BCE",
        datingMethod: "Modern conversion of the consular year, with the season taken from the narrative",
        chronology: "conventional",
        evidence:
          "Placed in the last part of 218 BCE by both surviving narratives, and tied to the end of Sempronius Longus' consular year. The season is not in doubt — the cold river and the snow are central to how the battle was won.",
      },
      {
        sourceKey: "polybius",
        startYear: bce(218),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "in the consulship of Scipio and Sempronius Longus, at the turn of winter",
        datingMethod: "Roman consular year plus a season, which is how ancient narrative dates a battle",
        chronology: "historical",
        evidence:
          "No ancient source gives this battle a calendar date. It is placed by the consular year and by the weather, and the modern 'December 218 BCE' sometimes printed for it is an inference from the narrative rather than a date anyone recorded.",
      },
    ],
  },

  // 12 ----------------------------------------------------------------------
  {
    slug: "battle-of-lake-trasimene",
    title: "Battle of Lake Trasimene",
    summary: "An army marched into a defile in morning mist and was destroyed against the water.",
    description:
      "In 217 BCE Hannibal moved south through the marshes of the Arno — the march in which the last elephant appears — and drew the consul Gaius Flaminius after him. On the north shore of Lake Trasimene, between the hills and the water, he laid an ambush along the line of march.\n\n" +
      "The Roman column entered the defile in mist and was attacked along its whole length at once. There was no room to deploy. Flaminius was killed; the army was destroyed or driven into the lake.\n\n" +
      "It is one of the largest ambushes in recorded military history and a rare case of a whole consular army being lost before it could form a line of battle. In Rome the news produced a dictatorship — Quintus Fabius Maximus, whose refusal to meet Hannibal in open battle gave the word 'Fabian' to the language.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    tags: ["hannibal", "rome", "battle", "ambush", "second-punic-war"],
    people: ["Hannibal Barca", "Gaius Flaminius", "Quintus Fabius Maximus"],
    civilisations: ["Carthage", "Rome"],
    locationName: "The northern shore of Lake Trasimene, Italy",
    lat: 43.1667,
    lng: 12.1,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Battle_of_Lake_Trasimene,_217_BC.svg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Battle_of_Lake_Trasimene,_217_BC.svg?width=1024",
        shows: "map",
        caption:
          "The ambush as a West Point teaching map \u2014 Hannibal along the high ground, the Roman column strung out " +
          "on the lake road. THE SHORELINE IS THE MODERN ONE. Trasimene stood higher in 217 BCE, so part of the " +
          "ground the fighting happened on is now under water and part of the water shown here was then dry.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Trasimene_battlefield.JPG?width=1024",
        shows: "site",
        caption:
          "The ground north of Lake Trasimene today. Nothing in the landscape marks the battle, and nothing in it " +
          "contradicts the accounts either \u2014 which is the ordinary condition of a battlefield that has never been " +
          "excavated.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "goldsworthy",
        citations: [
          { sourceKey: "polybius", relation: "supports", note: "The ambush, the mist, and the destruction of the column before it could deploy." },
          { sourceKey: "livy", relation: "supports", note: "The same battle, with the portents and the character of Flaminius given the weight Roman historiography expected." },
        ],
        startYear: bce(217),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "217 BCE",
        datingMethod: "Modern conversion; the ancient reckoning is the consulship of Gaius Flaminius and Gnaeus Servilius Geminus",
        chronology: "conventional",
        evidence:
          "Fixed by the consular year — Flaminius was consul when he was killed — and by the sequence of the campaign from the Trebia to the dictatorship of Fabius. The year is not in question.",
      },
      {
        sourceKey: "wikipedia",
        citations: [
          { sourceKey: "hoyos", relation: "context", note: "On the difficulty of converting Roman dates from these years into the Julian calendar at all." },
        ],
        startYear: bce(217),
        startMonth: 6,
        startDay: 21,
        datePrecision: "day",
        isApproximate: true,
        originalDateText: "21 June 217 BCE",
        datingMethod: "A traditional day-date, repeated across modern reference works",
        chronology: "traditional",
        evidence:
          "The day a reader will meet in almost every encyclopedia and popular account. It is included because it is what is commonly stated, and it is kept as a SEPARATE claim from the year because it is not the same kind of statement.",
        notes:
          "WHY IT IS NOT SIMPLY THE DATE. The Roman calendar of 217 BCE was kept in step with the seasons by inserting an extra month when the priests decided to, and during the war that was done irregularly. A Roman date from these years therefore cannot be converted into a modern one with confidence, and a day-date printed without that caveat claims a precision the evidence does not have.",
      },
    ],
  },

  // 13 ----------------------------------------------------------------------
  {
    slug: "battle-of-cannae",
    title: "Battle of Cannae",
    summary: "The double envelopment — and two ancient casualty figures that do not agree.",
    description:
      "In 216 BCE, on the plain of the Aufidus in Apulia, Hannibal met the largest army Rome had ever put in the field and destroyed it in a single day.\n\n" +
      "The manoeuvre is the most studied in ancient warfare: a deliberately weak centre that gave ground as the Roman infantry pushed into it, wings that held, and cavalry that broke the Roman horse and came round behind. The Roman army — deeper and heavier than the frontage allowed it to use — was surrounded and killed where it stood.\n\n" +
      "HOW MANY DIED IS NOT A SETTLED FACT, and this entry does not pretend otherwise. Polybius gives about 70,000 Roman dead, 10,000 captured and very few escaping. Livy gives 45,500 infantry and 2,700 cavalry killed — about 48,200 — with different figures again for prisoners. Both are set out below as separate claims, because they are separate claims. Modern military historians note that Polybius' count of survivors leaves out garrisons and prisoners that his own narrative implies, and that ancient casualty figures are generally inflated — while also noting that Cannae is the battle where even sceptical scholars accept losses of an extraordinary order, because the shape of the defeat makes them credible.\n\n" +
      "The consequence is not in dispute: allies across southern Italy went over to Hannibal, and Rome did not offer another pitched battle for years.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    eventTypeNote:
      "The battle is established; the numbers are not. The disagreement between the ancient sources is shown as disagreement rather than resolved by picking one.",
    tags: ["hannibal", "rome", "battle", "cannae", "second-punic-war", "casualty-figures"],
    people: ["Hannibal Barca", "Lucius Aemilius Paullus", "Gaius Terentius Varro"],
    civilisations: ["Carthage", "Rome"],
    locationName: "Cannae, Apulia, Italy",
    lat: 41.3062,
    lng: 16.1327,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Battle_cannae_destruction.png?width=1024",
    media: [
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Battle_cannae_destruction.png?width=1024",
        shows: "reconstruction",
        caption:
          "The double envelopment at Cannae, from a teaching map by the Department of History, United States Military Academy. A modern reconstruction of the manoeuvre, drawn from the ancient narratives. Public domain, via Wikimedia Commons.",
        kind: "image",
      },
    ],
    claims: [
      {
        sourceKey: "goldsworthy",
        citations: [
          { sourceKey: "polybius", relation: "supports", note: "The fullest early account of the deployment and the envelopment." },
          { sourceKey: "livy", relation: "supports", note: "An independent surviving narrative, with the Roman political aftermath." },
          { sourceKey: "lazenby", relation: "context", note: "Modern reconstruction of the battle and assessment of what the ancient figures can support." },
        ],
        startYear: bce(216),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "216 BCE",
        datingMethod: "Modern conversion; the ancient reckoning is the consulship of Lucius Aemilius Paullus and Gaius Terentius Varro",
        chronology: "conventional",
        evidence:
          "The year is fixed by the consuls who commanded — one of whom was killed in the battle — and by the sequence of events in both surviving narratives.",
      },
      {
        sourceKey: "wikipedia",
        startYear: bce(216),
        startMonth: 8,
        startDay: 2,
        datePrecision: "day",
        isApproximate: true,
        originalDateText: "2 August 216 BCE",
        datingMethod: "A traditional day-date, repeated across modern reference works",
        chronology: "traditional",
        evidence:
          "The day given in most modern accounts of the battle. Shown separately from the year for the same reason as Trasimene: the Roman calendar of these years was not reliably in step with the seasons, so a Roman day converted to a modern one carries an uncertainty that the printed date hides.",
      },
      {
        sourceKey: "polybius",
        citations: [
          { sourceKey: "lazenby", relation: "context", note: "Notes that Polybius' figure for survivors omits the camp garrisons and prisoners his own narrative implies, so his totals do not balance." },
          { sourceKey: "livy", relation: "disputes", note: "Gives substantially lower figures for the Roman dead." },
        ],
        startYear: bce(216),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "about 70,000 Roman dead, 10,000 taken prisoner",
        datingMethod: "Casualty figures in the earliest surviving account",
        chronology: "historical",
        evidence:
          "The figures given by the earlier of the two surviving historians, writing about two generations after the battle with access to people who remembered the war and to Roman records.",
        notes:
          "Shown as its own claim, not merged with Livy's. Averaging two ancient figures produces a number no source states and nobody can check.",
      },
      {
        sourceKey: "livy",
        citations: [
          { sourceKey: "polybius", relation: "disputes", note: "Gives a much higher figure for the Roman dead." },
          { sourceKey: "lazenby", relation: "context", note: "Modern discussion of how the different ancient totals were arrived at and which parts of them are internally consistent." },
        ],
        startYear: bce(216),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "45,500 infantry and 2,700 cavalry killed",
        datingMethod: "Casualty figures in the later surviving account, drawn from Roman annalists now lost",
        chronology: "historical",
        evidence:
          "Livy's totals, about 48,200 dead in all — appreciably lower than Polybius'. Livy was working from Roman annalistic sources that no longer survive, so the difference is not simply carelessness: it is a different tradition of counting, and the sources it came from cannot be consulted.",
      },
      {
        sourceKey: "lazenby",
        citations: [
          { sourceKey: "polybius", relation: "context", note: "The higher ancient total." },
          { sourceKey: "livy", relation: "context", note: "The lower ancient total." },
          { sourceKey: "hoyos", relation: "context", note: "Where the modern discussion of ancient battle numbers currently stands." },
        ],
        startYear: bce(216),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "the ancient totals do not reconcile, and neither is simply the answer",
        datingMethod: "Modern critical assessment of the ancient figures",
        chronology: "disputed",
        evidence:
          "Modern military history treats ancient casualty figures with suspicion as a matter of course, and these two do not reconcile. Polybius' survivor count omits forces his own narrative accounts for; Livy's figures come from lost annalists with their own tendencies. What is agreed is that the losses were extraordinary even by the standards of ancient battle, because a double envelopment produces exactly that kind of casualty list.",
        notes:
          "This claim is marked as contested rather than mainstream on purpose. The mainstream claim on this event is the DATE. How many died is a live scholarly question, and the dataset says so instead of quietly choosing.",
      },
    ],
  },

  // 14 ----------------------------------------------------------------------
  {
    slug: "hannibal-marches-on-rome",
    title: "Hannibal marches on Rome",
    summary: "A feint against the city in 211 BCE — and a phrase that outlived it by two thousand years.",
    description:
      "In 211 BCE, with Roman armies besieging Capua — the greatest of the cities that had gone over to him after Cannae — Hannibal marched on Rome itself, hoping to pull them away. He came close enough to the walls to be seen from them, found the Romans unshaken and the siege of Capua not lifted, and withdrew into Campania. Capua fell.\n\n" +
      "IT WAS NOT AN ATTEMPT TO TAKE ROME. He had no siege train and had never had the means to storm a city of that size; the march was a manoeuvre in the war over Capua, and it failed on its own terms.\n\n" +
      "WHAT SURVIVED IT WAS THE PHRASE. 'Hannibal ad portas' is still in use, usually by people describing something with no connection to Carthage. It has an entry of its own in this dataset, at its own date — because Cicero, where it is first met, is evidence for what Romans said in 44 BCE and no evidence at all for what happened outside the walls in 211.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    eventTypeNote: "The march is a historical event. The famous phrase attached to it is a later Roman idiom, and has its own entry at its own date.",
    tags: ["hannibal", "rome", "capua", "second-punic-war", "language"],
    people: ["Hannibal Barca", "Cicero"],
    civilisations: ["Carthage", "Rome"],
    locationName: "Outside the walls of Rome",
    lat: 41.9028,
    lng: 12.4964,
    claims: [
      {
        sourceKey: "goldsworthy",
        citations: [
          { sourceKey: "livy", relation: "supports", note: "The fullest surviving narrative of the march on Rome and of the failure to draw the Roman armies away from Capua." },
          { sourceKey: "polybius", relation: "context", note: "Polybius' account of these years survives only in fragments, so Livy carries most of the weight here — which is itself worth knowing." },
        ],
        startYear: bce(211),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "211 BCE",
        datingMethod: "Modern conversion of the consular year, fixed by the siege of Capua",
        chronology: "conventional",
        evidence:
          "Dated by the siege of Capua, which the Roman sources date firmly, and to which this march was a response.",
        notes:
          "Note what the evidence base looks like this far into the war: Polybius survives only in fragments after the early books, so a single later source is doing most of the work. The further from 218 the dataset goes, the thinner the record gets.",
      },
      {
        sourceKey: "livy",
        startYear: bce(211),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "in the year Capua was taken",
        datingMethod: "Position in a narrative organised by consular year",
        chronology: "historical",
        evidence:
          "The ancient account places the march by what it was for: an attempt to pull the Roman armies off Capua, in the year Capua fell. The march and its failure are dated by the siege, not the other way round.",
      },
    ],
  },

  // 15 ----------------------------------------------------------------------
  {
    slug: "hannibal-ad-portas-proverb",
    title: "'Hannibal ad portas' becomes a proverb",
    summary: "The phrase is attested 167 years after the march it describes — and it is evidence for the phrase, not the march.",
    description:
      "'Hannibal ad portas' — Hannibal at the gates — is met as a fixed expression in Roman political speech of the 40s BCE, where Cicero uses it in the first Philippic the way a proverb is used: shorthand for a danger already at the door.\n\n" +
      "It has never stopped being used since, overwhelmingly by people describing something with no connection to Carthage at all.\n\n" +
      "THIS IS A SEPARATE ENTRY ON PURPOSE. Cicero is excellent evidence for what Romans said in 44 BCE and no evidence whatever for what happened outside the walls in 211. Keeping the phrase and the march apart, each at its own date, is the clearest way to show a distinction that matters far beyond this dataset: the survival of a saying about an event is not a record of the event.\n\n" +
      "Drawn on the timeline it spans the gap between the two — which is the point.",
    category: "culture",
    subcategory: "Tradition and memory",
    eventType: "traditional_account",
    eventTypeNote: "An entry about the AFTERLIFE of an event: a phrase, its first surviving attestation, and the moment it refers back to.",
    tags: ["hannibal", "rome", "language", "tradition", "second-punic-war"],
    people: ["Hannibal Barca", "Cicero"],
    civilisations: ["Rome"],
    locationName: "Rome",
    lat: 41.9028,
    lng: 12.4964,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/M._Tullius_Cicero,_Capitoline_Museum,_Rome.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/M._Tullius_Cicero,_Capitoline_Museum,_Rome.jpg?width=1024",
        shows: "portrait",
        caption:
          "The marble head in the Capitoline Museums traditionally called Cicero, in whose Philippics the phrase " +
          "turns up already worn smooth into a figure of speech. The identification rests on comparison with " +
          "coins and later copies rather than on an inscription naming him.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "cicero",
        citations: [
          { sourceKey: "livy", relation: "context", note: "The narrative of the march the phrase looks back to, written at about the same period as Cicero was speaking." },
        ],
        startYear: bce(44),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "'Hannibal ad portas', in Cicero's first Philippic",
        datingMethod: "Dated by the delivery of the speech in which the phrase is used",
        chronology: "historical",
        evidence:
          "The phrase appears in Roman political oratory of 44 BCE as a byword for imminent danger. That is direct evidence for the phrase, its currency and its force in Cicero's Rome — and it is the earliest surviving use in this dataset.",
      },
      {
        sourceKey: "livy",
        startYear: bce(211),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "the moment the phrase refers back to",
        datingMethod: "The date of the event named by the expression, not of the expression",
        chronology: "traditional",
        evidence:
          "The march on Rome in 211 BCE is what the proverb points at. It is shown here as a claim in its own right so that the 167-year gap between the event and its earliest surviving proverbial use is visible rather than implied.",
        notes:
          "A saying about an event is not a record of it. Whatever Romans of 211 BCE shouted at each other, no text from that year survives to tell us — the phrase enters the record in the age of Cicero.",
      },
    ],
  },

  // 16 ----------------------------------------------------------------------
  {
    slug: "hannibal-campaign-in-italy",
    title: "Hannibal's long campaign in Italy",
    summary: "Fifteen years in Italy, undefeated in the field and unable to finish the war.",
    description:
      "Between his descent from the Alps in 218 BCE and his recall to Africa in 203, Hannibal remained in Italy. He was never driven out and never decisively beaten there; he also never took Rome, and after Cannae he was never again given the pitched battle that might have ended the war.\n\n" +
      "Rome's answer was the strategy named after Fabius Maximus: avoid battle, shadow the invader, retake the cities that defected, and let a war of sieges and attrition run. Capua fell in 211. Tarentum, taken by Hannibal in 212, was retaken in 209. Reinforcement was cut off at the Metaurus in 207, where Hannibal's brother Hasdrubal was defeated and killed while trying to join him.\n\n" +
      "The record of these years is thinner than the record of the first three. Polybius survives complete only for the opening of the war; for much of the Italian campaign the narrative is Livy's, and Livy is working at two centuries' distance from Roman annalists whose books are lost. The further the dataset gets from 218, the more it depends on a single late source — which is a fact about the evidence rather than a fact about Hannibal.",
    category: "history",
    subcategory: "Second Punic War",
    eventType: "historical",
    tags: ["hannibal", "rome", "italy", "second-punic-war", "attrition"],
    people: ["Hannibal Barca", "Quintus Fabius Maximus", "Hasdrubal Barca"],
    civilisations: ["Carthage", "Rome"],
    locationName: "Southern and central Italy",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hannibal_route_of_invasion-en.svg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Hannibal_route_of_invasion-en.svg?width=1024",
        shows: "map",
        caption:
          "The invasion route as conventionally drawn, from Iberia over the Pyrenees, the Rh\u00f4ne and the Alps into " +
          "Italy. The line is firm where the ancient narratives name towns and wholly a matter of argument where " +
          "they do not \u2014 the Alpine pass above all, which this map commits to and the sources never name.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "lazenby",
        citations: [
          { sourceKey: "livy", relation: "supports", note: "The continuous narrative of the Italian campaign, year by year, for the period where Polybius no longer survives whole." },
          { sourceKey: "polybius", relation: "supports", note: "Complete for the opening of the war and fragmentary thereafter — the reason the later years rest so heavily on Livy." },
          { sourceKey: "goldsworthy", relation: "context", note: "A narrative account of the strategy on both sides across the whole of the Italian war." },
        ],
        startYear: bce(218),
        endYear: bce(203),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "218–203 BCE",
        datingMethod: "Modern conversion of a sequence of consular years",
        chronology: "conventional",
        evidence:
          "The span from the descent into Italy to the recall to Africa. The endpoints are fixed by events that both traditions date firmly: the arrival in the Po plain, and the crossing back to Africa before the campaign that ended at Zama.",
      },
      {
        sourceKey: "livy",
        startYear: bce(216),
        endYear: bce(203),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "the years after Cannae, in which Rome refused battle",
        datingMethod: "Narrative sequence of consular years in the surviving Roman account",
        chronology: "historical",
        evidence:
          "The Roman account of the long middle of the war: the Fabian strategy, the recovery of the defected cities, and the attrition that eventually made Hannibal's position in Italy untenable. It is the part of the war for which the surviving evidence is thinnest and most one-sided — a Roman narrative, written in Rome, about the years in which Rome was winning slowly.",
      },
    ],
  },

  // 17 ----------------------------------------------------------------------
  {
    slug: "hannibal-lacinian-inscription",
    title: "Hannibal's inscription at the Lacinian promontory",
    summary: "A bronze tablet of his own army's numbers — which is lost, and which Polybius says he read.",
    description:
      "At the sanctuary of Hera Lacinia on the Lacinian promontory — Capo Colonna, on the coast of Bruttium near Crotone — Hannibal set up a bronze tablet recording the forces he had brought with him. Polybius says he consulted it, and cites it for his figures of the army that came down into Italy after the Alps: 12,000 Libyan and 8,000 Iberian infantry and not more than 6,000 cavalry.\n\n" +
      "THIS IS THE MOST IMPORTANT EVIDENCE ENTRY IN THE DATASET, for a reason that has nothing to do with the numbers.\n\n" +
      "It is the only point where a Carthaginian document made during the war is in play at all. Everything else Carthaginian is gone: the archives of Carthage did not survive the city's destruction in 146 BCE, and the history of Carthage is read almost entirely through the writings of its enemies. A tablet set up by Hannibal is the exception — a statement by the Carthaginian side, in its own words, about its own army.\n\n" +
      "AND IT IS LOST. No trace of it has been recovered. The sanctuary has been excavated and one column of the temple still stands on the headland, but the tablet exists only as a sentence in Polybius saying he used it. So the best Carthaginian evidence in the war reaches us as a Greek historian's report that he once read something — which is simultaneously an unusually strong claim about a source and an unusually good demonstration of how fragile the ancient record is.\n\n" +
      "It is also not a neutral document. It was set up by a commander, in a sanctuary, during a war. Numbers on a public monument are a form of speech, and it is worth asking what the tablet was for — a question the modern literature does ask, and which cannot be settled, because the object is gone.",
    category: "archaeology",
    subcategory: "Evidence and sources",
    eventType: "historical",
    eventTypeNote:
      "An entry about a piece of EVIDENCE rather than about a battle — the physical document behind some of the best-known numbers of the war.",
    tags: ["hannibal", "inscription", "evidence", "polybius", "second-punic-war", "carthage"],
    people: ["Hannibal Barca", "Polybius"],
    civilisations: ["Carthage"],
    locationName: "Capo Colonna, near Crotone, Calabria, Italy",
    lat: 39.0281,
    lng: 17.2028,
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Carthage%2C_quarter_shekel%2C_237-209_BC%2C_SNG_BM_Spain_102.jpg?width=1024",
    media: [
      {
        url: "https://commons.wikimedia.org/wiki/Special:FilePath/Carthage%2C_quarter_shekel%2C_237-209_BC%2C_SNG_BM_Spain_102.jpg?width=1024",
        shows: "artefact",
        caption:
          "Silver quarter shekel struck under Carthaginian rule in Iberia, c. 237–209 BCE: a male head with a club at the shoulder — usually identified as Melqart — and an elephant. Photograph by Classical Numismatic Group, CC BY-SA 2.5, via Wikimedia Commons.",
        kind: "image",
      },
    ],
    claims: [
      {
        sourceKey: "polybius",
        citations: [
          { sourceKey: "lacinium", relation: "supports", note: "The tablet itself — the document being cited, which survives only through this report of it." },
          { sourceKey: "capo_colonna", relation: "context", note: "The sanctuary named in the report: excavated, with a single column of the temple still standing, and no trace of the tablet." },
          { sourceKey: "hoyos", relation: "context", note: "Modern discussion of Polybius' sources and of how much of his figures the inscription can account for." },
        ],
        startYear: bce(218),
        endYear: bce(203),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "set up during the years in Italy, and read by Polybius",
        datingMethod: "Dated by the campaign it records and by the historian who reports using it",
        chronology: "historical",
        evidence:
          "Polybius names the inscription at Lacinium as his authority for the numbers of the army that reached Italy. The tablet must postdate the arrival in Italy in 218 and precede Hannibal's departure from Italy in 203, which is the whole of what can be said about when it was made.",
        notes:
          "How much of Polybius' figures came from the tablet and how much from his other sources cannot be settled from his text alone: he cites it for some numbers and not for others, and the object is not available to check against.",
      },
      {
        sourceKey: "capo_colonna",
        citations: [
          { sourceKey: "polybius", relation: "context", note: "The only reason anyone looks for a Carthaginian tablet at this sanctuary in the first place." },
        ],
        startYear: bce(218),
        endYear: bce(203),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "the sanctuary survives; the tablet does not",
        datingMethod: "Excavated site, identified with the promontory named in the ancient text",
        chronology: "archaeological",
        evidence:
          "The sanctuary of Hera Lacinia at Capo Colonna is a real, excavated place, and one column of its temple is still standing. That confirms the setting of Polybius' statement — there was such a sanctuary, in such a place, at such a time.",
        notes:
          "It confirms no more than that. Nothing of Hannibal's tablet has been found, and absence here is genuinely uninformative: a bronze tablet in an accessible sanctuary is exactly the sort of object that gets taken and melted down. The site supports the setting of the claim, not the claim.",
      },
      {
        sourceKey: "barcid_coins",
        citations: [
          { sourceKey: "hoyos", relation: "context", note: "On what the Barcid coinage can and cannot be made to say about the family that issued it." },
        ],
        startYear: bce(237),
        endYear: bce(206),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "struck under Barcid rule in Iberia, c. 237–206 BCE",
        datingMethod: "Numismatic dating by type, hoard context and mint attribution",
        chronology: "archaeological",
        evidence:
          "Included on this entry as the comparison it deserves: these coins are the Carthaginian physical evidence that DOES survive in quantity. They are contemporary, they were made by the regime in question, and they can be handled and dated. What they carry is a divine head, an elephant and a denomination.",
        notes:
          "AND THIS IS WHERE CARE IS NEEDED. The head is usually identified as Melqart; whether it also carries the features of Hamilcar or Hannibal is argued about and cannot be decided from the coins, which are not labelled and are not portraits in the modern sense. Coins are superb evidence for a regime's self-image and dreadful evidence for a face.",
      },
    ],
  },
];
