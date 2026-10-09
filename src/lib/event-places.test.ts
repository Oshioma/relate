import { test } from "node:test";
import assert from "node:assert/strict";
import { placesLeftLabel } from "./event-places";

test("placesLeftLabel counts down and says Full", () => {
  assert.equal(placesLeftLabel(null, 40), null);
  assert.equal(placesLeftLabel(20, 8), "12 places left");
  assert.equal(placesLeftLabel(5, 4), "1 place left");
  assert.equal(placesLeftLabel(5, 5), "Full");
  assert.equal(placesLeftLabel(5, 7), "Full");
});
