// What the button on a plan card should do, decided in one place rather than
// inside JSX — the wording carries the whole state machine (signed out, no
// community yet, already on it, moving up, moving down, dropping to free), and
// getting it wrong on a public page means someone clicks "upgrade" and gets
// billed for something else.

export type PlanCtaPlan = {
  id: string;
  priceCents: number;
  name: string;
  stripePriceId: string | null;
};

export type PlanCtaCommunity = {
  planStatus: string;
  hasBillingAccount: boolean;
};

export type PlanCtaState =
  // Nobody signed in: the page is selling an account.
  | { kind: "signup" }
  // Signed in but hosts nothing — a plan is bought per community.
  | { kind: "create_community" }
  // Already on this plan.
  | { kind: "current" }
  // Leaving a paid plan for free. That is a cancellation, so it belongs in
  // Stripe's portal, which handles the paid-through period properly; disabled
  // when there is no billing account to open.
  | { kind: "cancel"; disabled: boolean }
  // A paid plan the platform can't sell yet (no Stripe key, or no price id on
  // the plan).
  | { kind: "unavailable" }
  // Start or change a subscription.
  | { kind: "checkout"; verb: "Choose" | "Upgrade to" | "Downgrade to" };

// Stripe states in which a subscription is genuinely in force. Anything else
// (canceled, past_due, unpaid, none) falls back to free — the same rule
// community_can_charge applies in the database.
export function isLivePlanStatus(status: string | null | undefined): boolean {
  return status === "active" || status === "trialing";
}

export function planCtaState(args: {
  plan: PlanCtaPlan;
  signedIn: boolean;
  community: PlanCtaCommunity | null;
  // The plan actually in force: the subscribed one while live, else free.
  currentPlan: { id: string; priceCents: number } | null;
  stripeConfigured: boolean;
}): PlanCtaState {
  const { plan, signedIn, community, currentPlan, stripeConfigured } = args;

  if (!signedIn) return { kind: "signup" };
  if (!community) return { kind: "create_community" };
  if (currentPlan && plan.id === currentPlan.id) return { kind: "current" };

  if (plan.priceCents === 0) {
    return { kind: "cancel", disabled: !community.hasBillingAccount };
  }

  if (!stripeConfigured || !plan.stripePriceId) return { kind: "unavailable" };

  if (!isLivePlanStatus(community.planStatus)) return { kind: "checkout", verb: "Choose" };

  return {
    kind: "checkout",
    verb: plan.priceCents > (currentPlan?.priceCents ?? 0) ? "Upgrade to" : "Downgrade to",
  };
}
