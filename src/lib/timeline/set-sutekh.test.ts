import { test } from "node:test";
import assert from "node:assert/strict";

import {
  SET_SUTEKH_ANCHOR_SLUG,
  SET_SUTEKH_EVENTS,
  SET_SUTEKH_SOURCES,
} from "./set-sutekh-seed";
import {
  IDENTIFICATION_STATUSES,
  TIMELINE_CATEGORIES,
  TIMELINE_EVENT_TYPES,
  TEMPORAL_CLAIM_TYPES,
  DATING_METHODS,
  CLAIM_VIEWPOINTS,
  temporalTypeIsPositioned,
} from "./taxonomy";
import { DATE_UNITS } from "./time";

const byslug = new Map(SET_SUTEKH_EVENTS.map((e) => [e.slug, e]));
const record = (slug: string) => {
  const found = byslug.get(slug);
  assert.ok(found, `missing record: ${slug}`);
  return found;
};

// ---------------------------------------------------------------------------
// THE RULE THE DATASET IS BUILT ON
//
// Two questions, kept apart: when is this from, and why do we think it is Set?
// The second is identificationStatus, and it is not a confidence score. These
// tests exist because the easiest way to ruin this dataset is to let the
// answer to the first question quietly stand in for the answer to the second.
// ---------------------------------------------------------------------------

test("the predynastic material is never given a secure identification", () => {
  const early = record("predynastic-possible-set-animals");
  assert.notEqual(
    early.identificationStatus,
    "secure",
    "a strange quadruped on a Naqada sherd is not securely a Set animal, and saying so is the whole point"
  );
  assert.match(early.identificationStatus ?? "", /possible|disputed/);
});

test("Peribsen IS secure, and for a stated reason that is not resemblance", () => {
  const anchor = record(SET_SUTEKH_ANCHOR_SLUG);
  assert.equal(anchor.identificationStatus, "secure");
  assert.match(anchor.description, /serekh/i);
  const identification = anchor.claims.find((c) => /Whether the animal/i.test(c.whatIsDated ?? ""));
  assert.ok(identification, "the identification is a claim of its own, separate from the reign's date");
  assert.match(
    identification.evidence,
    /POSITION AND WRITING/,
    "the security of this identification rests on where the animal stands, not on what it looks like"
  );
  // The reverse of the usual situation in this dataset: the identification is
  // firmer than the date. Both are recorded, neither borrows from the other.
  const reign = anchor.claims.find((c) => /reign/i.test(c.whatIsDated ?? ""));
  assert.ok(reign?.isApproximate, "Early Dynastic absolute chronology is not firm and must not pretend to be");
});

test("the species of the Set animal is recorded as unresolved", () => {
  const species = record("set-animal-species-unidentified");
  assert.equal(species.identificationStatus, "disputed");
  // If nobody can say what the animal IS, an identification by resemblance
  // rests on a resemblance to something undefined. The record has to say so,
  // because it is what licenses the caution on every early record above.
  assert.match(species.description, /resemblance/i);
});

test("Set is never called the Egyptian Satan in this dataset's own voice", () => {
  for (const event of SET_SUTEKH_EVENTS) {
    const text = `${event.title}\n${event.summary}\n${event.description}`;
    for (const match of text.matchAll(/Egyptian Satan/gi)) {
      const window = text.slice(Math.max(0, match.index - 400), match.index + 200);
      assert.match(
        window,
        /cannot|not\b|refus|myth|wrong|popular|descend/i,
        `${event.slug} uses "Egyptian Satan" without disowning it`
      );
    }
  }
});

test("the protective Set is in the dataset, because leaving him out is the distortion", () => {
  const apep = record("set-spears-apep");
  assert.match(apep.summary, /sun/i);
  assert.match(apep.description, /Apep|Apophis/);
  assert.ok(apep.tags.includes("protective"));
});

test("no record gives a date for when Set became evil", () => {
  const decline = record("late-period-persecution-of-set");
  const claim = decline.claims[0];
  // A seven-century range looks imprecise and is in fact the shape of the
  // evidence. What must never appear is a year, a reign or a decree.
  assert.equal(claim.temporalClaimType, "estimated_range");
  assert.ok((claim.endYear ?? 0) - (claim.startYear ?? 0) > 300, "the range must stay as wide as the evidence");
  assert.match(claim.evidence, /not a decision|not a decree|accumulation/i);
});

