import { test } from "node:test";
import assert from "node:assert/strict";

import {
  communityHasTimeline,
  timelinePath,
  timelineEventPath,
  TIMELINE_SCHOOL_KINDS,
} from "./availability";

// ---------------------------------------------------------------------------
// WHO HAS A TIMELINE.
//
// One question, one answer — and now three places read it: the sidebar link,
// the Spaces list, and the page's own gate. They can only stay in step because
// they all call this. The database mirrors it in community_has_timeline(), so a
// change here that is not made there lets the nav offer a page RLS refuses.
// ---------------------------------------------------------------------------

const community = (template_key: string | null, school_kind: string | null) =>
  ({ template_key, school_kind }) as Parameters<typeof communityHasTimeline>[0];

test("a homeschool school has a timeline", () => {
  assert.equal(communityHasTimeline(community("school", "homeschool")), true);
});

test("a school of another kind does not", () => {
  // The feature was built for homeschools and nothing in it is homeschool
  // specific — but opening it to another kind is a deliberate edit here AND in
  // the SQL function, not something that should happen by accident.
  assert.equal(communityHasTimeline(community("school", "microschool")), false);
  assert.equal(communityHasTimeline(community("school", null)), false);
});

test("a community that is not a school does not, whatever its kind says", () => {
  assert.equal(communityHasTimeline(community("business", "homeschool")), false);
  assert.equal(communityHasTimeline(community(null, "homeschool")), false);
});

test("no community at all is not a timeline community", () => {
  // The page calls this before it has established there is a community.
  assert.equal(communityHasTimeline(null), false);
  assert.equal(communityHasTimeline(undefined), false);
});

test("every listed school kind is actually granted one", () => {
  // Guards the list against being edited without the check being updated.
  for (const kind of TIMELINE_SCHOOL_KINDS) {
    assert.equal(communityHasTimeline(community("school", kind)), true, `${kind} is listed but refused`);
  }
});

test("the paths are built in one place so every link agrees", () => {
  assert.equal(timelinePath("squidgeoverskool"), "/c/squidgeoverskool/timeline");
  assert.equal(timelineEventPath("squidgeoverskool", "goliath-of-gath"), "/c/squidgeoverskool/timeline/goliath-of-gath");
});
