import type { SupabaseClient } from "@supabase/supabase-js";
import { isPlatformHost, platformSubdomainSlug } from "@/lib/custom-domain";
import type { AuthEventSource, Database } from "@/types/database";

// Signup and sign-in analytics: the app can't see which community an account
// belongs to at the moment it is created (there is no community field on
// either form), so it passes along the context it DOES have — the invite code,
// the /c/<slug> the visitor came from, or the host they used — and the database
// resolves that to a community id (auth_event_community_id in the
// auth_events migration). Doing the resolution there means a private
// community, or one behind an unaccepted invite, attributes just as well as a
// public one.

export type AuthEventContext = {
  source: AuthEventSource;
  path: string;
  host: string | null;
  communitySlug: string | null;
  inviteCode: string | null;
};

// Derive the context from where the auth form was submitted: `next` is the
// post-auth destination (/invite/<code>, /c/<slug>/..., or a plain path) and
// `host` is the host the request arrived on. Order matters — an invite link is
// the strongest signal, then an explicit community path, then the host itself,
// which on a community's own domain or subdomain is the only signal there is.
export function authEventContext(next: string, host: string | null): AuthEventContext {
  const base: AuthEventContext = { source: "platform", path: next, host, communitySlug: null, inviteCode: null };

  const invite = next.match(/^\/invite\/([^/?#]+)/);
  if (invite) {
    return { ...base, source: "invite", inviteCode: safeDecode(invite[1]) };
  }

  const community = next.match(/^\/c\/([^/?#]+)/);
  if (community) {
    return { ...base, source: "community_page", communitySlug: safeDecode(community[1]).toLowerCase() };
  }

  if (host) {
    // <slug>.<platform-apex> resolves entirely from the hostname, so hand the
    // database the slug directly; a verified custom domain it looks up itself.
    const subdomainSlug = platformSubdomainSlug(host);
    if (subdomainSlug) return { ...base, source: "subdomain", communitySlug: subdomainSlug };
    if (!isPlatformHost(host)) return { ...base, source: "custom_domain" };
  }

  return base;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// The user-metadata keys the signup form attaches so the auth.users trigger can
// record the signup with its community context. Metadata is client-influenced,
// so these are only ever used for attribution — never to grant access.
export function signupContextMetadata(context: AuthEventContext) {
  return {
    signup_source: context.source,
    signup_path: context.path,
    signup_host: context.host ?? "",
    signup_community_slug: context.communitySlug ?? "",
    signup_invite_code: context.inviteCode ?? "",
  };
}

// Record a sign-in (or an email confirmation) for the CURRENTLY signed-in user.
// Runs through the record_auth_event RPC on the caller's own client — the
// function only ever writes a row for auth.uid(), so no service-role key is
// needed and a misconfigured environment can't silently drop the whole log.
// Analytics must never break authentication, so every failure is logged and
// swallowed.
export async function recordAuthEvent(
  supabase: SupabaseClient<Database>,
  eventType: "login" | "email_confirmed",
  context: AuthEventContext
): Promise<void> {
  const { error } = await supabase.rpc("record_auth_event", {
    p_event_type: eventType,
    p_source: context.source,
    p_path: context.path,
    p_host: context.host ?? "",
    p_community_slug: context.communitySlug ?? "",
    p_invite_code: context.inviteCode ?? "",
  });
  if (error) {
    console.error(`[auth-events] failed to record ${eventType}:`, error);
  }
}
