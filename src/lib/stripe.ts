import "server-only";
import crypto from "node:crypto";

// A tiny, dependency-free Stripe client. We talk to the REST API directly with
// fetch rather than pulling in the `stripe` SDK: it keeps the dependency
// surface (and bundle) small, and the handful of calls the paywall needs —
// Connect account onboarding, a subscription Checkout session, and webhook
// signature verification — are a thin wrapper each. All of this is server-only;
// STRIPE_SECRET_KEY must never reach the browser.

const STRIPE_API = "https://api.stripe.com/v1";
const STRIPE_API_VERSION = "2024-06-20";

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function secretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  return key;
}

// Stripe expects application/x-www-form-urlencoded with PHP-style brackets for
// nested objects and arrays, e.g. line_items[0][price_data][unit_amount]=1000.
function encodeForm(value: unknown, prefix = "", out: string[] = []): string[] {
  if (value === undefined || value === null) return out;
  if (Array.isArray(value)) {
    value.forEach((item, i) => encodeForm(item, `${prefix}[${i}]`, out));
  } else if (typeof value === "object") {
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      encodeForm(v, prefix ? `${prefix}[${key}]` : key, out);
    }
  } else {
    out.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(String(value))}`);
  }
  return out;
}

type StripeRequest = {
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
  // The connected account to act on behalf of (Connect direct charges / reads).
  stripeAccount?: string;
  idempotencyKey?: string;
};

async function stripeFetch<T = Record<string, unknown>>(path: string, opts: StripeRequest = {}): Promise<T> {
  const { method = "POST", body, stripeAccount, idempotencyKey } = opts;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${secretKey()}`,
    "Stripe-Version": STRIPE_API_VERSION,
  };
  if (stripeAccount) headers["Stripe-Account"] = stripeAccount;
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  let url = `${STRIPE_API}${path}`;
  let payload: string | undefined;
  if (method === "GET") {
    const qs = body ? encodeForm(body).join("&") : "";
    if (qs) url += `?${qs}`;
  } else {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    payload = body ? encodeForm(body).join("&") : "";
  }

  const res = await fetch(url, { method, headers, body: payload });
  const json = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) {
    throw new Error(json?.error?.message || `Stripe request failed (${res.status})`);
  }
  return json;
}

// --- Connect Express onboarding ---------------------------------------------
export type StripeAccount = { id: string; charges_enabled?: boolean; details_submitted?: boolean };

export function createConnectAccount(): Promise<StripeAccount> {
  return stripeFetch<StripeAccount>("/accounts", {
    body: {
      type: "express",
      capabilities: { transfers: { requested: true }, card_payments: { requested: true } },
    },
  });
}

export function createAccountLink(params: { account: string; refreshUrl: string; returnUrl: string }): Promise<{ url: string }> {
  return stripeFetch<{ url: string }>("/account_links", {
    body: {
      account: params.account,
      refresh_url: params.refreshUrl,
      return_url: params.returnUrl,
      type: "account_onboarding",
    },
  });
}

export function retrieveAccount(account: string): Promise<StripeAccount> {
  return stripeFetch<StripeAccount>(`/accounts/${account}`, { method: "GET" });
}

// --- Member checkout (subscription, direct charge on the connected account) --
export function createSpaceCheckoutSession(params: {
  stripeAccount: string;
  priceCents: number;
  currency: string;
  productName: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata: { space_id: string; user_id: string; community_id: string };
}): Promise<{ id: string; url: string }> {
  return stripeFetch<{ id: string; url: string }>("/checkout/sessions", {
    stripeAccount: params.stripeAccount,
    body: {
      mode: "subscription",
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      ...(params.customerEmail ? { customer_email: params.customerEmail } : {}),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: params.currency,
            unit_amount: params.priceCents,
            recurring: { interval: "month" },
            product_data: { name: params.productName },
          },
        },
      ],
      // Metadata on both the session and the subscription so every later
      // customer.subscription.* event can be traced back to (space, member).
      metadata: params.metadata,
      subscription_data: { metadata: params.metadata },
    },
  });
}

// --- Webhook signature verification -----------------------------------------
// Mirrors Stripe's constructEvent: recompute the HMAC over `${t}.${payload}`
// and constant-time compare it to the v1 signature in the Stripe-Signature
// header. Returns the parsed event, or throws if the signature doesn't match.
export type StripeEvent = {
  id: string;
  type: string;
  account?: string;
  data: { object: Record<string, unknown> };
};

export function constructWebhookEvent(payload: string, sigHeader: string | null, secret: string, toleranceSeconds = 300): StripeEvent {
  if (!sigHeader) throw new Error("Missing Stripe-Signature header");

  const parts = Object.fromEntries(
    sigHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k, v] as const;
    })
  );
  const timestamp = parts["t"];
  const signature = parts["v1"];
  if (!timestamp || !signature) throw new Error("Malformed Stripe-Signature header");

  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error("Signature verification failed");
  }

  const age = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (Number.isFinite(age) && age > toleranceSeconds) {
    throw new Error("Timestamp outside the tolerance zone");
  }

  return JSON.parse(payload) as StripeEvent;
}
