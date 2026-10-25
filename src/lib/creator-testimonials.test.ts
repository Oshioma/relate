import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCreatorTestimonialsForm, readCreatorTestimonials } from "./creator-testimonials";

function form(entries: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.set(key, value);
  return data;
}

test("readCreatorTestimonials keeps only entries with a quote, trimmed", () => {
  assert.deepEqual(
    readCreatorTestimonials([{ quote: "  Lovely.  ", name: " Oshi ", role: " Founder " }, { quote: " ", name: "Nobody" }, null, "x"]),
    [{ quote: "Lovely.", name: "Oshi", role: "Founder" }]
  );
  assert.deepEqual(readCreatorTestimonials([{ quote: "No name" }]), [{ quote: "No name", name: "", role: "" }]);
  assert.deepEqual(readCreatorTestimonials(null), []);
  assert.deepEqual(readCreatorTestimonials({ quote: "not a list" }), []);
});

test("parseCreatorTestimonialsForm reads the rows in order and drops empty ones", () => {
  assert.deepEqual(
    parseCreatorTestimonialsForm(
      form({ quote_0: "First", name_0: "A", role_0: "Founder", quote_1: "", name_1: "Spare", quote_2: "Third", name_2: "C" })
    ),
    {
      ok: true,
      testimonials: [
        { quote: "First", name: "A", role: "Founder" },
        { quote: "Third", name: "C", role: "" },
      ],
    }
  );
  assert.deepEqual(parseCreatorTestimonialsForm(form({})), { ok: true, testimonials: [] });
});

test("parseCreatorTestimonialsForm checks the length limits", () => {
  assert.equal(parseCreatorTestimonialsForm(form({ quote_0: "x".repeat(401) })).ok, false);
  assert.equal(parseCreatorTestimonialsForm(form({ quote_0: "Hi", name_0: "x".repeat(81) })).ok, false);
  assert.equal(parseCreatorTestimonialsForm(form({ quote_0: "Hi", role_0: "x".repeat(121) })).ok, false);
});
