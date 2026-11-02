/**
 * True Calendar: cultural date mapping primitives.
 * Astronomical conjunction is NOT equivalent to an observed cultural month start.
 * This module never infers a cultural anchor from a moon phase.
 */
export type MappingConfidence = "verified" | "published" | "estimated" | "unmapped";
export type CycleType = "lunar_nights" | "fixed_days" | "published_occurrences";
export type CulturalProfile = {
  id: string;
  culture: string;
  community: string;
  cycleType: CycleType;
  cycleLength?: number;
  /** ISO civil date explicitly supported by the cited source, in profile timezone. */
  anchorDate?: string;
  /** One-based cycle position on anchorDate. */
  anchorPosition?: number;
  timezone: string;
  sourceUrl: string;
  confidence: MappingConfidence;
  convention: string;
};
export type ResearchAdvice = {
  id: string;
  profileId: string;
  cyclePosition?: number;
  occurrenceDate?: string;
  title: string;
  historicalMeaning: string;
  practicalApplication?: string;
  sourceUrl: string;
  historyUrl?: string;
};
export type MappedAdvice = ResearchAdvice & {
  date: string;
  culture: string;
  community: string;
  confidence: Exclude<MappingConfidence, "unmapped">;
  mappingExplanation: string;
};
export type DateGroup = { date: string; interpretations: MappedAdvice[] };

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
function epochDay(day: string): number {
  if (!ISO_DAY.test(day)) throw new Error("Expected ISO date YYYY-MM-DD");
  const time = Date.parse(day + "T00:00:00Z");
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== day) {
    throw new Error("Invalid ISO date");
  }
  return Math.floor(time / 86_400_000);
}
function fromEpochDay(day: number): string {
  return new Date(day * 86_400_000).toISOString().slice(0, 10);
}
const modulo = (n: number, d: number) => ((n % d) + d) % d;

export function mapCulturalAdvice(
  profiles: CulturalProfile[],
  records: ResearchAdvice[],
  startDate: string,
  days = 30
): { dated: DateGroup[]; unmapped: ResearchAdvice[] } {
  const start = epochDay(startDate);
  if (!Number.isInteger(days) || days < 1 || days > 366) throw new Error("days must be 1..366");
  const profileById = new Map(profiles.map(p => [p.id, p]));
  const dated = new Map<string, MappedAdvice[]>();
  const unmapped: ResearchAdvice[] = [];
  for (const record of records) {
    const p = profileById.get(record.profileId);
    if (!p || p.confidence === "unmapped" || !p.sourceUrl || !record.sourceUrl) {
      unmapped.push(record); continue;
    }
    const occurrences: string[] = [];
    if (record.occurrenceDate && p.cycleType === "published_occurrences") {
      const d = epochDay(record.occurrenceDate);
      if (d >= start && d < start + days) occurrences.push(record.occurrenceDate);
    } else if (
      p.cycleType !== "published_occurrences" &&
      p.anchorDate && p.cycleLength && p.anchorPosition &&
      record.cyclePosition &&
      Number.isInteger(p.cycleLength) && p.cycleLength > 0 &&
      p.anchorPosition >= 1 && p.anchorPosition <= p.cycleLength &&
      record.cyclePosition >= 1 && record.cyclePosition <= p.cycleLength
    ) {
      const anchor = epochDay(p.anchorDate);
      for (let d = start; d < start + days; d++) {
        const position = modulo(p.anchorPosition - 1 + d - anchor, p.cycleLength) + 1;
        if (position === record.cyclePosition) occurrences.push(fromEpochDay(d));
      }
    }
    if (!occurrences.length) { unmapped.push(record); continue; }
    for (const date of occurrences) {
      const mapped: MappedAdvice = {
        ...record, date, culture: p.culture, community: p.community,
        confidence: p.confidence,
        mappingExplanation: p.convention
      };
      dated.set(date, [...(dated.get(date) ?? []), mapped]);
    }
  }
  return {
    dated: [...dated].sort(([a], [b]) => a.localeCompare(b))
      .map(([date, interpretations]) => ({
        date,
        interpretations: interpretations.sort((a, b) =>
          a.culture.localeCompare(b.culture) || a.title.localeCompare(b.title))
      })),
    unmapped
  };
}
