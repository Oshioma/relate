import { test } from "node:test";
import assert from "node:assert/strict";

import {
  GIANTS_MESOPOTAMIA_EVENTS,
  GIANTS_MESOPOTAMIA_SOURCES,
  GIANTS_MESOPOTAMIA_LINKS,
  GIANTS_MESOPOTAMIA_TRACK,
  GIANTS_MESOPOTAMIA_ANCHOR_SLUG,
} from "./giants-mesopotamia-seed";
import { GIANTS_HEBREW_EVENTS, GIANTS_HEBREW_TRACK } from "./giants-hebrew-seed";
import { GIANTS_GREEK_EVENTS } from "./giants-greek-seed";
import { FLOOD_MESOPOTAMIA_EVENTS } from "./flood-mesopotamia-seed";
import {
  DATING_METHODS,
  CLAIM_VIEWPOINTS,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
  EVENT_RELATIONS,
  DATE_CONVENTIONS,
  TIMELINE_CATEGORIES,
  TEMPORAL_CLAIM_TYPES,
} from "./taxonomy";

// ---------------------------------------------------------------------------
// GIANTS, PART THREE — where the word comes from.
//
// This tranche's particular risk is the opposite of the last one's. There, the
// danger was a favourite explanation spreading. Here it is that the four
// records make FOUR DIFFERENT KINDS OF CLAIM and look alike on the page:
//
//   Gilgamesh — the text gives a measurement.
//   Ullikummi — the text describes something enormous.
//   Humbaba   — the text describes a monster and never mentions size.
//   Nimrod    — the text says none of it, and a translator supplied the word.
//
// Every guard below exists to stop one of those four turning into another.
// ---------------------------------------------------------------------------

const CLAIMS = GIANTS_MESOPOTAMIA_EVENTS.flatMap((event) =>
  event.claims.map((claim) => ({ slug: event.slug, claim }))
);
const keys = (list: readonly { key: string }[]) => new Set(list.map((entry) => entry.key));
const byslug = (slug: string) => {
  const found = GIANTS_MESOPOTAMIA_EVENTS.find((event) => event.slug === slug);
  assert.ok(found, `no record ${slug}`);
  return found!;
};
/** The description ALONE — a guard over a whole record passes a gutted one. */
const descriptionOf = (slug: string) => byslug(slug).description;
const sourceByKey = (key: string) => {
  const found = GIANTS_MESOPOTAMIA_SOURCES.find((source) => source.key === key);
  assert.ok(found, `no source ${key}`);
  return found!;
};
const claimWhere = (slug: string, match: RegExp) => {
  const found = byslug(slug).claims.find((claim) => match.test(claim.originalDateText));
  assert.ok(found, `${slug}: no claim whose originalDateText matches ${match}`);
  return found!;
};

// ---------------------------------------------------------------------------
// THE SILENT FAILURES
// ---------------------------------------------------------------------------

test("every vocabulary key is real", () => {
  const methods = keys(DATING_METHODS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const sourceTypes = keys(TIMELINE_SOURCE_TYPES);
  const relations = keys(EVENT_RELATIONS);
  const conventions = keys(DATE_CONVENTIONS);
  const categories = keys(TIMELINE_CATEGORIES);
  const claimTypes = keys(TEMPORAL_CLAIM_TYPES);
  const precisions = new Set([
    "day", "month", "year", "decade", "century", "millennium",
    "thousand_years", "million_years", "billion_years",
  ]);

  for (const event of GIANTS_MESOPOTAMIA_EVENTS) {
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: eventType ${event.eventType}`);
    assert.ok(categories.has(event.category), `${event.slug}: category ${event.category}`);
    for (const claim of event.claims) {
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: datingMethod ${claim.datingMethod}`);
      assert.ok(viewpoints.has(claim.chronology), `${event.slug}: chronology ${claim.chronology}`);
      assert.ok(precisions.has(claim.datePrecision), `${event.slug}: datePrecision ${claim.datePrecision}`);
      if (claim.temporalClaimType) {
        assert.ok(claimTypes.has(claim.temporalClaimType), `${event.slug}: temporalClaimType ${claim.temporalClaimType}`);
      }
      if (claim.dateConvention) {
        assert.ok(conventions.has(claim.dateConvention), `${event.slug}: dateConvention ${claim.dateConvention}`);
      }
    }
  }
  for (const source of GIANTS_MESOPOTAMIA_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType), `${source.key}: sourceType ${source.sourceType}`);
  }
  for (const link of GIANTS_MESOPOTAMIA_LINKS) {
    assert.ok(relations.has(link.relation), `link ${link.from}→${link.to}: relation ${link.relation}`);
    if (link.viewpoint) {
      assert.ok(viewpoints.has(link.viewpoint), `link ${link.from}→${link.to}: viewpoint ${link.viewpoint}`);
    }
  }
});

