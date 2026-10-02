import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  SERPENT_KUNDALINI_ANCHOR_SLUG,
  SERPENT_KUNDALINI_EVENTS,
  SERPENT_KUNDALINI_LINKS,
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

test("the retained serpent comparisons stay visible and explicitly labelled", () => {
  const retained = [
    "gudea-vase-entwined-serpents",
    "caduceus-kundalini-comparison",
    "asclepius-staff-kundalini-comparison",
    "quetzalcoatl-kundalini-comparison",
    "nehushtan-kundalini-comparison",
    "jormungandr-kundalini-comparison",
    "uraeus-kundalini-comparison",
    "djed-spine-kundalini-comparison",
    "double-serpent-dna-comparison",
    "primordial-serpent-energy-doctrine",
  ];

  for (const slug of retained) {
    const event = record(slug);
    assert.ok(event.kundaliniRelation, `${slug}: comparison has no Kundalini-relation label`);
    assert.ok(event.transmissionStatus, `${slug}: comparison has no transmission status`);
  }

  for (const slug of [
    "caduceus-kundalini-comparison",
    "asclepius-staff-kundalini-comparison",
    "quetzalcoatl-kundalini-comparison",
    "jormungandr-kundalini-comparison",
  ]) {
    assert.equal(record(slug).kundaliniRelation, "cross_cultural_parallel", `${slug}: visual comparison was promoted into descent`);
  }

  for (const slug of [
    "nehushtan-kundalini-comparison",
    "uraeus-kundalini-comparison",
    "djed-spine-kundalini-comparison",
  ]) {
    assert.equal(record(slug).kundaliniRelation, "speculative_esoteric", `${slug}: speculative reading lost its status`);
  }

  assert.equal(record("double-serpent-dna-comparison").kundaliniRelation, "modern_development");
  assert.equal(record("primordial-serpent-energy-doctrine").kundaliniRelation, "modern_development");
});

test("the early Sārdhatriśatikālottara witness stays distinct from the later serpent-at-the-base model", () => {
  const early = record("sardhatrisatikalottara-primordial-kundalini");
  assert.equal(early.kundaliniRelation, "explicit_kundalini");
  assert.match(early.description, /heart/i);
  assert.match(early.description, /potentially very early/i);
  assert.match(early.description, /does not call 12\.1–2 the proven first occurrence/i);
  assert.match(early.description, /does not turn.*explicit serpent/is);
  assert.equal(early.media?.length ?? 0, 0, "do not decorate the early textual witness with later chakra imagery");
  assert.ok(early.claims.some((claim) => claim.sourceKey === "westoby_body_2024"));
  assert.ok(
    early.claims.some((claim) =>
      claim.citations?.some((citation) => citation.sourceKey === "williams_cosmogenesis_2023")
    ),
    "the Sanskrit/translation source must stay attached to the dating claim"
  );
});

