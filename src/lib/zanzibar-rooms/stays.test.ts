import { test } from "node:test";
import assert from "node:assert/strict";
import { feedBase, feedUrl, formatFromPrice, getZanzibarRoomsStays, parseStaysFeed, stayQueryFor, staysEnabled } from "./stays";

function item(over: Record<string, unknown> = {}) {
  return {
    id: "6f1c1a52-0000-4000-8000-000000000001",
    slug: "paje-beach-studio",
    name: "Paje Beach Studio",
    area: "Paje",
    lat: -6.267,
    lng: 39.535,
    from_price: 85,
    currency: "USD",
    price_unit: "night",
    max_guests: 2,
    photo_url: "https://qkjojurwzkanrwfgaefv.supabase.co/storage/v1/object/public/rooms/a.jpg",
    photo_alt: "Studio with a sea view",
    url: "https://www.zanzibarrooms.com/stays/paje-beach-studio?utm_source=relate&utm_medium=referral",
    summary: "A bright studio a short walk from Paje beach.",
    ...over,
  };
}

const feed = (stays: unknown[]) => ({ version: 1, generated_at: "2026-10-23T10:00:00Z", stays });

test("a good feed parses into cards", () => {
  const stays = parseStaysFeed(feed([item()]));
  assert.ok(stays);
  assert.equal(stays.length, 1);
  assert.deepEqual(stays[0], {
    id: "6f1c1a52-0000-4000-8000-000000000001",
    name: "Paje Beach Studio",
    area: "Paje",
    fromPrice: 85,
    currency: "USD",
    priceUnit: "night",
    maxGuests: 2,
    photoUrl: "https://qkjojurwzkanrwfgaefv.supabase.co/storage/v1/object/public/rooms/a.jpg",
    photoAlt: "Studio with a sea view",
    url: "https://www.zanzibarrooms.com/stays/paje-beach-studio?utm_source=relate&utm_medium=referral",
    summary: "A bright studio a short walk from Paje beach.",
  });
});

test("malformed items are dropped, the rest kept", () => {
  const stays = parseStaysFeed(
    feed([
      item({ id: "a" }),
      item({ id: "b", name: "" }),
      item({ id: "c", from_price: "85" }),
      item({ id: "d", price_unit: "week" }),
      item({ id: "e", lat: null }),
      item({ id: "f", currency: "dollars" }),
      null,
      "nope",
      item({ id: "g", max_guests: 1.5 }),
      item({ id: "a" }), // duplicate id
      item({ id: "h", price_unit: "month", from_price: 900 }),
    ])
  );
  assert.deepEqual(stays?.map((s) => s.id), ["a", "h"]);
});

test("links that aren't Zanzibar Rooms itself are rejected", () => {
  const stays = parseStaysFeed(
    feed([
      item({ id: "evil", url: "https://evil.example/stays/x" }),
      item({ id: "http", url: "http://www.zanzibarrooms.com/stays/x" }),
      item({ id: "lookalike", url: "https://www.zanzibarrooms.com.evil.example/x" }),
      item({ id: "apex", url: "https://zanzibarrooms.com/stays/x" }),
      item({ id: "creds", url: "https://user:pw@www.zanzibarrooms.com/x" }),
      item({ id: "js", url: "javascript:alert(1)" }),
      item({ id: "ok" }),
    ])
  );
  assert.deepEqual(stays?.map((s) => s.id), ["ok"]);
});

test("photos must be https on an allowed host, otherwise the card has no photo", () => {
  const stays = parseStaysFeed(
    feed([
      item({ id: "http", photo_url: "http://www.zanzibarrooms.com/a.jpg" }),
      item({ id: "foreign", photo_url: "https://elsewhere.example/a.jpg" }),
      item({ id: "none", photo_url: null, photo_alt: "" }),
      item({ id: "rest", photo_url: "https://qkjojurwzkanrwfgaefv.supabase.co/rest/v1/rooms" }),
      item({ id: "zr", photo_url: "https://www.zanzibarrooms.com/photos/a.jpg" }),
    ])
  );
  assert.deepEqual(
    stays?.map((s) => [s.id, s.photoUrl]),
    [
      ["http", null],
      ["foreign", null],
      ["none", null],
      ["rest", null],
      ["zr", "https://www.zanzibarrooms.com/photos/a.jpg"],
    ]
  );
  assert.equal(stays?.[2].photoAlt, "Paje Beach Studio");
});

test("not a feed, a wrong version or an empty feed is null", () => {
  assert.equal(parseStaysFeed(null), null);
  assert.equal(parseStaysFeed("<html>"), null);
  assert.equal(parseStaysFeed({ stays: [item()] }), null);
  assert.equal(parseStaysFeed({ version: 2, stays: [item()] }), null);
  assert.equal(parseStaysFeed(feed([])), null);
  assert.equal(parseStaysFeed(feed([item({ url: "https://evil.example" })])), null);
});

test("no more than the limit", () => {
  const many = Array.from({ length: 20 }, (_, i) => item({ id: `s${i}` }));
  assert.equal(parseStaysFeed(feed(many))?.length, 6);
  assert.equal(parseStaysFeed(feed(many), 3)?.length, 3);
});

test("long text is clipped", () => {
  const [stay] = parseStaysFeed(feed([item({ summary: "x".repeat(400) })]))!;
  assert.equal(stay.summary.length, 160);
  assert.ok(stay.summary.endsWith("…"));
});

