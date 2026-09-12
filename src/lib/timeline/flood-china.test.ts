import { test } from "node:test";
import assert from "node:assert/strict";

import { FLOOD_CHINA_ANCHOR_SLUG, FLOOD_CHINA_EVENTS, FLOOD_CHINA_LINKS, FLOOD_CHINA_SOURCES } from "./flood-china-seed";
import { NARRATIVE_MOTIFS, isAlternativeViewpoint, isMainstreamViewpoint } from "./taxonomy";

const bySlug = (slug: string) => FLOOD_CHINA_EVENTS.find((event) => event.slug === slug)!;

test("the proposal and its published rebuttal are both on the record", () => {
  // Science published the identification and then published a Comment against
  // it. Seeding one would turn a live dispute into a finding.
  const tradition = bySlug(FLOOD_CHINA_ANCHOR_SLUG);
  const correlation = tradition.claims.find((claim) => claim.temporalClaimType === "proposed_correlation")!;
  assert.equal(correlation.chronology, "disputed");
  const disputes = (correlation.citations ?? []).filter((citation) => citation.relation === "disputes");
  assert.equal(disputes.length, 1, "the rebuttal is cited as a rebuttal");
  assert.equal(disputes[0].sourceKey, "wu2016_comment");
  assert.match(correlation.evidence, /rebuttal|non-synchronous|independent/i);
});

test("the geology is a separate record from the identification", () => {
  const flood = bySlug("jishi-gorge-outburst-flood");
  const claim = flood.claims[0];
  assert.equal(claim.temporalClaimType, "radiometric_date");
  assert.equal(claim.chronology, "geological");
  assert.match(claim.evidence, /does not establish/i);
  // And the record says so in its own description.
  assert.match(flood.description, /about the water/i);
});

test("the three-to-four century gap is stated rather than smoothed over", () => {
  // The tradition says 2300–2200 BCE; the proposed flood is 1920 BCE.
  const tradition = bySlug(FLOOD_CHINA_ANCHOR_SLUG);
  const traditional = tradition.claims.find((claim) => claim.temporalClaimType === "traditional_date")!;
  const correlation = tradition.claims.find((claim) => claim.temporalClaimType === "proposed_correlation")!;
  assert.ok(traditional.startYear! < correlation.startYear!, "the traditional date is the earlier one");
  assert.ok(Math.abs(traditional.startYear! - correlation.startYear!) > 250, "they are centuries apart");
  assert.match(correlation.evidence, /centuries apart|three to four centuries/i);
});

test("the tradition's motifs are sparse, and the sparseness is the finding", () => {
  // No ark, no chosen survivor, no destruction of humanity, no repopulation.
  // Filling these in to match Noah would manufacture the parallel.
  const tradition = bySlug(FLOOD_CHINA_ANCHOR_SLUG);
  const motifs = tradition.motifs ?? [];
  assert.ok(motifs.includes("river_flood"));
  assert.ok(motifs.includes("land_drained"));
  for (const absent of ["boat", "raft", "chosen_survivor", "family_survives", "repopulation", "divine_punishment", "animals_preserved"]) {
    assert.ok(!motifs.includes(absent), `the Gun-Yu tradition must not be marked with "${absent}"`);
  }
  assert.match(tradition.description, /sparse|no vessel|no survivor/i);
});

test("a tradition becoming history is dated as its own event", () => {
  const tradition = bySlug(FLOOD_CHINA_ANCHOR_SLUG);
  const historicised = tradition.claims.find((claim) => claim.temporalClaimType === "date_of_first_known_record")!;
  assert.match(historicised.evidence, /Sima Qian/);
  assert.match(historicised.evidence, /does not/i);
  // And it is honest that the Shiji is not the earliest mention.
  assert.match(historicised.notes ?? "", /not the earliest/i);
});

test("the link to Greece is about historiography, not about the floods", () => {
  const link = FLOOD_CHINA_LINKS.find((edge) => edge.to === "deucalion-flood")!;
  assert.equal(link.relation, "related");
  assert.match(link.note, /not for any resemblance|not alike/i);
});

test("the geological record is relevant to the tradition and never evidence for it", () => {
  const link = FLOOD_CHINA_LINKS.find((edge) => edge.from === "jishi-gorge-outburst-flood")!;
  assert.equal(link.relation, "relevant");
  assert.notEqual(link.relation, "evidence_for");
});

test("every motif and source resolves", () => {
  const motifKeys = new Set<string>(NARRATIVE_MOTIFS.map((motif) => motif.key));
  const sourceKeys = new Set(FLOOD_CHINA_SOURCES.map((source) => source.key));
  for (const event of FLOOD_CHINA_EVENTS) {
    for (const motif of event.motifs ?? []) assert.ok(motifKeys.has(motif), `unknown motif "${motif}"`);
    for (const claim of event.claims) {
      assert.ok(claim.sourceKey && sourceKeys.has(claim.sourceKey), `${event.slug}: bad source`);
      for (const citation of claim.citations ?? []) assert.ok(sourceKeys.has(citation.sourceKey));
    }
  }
  for (const source of FLOOD_CHINA_SOURCES) assert.ok(source.url || source.reference);
});

// ---------------------------------------------------------------------------
// The mainstream / alternative marking
// ---------------------------------------------------------------------------

test("the mainstream mark covers established scholarship and nothing else", () => {
  for (const key of ["conventional", "scientific", "archaeological", "geological"]) {
    assert.equal(isMainstreamViewpoint(key), true, `${key} should be marked mainstream`);
  }
  // The exclusions each matter, and each would be a specific lie.
  for (const key of ["hypothesis", "disputed", "historical", "alternative", "traditional", "hindu", "biblical", "religious"]) {
    assert.equal(isMainstreamViewpoint(key), false, `${key} must NOT be marked mainstream`);
  }
  assert.equal(isMainstreamViewpoint(null), false);
});

test("both poles are marked, so neither reads as the default", () => {
  assert.equal(isAlternativeViewpoint("alternative"), true);
  // And only "alternative" — a hypothesis is a proposal inside science, a
  // disputed claim has specialists on both sides, and a traditional account is
  // not competing for the same job.
  for (const key of ["hypothesis", "disputed", "traditional", "conventional", "religious"]) {
    assert.equal(isAlternativeViewpoint(key), false, `${key} is not "the alternative"`);
  }
});

test("the contested Jishi correlation is marked neither mainstream nor alternative", () => {
  // It is disputed, which is a third thing: specialists on both sides, in the
  // same journal. Marking it either way would pick a winner.
  const correlation = bySlug(FLOOD_CHINA_ANCHOR_SLUG).claims.find(
    (claim) => claim.temporalClaimType === "proposed_correlation"
  )!;
  assert.equal(isMainstreamViewpoint(correlation.chronology), false);
  assert.equal(isAlternativeViewpoint(correlation.chronology), false);
  // Whereas the geology itself is the mainstream reading.
  assert.equal(isMainstreamViewpoint(bySlug("jishi-gorge-outburst-flood").claims[0].chronology), true);
});

test("nothing rates, scores or declares a verdict", () => {
  const banned = /\b(confidence|credibility|debunked|disproven|proven fact|just a myth)\b/i;
  for (const event of FLOOD_CHINA_EVENTS) {
    assert.ok(!banned.test(`${event.summary} ${event.description}`));
    for (const claim of event.claims) assert.ok(!banned.test(`${claim.evidence} ${claim.notes ?? ""}`));
  }
  for (const link of FLOOD_CHINA_LINKS) assert.ok(!banned.test(link.note));
});
