"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimelineSource } from "@/types/database";
import { ClaimFields } from "./claim-fields";
import { addDateClaim } from "./actions";
import { emptyClaimDraft, resolveDateInput, type ClaimDraft } from "@/lib/timeline/draft";

/** "Another source says something different" — the same panel the wizard's last step uses. */
export function AddClaimForm({
  communitySlug,
  eventId,
  sources,
  claimCount,
}: {
  communitySlug: string;
  eventId: string;
  sources: TimelineSource[];
  claimCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [claim, setClaim] = useState<ClaimDraft>(emptyClaimDraft());
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setError(null);
    if (!resolveDateInput(claim.start)) {
      setError("Fill in the date first.");
      return;
    }
    setSaving(true);
    const formData = new FormData();
    formData.set("community_slug", communitySlug);
    formData.set("event_id", eventId);
    formData.set("claim", JSON.stringify(claim));
    const result = await addDateClaim(undefined, formData);
    setSaving(false);
    if (result && "error" in result) {
      setError(result.error);
      return;
    }
    setClaim(emptyClaimDraft());
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <div className="rounded-xl border border-dashed border-border p-4 text-center">
        <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> Add another proposed date
        </Button>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Add another date if another source gives a different chronology for this event.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ClaimFields value={claim} onChange={setClaim} sources={sources} index={claimCount} />
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button type="button" onClick={submit} disabled={saving}>
          {saving ? "Saving…" : "Add this date"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={saving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
