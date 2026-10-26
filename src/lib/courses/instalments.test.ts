import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanInstalmentInput, instalmentLabel, instalmentPlan, instalmentStateFor, instalmentTotalCents, shouldStopCharging } from "./instalments";

const gbp = (cents: number) => `£${(cents / 100).toFixed(0)}`;

test("a plan needs both a count of 2+ and a monthly amount", () => {
  assert.deepEqual(instalmentPlan({ instalment_count: 4, instalment_price_cents: 4000 }), { count: 4, priceCents: 4000 });
  assert.equal(instalmentPlan({ instalment_count: 0, instalment_price_cents: 0 }), null);
  assert.equal(instalmentPlan({ instalment_count: 4, instalment_price_cents: 0 }), null);
  assert.equal(instalmentPlan({ instalment_count: 1, instalment_price_cents: 4000 }), null);
  assert.equal(instalmentPlan({ instalment_count: null, instalment_price_cents: null }), null);
});

test("£40 a month for 4 months next to £144 once", () => {
  const plan = { count: 4, priceCents: 4000 };
  assert.equal(instalmentLabel(plan, gbp), "£40 a month for 4 months");
  assert.equal(instalmentTotalCents(plan), 16000);
});

test("the editor's input is checked", () => {
  assert.deepEqual(cleanInstalmentInput(4, 4000, 14400), { count: 4, priceCents: 4000 });
  assert.deepEqual(cleanInstalmentInput(0, 0, 14400), { count: 0, priceCents: 0 });
  assert.ok("error" in cleanInstalmentInput(1, 4000, 14400));
  assert.ok("error" in cleanInstalmentInput(25, 4000, 14400));
  assert.ok("error" in cleanInstalmentInput(4, 0, 14400));
  assert.ok("error" in cleanInstalmentInput(4, 4000, 0));
});

test("the course opens on the first payment and stays open while Stripe retries", () => {
  assert.deepEqual(instalmentStateFor({ stripeStatus: "active", instalmentsPaid: 1, instalmentsTotal: 4 }), { status: "active", paid: true });
  assert.deepEqual(instalmentStateFor({ stripeStatus: "past_due", instalmentsPaid: 2, instalmentsTotal: 4 }), { status: "past_due", paid: true });
});

test("Stripe giving up before the last instalment locks the course", () => {
  for (const stripeStatus of ["canceled", "unpaid", "incomplete_expired"]) {
    assert.deepEqual(instalmentStateFor({ stripeStatus, instalmentsPaid: 2, instalmentsTotal: 4 }), { status: "canceled", paid: false });
  }
});

test("once every instalment is paid the course is theirs for good", () => {
  assert.deepEqual(instalmentStateFor({ stripeStatus: "canceled", instalmentsPaid: 4, instalmentsTotal: 4 }), { status: "completed", paid: true });
  assert.equal(shouldStopCharging(4, 4), true);
  assert.equal(shouldStopCharging(3, 4), false);
});

test("a first payment still going through changes nothing", () => {
  assert.equal(instalmentStateFor({ stripeStatus: "incomplete", instalmentsPaid: 0, instalmentsTotal: 4 }), null);
});
