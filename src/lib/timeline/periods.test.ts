import { test } from "node:test";
import assert from "node:assert/strict";

import {
  periodBands,
  periodExtent,
  periodMatches,
  periodRegions,
  periodsForClaim,
  periodsForClaims,
  type PeriodWithClaims,
} from "./periods";
import { astronomicalFromYearsAgo, claimInterval } from "./time";
import { PERIODS, PERIOD_LINKS, PERIOD_SOURCES } from "./period-seed";
import type { TimelineDateClaim } from "@/types/database";

// WHAT THESE TESTS ARE FOR.
//
// Two different jobs, and they are kept apart below.
//
// The first is the arithmetic: extents, overlap, semantic zoom, lane packing,
// containment. Pure functions over numbers, and the place where a mistake is
// silent — a band drawn one order of magnitude wide is not obviously wrong on a
// logarithmic strip, and an event quietly assigned to the wrong period looks
// exactly like an event assigned to the right one.
//
// The second is the DATA, which matters more. Every boundary claim must cite a
// source that exists. No period may carry a confidence score by any name. The
// Iron Age must not acquire a single global date when somebody tidies the file.
// These are assertions about editorial rules rather than about code, and they
// are here because the rules are what the feature is.

const Ga = (billions: number) => astronomicalFromYearsAgo(billions * 1_000_000_000);
const Ma = (millions: number) => astronomicalFromYearsAgo(millions * 1_000_000);
const ka = (thousands: number) => astronomicalFromYearsAgo(thousands * 1000);
const bce = (year: number) => 1 - year;

const NOW = 2026;

let claimCounter = 0;

/** A date claim with only the fields the maths reads. */
function claim(fields: Partial<TimelineDateClaim> & { start_year: number }): TimelineDateClaim {
  const start = fields.start_year;
  const end = fields.end_year ?? null;
  return {
    id: `claim-${++claimCounter}`,
    event_id: null,
    period_id: null,
    community_id: "c",
    temporal_claim_type: null,
    duration_years: null,
    what_is_dated: null,
    date_convention: null,
    convention_reference_year: null,
    created_by: "u",
    source_id: null,
    start_month: null,
    start_day: null,
    end_month: null,
    end_day: null,
    start_position: start,
    end_position: end,
    start_era: start <= 0 ? "BCE" : "CE",
    end_era: end == null ? null : end <= 0 ? "BCE" : "CE",
    date_precision: "year",
    precision_decimals: 0,
    is_approximate: false,
    region: null,
    is_ongoing: false,
    seed_synced_at: null,
    uncertainty_plus: null,
    uncertainty_minus: null,
    original_date_text: "",
    dating_method: null,
    chronology: null,
    evidence: null,
    notes: null,
    created_at: "",
    updated_at: "",
    ...fields,
    end_year: end,
  };
}

function period(slug: string, claims: TimelineDateClaim[], extra: Partial<PeriodWithClaims> = {}): PeriodWithClaims {
  return {
    id: slug,
    community_id: "c",
    created_by: "u",
    slug,
    name: slug,
    aliases: [],
    summary: "",
    description: "",
    period_type: "educational",
    framework: null,
    defining_criteria: null,
    evidence: null,
    interpretation: null,
    region: null,
    display_priority: 0,
    status: "published",
    reviewed_by: null,
    reviewed_at: null,
    created_at: "",
    updated_at: "",
    claims,
    ...extra,
  };
}

// ---------------------------------------------------------------------------
// 1. A closed period range
// ---------------------------------------------------------------------------

test("a closed period spans the envelope of its boundary claims", () => {
  const bronze = period("bronze", [
    claim({ start_year: bce(3000), end_year: bce(2000), region: "Mesopotamia" }),
    claim({ start_year: bce(2500), end_year: bce(800), region: "Britain" }),
  ]);

  const extent = periodExtent(bronze, NOW);
  assert.ok(extent);
  // The earliest start of any claim, and the latest end of any claim — NOT one
  // claim picked as authoritative.
  assert.equal(Math.round(extent.from), bce(3000));
  assert.equal(Math.round(extent.to), bce(800));
  assert.equal(extent.ongoing, false);
});

