import { test } from "node:test";
import assert from "node:assert/strict";

import { claimPositionKey, matchStoredClaim, seedClaimsByPosition } from "./reconcile-claims";
import type { StoredClaimRow } from "./reconcile-claims";
import { SET_SUTEKH_EVENTS } from "./set-sutekh-seed";

// ---------------------------------------------------------------------------
// THE BUTTON THAT SAID "UPDATED 4 DATES" FOR EVER
//
// The old matcher took a shortcut: if exactly one stored row sat at a position,
// that was the match, and the wording was never checked. That is right when one
// seeded claim sits at that position. It is wrong when several do — and it made
// the repair button report the same four updates on every press, on the same two
// records, indefinitely.
//
// Both records had gained positionless claims in a later research round while
// the community still held a copy with one row. Every new claim matched that one
// row and each overwrote the last, so the work was real and undone immediately.
//
// THE FIX HAS TWO PARTS AND THEY DO DIFFERENT JOBS, which reintroducing the old
// matcher made plain: the convergence test below still passed without the
// wording rule, because not re-offering a claimed row is enough to stop the
// loop on its own.
//
//   not re-offering a claimed row  stops the LOOP. The button converges.
//   requiring the wording to match stops the CORRUPTION. Without it the first
//                                  seeded claim takes the row whatever it says,
//                                  so a row is silently reassigned to a claim
//                                  that was never its owner — it just stops
//                                  happening twice.
//
// So the second test below is the one that pins correctness and the last is the
// one that pins convergence. Neither covers for the other, and saying which is
// which is better than implying one test proves the whole fix.
// ---------------------------------------------------------------------------

const row = (id: string, start: number | null, end: number | null, text: string): StoredClaimRow => ({
  id,
  start_year: start,
  end_year: end,
  original_date_text: text,
});

const none = new Set<string>();

test("one seeded claim at a position takes the single row there", () => {
  const stored = [row("a", -1149, -1145, "stored wording")];
  const match = matchStoredClaim(
    { startYear: -1149, endYear: -1145, originalDateText: "new wording" },
    stored,
    { seedClaimsAtThisPosition: 1, alreadyClaimed: none }
  );
  // The wording is allowed to differ — correcting it is the whole point of the
  // repair. With one claim and one row there is nothing to confuse.
  assert.equal(match?.id, "a");
});

test("several seeded claims at one position do NOT all take the same row", () => {
  // THE BUG, in one assertion. Four positionless seeded claims, one stored row.
  const stored = [row("only", null, null, "the wording it was seeded with")];
  const unmatched = matchStoredClaim(
    { originalDateText: "a different claim entirely" },
    stored,
    { seedClaimsAtThisPosition: 4, alreadyClaimed: none }
  );
  assert.equal(unmatched, null, "a row that could belong to any of four claims belongs to none of them");

  // The one whose wording actually matches still gets it.
  const matched = matchStoredClaim(
    { originalDateText: "the wording it was seeded with" },
    stored,
    { seedClaimsAtThisPosition: 4, alreadyClaimed: none }
  );
  assert.equal(matched?.id, "only");
});

test("a row taken earlier in the run is not offered again", () => {
  const stored = [row("a", null, null, "same wording"), row("b", null, null, "same wording")];
  const first = matchStoredClaim({ originalDateText: "same wording" }, stored, {
    seedClaimsAtThisPosition: 1,
    alreadyClaimed: none,
  });
  // Two rows with identical wording are genuinely ambiguous, so neither is taken.
  assert.equal(first, null, "two identical rows cannot be told apart and must not be guessed between");
});

test("distinct wording still tells several rows apart", () => {
  const stored = [row("a", -9600, null, "Plato"), row("b", -9600, null, "Donnelly")];
  assert.equal(
    matchStoredClaim({ startYear: -9600, originalDateText: "Donnelly" }, stored, {
      seedClaimsAtThisPosition: 2,
      alreadyClaimed: none,
    })?.id,
    "b"
  );
});

test("null is a position, not an absence", () => {
  assert.equal(claimPositionKey({}), "null|null");
  assert.equal(claimPositionKey({ startYear: 1975 }), "1975|null");
});

test("reconciling twice changes nothing the second time", () => {
  // CONVERGENCE, simulated over the real record that exposed the bug: four
  // positionless claims against a community holding one row. This one is
  // satisfied by the claimed-row rule alone; the wording rule is what test two
  // above is for.
  const seed = (SET_SUTEKH_EVENTS.find((e) => e.slug === "contendings-of-horus-and-seth")?.claims ?? []).map(
    (claim) => ({
      startYear: claim.startYear,
      endYear: claim.endYear,
      originalDateText: claim.originalDateText,
    })
  );
  assert.ok(seed.length >= 4, "the record this was found on should still have several claims");

  const positions = seedClaimsByPosition(seed);
  // The stored copy an older community has: one row per position, carrying the
  // wording of whichever claim was seeded first.
  const stored: StoredClaimRow[] = [];
  for (const key of new Set(seed.map(claimPositionKey))) {
    const first = seed.find((claim) => claimPositionKey(claim) === key)!;
    const [start, end] = key.split("|").map((part) => (part === "null" ? null : Number(part)));
    stored.push(row(`row-${key}`, start, end, first.originalDateText));
  }

  function runOnce(rows: StoredClaimRow[]): number {
    const taken = new Set<string>();
    let writes = 0;
    for (const claim of seed) {
      const match = matchStoredClaim(claim, rows, {
        seedClaimsAtThisPosition: positions.get(claimPositionKey(claim)) ?? 1,
        alreadyClaimed: taken,
      });
      if (!match) continue;
      taken.add(match.id);
      if (match.original_date_text !== claim.originalDateText) {
        match.original_date_text = claim.originalDateText;
        writes++;
      }
    }
    return writes;
  }

  const first = runOnce(stored);
  const second = runOnce(stored);
  assert.equal(second, 0, `a second run wrote ${second} times — the button would report them for ever`);
  assert.ok(first <= 1, `the first run wrote ${first} times; with one row per position it should settle at once`);
});
