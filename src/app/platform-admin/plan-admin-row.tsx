"use client";

import { useActionState } from "react";
import { savePlatformPlan, type PlanFormState } from "./actions";
import { Input, Label } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { PlatformPlan } from "@/types/database";
import { unenforcedPlanFeatures } from "@/lib/features";

// One editable plan row for the platform super admin. The Stripe price id is the
// field that must be filled from the operator's Stripe dashboard before owners
// can subscribe to a paid plan.
export function PlanAdminRow({ plan }: { plan: PlatformPlan }) {
  // Feature keys on this plan that nothing actually checks — see
  // PLAN_FEATURE_ENFORCEMENT. Surfaced here rather than silently sold.
  const unenforced = unenforcedPlanFeatures(plan.features);
  const [state, action] = useActionState<PlanFormState, FormData>(savePlatformPlan, undefined);

  return (
    <form action={action} className="rounded-lg border border-border p-4">
      <input type="hidden" name="plan_id" value={plan.id} />

      <div className="mb-3 flex items-center gap-2">
        <p className="text-sm font-semibold text-foreground">{plan.name}</p>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">{plan.slug}</span>
        {!plan.stripe_price_id && plan.price_cents > 0 && (
          <span className="rounded bg-danger/10 px-1.5 py-0.5 text-[11px] text-danger">no Stripe price</span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`name-${plan.id}`}>Name</Label>
          <Input id={`name-${plan.id}`} name="name" defaultValue={plan.name} required />
        </div>
        <div>
          <Label htmlFor={`desc-${plan.id}`}>Description</Label>
          <Input id={`desc-${plan.id}`} name="description" defaultValue={plan.description ?? ""} />
        </div>
        <div>
          <Label htmlFor={`price-${plan.id}`}>Price / month</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id={`price-${plan.id}`}
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={plan.price_cents > 0 ? (plan.price_cents / 100).toFixed(2) : ""}
                placeholder="0.00"
              />
            </div>
            <div className="w-20 shrink-0">
              <Input aria-label="Currency" name="currency" defaultValue={plan.currency} maxLength={3} className="uppercase" />
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor={`price-id-${plan.id}`}>Stripe price id</Label>
          <Input id={`price-id-${plan.id}`} name="stripe_price_id" defaultValue={plan.stripe_price_id ?? ""} placeholder="price_…" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor={`features-${plan.id}`}>Features (comma-separated keys)</Label>
          <Input
            id={`features-${plan.id}`}
            name="features"
            defaultValue={plan.features.join(", ")}
            placeholder="paid_memberships, unlimited_members, white_label"
          />
          {unenforced.length > 0 && (
            <p className="mt-1.5 text-xs text-danger">
              Not enforced anywhere in the product yet: <span className="font-mono">{unenforced.join(", ")}</span>. The
              pricing page still advertises {unenforced.length === 1 ? "it" : "them"} to anyone reading this plan —
              either build the gate or drop the key.
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" name="is_active" defaultChecked={plan.is_active} className="h-4 w-4" />
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