test("a period with no boundary claims has no extent, and is not an error", () => {
  assert.equal(periodExtent(period("undated", []), NOW), null);
});

// ---------------------------------------------------------------------------
// 2. An open-ended period
// ---------------------------------------------------------------------------

test("an ongoing period runs to the present rather than to a stored year", () => {
  const cenozoic = period("cenozoic", [claim({ start_year: Ma(66), is_ongoing: true })]);

  const extent = periodExtent(cenozoic, NOW);
  assert.ok(extent);
  assert.equal(extent.ongoing, true);
  assert.equal(extent.to, NOW);

  // And it moves with the present rather than being fixed at seed time, which
  // is the whole reason the end is a flag and not a number.
  const later = periodExtent(cenozoic, 3000);
  assert.equal(later?.to, 3000);
});

// ---------------------------------------------------------------------------
// 3. Regional boundary claims
// ---------------------------------------------------------------------------

test("one period carries several regional boundaries without becoming several periods", () => {
  const iron = period("iron", [
    claim({ start_year: bce(1200), region: "Near East" }),
    claim({ start_year: bce(800), end_year: 43, region: "Britain" }),
    claim({ start_year: bce(500), end_year: bce(200), region: "West Africa" }),
  ]);

  assert.deepEqual(periodRegions(iron), ["Near East", "Britain", "West Africa"]);

  const extent = periodExtent(iron, NOW);
  // The band covers every regional claim, and no averaging has happened: the
  // start is the earliest region's and the end the latest region's.
  assert.equal(Math.round(extent!.from), bce(1200));
  assert.equal(Math.round(extent!.to), 43);
});

// ---------------------------------------------------------------------------
// 4. Overlapping periods, and deterministic stacking
// ---------------------------------------------------------------------------

test("overlapping periods are stacked into lanes rather than dropped", () => {
  const wide = period("wide", [claim({ start_year: bce(4000), end_year: 2000 })]);
  const narrow = period("narrow", [claim({ start_year: bce(1000), end_year: bce(500) })]);

  const bands = periodBands([wide, narrow], { from: bce(4000), to: 2000 }, 1200, {
    maxLanes: 3,
    present: NOW,
  });

  assert.equal(bands.length, 2);
  // Most specific first: the narrower one takes the top lane, which is what
  // makes zooming in reveal the more specific context.
  assert.equal(bands[0].period.slug, "narrow");
  assert.equal(bands[0].lane, 0);
  assert.equal(bands[1].period.slug, "wide");
  assert.notEqual(bands[1].lane, 0);
});

test("bands that do not overlap share a lane", () => {
  const first = period("first", [claim({ start_year: bce(3000), end_year: bce(2000) })]);
  const second = period("second", [claim({ start_year: bce(1500), end_year: bce(500) })]);

  const bands = periodBands([first, second], { from: bce(3500), to: 0 }, 1200, {
    maxLanes: 3,
    present: NOW,
  });
  assert.equal(bands.length, 2);
  assert.deepEqual(bands.map((band) => band.lane).sort(), [0, 0]);
});

test("a band to the LEFT of one already placed can still share its lane", () => {
  // The bands are ordered by duration, not by position, so a later one often
  // starts further left than one already placed. A packer that tracks only how
  // far along a lane has been drawn drops it — which is how a window showing
  // the last six thousand years ended up with the modern era and the medieval
  // period in lanes of their own and the Bronze Age and Neolithic not drawn.
  const late = period("late", [claim({ start_year: 1500, end_year: 2000 })]);
  const early = period("early", [claim({ start_year: bce(3300), end_year: bce(800) })]);

  const bands = periodBands([late, early], { from: bce(4000), to: 2000 }, 1400, {
    maxLanes: 3,
    present: NOW,
  });
  assert.equal(bands.length, 2);
  // "late" is the shorter, so it is placed first; "early" is entirely to its
  // left and does not overlap it, so they belong in the same lane.
  assert.deepEqual(bands.map((band) => band.lane), [0, 0]);
});

