"use client";

import { useRef, useState } from "react";
import { addGuideComment } from "./guides-actions";
import { Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function GuideCommentForm({ guideId, communitySlug, spaceSlug }: { guideId: string; communitySlug: string; spaceSlug: string }) {
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await addGuideComment(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-2">
      <input type="hidden" name="guide_id" value={guideId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <Textarea name="body" rows={2} placeholder="Add a comment…" required />
      {error && <p className="text-xs text-danger">{error}</p>}
      <SubmitButton pendingText="Posting…" className="w-auto">
        Comment
      </SubmitButton>
    </form>
  );
}
