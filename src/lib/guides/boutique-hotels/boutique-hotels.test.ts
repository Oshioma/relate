import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { photoSchema } from "../where-to-stay/content";
import type { GuidePhoto } from "../where-to-stay/types";
import { FEATURED_HOTELS, MORE_GEMS } from "./hotels";
import { BOUTIQUE_HERO_PHOTO } from "./photos";
import { ALL_HOTELS, BOUTIQUE_HOTELS_SLUG, boutiqueCardImage, parseBoutiqueOverrides, photoCount, resolveBoutiqueContent } from "./content";
import { BOOKING_ADVICE, CALL_TO_ACTION, CATEGORIES, INTRODUCTION, ITINERARY } from "./advice";
import { TRAVELLER_RECOMMENDATIONS } from "./community";
import { editorialGuideEntry } from "../registry";
import { WHERE_TO_STAY_SLUG } from "../where-to-stay/content";

const keys = new Set(ALL_HOTELS.map((h) => h.key));

const photo = (src: string, extra: Partial<GuidePhoto> = {}): GuidePhoto => ({
  src,
  alt: "A photo",
  caption: "What it shows.",
  credit: "Someone",
  licence: "CC BY 4.0",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:X.jpg",
  identificationStatus: "secure",
  ...extra,
});

test("the guide has the 12 featured hotels and 10 more gems from the brief, in order", () => {
  assert.deepEqual(
    FEATURED_HOTELS.map((h) => h.key),
    ["passion", "kilindi", "amani", "zanzibari", "xanadu", "sharazad", "the-palms", "pongwe-island", "white-sand", "qambani", "upendo", "zanzi"]
  );
  assert.deepEqual(
    MORE_GEMS.map((h) => h.key),
    ["z-hotel", "dhow-inn", "african-bungalows", "savera", "casa-paradis", "kupaga", "marafiki", "neela", "ocean-boutique", "be-zanzibar"]
  );
  assert.equal(keys.size, 22, "hotel keys are unique");
  assert.ok(FEATURED_HOTELS.every((h) => h.tier === "featured") && MORE_GEMS.every((h) => h.tier === "gem"));
});

test("every featured hotel has every editorial section the brief asks for", () => {
  for (const h of FEATURED_HOTELS) {
    for (const [name, value] of Object.entries({ whyIncluded: h.whyIncluded, whatsDifferent: h.whatsDifferent, food: h.food, beach: h.beach, nearby: h.nearby })) {
      assert.ok(value && value.length > 60, `${h.key}: thin or missing ${name}`);
    }
    assert.ok(h.description.join(" ").length > 300, `${h.key}: description too short`);
    assert.ok(h.considerations.length > 0 && h.bestFor.length > 0 && h.style && h.atmosphere && h.positioning, `${h.key}: missing basics`);
  }
  for (const h of MORE_GEMS) assert.ok(h.description[0].length > 120 && h.food && h.beach && h.considerations.length > 0, `${h.key}: thin entry`);
});

test("every Commons photo validates, is credited and licensed, and UNVERIFIED captions say so", () => {
  const all = [BOUTIQUE_HERO_PHOTO, ...ALL_HOTELS.flatMap((h) => h.areaPhotos)];
  for (const p of all) {
    assert.ok(photoSchema.safeParse(p).success, p.src);
    assert.ok(p.licence && p.credit && p.sourceUrl.startsWith("https://commons.wikimedia.org/"), `${p.src} lacks licence, credit or Commons source`);
    assert.ok(p.src.startsWith("https://upload.wikimedia.org/wikipedia/commons/") && !p.src.includes("/thumb/"), `${p.src} should be a Commons original`);
    if (p.identificationStatus === "unverified") assert.match(p.caption, /^UNVERIFIED —/, `${p.src} must say UNVERIFIED`);
    else assert.doesNotMatch(p.caption, /^UNVERIFIED/, `${p.src} is secure but captioned UNVERIFIED`);
  }
});

test("venue photos are the venue's own: on disk at both sizes, credited to it and linked to its own site", () => {
  let count = 0;
  for (const h of ALL_HOTELS) {
    for (const p of h.photos) {
      count++;
      assert.ok(photoSchema.safeParse(p).success, p.src);
      const m = /^\/guides\/boutique-hotels\/(.+)-1280\.webp$/.exec(p.src);
      assert.ok(m, `${p.src} should be one of the guide's own files`);
      for (const size of [640, 1280]) assert.ok(existsSync(join("public", "guides", "boutique-hotels", `${m[1]}-${size}.webp`)), `${m[1]}-${size}.webp is missing`);
      assert.equal(p.licence, "Courtesy of the venue");
      assert.equal(p.identificationStatus, "secure");
      const venueWord = h.name.replace(/^The /, "").split(/[\s–-]+/)[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      assert.match(p.credit.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), new RegExp(venueWord, "i"), `${h.key}: credit should name the venue`);
      if (h.website && !h.websiteLabel) {
        const host = (u: string) => new URL(u).hostname.replace(/^www\./, "");
        assert.equal(host(p.sourceUrl), host(h.website), `${h.key}: photo should come from the venue's own site`);
      }
    }
  }
  assert.ok(count >= 70, `expected the venues' photos, found ${count}`);
});

test("no hotel borrows a photo: area photos never claim to show the hotel", () => {
  for (const h of ALL_HOTELS) {
    for (const p of h.areaPhotos) {
      assert.doesNotMatch(`${p.alt} ${p.caption}`, new RegExp(h.name.replace(/[^a-z]/gi, ".?"), "i"), `${h.key}: area photo mentions the hotel by name`);
    }
    assert.equal(new Set(h.areaPhotos.map((p) => p.src)).size, h.areaPhotos.length, `${h.key}: repeats a photo`);
  }
});

