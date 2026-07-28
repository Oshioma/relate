import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getFarmCropsDiagnostic } from "@/lib/farm-bridge";

// TEMPORARY diagnostic — safe to delete. Answers "why is My Crops missing
// crops / images?" by reporting exactly what the shamba.online farm bridge
// returns for the *signed-in* user's email, without leaking the farm API URL
// or secret. Session-gated: it only ever reveals the caller's own farm data.
//
//   GET /api/farm-check
//   -> {
//        configured: true,            // FARM_API_URL / FARM_API_SECRET set?
//        email: "you@example.com",    // the email we asked the farm app about
//        ok: true, httpStatus: 200, error: null,
//        cropCount: 5,                // crops the farm app returned for you
//        cropsWithImage: 3,           // of those, how many carry an image_url
//        cropsWithoutImage: 2,        // the rest render the placeholder sprout
//        crops: [{ id, crop_name, farm_name, image_url }, ...]
//      }
//
// Reading it:
//   - cropCount lower than what you see in shamba.online -> the farm app is
//     filtering by your email; crops added under another account/email are not
//     "yours" and never reach relate.
//   - cropsWithoutImage > 0 -> those crops arrived but with image_url null, so
//     relate shows the sprout placeholder; each crop carries at most one image.
//   - ok:false with an error/httpStatus -> the bridge is unconfigured or the
//     farm app rejected the call; the UI silently falls back to empty.
//
// force-dynamic so the answer reflects the live env and a live farm-app call.
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const diagnostic = await getFarmCropsDiagnostic(user.email);
  return NextResponse.json(diagnostic);
}
