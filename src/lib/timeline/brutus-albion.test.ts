import { test } from "node:test";
import assert from "node:assert/strict";

import {
  BRUTUS_ALBION_EVENTS,
  BRUTUS_ALBION_SOURCES,
  BRUTUS_ALBION_LINKS,
  BRUTUS_ALBION_ANCHOR_SLUG,
} from "./brutus-albion-seed";

const byslug = new Map(BRUTUS_ALBION_EVENTS.map((e) => [e.slug, e]));
const record = (slug: string) => {
  const found = byslug.get(slug);
  assert.ok(found, `${slug} has gone`);
  return found!;
};

// ---------------------------------------------------------------------------
// THE RULE THE WHOLE CLUSTER IS BUILT ON.
//
// "Myth" must not be a terminal label, and neither must "history". The brief
// was explicit: do not reduce this to "Brutus is a myth", and do not present
// alternative readings as established either. These tests are what stop an
// editor quietly resolving the tension in one direction.
// ---------------------------------------------------------------------------

test("the anchor asserts neither that Brutus was real nor that the story is worthless", () => {
  const anchor = record(BRUTUS_ALBION_ANCHOR_SLUG);
  assert.match(anchor.description, /does not say Brutus was real/i);
  assert.match(anchor.description, /does not say the story is worthless/i);
  assert.equal(anchor.eventType, "traditional_account", "the anchor has been refiled as fact or as fiction");
});

test("the traditional date and the absence of any contemporary record are both on the anchor", () => {
  // Either one alone is a distortion. The year without the absence reads as
  // history; the absence without the year hides what the tradition claims.
  const claims = record(BRUTUS_ALBION_ANCHOR_SLUG).claims;
  const traditional = claims.find((c) => c.temporalClaimType === "traditional_date");
  assert.ok(traditional, "the traditional date has gone");
  assert.equal(traditional!.chronology, "traditional");
  const absence = claims.find((c) => /no classical text/i.test(c.originalDateText));
  assert.ok(absence, "the statement that nothing contemporary records him has gone");
  assert.equal(absence!.startYear, undefined, "an absence of evidence has been given a date");
  assert.match(absence!.evidence, /absence of evidence is not evidence of absence/i);
});

test("the synchronism is kept apart from the computed year", () => {
  // Geoffrey dates Brutus by Eli and the Ark. The BCE year is somebody's
  // arithmetic on that. Merging them presents a computation as a source.
  const synchronism = record(BRUTUS_ALBION_ANCHOR_SLUG).claims.find((c) => /Eli/i.test(c.originalDateText));
  assert.ok(synchronism, "the synchronism has gone");
  assert.equal(synchronism!.temporalClaimType, "relative_date");
  assert.match(synchronism!.evidence, /the CLAIM is the\s+synchronism|CLAIM is the synchronism/i);
});

// ---------------------------------------------------------------------------
// THE GROWTH OF THE STORY, WHICH IS THE ACTUAL FINDING
// ---------------------------------------------------------------------------

test("the giants are recorded as absent from the earliest text", () => {
  // The brief asked for this specifically: Historia Brittonum has Brutus and
  // not the Gogmagog conquest. If that claim is lost, the dataset stops being
  // able to show the story growing.
  const claim = record("giants-of-albion").claims.find((c) => /Historia Brittonum/i.test(c.originalDateText));
  assert.ok(claim, "the absence-from-the-earliest-text claim has gone");
  assert.match(claim!.evidence, /does NOT have the giant conquest narrative/i);
  assert.match(claim!.notes ?? "", /NEEDS SOURCE VERIFICATION/, "a claim about what a text lacks must be flagged");
});

test("every element first attested in Geoffrey says so", () => {
  for (const slug of ["giants-of-albion", "gogmagog-and-corineus"]) {
    const text = JSON.stringify(record(slug));
    assert.match(text, /1130s|1136/, `${slug} no longer says when it is first attested`);
  }
});

test("the documentary gap is its own record and states the span", () => {
  const gap = record("documentary-gap-brutus");
  const claim = gap.claims[0];
  assert.ok(claim.startYear! < 0 && claim.endYear! > 800, "the span no longer runs from BCE to CE");
  assert.ok(claim.endYear! - claim.startYear! > 1800, `the gap has shrunk to ${claim.endYear! - claim.startYear!} years`);
  assert.match(gap.description, /does not prove the tradition is empty/i);
});

