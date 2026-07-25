import Link from "next/link";
import { GraduationCap, BookOpen, Users, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ProgressBar } from "./course-progress";
import type { CourseListItem } from "@/lib/data/courses";

export function CourseCard({
  data,
  communitySlug,
  spaceSlug,
  isStaff,
}: {
  data: CourseListItem;
  communitySlug: string;
  spaceSlug: string;
  isStaff: boolean;
}) {
  const { course, instructor, lessonCount, enrollmentCount, viewerEnrolled, completedCount } = data;
  const href = `/c/${communitySlug}/spaces/${spaceSlug}/courses/${course.id}`;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-sm">
      <Link href={href} className="flex flex-1 flex-col">
        {course.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.cover_image_url} alt="" className="h-32 w-full object-cover" />
        ) : (
          <div className="flex h-32 w-full items-center justify-center bg-muted">
            <GraduationCap className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        <CardContent className="flex flex-1 flex-col pt-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">{course.title}</h3>
            {course.status === "draft" && <Badge tone="neutral">Draft</Badge>}
          </div>

          {course.summary && <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{course.summary}</p>}

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {enrollmentCount} enrolled
            </span>
          </div>

          {instructor && (
            <div className="mt-3 flex items-center gap-2">
              <Avatar src={instructor.avatar_url} name={instructor.full_name || instructor.username} size={20} />
              <span className="text-xs text-muted-foreground">{instructor.full_name || instructor.username}</span>
            </div>
          )}

          {viewerEnrolled && lessonCount > 0 && (
            <div className="mt-auto pt-4">
              <ProgressBar completed={completedCount} total={lessonCount} />
            </div>
          )}
        </CardContent>
      </Link>

      {isStaff && (
        <div className="border-t border-border px-5 py-2.5">
          <Link
            href={`${href}/manage`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-3.5 w-3.5" />
            Manage
          </Link>
        </div>
      )}
    </Card>
  );
}