test("the Hyksos explanation is held as a proposal, with its counter-evidence attached", () => {
  const hyksos = record("hyksos-avaris-sutekh");
  const proposal = hyksos.claims.find((c) => /demonisation/i.test(c.whatIsDated ?? ""));
  assert.ok(proposal, "the causal proposal must be a claim of its own, not a sentence in the prose");
  assert.equal(
    temporalTypeIsPositioned(proposal.temporalClaimType),
    false,
    "an explanation is not a moment and must not be given a position on the timeline"
  );
  assert.match(proposal.evidence, /Nineteenth Dynasty/, "the chronological objection has to travel with it");
});

test("the 400-Year Stela keeps its two dates apart", () => {
  const stela = record("four-hundred-year-stela");
  assert.equal(stela.claims.length, 2, "one for when it was made, one for what it counts back to");
  const made = stela.claims.find((c) => /made/i.test(c.whatIsDated ?? ""));
  const era = stela.claims.find((c) => /counted from/i.test(c.whatIsDated ?? ""));
  assert.ok(made?.startYear, "the manufacture date is the securer one and is entered");
  assert.equal(era?.startYear, undefined, "subtracting four hundred would assert the disputed part");
  assert.equal(temporalTypeIsPositioned(era?.temporalClaimType), false);
});

test("Plutarch is filed as evidence about Plutarch", () => {
  const plutarch = SET_SUTEKH_SOURCES.find((s) => s.key === "plutarch_isis_osiris");
  assert.ok(plutarch);
  assert.match(plutarch.notes, /RECEPTION|never as a description/i);
});

test("the gap between the ancient cult and the modern revivals has its own record", () => {
  const gap = record("documentary-gap-set");
  assert.ok(gap, "without this record the gap can be closed by silence");
  const modern = record("temple-of-set-1975");
  // The documented civil fact and the religious claim are separate claims on
  // the same record. A timeline that adjudicated the second would be doing
  // theology in one direction or the other.
  assert.ok(modern.claims.length >= 2);
  assert.ok(modern.claims.some((c) => c.chronology === "religious"));
  assert.ok(modern.claims.some((c) => c.chronology === "conventional"));
});

test("modern material is labelled modern in the title, not only in the small print", () => {
  const pop = record("set-in-modern-popular-culture");
  assert.match(pop.title, /^MODERN:/);
  assert.equal(pop.identificationStatus, "modern_interpretation");
});

// ---------------------------------------------------------------------------
// PICTURES
//
// The live example this dataset was built around: a widely reused file titled
// "Horus spearing Set" is a modern artwork made in 2025, while a file showing
// Set spearing Apep reproduces a Twenty-first Dynasty scene. Image search
// presents them identically.
// ---------------------------------------------------------------------------

test("the 2025 artwork is labelled as one, and the ancient scene is not lumped in with it", () => {
  const edfu = record("horus-spears-set-edfu");
  const modernPicture = edfu.media?.find((m) => /Horus_spearing_set/i.test(m.url));
  assert.ok(modernPicture, "the cautionary picture must actually be present to be a caution");
  assert.equal(modernPicture.identificationStatus, "modern_interpretation");
  assert.equal(modernPicture.shows, "later_artwork");
  assert.match(modernPicture.imageDate ?? "", /2025/);

  const apep = record("set-spears-apep").media?.[0];
  assert.ok(apep);
  assert.equal(apep.shows, "manuscript");
  assert.match(apep.imageDate ?? "", /Twenty-first Dynasty/);
});

test("every picture carries a file page, and never only a file URL", () => {
  for (const event of SET_SUTEKH_EVENTS) {
    for (const media of event.media ?? []) {
      assert.ok(media.sourcePageUrl, `${event.slug}: a picture with no source page has no provenance`);
      assert.notEqual(
        media.sourcePageUrl,
        media.url,
        `${event.slug}: the file page is where the licence and creator live; the file URL is a place a JPEG lives`
      );
    }
  }
});

test("no picture claims to show remains, because none of them does", () => {
  for (const event of SET_SUTEKH_EVENTS) {
    for (const media of event.media ?? []) {
      assert.notEqual(media.depictsActualRemains, true, `${event.slug}: this dataset has no human remains in it`);
    }
  }
});

