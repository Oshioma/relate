import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ONE_CLICK_BODY, readUnsubscribeToken, unsubscribeSecret, type UnsubscribeTarget } from "@/lib/email-unsubscribe";
import type { NotificationType } from "@/types/database";

// The "Unsubscribe" in every invite, onboarding, welcome and notification
// email (see sendViaResend in src/lib/email.ts).
//
//   POST — does the unsubscribe. Gmail's own "Unsubscribe" button posts here
//          with the body "List-Unsubscribe=One-Click" (RFC 8058) and expects a
//          plain 200; the button on the page below posts here from a browser
//          and gets a page back.
//   GET  — the link at the foot of the email. Only shows a page with a
//          button: mail scanners open every link in an email, so a plain
//          visit must never unsubscribe anyone.
//
// The link is signed (src/lib/email-unsubscribe.ts), so no sign-in is needed
// and nobody can unsubscribe someone else. /api is outside the sign-in
// redirect in src/proxy.ts.

export const dynamic = "force-dynamic";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function page(title: string, bodyHtml: string, status = 200) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:48px 16px;background:#f6f5f1;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2a1f;">
    <main style="max-width:420px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;text-align:center;">
      <h1 style="margin:0 0 12px;font-size:20px;line-height:1.4;">${escapeHtml(title)}</h1>
      ${bodyHtml}
    </main>
  </body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

const badLink = () =>
  page(
    "This link doesn't work",
    `<p style="margin:0;font-size:14px;line-height:1.6;color:#5c665c;">It may have been cut short when it was copied. Try pressing Unsubscribe in the email itself.</p>`,
    400
  );

function readTarget(request: NextRequest): UnsubscribeTarget | null {
  const secret = unsubscribeSecret();
  if (!secret) return null;
  return readUnsubscribeToken(request.nextUrl.searchParams.get("t"), secret);
}

async function communityName(communityId: string): Promise<string | null> {
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("communities").select("name").eq("id", communityId).maybeSingle();
    return data?.name ?? null;
  } catch {
    return null;
  }
}

function whatItStops(target: UnsubscribeTarget, name: string | null) {
  if (target.kind === "community") return name ? `emails from ${name}` : "emails from this community";
  return "this kind of notification email";
}

async function applyUnsubscribe(target: UnsubscribeTarget): Promise<boolean> {
  try {
    const admin = createAdminClient();
    if (target.kind === "community") {
      const { error } = await admin
        .from("community_email_unsubscribes")
        .upsert(
          { community_id: target.communityId, email: target.email.trim().toLowerCase() },
          { onConflict: "community_id,email", ignoreDuplicates: true }
        );
      return !error;
    }
    // Same switch as Settings → Email notifications; the database trigger
    // reads it before sending.
    const { error } = await admin
      .from("notification_email_preferences")
      .upsert(
        { user_id: target.userId, type: target.type as NotificationType, enabled: false },
        { onConflict: "user_id,type" }
      );
    return !error;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const target = readTarget(request);
  if (!target) return badLink();
  const name = target.kind === "community" ? await communityName(target.communityId) : null;
  const action = escapeHtml(`${request.nextUrl.pathname}?t=${encodeURIComponent(request.nextUrl.searchParams.get("t") ?? "")}`);
  return page(
    "Unsubscribe?",
    `<p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#5c665c;">Press the button to stop getting ${escapeHtml(whatItStops(target, name))}.</p>
      <form method="post" action="${action}" style="margin:0;">
        <button type="submit" style="background:#44553f;color:#ffffff;border:0;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;cursor:pointer;">Unsubscribe</button>
      </form>`
  );
}

export async function POST(request: NextRequest) {
  const target = readTarget(request);
  const body = await request.text().catch(() => "");
  const oneClick = body.trim() === ONE_CLICK_BODY;

  if (!target) {
    return oneClick ? new NextResponse("invalid link", { status: 400 }) : badLink();
  }

  const done = await applyUnsubscribe(target);

  if (oneClick) {
    return done ? new NextResponse("unsubscribed", { status: 200 }) : new NextResponse("try again later", { status: 500 });
  }

  if (!done) {
    return page(
      "Something went wrong",
      `<p style="margin:0;font-size:14px;line-height:1.6;color:#5c665c;">You haven't been unsubscribed yet. Please try again in a minute.</p>`,
      500
    );
  }

  const name = target.kind === "community" ? await communityName(target.communityId) : null;
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const settings =
    target.kind === "notification" && site
      ? `<p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#8a938a;">You can switch it back on any time in <a href="${escapeHtml(`${site.replace(/\/+$/, "")}/settings`)}" style="color:#44553f;">your settings</a>.</p>`
      : "";
  return page(
    "You're unsubscribed",
    `<p style="margin:0;font-size:14px;line-height:1.6;color:#5c665c;">You won't get ${escapeHtml(whatItStops(target, name))} any more.</p>${settings}`
  );
}
