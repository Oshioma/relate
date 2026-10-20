// A community's own wording for its invite and welcome emails.
//
// Admins write each email in the community admin (Admin → Emails) with the
// usual rich editor: a subject, the words above the button, the button's label,
// a few words under it, and optional logo and banner pictures. A saved row in
// community_email_templates replaces the built-in email for that community; no
// row means the built-in one in src/lib/email.ts still goes out.
//
// Kept free of "server-only" so the placeholder filling and HTML tidying can be
// unit-tested; only src/lib/email.ts (server-only) actually sends anything.

import type { CommunityEmailTemplate, CommunityEmailTemplateKind } from "@/types/database";

export const EMAIL_TEMPLATE_KINDS: CommunityEmailTemplateKind[] = ["invite_new", "invite_existing", "welcome"];

export type EmailPlaceholder = { token: string; meaning: string };

const FIRST_NAME: EmailPlaceholder = { token: "{First_Name}", meaning: "the person's first name" };
const HOST_NAME: EmailPlaceholder = { token: "{Host_Name}", meaning: "the name of whoever sent the invite (their email if they have no name)" };
const HOST_EMAIL: EmailPlaceholder = { token: "{Host_Email}", meaning: "the email address of whoever sent the invite" };
const COMMUNITY_NAME: EmailPlaceholder = { token: "{Community_Name}", meaning: "this community's name" };

export const EMAIL_TEMPLATE_INFO: Record<
  CommunityEmailTemplateKind,
  { title: string; description: string; defaultButton: string; placeholders: EmailPlaceholder[]; hasToggle: boolean }
> = {
  invite_new: {
    title: "Invitation – new to Relate",
    description: "Sent when you invite an email address that doesn't have a Relate account yet.",
    defaultButton: "Accept Invitation",
    placeholders: [FIRST_NAME, HOST_NAME, HOST_EMAIL, COMMUNITY_NAME],
    hasToggle: false,
  },
  invite_existing: {
    title: "Invitation – existing Relate users",
    description: "Sent when you invite someone who already has a Relate account.",
    defaultButton: "Accept Invitation",
    placeholders: [FIRST_NAME, HOST_NAME, HOST_EMAIL, COMMUNITY_NAME],
    hasToggle: false,
  },
  welcome: {
    title: "Welcome email",
    description: "Sent to each new member when they join. Turned off, they get the plain “You joined” email instead.",
    defaultButton: "Go to community",
    placeholders: [FIRST_NAME, COMMUNITY_NAME],
    hasToggle: true,
  },
};

// What the editor starts from before a community has saved its own wording.
// Close to the built-in emails, so saving it unchanged sends much the same.
export const EMAIL_TEMPLATE_STARTERS: Record<
  CommunityEmailTemplateKind,
  { subject: string; body_html: string; footer_html: string; button_label: string }
> = {
  invite_new: {
    subject: "{Host_Name} has invited you to join {Community_Name}",
    body_html: "<p>Hi {First_Name},</p><p>{Host_Name} has invited you to join the {Community_Name} community.</p>",
    footer_html: "<p>If you think you have received this invitation in error, please ignore this email.</p>",
    button_label: "Accept Invitation",
  },
  invite_existing: {
    subject: "{Host_Name} has added you to {Community_Name} on Relate",
    body_html: "<p>Hi {First_Name},</p><p>{Host_Name} has invited you to join {Community_Name} on Relate.</p>",
    footer_html: "<p>If you think you have received this invitation in error, please ignore this email.</p>",
    button_label: "Accept Invitation",
  },
  welcome: {
    subject: "Welcome to {Community_Name}",
    body_html: "<p>Hey {First_Name},</p><p>Welcome to {Community_Name}. Take a look around, and say hello.</p>",
    footer_html: "",
    button_label: "Go to community",
  },
};

export function isEmailTemplateKind(value: string): value is CommunityEmailTemplateKind {
  return (EMAIL_TEMPLATE_KINDS as string[]).includes(value);
}

// Used when we don't know someone's first name (an invite to a bare address).
export const FIRST_NAME_FALLBACK = "friend";

export function firstNameOf(fullName: string | null | undefined): string | null {
  const first = (fullName ?? "").trim().split(/\s+/)[0];
  return first ? first : null;
}

export type PlaceholderValues = {
  firstName?: string | null;
  hostName?: string | null;
  hostEmail?: string | null;
  communityName?: string | null;
};

