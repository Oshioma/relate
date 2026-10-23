import { test } from "node:test";
import assert from "node:assert/strict";
import { guideVenues, MAX_GUIDE_VENUES } from "./guide-venues";
import { RESTAURANTS_SLUG } from "@/lib/guides/restaurants/content";
import { PICTURESQUE_GUIDE } from "@/lib/guides/picturesque/content";

test("venues come from the restaurant and bar entries of the given guides", () => {
  const venues = guideVenues([RESTAURANTS_SLUG]);
  assert.ok(venues.length > 10);
  assert.ok(venues.some((v) => v.name === "Kajibange"));
  // Beaches and viewpoints don't host events.
  assert.deepEqual(guideVenues([PICTURESQUE_GUIDE.slug]).filter((v) => v.name === "Nakupenda sandbank"), []);
});

test("unknown and unpublished guides add nothing, repeats are dropped and the list is capped", () => {
  assert.deepEqual(guideVenues([]), []);
  assert.deepEqual(guideVenues(["not-a-guide"]), []);
  const twice = guideVenues([RESTAURANTS_SLUG, RESTAURANTS_SLUG]);
  assert.equal(new Set(twice.map((v) => v.name)).size, twice.length);
  assert.ok(twice.length <= MAX_GUIDE_VENUES);
  assert.equal(guideVenues([RESTAURANTS_SLUG], 3).length, 3);
});
