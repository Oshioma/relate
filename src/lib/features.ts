import type { FeatureKey } from "@/types/database";

// The optional, built-in nav features a platform super admin can toggle on
// or off — see supabase/platform-admin.sql and /admin.
export const COMMUNITY_FEATURES: { key: FeatureKey; label: string; description: string }[] = [
  { key: "events", label: "Events", description: "Community-wide events calendar in the sidebar." },
  { key: "concierge", label: "Search / Concierge", description: "AI-assisted concierge search in the sidebar." },
];

// Human labels for the premium feature keys a platform plan grants (see
// platform_plans.features). Shared by the owner-facing plan picker and the
// public pricing page so both describe a plan the same way. Unknown keys — an
// operator can invent one when they add a plan — fall back to the key itself.
export const PLAN_FEATURE_LABELS: Record<string, string> = {
  paid_memberships: "Charge members for spaces",
  unlimited_members: "Unlimited members",
  automation: "Automations",
  white_label: "White label",
  api: "API access",
  advanced_permissions: "Advanced permissions",
  multiple_communities: "Multiple communities",
  multiple_admins: "Multiple admins",
};

export function planFeatureLabel(key: string): string {
  return PLAN_FEATURE_LABELS[key] ?? key.replace(/_/g, " ");
}

// Which of those keys the product ACTUALLY gates, and how. A plan advertises
// whatever keys the operator types into it, and the pricing page renders them
// verbatim — so a key with nothing behind it is a promise the software doesn't
// keep. This map is what the platform-admin plan editor uses to say so.
//
// Keep it honest: when a capability gets a real gate, move its key here and say
// where the gate lives.
export const PLAN_FEATURE_ENFORCEMENT: Record<string, string> = {
  // community_can_charge() — setting a price, and member checkout.
  paid_memberships: "Enforced: paid spaces and membership tiers.",
  // The absence of a `members` cap in the plan's limits.
  unlimited_members: "Enforced: leave the plan's `members` limit unset.",
  // The absence of an `admins` cap in the plan's limits.
  multiple_admins: "Enforced: leave the plan's `admins` limit unset.",
  // community_has_feature(…, 'white_label') in setCustomDomain.
  white_label: "Enforced: connecting a custom domain.",
};

export function planFeatureEnforcement(key: string): string | null {
  return PLAN_FEATURE_ENFORCEMENT[key] ?? null;
}

// Keys on a plan that nothing in the product checks. Sold, but not delivered.
export function unenforcedPlanFeatures(features: string[]): string[] {
  return features.filter((key) => !PLAN_FEATURE_ENFORCEMENT[key]);
}

// Human labels for a plan's numeric caps (see platform_plans.limits, e.g.
// {"members": 200, "admins": 1}). An absent key means unlimited, so only the
// keys actually present are ever rendered.
const PLAN_LIMIT_LABELS: Record<string, (value: number) => string> = {
  members: (value) => `Up to ${value} members`,
  admins: (value) => `${value} admin${value === 1 ? "" : "s"}`,
};

export function planLimitLabel(key: string, value: number): string {
  return PLAN_LIMIT_LABELS[key]?.(value) ?? `${value} ${key.replace(/_/g, " ")}`;
}
