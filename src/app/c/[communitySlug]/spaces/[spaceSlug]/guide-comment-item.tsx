"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import { deleteGuideComment } from "./guides-actions";
import type { GuideComment, Profile } from "@/types/database";

export function GuideCommentItem({
  comment,
  canDelete,
  communitySlug,
  spaceSlug,
  guideId,
}: {
  comment: GuideComment & { author: Profile };
  canDelete: boolean;
  communitySlug: string;
  spaceSlug: string;
  guideId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!window.confirm("Delete this comment?")) return;
    startTransition(async () => {
      await deleteGuideComment(comment.id, guideId, communitySlug, spaceSlug);
      router.refresh();
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
        <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">{comment.body}</p>
        {canDelete && (
          <button type="button" disabled={isPending} onClick={handleDelete} className="mt-1.5 text-xs font-medium text-danger hover:underline disabled:opacity-60">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
