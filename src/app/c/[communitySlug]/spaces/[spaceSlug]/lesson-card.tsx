"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Bookmark, EyeOff } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { LessonThumbnail } from "./lesson-document";
import { toggleLessonSave, type LessonActionState } from "./lessons-actions";
import { cn } from "@/lib/utils";
import {
  ageBandLabel,
  discoveryMeta,
  formatDuration,
  normaliseSubject,
  providerName,
  type LessonRow,
} from "@/lib/school/lesson-types";

// One lesson, as a card with its picture doing real work.
//
// Deliberately NOT a single wrapping <Link>: the card carries a save button and
// a start link, and an interactive control inside an anchor is invalid and
// unusable with a keyboard. The title and the picture link; everything else is
// its own control.
//
// The picture is the reason this is a card rather than the row it replaced. A
// row put a 20px thumbnail beside a sentence; a library of things to DO is
// browsed by the look of them.
export function LessonCard({
  lesson,
  href,
  communitySlug,
  spaceSlug,
  canSave,
}: {
  lesson: LessonRow;
  href: string;
  communitySlug: string;
  spaceSlug: string;
  // Signed-in members only. A guest reading a public library has nowhere to
  // save to, and a disabled bookmark is worse than none.
  canSave: boolean;
}) {
  const [saveState, saveAction, saving] = useActionState<LessonActionState, FormData>(
    toggleLessonSave,
    undefined
  );

  const subject = normaliseSubject(lesson.subject);
  const duration = formatDuration(lesson.duration_minutes);
  const categories = (lesson.discovery_categories ?? [])
    .map(discoveryMeta)
    .filter((c): c is NonNullable<ReturnType<typeof discoveryMeta>> => Boolean(c));

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/50 transition-shadow hover:shadow-md">
      <Link href={href} className="relative block" tabIndex={-1} aria-hidden>
        <LessonThumbnail
          lesson={lesson.lesson}
          subject={lesson.subject}
          className="h-44 w-full sm:h-48"
        />
        {duration && (
          <span className="absolute right-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            {duration}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {subject}
          <span aria-hidden> &middot; </span>
          {ageBandLabel(lesson.age_band)}
        </p>

        {/* The title gets the whole width of the card and wraps to as many
            lines as it needs. Truncating a lesson title is worse than an
            uneven card: the title is the thing being scanned. */}
        <h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight text-foreground">
          <Link href={href} className="transition-colors hover:text-accent">
            {lesson.title || "Untitled lesson"}
          </Link>
        </h3>

        {lesson.lesson?.summary && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {lesson.lesson.summary}
          </p>
        )}

        {categories.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <li
                key={category.key}
                className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
              >
                <span aria-hidden>{category.icon}</span>
                {category.label}
              </li>
            ))}
          </ul>
        )}

        {/* Pushed to the bottom so cards of different title lengths still line
            their actions up with each other. */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="flex min-w-0 items-center gap-2">
            <Avatar
              src={lesson.creator?.avatar_url ?? null}
              name={providerName(lesson)}
              size={24}
            />
            <span className="min-w-0 truncate text-xs text-muted-foreground">
              {providerName(lesson)}
            </span>
            {!lesson.is_public && (
              <span
                className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground"
                title="Only you and staff can see this"
              >
                <EyeOff className="h-3 w-3" />
              </span>
            )}
          </span>

          <span className="flex shrink-0 items-center gap-1">
            {canSave && (
              <form action={saveAction}>
                <input type="hidden" name="lesson_id" value={lesson.id} />
                <input type="hidden" name="community_slug" value={communitySlug} />
                <input type="hidden" name="space_slug" value={spaceSlug} />
                <input type="hidden" name="saved" value={lesson.saved ? "1" : "0"} />
                <button
                  type="submit"
                  disabled={saving}
                  aria-pressed={Boolean(lesson.saved)}
                  aria-label={lesson.saved ? "Saved — tap to remove" : "Save this lesson"}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                  <Bookmark
                    className={cn("h-4 w-4", lesson.saved && "fill-accent text-accent")}
                  />
                </button>
              </form>
            )}

            <Link
              href={href}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Start
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </span>
        </div>

        {saveState?.error && (
          <p className="mt-2 text-xs text-danger" role="alert">
            {saveState.error}
          </p>
        )}
      </div>
    </article>
  );
}
