import { test } from "node:test";
import assert from "node:assert/strict";

import {
  FLOOD_REGIONS_ANCHOR_SLUG,
  FLOOD_REGIONS_EVENTS,
  FLOOD_REGIONS_LINKS,
  FLOOD_REGIONS_SOURCES,
} from "./flood-regions-seed";
import {
  DATE_CONVENTIONS,
  DATING_METHODS,
  EVENT_RELATIONS,
  NARRATIVE_MOTIFS,
  TEMPORAL_CLAIM_TYPES,
} from "./taxonomy";

const bySlug = (slug: string) => {
  const event = FLOOD_REGIONS_EVENTS.find((e) => e.slug === slug);
  assert.ok(event, `${slug} should exist`);
  return event;
};
const claims = FLOOD_REGIONS_EVENTS.flatMap((event) => event.claims);
/** A seed claim is positioned if a start year was written down. */
const isPositioned = (claim: { startYear?: number }) => claim.startYear != null;

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
  for (const event of FLOOD_REGIONS_EVENTS) {
    for (const motif of event.motifs ?? []) assert.ok(motifs.has(motif), `"${motif}" is not a motif`);
  }
  const slugs = new Set(FLOOD_REGIONS_EVENTS.map((e) => e.slug));
  for (const link of FLOOD_REGIONS_LINKS) {
    assert.ok(relations.has(link.relation), `"${link.relation}" is not a relation`);
    assert.ok(slugs.has(link.from) && slugs.has(link.to));
  }
});

test("every claim cites a source this dataset defines", () => {
  const keys = new Set(FLOOD_REGIONS_SOURCES.map((s) => s.key));
  for (const claim of claims) assert.ok(claim.sourceKey && keys.has(claim.sourceKey));
  for (const source of FLOOD_REGIONS_SOURCES) assert.ok(source.url || source.reference);
});

// ---------------------------------------------------------------------------
// NOT ONE OF THESE DATES AN EVENT
// ---------------------------------------------------------------------------

test("every positioned claim dates a document, never a story", () => {
  for (const event of FLOOD_REGIONS_EVENTS) {
    for (const claim of event.claims) {
      if (!isPositioned(claim)) continue;
      assert.match(
        claim.whatIsDated ?? "",
        /published|composed|collection was published|recording of the account/i,
        `${event.slug}: a positioned claim dates something other than a document — "${claim.whatIsDated}"`
      );
      assert.equal(claim.temporalClaimType, "date_of_first_known_record");
    }
  }
});

test("every account carries a positionless claim saying so", () => {
  for (const event of FLOOD_REGIONS_EVENTS) {
    if (event.eventType !== "traditional_account") continue;
    const positionless = event.claims.filter((claim) => !isPositioned(claim));
    assert.equal(positionless.length, 1, `${event.slug} should have exactly one positionless claim`);
    assert.match(positionless[0].evidence, /POSITIONLESS ON PURPOSE/);
  }
});

// ---------------------------------------------------------------------------
// What each one is actually for
// ---------------------------------------------------------------------------

test("the Haudenosaunee account is not filed as a flood", () => {
  // There is no flood in it. The water was always there, nothing is destroyed,
  // and land is MADE rather than uncovered. Compendia file it as a flood myth
  // and then count it as evidence that flood stories are universal.
  const event = bySlug(FLOOD_REGIONS_ANCHOR_SLUG);
  assert.deepEqual(event.motifs, ["earth_diver"]);
  assert.equal(event.subcategory, "Creation account");
  for (const absent of ["rising_sea", "prolonged_rain", "divine_punishment", "boat", "chosen_survivor"]) {
    assert.ok(!(event.motifs ?? []).includes(absent), `must not claim "${absent}"`);
  }
  assert.match(event.description, /Nothing is destroyed and nobody is punished/i);
});

