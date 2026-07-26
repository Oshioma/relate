"use client";

import { useActionState, useState } from "react";
import { Stethoscope, Plus, X, Clock, CheckCircle2, Sprout, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addMedicinalUse, setMedicinalUseApproved, deleteMedicinalUse, type CropMedicinalFormState } from "./crop-guides-actions";
import type { MedicinalUseWithAuthor } from "@/lib/data/crop-guides";

type Ctx = { cropId: string; communityId: string; communitySlug: string; spaceSlug: string; cropSlug: string };

const inputCls =
  "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function authorName(author: { full_name: string | null; username: string } | null): string {
  return author?.full_name || author?.username || "A member";
}

export function MedicinalUses({
  ctx,
  uses,
  canContribute,
  isStaff,
}: {
  ctx: Ctx;
  uses: MedicinalUseWithAuthor[];
  canContribute: boolean;
  isStaff: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [state, formAction] = useActionState<CropMedicinalFormState, FormData>(addMedicinalUse, undefined);

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Stethoscope className="h-4 w-4 text-accent" />
          Medicinal uses
        </h2>
        {canContribute && (
          <Button type="button" size="sm" onClick={() => setShowForm((v) => !v)} className="w-auto">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Log a use"}
          </Button>
        )}
      </div>
      <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3 w-3 shrink-0" />
        Traditional knowledge shared by this community — reviewed before it appears, and not medical advice.
      </p>

      {showForm && (
        <form action={formAction} className="mt-4 space-y-3 rounded-md border border-border p-4">
          <input type="hidden" name="crop_id" value={ctx.cropId} />
          <input type="hidden" name="community_id" value={ctx.communityId} />
          <input type="hidden" name="community_slug" value={ctx.communitySlug} />
          <input type="hidden" name="space_slug" value={ctx.spaceSlug} />
          <input type="hidden" name="crop_slug" value={ctx.cropSlug} />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Ailment / use</span>
              <input name="ailment" required className={inputCls} placeholder="e.g. Sore throat" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Part used</span>
              <input name="part_used" className={inputCls} placeholder="e.g. Leaf, root" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Preparation</span>
              <input name="preparation" className={inputCls} placeholder="e.g. Tea, poultice" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">How it&apos;s used</span>
            <textarea name="description" rows={2} className={inputCls} placeholder="Notes on preparation and use" />
          </label>
          {state?.error && <p className="text-sm text-danger">{state.error}</p>}
          <Button type="submit" size="sm" className="w-auto">
            Submit
          </Button>
        </form>
      )}

      {uses.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No medicinal uses logged yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {uses.map((u) => (
            <li key={u.id} className="rounded-md border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{u.ailment}</span>
                  {u.part_used && <Badge tone="neutral">{u.part_used}</Badge>}
                  {u.preparation && <Badge tone="accent">{u.preparation}</Badge>}
                  {!u.approved && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Pending review
                    </span>
                  )}
                </div>
                {isStaff && (
                  <div className="flex items-center gap-2">
                    {!u.approved && (
                      <form action={setMedicinalUseApproved}>
                        <input type="hidden" name="id" value={u.id} />
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
                    <form action={deleteMedicinalUse}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="community_slug" value={ctx.communitySlug} />
                      <input type="hidden" name="space_slug" value={ctx.spaceSlug} />
                      <input type="hidden" name="crop_slug" value={ctx.cropSlug} />
                      <button type="submit" className="text-muted-foreground hover:text-danger" aria-label="Delete">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
              {u.description && <p className="mt-2 text-sm text-foreground">{u.description}</p>}
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Sprout className="h-3 w-3" />
                {authorName(u.author)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
