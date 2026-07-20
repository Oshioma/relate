"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SpaceCard } from "./space-card";
import { reorderSpaces } from "./actions";
import type { Space } from "@/types/database";

export function SpacesManager({ spaces, communitySlug }: { spaces: Space[]; communitySlug: string }) {
  const router = useRouter();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  async function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    const reordered = [...spaces];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setDragIndex(null);
    await reorderSpaces(
      reordered.map((s, i) => ({ id: s.id, sort_order: i })),
      communitySlug
    );
    router.refresh();
  }

  return (
    <div className="space-y-2">
      {spaces.map((space, i) => (
        <SpaceCard
          key={space.id}
          space={space}
          communitySlug={communitySlug}
          isDragging={dragIndex === i}
          dragHandlers={{
            draggable: true,
            onDragStart: () => setDragIndex(i),
            onDragOver: (e) => e.preventDefault(),
            onDrop: () => handleDrop(i),
            onDragEnd: () => setDragIndex(null),
          }}
        />
      ))}
    </div>
  );
}
