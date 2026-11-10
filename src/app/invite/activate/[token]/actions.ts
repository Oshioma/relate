"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { activationStatus, tiersToGiveFree } from "@/lib/activations";

// The button on /invite/activate/<token>. Only a person pressing it (a POST)
// spends the link, never the GET a mail scanner makes, as on /auth/confirm.
//
// It switches on any free memberships the link carries, signs the member in
// (they were brought over with no password), marks the link used and sends
// them back to the page, which then asks them to choose a password.
export async function activateMembership(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  const back = `/invite/activate/${encodeURIComponent(token)}`;
  if (!token) redirect("/login");

  const admin = createAdminClient();
  const { data: row } = await admin.from("community_activations").select("*").eq("token", token).maybeSingle();
  if (!row || activationStatus(row) !== "ready") redirect(back);

  const { data: authUser } = await admin.auth.admin.getUserById(row.user_id);
  const email = authUser?.user?.email;
  if (!email) redirect(`${back}?problem=signin`);

  // Still a member? Someone removed since the email went out isn't put back.
  const { data: membership } = await admin
    .from("community_memberships")
    .select("status")
    .eq("community_id", row.community_id)
    .eq("user_id", row.user_id)
    .maybeSingle();
  if (!membership || membership.status !== "active") redirect(`${back}?problem=membership`);

  if (row.free_tier_ids.length > 0) {
    const { data: existing } = await admin
      .from("tier_subscriptions")
      .select("tier_id, status, stripe_subscription_id, current_period_end")
      .eq("user_id", row.user_id)
      .in("tier_id", row.free_tier_ids);
    const toGive = tiersToGiveFree(row.free_tier_ids, existing ?? []);
    if (toGive.length > 0) {
      // A free membership: active, no Stripe ids, no end date.
      const { error } = await admin.from("tier_subscriptions").upsert(
        toGive.map((tierId) => ({
          tier_id: tierId,
          community_id: row.community_id,
          user_id: row.user_id,
          status: "active",
          stripe_subscription_id: null,
          stripe_customer_id: null,
          current_period_end: null,
          cancel_at_period_end: false,
        })),
        { onConflict: "tier_id,user_id" }
      );
      if (error) {
        console.error("[activate] free tier grant failed:", error);
        redirect(`${back}?problem=tier`);
      }
    }
  }

  // Sign them in here and now: a fresh one-time token, spent straight away.
  const { data: link, error: linkError } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  const tokenHash = link?.properties?.hashed_token;
  let signedIn = false;
  if (!linkError && tokenHash) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: tokenHash });
    if (error) console.error("[activate] verifyOtp failed:", error);
    else signedIn = true;
  } else {
    console.error("[activate] generateLink failed:", linkError);
  }
  if (!signedIn) redirect(`${back}?problem=signin`);

  await admin.from("community_activations").update({ used_at: new Date().toISOString() }).eq("id", row.id).is("used_at", null);
  redirect(back);
}
