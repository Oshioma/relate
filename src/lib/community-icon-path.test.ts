import { test } from "node:test";
import assert from "node:assert/strict";
import { isCommunityIconPath } from "./community-icon-path";

test("the community's own icon routes are recognised", () => {
  assert.equal(isCommunityIconPath("/c/mzunguzanzibar/icon", "mzunguzanzibar"), true);
  assert.equal(isCommunityIconPath("/c/mzunguzanzibar/apple-icon", "mzunguzanzibar"), true);
  assert.equal(isCommunityIconPath("/welcome/mzunguzanzibar/icon", "mzunguzanzibar"), true);
});

test("pages and other communities' icons are not", () => {
  assert.equal(isCommunityIconPath("/c/mzunguzanzibar/spaces/business-directory", "mzunguzanzibar"), false);
  assert.equal(isCommunityIconPath("/c/mzunguzanzibar/icons-page", "mzunguzanzibar"), false);
  assert.equal(isCommunityIconPath("/c/othercommunity/icon", "mzunguzanzibar"), false);
  assert.equal(isCommunityIconPath("/icon", "mzunguzanzibar"), false);
  assert.equal(isCommunityIconPath("/welcome/mzunguzanzibar", "mzunguzanzibar"), false);
});
