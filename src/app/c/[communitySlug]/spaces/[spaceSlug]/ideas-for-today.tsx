"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import {
  discoveryMeta,
  formatDuration,
  lessonThumbnail,
  primaryCategory,
  type LessonRow,
} from "@/lib/school/lesson-types";

// "What could we do today?" — answered with lessons that actually exist.
//
// This is deliberately not a recommendation engine. The product has no
// completion history, no ratings and no structured record of a particular
// child's age, so there is nothing to learn from and no per-family signal to
// personalise with. Inventing a score out of data the database does not hold
// would produce confident nonsense.
//
// What it CAN do is judge a lesson on its own merits against the question
// being asked, which is not "which lessons are good" but "which of these could
// we actually start this morning". That is what ideaScore below measures:
// whether there is a thing to DO, whether anybody knows how long it takes,
// whether it fits in a morning, and whether it is the kind of thing you would
// get out of a chair for. Then it insists the three between them are not all
// the same kind of afternoon.
//
// The one piece of real age data available is the community's own default age
// band, set by its school kind — a nursery's library should not open on a
// lesson pitched at thirteen-year-olds. It is a preference, not a filter: a
// small library would otherwise have nothing to suggest.

const IDEA_COUNT = 3;

// How much a kind of activity feels like something you could go and do today.
// Not a judgement about which lessons matter — a judgement about which ones
// answer "what shall we do this morning" rather than "what shall we cover this
// term". Reading and writing still appear; they just do not crowd out the
// other six, which is exactly the WRITE-heavy panel this is fixing.
const DOABLE_WEIGHT: Record<string, number> = {
  cook: 5,
  make: 5,
  grow: 5,
  explore: 5,
  move: 4,
  help: 4,
  read: 2,
  write: 2,
};

export function ideaScore(lesson: LessonRow, preferredAgeBand: string | null): number {
  let score = 0;

  // A thing to DO. Without one a lesson is reading material, which is a fine
  // lesson and a poor answer to "what could we do today".
  const activity = lesson.lesson?.activity;
  if (activity?.title) score += 4;
  if (activity?.instructions) score += 2;

  // Somebody has to be able to say yes to it before lunch.
  const minutes = lesson.duration_minutes;
  if (minutes != null) {
    score += 2;
    if (minutes <= 60) score += 3;
    else if (minutes <= 90) score += 1;
    else score -= 2; // A two-hour lesson is a plan, not an idea.
  }

  const [primary, ...rest] = lesson.discovery_categories ?? [];
  if (primary) score += (DOABLE_WEIGHT[primary] ?? 0) * 2;
  for (const key of rest) score += DOABLE_WEIGHT[key] ?? 0;
  // Unclassified means nothing is known about what it involves. Not excluded —
  // a young library is mostly unclassified — but it does not lead.
  if (!primary) score -= 3;

  // The community's own age band, where it has one.
  if (preferredAgeBand && lesson.age_band === preferredAgeBand) score += 3;

  // A picture is most of why a suggestion is tempting.
  if (lessonThumbnail(lesson.lesson)) score += 2;

  return score;
}

// Stable per lesson per day. This is what "picked fresh each morning" means
// literally: the seed is the local calendar day, so a refresh, a keystroke in
// the search box or a second visit after lunch all produce the same three, and
// tomorrow produces different ones. No stored state, nothing to migrate, and
// no server round-trip — the same input gives the same answer everywhere.
function seededRank(id: string, daySeed: number): number {
  let hash = daySeed;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Local calendar day. Two families in different timezones getting different
// ideas on the same date is fine; a panel that changes at 1am is not.
function dayNumber(now: Date): number {
  return Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 86_400_000
  );
}

// Coarse buckets, so "45 min" and "60 min" count as the same shape of morning
// and the three ideas are not all hour-long.
function durationBucket(minutes: number | null): string {
  if (minutes == null) return "unknown";
  if (minutes < 30) return "quick";
  if (minutes < 60) return "half";
  if (minutes < 90) return "hour";
  return "long";
}

