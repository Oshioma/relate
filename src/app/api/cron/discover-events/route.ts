import { createAdminClient } from "@/lib/supabase/admin";
import { discoverEventsWithAI } from "@/lib/ai/discover-events";
import { buildDiscoveredEventRows } from "@/lib/data/events";

// Each community's discovery involves several AI web searches, so a run can
// take a few minutes. Vercel Cron invokes this weekly (see vercel.json).
export const maxDuration = 300;

const MAX_COMMUNITIES_PER_RUN = 5;

type RunResult = { community: string; imported?: number; found?: number; error?: string };

// Weekly auto-discovery: for each place-based community (location_name set),
// search the web for upcoming events and import new ones automatically,
// attributed to the community owner. Runs with the service-role client since
// there's no user session — authorization is the CRON_SECRET check below.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ error: "CRON_SECRET is not configured." }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: communities, error } = await supabase
    .from("communities")
    .select("id, slug, name, owner_id, location_name")
    .not("location_name", "is", null)
    .order("created_at", { ascending: true })
    .limit(MAX_COMMUNITIES_PER_RUN);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const results: RunResult[] = [];

  for (const community of communities ?? []) {
    if (!community.location_name) continue;

    const { data: upcoming, error: eventsError } = await supabase
      .from("events")
      .select("title")
      .eq("community_id", community.id)
      .gte("start_time", new Date().toISOString());

    if (eventsError) {
      results.push({ community: community.slug, error: eventsError.message });
      continue;
    }

    const existingTitles = (upcoming ?? []).map((e) => e.title);
    const result = await discoverEventsWithAI({ locationName: community.location_name, existingTitles });

    if (result.status !== "ok") {
      // Missing key, exhausted credit, or API failure affects every
      // community — record the cause and stop early.
      results.push({ community: community.slug, error: `AI discovery unavailable: ${result.status}` });
      break;
    }

    const seen = new Set(existingTitles.map((t) => t.toLowerCase()));
    const fresh = result.events.filter((e) => !seen.has(e.title.toLowerCase()));
    const rows = buildDiscoveredEventRows(fresh, { communityId: community.id, createdBy: community.owner_id });

    if (rows.length === 0) {
      results.push({ community: community.slug, found: result.events.length, imported: 0 });
      continue;
    }

    const { error: insertError } = await supabase.from("events").insert(rows);
    results.push(
      insertError
        ? { community: community.slug, error: insertError.message }
        : { community: community.slug, found: result.events.length, imported: rows.length },
    );
  }

  return Response.json({ ok: true, results });
}
