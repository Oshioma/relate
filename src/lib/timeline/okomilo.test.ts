import { test } from "node:test";
import assert from "node:assert/strict";

import {
  OKOMILO_ANCHOR_SLUG,
  OKOMILO_EVENTS,
  OKOMILO_LINKS,
  OKOMILO_SOURCES,
} from "./okomilo-lineage-seed";
import { BENIN_DAHOMEY_EVENTS } from "./benin-dahomey-seed";
import { temporalTypeIsPositioned } from "./taxonomy";

const bySlug = new Map(OKOMILO_EVENTS.map((event) => [event.slug, event]));
const record = (slug: string) => {
  const found = bySlug.get(slug);
  assert.ok(found, `missing record: ${slug}`);
  return found;
};

// ---------------------------------------------------------------------------
// THE RULE THE WHOLE DATASET EXISTS TO ENFORCE
//
// A genealogy is the easiest kind of record to fake, because a tree with no
// gaps LOOKS more finished than one with gaps and there is no external check on
// it. These tests guard the gap.
// ---------------------------------------------------------------------------

test("the anchor is the question, and it answers it with a break rather than a line", () => {
  const anchor = record(OKOMILO_ANCHOR_SLUG);
  assert.match(anchor.description, /KNOWN/);
  assert.match(anchor.description, /UNKNOWN/);
  assert.match(anchor.description, /TRADITION/);
  // And the founding of the family is explicitly unresolved.
  const founder = anchor.claims.find((c) => /founded/i.test(c.whatIsDated ?? ""));
  assert.ok(founder, "the founding of the family must be its own claim");
  assert.equal(temporalTypeIsPositioned(founder.temporalClaimType), false);
  assert.equal(founder.startYear, undefined);
});

test("the gap between the family and the clan is recorded and never filled", () => {
  const gap = record("okomilo-the-break");
  assert.equal(gap.evidenceStatus, "unresolved");
  const claim = gap.claims[0];
  assert.equal(temporalTypeIsPositioned(claim.temporalClaimType), false);
  assert.match(claim.originalDateText, /Unknown/i);

  // NOTHING ANYWHERE IN THE DATASET NAMES A PERSON IN THE GAP. The people
  // arrays are the place an invented ancestor would appear, so they are the
  // place to check: every named person must be either one of the documented
  // moderns, one of the traditional founders, or an outsider (a scholar, an
  // Oba, a colonial officer).
  const documented = new Set([
    "Sam Ikhenemho Okomilo",
    "Veronica Okomilo",
    "Uwomha Ikhuenena",
    "Pa Asekomhe",
    "John Oshiomhogho Ogedegbe",
  ]);
  const traditional = new Set([
    "Anwu",
    "Alokoko",
    "Uralokhor",
    "Unone",
    "Arua",
    "Imhakhena",
    "Okhua",
    "Omierele",
    "Ochie",
    "Orevhor",
    "Udokhakor",
    "Okhotor",
    "Anaga",
  ]);
  const outsiders = new Set([
    "Ewuare",
    "Ozolua",
    "Jacob U. Egharevba",
    "Graham Connah",
    "Patrick Darling",
    "Denton",
  ]);
  for (const event of OKOMILO_EVENTS) {
    for (const person of event.people ?? []) {
      assert.ok(
        documented.has(person) || traditional.has(person) || outsiders.has(person),
        `${event.slug}: "${person}" is named in the dataset but belongs to none of the known groups — an invented ancestor would look exactly like this`
      );
    }
  }
});

