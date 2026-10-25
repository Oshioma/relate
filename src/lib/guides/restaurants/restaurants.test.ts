import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { photoSchema } from "../where-to-stay/content";
import { RESTAURANTS_GUIDE, RESTAURANTS_SLUG } from "./content";
import { BEACH_BARS_GUIDE } from "../beach-bars/content";
import { RESTAURANTS as WHERE_TO_STAY_RESTAURANTS } from "../where-to-stay/restaurants";
import { ADVICE, CALL_TO_ACTION, INTRODUCTION } from "./advice";
import { loadPlaceGuide, placeGuideCardImage, placePhotoCount } from "../place-guide/content";
import { placeGuideFor } from "../place-guide/registry";
import { hotelGuideFor } from "../hotel-guide/registry";
import { editorialGuideEntry } from "../registry";

const R = RESTAURANTS_GUIDE.places;
const keys = new Set(R.map((p) => p.key));

// The community directory's restaurant slugs when the guide was written
// (businesses with category "restaurant" in mzunguzanzibar). A directory link
// must name one of these, or it silently stops matching.
const DIRECTORY_SLUGS = new Set([
  "6-degrees-south",
  "cape-town-fish-market",
  "fahari-off-the-grid",
  "fisherman-s-seafood-grill",
  "furaha-beach-rooms",
  "hanoi-house-nungwi",
  "harbour-kitchen",
  "kajibange",
  "makofi",
  "organzibar",
  "passion-thyme",
  "passion-thyme-2",
  "pizza-gourmet-by-makofi-zanzibar",
  "poazz-grill-n-restaurant",
  "pompetti-restaurant",
  "sunbird-seafood-cafe",
  "sunset-kendwa-hotel",
  "the-fifth",
  // Listed under Activities, but it is the Kendwa Rocks the bars guide means.
  "kendwa-rocks-beach-hotel",
  // Every place to eat the guides pick that wasn't listed yet, added by the
  // guide_places_to_eat_in_directory migration (one values row per place).
  ...readFileSync(join(process.cwd(), "supabase/migrations/20261024004101_guide_places_to_eat_in_directory.sql"), "utf8")
    .matchAll(/^  \('([a-z0-9-]+)', /gm)
    .map((m) => m[1]),
]);

test("the guide has 21 restaurants with unique keys, The Rock and Forodhani among them", () => {
  assert.equal(R.length, 21);
  assert.equal(keys.size, 21);
  for (const k of ["the-rock", "forodhani-night-market", "lukmaan", "emerson-spice-tea-house"]) assert.ok(keys.has(k), k);
});

test("every restaurant has every section, a price band and its key facts", () => {
  for (const p of R) {
    assert.ok(p.description.join(" ").length > 150, `${p.key}: description too short`);
    for (const [name, value] of Object.entries({ whyGo: p.whyGo, bestTime: p.bestTime, howToVisit: p.howToVisit, whatToOrder: p.photoTips, tagline: p.tagline })) {
      assert.ok(value && value.length > 10, `${p.key}: thin or missing ${name}`);
    }
    assert.ok(p.price, `${p.key}: no price band`);
    assert.ok(p.facts && p.facts.length >= 2, `${p.key}: missing facts`);
    assert.ok(p.considerations.length > 0 && p.bestFor.length > 0, p.key);
  }
});

test("directory links point at real directory listings", () => {
  const linked = R.filter((p) => p.listing);
  assert.ok(linked.length >= 8, `only ${linked.length} restaurants link to the directory`);
  for (const p of linked) {
    assert.equal(p.listing!.kind, "business");
    assert.ok(DIRECTORY_SLUGS.has(p.listing!.slug), `${p.key} → ${p.listing!.slug}`);
  }
  assert.equal(RESTAURANTS_GUIDE.directorySection?.category, "restaurant");
});

test("every place to eat in the guides links to its directory listing", () => {
  const picks = [
    ...RESTAURANTS_GUIDE.places.map((p) => ({ name: `restaurants#${p.key}`, listing: p.listing })),
    ...BEACH_BARS_GUIDE.places.map((p) => ({ name: `beach-bars#${p.key}`, listing: p.listing })),
    ...Object.entries(WHERE_TO_STAY_RESTAURANTS).flatMap(([d, recs]) => recs.map((r) => ({ name: `where-to-stay#${d}/${r.name}`, listing: r.listing }))),
  ];
  for (const p of picks) {
    assert.ok(p.listing, `${p.name} has no directory listing`);
    // A hotel restaurant may point at its stay instead (it has the photos).
    if (p.listing.kind === "business") assert.ok(DIRECTORY_SLUGS.has(p.listing.slug), `${p.name} → ${p.listing.slug}`);
  }
});

test("Organzibar carries its disclosure", () => {
  const o = R.find((p) => p.key === "organzibar")!;
  assert.ok(o.considerations.some((c) => /connected to the people behind Mzungu Zanzibar/.test(c)));
});

test("photos are valid, on disk at both sizes, credited and linked to a source", () => {
  let count = 0;
  for (const p of R) {
    assert.ok(p.photos.length >= 2, `${p.key}: only ${p.photos.length} photos`);
    assert.equal(new Set(p.photos.map((x) => x.src)).size, p.photos.length, `${p.key}: repeats a photo`);
    for (const photo of p.photos) {
      count++;
      assert.ok(photoSchema.safeParse(photo).success, photo.src);
      const m = /^\/guides\/restaurants\/(.+)-1280\.webp$/.exec(photo.src);
      assert.ok(m, photo.src);
      for (const size of [640, 1280]) assert.ok(existsSync(join("public", "guides", "restaurants", `${m[1]}-${size}.webp`)), `${m[1]}-${size}.webp is missing`);
      assert.ok(photo.credit && photo.licence && /^https:\/\//.test(photo.sourceUrl), photo.src);
      if (photo.identificationStatus === "unverified") assert.match(photo.caption, /^UNVERIFIED —/, photo.src);
    }
  }
  assert.ok(count >= 100, `found ${count} photos`);
});

test("categories, food days and the photo row only point at restaurants in the guide", () => {
  for (const c of RESTAURANTS_GUIDE.categories) for (const k of c.hotelKeys) assert.ok(keys.has(k), `${c.id} → ${k}`);
  for (const r of RESTAURANTS_GUIDE.routes.items) for (const s of r.stops) assert.ok(keys.has(s.placeKey), `${r.id} → ${s.placeKey}`);
  for (const m of RESTAURANTS_GUIDE.mosaic) {
    const place = R.find((p) => p.key === m.placeKey);
    assert.ok(place && place.photos[m.photo ?? 0], `mosaic → ${m.placeKey}`);
  }
});

const allCopy = [
  ...INTRODUCTION,
  ...CALL_TO_ACTION.paragraphs,
  ...ADVICE.flatMap((b) => b.paragraphs),
  ...RESTAURANTS_GUIDE.routes.items.flatMap((r) => [r.summary, ...r.stops.map((s) => s.note)]),
  ...R.flatMap((p) => [...p.description, p.whyGo, p.bestTime, p.howToVisit, p.photoTips, ...p.considerations, ...(p.facts ?? []).map((f) => f.value), ...p.photos.map((x) => x.caption)]),
].join("\n");

test("no prices anywhere in the copy", () => {
  assert.doesNotMatch(allCopy, /(US\$|\$\s?\d|€\s?\d|£\s?\d|\d+\s?(USD|EUR|GBP|TZS|TSh|shillings?))/i);
});

test("the editors never claim to have eaten there", () => {
  assert.doesNotMatch(allCopy, /\b(we|our editors?|mzungu zanzibar)\b[^.]{0,30}\b(ate|tried|tasted|visited|dined|ordered|loved)\b/i);
  assert.doesNotMatch(allCopy, /\b(our|my) (meal|visit|dinner|lunch)\b/i);
});

test("the guide is registered, separate from the hotel guides", () => {
  assert.equal(placeGuideFor(RESTAURANTS_SLUG), RESTAURANTS_GUIDE);
  assert.equal(hotelGuideFor(RESTAURANTS_SLUG), null);
  assert.equal(editorialGuideEntry(RESTAURANTS_SLUG)?.hero({})?.src, RESTAURANTS_GUIDE.heroPhoto.src);
  assert.equal(placeGuideCardImage(RESTAURANTS_GUIDE, {}), RESTAURANTS_GUIDE.heroPhoto.src);
  assert.ok(placePhotoCount(loadPlaceGuide(RESTAURANTS_GUIDE, {})) >= 100);
});
