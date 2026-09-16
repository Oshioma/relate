import { test } from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_VISIBLE_TOGGLES,
  EVIDENCE_LAYER_TOGGLES,
  availableToggles,
  interpretationCount,
  isCitationOnly,
  missingLayers,
  reachesTheEvidence,
  toggleForLayer,
  translationCount,
  visibleChainLayers,
  type ChainLayer,
} from "./evidence-chain";
import { EVIDENCE_LAYERS } from "./taxonomy";

// ---------------------------------------------------------------------------
// WHAT A READER IS SHOWN, AND WHAT THEY ARE OFFERED TO HIDE
//
// Four controls over seven layers. Every test here pins a way the panel could
// quietly mislead — by hiding evidence behind a default, by sweeping an
// unrecognised row into the wrong voice, or by dropping a row nobody can get
// back. None of these would fail a typecheck and most would look fine on screen.
// ---------------------------------------------------------------------------

/** A layer, with only the fields the presentation reads. */
function layer(key: string, extra: Partial<ChainLayer> = {}): ChainLayer {
  return { layer: key, content: `text of ${key}`, ...extra };
}

const FULL_CHAIN: ChainLayer[] = EVIDENCE_LAYERS.map((entry) => layer(entry.key));

test("the four controls between them cover every layer in the vocabulary", () => {
  // A layer covered by no control cannot be turned off, and one covered by two
  // would flicker depending on which was checked first. Both are silent faults.
  const covered = EVIDENCE_LAYER_TOGGLES.flatMap((toggle) => toggle.layers as readonly string[]);
  assert.equal(new Set(covered).size, covered.length, "a layer is claimed by two controls");
  for (const entry of EVIDENCE_LAYERS) {
    assert.ok(covered.includes(entry.key), `${entry.key} belongs to no control`);
  }
});

test("everything is shown by default, because the evidence is not the advanced view", () => {
  // The tempting default is translation-only, since that is the readable part.
  // It is also the exact lesson this panel exists to unteach: a page that opens
  // on the translation alone has told the reader that the translation is the
  // text.
  assert.deepEqual(
    [...DEFAULT_VISIBLE_TOGGLES].sort(),
    EVIDENCE_LAYER_TOGGLES.map((toggle) => toggle.key).sort(),
  );
  assert.equal(visibleChainLayers(FULL_CHAIN, DEFAULT_VISIBLE_TOGGLES).length, FULL_CHAIN.length);
});

test("the original control carries the object, the text and the transcription", () => {
  assert.equal(toggleForLayer("primary_object"), "original");
  assert.equal(toggleForLayer("primary_text"), "original");
  // A reader who asks to see the original is asking for the script, and a
  // typeset transcription is the only form most readers can look at. Behind its
  // own control it would be the most legible witness in the chain, hidden.
  assert.equal(toggleForLayer("transcription"), "original");
});

test("summary and interpretation share one control, because both are ours", () => {
  assert.equal(toggleForLayer("modern_summary"), "meaning");
  assert.equal(toggleForLayer("interpretation"), "meaning");
  // Turning it off must leave the text and nothing of ours behind.
  const shown = visibleChainLayers(FULL_CHAIN, ["original", "transliteration", "translation"]);
  assert.ok(!shown.some((row) => row.layer === "modern_summary"));
  assert.ok(!shown.some((row) => row.layer === "interpretation"));
  assert.ok(shown.some((row) => row.layer === "primary_text"));
});

// ---------------------------------------------------------------------------
// THE ROW NOBODY PLANNED FOR
// ---------------------------------------------------------------------------

test("a layer no control governs is never swept into one", () => {
  // Sweeping it into "what we say it means" would assert whose voice it is,
  // which is the one error this panel exists to prevent.
  assert.equal(toggleForLayer("marginal_gloss"), null);
  assert.equal(toggleForLayer(null), null);
  assert.equal(toggleForLayer(""), null);
});

test("a layer no control governs is shown even with everything switched off", () => {
  // No control can reveal it, so hiding it would drop a row a community wrote
  // with nothing in the interface admitting it exists.
  const rows = [layer("primary_text"), layer("marginal_gloss")];
  const shown = visibleChainLayers(rows, []);
  assert.deepEqual(shown.map((row) => row.layer), ["marginal_gloss"]);
});

test("an unrecognised layer draws after everything the vocabulary knows", () => {
  const rows = [layer("marginal_gloss"), layer("interpretation"), layer("primary_object")];
  assert.deepEqual(
    visibleChainLayers(rows, DEFAULT_VISIBLE_TOGGLES).map((row) => row.layer),
    ["primary_object", "interpretation", "marginal_gloss"],
  );
});

