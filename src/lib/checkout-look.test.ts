import { test } from "node:test";
import assert from "node:assert/strict";
import { checkoutLookFor, defaultCheckoutMessage } from "./checkout-look";

test("the community's own line wins over the default", () => {
  const look = checkoutLookFor({ name: "Escape Space", checkout_message: "  Welcome, soul traveller.  " });
  assert.equal(look.submitMessage, "Welcome, soul traveller.");
});

test("no line of their own (or no column yet) falls back to the default", () => {
  assert.equal(checkoutLookFor({ name: "Escape Space" }).submitMessage, defaultCheckoutMessage("Escape Space"));
  assert.equal(checkoutLookFor({ name: "Escape Space", checkout_message: "   " }).submitMessage, defaultCheckoutMessage("Escape Space"));
  assert.doesNotMatch(checkoutLookFor({ name: "X" }, { oneOff: true }).submitMessage, /Cancel/);
});

test("picture prefers the cover, then the logo, and only https", () => {
  assert.equal(checkoutLookFor({ name: "X", cover_image_url: "https://a/c.jpg", logo_url: "https://a/l.png" }).imageUrl, "https://a/c.jpg");
  assert.equal(checkoutLookFor({ name: "X", logo_url: "https://a/l.png" }).imageUrl, "https://a/l.png");
  assert.equal(checkoutLookFor({ name: "X", logo_url: "http://a/l.png" }).imageUrl, null);
  assert.equal(checkoutLookFor({ name: "X", logo_url: "not a url" }).imageUrl, null);
});
