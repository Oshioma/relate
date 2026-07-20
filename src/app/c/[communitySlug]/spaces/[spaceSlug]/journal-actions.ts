"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "@/lib/utils";
import type { SpaceJournalEntryData } from "@/types/database";

export type JournalEntryFormState = { error: string } | undefined;

export async function createJournalEntry(_prevState: JournalEntryFormState, formData: FormData): Promise<JournalEntryFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  // Field types are re-read server-side rather than trusted from the client,
  // so a tampered form can't smuggle in a mis-typed value.
  const { data: fields, error: fieldsError } = await supabase.from("space_journal_fields").select("*").eq("space_id", spaceId);

  if (fieldsError) {
    return { error: fieldsError.message };
  }
  if (!fields || fields.length === 0) {
    return { error: "This journal has no fields set up yet." };
  }

  const data: SpaceJournalEntryData = {};

  for (const field of fields) {
    const raw = formData.getAll(`field:${field.id}`);

    if (field.field_type === "checkbox") {
      data[field.id] = raw.length > 0 && raw[0] === "on";
    } else if (field.field_type === "multiselect") {
      data[field.id] = raw.map(String).filter(Boolean);
    } else if (field.field_type === "number") {
      const value = String(raw[0] ?? "").trim();
      data[field.id] = value ? Number(value) : null;
    } else if (field.field_type === "url") {
      const value = normalizeUrl(String(raw[0] ?? ""));
      data[field.id] = value || null;
    } else {
      const value = String(raw[0] ?? "").trim();
      data[field.id] = value || null;
    }

    const value = data[field.id];
    const isEmpty = value === null || value === "" || (Array.isArray(value) && value.length === 0);
    if (field.is_required && isEmpty) {
      return { error: `"${field.label}" is required.` };
    }
  }

  const { error } = await supabase.from("space_journal_entries").insert({
    space_id: spaceId,
    community_id: communityId,
    author_id: user.id,
    data,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}
