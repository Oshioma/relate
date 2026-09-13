import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ANCIENT_SITES_EXCAVATED_EVENTS,
  ANCIENT_SITES_EXCAVATED_SOURCES,
  ANCIENT_SITES_EXCAVATED_LINKS,
  ANCIENT_SITES_EXCAVATED_ANCHOR_SLUG,
} from "./ancient-sites-excavated-seed";
import {
  DATING_METHODS,
  CLAIM_VIEWPOINTS,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
  EVENT_RELATIONS,
  DATE_CONVENTIONS,
} from "./taxonomy";

const CLAIMS = ANCIENT_SITES_EXCAVATED_EVENTS.flatMap((event) =>
  event.claims.map((claim) => ({ slug: event.slug, claim }))
);
const keys = (list: readonly { key: string }[]) => new Set(list.map((entry) => entry.key));
const byslug = (slug: string) => {
  const found = ANCIENT_SITES_EXCAVATED_EVENTS.find((event) => event.slug === slug);
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

/** The three whose extraordinary claims the evidence carried. */
const ACCEPTED = ["karahan-tepe-excavated", "tell-qaramel-towers", "nabta-playa-megaliths"];
/** The two that are landforms read as architecture. */
const LANDFORMS = ["visocica-pyramid-claim", "gornaya-shoria-megaliths"];

test("every vocabulary key is real", () => {
  const methods = keys(DATING_METHODS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const sourceTypes = keys(TIMELINE_SOURCE_TYPES);
  const relations = keys(EVENT_RELATIONS);
  const conventions = keys(DATE_CONVENTIONS);

  for (const event of ANCIENT_SITES_EXCAVATED_EVENTS) {
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: eventType ${event.eventType}`);
    for (const claim of event.claims) {
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: datingMethod ${claim.datingMethod}`);
      assert.ok(viewpoints.has(claim.chronology), `${event.slug}: chronology ${claim.chronology}`);
      if (claim.dateConvention) {
        assert.ok(conventions.has(claim.dateConvention), `${event.slug}: dateConvention ${claim.dateConvention}`);
      }
    }
  }
  for (const source of ANCIENT_SITES_EXCAVATED_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType ?? "other"), `${source.key}: sourceType ${source.sourceType}`);
  }
  for (const link of ANCIENT_SITES_EXCAVATED_LINKS) {
    assert.ok(relations.has(link.relation), `link ${link.from}→${link.to}: relation ${link.relation}`);
  }
});

// ---------------------------------------------------------------------------
// THE THESIS OF THE TRANCHE, MADE STRUCTURAL
//
// The accepted records must show the procedure that earned them their date. The
// landform records must carry no date for a structure at all. If either side
// drifts, the comparison the group exists to draw stops working.
// ---------------------------------------------------------------------------

test("each accepted record shows the procedure that earned its date", () => {
  for (const slug of ACCEPTED) {
    const text = textOf(slug);
    assert.match(
      text,
      /excavat|samples?|stratigraph|radiocarbon/i,
      `${slug}: nothing says how the date was actually obtained`
    );
    const dated = byslug(slug).claims.filter((claim) =>
      ["radiocarbon", "stratigraphic", "archaeological"].includes(claim.datingMethod)
    );
    assert.ok(dated.length >= 1, `${slug}: no claim carrying a measured or excavated date`);
  }
});

test("no landform record carries a date for a structure", () => {
  // The whole point. A date on a hill, presented as the hill's construction,
  // would make these records indistinguishable from the accepted ones.
  for (const slug of LANDFORMS) {
    for (const claim of byslug(slug).claims) {
      if (claim.datingMethod === "historical_record") continue; // a report or an expedition
      assert.ok(
        claim.datingMethod === "claimant_inference",
        `${slug}: a "${claim.datingMethod}" claim — nothing here has been measured, so only an inference is honest`
      );
    }
    // And at least one claim must be the prior question, dating nothing.
    const prior = byslug(slug).claims.filter((claim) => /whether/i.test(claim.whatIsDated ?? ""));
    assert.ok(prior.length >= 1, `${slug}: no claim for the is-it-built question`);
    for (const claim of prior) {
      assert.match(claim.evidence, /WHAT IS DATED: nothing/, `${slug}: the prior question presents itself as a date`);
    }
  }
});

