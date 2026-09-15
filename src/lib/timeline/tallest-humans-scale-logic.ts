// WHAT THE SCALE CHART DRAWS, AND WHAT IT REFUSES TO DRAW.
//
// Pulled out of the component because these two functions carry the judgement
// and the component only carries the pixels. They decide which figure stands
// for a person and which records belong under a filter, and both are decisions
// that can be wrong in ways nobody would see by looking at the chart — so they
// live where a test can reach them.

import { measurementKindIsOfABody } from "./taxonomy";

export type ScaleMeasurement = {
  whatIsMeasured: string;
  valueCm?: number;
  valueAbsentReason?: string;
  valueLowCm?: number;
  valueHighCm?: number;
  originalValueText: string;
  measurementKind: string;
  measurementMethod: string;
  evidenceStatus: string;
  directlyMeasured?: boolean;
  measuredOn?: string;
  measuredBy?: string;
  evidence: string;
  notes?: string;
};

export type ScalePerson = {
  slug: string;
  title: string;
  summary: string;
  evidenceStatus?: string;
  remainsLocation?: string;
  accessionNumber?: string;
  hasPhotograph?: boolean;
  hasRemainsPhotograph?: boolean;
  measurements: ScaleMeasurement[];
};

export const SCALE_FILTERS = [
  { key: "all", label: "All" },
  { key: "photographed", label: "Photographed" },
  { key: "physical_remains", label: "Physical remains" },
  { key: "medically_verified", label: "Medically verified" },
  { key: "historical_claims", label: "Historical claims" },
  { key: "disputed", label: "Disputed" },
] as const;

export type ScaleFilterKey = (typeof SCALE_FILTERS)[number]["key"];

/**
 * The figure a person is PLOTTED at.
 *
 * Two rules, and the first one matters more than it looks.
 *
 * A FIGURE THAT IS NOT ABOUT A BODY NEVER GETS PLOTTED. The Cardiff Giant is
 * ten feet long. It was measured carefully, by people with no reason to lie,
 * and it is a block of carved gypsum. Plotting it would put a rock at the top
 * of a list of the tallest people who ever lived — silently, because the
 * number is real and the record is honest about what it is.
 *
 * Then: prefer a directly measured height over a reconstruction, so the chart
 * is a chart of one quantity wherever it can be. Where only an estimate
 * exists the row is plotted from it and marked, because dropping the person
 * entirely would be a quieter dishonesty than plotting them with a note.
 */
export function plottedMeasurement(person: ScalePerson): ScaleMeasurement | null {
  const usable = person.measurements.filter(
    (m) => typeof m.valueCm === "number" && measurementKindIsOfABody(m.measurementKind)
  );
  if (usable.length === 0) return null;
  const measured = usable.filter((m) => m.directlyMeasured);
  const pool = measured.length > 0 ? measured : usable;
  return pool.reduce((a, b) => ((b.valueCm ?? 0) > (a.valueCm ?? 0) ? b : a));
}

export function personMatchesFilter(person: ScalePerson, filter: ScaleFilterKey): boolean {
  if (filter === "all") return true;
  if (filter === "photographed") return Boolean(person.hasPhotograph);
  if (filter === "physical_remains") return person.evidenceStatus === "verified_physical_remains";
  if (filter === "medically_verified") {
    return person.measurements.some(
      (m) => m.measurementMethod === "medical_examination" || m.measurementMethod === "official_records_body"
    );
  }
  if (filter === "historical_claims") {
    return person.measurements.some(
      (m) => m.measurementKind === "advertised_height" || m.measurementKind === "reported_unspecified"
    );
  }
  if (filter === "disputed") {
    return (
      person.evidenceStatus === "disputed" ||
      person.evidenceStatus === "known_hoax" ||
      person.evidenceStatus === "misidentified" ||
      person.measurements.some((m) => m.evidenceStatus === "disputed" || m.evidenceStatus === "unresolved")
    );
  }
  return true;
}
