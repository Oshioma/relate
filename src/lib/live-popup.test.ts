import { test } from "node:test";
import assert from "node:assert/strict";
import { livePopupVisible, parseIds, rememberId, shouldShowDesktopNotification } from "./live-popup";

const base = {
  sessionId: "s1",
  startedBy: "host",
  viewerId: "member",
  pathname: "/c/escape/feed",
  spacePath: "/c/escape/spaces/live",
  dismissedIds: [] as string[],
};

test("shows to a member elsewhere in the community", () => {
  assert.equal(livePopupVisible(base), true);
  assert.equal(livePopupVisible({ ...base, viewerId: null }), true);
});

test("hidden for the host who started it", () => {
  assert.equal(livePopupVisible({ ...base, viewerId: "host" }), false);
});

test("hidden on the space page itself, with or without the /c prefix", () => {
  assert.equal(livePopupVisible({ ...base, pathname: "/c/escape/spaces/live" }), false);
  assert.equal(livePopupVisible({ ...base, pathname: "/c/escape/spaces/live/" }), false);
  assert.equal(livePopupVisible({ ...base, pathname: "/spaces/live" }), false);
  assert.equal(livePopupVisible({ ...base, pathname: "/c/escape/spaces/live-music" }), true);
  assert.equal(livePopupVisible({ ...base, pathname: "/" }), true);
});

test("hidden once dismissed, for that session only", () => {
  assert.equal(livePopupVisible({ ...base, dismissedIds: ["s1"] }), false);
  assert.equal(livePopupVisible({ ...base, dismissedIds: ["s0"] }), true);
});

test("desktop notification only when allowed, no push copy, and page not in view", () => {
  const ok = { permission: "granted" as const, pushSubscribed: false, pageVisible: false };
  assert.equal(shouldShowDesktopNotification(ok), true);
  assert.equal(shouldShowDesktopNotification({ ...ok, pageVisible: true }), false);
  assert.equal(shouldShowDesktopNotification({ ...ok, pushSubscribed: true }), false);
  assert.equal(shouldShowDesktopNotification({ ...ok, permission: "default" }), false);
  assert.equal(shouldShowDesktopNotification({ ...ok, permission: "unsupported" }), false);
});

test("remembered ids stay unique and short", () => {
  assert.deepEqual(rememberId(["a", "b"], "a"), ["b", "a"]);
  assert.deepEqual(rememberId(["a", "b", "c"], "d", 3), ["b", "c", "d"]);
  assert.deepEqual(parseIds(null), []);
  assert.deepEqual(parseIds("nope"), []);
  assert.deepEqual(parseIds('["x", 3, "y"]'), ["x", "y"]);
});
