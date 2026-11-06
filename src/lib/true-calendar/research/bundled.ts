import "server-only";

// Research files that ship with the app (docs/true-calendar/research), so a
// reviewer can import them with one press instead of finding the file.
// Each is a true-calendar/v1 file; importing goes through the same plan,
// validation and upsert as a pasted file.

export const BUNDLED_RESEARCH = [
  {
    id: "catalogue-west-africa",
    title: "West African traditions to research",
    description: "Adds 13 West African traditions to the History directory as research targets (name and region only, no claims): Ewe, Ga-Adangbe, Fon, Edo, Tiv, Hausa, Fulani, Mossi, Dagomba, Bamana, Mande, Wolof, Serer.",
    load: () => import("../../../../docs/true-calendar/research/catalogue-west-africa.v1.json").then((m) => m.default as unknown),
  },
  {
    id: "batch-01",
    title: "Research batch 01",
    description: "Hawaiian Oʻahu lunar nights, Māori maramataka nights, Akan Adaduanan and Akwasidae dates.",
    load: () => import("../../../../docs/true-calendar/research/batch-01.v1.json").then((m) => m.default as unknown),
  },
  {
    id: "batch-02",
    title: "Research batch 02",
    description: "Te Papa's maramataka sequence, Egyptian lunar and civil calendars, Athenian month days, Igbo market week, Ellis's Yoruba five-day week.",
    load: () => import("../../../../docs/true-calendar/research/batch-02.v1.json").then((m) => m.default as unknown),
  },
  {
    id: "batch-03",
    title: "Research batch 03",
    description: "A second published source for the 2026 Akwasidae dates (Nyame Dua), with its caution that they are not universal to all Akan groups.",
    load: () => import("../../../../docs/true-calendar/research/batch-03.v1.json").then((m) => m.default as unknown),
  },
  {
    id: "batch-04",
    title: "Research batch 04",
    description: "Seven modern, optional suggestions for 2 to 8 November 2026, shown as \"A suggestion for the day\". Not attributed to any tradition.",
    load: () => import("../../../../docs/true-calendar/research/batch-04.v1.json").then((m) => m.default as unknown),
  },
  {
    id: "batch-05",
    title: "Research batch 05",
    description: "Practices and modern readings for Māori, Hawaiian, Athenian and Igbo nights and days, an Artemis day, and the caveat that the 2026 Akwasidae dates are a secondary listing.",
    load: () => import("../../../../docs/true-calendar/research/batch-05.v1.json").then((m) => m.default as unknown),
  },
  {
    id: "batch-06",
    title: "Research batch 06",
    description: "A Ngāti Kahungunu maramataka of 30 nights and the 12 Ngāi Tūhoe months (both from Te Ara). Its Hawaiian nights and Igbo market days were already in from batches 01 and 02.",
    load: () => import("../../../../docs/true-calendar/research/batch-06.v1.json").then((m) => m.default as unknown),
  },
  {
    id: "batch-07",
    title: "Research batch 07",
    description: "Hesiod's days of the month (Works and Days), the Egyptian calendar of lucky and unlucky days, and three Hawaiian seasonal months. None of these get Gregorian dates.",
    load: () => import("../../../../docs/true-calendar/research/batch-07.v1.json").then((m) => m.default as unknown),
  },
  {
    id: "batch-08",
    title: "Research batch 08",
    description: "Babylonian moon-day knowledge: the month that began at the first crescent, the unfavourable 7th, 14th, 21st and 28th, the full-Moon šapattu, the twelve months, and day-by-day advice from the hemerologies (marrying, travel, oaths, food).",
    load: () => import("../../../../docs/true-calendar/research/batch-08.v1.json").then((m) => m.default as unknown),
  },
  {
    id: "batch-09",
    title: "Research batch 09",
    description: "A line for every day from five more traditions: the Maya day names (with an 1854 highland daykeeper's reading of each), the Akan six- and seven-day weeks and the other three special days of the 42-day cycle, the Igbo market day (Nri count), the Chinese twelve day officers, and the Hindu tithi with its fasts (Ekadashi, Pradosha, Sankashti, Amavasya).",
    load: () => import("../../../../docs/true-calendar/research/batch-09.v1.json").then((m) => m.default as unknown),
  },
  {
    id: "batch-10",
    title: "Research batch 10",
    description: "Personal Moon's astrology traditions, each kept separate: the twelve places of Hellenistic astrology (Firmicus Maternus, Latin text of 1897), the twelve houses of medieval Arabic astrology (al-Bīrūnī, 1029), the Moon's transits from the birth Moon in Jyotiṣa (Bṛhat Saṃhitā, 1884 translation) and modern Western solar houses. Read by Personal Moon only, never shown as day records.",
    load: () => import("../../../../docs/true-calendar/research/batch-10.v1.json").then((m) => m.default as unknown),
  },
  {
    id: "batch-11",
    title: "Research batch 11",
    description: "A Babylonian line for every day of the Moon's month: the day-by-day calendar of the second Ulūlu from Ashurbanipal's library (Sayce's 1887 translation), with each day's god, luck, the king's offering and, on the 7th, 14th, 19th, 21st and 28th, the restrictions.",
    load: () => import("../../../../docs/true-calendar/research/batch-11.v1.json").then((m) => m.default as unknown),
  },
] as const;

export type BundledResearchId = (typeof BUNDLED_RESEARCH)[number]["id"];
