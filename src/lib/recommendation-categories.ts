import type { RecommendationCategory } from "@/types/database";

export const RECOMMENDATION_CATEGORIES: { value: RecommendationCategory; label: string }[] = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Café" },
  { value: "activity", label: "Activity" },
  { value: "service", label: "Service" },
  { value: "professional", label: "Professional" },
  { value: "walk", label: "Walk" },
  { value: "viewpoint", label: "Viewpoint" },
  { value: "contractor", label: "Contractor" },
  { value: "other", label: "Other" },
];

export function recommendationCategoryLabel(category: RecommendationCategory): string {
  return RECOMMENDATION_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}
