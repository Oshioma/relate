"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Circle, Lock, PlayCircle, ChevronRight, ChevronLeft as ChevronLeftIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Linkify } from "@/components/ui/linkify";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./course-progress";
import { enrollInCourse, unenrollFromCourse, markLessonComplete, unmarkLessonComplete } from "./courses-actions";
import type { CourseDetail } from "@/lib/data/courses";
import type { CourseLesson } from "@/types/database";

export function CoursePlayer({
  detail,
  communityId,
  communitySlug,
  spaceSlug,
  canEnroll,
  isStaff,
}: {
  detail: CourseDetail;
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  canEnroll: boolean;
  isStaff: boolean;
}) {
  const { course, instructor, modules } = detail;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [enrolled, setEnrolled] = useState(detail.viewerEnrolled);
  const [completed, setCompleted] = useState<Set<string>>(new Set(detail.completedLessonIds));

  // Lessons in outline order, for selection, prev/next and "resume".
  const flatLessons = useMemo(() => modules.flatMap((m) => m.lessons), [modules]);
  const total = flatLessons.length;

  // Staff can preview content in a draft without enrolling; members must enrol.
  const canAccess = enrolled || isStaff;

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(() => {
    const firstIncomplete = flatLessons.find((l) => !completed.has(l.id));
    return (firstIncomplete ?? flatLessons[0])?.id ?? null;
  });

  const selectedIndex = flatLessons.findIndex((l) => l.id === selectedLessonId);
  const selected: CourseLesson | null = selectedIndex >= 0 ? flatLessons[selectedIndex] : null;

  function toggleEnroll() {
    setError(null);
    const next = !enrolled;
    setEnrolled(next);
    startTransition(async () => {
      const result = next
        ? await enrollInCourse(course.id, communitySlug, spaceSlug)
        : await unenrollFromCourse(course.id, communitySlug, spaceSlug);
      if (result?.error) {
        setEnrolled(!next);
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function toggleComplete(lesson: CourseLesson) {
    setError(null);
    const isDone = completed.has(lesson.id);
    setCompleted((prev) => {
      const nextSet = new Set(prev);
      if (isDone) nextSet.delete(lesson.id);
      else nextSet.add(lesson.id);
      return nextSet;
    });
    startTransition(async () => {
      const result = isDone
        ? await unmarkLessonComplete(lesson.id, communitySlug, spaceSlug)
        : await markLessonComplete(lesson.id, course.id, communityId, communitySlug, spaceSlug);
      if (result?.error) {
        // Revert on failure.
        setCompleted((prev) => {
          const nextSet = new Set(prev);
          if (isDone) nextSet.add(lesson.id);
          else nextSet.delete(lesson.id);
          return nextSet;
        });
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  const completedCount = flatLessons.filter((l) => completed.has(l.id)).length;
  const allDone = total > 0 && completedCount >= total;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{course.title}</h1>
              {course.status === "draft" && <Badge tone="neutral">Draft</Badge>}
            </div>
            {course.summary && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{course.summary}</p>}
            {instructor && (
              <div className="mt-3 flex items-center gap-2">
                <Avatar src={instructor.avatar_url} name={instructor.full_name || instructor.username} size={24} />
                <span className="text-xs text-muted-foreground">
                  Taught by {instructor.full_name || instructor.username}
                </span>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {isStaff && (
              <Link
                href={`/c/${communitySlug}/spaces/${spaceSlug}/courses/${course.id}/manage`}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Manage
              </Link>
            )}
            {canEnroll && (
              <Button
                type="button"
                variant={enrolled ? "secondary" : "primary"}
                disabled={isPending}
                onClick={toggleEnroll}
                className="w-auto"
              >
                {enrolled ? "Leave course" : "Enrol"}
              </Button>
            )}
          </div>
        </div>

        {enrolled && total > 0 && (
          <div className="mt-4 max-w-md">
            <ProgressBar completed={completedCount} total={total} />
            {allDone && <p className="mt-1.5 text-xs font-medium text-emerald-600">You&apos;ve completed this course. 🎉</p>}
          </div>
        )}

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </div>

      {total === 0 ? (
        <EmptyState
          icon={<PlayCircle className="h-6 w-6" />}
          title="No lessons yet"
          description={isStaff ? "Add modules and lessons from Manage to build this course." : "Check back soon — the instructor is still building this course."}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Outline */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="space-y-4 rounded-xl border border-border bg-card p-4">
              {modules.map((m, mi) => (
                <div key={m.module.id}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {mi + 1}. {m.module.title}
                  </p>
                  <ul className="space-y-1">
                    {m.lessons.map((lesson) => {
                      const isDone = completed.has(lesson.id);
                      const isCurrent = lesson.id === selectedLessonId;
                      return (
                        <li key={lesson.id}>
                          <button
                            type="button"
                            disabled={!canAccess}
                            onClick={() => canAccess && setSelectedLessonId(lesson.id)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                              isCurrent ? "bg-muted font-medium text-foreground" : "text-muted-foreground",
                              canAccess ? "hover:bg-muted hover:text-foreground" : "cursor-default"
                            )}
                          >
                            {!canAccess ? (
                              <Lock className="h-3.5 w-3.5 shrink-0" />
                            ) : isDone ? (
                              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 shrink-0" />
                            )}
                            <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                            {lesson.duration_minutes != null && (
                              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{lesson.duration_minutes}m</span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                    {m.lessons.length === 0 && <li className="px-2 py-1 text-xs text-muted-foreground">No lessons yet.</li>}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* Lesson content */}
          <div>
            {!canAccess ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <Lock className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">Enrol to start learning</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {total} {total === 1 ? "lesson" : "lessons"} across {modules.length} {modules.length === 1 ? "module" : "modules"}.
                </p>
                {canEnroll && (
                  <Button type="button" disabled={isPending} onClick={toggleEnroll} className="mt-4 w-auto">
                    Enrol
                  </Button>
                )}
              </div>
            ) : selected ? (
              <article className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-foreground">{selected.title}</h2>
                  {enrolled && (
                    <Button
                      type="button"
                      variant={completed.has(selected.id) ? "secondary" : "primary"}
                      disabled={isPending}
                      onClick={() => toggleComplete(selected)}
                      className="w-auto shrink-0"
                    >
                      {completed.has(selected.id) ? (
                        <>
                          <Check className="h-4 w-4" />
                          Completed
                        </>
                      ) : (
                        "Mark complete"
                      )}
                    </Button>
                  )}
                </div>

                {selected.video_url && (
                  <a
                    href={selected.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-accent hover:bg-muted"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Watch video
                  </a>
                )}

                {selected.body ? (
                  <Linkify text={selected.body} className="mt-4 text-sm leading-relaxed text-foreground" />
                ) : (
                  !selected.video_url && <p className="mt-4 text-sm text-muted-foreground">This lesson has no content yet.</p>
                )}

                {/* Prev / next */}
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <button
                    type="button"
                    disabled={selectedIndex <= 0}
                    onClick={() => setSelectedLessonId(flatLessons[selectedIndex - 1]?.id ?? null)}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={selectedIndex >= total - 1}
                    onClick={() => setSelectedLessonId(flatLessons[selectedIndex + 1]?.id ?? null)}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ) : (
              <p className="text-sm text-muted-foreground">Select a lesson to begin.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
