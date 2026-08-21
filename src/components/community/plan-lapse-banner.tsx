import Link from "next/link";
import { AlertTriangle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PlanLapseNotice } from "@/lib/data/plan-limits";

// What a community's staff see when its plan stops paying. Shown only to
// owners and admins: it's their bill, and a member could do nothing about it.
//
// Two stages, because the honest message differs. During the grace window
// nothing has changed yet and the point is "you have time"; afterwards the
// point is what actually switched off — and, deliberately, what did NOT (the
// community, its members and everyone's existing subscriptions are all fine).
export function PlanLapseBanner({
  notice,
  communityName,
  communitySlug,
}: {
  notice: PlanLapseNotice;
  communityName: string;
  communitySlug: string;
}) {
  const planLabel = notice.planName ?? "paid plan";
  const paymentProblem = notice.status === "past_due" || notice.status === "unpaid";
  const href = `/pricing?community=${encodeURIComponent(communitySlug)}`;

  if (notice.stage === "grace") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 border-b border-border bg-accent-soft px-4 py-2.5 text-center text-sm text-accent">
        <Clock className="h-4 w-4 shrink-0" />
        <span>
          {paymentProblem
            ? `${communityName}'s last ${planLabel} payment didn't go through.`
            : `${communityName}'s ${planLabel} has ended.`}{" "}
          Everything keeps working
          {notice.graceUntil ? ` until ${formatDate(notice.graceUntil)}` : " for now"} — nothing has changed yet.
        </span>
        <Link href={href} className="font-medium underline">
          {paymentProblem ? "Update billing" : "Restart the plan"}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 border-b border-border bg-danger/10 px-4 py-2.5 text-center text-sm text-danger">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>
        {communityName} is on the Free plan — the {planLabel} ended. Paid spaces and memberships have stopped taking
        NEW subscribers, and new members are capped. Everyone already here, and everyone already subscribed, is
        unaffected.
      </span>
      <Link href={href} className="font-medium underline">
        Choose a plan
      </Link>
    </div>
  );
}
