import { test } from "node:test";
import assert from "node:assert/strict";

import {
  COSMOLOGY_ANCHOR_SLUG,
  COSMOLOGY_EVENTS,
  COSMOLOGY_LINKS,
  COSMOLOGY_SOURCES,
} from "./cosmology-seed";
import {
  claimInterval,
  claimIsPositioned,
  claimMidpoint,
  compareClaims,
  DATE_UNITS,
  eventDateLabel,
  formatClaimDate,
  positionedClaims,
  yearsAgoOf,
  type ClaimTimeParts,
} from "./time";
import { CLAIM_VIEWPOINTS, TEMPORAL_CLAIM_TYPES, temporalTypeIsPositioned } from "./taxonomy";
import { layoutLane } from "./layout";
import type { SeedClaim } from "./seed-types";

// WHAT THESE TESTS ARE FOR.
//
// Two halves, and the second is the important one.
//
// The first is the machinery: "no beginning" has to survive contact with a
// library whose every function used to assume a number. A claim with no
// position must produce no interval, no midpoint, no place in an envelope and
// no entry in a comparison — and must still render, because a card that shows
// an empty space where a date should be teaches a reader that the model failed
// to supply one.
//
// The second is the brief. No confidence scores. The Big Bang not described as
// proving creation from nothing. Ussher's date attributed to Ussher and not to
// Genesis. Hindu cosmology neither endorsed nor dismissed. The five kinds of
// claim not flattened into five numbers for one quantity. These are assertions
// about editorial judgement rather than about code, and they are here because
// they are the whole reason the record exists.

const POSITIONLESS = new Set(["cyclic", "eternal", "no_beginning", "unknown"]);
const ANCHOR = COSMOLOGY_EVENTS.find((event) => event.slug === COSMOLOGY_ANCHOR_SLUG)!;

/** A seed claim as the time library sees it once the seeder has written it. */
function asClaim(seed: SeedClaim): ClaimTimeParts {
  return {
    start_year: seed.startYear ?? null,
    start_month: seed.startMonth ?? null,
    start_day: seed.startDay ?? null,
    end_year: seed.endYear ?? null,
    end_month: null,
    end_day: null,
    date_precision: seed.datePrecision,
    precision_decimals: seed.precisionDecimals ?? 0,
    is_approximate: seed.isApproximate,
    uncertainty_plus: seed.uncertaintyPlus ?? null,
    uncertainty_minus: seed.uncertaintyMinus ?? null,
    original_date_text: seed.originalDateText,
    temporal_claim_type: seed.temporalClaimType ?? null,
    duration_years: seed.durationYears ?? null,
    what_is_dated: seed.whatIsDated ?? null,
  };
}

const anchorClaims = ANCHOR.claims.map(asClaim);

// ---------------------------------------------------------------------------
// The machinery: a claim that places nothing
// ---------------------------------------------------------------------------

test("a no-beginning claim has no interval, no midpoint and no position", () => {
  const steadyState = ANCHOR.claims.find((claim) => claim.temporalClaimType === "no_beginning");
  assert.ok(steadyState, "the dataset must contain a no-beginning claim");
  const claim = asClaim(steadyState);

  assert.equal(claimIsPositioned(claim), false);
  assert.equal(claimInterval(claim), null, "no position means no interval to draw");
  assert.equal(claimMidpoint(claim), null, "and nothing to reduce to a single number");
});

test("a positionless claim still renders, and never as an empty date", () => {
  // The card is the only place these can be read, since by definition they are
  // absent from the strip. A blank would read as a missing field.
  for (const seed of ANCHOR.claims) {
    if (seed.startYear != null) continue;
    const written = formatClaimDate(asClaim(seed));
    assert.ok(written.length > 0, `${seed.originalDateText} renders as nothing`);
    assert.ok(!/^(unknown|n\/a|null|undefined)$/i.test(written), `${seed.originalDateText} renders as a non-answer`);
  }
});

test("a length is written as a length, not as a date", () => {
  const kalpa = ANCHOR.claims.find((claim) => claim.durationYears === 4_320_000_000);
  assert.ok(kalpa, "the kalpa claim must be seeded");
  const written = formatClaimDate(asClaim(kalpa));
  assert.match(written, /billion years/);
  assert.ok(!/ago|BCE|CE/.test(written), `a duration must not be written as a position: "${written}"`);
});

