"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { formatDuration, lessonThumbnail, type LessonRow } from "@/lib/school/lesson-types";

// What this person has put aside, in the side rail.
//
// The data is already on the page — every card knows whether the viewer saved
// it — so this is a second view of it, not a second query. It exists because
// the Saved filter chip is a thing you have to know to look for, and a
// reading list you cannot see is a reading list you forget you have.
//
// A save is private (see the lesson_saves migration), so this only ever shows
// the viewer's own, and it renders nothing at all when there are none: an
// empty "Saved" panel explaining what saving is would be an advertisement.

const MAX_SHOWN = 4;

export function SavedLessonsPanel({
  lessons,
  communitySlug,
  spaceSlug,
}: {
  lessons: LessonRow[];
  communitySlug: string;
  spaceSlug: string;
}) {
  const saved = lessons.filter((lesson) => lesson.saved);
  if (saved.length === 0) return null;

  const shown = saved.slice(0, MAX_SHOWN);

  return (
    <section aria-labelledby="saved-lessons" className="rounded-2xl bg-card p-4">
      <h2
        id="saved-lessons"
        className="flex items-center gap-2 text-sm font-semibold text-foreground"
      >
        <Bookmark className="h-4 w-4 fill-accent text-accent" />
        Saved
        <span className="font-normal text-muted-foreground">{saved.length}</span>
      </h2>

      <ul className="mt-2.5 space-y-1">
        {shown.map((lesson) => {
          const image = lessonThumbnail(lesson.lesson);
          const duration = formatDuration(lesson.duration_minutes);
          return (
            <li key={lesson.id}>
              <Link
                href={`/c/${communitySlug}/spaces/${spaceSlug}/lessons/${lesson.id}`}
                className="group flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-muted"
              >
                {image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={image.thumbUrl}
                    alt=""
                    loading="lazy"
                    className="h-9 w-9 shrink-0 rounded-lg bg-muted object-cover"
                  />
                ) : (
                  <span aria-hidden className="h-9 w-9 shrink-0 rounded-lg bg-muted" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium leading-snug text-foreground">
                    {lesson.title || "Untitled lesson"}
                  </span>
                  {duration && (
                    <span className="block text-[11px] text-muted-foreground">{duration}</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {saved.length > shown.length && (
        <p className="mt-2 px-1.5 text-[11px] text-muted-foreground">
          {saved.length - shown.length} more — use the Saved filter to see them all.
        </p>
      )}
    </section>
  );
}
