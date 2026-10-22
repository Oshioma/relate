import { test } from "node:test";
import assert from "node:assert/strict";
import { explainAccessCheck, type AccessCheckFacts } from "./check";

const base: AccessCheckFacts = {
  community_privacy: "public",
  visibility: "members",
  gated: true,
  own_price_cents: 0,
  membership_status: "active",
  role: "member",
  is_member: true,
  is_staff: false,
  can_discover: true,
  can_open: false,
  has_space_subscription: false,
  has_tier_subscription: false,
  unlocking_tiers: [
    { id: "a", name: "Insider", archived: false },
    { id: "b", name: "Founders", archived: true },
  ],
  paid_courses: 0,
  paid_courses_enrolled: 0,
};

test("a free member on a paid space: sees it, can't open it, told which membership unlocks it", () => {
  const a = explainAccessCheck(base, { visitor: false });
  assert.deepEqual(a.lines.slice(0, 2).map((l) => l.yes), [true, false]);
  assert.equal(a.unlock, "A membership that includes it (Insider).");
});

test("a paying member opens it, and the answer names their membership", () => {
  const a = explainAccessCheck({ ...base, can_open: true, has_tier_subscription: true }, { visitor: false });
  assert.equal(a.lines[1].yes, true);
  assert.match(a.lines[1].because, /Insider/);
  assert.equal(a.unlock, null);
});

test("banned beats paying", () => {
  const a = explainAccessCheck({ ...base, membership_status: "banned", is_member: false, can_discover: false, has_tier_subscription: true }, { visitor: false });
  assert.equal(a.lines[0].yes, false);
  assert.match(a.unlock ?? "", /Unban/);
});

test("visitors on a hidden community are told they need an invitation", () => {
  const a = explainAccessCheck(
    { ...base, community_privacy: "invite_only", visibility: "public", gated: false, membership_status: "none", role: null, is_member: false, can_discover: false },
    { visitor: true }
  );
  assert.match(a.lines[0].because, /invitation only/);
  assert.equal(a.unlock, "They need an invitation to join.");
});

test("paid course lessons need an enrolment even when the space opens", () => {
  const a = explainAccessCheck({ ...base, gated: false, can_open: true, paid_courses: 2, paid_courses_enrolled: 1 }, { visitor: false });
  const lessons = a.lines.find((l) => l.label === "Paid course lessons");
  assert.equal(lessons?.yes, false);
  assert.match(lessons?.because ?? "", /1 of 2/);
});

test("nothing on sale says so instead of pointing at an archived tier", () => {
  const a = explainAccessCheck({ ...base, unlocking_tiers: [{ id: "b", name: "Founders", archived: true }] }, { visitor: false });
  assert.match(a.unlock ?? "", /Nothing on sale/);
});
