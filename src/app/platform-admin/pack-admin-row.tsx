"use client";

import { useActionState } from "react";
import { saveFeaturePack, type PlanFormState } from "./actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { FeaturePack } from "@/types/database";

// One editable feature-pack row for the platform super admin. A paid pack needs
// a Stripe recurring Price id before owners can subscribe; space_types are the
// space type keys the pack unlocks.
export function PackAdminRow({ pack }: { pack: FeaturePack }) {
  const [state, action] = useActionState<PlanFormState, FormData>(saveFeaturePack, undefined);

  return (
    <form action={action} className="rounded-lg border border-border p-4">
      <input type="hidden" name="pack_id" value={pack.id} />

      <div className="mb-3 flex items-center gap-2">
        <p className="text-sm font-semibold text-foreground">{pack.name}</p>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{pack.slug}</span>
        {!pack.stripe_price_id && pack.price_cents > 0 && (
          <span className="rounded bg-danger/10 px-1.5 py-0.5 text-[11px] text-danger">no Stripe price</span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`pname-${pack.id}`}>Name</Label>
          <Input id={`pname-${pack.id}`} name="name" defaultValue={pack.name} required />
        </div>
        <div>
          <Label htmlFor={`pdesc-${pack.id}`}>Description</Label>
          <Input id={`pdesc-${pack.id}`} name="description" defaultValue={pack.description ?? ""} />
        </div>
        <div>
          <Label htmlFor={`pprice-${pack.id}`}>Price / month (0 = free)</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id={`pprice-${pack.id}`}
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={pack.price_cents > 0 ? (pack.price_cents / 100).toFixed(2) : ""}
                placeholder="0.00"
              />
            </div>
            <div className="w-20 shrink-0">
              <Input aria-label="Currency" name="currency" defaultValue={pack.currency} maxLength={3} className="uppercase" />
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor={`pprice-id-${pack.id}`}>Stripe price id</Label>
          <Input id={`pprice-id-${pack.id}`} name="stripe_price_id" defaultValue={pack.stripe_price_id ?? ""} placeholder="price_…" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`ptypes-${pack.id}`}>Space types (comma-separated keys)</Label>
          <Input
            id={`ptypes-${pack.id}`}
            name="space_types"
            defaultValue={pack.space_types.join(", ")}
            placeholder="course, jobs, business_directory"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="is_active" defaultChecked={pack.is_active} className="h-4 w-4" />
          Active
        </label>
        <SubmitButton className="w-auto" pendingText="Saving…">
          Save
        </SubmitButton>
      </div>

      {state && "error" in state && <p className="mt-2 text-sm text-danger">{state.error}</p>}
      {state && "ok" in state && <p className="mt-2 text-sm text-accent">Saved.</p>}
    </form>
  );
}
