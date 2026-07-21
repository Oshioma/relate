"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { getPlaceLocationType } from "@/lib/community-templates";
import type { ProfileFieldType, CommunityPrivacy, SpaceType } from "@/types/database";

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

  const privacy = PRIVACY_LEVELS.includes(payload.privacy) ? payload.privacy : "public";
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

  redirect(`/c/${community.slug}/admin`);
}
