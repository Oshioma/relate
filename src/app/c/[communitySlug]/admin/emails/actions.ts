"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCommunityBySlug, getMembership, isCommunityAdmin } from "@/lib/data/community";
import { isResendConfigured, sendCommunityTemplateEmail } from "@/lib/email";
import { EMAIL_TEMPLATE_INFO, firstNameOf, isEmailTemplateKind, renderCommunityEmail } from "@/lib/email-templates";

export type EmailTemplateState = { error: string } | { ok: "saved" | "reset" | "tested"; message: string } | undefined;

const MAX_HTML = 100_000;

function cleanUrl(raw: FormDataEntryValue | null): string | null {
  const value = String(raw ?? "").trim();
  return /^https:\/\//i.test(value) ? value : null;
}

// One action for the email editor's three buttons, told apart by the button's
// `intent`: save the wording, put the standard email back, or send a test of
// what's on screen to the admin's own inbox. Saving and resetting go through
// the RLS-checked client, which only lets this community's owner and admins
// write; the test checks the same thing before sending anything.
export async function saveEmailTemplate(_prev: EmailTemplateState, formData: FormData): Promise<EmailTemplateState> {
  const intent = String(formData.get("intent") ?? "save");
  const communityId = String(formData.get("community_id") ?? "");
  const communitySlug = String(formData.get("community_slug") ?? "");
  const kind = String(formData.get("kind") ?? "");
  if (!isEmailTemplateKind(kind)) return { error: "Unknown email." };

  const subject = String(formData.get("subject") ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, 300);
  const bodyHtml = String(formData.get("body_html") ?? "").trim();
  const footerHtml = String(formData.get("footer_html") ?? "").trim();
  const buttonLabel = String(formData.get("button_label") ?? "").trim().slice(0, 80);
  const enabled = EMAIL_TEMPLATE_INFO[kind].hasToggle ? formData.get("enabled") === "on" : true;
  const logoUrl = cleanUrl(formData.get("logo_url"));
  const bannerUrl = cleanUrl(formData.get("banner_url"));

  if (bodyHtml.length > MAX_HTML || footerHtml.length > MAX_HTML) {
    return { error: "That email is too long to send. Shorten the text, or use fewer pasted pictures." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to be signed in." };

  if (intent === "reset") {
    const { error } = await supabase
      .from("community_email_templates")
      .delete()
      .eq("community_id", communityId)
      .eq("kind", kind);
    if (error) return { error: error.message };
    revalidatePath(`/c/${communitySlug}/admin/emails`);
    return { ok: "reset", message: "Back to the standard Relate email." };
  }

  if (intent === "test") {
    const community = await getCommunityBySlug(supabase, communitySlug);
    if (!community || community.id !== communityId) return { error: "Community not found." };
    const membership = await getMembership(supabase, community.id, user.id);
    if (!isCommunityAdmin(community, membership, user.id)) return { error: "Only this community's admins can send a test." };
    if (!user.email) return { error: "Your account has no email address to send the test to." };
    if (!isResendConfigured()) return { error: "Email sending isn't set up on this site, so a test can't go out." };

    const { data: profile } = await supabase.from("profiles").select("full_name, username").eq("id", user.id).maybeSingle();
    const myName = profile?.full_name || profile?.username || null;
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const email = renderCommunityEmail({
      template: {
        kind,
        subject,
        body_html: bodyHtml,
        footer_html: footerHtml,
        button_label: buttonLabel,
        logo_url: logoUrl,
        banner_url: bannerUrl,
      },
      communityName: community.name,
      communityLogoUrl: community.logo_url,
      values: { firstName: firstNameOf(myName), hostName: myName, hostEmail: user.email },
      buttonUrl: `${site}/c/${community.slug}`,
    });
    const sent = await sendCommunityTemplateEmail({
      to: user.email,
      communityName: community.name,
      subject: `[Test] ${email.subject}`,
      html: email.html,
    });
    if (!sent.ok) return { error: `The test couldn't be sent: ${sent.reason}` };
    return { ok: "tested", message: `Test sent to ${user.email}. It uses your own name for the placeholders.` };
  }

  if (!subject) return { error: "Add a subject line." };
  if (!bodyHtml) return { error: "Add the words of the email." };

  const { data, error } = await supabase
    .from("community_email_templates")
    .upsert(
      {
        community_id: communityId,
        kind,
        enabled,
        subject,
        body_html: bodyHtml,
        footer_html: footerHtml,
        button_label: buttonLabel,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        updated_by: user.id,
      },
      { onConflict: "community_id,kind" }
    )
    .select("kind");
  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "Couldn't save this email — your admin access to this community may have changed. Reload and try again." };
  }

  revalidatePath(`/c/${communitySlug}/admin/emails`);
  return { ok: "saved", message: "Saved. This email now goes out with your wording." };
}
