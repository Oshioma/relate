import { test } from "node:test";
import assert from "node:assert/strict";

import {
  EVIDENCE_TYPES,
  FOLLOW_TAGS,
  VODUN_DIASPORA_ANCHORS,
  VODUN_DIASPORA_DATASETS,
  VODUN_DIASPORA_EVENTS,
  VODUN_DIASPORA_LINKS,
  VODUN_DIASPORA_SECTIONS,
  VODUN_DIASPORA_TAG,
  VODUN_DIASPORA_TRACKS,
  VODUN_TRACK_TAGS,
} from "./vodun-diaspora-seed";
import { BENIN_VODUN_EVENTS } from "./benin-vodun-seed";
import { BENIN_DAHOMEY_EVENTS } from "./benin-dahomey-seed";
import { BENIN_ATLANTIC_EVENTS } from "./benin-atlantic-seed";
import { BENIN_DEEP_PAST_EVENTS } from "./benin-deep-past-seed";
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
import { DATE_UNITS } from "./time";
import type { SeedEvent } from "./seed-types";

// =============================================================================
// THE VODUN, VODOU AND VOODOO EXPANSION
//
// Six tracks extending benin-vodun from West Africa to the present. The brief
// asked for a size, for six named tracks, for every date to say what kind of
// evidence it rests on, for comparisons that keep resemblance apart from
// descent, for no invented ancient origins, and for links that let a reader
// follow one god, practice or place across centuries. Each is a test here.
// =============================================================================

const keys = (list: readonly { key: string }[]) => new Set<string>(list.map((entry) => entry.key));
const bySlug = new Map(VODUN_DIASPORA_EVENTS.map((event) => [event.slug, event]));
const followTags = new Set<string>(FOLLOW_TAGS);
const trackTags = new Set<string>(Object.values(VODUN_TRACK_TAGS));
const beninSlugs = new Set(
  [...BENIN_VODUN_EVENTS, ...BENIN_DAHOMEY_EVENTS, ...BENIN_ATLANTIC_EVENTS, ...BENIN_DEEP_PAST_EVENTS].map((event) => event.slug)
);

const sourcesOf = (event: SeedEvent, sourceKeys: Set<string>): Set<string> =>
  new Set(
    event.claims
      .flatMap((claim) => [...(claim.sourceKey ? [claim.sourceKey] : []), ...(claim.citations ?? []).map((c) => c.sourceKey)])
      .filter((key) => sourceKeys.has(key))
  );

