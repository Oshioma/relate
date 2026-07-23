"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "@/lib/utils";
import { geocodeLocation } from "@/lib/geocode";

export type EventFormState = { error: string } | undefined;

function parseImageUrl(raw: FormDataEntryValue | null): string | null {
  const value = String(raw ?? "").trim();
  return /^https?:\/\//.test(value) ? value : null;
}

// Turns the event's Location text into map coordinates — this is what puts
// an event on the Explore Map, no separate pin-drop step. Tries the text
// biased with the community's own location first (disambiguates a small
// place name like "Kendwa" from anywhere else in the world called that),
// then falls back to the bare text. Returns null (no pin) for a blank
// location or one that doesn't geocode to anything.
async function geocodeEventLocation(
  location: string,
  communityLocationName: string | null
): Promise<{ lat: number; lng: number } | null> {
  if (!location) return null;

  const biased = communityLocationName ? await geocodeLocation(`${location}, ${communityLocationName}`) : null;
  const hit = biased ?? (await geocodeLocation(location));
  return hit ? { lat: hit.lat, lng: hit.lng } : null;
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
  const communityLocationName = String(formData.get("community_location_name") ?? "").trim() || null;

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

  const geocoded = await geocodeEventLocation(location, communityLocationName);

  const { error } = await supabase.from("events").insert({
    community_id: communityId,
    title,
    description: description || null,
    start_time: new Date(startTime).toISOString(),
    end_time: endTime ? new Date(endTime).toISOString() : null,
    location: location || null,
    online_url: onlineUrl || null,
    image_url: imageUrl,
    lat: geocoded?.lat ?? null,
    lng: geocoded?.lng ?? null,
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
  const communityLocationName = String(formData.get("community_location_name") ?? "").trim() || null;

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

  const geocoded = await geocodeEventLocation(location, communityLocationName);

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
      lat: geocoded?.lat ?? null,
      lng: geocoded?.lng ?? null,
    })
    .eq("id", eventId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/events`);
  return undefined;
}

// RLS (events_update_creator_or_staff) restricts this to the event's
// creator or community staff. A quick way to set/replace/remove just the
// photo without opening the full edit form. Pass null to remove the image.
export async function updateEventImage(eventId: string, communitySlug: string, imageUrl: string | null) {
  if (imageUrl && !/^https?:\/\//.test(imageUrl)) {
    return { error: "Enter a valid image URL starting with http:// or https://" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("events").update({ image_url: imageUrl }).eq("id", eventId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/events`);
  return { error: null };
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
