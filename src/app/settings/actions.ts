"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "@/lib/utils";
import type { HelpRequestKind } from "@/types/database";

export type ProfileFormState = { error: string } | undefined;

const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;

const SOCIAL_KEYS = ["linkedin", "twitter", "instagram", "facebook"] as const;

export async function updateProfile(_prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const bio = String(formData.get("bio") ?? "").trim();
  const profession = String(formData.get("profession") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const website = normalizeUrl(String(formData.get("website") ?? ""));

  if (!USERNAME_PATTERN.test(username)) {
    return { error: "Username must be 3-30 characters: lowercase letters, numbers, and underscores only." };
  }

  const socialLinks: Record<string, string> = {};
  for (const key of SOCIAL_KEYS) {
    const value = normalizeUrl(String(formData.get(key) ?? ""));
    if (value) socialLinks[key] = value;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      username,
      bio: bio || null,
      profession: profession || null,
      company: company || null,
      website: website || null,
      social_links: socialLinks,
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is already taken." };
    }
    return { error: error.message };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return undefined;
}

type ActionResult = { error: string | null };

async function requireUserId(): Promise<{ supabase: Awaited<ReturnType<typeof createClient>>; userId: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };
  return { supabase, userId: user.id };
}

export async function addInterest(interest: string): Promise<ActionResult> {
  const trimmed = interest.trim();
  if (!trimmed) return { error: "Enter an interest." };

  const auth = await requireUserId();
  if ("error" in auth) return auth;

  const { error } = await auth.supabase.from("member_interests").insert({ profile_id: auth.userId, interest: trimmed });
  if (error && error.code !== "23505") return { error: error.message };

  revalidatePath("/settings");
  return { error: null };
}

export async function removeInterest(interest: string): Promise<ActionResult> {
  const auth = await requireUserId();
  if ("error" in auth) return auth;

  const { error } = await auth.supabase
    .from("member_interests")
    .delete()
    .eq("profile_id", auth.userId)
    .eq("interest", interest);
  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { error: null };
}

export async function addSkill(skill: string): Promise<ActionResult> {
  const trimmed = skill.trim();
  if (!trimmed) return { error: "Enter a skill." };

  const auth = await requireUserId();
  if ("error" in auth) return auth;

  const { error } = await auth.supabase.from("member_skills").insert({ profile_id: auth.userId, skill: trimmed });
  if (error && error.code !== "23505") return { error: error.message };

  revalidatePath("/settings");
  return { error: null };
}

export async function removeSkill(skill: string): Promise<ActionResult> {
  const auth = await requireUserId();
  if ("error" in auth) return auth;

  const { error } = await auth.supabase.from("member_skills").delete().eq("profile_id", auth.userId).eq("skill", skill);
  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { error: null };
}

async function addHelpTopic(kind: HelpRequestKind, topic: string): Promise<ActionResult> {
  const trimmed = topic.trim();
  if (!trimmed) return { error: "Enter a topic." };

  const auth = await requireUserId();
  if ("error" in auth) return auth;

  const { error } = await auth.supabase.from("member_help_requests").insert({ profile_id: auth.userId, kind, topic: trimmed });
  if (error && error.code !== "23505") return { error: error.message };

  revalidatePath("/settings");
  return { error: null };
}

async function removeHelpTopic(kind: HelpRequestKind, topic: string): Promise<ActionResult> {
  const auth = await requireUserId();
  if ("error" in auth) return auth;

  const { error } = await auth.supabase
    .from("member_help_requests")
    .delete()
    .eq("profile_id", auth.userId)
    .eq("kind", kind)
    .eq("topic", topic);
  if (error) return { error: error.message };

  revalidatePath("/settings");
  return { error: null };
}

export async function addNeedsHelpTopic(topic: string): Promise<ActionResult> {
  return addHelpTopic("needs_help", topic);
}

export async function removeNeedsHelpTopic(topic: string): Promise<ActionResult> {
  return removeHelpTopic("needs_help", topic);
}

export async function addCanHelpTopic(topic: string): Promise<ActionResult> {
  return addHelpTopic("can_help", topic);
}

export async function removeCanHelpTopic(topic: string): Promise<ActionResult> {
  return removeHelpTopic("can_help", topic);
}

export type LocationFormState = { error: string } | undefined;

export async function updateLocation(_prevState: LocationFormState, formData: FormData): Promise<LocationFormState> {
  const city = String(formData.get("city") ?? "").trim();
  const region = String(formData.get("region") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const isVisible = formData.get("is_visible") === "on";

  const auth = await requireUserId();
  if ("error" in auth) return auth;

  const { error } = await auth.supabase
    .from("member_locations")
    .upsert(
      { profile_id: auth.userId, city: city || null, region: region || null, country: country || null, is_visible: isVisible },
      { onConflict: "profile_id" }
    );

  if (error) return { error: error.message };

  revalidatePath("/settings");
  return undefined;
}

export type PrivacyFormState = { error: string } | undefined;

export async function updatePrivacy(_prevState: PrivacyFormState, formData: FormData): Promise<PrivacyFormState> {
  const auth = await requireUserId();
  if ("error" in auth) return auth;

  const { error } = await auth.supabase
    .from("profiles")
    .update({
      hide_profile: formData.get("hide_profile") === "on",
      hide_online_status: formData.get("hide_online_status") === "on",
      hide_communities: formData.get("hide_communities") === "on",
      hide_social_links: formData.get("hide_social_links") === "on",
      hide_business_profile: formData.get("hide_business_profile") === "on",
      is_discoverable: formData.get("is_discoverable") === "on",
    })
    .eq("id", auth.userId);
  if (error) return { error: error.message };

  revalidatePath("/settings");
  return undefined;
}
