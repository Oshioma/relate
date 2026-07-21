"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { VolunteerProjectStatus } from "@/types/database";

export type VolunteerProjectFormState = { error: string } | undefined;

function parseCoordinate(raw: FormDataEntryValue | null, min: number, max: number): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

function parseVolunteersNeeded(raw: FormDataEntryValue | null): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function createVolunteerProject(_prevState: VolunteerProjectFormState, formData: FormData): Promise<VolunteerProjectFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const volunteersNeeded = parseVolunteersNeeded(formData.get("volunteers_needed"));
  const locationLabel = String(formData.get("location_label") ?? "").trim();
  const lat = parseCoordinate(formData.get("lat"), -90, 90);
  const lng = parseCoordinate(formData.get("lng"), -180, 180);

  if (!title) {
    return { error: "Give the project a title." };
  }
  if (!description) {
    return { error: "Describe what help is needed." };
  }
  if ((lat === null) !== (lng === null)) {
    return { error: "Set both latitude and longitude, or leave both blank." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: project, error } = await supabase
    .from("volunteer_projects")
    .insert({
      space_id: spaceId,
      community_id: communityId,
      organiser_id: user.id,
      title,
      category: category || null,
      description,
      volunteers_needed: volunteersNeeded,
      location_label: locationLabel || null,
      lat,
      lng,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  // The organiser signs up for their own project automatically.
  await supabase.from("volunteer_signups").insert({ project_id: project.id, user_id: user.id });

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function deleteVolunteerProject(projectId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("volunteer_projects").delete().eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function setVolunteerProjectStatus(projectId: string, status: VolunteerProjectStatus, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("volunteer_projects").update({ status }).eq("id", projectId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function signUpForProject(projectId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("volunteer_signups").insert({ project_id: projectId, user_id: user.id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function withdrawFromProject(projectId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("volunteer_signups").delete().eq("project_id", projectId).eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}
