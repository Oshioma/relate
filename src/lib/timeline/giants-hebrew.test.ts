import { test } from "node:test";
import assert from "node:assert/strict";

import {
  GIANTS_HEBREW_EVENTS,
  GIANTS_HEBREW_SOURCES,
  GIANTS_HEBREW_LINKS,
  GIANTS_HEBREW_ANCHOR_SLUG,
} from "./giants-hebrew-seed";
import {
  DATING_METHODS,
  CLAIM_VIEWPOINTS,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
  EVENT_RELATIONS,
  DATE_CONVENTIONS,
  TIMELINE_CATEGORIES,
} from "./taxonomy";

const CLAIMS = GIANTS_HEBREW_EVENTS.flatMap((event) =>
  event.claims.map((claim) => ({ slug: event.slug, claim }))
);
const keys = (list: readonly { key: string }[]) => new Set(list.map((entry) => entry.key));
const byslug = (slug: string) => {
  const found = GIANTS_HEBREW_EVENTS.find((event) => event.slug === slug);
  assert.ok(found, `no record ${slug}`);
  return found!;
};
const textOf = (slug: string) => {
  const event = byslug(slug);
  return [
    event.summary,
    event.description,
    event.eventTypeNote ?? "",
    ...event.claims.map((claim) => `${claim.evidence} ${claim.notes ?? ""}`),
  ].join("\n");
};

/** The four records whose only evidence is a text. */
const TEXTS = ["nephilim-genesis", "watchers-book-of-enoch", "book-of-giants", "goliath-of-gath"];

test("every vocabulary key is real", () => {
  const methods = keys(DATING_METHODS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const sourceTypes = keys(TIMELINE_SOURCE_TYPES);
  const relations = keys(EVENT_RELATIONS);
  const conventions = keys(DATE_CONVENTIONS);
  const categories = keys(TIMELINE_CATEGORIES);

  for (const event of GIANTS_HEBREW_EVENTS) {
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: eventType ${event.eventType}`);
    assert.ok(categories.has(event.category), `${event.slug}: category ${event.category}`);
    for (const claim of event.claims) {
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: datingMethod ${claim.datingMethod}`);
      assert.ok(viewpoints.has(claim.chronology), `${event.slug}: chronology ${claim.chronology}`);
      if (claim.dateConvention) {
        assert.ok(conventions.has(claim.dateConvention), `${event.slug}: dateConvention ${claim.dateConvention}`);
      }
    }
  }
  for (const source of GIANTS_HEBREW_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType ?? "other"), `${source.key}: sourceType ${source.sourceType}`);
  }
  for (const link of GIANTS_HEBREW_LINKS) {
    assert.ok(relations.has(link.relation), `link ${link.from}→${link.to}: relation ${link.relation}`);
  }
});

// ---------------------------------------------------------------------------
// THE FOUR KINDS OF DATE, KEPT APART
//
// "When were there giants" hides four questions. The whole dataset fails if any
// claim lets two of them be read as one.
// ---------------------------------------------------------------------------

test("every claim says which of the four questions it answers", () => {
  // Narrative position, composition, manuscript, or a real creature. The
  // subject line has to make that legible without reading the evidence.
  const answers = /\b(story|narrative|composed|composition|written|copy|manuscript|species|died out|how big|underlies|reading|creation)\b/i;
  for (const { slug, claim } of CLAIMS) {
    assert.ok((claim.whatIsDated ?? "").trim().length > 10, `${slug}: whatIsDated missing or thin`);
    assert.match(
      claim.whatIsDated ?? "",
      answers,
      `${slug}: "${claim.whatIsDated}" does not say which kind of date it is`
    );
  }
});

test("a narrative position with no year is seeded with no year", () => {
  // "Before the Flood" is a position in a story. The schema can hold a claim
  // that places nothing on the axis, and this is exactly what that is for —
  // inventing a BCE date here is the single most likely corruption of this
  // record.
  const claim = byslug("nephilim-genesis").claims.find((c) => c.startYear == null);
  assert.ok(claim, "the narrative claim is missing");
  assert.equal(claim!.startYear, undefined, "a narrative position has been given a year");
  assert.equal(claim!.endYear, undefined, "a narrative position has been given a range");
  assert.match(claim!.evidence, /WHAT IS DATED: nothing on the calendar/i, "does not say it places nothing");
  assert.match(
    `${claim!.evidence} ${claim!.notes ?? ""}`,
    /requires a chronology|separate claim/i,
    "does not say that turning it into a number needs a separate, named chronology"
  );
});