test("each landform record names the geological process, not just a denial", () => {
  // Checked in TWO places a reader actually looks: the description, and the
  // interpretation claim's own evidence. An earlier version searched the whole
  // record and so passed a gutted description, because a claim note elsewhere
  // still happened to carry the word. That failure mode has now bitten this
  // dataset in three tranches running, so it is tested for on purpose.
  const named: Record<string, RegExp> = {
    "visocica-pyramid-claim": /flatiron/i,
    "gornaya-shoria-megaliths": /\btors?\b/i,
  };
  const mechanism: Record<string, RegExp> = {
    "visocica-pyramid-claim": /tilt|differential erosion|sedimentary beds/i,
    "gornaya-shoria-megaliths": /orthogonal joint|spheroidal weathering|corestone/i,
  };
  for (const slug of LANDFORMS) {
    const event = byslug(slug);
    assert.match(event.description, named[slug], `${slug}: the landform type is not named in the description`);
    assert.match(event.description, mechanism[slug], `${slug}: the mechanism is not described where a reader reads`);

    const interpretation = event.claims.find((claim) => /whether/i.test(claim.whatIsDated ?? ""));
    assert.ok(interpretation, `${slug}: no interpretation claim`);
    assert.match(
      interpretation!.evidence,
      named[slug],
      `${slug}: the claim that answers the question does not name the landform`
    );
    assert.match(
      interpretation!.evidence,
      mechanism[slug],
      `${slug}: the claim does not give the mechanism, so it is an assertion rather than an explanation`
    );
    // A named process is an explanation; "it's natural" is an assertion.
    assert.match(
      `${event.description} ${interpretation!.evidence}`,
      /known (process|mechanism)|expected product|requiring nobody|without anyone/i,
      `${slug}: does not say the process produces the form without a builder`
    );
  }
});

test("the straight-lines point is made once, plainly, and tied to the other sites", () => {
  // In the DESCRIPTION. It is the one fact worth carrying away from the whole
  // dataset, so it has to be where a reader meets the record, not tucked into a
  // claim note.
  const description = byslug("gornaya-shoria-megaliths").description;
  assert.match(description, /fractures? in straight lines/i, "the one transferable fact is never stated");
  assert.match(description, /right angle\b[^.]*\bis not a signature/i, "does not say what follows from it");
  assert.match(description, /Yonaguni/i, "not connected to the other records with the same answer");
});

// ---------------------------------------------------------------------------
// A SHARP PUBLISHED JUDGEMENT IS QUOTED, NOT ADOPTED
// ---------------------------------------------------------------------------

test("Harding's words are attributed and the record does not adopt them", () => {
  const text = textOf("visocica-pyramid-claim");
  assert.match(text, /Harding/, "the author of the judgement is not named");
  assert.match(text, /his own words|in his words/i, "the quotation is not marked as his");
  assert.match(
    text,
    /DOES NOT ADOPT|does not make those|claim about intent/i,
    "nothing says the record declines to make the intent claim itself"
  );
  // And the record's own evidence must be the geology.
  assert.match(text, /cores?|conglomerate/i, "the load-bearing evidence is missing");
});

