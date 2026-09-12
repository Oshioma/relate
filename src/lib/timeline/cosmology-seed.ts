import { astronomicalFromYearsAgo } from "./time";
import type { SeedEvent, SeedEventLink, SeedSource, SeedTrack } from "./seed-types";

// =============================================================================
// THE BEGINNING, AND THE AGE OF THE UNIVERSE
//
// The hardest record this timeline has had to hold, and the one that forced a
// change to the schema. Everything before it could be written as "somebody
// says this happened at time T". Here, one of the serious answers is that
// there is no T — and a database that cannot hold that answer has taken a side
// in the argument before a student reads a word of it.
//
// FIVE KINDS OF CLAIM SIT ON THE ANCHOR RECORD, and they are not five answers
// to one question. That is the single most important thing about this dataset
// and the reason every claim carries whatIsDated:
//
//   ~13.8 billion years   dates THE EXPANSION of the observable universe,
//                         counted back to a hot dense early state.
//   no finite beginning   denies there is a first moment TO date.
//   a previous phase      says our expansion may not be the start of anything.
//   vast repeating cycles gives LENGTHS, not positions, within a cosmology
//                         where "when did it start" is the wrong question.
//   4004 BCE              dates THE CREATION OF THE WORLD, by an addition
//                         performed on Biblical genealogies.
//
// Stack those as five numbers in a column and a reader learns that cosmology
// is a disagreement about a quantity. It is not. They are different assertions
// about different things, made by different means, with very different amounts
// of evidence behind them, and the record says so in every one of those
// dimensions rather than in a score.
//
// WHAT IS DELIBERATELY NOT DONE HERE
//
//   No confidence scores, no "proven", no "debunked", no traffic lights. The
//   mainstream position is labelled as the mainstream position and the
//   evidence for it is stated; that is a stronger and more honest thing than a
//   rating, and it is the only thing a reader can check.
//
//   The Big Bang model is NOT described as proving the universe began from
//   nothing 13.8 billion years ago. It describes the evolution and expansion
//   of the observable universe from a hot, dense early state. Whether that
//   state was an absolute beginning, and what if anything preceded it, are
//   separate and open questions — and modern physicists are still working on
//   them, which is why the cyclic models are here and are not a fringe
//   curiosity.
//
//   Hindu cosmology is not labelled "false" and is not labelled "evidence".
//   It is described as what it is: a religious and philosophical cosmology,
//   with its structure given from a text that can be read.
//
//   No elapsed-time total is given for the present cosmic cycle. The figure
//   commonly quoted — 155.52 trillion years into the life of Brahma — is a
//   calculation whose supporting passage this dataset could not verify, and
//   an unverified number is left out and the omission recorded rather than
//   seeded and hedged.
//
// EVERY SOURCE BELOW WAS CHECKED. Page numbers, volumes, DOIs and URLs are
// real and were verified before seeding; nothing here is reconstructed from
// memory.
// =============================================================================

/** Astronomical year numbering: 1 BCE = 0, 2 BCE = −1. See time.ts. */
const bce = (year: number): number => 1 - year;
const Ga = (billions: number): number => astronomicalFromYearsAgo(billions * 1_000_000_000);

export const COSMOLOGY_ANCHOR_SLUG = "beginning-of-the-universe";

