import { test } from "node:test";
import assert from "node:assert/strict";
import { tierCheckoutDescription } from "./checkout-description";

test("lists the unlocked spaces", () => {
  assert.equal(tierCheckoutDescription(["Growth Journal", " Wellness Tips "]), "Unlocks: Growth Journal, Wellness Tips.");
});

test("no doubled full stop when a space name ends in one", () => {
  assert.equal(tierCheckoutDescription(["Daily Meditation - for wellness."]), "Unlocks: Daily Meditation - for wellness.");
});

test("no spaces -> undefined", () => {
  assert.equal(tierCheckoutDescription([]), undefined);
});

test("long text is cut to 1000 characters", () => {
  const out = tierCheckoutDescription(["a".repeat(2000)]);
  assert.equal(out?.length, 1000);
  assert.ok(out?.endsWith("…"));
});
