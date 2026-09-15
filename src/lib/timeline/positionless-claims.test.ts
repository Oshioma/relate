import { test } from "node:test";
import assert from "node:assert/strict";

import type { SeedEvent } from "./seed-types";

// =============================================================================
// A CLAIM WITH NO YEAR IS ONLY ALLOWED TO BE CERTAIN KINDS OF CLAIM.
//
// The database says so, in timeline_date_claims_start_or_positionless:
//
//     start_year is not null
//     or coalesce(temporal_claim_type, '') in
//       ('cyclic', 'eternal', 'no_beginning', 'primordial', 'previous_world', 'unknown')
//
// WHY THIS NEEDS A TEST RATHER THAN TRUST. A claim that breaks the rule does
// not crash anything. It is rejected at seed time, one row among hundreds, and
// what a reader gets is a record silently missing a claim — usually the
// interesting one, because the positionless claims are the ones saying
// something a date cannot say. Nothing in the app ever reports it.
//
// It nearly happened while the 33 dataset was being written: the claim carrying
// the whole Vedic-to-Buddhist transmission argument was written as a
// proposed_correlation with no year, which is exactly the shape the constraint
// throws away.
//
// The cosmology dataset already checked this for itself. This checks it for
// every dataset there is, and finds new ones by reading the directory rather
// than by being remembered — the same reason seeded-pictures.test.ts scans.
// =============================================================================

/** The only temporal claim types the database will accept without a start year. */
const POSITIONLESS = new Set(["cyclic", "eternal", "no_beginning", "primordial", "previous_world", "unknown"]);

async function everySeededEvent(): Promise<{ file: string; event: SeedEvent }[]> {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.dirname(new URL(import.meta.url).pathname);
  const out: { file: string; event: SeedEvent }[] = [];
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith("-seed.ts"))) {
    const loaded: Record<string, unknown> = await import(`./${file}`);
    for (const [name, value] of Object.entries(loaded)) {
      // *_EVENTS is the events convention; PERIODS carries claims too and is
      // seeded by the same path, so it is not exempt.
      if ((name.endsWith("_EVENTS") || name === "PERIODS") && Array.isArray(value)) {
        for (const event of value as SeedEvent[]) out.push({ file, event });
      }
    }
  }
  return out;
}

test("no seeded claim would be thrown away by the positionless constraint", async () => {
  const rejected: string[] = [];
  for (const { file, event } of await everySeededEvent()) {
    for (const claim of event.claims ?? []) {
      if (claim.startYear != null) continue;
      if (POSITIONLESS.has(claim.temporalClaimType ?? "")) continue;
      rejected.push(
        `${file}: ${event.slug} — "${claim.originalDateText}" has no start year and is a ` +
          `${claim.temporalClaimType ?? "(none)"}, which the database will refuse`
      );
    }
  }
  assert.deepEqual(
    rejected,
    [],
    `these claims would be silently dropped at seed time:\n  ${rejected.join("\n  ")}`
  );
});

test("no seeded claim gives an end year without a start year", async () => {
  // timeline_date_claims_end_needs_start. The far end of a range with no near
  // end is not a range, and it is rejected the same silent way.
  const rejected: string[] = [];
  for (const { file, event } of await everySeededEvent()) {
    for (const claim of event.claims ?? []) {
      if (claim.endYear != null && claim.startYear == null) {
        rejected.push(`${file}: ${event.slug} — "${claim.originalDateText}" ends without starting`);
      }
    }
  }
  assert.deepEqual(rejected, [], `these claims would be refused:\n  ${rejected.join("\n  ")}`);
});

test("the scan actually found the datasets, rather than quietly finding none", async () => {
  // The failure that makes every test above pass for the wrong reason.
  const all = await everySeededEvent();
  assert.ok(all.length > 100, `the directory scan found only ${all.length} records`);
  const positionless = all.flatMap(({ event }) =>
    (event.claims ?? []).filter((c) => c.startYear == null)
  );
  assert.ok(
    positionless.length > 5,
    `only ${positionless.length} positionless claims exist, so the rule above is barely being exercised`
  );
});
