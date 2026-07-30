"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Gem } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { subscribeToTier } from "../membership-actions";

function formatPrice(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }
}

export function MembershipTierCard({
  tierId,
  name,
  description,
  priceCents,
  currency,
  spaceNames,
  communitySlug,
  isSubscribed,
  isStaff,
  isSignedIn,
  paymentsReady,
}: {
  tierId: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  // Names of the spaces this tier unlocks.
  spaceNames: string[];
  communitySlug: string;
  isSubscribed: boolean;
  isStaff: boolean;
  isSignedIn: boolean;
  paymentsReady: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    setBusy(true);
    setError(null);
    const result = await subscribeToTier(tierId, communitySlug);
    if ("url" in result) {
      window.location.assign(result.url);
      return;
    }
    setError(result.error);
    setBusy(false);
  }

  const price = formatPrice(priceCents, currency);
  const returnTo = `/c/${communitySlug}/membership`;

  return (
    <Card className={isSubscribed ? "border-accent/40" : undefined}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Gem className="h-4 w-4 text-accent" />
              <h3 className="text-base font-semibold text-foreground">{name}</h3>
            </div>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {price}
              <span className="text-sm font-normal text-muted-foreground"> / month</span>
            </p>
          </div>
          {isSubscribed && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
              <Check className="h-3.5 w-3.5" /> Member
            </span>
          )}
        </div>

        {description && <p className="mt-3 text-sm text-muted-foreground">{description}</p>}

        {spaceNames.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Unlocks</p>
            <ul className="mt-1.5 space-y-1">
              {spaceNames.map((n) => (
                <li key={n} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5">
          {isSubscribed ? (
            <p className="text-sm text-muted-foreground">You&apos;re a member of this tier.</p>
          ) : isStaff ? (
            <p className="text-sm text-muted-foreground">Staff already have access to every space.</p>
          ) : !isSignedIn ? (
            <Link
              href={`/login?next=${encodeURIComponent(returnTo)}`}
              className="inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90"
            >
              Sign in to join
            </Link>
          ) : !paymentsReady ? (
            <p className="text-sm text-muted-foreground">This community hasn&apos;t finished setting up payments yet.</p>
          ) : (
            <Button className="w-full" size="lg" onClick={handleJoin} disabled={busy}>
              {busy ? "Starting checkout…" : `Join for ${price}/mo`}
            </Button>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
      </CardContent>
    </Card>
  );
}
