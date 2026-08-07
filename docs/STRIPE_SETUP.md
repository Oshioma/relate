# Stripe setup

Relate has **two** money flows, and they share the same Stripe account, the same
two secrets, and the same webhook endpoint:

- **Flow B — you charge community owners.** Platform subscription plans + paid
  feature packs. Plain Stripe Billing. **No Connect needed.**
- **Flow A — owners charge their members.** The per-space paywall. Uses **Stripe
  Connect** so the money goes to the owner's own Stripe account.

You can set up Flow B first and add Flow A later. Do the two parts in order.

---

## Part 1 — Do now: sell plans & feature packs (Flow B)

1. **Create a Stripe account** at [stripe.com](https://stripe.com). Keep the
   **Test mode** toggle ON — test mode uses fake money.

2. **Get the secret key.** Developers → **API keys** → copy the **Secret key**
   (`sk_test_…`). This is `STRIPE_SECRET_KEY`.

3. **Add the webhook and get its signing secret.** Developers → **Webhooks** →
   **Add endpoint**.
   - **Endpoint URL:** `https://<your-site>/api/stripe/webhook`
   - **Events to send:**
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `account.updated`
   - Save, then copy the **Signing secret** (`whsec_…`). This is
     `STRIPE_WEBHOOK_SECRET`.

4. **Give the app both secrets.** Set them as environment variables (on Vercel:
   Project → Settings → Environment Variables), then redeploy. Never prefix them
   with `NEXT_PUBLIC_` and never commit them — they are server-only. See
   `.env.local.example`.

5. **Apply the database migrations** to your Supabase project (creates the
   plans, packs, and subscription tables).

6. **Create a Stripe Price for each paid plan/pack, and paste its id in.**
   - In Stripe: **Product catalog → Add product** → set it **Recurring /
     monthly** with the amount → **Save** → copy the **Price ID** (`price_…`).
   - In the app: **platform-admin** →
     - **Platform plans** → paste the `price_…` into each paid plan's *Stripe
       price id*.
     - **Feature packs** → same for each paid pack.
   - The **free** plan and **free** packs need no Stripe price — leave it blank.
   - The *Price / month* field in platform-admin is only the **display** number
     on the cards; the amount actually charged comes from the Stripe Price.

7. **Test with a fake card.** As a community owner: **Admin → Plan** → pick a
   plan → pay with test card `4242 4242 4242 4242`, any future expiry, any CVC.
   You should return to the admin page with the plan active.

At this point plans and feature packs work end to end.

---

## Part 2 — Do later: let owners charge their members (Flow A)

8. **Enable Connect.** Open
   [`https://dashboard.stripe.com/test/connect/overview`](https://dashboard.stripe.com/test/connect/overview)
   → **Get started** → choose **Platform**. Fill the short "about your platform"
   form if asked. (No new keys or webhook events — Part 1 already covers it.)

9. **Connect a community and price a space.** In a community: **Admin →
   Payments → Connect Stripe**, finish Stripe's onboarding, then set a monthly
   price on a **Members** or **Private** space (public spaces are always free).
   Test as a *different* member with card `4242 4242 4242 4242`.

---

## Going live (real money)

Switch Stripe to **Live mode** and redo the pieces that are mode-specific:

- New **live** secret key (`sk_live_…`) and a new **live** webhook signing
  secret (`whsec_…`) — update the environment variables.
- New **live** Prices (`price_…`) — re-paste them into platform-admin.

Test and live modes are completely separate on purpose.

---

## Quick reference

| Thing | Where it lives |
| --- | --- |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | environment variables (server-only) |
| Webhook endpoint | `/api/stripe/webhook` |
| Plan / pack Stripe Price ids | platform-admin → Plans / Feature packs |
| Per-space price | community Admin → Spaces → edit a space (needs a paid plan + Connect) |
| Test card | `4242 4242 4242 4242`, any future expiry, any CVC |
