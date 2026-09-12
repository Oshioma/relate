import { test } from "node:test";
import assert from "node:assert/strict";

import { ATLANTIS_EVENTS } from "./atlantis-seed";
import { LEMURIA_EVENTS } from "./lemuria-seed";
import { DEEP_TIME_EVENTS } from "./deep-time-seed";
import { EARLY_SAPIENS_EVENTS } from "./early-sapiens-seed";
import { COSMOLOGY_EVENTS } from "./cosmology-seed";
import { PERIODS } from "./period-seed";
import { agoFrom, astronomicalFromYearsAgo, BP_REFERENCE_YEAR, yearsAgoOf } from "./time";
import { DATE_CONVENTIONS, conventionNeedsReferenceYear } from "./taxonomy";
import type { SeedClaim } from "./seed-types";

// "14,600 YEARS AGO" IS NOT "14,600 BCE".
//
// They differ by 1,950 years. That is enough to move a tradition from the end
// of the Younger Dryas to nowhere near it, and enough to manufacture a
// correlation that is pure arithmetic — which is the single most damaging
// error this dataset could make, because the result LOOKS like a discovery.
//
// The conversion helper has always been right. What these tests guard is the
// DATA: that no seed hand-computes a "years ago" figure into a BCE year and
// gets it wrong, and that any claim whose figure is relative to something says
// what it is relative to.

const ALL_CLAIMS: { dataset: string; slug: string; claim: SeedClaim }[] = [
  ["Atlantis", ATLANTIS_EVENTS],
  ["Lemuria", LEMURIA_EVENTS],
  ["Deep time", DEEP_TIME_EVENTS],
  ["Early sapiens", EARLY_SAPIENS_EVENTS],
  ["Cosmology", COSMOLOGY_EVENTS],
].flatMap(([dataset, events]) =>
  (events as { slug: string; claims: SeedClaim[] }[]).flatMap((event) =>
    event.claims.map((claim) => ({ dataset: dataset as string, slug: event.slug, claim }))
  )
);

/**
 * The figures a claim's own wording quotes, in years — or none, when the text
 * is not plainly parseable.
 *
 * DELIBERATELY CONSERVATIVE, because a false alarm here is worse than a miss:
 * this test guards a rule, and a rule that cries wolf gets its assertions
 * loosened until it guards nothing. Three things defeat naive parsing and all
 * three are dropped rather than guessed at:
 *
 *   "(said in 1949)"          — a parenthetical year is about the SOURCE, not
 *                               the date. Parentheticals go first.
 *   "609 ± 40 thousand"       — a tolerance reads as a second figure. Skipped
 *                               entirely; the tolerance columns carry it.
 *   "34½ million"             — a vulgar fraction detaches the number from its
 *                               unit. Normalised before matching.
 */
function figuresIn(text: string): number[] {
  const withoutAsides = text.replace(/\([^)]*\)/g, " ");
  if (/[±]/.test(withoutAsides)) return [];
  const normalised = withoutAsides
    .replace(/½/g, ".5")
    .replace(/¼/g, ".25")
    .replace(/¾/g, ".75");
  // Only what precedes "years ago" — anything after it is commentary.
  const head = normalised.split(/years?\s+ago/i)[0];
  if (head === normalised) return [];
  return [...head.matchAll(/([\d][\d,]*(?:\.\d+)?)\s*(thousand|million|billion)?/gi)]
    .map((match) => {
      const scale = { thousand: 1e3, million: 1e6, billion: 1e9 }[(match[2] ?? "").toLowerCase()] ?? 1;
      return Number(match[1].replace(/,/g, "")) * scale;
    })
    .filter((value) => Number.isFinite(value) && value > 0);
}

const UNIT_YEARS: Record<string, number> = {
  day: 1 / 365.2425,
  month: 1 / 12,
  year: 1,
  decade: 10,
  century: 100,
  millennium: 1000,
  thousand_years: 1000,
  million_years: 1_000_000,
  billion_years: 1_000_000_000,
};

// ---------------------------------------------------------------------------
// The arithmetic
// ---------------------------------------------------------------------------