export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// "{First_Name}", "{first name}", "{FIRST-NAME}" all mean the same thing. So
// does "{Host name and/or host email}", the way the wording was first written.
function placeholderKey(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function valueFor(key: string, values: PlaceholderValues): string | null {
  switch (key) {
    case "first_name":
    case "firstname":
    case "name":
      return values.firstName?.trim() || FIRST_NAME_FALLBACK;
    case "host_name":
    case "hostname":
    case "host":
    case "host_name_and_or_host_email":
    case "host_name_or_host_email":
      return values.hostName?.trim() || values.hostEmail?.trim() || "Someone";
    case "host_email":
      return values.hostEmail?.trim() || values.hostName?.trim() || "";
    case "community_name":
    case "community":
      return values.communityName?.trim() || "";
    default:
      return null;
  }
}

// Swaps {Placeholders} for their values. Unknown ones are left exactly as
// written, so a typo shows up in the test email instead of vanishing. `html`
// escapes the values for an HTML body; leave it off for a subject line.
export function fillPlaceholders(text: string, values: PlaceholderValues, { html = false } = {}): string {
  return text.replace(/\{([^{}]{1,60})\}/g, (whole, inner: string) => {
    const value = valueFor(placeholderKey(inner), values);
    if (value === null) return whole;
    return html ? escapeHtml(value) : value;
  });
}

// Tidies the editor's HTML for an inbox. Admins write it, but it is still
// sent from our domain, so anything that runs code, loads a page or asks for
// input goes; email clients can't play embedded video either, so those go too.
// Pictures get a width cap so a big photo doesn't blow the layout out on a
// phone.
export function sanitizeEmailHtml(html: string): string {
  let out = html;
  out = out.replace(/<!--[\s\S]*?-->/g, "");
  out = out.replace(
    /<(script|style|iframe|object|embed|form|textarea|select|button|video|audio|svg|math|template|noscript|head|title)\b[\s\S]*?<\/\1\s*>/gi,
    ""
  );
  out = out.replace(
    /<\/?(script|style|iframe|object|embed|form|input|textarea|select|button|video|audio|source|track|svg|math|template|noscript|meta|link|base|html|head|body|title)\b[^>]*>/gi,
    ""
  );
  // Event handlers, in any quoting style.
  out = out.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // Links and pictures may only point at the web or an email address.
  out = out.replace(/\s(href|src)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi, (whole, attr: string, _q, dq, sq, bare) => {
    const url = String(dq ?? sq ?? bare ?? "").trim();
    const allowed = attr.toLowerCase() === "href" ? /^(https?:|mailto:|#)/i : /^https:/i;
    return allowed.test(url) ? ` ${attr.toLowerCase()}="${url.replace(/"/g, "&quot;")}"` : "";
  });
  out = out.replace(/<img\b([^>]*?)\s*\/?>/gi, (_whole, attrs: string) => {
    const cleaned = attrs.replace(/\s(style|width|height)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    return `<img${cleaned} style="display:block;max-width:100%;height:auto;margin:12px auto;border-radius:8px;" />`;
  });
  return out.trim();
}

export type RenderedEmail = { subject: string; html: string };

export type RenderCommunityEmailInput = {
  template: Pick<CommunityEmailTemplate, "kind" | "subject" | "body_html" | "footer_html" | "button_label" | "logo_url" | "banner_url">;
  communityName: string;
  communityLogoUrl: string | null;
  values: PlaceholderValues;
  buttonUrl: string;
};

// The whole email: logo, banner, the admin's words, the button, the small print.
export function renderCommunityEmail(input: RenderCommunityEmailInput): RenderedEmail {
  const { template } = input;
  const values = { ...input.values, communityName: input.values.communityName ?? input.communityName };
  const community = escapeHtml(input.communityName);
  const url = escapeHtml(input.buttonUrl);
  const button = escapeHtml(
    fillPlaceholders(template.button_label.trim() || EMAIL_TEMPLATE_INFO[template.kind].defaultButton, values)
  );
  const body = sanitizeEmailHtml(fillPlaceholders(template.body_html, values, { html: true }));
  const footer = sanitizeEmailHtml(fillPlaceholders(template.footer_html, values, { html: true }));

  // A logo chosen for the email is shown as it is (it may be a wordmark); the
  // community's own square logo keeps the round crop the built-in emails use.
  const logoUrl = template.logo_url || input.communityLogoUrl;
  const logo = logoUrl
    ? template.logo_url
      ? `<img src="${escapeHtml(logoUrl)}" alt="${community}" style="display:block;max-width:200px;max-height:96px;width:auto;height:auto;margin:0 auto 20px;" />`
      : `<img src="${escapeHtml(logoUrl)}" alt="${community}" width="72" height="72" style="display:block;border-radius:50%;object-fit:cover;margin:0 auto 20px;" />`
    : "";
  const banner = template.banner_url
    ? `<img src="${escapeHtml(template.banner_url)}" alt="" style="display:block;width:100%;height:auto;margin:0 0 24px;border-radius:8px;" />`
    : "";

  const subject =
    fillPlaceholders(template.subject, values).replace(/[\r\n]+/g, " ").trim() ||
    (template.kind === "welcome" ? `Welcome to ${input.communityName}` : `You're invited to join ${input.communityName}`);

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f6f5f1;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
      ${logo}
      ${banner}
      <div style="font-size:15px;line-height:1.6;color:#1f2a1f;">
        ${body}
      </div>
      <p style="margin:24px 0;text-align:center;">
        <a href="${url}" style="display:inline-block;background:#44553f;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 28px;border-radius:8px;">
          ${button}
        </a>
      </p>
      ${footer ? `<div style="font-size:13px;line-height:1.6;color:#5c665c;">${footer}</div>` : ""}
      <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#8a938a;">
        Or copy this link into your browser:<br />
        <a href="${url}" style="color:#44553f;word-break:break-all;">${url}</a>
      </p>
    </div>
    <p style="max-width:560px;margin:16px auto 0;text-align:center;font-size:11px;color:#a5aca5;">
      Sent by Relate on behalf of ${community}.
    </p>
  </body>
</html>`;

  return { subject, html };
}

// The notification triggers word a member's own "you're in" row like this
// (notify_membership_added and notify_join_request_approved). Those are the
// rows a community's welcome email stands in for; staff "X joined" rows and
// role changes are left alone.
export function isOwnJoinNotificationTitle(title: string): boolean {
  return title.startsWith("You joined ") || title.startsWith("You're now a member of ");
}
