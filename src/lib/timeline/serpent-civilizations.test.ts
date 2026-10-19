import { test } from "node:test";
import assert from "node:assert/strict";

import {
  COMPARISON_ASSESSMENTS,
  EVIDENCE_TYPES,
  HYPOTHESIS_ASSESSMENTS,
  SERPENT_CIVILIZATIONS_ANCHOR_SLUG,
  SERPENT_CIVILIZATIONS_TAG,
  SERPENT_EVENTS,
  SERPENT_LANE_ANCHORS,
  SERPENT_LANE_TAGS,
  SERPENT_LANES,
  SERPENT_LINKS,
  SERPENT_SECTIONS,
  SERPENT_SOURCES,
  SERPENT_THREADS,
} from "./serpent-civilizations-seed";
import {
  CITATION_STATUSES,
  CLAIM_VERDICTS,
  CLAIM_VIEWPOINTS,
  DATE_CONVENTIONS,
  DATING_METHODS,
  EVENT_RELATIONS,
  EVIDENCE_LAYERS,
  GENEALOGY_STAGES,
  IDENTIFICATION_STATUSES,
  MEDIA_KINDS,
  TEMPORAL_CLAIM_TYPES,
  TIMELINE_CATEGORIES,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
} from "./taxonomy";
import { DATE_UNITS } from "./time";
import type { SeedEvent } from "./seed-types";

// =============================================================================
// THE SERPENT ACROSS CIVILIZATIONS
//
// The brief asked an open question and set safeguards on how it may be
// answered: narrative kept apart from excavation, no deity merged with another
// because both are serpents, no cognate from a resemblance of sound, no
// migration from a trade route, no date for a reconstructed word or an undated
// tradition, every comparison given one of five named assessments, and a
// conclusion that weighs each hypothesis with no percentages. Each is a test.
// =============================================================================

const keys = (list: readonly { key: string }[]) => new Set<string>(list.map((entry) => entry.key));
const bySlug = new Map(SERPENT_EVENTS.map((event) => [event.slug, event]));
const threads = new Set<string>(SERPENT_THREADS);
const laneTags = new Set<string>(Object.values(SERPENT_LANE_TAGS));
const laneOfName = new Map<string, keyof typeof SERPENT_LANES>(
  (Object.entries(SERPENT_LANES) as [keyof typeof SERPENT_LANES, string][]).map(([lane, name]) => [name, lane])
);
const sourceKeys = new Set(SERPENT_SOURCES.map((source) => source.key));

const sourcesOf = (event: SeedEvent): Set<string> =>
  new Set(
    [
      ...event.claims.flatMap((claim) => [...(claim.sourceKey ? [claim.sourceKey] : []), ...(claim.citations ?? []).map((c) => c.sourceKey)]),
      ...(event.passages ?? []).flatMap((passage) => [passage.sourceKey ?? "", ...passage.layers.map((layer) => layer.sourceKey ?? "")]),
    ].filter((key) => sourceKeys.has(key))
  );

/** Every other dataset in this directory, for links that leave the track and for duplicate checks. */
async function otherSeededEvents(): Promise<SeedEvent[]> {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.dirname(new URL(import.meta.url).pathname);
  const out: SeedEvent[] = [];
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith("-seed.ts") && name !== "serpent-civilizations-seed.ts")) {
    const loaded: Record<string, unknown> = await import(`./${file}`);
    for (const [name, value] of Object.entries(loaded)) {
      if (name.endsWith("_EVENTS") && Array.isArray(value)) out.push(...(value as SeedEvent[]));
      if (name === "SHOWCASE_EVENT" && value && typeof value === "object") out.push(value as SeedEvent);
    }
  }
  return out;
}

const laneOf = (event: SeedEvent) => laneOfName.get(event.subcategory ?? "");

// ---------------------------------------------------------------------------
// Size and plumbing
// ---------------------------------------------------------------------------

test("at least 80 records, spread across the nine lanes", () => {
  assert.ok(SERPENT_EVENTS.length >= 80, `${SERPENT_EVENTS.length} records`);
  const minimum: Record<keyof typeof SERPENT_LANES, number> = {
    dan: 12, africanJewish: 10, egypt: 10, kush: 8, gbe: 8, words: 4, rituals: 5, routes: 6, assessment: 11,
  };
  for (const lane of Object.keys(SERPENT_LANES) as (keyof typeof SERPENT_LANES)[]) {
    const count = SERPENT_EVENTS.filter((event) => laneOf(event) === lane).length;
    assert.ok(count >= minimum[lane], `${lane}: only ${count} records`);
  }
});

