import { test } from "node:test";
import assert from "node:assert/strict";

import {
  MOORS_ANCHOR_SLUG,
  MOORS_EVENTS,
  MOORS_LANES,
  MOORS_LANE_TAGS,
  MOORS_LINKS,
  MOORS_SECTIONS,
  MOORS_SOURCES,
  MOORS_TRACK,
  MOORS_TRACK_TAG,
  MOORS_TRACK_WINDOW,
} from "./moors-origins-seed";
import {
  CITATION_STATUSES,
  CLAIM_VERDICTS,
  CLAIM_VIEWPOINTS,
  DATE_CONVENTIONS,
  DATING_METHODS,
  EVENT_RELATIONS,
  GENEALOGY_STAGES,
  IDENTIFICATION_STATUSES,
  MEDIA_KINDS,
  TEMPORAL_CLAIM_TYPES,
  TIMELINE_CATEGORIES,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
} from "./taxonomy";
import type { SeedEvent } from "./seed-types";

// =============================================================================
// THE ORIGINS OF THE MOORS TRACK
//
// The brief asked for a long track that keeps several promises at once: start
// at Jebel Irhoud and never call anyone there a Moor; give every record more
// than one source and at least one checked picture; keep disputed theories in
// their own lane with the case for and against; and link out to the tracks the
// community already has. Each promise is a test here.
// =============================================================================

const keys = (list: readonly { key: string }[]) => new Set<string>(list.map((entry) => entry.key));
const bySlug = new Map(MOORS_EVENTS.map((event) => [event.slug, event]));
const sourceKeys = new Set(MOORS_SOURCES.map((source) => source.key));
const laneNames = new Set<string>(Object.values(MOORS_LANES));
const laneTagFor = new Map<string, string>(
  (Object.keys(MOORS_LANES) as (keyof typeof MOORS_LANES)[]).map((lane) => [MOORS_LANES[lane], MOORS_LANE_TAGS[lane]])
);

const sourcesOf = (event: SeedEvent): Set<string> =>
  new Set(
    event.claims.flatMap((claim) => [
      ...(claim.sourceKey ? [claim.sourceKey] : []),
      ...(claim.citations ?? []).map((citation) => citation.sourceKey),
    ])
  );

