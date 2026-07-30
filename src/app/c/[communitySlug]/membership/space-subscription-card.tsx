"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cancelSpaceSubscription, resumeSpaceSubscription } from "../membership-actions";

// A single individually-priced space the member subscribes to, with cancel /
// resume. Mirrors the tier card's management controls.
export function SpaceSubscriptionCard({
  spaceId,
  spaceName,
  spaceHref,
  cancelAtPeriodEnd,
  currentPeriodEnd,
  communitySlug,
}: {
  spaceId: string;
  spaceName: string;
  spaceHref: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  communitySlug: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const periodEndLabel = currentPeriodEnd ? new Date(currentPeriodEnd).toLocaleDateString() : null;

  async function handleCancel() {
    if (!confirm(`Cancel your ${spaceName} subscription? You'll keep access until the end of the paid period.`)) return;
    setBusy(true);
    setError(null);
    const result = await cancelSpaceSubscription(spaceId, communitySlug);
    if (result.error) setError(result.error);
    else router.refresh();
    setBusy(false);
  }

  async function handleResume() {
    setBusy(true);
    setError(null);
    const result = await resumeSpaceSubscription(spaceId, communitySlug);
    if (result.error) setError(result.error);
    else router.refresh();
    setBusy(false);
  }

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={spaceHref} className="text-sm font-semibold text-foreground hover:underline">
              {spaceName}
            </Link>
            {cancelAtPeriodEnd && (
              <p className="mt-1 text-xs text-muted-foreground">
                Cancels{periodEndLabel ? ` on ${periodEndLabel}` : " at the end of the period"}. Access continues until
                then.
              </p>
            )}
          </div>
          <Button
            type="button"
            variant={cancelAtPeriodEnd ? "secondary" : "ghost"}
            size="sm"
            className="w-auto shrink-0"
            onClick={cancelAtPeriodEnd ? handleResume : handleCancel}
            disabled={busy}
          >
            {busy ? "Working…" : cancelAtPeriodEnd ? "Resume" : "Cancel"}
          </Button>
        </div>
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </CardContent>
    </Card>
  );
}
