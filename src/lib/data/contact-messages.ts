import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ContactMessage } from "@/types/database";

type Client = SupabaseClient<Database>;

// Contact-form submissions, newest first, for the super-admin inbox. RLS only
// returns rows to a super admin, so this is safe with the user-scoped client —
// a non-super-admin simply gets an empty list. Capped to the most recent 200.
export async function getContactMessages(supabase: Client): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}

// A single community's contact-form submissions, newest first, for the
// community-admin inbox. RLS returns these rows only to that community's owner
// and admins, so a non-staff viewer gets an empty list. Capped to 200.
export async function getCommunityContactMessages(supabase: Client, communityId: string): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return data ?? [];
}
