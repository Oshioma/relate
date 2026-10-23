import { test } from "node:test";
import assert from "node:assert/strict";
import { getLongTermStays, showsLongTermStays } from "./long-term";

function item(over: Record<string, unknown> = {}) {
  return {
    id: "6f1c1a52-0000-4000-8000-000000000001",
    name: "Kendwa flat",
    area: "Kendwa",
    lat: null,
    lng: null,
    from_price: 300,
    currency: "USD",
    price_unit: "month",
    max_guests: null,
    photo_url: null,
    photo_alt: null,
    url: "https://www.zanzibarrooms.com/stays/kendwa-flat",
    summary: null,
    ...over,
  };
}

const feed = (stays: unknown[]) => ({ version: 1, stays });
const json = (body: unknown, status = 200) => async () => new Response(JSON.stringify(body), { status });

test("only Mzungu Zanzibar's accomodation space shows the Long Term section", () => {
  assert.equal(showsLongTermStays("mzunguzanzibar", "accomodation"), true);
  assert.equal(showsLongTermStays("mzunguzanzibar", "jobs"), false);
  assert.equal(showsLongTermStays("another-community", "accomodation"), false);
});

test("asks for monthly stays in every area, up to 24", async () => {
  const urls: string[] = [];
  const fetchImpl = async (url: string) => {
    urls.push(url);
    return new Response(JSON.stringify(feed(Array.from({ length: 30 }, (_, i) => item({ id: `id-${i}` })))), { status: 200 });
  };
  const stays = await getLongTermStays({ env: {}, fetchImpl });
  assert.equal(stays?.length, 24);
  assert.deepEqual(urls, ["https://www.zanzibarrooms.com/api/public/stays?type=monthly&limit=24"]);
  // Null coordinates and guests are fine.
  assert.equal(stays?.[0].maxGuests, null);
});

test("hides on failure, on an empty feed, and when switched off", async () => {
  assert.equal(await getLongTermStays({ env: {}, fetchImpl: json({ error: "boom" }, 503) }), null);
  assert.equal(await getLongTermStays({ env: {}, fetchImpl: async () => Promise.reject(new TypeError("fetch failed")) }), null);
  assert.equal(await getLongTermStays({ env: {}, fetchImpl: json(feed([])) }), null);
  assert.equal(await getLongTermStays({ env: { ZANZIBAR_ROOMS_STAYS_ENABLED: "off" }, fetchImpl: json(feed([item()])) }), null);
});

test("drops nightly stays, and hides when none are monthly", async () => {
  const mixed = await getLongTermStays({ env: {}, fetchImpl: json(feed([item(), item({ id: "n", price_unit: "night", from_price: 50 })])) });
  assert.deepEqual(mixed?.map((s) => s.priceUnit), ["month"]);
  assert.equal(await getLongTermStays({ env: {}, fetchImpl: json(feed([item({ price_unit: "night" })])) }), null);
});
