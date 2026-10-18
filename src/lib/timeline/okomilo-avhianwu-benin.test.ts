import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ANWU_MIGRATION_SLUG,
  GENEALOGY_BREAK_SLUG,
  GENEALOGY_LAYER_TAGS,
  OKOMILO_ANCHOR_SLUG,
  OKOMILO_EVENTS,
  OKOMILO_LANES,
  OKOMILO_LINKS,
  OKOMILO_SOURCES,
  OKOMILO_TRACK,
} from "./okomilo-avhianwu-benin-seed";
import {
  CITATION_STATUSES,
  CLAIM_VERDICTS,
  CLAIM_VIEWPOINTS,
  DATING_METHODS,
  EVENT_RELATIONS,
  GENEALOGY_STAGES,
  IDENTIFICATION_STATUSES,
  TEMPORAL_CLAIM_TYPES,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
} from "./taxonomy";
import type { SeedEvent } from "./seed-types";

// =============================================================================
// THE OKOMILO / AVHIANWU / KINGDOM OF BENIN TRACK
//
// The brief this dataset was built from made twelve promises. Each is a test
// here, so that a later edit cannot quietly turn testimony into a document, a
// tradition into a pedigree, or one Benin into the other.
// =============================================================================

const bySlug = new Map(OKOMILO_EVENTS.map((event) => [event.slug, event]));
const sourceByKey = new Map(OKOMILO_SOURCES.map((source) => [source.key, source]));
const get = (slug: string): SeedEvent => {
  const event = bySlug.get(slug);
  assert.ok(event, `no record "${slug}"`);
  return event;
};
const keys = (list: readonly { key: string }[]) => new Set<string>(list.map((entry) => entry.key));

const SAM = "okomilo-sam-born-in-jos";

// ---------------------------------------------------------------------------
// Plumbing
// ---------------------------------------------------------------------------

test("every slug is unique, every vocabulary key exists, every source is defined", () => {
  assert.equal(bySlug.size, OKOMILO_EVENTS.length, "duplicate slugs");
  assert.equal(sourceByKey.size, OKOMILO_SOURCES.length, "duplicate source keys");
  const eventTypes = keys(TIMELINE_EVENT_TYPES);
  const sourceTypes = keys(TIMELINE_SOURCE_TYPES);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const methods = keys(DATING_METHODS);
  const temporal = keys(TEMPORAL_CLAIM_TYPES);
  const identification = keys(IDENTIFICATION_STATUSES);
  for (const source of OKOMILO_SOURCES) {
    assert.ok(sourceTypes.has(source.sourceType), `${source.key}: source type ${source.sourceType}`);
    if (source.citedBy) assert.ok(sourceByKey.has(source.citedBy), `${source.key}: citedBy ${source.citedBy}`);
  }
  const lanes = new Set<string>(Object.values(OKOMILO_LANES));
  for (const event of OKOMILO_EVENTS) {
    assert.ok(eventTypes.has(event.eventType), `${event.slug}: event type ${event.eventType}`);
    assert.ok(event.subcategory && lanes.has(event.subcategory), `${event.slug}: not in a lane`);
    if (event.identificationStatus) assert.ok(identification.has(event.identificationStatus), event.slug);
    assert.ok(event.claims.length > 0, `${event.slug}: no claims`);
    const texts = new Set<string>();
    for (const claim of event.claims) {
      assert.ok(!texts.has(claim.originalDateText), `${event.slug}: claim text repeated`);
      texts.add(claim.originalDateText);
      if (claim.sourceKey) assert.ok(sourceByKey.has(claim.sourceKey), `${event.slug}: source ${claim.sourceKey}`);
      for (const citation of claim.citations ?? []) assert.ok(sourceByKey.has(citation.sourceKey), `${event.slug}: cites ${citation.sourceKey}`);
      assert.ok(viewpoints.has(claim.chronology), `${event.slug}: viewpoint ${claim.chronology}`);
      assert.ok(methods.has(claim.datingMethod), `${event.slug}: method ${claim.datingMethod}`);
      if (claim.temporalClaimType) assert.ok(temporal.has(claim.temporalClaimType), `${event.slug}: ${claim.temporalClaimType}`);
    }
    for (const genealogy of event.genealogies ?? []) {
      assert.ok(keys(CLAIM_VERDICTS).has(genealogy.verdict), genealogy.key);
      for (const link of genealogy.links) {
        assert.ok(keys(GENEALOGY_STAGES).has(link.stage), `${genealogy.key}: stage ${link.stage}`);
        if (link.citationStatus) assert.ok(keys(CITATION_STATUSES).has(link.citationStatus), genealogy.key);
        assert.ok(link.says || link.saysAbsentReason, `${genealogy.key}: link with neither text nor reason`);
      }
    }
  }
});