test("lane packing is deterministic — the same window always gives the same arrangement", () => {
  const periods = [
    period("a", [claim({ start_year: bce(4000), end_year: 2000 })]),
    period("b", [claim({ start_year: bce(2000), end_year: 0 })]),
    period("c", [claim({ start_year: bce(1000), end_year: bce(200) })]),
  ];
  const window = { from: bce(4000), to: 2000 };
  const once = periodBands(periods, window, 1000, { maxLanes: 3, present: NOW });
  const twice = periodBands([...periods].reverse(), window, 1000, { maxLanes: 3, present: NOW });
  assert.deepEqual(
    once.map((band) => [band.period.slug, band.lane]),
    twice.map((band) => [band.period.slug, band.lane])
  );
});

// ---------------------------------------------------------------------------
// 5. Billions of years, ordered correctly
// ---------------------------------------------------------------------------

test("deep time orders correctly against historical dates", () => {
  const universe = period("universe", [claim({ start_year: Ga(13.797), end_year: Ga(4.55) })]);
  const mesozoic = period("mesozoic", [claim({ start_year: Ma(251.902), end_year: Ma(66) })]);
  const iron = period("iron", [claim({ start_year: bce(1200), end_year: 43 })]);

  const extents = [universe, mesozoic, iron].map((item) => periodExtent(item, NOW)!);
  // Strictly increasing: 13.8 billion years ago really is before 1200 BCE, and
  // the astronomical numbering keeps it that way without a special case.
  assert.ok(extents[0].from < extents[1].from);
  assert.ok(extents[1].from < extents[2].from);
  assert.ok(extents[0].to < extents[1].to);

  // And the numbers are the right size — a sign error here would put the Big
  // Bang in the future and nothing else would complain.
  assert.ok(extents[0].from < -13_000_000_000);
  assert.ok(extents[2].to > 0);
});

// ---------------------------------------------------------------------------
// 6. Approximate and coarse boundaries
// ---------------------------------------------------------------------------

test("a coarse boundary is drawn as wide as its precision, not as a point", () => {
  // "c. 300,000 years ago" is a claim about a millennium-scale unit, and
  // claimInterval widens it accordingly. A period whose single boundary is one
  // of these still has an extent rather than a zero-width band.
  const approximate = claim({
    start_year: ka(300),
    date_precision: "thousand_years",
    is_approximate: true,
  });
  const interval = claimInterval(approximate);
  assert.ok(interval, "a dated claim has an interval");
  assert.ok(interval.hi > interval.lo, "a coarse point claim must have width");

  const extent = periodExtent(period("msa", [approximate]), NOW);
  assert.ok(extent);
  assert.ok(extent.to > extent.from);
});

// ---------------------------------------------------------------------------
// 7. Event-period containment
// ---------------------------------------------------------------------------

test("an event's claim falls in the periods whose extent it touches", () => {
  const bronze = period("bronze", [claim({ start_year: bce(3000), end_year: bce(1200) })]);
  const iron = period("iron", [claim({ start_year: bce(1200), end_year: 43 })]);
  const cenozoic = period("cenozoic", [claim({ start_year: Ma(66), is_ongoing: true })]);

  const inBronze = claim({ start_year: bce(2000) });
  const found = periodsForClaim([bronze, iron, cenozoic], inBronze, NOW);
  assert.deepEqual(found.map((entry) => entry.period.slug), ["bronze", "cenozoic"]);
  // Most specific first — "Bronze Age" says more about 2000 BCE than "Cenozoic".
  assert.equal(found[0].period.slug, "bronze");
  assert.equal(found[0].whollyInside, true);
});

