import { test } from "node:test";
import assert from "node:assert/strict";
import { MediaAnalysisSchema } from "./media-analysis-schema";

const good = {
  kind: "book",
  title: "The Metaphysics of Gods",
  creator: "Brian Richard Taylor",
  description: "A philosophical treatise.",
  age_min: 16,
  age_max: null,
  verdict: "not_suitable",
  reason: "Dense adult philosophy; nothing for children here.",
  profanity: "unknown",
  concerns: [{ category: "mature_themes", level: "moderate", note: "Abstract theology throughout." }],
  themes: ["philosophy of religion", "metaphysics"],
  summary_for_parents: "An adult book.",
  confidence: "medium",
  sources: ["https://example.com/review"],
  cover_image_url: null,
};

test("a long theme is clipped, not fatal", () => {
  const long = "A theme the model wrote out as a whole sentence about how the book treats the nature of divinity and being";
  const parsed = MediaAnalysisSchema.safeParse({ ...good, themes: [long, "metaphysics", "metaphysics", ""] });
  assert.ok(parsed.success);
  assert.equal(parsed.data.themes.length, 2);
  assert.ok(parsed.data.themes[0].length <= 80);
});

test("odd values are tidied rather than rejected", () => {
  const parsed = MediaAnalysisSchema.safeParse({
    ...good,
    kind: "scroll",
    verdict: "maybe",
    profanity: "lots",
    age_min: -3,
    age_max: 99.6,
    concerns: [
      { category: "dragons", level: "mild", note: null },
      { category: "violence", level: "huge", note: "dropped" },
    ],
    sources: ["not a url", "https://example.com/a"],
    confidence: "certain",
  });
  assert.ok(parsed.success);
  assert.equal(parsed.data.kind, "other");
  assert.equal(parsed.data.verdict, "caution");
  assert.equal(parsed.data.profanity, "unknown");
  assert.equal(parsed.data.age_min, 0);
  assert.equal(parsed.data.age_max, 21);
  assert.deepEqual(parsed.data.concerns, [{ category: "other", level: "mild", note: "" }]);
  assert.deepEqual(parsed.data.sources, ["https://example.com/a"]);
  assert.equal(parsed.data.confidence, "low");
});

test("only a missing title still fails", () => {
  assert.equal(MediaAnalysisSchema.safeParse({ ...good, title: "   " }).success, false);
  assert.ok(MediaAnalysisSchema.safeParse(good).success);
});
