import { test } from "node:test";
import assert from "node:assert/strict";

import { ART_THEMES, SIXTY_FOUR_ARTS, isArtNumber } from "./sixty-four-arts";

test("there are exactly 64 arts, numbered 1 to 64 in order", () => {
  assert.equal(SIXTY_FOUR_ARTS.length, 64);
  SIXTY_FOUR_ARTS.forEach((art, i) => assert.equal(art.n, i + 1));
});

test("every art has both tellings and a known theme", () => {
  const themes = new Set(ART_THEMES.map((t) => t.key));
  for (const art of SIXTY_FOUR_ARTS) {
    assert.ok(themes.has(art.theme), `art ${art.n} theme`);
    for (const field of ["sanskrit", "title", "about", "task", "kidsTitle", "kidsAbout", "kidsTask"] as const) {
      assert.ok(art[field].trim().length > 0, `art ${art.n} ${field}`);
    }
  }
});

test("isArtNumber accepts 1 to 64 only", () => {
  assert.ok(isArtNumber(1));
  assert.ok(isArtNumber(64));
  assert.ok(!isArtNumber(0));
  assert.ok(!isArtNumber(65));
  assert.ok(!isArtNumber(2.5));
  assert.ok(!isArtNumber("3"));
});
