import { test } from "node:test";
import assert from "node:assert/strict";

import { LEMURIA_EVENTS, LEMURIA_SOURCES } from "./lemuria-seed";

const bySlug = new Map(LEMURIA_EVENTS.map((event) => [event.slug, event]));
const record = (slug: string) => {
  const found = bySlug.get(slug);
  assert.ok(found, `missing Lemuria record: ${slug}`);
  return found;
};

test("Blavatsky's 18 Ma claim is not presented as the beginning of Lemuria", () => {
  const claim = record("lemuria-claimed-epoch").claims.find(
    (item) => item.sourceKey === "blavatsky_sd" && item.originalDateText === "18 millions of years ago",
  );
  assert.ok(claim);
  assert.match(claim.evidence, /physical, or approximately physical/i);
  assert.match(claim.evidence, /close of the Third Root Race/i);
  assert.match(claim.evidence, /NOT a primary-source date for the beginning of Lemuria/i);
  assert.match(claim.notes ?? "", /do not display it as 'Lemuria began 18 million years ago'/i);
});

test("34.5 Ma remains later-Theosophy until its primary genealogy is found", () => {
  const claim = record("lemuria-claimed-epoch").claims.find(
    (item) => item.originalDateText === "34½ million years ago",
  );
  assert.ok(claim);
  assert.equal(claim.sourceKey, "theosophy_wiki_rootrace");
  assert.match(claim.notes ?? "", /did not locate a primary Blavatsky passage/i);
  assert.match(claim.notes ?? "", /later-Theosophical chronology claim/i);
});

test("Besant and Leadbeater's explicit Lemurian chronology is preserved separately", () => {
  const claims = record("lemuria-claimed-epoch").claims.filter(
    (item) => item.sourceKey === "besant_leadbeater1913",
  );
  assert.equal(claims.length, 3);

  const differentiation = claims.find((item) => item.originalDateText?.includes("sixteen and a half"));
  assert.ok(differentiation);
  assert.equal(differentiation.datePrecision, "million_years");
  assert.match(differentiation.evidence, /clairvoyant/i);

  const transition = claims.find((item) => item.originalDateText?.includes("five and a half to six"));
  assert.ok(transition);
  assert.ok(transition.endYear != null, "the source's duration should remain a range");
  assert.match(transition.evidence, /timeline arithmetic/i);

  const flame = claims.find((item) => item.originalDateText?.includes("six and a half million"));
  assert.ok(flame);
  assert.match(flame.evidence, /Lords of the Flame/i);
  assert.match(flame.notes ?? "", /Do not merge this with Blavatsky/i);
});

test("the 1913 source is identified as the authors' primary text", () => {
  const source = LEMURIA_SOURCES.find((item) => item.key === "besant_leadbeater1913");
  assert.ok(source);
  assert.equal(source.sourceType, "primary");
  assert.match(source.url ?? "", /theosophy\.world/);
  assert.match(source.notes ?? "", /clairvoyant investigation/i);
});

test("Steiner still has no invented deep-time year", () => {
  const steiner = record("steiner-lemurian-epoch");
  assert.equal(steiner.claims.length, 1);
  assert.equal(steiner.claims[0].startYear, 1904);
  assert.match(steiner.claims[0].notes ?? "", /Stored deliberately as a gap/i);
});
