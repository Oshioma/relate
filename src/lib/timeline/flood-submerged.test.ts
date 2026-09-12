import { test } from "node:test";
import assert from "node:assert/strict";

import {
  FLOOD_SUBMERGED_ANCHOR_SLUG,
  FLOOD_SUBMERGED_EVENTS,
  FLOOD_SUBMERGED_LINKS,
  FLOOD_SUBMERGED_SOURCES,
} from "./flood-submerged-seed";
import {
  DATING_METHODS,
  DATE_CONVENTIONS,
  EVENT_RELATIONS,
  NARRATIVE_MOTIFS,
  TEMPORAL_CLAIM_TYPES,
  isMainstreamViewpoint,
} from "./taxonomy";
import { agoFrom, BP_REFERENCE_YEAR } from "./time";

const bySlug = (slug: string) => {
  const event = FLOOD_SUBMERGED_EVENTS.find((e) => e.slug === slug);
  assert.ok(event, `${slug} should exist`);
  return event;
};
const claims = FLOOD_SUBMERGED_EVENTS.flatMap((event) => event.claims);

// ---------------------------------------------------------------------------
// THE VOCABULARY, CHECKED AGAINST THE VOCABULARY
//
// Not a formality. Writing this dataset I invented five keys that read
// perfectly well and do not exist — sea_level_curve, oral_tradition_correlation,
// archaeological_inference, occurred_during, dated_by. TypeScript accepted all
// five, because these fields are typed as string. What rejects them is the
// database, at seed time, silently: the insert fails and the record simply is
// not there. That has happened on this timeline before.
// ---------------------------------------------------------------------------

test("every dating method, convention and claim type is one that exists", () => {
  const methods = new Set<string>(DATING_METHODS.map((m) => m.key));
  const conventions = new Set<string>(DATE_CONVENTIONS.map((c) => c.key));
  const types = new Set<string>(TEMPORAL_CLAIM_TYPES.map((t) => t.key));
  for (const claim of claims) {
    assert.ok(methods.has(claim.datingMethod), `"${claim.datingMethod}" is not a dating method`);
    if (claim.dateConvention) {
      assert.ok(conventions.has(claim.dateConvention), `"${claim.dateConvention}" is not a date convention`);
    }
    if (claim.temporalClaimType) {
      assert.ok(types.has(claim.temporalClaimType), `"${claim.temporalClaimType}" is not a temporal claim type`);
    }
  }
});

test("every link relation is one that exists, and every end of it is a record here", () => {
  const relations = new Set<string>(EVENT_RELATIONS.map((r) => r.key));
  const slugs = new Set(FLOOD_SUBMERGED_EVENTS.map((event) => event.slug));
  for (const link of FLOOD_SUBMERGED_LINKS) {
    assert.ok(relations.has(link.relation), `"${link.relation}" is not a relation`);
    assert.ok(slugs.has(link.from), `${link.from} is not a record in this dataset`);
    assert.ok(slugs.has(link.to), `${link.to} is not a record in this dataset`);
  }
});

test("every motif is one that exists", () => {
  const motifs = new Set<string>(NARRATIVE_MOTIFS.map((motif) => motif.key));
  for (const event of FLOOD_SUBMERGED_EVENTS) {
    for (const motif of event.motifs ?? []) assert.ok(motifs.has(motif), `"${motif}" is not a motif`);
  }
});

test("every claim cites a source this dataset defines", () => {
  const keys = new Set(FLOOD_SUBMERGED_SOURCES.map((source) => source.key));
  for (const claim of claims) {
    assert.ok(claim.sourceKey && keys.has(claim.sourceKey), `claim cites unknown source "${claim.sourceKey}"`);
  }
  for (const source of FLOOD_SUBMERGED_SOURCES) assert.ok(source.url || source.reference);
});

// ---------------------------------------------------------------------------
// BEFORE PRESENT IS NOT BCE
// ---------------------------------------------------------------------------

test("every date carries the convention it was published in", () => {
  // The whole dataset is in years before present, and every figure in it came
  // out of a paper that said so. A claim that does not record the convention
  // is one nobody can check later.
  for (const claim of claims) {
    assert.equal(claim.dateConvention, "before_present", `a claim is missing its convention`);
    assert.equal(claim.conventionReferenceYear, BP_REFERENCE_YEAR);
  }
});

test("the published BCE conversion is one year off, for the reason it always is", () => {
  // Nunn and Reid give their range both ways: 7,250–13,070 cal BP, and
  // 5300–11,120 BC. Those two do not correspond exactly, and the discrepancy is
  // exactly one year in both directions.
  //
  // 13,070 − 1,950 = 11,120, which is the conventional shortcut and what the
  // paper prints. But there is no year zero: 1 BCE is followed by 1 CE, so
  // counting 13,070 years back from 1950 CE lands on 11,121 BCE. The gap
  // between "before present" and BCE is 1,949 years, not 1,950.
  //
  // AT THIS PRECISION IT DOES NOT MATTER — the figure carries centuries of
  // uncertainty and one year is noise. It is asserted here anyway because the
  // same slip at the other end of this codebase is the 1,949-year error that
  // moves prehistoric events by two millennia, and a test that quietly accepted
  // either answer would be no use at all.
  const method = bySlug("nunn-reid-dating-method").claims[0];
  assert.equal(method.startYear, agoFrom(BP_REFERENCE_YEAR, 13070));
  assert.equal(method.endYear, agoFrom(BP_REFERENCE_YEAR, 7250));
  // Astronomical −11120 is 11,121 BCE. The paper says 11,120 BC.
  assert.equal(1 - (method.startYear as number), 11121);
  assert.equal(13070 - 1950, 11120);
  // And the record itself says so, rather than reproducing the paper's figure
  // as though this codebase agreed with it.
  assert.match(method.originalDateText ?? "", /5300–11,120 BC/);
  assert.match(method.evidence, /1,949|no year zero/i);
});

