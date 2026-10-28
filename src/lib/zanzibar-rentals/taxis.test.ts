import { test } from "node:test";
import assert from "node:assert/strict";
import { formatTaxiPrice, taxiDirectoryListing, taxiPickupArea, getZanzibarRentalsTaxis, parseTaxisFeed, showsZanzibarRentalsTaxis, taxisEnabled, taxisFeedUrl } from "./taxis";

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

test("a taxi as an ordinary Taxi listing in the directory grid", () => {
  const [taxi] = parseTaxisFeed(feed([item()]))!;
  const listing = taxiDirectoryListing(taxi, { spaceId: "space-1", communityId: "community-1" });
  assert.equal(listing.business.name, "Airport → Nungwi");
  assert.equal(listing.business.category, "taxi");
  assert.equal(listing.business.location_label, "Stone Town");
  assert.equal(listing.business.space_id, "space-1");
  assert.equal(listing.business.image_url, taxi.photoUrl);
  assert.equal(listing.business.description, "Juma's Taxis · $60 / trip · up to 6 people. Meets you at arrivals.");
  assert.equal(listing.business.id, "zanzibar-rentals-20000000-0000-4000-8000-0000000000c1");
  assert.deepEqual(listing.partner, { url: taxi.url, label: "Book on Zanzibar Rentals" });
  assert.equal(listing.saved, false);
  assert.equal(listing.imageCount, 1);
});

test("a taxi with no route, photo or seats still makes a listing", () => {
  const [taxi] = parseTaxisFeed(feed([item({ to: null, photo_url: null, seats: null, summary: null, area: null })]))!;
  const listing = taxiDirectoryListing(taxi, { spaceId: "s", communityId: "c" });
  assert.equal(listing.business.name, "Airport");
  assert.equal(listing.business.description, "Juma's Taxis · $60 / trip");
  assert.equal(listing.business.location_label, null);
  assert.equal(listing.imageCount, 0);
});

test("a route is grouped where it starts, not where the driver is based", () => {
  const at = (from: string, area: string | null = "Nungwi") => taxiPickupArea({ from, to: "Paje", area });
  assert.equal(at("Airport"), "Stone Town");
  assert.equal(at("Zanzibar Airport (ZNZ)"), "Stone Town");
  assert.equal(at("Stone Town"), "Stone Town");
  assert.equal(at("Stonetown"), "Stone Town");
  assert.equal(at("Ferry port"), "Stone Town");
  assert.equal(at("Nungwi"), "Nungwi");
  assert.equal(at("Paje beach hotels", "Stone Town"), "Paje");
  assert.equal(at("Mwera"), "Mwera");
  // Not a route: the host's area.
  assert.equal(taxiPickupArea({ from: "Day hire with driver", to: null, area: "Nungwi" }), "Nungwi");
});
