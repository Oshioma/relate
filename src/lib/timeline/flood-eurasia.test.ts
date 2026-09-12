import { test } from "node:test";
import assert from "node:assert/strict";

import {
  FLOOD_EURASIA_ANCHOR_SLUG,
  FLOOD_EURASIA_EVENTS,
  FLOOD_EURASIA_LINKS,
  FLOOD_EURASIA_SOURCES,
} from "./flood-eurasia-seed";
import { NARRATIVE_MOTIFS, TEMPORAL_CLAIM_TYPES } from "./taxonomy";

const bySlug = (slug: string) => FLOOD_EURASIA_EVENTS.find((event) => event.slug === slug)!;
const POSITIONLESS = ["primordial", "previous_world", "cyclic", "eternal", "no_beginning", "unknown"];

// Each of these three traditions is here to break a different assumption, and
// each test below guards the break.

test("no record dates a catastrophe", () => {
  // Between them these records carry a chronographer's calculation, several
  // manuscript dates, a theological development and an interval — and not one
  // date for a flood, because no source gives one.
  for (const event of FLOOD_EURASIA_EVENTS) {
    for (const claim of event.claims) {
      if (claim.startYear == null) continue;
      assert.ok(
        ["date_of_first_known_record", "calculated_date", "proposed_correlation"].includes(
          claim.temporalClaimType ?? ""
        ),
        `${event.slug}: "${claim.originalDateText}" puts a year on a catastrophe`
      );
    }
  }
});

test("Deucalion's date is the chronographer's, and the inscription is dated too", () => {
  const event = bySlug(FLOOD_EURASIA_ANCHOR_SLUG);
  const calculated = event.claims.find((claim) => claim.temporalClaimType === "calculated_date")!;
  assert.equal(calculated.startYear, 1 - 1528);
  assert.equal(calculated.chronology, "historical", "a chronographer's date is not the tradition's");
  assert.match(calculated.evidence, /anonymous compiler|unknown/i);
  assert.match(calculated.evidence, /does not/i);

  // The act of assigning the date has its own date, twelve centuries later.
  const inscribed = event.claims.find((claim) => claim.temporalClaimType === "date_of_first_known_record")!;
  assert.equal(inscribed.startYear, 1 - 264);
  assert.ok(calculated.startYear! < inscribed.startYear!, "the flood date precedes the inscription that assigns it");
});

test("Ogyges carries an interval and refuses to become a year", () => {
  // Converting it would mean adding one chronographer's interval to another's
  // date and presenting the sum as an ancient source.
  const ogyges = bySlug("ogyges-flood");
  const claim = ogyges.claims[0];
  assert.equal(claim.startYear, undefined, "no BCE year is asserted");
  assert.equal(claim.durationYears, 250);
  assert.match(claim.evidence, /NEEDS SOURCE VERIFICATION/);
  assert.match(claim.evidence, /inventing a source|would be this timeline/i);
  // And it is a separate record from Deucalion, per the brief.
  assert.notEqual(ogyges.slug, FLOOD_EURASIA_ANCHOR_SLUG);
});

test("the oldest Indian version has no Viṣṇu in it, and the development is its own record", () => {
  const manu = bySlug("manu-and-the-fish");
  assert.match(manu.description, /not Vi[sṣ]ṇu|no Vi[sṣ]ṇu/i);
  // The motifs must not include anything from the later theology.
  assert.ok(manu.motifs?.includes("animal_warning"), "a fish warns him — not a god");
  assert.ok(!manu.motifs?.includes("divine_warning"), "the earliest version has no deity giving the warning");

  const development = bySlug("matsya-becomes-vishnu");
  assert.equal(development.claims[0].startYear, undefined, "Purāṇic redaction dates are not invented");
  assert.match(development.claims[0].evidence, /ORDER|order/);
  const link = FLOOD_EURASIA_LINKS.find((edge) => edge.from === "matsya-becomes-vishnu")!;
  assert.equal(link.to, "manu-and-the-fish");
  assert.equal(link.relation, "responds_to");
});

