import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ANCIENT_SITES_WORKED_STONE_EVENTS,
  ANCIENT_SITES_WORKED_STONE_SOURCES,
  ANCIENT_SITES_WORKED_STONE_LINKS,
  ANCIENT_SITES_WORKED_STONE_ANCHOR_SLUG,
} from "./ancient-sites-worked-stone-seed";
import {
  DATING_METHODS,
  CLAIM_VIEWPOINTS,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
  EVENT_RELATIONS,
} from "./taxonomy";

const CLAIMS = ANCIENT_SITES_WORKED_STONE_EVENTS.flatMap((event) =>
  event.claims.map((claim) => ({ slug: event.slug, claim }))
);
const keys = (list: readonly { key: string }[]) => new Set(list.map((entry) => entry.key));
const byslug = (slug: string) => {
  const found = ANCIENT_SITES_WORKED_STONE_EVENTS.find((event) => event.slug === slug);
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

  for (const event of ANCIENT_SITES_WORKED_STONE_EVENTS) {
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: eventType ${event.eventType}`);
    for (const claim of event.claims) {
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: datingMethod ${claim.datingMethod}`);
      assert.ok(viewpoints.has(claim.chronology), `${event.slug}: chronology ${claim.chronology}`);
    }
  }
  for (const source of ANCIENT_SITES_WORKED_STONE_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType ?? "other"), `${source.key}: sourceType ${source.sourceType}`);
  }
  for (const link of ANCIENT_SITES_WORKED_STONE_LINKS) {
    assert.ok(relations.has(link.relation), `link ${link.from}→${link.to}: relation ${link.relation}`);
  }
});

// ---------------------------------------------------------------------------
// THE DISTINCTION THIS TRANCHE IS BUILT ON
//
// An astronomical alignment date is not a construction date — UNLESS what is
// dated is an act the builders performed. Spence dated the orienting; Bauval's
// calculation dates a configuration of stars. The difference has to be legible
// in the data and not only in the prose.
// ---------------------------------------------------------------------------

test("an astronomical claim says whether it dates an act or a sky", () => {
  const astronomical = CLAIMS.filter(({ claim }) => claim.datingMethod === "astronomical");
  assert.equal(astronomical.length, 2, `expected two astronomical claims, found ${astronomical.length}`);
  for (const { slug, claim } of astronomical) {
    assert.match(
      claim.whatIsDated ?? "",
      /\b(act of|orienting|configuration|stars|sky)\b/i,
      `${slug}: an astronomical claim whose subject is vague — "${claim.whatIsDated}"`
    );
  }
  // And they must not both say the same thing, because they are not the same thing.
  assert.notEqual(astronomical[0].claim.whatIsDated, astronomical[1].claim.whatIsDated);
});

test("the Orion claim dates a sky and says so where a reader will see it", () => {
  const claim = byslug("giza-pyramids-dated").claims.find((c) => /Orion/i.test(c.originalDateText));
  assert.ok(claim, "no Orion claim");
  assert.match(claim!.whatIsDated ?? "", /configuration of stars|sky/i, "the Orion claim does not say it dates a sky");
  assert.doesNotMatch(
    claim!.whatIsDated ?? "",
    /\b(pyramids?|construction|built|building)\b/i,
    "the Orion claim presents itself as dating the pyramids"
  );
  assert.match(
    claim!.evidence,
    /WHAT IT DOES NOT ESTABLISH[^]*?(built|anything was built)/i,
    "the Orion claim does not say it establishes nothing about building"
  );
});

test("Bauval's published claim is not inflated into one he did not make", () => {
  const text = textOf("giza-pyramids-dated");
  assert.match(
    text,
    /narrower than the version in circulation|not what the paper says|does not put it in his mouth/i,
    "nothing distinguishes what Bauval published from what circulates under his name"
  );
  assert.match(text, /NEEDS SOURCE VERIFICATION/, "the untraced part of his position is not flagged");
  // His own publication, not a description of him.
  const claim = byslug("giza-pyramids-dated").claims.find((c) => /Orion/i.test(c.originalDateText));
  assert.equal(claim!.sourceKey, "bauval1989", "the Orion date is not sourced to Bauval's own paper");
});

test("the alignment that does date a building says why it can", () => {
  const claim = byslug("giza-pyramids-dated").claims.find((c) => c.sourceKey === "spence2000");
  assert.ok(claim, "no Spence claim");
  assert.match(claim!.whatIsDated ?? "", /act of orienting/i, "Spence's claim does not say it dates an act");
  assert.match(
    `${claim!.evidence} ${claim!.notes ?? ""}`,
    /an act|action, performed by people|the builders performed/i,
    "nothing explains why this alignment is a construction date when the other is not"
  );
  // A mainstream paper that was argued with must show the argument.
  assert.ok(
    (claim!.citations ?? []).some((citation) => citation.relation === "disputes"),
    "a contested mainstream date with no dissent cited"
  );
});

