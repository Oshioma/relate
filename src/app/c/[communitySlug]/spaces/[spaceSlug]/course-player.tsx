"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  Circle,
  Lock,
  PlayCircle,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  Settings,
  Megaphone,
  Award,
  Send,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Linkify } from "@/components/ui/linkify";
import { cn, formatDateTime, formatRelativeTime } from "@/lib/utils";
import { ProgressBar } from "./course-progress";
import {
  enrollInCourse,
  unenrollFromCourse,
  markLessonComplete,
  unmarkLessonComplete,
  addLessonComment,
  deleteLessonComment,
} from "./courses-actions";
import type { CourseDetail, LessonCommentWithAuthor } from "@/lib/data/courses";
import type { CourseLesson } from "@/types/database";

export function CoursePlayer({
  detail,
  communityId,
  communitySlug,
  spaceSlug,
  viewerId,
  canEnroll,
  canComment,
  isStaff,
  lockedModuleIds: lockedModuleIdsProp,
}: {
  detail: CourseDetail;
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  viewerId: string;
  canEnroll: boolean;
  canComment: boolean;
  isStaff: boolean;
  // Modules locked by drip scheduling, computed server-side at request time.
  lockedModuleIds: string[];
}) {
  const { course, instructor, modules, announcements } = detail;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [enrolled, setEnrolled] = useState(detail.viewerEnrolled);
  const [completed, setCompleted] = useState<Set<string>>(new Set(detail.completedLessonIds));

  const flatLessons = useMemo(() => modules.flatMap((m) => m.lessons), [modules]);
  const total = flatLessons.length;

  // Drip: locked modules are computed on the server (see the route) and passed
  // in, so no impure clock is read during render.
  const lockedModuleIds = useMemo(() => new Set(lockedModuleIdsProp), [lockedModuleIdsProp]);
  const isLessonLocked = (lesson: CourseLesson) => lockedModuleIds.has(lesson.module_id);

  const commentsByLesson = useMemo(() => {
    const map = new Map<string, LessonCommentWithAuthor[]>();
    for (const c of detail.comments) {
      const list = map.get(c.comment.lesson_id) ?? [];
      list.push(c);
      map.set(c.comment.lesson_id, list);
    }
    return map;
  }, [detail.comments]);

  // Staff can preview content in a draft without enrolling; members must enrol.
  const canAccess = enrolled || isStaff;

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(() => {
    const firstIncompleteUnlocked = flatLessons.find((l) => !completed.has(l.id) && !lockedModuleIds.has(l.module_id));
    return (firstIncompleteUnlocked ?? flatLessons[0])?.id ?? null;
  });

  const selectedIndex = flatLessons.findIndex((l) => l.id === selectedLessonId);
  const selected: CourseLesson | null = selectedIndex >= 0 ? flatLessons[selectedIndex] : null;
  const selectedLocked = selected ? isLessonLocked(selected) : false;
  const selectedModule = selected ? modules.find((m) => m.module.id === selected.module_id) : null;

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
  const certificateReady = enrolled && allDone && course.certificate_enabled;

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
                <span className="text-xs text-muted-foreground">Taught by {instructor.full_name || instructor.username}</span>
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
              <Button type="button" variant={enrolled ? "secondary" : "primary"} disabled={isPending} onClick={toggleEnroll} className="w-auto">
                {enrolled ? "Leave course" : "Enrol"}
              </Button>
            )}
          </div>
        </div>

        {enrolled && total > 0 && (
          <div className="mt-4 max-w-md">
            <ProgressBar completed={completedCount} total={total} />
          </div>
        )}

        {certificateReady && (
          <Link
            href={`/c/${communitySlug}/spaces/${spaceSlug}/courses/${course.id}/certificate`}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Award className="h-4 w-4" />
            View your certificate
          </Link>
        )}

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="mb-6 space-y-2">
          {announcements.map(({ announcement, author }) => (
            <div key={announcement.id} className="rounded-xl border border-accent/30 bg-accent/5 p-4">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm font-semibold text-foreground">{announcement.title}</p>
                <span className="ml-auto text-xs text-muted-foreground">{formatRelativeTime(announcement.created_at)}</span>
              </div>
              {announcement.body && <Linkify text={announcement.body} className="mt-1.5 pl-6 text-sm text-foreground" />}
              {author && <p className="mt-1.5 pl-6 text-xs text-muted-foreground">— {author.full_name || author.username}</p>}
            </div>
          ))}
        </div>
      )}

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
              {modules.map((m, mi) => {
                const moduleLocked = lockedModuleIds.has(m.module.id);
                return (
                  <div key={m.module.id}>
                    <div className="mb-2 flex items-center gap-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {mi + 1}. {m.module.title}
                      </p>
                      {moduleLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
                    </div>
                    {moduleLocked && m.module.available_at && (
                      <p className="mb-2 text-xs text-muted-foreground">Unlocks {formatDateTime(m.module.available_at)}</p>
                    )}
                    <ul className="space-y-1">
                      {m.lessons.map((lesson) => {
                        const isDone = completed.has(lesson.id);
                        const isCurrent = lesson.id === selectedLessonId;
                        const lessonLocked = moduleLocked;
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
                              {!canAccess || lessonLocked ? (
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
                );
              })}
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
                  {enrolled && !selectedLocked && (
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

                {selectedLocked ? (
                  <div className="mt-4 flex items-center gap-2 rounded-md bg-muted px-3 py-4 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    This module unlocks {selectedModule?.module.available_at ? formatDateTime(selectedModule.module.available_at) : "soon"}.
                  </div>
                ) : (
                  <>
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

                    <LessonComments
                      comments={commentsByLesson.get(selected.id) ?? []}
                      lesson={selected}
                      communityId={communityId}
                      communitySlug={communitySlug}
                      spaceSlug={spaceSlug}
                      courseId={course.id}
                      viewerId={viewerId}
                      canComment={canComment}
                      isStaff={isStaff}
                    />
                  </>
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

function LessonComments({
  comments,
  lesson,
  communityId,
  communitySlug,
  spaceSlug,
  courseId,
  viewerId,
  canComment,
  isStaff,
}: {
  comments: LessonCommentWithAuthor[];
  lesson: CourseLesson;
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  courseId: string;
  viewerId: string;
  canComment: boolean;
  isStaff: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    const text = body.trim();
    if (!text) return;
    setError(null);
    startTransition(async () => {
      const result = await addLessonComment(lesson.id, courseId, communityId, text, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else {
        setBody("");
        router.refresh();
      }
    });
  }

  function remove(commentId: string) {
    setError(null);
    startTransition(async () => {
      const result = await deleteLessonComment(commentId, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="mt-6 border-t border-border pt-5">
      <p className="mb-3 text-sm font-semibold text-foreground">Questions &amp; discussion</p>

      <div className="space-y-4">
        {comments.map(({ comment, author }) => (
          <div key={comment.id} className="flex items-start gap-2.5">
            <Avatar src={author?.avatar_url} name={author?.full_name || author?.username} size={28} />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">
                {author?.full_name || author?.username || "Member"} · {formatRelativeTime(comment.created_at)}
              </p>
              <Linkify text={comment.body} className="mt-0.5 text-sm text-foreground" />
            </div>
            {(comment.author_id === viewerId || isStaff) && (
              <button
                type="button"
                title="Delete comment"
                disabled={isPending}
                onClick={() => remove(comment.id)}
                className="shrink-0 text-muted-foreground hover:text-danger disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
        {comments.length === 0 && <p className="text-sm text-muted-foreground">No questions yet — be the first to ask.</p>}
      </div>

      {canComment && (
        <div className="mt-4 flex items-start gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            placeholder="Ask a question or share a thought…"
            className="w-full resize-y rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="button" disabled={isPending || !body.trim()} onClick={submit} className="w-auto shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
