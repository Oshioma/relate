import { test } from "node:test";
import assert from "node:assert/strict";
import { headlineSuggestions } from "./headline-suggestions";
import { COMMUNITY_TEMPLATES } from "./community-templates";

test("every template gets headline suggestions that fit the 140-character column", () => {
  for (const t of COMMUNITY_TEMPLATES) {
    const suggestions = headlineSuggestions(t.key);
    assert.ok(suggestions.length > 0, t.key);
    for (const s of suggestions) assert.ok(s.length > 0 && s.length <= 140, `${t.key}: ${s}`);
  }
});

test("an unknown template falls back to the generic suggestions", () => {
  assert.deepEqual(headlineSuggestions("nope"), headlineSuggestions(""));
});
