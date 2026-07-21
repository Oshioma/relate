"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { JOB_TYPES } from "@/lib/job-types";
import type { JobType, JobListingStatus } from "@/types/database";

export type JobFormState = { error: string } | undefined;

function parseJobType(raw: FormDataEntryValue | null): JobType {
  const value = String(raw ?? "full_time");
  return JOB_TYPES.some((t) => t.value === value) ? (value as JobType) : "full_time";
}

function parseCoordinate(raw: FormDataEntryValue | null, min: number, max: number): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

export async function createJobListing(_prevState: JobFormState, formData: FormData): Promise<JobFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const jobType = parseJobType(formData.get("job_type"));
  const salary = String(formData.get("salary") ?? "").trim();
  const locationLabel = String(formData.get("location_label") ?? "").trim();
  const applyUrl = String(formData.get("apply_url") ?? "").trim();
  const lat = parseCoordinate(formData.get("lat"), -90, 90);
  const lng = parseCoordinate(formData.get("lng"), -180, 180);

  if (!title) {
    return { error: "Give the listing a title." };
  }
  if (!description) {
    return { error: "Add a description of the role." };
  }
  if ((lat === null) !== (lng === null)) {
    return { error: "Set both latitude and longitude, or leave both blank." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("job_listings").insert({
    space_id: spaceId,
    community_id: communityId,
    posted_by: user.id,
    title,
    description,
    job_type: jobType,
    salary: salary || null,
    location_label: locationLabel || null,
    apply_url: applyUrl || null,
    lat,
    lng,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function deleteJobListing(jobId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("job_listings").delete().eq("id", jobId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function setJobListingStatus(jobId: string, status: JobListingStatus, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("job_listings").update({ status }).eq("id", jobId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}
