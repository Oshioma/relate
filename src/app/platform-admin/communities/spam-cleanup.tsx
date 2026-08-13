"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { deleteSpamAccounts } from "@/app/platform-admin/actions";
import { formatDate } from "@/lib/utils";
import type { SpamCandidate } from "@/lib/data/platform-analytics";

export function SpamCleanup({ candidates }: { candidates: SpamCandidate[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(() => new Set(candidates.map((c) => c.id)));
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (candidates.length === 0) {
    return (
      <div className="mb-8 rounded-lg border border-border p-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">Spam cleanup</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          No suspected spam accounts right now — nothing with an unconfirmed email, no community, and no content.
        </p>
      </div>
    );
  }

  const allSelected = selected.size === candidates.length;
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(candidates.map((c) => c.id)));

  const onDelete = () => {
    const ids = [...selected];
    if (ids.length === 0) return;
    const ok = window.confirm(
      `Permanently delete ${ids.length} account${ids.length === 1 ? "" : "s"}? This removes the sign-in and profile and cannot be undone.`
    );
    if (!ok) return;
    setMessage(null);
    startTransition(async () => {
      const res = await deleteSpamAccounts(ids);
      if ("error" in res) {
        setMessage(res.error);
        return;
      }
      setMessage(
        `Deleted ${res.deleted} account${res.deleted === 1 ? "" : "s"}${res.skipped > 0 ? `, skipped ${res.skipped} that no longer qualified` : ""}.`
      );
      setSelected(new Set());
      router.refresh();
    });
  };

  return (
    <details className="mb-8 rounded-lg border border-danger/30 bg-danger/5 p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <ShieldAlert className="h-4 w-4 text-danger" />
          Spam cleanup — {candidates.length} suspected {candidates.length === 1 ? "account" : "accounts"}
        </span>
        <span className="text-xs text-muted-foreground">review before deleting</span>
      </summary>

      <p className="mb-3 mt-2 text-xs text-muted-foreground">
        Accounts that never confirmed their email, belong to no community, and have written no posts or comments — the
        signature of automated signups. Super admins are never listed. Untick anything you want to keep. Deletion is
        permanent and removes both the sign-in and the profile.
      </p>

      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs font-medium text-accent hover:underline"
          disabled={pending}
        >
          {allSelected ? "Deselect all" : "Select all"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={pending || selected.size === 0}
          className="rounded-md bg-danger px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Deleting…" : `Delete ${selected.size} selected`}
        </button>
      </div>

      {message && <p className="mb-3 text-xs text-muted-foreground">{message}</p>}

      <ul className="max-h-96 divide-y divide-border overflow-y-auto rounded-md border border-border bg-background">
        {candidates.map((c) => (
          <li key={c.id} className="flex items-center gap-3 px-3 py-2">
            <input
              type="checkbox"
              checked={selected.has(c.id)}
              onChange={() => toggle(c.id)}
              disabled={pending}
              className="h-4 w-4 shrink-0 accent-danger"
              aria-label={`Select ${c.username}`}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">
                {c.fullName || c.username} <span className="text-muted-foreground">@{c.username}</span>
              </p>
              <p className="truncate text-xs text-muted-foreground">{c.email ?? "no email"}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">Joined {formatDate(c.createdAt)}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
