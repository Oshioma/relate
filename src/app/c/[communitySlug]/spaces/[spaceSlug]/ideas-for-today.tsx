"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import {
  discoveryMeta,
  formatDuration,
  lessonThumbnail,
  type LessonRow,
} from "@/lib/school/lesson-types";

// "What could we do today?" — answered with lessons that actually exist.
//
// This is deliberately not a recommendation engine. The product has no
// completion history, no structured child ages (the homeschool template asks
// for them as free text, which is not something to plan a day around) and no
// ratings, so there is nothing to learn from. Inventing a score out of data the
// database does not hold would produce confident nonsense.
//
// What it does instead is pick a varied few from what the viewer can already
// see, and rotate them daily so the panel is not the same three lessons every
// morning.

const IDEA_COUNT = 3;

// Stable per lesson per day. Rotating on render would reshuffle the panel on
// every keystroke in the search box; rotating on nothing would make it
// wallpaper. A cheap string hash is plenty — this orders three cards, it is not
// cryptography.
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

export function pickIdeas(lessons: LessonRow[], now: Date, count = IDEA_COUNT): LessonRow[] {
  const seed = dayNumber(now);
  const ordered = [...lessons].sort((a, b) => seededRank(a.id, seed) - seededRank(b.id, seed));

  const picked: LessonRow[] = [];
  const usedCategories = new Set<string>();
  const usedDurations = new Set<number | null>();

  // First pass: prefer variety. A morning of three writing lessons all lasting
  // an hour is not a choice, it is the same suggestion three times.
  for (const lesson of ordered) {
    if (picked.length >= count) break;
    const category = lesson.discovery_categories?.[0] ?? null;
    const bucket = lesson.duration_minutes;
    if (category && usedCategories.has(category)) continue;
    if (usedDurations.has(bucket)) continue;
    picked.push(lesson);
    if (category) usedCategories.add(category);
    usedDurations.add(bucket);
  }

  // Second pass: fill up. A small library will not have three distinct
  // categories, and showing two ideas because the third was too similar helps
  // nobody.
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
}: {
  lessons: LessonRow[];
  communitySlug: string;
  spaceSlug: string;
}) {
  // Recomputed only when the library changes, not on every filter keystroke —
  // the ideas are about the whole library, not the current search.
  const ideas = useMemo(() => pickIdeas(lessons, new Date()), [lessons]);

  if (ideas.length === 0) return null;

  return (
    <section
      aria-labelledby="ideas-for-today"
      className="rounded-2xl bg-accent-soft/60 p-4 sm:p-5"
    >
      <h2
        id="ideas-for-today"
        className="flex items-center gap-2 text-sm font-semibold text-foreground"
      >
        <Sparkles className="h-4 w-4 text-accent" />
        Ideas for today
      </h2>

      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {ideas.map((lesson) => {
          const image = lessonThumbnail(lesson.lesson);
          const duration = formatDuration(lesson.duration_minutes);
          const category = discoveryMeta(lesson.discovery_categories?.[0] ?? "");

          return (
            <li key={lesson.id}>
              <Link
                href={`/c/${communitySlug}/spaces/${spaceSlug}/lessons/${lesson.id}`}
                className="group flex items-center gap-3 rounded-xl bg-card/80 p-2.5 transition-colors hover:bg-card"
              >
                {image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={image.thumbUrl}
                    alt=""
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-lg bg-muted object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-lg"
                  >
                    {category?.icon ?? "\u{1F4DA}"}
                  </span>
                )}

                <span className="min-w-0 flex-1">
                  {duration && (
                    <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {duration}
                    </span>
                  )}
                  <span className="block truncate text-sm font-medium text-foreground group-hover:text-accent">
                    {lesson.title || "Untitled lesson"}
                  </span>
                </span>

                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