test("a claim with no year uses a temporal type the database actually permits", () => {
  // THE DATABASE HAS A CHECK CONSTRAINT AND THE TEST SUITE DID NOT.
  // timeline_date_claims_start_or_positionless allows a null start_year only
  // alongside one of these six types. A claim typed "before_event" with no year
  // typechecks, passes every vocabulary test, and is then rejected outright at
  // seed time — which is the silent-failure class this dataset keeps guarding
  // against, arriving from a direction nothing was watching.
  const POSITIONLESS_OK = new Set(["cyclic", "eternal", "no_beginning", "primordial", "previous_world", "unknown"]);
  for (const { slug, claim } of CLAIMS) {
    if (claim.startYear != null) continue;
    assert.ok(
      claim.temporalClaimType && POSITIONLESS_OK.has(claim.temporalClaimType),
      `${slug}: a claim with no year is typed "${claim.temporalClaimType}", which the database will reject`
    );
  }
});

test("a calculated chronology is filed as a calculation, by a named person", () => {
  const claim = byslug("nephilim-genesis").claims.find((c) => c.datingMethod === "genealogy");
  assert.ok(claim, "no calculated chronology");
  assert.equal(claim!.temporalClaimType, "calculated_date");
  assert.equal(claim!.sourceKey, "ussher1650", "not sourced to the chronologer's own work");
  assert.match(claim!.evidence, /Ussher/, "the claimant is not named in the evidence");
  assert.match(claim!.evidence, /Genesis 5 and 11|genealog/i, "the method is not stated");
  // And it must not be presented as dating the Nephilim themselves.
  assert.match(
    claim!.evidence,
    /WHAT IT DOES NOT ESTABLISH[^]*Nephilim/i,
    "does not say the calculation supplies a frame rather than a date for the beings"
  );
});

test("composition and manuscript dates are separate claims, and the manuscript is the measured one", () => {
  const enoch = byslug("watchers-book-of-enoch");
  const composition = enoch.claims.find((c) => /composed/i.test(c.originalDateText));
  const manuscript = enoch.claims.find((c) => c.datingMethod === "stylistic_comparison");
  assert.ok(composition && manuscript, "the two dates are not both present");
  assert.notEqual(composition!.whatIsDated, manuscript!.whatIsDated, "they claim the same subject");
  assert.match(manuscript!.evidence, /palaeograph/i, "the manuscript date does not say how it was measured");
  assert.match(
    `${manuscript!.evidence} ${manuscript!.notes ?? ""}`,
    /latest-possible|says nothing about|cannot show how much earlier/i,
    "does not say a copy gives a latest-possible date and no earliest"
  );
  // The copy cannot be older than the composition is argued to be.
  assert.ok(
    (manuscript!.startYear ?? 0) >= (composition!.startYear ?? 0),
    "the manuscript is dated earlier than the composition, which is impossible"
  );
});

// ---------------------------------------------------------------------------
// GIGANTOPITHECUS IS AN APE, AND SIZE IS AN EXTRAPOLATION
// ---------------------------------------------------------------------------

test("the fossil record is described as an ape and never as a giant human", () => {
  // Checked in the OPENING BLOCK, not anywhere in the record. A reader arrives
  // at a dataset called "giants" expecting a giant human, and the correction has
  // to be in the first thing they read — an earlier version of this test
  // searched the whole record and so passed one whose opening block had been
  // stripped, because a later paragraph still happened to say it.
  const opening = byslug(GIANTS_HEBREW_ANCHOR_SLUG).description.slice(0, 400);
  assert.match(opening, /\bape\b/i, "the opening block never says what kind of animal it was");
  assert.match(
    opening,
    /not a giant human|NOT a giant human|giant HUMAN: none/i,
    "the opening block does not rule out the reading a reader is most likely to arrive with"
  );
  assert.match(textOf(GIANTS_HEBREW_ANCHOR_SLUG), /orangutan/i, "does not give its actual relationships");
});

test("the size figure is carried as an estimate from teeth, not as a measurement", () => {
  const claim = byslug(GIANTS_HEBREW_ANCHOR_SLUG).claims.find((c) => c.datingMethod === "estimate");
  assert.ok(claim, "the size question has no claim, so it can be mistaken for a measured fact");
  assert.match(claim!.evidence, /WHAT IS DATED: nothing/, "the size claim presents itself as a date");
  assert.match(
    `${claim!.evidence} ${claim!.notes ?? ""}`,
    /no postcranial|extrapolat|calculated/i,
    "does not say the figure is extrapolated"
  );
  assert.match(textOf(GIANTS_HEBREW_ANCHOR_SLUG), /no postcranial bones|NO POSTCRANIAL BONES/i, "the gap in the record is not stated");
});

