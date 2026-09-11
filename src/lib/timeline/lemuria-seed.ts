import { astronomicalFromYearsAgo } from "./time";
import type { SeedEvent, SeedSource, SeedTrack } from "./seed-types";

// LEMURIA — THE DATASET WITH TWO CLOCKS RUNNING.
//
// Every record in this file has two dates, and they are hundreds of thousands
// of times apart:
//
//   WHEN SOMEBODY SAID IT.    Sclater, 1864. Blavatsky, 1888. Scott-Elliot,
//                             1904. Churchward, 1926. All real, all checkable,
//                             all within the last hundred and sixty years.
//
//   WHEN THEY SAY IT HAPPENED. 34½ million years ago. 18 million years ago.
//                             The Permian. 12,600 years ago.
//
// Those are different facts and this dataset keeps them on different records.
// The publication dates go on "history of the idea" events, which sit in a
// cluster at the right-hand end of the strip. The claimed prehistoric dates go
// on the deep-time records, tens of millions of years to the left. A reader who
// zooms out far enough to see the claims cannot see the claimants, and that is
// the most useful single thing this entry teaches: the whole of Lemuria's
// history as an idea fits inside a century and a half, and every date in it is
// about a time nobody in it could possibly have witnessed.
//
// WHAT LEMURIA ACTUALLY WAS, TO BEGIN WITH. A zoologist's hypothesis. Philip
// Sclater noticed that lemurs are abundant in Madagascar, scarce in Africa and
// scarcer in India, and proposed a former land connection to explain it. He was
// not describing a civilisation, a race, a spiritual epoch or a sunken utopia.
// That reading arrived twenty-four years later, from somebody else, for
// entirely different reasons — and the entry says so prominently, because the
// slide from one to the other is the single most misunderstood thing about the
// subject.
//
// AND IT IS NOT A DEBUNKING. Modern geology does not recognise a recently
// sunken Indian Ocean continent of the kind Sclater proposed; plate tectonics
// explains his lemurs without one. That is recorded, in full, on its own
// record. It is a statement about what the evidence supports. It is NOT
// "science proved every Lemuria tradition false", which is a different and
// much larger claim that nobody has established, and this file does not make
// it on anybody's behalf.
//
// MU IS NOT LEMURIA. They have separate origins — an Indian Ocean hypothesis of
// 1864 and a Pacific one published in 1926 — and were merged by later writers
// rather than by either author. They are kept as separate records here, with a
// third recording the merging itself, because the merging is a real and datable
// event in the history of an idea and is more interesting than the merger.
//
// RULES: nothing invented. A date appears only where a source stating it was
// found; where the brief this was written from gave a figure that could not be
// verified, the record says so in those words rather than quietly adopting it.
// No confidence scores, and no "debunked", "proven", "true" or "false" — what
// each claim carries instead is the KIND of evidence behind it.

/** Billions of years ago → astronomical year. */
const Ga = (billions: number): number => astronomicalFromYearsAgo(billions * 1_000_000_000);
/** Millions of years ago → astronomical year. */
const Ma = (millions: number): number => astronomicalFromYearsAgo(millions * 1_000_000);
/** Astronomical year numbering: 1 BCE = 0, 2 BCE = −1. See time.ts. */
const bce = (year: number): number => 1 - year;

export const LEMURIA_ANCHOR_SLUG = "sclater-proposes-lemuria";