test("every link points at a record that exists, in this dataset or another", () => {
  // Three of these edges reach OTHER datasets — the flood tranche's Gilgamesh
  // record, the Hebrew tranche's Nephilim, the Greek tranche's Gigantes. A
  // typo in any of them is not an error: syncSeedLinks looks the slug up, finds
  // nothing, and silently writes no edge.
  const known = new Set([
    ...GIANTS_MESOPOTAMIA_EVENTS.map((event) => event.slug),
    ...GIANTS_HEBREW_EVENTS.map((event) => event.slug),
    ...GIANTS_GREEK_EVENTS.map((event) => event.slug),
    ...FLOOD_MESOPOTAMIA_EVENTS.map((event) => event.slug),
  ]);
  for (const link of GIANTS_MESOPOTAMIA_LINKS) {
    assert.ok(known.has(link.from), `link from ${link.from}: no such record anywhere`);
    assert.ok(known.has(link.to), `link to ${link.to}: no such record anywhere`);
  }
  // And the cross-dataset ones are the point of the tranche, so they are named.
  for (const slug of ["utnapishtim-gilgamesh-flood", "nephilim-genesis", "gigantes-gigantomachy"]) {
    assert.ok(
      GIANTS_MESOPOTAMIA_LINKS.some((link) => link.to === slug),
      `the edge to ${slug} is missing — this record is meant to be linked, not duplicated`
    );
  }
});

test("every source key referenced exists, and every source is used", () => {
  const declared = new Set(GIANTS_MESOPOTAMIA_SOURCES.map((source) => source.key));
  const used = new Set<string>();
  for (const { slug, claim } of CLAIMS) {
    if (claim.sourceKey) {
      assert.ok(declared.has(claim.sourceKey), `${slug}: claim cites unknown source ${claim.sourceKey}`);
      used.add(claim.sourceKey);
    }
    for (const citation of claim.citations ?? []) {
      assert.ok(declared.has(citation.sourceKey), `${slug}: citation names unknown source ${citation.sourceKey}`);
      used.add(citation.sourceKey);
    }
  }
  for (const link of GIANTS_MESOPOTAMIA_LINKS) {
    if (link.sourceKey) {
      assert.ok(declared.has(link.sourceKey), `link ${link.from}→${link.to}: unknown source ${link.sourceKey}`);
      used.add(link.sourceKey);
    }
  }
  for (const key of declared) assert.ok(used.has(key), `source ${key} is seeded but nothing cites it`);
});

