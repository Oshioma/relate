import { test } from "node:test";
import assert from "node:assert/strict";

import {
  FLOOD_MESOPOTAMIA_ANCHOR_SLUG,
  FLOOD_MESOPOTAMIA_EVENTS,
  FLOOD_MESOPOTAMIA_LINKS,
  FLOOD_MESOPOTAMIA_SOURCES,
} from "./flood-mesopotamia-seed";
import { NARRATIVE_MOTIFS, TEMPORAL_CLAIM_TYPES } from "./taxonomy";
import { formatClaimDate } from "./time";

// THE THREE CLOCKS, and the wall between a deposit and a story. Both are
// editorial rules rather than code, and both are one careless edit away from
// collapsing — which is what these tests are for.

const bySlug = (slug: string) => FLOOD_MESOPOTAMIA_EVENTS.find((event) => event.slug === slug)!;
const TRADITIONS = ["ziusudra-eridu-genesis", "atrahasis-flood", FLOOD_MESOPOTAMIA_ANCHOR_SLUG, "sumerian-king-list-flood"];
const DEPOSITS = ["ur-flood-deposit", "kish-flood-deposit", "shuruppak-flood-deposit"];

test("no tradition is given a date for the flood itself", () => {
  // None of the texts gives one. The commonest way this dataset could go wrong
  // is for somebody to "helpfully" attach c. 2900 BCE to a story record.
  for (const slug of TRADITIONS) {
    const event = bySlug(slug);
    // Tested on structure rather than on wording: the claim about where the
    // tradition puts the flood is the one with no date and a primordial type.
    // The King List phrases its subject differently from the narratives, and a
    // regex over prose would fail a perfectly correct record.
    const storyClaim = event.claims.find((claim) => claim.temporalClaimType === "primordial");
    assert.ok(storyClaim, `${slug} has no claim for where the tradition places the flood`);
    assert.equal(storyClaim.startYear, undefined, `${slug} invents a date the text does not give`);
    // And no claim on a tradition record may date the flood event itself.
    for (const claim of event.claims) {
      if (claim.startYear == null) continue;
      assert.ok(
        claim.temporalClaimType === "date_of_first_known_record" || claim.temporalClaimType === "proposed_correlation",
        `${slug}: "${claim.originalDateText}" puts a year on a tradition that gives none`
      );
    }
  }
});

test("each tradition dates its own manuscripts separately from its story", () => {
  // The second clock. A tablet date is a fact about an object.
  for (const slug of ["ziusudra-eridu-genesis", "atrahasis-flood", FLOOD_MESOPOTAMIA_ANCHOR_SLUG]) {
    const event = bySlug(slug);
    const record = event.claims.find((claim) => claim.temporalClaimType === "date_of_first_known_record");
    assert.ok(record, `${slug} does not date its earliest surviving record`);
    assert.ok(record.startYear != null, `${slug}: a manuscript date is a real date`);
    assert.match(record.evidence, /not|does not/i);
  }
});

test("Utnapishtim carries all three clocks, and they are three separate claims", () => {
  // The worked example the brief asks for.
  const event = bySlug(FLOOD_MESOPOTAMIA_ANCHOR_SLUG);
  const types = event.claims.map((claim) => claim.temporalClaimType);
  assert.ok(types.includes("primordial"), "story date: none given");
  assert.ok(types.includes("date_of_first_known_record"), "tablet date");
  assert.ok(types.includes("proposed_correlation"), "the Shuruppak proposal");
  assert.equal(new Set(event.claims.map((claim) => claim.whatIsDated)).size, 3, "three different subjects");
});

test("the Shuruppak correlation is a proposal, never a date for the story", () => {
  const event = bySlug(FLOOD_MESOPOTAMIA_ANCHOR_SLUG);
  const correlation = event.claims.find((claim) => claim.temporalClaimType === "proposed_correlation")!;
  assert.equal(correlation.chronology, "disputed");
  assert.match(correlation.evidence, /does not establish/i);
  // The reason a flood layer is unremarkable in Mesopotamia is stated.
  assert.match(correlation.evidence, /flooded repeatedly|alluvial/i);
});

