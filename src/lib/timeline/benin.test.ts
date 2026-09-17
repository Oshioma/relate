import { test } from "node:test";
import assert from "node:assert/strict";

import {
  BENIN_DEEP_PAST_ANCHOR_SLUG,
  BENIN_DEEP_PAST_EVENTS,
  BENIN_DEEP_PAST_LINKS,
  BENIN_DEEP_PAST_SOURCES,
} from "./benin-deep-past-seed";
import {
  BENIN_DAHOMEY_ANCHOR_SLUG,
  BENIN_DAHOMEY_EVENTS,
  BENIN_DAHOMEY_LINKS,
  BENIN_DAHOMEY_SOURCES,
} from "./benin-dahomey-seed";
import {
  BENIN_VODUN_ANCHOR_SLUG,
  BENIN_VODUN_EVENTS,
  BENIN_VODUN_LINKS,
  BENIN_VODUN_SOURCES,
} from "./benin-vodun-seed";
import {
  BENIN_ATLANTIC_ANCHOR_SLUG,
  BENIN_ATLANTIC_EVENTS,
  BENIN_ATLANTIC_LINKS,
  BENIN_ATLANTIC_SOURCES,
} from "./benin-atlantic-seed";
import { temporalTypeIsPositioned } from "./taxonomy";
import { astronomicalFromYearsAgo, BP_REFERENCE_YEAR } from "./time";
import type { SeedEvent, SeedEventLink, SeedSource } from "./seed-types";

const DATASETS: { name: string; events: SeedEvent[]; sources: SeedSource[]; links: SeedEventLink[] }[] = [
  { name: "deep past", events: BENIN_DEEP_PAST_EVENTS, sources: BENIN_DEEP_PAST_SOURCES, links: BENIN_DEEP_PAST_LINKS },
  { name: "Dahomey", events: BENIN_DAHOMEY_EVENTS, sources: BENIN_DAHOMEY_SOURCES, links: BENIN_DAHOMEY_LINKS },
  { name: "Vodun", events: BENIN_VODUN_EVENTS, sources: BENIN_VODUN_SOURCES, links: BENIN_VODUN_LINKS },
  { name: "Atlantic", events: BENIN_ATLANTIC_EVENTS, sources: BENIN_ATLANTIC_SOURCES, links: BENIN_ATLANTIC_LINKS },
];

const ALL = DATASETS.flatMap((dataset) => dataset.events);
const bySlug = new Map(ALL.map((event) => [event.slug, event]));
const record = (slug: string) => {
  const found = bySlug.get(slug);
  assert.ok(found, `missing record: ${slug}`);
  return found;
};

// ---------------------------------------------------------------------------
// STRUCTURE
// ---------------------------------------------------------------------------

test("every anchor exists in its own dataset", () => {
  assert.ok(BENIN_DEEP_PAST_EVENTS.some((e) => e.slug === BENIN_DEEP_PAST_ANCHOR_SLUG));
  assert.ok(BENIN_DAHOMEY_EVENTS.some((e) => e.slug === BENIN_DAHOMEY_ANCHOR_SLUG));
  assert.ok(BENIN_VODUN_EVENTS.some((e) => e.slug === BENIN_VODUN_ANCHOR_SLUG));
  assert.ok(BENIN_ATLANTIC_EVENTS.some((e) => e.slug === BENIN_ATLANTIC_ANCHOR_SLUG));
});

test("slugs are unique across all four datasets", () => {
  // They are seeded into one community and the events table is unique on
  // (community_id, slug), so a collision between two Bénin datasets would make
  // the second one silently skip a record rather than fail.
  const seen = new Set<string>();
  for (const event of ALL) {
    assert.ok(!seen.has(event.slug), `duplicate slug across datasets: ${event.slug}`);
    seen.add(event.slug);
  }
});

