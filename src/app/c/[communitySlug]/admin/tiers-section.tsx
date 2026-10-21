"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { createTier, type TierFormState } from "./tier-actions";
import { TierRow } from "./tier-row";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormDraftRef } from "@/lib/use-form-draft";
import type { TierSales, TierWithSpaces } from "@/lib/data/tiers";

export function TiersSection({
  communityId,
  communitySlug,
  tiers,
  sales,
  spaces,
}: {
  communityId: string;
  communitySlug: string;
  tiers: TierWithSpaces[];
  // Subscriber counts per tier id (tiers nobody has bought are missing).
  sales: Record<string, TierSales>;
  // Assignable spaces (non-public) in this community.
  spaces: { id: string; name: string }[];
}) {
  const [state, action, isPending] = useActionState<TierFormState, FormData>(createTier, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  // What's typed into the new-tier form survives a refresh until it's saved.
  const { clear: clearDraft } = useFormDraftRef(formRef, `new-tier:${communityId}`);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !isPending && state && "saved" in state) {
      clearDraft();
      formRef.current?.reset();
    }
    wasPending.current = isPending;
  }, [isPending, state, clearDraft]);

  const error = state && "error" in state ? state.error : null;
  const saved = state && "saved" in state ? state.saved : null;
  const liveCount = tiers.filter((t) => !t.archived_at).length;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <form ref={formRef} action={action} className="space-y-3">
            <input type="hidden" name="community_id" value={communityId} />
            <input type="hidden" name="community_slug" value={communitySlug} />
            <p className="text-sm font-medium text-foreground">Add a membership tier</p>
            <div>
              <Label htmlFor="tier-name">Tier name</Label>
              <Input id="tier-name" name="name" placeholder="e.g. Superfan" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="tier-price">Monthly price</Label>
                <Input id="tier-price" name="price" type="number" step="0.01" min="0" placeholder="5.00" required />
              </div>
              <div>
                <Label htmlFor="tier-currency">Currency</Label>
                <Input id="tier-currency" name="currency" defaultValue="usd" maxLength={3} />
              </div>
            </div>
            <div>
              <Label htmlFor="tier-desc">Description (optional)</Label>
              <Textarea id="tier-desc" name="description" rows={2} placeholder="What members get for joining" />
            </div>
            {spaces.length > 0 && (
              <fieldset>
                <legend className="mb-1.5 text-sm font-medium text-foreground">Spaces this tier unlocks</legend>
                <div className="space-y-1.5">
                  {spaces.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="space_ids"
                        value={s.id}
                        className="h-4 w-4 rounded border-border text-accent focus:ring-2 focus:ring-ring"
                      />
                      <span className="text-foreground">{s.name}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">You can change these later.</p>
              </fieldset>
            )}
            {error && <p className="text-sm text-danger">{error}</p>}
            {saved && !isPending && (
              <p role="status" className="flex items-center gap-1.5 text-sm text-accent">
                <CheckCircle2 className="h-4 w-4" />
                Saved. &ldquo;{saved}&rdquo; is now listed under Your tiers below.
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <SubmitButton className="w-auto" pendingText="Saving…">
                Save tier
              </SubmitButton>
              <span className="text-xs text-muted-foreground">Your typing is kept as a draft until you save.</span>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          Your tiers{" "}
          <span className="font-normal text-muted-foreground">
            ({tiers.length === 0 ? "none saved yet" : `${tiers.length} saved, ${liveCount} on sale`})
          </span>
        </p>
        {tiers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No membership tiers are saved yet. Fill in the form above and press Save tier.
          </p>
        ) : (
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {tiers.map((tier) => (
                <TierRow key={tier.id} tier={tier} sales={sales[tier.id]} communitySlug={communitySlug} spaces={spaces} />
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
