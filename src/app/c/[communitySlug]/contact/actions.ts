"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/data/profile";

export type CommunityContactState = { error: string } | { ok: true } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Handle a submission from a community's own contact page. Stores the message
// (scoped to the community) and drops an in-app notification into the community
// owner's inbox — which the existing email/push triggers also mirror. Open to
// signed-out visitors; the community id is trusted from the form but every use
// of it is re-resolved server-side.
export async function submitCommunityContact(
  _prevState: CommunityContactState,
  formData: FormData
): Promise<CommunityContactState> {
  // Honeypot — a hidden field only bots fill. Pretend success, do nothing.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { ok: true };
  }

  const communityId = String(formData.get("community_id") ?? "");
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const message = String(formData.get("message") ?? "").trim().slice(0, 5000);

  if (!communityId) return { error: "Something went wrong. Please try again." };
  if (!name) return { error: "Please tell us your name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (message.length < 10) return { error: "Please write a little more so they can help." };

  const admin = createAdminClient();

  // Resolve the community (and its owner) server-side rather than trusting the
  // form — this is who the message is addressed to and who gets notified.
  const { data: community } = await admin
    .from("communities")
    .select("id, slug, name, owner_id")
    .eq("id", communityId)
    .maybeSingle();
  if (!community) return { error: "This community couldn't be found." };

  // Best-effort rate limit: cap messages per email to this community in a short
  // window.
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .eq("community_id", community.id)
    .gte("created_at", tenMinutesAgo);
  if ((count ?? 0) >= 3) {
    return { error: "You've sent a few messages just now — please give them a moment to reply before sending more." };
  }

  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  const { error } = await admin.from("contact_messages").insert({
    community_id: community.id,
    user_id: user?.id ?? null,
    name,
    email,
    message,
  });
  if (error) return { error: "Something went wrong saving your message. Please try again." };

  // Land it in the owner's in-app inbox. The email_notification / push triggers
  // mirror this row to their email and phone. Best-effort: the message is
  // already stored, so a failed notification never loses it.
  const preview = message.length > 140 ? `${message.slice(0, 140)}…` : message;
  await admin.from("notifications").insert({
    user_id: community.owner_id,
    community_id: community.id,
    type: "contact",
    title: `New contact message for ${community.name}`,
    body: `${name} (${email}): ${preview}`,
    link: `/c/${community.slug}/inbox`,
  });

  return { ok: true };
}
