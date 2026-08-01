import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getProfile } from "@/lib/data/profile";
import { getConversationById, getConversationMessages } from "@/lib/data/messages";
import { ConversationView } from "../conversation-view";

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
  const supabase = await createClient();

  const user = await getCurrentUser(supabase);
  if (!user) {
    redirect(`/login?next=/messages/${conversationId}`);
  }

  const conversation = await getConversationById(supabase, conversationId);
  if (!conversation || (conversation.user_one_id !== user.id && conversation.user_two_id !== user.id)) {
    notFound();
  }

  const other = conversation.user_one_id === user.id ? conversation.user_two : conversation.user_one;

  const [messages, profile] = await Promise.all([
    getConversationMessages(supabase, conversationId),
    getProfile(supabase, user.id),
  ]);

  const unreadIds = messages.filter((m) => m.sender_id !== user.id && !m.read).map((m) => m.id);
  if (unreadIds.length > 0) {
    await supabase.from("direct_messages").update({ read: true }).in("id", unreadIds);
  }

  return (
    <ConversationView
      conversationId={conversation.id}
      currentUserId={user.id}
      other={other}
      initialMessages={messages}
      displayName={profile?.full_name || profile?.username}
    />
  );
}
