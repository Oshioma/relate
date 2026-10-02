// Recording what each community spends on AI, and enforcing the free monthly
// allowance. The rule itself is in ai-allowance.ts; this is the database side.
//
// Uses the service-role client throughout: the ai_spend ledger has RLS on and
// no policies, and the caller's own client may not be able to read the
// community owner's profile. Every caller has already authorised the person
// (authorizeLessonAuthor) before getting here.
//
// Fails CLOSED when it can't tell what has been spent — an unmetered paid call
// is the worse outcome — except for exempt and subscribed communities, which
// never need the ledger at all.

import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  allowanceVerdict,
  DEFAULT_EXEMPT_OWNERS,
  DEFAULT_FREE_MONTHLY_USD,
  monthStart,
  type AllowanceVerdict,
} from "@/lib/usage/ai-allowance";

function freeMonthlyUsd(): number {
  const raw = Number(process.env.AI_FREE_MONTHLY_USD);
  return Number.isFinite(raw) && raw >= 0 && process.env.AI_FREE_MONTHLY_USD?.trim()
    ? raw
    : DEFAULT_FREE_MONTHLY_USD;
}

function exemptOwners(): string[] {
  const raw = process.env.AI_SPEND_EXEMPT_OWNERS?.trim();
  return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : DEFAULT_EXEMPT_OWNERS;
}

export async function checkAiAllowance(
  communityId: string,
  // Null for a signed-out visitor (a public concierge or plant ID space).
  userId: string | null
): Promise<AllowanceVerdict> {
  const admin = createAdminClient();

  const [{ data: caller }, { data: community }] = await Promise.all([
    userId
      ? admin.from("profiles").select("is_super_admin").eq("id", userId).maybeSingle()
      : Promise.resolve({ data: null }),
    admin
      .from("communities")
      .select("plan_status, owner:owner_id (username, is_super_admin)")
      .eq("id", communityId)
      .maybeSingle(),
  ]);

  const owner = (community as unknown as {
    owner?: { username: string | null; is_super_admin: boolean | null } | null;
  } | null)?.owner;

  const base = {
    callerIsSuperAdmin: Boolean(caller?.is_super_admin),
    ownerUsername: owner?.username ?? null,
    ownerIsSuperAdmin: Boolean(owner?.is_super_admin),
    planStatus: (community as { plan_status?: string } | null)?.plan_status ?? null,
    freeMonthlyUsd: freeMonthlyUsd(),
    exemptOwners: exemptOwners(),
  };

  // Exempt or subscribed: no need to read the ledger.
  const unmetered = allowanceVerdict({ ...base, spentThisMonthUsd: 0, freeMonthlyUsd: 0 });
  if (unmetered.allowed && unmetered.unlimited) return unmetered;

  const { data: rows, error } = await admin
    .from("ai_spend")
    .select("amount_usd")
    .eq("community_id", communityId)
    .gte("created_at", monthStart().toISOString());

  if (error) {
    console.error("Could not read AI spend", error);
    return {
      allowed: false,
      message: "AI features aren't available right now — try again shortly.",
    };
  }

  const spent = (rows ?? []).reduce((sum, row) => sum + Number(row.amount_usd ?? 0), 0);
  return allowanceVerdict({ ...base, spentThisMonthUsd: spent });
}

// Records one paid call. Never throws: losing a ledger line must not cost a
// teacher their lesson. A duplicate ref (the same video job seen twice) is
// ignored rather than charged again.
export async function recordAiSpend(entry: {
  communityId: string;
  userId: string | null;
  // "lesson" and "video" for lessons; the other AI features use their own
  // names (see ai-meter.ts).
  kind: string;
  amountUsd: number;
  ref: string;
}): Promise<void> {
  if (!(entry.amountUsd > 0)) return;
  try {
    const { error } = await createAdminClient()
      .from("ai_spend")
      .upsert(
        {
          community_id: entry.communityId,
          user_id: entry.userId,
          kind: entry.kind,
          amount_usd: Number(entry.amountUsd.toFixed(6)),
          ref: entry.ref,
        },
        { onConflict: "ref", ignoreDuplicates: true }
      );
    if (error) console.error("Could not record AI spend", error);
  } catch (error) {
    console.error("Could not record AI spend", error);
  }
}
