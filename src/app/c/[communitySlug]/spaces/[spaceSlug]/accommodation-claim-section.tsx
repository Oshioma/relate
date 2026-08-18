"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, ShieldQuestion } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { formatRelativeTime } from "@/lib/utils";
import { submitAccommodationClaim, resolveAccommodationClaim, withdrawAccommodationClaim } from "./accommodation-claim-actions";
import type { AccommodationClaimWithClaimant } from "@/lib/data/accommodation";
import type { AccommodationClaim } from "@/types/database";

// Ownership panel on a stay's page, mirroring the directory's: a host can ask to
// own a listing someone else added, track the request, and staff approve or
// reject it. Approval hands over editing rights.
export function AccommodationClaimSection({
  listingId,
  communityId,
  communitySlug,
  spaceSlug,
  canClaim,
  isStaff,
  ownedByViewer,
  claimed,
  viewerClaim,
  pendingClaims,
}: {
  listingId: string;
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  // Signed in, stay unclaimed, and no live claim of their own. Doesn't require
  // community membership — claiming is open to new users too.
  canClaim: boolean;
  isStaff: boolean;
  // The stay has a host (an approved claim), and that host is the viewer.
  ownedByViewer: boolean;
  // The stay has a host at all. When true there's nothing to claim; say so
  // instead of leaving a blank where the CTA would be.
  claimed: boolean;
  viewerClaim: AccommodationClaim | null;
  pendingClaims: AccommodationClaimWithClaimant[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const staffPending = isStaff ? pendingClaims : [];
  const showViewerPending = viewerClaim?.status === "pending";
  const showViewerDeclined = viewerClaim?.status === "rejected";
  const showOwned = claimed && !showViewerPending;

  // Nothing to show: not eligible to claim, no claim of their own to report, not
  // claimed, and (for staff) nothing pending to action.
  if (!canClaim && !showViewerPending && !showViewerDeclined && !showOwned && staffPending.length === 0) return null;

  // When the only thing to show is the CTA, keep it to a compact line rather
  // than a full bordered card.
  const isCompactCta = canClaim && !showForm && !showViewerPending && !showViewerDeclined && !showOwned && staffPending.length === 0;

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitAccommodationClaim(undefined, formData);
      if (result?.error) setError(result.error);
      else {
        setShowForm(false);
        formRef.current?.reset();
        router.refresh();
      }
    });
  }

  function handleResolve(claimId: string, approve: boolean) {
    setError(null);
    startTransition(async () => {
      const result = await resolveAccommodationClaim(claimId, approve, communitySlug, spaceSlug);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  function handleWithdraw(claimId: string) {
    setError(null);
    startTransition(async () => {
      const result = await withdrawAccommodationClaim(claimId);
      if (result?.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className={isCompactCta ? "mt-4" : "mt-4 rounded-lg border border-border bg-card p-4"}>
      {/* Staff: pending claims to action */}
      {staffPending.length > 0 && (
        <div className="space-y-3">
          <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <ShieldQuestion className="h-4 w-4" /> Ownership {staffPending.length === 1 ? "claim" : "claims"} to review
          </p>
          {staffPending.map((claim) => (
            <div key={claim.id} className="rounded-md border border-border p-3">
              <div className="flex items-center gap-2">
                <Avatar src={claim.claimant?.avatar_url} name={claim.claimant?.full_name || claim.claimant?.username} size={24} />
                <p className="text-sm font-medium text-foreground">{claim.claimant?.full_name || claim.claimant?.username}</p>
                <p className="text-xs text-muted-foreground">{formatRelativeTime(claim.created_at)}</p>
              </div>
              {claim.message && <p className="mt-1.5 whitespace-pre-wrap text-sm text-muted-foreground">{claim.message}</p>}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleResolve(claim.id, true)}
                  className="inline-flex items-center gap-1 rounded-md border border-accent bg-accent-soft px-2 py-1 text-xs font-medium text-accent disabled:opacity-60"
                >
                  <BadgeCheck className="h-3.5 w-3.5" /> Approve
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleResolve(claim.id, false)}
                  className="rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:border-danger hover:text-danger disabled:opacity-60"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* The viewer's own pending claim */}
      {showViewerPending && viewerClaim && (
        <div className={staffPending.length > 0 ? "mt-3 border-t border-border pt-3" : ""}>
          <p className="text-sm text-muted-foreground">
            Your ownership claim is awaiting review.{" "}
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleWithdraw(viewerClaim.id)}
              className="font-medium text-danger hover:underline disabled:opacity-60"
            >
              Withdraw
            </button>
          </p>
        </div>
      )}

      {/* Already has a host — explain the absent CTA instead of a blank. */}
      {showOwned && (
        <div className={staffPending.length > 0 ? "mt-3 border-t border-border pt-3" : ""}>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
            {ownedByViewer ? "You host this place — the listing is linked to your account and yours to edit." : "This place has been claimed by its host."}
          </p>
        </div>
      )}

      {/* A prior claim of theirs that staff turned down. */}
      {showViewerDeclined && (
        <div className={staffPending.length > 0 ? "mt-3 border-t border-border pt-3" : ""}>
          <p className="text-sm text-muted-foreground">Your previous ownership claim was declined.</p>
        </div>
      )}

      {/* Claim CTA / form */}
      {canClaim && !showForm && (
        <p className="text-sm text-muted-foreground">
          Do you host this place?{" "}
          <button type="button" onClick={() => setShowForm(true)} className="font-medium text-accent hover:underline">
            Claim this listing
          </button>{" "}
          to edit its details, photos and availability once staff approve.
        </p>
      )}

      {canClaim && showForm && (
        <form ref={formRef} action={handleSubmit} className="space-y-2">
          <input type="hidden" name="listing_id" value={listingId} />
          <input type="hidden" name="community_id" value={communityId} />
          <p className="text-sm font-medium text-foreground">Claim this listing</p>
          <Textarea name="message" rows={3} placeholder="Tell the moderators how you're connected to this place (optional)." />
          <div className="flex gap-2">
            <SubmitButton pendingText="Sending…" className="w-auto">
              Submit claim
            </SubmitButton>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