test("the conversion itself lands where the sciences put it", () => {
  // The worked example: 14,600 BP is about 12,650 BCE, not 14,600 BCE.
  const astronomical = astronomicalFromYearsAgo(14_600);
  assert.equal(astronomical, -12_650);
  // Astronomical −12,650 is 12,651 BCE, because there is no year zero.
  assert.equal(1 - astronomical, 12_651);
  // And the two readings of the same numerals really are about two millennia
  // apart. NOT exactly 1,950: the BP reference is 1950 CE, but converting the
  // result into a BCE year loses a year to the missing year zero, so the gap
  // between "14,600 BP" and "14,600 BCE" is 1,949 years. The off-by-one is the
  // smaller of the two traps in this file and the easier one to shrug at.
  assert.equal(Math.abs(astronomical - (1 - 14_600)), 1_949);
  assert.equal(14_600 - 12_651, 1_949);
});

test("agoFrom counts from whatever the source counted from", () => {
  // A scientific figure counts from 1950.
  assert.equal(agoFrom(BP_REFERENCE_YEAR, 12_000), astronomicalFromYearsAgo(12_000));
  // A 1926 book saying "about 12,000 years ago" counts from 1926 — twenty-four
  // years adrift from the scientific convention, and the difference is the
  // claim's, not ours.
  assert.equal(agoFrom(1926, 12_000), -10_074);
  assert.notEqual(agoFrom(1926, 12_000), agoFrom(BP_REFERENCE_YEAR, 12_000));
});

test("round-tripping a years-ago figure is lossless", () => {
  for (const years of [12_000, 14_600, 26_000, 780_000, 13_797_000_000]) {
    assert.equal(yearsAgoOf(astronomicalFromYearsAgo(years)), years);
  }
});

// ---------------------------------------------------------------------------
// The data
// ---------------------------------------------------------------------------

test("no seeded claim has a years-ago figure entered as a BCE year", () => {
  // THE 1,950-YEAR TRAP.
  //
  // For every figure a claim quotes, there are two places it could have been
  // put: where "years ago" means (counted from the reference year), and where
  // reading the same numerals as BCE would put it. The rule is exact rather
  // than approximate:
  //
  //   If either bound lands on the years-ago reading — pass. The claim used
  //   the convention correctly, whichever bound the text happens to quote.
  //   (A range stores the OLDER bound in startYear, and the text often quotes
  //   only the younger one: "humans in Europe before about 780,000 years ago"
  //   is stored as 990,000–780,000. Comparing startYear against the only
  //   quoted figure would fail a perfectly correct claim.)
  //
  //   Otherwise, if either bound lands on the BCE reading — FAIL. That is the
  //   trap, and nothing else lands there by coincidence.
  //
  //   Otherwise — inconclusive. The quoted figure may not be a stored bound at
  //   all, and guessing would make this test cry wolf until somebody loosened
  //   it into uselessness.
  const failures: string[] = [];

  for (const { dataset, slug, claim } of ALL_CLAIMS) {
    const text = claim.originalDateText ?? "";
    if (!/years?\s+ago/i.test(text) || claim.startYear == null) continue;

    const figures = figuresIn(text);
    if (figures.length === 0) continue;

    const reference = claim.conventionReferenceYear ?? BP_REFERENCE_YEAR;
    const tolerance = Math.max(UNIT_YEARS[claim.datePrecision] ?? 1, 2);
    const bounds = [claim.startYear, claim.endYear].filter((bound): bound is number => bound != null);
    const near = (a: number, b: number) => Math.abs(a - b) <= tolerance;

    const readCorrectly = figures.some((figure) => bounds.some((bound) => near(bound, agoFrom(reference, figure))));
    if (readCorrectly) continue;

    const readAsBce = figures.find((figure) => bounds.some((bound) => near(bound, 1 - figure)));
    if (readAsBce == null) continue;

    failures.push(
      `${dataset} :: ${slug} — "${text}". The figure ${readAsBce.toLocaleString()} is stored where reading it as a ` +
        `BCE YEAR would put it (${1 - readAsBce}), not where "${readAsBce.toLocaleString()} years ago" belongs ` +
        `(${agoFrom(reference, readAsBce)}). That is a ${Math.abs(agoFrom(reference, readAsBce) - (1 - readAsBce))}-year error.`
    );
  }

  assert.deepEqual(failures, [], `\n${failures.join("\n")}\n`);
  // A GUARD THAT RUNS ON NOTHING PASSES SILENTLY, which is how the first
  // version of this file shipped: a botched refactor left the figure extractor
  // returning [] for every claim, and the whole test went green while checking
  // nothing at all. It was caught by deliberately breaking a seed and watching
  // the test not notice. The coverage assertion is cheaper than that.
  assert.ok(
    ALL_CLAIMS.filter((entry) => /years?\s+ago/i.test(entry.claim.originalDateText ?? "")).length > 20,
    "expected a substantial number of years-ago claims to check"
  );
});