test("nobody is dismissed rather than answered, and a quoted judgement is allowed to be quoted", () => {
  // "Hoax" is a claim about intent. It may appear here only as somebody's
  // attributed published words, or with a denial in front of it — never as this
  // dataset's own verdict.
  const dismissal = /\b(pseudo\w*|crackpot|fringe|crank|hoax|fraud|nonsense)\b/gi;
  for (const event of ANCIENT_SITES_EXCAVATED_EVENTS) {
    const text = textOf(event.slug);
    for (const found of text.matchAll(dismissal)) {
      const before = text.slice(Math.max(0, found.index - 90), found.index);
      const negated = /\b(not|neither|never|no|nor|rather than|far from)\b/i.test(before);
      const quoted = /['"“‘]\s*\w*$|\b(words|wrote|describing|described|quoted|letter|phrase)\b/i.test(before);
      assert.ok(
        negated || quoted,
        `${event.slug}: "${found[0]}" is neither denied nor attributed to whoever published it`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// THE CLAIMANT'S OWN POSITION, AND HOW FIRM EACH STRAND OF A DATE IS
// ---------------------------------------------------------------------------

test("Osmanagić's claim is sourced to him and carried as his inference", () => {
  const claim = byslug("visocica-pyramid-claim").claims.find((c) => /Osmanagić/i.test(c.originalDateText));
  assert.ok(claim, "the claimant's own date is missing");
  assert.equal(claim!.datingMethod, "claimant_inference", "a claim from a shape filed as a measurement");
  assert.equal(claim!.chronology, "alternative");
  assert.match(
    `${claim!.evidence} ${claim!.notes ?? ""}`,
    /no sample|has been dated to support/i,
    "does not say that nothing has been dated to support the figure"
  );
  // His reported later revision must be flagged rather than asserted.
  assert.match(claim!.notes ?? "", /NEEDS SOURCE VERIFICATION/, "an untraced later figure stated as fact");
});

test("Karahan Tepe says which strand of its date is measured and which is a comparison", () => {
  // The description, for the same reason as above: a reader decides how much to
  // trust this date from what they read first.
  const description = byslug(ANCIENT_SITES_EXCAVATED_ANCHOR_SLUG).description;
  assert.match(description, /Göbekli Tepe/, "the comparison site is not named in the description");
  assert.match(
    description,
    /comparison is weaker than measurement|which parts .* measured|leans harder on the comparative/i,
    "the description does not distinguish the measured strand from the matched one"
  );
  // Two claims of unequal strength, kept separate.
  const claims = byslug(ANCIENT_SITES_EXCAVATED_ANCHOR_SLUG).claims;
  assert.ok(claims.length >= 2, "the looser earliest-structures reading has been folded into the main date");
  const earliest = claims.find((claim) => /earliest/i.test(claim.originalDateText));
  assert.ok(earliest, "no claim for the earliest structures");
  assert.ok(
    (earliest!.startYear ?? 0) < (claims[0].startYear ?? 0),
    "the looser claim is not the older one, so one of them is mislabelled"
  );
});

test("Nabta Playa keeps its date and its astronomy as separate claims", () => {
  const claims = byslug("nabta-playa-megaliths").claims;
  const date = claims.find((claim) => claim.datingMethod === "radiocarbon");
  const sky = claims.find((claim) => claim.datingMethod === "astronomical");
  assert.ok(date && sky, "the date and the alignment are not both present");
  assert.notEqual(date!.whatIsDated, sky!.whatIsDated, "the date and the interpretation claim the same subject");
  assert.match(sky!.evidence, /WHAT IS DATED: nothing/, "the alignment presents itself as dating something");
  // The authors' own caution is the reason this record sits among the accepted.
  assert.match(
    `${sky!.evidence} ${sky!.notes ?? ""}`,
    /sand moves|badly damaged|authors said|certainty is not available/i,
    "the excavators' own statement of the limits is missing"
  );
});

test("an accepted record is not treated as needing less evidence than a disputed one", () => {
  for (const { slug, claim } of CLAIMS) {
    assert.match(claim.evidence, /WHAT IS DATED/, `${slug}: no statement of what is dated`);
    assert.match(claim.evidence, /DATING METHOD/, `${slug}: no dating method in the evidence`);
    assert.match(claim.evidence, /WHAT IT DOES NOT ESTABLISH/, `${slug}: no statement of what it does not establish`);
    assert.ok((claim.whatIsDated ?? "").trim().length > 10, `${slug}: whatIsDated missing or thin`);
  }
});

// ---------------------------------------------------------------------------
// THE HOUSE RULES
// ---------------------------------------------------------------------------

test("every BCE year is stored in astronomical numbering", () => {
  for (const { slug, claim } of CLAIMS) {
    if (claim.dateConvention === "before_present") continue;
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

test("every years-ago figure is converted from before-present rather than copied", () => {
  for (const { slug, claim } of CLAIMS) {
    if (claim.dateConvention !== "before_present") continue;
    const figures = [
      ...claim.originalDateText.matchAll(
        /([\d,]{3,})(?:\s*(?:to|and|–|-)\s*([\d,]{3,}))?\s*(?:±\s*[\d,]+\s*)?(?:years?\s*(?:BP|before present|ago|old)?|BP|before present)/gi
      ),
    ]
      .flatMap((found) => [found[1], found[2]])
      .filter((value): value is string => Boolean(value))
      .map((value) => Number(value.replace(/,/g, "")));
    if (figures.length === 0) continue;
    assert.equal(
      claim.startYear,
      1950 - Math.max(...figures),
      `${slug}: date text says ${Math.max(...figures)} years, so startYear should be ${1950 - Math.max(...figures)}`
    );
  }
});

test("a figure nobody could trace is flagged, not seeded", () => {
  const flagged = CLAIMS.filter(({ claim }) =>
    /NEEDS SOURCE VERIFICATION/.test(`${claim.evidence} ${claim.notes ?? ""}`)
  );
  assert.ok(flagged.length >= 2, "expected the untraced figures to be marked");
  // Gornaya Shoria's circulating age in particular must not be a claim.
  for (const claim of byslug("gornaya-shoria-megaliths").claims) {
    assert.ok(
      (claim.startYear ?? 0) > 0,
      `gornaya-shoria-megaliths: a prehistoric date has been seeded for a site with no excavation`
    );
    // And the date text must not assert an age for the blocks either — a claim
    // can read as a prehistoric date while its stored year says 2013.
    assert.doesNotMatch(
      claim.originalDateText,
      /\b(?:structures?|blocks?|walls?)\b[^.]*\b\d[\d,]*\s*(?:years|BCE|BP)/i,
      `gornaya-shoria-megaliths: a date text claiming an age for the blocks`
    );
  }
  assert.match(
    textOf("gornaya-shoria-megaliths"),
    /hundred thousand|circulate/i,
    "the circulating figure is not acknowledged at all, which reads as hiding it"
  );
});

test("no two claims on a record share their date text, because citations are matched by it", () => {
  for (const event of ANCIENT_SITES_EXCAVATED_EVENTS) {
    const texts = event.claims.map((claim) => claim.originalDateText);
    for (const text of texts) assert.ok(text && text.trim().length > 0, `${event.slug}: a claim with no date text`);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: two claims share their date text`);
  }
});

test("nothing carries a confidence score or a verdict label", () => {
  const score = /\b(confidence|credibility|reliability|plausibility)\s*(score|rating|level|%)/i;
  const verdict = /\b(debunked|disproven|proven true|proved false)\b/i;
  for (const event of ANCIENT_SITES_EXCAVATED_EVENTS) {
    const text = textOf(event.slug);
    assert.doesNotMatch(text, score, `${event.slug}: a score`);
    assert.doesNotMatch(text, verdict, `${event.slug}: a verdict label`);
  }
});

test("every claim and citation points at a source that exists, and every source is used", () => {
  const known = new Set(ANCIENT_SITES_EXCAVATED_SOURCES.map((source) => source.key));
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
  for (const source of ANCIENT_SITES_EXCAVATED_SOURCES) {
    assert.ok(used.has(source.key), `${source.key}: seeded but never cited`);
  }
});

test("no source is cited without saying what it is cited for", () => {
  for (const source of ANCIENT_SITES_EXCAVATED_SOURCES) {
    assert.ok(source.notes && source.notes.trim().length > 50, `${source.key}: notes missing or too thin`);
  }
});

test("every record is uniquely slugged and every link joins records that exist", () => {
  const slugs = ANCIENT_SITES_EXCAVATED_EVENTS.map((event) => event.slug);
  assert.equal(new Set(slugs).size, slugs.length, "duplicate slug");
  assert.ok(slugs.includes(ANCIENT_SITES_EXCAVATED_ANCHOR_SLUG));
  for (const link of ANCIENT_SITES_EXCAVATED_LINKS) {
    assert.ok(new Set(slugs).has(link.from), `link from unknown ${link.from}`);
    assert.ok(new Set(slugs).has(link.to), `link to unknown ${link.to}`);
    assert.ok(link.note && link.note.trim().length > 20, `link ${link.from}→${link.to}: no note`);
  }
});