test("every claim names a source that exists, or none at all", () => {
  for (const dataset of DATASETS) {
    const keys = new Set(dataset.sources.map((source) => source.key));
    for (const event of dataset.events) {
      for (const claim of event.claims) {
        if (claim.sourceKey === null || claim.sourceKey === undefined) continue;
        assert.ok(keys.has(claim.sourceKey), `${event.slug}: unknown source ${claim.sourceKey}`);
      }
    }
    for (const link of dataset.links) {
      if (!link.sourceKey) continue;
      assert.ok(keys.has(link.sourceKey), `link ${link.from}->${link.to}: unknown source ${link.sourceKey}`);
    }
  }
});

test("every link joins two records in its own dataset", () => {
  for (const dataset of DATASETS) {
    const slugs = new Set(dataset.events.map((event) => event.slug));
    for (const link of dataset.links) {
      assert.ok(slugs.has(link.from), `${dataset.name}: link from unknown ${link.from}`);
      assert.ok(slugs.has(link.to), `${dataset.name}: link to unknown ${link.to}`);
    }
  }
});

test("no record carries a confidence score", () => {
  // The seed type has no such field, so this guards against one being added by
  // hand. A score would collapse everything these records keep apart — the
  // difference between an eyewitness count and a diplomatic allegation is not
  // a number, and the moment it becomes one the dataset stops teaching.
  for (const event of ALL) {
    assert.ok(!("confidence" in event), `${event.slug} has a confidence field`);
    for (const claim of event.claims) {
      assert.ok(!("confidence" in claim), `${event.slug} claim has a confidence field`);
    }
  }
});

test("a claim's originalDateText is unique within its event", () => {
  // The seeder matches claims back to their citations by this text.
  for (const event of ALL) {
    const seen = new Set<string>();
    for (const claim of event.claims) {
      assert.ok(claim.originalDateText, `${event.slug}: a claim has no originalDateText`);
      assert.ok(!seen.has(claim.originalDateText), `${event.slug}: duplicate originalDateText`);
      seen.add(claim.originalDateText);
    }
  }
});

test("every claim explains itself", () => {
  // "Why this date?" reads `evidence`. A claim with a thin one is a number
  // somebody will quote without knowing where it came from.
  for (const event of ALL) {
    for (const claim of event.claims) {
      assert.ok(claim.evidence.length > 120, `${event.slug}: evidence too thin for "${claim.originalDateText}"`);
    }
  }
});

test("a positionless claim carries no year, and a positioned one does", () => {
  for (const event of ALL) {
    for (const claim of event.claims) {
      const positioned = temporalTypeIsPositioned(claim.temporalClaimType);
      if (!positioned) {
        assert.equal(
          claim.startYear,
          undefined,
          `${event.slug}: "${claim.originalDateText}" places a year on a positionless claim`
        );
      } else {
        assert.notEqual(
          claim.startYear,
          undefined,
          `${event.slug}: "${claim.originalDateText}" is positioned but has no year`
        );
      }
    }
  }
});

// ---------------------------------------------------------------------------
// THE RULES THE DATASETS EXIST TO ENFORCE
// ---------------------------------------------------------------------------

test("the earliest written vodu is 1658, and it is filed as a first RECORD rather than a beginning", () => {
  const anchor = record(BENIN_VODUN_ANCHOR_SLUG);
  const first = anchor.claims.find((c) => c.temporalClaimType === "date_of_first_known_record");
  assert.ok(first, "the anchor must carry a date-of-first-known-record claim");
  assert.equal(first.startYear, 1658);
  // And the document's own date is kept as a separate claim, because "this book
  // is from 1658" and "no earlier use is known" are different statements and
  // only the second can be overturned by a find tomorrow.
  const document = anchor.claims.find((c) => c.temporalClaimType === "explicit_date");
  assert.ok(document, "the document's own date is its own claim");
  assert.equal(document.startYear, 1658);
});

