"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, NotebookText, Plus, Backpack, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LessonComposer } from "./lesson-composer";
import { AgeBadge } from "./lesson-document";
import { cn } from "@/lib/utils";
import {
  AGE_BANDS,
  SUBJECT_ICONS,
  formatDueDate,
  lessonSearchText,
  normaliseSubject,
  type LessonRow,
  type Subject,
} from "@/lib/school/lesson-types";
import type { HomeworkWithProgress } from "@/lib/data/lessons";

// The teaching library. Lessons are grouped by subject rather than listed flat:
// a school accumulates hundreds, and "what do we have for History?" is the
// question actually being asked.

function LessonCard({
  lesson,
  href,
  homework,
}: {
  lesson: LessonRow;
  href: string;
  homework?: HomeworkWithProgress;
}) {
  const cover = lesson.lesson?.cover;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-muted-foreground/40"
    >
      {cover && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={cover.thumbUrl} alt="" loading="lazy" className="h-32 w-full bg-muted object-cover" />
      )}
      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-accent">
            {lesson.title || "Untitled lesson"}
          </h3>
          <AgeBadge band={lesson.age_band} />
        </div>
        {lesson.lesson?.summary && (
          <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{lesson.lesson.summary}</p>
        )}
        {homework && (
          <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            {homework.completedByViewer ? (
              <Check className="h-3 w-3 shrink-0" />
            ) : (
              <Backpack className="h-3 w-3 shrink-0" />
            )}
            {homework.completedByViewer
              ? "Done"
              : homework.due_on
                ? `Sent home · due ${formatDueDate(homework.due_on, "short")}`
                : "Sent home"}
          </p>
        )}
      </div>
    </Link>
  );
}

export function LessonsView({
  lessons,
  homework,
  spaceId,
  communitySlug,
  spaceSlug,
  canWrite,
  defaultAgeBand,
  writerConfigured,
}: {
  lessons: LessonRow[];
  // Current assignment per lesson id. Lessons with nothing set are absent.
  homework: Map<string, HomeworkWithProgress>;
  spaceId: string;
  communitySlug: string;
  spaceSlug: string;
  // Staff only — see the authoring note in 20260904181544_space_lessons.sql.
  canWrite: boolean;
  defaultAgeBand: string;
  // False when ANTHROPIC_API_KEY isn't set: the library still reads, but
  // there is no point offering a composer that cannot work.
  writerConfigured: boolean;
}) {
  const [query, setQuery] = useState("");
  const [band, setBand] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);

  // Precomputed once per lesson: the search box matches on everything in the
  // document, not just the title.
  const searchable = useMemo(
    () => new Map(lessons.map((lesson) => [lesson.id, lessonSearchText(lesson)])),
    [lessons]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return lessons.filter((lesson) => {
      if (band && lesson.age_band !== band) return false;
      if (!needle) return true;
      return (searchable.get(lesson.id) ?? "").includes(needle);
    });
  }, [lessons, query, band, searchable]);

  // Grouped by subject, subjects in the order SUBJECT_ICONS declares them so
  // the page doesn't reshuffle as lessons are added.
  const grouped = useMemo(() => {
    const groups = new Map<Subject, LessonRow[]>();
    for (const lesson of filtered) {
      const subject = normaliseSubject(lesson.subject);
      const existing = groups.get(subject);
      if (existing) existing.push(lesson);
      else groups.set(subject, [lesson]);
    }
    return [...groups.entries()].sort(
      (a, b) =>
        Object.keys(SUBJECT_ICONS).indexOf(a[0]) - Object.keys(SUBJECT_ICONS).indexOf(b[0])
    );
  }, [filtered]);

  return (
    <div className="space-y-5">
      {canWrite && !composing && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {lessons.length === 0
              ? "No lessons yet."
              : `${lessons.length} lesson${lessons.length === 1 ? "" : "s"} in this library.`}
          </p>
          {writerConfigured && (
            <Button onClick={() => setComposing(true)} size="sm">
              <Plus className="h-4 w-4" />
              Write a lesson
            </Button>
          )}
        </div>
      )}

      {composing && (
        <LessonComposer spaceId={spaceId} defaultAgeBand={defaultAgeBand} onClose={() => setComposing(false)} />
      )}

      {lessons.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lessons…"
              className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex gap-1.5">
            {AGE_BANDS.map((entry) => (
              <button
                key={entry.key}
                type="button"
                onClick={() => setBand(band === entry.key ? null : entry.key)}
                className={cn(
                  "rounded-md border-2 px-2.5 py-1.5 text-xs font-medium transition-colors",
                  band === entry.key
                    ? "border-accent bg-accent-soft text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                )}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {lessons.length === 0 ? (
        <EmptyState
          icon={<NotebookText className="h-6 w-6" />}
          title="No lessons yet"
          description={
            canWrite
              ? writerConfigured
                ? "Paste a chapter, an article or your own notes, and get back a lesson written for the right age — ready to teach or print."
                : "The lesson writer isn't configured on this deployment yet."
              : "Teachers and staff will add lessons here."
          }
        />
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Nothing matches that search.
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(([subject, subjectLessons]) => (
            <section key={subject}>
              <h2 className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-foreground">
                <span aria-hidden>{SUBJECT_ICONS[subject]}</span>
                {subject}
                <span className="font-normal text-muted-foreground">({subjectLessons.length})</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {subjectLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    href={`/c/${communitySlug}/spaces/${spaceSlug}/lessons/${lesson.id}`}
                    homework={homework.get(lesson.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
