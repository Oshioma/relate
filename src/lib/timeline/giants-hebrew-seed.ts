import type { SeedEvent, SeedSource, SeedTrack, SeedEventLink } from "./seed-types";

// =============================================================================
// GIANTS, PART ONE: A FOSSIL, AND FOUR KINDS OF DATE
//
// First tranche of the giants dataset, and it sets the pattern for all of it.
//
// THE PROBLEM THIS DATASET HAS TO SOLVE. Ask "when were there giants" and the
// question hides four completely different questions wearing one coat:
//
//   1. WHEN DOES THE STORY SAY IT HAPPENED? Often no year at all — "before the
//      Flood" is a position in a narrative, not a date.
//   2. WHEN WAS THE TEXT COMPOSED? A real, arguable, scholarly date.
//   3. WHEN WAS THE SURVIVING COPY WRITTEN? Different again, and often the only
//      one that can be measured — a scrap of parchment can be dated.
//   4. WHEN, IF ANYTHING PHYSICAL IS INVOLVED, DID THE CREATURE LIVE? Only one
//      record in this tranche can answer that, and it is about an ape.
//
// Collapsing those into one number is the mistake the whole dataset exists to
// avoid. So every claim here says in its own heading WHICH of the four it is,
// and a reader who opens a record sees them side by side rather than averaged.
//
// WHAT KIND OF RECORD IS THIS? Every description opens with that question
// answered plainly — fossil evidence, religious text, manuscript — because a
// student who knows what kind of thing they are looking at has already done
// most of the work.
//
// GIGANTOPITHECUS IS NOT A GIANT HUMAN AND THIS RECORD SAYS SO REPEATEDLY. It
// is an extinct ape, related to orangutans. It is here because it is the one
// entry with physical remains, which makes it the measuring stick for every
// entry that has none: this is what it looks like when there IS a fossil.
//
// AND THE ABSENCE OF EVIDENCE IS NOT EVIDENCE OF ABSENCE, stated in those terms
// wherever it applies. "No accepted physical remains have been identified as
// Nephilim" is a true sentence. "Giants never existed" is a different sentence,
// it is not established, and this dataset does not say it.
//
// NO CONFIDENCE SCORES. No verdicts. Where a tradition makes a claim, the claim
// is recorded accurately and attributed to whoever makes it.
// =============================================================================

export const GIANTS_HEBREW_ANCHOR_SLUG = "gigantopithecus-blacki";

