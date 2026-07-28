"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getMembership } from "@/lib/data/community";
import { getProfile } from "@/lib/data/profile";
import { isJaasConfigured, getJaasAppId, mintJaasToken } from "@/lib/jitsi";

export type LiveActionResult = { error: string } | { error: null };

// Revalidate the whole space subtree so the list and any open room re-render.
function revalidateSpace(communitySlug: string, spaceSlug: string) {
  revalidatePath(`/c/${communitySlug}/spaces/${spaceSlug}`, "layout");
}

// Postgres error code for a unique-constraint violation — here it means the
// partial index uniq_live_sessions_one_live_per_space already has a live row,
// i.e. a session is already running in this space.
const UNIQUE_VIOLATION = "23505";

// Staff-only (enforced by RLS live_sessions_manage_staff): start a live video
// session. The room name is generated here, never taken from input — it's the
// join secret at the meet.jit.si layer, so it must be long and unguessable.
export async function startLiveSession(input: {
  spaceId: string;
  communityId: string;
  communitySlug: string;
  spaceSlug: string;
  title: string;
}): Promise<LiveActionResult> {
  const title = input.title.trim() || "Live session";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  // A random, per-community-prefixed room name. randomUUID() is 122 bits of
  // entropy — unguessable — and the prefix keeps it clear of unrelated rooms in
  // meet.jit.si's shared namespace.
  const roomName = `relate-${input.communityId.slice(0, 8)}-${randomUUID()}`;

  const { error } = await supabase.from("live_sessions").insert({
    space_id: input.spaceId,
    community_id: input.communityId,
    started_by: user.id,
    title: title.slice(0, 200),
    room_name: roomName,
    status: "live",
  });

  if (error) {
    if (error.code === UNIQUE_VIOLATION) {
      return { error: "A live session is already running in this space." };
    }
    return { error: error.message };
  }

  revalidateSpace(input.communitySlug, input.spaceSlug);
  return { error: null };
}

// What the client needs to open the meeting: either an authenticated JaaS room
// (production) or the public demo server (no JaaS configured — local dev).
export type JitsiTokenResult =
  | { mode: "public" }
  | { mode: "jaas"; appId: string; token: string }
  | { error: string };

// Issues a per-participant JaaS token, gated the same way joining is: the
// viewer must be an active member of the community. Staff get a moderator
// token. Falls back to the public server when JaaS isn't configured, so the
// feature still works in dev without keys.
export async function getJitsiToken(input: { communityId: string; roomName: string }): Promise<JitsiTokenResult> {
  if (!isJaasConfigured()) return { mode: "public" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const membership = await getMembership(supabase, input.communityId, user.id);
  if (!membership || membership.status !== "active") {
    return { error: "Join this community to take part." };
  }

  const moderator =
    membership.role === "owner" || membership.role === "admin" || membership.role === "moderator";
  const profile = await getProfile(supabase, user.id);
  const name = profile?.full_name || profile?.username || "Member";

  const token = mintJaasToken({
    room: input.roomName,
    userId: user.id,
    name,
    moderator,
    email: user.email,
    avatar: profile?.avatar_url,
  });

  return { mode: "jaas", appId: getJaasAppId()!, token };
}

// Staff-only (RLS): end the running session. Idempotent — ending an
// already-ended row simply matches nothing new.
export async function endLiveSession(input: {
  sessionId: string;
  communitySlug: string;
  spaceSlug: string;
}): Promise<LiveActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("live_sessions")
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("id", input.sessionId)
    .eq("status", "live");

  if (error) return { error: error.message };

  revalidateSpace(input.communitySlug, input.spaceSlug);
  return { error: null };
}
