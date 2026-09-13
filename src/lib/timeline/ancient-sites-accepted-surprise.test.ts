import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ANCIENT_SITES_ACCEPTED_EVENTS,
  ANCIENT_SITES_ACCEPTED_SOURCES,
  ANCIENT_SITES_ACCEPTED_LINKS,
  ANCIENT_SITES_ACCEPTED_ANCHOR_SLUG,
} from "./ancient-sites-accepted-surprise-seed";
import {
  DATING_METHODS,
  CLAIM_VIEWPOINTS,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
  EVENT_RELATIONS,
} from "./taxonomy";

const CLAIMS = ANCIENT_SITES_ACCEPTED_EVENTS.flatMap((event) =>
  event.claims.map((claim) => ({ slug: event.slug, claim }))
);
const keys = (list: readonly { key: string }[]) => new Set(list.map((entry) => entry.key));
const byslug = (slug: string) => {
  const found = ANCIENT_SITES_ACCEPTED_EVENTS.find((event) => event.slug === slug);
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

test("every vocabulary key is real", () => {
  const methods = keys(DATING_METHODS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const sourceTypes = keys(TIMELINE_SOURCE_TYPES);
  const relations = keys(EVENT_RELATIONS);

  for (const event of ANCIENT_SITES_ACCEPTED_EVENTS) {
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: eventType ${event.eventType}`);
    for (const claim of event.claims) {
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: datingMethod ${claim.datingMethod}`);
      assert.ok(viewpoints.has(claim.chronology), `${event.slug}: chronology ${claim.chronology}`);
    }
  }
  for (const source of ANCIENT_SITES_ACCEPTED_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType ?? "other"), `${source.key}: sourceType ${source.sourceType}`);
  }
  for (const link of ANCIENT_SITES_ACCEPTED_LINKS) {
    assert.ok(relations.has(link.relation), `link ${link.from}→${link.to}: relation ${link.relation}`);
  }
});

// ---------------------------------------------------------------------------
// AN ACCEPTED DATE IS HELD TO THE SAME STANDARD AS A DISPUTED ONE
//
// This is the tranche where it would be easiest to relax. Nothing here is
// contested, so the temptation is to state dates and move on — which would
// teach, by omission, that the conventional answer does not need evidence.
// ---------------------------------------------------------------------------

test("every claim says what it dates, by what method, and what it does not establish", () => {
  for (const { slug, claim } of CLAIMS) {
    assert.match(claim.evidence, /WHAT IS DATED/, `${slug}: no statement of what is dated`);
    assert.match(claim.evidence, /DATING METHOD/, `${slug}: no dating method in the evidence`);
    assert.match(
      claim.evidence,
      /WHAT IT DOES NOT ESTABLISH/,
      `${slug}: an accepted date with no statement of its limits — the one place this dataset must not relax`
    );
    assert.ok((claim.whatIsDated ?? "").trim().length > 10, `${slug}: whatIsDated missing or thin`);
  }
});

test("every record here is filed as mainstream and says why it is on a disputed-dates timeline", () => {
  for (const event of ANCIENT_SITES_ACCEPTED_EVENTS) {
    assert.equal(event.eventType, "mainstream", `${event.slug}: not filed as mainstream`);
    assert.match(
      event.eventTypeNote ?? "",
      /not disputed|accepted|current accepted/i,
      `${event.slug}: does not say it is undisputed`
    );
  }
});

// ---------------------------------------------------------------------------
// REVISION RUNS BOTH WAYS, AND THIS TRANCHE CARRIES THE DIRECTION NOBODY SEES
// ---------------------------------------------------------------------------

test("the superseded mainstream date is on the record, as a conventional claim", () => {
  const claims = byslug("rapa-nui-settled").claims;
  const superseded = claims.find((claim) => /superseded|long-accepted/i.test(claim.originalDateText));
  assert.ok(superseded, "the pre-2006 figure is missing, which hides the point of the record");
  // It was never an alternative chronology, and must not be filed as one.
  assert.equal(
    superseded!.chronology,
    "conventional",
    "a date that was the mainstream view has been filed as an alternative"
  );
  assert.match(
    superseded!.notes ?? "",
    /never was one|was the conventional view|not filed as an alternative/i,
    "nothing says this was the accepted position rather than a fringe one"
  );
  // And the current date must be later than the superseded one — that is the
  // direction this record exists to show.
  const current = claims.find((claim) => /chronometric hygiene/i.test(claim.originalDateText));
  assert.ok(current, "the current date is missing");
  assert.ok(
    (current!.startYear ?? 0) > (superseded!.startYear ?? 0),
    "the revision does not run later, so this record no longer shows what it is for"
  );
});

