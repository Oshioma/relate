"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { countMeetupParticipants } from "@/lib/data/meetups";

export type MeetupFormState = { error: string } | undefined;

function parseCoordinate(raw: FormDataEntryValue | null, min: number, max: number): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

function parsePositiveInt(raw: FormDataEntryValue | null): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function parsePositiveNumber(raw: FormDataEntryValue | null): number | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export async function createMeetup(_prevState: MeetupFormState, formData: FormData): Promise<MeetupFormState> {
  const spaceId = String(formData.get("space_id") ?? "");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const spaceSlug = String(formData.get("space_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const activity = String(formData.get("activity") ?? "").trim();
  const meetingPoint = String(formData.get("meeting_point") ?? "").trim();
  const pace = String(formData.get("pace") ?? "").trim();
  // A datetime-local value carries no zone, so it is read in the poster's own
  // timezone — which is what they meant — and stored as a timestamptz.
  const startsAtRaw = String(formData.get("starts_at") ?? "").trim();
  const lat = parseCoordinate(formData.get("lat"), -90, 90);
  const lng = parseCoordinate(formData.get("lng"), -180, 180);
  const durationMinutes = parsePositiveInt(formData.get("duration_minutes"));
  const capacity = parsePositiveInt(formData.get("capacity"));
  const distanceKm = parsePositiveNumber(formData.get("distance_km"));

  if (!title) {
    return { error: "Say what you're doing." };
  }
  const startsAt = new Date(startsAtRaw);
  if (!startsAtRaw || Number.isNaN(startsAt.getTime())) {
    return { error: "Set when you're heading out." };
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

  const { data: meetup, error } = await supabase
    .from("meetups")
    .insert({
      space_id: spaceId,
      community_id: communityId,
      created_by: user.id,
      title,
      description: description || null,
      activity: activity || null,
      meeting_point: meetingPoint || null,
      lat,
      lng,
      starts_at: startsAt.toISOString(),
      duration_minutes: durationMinutes,
      pace: pace || null,
      distance_km: distanceKm,
      capacity,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  // The host is going, by definition — and counts against capacity. Non-fatal
  // if it fails: the meetup still stands, the host can tap "I'm in".
  await supabase.from("meetup_participants").insert({ meetup_id: meetup.id, user_id: user.id });

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return undefined;
}

export async function joinMeetup(meetupId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { data: meetup, error: meetupError } = await supabase
    .from("meetups")
    .select("id, capacity, status")
    .eq("id", meetupId)
    .maybeSingle();

  if (meetupError) {
    return { error: meetupError.message };
  }
  if (!meetup) {
    return { error: "That meetup is gone." };
  }
  if (meetup.status !== "open") {
    return { error: "That meetup was called off." };
  }

  // Advisory capacity check (see the meetups migration): read the live count
  // rather than trusting the page's snapshot, but don't lock — two people
  // taking the last spot at the same instant is a conversation, not a bug.
  if (meetup.capacity !== null) {
    const going = await countMeetupParticipants(supabase, meetupId);
    if (going >= meetup.capacity) {
      return { error: "That one's full." };
    }
  }

  const { error } = await supabase.from("meetup_participants").insert({ meetup_id: meetupId, user_id: user.id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function leaveMeetup(meetupId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("meetup_participants").delete().eq("meetup_id", meetupId).eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

// Calling it off rather than deleting it: everyone who said they'd come still
// has the meetup in their notifications, so it has to stay visible, struck
// through, until it drops off the board. RLS limits this to host or staff.
export async function cancelMeetup(meetupId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("meetups").update({ status: "cancelled" }).eq("id", meetupId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

export async function deleteMeetup(meetupId: string, communitySlug: string, spaceSlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("meetups").delete().eq("id", meetupId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}
