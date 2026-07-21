"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Globe, Phone, MapPin, Clock, BadgeCheck, Star, Pencil, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { businessCategoryLabel } from "@/lib/business-categories";
import { deleteBusiness, setBusinessBadge } from "./business-directory-actions";
import { EditBusinessForm } from "./edit-business-form";
import type { Business } from "@/types/database";

export function BusinessCard({
  business,
  communitySlug,
  spaceSlug,
  canManage,
  isStaff,
  userId,
}: {
  business: Business;
  communitySlug: string;
  spaceSlug: string;
  // Whoever added the listing (or staff) can edit or remove it; only staff can
  // grant the verified/featured badges — see enforce_business_privileged_fields
  // in supabase/business-directory.sql, which enforces the same split in the DB.
  canManage: boolean;
  isStaff: boolean;
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
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

  if (isEditing) {
    return (
      <EditBusinessForm
        business={business}
        communitySlug={communitySlug}
        spaceSlug={spaceSlug}
        userId={userId}
        onDone={() => {
          setIsEditing(false);
          router.refresh();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-44 w-full bg-muted">
        {business.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.image_url}
            alt={business.name}
            className="h-full w-full object-cover"
            style={{ objectPosition: business.image_position ?? "50% 50%" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Store className="h-8 w-8" />
          </div>
        )}
      </div>
      <CardContent className="pt-4">
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
          {canManage && (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                title="Edit business"
                disabled={isPending}
                onClick={() => setIsEditing(true)}
                className="text-muted-foreground hover:text-foreground disabled:opacity-60"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Remove business"
                disabled={isPending}
                onClick={handleDelete}
                className="text-muted-foreground hover:text-danger disabled:opacity-60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
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
