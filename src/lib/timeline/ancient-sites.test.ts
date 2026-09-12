import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ANCIENT_SITES_EVENTS,
  ANCIENT_SITES_SOURCES,
  ANCIENT_SITES_LINKS,
  ANCIENT_SITES_ANCHOR_SLUG,
} from "./ancient-sites-seed";
import { DATING_METHODS, CLAIM_VIEWPOINTS, TIMELINE_EVENT_TYPES, TIMELINE_SOURCE_TYPES, EVENT_RELATIONS } from "./taxonomy";

const CLAIMS = ANCIENT_SITES_EVENTS.flatMap((event) =>
  event.claims.map((claim) => ({ slug: event.slug, claim }))
);

// ---------------------------------------------------------------------------
// THE VOCABULARY TRAP
//
// Every one of these lists is typed as `string`, so an invented key typechecks
// and then fails silently at seed time — the row is written with a key nothing
// renders a label for, and the only symptom is a claim that looks slightly
// blank in the UI. This has happened before in this codebase, five keys at
// once. These tests are how it stops happening.
// ---------------------------------------------------------------------------

const keys = (list: readonly { key: string }[]) => new Set(list.map((entry) => entry.key));

test("every dating method is a real key", () => {
  const valid = keys(DATING_METHODS);
  for (const { slug, claim } of CLAIMS) {
    assert.ok(valid.has(claim.datingMethod), `${slug}: "${claim.datingMethod}" is not a dating method`);
  }
});

test("every viewpoint is a real key", () => {
  const valid = keys(CLAIM_VIEWPOINTS);
  for (const { slug, claim } of CLAIMS) {
    assert.ok(valid.has(claim.chronology), `${slug}: "${claim.chronology}" is not a viewpoint`);
  }
});

