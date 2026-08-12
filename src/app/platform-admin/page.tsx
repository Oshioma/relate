import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAllCommunities } from "@/lib/data/community";
import { getFeatureDefaults, getAllCommunityFeatureOverrides } from "@/lib/data/features";
import { getSpaceTypeDefaults, getAllCommunitySpaceTypeOverrides } from "@/lib/data/space-type-pool";
import { getTemplateDefaultsByTemplate } from "@/lib/data/template-defaults";
import { getAllPlatformPlans } from "@/lib/data/platform-plans";
import { getAllFeaturePacks } from "@/lib/data/feature-packs";
import { getPlatformSettings } from "@/lib/data/platform-settings";
import { getContactMessages } from "@/lib/data/contact-messages";
import { LegalSettingsForm } from "./legal-settings-form";
import { ContactInbox } from "./contact-inbox";
import { PlanAdminRow } from "./plan-admin-row";
import { PackAdminRow } from "./pack-admin-row";
import { COMMUNITY_FEATURES } from "@/lib/features";
import { groupSpaceTypesByCategory } from "@/lib/space-types";
import { COMMUNITY_TEMPLATES } from "@/lib/community-templates";
import { CommunityFeatureToggle } from "./feature-toggle";
import { DefaultSpaceTypeToggle, CommunitySpaceTypeToggle } from "./space-type-toggle";
import { TemplateSpacesManager } from "./template-spaces-manager";
import type { SpaceType } from "@/types/database";

