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
    <section
      aria-labelledby="ideas-for-today"
      className="overflow-hidden rounded-2xl bg-card p-4 sm:p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2
          id="ideas-for-today"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground"
        >
          <Sparkles className="h-4 w-4 text-accent" />
          Ideas for today
        </h2>
        {/* The library is on this same page, so "see all" is a jump down to
            it rather than a route — there is no separate ideas page to send
            anybody to, and inventing one would be a link that lies. */}
        <a
          href="#lessons-library"
          className="shrink-0 text-sm font-medium text-accent hover:underline"
        >
          See all
        </a>
      </div>

      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
        Three from the library, picked fresh each morning
      </p>

      {/* Rows, not cards. A picture, how long it takes, and the title — the
          three things somebody deciding needs, in the space one picture card
          used to take.

          Stacked on a phone and in the rail, where a row is the right shape.
          Three abreast in between, because a full-page-width row leaves the
          title stranded halfway across the card with its chevron a hand-span
          away. Same row either way; only the arrangement changes. */}
      <ul className="mt-3 grid grid-cols-1 gap-x-6 sm:grid-cols-3 rail:grid-cols-1!">
        {ideas.map((lesson) => {
          const image = lessonThumbnail(lesson.lesson);
          const duration = formatDuration(lesson.duration_minutes);
          const category = discoveryMeta(primaryCategory(lesson) ?? "");

          return (
            <li
              key={lesson.id}
              // A hairline between rows when they are stacked, so the three
              // read as one list; nothing between them when they are abreast,
              // where the gap already separates them.
              className="border-t border-border/60 first:border-t-0 sm:border-t-0 rail:border-t! rail:first:border-t-0!"
            >
              <Link
                href={`/c/${communitySlug}/spaces/${spaceSlug}/lessons/${lesson.id}`}
                className="group flex items-center gap-3 py-2.5 transition-opacity hover:opacity-80"
              >
                {image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={image.thumbUrl}
                    alt=""
                    loading="lazy"
                    className="h-14 w-14 shrink-0 rounded-xl bg-muted object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-xl"
                  >
                    {category?.icon ?? "\u{1F4DA}"}
                  </span>
                )}

                <span className="min-w-0 flex-1">
                  {duration && (
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      {duration}
                    </span>
                  )}
                  {/* Two lines, wrapped. One colour, always — it used to turn
                      accent on hover, which made the hovered row look like it
                      meant something (saved? visited?) and meant nothing. */}
                  <span className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-foreground">
                    {lesson.title || "Untitled lesson"}
                  </span>
                </span>

                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