test("the two earth-diver accounts stay two accounts", () => {
  // A shared shape is the finding. It stops being a finding the moment two
  // nations' accounts are merged into one record to display it.
  const haudenosaunee = bySlug(FLOOD_REGIONS_ANCHOR_SLUG);
  const anishinaabe = bySlug("anishinaabe-earth-diver");
  assert.ok((haudenosaunee.motifs ?? []).includes("earth_diver"));
  assert.ok((anishinaabe.motifs ?? []).includes("earth_diver"));
  assert.notDeepEqual(haudenosaunee.civilisations, anishinaabe.civilisations);
  const link = FLOOD_REGIONS_LINKS.find((l) => l.from === "anishinaabe-earth-diver");
  assert.ok(link);
  assert.match(link.note, /worth keeping apart/i);
});

test("there is no pan-regional record collapsing distinct nations", () => {
  for (const event of FLOOD_REGIONS_EVENTS) {
    assert.doesNotMatch(
      event.title,
      /\bNative American\b|\bPolynesian flood myth\b|\bAfrican flood myth\b/i,
      `${event.slug}: collapses distinct peoples into one record`
    );
  }
});

test("the Norse flood is not water and its victims are not people", () => {
  const event = bySlug("ymir-flood-of-blood");
  const motifs = event.motifs ?? [];
  // A hollowed log is a container, not a built ark; nobody is chosen; nobody
  // is warned; humanity does not exist yet to be punished or repopulated.
  assert.ok(motifs.includes("container"));
  for (const absent of ["boat", "chosen_survivor", "divine_warning", "divine_punishment", "repopulation"]) {
    assert.ok(!motifs.includes(absent), `must not claim "${absent}"`);
  }
  assert.match(event.description, /not water and the victims are not humanity/i);
});

test("the Hawaiian record keeps the collectors' disagreement visible", () => {
  // A rising sea and forty days of rain are not the same event, and the
  // difference here is between collectors rather than between traditions.
  const event = bySlug("kai-a-kahinalii");
  assert.deepEqual(event.motifs, ["rising_sea"]);
  assert.ok(!(event.motifs ?? []).includes("prolonged_rain"));
  assert.match(event.description, /Malo and Samuel Kamakau describe a flood caused by a <em>rising sea<\/em>/);
  assert.match(event.claims[0].evidence, /NEEDS SOURCE VERIFICATION/);
});

test("the Māori flood is asked for, not sent", () => {
  const event = bySlug("para-whenua-mea-raft");
  assert.ok((event.motifs ?? []).includes("human_behaviour"));
  assert.ok(!(event.motifs ?? []).includes("divine_punishment"));
  assert.match(event.description, /asked for, by people/i);
});

test("the collection-bias record states what it does NOT claim", () => {
  // The cited paper has a much wider thesis. This record borrows one checkable
  // observation from it and says outright that it is not endorsing the rest.
  const event = bySlug("flood-tradition-collection-bias");
  assert.match(event.claims[0].evidence, /WHAT IS NOT CLAIMED HERE/);
  const source = FLOOD_REGIONS_SOURCES.find((s) => s.key === "witzel_pangaean");
  assert.match(source?.notes ?? "", /is NOT seeded here/);
});

test("the omitted tradition is recorded as a decision, not left as a gap", () => {
  // The Ifugao account of Wigan and Bugan is real and its usual citation could
  // not be verified. The brief says not to seed what cannot be verified — so
  // the omission is written down rather than left looking like an oversight.
  assert.ok(!FLOOD_REGIONS_EVENTS.some((e) => /ifugao|wigan|bugan/i.test(e.slug + e.title)));
});

test("nothing rates, scores or declares a verdict", () => {
  const text = JSON.stringify(FLOOD_REGIONS_EVENTS) + JSON.stringify(FLOOD_REGIONS_SOURCES);
  for (const banned of [/"confidence"/i, /\bdebunked\b/i, /\bproven\b/i, /\bprimitive\b/i, /\bmere myth\b/i]) {
    assert.doesNotMatch(text, banned, `the dataset must not say ${banned}`);
  }
});

test("the anchor is a record that exists", () => {
  assert.ok(FLOOD_REGIONS_EVENTS.some((e) => e.slug === FLOOD_REGIONS_ANCHOR_SLUG));
});
