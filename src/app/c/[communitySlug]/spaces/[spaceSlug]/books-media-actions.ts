"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { authorizeMediaMember } from "@/lib/media/media-auth";
import { getMediaItem, getSharedMediaItemsFromOtherCommunities, cleanConcerns } from "@/lib/data/media-items";
import { MediaItemInputSchema, type MediaItemInput, type SharedMediaItem } from "@/lib/media/media-types";
import { lessonLinkKey } from "@/lib/school/lesson-link-key";
import { normaliseUrl } from "@/lib/ai/read-url";

// Writing to a Books & Media shelf. Reviewing a link is a route handler (see
// src/app/api/media/analyse) because it can take a minute; everything that
// touches the database is an ordinary action here.
//
// Each one re-checks that the caller may write in this space rather than
// trusting the UI, and RLS refuses the write regardless.

export type MediaActionState = { error: string } | { ok: true; id: string } | undefined;

function str(fd: FormData, name: string): string {
  return String(fd.get(name) ?? "").trim();
}

function optional(fd: FormData, name: string): string | null {
  const value = str(fd, name);
  return value ? value : null;
}

function age(fd: FormData, name: string): number | null {
  const value = str(fd, name);
  if (!value) return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
}

function json(fd: FormData, name: string): unknown {
  const raw = str(fd, name);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// The form's fields, validated into the stored shape. Returns a sentence a
// person can act on rather than Zod's own wording.
function parseInput(fd: FormData): { ok: true; input: MediaItemInput } | { ok: false; error: string } {
  const themes = str(fd, "themes")
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
  const concerns = cleanConcerns(json(fd, "concerns"));
  const candidate = {
    url: str(fd, "url"),
    kind: str(fd, "kind") || "other",
    title: str(fd, "title"),
    creator: optional(fd, "creator"),
    description: str(fd, "description"),
    image_url: optional(fd, "image_url"),
    age_min: age(fd, "age_min"),
    age_max: age(fd, "age_max"),
    verdict: str(fd, "verdict") || "suitable",
    reason: optional(fd, "reason"),
    profanity: str(fd, "profanity") || "unknown",
    concerns,
    themes,
    share_with_other_communities: fd.get("share_with_other_communities") === "1",
  };
  const parsed = MediaItemInputSchema.safeParse(candidate);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = String(issue?.path?.[0] ?? "");
    if (field === "title") return { ok: false, error: "Give it a title." };
    if (field === "age_min" || field === "age_max") return { ok: false, error: "Ages are whole years between 0 and 21." };
    return { ok: false, error: `Check the ${field || "form"} and try again.` };
  }
  const input = parsed.data;
  if (input.age_min != null && input.age_max != null && input.age_min > input.age_max) {
    return { ok: false, error: "The youngest age can't be above the oldest." };
  }
  if (input.verdict !== "suitable" && !input.reason) {
    return { ok: false, error: input.verdict === "not_suitable" ? "Say why it isn't suitable — that's the useful part." : "Say what a parent should know first." };
  }
  if (input.image_url && !/^https?:\/\//i.test(input.image_url)) input.image_url = null;
  return { ok: true, input };
}

// What the model said, kept with the row for the "why" panel and the audit
// trail. Token counts are what it cost, for the platform's usage report.
function aiFields(fd: FormData) {
  const analysis = json(fd, "ai_analysis");
  const model = optional(fd, "ai_model");
  const input = Number(str(fd, "ai_input_tokens"));
  const output = Number(str(fd, "ai_output_tokens"));
  return {
    ai_analysis: analysis && typeof analysis === "object" ? analysis : null,
    ai_model: model,
    ai_input_tokens: Number.isInteger(input) && input > 0 ? input : null,
    ai_output_tokens: Number.isInteger(output) && output > 0 ? output : null,
  };
}

export async function createMediaItem(_prev: MediaActionState, formData: FormData): Promise<MediaActionState> {
  const spaceId = str(formData, "space_id");
  const communitySlug = str(formData, "community_slug");
  const spaceSlug = str(formData, "space_slug");

  const parsed = parseInput(formData);
  if (!parsed.ok) return { error: parsed.error };
  const url = normaliseUrl(parsed.input.url);
  const linkKey = url ? lessonLinkKey(url) : null;
  if (!url || !linkKey) return { error: "That doesn't look like a web address." };

  const supabase = await createClient();
  const auth = await authorizeMediaMember(supabase, spaceId);
  if (!auth.ok) return { error: auth.error };

  const { data, error } = await supabase
    .from("space_media_items")
    .insert({
      space_id: auth.space.id,
      community_id: auth.space.community_id,
      created_by: auth.userId,
      ...parsed.input,
      url,
      link_key: linkKey,
      ...aiFields(formData),
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { error: "That link is already on this shelf." };
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { ok: true, id: data.id };
}

export async function updateMediaItem(_prev: MediaActionState, formData: FormData): Promise<MediaActionState> {
  const itemId = str(formData, "item_id");
  const communitySlug = str(formData, "community_slug");
  const spaceSlug = str(formData, "space_slug");

  const parsed = parseInput(formData);
  if (!parsed.ok) return { error: parsed.error };
  const url = normaliseUrl(parsed.input.url);
  const linkKey = url ? lessonLinkKey(url) : null;
  if (!url || !linkKey) return { error: "That doesn't look like a web address." };

  const supabase = await createClient();
  const item = await getMediaItem(supabase, itemId);
  if (!item) return { error: "Item not found." };

  const auth = await authorizeMediaMember(supabase, item.space_id);
  if (!auth.ok) return { error: auth.error };
  if (item.created_by !== auth.userId && !auth.isStaff) {
    return { error: "Only whoever added this, or community staff, can change it." };
  }

  const { error } = await supabase
    .from("space_media_items")
    .update({ ...parsed.input, url, link_key: linkKey })
    .eq("id", itemId);

  if (error) {
    if (error.code === "23505") return { error: "Another item on this shelf already has that link." };
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { ok: true, id: itemId };
}

export async function deleteMediaItem(itemId: string, communitySlug: string, spaceSlug: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const item = await getMediaItem(supabase, itemId);
  if (!item) return { error: "Item not found." };

  const auth = await authorizeMediaMember(supabase, item.space_id);
  if (!auth.ok) return { error: auth.error };
  if (item.created_by !== auth.userId && !auth.isStaff) {
    return { error: "Only whoever added this, or community staff, can remove it." };
  }

  const { error } = await supabase.from("space_media_items").delete().eq("id", itemId);
  if (error) return { error: error.message };

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}

// What the "Bring in media from other communities" button fetches. Nothing
// is copied: the caller is shown other shelves and chooses item by item.
export async function loadSharedMediaItems(communityId: string): Promise<{ items: SharedMediaItem[]; error: string | null }> {
  const supabase = await createClient();
  try {
    const items = await getSharedMediaItemsFromOtherCommunities(supabase, communityId);
    return { items, error: null };
  } catch (error) {
    console.error("Could not load shared media items", error);
    return { items: [], error: "Couldn't reach other communities' shelves just now." };
  }
}

// Copies one shared review onto this shelf, as the caller's own row. The copy
// is theirs from then on — editable, deletable, and shared onward or not as
// they choose — with imported_from recording where it came from.
export async function importSharedMediaItem(
  sharedItemId: string,
  spaceId: string,
  communitySlug: string,
  spaceSlug: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const auth = await authorizeMediaMember(supabase, spaceId);
  if (!auth.ok) return { error: auth.error };

  // Read it back through the same function the list came from, so what is
  // copied is exactly what was offered — never a row the function would not
  // have shown.
  const shared = (await getSharedMediaItemsFromOtherCommunities(supabase, auth.space.community_id)).find((s) => s.id === sharedItemId);
  if (!shared) return { error: "That item isn't available any more." };

  const linkKey = lessonLinkKey(shared.url);
  if (!linkKey) return { error: "That item's link couldn't be read." };

  const { error } = await supabase.from("space_media_items").insert({
    space_id: auth.space.id,
    community_id: auth.space.community_id,
    created_by: auth.userId,
    url: shared.url,
    link_key: linkKey,
    kind: shared.kind,
    title: shared.title,
    creator: shared.creator,
    description: shared.description,
    image_url: shared.image_url,
    age_min: shared.age_min,
    age_max: shared.age_max,
    verdict: shared.verdict,
    reason: shared.reason,
    profanity: shared.profanity,
    concerns: shared.concerns,
    themes: shared.themes,
    share_with_other_communities: true,
    imported_from: shared.id,
  });

  if (error) {
    if (error.code === "23505") return { error: "That one is already on your shelf." };
    return { error: error.message };
  }

  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`);
  return { error: null };
}
