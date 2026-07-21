"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, MoreVertical, Trash2, RotateCcw, CircleCheck, Package } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import { MARKETPLACE_CATEGORIES, marketplaceCategoryLabel } from "@/lib/marketplace-categories";
import { deleteListing, setListingStatus } from "./marketplace-actions";
import type { ListingWithSeller } from "@/lib/data/marketplace";

function formatPrice(listing: ListingWithSeller): string {
  if (listing.listing_type === "free") return "Free";
  if (listing.price === null) return "Contact for price";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: listing.currency || "USD", maximumFractionDigits: 0 }).format(listing.price);
  } catch {
    return `${listing.currency ?? ""} ${listing.price}`.trim();
  }
}

export function ListingCard({
  listing,
  communitySlug,
  spaceSlug,
  canManage,
}: {
  listing: ListingWithSeller;
  communitySlug: string;
  spaceSlug: string;
  canManage: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const Icon = MARKETPLACE_CATEGORIES.find((c) => c.value === listing.listing_type)?.icon ?? Package;
  const isSold = listing.status === "sold";

  function toggleSold() {
    setMenuOpen(false);
    startTransition(async () => {
      await setListingStatus(listing.id, isSold ? "active" : "sold", communitySlug, spaceSlug);
      router.refresh();
    });
  }

  function handleDelete() {
    setMenuOpen(false);
    if (!window.confirm(`Remove "${listing.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      await deleteListing(listing.id, communitySlug, spaceSlug);
      router.refresh();
    });
  }

  return (
    <div className={`group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md ${isPending ? "opacity-60" : ""}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {listing.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.photo_url}
            alt={listing.title}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isSold ? "grayscale" : ""}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-soft to-muted">
            <Icon className="h-10 w-10 text-accent/50" />
          </div>
        )}

        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
          <Icon className="h-3 w-3" />
          {marketplaceCategoryLabel(listing.listing_type)}
        </span>

        <span className="absolute right-2 top-2 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
          {formatPrice(listing)}
        </span>

        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
            <span className="rotate-[-8deg] rounded-md bg-card px-3 py-1 text-sm font-bold tracking-wide text-foreground shadow-lg">SOLD</span>
          </div>
        )}
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-sm font-semibold text-foreground">{listing.title}</h3>
          {canManage && (
            <div className="relative shrink-0">
              <button type="button" onClick={() => setMenuOpen((v) => !v)} className="rounded-md p-1 text-muted-foreground hover:bg-muted" title="Manage listing">
                <MoreVertical className="h-4 w-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 z-10 w-40 overflow-hidden rounded-md border border-border bg-card shadow-lg">
                  <button type="button" disabled={isPending} onClick={toggleSold} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted disabled:opacity-60">
                    {isSold ? <RotateCcw className="h-3.5 w-3.5" /> : <CircleCheck className="h-3.5 w-3.5" />}
                    {isSold ? "Mark active" : "Mark sold"}
                  </button>
                  <button type="button" disabled={isPending} onClick={handleDelete} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-danger hover:bg-danger/10 disabled:opacity-60">
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {listing.description && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{listing.description}</p>}

        {listing.location_label && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {listing.location_label}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2 border-t border-border pt-2.5">
          <Avatar src={listing.seller?.avatar_url} name={listing.seller?.full_name || listing.seller?.username} size={20} />
          <p className="min-w-0 truncate text-xs text-muted-foreground">
            {listing.seller?.full_name || listing.seller?.username} · {formatRelativeTime(listing.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