export const COSMOLOGY_TRACK: SeedTrack = {
  name: "Beginning of the universe",
  slug: "beginning-of-the-universe",
  kind: "theme",
  color: "#4b4fa8",
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export const COSMOLOGY_SOURCES: SeedSource[] = [
  {
    key: "planck2018",
    title: "Planck 2018 results. VI. Cosmological parameters",
    author: "Planck Collaboration",
    workTitle: "Astronomy & Astrophysics",
    reference: "A&A 641, A6 (2020); preprint arXiv:1807.06209",
    url: "https://www.aanda.org/articles/aa/abs/2020/09/aa33910-18/aa33910-18.html",
    sourceType: "academic_paper",
    publishedYear: 2020,
    publishedDisplay: "2020 (data released 2018)",
    notes:
      "The final cosmological parameters from the Planck satellite's measurements of the cosmic microwave background, and the source of the age figure this record leads with. Cited for two values from its parameter tables — the CMB-only fit and the fit combining CMB with baryon acoustic oscillations — because they differ, and the difference is the point.",
  },
  {
    key: "bondi_gold1948",
    title: "The Steady-State Theory of the Expanding Universe",
    author: "H. Bondi and T. Gold",
    workTitle: "Monthly Notices of the Royal Astronomical Society",
    reference: "MNRAS 108(3), 252–270",
    url: "https://academic.oup.com/mnras/article/108/3/252/2603423",
    sourceType: "academic_paper",
    publishedYear: 1948,
    publishedDisplay: "1948",
    notes:
      "The first published statement of the steady-state model. Cited for the claim itself: a universe that expands while its large-scale properties stay unchanged, which requires continuous creation of matter and leaves no finite creation date.",
  },
  {
    key: "hoyle1948",
    title: "A New Model for the Expanding Universe",
    author: "F. Hoyle",
    workTitle: "Monthly Notices of the Royal Astronomical Society",
    reference: "MNRAS 108(5), 372–382",
    url: "https://academic.oup.com/mnras/article/108/5/372/2601825",
    sourceType: "academic_paper",
    publishedYear: 1948,
    publishedDisplay: "1948",
    notes:
      "Hoyle's own formulation, submitted a month after Bondi and Gold's and published in the same volume. Mathematically and philosophically a different route to the same conclusion, which is why both are cited rather than one standing for \"the\" steady-state paper.",
  },
  {
    key: "penzias_wilson1965",
    title: "A Measurement of Excess Antenna Temperature at 4080 Mc/s",
    author: "A. A. Penzias and R. W. Wilson",
    workTitle: "The Astrophysical Journal",
    reference: "ApJ 142, 419–421; doi:10.1086/148307",
    url: "https://doi.org/10.1086/148307",
    sourceType: "academic_paper",
    publishedYear: 1965,
    publishedDisplay: "1965",
    notes:
      "Two and a half pages reporting an unexplained excess temperature at the Holmdel horn antenna. Cited precisely as far as it goes: it reports a measurement and does not interpret it. The cosmological reading was published alongside it by other people.",
  },
  {
    key: "dicke1965",
    title: "Cosmic Black-Body Radiation",
    author: "R. H. Dicke, P. J. E. Peebles, P. G. Roll and D. T. Wilkinson",
    workTitle: "The Astrophysical Journal",
    reference: "ApJ 142, 414–419",
    sourceType: "academic_paper",
    publishedYear: 1965,
    publishedDisplay: "1965",
    notes:
      "The companion letter that supplied the interpretation Penzias and Wilson's paper withheld: the excess is relic radiation from a hot early universe. Cited to keep the discovery and its meaning as two separate acts, which is what they were.",
  },
  {
    key: "steinhardt_turok2002",
    title: "Cosmic Evolution in a Cyclic Universe",
    author: "P. J. Steinhardt and N. Turok",
    workTitle: "Physical Review D",
    reference: "Phys. Rev. D 65, 126003 (2002); preprint arXiv:hep-th/0111098",
    url: "https://arxiv.org/abs/hep-th/0111098",
    sourceType: "academic_paper",
    publishedYear: 2002,
    publishedDisplay: "2002",
    notes:
      "One specific cyclic proposal, drawn from the ekpyrotic scenario: an endless sequence of epochs each beginning in a big bang and ending in a big crunch. Cited as itself and not as \"the cyclic theory\" — there is no such single thing.",
  },
  {
    key: "ashtekar2006",
    title: "Quantum Nature of the Big Bang",
    author: "A. Ashtekar, T. Pawlowski and P. Singh",
    workTitle: "Physical Review Letters",
    reference: "Phys. Rev. Lett. 96, 141301 (2006)",
    url: "https://link.aps.org/doi/10.1103/PhysRevLett.96.141301",
    sourceType: "academic_paper",
    publishedYear: 2006,
    publishedDisplay: "2006",
    notes:
      "A different route to a preceding phase: in loop quantum cosmology the big bang is replaced by a bounce, and the evolution runs back through it. Cited as a separate model from the ekpyrotic one, because it is one.",
  },
  {
    key: "penrose2010",
    title: "Cycles of Time: An Extraordinary New View of the Universe",
    author: "Roger Penrose",
    publisher: "The Bodley Head",
    reference: "The Bodley Head, London, 2010, 288 pp.",
    sourceType: "book",
    publishedYear: 2010,
    publishedDisplay: "2010",
    notes:
      "Penrose's conformal cyclic cosmology, in which the universe passes through successive aeons related by a conformal rescaling. A third distinct proposal, listed so that \"cyclic models\" is visibly a family rather than a position.",
  },
  {
    key: "surya_siddhanta",
    title: "Translation of the Sûrya-Siddhânta: A Text-Book of Hindu Astronomy",
    author: "Ebenezer Burgess (translator)",
    reference: "Chapter 1, verses 15–24 and 45–47",
    url: "https://archive.org/details/in.ernet.dli.2015.96668",
    sourceType: "religious_text",
    publishedYear: 1860,
    publishedDisplay: "1860 translation of a Sanskrit astronomical text",
    notes:
      "The structural figures come from here and can be read in the text: the four yugas in the ratio 4:3:2:1, a kalpa of a thousand mahayugas forming a day of Brahma, a night of the same length, and Brahma's life of a hundred such years. Cited for the structure of the reckoning, not as a measurement of anything.",
  },
  {
    key: "ussher1650",
    title: "Annales Veteris Testamenti, a prima mundi origine deducti",
    author: "James Ussher",
    reference:
      "London, 1650. The date is given in the commentary on the first verse of Genesis, as the year 710 of the Julian period, converted in Ussher's own margin to 4004 BC.",
    sourceType: "historical_document",
    publishedYear: 1650,
    publishedDisplay: "1650",
    notes:
      "The work in which the 4004 BCE date is calculated and stated. Cited for what Ussher did: construct a chronology from Biblical genealogies, reigns and other historical material, and place the first day of creation at the nightfall preceding 23 October 4004 BC in the proleptic Julian calendar.",
  },
  {
    key: "ussher_excerpt",
    title: "Excerpt from Ussher's Annals of the World",
    publisher: "Department of Astronomy, The Ohio State University",
    url: "https://www.astronomy.ohio-state.edu/pogge.1/Ast161/Au06/Unit5/ussher.html",
    sourceType: "website",
    notes:
      "An accessible transcription of the opening passage, for a reader who wants to see Ussher's own sentence rather than a description of it. Points at the 1650 work, which is the thing itself.",
    citedBy: "ussher1650",
  },
  {
    key: "wikipedia_ussher",
    title: "Ussher chronology",
    url: "https://en.wikipedia.org/wiki/Ussher_chronology",
    sourceType: "wikipedia",
    notes:
      "Overview, cited for one specific and checkable fact: that other Biblical chronologists reached other dates — Bede 3952 BC, Scaliger 3949 BC, Kepler 3992 BC, Newton around 4000 BC. Follow its references rather than stopping here.",
    citedBy: "ussher1650",
  },
  {
    key: "wikipedia_byzantine",
    title: "Byzantine calendar",
    url: "https://en.wikipedia.org/wiki/Byzantine_calendar",
    sourceType: "wikipedia",
    notes:
      "Cited for the Septuagint-based creation era used for centuries in the Eastern church, which places creation at 5509 BC — fifteen hundred years from Ussher, from a different text of the same scriptures.",
  },
];

// ---------------------------------------------------------------------------
// THE ANCHOR: one record, several genuinely different claims
// ---------------------------------------------------------------------------

const ANCHOR: SeedEvent = {
  slug: COSMOLOGY_ANCHOR_SLUG,
  title: "The beginning, and the age of the universe",
  summary:
    "Whether the universe had a beginning, and if so how long ago — asked by modern cosmology, by earlier cosmological models, by religious and philosophical traditions, and answered differently by each. The answers below are not rival figures for one quantity.",
  description:
    "<p>This record exists to be opened rather than read off a strip. The claims on it are about <strong>different things</strong>: one is the age of the expansion of the observable universe, one is the creation of the world, one is the start of the present cosmic cycle, and one denies that there is a first moment at all. Each says what it is dating, who made the claim, and on what basis.</p>" +
    "<p>The mainstream scientific position is marked as such, and the evidence for it is stated. That is not the same as calling it proven, and the alternatives here are not all alternatives of the same kind: a historical scientific model that lost an argument to evidence, a family of current theoretical proposals that are actively researched but not established, a religious cosmology, and a seventeenth-century calculation from scripture are four different things and are labelled as four different things.</p>" +
    "<p>One thing worth noticing before anything else: the hot Big Bang model describes the <em>evolution and expansion</em> of the observable universe from an extremely hot, dense early state. Whether that state was an absolute beginning, and what if anything came before it, are separate questions — open ones, which working physicists are still investigating.</p>",
  category: "science",
  subcategory: "Cosmology",
  eventType: "disputed",
  eventTypeNote:
    "Marked disputed because the claims here genuinely differ, not because the science is unsettled about the figure it gives. The ~13.8 billion year age is a well-constrained measurement within the standard cosmological model; what is open is what that model is a model OF at its earliest moments.",
  tags: ["cosmology", "universe", "big-bang", "creation", "deep-time"],
  people: ["Hermann Bondi", "Thomas Gold", "Fred Hoyle", "James Ussher", "Paul Steinhardt", "Neil Turok", "Roger Penrose"],
  claims: [
    // --- 1. Standard cosmology, twice, because the measurements differ -------
    {
      sourceKey: "planck2018",
      startYear: Ga(13.797),
      datePrecision: "billion_years",
      precisionDecimals: 3,
      uncertaintyPlus: 23_000_000,
      uncertaintyMinus: 23_000_000,
      isApproximate: false,
      temporalClaimType: "years_ago",
      whatIsDated: "The expansion of the observable universe, counted back to its hot dense early state",
      originalDateText: "13.797 ± 0.023 billion years",
      datingMethod: "estimate",
      chronology: "scientific",
      evidence:
        "WHAT IS CLAIMED: that the observable universe has been expanding from an extremely hot, dense early state for about 13.8 billion years. HOW THE AGE IS OBTAINED: not by observing the moment and counting forwards — nobody can — but by fitting a cosmological model to observations and reading the age off as one of its derived parameters. The observations behind this figure are the temperature and polarisation patterns of the cosmic microwave background measured by the Planck satellite, supported by the expansion rate, the abundances of the light elements formed in the first minutes, and the large-scale distribution of galaxies. IMPORTANT LIMITATION: the age is model-dependent. It is the age within the standard cosmological model, and it moves when the model or the data move — which is exactly what the second Planck figure on this record demonstrates. The hot Big Bang model also does not by itself settle whether this state was an absolute beginning, or what if anything preceded it.",
      notes:
        "The value from the CMB-only fit (TT,TE,EE+lowE+lensing). Shown to three decimal places here because a second measurement is being distinguished from it; the record's headline rounds to ~13.8 billion years, which is the honest way to state it in passing.",
    },
    {
      sourceKey: "planck2018",
      startYear: Ga(13.801),
      datePrecision: "billion_years",
      precisionDecimals: 3,
      uncertaintyPlus: 24_000_000,
      uncertaintyMinus: 24_000_000,
      isApproximate: false,
      temporalClaimType: "years_ago",
      whatIsDated: "The expansion of the observable universe, counted back to its hot dense early state",
      originalDateText: "13.801 ± 0.024 billion years",
      datingMethod: "estimate",
      chronology: "scientific",
      evidence:
        "THE SAME SATELLITE, THE SAME YEAR, A DIFFERENT COMBINATION OF DATA: the CMB measurements together with baryon acoustic oscillations, a separate measurement of the scale imprinted on the distribution of galaxies. It is here as its own claim rather than folded into the one above because that is what the data are — two fits, four million years apart, each with its own error bar, and both published in the same table of the same paper.",
      notes:
        "This is what an honest treatment of measurement looks like at the resolution the sources actually give. The two figures agree comfortably within their stated uncertainties; the point is not that they conflict but that a measured age is a fitted number with a provenance, not a timestamp.",
    },

    // --- 2. Steady State: the claim with no date ----------------------------
    {
      sourceKey: "bondi_gold1948",
      temporalClaimType: "no_beginning",
      datePrecision: "year",
      isApproximate: false,
      whatIsDated: "Whether the universe has a first moment at all",
      originalDateText: "No finite beginning — an eternal universe in a steady state",
      datingMethod: "other",
      chronology: "historical",
      evidence:
        "WHAT IS CLAIMED: that the universe expands but its large-scale properties do not change, because new matter is continuously created to keep the mean density constant. WHY THERE IS NO DATE: on this model there is no finite creation event to date. The universe has always looked broadly as it looks now, so a question like \"how long ago did it start?\" has no answer within the model — not an unknown answer, no answer. That is a positive claim about the nature of time, argued for in the two 1948 papers, and it is the reason this record required the timeline to be able to hold a claim with no position. MODERN STATUS: not the prevailing cosmological model. Observations from the 1960s onwards — the cosmic microwave background above all, together with evidence that the distant universe genuinely looks different from the nearby one — told strongly in favour of an evolving universe with a hot dense early phase and against the classical steady state.",
      notes:
        "Kept because it is one of the most useful things on this timeline for a student: a serious, mathematically developed, respectable scientific model, held by first-rate physicists, that lost an argument to evidence. Science changing its mind is the process working, not the process failing.",
    },

    // --- 3. Cyclic and bouncing models --------------------------------------
    {
      sourceKey: "steinhardt_turok2002",
      temporalClaimType: "cyclic",
      datePrecision: "year",
      isApproximate: false,
      whatIsDated: "Whether our expanding phase was preceded by an earlier cosmic phase",
      originalDateText: "Possibly no single beginning — an earlier phase may precede our expansion",
      datingMethod: "other",
      chronology: "hypothesis",
      evidence:
        "WHAT IS CLAIMED: that our present expanding phase may have been preceded by something else — a contraction, a bounce, a previous cycle, or an earlier state before the hot Big Bang phase. THIS IS A FAMILY, NOT A THEORY. The ekpyrotic cyclic model of Steinhardt and Turok, the bounce of loop quantum cosmology, and Penrose's conformal cyclic cosmology are genuinely different proposals with different mathematics and different motivations, and this timeline will hold them as separate records rather than merging them into one \"cyclic universe theory\", which does not exist. THE POINT THEY SHARE, which is worth a student's attention: a hot Big Bang phase and an absolute beginning are not the same thing. A model can contain the first without asserting the second. IMPORTANT LIMITATION: none of these has anything like the empirical establishment of standard ΛCDM cosmology. They are active theoretical research, not competing measurements, and saying so is not a dismissal.",
      notes:
        "Three proposals are cited on this claim rather than one, so that the plurality is visible in the citations themselves.",
      citations: [
        {
          sourceKey: "ashtekar2006",
          relation: "supports",
          note: "A different route to a preceding phase: in loop quantum cosmology the big bang is replaced by a bounce that the evolution can be followed back through.",
        },
        {
          sourceKey: "penrose2010",
          relation: "supports",
          note: "A third, unrelated proposal — successive aeons related by a conformal rescaling. Listed to show that these models do not agree with each other either.",
        },
      ],
    },

    // --- 4. Hindu cosmology: structure, given as lengths --------------------
    {
      sourceKey: "surya_siddhanta",
      temporalClaimType: "cyclic",
      durationYears: 4_320_000,
      datePrecision: "year",
      isApproximate: false,
      whatIsDated: "The length of one mahayuga — the four yugas together",
      originalDateText: "One mahayuga: 4,320,000 years",
      datingMethod: "textual_interpretation",
      chronology: "hindu",
      evidence:
        "WHAT IS CLAIMED: the four yugas — Krita, Treta, Dvapara and Kali — run in the ratio 4:3:2:1 and together make one mahayuga. WHY THIS IS A LENGTH AND NOT A DATE: it is the duration of a cycle, not a position in one. Asking when a mahayuga started is a question from a different cosmology. EVIDENCE TYPE: a religious and philosophical cosmology, read from a text. Not a measurement, and not offered as one.",
    },
    {
      sourceKey: "surya_siddhanta",
      temporalClaimType: "cyclic",
      durationYears: 4_320_000_000,
      datePrecision: "year",
      isApproximate: false,
      whatIsDated: "The length of one kalpa — a day of Brahma",
      originalDateText: "One kalpa, a day of Brahma: a thousand mahayugas, 4.32 billion years",
      datingMethod: "textual_interpretation",
      chronology: "hindu",
      evidence:
        "A thousand mahayugas make a kalpa, which is a day of Brahma, and his night is of the same length — so a full day and night is about 8.64 billion years. WORTH NOTICING, AND WORTH NOT OVER-READING: a kalpa is within a factor of about three of the age modern cosmology gives the universe. That is a genuinely striking feature of the tradition's scale, and it is not evidence of anything. The figure is arrived at by a completely different route, describes a different thing, and sits inside a cycle that repeats.",
      notes:
        "This claim is the clearest case on the timeline for why a length needs its own field. Stored as a duration, it can be compared with 13.8 billion years directly; stored as a date, it would have had to be given a position in a cosmology that does not have one.",
    },
    {
      sourceKey: "surya_siddhanta",
      temporalClaimType: "cyclic",
      durationYears: 311_040_000_000_000,
      datePrecision: "year",
      isApproximate: false,
      whatIsDated: "The full lifespan of Brahma in the traditional calculation",
      originalDateText: "A hundred years of Brahma: about 311.04 trillion years",
      datingMethod: "textual_interpretation",
      chronology: "hindu",
      evidence:
        "Brahma's life is a hundred years reckoned in days and nights of a kalpa each, which works out at roughly 311.04 trillion years — and then the whole structure begins again. WHAT THIS RECORD DOES NOT SAY: that the Hindu universe has a single age, quoted in the hundreds of trillions of years. A figure of that kind depends on which traditional calculation is followed and on precisely what is being measured, and the passage supporting the commonly quoted elapsed total could not be verified for this dataset. The structure is given; the position within it is left to the one claim below that can be sourced.",
    },
    {
      sourceKey: "surya_siddhanta",
      startYear: bce(3102),
      datePrecision: "year",
      isApproximate: false,
      temporalClaimType: "calculated_date",
      whatIsDated: "The start of the present Kali Yuga in traditional Indian astronomical reckoning",
      originalDateText: "Kali Yuga begins: 3102 BCE",
      datingMethod: "astronomical",
      chronology: "hindu",
      evidence:
        "WHAT IS CLAIMED: that the present Kali Yuga began in 3102 BCE — by the Surya Siddhanta's reckoning at midnight on 18 February, which is 17 February in the proleptic Julian calendar. HOW IT IS OBTAINED: by astronomical calculation. The text counts days from this epoch and takes the planets to have been aligned at a fixed reference point on day zero. Aryabhata independently anchors himself to it, writing that he was twenty-three when 3,600 years of the Kali Yuga had passed. WHY THIS ONE HAS A DATE when the others above do not: it is a position within the cycle rather than a length of one, and it is the part of the reckoning the tradition's own astronomy actually fixes.",
      notes:
        "This is the current-position claim, and the only one this dataset makes. It is here because it can be sourced to the reckoning that states it.",
    },

    // --- 5. Ussher --------------------------------------------------------
    {
      sourceKey: "ussher1650",
      startYear: bce(4004),
      startMonth: 10,
      startDay: 23,
      datePrecision: "day",
      isApproximate: false,
      temporalClaimType: "calculated_date",
      whatIsDated: "The creation of the world, in Ussher's reckoning from Biblical chronology",
      originalDateText: "the beginning of the night which preceded the 23rd day of October, 4004 BCE",
      datingMethod: "genealogy",
      chronology: "biblical",
      evidence:
        "WHAT IS CLAIMED: that creation occurred in 4004 BCE. WHO CALCULATED IT: James Ussher, Archbishop of Armagh, in a work published in 1650. HOW THE DATE WAS OBTAINED: by constructing a chronology from Biblical genealogies, reigns and other historical material, and anchoring it to dates fixed by classical and astronomical sources. THE DISTINCTION THIS RECORD EXISTS TO MAKE: the Bible does not say 4004 BCE. No such date appears anywhere in Genesis. Ussher CALCULATED it, and the calculation is his — which is why other chronologists working from the same scriptures arrived elsewhere: Bede at 3952 BC, Scaliger at 3949 BC, Kepler at 3992 BC, Newton at around 4000 BC, and the Septuagint-based reckoning used for centuries in the Eastern church at 5509 BC, some fifteen hundred years earlier. EVIDENCE TYPE: textual and theological chronology. IMPORTANT LIMITATION: 4004 BCE is not the modern scientific estimate for the age of the universe, and this record does not present it as an alternative measurement of the same thing — Ussher is dating the creation of the world, which is a different proposition from the age of cosmic expansion.",
      notes:
        "Ussher's own sentence gives the date as the year 710 of the Julian period, converted in his margin to 4004 BC. The day and month are recorded here because he gave them; the precision is his, not this timeline's.",
      citations: [
        {
          sourceKey: "wikipedia_ussher",
          relation: "context",
          note: "Where the comparison dates from Bede, Scaliger, Kepler and Newton come from. An overview source — follow its references for the chronologies themselves.",
        },
        {
          sourceKey: "wikipedia_byzantine",
          relation: "context",
          note: "The Septuagint-based era at 5509 BC, which shows how much of the spread comes from which text of the scriptures is being counted.",
        },
        {
          sourceKey: "ussher_excerpt",
          relation: "supports",
          note: "A transcription of the passage itself, for reading Ussher's wording rather than a description of it.",
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// THE HUMAN EVENTS: when these claims were actually made
//
// The second clock. Every claim on the anchor was made by somebody at some
// point, and those moments are datable even when the claim is not — the
// steady-state universe has no beginning, and the paper proposing it was
// submitted in July 1948. Separating the two is what lets a student see that
// cosmology has a history rather than a verdict.
// ---------------------------------------------------------------------------

const HISTORY: SeedEvent[] = [
  {
    slug: "steady-state-proposed",
    title: "Bondi, Gold and Hoyle propose the steady-state universe",
    summary:
      "Two papers in the same 1948 volume of Monthly Notices set out a universe that expands without changing and without beginning.",
    description:
      "<p>Bondi and Gold's paper was submitted in July 1948 and Hoyle's a month later; both appeared in volume 108. They reach a similar conclusion by different routes, and are usually referred to together even though they are not the same argument.</p><p>The motivation was partly a problem that has since gone away: the expansion rates then available implied an age for the universe younger than the estimated ages of stars within it. A universe with no beginning has no such difficulty.</p>",
    category: "science",
    subcategory: "Cosmology",
    eventType: "historical",
    tags: ["cosmology", "steady-state", "1948"],
    people: ["Hermann Bondi", "Thomas Gold", "Fred Hoyle"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Fred_Hoyle_1967.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Fred_Hoyle_1967.jpg?width=1024",
        shows: "portrait",
        caption:
          "Fred Hoyle, photographed in 1967 \u2014 nineteen years after the steady-state papers. Hoyle coined the " +
          "phrase 'big bang' for the theory he was arguing against, and it is the name that stuck.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "bondi_gold1948",
        startYear: 1948,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        originalDateText: "1948",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "The publication year of both papers in Monthly Notices of the Royal Astronomical Society, volume 108. Bondi and Gold at pages 252–270, submitted in July; Hoyle at pages 372–382, submitted in August.",
        citations: [
          {
            sourceKey: "hoyle1948",
            relation: "supports",
            note: "Hoyle's separate formulation, in the same volume — a creation field added to the field equations rather than Bondi and Gold's perfect cosmological principle.",
          },
        ],
      },
    ],
  },
  {
    slug: "cosmic-microwave-background-detected",
    title: "The cosmic microwave background is detected",
    summary:
      "An unexplained excess temperature at a Bell Labs antenna, and — in a companion paper by other authors — the suggestion that it is relic radiation from a hot early universe.",
    description:
      "<p>Two letters were published together in the same 1965 issue. Penzias and Wilson report a measurement and carefully do not interpret it. Dicke, Peebles, Roll and Wilkinson supply the interpretation: radiation left over from a hot, dense early phase.</p><p>Keeping them apart matters. The discovery and its meaning were two separate acts by two separate groups, and the pairing is a small lesson in how evidence becomes an argument.</p>",
    category: "science",
    subcategory: "Cosmology",
    eventType: "historical",
    tags: ["cosmology", "cmb", "evidence", "1965"],
    people: ["Arno Penzias", "Robert Wilson", "Robert Dicke", "James Peebles"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Horn_Antenna-in_Holmdel,_New_Jersey.jpeg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Horn_Antenna-in_Holmdel,_New_Jersey.jpeg?width=1024",
        shows: "site",
        caption:
          "The horn antenna at Holmdel, New Jersey. Penzias and Wilson were not looking for the cosmic " +
          "microwave background; they were trying to get rid of a noise they could not explain, and had cleaned " +
          "the pigeon droppings out of this antenna in the attempt.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "penzias_wilson1965",
        startYear: 1965,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        originalDateText: "1965",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "Publication in The Astrophysical Journal volume 142: Penzias and Wilson at pages 419–421, reporting an excess antenna temperature of about 3.5 K at 4080 Mc/s; Dicke, Peebles, Roll and Wilkinson at pages 414–419, reading it as cosmic black-body radiation.",
        citations: [
          {
            sourceKey: "dicke1965",
            relation: "supports",
            note: "The interpretation paper. Penzias and Wilson's own letter reports the measurement and stops there.",
          },
        ],
      },
    ],
  },
  {
    slug: "cyclic-universe-model-proposed",
    title: "Steinhardt and Turok propose a cyclic universe",
    summary:
      "An ekpyrotic cyclic cosmology in which our expanding phase is one of an endless sequence, each beginning in a bang and ending in a crunch.",
    description:
      "<p>One proposal among several that put something before the hot Big Bang phase. It is seeded as its own record so that it can be read as a specific model with specific authors, rather than as evidence for a general idea.</p>",
    category: "science",
    subcategory: "Cosmology",
    eventType: "hypothesised",
    tags: ["cosmology", "cyclic", "ekpyrotic", "2002"],
    people: ["Paul Steinhardt", "Neil Turok"],
    claims: [
      {
        sourceKey: "steinhardt_turok2002",
        startYear: 2002,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        originalDateText: "2002",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "Published in Physical Review D volume 65, article 126003, in 2002, developing the ekpyrotic scenario introduced the previous year. A companion paper appeared in Science the same year.",
      },
    ],
  },
  {
    slug: "loop-quantum-bounce-proposed",
    title: "Loop quantum cosmology replaces the big bang with a bounce",
    summary:
      "A 2006 result in which the quantum evolution runs back through what classical cosmology treats as the beginning.",
    description:
      "<p>A separate line of work from the ekpyrotic models, arriving at a comparable conclusion from quantum gravity rather than from branes: the classical singularity is replaced by a bounce, and the evolution is deterministic across it.</p>",
    category: "science",
    subcategory: "Cosmology",
    eventType: "hypothesised",
    tags: ["cosmology", "quantum-gravity", "bounce", "2006"],
    people: ["Abhay Ashtekar", "Tomasz Pawlowski", "Parampreet Singh"],
    claims: [
      {
        sourceKey: "ashtekar2006",
        startYear: 2006,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        originalDateText: "2006",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "Published in Physical Review Letters volume 96, article 141301, in 2006.",
      },
    ],
  },
  {
    slug: "planck-final-cosmological-parameters",
    title: "Planck publishes its final cosmological parameters",
    summary:
      "The measurement the ~13.8 billion year figure comes from — and the reason this record is dated twice, because the data release and the published paper are two years apart.",
    description:
      "<p>The Planck satellite's final parameter results were released in 2018 and published in Astronomy &amp; Astrophysics in 2020. The age of the universe is not measured directly by any of it: it is a derived parameter of the model that best fits the observations.</p>",
    category: "science",
    subcategory: "Cosmology",
    eventType: "scientific_model",
    tags: ["cosmology", "planck", "cmb", "measurement"],
    civilisations: [],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Cosmic_Microwave_Background_(CMB).jpeg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/Cosmic_Microwave_Background_(CMB).jpeg?width=1024",
        shows: "scientific_figure",
        caption:
          "The cosmic microwave background as mapped by Planck. WHAT THE COLOURS ARE: temperature differences " +
          "of a few parts in a hundred thousand, stretched enormously so they can be seen at all. The sky is " +
          "very nearly uniform, and the age of the universe is read out of the faint pattern in what is left.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "planck2018",
        startYear: 2018,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        whatIsDated: "When the results were released",
        originalDateText: "2018 (data release)",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence: "The final Planck parameter results were made public in 2018, as the preprint arXiv:1807.06209.",
      },
      {
        sourceKey: "planck2018",
        startYear: 2020,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        whatIsDated: "When the paper was published",
        originalDateText: "2020 (journal publication)",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "Published as Astronomy & Astrophysics volume 641, article A6, in 2020. The two dates are kept apart because they are two different facts, and a citation that conflates them sends a reader to the wrong year.",
      },
    ],
  },
  {
    slug: "ussher-annals-published",
    title: "Ussher publishes the Annales Veteris Testamenti",
    summary:
      "The 1650 work in which the 4004 BCE creation date is calculated — not quoted from scripture, but worked out.",
    description:
      "<p>Ussher's chronology was an enormous piece of scholarship in its own terms, synthesising Biblical genealogies with classical and astronomical evidence. Its date for creation later appeared in the margins of printed Bibles, which is how a calculation by a named seventeenth-century scholar came to look to many readers like something the text itself said.</p>",
    category: "history",
    subcategory: "Chronology",
    eventType: "historical",
    tags: ["chronology", "biblical", "ussher", "1650"],
    people: ["James Ussher"],
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/James_Ussher_by_Sir_Peter_Lely.jpg?width=1024",
    media: [
      {
        url:
          "https://commons.wikimedia.org/wiki/Special:FilePath/James_Ussher_by_Sir_Peter_Lely.jpg?width=1024",
        shows: "portrait",
        caption:
          "James Ussher, Archbishop of Armagh, by Peter Lely. A working scholar of chronology using the best " +
          "comparative material available to him in the 1650s, whose date is now quoted as though it were a " +
          "claim of scripture rather than a calculation of his.",
        kind: "image",
        // Written WITHOUT its credit: the credit is fetched from the picture's
        // own source at seed time and appended then. See resolveCredits.
        creditFrom: "source",
      },
    ],
    claims: [
      {
        sourceKey: "ussher1650",
        startYear: 1650,
        datePrecision: "year",
        isApproximate: false,
        temporalClaimType: "absolute_date",
        originalDateText: "1650",
        datingMethod: "historical_record",
        chronology: "conventional",
        evidence:
          "Publication of Annales Veteris Testamenti, a prima mundi origine deducti in 1650, the volume in which the creation date is derived and stated.",
        citations: [
          {
            sourceKey: "ussher_excerpt",
            relation: "supports",
            note: "A transcription of the passage where the date is given.",
          },
        ],
      },
    ],
  },
  {
    slug: "kali-yuga-begins",
    title: "The present Kali Yuga begins",
    summary:
      "3102 BCE in traditional Indian astronomical reckoning — the one datable position within the Hindu cosmic cycles that this dataset seeds.",
    description:
      "<p>The Surya Siddhanta measures elapsed days from this epoch and takes the planets to have been aligned at a fixed reference point on day zero. Aryabhata anchors himself to the same epoch.</p><p>It is a position <em>within</em> a repeating cycle, which is why it can be dated when the cycle lengths themselves cannot.</p>",
    category: "religion",
    subcategory: "Cosmology",
    eventType: "traditional_account",
    tags: ["hindu", "cosmology", "yuga", "chronology"],
    claims: [
      {
        sourceKey: "surya_siddhanta",
        startYear: bce(3102),
        startMonth: 2,
        startDay: 18,
        datePrecision: "day",
        isApproximate: false,
        temporalClaimType: "calculated_date",
        originalDateText: "18 February 3102 BCE (17 February in the proleptic Julian calendar)",
        datingMethod: "astronomical",
        chronology: "hindu",
        evidence:
          "The epoch from which the Surya Siddhanta counts. Given as midnight on 18 February 3102 BCE in its own reckoning; the corresponding proleptic Julian date is 17 February, and both are recorded here rather than one being silently chosen.",
      },
    ],
  },
];

export const COSMOLOGY_EVENTS: SeedEvent[] = [ANCHOR, ...HISTORY];

// ---------------------------------------------------------------------------
// The relationships
//
// Every edge here answers "who connected these, and how?". The two that matter
// most are the ones that keep evidence and endorsement apart: the CMB is
// offered as evidence against the steady state, and Ussher's publication is
// the SOURCE of the 4004 BCE claim rather than support for it.
// ---------------------------------------------------------------------------

export const COSMOLOGY_LINKS: SeedEventLink[] = [
  {
    from: "steady-state-proposed",
    to: COSMOLOGY_ANCHOR_SLUG,
    relation: "source_of",
    viewpoint: "historical",
    sourceKey: "bondi_gold1948",
    note: "The 1948 papers are where the no-beginning claim on this record comes from. The model has no date; the papers proposing it have one, and that is the distinction this pair of records exists to hold.",
  },
  {
    from: "cosmic-microwave-background-detected",
    to: "steady-state-proposed",
    relation: "responds_to",
    viewpoint: "conventional",
    sourceKey: "dicke1965",
    note: "The observation that told most strongly against the classical steady state. Filed as answering it rather than as disproving it: what the 1965 letters establish is a hot early phase, and the consequences for the steady-state model follow from that rather than being announced in them.",
  },
  {
    from: "cosmic-microwave-background-detected",
    to: COSMOLOGY_ANCHOR_SLUG,
    relation: "evidence_for",
    viewpoint: "scientific",
    sourceKey: "penzias_wilson1965",
    note: "Relic radiation from a hot dense early state is among the strongest evidence for the expansion history the ~13.8 billion year age is read off. Offered as evidence, which is a stronger claim than relevance, and the citation says exactly which paper supplies what.",
  },
  {
    from: "planck-final-cosmological-parameters",
    to: COSMOLOGY_ANCHOR_SLUG,
    relation: "source_of",
    viewpoint: "scientific",
    sourceKey: "planck2018",
    note: "Both mainstream age claims on this record are values from this paper's parameter tables.",
  },
  {
    from: "cyclic-universe-model-proposed",
    to: COSMOLOGY_ANCHOR_SLUG,
    relation: "source_of",
    viewpoint: "hypothesis",
    sourceKey: "steinhardt_turok2002",
    note: "One of the three proposals behind the cyclic claim on this record. Not the cyclic model — one of them.",
  },
  {
    from: "loop-quantum-bounce-proposed",
    to: "cyclic-universe-model-proposed",
    relation: "related",
    sourceKey: "ashtekar2006",
    note: "Two independent routes to a phase preceding our expansion, from quantum gravity and from branes respectively. Linked as worth reading alongside each other and explicitly NOT as agreement: they are different models, and neither corroborates the other.",
  },
  {
    from: "ussher-annals-published",
    to: COSMOLOGY_ANCHOR_SLUG,
    relation: "source_of",
    viewpoint: "biblical",
    sourceKey: "ussher1650",
    note: "The 1650 volume is where 4004 BCE is calculated. The claim on the anchor is Ussher's conclusion; this record is the act of publishing it, and the two are dated 5,654 years apart.",
  },
  {
    from: "kali-yuga-begins",
    to: COSMOLOGY_ANCHOR_SLUG,
    relation: "relevant",
    viewpoint: "hindu",
    sourceKey: "surya_siddhanta",
    note: "A position within the cycles the anchor describes structurally. Linked as relevant rather than as evidence: it locates the present moment inside a traditional reckoning and establishes nothing about the age of the universe.",
  },
];