test("Yima's catastrophe is a winter, and is never marked as water", () => {
  // The stress case. Marking a water motif here would be assimilating the
  // account to the stories it merely resembles — which is exactly what the
  // standard translation's chapter heading does.
  const yima = bySlug("yima-and-the-vara");
  assert.ok(yima.motifs?.includes("deadly_winter"));
  assert.ok(yima.motifs?.includes("enclosure"));
  for (const water of ["boat", "raft", "rising_sea", "prolonged_rain", "tsunami_wave", "river_flood", "waters_recede"]) {
    assert.ok(!yima.motifs?.includes(water), `Yima must not be marked with "${water}"`);
  }
  // And the record says out loud that the translation mislabels it.
  assert.match(yima.description, /deluge/i);
  assert.match(yima.description, /winter/i);
  assert.match(`${yima.summary} ${yima.description}`, /not a (water )?flood|will not call it one/i);
});

test("the preservation structure is linked as a resemblance, not an identification", () => {
  const yimaLink = FLOOD_EURASIA_LINKS.find((link) => link.from === "yima-and-the-vara")!;
  assert.equal(yimaLink.relation, "related");
  assert.match(yimaLink.note, /not the same kind|not be mistaken/i);

  const manuLink = FLOOD_EURASIA_LINKS.find((link) => link.from === "manu-and-the-fish")!;
  assert.equal(manuLink.relation, "related");
  // No edge in this file asserts descent between traditions.
  for (const link of FLOOD_EURASIA_LINKS) {
    assert.notEqual(link.relation, "identified", "no tradition is identified with another");
  }
});

test("Plato's passage is seeded for the argument, not for the history it asserts", () => {
  const plato = bySlug("plato-many-destructions");
  assert.match(plato.description, /one deluge only/i);
  assert.equal(plato.claims[0].temporalClaimType, "date_of_first_known_record");
  assert.match(plato.claims[0].evidence, /does not/i);
  assert.ok(plato.motifs?.includes("multiple_floods"));
});

test("every positionless claim uses a type the database permits", () => {
  const keys = new Set<string>(TEMPORAL_CLAIM_TYPES.map((type) => type.key));
  for (const event of FLOOD_EURASIA_EVENTS) {
    for (const claim of event.claims) {
      assert.ok(keys.has(claim.temporalClaimType ?? ""), `${event.slug}: unknown type`);
      if (claim.startYear == null) {
        assert.ok(
          POSITIONLESS.includes(claim.temporalClaimType ?? ""),
          `${event.slug}: "${claim.originalDateText}" has no date and a positioned type`
        );
      }
      // A duration never coexists with a range.
      if (claim.durationYears != null) assert.equal(claim.endYear, undefined);
    }
  }
});

test("motifs come from the vocabulary and are used", () => {
  const keys = new Set<string>(NARRATIVE_MOTIFS.map((motif) => motif.key));
  let marked = 0;
  for (const event of FLOOD_EURASIA_EVENTS) {
    for (const motif of event.motifs ?? []) {
      assert.ok(keys.has(motif), `${event.slug}: unknown motif "${motif}"`);
      marked++;
    }
  }
  assert.ok(marked > 20, `expected motifs to be used, found ${marked}`);
});

test("every source is checkable and every claim cites one", () => {
  const keys = new Set(FLOOD_EURASIA_SOURCES.map((source) => source.key));
  for (const event of FLOOD_EURASIA_EVENTS) {
    for (const claim of event.claims) {
      assert.ok(claim.sourceKey && keys.has(claim.sourceKey), `${event.slug}: bad source`);
      for (const citation of claim.citations ?? []) assert.ok(keys.has(citation.sourceKey));
    }
  }
  for (const source of FLOOD_EURASIA_SOURCES) {
    assert.ok(source.url || source.reference, `${source.key} gives a reader no way to find it`);
  }
});

test("nothing rates, scores or declares a verdict", () => {
  const banned = /\b(confidence|credibility|debunked|disproven|proven fact|just a myth|merely a myth)\b/i;
  for (const event of FLOOD_EURASIA_EVENTS) {
    assert.ok(!banned.test(`${event.summary} ${event.description}`), `${event.slug} rates something`);
    for (const claim of event.claims) assert.ok(!banned.test(`${claim.evidence} ${claim.notes ?? ""}`));
  }
  for (const link of FLOOD_EURASIA_LINKS) assert.ok(!banned.test(link.note));
});
