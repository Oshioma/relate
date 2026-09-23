import { test } from "node:test";
import assert from "node:assert/strict";

import {
  SERPENT_KUNDALINI_ANCHOR_SLUG,
  SERPENT_KUNDALINI_EVENTS,
  SERPENT_KUNDALINI_SOURCES,
} from "./serpent-kundalini-seed";
import {
  KUNDALINI_RELATIONS,
  TRANSMISSION_STATUSES,
  TIMELINE_CATEGORIES,
  TIMELINE_EVENT_TYPES,
  IDENTIFICATION_STATUSES,
  TEMPORAL_CLAIM_TYPES,
  DATING_METHODS,
  CLAIM_VIEWPOINTS,
  relationClaimsConnection,
  relationContradictsTransmission,
  temporalTypeIsPositioned,
} from "./taxonomy";
import { DATE_UNITS } from "./time";

const byslug = new Map(SERPENT_KUNDALINI_EVENTS.map((e) => [e.slug, e]));
const record = (slug: string) => {
  const found = byslug.get(slug);
  assert.ok(found, `missing record: ${slug}`);
  return found;
};

// ---------------------------------------------------------------------------
// THE ONE THING THIS COLLECTION MUST NOT DO
//
// Serpent imagery is close to universal, and so is vertical-axis imagery. The
// failure mode is not a false sentence in any single record — it is a hundred
// true records arranged so the pile argues for a lineage nobody wrote down.
//
// Two fields prevent that, and these tests are what make them load-bearing
// rather than decorative.
// ---------------------------------------------------------------------------

test("every record says what it claims, and whether anything travelled", () => {
  for (const event of SERPENT_KUNDALINI_EVENTS) {
    assert.ok(
      event.kundaliniRelation,
      `${event.slug}: a record with no stated relation lets the reader supply one`
    );
    assert.ok(
      event.transmissionStatus,
      `${event.slug}: "did this travel?" is a separate question and must be answered`
    );
  }
});

test("no record claims a connection while recording that nothing shows contact", () => {
  // This is THE check. A gallery of resemblances turns into a lineage one
  // reasonable-looking record at a time, and this is the combination that does
  // it: asserting descent while admitting the cultures may never have met.
  for (const event of SERPENT_KUNDALINI_EVENTS) {
    assert.equal(
      relationContradictsTransmission(event.kundaliniRelation, event.transmissionStatus),
      false,
      `${event.slug}: claims "${event.kundaliniRelation}" but records "${event.transmissionStatus}"`
    );
  }
});

test("a cross-cultural parallel carries both sides of the argument", () => {
  // A resemblance recorded with only the case FOR it is an assertion wearing a
  // label. The label is not the safeguard; the counter-argument is.
  for (const event of SERPENT_KUNDALINI_EVENTS) {
    if (relationClaimsConnection(event.kundaliniRelation)) continue;
    if (event.kundaliniRelation === "modern_development") continue;
    if (!event.argumentsFor && !event.argumentsAgainst) continue;
    assert.ok(
      event.argumentsFor && event.argumentsAgainst,
      `${event.slug}: one side of the argument without the other`
    );
  }
});

test("the Gudea vase holds a parallel and documented contact at the same time", () => {
  // The position this collection is usually in, and the one that needs two
  // fields to state: Mesopotamia and the Indus demonstrably traded, AND
  // nothing shows a doctrine about the body went with the pottery.
  const vase = record("gudea-vase-entwined-serpents");
  assert.equal(vase.kundaliniRelation, "cross_cultural_parallel");
  assert.equal(vase.transmissionStatus, "contact_documented");
  assert.match(vase.description, /NO DEMONSTRATED EVIDENCE/);
  assert.match(vase.description, /CROSS-CULTURAL VISUAL PARALLEL/i);

  // The three questions are three claims, because merging them is how the
  // argument normally gets made.
  assert.equal(vase.claims.length, 3);
  assert.ok(vase.claims.some((c) => /could carry such a motif/i.test(c.whatIsDated ?? "")));
});

test("the Indus records never imply Kundalini in the Indus valley", () => {
  const forbidden = /Indus people practised|Indus.{0,40}Kundalini yoga|kundalini in the Indus/gi;
  for (const event of SERPENT_KUNDALINI_EVENTS) {
    if (!event.civilisations?.includes("Indus Valley Civilisation")) continue;
    const text = `${event.title}\n${event.summary}\n${event.description}`;
    for (const match of text.matchAll(forbidden)) {
      const window = text.slice(Math.max(0, match.index - 300), match.index + 120);
      assert.match(
        window,
        /never say|will never|not say|no evidence|refuse/i,
        `${event.slug}: says it without disowning it`
      );
    }
  }
});

test("the undeciphered script is a record, not a caveat in someone's prose", () => {
  // It governs how much weight every Indus identification can bear, so it has
  // to be a thing a reader can open rather than a sentence they might skim.
  const script = record("indus-script-undeciphered");
  assert.equal(script.claims.length, 1);
  assert.equal(temporalTypeIsPositioned(script.claims[0].temporalClaimType), false);
  assert.match(script.description, /argument from resemblance/i);
});

