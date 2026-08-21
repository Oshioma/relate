import type { SupabaseClient } from "@supabase/supabase-js";
import type { Community, Database } from "@/types/database";

type Client = SupabaseClient<Database>;

// The plan gates, read from the app. All of them resolve through
// community_effective_plan_id() in the database (see the plan grace migration),
// which is the single answer to "which plan is this community actually on right
// now" — its paid plan while live, still its paid plan through the grace window
// after a lapse, otherwise free.

// Whether this community may take money from members right now. False stops
// NEW charging — setting a price, and (since this is checked at checkout too)
// new member subscriptions. Existing subscriptions are never touched: people
// who already pay keep their access and keep renewing.
export async function communityCanCharge(supabase: Client, communityId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("community_can_charge", { p_community_id: communityId });
  if (error) {
    // Fail closed on charging: a gate that errors open would let a lapsed
    // community keep selling.
    console.error("[plan-limits] community_can_charge failed:", error);
    return false;
  }
  return Boolean(data);
}

export type PlanCapacity = {
  // Null means unlimited — an absent limits key has always meant no cap.
  memberLimit: number | null;
  memberCount: number;
  adminLimit: number | null;
  // Owner + admins. Moderators aren't admins and don't consume a seat.
  adminCount: number;
};

export function memberSeatsLeft(capacity: PlanCapacity): number | null {
  return capacity.memberLimit === null ? null : Math.max(0, capacity.memberLimit - capacity.memberCount);
}

export function adminSeatsLeft(capacity: PlanCapacity): number | null {
  return capacity.adminLimit === null ? null : Math.max(0, capacity.adminLimit - capacity.adminCount);
}

// Current usage against the plan's caps, for the admin UI and for the friendly
// pre-checks in the join/role actions. The database trigger is what actually
// enforces this — these numbers only exist so a person sees a sentence instead
// of a raised exception.
export async function getPlanCapacity(supabase: Client, communityId: string): Promise<PlanCapacity> {
  const [memberLimit, adminLimit, members, admins] = await Promise.all([
    supabase.rpc("community_plan_limit", { p_community_id: communityId, p_key: "members" }),
    supabase.rpc("community_plan_limit", { p_community_id: communityId, p_key: "admins" }),
    supabase
      .from("community_memberships")
      .select("id", { count: "exact", head: true })
      .eq("community_id", communityId)
      .eq("status", "active"),
    supabase
      .from("community_memberships")
      .select("id", { count: "exact", head: true })
      .eq("community_id", communityId)
      .eq("status", "active")
      .in("role", ["owner", "admin"]),
  ]);

  return {
    memberLimit: typeof memberLimit.data === "number" ? memberLimit.data : null,
    memberCount: members.count ?? 0,
    adminLimit: typeof adminLimit.data === "number" ? adminLimit.data : null,
    adminCount: admins.count ?? 0,
  };
}

// --- Lapse notice ------------------------------------------------------------

export type PlanLapseNotice = {
  // 'grace'   — the plan lapsed but everything still works, until `graceUntil`.
  // 'lapsed'  — the grace window has passed; the community is on free now.
  stage: "grace" | "lapsed";
  status: string;
  graceUntil: string | null;
  planName: string | null;
};

type PlanFields = Pick<Community, "id" | "plan_id" | "plan_status" | "plan_current_period_end">;

function planIsLive(status: string): boolean {
  return status === "active" || status === "trialing";
}

// What to tell an owner about a plan that stopped paying. Null when there is
// nothing to say — no plan was ever bought, or the current one is live.
//
// Only worth calling for staff: it's their bill, and a member seeing it could
// do nothing about it.
export async function getPlanLapseNotice(
  supabase: Client,
  community: PlanFields
): Promise<PlanLapseNotice | null> {
  if (!community.plan_id || planIsLive(community.plan_status)) return null;

  const [{ data: graceUntil }, { data: plan }] = await Promise.all([
    supabase.rpc("community_plan_grace_until", { p_community_id: community.id }),
    supabase.from("platform_plans").select("name").eq("id", community.plan_id).maybeSingle(),
  ]);

  const graceEnds = typeof graceUntil === "string" ? graceUntil : null;
  const inGrace = graceEnds !== null && new Date(graceEnds) > new Date();

  return {
    stage: inGrace ? "grace" : "lapsed",
    status: community.plan_status,
    graceUntil: graceEnds,
    planName: plan?.name ?? null,
  };
}

// The database raises these from the community_memberships trigger. The message
// is already written for a person to read, so the marker is only there to tell
// a cap from an unrelated failure.
const PLAN_LIMIT_MARKER = "plan_limit:";

export function isPlanLimitError(error: { message?: string } | null | undefined): boolean {
  return Boolean(error?.message?.includes(PLAN_LIMIT_MARKER));
}

export function planLimitMessage(error: { message?: string } | null | undefined): string | null {
  if (!isPlanLimitError(error)) return null;
  const message = error!.message!;
  const text = message.slice(message.indexOf(PLAN_LIMIT_MARKER) + PLAN_LIMIT_MARKER.length).trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}
