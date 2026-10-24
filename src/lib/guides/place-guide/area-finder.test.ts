import { test } from "node:test";
import assert from "node:assert/strict";
import { BEACH_BARS_GUIDE } from "../beach-bars/content";
import { RESTAURANTS_GUIDE } from "../restaurants/content";
import { byDistance, distanceKm, formatDistance } from "./distance";

const GUIDES = [BEACH_BARS_GUIDE, RESTAURANTS_GUIDE];

test("every entry is in exactly one area card", () => {
  for (const g of GUIDES) {
    assert.ok(g.areaFinder, `${g.slug} has no area cards`);
    const seen = g.areaFinder.areas.flatMap((a) => a.placeKeys);
    assert.equal(new Set(seen).size, seen.length, `${g.slug}: a place is in two areas`);
    assert.deepEqual([...seen].sort(), g.places.map((p) => p.key).sort(), `${g.slug}: areas don't cover every place`);
    assert.equal(new Set(g.areaFinder.areas.map((a) => a.id)).size, g.areaFinder.areas.length);
    for (const a of g.areaFinder.areas) assert.ok(a.placeKeys.length > 0 && /^[a-z-]+$/.test(a.id), `${g.slug}#area-${a.id}`);
  }
});

test("every entry has coordinates on Zanzibar (Unguja), inside its area", () => {
  for (const g of GUIDES) {
    for (const p of g.places) {
      assert.ok(p.coords, `${g.slug}: ${p.key} has no coords`);
      assert.ok(p.coords.lat > -6.5 && p.coords.lat < -5.7 && p.coords.lng > 39.15 && p.coords.lng < 39.6, `${p.key} is off the island: ${JSON.stringify(p.coords)}`);
    }
    // Places in one area are within a short drive of each other.
    for (const a of g.areaFinder!.areas) {
      const pts = a.placeKeys.map((k) => g.places.find((p) => p.key === k)!.coords!);
      for (const x of pts) for (const y of pts) assert.ok(distanceKm(x, y) < 30, `${g.slug} ${a.id} spans ${distanceKm(x, y).toFixed(0)} km`);
    }
  }
});

test("distances: straight-line km, formatted for reading", () => {
  const stoneTown = { lat: -6.1605, lng: 39.1888 };
  const nungwi = { lat: -5.7236, lng: 39.2964 };
  const km = distanceKm(stoneTown, nungwi);
  assert.ok(km > 48 && km < 52, `${km}`);
  assert.equal(distanceKm(stoneTown, stoneTown), 0);
  assert.equal(formatDistance(0.01), "50 m");
  assert.equal(formatDistance(0.43), "450 m");
  assert.equal(formatDistance(2.34), "2.3 km");
  assert.equal(formatDistance(34.4), "34 km");
});

test("near me: nearest first, places without coordinates last in guide order", () => {
  const coords = { a: { lat: -6.16, lng: 39.19 }, b: { lat: -5.72, lng: 39.3 }, c: undefined, d: { lat: -6.27, lng: 39.54 } };
  const fromPaje = byDistance(["a", "b", "c", "d"], coords, { lat: -6.27, lng: 39.535 });
  assert.deepEqual(
    fromPaje.map((x) => x.key),
    ["d", "a", "b", "c"],
  );
  assert.equal(fromPaje[3].km, null);
});

test("the near-me card's picture exists", () => {
  for (const g of GUIDES) {
    const n = g.areaFinder?.nearPhoto;
    assert.ok(n, `${g.slug} has no near-me picture`);
    assert.ok(g.places.find((p) => p.key === n.placeKey)?.photos[n.photo ?? 0], `${g.slug}: ${n.placeKey} photo ${n.photo}`);
  }
});
