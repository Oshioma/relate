// Review a pasted link for a Books & Media shelf.
//
// Its own route rather than a server action because a web-search run can take
// a minute, and a route can say so (maxDuration). Nothing is written here: the
// review comes back as a draft the form shows, and only "Add to shelf" (a
// server action) writes a row.
//
// Members only, and metered: it spends money.

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { authorizeMediaMember } from "@/lib/media/media-auth";
import { analyseMedia } from "@/lib/ai/analyse-media";
import { findMediaItemByLinkKey } from "@/lib/data/media-items";
import { lessonLinkKey } from "@/lib/school/lesson-link-key";
import { checkAiAllowance } from "@/lib/usage/ai-spend";
import { meteredFor } from "@/lib/usage/ai-meter";

export const maxDuration = 120;

const NO_STORE = { "Cache-Control": "no-store" };
const QUOTA_BUCKET = "media_review";

function dailyLimit(): number {
  const raw = Number(process.env.MEDIA_REVIEWS_PER_DAY);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 40;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400, headers: NO_STORE });
  }

  const payload = body as { spaceId?: unknown; url?: unknown };
  const spaceId = typeof payload.spaceId === "string" ? payload.spaceId : "";
  const url = typeof payload.url === "string" ? payload.url.trim() : "";

  if (!spaceId) return NextResponse.json({ error: "Which space?" }, { status: 400, headers: NO_STORE });
  if (!url) return NextResponse.json({ error: "Paste a link first." }, { status: 400, headers: NO_STORE });
  if (url.length > 2000) return NextResponse.json({ error: "That link is too long." }, { status: 400, headers: NO_STORE });

  const auth = await authorizeMediaMember(supabase, spaceId);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status, headers: NO_STORE });

  // Already on this shelf: answered before anything is spent.
  const key = lessonLinkKey(url);
  if (!key) return NextResponse.json({ error: "That doesn't look like a web address." }, { status: 400, headers: NO_STORE });
  const existing = await findMediaItemByLinkKey(supabase, spaceId, key);
  if (existing) {
    return NextResponse.json(
      { error: `"${existing.title}" is already on this shelf.`, existing: { id: existing.id, title: existing.title } },
      { status: 409, headers: NO_STORE }
    );
  }

  // Per person, per day, across every community — consumed before the model
  // runs and never refunded, same as lessons (see lesson-quota.ts).
  const limit = dailyLimit();
  const { data: withinLimit, error: quotaError } = await supabase.rpc("consume_ai_quota", {
    p_bucket: QUOTA_BUCKET,
    p_identity: `user:${auth.userId}`,
    p_limit: limit,
  });
  if (quotaError) {
    console.error("Could not record media review quota", quotaError);
    return NextResponse.json({ error: "AI reviews aren't available right now — try again shortly." }, { status: 503, headers: NO_STORE });
  }
  if (!withinLimit) {
    return NextResponse.json(
      { error: `That's ${limit} reviews today, which is the daily limit. It resets at midnight UTC. You can still add items by hand.` },
      { status: 429, headers: NO_STORE }
    );
  }

  const allowance = await checkAiAllowance(auth.space.community_id, auth.userId);
  if (!allowance.allowed) {
    return NextResponse.json({ error: allowance.message }, { status: 402, headers: NO_STORE });
  }

  const result = await meteredFor({ communityId: auth.space.community_id, userId: auth.userId }, () => analyseMedia(url));
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422, headers: NO_STORE });
  }

  return NextResponse.json({ analysis: result.analysis, usage: result.usage }, { headers: NO_STORE });
}
