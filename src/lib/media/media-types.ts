// Shared vocabulary for Books & Media spaces (space_type = 'books_media').
//
// Pure data and pure functions only — no server-only imports — so the space
// view, the add form and the server actions can all read the same lists. The
// database constrains the same values (see the space_media_items migration),
// so the two must be kept in step: adding a kind here is also a migration.

import { z } from "zod";
import type { MediaConcern, MediaKind, MediaProfanity, MediaVerdict, SpaceMediaItem } from "@/types/database";

export const MEDIA_KINDS: { value: MediaKind; label: string; plural: string }[] = [
  { value: "book", label: "Book", plural: "Books" },
  { value: "video", label: "Video or show", plural: "Videos & shows" },
  { value: "audio", label: "Podcast or audiobook", plural: "Podcasts & audio" },
  { value: "game", label: "Game", plural: "Games" },
  { value: "app", label: "App", plural: "Apps" },
  { value: "website", label: "Website", plural: "Websites" },
  { value: "other", label: "Other", plural: "Other" },
];

export const MEDIA_KIND_KEYS = MEDIA_KINDS.map((k) => k.value);

export function isMediaKind(value: string): value is MediaKind {
  return (MEDIA_KIND_KEYS as string[]).includes(value);
}

export function mediaKindLabel(kind: string): string {
  return MEDIA_KINDS.find((k) => k.value === kind)?.label ?? "Other";
}

export const MEDIA_VERDICTS: { value: MediaVerdict; label: string; description: string }[] = [
  { value: "suitable", label: "Good for kids", description: "Nothing a parent needs to worry about for the suggested ages." },
  { value: "caution", label: "Good, with a note", description: "Fine for the suggested ages, but there's something worth knowing first." },
  { value: "not_suitable", label: "Not suitable", description: "We wouldn't give this to children, and here's why." },
];

export const MEDIA_VERDICT_KEYS = MEDIA_VERDICTS.map((v) => v.value);

export function isMediaVerdict(value: string): value is MediaVerdict {
  return (MEDIA_VERDICT_KEYS as string[]).includes(value);
}

export function mediaVerdictLabel(verdict: string): string {
  return MEDIA_VERDICTS.find((v) => v.value === verdict)?.label ?? verdict;
}

export const PROFANITY_LEVELS: { value: MediaProfanity; label: string }[] = [
  { value: "none", label: "No bad language" },
  { value: "mild", label: "Mild language" },
  { value: "moderate", label: "Some strong language" },
  { value: "strong", label: "Frequent strong language" },
  { value: "unknown", label: "Language not checked" },
];

export function isProfanityLevel(value: string): value is MediaProfanity {
  return PROFANITY_LEVELS.some((p) => p.value === value);
}

export function profanityLabel(level: string): string {
  return PROFANITY_LEVELS.find((p) => p.value === level)?.label ?? "Language not checked";
}

// The things a parent asks about, in the order they ask. The model files its
// findings under these; anything else goes under "other" with its own note.
export const CONCERN_CATEGORIES: { key: string; label: string }[] = [
  { key: "violence", label: "Violence" },
  { key: "scary", label: "Scary or upsetting content" },
  { key: "sexual_content", label: "Sexual content or nudity" },
  { key: "romance", label: "Romance" },
  { key: "substances", label: "Drinking, drugs or smoking" },
  { key: "mature_themes", label: "Mature themes" },
  { key: "ideology", label: "Religious, political or ideological content" },
  { key: "consumerism", label: "Adverts or consumerism" },
  { key: "online_safety", label: "Online safety" },
  { key: "other", label: "Other" },
];

export function concernLabel(category: string): string {
  return CONCERN_CATEGORIES.find((c) => c.key === category)?.label ?? category;
}

export const CONCERN_LEVELS = ["none", "mild", "moderate", "strong"] as const;

export const MediaConcernSchema = z.object({
  category: z.string().min(1).max(40),
  level: z.enum(CONCERN_LEVELS),
  note: z.string().max(400),
});

// What the add/edit form sends. Every field the model can fill is editable by
// the person adding it — the model suggests, the parent decides.
export const MediaItemInputSchema = z.object({
  url: z.string().min(1).max(2000),
  kind: z.enum(MEDIA_KIND_KEYS as [MediaKind, ...MediaKind[]]),
  title: z.string().trim().min(1, "Give it a title.").max(200),
  creator: z.string().trim().max(200).nullable(),
  description: z.string().trim().max(2000),
  image_url: z.string().trim().max(1000).nullable(),
  age_min: z.number().int().min(0).max(21).nullable(),
  age_max: z.number().int().min(0).max(21).nullable(),
  verdict: z.enum(MEDIA_VERDICT_KEYS as [MediaVerdict, ...MediaVerdict[]]),
  reason: z.string().trim().max(1000).nullable(),
  profanity: z.enum(PROFANITY_LEVELS.map((p) => p.value) as [MediaProfanity, ...MediaProfanity[]]),
  concerns: z.array(MediaConcernSchema).max(20),
  themes: z.array(z.string().trim().min(1).max(60)).max(20),
  share_with_other_communities: z.boolean(),
});

export type MediaItemInput = z.infer<typeof MediaItemInputSchema>;

// Ages 6–9, 10+, Under 5, or nothing at all.
export function ageRangeLabel(min: number | null | undefined, max: number | null | undefined): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null) return min === max ? `Age ${min}` : `Ages ${min}–${max}`;
  if (min != null) return `Ages ${min}+`;
  return `Under ${max! + 1}`;
}

// Only the concerns that actually say something: "none" is the model
// confirming it looked, which the card has no reason to repeat.
export function notableConcerns(concerns: MediaConcern[] | null | undefined): MediaConcern[] {
  return (concerns ?? []).filter((c) => c.level !== "none");
}

// A shelf item plus who added it, as the cards render it.
export type MediaItemRow = SpaceMediaItem & {
  creatorProfile: { full_name: string | null; username: string | null; avatar_url: string | null } | null;
};

// A row from another community's shelf, as
// shared_media_items_from_other_communities() returns it. Name and slug are
// null for an invite-only community, which is unlisted.
export type SharedMediaItem = {
  id: string;
  community_id: string;
  community_name: string | null;
  community_slug: string | null;
  url: string;
  kind: MediaKind;
  title: string;
  creator: string | null;
  description: string;
  image_url: string | null;
  age_min: number | null;
  age_max: number | null;
  verdict: MediaVerdict;
  reason: string | null;
  profanity: MediaProfanity;
  concerns: MediaConcern[];
  themes: string[];
  created_at: string;
};

export function mediaSearchText(item: { title: string; creator: string | null; description: string; themes: string[]; reason: string | null }): string {
  return [item.title, item.creator ?? "", item.description, item.themes.join(" "), item.reason ?? ""].join(" ").toLowerCase();
}
