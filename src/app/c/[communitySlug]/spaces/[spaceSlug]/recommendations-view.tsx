"use client";

import { useMemo, useState } from "react";
import { Plus, Search, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { RECOMMENDATION_CATEGORIES } from "@/lib/recommendation-categories";
import { NewRecommendationForm } from "./new-recommendation-form";
import { RecommendationCard } from "./recommendation-card";
import type { RecommendationWithVotes } from "@/lib/data/recommendations";
import type { RecommendationCategory } from "@/types/database";

export function RecommendationsView({
  recommendations,
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  canPost,
  isStaff,
  userId,
}: {
  recommendations: RecommendationWithVotes[];
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  canPost: boolean;
  isStaff: boolean;
  userId: string;
}) {
  const [category, setCategory] = useState<RecommendationCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [sortByVotes, setSortByVotes] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = recommendations.filter((r) => {
      if (category !== "all" && r.recommendation.category !== category) return false;
      if (q && !r.recommendation.title.toLowerCase().includes(q) && !(r.recommendation.note ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
    if (sortByVotes) return [...list].sort((a, b) => b.voteCount - a.voteCount);
    return list;
  }, [recommendations, category, query, sortByVotes]);

  const countByCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of recommendations) {
      counts.set(r.recommendation.category, (counts.get(r.recommendation.category) ?? 0) + 1);
    }
    return counts;
  }, [recommendations]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recommendations…"
            className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        {canPost && (
          <Button type="button" onClick={() => setShowForm((v) => !v)} className="w-auto shrink-0">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Recommend something"}
          </Button>
        )}
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${category === "all" ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
        >
          All ({recommendations.length})
        </button>
        {RECOMMENDATION_CATEGORIES.map((c) => {
          const count = countByCategory.get(c.value) ?? 0;
          if (count === 0) return null;
          const isActive = category === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(isActive ? "all" : c.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${isActive ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}
            >
              {c.label} ({count})
            </button>
          );
        })}

        <label className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <input type="checkbox" checked={sortByVotes} onChange={(e) => setSortByVotes(e.target.checked)} className="h-3.5 w-3.5 rounded border-border" />
          Most agreed first
        </label>
      </div>

      {showForm && (
        <div className="mb-5">
          <NewRecommendationForm
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
          icon={<Star className="h-6 w-6" />}
          title={recommendations.length === 0 ? "No recommendations yet" : "Nothing matches"}
          description={recommendations.length === 0 ? "Restaurants, activities, services and more members vouch for will show up here." : "Try a different search or category."}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((data) => (
            <RecommendationCard
              key={data.recommendation.id}
              data={data}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              canManage={isStaff || data.recommendation.recommended_by === userId}
              canInteract={canPost}
            />
          ))}
        </div>
      )}
    </div>
  );
}
