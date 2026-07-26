"use client";

import { useActionState, useState } from "react";
import { Bookmark, NotebookPen, Plus, X, MapPin, Sprout, Star, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  addGrowingJournal,
  deleteGrowingJournal,
  addCommunityTip,
  setCommunityTipApproved,
  deleteCommunityTip,
  toggleSaveCrop,
  type CropJournalFormState,
  type CropTipFormState,
} from "./crop-guides-actions";
import type { JournalWithAuthor, JournalStats, TipWithAuthor } from "@/lib/data/crop-guides";

type Ctx = { cropId: string; communityId: string; communitySlug: string; spaceSlug: string; cropSlug: string };

function HiddenCtx({ ctx }: { ctx: Ctx }) {
  return (
    <>
      <input type="hidden" name="crop_id" value={ctx.cropId} />
      <input type="hidden" name="community_id" value={ctx.communityId} />
      <input type="hidden" name="community_slug" value={ctx.communitySlug} />
      <input type="hidden" name="space_slug" value={ctx.spaceSlug} />
      <input type="hidden" name="crop_slug" value={ctx.cropSlug} />
    </>
  );
}

function authorName(author: { full_name: string | null; username: string } | null): string {
  return author?.full_name || author?.username || "A member";
}

export function SaveCropButton({ ctx, isSaved }: { ctx: Ctx; isSaved: boolean }) {
  return (
    <form action={toggleSaveCrop}>
      <HiddenCtx ctx={ctx} />
      <input type="hidden" name="saved" value={String(isSaved)} />
      <Button type="submit" variant={isSaved ? "secondary" : "primary"} size="sm" className="w-auto">
        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        {isSaved ? "Saved" : "Save to my crops"}
      </Button>
    </form>
  );
}