// ---------------------------------------------------------------------------
// VOCABULARY AND SHAPE
// ---------------------------------------------------------------------------

const keys = (list: readonly { key: string }[]) => new Set(list.map((x) => x.key));

test("every key used comes from the shared vocabularies", () => {
  const categories = keys(TIMELINE_CATEGORIES);
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const identifications = keys(IDENTIFICATION_STATUSES);
  const temporal = keys(TEMPORAL_CLAIM_TYPES);
  const methods = keys(DATING_METHODS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const units = keys(DATE_UNITS);

  for (const event of SET_SUTEKH_EVENTS) {
    assert.ok(categories.has(event.category), `${event.slug}: category ${event.category}`);
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: eventType ${event.eventType}`);
    if (event.identificationStatus) {
      assert.ok(identifications.has(event.identificationStatus), `${event.slug}: ${event.identificationStatus}`);
    }
    for (const claim of event.claims) {
      assert.ok(temporal.has(claim.temporalClaimType ?? ""), `${event.slug}: ${claim.temporalClaimType}`);
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: ${claim.datingMethod}`);
      assert.ok(viewpoints.has(claim.chronology), `${event.slug}: ${claim.chronology}`);
      assert.ok(units.has(claim.datePrecision), `${event.slug}: ${claim.datePrecision}`);
    }
  }
});

test("a positionless claim carries no year, and a positioned one does", () => {
  for (const event of SET_SUTEKH_EVENTS) {
    for (const claim of event.claims) {
      if (temporalTypeIsPositioned(claim.temporalClaimType)) {
        assert.ok(
          claim.startYear !== undefined,
          `${event.slug}: "${claim.originalDateText}" claims a position with no year`
        );
      } else {
        assert.equal(
          claim.startYear,
          undefined,
          `${event.slug}: "${claim.originalDateText}" is positionless and must not carry a year`
        );
      }
    }
  }
});

test("every claim names a source that exists, or honestly names none", () => {
  const sourceKeys = new Set(SET_SUTEKH_SOURCES.map((s) => s.key));
  for (const event of SET_SUTEKH_EVENTS) {
    for (const claim of event.claims) {
      if (claim.sourceKey !== null) {
        assert.ok(sourceKeys.has(claim.sourceKey), `${event.slug}: unknown source ${claim.sourceKey}`);
      }
    }
  }
});

test("slugs are unique and every record has at least one claim", () => {
  assert.equal(byslug.size, SET_SUTEKH_EVENTS.length, "a duplicate slug would silently overwrite a record");
  for (const event of SET_SUTEKH_EVENTS) {
    assert.ok(event.claims.length > 0, `${event.slug} has no claims`);
    for (const claim of event.claims) {
      assert.ok(claim.evidence.length > 40, `${event.slug}: "why this date?" is not optional`);
    }
  }
});

test("originalDateText is unique within its record", () => {
  // The seeder matches claims back to their citations by this text. Two claims
  // sharing one would attach the wrong citations to the wrong claim.
  for (const event of SET_SUTEKH_EVENTS) {
    const texts = event.claims.map((c) => c.originalDateText);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: duplicate originalDateText`);
  }
});

test("nothing in this dataset carries a confidence score", () => {
  for (const event of SET_SUTEKH_EVENTS) {
    const text = JSON.stringify(event);
    assert.doesNotMatch(text, /"confidence"/, `${event.slug}`);
    assert.doesNotMatch(
      text,
      /\b\d{1,3}\s?% (certain|confident|likely|sure)\b/i,
      `${event.slug}: a percentage is a confidence score wearing a hat`
    );
  }
});

test("unread sources say so, and the count is visible rather than buried", () => {
  const unread = SET_SUTEKH_SOURCES.filter((s) => /NEEDS SOURCE VERIFICATION/.test(s.notes));
  // This dataset was built without the primary texts open and the flags are
  // the record of that. The assertion is not that the number is low; it is
  // that the sources which have not been read admit it.
  assert.ok(unread.length > 0, "if this ever reaches zero, check that it was earned rather than edited away");
  for (const source of SET_SUTEKH_SOURCES) {
    assert.ok(source.notes.length > 40, `${source.key}: a source note must say what it is cited FOR`);
  }
});
