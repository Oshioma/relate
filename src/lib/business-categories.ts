import type { BusinessCategory, BusinessCustomCategory } from "@/types/database";

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

// Built-ins plus the space's custom categories, ready for a <select> or
// filter chips — customs slot in before the "Other" catch-all.
export function businessCategoryOptions(custom: BusinessCustomCategory[]): { value: BusinessCategory; label: string }[] {
  const builtIn = BUSINESS_CATEGORIES.filter((c) => c.value !== "other");
  const other = BUSINESS_CATEGORIES.filter((c) => c.value === "other");
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

export function businessCategoryLabel(category: BusinessCategory, custom?: BusinessCustomCategory[]): string {
  return (
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
// headings — rather than labelling a single business.
export function businessCategoryPluralLabel(category: BusinessCategory, custom?: BusinessCustomCategory[]): string {
  return PLURAL_LABELS[category] ?? businessCategoryLabel(category, custom);
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
