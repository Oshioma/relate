import { test } from "node:test";
import assert from "node:assert/strict";
import { formatTaxiPrice, getZanzibarRentalsTaxis, parseTaxisFeed, showsZanzibarRentalsTaxis, taxisEnabled, taxisFeedUrl } from "./taxis";

function item(over: Record<string, unknown> = {}) {
  return {
    id: "20000000-0000-4000-8000-0000000000c1",
    slug: "taxi-airport-nungwi-f1ce9a",
    title: "Taxi: Airport → Nungwi",
    from: "Airport",
    to: "Nungwi",
    area: "Nungwi",
    host: "Juma's Taxis",
    price: 60,
    currency: "USD",
    price_per: "trip",
    seats: 6,
    photo_url: "https://qkjojurwzkanrwfgaefv.supabase.co/storage/v1/object/public/listing-photos/a/b/c.jpg",
    url: "https://www.zanzibarrentals.com/activities/taxi-airport-nungwi-f1ce9a?utm_source=relate&utm_medium=referral",
    summary: "Meets you   at arrivals.",
    ...over,
  };
}

const feed = (taxis: unknown[]) => ({ version: 1, generated_at: "2026-10-28T08:00:00Z", taxis });

test("a good feed parses into cards", () => {
  assert.deepEqual(parseTaxisFeed(feed([item()])), [
    {
      id: "20000000-0000-4000-8000-0000000000c1",
      from: "Airport",
      to: "Nungwi",
      host: "Juma's Taxis",
      area: "Nungwi",
      price: 60,
      currency: "USD",
      pricePer: "trip",
      seats: 6,
      photoUrl: "https://qkjojurwzkanrwfgaefv.supabase.co/storage/v1/object/public/listing-photos/a/b/c.jpg",
      url: "https://www.zanzibarrentals.com/activities/taxi-airport-nungwi-f1ce9a?utm_source=relate&utm_medium=referral",
      summary: "Meets you at arrivals.",
    },
  ]);
});

test("links must go to Zanzibar Rentals itself", () => {
  assert.equal(parseTaxisFeed(feed([item({ url: "https://evil.example/activities/x" })])), null);
  assert.equal(parseTaxisFeed(feed([item({ url: "http://www.zanzibarrentals.com/activities/x" })])), null);
  assert.ok(parseTaxisFeed(feed([item({ url: "https://zanzibarrentals.com/activities/x" })])));
});

test("a photo from anywhere else is dropped, the taxi kept", () => {
  const [taxi] = parseTaxisFeed(feed([item({ photo_url: "https://elsewhere.example/a.jpg" })]))!;
  assert.equal(taxi.photoUrl, null);
});

test("malformed items and duplicates are dropped; wrong versions are nothing", () => {
  const taxis = parseTaxisFeed(feed([item(), item(), item({ id: "b", price_per: "lightyear" }), item({ id: "c", currency: "dollars" }), item({ id: "d", to: null, price: null, seats: null })]));
  assert.deepEqual(taxis?.map((t) => t.id), ["20000000-0000-4000-8000-0000000000c1", "d"]);
  assert.equal(parseTaxisFeed({ version: 2, taxis: [item()] }), null);
  assert.equal(parseTaxisFeed(feed([])), null);
  assert.equal(parseTaxisFeed("nope"), null);
});

test("prices read per trip, per car, or on request", () => {
  assert.equal(formatTaxiPrice({ price: 60, currency: "USD", pricePer: "trip", seats: 6 }), "$60 / trip");
  assert.equal(formatTaxiPrice({ price: 30, currency: "USD", pricePer: "vehicle", seats: 4 }), "$30 / car");
  assert.equal(formatTaxiPrice({ price: null, currency: "USD", pricePer: "trip", seats: null }), "Price on request");
});

test("only Mzungu Zanzibar shows them", () => {
  assert.equal(showsZanzibarRentalsTaxis("mzunguzanzibar"), true);
  assert.equal(showsZanzibarRentalsTaxis("escapespace"), false);
});

test("kill switch and feed address", () => {
  assert.equal(taxisEnabled({}), true);
  assert.equal(taxisEnabled({ ZANZIBAR_RENTALS_TAXIS_ENABLED: "off" }), false);
  assert.equal(taxisFeedUrl({}), "https://www.zanzibarrentals.com/api/public/taxis");
  assert.equal(taxisFeedUrl({ ZANZIBAR_RENTALS_TAXIS_FEED_URL: "http://insecure.example/feed" }), null);
});

test("any fetch failure is null, never a throw", async () => {
  const failing = async () => {
    throw new Error("network down");
  };
  assert.equal(await getZanzibarRentalsTaxis({ env: {}, fetchImpl: failing }), null);
  const notOk = async () => new Response("oops", { status: 503 });
  assert.equal(await getZanzibarRentalsTaxis({ env: {}, fetchImpl: notOk }), null);
  const good = async () => Response.json(feed([item()]));
  assert.equal((await getZanzibarRentalsTaxis({ env: {}, fetchImpl: good }))?.length, 1);
});