test("every link joins two records in this track with a known relation, once", () => {
  const relations = keys(EVENT_RELATIONS);
  const viewpoints = keys(CLAIM_VIEWPOINTS);
  const seen = new Set<string>();
  for (const link of OKOMILO_LINKS) {
    assert.ok(bySlug.has(link.from), `no record ${link.from}`);
    assert.ok(bySlug.has(link.to), `no record ${link.to}`);
    assert.notEqual(link.from, link.to);
    assert.ok(relations.has(link.relation), `unknown relation ${link.relation}`);
    if (link.viewpoint) assert.ok(viewpoints.has(link.viewpoint), `unknown viewpoint ${link.viewpoint}`);
    if (link.sourceKey) assert.ok(sourceByKey.has(link.sourceKey), `no source ${link.sourceKey}`);
    const id = `${link.from}|${link.to}|${link.relation}|${link.viewpoint ?? ""}`;
    assert.ok(!seen.has(id), `duplicate edge ${id}`);
    seen.add(id);
  }
});

test("no record or note in this track rates anything with a score", () => {
  const text = JSON.stringify({ OKOMILO_EVENTS, OKOMILO_LINKS, OKOMILO_SOURCES });
  assert.doesNotMatch(text, /confidence (score|level|rating)/i);
});

// ---------------------------------------------------------------------------
// The twelve promises
// ---------------------------------------------------------------------------

test("1. Oshioma Okomilo is linked as son of Sam Ikhenemho Okomilo", () => {
  const edge = OKOMILO_LINKS.find((link) => link.from === OKOMILO_ANCHOR_SLUG && link.to === SAM);
  assert.ok(edge, "no edge from Oshioma to Sam");
  assert.equal(edge.relation, "child_of");
  assert.match(get(OKOMILO_ANCHOR_SLUG).title, /Oshioma Okomilo/);
  assert.match(get(SAM).title, /Sam Ikhenemho Okomilo/);
});

test("2. that relationship is family-supplied testimony, not a fabricated document", () => {
  const edge = OKOMILO_LINKS.find((link) => link.from === OKOMILO_ANCHOR_SLUG && link.to === SAM)!;
  assert.equal(edge.sourceKey, "family_testimony");
  assert.equal(edge.viewpoint, "community");
  assert.match(edge.note, /FAMILY-SUPPLIED PRIMARY TESTIMONY/);
  const source = sourceByKey.get("family_testimony")!;
  assert.equal(source.sourceType, "interview", "family testimony must not be filed as a document");
  assert.equal(source.url, undefined, "family testimony must not point at a website");
  assert.match(source.notes, /NOT derived from any website/);
  const oshioma = get(OKOMILO_ANCHOR_SLUG);
  assert.ok(oshioma.tags.includes("evidence:family-testimony"));
  // No birth date is invented: the only claim dates the testimony.
  for (const claim of oshioma.claims) assert.match(claim.whatIsDated ?? "", /testimony/);
});

/** Walk child_of edges upwards from a record. */
function ancestors(start: string): Set<string> {
  const found = new Set<string>();
  const queue = [start];
  while (queue.length) {
    const current = queue.shift()!;
    for (const link of OKOMILO_LINKS) {
      if (link.relation !== "child_of" || link.from !== current || found.has(link.to)) continue;
      found.add(link.to);
      queue.push(link.to);
    }
  }
  return found;
}