test("every event type and source type is a real key", () => {
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  for (const event of ANCIENT_SITES_EVENTS) {
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: "${event.eventType}" is not an event type`);
  }
  const sourceTypes = keys(TIMELINE_SOURCE_TYPES);
  for (const source of ANCIENT_SITES_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType), `${source.key}: "${source.sourceType}" is not a source type`);
  }
});

test("every link relation is a real key, and both ends exist", () => {
  const relations = keys(EVENT_RELATIONS);
  const slugs = new Set(ANCIENT_SITES_EVENTS.map((event) => event.slug));
  for (const link of ANCIENT_SITES_LINKS) {
    assert.ok(relations.has(link.relation), `"${link.relation}" is not an event relation`);
    assert.ok(slugs.has(link.from), `link from unknown record ${link.from}`);
    assert.ok(slugs.has(link.to), `link to unknown record ${link.to}`);
  }
});

test("date precision is one the database will accept", () => {
  // A CHECK constraint, so a wrong value here is rejected outright at seed time.
  const allowed = new Set([
    "day", "month", "year", "decade", "century", "millennium",
    "thousand_years", "million_years", "billion_years",
  ]);
  for (const { slug, claim } of CLAIMS) {
    assert.ok(allowed.has(claim.datePrecision), `${slug}: "${claim.datePrecision}" is not a date precision`);
  }
});

// ---------------------------------------------------------------------------
// THE DISTINCTIONS THIS DATASET EXISTS TO ENFORCE
//
// These are not style rules. Each one is a specific way of turning a
// measurement into a claim it does not support, and each has been done in
// print about one of the records below.
// ---------------------------------------------------------------------------

test("every claim says what it is a date FOR", () => {
  // The whole architecture of the dataset. A site is not a date, so a date on
  // a site record is meaningless until it says which proposition it dates —
  // and the detail view groups by exactly this field.
  for (const { slug, claim } of CLAIMS) {
    assert.ok(claim.whatIsDated, `${slug}: "${claim.originalDateText}" does not say what it dates`);
    assert.ok(
      (claim.whatIsDated ?? "").trim().length > 12,
      `${slug}: whatIsDated is too thin to distinguish anything`
    );
  }
});

test("a record with more than one claim dates more than one thing", () => {
  // If two claims on one record share a whatIsDated they are rival answers to
  // one question, which is allowed — but not for these records, where the
  // point is that the dates are answers to DIFFERENT questions. The Sphinx is
  // the case: three dates, three subjects.
  for (const event of ANCIENT_SITES_EVENTS) {
    if (event.claims.length < 2) continue;
    const subjects = new Set(event.claims.map((claim) => claim.whatIsDated?.trim()));
    assert.ok(
      subjects.size > 1,
      `${event.slug}: ${event.claims.length} claims all dating "${[...subjects][0]}" — the record would stack them as rivals`
    );
  }
});

test("every claim explains what the measurement does NOT establish", () => {
  // The inference from "this sample is old" to "this structure is old" is
  // where every disputed date in this dataset lives. A claim that states only
  // what it establishes has hidden the part a reader needs.
  for (const { slug, claim } of CLAIMS) {
    assert.match(
      claim.evidence,
      /DOES NOT ESTABLISH|NOT ESTABLISH|WHAT IT DOES NOT|DOES NOT MEASURE/,
      `${slug}: the evidence block never says what the measurement does not establish`
    );
  }
});

test("every claim names what was dated and by what method, in the evidence", () => {
  for (const { slug, claim } of CLAIMS) {
    assert.match(claim.evidence, /WHAT IS DATED|WHAT WAS DATED/, `${slug}: evidence does not say what is dated`);
    assert.match(claim.evidence, /DATING METHOD|METHOD:/, `${slug}: evidence does not name the method`);
  }
});

test("an alternative claim names the person proposing it", () => {
  // "Some researchers say" is how a claim becomes unfalsifiable. Every
  // non-mainstream date here is somebody's.
  for (const { slug, claim } of CLAIMS) {
    if (claim.chronology !== "alternative" && claim.chronology !== "disputed") continue;
    assert.match(
      claim.evidence,
      /WHO PROPOSES|WHAT THE AUTHORS INFERRED|WHAT SCHOCH ARGUES/,
      `${slug}: an alternative claim that names nobody`
    );
    assert.ok(claim.sourceKey, `${slug}: an alternative claim with no source asserting it`);
  }
});

test("no claim carries a confidence score by any name", () => {
  const banned = /\b(confidence|reliability|credibility|plausibility)\s*(score|rating|level|:)/i;
  for (const { slug, claim } of CLAIMS) {
    assert.doesNotMatch(claim.evidence, banned, `${slug}: evidence carries a score`);
    assert.doesNotMatch(claim.notes ?? "", banned, `${slug}: notes carry a score`);
  }
  for (const event of ANCIENT_SITES_EVENTS) {
    assert.doesNotMatch(event.description, banned, `${event.slug}: description carries a score`);
  }
});

test("no record labels a claim simply true, false, proven or debunked", () => {
  // The brief forbids the simplistic labels, and they are exactly what a
  // dataset about disputed dates drifts towards under its own momentum.
  const banned = /\b(debunked|disproven|proven true|proved false|hoax|fraud)\b/i;
  for (const event of ANCIENT_SITES_EVENTS) {
    assert.doesNotMatch(event.description, banned, `${event.slug}: description uses a verdict label`);
    assert.doesNotMatch(event.summary, banned, `${event.slug}: summary uses a verdict label`);
  }
});

// ---------------------------------------------------------------------------
// THE PARTICULAR CONFUSIONS, CHECKED ON THE RECORDS THEY BELONG TO
// ---------------------------------------------------------------------------

test("the Ottosdal objects carry no date for the objects themselves", () => {
  // The sharpest case in the dataset: the only measurement is of the host
  // rock, and letting an object claim appear here would be the exact error the
  // record exists to demonstrate.
  const record = ANCIENT_SITES_EVENTS.find((event) => event.slug === "klerksdorp-ottosdal-spheres");
  assert.ok(record);
  for (const claim of record!.claims) {
    assert.match(
      claim.whatIsDated ?? "",
      /deposit/i,
      `a claim on the Ottosdal record dates "${claim.whatIsDated}" — only the deposit has been dated`
    );
  }
});

test("the 10,500 BCE Sphinx claim is recorded as dating the sky, not silently as a construction date", () => {
  const sphinx = ANCIENT_SITES_EVENTS.find((event) => event.slug === "great-sphinx-carving");
  assert.ok(sphinx);
  const astro = sphinx!.claims.find((claim) => claim.datingMethod === "astronomical");
  assert.ok(astro, "the astronomical claim is missing");
  assert.match(astro!.whatIsDated ?? "", /astronomical|sky/i);
  // And the record must say the further step exists, rather than leaving a
  // reader to assume a sky-date is a build-date either way.
  assert.match(sphinx!.description, /SKY-DATE IS NOT AUTOMATICALLY A CONSTRUCTION-DATE/);
});

test("Schoch and the 10,500 BCE correlation are not merged into one claim", () => {
  // Two people disagreeing with the mainstream are not thereby agreeing with
  // each other, and their dates are thousands of years apart.
  const sphinx = ANCIENT_SITES_EVENTS.find((event) => event.slug === "great-sphinx-carving")!;
  const schoch = sphinx.claims.find((claim) => claim.datingMethod === "geological");
  const astro = sphinx.claims.find((claim) => claim.datingMethod === "astronomical");
  assert.ok(schoch && astro);
  assert.notEqual(schoch!.whatIsDated, astro!.whatIsDated);
  assert.ok(
    Math.abs((schoch!.startYear ?? 0) - (astro!.startYear ?? 0)) > 3000,
    "the two alternative dates should be thousands of years apart, as they are in the sources"
  );
});

test("the Gunung Padang deep claim is not stored as a plain radiocarbon date", () => {
  // Radiocarbon was the measurement; the DATE is an inference from it. Storing
  // it as "radiocarbon" would tell a reader the structure had been dated.
  const record = ANCIENT_SITES_EVENTS.find((event) => event.slug === "gunung-padang-dating")!;
  const deep = record.claims.find((claim) => claim.chronology === "alternative");
  assert.ok(deep);
  assert.equal(deep!.datingMethod, "claimant_inference");
  assert.match(deep!.evidence, /not associated with artefacts|not associated with\s+artefacts/i);
});

test("the retraction is attached to the claim rather than used to delete it", () => {
  const record = ANCIENT_SITES_EVENTS.find((event) => event.slug === "gunung-padang-dating")!;
  const deep = record.claims.find((claim) => claim.chronology === "alternative")!;
  const disputes = (deep.citations ?? []).filter((citation) => citation.relation === "disputes");
  assert.ok(disputes.length > 0, "the retraction should be on the claim as a dispute");
  assert.ok(
    disputes.some((citation) => citation.sourceKey === "arp_retraction"),
    "the retraction notice itself should be cited"
  );
});

test("Göbekli Tepe is seeded as mainstream, and is older than an alternative claim here", () => {
  // The control. If this ever gets filed as alternative because it is old, the
  // dataset has lost the distinction it is built to teach.
  const gobekli = ANCIENT_SITES_EVENTS.find((event) => event.slug === ANCIENT_SITES_ANCHOR_SLUG)!;
  assert.equal(gobekli.eventType, "mainstream");
  for (const claim of gobekli.claims) {
    assert.equal(claim.chronology, "conventional", "a Göbekli Tepe claim filed as anything but mainstream");
  }
  const sphinx = ANCIENT_SITES_EVENTS.find((event) => event.slug === "great-sphinx-carving")!;
  const schoch = sphinx.claims.find((claim) => claim.datingMethod === "geological")!;
  const oldest = Math.min(...gobekli.claims.map((claim) => claim.startYear ?? 0));
  assert.ok(
    oldest < (schoch.startYear ?? 0),
    "Göbekli Tepe should be older than Schoch's Sphinx — that contrast is the point of including it"
  );
});

test("the Cerutti claim is filed as a scientific dispute, not as alternative history", () => {
  const record = ANCIENT_SITES_EVENTS.find((event) => event.slug === "cerutti-mastodon-site")!;
  const claim = record.claims[0];
  assert.equal(claim.chronology, "scientific");
  // And the objection has to be on the record, by name.
  assert.ok((claim.citations ?? []).some((citation) => citation.sourceKey === "braje2017"));
});

// ---------------------------------------------------------------------------
// SOURCES
// ---------------------------------------------------------------------------

test("every claim and citation points at a source that exists", () => {
  const known = new Set(ANCIENT_SITES_SOURCES.map((source) => source.key));
  for (const { slug, claim } of CLAIMS) {
    if (claim.sourceKey) assert.ok(known.has(claim.sourceKey), `${slug}: unknown source ${claim.sourceKey}`);
    for (const citation of claim.citations ?? []) {
      assert.ok(known.has(citation.sourceKey), `${slug}: unknown cited source ${citation.sourceKey}`);
    }
  }
  for (const source of ANCIENT_SITES_SOURCES) {
    if (source.citedBy) assert.ok(known.has(source.citedBy), `${source.key}: unknown citedBy ${source.citedBy}`);
  }
});

test("an alternative date is sourced to its claimant's own publication", () => {
  // Not to a website describing what they are supposed to believe. Schoch's
  // date comes from Schoch; the 10,500 BCE correlation from Hancock and Bauval.
  const byKey = new Map(ANCIENT_SITES_SOURCES.map((source) => [source.key, source]));
  for (const { slug, claim } of CLAIMS) {
    if (claim.chronology !== "alternative") continue;
    const source = byKey.get(claim.sourceKey ?? "");
    assert.ok(source, `${slug}: alternative claim with no source`);
    assert.notEqual(source!.sourceType, "wikipedia", `${slug}: an alternative date sourced to Wikipedia`);
    assert.notEqual(source!.sourceType, "website", `${slug}: an alternative date sourced to a website`);
  }
});

test("no source is cited without saying what it is cited FOR", () => {
  for (const source of ANCIENT_SITES_SOURCES) {
    assert.ok(source.notes && source.notes.trim().length > 40, `${source.key}: notes are missing or too thin`);
  }
});

test("every record is reachable and uniquely slugged", () => {
  const slugs = ANCIENT_SITES_EVENTS.map((event) => event.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug in the dataset");
  assert.ok(slugs.includes(ANCIENT_SITES_ANCHOR_SLUG), "the anchor slug is not in the dataset");
});

test("a claim that needs verification says so rather than reading as established", () => {
  // The standing rule: an unverified date is marked, not quietly promoted.
  // This checks the one place in this tranche where that applies.
  const record = ANCIENT_SITES_EVENTS.find((event) => event.slug === "gunung-padang-dating")!;
  const surface = record.claims.find((claim) => claim.chronology === "archaeological")!;
  assert.match(surface.evidence, /NEEDS SOURCE VERIFICATION/);
});
