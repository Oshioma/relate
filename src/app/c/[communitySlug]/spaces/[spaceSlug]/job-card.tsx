"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Wallet, Building2, ExternalLink, MoreVertical, Trash2, RotateCcw, CircleCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import { jobTypeLabel } from "@/lib/job-types";
import { deleteJobListing, setJobListingStatus } from "./jobs-actions";
import type { JobListingWithDetails } from "@/lib/data/jobs";

export function JobCard({
  job,
  communitySlug,
  spaceSlug,
  canManage,
}: {
  job: JobListingWithDetails;
  communitySlug: string;
  spaceSlug: string;
  canManage: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const isClosed = job.status === "closed";

  function toggleStatus() {
    setMenuOpen(false);
    startTransition(async () => {
      await setJobListingStatus(job.id, isClosed ? "open" : "closed", communitySlug, spaceSlug);
      router.refresh();
    });
  }

  function handleDelete() {
    setMenuOpen(false);
    if (!window.confirm(`Remove "${job.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      await deleteJobListing(job.id, communitySlug, spaceSlug);
      router.refresh();
    });
  }

  return (
    <Card className={isPending ? "opacity-60" : undefined}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-sm font-semibold text-foreground">{job.title}</h3>
              <Badge tone="accent">{jobTypeLabel(job.job_type)}</Badge>
              {isClosed && <Badge tone="danger">Closed</Badge>}
            </div>
            {job.business?.name && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="h-3 w-3" />
                {job.business.name}
              </p>
            )}
          </div>
          {canManage && (
            <div className="relative shrink-0">
              <button type="button" onClick={() => setMenuOpen((v) => !v)} className="rounded-md p-1 text-muted-foreground hover:bg-muted" title="Manage listing">
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 z-10 w-40 overflow-hidden rounded-md border border-border bg-card shadow-lg">
                  <button type="button" disabled={isPending} onClick={toggleStatus} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted disabled:opacity-60">
                    {isClosed ? <RotateCcw className="h-3.5 w-3.5" /> : <CircleCheck className="h-3.5 w-3.5" />}
                    {isClosed ? "Reopen" : "Mark closed"}
                  </button>
                  <button type="button" disabled={isPending} onClick={handleDelete} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-danger hover:bg-danger/10 disabled:opacity-60">
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-2.5 line-clamp-2 text-sm text-foreground">{job.description}</p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {job.location_label && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location_label}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1">
              <Wallet className="h-3 w-3" />
              {job.salary}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar src={job.poster?.avatar_url} name={job.poster?.full_name || job.poster?.username} size={20} />
            <p className="min-w-0 truncate text-xs text-muted-foreground">
              {job.poster?.full_name || job.poster?.username} · {formatRelativeTime(job.created_at)}
            </p>
          </div>
          {job.apply_url && !isClosed && (
            <a
              href={job.apply_url}
              target={job.apply_url.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              Apply
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
