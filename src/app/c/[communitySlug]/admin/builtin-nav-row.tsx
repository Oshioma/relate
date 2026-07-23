"use client";

import { useState, type DragEventHandler } from "react";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";
import { setNavItemVisibility } from "./actions";
import type { FeatureKey } from "@/types/database";

// A draggable row for a built-in sidebar link (Events, Search) shown in the
// Spaces manager so admins can order it among the spaces and choose whether it
// appears in the nav — mirroring a space's "Show in navigation" toggle. The
// feature itself (whether the link exists at all) is turned on/off in the
// Features section; here we only control its position and visibility.
export function BuiltinNavRow({
  itemKey,
  label,
  showInNav,
  communityId,
  communitySlug,
  dragHandlers,
  isDragging,
}: {
  itemKey: FeatureKey;
  label: string;
  showInNav: boolean;
  communityId: string;
  communitySlug: string;
  dragHandlers: {
    draggable: boolean;
    onDragStart: DragEventHandler;
    onDragOver: DragEventHandler;
    onDrop: DragEventHandler;
    onDragEnd: DragEventHandler;
  };
  isDragging: boolean;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(showInNav);
  const [saving, setSaving] = useState(false);

  async function toggle(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.checked;
    setChecked(next);
    setSaving(true);
    const result = await setNavItemVisibility(itemKey, next, communityId, communitySlug);
    setSaving(false);
    if (result?.error) {
      setChecked(!next); // revert optimistic flip
      return;
    }
    router.refresh();
  }

  return (
    <div className={`rounded-lg border ${isDragging ? "border-accent" : "border-border"} bg-muted/40`} {...dragHandlers}>
      <div className="flex items-center gap-3 p-3">
        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">Built-in link</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={checked}
            disabled={saving}
            onChange={toggle}
            className="h-4 w-4 rounded border-border disabled:opacity-50"
          />
          Show in navigation
        </label>
      </div>
    </div>
  );
}
