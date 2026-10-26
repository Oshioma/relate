// Paying for a course in monthly instalments (e.g. £40 a month for 4 months)
// alongside the one-off price (e.g. £144). Pure, so the course editor, the
// checkout action, the webhook and the tests all agree.
//
// How it runs: the buyer starts a monthly Stripe subscription; the course opens
// on the first payment. The webhook counts the paid invoices, and once the last
// instalment is in it tells Stripe to stop the subscription at the end of that
// month, so nobody is charged a fifth time. A plan that has paid every
// instalment is the buyer's for good, like a one-off purchase.

export const MAX_INSTALMENTS = 24;

export type InstalmentPlan = { count: number; priceCents: number };

// The course's plan, or null when it isn't offered. Both numbers must be set.
export function instalmentPlan(course: { instalment_count: number | null; instalment_price_cents: number | null }): InstalmentPlan | null {
  const count = course.instalment_count ?? 0;
  const priceCents = course.instalment_price_cents ?? 0;
  if (count < 2 || priceCents <= 0) return null;
  return { count, priceCents };
}

// Validate what the course editor sends. Returns cleaned numbers, or an error
// in the owner's words. Turning the plan off is 0/0.
export function cleanInstalmentInput(
  count: number,
  priceCents: number,
  oneOffCents: number
): { count: number; priceCents: number } | { error: string } {
  const n = Math.round(Number(count));
  const cents = Math.round(Number(priceCents));
  if (!n && !cents) return { count: 0, priceCents: 0 };
  if (!Number.isFinite(n) || n < 2 || n > MAX_INSTALMENTS) {
    return { error: `Pick between 2 and ${MAX_INSTALMENTS} monthly payments.` };
  }
  if (!Number.isFinite(cents) || cents <= 0) return { error: "Enter the amount of each monthly payment." };
  if (oneOffCents <= 0) return { error: "Set the one-off price first. The monthly plan is offered next to it." };
  return { count: n, priceCents: cents };
}

// Where a buyer's instalment plan stands, as stored on their enrolment.
export type InstalmentStatus = "active" | "past_due" | "completed" | "canceled";

// What to store when Stripe says something about an instalment subscription.
// `paid` is whether the course stays open to them.
//
// - Every instalment paid: completed, theirs for good, whatever Stripe says
//   afterwards (the subscription ending is the plan finishing, not a lapse).
// - Paying normally: open.
// - A payment failed and Stripe is retrying (past_due): still open while it
//   retries.
// - Stripe gave up (canceled / unpaid / incomplete_expired) before the last
//   instalment: locked, until they buy again or staff grant it.
// - Anything else (incomplete: the first payment hasn't gone through): no
//   change.
export function instalmentStateFor(input: {
  stripeStatus: string;
  instalmentsPaid: number;
  instalmentsTotal: number;
}): { status: InstalmentStatus; paid: boolean } | null {
  if (input.instalmentsTotal > 0 && input.instalmentsPaid >= input.instalmentsTotal) {
    return { status: "completed", paid: true };
  }
  switch (input.stripeStatus) {
    case "active":
    case "trialing":
      return { status: "active", paid: true };
    case "past_due":
      return { status: "past_due", paid: true };
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return { status: "canceled", paid: false };
    default:
      return null;
  }
}

// Has the buyer paid the last instalment, so the subscription must stop?
export function shouldStopCharging(instalmentsPaid: number, instalmentsTotal: number): boolean {
  return instalmentsTotal > 0 && instalmentsPaid >= instalmentsTotal;
}

// "£40 a month for 4 months" (and the total it comes to).
export function instalmentLabel(plan: InstalmentPlan, format: (cents: number) => string): string {
  return `${format(plan.priceCents)} a month for ${plan.count} months`;
}

export function instalmentTotalCents(plan: InstalmentPlan): number {
  return plan.count * plan.priceCents;
}
