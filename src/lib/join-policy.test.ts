import { test } from "node:test";
import assert from "node:assert/strict";
import { defaultJoinPolicy, joinPolicyOf, storedJoinPolicy } from "./join-policy";

test("an empty join_policy follows privacy, exactly as before the column existed", () => {
  assert.equal(joinPolicyOf({ privacy: "public", join_policy: null }), "open");
  assert.equal(joinPolicyOf({ privacy: "private", join_policy: null }), "approval");
  assert.equal(joinPolicyOf({ privacy: "invite_only", join_policy: null }), "invite");
  assert.equal(joinPolicyOf({ privacy: "public" }), "open");
});

test("the five supported combinations", () => {
  assert.equal(joinPolicyOf({ privacy: "public", join_policy: "open" }), "open");
  assert.equal(joinPolicyOf({ privacy: "public", join_policy: "approval" }), "approval");
  assert.equal(joinPolicyOf({ privacy: "private", join_policy: "open" }), "open");
  assert.equal(joinPolicyOf({ privacy: "private", join_policy: "approval" }), "approval");
  // Hidden is invitation only whatever was saved.
  assert.equal(joinPolicyOf({ privacy: "invite_only", join_policy: "open" }), "invite");
  // Anything unrecognised falls back to privacy.
  assert.equal(joinPolicyOf({ privacy: "public", join_policy: "free-for-all" }), "open");
});

test("only a real override is stored", () => {
  assert.equal(storedJoinPolicy("public", "open"), null);
  assert.equal(storedJoinPolicy("public", "approval"), "approval");
  assert.equal(storedJoinPolicy("private", "approval"), null);
  assert.equal(storedJoinPolicy("private", "open"), "open");
  assert.equal(storedJoinPolicy("invite_only", "open"), null);
  assert.equal(defaultJoinPolicy("invite_only"), "invite");
});
