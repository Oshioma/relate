import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { photoSchema } from "../where-to-stay/content";
import { BEACH_BARS_GUIDE, BEACH_BARS_SLUG } from "./content";
import { ADVICE, CALL_TO_ACTION, INTRODUCTION } from "./advice";
import { BEACH_BARS_SLUG as LINKED_FROM_RESTAURANTS } from "../restaurants/shared";
import { RESTAURANTS_GUIDE } from "../restaurants/content";
import { loadPlaceGuide, placeGuideCardImage, placePhotoCount } from "../place-guide/content";
import { placeGuideFor } from "../place-guide/registry";
import { hotelGuideFor } from "../hotel-guide/registry";
import { editorialGuideEntry } from "../registry";

const B = BEACH_BARS_GUIDE.places;
const keys = new Set(B.map((p) => p.key));

test("the guide has 21 bars with unique keys, island-wide", () => {
  assert.equal(B.length, 21);
  assert.equal(keys.size, 21);
  for (const k of ["kajibange", "kendwa-rocks", "kae-funk", "z-rooftops", "livingstones", "b4-beach-club"]) assert.ok(keys.has(k), k);
  for (const area of ["Stone Town", "Nungwi", "Kendwa", "Matemwe", "Kiwengwa", "Michamvi", "Paje", "Jambiani"]) {
    assert.ok(B.some((p) => p.area.includes(area)), area);
  }
  assert.ok(B.every((p) => p.kind === "bar"));
});

test("every bar has every section, a price band and its key facts, including entry", () => {
  for (const p of B) {
    assert.ok(p.description.join(" ").length > 150, `${p.key}: description too short`);
    for (const [name, value] of Object.entries({ whyGo: p.whyGo, bestTime: p.bestTime, howToVisit: p.howToVisit, whatToDrink: p.photoTips, tagline: p.tagline })) {
      assert.ok(value && value.length > 10, `${p.key}: thin or missing ${name}`);
    }
    assert.ok(p.price, `${p.key}: no price band`);
    assert.ok(p.facts?.some((f) => f.label === "Entry"), `${p.key}: no entry fact`);
    assert.ok(p.considerations.length > 0 && p.bestFor.length > 0, p.key);
  }
});

test("Kajibange: fresh juices with no added sugar, its directory listing, and nothing said against its food", () => {
  const k = B.find((p) => p.key === "kajibange")!;
  assert.match([...k.description, k.photoTips].join(" "), /fresh juices?[^.]*no added sugar/i);
  assert.deepEqual(k.listing, { kind: "business", slug: "kajibange" });
  assert.doesNotMatch([...k.description, k.whyGo, ...k.considerations].join(" "), /\b(food|meal|dish)\w*\b[^.]*\b(bad|poor|average|mixed|disappoint|bland|overpriced)/i);
});

test("bars in both guides link to each other, both ways", () => {
  const guides = [BEACH_BARS_GUIDE, RESTAURANTS_GUIDE];
  const links = guides.flatMap((g) => g.places.flatMap((p) => (p.seeAlso ?? []).map((s) => ({ from: `${g.slug}#${p.key}`, ...s }))));
  assert.ok(links.length >= 8, `only ${links.length} cross-links`);
  for (const l of links) {
    const target = placeGuideFor(l.guideSlug);
    assert.ok(target, `${l.from} → unknown guide ${l.guideSlug}`);
    assert.ok(target.places.some((p) => p.key === l.placeKey), `${l.from} → ${l.guideSlug}#${l.placeKey}`);
  }
  assert.equal(LINKED_FROM_RESTAURANTS, BEACH_BARS_SLUG);
  for (const key of ["kajibange", "kae-funk", "mr-kahawa"]) {
    assert.ok(links.some((l) => l.from === `${BEACH_BARS_SLUG}#${key}`), `${key} doesn't link to the restaurant guide`);
    assert.ok(links.some((l) => l.from.endsWith(`#${key}`) && l.guideSlug === BEACH_BARS_SLUG), `${key} isn't linked back`);
  }
});

test("photos are valid, on disk at both sizes, credited and linked to a source", () => {
  let count = 0;
  for (const p of B) {
    assert.ok(p.photos.length >= 3, `${p.key}: only ${p.photos.length} photos`);
    assert.equal(new Set(p.photos.map((x) => x.src)).size, p.photos.length, `${p.key}: repeats a photo`);
    for (const photo of p.photos) {
      count++;
      assert.ok(photoSchema.safeParse(photo).success, photo.src);
      const m = /^\/guides\/beach-bars\/(.+)-1280\.webp$/.exec(photo.src);
      assert.ok(m, photo.src);
      for (const size of [640, 1280]) assert.ok(existsSync(join("public", "guides", "beach-bars", `${m[1]}-${size}.webp`)), `${m[1]}-${size}.webp is missing`);
      assert.ok(photo.credit && photo.licence && /^https:\/\//.test(photo.sourceUrl), photo.src);
      if (photo.identificationStatus === "unverified") assert.match(photo.caption, /^UNVERIFIED —/, photo.src);
    }
  }
  assert.ok(count >= 100, `found ${count} photos`);
});

test("categories, bar crawls and the photo row only point at bars in the guide", () => {
  for (const c of BEACH_BARS_GUIDE.categories) for (const k of c.hotelKeys) assert.ok(keys.has(k), `${c.id} → ${k}`);
  for (const r of BEACH_BARS_GUIDE.routes.items) for (const s of r.stops) assert.ok(keys.has(s.placeKey), `${r.id} → ${s.placeKey}`);
  for (const m of BEACH_BARS_GUIDE.mosaic) {
    const place = B.find((p) => p.key === m.placeKey);
    assert.ok(place && place.photos[m.photo ?? 0], `mosaic → ${m.placeKey}`);
  }
});

const allCopy = [
  ...INTRODUCTION,
  ...CALL_TO_ACTION.paragraphs,
  ...ADVICE.flatMap((b) => b.paragraphs),
  ...BEACH_BARS_GUIDE.routes.items.flatMap((r) => [r.summary, ...r.stops.map((s) => s.note)]),
  ...B.flatMap((p) => [...p.description, p.whyGo, p.bestTime, p.howToVisit, p.photoTips, ...p.considerations, ...(p.facts ?? []).map((f) => f.value), ...p.photos.map((x) => x.caption)]),
].join("\n");

test("no prices or entry fees anywhere in the copy", () => {
  assert.doesNotMatch(allCopy, /(US\$|\$\s?\d|€\s?\d|£\s?\d|\d+\s?(USD|EUR|GBP|TZS|TSh|shillings?))/i);
});

test("the editors never claim to have been there", () => {
  assert.doesNotMatch(allCopy, /\b(we|our editors?|mzungu zanzibar)\b[^.]{0,30}\b(drank|tried|tasted|visited|partied|ordered|loved)\b/i);
  assert.doesNotMatch(allCopy, /\b(our|my) (night|visit|evening|drink)\b/i);
});

test("the guide is registered, separate from the hotel guides", () => {
  assert.equal(placeGuideFor(BEACH_BARS_SLUG), BEACH_BARS_GUIDE);
  assert.equal(hotelGuideFor(BEACH_BARS_SLUG), null);
  assert.equal(editorialGuideEntry(BEACH_BARS_SLUG)?.hero({})?.src, BEACH_BARS_GUIDE.heroPhoto.src);
  assert.equal(placeGuideCardImage(BEACH_BARS_GUIDE, {}), BEACH_BARS_GUIDE.heroPhoto.src);
  assert.ok(placePhotoCount(loadPlaceGuide(BEACH_BARS_GUIDE, {})) >= 100);
});
