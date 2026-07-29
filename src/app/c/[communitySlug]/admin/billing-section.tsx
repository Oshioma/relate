"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { startStripeConnectOnboarding, refreshStripeAccountStatus } from "./billing-actions";

// Owner-facing Stripe Connect status + onboarding. When the owner returns from
// Stripe (return_url carries ?stripe=return) we refresh the account's status
// once, so a freshly-completed onboarding flips to "ready" without waiting on
// the webhook.
export function BillingSection({
  communityId,
  communitySlug,
  stripeAccountId,
  chargesEnabled,
  platformConfigured,
  justReturned,
}: {
  communityId: string;
  communitySlug: string;
  stripeAccountId: string | null;
  chargesEnabled: boolean;
  platformConfigured: boolean;
  justReturned: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshed = useRef(false);

  useEffect(() => {
    if (justReturned && stripeAccountId && !chargesEnabled && !refreshed.current) {
      refreshed.current = true;
      refreshStripeAccountStatus(communityId, communitySlug).then((r) => {
        if ("chargesEnabled" in r && r.chargesEnabled) router.refresh();
      });
    }
  }, [justReturned, stripeAccountId, chargesEnabled, communityId, communitySlug, router]);

  async function handleConnect() {
    setBusy(true);
    setError(null);
    const result = await startStripeConnectOnboarding(communityId);
    if ("url" in result) {
      window.location.href = result.url;
      return;
    }
    setError(result.error);
    setBusy(false);
  }

  async function handleRefresh() {
    setBusy(true);
    setError(null);
    const result = await refreshStripeAccountStatus(communityId, communitySlug);
    if ("error" in result) setError(result.error);
    else router.refresh();
    setBusy(false);
  }

  if (!platformConfigured) {
    return (
      <Card>
        <CardContent className="pt-5">
          <p className="text-sm text-muted-foreground">
            Payments aren&apos;t enabled on this platform yet. Once the operator configures Stripe, you&apos;ll be able to
            connect an account here and charge members for individual spaces.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <CreditCard className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            {chargesEnabled ? (
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent" /> Payments connected
              </p>
            ) : stripeAccountId ? (
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <AlertCircle className="h-4 w-4 text-danger" /> Setup incomplete
              </p>
            ) : (
              <p className="text-sm font-medium text-foreground">Connect Stripe to charge for spaces</p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              {chargesEnabled
                ? "You can set a monthly price on any space (Spaces → edit). Members pay you directly through Stripe — you keep 100% of every charge."
                : "You collect payments with your own Stripe account. You're the merchant of record and keep 100% of what members pay; Stripe handles payouts, tax forms and disputes."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" onClick={handleConnect} disabled={busy}>
                {busy ? "Working…" : chargesEnabled ? "Manage on Stripe" : stripeAccountId ? "Finish setup" : "Connect Stripe"}
              </Button>
              {stripeAccountId && (
                <Button size="sm" variant="secondary" onClick={handleRefresh} disabled={busy}>
                  Refresh status
                </Button>
              )}
            </div>

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