test("nothing in the Vodun dataset gives the religion a date of origin", () => {
  // THE CENTRAL RULE. The traditions are older than 1658 and nothing says how
  // much older, so no record may place the origin anywhere on the axis.
  const debate = record("how-old-is-vodun");
  const origin = debate.claims.find((c) => /When the traditions now called Vodun began/i.test(c.whatIsDated ?? ""));
  assert.ok(origin, "the origin has to be a claim of its own");
  assert.equal(temporalTypeIsPositioned(origin.temporalClaimType), false);
  assert.equal(origin.startYear, undefined);

  // And the popular figures are recorded without being given a position, which
  // is what would make an unsourced assertion look like evidence.
  const popular = debate.claims.find((c) => /circulate/i.test(c.whatIsDated ?? ""));
  assert.ok(popular, "the circulating figures are recorded rather than ignored");
  assert.equal(popular.startYear, undefined);

  // Nothing anywhere in the lane puts a BCE year on a Vodun practice.
  for (const event of BENIN_VODUN_EVENTS) {
    for (const claim of event.claims) {
      if (claim.startYear === undefined) continue;
      assert.ok(claim.startYear > 0, `${event.slug}: "${claim.originalDateText}" puts a Vodun record before the common era`);
    }
  }
});

test("no Egyptian derivation is asserted anywhere", () => {
  // Explicitly out of scope: visual similarity is not evidence of transmission,
  // and this dataset does not smuggle one in through a description.
  for (const event of ALL) {
    const text = `${event.title}\n${event.summary}\n${event.description}`;
    for (const match of text.matchAll(/Egypt/gi)) {
      const window = text.slice(Math.max(0, match.index - 500), match.index + 500);
      assert.match(
        window,
        /not\b|no\b|declines|refuses|without|does not|nothing|fantas/i,
        `${event.slug} mentions Egypt without disowning the derivation`
      );
    }
  }
});

test("no prehistoric record is given a later people's identity", () => {
  // A stone tool or an iron spearhead in this territory belongs to nobody in
  // particular. Attaching Fon, Aja, Yoruba, Bariba or Vodun to it would be
  // projecting a later identity onto material that cannot carry one.
  const prehistoric = BENIN_DEEP_PAST_EVENTS.filter((event) =>
    event.claims.some((claim) => (claim.startYear ?? 1) < 0)
  );
  assert.ok(prehistoric.length > 0, "there should be prehistoric records to check");
  for (const event of prehistoric) {
    for (const name of event.civilisations ?? []) {
      assert.doesNotMatch(name, /^(Fon|Aja|Yoruba|Bariba|Dahomey|Hueda|Gun)$/i, `${event.slug} claims ${name}`);
    }
    for (const tag of event.tags) {
      assert.notEqual(tag, "vodun", `${event.slug} is tagged vodun`);
    }
  }
});

test("the territory is never called Bénin civilisation before there was one", () => {
  // The rule is stated in the record where it bites hardest: stone tools on a
  // river that is now an international border.
  const mekrou = record("benin-acheulean-and-msa-on-the-mekrou");
  assert.match(mekrou.description, /territory of modern B/i);
  assert.match(mekrou.description, /belonged to no modern nation/i);
  // And the record about the undated material refuses to place it at all.
  const undated = record("benin-deep-past-is-mostly-undated");
  assert.equal(temporalTypeIsPositioned(undated.claims[0].temporalClaimType), false);
});

test("the two Benins are kept apart", () => {
  const naming = record("republic-of-benin-is-not-kingdom-of-benin");
  assert.match(naming.description, /Nigeria/);
  assert.match(naming.description, /Bight of Benin/);
  assert.equal(naming.claims[0].startYear, 1975);
});

