import { FLOOD_MESOPOTAMIA_EVENTS } from "./flood-mesopotamia-seed";
import { FLOOD_EURASIA_EVENTS } from "./flood-eurasia-seed";
import { FLOOD_CHINA_EVENTS } from "./flood-china-seed";
import { FLOOD_AMERICAS_EVENTS } from "./flood-americas-seed";
import { FLOOD_REGIONS_EVENTS } from "./flood-regions-seed";
import { FLOOD_SUBMERGED_EVENTS } from "./flood-submerged-seed";

// =============================================================================
// WHAT THIS TIMELINE COVERS, AND WHAT IT DOES NOT
//
// A comparison across regions is only ever as good as the collecting behind it.
// Twenty-three traditions on a page look like a survey of the world; they are a
// survey of what could be sourced, by one person, in one language, from what
// happened to be published and digitised. The difference matters enough to
// state outright rather than leave a reader to infer from an absence.
//
// SO EVERY GAP HERE HAS A REASON ATTACHED, and the reasons are not
// interchangeable:
//
//   COVERED — there are records, and they are listed by slug.
//
//   NO VERIFIABLE SOURCE — the tradition is real and well known and the
//   citation usually given for it could not be checked to the standard the
//   rest of this material meets. The brief says not to seed what cannot be
//   verified. Ifugao is here, and Nüwa.
//
//   UNDER-COLLECTED — the absence is substantially in the literature rather
//   than in the world. Fewer than two dozen sub-Saharan African flood
//   traditions appear in the standard indexes and Frazer said there were none,
//   which was wrong. An empty row here is a finding about scholarship.
//
//   NOT ATTEMPTED — nobody has looked yet. The honest majority of what is
//   missing, and the easiest to mistake for one of the other three.
//
// THE COVERAGE IS DERIVED, NOT DECLARED. A region claiming records names their
// slugs, and a test resolves every slug against the seeded data. A region
// cannot claim coverage it does not have, and deleting a record turns its
// region's row red rather than leaving a confident line that is no longer true.
// =============================================================================

export type CoverageStatus = "covered" | "no_verifiable_source" | "under_collected" | "not_attempted";

export type RegionCoverage = {
  region: string;
  /** The people or tradition, where the region alone would flatten several. */
  tradition?: string;
  status: CoverageStatus;
  /** Slugs of the records that cover it. Resolved against the seed data by a test. */
  slugs?: string[];
  /** Why, in a sentence a reader can act on. */
  note: string;
};

export const COVERAGE_STATUS_LABELS: Record<CoverageStatus, string> = {
  covered: "Records here",
  no_verifiable_source: "Source could not be verified",
  under_collected: "Under-collected in the literature",
  not_attempted: "Not attempted yet",
};

