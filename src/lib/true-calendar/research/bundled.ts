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
] as const;

export type BundledResearchId = (typeof BUNDLED_RESEARCH)[number]["id"];
