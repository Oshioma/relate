import { test } from "node:test";
import assert from "node:assert/strict";
import { htmlToStripeMarkdown } from "./stripe-markdown";

test("plain text passes through", () => {
  assert.equal(htmlToStripeMarkdown("You'll have access as soon as you've paid.\n\nCancel any time."), "You'll have access as soon as you've paid.\n\nCancel any time.");
});

test("paragraphs and line breaks become new lines", () => {
  assert.equal(htmlToStripeMarkdown("<p>First</p><p>Second<br>line</p>"), "First\n\nSecond\nline");
});

test("bold, italic and links become Markdown", () => {
  assert.equal(
    htmlToStripeMarkdown('<p><strong>Welcome</strong> to <em>Escape Space</em>. Read <a href="https://example.com/terms">our terms</a>.</p>'),
    "**Welcome** to _Escape Space_. Read [our terms](https://example.com/terms)."
  );
});

test("spaces stay outside the markers", () => {
  assert.equal(htmlToStripeMarkdown("<p>Hello<b> there </b>friend</p>"), "Hello **there** friend");
});

test("lists become dash lines and headings become bold", () => {
  assert.equal(htmlToStripeMarkdown("<h2>What you get</h2><ul><li>Live calls</li><li>Courses</li></ul>"), "**What you get**\n\n- Live calls\n- Courses");
});

test("unsafe links keep only their text, entities are decoded", () => {
  assert.equal(htmlToStripeMarkdown('<p><a href="javascript:alert(1)">click</a> &amp; go&nbsp;now</p>'), "click & go now");
});

test("empty input", () => {
  assert.equal(htmlToStripeMarkdown(""), "");
  assert.equal(htmlToStripeMarkdown(null), "");
  assert.equal(htmlToStripeMarkdown("<p><br></p>"), "");
});