test("the 2,000 sacrifice figure is recorded as an allegation and never as an outcome", () => {
  const debate = record("how-many-were-sacrificed");
  const allegation = debate.claims.find((c) => /allegation/i.test(c.whatIsDated ?? ""));
  assert.ok(allegation, "the allegation is a record in its own right");
  assert.match(allegation.originalDateText, /2,000|two thousand/i);
  assert.match(allegation.evidence, /NOT ESTABLISHED|NOT ASSERTED/i);

  // And the question of how many is left open rather than totalled.
  const total = debate.claims.find((c) => /How many people were killed/i.test(c.whatIsDated ?? ""));
  assert.ok(total, "the count itself has to be a claim, so it can be shown as unresolved");
  assert.equal(temporalTypeIsPositioned(total.temporalClaimType), false);

  // Nowhere in the dataset's own voice does the figure become a finding. The
  // sweep looks for the number NEAR the subject, because "abandoned for two
  // thousand years" is a sentence about an archaeological gap.
  const nearSacrifice = /(2,000|two thousand)[^.]{0,120}sacrific|sacrific[^.]{0,120}(2,000|two thousand)/gi;
  for (const event of ALL) {
    const text = `${event.summary}\n${event.description}`;
    for (const match of text.matchAll(nearSacrifice)) {
      const window = text.slice(Math.max(0, match.index - 300), match.index + 300);
      assert.match(
        window,
        /alleg|report|claim|circulat|not established|might/i,
        `${event.slug} states a sacrifice figure without saying whose claim it is`
      );
    }
  }
});

test("human sacrifice is documented, not denied", () => {
  // The opposite failure to the one above, and just as bad: concluding that
  // because the numbers were inflated for political purposes, nothing happened.
  const documented = record("human-sacrifice-what-is-documented");
  assert.equal(documented.evidenceStatus, "strongly_documented");
  assert.match(documented.description, /WHAT IS ESTABLISHED/);
  assert.ok(documented.claims.length >= 3, "more than one independent eyewitness is the basis of the record");
});

test("Hangbe's reign keeps both durations, as lengths rather than dates", () => {
  const reign = record("hangbe-reign");
  const durations = reign.claims.filter((c) => c.durationYears !== undefined);
  assert.equal(durations.length, 2, "three months and three years are both recorded");
  for (const claim of durations) {
    assert.equal(temporalTypeIsPositioned(claim.temporalClaimType), false, "a length is not a position");
    assert.equal(claim.endYear, undefined, "a duration is never stored as a range");
  }
  const lengths = durations.map((c) => c.durationYears).sort((a, b) => (a ?? 0) - (b ?? 0));
  assert.ok((lengths[1] ?? 0) / (lengths[0] ?? 1) > 5, "the two traditions differ by an order of magnitude");
});

test("the Agojie origin traditions are not resolved, and none props up Hangbe's reign", () => {
  const origins = record("where-did-the-agojie-come-from");
  assert.equal(origins.eventType, "disputed");
  assert.ok(origins.claims.length >= 3, "three traditions, three claims");
  const hangbe = origins.claims.find((c) => /Hangbe/i.test(c.whatIsDated ?? ""));
  assert.ok(hangbe);
  assert.match(hangbe.evidence, /MUST NOT BE USED AS EVIDENCE|circular/i);

  // The link between the two records exists and says the same thing.
  const link = BENIN_DAHOMEY_LINKS.find(
    (l) => l.from === "hangbe-reign" && l.to === "where-did-the-agojie-come-from"
  );
  assert.ok(link, "the two records are linked for the reader");
  assert.equal(link.relation, "relevant", "relevant, NOT evidence_for — the relation itself must not imply support");
});

test("Bosman's description is earlier than the temple's founding tradition, and the records say so", () => {
  const bosman = record("bosman-describes-the-serpent-at-whydah");
  const tradition = record("temple-of-pythons-1717-tradition");
  const observed = bosman.claims.find((c) => /observations/i.test(c.whatIsDated ?? ""));
  assert.ok(observed);
  assert.ok((observed.startYear ?? 0) < (tradition.claims[0].startYear ?? 0), "the description predates the story");
  assert.match(tradition.claims[0].evidence, /Bosman|contradicts/i);
});

