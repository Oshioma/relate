import { Crown } from "lucide-react";
import { startViewAsOwner } from "../view-as-member-actions";

// Super admins only: switches on "view as owner" (src/lib/view-as-owner.ts) so
// the owner-only sections of this admin page show, for customer support.
export function ViewAsOwnerButton({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  return (
    <form action={startViewAsOwner}>
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <button
        type="submit"
        title="Super admin: see this admin page as the community's owner does"
        className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Crown className="h-4 w-4" />
        View as owner
      </button>
    </form>
  );
}
