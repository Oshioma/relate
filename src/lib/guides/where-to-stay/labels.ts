import type {
  AccommodationVariety,
  Atmosphere,
  BeachPosition,
  GuideTag,
  Nightlife,
  RestaurantVariety,
  SwimmingLevel,
  TideImpact,
} from "./types";

// Human labels for the guide's closed values. One place, so the panel, the
// comparison table, the compare view and the admin editor all agree.

export const TAG_LABELS: Record<GuideTag, string> = {
  swimming: "Swimming",
  families: "Families",
  couples: "Couples",
  honeymoon: "Honeymoons",
  solo: "Solo travellers",
  "first-timers": "First-time visitors",
  nightlife: "Nightlife",
  restaurants: "Restaurants",
  cafes: "Cafés",
  kitesurfing: "Kitesurfing",
  diving: "Diving",
  snorkelling: "Snorkelling",
  peace: "Peace and quiet",
  village: "Village life",
  luxury: "Luxury stays",
  budget: "Budget stays",
  "remote-work": "Remote working",
  culture: "Culture",
  sunsets: "Sunsets",
  nature: "Nature",
  wildlife: "Wildlife",
  resort: "Resort holidays",
  shopping: "Shopping",
  walkability: "Walkability",
};

export const ALL_TAGS = Object.keys(TAG_LABELS) as GuideTag[];

// The filters offered above the comparison table, in the order the brief
// lists them. "swimming" here means "best swimming": it matches only places
// whose swimming is rated excellent (see matchesFilter).
export const COMPARISON_FILTERS: { key: GuideTag; label: string }[] = [
  { key: "swimming", label: "Best swimming" },
  { key: "families", label: "Families" },
  { key: "honeymoon", label: "Honeymoons" },
  { key: "nightlife", label: "Nightlife" },
  { key: "restaurants", label: "Restaurants & cafés" },
  { key: "kitesurfing", label: "Kitesurfing" },
  { key: "diving", label: "Diving" },
  { key: "peace", label: "Peace and quiet" },
  { key: "village", label: "Village atmosphere" },
  { key: "luxury", label: "Luxury stays" },
  { key: "budget", label: "Budget stays" },
  { key: "remote-work", label: "Remote working" },
  { key: "culture", label: "Culture" },
  { key: "sunsets", label: "Sunsets" },
];

export const SWIMMING_LABELS: Record<SwimmingLevel, string> = {
  excellent: "Excellent",
  "high-tide": "Good at high tide",
  "tide-dependent": "Tide-dependent",
  limited: "Limited",
};

export const TIDE_LABELS: Record<TideImpact, string> = {
  low: "Low",
  moderate: "Moderate",
  strong: "Strong",
};

export const ATMOSPHERE_LABELS: Record<Atmosphere, string> = {
  peaceful: "Peaceful",
  moderate: "Moderate",
  lively: "Lively",
};

export const NIGHTLIFE_LABELS: Record<Nightlife, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const RESTAURANT_LABELS: Record<RestaurantVariety, string> = {
  limited: "Limited",
  moderate: "Moderate",
  excellent: "Excellent variety",
};

export const ACCOMMODATION_LABELS: Record<AccommodationVariety, string> = {
  limited: "Limited choice",
  good: "Good choice",
  wide: "Wide choice",
};

export const BUDGET_LABELS: Record<"$" | "$$" | "$$$", string> = {
  $: "$ · Budget-friendly",
  $$: "$$ · Mid-range",
  $$$: "$$$ · Upper range",
};

export const POSITION_LABELS: Record<BeachPosition, string> = {
  beachfront: "On the beach",
  cliff: "On a cliff or rocky shore",
  "short-walk": "Short walk to the beach",
  inland: "Inland",
  unknown: "Beach position not verified",
};

// Orderings used when comparing two places ("which has better swimming?").
// Higher is more of the thing named.
export const SWIMMING_ORDER: Record<SwimmingLevel, number> = { excellent: 3, "high-tide": 2, "tide-dependent": 1, limited: 0 };
export const RESTAURANT_ORDER: Record<RestaurantVariety, number> = { excellent: 2, moderate: 1, limited: 0 };
export const NIGHTLIFE_ORDER: Record<Nightlife, number> = { high: 2, medium: 1, low: 0 };
export const QUIET_ORDER: Record<Atmosphere, number> = { peaceful: 2, moderate: 1, lively: 0 };
export const ACCOMMODATION_ORDER: Record<AccommodationVariety, number> = { wide: 2, good: 1, limited: 0 };
