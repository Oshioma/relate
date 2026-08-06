"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Check, Send, UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";
import { inviteMembersToLiveSession } from "./live-events-actions";

// Staff picker for hand-inviting specific members to a live session — whether
// it's scheduled ("invite to a Live Event") or live right now ("invite to join
// now"). Already-invited members are shown ticked and locked so re-inviting
// (and re-notifying) isn't possible from here.
export function InviteMembersModal({
  sessionId,
  sessionTitle,
  isLive,
  communityId,
  communitySlug,
  spaceSlug,
  members,
  alreadyInvitedIds,
  currentUserId,
  onClose,
}: {
  sessionId: string;
  sessionTitle: string;
  isLive: boolean;
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  members: Profile[];
  alreadyInvitedIds: string[];
  currentUserId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const invitedSet = useMemo(() => new Set(alreadyInvitedIds), [alreadyInvitedIds]);

  // Everyone except the host themselves; already-invited members sink to the
  // bottom so the actionable ones are on top.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members
      .filter((m) => m.id !== currentUserId)
      .filter((m) => {
        if (!q) return true;
        return (
          (m.full_name || "").toLowerCase().includes(q) || (m.username || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => Number(invitedSet.has(a.id)) - Number(invitedSet.has(b.id)));
  }, [members, query, currentUserId, invitedSet]);

  function toggle(id: string) {
    if (invitedSet.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleInvite() {
    if (selected.size === 0) {
      setError("Pick at least one member to invite.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await inviteMembersToLiveSession({
        sessionId,
        communityId,
        communitySlug,
        spaceSlug,
        memberIds: Array.from(selected),
      });
      if (res.error) {
        setError(res.error);
        return;
      }
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-card shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserPlus className="h-4 w-4" /> Invite members
            </h2>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {isLive ? "Live now · " : ""}
              {sessionTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-border px-4 py-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members…"
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {filtered.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">No members found.</p>
          ) : (
            <ul className="space-y-0.5">
              {filtered.map((m) => {
                const invited = invitedSet.has(m.id);
                const checked = invited || selected.has(m.id);
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => toggle(m.id)}
                      disabled={invited}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                        invited ? "opacity-60" : "hover:bg-muted"
                      )}
                    >
                      <Avatar src={m.avatar_url} name={m.full_name || m.username} size={32} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {m.full_name || m.username}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">@{m.username}</p>
                      </div>
                      <span
                        className={cn(
                          "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                          checked ? "border-accent bg-accent text-accent-foreground" : "border-border"
                        )}
                      >
                        {checked && <Check className="h-3.5 w-3.5" />}
                      </span>
                      {invited && <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Invited</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {error && <p className="px-4 pt-2 text-sm text-danger">{error}</p>}

        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
          <span className="text-xs text-muted-foreground">
            {selected.size > 0 ? `${selected.size} selected` : "Select members to invite"}
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleInvite} disabled={pending || selected.size === 0}>
              <Send className="h-4 w-4" /> {pending ? "Inviting…" : "Send invites"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
