"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { revokeInvite } from "./invites-actions";
import { formatDate } from "@/lib/utils";
import type { CommunityInvite } from "@/types/database";

function inviteStatusLabel(invite: CommunityInvite): { label: string; tone: "accent" | "neutral" | "danger" } {
  if (invite.revoked) return { label: "Revoked", tone: "neutral" };
  if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) return { label: "Expired", tone: "neutral" };
  if (invite.max_uses !== null && invite.uses_count >= invite.max_uses) return { label: "Used up", tone: "neutral" };
  return { label: "Active", tone: "accent" };
}

function InviteRow({ invite, communitySlug }: { invite: CommunityInvite; communitySlug: string }) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const status = inviteStatusLabel(invite);

  function copyLink() {
    const url = `${window.location.origin}/invite/${invite.code}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <code className="text-sm font-medium text-foreground">/invite/{invite.code}</code>
          <Badge tone={status.tone}>{status.label}</Badge>
          <Badge tone="neutral">{invite.role}</Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {invite.uses_count} use{invite.uses_count === 1 ? "" : "s"}
          {invite.max_uses !== null ? ` of ${invite.max_uses}` : ""}
          {invite.expires_at ? ` · expires ${formatDate(invite.expires_at)}` : ""}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={copyLink}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy link"}
        </Button>
        {!invite.revoked && (
          <Button
            size="sm"
            variant="ghost"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await revokeInvite(invite.id, communitySlug);
                router.refresh();
              })
            }
          >
            Revoke
          </Button>
        )}
      </div>
    </div>
  );
}

export function InvitesList({ invites, communitySlug }: { invites: CommunityInvite[]; communitySlug: string }) {
  if (invites.length === 0) {
    return <p className="text-sm text-muted-foreground">No invite links yet.</p>;
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {invites.map((invite) => (
        <InviteRow key={invite.id} invite={invite} communitySlug={communitySlug} />
      ))}
    </div>
  );
}
