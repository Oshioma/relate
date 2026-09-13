import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ANCIENT_SITES_SUBMERGED_EVENTS,
  ANCIENT_SITES_SUBMERGED_SOURCES,
  ANCIENT_SITES_SUBMERGED_LINKS,
  ANCIENT_SITES_SUBMERGED_ANCHOR_SLUG,
} from "./ancient-sites-submerged-seed";
import {
  DATING_METHODS,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
  EVENT_RELATIONS,
  DATE_CONVENTIONS,
} from "./taxonomy";

const CLAIMS = ANCIENT_SITES_SUBMERGED_EVENTS.flatMap((event) =>
  event.claims.map((claim) => ({ slug: event.slug, claim }))
);
const keys = (list: readonly { key: string }[]) => new Set(list.map((entry) => entry.key));
const byslug = (slug: string) => {
  const found = ANCIENT_SITES_SUBMERGED_EVENTS.find((event) => event.slug === slug);
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

// ---------------------------------------------------------------------------
// VOCABULARY. Typed as `string`, and the database checks date_precision and
// nothing else — an invented dating_method or chronology inserts cleanly and
// then renders as nothing at all.
// ---------------------------------------------------------------------------

test("every vocabulary key is real", () => {
  const methods = keys(DATING_METHODS);
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const sourceTypes = keys(TIMELINE_SOURCE_TYPES);
  const relations = keys(EVENT_RELATIONS);
  const conventions = keys(DATE_CONVENTIONS);

  for (const event of ANCIENT_SITES_SUBMERGED_EVENTS) {
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: eventType ${event.eventType}`);
    for (const claim of event.claims) {
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: datingMethod ${claim.datingMethod}`);
      if (claim.dateConvention) {
        assert.ok(conventions.has(claim.dateConvention), `${event.slug}: dateConvention ${claim.dateConvention}`);
      }
    }
  }
  for (const source of ANCIENT_SITES_SUBMERGED_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType ?? "other"), `${source.key}: sourceType ${source.sourceType}`);
  }
  for (const link of ANCIENT_SITES_SUBMERGED_LINKS) {
    assert.ok(relations.has(link.relation), `link ${link.from}→${link.to}: relation ${link.relation}`);
  }
});

// ---------------------------------------------------------------------------
// THE THING THIS TRANCHE EXISTS TO KEEP STRAIGHT
//
// A sea-level date dates a DROWNING. It is a floor for a structure only if the
// thing was made and is still where it was made. So no sea-level claim may
// present itself as dating a structure, and every one of them has to say what
// it cannot distinguish.
// ---------------------------------------------------------------------------

/** Words for a thing somebody built, as opposed to the water or the rock. */
const BUILT_WORDS = /\b(structures?|buildings?|city|cities|town|port|temples?|walls?|monument|settlement)\b/i;

test("a sea-level date never claims to date a structure", () => {
  const sealevel = CLAIMS.filter(({ claim }) => claim.datingMethod === "sea_level_reconstruction");
  assert.ok(sealevel.length >= 2, "expected the sea-level claims to be present");
  for (const { slug, claim } of sealevel) {
    assert.doesNotMatch(
      claim.whatIsDated ?? "",
      BUILT_WORDS,
      `${slug}: a sea-level claim says it dates "${claim.whatIsDated}". It dates an inundation.`
    );
    assert.match(
      `${claim.whatIsDated} ${claim.evidence}`,
      /above water|covered by the sea|inundat|drown/i,
      `${slug}: a sea-level claim that never mentions the water`
    );
  }
});

test("every sea-level claim says it gives a floor and not an age", () => {
  for (const { slug, claim } of CLAIMS) {
    if (claim.datingMethod !== "sea_level_reconstruction") continue;
    const says = `${claim.evidence} ${claim.notes ?? ""}`;
    assert.match(says, /WHAT IT DOES NOT ESTABLISH/, `${slug}: no disclaimer on a sea-level date`);
    assert.match(
      says,
      /minimum|floor|at least/i,
      `${slug}: does not say the date is a lower bound, which is the only thing it is`
    );
  }
});

