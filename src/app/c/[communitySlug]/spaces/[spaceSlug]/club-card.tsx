"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { joinClub, leaveClub, deleteClub } from "./clubs-actions";
import type { ClubWithMembers } from "@/lib/data/clubs";

export function ClubCard({
  data,
  communitySlug,
  spaceSlug,
  canManage,
}: {
  data: ClubWithMembers;
  communitySlug: string;
  spaceSlug: string;
  canManage: boolean;
}) {
  const { club, members, memberCount, viewerJoined } = data;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function toggleMembership() {
    setError(null);
    startTransition(async () => {
      const result = viewerJoined ? await leaveClub(club.id, communitySlug, spaceSlug) : await joinClub(club.id, communitySlug, spaceSlug);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete "${club.name}"? This can't be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteClub(club.id, communitySlug, spaceSlug);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{club.name}</h3>
              {club.category && <Badge tone="accent">{club.category}</Badge>}
            </div>
            {club.location_label && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {club.location_label}
              </p>
            )}
          </div>
          {canManage && (
            <button
              type="button"
              title="Delete club"
              disabled={isPending}
              onClick={handleDelete}
              className="shrink-0 text-muted-foreground hover:text-danger disabled:opacity-60"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {club.description && <p className="mt-2 text-sm text-foreground">{club.description}</p>}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {members.length > 0 && (
              <div className="flex -space-x-2">
                {members.slice(0, 5).map((profile) => (
                  <Avatar key={profile.id} src={profile.avatar_url} name={profile.full_name || profile.username} size={24} className="ring-2 ring-card" />
                ))}
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>
          </div>

          <Button type="button" variant={viewerJoined ? "secondary" : "primary"} disabled={isPending} onClick={toggleMembership}>
            {viewerJoined ? "Leave" : "Join"}
          </Button>
        </div>

        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      </CardContent>
    </Card>
  );
}
