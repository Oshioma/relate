import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getAllCommunities } from "@/lib/data/community";
import { getFeatureDefaults, getAllCommunityFeatureOverrides } from "@/lib/data/features";
import { COMMUNITY_FEATURES } from "@/lib/features";
import { DefaultFeatureToggle, CommunityFeatureToggle } from "./feature-toggle";

export default async function PlatformAdminPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    redirect("/login?next=/admin");
  }

  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) {
    redirect("/dashboard");
  }

  const [communities, defaults, overrides] = await Promise.all([
    getAllCommunities(supabase),
    getFeatureDefaults(supabase),
    getAllCommunityFeatureOverrides(supabase),
  ]);

  const overridesByCommunity = new Map<string, Map<string, boolean>>();
  for (const row of overrides) {
    if (!overridesByCommunity.has(row.community_id)) {
      overridesByCommunity.set(row.community_id, new Map());
    }
    overridesByCommunity.get(row.community_id)!.set(row.feature_key, row.enabled);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">Platform admin</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Choose which features new communities start with, and override them for any specific community.
      </p>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Defaults for new communities</h2>
      <div className="mb-10 space-y-4 rounded-lg border border-border p-4">
        {COMMUNITY_FEATURES.map((feature) => (
          <div key={feature.key}>
            <DefaultFeatureToggle featureKey={feature.key} defaultChecked={defaults[feature.key]} />
            <p className="ml-6 mt-0.5 text-xs text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Communities ({communities.length})</h2>
      <div className="space-y-3">
        {communities.map((community) => {
          const communityOverrides = overridesByCommunity.get(community.id);
          return (
            <div key={community.id} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{community.name}</p>
                  <p className="text-xs text-muted-foreground">/c/{community.slug}</p>
                </div>
                <Link href={`/c/${community.slug}`} className="text-xs text-accent underline">
                  View
                </Link>
              </div>
              <div className="flex flex-wrap gap-6">
                {COMMUNITY_FEATURES.map((feature) => {
                  const override = communityOverrides?.get(feature.key);
                  const checked = override ?? defaults[feature.key];
                  return (
                    <div key={feature.key} className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-foreground">{feature.label}</span>
                      <CommunityFeatureToggle
                        communityId={community.id}
                        featureKey={feature.key}
                        defaultChecked={checked}
                        isOverride={override !== undefined}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
