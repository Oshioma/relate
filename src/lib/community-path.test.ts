import assert from "node:assert/strict";
import { test } from "node:test";
import { communityHostHref } from "./community-path";

test("this community's links become clean paths on its own host", () => {
  assert.equal(communityHostHref("/c/mzunguzanzibar", "mzunguzanzibar"), "/");
  assert.equal(communityHostHref("/c/mzunguzanzibar/guides", "mzunguzanzibar"), "/guides");
  assert.equal(
    communityHostHref("/c/mzunguzanzibar/spaces/business-directory/businesses/chez-hassan", "mzunguzanzibar"),
    "/spaces/business-directory/businesses/chez-hassan"
  );
  assert.equal(communityHostHref("/c/mzunguzanzibar?view=feed", "mzunguzanzibar"), "/?view=feed");
  assert.equal(communityHostHref("/c/mzunguzanzibar#events", "mzunguzanzibar"), "/#events");
});

test("everything else is left as written", () => {
  // Another community, including one whose slug starts with this one's.
  assert.equal(communityHostHref("/c/other/guides", "mzunguzanzibar"), "/c/other/guides");
  assert.equal(communityHostHref("/c/mzunguzanzibar-two/guides", "mzunguzanzibar"), "/c/mzunguzanzibar-two/guides");
  // Platform pages keep their meaning; a return path stays a full route.
  assert.equal(communityHostHref("/login?next=%2Fc%2Fmzunguzanzibar", "mzunguzanzibar"), "/login?next=%2Fc%2Fmzunguzanzibar");
  assert.equal(communityHostHref("/pricing", "mzunguzanzibar"), "/pricing");
  assert.equal(communityHostHref("https://www.zanzibarrooms.com/c/mzunguzanzibar", "mzunguzanzibar"), "https://www.zanzibarrooms.com/c/mzunguzanzibar");
  assert.equal(communityHostHref("#top", "mzunguzanzibar"), "#top");
});