test("slugs are unique against both earlier giants tranches", () => {
  const slugs = GIANTS_MESOPOTAMIA_EVENTS.map((event) => event.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug inside this dataset");
  const taken = new Set([
    ...GIANTS_HEBREW_EVENTS.map((event) => event.slug),
    ...GIANTS_GREEK_EVENTS.map((event) => event.slug),
    ...FLOOD_MESOPOTAMIA_EVENTS.map((event) => event.slug),
  ]);
  for (const slug of slugs) {
    assert.ok(!taken.has(slug), `${slug} already exists — seeding would skip it, not update it`);
  }
  assert.ok(slugs.includes(GIANTS_MESOPOTAMIA_ANCHOR_SLUG), "the anchor slug is not one of the records");
});

test("originalDateText is unique within each record", () => {
  for (const event of GIANTS_MESOPOTAMIA_EVENTS) {
    const texts = event.claims.map((claim) => claim.originalDateText);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: two claims share an originalDateText`);
  }
});

test("all the giants records share one lane", () => {
  assert.equal(GIANTS_MESOPOTAMIA_TRACK, GIANTS_HEBREW_TRACK);
  assert.equal(GIANTS_MESOPOTAMIA_TRACK.slug, "giants-traditions");
});

// ---------------------------------------------------------------------------
// THE ARITHMETIC
// ---------------------------------------------------------------------------

test("every BCE date in a claim's own words converts correctly", () => {
  let checked = 0;
  for (const { slug, claim } of CLAIMS) {
    const text = claim.originalDateText;
    // "and" is a range separator too: "between about 1300 and 1000 BCE" is one
    // range, and reading it as a single figure made this guard demand the wrong
    // year of correct data.
    const matches = [...text.matchAll(/(\d[\d,]*)(?:\s*(?:to|and|–|-)\s*(\d[\d,]*))?\s*BCE/g)];
    for (const match of matches) {
      const first = Number(match[1].replace(/,/g, ""));
      const second = match[2] ? Number(match[2].replace(/,/g, "")) : null;
      const earlier = second === null ? first : Math.max(first, second);
      const later = second === null ? first : Math.min(first, second);
      assert.equal(
        claim.startYear,
        1 - earlier,
        `${slug}: "${text}" — ${earlier} BCE should be stored as ${1 - earlier}, not ${claim.startYear}`
      );
      if (second !== null) {
        assert.equal(claim.endYear, 1 - later, `${slug}: "${text}" — ${later} BCE should end at ${1 - later}`);
      }
      checked++;
    }
  }
  // COUNTED FROM THE DATA rather than hardcoded. A fixed threshold is a guess
  // that goes stale the moment a claim is added or reworded — and a guess that
  // is too low silently stops guarding. Every claim that states a numeric BCE
  // figure must have been converted and checked; if the parser stops matching
  // one, the counts diverge and this fails.
  const stateABceFigure = CLAIMS.filter(
    ({ claim }) => /\d/.test(claim.originalDateText) && /BCE/.test(claim.originalDateText)
  ).length;
  assert.equal(
    checked,
    stateABceFigure,
    `${checked} BCE figures parsed but ${stateABceFigure} claims state one — the parser has stopped matching`
  );
});

test("a claim that places nothing uses a type the database permits", () => {
  const POSITIONLESS = new Set(["cyclic", "eternal", "no_beginning", "primordial", "previous_world", "unknown"]);
  let found = 0;
  for (const { slug, claim } of CLAIMS) {
    if (claim.startYear !== undefined) continue;
    found++;
    assert.ok(
      POSITIONLESS.has(claim.temporalClaimType ?? ""),
      `${slug}: no start year with temporalClaimType "${claim.temporalClaimType}" — the database will reject this row`
    );
  }
  assert.equal(found, 3, `expected three positionless claims, found ${found}`);
});

test("a range never runs backwards", () => {
  for (const { slug, claim } of CLAIMS) {
    if (claim.startYear !== undefined && claim.endYear !== undefined) {
      assert.ok(claim.endYear >= claim.startYear, `${slug}: ends before it starts`);
    }
  }
});

test("every claim says which question it answers, and what it does not establish", () => {
  for (const { slug, claim } of CLAIMS) {
    assert.ok((claim.whatIsDated ?? "").trim().length > 10, `${slug}: whatIsDated missing or thin`);
    assert.match(claim.evidence, /WHAT IS DATED:/, `${slug}: evidence does not say what is dated`);
    assert.match(claim.evidence, /DATING METHOD:/, `${slug}: evidence does not say how`);
    assert.match(claim.evidence, /WHAT IT DOES NOT ESTABLISH:/, `${slug}: evidence does not say what it does NOT establish`);
  }
});

test("records with several kinds of date give each one a distinct heading", () => {
  for (const event of GIANTS_MESOPOTAMIA_EVENTS) {
    if (event.claims.length < 2) continue;
    const headings = event.claims.map((claim) => claim.whatIsDated);
    assert.equal(new Set(headings).size, headings.length, `${event.slug}: two claims share a whatIsDated heading`);
  }
});

// ---------------------------------------------------------------------------
// THE FOUR KINDS OF CLAIM, KEPT APART
// ---------------------------------------------------------------------------

test("Gilgamesh carries BOTH readings, and neither is presented as the true one", () => {
  const description = descriptionOf(GIANTS_MESOPOTAMIA_ANCHOR_SLUG);
  assert.match(description, /ELEVEN CUBITS WAS HIS HEIGHT/, "the published reading is missing");
  assert.match(description, /triple cubit/, "the earlier reading is missing");
  const older = claimWhere(GIANTS_MESOPOTAMIA_ANCHOR_SLUG, /triple cubit/);
  assert.match(
    older.whatIsDated ?? "",
    /BEFORE the Syrian manuscript/,
    "the older reading does not say it is the earlier one"
  );
  assert.match(
    older.evidence,
    /Neither is presented as the true one/,
    "the record does not say it declines to choose between the readings"
  );
});

test("the 2007 publication is dated as a publication, not as a man's height", () => {
  const claim = claimWhere(GIANTS_MESOPOTAMIA_ANCHOR_SLUG, /published in 2007/);
  assert.equal(claim.startYear, 2007, "a modern publication should sit at its own year");
  assert.equal(claim.sourceKey, "george_2007");
  assert.match(claim.whatIsDated ?? "", /not for a man/, "the heading lets a publication date read as a person's date");
});

test("the cubit conversion is marked as soft rather than given to the centimetre", () => {
  const description = descriptionOf(GIANTS_MESOPOTAMIA_ANCHOR_SLUG);
  assert.match(description, /ancient measures varied/, "the record converts cubits without saying the unit is uncertain");
  assert.match(description, /about five and a half metres|about 5\.5 m/, "no conversion is offered at all");
});

test("Humbaba is never given a size, and the record says the texts give none", () => {
  // The whole reason this record exists: 'giant' is an addition, and a figure
  // invented here would be the same addition in the dataset's own voice.
  const event = byslug("humbaba-cedar-forest");
  const everything = [event.summary, event.description, ...event.claims.map((c) => `${c.evidence} ${c.notes ?? ""} ${c.originalDateText}`)].join("\n");
  assert.ok(!/\b\d+\s*(cubits?|metres?|m\b|feet|ft)\b/i.test(everything), "a measurement has appeared on a record whose sources give none");
  assert.match(event.description, /NONE OF THAT IS A SIZE/, "the description does not say the texts give no size");
  assert.match(event.description, /Modern retellings routinely call him a giant/, "the addition is not named as an addition");
  const missing = claimWhere("humbaba-cedar-forest", /no measurement anywhere/);
  assert.equal(missing.startYear, undefined, "the missing-size claim has acquired a year");
  // And it must not swing the other way either.
  assert.match(
    event.description,
    /does not say Humbaba was small/,
    "absence of a measurement is being read as evidence of ordinary size"
  );
});

test("Nimrod's record names both words and refuses the over-reading in both directions", () => {
  const description = descriptionOf("nimrod-gibbor-gigas");
  assert.match(description, /GIBBOR/, "the Hebrew word is not named");
  assert.match(description, /GIGAS/, "the Greek word is not named");
  assert.match(description, /IT IS NOT A WORD ABOUT SIZE/, "the record does not say what gibbor means");
  assert.match(
    description,
    /it does not follow that the translators were careless/i,
    "the record accuses the translators instead of describing what they did"
  );
  assert.match(
    description,
    /every gibbor in the Hebrew Bible was rendered/i,
    "the record generalises from one translation choice to all of them"
  );
  const greek = claimWhere("nimrod-gibbor-gigas", /gigas/);
  assert.match(greek.evidence, /reading a physical giant back into their choice/, "the reverse over-reading is not guarded");
});

test("Ullikummi keeps the Hurrian story and the Hittite tablets apart", () => {
  const description = descriptionOf("ullikummi-stone-giant");
  assert.match(description, /THE STORY IS HURRIAN; THE TABLETS ARE HITTITE/, "the distinction is not made");
  const tablets = claimWhere("ullikummi-stone-giant", /thirteenth century BCE/);
  const composition = claimWhere("ullikummi-stone-giant", /Hurrian original/);
  assert.notEqual(tablets.whatIsDated, composition.whatIsDated, "the copy and the composition share a heading");
  assert.match(tablets.evidence, /copy gives a latest-possible date/, "the copy is not distinguished from the composition");
});

test("the size figures quoted for Ullikummi are described and deliberately not seeded", () => {
  const event = byslug("ullikummi-stone-giant");
  assert.match(event.description, /NEEDS SOURCE VERIFICATION|not seeded here/i, "the untraced figures are not flagged");
  const numbers = [event.summary, event.description, ...event.claims.map((c) => `${c.evidence} ${c.notes ?? ""} ${c.originalDateText}`)].join("\n");
  // The figure most often repeated. If it ever appears it must come with a source.
  assert.ok(!/9,?000\s*(leagues|dannas?)/i.test(numbers), "an untraced figure has been seeded after all");
});

test("the four kinds of claim are named where a reader will meet them", () => {
  // The tranche's organising idea. If it is only in the file header a reader
  // never sees it, so it has to be in a record too.
  const anchor = descriptionOf(GIANTS_MESOPOTAMIA_ANCHOR_SLUG);
  assert.match(anchor, /compare goliath/i, "the anchor does not connect to the same lesson elsewhere in the dataset");
  assert.match(
    descriptionOf("ullikummi-stone-giant"),
    /When a source does mean 'giant', it usually looks like this/,
    "the one record that IS about size does not say so"
  );
});

// ---------------------------------------------------------------------------
// WHAT THIS DATASET MUST NEVER SAY
// ---------------------------------------------------------------------------

test("no confidence scores, and no verdict on whether giants existed", () => {
  const banned = /\b(confidence (score|level|rating)|credibility score|truth score|\d+% (reliable|certain)|rated (strong|weak))\b/i;
  const existed = /\bgiants (existed|were real)\b/i;
  const disproved = /\b(proves|shows) (that )?giants (never existed|were not real)\b/i;
  for (const event of GIANTS_MESOPOTAMIA_EVENTS) {
    const everything = [event.summary, event.description, event.eventTypeNote ?? "",
      ...event.claims.map((claim) => `${claim.evidence} ${claim.notes ?? ""}`)].join("\n");
    assert.ok(!banned.test(everything), `${event.slug}: scoring language`);
    assert.ok(!existed.test(everything), `${event.slug}: asserts giants existed`);
    assert.ok(!disproved.test(everything), `${event.slug}: claims something disproves giants`);
  }
});

test("every record says what kind of record it is in its opening block", () => {
  for (const event of GIANTS_MESOPOTAMIA_EVENTS) {
    const opening = event.description.split("\n\n")[0];
    assert.match(opening, /WHAT KIND OF RECORD IS THIS\?/, `${event.slug}: opening block does not say what kind of record it is`);
    assert.match(opening, /Physical remains|Physical evidence|What can be examined/, `${event.slug}: opening block does not say what physical evidence exists`);
  }
});

test("every record ends by asking rather than concluding", () => {
  for (const event of GIANTS_MESOPOTAMIA_EVENTS) {
    assert.match(event.description, /THINGS TO ASK:/, `${event.slug}: no questions for the reader`);
    const asks = event.description.slice(event.description.indexOf("THINGS TO ASK:"));
    assert.ok((asks.match(/\?/g) ?? []).length >= 3, `${event.slug}: fewer than three questions`);
  }
});

test("no source carries a bibliographic detail that could not be checked", () => {
  // Güterbock's edition is real and the volume numbers could not be confirmed
  // from here, so they are absent rather than guessed.
  const guterbock = sourceByKey("guterbock_ullikummi");
  assert.match(guterbock.notes, /could not be confirmed from here/, "an unverified reference is not flagged");
  assert.ok(!/\bvol(ume)?\.?\s*\d+/i.test(guterbock.reference ?? ""), "a volume number has been supplied for it");
  for (const source of GIANTS_MESOPOTAMIA_SOURCES) {
    if (source.url) assert.match(source.url, /^https:\/\//, `${source.key}: url is not https`);
  }
});

test("the ancient texts are cited by passage", () => {
  for (const key of ["sb_gilgamesh_tablet1", "genesis10", "septuagint_genesis"]) {
    const source = sourceByKey(key);
    assert.ok(
      (source.reference ?? "").length > 0 || /\d/.test(source.title),
      `${key}: no passage given, so nobody can check it`
    );
  }
});