test("3. no continuous genealogy runs from Sam back to Anwu", () => {
  const fromSam = ancestors(SAM);
  for (const slug of ["okomilo-anwu", "okomilo-imhakhena-founds-ogbona", "okomilo-ogbona-genealogy", "okomilo-alokoko-ancestral-mother"]) {
    assert.ok(!fromSam.has(slug), `Sam's documented line reaches ${slug} by child_of edges`);
  }
  // The MATERNAL line does reach the Asekomhe dynasty (Pa Ereghi), because a
  // named source — the Asekomhe family historian — names Sam's mother as Pa
  // Asekomhe's daughter. It must stop there: Pa Ereghi's claimed descent from
  // Imhakhena spans uncounted generations and may not be a parent–child edge.
  assert.ok(fromSam.has("okomilo-asekomhe-dynasty-genealogy"), "the sourced maternal line has been lost");
  const toImhakhena = OKOMILO_LINKS.find(
    (link) => link.from === "okomilo-asekomhe-dynasty-genealogy" && link.to === "okomilo-imhakhena-founds-ogbona"
  );
  assert.ok(toImhakhena, "the claimed descent should still be recorded");
  assert.notEqual(toImhakhena.relation, "child_of");
  assert.match(toImhakhena.note, /UNCOUNTED GENERATIONS/);
  for (const link of OKOMILO_LINKS.filter((l) => l.relation === "child_of" && ancestors(SAM).has(l.to))) {
    assert.ok(link.sourceKey, `${link.from}→${link.to}: a documented-line edge must name its source`);
  }
  // The two kinds of descent never mix on one edge chain: every child_of edge
  // is either family testimony (community) or tradition (oral_tradition), and
  // no family-testimony edge points at a tradition-layer record.
  for (const link of OKOMILO_LINKS.filter((l) => l.relation === "child_of")) {
    assert.ok(link.viewpoint === "community" || link.viewpoint === "oral_tradition", `${link.from}→${link.to}: whose descent?`);
    if (link.viewpoint === "community") {
      assert.ok(!get(link.to).tags.includes(GENEALOGY_LAYER_TAGS.tradition), `${link.from}→${link.to} crosses the break`);
    }
  }
  // The break is a real record, in the open-questions lane, with no date.
  const gap = get(GENEALOGY_BREAK_SLUG);
  assert.match(gap.description, /NOT EVIDENCE THAT THE TRADITIONS ARE FALSE/);
  assert.ok(gap.claims.every((claim) => claim.startYear == null && claim.temporalClaimType === "unknown"));
});

test("4. Okomilo is associated with Innih", () => {
  const family = get("okomilo-family-of-innih");
  assert.match(family.title, /nine kindred families of Innih/);
  const edge = OKOMILO_LINKS.find((link) => link.from === "okomilo-family-of-innih" && link.to === "okomilo-innih-village");
  assert.equal(edge?.relation, "part_of");
  // Innih → Ivhitse → Ivhiochie → Ogbona, as membership.
  for (const [from, to] of [
    ["okomilo-innih-village", "okomilo-ivhitse-quarter"],
    ["okomilo-ivhitse-quarter", "okomilo-ivhiochie-children-of-ochie"],
    ["okomilo-ivhiochie-children-of-ochie", "okomilo-ogbona-genealogy"],
  ]) {
    assert.ok(OKOMILO_LINKS.some((link) => link.from === from && link.to === to && link.relation === "part_of"), `${from} part_of ${to}`);
  }
});

test("5. the Kingdom of Benin (Nigeria) is never conflated with the Republic of Benin / Dahomey", () => {
  assert.doesNotMatch(OKOMILO_TRACK.slug, /dahomey|vodun|atlantic/);
  for (const event of OKOMILO_EVENTS) {
    for (const tag of event.tags) assert.doesNotMatch(tag, /dahomey|vodun|republic-of-benin|benin-atlantic/, `${event.slug}: tag ${tag}`);
    for (const civ of event.civilisations ?? []) assert.doesNotMatch(civ, /Dahomey|Republic of Benin|Vodun/, `${event.slug}: ${civ}`);
    // Any mention of the Republic must be a disclaimer, never a description.
    const text = `${event.title} ${event.summary} ${event.description}`;
    for (const match of text.matchAll(/(Republic of Benin|Dahomey)/g)) {
      const window = text.slice(Math.max(0, match.index! - 40), match.index! + 40);
      assert.match(window, /not|NOT/, `${event.slug}: mentions "${match[1]}" without saying it is not this Benin`);
    }
  }
  for (const link of OKOMILO_LINKS) {
    assert.doesNotMatch(link.to + link.from, /dahomey|vodun|benin-atlantic/);
  }
  for (const event of OKOMILO_EVENTS.filter((e) => e.tags.includes("kingdom-of-benin"))) {
    assert.ok(event.tags.includes("nigeria"), `${event.slug}: Kingdom of Benin record not marked Nigeria`);
  }
});

test("6. the Ewuare and Ozolua migration dates stay separate claims", () => {
  const migration = get(ANWU_MIGRATION_SLUG);
  const ewuare = migration.claims.find((claim) => /Ewuare|Eware/.test(claim.originalDateText));
  const ozolua = migration.claims.filter((claim) => /Ozolua|1481/.test(claim.originalDateText));
  assert.ok(ewuare, "no Ewuare-era claim");
  assert.ok(ozolua.length >= 1, "no Ozolua-era claim");
  assert.equal(ewuare.startYear, 1440);
  assert.equal(ewuare.endYear, 1473);
  assert.ok(ozolua.some((claim) => claim.startYear === 1481 && claim.endYear === 1485), "narrow Ozolua window lost");
  for (const claim of ozolua) assert.ok(claim !== ewuare);
  // Nothing has picked a winner.
  assert.doesNotMatch(migration.description, /\b(correct|proven|established) date\b/i);
  assert.match(migration.description, /Neither date is chosen/);
});

