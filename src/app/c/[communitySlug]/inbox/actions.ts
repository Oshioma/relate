"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/data/profile";
import { getCommunityBySlug, getMembership } from "@/lib/data/community";
import { sendNotificationEmail } from "@/lib/email";
import type { ContactMessageReply } from "@/types/database";

// Flag one of a community's contact-form submissions handled / unhandled from
// the staff inbox.
//
// contact_messages deliberately has no client write policy (the table is
// written only by the trusted contact server action), so the update goes
// through the service-role client — which means the staff check has to happen
// here rather than in RLS. The .eq("community_id") on the update is the second
// half of that gate: even with a forged id, a staff member can only ever flip a
// message addressed to their own community. Returning the updated rows lets us
// tell "wrote nothing" apart from "wrote" instead of reporting a silent no-op
// as success.
export async function setCommunityContactMessageHandled(
  communitySlug: string,
  messageId: string,
  handled: boolean
): Promise<{ error: string } | undefined> {
  const gate = await requireCommunityStaff(communitySlug);
  if (!gate.ok) return { error: gate.error };
  const { community } = gate;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("contact_messages")
    .update({ handled })
    .eq("id", messageId)
    .eq("community_id", community.id)
    .select("id");
  if (error) return { error: error.message };
  if (!data || data.length === 0) return { error: "That message is no longer in this inbox. Reload and try again." };

  revalidatePath(`/c/${community.slug}/inbox`);
  return undefined;
}

// Shared staff gate for the inbox actions: signed in, and an active owner or
// admin of this community. contact_messages has no client write policy, so
// every write below goes through the service-role client and this check — plus
// an .eq("community_id") on the write itself — is what stands in for RLS.
async function requireCommunityStaff(communitySlug: string) {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return { ok: false, error: "You need to be signed in." } as const;

  const community = await getCommunityBySlug(supabase, communitySlug);
  if (!community) return { ok: false, error: "Community not found." } as const;

  const membership = await getMembership(supabase, community.id, user.id);
  const isStaff = membership?.status === "active" && (membership.role === "owner" || membership.role === "admin");
  if (!isStaff) return { ok: false, error: "Only this community's owner and admins can manage its messages." } as const;

  return { ok: true, user, community } as const;
}

export type ReplyResult =
  | { error: string }
  // The saved reply comes back so the inbox can show it without a round trip.
  // `warning` is for a reply that was stored but couldn't be delivered — the
  // sender left no account to notify and the mailer is off or refused it.
  | { ok: true; reply: ContactMessageReply; warning?: string };

// Answer a contact-form message from the community inbox.
//
// The reply is stored first — that's the durable record, and it must survive a
// mailer outage — then delivered: a sender who was signed in when they wrote
// gets an in-app notification (whose existing email and push triggers mirror it
// to their inbox and phone), and a signed-out sender, who has no account to
// notify, gets the reply emailed to the address they left.
//
// Replying marks the message handled: it's the thing "handled" was tracking,
// and leaving it open after an answer just means triaging it twice. Reopen
// still works if the exchange isn't over.
export async function replyToCommunityContactMessage(
  communitySlug: string,
  messageId: string,
  body: string
): Promise<ReplyResult> {
  const trimmed = body.trim().slice(0, 5000);
  if (!trimmed) return { error: "Write a reply first." };

  const gate = await requireCommunityStaff(communitySlug);
  if (!gate.ok) return { error: gate.error };
  const { user, community } = gate;

  const admin = createAdminClient();

  // Re-read the message through the service-role client, pinned to this
  // community: a forged id can only ever reach a message addressed here.
  const { data: message } = await admin
    .from("contact_messages")
    .select("id, user_id, name, email")
    .eq("id", messageId)
    .eq("community_id", community.id)
    .maybeSingle();
  if (!message) return { error: "That message is no longer in this inbox. Reload and try again." };

  const { data: reply, error: replyError } = await admin
    .from("contact_message_replies")
    .insert({
      message_id: message.id,
      community_id: community.id,
      author_id: user.id,
      body: trimmed,
    })
    .select("*")
    .single();
  if (replyError || !reply) return { error: "That reply couldn't be saved. Please try again." };

  // Answered — take it off the open pile. Best-effort: the reply is already
  // sent, so a failed flag must not read as a failed reply.
  await admin.from("contact_messages").update({ handled: true }).eq("id", message.id).eq("community_id", community.id);

  const warning = await deliverReply({
    recipientUserId: message.user_id,
    recipientEmail: message.email,
    communityId: community.id,
    communityName: community.name,
    communitySlug: community.slug,
    authorId: user.id,
    // The staff member's own name isn't part of this: the reply comes from the
    // community, which is who the sender wrote to.
    body: trimmed,
  });

  revalidatePath(`/c/${community.slug}/inbox`);
  return warning ? { ok: true, reply, warning } : { ok: true, reply };
}

// Get the reply in front of the person who wrote in. Returns a warning string
// when it could only be stored, never throws: the reply is already saved by the
// time this runs, so nothing here may turn a successful reply into an error.
async function deliverReply(input: {
  recipientUserId: string | null;
  recipientEmail: string;
  communityId: string;
  communityName: string;
  communitySlug: string;
  authorId: string;
  body: string;
}): Promise<string | undefined> {
  const preview = input.body.length > 300 ? `${input.body.slice(0, 300)}…` : input.body;

  if (input.recipientUserId) {
    try {
      const admin = createAdminClient();
      const { error } = await admin.from("notifications").insert({
        user_id: input.recipientUserId,
        community_id: input.communityId,
        type: "contact_reply",
        title: `${input.communityName} replied to your message`,
        body: preview,
        link: `/c/${input.communitySlug}`,
        actor_id: input.authorId,
      });
      if (error) throw error;
      return undefined;
    } catch (err) {
      console.warn("[inbox] contact reply notification failed:", err);
      return "Your reply is saved, but the notification to them didn't send.";
    }
  }

  // No account behind this message — they wrote in signed out, so email is the
  // only way back to them.
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const sent = await sendNotificationEmail({
    to: input.recipientEmail,
    subject: `Re: your message to ${input.communityName}`,
    heading: `${input.communityName} replied to your message`,
    body: input.body,
    ctaLabel: `Visit ${input.communityName}`,
    ctaUrl: `${base}/c/${input.communitySlug}`,
    communityName: input.communityName,
  });
  if (!sent.ok) {
    console.warn("[inbox] contact reply email failed:", sent.reason);
    return "Your reply is saved, but the email to them didn't send. Try again in a moment.";
  }
  return undefined;
}