test("the proposed link to modern traditions is a claim, and says what would change it", () => {
  const claim = byslug(GIANTS_HEBREW_ANCHOR_SLUG).claims.find((c) => c.chronology === "alternative");
  assert.ok(claim, "the proposed connection is missing, which would read as suppressing it");
  assert.equal(claim!.temporalClaimType, "proposed_correlation");
  assert.match(claim!.evidence, /WHAT IS DATED: nothing/, "a proposal presented as a date");
  assert.match(
    `${claim!.evidence} ${claim!.notes ?? ""}`,
    /what would change|would weaken|remains substantially later/i,
    "does not say what evidence would change the position"
  );
  // And it must not be dismissed.
  assert.match(
    claim!.evidence,
    /ABSENCE OF ACCEPTED EVIDENCE IS NOT PROOF|not claim it is/i,
    "absence of evidence is being presented as proof of absence"
  );
});

// ---------------------------------------------------------------------------
// THE LANGUAGE RULES FROM THE BRIEF
// ---------------------------------------------------------------------------

test("nothing asserts that giants existed, and nothing asserts they did not", () => {
  for (const event of GIANTS_HEBREW_EVENTS) {
    const text = textOf(event.slug);
    // The forbidden assertion in both directions.
    // "the Book of Giants existed by about 100 BCE" is a statement about a
    // manuscript, not about giants. The first version of this test could not
    // tell the two apart, so the title is excluded explicitly.
    assert.doesNotMatch(
      text,
      /(?<!Book of )giants (existed|were real|did exist)\b(?! only| as)/i,
      `${event.slug}: asserts giants existed`
    );
    assert.doesNotMatch(
      text,
      /giants never existed|proves? (that )?giants|myth is false|never were any giants/i,
      `${event.slug}: asserts giants never existed`
    );
  }
});

test("every record answers 'what kind of record is this' where a reader meets it", () => {
  for (const event of GIANTS_HEBREW_EVENTS) {
    assert.match(
      event.description,
      /WHAT KIND OF RECORD IS THIS\?/,
      `${event.slug}: the description does not open by saying what kind of record it is`
    );
  }
});

test("every record offers questions rather than a conclusion", () => {
  for (const event of GIANTS_HEBREW_EVENTS) {
    if (event.slug === "book-of-giants" || event.slug === "watchers-book-of-enoch") {
      // Shorter records still carry questions; checked the same way.
    }
    assert.match(
      event.description,
      /THINGS TO ASK:/,
      `${event.slug}: no critical-thinking questions for a student`
    );
  }
});

test("a text-only record does not claim physical remains", () => {
  for (const slug of TEXTS) {
    const text = textOf(slug);
    assert.match(
      text,
      /Physical remains[^.\n]*: ?(none|no\b)/i,
      `${slug}: does not state that no physical remains are involved`
    );
    for (const claim of byslug(slug).claims) {
      assert.notEqual(
        claim.datingMethod,
        "radiometric",
        `${slug}: a text record carrying a radiometric date`
      );
      assert.notEqual(claim.datingMethod, "radiocarbon", `${slug}: a text record carrying a radiocarbon date`);
    }
  }
});

test("both readings of Goliath's height are present, with the manuscript behind each", () => {
  const text = textOf("goliath-of-gath");
  assert.match(text, /six cubits and a span/i, "the longer reading is missing");
  assert.match(text, /four cubits and a span/i, "the shorter reading is missing");
  assert.match(text, /4QSam/i, "the oldest Hebrew witness is not named");
  assert.match(text, /Masoretic/i, "the authoritative tradition is not named");
  // The record must not pick one.
  assert.equal(byslug("goliath-of-gath").claims.length, 2, "one of the two readings has no claim");
  assert.match(
    text,
    /does not pick one|record does not|both readings are/i,
    "nothing says the record declines to choose"
  );
  // And it must not make him ordinary.
  assert.match(text, /still remarkable|very tall man|extraordinary/i, "implies the shorter reading makes him unremarkable");
});

// ---------------------------------------------------------------------------
// THE HOUSE RULES
// ---------------------------------------------------------------------------

test("every claim says what it dates, by what method, and what it does not establish", () => {
  for (const { slug, claim } of CLAIMS) {
    assert.match(claim.evidence, /WHAT IS DATED/, `${slug}: no statement of what is dated`);
    assert.match(claim.evidence, /DATING METHOD/, `${slug}: no dating method in the evidence`);
    assert.match(claim.evidence, /WHAT IT DOES NOT ESTABLISH/, `${slug}: no statement of limits`);
  }
});

test("nothing carries a confidence score or a verdict label", () => {
  const score = /\b(confidence|credibility|reliability|plausibility|truth)\s*(score|rating|level|%)|95% reliable/i;
  const verdict = /\b(debunked|disproven|proven true|proved false|hoax|fraud)\b/i;
  for (const event of GIANTS_HEBREW_EVENTS) {
    const text = textOf(event.slug);
    assert.doesNotMatch(text, score, `${event.slug}: a score`);
    assert.doesNotMatch(text, verdict, `${event.slug}: a verdict label`);
  }
});

