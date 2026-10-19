import { test } from "node:test";
import assert from "node:assert/strict";

import { PICTURE_COMPARISONS, pictureComparisonFor, picturesShowing, wheelZoomFactor } from "./picture-comparisons";
import { SERPENT_EVENTS } from "./serpent-civilizations-seed";

// The panel finds its pictures by file name in the record's own gallery, so a
// comparison that names a picture the record does not carry would show a gap.

const seeded = new Map(SERPENT_EVENTS.map((event) => [event.slug, event]));

test("every comparison belongs to a seeded record and uses pictures from its gallery", () => {
  for (const comparison of PICTURE_COMPARISONS) {
    const event = seeded.get(comparison.eventSlug);
    assert.ok(event, `${comparison.eventSlug} is not a seeded record`);
    const files = new Set((event!.media ?? []).map((picture) => picture.fileName));
    for (const column of comparison.columns) assert.ok(files.has(column.fileName), `${comparison.eventSlug}: ${column.fileName} is not in its gallery`);
  }
});

test("every feature answers for every picture, and a marker sits inside the picture", () => {
  for (const comparison of PICTURE_COMPARISONS) {
    for (const feature of comparison.features) {
      for (const column of comparison.columns) {
        const reading = feature.readings[column.fileName];
        assert.ok(reading && reading.text.trim().length > 0, `${feature.label}: no reading for ${column.title}`);
        if (reading.notVisible) assert.equal(reading.points?.length ?? 0, 0, `${feature.label}: a feature marked not visible has a marker in ${column.title}`);
        for (const [x, y] of reading.points ?? []) {
          assert.ok(x >= 0 && x <= 100 && y >= 0 && y <= 100, `${feature.label}: marker outside ${column.title}`);
        }
      }
    }
  }
});

test("a feature is greyed out only when no picture has a marker for it", () => {
  const comparison = pictureComparisonFor("three-royal-ceremonies-side-by-side")!;
  const instruments = comparison.features.findIndex((feature) => feature.label === "Instruments");
  assert.equal(picturesShowing(comparison, instruments), 1, "drums in the Hueda plate only");
  const animals = comparison.features.findIndex((feature) => feature.label === "Sacred animals");
  assert.equal(picturesShowing(comparison, animals), 3);
});

test("a trackpad's small wheel events zoom gently, and a mouse notch is capped", () => {
  assert.ok(Math.abs(wheelZoomFactor(-4) - 1) < 0.01, "a 4px trackpad step changes the scale by under 1%");
  assert.ok(wheelZoomFactor(-1000) <= 1.1, "one huge event cannot jump the zoom");
  assert.ok(wheelZoomFactor(1000) >= 0.9);
  assert.ok(wheelZoomFactor(-3, 1) > 1 && wheelZoomFactor(3, 1) < 1, "line-mode deltas still zoom in the right direction");
});