/** Slugs every other dataset in this directory seeds, for links that leave the track. */
async function otherSeededSlugs(): Promise<Set<string>> {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.dirname(new URL(import.meta.url).pathname);
  const out = new Set<string>();
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith("-seed.ts") && name !== "moors-origins-seed.ts")) {
    const loaded: Record<string, unknown> = await import(`./${file}`);
    for (const [name, value] of Object.entries(loaded)) {
      if (name.endsWith("_EVENTS") && Array.isArray(value)) for (const event of value as SeedEvent[]) out.add(event.slug);
      if (name === "SHOWCASE_EVENT" && value && typeof value === "object") out.add((value as SeedEvent).slug);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Plumbing
// ---------------------------------------------------------------------------

test("the track is substantial: at least the forty foundation records and the expansions", () => {
  assert.ok(MOORS_EVENTS.length >= 54, `only ${MOORS_EVENTS.length} records`);
});

test("every slug is unique and every source key is defined once, meaning one work", () => {
  assert.equal(bySlug.size, MOORS_EVENTS.length, "duplicate slugs");
  const seen = new Map<string, string>();
  for (const section of Object.values(MOORS_SECTIONS)) {
    for (const source of section.sources) {
      const identity = `${source.title}|${source.author ?? ""}`;
      const before = seen.get(source.key);
      assert.ok(before === undefined || before === identity, `source key ${source.key} names two different works`);
      seen.set(source.key, identity);
    }
  }
});

test("every vocabulary key exists", () => {
  const categories = new Set<string>(TIMELINE_CATEGORIES.map((category) => category.key));
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const sourceTypes = keys(TIMELINE_SOURCE_TYPES);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const methods = keys(DATING_METHODS);
  const temporal = keys(TEMPORAL_CLAIM_TYPES);
  const identification = keys(IDENTIFICATION_STATUSES);
  const conventions = keys(DATE_CONVENTIONS);
  const media = keys(MEDIA_KINDS);
  const verdicts = keys(CLAIM_VERDICTS);
  const stages = keys(GENEALOGY_STAGES);
  const citationStatuses = keys(CITATION_STATUSES);

  for (const source of MOORS_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType), `${source.key}: source type ${source.sourceType}`);
    assert.ok(source.notes.trim().length > 30, `${source.key}: notes must say what the source is cited FOR`);
  }
  for (const event of MOORS_EVENTS) {
    const at = event.slug;
    assert.ok(categories.has(event.category), `${at}: category ${event.category}`);
    assert.ok(eventTypes.has(event.eventType), `${at}: event type ${event.eventType}`);
    if (event.identificationStatus) assert.ok(identification.has(event.identificationStatus), `${at}: identification`);
    for (const claim of event.claims) {
      assert.ok(viewpoints.has(claim.chronology), `${at}: chronology ${claim.chronology}`);
      assert.ok(methods.has(claim.datingMethod), `${at}: dating method ${claim.datingMethod}`);
      if (claim.temporalClaimType) assert.ok(temporal.has(claim.temporalClaimType), `${at}: temporal ${claim.temporalClaimType}`);
      if (claim.dateConvention) assert.ok(conventions.has(claim.dateConvention), `${at}: convention ${claim.dateConvention}`);
      if (claim.sourceKey) assert.ok(sourceKeys.has(claim.sourceKey), `${at}: unknown source ${claim.sourceKey}`);
      for (const citation of claim.citations ?? []) {
        assert.ok(sourceKeys.has(citation.sourceKey), `${at}: unknown cited source ${citation.sourceKey}`);
        assert.ok(citation.note.trim().length > 10, `${at}: a citation must say what it does to the claim`);
      }
    }
    for (const picture of event.media ?? []) {
      assert.ok(picture.shows && media.has(picture.shows), `${at}: picture shows ${picture.shows}`);
      if (picture.identificationStatus) assert.ok(identification.has(picture.identificationStatus), `${at}: picture identification`);
    }
    for (const genealogy of event.genealogies ?? []) {
      assert.ok(verdicts.has(genealogy.verdict), `${at}: verdict ${genealogy.verdict}`);
      for (const link of genealogy.links) {
        assert.ok(stages.has(link.stage), `${at}: genealogy stage ${link.stage}`);
        if (link.citationStatus) assert.ok(citationStatuses.has(link.citationStatus), `${at}: citation status`);
        if (link.sourceKey) assert.ok(sourceKeys.has(link.sourceKey), `${at}: genealogy source ${link.sourceKey}`);
        assert.ok(link.says || link.saysAbsentReason, `${at}: a link says something or says why not`);
      }
    }
  }
});