export const LEMURIA_TRACK: SeedTrack = {
  name: "Lemuria and Mu",
  slug: "lemuria-and-mu",
  kind: "theme",
  color: "#2f8f6b",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const LEMURIA_SOURCES: SeedSource[] = [
  {
    key: "sclater1864",
    title: "The Mammals of Madagascar",
    author: "Philip Lutley Sclater",
    workTitle: "The Quarterly Journal of Science",
    reference: "Volume 1, pages 213–219, April 1864",
    sourceType: "academic_paper",
    publishedYear: 1864,
    notes:
      "The paper the word comes from. A biogeographical argument about the distribution of lemurs, proposing a former land connection and naming it Lemuria. There is no civilisation in it, no people, and no date for the land's existence beyond the geological.",
  },
  {
    key: "wikipedia_sclater",
    title: "Philip Lutley Sclater — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Philip_Lutley_Sclater",
    sourceType: "wikipedia",
    notes: "An encyclopedia anyone can edit, cited for the publication details of the 1864 paper and for Sclater's work as a zoologist. Follow its references.",
  },
  {
    key: "wikipedia_lemuria",
    title: "Lemuria — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Lemuria",
    sourceType: "wikipedia",
    notes:
      "Cited for the overview of how the term travelled from zoology into esoteric literature, and for the observation that plate tectonics removed the problem the hypothesis was invented to solve.",
  },
  {
    key: "blavatsky_sd",
    title: "The Secret Doctrine, Volume 2: Anthropogenesis",
    author: "Helena Petrovna Blavatsky",
    reference: "Volume 2, Part 1 — the Manus and the Vaivasvata Manvantara",
    url: "https://sacred-texts.com/the/sd/sd2-1-18.htm",
    sourceType: "primary",
    publishedYear: 1888,
    notes:
      "Blavatsky's own text, which is where the Third Root Race and the eighteen-million-year figure come from. Preferred over later Theosophical summaries, which differ from it and from each other.",
  },
  {
    key: "blavatsky_human_evolution",
    title: "Human Evolution in The Secret Doctrine",
    publisher: "Blavatsky Theosophy Group",
    url: "https://blavatskytheosophy.com/human-evolution-in-the-secret-doctrine/",
    sourceType: "website",
    notes:
      "A Theosophical commentary gathering Blavatsky's chronological statements in one place, cited for where the eighteen-million-year figure sits in her scheme — \"the lighting up of Manas\", the beginning of the Vaivasvata humanity.",
  },
  {
    key: "theosophy_wiki_rootrace",
    title: "Root-Race",
    publisher: "Theosophy Wiki",
    url: "https://theosophy.wiki/en/Root-Race",
    sourceType: "encyclopedia",
    notes:
      "A reference work of the Theosophical movement. Cited for the 34½-million-year figure for the start of the Lemurian root race, and for the fact that it is attributed to the tradition generally rather than to a named author.",
  },
  {
    key: "theosophy_world_lemuria",
    title: "Lemuria",
    publisher: "Theosophy World",
    url: "https://www.theosophy.world/encyclopedia/lemuria",
    sourceType: "encyclopedia",
    notes: "The movement's own encyclopedia entry on Lemuria, cited for how the Theosophical account developed after Blavatsky.",
  },
  {
    key: "besant_leadbeater1913",
    title: "Man: Whence, How and Whither",
    author: "Annie Besant and C. W. Leadbeater",
    sourceType: "book",
    publishedYear: 1913,
    notes:
      "The most detailed later Theosophical chronology, written from what its authors describe as clairvoyant investigation. Cited as the place the elaborated root-race dates are worked out — and named here so that later figures are not attributed to Blavatsky by default.",
  },
  {
    key: "scott_elliot_lemuria",
    title: "The Lost Lemuria",
    author: "W. Scott-Elliot",
    url: "https://www.gutenberg.org/ebooks/21796",
    sourceType: "book",
    publishedYear: 1904,
    notes:
      "Scott-Elliot's occult reconstruction of Lemuria, with two maps. Cited for what he actually gives: geological periods — Permian, Triassic, Jurassic, Cretaceous, Eocene — and not years.",
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
      "Steiner's account of a Lemurian age preceding the Atlantean. Cited for the ORDER, which is what he gives. He does not date the Lemurian epoch in years, and this dataset does not supply one for him.",
  },
  {
    key: "cayce_lemuria_readings",
    title: "The Edgar Cayce readings — Lemuria and Mu",
    author: "Edgar Cayce",
    publisher: "Association for Research and Enlightenment",
    reference: "Readings 364-4, 364-13 and 5750-1",
    url: "https://edgarcayce.org/edgar-cayce/readings/ancient-mysteries/",
    sourceType: "primary",
    publishedDisplay: "readings given 1923–1944",
    notes:
      "The readings that mention a lost Pacific land, called Lemuria most often but also Mu, Zu, Lu and possibly Oz. Cited per reading number, because the readings differ from one another and a single \"Cayce date for Lemuria\" would be an average of things he said on different days.",
  },
  {
    key: "churchward1926",
    title: "The Lost Continent of Mu: The Motherland of Man",
    author: "James Churchward",
    url: "https://archive.org/details/the-lost-continent-of-mu/",
    sourceType: "book",
    publishedYear: 1926,
    notes:
      "Churchward's account of a sunken Pacific continent, which he says he read from clay tablets shown to him in India. Cited for his own figures: a civilisation flourishing between 50,000 and 12,000 years ago, and a destruction about 12,000 years before his own time.",
  },
  {
    key: "wikipedia_mu",
    title: "Mu (mythical lost continent) — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Mu_(mythical_lost_continent)",
    sourceType: "wikipedia",
    notes: "Cited for the history of the Mu idea and for how it came to be treated as interchangeable with Lemuria by later writers. Follow its references.",
  },
  {
    key: "ashwal2017",
    title: "Archaean zircons in Miocene oceanic hotspot rocks establish ancient continental crust beneath Mauritius",
    author: "Lewis D. Ashwal, Michael Wiedenbeck and Trond H. Torsvik",
    workTitle: "Nature Communications",
    url: "https://www.nature.com/articles/ncomms14086",
    sourceType: "academic_paper",
    publishedYear: 2017,
    notes:
      "Zircon crystals 2.5–3.0 billion years old, found in 5.7-million-year-old Mauritian volcanic rock — continental crust where there should be only ocean floor. Cited for the geology, and for nothing whatever about a civilisation.",
  },
  {
    key: "usgs_dynamic_earth",
    title: "Developing the theory",
    author: "United States Geological Survey",
    workTitle: "This Dynamic Earth: The Story of Plate Tectonics",
    url: "https://pubs.usgs.gov/gip/dynamic/developing.html",
    sourceType: "government",
    notes:
      "The USGS account of how seafloor spreading was established in the 1960s — the work that removed the need for sunken land bridges of any kind, Sclater's included.",
  },
  {
    key: "berkeley_madagascar",
    title: "Where did all of Madagascar's species come from?",
    publisher: "Understanding Evolution, University of California Museum of Paleontology",
    url: "https://evolution.berkeley.edu/evo-news/where-did-all-of-madagascars-species-come-from/",
    sourceType: "website",
    notes: "Cited for the modern answer to Sclater's question: Gondwana, and the dates at which Madagascar and India parted company.",
  },
  {
    key: "wikipedia_insular_india",
    title: "Insular India — Wikipedia",
    url: "https://en.wikipedia.org/wiki/Insular_India",
    sourceType: "wikipedia",
    notes: "Cited for the dates of India's separation from Madagascar and its subsequent drift north to Asia. Follow its references.",
  },
];

// ---------------------------------------------------------------------------
// PART ONE — THE HISTORY OF AN IDEA
//
// Real events, with real dates, all inside a hundred and sixty years.
// ---------------------------------------------------------------------------

const IDEA_HISTORY: SeedEvent[] = [
  {
    slug: LEMURIA_ANCHOR_SLUG,
    title: "Sclater proposes Lemuria",
    summary: "A zoologist's answer to a question about lemurs. No people, no civilisation, no lost golden age.",
    description:
      "In April 1864 the zoologist Philip Lutley Sclater published \"The Mammals of Madagascar\" in The Quarterly Journal of Science. He observed that around thirty species of lemur live in Madagascar, that all of Africa has eleven or twelve, and that the Indian region has three — and proposed that a landmass now beneath the Indian Ocean had once connected them. He called it Lemuria, after the animals.\n\n" +
      "WHAT SCLATER DID NOT SAY, and this is the single most important sentence in this whole dataset: he was not proposing that an advanced human civilisation called Lemuria had existed. There are no people in his hypothesis. There is no date for its destruction. There is no lost wisdom, no root race, no spiritual epoch. It is a proposal about the distribution of primates, made by a working zoologist, in a scientific journal, twenty-four years before anybody attached any of that to it.\n\n" +
      "It was also a perfectly ordinary kind of hypothesis for 1864. Continents were thought to be fixed; a sunken land bridge was the available explanation for animals on both sides of an ocean, and several were proposed in those years for other regions. What makes this one famous is not the science but what happened to the word afterwards.",
    category: "science",
    subcategory: "History of an idea",
    eventType: "historical",
    eventTypeNote: "A datable publication. The claims it later attracted are elsewhere on this timeline, at the dates their authors put them.",
    tags: ["lemuria", "history-of-an-idea", "biogeography", "madagascar", "sclater"],
    people: ["Philip Lutley Sclater"],
    claims: [
      {
        sourceKey: "sclater1864",
        startYear: 1864,
        startMonth: 4,
        datePrecision: "month",
        isApproximate: false,
        originalDateText: "The Quarterly Journal of Science, April 1864",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT THE SOURCE IS: the paper itself, published in a scientific journal with a volume, a month and page numbers. EVIDENCE TYPE: an ordinary publication record — the most securely dated kind of thing on this whole record, and worth noticing for that reason, since everything else here is dated by inference, calculation or clairvoyance.",
        notes: "The date the WORD was coined. Not a date for anything the word was later said to describe.",
        citations: [
          { sourceKey: "wikipedia_sclater", relation: "context", note: "Sclater's career, and the publication details of the paper." },
          { sourceKey: "wikipedia_lemuria", relation: "context", note: "How the term travelled from this paper into esoteric literature." },
        ],
      },
    ],
  },

  {
    slug: "blavatsky-lemuria-root-race",
    title: "Blavatsky makes Lemuria a root race",
    summary: "1888: a zoological hypothesis is taken over as the third act of a spiritual history of humanity.",
    description:
      "In The Secret Doctrine (1888), Helena Petrovna Blavatsky took Sclater's name for a hypothetical landmass and gave it an entirely different job. Lemuria became the home of the Third Root Race, preceding the Atlantean Fourth Root Race — a stage in a scheme of human spiritual evolution running over tens of millions of years, described from what she presented as access to an esoteric record rather than from evidence anybody could examine.\n\n" +
      "TWO DATES, AND THEY ARE NOT THE SAME DATE. This record is about 1888, when the claim was made. The prehistoric periods the claim describes are on a separate record — \"Lemuria, as the esoteric traditions date it\" — because eighteen million years ago and 1888 are different facts about different things, and a timeline that shows only one of them has hidden the more interesting half.\n\n" +
      "WHAT CHANGED, PRECISELY. Sclater proposed land. Blavatsky proposed people, a civilisation, a stage of consciousness and a moral trajectory. Nothing in the 1864 paper leads to any of it. The continuity is a borrowed word.",
    category: "culture",
    subcategory: "History of an idea",
    eventType: "historical",
    eventTypeNote: "A datable publication. What it asserts about prehistory is recorded separately, as claims with their own dates.",
    tags: ["lemuria", "history-of-an-idea", "theosophy", "root-race", "blavatsky"],
    people: ["Helena Petrovna Blavatsky"],
    claims: [
      {
        sourceKey: "blavatsky_sd",
        startYear: 1888,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "The Secret Doctrine, 1888",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT THE SOURCE IS: the publication of The Secret Doctrine in 1888. EVIDENCE TYPE: a publication record. This claim dates the BOOK, which is a thing that certainly happened on a date, and says nothing about whether anything in the book did.",
        notes:
          "The distinction this record exists to make: 1888 is when somebody said it. The eighteen million years is when they said it happened. Both are on this timeline, thirteen thousand times apart.",
        citations: [
          { sourceKey: "theosophy_world_lemuria", relation: "context", note: "The movement's own account of how its Lemuria developed." },
        ],
      },
    ],
  },

  {
    slug: "scott-elliot-lost-lemuria",
    title: "Scott-Elliot publishes The Lost Lemuria",
    summary: "1904: the Theosophical Lemuria acquires geography, inhabitants, maps — and geological periods instead of dates.",
    description:
      "W. Scott-Elliot's The Lost Lemuria (1904) is the most detailed occult reconstruction of the subject: the continent's shape, its inhabitants, their development, and its destruction, illustrated with two maps of a world nobody has seen.\n\n" +
      "WHAT HE GIVES INSTEAD OF DATES. His maps are labelled with geological periods — one covering the Permian through the Triassic into the Jurassic, the other the Cretaceous into the Eocene. He does not give years. That matters for how this timeline stores him: the claim on the deep-time record places his Lemuria across those periods and says plainly that the years attached to them are MODERN datings, which he did not have and could not have used.\n\n" +
      "The same author's The Story of Atlantis (1896) is already on this timeline, with its explicit 9564 B.C. for the sinking of Poseidonis. The two books are a matched pair, and the difference between them — an exact year for one continent, geological periods for the other — is itself worth a reader's attention.",
    category: "culture",
    subcategory: "History of an idea",
    eventType: "historical",
    tags: ["lemuria", "history-of-an-idea", "theosophy", "scott-elliot", "atlantis"],
    people: ["W. Scott-Elliot"],
    claims: [
      {
        sourceKey: "scott_elliot_lemuria",
        startYear: 1904,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "The Lost Lemuria, 1904",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "WHAT THE SOURCE IS: the book's publication in 1904. EVIDENCE TYPE: a publication record.",
        notes: "Published eight years after the same author's The Story of Atlantis, and reissued with it in the combined edition this timeline links to.",
      },
    ],
  },

  {
    slug: "steiner-lemurian-epoch",
    title: "Steiner places a Lemurian epoch before the Atlantean",
    summary: "An order, not a date — and this timeline does not supply the date he withheld.",
    description:
      "In the essays collected as Cosmic Memory (1904–1908), Rudolf Steiner describes a Lemurian age preceding the Atlantean age, which in turn precedes the post-Atlantean age we are said to be in.\n\n" +
      "WHAT HE GIVES IS AN ORDER. Lemurian, then Atlantean, then post-Atlantean. He does not put the Lemurian epoch in years, and this dataset does not invent one for him. Elsewhere on this timeline his Atlantis carries 7227 BC — and that is a figure counted back from an epoch boundary he does state, not one he wrote about Atlantis; there is no equivalent arithmetic available for Lemuria, so there is no number here.\n\n" +
      "A RELATIVE CLAIM IS STILL A CLAIM. \"Before Atlantis\" is a real and testable-in-principle statement about ordering, and it is what the source supports. Forcing a BCE year onto it to make it draw nicely on a strip would be inventing evidence for the convenience of a renderer.\n\n" +
      "THE ORDERING IS SHARED, AND THAT IS NOT CORROBORATION. Theosophy puts the Lemurian root race before the Atlantean; Steiner puts the Lemurian epoch before the Atlantean. Two traditions agreeing looks like independent support until you notice that Steiner spent 1902 to 1912 as General Secretary of the German Section of the Theosophical Society. It is one lineage, as the Atlantis record on this timeline also says.",
    category: "culture",
    subcategory: "History of an idea",
    eventType: "historical",
    eventTypeNote:
      "A relative chronology. The source gives an order of ages and no years, and the record is stored that way rather than being given a date it does not have.",
    tags: ["lemuria", "history-of-an-idea", "anthroposophy", "steiner", "atlantis", "relative-chronology"],
    people: ["Rudolf Steiner"],
    claims: [
      {
        sourceKey: "steiner_cosmic_memory",
        startYear: 1904,
        endYear: 1908,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "essays published in Lucifer-Gnosis, 1904–1908",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence:
          "WHAT THE SOURCE IS: the essays as published, between 1904 and 1908. EVIDENCE TYPE: a publication record. THIS DATES THE WRITING, NOT THE EPOCH. Steiner gives no year for the Lemurian age, so there is no second claim on this record and no entry for him on the deep-time one — an absence that is itself the accurate representation of what the source says.",
        notes:
          "Stored deliberately as a gap. A timeline that never shows an empty space where a date should be has taught its readers that every claim comes with one.",
      },
    ],
  },

  {
    slug: "churchward-publishes-mu",
    title: "Churchward publishes The Lost Continent of Mu",
    summary: "1926: a separate lost continent, in a different ocean, from a different tradition.",
    description:
      "James Churchward's The Lost Continent of Mu: The Motherland of Man (1926) describes a sunken Pacific continent — Mu — which he presents as the birthplace of humanity, home to a civilisation of sixty-four million people. He says he learned of it from clay tablets in a \"Naga-Maya\" language shown to him by a temple priest in India more than fifty years earlier, and that he was taught to read them.\n\n" +
      "MU IS NOT LEMURIA, and this timeline keeps them apart. Lemuria is an Indian Ocean hypothesis of 1864 that Theosophy adopted in 1888. Mu is a Pacific continent published in 1926. Different oceans, different origins, different authors, different evidence — and the two were joined together later, by other people. The joining has its own record on this timeline because it actually happened and can be described; the identity has not been established by anybody and is not asserted here.\n\n" +
      "The tablets Churchward describes have never been produced or examined.",
    category: "culture",
    subcategory: "History of an idea",
    eventType: "historical",
    tags: ["mu", "history-of-an-idea", "churchward", "lost-continent", "pacific"],
    people: ["James Churchward"],
    claims: [
      {
        sourceKey: "churchward1926",
        startYear: 1926,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "The Lost Continent of Mu, 1926",
        datingMethod: "historical_record",
        chronology: "historical",
        evidence: "WHAT THE SOURCE IS: the book's publication in 1926. EVIDENCE TYPE: a publication record.",
        notes:
          "This date matters twice over: it is when the claim was made, AND it is the year the destruction date on the other record is counted back from. Churchward writes \"about 12,000 years ago\", and \"ago\" means ago from here.",
        citations: [{ sourceKey: "wikipedia_mu", relation: "context", note: "The history of the Mu idea, and how it came to be treated as Lemuria by later writers." }],
      },
    ],
  },

  {
    slug: "lemuria-and-mu-become-associated",
    title: "Lemuria and Mu become interchangeable",
    summary: "Two separate traditions merge in popular literature — which is a real event, and not the same as them being the same place.",
    description:
      "Through the twentieth century, popular and esoteric writing increasingly treated Lemuria and Mu as two names for one lost continent. Cayce's readings use Lemuria and Mu for the same Pacific land; later writers, and later popular culture, followed.\n\n" +
      "FOUR DIFFERENT THINGS ENDED UP UNDER TWO NAMES:\n\n" +
      "• LEMURIA, ORIGINALLY — an 1864 Indian Ocean land bridge, proposed to explain lemurs.\n" +
      "• THEOSOPHICAL LEMURIA — from 1888, an ancient spiritual and human epoch, tens of millions of years old.\n" +
      "• MU — from 1926, a Pacific continent with a civilisation of sixty-four million.\n" +
      "• LEMURIA-AND-MU — from the mid-twentieth century, the two used interchangeably by writers who mostly encountered them already merged.\n\n" +
      "The merging is recorded here as a development in the history of an idea, with a broad date, because that is what can be honestly said about it: it happened gradually, across many authors, and no single publication did it. It is not recorded as a discovery that the two were always the same.",
    category: "culture",
    subcategory: "History of an idea",
    eventType: "historical",
    eventTypeNote: "A gradual development across many authors, given a broad range rather than a year, because no single event produced it.",
    tags: ["lemuria", "mu", "history-of-an-idea", "popular-culture"],
    claims: [
      {
        sourceKey: "wikipedia_mu",
        startYear: 1930,
        endYear: 2000,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "over the twentieth century",
        datingMethod: "estimate",
        chronology: "historical",
        evidence:
          "WHAT THE SOURCE SAYS: that Mu came to be equated with Lemuria in later literature, though the two originate separately. EVIDENCE TYPE: a summary of publishing history. HOW THE RANGE IS REACHED: it is not a date in any source; it is a broad span covering the period over which the usage spread, and it is stored as approximate for that reason.",
        notes:
          "A deliberately imprecise claim. A single year here would be false precision about something that happened by accumulation, and the alternative — leaving the merging off the timeline — would leave a reader with no way to see that it happened at all.",
        citations: [
          { sourceKey: "cayce_lemuria_readings", relation: "context", note: "Readings that use Lemuria, Mu, Zu and Lu for the same Pacific land — the merging visible in progress." },
          { sourceKey: "wikipedia_lemuria", relation: "context", note: "The parallel history on the Lemuria side." },
        ],
      },
    ],
  },

  {
    slug: "plate-tectonics-supersedes-lemuria",
    title: "Plate tectonics removes the need for Lemuria",
    summary: "The mainstream geological position — stated as what the evidence supports, not as a verdict on everything anybody has ever said.",
    description:
      "Through the 1960s, seafloor spreading was established: the ocean floor itself moves, carrying continents with it. Harry Hess and Robert Dietz set it out, and the magnetic striping of the ocean floor confirmed it. Continents drift; they do not need land bridges, and they do not sink.\n\n" +
      "WHAT THIS DOES TO SCLATER'S HYPOTHESIS. It answers his question without his continent. Madagascar and India really were connected — as parts of Gondwana, tens of millions of years ago, drifting apart rather than being separated by a foundering landmass. The lemurs are explained. Lemuria is not needed.\n\n" +
      "WHAT THIS DOES NOT DO, stated carefully because the difference matters. Modern geology does not recognise a recently submerged Lemuria-sized continent connecting Madagascar and India in the way Sclater proposed. That is a specific finding about a specific proposal. It is NOT the claim that science has proved every Lemuria tradition false — a much larger statement that nobody has established and that this record does not make.\n\n" +
      "The Theosophical and Churchwardian accounts are not disproved here; they are outside what this evidence addresses, and they remain on this timeline with their own sources, their own methods and their own limitations, for a reader to weigh.",
    category: "science",
    subcategory: "Modern geology",
    eventType: "mainstream",
    eventTypeNote:
      "The generally accepted account in current earth science. That does not make it unquestionably true; it makes it the broadly accepted reading, which is a different and more useful thing to know.",
    tags: ["lemuria", "plate-tectonics", "geology", "mainstream", "history-of-an-idea"],
    claims: [
      {
        sourceKey: "usgs_dynamic_earth",
        startYear: 1960,
        endYear: 1968,
        datePrecision: "year",
        isApproximate: true,
        originalDateText: "the 1960s",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "WHAT HAPPENED: seafloor spreading was proposed by Harry Hess and Robert Dietz and then confirmed by the magnetic record of the ocean floor, establishing plate tectonics over the course of the decade. EVIDENCE TYPE: the history of a scientific theory, as a national geological survey recounts it. WHY IT IS ON A LEMURIA RECORD: because it is the answer to the question Sclater asked, arriving ninety-six years later and in a form he did not anticipate.",
        notes:
          "Given as a range because a theory becoming established is not an event with a date. Choosing one would be tidier and less true.",
        citations: [
          { sourceKey: "berkeley_madagascar", relation: "supports", note: "The modern answer to Sclater's actual question: where Madagascar's species came from, and when the land they came from parted." },
          { sourceKey: "wikipedia_lemuria", relation: "context", note: "The overview account of the hypothesis being superseded." },
        ],
      },
    ],
  },

  {
    slug: "mauritia-discovered",
    title: "Ancient continental crust found beneath Mauritius",
    summary: "2017: real sunken continental fragments in the Indian Ocean — and not, in any sense, Lemuria found.",
    description:
      "In 2017 Lewis Ashwal, Michael Wiedenbeck and Trond Torsvik reported zircon crystals between 2.5 and 3.0 billion years old inside volcanic rock on Mauritius that is only 5.7 million years old. Zircons that old cannot form in ocean crust. Their presence means there is ancient continental material buried beneath the island — a fragment left behind when Gondwana broke up, part of what Torsvik's group had in 2013 named Mauritia.\n\n" +
      "THIS IS NOT LEMURIA FOUND, and the distinction is worth being exact about because the headlines were not. What was found is old continental crust, deeply buried, that was continuous with Madagascar and India until about 85 million years ago and has been submerged since. What Blavatsky, Scott-Elliot, Steiner and Churchward describe is an inhabited civilisation. Nothing in this result bears on that at all: no artefacts, no habitation, and a date eighty-five million years before any animal that could have a civilisation.\n\n" +
      "WHY IT IS ON THIS RECORD ANYWAY. Because Sclater's original question was about lost land in broadly this region, and the honest answer turns out to be that there is some — of a completely different kind, at a completely different date, and doing none of the work he wanted it for. Conceptually and geographically relevant; not evidence of identity.",
    category: "science",
    subcategory: "Modern geology",
    eventType: "scientific_model",
    tags: ["lemuria", "mauritia", "geology", "indian-ocean", "gondwana", "history-of-an-idea"],
    claims: [
      {
        sourceKey: "ashwal2017",
        startYear: 2017,
        datePrecision: "year",
        isApproximate: false,
        originalDateText: "Nature Communications, 2017",
        datingMethod: "historical_record",
        chronology: "scientific",
        evidence:
          "WHAT WAS MEASURED: uranium–lead ages of zircon crystals recovered from a trachyte plug on Mauritius, giving 2.5–3.0 billion years in rock erupted 5.7 million years ago. EVIDENCE TYPE: radiometric dating of mineral grains. THIS CLAIM DATES THE PAPER. The ages it reports are on the geological record for Mauritia, where they belong.",
        notes: "The name Mauritia was proposed by Torsvik and colleagues in 2013; this 2017 paper is the zircon evidence for it.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// PART TWO — THE CLAIMED ANCIENT CHRONOLOGY
//
// Tens of millions of years to the left of everything above.
// ---------------------------------------------------------------------------

const CLAIMED_PREHISTORY: SeedEvent[] = [
  {
    slug: "lemuria-claimed-epoch",
    title: "Lemuria, as the esoteric traditions date it",
    summary: "Four claims, from 34½ million years ago to 12,600 years ago — and one tradition that gives no date at all.",
    description:
      "Where the traditions that adopted Sclater's word put the thing they made of it. The dates below span more than thirty-four million years, and they were all proposed within fifty-six years of each other, between 1888 and 1944.\n\n" +
      "WHY THE FIGURES ARE SO LARGE, AND WHY THEY LOOK GEOLOGICAL. In the late nineteenth century the Earth was thought to be around two hundred million years old — radiometric dating did not yet exist — so the geological periods were placed far closer to the present than they are now. A Theosophical chronology putting the Lemurian root race at 34½ million years ago was, on the geology of its own day, putting it in the Jurassic. Read against modern dates it lands in the Eocene instead. The figure did not move; the geology under it did.\n\n" +
      "WHAT EACH CLAIM RESTS ON is on the claim, not summarised here: who said it, whether the number is theirs or somebody else's, and what kind of account it comes out of.\n\n" +
      "ONE TRADITION IS ABSENT ON PURPOSE. Rudolf Steiner places a Lemurian epoch before the Atlantean but gives no year for it, so he has no claim on this record. The order he does give is on his own record, under the history of the idea. An empty space is the accurate representation of a source that does not supply a date.\n\n" +
      "MAINSTREAM INTERPRETATION, ONCE, FOR ALL OF THESE: none of these chronologies is accepted by modern anthropology, archaeology or evolutionary biology as an established account of human history. That is recorded here rather than repeated as a rebuttal under every claim, and it does not cause any of them to be deleted, hidden or labelled false.",
    category: "culture",
    subcategory: "Contested chronology",
    eventType: "disputed",
    eventTypeNote:
      "Filed as disputed because the sources genuinely disagree with each other by tens of millions of years — not as a judgement on any of them. These claims come from traditions that do not present themselves as archaeology and should not be read as though they did.",
    tags: ["lemuria", "theosophy", "root-race", "contested-chronology", "esoteric", "deep-time"],
    people: ["Helena Petrovna Blavatsky", "W. Scott-Elliot", "Edgar Cayce", "Annie Besant", "C. W. Leadbeater"],
    claims: [
      {
        sourceKey: "theosophy_wiki_rootrace",
        startYear: Ma(34.5),
        datePrecision: "million_years",
        precisionDecimals: 1,
        isApproximate: true,
        originalDateText: "34½ million years ago",
        datingMethod: "source_assertion",
        chronology: "alternative",
        evidence:
          "WHAT THE SOURCE SAYS: that in traditional Theosophy the Lemurian root race began 34½ million years ago — in the middle of what was then believed to be the Jurassic. WHO SAYS IT: the tradition, as its own reference work states it. NOT, on the evidence found, Blavatsky: the figure is attributed to Theosophy generally rather than to a named author, and it is stored that way. EVIDENCE TYPE: an esoteric chronology. LIMITATION: the attribution could not be established to a specific author or a specific passage.",
        notes:
          "NEEDS SOURCE VERIFICATION — the author, not the figure. The 34½-million-year date is stated plainly in the movement's own reference work; what could not be established is who first gave it. The detailed later chronologies are worked out in Besant and Leadbeater's Man: Whence, How and Whither (1913), which is the likeliest home for it, and this record does not assert that without having checked the text.\n\n" +
          "Attributing it to Blavatsky by default would have been the easy error, and the brief this dataset was written from specifically warned against it.",
        citations: [
          {
            sourceKey: "besant_leadbeater1913",
            relation: "context",
            note: "The most detailed later Theosophical chronology, and the work the elaborated root-race dates are generally worked out in. Named here so the figure is not attributed to Blavatsky by default.",
          },
          { sourceKey: "theosophy_world_lemuria", relation: "context", note: "The movement's encyclopedia entry on Lemuria." },
        ],
      },
      {
        sourceKey: "blavatsky_sd",
        startYear: Ma(18),
        datePrecision: "million_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "18 millions of years ago",
        datingMethod: "source_assertion",
        chronology: "alternative",
        evidence:
          "WHAT THE SOURCE SAYS: Blavatsky writes that present physical humanity — the Vaivasvata humanity — began only eighteen millions of years ago, the point her scheme calls the lighting up of Manas: the awakening of mind, associated with the intervention of beings she calls the Lords of the Flame. WHO SAYS IT: Blavatsky herself, in The Secret Doctrine, which is why this claim is attributed to her and the 34½-million-year one above is not. EVIDENCE TYPE: an esoteric account, presented as knowledge from a hidden record rather than as an inference from anything examinable. LIMITATION: there is no evidence outside the text, and none is offered in it.",
        notes:
          "This is the Theosophical date that IS Blavatsky's, and the contrast with the claim above it is the point of seeding both: same tradition, two figures sixteen million years apart, one attributable to a named author in a datable book and one not.",
        citations: [
          {
            sourceKey: "blavatsky_human_evolution",
            relation: "supports",
            note: "A Theosophical commentary gathering her chronological statements, cited for where the eighteen-million figure sits in the scheme.",
          },
        ],
      },
      {
        sourceKey: "scott_elliot_lemuria",
        startYear: Ma(299),
        endYear: Ma(34),
        datePrecision: "million_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "from the Permian through to the Eocene",
        datingMethod: "textual_interpretation",
        chronology: "alternative",
        evidence:
          "WHAT THE SOURCE GIVES: not years, but geological periods. Scott-Elliot's two maps of Lemuria are labelled for the Permian through the Triassic into the Jurassic, and the Cretaceous into the Eocene. HOW THE YEARS HERE ARE REACHED: by taking the MODERN dates of those periods, roughly 299 to 34 million years ago. That is this timeline's arithmetic, not his. LIMITATION: he could not have meant these numbers. In 1904 the Earth was thought to be about two hundred million years old, so the same period names sat much closer to the present for him than they do for us. The band drawn here is where his periods fall on a modern chart, which is not the same as where he thought he was pointing.",
        notes:
          "Stored with the periods in the source's own words and the years marked as ours, because the alternative — inventing a figure he never gave, or leaving him off the chronology entirely — would each lose something. The brief this was written from asked specifically that no precise date be manufactured where he gives only relative periods.",
      },
      {
        sourceKey: "cayce_lemuria_readings",
        startYear: bce(10_670),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "12,600 years ago (reading 5750-1)",
        datingMethod: "textual_interpretation",
        chronology: "alternative",
        evidence:
          "WHAT THE READING SAYS: reading 5750-1 gives the sinking of Lemuria as 12,600 years ago, and describes survivors settling in what is now the American southwest. Other readings place the land west of South America (364-13) and extending into the South Pacific (364-4). HOW THE BCE DATE IS REACHED: by subtraction from when the reading was given. The readings run from 1923 to 1944, so 12,600 years earlier is somewhere around 10,670 BCE — the twenty-one-year span of the readings moves the answer by twenty-one years, which is well inside the precision stored. EVIDENCE TYPE: a trance reading. LIMITATION: a CALCULATED date, not one the reading states; and the reading's own date could not be verified from here.",
        notes:
          "NEEDS SOURCE VERIFICATION: the date reading 5750-1 was given. The reading number and the 12,600-year figure were found; the sitting's date was not, so the arithmetic is bracketed by the span of the readings as a whole rather than pinned.\n\n" +
          "Note also which word the readings use. They call this land Lemuria most often, but also Mu, Zu, Lu and possibly Oz — so Cayce is one of the places where the Lemuria and Mu traditions can be watched merging, forty years after Churchward and in a different idiom entirely.",
      },
    ],
  },

  {
    slug: "mu-destruction",
    title: "Churchward's Mu",
    summary: "A Pacific continent, a civilisation of sixty-four million, and a destruction date that is a subtraction from 1926.",
    description:
      "James Churchward's Mu, as his own books date it. Kept as a separate record from Lemuria, because the two are separate traditions from separate oceans, joined later by other writers.\n\n" +
      "TWO CLAIMS, AND THEY ARE DIFFERENT KINDS OF STATEMENT. One is the span over which he says the civilisation flourished; the other is its destruction. Both are given by him as \"years ago\", both are converted here by subtracting from 1926, and both say so.\n\n" +
      "A CORRECTION WORTH RECORDING. The fifty-thousand-year figure that circulates in connection with Mu is the start of the civilisation's flourishing in Churchward's account, not the date of its destruction. Dating the destruction of Mu to about 50,000 BCE — as it is sometimes given — is not something his text supports, and this record does not do it.\n\n" +
      "WHAT THE ACCOUNT RESTS ON: clay tablets in a language Churchward says he was taught by a temple priest in India. No tablet has ever been produced or examined.",
    category: "culture",
    subcategory: "Contested chronology",
    eventType: "alternative",
    eventTypeNote: "An alternative-history account, presented as such. Its date is a calculation from a relative statement in the source, not a figure the source gives.",
    tags: ["mu", "churchward", "contested-chronology", "lost-continent", "pacific"],
    people: ["James Churchward"],
    claims: [
      {
        sourceKey: "churchward1926",
        startYear: bce(48_074),
        endYear: bce(10_074),
        datePrecision: "millennium",
        isApproximate: true,
        originalDateText: "flourished between 50,000 and 12,000 years ago",
        datingMethod: "textual_interpretation",
        chronology: "alternative",
        evidence:
          "WHAT THE SOURCE SAYS: that the civilisation of Mu — the Naacal — flourished between 50,000 and 12,000 years ago. HOW THE BCE RANGE IS REACHED: by subtracting from 1926, the year of publication, giving roughly 48,100 BCE to 10,100 BCE. EVIDENCE TYPE: an alternative-history account based on tablets that have never been produced. LIMITATION: a calculated range from a relative statement, and stored at millennium precision because \"50,000 years ago\" is a round figure and anything finer would be precision Churchward did not claim.",
        notes:
          "THIS IS WHERE THE FIFTY-THOUSAND-YEAR FIGURE BELONGS — as the start of a flourishing, not as a destruction. It is sometimes quoted as a date for Mu's end, which the text does not support.",
      },
      {
        sourceKey: "churchward1926",
        startYear: bce(10_074),
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "about 12,000 years ago",
        datingMethod: "textual_interpretation",
        chronology: "alternative",
        evidence:
          "WHAT THE SOURCE SAYS: that Mu sank about 12,000 years ago, at which point it held sixty-four million inhabitants, seven major cities and colonies on other continents. HOW THE BCE DATE IS REACHED: 1926 minus about 12,000 years, giving roughly 10,100 BCE. EVIDENCE TYPE: an alternative-history account. LIMITATION: a CALCULATED date. Churchward writes \"years ago\"; the calendar year is this timeline's arithmetic, and \"about\" in the source is doing real work — it is a round twelve thousand, not a measurement.",
        notes:
          "AND THIS IS NOT AUTOMATICALLY A DATE FOR LEMURIA. It is a date for Mu, from a 1926 Pacific tradition. Cayce's Lemuria sinks 12,600 years before a reading given between 1923 and 1944, which lands within a few hundred years of this — a closeness worth noticing and not worth over-reading, since by the 1930s the two traditions were already being read together.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// PART THREE — THE GEOLOGY
//
// The answer to the question Sclater actually asked.
// ---------------------------------------------------------------------------

const GEOLOGY: SeedEvent[] = [
  {
    slug: "gondwana-breakup",
    title: "Gondwana begins to break up",
    summary: "The real reason Madagascar and India share a natural history — and it has nothing to do with anything sinking.",
    description:
      "Gondwana — Africa, South America, Madagascar, India, Antarctica and Australia as one landmass — began to break apart around 180 million years ago, in the Jurassic. Madagascar started to detach from Africa about 170 million years ago as the Somali and Mozambique basins opened.\n\n" +
      "WHY THIS IS ON A LEMURIA TIMELINE. Because it is the answer to Sclater's question. He asked how related animals came to be on both sides of an ocean, and reasoned — correctly, given what was known in 1864 — that there must once have been land between them. There was. It was not a continent that sank; it was a continent that split, with the pieces carried apart on moving plates over a hundred and eighty million years.\n\n" +
      "The lemurs themselves are a separate and later story: modern work places their ancestors' arrival in Madagascar long after the island separated, by dispersal across water rather than by land connection.",
    category: "nature",
    subcategory: "Geological history",
    eventType: "scientific_model",
    tags: ["gondwana", "geology", "plate-tectonics", "madagascar", "lemuria", "deep-time"],
    claims: [
      {
        sourceKey: "berkeley_madagascar",
        startYear: Ma(180),
        endYear: Ma(170),
        datePrecision: "million_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 180 million years ago, with Madagascar detaching about 170 million years ago",
        datingMethod: "geological",
        chronology: "geological",
        evidence:
          "WHAT IS DATED: the onset of Gondwana's break-up, from the ages of the rifted margins, the ocean floor formed between the fragments, and the palaeomagnetic record of where each piece was. EVIDENCE TYPE: geological and geophysical reconstruction. LIMITATION: a break-up over tens of millions of years has no single date, and the figures are the conventional round ones for the start of the process.",
        notes: "A geological event, on a geological record. It is linked to Lemuria because it answers Lemuria's original question, not because it is evidence for anything anybody built on the word.",
      },
    ],
  },

  {
    slug: "india-madagascar-separation",
    title: "India separates from Madagascar",
    summary: "88 million years ago — the last land connection in the region, and eighty-eight million years before anything that could build a city.",
    description:
      "India began to separate from Madagascar about 88 million years ago, a break-up associated with the Marion hotspot and marked by the thick lavas of the Volcan de l'Androy in southern Madagascar. India then moved north rapidly, reaching Asia about 55 million years ago and fully joining it around 35 million years ago.\n\n" +
      "THIS IS THE CONNECTION SCLATER WAS REACHING FOR. Madagascar and India were joined, and the animals on them do share ancestry from that time. What he could not know in 1864 is that they parted by drifting apart rather than by anything sinking, and that they did so eighty-eight million years before any of the human histories elsewhere on this timeline are set — before primates existed at all.\n\n" +
      "The arithmetic is worth doing. The oldest esoteric Lemuria on this timeline is 34½ million years old. This, the last real land connection, is two and a half times older than that.",
    category: "nature",
    subcategory: "Geological history",
    eventType: "scientific_model",
    tags: ["gondwana", "geology", "india", "madagascar", "lemuria", "deep-time"],
    claims: [
      {
        sourceKey: "wikipedia_insular_india",
        startYear: Ma(88),
        datePrecision: "million_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "about 88 million years ago",
        datingMethod: "geological",
        chronology: "geological",
        evidence:
          "WHAT IS DATED: the onset of rifting between India and Madagascar, from the ages of the volcanic rocks associated with the Marion hotspot and from the ocean floor formed between them. EVIDENCE TYPE: radiometric dating and plate reconstruction. LIMITATION: separation is a process; full isolation came later, towards the end of the Cretaceous.",
        notes: "An encyclopedia entry is a starting point for a number this well established; its references lead to the primary literature.",
        citations: [
          { sourceKey: "berkeley_madagascar", relation: "supports", note: "The same separation from a university museum's account of where Madagascar's species came from." },
        ],
      },
    ],
  },

  {
    slug: "mauritia-fragment",
    title: "Mauritia: continental crust under the Indian Ocean",
    summary: "Real sunken continental fragments, two to three billion years old — and not a lost civilisation by any reading.",
    description:
      "Mauritia is the name given in 2013 to a fragment of ancient continental crust beneath the Indian Ocean, left behind when Gondwana broke up. In 2017 it was put on firmer ground: zircon crystals 2.5 to 3.0 billion years old, recovered from volcanic rock on Mauritius that is itself only 5.7 million years old. Zircons of that age do not form in ocean crust, so there is old continent buried under the island — material continuous with Madagascar and India until about 85 million years ago, submerged ever since.\n\n" +
      "THIS IS GENUINELY A SUNKEN CONTINENTAL FRAGMENT IN THE INDIAN OCEAN. It is also, and just as certainly, not evidence for anything Blavatsky, Scott-Elliot, Steiner or Churchward described. There are no artefacts. There is no habitation. The crust was last at the surface before flowering plants were common and eighty-five million years before any primate existed. The relationship to Lemuria is conceptual and geographical — Sclater was asking about lost land in broadly this region and there is some — and not a relationship of identity or of evidence.\n\n" +
      "It is on this timeline because leaving it off would be its own kind of dishonesty: a reader who hears \"scientists found a lost continent under the Indian Ocean\" deserves to find it here, correctly dated and correctly described, rather than only in a headline.",
    category: "nature",
    subcategory: "Geological history",
    eventType: "scientific_model",
    eventTypeNote: "A geological finding, dated radiometrically. Related to the Lemuria story by geography and by the question it answers — not by being the thing anybody was looking for.",
    tags: ["mauritia", "geology", "indian-ocean", "gondwana", "lemuria", "deep-time", "zircon"],
    claims: [
      {
        sourceKey: "ashwal2017",
        startYear: Ga(3.0),
        endYear: Ga(2.5),
        datePrecision: "billion_years",
        precisionDecimals: 1,
        isApproximate: false,
        originalDateText: "Archaean zircons between 2.5 and 3.0 billion years old",
        datingMethod: "radiometric",
        chronology: "geological",
        evidence:
          "WHAT WAS MEASURED: uranium–lead ages of zircon crystals from a trachyte plug on Mauritius. The crystals are 2.5–3.0 billion years old; the rock carrying them erupted 5.7 million years ago. EVIDENCE TYPE: radiometric dating of individual mineral grains, which is about as direct as deep-time dating gets. WHAT IT ESTABLISHES: that continental crust of Archaean age lies beneath the island — the crust showing an affinity with central-eastern Madagascar, now some 700 km west.",
        notes:
          "The age of the CRUST, not of any event on it. Nothing lived on this material at the surface in any period a human tradition describes.",
      },
      {
        sourceKey: "ashwal2017",
        startYear: Ma(85),
        datePrecision: "million_years",
        precisionDecimals: 0,
        isApproximate: true,
        originalDateText: "connected to India and Madagascar until about 85 million years ago",
        datingMethod: "geological",
        chronology: "geological",
        evidence:
          "WHAT IS DATED: when this fragment stopped being continuous with India and Madagascar, from the plate reconstruction the zircon evidence supports. EVIDENCE TYPE: plate reconstruction constrained by radiometric ages. WHY IT MATTERS HERE: it is the date the only real lost land in this ocean went under, and it is eighty-five million years before any of the esoteric chronologies on this timeline.",
        notes: "Close to, and consistent with, the India–Madagascar separation dated on its own record at about 88 million years ago.",
      },
    ],
  },
];

export const LEMURIA_EVENTS: SeedEvent[] = [...IDEA_HISTORY, ...CLAIMED_PREHISTORY, ...GEOLOGY];
