"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { planFeatureLabel, planLimitLabel } from "@/lib/features";
import { isLivePlanStatus, planCtaState } from "@/lib/plan-cta";
import { cn, formatDate, formatMoney } from "@/lib/utils";
import { openBillingPortal, subscribeCommunityToPlan } from "@/app/c/[communitySlug]/admin/billing-actions";
import type { PlatformPlan } from "@/types/database";

// A community the signed-in visitor can actually change the plan of. Plans are
// per community and only an owner or admin can bill one, so this list — not the
// account — is what "your plan" means on this page.
export type BillableCommunity = {
  id: string;
  name: string;
  slug: string;
  planId: string | null;
  planStatus: string;
  currentPeriodEnd: string | null;
  hasBillingAccount: boolean;
};

export function PlanGrid({
  plans,
  communities,
  signedIn,
  stripeConfigured,
  initialCommunitySlug,
  justSubscribed,
}: {
  plans: PlatformPlan[];
  communities: BillableCommunity[];
  signedIn: boolean;
  stripeConfigured: boolean;
  initialCommunitySlug?: string;
  justSubscribed: boolean;
}) {
  const router = useRouter();
  const initial =
    communities.find((c) => c.slug === initialCommunitySlug)?.id ?? communities[0]?.id ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // An existing subscription moved onto another price — no checkout to visit,
  // the webhook writes the new plan a moment later.
  const [switched, setSwitched] = useState(false);

  const selected = communities.find((c) => c.id === selectedId) ?? null;
  const live = isLivePlanStatus(selected?.planStatus);
  const freePlan = plans.find((p) => p.price_cents === 0) ?? null;
  // The plan actually in force: the subscribed one while it's live, otherwise
  // free — a lapsed subscription is not a plan you're on.
  const currentPlanId = selected ? (live ? selected.planId : freePlan?.id ?? null) : null;
  const currentPlan = plans.find((p) => p.id === currentPlanId) ?? null;
  const returnPath = selected ? `/pricing?community=${encodeURIComponent(selected.slug)}` : "/pricing";

  async function handleSubscribe(planId: string) {
    if (!selected) return;
    setBusy(planId);
    setError(null);
    const result = await subscribeCommunityToPlan(selected.id, planId, returnPath);
    if ("url" in result) {
      window.location.assign(result.url);
      return;
    }
    if ("switched" in result) {
      setSwitched(true);
      setBusy(null);
      router.refresh();
      return;
    }
    setError(result.error);
    setBusy(null);
  }

  async function handlePortal() {
    if (!selected) return;
    setBusy("portal");
    setError(null);
    const result = await openBillingPortal(selected.id, returnPath);
    if ("url" in result) {
      window.location.assign(result.url);
      return;
    }
    setError(result.error);
    setBusy(null);
  }

  return (
    <div>
      {/* Which community these prices apply to, and what it's on today. */}
      {selected && (
        <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-border p-4">
          {communities.length > 1 && (
            <>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Plans are per community — pick one
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {communities.map((community) => (
                  <button
                    key={community.id}
                    type="button"
                    onClick={() => setSelectedId(community.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      community.id === selectedId
                        ? "bg-accent-soft text-accent"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {community.name}
                  </button>
                ))}
              </div>
            </>
          )}

          <p className="text-sm text-foreground">
            <span className="font-medium">{selected.name}</span> is on{" "}
            <span className="font-medium">{currentPlan?.name ?? "no plan"}</span>
            {live && selected.currentPeriodEnd && (
              <span className="text-muted-foreground">
                {" "}
                · renews {formatDate(selected.currentPeriodEnd)}
              </span>
            )}
          </p>

          <PlanStatusNote status={selected.planStatus} periodEnd={selected.currentPeriodEnd} />

          {selected.hasBillingAccount && (
            <Button size="sm" variant="ghost" className="mt-2 -ml-3" onClick={handlePortal} disabled={busy !== null}>
              {busy === "portal" ? "Opening…" : "Manage billing"}
            </Button>
          )}

          {switched && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted px-3 py-2">
              <p className="text-sm text-muted-foreground">
                Plan change submitted — Stripe is confirming it, and the difference is prorated onto your next invoice.
              </p>
              <Button size="sm" variant="secondary" onClick={() => router.refresh()}>
                Refresh
              </Button>
            </div>
          )}

          {justSubscribed && !live && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted px-3 py-2">
              <p className="text-sm text-muted-foreground">
                Payment received — finalizing your plan. This takes a few seconds.
              </p>
              <Button size="sm" variant="secondary" onClick={() => router.refresh()}>
                Refresh
              </Button>
            </div>
          )}
        </div>
      )}

      {signedIn && communities.length === 0 && (
        <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            You&apos;re signed in, but you don&apos;t run a community yet — plans are bought per community, by the
            person who hosts it. Start one and you can pick a plan from here.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={plan.id === currentPlanId}
            cta={
              <PlanCta
                plan={plan}
                signedIn={signedIn}
                selected={selected}
                currentPlan={currentPlan}
                stripeConfigured={stripeConfigured}
                busy={busy}
                onSubscribe={handleSubscribe}
                onPortal={handlePortal}
              />
            }
          />
        ))}
      </div>

      {error && <p className="mt-4 text-center text-sm text-danger">{error}</p>}
    </div>
  );
}

