import {
  UtensilsCrossed,
  Coffee,
  ShoppingBag,
  BedDouble,
  Wrench,
  Stethoscope,
  Dumbbell,
  Laptop,
  Compass,
  Car,
  Store,
  type LucideIcon,
} from "lucide-react";
import type { BusinessCategory } from "@/types/database";

// A distinct icon per built-in category so a directory card reads as its *kind*
// of listing at a glance — a taxi shouldn't look like a restaurant. Custom
// categories and the "other" catch-all fall back to DEFAULT_CATEGORY_ICON.
export const BUSINESS_CATEGORY_ICONS: Partial<Record<BusinessCategory, LucideIcon>> = {
  restaurant: UtensilsCrossed,
  cafe: Coffee,
  shop: ShoppingBag,
  accommodation: BedDouble,
  service: Wrench,
  health: Stethoscope,
  fitness: Dumbbell,
  coworking: Laptop,
  activity: Compass,
  taxi: Car,
};

export const DEFAULT_CATEGORY_ICON: LucideIcon = Store;
