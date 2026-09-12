import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ANCIENT_SITES_ARTEFACTS_EVENTS,
  ANCIENT_SITES_ARTEFACTS_SOURCES,
  ANCIENT_SITES_ARTEFACTS_LINKS,
  ANCIENT_SITES_ARTEFACTS_ANCHOR_SLUG,
} from "./ancient-sites-artefacts-seed";
import {
  DATING_METHODS,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
  EVENT_RELATIONS,
} from "./taxonomy";

const CLAIMS = ANCIENT_SITES_ARTEFACTS_EVENTS.flatMap((event) =>
  event.claims.map((claim) => ({ slug: event.slug, claim }))
);
const keys = (list: readonly { key: string }[]) => new Set(list.map((entry) => entry.key));
const byslug = (slug: string) => {
  const found = ANCIENT_SITES_ARTEFACTS_EVENTS.find((event) => event.slug === slug);
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

/** The five records that are about a found object. The 1993 book is not one. */
const FINDS = ["dorchester-pot-reported", "morrisonville-gold-chain-reported", "macoupin-county-bones-reported", "table-mountain-auriferous-gravels"];

/** Words naming the thing somebody picked up, as opposed to the rock or the report. */
const OBJECT_WORDS = /\b(vessel|pot|chain|bones?|skeleton|mortars?|pestles?|worked stone|artefacts?|object)\b/i;

// ---------------------------------------------------------------------------
// VOCABULARY. Typed as `string`, so an invented key typechecks and is then
// rejected silently at seed time.
// ---------------------------------------------------------------------------

test("every vocabulary key is real", () => {
  const methods = keys(DATING_METHODS);
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const sourceTypes = keys(TIMELINE_SOURCE_TYPES);
  const relations = keys(EVENT_RELATIONS);

  for (const event of ANCIENT_SITES_ARTEFACTS_EVENTS) {
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: eventType ${event.eventType}`);
    for (const claim of event.claims) {
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: datingMethod ${claim.datingMethod}`);
    }
  }
  for (const source of ANCIENT_SITES_ARTEFACTS_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType ?? "other"), `${source.key}: sourceType ${source.sourceType}`);
  }
  for (const link of ANCIENT_SITES_ARTEFACTS_LINKS) {
    assert.ok(relations.has(link.relation), `link ${link.from}→${link.to}: relation ${link.relation}`);
  }
});

// ---------------------------------------------------------------------------
// THE ONE THING THIS WHOLE TRANCHE EXISTS TO KEEP STRAIGHT
//
// "Found associated with coal" is not "scientifically dated to 300 million
// years". The substitution is performed by attaching a measurement of the ROCK
// to the OBJECT, so the guard is structural: a claim whose method is a
// measurement may not name an object as the thing it dates.
// ---------------------------------------------------------------------------

/** Methods that measure material. An object dated by one of these has been in a lab. */
const MEASURED = new Set([
  "geological",
  "radiocarbon",
  "radiometric",
  "uranium_series",
  "luminescence",
  "palaeomagnetism",
  "fission_track",
  "amino_acid_racemisation",
  "dendrochronology",
  "stratigraphic",
]);

test("no measurement is ever attached to an object", () => {
  for (const { slug, claim } of CLAIMS) {
    if (!MEASURED.has(claim.datingMethod)) continue;
    assert.doesNotMatch(
      claim.whatIsDated ?? "",
      OBJECT_WORDS,
      `${slug}: a ${claim.datingMethod} claim says it dates "${claim.whatIsDated}". Nothing here has been ` +
        `measured except rock and paper — if this is a claim about where an object was, it is an inference and ` +
        `belongs under claimant_inference.`
    );
  }
});

test("a claim that does date an object is marked as an inference and says what it depends on", () => {
  const aboutObjects = CLAIMS.filter(({ claim }) => OBJECT_WORDS.test(claim.whatIsDated ?? ""));
  // Exactly one: Whitney's. He made the claim, so it is on the record — but the
  // record has to say it rests on testimony about a mine rather than on a lab.
  assert.equal(aboutObjects.length, 1, `expected one object-dating claim, got ${aboutObjects.length}`);
  const [{ slug, claim }] = aboutObjects;
  assert.equal(claim.datingMethod, "claimant_inference", `${slug}: an object dated by ${claim.datingMethod}`);
  assert.match(claim.whatIsDated ?? "", /\bif\b/, `${slug}: the condition is missing from what it dates`);
  assert.match(claim.evidence, /WHAT IT DOES NOT ESTABLISH/, `${slug}: does not say what it fails to establish`);
});

