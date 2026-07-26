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
  return fetchFarmCropsForEmail(email);
}

// One member's shared farm: their display info plus the crops the bridge
// returned for them. Emails are resolved server-side and never included here.
export type PublicFarm = {
  profileId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  crops: FarmCrop[];
};

// The public farms to render for a browsing member: fetches each opted-in
// member's crops from the bridge in parallel and drops anyone whose farm turned
// up empty (unlinked account, unreachable app). Returns [] when the bridge is
// unconfigured.
export async function getPublicFarmCrops(
  farmers: { profileId: string; username: string; fullName: string | null; avatarUrl: string | null; email: string }[]
): Promise<PublicFarm[]> {
  if (farmers.length === 0 || !isFarmBridgeConfigured()) return [];

  const farms = await Promise.all(
    farmers.map(async (f) => ({
      profileId: f.profileId,
      username: f.username,
      fullName: f.fullName,
      avatarUrl: f.avatarUrl,
      crops: await fetchFarmCropsForEmail(f.email),
    }))
  );

  return farms.filter((f) => f.crops.length > 0);
}

// Shared fetch: the crops the farm app has for one email, or [] on any failure.
async function fetchFarmCropsForEmail(email: string | null | undefined): Promise<FarmCrop[]> {
  if (!email || !isFarmBridgeConfigured()) return [];

  try {
    const url = new URL(FARM_API_URL as string);
    url.searchParams.set("email", email);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${FARM_API_SECRET}` },
      cache: "no-store",
    });
    if (!res.ok) return [];

    const data: unknown = await res.json();
    const crops = (data as { crops?: unknown })?.crops;
    return Array.isArray(crops) ? (crops as FarmCrop[]) : [];
  } catch {
    // Never let a farm-app hiccup break the Crop Guides page.
    return [];
  }
}
