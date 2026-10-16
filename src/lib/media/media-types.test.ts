import { test } from "node:test";
import assert from "node:assert/strict";
import { ageRangeLabel, notableConcerns, suitsAge, MediaItemInputSchema } from "./media-types";

test("age ranges read naturally", () => {
  assert.equal(ageRangeLabel(8, 12), "Ages 8–12");
  assert.equal(ageRangeLabel(10, 10), "Age 10");
  assert.equal(ageRangeLabel(13, null), "From age 13");
  assert.equal(ageRangeLabel(null, 4), "Up to age 4");
  assert.equal(ageRangeLabel(null, null), null);
});

test("a child's age is matched against the range, open ends included", () => {
  assert.ok(suitsAge({ age_min: 8, age_max: 12 }, 10));
  assert.equal(suitsAge({ age_min: 8, age_max: 12 }, 7), false);
  assert.ok(suitsAge({ age_min: 13, age_max: null }, 16));
  assert.equal(suitsAge({ age_min: 13, age_max: null }, 9), false);
  assert.ok(suitsAge({ age_min: null, age_max: null }, 5));
});

test("only concerns that say something are notable", () => {
  const concerns = notableConcerns([
    { category: "violence", level: "none", note: "" },
    { category: "scary", level: "mild", note: "A dark forest scene." },
  ]);
  assert.deepEqual(concerns.map((c) => c.category), ["scary"]);
  assert.deepEqual(notableConcerns(null), []);
});

test("the form shape is validated", () => {
  const base = {
    url: "https://example.com/book",
    kind: "book",
    title: "Charlotte's Web",
    creator: "E. B. White",
    description: "A pig and a spider.",
    image_url: null,
    age_min: 6,
    age_max: 10,
    verdict: "suitable",
    reason: null,
    profanity: "none",
    concerns: [],
    themes: ["friendship"],
    share_with_other_communities: true,
  };
  assert.ok(MediaItemInputSchema.safeParse(base).success);
  assert.equal(MediaItemInputSchema.safeParse({ ...base, title: "  " }).success, false);
  assert.equal(MediaItemInputSchema.safeParse({ ...base, verdict: "maybe" }).success, false);
  assert.equal(MediaItemInputSchema.safeParse({ ...base, age_max: 40 }).success, false);
});
