// Shared types for Lessons spaces (space_type = 'lessons').
//
// The lesson shape is defined once as a Zod schema and reused in three
// places: as the structured-output contract sent to Claude, as the runtime
// validator for what comes back, and as the TypeScript type the UI renders.
//
// Pure data and pure functions only — no server-only imports — so the space
// view and the lesson composer can both read the age bands and subjects on
// the client.

import { z } from "zod";
import type { SpaceLesson } from "@/types/database";

// Age bands lessons are filed under. Each generated lesson is written for
// exactly one band and shows its badge in the UI.
export const AGE_BANDS = [
  {
    key: "5-7",
    label: "Ages 5–7",
    reading: "5 to 7 year olds",
    guidance:
      "Very short sentences. Everyday words only. Lots of repetition and " +
      "familiar comparisons — a house, a pet, the playground. Explain anything " +
      "beyond the most common vocabulary.",
    tint: "border-border bg-muted text-muted-foreground",
  },
  {
    key: "8-10",
    label: "Ages 8–10",
    reading: "8 to 10 year olds",
    guidance:
      "Short sentences, one idea each. Concrete examples over abstractions. " +
      "Explain any word a child of this age would not already know.",
    tint: "border-border bg-accent-soft text-accent",
  },
  {
    key: "11-13",
    label: "Ages 11–13",
    reading: "11 to 13 year olds",
    guidance:
      "Fuller sentences and proper subject vocabulary, defined on first use. " +
      "You can introduce causes, consequences and comparisons rather than " +
      "only describing. Do not talk down to them.",
    tint: "border-border bg-muted text-foreground",
  },
] as const;

export type AgeBandKey = (typeof AGE_BANDS)[number]["key"];

export const AGE_BAND_KEYS: AgeBandKey[] = AGE_BANDS.map((b) => b.key);

export const DEFAULT_AGE_BAND: AgeBandKey = "8-10";

export function isAgeBandKey(value: string): value is AgeBandKey {
  return (AGE_BAND_KEYS as string[]).includes(value);
}

export function ageBandLabel(key: string): string {
  return AGE_BANDS.find((b) => b.key === key)?.label ?? key;
}

export function ageBandTint(key: string): string {
  return (
    AGE_BANDS.find((b) => b.key === key)?.tint ??
    "border-border bg-muted text-muted-foreground"
  );
}

// Subjects lessons are filed under. This is a closed list on purpose: the
// model picks from it, so lessons group reliably instead of scattering
// across "Science", "science" and "Natural Sciences".
export const SUBJECTS = [
  "Literature",
  "English",
  "Maths",
  "Science",
  "History",
  "Geography",
  "Music",
  "Art & Design",
  "Computing",
  "Design & Technology",
  "Languages",
  "PE & Health",
  "Religion & Ethics",
  "Life Skills",
  "Other",
] as const;

export type Subject = (typeof SUBJECTS)[number];

// Icons keep the subject headings scannable at a glance.
export const SUBJECT_ICONS: Record<Subject, string> = {
  Literature: "\u{1F4D6}",
  English: "\u{270D}\u{FE0F}",
  Maths: "\u{1F522}",
  Science: "\u{1F52C}",
  History: "\u{1F3DB}\u{FE0F}",
  Geography: "\u{1F30D}",
  Music: "\u{1F3B5}",
  "Art & Design": "\u{1F3A8}",
  Computing: "\u{1F4BB}",
  "Design & Technology": "\u{1F528}",
  Languages: "\u{1F5E3}\u{FE0F}",
  "PE & Health": "\u{26BD}",
  "Religion & Ethics": "\u{1F54A}\u{FE0F}",
  "Life Skills": "\u{1F331}",
  Other: "\u{1F4DA}",
};

export function isSubject(value: string): value is Subject {
  return (SUBJECTS as readonly string[]).includes(value);
}

// Lessons saved before the list was closed hold free text. Match them to a
// known subject where we can, and file the rest under Other so nothing
// disappears from the page.
export function normaliseSubject(value: string): Subject {
  const trimmed = value.trim();
  if (isSubject(trimmed)) return trimmed;

  const lowered = trimmed.toLowerCase();
  const match = SUBJECTS.find((s) => s.toLowerCase() === lowered);
  if (match) return match;

  // Free text the model wrote before the list was closed. Patterns anchor at
  // a word start but not its end, so "science" also catches "sciences" and
  // "scientific". Order matters: "English Literature" should land under
  // Literature, so that test runs first.
  const patterns: [RegExp, Subject][] = [
    [/\b(literatur|poem|poetr|novel|stor(y|ies)|book|reading)/, "Literature"],
    [/\b(english|grammar|spelling|writing|language art)/, "English"],
    [/\b(math|number|arithmetic|algebra|geometr|fraction)/, "Maths"],
    [/\b(scien|biolog|chemis|physic|nature|space|astronom|planet)/, "Science"],
    [/\b(histor|ancient|civilis|civiliz|empire)|\bwar\b/, "History"],
    [/\b(geograph|continent|countr|climate|volcano|river|weather)/, "Geography"],
    [/\b(music|song|rhythm|instrument|compos)/, "Music"],
    [/\b(comput|coding|program|software|technolog|robot)/, "Computing"],
    [/\b(art|draw|paint|sculpt|design)/, "Art & Design"],
    [/\b(sport|exercise|fitness|health|nutrition)|\bp\.?e\.?\b|physical education/, "PE & Health"],
    [/\b(religio|faith|ethic|moral|belief)/, "Religion & Ethics"],
    [/\b(french|spanish|german|italian|mandarin|latin|foreign language)/, "Languages"],
  ];

  for (const [pattern, subject] of patterns) {
    if (pattern.test(lowered)) return subject;
  }

  return "Other";
}

