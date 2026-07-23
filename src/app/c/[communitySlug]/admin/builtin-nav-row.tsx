"use client";

import type { DragEventHandler } from "react";
import { GripVertical } from "lucide-react";

// A draggable row for a built-in sidebar link (Events, Search) shown in the
// Spaces manager so admins can order it among the spaces. It carries no
// settings of its own — the feature is toggled on/off elsewhere; here it's
// only a position in the list.
export function BuiltinNavRow({
  label,
  dragHandlers,
  isDragging,
}: {
  label: string;
  dragHandlers: {
    draggable: boolean;
    onDragStart: DragEventHandler;
    onDragOver: DragEventHandler;
    onDrop: DragEventHandler;
    onDragEnd: DragEventHandler;
  };
  isDragging: boolean;
}) {
  return (
    <div className={`rounded-lg border ${isDragging ? "border-accent" : "border-border"} bg-muted/40`} {...dragHandlers}>
      <div className="flex items-center gap-3 p-3">
        <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">Built-in link</p>
        </div>
      </div>
    </div>
  );
}