test("7. Alokoko/python and the Benin palace pythons are never asserted to be one tradition", () => {
  const comparison = get("okomilo-python-comparison");
  assert.equal(comparison.subcategory, OKOMILO_LANES.open);
  assert.equal(comparison.eventType, "hypothesised");
  assert.notEqual(comparison.transmissionStatus, "demonstrated");
  assert.ok(comparison.argumentsFor && comparison.argumentsAgainst);
  const between = OKOMILO_LINKS.filter((link) =>
    [link.from, link.to].some((slug) => /palace-pythons|python-comparison/.test(slug)) &&
    [link.from, link.to].some((slug) => /alokoko/.test(slug))
  );
  assert.ok(between.length > 0, "the comparison should be linked");
  for (const link of between) {
    assert.equal(link.relation, "relevant", `${link.from}→${link.to} must not claim more than relevance`);
    assert.match(link.note, /COMPARATIVE \/ UNESTABLISHED CONNECTION/);
  }
  // And Olokun stays apart from Alokoko.
  const olokun = get("okomilo-olokun-not-alokoko");
  assert.match(olokun.description, /UNRELATED/);
  for (const link of OKOMILO_LINKS) {
    if (/olokun/.test(link.from) && /alokoko/.test(link.to)) assert.notEqual(link.relation, "identified");
  }
});

test("8. Otsanobua is not asserted, because no source for it was found", () => {
  const record = get("okomilo-otsanobua-unattested");
  assert.match(record.title, /not attested/);
  assert.equal(record.evidenceStatus, "unresolved");
  for (const event of OKOMILO_EVENTS) {
    if (event.slug === record.slug) continue;
    const text = `${event.title} ${event.summary} ${event.description}`;
    for (const match of text.matchAll(/Otsanobua/g)) {
      const window = text.slice(Math.max(0, match.index! - 60), match.index! + 60);
      assert.match(window, /unattested|not attested|not found/i, `${event.slug} uses Otsanobua as if attested`);
    }
  }
});

test("9. the meaning of Okomilo remains unresolved", () => {
  const record = get("okomilo-q-meaning-of-okomilo");
  assert.match(record.summary, /MEANING UNRESOLVED/);
  assert.match(record.description, /Yoruba/);
  assert.match(record.description, /NOT relevant/);
  for (const event of OKOMILO_EVENTS) {
    assert.doesNotMatch(event.description, /Okomilo means/i, `${event.slug} asserts a meaning`);
  }
});

test("10. 'S. Okomilo' (1960) is not identified with Sam without evidence", () => {
  const record = get("okomilo-s-photographic-trainee-1960");
  assert.match(record.title, /possible identification/);
  assert.equal(record.identificationStatus, "unverified");
  assert.match(record.eventTypeNote ?? "", /UNRESOLVED IDENTITY/);
  for (const link of OKOMILO_LINKS) {
    if (link.from !== record.slug && link.to !== record.slug) continue;
    assert.notEqual(link.relation, "identified");
    assert.notEqual(link.relation, "child_of");
    assert.match(link.note, /UNRESOLVED IDENTITY|POSSIBLE/);
  }
});

test("11. source-dependent claims do not masquerade as independent confirmations", () => {
  // The 1999 book and its online reproduction are one source.
  assert.equal(sourceByKey.get("okhaishie_1999")?.citedBy, "oe_major_events");
  assert.match(sourceByKey.get("oe_major_events")!.notes, /same source/i);
  const migration = get(ANWU_MIGRATION_SLUG);
  const narrow = migration.claims.find((claim) => claim.startYear === 1481 && claim.endYear === 1485)!;
  const reproduction = narrow.citations?.find((citation) => citation.sourceKey === "oe_major_events");
  assert.ok(reproduction, "the reproduction should be cited on the claim it reproduces");
  assert.match(reproduction.note, /SAME source/);
  const broad = migration.claims.find((claim) => claim.sourceKey === "fugar_america")!;
  assert.match(broad.evidence, /DEPENDENT/);
  // And the chain is traced as a chain.
  const chain = migration.genealogies?.find((genealogy) => genealogy.key === "ozolua-1481-85");
  assert.ok(chain, "the Ozolua dating should have its source genealogy");
  assert.deepEqual(
    chain.links.map((link) => link.sourceKey ?? null),
    [null, "okhaishie_1999", "oe_major_events", "oe_clan_split", "fugar_america"]
  );
  assert.match(chain.links[2].adds ?? "", /Nothing/);
});

