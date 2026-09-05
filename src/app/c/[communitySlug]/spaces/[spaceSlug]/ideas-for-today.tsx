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
    <section aria-labelledby="ideas-for-today">
      <div className="flex items-baseline justify-between gap-3">
        <h2
          id="ideas-for-today"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          <Sparkles className="h-4.5 w-4.5 text-accent" />
          Ideas for today
        </h2>
        <p className="hidden text-sm text-muted-foreground sm:block">
          Three from the library, picked fresh each morning
        </p>
      </div>

      {/* Each idea is a real lesson with its own picture, big enough to want.
          The compact rows this replaced looked like search results — the point
          of the panel is to make somebody think "oh, we could do that". */}
      {/* On a phone these are a swipeable row, not a stack: three full-width
          cards put the library itself three screens down, which is the
          opposite of what a panel of suggestions is for. From tablet up there
          is room for all three at once. */}
      <ul className="-mx-4 mt-3.5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
        {ideas.map((lesson) => {
          const image = lessonThumbnail(lesson.lesson);
          const duration = formatDuration(lesson.duration_minutes);
          const category = discoveryMeta(lesson.discovery_categories?.[0] ?? "");

          return (
            <li key={lesson.id} className="w-[78%] shrink-0 snap-start sm:w-auto sm:shrink">
              <Link
                href={`/c/${communitySlug}/spaces/${spaceSlug}/lessons/${lesson.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-accent-soft/70 transition-colors hover:bg-accent-soft"
              >
                <span className="relative block h-28 w-full overflow-hidden sm:h-32">
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

                <span className="flex flex-1 flex-col p-3.5 sm:p-4">
                  {category && (
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                      <span aria-hidden>{category.icon} </span>
                      {category.label}
                    </span>
                  )}
                  {/* Two lines, wrapped — a truncated title is exactly the
                      "database result" feel this is meant to lose. */}
                  <span className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
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
