import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Diagnostic: reports ONLY whether the farm-bridge env vars are visible to
// relate's production runtime (booleans — never the values). Open
// /api/farm-bridge-health in a browser to confirm the "My crops" bridge is
// configured. Safe to leave in place; reveals no secrets.
export function GET() {
  return NextResponse.json({
    farmApiUrlSet: Boolean(process.env.FARM_API_URL),
    farmApiSecretSet: Boolean(process.env.FARM_API_SECRET),
    farmAppUrlSet: Boolean(process.env.NEXT_PUBLIC_FARM_APP_URL),
  });
}
