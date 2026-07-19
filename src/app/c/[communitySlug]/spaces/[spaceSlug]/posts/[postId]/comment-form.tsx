"use client";

import { useActionState, useRef, useEffect } from "react";
import { createComment, type PostFormState } from "../../actions";
import { Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

interface CommentFormProps {
  postId: string;
  communitySlug: string;
  spaceSlug: string;
}

export function CommentForm({ postId, communitySlug, spaceSlug }: CommentFormProps) {
  const boundAction = createComment.bind(null, postId, communitySlug, spaceSlug);
  const [state, formAction] = useActionState<PostFormState, FormData>(boundAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <Textarea name="body" rows={2} placeholder="Write a comment…" required />
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <div className="flex justify-end">
        <SubmitButton pendingText="Posting…" className="w-auto">
          Comment
        </SubmitButton>
      </div>
    </form>
  );
}
