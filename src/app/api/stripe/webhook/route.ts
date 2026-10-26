import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { constructWebhookEvent, countPaidInvoices, setSubscriptionCancellation, type StripeCheckoutSession, type StripeEvent } from "@/lib/stripe";
import { instalmentStateFor, shouldStopCharging } from "@/lib/courses/instalments";
import { ensureActiveMembership, fulfilGuestCheckout } from "@/lib/guest-checkout";
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
      // A bank-debit course payment completes the checkout first and is paid
      // later; that later event carries the same session, now "paid".
      case "checkout.session.async_payment_succeeded":
      case "checkout.session.completed": {
        const session = event.data.object as {
          id?: string;
          mode?: string;
          payment_status?: string;
          subscription?: string;
          customer?: string;
          customer_details?: { email?: string };
          metadata?: Record<string, string>;
        };
        const meta = session.metadata ?? {};
        // A community plan checkout (platform billing) — distinguished from a
        // member's space subscription by carrying plan_id, not space_id.
        if (meta.guest === "1") {
          // A signed-out visitor who bought from a shareable checkout link: find
          // or make their account from the Checkout email, then record the
          // purchase. The return page does the same and signs them in.
          await fulfilGuestCheckout(admin, session as StripeCheckoutSession);
        } else if (meta.plan_id && meta.community_id) {
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
        } else if (meta.course_id && meta.user_id && session.mode === "payment") {
          // A one-off course purchase. Card payments arrive already "paid";
          // anything still pending is left for Stripe to retry or fail.
          if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
            await admin.from("course_enrollments").upsert(
              {
                course_id: meta.course_id,
                user_id: meta.user_id,
                paid: true,
                payment_plan: "one_off",
                stripe_checkout_session_id: session.id ?? null,
              },
              { onConflict: "course_id,user_id" }
            );
          }
        } else if (meta.course_id && meta.user_id && session.mode === "subscription" && session.subscription) {
          // A course paid in monthly instalments. The first payment has gone
          // through, so the course opens now; invoice.paid keeps the count.
          await recordCourseInstalments(admin, {
            courseId: meta.course_id,
            userId: meta.user_id,
            subscriptionId: session.subscription,
            total: Number(meta.instalments) || 0,
            stripeAccount: event.account,
            checkoutSessionId: session.id ?? null,
          });
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
          // Buying a plan makes you a member: the Membership page sells plans to
          // people who haven't joined yet (signed out, or from another website).
          await ensureActiveMembership(admin, meta.community_id, meta.user_id);
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
            .select("plan_status, plan_stripe_subscription_id")
            .eq("id", meta.community_id)
            .maybeSingle();

          // A complimentary plan ('comped', granted by the super admin) has no
          // subscription of its own, so any subscription event reaching a
          // comped row is a stale echo of an old, since-canceled subscription —
          // applying it would silently revoke the comp. A comped owner who
          // deliberately buys a real plan goes through Checkout, whose
          // checkout.session.completed above overwrites the comp with genuine
          // Stripe state; from then on events match the stored id again.
          if (before?.plan_status === "comped" && before.plan_stripe_subscription_id !== sub.id) {
            break;
          }

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
        } else if (meta.course_id && meta.user_id) {
          // A course instalment plan: open while paying (and while Stripe
          // retries a failed payment), locked if Stripe gives up before the
          // last instalment, the buyer's for good once every one is paid.
          const { data: row } = await admin
            .from("course_enrollments")
            .select("instalments_paid, instalments_total, payment_plan, stripe_subscription_id")
            .eq("course_id", meta.course_id)
            .eq("user_id", meta.user_id)
            .maybeSingle();
          const next = instalmentStateFor({
            stripeStatus: status,
            instalmentsPaid: row?.instalments_paid ?? 0,
            instalmentsTotal: row?.instalments_total ?? (Number(meta.instalments) || 0),
          });
          // Only the plan this subscription paid for: a buyer whose plan
          // lapsed and who then bought the course outright keeps it.
          const isThisPlan = row?.payment_plan === "instalments" && row.stripe_subscription_id === sub.id;
          if (next && isThisPlan) {
            await admin
              .from("course_enrollments")
              .update({ paid: next.paid, instalment_status: next.status })
              .eq("course_id", meta.course_id)
              .eq("user_id", meta.user_id);
          }
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

      // Each monthly instalment of a course. Ignored for every other kind of
      // subscription (they carry no course_id).
      case "invoice.paid": {
        const invoice = event.data.object as {
          subscription?: string | null;
          subscription_details?: { metadata?: Record<string, string> } | null;
          parent?: { subscription_details?: { subscription?: string; metadata?: Record<string, string> } | null } | null;
        };
        // Older API versions put the subscription on the invoice itself; newer
        // ones under parent.subscription_details.
        const subscriptionId = invoice.subscription ?? invoice.parent?.subscription_details?.subscription ?? null;
        const meta = invoice.subscription_details?.metadata ?? invoice.parent?.subscription_details?.metadata ?? {};
        if (subscriptionId && meta.course_id && meta.user_id) {
          await recordCourseInstalments(admin, {
            courseId: meta.course_id,
            userId: meta.user_id,
            subscriptionId,
            total: Number(meta.instalments) || 0,
            stripeAccount: event.account,
            checkoutSessionId: null,
          });
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

// Bring a buyer's instalment plan up to date: count the paid instalments (from
// Stripe, so repeated events never double-count), open the course, and once
// the last instalment is in, tell Stripe to stop at the end of that month so
// there's never an extra charge. Safe to run any number of times.
async function recordCourseInstalments(
  admin: ReturnType<typeof createAdminClient>,
  params: {
    courseId: string;
    userId: string;
    subscriptionId: string;
    total: number;
    stripeAccount?: string;
    checkoutSessionId: string | null;
  }
): Promise<void> {
  // Already bought outright (say, after an earlier plan lapsed): a late
  // instalment event mustn't turn that purchase back into a plan.
  const { data: existing } = await admin
    .from("course_enrollments")
    .select("paid, payment_plan")
    .eq("course_id", params.courseId)
    .eq("user_id", params.userId)
    .maybeSingle();
  if (existing?.paid && existing.payment_plan === "one_off") return;

  const paidCount = await countPaidInvoices({ stripeAccount: params.stripeAccount, subscriptionId: params.subscriptionId });
  if (paidCount === 0) return; // nothing has been paid yet

  const complete = shouldStopCharging(paidCount, params.total);
  if (complete && params.stripeAccount) {
    await setSubscriptionCancellation({
      stripeAccount: params.stripeAccount,
      subscriptionId: params.subscriptionId,
      cancelAtPeriodEnd: true,
    });
  }

  const { error } = await admin.from("course_enrollments").upsert(
    {
      course_id: params.courseId,
      user_id: params.userId,
      paid: true,
      payment_plan: "instalments",
      stripe_subscription_id: params.subscriptionId,
      instalments_paid: Math.min(paidCount, params.total || paidCount),
      instalments_total: params.total,
      instalment_status: complete ? "completed" : "active",
      ...(params.checkoutSessionId ? { stripe_checkout_session_id: params.checkoutSessionId } : {}),
    },
    { onConflict: "course_id,user_id" }
  );
  if (error) throw new Error(error.message);
}
