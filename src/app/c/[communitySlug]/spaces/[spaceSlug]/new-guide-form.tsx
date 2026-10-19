"use client";

import { useCallback, useRef, useState } from "react";
import { createGuide } from "./guides-actions";
import { Input, Label } from "@/components/ui/input";
import { RichEditor } from "@/components/ui/rich-editor";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormDraftRef } from "@/lib/use-form-draft";

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
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // The editor keeps its HTML in React, so a restored draft is handed back as
  // its starting value and the editor remounted to take it. The mirror input
  // is what the draft saves; the action ignores it.
  const [bodySeed, setBodySeed] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const bodyMirrorRef = useRef<HTMLInputElement>(null);
  const lastBodyRef = useRef("");

  const onRestore = useCallback((values: Record<string, string | string[]>) => {
    if (typeof values.body_draft === "string" && values.body_draft) {
      lastBodyRef.current = values.body_draft;
      if (bodyMirrorRef.current) bodyMirrorRef.current.value = values.body_draft;
      setBodySeed(values.body_draft);
      setEditorKey((k) => k + 1);
    }
  }, []);
  const { clear: clearDraft, saveNow } = useFormDraftRef(formRef, `new-guide:${spaceId}`, { onRestore });

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createGuide(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      clearDraft();
      formRef.current?.reset();
      lastBodyRef.current = "";
      setBodySeed("");
      setEditorKey((k) => k + 1);
      onDone?.();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <input type="hidden" name="space_id" value={spaceId} />
      <input type="hidden" name="space_slug" value={spaceSlug} />
      <input ref={bodyMirrorRef} type="hidden" name="body_draft" data-draft />

      <div>
        <Label htmlFor="guide_title">Title</Label>
        <Input id="guide_title" name="title" placeholder="First Week Guide" required />
      </div>

      <div>
        <Label htmlFor="guide_body">Write the guide</Label>
        <RichEditor
          key={editorKey}
          id="guide_body"
          name="body"
          rows={10}
          defaultValue={bodySeed}
          placeholder="What should someone know? Add pictures and videos from the toolbar, or switch to HTML to paste your own."
          allowMedia
          onChange={(value) => {
            // Fires on mount too; only a real change is worth a save, or the
            // empty mount would overwrite the draft before it's restored.
            if (value === lastBodyRef.current) return;
            lastBodyRef.current = value;
            if (bodyMirrorRef.current) bodyMirrorRef.current.value = value;
            saveNow();
          }}
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <SubmitButton pendingText="Publishing…" className="w-auto">
        Publish guide
      </SubmitButton>
    </form>
  );
}
