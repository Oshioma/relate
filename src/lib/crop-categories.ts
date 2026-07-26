// Crop Guides categories. Kept as a plain list (crops.category is free text in
// the DB) so the architecture scales to unlimited future categories without a
// migration — this file just gives the built-in set a label, icon and order for
// the filter bar. Slugs here are what gets stored in crops.category.

import {
  Carrot,
  Apple,
  Leaf,
  Flower2,
  TreeDeciduous,
  Stethoscope,
  Vegan,
  Bean,
  Wheat,
  Sprout,
  Palmtree,
  Mountain,
  type LucideIcon,
} from "lucide-react";

export interface CropCategoryMeta {
  slug: string;
  label: string;
  icon: LucideIcon;
}

// Display order for the category filter chips.
export const CROP_CATEGORIES: CropCategoryMeta[] = [
  { slug: "vegetables", label: "Vegetables", icon: Carrot },
  { slug: "fruit", label: "Fruit", icon: Apple },
  { slug: "herbs", label: "Herbs", icon: Leaf },
  { slug: "flowers", label: "Flowers", icon: Flower2 },
  { slug: "trees", label: "Trees", icon: TreeDeciduous },
  { slug: "medicinal", label: "Medicinal Plants", icon: Stethoscope },
  { slug: "mushrooms", label: "Mushrooms", icon: Vegan },
  { slug: "legumes", label: "Legumes", icon: Bean },
  { slug: "grains", label: "Grains", icon: Wheat },
  { slug: "cover_crops", label: "Cover Crops", icon: Sprout },
  { slug: "tropical", label: "Tropical Crops", icon: Palmtree },
  { slug: "native", label: "Native Plants", icon: Mountain },
];

const BY_SLUG = new Map(CROP_CATEGORIES.map((c) => [c.slug, c]));

export function cropCategoryLabel(slug: string): string {
  return BY_SLUG.get(slug)?.label ?? titleCase(slug);
}

export function cropCategoryIcon(slug: string): LucideIcon | null {
  return BY_SLUG.get(slug)?.icon ?? null;
}

function titleCase(slug: string): string {
  return slug
    .split(/[_\s-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