export function pickIdeas(
  lessons: LessonRow[],
  now: Date,
  preferredAgeBand: string | null = null,
  count = IDEA_COUNT
): LessonRow[] {
  const seed = dayNumber(now);

  // Score first, the day's shuffle as the tie-break. So the panel rotates among
  // the lessons that answer the question, rather than among all of them.
  const ordered = lessons
    .map((lesson) => ({ lesson, score: ideaScore(lesson, preferredAgeBand) }))
    .sort(
      (a, b) =>
        b.score - a.score || seededRank(a.lesson.id, seed) - seededRank(b.lesson.id, seed)
    )
    .map((entry) => entry.lesson);

  const picked: LessonRow[] = [];
  const usedCategories = new Set<string>();
  const usedBuckets = new Set<string>();

  // First pass: variety. A morning of three writing lessons all lasting an
  // hour is not a choice, it is the same suggestion three times.
  for (const lesson of ordered) {
    if (picked.length >= count) break;
    const category = primaryCategory(lesson);
    const bucket = durationBucket(lesson.duration_minutes);
    if (category && usedCategories.has(category)) continue;
    if (usedBuckets.has(bucket)) continue;
    picked.push(lesson);
    if (category) usedCategories.add(category);
    usedBuckets.add(bucket);
  }

  // Second pass: fill up, best-scoring first. A small library will not have
  // three distinct categories, and showing two ideas because the third was too
  // similar helps nobody. Variety is a preference, never a requirement — and
  // nothing here invents a lesson to satisfy it.
  for (const lesson of ordered) {
    if (picked.length >= count) break;
    if (picked.some((p) => p.id === lesson.id)) continue;
    picked.push(lesson);
  }

  return picked;
}

export function IdeasForToday({
  lessons,
  communitySlug,
  spaceSlug,
  preferredAgeBand = null,
}: {
  lessons: LessonRow[];
  communitySlug: string;
  spaceSlug: string;
  // The community's own default age band, from its school kind. A preference
  // in the score, never a filter — a small library would otherwise run out of
  // things to suggest.
  preferredAgeBand?: string | null;
}) {
  // Recomputed only when the library changes, not on every filter keystroke —
  // the ideas are about the whole library, not the current search.
  const ideas = useMemo(
    () => pickIdeas(lessons, new Date(), preferredAgeBand),
    [lessons, preferredAgeBand]
  );


  if (ideas.length === 0) return null;

  return (
    <section aria-labelledby="ideas-for-today">
      <div className="flex items-baseline justify-between gap-3">
        <h2
          id="ideas-for-today"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground sm:text-xl rail:text-base!"
        >
          <Sparkles className="h-4.5 w-4.5 text-accent" />
          Ideas for today
        </h2>
        {/* Beside the heading while the panel is the width of the page. */}
        <p className="hidden text-sm text-muted-foreground sm:block rail:hidden!">
          Three from the library, picked fresh each morning
        </p>
      </div>
      {/* And under it in the rail, where there is no room for both on one line
          — but it is the sentence that says what the panel is, so it stays. */}
      <p className="mt-1 hidden text-xs leading-relaxed text-muted-foreground rail:block">
        Three from the library, picked fresh each morning
      </p>

      {/* Each idea is a real lesson with its own picture, big enough to want.
          The compact rows this replaced looked like search results — the point
          of the panel is to make somebody think "oh, we could do that". */}
      {/* On a phone these are a swipeable row, not a stack: three full-width
          cards put the library itself three screens down, which is the
          opposite of what a panel of suggestions is for. From tablet up there
          is room for all three at once. */}
      {/* Swipeable on a phone, three across from tablet up, and one per row
          once the panel is a 304px rail — three cards across a rail would be
          three slivers. The CARD is identical throughout; only the
          arrangement changes. */}
      <ul className="-mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 rail:grid-cols-1! rail:gap-3">
        {ideas.map((lesson) => {
          const image = lessonThumbnail(lesson.lesson);
          const duration = formatDuration(lesson.duration_minutes);
          const category = discoveryMeta(primaryCategory(lesson) ?? "");

          return (
            <li key={lesson.id} className="w-[78%] shrink-0 snap-start sm:w-auto sm:shrink">
              <Link
                href={`/c/${communitySlug}/spaces/${spaceSlug}/lessons/${lesson.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-accent-soft/70 transition-colors hover:bg-accent-soft"
              >
                <span className="relative block h-24 w-full overflow-hidden sm:h-28 rail:h-20!">
                  {image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={image.thumbUrl}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-full w-full items-center justify-center bg-card/60 text-3xl"
                    >
                      {category?.icon ?? "\u{1F4DA}"}
                    </span>
                  )}
                  {duration && (
                    <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                      {duration}
                    </span>
                  )}
                </span>

                <span className="flex flex-1 flex-col px-3.5 py-3 sm:px-4">
                  {category && (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                      <span aria-hidden>{category.icon} </span>
                      {category.label}
                    </span>
                  )}
                  {/* Two lines, wrapped — a truncated title is exactly the
                      "database result" feel this is meant to lose.

                      One colour, always. It used to turn accent on hover,
                      which meant the hovered card's title was green and the
                      other two were not — a difference that looked like it
                      meant something (saved? visited?) and meant nothing. The
                      card already lightens its background on hover and the
                      "Have a look" line is already accent, so the affordance
                      is not lost. Title colour is now free to mean something
                      later, deliberately. */}
                  <span className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
                    {lesson.title || "Untitled lesson"}
                  </span>
                  <span className="mt-auto flex items-center gap-1 pt-2.5 text-xs font-medium text-accent">
                    Have a look
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
