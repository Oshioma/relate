import { notFound } from "next/navigation";
import { Gem } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { getCommunitySpaces } from "@/lib/data/spaces";
import { getCommunityTiers, getActiveTierIds } from "@/lib/data/tiers";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { MembershipTierCard } from "./membership-tier-card";

export const metadata = { title: "Membership" };

export default async function MembershipPage({
  params,
  searchParams,
}: {
  params: Promise<{ communitySlug: string }>;
  searchParams: Promise<{ subscribed?: string }>;
}) {
  const { communitySlug } = await params;
  const { subscribed } = await searchParams;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) notFound();

  const membership = user ? await getMembership(supabase, community.id, user.id) : null;
  const isStaff =
    membership?.status === "active" &&
    (membership.role === "owner" || membership.role === "admin" || membership.role === "moderator");

  const [allTiers, spaces, activeTierIds] = await Promise.all([
    // Tiers are member-readable via RLS; a non-member gets an empty list.
    getCommunityTiers(supabase, community.id),
    getCommunitySpaces(supabase, community.id),
    user ? getActiveTierIds(supabase, community.id, user.id) : Promise.resolve(new Set<string>()),
  ]);

  const tiers = allTiers.filter((t) => !t.archived_at);
  const spaceName = new Map(spaces.map((s) => [s.id, s.name] as const));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
        <Gem className="h-5 w-5 text-accent" />
        Membership
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Join a membership to unlock premium spaces in {community.name}. Cancel anytime — you keep access until the end of
        the paid period.
      </p>

      {subscribed === "1" && (
        <Card className="mt-6 border-accent/40">
          <CardContent className="pt-5">
            <p className="text-sm font-medium text-foreground">Payment received</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;re finalizing your membership — access usually unlocks within a few seconds. Refresh if a space still
              looks locked.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        {tiers.length === 0 ? (
          <EmptyState
            icon={<Gem className="h-6 w-6" />}
            title="No memberships yet"
            description={
              user
                ? "This community doesn't offer any paid memberships right now."
                : "Sign in and join this community to see its memberships."
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {tiers.map((tier) => (
              <MembershipTierCard
                key={tier.id}
                tierId={tier.id}
                name={tier.name}
                description={tier.description}
                priceCents={tier.price_cents}
                currency={tier.currency}
                spaceNames={tier.spaceIds.map((id) => spaceName.get(id)).filter((n): n is string => Boolean(n))}
                communitySlug={community.slug}
                isSubscribed={activeTierIds.has(tier.id)}
                isStaff={Boolean(isStaff)}
                isSignedIn={Boolean(user)}
                paymentsReady={community.stripe_charges_enabled}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
