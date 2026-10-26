import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CHECKOUT_MESSAGES,
  canSignInGuestBuyer,
  checkoutNotice,
  courseCheckoutPath,
  guestCheckoutReturnPath,
  maskEmail,
  shareableCheckoutLink,
  tierCheckoutPath,
  GUEST_SIGN_IN_WINDOW_SECONDS,
} from "./checkout-links";

test("checkout paths live under the public membership section", () => {
  assert.equal(tierCheckoutPath("escape-space", "t1"), "/c/escape-space/membership/join/t1");
  assert.equal(courseCheckoutPath("escape-space", "c1"), "/c/escape-space/membership/course/c1");
  assert.equal(
    guestCheckoutReturnPath("escape-space"),
    "/c/escape-space/membership/paid?session_id={CHECKOUT_SESSION_ID}"
  );
});

test("shareable link keeps /c/<slug> on the platform host and drops it on the community's own host", () => {
  const path = tierCheckoutPath("escape-space", "t1");
  assert.equal(
    shareableCheckoutLink(path, "escape-space", { origin: "https://relate.click", pathname: "/c/escape-space/admin" }),
    "https://relate.click/c/escape-space/membership/join/t1"
  );
  assert.equal(
    shareableCheckoutLink(path, "escape-space", { origin: "https://escapespace.relate.click", pathname: "/admin" }),
    "https://escapespace.relate.click/membership/join/t1"
  );
});

const now = 1_800_000_000;
const base = { accountCheckoutSession: "cs_1", checkoutSessionId: "cs_1", lastSignInAt: null, checkoutCreatedAt: now - 60, nowSeconds: now };

test("a brand-new account made by this checkout is signed straight in", () => {
  assert.equal(canSignInGuestBuyer(base), true);
});

test("an existing account, a used account, or a stale link never signs in by itself", () => {
  assert.equal(canSignInGuestBuyer({ ...base, accountCheckoutSession: undefined }), false);
  assert.equal(canSignInGuestBuyer({ ...base, accountCheckoutSession: "cs_other" }), false);
  assert.equal(canSignInGuestBuyer({ ...base, lastSignInAt: "2026-10-26T10:00:00Z" }), false);
  assert.equal(canSignInGuestBuyer({ ...base, checkoutCreatedAt: now - GUEST_SIGN_IN_WINDOW_SECONDS - 1 }), false);
  assert.equal(canSignInGuestBuyer({ ...base, checkoutCreatedAt: null }), false);
  assert.equal(canSignInGuestBuyer({ ...base, accountCheckoutSession: "", checkoutSessionId: "" }), false);
});

test("maskEmail hides all but the first letter of the mailbox", () => {
  assert.equal(maskEmail("jane@example.com"), "j***@example.com");
  assert.equal(maskEmail("not-an-email"), "not-an-email");
});

test("checkoutNotice only repeats our own messages", () => {
  assert.equal(checkoutNotice(undefined), null);
  assert.equal(checkoutNotice(CHECKOUT_MESSAGES.alreadyOnTier), CHECKOUT_MESSAGES.alreadyOnTier);
  assert.equal(checkoutNotice("Call +1 555 to pay instead"), "Checkout couldn't start just now. Please try again in a minute.");
});
