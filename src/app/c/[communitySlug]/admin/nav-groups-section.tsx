"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { createNavGroup, deleteNavGroup, renameNavGroup, reorderNavGroups } from "./nav-groups-actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { useFormDraft } from "@/lib/use-form-draft";
import type { CommunityNavGroup } from "@/types/database";

// Admin for the sidebar's sections: add one, rename it, move it, remove it.
// Each space is filed into a section from its own row under Spaces.

function NavGroupRow({
  group,
  spaceCount,
  communitySlug,
  isFirst,
  isLast,
  onMove,
}: {
  group: CommunityNavGroup;
  spaceCount: number;
  communitySlug: string;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // A half-typed rename survives a refresh like any other form.
  const { formRef, clearDraft } = useFormDraft(`nav-group-rename:${group.id}`);

  async function rename(formData: FormData) {
    setError(null);
    const label = String(formData.get("label") ?? "");
    if (label.trim() === group.label) return;
    const result = await renameNavGroup(group.id, communitySlug, label);
    if (result.error) {
      setError(result.error);
    } else {
      clearDraft();
      router.refresh();
    }
  }

  function remove() {
    const filed = spaceCount === 1 ? "1 space" : `${spaceCount} spaces`;
    const message =
      spaceCount > 0
        ? `Remove "${group.label}"? ${filed} in it will become ungrouped.`
        : `Remove "${group.label}"?`;
    if (!window.confirm(message)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteNavGroup(group.id, communitySlug);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2">
        <form ref={formRef} action={rename} className="flex min-w-0 flex-1 items-center gap-2">
          <Input
            name="label"
            defaultValue={group.label}
            maxLength={40}
            aria-label={`Name of the ${group.label} section`}
            className="min-w-0 flex-1"
          />
          <SubmitButton variant="secondary" pendingText="Saving…" className="w-auto shrink-0">
            Rename
          </SubmitButton>
        </form>
        <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
          {spaceCount === 1 ? "1 space" : `${spaceCount} spaces`}
        </span>
        <button
          type="button"
          title="Move up"
          disabled={isFirst || isPending}
          onClick={() => onMove(-1)}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Move down"
          disabled={isLast || isPending}
          onClick={() => onMove(1)}
          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Remove section"
          disabled={isPending}
          onClick={remove}
          className="text-muted-foreground hover:text-danger disabled:opacity-60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

function NewNavGroupForm({ communityId, communitySlug }: { communityId: string; communitySlug: string }) {
  const [error, setError] = useState<string | null>(null);
  const { formRef, clearDraft } = useFormDraft(`nav-group-new:${communityId}`);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createNavGroup(undefined, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      clearDraft();
      formRef.current?.reset();
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <input type="hidden" name="community_id" value={communityId} />
      <input type="hidden" name="community_slug" value={communitySlug} />
      <div>
        <Label htmlFor="nav_group_label">New section</Label>
        <Input id="nav_group_label" name="label" placeholder="My growing" maxLength={40} required />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <SubmitButton pendingText="Adding…" className="w-auto">
        Add section
      </SubmitButton>
    </form>
  );
}

export function NavGroupsSection({
  communityId,
  communitySlug,
  groups,
  spaceCounts,
}: {
  communityId: string;
  communitySlug: string;
  groups: CommunityNavGroup[];
  // How many spaces are filed under each section key.
  spaceCounts: Record<string, number>;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= groups.length) return;
    const ids = groups.map((g) => g.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    setError(null);
    startTransition(async () => {
      const result = await reorderNavGroups(communityId, communitySlug, ids);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sections yet. Every space shows in one list.</p>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {groups.map((group, index) => (
            <NavGroupRow
              key={group.id}
              group={group}
              spaceCount={spaceCounts[group.key] ?? 0}
              communitySlug={communitySlug}
              isFirst={index === 0}
              isLast={index === groups.length - 1}
              onMove={(direction) => move(index, direction)}
            />
          ))}
        </div>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
      <NewNavGroupForm communityId={communityId} communitySlug={communitySlug} />
    </div>
  );
}
