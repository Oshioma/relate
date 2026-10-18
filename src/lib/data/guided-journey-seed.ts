import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getPreset } from "@/lib/guided-journey/presets";

type Client = SupabaseClient<Database>;

// A new guided-journey space starts from a preset: its settings row (preset
// key, no overrides yet) and the preset's starter journey templates. Called by
// createSpace when the type is guided_journey, as the community admin — RLS
// allows both inserts for admins.
export async function seedGuidedJourneySpace(supabase: Client, spaceId: string, presetKey: string | null) {
  const preset = getPreset(presetKey);
  const { error } = await supabase
    .from("guided_journey_spaces")
    .upsert({ space_id: spaceId, preset_key: preset.key, config: {} }, { onConflict: "space_id" });
  if (error) return { error: error.message };

  if (preset.templates.length > 0) {
    const { error: templateError } = await supabase.from("journey_templates").insert(
      preset.templates.map((t, i) => ({
        space_id: spaceId,
        title: t.title,
        subject: t.subject,
        summary: t.summary,
        cover_image_url: t.coverImageUrl,
        duration_label: t.durationLabel,
        expected_weeks: t.expectedWeeks,
        milestones: t.milestones,
        sort_order: i,
      }))
    );
    if (templateError) return { error: templateError.message };
  }
  return { error: null };
}

// Copy one guided-journey space's settings and templates onto another space
// (in the same community or a different one the caller administers). Members,
// journeys and stories are never copied — only the reusable configuration.
export async function copyGuidedJourneySpace(supabase: Client, fromSpaceId: string, toSpaceId: string, presetKey?: string | null) {
  const [{ data: settings }, { data: templates }] = await Promise.all([
    supabase.from("guided_journey_spaces").select("*").eq("space_id", fromSpaceId).maybeSingle(),
    supabase.from("journey_templates").select("*").eq("space_id", fromSpaceId).order("sort_order", { ascending: true }),
  ]);

  // Switching preset (gardening → sailing) means the old wording no longer
  // applies: start from the new preset's words and starter templates instead.
  if (presetKey && presetKey !== settings?.preset_key) {
    return seedGuidedJourneySpace(supabase, toSpaceId, presetKey);
  }

  const { error } = await supabase.from("guided_journey_spaces").upsert(
    {
      space_id: toSpaceId,
      preset_key: settings?.preset_key ?? "gardening",
      config: settings?.config ?? {},
      accepting_mentors: settings?.accepting_mentors ?? true,
      accepting_beginners: settings?.accepting_beginners ?? true,
    },
    { onConflict: "space_id" }
  );
  if (error) return { error: error.message };

  if (templates && templates.length > 0) {
    const { error: templateError } = await supabase.from("journey_templates").insert(
      templates.map((t) => ({
        space_id: toSpaceId,
        title: t.title,
        subject: t.subject,
        summary: t.summary,
        cover_image_url: t.cover_image_url,
        duration_label: t.duration_label,
        expected_weeks: t.expected_weeks,
        milestones: t.milestones,
        is_active: t.is_active,
        sort_order: t.sort_order,
      }))
    );
    if (templateError) return { error: templateError.message };
  }
  return { error: null };
}
