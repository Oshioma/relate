import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { photoSchema } from "../where-to-stay/content";
import { GETTING_AROUND_GUIDE, GETTING_AROUND_SLUG } from "./content";
import { ADVICE, CALL_TO_ACTION, INTRODUCTION } from "./advice";
import { loadPlaceGuide, placeGuideCardImage, placePhotoCount } from "../place-guide/content";
import { placeGuideFor } from "../place-guide/registry";
import { hotelGuideFor } from "../hotel-guide/registry";
import { editorialGuideEntry } from "../registry";

const W = GETTING_AROUND_GUIDE.places;
const keys = new Set(W.map((p) => p.key));
const MIGRATION = readFileSync(join("supabase", "migrations", "20261024164413_getting_around_editorial_guide.sql"), "utf8");

test("the guide covers sixteen ways around, from the airport to the boats", () => {
  assert.equal(W.length, 16);
  assert.equal(keys.size, 16);
  for (const k of ["airport", "zanzibus", "taxis", "ride-hailing", "dala-dala", "bajaji", "boda-boda", "car-hire", "scooter-hire", "cycling", "walking", "ferry-dar", "stone-town-port", "ferry-pemba", "flights", "boats"]) assert.ok(keys.has(k), k);
  assert.ok(W.every((p) => p.kind === "transport"));
});

test("every entry has every section, a price band and its practicalities", () => {
  for (const p of W) {
    assert.ok(p.description.join(" ").length > 150, `${p.key}: description too short`);
    for (const [name, value] of Object.entries({ whyGo: p.whyGo, bestTime: p.bestTime, howToVisit: p.howToVisit, safety: p.photoTips, tagline: p.tagline })) {
      assert.ok(value && value.length > 10, `${p.key}: thin or missing ${name}`);
    }
    assert.ok(p.price, `${p.key}: no price band`);
    assert.ok(p.facts && p.facts.length > 0, `${p.key}: no facts`);
    assert.ok(p.considerations.length > 0 && p.bestFor.length > 0, p.key);
    assert.ok(p.verification.sources.length > 0 && p.verification.sources.every((s) => /^https:\/\//.test(s)), `${p.key}: sources`);
  }
});

test("The Zanzibus links to its own site and to a directory listing the migration seeds as a taxi", () => {
  const z = W.find((p) => p.key === "zanzibus")!;
  assert.equal(z.website, "https://www.thezanzibus.com/");
  assert.deepEqual(z.listing, { kind: "business", slug: "the-zanzibus" });
  assert.match(MIGRATION, /'the-zanzibus', 'The Zanzibus', 'taxi'/);
  // The listing's photos are this guide's own files.
  for (const m of MIGRATION.matchAll(/https:\/\/www\.mzunguzanzibar\.com\/guides\/getting-around\/([a-z-]+-\d+-1280\.webp)/g)) {
    assert.ok(existsSync(join("public", "guides", "getting-around", m[1])), m[1]);
  }
});

test("every taxi in the directory is listed live at the end of the guide", () => {
  assert.equal(GETTING_AROUND_GUIDE.directorySection?.category, "taxi");
  assert.match(MIGRATION, /'getting-around-zanzibar', 'Pole Pole: How to Get Around Zanzibar', 'published'/);
});

test("the risky options say so", () => {
  const boda = W.find((p) => p.key === "boda-boda")!;
  assert.match(boda.tagline, /riskiest/);
  assert.match(W.find((p) => p.key === "ride-hailing")!.tagline, /Uber has left/);
  for (const k of ["car-hire", "scooter-hire"]) assert.match(W.find((p) => p.key === k)!.description.join(" "), /permit/, k);
});

test("photos are valid, on disk at both sizes, credited and linked to a source", () => {
  let count = 0;
  const seen = new Set<string>();
  for (const p of W) {
    assert.ok(p.photos.length >= 2, `${p.key}: too few photos`);
    for (const photo of p.photos) {
      count++;
      assert.ok(!seen.has(photo.src), `${photo.src} is used twice`);
      seen.add(photo.src);
      assert.ok(photoSchema.safeParse(photo).success, photo.src);
      const m = /^\/guides\/getting-around\/(.+)-1280\.webp$/.exec(photo.src);
      assert.ok(m, photo.src);
      for (const size of [640, 1280]) assert.ok(existsSync(join("public", "guides", "getting-around", `${m[1]}-${size}.webp`)), `${m[1]}-${size}.webp is missing`);
      assert.ok(photo.credit && photo.licence && /^https:\/\//.test(photo.sourceUrl), photo.src);
      if (photo.identificationStatus === "unverified") assert.match(photo.caption, /^UNVERIFIED —/, photo.src);
    }
  }
  assert.ok(count >= 70, `found ${count} photos`);
});

test("categories and sample journeys only point at entries in the guide", () => {
  for (const c of GETTING_AROUND_GUIDE.categories) for (const k of c.hotelKeys) assert.ok(keys.has(k), `${c.id} → ${k}`);
  for (const r of GETTING_AROUND_GUIDE.routes.items) for (const s of r.stops) assert.ok(keys.has(s.placeKey), `${r.id} → ${s.placeKey}`);
});

const allCopy = [
  ...INTRODUCTION,
  ...CALL_TO_ACTION.paragraphs,
  ...ADVICE.flatMap((b) => b.paragraphs),
  ...GETTING_AROUND_GUIDE.routes.items.flatMap((r) => [r.summary, ...r.stops.map((s) => s.note)]),
  ...W.flatMap((p) => [p.tagline, ...p.description, p.whyGo, p.bestTime, p.tide ?? "", p.howToVisit, p.photoTips, ...p.considerations, ...(p.facts ?? []).map((f) => f.value), ...p.photos.map((x) => x.caption)]),
].join("\n");

test("no prices or fares anywhere in the copy", () => {
  assert.doesNotMatch(allCopy, /(US\$|\$\s?\d|€\s?\d|£\s?\d|\d+\s?(USD|EUR|GBP|TZS|TSh|shillings?|dollars?|euros?))/i);
});

test("the editors never claim to have travelled it", () => {
  assert.doesNotMatch(allCopy, /\b(we|our editors?|mzungu zanzibar)\b[^.]{0,30}\b(rode|drove|sailed|flew|took|tried|caught|used|loved)\b/i);
  assert.doesNotMatch(allCopy, /\b(our|my) (ride|drive|crossing|flight|trip|journey)\b/i);
});

test("the guide is registered, separate from the hotel guides", () => {
  assert.equal(placeGuideFor(GETTING_AROUND_SLUG), GETTING_AROUND_GUIDE);
  assert.equal(hotelGuideFor(GETTING_AROUND_SLUG), null);
  assert.equal(editorialGuideEntry(GETTING_AROUND_SLUG)?.hero({})?.src, GETTING_AROUND_GUIDE.heroPhoto.src);
  assert.equal(placeGuideCardImage(GETTING_AROUND_GUIDE, {}), GETTING_AROUND_GUIDE.heroPhoto.src);
  assert.ok(placePhotoCount(loadPlaceGuide(GETTING_AROUND_GUIDE, {})) >= 70);
});