test("the seal's two readings are two claims", () => {
  // A figure could be seated meditatively without being Siva, and could be
  // Siva without being seated meditatively. They are routinely merged.
  const seal = record(SERPENT_KUNDALINI_ANCHOR_SLUG);
  const shiva = seal.claims.find((c) => /proto-Śiva/i.test(c.whatIsDated ?? ""));
  const posture = seal.claims.find((c) => /posture is yogic/i.test(c.whatIsDated ?? ""));
  assert.ok(shiva, "the proto-Siva reading is a claim");
  assert.ok(posture, "the yogic-posture reading is a separate claim");
  assert.match(posture.evidence, /KEPT AS A SEPARATE CLAIM/);
  assert.equal(seal.identificationStatus, "disputed");
});

test("the anchor does not pretend to a description it has not checked", () => {
  // The record argues that description and interpretation must be kept apart.
  // Writing its own description from memory would be the worst possible way to
  // make that argument.
  const seal = record(SERPENT_KUNDALINI_ANCHOR_SLUG);
  assert.match(seal.description, /EXACTLY WHAT THIS RECORD LACKS/);
  const excavation = seal.claims[0];
  assert.match(excavation.notes ?? "", /excavation number/i);
});

// ---------------------------------------------------------------------------
// VOCABULARY AND SHAPE
// ---------------------------------------------------------------------------

const keys = (list: readonly { key: string }[]) => new Set(list.map((x) => x.key));

test("every key used comes from the shared vocabularies", () => {
  const relations = keys(KUNDALINI_RELATIONS);
  const transmissions = keys(TRANSMISSION_STATUSES);
  const categories = keys(TIMELINE_CATEGORIES);
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const identifications = keys(IDENTIFICATION_STATUSES);
  const temporal = keys(TEMPORAL_CLAIM_TYPES);
  const methods = keys(DATING_METHODS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const units = keys(DATE_UNITS);

  for (const event of SERPENT_KUNDALINI_EVENTS) {
    assert.ok(relations.has(event.kundaliniRelation ?? ""), `${event.slug}: ${event.kundaliniRelation}`);
    assert.ok(transmissions.has(event.transmissionStatus ?? ""), `${event.slug}: ${event.transmissionStatus}`);
    assert.ok(categories.has(event.category), `${event.slug}: ${event.category}`);
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: ${event.eventType}`);
    if (event.identificationStatus) {
      assert.ok(identifications.has(event.identificationStatus), `${event.slug}: ${event.identificationStatus}`);
    }
    for (const claim of event.claims) {
      assert.ok(temporal.has(claim.temporalClaimType ?? ""), `${event.slug}: ${claim.temporalClaimType}`);
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: ${claim.datingMethod}`);
      assert.ok(viewpoints.has(claim.chronology), `${event.slug}: ${claim.chronology}`);
      assert.ok(units.has(claim.datePrecision), `${event.slug}: ${claim.datePrecision}`);
    }
  }
});

test("nothing in this collection carries a confidence score", () => {
  // The relation labels are the likeliest place for one to be smuggled in:
  // "possible parallel, 40%" reads almost reasonable.
  for (const event of SERPENT_KUNDALINI_EVENTS) {
    const text = JSON.stringify(event);
    assert.doesNotMatch(text, /"confidence"/, event.slug);
    assert.doesNotMatch(text, /\b\d{1,3}\s?% (certain|confident|likely|sure|probable)\b/i, event.slug);
  }
});

test("a positionless claim carries no year, and a positioned one does", () => {
  for (const event of SERPENT_KUNDALINI_EVENTS) {
    for (const claim of event.claims) {
      if (temporalTypeIsPositioned(claim.temporalClaimType)) {
        assert.ok(claim.startYear !== undefined, `${event.slug}: "${claim.originalDateText}" has no year`);
      } else {
        assert.equal(claim.startYear, undefined, `${event.slug}: "${claim.originalDateText}" must not carry a year`);
      }
    }
  }
});

test("slugs are unique, claims are sourced, and evidence is not a stub", () => {
  assert.equal(byslug.size, SERPENT_KUNDALINI_EVENTS.length, "a duplicate slug silently overwrites a record");
  const sourceKeys = new Set(SERPENT_KUNDALINI_SOURCES.map((s) => s.key));
  for (const event of SERPENT_KUNDALINI_EVENTS) {
    assert.ok(event.claims.length > 0, `${event.slug} has no claims`);
    const texts = event.claims.map((c) => c.originalDateText);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: duplicate originalDateText`);
    for (const claim of event.claims) {
      if (claim.sourceKey !== null) {
        assert.ok(sourceKeys.has(claim.sourceKey), `${event.slug}: unknown source ${claim.sourceKey}`);
      }
      assert.ok(claim.evidence.length > 40, `${event.slug}: "why this date?" is not optional`);
    }
  }
});

test("the unread sources admit it, because none of them has been opened", () => {
  // This collection was begun with no access to a museum catalogue, an
  // excavation report or a journal. The flags are the record of that, and the
  // assertion is not that the count is low.
  for (const source of SERPENT_KUNDALINI_SOURCES) {
    assert.match(
      source.notes,
      /NOT READ|NEEDS SOURCE VERIFICATION/,
      `${source.key}: an unopened source must say so`
    );
    assert.ok(source.notes.length > 40, `${source.key}: a note must say what it is cited FOR`);
  }
});
