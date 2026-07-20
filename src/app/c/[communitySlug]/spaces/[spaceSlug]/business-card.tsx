"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Globe, Phone, MapPin, Clock, BadgeCheck, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { businessCategoryLabel } from "@/lib/business-categories";
import { deleteBusiness, setBusinessBadge } from "./business-directory-actions";
import type { Business } from "@/types/database";

export function BusinessCard({
  business,
  communitySlug,
  spaceSlug,
  canDelete,
  isStaff,
}: {
  business: Business;
  communitySlug: string;
  spaceSlug: string;
  // Whoever added the listing (or staff) can remove it; only staff can grant
  // the verified/featured badges — see enforce_business_privileged_fields in
  // supabase/business-directory.sql, which enforces the same split in the DB.
  canDelete: boolean;
  isStaff: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function toggleBadge(field: "verified" | "featured") {
    setError(null);
    startTransition(async () => {
      const result = await setBusinessBadge(business.id, field, !business[field], communitySlug, spaceSlug);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!window.confirm(`Remove "${business.name}"? This can't be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteBusiness(business.id, communitySlug, spaceSlug);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-sm font-semibold text-foreground">{business.name}</h3>
              {business.verified && (
                <span title="Verified" className="text-accent">
                  <BadgeCheck className="h-4 w-4" />
                </span>
              )}
              {business.featured && <Badge tone="accent">Featured</Badge>}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{businessCategoryLabel(business.category)}</p>
          </div>
          {canDelete && (
            <button
              type="button"
              title="Remove business"
              disabled={isPending}
              onClick={handleDelete}
              className="shrink-0 text-muted-foreground hover:text-danger disabled:opacity-60"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {business.description && <p className="mt-2 text-sm text-foreground">{business.description}</p>}

        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
          {business.address && (
            <p className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {business.address}
            </p>
          )}
          {business.opening_hours && (
            <p className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {business.opening_hours}
            </p>
          )}
          {business.phone && (
            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              {business.phone}
            </p>
          )}
          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground"
            >
              <Globe className="h-3.5 w-3.5 shrink-0" />
              {business.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>

        {isStaff && (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => toggleBadge("verified")}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-60"
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              {business.verified ? "Unverify" : "Verify"}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => toggleBadge("featured")}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-60"
            >
              <Star className="h-3.5 w-3.5" />
              {business.featured ? "Unfeature" : "Feature"}
            </button>
          </div>
        )}

        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      </CardContent>
    </Card>
  );
}