export const FLOOD_COVERAGE: RegionCoverage[] = [
  {
    region: "Mesopotamia",
    tradition: "Sumerian, Babylonian and Assyrian",
    status: "covered",
    slugs: ["ziusudra-eridu-genesis", "atrahasis-flood", "utnapishtim-gilgamesh-flood", "sumerian-king-list-flood"],
    note: "Three named survivors in three texts, plus the king list that divides its reigns at the flood.",
  },
  {
    region: "The Levant",
    tradition: "Hebrew Bible",
    status: "covered",
    slugs: ["noah-flood-chronologies"],
    note: "Held as three texts giving three different dates, rather than as one chronology.",
  },
  {
    region: "Mesopotamia",
    tradition: "The excavated flood deposits",
    status: "covered",
    slugs: ["ur-flood-deposit", "kish-flood-deposit", "shuruppak-flood-deposit"],
    note: "What was actually dug, kept apart from what was concluded from it.",
  },
  {
    region: "Greece",
    status: "covered",
    slugs: ["deucalion-flood", "ogyges-flood", "plato-many-destructions"],
    note: "Including the best ancient statement of this timeline's own problem: you remember one deluge, there were many.",
  },
  {
    region: "India",
    status: "covered",
    slugs: ["manu-and-the-fish", "matsya-becomes-vishnu"],
    note: "The fish is not Viṣṇu in the oldest telling. The identification is its own dated development.",
  },
  {
    region: "Iran",
    status: "covered",
    slugs: ["yima-and-the-vara"],
    note: "The shape of a flood story with no flood in it — the catastrophe is a killing winter.",
  },
  {
    region: "China",
    status: "covered",
    slugs: ["gun-yu-great-flood", "jishi-gorge-outburst-flood"],
    note: "No ark and no chosen survivor; the moral is about method. The geology is a separate, disputed record.",
  },
  {
    region: "Mesoamerica",
    tradition: "K'iche' Maya",
    status: "covered",
    slugs: ["popol-vuh-wooden-people"],
    note: "The wooden people are a failed attempt at humanity, not humanity.",
  },
  {
    region: "Mesoamerica",
    tradition: "Nahua",
    status: "covered",
    slugs: ["aztec-fourth-sun-flood"],
    note: "An elapsed count that is real and anchored to nothing, kept as a duration.",
  },
  {
    region: "The Andes",
    tradition: "Quechua, Huarochirí",
    status: "covered",
    slugs: ["huarochiri-villca-coto", "huarochiri-manuscript-compiled"],
    note: "An animal gives the warning, and the manuscript records the circumstances of its own making.",
  },
  {
    region: "North America",
    tradition: "Haudenosaunee",
    status: "covered",
    slugs: ["haudenosaunee-sky-woman"],
    note: "Filed here as a CREATION account. There is no flood in it, and compendia count it as one.",
  },
  {
    region: "North America",
    tradition: "Anishinaabe",
    status: "covered",
    slugs: ["anishinaabe-earth-diver"],
    note: "Shares the earth-diver shape with the Haudenosaunee account and stays a separate record.",
  },
  {
    region: "Aotearoa New Zealand",
    tradition: "Māori",
    status: "covered",
    slugs: ["para-whenua-mea-raft"],
    note: "The flood is prayed for, by people, to settle an argument about doctrine.",
  },
  {
    region: "Hawaiʻi",
    status: "covered",
    slugs: ["kai-a-kahinalii"],
    note: "A rising sea in the native historians; closer to Genesis in a collector who drew Christian material in.",
  },
  {
    region: "Australia",
    tradition: "Ngarrindjeri",
    status: "covered",
    slugs: ["ngurunderi-backstairs-passage"],
    note: "When the crossing flooded, and separately the contested proposal that the account remembers it.",
  },
  {
    region: "Australia",
    tradition: "Narungga",
    status: "covered",
    slugs: ["narungga-spencer-gulf"],
    note: "Spencer Gulf as marshy country with freshwater lagoons.",
  },
  {
    region: "Northern Europe",
    tradition: "Norse",
    status: "covered",
    slugs: ["ymir-flood-of-blood"],
    note: "The flood is blood and the victims are giants. There are no people in the story.",
  },
  {
    region: "Southeast Asia",
    tradition: "Ifugao (Philippines)",
    status: "no_verifiable_source",
    note:
      "Wigan and Bugan survive on two mountains and are reunited when the water falls. The citation usually given — H. Otley Beyer — could not be checked to the standard the rest of this material meets, so it is not seeded. This is not a judgement on the tradition.",
  },
  {
    region: "China",
    tradition: "Nüwa",
    status: "no_verifiable_source",
    note:
      "Asked for in the brief as its own entry. The citation could not be verified to the standard the rest of the Chinese material meets, so it was left out rather than filled in thin.",
  },
  {
    region: "Sub-Saharan Africa",
    status: "under_collected",
    note:
      "Fewer than two dozen flood traditions from the whole of sub-Saharan Africa appear in the standard indexes, and Frazer stated there were none at all, which was wrong. THIS ROW IS A FINDING ABOUT SCHOLARSHIP, not about Africa — see the collection-bias record.",
  },
  {
    region: "Melanesia and New Guinea",
    status: "under_collected",
    note: "Named with Africa and Australia as under-represented in the standard compendia. Nothing seeded.",
  },
  {
    region: "Southeast Asia",
    tradition: "Sumatra, Borneo and the Malay archipelago",
    status: "not_attempted",
    note:
      "The Sunda Shelf's drowning is on this timeline as geology; the traditions of the people living around it are not. Nobody has looked yet.",
  },
  {
    region: "Egypt",
    status: "not_attempted",
    note:
      "Worth doing carefully. The Destruction of Mankind is a killing, not a flood, and is regularly listed as a flood myth — the same category error as Sky Woman, in a better-known text.",
  },
  {
    region: "Siberia and Central Asia",
    status: "not_attempted",
    note: "Earth-diver narratives are reported across this belt and would test the North American pattern properly.",
  },
  {
    region: "The Arctic",
    tradition: "Inuit and Yupik",
    status: "not_attempted",
    note:
      "Nobody has looked yet. Worth doing alongside Siberia: if earth-diver narratives run across the north, the two North American records here are one end of something much longer.",
  },
];

/** Every slug this coverage table claims a record for. */
export function claimedSlugs(): string[] {
  return FLOOD_COVERAGE.flatMap((row) => row.slugs ?? []);
}

/** Every flood-dataset slug that actually exists in the seed data. */
export function seededFloodSlugs(): Set<string> {
  return new Set(
    [
      ...FLOOD_MESOPOTAMIA_EVENTS,
      ...FLOOD_EURASIA_EVENTS,
      ...FLOOD_CHINA_EVENTS,
      ...FLOOD_AMERICAS_EVENTS,
      ...FLOOD_REGIONS_EVENTS,
      ...FLOOD_SUBMERGED_EVENTS,
    ].map((event) => event.slug)
  );
}

export function coverageCounts(): Record<CoverageStatus, number> {
  const counts: Record<CoverageStatus, number> = {
    covered: 0,
    no_verifiable_source: 0,
    under_collected: 0,
    not_attempted: 0,
  };
  for (const row of FLOOD_COVERAGE) counts[row.status]++;
  return counts;
}
