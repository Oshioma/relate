import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getAllCommunities } from "@/lib/data/community";
import { getFeatureDefaults, getAllCommunityFeatureOverrides } from "@/lib/data/features";
import { getTemplateDefaultsByTemplate } from "@/lib/data/template-defaults";
import { COMMUNITY_FEATURES } from "@/lib/features";
import { COMMUNITY_TEMPLATES } from "@/lib/community-templates";
import { CommunityFeatureToggle } from "./feature-toggle";
import { TemplateSpacesManager } from "./template-spaces-manager";

export default async function PlatformAdminPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    redirect("/login?next=/platform-admin");
  }

  const profile = await getProfile(supabase, user.id);
  if (!profile?.is_super_admin) {
    redirect("/dashboard");
  }

  const [communities, defaults, overrides, defaultsByTemplate] = await Promise.all([
    getAllCommunities(supabase),
    getFeatureDefaults(supabase),
    getAllCommunityFeatureOverrides(supabase),
    getTemplateDefaultsByTemplate(supabase),
  ]);

  const overridesByCommunity = new Map<string, Map<string, boolean>>();
  for (const row of overrides) {
    if (!overridesByCommunity.has(row.community_id)) {
      overridesByCommunity.set(row.community_id, new Map());
    }
    overridesByCommunity.get(row.community_id)!.set(row.feature_key, row.enabled);
  }

  const templateOptions = COMMUNITY_TEMPLATES.map((t) => ({ key: t.key, label: t.label }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight text-foreground">Platform admin</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Set the default spaces each community type is created with, and override features for any specific community.
      </p>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Default spaces by community type</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Pick a community type, then edit the spaces a new community of that type starts with. Reorder to set the nav order,
        toggle whether each shows in the nav, and add more from the pool. Events and Search appear here too. Changes apply to
        communities created from now on.
      </p>
      <div className="mb-10 rounded-lg border border-border p-4">
        <TemplateSpacesManager templates={templateOptions} initialByTemplate={defaultsByTemplate} />
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Communities ({communities.length})</h2>
      <p className="mb-3 text-sm text-muted-foreground">Turn built-in features on or off for one specific community.</p>
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
