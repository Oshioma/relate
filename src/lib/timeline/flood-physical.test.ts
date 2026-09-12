import { test } from "node:test";
import assert from "node:assert/strict";

import {
  FLOOD_PHYSICAL_ANCHOR_SLUG,
  FLOOD_PHYSICAL_EVENTS,
  FLOOD_PHYSICAL_LINKS,
  FLOOD_PHYSICAL_SOURCES,
} from "./flood-physical-seed";
import { BP_REFERENCE_YEAR, agoFrom } from "./time";
import { TEMPORAL_CLAIM_TYPES } from "./taxonomy";

// The physical half of the flood material, and the half that has to be exactly
// right before any tradition is laid beside it. A tradition placed near a
// mis-converted geological date will appear to correlate with it, and the
// correlation will be arithmetic.

const bySlug = (slug: string) => FLOOD_PHYSICAL_EVENTS.find((event) => event.slug === slug)!;

test("every date is stored on the before-present convention it was published on", () => {
  // Not one hand-written BCE year in the file. This is the rule that keeps the
  // 1,949-year error out, and it is checked structurally rather than trusted.
  for (const event of FLOOD_PHYSICAL_EVENTS) {
    for (const claim of event.claims) {
      assert.equal(
        claim.dateConvention,
        "before_present",
        `${event.slug}: "${claim.originalDateText}" does not declare its convention`
      );
      assert.equal(claim.conventionReferenceYear, BP_REFERENCE_YEAR, `${event.slug}: wrong reference year`);
      assert.ok(claim.startYear != null && claim.startYear < 0, `${event.slug}: expected a deep-time position`);
    }
  }
});

test("the worked example converts the way the brief says it should", () => {
  // 14,650 years ago is about 12,700 BCE, NOT 14,650 BCE.
  const mwp1a = bySlug(FLOOD_PHYSICAL_ANCHOR_SLUG);
  const deschamps = mwp1a.claims[0];
  assert.equal(deschamps.startYear, agoFrom(BP_REFERENCE_YEAR, 14_650));
  assert.equal(deschamps.startYear, -12_700);
  // Which is 12,701 BCE, because there is no year zero.
  assert.equal(1 - deschamps.startYear!, 12_701);
  // And nowhere near where the numerals read as a BCE year would put it.
  assert.equal(Math.abs(deschamps.startYear! - (1 - 14_650)), 1_949);
});

test("the Bonneville flood carries the calibrated age, not the radiocarbon one", () => {
  // The commonly quoted "about 14,500 years ago" is the UNCALIBRATED
  // radiocarbon age. Calibrated, the same evidence gives roughly 17,400–18,000
  // years ago — a three-thousand-year difference from a units mismatch, and
  // the reason this record is on a flood timeline at all.
  const bonneville = bySlug("bonneville-flood");
  const claim = bonneville.claims[0];
  const yearsAgo = BP_REFERENCE_YEAR - claim.startYear!;
  assert.ok(yearsAgo > 17_000 && yearsAgo < 18_600, `expected a calibrated age, got ${yearsAgo} years ago`);
  assert.ok(yearsAgo > 16_000, "the raw radiocarbon age must not be stored as if it were calendar years");
  // And the correction is stated where a reader will meet it.
  assert.match(claim.evidence, /radiocarbon/i);
  assert.match(claim.evidence, /calibrat/i);
  assert.match(bonneville.description, /14,500/);
});

test("the Missoula floods are many, and the record says so", () => {
  const missoula = bySlug("missoula-floods");
  assert.match(missoula.summary + missoula.description, /forty or more|not one/i);
  assert.match(missoula.claims[0].evidence, /separate events|sequence/i);
  // A single merged megaflood is the retelling this record exists to refuse.
  assert.ok(!/the Missoula flood\b/i.test(missoula.title));
});

test("Meltwater Pulse 1B is seeded as a disagreement, not as an event", () => {
  const mwp1b = bySlug("meltwater-pulse-1b");
  assert.equal(mwp1b.eventType, "disputed");
  assert.equal(mwp1b.claims[0].temporalClaimType, "proposed_correlation");
  assert.equal(mwp1b.claims[0].chronology, "hypothesis");
  // The negative result is present, which is the half usually dropped.
  assert.match(mwp1b.claims[0].evidence, /no detectable acceleration/i);
});

