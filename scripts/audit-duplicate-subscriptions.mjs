#!/usr/bin/env node
//
// Find communities billed more than once for a platform plan.
//
// WHY THIS EXISTS
// Until the plan-change fix, "Switch to this plan" opened a fresh Stripe
// Checkout instead of moving the existing subscription. Stripe happily started
// a SECOND subscription on the same customer; the webhook then overwrote the
// community's plan_stripe_subscription_id to point at the new one, leaving the
// old subscription running, still charging, and invisible to the app. Anyone
// who changed plan before that fix is likely paying twice.
//
// This lists every customer holding more than one live platform subscription,
// says which one the app currently believes in, and totals the overcharge. It
// changes nothing by default.
//
// USAGE
//   STRIPE_SECRET_KEY=sk_... node scripts/audit-duplicate-subscriptions.mjs
//
//   # …and, once you've read the report and decided:
//   STRIPE_SECRET_KEY=sk_... node scripts/audit-duplicate-subscriptions.mjs --cancel-orphans
//
// --cancel-orphans cancels only subscriptions that are NOT the one the app is
// using, and only for customers where the app's own subscription is live. It
// cancels immediately (not at period end): the customer is already paying for
// the plan they actually have, so an extra paid period is the overcharge, not
// something to preserve. Refunds are deliberately NOT automated — decide those
// per customer, then issue them from the Stripe dashboard.
//
// Optionally set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to name each
// community; without them the report is keyed by Stripe customer id alone.

const KEY = process.env.STRIPE_SECRET_KEY;
if (!KEY) {
  console.error("STRIPE_SECRET_KEY is not set.");
  process.exit(1);
}
const CANCEL = process.argv.includes("--cancel-orphans");

// Overridable so the script can be exercised against a stub. Leave unset for
// the real API.
const API_BASE = process.env.STRIPE_API_BASE ?? "https://api.stripe.com/v1";

async function stripe(path, { method = "GET", body } = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${KEY}`,
      "Stripe-Version": "2024-06-20",
      ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || `Stripe ${res.status} on ${path}`);
  return json;
}

// Every subscription on the PLATFORM account. Member subscriptions live on the
// communities' own connected accounts and are never touched here.
async function allSubscriptions() {
  const out = [];
  let startingAfter = null;
  for (let page = 0; page < 200; page++) {
    const qs = new URLSearchParams({ limit: "100", status: "all" });
    if (startingAfter) qs.set("starting_after", startingAfter);
    const { data, has_more } = await stripe(`/subscriptions?${qs}`);
    out.push(...data);
    if (!has_more || data.length === 0) break;
    startingAfter = data[data.length - 1].id;
  }
  return out;
}

// What the app believes: community -> the one subscription id it recorded.
async function communitiesByCustomer() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const res = await fetch(
    `${url}/rest/v1/communities?select=name,slug,plan_status,plan_stripe_customer_id,plan_stripe_subscription_id&plan_stripe_customer_id=not.is.null`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) {
    console.warn(`! Couldn't read communities (${res.status}); reporting by Stripe customer only.\n`);
    return null;
  }
  const rows = await res.json();
  return new Map(rows.map((r) => [r.plan_stripe_customer_id, r]));
}

const LIVE = new Set(["active", "trialing", "past_due", "unpaid"]);

function money(cents, currency) {
  return `${(cents / 100).toFixed(2)} ${String(currency).toUpperCase()}`;
}

const subscriptions = await allSubscriptions();
const byCustomer = new Map();
for (const sub of subscriptions) {
  if (!LIVE.has(sub.status)) continue;
  const customer = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  if (!customer) continue;
  if (!byCustomer.has(customer)) byCustomer.set(customer, []);
  byCustomer.get(customer).push(sub);
}

const communities = await communitiesByCustomer();
const duplicates = [...byCustomer.entries()].filter(([, subs]) => subs.length > 1);

console.log(`Live platform subscriptions: ${[...byCustomer.values()].flat().length}`);
console.log(`Customers with more than one: ${duplicates.length}\n`);

if (duplicates.length === 0) {
  console.log("No duplicates. Nothing to do.");
  process.exit(0);
}

let overchargeByCurrency = {};
const toCancel = [];

for (const [customer, subs] of duplicates) {
  const community = communities?.get(customer);
  const known = community?.plan_stripe_subscription_id ?? null;
  console.log(`${community ? `${community.name} (/c/${community.slug})` : "(unknown community)"} — ${customer}`);
  if (community) console.log(`  app thinks: ${known ?? "none"} · plan_status ${community.plan_status}`);

  // Newest first, so "the one they meant to be on" reads first.
  subs.sort((a, b) => b.created - a.created);
  for (const sub of subs) {
    const item = sub.items?.data?.[0];
    const amount = item?.price?.unit_amount ?? 0;
    const currency = item?.price?.currency ?? "gbp";
    const isKnown = sub.id === known;
    const started = new Date(sub.created * 1000).toISOString().slice(0, 10);
    // Without a subscription recorded on the community there is no way to tell
    // which one is wanted, so don't call any of them an orphan.
    const label = !known ? "  UNSURE" : isKnown ? "→ IN USE" : "  ORPHAN";
    console.log(
      `   ${label} ${sub.id}  ${sub.status.padEnd(8)} ${money(amount, currency)}/${item?.price?.recurring?.interval ?? "mo"}  since ${started}  ${item?.price?.id ?? ""}`
    );
    if (!isKnown && known) {
      overchargeByCurrency[currency] = (overchargeByCurrency[currency] ?? 0) + amount;
      toCancel.push({ sub, customer, community });
    }
  }
  if (!known) {
    console.log("   ! The app has no subscription recorded for this customer — resolve by hand, not with --cancel-orphans.");
  }
  console.log("");
}

console.log("Recurring overcharge across all duplicates:");
for (const [currency, cents] of Object.entries(overchargeByCurrency)) {
  console.log(`  ${money(cents, currency)} per period`);
}

// Structured as one branch rather than an early process.exit() followed by the
// cancel loop: this script ends subscriptions, so there must be no arrangement
// of control flow in which a read-only run reaches the cancelling code.
if (CANCEL) {
  console.log(`\nCancelling ${toCancel.length} orphan subscription(s)…`);
  for (const { sub, community } of toCancel) {
    try {
      await stripe(`/subscriptions/${sub.id}`, { method: "DELETE" });
      console.log(`  cancelled ${sub.id}${community ? ` (${community.slug})` : ""}`);
    } catch (err) {
      console.error(`  FAILED ${sub.id}: ${err.message}`);
    }
  }
  console.log("\nDone. Check the Stripe dashboard for refunds owed on the periods already charged.");
} else {
  console.log(`\nNothing was changed. Re-run with --cancel-orphans to cancel the ${toCancel.length} ORPHAN subscription(s) above.`);
  console.log("Refunds are not automated — decide those per customer and issue them from the Stripe dashboard.");
}
