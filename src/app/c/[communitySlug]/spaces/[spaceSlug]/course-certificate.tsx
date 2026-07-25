"use client";

import Link from "next/link";
import { Award, ChevronLeft, Printer } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function CourseCertificate({
  learnerName,
  courseTitle,
  instructorName,
  communityName,
  completedAt,
  backHref,
}: {
  learnerName: string;
  courseTitle: string;
  instructorName: string | null;
  communityName: string;
  completedAt: string | null;
  backHref: string;
}) {
  const dateLabel = completedAt ? formatDate(completedAt, { year: "numeric", month: "long", day: "numeric" }) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Controls — hidden when printing */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href={backHref} className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-3.5 w-3.5" />
          Back to course
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          <Printer className="h-4 w-4" />
          Print / save PDF
        </button>
      </div>

      {/* Certificate */}
      <div className="rounded-2xl border-4 border-double border-accent/40 bg-card p-10 text-center shadow-sm print:border-accent print:shadow-none">
        <Award className="mx-auto h-12 w-12 text-accent" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Certificate of Completion</p>

        <p className="mt-8 text-sm text-muted-foreground">This certifies that</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{learnerName}</p>

        <p className="mt-6 text-sm text-muted-foreground">has successfully completed</p>
        <p className="mt-2 text-xl font-medium text-foreground">{courseTitle}</p>

        <div className="mx-auto mt-10 flex max-w-md flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
          {dateLabel && (
            <span>
              <span className="block text-xs uppercase tracking-wide">Completed</span>
              <span className="text-foreground">{dateLabel}</span>
            </span>
          )}
          {instructorName && (
            <span>
              <span className="block text-xs uppercase tracking-wide">Instructor</span>
              <span className="text-foreground">{instructorName}</span>
            </span>
          )}
          <span>
            <span className="block text-xs uppercase tracking-wide">Issued by</span>
            <span className="text-foreground">{communityName}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
