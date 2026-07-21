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
  { value: "other", label: "Other" },
];

export function businessCategoryLabel(category: BusinessCategory): string {
  return BUSINESS_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}
