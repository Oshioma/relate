import assert from "node:assert/strict";
import test from "node:test";
import { mapCulturalAdvice, type CulturalProfile, type ResearchAdvice } from "./cultural-date-mapping";

const profile: CulturalProfile = {
  id: "test-market", culture: "Example", community: "Documented community",
  cycleType: "fixed_days", cycleLength: 4, anchorDate: "2026-11-02",
  anchorPosition: 1, timezone: "Africa/Dar_es_Salaam",
  sourceUrl: "https://example.org/source", confidence: "estimated",
  convention: "Example only: a source-backed anchor is required in production"
};
const record: ResearchAdvice = {
  id: "market-day-1", profileId: "test-market", cyclePosition: 1,
  title: "Market day", historicalMeaning: "Example meaning",
  sourceUrl: "https://example.org/source"
};
test("maps anchored recurring cycles in strict chronological order", () => {
  const result = mapCulturalAdvice([profile], [record], "2026-11-02", 10);
  assert.deepEqual(result.dated.map(x => x.date), ["2026-11-02", "2026-11-06", "2026-11-10"]);
  assert.equal(result.dated[0].interpretations[0].confidence, "estimated");
});
test("does not invent dates when cultural anchor is absent", () => {
  const result = mapCulturalAdvice([{ ...profile, anchorDate: undefined }], [record], "2026-11-02");
  assert.equal(result.dated.length, 0);
  assert.equal(result.unmapped.length, 1);
});
test("groups multiple cultures beneath one date", () => {
  const second = { ...profile, id: "second", culture: "Other" };
  const secondRecord = { ...record, id: "other-day", profileId: "second" };
  const result = mapCulturalAdvice([profile, second], [record, secondRecord], "2026-11-02", 1);
  assert.equal(result.dated.length, 1);
  assert.equal(result.dated[0].interpretations.length, 2);
});
test("published occurrences are not repeated as mathematical cycles", () => {
  const p: CulturalProfile = { ...profile, cycleType: "published_occurrences", confidence: "published" };
  const r: ResearchAdvice = { ...record, occurrenceDate: "2026-11-22" };
  const result = mapCulturalAdvice([p], [r], "2026-11-02", 30);
  assert.deepEqual(result.dated.map(x => x.date), ["2026-11-22"]);
});