test("the envelope is built only from claims that place something", () => {
  const label = eventDateLabel(anchorClaims);
  assert.ok(label, "the record has dated claims, so it has a headline");
  // Deep time at one end and the latest thing anybody places at the other —
  // which is the Kali Yuga epoch at 3102 BCE, not Ussher's 4004 BCE, because
  // 3102 BCE is the later of the two. The positionless claims contribute
  // nothing rather than collapsing the range to nothing.
  assert.match(label, /13\.8 bya/, `headline was "${label}"`);
  assert.match(label, /3102 BCE/, `headline was "${label}"`);
});

test("an event with nothing but positionless claims has no headline range", () => {
  const onlyPositionless = anchorClaims.filter((claim) => !claimIsPositioned(claim));
  assert.ok(onlyPositionless.length >= 2, "the dataset has several");
  assert.equal(eventDateLabel(onlyPositionless), null, "nothing placed, nothing to write a range from");
  assert.equal(compareClaims(onlyPositionless), null, "and nothing that can agree or disagree by a number of years");
});

test("positionedClaims and the database's own rule agree about which types have dates", () => {
  // The CHECK constraint in the migration permits a null start_year for exactly
  // these four. If the two lists drift, seeding fails at the database with a
  // constraint violation rather than here, which is a much worse place to find
  // out.
  for (const type of TEMPORAL_CLAIM_TYPES) {
    assert.equal(
      temporalTypeIsPositioned(type.key),
      !POSITIONLESS.has(type.key),
      `${type.key} disagrees with the constraint's list`
    );
  }
  assert.equal(positionedClaims(anchorClaims).length, anchorClaims.filter((c) => c.start_year != null).length);
});

test("every seeded claim obeys the constraint it will be inserted under", () => {
  for (const event of COSMOLOGY_EVENTS) {
    for (const claim of event.claims) {
      if (claim.startYear == null) {
        assert.ok(
          claim.temporalClaimType && POSITIONLESS.has(claim.temporalClaimType),
          `${event.slug}: "${claim.originalDateText}" has no date and no positionless type — the database will reject it`
        );
      }
      // A duration is not a second way of writing a range.
      if (claim.durationYears != null) {
        assert.equal(claim.endYear, undefined, `${event.slug}: a claim carries both a duration and a range`);
        assert.ok(claim.durationYears > 0);
      }
    }
  }
});

