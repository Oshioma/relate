import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { runEventDiscovery } from "@/lib/events/run-discovery";

// Webhook target for the weekly event-discovery cron (see the
// weekly_event_discovery migration). Postgres posts one community id per
// request; we re-check it's a place community with the weekly run on, then run
// the same AI discovery as the staff "Discover events" button, acting as the
// community's owner (who is charged the AI spend and shown as the creator).
//
// Authenticated by the shared notification webhook secret — the caller is
// Postgres, not a browser.

// Discovery caps itself at ~150s; leave headroom for image matching.
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const secret = process.env.NOTIFICATION_EMAIL_WEBHOOK_SECRET;
  if (!secret || request.headers.get("x-notification-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let communityId: string | undefined;
  try {
    communityId = ((await request.json()) as { communityId?: string }).communityId;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  if (!communityId) return NextResponse.json({ error: "missing communityId" }, { status: 400 });

  const admin = createAdminClient();
  const { data: community } = await admin
    .from("communities")
    .select("id, slug, name, location_name, owner_id, template_key, weekly_event_discovery")
    .eq("id", communityId)
    .maybeSingle();
  if (!community) return NextResponse.json({ error: "community not found" }, { status: 404 });
  if (community.template_key !== "place" || !community.weekly_event_discovery) {
    return NextResponse.json({ ok: true, skipped: "not-enabled" });
  }

  const result = await runEventDiscovery(admin, community, community.owner_id);
  if ("error" in result) {
    console.error(`[weekly-event-discovery] ${community.slug}: ${result.error}`);
    return NextResponse.json({ ok: false, error: result.error });
  }

  if (result.imported > 0) revalidatePath(`/c/${community.slug}/events`);
  return NextResponse.json({ ok: true, imported: result.imported });
}
