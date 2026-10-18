import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveConfig } from "./config";
import { getPreset, GUIDED_JOURNEY_PRESETS } from "./presets";

test("no overrides gives the preset", () => {
  const preset = getPreset("gardening");
  assert.deepEqual(resolveConfig(preset, {}), preset.config);
  assert.deepEqual(resolveConfig(preset, null), preset.config);
});

test("overrides replace only known keys with the right types", () => {
  const preset = getPreset("gardening");
  const config = resolveConfig(preset, {
    heroTitle: "Adopt a Grower",
    terms: { mentor: "guide", unknown: "x" },
    capacityOptions: [2, "three", 4],
    tagline: 42,
    evil: "<script>",
  });
  assert.equal(config.heroTitle, "Adopt a Grower");
  assert.equal(config.terms.mentor, "guide");
  assert.equal(config.terms.beginner, "beginner");
  assert.deepEqual(config.capacityOptions, [2, 4]);
  assert.equal(config.tagline, preset.config.tagline);
  assert.equal("evil" in config, false);
  assert.equal("unknown" in config.terms, false);
});

test("list items are validated and missing fields fall back to blanks, not item 0", () => {
  const preset = getPreset("gardening");
  const config = resolveConfig(preset, {
    stages: [{ title: "One", text: "First" }, "bad", { title: "Two", imageUrl: null }],
  });
  assert.equal(config.stages.length, 2);
  assert.deepEqual(config.stages[0], { title: "One", text: "First", imageUrl: null, imageAlt: "" });
  assert.equal(config.stages[1].text, "");
});

test("image URLs can be cleared; other strings cannot be nulled", () => {
  const preset = getPreset("gardening");
  const config = resolveConfig(preset, { heroImageUrl: null, heroTitle: null });
  assert.equal(config.heroImageUrl, null);
  assert.equal(config.heroTitle, preset.config.heroTitle);
});

test("a sailing space reuses the same shape with its own words and no borrowed photos", () => {
  const sailing = resolveConfig(getPreset("sailing"), {});
  assert.equal(sailing.heroTitle, "Adopt a New Sailor");
  assert.equal(sailing.terms.mentor, "skipper");
  assert.equal(sailing.stages.length, 5);
  assert.ok(sailing.stages.every((s) => s.imageUrl === null));
  assert.ok(!JSON.stringify(sailing).toLowerCase().includes("harvest"));
});

test("every preset has five stages, capacity options and milestones", () => {
  for (const preset of GUIDED_JOURNEY_PRESETS) {
    assert.equal(preset.config.stages.length, 5, preset.key);
    assert.ok(preset.config.capacityOptions.length > 0, preset.key);
    assert.ok(preset.config.defaultMilestones.length > 0, preset.key);
  }
});

test("unknown preset key falls back to gardening", () => {
  assert.equal(getPreset("nope").key, "gardening");
});

test("help mode: tick one or both, stored as a single value", async () => {
  const { helpModeFromChoices, helpModeToChoices } = await import("./config");
  assert.equal(helpModeFromChoices(["online", "local"]), "either");
  assert.equal(helpModeFromChoices(["local"]), "local");
  assert.equal(helpModeFromChoices(["online"]), "online");
  assert.equal(helpModeFromChoices([]), null);
  assert.deepEqual(helpModeToChoices("either"), ["online", "local"]);
  assert.deepEqual(helpModeToChoices("local"), ["local"]);
});
