"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
