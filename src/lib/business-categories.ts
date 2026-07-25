import type { BusinessCategory, BusinessCustomCategory } from "@/types/database";

// A per-space relabelling of a built-in category. Only the fields the label
// resolvers need — BusinessCategoryLabelOverride from the DB satisfies this.
export type CategoryLabelOverride = { category: BusinessCategory; label: string };

export const BUSINESS_CATEGORIES: { value: BusinessCategory; label: string }[] = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Café" },
  { value: "shop", label: "Shop" },
  { value: "accommodation", label: "Accommodation" },
  { value: "service", label: "Service" },
  { value: "health", label: "Health" },
  { value: "fitness", label: "Fitness" },
  { value: "coworking", label: "Coworking" },
  { value: "activity", label: "Activity" },
  { value: "taxi", label: "Taxi" },
  { value: "other", label: "Other" },
];

// Whether a value is one of the built-in categories (vs a custom slug). Used to
// route a rename to the right store: built-ins get a label override, customs
// rename their own row.
const BUILT_IN_CATEGORY_VALUES = new Set(BUSINESS_CATEGORIES.map((c) => c.value));
export function isBuiltInBusinessCategory(value: BusinessCategory): boolean {
  return BUILT_IN_CATEGORY_VALUES.has(value);
}

function overrideLabel(category: BusinessCategory, overrides?: CategoryLabelOverride[]): string | undefined {
  return overrides?.find((o) => o.category === category)?.label;
}

// Built-ins (with any staff relabelling applied) plus the space's custom
// categories, ready for a <select> or filter chips — customs slot in before the
// "Other" catch-all.
export function businessCategoryOptions(
  custom: BusinessCustomCategory[],
  overrides?: CategoryLabelOverride[]
): { value: BusinessCategory; label: string }[] {
  const withOverride = (c: { value: BusinessCategory; label: string }) => ({ value: c.value, label: overrideLabel(c.value, overrides) ?? c.label });
  const builtIn = BUSINESS_CATEGORIES.filter((c) => c.value !== "other").map(withOverride);
  const other = BUSINESS_CATEGORIES.filter((c) => c.value === "other").map(withOverride);
  return [...builtIn, ...custom.map((c) => ({ value: c.slug as BusinessCategory, label: c.label })), ...other];
}

// "boda-boda" → "Boda Boda" — for contexts (map popups) where the space's
// custom categories aren't in scope, so an unknown slug still reads well.
function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function businessCategoryLabel(
  category: BusinessCategory,
  custom?: BusinessCustomCategory[],
  overrides?: CategoryLabelOverride[]
): string {
  return (
    overrideLabel(category, overrides) ??
    custom?.find((c) => c.slug === category)?.label ??
    BUSINESS_CATEGORIES.find((c) => c.value === category)?.label ??
    humanizeSlug(category)
  );
}

// Categories without an entry read the same in the plural (Accommodation,
// Health, Fitness, Coworking, Other — and custom categories, whose labels
// are used as written).
const PLURAL_LABELS: Partial<Record<BusinessCategory, string>> = {
  restaurant: "Restaurants",
  cafe: "Cafés",
  shop: "Shops",
  service: "Services",
  activity: "Activities",
  taxi: "Taxis",
};

// For places the category names a group of listings — nav sub-links,
// headings — rather than labelling a single business. A staff relabelling wins
// over the canonical plural (the override is used verbatim, singular or not).
export function businessCategoryPluralLabel(
  category: BusinessCategory,
  custom?: BusinessCustomCategory[],
  overrides?: CategoryLabelOverride[]
): string {
  return overrideLabel(category, overrides) ?? PLURAL_LABELS[category] ?? businessCategoryLabel(category, custom, overrides);
}

// "Boda Boda" → "boda-boda". Mirrors the slug check constraint in
// supabase/business-custom-categories.sql; returns null when nothing
// slug-worthy survives.
export function slugifyBusinessCategory(label: string): string | null {
  const slug = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return /^[a-z0-9][a-z0-9-]*$/.test(slug) ? slug : null;
}
