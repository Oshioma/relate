"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { formatRelativeTime } from "@/lib/utils";
import { updateComment, deleteComment } from "../../actions";
import type { CommentWithAuthor } from "@/lib/data/posts";

export function CommentItem({
  comment,
  canEdit,
  canDelete,
  communitySlug,
  spaceSlug,
  postId,
}: {
  comment: CommentWithAuthor;
  canEdit: boolean;
  canDelete: boolean;
  communitySlug: string;
  spaceSlug: string;
  postId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = useState(comment.body);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSave() {
    setError(null);
    const formData = new FormData();
    formData.set("body", body);

    startTransition(async () => {
      const result = await updateComment(comment.id, communitySlug, spaceSlug, postId, undefined, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!window.confirm("Delete this comment?")) return;

    startTransition(async () => {
      const result = await deleteComment(comment.id, communitySlug, spaceSlug, postId);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex items-start gap-3">
      <Avatar src={comment.author?.avatar_url} name={comment.author?.full_name || comment.author?.username} size={28} />
      <div className="min-w-0 flex-1 rounded-lg bg-muted px-3 py-2">
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-medium text-foreground">{comment.author?.full_name || comment.author?.username}</p>
          <p className="text-xs text-muted-foreground">{formatRelativeTime(comment.created_at)}</p>
        </div>

        {isEditing ? (
          <div className="mt-1.5 space-y-2">
            <Textarea rows={2} value={body} onChange={(event) => setBody(event.target.value)} />
            {error && <p className="text-xs text-danger">{error}</p>}
            <div className="flex gap-2">
              <Button size="sm" disabled={isPending} onClick={handleSave}>
                {isPending ? "Saving…" : "Save"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={isPending}
                onClick={() => {
                  setBody(comment.body);
                  setError(null);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">{comment.body}</p>
            {(canEdit || canDelete) && (
              <div className="mt-1.5 flex gap-3">
                {canEdit && (
                  <button type="button" onClick={() => setIsEditing(true)} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button type="button" onClick={handleDelete} disabled={isPending} className="text-xs font-medium text-danger hover:underline disabled:opacity-60">
                    Delete
                  </button>
                )}
              </div>
            )}
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
