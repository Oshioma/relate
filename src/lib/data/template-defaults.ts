import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, FeatureKey, SpaceType } from "@/types/database";
import type { TemplateSpace } from "@/lib/community-templates";
import { COMMUNITY_TEMPLATES } from "@/lib/community-templates";
import { codeTemplateDefaults, type TemplateDefaultItem } from "@/lib/template-defaults";

type Client = SupabaseClient<Database>;

// Effective default items for every community type: the DB rows where a type
// has been edited (materialised), otherwise the code fallback. Keyed by
// template key — used by the /platform-admin control panel and the wizard.
export async function getTemplateDefaultsByTemplate(supabase: Client): Promise<Record<string, TemplateDefaultItem[]>> {
  const { data, error } = await supabase
    .from("template_default_spaces")
    .select("template_key, name, description, space_type, builtin_key, show_in_nav, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;

  const byTemplate: Record<string, TemplateDefaultItem[]> = {};
  for (const row of data ?? []) {
    (byTemplate[row.template_key] ??= []).push({
      name: row.name,
      description: row.description,
      space_type: (row.space_type as SpaceType) ?? "discussion",
      builtin_key: (row.builtin_key as FeatureKey | null) ?? null,
      show_in_nav: row.show_in_nav,
    });
  }

  const result: Record<string, TemplateDefaultItem[]> = {};
  for (const t of COMMUNITY_TEMPLATES) {
    result[t.key] = byTemplate[t.key]?.length ? byTemplate[t.key] : codeTemplateDefaults(t.key);
  }
  return result;
}

// Just the spaces (not the built-in feature rows) a new community of each
// template starts with, in order — what the creation wizard seeds. Built-in
// features stay handled by the runtime feature system, so the wizard's output
// is unchanged.
export async function getDefaultSpacesByTemplate(supabase: Client): Promise<Record<string, TemplateSpace[]>> {
  const byTemplate = await getTemplateDefaultsByTemplate(supabase);
  const result: Record<string, TemplateSpace[]> = {};
  for (const [key, items] of Object.entries(byTemplate)) {
    result[key] = items
      .filter((it) => it.builtin_key === null)
      .map((it) => ({ name: it.name, description: it.description, space_type: it.space_type }));
  }
  return result;
}
