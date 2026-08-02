import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Stamp "this participant just looked at the thread" onto the conversation, so
// sendMessage can tell whether the recipient is actively reading and skip the
// email if so. Written with the service-role client because participants have
// no UPDATE grant on conversations (and shouldn't — these markers must not be
// spoofable). Best-effort: a read receipt is never worth failing a page load or
// a message send over, so a missing service-role key or a hiccup is swallowed.
export async function markConversationRead(conversationId: string, userId: string): Promise<void> {
  try {
    const admin = createAdminClient();
    const { data: convo } = await admin
      .from("conversations")
      .select("user_one_id")
      .eq("id", conversationId)
      .maybeSingle();
    if (!convo) return;

    const now = new Date().toISOString();
    const patch = convo.user_one_id === userId ? { user_one_last_read_at: now } : { user_two_last_read_at: now };
    await admin.from("conversations").update(patch).eq("id", conversationId);
  } catch (err) {
    console.warn("[messages] markConversationRead failed:", err);
  }
}
