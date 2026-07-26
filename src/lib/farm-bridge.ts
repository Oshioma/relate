import "server-only";

// Read-only bridge to the shamba.online farm app.
//
// relate and the farm app are separate Supabase projects with separate logins,
// so relate does NOT hold the farm database's keys. Instead it calls a small
// read-only endpoint the farm app exposes, matched by the signed-in user's
// email, and renders the result. The farm app stays the single source of truth
// for a user's crops, reminders, tasks and harvests — relate only shows them.
//
// The feature is optional: with FARM_API_URL / FARM_API_SECRET unset (or any
// error talking to the farm app) getMyFarmCrops returns [] and the UI simply
// hides, mirroring how the AI features degrade when unconfigured.
//
// Expected farm endpoint (add this to the farm app):
//   GET {FARM_API_URL}?email=<email>
//   Authorization: Bearer {FARM_API_SECRET}
//   -> { "crops": FarmCrop[] }   // the crops on farms that email belongs to

const FARM_API_URL = process.env.FARM_API_URL;
const FARM_API_SECRET = process.env.FARM_API_SECRET;

export type FarmCrop = {
  id: string;
  crop_name: string;
  variety: string | null;
  status: string | null;
  planted_on: string | null;
  expected_harvest_start: string | null;
  expected_harvest_end: string | null;
  estimated_yield_kg: number | null;
  actual_yield_kg: number | null;
  image_url: string | null;
  farm_name: string | null;
};

export function isFarmBridgeConfigured(): boolean {
  return Boolean(FARM_API_URL && FARM_API_SECRET);
}

// The user's crops from the farm app, or [] when the bridge is unconfigured,
// the user has no linked farm account, or the farm app is unreachable.
export async function getMyFarmCrops(email: string | null | undefined): Promise<FarmCrop[]> {
  if (!email) return [];
  if (!isFarmBridgeConfigured()) {
    // Diagnostic: the env vars aren't visible to this deployment (often means a
    // redeploy is needed after setting them, or they were set on the wrong env).
    console.warn("FARM_BRIDGE: not configured — FARM_API_URL / FARM_API_SECRET are unset on this deployment");
    return [];
  }

  try {
    const url = new URL(FARM_API_URL as string);
    url.searchParams.set("email", email);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${FARM_API_SECRET}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`FARM_BRIDGE: farm app returned ${res.status} — ${body.slice(0, 200)}`);
      return [];
    }

    const data: unknown = await res.json();
    const crops = (data as { crops?: unknown })?.crops;
    if (!Array.isArray(crops)) {
      console.error("FARM_BRIDGE: unexpected response shape (no crops array)");
      return [];
    }
    // Success: a count of 0 here means the email matched no active crops on the
    // farm side (usually an email mismatch), not a transport problem.
    console.info(`FARM_BRIDGE: ok — ${crops.length} crop(s) returned for the signed-in email`);
    return crops as FarmCrop[];
  } catch (err) {
    // Never let a farm-app hiccup break the Crop Guides page.
    console.error("FARM_BRIDGE: request failed —", err instanceof Error ? err.message : err);
    return [];
  }
}
