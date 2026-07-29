"use client";

import { useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { SpaceCard } from "./space-card";
import { BuiltinNavRow } from "./builtin-nav-row";
import { reorderNavItems } from "./actions";
import type { Space, SpaceJournalField, FeatureKey, SpaceType } from "@/types/database";

// A space's nav sub-links — the indented items that render under it in the
// sidebar. Today the only source is a business directory's featured categories
// (kind "featured_category", `ref` = the category value), but the shape is
// deliberately generic: a new space type that grows sub-links just contributes
// its own kind here and a matching branch in reorderSpaceSubNav (admin actions),
// and the manager renders and reorders it with no further changes.
export type NavSubItemKind = "featured_category";
export type NavSubItem = { kind: NavSubItemKind; ref: string; label: string };

// One draggable sidebar row: either a real space, or a built-in feature link
// (Events, Search). Both live in the same ordered list so an admin can place
// the built-in links anywhere among the spaces. `key` is a stable React/DnD
// key; `sort` is only used to pre-sort the incoming list. A space carries its
// nav sub-links so they can be expanded and reordered inline under its row.
export type NavManagerItem =
  | { kind: "space"; key: string; sort: number; space: Space; subItems: NavSubItem[] }
  | { kind: "builtin"; key: string; sort: number; itemKey: FeatureKey; label: string; showInNav: boolean };

export function SpacesManager({
  items,
  communityId,
  communitySlug,
  journalFieldsBySpaceId,
  allowedTypes,
  paymentsEnabled,
}: {
  items: NavManagerItem[];
  communityId: string;
  communitySlug: string;
  journalFieldsBySpaceId: Record<string, SpaceJournalField[]>;
  // Space types the super admin permits for this community — the choices in a
  // space's Type dropdown.
  allowedTypes: SpaceType[];
  // Whether the community's Stripe account can take charges — gates the
  // per-space price control in the editor.
  paymentsEnabled: boolean;
}) {
  const router = useRouter();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  async function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    const reordered = [...items];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setDragIndex(null);
    await reorderNavItems(
      reordered.map((item, i) =>
        item.kind === "space"
          ? { kind: "space" as const, ref: item.space.id, sort_order: i }
          : { kind: "builtin" as const, ref: item.itemKey, sort_order: i }
      ),
      communityId,
      communitySlug
    );
    router.refresh();
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const dragHandlers = {
          draggable: true,
          onDragStart: () => setDragIndex(i),
          onDragOver: (e: DragEvent) => e.preventDefault(),
          onDrop: () => handleDrop(i),
          onDragEnd: () => setDragIndex(null),
        };
        return item.kind === "space" ? (
          <SpaceCard
            key={item.key}
            space={item.space}
            communitySlug={communitySlug}
            journalFields={journalFieldsBySpaceId[item.space.id] ?? []}
            subItems={item.subItems}
            allowedTypes={allowedTypes}
            paymentsEnabled={paymentsEnabled}
            isDragging={dragIndex === i}
            dragHandlers={dragHandlers}
          />
        ) : (
          <BuiltinNavRow
            key={item.key}
            itemKey={item.itemKey}
            label={item.label}
            showInNav={item.showInNav}
            communityId={communityId}
            communitySlug={communitySlug}
            isDragging={dragIndex === i}
            dragHandlers={dragHandlers}
          />
        );
      })}
    </div>
  );
}
