"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/data/profile";
import { sendContactEmail } from "@/lib/email";

export type ContactState = { error: string } | { ok: true } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Handle a public contact-form submission. Order matters: validate, then store
// the message durably (so nothing is lost if mail is down), then best-effort
// email the support inbox. The recipient address never touches the client — it
// lives only in the server email module.
export async function submitContactForm(_prevState: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: a hidden field real users never see. Bots fill every input, so a
  // non-empty value means a bot — pretend success without doing anything.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { ok: true };
  }

  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const message = String(formData.get("message") ?? "").trim().slice(0, 5000);

  if (!name) return { error: "Please tell us your name." };
  if (!EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (message.length < 10) return { error: "Please write a little more so we can help." };

  // Best-effort rate limit: cap how many messages one email address can leave in
  // a short window. Uses the service-role client since the table is otherwise
  // unreadable to the public.
  const admin = createAdminClient();
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", tenMinutesAgo);
  if ((count ?? 0) >= 3) {
    return { error: "You've sent a few messages just now — please give us a moment to reply before sending more." };
  }

  // Attach the sender's account when they're signed in (the form is open to
  // logged-out visitors too).
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  const { error } = await admin.from("contact_messages").insert({
    user_id: user?.id ?? null,
    name,
    email,
    message,
  });
  if (error) return { error: "Something went wrong saving your message. Please try again." };

  // Fire the email but don't fail the submission if the mailer is down — the
  // message is already safely stored for the team to see.
  await sendContactEmail({ fromName: name, fromEmail: email, message });

  return { ok: true };
}
