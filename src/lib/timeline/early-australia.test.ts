import { test } from "node:test";
import assert from "node:assert/strict";

import {
  EARLY_AUSTRALIA_EVENTS,
  EARLY_AUSTRALIA_SOURCES,
  EARLY_AUSTRALIA_LINKS,
  EARLY_AUSTRALIA_ANCHOR_SLUG,
} from "./early-australia-seed";
import {
  DATING_METHODS,
  CLAIM_VIEWPOINTS,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
  EVENT_RELATIONS,
  DATE_CONVENTIONS,
} from "./taxonomy";

const CLAIMS = EARLY_AUSTRALIA_EVENTS.flatMap((event) =>
  event.claims.map((claim) => ({ slug: event.slug, claim }))
);
const keys = (list: readonly { key: string }[]) => new Set(list.map((entry) => entry.key));

const byslug = (slug: string) => {
  const found = EARLY_AUSTRALIA_EVENTS.find((event) => event.slug === slug);
  assert.ok(found, `no record ${slug}`);
  return found!;
};

// ---------------------------------------------------------------------------
// VOCABULARY. Every one of these is typed as `string`, so an invented key
// typechecks and is then rejected silently at seed time.
// ---------------------------------------------------------------------------

test("every vocabulary key on every claim is real", () => {
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
    assert.ok(precisions.has(claim.datePrecision), `${slug}: "${claim.datePrecision}" is not a date precision`);
    if (claim.dateConvention) {
      assert.ok(conventions.has(claim.dateConvention), `${slug}: "${claim.dateConvention}" is not a date convention`);
    }
  }
});