test("every find record dates a report and dates the host material", () => {
  for (const slug of FINDS) {
    const methods = byslug(slug).claims.map((claim) => claim.datingMethod);
    assert.ok(methods.includes("historical_record"), `${slug}: no claim dates the report`);
    assert.ok(methods.includes("geological"), `${slug}: no claim dates the host material`);
  }
});

test("the two claims on a find are visibly about different things", () => {
  // The detail view groups claims by whatIsDated. If two claims share a value
  // they collapse into one heading and the distinction the record is built
  // around disappears from the screen.
  for (const slug of FINDS) {
    const dated = byslug(slug).claims.map((claim) => claim.whatIsDated);
    for (const value of dated) assert.ok(value && value.trim().length > 10, `${slug}: whatIsDated missing or thin`);
    assert.equal(new Set(dated).size, dated.length, `${slug}: two claims claim to date the same thing`);
  }
});

test("every geological claim says in its own words that it is not about the object", () => {
  for (const { slug, claim } of CLAIMS) {
    if (claim.datingMethod !== "geological") continue;
    const says = `${claim.evidence} ${claim.notes ?? ""}`;
    assert.match(claim.evidence, /WHAT IT DOES NOT ESTABLISH/, `${slug}: no disclaimer on a rock date`);
    assert.match(
      says,
      OBJECT_WORDS,
      `${slug}: the rock date never mentions the object, so a reader has nothing to stop them joining the two`
    );
  }
});