// ---------------------------------------------------------------------------
// THE MEASUREMENT AND THE MEMORY ARE NEVER THE SAME CLAIM
// ---------------------------------------------------------------------------

test("an account carries when the water rose AND that the story remembers it, separately", () => {
  const ngurunderi = bySlug("ngurunderi-backstairs-passage");
  assert.equal(ngurunderi.claims.length, 2);

  const [submergence, memory] = ngurunderi.claims;
  // When the crossing flooded: ordinary geology.
  assert.equal(submergence.chronology, "geological");
  assert.equal(isMainstreamViewpoint(submergence.chronology), true);
  // That the account remembers it: a proposal, and a contested one.
  assert.equal(memory.temporalClaimType, "proposed_correlation");
  assert.equal(memory.chronology, "disputed");
  assert.equal(isMainstreamViewpoint(memory.chronology), false);
});

test("nothing here dates a tradition", () => {
  // A story is not given a year because the landscape it describes has one.
  // Every claim on an account says what it dates, and none of them says the
  // account.
  for (const event of FLOOD_SUBMERGED_EVENTS) {
    if (event.eventType !== "traditional_account") continue;
    for (const claim of event.claims) {
      assert.ok(claim.whatIsDated, `${event.slug}: a claim does not say what it dates`);
      assert.doesNotMatch(
        claim.whatIsDated,
        /^when the (story|account|tradition) /i,
        `${event.slug}: a claim purports to date the telling`
      );
    }
  }
});

test("the peoples are named, and there is no pan-Australian flood record", () => {
  // The same rule the flood traditions follow everywhere on this timeline:
  // distinct nations stay distinct. Ngarrindjeri and Narungga are not two
  // versions of one story and must never be merged into one record.
  const ngarrindjeri = bySlug("ngurunderi-backstairs-passage");
  const narungga = bySlug("narungga-spencer-gulf");
  assert.deepEqual(ngarrindjeri.civilisations, ["Ngarrindjeri"]);
  assert.deepEqual(narungga.civilisations, ["Narungga"]);
  assert.notEqual(ngarrindjeri.slug, narungga.slug);

  for (const event of FLOOD_SUBMERGED_EVENTS) {
    assert.doesNotMatch(
      event.title,
      /\bAboriginal (flood|myth|legend)\b|\bAustralian flood (myth|tradition)\b/i,
      `${event.slug}: a record collapses distinct nations into one`
    );
  }
});

test("the accounts are not filled out to match Noah", () => {
  // These are sea-level accounts. No ark, no chosen survivor, no destruction of
  // humanity, no repopulation — and the sparseness is the finding, exactly as
  // it is for Gun and Yu.
  for (const slug of ["ngurunderi-backstairs-passage", "narungga-spencer-gulf"]) {
    const motifs = bySlug(slug).motifs ?? [];
    assert.ok(motifs.includes("rising_sea"), `${slug} should record the rising sea`);
    for (const absent of ["boat", "chosen_survivor", "divine_punishment", "repopulation", "animals_preserved"]) {
      assert.ok(!motifs.includes(absent), `${slug} must not claim the "${absent}" motif`);
    }
  }
});

// ---------------------------------------------------------------------------
// The physical records
// ---------------------------------------------------------------------------

test("Storegga carries both its radiocarbon age and its calendar age", () => {
  // Quoting the first as the second is the error that moves the Bonneville
  // flood by three thousand years elsewhere on this timeline.
  const claim = bySlug("storegga-tsunami").claims[0];
  assert.match(claim.originalDateText ?? "", /7300 ± 20 14C years BP/);
  assert.match(claim.originalDateText ?? "", /8080–8180 cal BP/);
  assert.match(claim.evidence, /radiocarbon age and the calendar age differ/i);
});

test("the Gulf Oasis refuge is a hypothesis, and the flooding is not", () => {
  const [flooding, refuge] = bySlug("persian-gulf-oasis").claims;
  assert.equal(flooding.chronology, "scientific");
  assert.equal(refuge.chronology, "hypothesis");
  assert.equal(refuge.temporalClaimType, "proposed_correlation");
  assert.match(refuge.evidence, /NOT ESTABLISHED/);
});

test("the tertiary source says it is tertiary, and says what to replace it with", () => {
  const source = FLOOD_SUBMERGED_SOURCES.find((s) => s.key === "sundaland_ref");
  assert.ok(source);
  assert.equal(source.sourceType, "wikipedia");
  assert.match(source.notes ?? "", /TERTIARY SOURCE/);
  assert.match(bySlug("sunda-shelf-drowned").claims[0].evidence, /NEEDS SOURCE VERIFICATION/);
});

test("nothing rates, scores or declares a verdict", () => {
  const text = JSON.stringify(FLOOD_SUBMERGED_EVENTS) + JSON.stringify(FLOOD_SUBMERGED_SOURCES);
  for (const banned of [/"confidence"/i, /\bdebunked\b/i, /\bproven\b/i, /\bdisproven\b/i, /\bscore\b/i]) {
    assert.doesNotMatch(text, banned, `the dataset must not say ${banned}`);
  }
});

test("the anchor is a record that exists", () => {
  assert.ok(FLOOD_SUBMERGED_EVENTS.some((event) => event.slug === FLOOD_SUBMERGED_ANCHOR_SLUG));
});
