"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NewCourseForm } from "./new-course-form";
import { CourseCard } from "./course-card";
import type { CourseListItem } from "@/lib/data/courses";

export function CoursesView({
  courses,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  isStaff,
}: {
  courses: CourseListItem[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  isStaff: boolean;
}) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) => c.course.title.toLowerCase().includes(q) || (c.course.summary ?? "").toLowerCase().includes(q)
    );
  }, [courses, query]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {isStaff && (
          <Button type="button" onClick={() => setShowForm((v) => !v)} className="w-auto shrink-0">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "New course"}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-5">
          <NewCourseForm
            communityId={communityId}
            communitySlug={communitySlug}
            spaceId={spaceId}
            spaceSlug={spaceSlug}
            onDone={() => setShowForm(false)}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-6 w-6" />}
          title={courses.length === 0 ? "No courses yet" : "Nothing matches"}
          description={
            courses.length === 0
              ? isStaff
                ? "Create your first course, then build it up module by module."
                : "Courses the community runs will show up here."
              : "Try a different search."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((data) => (
            <CourseCard key={data.course.id} data={data} communitySlug={communitySlug} spaceSlug={spaceSlug} isStaff={isStaff} />
          ))}
        </div>
      )}
    </div>
  );
}
