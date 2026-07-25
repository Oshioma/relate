"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, ImageOff } from "lucide-react";
import { updateEventImage } from "./actions";

// Lets whoever can manage the event set or clear its photo directly from the
// card, without opening the full edit form just to change one field.
export function EventImageQuickActions({
  eventId,
  communitySlug,
  hasImage,
  className,
}: {
  eventId: string;
  communitySlug: string;
  hasImage: boolean;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAdd() {
    const input = window.prompt("Image URL");
    if (!input) return;
    startTransition(async () => {
      const result = await updateEventImage(eventId, communitySlug, input.trim());
      if (result?.error) window.alert(result.error);
      else router.refresh();
    });
  }

  function handleRemove() {
    if (!window.confirm("Remove this event's image?")) return;
    startTransition(async () => {
      const result = await updateEventImage(eventId, communitySlug, null);
      if (result?.error) window.alert(result.error);
      else router.refresh();
    });
  }

  return (
    <div className={className}>
      {hasImage ? (
        <button
          type="button"
          title="Remove image"
          disabled={isPending}
          onClick={handleRemove}
          className="rounded-full bg-black/60 p-1 text-white hover:bg-black/80 disabled:opacity-60"
        >
          <ImageOff className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          title="Add image"
          disabled={isPending}
          onClick={handleAdd}
          className="rounded-full bg-black/60 p-1 text-white hover:bg-black/80 disabled:opacity-60"
        >
          <ImagePlus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
