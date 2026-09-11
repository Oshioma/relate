import { test } from "node:test";
import assert from "node:assert/strict";

import { ATLANTIS_EVENTS, ATLANTIS_LINKS, ATLANTIS_SOURCES } from "./atlantis-seed";
import { LEMURIA_EVENTS, LEMURIA_LINKS, LEMURIA_SOURCES } from "./lemuria-seed";
import { CLAIM_VIEWPOINTS, EVENT_RELATIONS, relationLabel } from "./taxonomy";
import type { SeedEvent, SeedEventLink, SeedSource } from "./seed-types";

// WHAT THESE TESTS ARE FOR.
//
// An edge between two records is a claim, and the whole point of the table is
// that it carries who asserted it. The checks below are in two halves.
//
// The first half is plumbing that fails loudly in a browser and silently in a
// seed file: an edge pointing at a slug that does not exist, a sourceKey with a
// typo in it, a viewpoint the vocabulary has never heard of, two edges the
// database's unique index would reject on the second insert.
//
// The second half is EDITORIAL, and it is the half that matters. Mu must not
// quietly become Lemuria. Mauritia must not quietly become evidence for
// Sclater. No note may rate anything. These are the briefs written down as
// assertions, so that a later tidy-up cannot undo them without a red test.

const RELATION_KEYS = new Set<string>(EVENT_RELATIONS.map((relation) => relation.key));
const VIEWPOINT_KEYS = new Set<string>(CLAIM_VIEWPOINTS.map((viewpoint) => viewpoint.key));

type Dataset = { name: string; events: SeedEvent[]; sources: SeedSource[]; links: SeedEventLink[] };

const DATASETS: Dataset[] = [
  { name: "Atlantis", events: ATLANTIS_EVENTS, sources: ATLANTIS_SOURCES, links: ATLANTIS_LINKS },
  { name: "Lemuria", events: LEMURIA_EVENTS, sources: LEMURIA_SOURCES, links: LEMURIA_LINKS },
];

// The Lemuria dataset links to an Atlantis record, which is correct and is the
// reason the seeder resolves slugs against the community rather than the file.
const ALL_SLUGS = new Set(DATASETS.flatMap((dataset) => dataset.events.map((event) => event.slug)));

function find(links: SeedEventLink[], from: string, to: string): SeedEventLink[] {
  return links.filter((link) => link.from === from && link.to === to);
}

// ---------------------------------------------------------------------------
// Plumbing
// ---------------------------------------------------------------------------

for (const dataset of DATASETS) {
  test(`${dataset.name}: every edge joins two records that exist`, () => {
    for (const link of dataset.links) {
      assert.ok(ALL_SLUGS.has(link.from), `${dataset.name}: no such record "${link.from}"`);
      assert.ok(ALL_SLUGS.has(link.to), `${dataset.name}: no such record "${link.to}"`);
    }
  });

  test(`${dataset.name}: nothing is related to itself`, () => {
    // The table has a check constraint for this; failing here says which row.
    for (const link of dataset.links) {
      assert.notEqual(link.from, link.to, `${dataset.name}: "${link.from}" links to itself`);
    }
  });

  test(`${dataset.name}: every relation is one the app can render`, () => {
    for (const link of dataset.links) {
      assert.ok(RELATION_KEYS.has(link.relation), `${dataset.name}: unknown relation "${link.relation}"`);
    }
  });

  test(`${dataset.name}: every viewpoint comes from the claim vocabulary`, () => {
    // The same vocabulary the date claims use, deliberately: "whose account is
    // this?" must have one answer across the feature, not two.
    for (const link of dataset.links) {
      if (link.viewpoint == null) continue;
      assert.ok(VIEWPOINT_KEYS.has(link.viewpoint), `${dataset.name}: unknown viewpoint "${link.viewpoint}"`);
    }
  });

  test(`${dataset.name}: every cited source exists in the dataset`, () => {
    const keys = new Set(dataset.sources.map((source) => source.key));
    for (const link of dataset.links) {
      if (!link.sourceKey) continue;
      assert.ok(keys.has(link.sourceKey), `${dataset.name}: no such source "${link.sourceKey}"`);
    }
  });

  test(`${dataset.name}: no two edges collide on the database's unique index`, () => {
    // (from, to, relation, coalesce(viewpoint, '')). A duplicate would be
    // rejected on insert, which in a seeder means a half-written dataset.
    const seen = new Set<string>();
    for (const link of dataset.links) {
      const key = [link.from, link.to, link.relation, link.viewpoint ?? ""].join("|");
      assert.ok(!seen.has(key), `${dataset.name}: duplicate edge ${key}`);
      seen.add(key);
    }
  });

  test(`${dataset.name}: every edge says why, in words`, () => {
    for (const link of dataset.links) {
      assert.ok(link.note.trim().length > 20, `${dataset.name}: ${link.from} → ${link.to} has no real note`);
    }
  });
}

