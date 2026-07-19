"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function unblockMember(blockedId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { error } = await supabase.from("member_blocks").delete().eq("blocker_id", user.id).eq("blocked_id", blockedId);
  if (error) return { error: error.message };

  revalidatePath("/settings/blocked");
  return { error: null };
}
