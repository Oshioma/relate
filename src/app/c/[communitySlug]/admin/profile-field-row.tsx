"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { deleteProfileField, moveProfileField } from "./profile-fields-actions";
import { Badge } from "@/components/ui/badge";
import type { CommunityProfileField } from "@/types/database";

export function ProfileFieldRow({
  field,
  communitySlug,
  isFirst,
  isLast,
}: {
  field: CommunityProfileField;
  communitySlug: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function move(direction: "up" | "down") {
    setError(null);
    startTransition(async () => {
      const result = await moveProfileField(field.id, direction, communitySlug);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  function remove() {
    if (!window.confirm(`Remove the "${field.label}" field? Any answers members have given will be deleted too.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteProfileField(field.id, communitySlug);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="px-5 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{field.label}</p>
            <Badge tone="neutral">{field.field_type}</Badge>
            {field.is_required && <Badge tone="accent">Required</Badge>}
          </div>
          {field.options.length > 0 && (
            <p className="mt-1 truncate text-xs text-muted-foreground">{field.options.join(", ")}</p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Move up"
            disabled={isPending || isFirst}
            onClick={() => move("up")}
            className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Move down"
            disabled={isPending || isLast}
            onClick={() => move("down")}
            className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Remove field"
            disabled={isPending}
            onClick={remove}
            className="rounded p-1 text-muted-foreground hover:text-danger disabled:opacity-30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
