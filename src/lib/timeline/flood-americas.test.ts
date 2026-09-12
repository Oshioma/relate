import { test } from "node:test";
import assert from "node:assert/strict";

import {
  FLOOD_AMERICAS_ANCHOR_SLUG,
  FLOOD_AMERICAS_EVENTS,
  FLOOD_AMERICAS_LINKS,
  FLOOD_AMERICAS_SOURCES,
} from "./flood-americas-seed";
import {
  DATE_CONVENTIONS,
  DATING_METHODS,
  EVENT_RELATIONS,
  NARRATIVE_MOTIFS,
  TEMPORAL_CLAIM_TYPES,
} from "./taxonomy";
/**
 * Does this SEED claim put its subject somewhere on the axis?
 *
 * Deliberately NOT claimIsPositioned from time.ts — that reads `start_position`,
 * the column the database computes, and a seed claim has no such column yet. It
 * returns false for every seed claim, positioned or not, which is exactly the
 * kind of silently-always-false check this codebase has been bitten by before.
 */
const isPositioned = (claim: { startYear?: number }) => claim.startYear != null;

const bySlug = (slug: string) => {
  const event = FLOOD_AMERICAS_EVENTS.find((e) => e.slug === slug);
  assert.ok(event, `${slug} should exist`);
  return event;
};
const claims = FLOOD_AMERICAS_EVENTS.flatMap((event) => event.claims);

// ---------------------------------------------------------------------------
// The vocabulary, checked against the vocabulary. See flood-submerged.test.ts:
// these fields are typed as string, so an invented key typechecks and is then
// rejected by the database at seed time, silently.
// ---------------------------------------------------------------------------

test("every method, convention, claim type, motif and relation exists", () => {
  const methods = new Set<string>(DATING_METHODS.map((m) => m.key));
  const conventions = new Set<string>(DATE_CONVENTIONS.map((c) => c.key));
  const types = new Set<string>(TEMPORAL_CLAIM_TYPES.map((t) => t.key));
  const motifs = new Set<string>(NARRATIVE_MOTIFS.map((m) => m.key));
  const relations = new Set<string>(EVENT_RELATIONS.map((r) => r.key));

  for (const claim of claims) {
    assert.ok(methods.has(claim.datingMethod), `"${claim.datingMethod}" is not a dating method`);
    assert.ok(conventions.has(claim.dateConvention ?? ""), `"${claim.dateConvention}" is not a convention`);
    assert.ok(types.has(claim.temporalClaimType ?? ""), `"${claim.temporalClaimType}" is not a claim type`);
  }
  for (const event of FLOOD_AMERICAS_EVENTS) {
    for (const motif of event.motifs ?? []) assert.ok(motifs.has(motif), `"${motif}" is not a motif`);
  }
  const slugs = new Set(FLOOD_AMERICAS_EVENTS.map((e) => e.slug));
  for (const link of FLOOD_AMERICAS_LINKS) {
    assert.ok(relations.has(link.relation), `"${link.relation}" is not a relation`);
    assert.ok(slugs.has(link.from) && slugs.has(link.to), `${link.from} → ${link.to} names a record not here`);
  }
});

test("every claim cites a source this dataset defines", () => {
  const keys = new Set(FLOOD_AMERICAS_SOURCES.map((source) => source.key));
  for (const claim of claims) assert.ok(claim.sourceKey && keys.has(claim.sourceKey));
  for (const source of FLOOD_AMERICAS_SOURCES) assert.ok(source.url || source.reference);
});

// ---------------------------------------------------------------------------
// NOT ONE OF THESE DATES A FLOOD
// ---------------------------------------------------------------------------

test("no flood in this dataset is given a date", () => {
  // The single thing this dataset must not do. Every claim that is POSITIONED
  // dates a document — when a text was written or copied — and every claim
  // about the flood itself carries no position at all, because no source here
  // supplies one.
  for (const event of FLOOD_AMERICAS_EVENTS) {
    for (const claim of event.claims) {
      if (!isPositioned(claim)) continue;
      assert.match(
        claim.whatIsDated ?? "",
        /written down|copy of the text|compilation of the manuscript|account was written/i,
        `${event.slug}: a positioned claim dates something other than a document — "${claim.whatIsDated}"`
      );
    }
  }
});

test("the Popol Vuh flood is positionless, from a culture with a precise calendar", () => {
  const flood = bySlug(FLOOD_AMERICAS_ANCHOR_SLUG).claims[0];
  assert.equal(isPositioned(flood), false);
  assert.equal(flood.temporalClaimType, "previous_world");
  assert.match(flood.evidence, /DELIBERATELY POSITIONLESS/);
});

