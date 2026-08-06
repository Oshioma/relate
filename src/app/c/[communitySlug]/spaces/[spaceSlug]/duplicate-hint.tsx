"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { lookupPlaceMatches } from "./place-match-actions";
import type { PlaceMatch } from "@/lib/data/places";

// Watches the name field on a new-listing form and says so when the community
// already has a place by that name — the case no amount of bridging catches,
// because two members adding the same hotel independently never touch a bridge.
//
// It only ever informs. Adding anyway is one click away (it is just a hint),
// because plenty of communities really do have two places called Paradise.
export function DuplicateHint({
  communityId,
  communitySlug,
  name,
  lat,
  lng,
}: {
  communityId: string;
  communitySlug: string;
  // The current value of the form's name field.
  name: string;
  lat?: number | null;
  lng?: number | null;
}) {
  const [matches, setMatches] = useState<PlaceMatch[]>([]);

  useEffect(() => {
    // Everything, including clearing, happens on the timer: the name changes on
    // every keystroke, and setting state straight from an effect body would
    // cascade renders as fast as someone can type.
    let cancelled = false;
    const trimmed = name.trim();
    const timer = setTimeout(async () => {
      if (trimmed.length < 3) {
        if (!cancelled) setMatches([]);
        return;
      }
      const found = await lookupPlaceMatches({ communityId, name: trimmed, lat, lng });
      if (!cancelled) setMatches(found);
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [communityId, name, lat, lng]);

  if (matches.length === 0) return null;

  return (
    <div className="rounded-md border border-accent/40 bg-accent-soft/50 p-3">
      <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <CircleAlert className="h-3.5 w-3.5 text-accent" />
        {matches.length === 1 ? "This may already be listed" : "These may already be listed"}
      </p>
      <ul className="mt-1.5 space-y-1">
        {matches.map((match) => {
          const href = match.stay
            ? `/c/${communitySlug}/spaces/${match.stay.spaceSlug}/stays/${match.stay.id}`
            : match.business
              ? `/c/${communitySlug}/spaces/${match.business.spaceSlug}/businesses/${match.business.id}`
              : null;
          const where = match.facets.length > 0 ? ` — already ${match.facets.join(" and ")}` : "";
          return (
            <li key={match.place.id} className="text-xs text-muted-foreground">
              {href ? (
                <Link href={href} className="font-medium text-accent hover:underline">
                  {match.place.name}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{match.place.name}</span>
              )}
              {match.place.location_label && <span> in {match.place.location_label}</span>}
              {where}
            </li>
          );
        })}
      </ul>
      <p className="mt-1.5 text-xs text-muted-foreground">
        If that&apos;s the same place, add to it rather than creating a second listing. If it isn&apos;t, carry on.
      </p>
    </div>
  );
}
