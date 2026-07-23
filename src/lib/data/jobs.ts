import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, JobListing, Profile, Business, Space } from "@/types/database";

type Client = SupabaseClient<Database>;

export type JobListingWithDetails = JobListing & { poster: Profile; business: Pick<Business, "id" | "name"> | null };
export type JobListingWithSpace = JobListingWithDetails & { space: Pick<Space, "id" | "name" | "slug"> };

// Newest open postings across the whole community, for the feed.
export async function getCommunityRecentJobListings(supabase: Client, communityId: string, limit = 6): Promise<JobListingWithSpace[]> {
  const { data, error } = await supabase
    .from("job_listings")
    .select("*, poster:posted_by (*), business:business_id (id, name), space:space_id (id, name, slug)")
    .eq("community_id", communityId)
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as JobListingWithSpace[];
}

export async function getSpaceJobListings(supabase: Client, spaceId: string): Promise<JobListingWithDetails[]> {
  const { data, error } = await supabase
    .from("job_listings")
    .select("*, poster:posted_by (*), business:business_id (id, name)")
    .eq("space_id", spaceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as JobListingWithDetails[];
}