test("Vodun is not claimed to be UNESCO-inscribed", () => {
  const record_ = record("vodun-days-and-unesco-status");
  const status = record_.claims.find((c) => /inscribed/i.test(c.whatIsDated ?? ""));
  assert.ok(status, "the status is a claim so it can be checked and updated");
  assert.match(status.originalDateText, /Not inscribed/i);
  assert.equal(temporalTypeIsPositioned(status.temporalClaimType), false);
  // Gèlèdé, which IS inscribed, carries its two real dates.
  const gelede = record("gelede");
  const years = gelede.claims.map((c) => c.startYear).filter(Boolean);
  assert.ok(years.includes(2001) && years.includes(2008), "the proclamation and the inscription are separate acts");
});

test("the dataset does not call this religion voodoo in its own voice", () => {
  for (const event of ALL) {
    const text = `${event.title}\n${event.summary}\n${event.description}`;
    for (const match of text.matchAll(/voodoo/gi)) {
      const window = text.slice(Math.max(0, match.index - 400), match.index + 400);
      assert.match(
        window,
        /not\b|caricature|Hollywood|popular culture|racist|three different/i,
        `${event.slug} uses "voodoo" without disowning it`
      );
    }
  }
});

test("Fa as an information system is labelled a modern reading, not an indigenous one", () => {
  const analytical = record("fa-as-an-information-system");
  assert.equal(analytical.eventType, "alternative");
  assert.equal(analytical.identificationStatus, "modern_interpretation");
  assert.match(analytical.description, /MODERN ANALYTICAL DESCRIPTION/);
  assert.equal(temporalTypeIsPositioned(analytical.claims[0].temporalClaimType), false);
});

