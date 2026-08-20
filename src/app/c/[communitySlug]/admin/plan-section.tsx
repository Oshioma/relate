"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { planFeatureLabel } from "@/lib/features";
import { subscribeCommunityToPlan, openBillingPortal } from "./billing-actions";
import type { PlatformPlan } from "@/types/database";

function formatPrice(cents: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase(), maximumFractionDigits: 0 }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(0)} ${currency.toUpperCase()}`;
  }
}

// Owner-facing plan picker + current-plan status. Subscribing/upgrading opens
// Stripe Checkout; the webhook records the plan, so on return we nudge a
// refresh. "Manage billing" opens the Stripe portal to change or cancel.
export function PlanSection({
  communityId,
  plans,
  currentPlanId,
  planStatus,
  hasBillingAccount,
  platformConfigured,
  justSubscribed,
}: {
  communityId: string;
  plans: PlatformPlan[];
  currentPlanId: string | null;
  planStatus: string;
  hasBillingAccount: boolean;
  platformConfigured: boolean;
  justSubscribed: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLive = planStatus === "active" || planStatus === "trialing";
  const paidPlans = plans.filter((p) => p.price_cents > 0);

  async function handleSubscribe(planId: string) {
    setBusy(planId);
    setError(null);
    const result = await subscribeCommunityToPlan(communityId, planId);
    if ("url" in result) {
      window.location.assign(result.url);
      return;
    }
    setError(result.error);
    setBusy(null);
  }

  async function handlePortal() {
    setBusy("portal");
    setError(null);
    const result = await openBillingPortal(communityId);
    if ("url" in result) {
      window.location.assign(result.url);
      return;
    }
    setError(result.error);
    setBusy(null);
  }

  if (!platformConfigured) {
    return (
      <Card>
        <CardContent className="pt-5">
          <p className="text-sm text-muted-foreground">
            Plans aren&apos;t enabled on this platform yet. Once the operator configures Stripe billing, you&apos;ll be able to
            upgrade here to unlock paid memberships and premium features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {justSubscribed && !isLive && (
        <Card>
          <CardContent className="flex items-center justify-between gap-3 pt-5">
            <p className="text-sm text-muted-foreground">Payment received — finalizing your plan. This takes a few seconds.</p>
            <Button size="sm" variant="secondary" onClick={() => router.refresh()}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {paidPlans.map((plan) => {
          const isCurrent = plan.id === currentPlanId && isLive;
          return (
            <Card key={plan.id} className={isCurrent ? "border-accent" : undefined}>
              <CardContent className="flex h-full flex-col pt-5">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                  {isCurrent && <Sparkles className="h-3.5 w-3.5 text-accent" />}
                </div>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {formatPrice(plan.price_cents, plan.currency)}
                  <span className="text-xs font-normal text-muted-foreground"> / mo</span>
                </p>
                {plan.description && <p className="mt-1 text-xs text-muted-foreground">{plan.description}</p>}

                <ul className="mt-3 flex-1 space-y-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-foreground">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                      {planFeatureLabel(f)}
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  {isCurrent ? (
                    <Button size="sm" variant="secondary" className="w-full" disabled>
                      Current plan
                    </Button>
                  ) : (
                    <Button size="sm" className="w-full" onClick={() => handleSubscribe(plan.id)} disabled={busy !== null}>
                      {busy === plan.id ? "Starting…" : isLive ? "Switch to this plan" : "Choose plan"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {hasBillingAccount && (
        <Button size="sm" variant="ghost" onClick={handlePortal} disabled={busy !== null}>
          {busy === "portal" ? "Opening…" : "Manage billing"}
        </Button>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