// ---------------------------------------------------------------------------
// READINGS ARE LABELLED AS READINGS
// ---------------------------------------------------------------------------

test("the displacement reading of the giants is labelled as a reading", () => {
  // The brief's instruction, verbatim: do not say it proves this happened.
  const text = record("giants-of-albion").description;
  assert.match(text, /THIS IS A READING/i);
  assert.match(text, /not evidence that such a displacement happened/i);
  assert.match(text, /must not be quietly joined|different kinds of thing/i);
});

test("the Culhwch dating is held open, with both datings and their consequences", () => {
  const disputed = record("welsh-giants-before-geoffrey");
  assert.equal(disputed.eventType, "disputed");
  const early = disputed.claims.find((c) => c.startYear === 1100);
  const late = disputed.claims.find((c) => c.sourceKey === "rodway2005");
  assert.ok(early && late, "one of the two datings has gone");
  assert.match(late!.evidence, /NOT A FRINGE POSITION/i, "the redating is being treated dismissively");
  assert.match(disputed.description, /genuinely open/i);
});

test("the Trinovantum record carries both etymologies, with the mainstream one marked", () => {
  const claims = record("trinovantum-new-troy").claims;
  assert.equal(claims.length, 2, "one of the two etymologies has gone");
  assert.ok(claims.some((c) => c.chronology === "traditional"), "the traditional etymology has gone");
  const mainstream = claims.find((c) => c.chronology === "conventional");
  assert.ok(mainstream, "the linguistic objection has gone");
  assert.match(mainstream!.evidence, /does not do|NOT DO/i, "the objection no longer says what it does not establish");
});

// ---------------------------------------------------------------------------
// SOURCING HONESTY, SAME RULE AS THE 33 TRANCHE
// ---------------------------------------------------------------------------

test("claims resting on unread books are flagged", () => {
  const flagged = BRUTUS_ALBION_EVENTS.flatMap((e) =>
    e.claims.filter((c) => /NEEDS SOURCE VERIFICATION/.test(`${c.notes ?? ""}${c.evidence}`))
  );
  assert.ok(flagged.length >= 5, `only ${flagged.length} claims carry a verification flag`);
});

test("the sources that could not be opened say so", () => {
  const unopened = BRUTUS_ALBION_SOURCES.filter((s) => /NEEDS SOURCE VERIFICATION/.test(s.notes));
  assert.ok(unopened.length >= 4, `only ${unopened.length} sources admit they were not opened`);
});

test("no confidence scores anywhere", () => {
  for (const e of BRUTUS_ALBION_EVENTS) {
    for (const c of e.claims) {
      const text = `${c.evidence} ${c.notes ?? ""}`;
      assert.doesNotMatch(text, /\b\d{1,3}\s?% (confiden|certain|likel|probab)/i, `${e.slug}`);
      assert.doesNotMatch(text, /confidence (score|level|rating)/i, `${e.slug}`);
    }
  }
});

// ---------------------------------------------------------------------------
// STRUCTURE
// ---------------------------------------------------------------------------

test("the Culhwch edge is relevant rather than evidence_for", () => {
  // It is only evidence if the early dating is right, and that is disputed. An
  // evidence_for edge here would assert the disputed thing on the reader's
  // behalf.
  const edge = BRUTUS_ALBION_LINKS.find((l) => l.from === "welsh-giants-before-geoffrey");
  assert.ok(edge, "the Culhwch edge has gone");
  assert.equal(edge!.relation, "relevant");
  assert.match(edge!.note, /without being evidence|without the link being read as support/i);
});

test("every link joins records that exist here", () => {
  const slugs = new Set(BRUTUS_ALBION_EVENTS.map((e) => e.slug));
  for (const link of BRUTUS_ALBION_LINKS) {
    assert.ok(slugs.has(link.from), `link from ${link.from}`);
    assert.ok(slugs.has(link.to), `link to ${link.to}`);
  }
});

test("every claim names a source that exists here, or names none deliberately", () => {
  const keys = new Set(BRUTUS_ALBION_SOURCES.map((s) => s.key));
  for (const e of BRUTUS_ALBION_EVENTS) {
    for (const c of e.claims) {
      if (c.sourceKey) assert.ok(keys.has(c.sourceKey), `${e.slug}: no source ${c.sourceKey}`);
    }
  }
});
