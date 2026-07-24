import type { SpaceType, FeatureKey } from "@/types/database";
import { getCommunityTemplate } from "@/lib/community-templates";
import { BUILTIN_NAV_ITEMS } from "@/lib/nav-items";

// One default item for a community type: normally a space (space_type set,
// builtin_key null), or one of the built-in nav features (builtin_key set) so
// Events and Search appear in the list and can be ordered like any space.
export interface TemplateDefaultItem {
  name: string;
  description: string;
  space_type: SpaceType; // ignored when builtin_key is set
  builtin_key: FeatureKey | null;
  show_in_nav: boolean;
}

// Which built-in features are offered for a template. Events everywhere;
// Search/Concierge only on the place template.
export function builtinsForTemplate(templateKey: string): FeatureKey[] {
  return templateKey === "place" ? ["events", "concierge"] : ["events"];
}

function builtinDescription(key: FeatureKey): string {
  return key === "events" ? "Community-wide events calendar in the sidebar." : "AI-assisted concierge search in the sidebar.";
}

// The hard-coded fallback list for a template — its template spaces followed by
// the built-in features it offers. Used until a super admin materialises the
// template into template_default_spaces, so the wizard keeps producing today's
// communities unchanged.
export function codeTemplateDefaults(templateKey: string): TemplateDefaultItem[] {
  const template = getCommunityTemplate(templateKey) ?? getCommunityTemplate("custom")!;
  const spaces: TemplateDefaultItem[] = template.defaultSpaces.map((s) => ({
    name: s.name,
    description: s.description,
    space_type: s.space_type ?? "discussion",
    builtin_key: null,
    show_in_nav: true,
  }));
  const builtins: TemplateDefaultItem[] = builtinsForTemplate(templateKey).map((key) => ({
    name: BUILTIN_NAV_ITEMS.find((b) => b.key === key)?.label ?? key,
    description: builtinDescription(key),
    space_type: "discussion",
    builtin_key: key,
    show_in_nav: true,
  }));
  return [...spaces, ...builtins];
}