test("the revision is explained by the method, not by science changing its mind", () => {
  // Checked against the DESCRIPTION, because that is where a reader meets it.
  // The first version of this read the whole record, and so passed a reverted
  // description saying only "science simply changed its mind" — the claim notes
  // still carried the right words, where nobody looking at the page would be
  // reading them yet.
  const description = byslug("rapa-nui-settled").description;
  assert.match(description, /chronometric hygiene/i, "the description does not name the method that changed");
  assert.match(
    description,
    /measurements were not wrong|sample selection|which measurements/i,
    "the description does not say that what changed was which samples to believe"
  );
  assert.doesNotMatch(
    description,
    /science (simply )?changed its mind/i,
    "the description offers the slogan instead of the mechanism"
  );
  const text = textOf("rapa-nui-settled");
  assert.match(text, /old wood/i, "the contaminant is not named");
  // And the cross-link to the site where the same contaminant cannot be removed.
  assert.match(text, /Giza/i, "does not connect old wood to the record where it cannot be excluded");
});

test("both directions of revision are pointed at", () => {
  const text = textOf("rapa-nui-settled");
  assert.match(text, /Pedra Furada|Hueyatlaco|Americas/i, "no reference to revision in the other direction");
  assert.match(
    text,
    /both directions|moved EARLIER|moved LATER|half of it/i,
    "does not say revision runs both ways, which is the lesson"
  );
});

test("a later date is not presented as diminishing the site", () => {
  const text = textOf("rapa-nui-settled");
  assert.match(
    text,
    /larger rather than smaller|more remarkable|shorter time|compresses/i,
    "a revision towards less antiquity is left reading as a demotion"
  );
});

// ---------------------------------------------------------------------------
// MALTA: AN ALIGNMENT THAT IS NOT USED TO DATE ANYTHING
// ---------------------------------------------------------------------------

test("the Mnajdra alignment is recorded as evidence of intention, not as a date", () => {
  const claim = byslug(ANCIENT_SITES_ACCEPTED_ANCHOR_SLUG).claims.find(
    (c) => c.datingMethod === "astronomical"
  );
  assert.ok(claim, "the alignment has no claim, so nothing stops it being read as a date");
  assert.match(claim!.evidence, /WHAT IS DATED: nothing/, "the alignment claim presents itself as dating something");
  assert.match(
    claim!.whatIsDated ?? "",
    /intention|not how the temple is dated|attending to/i,
    "the alignment's subject does not say it is about purpose rather than age"
  );
  assert.match(
    `${claim!.evidence} ${claim!.notes ?? ""}`,
    /Giza|Tiwanaku|precession/i,
    "no contrast with the alignments that were run backwards to make dates"
  );
});

test("the accepted Maltese date is stated as the extraordinary one", () => {
  const text = textOf(ANCIENT_SITES_ACCEPTED_ANCHOR_SLUG);
  assert.match(text, /oldest free-standing|earliest free-standing/i, "the claim to antiquity is missing");
  assert.match(text, /Giza|Stonehenge/i, "nothing for a reader to measure the antiquity against");
  assert.match(
    text,
    /mainstream position|did not need|nobody (had to|needed)/i,
    "does not say the conventional chronology got here on its own"
  );
});

test("a revision towards younger dates is on the Malta record too", () => {
  const skorba = byslug(ANCIENT_SITES_ACCEPTED_ANCHOR_SLUG).claims.find((claim) =>
    /Skorba/i.test(claim.originalDateText)
  );
  assert.ok(skorba, "the Skorba revision is missing");
  assert.match(
    `${skorba!.evidence} ${skorba!.notes ?? ""}`,
    /later than|unglamorous|younger/i,
    "the direction of the Skorba revision is not stated"
  );
});

// ---------------------------------------------------------------------------
// NAN MADOL: THE DATED MATERIAL IS IN THE BUILDING
// ---------------------------------------------------------------------------

test("the Nan Madol claims date the structure and say there is no deposit in the chain", () => {
  const claims = byslug("nan-madol-built").claims;
  assert.ok(claims.length >= 2, "expected both determinations");
  for (const claim of claims) {
    assert.equal(claim.datingMethod, "uranium_series");
    assert.match(
      claim.whatIsDated ?? "",
      /wall|structure|construction|stage/i,
      `a Nan Madol claim whose subject is not part of the building — "${claim.whatIsDated}"`
    );
  }
  assert.match(
    textOf("nan-madol-built"),
    /in the building|in the fabric|no inferential step|no deposit/i,
    "does not say why dating material in the fabric is different"
  );
  // The comparison that makes it mean something.
  assert.match(textOf("nan-madol-built"), /Khambhat|Pumapunku|mound fill/i, "no contrast with a date one step removed");
});