test("featured hotels open with different photographs", () => {
  const leads = FEATURED_HOTELS.map((h) => (h.photos[0] ?? h.areaPhotos[0])?.src).filter(Boolean);
  assert.equal(new Set(leads).size, leads.length);
});

test("categories, the itinerary and traveller cards only point at hotels in the guide", () => {
  for (const c of CATEGORIES) for (const k of c.hotelKeys) assert.ok(keys.has(k), `${c.id} → ${k}`);
  for (const leg of ITINERARY.legs) for (const k of leg.suggestions) assert.ok(keys.has(k), `itinerary → ${k}`);
  for (const r of TRAVELLER_RECOMMENDATIONS) for (const h of r.hotels) if (h.guideKey) assert.ok(keys.has(h.guideKey), `${r.id} → ${h.guideKey}`);
  assert.equal(CATEGORIES.length, 8);
});

test("traveller quotations are exactly the excerpts supplied, and nothing more", () => {
  const supplied = [
    "Dhow Inn in Paje is fantastic",
    "Stayed at Mnarani Beach Cottages and oh my soul, WOW!!",
    "Its a boutique Resort, everything you need",
    "Both owned and ran by lovely people and staff members with beautiful food too.",
    "We didn't want the typical all inclusive massive hotel vibe",
    "We have just stayed at Sandies Nungwi Beach and couldn't fault it.",
    "The staff, the food and the view in the morning is breathtaking",
    "The Warere Hotel in Nungwi is a truly attractive spot",
    "We loved Zanzibar Gold.",
  ];
  assert.deepEqual(TRAVELLER_RECOMMENDATIONS.flatMap((r) => r.quotes).sort(), [...supplied].sort());
  const local = TRAVELLER_RECOMMENDATIONS.find((r) => r.id === "luka-bou")!;
  assert.equal(local.role, "local-guide");
  assert.equal(TRAVELLER_RECOMMENDATIONS.find((r) => r.id === "kirsty-gibson")!.hotels.length, 0, "a travel tip is not a hotel review");
  assert.ok(!TRAVELLER_RECOMMENDATIONS.some((r) => /beth/i.test(r.person)), "the unidentified hotel photo is not listed");
});

const allCopy = [
  ...INTRODUCTION,
  ...CALL_TO_ACTION.paragraphs,
  ...BOOKING_ADVICE.flatMap((b) => b.paragraphs),
  ITINERARY.intro,
  ITINERARY.why,
  ...ITINERARY.legs.map((l) => l.body),
  ...ALL_HOTELS.flatMap((h) => [...h.description, h.whyIncluded ?? "", h.whatsDifferent ?? "", h.food, h.beach, h.nearby ?? "", ...h.considerations, ...h.facts.map((f) => f.value)]),
  ...TRAVELLER_RECOMMENDATIONS.flatMap((r) => [r.summary, r.note ?? ""]),
].join("\n");

test("no exact prices anywhere in the copy", () => {
  assert.doesNotMatch(allCopy, /(US\$|\$\s?\d|€\s?\d|£\s?\d|\d+\s?(USD|EUR|GBP)|per night from)/i);
});

test("the editors never claim to have stayed at or inspected a hotel", () => {
  assert.doesNotMatch(allCopy, /\b(we|our editors?|mzungu zanzibar)\b[^.]{0,30}\b(stayed|inspected|visited|tested|slept)\b/i);
  assert.doesNotMatch(allCopy, /\b(our|my) (stay|visit)\b/i);
});

test("websites are absolute links; map links are searches, never invented pins", () => {
  for (const h of ALL_HOTELS) {
    if (h.website) assert.match(h.website, /^https?:\/\/[^/]+\.[a-z]{2,}/, h.key);
    assert.ok(h.mapsUrl.startsWith("https://www.google.com/maps/search/?api=1&query="), h.key);
    assert.ok(h.verification.sources.length > 0, `${h.key}: no sources`);
    if (h.verification.status !== "verified") assert.ok(h.verification.gaps.length > 0, `${h.key}: partial without saying what`);
  }
});

test("admin hotel photos replace the built-in ones; bad or unknown entries are ignored", () => {
  const good = [photo("https://example.org/a.jpg")];
  const parsed = parseBoutiqueOverrides({ hotelPhotos: { passion: good, nope: good, amani: [{ src: "not a url" }] }, editorsNote: "Hello" });
  const resolved = resolveBoutiqueContent(parsed);
  assert.deepEqual(resolved.featured.find((h) => h.key === "passion")!.photos, good);
  assert.deepEqual(resolved.featured.find((h) => h.key === "amani")!.photos, FEATURED_HOTELS.find((h) => h.key === "amani")!.photos, "an invalid override keeps the built-in photos");
  assert.equal(parsed.hotelPhotos?.nope, undefined);
  assert.equal(resolved.editorsNote, "Hello");
  assert.deepEqual(parseBoutiqueOverrides("garbage"), {});
  assert.ok(photoCount(resolved) > 0);
});

test("the feed card uses the hero as a 960px Commons thumbnail, honouring an admin override", () => {
  const card = boutiqueCardImage({});
  assert.ok(card && card.includes("/thumb/") && card.includes("960px-"), String(card));
  assert.equal(boutiqueCardImage({ heroPhoto: photo("https://example.org/hero.jpg") }), "https://example.org/hero.jpg");
});

test("both editorial guides are registered for the index, feed and Guides space", () => {
  assert.ok(editorialGuideEntry(WHERE_TO_STAY_SLUG));
  assert.equal(editorialGuideEntry(BOUTIQUE_HOTELS_SLUG)?.hero({})?.src, BOUTIQUE_HERO_PHOTO.src);
  assert.equal(editorialGuideEntry("unknown"), null);
});
