import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Powers the platform-admin "System check" tab: a read-only health panel that
// reports whether each integration is wired up. It only ever exposes whether an
// env var is SET (a boolean) and a live database ping — never a secret value —
// so it's safe to render for a super admin without leaking keys.

export type CheckStatus = "ok" | "off" | "partial" | "error";

export type EnvVarStatus = {
  name: string;
  set: boolean;
  isPublic: boolean; // NEXT_PUBLIC_* — shipped to the browser, not a secret
  optional: boolean;
};

export type SystemCheckItem = {
  key: string;
  label: string;
  description: string; // what it powers / what breaks when it's off
  core: boolean; // required for the site to run at all
  status: CheckStatus;
  vars: EnvVarStatus[];
};

export type SystemCheckReport = {
  database: { ok: boolean; error: string | null };
  items: SystemCheckItem[];
  summary: {
    coreOk: boolean;
    coreTotal: number;
    coreConfigured: number;
    integrationsTotal: number;
    integrationsOn: number;
    issues: number; // core items not ok + database not ok
  };
};

type CheckDef = {
  key: string;
  label: string;
  description: string;
  core: boolean;
  required: string[];
  optional?: string[];
};

// Declarative catalogue of every integration and the env vars it needs. Kept in
// sync with the isXConfigured() helpers in src/lib/* and .env.local.example.
const CHECKS: CheckDef[] = [
  {
    key: "supabase",
    label: "Supabase (database & auth)",
    description: "The backend for every page — data, sign-in, and row-level security. The site cannot run without these.",
    core: true,
    required: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
  },
  {
    key: "service_role",
    label: "Supabase service role",
    description:
      "Server-only key that powers admin surfaces (this panel, member cleanup, branded signup emails). Missing it breaks platform-admin tooling.",
    core: true,
    required: ["SUPABASE_SERVICE_ROLE_KEY"],
  },
  {
    key: "site_url",
    label: "Site URL",
    description: "The platform's canonical origin. Used to build confirmation links, email sender addresses, and custom-domain forwarding.",
    core: true,
    required: ["NEXT_PUBLIC_SITE_URL"],
  },
  {
    key: "email",
    label: "Transactional email (Resend)",
    description:
      "Sends branded signup confirmations, invites, contact-form and notification emails. Off = those fall back to Supabase's default template or stay in-app only.",
    core: false,
    required: ["RESEND_API_KEY"],
    optional: ["INVITE_EMAIL_FROM", "NOTIFICATION_EMAIL_FROM", "CONTACT_EMAIL_TO", "CONTACT_EMAIL_FROM"],
  },
  {
    key: "notification_webhook",
    label: "Notification email/push webhook",
    description:
      "Shared secret authenticating the DB triggers that fan notifications out to email and web push. Off = notifications stay in the in-app bell only.",
    core: false,
    required: ["NOTIFICATION_EMAIL_WEBHOOK_SECRET"],
  },
  {
    key: "push",
    label: "Web push (VAPID)",
    description: "Browser/mobile push notifications. Off = push is disabled; email and the in-app bell are unaffected.",
    core: false,
    required: ["VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "NEXT_PUBLIC_VAPID_PUBLIC_KEY"],
    optional: ["VAPID_SUBJECT"],
  },
  {
    key: "turnstile",
    label: "Signup CAPTCHA (Cloudflare Turnstile)",
    description: "Blocks bot signups. Off = signup relies on the honeypot alone. Set both keys to enable the challenge.",
    core: false,
    required: ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY"],
  },
  {
    key: "stripe",
    label: "Payments (Stripe)",
    description: "Per-space paywalls, community plans, and feature packs. Off = no space can be priced and checkout is unavailable.",
    core: false,
    required: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
  },
  {
    key: "ai_anthropic",
    label: "AI features (Anthropic)",
    description:
      "Concierge search, AI event discovery, listing extraction, and plant/crop assistants. Off = those features hide or no-op.",
    core: false,
    required: ["ANTHROPIC_API_KEY"],
    optional: ["EVENT_DISCOVERY_MODEL"],
  },
  {
    key: "ai_openai",
    label: "AI image generation (OpenAI)",
    description: "Generates crop-guide images. Off = the image-generation button is hidden.",
    core: false,
    required: ["OPENAI_API_KEY"],
  },
  {
    key: "google_places",
    label: "Google Places",
    description: "Live Google ratings and review snippets in business map pins. Off = popups skip the Google section.",
    core: false,
    required: ["GOOGLE_PLACES_API_KEY"],
  },
  {
    key: "jitsi",
    label: "Live video (Jitsi / JaaS)",
    description:
      "Authenticated, unlimited Live Events rooms. Off = Live Events falls back to the free public meet.jit.si (5-minute demo cap).",
    core: false,
    required: ["JITSI_APP_ID", "JITSI_API_KEY_ID", "JITSI_PRIVATE_KEY"],
  },
  {
    key: "farm_bridge",
    label: "Farm bridge (shamba.online)",
    description: "Shows a member's own crops from the farm app inside Crop Guides spaces. Off = the 'My crops' panel hides.",
    core: false,
    required: ["FARM_API_URL", "FARM_API_SECRET"],
    optional: ["NEXT_PUBLIC_FARM_APP_URL"],
  },
  {
    key: "vercel_domains",
    label: "Custom-domain automation (Vercel)",
    description: "Auto-registers community custom domains with Vercel. Off = custom domains must be added to the project by hand.",
    core: false,
    required: ["VERCEL_TOKEN", "VERCEL_PROJECT_ID"],
    optional: ["VERCEL_TEAM_ID"],
  },
];

function isSet(name: string): boolean {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

function statusFor(requiredSet: boolean[], core: boolean): CheckStatus {
  const allRequired = requiredSet.every(Boolean);
  const anyRequired = requiredSet.some(Boolean);
  if (allRequired) return "ok";
  if (core) return "error"; // a required core var is missing
  return anyRequired ? "partial" : "off";
}

async function pingDatabase(): Promise<{ ok: boolean; error: string | null }> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("communities").select("id", { count: "exact", head: true });
    if (error) return { ok: false, error: error.message };
    return { ok: true, error: null };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not reach the database." };
  }
}

export async function getSystemCheck(): Promise<SystemCheckReport> {
  const database = await pingDatabase();

  const items: SystemCheckItem[] = CHECKS.map((def) => {
    const requiredVars: EnvVarStatus[] = def.required.map((name) => ({
      name,
      set: isSet(name),
      isPublic: name.startsWith("NEXT_PUBLIC_"),
      optional: false,
    }));
    const optionalVars: EnvVarStatus[] = (def.optional ?? []).map((name) => ({
      name,
      set: isSet(name),
      isPublic: name.startsWith("NEXT_PUBLIC_"),
      optional: true,
    }));
    return {
      key: def.key,
      label: def.label,
      description: def.description,
      core: def.core,
      status: statusFor(requiredVars.map((v) => v.set), def.core),
      vars: [...requiredVars, ...optionalVars],
    };
  });

  const core = items.filter((i) => i.core);
  const integrations = items.filter((i) => !i.core);
  const coreConfigured = core.filter((i) => i.status === "ok").length;
  const coreOk = coreConfigured === core.length && database.ok;

  return {
    database,
    items,
    summary: {
      coreOk,
      coreTotal: core.length,
      coreConfigured,
      integrationsTotal: integrations.length,
      integrationsOn: integrations.filter((i) => i.status === "ok" || i.status === "partial").length,
      issues: core.filter((i) => i.status !== "ok").length + (database.ok ? 0 : 1),
    },
  };
}