export default async function PlatformAdminPage() {
  const supabase = await createClient();

  const [communities, defaults, overrides, defaultsByTemplate, spaceTypeDefaults, spaceTypeOverrides, plans, packs, legalSettings, contactMessages] = await Promise.all([
    getAllCommunities(supabase),
    getFeatureDefaults(supabase),
    getAllCommunityFeatureOverrides(supabase),
    getTemplateDefaultsByTemplate(supabase),
    getSpaceTypeDefaults(supabase),
    getAllCommunitySpaceTypeOverrides(supabase),
    getAllPlatformPlans(supabase),
    getAllFeaturePacks(supabase),
    getPlatformSettings(supabase),
    getContactMessages(supabase),
  ]);

  const overridesByCommunity = new Map<string, Map<string, boolean>>();
  for (const row of overrides) {
    if (!overridesByCommunity.has(row.community_id)) {
      overridesByCommunity.set(row.community_id, new Map());
    }
    overridesByCommunity.get(row.community_id)!.set(row.feature_key, row.enabled);
  }

  // Per-community space-type pool overrides, keyed community → type → enabled.
  const spaceTypeOverridesByCommunity = new Map<string, Map<SpaceType, boolean>>();
  for (const row of spaceTypeOverrides) {
    if (!spaceTypeOverridesByCommunity.has(row.community_id)) {
      spaceTypeOverridesByCommunity.set(row.community_id, new Map());
    }
    spaceTypeOverridesByCommunity.get(row.community_id)!.set(row.space_type, row.enabled);
  }

  const spaceTypeGroups = groupSpaceTypesByCategory();
  // The default pool as a flat list of allowed types — the master set the
  // starter-box editor and every new community draw from.
  const defaultAllowedTypes = spaceTypeGroups.flatMap((g) => g.types).filter((t) => spaceTypeDefaults[t.type]).map((t) => t.type);
  const templateOptions = COMMUNITY_TEMPLATES.map((t) => ({ key: t.key, label: t.label }));

  return (
    <div>
      <p className="mb-8 text-sm text-muted-foreground">
        Control the pool of space types communities can have, the spaces each community type starts with, and per-community
        overrides.
      </p>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">1. Space types available by default</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        The master pool: which space types a community can have at all (Courses, Marketplace, Explore Map and more), grouped by
        category. A type turned off here can&apos;t be put in a starter box below, added by a community manager, or seeded into a
        new community — you can still override this per community further down. Existing spaces of a type are never removed.
      </p>
      <div className="mb-10 space-y-4 rounded-lg border border-border p-4">
        {spaceTypeGroups.map((group) => (
          <div key={group.category.key}>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{group.category.label}</p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              {group.types.map((t) => (
                <div key={t.type} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-foreground">{t.label}</span>
                  <DefaultSpaceTypeToggle spaceType={t.type} defaultChecked={spaceTypeDefaults[t.type]} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">2. Starter spaces by community type</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Pick a community type, then choose which spaces (from the pool above) a new community of that type starts with. Reorder
        to set the nav order, toggle whether each shows in the nav, and add more. Everything else in the pool a manager can add
        later. Events and Search appear here too. Changes apply to communities created from now on.
      </p>
      <div className="mb-10 rounded-lg border border-border p-4">
        <TemplateSpacesManager templates={templateOptions} initialByTemplate={defaultsByTemplate} allowedTypes={defaultAllowedTypes} />
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">3. Platform plans</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        The subscription tiers communities can upgrade to. Create a matching recurring Price in your Stripe dashboard and
        paste its id here — a paid plan with no Stripe price id can&apos;t be checked out. Features are capability keys a plan
        grants (e.g. <code>paid_memberships</code>). The <code>free</code> plan is the fallback for communities with no
        active subscription.
      </p>
      <div className="mb-10 space-y-3">
        {plans.map((plan) => (
          <PlanAdminRow key={plan.id} plan={plan} />
        ))}
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">4. Feature packs</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Marketplace packs owners can install. A pack unlocks its <code>space_types</code> for the community that installs
        it — so to actually gate a type, turn it OFF in the default pool above, then sell it here. Paid packs need a Stripe
        recurring Price id.
      </p>
      <div className="mb-10 space-y-3">
        {packs.map((pack) => (
          <PackAdminRow key={pack.id} pack={pack} />
        ))}
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">5. Communities ({communities.length})</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Turn built-in features on or off for one specific community, and regulate its space-type pool.
      </p>
      <div className="space-y-3">
        {communities.map((community) => {
          const communityOverrides = overridesByCommunity.get(community.id);
          const communitySpaceTypeOverrides = spaceTypeOverridesByCommunity.get(community.id);
          const restrictedCount = spaceTypeGroups
            .flatMap((g) => g.types)
            .filter((t) => (communitySpaceTypeOverrides?.get(t.type) ?? spaceTypeDefaults[t.type]) === false).length;
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

              <details className="mt-3 border-t border-border pt-3">
                <summary className="cursor-pointer text-xs font-medium text-foreground">
                  Space-type pool{restrictedCount > 0 ? ` — ${restrictedCount} restricted` : ""}
                </summary>
                <p className="mb-3 mt-2 text-xs text-muted-foreground">
                  Which space types this community can add. Unset types follow the platform default above.
                </p>
                <div className="space-y-4">
                  {spaceTypeGroups.map((group) => (
                    <div key={group.category.key}>
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{group.category.label}</p>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                        {group.types.map((t) => {
                          const override = communitySpaceTypeOverrides?.get(t.type);
                          const checked = override ?? spaceTypeDefaults[t.type];
                          return (
                            <CommunitySpaceTypeToggle
                              key={t.type}
                              communityId={community.id}
                              spaceType={t.type}
                              label={t.label}
                              defaultChecked={checked}
                              isOverride={override !== undefined}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          );
        })}
      </div>

      <h2 className="mb-3 mt-10 text-sm font-medium uppercase tracking-wide text-muted-foreground">Legal documents</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        The platform&apos;s Terms &amp; Conditions and Privacy Policy. These are linked in the footer on every page and shown
        at <span className="font-medium text-foreground">/terms</span> and <span className="font-medium text-foreground">/privacy</span>.
      </p>
      <div className="mb-6">
        <LegalSettingsForm settings={legalSettings} />
      </div>

      <h2 className="mb-3 mt-10 text-sm font-medium uppercase tracking-wide text-muted-foreground">Contact messages</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        Submissions from the <span className="font-medium text-foreground">/contact</span> form. Each also emails the
        support inbox — this is the durable record.
      </p>
      <div className="mb-6">
        <ContactInbox messages={contactMessages} />
      </div>
    </div>
  );
}
