"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ChallengeFormState = { error: string } | undefined;

export async function createChallenge(_prevState: ChallengeFormState, formData: FormData): Promise<ChallengeFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "");
  const endDate = String(formData.get("end_date") ?? "");

  if (!title || !startDate || !endDate) {
    return { error: "A title, start date, and end date are required." };
  }
  if (endDate < startDate) {
    return { error: "The end date can't be before the start date." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("space_challenges").insert({
    space_id: spaceId,
    community_id: communityId,
    title,
    description: description || null,
    start_date: startDate,
    end_date: endDate,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function deleteChallenge(challengeId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("space_challenges").delete().eq("id", challengeId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function joinChallenge(challengeId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("space_challenge_participants").insert({ challenge_id: challengeId, user_id: user.id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function leaveChallenge(challengeId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase
    .from("space_challenge_participants")
    .delete()
    .eq("challenge_id", challengeId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}
