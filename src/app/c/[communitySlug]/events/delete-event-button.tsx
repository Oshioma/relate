"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { deleteEvent } from "./actions";

export function DeleteEventButton({
  eventId,
  eventTitle,
  communityId,
  communitySlug,
  className,
}: {
  eventId: string;
  eventTitle: string;
  communityId: string;
  communitySlug: string;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div>
      <button
        type="button"
        title="Delete event"
        disabled={isPending}
        onClick={() => {
          if (!window.confirm(`Delete "${eventTitle}"? This can't be undone.`)) return;
          setError(null);
          startTransition(async () => {
            const result = await deleteEvent(eventId, communityId, communitySlug, eventTitle);
            if (result?.error) {
              setError(result.error);
            } else {
              router.refresh();
            }
          });
        }}
        className={className ?? "text-muted-foreground hover:text-danger disabled:opacity-60"}
      >
        <X className="h-4 w-4" />
      </button>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
