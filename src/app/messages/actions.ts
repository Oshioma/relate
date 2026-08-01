"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/profile";
import { isJaasConfigured, getJaasAppId, mintJaasToken } from "@/lib/jitsi";

export type StartConversationResult = { conversationId: string | null; error: string | null };

export async function startConversation(otherUserId: string): Promise<StartConversationResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { conversationId: null, error: "You need to be signed in." };
  }

  if (user.id === otherUserId) {
    return { conversationId: null, error: "You can't message yourself." };
  }

  const [userOneId, userTwoId] = user.id < otherUserId ? [user.id, otherUserId] : [otherUserId, user.id];

  const { data: existing, error: selectError } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_one_id", userOneId)
    .eq("user_two_id", userTwoId)
    .maybeSingle();

  if (selectError) {
    return { conversationId: null, error: selectError.message };
  }

  if (existing) {
    return { conversationId: existing.id, error: null };
  }

  const { data: created, error: insertError } = await supabase
    .from("conversations")
    .insert({ user_one_id: userOneId, user_two_id: userTwoId })
    .select("id")
    .single();

  if (insertError) {
    return { conversationId: null, error: "You can't start a conversation with this member." };
  }

  return { conversationId: created.id, error: null };
}

export type SendMessageResult = { error: string | null };

export async function sendMessage(conversationId: string, body: string): Promise<SendMessageResult> {
  const trimmed = body.trim();
  if (!trimmed) {
    return { error: "Write something first." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const { error } = await supabase.from("direct_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: trimmed,
  });

  if (error) {
    return { error: "That message couldn't be sent. You may have been blocked." };
  }

  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
  return { error: null };
}

// -----------------------------------------------------------------------------
// Video calls inside the chat
//
// A call is a special direct_messages row (kind = "call") so it rides the same
// feed, RLS, realtime stream and unread machinery as any other message. The
// room name is the join secret at the video layer, so it's always minted here
// server-side — never accepted from the client.
// -----------------------------------------------------------------------------

// randomUUID() is 122 bits of entropy — unguessable — and the "relate-dm"
// prefix keeps DM rooms clear of the community "relate-<id>" event rooms in the
// video provider's namespace.
function newCallRoom(): string {
  return `relate-dm-${randomUUID()}`;
}

async function requireParticipant(conversationId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, ok: false as const };

  const { data: conversation } = await supabase
    .from("conversations")
    .select("user_one_id, user_two_id")
    .eq("id", conversationId)
    .maybeSingle();

  const ok =
    !!conversation && (conversation.user_one_id === user.id || conversation.user_two_id === user.id);
  return { supabase, user, ok };
}

export type StartCallResult = { roomName: string | null; error: string | null };

// Start a call now: drops a joinable "started a video call" invite into the
// chat. Returns the room so the host can open it immediately.
export async function startVideoCall(conversationId: string): Promise<StartCallResult> {
  const { supabase, user, ok } = await requireParticipant(conversationId);
  if (!user) return { roomName: null, error: "You need to be signed in." };
  if (!ok) return { roomName: null, error: "You're not part of this conversation." };

  const roomName = newCallRoom();
  const { error } = await supabase.from("direct_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: "Started a video call",
    kind: "call",
    call_room: roomName,
    call_status: "active",
  });

  if (error) {
    return { roomName: null, error: "That call couldn't be started. You may have been blocked." };
  }

  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
  return { roomName, error: null };
}

// Schedule a call for later: drops a "video call scheduled" card into the chat
// with the time and an optional note. Members can join once it's time.
export async function scheduleVideoCall(
  conversationId: string,
  scheduledStart: string,
  note?: string
): Promise<{ error: string | null }> {
  const startMs = Date.parse(scheduledStart);
  if (Number.isNaN(startMs)) return { error: "Pick a date and time for the call." };
  if (startMs < Date.now() - 60_000) return { error: "Pick a time in the future." };

  const { supabase, user, ok } = await requireParticipant(conversationId);
  if (!user) return { error: "You need to be signed in." };
  if (!ok) return { error: "You're not part of this conversation." };

  const trimmedNote = note?.trim().slice(0, 200);
  const { error } = await supabase.from("direct_messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: trimmedNote || "Scheduled a video call",
    kind: "call",
    call_room: newCallRoom(),
    call_status: "scheduled",
    call_scheduled_at: new Date(startMs).toISOString(),
  });

  if (error) {
    return { error: "That call couldn't be scheduled. You may have been blocked." };
  }

  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
  return { error: null };
}

// Cancel a call invite (either participant). Idempotent — a row that's already
// cancelled simply stays cancelled.
export async function cancelVideoCall(messageId: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  const { data: updated, error } = await supabase
    .from("direct_messages")
    .update({ call_status: "cancelled" })
    .eq("id", messageId)
    .eq("kind", "call")
    .select("conversation_id")
    .maybeSingle();

  if (error) return { error: error.message };
  if (updated) {
    revalidatePath(`/messages/${updated.conversation_id}`);
    revalidatePath("/messages");
  }
  return { error: null };
}

// Mark the other participant's messages as read. The conversation page already
// does this on load; this lets the client clear the badge when new messages
// arrive live over the realtime stream.
export async function markMessagesRead(conversationId: string): Promise<{ error: string | null }> {
  const { supabase, user, ok } = await requireParticipant(conversationId);
  if (!user || !ok) return { error: null };

  await supabase
    .from("direct_messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .eq("read", false);

  revalidatePath("/messages");
  return { error: null };
}

// What the client needs to open a call embed: an authenticated JaaS room in
// production, or the public demo server when JaaS isn't configured (local dev).
// Mirrors the community live-events token shape so <JitsiRoom> can consume it.
export type CallTokenResult =
  | { mode: "public" }
  | { mode: "jaas"; appId: string; token: string }
  | { error: string };

// Issues a per-participant JaaS token, gated exactly like joining the chat is:
// the caller must be a participant of this conversation, and the room must
// belong to a call in it. Both participants join as moderators (it's a 1:1).
export async function getCallToken(input: {
  conversationId: string;
  roomName: string;
}): Promise<CallTokenResult> {
  if (!isJaasConfigured()) return { mode: "public" };

  const { supabase, user, ok } = await requireParticipant(input.conversationId);
  if (!user) return { error: "You need to be signed in." };
  if (!ok) return { error: "You're not part of this conversation." };

  // The room must actually be a call in this conversation — stops a valid
  // participant from minting a token for an arbitrary room name.
  const { data: call } = await supabase
    .from("direct_messages")
    .select("id")
    .eq("conversation_id", input.conversationId)
    .eq("kind", "call")
    .eq("call_room", input.roomName)
    .maybeSingle();
  if (!call) return { error: "That call is no longer available." };

  const profile = await getProfile(supabase, user.id);
  const name = profile?.full_name || profile?.username || "Member";

  const token = mintJaasToken({
    room: input.roomName,
    userId: user.id,
    name,
    moderator: true,
    email: user.email,
    avatar: profile?.avatar_url,
  });

  return { mode: "jaas", appId: getJaasAppId()!, token };
}
