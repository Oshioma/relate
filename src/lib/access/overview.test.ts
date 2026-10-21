import { test } from "node:test";
import assert from "node:assert/strict";
import { buildAccessOverview, overviewViewers } from "./overview";
import type { AccessCommunity, AccessSpace, AccessTier } from "./model";

const open: AccessCommunity = { privacy: "public", feed_public: true, events_public: true, members_visibility: "members", stripe_charges_enabled: true };
const insider: AccessTier = { id: "insider", name: "Insider", price_cents: 500, archived_at: null };
const founders: AccessTier = { id: "founders", name: "Founders", price_cents: 300, archived_at: "2026-01-01" };
const gone: AccessTier = { id: "gone", name: "Gone", price_cents: 300, archived_at: "2026-01-01" };
const space = (id: string, visibility: AccessSpace["visibility"], tierIds: string[] = []): AccessSpace => ({ id, name: id, visibility, price_cents: 0, tierIds });

test("columns: visitor, free member, each membership that still matters, team", () => {
  const viewers = overviewViewers([insider, founders, gone], [space("vip", "members", ["founders"])]);
  assert.deepEqual(viewers.map((v) => v.label), ["Visitor", "Free member", "On Insider", "On Founders", "Team"]);
  assert.match(viewers[3].note ?? "", /Archived/);
});

test("each cell has the state, the rule and where the rule comes from", () => {
  const { rows } = buildAccessOverview(open, [space("hello", "public"), space("vip", "members", ["insider"]), space("staff", "private")], [insider]);
  const states = rows.map((r) => r.cells.map((c) => c.state));
  assert.deepEqual(states, [
    ["open", "open", "open", "open"],
    ["hidden", "locked", "open", "open"],
    ["hidden", "hidden", "hidden", "open"],
  ]);
  assert.equal(rows[1].cells[1].reason, "needs_purchase");
  assert.equal(rows[1].cells[1].source, "space");
  assert.equal(rows[2].cells[3].source, "role");
  assert.equal(rows[1].access, "Paid members: Insider");
});

test("a hidden community's restriction is marked as inherited, not the space's own", () => {
  const { rows } = buildAccessOverview({ ...open, privacy: "invite_only" }, [space("hello", "public")], []);
  assert.equal(rows[0].cells[0].state, "hidden");
  assert.equal(rows[0].cells[0].source, "community");
  assert.match(rows[0].inherited ?? "", /invitation only/);
});

test("issues are attached to the space they're about; the rest are community-wide", () => {
  const { rows, communityIssues } = buildAccessOverview(
    { ...open, privacy: "invite_only", feed_public: true },
    [space("vip", "members", ["founders"])],
    [founders]
  );
  assert.deepEqual(rows[0].issues.map((i) => i.code), ["locked_no_tier_on_sale"]);
  assert.deepEqual(communityIssues.map((i) => i.code), ["switch_has_no_effect"]);
});