// --- Growing journals -------------------------------------------------------

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3 text-center">
      <div className="text-lg font-semibold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function GrowingJournals({
  ctx,
  journals,
  stats,
  canContribute,
  isStaff,
  viewerId,
}: {
  ctx: Ctx;
  journals: JournalWithAuthor[];
  stats: JournalStats;
  canContribute: boolean;
  isStaff: boolean;
  viewerId: string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction] = useActionState<CropJournalFormState, FormData>(addGrowingJournal, undefined);

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <NotebookPen className="h-4 w-4 text-accent" />
          Growing journals
        </h2>
        {canContribute && (
          <Button type="button" size="sm" onClick={() => setShowForm((v) => !v)} className="w-auto">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Log your grow"}
          </Button>
        )}
      </div>

      {stats.entryCount > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label={stats.growerCount === 1 ? "grower" : "growers"} value={String(stats.growerCount)} />
          <Stat label="avg harvest" value={stats.avgYieldKg != null ? `${stats.avgYieldKg.toFixed(1)} kg` : "—"} />
          <Stat label="avg days to harvest" value={stats.avgDaysToHarvest != null ? String(stats.avgDaysToHarvest) : "—"} />
          <Stat label="top variety" value={stats.topVariety ? stats.topVariety.name : "—"} />
        </div>
      )}

      {showForm && (
        <form action={formAction} className="mt-4 space-y-3 rounded-md border border-border p-4">
          <HiddenCtx ctx={ctx} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Variety grown">
              <input name="variety" className={inputCls} placeholder="e.g. Roma" />
            </Field>
            <Field label="Success rating (1–5)">
              <select name="success_rating" className={inputCls} defaultValue="">
                <option value="">—</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Planted on">
              <input type="date" name="planted_on" className={inputCls} />
            </Field>
            <Field label="Harvested on">
              <input type="date" name="harvested_on" className={inputCls} />
            </Field>
            <Field label="Yield (kg)">
              <input type="number" step="0.1" min="0" name="yield_kg" className={inputCls} />
            </Field>
            <Field label="Location">
              <input name="location" className={inputCls} placeholder="Optional" />
            </Field>
            <Field label="Climate">
              <input name="climate" className={inputCls} placeholder="e.g. Tropical" />
            </Field>
            <Field label="Weather notes">
              <input name="weather" className={inputCls} placeholder="e.g. Very wet season" />
            </Field>
          </div>
          <Field label="Problems encountered">
            <textarea name="problems" rows={2} className={inputCls} />
          </Field>
          <Field label="Solutions / what worked">
            <textarea name="solutions" rows={2} className={inputCls} />
          </Field>
          {state?.error && <p className="text-sm text-danger">{state.error}</p>}
          <Button type="submit" size="sm" className="w-auto">
            Save journal entry
          </Button>
        </form>
      )}

      {journals.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No growing journals yet. Be the first to log how this crop grew for you.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {journals.map((j) => (
            <li key={j.id} className="rounded-md border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{authorName(j.author)}</span>
                <div className="flex items-center gap-2">
                  {j.success_rating != null && (
                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {j.success_rating}/5
                    </span>
                  )}
                  {(j.user_id === viewerId || isStaff) && (
                    <form action={deleteGrowingJournal}>
                      <input type="hidden" name="id" value={j.id} />
                      <input type="hidden" name="community_slug" value={ctx.communitySlug} />
                      <input type="hidden" name="space_slug" value={ctx.spaceSlug} />
                      <input type="hidden" name="crop_slug" value={ctx.cropSlug} />
                      <button type="submit" className="text-muted-foreground hover:text-danger" aria-label="Delete entry">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {j.variety && <span>Variety: {j.variety}</span>}
                {j.yield_kg != null && <span>Yield: {j.yield_kg} kg</span>}
                {j.planted_on && <span>Planted: {j.planted_on}</span>}
                {j.harvested_on && <span>Harvested: {j.harvested_on}</span>}
                {j.location && <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{j.location}</span>}
              </div>
              {j.problems && <p className="mt-2 text-sm text-foreground"><span className="font-medium">Problems:</span> {j.problems}</p>}
              {j.solutions && <p className="mt-1 text-sm text-foreground"><span className="font-medium">Solutions:</span> {j.solutions}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// --- Regional tips ----------------------------------------------------------

export function RegionalTips({
  ctx,
  tips,
  canContribute,
  isStaff,
}: {
  ctx: Ctx;
  tips: TipWithAuthor[];
  canContribute: boolean;
  isStaff: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction] = useActionState<CropTipFormState, FormData>(addCommunityTip, undefined);

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-accent" />
          Regional tips
        </h2>
        {canContribute && (
          <Button type="button" size="sm" onClick={() => setShowForm((v) => !v)} className="w-auto">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add a local tip"}
          </Button>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Local growing knowledge from this community — reviewed before it appears for everyone.</p>

      {showForm && (
        <form action={formAction} className="mt-4 space-y-3 rounded-md border border-border p-4">
          <HiddenCtx ctx={ctx} />
          <Field label="Region (optional)">
            <input name="region" className={inputCls} placeholder="e.g. Zanzibar" />
          </Field>
          <Field label="Your tip">
            <textarea name="body" rows={3} required className={inputCls} placeholder="What works locally for this crop?" />
          </Field>
          {state?.error && <p className="text-sm text-danger">{state.error}</p>}
          <Button type="submit" size="sm" className="w-auto">
            Submit tip
          </Button>
        </form>
      )}

      {tips.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No regional tips yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {tips.map((t) => (
            <li key={t.id} className="rounded-md border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {t.region && <Badge tone="accent">{t.region}</Badge>}
                  {!t.approved && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Pending review
                    </span>
                  )}
                </div>
                {isStaff && (
                  <div className="flex items-center gap-2">
                    {!t.approved && (
                      <form action={setCommunityTipApproved}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="approved" value="true" />
                        <input type="hidden" name="community_slug" value={ctx.communitySlug} />
                        <input type="hidden" name="space_slug" value={ctx.spaceSlug} />
                        <input type="hidden" name="crop_slug" value={ctx.cropSlug} />
                        <button type="submit" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve
                        </button>
                      </form>
                    )}
                    <form action={deleteCommunityTip}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="community_slug" value={ctx.communitySlug} />
                      <input type="hidden" name="space_slug" value={ctx.spaceSlug} />
                      <input type="hidden" name="crop_slug" value={ctx.cropSlug} />
                      <button type="submit" className="text-muted-foreground hover:text-danger" aria-label="Delete tip">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-foreground">{t.body}</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Sprout className="h-3 w-3" />
                {authorName(t.author)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const inputCls =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