test("the control record is held to the same standard as the disputes", () => {
  // Pantelleria is peer-reviewed and accepted. If the floor-is-not-an-age point
  // is only made where a claim is being doubted, it reads as a way of doubting
  // rather than as how the measurement works.
  const claim = byslug("pantelleria-vecchia-monolith").claims.find(
    (c) => c.datingMethod === "sea_level_reconstruction"
  );
  assert.ok(claim, "the control has no sea-level claim");
  // Attached to WHAT IT ESTABLISHES, not merely somewhere in the paragraph. The
  // first version of this looked for the words anywhere, and passed a reverted
  // record whose "establishes" line had been changed to claim an age outright —
  // because a later sentence still happened to contain the word "floor".
  assert.match(
    claim!.evidence,
    /WHAT IT ESTABLISHES:[^.]*\b(minimum|floor|at least)\b/i,
    "the control's date does not say, where it says what it establishes, that it is only a lower bound"
  );
  assert.match(
    `${claim!.evidence} ${claim!.notes ?? ""}`,
    /WHAT IT DOES NOT ESTABLISH/,
    "the control is let off the disclaimer"
  );
});

test("every record carries the prior question — whether the thing is made or in place", () => {
  // The dates on these records are answers to that question, not evidence for
  // it, so it is a claim of its own on every one. Same split as Calico.
  for (const event of ANCIENT_SITES_SUBMERGED_EVENTS) {
    if (event.slug === "dwarka-offshore-excavation") continue; // nobody disputes that a fortified port is built
    const prior = event.claims.filter((claim) =>
      /whether|interpretation|placed|position/i.test(claim.whatIsDated ?? "")
    );
    assert.ok(
      prior.length >= 1,
      `${event.slug}: no claim for the making-or-position question, so the dates stand unqualified`
    );
    for (const claim of prior) {
      assert.match(
        claim.evidence,
        /WHAT IS DATED: nothing/,
        `${event.slug}: an interpretation claim that presents itself as dating something`
      );
    }
  }
});

test("the dredged material is never treated as dating the site", () => {
  const khambhat = byslug("gulf-of-khambhat-survey");
  const wood = khambhat.claims.find((claim) => /wood/i.test(claim.whatIsDated ?? ""));
  assert.ok(wood, "the radiocarbon claim does not say it dates a piece of wood");
  assert.doesNotMatch(wood!.whatIsDated ?? "", BUILT_WORDS, "the wood claim names a built thing");
  assert.match(wood!.evidence, /dredged|position|where it lay/i, "the evidence does not say why position matters");
  // And the record must not quarrel with the date, which nobody disputes. This
  // checks the DESCRIPTION specifically: a note buried on a claim is not where a
  // reader finds out that the radiocarbon was never the argument, and an earlier
  // version of this test passed a description that said the opposite because a
  // claim's notes still carried the right words.
  assert.match(
    khambhat.description,
    /not (what is )?disputed|nobody argues|accepted by everyone|is not in dispute|is not wrong/i,
    "the description reads as though the radiocarbon were the problem"
  );
  assert.doesNotMatch(
    khambhat.description,
    /radiocarbon is the weak point|the date is wrong|unreliable dating/i,
    "the description attacks the measurement instead of the inference"
  );
});

// ---------------------------------------------------------------------------
// A CLAIMANT'S OWN REVISION BEATS THE FIGURE THAT CIRCULATES
// ---------------------------------------------------------------------------

