import { Package, Wrench, Home, Car, Briefcase, Gift, Search, Ticket, type LucideIcon } from "lucide-react";
import type { MarketplaceListingType } from "@/types/database";

export const MARKETPLACE_CATEGORIES: { value: MarketplaceListingType; label: string; icon: LucideIcon }[] = [
  { value: "goods", label: "Goods", icon: Package },
  { value: "services", label: "Services", icon: Wrench },
  { value: "property", label: "Property", icon: Home },
  { value: "vehicles", label: "Vehicles", icon: Car },
  { value: "jobs", label: "Jobs", icon: Briefcase },
  { value: "free", label: "Free", icon: Gift },
  { value: "wanted", label: "Wanted", icon: Search },
  { value: "experiences", label: "Experiences", icon: Ticket },
  { value: "tickets", label: "Tickets", icon: Ticket },
];

export function marketplaceCategoryLabel(type: MarketplaceListingType): string {
  return MARKETPLACE_CATEGORIES.find((c) => c.value === type)?.label ?? type;
}
