// Lunar gardening engine.
//
// The moon-phase calculation is a pure function of the date — a synodic-month
// count from a fixed reference new moon — so any date maps deterministically to
// one of four phases with zero stored data. Adapted from the shamba.online
// Lunar Farming Planner so the platform shares one lunar model.
//
// This drives the Moon Gardening section on each crop page: it pairs the crop's
// group (leaf / fruit / root / flower) with the phases traditionally best for
// sowing and harvesting it, and surfaces the current phase's guidance.

export const MOON_PHASES = ["New Moon", "Waxing Moon", "Full Moon", "Waning Moon"] as const;
export type MoonPhase = (typeof MOON_PHASES)[number];

const SYNODIC_MONTH = 29.53058867; // days between new moons
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0); // a reference new moon

// Position in the lunar cycle, 0 (new) .. 0.5 (full) .. 1 (new again).
export function moonAgeFraction(d: Date): number {
  const noonUTC = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 12);
  const days = (noonUTC - KNOWN_NEW_MOON) / 86400000;
  let frac = (days % SYNODIC_MONTH) / SYNODIC_MONTH;
  if (frac < 0) frac += 1;
  return frac;
}

// Map the continuous cycle onto four named phases, each a quarter-cycle window
// centred on its cardinal moment.
export function calcMoonPhase(d: Date): MoonPhase {
  const f = moonAgeFraction(d);
  if (f < 0.125 || f >= 0.875) return "New Moon";
  if (f < 0.375) return "Waxing Moon";
  if (f < 0.625) return "Full Moon";
  return "Waning Moon";
}

export const PHASE_EMOJI: Record<MoonPhase, string> = {
  "New Moon": "🌑",
  "Waxing Moon": "🌒",
  "Full Moon": "🌕",
  "Waning Moon": "🌘",
};

export const PHASE_HEADLINE: Record<MoonPhase, string> = {
  "New Moon": "Plan & prepare",
  "Waxing Moon": "Sow & grow upward",
  "Full Moon": "Transplant & feed",
  "Waning Moon": "Roots, pruning & harvest",
};

export const PHASE_GUIDANCE: Record<MoonPhase, string> = {
  "New Moon": "A resting point in the cycle — good for planning, soil preparation, composting and seed selection rather than heavy planting.",
  "Waxing Moon": "Rising sap favours leafy greens and above-ground crops, seed soaking and propagation — growth that reaches upward.",
  "Full Moon": "Peak growth energy for transplanting, watering and feeding; moisture retention is strong.",
  "Waning Moon": "Energy moves to the roots — the traditional window for root crops and tubers, pruning, weeding and harvesting for storage.",
};

// The traditional crop groups, each with the phase best for sowing and for
// harvesting. Every crop maps to one group from its edible part / category.
export type CropLunarGroup = "leaf" | "fruit" | "root" | "flower";

export const GROUP_LABEL: Record<CropLunarGroup, string> = {
  leaf: "Leaf crop",
  fruit: "Fruit / seed crop",
  root: "Root crop",
  flower: "Flower crop",
};

export const GROUP_SOW_PHASE: Record<CropLunarGroup, MoonPhase> = {
  leaf: "Waxing Moon",
  fruit: "Waxing Moon",
  root: "Waning Moon",
  flower: "Waxing Moon",
};

export const GROUP_HARVEST_PHASE: Record<CropLunarGroup, MoonPhase> = {
  leaf: "Full Moon", // harvest leaf and fruit for immediate use around the full moon
  fruit: "Full Moon",
  root: "Waning Moon", // roots store best when harvested on a waning moon
  flower: "Waxing Moon",
};

// Derive a crop's lunar group from its edible part first (most specific), then
// its category. Defaults to "fruit" (above-ground) when nothing else matches.
export function cropLunarGroup(input: { edible_part?: string | null; category?: string | null }): CropLunarGroup {
  const hay = `${input.edible_part ?? ""} ${input.category ?? ""}`.toLowerCase();
  if (/(root|tuber|bulb)/.test(hay)) return "root";
  if (/(leaf|leaves|herb|green)/.test(hay)) return "leaf";
  if (/(flower|bloom)/.test(hay)) return "flower";
  return "fruit";
}