test("every years-ago figure is converted from before-present rather than copied", () => {
  for (const { slug, claim } of CLAIMS) {
    if (claim.dateConvention !== "before_present") continue;
    const figures = [
      ...claim.originalDateText.matchAll(
        /([\d,]{3,})(?:\s*(?:to|and|–|-)\s*([\d,]{3,}))?\s*years?\s*(?:BP|before present|ago)/gi
      ),
    ]
      .flatMap((found) => [found[1], found[2]])
      .filter((value): value is string => Boolean(value))
      .map((value) => Number(value.replace(/,/g, "")));
    if (figures.length === 0) continue;
    assert.equal(
      claim.startYear,
      1950 - Math.max(...figures),
      `${slug}: text says ${Math.max(...figures)} years ago, so startYear should be ${1950 - Math.max(...figures)}`
    );
  }
});

test("every BCE year is stored in astronomical numbering", () => {
  for (const { slug, claim } of CLAIMS) {
    if (claim.dateConvention === "before_present") continue;
    for (const [field, year] of [["startYear", claim.startYear], ["endYear", claim.endYear]] as const) {
      if (year == null || year >= 0) continue;
      if (!/BCE?\b/i.test(claim.originalDateText)) continue;
      const figures = [...claim.originalDateText.matchAll(/\b([\d,]{3,})\b/g)].map((found) =>
        Number(found[1].replace(/,/g, ""))
      );
      assert.ok(
        !figures.includes(-year),
        `${slug}: ${field} is ${year} and the text says ${-year} BCE — astronomical numbering makes that ${1 - -year}`
      );
    }
  }
});

test("a figure that could not be traced is flagged rather than asserted", () => {
  // Named claims, not a count. Counting let a flag be removed from one claim
  // while the total stayed above the threshold, which is the same failure mode
  // as a guard that searches a whole record.
  const flaggedOn = (slug: string, match: RegExp) => {
    const claim = byslug(slug).claims.find((c) => match.test(c.originalDateText));
    assert.ok(claim, `${slug}: the claim needing a verification flag is missing`);
    assert.match(
      `${claim!.evidence} ${claim!.notes ?? ""}`,
      /NEEDS SOURCE VERIFICATION/,
      `${slug}: an untraced figure is asserted rather than flagged`
    );
  };
  flaggedOn("nephilim-genesis", /composition of the Pentateuchal text/);
  flaggedOn("goliath-of-gath", /Masoretic tradition/);
  // And Ussher's widely-repeated flood year must not be seeded as a number
  // anywhere, on any claim.
  for (const { slug, claim } of CLAIMS) {
    for (const year of [claim.startYear, claim.endYear]) {
      assert.notEqual(year, -2347, `${slug}: the untraced flood year has been seeded`);
    }
  }
});

test("no two claims on a record share their date text, because citations are matched by it", () => {
  for (const event of GIANTS_HEBREW_EVENTS) {
    const texts = event.claims.map((claim) => claim.originalDateText);
    for (const text of texts) assert.ok(text && text.trim().length > 0, `${event.slug}: a claim with no date text`);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: two claims share their date text`);
  }
});

test("every claim and citation points at a source that exists, and every source is used", () => {
  const known = new Set(GIANTS_HEBREW_SOURCES.map((source) => source.key));
  const used = new Set<string>();
  for (const { slug, claim } of CLAIMS) {
    if (claim.sourceKey) {
      assert.ok(known.has(claim.sourceKey), `${slug}: unknown source ${claim.sourceKey}`);
      used.add(claim.sourceKey);
    }
    for (const citation of claim.citations ?? []) {
      assert.ok(known.has(citation.sourceKey), `${slug}: unknown cited source ${citation.sourceKey}`);
      used.add(citation.sourceKey);
    }
  }
  for (const source of GIANTS_HEBREW_SOURCES) {
    assert.ok(used.has(source.key), `${source.key}: seeded but never cited`);
  }
});

test("no source is cited without saying what it is cited for", () => {
  for (const source of GIANTS_HEBREW_SOURCES) {
    assert.ok(source.notes && source.notes.trim().length > 50, `${source.key}: notes missing or too thin`);
  }
});

test("every record is uniquely slugged and every link joins records that exist", () => {
  const slugs = GIANTS_HEBREW_EVENTS.map((event) => event.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  assert.ok(slugs.includes(GIANTS_HEBREW_ANCHOR_SLUG));
  for (const link of GIANTS_HEBREW_LINKS) {
    assert.ok(new Set(slugs).has(link.from), `link from unknown ${link.from}`);
    assert.ok(new Set(slugs).has(link.to), `link to unknown ${link.to}`);
    assert.ok(link.note && link.note.trim().length > 20, `link ${link.from}→${link.to}: no note`);
  }
});
