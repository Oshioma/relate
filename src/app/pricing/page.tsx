import type { Metadata } from "next";
import Link from "next/link";
import { Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getActivePlatformPlans } from "@/lib/data/platform-plans";
import { getActiveFeaturePacks } from "@/lib/data/feature-packs";
import { getUserCommunities } from "@/lib/data/community";
import { isStripeConfigured } from "@/lib/stripe";
import { SPACE_TYPES } from "@/lib/space-types";
import { formatMoney } from "@/lib/utils";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlanGrid, type BillableCommunity } from "./plan-grid";
import type { FeaturePack, PlatformPlan, SpaceType } from "@/types/database";

export const metadata: Metadata = {
  title: "Pricing — Relate",
  description: "Plans for community hosts. Start free, upgrade when you're ready to charge members.",
};

function spaceTypeLabel(key: string): string {
  return SPACE_TYPES[key as SpaceType]?.label ?? key.replace(/_/g, " ");
}

// The public price list. It renders the real catalogue — the plans and feature
// packs the super admin maintains in platform-admin — rather than a hardcoded
// copy, so editing a price in one place changes it everywhere. Guests can read
// the active rows via RLS (see 20260820214814_public_pricing_read.sql).
//
// Deliberately not gated on a session: it's linked from the site footer, which
// renders on every page for signed-in and signed-out visitors alike. For a
// signed-out visitor it sells signing up; for someone who already hosts a
// community it doubles as the place to see the plan they're on and change it,
// which is why the plan cards are a client component (see plan-grid.tsx).
//
// A plan belongs to a community, not to an account — one person can host
// several — so "your plan" is only meaningful once a community is picked.
export const dynamic = "force-dynamic";

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ community?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // A marketing page should never 500 because the catalogue is unreachable —
  // fall back to the "get in touch" empty state below.
  let plans: PlatformPlan[] = [];
  let packs: FeaturePack[] = [];
  try {
    [plans, packs] = await Promise.all([getActivePlatformPlans(supabase), getActiveFeaturePacks(supabase)]);
  } catch {
    plans = [];
    packs = [];
  }

  // Only an owner or admin can bill a community (the billing actions enforce
  // the same rule server-side), so those are the only ones worth offering.
  let billable: BillableCommunity[] = [];
  if (user) {
    try {
      const communities = await getUserCommunities(supabase, user.id);
      billable = communities
        .filter((c) => c.membership.role === "owner" || c.membership.role === "admin")
        .map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          planId: c.plan_id,
          planStatus: c.plan_status,
          currentPeriodEnd: c.plan_current_period_end,
          hasBillingAccount: Boolean(c.plan_stripe_customer_id),
        }));
    } catch {
      // Same rule as the catalogue above: never 500 the price list.
      billable = [];
    }
  }

  const ctaHref = user ? (billable.length > 0 ? "/dashboard" : "/communities/new") : "/signup";
  const ctaLabel = user ? (billable.length > 0 ? "Go to your dashboard" : "Create your community") : "Get started";

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Relate
        </Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <LinkButton href="/dashboard" size="sm">
              Dashboard
            </LinkButton>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
              <LinkButton href="/signup" size="sm">
                Create account
              </LinkButton>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-3xl px-6 pb-12 pt-10 text-center sm:pt-16">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Simple pricing for community hosts.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Start free while you find your people. Upgrade when you&apos;re ready to charge members, automate the
            busywork, or make Relate your own.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Priced per community, billed monthly.</p>
        </section>

        {plans.length > 0 ? (
          <section className="mx-auto max-w-6xl px-6 pb-20">
            <PlanGrid
              plans={plans}
              communities={billable}
              signedIn={Boolean(user)}
              stripeConfigured={isStripeConfigured()}
              initialCommunitySlug={params.community}
              justSubscribed={params.plan === "subscribed"}
            />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Every plan includes your spaces, members, posts and resources — the core of a Relate community. Paid
              plans add what&apos;s listed above.
            </p>
          </section>
        ) : (
          <section className="mx-auto max-w-2xl px-6 pb-20 text-center">
            <Card>
              <CardContent className="pt-5">
                <p className="text-sm text-muted-foreground">
                  Our plans aren&apos;t published yet.{" "}
                  <Link href="/contact" className="text-accent hover:underline">
                    Get in touch
                  </Link>{" "}
                  and we&apos;ll talk you through the options.
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {packs.length > 0 && (
          <section className="mx-auto max-w-5xl px-6 pb-20">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">Add-ons</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
              Extra spaces you can add to any plan, à la carte. Turn them on — or off — from your community&apos;s
              admin whenever you like.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {packs.map((pack) => (
                <PackCard key={pack.id} pack={pack} />
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-2xl px-6 pb-20">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">Questions</h2>
          <dl className="mt-6 space-y-6">
            <Faq question="Do my members pay Relate?">
              No. A plan is what you, the host, pay for your community — your members never see a Relate bill.
            </Faq>
            <Faq question="Can I charge my own members?">
              Yes, on any plan that includes paid memberships. You connect your own Stripe account, set a price on a
              space or membership tier, and the money goes straight to you.
            </Faq>
            <Faq question="Can I change or cancel my plan?">
              Any time — from this page while you&apos;re signed in, or from your community&apos;s admin. Moving between
              paid plans changes your existing subscription rather than starting a second one, and the difference is
              prorated onto your next invoice. Cancelling happens in the billing portal. If a plan lapses you keep your
              community and your members — you just can&apos;t start charging for anything new until you&apos;re back on
              a paid plan.
            </Faq>
            <Faq question="Still not sure which plan fits?">
              <Link href="/contact" className="text-accent hover:underline">
                Send us a message
              </Link>{" "}
              — we&apos;ll help you work it out.
            </Faq>
          </dl>
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-24 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Ready when you are.</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Create your community in a few minutes — no card needed to start.
          </p>
          <div className="mt-6">
            <LinkButton href={ctaHref} size="lg">
              {ctaLabel}
            </LinkButton>
          </div>
        </section>
      </main>
    </div>
  );
}

function PackCard({ pack }: { pack: FeaturePack }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Package className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{pack.name}</h3>
        <p className="mt-1 text-sm font-medium text-foreground">
          {pack.price_cents === 0 ? "Included" : formatMoney(pack.price_cents, pack.currency)}
          {pack.price_cents > 0 && <span className="text-xs font-normal text-muted-foreground"> / mo</span>}
        </p>
        {pack.description && <p className="mt-2 text-sm text-muted-foreground">{pack.description}</p>}
        {pack.space_types.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Adds: {pack.space_types.map(spaceTypeLabel).join(", ")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function Faq({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm font-semibold text-foreground">{question}</dt>
      <dd className="mt-1 text-sm text-muted-foreground">{children}</dd>
    </div>
  );
}
