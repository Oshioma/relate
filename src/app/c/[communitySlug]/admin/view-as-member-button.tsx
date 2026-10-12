import { Eye } from "lucide-react";
import { startViewAsMember } from "../view-as-member-actions";

// Starts the "view as member" preview (src/lib/view-as-member.ts) and lands on
// the community feed; a bar there offers the way back.
export function ViewAsMemberButton({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  return (
    <form action={startViewAsMember}>
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Eye className="h-4 w-4" />
        View as member
      </button>
    </form>
  );
}
