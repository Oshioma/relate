"use client";

import { useActionState } from "react";
import { setComplimentaryPlan, type PlanFormState } from "../actions";
import { SubmitButton } from "@/components/ui/submit-button";

// Grant (or remove) a complimentary paid plan for one community — no Stripe
// involved. Rendered per community on the platform-admin communities page;
// only ever reachable by the super admin, and the server action re-verifies
// that anyway.
export function CompPlanControl({
  communityId,
  planStatus,
  planId,
  plans,
  hasLiveSubscription,
}: {
  communityId: string;
  planStatus: string;
  planId: string | null;
  plans: { id: string; name: string }[];
  hasLiveSubscription: boolean;
}) {
  const [state, action] = useActionState<PlanFormState, FormData>(setComplimentaryPlan, undefined);
  const comped = planStatus === "comped";
  const compedPlanName = comped ? plans.find((p) => p.id === planId)?.name ?? "a plan" : null;

  if (hasLiveSubscription) {
    return (
      <p className="text-xs text-muted-foreground">
        On a paid Stripe subscription — complimentary plans only apply to communities that aren&apos;t already paying.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-2">
      {comped ? (
        <div className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="community_id" value={communityId} />
          <input type="hidden" name="plan_id" value="" />
          <p className="text-xs text-muted-foreground">
            Complimentary <span className="font-medium text-foreground">{compedPlanName}</span> plan — no billing.
          </p>
          <SubmitButton variant="secondary" pendingText="Removing…" className="w-auto">
            Remove comp
          </SubmitButton>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="community_id" value={communityId} />
          <label htmlFor={`comp-plan-${communityId}`} className="text-xs text-muted-foreground">
            Complimentary plan
          </label>
          <select
            id={`comp-plan-${communityId}`}
            name="plan_id"
            defaultValue={plans[0]?.id ?? ""}
            className="rounded-md border border-border bg-card px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
          <SubmitButton variant="secondary" pendingText="Granting…" className="w-auto">
            Grant free of charge
          </SubmitButton>
        </div>
      )}
      {state && "error" in state && <p className="text-xs text-danger">{state.error}</p>}
    </form>
  );
}
