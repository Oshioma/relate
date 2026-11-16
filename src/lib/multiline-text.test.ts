import { test } from "node:test";
import assert from "node:assert/strict";
import { tidyMultilineText } from "./multiline-text";

test("keeps paragraphs and single line breaks", () => {
  assert.equal(tidyMultilineText("First paragraph.\n\nSecond one\nwith a break."), "First paragraph.\n\nSecond one\nwith a break.");
});

test("squeezes spaces inside a line and trims each line", () => {
  assert.equal(tidyMultilineText("  Hello    there \t\n   friend  "), "Hello there\nfriend");
});

test("turns Windows line endings into plain ones", () => {
  assert.equal(tidyMultilineText("One\r\n\r\nTwo\rThree"), "One\n\nTwo\nThree");
});

test("many blank lines become one", () => {
  assert.equal(tidyMultilineText("One\n\n\n\n\nTwo\n \n \nThree"), "One\n\nTwo\n\nThree");
});

test("empty and missing input give an empty string", () => {
  assert.equal(tidyMultilineText(""), "");
  assert.equal(tidyMultilineText(null), "");
  assert.equal(tidyMultilineText(undefined), "");
  assert.equal(tidyMultilineText("  \n\n  "), "");
});