test("every record sits in exactly one lane, named by its subcategory and its lane tag", () => {
  for (const event of SERPENT_EVENTS) {
    const lane = laneOf(event);
    assert.ok(lane, `${event.slug}: subcategory "${event.subcategory}" is not a lane`);
    assert.deepEqual(event.tags.filter((tag) => laneTags.has(tag)), [SERPENT_LANE_TAGS[lane!]], `${event.slug}: lane tag`);
    assert.ok(event.tags.includes(SERPENT_CIVILIZATIONS_TAG), `${event.slug}: missing the track tag`);
  }
});

test("every lane's anchor exists in that lane, and the track anchor is the conclusion", () => {
  for (const [lane, slug] of Object.entries(SERPENT_LANE_ANCHORS)) {
    const event = bySlug.get(slug);
    assert.ok(event, `${lane}: anchor ${slug} missing`);
    assert.equal(laneOf(event!), lane, `${slug} is not in the ${lane} lane`);
  }
  assert.equal(SERPENT_CIVILIZATIONS_ANCHOR_SLUG, SERPENT_LANE_ANCHORS.assessment);
});

test("every slug is new: unique here, and not already used by any other dataset", async () => {
  assert.equal(bySlug.size, SERPENT_EVENTS.length, "duplicate slugs inside the track");
  const outside = new Set((await otherSeededEvents()).map((event) => event.slug));
  for (const slug of bySlug.keys()) assert.ok(!outside.has(slug), `${slug} already exists in another dataset`);
});

test("no record repeats the title of a record another dataset already seeds", async () => {
  const norm = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const existing = new Set((await otherSeededEvents()).map((event) => norm(event.title)));
  const here = new Set<string>();
  for (const event of SERPENT_EVENTS) {
    assert.ok(!existing.has(norm(event.title)), `${event.slug}: "${event.title}" duplicates an existing record`);
    assert.ok(!here.has(norm(event.title)), `${event.slug}: title repeated inside the track`);
    here.add(norm(event.title));
  }
});

test("a source key means one work wherever it is used", () => {
  const seen = new Map<string, string>();
  for (const section of Object.values(SERPENT_SECTIONS)) {
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
  const layers = keys(EVIDENCE_LAYERS);

  for (const source of SERPENT_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType), `${source.key}: source type ${source.sourceType}`);
    assert.ok(source.notes.trim().length > 30, `${source.key}: notes must say what the source is cited FOR`);
    assert.ok(source.url || source.reference, `${source.key}: neither URL nor reference`);
  }
  for (const event of SERPENT_EVENTS) {
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
    for (const passage of event.passages ?? []) {
      if (passage.sourceKey) assert.ok(sourceKeys.has(passage.sourceKey), `${at}: passage source ${passage.sourceKey}`);
      for (const layer of passage.layers) {
        assert.ok(layers.has(layer.layer), `${at}: layer ${layer.layer}`);
        if (layer.sourceKey) assert.ok(sourceKeys.has(layer.sourceKey), `${at}: layer source ${layer.sourceKey}`);
        if (layer.viewpoint) assert.ok(viewpoints.has(layer.viewpoint), `${at}: layer viewpoint ${layer.viewpoint}`);
        assert.ok(layer.content || layer.contentAbsentReason, `${at}: a layer has text or says why not`);
      }
    }
  }
});

test("every precision is a unit the database accepts", () => {
  const units = new Set<string>(DATE_UNITS.map((unit) => unit.key));
  for (const event of SERPENT_EVENTS) {
    for (const claim of event.claims) {
      assert.ok(units.has(claim.datePrecision), `${event.slug}: "${claim.originalDateText}" uses precision "${claim.datePrecision}"`);
    }
  }
});