// ---------------------------------------------------------------------------
// THE CONTROL BAR
// ---------------------------------------------------------------------------

test("only the controls this record can actually use are offered", () => {
  // A toggle for a layer no passage carries does nothing, and implies the
  // record has a transliteration somebody has hidden.
  const passages = [{ layers: [layer("primary_text"), layer("translation")] }];
  assert.deepEqual(availableToggles(passages).map((toggle) => toggle.key), ["original", "translation"]);
});

test("the control bar keeps its declared order whatever order the layers arrived in", () => {
  const passages = [{ layers: [layer("interpretation"), layer("transliteration"), layer("primary_object")] }];
  assert.deepEqual(
    availableToggles(passages).map((toggle) => toggle.key),
    ["original", "transliteration", "meaning"],
  );
});

test("a record with only unrecognised layers offers no controls at all", () => {
  // And the rows still draw, per the test above — nothing is lost, there is
  // simply nothing meaningful to switch.
  assert.deepEqual(availableToggles([{ layers: [layer("marginal_gloss")] }]), []);
  assert.deepEqual(availableToggles([]), []);
});

test("ordering for display does not mutate the passage it was handed", () => {
  const rows = [layer("interpretation"), layer("primary_object")];
  visibleChainLayers(rows, DEFAULT_VISIBLE_TOGGLES);
  assert.deepEqual(rows.map((row) => row.layer), ["interpretation", "primary_object"]);
});

// ---------------------------------------------------------------------------
// WHAT THE PANEL SAYS OUT LOUD
// ---------------------------------------------------------------------------

test("three translations are counted as three, however they are attributed", () => {
  // By row, not by distinct source. Two renderings by one scholar in two
  // publications are still two a reader can compare, and a null source is not
  // a reason to drop one from the count.
  const rows = [
    layer("translation", { source_id: "gardiner" }),
    layer("translation", { source_id: "lichtheim" }),
    layer("translation", { source_id: null }),
    layer("primary_text"),
  ];
  assert.equal(translationCount(rows), 3);
  assert.equal(translationCount([layer("primary_text")]), 0);
});

test("readings of what a passage means are counted separately from translations", () => {
  const rows = [layer("translation"), layer("interpretation"), layer("interpretation")];
  assert.equal(interpretationCount(rows), 2);
  assert.equal(translationCount(rows), 1);
});

test("a passage of pure commentary is not mistaken for evidence", () => {
  // Somebody talking about a text that is not here. A real state for a record
  // to be in — it is most of what the Set dataset currently holds — and the
  // panel says so rather than letting commentary stand where evidence should.
  assert.ok(!reachesTheEvidence([layer("modern_summary"), layer("interpretation")]));
  assert.ok(!reachesTheEvidence([layer("translation"), layer("interpretation")]));
  assert.ok(reachesTheEvidence([layer("transcription"), layer("interpretation")]));
  assert.ok(reachesTheEvidence([layer("primary_object")]));
  assert.ok(!reachesTheEvidence([]));
});

test("a translation in copyright reads as a citation, never as an empty box", () => {
  // The reason it is empty is itself the information, and it points a reader at
  // a library.
  const lichtheim: ChainLayer = {
    layer: "translation",
    content: null,
    content_absent_reason: "In copyright. Lichtheim, Ancient Egyptian Literature II, pp. 214-223.",
  };
  assert.ok(isCitationOnly(lichtheim));
  assert.ok(!isCitationOnly(layer("translation")));
});

test("whitespace is not content, and is not a reason either", () => {
  // A row holding a stray newline would otherwise render as a blank panel under
  // a translator's name, which reads as "this is what the text says".
  assert.ok(isCitationOnly({ layer: "translation", content: "   \n ", content_absent_reason: "In copyright." }));
  assert.ok(!isCitationOnly({ layer: "translation", content: "  ", content_absent_reason: "  " }));
});

test("what a passage lacks is reported in chain order", () => {
  // An absent layer is invisible, and a reader cannot ask for something they do
  // not know is possible.
  assert.deepEqual(missingLayers([layer("primary_text"), layer("translation")]), [
    "primary_object",
    "transcription",
    "transliteration",
    "modern_summary",
    "interpretation",
  ]);
  assert.deepEqual(missingLayers(FULL_CHAIN), []);
});

test("an unrecognised layer is not reported as a missing one", () => {
  // It is present; it is simply not in the vocabulary. Listing it under "not
  // recorded" would tell a reader the opposite of the truth.
  const reported = missingLayers([...FULL_CHAIN, layer("marginal_gloss")]);
  assert.deepEqual(reported, []);
});
