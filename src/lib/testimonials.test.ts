import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTestimonialsInput, readTestimonials, testimonialPhoto } from "./testimonials";

test("readTestimonials keeps only entries with a quote, trimmed", () => {
  assert.deepEqual(
    readTestimonials([{ quote: "  Lovely.  ", name: " Mel " }, { quote: "", name: "Nobody" }, null, "x", { name: "No quote" }]),
    [{ quote: "Lovely.", name: "Mel", avatarUrl: null, memberId: null }]
  );
  assert.deepEqual(readTestimonials(null), []);
  assert.deepEqual(readTestimonials({ quote: "not a list" }), []);
});

test("parseTestimonialsInput drops empty rows and checks limits", () => {
  assert.deepEqual(parseTestimonialsInput('[{"quote":"Hi","name":"Tanya"},{"quote":" ","name":""}]'), {
    ok: true,
    testimonials: [{ quote: "Hi", name: "Tanya", avatarUrl: null, memberId: null }],
  });
  assert.deepEqual(parseTestimonialsInput(""), { ok: true, testimonials: [] });
  assert.equal(parseTestimonialsInput("{oops").ok, false);
  assert.equal(parseTestimonialsInput(JSON.stringify([{ quote: "x".repeat(1001), name: "" }])).ok, false);
  assert.equal(parseTestimonialsInput(JSON.stringify(Array.from({ length: 13 }, () => ({ quote: "q", name: "" })))).ok, false);
});

test("readTestimonials keeps a web address photo and drops anything else", () => {
  assert.deepEqual(
    readTestimonials([
      { quote: "A", name: "Mel", avatarUrl: " https://example.com/mel.jpg " },
      { quote: "B", name: "Tanya", avatarUrl: "javascript:alert(1)" },
    ]).map((t) => t.avatarUrl),
    ["https://example.com/mel.jpg", null]
  );
});

test("a linked member's profile photo wins over the uploaded one", () => {
  const id = "11111111-2222-3333-4444-555555555555";
  const [linked, bad] = readTestimonials([
    { quote: "A", name: "Mel", avatarUrl: "https://example.com/up.jpg", memberId: id },
    { quote: "B", name: "Tanya", memberId: "not-an-id" },
  ]);
  assert.equal(bad.memberId, null);
  assert.equal(testimonialPhoto(linked, new Map([[id, "https://example.com/profile.jpg"]])), "https://example.com/profile.jpg");
  assert.equal(testimonialPhoto(linked, new Map()), "https://example.com/up.jpg");
  assert.equal(testimonialPhoto(bad, new Map()), null);
});
