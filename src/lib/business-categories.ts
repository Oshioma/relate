import type { BusinessCategory, BusinessCustomCategory } from "@/types/database";

// A per-space relabelling of a built-in category. Only the fields the label
// resolvers need — BusinessCategoryLabelOverride from the DB satisfies this.
export type CategoryLabelOverride = { category: BusinessCategory; label: string };

// "accommodation" is intentionally absent: places to stay live in the dedicated
// Accommodation space (space_type = "accommodation"), which is far richer than a
// directory category. Legacy businesses tagged "accommodation" still render
// (businessCategoryLabel humanises the slug) and get a bridge CTA to convert
// into a stay — see business-stay-bridge.tsx.
export const BUSINESS_CATEGORIES: { value: BusinessCategory; label: string }[] = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Café" },
  { value: "shop", label: "Shop" },
  { value: "service", label: "Service" },
  { value: "health", label: "Health" },
  { value: "fitness", label: "Fitness" },
  { value: "coworking", label: "Coworking" },
  { value: "activity", label: "Activity" },
  { value: "taxi", label: "Taxi" },
  { value: "other", label: "Other" },
];

// Leaving "accommodation" out of BUSINESS_CATEGORIES stops it being *picked*,
// but not being *created*: a staff member adding a custom category called
// "Accommodation" slugs straight to "accommodation" and gets the very category
// the list above deliberately omits — a second, much poorer home for stays,
// sitting alongside the Accommodation space in the nav.
//
// So the slug is reserved, along with the names that mean the same thing. This
// is the one place that decides it; addBusinessCategory refuses anything here
// and points at the space instead. ("rental" is absent on purpose — car and
// equipment rentals are ordinary directory businesses.)
export const RESERVED_STAY_SLUGS = new Set([
  "accommodation",
  "accomodation",
  "accommodations",
  "hotel",
  "hotels",
  "hostel",
  "hostels",
  "guesthouse",
  "guesthouses",
  "lodging",
  "stays",
  "places-to-stay",
  "where-to-stay",
]);

export function isReservedStaySlug(slug: string): boolean {
  return RESERVED_STAY_SLUGS.has(slug);
}

// Which categories are offered the Business Directory → Accommodation bridge
// ("Is this a place to stay?") when we haven't detected a stay ourselves.
//
// The bridge used to be offered on every listing its manager opened, so a fundi,
// a taxi driver and a hardware shop were all asked whether they were a hotel —
// noise on the listings it can never apply to. Restaurant is the one built-in
// category a guesthouse genuinely gets filed under (a place with rooms above the
// dining room lists the part it thinks of as the business), so it's the only one
// worth the prompt. Anything already tagged "accommodation" is detected, not
// offered, and reaches the bridge regardless of this set.
const STAY_OFFER_CATEGORIES = new Set<string>(["restaurant"]);

export function offersStayBridge(category: string): boolean {
  return STAY_OFFER_CATEGORIES.has(category);
}

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
