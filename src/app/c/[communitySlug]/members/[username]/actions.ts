"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CommunityProfileField } from "@/types/database";

export type ProfileFieldValuesFormState = { error: string } | undefined;

function fieldName(fieldId: string) {
  return `field_${fieldId}`;
}

function parseValue(field: CommunityProfileField, formData: FormData): string | number | boolean | string[] | null {
  const name = fieldName(field.id);

  switch (field.field_type) {
    case "checkbox":
      return formData.get(name) === "on";
    case "multiselect":
      return formData.getAll(name).map((value) => String(value));
    case "number": {
      const raw = String(formData.get(name) ?? "").trim();
      if (!raw) return null;
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : null;
    }
    default: {
      const raw = String(formData.get(name) ?? "").trim();
      return raw || null;
    }
  }
}

function isEmpty(value: string | number | boolean | string[] | null): boolean {
  if (value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "boolean") return false;
  return false;
}

export async function saveProfileFieldValues(
  _prevState: ProfileFieldValuesFormState,
  formData: FormData
): Promise<ProfileFieldValuesFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const username = String(formData.get("username") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: fields, error: fieldsError } = await supabase
    .from("community_profile_fields")
    .select("*")
    .eq("community_id", communityId);

  if (fieldsError) {
    return { error: fieldsError.message };
  }

  for (const field of fields ?? []) {
    const value = parseValue(field, formData);

    if (field.is_required && isEmpty(value)) {
      return { error: `"${field.label}" is required.` };
    }

    if (isEmpty(value)) {
      const { error } = await supabase
        .from("community_profile_values")
        .delete()
        .eq("field_id", field.id)
        .eq("profile_id", user.id);
      if (error) return { error: error.message };
      continue;
    }

    const { error } = await supabase.from("community_profile_values").upsert(
      {
        field_id: field.id,
        profile_id: user.id,
        community_id: communityId,
        value,
      },
      { onConflict: "field_id,profile_id" }
    );
    if (error) return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/members/${username}`);
  return undefined;
}
