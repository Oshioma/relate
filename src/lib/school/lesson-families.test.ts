import { test } from "node:test";
import assert from "node:assert/strict";
import {
  canGoBeyondSource,
  familyRangeLabel,
  groupFamilies,
  type LessonRow,
} from "./lesson-types";

function row(id: string, family: string, band: string, created: string): LessonRow {
  return { id, family_id: family, age_band: band, created_at: created } as unknown as LessonRow;
}

test("levels of one source collapse into one family, youngest first", () => {
  // Newest first, the way the library reads them.
  const families = groupFamilies([
    row("adult", "f1", "adult", "2026-10-01T06:00:00Z"),
    row("solo", "f2", "8-10", "2026-09-30T00:00:00Z"),
    row("sixth", "f1", "16-18", "2026-10-01T05:00:00Z"),
    row("kids", "f1", "8-10", "2026-10-01T07:00:00Z"),
  ]);

  assert.deepEqual(
    families.map((f) => [f.id, f.levels.map((l) => l.id)]),
    [
      ["f1", ["kids", "sixth", "adult"]],
      ["f2", ["solo"]],
    ]
  );
});

test("a family's card shows the span of its ages", () => {
  assert.equal(familyRangeLabel(["16-18"]), "Ages 16–18");
  assert.equal(familyRangeLabel(["adult", "16-18"]), "Ages 16–18 → Adult");
  assert.equal(familyRangeLabel(["11-13", "5-7", "11-13"]), "Ages 5–7 → 11–13");
});

test("only the Adult band goes beyond the source", () => {
  assert.equal(canGoBeyondSource("adult"), true);
  for (const band of ["5-7", "8-10", "11-13", "16-18"]) {
    assert.equal(canGoBeyondSource(band), false, band);
  }
});

test("editing a lesson keeps the institutional material it left out", async () => {
  const { EditableLessonSchema } = await import("./lesson-types");
  const parsed = EditableLessonSchema.parse({
    title: "T",
    subject: "History",
    summary: "",
    objectives: [],
    vocabulary: [],
    sections: [],
    activity: { title: "", instructions: "", materials: [] },
    questions: [],
    discussion: [],
    omitted_institutional: [{ body: "CDC", content: "What the source said the CDC claimed." }],
  });
  assert.deepEqual(parsed.omitted_institutional, [
    { body: "CDC", content: "What the source said the CDC claimed." },
  ]);
});

test("look-into-it links are searches for the topic, on the owner's chosen sites", async () => {
  const { researchLinks } = await import("./lesson-types");
  const links = researchLinks("Vitamin K & newborns");
  assert.deepEqual(
    links.map((l) => l.label),
    ["Reddit", "X", "Rumble", "Odysee", "BitChute", "Internet Archive"]
  );
  for (const link of links) {
    assert.ok(link.href.startsWith("https://"), link.href);
    assert.ok(link.href.includes("Vitamin%20K%20%26%20newborns"), link.href);
  }
  assert.deepEqual(researchLinks("   "), []);
});

test("editing a lesson keeps its look-into-it boxes", async () => {
  const { EditableLessonSchema } = await import("./lesson-types");
  const parsed = EditableLessonSchema.parse({
    title: "T",
    subject: "History",
    summary: "",
    objectives: [],
    vocabulary: [],
    sections: [
      {
        heading: "H",
        body: "B",
        look_into: [{ topic: "Fourth Way", search: "Gurdjieff Fourth Way", image_query: "old book" }],
      },
    ],
    activity: { title: "", instructions: "", materials: [] },
    questions: [],
    discussion: [],
  });
  assert.equal(parsed.sections[0].look_into?.[0].topic, "Fourth Way");
});