test("a claim's own wording is unique within its record, because citations are matched back by it", () => {
  for (const event of MOORS_EVENTS) {
    const texts = event.claims.map((claim) => claim.originalDateText);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: two claims share their wording`);
  }
});

// ---------------------------------------------------------------------------
// The track and its lanes
// ---------------------------------------------------------------------------

test("every record sits in exactly one lane, as its subcategory and as its tag", () => {
  for (const event of MOORS_EVENTS) {
    assert.ok(event.subcategory && laneNames.has(event.subcategory), `${event.slug}: lane "${event.subcategory}"`);
    assert.ok(event.tags.includes(MOORS_TRACK_TAG), `${event.slug}: missing the track tag`);
    const laneTags = event.tags.filter((tag) => [...laneTagFor.values()].includes(tag));
    assert.deepEqual(laneTags, [laneTagFor.get(event.subcategory!)], `${event.slug}: lane tag does not match its lane`);
  }
});

test("every lane the brief named has records in it", () => {
  for (const lane of laneNames) {
    const count = MOORS_EVENTS.filter((event) => event.subcategory === lane).length;
    assert.ok(count >= 3, `lane "${lane}" has only ${count} records`);
  }
});

test("the track opens at Jebel Irhoud, and that is the opening of the track, not of the timeline", () => {
  const anchor = bySlug.get(MOORS_ANCHOR_SLUG);
  assert.ok(anchor, "the Jebel Irhoud record is the anchor");
  const starts = MOORS_EVENTS.flatMap((event) =>
    event.claims.filter((claim) => claim.startYear != null).map((claim) => ({ slug: event.slug, year: claim.startYear! }))
  );
  const anchorStart = Math.min(...anchor.claims.filter((c) => c.startYear != null).map((c) => c.startYear!));
  // Jebel Irhoud's published age is 315,000 ± 34,000 years ago (Richter et al. 2017).
  assert.ok(anchorStart <= -310_000 && anchorStart >= -352_000, `anchor starts at ${anchorStart}`);
  // Older occupation of Morocco is in the track too (by people who were not
  // Homo sapiens), so the anchor is the opening of the Homo sapiens story; every
  // record still sits inside the window the track opens on.
  for (const { slug, year } of starts) {
    assert.ok(year >= MOORS_TRACK_WINDOW.from || slug !== MOORS_ANCHOR_SLUG, `${slug} starts before the window`);
  }
});

test("every dated claim sits inside the window 'open this track on its own' frames", () => {
  for (const event of MOORS_EVENTS) {
    for (const claim of event.claims) {
      if (claim.startYear == null) continue;
      if (event.slug !== "pre-sapiens-occupation-of-morocco") {
        assert.ok(claim.startYear >= MOORS_TRACK_WINDOW.from, `${event.slug}: ${claim.originalDateText} is before the window`);
      }
      assert.ok((claim.endYear ?? claim.startYear) <= MOORS_TRACK_WINDOW.to, `${event.slug}: ${claim.originalDateText} is after the window`);
    }
  }
});

test("the track closes with Tariq ibn Ziyad in 711", () => {
  const latest = Math.max(
    ...MOORS_EVENTS.flatMap((event) => event.claims.map((claim) => claim.endYear ?? claim.startYear ?? -Infinity))
  );
  assert.ok(latest >= 711 && latest <= 800, `latest dated claim is ${latest}`);
  const tariq = MOORS_EVENTS.find((event) => /tariq/i.test(event.slug));
  assert.ok(tariq, "a record for Tariq ibn Ziyad's crossing");
  assert.ok(tariq.claims.some((claim) => claim.startYear === 711), "dated to 711");
});

// ---------------------------------------------------------------------------
// The distinction the track exists to keep
// ---------------------------------------------------------------------------

test("no prehistoric record calls its people Moors, and the anchor says so in its own voice", () => {
  for (const event of MOORS_EVENTS.filter((e) => e.subcategory === MOORS_LANES.prehistoric)) {
    assert.doesNotMatch(`${event.title} ${event.summary}`, /\bMoors?\b|\bMoorish\b/i, `${event.slug} calls prehistoric people Moors`);
  }
  const anchor = bySlug.get(MOORS_ANCHOR_SLUG)!;
  assert.match(anchor.description, /not (?:called |)Moors|were not Moors|was not a Moor|no one .* Moor|nobody .* Moor/i);
});

test("no record files an ancient people under a modern racial category", () => {
  const racial = /\b(negroid|caucasoid|mongoloid|hamitic race|white race|black race)\b/i;
  for (const event of MOORS_EVENTS) {
    // Named only to be rejected — a record may report that someone used the term.
    const text = `${event.title} ${event.summary}`;
    assert.doesNotMatch(text, racial, `${event.slug}: racial category in title or summary`);
  }
});

// ---------------------------------------------------------------------------
// Sources and pictures
// ---------------------------------------------------------------------------

test("every record rests on more than one source", () => {
  for (const event of MOORS_EVENTS) {
    assert.ok(sourcesOf(event).size >= 2, `${event.slug}: only ${sourcesOf(event).size} source(s)`);
  }
});

test("every source can be followed: a URL, or a reference that locates it", () => {
  for (const source of MOORS_SOURCES) {
    assert.ok(source.url || source.reference, `${source.key}: neither URL nor reference`);
  }
});

test("every record has at least one picture, with its cover first in the gallery", () => {
  for (const event of MOORS_EVENTS) {
    assert.ok((event.media ?? []).length >= 1, `${event.slug}: no picture`);
    if (event.imageUrl) assert.equal(event.media![0].url, event.imageUrl, `${event.slug}: cover is not first`);
  }
});

test("every picture is a named Commons file whose credit is fetched at seed time", () => {
  for (const event of MOORS_EVENTS) {
    for (const picture of event.media ?? []) {
      assert.ok(picture.fileName, `${event.slug}: picture without a file name`);
      assert.match(picture.url, /^https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\//, `${event.slug}: not a Commons file`);
      assert.equal(picture.creditFrom, "source", `${event.slug}: credit must be fetched`);
      assert.ok(picture.licence, `${event.slug}: ${picture.fileName} has no licence recorded from research`);
      assert.doesNotMatch(picture.licence ?? "", /non-?free|fair use|all rights reserved/i, `${event.slug}: ${picture.fileName} is not freely licensed`);
    }
  }
});

test("an UNVERIFIED picture says so first, and only an unverified one does", () => {
  for (const event of MOORS_EVENTS) {
    for (const picture of event.media ?? []) {
      const flagged = (picture.caption ?? "").startsWith("UNVERIFIED —");
      assert.equal(flagged, picture.identificationStatus === "unverified", `${event.slug}: ${picture.fileName} caption/status mismatch`);
    }
  }
});

test("a reconstruction or later artwork declares itself in its caption", () => {
  for (const event of MOORS_EVENTS) {
    for (const picture of event.media ?? []) {
      if (picture.shows !== "reconstruction" && picture.shows !== "later_artwork") continue;
      assert.match(picture.caption ?? "", /reconstruct|later|modern|centur|painting|engraving|artist|imagin|drawn|statue/i, `${event.slug}: ${picture.fileName}`);
    }
  }
});

// ---------------------------------------------------------------------------
// Disputed theories
// ---------------------------------------------------------------------------

test("at least ten alternative interpretations, each with its proposers, both cases and what would change it", () => {
  const alternatives = MOORS_EVENTS.filter((event) => event.subcategory === MOORS_LANES.alternative);
  assert.ok(alternatives.length >= 10, `only ${alternatives.length} alternative interpretations`);
  for (const event of alternatives) {
    assert.ok(event.argumentsFor && event.argumentsFor.length > 80, `${event.slug}: no case for`);
    assert.ok(event.argumentsAgainst && event.argumentsAgainst.length > 80, `${event.slug}: no case against`);
    assert.ok((event.genealogies ?? []).length >= 1, `${event.slug}: no genealogy of the claim`);
    for (const genealogy of event.genealogies ?? []) {
      assert.ok(genealogy.whatWouldChangeThis.trim().length > 40, `${event.slug}: what would change this?`);
      assert.ok(genealogy.links.length >= 2, `${event.slug}: a genealogy needs who proposed it and who answered`);
    }
    assert.ok(
      event.claims.every((claim) => claim.chronology !== "conventional"),
      `${event.slug}: a disputed theory's claims are not filed as the conventional view`
    );
  }
});

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