test("both of Kimura's positions are on the record, and the later one is marked as later", () => {
  const claims = byslug(ANCIENT_SITES_SUBMERGED_ANCHOR_SLUG).claims;
  const kimura = claims.filter((claim) => /Kimura/i.test(`${claim.originalDateText} ${claim.whatIsDated ?? ""}`));
  assert.equal(kimura.length, 2, `expected Kimura's two positions, found ${kimura.length}`);
  const [earlier, later] = kimura.sort((a, b) => (a.startYear ?? 0) - (b.startYear ?? 0));
  assert.ok(
    (later.startYear ?? 0) > (earlier.startYear ?? 0),
    "the later position is not the younger date, so one of them is mislabelled"
  );
  assert.match(earlier.notes ?? "", /NOT Kimura's final position|later|revision/i, "nothing says the 10,000-year figure was superseded");
  assert.match(later.originalDateText, /2007|Pacific Science Congress/, "the revision is not dated to where he made it");
  // Neither may be filed as a measurement of a structure.
  for (const claim of kimura) {
    assert.equal(claim.datingMethod, "claimant_inference", "a claimant's reading filed as a measurement");
  }
});

test("a date nobody can trace to its claimant is not seeded", () => {
  const flagged = CLAIMS.filter(({ claim }) =>
    /NEEDS SOURCE VERIFICATION/.test(`${claim.evidence} ${claim.notes ?? ""}`)
  );
  assert.ok(flagged.length >= 1, "expected the untraceable material to be marked rather than quietly used");
  // The Cayce 1968/69 expectation is the case in point: widely repeated, and
  // the reading number could not be traced, so it must not appear as a date.
  for (const { claim } of CLAIMS) {
    if (!/Cayce|reading/i.test(claim.originalDateText)) continue;
    assert.match(claim.originalDateText, /440-5|1933/, "a Cayce claim that is not the one reading that was verified");
  }
});

test("the traditional identification at Dwarka is not converted into a date", () => {
  const text = textOf("dwarka-offshore-excavation");
  assert.match(text, /Mahabharata|Dvaraka/i, "the identification is missing, which is part of why the site was searched");
  assert.match(
    text,
    /not converted into a date|none is seeded|does not supply a year/i,
    "nothing says why no traditional date is on the record"
  );
  // And no claim may carry one.
  for (const claim of byslug("dwarka-offshore-excavation").claims) {
    assert.doesNotMatch(
      claim.originalDateText,
      /Mahabharata|Kali Yuga|Krishna/i,
      "a traditional account has been turned into a dated claim"
    );
  }
});

// ---------------------------------------------------------------------------
// THE HOUSE RULES
// ---------------------------------------------------------------------------

test("every claim says what it dates, by what method, and what it does not establish", () => {
  for (const { slug, claim } of CLAIMS) {
    assert.match(claim.evidence, /WHAT IS DATED/, `${slug}: no statement of what is dated`);
    assert.match(claim.evidence, /DATING METHOD/, `${slug}: no dating method in the evidence`);
    assert.match(claim.evidence, /WHAT IT DOES NOT ESTABLISH/, `${slug}: no statement of what it does not establish`);
    assert.ok((claim.whatIsDated ?? "").trim().length > 10, `${slug}: whatIsDated missing or thin`);
  }
});

test("every years-ago figure is converted from before-present rather than copied", () => {
  // 9,500 BP is −7550, not −9500.
  //
  // A ROUNDNESS CHECK IS NOT ENOUGH, and finding that out is why this reads the
  // way it does. −9500 is what you get by carrying 9,500 BP straight across,
  // and it is not divisible by 1000, so a test that only asks "is the stored
  // year round" passes it. So this reads the BP figure out of the claim's own
  // date text and does the arithmetic: a conversion either lands on 1950 − bp
  // or it is not a conversion.
  const checked: string[] = [];
  for (const { slug, claim } of CLAIMS) {
    if (claim.dateConvention !== "before_present") continue;
    // Only figures that are actually carrying the unit, so a publication year
    // sitting in the same sentence ("Shinn's 1977 core", "the Congress in 2007")
    // is not mistaken for an age. A range has to be read as a range: the first
    // attempt matched only the number adjacent to the unit and so read
    // "between 10,000 and 8,000 years ago" as 8,000.
    const figures = [
      ...claim.originalDateText.matchAll(
        /([\d,]{3,})(?:\s*(?:to|and|–|-)\s*([\d,]{3,}))?\s*(?:±\s*[\d,]+\s*)?(?:years?\s*(?:BP|before present|ago)?|BP|before present)/gi
      ),
    ]
      .flatMap((found) => [found[1], found[2]])
      .filter((value): value is string => Boolean(value))
      .map((value) => Number(value.replace(/,/g, "")))
      .filter((value) => Number.isFinite(value));
    if (figures.length === 0) continue;
    // The largest figure in the text is the older end, which is where startYear
    // sits; a range's younger end belongs to endYear.
    const oldest = Math.max(...figures);
    const youngest = Math.min(...figures);
    assert.equal(
      claim.startYear,
      1950 - oldest,
      `${slug}: date text says ${oldest} BP, so startYear should be ${1950 - oldest} and is ${claim.startYear}`
    );
    if (figures.length > 1 && claim.endYear != null) {
      assert.equal(
        claim.endYear,
        1950 - youngest,
        `${slug}: date text says ${youngest} BP, so endYear should be ${1950 - youngest} and is ${claim.endYear}`
      );
    }
    checked.push(slug);
  }
  assert.ok(checked.length >= 5, `only ${checked.length} BP claims were actually checked`);
});

test("a stated tolerance is kept as a tolerance and never folded into an end year", () => {
  // "9350 ± 200 BP" and "between 9550 and 9150 BP" are different assertions.
  const pantelleria = byslug("pantelleria-vecchia-monolith").claims.find(
    (claim) => claim.datingMethod === "sea_level_reconstruction"
  );
  assert.ok(pantelleria);
  assert.equal(pantelleria!.uncertaintyPlus, 200);
  assert.equal(pantelleria!.uncertaintyMinus, 200);
  assert.equal(pantelleria!.endYear, undefined, "a tolerance has been turned into a span");
});

test("no two claims on a record share their date text, because citations are matched by it", () => {
  for (const event of ANCIENT_SITES_SUBMERGED_EVENTS) {
    const texts = event.claims.map((claim) => claim.originalDateText);
    for (const text of texts) assert.ok(text && text.trim().length > 0, `${event.slug}: a claim with no date text`);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: two claims share their date text`);
  }
});

test("nothing carries a confidence score or a verdict label", () => {
  const score = /\b(confidence|credibility|reliability|plausibility)\s*(score|rating|level|%)/i;
  const verdict = /\b(debunked|disproven|proven true|proved false)\b/i;
  for (const event of ANCIENT_SITES_SUBMERGED_EVENTS) {
    const text = textOf(event.slug);
    assert.doesNotMatch(text, score, `${event.slug}: a score`);
    assert.doesNotMatch(text, verdict, `${event.slug}: a verdict label`);
  }
});

test("nobody in this dataset is dismissed rather than answered", () => {
  const dismissal = /\b(pseudo\w*|crackpot|fringe|crank|hoax|fraud)\b/gi;
  for (const event of ANCIENT_SITES_SUBMERGED_EVENTS) {
    const text = textOf(event.slug);
    for (const found of text.matchAll(dismissal)) {
      const before = text.slice(Math.max(0, found.index - 60), found.index);
      assert.match(
        before,
        /\b(not|neither|never|no|nor|rather than|far from|title|word)\b/i,
        `${event.slug}: "${found[0]}" decides the question for the reader`
      );
    }
  }
});

test("every claim and citation points at a source that exists", () => {
  const known = new Set(ANCIENT_SITES_SUBMERGED_SOURCES.map((source) => source.key));
  for (const { slug, claim } of CLAIMS) {
    if (claim.sourceKey) assert.ok(known.has(claim.sourceKey), `${slug}: unknown source ${claim.sourceKey}`);
    for (const citation of claim.citations ?? []) {
      assert.ok(known.has(citation.sourceKey), `${slug}: unknown cited source ${citation.sourceKey}`);
    }
  }
});

test("an alternative date is sourced to its claimant rather than to a description of them", () => {
  const byKey = new Map(ANCIENT_SITES_SUBMERGED_SOURCES.map((source) => [source.key, source]));
  for (const { slug, claim } of CLAIMS) {
    if (claim.chronology !== "alternative") continue;
    const source = byKey.get(claim.sourceKey ?? "");
    assert.ok(source, `${slug}: alternative claim with no source`);
    // Kimura's superseded figure is the one exception and it says so in its own
    // notes: it is carried precisely because it is the figure in circulation,
    // and it is cross-cited to his own later statement.
    if (source!.sourceType === "wikipedia") {
      assert.match(
        claim.notes ?? "",
        /circulation|NOT Kimura's final position/i,
        `${slug}: an alternative date on a tertiary source with no explanation`
      );
      assert.ok(
        (claim.citations ?? []).some((citation) => citation.sourceKey === "kimura_congress2007"),
        `${slug}: a claim attributed to Kimura that does not cite Kimura`
      );
    }
  }
});

test("no source is cited without saying what it is cited for", () => {
  for (const source of ANCIENT_SITES_SUBMERGED_SOURCES) {
    assert.ok(source.notes && source.notes.trim().length > 50, `${source.key}: notes missing or too thin`);
  }
});

test("every source is used, every record uniquely slugged, every link real", () => {
  const used = new Set<string>();
  for (const { claim } of CLAIMS) {
    if (claim.sourceKey) used.add(claim.sourceKey);
    for (const citation of claim.citations ?? []) used.add(citation.sourceKey);
  }
  for (const source of ANCIENT_SITES_SUBMERGED_SOURCES) {
    assert.ok(used.has(source.key), `${source.key}: seeded but never cited`);
  }
  const slugs = ANCIENT_SITES_SUBMERGED_EVENTS.map((event) => event.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  assert.ok(slugs.includes(ANCIENT_SITES_SUBMERGED_ANCHOR_SLUG));
  for (const link of ANCIENT_SITES_SUBMERGED_LINKS) {
    assert.ok(new Set(slugs).has(link.from), `link from unknown ${link.from}`);
    assert.ok(new Set(slugs).has(link.to), `link to unknown ${link.to}`);
    assert.ok(link.note && link.note.trim().length > 20, `link ${link.from}→${link.to}: no note`);
  }
});