test("12. unknown generations remain explicitly unknown", () => {
  const father = get("okomilo-sam-father-unknown");
  assert.match(father.title, /not yet identified/);
  assert.deepEqual(father.people, ["Sam Okomilo's father (name unknown)"]);
  const gap = get(GENEALOGY_BREAK_SLUG);
  assert.ok(gap.tags.includes(GENEALOGY_LAYER_TAGS.unknown));
  assert.match(gap.description, /UNKNOWN GENERATIONS/);
  // Sam's father has no parent edge: his parents are not known.
  assert.ok(!OKOMILO_LINKS.some((link) => link.from === father.slug && link.relation === "child_of"));
  // No family founder or founding date is invented.
  const family = get("okomilo-family-of-innih");
  assert.ok(family.claims.every((claim) => claim.whatIsDated?.includes("not the family's founding") || claim.startYear == null));
});

// ---------------------------------------------------------------------------
// The second research pass (2 Oct 2026): findings that must not be undone
// ---------------------------------------------------------------------------

test("the 1983 burial of Sam's father is corroborated from OUTSIDE the family, and still unnamed", () => {
  const father = get("okomilo-sam-father-unknown");
  const independent = father.claims.find((claim) => claim.sourceKey === "oe_enegwea_bio");
  assert.ok(independent, "the Enegwea biography's 1983 burial should be a claim");
  assert.equal(independent.startYear, 1983);
  assert.match(independent.evidence, /INDEPENDENT/);
  assert.match(father.title, /not yet identified/);
});

test("Sam's maternal grandfather is identified only because a named source joins them", () => {
  const grandfather = get("okomilo-pa-asekomhe-maternal-grandfather");
  assert.equal(grandfather.identificationStatus, "probable");
  const edge = OKOMILO_LINKS.find((link) => link.from === grandfather.slug && link.to === "okomilo-asekomhe-dynasty-genealogy");
  assert.equal(edge?.sourceKey, "oe_asekomhe_dynasty");
  assert.match(sourceByKey.get("oe_asekomhe_dynasty")!.notes, /mother of Samuel Okomilo/);
  assert.equal(sourceByKey.get("oe_asekomhe_dynasty")!.sourceType, "oral_tradition");
});

test("both Okhe-dispute dates are kept, and both are traced to the one article that gives them", () => {
  const dispute = get("okomilo-okhe-dispute-ogbhari-akenavhianwu");
  const years = dispute.claims.map((claim) => claim.startYear);
  assert.ok(years.includes(1851) && years.includes(1891), "a date has been dropped");
  for (const claim of dispute.claims.filter((c) => c.startYear === 1851 || c.startYear === 1891)) {
    assert.equal(claim.sourceKey, "oe_clan_split");
  }
});

test("the python river-crossing is a single recent claim, not a tradition the track asserts", () => {
  const crossing = get("okomilo-python-river-crossing-claim");
  assert.equal(crossing.eventType, "disputed");
  assert.equal(crossing.claims.length, 1);
  assert.equal(crossing.claims[0].startYear, 2025);
  assert.match(crossing.claims[0].whatIsDated ?? "", /not the age of the story/);
});

test("Alokoko's earliest written attestation is the one actually found, and her versions are kept apart", () => {
  const alokoko = get("okomilo-alokoko-ancestral-mother");
  const earliest = alokoko.claims.find((claim) => claim.temporalClaimType === "date_of_first_known_record");
  assert.equal(earliest?.startYear, 2017);
  for (const version of [/HUMAN MOTHER/, /ROYAL PYTHON/, /DEITY/, /A SECOND ALOKOKO, A MAN/]) {
    assert.match(alokoko.description, version);
  }
});

test("gerontocratic offices are never read as lines of descent", () => {
  const offices = get("okomilo-ancestral-offices-oldest-man");
  assert.match(offices.description, /GERONTOCRATIC/);
  assert.ok(!OKOMILO_LINKS.some((link) => link.relation === "child_of" && (link.from === offices.slug || link.to === offices.slug)));
});

test("an Okomilo found in another family's lineage is not given a parent without a stated one", () => {
  const ikpadelameka = get("okomilo-ikpadelameka-okomilo");
  assert.ok(!OKOMILO_LINKS.some((link) => link.relation === "child_of" && link.from === ikpadelameka.slug));
});
