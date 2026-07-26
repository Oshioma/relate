"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BedDouble, ArrowRight } from "lucide-react";
import { createStayFromBusiness } from "./accommodation-actions";

// The Business Directory → Accommodation bridge, shown on a business that reads
// like a place to stay. If a stay is already linked, it points there; otherwise
// whoever manages the listing can spin up a rich stay pre-filled from it.
export function BusinessStayBridge({
  businessId,
  communitySlug,
  linkedStay,
  canCreate,
}: {
  businessId: string;
  communitySlug: string;
  linkedStay: { spaceSlug: string; id: string } | null;
  // The viewer manages this listing and the community has an accommodation
  // space to host the stay.
  canCreate: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      const result = await createStayFromBusiness(businessId, communitySlug);
      if ("error" in result) {
        setError(result.error);
      } else {
        router.push(`/c/${communitySlug}/spaces/${result.spaceSlug}/stays/${result.listingId}`);
      }
    });
  }

  if (linkedStay) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-accent/40 bg-accent-soft/50 p-4">
        <p className="flex items-center gap-2 text-sm text-foreground">
          <BedDouble className="h-4 w-4 text-accent" />
          This place has a full stay listing with photos, availability and reviews.
        </p>
        <Link
          href={`/c/${communitySlug}/spaces/${linkedStay.spaceSlug}/stays/${linkedStay.id}`}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          View stay <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  if (!canCreate) return null;

  return (
    <div className="rounded-lg border border-accent/40 bg-accent-soft/50 p-4">
      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
        <BedDouble className="h-4 w-4 text-accent" />
        This looks like a place to stay
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Create a full stay listing — with a photo gallery, price, availability, amenities and guest reviews — pre-filled from this listing and linked back to it.
      </p>
      <button
        type="button"
        disabled={isPending}
        onClick={handleCreate}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
      >
        <BedDouble className="h-4 w-4" />
        {isPending ? "Creating…" : "Create a stay listing"}
      </button>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