/** Slugs every other dataset in this directory seeds, for links that leave the expansion. */
async function otherSeededSlugs(): Promise<Set<string>> {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.dirname(new URL(import.meta.url).pathname);
  const out = new Set<string>();
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith("-seed.ts") && name !== "vodun-diaspora-seed.ts")) {
    const loaded: Record<string, unknown> = await import(`./${file}`);
    for (const [name, value] of Object.entries(loaded)) {
      if (name.endsWith("_EVENTS") && Array.isArray(value)) for (const event of value as SeedEvent[]) out.add(event.slug);
      if (name === "SHOWCASE_EVENT" && value && typeof value === "object") out.add((value as SeedEvent).slug);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Size and plumbing
// ---------------------------------------------------------------------------

test("between 150 and 200 new records, spread across the six tracks as the brief asked", () => {
  const total = VODUN_DIASPORA_EVENTS.length;
  assert.ok(total >= 150 && total <= 200, `${total} records`);
  const minimum: Record<string, number> = { africa: 30, kingdoms: 25, atlantic: 25, haiti: 35, americas: 30, modern: 15 };
  for (const dataset of VODUN_DIASPORA_DATASETS) {
    assert.ok(dataset.events.length >= minimum[dataset.key], `${dataset.key}: only ${dataset.events.length} records`);
  }
});

test("every slug is new: unique here, and not already used by any other dataset", async () => {
  assert.equal(bySlug.size, VODUN_DIASPORA_EVENTS.length, "duplicate slugs inside the expansion");
  const outside = await otherSeededSlugs();
  for (const slug of bySlug.keys()) assert.ok(!outside.has(slug), `${slug} already exists in another dataset`);
});

test("no record repeats the title of an existing Bénin record", () => {
  const norm = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const existing = new Set(
    [...BENIN_VODUN_EVENTS, ...BENIN_DAHOMEY_EVENTS, ...BENIN_ATLANTIC_EVENTS, ...BENIN_DEEP_PAST_EVENTS].map((e) => norm(e.title))
  );
  for (const event of VODUN_DIASPORA_EVENTS) assert.ok(!existing.has(norm(event.title)), `${event.slug}: "${event.title}" duplicates a Bénin record`);
});

test("each track's anchor exists and belongs to that track", () => {
  for (const dataset of VODUN_DIASPORA_DATASETS) {
    assert.equal(dataset.anchorSlug, VODUN_DIASPORA_ANCHORS[dataset.key]);
    assert.ok(dataset.events.some((event) => event.slug === dataset.anchorSlug), `${dataset.key}: anchor ${dataset.anchorSlug} missing`);
  }
});

test("the six tracks are distinct and none reuses a Bénin track's slug", () => {
  const slugs = Object.values(VODUN_DIASPORA_TRACKS).map((track) => track.slug);
  assert.equal(new Set(slugs).size, 6);
  for (const slug of slugs) assert.ok(!/^benin-/.test(slug), slug);
});

test("a source key means one work wherever it is used", () => {
  const seen = new Map<string, string>();
  for (const section of VODUN_DIASPORA_SECTIONS) {
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

  for (const dataset of VODUN_DIASPORA_DATASETS) {
    const sourceKeys = new Set(dataset.sources.map((source) => source.key));
    for (const source of dataset.sources) {
      assert.ok(sourceTypes.has(source.sourceType), `${source.key}: source type ${source.sourceType}`);
      assert.ok(source.notes.trim().length > 30, `${source.key}: notes must say what the source is cited FOR`);
      assert.ok(source.url || source.reference, `${source.key}: neither URL nor reference`);
    }
    for (const event of dataset.events) {
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
  }
});

test("every precision is a unit the database accepts", () => {
  // "exact_date" is the old spelling; the claims table rejects it, and eight
  // Bénin records once failed to seed because of it.
  const units = new Set<string>(DATE_UNITS.map((unit) => unit.key));
  for (const event of VODUN_DIASPORA_EVENTS) {
    for (const claim of event.claims) {
      assert.ok(units.has(claim.datePrecision), `${event.slug}: "${claim.originalDateText}" uses precision "${claim.datePrecision}"`);
    }
  }
});

test("a claim's own wording is unique within its record, because citations are matched back by it", () => {
  for (const event of VODUN_DIASPORA_EVENTS) {
    const texts = event.claims.map((claim) => claim.originalDateText);
    assert.equal(new Set(texts).size, texts.length, `${event.slug}: two claims share their wording`);
  }
});

// ---------------------------------------------------------------------------
// What every record carries
// ---------------------------------------------------------------------------

test("every record carries the expansion tag, exactly its own track's tag, and at least one thread to follow", () => {
  for (const dataset of VODUN_DIASPORA_DATASETS) {
    for (const event of dataset.events) {
      assert.ok(event.tags.includes(VODUN_DIASPORA_TAG), `${event.slug}: missing ${VODUN_DIASPORA_TAG}`);
      assert.deepEqual(event.tags.filter((tag) => trackTags.has(tag)), [VODUN_TRACK_TAGS[dataset.key]], `${event.slug}: track tag`);
      const threads = event.tags.filter((tag) => /^(deity|practice|place): /.test(tag));
      assert.ok(threads.length >= 1, `${event.slug}: no deity, practice or place thread`);
      for (const tag of threads) assert.ok(followTags.has(tag), `${event.slug}: "${tag}" is not in FOLLOW_TAGS`);
    }
  }
});

test("every record has a place, a substantial description and named people, powers or institutions", () => {
  for (const event of VODUN_DIASPORA_EVENTS) {
    assert.ok(event.locationName && event.locationName.trim().length > 2, `${event.slug}: no location`);
    if (event.lat != null || event.lng != null) {
      assert.ok(Math.abs(event.lat ?? 999) <= 90 && Math.abs(event.lng ?? 999) <= 180, `${event.slug}: bad coordinates`);
    }
    assert.ok(event.description.length >= 600, `${event.slug}: description is only ${event.description.length} characters`);
    assert.match(event.description, /SIGNIFICANCE/i, `${event.slug}: description should say why it matters`);
    assert.ok((event.people ?? []).length + (event.civilisations ?? []).length >= 1, `${event.slug}: names no people, powers or communities`);
  }
});

test("every date claim begins by naming its kind of evidence", () => {
  const pattern = new RegExp(`^EVIDENCE TYPE: (${EVIDENCE_TYPES.join("|")})\\b`);
  for (const event of VODUN_DIASPORA_EVENTS) {
    assert.ok(event.claims.length >= 1, `${event.slug}: no date claim`);
    for (const claim of event.claims) {
      assert.match(claim.evidence, pattern, `${event.slug}: "${claim.originalDateText}" does not name its evidence type`);
    }
  }
});

test("every record rests on at least two sources", () => {
  for (const dataset of VODUN_DIASPORA_DATASETS) {
    const sourceKeys = new Set(dataset.sources.map((source) => source.key));
    for (const event of dataset.events) {
      const count = sourcesOf(event, sourceKeys).size;
      assert.ok(count >= 2, `${event.slug}: only ${count} source(s)`);
    }
  }
});

// ---------------------------------------------------------------------------
// Origins, derivations and resemblance
// ---------------------------------------------------------------------------

test("no religious origin before 1500 is given a precise date", () => {
  for (const event of VODUN_DIASPORA_EVENTS) {
    for (const claim of event.claims) {
      if (claim.startYear == null || claim.startYear >= 1500) continue;
      const aboutOrigin = /origin|began|begin|founded|emerge|first appear/i.test(claim.whatIsDated ?? "");
      if (!aboutOrigin) continue;
      assert.ok(
        claim.isApproximate || claim.chronology !== "conventional",
        `${event.slug}: "${claim.originalDateText}" dates an early origin precisely as the conventional view`
      );
    }
  }
});

test("an ancient-derivation theory is only ever an attributed alternative, with both cases and its genealogy", () => {
  const derivation = /\b(egypt\w*|sumer\w*|atlantis|kemet\w*|mesopotam\w*)\b/i;
  for (const event of VODUN_DIASPORA_EVENTS) {
    if (!derivation.test(`${event.title} ${event.summary}`)) continue;
    assert.ok(["alternative", "disputed", "hypothesised"].includes(event.eventType), `${event.slug}: derivation theory filed as ${event.eventType}`);
    assert.ok(event.argumentsFor && event.argumentsFor.length > 80, `${event.slug}: no case for`);
    assert.ok(event.argumentsAgainst && event.argumentsAgainst.length > 80, `${event.slug}: no case against`);
    assert.ok((event.genealogies ?? []).length >= 1, `${event.slug}: no genealogy of the claim`);
    assert.ok(event.claims.every((claim) => claim.chronology !== "conventional"), `${event.slug}: filed as the conventional view`);
  }
});

test("the ten comparisons the brief named all exist, and each says what the evidence for transmission is", () => {
  const wanted: [string, RegExp][] = [
    ["Dan and the cosmic serpent", /dan|aido/i],
    ["Legba and Papa Legba", /legba/i],
    ["African Vodun and Haitian lwa", /lwa/i],
    ["Yoruba Orisha and Haitian traditions", /orisha|orisa/i],
    ["sacred trees and forests", /tree|forest/i],
    ["divination systems", /divination|fa\b|ifa|ifá/i],
    ["ancestor veneration", /ancestor/i],
    ["possession and ritual music", /possession|drum|music/i],
    ["sacred crossroads", /crossroad/i],
    ["serpent symbolism across the Atlantic", /serpent|snake|python/i],
  ];
  const comparisons = VODUN_DIASPORA_EVENTS.filter((event) => event.tags.includes("comparison"));
  for (const [name, pattern] of wanted) {
    const match = comparisons.find((event) => pattern.test(event.title));
    assert.ok(match, `no comparison record for ${name}`);
    assert.match(match.description, /SIMILARIT/i, `${match.slug}: say what is similar`);
    assert.match(match.description, /DIFFERENCE/i, `${match.slug}: say what differs`);
    assert.match(match.description, /EVIDENCE FOR (HISTORICAL )?TRANSMISSION/i, `${match.slug}: say what the evidence for transmission is`);
  }
});

// ---------------------------------------------------------------------------
// Pictures
// ---------------------------------------------------------------------------

test("every record has at least one picture, with its cover first in the gallery", () => {
  for (const event of VODUN_DIASPORA_EVENTS) {
    assert.ok((event.media ?? []).length >= 1, `${event.slug}: no picture`);
    if (event.imageUrl) assert.equal(event.media![0].url, event.imageUrl, `${event.slug}: cover is not first`);
  }
});

test("every picture is a named Commons file, freely licensed, whose credit is fetched at seed time", () => {
  for (const event of VODUN_DIASPORA_EVENTS) {
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
  for (const event of VODUN_DIASPORA_EVENTS) {
    for (const picture of event.media ?? []) {
      const flagged = (picture.caption ?? "").startsWith("UNVERIFIED —");
      assert.equal(flagged, picture.identificationStatus === "unverified", `${event.slug}: ${picture.fileName} caption/status mismatch`);
    }
  }
});

test("a reconstruction, later artwork or engraving declares itself in its caption", () => {
  for (const event of VODUN_DIASPORA_EVENTS) {
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
  for (const event of VODUN_DIASPORA_EVENTS) {
    const files = (event.media ?? []).map((picture) => picture.fileName);
    assert.equal(new Set(files).size, files.length, `${event.slug}: a picture repeats`);
  }
});

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

test("every link names records that exist, a real relation, and says why", async () => {
  const outside = await otherSeededSlugs();
  const relations = keys(EVENT_RELATIONS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  for (const link of VODUN_DIASPORA_LINKS) {
    const label = `${link.from} → ${link.to}`;
    assert.ok(bySlug.has(link.from) || bySlug.has(link.to), `${label}: neither end is in the expansion`);
    assert.ok(bySlug.has(link.from) || outside.has(link.from), `${label}: ${link.from} does not exist`);
    assert.ok(bySlug.has(link.to) || outside.has(link.to), `${label}: ${link.to} does not exist`);
    assert.notEqual(link.from, link.to, label);
    assert.ok(relations.has(link.relation), `${label}: relation ${link.relation}`);
    if (link.viewpoint) assert.ok(viewpoints.has(link.viewpoint), `${label}: viewpoint ${link.viewpoint}`);
    assert.ok(link.note.trim().length > 20, `${label}: say why`);
  }
});

test("a link is seeded with a track whose records come no earlier than either end, with its source", () => {
  const order = new Map<string, number>();
  VODUN_DIASPORA_DATASETS.forEach((dataset, index) => {
    for (const event of dataset.events) order.set(event.slug, index);
  });
  VODUN_DIASPORA_DATASETS.forEach((dataset, index) => {
    for (const link of dataset.links) {
      assert.ok((order.get(link.from) ?? -1) <= index && (order.get(link.to) ?? -1) <= index, `${link.from} → ${link.to} is seeded too early`);
    }
  });
});

test("a link's source belongs to the dataset that seeds it", () => {
  for (const dataset of VODUN_DIASPORA_DATASETS) {
    const sourceKeys = new Set(dataset.sources.map((source) => source.key));
    for (const link of dataset.links) {
      if (link.sourceKey) assert.ok(sourceKeys.has(link.sourceKey), `${link.from} → ${link.to}: source ${link.sourceKey}`);
    }
  }
});

test("every record is connected to at least one other record", () => {
  const linked = new Set(VODUN_DIASPORA_LINKS.flatMap((link) => [link.from, link.to]));
  for (const slug of bySlug.keys()) assert.ok(linked.has(slug), `${slug} has no links`);
});

test("the expansion reaches into the Bénin datasets and between its own tracks", () => {
  const trackOf = new Map<string, string>();
  for (const dataset of VODUN_DIASPORA_DATASETS) for (const event of dataset.events) trackOf.set(event.slug, dataset.key);
  const toBenin = VODUN_DIASPORA_LINKS.filter((link) => beninSlugs.has(link.from) || beninSlugs.has(link.to));
  assert.ok(toBenin.length >= 40, `only ${toBenin.length} links into the Bénin datasets`);
  const between = VODUN_DIASPORA_LINKS.filter(
    (link) => trackOf.has(link.from) && trackOf.has(link.to) && trackOf.get(link.from) !== trackOf.get(link.to)
  );
  assert.ok(between.length >= 40, `only ${between.length} links between the six tracks`);
  for (const dataset of VODUN_DIASPORA_DATASETS) {
    const reachesBenin = dataset.links.some((link) => beninSlugs.has(link.from) || beninSlugs.has(link.to));
    assert.ok(reachesBenin || dataset.key === "americas", `${dataset.key}: no link into the Bénin datasets`);
  }
});