// ---------------------------------------------------------------------------
// STYLE IS NOT A DATING METHOD, AND NAVILLE IS NOT A CRANK
// ---------------------------------------------------------------------------

test("a date argued from masonry style is recorded under stylistic comparison", () => {
  const claim = byslug("osireion-abydos").claims.find((c) => /Naville/i.test(c.originalDateText));
  assert.ok(claim, "Naville's claim is missing");
  assert.equal(claim!.datingMethod, "stylistic_comparison", "a style argument filed as something else");
  assert.match(claim!.evidence, /WHAT IS DATED: nothing directly/, "a style argument presented as a measurement");
  assert.match(
    `${claim!.evidence} ${claim!.notes ?? ""}`,
    /revived|imitated|archai/i,
    "does not say why resemblance is not a date"
  );
});

test("the limitation of a style argument is not aimed only at the inconvenient answer", () => {
  // The easy and wrong move: treat "style cannot date a building" as a tool for
  // rejecting Naville rather than as a fact about the method.
  const claim = byslug("osireion-abydos").claims.find((c) => /Naville/i.test(c.originalDateText));
  assert.match(
    claim!.notes ?? "",
    /belongs to arguments from style generally|not to him|would apply in exactly the same way/i,
    "the limitation is written as an objection to Naville rather than to the method"
  );
  assert.match(textOf("osireion-abydos"), /Egyptologist|specialist/i, "Naville's standing is not stated");
});

test("the cartouche dates what it is cut into, and the record says what is uninscribed", () => {
  const claim = byslug("osireion-abydos").claims.find((c) => /cartouche/i.test(c.originalDateText));
  assert.ok(claim, "no cartouche claim");
  assert.match(
    claim!.whatIsDated ?? "",
    /entrance passage|corridor/i,
    "the cartouche is presented as dating the whole structure"
  );
  assert.match(
    `${claim!.evidence} ${claim!.notes ?? ""}`,
    /none of the main interior blocks|not inscribed|absence of any inscription/i,
    "the absence of interior inscription is left out, which is the part that matters"
  );
});

// ---------------------------------------------------------------------------
// BAALBEK: THE QUARRY IS THE EVIDENCE
// ---------------------------------------------------------------------------

test("the unfinished quarry work is a claim and not a colourful detail", () => {
  const baalbek = byslug(ANCIENT_SITES_WORKED_STONE_ANCHOR_SLUG);
  const quarry = baalbek.claims.find((claim) => /quarry/i.test(claim.originalDateText));
  assert.ok(quarry, "the quarry excavation has no claim of its own");
  assert.match(
    `${quarry!.evidence} ${quarry!.notes ?? ""}`,
    /tooling marks|machining marks|abandoned|flaw/i,
    "the quarry claim does not say what the marks show"
  );
  assert.match(
    textOf(ANCIENT_SITES_WORKED_STONE_ANCHOR_SLUG),
    /nobody did move these|never moved at all/i,
    "the record does not make the point the quarry actually settles"
  );
});

test("a bracket that could not be narrowed says so instead of being invented", () => {
  const roman = byslug(ANCIENT_SITES_WORKED_STONE_ANCHOR_SLUG).claims.find(
    (claim) => claim.datingMethod === "archaeological"
  );
  assert.ok(roman, "no claim for the Roman sanctuary");
  assert.match(
    `${roman!.evidence} ${roman!.notes ?? ""}`,
    /NEEDS SOURCE VERIFICATION/,
    "a deliberately wide bracket with nothing saying why it is wide"
  );
  assert.equal(roman!.isApproximate, true);
  assert.ok(
    (roman!.endYear ?? 0) - (roman!.startYear ?? 0) >= 100,
    "a bracket narrower than the evidence supports"
  );
});

// ---------------------------------------------------------------------------
// THE ACCEPTED CHRONOLOGY IS A CLAIM TOO
// ---------------------------------------------------------------------------

test("the conventional date is on the record rather than assumed as the background", () => {
  const regnal = byslug("giza-pyramids-dated").claims.find((c) => c.datingMethod === "regnal_chronology");
  assert.ok(regnal, "the 4th-Dynasty attribution is not a claim");
  assert.equal(regnal!.chronology, "conventional");
  assert.match(
    `${regnal!.evidence} ${regnal!.notes ?? ""}`,
    /reconstruction|king lists|WHAT IT DOES NOT ESTABLISH/,
    "the conventional date is stated without a method"
  );
});

