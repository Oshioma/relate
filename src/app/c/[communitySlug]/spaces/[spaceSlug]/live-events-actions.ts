"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
