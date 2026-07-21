import type { BusinessCategory } from "@/types/database";

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
  { value: "other", label: "Other" },
];

export function businessCategoryLabel(category: BusinessCategory): string {
  return BUSINESS_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

// Categories without an entry read the same in the plural (Accommodation,
// Health, Fitness, Coworking, Other).
const PLURAL_LABELS: Partial<Record<BusinessCategory, string>> = {
  restaurant: "Restaurants",
  cafe: "Cafés",
  shop: "Shops",
  service: "Services",
  activity: "Activities",
};

// For places the category names a group of listings — nav sub-links,
// headings — rather than labelling a single business.
export function businessCategoryPluralLabel(category: BusinessCategory): string {
  return PLURAL_LABELS[category] ?? businessCategoryLabel(category);
}