test("every link names records that exist, a real relation, and says why", async () => {
  const outside = await otherSeededSlugs();
  const relations = keys(EVENT_RELATIONS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  for (const link of MOORS_LINKS) {
    const label = `${link.from} → ${link.to}`;
    assert.ok(bySlug.has(link.from) || bySlug.has(link.to), `${label}: neither end is in this track`);
    assert.ok(bySlug.has(link.from) || outside.has(link.from), `${label}: ${link.from} does not exist`);
    assert.ok(bySlug.has(link.to) || outside.has(link.to), `${label}: ${link.to} does not exist`);
    assert.notEqual(link.from, link.to, label);
    assert.ok(relations.has(link.relation), `${label}: relation ${link.relation}`);
    if (link.viewpoint) assert.ok(viewpoints.has(link.viewpoint), `${label}: viewpoint ${link.viewpoint}`);
    if (link.sourceKey) assert.ok(sourceKeys.has(link.sourceKey), `${label}: source ${link.sourceKey}`);
    assert.ok(link.note.trim().length > 20, `${label}: say why`);
  }
  const keyed = MOORS_LINKS.map((link) => `${[link.from, link.to].sort().join("|")}|${link.relation}|${link.viewpoint ?? ""}`);
  assert.equal(new Set(keyed).size, keyed.length, "a link is written twice");
});

test("the track reaches out to the tracks the community already has", async () => {
  const outside = await otherSeededSlugs();
  const crossing = MOORS_LINKS.filter((link) => outside.has(link.from) || outside.has(link.to));
  assert.ok(crossing.length >= 8, `only ${crossing.length} links leave the track`);
});

test("the track's slug is the one the share link uses", () => {
  assert.equal(MOORS_TRACK.slug, "origins-of-the-moors");
});
