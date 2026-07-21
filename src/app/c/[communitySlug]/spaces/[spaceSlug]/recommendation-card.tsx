"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, MapPin, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import { recommendationCategoryLabel } from "@/lib/recommendation-categories";
import { deleteRecommendation, agreeWithRecommendation, unagreeWithRecommendation } from "./recommendations-actions";
import type { RecommendationWithVotes } from "@/lib/data/recommendations";

export function RecommendationCard({
  data,
  communitySlug,
  spaceSlug,
  canManage,
}: {
  data: RecommendationWithVotes;
  communitySlug: string;
  spaceSlug: string;
  canManage: boolean;
}) {
  const { recommendation, recommendedBy, voteCount, viewerVoted } = data;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function toggleAgree() {
    setError(null);
    startTransition(async () => {
      const result = viewerVoted
        ? await unagreeWithRecommendation(recommendation.id, communitySlug, spaceSlug)
        : await agreeWithRecommendation(recommendation.id, communitySlug, spaceSlug);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!window.confirm(`Remove your recommendation for "${recommendation.title}"?`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteRecommendation(recommendation.id, communitySlug, spaceSlug);
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
              <h3 className="text-sm font-semibold text-foreground">{recommendation.title}</h3>
              <Badge tone="accent">{recommendationCategoryLabel(recommendation.category)}</Badge>
            </div>
            {recommendation.location_label && (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {recommendation.location_label}
              </p>
            )}
          </div>
          {canManage && (
            <button
              type="button"
              title="Remove recommendation"
              disabled={isPending}
              onClick={handleDelete}
              className="shrink-0 text-muted-foreground hover:text-danger disabled:opacity-60"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {recommendation.note && <p className="mt-2 text-sm text-foreground">{recommendation.note}</p>}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar src={recommendedBy?.avatar_url} name={recommendedBy?.full_name || recommendedBy?.username} size={24} />
            <p className="min-w-0 truncate text-xs text-muted-foreground">
              {recommendedBy?.full_name || recommendedBy?.username} · {formatRelativeTime(recommendation.created_at)}
            </p>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={toggleAgree}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium disabled:opacity-60 ${
              viewerVoted ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-muted-foreground/40"
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {voteCount > 0 ? voteCount : ""} {viewerVoted ? "Agreed" : "Agree"}
          </button>
        </div>

        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      </CardContent>
    </Card>
  );
}
