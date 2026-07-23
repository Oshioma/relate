"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "@/lib/utils";

export type EventFormState = { error: string } | undefined;

function parseImageUrl(raw: FormDataEntryValue | null): string | null {
  const value = String(raw ?? "").trim();
  return /^https?:\/\//.test(value) ? value : null;
}

export async function createEvent(_prevState: EventFormState, formData: FormData): Promise<EventFormState> {
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startTime = String(formData.get("start_time") ?? "");
  const endTime = String(formData.get("end_time") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const onlineUrl = normalizeUrl(String(formData.get("online_url") ?? ""));
  const imageUrl = parseImageUrl(formData.get("image_url"));
  const latRaw = String(formData.get("lat") ?? "").trim();
  const lngRaw = String(formData.get("lng") ?? "").trim();
  const lat = latRaw ? Number(latRaw) : null;
  const lng = lngRaw ? Number(lngRaw) : null;

  if (!title || !startTime) {
    return { error: "Give the event a title and a start time." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("events").insert({
    community_id: communityId,
    title,
    description: description || null,
    start_time: new Date(startTime).toISOString(),
    end_time: endTime ? new Date(endTime).toISOString() : null,
    location: location || null,
    online_url: onlineUrl || null,
    image_url: imageUrl,
    lat,
    lng,
    created_by: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/events`);
  return undefined;
}

// RLS (events_update_creator_or_staff) restricts this to the event's
// creator or community staff — anyone else's update matches zero rows.
export async function updateEvent(_prevState: EventFormState, formData: FormData): Promise<EventFormState> {
  const eventId = String(formData.get("event_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startTime = String(formData.get("start_time") ?? "");
  const endTime = String(formData.get("end_time") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const onlineUrl = normalizeUrl(String(formData.get("online_url") ?? ""));
  const imageUrl = parseImageUrl(formData.get("image_url"));
  const latRaw = String(formData.get("lat") ?? "").trim();
  const lngRaw = String(formData.get("lng") ?? "").trim();
  const lat = latRaw ? Number(latRaw) : null;
  const lng = lngRaw ? Number(lngRaw) : null;

  if (!title || !startTime) {
    return { error: "Give the event a title and a start time." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase
    .from("events")
    .update({
      title,
      description: description || null,
      start_time: new Date(startTime).toISOString(),
      end_time: endTime ? new Date(endTime).toISOString() : null,
      location: location || null,
      online_url: onlineUrl || null,
      image_url: imageUrl,
      lat,
      lng,
    })
    .eq("id", eventId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/events`);
  return undefined;
}

export async function rsvpToEvent(eventId: string, communitySlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("event_rsvps").insert({ event_id: eventId, user_id: user.id });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/events`);
  return { error: null };
}

// RLS (events_delete_creator_or_staff) restricts this to the event's
// creator or community staff — anyone else's delete matches zero rows.
export async function deleteEvent(eventId: string, communitySlug: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/events`);
  return { error: null };
}

export async function cancelRsvp(eventId: string, communitySlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("event_rsvps").delete().eq("event_id", eventId).eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/events`);
  return { error: null };
}
