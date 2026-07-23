import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { MapItem } from "@/lib/map-item-kinds";
import { jobTypeLabel } from "@/lib/job-types";
import { accommodationTypeLabel } from "@/lib/accommodation-types";
import { recommendationCategoryLabel } from "@/lib/recommendation-categories";

type Client = SupabaseClient<Database>;

// Gathers every located entity in the community into one pin list for the
// Explore Map — the "Living Map": a marketplace listing appears where the
// seller is, an event at its venue, a volunteer project where help is
// needed. Community-scoped like getCommunityMapPinnedBusinesses, and RLS
// still applies per table, so members only see pins from spaces they can
// view. Closed/expired/past items are left off — the map shows the living
// community, not its archive.
export async function getCommunityMapItems(supabase: Client, communityId: string, communitySlug: string): Promise<MapItem[]> {
  const [spacesRes, eventsRes, listingsRes, jobsRes, staysRes, recsRes, clubsRes, volunteerRes, postsRes] = await Promise.all([
    supabase.from("spaces").select("id, slug").eq("community_id", communityId),
    supabase.from("events").select("*").eq("community_id", communityId).not("lat", "is", null).not("lng", "is", null),
    supabase.from("marketplace_listings").select("*").eq("community_id", communityId).not("lat", "is", null).not("lng", "is", null).eq("status", "active"),
    supabase.from("job_listings").select("*").eq("community_id", communityId).not("lat", "is", null).not("lng", "is", null).eq("status", "open"),
    supabase.from("accommodation_listings").select("*").eq("community_id", communityId).not("lat", "is", null).not("lng", "is", null).eq("status", "available"),
    // Recommendations tied to a business/landmark would stack a second pin
    // on top of one the map already draws — only free-standing tips render.
    supabase.from("recommendations").select("*").eq("community_id", communityId).not("lat", "is", null).not("lng", "is", null).is("business_id", null).is("landmark_id", null),
    supabase.from("clubs").select("*").eq("community_id", communityId).not("lat", "is", null).not("lng", "is", null),
    supabase.from("volunteer_projects").select("*").eq("community_id", communityId).not("lat", "is", null).not("lng", "is", null).in("status", ["open", "in_progress"]),
    supabase.from("posts").select("*").eq("community_id", communityId).not("lat", "is", null).not("lng", "is", null),
  ]);

  const slugBySpace = new Map((spacesRes.data ?? []).map((s) => [s.id, s.slug]));
  const spaceHref = (spaceId: string) => {
    const slug = slugBySpace.get(spaceId);
    return slug ? `/c/${communitySlug}/spaces/${slug}` : null;
  };

  const items: MapItem[] = [];
  // Every kind here gets its pin from a human placing it (map click, or a
  // typed coordinate) — "exact" by default. Events are the one exception,
  // overridden below, since a typed Location is geocoded to a general area.
  const base: Pick<MapItem, "description" | "imageUrl" | "startTime" | "endTime" | "price" | "currency" | "meta" | "locationPrecision"> = {
    description: null,
    imageUrl: null,
    startTime: null,
    endTime: null,
    price: null,
    currency: null,
    meta: null,
    locationPrecision: "exact",
  };

  const now = Date.now();
  for (const event of eventsRes.data ?? []) {
    const stillOn = new Date(event.end_time ?? event.start_time).getTime() >= now;
    if (!stillOn) continue;
    items.push({
      ...base,
      kind: "event",
      id: event.id,
      title: event.title,
      description: event.description,
      lat: event.lat!,
      lng: event.lng!,
      locationLabel: event.location_label ?? event.location,
      href: `/c/${communitySlug}/events`,
      startTime: event.start_time,
      endTime: event.end_time,
      locationPrecision: "approximate",
    });
  }

  for (const listing of listingsRes.data ?? []) {
    const href = spaceHref(listing.space_id);
    if (!href) continue;
    items.push({
      ...base,
      kind: "listing",
      id: listing.id,
      title: listing.title,
      description: listing.description,
      imageUrl: listing.photo_url,
      lat: listing.lat!,
      lng: listing.lng!,
      locationLabel: listing.location_label,
      href,
      price: listing.price,
      currency: listing.currency,
    });
  }

  for (const job of jobsRes.data ?? []) {
    const href = spaceHref(job.space_id);
    if (!href) continue;
    items.push({
      ...base,
      kind: "job",
      id: job.id,
      title: job.title,
      description: job.description,
      lat: job.lat!,
      lng: job.lng!,
      locationLabel: job.location_label,
      href,
      meta: job.salary ? `${jobTypeLabel(job.job_type)} · ${job.salary}` : jobTypeLabel(job.job_type),
    });
  }

  for (const stay of staysRes.data ?? []) {
    const href = spaceHref(stay.space_id);
    if (!href) continue;
    items.push({
      ...base,
      kind: "stay",
      id: stay.id,
      title: stay.name,
      description: stay.description,
      imageUrl: stay.photo_url,
      lat: stay.lat!,
      lng: stay.lng!,
      locationLabel: stay.location_label,
      href,
      price: stay.price_per_night,
      currency: stay.currency,
      meta: accommodationTypeLabel(stay.accommodation_type),
    });
  }

  for (const rec of recsRes.data ?? []) {
    const href = spaceHref(rec.space_id);
    if (!href) continue;
    items.push({
      ...base,
      kind: "recommendation",
      id: rec.id,
      title: rec.title,
      description: rec.note,
      lat: rec.lat!,
      lng: rec.lng!,
      locationLabel: rec.location_label,
      href,
      meta: recommendationCategoryLabel(rec.category),
    });
  }

  for (const club of clubsRes.data ?? []) {
    const href = spaceHref(club.space_id);
    if (!href) continue;
    items.push({
      ...base,
      kind: "club",
      id: club.id,
      title: club.name,
      description: club.description,
      lat: club.lat!,
      lng: club.lng!,
      locationLabel: club.location_label,
      href,
      meta: club.category,
    });
  }

  for (const project of volunteerRes.data ?? []) {
    const href = spaceHref(project.space_id);
    if (!href) continue;
    items.push({
      ...base,
      kind: "volunteer",
      id: project.id,
      title: project.title,
      description: project.description,
      lat: project.lat!,
      lng: project.lng!,
      locationLabel: project.location_label,
      href,
      meta: project.volunteers_needed !== null ? `${project.volunteers_needed} volunteers needed` : project.category,
    });
  }

  for (const post of postsRes.data ?? []) {
    const href = spaceHref(post.space_id);
    if (!href) continue;
    items.push({
      ...base,
      kind: "post",
      id: post.id,
      title: post.title,
      description: post.body,
      // media_url can also be a video — only use it as a popup header when
      // it's clearly an image.
      imageUrl: post.media_url && /\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(post.media_url) ? post.media_url : null,
      lat: post.lat!,
      lng: post.lng!,
      locationLabel: post.location_label,
      href: `${href}/posts/${post.id}`,
    });
  }

  return items;
}
