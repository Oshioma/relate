"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { subscribeToSpace } from "./paywall-actions";

function formatPrice(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

// The gate shown in place of a paid space's content when the viewer doesn't
// have an active subscription. Signed-in members get a Subscribe button that
// starts Stripe Checkout; guests are prompted to sign in first.
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
  // The viewer just came back from Checkout — access is granted by the webhook,
  // which can land a moment after the redirect, so nudge them to refresh
  // instead of showing a bare paywall as if nothing happened.
  justSubscribed?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setBusy(true);
    setError(null);
    const result = await subscribeToSpace(spaceId, communitySlug, spaceSlug);
    if ("url" in result) {
      window.location.href = result.url;
      return;
    }
    setError(result.error);
    setBusy(false);
  }

  const price = formatPrice(priceCents, currency);
  const returnTo = `/c/${communitySlug}/spaces/${spaceSlug}`;

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

        <p className="mt-5 text-2xl font-semibold text-foreground">
          {price}
          <span className="text-base font-normal text-muted-foreground"> / month</span>
        </p>

        <div className="mt-6">
          {!isSignedIn ? (
            <Link
              href={`/login?next=${encodeURIComponent(returnTo)}`}
              className="inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
            >
              Sign in to subscribe
            </Link>
          ) : !paymentsReady ? (
            <p className="text-sm text-muted-foreground">
              This community hasn&apos;t finished setting up payments yet. Check back soon.
            </p>
          ) : (
            <Button className="w-full" size="lg" onClick={handleSubscribe} disabled={busy}>
              {busy ? "Starting checkout…" : `Subscribe for ${price}/mo`}
            </Button>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        <p className="mt-4 text-xs text-muted-foreground">
          Secure payment by Stripe. Cancel anytime — you keep access until the end of the paid period.
        </p>
      </CardContent>
    </Card>
  );
}
