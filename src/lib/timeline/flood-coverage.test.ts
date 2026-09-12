import { test } from "node:test";
import assert from "node:assert/strict";

import { FLOOD_COVERAGE, claimedSlugs, coverageCounts, seededFloodSlugs } from "./flood-coverage";

// ---------------------------------------------------------------------------
// THE COVERAGE TABLE CANNOT CLAIM WHAT IT DOES NOT HAVE
//
// A hand-written survey drifts the moment somebody adds or removes a record,
// and a confident line that is no longer true is worse than no line. So every
// slug in the table is resolved against the seed data.
// ---------------------------------------------------------------------------

test("every record the table claims actually exists", () => {
  const seeded = seededFloodSlugs();
  for (const slug of claimedSlugs()) {
    assert.ok(seeded.has(slug), `the coverage table claims "${slug}", which is not a seeded record`);
  }
});

test("every seeded flood record is accounted for by some region", () => {
  // The other direction, and the one that catches a region quietly going
  // missing from the survey after its records were added.
  const claimed = new Set(claimedSlugs());
  const unaccounted = [...seededFloodSlugs()].filter((slug) => !claimed.has(slug));
  // The physical and method records are deliberately not regions — they are
  // events and arguments, not traditions — so they are named here rather than
  // silently allowed.
  const notRegions = new Set([
    "doggerland-drowned",
    "storegga-tsunami",
    "sunda-shelf-drowned",
    "persian-gulf-oasis",
    "nunn-reid-dating-method",
    "flood-tradition-collection-bias",
  ]);
  const surprising = unaccounted.filter((slug) => !notRegions.has(slug));
  assert.deepEqual(surprising, [], `these seeded records belong to no region in the coverage table`);
});

test("a covered region names records and an uncovered one names none", () => {
  for (const row of FLOOD_COVERAGE) {
    if (row.status === "covered") {
      assert.ok(row.slugs && row.slugs.length > 0, `${row.region} is marked covered with no records`);
    } else {
      assert.ok(!row.slugs || row.slugs.length === 0, `${row.region} is not covered but names records`);
    }
  }
});

test("every gap says WHY, and the four reasons are not interchangeable", () => {
  // "Not seeded" is four different facts. An unverifiable citation, a
  // literature that never collected it, and nobody having looked yet are
  // completely different things, and a reader who cannot tell them apart will
  // read an empty row as a statement about the people.
  for (const row of FLOOD_COVERAGE) {
    assert.ok(row.note.length > 30, `${row.region} needs a reason a reader can act on`);
  }
  const counts = coverageCounts();
  assert.ok(counts.covered > 0);
  assert.ok(counts.no_verifiable_source > 0, "the unverifiable citations must be recorded, not dropped");
  assert.ok(counts.under_collected > 0, "the collecting gap must be recorded as a collecting gap");
  assert.ok(counts.not_attempted > 0, "and what nobody has looked at yet must say so");
});

test("the African row is a finding about scholarship, not about Africa", () => {
  const africa = FLOOD_COVERAGE.find((row) => row.region === "Sub-Saharan Africa");
  assert.ok(africa);
  assert.equal(africa.status, "under_collected");
  assert.match(africa.note, /FINDING ABOUT SCHOLARSHIP/);
  // It must not read as though Africa has no flood traditions, which is the
  // claim Frazer made and which was wrong.
  assert.doesNotMatch(africa.note, /Africa has (no|few)/i);
});

test("the omitted traditions are named, not left as blanks", () => {
  // Ifugao and Nüwa were both asked for, and both left out because their usual
  // citation could not be verified. A survey that simply did not mention them
  // would look like they had never been considered.
  const omitted = FLOOD_COVERAGE.filter((row) => row.status === "no_verifiable_source");
  const text = omitted.map((row) => `${row.tradition ?? ""} ${row.note}`).join(" ");
  assert.match(text, /Ifugao/);
  assert.match(text, /Nüwa/);
  for (const row of omitted) {
    assert.match(row.note, /could not be (checked|verified)/i, `${row.region} should say the citation failed`);
  }
});

test("no region is collapsed into a continent", () => {
  // The rule this whole body of material follows. Two Australian nations are
  // two rows; two North American nations are two rows.
  const australia = FLOOD_COVERAGE.filter((row) => row.region === "Australia");
  assert.equal(australia.length, 2);
  assert.notEqual(australia[0].tradition, australia[1].tradition);
  const northAmerica = FLOOD_COVERAGE.filter((row) => row.region === "North America");
  assert.equal(northAmerica.length, 2);
  assert.notEqual(northAmerica[0].tradition, northAmerica[1].tradition);
});

test("nothing in the survey rates or scores a tradition", () => {
  const text = JSON.stringify(FLOOD_COVERAGE);
  for (const banned of [/\bdebunked\b/i, /\bprimitive\b/i, /\bmere myth\b/i, /"confidence"/i, /\bscore\b/i]) {
    assert.doesNotMatch(text, banned, `the survey must not say ${banned}`);
  }
});
