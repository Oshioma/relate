import { test } from "node:test";
import assert from "node:assert/strict";
import { tierCheckoutDescription } from "./checkout-description";

test("joins the description and the unlocked spaces into one paragraph", () => {
  assert.equal(
    tierCheckoutDescription("What to expect:\r\n\r\nDaily meditations.", ["Growth Journal", "Wellness Tips"]),
    "What to expect: Daily meditations. Unlocks: Growth Journal, Wellness Tips."
  );
});

test("works with only one of the two", () => {
  assert.equal(tierCheckoutDescription(null, ["Growth Journal"]), "Unlocks: Growth Journal.");
  assert.equal(tierCheckoutDescription("Just this.", []), "Just this.");
});

test("nothing to say -> undefined", () => {
  assert.equal(tierCheckoutDescription("  ", []), undefined);
});

test("long text is cut to 1000 characters", () => {
  const out = tierCheckoutDescription("a".repeat(2000), []);
  assert.equal(out?.length, 1000);
  assert.ok(out?.endsWith("…"));
});
