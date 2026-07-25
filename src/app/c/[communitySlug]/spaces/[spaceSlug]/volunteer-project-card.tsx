"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Users, MoreVertical, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { signUpForProject, withdrawFromProject, setVolunteerProjectStatus, deleteVolunteerProject } from "./volunteer-hub-actions";
import type { VolunteerProjectWithSignups } from "@/lib/data/volunteer-hub";
import type { VolunteerProjectStatus } from "@/types/database";

const STATUS_META: Record<VolunteerProjectStatus, { label: string; tone: "accent" | "neutral" | "danger" }> = {
  open: { label: "Open", tone: "accent" },
  in_progress: { label: "In progress", tone: "neutral" },
  completed: { label: "Completed", tone: "danger" },
};

export function VolunteerProjectCard({
  data,
  communitySlug,
  spaceSlug,
  canManage,
  canInteract,
}: {
  data: VolunteerProjectWithSignups;
  communitySlug: string;
  spaceSlug: string;
  canManage: boolean;
  canInteract: boolean;
}) {
  const { project, volunteers, volunteerCount, viewerSignedUp } = data;
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const status = STATUS_META[project.status];

  function toggleSignup() {
    setError(null);
    startTransition(async () => {
      const result = viewerSignedUp
        ? await withdrawFromProject(project.id, communitySlug, spaceSlug)
        : await signUpForProject(project.id, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  function changeStatus(next: VolunteerProjectStatus) {
    setMenuOpen(false);
    startTransition(async () => {
      const result = await setVolunteerProjectStatus(project.id, next, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  function handleDelete() {
    setMenuOpen(false);
    if (!window.confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteVolunteerProject(project.id, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <Card className={isPending ? "opacity-60" : undefined}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-sm font-semibold text-foreground">{project.title}</h3>
              <Badge tone={status.tone}>{status.label}</Badge>
              {project.category && <Badge tone="neutral">{project.category}</Badge>}
            </div>
            {project.location_label && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {project.location_label}
              </p>
            )}
          </div>
          {canManage && (
            <div className="relative shrink-0">
              <button type="button" onClick={() => setMenuOpen((v) => !v)} className="rounded-md p-1 text-muted-foreground hover:bg-muted" title="Manage project">
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 z-10 w-44 overflow-hidden rounded-md border border-border bg-card shadow-lg">
                  {(Object.keys(STATUS_META) as VolunteerProjectStatus[])
                    .filter((s) => s !== project.status)
                    .map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={isPending}
                        onClick={() => changeStatus(s)}
                        className="flex w-full items-center px-3 py-2 text-left text-xs text-foreground hover:bg-muted disabled:opacity-60"
                      >
                        Mark {STATUS_META[s].label.toLowerCase()}
                      </button>
                    ))}
                  <button type="button" disabled={isPending} onClick={handleDelete} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-danger hover:bg-danger/10 disabled:opacity-60">
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-2 text-sm text-foreground">{project.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {volunteers.length > 0 && (
              <div className="flex -space-x-2">
                {volunteers.slice(0, 5).map((profile) => (
                  <Avatar key={profile.id} src={profile.avatar_url} name={profile.full_name || profile.username} size={24} className="ring-2 ring-card" />
                ))}
              </div>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {volunteerCount}
              {project.volunteers_needed ? ` / ${project.volunteers_needed}` : ""} volunteer{volunteerCount === 1 && !project.volunteers_needed ? "" : "s"}
            </span>
          </div>

          {canInteract && (
            <Button type="button" variant={viewerSignedUp ? "secondary" : "primary"} disabled={isPending} onClick={toggleSignup}>
              {viewerSignedUp ? "Withdraw" : "Sign Up"}
            </Button>
          )}
        </div>

        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      </CardContent>
    </Card>
  );
}
