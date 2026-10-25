"use client";

import { useActionState, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { updateCommunityGuidelines, type CommunityGuidelinesState } from "./actions";
import { RichEditor } from "@/components/ui/rich-editor";
import { SubmitButton } from "@/components/ui/submit-button";
import { clearFormDraft, readJsonDraft, writeJsonDraft } from "@/lib/use-form-draft";
import type { Community } from "@/types/database";

interface GuidelinesDraft {
  guidelines: string;
  showInNav: boolean;
}

// Nothing else writes this key mid-visit, so there's nothing to subscribe to.
const noSubscription = () => () => {};

function parseDraft(raw: string): GuidelinesDraft | null {
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw) as Partial<GuidelinesDraft>;
    if (typeof draft.guidelines !== "string" || typeof draft.showInNav !== "boolean") return null;
    return { guidelines: draft.guidelines, showInNav: draft.showInNav };
  } catch {
    return null;
  }
}

// The guidelines text plus whether its link shows in the sidebar and mobile
// menu. Unsaved edits are kept as a draft and put back after a refresh.
export function CommunityGuidelinesForm({ community }: { community: Community }) {
  const [state, formAction] = useActionState<CommunityGuidelinesState, FormData>(updateCommunityGuidelines, undefined);

  const draftKey = `community-guidelines:${community.id}`;
  // Read as an external store: nothing on the server or during hydration,
  // the saved draft afterwards — so there's no mismatch.
  const savedRaw = useSyncExternalStore(noSubscription, () => readJsonDraft(draftKey), () => "");
  const saved = useMemo(() => parseDraft(savedRaw), [savedRaw]);
  const stored: GuidelinesDraft = { guidelines: community.guidelines ?? "", showInNav: community.guidelines_show_in_nav !== false };

  // What's been changed this visit; until then, the saved draft or the stored values.
  const [edited, setEdited] = useState<GuidelinesDraft | null>(null);
  const draft = edited ?? saved ?? stored;

  function update(patch: Partial<GuidelinesDraft>) {
    const next = { ...draft, ...patch };
    setEdited(next);
    // The editor reports its value on mount too, so only keep a draft that
    // actually differs from what's saved.
    if (next.guidelines === stored.guidelines && next.showInNav === stored.showInNav) clearFormDraft(draftKey);
    else writeJsonDraft(draftKey, next);
  }

  // Saved, so the draft has done its job.
  useEffect(() => {
    if (state && "ok" in state) clearFormDraft(draftKey);
  }, [state, draftKey]);

  return (
    <form action={formAction} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={community.id} />
      <input type="hidden" name="community_slug" value={community.slug} />

      <p className="text-sm text-muted-foreground">
        House rules or a code of conduct for {community.name}. Members and visitors can read them at{" "}
        <span className="font-medium text-foreground">/c/{community.slug}/guidelines</span>. Leave empty to hide the
        page.
      </p>

      <RichEditor
        // The editor keeps its own copy of the text, so remount it when a
        // restored draft arrives after hydration.
        key={saved ? "draft" : "stored"}
        id="community_guidelines"
        name="guidelines"
        rows={10}
        defaultValue={draft.guidelines}
        placeholder="Be kind. No spam. Keep discussion on-topic…"
        onChange={(guidelines) => update({ guidelines })}
      />

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          name="show_in_nav"
          checked={draft.showInNav}
          onChange={(e) => update({ showInNav: e.target.checked })}
          className="h-4 w-4 rounded border-border"
        />
        Show in navigation
      </label>
      <p className="-mt-2 pl-6 text-xs text-muted-foreground">
        Untick to keep the page live (anyone with the link can still read it) but hide it from the sidebar and menu.
      </p>

      {state && "error" in state && <p className="text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && <p className="text-sm text-accent">Guidelines saved.</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save guidelines
      </SubmitButton>
    </form>
  );
}
