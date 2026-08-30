"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifiedCommunityHost } from "@/lib/verified-community-host";

// The "Continue" press on the bridge interstitial. Being a Server Action
// (origin-checked POST) rather than a GET is part of the security model: a
// third-party page can navigate someone to /auth/bridge, but it can never
// press this button for them, so a token is only ever minted after a person
// has read which community — and which domain — they're continuing to.
export async function continueToCommunityHost(formData: FormData): Promise<void> {
  const nextRaw = String(formData.get("next") ?? "");
  const next = nextRaw.startsWith("/") ? nextRaw : "/";

  // Re-validate the host on the POST — the hidden field is as forgeable as
  // the query param was. Only another face of this app can ever receive the
  // token.
  const host = await verifiedCommunityHost(String(formData.get("host") ?? ""));
  if (!host) {
    redirect("/login");
  }

  const headerList = await headers();
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  // Where this attempt lands on the community host when no token can be
  // minted: /auth/bridge/finish without a token records "bridge tried" and
  // falls through to that host's own sign-in.
  const fallbackUrl = `${proto}://${host}/auth/bridge/finish?next=${encodeURIComponent(next)}`;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    redirect(fallbackUrl);
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    // No service-role key configured — the bridge can't mint tokens, so the
    // member signs in on the community host the ordinary way.
    redirect(fallbackUrl);
  }

  // Mint a magic-link token WITHOUT sending any email — the same
  // generateLink + token_hash pattern the branded signup/recovery emails
  // use. The action_link itself is ignored; redirectTo only has to satisfy
  // the allowlist, so reuse the platform confirm route like the other flows.
  const platformOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${headerList.get("host") ?? ""}`;
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: user.email,
    options: { redirectTo: `${platformOrigin}/auth/confirm` },
  });

  if (error || !data?.properties?.hashed_token) {
    if (error) console.error("[auth/bridge] generateLink failed:", error);
    redirect(fallbackUrl);
  }

  const target = new URL(`${proto}://${host}/auth/bridge/finish`);
  target.searchParams.set("token_hash", data.properties.hashed_token);
  target.searchParams.set("next", next);
  redirect(target.toString());
}