test("the Younger Dryas record keeps established, debated and speculative apart", () => {
  const onset = bySlug("younger-dryas-onset");
  assert.match(onset.description, /Established/);
  assert.match(onset.description, /Debated/);
  assert.match(onset.description, /Speculative/);
  // The impact hypothesis is named and is not seeded as a claim here.
  assert.match(onset.description, /Impact Hypothesis/i);
  for (const claim of onset.claims) {
    assert.ok(!/impact|comet|airburst/i.test(claim.evidence), "the contested cause is not seeded as a dated claim");
  }
});

test("nothing here links a physical event to a tradition", () => {
  // The whole point of seeding Part A first. A physical event that exists as
  // the explanation for a story has already been bent to fit it.
  const slugs = new Set(FLOOD_PHYSICAL_EVENTS.map((event) => event.slug));
  for (const link of FLOOD_PHYSICAL_LINKS) {
    assert.ok(slugs.has(link.from), `${link.from} is outside this dataset`);
    assert.ok(slugs.has(link.to), `${link.to} is outside this dataset`);
    assert.notEqual(link.relation, "evidence_for", "no physical event is offered here as evidence for a tradition");
  }
});

test("Atlantis proximity is recorded as a proximity and nothing more", () => {
  const termination = bySlug("younger-dryas-termination");
  const note = termination.claims[0].notes ?? "";
  assert.match(note, /9,600 BCE/);
  assert.match(note, /not an identification/i);
});

test("every claim's type is one the database will accept", () => {
  const keys = new Set<string>(TEMPORAL_CLAIM_TYPES.map((type) => type.key));
  for (const event of FLOOD_PHYSICAL_EVENTS) {
    for (const claim of event.claims) {
      assert.ok(keys.has(claim.temporalClaimType ?? ""), `${event.slug}: unknown type "${claim.temporalClaimType}"`);
    }
  }
});

test("every source is checkable and every claim cites one", () => {
  const keys = new Set(FLOOD_PHYSICAL_SOURCES.map((source) => source.key));
  for (const event of FLOOD_PHYSICAL_EVENTS) {
    for (const claim of event.claims) {
      assert.ok(claim.sourceKey && keys.has(claim.sourceKey), `${event.slug}: bad source "${claim.sourceKey}"`);
      for (const citation of claim.citations ?? []) {
        assert.ok(keys.has(citation.sourceKey), `${event.slug}: bad citation "${citation.sourceKey}"`);
      }
    }
  }
  for (const source of FLOOD_PHYSICAL_SOURCES) {
    assert.ok(source.url || source.reference, `${source.key} gives a reader no way to find it`);
  }
});

test("unverified figures are flagged rather than presented as established", () => {
  // Two figures in this dataset could not be pinned to a primary publication
  // during research. The rule is to mark them, not to drop them silently and
  // not to state them plainly.
  const flagged = FLOOD_PHYSICAL_EVENTS.flatMap((event) => event.claims).filter((claim) =>
    /NEEDS SOURCE VERIFICATION/i.test(`${claim.evidence} ${claim.notes ?? ""}`)
  );
  assert.ok(flagged.length >= 2, `expected the unverified figures to be marked, found ${flagged.length}`);
});

test("nothing rates, scores or declares a verdict", () => {
  const banned = /\b(confidence|credibility|debunked|disproven|pseudoscience|proven fact|just a myth)\b/i;
  for (const event of FLOOD_PHYSICAL_EVENTS) {
    assert.ok(!banned.test(`${event.summary} ${event.description}`), `${event.slug} rates something`);
    for (const claim of event.claims) {
      assert.ok(!banned.test(`${claim.evidence} ${claim.notes ?? ""}`), `${event.slug}: a claim rates something`);
    }
  }
  for (const link of FLOOD_PHYSICAL_LINKS) assert.ok(!banned.test(link.note));
});
