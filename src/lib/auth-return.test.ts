import { test } from "node:test";
import assert from "node:assert/strict";
import { returnHereHref, safeReturnPath } from "./auth-return";

test("safeReturnPath keeps same-site paths", () => {
  assert.equal(safeReturnPath("/events", "/"), "/events");
  assert.equal(safeReturnPath("/c/mzunguzanzibar/spaces/hotels?tab=map", "/"), "/c/mzunguzanzibar/spaces/hotels?tab=map");
});

test("safeReturnPath refuses anything that could leave the site", () => {
  for (const value of ["https://evil.com", "//evil.com", "/\\evil.com", "/\t/evil.com", "evil.com", "", null, undefined, 42]) {
    assert.equal(safeReturnPath(value, "/dashboard"), "/dashboard");
  }
});

test("returnHereHref returns to the current page", () => {
  assert.equal(returnHereHref("/login", "/events", "/c/x"), "/login?next=%2Fevents");
  assert.equal(returnHereHref("/signup", "/c/x/spaces/a", "/c/x"), "/signup?next=%2Fc%2Fx%2Fspaces%2Fa");
});

test("returnHereHref falls back to the community home for pages it can't return to", () => {
  assert.equal(returnHereHref("/login", "/welcome/x", "/c/x"), "/login?next=%2Fc%2Fx");
  assert.equal(returnHereHref("/login", "/login", "/c/x"), "/login?next=%2Fc%2Fx");
  assert.equal(returnHereHref("/login", null, "/c/x"), "/login?next=%2Fc%2Fx");
  assert.equal(returnHereHref("/login", "//evil.com", "/c/x"), "/login?next=%2Fc%2Fx");
});
