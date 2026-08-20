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
