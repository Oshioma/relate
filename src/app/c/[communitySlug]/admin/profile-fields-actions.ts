"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ProfileFieldType } from "@/types/database";

export type ProfileFieldFormState = { error: string } | undefined;

const FIELD_TYPES: ProfileFieldType[] = [
  "text",
  "textarea",
  "number",
  "date",
  "dropdown",
  "multiselect",
  "checkbox",
  "url",
];

const OPTIONS_TYPES: ProfileFieldType[] = ["dropdown", "multiselect"];

export async function createProfileField(_prevState: ProfileFieldFormState, formData: FormData): Promise<ProfileFieldFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const fieldTypeRaw = String(formData.get("field_type") ?? "text");
  const isRequired = formData.get("is_required") === "on";

  if (!label) {
    return { error: "Enter a field label." };
  }

  const fieldType = FIELD_TYPES.includes(fieldTypeRaw as ProfileFieldType) ? (fieldTypeRaw as ProfileFieldType) : "text";

  const options = OPTIONS_TYPES.includes(fieldType)
    ? String(formData.get("options") ?? "")
        .split(",")
        .map((option) => option.trim())
        .filter(Boolean)
    : [];

  if (OPTIONS_TYPES.includes(fieldType) && options.length === 0) {
    return { error: "Add at least one option, separated by commas." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: existing } = await supabase
    .from("community_profile_fields")
    .select("sort_order")
    .eq("community_id", communityId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sortOrder = (existing?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("community_profile_fields").insert({
    community_id: communityId,
    label,
    field_type: fieldType,
    options,
    is_required: isRequired,
    sort_order: sortOrder,
    created_by: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "A field with that label already exists." };
    }
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  return undefined;
}

export async function deleteProfileField(fieldId: string, communitySlug: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from("community_profile_fields").delete().eq("id", fieldId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  return { error: null };
}

export async function moveProfileField(
  fieldId: string,
  direction: "up" | "down",
  communitySlug: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { data: field, error: fieldError } = await supabase
    .from("community_profile_fields")
    .select("id, community_id")
    .eq("id", fieldId)
    .maybeSingle();

  if (fieldError || !field) {
    return { error: "That field couldn't be found." };
  }

  const { data: fields, error: listError } = await supabase
    .from("community_profile_fields")
    .select("id, sort_order")
    .eq("community_id", field.community_id)
    .order("sort_order", { ascending: true });

  if (listError || !fields) {
    return { error: "Couldn't load fields." };
  }

  const index = fields.findIndex((row) => row.id === fieldId);
  const neighborIndex = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || neighborIndex < 0 || neighborIndex >= fields.length) {
    return { error: null };
  }

  const current = fields[index];
  const neighbor = fields[neighborIndex];

  const [{ error: errorA }, { error: errorB }] = await Promise.all([
    supabase.from("community_profile_fields").update({ sort_order: neighbor.sort_order }).eq("id", current.id),
    supabase.from("community_profile_fields").update({ sort_order: current.sort_order }).eq("id", neighbor.id),
  ]);

  if (errorA || errorB) {
    return { error: (errorA ?? errorB)?.message ?? "Couldn't reorder that field." };
  }

  revalidatePath(`/c/${communitySlug}/admin`);
  return { error: null };
}
