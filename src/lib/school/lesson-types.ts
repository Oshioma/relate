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
  "Design & Tech",
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
  "Design & Tech": "\u{1F528}",
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
    // Lessons filed before this subject was shortened still say "Design &
    // Technology". Both halves of that name are claimed by other patterns
    // below and above — "technolog" by Computing, "design" by Art & Design —
    // so it has to be matched first or those lessons quietly move subject.
    [/design\s*(&|and)\s*tech/, "Design & Tech"],
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

// ---------------------------------------------------------------------------
// Discovery categories
//
// The second way a lesson is classified, and the one a family actually browses
// by. A subject answers "where does this sit on a timetable"; a discovery
// category answers "what would we be doing". A lesson on solar ovens is Science
// by subject and Make plus Cook by what happens in the kitchen.
//
// Verbs, not departments. A closed set of eight, enforced in the database too:
// a ninth invented by a model would quietly split the one axis the library is
// browsed by, and nobody would notice until half the lessons had gone missing
// from a filter.
// ---------------------------------------------------------------------------
export const DISCOVERY_CATEGORIES = [
  { key: "make", label: "Make", icon: "\u{1F528}", blurb: "Build, craft and design" },
  { key: "explore", label: "Explore", icon: "\u{1F9ED}", blurb: "Go and find out" },
  { key: "read", label: "Read", icon: "\u{1F4D6}", blurb: "Stories, poems and books" },
  { key: "write", label: "Write", icon: "\u{270F}\u{FE0F}", blurb: "Put it into words" },
  { key: "cook", label: "Cook", icon: "\u{1F373}", blurb: "In the kitchen" },
  { key: "grow", label: "Grow", icon: "\u{1F331}", blurb: "Plants, soil and patience" },
  { key: "move", label: "Move", icon: "\u{1F3C3}", blurb: "Get outside and go" },
  { key: "help", label: "Help", icon: "\u{2764}\u{FE0F}", blurb: "Do something kind" },
] as const;

export type DiscoveryCategory = (typeof DISCOVERY_CATEGORIES)[number]["key"];

export const DISCOVERY_KEYS = DISCOVERY_CATEGORIES.map((c) => c.key) as DiscoveryCategory[];

export function isDiscoveryCategory(value: string): value is DiscoveryCategory {
  return (DISCOVERY_KEYS as string[]).includes(value);
}

export function discoveryMeta(key: string) {
  return DISCOVERY_CATEGORIES.find((c) => c.key === key);
}

// Anything unrecognised is dropped rather than shown: the column has the same
// constraint, so a stray value means data written round the app, not a category.
export function cleanDiscoveryCategories(values: readonly string[] | null | undefined): DiscoveryCategory[] {
  const seen = new Set<DiscoveryCategory>();
  for (const value of values ?? []) {
    const key = value.trim().toLowerCase();
    if (isDiscoveryCategory(key)) seen.add(key);
  }
  // Declaration order, so a card's badges never reshuffle between renders.
  return DISCOVERY_KEYS.filter((key) => seen.has(key));
}

// ---------------------------------------------------------------------------
// Duration
//
// Stored as real minutes so "we have half an hour" is a range query rather than
// string matching, and displayed as a phrase because "45 min" is what someone
// asks for and "45" is not.
// ---------------------------------------------------------------------------
export const DURATION_FILTERS = [
  { key: "quick", label: "Under 30 min", max: 29 },
  { key: "half-hour", label: "About 30 min", min: 30, max: 44 },
  { key: "hour", label: "An hour or so", min: 45, max: 89 },
  { key: "long", label: "90 min or more", min: 90 },
] as const;

export type DurationFilterKey = (typeof DURATION_FILTERS)[number]["key"];

export function matchesDuration(minutes: number | null, key: DurationFilterKey | null): boolean {
  if (!key) return true;
  // A lesson nobody has timed cannot answer "how long have we got", so it stays
  // out of the answer rather than being guessed into it.
  if (minutes == null) return false;
  const range = DURATION_FILTERS.find((d) => d.key === key);
  if (!range) return true;
  const min = "min" in range ? range.min : 0;
  const max = "max" in range ? range.max : Number.POSITIVE_INFINITY;
  return minutes >= min && minutes <= max;
}