test("a claim that says what convention it used says enough to re-derive it", () => {
  const keys = new Set<string>(DATE_CONVENTIONS.map((convention) => convention.key));

  for (const { dataset, slug, claim } of ALL_CLAIMS) {
    if (claim.dateConvention == null) continue;
    assert.ok(keys.has(claim.dateConvention), `${dataset} :: ${slug} — unknown convention "${claim.dateConvention}"`);

    // The database enforces the same pairing; failing here names the claim.
    if (conventionNeedsReferenceYear(claim.dateConvention)) {
      assert.ok(
        claim.conventionReferenceYear != null,
        `${dataset} :: ${slug} — "${claim.originalDateText}" counts from somewhere and does not say where`
      );
    } else {
      assert.equal(
        claim.conventionReferenceYear,
        undefined,
        `${dataset} :: ${slug} — a calendar date counts from nothing, so it cannot have a reference year`
      );
    }
  }
});

test("a claim declaring years_ago actually lands where its own reference year puts it", () => {
  // The three claims that count from something other than 1950 — Churchward's
  // two from 1926, and the Gurdjieff remark from 1949 — are the ones a later
  // editor would silently re-derive against the scientific convention and move
  // by a couple of dozen years. They are why the column exists, so the test
  // insists they are still here.
  const declaring = ALL_CLAIMS.filter((entry) => entry.claim.dateConvention === "years_ago");
  assert.ok(declaring.length >= 3, `expected the years-ago claims to declare their reference year, found ${declaring.length}`);

  for (const { dataset, slug, claim } of ALL_CLAIMS) {
    if (claim.dateConvention !== "years_ago" && claim.dateConvention !== "before_present") continue;
    if (claim.startYear == null || claim.conventionReferenceYear == null) continue;

    const figures = figuresIn(claim.originalDateText ?? "");
    if (figures.length === 0) continue;

    // The stored year must match ONE of the figures quoted — the older end of a
    // range, or the single figure — counted from the stated reference.
    const tolerance = Math.max(UNIT_YEARS[claim.datePrecision] ?? 1, 2);
    const lands = figures.some(
      (value) => Math.abs(claim.startYear! - agoFrom(claim.conventionReferenceYear!, value)) <= tolerance
    );
    assert.ok(
      lands,
      `${dataset} :: ${slug} — "${claim.originalDateText}" declares it counts from ${claim.conventionReferenceYear}, ` +
        `but ${claim.startYear} is not any of its figures counted from there.`
    );
  }
});

test("periods are dated the same way, and their boundaries are checked too", () => {
  for (const period of PERIODS) {
    for (const boundary of period.claims) {
      if (boundary.startYear == null) continue;
      const text = boundary.originalDateText ?? "";
      if (!/years?\s+ago/i.test(text)) continue;
      // A boundary written in "years ago" must be on the years-ago side of the
      // 1,950-year gap. Periods are the widest claims here, so the tolerance is
      // generous and the trap is still far outside it.
      const figures = figuresIn(text);
      if (figures.length === 0) continue;
      const oldest = Math.max(...figures);
      const asBce = 1 - oldest;
      const asYearsAgo = astronomicalFromYearsAgo(oldest);
      if (Math.abs(asYearsAgo - asBce) < 1) continue;
      assert.ok(
        Math.abs(boundary.startYear - asYearsAgo) <= Math.abs(boundary.startYear - asBce),
        `${period.slug} — "${text}" at ${boundary.startYear} is nearer the BCE reading than the years-ago one`
      );
    }
  }
});