test("a flood deposit is relevant to a tradition and is never evidence for one", () => {
  // The Mauritia rule, applied to the subject where it matters most.
  for (const link of FLOOD_MESOPOTAMIA_LINKS) {
    const fromDeposit = DEPOSITS.includes(link.from);
    const toTradition = TRADITIONS.includes(link.to) || link.to === "noah-flood-chronologies";
    if (fromDeposit && toTradition) {
      assert.notEqual(link.relation, "evidence_for", `${link.from} → ${link.to} is offered as evidence for a story`);
    }
  }
  // And the Shuruppak edge, which is the one most tempting to upgrade.
  const shuruppak = FLOOD_MESOPOTAMIA_LINKS.find((link) => link.from === "shuruppak-flood-deposit")!;
  assert.equal(shuruppak.relation, "relevant");
});

test("Ur and Kish are seeded as a pair, because neither makes the point alone", () => {
  const ur = bySlug("ur-flood-deposit");
  const kish = bySlug("kish-flood-deposit");
  // Both were identified with Genesis in the same season; they are not contemporary.
  assert.match(`${ur.summary} ${ur.description}`, /not contemporary|did not survive|too early/i);
  assert.match(`${kish.summary} ${kish.description}`, /not contemporary|could not both/i);
  assert.ok(
    FLOOD_MESOPOTAMIA_LINKS.some((link) => link.from === "ur-flood-deposit" && link.to === "kish-flood-deposit"),
    "the two deposits are joined"
  );
});

test("Genesis is not credited with a date it does not give", () => {
  const noah = bySlug("noah-flood-chronologies");
  const ussher = noah.claims.find((claim) => claim.startYear === 1 - 2348)!;
  assert.equal(ussher.temporalClaimType, "genealogical_date");
  assert.equal(ussher.datingMethod, "genealogy");
  assert.match(ussher.evidence, /Genesis does not say 2348 BCE/i);
  assert.match(noah.description, /The Bible does not date the flood/i);
});

