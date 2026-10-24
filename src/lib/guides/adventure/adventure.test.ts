import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { photoSchema } from "../where-to-stay/content";
import { ADVENTURE_GUIDE, ADVENTURE_SLUG } from "./content";
import { ADVICE, CALL_TO_ACTION, INTRODUCTION } from "./advice";
import { loadPlaceGuide, placeGuideCardImage, placePhotoCount } from "../place-guide/content";
import { placeGuideFor } from "../place-guide/registry";
import { hotelGuideFor } from "../hotel-guide/registry";
import { editorialGuideEntry } from "../registry";

const A = ADVENTURE_GUIDE.places;
const keys = new Set(A.map((p) => p.key));

// The community directory's activity listings when the guide was written,
// plus those the guide_adventures_in_directory migration adds. A directory
// link must name one of these, or it silently stops matching.
const EXISTING_SLUGS = new Set(["skydive-zanzibar", "zanzibar-horse-club", "zanzibar-watersports", "nungwi-mnarani-aquarium", "splash-paradise"]);
const SEEDED = readFileSync(join("supabase", "migrations", "20261024094007_guide_adventures_in_directory.sql"), "utf8");

test("the guide covers 30 adventures, skydiving first", () => {
  assert.equal(A.length, 30);
  assert.equal(keys.size, 30);
  assert.equal(A[0].key, "skydiving");
  for (const k of ["mnemba-diving", "mnemba-snorkelling", "tumbatu-snorkelling", "catamaran-kendwa", "horse-riding", "paje-kitesurfing", "quad-biking", "kuza-cave"]) assert.ok(keys.has(k), k);
  assert.ok(A.every((p) => p.kind === "activity"));
});

test("every adventure has every section, a price band and who it suits", () => {
  for (const p of A) {
    assert.ok(p.description.join(" ").length > 150 || p.key === "nungwi-sea-walk", `${p.key}: description too short`);
    for (const [name, value] of Object.entries({ whyGo: p.whyGo, bestTime: p.bestTime, howToVisit: p.howToVisit, safety: p.photoTips, tagline: p.tagline })) {
      assert.ok(value && value.length > 10, `${p.key}: thin or missing ${name}`);
    }
    assert.ok(p.price, `${p.key}: no price band`);
    assert.ok(p.facts?.some((f) => f.label === "Who it suits"), `${p.key}: no "Who it suits"`);
    assert.ok(p.considerations.length > 0 && p.bestFor.length > 0, p.key);
  }
});

test("the wildlife entries say plainly what's wrong with them", () => {
  const dolphins = A.find((p) => p.key === "kizimkazi-dolphins")!;
  assert.match(dolphins.description.join(" "), /chasing/);
  assert.equal(dolphins.website, null, "no dolphin operator is endorsed");
  const turtles = A.find((p) => p.key === "nungwi-turtles")!;
  assert.match(turtles.tagline, /captive, not wild/);
});

test("every adventure links to a directory listing, existing or seeded, so all show on the Activities page", () => {
  for (const p of A) {
    assert.equal(p.listing?.kind, "business", `${p.key} has no directory listing`);
    const slug = p.listing!.slug;
    assert.ok(EXISTING_SLUGS.has(slug) || SEEDED.includes(`('${slug}', `), `${p.key} → ${slug} is neither listed nor seeded`);
  }
  assert.equal(ADVENTURE_GUIDE.directorySection?.category, "activity");
});

test("Zanzibar Watersports' catamarans and Tumbatu snorkelling have their own entries and listings", () => {
  for (const key of ["catamaran-kendwa", "tumbatu-snorkelling"]) {
    const p = A.find((x) => x.key === key)!;
    assert.match(p.name, /Zanzibar Watersports/);
    assert.match(p.website ?? "", /zanzibarwatersports\.com/);
    assert.ok(SEEDED.includes(`('${key}', `));
  }
});

test("photos are valid, on disk at both sizes, credited and linked to a source", () => {
  let count = 0;
  for (const p of A) {
    assert.ok(p.photos.length >= 1, `${p.key}: no photos`);
    assert.equal(new Set(p.photos.map((x) => x.src)).size, p.photos.length, `${p.key}: repeats a photo`);
    for (const photo of p.photos) {
      count++;
      assert.ok(photoSchema.safeParse(photo).success, photo.src);
      const m = /^\/guides\/adventure\/(.+)-1280\.webp$/.exec(photo.src);
      assert.ok(m, photo.src);
      for (const size of [640, 1280]) assert.ok(existsSync(join("public", "guides", "adventure", `${m[1]}-${size}.webp`)), `${m[1]}-${size}.webp is missing`);
      assert.ok(photo.credit && photo.licence && /^https:\/\//.test(photo.sourceUrl), photo.src);
      if (photo.identificationStatus === "unverified") assert.match(photo.caption, /^UNVERIFIED —/, photo.src);
    }
  }
  assert.ok(count >= 150, `found ${count} photos`);
});

test("categories and adventure days only point at adventures in the guide", () => {
  for (const c of ADVENTURE_GUIDE.categories) for (const k of c.hotelKeys) assert.ok(keys.has(k), `${c.id} → ${k}`);
  for (const r of ADVENTURE_GUIDE.routes.items) for (const s of r.stops) assert.ok(keys.has(s.placeKey), `${r.id} → ${s.placeKey}`);
});

const allCopy = [
  ...INTRODUCTION,
  ...CALL_TO_ACTION.paragraphs,
  ...ADVICE.flatMap((b) => b.paragraphs),
  ...ADVENTURE_GUIDE.routes.items.flatMap((r) => [r.summary, ...r.stops.map((s) => s.note)]),
  ...A.flatMap((p) => [...p.description, p.whyGo, p.bestTime, p.howToVisit, p.photoTips, ...p.considerations, ...(p.facts ?? []).map((f) => f.value), ...p.photos.map((x) => x.caption)]),
].join("\n");

test("no prices or fees anywhere in the copy", () => {
  assert.doesNotMatch(allCopy, /(US\$|\$\s?\d|€\s?\d|£\s?\d|\d+\s?(USD|EUR|GBP|TZS|TSh|shillings?))/i);
});

test("the editors never claim to have done it", () => {
  assert.doesNotMatch(allCopy, /\b(we|our editors?|mzungu zanzibar)\b[^.]{0,30}\b(dived|jumped|rode|tried|visited|surfed|loved|did)\b/i);
  assert.doesNotMatch(allCopy, /\b(our|my) (dive|jump|ride|lesson|trip)\b/i);
});

test("the guide is registered, separate from the hotel guides", () => {
  assert.equal(placeGuideFor(ADVENTURE_SLUG), ADVENTURE_GUIDE);
  assert.equal(hotelGuideFor(ADVENTURE_SLUG), null);
  assert.equal(editorialGuideEntry(ADVENTURE_SLUG)?.hero({})?.src, ADVENTURE_GUIDE.heroPhoto.src);
  assert.equal(placeGuideCardImage(ADVENTURE_GUIDE, {}), ADVENTURE_GUIDE.heroPhoto.src);
  assert.ok(placePhotoCount(loadPlaceGuide(ADVENTURE_GUIDE, {})) >= 150);
});
