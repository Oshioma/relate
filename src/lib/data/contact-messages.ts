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