// 15 min / 45 min / 1 hour / 90 min / 2+ hours.
export function formatDuration(minutes: number | null | undefined): string | null {
  if (minutes == null || minutes <= 0) return null;
  if (minutes < 60) return `${minutes} min`;
  if (minutes === 60) return "1 hour";
  if (minutes >= 120) return "2+ hours";
  return `${minutes} min`;
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
  discovery_categories: z
    .array(z.enum(DISCOVERY_KEYS as [DiscoveryCategory, ...DiscoveryCategory[]]))
    .min(1)
    .max(3)
    .describe(
      "One to three of these describing what a child would actually be DOING, not the school subject: make (building, crafting, designing), explore (going and finding out), read, write, cook, grow (plants and soil), move (physical activity), help (kindness and community). Pick what the activity really involves — a lesson about solar ovens where they build one is make and cook."
    ),
  duration_minutes: z
    .number()
    .int()
    .min(10)
    .max(180)
    .describe(
      "Realistic minutes for one sitting of this lesson with a child, including the activity. Use a round number: 15, 30, 45, 60, 90 or 120."
    ),
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
//
// The two classification fields the writer returns live in COLUMNS, not in the
// document: staff can override them, and a second copy in the jsonb would go
// stale the moment they did. So they are omitted here, and stripped on the way
// in — see storableLesson below.
export type StoredLesson = Omit<
  Lesson,
  "sections" | "discovery_categories" | "duration_minutes"
> & {
  // The lesson's own picture, shown on its card before it is opened.
  cover?: LessonImage | null;
  sections: (Lesson["sections"][number] & {
    image?: LessonImage | null;
  })[];
};

// A freshly written lesson, minus the fields that become columns.
export function storableLesson(lesson: Lesson): StoredLesson {
  const document: Record<string, unknown> = { ...lesson };
  delete document.discovery_categories;
  delete document.duration_minutes;
  return document as unknown as StoredLesson;
}

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

// What a person may hand-edit, and what the server accepts back.
//
// Deliberately NOT LessonSchema. That one is the contract sent to Claude: its
// field descriptions are prompt text, and parsing an edit through it would
// strip `image` and `cover` — every picture on the lesson — because zod drops
// keys a schema doesn't declare. It also requires image_query and
// cover_image_query, which the model writes and a person never touches, so a
// lesson saved before those existed could never be edited again.
//
// So this accepts the stored shape instead: pictures declared and therefore
// preserved, model-only search phrases optional, and no field descriptions
// because nothing here is talking to a model.
const LessonImageSchema = z.object({
  url: z.string(),
  thumbUrl: z.string(),
  title: z.string(),
  creator: z.string(),
  license: z.string(),
  sourceName: z.string(),
  sourceUrl: z.string(),
});

export const EditableLessonSchema = z.object({
  title: z.string(),
  // Free text on the way in; normaliseSubject pins it to a known subject.
  subject: z.string(),
  summary: z.string(),
  objectives: z.array(z.string()),
  vocabulary: z.array(z.object({ word: z.string(), meaning: z.string() })),
  sections: z.array(
    z.object({
      heading: z.string(),
      body: z.string(),
      image_query: z.string().optional().default(""),
      image: LessonImageSchema.nullish(),
    })
  ),
  activity: z.object({
    title: z.string(),
    instructions: z.string(),
    materials: z.array(z.string()),
  }),
  questions: z.array(z.object({ question: z.string(), answer: z.string() })),
  discussion: z.array(z.string()),
  cover_image_query: z.string().optional().default(""),
  cover: LessonImageSchema.nullish(),
  // Optional here, unlike in LessonSchema: lessons written before these
  // existed have neither, and must stay editable.
  discovery_categories: z.array(z.string()).optional(),
  duration_minutes: z.number().int().nullish(),
});

// Some lessons carry the literal six characters \u2014 where an em dash
// belongs, and read as "the source clip \u2014 that certain cities sit". It is a
// JSON escape that went through one encoding too many somewhere upstream — an
// export, a copy-paste, a model writing the escape instead of the character —
// and by the time it is in the column the damage is done.
//
// Decoding on the way out fixes every lesson already stored, in the library, on
// the page, in the printed copy and in the editor, without a data migration.
// Saving an edit then writes the clean text back.
const STRAY_ESCAPE = /\\u([0-9a-fA-F]{4})/g;

function decodeStrayEscapes(text: string): string {
  // The overwhelming majority of lesson text has none of these.
  if (!text.includes("\\u")) return text;
  return text.replace(STRAY_ESCAPE, (whole, hex: string) => {
    const code = Number.parseInt(hex, 16);
    return Number.isFinite(code) ? String.fromCharCode(code) : whole;
  });
}

// Walks the document applying it to every string, whatever shape the lesson is.
function decodeDeep(value: unknown): unknown {
  if (typeof value === "string") return decodeStrayEscapes(value);
  if (Array.isArray(value)) return value.map(decodeDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, decodeDeep(v)])
    );
  }
  return value;
}

// The picture that stands for a lesson in the library. A lesson whose cover
// search came back empty often still has a picture inside it, so fall back to
// the first section that found one rather than showing a blank card.
export function lessonThumbnail(lesson: StoredLesson | undefined): LessonImage | null {
  if (!lesson) return null;
  if (lesson.cover) return lesson.cover;
  return (lesson.sections ?? []).find((section) => section.image)?.image ?? null;
}

// A space_lessons row with its jsonb document narrowed to StoredLesson.
// The generated Database type carries `lesson` as unknown, because the shape
// lives here rather than in the schema — this is where the two meet.
// Who wrote a lesson, joined from profiles. Optional because not every read
// needs it — the lesson page has it, a bare row fetch may not.
export type LessonAuthor = {
  full_name: string | null;
  username: string;
  avatar_url: string | null;
} | null;

export type LessonRow = Omit<SpaceLesson, "lesson"> & {
  lesson: StoredLesson;
  creator?: LessonAuthor;
  // Set when the viewer has saved this one. Absent on reads that don't ask.
  saved?: boolean;
};

// What to call whoever wrote a lesson. Their name if they have set one, else
// their username; a lesson whose author has since been deleted still has to
// say something rather than render a gap.
export function providerName(row: { creator?: LessonAuthor }): string {
  return row.creator?.full_name?.trim() || row.creator?.username?.trim() || "Unknown";
}

// Narrows a raw row from the database. The document is trusted: it was written
// through LessonSchema on the way in, so this is a type assertion rather than a
// re-validation — a lesson saved by an older schema version still renders,
// with the newer fields simply absent.
export function toLessonRow(row: SpaceLesson & { creator?: LessonAuthor }): LessonRow {
  return { ...row, lesson: decodeDeep(row.lesson ?? {}) as StoredLesson };
}

// Guard rails on the pasted material. Below the minimum there isn't enough
// to teach from; above the maximum we'd be sending a novel to the model.
export const MIN_SOURCE_CHARS = 80;
export const MAX_SOURCE_CHARS = 40000;

// Past this, a lesson takes long enough that the wait is worth mentioning
// before someone starts it. Still allowed — just not instant.
export const LONG_SOURCE_CHARS = 30000;
