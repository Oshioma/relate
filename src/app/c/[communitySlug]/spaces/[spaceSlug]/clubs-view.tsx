"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NewClubForm } from "./new-club-form";
import { ClubCard } from "./club-card";
import type { ClubWithMembers } from "@/lib/data/clubs";

export function ClubsView({
  clubs,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  canPost,
  isStaff,
  userId,
}: {
  clubs: ClubWithMembers[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  canPost: boolean;
  isStaff: boolean;
  userId: string;
}) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [myClubsOnly, setMyClubsOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clubs.filter((c) => {
      if (myClubsOnly && !c.viewerJoined) return false;
      if (
        q &&
        !c.club.name.toLowerCase().includes(q) &&
        !(c.club.category ?? "").toLowerCase().includes(q) &&
        !(c.club.description ?? "").toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [clubs, query, myClubsOnly]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clubs…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {canPost && (
          <Button type="button" onClick={() => setShowForm((v) => !v)} className="w-auto shrink-0">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Start a club"}
          </Button>
        )}
      </div>

      <div className="mb-5 flex items-center">
        <label className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <input type="checkbox" checked={myClubsOnly} onChange={(e) => setMyClubsOnly(e.target.checked)} className="h-3.5 w-3.5 rounded border-border" />
          My clubs only
        </label>
      </div>

      {showForm && (
        <div className="mb-5">
          <NewClubForm communityId={communityId} communitySlug={communitySlug} spaceId={spaceId} spaceSlug={spaceSlug} onDone={() => setShowForm(false)} />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<UsersRound className="h-6 w-6" />}
          title={clubs.length === 0 ? "No clubs yet" : "Nothing matches"}
          description={clubs.length === 0 ? "Photography, running, book clubs and more members start will show up here." : "Try a different search."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((data) => (
            <ClubCard
              key={data.club.id}
              data={data}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              canManage={isStaff || data.club.created_by === userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