test("an event that is itself a range can straddle two periods", () => {
  const bronze = period("bronze", [claim({ start_year: bce(3000), end_year: bce(1200) })]);
  const iron = period("iron", [claim({ start_year: bce(1200), end_year: 43 })]);

  // A dynasty, a siege, a glacial cycle — an event with a duration of its own.
  const straddling = claim({ start_year: bce(1300), end_year: bce(1100) });
  const found = periodsForClaim([bronze, iron], straddling, NOW);

  assert.equal(found.length, 2, "a range overlapping two periods belongs to both");
  // Neither containment is total, and neither is silently resolved by taking a
  // midpoint — which would have put this event in one period and lost the fact.
  assert.ok(found.every((entry) => entry.whollyInside === false));
});

// ---------------------------------------------------------------------------
// 8. Competing claims, competing periods
// ---------------------------------------------------------------------------

test("an event whose sources disagree can be in two periods at once", () => {
  const bronze = period("bronze", [claim({ start_year: bce(3000), end_year: bce(1200) })]);
  const iron = period("iron", [claim({ start_year: bce(1200), end_year: 43 })]);

  // One event, two proposed dates, four hundred years apart and either side of
  // a boundary. This is the case a stored period_id on the event would have
  // destroyed by making somebody choose.
  const conventional = claim({ start_year: bce(1400) });
  const alternative = claim({ start_year: bce(900) });

  assert.deepEqual(periodsForClaim([bronze, iron], conventional, NOW).map((e) => e.period.slug), ["bronze"]);
  assert.deepEqual(periodsForClaim([bronze, iron], alternative, NOW).map((e) => e.period.slug), ["iron"]);

  const both = periodsForClaims([bronze, iron], [conventional, alternative], NOW);
  assert.equal(both.length, 2, "the event belongs to both periods, depending which source you believe");
});

// ---------------------------------------------------------------------------
// 9. Semantic zoom
// ---------------------------------------------------------------------------

test("zoom decides which periods are worth drawing, and nothing else does", () => {
  const earlyLife = period("early-life", [claim({ start_year: Ga(3.48), end_year: Ma(538.8) })]);
  const mesozoic = period("mesozoic", [claim({ start_year: Ma(251.902), end_year: Ma(66) })]);
  const ironAge = period("iron", [claim({ start_year: bce(1200), end_year: 43 })]);
  const all = [earlyLife, mesozoic, ironAge];
  const options = { maxLanes: 3, present: NOW };

  // THE WHOLE OF TIME. Three billion years of early life is most of the screen.
  // The Mesozoic is 186 million years inside 13.8 billion — sixteen pixels at
  // this width — and the Iron Age is far less than one. Drawing either would be
  // drawing a sliver with no room for its own name, so neither is drawn.
  const wideOpen = periodBands(all, { from: Ga(13.8), to: NOW }, 1200, options);
  assert.deepEqual(wideOpen.map((band) => band.period.slug), ["early-life"]);

  // SIX HUNDRED MILLION YEARS. Now the Mesozoic is a third of the screen and
  // appears; the Iron Age is still nothing.
  const middle = periodBands(all, { from: Ma(600), to: NOW }, 1200, options);
  assert.ok(middle.some((band) => band.period.slug === "mesozoic"));
  assert.ok(!middle.some((band) => band.period.slug === "iron"));

  // THREE THOUSAND YEARS. The Iron Age is most of the screen; the Mesozoic is
  // nowhere near this window at all.
  const closeIn = periodBands(all, { from: bce(2000), to: 1000 }, 1200, options);
  assert.deepEqual(closeIn.map((band) => band.period.slug), ["iron"]);
});

test("a period that covers the whole window is still drawn as context", () => {
  const cenozoic = period("cenozoic", [claim({ start_year: Ma(66), is_ongoing: true })]);
  const bands = periodBands([cenozoic], { from: ka(300), to: ka(50) }, 1200, {
    maxLanes: 3,
    present: NOW,
  });
  assert.equal(bands.length, 1, "the period you are standing inside is the one you most need named");
  assert.equal(bands[0].clippedStart, true);
  assert.equal(bands[0].clippedEnd, true);
});

