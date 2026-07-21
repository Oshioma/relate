"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { BUSINESS_CATEGORIES } from "@/lib/business-categories";
import type { BusinessCategory } from "@/types/database";

export type BusinessFormState = { error: string } | undefined;

function parseCategory(raw: FormDataEntryValue | null): BusinessCategory {
  const value = String(raw ?? "other");
  return BUSINESS_CATEGORIES.some((c) => c.value === value) ? (value as BusinessCategory) : "other";
}

export async function createBusiness(_prevState: BusinessFormState, formData: FormData): Promise<BusinessFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const category = parseCategory(formData.get("category"));
  const description = String(formData.get("description") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const openingHours = String(formData.get("opening_hours") ?? "").trim();

  if (!name) {
    return { error: "Give the business a name." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("businesses").insert({
    space_id: spaceId,
    community_id: communityId,
    created_by: user.id,
    name,
    category,
    description: description || null,
    website: website || null,
    phone: phone || null,
    address: address || null,
    opening_hours: openingHours || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function deleteBusiness(businessId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("businesses").delete().eq("id", businessId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

// verified/featured are also enforced staff-only at the database level (see
// enforce_business_privileged_fields in supabase/business-directory.sql) —
// this check just gives a member a clear error instead of a silent no-op.
export async function setBusinessBadge(
  businessId: string,
  field: "verified" | "featured",
  value: boolean,
  communitySlug: string,
  spaceSlug: string
) {
  const supabase = await createClient();
  const patch = field === "verified" ? { verified: value } : { featured: value };
  const { error } = await supabase.from("businesses").update(patch).eq("id", businessId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}
