import { test } from "node:test";
import assert from "node:assert/strict";
import {
  accessChoiceOf,
  describeCommunityAccess,
  describeSpaceAccess,
  findAccessIssues,
  settingsForChoice,
  spaceAccessFor,
  tiersLosingAccess,
  type AccessCommunity,
  type AccessSpace,
  type AccessTier,
  type AccessViewer,
} from "./model";
import { ACCESS_PRESETS, matchPreset, presetPrivacy, seededVisibility, getAccessPreset } from "./presets";

// The same community, spaces and viewers as supabase/tests/access_security.sql,
// so the two can be read side by side.
const open: AccessCommunity = { privacy: "public", feed_public: false, events_public: true, members_visibility: "members", stripe_charges_enabled: true };
const hidden: AccessCommunity = { ...open, privacy: "invite_only" };

const tiers: AccessTier[] = [{ id: "insider", name: "Insider", price_cents: 1500, archived_at: null }];
const space = (id: string, visibility: AccessSpace["visibility"], extra: Partial<AccessSpace> = {}): AccessSpace => ({
  id,
  name: id,
  visibility,
  price_cents: 0,
  tierIds: [],
  ...extra,
});
const spaces = [
  space("start-here", "public"),
  space("chat", "members"),
  space("team-room", "private"),
  space("premium", "members", { tierIds: ["insider"] }),
  space("inner-circle", "private", { tierIds: ["insider"] }),
  space("masterclass", "members", { price_cents: 500 }),
];

const viewers: Record<string, AccessViewer> = {
  visitor: { kind: "visitor" },
  outsider: { kind: "outsider" },
  free: { kind: "member" },
  paid: { kind: "paid", tierIds: ["insider"], spaceIds: ["masterclass"] },
  team: { kind: "team" },
};

function openSpaces(community: AccessCommunity, viewer: AccessViewer): string {
  return spaces
    .filter((s) => spaceAccessFor(community, s, viewer) === "open")
    .map((s) => s.id)
    .sort()
    .join(",");
}

test("who can open which space matches the database rule", () => {
  assert.equal(openSpaces(open, viewers.visitor), "start-here");
  assert.equal(openSpaces(open, viewers.outsider), "start-here");
  assert.equal(openSpaces(open, viewers.free), "chat,start-here");
  // A tier can't open a team-only space.
  assert.equal(openSpaces(open, viewers.paid), "chat,masterclass,premium,start-here");
  assert.equal(openSpaces(open, viewers.team), "chat,inner-circle,masterclass,premium,start-here,team-room");
});

test("locked is what a member sees on a paid space; visitors don't see it at all", () => {
  const premium = spaces[3];
  assert.equal(spaceAccessFor(open, premium, viewers.free), "locked");
  assert.equal(spaceAccessFor(open, premium, viewers.visitor), "hidden");
  assert.equal(spaceAccessFor(open, spaces[2], viewers.free), "hidden");
  // On one tier but not the one this space is on.
  assert.equal(spaceAccessFor(open, premium, { kind: "paid", tierIds: ["other"] }), "locked");
});

test("an invite-only community keeps even its public spaces from non-members", () => {
  assert.equal(openSpaces(hidden, viewers.visitor), "");
  assert.equal(openSpaces(hidden, viewers.outsider), "");
  assert.equal(openSpaces(hidden, viewers.free), "chat,start-here");
});

test("a public space is never gated, whatever tiers list it", () => {
  const odd = space("odd", "public", { tierIds: ["insider"] });
  assert.equal(spaceAccessFor(open, odd, viewers.visitor), "open");
  assert.equal(accessChoiceOf(odd, tiers), "everyone");
});

test("settings read back as the five choices", () => {
  assert.deepEqual(spaces.map((s) => accessChoiceOf(s, tiers)), ["everyone", "members", "team", "paid", "team", "tiers"]);
  // With no tier on sale, a tiered space is "selected memberships", not "paid".
  const archived = [{ ...tiers[0], archived_at: "2026-10-01T00:00:00Z" }];
  assert.equal(accessChoiceOf(spaces[3], archived), "tiers");
});

test("each choice writes the settings it reads back as", () => {
  const two: AccessTier[] = [...tiers, { id: "supporter", name: "Supporter", price_cents: 500, archived_at: null }, { id: "old", name: "Old", price_cents: 100, archived_at: "2026-01-01" }];
  for (const choice of ["everyone", "members", "paid", "team"] as const) {
    const settings = settingsForChoice(choice, two);
    assert.equal(accessChoiceOf(space("x", settings.visibility, { price_cents: settings.price_cents, tierIds: settings.tierIds }), two), choice);
  }
  assert.deepEqual(settingsForChoice("paid", two).tierIds, ["insider", "supporter"]);
  const selected = settingsForChoice("tiers", two, { tierIds: ["supporter", "unknown", "supporter"], priceCents: 700 });
  assert.deepEqual(selected, { visibility: "members", price_cents: 700, tierIds: ["supporter"] });
  assert.equal(settingsForChoice("everyone", two, { priceCents: 900 }).price_cents, 0);
  // An archived tier already on the space stays when switching to "paid".
  assert.deepEqual(settingsForChoice("paid", two, { currentTierIds: ["old"] }).tierIds, ["insider", "supporter", "old"]);
});

