import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, JobListing, Profile, Business } from "@/types/database";

type Client = SupabaseClient<Database>;

export type JobListingWithDetails = JobListing & { poster: Profile; business: Pick<Business, "id" | "name"> | null };

export async function getSpaceJobListings(supabase: Client, spaceId: string): Promise<JobListingWithDetails[]> {
  const { data, error } = await supabase
    .from("job_listings")
    .select("*, poster:posted_by (*), business:business_id (id, name)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as JobListingWithDetails[];
}