test("event types, source types and link relations are all real keys", () => {
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  for (const event of EARLY_AUSTRALIA_EVENTS) {
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: "${event.eventType}" is not an event type`);
  }
  const sourceTypes = keys(TIMELINE_SOURCE_TYPES);
  for (const source of EARLY_AUSTRALIA_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType), `${source.key}: "${source.sourceType}" is not a source type`);
  }
  const relations = keys(EVENT_RELATIONS);
  const slugs = new Set(EARLY_AUSTRALIA_EVENTS.map((event) => event.slug));
  for (const link of EARLY_AUSTRALIA_LINKS) {
    assert.ok(relations.has(link.relation), `"${link.relation}" is not an event relation`);
    assert.ok(slugs.has(link.from) && slugs.has(link.to), `link between unknown records: ${link.from} → ${link.to}`);
  }
});

// ---------------------------------------------------------------------------
// A YEARS-AGO FIGURE IS NOT A CALENDAR YEAR
// ---------------------------------------------------------------------------

test("every deep date records the convention it was expressed in", () => {
  // "65,000 years ago" and "65,000 BCE" are 1,950 years apart. At this depth
  // that is inside the error, but the convention is part of the claim and a
  // row that records only the answer has thrown away how it was reached.
  for (const { slug, claim } of CLAIMS) {
    assert.equal(claim.dateConvention, "before_present", `${slug}: no date convention on a years-ago figure`);
    assert.equal(claim.conventionReferenceYear, 1950, `${slug}: BP figure without the 1950 reference`);
  }
});

test("the stored years are converted from BP, not copied from it", () => {
  // The failure this catches: storing -65000 for "65,000 BP", which is the
  // same arithmetic slip that put Nunn and Reid's 13,070 cal BP at "11,120 BC"
  // in their own paper. 65,000 BP is 1950 - 65000 = -63050.
  const madjedbebe = byslug(EARLY_AUSTRALIA_ANCHOR_SLUG);
  const primary = madjedbebe.claims.find((claim) => claim.originalDateText.includes("65,000 years ago"));
  assert.ok(primary);
  assert.equal(primary!.startYear, 1950 - 65000);
  const moyjil = byslug("moyjil-possible-early-activity");
  const deposit = moyjil.claims[0];
  assert.equal(deposit.endYear, 1950 - 120000, "the 120 ka end of the Moyjil range is not converted from BP");
  assert.equal(deposit.startYear, 1950 - 125000, "the 125 ka start of the Moyjil range is not converted from BP");
});

// ---------------------------------------------------------------------------
// THE THINGS THE BRIEF FORBIDS
// ---------------------------------------------------------------------------

test("nothing anywhere carries a confidence or credibility score", () => {
  const banned = /\b(confidence|credibility|reliability|truth|plausibility)\s*(score|rating|%|percent|level)|(\b\d{1,3}\s*%\s*(reliable|certain|confident))/i;
  for (const event of EARLY_AUSTRALIA_EVENTS) {
    assert.doesNotMatch(event.description, banned, `${event.slug}: description carries a score`);
    assert.doesNotMatch(event.summary, banned, `${event.slug}: summary carries a score`);
    for (const claim of event.claims) {
      assert.doesNotMatch(claim.evidence, banned, `${event.slug}: evidence carries a score`);
      assert.doesNotMatch(claim.notes ?? "", banned, `${event.slug}: notes carry a score`);
    }
  }
});

test("no record states that humans definitely lived in Australia 120,000 years ago", () => {
  // The single most important thing this dataset must not say, and the exact
  // sentence the popular coverage of Moyjil produces.
  const moyjil = byslug("moyjil-possible-early-activity");
  const text = `${moyjil.summary} ${moyjil.description} ${moyjil.claims.map((c) => `${c.evidence} ${c.notes ?? ""}`).join(" ")}`;
  // The phrase is allowed to appear — the brief asks for the contrast to be
  // drawn in as many words — but ONLY inside an explicit denial. So every
  // occurrence has to be preceded by one, which is what a naive
  // doesNotMatch could not tell apart and a reader always can.
  const forbidden = /humans? (definitely |certainly )?lived in Australia 120,000|people lived in Australia 120,000|proves? humans/gi;
  for (const match of text.matchAll(forbidden)) {
    const runUp = text.slice(Math.max(0, (match.index ?? 0) - 60), match.index);
    assert.match(
      runUp,
      /\bnot\b|\bNOT\b|rather than|never/,
      `the Moyjil record asserts human presence: "...${runUp.slice(-40)}${match[0]}"`
    );
  }
  // And it must say outright that agency is not established.
  assert.match(text, /HUMAN ACTIVITY HAS NOT BEEN ESTABLISHED|has not been established/i);
  assert.match(text, /natural processes/i, "the record does not say natural processes remain possible");
});

test("no record says the first Aboriginal Australians arrived 65,000 years ago", () => {
  for (const event of EARLY_AUSTRALIA_EVENTS) {
    const text = `${event.summary} ${event.description}`;
    assert.doesNotMatch(
      text.replace(/It is NOT '[^']*'/g, ""),
      /first Aboriginal Australians arrived|Aboriginal Australians arrived 65|arrived in Australia 65,000 years ago/i,
      `${event.slug}: states an arrival date as fact`
    );
  }
});

test("the Madjedbebe record uses the interpreted-as wording, not the arrived wording", () => {
  const record = byslug(EARLY_AUSTRALIA_ANCHOR_SLUG);
  assert.match(record.description, /interpreted as showing human occupation by approximately 65,000|interpreted as: human occupation by approximately 65,000|interpreted as showing/i);
  assert.match(record.description, /minimum age/i, "the record does not say the excavators call it a minimum");
});

// ---------------------------------------------------------------------------
// SITE ≠ DATE, AND OCCUPATION ≠ ARRIVAL
// ---------------------------------------------------------------------------

test("every claim says what it is a date FOR", () => {
  for (const { slug, claim } of CLAIMS) {
    assert.ok(claim.whatIsDated, `${slug}: "${claim.originalDateText}" does not say what it dates`);
    assert.ok((claim.whatIsDated ?? "").trim().length > 15, `${slug}: whatIsDated too thin to distinguish anything`);
  }
});

test("a record with several claims dates several different things", () => {
  for (const event of EARLY_AUSTRALIA_EVENTS) {
    if (event.claims.length < 2) continue;
    const subjects = new Set(event.claims.map((claim) => claim.whatIsDated?.trim()));
    assert.equal(
      subjects.size,
      event.claims.length,
      `${event.slug}: ${event.claims.length} claims but ${subjects.size} distinct subjects — some would stack as rivals`
    );
  }
});

test("arrival is its own record and does not simply inherit the Madjedbebe date", () => {
  const arrival = byslug("first-arrival-in-sahul");
  assert.notEqual(arrival.slug, EARLY_AUSTRALIA_ANCHOR_SLUG);
  // The Madjedbebe-derived claim on the arrival record must be framed as a
  // constraint, not as the date of arrival.
  const fromSite = arrival.claims.find((claim) => claim.sourceKey === "clarkson2017");
  assert.ok(fromSite, "the arrival record should carry the archaeological constraint");
  assert.match(fromSite!.whatIsDated ?? "", /latest|minimum|constrain/i);
  assert.match(fromSite!.evidence, /WHAT IS DATED: not arrival|not arrival/i);
  assert.match(arrival.description, /MINIMUM CONSTRAINT ON PRESENCE|minimum/i);
});

test("the arrival record carries genuinely competing models, from different kinds of evidence", () => {
  const arrival = byslug("first-arrival-in-sahul");
  const methods = new Set(arrival.claims.map((claim) => claim.datingMethod));
  assert.ok(methods.has("genetic"), "no genetic model on the arrival record");
  assert.ok(methods.size > 1, "the arrival record should not rest on one kind of evidence");
  // And they must actually disagree, or there is no reason for two claims.
  const years = arrival.claims.map((claim) => claim.startYear ?? 0);
  assert.ok(Math.max(...years) - Math.min(...years) > 10000, "the two models should be far apart, as the sources are");
});

test("the Moyjil interpretation is stored as a hypothesis, not as archaeology", () => {
  const moyjil = byslug("moyjil-possible-early-activity");
  const human = moyjil.claims.find((claim) => (claim.whatIsDated ?? "").startsWith("Whether people"));
  assert.ok(human, "the human-agency claim is missing");
  assert.equal(human!.chronology, "hypothesis");
  assert.equal(human!.datingMethod, "claimant_inference");
  // The deposit claims must NOT be filed as hypothesis — the dating is not
  // what is in doubt, and blurring the two would misrepresent the researchers.
  const deposit = moyjil.claims.find((claim) => (claim.whatIsDated ?? "").startsWith("The shell bed"));
  assert.ok(deposit);
  assert.equal(deposit!.chronology, "geological");
});

test("the two Moyjil geological claims date different materials", () => {
  // One site, several ages, several materials, several different things —
  // which is exactly what gets collapsed in popular accounts.
  const moyjil = byslug("moyjil-possible-early-activity");
  const geological = moyjil.claims.filter((claim) => claim.chronology === "geological");
  assert.equal(geological.length, 2);
  assert.notEqual(geological[0].datingMethod, geological[1].datingMethod);
  assert.notEqual(geological[0].whatIsDated, geological[1].whatIsDated);
});

// ---------------------------------------------------------------------------
// EVIDENCE AND SOURCES
// ---------------------------------------------------------------------------

test("every claim names what was dated, the method, and what it does not establish", () => {
  for (const { slug, claim } of CLAIMS) {
    assert.match(claim.evidence, /WHAT IS DATED/, `${slug}: evidence does not say what is dated`);
    assert.match(claim.evidence, /DATING METHOD|METHOD:/, `${slug}: evidence does not name the method`);
    assert.match(
      claim.evidence,
      /DOES NOT ESTABLISH|NOT ESTABLISH/,
      `${slug}: evidence never says what the measurement does not establish`
    );
  }
});

test("every claim and citation points at a source that exists, and no date rests on Wikipedia", () => {
  const byKey = new Map(EARLY_AUSTRALIA_SOURCES.map((source) => [source.key, source]));
  for (const { slug, claim } of CLAIMS) {
    assert.ok(claim.sourceKey, `${slug}: a claim with no source`);
    const source = byKey.get(claim.sourceKey!);
    assert.ok(source, `${slug}: unknown source ${claim.sourceKey}`);
    assert.notEqual(source!.sourceType, "wikipedia", `${slug}: a date sourced to Wikipedia`);
    for (const citation of claim.citations ?? []) {
      assert.ok(byKey.has(citation.sourceKey), `${slug}: unknown cited source ${citation.sourceKey}`);
    }
  }
});

test("every source is peer-reviewed research, and carries enough to find it again", () => {
  // The brief's sourcing order: original peer-reviewed research first.
  for (const source of EARLY_AUSTRALIA_SOURCES) {
    assert.equal(source.sourceType, "academic_paper", `${source.key}: not an academic paper`);
    assert.ok(source.publishedYear, `${source.key}: no publication year`);
    assert.ok(source.workTitle, `${source.key}: no journal named`);
    assert.ok(source.reference, `${source.key}: no volume, pages or DOI`);
    assert.ok(source.notes.trim().length > 60, `${source.key}: notes do not say what it is cited for`);
  }
});

test("the disputing source is attached to the claim it disputes, in both directions", () => {
  const madjedbebe = byslug(EARLY_AUSTRALIA_ANCHOR_SLUG);
  const primary = madjedbebe.claims.find((claim) => claim.sourceKey === "clarkson2017")!;
  const relations = (primary.citations ?? []).map((citation) => citation.relation);
  assert.ok(relations.includes("disputes"), "the 65 ka claim carries no published objection");
  assert.ok(relations.includes("supports"), "the 65 ka claim carries no reply to the objection");

  const objection = madjedbebe.claims.find((claim) => claim.sourceKey === "oconnell2018")!;
  assert.ok(
    (objection.citations ?? []).some((citation) => citation.relation === "disputes"),
    "the objection carries no answer from the excavators"
  );
});

test("the plant-food range is not presented as a rival start date", () => {
  // 65,000–53,000 is a span of occupation. Reading it as a more conservative
  // version of the 65,000 figure would be a misreading of both, and the brief
  // says not to manufacture a disagreement the sources do not support.
  const madjedbebe = byslug(EARLY_AUSTRALIA_ANCHOR_SLUG);
  const florin = madjedbebe.claims.find((claim) => claim.sourceKey === "florin2020")!;
  assert.match(florin.evidence, /not a rival|RANGE OF OCCUPATION/i);
  assert.notEqual(florin.whatIsDated, madjedbebe.claims.find((c) => c.sourceKey === "clarkson2017")!.whatIsDated);
});

// ---------------------------------------------------------------------------
// TERMINOLOGY
// ---------------------------------------------------------------------------

test("no record implies archaeology dates the beginning of Aboriginal culture or identity", () => {
  const all = EARLY_AUSTRALIA_EVENTS.map((event) => `${event.summary} ${event.description}`).join(" ");
  assert.doesNotMatch(all, /beginning of Aboriginal (culture|identity|history)/i);
  // And at least one record says so explicitly, so the point is on the page
  // and not only in a test.
  assert.match(all, /not about when Aboriginal cultures, laws or identities began|do not date the beginning/i);
});

test("the comparison between Moyjil and Madjedbebe is on the timeline, not left to the reader", () => {
  const link = EARLY_AUSTRALIA_LINKS.find(
    (entry) => entry.from === "moyjil-possible-early-activity" && entry.to === EARLY_AUSTRALIA_ANCHOR_SLUG
  );
  assert.ok(link, "no link between the two site records");
  assert.match(link!.note, /NOT two measurements of one thing|not two measurements/i);
  assert.match(link!.note, /55,000/, "the comparison does not state the size of the gap");
});

test("every record is uniquely slugged and the anchor is among them", () => {
  const slugs = EARLY_AUSTRALIA_EVENTS.map((event) => event.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  assert.ok(slugs.includes(EARLY_AUSTRALIA_ANCHOR_SLUG));
});