// The lesson Claude writes. Field descriptions are part of the prompt the
// model sees, so they carry the age-appropriateness instructions.
export const LessonSchema = z.object({
  title: z
    .string()
    .describe("A short, engaging lesson title a child would find inviting."),
  subject: z
    .enum(SUBJECTS)
    .describe(
      "The school subject this belongs under. Pick the closest match from the list; use Other only when nothing fits."
    ),
  summary: z
    .string()
    .describe(
      "Two or three sentences describing what this lesson covers, written for the adult teaching it."
    ),
  objectives: z
    .array(z.string())
    .describe(
      "Three to five things the child will be able to do by the end, each starting with a verb."
    ),
  vocabulary: z
    .array(
      z.object({
        word: z.string(),
        meaning: z
          .string()
          .describe("A plain-language definition a child of this age understands."),
      })
    )
    .describe("Four to eight key words from the material with child-friendly meanings."),
  sections: z
    .array(
      z.object({
        heading: z.string(),
        body: z
          .string()
          .describe(
            "Two or three short paragraphs explaining this part, spoken directly to the child in simple, warm language. Short sentences. Concrete examples."
          ),
        image_query: z
          .string()
          .describe(
            "Two to four plain words naming a concrete thing to show a child alongside this section, used to search a photo library. Name a physical object, place, animal or scene — 'erupting volcano', 'Roman aqueduct', 'violin close up'. Never a person by name, never an abstract idea."
          ),
      })
    )
    .describe("Three to five teaching sections that build on each other."),
  activity: z.object({
    title: z.string(),
    instructions: z
      .string()
      .describe("A hands-on activity the child can do, written as steps they can follow."),
    materials: z
      .array(z.string())
      .describe("Everyday items needed. Use an empty list if none are required."),
  }),
  questions: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string().describe("The answer, with a one-line explanation."),
      })
    )
    .describe("Five comprehension questions that check the objectives, easiest first."),
  cover_image_query: z
    .string()
    .describe(
      "Two to four plain words naming the single most recognisable thing this whole lesson is about, used to find a cover picture. A physical object, place, animal or scene — never an abstract idea or a named person."
    ),
  discussion: z
    .array(z.string())
    .describe("Two or three open questions to talk about together — no single right answer."),
});

export type Lesson = z.infer<typeof LessonSchema>;

// A picture found for a section, with everything needed to credit it.
export type LessonImage = {
  url: string;
  thumbUrl: string;
  title: string;
  creator: string;
  license: string;
  sourceName: string;
  sourceUrl: string;
};

// What actually gets stored: the written lesson plus any images resolved
// for its sections. Images are optional throughout — a lesson saved before
// this existed, or one where every image source was unreachable, is still
// a complete lesson.
export type StoredLesson = Omit<Lesson, "sections"> & {
  // The lesson's own picture, shown on its card before it is opened.
  cover?: LessonImage | null;
  sections: (Lesson["sections"][number] & {
    image?: LessonImage | null;
  })[];
};

// Everything a lesson can be matched on when searching. Kept here so the
// search box and any future filter agree on what counts as a match.
export function lessonSearchText(row: LessonRow): string {
  const lesson = row.lesson;
  return [
    row.title,
    row.subject,
    row.age_band,
    lesson.summary,
    ...(lesson.objectives ?? []),
    ...(lesson.vocabulary ?? []).flatMap((v) => [v.word, v.meaning]),
    ...(lesson.sections ?? []).flatMap((s) => [s.heading, s.body]),
    lesson.activity?.title,
    ...(lesson.questions ?? []).map((q) => q.question),
    ...(lesson.discussion ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

// A space_lessons row with its jsonb document narrowed to StoredLesson.
// The generated Database type carries `lesson` as unknown, because the shape
// lives here rather than in the schema — this is where the two meet.
export type LessonRow = Omit<SpaceLesson, "lesson"> & { lesson: StoredLesson };

// Narrows a raw row from the database. The document is trusted: it was written
// through LessonSchema on the way in, so this is a type assertion rather than a
// re-validation — a lesson saved by an older schema version still renders,
// with the newer fields simply absent.
export function toLessonRow(row: SpaceLesson): LessonRow {
  return { ...row, lesson: (row.lesson ?? {}) as StoredLesson };
}

// Guard rails on the pasted material. Below the minimum there isn't enough
// to teach from; above the maximum we'd be sending a novel to the model.
export const MIN_SOURCE_CHARS = 80;
export const MAX_SOURCE_CHARS = 40000;

// Past this, a lesson takes long enough that the wait is worth mentioning
// before someone starts it. Still allowed — just not instant.
export const LONG_SOURCE_CHARS = 30000;
