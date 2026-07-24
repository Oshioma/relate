"use client";

import { useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";
import { reorderSpaceSubNav } from "./actions";
import type { NavSubItem } from "./spaces-manager";

// The indented, drag-to-reorder list of a space's nav sub-links, shown when its
// row is expanded in the admin nav manager. Order is kept locally and mapped
// back to each item's `ref`, which reorderSpaceSubNav persists per kind (e.g.
// featured categories write their sort_order). Every item in one space shares a
// kind, so the whole list reorders through a single call.
export function SpaceSubNavList({
  spaceId,
  items,
  communitySlug,
}: {
  spaceId: string;
  items: NavSubItem[];
  communitySlug: string;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<NavSubItem[]>(items);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    const reordered = [...order];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setDragIndex(null);
    setOrder(reordered);
    setError(null);
    setBusy(true);
    const result = await reorderSpaceSubNav(
      spaceId,
      reordered[0].kind,
      reordered.map((item) => item.ref),
      communitySlug
    );
    setBusy(false);
    if (result?.error) {
      setError(result.error);
      setOrder(items);
    } else {
      router.refresh();
    }
  }

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">Drag to reorder the sub-links under this space in the nav.</p>
      <div className="space-y-1">
        {order.map((item, i) => (
          <div
            key={item.ref}
            draggable
            // Stop propagation so dragging a sub-link doesn't also start a drag
            // on the parent space row (both are draggable; the event bubbles).
            onDragStart={(e: DragEvent) => {
              e.stopPropagation();
              setDragIndex(i);
            }}
            onDragOver={(e: DragEvent) => e.preventDefault()}
            onDrop={(e: DragEvent) => {
              e.stopPropagation();
              handleDrop(i);
            }}
            onDragEnd={(e: DragEvent) => {
              e.stopPropagation();
              setDragIndex(null);
            }}
            className={`flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm text-foreground ${dragIndex === i ? "border-accent opacity-60" : "border-border"} ${busy ? "pointer-events-none opacity-60" : "cursor-grab"}`}
          >
            <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