test("two determinations with two tolerances stay two claims", () => {
  // "1180 ± 7 and 1200 ± 6" is not "somewhere between 1173 and 1206".
  const claims = byslug("nan-madol-built").claims;
  for (const claim of claims) {
    assert.ok(claim.uncertaintyPlus != null, "a reported tolerance has been dropped");
    assert.equal(claim.endYear, undefined, "two determinations have been folded into one span");
  }
  const years = claims.map((claim) => claim.startYear);
  assert.equal(new Set(years).size, years.length, "both determinations stored at the same year");
});

test("Nan Madol's own chronology is not mixed up with claims about a sunken continent", () => {
  const text = textOf("nan-madol-built");
  // The Mu/Lemuria association is real and belongs on the Lemuria records,
  // traced to whoever made it. What must not happen is a claim here carrying it.
  for (const claim of byslug("nan-madol-built").claims) {
    assert.doesNotMatch(
      `${claim.originalDateText} ${claim.whatIsDated}`,
      /\bMu\b|Lemuria/i,
      "a continent claim has become a dated claim on this record"
    );
  }
  assert.match(text, /Lemuria|\bMu\b/i, "the association is not acknowledged at all, which reads as hiding it");
  assert.match(
    text,
    /own history|right place|traced to/i,
    "does not say where that claim is handled instead"
  );
});

// ---------------------------------------------------------------------------
// THE HOUSE RULES
// ---------------------------------------------------------------------------

test("every BCE year is stored in astronomical numbering", () => {
  for (const { slug, claim } of CLAIMS) {
    for (const [field, year] of [["startYear", claim.startYear], ["endYear", claim.endYear]] as const) {
      if (year == null || year >= 0) continue;
      if (!/BCE/i.test(claim.originalDateText)) continue;
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

test("no two claims on a record share their date text, because citations are matched by it", () => {
  for (const event of ANCIENT_SITES_ACCEPTED_EVENTS) {
    const texts = event.claims.map((claim) => claim.originalDateText);
    for (const text of texts) assert.ok(text && text.trim().length > 0, `${event.slug}: a claim with no date text`);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: two claims share their date text`);
  }
});

test("nothing carries a confidence score or a verdict label", () => {
  const score = /\b(confidence|credibility|reliability|plausibility)\s*(score|rating|level|%)/i;
  const verdict = /\b(debunked|disproven|proven true|proved false)\b/i;
  for (const event of ANCIENT_SITES_ACCEPTED_EVENTS) {
    const text = textOf(event.slug);
    assert.doesNotMatch(text, score, `${event.slug}: a score`);
    assert.doesNotMatch(text, verdict, `${event.slug}: a verdict label`);
  }
});

test("nobody is dismissed rather than answered", () => {
  const dismissal = /\b(pseudo\w*|crackpot|fringe|crank|hoax|fraud|nonsense)\b/gi;
  for (const event of ANCIENT_SITES_ACCEPTED_EVENTS) {
    const text = textOf(event.slug);
    for (const found of text.matchAll(dismissal)) {
      const before = text.slice(Math.max(0, found.index - 60), found.index);
      assert.match(
        before,
        /\b(not|neither|never|no|nor|rather than|far from)\b/i,
        `${event.slug}: "${found[0]}" decides the question for the reader`
      );
    }
  }
});

test("a figure that could not be traced says so", () => {
  const flagged = ANCIENT_SITES_ACCEPTED_SOURCES.filter((source) =>
    /NEEDS SOURCE VERIFICATION/.test(source.notes ?? "")
  );
  assert.ok(flagged.length >= 1, "expected the untraced authorship to be marked rather than guessed");
});

test("every claim and citation points at a source that exists, and every source is used", () => {
  const known = new Set(ANCIENT_SITES_ACCEPTED_SOURCES.map((source) => source.key));
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
  for (const source of ANCIENT_SITES_ACCEPTED_SOURCES) {
    assert.ok(used.has(source.key), `${source.key}: seeded but never cited`);
  }
});

test("no source is cited without saying what it is cited for", () => {
  for (const source of ANCIENT_SITES_ACCEPTED_SOURCES) {
    assert.ok(source.notes && source.notes.trim().length > 50, `${source.key}: notes missing or too thin`);
  }
});

test("every record is uniquely slugged and every link joins records that exist", () => {
  const slugs = ANCIENT_SITES_ACCEPTED_EVENTS.map((event) => event.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  assert.ok(slugs.includes(ANCIENT_SITES_ACCEPTED_ANCHOR_SLUG));
  for (const link of ANCIENT_SITES_ACCEPTED_LINKS) {
    assert.ok(new Set(slugs).has(link.from), `link from unknown ${link.from}`);
    assert.ok(new Set(slugs).has(link.to), `link to unknown ${link.to}`);
    assert.ok(link.note && link.note.trim().length > 20, `link ${link.from}→${link.to}: no note`);
  }
});
