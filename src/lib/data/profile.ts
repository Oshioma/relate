import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getCurrentUser(supabase: Client): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(supabase: Client, userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}
