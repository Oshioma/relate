"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { subscribeToSpace } from "./paywall-actions";
import { subscribeToTier } from "../../membership-actions";

function formatPrice(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

export type PaywallTier = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  // Total spaces this tier unlocks.
  spaceCount: number;
};

// The gate shown in place of a gated space's content when the viewer lacks
// access. A space can be unlocked by its own per-space subscription (when
// priceCents > 0) and/or by joining any membership tier that includes it.
// Signed-in members get Subscribe/Join buttons that start Stripe Checkout;
// guests are prompted to sign in first.
export function SpacePaywall({
  spaceId,
  spaceName,
  spaceDescription,
  priceCents,
  currency,
  communitySlug,
  spaceSlug,
  isSignedIn,
  paymentsReady,
  acceptingSubscriptions = true,
  tiers = [],
  justSubscribed = false,
}: {
  spaceId: string;
  spaceName: string;
  spaceDescription: string | null;
  priceCents: number;
  currency: string;
  communitySlug: string;
  spaceSlug: string;
  isSignedIn: boolean;
  paymentsReady: boolean;
  // False when the community's plan has lapsed past its grace window: existing
  // subscribers keep their access, but nobody new can subscribe. Better said
  // plainly here than as an error after a click.
  acceptingSubscriptions?: boolean;
  // Membership tiers that unlock this space (join options).
  tiers?: PaywallTier[];
  // The viewer just came back from Checkout — access is granted by the webhook,
  // which can land a moment after the redirect, so nudge them to refresh
  // instead of showing a bare paywall as if nothing happened.
  justSubscribed?: boolean;
}) {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribeSpace() {
    setBusyKey("space");
    setError(null);
    const result = await subscribeToSpace(spaceId, communitySlug, spaceSlug);
    if ("url" in result) {
      window.location.assign(result.url);
      return;
    }
    setError(result.error);
    setBusyKey(null);
  }

  async function handleSubscribeTier(tierId: string) {
    setBusyKey(tierId);
    setError(null);
    const result = await subscribeToTier(tierId, communitySlug);
    if ("url" in result) {
      window.location.assign(result.url);
      return;
    }
    setError(result.error);
    setBusyKey(null);
  }

  const price = formatPrice(priceCents, currency);
  const hasSpacePrice = priceCents > 0;
  const returnTo = `/c/${communitySlug}/spaces/${spaceSlug}`;
  const busy = busyKey !== null;

  if (justSubscribed) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Payment received</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;re finalizing your access to {spaceName}. This usually takes a few seconds.
          </p>
          <Button className="mt-6 w-full" size="lg" onClick={() => window.location.assign(returnTo)}>
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="pt-8 pb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{spaceName}</h1>
        {spaceDescription && <RichText content={spaceDescription} className="mt-2 text-sm text-muted-foreground" />}

        {!isSignedIn ? (
          <div className="mt-6">
            <Link
              href={`/login?next=${encodeURIComponent(returnTo)}`}
              className="inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
            >
              Sign in to unlock
            </Link>
          </div>
        ) : !paymentsReady ? (
          <p className="mt-6 text-sm text-muted-foreground">
            This community hasn&apos;t finished setting up payments yet. Check back soon.
          </p>
        ) : !acceptingSubscriptions ? (
          <p className="mt-6 text-sm text-muted-foreground">
            This space isn&apos;t accepting new subscriptions right now. Check back soon, or ask the community&apos;s
            admins about it.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {hasSpacePrice && (
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {price}
                  <span className="text-base font-normal text-muted-foreground"> / month</span>
                </p>
                <Button className="mt-3 w-full" size="lg" onClick={handleSubscribeSpace} disabled={busy}>
                  {busyKey === "space" ? "Starting checkout…" : `Subscribe for ${price}/mo`}
                </Button>
              </div>
            )}

            {tiers.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {hasSpacePrice ? "Or join a membership" : "Join a membership to unlock this"}
                </p>
                <div className="space-y-2">
                  {tiers.map((tier) => (
                    <div key={tier.id} className="rounded-md border border-border p-3 text-left">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{tier.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(tier.priceCents, tier.currency)}/mo · unlocks {tier.spaceCount} space
                            {tier.spaceCount === 1 ? "" : "s"}
                          </p>
                          {tier.description && <p className="mt-1 text-xs text-muted-foreground">{tier.description}</p>}
                        </div>
                        <Button size="sm" className="w-auto shrink-0" onClick={() => handleSubscribeTier(tier.id)} disabled={busy}>
                          {busyKey === tier.id ? "…" : "Join"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!hasSpacePrice && tiers.length === 0 && (
              <p className="text-sm text-muted-foreground">This space isn&apos;t available to join right now.</p>
            )}
          </div>
        )}

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        <p className="mt-4 text-xs text-muted-foreground">
          Secure payment by Stripe. Cancel anytime — you keep access until the end of the paid period.
        </p>
      </CardContent>
    </Card>
  );
}
