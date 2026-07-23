"use client";

import { useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { SpaceCard } from "./space-card";
import { BuiltinNavRow } from "./builtin-nav-row";
import { reorderNavItems } from "./actions";
import type { Space, SpaceJournalField, FeatureKey } from "@/types/database";

// One draggable sidebar row: either a real space, or a built-in feature link
// (Events, Search). Both live in the same ordered list so an admin can place
// the built-in links anywhere among the spaces. `key` is a stable React/DnD
// key; `sort` is only used to pre-sort the incoming list.
export type NavManagerItem =
  | { kind: "space"; key: string; sort: number; space: Space }
  | { kind: "builtin"; key: string; sort: number; itemKey: FeatureKey; label: string };

export function SpacesManager({
  items,
  communityId,
  communitySlug,
  journalFieldsBySpaceId,
}: {
  items: NavManagerItem[];
  communityId: string;
  communitySlug: string;
  journalFieldsBySpaceId: Record<string, SpaceJournalField[]>;
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
            isDragging={dragIndex === i}
            dragHandlers={dragHandlers}
          />
        ) : (
          <BuiltinNavRow key={item.key} label={item.label} isDragging={dragIndex === i} dragHandlers={dragHandlers} />
        );
      })}
    </div>
  );
}