test("all three textual traditions are present, and the unverifiable one has no year", () => {
  const noah = bySlug("noah-flood-chronologies");
  const prose = noah.claims.map((claim) => `${claim.evidence} ${claim.notes ?? ""}`).join(" ");
  // Masoretic and Septuagint totals, both sourced.
  assert.match(prose, /2,008/);
  assert.match(prose, /3,394/);
  // The Samaritan is present as a LENGTH, because its year could not be verified.
  const samaritan = noah.claims.find((claim) => claim.durationYears === 2249);
  assert.ok(samaritan, "the Samaritan tradition is on the record");
  assert.equal(samaritan.startYear, undefined, "no Samaritan flood year is asserted");
  assert.match(samaritan.evidence, /NEEDS SOURCE VERIFICATION/);
  // And the timeline says plainly that it will not do the subtraction itself.
  assert.match(samaritan.evidence, /this timeline's arithmetic|would be this timeline/i);
});

test("a stated genealogical total is not rounded away", () => {
  // The Samaritan antediluvian span is 2,249 years — arrived at by counting,
  // and it rendered as "2,200 years" before there was an exact formatter.
  // A figure reached by addition must not be displayed as though estimated.
  const samaritan = bySlug("noah-flood-chronologies").claims.find((claim) => claim.durationYears === 2249)!;
  const written = formatClaimDate({
    start_year: null,
    start_month: null,
    start_day: null,
    end_year: null,
    end_month: null,
    end_day: null,
    date_precision: samaritan.datePrecision,
    precision_decimals: 0,
    is_approximate: false,
    uncertainty_plus: null,
    uncertainty_minus: null,
    original_date_text: samaritan.originalDateText,
    temporal_claim_type: samaritan.temporalClaimType ?? null,
    duration_years: samaritan.durationYears ?? null,
  });
  assert.equal(written, "2,249 years");
});

test("a tradition that places the flood in the first times says so", () => {
  // "Not stated" is the wrong shape of answer: these texts do not fail to give
  // a date, they place the flood in an originating age.
  const written = formatClaimDate({
    start_year: null,
    start_month: null,
    start_day: null,
    end_year: null,
    end_month: null,
    end_day: null,
    date_precision: "year",
    precision_decimals: 0,
    is_approximate: false,
    uncertainty_plus: null,
    uncertainty_minus: null,
    original_date_text: "",
    temporal_claim_type: "primordial",
    duration_years: null,
  });
  assert.equal(written, "In the first times");
});

test("motifs are marked, and only with keys the vocabulary knows", () => {
  const keys = new Set<string>(NARRATIVE_MOTIFS.map((motif) => motif.key));
  let marked = 0;
  for (const event of FLOOD_MESOPOTAMIA_EVENTS) {
    for (const motif of event.motifs ?? []) {
      assert.ok(keys.has(motif), `${event.slug}: unknown motif "${motif}"`);
      marked++;
    }
  }
  assert.ok(marked > 30, `expected the motif fields to be used, found ${marked}`);

  // Gilgamesh and Genesis share a great deal of structure — that is the whole
  // point of having motifs — but the Sumerian tablet is fragmentary and must
  // NOT be filled out to match them.
  const sumerian = bySlug("ziusudra-eridu-genesis").motifs ?? [];
  const gilgamesh = bySlug(FLOOD_MESOPOTAMIA_ANCHOR_SLUG).motifs ?? [];
  assert.ok(sumerian.length < gilgamesh.length, "a two-thirds-lost tablet cannot yield as many motifs as a complete one");
  assert.ok(!sumerian.includes("birds_released"), "birds are not in the surviving Sumerian text");
});

test("every claim type is one the database will accept", () => {
  const keys = new Set<string>(TEMPORAL_CLAIM_TYPES.map((type) => type.key));
  for (const event of FLOOD_MESOPOTAMIA_EVENTS) {
    for (const claim of event.claims) {
      assert.ok(keys.has(claim.temporalClaimType ?? ""), `${event.slug}: unknown type "${claim.temporalClaimType}"`);
      // A claim with no date must be one of the positionless types.
      if (claim.startYear == null) {
        assert.ok(
          ["primordial", "previous_world", "cyclic", "eternal", "no_beginning", "unknown"].includes(
            claim.temporalClaimType ?? ""
          ),
          `${event.slug}: "${claim.originalDateText}" has no date and a positioned type — the database will reject it`
        );
      }
    }
  }
});

test("every source is checkable and every claim cites one", () => {
  const keys = new Set(FLOOD_MESOPOTAMIA_SOURCES.map((source) => source.key));
  for (const event of FLOOD_MESOPOTAMIA_EVENTS) {
    for (const claim of event.claims) {
      assert.ok(claim.sourceKey && keys.has(claim.sourceKey), `${event.slug}: bad source "${claim.sourceKey}"`);
      for (const citation of claim.citations ?? []) {
        assert.ok(keys.has(citation.sourceKey), `${event.slug}: bad citation "${citation.sourceKey}"`);
      }
    }
  }
  for (const source of FLOOD_MESOPOTAMIA_SOURCES) {
    assert.ok(source.url || source.reference, `${source.key} gives a reader no way to find it`);
  }
});

test("nothing rates, scores or declares a verdict", () => {
  const banned = /\b(confidence|credibility|debunked|disproven|proven fact|just a myth|merely a myth)\b/i;
  for (const event of FLOOD_MESOPOTAMIA_EVENTS) {
    assert.ok(!banned.test(`${event.summary} ${event.description}`), `${event.slug} rates something`);
    for (const claim of event.claims) {
      assert.ok(!banned.test(`${claim.evidence} ${claim.notes ?? ""}`), `${event.slug}: a claim rates something`);
    }
  }
  for (const link of FLOOD_MESOPOTAMIA_LINKS) assert.ok(!banned.test(link.note));
});
