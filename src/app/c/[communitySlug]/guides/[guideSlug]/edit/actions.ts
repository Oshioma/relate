"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug, getMembership, isCommunityAdmin, isCommunityStaff } from "@/lib/data/community";
import { getEditorialGuide } from "@/lib/data/editorial-guides";
import { destinationOverrideSchema, defaultDestination, overridesSchema, photoSchema } from "@/lib/guides/where-to-stay/content";
import { BOUTIQUE_HOTELS_SLUG, boutiqueOverridesSchema, defaultHotel, hotelPhotosSchema } from "@/lib/guides/boutique-hotels/content";

// Admin actions for an editorial guide. RLS is the real gate (only community
// admins can write editorial_guides, only staff can write local updates);
// the role checks here just turn a would-be RLS failure into a clear message.

type Result = { error: string } | { ok: true };

async function context(communitySlug: string, guideSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." } as const;
  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return { error: "Community not found." } as const;
  const membership = await getMembership(supabase, community.id, user.id);
  const guide = await getEditorialGuide(supabase, community.id, guideSlug);
  if (!guide) return { error: "Guide not found." } as const;
  return {
    supabase,
    user,
    community,
    guide,
    isAdmin: isCommunityAdmin(community, membership, user.id),
    isStaff: isCommunityStaff(community, membership, user.id),
  } as const;
}

function revalidate(communitySlug: string, guideSlug: string) {
  revalidatePath(`/c/${communitySlug}/guides/${guideSlug}`);
  revalidatePath(`/c/${communitySlug}/guides`);
  revalidatePath(`/c/${communitySlug}`, "layout");
}

function storedOverrides(content: unknown) {
  const parsed = overridesSchema.safeParse(content ?? {});
  return parsed.success ? parsed.data : {};
}

// The boutique hotels guide keeps its own override shape; parsing it with the
// Where to Stay schema would silently drop its hotel photos on the next save.
function storedBoutiqueOverrides(content: unknown) {
  const parsed = boutiqueOverridesSchema.safeParse(content ?? {});
  return parsed.success ? parsed.data : {};
}

const settingsSchema = z.object({
  status: z.enum(["draft", "published"]),
  lastReviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  editorsNote: z.string().trim().max(1000),
  heroPhoto: photoSchema.nullable(),
});

export async function saveGuideSettings(communitySlug: string, guideSlug: string, input: unknown): Promise<Result> {
  const ctx = await context(communitySlug, guideSlug);
  if ("error" in ctx) return { error: ctx.error ?? "Something went wrong." };
  if (!ctx.isAdmin) return { error: "Only community admins can edit this guide." };
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const overrides = guideSlug === BOUTIQUE_HOTELS_SLUG ? storedBoutiqueOverrides(ctx.guide.content) : storedOverrides(ctx.guide.content);
  const { error } = await ctx.supabase
    .from("editorial_guides")
    .update({
      status: parsed.data.status,
      last_reviewed_on: parsed.data.lastReviewedOn,
      content: { ...overrides, editorsNote: parsed.data.editorsNote || null, heroPhoto: parsed.data.heroPhoto },
      updated_by: ctx.user.id,
    })
    .eq("id", ctx.guide.id);
  if (error) return { error: error.message };
  revalidate(communitySlug, guideSlug);
  return { ok: true };
}

// Saves one destination in full. The stored override is the whole edited
// destination, so what the admin saw in the editor is exactly what renders.
export async function saveDestination(communitySlug: string, guideSlug: string, key: string, input: unknown): Promise<Result> {
  const ctx = await context(communitySlug, guideSlug);
  if ("error" in ctx) return { error: ctx.error ?? "Something went wrong." };
  if (!ctx.isAdmin) return { error: "Only community admins can edit this guide." };
  if (guideSlug === BOUTIQUE_HOTELS_SLUG || !defaultDestination(key)) return { error: "Unknown destination." };

  const parsed = destinationOverrideSchema.required({ name: true, rank: true, panel: true }).safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue ? `${issue.path.join(" › ") || "Form"}: ${issue.message}` : "Please check the form." };
  }

  const overrides = storedOverrides(ctx.guide.content);
  const destinations = { ...(overrides.destinations ?? {}), [key]: parsed.data };
  const { error } = await ctx.supabase
    .from("editorial_guides")
    .update({ content: { ...overrides, destinations }, updated_by: ctx.user.id })
    .eq("id", ctx.guide.id);
  if (error) return { error: error.message };
  revalidate(communitySlug, guideSlug);
  return { ok: true };
}

