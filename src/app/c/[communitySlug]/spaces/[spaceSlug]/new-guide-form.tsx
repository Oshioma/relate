"use client";

import { useActionState, useRef, useEffect } from "react";
import { createGuide, type GuideFormState } from "./guides-actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function NewGuideForm({
  communityId,
  communitySlug,
  spaceId,
  spaceSlug,
  onDone,
}: {
  communityId: string;
  communitySlug: string;
  spaceId: string;
  spaceSlug: string;
  onDone?: () => void;
}) {
  const [state, formAction] = useActionState<GuideFormState, FormData>(createGuide, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === undefined) {
      formRef.current?.reset();
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />

      <div>
        <Label htmlFor="guide_title">Title</Label>
        <Input id="guide_title" name="title" placeholder="First Week Guide" required />
      </div>

      <div>
        <Label htmlFor="guide_body">Write the guide</Label>
        <Textarea id="guide_body" name="body" rows={8} placeholder="What should someone know?" required />
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Publishing…" className="w-auto">
        Publish guide
      </SubmitButton>
    </form>
  );
}
