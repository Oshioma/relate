"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NewVolunteerProjectForm } from "./new-volunteer-project-form";
import { VolunteerProjectCard } from "./volunteer-project-card";
import type { VolunteerProjectWithSignups } from "@/lib/data/volunteer-hub";
import type { VolunteerProjectStatus } from "@/types/database";

export function VolunteerHubView({
  projects,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  canPost,
  isStaff,
  userId,
}: {
  projects: VolunteerProjectWithSignups[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  canPost: boolean;
  isStaff: boolean;
  userId: string;
}) {
  const [status, setStatus] = useState<VolunteerProjectStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (status !== "all" && p.project.status !== status) return false;
      if (
        q &&
        !p.project.title.toLowerCase().includes(q) &&
        !p.project.description.toLowerCase().includes(q) &&
        !(p.project.category ?? "").toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [projects, status, query]);

  const countByStatus = useMemo(() => {
    const counts = new Map<VolunteerProjectStatus, number>();
    for (const p of projects) {
      counts.set(p.project.status, (counts.get(p.project.status) ?? 0) + 1);
    }
    return counts;
  }, [projects]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {canPost && (
          <Button type="button" onClick={() => setShowForm((v) => !v)} className="w-auto shrink-0">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Start a project"}
          </Button>
        )}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-1.5">
        {(["all", "open", "in_progress", "completed"] as const).map((s) => {
          const count = s === "all" ? projects.length : countByStatus.get(s) ?? 0;
          if (s !== "all" && count === 0) return null;
          const isActive = status === s;
          const label = s === "all" ? "All" : s === "in_progress" ? "In progress" : s[0].toUpperCase() + s.slice(1);
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${isActive ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {showForm && (
        <div className="mb-5">
          <NewVolunteerProjectForm
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
          icon={<HandHeart className="h-6 w-6" />}
          title={projects.length === 0 ? "No projects yet" : "Nothing matches"}
          description={projects.length === 0 ? "Beach cleanups, fundraising, tree planting and more members organise will show up here." : "Try a different search or status."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((data) => (
            <VolunteerProjectCard
              key={data.project.id}
              data={data}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              canManage={isStaff || data.project.organiser_id === userId}
              canInteract={canPost}
            />
          ))}
        </div>
      )}
    </div>
  );
}
