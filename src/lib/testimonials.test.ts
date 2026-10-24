import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTestimonialsInput, readTestimonials } from "./testimonials";

test("readTestimonials keeps only entries with a quote, trimmed", () => {
  assert.deepEqual(
    readTestimonials([{ quote: "  Lovely.  ", name: " Mel " }, { quote: "", name: "Nobody" }, null, "x", { name: "No quote" }]),
    [{ quote: "Lovely.", name: "Mel" }]
  );
  assert.deepEqual(readTestimonials(null), []);
  assert.deepEqual(readTestimonials({ quote: "not a list" }), []);
});

test("parseTestimonialsInput drops empty rows and checks limits", () => {
  assert.deepEqual(parseTestimonialsInput('[{"quote":"Hi","name":"Tanya"},{"quote":" ","name":""}]'), {
    ok: true,
    testimonials: [{ quote: "Hi", name: "Tanya" }],
  });
  assert.deepEqual(parseTestimonialsInput(""), { ok: true, testimonials: [] });
  assert.equal(parseTestimonialsInput("{oops").ok, false);
  assert.equal(parseTestimonialsInput(JSON.stringify([{ quote: "x".repeat(1001), name: "" }])).ok, false);
  assert.equal(parseTestimonialsInput(JSON.stringify(Array.from({ length: 13 }, () => ({ quote: "q", name: "" })))).ok, false);
});
