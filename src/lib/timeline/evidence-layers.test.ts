import { test } from "node:test";
import assert from "node:assert/strict";

import {
  CLAIM_VIEWPOINTS,
  EVIDENCE_LAYERS,
  evidenceLayerExpectsMultiple,
  evidenceLayerHint,
  evidenceLayerIsOurVoice,
  evidenceLayerIsWitness,
  evidenceLayerLabel,
  evidenceLayerOrder,
  evidenceLayerShortLabel,
  orderEvidenceLayers,
} from "./taxonomy";
import type { SeedPassage, SeedTextLayer } from "./seed-types";

// ---------------------------------------------------------------------------
// THE INTERPRETIVE CHAIN, AND THE THINGS THAT WOULD COLLAPSE IT
//
// The owner's requirement, in their words: never collapse the chain from
// papyrus to meaning into a single field called "FACT". Every test here pins
// one of the specific ways that collapse happens — and most of them are
// plausible refactors somebody would make in good faith, which is why they are
// written down rather than left to judgement.
// ---------------------------------------------------------------------------

test("the chain runs from the object outwards, in that order", () => {
  assert.deepEqual(
    EVIDENCE_LAYERS.map((layer) => layer.key),
    [
      "primary_object",
      "primary_text",
      "transcription",
      "transliteration",
      "translation",
      "modern_summary",
      "interpretation",
    ],
  );
});

test("every layer says what it is and what it is not", () => {
  for (const layer of EVIDENCE_LAYERS) {
    assert.ok(evidenceLayerLabel(layer.key), `${layer.key} needs a label`);
    assert.ok(evidenceLayerShortLabel(layer.key), `${layer.key} needs a short label for a toggle`);
    assert.ok(evidenceLayerHint(layer.key).length > 40, `${layer.key} needs a hint worth reading`);
  }
});

test("a layer carries no number, because the chain is not a score", () => {
  // The distance from an object is an ordering, not a rating, and a vocabulary
  // of seven steps is the most tempting place anyone has yet had to reintroduce
  // the confidence score this whole timeline refuses. The database enforces the
  // same rule on the evidence column; this is the same refusal in the words.
  for (const layer of EVIDENCE_LAYERS) {
    const prose = `${layer.label} ${layer.short} ${layer.hint}`;
    assert.ok(!/\d+\s*%/.test(prose), `${layer.key} states a percentage`);
    assert.ok(!/confidence (score|level|rating)/i.test(prose), `${layer.key} mentions a confidence score`);
  }
});

// ---------------------------------------------------------------------------
// WHAT IS DELIBERATELY NOT A LAYER
// ---------------------------------------------------------------------------

test("there is no ALTERNATIVE_INTERPRETATION layer, and that is the point", () => {
  // The brief lists it beside the others, and making it a layer of its own
  // would quietly rank two readings: one would be the interpretation and the
  // other would be the alternative to it. A competing reading is a SECOND ROW
  // at `interpretation` with its own source and viewpoint — which also lifts
  // the ceiling from two to as many as the scholarship actually has. The Year
  // 400 question alone needs three.
  const keys = EVIDENCE_LAYERS.map((layer) => layer.key as string);
  assert.ok(!keys.includes("alternative_interpretation"));
  assert.ok(!keys.some((key) => key.startsWith("alternative")));
});

test("nothing that already has a home is duplicated as a layer", () => {
  // Each of these is a real requirement with somewhere better to live —
  // timeline_date_claims, timeline_sources, SeedPicture, the event's
  // locationName, EVIDENCE_STATUSES. A second home is two fields that can
  // disagree about the same fact.
  const keys = EVIDENCE_LAYERS.map((layer) => layer.key as string);
  for (const elsewhere of ["date_claim", "source", "image", "location", "evidence_status", "fact"]) {
    assert.ok(!keys.includes(elsewhere), `${elsewhere} has a home already and must not be a layer`);
  }
});

// ---------------------------------------------------------------------------
// WHOSE VOICE IS THIS?
// ---------------------------------------------------------------------------

test("the line between the source's voice and ours falls after translation", () => {
  assert.ok(evidenceLayerIsWitness("primary_object"));
  assert.ok(evidenceLayerIsWitness("primary_text"));
  assert.ok(evidenceLayerIsWitness("transcription"));
  assert.ok(evidenceLayerIsWitness("transliteration"));
  // A translator exercises judgement and translations disagree — and a
  // translator is still answerable word by word to a text that is there.
  assert.ok(evidenceLayerIsWitness("translation"));

  // A summary and an interpretation are not testimony however careful they are.
  assert.ok(!evidenceLayerIsWitness("modern_summary"));
  assert.ok(!evidenceLayerIsWitness("interpretation"));
  assert.ok(evidenceLayerIsOurVoice("modern_summary"));
  assert.ok(evidenceLayerIsOurVoice("interpretation"));
});

test("every known layer is one voice or the other, and never both", () => {
  for (const layer of EVIDENCE_LAYERS) {
    const witness = evidenceLayerIsWitness(layer.key);
    const ours = evidenceLayerIsOurVoice(layer.key);
    assert.notEqual(witness, ours, `${layer.key} must be exactly one of the two`);
  }
});

test("a layer nobody recognises is neither voice", () => {
  // The tempting implementation is `isOurVoice = !isWitness`, and it is wrong.
  // A vocabulary word a community invented is not thereby our own commentary,
  // and it is certainly not the papyrus speaking. Both answer false, and the
  // interface is then able to say it does not know — which is the truth.
  assert.ok(!evidenceLayerIsWitness("marginal_gloss"));
  assert.ok(!evidenceLayerIsOurVoice("marginal_gloss"));
  assert.ok(!evidenceLayerIsWitness(null));
  assert.ok(!evidenceLayerIsOurVoice(undefined));
});

