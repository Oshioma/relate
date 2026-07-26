"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type FarmVisibilityState = { error: string } | { ok: true; isPublic: boolean } | undefined;

// Toggle whether the signed-in member's shamba.online farm is public, so other
// members of the community can browse their crops. We snapshot the member's
// email onto the farm_shares row here (it's needed server-side to query the
// farm bridge, and RLS keeps it to the owner's own row).
export async function setFarmVisibility(_prevState: FarmVisibilityState, formData: FormData): Promise<FarmVisibilityState> {
  const isPublic = formData.get("is_public") === "true";
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase.from("farm_shares").upsert(
    {
      profile_id: user.id,
      is_public: isPublic,
      // Refresh the email snapshot on every change so a public farm always
      // queries the bridge with the member's current address.
      farm_email: user.email ?? null,
    },
    { onConflict: "profile_id" }
  );
  if (error) return { error: error.message };

  if (communitySlug && spaceSlug) revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { ok: true, isPublic };
}
