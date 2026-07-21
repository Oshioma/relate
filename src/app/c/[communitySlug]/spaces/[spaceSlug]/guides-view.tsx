"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X, BookOpenCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { NewGuideForm } from "./new-guide-form";
import { GuideCard } from "./guide-card";
import type { GuideWithStats } from "@/lib/data/guides";

export function GuidesView({
  guides,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  canPost,
}: {
  guides: GuideWithStats[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  canPost: boolean;
}) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guides.filter((g) => {
      if (featuredOnly && !g.guide.featured) return false;
      if (q && !g.guide.title.toLowerCase().includes(q) && !g.guide.body.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [guides, query, featuredOnly]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {canPost && (
          <Button type="button" onClick={() => setShowForm((v) => !v)} className="w-auto shrink-0">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Write a guide"}
          </Button>
        )}
      </div>

      <div className="mb-5 flex items-center">
        <label className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="h-3.5 w-3.5 rounded border-border" />
          Featured only
        </label>
      </div>

      {showForm && (
        <div className="mb-5">
          <NewGuideForm communityId={communityId} communitySlug={communitySlug} spaceId={spaceId} spaceSlug={spaceSlug} onDone={() => setShowForm(false)} />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<BookOpenCheck className="h-6 w-6" />}
          title={guides.length === 0 ? "No guides yet" : "Nothing matches"}
          description={guides.length === 0 ? "Best coffee, hidden gems, first week here — guides members write will show up here." : "Try a different search."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((data) => (
            <GuideCard key={data.guide.id} data={data} communitySlug={communitySlug} spaceSlug={spaceSlug} />
          ))}
        </div>
      )}
    </div>
  );
}