// ---------------------------------------------------------------------------
// ORDERING
// ---------------------------------------------------------------------------

test("an unrecognised layer sorts to the end, never to the front", () => {
  // Sorting it first would let a word nobody defined insert itself between the
  // object and the text written on it, which is the one position in the chain
  // that must not be occupied by a guess.
  assert.equal(evidenceLayerOrder("primary_object"), 0);
  assert.equal(evidenceLayerOrder("marginal_gloss"), EVIDENCE_LAYERS.length);
  assert.equal(evidenceLayerOrder(null), EVIDENCE_LAYERS.length);
  assert.ok(evidenceLayerOrder("marginal_gloss") > evidenceLayerOrder("interpretation"));
});

test("layers render in chain order whatever order they were written in", () => {
  const entered = [
    { layer: "interpretation", who: "Assmann" },
    { layer: "primary_text", who: "the papyrus" },
    { layer: "translation", who: "Gardiner" },
    { layer: "transliteration", who: "Gardiner" },
  ];
  assert.deepEqual(
    orderEvidenceLayers(entered).map((row) => row.layer),
    ["primary_text", "transliteration", "translation", "interpretation"],
  );
});

test("three translations keep the order they were entered in", () => {
  // The sort must be stable within a layer. If Gardiner and Lichtheim swap
  // places between renders, a reader comparing them is comparing a moving
  // target — and the comparison is the entire reason they are both here.
  const translations = [
    { layer: "translation", who: "Gardiner 1931" },
    { layer: "translation", who: "Lichtheim 1976" },
    { layer: "translation", who: "Wente" },
    { layer: "primary_text", who: "the papyrus" },
  ];
  assert.deepEqual(
    orderEvidenceLayers(translations).map((row) => row.who),
    ["the papyrus", "Gardiner 1931", "Lichtheim 1976", "Wente"],
  );
});

test("ordering does not mutate what it was given", () => {
  const rows = [{ layer: "interpretation" }, { layer: "primary_object" }];
  orderEvidenceLayers(rows);
  assert.deepEqual(rows.map((row) => row.layer), ["interpretation", "primary_object"]);
});

test("more than one row is the normal case on exactly two layers", () => {
  assert.ok(evidenceLayerExpectsMultiple("translation"));
  assert.ok(evidenceLayerExpectsMultiple("interpretation"));
  // Transcriptions do occasionally differ, and where they do the second one is
  // a genuine finding about a damaged text. It should read as the exception it
  // is rather than as furniture every passage is expected to carry.
  assert.ok(!evidenceLayerExpectsMultiple("transcription"));
  assert.ok(!evidenceLayerExpectsMultiple("transliteration"));
  assert.ok(!evidenceLayerExpectsMultiple("primary_text"));
});

// ---------------------------------------------------------------------------
// THE SHAPE A DATASET WRITES
// ---------------------------------------------------------------------------

test("a translation still in copyright is a row with a citation and no text", () => {
  // The requirement is explicit: do not reproduce an entire copyrighted modern
  // translation. The row is still worth having — it records that the
  // translation exists, who made it and where to read it, which is exactly what
  // a reader chasing a difference between translators needs.
  const lichtheim: SeedTextLayer = {
    layer: "translation",
    sourceKey: "lichtheim-ael-ii",
    contentAbsentReason:
      "In copyright and not reproduced here. Lichtheim, Ancient Egyptian Literature II, pp. 214-223.",
    language: "English",
    evidence: "Cited so the rendering can be compared with Gardiner's; the text is not reproduced.",
  };
  assert.equal(lichtheim.content, undefined);
  assert.ok(lichtheim.contentAbsentReason);
});

test("a passage carries the object and the edition as two different things", () => {
  // The commonest way to lose a provenance is to let the book about the object
  // stand in for the object. The papyrus is in Dublin; Gardiner's description
  // of it is a publication, and they are not the same thing.
  const passage: SeedPassage = {
    label: "Seth states the basis of his counterclaim",
    reference: "Chester Beatty I, recto 3,1-4,3",
    sourceKey: "gardiner-1931",
    objectName: "Papyrus Chester Beatty I",
    holdingInstitution: "Chester Beatty Library, Dublin",
    layers: [
      {
        layer: "primary_object",
        sourceKey: null,
        content: "A hieratic papyrus roll, Ramesside, from Thebes.",
        evidence: "The object as described in the holding institution's own record.",
      },
    ],
  };
  assert.notEqual(passage.objectName, undefined);
  assert.notEqual(passage.sourceKey, passage.objectName);
});

test("an interpretation may name a viewpoint; a transliteration may not need one", () => {
  // A viewpoint says whose framework a reading belongs to, and it is real on an
  // interpretation. A transliteration belongs to no framework — leaving it
  // unset there is correct rather than incomplete, and the type must allow it.
  const viewpointKeys = CLAIM_VIEWPOINTS.map((viewpoint) => viewpoint.key as string);
  const reading: SeedTextLayer = {
    layer: "interpretation",
    sourceKey: "te-velde-1967",
    content: "Read as a legal dispute over succession rather than a contest of good and evil.",
    viewpoint: "conventional",
    evidence: "Te Velde argues from the narrative's own court framing.",
  };
  const sounds: SeedTextLayer = {
    layer: "transliteration",
    sourceKey: "gardiner-1931",
    content: "jw=f m sA n Wsjr",
    evidence: "Gardiner's transliteration of the transcribed line.",
  };
  assert.ok(viewpointKeys.includes(reading.viewpoint!));
  assert.equal(sounds.viewpoint, undefined);
});
