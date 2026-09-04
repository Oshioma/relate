"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, NotebookText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { LessonComposer } from "./lesson-composer";
import { AgeBadge, LessonThumbnail } from "./lesson-document";
import { cn } from "@/lib/utils";
import {
  AGE_BANDS,
  SUBJECT_ICONS,
  lessonSearchText,
  normaliseSubject,
  type LessonRow,
  type Subject,
} from "@/lib/school/lesson-types";

// The teaching library. Lessons are grouped by subject rather than listed flat:
// a school accumulates hundreds, and "what do we have for History?" is the
// question actually being asked.

// One lesson, as a full-width row rather than a card in a grid.
//
// A three-column grid gave each title about twenty characters a line, so
// "Free Heat: How the Sun Can Warm Your Home for Nothing" came out as six
// stacked fragments. Lesson titles are sentences, and a teacher scanning a
// library is reading the titles — so they get the width, at a size worth
// reading, with the picture as a thumbnail beside them.
function LessonCard({ lesson, href }: { lesson: LessonRow; href: string }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-muted-foreground/40"
    >
      <LessonThumbnail
        lesson={lesson.lesson}
        subject={lesson.subject}
        className="h-16 w-16 shrink-0 rounded-md sm:h-20 sm:w-20"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug text-foreground group-hover:text-accent sm:text-lg">
            {lesson.title || "Untitled lesson"}
          </h3>
          <AgeBadge band={lesson.age_band} />
        </div>
        {lesson.lesson?.summary && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {lesson.lesson.summary}
          </p>
        )}
      </div>
    </Link>
  );
}

export function LessonsView({
  lessons,
  spaceId,
  communitySlug,
  spaceSlug,
  canWrite,
  defaultAgeBand,
  writerConfigured,
}: {
  lessons: LessonRow[];
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
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
                <span aria-hidden>{SUBJECT_ICONS[subject]}</span>
                {subject}
                <span className="font-normal text-muted-foreground">({subjectLessons.length})</span>
              </h2>
              <div className="grid gap-2.5">
                {subjectLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    href={`/c/${communitySlug}/spaces/${spaceSlug}/lessons/${lesson.id}`}
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
