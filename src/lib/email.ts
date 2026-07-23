import "server-only";

// Community-branded transactional email via Resend's REST API. Used for
// invite emails so they arrive as "Mzungu Zanzibar <invites@relate.click>"
// with the community's own name and logo, instead of Supabase Auth's global
// one-template-fits-all "from Relate" email. No SDK — one fetch call.
//
// Configuration (all optional; when RESEND_API_KEY is absent callers fall
// back to Supabase's inviteUserByEmail path):
//   RESEND_API_KEY     — from resend.com, requires the sending domain verified
//   INVITE_EMAIL_FROM  — sender address, e.g. invites@relate.click; defaults
//                        to invites@<NEXT_PUBLIC_SITE_URL's hostname>

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function defaultFromAddress(): string | null {
  if (process.env.INVITE_EMAIL_FROM) return process.env.INVITE_EMAIL_FROM;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return null;
  try {
    return `invites@${new URL(siteUrl).hostname}`;
  } catch {
    return null;
  }
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export type InviteEmailInput = {
  to: string;
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

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Display name is the community; the address stays on the verified
        // platform domain so DKIM/SPF keep passing.
        from: `${input.communityName.replace(/[<>@"]/g, "")} <${fromAddress}>`,
        to: [input.to],
        subject: `You're invited to join ${input.communityName}`,
        html,
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
