"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Package, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SPACE_TYPES } from "@/lib/space-types";
import { installFreePack, uninstallFreePack, subscribeToPack } from "./marketplace-actions";
import type { FeaturePack, SpaceType } from "@/types/database";

function formatPrice(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase(), maximumFractionDigits: 0 }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(0)} ${currency.toUpperCase()}`;
  }
}

function spaceTypeLabel(key: string): string {
  return SPACE_TYPES[key as SpaceType]?.label ?? key.replace(/_/g, " ");
}

// Owner-facing marketplace: install free packs, subscribe to paid ones. Each
// pack unlocks its space types for the community (they appear in the "add a
// space" picker). Installed state comes from the community's active addons.
export function MarketplaceSection({
  communityId,
  packs,
  installedPackIds,
  platformConfigured,
}: {
  communityId: string;
  packs: FeaturePack[];
  installedPackIds: string[];
  platformConfigured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const installed = new Set(installedPackIds);

  async function run(packId: string, fn: () => Promise<{ error: string } | { ok: true } | { url: string }>) {
    setBusy(packId);
    setError(null);
    const result = await fn();
    if ("url" in result) {
      window.location.assign(result.url);
      return;
    }
    if ("error" in result) setError(result.error);
    else router.refresh();
    setBusy(null);
  }

  if (packs.length === 0) {
    return <p className="text-sm text-muted-foreground">No feature packs are available yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {packs.map((pack) => {
          const isInstalled = installed.has(pack.id);
          const isFree = pack.price_cents === 0;
          return (
            <Card key={pack.id} className={isInstalled ? "border-accent" : undefined}>
              <CardContent className="flex h-full flex-col pt-5">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">{pack.name}</p>
                  {isInstalled && <Check className="h-3.5 w-3.5 text-accent" />}
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">{isFree ? "Free" : `${formatPrice(pack.price_cents, pack.currency)} / mo`}</p>
                {pack.description && <p className="mt-1 text-xs text-muted-foreground">{pack.description}</p>}

                {pack.space_types.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Unlocks: {pack.space_types.map(spaceTypeLabel).join(", ")}
                  </p>
                )}

                <div className="mt-4 flex-1" />
                <div>
                  {isInstalled ? (
                    isFree ? (
                      <Button size="sm" variant="ghost" className="w-full" onClick={() => run(pack.id, () => uninstallFreePack(communityId, pack.id))} disabled={busy !== null}>
                        {busy === pack.id ? "Removing…" : "Remove"}
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" className="w-full" disabled>
                        Installed
                      </Button>
                    )
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => run(pack.id, () => (isFree ? installFreePack(communityId, pack.id) : subscribeToPack(communityId, pack.id)))}
                      disabled={busy !== null}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      {busy === pack.id ? "Working…" : isFree ? "Install" : "Subscribe"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!platformConfigured && (
        <p className="text-xs text-muted-foreground">Paid packs need Stripe billing configured on the platform before they can be purchased.</p>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
