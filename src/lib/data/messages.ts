import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Conversation, DirectMessage, Profile } from "@/types/database";

type Client = SupabaseClient<Database>;

type ConversationRow = Conversation & { user_one: Profile; user_two: Profile };

export type ConversationSummary = Conversation & { other: Profile; unreadCount: number };

// RLS already restricts `conversations` rows to ones the caller
// participates in, so no extra `.eq` for the current user is needed here.
export async function getConversations(supabase: Client, userId: string): Promise<ConversationSummary[]> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*, user_one:user_one_id (*), user_two:user_two_id (*)")
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) throw error;

  const conversations = (data ?? []) as unknown as ConversationRow[];
  if (conversations.length === 0) return [];

  const { data: unread, error: unreadError } = await supabase
    .from("direct_messages")
    .select("conversation_id")
    .in(
      "conversation_id",
      conversations.map((c) => c.id)
    )
    .eq("read", false)
    .neq("sender_id", userId);

  if (unreadError) throw unreadError;

  const unreadCounts = new Map<string, number>();
  for (const row of unread ?? []) {
    unreadCounts.set(row.conversation_id, (unreadCounts.get(row.conversation_id) ?? 0) + 1);
  }

  return conversations.map((conv) => ({
    ...conv,
    other: conv.user_one_id === userId ? conv.user_two : conv.user_one,
    unreadCount: unreadCounts.get(conv.id) ?? 0,
  }));
}

export async function getConversationById(supabase: Client, conversationId: string): Promise<ConversationRow | null> {
  const { data, error } = await supabase
    .from("conversations")
    .select("*, user_one:user_one_id (*), user_two:user_two_id (*)")
    .eq("id", conversationId)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ConversationRow | null;
}

export type MessageWithSender = DirectMessage & { sender: Profile };

export async function getConversationMessages(supabase: Client, conversationId: string): Promise<MessageWithSender[]> {
  const { data, error } = await supabase
    .from("direct_messages")
    .select("*, sender:sender_id (*)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as MessageWithSender[];
}

// Total unread DMs across every conversation the caller is in — used for
// the nav badge. `head: true` skips fetching rows, just the count.
export async function getUnreadMessageCount(supabase: Client, userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("direct_messages")
    .select("id", { count: "exact", head: true })
    .eq("read", false)
    .neq("sender_id", userId);

  if (error) throw error;
  return count ?? 0;
}
