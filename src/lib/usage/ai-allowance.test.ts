import { test } from "node:test";
import assert from "node:assert/strict";
import { allowanceVerdict, type AllowanceInput } from "./ai-allowance";

const base: AllowanceInput = {
  callerIsSuperAdmin: false,
  ownerUsername: "someone",
  ownerIsSuperAdmin: false,
  planStatus: "none",
  spentThisMonthUsd: 0,
  freeMonthlyUsd: 5,
  exemptOwners: ["osh", "skool"],
};

test("a free community can spend up to its monthly allowance", () => {
  const verdict = allowanceVerdict({ ...base, spentThisMonthUsd: 4.2 });
  assert.equal(verdict.allowed, true);
  assert.ok(verdict.allowed && !verdict.unlimited && Math.abs(verdict.remainingUsd - 0.8) < 1e-9);
});

test("once it has spent $5 this month it is stopped, with when it resets", () => {
  const verdict = allowanceVerdict(
    { ...base, spentThisMonthUsd: 5.01 },
    new Date("2026-10-14T12:00:00Z")
  );
  assert.equal(verdict.allowed, false);
  assert.ok(!verdict.allowed && verdict.message.includes("$5"));
  assert.ok(!verdict.allowed && verdict.message.includes("1 November"));
});

test("super admins, exempt owners and subscribed communities are never limited", () => {
  const over = { ...base, spentThisMonthUsd: 999 };
  for (const input of [
    { ...over, callerIsSuperAdmin: true },
    { ...over, ownerIsSuperAdmin: true },
    { ...over, ownerUsername: "osh" },
    { ...over, ownerUsername: "Skool" },
    { ...over, planStatus: "active" },
    { ...over, planStatus: "trialing" },
    { ...over, planStatus: "comped" },
  ]) {
    const verdict = allowanceVerdict(input);
    assert.ok(verdict.allowed && verdict.unlimited, JSON.stringify(input));
  }
});

test("a lapsed plan does not count as subscribed", () => {
  for (const planStatus of ["past_due", "canceled", "none"]) {
    const verdict = allowanceVerdict({ ...base, planStatus, spentThisMonthUsd: 6 });
    assert.equal(verdict.allowed, false, planStatus);
  }
});
