import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { MemberRow } from "@/lib/data/community";
import { JoinRequestDecision } from "./join-request-decision";

// Outstanding "request to join" rows for a private community, oldest first.
// These are memberships with status 'requested': they exist, but grant nothing
// until someone here approves them, so this panel is the only thing standing
// between a person who asked and a person who's waiting on an answer they may
// never get. It renders nothing when there's nothing pending, so it stays out
// of the way of every community that isn't private.
export function JoinRequestsSection({
  requests,
  communitySlug,
}: {
  requests: MemberRow[];
  communitySlug: string;
}) {
  if (requests.length === 0) return null;

  return (
    <Card>
      <CardContent className="space-y-1">
        <div className="flex items-center gap-2 pb-2">
          <UserPlus className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground">
            Join requests
            <span className="ml-1.5 font-normal text-muted-foreground">({requests.length})</span>
          </h2>
        </div>
        <p className="pb-2 text-xs text-muted-foreground">
          People who asked to join. Approving adds them as a member; declining removes the request without
          telling them.
        </p>
        <div className="divide-y divide-border">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between gap-3 py-2">
              <Link
                href={`/c/${communitySlug}/members/${request.profile.username}`}
                className="flex min-w-0 items-center gap-3 hover:opacity-80"
              >
                <Avatar
                  src={request.profile.avatar_url}
                  name={request.profile.full_name || request.profile.username}
                  size={32}
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {request.profile.full_name || request.profile.username}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    Asked {formatDate(request.created_at)}
                  </span>
                </span>
              </Link>
              <JoinRequestDecision membershipId={request.id} communitySlug={communitySlug} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
