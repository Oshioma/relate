import { test } from "node:test";
import assert from "node:assert/strict";

import {
  CLAIM_VIEWPOINTS,
  chronologyLabel,
  isAlternativeViewpoint,
  isMainstreamViewpoint,
  isWidespreadAlternative,
  viewpointBlurb,
  viewpointHint,
} from "./taxonomy";
import { ATLANTIS_EVENTS } from "./atlantis-seed";

// ---------------------------------------------------------------------------
// "WIDELY-HELD ALTERNATIVE VIEW"
//
// The distinction this records is REACH and nothing else. "Outside the
// mainstream" currently covers both an idea taught in millions of homes and one
// proposed once in a pamphlet, and a reader deserves to know which is in front
// of them — but how many people hold an idea says nothing about whether it is
// right, and a popular alternative and an obscure one can be equally
// unsupported.
//
// These tests exist to stop the label drifting into a ranking, which is the one
// way it could do real harm.
// ---------------------------------------------------------------------------

test("a widely-held alternative is still an alternative", () => {
  // It has to answer true to both, or the alternative box stops rendering for
  // exactly the claims most readers arrive looking for.
  assert.equal(isAlternativeViewpoint("alternative_widespread"), true);
  assert.equal(isWidespreadAlternative("alternative_widespread"), true);

  // And an ordinary alternative is not promoted by the new key existing.
  assert.equal(isAlternativeViewpoint("alternative"), true);
  assert.equal(isWidespreadAlternative("alternative"), false);
  assert.equal(isWidespreadAlternative(null), false);
  assert.equal(isWidespreadAlternative("conventional"), false);
});

test("being widely held never makes a claim mainstream", () => {
  // This is the failure that would matter. Millions of people holding a view
  // is a fact about people, not about evidence, and the mainstream mark means
  // "this is where current scholarship sits".
  assert.equal(isMainstreamViewpoint("alternative_widespread"), false);
});

test("the reach label cannot be read as a verdict", () => {
  const entry = CLAIM_VIEWPOINTS.find((v) => v.key === "alternative_widespread");
  assert.ok(entry);
  assert.equal(entry.label, "Widely-held alternative view");
  // No scoring or verdict words anywhere in what a reader is shown.
  const shown = `${entry.label} ${entry.hint}`;
  for (const banned of [/\bdebunked\b/i, /\bproven\b/i, /\bdisproven\b/i, /\bconfidence\b/i, /\bscore\b/i, /\brating\b/i, /\bmore likely\b/i, /\bcredib/i]) {
    assert.doesNotMatch(shown, banned, `the hint must not say ${banned}`);
  }
  // And it must say outright that popularity is not evidence, because that is
  // the inference a reader will otherwise make for themselves.
  assert.match(entry.hint, /not evidence/i);
});

test("Donnelly's Atlantis is filed by reach, not by merit", () => {
  // Donnelly is the reason the key exists: Atlantis-as-a-real-place is the
  // alternative reading nearly every reader has already met, and filing it
  // beside a one-pamphlet proposal told them nothing.
  const donnelly = ATLANTIS_EVENTS.flatMap((event) => event.claims).find(
    (claim) => claim.chronology === "alternative_widespread"
  );
  assert.ok(donnelly, "the Donnelly claim should carry the widely-held mark");
  assert.equal(isMainstreamViewpoint(donnelly.chronology), false);
  assert.equal(isAlternativeViewpoint(donnelly.chronology), true);
  // The mark is on the claim, and it has not quietly acquired a score alongside.
  assert.equal("confidence" in donnelly, false);
});

test("the label survives an unknown key rather than breaking the card", () => {
  assert.equal(chronologyLabel("alternative_widespread"), "Widely-held alternative view");
  assert.equal(chronologyLabel("some_future_key"), "some future key");
  assert.equal(chronologyLabel(null), "Not stated");
});

test("a column subtitle is short enough to sit above the dates, not bury them", () => {
  // The comparison panel prints this as a subtitle in a narrow column. The
  // dropdown hint runs to eleven lines there, above a single claim, and reads
  // as a warning notice rather than a label — which is how it shipped once and
  // what this test is here to stop happening again.
  for (const viewpoint of CLAIM_VIEWPOINTS) {
    const blurb = viewpointBlurb(viewpoint.key);
    // "Other" carries no explanation on purpose — there is nothing true to say
    // about a viewpoint whose whole content is "not one of the above" — and the
    // panel renders no subtitle at all rather than an empty line.
    assert.ok(
      blurb.length <= 180,
      `${viewpoint.key} subtitle is ${blurb.length} chars — too long for the column`
    );
  }
});

test("the short form drops nothing that mattered", () => {
  // The dropdown keeps the full explanation; only the column gets the short one.
  assert.notEqual(viewpointBlurb("alternative_widespread"), viewpointHint("alternative_widespread"));
  assert.match(viewpointHint("alternative_widespread"), /not evidence/i);
  // And the short form still carries the one thing a reader must not miss:
  // that this is a statement about reach and not about support.
  assert.match(viewpointBlurb("alternative_widespread"), /not evidence/i);
});

test("a viewpoint with no short form falls back rather than showing nothing", () => {
  assert.equal(viewpointBlurb("historical"), viewpointHint("historical"));
  assert.equal(viewpointBlurb("no_such_viewpoint"), "");
});
