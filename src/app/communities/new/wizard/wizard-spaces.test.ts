import { test } from "node:test";
import assert from "node:assert/strict";
import { getAccessPreset } from "@/lib/access/presets";
import { spaceAccessFor, type AccessViewer } from "@/lib/access/model";
import { applyPresetToSpaces, wizardAccessSpaces, wizardCommunity, FUTURE_MEMBERSHIP } from "./wizard-spaces";
import { INITIAL_WIZARD_STATE, type WizardSpace } from "./types";

const space = (name: string, extra: Partial<WizardSpace> = {}): WizardSpace => ({
  id: name,
  name,
  description: "",
  show_in_nav: true,
  space_type: "discussion",
  staff_post_only: false,
  access: "members",
  ...extra,
});

test("free + premium adds Start here and a Premium space held for a membership", () => {
  const out = applyPresetToSpaces([space("Chat"), space("Staff Room", { templateVisibility: "private" })], getAccessPreset("premium"), "discussion");
  assert.deepEqual(
    out.map((s) => [s.name, s.access]),
    [
      ["Start here", "everyone"],
      ["Chat", "members"],
      ["Staff Room", "team"],
      ["Premium", "paid"],
    ]
  );
});

test("switching preset re-seeds untouched spaces, keeps hand-picked ones and drops the old extras", () => {
  const premium = applyPresetToSpaces([space("Chat"), space("Notes", { access: "everyone", accessTouched: true })], getAccessPreset("premium"), "discussion");
  const priv = applyPresetToSpaces(premium, getAccessPreset("private"), "discussion");
  assert.deepEqual(
    priv.map((s) => [s.name, s.access]),
    [
      ["Chat", "members"],
      ["Notes", "everyone"],
    ]
  );
  const paid = applyPresetToSpaces(priv, getAccessPreset("paid"), "discussion");
  assert.deepEqual(
    paid.map((s) => [s.name, s.access]),
    [
      ["Start here", "everyone"],
      ["Chat", "paid"],
      ["Notes", "everyone"],
    ]
  );
  // Applying the same preset twice adds nothing twice.
  assert.equal(applyPresetToSpaces(paid, getAccessPreset("paid"), "discussion").length, 3);
});

test("a paid space is Admins only at launch, and opens to paid members once a membership exists", () => {
  const spaces = [space("Premium", { access: "paid" })];
  const community = wizardCommunity({ ...INITIAL_WIZARD_STATE, presetKey: "premium" });
  const [today] = wizardAccessSpaces(spaces, "today");
  assert.equal(today.visibility, "private");
  const viewers: AccessViewer[] = [{ kind: "visitor" }, { kind: "member" }, { kind: "paid", tierIds: [FUTURE_MEMBERSHIP.id] }];
  for (const viewer of viewers) {
    assert.equal(spaceAccessFor(community, today, viewer), "hidden");
  }
  const [later] = wizardAccessSpaces(spaces, "withMembership");
  assert.equal(spaceAccessFor(community, later, { kind: "member" }), "locked");
  assert.equal(spaceAccessFor(community, later, { kind: "paid", tierIds: [FUTURE_MEMBERSHIP.id] }), "open");
});

test("hiding a private community hides even its open spaces from visitors", () => {
  const community = wizardCommunity({ ...INITIAL_WIZARD_STATE, presetKey: "private", hideCompletely: true });
  assert.equal(community.privacy, "invite_only");
  const [open] = wizardAccessSpaces([space("Hello", { access: "everyone" })], "today");
  assert.equal(spaceAccessFor(community, open, { kind: "visitor" }), "hidden");
  assert.equal(spaceAccessFor(community, open, { kind: "member" }), "open");
});
