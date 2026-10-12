import { test } from "node:test";
import assert from "node:assert/strict";
import { normaliseAnalytics, parseAnalyticsRange, periodChange } from "./community-analytics";

test("range: only 7, 30 or 90, defaulting to 30", () => {
  assert.equal(parseAnalyticsRange("7"), 7);
  assert.equal(parseAnalyticsRange(["90", "7"]), 90);
  assert.equal(parseAnalyticsRange("14"), 30);
  assert.equal(parseAnalyticsRange(undefined), 30);
});

test("period change: percent vs previous, null when there is nothing to compare", () => {
  assert.equal(periodChange(15, 10), 50);
  assert.equal(periodChange(5, 10), -50);
  assert.equal(periodChange(3, 0), null);
});

test("normalise: maps the RPC's jsonb and reads missing fields as zero", () => {
  const a = normaliseAnalytics({
    range_days: 7,
    presence: { active_today: 1, active_7d: 2, active_30d: 3, member_count: 4 },
    totals: { current: { posts: 5, joins: 1 }, previous: {} },
    daily: [{ day: "2026-10-12", active: 1, posts: 2 }],
    top_spaces: [{ id: "s", name: "General", slug: "general", posts: 3, comments: 1 }],
    top_members: [{ user_id: "u", name: null, username: "bob", avatar_url: null, posts: 3 }],
  });
  assert.equal(a.rangeDays, 7);
  assert.deepEqual(a.presence, { activeToday: 1, active7d: 2, active30d: 3, memberCount: 4 });
  assert.equal(a.current.posts, 5);
  assert.equal(a.current.comments, 0);
  assert.equal(a.previous.joins, 0);
  assert.deepEqual(a.daily[0], { day: "2026-10-12", active: 1, joins: 0, leaves: 0, posts: 2, comments: 0, reactions: 0 });
  assert.equal(a.topMembers[0].name, "bob");
  assert.equal(normaliseAnalytics(null).daily.length, 0);
});