test("the paternal line really is shorter than the maternal one, and the dataset says so", () => {
  const maternal = record("uwomha-ikhuenena-and-pa-asekomhe");
  assert.match(maternal.description, /MOTHER'S line|maternal line is the stronger/i);
  const father = record("okomilo-father-and-the-war");
  // The father is attested and unnamed: that is the whole point of his record.
  assert.equal(father.people, undefined, "the father cannot be listed as a named person, because he has no name here");
  const unnamed = father.claims.find((c) => /His name/i.test(c.whatIsDated ?? ""));
  assert.ok(unnamed, "the absence of his name is itself a claim");
  assert.equal(temporalTypeIsPositioned(unnamed.temporalClaimType), false);
});

test("no military unit is assumed for the father", () => {
  const father = record("okomilo-father-and-the-war");
  // The family says Egypt; the documented RWAFF theatres were East Africa and
  // Burma. The record must hold both without resolving them into a posting.
  assert.match(father.description, /Egypt/);
  assert.match(father.description, /BURMA|EAST AFRICA/);
  assert.match(father.description, /MUST NOT BE ASSUMED|cannot be done is to pick/i);
  assert.equal(father.identificationStatus, "possible");
});

test("the two birth dates for Sam Okomilo are kept as competing claims", () => {
  const sam = record("sam-ikhenemho-okomilo");
  const stated = sam.claims.find((c) => /as the biography states it/i.test(c.whatIsDated ?? ""));
  const implied = sam.claims.find((c) => /as implied by the story of his naming/i.test(c.whatIsDated ?? ""));
  assert.ok(stated && implied, "both readings are recorded");
  assert.ok((implied.startYear ?? 0) > (stated.startYear ?? 0), "the naming story points later than the stated decade");
  assert.equal(implied.chronology, "disputed");
});

test("a name match is never promoted to an identification", () => {
  const match = record("asekomhe-a-name-match-is-not-a-fact");
  assert.equal(match.eventType, "disputed");
  assert.equal(match.identificationStatus, "possible");
  assert.match(match.description, /NOT EVIDENCE OF IDENTITY|not evidence/i);
  assert.equal(temporalTypeIsPositioned(match.claims[0].temporalClaimType), false);
});

test("the meaning of Okomilo is left unresolved, and the wrong-language reading is refused", () => {
  const meaning = record("okomilo-meaning-unresolved");
  assert.match(meaning.description, /MEANING CURRENTLY UNRESOLVED/);
  assert.match(meaning.description, /AFIA/, "the Etsako word for farmer is the evidence against the Yoruba reading");
  assert.match(meaning.description, /MUST NOT BE ASSUMED/);
  assert.equal(meaning.evidenceStatus, "unresolved");
});

test("both migration dates survive, and the source-dependency problem is recorded", () => {
  const ewuare = record("migration-claim-ewuare");
  const ozolua = record("migration-claim-ozolua");
  assert.ok((ewuare.claims[0].startYear ?? 0) < (ozolua.claims[0].startYear ?? 0));
  // Neither is presented as settled.
  for (const migration of [ewuare, ozolua]) {
    assert.equal(migration.identificationStatus, "disputed");
    assert.equal(migration.claims[0].chronology, "oral_tradition");
  }
  const dependency = record("migration-source-dependency");
  assert.match(dependency.description, /ONE underlying source|one publisher/i);
  assert.equal(temporalTypeIsPositioned(dependency.claims[0].temporalClaimType), false);
});

test("the python comparison lists its possible conclusions and chooses none", () => {
  const comparison = record("benin-python-versus-alokoko");
  assert.equal(comparison.eventType, "disputed");
  for (const letter of ["(A)", "(B)", "(C)", "(D)", "(E)"]) {
    assert.ok(comparison.description.includes(letter), `the ${letter} reading must be listed`);
  }
  // And the Olokun/Alokoko name resemblance is explicitly refused as evidence.
  assert.match(comparison.description, /NOT treated as evidence|REFUSES TO BUILD ON/i);
  assert.equal(temporalTypeIsPositioned(comparison.claims[0].temporalClaimType), false);
});

test("Alokoko's ambiguity is preserved rather than tidied away", () => {
  const ambiguity = record("who-or-what-is-alokoko");
  assert.equal(ambiguity.identificationStatus, "disputed");
  // All three readings must be present, and none preferred.
  assert.match(ambiguity.description, /TRANSMISSION SLIP/);
  assert.match(ambiguity.description, /THE PET WAS THE PYTHON/);
  assert.match(ambiguity.description, /THE MOTHER AND THE PYTHON ARE ONE/);
  assert.match(ambiguity.description, /DOES NOT CHOOSE/i);
});

test("the leopard comparison is declined rather than manufactured", () => {
  const leopard = record("leopard-and-the-limits-of-comparison");
  assert.equal(leopard.evidenceStatus, "unresolved");
  assert.match(leopard.description, /comparison needs two terms|not made/i);
});

test("the two Benins are kept strictly apart", () => {
  const naming = record("the-kingdom-of-benin-is-not-the-republic");
  assert.match(naming.description, /Nigeria/i);
  assert.match(naming.description, /Dahomey/i);

  // And no record in this dataset files itself under a bare "Benin", which
  // would be the exact ambiguity the record warns about.
  for (const event of OKOMILO_EVENTS) {
    for (const name of event.civilisations ?? []) {
      assert.notEqual(name, "Benin", `${event.slug} uses the ambiguous civilisation name "Benin"`);
    }
  }

  // Nor does it borrow anything from the Dahomey dataset by slug.
  const dahomeySlugs = new Set(BENIN_DAHOMEY_EVENTS.map((e) => e.slug));
  for (const event of OKOMILO_EVENTS) {
    assert.ok(!dahomeySlugs.has(event.slug), `${event.slug} collides with the Dahomey dataset`);
  }
});

test("the Egypt claim is recorded as a dated publication, not as an origin", () => {
  const egypt = record("the-egypt-claim");
  assert.equal(egypt.eventType, "disputed");
  const publication = egypt.claims.find((c) => /publication/i.test(c.whatIsDated ?? ""));
  assert.ok(publication);
  assert.equal(publication.startYear, 1934);
  assert.equal(publication.temporalClaimType, "date_of_first_known_record");
  // The eighth-century figure is filed as an alternative viewpoint, never as archaeology.
  const eighth = egypt.claims.find((c) => (c.startYear ?? 0) > 600 && (c.startYear ?? 0) < 900);
  assert.ok(eighth);
  assert.equal(eighth.chronology, "alternative");
  // And nothing connects this family to Egypt.
  assert.match(egypt.description, /NOTHING IN THIS DATASET CONNECTS THE OKOMILO FAMILY TO EGYPT/);
});

test("the eldership hypothesis is answered, not repeated", () => {
  const odion = record("odion-is-gerontocracy-not-descent");
  assert.match(odion.description, /gerontocrat/i);
  assert.match(odion.description, /DOES NOT FOLLOW A LINE|hops from branch/i);
  // And the redirect to the family shrine is present, because a negative
  // finding that offers no alternative is half an answer.
  assert.match(odion.description, /ELDEST SON/);
});

test("every claim names a source that exists, and every link joins real records", () => {
  const keys = new Set(OKOMILO_SOURCES.map((source) => source.key));
  for (const event of OKOMILO_EVENTS) {
    for (const claim of event.claims) {
      if (!claim.sourceKey) continue;
      assert.ok(keys.has(claim.sourceKey), `${event.slug}: unknown source ${claim.sourceKey}`);
    }
  }
  const slugs = new Set(OKOMILO_EVENTS.map((e) => e.slug));
  for (const link of OKOMILO_LINKS) {
    assert.ok(slugs.has(link.from), `link from unknown ${link.from}`);
    assert.ok(slugs.has(link.to), `link to unknown ${link.to}`);
    if (link.sourceKey) assert.ok(keys.has(link.sourceKey), `link source ${link.sourceKey}`);
  }
});

test("no claim is positioned unless its temporal type says it may be", () => {
  for (const event of OKOMILO_EVENTS) {
    for (const claim of event.claims) {
      const positioned = temporalTypeIsPositioned(claim.temporalClaimType);
      if (positioned) {
        assert.notEqual(claim.startYear, undefined, `${event.slug}: "${claim.originalDateText}" has no year`);
      } else {
        assert.equal(claim.startYear, undefined, `${event.slug}: "${claim.originalDateText}" should carry no year`);
      }
    }
  }
});

test("the dataset is honest that it rests on one publisher", () => {
  const dependency = record("one-website-is-not-five-sources");
  assert.match(dependency.description, /ALL OF IT COMES FROM/);
  assert.match(dependency.description, /cannot do|Corroborate itself/i);
  // And the research agenda exists, with named targets rather than a plea for
  // more research.
  const agenda = record("what-would-move-this-backwards");
  for (const gap of ["GAP 1", "GAP 2", "GAP 3", "GAP 4", "GAP 5", "GAP 6"]) {
    assert.ok(agenda.description.includes(gap), `${gap} must be listed`);
  }
  assert.match(agenda.description, /NAMED, LOCATABLE THING/);
});

test("no quotation is attributed to the book that could not be read", () => {
  // The Descent of Avhianwu is cited as existing and as the top lead. If a
  // quotation from it ever appears here, it was invented.
  const book = OKOMILO_SOURCES.find((source) => source.key === "descent_of_avhianwu_1999");
  assert.ok(book);
  assert.match(book.notes, /NOTHING FROM ITS CONTENTS IS QUOTED/);
  for (const event of OKOMILO_EVENTS) {
    const text = `${event.summary}\n${event.description}`;
    for (const match of text.matchAll(/Descent of Avhianwu/gi)) {
      const window = text.slice(match.index, match.index + 400);
      assert.doesNotMatch(window, /[""]/, `${event.slug} appears to quote a book nobody here could open`);
    }
  }
});
