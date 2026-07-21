"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type GuideFormState = { error: string } | undefined;

function guidePath(communitySlug: string, spaceSlug: string, guideId: string) {
  return `/c/${communitySlug}/spaces/${spaceSlug}/guides/${guideId}`;
}

export async function createGuide(_prevState: GuideFormState, formData: FormData): Promise<GuideFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!title) {
    return { error: "Give the guide a title." };
  }
  if (!body) {
    return { error: "Write something in the guide before publishing it." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: guide, error } = await supabase
    .from("guides")
    .insert({ space_id: spaceId, community_id: communityId, created_by: user.id, title, body })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  await supabase.from("guide_contributors").insert({ guide_id: guide.id, user_id: user.id });

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

// Snapshots the guide's current title/body into guide_revisions before
// applying the new ones, so there's a real history to browse and restore
// from — same idea whether this is a normal edit or a revert.
async function applyGuideEdit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  guideId: string,
  userId: string,
  newTitle: string,
  newBody: string
): Promise<{ error: string } | undefined> {
  const { data: current, error: fetchError } = await supabase.from("guides").select("title, body").eq("id", guideId).single();
  if (fetchError || !current) {
    return { error: fetchError?.message ?? "Guide not found." };
  }

  const { error: revisionError } = await supabase
    .from("guide_revisions")
    .insert({ guide_id: guideId, title: current.title, body: current.body, edited_by: userId });
  if (revisionError) {
    return { error: revisionError.message };
  }

  const { error: updateError } = await supabase.from("guides").update({ title: newTitle, body: newBody }).eq("id", guideId);
  if (updateError) {
    return { error: updateError.message };
  }

  await supabase.from("guide_contributors").insert({ guide_id: guideId, user_id: userId }).select().maybeSingle();

  return undefined;
}

export async function updateGuide(_prevState: GuideFormState, formData: FormData): Promise<GuideFormState> {
  const guideId = String(formData.get("guide_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!title) {
    return { error: "Give the guide a title." };
  }
  if (!body) {
    return { error: "The guide can't be empty." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const result = await applyGuideEdit(supabase, guideId, user.id, title, body);
  if (result?.error) {
    return result;
  }

  revalidatePath(guidePath(communitySlug, spaceSlug, guideId));
  return undefined;
}

export async function restoreGuideRevision(revisionId: string, guideId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: revision, error: fetchError } = await supabase.from("guide_revisions").select("title, body").eq("id", revisionId).single();
  if (fetchError || !revision) {
    return { error: fetchError?.message ?? "Revision not found." };
  }

  const result = await applyGuideEdit(supabase, guideId, user.id, revision.title, revision.body);
  if (result?.error) {
    return result;
  }

  revalidatePath(guidePath(communitySlug, spaceSlug, guideId));
  return { error: null };
}

export async function deleteGuide(guideId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("guides").delete().eq("id", guideId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function setGuideFeatured(guideId: string, featured: boolean, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("guides").update({ featured }).eq("id", guideId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  revalidatePath(guidePath(communitySlug, spaceSlug, guideId));
  return { error: null };
}

export async function rateGuide(guideId: string, rating: number, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("guide_ratings").upsert({ guide_id: guideId, user_id: user.id, rating }, { onConflict: "guide_id,user_id" });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(guidePath(communitySlug, spaceSlug, guideId));
  return { error: null };
}

export async function addGuideComment(_prevState: GuideFormState, formData: FormData): Promise<GuideFormState> {
  const guideId = String(formData.get("guide_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!body) {
    return { error: "Write a comment first." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("guide_comments").insert({ guide_id: guideId, author_id: user.id, body });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(guidePath(communitySlug, spaceSlug, guideId));
  return undefined;
}

export async function deleteGuideComment(commentId: string, guideId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("guide_comments").delete().eq("id", commentId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(guidePath(communitySlug, spaceSlug, guideId));
  return { error: null };
}