test("messy mainstream evidence is reported as messy", () => {
  // The radiocarbon at Giza runs older than the textbook date and scatters over
  // centuries. A record that smoothed that over would be misleading in the
  // direction that feels safe, which is still misleading.
  const c14 = byslug("giza-pyramids-dated").claims.find((c) => c.datingMethod === "radiocarbon");
  assert.ok(c14, "no radiocarbon claim");
  assert.match(c14!.originalDateText, /scatter|older than/i, "the scatter is not in the date text");
  assert.match(`${c14!.evidence} ${c14!.notes ?? ""}`, /old wood/i, "the usual explanation is not given");
  assert.match(
    `${c14!.evidence} ${c14!.notes ?? ""}`,
    /tidier than the evidence|same mistake|both wrong|pointed the other way/i,
    "does not warn against the tidy reading in either direction"
  );
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

test("every BCE year is stored in astronomical numbering", () => {
  // 1290 BCE is −1289, not −1290. A stored year whose absolute value matches a
  // round BCE figure exactly is the tell for the off-by-one.
  for (const { slug, claim } of CLAIMS) {
    if (claim.dateConvention === "before_present") continue;
    for (const [field, year] of [["startYear", claim.startYear], ["endYear", claim.endYear]] as const) {
      if (year == null || year >= 0) continue;
      // Range-aware: "about 1290 to 1279 BCE" states TWO figures, and a regex
      // anchored on the unit sees only the second — which would let an
      // off-by-one on the start of a range through. Written this way after
      // checking that the anchored version could not catch one.
      if (!/BCE/i.test(claim.originalDateText)) continue;
      const figures = [...claim.originalDateText.matchAll(/\b([\d,]{3,})\b/g)].map((found) =>
        Number(found[1].replace(/,/g, ""))
      );
      if (figures.length === 0) continue;
      assert.ok(
        !figures.includes(-year),
        `${slug}: ${field} is ${year} and the text says ${-year} BCE — astronomical numbering makes that ${1 - -year}`
      );
    }
  }
});

test("a stated tolerance stays a tolerance", () => {
  const spence = byslug("giza-pyramids-dated").claims.find((c) => c.sourceKey === "spence2000");
  assert.equal(spence!.uncertaintyPlus, 5);
  assert.equal(spence!.uncertaintyMinus, 5);
  assert.equal(spence!.endYear, undefined, "a ± figure has been turned into a span");
});

test("no two claims on a record share their date text, because citations are matched by it", () => {
  for (const event of ANCIENT_SITES_WORKED_STONE_EVENTS) {
    const texts = event.claims.map((claim) => claim.originalDateText);
    for (const text of texts) assert.ok(text && text.trim().length > 0, `${event.slug}: a claim with no date text`);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: two claims share their date text`);
  }
});

test("nothing carries a confidence score or a verdict label", () => {
  const score = /\b(confidence|credibility|reliability|plausibility)\s*(score|rating|level|%)/i;
  const verdict = /\b(debunked|disproven|proven true|proved false)\b/i;
  for (const event of ANCIENT_SITES_WORKED_STONE_EVENTS) {
    const text = textOf(event.slug);
    assert.doesNotMatch(text, score, `${event.slug}: a score`);
    assert.doesNotMatch(text, verdict, `${event.slug}: a verdict label`);
  }
});

test("nobody is dismissed rather than answered", () => {
  const dismissal = /\b(pseudo\w*|crackpot|fringe|crank|hoax|fraud|nonsense)\b/gi;
  for (const event of ANCIENT_SITES_WORKED_STONE_EVENTS) {
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

test("an alternative date is sourced to its claimant's own publication", () => {
  const byKey = new Map(ANCIENT_SITES_WORKED_STONE_SOURCES.map((source) => [source.key, source]));
  for (const { slug, claim } of CLAIMS) {
    if (claim.chronology !== "alternative") continue;
    const source = byKey.get(claim.sourceKey ?? "");
    assert.ok(source, `${slug}: alternative claim with no source`);
    assert.notEqual(source!.sourceType, "wikipedia", `${slug}: an alternative date sourced to Wikipedia`);
    assert.notEqual(source!.sourceType, "website", `${slug}: an alternative date sourced to a website`);
    assert.ok(source!.author, `${slug}: an alternative date on a source with no named author`);
  }
});

test("every claim and citation points at a source that exists, and every source is used", () => {
  const known = new Set(ANCIENT_SITES_WORKED_STONE_SOURCES.map((source) => source.key));
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
  for (const source of ANCIENT_SITES_WORKED_STONE_SOURCES) {
    assert.ok(used.has(source.key), `${source.key}: seeded but never cited`);
  }
});

test("no source is cited without saying what it is cited for", () => {
  for (const source of ANCIENT_SITES_WORKED_STONE_SOURCES) {
    assert.ok(source.notes && source.notes.trim().length > 50, `${source.key}: notes missing or too thin`);
  }
});

test("every record is uniquely slugged and every link joins records that exist", () => {
  const slugs = ANCIENT_SITES_WORKED_STONE_EVENTS.map((event) => event.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  assert.ok(slugs.includes(ANCIENT_SITES_WORKED_STONE_ANCHOR_SLUG));
  for (const link of ANCIENT_SITES_WORKED_STONE_LINKS) {
    assert.ok(new Set(slugs).has(link.from), `link from unknown ${link.from}`);
    assert.ok(new Set(slugs).has(link.to), `link to unknown ${link.to}`);
    assert.ok(link.note && link.note.trim().length > 20, `link ${link.from}→${link.to}: no note`);
  }
});
