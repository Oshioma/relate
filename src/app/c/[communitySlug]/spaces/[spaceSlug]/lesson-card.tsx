"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Bookmark, EyeOff, Telescope } from "lucide-react";
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
    <article className="group flex flex-col overflow-hidden rounded-[1.25rem] bg-card shadow-[0_1px_2px_rgba(38,38,34,0.04),0_8px_24px_-12px_rgba(38,38,34,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(38,38,34,0.04),0_16px_36px_-14px_rgba(38,38,34,0.18)] motion-reduce:transform-none motion-reduce:transition-none">
      <Link href={href} className="relative block overflow-hidden" tabIndex={-1} aria-hidden>
        <LessonThumbnail
          lesson={lesson.lesson}
          subject={lesson.subject}
          className="h-48 w-full transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none sm:h-52"
        />
        {/* The duration reads off the picture, so it needs its own ground —
            a bare white pill on a bright photograph is a sticker. */}
        {duration && (
          <span className="absolute right-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
            {duration}
          </span>
        )}
        {/* Visible while browsing, not only once the lesson is open — the
            moment somebody chooses what to print is the moment it matters. */}
        {lesson.beyond_source && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-accent backdrop-blur-sm">
            <Telescope className="h-3 w-3" />
            Beyond the source
          </span>
        )}
        {categories.length > 0 && (
          <span className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <span
                key={category.key}
                className="inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm"
              >
                <span aria-hidden>{category.icon}</span>
                {category.label}
              </span>
            ))}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {subject}
          <span aria-hidden> &middot; </span>
          {ageBandLabel(lesson.age_band)}
        </p>

        {/* The title gets the whole width of the card and wraps to as many
            lines as it needs. Truncating a lesson title is worse than an
            uneven card: the title is the thing being scanned. The measure is
            what protects it — see GRID in lessons-view. */}
        <h3 className="mt-2 text-[1.0625rem] font-semibold leading-[1.35] tracking-[-0.011em] text-foreground sm:text-lg">
          <Link href={href} className="transition-colors hover:text-accent">
            {lesson.title || "Untitled lesson"}
          </Link>
        </h3>

        {lesson.lesson?.summary && (
          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {lesson.lesson.summary}
          </p>
        )}

        {/* Pushed to the bottom so cards of different title lengths still line
            their actions up with each other. */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
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

            {/* Quieter than the solid pill it replaces: a grid of cards each
                with its own filled green button reads as a dashboard of
                actions. The whole title is a link — this is the affordance,
                not the only way in. */}
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent-soft"
            >
              Start
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
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
