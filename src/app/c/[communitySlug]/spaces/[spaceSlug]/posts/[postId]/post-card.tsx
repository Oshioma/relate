"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { RichEditor } from "@/components/ui/rich-editor";
import { RichText } from "@/components/ui/rich-text";
import { MediaAttachment } from "@/components/ui/media-attachment";
import { formatRelativeTime, isImageUrl, isVideoUrl } from "@/lib/utils";
import { updatePost, deletePost, togglePostReaction } from "../../actions";
import { PostImagePicker, type CropPhotoOption, type FarmCropPhotoOption } from "../../post-image-picker";
import { SMILE_EMOJI } from "@/lib/post-reactions";
import { cn } from "@/lib/utils";
import type { PostWithAuthor } from "@/lib/data/posts";

export function PostCard({
  post,
  canEdit,
  canDelete,
  communitySlug,
  spaceSlug,
  crops = [],
  myCrops = [],
  avatarUrl = null,
  reactionCount = 0,
  viewerReacted = false,
  canReact = false,
}: {
  post: PostWithAuthor;
  canEdit: boolean;
  canDelete: boolean;
  communitySlug: string;
  spaceSlug: string;
  crops?: CropPhotoOption[];
  myCrops?: FarmCropPhotoOption[];
  avatarUrl?: string | null;
  reactionCount?: number;
  viewerReacted?: boolean;
  canReact?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body ?? "");
  const [mediaUrl, setMediaUrl] = useState<string | null>(post.media_url);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Optimistic reaction state so the smile toggles instantly.
  const [reacted, setReacted] = useState(viewerReacted);
  const [reactions, setReactions] = useState(reactionCount);
  const [isReacting, startReacting] = useTransition();
  const router = useRouter();

  function toggleReaction() {
    const next = !reacted;
    setReacted(next);
    setReactions((n) => n + (next ? 1 : -1));
    startReacting(async () => {
      const result = await togglePostReaction(post.id, communitySlug, spaceSlug, !next);
      if (result?.error) {
        // Revert on failure.
        setReacted(!next);
        setReactions((n) => n + (next ? -1 : 1));
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleSave() {
    setError(null);
    const formData = new FormData();
    formData.set("title", title);
    formData.set("body", body);
    formData.set("media_url", mediaUrl ?? "");

    startTransition(async () => {
      const result = await updatePost(post.id, communitySlug, spaceSlug, undefined, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setIsEditing(false);
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!window.confirm("Delete this post? This can't be undone.")) return;

    startTransition(async () => {
      const result = await deletePost(post.id, communitySlug, spaceSlug);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push(`/c/${communitySlug}/spaces/${spaceSlug}`);
      }
    });
  }

  if (isEditing) {
    return (
      <Card className="mb-6">
        <CardContent className="space-y-3 pt-6">
          <div>
            <Label htmlFor="edit_title">Title</Label>
            <Input id="edit_title" value={title} onChange={(event) => setTitle(event.target.value)} required />
          </div>
          <div>
            <Label htmlFor="edit_body">Details</Label>
            <RichEditor id="edit_body" name="edit_body" rows={4} defaultValue={post.body ?? ""} onChange={setBody} />
          </div>
          <div>
            <Label>Photo</Label>
            <PostImagePicker mediaUrl={mediaUrl} onChange={setMediaUrl} crops={crops} myCrops={myCrops} avatarUrl={avatarUrl} />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex gap-2">
            <Button size="sm" disabled={isPending} onClick={handleSave}>
              {isPending ? "Saving…" : "Save"}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={isPending}
              onClick={() => {
                setTitle(post.title);
                setBody(post.body ?? "");
                setMediaUrl(post.media_url);
                setError(null);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Photos and videos lead as a full-width banner; documents stay an inline
  // download link within the body.
  const bannerUrl = post.media_url && (isImageUrl(post.media_url) || isVideoUrl(post.media_url)) ? post.media_url : null;

  return (
    <Card className="mb-6 overflow-hidden">
      {bannerUrl && (
        <div className="aspect-[16/9] w-full bg-muted">
          {isVideoUrl(bannerUrl) ? (
            <video controls preload="metadata" src={bannerUrl} className="h-full w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bannerUrl} alt="" className="h-full w-full object-cover" />
          )}
        </div>
      )}
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Avatar src={post.author?.avatar_url} name={post.author?.full_name || post.author?.username} size={36} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {post.is_pinned && <Pin className="h-4 w-4 text-accent" />}
              <h1 className="text-lg font-semibold text-foreground">{post.title}</h1>
              <Badge tone="neutral">{post.post_type}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {post.author?.full_name || post.author?.username} · {formatRelativeTime(post.created_at)}
            </p>
            {post.body && <RichText content={post.body} className="mt-3 text-foreground" />}
            {post.media_url && !bannerUrl && (
              <div className="mt-3">
                <MediaAttachment url={post.media_url} />
              </div>
            )}

            <div className="mt-4">
              {canReact ? (
                <button
                  type="button"
                  onClick={toggleReaction}
                  disabled={isReacting}
                  aria-pressed={reacted}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60",
                    reacted ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
                  )}
                >
                  <span aria-hidden className="text-base leading-none">{SMILE_EMOJI}</span>
                  {reactions > 0 && <span>{reactions}</span>}
                  <span>{reacted ? "Smiled" : "Smile"}</span>
                </button>
              ) : (
                reactions > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span aria-hidden className="text-base leading-none">{SMILE_EMOJI}</span>
                    {reactions}
                    <span className="sr-only"> smiles</span>
                  </span>
                )
              )}
            </div>

            {(canEdit || canDelete) && (
              <div className="mt-3 flex gap-3">
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
            {error && !isEditing && <p className="mt-2 text-xs text-danger">{error}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