export const GIANTS_HEBREW_TRACK: SeedTrack = {
  name: "Giants: the claim, the claimant, and the kind of record",
  slug: "giants-traditions",
  kind: "theme",
  color: "#6b4f9e",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const GIANTS_HEBREW_SOURCES: SeedSource[] = [
  // --- Gigantopithecus ----------------------------------------------------
  {
    key: "zhang_nature2024",
    title: "The demise of the giant ape Gigantopithecus blacki",
    author: "Yingqi Zhang and colleagues",
    workTitle: "Nature",
    reference: "Volume 625 (2024)",
    url: "https://www.nature.com/articles/s41586-023-06900-0",
    sourceType: "academic_paper",
    publishedYear: 2024,
    notes:
      "The chronology of the species' extinction, from 22 caves in southern China and 157 radiometric ages across " +
      "six dating techniques. Cited for the extinction window of 295,000 to 215,000 years ago and for the " +
      "environmental picture — a forest-and-grass mosaic from 2.3 million years ago, then increased seasonality " +
      "that the species did not adapt to while the Chinese orangutan did.",
  },
  {
    key: "zhang_harrison2017",
    title: "Gigantopithecus blacki: a giant ape from the Pleistocene of Asia revisited",
    author: "Yingqi Zhang and Terry Harrison",
    workTitle: "American Journal of Physical Anthropology",
    reference: "2017",
    url: "https://onlinelibrary.wiley.com/doi/full/10.1002/ajpa.23150",
    sourceType: "academic_paper",
    publishedYear: 2017,
    notes:
      "The review of what is actually known. Cited for the discovery history — von Koenigswald's 1935 description " +
      "from a single lower molar bought in a Hong Kong drugstore, where such fossils were sold as 'dragon teeth' " +
      "for traditional medicine — and for the state of the fossil record: close to two thousand isolated teeth and " +
      "four partial mandibles, and nothing else.",
  },

  // --- Hebrew and Enochic -------------------------------------------------
  {
    key: "genesis6",
    title: "Genesis 6:1–4",
    workTitle: "The Hebrew Bible",
    sourceType: "religious_text",
    notes:
      "The four verses the whole Nephilim tradition rests on: the sons of God take wives of the daughters of men, " +
      "and 'the Nephilim were on the earth in those days, and also afterward'. Cited as the primary text. It is " +
      "very short, it gives no measurements and no date, and a reader should know how little it actually says.",
  },
  {
    key: "numbers13",
    title: "Numbers 13:33",
    workTitle: "The Hebrew Bible",
    sourceType: "religious_text",
    notes:
      "The second and only other occurrence of the word: the spies' report from Canaan, 'and there we saw the " +
      "Nephilim… and we were in our own sight as grasshoppers'. Cited because it matters who is speaking — this is " +
      "reported speech from a scouting party the narrative goes on to describe as giving a bad report.",
  },
  {
    key: "1enoch_watchers",
    title: "1 Enoch 1–36, the Book of the Watchers",
    workTitle: "1 Enoch",
    sourceType: "religious_text",
    notes:
      "The text that turns four verses of Genesis into a narrative: two hundred Watchers descend, swear an oath on " +
      "Mount Hermon, take wives, teach metalwork, cosmetics, sorcery and astrology, and father giants. Composed in " +
      "Aramaic, generally placed in the third century BCE. Cited as the primary text for the Enochic version, " +
      "which is a different account from Genesis and not a commentary on it.",
  },
  {
    key: "qumran_enoch_mss",
    title: "The Aramaic Enoch manuscripts from Qumran Cave 4 (4Q201–4Q202)",
    reference: "4Q201 palaeographically dated to 200–150 BCE",
    sourceType: "primary",
    notes:
      "The oldest surviving witnesses to the Book of the Watchers, and the reason its date can be argued at all: " +
      "physical manuscripts, datable by the shape of the letters. Cited for the manuscript date as distinct from " +
      "the composition date — a copy from 200–150 BCE proves the text existed by then and says nothing about how " +
      "much earlier it was written.",
  },
  {
    key: "milik1976",
    title: "The Books of Enoch: Aramaic Fragments of Qumrân Cave 4",
    author: "Józef T. Milik",
    sourceType: "academic_book",
    publishedYear: 1976,
    notes:
      "The edition that made the Aramaic Enoch and Book of Giants fragments available and set the terms of the " +
      "discussion about their dates. Cited as the scholarly foundation; later specialists have disagreed with " +
      "Milik on particulars, which is ordinary and is why the composition dates are given as ranges.",
  },
  {
    key: "book_of_giants_qumran",
    title: "The Book of Giants (Qumran fragments, including 4Q203 and 4Q530)",
    reference: "4Q530 palaeographically dated to about 100 BCE",
    sourceType: "primary",
    notes:
      "A narrative about the giant sons of the Watchers — they are named, they have dreams, and the dreams are " +
      "interpreted as foretelling their destruction. Cited as the primary text. It depends on the Book of the " +
      "Watchers, so it must be later than it, and its oldest surviving copy is around 100 BCE.",
  },
  {
    key: "ussher1650",
    title: "Annales Veteris Testamenti, a prima mundi origine deducti",
    author: "James Ussher",
    reference: "1650; English translation, The Annals of the World, 1658",
    sourceType: "book",
    publishedYear: 1650,
    notes:
      "The best-known calculated biblical chronology, placing the first day of creation on 23 October 4004 BC in " +
      "the proleptic Julian calendar. Cited as the claimant's own work. Ussher's method is worth knowing: he added " +
      "the ages in the genealogies of Genesis 5 and 11 and anchored the result to secular history through the " +
      "reign of Nebuchadnezzar, using a Babylonian king list preserved by Ptolemy.",
  },
  {
    key: "hays_jets2005",
    title: "Reconsidering the height of Goliath",
    author: "J. Daniel Hays",
    workTitle: "Journal of the Evangelical Theological Society",
    reference: "Volume 48, number 4 (December 2005), pages 701–714",
    url: "http://www.davidacook.com/uploads/1/0/8/8/10887248/reconsidering_the_height_of_goliath.pdf",
    sourceType: "academic_paper",
    publishedYear: 2005,
    notes:
      "A text-critical treatment of the two readings of 1 Samuel 17:4. Cited for the manuscript witnesses on each " +
      "side and for the argument that the shorter reading is likely the earlier one — the expected direction of " +
      "change is for an opponent to grow in the retelling, not to shrink.",
  },
  {
    key: "1samuel17",
    title: "1 Samuel 17:4",
    workTitle: "The Hebrew Bible",
    sourceType: "religious_text",
    notes:
      "The verse giving Goliath's height, and the one place in this tranche where the surviving manuscripts " +
      "disagree with each other about a measurement rather than about a date. Cited in both its readings.",
  },
  {
    key: "4qsama",
    title: "4QSamuel-a (4Q51)",
    reference: "Qumran; palaeographically dated to the middle of the first century BCE",
    sourceType: "primary",
    notes:
      "The oldest surviving Hebrew manuscript of Samuel, and it reads 'four cubits and a span'. Cited because its " +
      "date is the point: it is roughly a thousand years older than the earliest complete Masoretic manuscripts, " +
      "and it agrees with the Septuagint and with Josephus against the later Hebrew tradition.",
  },
];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export const GIANTS_HEBREW_EVENTS: SeedEvent[] = [
  // =========================================================================
  // GIGANTOPITHECUS — the one with bones, and it is not a human.
  // =========================================================================
  {
    slug: GIANTS_HEBREW_ANCHOR_SLUG,
    title: "Gigantopithecus blacki lives and dies out",
    summary:
      "A genuinely enormous ape, known from about two thousand teeth and four jawbones — and not a giant human. The only record in this group with physical remains.",
    description:
      "WHAT KIND OF RECORD IS THIS? Fossil evidence. Physical remains: yes. Interpretation: an extinct ape, related to orangutans. Remains identified as a giant HUMAN: none, and none claimed by the researchers.\n\n" +
      "Gigantopithecus blacki was the largest primate known to have lived. It is here, at the head of a dataset about giants, for one reason: it is the only entry in this tranche where somebody can hold the evidence in their hand.\n\n" +
      "HOW IT WAS FOUND, WHICH IS A GOOD STORY AND ALSO A LESSON. In 1935 Ralph von Koenigswald described the species from a single lower molar he bought in a Chinese drugstore in Hong Kong, where fossil teeth were sold as 'dragon teeth' for traditional medicine. The tooth was about 20 by 22 millimetres — enormous for a primate molar.\n\n" +
      "WHAT EXISTS NOW, STATED EXACTLY. Close to two thousand isolated teeth and four partial mandibles, from cave sites in southern China. THERE ARE NO POSTCRANIAL BONES — no limbs, no spine, no pelvis, nothing below the jaw. One suggestion is that porcupines gnawed them away before they could fossilise.\n\n" +
      "SO WHERE DOES 'THREE METRES TALL' COME FROM? Estimates of roughly three metres and 200 to 300 kilograms are EXTRAPOLATIONS from teeth and jaws, using the proportions of living apes. They are reasonable scientific inferences and they are not measurements. A reader who has seen a museum reconstruction standing next to a human silhouette should know that its height was calculated from a jawbone.\n\n" +
      "WHEN IT LIVED. Its fossils come from the Early and Middle Pleistocene of southern China. In 2024 a large dating study — 22 caves, 157 radiometric ages, six techniques — placed the extinction between 295,000 and 215,000 years ago, about a hundred thousand years earlier than had been thought. The environment had been a mosaic of forest and grass from around 2.3 million years ago; increasing seasonality changed the plant communities, and while the Chinese orangutan adapted, Gigantopithecus showed signs of chronic stress and declining numbers.\n\n" +
      "THE CONNECTION PEOPLE MAKE, AND WHAT WOULD BE NEEDED TO SUPPORT IT. Gigantopithecus is regularly proposed as the reality behind Yeti, Sasquatch and giant-hominid traditions. That proposal is on this record as its own claim, because it is a real claim that real people make. What it does not have is physical evidence: no remains later than roughly 215,000 years ago, nothing outside southern China, and no postcranial anatomy to compare with a footprint. Saying so is not the same as saying the traditions are about nothing.\n\n" +
      "THINGS TO ASK: What is actually being claimed? Is there physical evidence, and of what exactly? If every size figure comes from teeth, how confident should anyone be about height? What evidence would establish a link to a modern tradition — and what evidence would weaken it?",
    category: "nature",
    subcategory: "Fossil evidence",
    eventType: "scientific_model",
    eventTypeNote:
      "Fossil evidence with a measured chronology. The species and its dates are not disputed; what is disputed is whether it has anything to do with giant-hominid traditions.",
    tags: ["gigantopithecus", "fossil", "pleistocene", "china", "giants", "physical-evidence"],
    people: ["Ralph von Koenigswald", "Yingqi Zhang", "Terry Harrison"],
    locationName: "Southern China",
    lat: 23.5,
    lng: 108.5,
    claims: [
      {
        sourceKey: "zhang_nature2024",
        startYear: -293050,
        endYear: -213050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "extinct between 295,000 and 215,000 years ago",
        datingMethod: "radiometric",
        chronology: "scientific",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "radiometric_date",
        whatIsDated: "When the species died out — a measured date for an animal",
        evidence:
          "WHAT IS DATED: the last appearance of Gigantopithecus blacki in the fossil record. DATING METHOD: 157 " +
          "radiometric ages from six techniques, across 22 caves in southern China. WHAT IT ESTABLISHES: an " +
          "extinction window roughly a hundred thousand years earlier than previously thought. WHAT IT DOES NOT " +
          "ESTABLISH: anything about giant humans, and nothing about any tradition. This is the one date in this " +
          "group that measures an animal rather than a text.",
        notes:
          "Converted from years before present rather than carried across: 295,000 years ago is −293050.\n\n" +
          "THIS CLAIM IS THE MEASURING STICK FOR THE TRANCHE. Every other record here dates a story, a composition " +
          "or a piece of parchment. This one dates bones, and the difference is the thing worth learning.",
      },
      {
        sourceKey: "zhang_harrison2017",
        startYear: 1935,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "described in 1935 from a single molar bought in a Hong Kong drugstore",
        datingMethod: "historical_record",
        chronology: "historical",
        temporalClaimType: "absolute_date",
        whatIsDated: "The scientific description of the species",
        evidence:
          "WHAT IS DATED: von Koenigswald's publication. DATING METHOD: the historical record. WHAT IT " +
          "ESTABLISHES: that the species entered science in 1935, from one tooth of about 20 by 22 mm purchased " +
          "in a drugstore where such fossils were sold as 'dragon teeth'. WHAT IT DOES NOT ESTABLISH: the age of " +
          "the animal — a discovery date and a fossil date are different things, which is the distinction this " +
          "whole dataset is built around.",
        notes:
          "Worth keeping as its own claim because the provenance is unusual and instructive: the type specimen was " +
          "bought, not excavated, and its original context was therefore never recorded.",
      },
      {
        sourceKey: "zhang_harrison2017",
        startYear: -293050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "body size estimated at about 3 m and 200–300 kg, extrapolated from teeth and mandibles",
        datingMethod: "estimate",
        chronology: "scientific",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "estimated_range",
        whatIsDated: "How big it was — an estimate from teeth, not a measurement of a skeleton",
        evidence:
          "WHAT IS DATED: nothing; this claim carries the SIZE question so it cannot be mistaken for a measured " +
          "date. DATING METHOD: estimation from dental and mandibular dimensions against the proportions of living " +
          "apes. WHAT IT ESTABLISHES: that the animal was very large, on a defensible inference. WHAT IT DOES NOT " +
          "ESTABLISH: a height. There are no postcranial remains at all — no limbs, no spine, no pelvis — so no " +
          "stature has ever been measured, only calculated.",
        notes:
          "Shares a stored year with the fossil claim because a size estimate has no date of its own; what it " +
          "dates is in its own heading.\n\n" +
          "THE MUSEUM SILHOUETTE IS A RECONSTRUCTION. That is not a criticism of the reconstruction, which is made " +
          "honestly from what exists. It is a fact a student should have before comparing it with anything.",
      },
      {
        sourceKey: "zhang_nature2024",
        startYear: -213050,
        datePrecision: "thousand_years",
        isApproximate: true,
        originalDateText: "proposed as the origin of Yeti, Sasquatch and giant-hominid traditions",
        datingMethod: "claimant_inference",
        chronology: "alternative",
        dateConvention: "before_present",
        conventionReferenceYear: 1950,
        temporalClaimType: "proposed_correlation",
        whatIsDated: "Whether this animal underlies later giant traditions — the proposed connection, not a date",
        evidence:
          "WHAT IS DATED: nothing. The proposed connection is kept as its own claim because it is a real claim " +
          "that real people make, and because it is a different kind of statement from the fossil chronology. " +
          "DATING METHOD: inference from the animal's size to the content of traditions. WHAT IT ESTABLISHES: that " +
          "the proposal exists and what it says. WHAT IT DOES NOT ESTABLISH: the connection. There are no remains " +
          "later than about 215,000 years ago, none outside southern China, and no postcranial anatomy to compare " +
          "with anything reported. ABSENCE OF ACCEPTED EVIDENCE IS NOT PROOF THAT A TRADITION IS ABOUT NOTHING, " +
          "and this record does not claim it is.",
        notes:
          "Stored at the extinction date, which is the latest point the animal is known to have existed and " +
          "therefore the most generous position the proposal can be given.\n\n" +
          "WHAT WOULD CHANGE THIS: remains substantially later than 215,000 years ago, remains outside southern " +
          "China, or postcranial material that could be compared with a reported track. Naming what would change " +
          "a position is more useful to a student than being told which position to hold.",
      },
    ],
  },

  // =========================================================================
  // NEPHILIM — four lanes, and the first one has no year at all.
  // =========================================================================
  {
    slug: "nephilim-genesis",
    title: "The Nephilim in Genesis",
    summary:
      "Four verses, no measurements, no date — and at least four different kinds of chronology have been attached to them. Each answers a different question.",
    description:
      "WHAT KIND OF RECORD IS THIS? Ancient religious text. Physical remains specifically identified as Nephilim: none accepted. Narrative setting: before the Flood.\n\n" +
      "Genesis 6:1–4 says that the sons of God took wives of the daughters of men, and that 'the Nephilim were on the earth in those days, and also afterward'. That is very nearly all of it. The passage gives no height, no measurement, no lifespan and no date. The word appears only once more in the Hebrew Bible, at Numbers 13:33, in the report the scouts bring back from Canaan — 'we were in our own sight as grasshoppers' — which is reported speech from a party the narrative then treats as having given a bad report.\n\n" +
      "SO WHY DOES THIS RECORD HAVE FOUR DATE CLAIMS? Because four different questions get asked about the same four verses, and the answers are not competing versions of one number.\n\n" +
      "ONE: WHERE THE STORY SITS. Before the Flood. That is a position in a narrative sequence, not a year, and this record carries it as a claim with NO DATE AT ALL rather than inventing one. The timeline can hold a claim that places nothing on the axis, and this is exactly what that is for.\n\n" +
      "TWO: A CALCULATED BIBLICAL CHRONOLOGY. James Ussher added the genealogies of Genesis 5 and 11 and anchored them to secular history, arriving at creation on 23 October 4004 BC. Other calculators, working from the Septuagint's longer genealogies, get dates well over a thousand years earlier. These are calculations from a text, and they are recorded as such.\n\n" +
      "THREE: WHEN THE TEXT WAS WRITTEN. A scholarly question with a scholarly answer, and a completely different thing from when the events are said to have happened.\n\n" +
      "FOUR: THE ENOCHIC VERSION, which is its own record on this timeline because it is a different account rather than a gloss on this one.\n\n" +
      "WHAT 'NEPHILIM' MEANS IS ITSELF DISPUTED. The word is untranslated in many English Bibles because its derivation is uncertain; it has been connected with a root meaning 'to fall'. The Septuagint rendered it gigantes, which is how 'giants' entered the English tradition — a translation decision made in Greek, centuries after the Hebrew, carrying Greek mythological freight with it.\n\n" +
      "THINGS TO ASK: What does the text actually say, and what has been added by later readers? Could a translation choice have shaped what everyone now pictures? Is a genealogical calculation the same kind of statement as a radiocarbon date? If no remains have been identified, does that settle the question, or only leave it open?",
    category: "religion",
    subcategory: "Ancient religious text",
    eventType: "religious_account",
    eventTypeNote:
      "A religious text, carried as a text. The four claims answer four different questions and are labelled so they cannot be read as rival estimates of one number.",
    tags: ["nephilim", "genesis", "hebrew-bible", "giants", "chronology", "translation"],
    civilisations: ["Ancient Israel"],
    locationName: "The Levant",
    lat: 31.5,
    lng: 35.0,
    claims: [
      {
        sourceKey: "genesis6",
        datePrecision: "millennium",
        isApproximate: true,
        originalDateText: "'in those days, and also afterward' — before the Flood, in the narrative sequence",
        datingMethod: "textual_interpretation",
        chronology: "religious",
        // "primordial", not "before_event": the database permits a claim with no
        // year only for cyclic, eternal, no_beginning, primordial,
        // previous_world and unknown. Genesis 6 sits in the primeval history, so
        // primordial is both allowed and accurate. Found by the check constraint
        // rejecting the row — the tests had passed it.
        temporalClaimType: "primordial",
        whatIsDated: "Where the story sits in its own narrative — a position, not a year",
        evidence:
          "WHAT IS DATED: nothing on the calendar, deliberately. The text places the Nephilim before the Flood and " +
          "gives no year, so this claim carries no position on the axis. DATING METHOD: reading the narrative " +
          "sequence. WHAT IT ESTABLISHES: where the tradition puts the event relative to other events in the same " +
          "story. WHAT IT DOES NOT ESTABLISH: any date in any calendar. Turning 'before the Flood' into a number " +
          "requires a chronology, and a chronology is a separate claim by a named person — see the next one.",
        notes:
          "SEEDED WITH NO YEAR ON PURPOSE. This is the claim most likely to be quietly converted into a BCE date " +
          "by anyone summarising the record, and the architecture exists precisely so it does not have to be.",
        citations: [
          {
            sourceKey: "numbers13",
            relation: "context",
            note:
              "The only other occurrence of the word in the Hebrew Bible, and it is reported speech from a " +
              "scouting party the narrative then treats as having given a bad report.",
          },
        ],
      },
      {
        sourceKey: "ussher1650",
        startYear: -4003,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "the first day of creation, 23 October 4004 BC, in Ussher's chronology",
        datingMethod: "genealogy",
        chronology: "biblical",
        temporalClaimType: "calculated_date",
        whatIsDated: "Creation, in one calculated biblical chronology — the frame a pre-Flood date would sit in",
        evidence:
          "WHAT IS DATED: the beginning of the world, as calculated by James Ussher and published in 1650. DATING " +
          "METHOD: genealogy — the ages in Genesis 5 and 11 added together, anchored to secular history through " +
          "Nebuchadnezzar's reign in a Babylonian king list preserved by Ptolemy. WHAT IT ESTABLISHES: what this " +
          "chronology says, and how it was arrived at, which is checkable arithmetic from a stated text. WHAT IT " +
          "DOES NOT ESTABLISH: a date for the Nephilim. It supplies the frame; the narrative places them before " +
          "the Flood inside it.",
        notes:
          "Stored in astronomical year numbering: 4004 BCE is −4003.\n\n" +
          "USSHER'S OWN DATE FOR THE FLOOD was not traced to his text for this entry, so it is not seeded. NEEDS " +
          "SOURCE VERIFICATION — the figure commonly quoted is 2348 BC, and it is left out rather than attributed " +
          "to him on the strength of repetition.\n\n" +
          "CHRONOLOGIES CALCULATED FROM THE SEPTUAGINT'S LONGER GENEALOGIES PUT CREATION MUCH EARLIER, by well " +
          "over a thousand years. That is a real and old disagreement inside the tradition itself.",
      },
      {
        sourceKey: "genesis6",
        startYear: -549,
        endYear: -399,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the composition of the Pentateuchal text, generally placed in the Persian period",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "When the text was written down — a different question from when it says events happened",
        evidence:
          "WHAT IS DATED: the formation of the text, not its contents. DATING METHOD: textual scholarship — " +
          "language, sources and the history of the collection. WHAT IT ESTABLISHES: roughly when these verses " +
          "reached the form we have. WHAT IT DOES NOT ESTABLISH: whether anything in them happened, or when. A " +
          "composition date is evidence about a document.",
        notes:
          "NEEDS SOURCE VERIFICATION. A specific scholarly publication for this bracket was not traced for this " +
          "entry, so the claim is stored as a wide century-level range and flagged rather than given a precision " +
          "it has not earned here. Gen 6:1–4 is also often treated as an older fragment embedded in the later " +
          "text, which would make its own date earlier than the collection's.",
      },
    ],
  },

  // =========================================================================
  // THE WATCHERS — where the story actually gets its detail.
  // =========================================================================
  {
    slug: "watchers-book-of-enoch",
    title: "The Watchers and their giant offspring, in 1 Enoch",
    summary:
      "The text that turns four verses of Genesis into a narrative — two hundred Watchers, an oath on Mount Hermon, and giant sons. Composed in Aramaic, third century BCE.",
    description:
      "WHAT KIND OF RECORD IS THIS? Ancient religious text, surviving in physical manuscripts that can be dated. Physical remains of giants: none. Narrative setting: before the Flood.\n\n" +
      "Almost everything people picture when they hear 'Nephilim' comes from here rather than from Genesis. The Book of the Watchers — the first section of 1 Enoch, chapters 1 to 36 — tells it at length: two hundred Watchers descend, bind themselves by oath on Mount Hermon, take human wives, and teach metalworking and weapons, cosmetics, sorcery, astrology and the cutting of roots. Their sons are giants, and the giants devour what people produce and then turn on people themselves.\n\n" +
      "THIS IS A DIFFERENT ACCOUNT, NOT A COMMENTARY. Genesis has no oath, no Mount Hermon, no list of forbidden teachings and no named Watchers. Treating 1 Enoch as an explanation of Genesis 6 is a choice a reader makes; the two texts are related and are not the same story.\n\n" +
      "TWO DATES, AND THE DIFFERENCE BETWEEN THEM IS THE LESSON. The text is generally placed in the third century BCE, on the language and on what it seems to know. But the OLDEST SURVIVING COPIES — Aramaic fragments from Qumran Cave 4 — are palaeographically dated to about 200–150 BCE. A manuscript date proves the text existed by then. It cannot show how much earlier it was composed, and the composition date is an argument rather than a measurement.\n\n" +
      "WHY THAT MATTERS HERE MORE THAN USUAL. For most of this dataset the only thing that can be physically dated is a piece of parchment. The fragments are real objects; the letters on them have shapes that change over time; specialists read those shapes. That is a genuine dating method with a genuine result, and its result is about the copy.\n\n" +
      "1 ENOCH IS SCRIPTURE IN SOME TRADITIONS AND NOT IN OTHERS. It is canonical in the Ethiopian Orthodox Tewahedo Church, and the complete text survives in Ge'ez. It is not in the Jewish or most Christian canons. That is a fact about communities rather than about the text's age, and it is worth stating plainly.\n\n" +
      "THINGS TO ASK: Is the source contemporary with the events it describes? What is the difference between dating a story and dating the sheet it is written on? If a later text has more detail than an earlier one, what are the possible explanations?",
    category: "religion",
    subcategory: "Ancient religious text",
    eventType: "religious_account",
    eventTypeNote:
      "A text, dated twice: once for its composition, which is argued, and once for its oldest surviving copy, which is measured from the handwriting.",
    tags: ["watchers", "1-enoch", "qumran", "aramaic", "giants", "manuscript"],
    people: ["Józef T. Milik"],
    locationName: "Judaea and the Levant",
    lat: 31.7,
    lng: 35.4,
    claims: [
      {
        sourceKey: "1enoch_watchers",
        startYear: -299,
        endYear: -199,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "composed in Aramaic, generally placed in the third century BCE",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "When the Book of the Watchers was composed",
        evidence:
          "WHAT IS DATED: the writing of the text. DATING METHOD: textual scholarship — the Aramaic, the ideas, and " +
          "what the work appears to know and not know. WHAT IT ESTABLISHES: roughly when this account of the " +
          "Watchers was put together, which is centuries after the Genesis verses it is related to. WHAT IT DOES " +
          "NOT ESTABLISH: itself with the precision a manuscript date has. Specialists have disagreed about the " +
          "range, which is why it is stored as a century and marked approximate.",
        notes:
          "Stored in astronomical year numbering: 300 BCE is −299. Proposals run from the end of the fourth " +
          "century BCE to before 200 BCE.",
        citations: [
          { sourceKey: "milik1976", relation: "context", note: "The edition that set the terms of the discussion." },
        ],
      },
      {
        sourceKey: "qumran_enoch_mss",
        startYear: -199,
        endYear: -149,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "4Q201 palaeographically dated to 200–150 BCE",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        temporalClaimType: "absolute_date",
        whatIsDated: "When the oldest surviving copy was written — a physical object",
        evidence:
          "WHAT IS DATED: a manuscript. DATING METHOD: palaeography — the shapes of the letters, which change over " +
          "time in ways specialists can place. WHAT IT ESTABLISHES: that the Book of the Watchers existed in " +
          "Aramaic by the middle of the second century BCE at the latest. WHAT IT DOES NOT ESTABLISH: when it was " +
          "composed. A copy gives a latest-possible date for the text and says nothing about the earliest.",
        notes:
          "THE ONLY PHYSICALLY DATABLE THING ON THIS RECORD, and the distinction between it and the composition " +
          "claim above is the single most transferable idea in this tranche: the parchment and the story have " +
          "different ages.",
      },
    ],
  },

  // =========================================================================
  // THE BOOK OF GIANTS — the giants get names and dreams.
  // =========================================================================
  {
    slug: "book-of-giants",
    title: "The Book of Giants",
    summary:
      "A narrative about the giant sons of the Watchers, found in fragments at Qumran — they are named, they dream, and the dreams are read as foretelling their end.",
    description:
      "WHAT KIND OF RECORD IS THIS? Ancient text, surviving only in fragments. Physical remains of giants: none. Narrative setting: before the Flood.\n\n" +
      "The Book of Giants takes the Watchers story further and tells it from the giants' side. They have names. They have dreams — of a tablet being washed clean, of a tree uprooted — and the dreams are taken to their father Shemihazah and then to Enoch for interpretation, who reads them as announcing the giants' destruction.\n\n" +
      "IT SURVIVES IN PIECES, AND THAT IS PART OF THE RECORD. What exists at Qumran is fragments across several manuscripts, including 4Q203 and 4Q530. The narrative has to be reconstructed from them, and reconstructions differ. A student should know that the order and completeness of this story are themselves scholarly arguments rather than something read off a page.\n\n" +
      "ITS DATE IS FIXED BY SOMETHING IT DEPENDS ON. The Book of Giants uses the Book of the Watchers, so it must be later. Its oldest surviving manuscript, 4Q530, is palaeographically placed around 100 BCE. That gives a window rather than a date, and the window is honest.\n\n" +
      "IT HAD A SECOND LIFE. Centuries later the text was taken up in Manichaean tradition and circulated widely in Central Asia, in several languages. A text that vanished from the Jewish and Christian traditions was still being copied elsewhere — which is a useful corrective to the idea that a text's history ends where one tradition stops using it.\n\n" +
      "THINGS TO ASK: If a story survives only in fragments, how much of what we read is reconstruction? What does it mean that one text must be later than another? Does a text being copied for centuries tell you anything about whether its events happened?",
    category: "religion",
    subcategory: "Ancient text",
    eventType: "religious_account",
    eventTypeNote:
      "A fragmentary text. Its composition can only be bracketed — later than the work it depends on, and no later than its oldest surviving copy.",
    tags: ["book-of-giants", "qumran", "enoch", "manichaean", "giants", "fragments"],
    locationName: "Qumran, Judaean Desert",
    lat: 31.7417,
    lng: 35.4589,
    claims: [
      {
        sourceKey: "book_of_giants_qumran",
        startYear: -99,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "4Q530 palaeographically dated to about 100 BCE",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        temporalClaimType: "absolute_date",
        whatIsDated: "When the oldest surviving copy was written",
        evidence:
          "WHAT IS DATED: a manuscript fragment. DATING METHOD: palaeography. WHAT IT ESTABLISHES: that the Book " +
          "of Giants existed by about 100 BCE. WHAT IT DOES NOT ESTABLISH: when it was composed, or how much of " +
          "the narrative we now read was in it — the text survives in pieces and its arrangement is reconstructed.",
        notes:
          "The latest-possible date for the composition, and the only measured quantity on this record.",
      },
      {
        sourceKey: "book_of_giants_qumran",
        startYear: -199,
        endYear: -99,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "later than the Book of the Watchers, which it uses, and no later than its oldest copy",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        temporalClaimType: "estimated_range",
        whatIsDated: "When it was composed — bracketed between a text it depends on and a copy that survives",
        evidence:
          "WHAT IS DATED: the writing of the work. DATING METHOD: dependence plus manuscript evidence — it draws " +
          "on the Book of the Watchers, so it is later than that; its oldest copy is around 100 BCE, so it is " +
          "earlier than that. WHAT IT ESTABLISHES: a genuine bracket from two independent directions. WHAT IT DOES " +
          "NOT ESTABLISH: a year. Nothing here narrows it further, and inventing a midpoint would be false " +
          "precision.",
        notes:
          "A GOOD EXAMPLE OF DATING BY CONSTRAINT rather than by measurement. Neither end is a lab result; both " +
          "are defensible, and together they bound the answer.",
        citations: [
          {
            sourceKey: "1enoch_watchers",
            relation: "context",
            note: "The text it depends on, which supplies the earlier bound.",
          },
        ],
      },
    ],
  },

  // =========================================================================
  // GOLIATH — where the manuscripts disagree about a measurement.
  // =========================================================================
  {
    slug: "goliath-of-gath",
    title: "Goliath of Gath",
    summary:
      "The oldest surviving Hebrew manuscript makes him about 2.06 m. The later Hebrew tradition makes him about 2.97 m. Both readings are on the record.",
    description:
      "WHAT KIND OF RECORD IS THIS? Ancient religious text. Physical remains identified as Goliath: none. Narrative setting: the reign of Saul. And it is the one place in this group where the surviving manuscripts disagree with each other about a MEASUREMENT rather than about a date.\n\n" +
      "1 Samuel 17:4 gives the height of the Philistine champion. Which height depends on which manuscript you read.\n\n" +
      "SIX CUBITS AND A SPAN — about 2.97 metres, or nine feet nine. This is the reading of the Masoretic Text, the authoritative Hebrew tradition, and it is followed by the Vulgate and the Peshitta.\n\n" +
      "FOUR CUBITS AND A SPAN — about 2.06 metres, or six feet nine. This is the reading of 4QSamuel-a, a Dead Sea Scrolls manuscript from the middle of the first century BCE; of important Greek manuscripts of the Septuagint; and of Josephus.\n\n" +
      "THE OLDEST WITNESS GIVES THE SMALLER NUMBER. 4QSamuel-a is roughly a thousand years older than the earliest complete Masoretic manuscripts. Text critics generally reason that the change is more likely to have run upwards than downwards: a champion an opponent is praised for defeating tends to grow in retelling, not shrink. On that reasoning the shorter reading is likely the earlier one, and many modern translations now footnote or adopt it.\n\n" +
      "NEITHER READING MAKES HIM ORDINARY. Two metres and six centimetres is a very tall man in any period and an extraordinary one in the ancient Levant, where average heights were lower than today. The disagreement is about how far beyond ordinary the text places him — not about whether it describes an exceptional man.\n\n" +
      "AND THIS IS WHY THE DATASET SEPARATES KINDS OF DATE. The height is not dated. What can be dated is: when the narrative is set, when the text was composed, and when each surviving manuscript was written. The claims below are the last of those, because they are the ones that can actually be measured — and because the manuscript dates are what the whole argument turns on.\n\n" +
      "THINGS TO ASK: If two copies of the same verse disagree, how would you decide which is earlier? Does the older manuscript automatically win? Could a number have been changed on purpose, or by accident? Does it change the story if he was 2.06 m rather than 2.97 m?",
    category: "religion",
    subcategory: "Ancient religious text",
    eventType: "religious_account",
    eventTypeNote:
      "A textual disagreement about a measurement, carried in both readings with the manuscript evidence for each. The record does not pick one.",
    tags: ["goliath", "1-samuel", "dead-sea-scrolls", "textual-criticism", "giants", "manuscript"],
    people: ["Goliath", "David", "Josephus"],
    civilisations: ["Ancient Israel", "Philistines"],
    locationName: "The Valley of Elah, Levant",
    lat: 31.69,
    lng: 34.96,
    claims: [
      {
        sourceKey: "4qsama",
        startYear: -49,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "4QSamuel-a, mid first century BCE, reading 'four cubits and a span' — about 2.06 m",
        datingMethod: "stylistic_comparison",
        chronology: "archaeological",
        temporalClaimType: "absolute_date",
        whatIsDated: "The oldest surviving Hebrew manuscript of the verse, and the shorter reading it carries",
        evidence:
          "WHAT IS DATED: the manuscript. DATING METHOD: palaeography. WHAT IT ESTABLISHES: that a Hebrew text " +
          "reading 'four cubits and a span' existed in the mid first century BCE — about a thousand years before " +
          "the earliest complete Masoretic manuscripts — and that it agrees with the Septuagint and Josephus " +
          "against the later Hebrew tradition. WHAT IT DOES NOT ESTABLISH: Goliath's height. It establishes what " +
          "the oldest surviving copy says his height was.",
        notes:
          "TEXT CRITICS GENERALLY PREFER THIS READING, on the reasoning that a defeated champion grows in the " +
          "retelling rather than shrinking. That is an argument about how texts change, and it is recorded as an " +
          "argument rather than as a finding.\n\n" +
          "Two metres and six centimetres is still remarkable. The disagreement is about degree.",
        citations: [
          {
            sourceKey: "hays_jets2005",
            relation: "supports",
            note: "The text-critical case for the shorter reading, with the witnesses on each side.",
          },
          { sourceKey: "1samuel17", relation: "context", note: "The verse itself." },
        ],
      },
      {
        sourceKey: "1samuel17",
        startYear: 935,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Masoretic tradition, reading 'six cubits and a span' — about 2.97 m",
        datingMethod: "historical_record",
        chronology: "religious",
        temporalClaimType: "date_of_first_known_record",
        whatIsDated: "The earliest complete manuscripts of the authoritative Hebrew tradition, and its longer reading",
        evidence:
          "WHAT IS DATED: the surviving complete witnesses of the Masoretic Text, around the tenth century CE. " +
          "DATING METHOD: the historical record of the manuscripts. WHAT IT ESTABLISHES: the reading of the " +
          "tradition that became authoritative, followed by the Vulgate and the Peshitta. WHAT IT DOES NOT " +
          "ESTABLISH: that this reading is later than the other. The manuscripts are later; the READING they carry " +
          "may be older than its surviving copies, which is exactly the difficulty text criticism exists to work " +
          "on.",
        notes:
          "ON THE RECORD BECAUSE IT IS THE READING MOST PEOPLE HAVE MET, and because leaving it off would make the " +
          "shorter reading look uncontested when it is the authoritative Hebrew tradition that carries the longer " +
          "one.\n\n" +
          "NEEDS SOURCE VERIFICATION for the precise date of the earliest complete codices, which was not traced " +
          "to a manuscript catalogue for this entry; the tenth century CE is the figure in general circulation.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

export const GIANTS_HEBREW_LINKS: SeedEventLink[] = [
  {
    from: GIANTS_HEBREW_ANCHOR_SLUG,
    to: "nephilim-genesis",
    relation: "relevant",
    note:
      "COMPARE THESE RECORDS. One has about two thousand teeth, four jawbones and a measured extinction window. " +
      "The other has four verses and no measurements at all. Both are on this timeline, and the difference between " +
      "what can be said about each is the point of putting them side by side.",
  },
  {
    from: "nephilim-genesis",
    to: "watchers-book-of-enoch",
    relation: "relevant",
    note:
      "Related texts and NOT the same story. Genesis has no oath, no Mount Hermon, no named Watchers and no list " +
      "of forbidden teachings. Almost everything people picture comes from the later text.",
  },
  {
    from: "watchers-book-of-enoch",
    to: "book-of-giants",
    relation: "source_of",
    note:
      "The Book of Giants uses the Book of the Watchers, which is what fixes the earlier bound of its date. A " +
      "dependence between two texts is a real dating constraint and is treated as one.",
  },
  {
    from: "goliath-of-gath",
    to: "nephilim-genesis",
    relation: "relevant",
    note:
      "Two kinds of textual disagreement. At Goliath the manuscripts differ about a measurement; at the Nephilim " +
      "they agree about the words and readers differ about what they mean.",
  },
];
