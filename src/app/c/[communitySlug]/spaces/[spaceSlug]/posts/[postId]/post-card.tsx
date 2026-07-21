"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { MediaAttachment } from "@/components/ui/media-attachment";
import { formatRelativeTime } from "@/lib/utils";
import { updatePost, deletePost } from "../../actions";
import type { PostWithAuthor } from "@/lib/data/posts";

export function PostCard({
  post,
  canEdit,
  canDelete,
  communitySlug,
  spaceSlug,
}: {
  post: PostWithAuthor;
  canEdit: boolean;
  canDelete: boolean;
  communitySlug: string;
  spaceSlug: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSave() {
    setError(null);
    const formData = new FormData();
    formData.set("title", title);
    formData.set("body", body);

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
            <Textarea id="edit_body" rows={4} value={body} onChange={(event) => setBody(event.target.value)} />
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

  return (
    <Card className="mb-6">
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
            {post.body && <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{post.body}</p>}
            {post.media_url && (
              <div className="mt-3">
                <MediaAttachment url={post.media_url} />
              </div>
            )}

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
