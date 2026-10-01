// The free monthly AI allowance: who has one, and whether they've used it.
//
// Pure on purpose, so the rule can be tested without a database. The server
// side (reading the ledger, the community and the caller) is in ai-spend.ts.
//
// The rule:
//   - a platform super admin is never limited, in any community;
//   - nor is a community owned by one of the exempt owners (the platform
//     owner's own communities);
//   - nor is a community on a paid, trialing or comped plan;
//   - everyone else gets AI_FREE_MONTHLY_USD (default $5) per calendar month,
//     UTC, and is stopped once that has been spent.
//
// Checked BEFORE a call, against what is already spent, so the call that
// crosses the line is allowed to finish — a lesson cut off halfway would cost
// the money and deliver nothing.

export const DEFAULT_FREE_MONTHLY_USD = 5;
export const DEFAULT_EXEMPT_OWNERS = ["osh", "skool"];
export const UNLIMITED_PLAN_STATUSES = ["active", "trialing", "comped"];

export type AllowanceInput = {
  callerIsSuperAdmin: boolean;
  ownerUsername: string | null;
  ownerIsSuperAdmin: boolean;
  planStatus: string | null;
  spentThisMonthUsd: number;
  freeMonthlyUsd: number;
  exemptOwners: string[];
};

export type AllowanceVerdict =
  | { allowed: true; unlimited: true }
  | { allowed: true; unlimited: false; remainingUsd: number }
  | { allowed: false; message: string };

export function allowanceVerdict(input: AllowanceInput, now: Date = new Date()): AllowanceVerdict {
  const owner = input.ownerUsername?.trim().toLowerCase() ?? "";
  if (
    input.callerIsSuperAdmin ||
    input.ownerIsSuperAdmin ||
    (owner && input.exemptOwners.map((o) => o.trim().toLowerCase()).includes(owner)) ||
    UNLIMITED_PLAN_STATUSES.includes(input.planStatus ?? "")
  ) {
    return { allowed: true, unlimited: true };
  }

  const remaining = input.freeMonthlyUsd - input.spentThisMonthUsd;
  if (remaining > 0) return { allowed: true, unlimited: false, remainingUsd: remaining };

  const resets = nextMonthStart(now).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  return {
    allowed: false,
    message:
      `This community has used its free $${formatDollars(input.freeMonthlyUsd)} of AI for this month. ` +
      `Subscribe to a plan to keep going, or wait until ${resets} when it resets.`,
  };
}

export function monthStart(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export function nextMonthStart(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
}

function formatDollars(amount: number): string {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
}
