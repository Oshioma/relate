"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { History, Star as StarIcon, Trash2, Pencil, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input, Textarea } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { StarRatingDisplay, StarRatingInput } from "./star-rating";
import { updateGuide, deleteGuide, setGuideFeatured, rateGuide, restoreGuideRevision } from "./guides-actions";
import { GuideCommentForm } from "./guide-comment-form";
import { GuideCommentItem } from "./guide-comment-item";
import type { GuideDetail } from "@/lib/data/guides";

export function GuideDetailView({
  detail,
  communitySlug,
  spaceSlug,
  userId,
  canComment,
  canEdit,
  canDelete,
  isStaff,
}: {
  detail: GuideDetail;
  communitySlug: string;
  spaceSlug: string;
  userId: string;
  canComment: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isStaff: boolean;
}) {
  const { guide, contributors, revisions, comments, avgRating, ratingCount, viewerRating } = detail;
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const router = useRouter();
  const editFormRef = useRef<HTMLFormElement>(null);

  function handleSaveEdit() {
    if (!editFormRef.current) return;
    setEditError(null);
    const formData = new FormData(editFormRef.current);
    startTransition(async () => {
      const result = await updateGuide(undefined, formData);
      if (result?.error) {
        setEditError(result.error);
      } else {
        setIsEditing(false);
        router.refresh();
      }
    });
  }

  function handleRate(rating: number) {
    setError(null);
    startTransition(async () => {
      const result = await rateGuide(guide.id, rating, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete "${guide.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteGuide(guide.id, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.push(`/c/${communitySlug}/spaces/${spaceSlug}`);
    });
  }

  function toggleFeatured() {
    startTransition(async () => {
      const result = await setGuideFeatured(guide.id, !guide.featured, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  function handleRestore(revisionId: string) {
    if (!window.confirm("Restore this version? The current version will be saved to history first.")) return;
    startTransition(async () => {
      const result = await restoreGuideRevision(revisionId, guide.id, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {!isEditing && <h1 className="text-xl font-semibold tracking-tight text-foreground">{guide.title}</h1>}
              {guide.featured && <Badge tone="accent">Featured</Badge>}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {isStaff && (
                <button type="button" disabled={isPending} onClick={toggleFeatured} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-60" title={guide.featured ? "Unfeature" : "Feature"}>
                  <StarIcon className={`h-4 w-4 ${guide.featured ? "fill-accent text-accent" : ""}`} />
                </button>
              )}
              {canEdit && !isEditing && (
                <button type="button" onClick={() => setIsEditing(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" title="Edit guide">
                  <Pencil className="h-4 w-4" />
                </button>
              )}
              {canDelete && (
                <button type="button" disabled={isPending} onClick={handleDelete} className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger disabled:opacity-60" title="Delete guide">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <form
              ref={editFormRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
              className="mt-4 space-y-3"
            >
              <input type="hidden" name="guide_id" value={guide.id} />
              <input type="hidden" name="community_slug" value={communitySlug} />
              <input type="hidden" name="space_slug" value={spaceSlug} />
              <Input name="title" defaultValue={guide.title} required />
              <Textarea name="body" rows={10} defaultValue={guide.body} required />
              {editError && <p className="text-sm text-danger">{editError}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending} className="w-auto">
                  {isPending ? "Saving…" : "Save changes"}
                </Button>
                <Button type="button" variant="secondary" disabled={isPending} onClick={() => setIsEditing(false)} className="w-auto">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{guide.body}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-4">
              <StarRatingDisplay value={avgRating} count={ratingCount} />
              {contributors.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-2">
                    {contributors.slice(0, 5).map((profile) => (
                      <Avatar key={profile.id} src={profile.avatar_url} name={profile.full_name || profile.username} size={22} className="ring-2 ring-card" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {contributors.length} {contributors.length === 1 ? "contributor" : "contributors"}
                  </span>
                </div>
              )}
            </div>

            {canComment && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Your rating:</span>
                <StarRatingInput value={viewerRating} onChange={handleRate} disabled={isPending} />
              </div>
            )}
          </div>

          {error && <p className="mt-2 text-xs text-danger">{error}</p>}
        </CardContent>
      </Card>

      {revisions.length > 0 && (
        <div>
          <button type="button" onClick={() => setShowHistory((v) => !v)} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
            <History className="h-3.5 w-3.5" />
            {showHistory ? "Hide" : "Show"} revision history ({revisions.length})
          </button>
          {showHistory && (
            <div className="mt-2 space-y-2">
              {revisions.map((revision) => (
                <div key={revision.id} className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2 text-xs">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{revision.title}</p>
                    <p className="text-muted-foreground">{formatDate(revision.created_at)}</p>
                  </div>
                  {canEdit && (
                    <button type="button" disabled={isPending} onClick={() => handleRestore(revision.id)} className="shrink-0 font-medium text-accent hover:underline disabled:opacity-60">
                      Restore
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
        <div className="mb-4 space-y-3">
          {comments.map((comment) => (
            <GuideCommentItem
              key={comment.id}
              comment={comment}
              canDelete={isStaff || comment.author_id === userId}
              communitySlug={communitySlug}
              spaceSlug={spaceSlug}
              guideId={guide.id}
            />
          ))}
          {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
        </div>
        {canComment && <GuideCommentForm guideId={guide.id} communitySlug={communitySlug} spaceSlug={spaceSlug} />}
      </div>
    </div>
  );
}
