import { agoFrom } from "./time";
import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

// ATLANTIS — TWELVE DATES, NONE OF THEM THIS TIMELINE'S.
//
// This is the hardest kind of record this feature has to hold, and the reason
// the feature exists. A timeline that files Atlantis under "history" has told a
// reader something no evidence supports. A timeline that files it under "myth"
// and moves on has also decided something — quietly, on the reader's behalf,
// without showing them what anybody actually claimed or why.
//
// So this dataset does neither. It records WHO SAID WHAT, WHEN THEY SAID IT,
// WHAT THEY WERE WORKING FROM, and — the part that matters most here — WHETHER
// THE DATE IS IN THE SOURCE AT ALL.
//
// THE DISTINCTION THIS DATASET IS BUILT AROUND.
//
//   AN EXPLICIT DATE is in the text. Scott-Elliot writes "9564 B.C." Cayce's
//   readings give "10,014 B.C." You can open the book and find the number.
//
//   A CALCULATED DATE is not. Plato never writes 9600 BCE and could not have:
//   the Egyptian priest tells Solon the events were about nine thousand years
//   earlier, and 9600 BCE is that figure added to a modern estimate of when
//   Solon was in Egypt. Two assumptions, both ours, neither Plato's.
//
//   A REPORTED STATEMENT is weaker still. Gurdjieff is said to have remarked at
//   Lascaux in 1949 that Atlantis was lost seven or eight thousand years ago.
//   That is a recollection of something spoken, dated by arithmetic from the
//   year of the remark, and the record says so rather than printing "6000 BCE"
//   as though he had written it down.
//
// Every claim below carries which of those three it is, in its own words, in
// the "why this date?" field that the card leads with.
//
// WHAT IS NOT HERE. No verdict. The mainstream academic position — that
// classical scholarship and archaeology do not recognise Atlantis as a
// demonstrated prehistoric civilisation, and that many scholars read it as a
// philosophical and political construction of Plato's — is recorded, in full,
// on its own record: "Plato writes the Timaeus and Critias", which is the one
// securely datable thing in this entire story. It is recorded there rather than
// as a rebuttal attached to each claim, because the majority view is a view,
// and this timeline does not settle chronology by counting heads.
//
// Nothing is deleted, hidden or labelled false. What each claim gets instead is
// its source, its date of publication, its method, and the limitation that goes
// with it — which is more use to a reader than a verdict, and is the only thing
// here that is actually ours to supply.
//
// RULES, as in every seed file: nothing invented. Every citation is a real
// publication, checked against its publisher or its archive; a date is quoted
// only where a source was found stating it; where the brief this was written
// from gave a figure that could not be verified, the verified figure is used
// and the difference is recorded in the claim's notes rather than smoothed
// over. No confidence scores.

/** Astronomical year numbering: 1 BCE = 0, 2 BCE = −1. See time.ts. */
const bce = (year: number): number => 1 - year;

export const ATLANTIS_ANCHOR_SLUG = "atlantis-destruction";