// Anything the owner should know about a subscription that isn't simply live.
function PlanStatusNote({ status, periodEnd }: { status: string; periodEnd: string | null }) {
  if (status === "past_due" || status === "unpaid") {
    return (
      <p className="mt-1 text-sm text-danger">
        The last payment didn&apos;t go through. Update the card in billing to keep the plan&apos;s features.
      </p>
    );
  }
  if (status === "canceled") {
    return (
      <p className="mt-1 text-sm text-muted-foreground">
        The paid plan was canceled{periodEnd ? ` on ${formatDate(periodEnd)}` : ""} — the community and its members are
        untouched, but paid features are off until you pick a plan again.
      </p>
    );
  }
  if (status === "trialing") {
    return <p className="mt-1 text-sm text-muted-foreground">On trial.</p>;
  }
  return null;
}

// Renders whatever planCtaState decided (src/lib/plan-cta.ts).
function PlanCta({
  plan,
  signedIn,
  selected,
  currentPlan,
  stripeConfigured,
  busy,
  onSubscribe,
  onPortal,
}: {
  plan: PlatformPlan;
  signedIn: boolean;
  selected: BillableCommunity | null;
  currentPlan: PlatformPlan | null;
  stripeConfigured: boolean;
  busy: string | null;
  onSubscribe: (planId: string) => void;
  onPortal: () => void;
}) {
  const isFree = plan.price_cents === 0;
  const state = planCtaState({
    plan: { id: plan.id, name: plan.name, priceCents: plan.price_cents, stripePriceId: plan.stripe_price_id },
    signedIn,
    community: selected ? { planStatus: selected.planStatus, hasBillingAccount: selected.hasBillingAccount } : null,
    currentPlan: currentPlan ? { id: currentPlan.id, priceCents: currentPlan.price_cents } : null,
    stripeConfigured,
  });

  switch (state.kind) {
    case "signup":
      return (
        <LinkButton href="/signup" size="sm" variant={isFree ? "secondary" : "primary"} className="w-full">
          Get started
        </LinkButton>
      );
    case "create_community":
      return (
        <LinkButton href="/communities/new" size="sm" variant={isFree ? "secondary" : "primary"} className="w-full">
          Create a community
        </LinkButton>
      );
    case "current":
      return (
        <Button size="sm" variant="secondary" className="w-full" disabled>
          Your plan
        </Button>
      );
    case "cancel":
      return (
        <Button
          size="sm"
          variant="secondary"
          className="w-full"
          onClick={onPortal}
          disabled={busy !== null || state.disabled}
        >
          {busy === "portal" ? "Opening…" : "Cancel in billing"}
        </Button>
      );
    case "unavailable":
      return (
        <Button size="sm" variant="secondary" className="w-full" disabled>
          Not available yet
        </Button>
      );
    case "checkout":
      return (
        <Button size="sm" className="w-full" onClick={() => onSubscribe(plan.id)} disabled={busy !== null}>
          {busy === plan.id ? "Starting…" : `${state.verb} ${plan.name}`}
        </Button>
      );
  }
}

function PlanCard({
  plan,
  isCurrent,
  cta,
}: {
  plan: PlatformPlan;
  isCurrent: boolean;
  cta: React.ReactNode;
}) {
  // Caps are only listed when a plan actually sets one — an absent key means
  // unlimited, so the paid tiers simply have nothing to show here.
  const limits = Object.entries(plan.limits ?? {});

  return (
    <Card className={cn("flex flex-col", isCurrent && "border-accent")}>
      <CardContent className="flex h-full flex-col pt-5">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
          {isCurrent && <Sparkles className="h-3.5 w-3.5 text-accent" aria-label="Your current plan" />}
        </div>
        <p className="mt-1 text-2xl font-semibold text-foreground">
          {formatMoney(plan.price_cents, plan.currency)}
          <span className="text-xs font-normal text-muted-foreground"> / mo</span>
        </p>
        {plan.description && <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>}

        <ul className="mt-4 flex-1 space-y-1.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-1.5 text-sm text-foreground">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              {planFeatureLabel(feature)}
            </li>
          ))}
          {limits.map(([key, value]) => (
            <li key={key} className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-border" />
              {planLimitLabel(key, value)}
            </li>
          ))}
        </ul>

        <div className="mt-5">{cta}</div>
      </CardContent>
    </Card>
  );
}
