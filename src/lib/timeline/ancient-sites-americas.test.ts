import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ANCIENT_SITES_AMERICAS_EVENTS,
  ANCIENT_SITES_AMERICAS_SOURCES,
  ANCIENT_SITES_AMERICAS_LINKS,
  ANCIENT_SITES_AMERICAS_ANCHOR_SLUG,
} from "./ancient-sites-americas-seed";
import {
  DATING_METHODS,
  CLAIM_VIEWPOINTS,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
  EVENT_RELATIONS,
  DATE_CONVENTIONS,
} from "./taxonomy";

const CLAIMS = ANCIENT_SITES_AMERICAS_EVENTS.flatMap((event) =>
  event.claims.map((claim) => ({ slug: event.slug, claim }))
);
const keys = (list: readonly { key: string }[]) => new Set(list.map((entry) => entry.key));
const byslug = (slug: string) => {
  const found = ANCIENT_SITES_AMERICAS_EVENTS.find((event) => event.slug === slug);
  assert.ok(found, `no record ${slug}`);
  return found!;
};

// ---------------------------------------------------------------------------
// VOCABULARY. Typed as `string`, so an invented key typechecks and is then
// rejected silently at seed time.
// ---------------------------------------------------------------------------

test("every vocabulary key is real", () => {
  const methods = keys(DATING_METHODS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const conventions = keys(DATE_CONVENTIONS);
  const precisions = new Set([
    "day", "month", "year", "decade", "century", "millennium",
    "thousand_years", "million_years", "billion_years",
  ]);
  for (const { slug, claim } of CLAIMS) {
    assert.ok(methods.has(claim.datingMethod), `${slug}: "${claim.datingMethod}" is not a dating method`);
    assert.ok(viewpoints.has(claim.chronology), `${slug}: "${claim.chronology}" is not a viewpoint`);
    assert.ok(precisions.has(claim.datePrecision), `${slug}: "${claim.datePrecision}" is not a precision`);
    if (claim.dateConvention) {
      assert.ok(conventions.has(claim.dateConvention), `${slug}: "${claim.dateConvention}" is not a convention`);
    }
  }
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  for (const event of ANCIENT_SITES_AMERICAS_EVENTS) {
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: "${event.eventType}" is not an event type`);
  }
  const sourceTypes = keys(TIMELINE_SOURCE_TYPES);
  for (const source of ANCIENT_SITES_AMERICAS_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType), `${source.key}: "${source.sourceType}" is not a source type`);
  }
  const relations = keys(EVENT_RELATIONS);
  const slugs = new Set(ANCIENT_SITES_AMERICAS_EVENTS.map((event) => event.slug));
  for (const link of ANCIENT_SITES_AMERICAS_LINKS) {
    assert.ok(relations.has(link.relation), `"${link.relation}" is not an event relation`);
    assert.ok(slugs.has(link.from) && slugs.has(link.to), `link between unknown records`);
  }
});

// ---------------------------------------------------------------------------
// THE DISTINCTIONS
// ---------------------------------------------------------------------------

test("every claim says what it dates, by what method, and what it does not establish", () => {
  for (const { slug, claim } of CLAIMS) {
    assert.ok(claim.whatIsDated && claim.whatIsDated.trim().length > 15, `${slug}: whatIsDated missing or thin`);
    assert.match(claim.evidence, /WHAT IS DATED/, `${slug}: evidence does not say what is dated`);
    assert.match(claim.evidence, /DATING METHOD|METHOD:/, `${slug}: evidence does not name the method`);
    assert.match(claim.evidence, /DOES NOT ESTABLISH|NOT ESTABLISH/, `${slug}: never says what it does not establish`);
  }
});

test("a record with several claims dates several different things", () => {
  for (const event of ANCIENT_SITES_AMERICAS_EVENTS) {
    if (event.claims.length < 2) continue;
    const subjects = new Set(event.claims.map((claim) => claim.whatIsDated?.trim()));
    assert.equal(
      subjects.size,
      event.claims.length,
      `${event.slug}: ${event.claims.length} claims, ${subjects.size} subjects — some would stack as rivals`
    );
  }
});

test("every years-ago figure is converted from BP rather than copied", () => {
  // 200,000 BP is 1950 - 200000 = -198050, not -200000.
  for (const { slug, claim } of CLAIMS) {
    if (claim.dateConvention !== "before_present") continue;
    assert.equal(claim.conventionReferenceYear, 1950, `${slug}: BP figure without the 1950 reference`);
    // The stored astronomical year is what must NOT be round: 200,000 BP
    // converts to -198050, and a stored -200000 is the BP figure copied
    // straight in. Checking the BP side instead — as this test first did —
    // flags every correct conversion, because the BP figures ARE round.
    assert.ok(
      claim.startYear != null && claim.startYear % 1000 !== 0,
      `${slug}: ${claim.startYear} is round, so it looks like a BP figure copied rather than converted`
    );
  }
});

test("nothing carries a confidence score or a verdict label", () => {
  const score = /\b(confidence|credibility|reliability|plausibility)\s*(score|rating|level|%)/i;
  const verdict = /\b(debunked|disproven|proven true|proved false|hoax|fraud)\b/i;
  for (const event of ANCIENT_SITES_AMERICAS_EVENTS) {
    for (const text of [event.summary, event.description]) {
      assert.doesNotMatch(text, score, `${event.slug}: a score`);
      assert.doesNotMatch(text, verdict, `${event.slug}: a verdict label`);
    }
    for (const claim of event.claims) {
      assert.doesNotMatch(claim.evidence, score, `${event.slug}: a score in the evidence`);
      assert.doesNotMatch(claim.notes ?? "", score, `${event.slug}: a score in the notes`);
    }
  }
});

// ---------------------------------------------------------------------------
// THE PARTICULAR CASES
// ---------------------------------------------------------------------------

test("Posnansky's date is recorded as dating an alignment, not a construction", () => {
  const tiwanaku = byslug(ANCIENT_SITES_AMERICAS_ANCHOR_SLUG);
  const posnansky = tiwanaku.claims.find((claim) => claim.datingMethod === "astronomical");
  assert.ok(posnansky, "the astronomical claim is missing");
  assert.match(posnansky!.whatIsDated ?? "", /alignment|astronomical/i);
  // And the record must say where the calculation actually fails, in terms a
  // reader can check — not merely that it is rejected.
  assert.match(posnansky!.evidence, /solstice|obliquity|tilt of the Earth/i);
  assert.match(tiwanaku.description, /precess/i);
});

test("Posnansky is not described as an outsider, because he was not one", () => {
  // He excavated at Tiwanaku for decades and produced the first detailed
  // survey. Dismissing the man rather than the calculation is the easy move
  // and the wrong one.
  const tiwanaku = byslug(ANCIENT_SITES_AMERICAS_ANCHOR_SLUG);
  const text = `${tiwanaku.description} ${tiwanaku.claims.map((c) => c.notes ?? "").join(" ")}`;
  assert.match(text, /engineer|survey/i, "the record does not say who he actually was");
});

test("the Pumapunku is a separate record from Tiwanaku, with its own date", () => {
  const puma = byslug("pumapunku-construction");
  assert.notEqual(puma.slug, ANCIENT_SITES_AMERICAS_ANCHOR_SLUG);
  assert.match(puma.description, /separate record/i);
  // And its date must come from material inside the structure, which is what
  // distinguishes it from most of the disputed sites in this dataset.
  assert.match(puma.claims[0].whatIsDated ?? "", /fill/i);
});

test("Calico's date is of the deposit, and the artefact question is its own claim", () => {
  const calico = byslug("calico-early-man-site");
  const deposit = calico.claims.find((claim) => claim.chronology === "geological");
  const objects = calico.claims.find((claim) => claim.chronology === "hypothesis");
  assert.ok(deposit && objects, "Calico should carry both a deposit date and an interpretation");
  assert.match(deposit!.whatIsDated ?? "", /deposit|fan/i);
  assert.equal(objects!.datingMethod, "claimant_inference");
  // Leakey's authority must not be doing any evidential work.
  assert.match(calico.description, /not evidence about the stone|not an argument in it/i);
});

test("Hueyatlaco's wide fission-track error is stored as a tolerance, not a range", () => {
  // 370,000 ± 200,000 is one measurement with a tolerance. Storing it as a
  // span would turn a weak constraint into a duration something was true for.
  const record = byslug("hueyatlaco-valsequillo");
  const fission = record.claims.find((claim) => claim.datingMethod === "fission_track");
  assert.ok(fission);
  assert.equal(fission!.uncertaintyPlus, 200000);
  assert.equal(fission!.endYear, undefined, "an error bar must not be stored as an end year");
  // And the record must say the tolerance is the point.
  assert.match(fission!.evidence, /tolerance/i);
});

test("the excavation director's dissent is on the record", () => {
  // The dating team's figures were opposed from inside the same excavation and
  // the opposition was never withdrawn. Leaving it off would show them as
  // unopposed.
  const record = byslug("hueyatlaco-valsequillo");
  const dissent = record.claims.find((claim) => (claim.whatIsDated ?? "").includes("excavation director"));
  assert.ok(dissent, "Irwin-Williams' position is missing");
  assert.match(record.description, /Irwin-Williams/);
});

test("Pedra Furada is filed as a dispute between archaeologists, not alternative history", () => {
  const record = byslug("pedra-furada-occupation");
  assert.equal(record.claims[0].chronology, "disputed");
  const cited = (record.claims[0].citations ?? []).map((citation) => citation.sourceKey);
  assert.ok(cited.includes("meltzer1994"), "the published objection is missing");
  assert.match(record.claims[0].notes ?? "", /not an alternative-history claim/i);
});

test("a claim that could not be traced to its own publication says so", () => {
  // The standing rule: an unverified figure is marked, never quietly promoted.
  // The mark may sit in the evidence or in the notes — both are shown on the
  // claim — so look in both rather than only where it happened to be written.
  const flagged = CLAIMS.filter(({ claim }) =>
    /NEEDS SOURCE VERIFICATION/.test(`${claim.evidence} ${claim.notes ?? ""}`)
  );
  assert.ok(flagged.length >= 2, "expected the untraced figures to be marked");
  for (const { claim } of flagged) {
    assert.match(`${claim.evidence} ${claim.notes ?? ""}`, /LIMITATION OF THIS ENTRY|could not be traced/i);
  }
});

// ---------------------------------------------------------------------------
// SOURCES
// ---------------------------------------------------------------------------

test("every claim and citation points at a source that exists", () => {
  const known = new Set(ANCIENT_SITES_AMERICAS_SOURCES.map((source) => source.key));
  for (const { slug, claim } of CLAIMS) {
    if (claim.sourceKey) assert.ok(known.has(claim.sourceKey), `${slug}: unknown source ${claim.sourceKey}`);
    for (const citation of claim.citations ?? []) {
      assert.ok(known.has(citation.sourceKey), `${slug}: unknown cited source ${citation.sourceKey}`);
    }
  }
});

test("an alternative date is sourced to its claimant's own publication", () => {
  const byKey = new Map(ANCIENT_SITES_AMERICAS_SOURCES.map((source) => [source.key, source]));
  for (const { slug, claim } of CLAIMS) {
    if (claim.chronology !== "alternative") continue;
    const source = byKey.get(claim.sourceKey ?? "");
    assert.ok(source, `${slug}: alternative claim with no source`);
    assert.notEqual(source!.sourceType, "wikipedia", `${slug}: an alternative date sourced to Wikipedia`);
    assert.notEqual(source!.sourceType, "website", `${slug}: an alternative date sourced to a website`);
  }
});

test("no source is cited without saying what it is cited for", () => {
  for (const source of ANCIENT_SITES_AMERICAS_SOURCES) {
    assert.ok(source.notes && source.notes.trim().length > 50, `${source.key}: notes missing or too thin`);
  }
});

test("every record is uniquely slugged and the anchor is among them", () => {
  const slugs = ANCIENT_SITES_AMERICAS_EVENTS.map((event) => event.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  assert.ok(slugs.includes(ANCIENT_SITES_AMERICAS_ANCHOR_SLUG));
});