test("the lane cap is respected rather than the bands overflowing", () => {
  // Five periods all covering the same window: every one of them qualifies, and
  // every one of them overlaps the others, so they cannot share lanes.
  const overlapping = [1, 2, 3, 4, 5].map((n) =>
    period(`p${n}`, [claim({ start_year: bce(1000 * n), end_year: 1000 })])
  );
  const bands = periodBands(overlapping, { from: bce(5000), to: 1000 }, 1200, {
    maxLanes: 2,
    present: NOW,
  });
  assert.ok(bands.length <= 2);
  assert.ok(bands.every((band) => band.lane < 2));
});

test("a window with no periods at all produces no bands and no error", () => {
  assert.deepEqual(periodBands([], { from: bce(1000), to: 1000 }, 1200, { maxLanes: 3, present: NOW }), []);
});

// ---------------------------------------------------------------------------
// Aliases and search
// ---------------------------------------------------------------------------

test("a period answers to its aliases as well as its name", () => {
  const mesozoic = period("mesozoic", [], { name: "Mesozoic Era", aliases: ["Age of Dinosaurs"] });
  assert.ok(periodMatches(mesozoic, "mesozoic"));
  assert.ok(periodMatches(mesozoic, "age of dinosaurs"));
  assert.ok(periodMatches(mesozoic, "DINOSAUR"));
  assert.ok(!periodMatches(mesozoic, "trilobite"));
  assert.ok(!periodMatches(mesozoic, "  "), "an empty search matches nothing rather than everything");
});

// ---------------------------------------------------------------------------
// The seeded data itself
// ---------------------------------------------------------------------------

test("the seeded set is the fifteen periods, with unique slugs", () => {
  assert.equal(PERIODS.length, 15);
  const slugs = PERIODS.map((seed) => seed.slug);
  assert.equal(new Set(slugs).size, 15, "a duplicate slug would make seeding non-idempotent");
});

test("seeding is idempotent by construction: nothing is keyed on anything but the slug", () => {
  // The seeder skips a period whose slug is already present. That is only safe
  // if no two entries share a slug and no entry's identity depends on its
  // position in the array.
  const bySlug = new Map(PERIODS.map((seed) => [seed.slug, seed]));
  assert.equal(bySlug.size, PERIODS.length);
  for (const link of PERIOD_LINKS) {
    assert.ok(bySlug.has(link.from), `link from unknown period: ${link.from}`);
    assert.ok(bySlug.has(link.to), `link to unknown period: ${link.to}`);
    assert.notEqual(link.from, link.to);
  }
});

test("every seeded boundary claim cites a source that exists", () => {
  const keys = new Set(PERIOD_SOURCES.map((source) => source.key));
  for (const seed of PERIODS) {
    assert.ok(seed.claims.length > 0, `${seed.slug} has no boundary claims`);
    for (const boundary of seed.claims) {
      assert.ok(boundary.sourceKey, `${seed.slug} has a boundary with no source`);
      assert.ok(keys.has(boundary.sourceKey!), `${seed.slug} cites unknown source ${boundary.sourceKey}`);
      assert.ok(boundary.evidence.trim().length > 0, `${seed.slug} has a boundary with no "why this date"`);
      for (const citation of boundary.citations ?? []) {
        assert.ok(keys.has(citation.sourceKey), `${seed.slug} cites unknown source ${citation.sourceKey}`);
      }
    }
  }
});

test("no seeded period or boundary rates a claim", () => {
  // The rule the whole feature is built on. Not a column, not a field, and not
  // a word smuggled into prose: "confidence", "certainty", a percentage of
  // sureness, or a star rating.
  const banned = /\b(confidence|certainty|\d{1,3}\s?% (?:sure|certain|confident)|star rating)\b/i;
  const text = JSON.stringify(PERIODS);
  assert.ok(!banned.test(text), "a confidence score has appeared in the period data");
});

test("the Iron Age has regional boundaries and no global one", () => {
  const iron = PERIODS.find((seed) => seed.slug === "iron-age");
  assert.ok(iron);
  assert.ok(iron.claims.length >= 5, "the point of this entry is that there are several");
  assert.ok(
    iron.claims.every((boundary) => Boolean(boundary.region)),
    "every Iron Age boundary must name the region it is for — a claim without one would read as global"
  );
  const regions = new Set(iron.claims.map((boundary) => boundary.region));
  assert.ok(regions.size >= 5, "several regions, not one repeated");
});

