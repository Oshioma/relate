"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type BusinessFormState = { error: string } | undefined;

const SOCIAL_KEYS = ["linkedin", "twitter", "instagram", "facebook"] as const;
const CONTACT_KEYS = ["email", "phone"] as const;

function parseList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function upsertBusinessProfile(_prevState: BusinessFormState, formData: FormData): Promise<BusinessFormState> {
  const businessName = String(formData.get("business_name") ?? "").trim();
  if (!businessName) {
    return { error: "Business name is required." };
  }

  const description = String(formData.get("description") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const services = parseList(formData.get("services"));
  const products = parseList(formData.get("products"));

  const contactLinks: Record<string, string> = {};
  for (const key of CONTACT_KEYS) {
    const value = String(formData.get(`contact_${key}`) ?? "").trim();
    if (value) contactLinks[key] = value;
  }

  const socialLinks: Record<string, string> = {};
  for (const key of SOCIAL_KEYS) {
    const value = String(formData.get(`social_${key}`) ?? "").trim();
    if (value) socialLinks[key] = value;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase.from("business_profiles").upsert(
    {
      profile_id: user.id,
      business_name: businessName,
      description: description || null,
      website: website || null,
      industry: industry || null,
      location: location || null,
      services,
      products,
      contact_links: contactLinks,
      social_links: socialLinks,
    },
    { onConflict: "profile_id" }
  );

  if (error) return { error: error.message };

  revalidatePath("/settings/business");
  revalidatePath("/settings");
  return undefined;
}

export async function deleteBusinessProfile(): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase.from("business_profiles").delete().eq("profile_id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/settings/business");
  revalidatePath("/settings");
  return { error: null };
}
