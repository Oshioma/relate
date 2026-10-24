import { test } from "node:test";
import assert from "node:assert/strict";
import { matchZanzibarPlace } from "./zanzibar-places";
import { guideMapItems } from "./guides/map-pins";

test("event locations the geocoder misses resolve to the village they name", () => {
  assert.equal(matchZanzibarPlace("HI Skybar, Paje Beach, Zanzibar")?.key, "paje");
  assert.equal(matchZanzibarPlace("Kendwa Rocks Beach Hotel, Kendwa, Zanzibar")?.key, "kendwa");
  assert.equal(matchZanzibarPlace("Secret Garden At Emerson Spice, Stone Town")?.key, "stone-town");
  assert.equal(matchZanzibarPlace("Livingstone's, Shangani beach")?.key, "stone-town");
  assert.equal(matchZanzibarPlace("Michamvi Kae, on the west-facing sunset side")?.key, "michamvi");
});

test("text naming nowhere specific stays off the map", () => {
  assert.equal(matchZanzibarPlace("Zanzibar Beach"), null);
  assert.equal(matchZanzibarPlace("Zanzibar, Tanzania"), null);
  assert.equal(matchZanzibarPlace(null), null);
  // Whole words only.
  assert.equal(matchZanzibarPlace("Pajero hire"), null);
});

test("when text names two areas, the first one mentioned wins", () => {
  assert.equal(matchZanzibarPlace("Fumba and Kizimkazi")?.key, "fumba");
  assert.equal(matchZanzibarPlace("Bwejuu–Dongwe")?.key, "bwejuu");
});

test("guide pins: one per area, listing every guide's picks there", () => {
  const rows = [
    { slug: "where-to-stay-in-zanzibar", content: {} },
    { slug: "zanzibar-beach-bars", content: {} },
    { slug: "best-boutique-hotels-zanzibar", content: {} },
    { slug: "most-picturesque-places-zanzibar", content: {} },
  ];
  const items = guideMapItems(rows, "mzunguzanzibar");
  const keys = items.map((i) => i.id);
  assert.equal(new Set(keys).size, keys.length, "no area appears twice");
  assert.ok(items.every((i) => i.kind === "guide" && i.locationPrecision === "approximate"));

  const nungwi = items.find((i) => i.id === "nungwi")!;
  assert.equal(nungwi.href, "/c/mzunguzanzibar/guides/where-to-stay-in-zanzibar#nungwi");
  const groups = new Set(nungwi.links!.map((l) => l.group));
  assert.ok(groups.has("Zanzibar's Beach Bars"), [...groups].join(", "));
  assert.ok(nungwi.links!.every((l) => l.href.startsWith("/c/mzunguzanzibar/guides/")));

  // Areas the Where to Stay guide doesn't cover still get a pin.
  assert.ok(keys.includes("jozani"));
});

test("guide pins only come from the guides passed in", () => {
  const items = guideMapItems([{ slug: "zanzibar-beach-bars", content: {} }], "c");
  assert.ok(items.length > 0);
  assert.ok(items.every((i) => i.links!.every((l) => l.href.includes("/guides/zanzibar-beach-bars#"))));
  assert.equal(guideMapItems([], "c").length, 0);
});

test("event day words: tonight, today, tomorrow, on now", async () => {
  const { eventDayWord } = await import("./map-item-kinds");
  const now = new Date(2026, 9, 24, 12, 0);
  const at = (d: number, h: number) => new Date(2026, 9, d, h, 0).toISOString();
  assert.equal(eventDayWord(at(24, 19), at(24, 23), now), "Tonight");
  assert.equal(eventDayWord(at(24, 14), null, now), "Today");
  assert.equal(eventDayWord(at(25, 6), at(25, 9), now), "Tomorrow");
  assert.equal(eventDayWord(at(20, 15), at(30, 20), now), "On now");
  assert.equal(eventDayWord(at(26, 15), null, now), null);
  assert.equal(eventDayWord(at(23, 15), at(23, 20), now), null);
});
