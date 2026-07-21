"use client";

import { useActionState, useRef, useEffect } from "react";
import { addGuideComment, type GuideFormState } from "./guides-actions";
import { Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function GuideCommentForm({ guideId, communitySlug, spaceSlug }: { guideId: string; communitySlug: string; spaceSlug: string }) {
  const [state, formAction] = useActionState<GuideFormState, FormData>(addGuideComment, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-2">
      <input type="hidden" name="guide_id" value={guideId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <Textarea name="body" rows={2} placeholder="Add a comment…" required />
      {state?.error && <p className="text-xs text-danger">{state.error}</p>}
      <SubmitButton pendingText="Posting…" className="w-auto">
        Comment
      </SubmitButton>
    </form>
  );
}
