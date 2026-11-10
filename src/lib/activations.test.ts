import { test } from "node:test";
import assert from "node:assert/strict";
import { activationStatus, tiersToGiveFree } from "./activations";

const NOW = new Date("2026-11-10T12:00:00Z");

test("an activation link is ready, used or expired", () => {
  assert.equal(activationStatus({ used_at: null, expires_at: "2027-01-01T00:00:00Z" }, NOW), "ready");
  assert.equal(activationStatus({ used_at: "2026-11-09T00:00:00Z", expires_at: "2027-01-01T00:00:00Z" }, NOW), "used");
  assert.equal(activationStatus({ used_at: null, expires_at: "2026-11-10T11:59:59Z" }, NOW), "expired");
});

test("free tiers skip paid Stripe subscriptions and ones already running", () => {
  const existing = [
    { tier_id: "paid", status: "active", stripe_subscription_id: "sub_1", current_period_end: "2026-12-01T00:00:00Z" },
    { tier_id: "free-running", status: "active", stripe_subscription_id: null, current_period_end: null },
    { tier_id: "free-lapsed", status: "canceled", stripe_subscription_id: null, current_period_end: null },
  ];
  assert.deepEqual(
    tiersToGiveFree(["new", "paid", "free-running", "free-lapsed", "new"], existing, NOW),
    ["new", "free-lapsed"]
  );
});

test("a lapsed Stripe subscription is still left to Stripe", () => {
  const existing = [{ tier_id: "t", status: "canceled", stripe_subscription_id: "sub_2", current_period_end: null }];
  assert.deepEqual(tiersToGiveFree(["t"], existing, NOW), []);
});
