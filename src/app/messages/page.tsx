import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/profile";
import { getConversations } from "@/lib/data/messages";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeTime } from "@/lib/utils";

export default async function MessagesPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (!user) {
    redirect("/login?next=/messages");
  }

  const conversations = await getConversations(supabase, user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href="/dashboard" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">Messages</h1>

      {conversations.length === 0 ? (
        <EmptyState
          icon={<Mail className="h-6 w-6" />}
          title="No conversations yet"
          description="Message a fellow member from their profile to start a conversation."
        />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-muted"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar
                    src={conversation.other.avatar_url}
                    name={conversation.other.full_name || conversation.other.username}
                    size={40}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {conversation.other.full_name || conversation.other.username}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">@{conversation.other.username}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {conversation.last_message_at && (
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(conversation.last_message_at)}</span>
                  )}
                  {conversation.unreadCount > 0 && <Badge tone="accent">{conversation.unreadCount}</Badge>}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
