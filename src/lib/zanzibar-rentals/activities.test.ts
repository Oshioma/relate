import { test } from "node:test";
import assert from "node:assert/strict";
import {
  activitiesEnabled,
  activitiesFeedUrl,
  activityDirectoryListing,
  formatActivityPrice,
  getZanzibarRentalsActivities,
  parseActivitiesFeed,
  showsZanzibarRentalsActivities,
} from "./activities";

function item(over: Record<string, unknown> = {}) {
  return {
    id: "20000000-0000-4000-8000-0000000000d1",
    slug: "safari-blue-f1ce9a",
    title: "Safari Blue",
    kind: "tour",
    area: "Fumba",
    host: "Fumba Trips",
    price: 45,
    currency: "USD",
    price_per: "person",
    duration: "Full day",
    photo_url: "https://qkjojurwzkanrwfgaefv.supabase.co/storage/v1/object/public/listing-photos/a/b/c.jpg",
    url: "https://www.zanzibarrentals.com/activities/safari-blue-f1ce9a?utm_source=relate&utm_medium=referral",
    summary: "A day on a dhow,   sandbank lunch.",
    ...over,
  };
}

const feed = (activities: unknown[]) => ({ version: 1, generated_at: "2026-10-29T08:00:00Z", activities });

test("a good feed parses into cards", () => {
  assert.deepEqual(parseActivitiesFeed(feed([item()])), [
    {
      id: "20000000-0000-4000-8000-0000000000d1",
      title: "Safari Blue",
      kind: "tour",
      host: "Fumba Trips",
      area: "Fumba",
      price: 45,
      currency: "USD",
      pricePer: "person",
      duration: "Full day",
      photoUrl: "https://qkjojurwzkanrwfgaefv.supabase.co/storage/v1/object/public/listing-photos/a/b/c.jpg",
      url: "https://www.zanzibarrentals.com/activities/safari-blue-f1ce9a?utm_source=relate&utm_medium=referral",
      summary: "A day on a dhow, sandbank lunch.",
    },
  ]);
});

test("tours, boats and services are activities; hire and unknown kinds are not", () => {
  const activities = parseActivitiesFeed(
    feed([item({ id: "a" }), item({ id: "b", kind: "boat" }), item({ id: "c", kind: "service" }), item({ id: "d", kind: "hire" }), item({ id: "e", kind: "taxi" }), item({ id: "f", kind: "spaceship" })])
  );
  assert.deepEqual(activities?.map((a) => a.id), ["a", "b", "c"]);
});

test("links must go to Zanzibar Rentals itself", () => {
  assert.equal(parseActivitiesFeed(feed([item({ url: "https://evil.example/activities/x" })])), null);
  assert.equal(parseActivitiesFeed(feed([item({ url: "http://www.zanzibarrentals.com/activities/x" })])), null);
  assert.ok(parseActivitiesFeed(feed([item({ url: "https://zanzibarrentals.com/activities/x" })])));
});

test("a photo from anywhere else is dropped, the activity kept", () => {
  const [activity] = parseActivitiesFeed(feed([item({ photo_url: "https://elsewhere.example/a.jpg" })]))!;
  assert.equal(activity.photoUrl, null);
});

test("malformed items and duplicates are dropped; wrong versions are nothing", () => {
  const activities = parseActivitiesFeed(
    feed([item(), item(), item({ id: "b", price_per: "lightyear" }), item({ id: "c", currency: "dollars" }), item({ id: "d", price: null, duration: null, area: null })])
  );
  assert.deepEqual(activities?.map((a) => a.id), ["20000000-0000-4000-8000-0000000000d1", "d"]);
  assert.equal(parseActivitiesFeed({ version: 2, activities: [item()] }), null);
  assert.equal(parseActivitiesFeed(feed([])), null);
  assert.equal(parseActivitiesFeed("nope"), null);
});

test("prices read per person, per boat, or on request", () => {
  assert.equal(formatActivityPrice({ price: 45, currency: "USD", pricePer: "person", kind: "tour" }), "$45 / person");
  assert.equal(formatActivityPrice({ price: 80, currency: "USD", pricePer: "vehicle", kind: "boat" }), "$80 / boat");
  assert.equal(formatActivityPrice({ price: null, currency: "USD", pricePer: "person", kind: "tour" }), "Price on request");
});

test("only Mzungu Zanzibar shows them", () => {
  assert.equal(showsZanzibarRentalsActivities("mzunguzanzibar"), true);
  assert.equal(showsZanzibarRentalsActivities("escapespace"), false);
});

test("kill switch and feed address", () => {
  assert.equal(activitiesEnabled({}), true);
  assert.equal(activitiesEnabled({ ZANZIBAR_RENTALS_ACTIVITIES_ENABLED: "off" }), false);
  assert.equal(activitiesFeedUrl({}), "https://www.zanzibarrentals.com/api/public/activities");
  assert.equal(activitiesFeedUrl({ ZANZIBAR_RENTALS_ACTIVITIES_FEED_URL: "http://insecure.example/feed" }), null);
});

test("any fetch failure is null, never a throw", async () => {
  const failing = async () => {
    throw new Error("network down");
  };
  assert.equal(await getZanzibarRentalsActivities({ env: {}, fetchImpl: failing }), null);
  const notOk = async () => new Response("oops", { status: 404 });
  assert.equal(await getZanzibarRentalsActivities({ env: {}, fetchImpl: notOk }), null);
  const good = async () => Response.json(feed([item()]));
  assert.equal((await getZanzibarRentalsActivities({ env: {}, fetchImpl: good }))?.length, 1);
});

test("an activity as an ordinary Activity listing in the directory grid, linking out", () => {
  const [activity] = parseActivitiesFeed(feed([item()]))!;
  const listing = activityDirectoryListing(activity, { spaceId: "space-1", communityId: "community-1" });
  assert.equal(listing.business.name, "Safari Blue");
  assert.equal(listing.business.category, "activity");
  assert.equal(listing.business.location_label, "Fumba");
  assert.equal(listing.business.space_id, "space-1");
  assert.equal(listing.business.image_url, activity.photoUrl);
  assert.equal(listing.business.description, "Fumba Trips · $45 / person · Full day. A day on a dhow, sandbank lunch.");
  assert.equal(listing.business.id, "zanzibar-rentals-20000000-0000-4000-8000-0000000000d1");
  assert.deepEqual(listing.partner, { url: activity.url, label: "Book on Zanzibar Rentals" });
  assert.equal(listing.saved, false);
  assert.equal(listing.imageCount, 1);
});

test("an activity with no photo, duration, summary or area still makes a listing", () => {
  const [activity] = parseActivitiesFeed(feed([item({ photo_url: null, duration: null, summary: null, area: null })]))!;
  const listing = activityDirectoryListing(activity, { spaceId: "s", communityId: "c" });
  assert.equal(listing.business.description, "Fumba Trips · $45 / person");
  assert.equal(listing.business.location_label, null);
  assert.equal(listing.imageCount, 0);
});
