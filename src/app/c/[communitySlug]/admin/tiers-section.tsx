"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTier, type TierFormState } from "./tier-actions";
import { TierRow } from "./tier-row";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { TierWithSpaces } from "@/lib/data/tiers";

export function TiersSection({
  communityId,
  communitySlug,
  tiers,
  spaces,
}: {
  communityId: string;
  communitySlug: string;
  tiers: TierWithSpaces[];
  // Assignable spaces (non-public) in this community.
  spaces: { id: string; name: string }[];
}) {
  const [state, action, isPending] = useActionState<TierFormState, FormData>(createTier, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !isPending && !state?.error) formRef.current?.reset();
    wasPending.current = isPending;
  }, [isPending, state]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <form ref={formRef} action={action} className="space-y-3">
            <input type="hidden" name="community_id" value={communityId} />
            <input type="hidden" name="community_slug" value={communitySlug} />
            <div>
              <Label htmlFor="tier-name">New tier name</Label>
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
            {state?.error && <p className="text-sm text-danger">{state.error}</p>}
            <SubmitButton className="w-auto" pendingText="Creating…">
              Add tier
            </SubmitButton>
          </form>
        </CardContent>
      </Card>

      {tiers.length > 0 && (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {tiers.map((tier) => (
              <TierRow key={tier.id} tier={tier} communitySlug={communitySlug} spaces={spaces} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