test("Tantrasadbhava sleeping-serpent witness keeps its limits", () => {\n  const serpent = record("tantrasadbhava-sleeping-serpent-kundali");\n  assert.equal(serpent.kundaliniRelation, "explicit_kundalini");\n  assert.match(serpent.description, /sleeping serpent/i);\n  assert.match(serpent.description, /navel|belly/i);\n  assert.match(serpent.description, /proven superlative/i);\n  assert.match(serpent.description, /does not establish/i);\n  assert.equal(serpent.media?.length ?? 0, 0);\n  assert.ok(serpent.claims.some((claim) => claim.citations?.some((citation) => citation.sourceKey === "bang_tantrasadbhava_2022")));\n});\n\ntest("the Gudea vase holds a parallel and documented contact at the same time", () => {
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

// ---------------------------------------------------------------------------
// THE CONTROL RECORD, AND WHY IT IS TESTED SEPARATELY
//
// Every other record here is a serpent that might mean something. This one is
// the collection arguing against itself, and it is the first thing that would
// be quietly dropped if the collection ever started wanting to win. So it is
// pinned: it must exist, it must carry the dated counter-example, and it must
// reach the evidence rather than assert it.
// ---------------------------------------------------------------------------

const CONTROL = SERPENT_KUNDALINI_EVENTS.find((event) => event.slug === "serpent-is-not-one-symbol");

test("the collection carries a control record", () => {
  assert.ok(CONTROL, "the control record is gone — the collection can now only argue in one direction");
});

test("the control record carries the one DATED counter-example", () => {
  // Not decoration. The Greek case is the only place in this collection where
  // serpent iconography can be shown ARRIVING, inside one culture, at a date —
  // and a positioned claim is what makes that checkable rather than rhetorical.
  const dated = (CONTROL?.claims ?? []).filter((claim) => typeof claim.startYear === "number");
  assert.ok(dated.length >= 1, "the control record has no dated claim, so its counter-example cannot be checked");
  const greek = dated.find((claim) => claim.startYear === -379);
  assert.ok(greek, "the post-380 BCE date for serpent-legged Gigantes is missing");
  assert.match(
    greek.notes ?? "",
    /gigantes-gigantomachy/,
    "the Greek date is taken at one remove and must say so, naming the record it came from"
  );
});

test("the control record reaches its evidence instead of asserting it", () => {
  // The three cases live in other datasets. A control that only DESCRIBED them
  // would be this collection vouching for itself.
  const out = SERPENT_KUNDALINI_LINKS.filter((link) => link.from === "serpent-is-not-one-symbol");
  for (const slug of ["set-spears-apep", "gigantes-gigantomachy", "gudea-vase-entwined-serpents"]) {
    assert.ok(out.some((link) => link.to === slug), `the control record does not link to ${slug}`);
  }
});

test("the universality claim is held as a genealogy, not as a rebuttal", () => {
  // A record that simply said "the serpent is not universal" would be the same
  // kind of flat assertion as the claim it rejects. The chain has to show where
  // the claim actually comes from — including the parts nobody here has read.
  const genealogy = (CONTROL?.genealogies ?? []).find((item) => item.key === "serpent-universal-energy");
  assert.ok(genealogy, "the universality claim is not traced");
  assert.notEqual(genealogy.verdict, "directly_attested");
  assert.ok(genealogy.links.length >= 4, "a chain this short cannot show where the claim enters");
  const unread = genealogy.links.filter((link) => link.citationStatus === "unverified");
  assert.ok(
    unread.length >= 2,
    "the two modern stages are unread and must stay marked so — naming a work from memory here would put a " +
      "fabricated citation inside a chain about fabricated citations"
  );
});

// ---------------------------------------------------------------------------
// BRIEF 05a, AND THE TWO WAYS IT WENT STALE
//
// It was issued once and nothing came back. Two things were wrong with it, and
// neither was the research.
//
// IT HAD NO RETURN FORMAT. Every other brief in this repository says what shape
// an answer should arrive in, so the reply files straight against the records.
// 05a asked good questions and left the researcher to invent the container.
//
// AND ITS IMAGE SECTION OUTLIVED ITS OWN ANSWER. It asked for pictures of the
// three Indus and Mesopotamian records; all three now have them. Reissuing it
// unchanged would have spent a research round re-finding files already seeded —
// the same class of failure as a stale verification flag, and costlier, because
// a person does the wasted work.
//
// These tests hold both fixes in place.
// ---------------------------------------------------------------------------

const BRIEF_05A = readFileSync(
  new URL("../../../docs/research-brief-05-serpent-kundalini.md", import.meta.url),
  "utf8"
);

test("brief 05a says what shape an answer should come back in", () => {
  assert.match(BRIEF_05A, /##\s+Return format/i, "brief 05a has no return format — replies will not file against the records");
  assert.match(BRIEF_05A, /NOT FOUND/, "brief 05a no longer asks for the dead ends, which are findings");
  assert.match(BRIEF_05A, /as of \d{4}-\d{2}-\d{2}/, "brief 05a does not date its own counts");
});

test("brief 05a does not ask again for pictures it already has", () => {
  // The brief names three records as already illustrated and tells the
  // researcher not to look for them. That instruction is only safe while it is
  // true — if a picture is ever removed, the brief starts quietly under-asking.
  const alreadyDone = ["pashupati-seal", "indus-script-undeciphered", "gudea-vase-entwined-serpents"];
  for (const slug of alreadyDone) {
    const event = SERPENT_KUNDALINI_EVENTS.find((item) => item.slug === slug);
    assert.ok(event, `${slug} is named in brief 05a but is not a record`);
    assert.ok(
      (event.media ?? []).length > 0,
      `brief 05a tells the researcher not to look for a picture of ${slug}, but it has none`
    );
  }
});

test("brief 05a points at the record it now feeds", () => {
  // Part C asks the transmission question; the control record is where the
  // answer lands. A brief that does not name it sends work to nowhere.
  assert.match(
    BRIEF_05A,
    /serpent-is-not-one-symbol/,
    "brief 05a does not mention the control record its transmission question feeds"
  );
});