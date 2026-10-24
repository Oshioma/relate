"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Archive, ArchiveRestore, CheckCircle2 } from "lucide-react";
import { updateTier, setTierArchived, deleteTier, setTierSpaces, type TierFormState } from "./tier-actions";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Badge } from "@/components/ui/badge";
import type { TierSales, TierWithSpaces } from "@/lib/data/tiers";

function formatMonthlyPrice(cents: number, currency: string): string {
  try {
    return `${new Intl.NumberFormat(undefined, { style: "currency", currency: currency.toUpperCase() }).format(cents / 100)}/mo`;
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency.toUpperCase()}/mo`;
  }
}

// The tier's state in plain words: whether new members can buy it, and why not.
function tierStatus(tier: TierWithSpaces): { label: string; tone: "accent" | "neutral" | "danger"; hint: string } {
  if (tier.archived_at) {
    return { label: "Archived", tone: "neutral", hint: "Hidden from new members. Anyone already on it keeps access." };
  }
  if (tier.spaceIds.length === 0) {
    return { label: "Not ready", tone: "danger", hint: "Tick at least one space below so the tier unlocks something." };
  }
  return { label: "On sale", tone: "accent", hint: "Members can join it from the Membership page." };
}

function salesLine(sales: TierSales | undefined): string {
  if (!sales || sales.total === 0) return "Not sold yet: nobody has joined this tier.";
  const parts = [`Sold to ${sales.active} current member${sales.active === 1 ? "" : "s"}`];
  if (sales.cancelling > 0) parts.push(`${sales.cancelling} cancelling at period end`);
  const lapsed = sales.total - sales.active;
  if (lapsed > 0) parts.push(`${lapsed} lapsed or cancelled`);
  return parts.join(" · ");
}

export function TierRow({
  tier,
  sales,
  communitySlug,
  spaces,
}: {
  tier: TierWithSpaces;
  sales?: TierSales;
  communitySlug: string;
  // Assignable spaces (non-public) in this community.
  spaces: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(tier.spaceIds));
  // A short "Saved" note after the details or spaces are saved.
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [updateState, updateAction, isUpdating] = useActionState<TierFormState, FormData>(updateTier, undefined);
  const archived = Boolean(tier.archived_at);
  const status = tierStatus(tier);

  const wasUpdating = useRef(false);
  useEffect(() => {
    if (wasUpdating.current && !isUpdating && updateState && "saved" in updateState) {
      setEditing(false);
      setSavedNote("Tier details saved.");
    }
    wasUpdating.current = isUpdating;
  }, [isUpdating, updateState]);

  // Whether the space selection differs from what's saved, so "Save spaces" only
  // lights up when there's something to save.
  const dirty = selected.size !== tier.spaceIds.length || tier.spaceIds.some((id) => !selected.has(id));

  async function saveSpaces() {
    setBusy(true);
    const res = await setTierSpaces(tier.id, [...selected], communitySlug);
    setBusy(false);
    if (res.error) alert(res.error);
    else {
      setSavedNote("Spaces saved.");
      router.refresh();
    }
  }

  async function toggleArchived() {
    setBusy(true);
    await setTierArchived(tier.id, !archived, communitySlug);
    router.refresh();
    setBusy(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete the "${tier.name}" tier? This can't be undone.`)) return;
    setBusy(true);
    const res = await deleteTier(tier.id, communitySlug);
    setBusy(false);
    if (res.error) alert(res.error);
    else router.refresh();
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-foreground">{tier.name}</p>
            <Badge tone={status.tone} title={status.hint}>
              {status.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatMonthlyPrice(tier.price_cents, tier.currency)} · unlocks {tier.spaceIds.length} space
            {tier.spaceIds.length === 1 ? "" : "s"}
          </p>
          <p className="text-xs text-muted-foreground">{status.hint}</p>
          <p className={`text-xs ${sales && sales.active > 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
            {salesLine(sales)}
          </p>
          {savedNote && (
            <p role="status" className="mt-1 flex items-center gap-1 text-xs text-accent">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {savedNote}
            </p>
          )}
        </div>
        <button type="button" onClick={() => setEditing((v) => !v)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" title="Edit">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" onClick={toggleArchived} disabled={busy} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" title={archived ? "Unarchive" : "Archive"}>
          {archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
        </button>
        <button type="button" onClick={handleDelete} disabled={busy} className="rounded-md p-1.5 text-muted-foreground hover:bg-danger/10 hover:text-danger" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {editing && (
        <form action={updateAction} className="mt-3 space-y-3">
          <input type="hidden" name="tier_id" value={tier.id} />
          <input type="hidden" name="community_slug" value={communitySlug} />
          <div>
            <Label htmlFor={`tier-name-${tier.id}`}>Name</Label>
            <Input id={`tier-name-${tier.id}`} name="name" defaultValue={tier.name} required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`tier-price-${tier.id}`}>Monthly price</Label>
              <Input id={`tier-price-${tier.id}`} name="price" type="number" step="0.01" min="0" defaultValue={(tier.price_cents / 100).toString()} required />
            </div>
            <div>
              <Label htmlFor={`tier-currency-${tier.id}`}>Currency</Label>
              <p id={`tier-currency-${tier.id}`} className="py-2 text-sm text-foreground">
                {tier.currency.toUpperCase()}
              </p>
            </div>
          </div>
          <div>
            <Label htmlFor={`tier-desc-${tier.id}`}>Description</Label>
            <Textarea id={`tier-desc-${tier.id}`} name="description" rows={2} defaultValue={tier.description ?? ""} />
          </div>
          {updateState && "error" in updateState && <p className="text-sm text-danger">{updateState.error}</p>}
          <div className="flex gap-2">
            <SubmitButton className="w-auto" pendingText="Saving…">
              Save
            </SubmitButton>
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="mt-3">
        <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Spaces this tier unlocks</p>
        {spaces.length === 0 ? (
          <p className="text-xs text-muted-foreground">No eligible spaces yet — public spaces are always free and can&apos;t be tiered.</p>
        ) : (
          <>
            <div className="space-y-1.5">
              {spaces.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={(e) =>
                      setSelected((prev) => {
                        const next = new Set(prev);
                        if (e.target.checked) next.add(s.id);
                        else next.delete(s.id);
                        return next;
                      })
                    }
                    className="h-4 w-4 rounded border-border text-accent focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-foreground">{s.name}</span>
                </label>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Button type="button" size="sm" variant={dirty ? "primary" : "secondary"} className="w-auto" onClick={saveSpaces} disabled={busy || !dirty}>
                {busy ? "Saving…" : "Save spaces"}
              </Button>
              {dirty && <span className="text-xs text-danger">Unsaved changes</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