test("no record asserts the object's age as a plain fact", () => {
  // "A 300-million-year-old gold chain" is the sentence this dataset exists to
  // prevent. It may appear only as something being denied, so every occurrence
  // has to carry a denial close in front of it.
  const assertion = /\b\d[\d,.]*\s*(?:-|\s)?million[-\s]year[-\s]old\s+\w*\s*(vessel|pot|chain|bones?|mortars?|artefacts?|object)/gi;
  const denial = /\b(not|never|no|nobody|wrong|rather than|is this measurement|cannot|does not)\b/i;
  for (const event of ANCIENT_SITES_ARTEFACTS_EVENTS) {
    const text = textOf(event.slug);
    for (const found of text.matchAll(assertion)) {
      const before = text.slice(Math.max(0, found.index - 70), found.index);
      assert.match(
        before,
        denial,
        `${event.slug}: "${found[0]}" is stated without a denial in front of it`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// PROVENANCE IS THE EVIDENCE HERE, SO IT HAS TO BE ON THE RECORD
// ---------------------------------------------------------------------------

test("every find record says who reported it and what independent examination exists", () => {
  for (const slug of FINDS) {
    const text = textOf(slug);
    assert.match(text, /provenance/i, `${slug}: provenance is never named as the question`);
    // Either answer counts, and the two are genuinely different records. For
    // three of these the answer is "none"; at Table Mountain Holmes went to
    // California and looked, which is why this asks what examination exists
    // rather than assuming there was none. Written after the first version of
    // this test demanded a denial and failed the one record that has an
    // affirmative answer.
    assert.match(
      text,
      /no independent|nobody independent|no finder is named|no later examination|no account of any|went to (California|look)|to see it|examination of/i,
      `${slug}: does not say what independent examination exists`
    );
  }
});

test("a record about an object that can no longer be examined says so", () => {
  for (const slug of ["dorchester-pot-reported", "morrisonville-gold-chain-reported", "macoupin-county-bones-reported"]) {
    assert.match(
      textOf(slug),
      /no longer exists|whereabouts are unknown|never been traced|cannot now be (found|examined)/i,
      `${slug}: does not say the object is gone, so a reader may think it could be tested`
    );
  }
});

test("the Morrisonville conflict of interest is stated as a fact and not as an accusation", () => {
  const text = textOf("morrisonville-gold-chain-reported");
  assert.match(text, /proprietor of The Morrisonville Times|owned the paper|owner of the paper/i, "the paper's ownership is missing");
  assert.match(text, /jeweller/i, "the husband's trade is missing");
  assert.match(text, /not an accusation|not thereby false|not as an allegation/i, "nothing holds the inference back");
  assert.doesNotMatch(text, /\b(hoax|fraud|forgery|faked|planted it)\b/i, "an intent claim with no evidence behind it");
});

// ---------------------------------------------------------------------------
// CREMO COMPILED THESE. HE DID NOT FIND THEM.
// ---------------------------------------------------------------------------

test("the claim dating a report is sourced to the original notice, never to the 1993 compilation", () => {
  for (const slug of FINDS) {
    for (const claim of byslug(slug).claims) {
      if (claim.datingMethod !== "historical_record") continue;
      assert.notEqual(
        claim.sourceKey,
        "cremo_thompson1993",
        `${slug}: the report is dated from the compilation rather than from the notice that carried it`
      );
    }
  }
});

test("every record naming Cremo also names who actually made the find, or says nobody is named", () => {
  for (const slug of FINDS) {
    const event = byslug(slug);
    if (!(event.people ?? []).some((person) => /Cremo/.test(person))) continue;
    const text = textOf(slug);
    assert.match(
      text,
      /Nina Maxon Culp|Albert G\. Walton|Whitney|no finder is named|nobody is named/i,
      `${slug}: Cremo is on the record and the actual finder is not`
    );
  }
});

test("the compilation is its own record, making its own kind of claim", () => {
  const book = byslug("forbidden-archeology-published");
  assert.equal(book.claims.length, 1, "a book publication has one date");
  assert.equal(book.claims[0].datingMethod, "historical_record");
  assert.equal(book.eventType, "historical", "the publication of a book is not itself a disputed date");
  // And it must not quietly become the discoverer of anything.
  assert.match(book.description, /not the discoverer|does not say he is|belongs to somebody else/i);
  assert.match(book.description, /historiographic|history of a discipline|how evidence has been treated/i);
});

// ---------------------------------------------------------------------------
// TABLE MOUNTAIN, WHICH IS A SCIENTIFIC DISPUTE AND IS WRITTEN AS ONE
// ---------------------------------------------------------------------------

test("neither side of the Table Mountain argument is written as a crank", () => {
  const text = textOf("table-mountain-auriferous-gravels");
  assert.match(text, /State Geologist/i, "Whitney's position is missing");
  assert.match(text, /Smithsonian/i, "Holmes' position is missing");
  // A denial is the opposite of the thing guarded against: the record says
  // "NEITHER MAN WAS A CRANK", which is the sentence a reader needs. So the
  // word is only a failure when nothing in front of it is ruling it out.
  // (The first version of this test flagged that sentence, which was the test
  // being blunt rather than the record being wrong.)
  const dismissal = /\b(pseudo\w*|crackpot|fringe|crank)\b/gi;
  for (const found of text.matchAll(dismissal)) {
    const before = text.slice(Math.max(0, found.index - 40), found.index);
    assert.match(
      before,
      /\b(not|neither|never|no|nor|rather than|far from)\b/i,
      `"${found[0]}" decides the argument for the reader`
    );
  }
});

test("the Table Mountain dispute is about provenance, not about whether the objects are artefacts", () => {
  const text = textOf("table-mountain-auriferous-gravels");
  assert.match(text, /not in doubt|made thing|did not argue otherwise|unambiguously made/i, "the objects' status is left unclear");
  assert.match(text, /mine is not a sealed context|not a sealed context|workings/i, "Holmes' actual argument is missing");
});

test("the lava cap is a measurement of its own, separate from Whitney's inference", () => {
  const claims = byslug("table-mountain-auriferous-gravels").claims;
  const cap = claims.find((claim) => claim.datingMethod === "geological");
  const inference = claims.find((claim) => claim.datingMethod === "claimant_inference");
  assert.ok(cap, "no claim dates the lava cap");
  assert.ok(inference, "Whitney's claim is missing");
  assert.notEqual(cap!.whatIsDated, inference!.whatIsDated, "the cap and the mortar are filed as the same thing");
  assert.doesNotMatch(cap!.whatIsDated ?? "", OBJECT_WORDS, "the cap claim names an object");
  assert.match(cap!.evidence, /lava|latite|flow/i, "the cap claim does not say what rock it dates");
});

// ---------------------------------------------------------------------------
// THE HOUSE RULES
// ---------------------------------------------------------------------------

test("every claim says what it dates, by what method, and what it does not establish", () => {
  for (const { slug, claim } of CLAIMS) {
    assert.match(claim.evidence, /WHAT IS DATED/, `${slug}: no statement of what is dated`);
    assert.match(claim.evidence, /DATING METHOD/, `${slug}: no dating method in the evidence`);
    assert.match(claim.evidence, /WHAT IT DOES NOT ESTABLISH/, `${slug}: no statement of what it does not establish`);
  }
});

test("nothing carries a confidence score or a verdict label", () => {
  const score = /\b(confidence|credibility|reliability|plausibility)\s*(score|rating|level|%)/i;
  const verdict = /\b(debunked|disproven|proven true|proved false)\b/i;
  for (const event of ANCIENT_SITES_ARTEFACTS_EVENTS) {
    const text = textOf(event.slug);
    assert.doesNotMatch(text, score, `${event.slug}: a score`);
    assert.doesNotMatch(text, verdict, `${event.slug}: a verdict label`);
  }
});

test("a geological era stored as a round order of magnitude is marked approximate", () => {
  for (const { slug, claim } of CLAIMS) {
    if (claim.datingMethod !== "geological" && claim.datingMethod !== "claimant_inference") continue;
    assert.equal(claim.isApproximate, true, `${slug}: a geological figure presented as exact`);
    assert.equal(claim.datePrecision, "million_years", `${slug}: precision ${claim.datePrecision}`);
  }
});

test("a figure that could not be traced to a closer source says so", () => {
  const flagged = CLAIMS.filter(({ claim }) =>
    /NEEDS SOURCE VERIFICATION/.test(`${claim.evidence} ${claim.notes ?? ""}`)
  );
  assert.ok(flagged.length >= 1, "expected at least one untraced figure to be marked");
});

test("no two claims on a record share their date text, because citations are matched by it", () => {
  // seedDataset reads the inserted claims back and keys them by
  // original_date_text to attach each claim's citations. Two claims on one
  // record with the same text means one set of citations lands on the wrong
  // claim or silently vanishes — and nothing on screen would say so. Table
  // Mountain has three claims, which is what made this worth guarding.
  for (const event of ANCIENT_SITES_ARTEFACTS_EVENTS) {
    const texts = event.claims.map((claim) => claim.originalDateText);
    for (const text of texts) assert.ok(text && text.trim().length > 0, `${event.slug}: a claim with no date text`);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: two claims share their date text`);
  }
});

test("every claim and citation points at a source that exists", () => {
  const known = new Set(ANCIENT_SITES_ARTEFACTS_SOURCES.map((source) => source.key));
  for (const { slug, claim } of CLAIMS) {
    if (claim.sourceKey) assert.ok(known.has(claim.sourceKey), `${slug}: unknown source ${claim.sourceKey}`);
    for (const citation of claim.citations ?? []) {
      assert.ok(known.has(citation.sourceKey), `${slug}: unknown cited source ${citation.sourceKey}`);
    }
  }
});

test("no source is cited without saying what it is cited for", () => {
  for (const source of ANCIENT_SITES_ARTEFACTS_SOURCES) {
    assert.ok(source.notes && source.notes.trim().length > 50, `${source.key}: notes missing or too thin`);
  }
});

test("every source used is used, and every record is uniquely slugged", () => {
  const used = new Set<string>();
  for (const { claim } of CLAIMS) {
    if (claim.sourceKey) used.add(claim.sourceKey);
    for (const citation of claim.citations ?? []) used.add(citation.sourceKey);
  }
  for (const source of ANCIENT_SITES_ARTEFACTS_SOURCES) {
    assert.ok(used.has(source.key), `${source.key}: seeded but never cited`);
  }
  const slugs = ANCIENT_SITES_ARTEFACTS_EVENTS.map((event) => event.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  assert.ok(slugs.includes(ANCIENT_SITES_ARTEFACTS_ANCHOR_SLUG));
});

test("every link joins two records that exist here", () => {
  const slugs = new Set(ANCIENT_SITES_ARTEFACTS_EVENTS.map((event) => event.slug));
  for (const link of ANCIENT_SITES_ARTEFACTS_LINKS) {
    assert.ok(slugs.has(link.from), `link from unknown ${link.from}`);
    assert.ok(slugs.has(link.to), `link to unknown ${link.to}`);
    assert.ok(link.note && link.note.trim().length > 20, `link ${link.from}→${link.to}: no note`);
  }
});
