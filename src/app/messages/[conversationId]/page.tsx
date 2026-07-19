import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getConversationById, getConversationMessages } from "@/lib/data/messages";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import { MessageComposer } from "../message-composer";

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

  const messages = await getConversationMessages(supabase, conversationId);

  const unreadIds = messages.filter((m) => m.sender_id !== user.id && !m.read).map((m) => m.id);
  if (unreadIds.length > 0) {
    await supabase.from("direct_messages").update({ read: true }).in("id", unreadIds);
  }

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col px-4 sm:px-6">
      <div className="flex items-center gap-3 border-b border-border py-4">
        <Link href="/messages" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Avatar src={other.avatar_url} name={other.full_name || other.username} size={32} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{other.full_name || other.username}</p>
          <p className="truncate text-xs text-muted-foreground">@{other.username}</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Say hello 👋</p>
        ) : (
          messages.map((message) => {
            const isMine = message.sender_id === user.id;
            return (
              <div key={message.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3.5 py-2 text-sm",
                    isMine ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{message.body}</p>
                  <p className={cn("mt-1 text-[10px] opacity-70")}>{formatRelativeTime(message.created_at)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <MessageComposer conversationId={conversation.id} />
    </div>
  );
}
