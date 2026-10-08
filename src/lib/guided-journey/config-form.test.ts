import { test } from "node:test";
import assert from "node:assert/strict";
import { configFromForm, diffConfig, textToMilestones, textToOptions } from "./config-form";
import { resolveConfig } from "./config";
import { getPreset } from "./presets";

function form(values: Record<string, string>) {
  return { get: (name: string) => (name in values ? values[name] : null) };
}

test("an unchanged form stores no overrides", () => {
  const preset = getPreset("gardening");
  const next = configFromForm(preset.config, form({}));
  assert.equal(diffConfig(preset.config, next), undefined);
});

test("edited fields round-trip through resolveConfig", () => {
  const preset = getPreset("gardening");
  const next = configFromForm(
    preset.config,
    form({
      "cfg.heroTitle": "Adopt a New Sailor",
      "cfg.terms.mentor": "skipper",
      "cfg.stages.1.title": "Find your skipper",
      "cfg.stages.0.imageUrl": "",
      "cfg.capacityOptions": "2, 4 ,4, 99",
      "cfg.questions.setting.options": "Balcony\nBoat deck",
      "cfg.defaultMilestones": "Rig the boat :: Together\nFirst sail",
    })
  );
  const overrides = diffConfig(preset.config, next);
  const resolved = resolveConfig(preset, overrides);
  assert.equal(resolved.heroTitle, "Adopt a New Sailor");
  assert.equal(resolved.terms.mentor, "skipper");
  assert.equal(resolved.terms.beginner, "beginner");
  assert.equal(resolved.stages[1].title, "Find your skipper");
  assert.equal(resolved.stages[0].imageUrl, null);
  assert.equal(resolved.stages[2].title, preset.config.stages[2].title);
  assert.deepEqual(resolved.capacityOptions, [2, 4]);
  assert.deepEqual(resolved.questions.setting.options, [
    { value: "balcony", label: "Balcony" },
    { value: "boat_deck", label: "Boat deck" },
  ]);
  assert.deepEqual(resolved.defaultMilestones, [
    { title: "Rig the boat", description: "Together" },
    { title: "First sail", description: "" },
  ]);
});

test("option values stay stable when only the label case changes", () => {
  const opts = textToOptions("POTS OR WINDOWSILL", [{ value: "pots", label: "Pots or windowsill" }]);
  assert.deepEqual(opts, [{ value: "pots", label: "POTS OR WINDOWSILL" }]);
});

test("blank milestone lines are dropped", () => {
  assert.equal(textToMilestones("\n  \nOne\n").length, 1);
});
