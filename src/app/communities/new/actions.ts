"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type CommunityFormState = { error: string } | undefined;

export async function createCommunity(_prevState: CommunityFormState, formData: FormData): Promise<CommunityFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isPublic = formData.get("is_public") === "on";

  if (!name) {
    return { error: "Give your community a name." };
  }

  const slug = slugify(slugInput || name);
  if (!slug || slug.length < 2) {
    return { error: "That URL can't be used — try adding some letters or numbers." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: community, error } = await supabase
    .from("communities")
    .insert({
      name,
      slug,
      description: description || null,
      owner_id: user.id,
      is_public: isPublic,
    })
    .select("slug")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "That URL is already taken — try a different one." };
    }
    return { error: error.message };
  }

  redirect(`/c/${community.slug}/admin`);
}
