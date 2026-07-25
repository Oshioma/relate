"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { RESERVED_SUBDOMAIN_LABELS } from "@/lib/custom-domain";
import { getCommunityTemplate, getPlaceLocationType } from "@/lib/community-templates";
import { getTemplateDefaultsByTemplate } from "@/lib/data/template-defaults";
import { getSpaceTypeDefaults } from "@/lib/data/space-type-pool";
import { builtinsForTemplate } from "@/lib/template-defaults";
import { SPACE_TYPES } from "@/lib/space-types";
import type { ProfileFieldType, CommunityPrivacy, SpaceType, FeatureKey } from "@/types/database";

export interface WizardSpaceInput {
  name: string;
  description: string;
  show_in_nav: boolean;
  space_type: SpaceType;
}

export interface WizardProfileFieldInput {
  label: string;
  field_type: ProfileFieldType;
  options?: string[];
}

export interface WizardPayload {
  name: string;
  slug: string;
  description: string;
  privacy: CommunityPrivacy;
  // The chosen template's key (COMMUNITY_TEMPLATES). Stored on the community
  // so type-specific features (e.g. AI event discovery) can gate on it.
  templateKey?: string;
  // Place-Based Community only — validated against PLACE_LOCATION_TYPES
  // below and dropped (not just left blank) for every other template.
  locationType?: string;
  locationName?: string;
  // Seeds map_categories (the Explore Map's togglable layers) so a place
  // community's map isn't empty on day one. Dropped unless locationType is
  // also set and valid.
  mapLayers?: string[];
  spaces: WizardSpaceInput[];
  profileFields: WizardProfileFieldInput[];
}

export type WizardResult = { error: string };

const PRIVACY_LEVELS: CommunityPrivacy[] = ["public", "private", "invite_only"];

function uniqueSlugs(names: string[]): string[] {
  const used = new Set<string>();
  return names.map((name, i) => {
    const root = slugify(name) || `space-${i + 1}`;
    let candidate = root;
    let n = 2;
    while (used.has(candidate)) {
      candidate = `${root}-${n}`;
      n += 1;
    }
    used.add(candidate);
    return candidate;
  });
}

export async function createCommunityFromWizard(payload: WizardPayload): Promise<WizardResult> {
  const name = payload.name.trim();
  if (!name) {
    return { error: "Give your community a name." };
  }

  const slug = slugify(payload.slug || name);
  if (!slug || slug.length < 2) {
    return { error: "That URL can't be used — try adding some letters or numbers." };
  }
  // The slug doubles as the community's <slug>.<platform-domain> subdomain,
  // so labels the platform needs for itself can't be community URLs.
  if (RESERVED_SUBDOMAIN_LABELS.has(slug)) {
    return { error: "That URL is reserved — try a different one." };
  }

  const privacy = PRIVACY_LEVELS.includes(payload.privacy) ? payload.privacy : "public";
  const templateKey = payload.templateKey && getCommunityTemplate(payload.templateKey) ? payload.templateKey : null;
  const locationType = payload.locationType && getPlaceLocationType(payload.locationType) ? payload.locationType : null;
  const locationName = locationType && payload.locationName?.trim() ? payload.locationName.trim() : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: community, error: communityError } = await supabase
    .from("communities")
    .insert({
      name,
      slug,
      description: payload.description.trim() || null,
      owner_id: user.id,
      privacy,
      template_key: templateKey,
      location_type: locationType,
      location_name: locationName,
    })
    .select("id, slug")
    .single();

  if (communityError) {
    if (communityError.code === "23505") {
      return { error: "That URL is already taken — try a different one." };
    }
    return { error: communityError.message };
  }

  const spaces = payload.spaces.filter((s) => s.name.trim());
  if (spaces.length) {
    // Enforce the platform default pool server-side — a new community may only
    // start with space types the super admin makes available.
    const spaceTypeDefaults = await getSpaceTypeDefaults(supabase);
    const disallowed = spaces.find((s) => !spaceTypeDefaults[s.space_type]);
    if (disallowed) {
      await supabase.from("communities").delete().eq("id", community.id);
      return { error: `The ${SPACE_TYPES[disallowed.space_type].label} space type isn't available. Change it and try again.` };
    }
    const slugs = uniqueSlugs(spaces.map((s) => s.name));
    const { error: spacesError } = await supabase.from("spaces").insert(
      spaces.map((s, i) => ({
        community_id: community.id,
        name: s.name.trim(),
        slug: slugs[i],
        description: s.description.trim() || null,
        visibility: "members" as const,
        sort_order: i,
        show_in_nav: s.show_in_nav,
        space_type: s.space_type,
      }))
    );
    if (spacesError) {
      await supabase.from("communities").delete().eq("id", community.id);
      return { error: `Couldn't set up your spaces: ${spacesError.message}` };
    }
  }

  const fields = payload.profileFields.filter((f) => f.label.trim());
  if (fields.length) {
    const { error: fieldsError } = await supabase.from("community_profile_fields").insert(
      fields.map((f, i) => ({
        community_id: community.id,
        label: f.label.trim(),
        field_type: f.field_type,
        options: f.options ?? [],
        sort_order: i,
        created_by: user.id,
      }))
    );
    if (fieldsError) {
      await supabase.from("communities").delete().eq("id", community.id);
      return { error: `Couldn't set up your profile fields: ${fieldsError.message}` };
    }
  }

  const mapLayers = locationType ? (payload.mapLayers ?? []).filter((label) => label.trim()) : [];
  if (mapLayers.length) {
    const { error: mapCategoriesError } = await supabase.from("map_categories").insert(
      mapLayers.map((name, i) => ({
        community_id: community.id,
        name: name.trim(),
        sort_order: i,
      }))
    );
    // Non-fatal: the Explore Map just starts with no preset layers if this
    // fails (e.g. supabase/explore-map.sql hasn't been applied yet) — an
    // admin can still add layers manually, so this shouldn't block launch.
    if (mapCategoriesError) {
      console.error("Failed to seed map categories:", mapCategoriesError.message);
    }
  }

  // Seed the built-in nav items (Events, Search) from this template's
  // configured defaults: ones present in the type's list get their saved
  // position and nav visibility; ones a super admin removed from the type are
  // turned off for this community. Non-fatal — without it a new community just
  // keeps the default Events/Search behaviour.
  if (templateKey) {
    try {
      const effective = (await getTemplateDefaultsByTemplate(supabase))[templateKey] ?? [];
      const navRows: { community_id: string; item_key: FeatureKey; sort_order: number; show_in_nav: boolean }[] = [];
      const prefRows: { community_id: string; feature_key: FeatureKey; enabled: boolean }[] = [];
      for (const key of builtinsForTemplate(templateKey)) {
        const idx = effective.findIndex((it) => it.builtin_key === key);
        if (idx >= 0) {
          navRows.push({ community_id: community.id, item_key: key, sort_order: idx, show_in_nav: effective[idx].show_in_nav });
        } else {
          prefRows.push({ community_id: community.id, feature_key: key, enabled: false });
        }
      }
      if (navRows.length) await supabase.from("community_nav_item_order").insert(navRows);
      if (prefRows.length) await supabase.from("community_feature_prefs").insert(prefRows);
    } catch (e) {
      console.error("Failed to seed built-in nav items:", e);
    }
  }

  redirect(`/c/${community.slug}/admin`);
}
