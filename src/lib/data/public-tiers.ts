import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type PublicTier = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  // Names of the spaces the tier unlocks, in no particular order.
  spaceNames: string[];
};

// A community's open membership tiers (name, description, monthly price) for
// its public landing page. RLS only shows tiers to members, but prices are
// what a landing page advertises, so this reads them with the service role —
// only these display columns, only unarchived tiers, only for the community
// asked for. Fails soft: a page without prices beats a page that 500s.
export async function getPublicTiers(communityId: string): Promise<PublicTier[]> {
  try {
    const { data, error } = await createAdminClient()
      .from("community_tiers")
      .select("id, name, description, price_cents, currency, tier_spaces(spaces(name))")
      .eq("community_id", communityId)
      .is("archived_at", null)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data) return [];
    return data.map((tier) => ({
      id: tier.id,
      name: tier.name,
      description: tier.description,
      priceCents: tier.price_cents,
      currency: tier.currency,
      spaceNames: ((tier.tier_spaces ?? []) as { spaces: { name: string } | { name: string }[] | null }[]).flatMap((row) =>
        Array.isArray(row.spaces) ? row.spaces.map((s) => s.name) : row.spaces ? [row.spaces.name] : []
      ),
    }));
  } catch {
    return [];
  }
}