// ---------------------------------------------------------------------------
// Editorial
// ---------------------------------------------------------------------------

test("Mu is ASSOCIATED with Lemuria, never identified with it", () => {
  const edges = find(LEMURIA_LINKS, "mu-destruction", "lemuria-claimed-epoch");
  assert.equal(edges.length, 1);
  // The brief: "DO NOT automatically make Mu another name for Lemuria." Later
  // writers treating them as one thing is a fact about the literature;
  // "identified" would assert that a source establishes they ARE one thing,
  // and none does.
  assert.equal(edges[0].relation, "associated");
  assert.ok(edges[0].sourceKey, "the association is somebody's; it needs a source");

  const identifications = LEMURIA_LINKS.filter((link) => link.relation === "identified");
  assert.deepEqual(identifications, [], "nothing in this dataset identifies two records as the same thing");
});

test("Mauritia is relevant to Sclater, not evidence for him", () => {
  const edges = find(LEMURIA_LINKS, "mauritia-fragment", "sclater-proposes-lemuria");
  assert.equal(edges.length, 1);
  // A submerged continental fragment under Mauritius is genuinely relevant to
  // a hypothesis about a submerged landmass in the Indian Ocean, and is not
  // support for it — it is far too small, far too old, and never a land bridge
  // for lemurs. "relevant" exists precisely so this can be linked without the
  // link being read as vindication.
  assert.equal(edges[0].relation, "relevant");
  assert.notEqual(edges[0].relation, "evidence_for");

  // And the contrast that gives the distinction its meaning: the India–
  // Madagascar split IS offered as evidence, because it is the real land
  // connection Sclater was reaching for. The two edges must not be the same
  // kind, or the panel says nothing.
  const real = find(LEMURIA_LINKS, "india-madagascar-separation", "sclater-proposes-lemuria");
  assert.equal(real.length, 1);
  assert.equal(real[0].relation, "evidence_for");
});

test("Theosophy's ordering and Steiner's are two claims, not one", () => {
  const edges = find(LEMURIA_LINKS, "lemuria-claimed-epoch", "atlantis-destruction");
  assert.equal(edges.length, 2, "one edge per tradition");
  const viewpoints = edges.map((edge) => edge.viewpoint).sort();
  assert.notEqual(viewpoints[0], viewpoints[1], "the two orderings must be told apart by viewpoint");
  for (const edge of edges) {
    assert.equal(edge.relation, "precedes");
    assert.ok(edge.sourceKey, "an ordering claim names whose ordering it is");
  }
});

test("plate tectonics answers Sclater rather than merely following him", () => {
  const edges = find(LEMURIA_LINKS, "plate-tectonics-supersedes-lemuria", "sclater-proposes-lemuria");
  assert.equal(edges.length, 1);
  assert.equal(edges[0].relation, "responds_to");
});

test("no edge rates anything, on either dataset", () => {
  // The standing rule across this feature: no confidence scores, and no
  // one-word verdicts standing in for them.
  const banned = /\b(confidence|credibility|plausibility|score|rating|debunked|disproven|proven true)\b/i;
  for (const dataset of DATASETS) {
    for (const link of dataset.links) {
      assert.ok(!banned.test(link.note), `${dataset.name}: ${link.from} → ${link.to} rates something`);
    }
  }
});

test("an edge reads correctly from both ends", () => {
  // Stored once, from → to. If the far end were shown the same wording, a
  // reader on the Atlantis record would be told Atlantis comes before Lemuria.
  assert.equal(relationLabel("precedes", "from"), "Comes before");
  assert.equal(relationLabel("precedes", "to"), "Comes after");
  assert.equal(relationLabel("source_of", "to"), "Draws its material from");
  // Symmetric relations must not invert into nonsense.
  assert.equal(relationLabel("associated", "from"), relationLabel("associated", "to"));
  assert.equal(relationLabel("relevant", "from"), relationLabel("relevant", "to"));
});
