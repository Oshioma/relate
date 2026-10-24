import { test } from "node:test";
import assert from "node:assert/strict";
import { planDescriptionBlocks } from "./plan-description";

test("headings, paragraphs and bullet lists", () => {
  assert.deepEqual(
    planDescriptionBlocks("What to expect:\r\n\r\nA safe space.\r\nDaily meditations.\r\n\r\n- Journal\n• Tips\n\nStart now!"),
    [
      { kind: "heading", text: "What to expect" },
      { kind: "paragraph", text: "A safe space. Daily meditations." },
      { kind: "list", items: ["Journal", "Tips"] },
      { kind: "paragraph", text: "Start now!" },
    ]
  );
});

test("a long line ending in a colon stays a paragraph", () => {
  const long = `${"word ".repeat(20)}these:`;
  assert.deepEqual(planDescriptionBlocks(long), [{ kind: "paragraph", text: long.trim() }]);
});

test("empty input has no blocks", () => {
  assert.deepEqual(planDescriptionBlocks(null), []);
  assert.deepEqual(planDescriptionBlocks("  \n "), []);
});
