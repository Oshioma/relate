"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { JOB_TYPES } from "@/lib/job-types";
import { NewJobForm } from "./new-job-form";
import { JobCard } from "./job-card";
import type { JobListingWithDetails } from "@/lib/data/jobs";
import type { JobType } from "@/types/database";

export function JobsBoardView({
  jobs,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  canPost,
  isStaff,
  userId,
}: {
  jobs: JobListingWithDetails[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  canPost: boolean;
  isStaff: boolean;
  userId: string;
}) {
  const [jobType, setJobType] = useState<JobType | "all">("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showClosed, setShowClosed] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (jobType !== "all" && j.job_type !== jobType) return false;
      if (!showClosed && j.status === "closed") return false;
      if (q && !j.title.toLowerCase().includes(q) && !j.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [jobs, jobType, query, showClosed]);

  const countByType = useMemo(() => {
    const counts = new Map<string, number>();
    for (const j of jobs) {
      if (j.status === "closed" && !showClosed) continue;
      counts.set(j.job_type, (counts.get(j.job_type) ?? 0) + 1);
    }
    return counts;
  }, [jobs, showClosed]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {canPost && (
          <Button type="button" onClick={() => setShowForm((v) => !v)} className="w-auto shrink-0">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Post a job"}
          </Button>
        )}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setJobType("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${jobType === "all" ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
        >
          All ({jobs.filter((j) => showClosed || j.status !== "closed").length})
        </button>
        {JOB_TYPES.map((t) => {
          const count = countByType.get(t.value) ?? 0;
          if (count === 0) return null;
          const isActive = jobType === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setJobType(isActive ? "all" : t.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${isActive ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              {t.label} ({count})
            </button>
          );
        })}

        <label className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <input type="checkbox" checked={showClosed} onChange={(e) => setShowClosed(e.target.checked)} className="h-3.5 w-3.5 rounded border-border" />
          Show closed
        </label>
      </div>

      {showForm && (
        <div className="mb-5">
          <NewJobForm communityId={communityId} communitySlug={communitySlug} spaceId={spaceId} spaceSlug={spaceSlug} onDone={() => setShowForm(false)} />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-6 w-6" />}
          title={jobs.length === 0 ? "No jobs posted yet" : "Nothing matches"}
          description={jobs.length === 0 ? "Full-time, part-time, remote and volunteer roles members post will show up here." : "Try a different search or type."}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} communitySlug={communitySlug} spaceSlug={spaceSlug} canManage={isStaff || job.posted_by === userId} />
          ))}
        </div>
      )}
    </div>
  );
}