test("possession keeps the observable, the practitioner's account and the scientific status apart", () => {
  const possession = record("possession-and-trance");
  assert.match(possession.description, /WHAT CAN BE OBSERVED/);
  assert.match(possession.description, /WHAT PRACTITIONERS SAY/);
  assert.match(possession.description, /not empirically established/i);
  const status = possession.claims.find((c) => /practitioner's account/i.test(c.whatIsDated ?? ""));
  assert.ok(status, "the open question is a claim, so the interface can show it as open");
});

test("the palaeoenvironmental claims convert years-before-present correctly", () => {
  // 8,400 cal BP is about 6450 BCE, not 8400 BCE. Getting this wrong by 1,950
  // years is the single most damaging arithmetic error available here, because
  // the result looks like a correlation.
  const bp = BENIN_DEEP_PAST_EVENTS.flatMap((event) =>
    event.claims.filter((claim) => claim.dateConvention === "before_present").map((claim) => ({ event, claim }))
  );
  assert.ok(bp.length >= 4, "the Lac Sélé sequence supplies several BP claims");
  for (const { event, claim } of bp) {
    assert.equal(claim.conventionReferenceYear, BP_REFERENCE_YEAR, `${event.slug}: BP must count from 1950`);
    const figures = [...claim.originalDateText.matchAll(/([\d,]{3,})/g)].map((m) => Number(m[1].replace(/,/g, "")));
    assert.ok(figures.length > 0, `${event.slug}: no figure found in "${claim.originalDateText}"`);
    const expected = figures.map((figure) => astronomicalFromYearsAgo(figure));
    const stored = [claim.startYear, claim.endYear].filter((year) => year !== undefined);
    for (const year of stored) {
      assert.ok(
        expected.includes(year as number),
        `${event.slug}: ${year} is not the conversion of any figure in "${claim.originalDateText}"`
      );
    }
  }
});

test("Sodohomé's iron claim is recorded as a claim, with the argument attached", () => {
  const spear = record("sodohome-early-iron-spearhead");
  const superlative = spear.claims.find((c) => /oldest/i.test(c.originalDateText));
  assert.ok(superlative, "the superlative is its own claim, separate from the site's ironworking");
  assert.match(superlative.evidence, /THE SUPERLATIVE IS THE SOURCE'S/i);
  assert.ok(BENIN_DEEP_PAST_EVENTS.some((e) => e.slug === "west-african-early-iron-debate"));
});

test("the two-thousand-year gap on the Abomey plateau is stated rather than smoothed over", () => {
  const gap = record("abomey-plateau-two-thousand-year-gap");
  const claim = gap.claims[0];
  assert.ok((claim.endYear ?? 0) - (claim.startYear ?? 0) > 1000, "the gap must stay as wide as the evidence");
  assert.match(claim.evidence, /DESCRIPTION OF AN ABSENCE/i);
});

test("every debate record leaves its question open", () => {
  const debates = ALL.filter((event) => event.subcategory === "Debate");
  assert.ok(debates.length >= 8, "the datasets carry a real set of debate records");
  for (const debate of debates) {
    assert.equal(debate.eventType, "disputed", `${debate.slug} is filed as a debate but not typed as disputed`);
    const unresolved = debate.claims.some((claim) => !temporalTypeIsPositioned(claim.temporalClaimType));
    // OR it sets frameworks against each other, which is the other shape a
    // debate takes here: "when was Dahomey founded" has three dated answers
    // from three different kinds of reckoning and no unresolved claim at all.
    const competing = new Set(debate.claims.map((claim) => claim.chronology)).size > 1;
    assert.ok(
      unresolved || competing,
      `${debate.slug} neither leaves a claim open nor shows competing frameworks, so it answers its own question`
    );
  }
});

test("records that need better sourcing say so, in the record", () => {
  // Not a style rule. A dataset assembled without reaching the archives has to
  // mark where it is reporting at second hand, or a reader cannot tell which
  // records are solid.
  const flagged = ALL.filter((event) =>
    event.claims.some((claim) => /NEEDS (SOURCE VERIFICATION|BETTER SOURCING)/i.test(`${claim.evidence} ${claim.notes ?? ""}`))
  );
  assert.ok(flagged.length > 20, "the weak records are marked, and there are plenty of them");
});

test("the anchor of the Dahomey dataset is the question, not an answer", () => {
  const anchor = record(BENIN_DAHOMEY_ANCHOR_SLUG);
  assert.equal(anchor.eventType, "disputed");
  assert.ok(anchor.claims.length >= 3, "competing foundation dates are all kept");
  const documented = anchor.claims.find((c) => c.chronology === "historical");
  assert.ok(documented, "and the one date that rests on documents is marked as such");
  assert.match(documented.evidence, /NOT A FOUNDATION DATE|not offered as one/i);
});

test("a European fort is never treated as territorial control", () => {
  const forts = record("european-forts-at-ouidah");
  assert.match(forts.description, /not evidence of European control/i);
  assert.match(forts.description, /African labour/i);
});

test("the Door of No Return is dated to 1992 wherever it is pictured", () => {
  const memorial = record("ouidah-slave-route-memorial");
  const arch = memorial.claims.find((c) => /arch/i.test(c.whatIsDated ?? ""));
  assert.ok(arch);
  assert.equal(arch.startYear, 1992);
  for (const picture of memorial.media ?? []) {
    if (!/door of no return|non-retour/i.test(picture.caption ?? "")) continue;
    assert.match(
      `${picture.caption} ${picture.provenanceNotes ?? ""} ${picture.objectDate ?? ""}`,
      /1992|memorial|erected/i,
      "a picture of the arch must not read as an eighteenth-century structure"
    );
  }
});

test("pictures of objects held in Paris say when the photograph was taken", () => {
  // Twenty-six of them went home in 2021, so "it is in the quai Branly" is a
  // statement with an expiry date on it.
  const parisian = ALL.flatMap((event) => (event.media ?? []).map((item) => ({ event, item }))).filter(({ item }) =>
    /quai Branly/i.test(item.caption ?? "")
  );
  assert.ok(parisian.length > 0, "there are pictures of the Paris collections");
  for (const { event, item } of parisian) {
    assert.match(
      `${item.caption} ${item.institution ?? ""} ${item.provenanceNotes ?? ""}`,
      /at the time of the photograph|2021|returned|transferred/i,
      `${event.slug}: a Paris caption must carry the date it was true`
    );
  }
});