test("the Bronze Age does not claim a single universal range", () => {
  const bronze = PERIODS.find((seed) => seed.slug === "bronze-age");
  assert.ok(bronze);
  const regional = bronze.claims.filter((boundary) => Boolean(boundary.region));
  assert.ok(regional.length >= 2, "at least two regions, or the entry is asserting one Bronze Age");
  const starts = new Set(regional.map((boundary) => boundary.startYear));
  assert.ok(starts.size > 1, "regional starts that all agree would defeat the purpose");
});

test("periods whose descriptions reconstruct the past say whose reconstruction it is", () => {
  // Every period that is not a plain historical convention has to name the
  // discipline doing the reading. A description of the Mesozoic without a
  // framework is this application asserting what dinosaurs were.
  for (const seed of PERIODS) {
    assert.ok(seed.framework && seed.framework.trim().length > 0, `${seed.slug} has no framework`);
    assert.ok(seed.evidence && seed.evidence.trim().length > 0, `${seed.slug} states no evidence`);
    assert.ok(
      seed.interpretation && seed.interpretation.trim().length > 0,
      `${seed.slug} does not separate interpretation from evidence`
    );
  }
});

test("the dinosaur entry is written as an interpretation, not as a declaration", () => {
  const mesozoic = PERIODS.find((seed) => seed.slug === "mesozoic-era");
  assert.ok(mesozoic);
  assert.ok(mesozoic.aliases?.includes("Age of Dinosaurs"));
  // It must attribute the reading …
  assert.match(mesozoic.description, /mainstream scientific interpretation/i);
  // … and must not hand the reader the era as a bare fact about dinosaurs.
  // Matched narrowly on purpose: an earlier, looser pattern caught this file's
  // own sentence saying it does NOT do that, which is the classic way a test
  // like this goes wrong.
  assert.ok(
    !/\bdinosaurs (?:dominated|ruled)\b/i.test(mesozoic.description),
    "the description asserts dinosaur dominance as fact"
  );
  assert.ok(
    !/^Dinosaurs /m.test(mesozoic.description),
    "a sentence beginning \"Dinosaurs …\" is this application speaking, not a source"
  );
});

test("every period says what kind of periodisation it is", () => {
  const allowed = new Set(["formal_scientific", "archaeological", "historical", "educational"]);
  for (const seed of PERIODS) {
    assert.ok(allowed.has(seed.periodType), `${seed.slug} has an unknown period type: ${seed.periodType}`);
  }
  // And the set actually contains all four kinds, or the distinction is not
  // being demonstrated to anybody.
  const kinds = new Set(PERIODS.map((seed) => seed.periodType));
  assert.equal(kinds.size, 4);
});

test("an ongoing period is never given an end year as well", () => {
  for (const seed of PERIODS) {
    for (const boundary of seed.claims) {
      if (boundary.isOngoing) {
        assert.equal(boundary.endYear, undefined, `${seed.slug} has an ongoing boundary with an end year`);
      }
    }
  }
  // And at least one period runs to the present, or open-endedness is untested
  // in the data as well as in the code.
  assert.ok(PERIODS.some((seed) => seed.claims.some((boundary) => boundary.isOngoing)));
});

test("seeded boundary ranges run forwards", () => {
  for (const seed of PERIODS) {
    for (const boundary of seed.claims) {
      // A period boundary always places itself — the positionless claim types
      // are for records about the nature of time, not for the edges of the
      // Bronze Age — so this doubles as a check that none has crept in.
      assert.ok(boundary.startYear != null, `${seed.slug} has a boundary with no start year`);
      if (boundary.endYear != null) {
        assert.ok(
          boundary.endYear >= boundary.startYear,
          `${seed.slug} has a boundary whose range runs backwards`
        );
      }
    }
  }
});
