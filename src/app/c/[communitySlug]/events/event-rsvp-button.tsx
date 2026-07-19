"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rsvpToEvent, cancelRsvp } from "./actions";

export function EventRsvpButton({
  eventId,
  communitySlug,
  initialGoing,
}: {
  eventId: string;
  communitySlug: string;
  initialGoing: boolean;
}) {
  const [going, setGoing] = useState(initialGoing);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function toggle() {
    setError(null);
    startTransition(async () => {
      const result = going ? await cancelRsvp(eventId, communitySlug) : await rsvpToEvent(eventId, communitySlug);
      if (result?.error) {
        setError(result.error);
      } else {
        setGoing(!going);
        router.refresh();
      }
    });
  }

  return (
    <div>
      <Button size="sm" variant={going ? "secondary" : "primary"} onClick={toggle} disabled={isPending}>
        {going && <Check className="h-3.5 w-3.5" />}
        {going ? "Going" : "RSVP"}
      </Button>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
