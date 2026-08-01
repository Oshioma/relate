"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Check, Send, Mail, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";
import { messageMembers } from "./live-events-actions";

// Staff composer: pick members, write a subject + message, and send. Each
// recipient gets an in-app notification and (unless they've opted out) an
// email. Members can silence the email from Settings and keep the in-app copy.
export function MessageMembersModal({
  communityId,
  communitySlug,
  members,
  currentUserId,
  onClose,
}: {
  communityId: string;
  communitySlug: string;
  members: Profile[];
  currentUserId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const selectable = useMemo(() => members.filter((m) => m.id !== currentUserId), [members, currentUserId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return selectable;
    return selectable.filter(
      (m) => (m.full_name || "").toLowerCase().includes(q) || (m.username || "").toLowerCase().includes(q)
    );
  }, [selectable, query]);

  const allShownSelected = filtered.length > 0 && filtered.every((m) => selected.has(m.id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllShown() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allShownSelected) filtered.forEach((m) => next.delete(m.id));
      else filtered.forEach((m) => next.add(m.id));
      return next;
    });
  }

  function handleSend() {
    if (selected.size === 0) {
      setError("Pick at least one member to message.");
      return;
    }
    if (!subject.trim()) {
      setError("Add a subject.");
      return;
    }
    if (!body.trim()) {
      setError("Write a message.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await messageMembers({
        communityId,
        communitySlug,
        memberIds: Array.from(selected),
        subject,
        body,
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
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-card shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Mail className="h-4 w-4" /> Email members
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Sends an email and an in-app notification. Members can opt out of the email in their settings.
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

        <div className="flex-1 overflow-y-auto">
          {/* Recipients */}
          <div className="border-b border-border px-4 py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                To {selected.size > 0 && `· ${selected.size} selected`}
              </span>
              {filtered.length > 0 && (
                <button type="button" onClick={toggleAllShown} className="text-xs font-medium text-accent hover:underline">
                  {allShownSelected ? "Clear" : "Select all"}
                </button>
              )}
            </div>
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search members…" className="pl-8" />
            </div>
            <div className="max-h-44 overflow-y-auto rounded-lg border border-border">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  <Users className="mx-auto mb-1 h-4 w-4" /> No members found.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {filtered.map((m) => {
                    const checked = selected.has(m.id);
                    return (
                      <li key={m.id}>
                        <button
                          type="button"
                          onClick={() => toggle(m.id)}
                          className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted"
                        >
                          <Avatar src={m.avatar_url} name={m.full_name || m.username} size={28} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{m.full_name || m.username}</p>
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
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2 px-4 py-3">
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" maxLength={200} />
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message…"
              rows={5}
              maxLength={2000}
              className="resize-none"
            />
          </div>
        </div>

        {error && <p className="px-4 pt-1 text-sm text-danger">{error}</p>}

        <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleSend} disabled={pending || selected.size === 0}>
            <Send className="h-4 w-4" /> {pending ? "Sending…" : `Send${selected.size ? ` to ${selected.size}` : ""}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
