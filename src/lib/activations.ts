// Activation links for the "we've moved" emails (Admin → Emails → Send an
// email). Each one is a single-use token for one member; see
// 20261110063211_community_migration_emails.sql and
// src/app/invite/activate/[token].
//
// Kept free of "server-only" so the rules can be unit-tested.

import type { CommunityActivation } from "@/types/database";

// How long a member has to press the button in their email.
export const ACTIVATION_TTL_DAYS = 60;

export type ActivationStatus = "ready" | "used" | "expired";

export function activationStatus(
  row: Pick<CommunityActivation, "used_at" | "expires_at">,
  now: Date = new Date()
): ActivationStatus {
  if (row.used_at) return "used";
  if (new Date(row.expires_at).getTime() <= now.getTime()) return "expired";
  return "ready";
}

type ExistingTierSub = {
  tier_id: string;
  status: string;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
};

// Which of the free tiers still need a row written. A tier is left alone when
// the member already has it running, and when they pay for it through Stripe
// (that row belongs to the webhook; overwriting it would cut the link to their
// subscription). A lapsed free row is switched back on.
export function tiersToGiveFree(
  freeTierIds: string[],
  existing: ExistingTierSub[],
  now: Date = new Date()
): string[] {
  const byTier = new Map(existing.map((s) => [s.tier_id, s]));
  const out: string[] = [];
  for (const tierId of new Set(freeTierIds)) {
    const sub = byTier.get(tierId);
    if (!sub) {
      out.push(tierId);
      continue;
    }
    if (sub.stripe_subscription_id) continue;
    const running =
      (sub.status === "active" || sub.status === "trialing") &&
      (!sub.current_period_end || new Date(sub.current_period_end).getTime() > now.getTime());
    if (!running) out.push(tierId);
  }
  return out;
}
