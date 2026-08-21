import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { constructWebhookEvent, type StripeEvent } from "@/lib/stripe";
import { isResendConfigured, sendPlanLapsedEmail } from "@/lib/email";

// Stripe webhook target for the space paywall. Stripe posts subscription and
// Connect-account lifecycle events here; we verify the signature and reconcile
// our tables using the service-role client (bypassing RLS — members never
// write space_subscriptions themselves).
//
// Point a Stripe webhook endpoint at /api/stripe/webhook and set
// STRIPE_WEBHOOK_SECRET. The middleware exempts /api from its auth redirect,
// and this route reads the raw body itself so the signature check works.

// Read the raw text body for signature verification — never parse-then-restringify.
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: true, skipped: "stripe-webhook-not-configured" });
  }

  const payload = await request.text();
  let event: StripeEvent;
  try {
    event = constructWebhookEvent(payload, request.headers.get("stripe-signature"), secret);
  } catch (err) {
    return NextResponse.json({ error: `signature check failed: ${(err as Error).message}` }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as {
          subscription?: string;
          customer?: string;
          customer_details?: { email?: string };
          metadata?: Record<string, string>;
        };
        const meta = session.metadata ?? {};
        // A community plan checkout (platform billing) — distinguished from a
        // member's space subscription by carrying plan_id, not space_id.
        if (meta.plan_id && meta.community_id) {
          await admin
            .from("communities")
            .update({
              plan_id: meta.plan_id,
              plan_status: "active",
              plan_stripe_customer_id: session.customer ?? null,
              plan_stripe_subscription_id: session.subscription ?? null,
            })
            .eq("id", meta.community_id);
        } else if (meta.pack_id && meta.community_id && session.subscription) {
          // A feature-marketplace pack purchase.
          await admin.from("community_feature_addons").upsert(
            {
              community_id: meta.community_id,
              pack_id: meta.pack_id,
              status: "active",
              stripe_subscription_id: session.subscription,
              stripe_customer_id: session.customer ?? null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "community_id,pack_id" }
          );
        } else if (meta.space_id && meta.user_id && meta.community_id && session.subscription) {
          await admin.from("space_subscriptions").upsert(
            {
              space_id: meta.space_id,
              user_id: meta.user_id,
              community_id: meta.community_id,
              stripe_subscription_id: session.subscription,
              stripe_customer_id: session.customer ?? null,
              status: "active",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "space_id,user_id" }
          );
        } else if (meta.tier_id && meta.user_id && meta.community_id && session.subscription) {
          // A membership-tier subscription — unlocks the tier's spaces.
          await admin.from("tier_subscriptions").upsert(
            {
              tier_id: meta.tier_id,
              user_id: meta.user_id,
              community_id: meta.community_id,
              stripe_subscription_id: session.subscription,
              stripe_customer_id: session.customer ?? null,
              status: "active",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "tier_id,user_id" }
          );
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created":
      case "customer.subscription.deleted": {
        const sub = event.data.object as {
          id: string;
          status: string;
          customer?: string;
          current_period_end?: number;
          cancel_at_period_end?: boolean;
          metadata?: Record<string, string>;
        };
        const meta = sub.metadata ?? {};
        const status = event.type === "customer.subscription.deleted" ? "canceled" : sub.status;
        const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;
        const cancelAtPeriodEnd = Boolean(sub.cancel_at_period_end);

        if (meta.plan_id && meta.community_id) {
          // A community plan subscription (platform billing). On cancel we keep
          // plan_id for the record but flip status to 'canceled' — the
          // community_can_charge gate reads status, so this is the soft
          // downgrade. Match by subscription id when metadata is thin.
          //
          // Read the previous status first: the owner is emailed when a plan
          // STOPS paying, and Stripe sends several events for the same state
          // (past_due retries in particular), so only the transition counts.
          const { data: before } = await admin
            .from("communities")
            .select("plan_status")
            .eq("id", meta.community_id)
            .maybeSingle();

          await admin
            .from("communities")
            .update({
              plan_id: meta.plan_id,
              plan_status: status,
              plan_current_period_end: periodEnd,
              plan_stripe_subscription_id: sub.id,
              plan_stripe_customer_id: sub.customer ?? null,
            })
            .eq("id", meta.community_id);

          if (isLapsed(status) && !isLapsed(before?.plan_status ?? "")) {
            await notifyPlanLapsed(admin, meta.community_id, meta.plan_id, status, periodEnd);
          }
        } else if (meta.pack_id && meta.community_id) {
          await admin.from("community_feature_addons").upsert(
            {
              community_id: meta.community_id,
              pack_id: meta.pack_id,
              status,
              stripe_subscription_id: sub.id,
              stripe_customer_id: sub.customer ?? null,
              current_period_end: periodEnd,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "community_id,pack_id" }
          );
        } else if (meta.space_id && meta.user_id && meta.community_id) {
          await admin.from("space_subscriptions").upsert(
            {
              space_id: meta.space_id,
              user_id: meta.user_id,
              community_id: meta.community_id,
              stripe_subscription_id: sub.id,
              stripe_customer_id: sub.customer ?? null,
              status,
              current_period_end: periodEnd,
              cancel_at_period_end: cancelAtPeriodEnd,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "space_id,user_id" }
          );
        } else if (meta.tier_id && meta.user_id && meta.community_id) {
          await admin.from("tier_subscriptions").upsert(
            {
              tier_id: meta.tier_id,
              user_id: meta.user_id,
              community_id: meta.community_id,
              stripe_subscription_id: sub.id,
              stripe_customer_id: sub.customer ?? null,
              status,
              current_period_end: periodEnd,
              cancel_at_period_end: cancelAtPeriodEnd,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "tier_id,user_id" }
          );
        } else {
          // No metadata (older subscription): fall back to matching the row by
          // its Stripe subscription id, in whichever table holds it (the update
          // is a no-op on the table that doesn't).
          const patch = { status, current_period_end: periodEnd, cancel_at_period_end: cancelAtPeriodEnd, updated_at: new Date().toISOString() };
          await admin.from("space_subscriptions").update(patch).eq("stripe_subscription_id", sub.id);
          await admin.from("tier_subscriptions").update(patch).eq("stripe_subscription_id", sub.id);
        }
        break;
      }

      case "account.updated": {
        const account = event.data.object as { id: string; charges_enabled?: boolean };
        await admin
          .from("communities")
          .update({ stripe_charges_enabled: Boolean(account.charges_enabled) })
          .eq("stripe_account_id", account.id);
        break;
      }

      default:
        // Unhandled event types are acknowledged so Stripe doesn't retry them.
        break;
    }
  } catch (err) {
    console.warn("[stripe/webhook] handler error:", (err as Error).message);
    return NextResponse.json({ error: "handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// Subscription states that mean the plan has stopped paying — a failed card
// mid-dunning, or an ended subscription. Each one starts the grace window.
function isLapsed(status: string): boolean {
  return status === "past_due" || status === "unpaid" || status === "canceled";
}

// Email the owner that their plan lapsed, while the grace window still gives
// them time to fix it. Best-effort in every direction: a missing Resend key, a
// deleted owner, an unreachable Stripe — none of it may fail the webhook, or
// Stripe retries an event we already applied.
async function notifyPlanLapsed(
  admin: ReturnType<typeof createAdminClient>,
  communityId: string,
  planId: string,
  status: string,
  periodEnd: string | null
): Promise<void> {
  if (!isResendConfigured()) return;

  try {
    const [{ data: community }, { data: plan }, { data: graceUntil }] = await Promise.all([
      admin.from("communities").select("name, slug, logo_url, owner_id").eq("id", communityId).maybeSingle(),
      admin.from("platform_plans").select("name").eq("id", planId).maybeSingle(),
      admin.rpc("community_plan_grace_until", { p_community_id: communityId }),
    ]);
    if (!community?.owner_id) return;

    // The owner's address lives in auth.users, not profiles.
    const { data: owner } = await admin.auth.admin.getUserById(community.owner_id);
    const email = owner?.user?.email;
    if (!email) return;

    // The grace deadline the banner shows, in the same words.
    const graceValue = typeof graceUntil === "string" ? graceUntil : periodEnd;
    const graceUntilLabel = graceValue
      ? new Date(graceValue).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : null;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const sent = await sendPlanLapsedEmail({
      to: email,
      communityName: community.name,
      communityLogoUrl: community.logo_url,
      planName: plan?.name ?? "paid",
      reason: status === "canceled" ? "canceled" : "payment_failed",
      graceUntilLabel,
      manageUrl: `${siteUrl}/pricing?community=${encodeURIComponent(community.slug)}`,
    });
    if (!sent.ok) {
      console.error("[stripe/webhook] plan-lapsed email failed:", sent.reason);
    }
  } catch (err) {
    console.error("[stripe/webhook] plan-lapsed notification failed:", (err as Error).message);
  }
}
