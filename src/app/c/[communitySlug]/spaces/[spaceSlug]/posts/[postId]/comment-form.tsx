"use client";

import { useRef, useState } from "react";
import { createComment } from "../../actions";
import { Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

interface CommentFormProps {
  postId: string;
  communitySlug: string;
  spaceSlug: string;
}

export function CommentForm({ postId, communitySlug, spaceSlug }: CommentFormProps) {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createComment(postId, communitySlug, spaceSlug, undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-2">
      <Textarea name="body" rows={2} placeholder="Write a comment…" required />
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex justify-end">
        <SubmitButton pendingText="Posting…" className="w-auto">
          Comment
        </SubmitButton>
      </div>
    </form>
  );
}
