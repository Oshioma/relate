import { test } from "node:test";
import assert from "node:assert/strict";
import { viewingAsOwner } from "./view-as-owner";

test("a super admin with the switch on sees the owner's view", () => {
  assert.equal(viewingAsOwner({ cookieMatches: true, isSuperAdmin: true, isRealOwner: false }), true);
});

test("the cookie alone never shows it to anyone else", () => {
  assert.equal(viewingAsOwner({ cookieMatches: true, isSuperAdmin: false, isRealOwner: false }), false);
});

test("nothing changes until the switch is on", () => {
  assert.equal(viewingAsOwner({ cookieMatches: false, isSuperAdmin: true, isRealOwner: false }), false);
});

test("the real owner has nothing to switch", () => {
  assert.equal(viewingAsOwner({ cookieMatches: true, isSuperAdmin: true, isRealOwner: true }), false);
});
