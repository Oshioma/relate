import "server-only";
import { inlineEmailImages } from "@/lib/email-templates";
import { createAdminClient } from "@/lib/supabase/admin";
import { htmlToText } from "@/lib/email-text";
import {
  ONE_CLICK_BODY,
  makeUnsubscribeToken,
  unsubscribeSecret,
  unsubscribeUrl,
  type UnsubscribeTarget,
} from "@/lib/email-unsubscribe";

// Community-branded transactional email via Resend's REST API. Used for two
// messages so they arrive as "Mzungu Zanzibar <invites@relate.click>" with the
// community's own name and logo, instead of Supabase Auth's global
// one-template-fits-all "from Relate" email:
//   1. invite emails (sendCommunityInviteEmail), and
//   2. signup confirmation emails (sendCommunityConfirmationEmail), which are
//      community-branded when the signup has community context and plainly
//      "Relate" when it doesn't — see that function for why every
//      confirmation now goes out this way rather than through Supabase's
//      default template.
// No SDK — one fetch call.
//
// Configuration (all optional; when RESEND_API_KEY is absent callers fall
// back to Supabase's default auth-email path):
//   RESEND_API_KEY     — from resend.com, requires the sending domain verified
//   INVITE_EMAIL_FROM  — sender address, e.g. invites@relate.click; defaults
//                        to invites@<NEXT_PUBLIC_SITE_URL's hostname>

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

// Sender address for an inbox on the verified sending domain. `mailbox` is the
// local part ("invites", "notifications"); `override` lets a caller pin the
// full address through an env var. Returns null when there's no way to know the
// hostname (no override and no NEXT_PUBLIC_SITE_URL).
function fromAddressFor(mailbox: string, override?: string): string | null {
  if (override) return override;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return null;
  try {
    return `${mailbox}@${new URL(siteUrl).hostname}`;
  } catch {
    return null;
  }
}

function defaultFromAddress(): string | null {
  return fromAddressFor("invites", process.env.INVITE_EMAIL_FROM);
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// -----------------------------------------------------------------------------
// The one place an email leaves the site. Every message gets:
//   - a plain-text part made from its HTML (HTML-only mail is a spam signal
//     to Gmail, and some readers only show text), and
//   - for mail people didn't directly ask for (invites, onboarding, welcome,
//     notifications), a one-click List-Unsubscribe header plus a visible
//     "Unsubscribe" link at the foot. Gmail expects both from senders like us
//     and files mail without them as spam far more often.
// Sign-in, password, payment and contact-form emails are transactional and go
// out without an unsubscribe: nobody can opt out of their own password reset.
// -----------------------------------------------------------------------------
type ResendPayload = {
  from: string;
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
  attachments?: unknown[];
};

type SendResult = { ok: true } | { ok: false; reason: string };

// Has this address pressed "Unsubscribe" on this community's emails? A lookup
// that fails (table not there yet, no service key) never blocks a send.
async function hasUnsubscribedFromCommunity(communityId: string, email: string): Promise<boolean> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("community_email_unsubscribes")
      .select("email")
      .eq("community_id", communityId)
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();
    if (error) return false;
    return Boolean(data);
  } catch {
    return false;
  }
}

function unsubscribeLinkFor(target: UnsubscribeTarget): string | null {
  const secret = unsubscribeSecret();
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!secret || !site || !/^https?:\/\//.test(site)) return null;
  return unsubscribeUrl(site, makeUnsubscribeToken(target, secret));
}

function withUnsubscribeFooter(html: string, link: string, target: UnsubscribeTarget): string {
  const words =
    target.kind === "community" ? "Don't want these emails?" : "Don't want emails like this?";
  const footer = `<p style="max-width:520px;margin:12px auto 0;text-align:center;font-size:11px;line-height:1.6;color:#a5aca5;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">${words} <a href="${escapeHtml(link)}" style="color:#8a938a;text-decoration:underline;">Unsubscribe</a></p>`;
  const end = html.toLowerCase().lastIndexOf("</body>");
  return end === -1 ? `${html}${footer}` : `${html.slice(0, end)}${footer}\n  ${html.slice(end)}`;
}

