import { test } from "node:test";
import assert from "node:assert/strict";
import { describeAudiences, describeListing, describeMemberships, describeSpaceMix, summarizeAccessGroups } from "./summary";
import type { AccessCommunity, AccessSpace, AccessTier } from "./model";

const community: AccessCommunity = { privacy: "public", feed_public: false, events_public: true, members_visibility: "members", stripe_charges_enabled: true };
const insider: AccessTier = { id: "insider", name: "Insider", price_cents: 500, archived_at: null };
const old: AccessTier = { id: "old", name: "Founders", price_cents: 300, archived_at: "2026-01-01" };
const space = (id: string, visibility: AccessSpace["visibility"], tierIds: string[] = []): AccessSpace => ({ id, name: id, visibility, price_cents: 0, tierIds });

test("listing says who can find it and what visitors see", () => {
  assert.equal(describeListing(community), "Listed on Relate. Visitors can read the feed and see events.");
  assert.equal(describeListing({ ...community, privacy: "private" }), "Unlisted: people need the link. Visitors see the front page only.");
  assert.equal(describeListing({ ...community, privacy: "private", feed_public: true, events_public: false }), "Unlisted: people need the link. Visitors can read the feed.");
  assert.equal(describeListing({ ...community, privacy: "invite_only", feed_public: true }), "Hidden: only members can open the link.");
});

test("space mix counts each access choice", () => {
  const spaces = [space("a", "public"), space("b", "members"), space("c", "members"), space("d", "members", ["insider"]), space("e", "private")];
  assert.equal(describeSpaceMix(spaces, [insider]), "1 open to everyone, 2 for all members, 1 for paid members, 1 Admins only.");
  assert.equal(describeSpaceMix([], []), "No spaces yet.");
});

test("memberships name the tiers on sale and keep archived ones visible", () => {
  assert.equal(describeMemberships(community, [insider, old], true), "On sale: Insider. 1 archived (subscribers keep access). Payments connected.");
  assert.equal(describeMemberships({ ...community, stripe_charges_enabled: false }, [], true), "No memberships yet. Payments not connected yet.");
  assert.equal(describeMemberships({ ...community, stripe_charges_enabled: false }, [], false), "No memberships yet. Charging needs a paid plan.");
});

test("four groups in a fixed order, each pointing at its settings", () => {
  const groups = summarizeAccessGroups({ community, joinPolicy: "approval", spaces: [], tiers: [], canCharge: false });
  assert.deepEqual(groups.map((g) => [g.label, g.anchor]), [
    ["Discoverability", "discoverability"],
    ["Joining rules", "joining"],
    ["Memberships & payments", "set-up-membership"],
    ["Spaces & content access", "spaces"],
  ]);
  assert.equal(groups[1].now, "People ask to join and an admin approves them.");
});

test("three audience lines never contradict each other", () => {
  const spaces = [space("Wellness", "members", ["insider"]), space("Journal", "members", ["insider"]), space("Course", "members")];
  const [visitors, members, paid] = describeAudiences(community, spaces, [insider]);
  // Listed, feed readable, no public space: say the feed looks empty.
  assert.match(visitors.text, /looks empty/);
  assert.deepEqual(visitors.open, []);
  assert.deepEqual(members.open, ["Course"]);
  assert.deepEqual(members.locked, ["Wellness", "Journal"]);
  assert.equal(paid.text, "On Insider, they also open:");
  assert.deepEqual(paid.open, ["Wellness", "Journal"]);

  const withPublic = describeAudiences(community, [space("Hello", "public"), ...spaces], []);
  assert.deepEqual(withPublic[0].open, ["Hello"]);
  assert.match(withPublic[2].text, /No membership is on sale/);
  assert.match(describeAudiences({ ...community, privacy: "invite_only" }, spaces, [])[0].text, /invitation/);
});

test("teased spaces show on the visitors line as locked", () => {
  const spaces = [{ ...space("Wellness", "members", ["insider"]), when_locked: "teaser" as const }, space("Course", "members")];
  const [visitors] = describeAudiences(community, spaces, [insider]);
  assert.deepEqual(visitors.open, []);
  assert.deepEqual(visitors.locked, ["Wellness"]);
  assert.match(visitors.text, /see these locked/);
});
