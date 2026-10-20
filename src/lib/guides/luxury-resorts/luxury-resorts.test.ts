import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { photoSchema } from "../where-to-stay/content";
import { FEATURED_RESORTS, MORE_RESORTS } from "./hotels";
import { LUXURY_GUIDE, LUXURY_RESORTS_SLUG } from "./content";
import { BOOKING_ADVICE, CALL_TO_ACTION, INTRODUCTION } from "./advice";
import { guideHotels, hotelGuideCardImage, loadHotelGuide, photoCount } from "../hotel-guide/content";
import { hotelGuideFor } from "../hotel-guide/registry";
import { editorialGuideEntry } from "../registry";

const ALL = guideHotels(LUXURY_GUIDE);
const keys = new Set(ALL.map((h) => h.key));

test("the guide has its 10 featured resorts and 3 shorter entries, in order", () => {
  assert.deepEqual(
    FEATURED_RESORTS.map((h) => h.key),
    ["mnemba", "zuri", "residence", "park-hyatt", "baraza", "essque-zalu", "melia", "the-mora", "gold", "riu-palace"]
  );
  assert.deepEqual(MORE_RESORTS.map((h) => h.key), ["breezes", "serena", "tulia"]);
  assert.equal(keys.size, 13, "resort keys are unique");
  assert.ok(FEATURED_RESORTS.every((h) => h.tier === "featured") && MORE_RESORTS.every((h) => h.tier === "gem"));
});

test("every featured resort has every editorial section", () => {
  for (const h of FEATURED_RESORTS) {
    for (const [name, value] of Object.entries({ whyIncluded: h.whyIncluded, whatsDifferent: h.whatsDifferent, food: h.food, beach: h.beach, nearby: h.nearby })) {
      assert.ok(value && value.length > 60, `${h.key}: thin or missing ${name}`);
    }
    assert.ok(h.description.join(" ").length > 300, `${h.key}: description too short`);
    assert.ok(h.considerations.length > 0 && h.bestFor.length > 0 && h.style && h.atmosphere && h.positioning, `${h.key}: missing basics`);
  }
  for (const h of MORE_RESORTS) assert.ok(h.description[0].length > 120 && h.food && h.beach && h.considerations.length > 0, `${h.key}: thin entry`);
});

test("area photos are Commons originals, labelled UNVERIFIED where they should be, and never claim to show the resort", () => {
  for (const h of ALL) {
    for (const p of h.areaPhotos) {
      assert.ok(photoSchema.safeParse(p).success, p.src);
      assert.ok(p.src.startsWith("https://upload.wikimedia.org/wikipedia/commons/") && p.sourceUrl.startsWith("https://commons.wikimedia.org/"), p.src);
      if (p.identificationStatus === "unverified") assert.match(p.caption, /^UNVERIFIED —/, p.src);
      assert.doesNotMatch(`${p.alt} ${p.caption}`, new RegExp(h.name.replace(/[^a-z]/gi, ".?"), "i"), `${h.key}: area photo mentions the resort`);
    }
    assert.ok(h.photos.length + h.areaPhotos.length > 0, `${h.key}: no photos at all`);
  }
});

test("resort photos are the venue's own: on disk at both sizes, credited to it and from its own site", () => {
  let count = 0;
  for (const h of ALL) {
    for (const p of h.photos) {
      count++;
      assert.ok(photoSchema.safeParse(p).success, p.src);
      const m = /^\/guides\/luxury-resorts\/(.+)-1280\.webp$/.exec(p.src);
      assert.ok(m, `${p.src} should be one of the guide's own files`);
      for (const size of [640, 1280]) assert.ok(existsSync(join("public", "guides", "luxury-resorts", `${m[1]}-${size}.webp`)), `${m[1]}-${size}.webp is missing`);
      assert.equal(p.licence, "Courtesy of the venue");
      const host = (u: string) => new URL(u).hostname.replace(/^www\./, "");
      if (h.website && !h.websiteLabel) assert.equal(host(p.sourceUrl), host(h.website), `${h.key}: photo should come from the venue's own site`);
    }
  }
  assert.ok(count >= 35, `expected the venues' photos, found ${count}`);
});

test("categories and the itinerary only point at resorts in the guide", () => {
  for (const c of LUXURY_GUIDE.categories) for (const k of c.hotelKeys) assert.ok(keys.has(k), `${c.id} → ${k}`);
  for (const leg of LUXURY_GUIDE.itinerary.legs) for (const k of leg.suggestions) assert.ok(keys.has(k), `itinerary → ${k}`);
  assert.equal(new Set(LUXURY_GUIDE.categories.map((c) => c.id)).size, LUXURY_GUIDE.categories.length);
});

const allCopy = [
  ...INTRODUCTION,
  ...CALL_TO_ACTION.paragraphs,
  ...BOOKING_ADVICE.flatMap((b) => b.paragraphs),
  LUXURY_GUIDE.itinerary.intro,
  LUXURY_GUIDE.itinerary.why?.body ?? "",
  ...LUXURY_GUIDE.itinerary.legs.map((l) => l.body),
  ...LUXURY_GUIDE.itinerary.alternatives.items,
  ...ALL.flatMap((h) => [...h.description, h.whyIncluded ?? "", h.whatsDifferent ?? "", h.food, h.beach, h.nearby ?? "", ...h.considerations, ...h.facts.map((f) => f.value)]),
].join("\n");

test("no exact prices anywhere in the copy", () => {
  assert.doesNotMatch(allCopy, /(US\$|\$\s?\d|€\s?\d|£\s?\d|\d+\s?(USD|EUR|GBP)|per night from)/i);
});

test("the editors never claim to have stayed at or inspected a resort", () => {
  assert.doesNotMatch(allCopy, /\b(we|our editors?|mzungu zanzibar)\b[^.]{0,30}\b(stayed|inspected|visited|tested|slept)\b/i);
  assert.doesNotMatch(allCopy, /\b(our|my) (stay|visit)\b/i);
});

test("websites are absolute; map links are searches; partial checks say what's missing", () => {
  for (const h of ALL) {
    if (h.website) assert.match(h.website, /^https?:\/\/[^/]+\.[a-z]{2,}/, h.key);
    assert.ok(h.mapsUrl.startsWith("https://www.google.com/maps/search/?api=1&query="), h.key);
    assert.ok(h.verification.sources.length > 0, `${h.key}: no sources`);
    if (h.verification.status !== "verified") assert.ok(h.verification.gaps.length > 0, `${h.key}: partial without saying what`);
  }
});

test("the guide is registered for the page, index, feed and Guides space, with a venue hero", () => {
  assert.equal(hotelGuideFor(LUXURY_RESORTS_SLUG), LUXURY_GUIDE);
  const entry = editorialGuideEntry(LUXURY_RESORTS_SLUG);
  assert.ok(entry);
  assert.equal(entry.hero({})?.src, LUXURY_GUIDE.heroPhoto.src);
  assert.equal(hotelGuideCardImage(LUXURY_GUIDE, {}), LUXURY_GUIDE.heroPhoto.src);
  assert.ok(photoCount(loadHotelGuide(LUXURY_GUIDE, {})) >= 40);
});