test("a claim's own wording is unique within its record, because citations are matched back by it", () => {
  for (const event of SERPENT_EVENTS) {
    const texts = event.claims.map((claim) => claim.originalDateText);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: two claims share their wording`);
  }
});

test("a claim with no position says its time is unknown", () => {
  for (const event of SERPENT_EVENTS) {
    for (const claim of event.claims) {
      if (claim.startYear != null) continue;
      assert.equal(claim.temporalClaimType ?? "unknown", "unknown", `${event.slug}: "${claim.originalDateText}" has no year but claims a position`);
    }
  }
});

// ---------------------------------------------------------------------------
// What every record carries
// ---------------------------------------------------------------------------

test("every record carries at least one thread to follow, from the shared vocabulary", () => {
  for (const event of SERPENT_EVENTS) {
    const own = event.tags.filter((tag) => /^(figure|theme|place): /.test(tag));
    assert.ok(own.length >= 1, `${event.slug}: no figure, theme or place thread`);
    for (const tag of own) assert.ok(threads.has(tag), `${event.slug}: "${tag}" is not in SERPENT_THREADS`);
  }
});

test("every record has a place, a substantial description, says what the evidence does not establish, and names someone", () => {
  for (const event of SERPENT_EVENTS) {
    assert.ok(event.locationName && event.locationName.trim().length > 2, `${event.slug}: no location`);
    if (event.lat != null || event.lng != null) {
      assert.ok(Math.abs(event.lat ?? 999) <= 90 && Math.abs(event.lng ?? 999) <= 180, `${event.slug}: bad coordinates`);
    }
    assert.ok(event.description.length >= 700, `${event.slug}: description is only ${event.description.length} characters`);
    assert.match(event.description, /DOES NOT ESTABLISH/, `${event.slug}: say what the evidence does and does not establish`);
    assert.ok((event.people ?? []).length + (event.civilisations ?? []).length >= 1, `${event.slug}: names no people, gods or communities`);
  }
});

test("every date claim begins by naming its kind of evidence", () => {
  const pattern = new RegExp(`^EVIDENCE TYPE: (${EVIDENCE_TYPES.join("|")})\\b`);
  for (const event of SERPENT_EVENTS) {
    assert.ok(event.claims.length >= 1, `${event.slug}: no date claim`);
    for (const claim of event.claims) {
      assert.match(claim.evidence, pattern, `${event.slug}: "${claim.originalDateText}" does not name its evidence type`);
    }
  }
});

test("every record rests on at least two sources", () => {
  for (const event of SERPENT_EVENTS) {
    const count = sourcesOf(event).size;
    assert.ok(count >= 2, `${event.slug}: only ${count} source(s)`);
  }
});

// ---------------------------------------------------------------------------
// The safeguards
// ---------------------------------------------------------------------------

test("a reconstructed word and an undated oral tradition are never given a year", () => {
  for (const event of SERPENT_EVENTS) {
    for (const claim of event.claims) {
      if (!/^EVIDENCE TYPE: (linguistic reconstruction|oral tradition)\b/.test(claim.evidence)) continue;
      if (claim.startYear == null) continue;
      assert.ok(
        claim.isApproximate && claim.chronology !== "conventional",
        `${event.slug}: "${claim.originalDateText}" puts a reconstruction or tradition at a year as if it were documented`
      );
    }
  }
});

test("a biblical narrative is never the conventional date of an event", () => {
  for (const event of SERPENT_EVENTS) {
    for (const claim of event.claims) {
      if (!/^EVIDENCE TYPE: biblical narrative\b/.test(claim.evidence)) continue;
      assert.notEqual(claim.chronology, "conventional", `${event.slug}: "${claim.originalDateText}" dates by the narrative as if it were the conventional view`);
    }
  }
});

test("a proposed connection is an attributed hypothesis, with both cases and its genealogy", () => {
  for (const event of SERPENT_EVENTS) {
    if (!["alternative", "disputed", "hypothesised"].includes(event.eventType)) continue;
    assert.ok(event.argumentsFor && event.argumentsFor.length > 80, `${event.slug}: no case for`);
    assert.ok(event.argumentsAgainst && event.argumentsAgainst.length > 80, `${event.slug}: no case against`);
    assert.ok((event.genealogies ?? []).length >= 1, `${event.slug}: no genealogy of the claim`);
    assert.ok(event.claims.every((claim) => claim.chronology !== "conventional"), `${event.slug}: filed as the conventional view`);
  }
  // "Dan" the tribe, as a whole word: "Dangbé" is a Gbe name and says nothing about the tribe.
  const danToBenin = SERPENT_EVENTS.filter(
    (event) => /\b(tribe of dan|danites?)\b/i.test(event.title) && /b[eé]nin|dahomey|hueda|ouidah|\bgbe\b|dangb/i.test(event.title)
  );
  for (const event of danToBenin) {
    if (event.tags.includes("comparison")) continue;
    assert.ok(["alternative", "disputed", "hypothesised"].includes(event.eventType), `${event.slug}: a Dan-to-Benin connection filed as ${event.eventType}`);
  }
});

test("the ten comparisons the brief named all exist, each with one named assessment", () => {
  const wanted: [string, RegExp][] = [
    ["Dan vs Dangbé: the name", /dan\b.*dangb|dangb.*\bdan\b/i],
    ["the tribe of Dan and the biblical serpent", /tribe of dan.*serpent|serpent.*tribe of dan/i],
    ["Nehushtan vs Dangbé", /nehushtan/i],
    ["Wadjet vs Dangbé", /wadjet/i],
    ["Egyptian royal ceremonies vs Hueda coronations", /coronation/i],
    ["Kushite iconography vs West African cosmology", /kush/i],
    ["Savi's serpent ditch vs Nile Valley landscapes", /ditch/i],
    ["Genesis 3 vs the Dagbé hymn", /genesis/i],
    ["Danite migration traditions vs African Jewish history", /danite|migration/i],
    ["African serpent traditions and their Atlantic transmission", /atlantic/i],
  ];
  const comparisons = SERPENT_EVENTS.filter((event) => event.tags.includes("comparison"));
  const used = new Set<string>();
  for (const [name, pattern] of wanted) {
    const match = comparisons.find((event) => pattern.test(event.title) && !used.has(event.slug));
    assert.ok(match, `no comparison record for ${name}`);
    used.add(match.slug);
  }
  for (const event of comparisons) {
    assert.match(event.description, /SIMILARIT/i, `${event.slug}: say what is similar`);
    assert.match(event.description, /DIFFERENCE/i, `${event.slug}: say what differs`);
    assert.match(event.description, /EVIDENCE FOR (HISTORICAL )?TRANSMISSION/i, `${event.slug}: say what the evidence for transmission is`);
    const assessments = event.tags.filter((tag) => tag.startsWith("comparison: "));
    assert.equal(assessments.length, 1, `${event.slug}: needs exactly one "comparison: <assessment>" tag`);
    assert.ok((COMPARISON_ASSESSMENTS as readonly string[]).includes(assessments[0].slice("comparison: ".length)), `${event.slug}: ${assessments[0]}`);
  }
});

test("the five routes are each a record, and none is drawn as established", () => {
  for (const letter of ["A", "B", "C", "D", "E"]) {
    const route = SERPENT_EVENTS.find((event) => new RegExp(`^Route ${letter}\\b`).test(event.title));
    assert.ok(route, `no record for route ${letter}`);
    for (const heading of ["ARCHAEOLOGICAL EVIDENCE", "TEXTUAL EVIDENCE", "LINGUISTIC EVIDENCE", "GAPS", "CONTRADICTS"]) {
      assert.match(route!.description, new RegExp(heading, "i"), `${route!.slug}: no ${heading}`);
    }
  }
});

test("the conclusion weighs every hypothesis the brief named, in words, with no percentages", () => {
  const conclusion = bySlug.get(SERPENT_CIVILIZATIONS_ANCHOR_SLUG)!;
  const text = conclusion.description;
  assert.doesNotMatch(text, /\d\s?%|per ?cent|percent/i, "no numerical confidence");
  for (const label of HYPOTHESIS_ASSESSMENTS) assert.match(text, new RegExp(label, "i"), `the conclusion never uses "${label}"`);
  for (const hypothesis of [
    /common ancestry/i, /borrowing/i, /mytholog/i, /ritual/i, /egyptian influence on kush/i,
    /kushite influence/i, /jewish migration/i, /danite migration/i, /independent development/i, /later cultural transmission/i,
  ]) {
    assert.match(text, hypothesis, `the conclusion does not weigh ${hypothesis}`);
  }
  for (const heading of ["STRONGEST SUPPORT", "STRONGEST COUNTEREVIDENCE", "MISSING LINK", "WOULD STRENGTHEN", "WOULD WEAKEN"]) {
    assert.match(text, new RegExp(heading, "i"), `the conclusion lacks ${heading}`);
  }
});

// ---------------------------------------------------------------------------
// Pictures
// ---------------------------------------------------------------------------

test("every record has a picture, or names its image gap and where the image is", () => {
  for (const event of SERPENT_EVENTS) {
    if ((event.media ?? []).length >= 1) {
      if (event.imageUrl) assert.equal(event.media![0].url, event.imageUrl, `${event.slug}: cover is not first`);
      continue;
    }
    assert.match(event.description, /IMAGE GAP:/, `${event.slug}: no picture and no stated image gap`);
  }
});

test("at least forty distinct pictures", () => {
  const files = new Set(SERPENT_EVENTS.flatMap((event) => (event.media ?? []).map((picture) => picture.fileName)));
  assert.ok(files.size >= 40, `only ${files.size} distinct pictures`);
});

test("every picture is a named Commons file, freely licensed, whose credit is fetched at seed time", () => {
  for (const event of SERPENT_EVENTS) {
    for (const picture of event.media ?? []) {
      assert.ok(picture.fileName, `${event.slug}: picture without a file name`);
      assert.match(picture.url, /^https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\//, `${event.slug}: not a Commons file`);
      assert.equal(picture.creditFrom, "source", `${event.slug}: credit must be fetched`);
      assert.ok(picture.licence, `${event.slug}: ${picture.fileName} has no licence recorded from research`);
      assert.doesNotMatch(picture.licence ?? "", /non-?free|fair use|all rights reserved/i, `${event.slug}: ${picture.fileName}`);
    }
  }
});

test("an UNVERIFIED picture says so first, and only an unverified one does", () => {
  for (const event of SERPENT_EVENTS) {
    for (const picture of event.media ?? []) {
      const flagged = (picture.caption ?? "").startsWith("UNVERIFIED —");
      assert.equal(flagged, picture.identificationStatus === "unverified", `${event.slug}: ${picture.fileName} caption/status mismatch`);
    }
  }
});

test("a reconstruction, later artwork or engraving declares itself in its caption", () => {
  for (const event of SERPENT_EVENTS) {
    for (const picture of event.media ?? []) {
      if (!["reconstruction", "later_artwork", "engraving", "replica"].includes(picture.shows ?? "")) continue;
      assert.match(
        picture.caption ?? "",
        /reconstruct|later|modern|centur|painting|engraving|artist|imagin|drawn|statue|replica|illustrat|lithograph|print/i,
        `${event.slug}: ${picture.fileName}`
      );
    }
  }
});

test("the same Commons file is not used twice in one gallery", () => {
  for (const event of SERPENT_EVENTS) {
    const files = (event.media ?? []).map((picture) => picture.fileName);
    assert.equal(new Set(files).size, files.length, `${event.slug}: a picture repeats`);
  }
});

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

test("every link names records that exist, a real relation, and says why", async () => {
  const outside = new Set((await otherSeededEvents()).map((event) => event.slug));
  const relations = keys(EVENT_RELATIONS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  for (const link of SERPENT_LINKS) {
    const label = `${link.from} → ${link.to}`;
    assert.ok(bySlug.has(link.from) || bySlug.has(link.to), `${label}: neither end is in the track`);
    assert.ok(bySlug.has(link.from) || outside.has(link.from), `${label}: ${link.from} does not exist`);
    assert.ok(bySlug.has(link.to) || outside.has(link.to), `${label}: ${link.to} does not exist`);
    assert.notEqual(link.from, link.to, label);
    assert.ok(relations.has(link.relation), `${label}: relation ${link.relation}`);
    if (link.viewpoint) assert.ok(viewpoints.has(link.viewpoint), `${label}: viewpoint ${link.viewpoint}`);
    if (link.sourceKey) assert.ok(sourceKeys.has(link.sourceKey), `${label}: source ${link.sourceKey}`);
    assert.ok(link.note.trim().length > 20, `${label}: say why`);
  }
});

test("every record is connected, and the track reaches the serpent records already seeded", async () => {
  const linked = new Set(SERPENT_LINKS.flatMap((link) => [link.from, link.to]));
  for (const slug of bySlug.keys()) assert.ok(linked.has(slug), `${slug} has no links`);
  const outside = new Set((await otherSeededEvents()).map((event) => event.slug));
  const out = SERPENT_LINKS.filter((link) => outside.has(link.from) || outside.has(link.to));
  assert.ok(out.length >= 25, `only ${out.length} links to existing records`);
  const betweenLanes = SERPENT_LINKS.filter(
    (link) => bySlug.has(link.from) && bySlug.has(link.to) && laneOf(bySlug.get(link.from)!) !== laneOf(bySlug.get(link.to)!)
  ).length;
  assert.ok(betweenLanes >= 40, `only ${betweenLanes} links between lanes`);
});
