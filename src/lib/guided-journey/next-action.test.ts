import { test } from "node:test";
import assert from "node:assert/strict";
import { frequencyDays, nextRecommendedAction } from "./next-action";

const base = {
  status: "active" as const,
  isMentor: false,
  updateFrequency: "weekly",
  lastBeginnerUpdateAt: "2026-10-01T00:00:00Z",
  openQuestion: null,
  currentMilestone: { title: "Plant your seeds", description: null },
  now: Date.parse("2026-10-03T00:00:00Z"),
};

test("beginner who is up to date works on the current milestone", () => {
  assert.equal(nextRecommendedAction(base), "Work on “Plant your seeds”");
});

test("beginner overdue for their agreed rhythm is nudged to post", () => {
  assert.match(nextRecommendedAction({ ...base, now: Date.parse("2026-10-10T00:00:00Z") }), /Post your weekly update/);
  assert.match(nextRecommendedAction({ ...base, lastBeginnerUpdateAt: null }), /Post your weekly update/);
});

test("a fortnightly rhythm is respected", () => {
  assert.equal(frequencyDays("every two weeks"), 14);
  assert.match(nextRecommendedAction({ ...base, updateFrequency: "every two weeks", now: Date.parse("2026-10-10T00:00:00Z") }), /Work on/);
});

test("a mentor is pointed at an unanswered question first", () => {
  assert.equal(
    nextRecommendedAction({ ...base, isMentor: true, openQuestion: { askerName: "Ben Beginner", question: "Too much water?" } }),
    "Answer Ben's question: “Too much water?”"
  );
});

test("finished and ended journeys say so", () => {
  assert.match(nextRecommendedAction({ ...base, status: "completed" }), /Completed/);
  assert.match(nextRecommendedAction({ ...base, status: "ended" }), /ended/);
  assert.match(nextRecommendedAction({ ...base, currentMilestone: null }), /Every milestone is done/);
});
