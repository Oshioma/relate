"use client";

import { useActionState, useRef, useEffect } from "react";
import { createPost, type PostFormState } from "./actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

interface NewPostFormProps {
  communityId: string;
  spaceId: string;
  communitySlug: string;
  spaceSlug: string;
}

export function NewPostForm({ communityId, spaceId, communitySlug, spaceSlug }: NewPostFormProps) {
  const [state, formAction] = useActionState<PostFormState, FormData>(createPost, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="What's on your mind?" required />
      </div>

      <div>
        <Label htmlFor="body">Details (optional)</Label>
        <Textarea id="body" name="body" rows={3} placeholder="Say more…" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <select
          name="post_type"
          defaultValue="discussion"
          className="rounded-md border border-border bg-card px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="discussion">Discussion</option>
          <option value="announcement">Announcement</option>
          <option value="resource">Resource</option>
        </select>
        <SubmitButton pendingText="Posting…" className="w-auto">
          Post
        </SubmitButton>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
    </form>
  );
}
