"use client";

import { useActionState } from "react";
import { updatePublicAccess, type PublicAccessState } from "./actions";
import { Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Community } from "@/types/database";

// One home for the community's access controls: how discoverable it is at all
// (privacy), and what a visitor can see before joining. Spaces have their own
// per-space visibility; these are the community-wide switches.
export function PublicAccessForm({ community }: { community: Community }) {
  const [state, formAction] = useActionState<PublicAccessState, FormData>(updatePublicAccess, undefined);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={community.id} />
      <input type="hidden" name="community_slug" value={community.slug} />

      <div>
        <Label htmlFor="privacy">Community privacy</Label>
        <select
          id="privacy"
          name="privacy"
          defaultValue={community.privacy}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="public">Public — anyone can find and join it</option>
          <option value="private">Private — anyone with the link can see it, but the feed is members-only</option>
          <option value="invite_only">Invite only — hidden; members must be invited</option>
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          This is about being <span className="font-medium text-foreground">found</span>: only a public community is
          listed for other people to discover and join. Private and invite-only are reachable by link only, so share the
          address yourself. Invite-only goes further: it doesn&apos;t resolve at all for anyone who isn&apos;t a member.
          Whether a stranger who has the link can <span className="font-medium text-foreground">read</span> the feed is
          the next setting down.
        </p>
      </div>

      {/* Two questions that used to have one answer. Privacy above is about
          being FOUND; this is about being READ. A public community is already
          readable, so the box only does anything for a private one — and
          invite-only ignores it in the database too, not just here. */}
      <label className="flex items-start gap-3 border-t border-border pt-4 text-sm">
        <input
          type="checkbox"
          name="feed_public"
          defaultChecked={community.feed_public}
          className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--accent)]"
        />
        <span>
          <span className="block font-medium text-foreground">Show the feed publicly</span>
          <span className="block text-muted-foreground">
            {community.privacy === "public"
              ? "A public community already shows its feed to everyone — this makes no difference until you switch to private."
              : community.privacy === "invite_only"
                ? "Ignored while the community is invite-only: it doesn't resolve at all for anyone who isn't a member."
                : "Let signed-out visitors read the feed of this private community. It stays unlisted — people still need the link."}{" "}
            Guests only ever see content from spaces set to <span className="font-medium text-foreground">Public</span>;
            members-only spaces stay hidden, so a feed of members-only spaces looks empty to them.
          </span>
        </span>
      </label>

      <label className="flex items-start gap-3 border-t border-border pt-4 text-sm">
        <input
          type="checkbox"
          name="events_public"
          defaultChecked={community.events_public}
          className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--accent)]"
        />
        <span>
          <span className="block font-medium text-foreground">Show events publicly</span>
          <span className="block text-muted-foreground">
            Let signed-out visitors see this community&apos;s events before logging in. They still
            can&apos;t RSVP or add events without an account. Follows the same door as the feed: on a
            private community it applies once the feed is public.
          </span>
        </span>
      </label>

      <div className="border-t border-border pt-4">
        <Label htmlFor="members_visibility">Members list visibility</Label>
        <select
          id="members_visibility"
          name="members_visibility"
          defaultValue={community.members_visibility}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="public">Public — any signed-in visitor, including guests who haven&apos;t joined</option>
          <option value="members">Members only — must have joined to see who else is in it</option>
          <option value="private">Private — staff only</option>
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          Controls who can see the Members list and link. Members always requires an account — signed-out visitors
          never see it. A paid-members-only tier is planned for later, once the platform supports paid memberships.
        </p>
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <SubmitButton pendingText="Saving…" className="w-auto">
        Save
      </SubmitButton>
    </form>
  );
}