test("who loses a space when its memberships change", () => {
  const before = { visibility: "members" as const, price_cents: 0, tierIds: ["insider"] };
  assert.deepEqual(tiersLosingAccess(before, settingsForChoice("members", tiers), tiers).map((t) => t.name), ["Insider"]);
  assert.deepEqual(tiersLosingAccess(before, settingsForChoice("everyone", tiers), tiers), []);
  assert.deepEqual(tiersLosingAccess(before, settingsForChoice("paid", tiers), tiers), []);
});

test("plain English for a space and the community", () => {
  assert.equal(describeSpaceAccess(spaces[3], tiers), "Paid members");
  assert.equal(describeSpaceAccess(spaces[5], tiers), "Paid: $5/month on its own");
  assert.equal(describeSpaceAccess({ ...spaces[5], tierIds: ["insider"] }, tiers), "Members on Insider, or $5/month on its own");
  const lines = describeCommunityAccess(open, spaces, tiers);
  assert.equal(lines[0], "Listed on Relate. Anyone can find it and join for free.");
  assert.ok(lines.some((l) => l.startsWith("Visitors can read start-here")));
  assert.ok(lines.some((l) => l.includes("Only you and your team can see team-room, inner-circle")));
  assert.ok(lines.includes("1 membership is on sale."));
  assert.equal(describeCommunityAccess(hidden, spaces, tiers)[1], "Visitors see nothing until they're invited.");
});

test("issues worth a second look", () => {
  const codes = (c: AccessCommunity, s: AccessSpace[], t: AccessTier[]) => findAccessIssues(c, s, t).map((i) => i.code).sort();
  assert.deepEqual(codes(open, spaces, tiers), []);
  // Tier archived: nobody new can get into premium.
  assert.deepEqual(codes(open, spaces, [{ ...tiers[0], archived_at: "2026-10-01" }]), ["locked_no_tier_on_sale"]);
  // Payments not connected.
  assert.deepEqual(codes({ ...open, stripe_charges_enabled: false }, spaces, tiers), ["price_without_payments", "price_without_payments"]);
  // A tier that unlocks nothing.
  assert.deepEqual(codes(open, [space("a", "members")], tiers), ["tier_without_spaces"]);
  // Private community showing an empty feed, and events that can't show.
  const priv: AccessCommunity = { ...open, privacy: "private", feed_public: true };
  assert.deepEqual(codes(priv, [space("a", "members")], []), ["feed_public_no_public_spaces"]);
  assert.deepEqual(codes({ ...priv, feed_public: false }, [], []), ["switch_has_no_effect"]);
  assert.deepEqual(codes({ ...hidden, feed_public: true }, [], []), ["switch_has_no_effect"]);
  // Public space in a tier, and a public space left out of the sidebar.
  assert.deepEqual(codes(open, [space("a", "public", { tierIds: ["insider"], show_in_nav: false }), space("b", "members", { tierIds: ["insider"] })], tiers), [
    "public_space_in_tier",
    "public_space_not_in_nav",
  ]);
});

test("presets fill in existing settings and never charge", () => {
  assert.deepEqual(ACCESS_PRESETS.map((p) => p.key), ["open", "private", "paid", "premium", "custom"]);
  const priv = getAccessPreset("private")!;
  assert.equal(presetPrivacy(priv), "private");
  assert.equal(presetPrivacy(priv, true), "invite_only");
  assert.equal(presetPrivacy(getAccessPreset("open")!, true), "public");
  // A template's staff room stays team-only under every preset.
  for (const p of ACCESS_PRESETS) assert.equal(seededVisibility(p, "private"), "private");
  assert.equal(seededVisibility(getAccessPreset("paid")!, "members"), "members");
  assert.equal(getAccessPreset("nope"), undefined);
});

test("existing communities read as the preset they match", () => {
  assert.equal(matchPreset(open, [space("a", "public"), space("b", "members")], []), "open");
  assert.equal(matchPreset(open, spaces, tiers), "premium");
  assert.equal(matchPreset(open, [space("a", "public"), space("b", "members", { tierIds: ["insider"] })], tiers), "paid");
  assert.equal(matchPreset({ ...open, privacy: "private", events_public: false }, [space("a", "members")], []), "private");
  assert.equal(matchPreset({ ...open, privacy: "private", feed_public: true }, [], []), "custom");
});