test("the Aztec elapsed count is kept as a duration and never converted", () => {
  // The text gives a real number — four hundred years, two ages and seventy-six
  // — and it is anchored to nothing. A count without an anchor is not a date,
  // however precise it looks.
  const claim = bySlug("aztec-fourth-sun-flood").claims[0];
  assert.equal(isPositioned(claim), false);
  assert.equal(claim.durationYears, 676);
  assert.match(claim.originalDateText ?? "", /four hundred years, plus two ages, plus seventy-six years/);
  assert.match(claim.evidence, /NEEDS SOURCE VERIFICATION/);
});

test("the documents' own dates are recorded, and marked as the documents' own", () => {
  const dated = claims.filter(isPositioned);
  assert.ok(dated.length >= 4, "the manuscripts should be dated even though the floods are not");
  for (const claim of dated) {
    assert.ok(
      claim.temporalClaimType === "date_of_first_known_record" || claim.temporalClaimType === "approximate_date",
      `a document date has the wrong claim type: ${claim.temporalClaimType}`
    );
  }
});

// ---------------------------------------------------------------------------
// What each account actually contains
// ---------------------------------------------------------------------------

test("the wooden people are not humanity, and the record does not say they are", () => {
  const event = bySlug(FLOOD_AMERICAS_ANCHOR_SLUG);
  assert.ok((event.motifs ?? []).includes("previous_world_destroyed"));
  // No ark, no chosen survivor, no covenant, and no repopulation FROM the
  // survivors — the survivors are monkeys.
  for (const absent of ["boat", "chosen_survivor", "repopulation", "sign_given", "sacrifice_after"]) {
    assert.ok(!(event.motifs ?? []).includes(absent), `the Popol Vuh record must not claim "${absent}"`);
  }
  assert.match(event.description, /not a flood that destroys humanity/i);
});

test("the Huarochirí warning comes from an animal, and nobody is chosen", () => {
  const event = bySlug("huarochiri-villca-coto");
  const motifs = event.motifs ?? [];
  assert.ok(motifs.includes("animal_warning"));
  assert.ok(motifs.includes("mountain_refuge"));
  // The differences that matter: no god decides, nobody is chosen, there is no
  // boat and no punishment.
  for (const absent of ["divine_warning", "divine_punishment", "chosen_survivor", "boat"]) {
    assert.ok(!motifs.includes(absent), `the Huarochirí record must not claim "${absent}"`);
  }
});

test("the redactor's own reinterpretation is recorded, both readings named", () => {
  // "We Christians believe it refers to the time of the Flood. But they believe
  // it was Villca Coto mountain that saved them." The document records the
  // moment of its own reinterpretation and names both sides; so does this.
  const event = bySlug("huarochiri-villca-coto");
  assert.match(event.description, /Christians believe this refers to the time of the Flood/i);
  assert.match(event.description, /Villca Coto mountain that saved them/i);
});

test("the circumstances of the compilation are their own record", () => {
  const event = bySlug("huarochiri-manuscript-compiled");
  assert.equal(event.claims[0].startYear, 1608);
  assert.match(event.description, /trying to erase/i);
  // And it is linked to the story it preserves, so the two cannot be read apart.
  const link = FLOOD_AMERICAS_LINKS.find((l) => l.to === "huarochiri-manuscript-compiled");
  assert.ok(link, "the account should point at the circumstances of its recording");
});

test("the traditions stay distinct, and none is called a version of Noah", () => {
  const text = JSON.stringify(FLOOD_AMERICAS_EVENTS);
  assert.doesNotMatch(text, /\bMesoamerican flood myth\b|\bAndean flood myth\b/i);
  // The link between the two Mesoamerican records says outright that they are
  // not versions of one story.
  const link = FLOOD_AMERICAS_LINKS.find((l) => l.relation === "related");
  assert.ok(link);
  assert.match(link.note, /NOT versions of one story/);
});

test("nothing rates, scores or declares a verdict", () => {
  const text = JSON.stringify(FLOOD_AMERICAS_EVENTS) + JSON.stringify(FLOOD_AMERICAS_SOURCES);
  for (const banned of [/"confidence"/i, /\bdebunked\b/i, /\bproven\b/i, /\bmere myth\b/i, /\bscore\b/i]) {
    assert.doesNotMatch(text, banned, `the dataset must not say ${banned}`);
  }
});

test("the anchor is a record that exists", () => {
  assert.ok(FLOOD_AMERICAS_EVENTS.some((event) => event.slug === FLOOD_AMERICAS_ANCHOR_SLUG));
});