async function sendViaResend(apiKey: string, payload: ResendPayload, unsubscribe?: UnsubscribeTarget): Promise<SendResult> {
  let html = payload.html;
  let headers: Record<string, string> | undefined;

  if (unsubscribe) {
    if (unsubscribe.kind === "community" && (await hasUnsubscribedFromCommunity(unsubscribe.communityId, unsubscribe.email))) {
      return { ok: false, reason: "they've unsubscribed from this community's emails" };
    }
    const link = unsubscribeLinkFor(unsubscribe);
    if (link) {
      headers = { "List-Unsubscribe": `<${link}>`, "List-Unsubscribe-Post": ONE_CLICK_BODY };
      html = withUnsubscribeFooter(html, link, unsubscribe);
    }
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        html,
        text: htmlToText(html),
        ...(headers ? { headers } : {}),
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      return { ok: false, reason: body?.message ?? `Resend responded ${res.status}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: "couldn't reach the Resend API" };
  }
}

export type InviteEmailInput = {
  to: string;
  communityId: string;
  communityName: string;
  communityLogoUrl: string | null;
  inviterName: string | null;
  inviteUrl: string;
};

export async function sendCommunityInviteEmail(
  input: InviteEmailInput
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY is not configured" };
  const fromAddress = defaultFromAddress();
  if (!fromAddress) return { ok: false, reason: "no sender address — set INVITE_EMAIL_FROM or NEXT_PUBLIC_SITE_URL" };

  const name = escapeHtml(input.communityName);
  const inviter = input.inviterName ? escapeHtml(input.inviterName) : null;
  const url = escapeHtml(input.inviteUrl);

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f6f5f1;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:420px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;text-align:center;">
      ${
        input.communityLogoUrl
          ? `<img src="${escapeHtml(input.communityLogoUrl)}" alt="" width="72" height="72" style="border-radius:50%;object-fit:cover;margin-bottom:16px;" />`
          : ""
      }
      <h1 style="margin:0 0 8px;font-size:20px;color:#1f2a1f;">You're invited to ${name}</h1>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5c665c;">
        ${inviter ? `${inviter} has invited you` : "You've been invited"} to join the ${name} community.
      </p>
      <a href="${url}" style="display:inline-block;background:#44553f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">
        Join ${name}
      </a>
      <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#8a938a;">
        Or copy this link into your browser:<br />
        <a href="${url}" style="color:#44553f;word-break:break-all;">${url}</a>
      </p>
    </div>
    <p style="max-width:420px;margin:16px auto 0;text-align:center;font-size:11px;color:#a5aca5;">
      Sent by Relate on behalf of ${name}. If you weren't expecting this, you can ignore it.
    </p>
  </body>
</html>`;

  return sendViaResend(apiKey, {
    // Display name is the community; the address stays on the verified
    // platform domain so DKIM/SPF keep passing.
    from: `${input.communityName.replace(/[<>@"]/g, "")} <${fromAddress}>`,
    to: [input.to],
    subject: `You're invited to join ${input.communityName}`,
    html,
  }, { kind: "community", communityId: input.communityId, email: input.to });
}

// -----------------------------------------------------------------------------
// A community's own email, written in Admin → Emails and already put together
// by renderCommunityEmail (src/lib/email-templates.ts): its invites and its
// welcome. Sent from the invites mailbox under the community's name, like the
// built-in invite above.
export type CommunityTemplateEmailInput = {
  to: string;
  communityId: string;
  communityName: string;
  subject: string;
  html: string;
};

export async function sendCommunityTemplateEmail(
  input: CommunityTemplateEmailInput
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY is not configured" };
  const fromAddress = defaultFromAddress();
  if (!fromAddress) return { ok: false, reason: "no sender address — set INVITE_EMAIL_FROM or NEXT_PUBLIC_SITE_URL" };
  const inline = inlineEmailImages(input.html);

  return sendViaResend(apiKey, {
    from: `${input.communityName.replace(/[<>@"]/g, "") || "Relate"} <${fromAddress}>`,
    to: [input.to],
    subject: input.subject,
    // The logo, banner and any pictures in the words travel inside the
    // email, so inboxes that block linked pictures still show them.
    html: inline.html,
    ...(inline.attachments.length > 0 ? { attachments: inline.attachments } : {}),
  }, { kind: "community", communityId: input.communityId, email: input.to });
}

// -----------------------------------------------------------------------------
export type ConfirmationEmailInput = {
  to: string;
  // Branding is optional, exactly like the password-reset email below. A
  // signup that carries community context (an invite link, a /c/<slug> page,
  // a community's own domain) is dressed in that community's name and logo;
  // a bare platform signup gets a plain "Relate" message. Both are sent this
  // same way — see the note on the app-minted link below for why there is no
  // longer an unbranded path that falls back to Supabase's own template.
  communityName: string | null;
  communityLogoUrl: string | null;
  confirmUrl: string;
};

// The signup-confirmation counterpart to sendCommunityInviteEmail. It carries
// an /auth/confirm URL with token_hash + type, minted server-side by
// admin.generateLink (see trySendAppMintedConfirmation).
//
// That link shape is the whole point, not just the branding. Supabase Auth's
// default "Confirm signup" template links to GoTrue's /verify endpoint, which
// SPENDS the one-time token on a plain GET and then bounces to the app with a
// PKCE `?code=`. Two things break there, and both surfaced as "that link is
// invalid or expired" on a link the member had only just been sent:
//   1. Mail scanners and inbox prefetchers (Outlook Safe Links, Proofpoint,
//      Gmail, antivirus) GET every URL in an incoming message. That GET burns
//      the token at GoTrue before the human ever clicks, and no interstitial
//      on our side can prevent it — the spending happens on Supabase's host.
//   2. The `?code=` exchange needs a code-verifier cookie from the very
//      browser that submitted the signup form, so opening the email on a
//      different device fails even when nothing pre-spent the link.
// A token_hash link carries no per-browser state and is only ever spent by the
// POST behind our /auth/confirm button, so it survives both.
export async function sendCommunityConfirmationEmail(
  input: ConfirmationEmailInput
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY is not configured" };
  const fromAddress = defaultFromAddress();
  if (!fromAddress) return { ok: false, reason: "no sender address — set INVITE_EMAIL_FROM or NEXT_PUBLIC_SITE_URL" };

  const brand = input.communityName ? escapeHtml(input.communityName) : "Relate";
  const url = escapeHtml(input.confirmUrl);

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f6f5f1;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:420px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;text-align:center;">
      ${
        input.communityLogoUrl
          ? `<img src="${escapeHtml(input.communityLogoUrl)}" alt="" width="72" height="72" style="border-radius:50%;object-fit:cover;margin-bottom:16px;" />`
          : ""
      }
      <h1 style="margin:0 0 8px;font-size:20px;color:#1f2a1f;">
        ${input.communityName ? `Confirm your email to join ${brand}` : "Confirm your email"}
      </h1>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5c665c;">
        ${
          input.communityName
            ? `You're almost in — confirm your email address to finish joining the ${brand} community.`
            : "You're almost in — confirm your email address to finish setting up your Relate account."
        }
      </p>
      <a href="${url}" style="display:inline-block;background:#44553f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">
        Confirm email
      </a>
      <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#8a938a;">
        Or copy this link into your browser:<br />
        <a href="${url}" style="color:#44553f;word-break:break-all;">${url}</a>
      </p>
    </div>
    <p style="max-width:420px;margin:16px auto 0;text-align:center;font-size:11px;color:#a5aca5;">
      Sent by Relate${input.communityName ? ` on behalf of ${brand}` : ""}. If you didn't create this account, you can ignore it.
    </p>
  </body>
</html>`;

  return sendViaResend(apiKey, {
    // Display name is the community; the address stays on the verified
    // platform domain so DKIM/SPF keep passing.
    from: `${(input.communityName ?? "Relate").replace(/[<>@"]/g, "") || "Relate"} <${fromAddress}>`,
    to: [input.to],
    subject: input.communityName
      ? `Confirm your email to join ${input.communityName}`
      : "Confirm your email address",
    html,
  });
}

// -----------------------------------------------------------------------------
export type CheckoutSignInEmailInput = {
  to: string;
  communityName: string;
  communityLogoUrl: string | null;
  // What they bought ("Escape Space Community"), for the message.
  itemName: string | null;
  signInUrl: string;
};

// Sent after a guest checkout (a signed-out visitor buying from a shareable
// link) whose email already had an account. The payment is already on that
// account; this is the only way in, because Stripe never checks that the email
// belongs to whoever typed it. Same token_hash + /auth/confirm link shape as the
// confirmation email above, so scanners can't spend it.
export async function sendCheckoutSignInEmail(
  input: CheckoutSignInEmailInput
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY is not configured" };
  const fromAddress = defaultFromAddress();
  if (!fromAddress) return { ok: false, reason: "no sender address — set INVITE_EMAIL_FROM or NEXT_PUBLIC_SITE_URL" };

  const brand = escapeHtml(input.communityName);
  const item = input.itemName ? escapeHtml(input.itemName) : null;
  const url = escapeHtml(input.signInUrl);

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f6f5f1;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:420px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;text-align:center;">
      ${
        input.communityLogoUrl
          ? `<img src="${escapeHtml(input.communityLogoUrl)}" alt="" width="72" height="72" style="border-radius:50%;object-fit:cover;margin-bottom:16px;" />`
          : ""
      }
      <h1 style="margin:0 0 8px;font-size:20px;color:#1f2a1f;">You're in at ${brand}</h1>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5c665c;">
        Thanks for your payment${item ? ` for ${item}` : ""}. It's on your existing account. Press the button to sign in and start.
      </p>
      <a href="${url}" style="display:inline-block;background:#44553f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">
        Sign in to ${brand}
      </a>
      <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#8a938a;">
        Or copy this link into your browser:<br />
        <a href="${url}" style="color:#44553f;word-break:break-all;">${url}</a>
      </p>
    </div>
    <p style="max-width:420px;margin:16px auto 0;text-align:center;font-size:11px;color:#a5aca5;">
      Sent by Relate on behalf of ${brand}. If you didn't make this payment, you can ignore this email.
    </p>
  </body>
</html>`;

  return sendViaResend(apiKey, {
    from: `${input.communityName.replace(/[<>@"]/g, "") || "Relate"} <${fromAddress}>`,
    to: [input.to],
    subject: `Sign in to ${input.communityName}`,
    html,
  });
}

// -----------------------------------------------------------------------------
export type PasswordResetEmailInput = {
  to: string;
  // Branding is optional: a reset requested on a community's custom domain is
  // dressed in that community's name and logo; a bare platform reset falls back
  // to a plain "Relate" message.
  communityName: string | null;
  communityLogoUrl: string | null;
  resetUrl: string;
};

// Password-reset email sent the same direct-Resend way as invites and signup
// confirmations. The link is an /auth/confirm URL with token_hash + type —
// minted server-side by admin.generateLink (see requestPasswordReset). That is
// deliberately NOT Supabase's default recovery email: the default routes
// through GoTrue's /verify endpoint and a PKCE `?code=` exchange that needs a
// code-verifier cookie from the very browser that requested the reset, so it
// silently fails when the email is opened on another device. A token_hash link
// carries no such state and works anywhere.
export async function sendPasswordResetEmail(
  input: PasswordResetEmailInput
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY is not configured" };
  const fromAddress = defaultFromAddress();
  if (!fromAddress) return { ok: false, reason: "no sender address — set INVITE_EMAIL_FROM or NEXT_PUBLIC_SITE_URL" };

  const brand = input.communityName ? escapeHtml(input.communityName) : "Relate";
  const url = escapeHtml(input.resetUrl);
  const forName = input.communityName ? ` for ${brand}` : "";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f6f5f1;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:420px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;text-align:center;">
      ${
        input.communityLogoUrl
          ? `<img src="${escapeHtml(input.communityLogoUrl)}" alt="" width="72" height="72" style="border-radius:50%;object-fit:cover;margin-bottom:16px;" />`
          : ""
      }
      <h1 style="margin:0 0 8px;font-size:20px;color:#1f2a1f;">Reset your password</h1>
      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5c665c;">
        Tap below to choose a new password${forName}. If you didn't ask for this, you can safely ignore this email — your password won't change.
      </p>
      <a href="${url}" style="display:inline-block;background:#44553f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">
        Reset password
      </a>
      <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#8a938a;">
        Or copy this link into your browser:<br />
        <a href="${url}" style="color:#44553f;word-break:break-all;">${url}</a>
      </p>
    </div>
    <p style="max-width:420px;margin:16px auto 0;text-align:center;font-size:11px;color:#a5aca5;">
      Sent by Relate${input.communityName ? ` on behalf of ${brand}` : ""}.
    </p>
  </body>
</html>`;

  return sendViaResend(apiKey, {
    from: `${(input.communityName ?? "Relate").replace(/[<>@"]/g, "") || "Relate"} <${fromAddress}>`,
    to: [input.to],
    subject: input.communityName ? `Reset your ${input.communityName} password` : "Reset your password",
    html,
  });
}

// -----------------------------------------------------------------------------
// Generic in-app-notification email
//
// The in-app notification (bell) is created by a DB trigger; this is the email
// counterpart, sent from server actions for events worth an inbox ping (e.g. a
// business-directory ownership claim). Best-effort by design: callers treat a
// failure as non-fatal, since the in-app notification still landed.
//   NOTIFICATION_EMAIL_FROM — sender address; defaults to
//                             notifications@<NEXT_PUBLIC_SITE_URL's hostname>
// -----------------------------------------------------------------------------
export type NotificationEmailInput = {
  to: string;
  subject: string;
  heading: string;
  body?: string | null;
  ctaLabel: string;
  ctaUrl: string;
  communityName?: string | null;
  // What the email's "Unsubscribe" turns off: for a member's notification
  // email, their id and the notification type. Left out for direct replies,
  // which go out without an unsubscribe.
  unsubscribe?: UnsubscribeTarget;
};

export async function sendNotificationEmail(
  input: NotificationEmailInput
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY is not configured" };
  const fromAddress = fromAddressFor("notifications", process.env.NOTIFICATION_EMAIL_FROM);
  if (!fromAddress) return { ok: false, reason: "no sender address — set NOTIFICATION_EMAIL_FROM or NEXT_PUBLIC_SITE_URL" };

  const heading = escapeHtml(input.heading);
  const preview = input.body ? escapeHtml(input.body) : null;
  const url = escapeHtml(input.ctaUrl);
  const ctaLabel = escapeHtml(input.ctaLabel);
  const community = input.communityName ? escapeHtml(input.communityName) : null;
  const fromName = (input.communityName ?? "Relate").replace(/[<>@"]/g, "") || "Relate";

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f6f5f1;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:420px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
      <h1 style="margin:0 0 12px;font-size:18px;line-height:1.4;color:#1f2a1f;">${heading}</h1>
      ${preview ? `<p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5c665c;">${preview}</p>` : ""}
      <a href="${url}" style="display:inline-block;background:#44553f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">
        ${ctaLabel}
      </a>
      <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#8a938a;">
        Or copy this link into your browser:<br />
        <a href="${url}" style="color:#44553f;word-break:break-all;">${url}</a>
      </p>
    </div>
    <p style="max-width:420px;margin:16px auto 0;text-align:center;font-size:11px;color:#a5aca5;">
      Sent by Relate${community ? ` on behalf of ${community}` : ""}. Manage these in your notification settings.
    </p>
  </body>
</html>`;

  return sendViaResend(apiKey, {
    from: `${fromName} <${fromAddress}>`,
    to: [input.to],
    subject: input.subject,
    html,
  }, input.unsubscribe);
}

// -----------------------------------------------------------------------------
// Contact-form email
//
// The public /contact form sends here, to the platform support inbox. The
// recipient is deliberately NOT exposed to the browser — it lives only in this
// server module (CONTACT_EMAIL_TO, defaulting to the support address). Resend's
// reply_to is set to the submitter so the team can reply straight from the
// email. Best-effort: the server action has already stored the message in the
// database, so a mail failure never loses it.
//   CONTACT_EMAIL_TO   — where submissions go; defaults to relate@guestlist.net
//   CONTACT_EMAIL_FROM — sender address; defaults to contact@<site hostname>,
//                        then falls back to the invites sender.
// -----------------------------------------------------------------------------
export type PlanLapsedEmailInput = {
  to: string;
  communityName: string;
  communityLogoUrl: string | null;
  planName: string;
  // 'payment_failed' when Stripe couldn't take the money and is retrying,
  // 'canceled' when the owner ended the plan themselves.
  reason: "payment_failed" | "canceled";
  // End of the grace window, already formatted for a human.
  graceUntilLabel: string | null;
  manageUrl: string;
};

// Tells an owner their plan stopped paying, while there is still time to do
// something about it. The point of the message is the grace window: nothing has
// switched off yet, here is when it would, and here is exactly what would go.
export async function sendPlanLapsedEmail(
  input: PlanLapsedEmailInput
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY is not configured" };

  const fromAddress = fromAddressFor("billing", process.env.BILLING_EMAIL_FROM) ?? defaultFromAddress();
  if (!fromAddress) return { ok: false, reason: "no sender address — set BILLING_EMAIL_FROM or NEXT_PUBLIC_SITE_URL" };

  const community = escapeHtml(input.communityName);
  const plan = escapeHtml(input.planName);
  const logo = input.communityLogoUrl
    ? `<img src="${escapeHtml(input.communityLogoUrl)}" alt="" width="48" height="48" style="display:block;margin:0 auto 16px;border-radius:12px;" />`
    : "";

  const headline =
    input.reason === "payment_failed"
      ? `We couldn't take payment for ${community}'s ${plan} plan`
      : `${community}'s ${plan} plan has ended`;

  const opening =
    input.reason === "payment_failed"
      ? `The card on file was declined, so we'll keep retrying. Nothing has changed for ${community} yet.`
      : `Thanks for having been on ${plan}. Nothing has changed for ${community} yet.`;

  const deadline = input.graceUntilLabel
    ? `Everything keeps working as it is until <strong>${escapeHtml(input.graceUntilLabel)}</strong>.`
    : `Everything keeps working as it is for now.`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f6f5f1;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
      ${logo}
      <h1 style="margin:0 0 12px;font-size:18px;line-height:1.4;color:#1f2a1f;text-align:center;">${escapeHtml(headline)}</h1>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#5c665c;">${escapeHtml(opening)} ${deadline}</p>
      <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#5c665c;">After that, ${community} moves to the Free plan, which means:</p>
      <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;line-height:1.6;color:#5c665c;">
        <li>Paid spaces and memberships stop taking <strong>new</strong> subscribers.</li>
        <li>New members are capped at the Free plan's limit.</li>
      </ul>
      <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#5c665c;">
        Your community, everything in it, and every member stay exactly as they are — and everyone already subscribed
        keeps their subscription and their access. Nothing is deleted, ever.
      </p>
      <p style="margin:0;text-align:center;">
        <a href="${escapeHtml(input.manageUrl)}" style="display:inline-block;padding:12px 20px;background:#1f2a1f;color:#ffffff;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">
          ${input.reason === "payment_failed" ? "Update billing" : "Choose a plan"}
        </a>
      </p>
    </div>
    <p style="max-width:520px;margin:16px auto 0;text-align:center;font-size:11px;color:#a5aca5;">
      You're getting this because you manage ${community} on Relate.
    </p>
  </body>
</html>`;

  return sendViaResend(apiKey, {
    from: `Relate billing <${fromAddress}>`,
    to: [input.to],
    subject: headline,
    html,
  });
}

export type ContactEmailInput = {
  fromName: string;
  fromEmail: string;
  message: string;
};

export async function sendContactEmail(
  input: ContactEmailInput
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY is not configured" };

  const to = process.env.CONTACT_EMAIL_TO || "relate@guestlist.net";
  const fromAddress = fromAddressFor("contact", process.env.CONTACT_EMAIL_FROM) ?? defaultFromAddress();
  if (!fromAddress) return { ok: false, reason: "no sender address — set CONTACT_EMAIL_FROM or NEXT_PUBLIC_SITE_URL" };

  const name = escapeHtml(input.fromName);
  const email = escapeHtml(input.fromEmail);
  // Keep the submitter's line breaks in the email body.
  const message = escapeHtml(input.message).replace(/\n/g, "<br />");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f6f5f1;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
      <h1 style="margin:0 0 12px;font-size:18px;line-height:1.4;color:#1f2a1f;">New contact-form message</h1>
      <p style="margin:0 0 6px;font-size:14px;color:#5c665c;"><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <div style="margin:16px 0 0;padding:16px;background:#f6f5f1;border-radius:8px;font-size:14px;line-height:1.6;color:#1f2a1f;">
        ${message}
      </div>
    </div>
    <p style="max-width:520px;margin:16px auto 0;text-align:center;font-size:11px;color:#a5aca5;">
      Sent from the Relate contact form. Reply directly to reach ${name}.
    </p>
  </body>
</html>`;

  return sendViaResend(apiKey, {
    from: `Relate contact <${fromAddress}>`,
    to: [to],
    reply_to: input.fromEmail,
    subject: `Contact form: ${input.fromName}`,
    html,
  });
}
