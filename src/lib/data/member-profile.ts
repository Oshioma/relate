import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, BusinessProfile, MemberLocation, HelpRequestKind, MemberBlock, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function getMemberInterests(supabase: Client, profileId: string): Promise<string[]> {
  const { data, error } = await supabase.from("member_interests").select("interest").eq("profile_id", profileId).order("created_at");
  if (error) throw error;
  return (data ?? []).map((row) => row.interest);
}

export async function getMemberSkills(supabase: Client, profileId: string): Promise<string[]> {
  const { data, error } = await supabase.from("member_skills").select("skill").eq("profile_id", profileId).order("created_at");
  if (error) throw error;
  return (data ?? []).map((row) => row.skill);
}

export async function getMemberHelpTopics(supabase: Client, profileId: string, kind: HelpRequestKind): Promise<string[]> {
  const { data, error } = await supabase
    .from("member_help_requests")
    .select("topic")
    .eq("profile_id", profileId)
    .eq("kind", kind)
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map((row) => row.topic);
}

export async function getMemberLocation(supabase: Client, profileId: string): Promise<MemberLocation | null> {
  const { data, error } = await supabase.from("member_locations").select("*").eq("profile_id", profileId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getBusinessProfile(supabase: Client, profileId: string): Promise<BusinessProfile | null> {
  const { data, error } = await supabase.from("business_profiles").select("*").eq("profile_id", profileId).maybeSingle();
  if (error) throw error;
  return data;
}

export type BlockedMember = MemberBlock & { blocked: Profile };

export async function getBlockedMembers(supabase: Client, blockerId: string): Promise<BlockedMember[]> {
  const { data, error } = await supabase
    .from("member_blocks")
    .select("*, blocked:blocked_id (*)")
    .eq("blocker_id", blockerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as BlockedMember[];
}