// Boutique hotels guide: replace one hotel's photos (e.g. once a hotel has
// given written permission). An empty list restores the built-in photos.
export async function saveHotelPhotos(communitySlug: string, guideSlug: string, key: string, input: unknown): Promise<Result> {
  const ctx = await context(communitySlug, guideSlug);
  if ("error" in ctx) return { error: ctx.error ?? "Something went wrong." };
  if (!ctx.isAdmin) return { error: "Only community admins can edit this guide." };
  if (guideSlug !== BOUTIQUE_HOTELS_SLUG || !defaultHotel(key)) return { error: "Unknown hotel." };

  const parsed = hotelPhotosSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { error: issue ? `${issue.path.join(" › ") || "Photos"}: ${issue.message}` : "Please check the photos." };
  }

  const overrides = storedBoutiqueOverrides(ctx.guide.content);
  const hotelPhotos = { ...(overrides.hotelPhotos ?? {}) };
  if (parsed.data.length > 0) hotelPhotos[key] = parsed.data;
  else delete hotelPhotos[key];
  const { error } = await ctx.supabase
    .from("editorial_guides")
    .update({ content: { ...overrides, hotelPhotos }, updated_by: ctx.user.id })
    .eq("id", ctx.guide.id);
  if (error) return { error: error.message };
  revalidate(communitySlug, guideSlug);
  return { ok: true };
}

export async function resetDestination(communitySlug: string, guideSlug: string, key: string): Promise<Result> {
  const ctx = await context(communitySlug, guideSlug);
  if ("error" in ctx) return { error: ctx.error ?? "Something went wrong." };
  if (!ctx.isAdmin) return { error: "Only community admins can edit this guide." };
  if (guideSlug === BOUTIQUE_HOTELS_SLUG) return { error: "Unknown destination." };
  const overrides = storedOverrides(ctx.guide.content);
  const destinations = { ...(overrides.destinations ?? {}) };
  delete destinations[key];
  const { error } = await ctx.supabase
    .from("editorial_guides")
    .update({ content: { ...overrides, destinations }, updated_by: ctx.user.id })
    .eq("id", ctx.guide.id);
  if (error) return { error: error.message };
  revalidate(communitySlug, guideSlug);
  return { ok: true };
}

const updateSchema = z.object({
  destinationKey: z.string().min(1).nullable(),
  kind: z.enum(["restaurant", "beach_access", "accommodation", "seasonal", "event", "road", "other"]),
  body: z.string().trim().min(1, "Write the update.").max(600),
  notedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  expiresOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
});

export async function addGuideUpdate(communitySlug: string, guideSlug: string, input: unknown): Promise<Result> {
  const ctx = await context(communitySlug, guideSlug);
  if ("error" in ctx) return { error: ctx.error ?? "Something went wrong." };
  if (!ctx.isStaff) return { error: "Only community staff can add local updates." };
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  if (parsed.data.destinationKey && !defaultDestination(parsed.data.destinationKey)) return { error: "Unknown destination." };

  const { error } = await ctx.supabase.from("editorial_guide_updates").insert({
    guide_id: ctx.guide.id,
    community_id: ctx.community.id,
    destination_key: parsed.data.destinationKey,
    kind: parsed.data.kind,
    body: parsed.data.body,
    noted_on: parsed.data.notedOn,
    expires_on: parsed.data.expiresOn,
    created_by: ctx.user.id,
  });
  if (error) return { error: error.message };
  revalidate(communitySlug, guideSlug);
  return { ok: true };
}

export async function deleteGuideUpdate(communitySlug: string, guideSlug: string, updateId: string): Promise<Result> {
  const ctx = await context(communitySlug, guideSlug);
  if ("error" in ctx) return { error: ctx.error ?? "Something went wrong." };
  if (!ctx.isStaff) return { error: "Only community staff can remove local updates." };
  const { error } = await ctx.supabase.from("editorial_guide_updates").delete().eq("id", updateId).eq("guide_id", ctx.guide.id);
  if (error) return { error: error.message };
  revalidate(communitySlug, guideSlug);
  return { ok: true };
}
