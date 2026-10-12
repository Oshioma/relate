import { test } from "node:test";
import assert from "node:assert/strict";
import { postSections } from "./post-sections";

test("postSections lists h2 headings that have ids, in order", () => {
  const html =
    '<p>Intro</p><h2 id="why">Why wood?</h2><p>x</p>' +
    "<h2>No id, skipped</h2>" +
    "<h2 class='big' id='build'>Step-by-step <em>method</em></h2>" +
    '<h3 id="sub">Not a section</h3>' +
    '<h2 id="tips">Tips &amp; tricks&nbsp;&#8212; East&nbsp;Africa</h2>';
  assert.deepEqual(postSections(html), [
    { id: "why", label: "Why wood?" },
    { id: "build", label: "Step-by-step method" },
    { id: "tips", label: "Tips & tricks — East Africa" },
  ]);
});

test("postSections drops duplicate ids and empty headings", () => {
  const html = '<h2 id="a">One</h2><h2 id="a">Again</h2><h2 id="b"> <span></span> </h2>';
  assert.deepEqual(postSections(html), [{ id: "a", label: "One" }]);
});

test("postSections returns nothing for plain text", () => {
  assert.deepEqual(postSections("Just a short post."), []);
});