test("a positionless claim does not stretch its event across the strip", () => {
  // THIS TEST EXISTS BECAUSE THE LAYOUT GOT THIS WRONG. Placing a claim with
  // no interval returned x = 0 — and 0 is not "nowhere", it is the LEFT EDGE
  // of the visible window. An event carrying both a measured age and a
  // no-beginning claim was therefore drawn as a band running from the start of
  // the visible span to its real date. On screen it looked like a deliberate
  // range, which is the worst kind of wrong.
  const window = { from: -14_000_000_000, to: 2030 };
  const event = {
    id: "e1",
    slug: COSMOLOGY_ANCHOR_SLUG,
    title: ANCHOR.title,
    status: "published",
    claims: anchorClaims.map((claim, index) => ({ ...claim, id: `c${index}` })),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placed = layoutLane([event as any], window, 1000, "linear");
  assert.equal(placed.length, 1, "the event still appears — it has dated claims");

  // Its footprint must sit where its DATED claims are (13.8 Ga, near the left
  // on a linear scale) and must not be pinned to the window's left edge by a
  // claim that named no time.
  const only = placed[0];
  assert.equal(
    only.claims.length,
    positionedClaims(anchorClaims).length,
    "only the claims that place themselves are drawn"
  );
  assert.ok(only.claims.every((claim) => claim.x !== 0 || claim.x2 !== 0), "nothing was placed at the origin by default");
});

test("an event whose every claim is positionless is not drawn at all", () => {
  const window = { from: -14_000_000_000, to: 2030 };
  const event = {
    id: "e2",
    slug: "nothing-placed",
    title: "A record that names no time",
    status: "published",
    claims: anchorClaims.filter((claim) => !claimIsPositioned(claim)).map((claim, i) => ({ ...claim, id: `p${i}` })),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assert.deepEqual(layoutLane([event as any], window, 1000, "linear"), [], "nowhere to put it, so it is not put anywhere");
});

// ---------------------------------------------------------------------------
// The brief
// ---------------------------------------------------------------------------

test("the mainstream age is ~13.8 billion years, given as a measurement with its error", () => {
  const mainstream = ANCHOR.claims.filter((claim) => claim.chronology === "scientific" && claim.startYear != null);
  assert.equal(mainstream.length, 2, "both Planck fits are seeded, because they differ");

  for (const claim of mainstream) {
    const ago = yearsAgoOf(claim.startYear!);
    assert.ok(ago > 13.7e9 && ago < 13.9e9, `${claim.originalDateText} is not ~13.8 Ga`);
    assert.ok(claim.uncertaintyPlus != null, "a measured age carries the source's own error bar");
    assert.equal(claim.datePrecision, "billion_years");
  }
  // Two fits from one paper, genuinely different numbers.
  assert.notEqual(mainstream[0].startYear, mainstream[1].startYear);
});

test("the Big Bang is not described as proof of creation from nothing", () => {
  const banned = /created? (the universe )?from nothing|proves the universe (was )?(created|began)|proof that the universe began/i;
  for (const event of COSMOLOGY_EVENTS) {
    for (const claim of event.claims) {
      const prose = `${claim.evidence} ${claim.notes ?? ""}`;
      assert.ok(!banned.test(prose), `${event.slug}: "${claim.originalDateText}" overstates the Big Bang model`);
    }
  }
  // And the limitation is stated positively somewhere on the mainstream claim.
  const mainstream = ANCHOR.claims.find((claim) => claim.chronology === "scientific")!;
  assert.match(mainstream.evidence, /absolute beginning/i);
});

test("4004 BCE is Ussher's calculation and is not attributed to the Bible", () => {
  const ussher = ANCHOR.claims.find((claim) => claim.chronology === "biblical");
  assert.ok(ussher, "the Ussher claim must be seeded");
  assert.equal(ussher.temporalClaimType, "calculated_date", "a calculated date, not a recorded one");
  assert.equal(ussher.datingMethod, "genealogy");
  // The distinction the brief asks for, in as many words.
  assert.match(ussher.evidence, /The Bible does not say 4004 BCE/i);
  // And the fact that other chronologists got other answers.
  assert.match(ussher.evidence, /Bede/);
  assert.match(ussher.evidence, /5509 BC/);
});

test("the Hindu cycles are seeded as lengths, and no unverified elapsed total is given", () => {
  const hindu = ANCHOR.claims.filter((claim) => claim.chronology === "hindu");
  assert.ok(hindu.length >= 4, "the structural figures plus the one datable position");

  const durations = hindu.filter((claim) => claim.durationYears != null).map((claim) => claim.durationYears);
  assert.ok(durations.includes(4_320_000), "one mahayuga");
  assert.ok(durations.includes(4_320_000_000), "one kalpa / day of Brahma");
  assert.ok(durations.includes(311_040_000_000_000), "a hundred years of Brahma");

  // The figure the brief warned about. It is absent, and the absence is stated
  // rather than silent.
  const prose = hindu.map((claim) => `${claim.evidence} ${claim.notes ?? ""}`).join(" ");
  assert.ok(!/155(\.52)? trillion years old/i.test(prose), "no unsourced elapsed total is asserted");
  assert.match(prose, /could not be verified/i, "and the omission is recorded");

  // The one current-position claim is the one that can be sourced.
  const kaliYuga = hindu.find((claim) => claim.startYear != null);
  assert.ok(kaliYuga);
  assert.equal(kaliYuga.startYear, 1 - 3102, "3102 BCE in astronomical year numbering");
});

test("the cyclic models are a family, never one unified theory", () => {
  const cyclic = ANCHOR.claims.find((claim) => claim.chronology === "hypothesis");
  assert.ok(cyclic);
  // Three distinct proposals cited, and the limitation stated.
  assert.ok((cyclic.citations ?? []).length >= 2, "more than one proposal is cited on the claim");
  assert.match(cyclic.evidence, /family, not a theory|FAMILY, NOT A THEORY/i);
  assert.match(cyclic.evidence, /not the same thing/i, "a hot Big Bang phase is not an absolute beginning");
  assert.match(cyclic.evidence, /empirical establishment|not established/i, "their status is stated plainly");
});

test("the claims say what they date, so they cannot be read as rival figures", () => {
  // The one thing this record must not do is present five numbers as five
  // answers to one question. what_is_dated is what prevents it, and the UI
  // switches its wording on there being more than one.
  const subjects = new Set(
    ANCHOR.claims.map((claim) => claim.whatIsDated).filter((subject): subject is string => Boolean(subject))
  );
  assert.ok(subjects.size >= 4, `expected several distinct subjects, got ${subjects.size}`);
  for (const claim of ANCHOR.claims) {
    assert.ok(claim.whatIsDated, `"${claim.originalDateText}" does not say what it dates`);
  }
});

test("nothing anywhere in the dataset rates, scores or declares a verdict", () => {
  const banned = /\b(confidence|credibility|plausibility score|rating|debunked|disproven|pseudoscience|proven fact)\b/i;
  for (const event of COSMOLOGY_EVENTS) {
    const prose = [event.summary, event.description, event.eventTypeNote ?? ""].join(" ");
    assert.ok(!banned.test(prose), `${event.slug} rates something`);
    for (const claim of event.claims) {
      assert.ok(!banned.test(`${claim.evidence} ${claim.notes ?? ""}`), `${event.slug}: a claim rates something`);
    }
  }
  for (const link of COSMOLOGY_LINKS) assert.ok(!banned.test(link.note));
});

test("every source is real enough to be checked, and every claim points at one", () => {
  const keys = new Set(COSMOLOGY_SOURCES.map((source) => source.key));
  for (const event of COSMOLOGY_EVENTS) {
    for (const claim of event.claims) {
      assert.ok(claim.sourceKey, `${event.slug}: "${claim.originalDateText}" cites nothing`);
      assert.ok(keys.has(claim.sourceKey), `${event.slug}: unknown source "${claim.sourceKey}"`);
      for (const citation of claim.citations ?? []) {
        assert.ok(keys.has(citation.sourceKey), `${event.slug}: unknown citation "${citation.sourceKey}"`);
      }
    }
  }
  for (const source of COSMOLOGY_SOURCES) {
    // Not a judgement about quality — a check that somebody can go and look.
    assert.ok(source.url || source.reference, `${source.key} gives a reader no way to find it`);
    assert.ok(source.notes.trim().length > 30, `${source.key} does not say what it is cited for`);
  }
});

test("every precision is a unit the database and the formatter both know", () => {
  // THIS TEST EXISTS BECAUSE THE FIRST VERSION OF THE DATASET FAILED HERE.
  // The claims table's original DDL spelled these 'billions' and 'exact_date';
  // a later migration moved the vocabulary to the DATE_UNITS keys, and a seed
  // written from the old names is rejected by the check constraint at insert
  // time — silently, because the seeder records a failed event and carries on.
  // Nothing in the type system catches it: datePrecision is a string.
  const units = new Set<string>(DATE_UNITS.map((unit) => unit.key));
  for (const event of COSMOLOGY_EVENTS) {
    for (const claim of event.claims) {
      assert.ok(
        units.has(claim.datePrecision),
        `${event.slug}: "${claim.originalDateText}" uses precision "${claim.datePrecision}", which the database will reject`
      );
    }
  }
});

test("the viewpoints separate mainstream, historical, hypothesis and tradition", () => {
  const keys = new Set<string>(CLAIM_VIEWPOINTS.map((viewpoint) => viewpoint.key));
  const used = new Set(ANCHOR.claims.map((claim) => claim.chronology));
  for (const viewpoint of used) assert.ok(keys.has(viewpoint), `unknown viewpoint "${viewpoint}"`);
  // The four the brief asks to be distinguishable.
  for (const expected of ["scientific", "historical", "hypothesis", "hindu", "biblical"]) {
    assert.ok(used.has(expected), `the record does not distinguish "${expected}"`);
  }
});

test("the human events are dated even where the claims they carry are not", () => {
  // The second clock. Steady State has no beginning; the paper proposing it
  // was published in 1948, and that is on the timeline.
  const steadyState = COSMOLOGY_EVENTS.find((event) => event.slug === "steady-state-proposed");
  assert.ok(steadyState);
  assert.equal(steadyState.claims[0].startYear, 1948);

  const link = COSMOLOGY_LINKS.find(
    (edge) => edge.from === "steady-state-proposed" && edge.to === COSMOLOGY_ANCHOR_SLUG
  );
  assert.ok(link, "the paper is joined to the claim it makes");
  assert.equal(link.relation, "source_of");
});

test("Mauritia's lesson is kept: relevance is not evidence", () => {
  // The Kali Yuga epoch locates the present inside a tradition and establishes
  // nothing about the age of the universe. Filed accordingly.
  const kaliYuga = COSMOLOGY_LINKS.find((link) => link.from === "kali-yuga-begins");
  assert.ok(kaliYuga);
  assert.equal(kaliYuga.relation, "relevant");
  assert.notEqual(kaliYuga.relation, "evidence_for");

  // Whereas the CMB genuinely is offered as evidence.
  const cmb = COSMOLOGY_LINKS.find(
    (link) => link.from === "cosmic-microwave-background-detected" && link.to === COSMOLOGY_ANCHOR_SLUG
  );
  assert.ok(cmb);
  assert.equal(cmb.relation, "evidence_for");
});
