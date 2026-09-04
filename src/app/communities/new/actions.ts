"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { RESERVED_SUBDOMAIN_LABELS, communitySubdomainUrl } from "@/lib/custom-domain";
import { getCommunityTemplate, getPlaceLocationType, getArtistMode, getActivityKind, getSchoolKind } from "@/lib/community-templates";
import { getTemplateDefaultsByTemplate } from "@/lib/data/template-defaults";
import { getSpaceTypeDefaults } from "@/lib/data/space-type-pool";
import { builtinsForTemplate } from "@/lib/template-defaults";
import { OWNER_AGREEMENT_VERSION } from "@/lib/owner-agreement";
import type { ProfileFieldType, CommunityPrivacy, SpaceType, SpaceVisibility, FeatureKey } from "@/types/database";

export interface WizardSpaceInput {
  name: string;
  description: string;
  show_in_nav: boolean;
  space_type: SpaceType;
  staff_post_only: boolean;
  // Optional: templates that need a space to start closed set it (the School
  // template's Staff Room). Anything unrecognised falls back to 'members',
  // which is what every seeded space used before this existed.
  visibility?: SpaceVisibility;
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
  // Musician / Artist template only — 'fan' or 'collective', validated against
  // ARTIST_MODES below and dropped for every other template.
  artistMode?: string;
  // Activity template only — which activity the community is built around,
  // validated against ACTIVITY_KINDS below and dropped for every other template.
  activityKind?: string;
  // School template only — what kind of school this is, validated against
  // SCHOOL_KINDS below and dropped for every other template.
  schoolKind?: string;
  // Seeds map_categories (the map's togglable layers) so a place or activity
  // community's map isn't empty on day one. Dropped unless the matching kind
  // (locationType / activityKind) is also set and valid.
  mapLayers?: string[];
  spaces: WizardSpaceInput[];
  profileFields: WizardProfileFieldInput[];
  // The owner ticked the mandatory Community Owner Agreement checkbox. Enforced
  // server-side (not just in the wizard UI) so a community can never be created
  // without a recorded acceptance.
  ownerAgreementAccepted: boolean;
}

export type WizardResult = { error: string };

const PRIVACY_LEVELS: CommunityPrivacy[] = ["public", "private", "invite_only"];
const SPACE_VISIBILITIES: SpaceVisibility[] = ["public", "members", "private"];

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

  // The Community Owner Agreement checkbox is mandatory — refuse to create a
  // community without it, so every community carries a recorded acceptance.
  if (!payload.ownerAgreementAccepted) {
    return { error: "Please accept the Community Owner Agreement to create your community." };
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
  // Only recorded for the Musician / Artist template, and only when it's a
  // recognised mode — dropped to null otherwise.
  const artistMode =
    templateKey === "fanclub" && payload.artistMode && getArtistMode(payload.artistMode) ? payload.artistMode : null;
  // Same rule for the Activity template's chosen activity.
  const activityKind =
    templateKey === "activity" && payload.activityKind && getActivityKind(payload.activityKind) ? payload.activityKind : null;
  // Same rule for the School template's kind of school.
  const schoolKind =
    templateKey === "school" && payload.schoolKind && getSchoolKind(payload.schoolKind) ? payload.schoolKind : null;

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
      artist_mode: artistMode,
      activity_kind: activityKind,
      school_kind: schoolKind,
      owner_agreement_accepted_at: new Date().toISOString(),
      owner_agreement_version: OWNER_AGREEMENT_VERSION,
    })
    .select("id, slug")
    .single();

  if (communityError) {
    if (communityError.code === "23505") {
      return { error: "That URL is already taken — try a different one." };
    }
    return { error: communityError.message };
  }

  // Enforce the platform default pool server-side — a new community only
  // starts with space types the super admin makes available. Banned types are
  // stripped from the starter box automatically (the wizard already hides
  // them; this keeps the rule airtight if the pool changes mid-setup).
  const spaceTypeDefaults = await getSpaceTypeDefaults(supabase);
  const spaces = payload.spaces.filter((s) => s.name.trim() && spaceTypeDefaults[s.space_type]);
  if (spaces.length) {
    const slugs = uniqueSlugs(spaces.map((s) => s.name));
    const { error: spacesError } = await supabase.from("spaces").insert(
      spaces.map((s, i) => ({
        community_id: community.id,
        name: s.name.trim(),
        slug: slugs[i],
        description: s.description.trim() || null,
        // Never trust the client with a visibility: an unrecognised value would
        // otherwise reach the column as-is.
        visibility: s.visibility && SPACE_VISIBILITIES.includes(s.visibility) ? s.visibility : "members",
        sort_order: i,
        show_in_nav: s.show_in_nav,
        space_type: s.space_type,
        staff_post_only: s.staff_post_only,
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

  const mapLayers = locationType || activityKind ? (payload.mapLayers ?? []).filter((label) => label.trim()) : [];
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

  // Land the brand-new owner directly on their community's canonical
  // subdomain address (the session survives — auth cookies span the apex
  // and its subdomains). The path fallback covers dev and bare
  // *.vercel.app, where wildcard subdomains don't resolve; in production
  // the proxy would canonicalize the path form anyway.
  const subdomainUrl = communitySubdomainUrl(community.slug);
  redirect(subdomainUrl ? `${subdomainUrl}/admin` : `/c/${community.slug}/admin`);
}
