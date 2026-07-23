import type { FeatureKey } from "@/types/database";

// The built-in feature links that appear in a community's sidebar and can be
// dragged among the spaces (see the admin Spaces manager). Their labels match
// what the layout renders. The array order is the default order — Events
// before Search — used until an admin reorders them.
export const BUILTIN_NAV_ITEMS: { key: FeatureKey; label: string }[] = [
  { key: "events", label: "Events" },
  { key: "concierge", label: "Search" },
];

// Spaces number their sort_order from 0 upward, so a large base keeps any
// built-in item that hasn't been explicitly placed sorting *after* every
// space — preserving the original Feed → spaces → Events → Search order. The
// array index breaks ties so Events stays before Search by default.
const NAV_ITEM_DEFAULT_SORT_BASE = 100000;

export function defaultNavItemSort(key: FeatureKey): number {
  const idx = BUILTIN_NAV_ITEMS.findIndex((item) => item.key === key);
  return NAV_ITEM_DEFAULT_SORT_BASE + (idx === -1 ? BUILTIN_NAV_ITEMS.length : idx);
}