export const ATLANTIS_TRACK: SeedTrack = {
  name: "Atlantis",
  slug: "atlantis",
  kind: "theme",
  color: "#3f6fa8",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const ATLANTIS_SOURCES: SeedSource[] = [
  {
    key: "plato_timaeus",
    title: "Timaeus",
    author: "Plato",
    reference: "23d–25d (Stephanus pagination)",
    sourceType: "primary",
    publishedDisplay: "c. 360 BCE",
    notes:
      "The first of the two dialogues the whole story comes from. Cited for what the text actually says: Egyptian priests at Sais tell Solon of events about nine thousand years earlier. No date in our reckoning appears anywhere in it.",
  },
  {
    key: "plato_critias",
    title: "Critias",
    author: "Plato",
    reference: "108e–121c (Stephanus pagination)",
    url: "https://www.gutenberg.org/files/1571/1571-h/1571-h.htm",
    sourceType: "primary",
    publishedDisplay: "c. 360 BCE",
    notes: "The unfinished second dialogue, which describes the island, its kings and its constitution. It breaks off mid-sentence.",
  },
  {
    key: "britannica_atlantis",
    title: "Atlantis",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/topic/Atlantis-legendary-island",
    sourceType: "encyclopedia",
    notes:
      "Cited for the summary of what the dialogues contain, and for the mainstream reading of them. A reference work is the right kind of source for 'what is generally held', and the wrong kind for any of the dates below.",
  },
  {
    key: "britannica_timaeus",
    title: "Timaeus, dialogue by Plato",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/topic/Timaeus-dialogue-by-Plato",
    sourceType: "encyclopedia",
    notes: "Cited for the conventional dating of the dialogue's composition.",
  },
  {
    key: "britannica_solon",
    title: "Solon",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/biography/Solon",
    sourceType: "encyclopedia",
    notes:
      "Cited for the one number the famous 9600 BCE calculation actually rests on: Solon's archonship at Athens around 594 BCE, and his journey to Egypt after it.",
  },
  {
    key: "donnelly1882",
    title: "Atlantis: The Antediluvian World",
    author: "Ignatius Donnelly",
    url: "https://www.gutenberg.org/ebooks/4032",
    sourceType: "book",
    publishedYear: 1882,
    notes:
      "The book that made Atlantis a modern subject. Donnelly argues Plato's account is history and that the world's civilisations descend from it. Cited for his position, and for the fact that his chronology is Plato's rather than his own.",
  },
  {
    key: "scott_elliot1896",
    title: "The Story of Atlantis",
    author: "W. Scott-Elliot",
    url: "https://www.gutenberg.org/files/21796/21796-h/21796-h.htm",
    sourceType: "book",
    publishedYear: 1896,
    notes:
      "A Theosophical account, written from what its author describes as clairvoyant investigation of Akashic records. Cited for an explicit date: the final island, Poseidonis, submerged in 9564 B.C.",
  },
  {
    key: "cayce_readings",
    title: "The Edgar Cayce readings — Atlantis (the 364 series)",
    author: "Edgar Cayce",
    publisher: "Association for Research and Enlightenment",
    reference: "Readings 364-1 onwards, from 3 February 1932",
    url: "https://edgarcayce.org/edgar-cayce/readings/ancient-mysteries/",
    sourceType: "primary",
    publishedDisplay: "1923–1944",
    notes:
      "Transcripts of readings Cayce gave in trance. A primary source for what Cayce said, which is a different thing from a source for what happened — the readings are the evidence for the claim, and there is no other.",
  },
  {
    key: "steiner_cosmic_memory",
    title: "Cosmic Memory: Atlantis and Lemuria (GA 11)",
    author: "Rudolf Steiner",
    publisher: "Rudolf Steiner Archive",
    url: "https://rsarchive.org/Books/GA011/English/RSPI1959/GA011_index.html",
    sourceType: "primary",
    publishedDisplay: "essays of 1904–1908",
    notes:
      "Steiner's own account of an Atlantean age, written from what he describes as reading the Akashic record. Cited for the account; the date below comes from the anthroposophical chronology built on it, not from this text.",
  },
  {
    key: "steiner_ga95",
    title: "The Post-Atlantean Culture-Epochs",
    author: "Rudolf Steiner",
    workTitle: "At the Gates of Spiritual Science (GA 95)",
    reference: "Lecture 11, Stuttgart, 1 September 1906",
    url: "https://rsarchive.org/Lectures/GateSpiSci/19060901p01.html",
    sourceType: "primary",
    publishedDisplay: "lecture of 1 September 1906",
    notes:
      "Steiner's own lecture on the scheme the 7227 BC figure is produced by: seven post-Atlantean culture-epochs following the Atlantean flood. Cited for the scheme, which is his; the 7227 BC number is not in it.",
  },
  {
    key: "steiner_ga124",
    title: "The Tasks of the Fifth Post-Atlantean Epoch",
    author: "Rudolf Steiner",
    workTitle: "Background to the Gospel of St. Mark (GA 124)",
    reference: "Lecture 3, Berlin, 7 November 1910",
    url: "https://rsarchive.org/Lectures/GA124/English/RSP1985/19101107p02.html",
    sourceType: "primary",
    publishedDisplay: "lecture of 7 November 1910",
    notes:
      "One of the lectures in which Steiner gives the epoch boundaries the chronology is counted back from — the Graeco-Roman epoch running from 747 B.C. to 1413 A.D., and the fifth epoch beginning there.",
  },
  {
    key: "steiner_theosophy_history",
    title: "Rudolf Steiner: From Theosophy to Anthroposophy (1902–1913)",
    publisher: "PhilPapers",
    url: "https://philpapers.org/archive/PAURSF.pdf",
    sourceType: "academic_paper",
    notes:
      "An academic account of the eleven years Steiner spent inside the Theosophical Society before founding the Anthroposophical Society. Cited for the lineage between two of the claims on this record, not for any date in them.",
  },
  {
    key: "anthrowiki_epochs",
    title: "Cultural epochs",
    publisher: "AnthroWiki",
    url: "https://en.anthro.wiki/Cultural_epochs",
    sourceType: "encyclopedia",
    notes:
      "A reference work of the anthroposophical movement, cited for the chronology that movement uses: the post-Atlantean age beginning in 7227 BC with the sinking of Atlantis. Tertiary, and named as such.",
  },
  {
    key: "gurdjieff_beelzebub",
    title: "Beelzebub's Tales to His Grandson",
    author: "G. I. Gurdjieff",
    sourceType: "book",
    publishedYear: 1950,
    notes:
      "Gurdjieff's long allegorical work, which discusses Atlantis and the society of the Akhaldans at length. Cited for the account — and explicitly NOT for a date, because no date in our reckoning is given in it.",
  },
  {
    key: "gurdjieff_journal_lascaux",
    title: "Gurdjieff at Lascaux, August 1949",
    publisher: "The Gurdjieff Journal",
    url: "https://gurdjiefflegacy.org/40articles/lascaux.htm",
    sourceType: "secondary",
    notes:
      "An account of Gurdjieff's visit to the Lascaux caves a few months before his death, reporting his remark that the cave's makers belonged to a brotherhood surviving from an Atlantis lost seven or eight thousand years earlier. A report of something said, recorded later.",
  },
  {
    key: "rasmussen2014",
    title:
      "A stratigraphic framework for abrupt climatic changes during the last glacial period based on three synchronized Greenland ice-core records: refining and extending the INTIMATE event stratigraphy",
    author: "Sune O. Rasmussen and colleagues",
    workTitle: "Quaternary Science Reviews",
    reference: "106, 14–28",
    sourceType: "academic_paper",
    publishedYear: 2014,
    notes: "The ice-core stratigraphy the Younger Dryas boundaries are dated from. Cited for the climate event, not for anything about Atlantis.",
  },
  {
    key: "britannica_younger_dryas",
    title: "Younger Dryas",
    publisher: "Encyclopædia Britannica",
    url: "https://www.britannica.com/science/Younger-Dryas-climate-interval",
    sourceType: "encyclopedia",
    notes: "Cited for the conventional span of the Younger Dryas, about 12,900 to 11,700 years ago.",
  },
  {
    key: "leiden_quest",
    title: "Quest for Atlantis: the search for archaeological evidence of a legend",
    publisher: "Leiden University Scholarly Publications",
    url: "https://scholarlypublications.universiteitleiden.nl/access/item:3180875/view",
    sourceType: "academic_book",
    notes:
      "An academic survey of Atlantis identifications, cited for the Minoan and Thera hypotheses and for Galanopoulos's factor-of-ten argument — including the fact that the argument has been rejected by other scholars.",
  },
  {
    key: "atlantipedia_galanopoulos",
    title: "Galanopoulos, Angelos",
    publisher: "Atlantipedia",
    url: "https://atlantipedia.ie/samples/galanopoulos-angelos/",
    sourceType: "encyclopedia",
    notes:
      "A specialist reference work on Atlantis literature, cited for the detail of Galanopoulos's argument: that an Egyptian numeral for 100 was read as 1000, dividing every figure in Plato by ten.",
  },
];

// ---------------------------------------------------------------------------
// The events
// ---------------------------------------------------------------------------

export const ATLANTIS_EVENTS: SeedEvent[] = [
  {
    slug: ATLANTIS_ANCHOR_SLUG,
    title: "Atlantis / Destruction of Atlantis",
    summary: "Twelve proposed dates, two hundred thousand years apart, and no archaeological record of any of them.",
    description:
      "Atlantis is an island or continent described most famously by Plato in the Timaeus and the Critias. Later writers, esoteric traditions and modern researchers have proposed very different dates for its existence and destruction, and the proposals on this record span more than two hundred thousand years.\n\n" +
      "WHAT THIS RECORD IS AND IS NOT. It is a record of what people have claimed and what they were working from. It is not a finding that Atlantis existed, and it is not a finding that it did not. Mainstream classical scholarship and archaeology do not recognise Atlantis as a demonstrated prehistoric civilisation matching Plato's description, and many scholars read the account as a philosophical and political construction of Plato's own; that position is set out in full on its own record — \"Plato writes the Timaeus and Critias\" — rather than attached to each claim here as a rebuttal.\n\n" +
      "THE THING TO WATCH ON THIS PAGE is not which date is right. It is what KIND of date each one is:\n\n" +
      "• EXPLICIT — the number is in the text. Scott-Elliot writes 9564 B.C.; the Cayce readings give 10,014 B.C. You can go and find it.\n\n" +
      "• CALCULATED — the number is not in the text and has been worked out from it. Plato never writes 9600 BCE and could not have: the priest tells Solon the events were about nine thousand years earlier, and 9600 BCE is that figure added to a modern estimate of when Solon was in Egypt. The assumptions are ours.\n\n" +
      "• REPORTED — somebody remembers somebody saying it. Gurdjieff's Atlantis date exists only as a recollection of a remark at Lascaux in 1949, converted into a year by subtraction.\n\n" +
      "A reader who leaves this page knowing which of its twelve dates are actually written down anywhere has learnt the thing this timeline is for.",
    category: "culture",
    subcategory: "Contested chronology",
    eventType: "disputed",
    eventTypeNote:
      "Filed as disputed because the sources genuinely disagree — not as a judgement on any of them. Several of these claims come from traditions that do not present themselves as archaeology and should not be read as though they did.",
    tags: ["atlantis", "plato", "solon", "contested-chronology", "esoteric", "younger-dryas", "thera"],
    people: ["Plato", "Solon", "Ignatius Donnelly", "W. Scott-Elliot", "Edgar Cayce", "Rudolf Steiner", "G. I. Gurdjieff", "Angelos Galanopoulos"],
    civilisations: ["Ancient Greece", "Ancient Egypt", "Minoan civilisation"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Atlantis_Kircher_Mundus_subterraneus_1678.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Atlantis_Kircher_Mundus_subterraneus_1678.jpg?width=1024",
        shows: "later_artwork",
        caption:
          "Athanasius Kircher's map of Atlantis, from Mundus Subterraneus, published about two thousand years " +
          "after Plato wrote. NOTE WHICH WAY UP IT IS: south is at the top, which is a convention of the " +
          "engraving and not a claim about the ocean. Kircher drew a continent from a dialogue; no survey, no " +
          "soundings, no source but the text.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Hon._Ignatius_Donnelly,_Minn.jpg?width=1024",
        shows: "portrait",
        caption:
          "Ignatius Donnelly, photographed by the Mathew Brady studio. His 1882 book is the reason " +
          "Atlantis-as-a-real-place is the alternative reading most people have already met, which is why his " +
          "claim on this record is marked a WIDELY-HELD alternative \u2014 a statement about how far an idea " +
          "travelled, and not about how well it is supported.",
        kind: "image",
        creditFrom: "source",
      },
    ],
    claims: [
      // --- The esoteric chronologies, oldest first -------------------------
      {
        sourceKey: "cayce_readings",
        startYear: bce(210_000),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "about 210,000 B.C.",
        datingMethod: "source_assertion",
        chronology: "alternative",
        evidence:
          "WHAT THE SOURCE SAYS: the Cayce readings describe an Atlantean civilisation beginning around 210,000 B.C. and running through several ages and three destructions rather than one. EVIDENCE TYPE: a trance reading — an assertion, with no working shown and nothing external it is derived from. LIMITATION: there is no archaeological, geological or documentary evidence of a civilisation at this date, and none is offered.",
        notes:
          "Recorded as an esoteric claim, which is what it is. The brief this dataset was written from gave 200,000 BCE; the figure found in accounts of the readings is 210,000 B.C., so that is what is stored.",
      },
      {
        sourceKey: "cayce_readings",
        startYear: bce(50_700),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "50,700 B.C.",
        datingMethod: "source_assertion",
        chronology: "alternative",
        evidence:
          "WHAT THE SOURCE SAYS: the first of three destructions in the Cayce chronology, after which the land begins to break up. EVIDENCE TYPE: trance reading. LIMITATION: as above — this is a record of what was said in the readings, not of anything found.",
        notes:
          "The brief gave a second Cayce destruction at 15,600 BCE. No source stating that figure could be found; the readings' three destructions are reported as 50,700 B.C., 28,000 B.C. and about 10,000 B.C., and those are the three stored here. The 15,600 figure is omitted rather than guessed at.",
      },
      {
        sourceKey: "cayce_readings",
        startYear: bce(28_000),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "28,000 B.C.",
        datingMethod: "source_assertion",
        chronology: "alternative",
        evidence:
          "WHAT THE SOURCE SAYS: the second destruction, which in this chronology breaks the continent into islands. EVIDENCE TYPE: trance reading. LIMITATION: nothing outside the readings supports or dates it.",
      },
      {
        sourceKey: "cayce_readings",
        startYear: bce(10_014),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "10,014 B.C.",
        datingMethod: "source_assertion",
        chronology: "alternative",
        evidence:
          "WHAT THE SOURCE SAYS: the final destruction, in which the last Atlantean islands go under. EVIDENCE TYPE: trance reading. LIMITATION: the precision is the source's own — this is stored as an exact year because the readings give one, not because anything makes it exact.",
        notes:
          "Often quoted in round form as about 10,000 B.C. Both are the same claim; the precise figure is kept because rounding a source's own number is a small edit that makes the record less checkable.",
      },
      {
        sourceKey: "scott_elliot1896",
        startYear: bce(9564),
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "9564 B.C.",
        datingMethod: "source_assertion",
        chronology: "alternative",
        evidence:
          "WHAT THE SOURCE SAYS: in the Theosophical account, Atlantis is destroyed in stages; the last remaining island, Poseidonis, is submerged in the fourth and final catastrophe of 9564 B.C. EVIDENCE TYPE: an explicit date, stated in a published book, arrived at by what the author describes as clairvoyant investigation of Akashic records. LIMITATION: the method is not one that can be checked by anybody else, which is a fact about it rather than a verdict on it.",
        notes:
          "Worth setting beside Plato's calculated ~9600 BCE, thirty-six years away. Scott-Elliot was writing after Donnelly and within a tradition that already took Plato's chronology seriously; the closeness is not independent agreement.\n\n" +
          "It runs forward as well as back. Rudolf Steiner joined the Theosophical Society six years after this book and led its German Section for a decade, so the anthroposophical 7227 BC further down this record belongs to the same lineage — three esoteric dates on this page, one tradition.",
      },
      {
        sourceKey: "steiner_ga124",
        startYear: bce(7227),
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "counted back from 747 B.C. in epochs of about 2,160 years",
        datingMethod: "textual_interpretation",
        chronology: "alternative",
        evidence:
          "WHAT STEINER ACTUALLY GIVES: not a date for Atlantis, but a scheme. Seven post-Atlantean culture-epochs follow the Atlantean flood, each of about 2,160 years, and he states two of their boundaries in his own lectures — the Graeco-Roman epoch running from 747 B.C. to 1413 A.D. " +
          "HOW 7227 BC IS REACHED: by counting back from 747 B.C. in steps of 2,160 years. Egypto-Chaldean begins 2907 BC, Ancient Persian 5067 BC, Ancient Indian 7227 BC — and the start of the first epoch is the end of Atlantis. " +
          "EVIDENCE TYPE: arithmetic on a figure inside an esoteric scheme. The 2,160 years is one twelfth of the precession of the equinoxes, so the whole ladder is astronomical periodicity rather than anything observed about a place. " +
          "LIMITATION: 7227 BC is a CALCULATED date, in exactly the sense Plato's 9600 BCE is. Steiner does not write it about Atlantis, and a reader who meets it as \"Steiner's date for Atlantis\" has been told something the sources do not support.",
        notes:
          "TWO CORRECTIONS ARE RECORDED HERE RATHER THAN SMOOTHED AWAY. The brief this dataset was written from placed Steiner's Atlantis at about 10,000 BCE; the figure the anthroposophical literature actually carries is 7227 BC, nearly three thousand years later. And the figure is not an assertion but a subtraction — which is why this claim is filed as a calculated date and not, as it first was, as a source simply stating one.\n\n" +
          "NOT AN INDEPENDENT WITNESS. Steiner was General Secretary of the German Section of the Theosophical Society from October 1902 until the Anthroposophical Society was founded in December 1912, and W. Scott-Elliot's Theosophical Atlantis — 9564 B.C., also on this record — was published in 1896, within the tradition Steiner then spent eleven years inside. The two esoteric chronologies here are one lineage, not two accounts agreeing.",
        citations: [
          {
            sourceKey: "steiner_ga95",
            relation: "supports",
            note: "Steiner's lecture on the post-Atlantean culture-epochs — the scheme the arithmetic runs on, in his own words.",
          },
          {
            sourceKey: "anthrowiki_epochs",
            relation: "supports",
            note: "The anthroposophical reference work that carries the completed chronology, including the 7227 BC figure and the epoch dates back to it.",
          },
          {
            sourceKey: "steiner_cosmic_memory",
            relation: "context",
            note: "Steiner's own account of the Atlantean age, written 1904–1908. No date in our reckoning appears in it.",
          },
          {
            sourceKey: "steiner_theosophy_history",
            relation: "context",
            note: "The eleven years Steiner spent in the Theosophical Society, which is why his Atlantis and Scott-Elliot's are the same lineage rather than two sources agreeing.",
          },
        ],
      },
      // --- Plato, and everything derived from Plato ------------------------
      {
        sourceKey: "plato_timaeus",
        startYear: bce(9600),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "about 9,000 years before Solon",
        datingMethod: "textual_interpretation",
        chronology: "historical",
        evidence:
          "WHAT THE SOURCE SAYS: Egyptian priests at Sais tell Solon that the events happened about nine thousand years earlier. That is the whole of it. No year, no era, no calendar. HOW ~9600 BCE IS REACHED: nine thousand years is added to a modern estimate of when Solon was in Egypt — his archonship at Athens is conventionally placed around 594 BCE and the journey shortly after — giving roughly 9600 BCE. EVIDENCE TYPE: ancient textual testimony, reported at third hand within the dialogue itself: priests to Solon, Solon to a family, the family to Critias. LIMITATION: no archaeological evidence establishes a civilisation matching Plato's description at this or any date.",
        notes:
          "THE MOST IMPORTANT CLAIM ON THIS PAGE TO READ CAREFULLY. Plato does not write 9600 BCE. Every later source that gives that date is either repeating this calculation or making it again. Stored at century precision because the source's own figure is round to the nearest thousand and inventing a year would be inventing precision.",
        citations: [
          { sourceKey: "plato_critias", relation: "supports", note: "The second dialogue, which describes the island itself and then breaks off unfinished." },
          { sourceKey: "britannica_solon", relation: "context", note: "The conventional dating of Solon — the only number in the 9600 BCE calculation that is not Plato's." },
          { sourceKey: "britannica_atlantis", relation: "context", note: "A summary of what the dialogues contain and of how classical scholarship reads them." },
        ],
      },
      {
        sourceKey: "donnelly1882",
        startYear: bce(9600),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "Plato's chronology, taken substantially at its word",
        datingMethod: "textual_interpretation",
        chronology: "alternative_widespread",
        evidence:
          "WHAT THE SOURCE SAYS: Donnelly argues that Plato's Atlantis was a real prehistoric civilisation, the origin of the world's later cultures, and treats the dialogues' chronology substantially literally. EVIDENCE TYPE: an argument from comparative mythology, language and geology as understood in 1882. LIMITATION: the date is not independent evidence. It is Plato's figure, carried across.",
        notes:
          "Recorded as a separate claim rather than folded into Plato's because it is a separate assertion — that the chronology should be believed — made by a different person for different reasons, and it is the assertion, not the number, that made Atlantis a modern subject.",
      },
      {
        sourceKey: "britannica_younger_dryas",
        startYear: bce(10_900),
        endYear: bce(9600),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Younger Dryas, about 12,900 to 11,700 years ago",
        datingMethod: "radiometric",
        chronology: "hypothesis",
        evidence:
          "WHAT IS ACTUALLY DATED: the Younger Dryas, a sharp cold interval at the end of the last glaciation, dated from Greenland ice-core layers to about 12,900–11,700 years before present. That much is measured and is not in dispute. THE PROPOSED CORRELATION: some modern alternative-history writers connect traditions of lost civilisations and catastrophic flooding with this interval, and note that the conventional ~9600 BCE calculation from Plato falls close to its end. EVIDENCE TYPE: a proposed correlation between a well-dated climate event and an undated story. LIMITATION: a coincidence of dates is not evidence of a connection, and no archaeology has established a civilisation of Plato's description in this interval.",
        notes:
          "Seeded as a correlation and labelled one. The climate event is real and well dated; what is proposed is that it lies behind the story, and that proposal is what is recorded here. Different writers give different versions of it; only the shared claim is stored, because merging their individual arguments into one would misrepresent all of them.",
        citations: [
          {
            sourceKey: "rasmussen2014",
            relation: "supports",
            note: "The Greenland ice-core stratigraphy the Younger Dryas boundaries are dated from — evidence for the climate event, and for nothing else on this record.",
          },
        ],
      },
      // --- The reported remark ---------------------------------------------
      {
        sourceKey: "gurdjieff_journal_lascaux",
        // agoFrom rather than bce(): the figure is "seven or eight thousand
        // years ago" said in 1949, and a subtraction produces an astronomical
        // year while bce() takes a BCE one. They are off by one, because there
        // is no year zero — the hand-computed values here were bce(6050) and
        // bce(5050), which are 1949 minus 7,999 and 1949 minus 6,999.
        startYear: agoFrom(1949, 8000),
        endYear: agoFrom(1949, 7000),
        dateConvention: "years_ago",
        conventionReferenceYear: 1949,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "seven or eight thousand years ago (said in 1949)",
        datingMethod: "estimate",
        chronology: "alternative",
        evidence:
          "WHAT THE SOURCE REPORTS: that on a visit to the Lascaux caves in August 1949, a few months before his death, Gurdjieff said the cave's makers belonged to a brotherhood that survived an Atlantis lost seven or eight thousand years earlier. HOW THE DATE IS REACHED: 1949 minus seven to eight thousand years, giving roughly 6050–5050 BCE. EVIDENCE TYPE: a later recollection of an oral statement. LIMITATION: this is substantially weaker dating evidence than a date printed in a book. It is a remembered remark, converted into a year by subtraction, and both the remembering and the subtraction are ours.",
        notes:
          "THIS MUST NOT BE READ AS THOUGH GURDJIEFF WROTE \"6000 BCE\". He did not. The range is stored rather than a year precisely because the reported wording is \"seven or eight thousand\", and a single year would be a precision nobody claimed.",
        citations: [
          {
            sourceKey: "gurdjieff_beelzebub",
            relation: "context",
            note:
              "Gurdjieff's own written treatment of Atlantis and the Akhaldans, at length — and with no date in our reckoning anywhere in it, which is why this record's date comes from the reported remark instead.",
          },
        ],
      },
      // --- The naturalistic readings ---------------------------------------
      {
        sourceKey: "leiden_quest",
        startYear: bce(1700),
        endYear: bce(1200),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "the Late Bronze Age Aegean",
        datingMethod: "archaeological",
        chronology: "hypothesis",
        evidence:
          "WHAT IS PROPOSED: that Plato's story preserves a memory of a Bronze Age Aegean civilisation and its destruction — most often Minoan Crete and the eruption of Thera. Spyridon Marinatos argued in Antiquity in 1939 that the Thera eruption destroyed Minoan Crete; the editors would not let him mention Atlantis. EVIDENCE TYPE: archaeology and vulcanology of a real, excavated, independently dated civilisation, proposed as the source of a story. LIMITATION: this is an identification, not a discovery. Crete is not in the Atlantic, is not larger than Asia and Libya combined, and was not destroyed nine thousand years before Solon — so the proposal requires Plato to be substantially wrong about the location, the size and the date.",
        notes:
          "Seeded as one claim covering the family of Bronze Age identifications, deliberately without merging the individual researchers' arguments, which differ. A specific researcher's version belongs here as its own claim, with their own dates and reasoning, rather than inside this one.",
      },
      {
        sourceKey: "atlantipedia_galanopoulos",
        startYear: bce(1500),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "about 900 years before Solon",
        datingMethod: "textual_interpretation",
        chronology: "alternative",
        evidence:
          "WHAT IS PROPOSED: Angelos Galanopoulos argued that an Egyptian numeral for 100 had been read as 1,000, so that every figure in Plato's account is ten times too large. Nine thousand years before Solon becomes nine hundred — about 1500 BCE, which is close to the eruption of Thera. HOW THE DATE IS REACHED: arithmetic on Plato's figure, under that assumption. EVIDENCE TYPE: a proposed textual and numerical error. LIMITATION: other scholars have rejected the argument, and it requires the same error to have been made consistently through the text rather than once.",
        notes:
          "The brief this dataset was written from suggested about 1200 BCE for this kind of reinterpretation. Galanopoulos's own arithmetic gives about 1500 BCE, so that is what is stored and attributed to him; 1200 BCE is not assigned to anybody, because no source stating it was found.",
        citations: [
          {
            sourceKey: "leiden_quest",
            relation: "disputes",
            note: "An academic survey noting that the factor-of-ten argument has been rejected by other scholars.",
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // The mainstream position, on the one thing here that can actually be dated
  // -------------------------------------------------------------------------
  {
    slug: "plato-timaeus-critias",
    title: "Plato writes the Timaeus and Critias",
    summary: "The only securely datable event in the Atlantis story — and, on the mainstream reading, the whole of it.",
    description:
      "Everything anybody knows about Atlantis comes from two dialogues Plato wrote in Athens in the middle of the fourth century BCE. There is no earlier mention of it anywhere: not in Herodotus, not in Egyptian records, not in any source Plato's contemporaries could have checked.\n\n" +
      "THE MAINSTREAM ACADEMIC POSITION, stated plainly because it is a position and deserves to be readable as one. Classical scholarship and archaeology do not currently recognise Atlantis as a demonstrated prehistoric civilisation matching Plato's description. Many scholars read the account as a literary, philosophical and political construction: an ideal Athens set against an overreaching imperial power, written by a philosopher who used invented histories elsewhere, in a dialogue that is explicitly about making a city in speech, and left unfinished mid-sentence.\n\n" +
      "WHAT THAT POSITION IS NOT. It is not a finding that nothing happened. It is a statement about what the evidence currently supports, made by the discipline whose subject this is — and on this timeline it does not delete, hide or overrule the other claims. Those remain on the Atlantis record with their sources, their methods and their limitations, where a reader can weigh them.\n\n" +
      "This record exists so that the majority view has somewhere to be said in full, attached to a date that is actually known, instead of being turned into a thirteenth Atlantis date it does not claim to have.",
    category: "culture",
    subcategory: "Classical literature",
    eventType: "mainstream",
    eventTypeNote:
      "The generally accepted account in current scholarship. That does not make it unquestionably true; it makes it the broadly accepted reading today, which is a different and more useful thing to know.",
    tags: ["atlantis", "plato", "solon", "classical-greece", "contested-chronology"],
    people: ["Plato", "Solon", "Critias"],
    civilisations: ["Ancient Greece", "Ancient Egypt"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Plato_Silanion_Musei_Capitolini_MC1377.png?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Plato_Silanion_Musei_Capitolini_MC1377.png?width=1024",
        shows: "artefact",
        caption:
          "A Roman copy of a portrait of Plato, after an original attributed to Silanion made for the Academy. " +
          "Every ancient portrait of Plato is a copy of a copy, and this is a picture of the writer rather than " +
          "evidence about what he wrote.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "britannica_timaeus",
        startYear: bce(360),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "c. 360 BCE",
        datingMethod: "estimate",
        chronology: "conventional",
        evidence:
          "The conventional dating of the two dialogues to Plato's later working life, placed by scholars from their style, their subject matter and their relationship to his other works. This is a scholarly estimate rather than a recorded date — nothing survives saying when they were written.",
        notes: "The one date in this story that rests on ordinary historical method rather than on a reading, a calculation from a figure inside the text, or a remembered remark.",
        citations: [
          { sourceKey: "plato_timaeus", relation: "supports", note: "The dialogue itself." },
          { sourceKey: "plato_critias", relation: "supports", note: "Its unfinished sequel, which breaks off mid-sentence." },
          {
            sourceKey: "britannica_atlantis",
            relation: "context",
            note: "How classical scholarship reads the Atlantis passages: as a philosophical and political construction rather than a report.",
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // The anchor the whole 9600 BCE calculation hangs on
  // -------------------------------------------------------------------------
  {
    slug: "solon-visit-egypt",
    title: "Solon's journey to Egypt",
    summary: "The date the famous ~9600 BCE is counted back from — and it is an estimate, not a record.",
    description:
      "Plato has Egyptian priests at Sais tell Solon that Atlantis was destroyed about nine thousand years earlier. Turning that into a date in our reckoning needs one more number: when Solon was in Egypt.\n\n" +
      "That number is an estimate. Solon's archonship at Athens is conventionally placed around 594 BCE, and his travels are placed shortly after it — but the journey itself is known from later tradition rather than from any contemporary record, and some scholars doubt it happened at all.\n\n" +
      "IT IS SEEDED AS ITS OWN RECORD SO THE ARITHMETIC IS INSPECTABLE. \"Atlantis, 9600 BCE\" is one number that looks like a fact. Nine thousand years — a round figure, in a story reported at third hand — added to about 600 BCE, which is a conventional estimate for an episode in a statesman's life, is two uncertain quantities and a sum. A reader who can see both halves can decide for themselves what the total is worth.",
    category: "history",
    subcategory: "Archaic Greece",
    eventType: "historical",
    tags: ["atlantis", "solon", "plato", "ancient-egypt", "sais", "contested-chronology"],
    people: ["Solon"],
    civilisations: ["Ancient Greece", "Ancient Egypt"],
    locationName: "Sais, Egypt",
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Athanasius_Kircher's_Atlantis.gif?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Athanasius_Kircher's_Atlantis.gif?width=1024",
        shows: "later_artwork",
        caption:
          "Kircher's Atlantis again, in the form most often reproduced. It is shown here because the journey to " +
          "Sais is known ONLY from Plato's own framing of the story \u2014 there is no Egyptian record of it \u2014 and " +
          "what illustrates that record is the tradition of drawing, not a document.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "britannica_solon",
        startYear: bce(594),
        endYear: bce(584),
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "archon around 594 BCE, and afterwards a journey to Egypt",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "Solon's archonship at Athens is conventionally dated to about 594 BCE, and the sources say he left on a journey to Egypt after completing his reforms, intending to be away ten years. The range here covers that decade rather than asserting a year.",
        notes:
          "This is the second of the two numbers in the ~9600 BCE calculation, and the less often examined. The nine thousand years gets the attention; this one is usually left as a round 600 BCE and forgotten.",
        citations: [
          {
            sourceKey: "plato_timaeus",
            relation: "context",
            note: "The dialogue in which the visit and the nine thousand years are reported — the only source connecting Solon to Atlantis at all.",
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// How these three records relate
//
// Sparse on purpose. An edge is worth having when it says something a reader
// could not get from the dates — that this record supplies the other's
// material, or answers it, or is the mainstream reading of it. Edges that only
// restate "these are both about Atlantis" would be noise.
// ---------------------------------------------------------------------------

export const ATLANTIS_LINKS: SeedEventLink[] = [
  {
    from: "solon-visit-egypt",
    to: "plato-timaeus-critias",
    relation: "source_of",
    sourceKey: "plato_timaeus",
    note:
      "The journey is where the dialogues say the story comes from — priests to Solon, Solon to a family, the family to Critias. It is also the second number in the ~9600 BCE calculation.",
  },
  {
    from: "plato-timaeus-critias",
    to: "atlantis-destruction",
    relation: "source_of",
    sourceKey: "plato_timaeus",
    note: "Everything anybody knows about Atlantis is in these two dialogues. There is no earlier mention of it anywhere.",
  },
  {
    from: "plato-timaeus-critias",
    to: "atlantis-destruction",
    relation: "responds_to",
    viewpoint: "conventional",
    sourceKey: "britannica_atlantis",
    note:
      "On the mainstream reading the dialogues are not a report of the events but the whole of them — a philosophical and political construction rather than a source about a place.",
  },
];
