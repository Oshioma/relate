import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { photoSchema } from "../where-to-stay/content";
import { PICTURESQUE_GUIDE, PICTURESQUE_SLUG } from "./content";
import { ADVICE, CALL_TO_ACTION, INTRODUCTION } from "./advice";
import { loadPlaceGuide, parsePlaceOverrides, placeGuideCardImage, placePhotoCount, resolvePlaceGuide } from "../place-guide/content";
import { placeGuideFor } from "../place-guide/registry";
import { hotelGuideFor } from "../hotel-guide/registry";
import { editorialGuideEntry } from "../registry";

const PLACES = PICTURESQUE_GUIDE.places;
const keys = new Set(PLACES.map((p) => p.key));

test("the guide has 21 places with unique keys", () => {
  assert.equal(PLACES.length, 21);
  assert.equal(keys.size, 21);
  for (const k of ["the-rock", "nakupenda", "stone-town", "kendwa", "mnemba", "jozani", "menai-bay"]) assert.ok(keys.has(k), k);
});

test("every place has every section, filled in", () => {
  for (const p of PLACES) {
    assert.ok(p.description.join(" ").length > 200, `${p.key}: description too short`);
    for (const [name, value] of Object.entries({ whyGo: p.whyGo, bestTime: p.bestTime, howToVisit: p.howToVisit, photoTips: p.photoTips, tagline: p.tagline, fromStoneTown: p.fromStoneTown })) {
      assert.ok(value && value.length > 10, `${p.key}: thin or missing ${name}`);
    }
    assert.ok(p.considerations.length > 0 && p.bestFor.length > 0, `${p.key}: missing considerations or best-for`);
    assert.ok(p.tide === null || p.tide.length > 30, `${p.key}: tide note too thin`);
  }
});

test("every place has photos: valid, on disk at both sizes, credited and linked to a source", () => {
  let count = 0;
  for (const p of PLACES) {
    assert.ok(p.photos.length >= 4, `${p.key}: only ${p.photos.length} photos`);
    assert.equal(new Set(p.photos.map((x) => x.src)).size, p.photos.length, `${p.key}: repeats a photo`);
    for (const photo of p.photos) {
      count++;
      assert.ok(photoSchema.safeParse(photo).success, photo.src);
      const m = /^\/guides\/(picturesque|boutique-hotels)\/(.+)-1280\.webp$/.exec(photo.src);
      assert.ok(m, `${photo.src} should be one of the app's own files`);
      for (const size of [640, 1280]) assert.ok(existsSync(join("public", "guides", m[1], `${m[2]}-${size}.webp`)), `${m[2]}-${size}.webp is missing`);
      assert.ok(photo.credit && photo.licence && /^https:\/\//.test(photo.sourceUrl), `${photo.src}: credit, licence and source`);
      if (photo.identificationStatus === "unverified") assert.match(photo.caption, /^UNVERIFIED —/, photo.src);
      else assert.doesNotMatch(photo.caption, /^UNVERIFIED/, photo.src);
    }
  }
  assert.ok(count >= 140, `expected the researched photos, found ${count}`);
});

test("each place leads with a different photo, and the hero is one of them", () => {
  const leads = PLACES.map((p) => p.photos[0].src);
  assert.equal(new Set(leads).size, leads.length);
  assert.ok(PLACES.some((p) => p.photos.some((x) => x.src === PICTURESQUE_GUIDE.heroPhoto.src)));
});

test("categories, routes and the photo row only point at places in the guide", () => {
  for (const c of PICTURESQUE_GUIDE.categories) for (const k of c.hotelKeys) assert.ok(keys.has(k), `${c.id} → ${k}`);
  for (const r of PICTURESQUE_GUIDE.routes.items) for (const s of r.stops) assert.ok(keys.has(s.placeKey), `${r.id} → ${s.placeKey}`);
  for (const m of PICTURESQUE_GUIDE.mosaic) {
    const place = PLACES.find((p) => p.key === m.placeKey);
    assert.ok(place && place.photos[m.photo ?? 0], `mosaic → ${m.placeKey}`);
  }
});

const allCopy = [
  ...INTRODUCTION,
  ...CALL_TO_ACTION.paragraphs,
  ...ADVICE.flatMap((b) => b.paragraphs),
  ...PICTURESQUE_GUIDE.routes.items.flatMap((r) => [r.summary, ...r.stops.map((s) => s.note)]),
  ...PLACES.flatMap((p) => [...p.description, p.whyGo, p.bestTime, p.tide ?? "", p.howToVisit, p.photoTips, ...p.considerations, ...p.photos.map((x) => x.caption)]),
].join("\n");

test("no prices or fee amounts anywhere in the copy", () => {
  assert.doesNotMatch(allCopy, /(US\$|\$\s?\d|€\s?\d|£\s?\d|\d+\s?(USD|EUR|GBP|TZS|TSh|shillings?))/i);
});

test("the editors never claim to have visited", () => {
  assert.doesNotMatch(allCopy, /\b(we|our editors?|mzungu zanzibar)\b[^.]{0,30}\b(visited|stayed|went|swam|walked|tested)\b/i);
  assert.doesNotMatch(allCopy, /\b(our|my) (visit|trip|stay)\b/i);
});

test("links are absolute; map links are searches; partial checks say what's missing", () => {
  for (const p of PLACES) {
    if (p.website) assert.match(p.website, /^https:\/\/[^/]+\.[a-z]{2,}/, p.key);
    assert.ok(p.mapsUrl.startsWith("https://www.google.com/maps/search/?api=1&query="), p.key);
    assert.ok(p.verification.sources.length > 0, `${p.key}: no sources`);
    if (p.verification.status !== "verified") assert.ok(p.verification.gaps.length > 0, `${p.key}: partial without saying what`);
  }
});

test("admin photo overrides replace a place's photos; bad or unknown entries are ignored", () => {
  const good = [{ ...PLACES[0].photos[0], src: "https://example.org/a.jpg" }];
  const parsed = parsePlaceOverrides(PICTURESQUE_GUIDE, { hotelPhotos: { kendwa: good, nope: good, paje: [{ src: "x" }] }, editorsNote: "Hello" });
  const resolved = resolvePlaceGuide(PICTURESQUE_GUIDE, parsed);
  assert.deepEqual(resolved.places.find((p) => p.key === "kendwa")!.photos, good);
  assert.deepEqual(resolved.places.find((p) => p.key === "paje")!.photos, PLACES.find((p) => p.key === "paje")!.photos);
  assert.equal(parsed.hotelPhotos?.nope, undefined);
  assert.equal(resolved.editorsNote, "Hello");
  assert.deepEqual(parsePlaceOverrides(PICTURESQUE_GUIDE, "garbage"), {});
});

test("the guide is registered for the page, index, feed and Guides space — and isn't mistaken for a hotel guide", () => {
  assert.equal(placeGuideFor(PICTURESQUE_SLUG), PICTURESQUE_GUIDE);
  assert.equal(hotelGuideFor(PICTURESQUE_SLUG), null);
  const entry = editorialGuideEntry(PICTURESQUE_SLUG);
  assert.ok(entry);
  assert.equal(entry.hero({})?.src, PICTURESQUE_GUIDE.heroPhoto.src);
  assert.equal(placeGuideCardImage(PICTURESQUE_GUIDE, {}), PICTURESQUE_GUIDE.heroPhoto.src);
  assert.ok(placePhotoCount(loadPlaceGuide(PICTURESQUE_GUIDE, {})) >= 140);
});
