import type { FeatureKey } from "@/types/database";

// The optional, built-in nav features a platform super admin can toggle on
// or off — see supabase/platform-admin.sql and /admin.
export const COMMUNITY_FEATURES: { key: FeatureKey; label: string; description: string }[] = [
  { key: "events", label: "Events", description: "Community-wide events calendar in the sidebar." },
  { key: "concierge", label: "Search / Concierge", description: "AI-assisted concierge search in the sidebar." },
];