test("page → query: known areas by name, else near the page, never off Zanzibar", () => {
  assert.deepEqual(stayQueryFor({ name: "Paje", lat: -6.267, lng: 39.535 }), { by: "area", area: "Paje", near: { lat: -6.267, lng: 39.535 } });
  assert.deepEqual(stayQueryFor({ name: "stone town" }), { by: "area", area: "Stone Town" });
  assert.deepEqual(stayQueryFor({ name: "Mnemba Atoll", lat: -5.82, lng: 39.38 }), { by: "near", lat: -5.82, lng: 39.38 });
  // Pemba is in.
  assert.deepEqual(stayQueryFor({ name: "Chake Chake", lat: -5.25, lng: 39.77 }), { by: "near", lat: -5.25, lng: 39.77 });
  // Elsewhere is out, even with a matching name.
  assert.equal(stayQueryFor({ name: "Paje", lat: 51.5, lng: -0.12 }), null);
  assert.equal(stayQueryFor({ name: "Dar es Salaam", lat: -6.79, lng: 39.21 }), null);
  assert.equal(stayQueryFor({ name: "Somewhere" }), null);
});

test("feed URLs", () => {
  const base = "https://www.zanzibarrooms.com/api/public/stays";
  assert.equal(feedUrl(base, { area: "Stone Town" }), `${base}?area=Stone+Town&limit=6`);
  assert.equal(feedUrl(base, { lat: -5.82, lng: 39.38 }), `${base}?near=-5.8200%2C39.3800&radius_km=8&limit=6`);
});

test("config: on by default, kill switch, base URL override", () => {
  assert.equal(staysEnabled({}), true);
  assert.equal(staysEnabled({ ZANZIBAR_ROOMS_STAYS_ENABLED: "true" }), true);
  for (const off of ["false", "0", "off", "NO"]) assert.equal(staysEnabled({ ZANZIBAR_ROOMS_STAYS_ENABLED: off }), false);
  assert.equal(feedBase({}), "https://www.zanzibarrooms.com/api/public/stays");
  assert.equal(feedBase({ ZANZIBAR_ROOMS_FEED_URL: "https://staging.example/api/public/stays" }), "https://staging.example/api/public/stays");
  assert.equal(feedBase({ ZANZIBAR_ROOMS_FEED_URL: "http://insecure.example/feed" }), null);
});

const json = (body: unknown, status = 200) => async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

test("fetching: success, and every failure is null", async () => {
  const q = { by: "area", area: "Paje" } as const;
  assert.equal((await getZanzibarRoomsStays(q, { env: {}, fetchImpl: json(feed([item()])) }))?.length, 1);
  assert.equal(await getZanzibarRoomsStays(q, { env: {}, fetchImpl: json({ error: "boom" }, 500) }), null);
  assert.equal(await getZanzibarRoomsStays(q, { env: {}, fetchImpl: async () => new Response("<html>", { status: 200 }) }), null);
  assert.equal(await getZanzibarRoomsStays(q, { env: {}, fetchImpl: async () => Promise.reject(new TypeError("fetch failed")) }), null);
  assert.equal(await getZanzibarRoomsStays(q, { env: {}, fetchImpl: json(feed([])) }), null);
  assert.equal(await getZanzibarRoomsStays(null, { env: {}, fetchImpl: json(feed([item()])) }), null);
});

test("fetching: the kill switch makes no request", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls++;
    return new Response(JSON.stringify(feed([item()])));
  };
  assert.equal(await getZanzibarRoomsStays({ by: "area", area: "Paje" }, { env: { ZANZIBAR_ROOMS_STAYS_ENABLED: "false" }, fetchImpl }), null);
  assert.equal(calls, 0);
});

test("fetching: a slow feed times out to null", async () => {
  const hang = (_url: string, init: RequestInit) =>
    new Promise<Response>((_, reject) => init.signal?.addEventListener("abort", () => reject(init.signal?.reason)));
  // AbortSignal.timeout's timer doesn't hold the event loop open on its own.
  const keepAlive = setTimeout(() => {}, 2000);
  const started = Date.now();
  assert.equal(await getZanzibarRoomsStays({ by: "area", area: "Paje", near: { lat: -6.267, lng: 39.535 } }, { env: {}, fetchImpl: hang, timeoutMs: 50 }), null);
  // One timeout, not a second one for the near fallback.
  assert.ok(Date.now() - started < 1000);
  clearTimeout(keepAlive);
});

test("fetching: an empty area falls back to near the page", async () => {
  const urls: string[] = [];
  const fetchImpl = async (url: string) => {
    urls.push(url);
    return new Response(JSON.stringify(url.includes("near=") ? feed([item()]) : feed([])));
  };
  const stays = await getZanzibarRoomsStays({ by: "area", area: "Dongwe", near: { lat: -6.2, lng: 39.525 } }, { env: {}, fetchImpl });
  assert.equal(stays?.length, 1);
  assert.equal(urls.length, 2);
  assert.match(urls[0], /area=Dongwe/);
  assert.match(urls[1], /near=-6\.2000%2C39\.5250/);
});

test("price label", () => {
  assert.equal(formatFromPrice({ fromPrice: 85, currency: "USD", priceUnit: "night" }), "from $85 / night");
  assert.equal(formatFromPrice({ fromPrice: 1200.5, currency: "USD", priceUnit: "month" }), "from $1,201 / month");
  assert.equal(formatFromPrice({ fromPrice: 90, currency: "EUR", priceUnit: "night" }), "from €90 / night");
});
